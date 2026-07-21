// 機械QAスイート(Phase 1 再現性基盤)。1コマンド実行: `npm test`(または node tests/qa.mjs)
// - HP.verify.all() / 全内蔵プリセットのスモーク / i18n / few-shot / BH捕捉 / 互換 /
//   インポート4形式+ID重複 / seed再現性 / 新サンプル挙動 / 🪐の長時間挙動(QA_FAST=1 で省略)
// - v1.15(第7次裁定): バージョン同期 / スライダー範囲整合 / 外部要素バッジ / おすすめA/B / 🌌平坦化の定量判定
// - 結果は tests/out/qa-results.json に機械可読で保存(CI が artifact 化)
// - 1件でも FAIL なら exit code 1
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// P2(beta 運用): QA_TARGET で検査対象を切替可能(例: QA_TARGET=beta/index.html npm test)。
// 既定は従来どおり index.html — CI の挙動は不変。
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
const FAST = process.env.QA_FAST === '1';

async function getBrowser() {
  // CI: playwright(npm install でブラウザ管理)。ローカル: playwright-core + 既存 Chromium も可。
  // どちらも無い環境では PLAYWRIGHT_CORE_DIR(playwright-core 入り node_modules を持つディレクトリ)を指定。
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  // v1.16: await を付けて launch 失敗(同梱ブラウザとの版ずれ等)を捕捉し、次の経路へ確実に落とす
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) {
    const { createRequire } = await import('node:module');
    const { chromium } = createRequire(path.join(dir, 'noop.js'))('playwright-core');
    return chromium.launch({ executablePath: exe });
  }
  throw new Error('playwright が見つかりません。`npm install` を実行するか PLAYWRIGHT_CORE_DIR を指定してください');
}

const results = [];
const add = (id, pass, detail) => {
  results.push({ id, pass: !!pass, detail: String(detail ?? '') });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? '  ' + detail : ''}`);
};

// ---- 0) 構文検査(node --check)----
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  const tmp = path.join(OUT_DIR, '_extracted.js');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(tmp, m ? m[1] : 'throw new Error("no script")');
  try { execSync(`node --check ${JSON.stringify(tmp)}`, { stdio: 'pipe' }); add('syntax', true, ''); }
  catch (e) { add('syntax', false, String(e.stderr || e)); }
}

// ---- 0b) バージョン同期(v1.15 第7次裁定 P0-1): APP_VERSION と package.json の major.minor 一致 ----
{
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const m = html.match(/const APP_VERSION = "([^"]+)"/);
  add('version.sync', !!m && pkg.version.startsWith(m[1] + '.'),
    `APP_VERSION=${m && m[1]} package.json=${pkg.version}`);
}

// ---- 0c) スライダー範囲(v1.15 第7次裁定 P0-2): 内蔵プリセットの physics 値がスライダー上限内 ----
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const defs = {};
  for (const mm of html.matchAll(/\{key:"(\w+)",\s*label:[^}]*?lo:([\d.eE+-]+),\s*hi:([\d.eE+-]+)/g))
    defs[mm[1]] = { lo: +mm[2], hi: +mm[3] };
  const over = [];
  const presets = html.match(/const BUILTIN_PRESETS = \[([\s\S]*?)\n\];/)[1];
  for (const mm of presets.matchAll(/physics:\{([\s\S]*?)\}/g))
    for (const kv of mm[1].matchAll(/(\w+):\s*(-?[\d.eE+-]+)/g)) {
      // v1.27(公開前レビュー P1-2): 上限だけでなく下限・非数も検査。
      // 0 は「機能OFF」の正規状態(G=0・D0=0・etaRad=0 等。対数スライダーの lo>0 とは別に
      // 直接入力・プリセットで設定可能)なので下限検査から除外する。
      if (!defs[kv[1]]) continue;
      const v = +kv[2];
      if (!Number.isFinite(v)) over.push(`${kv[1]}=${kv[2]} (NaN/Inf)`);
      else if (v > defs[kv[1]].hi) over.push(`${kv[1]}=${kv[2]}>${defs[kv[1]].hi}`);
      else if (v !== 0 && v < defs[kv[1]].lo) over.push(`${kv[1]}=${kv[2]}<${defs[kv[1]].lo}`);
    }
  add('slider.covers-builtins', over.length === 0, over.slice(0, 5).join(' '));

  // ---- v1.27(公開前レビュー P1-1): SYSTEM_PROMPT の physics キー集合 = 正規21キー ----
  {
    const KEYS = ['G', 'D0', 'kFrame', 'q', 'kRep', 'muF', 'gammaN', 'kappaS', 'Kt', 'cLight', 'bM',
      'etaRad', 'pRad', 'gravityX', 'gravityY', 'geoPN', 'lambdaPN', 'pnAlpha',
      'radiusScale', 'softening', 'timeScale'];
    const sp = html.match(/const SYSTEM_PROMPT\s*=\s*`([\s\S]*?)`/);
    const missDefaults = [], missShot = [];
    if (sp) {
      const defaultsLine = (sp[1].match(/既定値: ([^\n]+)/) || [, ''])[1];
      for (const k of KEYS) if (!new RegExp(`\\b${k}=`).test(defaultsLine)) missDefaults.push(k);
      const shots = [...sp[1].matchAll(/"physics":\{([\s\S]*?)\}/g)];
      shots.forEach((s, i) => { for (const k of KEYS) if (!s[1].includes(`"${k}"`)) missShot.push(`shot${i + 1}:${k}`); });
    }
    add('prompt.physics-keys', !!sp && missDefaults.length === 0 && missShot.length === 0,
      `defaults欠落=[${missDefaults.join(',')}] few-shot欠落=[${missShot.slice(0, 6).join(',')}]`);
  }
}

// ---- 0d) 内蔵プリセットの physics 完全明示(v1.18 第8次裁定): 21キー全指定+件数がREADMEと一致 ----
// (v1.21 第9次裁定 P0-1: 1PN 3キー geoPN/lambdaPN/pnAlpha を追加し 18→21 キー)
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const KEYS = ['G', 'D0', 'kFrame', 'q', 'kRep', 'muF', 'gammaN', 'kappaS', 'Kt', 'cLight', 'bM',
    'etaRad', 'pRad', 'gravityX', 'gravityY', 'geoPN', 'lambdaPN', 'pnAlpha',
    'radiusScale', 'softening', 'timeScale'];
  const block = html.match(/const BUILTIN_PRESETS = \[([\s\S]*?)\n\];/)[1];
  const missing = [];
  let nPhys = 0;
  for (const mm of block.matchAll(/physics:\{([\s\S]*?)\}/g)) {
    nPhys++;
    const have = new Set([...mm[1].matchAll(/(\w+)\s*:/g)].map(x => x[1]));
    for (const k of KEYS) if (!have.has(k)) missing.push(`#${nPhys}:${k}`);
  }
  add('builtin.explicit-physics', nPhys > 0 && missing.length === 0, missing.slice(0, 6).join(' '));
  // v1.24(原仮定者指示): サンプル総数は変わりやすいため、ドキュメントに固定数を書かない。
  // README がプリセット総数を数値で謳っていないことを検査する(旧 builtin.count の置き換え)
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
  const counted = readme.match(/\d+\s*の内蔵シミュレーション|\d+\s*built-?in simulations/i);
  add('docs.no-preset-count', !counted, counted ? `README に総数記載: ${counted[0]}` : '');
  // v1.25(第10次裁定 P1): QA 項目数も増減するため README に固定数を書かない
  // (更新履歴の過去記録「QA 104/104」等は対象外 — 現在形の総数宣言のみ検出)
  const qaCounted = readme.match(/全機械QA\(\d+項目\)|全\d+項目\(約/);
  add('docs.no-qa-count', !qaCounted, qaCounted ? `README に QA 総数記載: ${qaCounted[0]}` : '');
  // v1.25(第10次裁定 P0-5): PHYSICS §6 のサンプル表が全内蔵プリセット ID を含む(機械同期)
  const phys6 = fs.readFileSync(path.join(ROOT, 'docs', 'PHYSICS.md'), 'utf8');
  const ids = [...block.matchAll(/\{ id:"(\w+)"/g)].map(x => x[1]);
  const absent = ids.filter(id => !phys6.includes(`| ${id} |`));
  add('docs.preset-table-sync', ids.length > 0 && absent.length === 0,
    absent.length ? `PHYSICS §6 に不在: ${absent.join(' ')}` : `${ids.length} ids`);
}

// ---- 0e) ドキュメント同期(v1.18): PHYSICS.md の既定表に一様重力がある ----
{
  const phys = fs.readFileSync(path.join(ROOT, 'docs', 'PHYSICS.md'), 'utf8');
  add('docs.gravity-params', phys.includes('gravityX') && phys.includes('gravityY'), '');
}

const browser = await getBrowser();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') pageErrors.push(m.text()); });
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

// ---- 1) HP.verify.all() ----
for (const v of await page.evaluate(() => HP.verify.all().map(v => ({ id: v.id, pass: v.pass, detail: v.detail })))) {
  add('verify.' + v.id, v.pass, v.detail);
}

// ---- 2) 全内蔵プリセット起動スモーク(120フレーム・NaNなし)----
for (const id of await page.evaluate(() => HP.allPresets().filter(p => !String(p.id).startsWith('custom_')).map(p => p.id))) {
  const r = await page.evaluate((id) => { HP.loadPreset(id, false); HP.tick(120); return { nan: HP.sim.hasNaN(), n: HP.sim.n }; }, id);
  add('preset.' + id, !r.nan, 'n=' + r.n);
}

// ---- 3) i18n(全内蔵に en / EN切替 / JA復帰)----
{
  const r = await page.evaluate(() => {
    const missing = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
      .filter(p => !(p.en && p.en.name && p.en.description)).map(p => p.id);
    HP.setLang('en');
    const en = document.title.includes('Virtual Physics Lab')
      && document.querySelector('#presetSelect optgroup').label === 'Space & Time'
      && HP.getSystemPrompt().includes('Language override');
    HP.setLang('ja');
    const ja = document.title.includes('仮想物理ラボ') && !HP.getSystemPrompt().includes('Language override');
    return { missing, en, ja };
  });
  add('i18n.presets-en', r.missing.length === 0, r.missing.join(','));
  add('i18n.toggle', r.en && r.ja, '');
}

// ---- 4) few-shot 全例の validatePreset + BH例の光子捕捉 ----
{
  const r = await page.evaluate(() => {
    const lines = HP.SYSTEM_PROMPT.split('\n').filter(l => l.trim().startsWith('{'));
    const fs2 = lines.map((l, i) => { try { const v = HP.validatePreset(JSON.parse(l)); return { i, ok: v.ok, w: v.warnings.length }; } catch (e) { return { i, ok: false }; } });
    HP.sim.build(HP.validatePreset(JSON.parse(lines[2])).preset);
    let cap = 0; const ys = [10, 40, 80, 120, 160];
    for (const y0 of ys) { const t = HP.traceRay(HP.sim, -300, y0, 1, 0, 2.7, 340, null); if (Math.hypot(t.x, t.y) < 300) cap++; }
    return { fs2, cap, n: ys.length };
  });
  add('fewshot.validate', r.fs2.every(f => f.ok && f.w === 0), JSON.stringify(r.fs2));
  add('fewshot.bh-capture', r.cap === r.n, `${r.cap}/${r.n}`);
}

// ---- 5) 旧セーブ互換(kLens 受理)----
{
  const ok = await page.evaluate(() => HP.validatePreset({ name: '旧', description: 'kLens互換', camera: { scale: 200 },
    world: { boundary: 'none', size: 0 }, physics: { kLens: 0.004, G: 1 },
    bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }).ok);
  add('compat.kLens', ok, '');
}

// ---- 6) インポート4形式+内容重複判定(v1.19)+保存一覧登録+seed 再現性 ----
{
  const r = await page.evaluate(() => {
    // v1.19 の内容重複判定に合わせ、各インポートはパラメータ(質量)を変えて一意にする
    const mk = (id, m) => ({ id, name: 'imp' + id, description: 'd', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
      bodies: [{ type: 'single', m, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
    const doImport = (obj) => { document.querySelector('#ioArea').value = JSON.stringify(obj); document.querySelector('#btnImport').click(); };
    const count = () => JSON.parse(localStorage.getItem('hp_custom_presets') || '[]').length;
    localStorage.setItem('hp_custom_presets', '[]');
    localStorage.setItem('hp_saves', '[]');
    const c0 = count();
    doImport(mk('custom_qa_a', 10));                                        // 単独
    doImport([mk('custom_qa_b', 11), mk('custom_qa_c', 12)]);               // 配列
    doImport({ customPresets: [mk('custom_qa_d', 13)] });                   // ラッパー
    doImport({ schemaVersion: 2, saves: [], customPresets: [mk('custom_qa_e', 14)] }); // バックアップ全体
    const c1 = count();
    doImport(mk('custom_qa_a', 10));      // パラメータが全く同じ → 取り込まない(v1.19)
    const c2 = count();
    doImport(mk('custom_qa_a', 20));      // 同名同ID・パラメータ違い → 名前サフィックス+ID一意化
    const c3 = count();
    const list = JSON.parse(localStorage.getItem('hp_custom_presets') || '[]');
    const renamedOk = list.some(p => p.id === 'custom_qa_a_2' && /\(2\)/.test(p.name));
    // v1.17: インポートしたプリセットは保存一覧にも登録される
    const saves = JSON.parse(localStorage.getItem('hp_saves') || '[]');
    const savesOk = saves.length === c3 - c0 && saves.some(s => s.presetId === 'custom_qa_a')
      && saves.some(s => s.presetId === 'custom_qa_a_2');
    // v1.17: プルダウンに保存一覧カテゴリ(💾)が現れる
    const og = [...document.querySelectorAll('#presetSelect optgroup')].map(o => o.label);
    const ddOk = og.includes('保存一覧') || og.includes('Saved items');
    // seed 再現性: 同じ seed なら id が違っても同一初期配置
    const sp = (id, seed) => ({ id, seed, name: 's', description: 'd', camera: { scale: 200 }, world: { boundary: 'box', size: 200 },
      bodies: [{ type: 'box', n: 30, cx: 0, cy: 0, w: 300, h: 300, mMin: 1, mMax: 2, spinMin: 0, spinMax: 1, vScale: 1 }] });
    const layout = (p) => { HP.sim.build(HP.validatePreset(p).preset); return [...HP.sim.x.slice(0, 5)].map(v => +v.toFixed(4)).join(','); };
    const same = layout(sp('idA', 42)) === layout(sp('idB', 42));
    const diff = layout(sp('idA', 42)) !== layout(sp('idA', 43));
    localStorage.setItem('hp_custom_presets', '[]');
    localStorage.setItem('hp_saves', '[]');
    return { addedAll: c1 - c0, dupDelta: c2 - c1, renDelta: c3 - c2, renamedOk, savesOk, ddOk, same, diff };
  });
  add('import.formats', r.addedAll === 5, `added=${r.addedAll}/5`);
  add('import.content-dedup', r.dupDelta === 0, `delta=${r.dupDelta}(同一パラメータは取り込まない)`);
  add('import.rename', r.renDelta === 1 && r.renamedOk, `delta=${r.renDelta} renamed=${r.renamedOk}`);
  add('import.to-saves', r.savesOk, '');
  add('import.saves-dropdown', r.ddOk, '');
  add('seed.deterministic', r.same && r.diff, `sameSeed=${r.same} diffSeed=${r.diff}`);
}

// ---- 7) 新内蔵サンプルの挙動(v1.12 付録L)----
{
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    // ⏱ gclock: τ/t が解析値 e^{-ψ} と一致し、内側ほど遅い
    HP.loadPreset('gclock', false);
    for (let k = 0; k < 1000; k++) s.step(0.016);
    const eps = s.params.softening;
    const psi = (i) => { let w = s.params.D0;
      for (let j = 0; j < s.n; j++) { if (j === i) continue; w += s.m[j] / Math.hypot(Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]), eps); }
      return w / s.params.Kt; };
    res.gErr = Math.max(...[1, 2, 3].map(i => Math.abs(s.tau[i] / s.t - Math.exp(-psi(i))) / Math.exp(-psi(i))));
    res.gOrder = s.tau[1] < s.tau[2] && s.tau[2] < s.tau[3];
    // 🌈 coolrace: 冷却速度比 ≈ s³(1:8:64)・位置不変
    HP.loadPreset('coolrace', false);
    const s0 = [s.spin[0], s.spin[1], s.spin[2]], x0 = [s.x[0], s.x[1], s.x[2]];
    for (let k = 0; k < 200; k++) s.step(0.016);
    const ds = [0, 1, 2].map(i => s0[i] - s.spin[i]);
    res.cR21 = ds[1] / ds[0]; res.cR32 = ds[2] / ds[1];
    res.cDrift = Math.max(...[0, 1, 2].map(i => Math.abs(s.x[i] - x0[i])));
    // 💥 counterring: muF=1 は加熱、muF=0 は非加熱
    const mas = () => { let a = 0, c = 0; for (let i = 1; i < s.n; i++) { a += Math.abs(s.spin[i]); c++; } return a / c; };
    HP.loadPreset('counterring', false);
    for (let k = 0; k < 6000; k++) s.step(0.016);
    res.rHot = mas(); res.rNaN = s.hasNaN();
    HP.loadPreset('counterring', false); s.params.muF = 0;
    for (let k = 0; k < 6000; k++) s.step(0.016);
    res.rCold = mas();
    return res;
  });
  add('new.gclock', r.gErr < 1e-3 && r.gOrder, `err=${r.gErr.toExponential(1)}`);
  add('new.coolrace', r.cR21 > 5 && r.cR21 < 12 && r.cR32 > 5 && r.cR32 < 12 && r.cDrift < 1e-6,
    `ratio=${r.cR21.toFixed(1)}/${r.cR32.toFixed(1)} (理論8) drift=${r.cDrift}`);
  add('new.counterring', !r.rNaN && r.rHot > 0.3 && r.rCold < 0.05, `muF1=${r.rHot.toFixed(2)} muF0=${r.rCold.toFixed(3)}`);
}

// ---- 7g) 一様重力場(v1.17): gravityY の等加速度・帳簿記録・外部要素バッジ ----
{
  const r = await page.evaluate(() => {
    const p = HP.validatePreset({ name: 'g', description: 'd', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
      physics: { G: 0, D0: 2, kFrame: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, gravityY: 0.5 },
      bodies: [{ type: 'single', m: 2, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
    if (!p.ok) return { ok: false };
    HP.sim.build(p.preset);
    for (let k = 0; k < 100; k++) HP.sim.step(0.016);            // t=1.6 → vy=0.8
    const vy = HP.sim.vy[0], y = HP.sim.y[0];
    const ledger = Math.abs(2 * vy + HP.sim.resPy) < 1e-4;       // P+帳簿P=一定(T7 恒等式)
    const tags = HP.externalTags({ physics: { gravityY: 0.5 }, bodies: [] });
    // v1.18: 解析一致 y = ½gt²(シンプレクティックEulerの離散化誤差 O(dt) 込みで 2% 許容)
    const yTh = 0.5 * 0.5 * 1.6 * 1.6;
    const yOk = Math.abs(y - yTh) / yTh < 0.02;
    return { ok: true, vy, y, yTh, yOk, ledger, grav: !!tags.grav };
  });
  add('gravity.uniform', r.ok && Math.abs(r.vy - 0.8) < 1e-3 && r.yOk && r.ledger && r.grav,
    r.ok ? `vy=${r.vy.toFixed(3)}(理論0.8) y=${r.y.toFixed(3)}(理論${r.yTh}) 帳簿=${r.ledger} badge=${r.grav}` : 'validate failed');
}

// ---- 7i) v1.18 新サンプル/修正の挙動: 浮力分離・merger円盤並進・collapse初期回転 ----
{
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    // 🧪 buoyancy: 12000步で重い粒子群が軽い粒子群より下(平均yが大きい)に分離する
    // (掃引実測: 6000步≈20 → 12000步≈50-70 に成長し持続。12000步時点を判定)
    HP.loadPreset('buoyancy', false);
    for (let k = 0; k < 12000; k++) s.step(0.016);
    let hy = 0, hc = 0, ly = 0, lc = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.pinned[i]) continue;
      if (s.m[i] > 1) { hy += s.y[i]; hc++; } else { ly += s.y[i]; lc++; }
    }
    res.buoySep = (hc ? hy / hc : 0) - (lc ? ly / lc : 0);   // >0 = 重い側が下
    res.buoyNaN = s.hasNaN();
    // 🌠 merger: 円盤が核と同じ並進速度で生成される(bulkVx/Vy。v1.18 修正)
    // v1.24: 円盤を回転支持(kepler ≈3〜5)にしたため、有限個の回転成分のサンプリング残差
    // ≈ v/√n ≈ 0.25 が平均に残る(固定シードで決定論的に 0.232)。並進の欠落(旧バグは
    // |v̄−v核| ≈ 1.4)とは1桁離れており、閾値は 0.35(実測×1.5マージン)で判定する
    HP.loadPreset('merger', false);
    let dvx = 0, dvy = 0, dc = 0;
    for (let i = 0; i < s.n; i++) {   // 左銀河: 核=index0、円盤=核から半径130以内の自由粒子
      if (i === 0 || s.m[i] > 100) continue;
      const dx = s.x[i] - s.x[0], dy = s.y[i] - s.y[0];
      if (dx * dx + dy * dy < 130 * 130) { dvx += s.vx[i]; dvy += s.vy[i]; dc++; }
    }
    res.mergerDv = Math.hypot(dvx / dc - s.vx[0], dvy / dc - s.vy[0]);
    // 🌫️ collapse: 初期回転(v1.18)でも有界・NaNなし・全角運動量が正(回転獲得)
    HP.loadPreset('collapse', false);
    for (let k = 0; k < 6000; k++) s.step(0.016);
    let rMax = 0, L = 0;
    for (let i = 0; i < s.n; i++) {
      rMax = Math.max(rMax, Math.hypot(s.x[i], s.y[i]));
      L += s.m[i] * (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]);
    }
    res.colRMax = rMax; res.colL = L; res.colNaN = s.hasNaN();
    return res;
  });
  add('behavior.buoyancy', !r.buoyNaN && r.buoySep > 20,
    `分離(重-軽の平均y差)=${r.buoySep.toFixed(1)} (>20)`);
  add('merger.bulk-velocity', r.mergerDv < 0.35, `|v̄円盤−v核|=${r.mergerDv.toFixed(3)} (<0.35 — 回転サンプリング残差込み)`);
  add('collapse.rotation', !r.colNaN && r.colRMax < 600 && r.colL > 0,
    `rMax=${r.colRMax.toFixed(0)} (<600) L=${r.colL.toFixed(0)} (>0)`);
}

// ---- 7b) 理論解説パネル(v1.13): 全内蔵の説明から法則参照が抽出され、ヘルプに表示される ----
{
  const r = await page.evaluate(() => {
    const noRefs = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
      .filter(p => HP.extractLawRefs(p.description || '').length === 0).map(p => p.id);
    HP.loadPreset('saturn', false);
    const jaShown = document.querySelector('#helpBody').textContent.includes('A8 — ');
    HP.setLang('en');
    HP.loadPreset('saturn', false);
    const enShown = document.querySelector('#helpBody').textContent.includes('A spinning mass rotates the space');
    HP.setLang('ja');
    return { noRefs, jaShown, enShown };
  });
  add('theory.refs-all', r.noRefs.length === 0, r.noRefs.join(','));
  add('theory.panel', r.jaShown && r.enShown, `ja=${r.jaShown} en=${r.enShown}`);
}

// ---- 7d) 外部要素バッジ(v1.15 第7次裁定): bodies からの自動判定と説明タブ表示 ----
{
  const r = await page.evaluate(() => {
    const tag = (id) => HP.externalTags(HP.allPresets().find(q => q.id === id));
    // v1.24: mach 廃止に伴い、熱浴検出は convection(固定ヒーター spin>0)で検査
    const gc = tag('gclock'), f8 = tag('fig8'), cv = tag('convection');
    HP.loadPreset('gclock', false);
    const shown = document.querySelector('#helpBody').textContent.includes('外部要素');
    HP.loadPreset('fig8', false);
    const closed = document.querySelector('#helpBody').textContent.includes('閉鎖系');
    return { gcPin: gc.pin, f8Pin: f8.pin, cvBath: cv.bath, shown, closed };
  });
  add('ext.detect', r.gcPin === 4 && r.f8Pin === 0 && r.cvBath, JSON.stringify(r)); // gclock は中心+時計3つの全4粒子が pinned(静止統制実験)
  add('ext.panel', r.shown && r.closed, '');
}

// ---- 7f) 🛰️弱場GR較正デモ(v1.16 付録O): 時計の解析一致・較正数値の表示・光線ファン ----
{
  const r = await page.evaluate(() => {
    const p = HP.allPresets().find(q => q.id === 'grcal');
    if (!p) return { missing: true };
    HP.loadPreset('grcal', false);
    const s = HP.sim;
    for (let k = 0; k < 1000; k++) s.step(0.016);
    const eps = s.params.softening, Kt = s.params.Kt, c0 = s.params.cLight, M = s.m[0];
    // 地上時計(pinned, r=60): τ/t = e^{−ψ}
    const psiG = (M / Math.sqrt(60 * 60 + eps * eps) + 2 / Math.sqrt(120 * 120 + eps * eps)) / Kt;
    // 衛星(r=180 円軌道): τ/t = √(N²−A²v²/c₀²)(v は現在速度。他時計の w も W_ext に含める)
    const rS = Math.hypot(s.x[2], s.y[2]);
    const dG = Math.hypot(s.x[2] - s.x[1], s.y[2] - s.y[1]);
    const psiS = (M / Math.sqrt(rS * rS + eps * eps) + 2 / Math.sqrt(dG * dG + eps * eps)) / Kt;
    const v = Math.hypot(s.vx[2], s.vy[2]);
    const N = Math.exp(-psiS), A = Math.exp(psiS);
    const thS = Math.sqrt(N * N - A * A * v * v / (c0 * c0));
    const g = s.tau[1] / s.t, sat = s.tau[2] / s.t;
    const errG = Math.abs(g - Math.exp(-psiG)) / Math.exp(-psiG);
    const errS = Math.abs(sat - thS) / thS;
    const hasNums = (t) => t.includes('38.5') && t.includes('1.7512') && t.includes('281');
    return { missing: false, errG, errS, gpsSign: sat > g, g, sat,
      textJa: hasNums(p.description), textEn: hasNums(p.en.description),
      rays: p.rays && p.rays.n >= 5, nan: s.hasNaN() };
  });
  add('grcal.clocks', !r.missing && !r.nan && r.errG < 2e-3 && r.errS < 2e-3 && r.gpsSign,
    r.missing ? 'preset missing' :
      `τ/t 地上=${r.g?.toFixed(4)} 衛星=${r.sat?.toFixed(4)} err=${r.errG?.toExponential(1)}/${r.errS?.toExponential(1)} 衛星>地上=${r.gpsSign}`);
  add('grcal.calib-text', !r.missing && r.textJa && r.textEn, `ja=${r.textJa} en=${r.textEn}`);
  add('grcal.rays', !r.missing && r.rays, '');
}

// ---- 7e) v1.19 UI改善: 表記統一 / 直値入力 / 線の軌跡トグル / 速度倍率 / セーブ名初期値 / コピー ----
{
  // 一様重力の表記統一(g_x / g_y。Unicode 下付き gₓ の混在を排除)
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  add('label.gravity-notation', html.includes('一様重力 g_x') && html.includes('一様重力 g_y') && !html.includes('gₓ'), '');
  const r = await page.evaluate(() => {
    const res = {};
    // 直値入力はそのまま反映(fmt 丸め表示に置き換えない)
    // v1.22: activeParams 導入で先頭行は G と限らないため、ラベル「重力 G」で行を特定する
    HP.loadPreset('saturn', false);
    const gRow = [...document.querySelectorAll('#paramRows .prow')]
      .find(x => x.querySelector('label') && x.querySelector('label').textContent === '重力 G');
    const inp = gRow.querySelector('input.valIn');
    inp.value = '0.123'; inp.dispatchEvent(new Event('change'));
    res.direct = Math.abs(HP.sim.params.G - 0.123) < 1e-12 && inp.value === '0.123';
    // 表示グループに「線の軌跡」トグルがあり、overlays.trail と連動する
    const row = [...document.querySelectorAll('#paramRows .prow')]
      .find(x => x.querySelector('label') && x.querySelector('label').textContent === '線の軌跡');
    const cb = row && row.querySelector('input[type=checkbox]');
    if (cb) {
      cb.checked = true; cb.dispatchEvent(new Event('change'));
      res.trailOn = HP.sim.overlays.trail === true;
      cb.checked = false; cb.dispatchEvent(new Event('change'));
      res.trailOff = HP.sim.overlays.trail === false;
    }
    // 実効速度 = 時間倍率 × プルダウン倍率(プルダウンはパラメータを書き換えない)
    HP.loadPreset('saturn', false);
    const ts0 = HP.sim.params.timeScale;
    const sel = document.querySelector('#speedSel');
    sel.value = '4'; sel.dispatchEvent(new Event('change'));
    res.mul = HP.speedMul() === 4 && HP.sim.params.timeScale === ts0;
    sel.value = '1'; sel.dispatchEvent(new Event('change'));
    // セーブ名の初期値 = プリセット名+サフィックス
    res.saveName = document.querySelector('#saveName').value.startsWith('土星の環 (');
    // 保存一覧・生成済みプリセットに「コピー」ボタン
    localStorage.setItem('hp_saves', JSON.stringify([{ name: 'qa_copy', comment: '', savedAt: new Date().toISOString(),
      presetId: 'saturn', presetName: 's', physics: {}, cameraScale: 200 }]));
    localStorage.setItem('hp_custom_presets', JSON.stringify([{ id: 'custom_qa_copy', name: 'c', description: 'd',
      camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }]));
    document.querySelector('#tabs button[data-tab=saves]').click();
    res.saveCopyBtn = [...document.querySelectorAll('#saveList button')].some(b => b.textContent === 'コピー');
    document.querySelector('#tabs button[data-tab=ai]').click();
    res.customCopyBtn = [...document.querySelectorAll('#customList button')].some(b => b.textContent === 'コピー');
    document.querySelector('#tabs button[data-tab=ai]').click();   // パネルを閉じる
    localStorage.setItem('hp_saves', '[]'); localStorage.setItem('hp_custom_presets', '[]');
    return res;
  });
  add('params.direct-input', r.direct, '');
  add('display.trail-toggle', r.trailOn && r.trailOff, '');
  add('speed.multiplier', r.mul, '');
  add('saves.default-name', r.saveName, '');
  add('saves.copy-button', r.saveCopyBtn, '');
  add('customs.copy-button', r.customCopyBtn, '');
}

// ---- 7j) v1.21 第9次裁定: パラメータ説明タップ / オーバーレイスロット / 軌跡の対象限定 /
// ----     spinlens kFrame 制御 / projectile 配置整合 ----
{
  const r = await page.evaluate(async () => {
    const res = {};
    // ① 全21パラメータに ja(PARAM_DEFS.desc)/ en(I18N.en.paramDescs)の説明がある
    res.descMissingJa = HP.PARAM_DEFS.filter(d => !d.desc).map(d => d.key);
    HP.setLang('en');
    res.descMissingEn = HP.PARAM_DEFS.filter(d => !HP.paramDesc(d) || HP.paramDesc(d) === d.desc).map(d => d.key);
    HP.setLang('ja');
    // ② ラベルタップで説明が開閉する
    HP.loadPreset('saturn', false);
    const lab = document.querySelector('#paramRows .prow label.tappable');
    lab.click();
    const opened = document.querySelector('#paramRows .pdesc');
    res.descOpen = !!opened && opened.textContent.length > 10;
    lab.click();
    res.descClose = !document.querySelector('#paramRows .pdesc');
    // ③ オーバーレイスロット: merger は回転曲線と温度グラフが別スロット(重ならない)
    HP.loadPreset('merger', false);
    const slots = HP.overlaySlots();
    res.slots = slots;
    res.slotDistinct = slots.length === 2 &&
      HP.overlayBaseY(slots.indexOf('rotationCurve')) !== HP.overlayBaseY(slots.indexOf('tempHistogram'));
    // ④ 軌跡の対象限定: merger(trailTargets:"sampled")は核+代表のみ記録される
    HP.setRunning(true);
    await new Promise(res2 => setTimeout(res2, 500));
    HP.setRunning(false);
    const nTr = HP.trailBufs().a.filter(b => b && b.length > 0).length;
    res.trailN = nTr;                     // 全352粒子ではなく核2+代表16前後
    res.trailSampled = nTr >= 3 && nTr <= 24;
    // ⑤ spinlens: 光線の空間随伴に kFrame が効く(kF=0 で非対称が消える対照実験)
    HP.loadPreset('spinlens', false);
    const asym = (kf) => { HP.sim.params.kFrame = kf;
      const bend = (y0) => { const t = HP.traceRay(HP.sim, -300, y0, 1, 0, 2.7, 340, null); return Math.atan2(t.cy, t.cx); };
      return bend(90) + bend(-90); };     // 上下対称なら 0(V8 と同じ非対称度)
    res.asym1 = asym(1); res.asym0 = asym(0);
    res.spinlensCtl = Math.abs(res.asym1) > 0.05 && Math.abs(res.asym0) < 1e-6;
    // ⑥ projectile: 説明と画面配置の一致 — 斜方投射球(最下段=最大y)が上向き(vy<0)に発射
    const p = HP.allPresets().find(q => q.id === 'projectile');
    const ys = p.bodies.map(b => b.y);
    res.projOk = p.description.includes('下段は斜方投射') && p.en.description.includes('bottom one obliquely')
      && ys[3] === Math.max(...ys) && p.bodies[3].vy < 0;
    HP.loadPreset('saturn', false);
    return res;
  });
  add('params.desc-all', r.descMissingJa.length === 0 && r.descMissingEn.length === 0,
    `ja欠落=${r.descMissingJa.join(',') || 'なし'} en欠落=${r.descMissingEn.join(',') || 'なし'}`);
  add('params.desc-toggle', r.descOpen && r.descClose, '');
  add('overlay.slots-distinct', r.slotDistinct, `merger slots=${JSON.stringify(r.slots)}`);
  add('trail.sampled', r.trailSampled, `記録本数=${r.trailN}(核2+代表16前後、全352ではない)`);
  add('spinlens.kframe-control', r.spinlensCtl,
    `非対称度 kF=1: ${r.asym1.toExponential(2)} / kF=0: ${r.asym0.toExponential(2)}(0で消失)`);
  add('projectile.layout', r.projOk, '説明「下段は斜方投射」と bodies[3](最大y・vy<0)の一致');
}

// ---- 7k) v1.22 性能・UXスプリント: activeParams / 描画オンデマンド / 光線・フィールド
// ----     キャッシュ / 発散Undo ----
{
  // ① 全内蔵プリセットに activeParams があり、キーが PARAM_DEFS に存在する
  const r1 = await page.evaluate(() => {
    const keys = new Set(HP.PARAM_DEFS.map(d => d.key));
    const bad = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
      .filter(p => !Array.isArray(p.activeParams) || p.activeParams.length === 0
        || p.activeParams.some(k => !keys.has(k)))
      .map(p => p.id);
    // ② UI: saturn は主役グループ(activeParams と同数の行)+詳細設定 <details> に残り全行
    HP.loadPreset('saturn', false);
    const act = HP.allPresets().find(p => p.id === 'saturn').activeParams;
    const groups = [...document.querySelectorAll('#paramRows > .group')];
    const actGroup = groups[0];
    const actRows = actGroup ? actGroup.querySelectorAll('.prow').length : 0;
    const det = document.querySelector('#paramRows details.advParams');
    const detRows = det ? det.querySelectorAll('.prow').length : 0;
    const headOk = actGroup && actGroup.querySelector('h3').textContent === 'このサンプルの主役';
    // 主役行の編集が反映される(先頭= muF)
    const inp = actGroup.querySelector('.prow input.valIn');
    inp.value = '0.33'; inp.dispatchEvent(new Event('change'));
    const editOk = Math.abs(HP.sim.params.muF - 0.33) < 1e-12;
    // v1.23: timeScale は表示グループへ移設されたため、詳細設定の行数からも除外
    return { bad, actRows, nAct: act.length, detRows,
      nRest: HP.PARAM_DEFS.filter(d => d.key !== 'timeScale').length - act.length,
      detOpen: det ? det.open : null, headOk, editOk };
  });
  add('activeParams.all', r1.bad.length === 0, r1.bad.join(',') || '全内蔵で宣言済み');
  add('activeParams.ui', r1.headOk && r1.actRows === r1.nAct && r1.detRows === r1.nRest
    && r1.detOpen === false && r1.editOk,
    `主役${r1.actRows}/${r1.nAct}行 詳細${r1.detRows}/${r1.nRest}行 折りたたみ=${r1.detOpen === false} 編集反映=${r1.editOk}`);

  // ③ 停止中の描画オンデマンド化: 操作がなければ render が走らず、操作で走る
  const r2 = await page.evaluate(async () => {
    HP.loadPreset('fig8', false);           // running=false・requestRender が1回入る
    await new Promise(res => setTimeout(res, 300));   // 読込直後の1描画を排出
    const c0 = HP.stats().renderCount;
    await new Promise(res => setTimeout(res, 500));
    const c1 = HP.stats().renderCount;
    HP.requestRender();                     // 操作相当(パン・パラメータ変更などが呼ぶ)
    await new Promise(res => setTimeout(res, 200));
    const c2 = HP.stats().renderCount;
    return { idle: c1 - c0, wake: c2 - c1 };
  });
  add('render.on-demand', r2.idle === 0 && r2.wake >= 1,
    `停止500msの描画=${r2.idle}回(0) 操作後=${r2.wake}回(≥1)`);

  // ④ 光線・フィールドのキー比較キャッシュ: 💡lensing は全固定源なので、実行中に
  //    毎フレーム描画されても再積分・再計算はほぼ増えない(初回のみ)
  const r3 = await page.evaluate(async () => {
    HP.loadPreset('lensing', false);
    await new Promise(res => setTimeout(res, 300));
    const s0 = HP.stats();
    HP.setRunning(true);
    await new Promise(res => setTimeout(res, 700));
    HP.setRunning(false);
    const s1 = HP.stats();
    return { renders: s1.renderCount - s0.renderCount,
      rays: s1.rayTraceCount - s0.rayTraceCount,
      fields: s1.fieldCalcCount - s0.fieldCalcCount };
  });
  add('cache.rays-field', r3.renders > 10 && r3.rays <= 2 && r3.fields <= 2,
    `描画${r3.renders}回の間に 光線再積分=${r3.rays}(≤2) フィールド再計算=${r3.fields}(≤2)`);

  // ⑤ 発散Undo: 2秒毎スナップショット→NaN注入→通知ボタン→復元(初期配置+発散前パラメータ)
  const r4 = await page.evaluate(async () => {
    HP.loadPreset('fig8', false);
    const g0 = HP.sim.params.G;
    HP.setRunning(true);
    await new Promise(res => setTimeout(res, 3000));  // ≈180フレーム → snapB 確保
    const snapped = !!(HP.divSnaps().a || HP.divSnaps().b);
    HP.sim.params.G = 100;                            // 「壊れた」変更(スナップには入らない想定)
    HP.sim.x[0] = NaN;                                // 発散を注入
    await new Promise(res => setTimeout(res, 800));   // 30フレーム毎の検査に掛かる
    const stopped = !HP.running();
    const btn = document.querySelector('#notice button');
    const hasBtn = !!btn && document.querySelector('#notice').style.display !== 'none';
    if (btn) btn.click();                             // ⏪ 直前の設定に戻して初めから
    const restored = !HP.sim.hasNaN() && HP.sim.t === 0 && Math.abs(HP.sim.params.G - g0) < 1e-12;
    HP.loadPreset('saturn', false);
    return { snapped, stopped, hasBtn, restored };
  });
  add('divergence.undo', r4.snapped && r4.stopped && r4.hasBtn && r4.restored,
    `snapshot=${r4.snapped} 停止=${r4.stopped} ボタン=${r4.hasBtn} 復元=${r4.restored}`);
}

// ---- 7l) v1.23 原仮定者指示: A/B編集対象トグル / 表示の両画面反映 / 時間倍率の表示移設 /
// ----     描画品質(自動/正確/軽量)----
{
  const r = await page.evaluate(() => {
    const res = {};
    const findRow = (label) => [...document.querySelectorAll('#paramRows .prow')]
      .find(x => x.querySelector('label') && x.querySelector('label').textContent === label);
    const setVal = (row, v) => { const inp = row.querySelector('input.valIn');
      inp.value = String(v); inp.dispatchEvent(new Event('change')); };
    // ① A/B編集対象: B を選ぶと編集は B のみに効き、表示値も B のものになる
    HP.loadPreset('fig8', false);
    HP.abStart();
    const simB = HP.ab().simB;
    HP.setAbTarget('B');
    res.targetShown = document.querySelector('#abTargetRow').style.display !== 'none';
    setVal(findRow('重力 G'), 2.5);
    res.bEdited = Math.abs(simB.params.G - 2.5) < 1e-12 && Math.abs(HP.sim.params.G - 1) < 1e-12;
    HP.setAbTarget('A');
    res.aShowsA = findRow('重力 G').querySelector('input.valIn').value === '1.00';
    setVal(findRow('重力 G'), 3);
    res.aEdited = Math.abs(HP.sim.params.G - 3) < 1e-12 && Math.abs(simB.params.G - 2.5) < 1e-12;
    // ② 表示トグルは A/B 両方に反映(決定力マップ・光線)
    const toggleByLabel = (label, on) => {
      const row = findRow(label); const cb = row.querySelector('input[type=checkbox]');
      cb.checked = on; cb.dispatchEvent(new Event('change'));
    };
    toggleByLabel('決定力マップ', true);
    res.fieldBoth = HP.sim.overlays.field === true && simB.overlays.field === true;
    toggleByLabel('光線', true);
    res.raysBoth = !!(HP.sim.rays && HP.sim.rays.n > 0) && !!(simB.rays && simB.rays.n > 0);
    toggleByLabel('光線', false); toggleByLabel('決定力マップ', false);
    // ③ 時間倍率は表示グループの1行のみ+A/B両方に反映
    const tsRows = [...document.querySelectorAll('#paramRows .prow')]
      .filter(x => x.querySelector('label') && x.querySelector('label').textContent === '時間倍率');
    res.tsSingle = tsRows.length === 1;
    res.tsInDisplay = !tsRows[0].closest('details');   // 詳細設定(details)の中ではない
    setVal(tsRows[0], 5);
    res.tsBoth = Math.abs(HP.sim.params.timeScale - 5) < 1e-12 && Math.abs(simB.params.timeScale - 5) < 1e-12;
    HP.abStop();
    // activeParams に timeScale が残っていない(表示グループへ移設済み)
    res.tsInAct = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
      .filter(p => (p.activeParams || []).includes('timeScale')).map(p => p.id);
    // ④ 描画品質: 軽量で縮退・正確で全て戻る(既定 auto は headless 60fps でレベル0)
    HP.setQuality('lite');
    const lite = HP.qState();
    HP.setQuality('exact');
    const exact = HP.qState();
    HP.setQuality('auto');
    const auto = HP.qState();
    res.quality = lite.level === 2 && lite.fieldRes === 32 && Math.abs(lite.rayFactor - 0.55) < 1e-9
      && exact.level === 0 && exact.fieldRes === 48 && exact.rayFactor === 1
      && auto.level === 0;
    res.qualityRow = !!findRow('描画品質');
    HP.loadPreset('saturn', false);
    return res;
  });
  add('ab.edit-target', r.targetShown && r.bEdited && r.aShowsA && r.aEdited,
    `トグル表示=${r.targetShown} B編集=${r.bEdited} A表示値=${r.aShowsA} A編集=${r.aEdited}`);
  add('ab.display-sync', r.fieldBoth && r.raysBoth, `field両方=${r.fieldBoth} rays両方=${r.raysBoth}`);
  add('display.timescale-both', r.tsSingle && r.tsInDisplay && r.tsBoth && r.tsInAct.length === 0,
    `行数=${r.tsSingle ? 1 : '複数'} 表示グループ=${r.tsInDisplay} 両方反映=${r.tsBoth} activeParams残=${r.tsInAct.join(',') || 'なし'}`);
  add('quality.levels', r.quality && r.qualityRow,
    `軽量/正確/自動の縮退値=${r.quality} セレクト行=${r.qualityRow}`);
}

// ---- 7n) v1.26: 物理対応ロック Kt=cLight²/G(決断事項4-12承認・第10次裁定P0-2)----
// ON でKtが導出値になり cLight/G 編集に追随・Kt直接編集は導出値へ戻る・
// OFF では条件外バッジ(一般化トイ設定)・G=0 はクランプ扱い・ロックはプリセットに保存されない
{
  const r = await page.evaluate(() => {
    const res = {};
    const findRow = (pre) => [...document.querySelectorAll('#paramRows .prow')]
      .find(x => x.querySelector('label') && x.querySelector('label').textContent.startsWith(pre));
    const badge = () => document.getElementById('physLockBadge').textContent;
    HP.setPhysLock(false);
    HP.loadPreset('grcal', false);                    // Kt=300, cLight=60, G=1(条件値3600)
    res.before = HP.sim.params.Kt;
    res.badgeOff = badge().includes('一般化トイ設定');
    HP.setPhysLock(true);
    res.locked = HP.sim.params.Kt;                    // → 3600
    res.badgeOn = badge().includes('自動維持');
    const cIn = findRow('光速').querySelector('input.valIn');
    cIn.value = '30'; cIn.dispatchEvent(new Event('change'));
    res.follow = HP.sim.params.Kt;                    // → 900
    const kIn = findRow('時空係数').querySelector('input.valIn');
    kIn.value = '50'; kIn.dispatchEvent(new Event('change'));
    res.snapBack = HP.sim.params.Kt;                  // 直接編集は導出値 900 のまま
    res.snapShown = kIn.value;                        // UI 表示も導出値
    res.edge = HP.physLockCalc({ params: { G: 0, cLight: 30 } });   // クランプ+近似扱い
    HP.setPhysLock(false);
    HP.loadPreset('grcal', false);
    res.after = HP.sim.params.Kt;                     // ロックはプリセットへ保存されない
    return res;
  });
  add('physlock.kt-derive', r.before === 300 && r.locked === 3600 && r.follow === 900
    && r.snapBack === 900 && r.snapShown === '900' && r.badgeOff && r.badgeOn
    && r.edge.applied === 10000 && r.edge.clamped === true && r.after === 300,
    `OFF時Kt=${r.before}(条件外バッジ=${r.badgeOff}) ON時=${r.locked} cLight30追随=${r.follow} `
    + `Kt直編集=${r.snapBack}/表示${r.snapShown} G=0クランプ=${r.edge.applied}(近似=${r.edge.clamped}) 解除後=${r.after}`);
}

// ---- v1.27(公開前レビュー P0-1): ステップ会計 — 高倍率でも要求分を黙って破棄しない ----
{
  const r = await page.evaluate(() => {
    const runs = {};
    let acc = 0, total = 0;
    for (let f = 0; f < 100; f++) { const b = HP.stepBudget(acc, 8); acc = b.acc; total += b.k; }
    runs.low = total;                                       // 要求 ≤24/フレーム: 合計=要求合計
    acc = 0; total = 0; let maxAcc = 0;
    for (let f = 0; f < 100; f++) { const b = HP.stepBudget(acc, 64); acc = b.acc; total += b.k; if (b.acc > maxAcc) maxAcc = b.acc; }
    runs.high = total; runs.maxAcc = maxAcc;                // 持続的過負荷: 24/フレームに飽和・繰越は有界
    acc = 0; total = 0;
    for (let f = 0; f < 5; f++) { const b = HP.stepBudget(acc, f === 0 ? 60 : 0); acc = b.acc; total += b.k; }
    runs.burst = total;                                     // 一時バースト: 繰越上限まで後続で消化(24+24)
    return runs;
  });
  add('time.step-accounting', Math.abs(r.low - 800) <= 1 && r.high === 2400 && r.maxAcc <= 24 && r.burst === 48,
    `低負荷=${r.low}/800 過負荷=${r.high}/2400 繰越最大=${r.maxAcc}≤24 バースト=${r.burst}/48`);
}

// ---- 7m) 論文改稿ゲート(第5次AI模擬査読 裁定 #7/#16。付録C-4 条件4)----
// ① V1 収束表: 保存則残差が固定総時間 T=16 の dt 掃引で全て丸め床(<1.5e-5)に留まり、
//    dt に依存しない(=方程式レベルの厳密保存+Float32 丸みのみ。実測 4.5e-6/1.28e-5/4.3e-6)
// ② zeroth-law 対照: 全冷却・接触チャネル OFF(ηrad=γn=μF=0・κs のみ)の孤立系で
//    (a) 2粒子の温度差が解析率 κs·g(d) で指数緩和(相対誤差 <1e-2。実測 2.9e-5)
//    (b) 静止格子アンサンブルの左右温度差が単調減衰し ΣIs が丸め床で保存
//    → 「温度平衡が冷却の副産物でない」ことの機械分離(論文 Sec. VI 実験6)
{
  const r = await page.evaluate(() => {
    const res = {};
    // ① V1 と同一構成(verify_v1 の id からシード決定 — 同一初期配置)
    const v1p = { id: "verify_v1", name: "V1", description: "d", camera: { scale: 200 },
      world: { boundary: "none", size: 0 },
      physics: { D0: 0, kFrame: 1, G: 1, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, etaRad: 0,
        softening: 2, timeScale: 1 },
      bodies: [
        { type: "single", m: 30, x: 0, y: 0, vx: 0, vy: 0, spin: 0.5, pinned: false },
        { type: "disk", n: 48, cx: 0, cy: 0, radius: 120, mMin: 0.5, mMax: 2,
          spinMin: -2, spinMax: 2, vMode: "random", aroundMass: 0, vScale: 1.2, direction: 1 }
      ] };
    const s = HP.sim;
    const runV1 = (dt, N) => {
      s.build(HP.validatePreset(v1p).preset);
      const t0 = s.totals();
      let pScale = 0, lScale = 0;
      for (let i = 0; i < s.n; i++) {
        pScale += s.m[i] * Math.hypot(s.vx[i], s.vy[i]);
        lScale += Math.abs(s.m[i] * (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]))
          + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]);
      }
      for (let k = 0; k < N; k++) s.step(dt);
      const t1 = s.totals();
      return { relP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / pScale,
        relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / lScale };
    };
    res.conv = [[0.016, 1000], [0.008, 2000], [0.004, 4000]].map(([dt, N]) => ({ dt, ...runV1(dt, N) }));
    // ② zeroth-law 孤立対照
    const iso = (bodies) => ({ id: "qa_zeroth", name: "z", description: "d", camera: { scale: 240 },
      world: { boundary: "none", size: 0 },
      physics: { G: 0, D0: 2, kFrame: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0.3, etaRad: 0,
        softening: 2, timeScale: 1 }, bodies });
    // (a) 2粒子: 解析率 κs·g(d)
    s.build(HP.validatePreset(iso([
      { type: "single", m: 2, x: -15, y: 0, vx: 0, vy: 0, spin: 2, pinned: false },
      { type: "single", m: 2, x: 15, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }])).preset);
    const sumR = s.R[0] + s.R[1];
    const rateTh = 0.3 * (sumR / (sumR + 30)) ** 2;
    const gap0 = s.spin[0] - s.spin[1];
    for (let k = 0; k < 2500; k++) s.step(0.016);
    const rateMeas = -Math.log((s.spin[0] - s.spin[1]) / gap0) / s.t;
    res.rateTh = rateTh; res.rateMeas = rateMeas;
    res.rateErr = Math.abs(rateMeas - rateTh) / rateTh;
    // (b) 静止格子 8×6(左 0.3・右 2.5)
    const bodies = [];
    for (let ix = 0; ix < 8; ix++) for (let iy = 0; iy < 6; iy++)
      bodies.push({ type: "single", m: 1, x: -140 + ix * 40, y: -100 + iy * 40, vx: 0, vy: 0,
        spin: ix < 4 ? 0.3 : 2.5, pinned: false });
    s.build(HP.validatePreset(iso(bodies)).preset);
    const stats = () => {
      let l = 0, lc = 0, rr = 0, rc = 0, Ls = 0;
      for (let i = 0; i < s.n; i++) {
        const T2 = 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];
        Ls += 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i];
        if (s.x[i] < 0) { l += T2; lc++; } else { rr += T2; rc++; }
      }
      return { gap: Math.abs(rr / rc - l / lc), Ls };
    };
    const e0 = stats();
    for (let k = 0; k < 4000; k++) s.step(0.016);
    const e1 = stats();
    res.ensGap0 = e0.gap; res.ensGap1 = e1.gap;
    res.ensRate = -Math.log(e1.gap / e0.gap) / s.t;
    res.ensLsDrift = Math.abs(e1.Ls - e0.Ls) / Math.abs(e0.Ls);
    HP.loadPreset('saturn', false);
    return res;
  });
  const worst = Math.max(...r.conv.map(c => Math.max(c.relP, c.relL)));
  // 閾値 5e-5 = 実測最大 1.5e-5(dt=0.008 の L)×3(V10 と同じマージン規約)。V1 本則 1e-3 の 1/20
  add('paper.v1-convergence', worst < 5e-5,
    r.conv.map(c => `dt=${c.dt}: P=${c.relP.toExponential(1)} L=${c.relL.toExponential(1)}`).join(' / ')
    + '(全て丸め床 <5e-5・dt 非依存)');
  // ΣIs ドリフト閾値 1e-5 = Float32 丸め実測 1.7e-6 の×3超マージン(48粒子・4000步の累積丸め)
  add('paper.zeroth-law-isolated',
    r.rateErr < 1e-2 && r.ensGap1 < r.ensGap0 && r.ensRate > 1e-3 && r.ensLsDrift < 1e-5,
    `2体率=${r.rateMeas.toExponential(3)} vs 解析 ${r.rateTh.toExponential(3)}(誤差 ${r.rateErr.toExponential(1)}) `
    + `格子gap ${r.ensGap0.toFixed(2)}→${r.ensGap1.toFixed(2)}(率 ${r.ensRate.toExponential(2)}) ΣIsドリフト=${r.ensLsDrift.toExponential(1)}`);
}

// ---- 7c) A/B比較モード(v1.13 → v1.19 コピー方式): 同一初期条件・両シム同時駆動・A継続 ----
{
  const r = await page.evaluate(async () => {
    HP.loadPreset('galaxy', false);
    HP.abStart('kFrame', 0);   // QA API: 開始と同時に B 側の1パラメータを変更
    const ab = HP.ab();
    const sameInit = Math.abs(HP.sim.x[5] - ab.simB.x[5]) < 1e-9 && Math.abs(HP.sim.y[5] - ab.simB.y[5]) < 1e-9;
    const paramsDiffer = HP.sim.params.kFrame === 1 && ab.simB.params.kFrame === 0;
    HP.setRunning(true);
    await new Promise(res => setTimeout(res, 800));
    HP.setRunning(false);
    const bothAdvanced = HP.sim.t > 0.5 && Math.abs(HP.sim.t - ab.simB.t) < 1e-6;
    const evolvedDiff = Math.abs(HP.sim.x[5] - ab.simB.x[5]) > 1e-6; // kFrame差が軌道に効く
    HP.abStop(); HP.loadPreset('galaxy', false);
    const stopped = HP.ab() === null;
    // v1.19: 実行途中からの開始 — B は「今の状態」の完全コピー。終了で A を継続し B を破棄
    HP.loadPreset('fig8', false);
    for (let k = 0; k < 500; k++) HP.sim.step(0.016);
    const t0 = HP.sim.t, x0 = HP.sim.x[0];
    HP.abStart();
    const ab3 = HP.ab();
    const copyState = Math.abs(ab3.simB.t - t0) < 1e-9 && Math.abs(ab3.simB.x[0] - x0) < 1e-9
      && ab3.simB.params.G === HP.sim.params.G;
    // 線の軌跡が A/B 比較でも記録される(fig8 は overlays.trail=true)
    HP.setRunning(true);
    await new Promise(res => setTimeout(res, 500));
    HP.setRunning(false);
    const tb = HP.trailBufs();
    const abTrail = tb.a.some(b => b && b.length > 0) && tb.b.some(b => b && b.length > 0);
    const tStop = HP.sim.t;
    HP.abStop();
    const keepsA = HP.ab() === null && Math.abs(HP.sim.t - tStop) < 1e-9 && HP.sim.t > t0;
    HP.loadPreset('galaxy', false);
    return { sameInit, paramsDiffer, bothAdvanced, evolvedDiff, stopped, copyState, abTrail, keepsA };
  });
  add('ab.same-init', r.sameInit, '');
  add('ab.params-differ', r.paramsDiffer, '');
  add('ab.sync-advance', r.bothAdvanced, '');
  add('ab.effect-visible', r.evolvedDiff, '');
  add('ab.stop', r.stopped, '');
  add('ab.copy-state', r.copyState, '');
  add('ab.trail-view', r.abTrail, '');
  add('ab.stop-keeps-A', r.keepsA, '');
}

// ---- 8) 長時間挙動: 🌌銀河平坦化(定量)と🪐土星(環残存)。QA_FAST=1 で省略 ----
// (♨️対流の検査は v1.14 のプリセット撤去に伴い削除。検査ロジックは git 履歴 v1.13 に残る)
if (!FAST) {
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    // 🌌 galaxy: 主張の定量判定(v1.15 第7次裁定 P0-6)— 実プリセット・同一初期条件で
    // kFrame=1(A)/0(B) を同時駆動し、外縁帯 r∈[156,286](=[0.6,1.1]×260)の平均接線速度を比較。
    // 校正実験(付録N N3): 比は 3000步1.02→6000步1.08→9000步1.12 と成長し 12000步で円盤進化により
    // 反転する。固定シードで決定論的な 6000步時点(実測1.082)を採用し、閾値は2倍マージンの >1.04
    HP.loadPreset('galaxy', false);
    HP.abStart('kFrame', 0);
    const abG = HP.ab();
    const outer = (sm) => { let sum = 0, c = 0;
      for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
        if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; } }
      return c ? sum / c : 0; };
    for (let k = 0; k < 6000; k++) { s.step(0.016); abG.simB.step(0.016); }
    res.galA = outer(s); res.galB = outer(abG.simB);
    res.galNaN = s.hasNaN() || abG.simB.hasNaN();
    HP.abStop();
    // 🪐 saturn(v1.17: 3環帯構成。環帯 135〜248 が全て計測環 45〜280 に収まる)
    HP.loadPreset('saturn', false);
    for (let k = 0; k < 24000; k++) s.step(0.016);
    let inAnn = 0, tot = 0;
    for (let i = 1; i < s.n; i++) { tot++; const r2 = Math.hypot(s.x[i], s.y[i]); if (r2 > 45 && r2 < 280) inAnn++; }
    res.satAnn = inAnn / tot; res.satDrift = Math.hypot(s.x[0], s.y[0]); res.satNaN = s.hasNaN();
    // ♨️ convection(v1.17 復活): 24000步で NaN なし・循環が正(左で上昇・右で下降=circ>0)・
    // ガスが凍結しない。温度の床天井差は対流セルでは定常指標にならない(熱柱の頭は天井にある)
    // ため、循環量そのものを判定する。掃引実測: circ≈50・|v|≈0.6(48000步でも circ>10 持続)
    HP.loadPreset('convection', false);
    for (let k = 0; k < 24000; k++) s.step(0.016);
    let circ = 0, sumV = 0, freeC = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.pinned[i]) continue;
      circ += s.x[i] * s.vy[i] - s.y[i] * s.vx[i];
      sumV += Math.hypot(s.vx[i], s.vy[i]); freeC++;
    }
    res.convCirc = freeC ? circ / freeC : 0;
    res.convV = freeC ? sumV / freeC : 0; res.convNaN = s.hasNaN();
    return res;
  });
  add('claim.galaxy-flatten', !r.galNaN && r.galA > r.galB * 1.04,
    `vφ外縁 kF1=${r.galA.toFixed(3)} kF0=${r.galB.toFixed(3)} 比=${(r.galA / r.galB).toFixed(3)} (>1.04)`);
  add('behavior.saturn', !r.satNaN && r.satAnn >= 0.95 && r.satDrift < 5,
    `inAnn=${(r.satAnn * 100).toFixed(1)}% drift=${r.satDrift.toFixed(1)}`);
  add('behavior.convection', !r.convNaN && r.convCirc > 5 && r.convV > 0.3,
    `循環=${r.convCirc.toFixed(1)} (>5) 平均|v|=${r.convV.toFixed(2)} (>0.3)`);

  // ---- 8b) v1.21 第9次裁定 P0-3: 内蔵 ☿mercury の実条件検証 ----
  // 説明が引用する V18〜V20 は検証専用条件のため、内蔵プリセットそのものの初期値でも
  // E12 の主張(λ=1 で前進 / λ=0 で基線のみ / α=0.5 で 1/3)が成り立つことを機械検証する。
  // 較正実測(2026-07-19): full=+0.0659 rad/周, zero=−0.0114(Plummer+離散化の数値基線),
  // half=+0.0147 → 基線差し引き比 (full−zero)/(half−zero)=2.96(理論3)
  {
    const m = await page.evaluate(() => {
      const run = (lam, alpha) => {
        HP.loadPreset('mercury', false);
        const s = HP.sim;
        s.params.lambdaPN = lam; if (alpha !== undefined) s.params.pnAlpha = alpha;
        const peri = []; let lastK = -1e9, r2 = 0, r1 = 0, th1 = 0;
        for (let k = 0; k < 120000 && peri.length < 5; k++) {
          s.step(0.016);
          const r = Math.hypot(s.x[1], s.y[1]), th = Math.atan2(s.y[1], s.x[1]);
          // 真の近点のみ受理(近点47.66・遠点72.3 → r<55 ゲート+最小間隔)
          if (k > 2 && r1 < r2 && r1 < r && r1 < 55 && (k - lastK) > 600) { peri.push(th1); lastK = k; }
          r2 = r1; r1 = r; th1 = th;
        }
        let acc = 0;
        for (let i = 1; i < peri.length; i++) {
          let dd = peri[i] - peri[i - 1];
          while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
          acc += dd;
        }
        const L = s.x[1] * s.vy[1] - s.y[1] * s.vx[1];   // L>0=反時計回り(θ増加=前進が正)
        return { n: peri.length, drift: peri.length > 1 ? acc / (peri.length - 1) : 0, L, nan: s.hasNaN() };
      };
      const full = run(1), zero = run(0), half = run(1, 0.5);
      HP.loadPreset('saturn', false);
      return { full, zero, half };
    });
    const netF = m.full.drift - m.zero.drift, netH = m.half.drift - m.zero.drift;
    const ratio = netH !== 0 ? netF / netH : 0;
    const f = (x) => (x * 180 / Math.PI).toFixed(2);
    add('behavior.mercury-builtin',
      !m.full.nan && !m.zero.nan && !m.half.nan &&
      m.full.n >= 4 && m.zero.n >= 4 && m.half.n >= 4 &&
      m.full.L > 0 && m.full.drift > 0.03 &&            // 公転と同じ向きに前進(較正0.066)
      Math.abs(m.zero.drift) < 0.03 &&                  // λ=0 は数値基線のみ(較正−0.011)
      Math.abs(ratio - 3) < 0.6,                        // 基線差し引きで全量/時間率のみ≈3(較正2.96)
      `Δϖ/周: λ1=${f(m.full.drift)}° λ0=${f(m.zero.drift)}° α0.5=${f(m.half.drift)}° 比(基線差引)=${ratio.toFixed(2)}(理論3±0.6)`);
  }
} else {
  console.log('SKIP behavior.* (QA_FAST=1)');
}

add('page.no-errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
await browser.close();

// ---- 結果JSON(コミット固定の再現記録)----
let commit = 'unknown';
try { commit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}
const pass = results.every(r => r.pass);
// v1.27(公開前レビュー P0-5): 実行環境のメタデータを結果JSONへ必須記録
let playwrightVersion = 'unknown';
try { playwrightVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/playwright/package.json'), 'utf8')).version; } catch {}
fs.writeFileSync(path.join(OUT_DIR, 'qa-results.json'), JSON.stringify({
  commit, date: new Date().toISOString(), fast: FAST,
  target: TARGET,  // P2: 検査対象(beta 検証時に結果JSONを取り違えないため)
  env: { node: process.version, playwright: playwrightVersion, platform: `${process.platform}/${process.arch}` },
  total: results.length, failed: results.filter(r => !r.pass).length, pass, results,
}, null, 1));
console.log(`\n${pass ? 'ALL PASS' : 'FAILED'} (${results.filter(r => r.pass).length}/${results.length}) → tests/out/qa-results.json`);
process.exit(pass ? 0 : 1);

// 機械QAスイート(Phase 1 再現性基盤)。1コマンド実行: `npm test`(または node tests/qa.mjs)
// - HP.verify.all() / 全内蔵プリセットのスモーク / i18n / few-shot / BH捕捉 / 互換 /
//   インポート4形式+ID重複 / seed再現性 / 新サンプル挙動 / 🪐の長時間挙動(QA_FAST=1 で省略)
// - v1.15(第7次裁定): バージョン同期 / スライダー範囲整合 / 外部要素バッジ / おすすめA/B / 🌌平坦化の定量判定
// - 結果は tests/out/qa-results.json に機械可読で保存(CI が artifact 化)
// - 1件でも FAIL なら exit code 1
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
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
// 第35便 W5c(台帳4-45): フルQA時間短縮の並列ワーカー化。QA_SERIAL=1 で従来どおりの完全直列実行に
// 戻せる互換スイッチ(既定=並列)。NW は QA_WORKERS で上書き可(既定4 — exp-darkrotor.mjs 226行の
// 先行例〔4コア環境〕と同じ)。詳細設計: scratchpad/w5c-report.md。
const QA_SERIAL = process.env.QA_SERIAL === '1';
const W5C_NW = Math.max(1, Number(process.env.QA_WORKERS) || 4);

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
// 第17便: 項目別の所要時間(ms)を記録 — 直前の add() からの経過を当該項目の実測とする
// (準備処理を含む壁時計。フルQAの時間内訳を結果JSONから機械集計できるようにする)
let lastAddAt = Date.now();
const add = (id, pass, detail) => {
  const now = Date.now(); const ms = now - lastAddAt; lastAddAt = now;
  results.push({ id, pass: !!pass, detail: String(detail ?? ''), ms });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? '  ' + detail : ''}  [${(ms / 1000).toFixed(1)}s]`);
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

// ---- 0b2) 昇格整合(第30便 — 第24次 P0-1 の明示ゲート): ルート対象時、SW キャッシュが
// ----      dfm-release-v{APP_VERSION} と厳密一致(昇格コミットの版数取り違え・SW 接頭辞の
// ----      切替忘れを機械検出。beta は開発中 APP_VERSION が旧版のままの設計なので対象外)----
if (!TARGET.startsWith('beta/')) {
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const av = (html.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const pre = (sw.match(/const CACHE_PREFIX = "([^"]+)"/) || [])[1];
  const cache = (sw.match(/CACHE = CACHE_PREFIX \+ "([^"]+)"/) || [])[1];
  add('version.sw-sync', pre === 'dfm-release-' && cache === 'v' + av,
    `SW=${pre}${cache} 期待=dfm-release-v${av}`);
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

// ==== 第35便 W5c(台帳4-45): 重量テストのワーカー並列化 ====================================
// 対象: claim.galaxy-outerboost(galaxy A/B・saturn24000・convection24000 の3ユニットに分割)+
// behavior.saturnLayered / behavior.saturnExp / behavior.darkrotorLong / behavior.darkrotor /
// behavior.buoyancy / core.twolayer / behavior.binary。各ユニットの run() は、該当する既存
// セクションの page.evaluate(...) の中身(物理コード)を一字も変えずに切り出したもの — 判定式・
// 閾値・detail 文字列を生成するコードは元のセクション側にそのまま残置し、そこでは
// `const r = await getUnit('key')` のように結果を受け取るだけに置き換える(詳細は各セクションの
// 差分参照)。QA_SERIAL=1 は本ブロックを迂回し、getUnit() が同じ run() を主ページ(page)上で
// その場で直列実行する(=リファクタ前と同一の実行順・同一ページの経路)。
//
// 有効/無効の判定は、対応する既存セクションのガード式(!FAST・hasCoreEng 等)と全く同じ式を
// ここで先読みして決める(値は対象の静的な機能有無〔プリセット定義・エンジンAPIの存在〕であり、
// これまでの QA 実行順でも既に複数回同じ式が再評価されて一致し続けている・後段の各セクションの
// ガード式自体は変更していない)。
const w5cHasCoreEng = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.coreMR));
const w5cHasIce = await page.evaluate(() =>
  !!(window.HP && HP.allPresets().some(p => p.id === 'saturn' && /実験/.test(p.name || ''))));
const w5cHasObs = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.obsT));
const w5cHasV26 = await page.evaluate(() => !!document.querySelector('#aiBasePreset'));
let w5cDrFree = false;
if (w5cHasObs) {
  w5cDrFree = await page.evaluate(() =>
    HP.allPresets().find(q => q.id === 'darkrotor').bodies.every(b => !b.pinned && !b.railOmega && !b.railH));
}

// bands(behavior.darkrotorLong の環帯定義。元コード2875行と同一)
const w5cBands = [[80, 120], [120, 160], [160, 200], [200, 240]];

// weight は並列プールでのキュー順(重い順)を決めるためだけの目安値(実測 scratchpad/full-qa-beta.log
// 由来。galaxy/saturn/convection の3分割は合算実測206.6sをO(n²·步数)比で概算按分)。判定結果には
// 一切影響しない(スケジューリングの都合の数値)。
const W5C_UNITS = {
  buoyancy: { enabled: true, weight: 38, run: (pg) => pg.evaluate(() => {
    // 🧪buoyancy 部分のみ(元7i節 1350-1361行から抽出。merger/collapse は主ページに残置)
    const s = HP.sim;
    HP.loadPreset('buoyancy', false);
    for (let k = 0; k < 12000; k++) s.step(0.016);
    let hy = 0, hc = 0, ly = 0, lc = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.pinned[i]) continue;
      if (s.m[i] > 1) { hy += s.y[i]; hc++; } else { ly += s.y[i]; lc++; }
    }
    return { buoySep: (hc ? hy / hc : 0) - (lc ? ly / lc : 0), buoyNaN: s.hasNaN() };
  }) },
  galaxyAB: { enabled: !FAST, weight: 62, run: (pg) => pg.evaluate(() => {
    // 🌌 galaxy A/B 部分のみ(元8節 1916-1930行から抽出)
    const s = HP.sim;
    HP.loadPreset('galaxy', false);
    HP.abStart('kFrame', 0);
    const abG = HP.ab();
    const outer = (sm) => { let sum = 0, c = 0;
      for (let i = 1; i < sm.n; i++) { const r2 = Math.hypot(sm.x[i], sm.y[i]);
        if (r2 >= 156 && r2 <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / r2; c++; } }
      return c ? sum / c : 0; };
    for (let k = 0; k < 6000; k++) { s.step(0.016); abG.simB.step(0.016); }
    const galA = outer(s), galB = outer(abG.simB);
    const galNaN = s.hasNaN() || abG.simB.hasNaN();
    HP.abStop();
    return { galA, galB, galNaN };
  }) },
  saturn24000: { enabled: !FAST, weight: 78, run: (pg) => pg.evaluate(() => {
    // 🪐 saturn 24000步 部分のみ(元8節 1931-1936行から抽出)
    const s = HP.sim;
    HP.loadPreset('saturn', false);
    for (let k = 0; k < 24000; k++) s.step(0.016);
    let inAnn = 0, tot = 0;
    for (let i = 1; i < s.n; i++) { tot++; const r2 = Math.hypot(s.x[i], s.y[i]); if (r2 > 45 && r2 < 280) inAnn++; }
    return { satAnn: inAnn / tot, satDrift: Math.hypot(s.x[0], s.y[0]), satNaN: s.hasNaN() };
  }) },
  convection24000: { enabled: !FAST, weight: 66, run: (pg) => pg.evaluate(() => {
    // ♨️ convection 24000步 部分のみ(元8節 1937-1949行から抽出)
    const s = HP.sim;
    HP.loadPreset('convection', false);
    for (let k = 0; k < 24000; k++) s.step(0.016);
    let circ = 0, sumV = 0, freeC = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.pinned[i]) continue;
      circ += s.x[i] * s.vy[i] - s.y[i] * s.vx[i];
      sumV += Math.hypot(s.vx[i], s.vy[i]); freeC++;
    }
    return { convCirc: freeC ? circ / freeC : 0, convV: freeC ? sumV / freeC : 0, convNaN: s.hasNaN() };
  }) },
  saturnExp: { enabled: !FAST && w5cHasIce, weight: 107, run: (pg) => pg.evaluate(() => {
    // 🪐(実験)の長時間安定(元8d節 2299-2311行から抽出)
    HP.loadPreset('saturn', false);
    const s = HP.sim;
    for (let k = 0; k < 22500; k++) s.step(0.016);
    let inB = 0, fall = 0, esc = 0, sum = 0;
    for (let i = 1; i < s.n; i++) {
      const r = Math.hypot(s.x[i], s.y[i]);
      if (r >= 90 && r <= 290) inB++; if (r < 85) fall++; if (r > 320) esc++;
      sum += Math.abs(s.spin[i]);
    }
    return { inB: inB / (s.n - 1), fall: fall / (s.n - 1), esc: esc / (s.n - 1),
             mean: sum / (s.n - 1), nan: s.hasNaN() };
  }) },
  twolayerCore: { enabled: w5cHasCoreEng, weight: 19, run: (pg) => pg.evaluate(() => {
    // 🎯 主星2層エンジン検証の走行部分のみ(元「第12〜14便」節 2366-2411行から抽出)
    const out = {};
    HP.loadPreset('saturnLayered', false);
    let s = HP.sim;
    out.preset = { n: s.n, coreMR: +s.coreMR[0].toFixed(4), coreSR: +s.coreSR[0].toFixed(4),
      R0: s.R[0], Rc0: s.Rc[0], hasCore: s.hasCore };
    HP.loadPreset('saturn', false); s = HP.sim;
    for (let k = 0; k < 600; k++) s.step(0.016);
    const base = [s.x[10], s.y[10], s.spin[10]];
    HP.loadPreset('saturn', false); s = HP.sim;
    s.coreMR[0] = 0.6; s.updateRadii();
    const m0 = s.m[0], hcRigid = s.hasCore;
    for (let k = 0; k < 600; k++) s.step(0.016);
    const eqRigid = Math.abs(s.x[10] - base[0]) + Math.abs(s.y[10] - base[1]) + Math.abs(s.spin[10] - base[2]);
    HP.loadPreset('saturn', false); s = HP.sim;
    s.coreMR[0] = 0.6; s.coreSR[0] = 0; s.updateRadii();
    for (let k = 0; k < 600; k++) s.step(0.016);
    const restDx = Math.abs(s.x[10] - base[0]) + Math.abs(s.y[10] - base[1]);
    HP.loadPreset('saturn', false); s = HP.sim;
    s.coreSR[0] = 5; s.updateRadii();
    const hcZero = s.hasCore;
    for (let k = 0; k < 600; k++) s.step(0.016);
    const eqZero = Math.abs(s.x[10] - base[0]) + Math.abs(s.y[10] - base[1]);
    HP.loadPreset('saturn', false); s = HP.sim;
    s.coreMR[0] = 0.6; s.coreSR[0] = 20; s.updateRadii();
    for (let k = 0; k < 600; k++) s.step(0.016);
    const effDx = Math.abs(s.x[10] - base[0]), effNan = s.hasNaN();
    HP.loadPreset('saturn', false); s = HP.sim;
    s.coreMR[0] = -0.6; s.coreSR[0] = 20; s.updateRadii();
    for (let k = 0; k < 600; k++) s.step(0.016);
    const holNan = s.hasNaN();
    const holDx = Math.abs(s.x[10] - base[0]);
    HP.loadPreset('saturn', false); s = HP.sim;
    s.m[5] = -1; s.updateRadii();
    const negR = s.R[5];
    for (let k = 0; k < 400; k++) s.step(0.016);
    const negNan = s.hasNaN();
    HP.loadPreset('saturn', false);
    return { ...out, m0, hcRigid, eqRigid, restDx, hcZero, eqZero, effDx, effNan, holDx, holNan, negR, negNan };
  }) },
  saturnLayered: { enabled: w5cHasCoreEng && !FAST, weight: 152, run: (pg) => pg.evaluate(() => {
    // 🎯 既定値の長時間安定+差動効果の有界性(元「第12〜14便」節 2466-2490行から抽出)
    const run = (rigidSc, steps) => {
      HP.loadPreset('saturnLayered', false);
      const s = HP.sim;
      if (rigidSc) { s.coreSR[0] = 1; }
      const med = (lo, hi) => { const rs = []; for (let i = lo; i <= hi; i++) rs.push(Math.hypot(s.x[i], s.y[i])); rs.sort((a, b) => a - b); return rs[Math.floor(0.5 * (rs.length - 1))]; };
      const metric = () => {
        let inB = 0, fall = 0, esc = 0, sum = 0;
        for (let i = 1; i < s.n; i++) { const r = Math.hypot(s.x[i], s.y[i]);
          if (r >= 90 && r <= 290) inB++; if (r < 85) fall++; if (r > 320) esc++;
          sum += Math.abs(s.spin[i]); }
        return { inB: inB / (s.n - 1), fall: fall / (s.n - 1), esc: esc / (s.n - 1),
          mean: sum / (s.n - 1), C: med(1, 75), B: med(76, 225), A: med(226, 300), nan: s.hasNaN() };
      };
      const out = [];
      for (let c = 0; c < steps.length; c++) {
        for (let k = 0; k < steps[c]; k++) s.step(0.016);
        out.push(metric());
      }
      return out;
    };
    const def = run(false, [9375, 13125]);
    const noc = run(true, [9375]);
    HP.loadPreset('saturn', false);
    return { d150: def[0], d360: def[1], z150: noc[0] };
  }) },
  darkrotorMidNew: { enabled: w5cHasObs && !FAST && w5cDrFree, weight: 26, run: (pg) => pg.evaluate(() => {
    // 🕶️ の中期安定・v4/v5(全自由系)経路(元7m節 2785-2822行から抽出)
    const NH = HP.allPresets().find(q => q.id === 'darkrotor')
      .bodies.filter(b => b.type === 'single').length - 1;
    HP.loadPreset('darkrotor', false);
    const s = HP.sim, OFF = NH + 1;
    const hr0 = [], st0 = [];
    for (let k = 1; k <= NH; k++) hr0.push(Math.hypot(s.x[k] - s.x[0], s.y[k] - s.y[0]));
    for (let i = OFF; i < s.n; i++) st0.push(Math.hypot(s.x[i] - s.x[0], s.y[i] - s.y[0]));
    let M = 0, cx0 = 0, cy0 = 0, p0x = 0, p0y = 0;
    for (let i = 0; i < s.n; i++) { M += s.m[i]; cx0 += s.m[i] * s.x[i]; cy0 += s.m[i] * s.y[i];
      p0x += s.m[i] * s.vx[i]; p0y += s.m[i] * s.vy[i]; }
    cx0 /= M; cy0 /= M;
    const pTot0 = Math.hypot(p0x, p0y);
    for (let k = 0; k < 3000; k++) s.step(0.016);
    const bx = s.x[0], by = s.y[0];
    let sum = 0, c = 0, keep = 0, tot = 0, maxSpin = 0, hs = 0, haloIn = 0, haloDev = 0;
    const rs = [];
    for (let i = OFF; i < s.n; i++) {
      const rx = s.x[i] - bx, ry = s.y[i] - by, r = Math.hypot(rx, ry); rs.push(r);
      if (r >= 156 && r <= 286) { sum += (rx * (s.vy[i] - s.vy[0]) - ry * (s.vx[i] - s.vx[0])) / r; c++; }
      if (st0[i - OFF] < 350) { tot++; if (r < 500) keep++; }
    }
    for (let k = 1; k <= NH; k++) { const r = Math.hypot(s.x[k] - bx, s.y[k] - by);
      if (r > 60 && r < 400) haloIn++; hs += Math.abs(s.spin[k]);
      haloDev = Math.max(haloDev, Math.abs(r / hr0[k - 1] - 1)); }
    for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
    rs.sort((a, b) => a - b);
    let cx = 0, cy = 0, px = 0, py = 0;
    for (let i = 0; i < s.n; i++) { cx += s.m[i] * s.x[i]; cy += s.m[i] * s.y[i];
      px += s.m[i] * s.vx[i]; py += s.m[i] * s.vy[i]; }
    return { NH, outer: c ? sum / c : 0, nOuter: c, r90: rs[Math.floor(rs.length * 0.9)],
      haloIn, haloDev, haloSpin: hs / NH, maxSpin, bhSpin: s.spin[0],
      keepPct: 100 * keep / tot, keep, tot, comMove: Math.hypot(cx / M - cx0, cy / M - cy0),
      pTot0, pTotEnd: Math.hypot(px, py), nan: s.hasNaN() };
  }) },
  darkrotorMidOld: { enabled: w5cHasObs && !FAST && !w5cDrFree, weight: 18, run: (pg) => pg.evaluate(() => {
    // 🕶️ の中期安定・v3(レール駆動)経路(元7m節 2841-2854行から抽出)
    HP.loadPreset('darkrotor', false);
    const s = HP.sim;
    const s0 = s.spin[0];
    for (let k = 0; k < 3000; k++) s.step(0.016);
    let sum = 0, c = 0; const rs = [];
    for (let i = 1; i <= 380; i++) { const r = Math.hypot(s.x[i], s.y[i]); rs.push(r);
      if (r >= 156 && r <= 286) { sum += (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) / r; c++; } }
    rs.sort((a, b) => a - b);
    let inside = 0, hs = 0;
    for (let i = 381; i < s.n; i++) { const r = Math.hypot(s.x[i], s.y[i]);
      if (r > 60 && r < 400) inside++; hs += Math.abs(s.spin[i]); }
    return { outer: c ? sum / c : 0, r90: rs[Math.floor(rs.length * 0.9)], inside, nHalo: s.n - 381,
      haloSpin: hs / (s.n - 381), cSpinKeep: Math.abs(s.spin[0] - s0) < 1e-9, nan: s.hasNaN() };
  }) },
  darkrotorLong: { enabled: w5cHasObs && !FAST && w5cDrFree, weight: 104, run: (pg) => pg.evaluate((BANDS) => {
    // 🕶️ v5 の有効窓検査+渦状腕の機械実証(元7m節 2876-2922行から抽出)
    const P = HP.allPresets().find(q => q.id === 'darkrotor');
    const NH = P.bodies.filter(b => b.type === 'single').length - 1;
    const rotorIdx = () => { const idx = []; let k = 0;
      for (const b of P.bodies) { if (b.type === 'single') idx.push(k);
        k += (b.type === 'single' ? 1 : (b.n || 0)); }
      return idx; };
    const a2 = (s, OFF) => BANDS.map(([lo, hi]) => {
      const bx = s.x[0], by = s.y[0];
      let cr = 0, ci = 0, N = 0;
      for (let i = OFF; i < s.n; i++) {
        const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
        if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
          cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
      }
      return { A2: N ? Math.hypot(cr, ci) / N : 0, N, noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 };
    });
    const run = (ctrl) => {
      HP.loadPreset('darkrotor', false);
      const s = HP.sim, OFF = NH + 1;
      if (ctrl) for (const i of rotorIdx()) s.spin[i] = 0;
      const hr0 = [], st0 = [];
      for (let k = 1; k <= NH; k++) hr0.push(Math.hypot(s.x[k] - s.x[0], s.y[k] - s.y[0]));
      for (let i = OFF; i < s.n; i++) st0.push(Math.hypot(s.x[i] - s.x[0], s.y[i] - s.y[0]));
      const late = [];
      let maxSpin = 0, lastNoise = null;
      for (let blk = 0; blk < 12; blk++) {
        for (let k = 0; k < 500; k++) s.step(0.016);
        for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
        const t = (blk + 1) * 500;
        if (t >= 3000) { const z = a2(s, OFF); late.push(z.map(v => v.A2)); lastNoise = z; }
      }
      const bx = s.x[0], by = s.y[0];
      let keep = 0, tot = 0, rotDev = 0, rotIn = 0;
      for (let i = OFF; i < s.n; i++) { const r = Math.hypot(s.x[i] - bx, s.y[i] - by);
        if (st0[i - OFF] < 350) { tot++; if (r < 500) keep++; } }
      for (let k = 1; k <= NH; k++) { const r = Math.hypot(s.x[k] - bx, s.y[k] - by);
        if (r > 60 && r < 400) rotIn++;
        rotDev = Math.max(rotDev, Math.abs(r / hr0[k - 1] - 1)); }
      const A2 = BANDS.map((_, b) => late.reduce((a, v) => a + v[b], 0) / late.length);
      return { A2, nLate: late.length, noise: lastNoise.map(z => z.noise), nBand: lastNoise.map(z => z.N),
        maxSpin, rotDev, rotIn, keep, tot, keepPct: 100 * keep / tot, nan: s.hasNaN(), NH, n: s.n };
    };
    return { on: run(false), ctrl: run(true) };
  }, w5cBands) },
  binary: { enabled: w5cHasV26, weight: 6, run: (pg) => pg.evaluate(() => {
    // ⭐binary kFrame=1 の挙動(元7n節 3035-3044行から抽出)
    HP.loadPreset('binary', false);
    const s = HP.sim;
    for (let k = 0; k < 3000; k++) s.step(0.016);
    let stars = [], keep = 0, free = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.m[i] > 100) { stars.push(i); continue; }
      free++; if (Math.hypot(s.x[i], s.y[i]) < 400) keep++;
    }
    const sep = Math.hypot(s.x[stars[0]] - s.x[stars[1]], s.y[stars[0]] - s.y[stars[1]]);
    return { sep, keep, free, nan: s.hasNaN() };
  }) },
};

const w5cUnitKeys = Object.keys(W5C_UNITS).filter(k => W5C_UNITS[k].enabled);
let w5cPoolPromise = null;
const w5cUnitResults = {};
if (!QA_SERIAL && w5cUnitKeys.length) {
  const deferred = {};
  for (const k of w5cUnitKeys) {
    let resolve; w5cUnitResults[k] = new Promise(r => { resolve = r; }); deferred[k] = resolve;
  }
  const queue = w5cUnitKeys.slice().sort((a, b) => W5C_UNITS[b].weight - W5C_UNITS[a].weight);
  const nw = Math.min(W5C_NW, queue.length);
  console.log(`[W5c] 並列ワーカー起動: NW=${nw} units=[${queue.join(', ')}]`);
  w5cPoolPromise = Promise.all(Array.from({ length: nw }, async () => {
    const wp = await browser.newPage({ viewport: { width: 390, height: 844 } });
    // page.no-errors との等価性確保のため、主ページと同じ収集先へ流し込む
    wp.on('pageerror', e => pageErrors.push(String(e)));
    wp.on('console', m => { if (m.type() === 'error') pageErrors.push(m.text()); });
    await wp.goto(INDEX);
    await wp.waitForFunction(() => window.HP && HP.sim);
    while (queue.length) {
      const k = queue.shift();
      const t0 = Date.now();
      const res = await W5C_UNITS[k].run(wp);
      console.log(`  [W5c] ${k} 完了 [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
      deferred[k](res);
    }
    await wp.close();
  }));
  w5cPoolPromise.catch(e => console.error('[W5c] worker pool error:', e));
}
// getUnit(key): QA_SERIAL=1 なら主ページ(page)でその場で直列実行(元コードと同一経路)。
// 並列時は事前に起動済みのワーカープールの結果を待つ(既に完了していれば即座に返る)。
async function w5cGetUnit(key) {
  if (QA_SERIAL) return W5C_UNITS[key].run(page);
  return w5cUnitResults[key];
}
// ==== W5c ここまで(以下、既存セクション本体。各対象セクション内の該当箇所だけ getUnit() 経由に
// ====   置き換えてあり、判定式・閾値・detail 文字列の生成コードそのものは変更していない) ========

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

// ---- 4) few-shot 全例の validatePreset + BH例の光子の有限時間非脱出(台帳4-48 改名: 旧 bh-capture)----
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
  add('fewshot.bh-nonescape', r.cap === r.n, `${r.cap}/${r.n}(有限時間非脱出=bounded — 「捕捉」は主張しない)`);
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

// ---- 7h) 箱宇宙(第31便 — BOX_UNIVERSE v1.2): サンプル挙動と universeBox スキーマ
// ----     (beta 先行 — 箱宇宙プリセットの無い対象〔root=v1.31〕ではスキップ)----
{
  const hasBoxUniverse = await page.evaluate(() => HP.allPresets().some(p => p.id === 'boxtrans'));
  if (hasBoxUniverse) {
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    const meanR = (i0, i1) => { let a = 0; for (let i = i0; i < i1; i++) a += Math.hypot(s.x[i], s.y[i]); return a / (i1 - i0); };
    // 📦 boxtrans: 箱と共動する時計は遅れず、箱に対する固有運動を持つ時計だけが遅れる(T10 並進不可知)
    // 第32便(原仮定者裁定): 「絶対静止」の概念・粒子を廃止 — 上の時計は共動+固有運動(0.9)
    HP.loadPreset('boxtrans', false);
    for (let k = 0; k < 2000; k++) s.step(0.016);
    res.tComv = s.tau[s.n - 2] / s.t;   // 共動時計(|v−u|=0)
    res.tProp = s.tau[s.n - 1] / s.t;   // 固有運動時計(箱に対して 0.9 で運動)
    res.transNaN = s.hasNaN();
    // 🌀 boxrot: kFrame=1 で内側リング(Ω/2 共回転)の半径が維持され(空間の支え)、kFrame=0 で飛散
    HP.loadPreset('boxrot', false);
    const rot0 = meanR(96, 104);
    for (let k = 0; k < 3000; k++) s.step(0.016);
    res.rotKeep = meanR(96, 104) / rot0;
    HP.loadPreset('boxrot', false); s.params.kFrame = 0;
    for (let k = 0; k < 3000; k++) s.step(0.016);
    res.rotFly = meanR(96, 104) / rot0;
    // 📈 boxexpand: 半分の Hubble 流を与えたトレーサは √a に追随(利得 g=1/2 の時間応答)
    HP.loadPreset('boxexpand', false);
    const exp0 = meanR(96, 120);
    for (let k = 0; k < 3000; k++) s.step(0.016);
    res.expRatio = meanR(96, 120) / exp0 / Math.exp(0.005 * s.t / 2);
    // 🫁 boxbreath: 散逸ゼロなら一周期(T=2π/0.08)でほぼ初期配置へ戻る(幾何学的周期の可逆性)
    HP.loadPreset('boxbreath', false);
    const bx = [], by = []; for (let i = 0; i < s.n; i++) { bx.push(s.x[i]); by.push(s.y[i]); }
    const stepsT = Math.round(2 * Math.PI / 0.08 / 0.016);
    for (let k = 0; k < stepsT; k++) s.step(0.016);
    let rms = 0; for (let i = 0; i < s.n; i++) rms += (s.x[i] - bx[i]) ** 2 + (s.y[i] - by[i]) ** 2;
    res.breathRMS = Math.sqrt(rms / s.n);
    return res;
  });
  add('box.trans-clocks', !r.transNaN && r.tComv > 0.999 && r.tProp < 0.995 && r.tProp > 0.97,
    `共動τ/t=${r.tComv.toFixed(4)}(>0.999 — 箱と動く運動は「静止」) 固有運動τ/t=${r.tProp.toFixed(4)}(0.97<τ/t<0.995)`);
  add('box.rot-support', Math.abs(r.rotKeep - 1) < 0.05 && r.rotFly > 1.5,
    `kF=1 半径比=${r.rotKeep.toFixed(3)}(維持) kF=0 半径比=${r.rotFly.toFixed(2)}(>1.5 飛散)`);
  add('box.expand-sqrt', Math.abs(r.expRatio - 1) < 0.03, `r̄/(r̄₀·√a)=${r.expRatio.toFixed(4)}(√a 追随)`);
  add('box.breath-return', r.breathRMS < 1, `1周期後RMS=${r.breathRMS.toFixed(3)}(<1 可逆 — 散逸ゼロ)`);
  // universeBox スキーマ検証: 値域クランプ+railH の pinned 限定(警告つき無効化)
  const v = await page.evaluate(() => {
    const p1 = HP.validatePreset({ name: '箱', description: 'universeBox スキーマ検査', camera: { scale: 300 },
      world: { boundary: 'none', size: 0 }, physics: {},
      universeBox: { mode: 'exp', H0: 5, D: 99999 },
      bodies: [{ type: 'ring', n: 8, cx: 0, cy: 0, rIn: 100, rOut: 100, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0,
        vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0, direction: 1, pinned: false, railH: 0.01 }] });
    return { ok: p1.ok, H0: p1.ok ? p1.preset.universeBox.H0 : null, D: p1.ok ? p1.preset.universeBox.D : null,
      railH: p1.ok ? p1.preset.bodies[0].railH : null, warns: p1.warnings.length };
  });
  add('box.schema-clamp', v.ok && v.H0 === 0.2 && v.D === 10000 && v.railH === 0 && v.warns >= 3,
    `H0→${v.H0} D→${v.D} 非pinned railH→${v.railH} warns=${v.warns}`);
  // 第32便: 赤方偏移(1+z=a/a_ref。意味論の機械固定)と尺度履歴バッファ(グラフ用データ層)
  const z = await page.evaluate(() => {
    const s = HP.sim;
    HP.loadPreset('boxcomoving', false);          // exp モード H0=0.004 → a=e^{0.004t}・a_ref=1
    for (let k = 0; k < 1000; k++) s.step(0.016);
    const simT = s.t, rs = s.boxRedshift(), th = Math.exp(0.004 * simT) - 1, h = s.boxHist;
    let mono = true;
    for (let i = 1; i < h.length; i++) if (!(h[i].a > h[i - 1].a)) mono = false;
    const len = h.length, lastT = h[h.length - 1].t;
    HP.loadPreset('galaxy', false);               // universeBox 無し → null(追加コストゼロ)
    return { t: simT, z: rs.z, rel: Math.abs(rs.z / th - 1), len, lastT, mono,
      nullHist: HP.sim.boxHist === null, nullRs: HP.sim.boxRedshift() === null };
  });
  add('box.redshift', z.rel < 1e-6 && z.nullRs,
    `t=${z.t.toFixed(1)} z=${z.z.toFixed(6)} vs e^{0.004t}−1 の相対誤差=${z.rel.toExponential(1)}(<1e-6) 箱なし→null=${z.nullRs}`);
  add('box.hist', z.len >= 1 && z.len <= 720 && z.lastT <= z.t && z.mono && z.nullHist,
    `点数=${z.len}(1〜720) 末尾t=${z.lastT.toFixed(2)}(≤sim.t=${z.t.toFixed(2)}) a単調増加=${z.mono} 箱なし→null=${z.nullHist}`);

  // ---- 第32便 W2) 膨張グラフ overlay(overlays.boxGraph): スロット登録・boxHist蓄積・例外なし ----
  // ----          (i18n 確認は新IDを立てず、本項目の detail に含める — 指示書QA項目4)         ----
  {
    const errBefore = pageErrors.length;
    let g = null, gErr = null;
    try {
      g = await page.evaluate(() => {
        const s = HP.sim;
        HP.loadPreset('boxcomoving', false);        // overlays.boxGraph:true が既定(第32便プリセット更新)
        for (let k = 0; k < 300; k++) s.step(0.016);
        const ov = !!s.overlays.boxGraph;
        const slotsBox = HP.overlaySlots();
        HP.requestRender();                          // 操作相当(トグル等が呼ぶ経路)
        HP.tick(5);                                  // render() を直接複数回叩き drawBoxGraph を実行させる
        const bh = s.boxHist.length;
        HP.loadPreset('gclock', false);               // box 無しプリセット
        const slotsNoBox = HP.overlaySlots();
        return { ov, bh, slotsBox, slotsNoBox };
      });
    } catch (e) { gErr = String(e); }
    const errAfter = pageErrors.length;
    const i18n = await page.evaluate(() => {
      HP.setLang('en'); const en = HP.T('tgBoxGraph');
      HP.setLang('ja'); const ja = HP.T('tgBoxGraph');
      return { en, ja };
    });
    add('box.graph-overlay',
      !gErr && errAfter === errBefore && g && g.ov === true && g.bh >= 1
        && g.slotsBox.includes('boxGraph') && !g.slotsNoBox.includes('boxGraph')
        && i18n.en === 'Expansion graph (a, H, redshift)' && i18n.ja === '膨張グラフ(a・H・赤方偏移)',
      gErr ? `描画中に例外: ${gErr}` :
        `overlays.boxGraph=${g.ov} boxHist=${g.bh}件(≥1) slots(boxcomoving)=[${g.slotsBox}] slots(gclock)=[${g.slotsNoBox}]` +
        ` pageErrors増分=${errAfter - errBefore}(0期待) i18n ja="${i18n.ja}" en="${i18n.en}"`);
  }

  // ---- 第32便 W2) 箱宇宙パラメータ編集UI(パラメータタブの「箱宇宙(UniverseBox)」セクション) ----
  {
    let ed = null, eErr = null;
    try {
      ed = await page.evaluate(() => {
        const s = HP.sim;
        HP.loadPreset('boxcomoving', false);   // mode:exp
        const findRow = (labelKey) => Array.from(document.querySelectorAll('#paramRows .prow'))
          .find(rw => { const l = rw.querySelector('label'); return l && l.textContent === HP.T(labelKey); });
        const hasSection = !!findRow('boxH0Label');
        const dirtyBefore = document.getElementById('dirtyBadge').style.display;
        const h0Input = findRow('boxH0Label').querySelector('input');
        h0Input.value = '0.008'; h0Input.dispatchEvent(new Event('change', { bubbles: true }));
        const h0Set = s.box.H0;
        for (let k = 0; k < 30; k++) s.step(0.016);   // 「その後の step」で H が反映されているか
        const hAt = boxScaleAt(s.box, s.t).H;         // W1 純関数(グローバル)。exp モードは H=H0 一定
        const dirtyAfter = document.getElementById('dirtyBadge').style.display;
        // mode を pow に変更し coef/expo を設定
        const sel = findRow('boxModeLabel').querySelector('select');
        sel.value = 'pow'; sel.dispatchEvent(new Event('change', { bubbles: true }));
        const coefInput = findRow('boxCoefLabel').querySelector('input');
        const expoInput = findRow('boxExpoLabel').querySelector('input');
        coefInput.value = '0.05'; coefInput.dispatchEvent(new Event('change', { bubbles: true }));
        expoInput.value = '0.66'; expoInput.dispatchEvent(new Event('change', { bubbles: true }));
        const modeSet = s.box.mode, coefSet = s.box.coef, expoSet = s.box.expo;
        coefInput.value = '5'; coefInput.dispatchEvent(new Event('change', { bubbles: true }));  // 範囲外→クランプ
        const coefClamped = s.box.coef;
        coefInput.value = ''; coefInput.dispatchEvent(new Event('change', { bubbles: true }));   // 空文字→元の値
        const coefAfterEmpty = s.box.coef;
        // A/B比較中の編集は ab.simB.box にも反映される(エッジケース表)
        HP.abStart();
        const h0Input2 = findRow('boxH0Label').querySelector('input');
        h0Input2.value = '0.01'; h0Input2.dispatchEvent(new Event('change', { bubbles: true }));
        const abReflected = HP.ab().simB.box.H0 === 0.01;
        HP.abStop();
        const abGoneButBoxKept = s.box.H0 === 0.01;   // A/B終了後もsim.box編集は残る(paramsDirty継続)
        // gclock ではセクション非表示
        HP.loadPreset('gclock', false);
        const hasSectionGclock = !!Array.from(document.querySelectorAll('#paramRows .prow'))
          .find(rw => { const l = rw.querySelector('label'); return l && l.textContent === HP.T('boxH0Label'); });
        return { hasSection, dirtyBefore, dirtyAfter, h0Set, hAt, modeSet, coefSet, expoSet,
          coefClamped, coefAfterEmpty, abReflected, abGoneButBoxKept, hasSectionGclock };
      });
    } catch (e) { eErr = String(e); }
    add('box.edit-ui',
      !eErr && ed && ed.hasSection && ed.dirtyBefore !== 'inline-block' && ed.dirtyAfter === 'inline-block'
        && ed.h0Set === 0.008 && Math.abs(ed.hAt - 0.008) < 1e-9
        && ed.modeSet === 'pow' && ed.coefSet === 0.05 && Math.abs(ed.expoSet - 0.66) < 1e-9
        && ed.coefClamped === 1 && ed.coefAfterEmpty === 1 && ed.abReflected && ed.abGoneButBoxKept
        && !ed.hasSectionGclock,
      eErr ? `例外: ${eErr}` :
        `セクション表示=${ed.hasSection} dirty ${ed.dirtyBefore}→${ed.dirtyAfter} H0=${ed.h0Set}(boxScaleAtのH=${ed.hAt}) ` +
        `mode=${ed.modeSet} coef=${ed.coefSet} expo=${ed.expoSet} coef=5→${ed.coefClamped}(クランプ) coef=''→${ed.coefAfterEmpty}(据置) ` +
        `A/B中simB反映=${ed.abReflected} A/B終了後もsim.box維持=${ed.abGoneButBoxKept} gclockでは非表示=${!ed.hasSectionGclock}`);
  }

  // ---- 第32便 W2) 赤方偏移カラーバー・HUD表示: boxRedshift().z と #hud の "z=" 表示 ----
  {
    const r3 = await page.evaluate(() => {
      const s = HP.sim;
      HP.loadPreset('boxcomoving', false);
      for (let k = 0; k < 2000; k++) s.step(0.016);
      const rz = s.boxRedshift();
      return { z: rz.z, a: rz.a };
    });
    let hudText = '(timeout)';
    try {
      await page.waitForFunction(() => {
        const el = document.querySelector('#hud');
        return el && el.textContent.includes('z=');
      }, null, { timeout: 5000 });
      hudText = await page.evaluate(() => document.querySelector('#hud').textContent);
    } catch (e) { /* hudText stays '(timeout)' → fails the assertion below */ }
    add('box.redshift-bar', r3.z >= 0.1 && r3.a > 1.1 && hudText.includes('z='),
      `2000步後 z=${r3.z.toFixed(4)}(≥0.1) a=${r3.a.toFixed(4)}(>1.1) HUD="${hudText.replace(/\n/g, ' / ')}"`);
  }

  // ---- 第33便(台帳4-64): box.save-roundtrip — 箱パラメータのセーブ対応(実装3)。
  // ----     既存の保存処理(#btnSave の実UI経路)で保存 → universeBox が保存エントリに入る →
  // ----     別プリセットへ切替 → 保存一覧の「読込」(loadSave の実UI経路)で復元。
  // ----     旧形式セーブ(universeBox キー無し)の読込も同時に確認する(後方互換) ----
  {
    let sv = null, svErr = null;
    try {
      sv = await page.evaluate(() => {
        const s = HP.sim;
        localStorage.setItem('hp_saves', '[]');
        HP.loadPreset('boxcomoving', false);
        s.box.H0 = 0.008;                                          // 実行中の直接代入
        document.getElementById('saveName').value = 'qa_box_roundtrip';
        document.getElementById('btnSave').click();                 // 既存のセーブ処理(実UI経路)
        const saves = JSON.parse(localStorage.getItem('hp_saves') || '[]');
        const item = saves.find(x => x.name === 'qa_box_roundtrip');
        const savedOk = !!item && !!item.universeBox && item.universeBox.H0 === 0.008;
        HP.loadPreset('galaxy', false);                              // 別プリセット(箱なし)へ切替
        const boxGoneAfterSwitch = s.box === null;
        document.querySelector('#tabs button[data-tab=params]').click();  // タブを一旦切替(トグル閉じ対策)
        document.querySelector('#tabs button[data-tab=saves]').click();   // renderSaves() を再実行
        const row = [...document.querySelectorAll('#saveList .saveItem')]
          .find(d => d.querySelector('.name').textContent === 'qa_box_roundtrip');
        const loadBtn = row && [...row.querySelectorAll('button')].find(b => b.textContent === HP.T('btnLoad'));
        if (loadBtn) loadBtn.click();                                // loadSave(実UI経路)
        const restoredOk = s.box && s.box.H0 === 0.008;
        const histReset = s.boxHist && s.boxHist.length === 0;
        const aRefOk = s.box && Math.abs(s.boxARef - boxScaleAt(s.box, 0).a) < 1e-12;
        // 旧形式セーブ(universeBox キー無し)を読み込んでも従来どおり(プリセット既定 H0=0.004 のまま)
        document.querySelector('#tabs button[data-tab=params]').click();
        document.querySelector('#tabs button[data-tab=saves]').click();
        localStorage.setItem('hp_saves', JSON.stringify([{ name: 'qa_box_old', comment: '', savedAt: new Date().toISOString(),
          presetId: 'boxcomoving', presetName: 'x', physics: {}, cameraScale: 300 }]));
        HP.loadPreset('boxcomoving', false);
        s.box.H0 = 0.15;
        document.querySelector('#tabs button[data-tab=params]').click();
        document.querySelector('#tabs button[data-tab=saves]').click();
        const row2 = [...document.querySelectorAll('#saveList .saveItem')]
          .find(d => d.querySelector('.name').textContent === 'qa_box_old');
        const loadBtn2 = row2 && [...row2.querySelectorAll('button')].find(b => b.textContent === HP.T('btnLoad'));
        if (loadBtn2) loadBtn2.click();
        const oldFormatOk = s.box && s.box.H0 === 0.004;
        localStorage.setItem('hp_saves', '[]');
        document.querySelector('#tabs button[data-tab=saves]').click();   // パネルを閉じる(以降の項目に影響させない)
        return { savedOk, boxGoneAfterSwitch, restoredOk, histReset, aRefOk, oldFormatOk,
          h0Saved: item && item.universeBox ? item.universeBox.H0 : null, rowFound: !!row, row2Found: !!row2 };
      });
    } catch (e) { svErr = String(e); }
    add('box.save-roundtrip',
      !svErr && sv && sv.savedOk && sv.boxGoneAfterSwitch && sv.rowFound && sv.restoredOk && sv.histReset
        && sv.aRefOk && sv.row2Found && sv.oldFormatOk,
      svErr ? `例外: ${svErr}` :
        `保存エントリ universeBox.H0=${sv.h0Saved}(0.008期待)=${sv.savedOk} 切替後sim.box=null=${sv.boxGoneAfterSwitch} ` +
        `loadSave復元後 H0=0.008=${sv.restoredOk} boxHistリセット=${sv.histReset} boxARef再計算=${sv.aRefOk} ` +
        `旧形式セーブ(universeBox無し)読込→プリセット既定維持=${sv.oldFormatOk}`);
  }

  // ---- 第33便(台帳4-63): 光子の波長状態化 — 🔦boxredshift の A/B/C 思考実験 ----
  // ----          (ChatGPT レビュー §7 T-RS1/2/3/5 の統合。photonEmit 非対応の対象ではスキップ)----
  const hasPhoton = await page.evaluate(() => HP.allPresets().some(p => p.id === 'boxredshift'));
  if (hasPhoton) {
    const rp = await page.evaluate(() => {
      const s = HP.sim;
      HP.loadPreset('boxredshift', false);
      while (s.t < 75) s.step(0.016);
      const log = s.photonLog.map(e => ({ ...e }));
      const alive = s.photons.length, warn = s.photonWarn, nan = s.hasNaN();
      // T-RS5: universeBox を static にした同構成の対照 — 膨張が無ければ z=0(帳簿の意味論)
      const p2 = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'boxredshift')));
      p2.universeBox = Object.assign({}, p2.universeBox, { mode: 'static', H0: 0 });
      s.build(p2);
      while (s.t < 80) s.step(0.016);
      return { log, alive, warn, nan, logS: s.photonLog.map(e => ({ ...e })) };
    });
    const A = rp.log.find(e => e.from === 0), B = rp.log.find(e => e.from === 1);
    // ① 帳簿の厳密性(T-RS1): λ_obs/λ_emit は a_obs/a_emit に一致する
    const ledger = rp.log.length > 0 && rp.log.every(e => Math.abs(e.lamO / e.lamE - e.aO / e.aE) < 1e-9);
    const dT = (A && B) ? Math.abs(A.tO - B.tO) : NaN;
    const zStatic = rp.logS.length === 2 && rp.logS.every(e => Math.abs(e.z) < 1e-9);
    add('box.photon-abc',
      rp.log.length === 2 && !!A && !!B && !rp.nan && !rp.warn && ledger
      && Math.abs(A.z - 3) < 0.3 && Math.abs(B.z - 1) < 0.15 && dT < 8 && zStatic,
      (A && B)
        ? `到着2件 A(t放出=${A.tE.toFixed(1)}) z_A=${A.z.toFixed(4)}(3±0.3) λ ${A.lamE}→${A.lamO.toFixed(1)}nm a ${A.aE.toFixed(4)}→${A.aO.toFixed(4)} / `
          + `B(t放出=${B.tE.toFixed(3)}) z_B=${B.z.toFixed(4)}(1±0.15) λ ${B.lamE}→${B.lamO.toFixed(1)}nm a ${B.aE.toFixed(4)}→${B.aO.toFixed(4)} / `
          + `到着時刻 tO=${A.tO.toFixed(3)}・${B.tO.toFixed(3)} 差=${dT.toFixed(3)}(<8 ほぼ同時観測) `
          + `帳簿|λ比−a比|<1e-9=${ledger} static対照 z=0=${zStatic} 残存光子=${rp.alive} 範囲外警告=${rp.warn}`
        : `到着ログ=${rp.log.length}件(期待2) NaN=${rp.nan}`);

    // ---- 第33便: photonEmit の無いプリセットはゼロコスト経路(状態を一切持たない)----
    const zc = await page.evaluate(() => {
      HP.loadPreset('galaxy', false); const s = HP.sim;
      for (let k = 0; k < 60; k++) s.step(0.016);
      return { p: s.photons === null, l: s.photonLog === null, sc: s._phSched === null };
    });
    add('box.photon-zero-cost', zc.p && zc.l && zc.sc,
      `🌌galaxy: photons=${zc.p ? 'null' : '非null'} photonLog=${zc.l ? 'null' : '非null'} _phSched=${zc.sc ? 'null' : '非null'}`);

    // ---- 第33便: FLRW 摩擦比較モード(universeBox.friction)は外部場バッジ扱い ----
    const fb = await page.evaluate(() => {
      const mk = (fr) => ({ name: 'flrw', description: 'universeBox.friction 検査', camera: { scale: 300 },
        world: { boundary: 'none', size: 0 }, physics: {},
        universeBox: Object.assign({ mode: 'exp', H0: 0.01, D: 80 }, fr === undefined ? {} : { friction: fr }),
        bodies: [{ type: 'single', m: 1, x: 100, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      const v1 = HP.validatePreset(mk('flrw')), v2 = HP.validatePreset(mk(undefined)), v3 = HP.validatePreset(mk('nope'));
      return { ok: v1.ok && v2.ok && v3.ok,
        f1: v1.ok ? v1.preset.universeBox.friction : null, g1: v1.ok ? HP.externalTags(v1.preset).grav : null,
        f2: v2.ok ? v2.preset.universeBox.friction : null, g2: v2.ok ? HP.externalTags(v2.preset).grav : null,
        f3: v3.ok ? v3.preset.universeBox.friction : null, w3: v3.ok ? v3.warnings.length : 0,
        gGal: HP.externalTags(HP.allPresets().find(p => p.id === 'galaxy')).grav,
        gBox: HP.externalTags(HP.allPresets().find(p => p.id === 'boxredshift')).grav };
    });
    add('box.flrw-badge',
      fb.ok && fb.f1 === 'flrw' && fb.g1 === true && fb.f2 === 'dfm' && fb.g2 === false
      && fb.f3 === 'dfm' && fb.w3 >= 1 && fb.gGal === false && fb.gBox === false,
      `friction=flrw→grav=${fb.g1}(外部場) 未指定→${fb.f2}/grav=${fb.g2} 不正値→${fb.f3}(警告${fb.w3}件) 既定dfmのgrav: 🌌=${fb.gGal} 🔦=${fb.gBox}`);

    // ---- 第33便(実装1): box.photon-draw — 光子の描画(render())とwavelengthColorの配色 ----
    // ----     boxredshift を load→tick(光子が生存中に render を複数回叩く)→ さらに到着まで
    // ----     進めて pageErrors の増分が0であることを確認する。wavelengthColor(500) は緑系 ----
    {
      const errBefore = pageErrors.length;
      let pd = null, pdErr = null;
      try {
        pd = await page.evaluate(() => {
          const s = HP.sim;
          HP.loadPreset('boxredshift', false);
          for (let k = 0; k < 400; k++) s.step(0.016);   // t≈6.4: Aの光子のみ生存中(Bはまだ未放出)
          const aliveDuring = s.photons.length;
          HP.requestRender(); HP.tick(5);                 // 光子が生存中に render() を複数回叩く
          for (let k = 0; k < 4200; k++) {                 // t≈75まで進め、到着(photonLog計上)を経由
            s.step(0.016);
            if (k % 200 === 0) { HP.requestRender(); HP.tick(1); }
          }
          const wc = wavelengthColor(500);
          const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(wc);
          const rgb = m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
          return { aliveDuring, wc, rgb, logLen: s.photonLog.length, nan: s.hasNaN() };
        });
      } catch (e) { pdErr = String(e); }
      const errAfter = pageErrors.length;
      const isHex = pd && /^#[0-9a-f]{6}$/i.test(pd.wc);
      const greenMax = pd && pd.rgb && pd.rgb[1] > pd.rgb[0] && pd.rgb[1] > pd.rgb[2];
      add('box.photon-draw',
        !pdErr && errAfter === errBefore && pd && !pd.nan && pd.aliveDuring > 0 && pd.logLen === 2 && isHex && greenMax,
        pdErr ? `描画中に例外: ${pdErr}` :
          `pageErrors増分=${errAfter - errBefore}(0期待) 生存中の光子=${pd.aliveDuring}件(render複数回) ` +
          `到着ログ=${pd.logLen}件 wavelengthColor(500)=${pd.wc}(RGB=${pd.rgb}・G成分最大=${greenMax}) NaN=${pd.nan}`);
    }
  } else {
    console.log('SKIP 第33便系(box.photon-abc / box.photon-zero-cost / box.flrw-badge / box.photon-draw — 対象に photonEmit 対応の箱宇宙サンプルなし)');
  }
  } else {
    console.log('SKIP 第31/32/33便系(box.trans-clocks / box.rot-support / box.expand-sqrt / box.breath-return / box.schema-clamp / box.redshift / box.hist / box.graph-overlay / box.edit-ui / box.redshift-bar / box.save-roundtrip / box.photon-abc / box.photon-zero-cost / box.flrw-badge / box.photon-draw — 対象に箱宇宙プリセットなし)');
  }
}

// ---- 7h1b) 第35便(台帳4-62): 可逆積分器(leapfrog/KDK)の既定経路不変 ----
// ----   integrator 省略時("semi")は本便の変更前と1ビットも変わらないことを位置ハッシュで固定する。
// ----   基準ハッシュは実装前の beta/index.html(第34便 v1.32 相当)で採取した実測値。
// ----   ルート・beta のどちらでも同一(採取時に両対象で一致を確認済み)なので対象ガードは付けない。
{
  const gh = await page.evaluate(() => {
    HP.loadPreset('gas', false);                       // 代表既定プリセット(N=240・integrator 無指定)
    const s = HP.sim;
    for (let k = 0; k < 300; k++) s.step(0.016);       // 300步(dt=0.016 固定 — timeScale に依存しない)
    const a = [];
    for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i]);
    return { n: s.n, t: s.t, str: a.map(v => v.toExponential(12)).join(',') };
  });
  const hash = crypto.createHash('sha256').update(gh.str).digest('hex');
  // 実装前(第35便 W2 着手時)の実測: n=240 / t=4.800000000000003 / 下記ハッシュ
  const BASE = '2bd01bdf714c2599b53477806a4863f04ceadfaf1102d189be27d2a86fbe042b';
  add('integrator.default-unchanged', gh.n === 240 && hash === BASE,
    `🔥gas 300步 位置ハッシュ=${hash.slice(0, 16)}…(基準=${BASE.slice(0, 16)}… bit一致=${hash === BASE}) n=${gh.n}`);
}

// ---- 7h1c) 第35便(台帳4-62): Loschmidt echo — 可逆積分器と時間の矢 ----
// ----   ⏪echo プリセット(A条件: muF=0・leapfrog)は t=echoFlipAt で v・s を反転すると
// ----   同じ步数で初期配置へ戻る。semi 経路・摩擦入りでは戻らない。
// ----   (echo プリセットの無い対象〔ルート=v1.32〕ではスキップ)----
{
  const hasEcho = await page.evaluate(() => HP.allPresets().some(p => p.id === 'echo'));
  if (hasEcho) {
    const r = await page.evaluate(() => {
      const s = HP.sim;
      const base = () => JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'echo')));
      // V10(第一法則の閉性)と同一の帳簿式。⏪echo は kRep=0・kFrame=0・散逸ゼロなので
      // 並進 + 回転 + E4ポテンシャル + E9法線ばね で全エネルギーが閉じる
      const energyOf = () => {
        const eps2 = s.params.softening * s.params.softening, G = s.params.G;
        let E = 0;
        for (let i = 0; i < s.n; i++) {
          E += 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]);
          E += 0.25 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];   // ½·I·s²、I=½mR²
        }
        for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
          const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j], d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
          E -= G * s.m[i] * s.m[j] / Math.sqrt(d2 + eps2);
          const sumR = s.R[i] + s.R[j];
          if (d < sumR) {
            const muM = s.m[i] * s.m[j] / (s.m[i] + s.m[j]);
            const maxInv = Math.max(1 / s.m[i], 1 / s.m[j]);
            const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
            E += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC);
          }
        }
        return E;
      };
      const eScale = () => {
        let E = 1;
        for (let i = 0; i < s.n; i++) E += 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i])
          + 0.25 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];
        for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
          const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j];
          E += s.params.G * s.m[i] * s.m[j] / Math.sqrt(dx * dx + dy * dy + s.params.softening * s.params.softening);
        }
        return E;
      };
      // 反転が起きた步数 N をそのまま巻き戻し步数に使う(t の丸めに依存しない対称な往復)
      const echoRun = (p) => {
        s.build(p);
        const Es = eScale(), E0 = energyOf();
        let k = 0;
        while (!s.echoFlipped && k < 40000) { s.step(0.016); k++; }
        const rmsFlip = s.echoRMS, tFlip = s.t;
        for (let q = 0; q < k; q++) s.step(0.016);
        return { steps: k, tFlip, rmsFlip, rms: s.echoRMS, nan: s.hasNaN(), integ: s.integrator,
          eDrift: Math.abs(energyOf() - E0) / Es };
      };
      const out = {};
      out.lf = echoRun(base());                                              // A条件(プリセット既定)
      { const p = base(); p.integrator = 'semi'; out.semi = echoRun(p); }    // 同一構成・semi 差し替え
      { const p = base(); p.physics.muF = 0.3; out.fric = echoRun(p); }      // B条件(摩擦あり)
      out.preset = { integ: base().integrator, flip: base().echoFlipAt, n: out.lf.steps > 0 ? s.n : 0 };
      return out;
    });
    // 実測 2026-07-26(beta/index.html 第35便 W2): leapfrog RMS=1.3036e-3(反転時の平均ずれ 33.88)
    // → 閾値 0.01 は実測の約7.7倍(1桁の余裕)。t=2·echoFlipAt=40.03 まで 1251步×2。
    add('echo.leapfrog-return',
      !r.lf.nan && r.lf.integ === 'leapfrog' && r.lf.rmsFlip > 10 && r.lf.rms < 0.01,
      `⏪A条件(leapfrog・muF=0): 反転時RMS=${r.lf.rmsFlip.toFixed(2)}(>10 十分動いた) → 復帰後RMS=`
      + `${r.lf.rms.toExponential(3)}(< 0.01 — 実測1.30e-3) 反転步数=${r.lf.steps} t_flip=${r.lf.tFlip.toFixed(3)}`);
    // 実測: semi RMS=0.9243 → 比 709(可逆積分器がなければエコーは成立しない)。閾値 100 は約7倍の余裕
    add('echo.semi-noreturn',
      !r.semi.nan && r.semi.integ === 'semi' && r.semi.rms >= 100 * r.lf.rms,
      `同一構成 integrator="semi": RMS=${r.semi.rms.toExponential(3)} / leapfrog=${r.lf.rms.toExponential(3)} `
      + `= ${(r.semi.rms / r.lf.rms).toFixed(0)}倍(≥100 — 実測709倍)`);
    // 実測: muF=0.3 で RMS=10.79(閾値 1 の約10.8倍)。散逸を入れた途端に時間の矢が立つ
    add('echo.friction-noreturn', !r.fric.nan && r.fric.rms > 1,
      `⏪B条件(leapfrog・muF=0.3): 復帰後RMS=${r.fric.rms.toFixed(3)}(> 1 — 実測10.79。散逸で戻らない)`);
    // 実測: 相対エネルギードリフト 1.77e-8(閾値 1e-3 に対し5桁の余裕)= leapfrog のシンプレクティック性
    add('echo.energy', !r.lf.nan && r.lf.eDrift < 1e-3,
      `A条件 反転前後を通した |ΔE_総|/E_scale=${r.lf.eDrift.toExponential(2)}(< 1e-3 — 実測1.77e-8) `
      + `semi は ${r.semi.eDrift.toExponential(2)}`);

    // ---- integrator/echoFlipAt のスキーマクランプ(box.schema-clamp と同じ形式)----
    const sc = await page.evaluate(() => {
      const mk = (extra) => Object.assign({ name: 'echo', description: 'integrator スキーマ検査',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }, extra);
      const bad = HP.validatePreset(mk({ integrator: 'bogus', echoFlipAt: 'x' }));
      const good = HP.validatePreset(mk({ integrator: 'leapfrog', echoFlipAt: 999999 }));
      const none = HP.validatePreset(mk({}));
      return { badOk: bad.ok, badInteg: bad.preset && bad.preset.integrator,
        badFlip: bad.preset && bad.preset.echoFlipAt, badWarns: bad.warnings.length,
        goodOk: good.ok, goodInteg: good.preset && good.preset.integrator,
        goodFlip: good.preset && good.preset.echoFlipAt,
        noneOk: none.ok, noneInteg: none.preset && none.preset.integrator };
    });
    add('echo.schema-clamp',
      sc.badOk && sc.badInteg === 'semi' && sc.badFlip === undefined && sc.badWarns >= 2
      && sc.goodOk && sc.goodInteg === 'leapfrog' && sc.goodFlip === 100000
      && sc.noneOk && sc.noneInteg === undefined,
      `不正 integrator="bogus"→"${sc.badInteg}" 非数 echoFlipAt→${sc.badFlip}(無視) 警告${sc.badWarns}件 / `
      + `正常 "leapfrog"→"${sc.goodInteg}" echoFlipAt 999999→${sc.goodFlip}(上限クランプ) / 省略→${sc.noneInteg}(未設定=semi扱い)`);

    // ---- HUD: echoFlipAt を持つプリセットだけ "echo RMS=" と反転済みマークを出す(ja/en)----
    let hudJa = '(timeout)', hudEn = '(timeout)', hudOther = '(timeout)';
    try {
      await page.evaluate(() => {
        HP.loadPreset('echo', false); const s = HP.sim;
        while (!s.echoFlipped && s.t < 100) s.step(0.016);   // 反転済みの状態にする
      });
      await page.waitForFunction(() => {
        const el = document.querySelector('#hud');
        return el && el.textContent.includes('echo RMS=');
      }, null, { timeout: 5000 });
      hudJa = await page.evaluate(() => document.querySelector('#hud').textContent);
      await page.evaluate(() => HP.setLang('en'));
      await page.waitForFunction(() => {
        const el = document.querySelector('#hud');
        return el && el.textContent.includes('reversed');
      }, null, { timeout: 5000 });
      hudEn = await page.evaluate(() => document.querySelector('#hud').textContent);
      await page.evaluate(() => { HP.setLang('ja'); HP.loadPreset('gclock', false); });
      await page.waitForFunction(() => {
        const el = document.querySelector('#hud');
        return el && !el.textContent.includes('echo RMS=');
      }, null, { timeout: 5000 });
      hudOther = await page.evaluate(() => document.querySelector('#hud').textContent);
    } catch (e) { /* '(timeout)' のままで下の判定が FAIL する */ }
    add('echo.hud',
      hudJa.includes('echo RMS=') && hudJa.includes('反転済み↩︎')
      && hudEn.includes('echo RMS=') && hudEn.includes('reversed ↩︎')
      && !hudOther.includes('echo RMS='),
      `ja HUD="${hudJa.replace(/\n/g, ' / ')}" en HUD="${hudEn.replace(/\n/g, ' / ')}" `
      + `⏱️gclock(echoFlipAt なし)に echo 行なし=${!hudOther.includes('echo RMS=')}`);
  } else {
    console.log('SKIP 第35便系(echo.leapfrog-return / echo.semi-noreturn / echo.friction-noreturn / echo.energy / echo.schema-clamp / echo.hud — 対象に ⏪echo プリセットなし)');
  }
}

// ---- 7h1d) 第35便(台帳4-61): 自由な箱 — 膨張の動力学化(BOX_UNIVERSE §4.2/§10.1)----
// ----   🕊️freebox は universeBox(規定 a(t))を持たない。壁リングは pinned:false の自由粒子で、
// ----   膨張則は E4(自己重力)と E5′(スピン斥力=圧力)から解かれる。実測尺度因子
// ----   a_eff=⟨r⟩/⟨r⟩₀ は measureBox で boxHist に積まれる(= 膨張グラフがそのまま実測を描く)。
// ----   (freebox プリセットの無い対象〔ルート=v1.32〕ではスキップ — box.*/echo.* と同方式)----
{
  const hasFreebox = await page.evaluate(() => HP.allPresets().some(p => p.id === 'freebox'));
  if (hasFreebox) {
    const r = await page.evaluate(() => {
      const s = HP.sim;
      const base = () => JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'freebox')));
      // 保存量の尺度。V1(HP.verify.v1)と同じ「Δ(保存量+帳簿)/スケール」の書式だが、
      // L のスケールだけ打ち消し前の項の絶対値和を使う(この宇宙の壁は純動径運動なので
      // V1 式の |m(x·v_y−y·v_x)| は 0 に潰れ、ドリフトの出所である軌道項が尺度から消えるため)
      const scales = () => {
        let pS = 0, lS = 0;
        for (let i = 0; i < s.n; i++) {
          pS += s.m[i] * Math.hypot(s.vx[i], s.vy[i]);
          lS += Math.abs(s.m[i] * s.x[i] * s.vy[i]) + Math.abs(s.m[i] * s.y[i] * s.vx[i])
              + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]);
        }
        return { pS, lS };
      };
      const run = (p, steps) => {
        s.build(p);
        const t0 = s.totals(), sc0 = scales();
        for (let k = 0; k < steps; k++) s.step(0.016);
        const h = s.boxHist || [], t1 = s.totals(), sc1 = scales();
        const half = Math.floor(h.length / 2);
        const Hof = (i0, i1) => Math.log(h[i1].a / h[i0].a) / (h[i1].t - h[i0].t);
        let mono = true, aMax = 0, aMaxT = 0;
        for (let i = 0; i < h.length; i++) {
          if (i && !(h[i].a > h[i - 1].a)) mono = false;
          if (h[i].a > aMax) { aMax = h[i].a; aMaxT = h[i].t; }
        }
        // 壁リングの動径偏差(座屈していないこと — ⟨r⟩ のロバスト性の担保)
        const i0 = s.wallI0, i1 = s.wallI1, nW = i1 - i0;
        let cx = 0, cy = 0;
        for (let i = i0; i < i1; i++) { cx += s.x[i]; cy += s.y[i]; }
        cx /= nW; cy /= nW;
        let mean = 0; const rr = [];
        for (let i = i0; i < i1; i++) { const q = Math.hypot(s.x[i] - cx, s.y[i] - cy); rr.push(q); mean += q; }
        mean /= nW;
        let dev = 0; for (const q of rr) dev += Math.abs(q - mean);
        return {
          n: s.n, wall: [i0, i1], measureBox: s.measureBox, histLen: h.length,
          aEff: s.boxAEff(), aLast: h.length ? h[h.length - 1].a : null,
          H1: Hof(0, half), H2: Hof(half, h.length - 1), mono, aMax, aMaxT,
          dev: dev / nW / mean, nan: s.hasNaN(), t: s.t,
          P0: Math.hypot(t0.px, t0.py), P0rel: Math.hypot(t0.px, t0.py) / sc0.pS,
          relP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / sc1.pS,
          relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / sc1.lS,
          dLrel0: Math.abs(t1.L + s.resL + s.radL - t0.L) / Math.max(Math.abs(t0.L), 1e-9),
          ledger: [s.resPx, s.resPy, s.resL, s.radE, s.radL]
        };
      };
      const out = {};
      out.B = run(base(), 1200);                                       // 既定 = 圧力駆動(kRep=0.5)
      { const p = base(); p.physics.kRep = 0; out.A = run(p, 1200); }  // A/B の A 側 physics(圧力オフ)
      // 箱なしプリセットでは measureBox 経路が一切動かない(ゼロコスト経路の確認)
      HP.loadPreset('galaxy', false);
      out.noBox = { measureBox: s.measureBox, hist: s.boxHist, aEff: s.boxAEff(), wall: [s.wallI0, s.wallI1] };
      return out;
    });
    // 実測 2026-07-26(beta/index.html 第35便 W3・1200步=t19.2・dt=0.016 固定・決定論的):
    //   B(既定 kRep=0.5): a_eff=2.1795(単調増加・H_eff 0.031794→0.051397 の加速)
    //   閾値 1.15 は実測の伸び (2.1795−1)/(1.15−1) = 7.9 倍の余裕
    add('freebox.pressure-expand',
      !r.B.nan && r.B.measureBox === true && r.B.histLen >= 40 && r.B.mono && r.B.aLast > 1.15
      && r.B.dev < 0.01,
      `🕊️既定(kRep=0.5・壁スピン1.0): 実測 a_eff=${r.B.aLast.toFixed(4)}(> 1.15 — 実測2.1795・単調増加=${r.B.mono}) `
      + `H_eff 前半${r.B.H1.toExponential(3)}→後半${r.B.H2.toExponential(3)}(圧力駆動で加速) `
      + `壁リング動径偏差=${(r.B.dev * 100).toFixed(3)}%(< 1% 座屈なし) 履歴${r.B.histLen}点 t=${r.B.t.toFixed(2)}`);
    // 実測: A(kRep=0)は t=9.2 の a_eff=1.0047 で頭打ち → H_eff が +4.422e-4 → −5.278e-4 と符号反転。
    // 判定は「前半 > 後半」(指示書)に加え「前半 > 0 > 後半」(減速膨張 → 再収縮)まで確認する
    add('freebox.inertial-decel',
      !r.A.nan && r.A.H1 > r.A.H2 && r.A.H1 > 0 && r.A.H2 < 0 && r.A.aMax > 1,
      `🕊️A条件(kRep=0 — 圧力オフ・外向き初速 v=0.001·r のみ): H_eff 前半=${r.A.H1.toExponential(3)}(>0) `
      + `→ 後半=${r.A.H2.toExponential(3)}(<0 — 自己重力による減速膨張から再収縮へ) `
      + `a_eff 最大=${r.A.aMax.toFixed(4)}(t=${r.A.aMaxT.toFixed(1)})→末尾${r.A.aLast.toFixed(4)}`);
    // 実測(B・1200步): 帳簿は厳密に全ゼロ(外部チャネルなし)・|ΣP|(t=0)=7.9e-7(相対 3.1e-9)・
    // |ΔP|/P_scale=3.28e-8・|ΔL|/L_scale=4.36e-8。閾値 1e-6 は実測の 23〜320 倍の余裕。
    // 参考: |ΔL|/|L(0)| は 2.62e-5(L は大半がスピン項で、ドリフトは軌道項の float32 丸め由来)
    add('freebox.conservation',
      !r.B.nan && r.B.ledger.every(v => v === 0) && r.B.P0rel < 1e-6 && r.B.relP < 1e-6 && r.B.relL < 1e-6,
      `🕊️既定 1200步: 帳簿=[${r.B.ledger.join(',')}](全0 — 全自由・完全閉鎖系) `
      + `|ΣP|(t=0)=${r.B.P0.toExponential(2)}(相対${r.B.P0rel.toExponential(2)} < 1e-6) `
      + `|ΔP|/P_scale=${r.B.relP.toExponential(2)} |ΔL|/L_scale=${r.B.relL.toExponential(2)}(< 1e-6) `
      + `参考 |ΔL|/|L₀|=${r.B.dLrel0.toExponential(2)}`);
    // 自由な箱が「外部駆動」と誤表示されないこと(pinned/rail/bath/一様重力すべて無し)
    const tg = await page.evaluate(() => {
      const p = HP.allPresets().find(q => q.id === 'freebox');
      const ex = HP.externalTags(p);
      return { ...ex, hasBox: p.universeBox !== undefined, meas: p.measureBox === true,
        wallPinned: p.bodies[0].pinned, wallRail: p.bodies[0].railH !== undefined };
    });
    add('freebox.no-rail-badge',
      tg.rail === false && tg.pin === 0 && tg.bath === false && tg.grav === false
      && tg.hasBox === false && tg.meas === true && tg.wallPinned === false && tg.wallRail === false,
      `externalTags(freebox)= rail=${tg.rail} pin=${tg.pin} bath=${tg.bath} grav=${tg.grav}(全て外部駆動なし) `
      + `universeBox なし=${!tg.hasBox} measureBox=${tg.meas} 壁 pinned=${tg.wallPinned}/railH無し=${!tg.wallRail}`);
    // measureBox のスキーマ検査(echo.schema-clamp / box.schema-clamp と同じ形式)
    const sc = await page.evaluate(() => {
      const ring = (extra) => Object.assign({ type: 'ring', n: 8, cx: 0, cy: 0, rIn: 100, rOut: 100,
        mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, omega: 0,
        vNoise: 0, direction: 1, pinned: false }, extra);
      const mk = (extra, bodies) => Object.assign({ name: 'fb', description: 'measureBox スキーマ検査',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: {},
        bodies: bodies || [ring({})] }, extra);
      const good = HP.validatePreset(mk({ measureBox: true }));
      const bad = HP.validatePreset(mk({ measureBox: 'yes' }));
      const none = HP.validatePreset(mk({}));
      // universeBox 併用: 規定 a(t) を優先し measureBox は無視+警告(エッジケース表)
      const both = HP.validatePreset(mk({ measureBox: true, universeBox: { mode: 'exp', H0: 0.004 } }));
      // integrator(第35便 W2)との併用は可
      const withInteg = HP.validatePreset(mk({ measureBox: true, integrator: 'leapfrog' }));
      // ring の vMode="hubble" + vScale(値域クランプ)
      const hub = HP.validatePreset(mk({}, [ring({ vMode: 'hubble', vScale: 99 })]));
      return { goodOk: good.ok, goodM: good.preset && good.preset.measureBox,
        badOk: bad.ok, badM: bad.preset && bad.preset.measureBox, badWarns: bad.warnings.length,
        noneM: none.preset && none.preset.measureBox,
        bothOk: both.ok, bothM: both.preset && both.preset.measureBox, bothWarns: both.warnings.length,
        integOk: withInteg.ok, integM: withInteg.preset && withInteg.preset.measureBox,
        integI: withInteg.preset && withInteg.preset.integrator,
        hubOk: hub.ok, hubMode: hub.ok && hub.preset.bodies[0].vMode,
        hubScale: hub.ok && hub.preset.bodies[0].vScale };
    });
    add('freebox.schema',
      sc.goodOk && sc.goodM === true && sc.badOk && sc.badM === undefined && sc.badWarns >= 1
      && sc.noneM === undefined && sc.bothOk && sc.bothM === false && sc.bothWarns >= 1
      && sc.integOk && sc.integM === true && sc.integI === 'leapfrog'
      && sc.hubOk && sc.hubMode === 'hubble' && sc.hubScale === 50,
      `measureBox true→${sc.goodM} / 非真偽値"yes"→${sc.badM}(無視・警告${sc.badWarns}件) / 省略→${sc.noneM} / `
      + `universeBox 併用→${sc.bothM}(規定 a(t) 優先・警告${sc.bothWarns}件) / integrator 併用→${sc.integM}+"${sc.integI}" / `
      + `ring vMode="${sc.hubMode}" vScale 99→${sc.hubScale}(上限クランプ)`);
    // 膨張グラフが「実測」表示で a_eff 曲線を描く(受け入れ条件: 規定 a(t) との区別表示)
    {
      const errBefore = pageErrors.length;
      let g = null, gErr = null;
      try {
        g = await page.evaluate(() => {
          const s = HP.sim;
          HP.loadPreset('freebox', false);
          for (let k = 0; k < 600; k++) s.step(0.016);
          const slotsFb = HP.overlaySlots();
          HP.requestRender(); HP.tick(5);            // render() を叩いて drawBoxGraph を実行
          return { ov: !!s.overlays.boxGraph, slotsFb, hist: s.boxHist.length,
            aEff: s.boxAEff(), zAllZero: s.boxHist.every(p => p.z === 0),
            redshiftNull: s.boxRedshift() === null };
        });
      } catch (e) { gErr = String(e); }
      const errAfter = pageErrors.length;
      // HUD の実測表示(a_eff=…(実測))。rAF ループが 10 フレームごとに書くので待つ
      let hud = '(timeout)', hudOther = '(timeout)';
      try {
        await page.waitForFunction(() => {
          const el = document.querySelector('#hud');
          return el && el.textContent.includes('a_eff=');
        }, null, { timeout: 5000 });
        hud = await page.evaluate(() => document.querySelector('#hud').textContent);
        await page.evaluate(() => HP.loadPreset('boxcomoving', false));   // 規定 a(t) 側には出ない
        await page.waitForFunction(() => {
          const el = document.querySelector('#hud');
          return el && !el.textContent.includes('a_eff=');
        }, null, { timeout: 5000 });
        hudOther = await page.evaluate(() => document.querySelector('#hud').textContent);
      } catch (e) { /* '(timeout)' のままで下の判定が FAIL する */ }
      const i18n = await page.evaluate(() => {
        HP.setLang('en'); const en = [HP.T('ovBoxMeas'), HP.T('ovBoxMeasNote')];
        HP.setLang('ja'); const ja = [HP.T('ovBoxMeas'), HP.T('ovBoxMeasNote')];
        return { en, ja };
      });
      add('freebox.graph-measured',
        !gErr && errAfter === errBefore && g && g.ov === true && g.slotsFb.includes('boxGraph')
        && g.hist >= 20 && g.aEff > 1 && g.zAllZero && g.redshiftNull
        && i18n.ja[0] === '実測' && i18n.en[0] === 'measured'
        && hud.includes('a_eff=') && hud.includes('(実測)') && !hudOther.includes('a_eff='),
        gErr ? `描画中に例外: ${gErr}` :
          `slots=[${g.slotsFb}](boxGraph あり — universeBox 無しでも measureBox で有効) 履歴${g.hist}点 `
          + `a_eff=${g.aEff.toFixed(4)} 赤方偏移は非適用(z 全0=${g.zAllZero} boxRedshift()=null=${g.redshiftNull}) `
          + `HUD="${hud.split('\n')[0]}" 🫧boxcomoving(規定a)には a_eff 行なし=${!hudOther.includes('a_eff=')} `
          + `i18n ja="${i18n.ja[0]}"/en="${i18n.en[0]}" pageErrors増分=${errAfter - errBefore}(0期待)`);
    }
    // 箱なしプリセットは measureBox 経路に一切入らない(既存挙動不変の担保)
    add('freebox.zero-cost-elsewhere',
      r.noBox.measureBox === false && r.noBox.hist === null && r.noBox.aEff === null && r.noBox.wall[0] === -1,
      `🌌galaxy: measureBox=${r.noBox.measureBox} boxHist=${r.noBox.hist} boxAEff()=${r.noBox.aEff} 壁タグ=[${r.noBox.wall}]`);
  } else {
    console.log('SKIP 第35便系(freebox.pressure-expand / freebox.inertial-decel / freebox.conservation / freebox.no-rail-badge / freebox.schema / freebox.graph-measured / freebox.zero-cost-elsewhere — 対象に 🕊️freebox プリセットなし)');
  }
}

// ---- 7h1e) 第35便 W4(台帳4-54/4-55): サンプル分類バッジ + 描画専用半径スケール ----
// ----   classifyPreset/drawScale は beta 先行機能(root=旧版には存在しない)。hasEcho/
// ----   hasFreebox と同方式で「機能そのものの有無」をガードにする(対象プリセットの有無ではなく
// ----   HP.classifyPreset の有無・S.drawScale フィールドの有無で判定)----
const hasBadgeClassify = await page.evaluate(() => typeof HP.classifyPreset === 'function');
const hasDrawScale = await page.evaluate(() => 'drawScale' in HP.sim);

// ---- 4-54) classifyPreset(p) = {layers, external, closed} を代表プリセットで検証する。
// ----   layers はプリセットJSONから自動判定(core/extension/background/semantic/comparison)。
// ----   mercury/saturnZonalD68/boxcomoving/boxredshift/fig8/gclock は全対象に常在するので
// ----   プリセットの有無は問わない。echo/freebox(第35便 W2/W3)は存在するときだけ
// ----   core+閉鎖系を追加検証 ----
if (hasBadgeClassify) {
  const r = await page.evaluate(() => {
    const P = (id) => HP.allPresets().find((p) => p.id === id);
    const cl = (id) => {
      const c = HP.classifyPreset(P(id));
      return { layers: c.layers, closed: c.closed, pin: c.external.pin, rail: c.external.rail };
    };
    const out = {
      mercury: cl('mercury'), saturnZonalD68: cl('saturnZonalD68'),
      boxcomoving: cl('boxcomoving'), boxredshift: cl('boxredshift'),
      fig8: cl('fig8'), gclock: cl('gclock'),
    };
    const hasEcho = !!P('echo'), hasFreebox = !!P('freebox');
    if (hasEcho) out.echo = cl('echo');
    if (hasFreebox) out.freebox = cl('freebox');
    return { out, hasEcho, hasFreebox };
  });
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const checks = [
    ['☿mercury=extension', eq(r.out.mercury.layers, ['extension'])],
    ['🛰️saturnZonalD68=extension', eq(r.out.saturnZonalD68.layers, ['extension'])],
    ['🫧boxcomoving=background', eq(r.out.boxcomoving.layers, ['background'])],
    ['🔦boxredshift=background+semantic', eq(r.out.boxredshift.layers, ['background', 'semantic'])],
    ['♾️fig8=core+closed', eq(r.out.fig8.layers, ['core']) && r.out.fig8.closed === true],
    ['⏱️gclock=core+外部駆動(pinned)', eq(r.out.gclock.layers, ['core']) && r.out.gclock.pin > 0 && r.out.gclock.closed === false],
  ];
  if (r.hasEcho) checks.push(['⏪echo=core+closed', eq(r.out.echo.layers, ['core']) && r.out.echo.closed === true]);
  if (r.hasFreebox) checks.push(['🕊️freebox=core+closed', eq(r.out.freebox.layers, ['core']) && r.out.freebox.closed === true]);
  const bad = checks.filter(([, ok]) => !ok).map(([n]) => n);
  add('badge.classify', bad.length === 0,
    checks.map(([n, ok]) => `${n}:${ok ? 'OK' : 'NG'}`).join(' ')
    + ` / 実測: mercury=${JSON.stringify(r.out.mercury.layers)} saturnZonalD68=${JSON.stringify(r.out.saturnZonalD68.layers)}`
    + ` boxcomoving=${JSON.stringify(r.out.boxcomoving.layers)} boxredshift=${JSON.stringify(r.out.boxredshift.layers)}`
    + ` fig8=${JSON.stringify(r.out.fig8.layers)}(closed=${r.out.fig8.closed}) gclock=${JSON.stringify(r.out.gclock.layers)}(pin=${r.out.gclock.pin},closed=${r.out.gclock.closed})`
    + (r.hasEcho ? ` echo=${JSON.stringify(r.out.echo.layers)}(closed=${r.out.echo.closed})` : ' echo=(対象になし)')
    + (r.hasFreebox ? ` freebox=${JSON.stringify(r.out.freebox.layers)}(closed=${r.out.freebox.closed})` : ' freebox=(対象になし)'));
} else {
  console.log('SKIP badge.classify(対象に HP.classifyPreset なし — 第35便 W4 未適用の root 等)');
}

// ---- 4-54続き) badge.no-hscroll: バッジのチップ列を含む説明タブが viewport 390px で
// ----   横スクロールを出さない(ui.aitab-no-hscroll と同じ書式)。🔦boxredshift は
// ----   background+semantic+外部駆動(universeBox.mode="exp")の3チップを持つので折返しの
// ----   検証に十分な件数がある(プリセット自体は対象を問わず常在)----
if (hasBadgeClassify) {
  const r = await page.evaluate(() => {
    HP.loadPreset('boxredshift', false);
    document.querySelector('#tabs button[data-tab=help]').click();
    const tab = document.querySelector('#page-help');
    const bad = [...tab.querySelectorAll('*')].filter((e) => e.scrollWidth > e.clientWidth + 1)
      .map((e) => `${e.tagName}#${e.id || '(no-id)'}.${String(e.className).split(' ')[0] || ''} sw=${e.scrollWidth}/cw=${e.clientWidth}`);
    const chips = [...document.querySelectorAll('#classChips .classChip')].map((e) => e.textContent);
    document.querySelector('#tabs button[data-tab=help]').click();   // パネルを閉じ直す(以降の項目に影響させない)
    return { bad, chips };
  });
  add('badge.no-hscroll', r.bad.length === 0 && r.chips.length >= 2,
    r.bad.length ? `はみ出し要素(viewport 390): ${r.bad.join(' / ')}`
      : `🔦boxredshift チップ=[${r.chips.join(', ')}]・横スクロールなし(viewport 390)`);
} else {
  console.log('SKIP badge.no-hscroll(対象に HP.classifyPreset なし — 第35便 W4 未適用の root 等)');
}

// ---- 7h1f) 第35便 W4(台帳4-55): サンプル別粒子半径調整(描画専用 drawScale)----
// ----   drawscale.physics-free: drawScale は「描画専用」の契約 — 物理(位置・速度・スピン・
// ----   半径R)には一切影響しない。🕶️darkrotor(コア層+大質量天体を含む代表サンプル)を
// ----   drawScale=1/2/0.4 の3通りで300步走らせ、位置・速度・スピン・半径の全要素ハッシュが
// ----   bit一致することを確認する。加えて drawScale=3(上限)で実際に render() を1回走らせ、
// ----   ページ例外が増えないこと(コア層描画分岐等の描画専用コード自体のバグの機械検出)も見る ----
if (hasDrawScale) {
  const errBefore = pageErrors.length;
  let evalErr = null;
  const r = await page.evaluate(() => {
    const s = HP.sim;
    const base = () => JSON.parse(JSON.stringify(HP.allPresets().find((p) => p.id === 'darkrotor')));
    const run = (ds) => {
      const p = base(); p.drawScale = ds;
      s.build(p);
      for (let k = 0; k < 300; k++) s.step(0.016);
      const a = [];
      for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.vx[i], s.vy[i], s.spin[i], s.R[i], s.Rc[i]);
      return { n: s.n, ds: s.drawScale, str: a.map((v) => v.toExponential(12)).join(',') };
    };
    const r1 = run(1), r2 = run(2), r3 = run(0.4);
    let renderErr = null;
    try {
      const p4 = base(); p4.drawScale = 3; s.build(p4);
      HP.tick(1);   // 数步進めてから実描画(render())まで走らせる — drawScale=3(上限)の描画分岐を通す
    } catch (e) { renderErr = String(e); }
    return { r1, r2, r3, renderErr };
  }).catch((e) => { evalErr = String(e); return null; });
  const errAfter = pageErrors.length;
  if (!r) {
    add('drawscale.physics-free', false, `page.evaluate 中に例外: ${evalErr}`);
  } else {
    const h1 = crypto.createHash('sha256').update(r.r1.str).digest('hex');
    const h2 = crypto.createHash('sha256').update(r.r2.str).digest('hex');
    const h3 = crypto.createHash('sha256').update(r.r3.str).digest('hex');
    add('drawscale.physics-free',
      r.r1.n === r.r2.n && r.r2.ds === 2 && r.r3.ds === 0.4 && h1 === h2 && h1 === h3
      && !r.renderErr && errAfter === errBefore,
      `🕶️darkrotor 300步 位置・速度・スピン・半径(R/Rc)の全要素ハッシュ: drawScale=1→${h1.slice(0, 12)}… `
      + `drawScale=2→${h2.slice(0, 12)}…(bit一致=${h1 === h2}) drawScale=0.4→${h3.slice(0, 12)}…(bit一致=${h1 === h3}) `
      + `drawScale=3(上限)で実描画1回: 例外=${r.renderErr || 'なし'} pageErrors増分=${errAfter - errBefore}(0期待)`);
  }
} else {
  console.log('SKIP drawscale.physics-free(対象に S.drawScale なし — 第35便 W4 未適用の root 等)');
}

// ---- 4-55続き) drawscale.schema: validatePreset の drawScale クランプ(省略時1・[0.4,4] —
// 上限は当初3、広視野プリセットの主役2px化に不足したためレビューゲートで4へ)----
if (hasDrawScale) {
  const sc = await page.evaluate(() => {
    const mk = (extra) => Object.assign({
      name: 'ds', description: 'drawScale スキーマ検査', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, physics: {},
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }],
    }, extra);
    const hi = HP.validatePreset(mk({ drawScale: 5 }));
    const lo = HP.validatePreset(mk({ drawScale: 0.1 }));
    const nan = HP.validatePreset(mk({ drawScale: 'x' }));
    const ok = HP.validatePreset(mk({ drawScale: 1.5 }));
    const none = HP.validatePreset(mk({}));
    return {
      hiOk: hi.ok, hiVal: hi.preset && hi.preset.drawScale, hiWarns: hi.warnings.length,
      loOk: lo.ok, loVal: lo.preset && lo.preset.drawScale, loWarns: lo.warnings.length,
      nanOk: nan.ok, nanVal: nan.preset && nan.preset.drawScale, nanWarns: nan.warnings.length,
      okOk: ok.ok, okVal: ok.preset && ok.preset.drawScale, okWarns: ok.warnings.length,
      noneOk: none.ok, noneVal: none.preset && none.preset.drawScale,
    };
  });
  add('drawscale.schema',
    sc.hiOk && sc.hiVal === 4 && sc.hiWarns >= 1
    && sc.loOk && sc.loVal === 0.4 && sc.loWarns >= 1
    && sc.nanOk && sc.nanVal === 1 && sc.nanWarns >= 1
    && sc.okOk && sc.okVal === 1.5 && sc.okWarns === 0
    && sc.noneOk && sc.noneVal === undefined,
    `上限 5→${sc.hiVal}(警告${sc.hiWarns}件) 下限 0.1→${sc.loVal}(警告${sc.loWarns}件) `
    + `非数"x"→${sc.nanVal}(警告${sc.nanWarns}件) 正常1.5→${sc.okVal}(警告${sc.okWarns}件=0) `
    + `省略→${sc.noneVal}(未設定=S.buildで1扱い)`);
} else {
  console.log('SKIP drawscale.schema(対象に S.drawScale なし — 第35便 W4 未適用の root 等)');
}

// ---- 7h1g) 第35便 W5a(台帳4-42): 専用挙動QAの無かった6サンプルを補強
// ----   (gas/pressure/conduction/phase/blens/boxbound。全て root(v1.31)・beta 双方に既存の
// ----   内蔵プリセットなので、専用ガード無しで両対象に実行する。閾値は全て実測(2026-07-26・beta)
// ----   から余裕を持って確定し、下の各コメントに実測値を記録した(詳細: scratchpad/w5ab-report.md)。
// ----   6件合計の実測所要時間は約14s(gas/pressure/phaseがn=195〜240のため、design memoの想定
// ----   「nが小さいので+10s」より重いが、+20sの上限内なので !FAST 化はしていない)----
{
  // 🔥gas: 左右で異なる初期スピン(温度)が接触・拡散(muF/gammaN/kappaS)で熱平衡化し、
  // 温度T=½IS²の粒子間分散が縮小する。G=0・kFrame=0で純粋に熱過程だけの統制実験
  const gas = await page.evaluate(() => {
    const s = HP.sim;
    const varTemp = () => {
      let sum = 0, sum2 = 0;
      for (let i = 0; i < s.n; i++) { const t = 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i]; sum += t; sum2 += t * t; }
      const mean = sum / s.n; return sum2 / s.n - mean * mean;
    };
    HP.loadPreset('gas', false);
    const v0 = varTemp();
    for (let k = 0; k < 3000; k++) s.step(0.016);
    return { v0, v1: varTemp(), nan: s.hasNaN() };
  });
  // 実測(beta): v0=5.6473 → 3000步後 v1=3.8397(比0.6799)。閾値0.8は無変化(比1.0)から
  // 十分離れており、実測比に対しても約1.18倍の余裕(温度分散が明確に縮小したことだけを検出する目的)
  add('behavior.gas', !gas.nan && gas.v1 < gas.v0 && gas.v1 / gas.v0 < 0.8,
    `温度分散(T=½IS²) 初期=${gas.v0.toFixed(3)} → 3000步後=${gas.v1.toFixed(3)}(比=${(gas.v1 / gas.v0).toFixed(3)} < 0.8 — 実測0.680)`);
}

{
  // 🎈pressure: 既定(kRep=2)は中心の熱いガスがスピン斥力=圧力(E5′)で周りの冷たい殻を外へ押し広げる
  // → 粒子雲全体のRMS半径が増加。同構成をkRep=0に差し替えると(box.rot-support 302-341 と同じ手法で
  // s.params を直接書き換え)この機構が消え、増加はごく僅かになる(比較判定)
  const pr = await page.evaluate(() => {
    const s = HP.sim;
    const rms = () => { let a = 0; for (let i = 0; i < s.n; i++) a += s.x[i] * s.x[i] + s.y[i] * s.y[i]; return Math.sqrt(a / s.n); };
    HP.loadPreset('pressure', false);
    const r0 = rms();
    for (let k = 0; k < 2000; k++) s.step(0.016);
    const defRatio = rms() / r0, defNaN = s.hasNaN();
    HP.loadPreset('pressure', false); s.params.kRep = 0;
    const r0b = rms();
    for (let k = 0; k < 2000; k++) s.step(0.016);
    const zeroRatio = rms() / r0b, zeroNaN = s.hasNaN();
    return { defRatio, zeroRatio, defNaN, zeroNaN };
  });
  // 実測(beta): 既定2000步でRMS比1.1397(+14.0%) / kRep=0では1.0391(+3.9%、境界ノイズ程度の残余)。
  // 閾値: 既定>1.10(実測に対し余裕1.3倍分)・kRep=0<1.08(実測の約2倍上)・
  // 既定の成長量が kRep=0 の成長量の2倍以上(実測3.6倍・閾値に対し1.8倍の余裕)
  add('behavior.pressure',
    !pr.defNaN && !pr.zeroNaN && pr.defRatio > 1.10 && pr.zeroRatio < 1.08 && (pr.defRatio - 1) > 2 * (pr.zeroRatio - 1),
    `2000步後RMS半径比: 既定(kRep=2)=${pr.defRatio.toFixed(4)}(>1.10) kRep=0=${pr.zeroRatio.toFixed(4)}(<1.08) `
    + `成長量比=${((pr.defRatio - 1) / (pr.zeroRatio - 1)).toFixed(2)}倍(実測3.59倍・閾値2倍以上)`);
}

{
  // 📏conduction: 固定(pinned)の加熱端(spin=8)からスピン拡散(E10′)だけで熱が伝わる。pinned粒子は
  // beta/index.html の②粒子ループ(2496-2497行 if(pinned[i]) continue;)を素通りするためds[i]が
  // 適用されず、加熱端の温度は不変(理想的な熱浴)。
  // 加熱端と遠端(index17・距離153)の温度差ΔTは時間とともに減衰し、中間時点では近い粒子ほど先に温まる
  const cd = await page.evaluate(() => {
    const s = HP.sim;
    const T = (i) => 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];
    HP.loadPreset('conduction', false);
    const dT0 = T(0) - T(17);
    let mid = null;
    for (let k = 0; k < 20000; k++) { s.step(0.016); if (k === 3999) mid = { T1: T(1), T9: T(9), T17: T(17) }; }
    return { Th0: T(0), dT0, mid, Thf: T(0), T17f: T(17), nan: s.hasNaN() };
  });
  const dTf = cd.Thf - cd.T17f;
  // 実測(beta): 加熱端T=737.28(不変)。4000步時点で近接(dist9)T1=329.86 > 中位(dist81)T9=112.21 >
  // 遠端(dist153)T17=74.73(距離依存)。ΔT(加熱端−遠端)は初期737.28 → 20000步後133.52(比0.181)。
  // 閾値0.35は実測の約1.9倍上
  add('behavior.conduction',
    !cd.nan && cd.Th0 === cd.Thf && cd.mid.T1 > cd.mid.T9 && cd.mid.T9 > cd.mid.T17 && dTf / cd.dT0 < 0.35,
    `加熱端T=${cd.Th0.toFixed(1)}(不変) 中間(4000步) 近接T1=${cd.mid.T1.toFixed(1)} > 中位T9=${cd.mid.T9.toFixed(1)} `
    + `> 遠端T17=${cd.mid.T17.toFixed(1)}(距離依存) / ΔT 初期=${cd.dT0.toFixed(1)} → 20000步後=${dTf.toFixed(1)}`
    + `(比=${(dTf / cd.dT0).toFixed(3)} < 0.35 — 実測0.181)`);
}

{
  // 🧊phase: 質量・数・大きさ・初速が同一の3群(0-64低温/65-129中温/130-194高温)を一様重力gravityY
  // (+y方向、実測ではy増加=下)の下に置く。低スピン層ほど重力に逆らわず沈む(平均y座標が最大=最も底側)、
  // 高スピン層はスピン斥力(A10)が重力を振り切って箱に充満し沈みにくい
  const ph = await page.evaluate(() => {
    const s = HP.sim;
    const meanY = (i0, i1) => { let a = 0; for (let i = i0; i < i1; i++) a += s.y[i]; return a / (i1 - i0); };
    HP.loadPreset('phase', false);
    for (let k = 0; k < 5000; k++) s.step(0.016);
    return { cold: meanY(0, 65), med: meanY(65, 130), hot: meanY(130, 195), nan: s.hasNaN(), n: s.n };
  });
  // 実測(beta): 5000步後の平均y 低温=76.50 中温=74.12(差2.38 — 4000〜7000步の広い範囲で
  // 符号が一定な構造的な差) 高温=49.89(中温との差24.23)。閾値は各ギャップの実測の半分未満
  // (低温>中温+0.5・中温>高温+10)に設定し、境界に対して余裕を持たせた
  add('behavior.phase', !ph.nan && ph.n === 195 && ph.cold > ph.med + 0.5 && ph.med > ph.hot + 10,
    `5000步後の平均y(+y=下): 低温=${ph.cold.toFixed(2)} 中温=${ph.med.toFixed(2)}(低温−中温=` +
    `${(ph.cold - ph.med).toFixed(2)}>0.5) 高温=${ph.hot.toFixed(2)}(中温−高温=${(ph.med - ph.hot).toFixed(2)}>10) ` +
    `— 低スピン層ほど底側`);
}

{
  // 🔭blens: y=±65の2つの決定力井戸による複合レンズ(T5)。traceRay(2998行)は既存verify(V8・5228行)
  // と同じ公開APIで、描画(3639-3654行)と同じ dl=camScale/110・打切り箱|x|,|y|<camScale*2.2 を使う。
  // 井戸に近い側(y0=±200。y0=±150以下は光線が井戸に強く捕獲され符号が不安定になるため回避 — 実測)
  // を通る光線は、それぞれ近い方の井戸(y方向)へ向けて偏向する
  const bl = await page.evaluate(() => {
    const s = HP.sim;
    HP.loadPreset('blens', false);
    const camScale = 300, dl = camScale / 110, bx = camScale * 2.2, maxSteps = 2400;
    const bend = (y0) => traceRay(s, -bx, y0, 1, 0, dl, maxSteps, (nx, ny) => !(Math.abs(nx) > bx || Math.abs(ny) > bx));
    const top = bend(200), bot = bend(-200);
    return { topCy: top.cy, topCx: top.cx, botCy: bot.cy, botCx: bot.cx, nan: s.hasNaN() };
  });
  // 実測(beta): y0=+200(上側の井戸に近い)→ cy=-0.6162・cx=0.7876(反転〔捕獲〕なし)。
  // y0=-200(対称)→ cy=+0.6162。閾値|cy|>0.3は実測の約2.05倍下。cx>0は光線が180°以上
  // 曲げられて逆走していない(捕獲されていない)ことの確認
  add('behavior.blens', !bl.nan && bl.topCy < -0.3 && bl.topCx > 0 && bl.botCy > 0.3 && bl.botCx > 0,
    `上側(y0=200)偏向 cy=${bl.topCy.toFixed(4)}(<-0.3) cx=${bl.topCx.toFixed(4)}(捕獲なし) / `
    + `下側(y0=-200)偏向 cy=${bl.botCy.toFixed(4)}(>0.3・符号反転=井戸方向) cx=${bl.botCx.toFixed(4)}`);
}

{
  // 🪢boxbound: 説明文の主張「箱支配(φ_B≈0.95)の連星はd∝a^{2φ_B}で拡大する」を検証する。
  // φ_Bはsimから実測できる量(背景W_B=D0+boxWAt(box,a)〔beta/index.html 2002行〕と局所
  // w_local=s.sumW[i]〔同2054行で公開〕から φ_B=W_B/(W_B+w_local)。E6′反作用パスの
  // phiBg=bgW/Wi〔同2611行。Wi=bgW+sumW[i]は2567行〕と同じ式)で計算し、
  // ハードコードしない。連星(index0・1)の間隔dの成長指数 n_eff=dln(d)/dln(a) を測る
  const bb = await page.evaluate(() => {
    const s = HP.sim;
    HP.loadPreset('boxbound', false);
    const d0 = Math.hypot(s.x[0] - s.x[1], s.y[0] - s.y[1]);
    s.step(0.016);   // 1步進めて s.sumW を populate してから φ_B を読む
    const a1 = boxScaleAt(s.box, s.t).a;
    const bgW = s.params.D0 + boxWAt(s.box, a1);
    const phiB = bgW / (bgW + s.sumW[0]);
    for (let k = 1; k < 12000; k++) s.step(0.016);
    const d1 = Math.hypot(s.x[0] - s.x[1], s.y[0] - s.y[1]);
    const a = boxScaleAt(s.box, s.t).a;
    return { d0, d1, a, phiB, nEff: Math.log(d1 / d0) / Math.log(a), nan: s.hasNaN() };
  });
  const target = 2 * bb.phiB;
  // 実測(beta/root 両対象で一致): φ_B=0.9506(2φ_B=1.9012)。12000步後 d=24→106.85・a=2.1555 →
  // n_eff=1.9446(目標比1.023 — ±40%許容域[0.60,1.40]の中心近くに収まる。10000〜14000步の
  // 範囲で比1.016〜1.023と安定しており、特定の步数への偶然の一致ではない)
  add('behavior.boxbound', !bb.nan && bb.nEff > 0.6 * target && bb.nEff < 1.4 * target,
    `φ_B=${bb.phiB.toFixed(4)}(実測sumW/boxWAtから算出) 2φ_B=${target.toFixed(3)} / 12000步 d:${bb.d0}→` +
    `${bb.d1.toFixed(2)} a=${bb.a.toFixed(4)} n_eff=${bb.nEff.toFixed(4)}(目標比${(bb.nEff / target).toFixed(3)}・許容±40%)`);
}

// ---- 7h2) 台帳4-57(第32便): 単体レールの中心 railCx/railCy ----
// (root=v1.31 は未実装のため、スキーマ非対応時はスキップ)
{
  const has = await page.evaluate(() => {
    const p = HP.validatePreset({ name: 'r', description: 'd', camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
      physics: {}, bodies: [{ type: 'single', m: 1, x: 150, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, railOmega: 0.1, railCx: 100 }] });
    return p.ok && p.preset.bodies[0].railCx === 100;
  });
  if (has) {
    const r = await page.evaluate(() => {
      const mk = (extra) => ({ name: 'rail', description: 'railCx/railCy 検査', camera: { scale: 300 },
        world: { boundary: 'none', size: 0 }, physics: { G: 0, D0: 2, kFrame: 0 },
        bodies: [Object.assign({ type: 'single', m: 1, x: 150, y: 0, vx: 0, vy: 0, spin: 0, pinned: true }, extra)] });
      const p = HP.validatePreset(mk({ railOmega: 0.1, railCx: 100 }));   // 中心(100,0)・半径50の円レール
      let dmin = Infinity, dmax = -Infinity;
      if (p.ok) {
        const s = HP.sim; s.build(p.preset);
        for (let k = 0; k < 2000; k++) { s.step(0.016);
          const d = Math.hypot(s.x[0] - 100, s.y[0]); if (d < dmin) dmin = d; if (d > dmax) dmax = d; }
      }
      const q = HP.validatePreset(mk({ railCx: 100 }));                   // railOmega 無し → 警告して無視
      const e = HP.validatePreset(mk({ railOmega: 0.1 }));                // 未指定=原点(従来と厳密等価)
      let eR = null;
      if (e.ok) { const s = HP.sim; s.build(e.preset); for (let k = 0; k < 100; k++) s.step(0.016); eR = Math.hypot(s.x[0], s.y[0]); }
      return { ok: p.ok, warns: p.warnings.length, dmin, dmax,
        qWarn: q.ok && q.warnings.some(w => w.includes('railCx')) && q.preset.bodies[0].railCx === undefined, eR };
    });
    add('rail.custom-center', r.ok && r.warns === 0 && Math.abs(r.dmin - 50) < 0.5 && Math.abs(r.dmax - 50) < 0.5
      && r.qWarn && Math.abs(r.eR - 150) < 0.5,
      `中心(100,0)からの距離 ${r.dmin.toFixed(3)}〜${r.dmax.toFixed(3)}(50±0.5・警告${r.warns}件) railOmega無しのrailCx→警告して無視=${r.qWarn} 未指定=原点 r=${r.eR.toFixed(3)}(150)`);
  } else {
    console.log('SKIP rail.custom-center(対象に railCx/railCy スキーマなし)');
  }
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
// (第35便 W5c: 🧪buoyancy の計算部分〔12000步〕は W5C_UNITS.buoyancy へ移し、ワーカーで実行する。
// merger/collapse は元のまま主ページで直列実行 — 判定式・閾値・detail は一切変更していない)
{
  const rb = await w5cGetUnit('buoyancy');
  add('behavior.buoyancy', !rb.buoyNaN && rb.buoySep > 20,
    `分離(重-軽の平均y差)=${rb.buoySep.toFixed(1)} (>20)`);
}
{
  const r = await page.evaluate(() => {
    const s = HP.sim, res = {};
    // 🌠 merger: 円盤が核と同じ並進速度で生成される(bulkVx/Vy。v1.18 修正)
    // v1.24: 円盤を回転支持(kepler ≈3〜5)にしたため、有限個の回転成分のサンプリング残差
    // ≈ v/√n が平均に残る。第27便: 負荷改善で円盤 150/120 に削減 → 残差増(固定シードで
    // 決定論的に 0.447)。並進の欠落(旧バグは |v̄−v核| ≈ 1.4)とはなお十分離れており、
    // 閾値は 0.7(実測×1.5マージン)で判定する
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
  add('merger.bulk-velocity', r.mergerDv < 0.7, `|v̄円盤−v核|=${r.mergerDv.toFixed(3)} (<0.7 — 回転サンプリング残差込み・第27便 n削減で更新)`);
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
    res.saveName = document.querySelector('#saveName').value.startsWith('土星の環');  // 第4便: (実験)名にも一致
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
    // 第35便 W5c 追補: 並列ワーカー(4-45)とのCPU競合下では 800ms で t>0.5 に届かないことが
    // ある(実測 flake)。本テストの本旨は「両宇宙が同期して進む」ことであり 800ms は本旨では
    // ないため、t>0.5 まで最大5秒の追い待ちを許す(負荷ゼロなら従来どおり 800ms で満了)
    { const w0 = Date.now(); while (HP.sim.t <= 0.5 && Date.now() - w0 < 5000) await new Promise(res => setTimeout(res, 100)); }
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
  // 第35便 W5c: 3測定(galaxy A/B・saturn24000・convection24000)を W5C_UNITS の3ユニットへ分割し
  // ワーカーで並列実行する(判定式・閾値・detail 生成コードは変更せずそのままここに残置)。
  const r = { ...(await w5cGetUnit('galaxyAB')), ...(await w5cGetUnit('saturn24000')), ...(await w5cGetUnit('convection24000')) };
  add('claim.galaxy-outerboost', !r.galNaN && r.galA > r.galB * 1.04,   // 台帳4-48 改名: 旧 galaxy-flatten(T4 は「外縁増強」であり平坦化を主張しない)
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

// ---- 8c) 第11次裁定(2026-07-22): E13 帯状重力補正のQA(v1.28 でルート昇格)----
// 対象に E13 がある場合のみ実行(ルート版は昇格まで対象外 — QA 項目数は対象により変わる)
{
  const hasZonal = await page.evaluate(() => !!(window.HP && HP.zonal));
  // 第12便(2026-07-23): 🧭(現実較正 C=1)は 🛰️ D68 精密較正へ一本化・廃止。
  // ルート(昇格前)は旧 🧭 のみを持つため、実測系テストは存在する方の id で実行する。
  const ZID = await page.evaluate(() =>
    (window.HP && HP.allPresets().some(p => p.id === 'saturnZonalD68')) ? 'saturnZonalD68' : 'saturnZonal');
  if (hasZonal) {
    // P0-1/P0-2: D68 リングレットの解析検証(実単位・純数学 — Cassini 重力解 J2〜J12)
    // P0-3: 点質量退化(J=0 で ϖ̇=0・係数項ゼロ)
    const zr = await page.evaluate(() => {
      const MU = 37931207.7, R = 60330;  // km^3/s^2, km(J_n の基準半径 — 60,268 と混同しない)
      const J = { 2: 16290.573e-6, 4: -935.314e-6, 6: 86.340e-6, 8: -14.624e-6, 10: 4.672e-6, 12: -0.997e-6 };
      const k = 86400 * 180 / Math.PI;   // rad/s → deg/day
      return {
        base: HP.zonal.apsidal(MU, R, J, 67627, 1).apsidal * k,
        cal:  HP.zonal.apsidal(MU, R, J, 67627, 1.000302283).apsidal * k,
        zero: HP.zonal.apsidal(MU, R, { 2: 0 }, 67627, 1).apsidal * k,
        coeffsEmpty: HP.zonal.coeffs({ 2: 0, 4: 0 }).length,
      };
    });
    add('zonal.analytic-d68',
      Math.abs(zr.base - 38.231443) < 0.05 && Math.abs(zr.cal - 38.243) < 0.002,
      `ϖ̇=${zr.base.toFixed(6)}°/日(38.231443±0.05) 較正=${zr.cal.toFixed(6)}(38.243±0.002)`);
    add('zonal.point-mass-degenerate', Math.abs(zr.zero) < 1e-12 && zr.coeffsEmpty === 0,
      `J=0 → ϖ̇=${zr.zero} 係数項=${zr.coeffsEmpty}`);

    // ---- 第11次裁定 保留分(v1.29): 次数収束・半径依存の単調性(純解析 — 常時実行)----
    const zc = await page.evaluate(() => {
      const MU = 37931207.7, R = 60330;
      const J = { 2: 16290.573e-6, 4: -935.314e-6, 6: 86.340e-6, 8: -14.624e-6, 10: 4.672e-6, 12: -0.997e-6 };
      const orders = [2, 4, 6, 8, 10, 12];
      const rates = orders.map(o => {
        const Jt = {}; for (const k of orders) if (k <= o) Jt[k] = J[k];
        return HP.zonal.apsidal(MU, R, Jt, 67627, 1).apsidal;
      });
      const deltas = []; for (let i = 1; i < rates.length; i++) deltas.push(Math.abs(rates[i] - rates[i - 1]));
      const grid = []; for (let a = 66000; a <= 120000; a += 6000) grid.push(HP.zonal.apsidal(MU, R, J, a, 1).apsidal);
      return { deltas, mono: grid.every((v, i) => i === 0 || v < grid[i - 1]) };
    });
    add('zonal.order-convergence', zc.deltas.every((d, i) => i === 0 || d < zc.deltas[i - 1]),
      `J2k 打ち切り増分 |Δϖ̇| が単調減衰: ${zc.deltas.map(d => d.toExponential(1)).join(' > ')}`);
    add('zonal.radial-monotonic', zc.mono, `ϖ̇(a) は a=66000→120000(実単位)で単調減少=${zc.mono}`);

    // ---- 第11次裁定 保留分(v1.29): AI生成プリセットへの zonal 開放(スキーマ検証)----
    // 対象の validatePreset が zonal 未対応(旧版)なら SKIP(機能ゲート)
    const vz = await page.evaluate(() => {
      const mk = (zonal) => ({ name: "z", description: "d", camera: { scale: 300 }, world: { boundary: "none", size: 0 },
        physics: {}, bodies: [{ type: "single", m: 1500, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, zonal }] });
      const ok = HP.validatePreset(mk({ refR: 100, calib: 1, J: { 2: 0.0163, 4: -0.0009 } }));
      if (!(ok.ok && ok.preset.bodies[0].zonal)) return { supported: false };
      const cl = HP.validatePreset(mk({ refR: 999999, calib: 5, J: { 2: 9, 3: 0.1 } }));
      const bad = HP.validatePreset(mk({ J: { 2: 0.01 } }));
      return { supported: true, okZ: ok.preset.bodies[0].zonal,
        cz: cl.ok ? cl.preset.bodies[0].zonal : null, cw: cl.warnings.length, badOk: bad.ok };
    });
    if (vz.supported) {
      add('zonal.ai-open',
        vz.okZ.refR === 100 && vz.okZ.J[2] === 0.0163 &&
        !!vz.cz && vz.cz.refR === 5000 && vz.cz.calib === 2 && vz.cz.J[2] === 0.1 && !('3' in vz.cz.J) && vz.cw >= 3 &&
        vz.badOk === false,
        `受理/クランプ(refR→5000, calib→2, J2→0.1)/奇数次は警告無視/refR欠落は拒否 — 警告${vz.cw}件`);
    } else {
      console.log('SKIP zonal.ai-open(対象の validatePreset は zonal 未対応)');
    }

    // ---- 第11次裁定 保留分(v1.29): D68 精密較正プリセット(calib=1.000302283)----
    const d68 = await page.evaluate(() => {
      const p = HP.allPresets().find(q => q.id === 'saturnZonalD68');
      return p ? p.bodies[0].zonal.calib : null;
    });
    if (d68 !== null) add('zonal.d68-preset', Math.abs(d68 - 1.000302283) < 1e-9, `zonal.calib=${d68}`);
    else console.log('SKIP zonal.d68-preset(対象に D68 較正プリセットなし)');

    // ---- 第11次裁定 保留分(v1.29): 近点検出器(engine periDet)の機械検証 ----
    // UI が表示する実測 Δϖ/周 が解析値と符号・量級で一致する(検出器の実装ゲート付き)
    const pd = await page.evaluate((ZID) => {
      HP.loadPreset(ZID, false);
      const s = HP.sim;
      for (let k = 0; k < 60000; k++) s.step(0.016);
      if (!s.periDet) { HP.loadPreset('saturn', false); return { supported: false }; }
      const P = s.periDet; let bi = -1, ba = 1e18;
      for (let i = 0; i < s.n; i++) if (P.cnt[i] > 0) { const ae = (P.rmin[i] + P.rmax[i]) / 2; if (ae < ba) { ba = ae; bi = i; } }
      const Z = s.zonal;
      const out = bi < 0 ? { supported: true, cnt: 0 } : {
        supported: true, cnt: P.cnt[bi], meas: P.sum[bi] / P.cnt[bi], aEff: ba,
        ana: (Z.calib || 1) * 2 * Math.PI *
          (HP.zonal.apsidal(s.params.G * s.m[Z.i], Z.refR, Z.J, ba, 1).omega /
           HP.zonal.apsidal(s.params.G * s.m[Z.i], Z.refR, Z.J, ba, 1).kappa - 1) };
      HP.loadPreset('saturn', false);
      return out;
    }, ZID);
    if (pd.supported) {
      const pdRel = pd.cnt > 0 ? Math.abs(pd.meas - pd.ana) / Math.abs(pd.ana) : 1;
      add('zonal.peri-ui', pd.cnt >= 1 && pd.meas > 0 && pdRel < 0.25,
        `最内粒子(a_eff=${pd.cnt > 0 ? pd.aEff.toFixed(1) : '—'}): 実測=${pd.cnt > 0 ? (pd.meas * 180 / Math.PI).toFixed(2) : '—'}°/周 解析=${pd.cnt > 0 ? (pd.ana * 180 / Math.PI).toFixed(2) : '—'}°/周(相対差 ${(pdRel * 100).toFixed(1)}% <25%・n=${pd.cnt})`);
    } else {
      console.log('SKIP zonal.peri-ui(対象に近点検出器なし)');
    }

    if (!FAST) {
      // 実測: saturnZonal 最内テスト粒子(名目 a=108, e=0.05)の Δϖ/動径周期を実測し、
      // 実効半長径 a_eff=(rmin+rmax)/2 での解析値 2π(Ω/κ−1) と比較する。
      // - 開始点はケプラー初期条件のため J 補正下では真の近点ではない(実効軌道は a_eff≈104)。
      //   k>3000 のウォームアップ+近点ゲート r<103 で開始直後の擬似極小を排除する(較正 2026-07-22:
      //   これを怠ると初回区間が汚染され実測 1.4°/9.5° に化ける)。
      // - J=0 走行は数値基線のみ(softening+隣接粒子 ≈ +0.19°/周)= 単極子二重計上なしの実測確認
      const zm = await page.evaluate((ZID) => {
        const run = (zeroJ) => {
          HP.loadPreset(ZID, false);
          const s = HP.sim;
          if (zeroJ) { s.zonal.J = { 2: 0 }; s.zonal._A = null; }
          let rmin = 1e9, rmax = 0; const peri = []; let lastK = -1e9, r2 = 0, r1 = 0, th1 = 0;
          for (let k = 0; k < 90000 && peri.length < 5; k++) {
            s.step(0.016);
            const r = Math.hypot(s.x[1], s.y[1]), th = Math.atan2(s.y[1], s.x[1]);
            if (k > 3000) {
              if (r < rmin) rmin = r; if (r > rmax) rmax = r;
              if (r1 < r2 && r1 < r && r1 < 103 && (k - lastK) > 5000) { peri.push(th1); lastK = k; }
            }
            r2 = r1; r1 = r; th1 = th;
          }
          let acc = 0;
          for (let i = 1; i < peri.length; i++) {
            let dd = peri[i] - peri[i - 1];
            while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
            acc += dd;
          }
          return { n: peri.length, drift: peri.length > 1 ? acc / (peri.length - 1) : 0, rmin, rmax, nan: s.hasNaN() };
        };
        const on = run(false), off = run(true);
        const J = { 2: 0.016290573, 4: -0.000935314, 6: 0.000086340, 8: -0.000014624, 10: 0.000004672, 12: -0.000000997 };
        const aEff = (on.rmin + on.rmax) / 2;
        const th = HP.zonal.apsidal(1500, 100, J, aEff, 1);
        HP.loadPreset('saturn', false);
        return { on, off, aEff, expect: 2 * Math.PI * (th.omega / th.kappa - 1) };
      }, ZID);
      const relErr = Math.abs(zm.on.drift - zm.expect) / zm.expect;
      add('zonal.sim-precession',
        !zm.on.nan && zm.on.n >= 4 && zm.on.drift > 0 && relErr < 0.15,
        `Δϖ/周 実測=${(zm.on.drift * 180 / Math.PI).toFixed(3)}° 解析(a_eff=${zm.aEff.toFixed(1)})=${(zm.expect * 180 / Math.PI).toFixed(3)}°(相対差 ${(relErr * 100).toFixed(2)}% <15%)`);
      add('zonal.no-double-count',
        !zm.off.nan && zm.off.n >= 4 && Math.abs(zm.off.drift) < 0.02,
        `J=0 実測基線=${(zm.off.drift * 180 / Math.PI).toFixed(3)}°(<1.15°)`);

      // ---- 第11次裁定 保留分(v1.29): dt 収束 — 同一測定を dt/2 で再実行し Δϖ/周 が一致 ----
      // (ゲートは時間換算で等価: warmup 3000→6000步・近点間隔 5000→10000步)
      const zh = await page.evaluate((ZID) => {
        HP.loadPreset(ZID, false);
        const s = HP.sim;
        let rmin = 1e9, rmax = 0; const peri = []; let lastK = -1e9, r2 = 0, r1 = 0, th1 = 0;
        for (let k = 0; k < 180000 && peri.length < 5; k++) {
          s.step(0.008);
          const r = Math.hypot(s.x[1], s.y[1]), th = Math.atan2(s.y[1], s.x[1]);
          if (k > 6000) {
            if (r < rmin) rmin = r; if (r > rmax) rmax = r;
            if (r1 < r2 && r1 < r && r1 < 103 && (k - lastK) > 10000) { peri.push(th1); lastK = k; }
          }
          r2 = r1; r1 = r; th1 = th;
        }
        let acc = 0;
        for (let i = 1; i < peri.length; i++) {
          let dd = peri[i] - peri[i - 1];
          while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
          acc += dd;
        }
        HP.loadPreset('saturn', false);
        return { n: peri.length, drift: peri.length > 1 ? acc / (peri.length - 1) : 0 };
      }, ZID);
      const dtRel = Math.abs(zh.drift - zm.on.drift) / Math.abs(zm.on.drift);
      add('zonal.dt-convergence', zh.n >= 4 && dtRel < 0.10,
        `Δϖ/周: dt=0.016 → ${(zm.on.drift * 180 / Math.PI).toFixed(3)}° / dt=0.008 → ${(zh.drift * 180 / Math.PI).toFixed(3)}°(相対差 ${(dtRel * 100).toFixed(2)}% <10%)`);
    }
  } else {
    console.log('SKIP zonal.*(対象に E13 なし)');
  }
}

// ---- 8d) 第12次裁定(2026-07-22): 🧊 saturnIce(氷・低熱結合)のQA ----
// 対象に 🪐(実験)がある場合のみ実行(v1.28 でルート昇格)。🧭 の trail 既定ONもここで検査
{
  const hasIce = await page.evaluate(() =>
    !!(window.HP && HP.allPresets().some(p => p.id === 'saturn' && /実験/.test(p.name || ''))));
  if (hasIce) {
    // 原仮定者指示: 🧭 は線の軌跡(overlays.trail)を既定ONにする
    const tr = await page.evaluate(() => {
      const zid = HP.allPresets().some(p => p.id === 'saturnZonalD68') ? 'saturnZonalD68' : 'saturnZonal';
      HP.loadPreset(zid, false); return !!HP.sim.overlays.trail; });
    add('zonal.trail-default', tr, `overlays.trail=${tr}`);
    // E10′ スイッチの機械検証(kappaS を実行時に切替): 0 → 拡散配列 ds 全ゼロ / 0.08 → 大多数が非ゼロ
    // (原仮定者裁定 2026-07-22: プリセット既定は kappaS=0.08 に変更されたため、0 は実行時設定で検査)
    const dz = await page.evaluate(() => {
      HP.loadPreset('saturn', false);
      const s = HP.sim;
      s.params.kappaS = 0;
      for (let k = 0; k < 5; k++) s.step(0.016);
      let nz0 = 0; for (let i = 0; i < s.n; i++) if (s.ds[i] !== 0) nz0++;
      s.params.kappaS = 0.08;
      for (let k = 0; k < 5; k++) s.step(0.016);
      let nz8 = 0; for (let i = 0; i < s.n; i++) if (s.ds[i] !== 0) nz8++;
      return { nz0, nz8, n: s.n };
    });
    add('ice.e10-off', dz.nz0 === 0 && dz.nz8 >= dz.n * 0.9,
      `ds非ゼロ: kappaS=0 → ${dz.nz0}/${dz.n}(=0)/ kappaS=0.08 → ${dz.nz8}/${dz.n}(≥90%)`);

    // ---- 第13次裁定 P1-1: PWA の HTTP 実動作(SW 登録・precache・オフライン再読込・名前空間)----
    // 既存 QA は file:// のため SW が未検証だった。ローカル HTTP で対象ディレクトリを配信して検査する。
    // キャッシュ名前空間は対象別に限定(第13次 P0-2: ルート dfm-release-* / beta dfm-beta-* が
    // 互いのキャッシュを壊さない)。v1.28 昇格でルートも PWA 一式を持つため両対象で実行。
    {
      const http = await import('node:http');
      const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
        '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.json': 'application/json' };
      const srv = http.createServer((req, res) => {
        try {
          let up = decodeURIComponent(new URL(req.url, 'http://x').pathname);
          if (up.endsWith('/')) up += 'index.html';
          const fp = path.join(ROOT, up);
          if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end(); return; }
          res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
          res.end(fs.readFileSync(fp));
        } catch { res.writeHead(500); res.end(); }
      });
      await new Promise(r => srv.listen(0, '127.0.0.1', r));
      const port = srv.address().port;
      const basePath = TARGET.includes('beta/') ? '/beta/' : '/';
      const cachePfx = TARGET.includes('beta/') ? 'dfm-beta-' : 'dfm-release-';
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const pw = await ctx.newPage();
      let sw = { ready: false }, assets = {}, offlineOk = false, cacheKeys = [];
      try {
        await pw.goto(`http://127.0.0.1:${port}${basePath}`, { waitUntil: 'load' });
        sw = await pw.evaluate(async () => {
          if (!('serviceWorker' in navigator)) return { ready: false, sup: false };
          const reg = await Promise.race([navigator.serviceWorker.ready,
            new Promise((_, j) => setTimeout(() => j(new Error('sw-ready timeout')), 15000))]);
          return { ready: !!reg.active, sup: true, scope: reg.scope };
        }).catch(e => ({ ready: false, err: String(e).slice(0, 80) }));
        assets = await pw.evaluate(async () => {
          const out = {};
          for (const u of ['./manifest.webmanifest', './sw.js', './icon-180.png', './icon-192.png', './icon-512.png'])
            out[u] = (await fetch(u)).status;
          return out;
        });
        cacheKeys = await pw.evaluate(() => caches.keys());
        await ctx.setOffline(true);
        await pw.reload({ waitUntil: 'load' });
        offlineOk = await pw.waitForFunction(() => !!window.HP, null, { timeout: 15000 })
          .then(() => true).catch(() => false);
        await ctx.setOffline(false);
      } finally { await ctx.close(); srv.close(); }
      const assetsOk = Object.values(assets).length === 5 && Object.values(assets).every(v => v === 200);
      const nsOk = cacheKeys.length >= 1 && cacheKeys.every(k => k.startsWith(cachePfx));
      add('pwa.sw-offline', sw.ready === true && assetsOk && nsOk && offlineOk,
        `SW=${sw.ready} アセット200=${assetsOk} 名前空間${cachePfx}*=${nsOk}(${cacheKeys.join(',')}) オフライン再読込=${offlineOk}`);

      // ---- 第14次裁定 P2-1(2026-07-23): SW 登録失敗の表示 — sw.js を 404 にして notify を検査 ----
      const hasSwFailUi = await page.evaluate(() => typeof window.restoreDraft === 'function');
      if (hasSwFailUi) {
        const srv2 = http.createServer((req, res) => {
          try {
            let up = decodeURIComponent(new URL(req.url, 'http://x').pathname);
            if (up.endsWith('/')) up += 'index.html';
            if (up.endsWith('/sw.js')) { res.writeHead(404); res.end(); return; }
            const fp = path.join(ROOT, up);
            if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end(); return; }
            res.writeHead(200, { 'content-type': MIME[path.extname(fp)] || 'application/octet-stream' });
            res.end(fs.readFileSync(fp));
          } catch { res.writeHead(500); res.end(); }
        });
        await new Promise(r => srv2.listen(0, '127.0.0.1', r));
        const ctx2 = await browser.newContext();
        const p2 = await ctx2.newPage();
        let failTxt = false;
        try {
          await p2.goto(`http://127.0.0.1:${srv2.address().port}${basePath}`, { waitUntil: 'load' });
          failTxt = await p2.waitForFunction(() => {
            const el = document.getElementById('notice');
            return (el && el.style.display !== 'none' && /Service Worker/.test(el.textContent)) ? el.textContent : false;
          }, null, { timeout: 15000 }).then(h => h.jsonValue()).catch(() => false);
        } finally { await ctx2.close(); srv2.close(); }
        add('pwa.sw-fail-ui', !!failTxt, `登録失敗の通知表示=${!!failTxt}(${String(failTxt || '').slice(0, 32)}…)`);
      } else {
        console.log('SKIP pwa.sw-fail-ui(対象に SW 失敗表示なし)');
      }
    }
    if (!FAST) {
      // 🪐(実験)の長時間安定。原仮定者裁定(2026-07-22 昇格便)で t=600、
      // **第14便(2026-07-23 原仮定者指示)で t=360 へ短縮**(QA 時間短縮)。
      // 初期配置は t=300〜600 の実測分布に再設計済み(第4便)。t≈360(22500步)まで回し、
      // 帯保持・落下/散逸ゼロ・NaNなしを検査。t≈1200 の較正実測(第4便: 帯内99.3%・落下1粒・
      // 散逸0)は裁定記録第12次 §6.1 に記録済み — 閾値は t1200 時と同一のまま流用。
      // 第35便 W5c: 計算部分は W5C_UNITS.saturnExp へ移し、ワーカーで実行する
      const iso = await w5cGetUnit('saturnExp');
      add('behavior.saturnExp',
        !iso.nan && iso.inB >= 0.95 && iso.fall <= 0.02 && iso.esc <= 0.05 && iso.mean < 0.5,
        `t≈360: 帯内=${(iso.inB * 100).toFixed(1)}%(≥95%) 落下=${(iso.fall * 100).toFixed(1)}%(≤2%) 散逸=${(iso.esc * 100).toFixed(1)}%(≤5%) 平均|spin|=${iso.mean.toFixed(3)}(<0.5)`);
    }
  } else {
    console.log('SKIP ice./saturnExp(対象に 🪐実験版なし)');
  }
}

// ---- 8e) 第14次裁定 P2-1(2026-07-23): 自動ドラフトの復元/破棄 E2E(専用ページで再読込を伴う)----
{
  // 注: file:// では sessionStorage が再読込を跨いで保持されない(Chromium の origin 扱い)ため、
  // 復元経路(read → remove → confirm → 適用/破棄)は restoreDraft() を直接呼んで検証する。
  // 再読込を跨ぐ保持は http(s) 実行時のブラウザ仕様(実機チェックリストで確認)。
  const hasDraft = await page.evaluate(() => typeof window.restoreDraft === 'function');
  if (hasDraft) {
    const dp = await browser.newPage();
    let dlg = 0, acceptMode = true;
    dp.on('dialog', d => { dlg++; if (acceptMode) d.accept(); else d.dismiss(); });
    await dp.goto(INDEX);
    await dp.waitForFunction(() => !!window.HP);
    const rest = await dp.evaluate(() => {
      sessionStorage.setItem('hp_draft', JSON.stringify(
        { presetId: 'saturn', physics: Object.assign({}, HP.sim.params, { muF: 0.77 }), cameraScale: 123, at: 'qa' }));
      window.restoreDraft();
      return { muF: HP.sim.params.muF,
        badge: (document.getElementById('dirtyBadge') || { style: {} }).style.display,
        draft: !!sessionStorage.getItem('hp_draft') };
    });
    add('draft.restore', dlg === 1 && Math.abs(rest.muF - 0.77) < 1e-12 && rest.badge === 'inline-block' && rest.draft,
      `confirm=${dlg} muF=${rest.muF}(0.77) badge=${rest.badge} 未保存として再保存=${rest.draft}`);
    acceptMode = false;
    const disc = await dp.evaluate(() => {
      sessionStorage.setItem('hp_draft', JSON.stringify(
        { presetId: 'saturn', physics: Object.assign({}, HP.sim.params, { muF: 0.55 }), cameraScale: 99, at: 'qa2' }));
      window.restoreDraft();
      return { muF: HP.sim.params.muF, draft: sessionStorage.getItem('hp_draft') };
    });
    add('draft.discard', dlg === 2 && Math.abs(disc.muF - 0.77) < 1e-12 && !disc.draft,
      `confirm=${dlg} muF=${disc.muF}(0.55 は不適用・直前値 0.77 のまま) 下書き消去=${!disc.draft}`);
    await dp.close();
  } else {
    console.log('SKIP draft.*(対象に自動ドラフトなし)');
  }
}

// ---- 第12〜14便(2026-07-23): 主星2層(比率仕様 coreMR/coreSR)のエンジン検証 ----
// 第14便: m は総質量のまま、coreMR=コア質量比 mc/m(既定0・負値=空洞)・coreSR=コアスピン比
// sc/s(既定1=剛体回転=単層と厳密等価 — 錨)。差動形 ω += coreMR·s·(coreSR−1)·f(Rc,d)、
// Rc=radiusScale·√|coreMR·m|。coreMR=0 は寄与なし・hasCore=false の宇宙は分岐ごと素通り(高速化)。
// 負質量は実験用に受理(0除算保護のみ)。
{
  const hasCoreEng = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.coreMR));
  if (hasCoreEng) {
    // 第35便 W5c: 計算部分は W5C_UNITS.twolayerCore へ移し、ワーカーで実行する
    const r = await w5cGetUnit('twolayerCore');
    add('core.twolayer',
      r.preset.n === 301 && r.preset.coreMR === 0.18 && Math.abs(r.preset.coreSR - 1.05) < 1e-6 &&
      r.preset.hasCore &&
      Math.abs(r.preset.R0 - 1.8 * Math.sqrt(1500)) < 0.01 && Math.abs(r.preset.Rc0 - 1.8 * Math.sqrt(270)) < 0.01 &&
      r.m0 === 1500 && r.hcRigid && r.eqRigid < 1e-9 &&
      r.restDx > 1e-4 &&                                       // コア静止は引きずり低下で差が出る
      r.hcZero === false && r.eqZero < 1e-9 &&
      r.effDx > 0.1 && !r.effNan && r.holDx > 0.1 && !r.holNan &&
      r.negR > 0 && !r.negNan,
      `🎯 n=${r.preset.n} mc/m=${r.preset.coreMR} sc/s=${r.preset.coreSR} R/Rc=${r.preset.R0.toFixed(1)}/${r.preset.Rc0.toFixed(1)} ` +
      `剛体回転(sc/s=1)等価=${r.eqRigid}(<1e-9) コア静止差=${r.restDx.toExponential(1)}(>1e-4) ` +
      `mc/m=0高速パス=${!r.hcZero}&等価${r.eqZero} 高速コア効果=${r.effDx.toFixed(2)}(>0.1) ` +
      `空洞NaNなし=${!r.holNan}&効果=${r.holDx.toFixed(2)} 負質量NaNなし=${!r.negNan}`);

    // ---- 第12便: A/B比較中の粒子編集(選択・パネル表示・編集先の分離・負値/コア編集)----
    const e = await page.evaluate(() => {
      HP.loadPreset('saturn', false);
      HP.abStart();
      HP.selectBody(3, 'B');
      const panel = document.getElementById('bodyEdit');
      const shownB = panel.style.display === 'block';
      const titleB = document.getElementById('beTitle').textContent;
      const beM = document.getElementById('beM');
      beM.value = '-2'; beM.dispatchEvent(new Event('change'));
      const mB = HP.ab().simB.m[3], mA_after_B = HP.sim.m[3];
      const beMc = document.getElementById('beMc');
      beMc.value = '0.5'; beMc.dispatchEvent(new Event('change'));
      const mcB = HP.ab().simB.coreMR[3], mcA = HP.sim.coreMR[3], hcB = HP.ab().simB.hasCore;
      HP.selectBody(3, 'A');
      const titleA = document.getElementById('beTitle').textContent;
      const beSc = document.getElementById('beSc');
      beSc.value = '1.5'; beSc.dispatchEvent(new Event('change'));
      const scA = HP.sim.coreSR[3], scB = HP.ab().simB.coreSR[3];
      HP.abStop();
      const hiddenAfter = HP.selInfo().selIdx === -1;
      HP.loadPreset('saturn', false);
      return { shownB, titleB, titleA, mB, mA_after_B, mcB, mcA, hcB, scA, scB, hiddenAfter };
    });
    add('core.ab-body-edit',
      e.shownB && /\(B\)/.test(e.titleB) && /\(A\)/.test(e.titleA) &&
      e.mB === -2 && Math.abs(e.mA_after_B - (-2)) > 1e-6 &&        // B編集はAに波及しない
      e.mcB === 0.5 && e.mcA === 0 && e.hcB === true &&
      e.scA === 1.5 && e.scB === 1 &&                               // A編集はBに波及しない(既定 sc/s=1)
      e.hiddenAfter,
      `B選択表示=${e.shownB}(${e.titleB}) m(B)=-2受理=${e.mB === -2} A非波及=true ` +
      `mc/m(B)=0.5/mc/m(A)=${e.mcA} sc/s(A)=1.5/sc/s(B)=${e.scB}(既定1) 終了で選択解除=${e.hiddenAfter}`);

    // ---- 第13〜14便: 🎯 既定値の長時間安定+差動効果の有界性 ----
    // 既定(sc/s=1.05・差動形)で t≈360 の帯保持・落下/散逸ゼロ近傍を、🪐 と同じ閾値で機械検証
    // (第14便・原仮定者指示: 環の安定確認は t=360 まで — QA 時間短縮)。
    // 併せて剛体回転(sc/s=1)との帯中央値差が t150 で有界(≤8)であることを確認 —
    // 差動形の効果が「説明どおり小さい摂動」の規模に収まっている事の数値化。
    if (!FAST) {
      // 第35便 W5c: 計算部分は W5C_UNITS.saturnLayered へ移し、ワーカーで実行する
      const bl = await w5cGetUnit('saturnLayered');
      const dMax = Math.max(Math.abs(bl.d150.C - bl.z150.C), Math.abs(bl.d150.B - bl.z150.B), Math.abs(bl.d150.A - bl.z150.A));
      add('behavior.saturnLayered',
        !bl.d360.nan && bl.d360.inB >= 0.95 && bl.d360.fall <= 0.02 && bl.d360.esc <= 0.05 && bl.d360.mean < 0.5 &&
        (bl.d360.B - bl.d360.C) > 5 && (bl.d360.A - bl.d360.B) > 5 &&   // 帯順序 C<B<A
        dMax <= 8,
        `t≈360: 帯内=${(bl.d360.inB * 100).toFixed(1)}%(≥95%) 落下=${(bl.d360.fall * 100).toFixed(1)}%(≤2%) ` +
        `散逸=${(bl.d360.esc * 100).toFixed(1)}%(≤5%) 平均|spin|=${bl.d360.mean.toFixed(3)}(<0.5) ` +
        `帯中央値=${bl.d360.C.toFixed(0)}/${bl.d360.B.toFixed(0)}/${bl.d360.A.toFixed(0)} ` +
        `剛体回転との帯中央値差(t150)=${dMax.toFixed(2)}(≤8)`);

      // ---- 第15便: 🌍 地球と月(公転版)— 円軌道の維持と同期自転(潮汐固定)の安定 ----
      // 実測較正(2026-07-23): v=1.063×軟化ケプラー値・ω=0.013931(T=451)・spin月=ω。
      // 4.4周で半径 179.8〜180.1(ドリフト0.16%)・同期誤差 0.31°/周。QA は2周(t≈900)で
      // 半径±2%・同期誤差≤2°/周・地球コア属性・NaNなしを検査。
      const em = await page.evaluate(() => {
        HP.loadPreset('earthMoon', false);
        const s = HP.sim;
        const core = { mcr: s.coreMR[0], scr: s.coreSR[0], mcrM: s.coreMR[1], spinM: s.spin[1] };
        let rMin = 1e9, rMax = 0, phi = 0;
        let prev = Math.atan2(s.y[1] - s.y[0], s.x[1] - s.x[0]);
        for (let k = 0; k < 56250; k++) {   // t=900 ≒ 2周
          s.step(0.016);
          const rr = Math.hypot(s.x[1] - s.x[0], s.y[1] - s.y[0]);
          if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
          const a = Math.atan2(s.y[1] - s.y[0], s.x[1] - s.x[0]);
          let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          phi += d; prev = a;
        }
        const orbits = phi / (2 * Math.PI);
        const syncErrDeg = Math.abs(s.rotA[1] - phi) * 180 / Math.PI;
        const out = { ...core, rMin, rMax, orbits, syncPerOrbit: syncErrDeg / orbits,
          omMeas: phi / 900, nan: s.hasNaN() };
        HP.loadPreset('saturn', false);
        return out;
      });
      const emSpinRel = Math.abs(em.spinM - em.omMeas) / em.omMeas;
      add('behavior.earthMoon',
        !em.nan &&
        Math.abs(em.mcr - 0.325) < 1e-6 && Math.abs(em.scr - 1.0) < 1e-6 &&   // 第16便: コア観測値(Float32丸め許容)
        Math.abs(em.mcrM - 0.0168) < 1e-6 &&                                   // 月コア(LLR 中央値)
        em.rMin >= 180 * 0.98 && em.rMax <= 180 * 1.02 &&        // 円軌道が ±2% で維持
        em.orbits > 1.5 &&                                        // 2周走行の確認
        em.syncPerOrbit <= 2 &&                                   // 潮汐固定: 同期誤差 ≤2°/周
        emSpinRel < 0.05,                                         // spin月 ≈ 実測 ω(±5%)
        `🌍 t≈900(${em.orbits.toFixed(2)}周): r=${em.rMin.toFixed(1)}〜${em.rMax.toFixed(1)}(180±2%) ` +
        `同期誤差=${em.syncPerOrbit.toFixed(2)}°/周(≤2) spin月/ω実測 相対差=${(emSpinRel * 100).toFixed(1)}%(<5%) ` +
        `コア 地球=${em.mcr.toFixed(3)}/${em.scr}・月=${em.mcrM.toFixed(4)} NaNなし=${!em.nan}`);

      // ---- 第16便(第17次レビュー 推奨B): 🌕 自由二体・物理比 — 重心系の長時間安定 ----
      // kFrame=0 の純ニュートン対照(spin は軌道に影響しない → 実自転比 27.4× をそのまま使用)。
      // 実測較正(2026-07-23): t5000(10.48周)r=179.974〜180.020・重心移動最大0.0009・
      // 同期誤差0.31°/周(ChatGPT 第17次の独立 Python 計算と実エンジンが一致)。
      const ef = await page.evaluate(() => {
        HP.loadPreset('earthMoonFree', false);
        const s = HP.sim;
        const pins = s.pinned[0] + s.pinned[1];
        const spinRatio = s.spin[0] / s.spin[1];
        const MT = s.m[0] + s.m[1];
        const cx0 = (s.m[0]*s.x[0] + s.m[1]*s.x[1]) / MT, cy0 = (s.m[0]*s.y[0] + s.m[1]*s.y[1]) / MT;
        let rMin = 1e9, rMax = 0, phi = 0, comMax = 0;
        let prev = Math.atan2(s.y[1]-s.y[0], s.x[1]-s.x[0]);
        for (let k = 0; k < 312500; k++) {   // t=5000 ≒ 10.5周
          s.step(0.016);
          const rr = Math.hypot(s.x[1]-s.x[0], s.y[1]-s.y[0]);
          if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
          const a = Math.atan2(s.y[1]-s.y[0], s.x[1]-s.x[0]);
          let d = a - prev; while (d > Math.PI) d -= 2*Math.PI; while (d < -Math.PI) d += 2*Math.PI;
          phi += d; prev = a;
          const cx = (s.m[0]*s.x[0] + s.m[1]*s.x[1]) / MT, cy = (s.m[0]*s.y[0] + s.m[1]*s.y[1]) / MT;
          const cd = Math.hypot(cx-cx0, cy-cy0); if (cd > comMax) comMax = cd;
        }
        const orbits = phi / (2*Math.PI);
        const out = { pins, spinRatio, rMin, rMax, orbits, comMax,
          syncPerOrbit: (Math.abs(s.rotA[1]-phi)*180/Math.PI)/orbits, nan: s.hasNaN() };
        HP.loadPreset('saturn', false);
        return out;
      });
      add('behavior.earthMoonFree',
        !ef.nan && ef.pins === 0 &&                               // 両天体とも自由(閉鎖系)
        Math.abs(ef.spinRatio - 27.39646523) < 0.01 &&            // 実自転比 27.4×
        ef.rMin >= 180 * 0.99 && ef.rMax <= 180 * 1.01 &&         // 半径 180±1%
        ef.orbits > 10 &&
        ef.comMax < 0.01 &&                                       // 重心が動かない(全運動量0)
        ef.syncPerOrbit <= 2,
        `🌕 t≈5000(${ef.orbits.toFixed(2)}周): r=${ef.rMin.toFixed(2)}〜${ef.rMax.toFixed(2)}(180±1%) ` +
        `重心移動=${ef.comMax.toFixed(4)}(<0.01) 自転比=${ef.spinRatio.toFixed(2)}(実比27.40) ` +
        `同期誤差=${ef.syncPerOrbit.toFixed(2)}°/周(≤2) NaNなし=${!ef.nan}`);
    }
  } else {
    console.log('SKIP core.*(対象に主星2層なし)');
  }
}

// ---- 4-35 裁定(2026-07-23 第11便): 横画面レイアウト(タブレット・PC 想定)----
// landscape かつ幅 900px 以上で、キャンバス左・操作列/タブ/パネル右の2カラム(CSS grid)へ
// 組み替わることを 1024×768 で検査。ルート版は機能ゲートで SKIP(v1.29 昇格で自動有効化)。
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  if (/@media \(orientation:landscape\) and \(min-width:900px\)/.test(html)) {
    const ctxL = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const lp = await ctxL.newPage();
    await lp.goto(INDEX, { waitUntil: 'load' });
    await lp.waitForFunction(() => !!window.HP);
    const r = await lp.evaluate(() => {
      const app = document.getElementById('app');
      const grid = getComputedStyle(app).display === 'grid';
      const cw = document.getElementById('canvasWrap').getBoundingClientRect();
      const tabs = document.getElementById('tabs').getBoundingClientRect();
      document.querySelector('nav#tabs button').click();   // タブを開く
      const panel = document.getElementById('panel');
      const pr = panel.getBoundingClientRect();
      return { grid, side: tabs.left >= cw.right - 1, cwW: Math.round(cw.width), cwH: Math.round(cw.height),
        open: panel.classList.contains('open'), panelRight: pr.left >= cw.right - 1,
        panelTall: pr.height > 300 };   // 縦積み時の 50vh 上限が解除され右カラム残り高さへ伸びる
    });
    // 幅 900px 未満(スマホ横持ち・縦持ち)は従来レイアウトのままであることも確認
    await lp.setViewportSize({ width: 390, height: 844 });
    const flex = await lp.evaluate(() =>
      getComputedStyle(document.getElementById('app')).display === 'flex');
    await ctxL.close();
    add('ui.landscape', r.grid && r.side && r.open && r.panelRight && r.panelTall && r.cwH > 600 && flex,
      `grid=${r.grid} 2カラム=${r.side} キャンバス=${r.cwW}×${r.cwH} パネル右=${r.panelRight} ` +
      `パネル高>300=${r.panelTall} 縦積み復帰(390px)=${flex}`);
  } else {
    console.log('SKIP ui.landscape(対象に横画面レイアウトなし)');
  }
}

// ---- 第22便: 観測温度・光掻き出し・半径系(スピン役割分離は原仮定者裁定で廃止)----
// 対象に obsT 配列があるときだけ実行(ルート昇格前は SKIP)。較正実測は 2026-07-24 第22便:
// darkrotor v3(root)= 中心(m600・R45・spin0.12・コア mc/m=0.1・sc/s=20・Rc/R=0.3・掻出1・pinned)+
// コア付きハロー20体(m30・R12・spin0.15・掻出1・レール駆動)。u_φ 比 1.954/1.543/1.562(r=140/200/260)・
// 12000步安定(r90 220〜239 有界・外縁 2.0→2.8・中心スピン厳密不変)
// darkrotor v4(beta・第32便 W3b / 台帳4-47 Phase C)= ピン・レール全廃の閉鎖系。
// 中心BH(m2000・R45・spin0.12・単層・掻出1・自由)+ ハロー10体(m150・R18・spin0.15・コア付き・自由)+
// 恒星200体。u_φ 比 1.891/1.268/1.543・3000步(外縁3.574・r90 207.6・偏差1.59%・max|spin|2.197)・
// 12000步(偏差8.01%・max|spin|1.30・恒星保持100%・重心移動0.264)。以下の darkrotor 系 QA は
// プリセット定義(ピン・レールの有無)で新旧を機械判別して分岐する
{
  const hasObs = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.obsT));
  if (hasObs) {
    // 属性の受理・クランプ・実効値: radius が R を、coreRR が Rc を上書きし、
    // lightSweep=1 は η_rad>0 でも放射冷却しない(光が外に出ない)。A/B 転写も検査
    const at = await page.evaluate(() => {
      const mk = (over, phys) => ({ name: 'at', description: 'd', seed: 7, camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: Object.assign({ G: 1, D0: 1, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 60, cLight: 60,
          bM: 1, etaRad: 0, pRad: 2, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
          radiusScale: 1.2, softening: 2, timeScale: 1 }, phys || {}),
        bodies: [Object.assign({ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 2, pinned: false }, over)] });
      HP.sim.build(HP.validatePreset(mk({ radius: 20, coreMR: 0.5, coreSR: 4, coreRR: 0.5 })).preset);
      const okR = HP.sim.R[0] === 20 && HP.sim.Rc[0] === 10;
      HP.sim.build(HP.validatePreset(mk({})).preset);
      const okRdef = Math.abs(HP.sim.R[0] - 1.2 * Math.sqrt(100)) < 1e-6;
      const cool = (ls) => { HP.sim.build(HP.validatePreset(mk({ lightSweep: ls }, { etaRad: 0.5, G: 0 })).preset);
        const s0 = HP.sim.spin[0]; for (let k = 0; k < 500; k++) HP.sim.step(0.016); return HP.sim.spin[0] / s0; };
      const coolSwept = cool(1), coolOpen = cool(0);
      const v2 = HP.validatePreset(mk({ lightSweep: 2, obsT: 5000 }));
      const okClamp = v2.ok && v2.preset.bodies[0].lightSweep === 1 && v2.preset.bodies[0].obsT === 1000
        && v2.warnings.some(w => /lightSweep/.test(w)) && v2.warnings.some(w => /obsT/.test(w));
      const okReject = !HP.validatePreset(mk({ coreOT: 'x' })).ok;
      HP.loadPreset('darkrotor', false);
      HP.sim.obsT[0] = 7; HP.sim.lSw[0] = 0.5;
      HP.abStart(); const b = HP.ab().simB, okClone = b.obsT[0] === 7 && b.lSw[0] === 0.5; HP.abStop();
      return { okR, okRdef, coolSwept, coolOpen, okClamp, okReject, okClone };
    });
    add('obs.attrs', at.okR && at.okRdef && at.coolSwept === 1 && at.coolOpen < 0.5 && at.okClamp && at.okReject && at.okClone,
      `R上書き/Rc比=${at.okR} R既定式=${at.okRdef} 掻出1で無放射=${at.coolSwept}(=1) 対照冷却=${at.coolOpen.toExponential(1)}(<0.5) ` +
      `clamp+警告=${at.okClamp} 非数拒否=${at.okReject} A/B転写=${at.okClone}`);

    // 等価性: 明示既定値(obsT:1, lightSweep:0, coreOT:1)は省略時と bit 等価(回帰の錨)
    const eq = await page.evaluate(() => {
      const mk = (withKeys) => {
        const b = { type: 'single', m: 500, x: -40, y: 0, vx: 0, vy: -1.2, spin: 1.5, pinned: false };
        if (withKeys) Object.assign(b, { obsT: 1, lightSweep: 0, coreOT: 1 });
        return { name: 'eq', description: 'd', seed: 7, camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
          physics: { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 60, cLight: 60,
            bM: 1, etaRad: 0.001, pRad: 2, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
            radiusScale: 1.2, softening: 2, timeScale: 1 },
          bodies: [b, { type: 'single', m: 500, x: 40, y: 0, vx: 0, vy: 1.2, spin: -0.8, pinned: false },
            { type: 'disk', n: 60, cx: 0, cy: 0, radius: 150, mMin: 0.5, mMax: 1.5, spinMin: -2, spinMax: 2,
              vMode: 'kepler', aroundMass: 1000, vScale: 1, direction: 1 }] };
      };
      const run = (withKeys) => { HP.sim.build(HP.validatePreset(mk(withKeys)).preset);
        for (let k = 0; k < 300; k++) HP.sim.step(0.016);
        return { x: Array.from(HP.sim.x), y: Array.from(HP.sim.y), s: Array.from(HP.sim.spin) }; };
      const a = run(true), b = run(false);
      let maxd = 0;
      for (let i = 0; i < a.x.length; i++)
        maxd = Math.max(maxd, Math.abs(a.x[i] - b.x[i]), Math.abs(a.y[i] - b.y[i]), Math.abs(a.s[i] - b.s[i]));
      return { maxd };
    });
    add('obs.equivalence', eq.maxd === 0, `maxd=${eq.maxd}(=0: bit等価 — 観測層は既定で力学に影響しない)`);

    // 🕶️ darkrotor: t=0 の決定フレーム — 全ローター(中心+ハロー)のスピンを 0 にすると
    // u_φ が大きく低下(外殻+コアの引きずり)。u_φ 評価はエンジンの ω と同形(コア差動項込み)
    // 第32便 W3b: 🕶️ の構成が変わっても同じ測定が成立するよう、ローターは索引固定ではなく
    // 機械判定で選ぶ(恒星は spin=0)。
    // 第33便 X4(台帳4-65b): v5 でローターが単層化(coreMR 廃止・対向2体のみ spin 2.0)したため
    // 旧判定「中心(i=0)+コアを持つ粒子(coreMR≠0)」ではローターを選べなくなった(選択が中心1体だけに
    // なる)。プリセット定義の type:"single" 由来の粒子(=中心BH+全ローター。恒星は disk/ring 由来)
    // で選ぶ方式へ一般化する。「対照=全ローター spin0」の定義は不変で、root(旧v3)では選択集合も
    // u_φ もビット同一(実測: 選択21体・比 1.954/1.543/1.562 — 旧判定と一致)。
    const up = await page.evaluate(() => {
      const uphiAt = (s, r) => {
        const p = s.params, eps2 = p.softening * p.softening, q = p.q;
        let acc = 0;
        for (let a = 0; a < 16; a++) {
          const th = (a / 16) * Math.PI * 2, px = r * Math.cos(th), py = r * Math.sin(th);
          let uNx = 0, uNy = 0, W = p.D0;
          for (let j = 0; j < s.n; j++) {
            const dx = px - s.x[j], dy = py - s.y[j], d2 = dx * dx + dy * dy;
            const inv = 1 / Math.sqrt(d2 + eps2), w = s.m[j] * inv, d = Math.sqrt(d2);
            W += w;
            let om = 0; const sj = s.spin[j];
            if (sj !== 0) { const tt = s.R[j] / (s.R[j] + d); om = sj * Math.pow(tt, q); }
            if (s.coreMR[j] !== 0 && sj !== 0 && s.Rc[j] > 0 && s.coreSR[j] !== 1) {
              const tt = s.Rc[j] / (s.Rc[j] + d); om += s.coreMR[j] * sj * (s.coreSR[j] - 1) * Math.pow(tt, q);
            }
            uNx += w * (s.vx[j] + om * (-dy)); uNy += w * (s.vy[j] + om * dx);
          }
          acc += (px * uNy - py * uNx) / r / W;
        }
        return acc / 16;
      };
      const P = HP.allPresets().find(q => q.id === 'darkrotor');
      // ローター = プリセット定義の type:"single" 由来の粒子(中心BH+全ローター)
      const rotorIdx = () => { const idx = []; let k = 0;
        for (const b of P.bodies) { if (b.type === 'single') idx.push(k);
          k += (b.type === 'single' ? 1 : (b.n || 0)); }
        return idx; };
      const run = (spinOff) => { HP.loadPreset('darkrotor', false);
        const s = HP.sim;
        let nOff = 0;
        if (spinOff) for (const i of rotorIdx()) { s.spin[i] = 0; nOff++; }
        return { u140: uphiAt(s, 140), u200: uphiAt(s, 200), u260: uphiAt(s, 260), nOff }; };
      // v5 判別: ローターが単層(coreMR なし)。閾値はこの構成差で切り替える
      return { on: run(false), off: run(true),
        v5: P.bodies.filter(b => b.type === 'single').every(b => !b.coreMR) };
    });
    // 第33便 X4: 閾値は対象構成ごとの t=0 実測 ÷ 1.10(v4 と同等マージン)。
    // v5 実測 1.760/1.314/1.823 → 1.60/1.19/1.65 / 旧v3(root)は 1.954/1.543/1.562 のまま 1.70/1.15/1.35。
    const uTh = up.v5 ? [1.60, 1.19, 1.65] : [1.70, 1.15, 1.35];
    add('darkrotor.uphi', up.on.u140 > up.off.u140 * uTh[0] && up.on.u200 > up.off.u200 * uTh[1]
      && up.on.u260 > up.off.u260 * uTh[2],
      `u_φ(140)=${up.on.u140.toFixed(4)}/${up.off.u140.toFixed(4)} 比=${(up.on.u140 / up.off.u140).toFixed(3)}(>${uTh[0]}) ` +
      `u_φ(200)=${up.on.u200.toFixed(4)}/${up.off.u200.toFixed(4)} 比=${(up.on.u200 / up.off.u200).toFixed(3)}(>${uTh[1]}) ` +
      `u_φ(260)=${up.on.u260.toFixed(4)}/${up.off.u260.toFixed(4)} 比=${(up.on.u260 / up.off.u260).toFixed(3)}(>${uTh[2]}) ` +
      `スピン0にしたローター=${up.off.nOff}体 単層v5=${up.v5} / 第33便 X4 v5 の実測=1.760/1.314/1.823 ` +
      `(v4=1.891/1.268/1.543・旧v3=1.954/1.543/1.562)。v5 は閾値を実測÷1.10 で再設定: ` +
      `r140 1.70→1.60(緩和 — ローターが単層化し sc/s=20 のコア差動項が消えた構造変更による近傍引きずりの ` +
      `低下であって、引きずり経路の弱化ではない)/ r200 1.15→1.19・r260 1.35→1.65(いずれも強化 — ` +
      `対向2体の spin 2.0 が r=200〜260 の引きずりを押し上げる)。root(旧v3)は旧閾値のまま`);

    // 第32便 W3b(台帳4-47 Phase C): 🕶️ が「ピン+レール駆動の展示系(v3)」から
    // 「全粒子自由の閉鎖系(v4)」へ格上げされた。対象(root=旧v3 / beta=新v4)を
    // プリセット定義から機械判別し、判定式・測定幾何を切り替える。
    const drFree = await page.evaluate(() =>
      HP.allPresets().find(q => q.id === 'darkrotor')
        .bodies.every(b => !b.pinned && !b.railOmega && !b.railH));

    // 🕶️ の全自由化(v4)を固定する静的ゲート — 展示系(ピン・レール)への逆戻りを機械検出。
    // 恒星円盤(disk)は pinned キー自体を持たない(既定=自由)ので type 別に判定する。
    if (drFree) {
      const af = await page.evaluate(() => {
        const p = HP.allPresets().find(q => q.id === 'darkrotor');
        const bad = p.bodies.filter(b => (b.type === 'single' ? b.pinned !== false : !!b.pinned)
          || b.railOmega !== undefined || b.railH !== undefined);
        const t = HP.externalTags(p);
        HP.loadPreset('darkrotor', false);
        return { nBad: bad.length, nBody: p.bodies.length, pin: t.pin, rail: t.rail, n: HP.sim.n };
      });
      add('darkrotor.allfree', af.nBad === 0 && af.pin === 0 && af.rail === false,
        `pinned/rail 違反=${af.nBad}/${af.nBody}体 外部要素バッジ pin=${af.pin}(=0) rail=${af.rail}(=false: 閉鎖系) ` +
        `粒子数=${af.n} — 第32便 W3b: 旧v3 は中心pinned+ハロー20体の railOmega(展示系)だった`);
    } else {
      console.log('SKIP darkrotor.allfree(対象の🕶️はレール駆動の旧v3構成)');
    }

    // 🕶️ の中期安定(!FAST・3000步)。v4/v5(自由系)は中心BHも動くので半径・v_φ は
    // すべて中心BH基準で測る。測定系は第32便 W3b のまま・判定は第33便 X4 の v5 実測較正:
    // 外縁3.747・r90=214.1・ローター偏差5.97%・ローター平均|spin|=0.458・全粒子max|spin|=2.770・
    // BHスピン 0.12→0.12389・恒星保持380/380(100%)・重心移動0.041・t=0 総運動量0.0037。
    // 旧→新の閾値(いずれも v5 実測に v4 と同等のマージンで再設定):
    //   外縁 >2.8→>2.9(実測3.747。v4 実測3.574) / r90 <260 据置(実測214.1)
    //   ローター半径偏差 <6%→<10%(実測5.97% — v4 は 1.59%。v5 は対向2体の強スピンで
    //     リングが緩やかに膨らむ設計で、6000步でも17.2%に留まる。破綻構成は100%超)
    //   ローター平均|spin| <0.30→<0.80(実測0.458。v5 の初期値は (2×2.0+8×0.15)/10=0.52 で
    //     設計値そのもの。暴走検出という役割は不変)
    //   全粒子max|spin| <3.5→<4.0(実測2.770。ローター自身が spin 2.0 を持つので下限が 2.0 に上がった)
    //   BHスピン・恒星保持・重心移動・t=0 総運動量(<0.01・実測0.0037)は据置。
    // v3(レール駆動)は旧判定のまま(中心 pinned のスピン厳密不変・末尾ハロー20体)。
    if (!FAST) {
      if (drFree) {
        // 第35便 W5c: 計算部分は W5C_UNITS.darkrotorMidNew へ移し、ワーカーで実行する
        const st = await w5cGetUnit('darkrotorMidNew');
        add('behavior.darkrotor', !st.nan
          && st.r90 < 260 && st.outer > 2.9 && st.haloIn === 10 && st.haloDev < 0.10
          && st.haloSpin < 0.80 && st.maxSpin < 4.0 && Math.abs(st.bhSpin - 0.12) < 0.02
          && st.keepPct >= 95 && st.comMove < 0.5 && st.pTot0 < 0.01,
          `外縁v_φ=${st.outer.toFixed(3)}(>2.9・BH基準156〜286のn=${st.nOuter}) r90=${st.r90.toFixed(1)}(<260: 円盤非破壊) ` +
          `ローター残存=${st.haloIn}/${st.NH}(=10) ローター半径偏差=${(st.haloDev * 100).toFixed(2)}%(<10%) ` +
          `ローター平均|spin|=${st.haloSpin.toFixed(3)}(<0.80: 初期0.52=設計値) ` +
          `全粒子max|spin|=${st.maxSpin.toFixed(3)}(<4.0: 恒星のE6′汲み上げ検出。下限はローター自身の2.0) ` +
          `BHスピン=${st.bhSpin.toFixed(5)}(|Δ|<0.02 — 自由なので「不変」ではなく有界) ` +
          `恒星保持=${st.keep}/${st.tot}(${st.keepPct.toFixed(1)}%≥95) 重心移動=${st.comMove.toFixed(3)}(<0.5) ` +
          `t=0総運動量=${st.pTot0.toFixed(4)}(<0.01) NaN=${st.nan} ` +
          `/ 第33便 X4 v5 実測=3.747/214.1/5.97%/0.458/2.770/0.12389/100%/0.041/0.0037 ` +
          `(旧v4実測=3.574/207.6/1.59%/0.133/2.197/0.11774/100%/0.020/0.0006 — 閾値は v5 実測に ` +
          `v4 と同等のマージンで再設定。詳細は上のコメント) ` +
          `/ 走行後|P|=${st.pTotEnd.toFixed(2)} は判定しない(E6′の背景持ち分がD₀リザーバへ帳簿される仕様 — ` +
          `健全性は重心移動で判定)`);
      } else {
        // 第35便 W5c: 計算部分は W5C_UNITS.darkrotorMidOld へ移し、ワーカーで実行する
        const st = await w5cGetUnit('darkrotorMidOld');
        add('behavior.darkrotor', !st.nan && st.r90 < 320 && st.outer > 1.6 && st.inside >= 17
          && st.cSpinKeep && st.haloSpin < 0.5,
          `[旧v3: レール駆動の展示系] 外縁v_φ=${st.outer.toFixed(3)}(>1.6) r90=${st.r90.toFixed(1)}(<320: 円盤非破壊) ` +
          `ハロー残存=${st.inside}/${st.nHalo}(≥17) ハロー|spin|=${st.haloSpin.toFixed(3)}(<0.5: 暴走なし) ` +
          `中心スピン不変=${st.cSpinKeep}(pinned) NaN=${st.nan}`);
      }

      // 🕶️ v5 の有効窓検査 + 渦状腕の機械実証(6000步=t≈96。QA_FAST=1 では省略・v3 は対象外)。
      // 第33便 X4(台帳4-65b)で 12000步の安定検査から再定義した。理由: v5 は「対向2体のローターの
      // スピンだけが m=2 の渦状腕を立てる」ことを主張するサンプルであり、その主張の有効窓が 6000步
      // (t≈96)だから。12000步まで延ばすと対照(スピン0)側にも恒星円盤自身の重力不安定で A2 0.19〜0.30
      // の m=2 が育ち、ローター半径偏差も 34.7% に達して「腕の主因はスピン」の分離が成立しなくなる。
      // 測定: 環帯 [80,120][120,160][160,200][200,240] で A2=|Σ_j e^{2iθ_j}|/N_band(θ は中心BH基準)、
      // 後半平均 = t=3000〜6000 の 7 スナップショット平均。seed 20260726 固定で決定論。
      // 対照 = 同一 build のまま「中心BH+全ローターのスピンを 0」にしたもの(質量・半径・配置は
      // 完全に軸対称のままなので、対照は厳密な軸対称系 = m=2 の源はスピンだけ)。
      // 実測(beta v5): 本体 A2 後半平均 0.542/0.589/0.323/0.456 / 対照 0.067/0.065/0.046/0.108 /
      //   NaN なし・恒星保持 380/380(100%)・全期間 max|spin| 2.928・ローター半径偏差 17.23%。
      if (drFree) {
        // 第35便 W5c: 計算部分は W5C_UNITS.darkrotorLong へ移し、ワーカーで実行する
        const lg = await w5cGetUnit('darkrotorLong');
        const armOk = lg.on.A2.every(v => v > 0.22);
        const ctrlOk = lg.ctrl.A2.every(v => v < 0.19);
        const f3 = (a) => a.map(v => v.toFixed(3)).join('/');
        add('behavior.darkrotorLong', !lg.on.nan && !lg.ctrl.nan && lg.on.keepPct >= 95
          && lg.on.maxSpin < 4 && lg.on.rotDev < 0.25 && armOk && ctrlOk,
          `6000步(t≈96・seed固定で決定論) 腕A2(後半平均 t=3000〜6000 の${lg.on.nLate}点・環帯 ` +
          `[80,120][120,160][160,200][200,240])=${f3(lg.on.A2)}(4帯すべて>0.22) ` +
          `対照(中心BH+全ローターのスピン0)=${f3(lg.ctrl.A2)}(4帯すべて<0.19) ` +
          `恒星保持=${lg.on.keep}/${lg.on.tot}(${lg.on.keepPct.toFixed(1)}%≥95) ` +
          `全期間max|spin|=${lg.on.maxSpin.toFixed(3)}(<4) ローター半径偏差=${(lg.on.rotDev * 100).toFixed(2)}%(<25%) ` +
          `ローター残存=${lg.on.rotIn}/${lg.on.NH} NaN=${lg.on.nan}/${lg.ctrl.nan} ` +
          `— 腕の主因=ローターのスピン: ローターの質量・半径・軌道配置は完全に軸対称(10体すべて ` +
          `m=150・R=18・r=200 の等間隔リング)で、m=2 をつくっているのは対向2体のスピンだけ。` +
          `よって対照は厳密な軸対称系であり、そこに残る A2 は方位ランダムの統計下限 √(π/4N)` +
          `(終端の帯人数 N=${lg.ctrl.nBand.join('/')} → ${f3(lg.ctrl.noise)})と同オーダー ` +
          `— 対照側の「<0.19」は真の m=2 の不在ではなく下限値であることに注意。` +
          `有効窓は6000步まで(12000步では対照側にも円盤自身の重力不安定で A2 0.19〜0.30 が育ち、` +
          `ローター半径偏差も34.7%になるため分離が成立しない — 有限時間の閉鎖系デモ)。` +
          `第33便 X4 の較正実測(ドリフト比較用の基準値)= 腕 0.542/0.589/0.323/0.456・` +
          `対照 0.067/0.065/0.046/0.108・max|spin| 2.928・ローター半径偏差 17.23% ` +
          `(旧v4の「12000步の安定検査」から再定義した項目)`);
      } else {
        console.log('SKIP behavior.darkrotorLong(対象の🕶️はレール駆動の旧v3構成)');
      }
    }
  } else {
    console.log('SKIP obs.*/darkrotor.*(対象に観測温度系なし)');
  }
}

// ---- 7n) 第26便: カテゴリ再編 / kFrame 中間値解消 / radiusScale 既定1 / AIベースサンプル /
// ----     グラフ最小化 / 編集パネル最小化(beta 先行 — ルート対象時はスキップ)----
{
  const hasV26 = await page.evaluate(() => !!document.querySelector('#aiBasePreset'));
  if (hasV26) {
    const r = await page.evaluate(() => {
      const res = {};
      // ① カテゴリ再編: 内蔵 optgroup の並び(ja)。第31便: 「箱宇宙」グループの有無で
      // 期待並びを切替(root=v1.31 は5グループ・beta v1.32 以降は6グループ — 昇格後も通る)
      HP.setLang('ja');
      const labels = [...document.querySelectorAll('#presetSelect optgroup')].map(o => o.label);
      const hasBox = HP.allPresets().some(p => p.group === '箱宇宙');
      const want = hasBox ? ['空間と時間', '箱宇宙', '銀河', '光', '熱の実験室', '天体の物語']
                          : ['空間と時間', '銀河', '光', '熱の実験室', '天体の物語'];
      res.groups = labels.slice(0, want.length);
      res.groupsOk = JSON.stringify(res.groups) === JSON.stringify(want);
      // ② kFrame 中間値の解消: 全内蔵の physics.kFrame は 0 か 1
      res.kfBad = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
        .filter(p => p.physics.kFrame !== 0 && p.physics.kFrame !== 1).map(p => p.id);
      // ③ radiusScale 既定 1(バリデータの既定値マージ)
      const v = HP.validatePreset({ name: 'r', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      res.radiusDef = v.ok ? v.preset.physics.radiusScale : NaN;
      // ④ AIベースサンプル: 選択時に JSON+要望が文脈へ入り、未選択時は要望のみ
      const sel = document.querySelector('#aiBasePreset');
      res.baseOpts = sel.options.length;                      // なし+内蔵27(+AI生成)
      // 第33便 X4: 🕶️ v5 でローターが単層化(coreMR 廃止)したため、検査キーを coreMR →
      // aroundMass に差し替えた。意図(=要約ではなく body 階層の詳細キーまで payload に入る)は不変で、
      // lightSweep=single 天体の詳細キー・aroundMass=disk/ring 母集団の詳細キー。
      // 双方とも root(旧v3)/beta(v5)の🕶️に存在するので新旧どちらの構成でも成立する。
      sel.value = 'darkrotor';
      const ctx1 = HP.aiUserContent('テスト要望XYZ');
      res.baseCtx = ctx1.includes('lightSweep') && ctx1.includes('aroundMass') && ctx1.includes('テスト要望XYZ')
        && ctx1.includes('ベースサンプル');
      sel.value = '';
      res.basePlain = HP.aiUserContent('テスト要望XYZ') === 'テスト要望XYZ';
      return res;
    });
    add('groups.reorder', r.groupsOk, `optgroups=${JSON.stringify(r.groups)}`);
    add('preset.kframe-binary01', r.kfBad.length === 0, r.kfBad.join(',') || '全内蔵 kFrame∈{0,1}');
    add('params.radius-default', r.radiusDef === 1, `radiusScale既定=${r.radiusDef}(=1)`);
    add('ai.base-context', r.baseOpts >= 28 && r.baseCtx && r.basePlain,
      `候補=${r.baseOpts} 文脈注入=${r.baseCtx} 未選択は素通し=${r.basePlain}`);

    // ⑤ グラフ最小化: merger の2グラフで高さ 92→16 のスロット再配置
    const ov = await page.evaluate(() => {
      HP.loadPreset('merger', false);
      const uz = HP.uiScale ? HP.uiScale() : 1;   // 第27便: 既定=1.15 でも成立するよう実スケールで判定
      const y0a = HP.overlayBaseY(0), y1a = HP.overlayBaseY(1);
      HP.ovMin.rotationCurve = true;
      const y0b = HP.overlayBaseY(0), y1b = HP.overlayBaseY(1);
      HP.ovMin.rotationCurve = false;
      return { d0: y0b - y0a, d1: y1b - y1a, expected: (92 - 16) * uz, distinct: y0a !== y1a };
    });
    add('overlay.minimize', ov.distinct && Math.abs(ov.d0 - ov.expected) < 1e-6 && Math.abs(ov.d1 - ov.expected) < 1e-6,
      `Δslot0=${ov.d0} Δslot1=${ov.d1}(≈${ov.expected}) distinct=${ov.distinct}`);

    // ⑥ 編集パネル最小化: ✕→最小化トグル(−/＋)。行が畳まれ、再タップで復元
    const be = await page.evaluate(() => {
      HP.loadPreset('saturn', false);
      HP.selectBody(0, 'A');
      const el = document.querySelector('#bodyEdit'), btn = document.querySelector('#beClose');
      const shown0 = el.style.display === 'block';
      btn.click();
      const minOn = el.classList.contains('min')
        && getComputedStyle(document.querySelector('#bodyEdit .beRow')).display === 'none'
        && btn.textContent === '＋';
      const stillSelected = HP.selInfo().selIdx === 0;   // 最小化は選択を解除しない
      btn.click();
      const minOff = !el.classList.contains('min')
        && getComputedStyle(document.querySelector('#bodyEdit .beRow')).display !== 'none';
      HP.selectBody(-1, 'A');
      return { shown0, minOn, stillSelected, minOff };
    });
    add('bodyedit.minimize', be.shown0 && be.minOn && be.stillSelected && be.minOff,
      `表示=${be.shown0} 最小化=${be.minOn} 選択維持=${be.stillSelected} 復元=${be.minOff}`);

    // ⑦ ⭐binary kFrame=1 の挙動: 3000步で連星が束縛(sep<350)・円盤残存 ≥95%・NaNなし
    //   (掃引実測 2026-07-25: 12000步で sep≈240・残存240/240 — 3000步はその途中経過)
    // 第35便 W5c: 計算部分は W5C_UNITS.binary へ移し、ワーカーで実行する
    const bi = await w5cGetUnit('binary');
    add('behavior.binary', !bi.nan && bi.sep > 60 && bi.sep < 350 && bi.keep >= bi.free * 0.95,
      `恒星間距離=${bi.sep.toFixed(1)}(60〜350) 円盤残存=${bi.keep}/${bi.free}(≥95%) NaN=${bi.nan}`);
  } else {
    console.log('SKIP 第26便系(groups.reorder / ai.base-context / overlay.minimize / bodyedit.minimize / behavior.binary — 対象にベースサンプルUIなし)');
  }
}

// ---- 7o) 第27便: タイトルタップの説明パネル / A/B説明の折り畳み / 文字サイズ既定 /
// ----     ❄️改名(beta 先行 — ルート対象時はスキップ)----
{
  const hasV27 = await page.evaluate(() => !!document.querySelector('#aboutPanel'));
  if (hasV27) {
    const r = await page.evaluate(() => {
      const res = {};
      HP.setLang('ja');
      // ① タイトルタップ → アプリ説明(操作・法則要約は説明タブから移動)
      const panel = document.querySelector('#aboutPanel');
      document.querySelector('#appTitle').click();
      res.opened = panel.style.display === 'block';
      const t = panel.textContent;
      res.hasOps = t.includes('2本指ピンチ');            // helpOpsBody
      res.hasLaws = t.includes('スピン=熱');             // helpLawsBody
      res.hasAbout = t.includes('決定力場モデル');       // aboutBody
      document.querySelector('#aboutClose').click();
      res.closed = panel.style.display === 'none';
      // 説明タブ側からは移動済み(サンプル説明・理論解説・外部要素は残る)
      HP.loadPreset('saturn', false);
      const hb = document.querySelector('#helpBody').textContent;
      res.helpMoved = !hb.includes('2本指ピンチ') && !hb.includes('スピン=熱') && hb.includes('外部要素');
      // ② A/B比較の説明は畳んでおく
      const wrap = document.querySelector('#abNoteWrap');
      res.abCollapsed = !!wrap && !wrap.open && wrap.textContent.includes('A/B比較とは');
      // ③ 文字サイズ: 小/標準/大・既定=1.15(旧「大」)
      res.uiScale = HP.uiScale();
      const opts = (HP.T('uiScaleOpts') || []).map(o => o[1]);
      res.uiOpts = JSON.stringify(opts) === JSON.stringify(['小', '標準', '大']);
      // ④ ❄️ 改名(雪線の用語は説明文に残す)
      const sl = HP.allPresets().find(p => p.id === 'snowline');
      res.slName = sl.name.includes('塵は冷えると固まる') && sl.description.includes('雪線')
        && sl.en.name.includes('Dust Clumps When Cold') && /snow.line/i.test(sl.en.description);   // 第28便: 日英同期
      return res;
    });
    add('about.panel', r.opened && r.hasOps && r.hasLaws && r.hasAbout && r.closed,
      `開閉=${r.opened}/${r.closed} 操作=${r.hasOps} 法則=${r.hasLaws} 説明=${r.hasAbout}`);
    add('about.help-moved', r.helpMoved, '説明タブから操作・法則要約が移動(外部要素は残置)');
    add('ab.note-collapsed', r.abCollapsed, '');
    add('ui.scale-default', r.uiScale === 1.15 && r.uiOpts, `既定=${r.uiScale}(=1.15) 選択肢=小/標準/大: ${r.uiOpts}`);
    add('preset.snowline-name', r.slName, '');
  } else {
    console.log('SKIP 第27便系(about.panel / ab.note-collapsed / ui.scale-default / preset.snowline-name — 対象に説明パネルなし)');
  }
}

// ---- 7p) 第28便(第24次レビュー裁定): railOmega の直接回帰 / 粒子数キャップ /
// ----     タイトル説明のキーボード対応(beta 先行 — ルート対象時はスキップ)----
{
  const hasRail = await page.evaluate(() => {
    const v = HP.validatePreset({ name: 'r', description: 'd', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, physics: {},
      bodies: [{ type: 'single', m: 10, x: 100, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, railOmega: 0.01 }] });
    return v.ok && v.preset.bodies[0].railOmega === 0.01;
  });
  if (hasRail) {
    // ① 検証器の契約: 受理・クランプ+警告・非数拒否・pinned=false は警告して無効化
    const rv = await page.evaluate(() => {
      const mk = (over) => ({ name: 'r', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [Object.assign({ type: 'single', m: 10, x: 100, y: 0, vx: 0, vy: 0, spin: 0, pinned: true }, over)] });
      const vClamp = HP.validatePreset(mk({ railOmega: 5 }));
      const vNaN = HP.validatePreset(mk({ railOmega: 'x' }));
      const vFree = HP.validatePreset(mk({ railOmega: 0.5, pinned: false }));
      return { clampOk: vClamp.ok && vClamp.preset.bodies[0].railOmega === 2 && vClamp.warnings.some(w => /railOmega/.test(w)),
        nanRejected: !vNaN.ok,
        freeOk: vFree.ok && vFree.preset.bodies[0].railOmega === 0 && vFree.warnings.some(w => /railOmega/.test(w)) };
    });
    add('rail.validator', rv.clampOk && rv.nanRejected && rv.freeOk,
      `clamp5→2+警告=${rv.clampOk} 非数拒否=${rv.nanRejected} pinned=false無効化+警告=${rv.freeOk}`);

    // ② 運動の契約: 半径一定・位相増分=ωΔt・正負で回転方向が反転・railOmega=0 は静止固定
    const rm = await page.evaluate(() => {
      const run = (om) => {
        const v = HP.validatePreset({ name: 'r', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, physics: { G: 0, D0: 2, kFrame: 0, kRep: 0, muF: 0, gammaN: 0, kappaS: 0 },
          bodies: [{ type: 'single', m: 10, x: 100, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, railOmega: om }] });
        HP.sim.build(v.preset);
        let ang0 = Math.atan2(HP.sim.y[0], HP.sim.x[0]), unwrapped = 0, prev = ang0;
        let rErr = 0;
        for (let k = 0; k < 200; k++) { HP.sim.step(0.016);
          const a = Math.atan2(HP.sim.y[0], HP.sim.x[0]);
          let d = a - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
          unwrapped += d; prev = a;
          rErr = Math.max(rErr, Math.abs(Math.hypot(HP.sim.x[0], HP.sim.y[0]) - 100)); }
        return { phase: unwrapped, rErr, moved: Math.hypot(HP.sim.x[0] - 100, HP.sim.y[0]) };
      };
      const fwd = run(0.5), rev = run(-0.5), zero = run(0);
      const expected = 0.5 * 200 * 0.016;   // ωΣdt = 1.6 rad
      return { fwd, rev, zero, expected };
    });
    add('rail.motion',
      Math.abs(rm.fwd.phase - rm.expected) < 1e-3 && Math.abs(rm.rev.phase + rm.expected) < 1e-3
      && rm.fwd.rErr < 1e-3 && rm.rev.rErr < 1e-3 && rm.zero.moved === 0,
      `位相=${rm.fwd.phase.toFixed(4)}/${rm.rev.phase.toFixed(4)}(±${rm.expected}) 半径誤差=${rm.fwd.rErr.toExponential(1)} ω=0静止=${rm.zero.moved === 0}`);

    // ③ A/Bコピー・⏮リセット・インポート往復・外部要素バッジ
    // 第32便 W3b: 🕶️ が全自由化(ピン・レール無し)されたため、検査対象を「レール駆動を含む
    // 内蔵プリセット」から動的に選ぶ(旧: darkrotor 固定・20本ハードコード → 新: 定義から算出。
    // root=🕶️ の単体レール20本 / beta=🌀回る箱の pinned リング96本)。
    const rr = await page.evaluate(() => {
      // プリセット定義から期待レール本数を数える(単体=pinned+railOmega/railH、
      // リング=pinned+vMode:"omega"(ω≠0) または railH。エンジンの railIdx 条件と同義)
      const nRailDef = (p) => p.bodies.reduce((a, b) => a + (b.type === 'single'
        ? ((b.pinned && (b.railOmega || b.railH)) ? 1 : 0)
        : ((b.pinned && ((b.vMode === 'omega' && b.omega) || b.railH)) ? (b.n || 0) : 0)), 0);
      const p = HP.allPresets().filter(q => !String(q.id).startsWith('custom_'))
        .find(q => nRailDef(q) > 0);
      if (!p) return { id: '(なし)', want: 0 };
      const want = nRailDef(p);
      HP.loadPreset(p.id, false);
      for (let k = 0; k < 50; k++) HP.sim.step(0.016);
      HP.abStart();
      const b = HP.ab().simB;
      let abOk = true;
      for (let i = 0; i < HP.sim.n; i++) if (b.railOmega[i] !== HP.sim.railOmega[i]
        || (HP.sim.railH && b.railH[i] !== HP.sim.railH[i])
        || b.x[i] !== HP.sim.x[i] || b.railR[i] !== HP.sim.railR[i]) abOk = false;
      HP.abStop();
      // ⏮ 相当: 再ロードで rail が復元される
      HP.loadPreset(p.id, false);
      let nRail = 0;
      for (let i = 0; i < HP.sim.n; i++)
        if (HP.sim.railOmega[i] !== 0 || (HP.sim.railH ? HP.sim.railH[i] : 0) !== 0) nRail++;
      // インポート往復: 検証済みプリセットを再シリアライズしてもレール指定が保存される
      const v1 = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const v2 = HP.validatePreset(JSON.parse(JSON.stringify(v1.preset)));
      const key = (q) => q.bodies.map(b2 => [b2.railOmega || 0, b2.railH || 0, b2.omega || 0,
        b2.vMode || '', b2.pinned ? 1 : 0].join(':')).join('|');
      const rtOk = v1.ok && v2.ok && nRailDef(v1.preset) === want && key(v1.preset) === key(v2.preset);
      // 外部要素バッジ: レール駆動を検出し「閉鎖系」と誤表示しない
      const tags = HP.externalTags(p);
      return { id: p.id, want, abOk, nRail, rtOk, rail: tags.rail, pin: tags.pin };
    });
    add('rail.ab-reset-roundtrip', rr.want > 0 && rr.abOk && rr.nRail === rr.want && rr.rtOk,
      `対象=${rr.id} A/B転写=${rr.abOk} 再ロードのレール数=${rr.nRail}(=定義${rr.want}) 検証往復=${rr.rtOk}`);
    add('rail.badge', rr.want > 0 && rr.rail === true && rr.pin >= rr.want,
      `対象=${rr.id} rail=${rr.rail} pin=${rr.pin}(≥レール${rr.want})`);

    // ④ 粒子数キャップ(性能回帰の静的ゲート — 第27便軽量化の維持)+ 🌠 q=2 高速経路
    const pc = await page.evaluate(() => {
      const tot = (id) => { const p = HP.allPresets().find(q => q.id === id);
        return p.bodies.reduce((a, b) => a + (b.type === 'single' ? 1 : b.n), 0); };
      const mq = HP.allPresets().find(q => q.id === 'merger').physics.q;
      return { merger: tot('merger'), counterring: tot('counterring'), darkrotor: tot('darkrotor'), mq };
    });
    add('perf.particle-caps', pc.merger <= 280 && pc.counterring <= 210 && pc.darkrotor <= 410 && pc.mq === 2,
      `merger=${pc.merger}(≤280) counterring=${pc.counterring}(≤210) darkrotor=${pc.darkrotor}(≤410) q=${pc.mq}(=2)`);

    // ⑤ タイトル説明のキーボード対応(第24次レビュー P1-4)
    const kb = await page.evaluate(() => {
      const t = document.querySelector('#appTitle'), panel = document.querySelector('#aboutPanel');
      const attrs = t.getAttribute('role') === 'button' && t.getAttribute('tabindex') === '0'
        && panel.getAttribute('role') === 'dialog';
      t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      const opened = panel.style.display === 'block' && t.getAttribute('aria-expanded') === 'true';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const closed = panel.style.display === 'none' && t.getAttribute('aria-expanded') === 'false';
      return { attrs, opened, closed };
    });
    add('about.keyboard', kb.attrs && kb.opened && kb.closed,
      `role/tabindex/dialog=${kb.attrs} Enterで開く=${kb.opened} Escapeで閉じる=${kb.closed}`);
  } else {
    console.log('SKIP 第28便系(rail.* / perf.particle-caps / about.keyboard — 対象に railOmega なし)');
  }
}

// ---- 7q) 第29便(第25次レビュー裁定): 処理の高速化 — ♨️timeScale復帰 / レール索引 /
// ----     軌跡の品質別上限 / 描画半径の品質連動上限(beta 先行 — ルート対象時はスキップ)----
{
  const hasV29 = await page.evaluate(() => typeof HP.drawRadiusCap === 'function');
  if (hasV29) {
    // ① P0-1: ♨️対流の timeScale が root 相当(2)へ復帰している(CPU計算量1.5倍の主因を除去)
    const ts = await page.evaluate(() => { HP.loadPreset('convection', false); return HP.sim.params.timeScale; });
    add('perf.convection-timescale', ts === 2, `timeScale=${ts}(期待2 — 第25次レビュー P0-1)`);

    // ② P1-1: レール索引 — レール駆動プリセットの本数分だけが索引に載り、レール無し宇宙(🌌)は空。
    //    索引の中身は全て pinned+(railOmega≠0 または railH≠0)と整合する。
    //    第32便 W3b: 🕶️ の全自由化により対象を固定せず「レールを持つ内蔵プリセット」から選ぶ
    //    (旧: darkrotor 固定・期待20本 → 新: プリセット定義から期待本数を算出)
    const ri = await page.evaluate(() => {
      const nRailDef = (p) => p.bodies.reduce((a, b) => a + (b.type === 'single'
        ? ((b.pinned && (b.railOmega || b.railH)) ? 1 : 0)
        : ((b.pinned && ((b.vMode === 'omega' && b.omega) || b.railH)) ? (b.n || 0) : 0)), 0);
      const p = HP.allPresets().filter(q => !String(q.id).startsWith('custom_'))
        .find(q => nRailDef(q) > 0);
      if (!p) return { id: '(なし)', want: 0, len: -1, nRail: -1, consistent: false, empty: false };
      HP.loadPreset(p.id, false); HP.sim.step(0.016);
      const S = HP.sim, idx = S.railIdx || [], rH = (i) => (S.railH ? S.railH[i] : 0);
      const consistent = idx.every(i => S.pinned[i] === 1 && (S.railOmega[i] !== 0 || rH(i) !== 0));
      let nRail = 0;
      for (let i = 0; i < S.n; i++) if (S.pinned[i] && (S.railOmega[i] !== 0 || rH(i) !== 0)) nRail++;
      HP.loadPreset('galaxy', false); HP.sim.step(0.016);
      const empty = (HP.sim.railIdx || [-1]).length === 0;
      return { id: p.id, want: nRailDef(p), len: idx.length, nRail, consistent, empty };
    });
    add('perf.rail-indices', ri.want > 0 && ri.len === ri.nRail && ri.len === ri.want && ri.consistent && ri.empty,
      `対象=${ri.id} 索引=${ri.len}/実レール${ri.nRail}(定義${ri.want}) 整合=${ri.consistent} 🌌は空=${ri.empty}`);

    // ③ P1-2: 軌跡バッファの品質別上限 — 2000回記録しても cap+余裕(120点)以内に刈られ、
    //    先頭(最古)が捨てられて末尾(最新)が残る
    const tc = await page.evaluate(() => {
      HP.loadPreset('convection', false);
      const capF = HP.Q_TRAILPTS[HP.qState().level] * 2;
      const buf = [];
      for (let k = 0; k < 2000; k++) HP.recTrail(HP.sim, buf);
      const filled = buf.filter(b => b && b.length > 0);
      const lens = filled.map(b => b.length);
      return { nFilled: filled.length, maxLen: Math.max(...lens), minLen: Math.min(...lens), capF };
    });
    add('perf.trail-cap', tc.nFilled > 0 && tc.maxLen <= tc.capF + 240 && tc.minLen >= tc.capF,
      `記録本数=${tc.nFilled} 長さ=${tc.minLen}〜${tc.maxLen}floats(上限${tc.capF}+240)`);

    // ④ P0-2: 描画半径の品質連動上限 — 正確=無制限(半径準拠の第25便裁定を維持)/
    //    自動(未縮退)=40px / 軽量=30px。検査後は既定(自動)へ戻す
    const rc = await page.evaluate(() => {
      HP.setQuality('exact'); const ex = HP.drawRadiusCap() === Infinity;
      HP.setQuality('lite'); const lt = HP.drawRadiusCap();
      HP.setQuality('auto'); const au = HP.drawRadiusCap();
      return { ex, lt, au };
    });
    add('perf.draw-radius-cap', rc.ex && rc.lt === 30 && rc.au === 40,
      `正確=∞:${rc.ex} 軽量=${rc.lt}(期待30) 自動=${rc.au}(期待40)`);
  } else {
    console.log('SKIP 第29便系(perf.convection-timescale / perf.rail-indices / perf.trail-cap / perf.draw-radius-cap — 対象に描画半径上限なし)');
  }
}

// ---- 7r) 第32便 W4(台帳4-49): 回転曲線の基準線 v_bar(r)(beta 先行 — 実装が
// ----     beta/index.html だけのため、ルート対象では機能ゲートでスキップ)----
{
  const hasVBar = await page.evaluate(() => typeof HP.curveVBarAt === 'function');
  if (hasVBar) {
    // ① curve.vbar-degenerate: 中心1質点(m=1500・pinned)+質量を0へ落とした軽いリングの検証系で、
    //    v_bar(r) が縮退の解析解 √(G・M・r²/(r²+ε²)^{3/2}) と相対誤差<1e-6 で一致することを機械固定
    //    (リングは build 後に質量を厳密0にして寄与を排除 — validatePreset の質量下限0.01を
    //    回避する QA 専用の直接操作。物理エンジン自体は無改変)
    const deg = await page.evaluate(() => {
      const M = 1500, G = 1, eps = 3;
      const preset = {
        name: 'vbar-deg', description: 'd', seed: 1, camera: { scale: 300 },
        world: { boundary: 'none', size: 0 },
        physics: { G, D0: 1, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 60,
          cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
          radiusScale: 1.2, softening: eps, timeScale: 1 },
        bodies: [
          { type: 'single', m: M, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
          { type: 'ring', n: 24, cx: 0, cy: 0, rIn: 260, rOut: 260, mMin: 0.01, mMax: 0.01,
            spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: M, omega: 0, vNoise: 0,
            direction: 1, pinned: false },
        ],
      };
      HP.sim.build(HP.validatePreset(preset).preset);
      for (let i = 1; i < HP.sim.n; i++) HP.sim.m[i] = 0;   // 「軽い」リング→縮退検証のため厳密0
      const eps2 = eps * eps;
      const rs = [30, 60, 90, 150, 220, 300];
      const errs = rs.map((r) => {
        const vb = HP.curveVBarAt(0, 0, r);
        const expect = Math.sqrt(G * M * r * r / Math.pow(r * r + eps2, 1.5));
        return Math.abs(vb - expect) / expect;
      });
      return { errs, maxErr: Math.max(...errs) };
    });
    add('curve.vbar-degenerate', deg.maxErr < 1e-6,
      `相対誤差(r=30,60,90,150,220,300)=${deg.errs.map((e) => e.toExponential(1)).join(',')} ` +
      `最大=${deg.maxErr.toExponential(2)}(<1e-6)`);

    // ② curve.vbar-distributed: 🌌galaxy で、外側ビン(r=220)の v_bar(全質量由来)が
    //    「中心質量のみのケプラー値」より大きい(円盤=分布質量の寄与が入っている)ことを確認
    const dist = await page.evaluate(() => {
      HP.loadPreset('galaxy', false);
      const s = HP.sim;
      let mMax = 0, cx = 0, cy = 0;
      for (let i = 0; i < s.n; i++) if (s.m[i] > mMax) { mMax = s.m[i]; cx = s.x[i]; cy = s.y[i]; }
      const eps2 = s.params.softening * s.params.softening, G = s.params.G, r = 220;
      const vAll = HP.curveVBarAt(cx, cy, r);
      const vCentral = Math.sqrt(G * mMax * r * r / Math.pow(r * r + eps2, 1.5));
      return { vAll, vCentral };
    });
    add('curve.vbar-distributed', dist.vAll > dist.vCentral * 1.01,
      `r=220 v_bar(全質量)=${dist.vAll.toFixed(4)} v_bar(中心質量のみ)=${dist.vCentral.toFixed(4)} ` +
      `比=${(dist.vAll / dist.vCentral).toFixed(3)}(>1.01)`);
  } else {
    console.log('SKIP curve.vbar-degenerate/curve.vbar-distributed(対象に v_bar 実装なし)');
  }
}

// ---- 7s) 第32便 W4(台帳4-58前半): AI送信内容の詳細可視化(beta 先行 — ルート対象時はスキップ)----
{
  const hasAiPreview = await page.evaluate(() => !!document.querySelector('#aiPreviewWrap'));
  if (hasAiPreview) {
    // ai.payload-preview: プレビューを開いた状態で要望テキストを入れると、表示内容が
    // HP.aiUserContent(そのテキスト) と完全一致する。ベース選択の変更にも追従する
    const pv = await page.evaluate(() => {
      HP.loadPreset('galaxy', false);
      const wrap = document.querySelector('#aiPreviewWrap'), body = document.querySelector('#aiPreviewBody'),
            prompt = document.querySelector('#aiPrompt'), sel = document.querySelector('#aiBasePreset');
      wrap.open = true; wrap.dispatchEvent(new Event('toggle'));
      sel.value = '';
      prompt.value = 'テスト要望QAプレビュー'; prompt.dispatchEvent(new Event('input'));
      const plain = body.value === HP.aiUserContent('テスト要望QAプレビュー');
      sel.value = 'darkrotor'; sel.dispatchEvent(new Event('change'));
      const withBase = body.value === HP.aiUserContent('テスト要望QAプレビュー') && body.value.includes('lightSweep');
      const sysNoteOk = document.querySelector('#aiPreviewSysNote').textContent.includes(String(HP.SYSTEM_PROMPT.length));
      wrap.open = false; wrap.dispatchEvent(new Event('toggle'));
      sel.value = '';
      return { plain, withBase, sysNoteOk };
    });
    add('ai.payload-preview', pv.plain && pv.withBase && pv.sysNoteOk,
      `未選択一致=${pv.plain} ベース選択後も一致+文脈注入=${pv.withBase} システムプロンプト文字数表示=${pv.sysNoteOk}`);
  } else {
    console.log('SKIP ai.payload-preview(対象にAI送信内容プレビューUIなし)');
  }
}

// ---- 7t) 第32便 W4(台帳4-58後半): QAのスクリーンショット取得(CIアーティファクト化)。
// ----     ピクセル差分回帰ではなく、CI アーティファクトとしての取得+非空検査(差分回帰は
// ----     表示ゆらぎで壊れやすいため段階導入 — 台帳4-58)。ルート・beta 双方で撮影する ----
{
  const shotTarget = TARGET.startsWith('beta/') ? 'beta' : 'root';
  const shotPath = path.join(OUT_DIR, `screenshot-${shotTarget}.png`);
  await page.evaluate(() => { HP.loadPreset('galaxy', false); HP.tick(60); });
  await page.screenshot({ path: shotPath });
  let shotSize = 0;
  try { shotSize = fs.statSync(shotPath).size; } catch {}
  add('shot.capture', shotSize > 20000, `path=${shotPath} size=${shotSize}bytes(>20000)`);
}

// ---- 7t2) 第35便 W5b(台帳4-58後半): スクリーンショット回帰(段階導入の後半)。上の shot.capture
// ----   (全画面1枚のCIアーティファクト取得)は不変のまま存続する。本節はキャンバス要素(#cv)限定の
// ----   キャプチャを対象プリセット分だけ取得し、48×48グレースケール輝度グリッドへ縮約した知覚
// ----   ハッシュを tests/baseline-shots.json(コミット対象)と比較する回帰テストを追加する。
// ----   PNGデコードはNode側に画像ライブラリを追加せず、page内で Image→canvas→getImageData で行う。
// ----   !FAST 時のみ実行(表示ゆらぎに弱い差分回帰を通常のFASTスイートから隔離する、直上の
// ----   7t) shot.capture 自身のコメントにある段階導入方針を踏襲)----
if (!FAST) {
  const GRID = 48;
  const BASE_SHOT_IDS = ['gclock', 'boxcomoving', 'boxredshift', 'galaxy', 'darkrotor', 'lensing',
    'gas', 'convection', 'saturn', 'earthMoon', 'fig8', 'snowline'];
  // 第35便 W2/W3 の ⏪echo・🕊️freebox が対象に存在すれば追加して14件にする(対象の有無で自動判定)
  const presentIds = await page.evaluate((extra) => {
    const all = HP.allPresets();
    return extra.filter(id => all.some(p => p.id === id));
  }, ['echo', 'freebox']);
  const SHOT_IDS = BASE_SHOT_IDS.concat(presentIds);

  // 意図的な見た目変更をした便でここへ理由つきで追加する運用(perf.mjs 22行の ALLOW と同形式)
  const SHOT_ALLOW = { /* id: {mAD, frac, reason} */ };

  const shotsDir = path.join(OUT_DIR, 'shots');
  fs.mkdirSync(shotsDir, { recursive: true });
  const baselinePath = path.join(ROOT, 'tests', 'baseline-shots.json');
  let baseline = { schemaVersion: 1, grid: GRID, presets: {} };
  try {
    const j = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    if (j && j.schemaVersion === 1 && j.grid === GRID && j.presets) baseline = j;
  } catch {}
  let shotCommit = 'unknown';
  try { shotCommit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}
  let baselineDirty = false;

  for (const id of SHOT_IDS) {
    let hex = null, capErr = null;
    try {
      await page.evaluate((pid) => { HP.loadPreset(pid, false); HP.tick(120); }, id);
      const shotPath = path.join(shotsDir, `${id}.png`);
      const buf = await page.locator('#cv').screenshot({ path: shotPath });   // キャンバス限定(DOM文字・フォント差を排除)
      // page内でImageへ読み戻し、48×48へ縮約して輝度(4bit量子化・1セル1桁)をhex化する
      hex = await page.evaluate(({ b64, grid }) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const cv2 = document.createElement('canvas'); cv2.width = grid; cv2.height = grid;
          const cx = cv2.getContext('2d');
          cx.drawImage(img, 0, 0, grid, grid);
          const data = cx.getImageData(0, 0, grid, grid).data;
          let h = '';
          for (let i = 0; i < grid * grid; i++) {
            const luma = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];   // 0..255
            h += Math.min(15, Math.max(0, Math.round(luma / 17))).toString(16);   // 4bit量子化(0-15)
          }
          resolve(h);
        };
        img.onerror = () => reject(new Error('image decode failed'));
        img.src = 'data:image/png;base64,' + b64;
      }), { b64: buf.toString('base64'), grid: GRID });
    } catch (e) { capErr = String(e); }

    if (capErr) { add(`shot.regress-${id}`, false, `キャプチャ/縮約に失敗: ${capErr}`); continue; }

    const prev = baseline.presets[id];
    if (!prev) {
      // 基準が無いid: 本便の初回実行で基準を書き込みPASS(以降のQA実行〔同一コミット・別コミット問わず〕から回帰対象になる)
      baseline.presets[id] = { luma: hex, capturedAt: new Date().toISOString(), commit: shotCommit };
      baselineDirty = true;
      add(`shot.regress-${id}`, true, `BASELINE recorded(path=${path.join(shotsDir, id + '.png')})`);
      continue;
    }
    let sumAbs = 0, over = 0;
    for (let i = 0; i < hex.length; i++) {
      const d = Math.abs(parseInt(hex[i], 16) - parseInt(prev.luma[i], 16)) * 17;   // 4bit値を0-255相当へ復元して比較
      sumAbs += d; if (d > 24) over++;
    }
    const mAD = sumAbs / hex.length, frac = over / hex.length;
    const allow = SHOT_ALLOW[id];
    const limMAD = allow ? allow.mAD : 10, limFrac = allow ? allow.frac : 0.15;
    // 実測(beta 2026-07-26): 同一コミットを独立4回撮影した自然ゆらぎ(表示更新タイミング由来 —
    // requestAnimationFrame ループが HP.tick() の手動 render() と非同期に競合し得るための残差)は
    // 最大 mAD=1.56・diff>24セル比率=6.4%(boxcomoving。他は概ね0)。閾値10/15%はそれぞれ
    // 実測最大値の約6.4倍・2.3倍の余裕
    add(`shot.regress-${id}`, mAD <= limMAD && frac <= limFrac,
      `mAD=${mAD.toFixed(2)}(≤${limMAD}) diff>24セル比率=${(frac * 100).toFixed(1)}%(≤${(limFrac * 100).toFixed(0)}%)` +
      (allow ? ` [SHOT_ALLOW: ${allow.reason}]` : '') + ` baseline capturedAt=${prev.capturedAt} commit=${prev.commit.slice(0, 8)}`);
  }
  if (baselineDirty) fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 1) + '\n');
} else {
  console.log('SKIP shot.regress-*(QA_FAST=1 — 段階導入の差分回帰はフルQAのみ)');
}

// ---- 7u) 第33便(実装4): ui.aitab-no-hscroll(beta 先行ガード — 修正はルート index.html に
// ----     未適用のため、対象時のみ検査してスキップする)。原仮定者指摘「AI追加タブだけ
// ----     パネルの中身が左右にスクロールする」の機械回帰ガード。viewport は本スイート既定の
// ----     390×844(page 生成時に指定済み)をそのまま使う ----
if (TARGET.startsWith('beta/')) {
  const r = await page.evaluate(() => {
    document.querySelector('#tabs button[data-tab=ai]').click();
    const tab = document.querySelector('#page-ai');
    const bad = [...tab.querySelectorAll('*')].filter(e => e.scrollWidth > e.clientWidth + 1)
      .map(e => `${e.tagName}#${e.id || '(no-id)'}.${String(e.className).split(' ')[0] || ''} sw=${e.scrollWidth}/cw=${e.clientWidth}`);
    document.querySelector('#tabs button[data-tab=ai]').click();   // パネルを閉じ直す(以降の項目に影響させない)
    return { bad };
  });
  add('ui.aitab-no-hscroll', r.bad.length === 0,
    r.bad.length ? `はみ出し要素(viewport 390): ${r.bad.join(' / ')}`
      : 'AIタブに横スクロール要素なし(viewport 390。原因は #aiBasePreset のmin-width:0欠落 — 修正済み)');
} else {
  console.log('SKIP ui.aitab-no-hscroll(beta先行ガード — 対象はルート index.html で未修正)');
}

// ---- 7v) 第36便 Wave A(ChatGPT差分検証レビュー P1-1): AIベースJSONに新規最上位属性を含める。
// ----     presetForAIBase は本便の新規関数(root=旧版には存在しない)。関数の有無そのものを
// ----     機能検出ガードにする(hasBadgeClassify 等の先行例と同方式) ----
{
  const hasPresetForAIBase = await page.evaluate(() => typeof window.presetForAIBase === 'function');
  if (hasPresetForAIBase) {
    const r = await page.evaluate(() => {
      const sel = document.querySelector('#aiBasePreset');
      const has = (id) => HP.allPresets().some((p) => p.id === id);
      const out = { hasEcho: has('echo'), hasFreebox: has('freebox'), hasBoxredshift: has('boxredshift') };
      if (out.hasEcho) {
        sel.value = 'echo';
        const ctx = HP.aiUserContent('t');
        out.echo = { integrator: ctx.includes('"integrator":"leapfrog"'), echoFlipAt: ctx.includes('"echoFlipAt":20') };
      }
      if (out.hasFreebox) {
        sel.value = 'freebox';
        const ctx = HP.aiUserContent('t');
        out.freebox = { measureBox: ctx.includes('"measureBox":true') };
      }
      if (out.hasBoxredshift) {
        sel.value = 'boxredshift';
        const ctx = HP.aiUserContent('t');
        out.boxredshift = { universeBox: ctx.includes('"universeBox"'), photonEmit: ctx.includes('"photonEmit"') };
      }
      sel.value = '';
      return out;
    });
    const checks = [];
    if (r.hasEcho) checks.push(['echo.integrator', r.echo.integrator], ['echo.echoFlipAt', r.echo.echoFlipAt]);
    if (r.hasFreebox) checks.push(['freebox.measureBox', r.freebox.measureBox]);
    if (r.hasBoxredshift) checks.push(['boxredshift.universeBox', r.boxredshift.universeBox], ['boxredshift.photonEmit', r.boxredshift.photonEmit]);
    const bad = checks.filter(([, ok]) => !ok).map(([n]) => n);
    add('ai.base-topkeys', checks.length > 0 && bad.length === 0,
      checks.length ? checks.map(([n, ok]) => `${n}:${ok ? 'OK' : 'NG'}`).join(' ') : '対象ベースサンプル(echo/freebox/boxredshift)なし');
  } else {
    console.log('SKIP ai.base-topkeys(対象に presetForAIBase なし — 第36便 P1-1 未適用の root 等)');
  }
}

// ---- 7w) 第36便 Wave A(P1-2): presetSig に全挙動属性を含める(インポート重複判定)。
// ----     hasDrawScale(7h1e で定義済み — 同便で追加された sim.drawScale の有無)を「本便の
// ----     修正一式を含む beta」の代理指標として再利用する(root=旧版は drawScale 自体が無く
// ----     universeBox 等の署名漏れも root 側の既存問題のため、単一ガードでまとめて SKIP させる)----
if (hasDrawScale) {
  const r = await page.evaluate(() => {
    const singleBody = { type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false };
    const mk = (id, extra) => Object.assign({ id, name: id, description: 'd',
      camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, bodies: [singleBody] }, extra);
    const doImport = (obj) => { document.querySelector('#ioArea').value = JSON.stringify(obj); document.querySelector('#btnImport').click(); };
    const count = () => JSON.parse(localStorage.getItem('hp_custom_presets') || '[]').length;
    // 各条件: 粒子配置・physics(既定のまま)は同一で、対象キーだけが異なる2件
    const CONDS = {
      integrator: [mk('qa36_intA', { integrator: 'semi' }), mk('qa36_intB', { integrator: 'leapfrog' })],
      echoFlipAt: [mk('qa36_efA', {}), mk('qa36_efB', { echoFlipAt: 20 })],
      measureBox: [mk('qa36_mbA', {}), mk('qa36_mbB', { measureBox: true })],
      drawScale: [mk('qa36_dsA', {}), mk('qa36_dsB', { drawScale: 2 })],
      universeBox: [mk('qa36_ubA', {}), mk('qa36_ubB', { universeBox: { mode: 'exp', H0: 0.01 } })],
      photonEmit: [mk('qa36_peA', {}), mk('qa36_peB', { photonEmit: [{ body: 0, t: 0, lambda: 500 }] })],
      overlays: [mk('qa36_ovA', { overlays: { trail: false } }), mk('qa36_ovB', { overlays: { trail: true } })],
    };
    const out = {};
    for (const [key, pair] of Object.entries(CONDS)) {
      localStorage.setItem('hp_custom_presets', '[]');
      localStorage.setItem('hp_saves', '[]');
      const c0 = count();
      doImport(pair);
      out[key] = count() - c0;
    }
    localStorage.setItem('hp_custom_presets', '[]');
    localStorage.setItem('hp_saves', '[]');
    return out;
  });
  const bad = Object.entries(r).filter(([, n]) => n !== 2).map(([k, n]) => `${k}=${n}`);
  add('import.distinct-topkeys', bad.length === 0,
    Object.entries(r).map(([k, n]) => `${k}:${n === 2 ? 'OK' : 'NG(added=' + n + ',期待2)'}`).join(' '));
} else {
  console.log('SKIP import.distinct-topkeys(対象に drawScale なし — 第36便 P1-2 未適用の root 等)');
}

// ---- 7x) 第36便 Wave A(P1-3): セーブ重複判定キー sKey へ universeBox を追加 ----
if (hasDrawScale) {
  const r = await page.evaluate(() => {
    localStorage.setItem('hp_custom_presets', '[]');
    localStorage.setItem('hp_saves', '[]');
    const mkSave = (name, H0) => ({ name, presetId: 'qa36_boxsave', presetName: 'x',
      savedAt: new Date().toISOString(), physics: { G: 1 }, universeBox: { mode: 'exp', H0 } });
    document.querySelector('#ioArea').value = JSON.stringify(
      { saves: [mkSave('qa36save1', 0.01), mkSave('qa36save2', 0.02)], customPresets: [] });
    document.querySelector('#btnImport').click();
    const saves = JSON.parse(localStorage.getItem('hp_saves') || '[]');
    const h0s = saves.filter((s) => s.presetId === 'qa36_boxsave')
      .map((s) => s.universeBox && s.universeBox.H0).sort();
    localStorage.setItem('hp_custom_presets', '[]');
    localStorage.setItem('hp_saves', '[]');
    return { count: h0s.length, h0s };
  });
  add('save.dedup-box', r.count === 2 && r.h0s[0] === 0.01 && r.h0s[1] === 0.02,
    `残存件数=${r.count}(期待2) H0=[${r.h0s.join(',')}](期待 0.01,0.02 の両方)`);
} else {
  console.log('SKIP save.dedup-box(対象に drawScale なし — 第36便 P1-3 未適用の root 等)');
}

// ---- 7y) 第36便 Wave A(P2-1): 未保存ドラフトへ universeBox の実行中編集を含める
// ----     (saveDraft/restoreDraft)。draft.restore と同じくダイアログ処理は専用ページで行う ----
{
  const hasDraftFns = await page.evaluate(() =>
    typeof window.restoreDraft === 'function' && typeof window.saveDraft === 'function');
  if (hasDraftFns && hasDrawScale) {
    const hasBoxComoving = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'boxcomoving'));
    if (hasBoxComoving) {
      const dp = await browser.newPage();
      let dlg = 0;
      dp.on('dialog', (d) => { dlg++; d.accept(); });
      await dp.goto(INDEX);
      await dp.waitForFunction(() => !!window.HP);
      const r = await dp.evaluate(() => {
        HP.loadPreset('boxcomoving', false);
        const before = HP.sim.box ? HP.sim.box.H0 : null;
        if (HP.sim.box) HP.sim.box.H0 = 0.09;   // 実行中編集(未保存)
        window.saveDraft(true);
        const draft = JSON.parse(sessionStorage.getItem('hp_draft') || 'null');
        window.restoreDraft();
        return { before, draftHasBox: !!(draft && draft.universeBox),
          draftH0: draft && draft.universeBox && draft.universeBox.H0,
          afterH0: HP.sim.box ? HP.sim.box.H0 : null };
      });
      const ok = dlg === 1 && r.draftHasBox && Math.abs(r.draftH0 - 0.09) < 1e-12 && Math.abs(r.afterH0 - 0.09) < 1e-12;
      add('draft.box-restore', ok,
        `編集前H0=${r.before} confirm=${dlg} ドラフトH0=${r.draftH0} 復元後H0=${r.afterH0}(いずれも0.09を期待)`);
      await dp.close();
    } else {
      console.log('SKIP draft.box-restore(対象に🫧boxcomovingなし)');
    }
  } else {
    console.log('SKIP draft.box-restore(対象に saveDraft/restoreDraft の箱対応なし — 第36便 P2-1 未適用の root 等)');
  }
}

// ---- 7z) 第36便 Wave B(B1・原仮定者指示): version.beta-label — タイトル下のバージョン表示。
// ----     BETA_BUILD が beta/sw.js の CACHE 接尾辞と一致(version.sw-sync 0b2 と同型の静的検査)+
// ----     file:// では isBetaServe() が偽になる仕様を利用し、DOM表示が "v"+APP_VERSION へ
// ----     フォールバックすることも併せて確認する(対象に BETA_BUILD が無い root 等は SKIP)----
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const bb = (html.match(/const BETA_BUILD\s*=\s*"([^"]+)"/) || [])[1];
  if (bb) {
    const swPath = TARGET.startsWith('beta/') ? 'beta/sw.js' : 'sw.js';
    const sw = fs.readFileSync(path.join(ROOT, swPath), 'utf8');
    const cache = (sw.match(/CACHE = CACHE_PREFIX \+ "([^"]+)"/) || [])[1];
    const av = (html.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
    const domVer = await page.evaluate(() => document.querySelector('#appVer')?.textContent || '');
    add('version.beta-label', bb === cache && domVer === ('v' + av),
      `BETA_BUILD=${bb} sw.CACHE接尾辞=${cache}(要一致) DOM表示(file://)=${domVer}(期待=v${av}。` +
      `isBetaServe()がfile://で偽になり"v"+APP_VERSIONへ落ちる仕様を利用した検証)`);
  } else {
    console.log('SKIP version.beta-label(対象に BETA_BUILD なし — 第36便 B1 未適用の root 等)');
  }
}

// ---- 7z2) 第36便 Wave B(B3・原仮定者指示): ray.wavelength-color — 💡lensingの光線パス上、
// ----      始点近傍(ψ0)と最深部(経路上最大Wtotの点)の波長が λ0=550nm と λ0·e^{ψ0−ψ} で
// ----      異なることを、描画バッファでなく HP.traceRay の計算値(emitへ渡るWtot)+
// ----      HP.wavelengthColor(色関数そのものを公開・重複実装なし)で検証する ----
{
  const hasWL = await page.evaluate(() => typeof window.HP.wavelengthColor === 'function');
  const hasLensing = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'lensing'));
  if (hasWL && hasLensing) {
    const r = await page.evaluate(() => {
      HP.loadPreset('lensing', false);
      const S = HP.sim, Kt = S.params.Kt;
      const pts = [];
      HP.traceRay(S, -600, -20, 1, 0, 3, 800, (nx, ny, Wtot) => { pts.push(Wtot); return true; });
      const psi = pts.map((w) => w / Kt);
      const psi0 = psi[0];
      let maxIdx = 0;
      for (let i = 1; i < psi.length; i++) if (psi[i] > psi[maxIdx]) maxIdx = i;
      const psiDeep = psi[maxIdx];
      const nm0 = 550 * Math.exp(psi0 - psi0);
      const nmDeep = 550 * Math.exp(psi0 - psiDeep);
      return { steps: psi.length, psi0, psiDeep, nm0, nmDeep,
        col0: HP.wavelengthColor(nm0), colDeep: HP.wavelengthColor(nmDeep) };
    });
    const ok = r.steps > 10 && r.psiDeep > r.psi0 + 1e-6 && Math.abs(r.nm0 - 550) < 1e-9 &&
      r.nmDeep < r.nm0 - 1 && r.col0 !== r.colDeep;
    add('ray.wavelength-color', ok,
      `steps=${r.steps} ψ0=${r.psi0.toFixed(4)} ψ最深=${r.psiDeep.toFixed(4)} ` +
      `λ0=${r.nm0.toFixed(1)}nm(${r.col0}) λ最深=${r.nmDeep.toFixed(1)}nm(${r.colDeep})` +
      `(λ0>λ最深=青方偏移を期待・色も相違)`);
  } else {
    console.log('SKIP ray.wavelength-color(対象に wavelengthColor 公開 or 💡lensing なし — 第36便 B3 未適用の root 等)');
  }
}

// ---- 7z3) 第36便 Wave B(B4・原仮定者指示): ai.help-collapsed — インポート/キーの保存/
// ----      ベースのサンプルの説明が <details> として存在し既定closedであること、
// ----      openにすると本文(note段落)が可視化されることを確認する(対象に無ければ SKIP)----
{
  const hasDetails = await page.evaluate(() =>
    !!document.querySelector('#ioDetails') && !!document.querySelector('#aiKeyDetails') &&
    !!document.querySelector('#aiBaseDetails'));
  if (hasDetails) {
    const r = await page.evaluate(() => {
      const specs = [
        ['saves', 'ioDetails', 'ioNote'],
        ['ai', 'aiKeyDetails', 'aiKeyNote'],
        ['ai', 'aiBaseDetails', 'aiBaseNote'],
      ];
      const out = {};
      for (const [tab, dId, pId] of specs) {
        // タブボタンは「同じタブを再クリックするとパネルごと閉じる」トグル仕様(4111行付近)なので、
        // 既に対象タブが開いていれば再クリックしない(aiKeyDetails→aiBaseDetailsは連続で"ai"タブ)
        const btn = document.querySelector(`#tabs button[data-tab=${tab}]`);
        if (!btn.classList.contains('on')) btn.click();
        const d = document.getElementById(dId), p = document.getElementById(pId);
        const closedByDefault = d.open === false;
        // Chromiumの<details>の非表示化は content-visibility 相当の内部機構で、レイアウト上の
        // offsetParent/getBoundingClientRect は非nullのまま残る(高さも0にならない)ため判定に使えない
        // (実機確認済み)。実際の可視/不可視は checkVisibility() で判定する(Chrome 105+で利用可)
        const hiddenWhenClosed = !p.checkVisibility();
        d.open = true;
        const visibleWhenOpen = p.checkVisibility();
        d.open = false;   // 既定closedへ戻す(以降の項目・実際の初期UXへ影響させない)
        out[dId] = { closedByDefault, hiddenWhenClosed, visibleWhenOpen };
      }
      document.querySelector('#btnPanelClose').click();   // パネルを閉じ直す(ui.aitab-no-hscrollと同方式)
      return out;
    });
    const bad = Object.entries(r).filter(([, v]) => !(v.closedByDefault && v.hiddenWhenClosed && v.visibleWhenOpen)).map(([k]) => k);
    add('ai.help-collapsed', bad.length === 0,
      Object.entries(r).map(([k, v]) => `${k}:closed=${v.closedByDefault}/hidden=${v.hiddenWhenClosed}/visibleOnOpen=${v.visibleWhenOpen}`).join(' '));
  } else {
    console.log('SKIP ai.help-collapsed(対象に ioDetails/aiKeyDetails/aiBaseDetails なし — 第36便 B4 未適用の root 等)');
  }
}

// ---- 7z4) 第36便 Wave C(C1/C2・原仮定者指示): 「粒子半径スケール」既定1(旧値は body.rMul へ
// ----      焼き込み)と「掻出」の自動算出モード lightSweep:"auto"(beta 先行 — ルート対象時はスキップ)----
{
  const hasWaveC = await page.evaluate(() => !!(HP.sim && HP.sim.rMulv && HP.sim.lSwAuto));
  if (hasWaveC) {
    // ① radius.default-one: 内蔵プリセット全件の physics.radiusScale が 1
    //    (原仮定者指示「デフォルトを1とする。現状1でないサンプルは全粒子に反映した上で1にする」の機械固定)
    //    走査はソース上の BUILTIN_PRESETS 定義に対して行う(builtin.explicit-physics と同方式 —
    //    実行時 allPresets() はインポート済みカスタムを含み得るので混入しない静的走査を使う)。
    //    併せて DEFAULT_PHYSICS.radiusScale===1 とスライダー定義域も確認する
    {
      const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
      const block = html.match(/const BUILTIN_PRESETS = \[([\s\S]*?)\n\];/)[1];
      const vals = [...block.matchAll(/radiusScale:\s*([\d.]+)/g)].map(x => x[1]);
      const bad = vals.filter(v => Number(v) !== 1);
      const dp = (html.match(/const DEFAULT_PHYSICS = \{[\s\S]*?radiusScale:\s*([\d.]+)/) || [])[1];
      const rt = await page.evaluate(() => {
        // rMul 焼き込み済みの内蔵は「全 body に rMul あり or radiusScale が元から1」のはず
        const bs = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'));
        return bs.filter(p => (p.physics || {}).radiusScale !== 1).map(p => `${p.id}=${(p.physics || {}).radiusScale}`);
      });
      add('radius.default-one', bad.length === 0 && vals.length > 0 && Number(dp) === 1 && rt.length === 0,
        `内蔵${vals.length}件の physics.radiusScale: 非1=${bad.length ? bad.join(',') : 'なし'} / ` +
        `DEFAULT_PHYSICS.radiusScale=${dp}(=1) 実行時非1=${rt.length ? rt.join(',') : 'なし'}`);
    }

    // ② rmul.schema: body.rMul(全 body 型で省略可・既定1・clamp[0.2,5])の受理と半径式
    //    R = radiusScale·rMul·√|m|(明示 radius があれば radius 優先。rMul は body.radius の
    //    0.5 下限を経由しない内部計算なので、微小粒子の R<0.5 が従来どおり出せる)
    const rm = await page.evaluate(() => {
      const mk = (bodies, phys) => ({ id: 'qa_rmul', name: 'r', description: 'd', camera: { scale: 300 },
        world: { boundary: 'none', size: 0 },
        physics: Object.assign({ G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05,
          Kt: 60, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 }, phys || {}), bodies, overlays: {} });
      // clamp: 4 型すべてで [0.2,5] に丸められ、丸めたときは警告が出る
      const v = HP.validatePreset(mk([
        { type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false, rMul: 9 },
        { type: 'ring', n: 4, cx: 0, cy: 0, rIn: 50, rOut: 50, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0, direction: 1, pinned: false, rMul: 0.01 },
        { type: 'disk', n: 4, cx: 0, cy: 0, radius: 40, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, vScale: 0, direction: 1, rMul: 3 },
        { type: 'box', n: 4, cx: 0, cy: 0, w: 40, h: 40, mMin: 1, mMax: 1, spinMin: 0, spinMax: 0, vScale: 0, rMul: 2 },
      ]));
      const clamps = v.ok ? v.preset.bodies.map(b => b.rMul) : null;
      // 省略時は既定1(キーごと出力されない=旧スキーマと同一形)
      const vDef = HP.validatePreset(mk([{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }]));
      const omitted = vDef.ok && !('rMul' in vDef.preset.bodies[0]);
      const s = HP.sim;
      // 半径式 R = radiusScale·rMul·√|m| と、明示 radius 優先
      s.build(mk([{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, rMul: 2 },
        { type: 'single', m: 100, x: 200, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, rMul: 2, radius: 7 }]));
      const rFormula = s.R[0], rExplicit = s.R[1];
      // radiusScale スライダーは「相対ノブ」として存続(1 が基準になるだけ)
      s.params.radiusScale = 2; s.updateRadii();
      const knob = s.R[0];
      s.params.radiusScale = 1; s.updateRadii();
      // 微小粒子: body.radius の 0.5 下限を経由しない
      s.build(mk([{ type: 'single', m: 0.04, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true, rMul: 0.5 }]));
      const tiny = s.R[0];
      return { ok: v.ok, clamps, warns: v.warnings.length, omitted, rFormula, rExplicit, knob, tiny };
    });
    const rmOk = rm.ok && JSON.stringify(rm.clamps) === JSON.stringify([5, 0.2, 3, 2]) && rm.warns === 2 &&
      rm.omitted && Math.abs(rm.rFormula - 20) < 1e-5 && Math.abs(rm.rExplicit - 7) < 1e-5 &&
      Math.abs(rm.knob - 40) < 1e-5 && Math.abs(rm.tiny - 0.1) < 1e-5;
    add('rmul.schema', rmOk,
      `clamp=${JSON.stringify(rm.clamps)}(=[5,0.2,3,2]) 警告${rm.warns}件 省略時キーなし=${rm.omitted} ` +
      `R(rMul2,m100)=${rm.rFormula}(=20) radius優先=${rm.rExplicit}(=7) rs2倍=${rm.knob}(=40) 微小R=${rm.tiny.toFixed(4)}(=0.1・下限0.5を経由しない)`);

    // ③ sweep.auto-monotonic: 同一質量・半径で s=0/0.5/1/2 → lS_eff が単調増加し s=0 で 0
    //    実測(2026-07-27・m=100/radius=20/Kt=60/c₀=60/D₀=2):
    //      s=0 → 0 / s=0.5 → 0.210293 / s=1 → 0.420586 / s=2 → 0.841172
    const mono = await page.evaluate(() => [0, 0.5, 1, 2].map(sp => {
      const s = HP.sim;
      s.build({ id: 'qa_sweep', name: 's', description: 'd', camera: { scale: 300 },
        world: { boundary: 'none', size: 0 },
        physics: { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 60,
          cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 },
        bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: sp, pinned: true, radius: 20, lightSweep: 'auto' }],
        overlays: {} });
      s.step(0.016);
      return { spin: sp, lS: s.lSwEff(0), auto: s.lSwAuto[0] };
    }));
    const monoOk = mono.every(m => m.auto === 1) && mono[0].lS === 0 &&
      mono[1].lS > 0 && mono[2].lS > mono[1].lS && mono[3].lS > mono[2].lS;
    add('sweep.auto-monotonic', monoOk,
      mono.map(m => `s=${m.spin}→lS_eff=${m.lS.toFixed(6)}`).join(' ') + '(s=0で0・単調増加)');

    // ④ sweep.auto-physlock: 物理対応ロック(Kt=cLight²/G=3600・cLight=60)+ 恒星的パラメータ
    //    = 表面速度/光速が実在天体と同じ比(土星 v_eq=9.87km/s ÷ c=299792km/s = 3.29e-5)なら
    //    lS_eff < 0.01。auto は「現実の自転では暗くならない」— 第19便 反証条件7と整合する
    //    誠実性の機械固定(この式でダークマター的な暗さがタダで手に入らないことの保証)。
    //    実測(2026-07-27・m=1500/radius=70): 土星比 3.333e-5 / 太陽比(6.7e-6)6.788e-6。
    //    参考: 同天体でも展示用の誇張スピン 0.05 では 0.0591、1.2 では 1(飽和)になる。
    const lock = await page.evaluate(() => {
      const run = (spin) => {
        const s = HP.sim;
        s.build({ id: 'qa_lock', name: 'l', description: 'd', camera: { scale: 300 },
          world: { boundary: 'none', size: 0 },
          physics: { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 3600,
            cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
            pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 },
          bodies: [{ type: 'single', m: 1500, x: 0, y: 0, vx: 0, vy: 0, spin, pinned: true, radius: 70, lightSweep: 'auto' }],
          overlays: {} });
        s.step(0.016);
        return { lS: s.lSwEff(0), lock: HP.physLockSatisfied(s) };
      };
      return { saturn: run(60 * 3.29e-5 / 70), sun: run(60 * 6.7e-6 / 70), toy: run(0.05) };
    });
    add('sweep.auto-physlock', lock.saturn.lock && lock.saturn.lS < 0.01 && lock.sun.lS < 0.01,
      `ロック成立=${lock.saturn.lock} 土星の実自転比 lS_eff=${lock.saturn.lS.toExponential(3)}(<0.01) ` +
      `太陽比=${lock.sun.lS.toExponential(3)} 参考: 展示用スピン0.05では ${lock.toy.lS.toFixed(4)}`);

    // ⑤ sweep.numeric-unchanged: 数値指定(既存プリセット)の掻出は bit 一致で不変。
    //    🕶️darkrotor(全 single が lightSweep:1)を 300 步走らせた x,y,spin ハッシュを、
    //    Wave C 実装前の beta/index.html(第36便 36B 時点)で採取した基準と照合する。
    const dr = await page.evaluate(() => {
      HP.loadPreset('darkrotor', false);
      const s = HP.sim;
      const lS0 = [s.lSw[0], s.lSw[1]], auto = s.hasLSwAuto;
      for (let k = 0; k < 300; k++) s.step(0.016);
      const a = [];
      for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.spin[i]);
      return { n: s.n, lS0, auto, lS1: [s.lSw[0], s.lSw[1]], str: a.map(v => v.toExponential(12)).join(',') };
    });
    const drHash = crypto.createHash('sha256').update(dr.str).digest('hex');
    const DR_BASE = '4dee00d8f2db22aadddcc8dd3186f2fd8b6048100caef1694ee7cd1167609379';
    add('sweep.numeric-unchanged',
      dr.n === 391 && drHash === DR_BASE && dr.auto === false &&
      dr.lS0[0] === 1 && dr.lS0[1] === 1 && dr.lS1[0] === 1 && dr.lS1[1] === 1,
      `🕶️darkrotor 300步 x,y,spinハッシュ=${drHash.slice(0, 16)}…(基準=${DR_BASE.slice(0, 16)}… bit一致=${drHash === DR_BASE}) ` +
      `auto経路=${dr.auto}(false=ゼロコスト) lightSweep=${dr.lS1.join(',')}(不変)`);

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP radius.default-one/rmul.schema/sweep.auto-*/sweep.numeric-unchanged(対象に Wave C 未適用 — root 等)');
  }
}

add('page.no-errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
// W5c: ワーカープールの後片付け(全ユニットは既に上流の getUnit() で待ち合わせ済みのはずだが、
// 各ワーカーの wp.close() 完了を確実に待ってから共有 browser を閉じる)
if (w5cPoolPromise) await w5cPoolPromise;
await browser.close();

// ---- 結果JSON(コミット固定の再現記録)----
let commit = 'unknown';
try { commit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch {}
const pass = results.every(r => r.pass);
// v1.27(公開前レビュー P0-5): 実行環境のメタデータを結果JSONへ必須記録
let playwrightVersion = 'unknown';
try { playwrightVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/playwright/package.json'), 'utf8')).version; } catch {}
// 第28便(第24次レビュー P0-3): 実際に試験した HTML の SHA-256・APP_VERSION・SW キャッシュ名を証跡として記録
const targetBytes = fs.readFileSync(path.join(ROOT, TARGET));
const targetSha256 = crypto.createHash('sha256').update(targetBytes).digest('hex');
const appVersion = (targetBytes.toString('utf8').match(/const APP_VERSION = "([^"]+)"/) || [])[1] || 'unknown';
let swCache = 'unknown';
try { swCache = (fs.readFileSync(path.join(ROOT, TARGET.startsWith('beta/') ? 'beta/sw.js' : 'sw.js'), 'utf8')
  .match(/CACHE = CACHE_PREFIX \+ "([^"]+)"/) || [])[1] || 'unknown'; } catch {}
fs.writeFileSync(path.join(OUT_DIR, 'qa-results.json'), JSON.stringify({
  commit, date: new Date().toISOString(), fast: FAST,
  target: TARGET,  // P2: 検査対象(beta 検証時に結果JSONを取り違えないため)
  targetSha256, appVersion, swCache,  // 第28便: 試験対象の実体を SHA で追跡(第24次レビュー P0-3)
  // 第13次裁定 P2-2 後半+第14次 P2-2(2026-07-23): CI run の追跡メタ(ローカル実行時は null)。
  // PR 実行では commit が合成マージ SHA になるため、ref/headRef/baseRef で照合できるようにする
  run: { githubRunId: process.env.GITHUB_RUN_ID || null, runNumber: process.env.GITHUB_RUN_NUMBER || null,
         attempt: process.env.GITHUB_RUN_ATTEMPT || null, sha: process.env.GITHUB_SHA || null,
         ref: process.env.GITHUB_REF || null, headRef: process.env.GITHUB_HEAD_REF || null,
         baseRef: process.env.GITHUB_BASE_REF || null },
  env: { node: process.version, playwright: playwrightVersion, platform: `${process.platform}/${process.arch}` },
  total: results.length, failed: results.filter(r => !r.pass).length, pass,
  durationMs: results.reduce((a, r) => a + (r.ms || 0), 0),  // 第17便: 項目別 ms の合計
  results,
}, null, 1));
console.log(`\n${pass ? 'ALL PASS' : 'FAILED'} (${results.filter(r => r.pass).length}/${results.length}) → tests/out/qa-results.json`);
process.exit(pass ? 0 : 1);

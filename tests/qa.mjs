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

// ---- 0b3) 第52便(ChatGPT R-02 提案): release.no-beta-identifiers — ルート対象時、
// ----      リリース識別子の残存・取り違えを一括機械検査する。
// ----      ①package.json = APP_VERSION+".0" の厳密一致(0b の前方一致より強い)
// ----      ②CHANGELOG に「## v{APP_VERSION}.0(」のリリース見出しがあり、同版に
// ----        「未リリース草案」の見出しが残っていない
// ----      ③タイトル下のバージョン表示(#appVer)が "v"+APP_VERSION で、"-b" を含まない
// ----        (file:// では isBetaServe() が偽 = ルート配信と同じ表示経路)
// ----      beta 対象は対象外(開発線は草案・-b 表示が正)----
if (!TARGET.startsWith('beta/')) {
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const av = (html.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const chg = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const hasRelHead = chg.includes(`## v${av}.0(`);
  const hasDraftHead = new RegExp(`## v${av}(?!\\.0)[^\\n]*未リリース草案`).test(chg);
  await page.waitForFunction(() => window.HP && document.querySelector('#appVer'));
  const domVer = await page.evaluate(() => {
    const el = document.querySelector('#appVer');
    return el ? el.textContent.trim() : null;
  });
  add('release.no-beta-identifiers',
    pkg.version === av + '.0' && hasRelHead && !hasDraftHead
    && domVer === 'v' + av && !String(domVer).includes('-b'),
    `package.json=${pkg.version}(=${av}.0) CHANGELOG リリース見出し=${hasRelHead} 草案見出し残存=${hasDraftHead} ` +
    `表示=${domVer}(="v${av}"・-b なし)`);
}

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
// 第40便 40A(台帳4-81): E6′ 反作用③を倍精度アキュムレータ化したビルドかどうかの機能判定子。
// beta 先行(v1.34-b1)で、root=v1.33 リリース版はまだ Float32 直接書き込みのまま。
// 数値経路が意図的に変わったので、bit 基準を持つテスト(integrator.default-unchanged /
// sweep.numeric-unchanged / tint.zero-cost)は対象ごとに基準を選ぶ必要がある。
// 判定は「③の集積先 accVx が sim 状態に存在するか」— hasTint / echoFlipAt と同じ方式
const hasE6Acc = await page.evaluate(() => 'accVx' in HP.sim);
// 第40便 40C(台帳4-82): 🪐/🎯 の環粒子を 300→240(総粒子 301→241)へ削減したビルドかの判定子。
// beta 先行(v1.34-b1)で、root=v1.33 は 301 のまま。初期配置そのものが変わる = kFrame や
// 積分器と無関係に軌道が bit 一致しえないので、bit 基準を持つテスト(integrator.default-unchanged /
// tint.zero-cost の 🪐 行)と粒子数を数える検査(core.twolayer)は対象ごとに値を選ぶ。
// 判定はプリセット定義の実体(ring.n の総和)から直接数える — 実行時状態に依存しない
const satTotN = await page.evaluate(() => {
  const p = HP.allPresets().find(q => q.id === 'saturn');
  return p ? p.bodies.reduce((a, b) => a + (b.type === 'ring' ? (b.n || 0) : 1), 0) : 0;
});
const hasSat240 = satTotN === 241;

const w5cHasCoreEng = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.coreMd));
const w5cHasIce = await page.evaluate(() =>
  !!(window.HP && HP.allPresets().some(p => p.id === 'saturn' && /実験/.test(p.name || ''))));
// 第85便(休眠QAの復旧・原仮定者指示「既存QAの門の再開: 進める」): 観測層の判定子を現行 API へ置換。
// 旧: `!!(HP.sim && HP.sim.obsT)` — obsT(観測温度係数)は**第61便で廃止された**配列なので
// 以後この門は root/beta とも恒常 false になり、🕶️ の既存 QA 区画(下の
// darkrotorMidNew/darkrotorMidOld/darkrotorLong ユニットと、後段の behavior.darkrotor /
// behavior.darkrotorLong / behavior.darkrotor-pitch / darkrotor.uphi / darkrotor.allfree)が
// **フル QA でも一度も実行されない休眠状態**になっていた(第84便B の発見)。
// 新: 観測層の現行の実体は「観測温度の公開フック HP.obsTemp(第36便 D で公開)+ 光掻き出し配列 lSw」。
//   obsT は「全プリセット未使用で恒等1だった係数」として消えただけで、観測温度そのものは残っている:
//     旧 T_obs = ½·m·R²·spin²·obsT[i]·(1−lSw[i])         (qa.mjs 1357-1358行の旧式フォールバック)
//     現 T_obs = HP.obsTemp(s,i) = (Tint ? Tint[i] : ½·m·R²·spin²)·(1−lSw[i])
//   obsT≡1 だったので**値としても等価**(app 側コメント「第61便: obsT 係数は廃止(恒等1だった)」)。
//   よって「観測温度系を持つビルドか」という判定子の意味は obsTemp+lSw で完全に置き換わる。
const w5cHasObsLayer = await page.evaluate(() =>
  !!(window.HP && typeof HP.obsTemp === 'function' && HP.sim && HP.sim.lSw));
const w5cHasV26 = await page.evaluate(() => !!document.querySelector('#aiBasePreset'));
// 第84便B: w5cDrFree の判定は **観測層の門から独立**させた(判定内容は従来と一字も同じ)。
// 第85便で門が生き返ったので独立のままでも有効/無効は一致する(darkrotorMultiseed は
// 第84便B 時点から観測層に依存せず動いていた)。
const w5cDrFree = await page.evaluate(() =>
  HP.allPresets().find(q => q.id === 'darkrotor').bodies.every(b => !b.pinned && !b.railOmega && !b.railH));
// 第84便B(創発の標準試験の展開): 🕶️darkrotor に多seed claim が入っているか
// (未適用の root 等では重い多seedユニットを起動しない)
const w5cDrMulti = await page.evaluate(() => {
  const p = HP.allPresets().find(q => q.id === 'darkrotor');
  return !!(p && Array.isArray(p.claims)
    && p.claims.some(c => c.id === 'darkrotor.multi-seed-min-arm-ratio'));
});

// 第37便 Wave D: 新サンプルの有無(beta 先行 — root には無い)。後段の各セクションのガード式と同一
const w5cHasAgnjet = await page.evaluate(() => HP.allPresets().some(p => p.id === 'agnjet'));
const w5cHasCosmicweb = await page.evaluate(() => HP.allPresets().some(p => p.id === 'cosmicweb'));
// 第39便 39A(台帳4-74): 🌪️spinup(収縮とスピン加速)の有無(beta 先行 — root には無い)
const w5cHasSpinup = await page.evaluate(() => HP.allPresets().some(p => p.id === 'spinup'));
// 第46便 46S(台帳4-68c 再挑戦): ☀️starcore(恒星の内部 — 融合を熱源とする)の有無(beta 先行 — root には無い)
const hasStarcore = await page.evaluate(() => HP.allPresets().some(p => p.id === 'starcore'));

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
  // 第36便 D(台帳4-51)再較正: 24000步 → 8000步 / 第37便 C1(台帳4-70)再々較正: 8000步 → 24000步
  // (伝熱する箱への再設計で長時間の定常対流が成立したため、第36便で撤退した 24000步 窓へ復帰)。
  // 定常性は「壁が入れた熱 ≈ 壁が回収した熱+壁が吸った運動E」で機械判定する(最後の3000步窓)
  convection24000: { enabled: !FAST, weight: 66, run: (pg) => pg.evaluate(() => {
    const s = HP.sim;
    HP.loadPreset('convection', false);
    for (let k = 0; k < 21000; k++) s.step(0.016);
    const w0 = [s.wallEin, s.wallEout, s.wallKE];
    for (let k = 0; k < 3000; k++) s.step(0.016);
    let circ = 0, sumV = 0, freeC = 0;
    for (let i = 0; i < s.n; i++) {
      if (s.pinned[i]) continue;
      circ += s.x[i] * s.vy[i] - s.y[i] * s.vx[i];
      sumV += Math.hypot(s.vx[i], s.vy[i]); freeC++;
    }
    const qIn = s.wallEin - w0[0], qOut = (s.wallEout - w0[1]) + (s.wallKE - w0[2]);
    return { convCirc: freeC ? circ / freeC : 0, convV: freeC ? sumV / freeC : 0, convNaN: s.hasNaN(),
      convQIn: qIn, convQOut: qOut, convImb: qIn > 0 ? Math.abs(qIn - qOut) / qIn : 1,
      convPin: s.n - freeC, convWall: !!s.twall };
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
    // 🎯 主星2層コアのエンジン検証の走行部分。第81便でコアv1(比率仕様 coreMR/coreSR/coreRR)を
    // 廃止したので、対象が **コアv2 の 🎯**(=beta)なら coreMd/coreMF/RcV/coreJ を、
    // **コアv1 の 🎯**(=root 等の旧ビルド)なら従来どおり coreMR/coreSR を叩いて同じ性質を測る:
    //   ①差動を持たないコア(v2 rigid / v1 sc/s=1)は単層と bit 等価
    //   ②Ω_c=s(v2)/ sc/s=1 相当(v1)も差動0で bit 等価
    //   ③コア静止(Ω_c=0 / sc/s=0)・高速コア(Ω_c=20s / sc/s=20)は差が出る
    //   ④空洞(v2 cavity / v1 coreMR<0)でも NaN が出ない
    const out = {};
    HP.loadPreset('saturnLayered', false);
    let s = HP.sim;
    const V2 = !!(s.coreMd && s.coreMd[0]);   // 🎯 がコアv2 かどうか(第81便以降=true)
    out.v2 = V2;
    if (V2) {
      const cs = HP.coreState(0);
      out.preset = { n: s.n, md: s.coreMd[0], massFrac: +s.coreMF[0].toFixed(4),
        omega: +cs.omega.toFixed(6), R0: s.R[0], Rc0: s.RcV[0], hasCoreV2: s.hasCoreV2 };
    } else {
      out.preset = { n: s.n, md: 0, massFrac: +s.coreMR[0].toFixed(4),
        omega: +(s.coreSR[0] * s.spin[0]).toFixed(6), R0: s.R[0], Rc0: s.Rc[0], hasCoreV2: s.hasCore };
    }
    // コア注入ヘルパ。kind: 'rigid' | 'diff'(Ω_c 指定) | 'cavity'
    const setCore = (S, i, kind, mf, rc, om) => {
      if (V2) {
        S.coreMd[i] = (kind === 'rigid') ? 1 : ((kind === 'cavity') ? 4 : 2);
        S.coreMF[i] = (kind === 'cavity') ? -mf : mf; S.RcV[i] = rc;
        // J は**配列へ格納された Float32 の値から**組む(I_c=½·coreMF·|mEff|·RcV² と同式)。
        // こうすると Ω_c=J/I_c が指定値へ厳密に戻り「Ω_c=s ⇒ 差動0 ⇒ 単層と bit 等価」が成立する
        const Ic = 0.5 * S.coreMF[i] * Math.abs(S.mEff[i]) * S.RcV[i] * S.RcV[i];
        S.coreJ[i] = (kind === 'cavity') ? 0 : Ic * om;
        if (S.coreOm0) S.coreOm0[i] = (kind === 'cavity') ? om : 0;
        S.coreKcs[i] = 0; S.corePump[i] = 0; S.coreCtr[i] = 0;
        if (S.coreSrc) S.coreSrc[i] = 0;
        if (S.coreEint) S.coreEint[i] = 0;
        S.hasCoreV2 = true;
      } else {
        // コアv1(旧ビルド): Rc は coreMR から自動算出されるので mf だけ合わせ、比率で Ω を作る
        S.coreMR[i] = (kind === 'cavity') ? -mf : mf;
        S.coreSR[i] = (kind === 'rigid') ? 1 : (S.spin[i] !== 0 ? om / S.spin[i] : 1);
        S.updateRadii();
      }
    };
    HP.loadPreset('saturn', false); s = HP.sim;
    const noCore = V2 ? s.hasCoreV2 : s.hasCore;   // 🪐 はコアなし(=false)であることの確認
    for (let k = 0; k < 600; k++) s.step(0.016);
    const base = [s.x[10], s.y[10], s.spin[10]];
    const d3 = () => Math.abs(s.x[10] - base[0]) + Math.abs(s.y[10] - base[1]) + Math.abs(s.spin[10] - base[2]);
    const d2 = () => Math.abs(s.x[10] - base[0]) + Math.abs(s.y[10] - base[1]);
    // ① 差動なしのコア(v2 rigid / v1 sc/s=1)= 単層と bit 等価
    HP.loadPreset('saturn', false); s = HP.sim;
    setCore(s, 0, 'rigid', 0.6, 0.6 * s.R[0], s.spin[0]);
    const m0 = s.m[0], hcRigid = V2 ? s.hasCoreV2 : s.hasCore;
    for (let k = 0; k < 600; k++) s.step(0.016);
    const eqRigid = d3();
    // ② differential でも Ω_c=s(差動0)は bit 等価
    HP.loadPreset('saturn', false); s = HP.sim;
    setCore(s, 0, 'diff', 0.6, 0.6 * s.R[0], s.spin[0]);
    for (let k = 0; k < 600; k++) s.step(0.016);
    const eqZero = d2();
    // ③ コア静止(Ω_c=0)は引きずり低下で差が出る
    HP.loadPreset('saturn', false); s = HP.sim;
    setCore(s, 0, 'diff', 0.6, 0.6 * s.R[0], 0);
    for (let k = 0; k < 600; k++) s.step(0.016);
    const restDx = d2();
    // ④ 高速コア(Ω_c=20·s)
    HP.loadPreset('saturn', false); s = HP.sim;
    setCore(s, 0, 'diff', 0.6, 0.6 * s.R[0], 20 * s.spin[0]);
    for (let k = 0; k < 600; k++) s.step(0.016);
    const effDx = Math.abs(s.x[10] - base[0]), effNan = s.hasNaN();
    // ⑤ 空洞(v2 cavity / v1 coreMR<0 — 引きずり重みが負)
    HP.loadPreset('saturn', false); s = HP.sim;
    setCore(s, 0, 'cavity', 0.6, 0.6 * s.R[0], 20 * s.spin[0]);
    for (let k = 0; k < 600; k++) s.step(0.016);
    const holNan = s.hasNaN();
    const holDx = Math.abs(s.x[10] - base[0]);
    HP.loadPreset('saturn', false); s = HP.sim;
    s.m[5] = -1; s.updateRadii();
    const negR = s.R[5];
    for (let k = 0; k < 400; k++) s.step(0.016);
    const negNan = s.hasNaN();
    HP.loadPreset('saturn', false);
    return { ...out, m0, noCore, hcRigid, eqRigid, restDx, eqZero, effDx, effNan, holDx, holNan, negR, negNan };
  }) },
  saturnLayered: { enabled: w5cHasCoreEng && !FAST, weight: 152, run: (pg) => pg.evaluate(() => {
    // 🎯 既定値の長時間安定+差動効果の有界性(元「第12〜14便」節 2466-2490行から抽出)
    // 第40便 40C(台帳4-82): 環帯の粒子数が 75/150/75 → 60/120/60 へ変わったため、C/B/A の
    // index 境界を**プリセット定義の ring.n から機械的に**算出する(以後の粒子数変更でも自動追従。
    // 帯の意味〔内=C・中=B・外=A〕と med の取り方は不変)。旧: med(1,75)/med(76,225)/med(226,300)
    const RN = HP.allPresets().find(q => q.id === 'saturnLayered')
      .bodies.filter(b => b.type === 'ring').map(b => b.n);
    const i1 = RN[0], i2 = RN[0] + RN[1], i3 = RN[0] + RN[1] + RN[2];
    const run = (rigidSc, steps) => {
      HP.loadPreset('saturnLayered', false);
      const s = HP.sim;
      // 第81便: 剛体回転(差動0)対照 — コアv2 なら coreMd=1(rigid)、旧ビルドなら sc/s=1
      if (rigidSc) { if (s.coreMd && s.coreMd[0]) s.coreMd[0] = 1; else s.coreSR[0] = 1; }
      const med = (lo, hi) => { const rs = []; for (let i = lo; i <= hi; i++) rs.push(Math.hypot(s.x[i], s.y[i])); rs.sort((a, b) => a - b); return rs[Math.floor(0.5 * (rs.length - 1))]; };
      const metric = () => {
        let inB = 0, fall = 0, esc = 0, sum = 0;
        for (let i = 1; i < s.n; i++) { const r = Math.hypot(s.x[i], s.y[i]);
          if (r >= 90 && r <= 290) inB++; if (r < 85) fall++; if (r > 320) esc++;
          sum += Math.abs(s.spin[i]); }
        return { inB: inB / (s.n - 1), fall: fall / (s.n - 1), esc: esc / (s.n - 1),
          mean: sum / (s.n - 1), C: med(1, i1), B: med(i1 + 1, i2), A: med(i2 + 1, i3), nan: s.hasNaN() };
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
    return { d150: def[0], d360: def[1], z150: noc[0], ringN: RN, nTot: i3 + 1 };
  }) },
  // ==== 第40便 40C(台帳4-79 — 因果QAバッテリー第2弾。ChatGPT精査 P2-4/5/7/8)====================
  // 共通方針: 同一 seed(=同一初期配置)で **ノブを1個だけ** 変えた2〜3本を走らせ、
  // 「説明文が主張している因果」がその差として実際に現れるかを機械判定する。判定閾値は
  // すべて 4-82 適用後(環240粒)の実測値を分母にした余裕係数つきで、各 add() のコメントに根拠を書く。
  // 実測が主張を支持しない場合は **主張の側を弱め、測れた事実の方を固定する**(誠実性優先の裁定)。
  //
  // P2-4: 🪐 の kFrame 対照。説明文は当初「環は空間引きずりによる近点移動で形を保つ」だったが、
  // 実測はその逆で、引きずりは環を内側へ寄せ離心率をむしろ上げる(kFrame=0 でも環は保たれる)。
  // よって本テストは「引きずりが環を安定させる」ではなく「kFrame が環の形を有意に変える(因果がある)」
  // ことと、その **向き**(内向き移動+離心率増大)を固定する。説明文は 40C で実測に合わせて弱めた。
  saturnKFrame: { enabled: !FAST && w5cHasIce && hasSat240, weight: 16, run: (pg) => pg.evaluate(() => {
    const STEPS = 3000;   // t=48。2本で実測 15s(1本あたり 3000×2.6ms)
    const stat = (s) => {
      const mu = s.params.G * s.m[0];      // 中心星は pinned・原点なので μ=G·M で LRL ベクトルが取れる
      let se = 0, sv = 0, inB = 0, n = 0;
      const rs = [];
      for (let i = 1; i < s.n; i++) {
        const x = s.x[i], y = s.y[i], vx = s.vx[i], vy = s.vy[i], r = Math.hypot(x, y);
        rs.push(r); if (r >= 90 && r <= 290) inB++;
        const Lz = x * vy - y * vx;                       // 離心率ベクトル e = (v×L)/μ − r̂
        const ex = (vy * Lz) / mu - x / r, ey = (-vx * Lz) / mu - y / r;
        se += ex * ex + ey * ey;
        const vr = (x * vx + y * vy) / r; sv += vr * vr;
        n++;
      }
      rs.sort((a, b) => a - b);
      return { eRMS: Math.sqrt(se / n), vrRMS: Math.sqrt(sv / n), inB: inB / n,
        p50: rs[Math.floor(0.5 * (rs.length - 1))], nan: s.hasNaN() };
    };
    const run = (kf) => {
      HP.loadPreset('saturn', false);
      const s = HP.sim; s.params.kFrame = kf;
      for (let k = 0; k < STEPS; k++) s.step(0.016);
      return stat(s);
    };
    const on = run(1), off = run(0);
    HP.loadPreset('saturn', false);
    return { steps: STEPS, on, off };
  }) },
  // P2-5: 🪐 の muF 対照。説明文は当初「muF=0 にすると円形化が止まる」だったが、実測では
  // 氷粒の半径が R=rMul·√m≈0.25 と小さく **接触自体がほとんど起きない** ため、muF は
  // この時間窓でほぼ効かない(4500步までは倍精度で完全一致 = 接触ゼロ)。本テストは
  // 「muF は環に届いてはいる(=差はゼロではない)が、その効きは小さい」を両側から固定する。
  saturnMuF: { enabled: !FAST && w5cHasIce && hasSat240, weight: 32, run: (pg) => pg.evaluate(() => {
    const STEPS = 6000;   // 最初の接触が起きるのが 4500〜6000步(4500步では2本が完全一致)
    const stat = (s) => {
      const mu = s.params.G * s.m[0];
      let se = 0, sv = 0, sp = 0, n = 0, contacts = 0;
      for (let i = 1; i < s.n; i++) {
        const x = s.x[i], y = s.y[i], vx = s.vx[i], vy = s.vy[i], r = Math.hypot(x, y);
        const Lz = x * vy - y * vx;
        const ex = (vy * Lz) / mu - x / r, ey = (-vx * Lz) / mu - y / r;
        se += ex * ex + ey * ey;
        const vr = (x * vx + y * vy) / r; sv += vr * vr;
        sp += Math.abs(s.spin[i]); n++;
      }
      for (let i = 1; i < s.n; i++) for (let j = i + 1; j < s.n; j++)
        if (Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]) < s.R[i] + s.R[j]) contacts++;
      return { eRMS: Math.sqrt(se / n), vrRMS: Math.sqrt(sv / n), meanSpin: sp / n,
        contacts, nan: s.hasNaN() };
    };
    const run = (mf) => {
      HP.loadPreset('saturn', false);
      const s = HP.sim; s.params.muF = mf;
      for (let k = 0; k < STEPS; k++) s.step(0.016);
      return stat(s);
    };
    const on = run(0.2), off = run(0);
    const Rr = [];
    for (let i = 1; i < HP.sim.n; i++) Rr.push(HP.sim.R[i]);
    HP.loadPreset('saturn', false);
    return { steps: STEPS, on, off, Rmin: Math.min(...Rr), Rmax: Math.max(...Rr) };
  }) },
  // P2-7: 🌠merger の3点セット(潮汐尾の成長 / kFrame の効き所 / muF の効き)。
  // 実測で分かったこと: 引きずり(kFrame)の効きは **スピン加熱に集中** していて、
  // 核どうしの接近そのものはほとんど変わらない。説明文にその内訳を明記した(40C)。
  mergerCausal: { enabled: !FAST, weight: 34, run: (pg) => pg.evaluate(() => {
    const STEPS = 3000;   // t=48。3本で実測 30s(第50便 50I の円盤 100/80 化で短縮)
    // bodies 配列 [核A, 円盤A, 核B, 円盤B] から index 範囲と初期円盤半径を導出する
    // (第50便 50I: 円盤 n を 150/120→100/80 に変えたため、旧ハードコード 1..150/152..271 を
    // 対象のプリセット定義から取る形に置換 — root(150/120)と beta(100/80)の両方で正しく動く)
    const MP = HP.allPresets().find((q) => q.id === 'merger');
    const dA = MP.bodies[1], dB = MP.bodies[3];
    const NA = 0, A0 = 1, A1 = dA.n, NB = A1 + 1, B0 = NB + 1, B1 = NB + dB.n;
    const rdA = dA.radius, rdB = dB.radius;
    const stat = (s) => {
      // 潮汐尾率 = 自分の核から「初期円盤半径の mult 倍」より外に出た円盤粒子の割合
      const tail = (mult) => { let c = 0, tot = 0;
        for (let i = A0; i <= A1; i++) { tot++; if (Math.hypot(s.x[i] - s.x[NA], s.y[i] - s.y[NA]) > rdA * mult) c++; }
        for (let i = B0; i <= B1; i++) { tot++; if (Math.hypot(s.x[i] - s.x[NB], s.y[i] - s.y[NB]) > rdB * mult) c++; }
        return c / tot; };
      let sp = 0, nd = 0;
      for (let i = 0; i < s.n; i++) { if (i === NA || i === NB) continue; sp += Math.abs(s.spin[i]); nd++; }
      return { sep: Math.hypot(s.x[NA] - s.x[NB], s.y[NA] - s.y[NB]),
        tail15: tail(1.5), tail20: tail(2), meanSpin: sp / nd, nan: s.hasNaN() };
    };
    // 第50便 50I: チェックポイント別の核間距離も記録する — 接近が速くなった新配置では
    // 「引きずりは軌道にほとんど効かない」は**接近期**(核間が初期の0.72倍に達するまで)の
    // 主張であり、深い接触期には軌道差が育つ(実測 3000步で 11.5%)ことが分かったため、
    // 判定は接近期チェックポイントで行う(root の旧配置では 3000步時点がちょうど接近期 =
    // 従来の判定と同じ点になる — 0.72 は root 実測 520→376 の比から)
    const CKS = [500, 1000, 1500, 2000, 2500, 3000];
    const run = (mod) => {
      HP.loadPreset('merger', false);
      const s = HP.sim; if (mod) mod(s);
      const t0 = stat(s);
      const cks = []; let k = 0;
      for (const ck of CKS) {
        for (; k < ck; k++) s.step(0.016);
        cks.push({ ck, sep: Math.hypot(s.x[NA] - s.x[NB], s.y[NA] - s.y[NB]) });
      }
      return { t0, end: stat(s), cks, n: s.n };
    };
    const base = run(null), kf0 = run((s) => { s.params.kFrame = 0; }), muf0 = run((s) => { s.params.muF = 0; });
    HP.loadPreset('saturn', false);
    return { steps: STEPS, base, kf0, muf0 };
  }) },
  // P2-8: 🌫️collapse の etaRad 対照。説明文は当初「放射冷却(E11)による収縮」と書いていたが、
  // 実測では etaRad は **温度だけ** を単調に動かし、半質量半径 r50(=収縮の速さ)は変えない
  // (6000步で r50 差 0.4%・12000步でも 2.1% で符号すら一定しない)。40C で説明文を修正し、
  // 本テストはその **否定的結果そのもの**(冷却は温度に効き、収縮には効かない)を固定する。
  collapseCooling: { enabled: !FAST, weight: 90, run: (pg) => pg.evaluate(() => {
    // 第51便 51F: 6000步→12000步へ延長(beta は G↑/kRep↓ で塊が育つ構成になり、温度対照が
    // 明確に開くのは加熱ピークを過ぎた 12000步 — 実測 T比 on/off = beta 0.545 / root 0.761)。
    // r50 の冷却非依存(負の主張)は従来どおり崩壊中盤 6000步で判定する
    const STEPS = 6000;   // ×2 区間(6000 で中間計測 → 12000 で最終計測)
    const stat = (s) => {
      let M = 0, cx = 0, cy = 0;
      for (let i = 0; i < s.n; i++) { M += s.m[i]; cx += s.m[i] * s.x[i]; cy += s.m[i] * s.y[i]; }
      cx /= M; cy /= M;
      const a = [];
      for (let i = 0; i < s.n; i++) a.push({ r: Math.hypot(s.x[i] - cx, s.y[i] - cy), m: s.m[i] });
      a.sort((p, q) => p.r - q.r);
      let acc = 0, r50 = 0, r90 = 0;
      for (const p of a) { acc += p.m;
        if (!r50 && acc >= 0.5 * M) r50 = p.r;
        if (!r90 && acc >= 0.9 * M) r90 = p.r; }
      let T = 0;
      for (let i = 0; i < s.n; i++) T += s.Tint ? s.Tint[i] : Math.abs(s.spin[i]);
      return { r50, r90, T: T / s.n, nan: s.hasNaN() };
    };
    const run = (eta) => {
      HP.loadPreset('collapse', false);
      const s = HP.sim; s.params.etaRad = eta;
      const t0 = stat(s);
      for (let k = 0; k < STEPS; k++) s.step(0.016);
      const mid = stat(s);   // 6000步(崩壊中盤 — r50 の冷却非依存を見る点)
      for (let k = 0; k < STEPS; k++) s.step(0.016);
      return { t0, mid, end: stat(s) };   // 12000步(加熱ピーク後 — 温度対照が開く点)
    };
    const on = run(0.004), off = run(0);
    HP.loadPreset('saturn', false);
    return { steps: STEPS * 2, on, off };
  }) },
  darkrotorMidNew: { enabled: w5cHasObsLayer && !FAST && w5cDrFree, weight: 26, run: (pg) => pg.evaluate(() => {
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
  darkrotorMidOld: { enabled: w5cHasObsLayer && !FAST && !w5cDrFree, weight: 18, run: (pg) => pg.evaluate(() => {
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
  darkrotorLong: { enabled: w5cHasObsLayer && !FAST && w5cDrFree, weight: 104, run: (pg) => pg.evaluate((BANDS) => {
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
    // 第40便 40C(台帳4-79 P2-9): 渦状腕のピッチ角。tests/exp-4-72.mjs 158-199行の pitchFit を
    // **一字も変えずに移植**した(探索指標として実装済みのものを QA 化)。細環帯 15 刻みで m=2 の
    // 位相 ψ(r)=½·arg(Σe^{2iθ}) を測り、対数螺旋 r ∝ e^{θ·tan i} を仮定して ψ=a+b·ln r の
    // 重み付き最小二乗 → tan i = 1/|b| ⇒ ピッチ角 i = atan(1/|b|)。有意帯(A2 > 2×ノイズ床
    // √(π/4N))だけを使い、4帯未満なら測定不能(ok:false)。dirSign=円盤の回転向き(恒星の ΣL_z の符号)、
    // dirSign·b<0 が後行(trailing)螺旋。**この呼び出しは状態を一切書き換えない**ので、
    // darkrotorLong の走行(500步×12ブロック)にピッチの計測を相乗りさせても軌道は 1 ビットも変わらない
    // (= 追加の走行コストゼロ。この点が QA 化できた理由)
    const PB = []; for (let r = 80; r < 260; r += 15) PB.push([r, r + 15]);
    const pitchFit = (s, OFF, dirSign) => {
      const bx = s.x[0], by = s.y[0];
      const pts = [];
      for (const [lo, hi] of PB) {
        let cr = 0, ci = 0, N = 0;
        for (let i = OFF; i < s.n; i++) {
          const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
          if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
            cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
        }
        if (N < 8) continue;
        const A = Math.hypot(cr, ci) / N, noise = Math.sqrt(Math.PI / (4 * N));
        pts.push({ r: Math.sqrt(lo * hi), psi: Math.atan2(ci, cr) / 2, A, N, noise });
      }
      const use = pts.filter(p => p.A > 2 * p.noise);
      if (use.length < 4) return { ok: false, nBand: use.length };
      let prev = use[0].psi;
      const xs = [], ys = [], ws = [];
      for (let k = 0; k < use.length; k++) {
        let v = use[k].psi;
        if (k > 0) v += Math.round((prev - v) / Math.PI) * Math.PI;   // ψ は π 周期 → 最も近い分枝へ連続化
        prev = v;
        xs.push(Math.log(use[k].r)); ys.push(v); ws.push(use[k].N * use[k].A);
      }
      let Sw = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
      for (let k = 0; k < xs.length; k++) { const w = ws[k];
        Sw += w; Sx += w * xs[k]; Sy += w * ys[k]; Sxx += w * xs[k] * xs[k]; Sxy += w * xs[k] * ys[k]; }
      const den = Sw * Sxx - Sx * Sx;
      if (!(Math.abs(den) > 1e-12)) return { ok: false, nBand: use.length };
      const b = (Sw * Sxy - Sx * Sy) / den, a = (Sy - b * Sx) / Sw;
      let ssTot = 0, ssRes = 0; const ym = Sy / Sw;
      for (let k = 0; k < xs.length; k++) { const w = ws[k], pr = a + b * xs[k];
        ssRes += w * (ys[k] - pr) * (ys[k] - pr); ssTot += w * (ys[k] - ym) * (ys[k] - ym); }
      return { ok: true, slope: b, pitchDeg: Math.atan(1 / Math.abs(b)) * 180 / Math.PI,
        R2: ssTot > 0 ? 1 - ssRes / ssTot : null, nBand: use.length, trailing: dirSign * b < 0 };
    };
    const run = (ctrl) => {
      HP.loadPreset('darkrotor', false);
      const s = HP.sim, OFF = NH + 1;
      if (ctrl) for (const i of rotorIdx()) s.spin[i] = 0;
      let lz0 = 0;                                    // 円盤の回転向き(恒星の ΣL_z の符号)
      for (let i = OFF; i < s.n; i++) lz0 += s.x[i] * s.vy[i] - s.y[i] * s.vx[i];
      const dirSign = Math.sign(lz0) || 1;
      const pitch = [];
      const hr0 = [], st0 = [];
      for (let k = 1; k <= NH; k++) hr0.push(Math.hypot(s.x[k] - s.x[0], s.y[k] - s.y[0]));
      for (let i = OFF; i < s.n; i++) st0.push(Math.hypot(s.x[i] - s.x[0], s.y[i] - s.y[0]));
      const late = [];
      let maxSpin = 0, lastNoise = null;
      for (let blk = 0; blk < 12; blk++) {
        for (let k = 0; k < 500; k++) s.step(0.016);
        for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
        const t = (blk + 1) * 500;
        if (t >= 3000) { const z = a2(s, OFF); late.push(z.map(v => v.A2)); lastNoise = z;
          pitch.push({ t, ...pitchFit(s, OFF, dirSign) }); }
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
        maxSpin, rotDev, rotIn, keep, tot, keepPct: 100 * keep / tot, nan: s.hasNaN(), NH, n: s.n,
        pitch, dirSign };
    };
    return { on: run(false), ctrl: run(true) };
  }, w5cBands) },
  // 第84便B(創発の標準試験を 🕶️ へ展開): darkrotorMultiseed — 渦状腕の**多seed 頑健性**。
  // 既存の darkrotorLong が「内蔵 seed 1本+対照」を見るのに対し、こちらは seed を振って
  // 「乱数の引きが変わっても同じ増強が立つ」ことを claims の窓で判定する。
  // **QA は縮約版・exp 側が全数の正本**という既存の kind:"multi-seed" の流儀に合わせ、
  // QA は内蔵 seed **以外**の2seed(20260727/20260728)だけを回す(内蔵 seed は
  // darkrotorLong が既に見ているので重複させない)。8seed の分布は tests/exp-4-88.mjs が持つ。
  // 対照は darkrotorLong と同じ「中心BH も含む全 single の spin=0」。
  // 重い(6000步 × 4構成 ≈ 155s)ので QA_FAST=1 では実行しない(FAST への時間増はゼロ)。
  darkrotorMultiseed: { enabled: !FAST && w5cDrFree && w5cDrMulti, weight: 170,
    run: (pg) => pg.evaluate((o) => {
      const BANDS = o.bands;
      const P0 = HP.allPresets().find(q => q.id === 'darkrotor');
      const NH = P0.bodies.filter(b => b.type === 'single').length - 1;   // ローター体数(=2)
      const OFF = NH + 1;                                                 // 恒星の先頭 index(=3)
      // A2 の式は darkrotorLong と同一(環帯ごとの |Σe^{2iθ}|/N。θ は中心BH基準)
      const a2 = (s) => BANDS.map(([lo, hi]) => {
        const bx = s.x[0], by = s.y[0];
        let cr = 0, ci = 0, N = 0;
        for (let i = OFF; i < s.n; i++) {
          const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
          if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
            cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
        }
        return N ? Math.hypot(cr, ci) / N : 0;
      });
      const run = (seed, ctrl) => {
        const p = JSON.parse(JSON.stringify(P0));
        p.seed = seed;
        const v = HP.validatePreset(p);
        if (!v.ok) return { seed, err: v.errors.join(',') };
        HP.sim.build(v.preset);
        const s = HP.sim;
        if (ctrl) for (let i = 0; i <= NH; i++) s.spin[i] = 0;
        const st0 = [];
        for (let i = OFF; i < s.n; i++) st0.push(Math.hypot(s.x[i] - s.x[0], s.y[i] - s.y[0]));
        const late = []; let maxSpin = 0;
        for (let blk = 0; blk < 12; blk++) {
          for (let k = 0; k < 500; k++) s.step(0.016);
          for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
          if ((blk + 1) * 500 >= 3000) late.push(a2(s));
        }
        const A2 = BANDS.map((_, b) => late.reduce((a, w) => a + w[b], 0) / late.length);
        const bx = s.x[0], by = s.y[0];
        let keep = 0, tot = 0;
        for (let i = OFF; i < s.n; i++) { const r = Math.hypot(s.x[i] - bx, s.y[i] - by);
          if (st0[i - OFF] < 350) { tot++; if (r < 500) keep++; } }
        return { seed, A2, bandAvg: A2.reduce((a, w) => a + w, 0) / A2.length,
          keepPct: 100 * keep / tot, maxSpin, nLate: late.length,
          nan: s.hasNaN(), clampV: s.clampVN, clampR: s.clampRN || 0 };
      };
      return { seeds: o.seeds, main: o.seeds.map(sd => run(sd, false)),
        ctrl: o.seeds.map(sd => run(sd, true)) };
    }, { bands: w5cBands, seeds: [20260727, 20260728] }) },
  binary: { enabled: w5cHasV26, weight: 6, run: (pg) => pg.evaluate(() => {
    // ⭐binary の挙動(元7n節 3035-3044行から抽出)。第66便 66D: geoPN=1 化後の較正実測 —
    // 3000步 sep=120.1・保持240/240(旧 kFrame=1 構成は sep=137.4。窓 60〜350 はどちらも満たす)
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
  // 第37便 D2(台帳4-68a): 🌋agnjet の双極性。既定(kRep=2)と対照(kRep=0)を 4000步 走らせ、
  // 「内縁(初期 |x|≤80)起源のガスのうち r>300 へ出たもの」の方位分布を測る。
  // 極方向 = ±y から30°以内(等方なら 1/3)。重い(341粒子×4000步×2本)ので !FAST のユニット
  agnjet: { enabled: !FAST && w5cHasAgnjet, weight: 90, run: (pg) => pg.evaluate(() => {
    const s = HP.sim;
    const run = (kRep) => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'agnjet')));
      if (kRep !== undefined) p.physics.kRep = kRep;
      s.build(p);
      const x0 = Array.from(s.x);
      const inner = []; for (let i = 1; i < s.n; i++) if (Math.abs(x0[i]) <= 80) inner.push(i);
      for (let k = 0; k < 4000; k++) s.step(0.016);
      let pol = 0, eq = 0, tot = 0;
      for (const i of inner) { const r = Math.hypot(s.x[i], s.y[i]); if (r < 300) continue;
        tot++; if (Math.abs(s.y[i]) / r > 0.8660254) pol++; if (Math.abs(s.x[i]) / r > 0.8660254) eq++; }
      return { nInner: inner.length, tot, pol, eq, frac: tot ? pol / tot : 0, nan: s.hasNaN() };
    };
    const def = run(undefined), ctrl = run(0);
    return { jetDef: def, jetCtrl: ctrl };
  }) },
  // 第39便 39A(台帳4-74): 🌪️spinup の収縮とスピン加速。6000步(= 収縮が底に達した直後。
  // 底は5000步で最小値の1.05倍以内に入り、以後24000步まで平坦)。240粒子×6000步と軽い。
  // 指標はすべて重心系(COM)。R_core=√(I_core/M_core)(内側半質量 r≤R_half)・ω_core=L_c/I_c。
  // ω_core·I_c ≡ L_c は定義上の恒等式なので、非自明なのは「ω が (R₀/R)² 倍まで上がるか」
  // = コアの軌道角運動量が保たれるか(実測 一致率 ≡ L_c/L_c0)。
  // 測定式は tests/exp-4-74.mjs(38C の tests/exp-4-68c.mjs:114-149 からの転記)と同一、
  // 保存則の尺度は下の freebox scales と同式(= beta/index.html の HP.verify.v1 と同形)。
  spinup: { enabled: !FAST && w5cHasSpinup, weight: 16, run: (pg) => pg.evaluate(() => {
    HP.loadPreset('spinup', false);
    const s = HP.sim;
    const scales = () => { let pS = 0, lS = 0;
      for (let i = 0; i < s.n; i++) { pS += s.m[i] * Math.hypot(s.vx[i], s.vy[i]);
        lS += Math.abs(s.m[i] * s.x[i] * s.vy[i]) + Math.abs(s.m[i] * s.y[i] * s.vx[i])
            + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]); }
      return { pS, lS }; };
    const measure = () => {
      let M = 0, cx = 0, cy = 0, pvx = 0, pvy = 0;
      for (let i = 0; i < s.n; i++) { M += s.m[i]; cx += s.m[i] * s.x[i]; cy += s.m[i] * s.y[i];
        pvx += s.m[i] * s.vx[i]; pvy += s.m[i] * s.vy[i]; }
      cx /= M; cy /= M; pvx /= M; pvy /= M;
      let I = 0, Lorb = 0, Tsum = 0;
      const rs = [];
      for (let i = 0; i < s.n; i++) {
        const dx = s.x[i] - cx, dy = s.y[i] - cy, ux = s.vx[i] - pvx, uy = s.vy[i] - pvy;
        I += s.m[i] * (dx * dx + dy * dy);
        Lorb += s.m[i] * (dx * uy - dy * ux);
        Tsum += s.Tint ? s.Tint[i] : 0;
        rs.push({ r: Math.hypot(dx, dy), m: s.m[i], i });
      }
      rs.sort((a, b) => a.r - b.r);
      let acc = 0, Rhalf = rs[rs.length - 1].r;
      for (const q of rs) { acc += q.m; if (acc >= M / 2) { Rhalf = q.r; break; } }
      let Ic = 0, Lc = 0, Mc = 0, nc = 0, keepR0 = 0;
      for (const q of rs) {
        if (q.r < 150) keepR0++;
        if (q.r > Rhalf) continue;
        const i = q.i, dx = s.x[i] - cx, dy = s.y[i] - cy, ux = s.vx[i] - pvx, uy = s.vy[i] - pvy;
        Ic += s.m[i] * (dx * dx + dy * dy); Lc += s.m[i] * (dx * uy - dy * ux); Mc += s.m[i]; nc++;
      }
      return { Rrms: Math.sqrt(I / M), Rhalf, I, Lorb, omEff: Lorb / I,
        Rc: Math.sqrt(Ic / Mc), omC: Lc / Ic, Lc, nc, Tmean: Tsum / s.n, keepR0, n: s.n,
        idOm: Math.abs((Lorb / I) * I - Lorb) / Math.max(Math.abs(Lorb), 1e-9) };
    };
    const m0 = measure(), t0 = s.totals();
    for (let k = 0; k < 6000; k++) s.step(0.016);
    const m1 = measure(), t1 = s.totals(), sc1 = scales();
    return { m0, m1, thermal: s.thermal,
      ledger: [s.resPx, s.resPy, s.resL, s.radE, s.radL],
      relP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / sc1.pS,
      relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / sc1.lS,
      Lz0: t0.L, Lz1: t1.L, nan: s.hasNaN() };
  }) },
  // 第37便 D3(台帳4-68b): 🕸️cosmicweb の構造形成。共動座標 χ=r/a を 10×10 セルへ切り、
  // δ²=Var(N)/⟨N⟩²(初期は純ポアソン)とボイド率(空セル比)の成長を 6000步 で測る。
  // 既定(H=0.004)と膨張なし対照(H=0)の2本 — 膨張率で構造の育ち方が変わることまで機械固定する
  cosmicweb: { enabled: !FAST && w5cHasCosmicweb, weight: 85, run: (pg) => pg.evaluate(() => {
    const s = HP.sim;
    const NC = 10, CHI = 240;
    const cells = () => {
      const a = Math.exp(s.box.H0 * s.t);
      const g = new Int32Array(NC * NC);
      for (let i = 0; i < s.n; i++) {
        const cx = s.x[i] / a, cy = s.y[i] / a;
        if (Math.abs(cx) >= CHI || Math.abs(cy) >= CHI) continue;
        const ix = Math.floor((cx + CHI) / (2 * CHI) * NC), iy = Math.floor((cy + CHI) / (2 * CHI) * NC);
        g[iy * NC + ix]++;
      }
      let sum = 0, sum2 = 0, cnt = 0, empty = 0;
      for (let iy = 0; iy < NC; iy++) for (let ix = 0; ix < NC; ix++) {
        const px = (ix + 0.5) / NC * 2 * CHI - CHI, py = (iy + 0.5) / NC * 2 * CHI - CHI;
        if (Math.hypot(px, py) > CHI * 0.95) continue;              // 角のセルは常に空なので母集団から外す
        const v = g[iy * NC + ix]; sum += v; sum2 += v * v; cnt++; if (v === 0) empty++;
      }
      const mean = sum / cnt, varc = sum2 / cnt - mean * mean;
      return { d2: varc / (mean * mean), void: empty / cnt, a: Math.exp(s.box.H0 * s.t) };
    };
    const run = (H) => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'cosmicweb')));
      if (H !== undefined) { p.universeBox.H0 = H; p.bodies[0].vScale = H; }
      s.build(p);
      const c0 = cells();
      for (let k = 0; k < 6000; k++) s.step(0.016);
      const c1 = cells();
      return { d20: c0.d2, void0: c0.void, d21: c1.d2, void1: c1.void, a1: c1.a, nan: s.hasNaN() };
    };
    return { webDef: run(undefined), webNoH: run(0) };
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

// ---- 2b) 第83便 C: preset.validate-all-builtins — 全内蔵プリセットが validatePreset を
// ----      **致命エラー0** で通る。第82便A(光学輸送)の optics.default-bitequal 実装中に、
// ----      内蔵4件(🍳galaxyDB・🌑nebulaRotor・🐚nebulaShell・⏳nebulaBipolar)が**元から**
// ----      通らないことが判明し当該QAでは除外していた。第83便Cで根本解消した:
// ----       ・validator 側: disk/ring の aroundMass を **vMode:"kepler" のときだけ必須**へ
// ----         (build 側は kepler 以外でこのキーを 1 命令も参照しない。vScale/bulkVx と同じ
// ----         「未指定=0 の任意キー」へ揃えた。kepler での宣言漏れは従来どおり致命)
// ----       ・プリセット側: 🌑/🐚 のエンベロープ ring の `pinned` 宣言漏れを補完
// ----         (build は未指定を偽として読むので挙動は bit 不変。ring の pinned はレール駆動・
// ----          壁タグの分岐を持つ挙動キーなので、必須にしている検査側が正しい)
// ----      内蔵の読込経路(loadPreset→sim.build)は validatePreset を通らないため実害は無かったが、
// ----      「全内蔵が検証子を通る」ことを本項で恒久固定する。
// ----      **許容する警告は種類を固定**する(想定外の警告が1件でも出たら FAIL — 検査を緩めた
// ----      副作用の検出器。この性質は第83便D でも維持する)。
// ----      第83便C 時点の許容2種は、**第83便D で両方とも根本解消したので許容リストは空**になった:
// ----       W1(解消) descStruct の純分割不一致 — validatePreset が description を200字へ切り詰める
// ----          ため構造化説明(数千字)との連結一致が原理的に成立しなかった。第83便D で上限を
// ----          実測較正(DESC_CAP=16000 ≈ 統合後実測最長7819の2倍・節別 3000/13000/1500)し、内蔵の
// ----          descStruct は削除されずに通るようになった(往復での構造化説明の喪失を解消)。
// ----       W2(解消) bodies[N].m を値域に修正 — 🪜massLadder の m=10000 が MASS 上限5000に当たり、
// ----          往復すると物理が変質していた。第83便D で MASS_CAP=20000(内蔵最大の約2倍)へ較正。
// ----      許容リストが空になっても**構造は残す**(将来の較正で新しい許容種が要るときの受け皿)。
// ----      併せて「正規化しても挙動は変わらない」ことを、対象4件について
// ----      **生定義 build と validatePreset 正規化後 build の 400步後の全状態 bit 一致**で機械確認する。
// ----      (往復そのものの保全は第83便D の preset.roundtrip-builtins が別途固定する)
// ----      第83便C より前の対象(root 等)は自動 SKIP。
{
  const hasW83 = await page.evaluate(() => {
    const v = HP.validatePreset({ name: 'x', description: 'd', camera: { scale: 100 },
      world: { boundary: 'none', size: 0 },
      bodies: [{ type: 'disk', n: 2, cx: 0, cy: 0, radius: 10, mMin: 1, mMax: 1,
        spinMin: 0, spinMax: 0, vMode: 'random', vScale: 1, direction: 1 }] });
    return !!(v.ok && v.preset.bodies[0].aroundMass === 0);
  });
  if (hasW83) {
    const r = await page.evaluate(() => {
      // 許容警告の正規値(ここに載っていない警告が1件でも出たら FAIL — 検査を緩めた副作用の
      // 検出器)。第83便D で W1/W2 とも根本解消したため**空**= 内蔵の警告は0件が正規値
      const OKW = [];
      const ng = [], unexpected = [], kinds = OKW.map(() => 0);
      let total = 0;
      for (const p of HP.allPresets()) {
        if (String(p.id).startsWith('custom_')) continue;
        total++;
        const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
        if (!v.ok) { ng.push(p.id + ':' + (v.errors || []).join('/')); continue; }
        for (const w of (v.warnings || [])) {
          const i = OKW.findIndex((re) => re.test(w));
          if (i < 0) unexpected.push(p.id + ':' + w); else kinds[i]++;
        }
      }
      // ---- 正規化の挙動 bit 不変(第83便C の裁定根拠そのものを機械固定)----
      // 生定義をそのまま build した場合と、validatePreset を通してから build した場合で、
      // 400步後の力学状態(位置・速度・スピン・固有時計・pinned・コアv2 の J/Ω)が 1 bit も違わない
      const dump = (S) => {
        const a = [];
        for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'tau', 'm', 'pinned',
          'coreJ', 'coreOmV', 'coreMd', 'railOmega', 'railH']) {
          const v = S[k]; if (!v) { a.push(k + ':-'); continue; }
          a.push(k + ':' + Array.prototype.join.call(v.subarray(0, S.n), ','));
        }
        return a.join('|');
      };
      const run = (pre) => { HP.sim.build(JSON.parse(JSON.stringify(pre)));
        for (let i = 0; i < 400; i++) HP.sim.step(0.016); return dump(HP.sim); };
      const bitNg = [];
      for (const id of ['galaxyDB', 'nebulaRotor', 'nebulaShell', 'nebulaBipolar']) {
        const p = HP.allPresets().find((q) => q.id === id);
        if (!p) continue;
        const raw = run(p);
        const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
        if (!v.ok) { bitNg.push(id + ':validate-ng'); continue; }
        if (run(v.preset) !== raw) bitNg.push(id + ':state-diff');
      }
      HP.loadPreset('saturn', false);
      return { total, ng, unexpected, kinds, bitNg };
    });
    add('preset.validate-all-builtins',
      r.ng.length === 0 && r.unexpected.length === 0 && r.bitNg.length === 0 && r.total > 0,
      `内蔵${r.total}件が validatePreset を致命エラー0で通過(NG=[${r.ng.slice(0, 4).join(' ')}])/ ` +
      `許容警告 ${r.kinds.length}種=[${r.kinds.join(' ')}]件(第83便D で W1 descStruct純分割不一致・` +
      `W2 m値域クランプ とも根本解消 — 内蔵の警告は0件が正規値)/ ` +
      `想定外の警告=[${r.unexpected.slice(0, 3).join(' ')}](0件)/ ` +
      `正規化の挙動bit不変(生定義build vs 正規化後build・400步の全状態)=[${r.bitNg.join(' ')}](0件)`);
  } else {
    console.log('SKIP preset.validate-all-builtins(対象に第83便C の validatePreset 修正なし — root 等)');
  }
}

// ---- 2c) 第83便 D: preset.roundtrip-builtins — **エクスポート往復の保全**を機械固定する。
// ----      第83便C が「validatePreset の許容警告2種」として種類固定だけして未対応だった、
// ----      往復で情報が落ちる/物理が変質する2件の根本対応(第83便D)に対応するゲート。
// ----        ①descStruct 喪失: description の 200 字切り詰めで純分割一致が壊れ、descStruct を
// ----          持つ内蔵すべてで構造化説明が往復のたびに消えていた → DESC_CAP=16000(実測最長
// ----          4367 の約2倍)+節別上限 3000/6000/1500(≈2×1501/3065/691)へ実測較正。
// ----        ②物理変質: 🪜massLadder の m=10000 が MASS 上限5000でクランプされ、往復すると
// ----          別の物理になっていた → MASS_CAP=20000(内蔵最大の約2倍)へ実測較正。
// ----      検査内容(内蔵の全件について):
// ----        ・**エクスポート JSON を実際に作って往復する** — exportData と同じ封筒
// ----          {schemaVersion:4, saves, customPresets} を JSON.stringify(…,null,1) で文字列化し、
// ----          JSON.parse で読み戻して validatePreset → sim.build。JSON 化で壊れる値
// ----          (undefined/NaN/Infinity)もこの経路なら顕在化する。
// ----        ・**descStruct 保全**: ja/en とも、往復後の 3 節が元と一字一句同じ(削除されない)。
// ----        ・**質量クランプ発動 0**: m/mMin/mMax/aroundMass の「値域に修正」警告が 1 件も出ない。
// ----        ・**bit 一致**: 往復 build と直接 build で、t=0 と 400步後の全状態(位置・速度・
// ----          スピン・固有時計・質量・pinned・コアv2 の J/Ω/mode・レール)が 1 bit も違わない。
// ----      区画(実測: 全件の 400步 往復は約136秒 — QA_FAST には重すぎる):
// ----        ・**t=0 の全状態 bit 一致 + descStruct 保全 + 質量クランプ0 は常に全件**(実測 0.13 秒)。
// ----          正規化の取りこぼしはほぼすべて初期状態に出るので、これが主検出面。
// ----        ・**400步の bit 一致**は QA_FAST では代表8件(実測 約8.6秒)、フルQAでは全件。
// ----          代表8件は 🪜massLadder(質量上限)・🥚selfRotor(最長 description・コアv2 active)・
// ----          🕳bhCore(最長 summary/control・コアv2)・🌟starcore(コアv2)・🪐saturn(zonal E13)・
// ----          📏probeH(universeBox+probeHud)・📦freebox(measureBox)・🌀boxrot(レール駆動)。
// ----          第83便C の preset.validate-all-builtins が別の4件(galaxyDB/nebulaRotor/
// ----          nebulaShell/nebulaBipolar)の400步 bit 不変を持っているので重複させない。
// ----      第83便D より前の対象(root 等)は自動 SKIP。
{
  const hasW83D = await page.evaluate(() => {
    // 判定子: description の上限が 200 字より広がっていること(DESC_CAP の実測較正)
    const long = 'あ'.repeat(1000);
    const v = HP.validatePreset({ name: 'x', description: long, camera: { scale: 100 },
      world: { boundary: 'none', size: 0 },
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
    return !!(v.ok && v.preset.description.length === 1000);
  });
  if (hasW83D) {
    const FAST_SAMPLE = ['massLadder', 'selfRotor', 'bhCore', 'starcore', 'saturn',
      'probeH', 'freebox', 'boxrot'];
    const r = await page.evaluate(({ fast, sample }) => {
      // 力学状態の全ダンプ(第83便C の preset.validate-all-builtins と同じキー集合)
      const dump = (S) => {
        const a = [];
        for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'tau', 'm', 'pinned',
          'coreJ', 'coreOmV', 'coreMd', 'railOmega', 'railH']) {
          const v = S[k]; if (!v) { a.push(k + ':-'); continue; }
          a.push(k + ':' + Array.prototype.join.call(v.subarray(0, S.n), ','));
        }
        return a.join('|');
      };
      const run = (pre, steps) => {
        HP.sim.build(JSON.parse(JSON.stringify(pre)));
        const s0 = dump(HP.sim);
        for (let i = 0; i < steps; i++) HP.sim.step(0.016);
        return s0 + '#' + dump(HP.sim);
      };
      // exportData と同じ封筒に載せて文字列化 → 読み戻し(往復そのもの)
      const roundtrip = (p) => {
        const env = JSON.stringify({ schemaVersion: 4, appVersion: HP.APP_VERSION,
          appBuild: 'qa', exportedAt: '2026-01-01T00:00:00.000Z',
          saves: [], customPresets: [p] }, null, 1);
        return JSON.parse(env).customPresets[0];
      };
      const dsEq = (a, b) => {
        if (!a) return !b;
        if (!b) return false;
        return ['summary', 'observe', 'control'].every((k) => (a[k] || '') === (b[k] || ''));
      };
      const MASSW = /\.(m|mMin|mMax|aroundMass) を値域に修正$/;
      const ng = [], dsNg = [], massNg = [], bit0Ng = [], bit400Ng = [];
      let total = 0, nDS = 0, n400 = 0;
      for (const p of HP.allPresets()) {
        if (String(p.id).startsWith('custom_')) continue;
        total++;
        const v = HP.validatePreset(roundtrip(p));
        if (!v.ok) { ng.push(p.id + ':' + (v.errors || []).join('/')); continue; }
        // descStruct 保全(ja/en) — 元が持っているものは 3 節とも一字一句保たれること
        if (p.descStruct || (p.en && p.en.descStruct)) {
          nDS++;
          if (!dsEq(p.descStruct, v.preset.descStruct)) dsNg.push(p.id + ':ja');
          if (p.en && !dsEq(p.en.descStruct, v.preset.en && v.preset.en.descStruct)) dsNg.push(p.id + ':en');
        }
        // 質量クランプ発動 0
        for (const w of (v.warnings || [])) if (MASSW.test(w)) massNg.push(p.id + ':' + w);
        // bit 一致: t=0 は常に全件・400步は区画に従う
        const steps = (!fast || sample.indexOf(p.id) >= 0) ? 400 : 0;
        if (steps) n400++;
        const raw = run(p, steps);
        if (run(v.preset, steps) !== raw) (steps ? bit400Ng : bit0Ng).push(p.id);
      }
      // ---- 上限そのものは残っていること(緩めすぎ検出。合成プリセットで負の経路を1回だけ叩く)----
      const mk = (desc, ds, m) => ({ name: 't', description: desc, descStruct: ds,
        camera: { scale: 100 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: {}, overlays: {},
        bodies: [{ type: 'single', m, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      const A = 'あ';
      const vDesc = HP.validatePreset(mk(A.repeat(20000), undefined, 1));   // 第83便統合: DESC_CAP 16000 再較正に追随
      const vSect = HP.validatePreset(mk(A.repeat(9), { summary: A.repeat(9), observe: '', control: '' }, 1));
      const vSectBig = HP.validatePreset(mk(A.repeat(8000), { summary: A.repeat(8000), observe: '', control: '' }, 1));
      const vMass = HP.validatePreset(mk('d', undefined, 1e9));
      const caps = {
        // description は 16000 で切り詰め(200 でも 20000 でもない — 第83便統合の再較正値)
        desc: vDesc.ok && vDesc.preset.description.length === 16000,
        // 節が上限内なら保持される(9 字の純分割)
        sectKeep: vSect.ok && !!vSect.preset.descStruct && vSect.preset.descStruct.summary.length === 9,
        // summary 上限 3000 超は切り詰め警告 → 純分割が壊れて descStruct ごと削除(荒らし対策は健在)
        sectCut: vSectBig.ok && vSectBig.preset.descStruct === undefined &&
          vSectBig.warnings.some((w) => /descStruct\.summary が上限3000字を超過/.test(w)),
        // 質量は 20000 で警告つきクランプ(クランプ挙動そのものは不変)
        mass: vMass.ok && vMass.preset.bodies[0].m === 20000 &&
          vMass.warnings.some((w) => /^bodies\[0\]\.m を値域に修正$/.test(w))
      };
      HP.loadPreset('saturn', false);
      return { total, nDS, n400, ng, dsNg, massNg, bit0Ng, bit400Ng, caps };
    }, { fast: FAST, sample: FAST_SAMPLE });
    const capsOk = Object.values(r.caps).every(Boolean);
    add('preset.roundtrip-builtins',
      r.total > 0 && r.ng.length === 0 && r.dsNg.length === 0 && r.massNg.length === 0 &&
      r.bit0Ng.length === 0 && r.bit400Ng.length === 0 && capsOk,
      `内蔵${r.total}件のエクスポートJSON往復(stringify→parse→validatePreset→build)/ ` +
      `致命エラー=[${r.ng.slice(0, 3).join(' ')}](0件)/ ` +
      `descStruct 保全 ${r.nDS}件=[${r.dsNg.slice(0, 3).join(' ')}](喪失0件)/ ` +
      `質量クランプ発動=[${r.massNg.slice(0, 3).join(' ')}](0件)/ ` +
      `bit一致(往復build vs 直接build)t=0 のみ ${r.total - r.n400}件=[${r.bit0Ng.slice(0, 3).join(' ')}](0件)・` +
      `t=0+400步 ${r.n400}件(${FAST ? 'QA_FAST=代表' : 'フル=全件'})=[${r.bit400Ng.slice(0, 3).join(' ')}](0件)/ ` +
      `上限は健在(desc 16000切り詰め=${r.caps.desc}・節上限内は保持=${r.caps.sectKeep}・` +
      `summary 3000超は切り詰め警告→descStruct削除=${r.caps.sectCut}・m は20000で警告つきクランプ=${r.caps.mass})`);
  } else {
    console.log('SKIP preset.roundtrip-builtins(対象に第83便D の説明文上限の実測較正なし — root 等)');
  }
}

// ---- 2d) 第86便 P0-2(外部レビュー採択): migration.fixtures — **代表的な旧セーブの移行**を
// ----      固定資産(tests/fixtures/*.json)で機械固定する。
// ----      第81便でコアv1(比率仕様 coreMR/coreSR/coreRR)はエンジンから廃止され、旧キーは
// ----      validatePreset の legacyCoreToV2 が読込時にコアv2 core:{} へ移行する。移行式は
// ----      アプリ内にしかなく、**入力側の代表例がどこにも固定されていなかった**ため、値域・
// ----      既定値・build の初期化式を触ったときに「旧セーブを読むと初期状態が変わる」ことを
// ----      検出できなかった。本項がその検出面である。
// ----      fixture は当時のエクスポート封筒(schemaVersion 2 = v1.37.0 root / 3 = 第80便)を
// ----      そのまま再現した**恒久資産**で、将来のスキーマ変更でも書き換えない
// ----      (詳細と追加ルール: tests/fixtures/README.md)。3種は移行式の分岐を網羅する:
// ----        ①rigid   coreSR=1     — 🌍地球と月の編集セーブ(coreRR 未指定=Rc は質量比の既定式)
// ----        ②differential coreSR≠1 — 🐚重殻ローター型(single の radius+coreRR 指定 と
// ----                                  disk 群の代表値〔平均質量・平均スピン〕の両経路)
// ----        ③cavity   coreMR<0    — 空洞コア(radiusScale=1.5 = 表示スケール倍率を掛ける経路)
// ----      検査内容:
// ----        ・validatePreset が**致命エラー0**で通り、コアv2 へ変換されている(legacyCore=true)
// ----        ・警告は**移行の告知だけ**(値域クランプ等の想定外の警告が1件でも出たら FAIL)
// ----        ・変換後の core:{} が、QA 側に**独立に書き下した移行式**の値と厳密一致する
// ----        ・sim.build 後の **t=0 の全状態**(位置・速度・スピン・質量・pinned と
// ----          コアの coreMd/coreMF/RcV/coreJ/coreOm0)が理論値と一致する
// ----      **主張の範囲は t=0 の初期状態一致だけ**である。コアv1 の Ω_c は殻スピンに比例追従
// ----      (Ω_c=coreSR·s(t))したが、コアv2 の J_core は独立変数なので、コアが時間発展する
// ----      構成では軌跡は旧版と一致しない場合がある(第81便の仕様・第82便で警告文へ明記)。
// ----      したがって本項は**1步も進めない** — 「軌跡非互換がありうる」ことを検査するのではなく、
// ----      移行が保証する範囲そのものを検査の形で体現する。移行の告知文が軌跡の但し書きを
// ----      持っていることだけは併せて機械固定する(保証範囲の告知が消えたら FAIL)。
// ----      第81便より前の対象(コアv1 のまま = root 等)は自動 SKIP。
{
  const FIX_DIR = path.join(ROOT, 'tests', 'fixtures');
  const FIX_FILES = ['legacy-core-rigid-v2.json', 'legacy-core-differential-v2.json',
    'legacy-core-cavity-v3.json'];
  const fixtures = FIX_FILES.map((f) => ({ file: f,
    env: JSON.parse(fs.readFileSync(path.join(FIX_DIR, f), 'utf8')) }));
  const hasMigration = await page.evaluate(() => {
    const v = HP.validatePreset({ name: 'x', description: 'd', camera: { scale: 100 },
      world: { boundary: 'none', size: 0 }, physics: { radiusScale: 1 },
      bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: false,
        coreMR: 0.4, coreSR: 2 }] });
    return !!(v.ok && v.preset.bodies[0].core && v.preset.bodies[0].core.mode === 'differential');
  });
  if (hasMigration) {
    const r = await page.evaluate((fx) => {
      const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
      const isN = (v) => typeof v === 'number' && Number.isFinite(v);
      // ---- 移行式(QA 側の独立実装)。アプリの legacyCoreToV2 + vCore の正規化を、
      // ---- docs/PHYSICS 記載の式からもう一度書き下したもの。アプリ側の関数は呼ばない。
      //   R  = (radius>0 ? radiusScale·radius : radiusScale·rMul·√|m|)
      //   Rc = (coreRR>0 ? coreRR·R          : radiusScale·rMul·√|coreMR·m|)
      //   coreMR<0  → cavity      {voidFraction:|coreMR|, radius:Rc, omega:coreSR·s}
      //   coreSR==1 → rigid       {massFrac:coreMR, radius:Rc}          (omega は持たない=0)
      //   その他    → differential{massFrac:coreMR, radius:Rc, omega:coreSR·s, Kcs:0}
      const theory = (b, rep, rs) => {
        const mr = isN(b.coreMR) ? cl(b.coreMR, -1, 1) : 0;
        const sr = isN(b.coreSR) ? cl(b.coreSR, -20, 20) : 1;
        const rr = isN(b.coreRR) ? cl(b.coreRR, 0.02, 1) : 0;
        if (mr === 0) return null;
        const rMul = isN(rep.rMul) ? rep.rMul : 1;
        const mAbs = Math.max(Math.abs(rep.m), 0.01);
        const Rb = (isN(rep.radius) && rep.radius > 0) ? rs * rep.radius : rs * rMul * Math.sqrt(mAbs);
        const Rc = (rr > 0) ? rr * Rb : rs * rMul * Math.sqrt(Math.abs(mr) * mAbs);
        const om = sr * (isN(rep.spin) ? rep.spin : 0);
        // vCore の正規化(既定 0 埋め+値域クランプ)まで含めた最終形
        const base = { Kcs: 0, pump: 0, contract: 0, sourceRate: 0, internalEnergy: 0 };
        if (mr < 0) return Object.assign({ mode: 'cavity', massFrac: 0, radius: cl(Rc, 0.2, 200),
          omega: cl(om, -50, 50), voidFraction: cl(Math.abs(mr), 0.01, 1) }, base);
        if (sr === 1) return Object.assign({ mode: 'rigid', massFrac: cl(mr, 0.01, 0.6),
          radius: cl(Rc, 0.2, 200), omega: 0, voidFraction: 0 }, base);
        return Object.assign({ mode: 'differential', massFrac: cl(mr, 0.01, 0.6),
          radius: cl(Rc, 0.2, 200), omega: cl(om, -50, 50), voidFraction: 0 }, base);
      };
      const KEYS = ['mode', 'massFrac', 'radius', 'omega', 'Kcs', 'pump', 'contract',
        'sourceRate', 'internalEnergy', 'voidFraction'];
      const canon = (c) => c ? KEYS.map((k) => k + '=' + c[k]).join(',') : 'null';
      const MD = { rigid: 1, differential: 2, active: 3, cavity: 4 };
      // 告知文の但し書き(ja/en どちらでも可 — 保証範囲の明示が消えたら FAIL)
      const MIGW = /(legacy core keys|旧コア指定)/;
      const CAVEAT = /(trajectory may not match|軌跡にならない場合がある)/;
      const f32 = (v) => Math.fround(v);
      const relEq = (a, b, tol) => (a === b) || (Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)));

      const out = [];
      for (const { file, env } of fx) {
        const rec = { file, schemaVersion: env.schemaVersion, presets: 0, migratedBodies: 0,
          errs: [], warnUnexpected: [], noCaveat: [], coreNg: [], stateNg: [], legacyFlagNg: [] };
        for (const raw of (env.customPresets || [])) {
          rec.presets++;
          const v = HP.validatePreset(JSON.parse(JSON.stringify(raw)));
          if (!v.ok) { rec.errs.push(file + ':' + (v.errors || []).join('/')); continue; }
          if (v.legacyCore !== true) rec.legacyFlagNg.push(file + ':legacyCore=' + v.legacyCore);
          const rs = v.preset.physics.radiusScale;
          // 期待コア(QA 側の独立実装)と、粒子インデックス範囲を body ごとに作る
          const exp = [], span = [];
          for (const b of raw.bodies) {
            const isGrp = (b.type === 'disk' || b.type === 'ring');
            const rep = isGrp
              ? { m: (Math.min(b.mMin, b.mMax) + Math.max(b.mMin, b.mMax)) / 2,
                  spin: (Math.min(b.spinMin, b.spinMax) + Math.max(b.spinMin, b.spinMax)) / 2,
                  rMul: isN(b.rMul) ? cl(b.rMul, 0.2, 5) : undefined }
              : { m: cl(b.m, 0.01, 20000), spin: cl(b.spin, -20, 20),
                  radius: isN(b.radius) ? cl(b.radius, 0.5, 500) : undefined,
                  rMul: isN(b.rMul) ? cl(b.rMul, 0.2, 5) : undefined };
            exp.push(theory(b, rep, rs));
            span.push(isGrp ? Math.round(b.n) : 1);
          }
          // ①変換後の core:{} が理論値と厳密一致
          v.preset.bodies.forEach((vb, k) => {
            if (exp[k]) rec.migratedBodies++;
            if (canon(vb.core || null) !== canon(exp[k])) rec.coreNg.push(file + ':body' + k +
              ':' + canon(vb.core || null) + '≠' + canon(exp[k]));
          });
          // ②警告は移行の告知だけ(値域クランプ等の想定外が1件でもあれば FAIL)
          for (const w of (v.warnings || [])) {
            if (!MIGW.test(w)) rec.warnUnexpected.push(file + ':' + w);
            else if (!CAVEAT.test(w)) rec.noCaveat.push(file + ':' + w);
          }
          // ③t=0 の全状態が理論どおり(**1步も進めない** — 移行が保証するのは初期状態だけ)
          HP.sim.build(JSON.parse(JSON.stringify(v.preset)));
          const S = HP.sim;
          let i = 0;
          raw.bodies.forEach((b, k) => {
            const ec = exp[k], n = span[k];
            for (let q = 0; q < n; q++, i++) {
              if (i >= S.n) { rec.stateNg.push(file + ':body' + k + ':index-overflow'); return; }
              if (span[k] === 1) {   // single は入力値そのものが t=0 状態
                for (const [key, want] of [['x', b.x], ['y', b.y], ['vx', b.vx], ['vy', b.vy],
                  ['spin', b.spin], ['m', b.m]])
                  if (S[key][i] !== f32(want)) rec.stateNg.push(file + ':p' + i + '.' + key +
                    '=' + S[key][i] + '≠' + f32(want));
                if (!!S.pinned[i] !== !!b.pinned) rec.stateNg.push(file + ':p' + i + '.pinned');
              }
              const md = ec ? MD[ec.mode] : 0;
              if (S.coreMd[i] !== md) rec.stateNg.push(file + ':p' + i + '.coreMd=' + S.coreMd[i] + '≠' + md);
              if (!ec) continue;
              const cav = (ec.mode === 'cavity');
              const wMF = cav ? -ec.voidFraction : ec.massFrac;
              if (S.coreMF[i] !== f32(wMF)) rec.stateNg.push(file + ':p' + i + '.coreMF=' + S.coreMF[i] + '≠' + f32(wMF));
              if (S.RcV[i] !== f32(ec.radius)) rec.stateNg.push(file + ':p' + i + '.RcV=' + S.RcV[i] + '≠' + f32(ec.radius));
              // J_core = ½·Mc·Rc²·Ω(cavity は質量0・慣性0 なので厳密に 0)。群は各粒子の
              // 質量が RNG で決まるので、Float32 で読み戻した m からの相対許容 1e-6 で照合する
              const wJ = cav ? 0 : 0.5 * (ec.massFrac * Math.abs(S.m[i])) * ec.radius * ec.radius * ec.omega;
              if (!relEq(S.coreJ[i], wJ, 1e-6)) rec.stateNg.push(file + ':p' + i + '.coreJ=' + S.coreJ[i] + '≠' + wJ);
              const wOm0 = cav ? ec.omega : 0;
              if (S.coreOm0[i] !== f32(wOm0)) rec.stateNg.push(file + ':p' + i + '.coreOm0=' + S.coreOm0[i] + '≠' + f32(wOm0));
            }
          });
        }
        out.push(rec);
      }
      HP.loadPreset('saturn', false);
      return out;
    }, fixtures);
    const flat = (k) => r.reduce((a, x) => a.concat(x[k]), []);
    const bad = ['errs', 'warnUnexpected', 'noCaveat', 'coreNg', 'stateNg', 'legacyFlagNg']
      .reduce((a, k) => a + flat(k).length, 0);
    const modes = r.map((x) => x.file.replace(/^legacy-core-|-v\d\.json$/g, '')).join('/');
    add('migration.fixtures',
      bad === 0 && r.length === 3 && r.every((x) => x.presets > 0 && x.migratedBodies > 0),
      `固定資産 ${r.length}件(${modes})/ 封筒 schemaVersion=[${r.map((x) => x.schemaVersion).join(' ')}]/ ` +
      `移行した body=${r.reduce((a, x) => a + x.migratedBodies, 0)}件・` +
      `致命エラー=[${flat('errs').slice(0, 2).join(' ')}](0件)/ ` +
      `legacyCore フラグ=[${flat('legacyFlagNg').slice(0, 2).join(' ')}](0件)/ ` +
      `想定外の警告=[${flat('warnUnexpected').slice(0, 2).join(' ')}](0件 — 値域クランプ等が起きたら FAIL)/ ` +
      `軌跡の但し書きが無い告知=[${flat('noCaveat').slice(0, 1).join(' ')}](0件)/ ` +
      `core:{} が独立実装の移行式と厳密一致=[${flat('coreNg').slice(0, 2).join(' ')}](0件)/ ` +
      `t=0 の全状態(x,y,vx,vy,spin,m,pinned+coreMd/coreMF/RcV/coreJ/coreOm0)=` +
      `[${flat('stateNg').slice(0, 2).join(' ')}](0件)/ ` +
      `**主張は初期状態一致のみ**(1步も進めない — コアv1 の Ω_c=coreSR·s(t) 追従と ` +
      `コアv2 の独立 J_core は、コアが時間発展する構成で軌跡が割れうる)`);
  } else {
    console.log('SKIP migration.fixtures(対象に第81便のコアv1→v2 移行なし — root 等)');
  }
}

// ---- 2e) 第86便 P0-3(外部レビュー採択): migration.export-record — エクスポート封筒の
// ----      migration 記録。旧コアキーから移行した構成は「移行済み」であることが**インポート
// ----      時点でしか分からない**(localStorage には正規化後のコアv2 だけが残るため)。
// ----      そこで来歴を localStorage(hp_migration)へ 1 件だけ記録し、エクスポート封筒へ
// ----      migration:{fromSchema,legacyCoreConverted} として書き出す。
// ----      **既定で既存エクスポートは1文字も変わらない**ことが本項の主眼:
// ----        ・移行が一度も無いプロファイルでは migration キーごと存在せず、封筒のキー順も不変
// ----        ・schemaVersion は 4 のまま(migration は追加の任意キー)
// ----        ・複数回インポートしたときの fromSchema は**最小(最も古い由来)**= 順序非依存
// ----        ・移行記録つき JSON を読み込んだときは情報表示が出る(警告レベル)
// ----      第86便より前の対象(validatePreset が legacyCore を返さない)は自動 SKIP。
{
  const hasMigRec = await page.evaluate(() => {
    const v = HP.validatePreset({ name: 'x', description: 'd', camera: { scale: 100 },
      world: { boundary: 'none', size: 0 }, physics: { radiusScale: 1 },
      bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: false,
        coreMR: 0.4, coreSR: 2 }] });
    return v.ok && v.legacyCore === true && typeof HP.exportData === 'function';
  });
  if (hasMigRec) {
    const legacyEnv = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'tests', 'fixtures', 'legacy-core-rigid-v2.json'), 'utf8'));
    const cavityEnv = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'tests', 'fixtures', 'legacy-core-cavity-v3.json'), 'utf8'));
    const r = await page.evaluate(({ legacyEnv, cavityEnv }) => {
      const keep = { cp: localStorage.getItem('hp_custom_presets'),
        sv: localStorage.getItem('hp_saves'), mg: localStorage.getItem('hp_migration') };
      const reset = () => { localStorage.setItem('hp_custom_presets', '[]');
        localStorage.setItem('hp_saves', '[]'); localStorage.removeItem('hp_migration'); };
      const doImport = (obj) => { document.querySelector('#ioArea').value = JSON.stringify(obj);
        document.querySelector('#btnImport').click();
        return document.querySelector('#notice').textContent; };
      const env = () => JSON.parse(HP.exportData());
      const keysOf = (o) => Object.keys(o).join(',');
      const BASE = 'schemaVersion,appVersion,appBuild,exportedAt,saves,customPresets';
      const WITH = 'schemaVersion,appVersion,appBuild,exportedAt,migration,saves,customPresets';
      // ①移行が無いプロファイル: migration キーなし・封筒のキー順も従来どおり
      reset();
      const e0 = env(); const t0 = HP.exportData();
      const clean = { keys: keysOf(e0), hasMig: 'migration' in e0, sv: e0.schemaVersion,
        noText: t0.indexOf('"migration"') < 0 };
      // ②新規構成(コアv2 を明示指定 — 旧キーなし)を入れても migration は付かない
      const modern = { id: 'custom_qa_mig_modern', name: 'mig-modern', description: 'd',
        camera: { scale: 100 }, world: { boundary: 'none', size: 0 }, physics: { radiusScale: 1 },
        bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: false,
          core: { mode: 'rigid', massFrac: 0.3, radius: 5 } }] };
      const noticeModern = doImport({ schemaVersion: 4, saves: [], customPresets: [modern] });
      const e1 = env();
      const modernOk = !('migration' in e1) && keysOf(e1) === BASE &&
        localStorage.getItem('hp_migration') === null;
      // ③旧キー入り(schemaVersion 2)を入れると migration が付く
      reset();
      const noticeLegacy = doImport(legacyEnv);
      const e2 = env();
      const legacyOk = keysOf(e2) === WITH && e2.schemaVersion === 4 &&
        e2.migration && e2.migration.fromSchema === 2 && e2.migration.legacyCoreConverted === true;
      // ④さらに schemaVersion 3 の旧キー入りを重ねても fromSchema は最小(=2)のまま
      doImport(cavityEnv);
      const e3 = env();
      const minOk = e3.migration && e3.migration.fromSchema === 2;
      // ⑤逆順(3 → 2)でも同じ結果になる(順序非依存)
      reset();
      doImport(cavityEnv);
      const eA = env();
      doImport(legacyEnv);
      const eB = env();
      const orderOk = eA.migration && eA.migration.fromSchema === 3 &&
        eB.migration && eB.migration.fromSchema === 2;
      // ⑥移行記録つき JSON を読み込んだら(旧キーが無くても)記録を引き継ぎ情報表示を出す
      reset();
      const carried = { schemaVersion: 4, appVersion: HP.APP_VERSION, appBuild: 'qa',
        exportedAt: '2026-01-01T00:00:00.000Z',
        migration: { fromSchema: 3, legacyCoreConverted: true },
        saves: [], customPresets: [modern] };
      const noticeCarried = doImport(carried);
      const e4 = env();
      const carriedOk = e4.migration && e4.migration.fromSchema === 3 &&
        e4.migration.legacyCoreConverted === true;
      // ⑦後片付け: localStorage を元へ戻し、空インポートで DOM(プリセット選択・保存一覧)を再同期
      if (keep.cp === null) localStorage.removeItem('hp_custom_presets'); else localStorage.setItem('hp_custom_presets', keep.cp);
      if (keep.sv === null) localStorage.removeItem('hp_saves'); else localStorage.setItem('hp_saves', keep.sv);
      if (keep.mg === null) localStorage.removeItem('hp_migration'); else localStorage.setItem('hp_migration', keep.mg);
      doImport({ schemaVersion: 4, saves: [], customPresets: [] });
      HP.loadPreset('saturn', false);
      return { clean, modernOk, legacyOk, minOk, orderOk, carriedOk,
        noticeModern, noticeLegacy, noticeCarried,
        BASE, WITH, keys1: keysOf(e1), keys2: keysOf(e2) };
    }, { legacyEnv, cavityEnv });
    // 情報表示: 移行を伴うインポートでだけ「旧コア形式から変換済み」の但し書きが出る
    const NOTE = /(旧コア形式から変換済み|converted from the legacy core format)/;
    const noteOk = !NOTE.test(r.noticeModern) && NOTE.test(r.noticeLegacy) && NOTE.test(r.noticeCarried);
    add('migration.export-record',
      r.clean.keys === r.BASE && !r.clean.hasMig && r.clean.sv === 4 && r.clean.noText &&
      r.modernOk && r.legacyOk && r.minOk && r.orderOk && r.carriedOk && noteOk,
      `移行なし: 封筒キー=[${r.clean.keys}](=従来どおり・migration キーなし=${!r.clean.hasMig}・` +
      `本文に "migration" の文字列なし=${r.clean.noText}・schemaVersion=${r.clean.sv})/ ` +
      `コアv2 明示の新規構成でも付かない=${r.modernOk}(キー=[${r.keys1}])/ ` +
      `旧キー入り(schemaVersion 2)→ migration:{fromSchema:2,legacyCoreConverted:true} 付与=${r.legacyOk}` +
      `(キー=[${r.keys2}]・schemaVersion は 4 のまま)/ ` +
      `2→3 の順で重ねても fromSchema は最小=${r.minOk} / 3→2 の逆順でも同じ=${r.orderOk}(順序非依存)/ ` +
      `移行記録つき JSON の読込で記録を引き継ぐ=${r.carriedOk} / ` +
      `情報表示は移行時だけ=${noteOk}(新規=「${String(r.noticeModern).slice(0, 24)}…」・` +
      `移行=「…${String(r.noticeLegacy).slice(-34)}」)`);
  } else {
    console.log('SKIP migration.export-record(対象に第86便の migration 記録なし — root 等)');
  }
}

// ---- 3) i18n(全内蔵に en / EN切替 / JA復帰)----
{
  const r = await page.evaluate(() => {
    const missing = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'))
      .filter(p => !(p.en && p.en.name && p.en.description)).map(p => p.id);
    HP.setLang('en');
    // 第79便: サンプルカテゴリをスケール順へ並べ替えたため、先頭 optgroup は
    // 'Heat Lab'(熱の実験室)になる。従来順(root 昇格前)の 'Space & Time' も受理する
    const g0 = document.querySelector('#presetSelect optgroup').label;
    const en = document.title.includes('Virtual Physics Lab')
      && (g0 === 'Heat Lab' || g0 === 'Space & Time')
      && HP.getSystemPrompt().includes('Language override');
    HP.setLang('ja');
    const ja = document.title.includes('仮想物理ラボ') && !HP.getSystemPrompt().includes('Language override');
    return { missing, en, ja, g0 };
  });
  add('i18n.presets-en', r.missing.length === 0, r.missing.join(','));
  add('i18n.toggle', r.en && r.ja, `EN=${r.en} JA=${r.ja} 先頭optgroup=${r.g0}`);
}

// ---- 3b) 第40便 40B(台帳4-80): i18n.claim-sync — ja/en の説明文が同じ主張を運んでいることを、
// ----      対象プリセットごとの必須キーワード対(ja語⇔en語)で機械照合する。表は拡張可能
// ----      (今回は binary の A5 空間の引きずり / fig8 の kFrame=0 ニュートン退化+T7保存 の2件・3対)。
// ----      ja は部分一致(includes)・en は大小無視の正規表現一致。
// ----      binary/fig8 自体は root にも既に存在するプリセットだが、en 側の補完は本便(40B)の
// ----      beta 先行変更なので、同便の abBody(darkrotor)の有無を機械可読な便フラグとして
// ----      流用しガードする(root では自動 SKIP・root へ 40B が昇格すれば自動的に有効化される)----
const has40BSemanticSync = await page.evaluate(() => {
  const dr = HP.allPresets().find((p) => p.id === 'darkrotor');
  return !!(dr && dr.abBody);
});
if (has40BSemanticSync) {
  const CLAIM_SYNC_TABLE = [
    { id: 'binary', pairs: [
      { label: 'A5 空間の引きずり(dragging)', ja: '引きず', en: 'drag' },
    ] },
    { id: 'fig8', pairs: [
      { label: 'kFrame=0 ニュートン退化(Newtonian degeneracy)', ja: 'ニュートン', en: 'newton' },
      { label: '運動量・角運動量保存(T7 / conservation)', ja: '保存', en: 'conserv' },
    ] },
  ];
  const r = await page.evaluate((table) => {
    const out = [];
    for (const ent of table) {
      const p = HP.allPresets().find((q) => q.id === ent.id);
      if (!p) { out.push({ id: ent.id, missing: true, pairs: [] }); continue; }
      const ja = p.description || '';
      const en = (p.en && p.en.description) || '';
      const pairs = ent.pairs.map((pr) => ({
        label: pr.label,
        jaHit: ja.includes(pr.ja),
        enHit: new RegExp(pr.en, 'i').test(en),
      }));
      out.push({ id: ent.id, missing: false, pairs });
    }
    return out;
  }, CLAIM_SYNC_TABLE);
  const allOk = r.every((e) => !e.missing && e.pairs.every((p) => p.jaHit && p.enHit));
  add('i18n.claim-sync', allOk,
    r.map((e) => e.missing ? `${e.id}=対象プリセットなし`
      : `${e.id}: ` + e.pairs.map((p) => `${p.label}(ja=${p.jaHit}/en=${p.enHit})`).join(' ')).join(' / '));
} else {
  console.log('SKIP i18n.claim-sync(対象に 40B の en 補完なし — 第40便 40B 未適用の root 等)');
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
    // 🌈 coolrace: 冷却速度比が Λ∝T^p の p 乗則に従う・位置不変
    // 第36便 D(台帳4-51)再較正: 主張「高温ほど速く冷える(E11 の T^p 則)」は不変で、参照量を
    // 「スピンの減り Δs(s³則・比8)」→「観測温度の減り ΔT_obs(=ΔT_int)」へ差し替えた。
    // tint モードでは冷えるのは温度でスピンではない(放射は角運動量を運ばない)。
    // T_int が 4/16/64(比4)なので dT/dt∝T^p(p=2)の理論比は 4²=16
    HP.loadPreset('coolrace', false);
    const cT = (i) => (HP.obsTemp ? HP.obsTemp(s, i)
      : 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i] * s.obsT[i] * (1 - s.lSw[i]));
    const s0 = [0, 1, 2].map(cT), x0 = [s.x[0], s.x[1], s.x[2]];
    for (let k = 0; k < 200; k++) s.step(0.016);
    const ds = [0, 1, 2].map(i => s0[i] - cT(i));
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
  // 実測(beta 2026-07-27・tint・旧etaRad=1e-5): 比=14.7 / 15.6(理論16。ずれは Float32 の T_int に対する
  // 200步のΔT が小さい〔1.4e-4〕ことによる量子化残差)。閾値は理論16に対し ±40%。
  // root(spin モード)でも同じ量(観測温度の減り)を測れば 15.9 / 15.5 で同じ閾値を通る
  // — 旧判定の「比8」はスピンの減り Δs∝s³ を見ていたためで、温度で見た法則は両モード共通
  // 第39便(原仮定者指示 C1)再較正: etaRad 1e-5→1.6e-3(冷却が遅すぎて「動かない」表示だった
  // 問題の是正)後も実測(beta 2026-07-28)は比=15.8 / 15.1 で同じ帯〔10,22〕を通過。閾値は不変
  add('new.coolrace', r.cR21 > 10 && r.cR21 < 22 && r.cR32 > 10 && r.cR32 < 22 && r.cDrift < 1e-6,
    `ratio=${r.cR21.toFixed(1)}/${r.cR32.toFixed(1)} (理論16 = T²則・p=2) drift=${r.cDrift}`);
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
    // 第50便 50F(台帳4-90・ChatGPT 4.11): 到着同時性の閾値を <8 → <0.2 に厳格化。
    // 実測 差=0.080(論文2 p2fig4.simultaneous と同値・root/beta 両対象で一致)に対し
    // 旧閾値 8 は2桁緩く「ほぼ同時」の主張を機械固定できていなかった。0.2 は実測の2.5倍
    // (光子1步の到達粒度 dt=0.016 の12倍)で、意味の変わらない範囲の余裕をみた値
    add('box.photon-abc',
      rp.log.length === 2 && !!A && !!B && !rp.nan && !rp.warn && ledger
      && Math.abs(A.z - 3) < 0.3 && Math.abs(B.z - 1) < 0.15 && dT < 0.2 && zStatic,
      (A && B)
        ? `到着2件 A(t放出=${A.tE.toFixed(1)}) z_A=${A.z.toFixed(4)}(3±0.3) λ ${A.lamE}→${A.lamO.toFixed(1)}nm a ${A.aE.toFixed(4)}→${A.aO.toFixed(4)} / `
          + `B(t放出=${B.tE.toFixed(3)}) z_B=${B.z.toFixed(4)}(1±0.15) λ ${B.lamE}→${B.lamO.toFixed(1)}nm a ${B.aE.toFixed(4)}→${B.aO.toFixed(4)} / `
          + `到着時刻 tO=${A.tO.toFixed(3)}・${B.tO.toFixed(3)} 差=${dT.toFixed(3)}(<0.2 ほぼ同時観測 — 第50便 50F で厳格化) `
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
// ----   第36便 D(台帳4-51): 参照プリセットを 🔥gas → 🪐saturn へ差し替え。主張(「既定 semi 経路は
// ----   第35便 W2 着手前と1ビットも変わらない」)は不変で、参照する代表プリセットだけを
// ----   「本便で thermal:"tint" へ移行しない側」に取り替えたもの。基準ハッシュは gas と同じ手順で
// ----   第35便 W2 の直前コミット(ea9c8a2)の beta/index.html から新規採取した実測値
// ----   (同コミットと第36便 C 完了時点=本便着手時点で🪐が bit 一致することも確認済み)。
{
  const gh = await page.evaluate(() => {
    HP.loadPreset('saturn', false);                    // 代表既定プリセット(integrator 無指定・thermal 無指定。N は 301〔〜v1.33〕/241〔4-82〜〕)
    const s = HP.sim;
    for (let k = 0; k < 300; k++) s.step(0.016);       // 300步(dt=0.016 固定 — timeScale に依存しない)
    const a = [];
    for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i]);
    return { n: s.n, t: s.t, str: a.map(v => v.toExponential(12)).join(',') };
  });
  const hash = crypto.createHash('sha256').update(gh.str).digest('hex');
  // 実装前(第35便 W2 着手時 = ea9c8a2)の実測: n=301 / t=4.800000000000003 / 下記ハッシュ
  // 第40便 40A(台帳4-81): E6′ 反作用③を倍精度アキュムレータ化したビルド(beta v1.34-b1〜)では
  // **意図的に数値経路を変更した**ため、🪐(kFrame=1 = E6′ 有効)の軌道は bit 一致しえない。
  // 対象ごとに基準を選ぶ: 旧基準は倍精度化前(= root v1.33 まで)、新基準は 40A 実装後の beta 実測。
  // 検査している不変条件(既定 integrator="semi" 経路が第35便 W2 以降の変更で動いていないこと)は
  // 変わらない — 4-81 以外の理由でこのハッシュが動いたら、それは退行として落ちる
  // 第40便 40C(台帳4-82): 🪐 の環粒子を 300→240 に減らした = **初期配置そのものを変えた**ので、
  // 4-81 とは独立にもう一段の貼り直しが要る。基準は3世代を対象ごとに選ぶ:
  //   ① 4-82 後(n=241・beta v1.34-b1〜) ② 4-81 後・4-82 前(n=301) ③ 倍精度化前(n=301・root v1.33 まで)
  // ②は本リポジトリの HEAD には現存しない中間世代だが、履歴の対応関係を残すため定数を保持する
  // (この行が動くのは 4-81/4-82 以外の退行が入ったときだけ、という関係は3世代とも同じ)
  const BASE = hasSat240
    ? '146bf72a65b92c3cb76d31e69b20cfb27083d296422749f49202c3683f5243bb'                                            // 40C(4-82・n=241)実測
    : hasE6Acc
      ? '2a04a2d69e4d7acc14a92b9ef3d5b6f9d8e366b7b292242ccae49faaa005f60f'   // 40A(倍精度化後・n=301)実測
      : '981bbeae6d274997ae2ae5d07f5b8f5297970c4ccf0dc86ac18de3d4d1a1bd6d';  // 倍精度化前(第35便 W2 着手時)
  add('integrator.default-unchanged', gh.n === satTotN && hash === BASE,
    `🪐saturn 300步 位置ハッシュ=${hash.slice(0, 16)}…(基準=${BASE.slice(0, 16)}… bit一致=${hash === BASE}) n=${gh.n}(定義=${satTotN}) ` +
    `[E6′倍精度化(4-81)=${hasE6Acc} 環240化(4-82)=${hasSat240}]`);
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
      // 第50便 50G(台帳4-91): 既定走行末尾の形状診断(boxShape が無い旧対象では null)
      out.shapeB = s.boxShape ? s.boxShape() : null;
      { const p = base(); p.physics.kRep = 0; out.A = run(p, 1200); }  // A/B の A 側 physics(圧力オフ)
      // 第50便 50G(台帳4-91): G×kRep 4象限の残り2象限(C=重力オフ / D=両オフ=慣性のみ)
      { const p = base(); p.physics.G = 0; out.C = run(p, 1200); }
      { const p = base(); p.physics.G = 0; p.physics.kRep = 0; out.D = run(p, 1200); }
      // 箱なしプリセットでは measureBox 経路が一切動かない(ゼロコスト経路の確認)
      HP.loadPreset('galaxy', false);
      out.noBox = { measureBox: s.measureBox, hist: s.boxHist, aEff: s.boxAEff(), wall: [s.wallI0, s.wallI1],
        shapeNull: (s.boxShape === undefined) || s.boxShape() === null };
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
    // ---- 第50便 50G(台帳4-91): freebox.quadrants — G×kRep 4象限の要因分離。
    // ----      実測(1200步=t19.2): 既定(1,0.5)=2.1795 加速 / (1,0)=1.005 頭打ち→再収縮
    // ----      (freebox.inertial-decel が既ゲート)/ (0,0.5)=2.1924 加速(重力の減速寄与
    // ----      Δa_eff=−0.013 と小)/ (0,0)=1.0192 慣性(加速も収縮もしない)。
    // ----      加速の源が圧力そのものであることを機械固定する ----
    add('freebox.quadrants',
      !r.C.nan && !r.D.nan
      && r.C.aLast > 2.1 && r.C.aLast < 2.3 && r.C.H2 > r.C.H1                 // 圧力のみ: 加速膨張
      && Math.abs(r.C.aLast - r.B.aLast) < 0.1                                  // 重力の減速寄与は小
      && r.D.aLast > 1.0 && r.D.aLast < 1.05                                    // 慣性のみ: 微膨張のまま
      && r.D.H1 > 0 && r.D.H2 > 0 && r.D.H2 <= r.D.H1,                          // 加速しない(H_eff 単調非増加)
      `G×kRep 4象限(1200步 a_eff): 既定(1,0.5)=${r.B.aLast.toFixed(4)}(加速) (1,0)=${r.A.aMax.toFixed(4)}頭打ち→再収縮 ` +
      `(0,0.5)=${r.C.aLast.toFixed(4)}(加速・重力寄与Δ=${(r.C.aLast - r.B.aLast).toFixed(4)}<0.1) ` +
      `(0,0)=${r.D.aLast.toFixed(4)}(慣性のみ: H_eff ${r.D.H1.toExponential(2)}→${r.D.H2.toExponential(2)} 加速せず) ` +
      `— 加速の源=圧力を4象限で機械固定`);
    // ---- 第50便 50G(台帳4-91): freebox.shape — 壁リング形状診断 sim.boxShape() の配線。
    // ----      既定1200步走行の末尾で RMS<1%・残存率100%・四重極 A2<0.05(座屈なし)。
    // ----      箱なしプリセットでは null(ゼロコスト経路)。boxShape の無い旧対象は SKIP ----
    if (r.shapeB) {
      add('freebox.shape',
        r.shapeB.rms < 0.01 && r.shapeB.keep === 1 && r.shapeB.a2 < 0.05 && r.shapeB.n === 64
        && r.noBox.shapeNull,
        `既定1200步末尾: RMS=${(r.shapeB.rms * 100).toFixed(3)}%(<1%) 残存=${(r.shapeB.keep * 100).toFixed(0)}%(=100) ` +
        `四重極A2=${r.shapeB.a2.toFixed(4)}(<0.05 座屈なし) 中央r=${r.shapeB.med.toFixed(1)} 壁n=${r.shapeB.n} / ` +
        `箱なし(galaxy)では null=${r.noBox.shapeNull}`);
    } else {
      console.log('SKIP freebox.shape(対象に sim.boxShape なし — 第50便 50G 未適用の root 等)');
    }
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

// ---- 7h1f) 第39便 39B(台帳4-73)→ 第40便 40A(台帳4-81): 高スピン合成域の保存恒等式 ----
// 背景(39B の診断・DERIVATIONS §17.9):
//   状態配列は全て Float32Array なので、E6′ 反作用パス③の
//     spin[i] -= dsn        (残余トルクの等角加速度移譲)
//     vx[j]   -= rpx/m[j]   (ソースへの反作用インパルス)
//   が Δ < |値|·2⁻²⁴ になると丸めで消える。高スピン合成系ではこの吸収だけで |ΔL|/L_scale が
//   QA 閾値 1e-3 を超える。E6′ の 0.8 飽和クランプは無罪(φ 分配は飽和時も厳密に閉じる。
//   閉じ残りの実測は相対 1.8e-6 = float32 eps 水準)。第38便 38C §3.5 の原因推定はこれで訂正済み。
//
// 【第40便 40A でのカナリア反転処理(意味変更の明記)】
//   39B は「回帰 + カナリア」の対で置いていた:
//     (a) conservation.float32-range  … 既定域(S_bh=0.12)で恒等式が閉じ続けること(回帰)
//     (b) conservation.float32-canary … 既知の破れ域(S_bh=4)で **閉じないままであること**
//         (= 主張禁止レンジが残っていることの記録)を assert するカナリア
//   台帳4-81 で③の反作用を Float64 アキュムレータへ集積するようにしたため、(b) は設計どおり
//   反転した(実測 relL: 2.130e-3 → 3.510e-6)。39B のコメントが指示していた手順に従い、
//   **(b) を回帰側へ作り替える** — 判定の向きを relL>1e-3 から relL<1e-3 へ変える。
//   これは「同じ量に対する判定の意味を逆にする」変更であり、その根拠は
//   「主張禁止レンジそのものが 4-81 で撤回された」ことにある(DERIVATIONS §17.9.4/§17.9.6・
//   PHYSICS.md の保存量モニタ節を同時更新済み)。旧カナリアが守っていた「高スピン域の破れを
//   見落とさない」という意図は、閾値を既定域と同じ 1e-3 にした回帰検査として引き継がれる。
//   倍精度化前の対象(root=v1.33 以前)では S_bh=4 は依然 relL>1e-3 なので、判定は
//   hasE6Acc(4-81 の有無)で切り替える — 旧実装に対しては旧カナリアと同一の assert が残る。
// 構成は 🕶️darkrotor v6(BH+対向2ローター)の物理・幾何をそのまま写した自己完結プリセットで、
// 恒星リングだけ 380→60 に縮約してある(内蔵プリセットの将来変更から独立させるため+実行1.3秒/本)。
// Γ(E6′ が搬送した L の累計/L_scale)は既定域で 5e-3 程度・S_bh=4 域で 0.1 以上 —
// 実測の上界は relL ≲ 0.1·Γ で、これが「主張禁止レンジ」の不変量表現になっている。
{
  const f32 = await page.evaluate(() => {
    const PRE = (spin) => ({
      id: 'qa_f32', name: 'qa_f32', description: 'QA 用(float32 カナリア)', emoji: '🧪', group: '銀河',
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 20260726,
      physics: { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 0.15, muF: 0.02, gammaN: 0.05, kappaS: 0.05, Kt: 60,
        cLight: 60, bM: 1, etaRad: 0.005, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
        pnAlpha: 1.5, radiusScale: 1, softening: 4, timeScale: 2 },
      bodies: [
        { type: 'single', rMul: 2.0, m: 2000, x: 0, y: 0, vx: 0.00114134, vy: -0.00218185, spin,
          radius: 45, lightSweep: 1, pinned: false },
        { type: 'single', rMul: 2.0, m: 150, x: 200.0, y: 0.0, vx: -0.0, vy: 3.371251, spin: 2.0,
          radius: 18, lightSweep: 1, pinned: false },
        { type: 'single', rMul: 2.0, m: 150, x: -200.0, y: 0.0, vx: 0.0, vy: -3.371251, spin: 2.0,
          radius: 18, lightSweep: 1, pinned: false },
        { type: 'ring', rMul: 2.0, n: 60, cx: 0, cy: 0, rIn: 70, rOut: 260, mMin: 0.26, mMax: 0.63,
          spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 2000, omega: 0, vNoise: 0,
          direction: 1, pinned: false }
      ], overlays: {}
    });
    // 尺度は tests/qa.mjs:1211-1220(freebox scales)と同一式
    const lScale = (s) => { let lS = 0;
      for (let i = 0; i < s.n; i++) lS += Math.abs(s.m[i] * s.x[i] * s.vy[i]) + Math.abs(s.m[i] * s.y[i] * s.vx[i])
        + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]);
      return lS; };
    const run = (spin, steps) => {
      const v = HP.validatePreset(PRE(spin));
      if (!v.ok) return { err: v.errors.join(' / ') };
      HP.sim.build(v.preset);
      const s = HP.sim, t0 = s.totals();
      for (let k = 0; k < steps; k++) s.step(0.016);
      const t1 = s.totals();
      return { n: s.n, relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / lScale(s), nan: s.hasNaN() };
    };
    return { keep: run(0.12, 8000), canary: run(4, 8000) };
  });
  // 実測(8000步・決定論的)。S_bh=0.12 / S_bh=4 の順:
  //   倍精度化前(39B 実測・v1.33 昇格後の現 root もこの値)= 5.14e-6 / 2.13e-3
  //   39B 当時の root(v1.32)                              = 2.49e-5 / 2.05e-3
  //   第40便 40A(台帳4-81)適用後の beta                    = 3.50e-6 / 3.51e-6
  add('conservation.float32-range',
    !f32.keep.err && !f32.keep.nan && f32.keep.relL < 1e-3,
    f32.keep.err ? `プリセット構築NG: ${f32.keep.err}` :
      `回帰側(既定域 S_bh=0.12・n=${f32.keep.n}・8000步): |ΔL|/L_scale=${f32.keep.relL.toExponential(2)} `
      + `(< 1e-3 — 実測 beta(4-81後) 3.50e-6 / 倍精度化前(現 root) 5.14e-6。`
      + `E6′飽和は 0.26% の頻度で発動するが恒等式は閉じる)`);
  // 第40便 40A: 旧 conservation.float32-canary を **回帰側へ作り替えた**(上のブロックコメント参照)。
  // 4-81 適用済みの対象では relL<1e-3 を、未適用の対象(root=v1.33 以前)では旧カナリアと同じ
  // relL>1e-3 を assert する。ID は履歴の追跡性のため据え置き、detail に現在の意味を書く
  add('conservation.float32-canary',
    !f32.canary.err && !f32.canary.nan && (hasE6Acc ? f32.canary.relL < 1e-3 : f32.canary.relL > 1e-3),
    f32.canary.err ? `プリセット構築NG: ${f32.canary.err}` :
      hasE6Acc
        ? `回帰側へ作り替え済み(第40便 40A・台帳4-81 — 旧カナリアの意味を反転): `
          + `高スピン合成域 S_bh=4・n=${f32.canary.n}・8000步 |ΔL|/L_scale=${f32.canary.relL.toExponential(2)} `
          + `(< 1e-3 を assert。③反作用の倍精度アキュムレータ化で 2.13e-3 → 3.51e-6 に改善し、`
          + `§17.9.4 の主張禁止レンジは撤回された。旧カナリアは「破れが直っていないこと」を固定していた)`
        : `カナリア側(倍精度化 4-81 未適用の対象 = root v1.33 以前): S_bh=4・n=${f32.canary.n}・8000步 `
          + `|ΔL|/L_scale=${f32.canary.relL.toExponential(2)} (> 1e-3 = float32 丸め吸収による既知の破れ。`
          + `beta 側は 4-81 適用済みで回帰側へ作り替え済み)`);
}

// ---- 7h1e) 第35便 W4(台帳4-54): サンプル分類バッジ — beta 先行機能(root=旧版には存在しない)。
// ----   hasEcho/hasFreebox と同方式で「機能そのものの有無」をガードにする(対象プリセットの
// ----   有無ではなく HP.classifyPreset の有無で判定)----
const hasBadgeClassify = await page.evaluate(() => typeof HP.classifyPreset === 'function');
// 第37便 A6(原仮定者裁定): drawScale 自体を廃止したため 'drawScale' in HP.sim は恒偽になった。
// 同じ第35便(台帳4-62)由来で drawScale と同様に root には無い S.echoFlipAt フィールドの有無を
// 「本便一式を含む beta」の代理指標として代わりに使う(7w/7x/7y が引き続き参照する既存ガード —
// 名称だけ差し替え。各テストの対象機能〔署名完全化・セーブ重複判定・ドラフト箱対応〕は
// drawScale と無関係のため、代理指標の中身を変えても検査意図は変わらない)
const hasEchoFlipAt = await page.evaluate(() => 'echoFlipAt' in HP.sim);

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

// ---- 4-75 E1) badge.tint: 第39便 39E — thermal:"tint" のプリセットにだけ「温度=T_int」チップが
// ----   1個追加される(classifyPreset の tint フラグ→#classChips 表示)。非 tint には出さない
// ----   (ノイズ回避 — 統括裁定)。badge.no-hscroll と同じ書式で横スクロール不在も確認する ----
if (hasBadgeClassify) {
  const hasGas = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'gas'));
  const hasGalaxy = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'galaxy'));
  if (hasGas && hasGalaxy) {
    const r = await page.evaluate(() => {
      HP.setLang('ja');   // 言語順不同への防御(直前のテストがenのまま終わっていても ja で判定する)
      const tintLabel = HP.T('bdgTint');
      const inspect = (id) => {
        HP.loadPreset(id, false);
        document.querySelector('#tabs button[data-tab=help]').click();
        const tab = document.querySelector('#page-help');
        const bad = [...tab.querySelectorAll('*')].filter((e) => e.scrollWidth > e.clientWidth + 1)
          .map((e) => `${e.tagName}#${e.id || '(no-id)'}`);
        const chips = [...document.querySelectorAll('#classChips .classChip')].map((e) => e.textContent);
        document.querySelector('#tabs button[data-tab=help]').click();
        const cls = HP.classifyPreset(HP.allPresets().find((p) => p.id === id));
        return { chips, bad, tint: cls.tint };
      };
      return { tintLabel, gas: inspect('gas'), galaxy: inspect('galaxy') };
    });
    const gasHas = r.gas.chips.includes(r.tintLabel);
    const galaxyHas = r.galaxy.chips.includes(r.tintLabel);
    add('badge.tint',
      r.gas.tint === true && gasHas && r.galaxy.tint === false && !galaxyHas
        && r.gas.bad.length === 0 && r.galaxy.bad.length === 0,
      `ラベル="${r.tintLabel}" / 🔥gas(thermal:"tint"): cls.tint=${r.gas.tint} チップ含む=${gasHas} `
      + `チップ一覧=[${r.gas.chips.join(', ')}] / 🌌galaxy(非tint): cls.tint=${r.galaxy.tint} チップ含む=${galaxyHas} `
      + `チップ一覧=[${r.galaxy.chips.join(', ')}] / 横スクロールなし(viewport 390): gas=${r.gas.bad.length === 0} galaxy=${r.galaxy.bad.length === 0}`);
  } else {
    console.log('SKIP badge.tint(対象に 🔥gas/🌌galaxy なし)');
  }
} else {
  console.log('SKIP badge.tint(対象に HP.classifyPreset なし — 第35便 W4 未適用の root 等)');
}

// ---- 4-75 E2) ui.valid-window: 第39便 39E — プリセットの任意キー validT(HUD表示専用の
// ----   「評価済み最大時間」・sim時間)。(a) validatePreset が正の有限数だけ受理し、それ以外
// ----   (0・負値・NaN・Infinity・文字列)は警告なしで静かに無視することを検査する。
// ----   (b) 🕶️darkrotor(validT=384)で sim.t が validT を超えると HUD 文字列に
// ----   " ⚠評価窓外(t>384)" が現れ、物理ハッシュ(位置・速度・スピン・半径)は窓内外で
// ----   bit一致する(=表示専用で物理へフィードバックしないことの証明)。
// ----   窓を跨ぐのに実際に24000步(383体・O(N²))を回すとQA全体が過大に遅くなるため、
// ----   少量だけ実stepさせて非自明な状態を作ったあと sim.t だけを直接書き換える
// ----   (物理配列には一切触れない — HUDの表示条件 sim.t>validT 自体のテストとして十分。
// ----   実際の24000步耐久検証は behavior.darkrotorLong 等の既存経路が別途担う)。
// ----   (c) validT の無い⏱️gclockでは t がどれだけ大きくてもマーカーが出ない ----
{
  const hasValidT = await page.evaluate(() => 'validT' in HP.sim);
  if (hasValidT) {
    const hasDarkrotor = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'darkrotor'));
    const hasGclock = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'gclock'));
    if (hasDarkrotor && hasGclock) {
      // (a) validatePreset のスキーマ検査
      const schema = await page.evaluate(() => {
        const base = () => ({ name: 'vt', description: 'd', camera: { scale: 100 },
          world: { boundary: 'none', size: 0 }, physics: {}, bodies: [] });
        const check = (label, apply) => {
          const p = base(); apply(p);
          const v = HP.validatePreset(p);
          const hasKey = v.ok && ('validT' in v.preset);
          return { label, ok: v.ok, hasKey, val: hasKey ? v.preset.validT : null,
            warnCount: v.ok ? v.warnings.length : -1 };
        };
        return [
          check('accept', (p) => { p.validT = 384; }),
          check('zero', (p) => { p.validT = 0; }),
          check('negative', (p) => { p.validT = -5; }),
          check('nan', (p) => { p.validT = NaN; }),
          check('inf', (p) => { p.validT = Infinity; }),
          check('string', (p) => { p.validT = '384'; }),
          check('omitted', () => {}),
        ];
      });
      const sByLabel = Object.fromEntries(schema.map((s) => [s.label, s]));
      const invalidLabels = ['zero', 'negative', 'nan', 'inf', 'string', 'omitted'];
      const aOk = sByLabel.accept.ok && sByLabel.accept.hasKey && sByLabel.accept.val === 384
        && sByLabel.accept.warnCount === 0
        && invalidLabels.every((l) => sByLabel[l].ok && !sByLabel[l].hasKey && sByLabel[l].warnCount === 0);

      // (b) darkrotor: 少量だけ実stepさせてから sim.t を直接動かし、窓内外のHUD・物理ハッシュを見る
      const setup = await page.evaluate(() => {
        HP.setLang('ja');   // 言語順不同への防御(マーカー文字列は ja で判定する)
        HP.loadPreset('darkrotor', false);
        const S = HP.sim;
        for (let k = 0; k < 300; k++) S.step(0.016);   // 実際に少し進めて非自明な状態にする
        const hashPhys = () => {
          const a = [];
          for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i], S.R[i]);
          return a.join(',');
        };
        const hashBefore = hashPhys();
        return { hashBefore, tBefore: S.t, validT: S.validT };
      });
      await page.waitForFunction((t) => {
        const el = document.querySelector('#hud');
        return el && el.textContent.includes(`t=${t.toFixed(1)}`);
      }, setup.tBefore, { timeout: 5000 }).catch(() => {});
      const hudInside = await page.evaluate(() => document.querySelector('#hud').textContent);
      const after = await page.evaluate((validT) => {
        const S = HP.sim;
        S.t = validT + 1;   // 表示条件 sim.t>validT だけを跨がせる(物理配列は不変)
        return S.t;
      }, setup.validT);
      const markerJa = ` ⚠評価窓外(t>${setup.validT})`;
      await page.waitForFunction((mk) => {
        const el = document.querySelector('#hud');
        return el && el.textContent.includes(mk);
      }, markerJa, { timeout: 5000 }).catch(() => {});
      const hudOutside = await page.evaluate(() => document.querySelector('#hud').textContent);
      const hashAfter = await page.evaluate(() => {
        const S = HP.sim;
        const a = [];
        for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i], S.R[i]);
        return a.join(',');
      });
      const bOk = !hudInside.includes('評価窓外') && hudOutside.includes(markerJa) && hashAfter === setup.hashBefore;

      // (c) validT の無い⏱️gclockでは t が大きくてもマーカーが出ない
      await page.evaluate(() => { HP.loadPreset('gclock', false); HP.sim.t = 100000; });
      await page.waitForFunction(() => {
        const el = document.querySelector('#hud');
        return el && el.textContent.includes('t=100000.0');
      }, null, { timeout: 5000 }).catch(() => {});
      const hudGclock = await page.evaluate(() => document.querySelector('#hud').textContent);
      const gclockValidT = await page.evaluate(() => HP.sim.validT);
      const cOk = gclockValidT === null && !hudGclock.includes('評価窓外');

      add('ui.valid-window', aOk && bOk && cOk,
        `(a)validatePreset: ${schema.map((s) => `${s.label}=${s.hasKey ? 'kept(' + s.val + ')' : 'dropped'}/warn${s.warnCount}`).join(' ')}(${aOk ? 'OK' : 'NG'}) `
        + `/ (b)🕶️darkrotor validT=${setup.validT} 窓内t=${setup.tBefore.toFixed(2)} HUD="${hudInside.replace(/\n/g, ' / ')}" `
        + `→ t=${after.toFixed(1)}へ直接進行後 HUD="${hudOutside.replace(/\n/g, ' / ')}" `
        + `マーカー有無(窓内${!hudInside.includes('評価窓外')}/窓外${hudOutside.includes(markerJa)}) 物理ハッシュ不変=${hashAfter === setup.hashBefore}(${bOk ? 'OK' : 'NG'}) `
        + `/ (c)⏱️gclock validT=${gclockValidT}(無し) t=100000でもマーカー無し=${!hudGclock.includes('評価窓外')}(${cOk ? 'OK' : 'NG'})`);
    } else {
      console.log('SKIP ui.valid-window(対象に 🕶️darkrotor/⏱️gclock なし)');
    }
  } else {
    console.log('SKIP ui.valid-window(対象に sim.validT なし — 第39便 39E 未適用の root 等)');
  }
}

// ---- 4-75/4-77 中間) 第40便 40B(台帳4-77): ui.ab-body-onetap — abBody(粒子への patch を
// ----      含むA/Bレシピ)のワンタップ化。🕶️darkrotor でボタンを実クリック → B側の対象粒子
// ----      (対向2ローター・bodies順index1/2)の spin が 0・A側の粒子配列は不変・A側の物理
// ----      ハッシュ(位置・速度・スピン・半径)も不変であることを機械検証する ----
{
  const hasDarkrotorAB = await page.evaluate(() => {
    const p = HP.allPresets().find((q) => q.id === 'darkrotor');
    return !!(p && p.abBody && Array.isArray(p.abBody.targets) && p.abBody.targets.length);
  });
  if (hasDarkrotorAB) {
    const r = await page.evaluate(() => {
      HP.loadPreset('darkrotor', false);
      const S = HP.sim;
      const hashPhys = (Sx) => { const a = []; for (let i = 0; i < Sx.n; i++) a.push(Sx.x[i], Sx.y[i], Sx.vx[i], Sx.vy[i], Sx.spin[i], Sx.R[i]); return a.join(','); };
      const preset = HP.currentPreset();
      const abBody = preset && preset.abBody;
      const targets = (abBody && abBody.targets) || [];
      const spinBeforeTargets = targets.map((i) => S.spin[i]);
      const hashBefore = hashPhys(S);
      // 第62便: beta はワンタップA/Bを #abQuickRow(A/B比較グループの上)へ統一。root は旧 #abBodyRow
      const btn = document.querySelector('#abQuickRow button, #abBodyRow button');
      const hasBtn = !!btn;
      if (hasBtn) btn.click();
      const ab = HP.ab();
      const started = !!ab;
      const simB = started ? ab.simB : null;
      const bSpinZero = started && targets.length > 0 && targets.every((i) => simB.spin[i] === 0);
      const hashAfter = hashPhys(S);
      HP.abStop();
      return { hasAbBody: targets.length > 0, hasBtn, started, bSpinZero,
        aUnchanged: hashAfter === hashBefore, targets: targets.slice(), spinBeforeTargets };
    });
    add('ui.ab-body-onetap',
      r.hasAbBody && r.hasBtn && r.started && r.bSpinZero && r.aUnchanged,
      `abBody宣言=${r.hasAbBody}(targets=[${r.targets.join(',')}] 元spin=[${r.spinBeforeTargets.join(',')}]) ` +
      `ワンタップボタン検出=${r.hasBtn} クリックでA/B開始=${r.started} B側該当粒子spin=0=${r.bSpinZero} ` +
      `A側物理ハッシュ(位置・速度・スピン・半径)不変=${r.aUnchanged}`);
  } else {
    console.log('SKIP ui.ab-body-onetap(対象に 🕶️darkrotor.abBody なし — 第40便 40B 未適用の root 等)');
  }
}

// ---- 7h1f) 第37便 A6(原仮定者裁定): drawScale(描画専用の半径倍率。第35便 W4)を廃止した。
// ----   誤解を招きやすく(粒子が実際より大きく見える)、☿等では表示が被る事例があったため。
// ----   これに伴い旧 drawscale.physics-free(物理不変性のハッシュ照合)と drawscale.schema
// ----   (validatePreset のクランプ検査)を削除する — 対象の drawScale 自体がエンジン・
// ----   validatePreset・8プリセットから完全撤去され、検査対象が存在しなくなったため
// ----   (削除に伴う設計裁定つき変更 — 詳細は scratchpad/37a-report.md)。
// ----   drawscale.legacy-ignored: 代わりにインポート互換だけを軽く確認する — 旧 JSON に
// ----   drawScale キーが残っていても validatePreset は例外を投げず ok:true、S.build() 後の
// ----   実効半径(sim.R)は drawScale の値によらず同一(物理へ一切効かない=他の未知キーと
// ----   同じ「読まれない」扱いに戻ったことの直接確認)----
{
  const dsi = await page.evaluate(() => {
    const mk = (extra) => Object.assign({
      name: 'legacy-ds', description: '旧drawScale互換', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, physics: {},
      bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true }],
    }, extra);
    const v1 = HP.validatePreset(mk({ drawScale: 3 }));
    const v2 = HP.validatePreset(mk({}));
    const s = HP.sim;
    s.build(v1.ok ? v1.preset : mk({ drawScale: 3 }));
    const rWith = s.R[0];
    s.build(v2.ok ? v2.preset : mk({}));
    const rWithout = s.R[0];
    return { ok1: v1.ok, ok2: v2.ok, rWith, rWithout };
  });
  add('drawscale.legacy-ignored',
    dsi.ok1 && dsi.ok2 && Math.abs(dsi.rWith - dsi.rWithout) < 1e-9,
    `drawScale:3 付きJSON: validatePreset ok=${dsi.ok1} 実効半径R=${dsi.rWith} / ` +
    `キー無し: ok=${dsi.ok2} 実効半径R=${dsi.rWithout}(一致=${Math.abs(dsi.rWith - dsi.rWithout) < 1e-9} — 廃止後は無視される)`);
}

// ---- 7h1g) 第35便 W5a(台帳4-42): 専用挙動QAの無かった6サンプルを補強
// ----   (gas/pressure/conduction/phase/blens/boxbound。全て root(v1.31)・beta 双方に既存の
// ----   内蔵プリセットなので、専用ガード無しで両対象に実行する。閾値は全て実測(2026-07-26・beta)
// ----   から余裕を持って確定し、下の各コメントに実測値を記録した(詳細: scratchpad/w5ab-report.md)。
// ----   6件合計の実測所要時間は約14s(gas/pressure/phaseがn=195〜240のため、design memoの想定
// ----   「nが小さいので+10s」より重いが、+20sの上限内なので !FAST 化はしていない)----
{
  // 🔥gas: 左右で異なる初期温度が接触・伝導(muF/gammaN/kappaS)で熱平衡化し、温度の粒子間分散が
  // 縮小する。G=0・kFrame=0で純粋に熱過程だけの統制実験。
  // 第36便 D(台帳4-51)再較正: 主張「温度の粒子間分散が明確に縮小する」は不変で、参照量を
  // 「T=½IS²」→「観測温度 T_obs(HP.obsTemp = 表示系と同じ量。tint モードでは T_int)」へ差し替え、
  // 步数を 3000→6000 とした(伝導が熱容量重みになり分散の減り方が緩やかなため。閾値も 0.8→0.75)
  const gas = await page.evaluate(() => {
    const s = HP.sim;
    // 観測温度 T_obs。Wave D 未適用の対象(root)では従来式 ½IS²·obsT·(1−lSw) にフォールバックする
    // (どちらも「表示系が示す温度」— 主張は同一で、参照するデータ源だけがモードに追随する)
    const To = (i) => (HP.obsTemp ? HP.obsTemp(s, i)
      : 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i] * s.obsT[i] * (1 - s.lSw[i]));
    const varTemp = () => {
      let sum = 0, sum2 = 0;
      for (let i = 0; i < s.n; i++) { const t = To(i); sum += t; sum2 += t * t; }
      const mean = sum / s.n; return sum2 / s.n - mean * mean;
    };
    HP.loadPreset('gas', false);
    const v0 = varTemp();
    for (let k = 0; k < 6000; k++) s.step(0.016);
    return { v0, v1: varTemp(), nan: s.hasNaN(), tint: s.thermal === 'tint' };
  });
  // 実測(beta 2026-07-27・tint): v0=9.7344 → 6000步後 v1=6.2340(比0.6404)。無変化=比1.0 に対し
  // 閾値0.75は実測に1.17倍・帰無側に1.33倍の余裕(比の判定なので上限1が帰無仮説)。
  // root(spin モード・Wave D 未適用)の同条件実測は 5.6473→2.7400(比0.4852)で同じ閾値を通る
  add('behavior.gas', !gas.nan && gas.v1 < gas.v0 && gas.v1 / gas.v0 < 0.75,
    `温度分散(T_obs) 初期=${gas.v0.toFixed(3)} → 6000步後=${gas.v1.toFixed(3)}(比=${(gas.v1 / gas.v0).toFixed(3)} < 0.75 — 実測 tint 0.640 / spin 0.485)${gas.tint ? ' tint' : ' spin'}`);
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
    + `成長量比=${((pr.defRatio - 1) / (pr.zeroRatio - 1)).toFixed(2)}倍(閾値2倍以上 — 実測 tint 11.63倍 / spin 3.59倍)`);
}

{
  // 📏conduction: 固定(pinned)の加熱端から伝導(E10′)だけで熱が伝わる。pinned粒子は
  // beta/index.html の②粒子ループ(if(pinned[i]) continue;)を素通りするため拡散が適用されず、
  // 加熱端の温度は不変(理想的な熱浴)。
  // 加熱端と遠端(index17・距離153)の温度差ΔTは時間とともに減衰し、中間時点では近い粒子ほど先に温まる。
  // 第36便 D(台帳4-51)再較正: 主張は不変で、参照量を「T=½IS²」→「観測温度 T_obs(HP.obsTemp)」へ
  // 差し替えた(加熱端は spin=8 → tInt=64 の固定粒子になった)。閾値は据え置きで全て通る
  const cd = await page.evaluate(() => {
    const s = HP.sim;
    const T = (i) => (HP.obsTemp ? HP.obsTemp(s, i)
      : 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i] * s.obsT[i] * (1 - s.lSw[i]));
    HP.loadPreset('conduction', false);
    const dT0 = T(0) - T(17);
    // 第51便 51D: 行別の列熱・前線(HUD hudConduction と同一式)。行 = pinned 熱浴と同じ y
    const rowStat = () => {
      const rows = [];
      for (let i = 0; i < s.n; i++) if (s.pinned[i]) rows.push({ y: s.y[i], bx: s.x[i], front: 0, heat: 0, gap: 1e9 });
      for (const r of rows) for (let i = 0; i < s.n; i++) {
        if (s.pinned[i] || Math.abs(s.y[i] - r.y) > 10) continue;
        const Ti = T(i), d = Math.abs(s.x[i] - r.bx);
        r.heat += Ti; if (Ti > 4 && d > r.front) r.front = d;
        if (d > 1e-9 && d < r.gap) r.gap = d;
      }
      rows.sort((a, b) => a.gap - b.gap);
      return rows;
    };
    let mid = null, rows4k = null;
    for (let k = 0; k < 20000; k++) { s.step(0.016);
      if (k === 3999) { mid = { T1: T(1), T9: T(9), T17: T(17) }; rows4k = rowStat(); } }
    return { Th0: T(0), dT0, mid, rows4k, condHud: s.condHud === undefined ? null : !!s.condHud,
      Thf: T(0), T17f: T(17), nan: s.hasNaN() };
  });
  const dTf = cd.Thf - cd.T17f;
  // 第51便 51D(原仮定者指示「速さの違いが分からない」): 行別の実測を判定へ追加 —
  // 密な列(間隔9)の前線が疎な列(間隔18)より先へ届き、列の熱も claims 窓(2.125〜2.875)
  // 内の比で多いこと。condHud(HUD表示の配線)は beta のみ(root は null で判定対象外)
  const rr = cd.rows4k;
  const rowsOk = rr && rr.length === 2 && rr[0].front > rr[1].front
    && rr[1].heat > 0 && (rr[0].heat / rr[1].heat) > 2.125 && (rr[0].heat / rr[1].heat) < 2.875
    && (cd.condHud === null || cd.condHud === true);
  // 第39便(原仮定者指示 C2)再較正: kappaS 1.5→0.3(伝導が速すぎて実時間10秒で列全体が
  // ほぼ均一化していた問題の是正)に伴い、同一の生ステップ数(20000步)で見た拡散の進み方が
  // 約1/5遅くなったため、閾値のみ実測に合わせて更新(判定の向き・ステップ数・主張は不変)。
  // 実測(beta 2026-07-28・tint・kappaS=0.3): 加熱端 T_obs=64(不変)。4000步時点で近接(dist9)
  // T1=27.82 > 中位(dist81)T9=4.88 > 遠端(dist153)T17=2.28(距離依存は維持)。
  // ΔT(加熱端−遠端)は初期64 → 20000步後43.62(比0.682)。閾値0.75は実測の約1.10倍上
  add('behavior.conduction',
    !cd.nan && cd.Th0 === cd.Thf && cd.mid.T1 > cd.mid.T9 && cd.mid.T9 > cd.mid.T17 && dTf / cd.dT0 < 0.75
    && rowsOk,
    `加熱端T=${cd.Th0.toFixed(1)}(不変) 中間(4000步) 近接T1=${cd.mid.T1.toFixed(1)} > 中位T9=${cd.mid.T9.toFixed(1)} `
    + `> 遠端T17=${cd.mid.T17.toFixed(1)}(距離依存) / ΔT 初期=${cd.dT0.toFixed(1)} → 20000步後=${dTf.toFixed(1)}`
    + `(比=${(dTf / cd.dT0).toFixed(3)} < 0.75 — 実測0.682。第39便 kappaS 1.5→0.3 再較正)`
    + (rr ? ` / 行別(4000步): 前線 間隔${Math.round(rr[0].gap)}=${Math.round(rr[0].front)} > 間隔${Math.round(rr[1].gap)}=${Math.round(rr[1].front)} `
      + `列熱比=${(rr[0].heat / rr[1].heat).toFixed(2)}(窓2.125〜2.875・claims 連動) condHud=${cd.condHud}` : ''));
}

{
  // 🧊phase: 質量・数・大きさ・初速が同一の3群(0-64低温/65-129中温/130-194高温)を一様重力gravityY
  // (+y方向、実測ではy増加=下)の下に置く。主張は「低温ほど重力に束縛されて底で固まり、高温ほど
  // 熱の斥力が重力を振り切って箱に充満する」= 三態の順序。
  // 第36便 D(台帳4-51)再較正: 主張は不変で、参照量を差し替えた。旧判定は3群すべてを「平均y」で
  // 見ていたが、固体と液体の区別に平均yを使うのは移行後は成立しない — 伝導が熱量保存になった結果
  // 固体側も衝突散逸(E9)で温まり、コンパクトな塊(重心=床−塊の半径)と薄く広がった液面(重心=床−厚み/2)の
  // 幾何で平均yの大小が入れ替わるため(実測: 低温76.65 / 中温76.95 と符号が安定しない)。
  // そこで「固体 vs 液体」は接触数(結晶性 — 説明文の『粒同士が接触したまま底で結晶化する固体』そのもの)、
  // 「液体 vs 気体」は従来どおり平均y(沈み込み)に鉛直方向の広がり(充満)を足して判定する
  const ph = await page.evaluate(() => {
    const s = HP.sim;
    const meanY = (i0, i1) => { let a = 0; for (let i = i0; i < i1; i++) a += s.y[i]; return a / (i1 - i0); };
    const sdY = (i0, i1) => { let a = 0, b = 0; for (let i = i0; i < i1; i++) { a += s.y[i]; b += s.y[i] * s.y[i]; }
      const n = i1 - i0, mu = a / n; return Math.sqrt(Math.max(0, b / n - mu * mu)); };
    // 1粒子あたりの接触数(結晶性)。接触=中心間距離 < R_i+R_j(エンジンの E9 接触判定と同一式)
    const contacts = (i0, i1) => { let c = 0;
      for (let i = i0; i < i1; i++) for (let j = i + 1; j < i1; j++)
        if (Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]) < s.R[i] + s.R[j]) c++;
      return 2 * c / (i1 - i0); };
    if (!HP.allPresets().some(q => q.id === 'phase')) return { gone: true };   // 第60便: beta では廃止
    HP.loadPreset('phase', false);
    for (let k = 0; k < 5000; k++) s.step(0.016);
    return { cold: meanY(0, 65), med: meanY(65, 130), hot: meanY(130, 195),
      cC: contacts(0, 65), mC: contacts(65, 130), hC: contacts(130, 195),
      mS: sdY(65, 130), hS: sdY(130, 195),
      nan: s.hasNaN(), n: s.n, tint: s.thermal === 'tint' };
  });   // tint=false の対象(root)では下の else 側=旧判定(平均yの三段順序)を使う
  // 実測(beta 2026-07-27・tint): 5000步後 接触数/粒子 低温=2.09 / 中温=0.00 / 高温=0.00、
  // 平均y 中温=76.95 高温=59.07(差17.9)、鉛直の広がり(標準偏差)中温=19.7 高温=133.2(6.8倍)。
  // 閾値は 低温接触>1.0(実測の2.1倍下)・低温接触>中温接触+1.0・中温y>高温y+10(実測の1.8倍下)・
  // 高温広がり>中温広がりの3倍(実測6.8倍 = 2.25倍の余裕)
  // 閾値は 低温接触>0.8(5000步実測2.09=2.6倍・4000〜7000步でも最小1.08=1.35倍)・
  // 低温接触>中温接触+0.8・中温y>高温y+10(実測17.9=1.8倍。4000步はまだ全体が落下中の過渡で
  // 5000步以降で単調に成立)・高温広がり>中温広がりの3倍(実測6.8倍 = 2.25倍の余裕)。
  // Wave D 未適用の対象(root=スピン=熱モード)では旧判定(平均yの三段順序)をそのまま使う
  if (ph.gone) {
    console.log('SKIP behavior.phase(🧊形態アナロジーは第60便で廃止 — root のみ対象)');
  } else if (ph.tint) {
    add('behavior.phase', !ph.nan && ph.n === 195
      && ph.cC > 0.8 && ph.cC > ph.mC + 0.8 && ph.med > ph.hot + 10 && ph.hS > 3 * ph.mS,
      `5000步後 接触数/粒子: 低温=${ph.cC.toFixed(2)}(>0.8・結晶化した固体) 中温=${ph.mC.toFixed(2)} ` +
      `高温=${ph.hC.toFixed(2)} / 平均y(+y=下) 中温=${ph.med.toFixed(2)} 高温=${ph.hot.toFixed(2)}` +
      `(差=${(ph.med - ph.hot).toFixed(2)}>10 — 液体は底に溜まり気体は沈まない) / 鉛直の広がり ` +
      `中温=${ph.mS.toFixed(1)} 高温=${ph.hS.toFixed(1)}(${(ph.hS / ph.mS).toFixed(1)}倍>3 — 気体は箱に充満)`);
  } else {
    add('behavior.phase', !ph.nan && ph.n === 195 && ph.cold > ph.med + 0.5 && ph.med > ph.hot + 10,
      `5000步後の平均y(+y=下): 低温=${ph.cold.toFixed(2)} 中温=${ph.med.toFixed(2)}(低温−中温=` +
      `${(ph.cold - ph.med).toFixed(2)}>0.5) 高温=${ph.hot.toFixed(2)}(中温−高温=${(ph.med - ph.hot).toFixed(2)}>10) ` +
      `— 低スピン層ほど底側(スピン=熱モード・旧判定)`);
  }
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

// ---- 50C) 第50便 50C(台帳4-87): 🧭probeH — 二つのH推定器。HUD が表示する累積測定
// ----      (t=0基準・指数読み/反比例読み)と同じ式を sim 状態から計算し、a=2 で
// ----      ①指数読みが解析 2(D/Kt)(1−1/a)/ln a と 1e-2 以内で一致(V29 と同じ許容)
// ----      ②反比例読み(4-66 対照)が恒等 1 に 1e-2 以内 ③sim.probeHud の配線
// ----      (w0 退避)が生きていること、を機械検証する。probeH プリセットの claims 窓
// ----      (1.32〜1.347 / 0.99〜1.01)はこの実測に直結する。プリセットが無い対象
// ----      (root 等)は SKIP ----
{
  const hasProbeH = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'probeH'));
  if (hasProbeH) {
    const r = await page.evaluate(() => {
      const s = HP.sim;
      HP.loadPreset('probeH', false);
      if (!s.probeHud || !s.box) return { wired: false };
      const B = s.box, Kt = s.params.Kt, dkt = B.D / Kt;
      // a=2 まで規定 exp 膨張を進める(t=ln2/H0)
      const steps = Math.ceil(Math.log(2) / B.H0 / 0.016);
      for (let k = 0; k < steps; k++) s.step(0.016);
      const sc = boxScaleAt(s.box, s.t);
      const w = Math.hypot(s.vx[0] - sc.H * (s.x[0] - B.cx), s.vy[0] - sc.H * (s.y[0] - B.cy));
      const lnA = Math.log(sc.a), adp = Math.pow(sc.a, -B.dPower);
      const lnW = Math.log(w / s.probeHud.w0);
      return { wired: true, dkt, a: sc.a, w0: s.probeHud.w0, w,
        rExp: (2 * dkt * (1 - adp) - lnW) / lnA,
        rInv: B.dPower - lnW / lnA,
        ana: 2 * dkt * (1 - adp) / lnA,
        nan: s.hasNaN() };
    });
    // 実測(2026-07-30): a=2.0000 で 指数読み=1.3338(解析1.3335・相対誤差2.4e-4)・
    // 反比例読み=1.0003・w保存ずれ3.2e-4 — 説明文の 1.333 / 1.000 と claims 窓に一致
    add('behavior.probeH', r.wired && !r.nan
      && Math.abs(r.rExp / r.ana - 1) < 1e-2
      && Math.abs(r.rInv - 1) < 1e-2
      && Math.abs(r.w / r.w0 - 1) < 1e-3,
      r.wired
        ? `D/Kt=${r.dkt.toFixed(4)} a=${r.a.toFixed(4)}: 指数読み=${r.rExp.toFixed(4)}(解析${r.ana.toFixed(4)}・`
          + `相対誤差${Math.abs(r.rExp / r.ana - 1).toExponential(1)}<1e-2) 反比例読み=${r.rInv.toFixed(4)}(|−1|<1e-2) `
          + `w保存ずれ=${Math.abs(r.w / r.w0 - 1).toExponential(1)}(<1e-3)`
        : 'probeHud の配線(sim.probeHud/sim.box)が生きていない');
  } else {
    console.log('SKIP behavior.probeH(対象に probeH プリセットなし — 第50便 50C 未適用の root 等)');
  }
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
    // v1.24: mach 廃止に伴い、熱浴検出は convection で検査。第36便 D で「固定ヒーター spin>0」→
    // 「固定ヒーター tInt>0」、第37便 C1(台帳4-70)で「伝熱する箱 world.thermalWalls」へ検出源が
    // 移った(主張「外部から熱を与えている系は熱浴として検出される」は3世代とも同一)
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
    const headOk = actGroup && actGroup.querySelector('h3').textContent === 'このサンプルの主役';
    // 主役行の編集が反映される(先頭= muF)
    const inp = actGroup.querySelector('.prow input.valIn');
    inp.value = '0.33'; inp.dispatchEvent(new Event('change'));
    const editOk = Math.abs(HP.sim.params.muF - 0.33) < 1e-12;
    const total = HP.PARAM_DEFS.filter(d => d.key !== 'timeScale').length;
    // 第57便 57C: 「詳細設定(全パラメータ)」は廃止 — 7カテゴリ直列。全キーがカテゴリ内に
    // 1行ずつある(ラベル一致)ことを検査する。旧レイアウト(root=advParams)とも両立
    const cat57 = !det && !!document.querySelector('#paramRows details.catParams');
    let detRows, nRest, detOpen;
    if (cat57) {
      const catLabels = [...document.querySelectorAll('#paramRows details.catParams .prow label')].map(l => l.textContent);
      const missing = HP.PARAM_DEFS.filter(d => d.key !== 'timeScale' && d.key !== 'timeScale')
        .filter(d => !catLabels.includes(d.label)).map(d => d.key);
      detRows = total - missing.length; nRest = total;
      detOpen = [...document.querySelectorAll('#paramRows details.catParams')].some(d2 => d2.open);
    } else {
      detRows = det ? det.querySelectorAll('.prow').length : 0;
      const cat54 = !!(det && det.querySelector('details.catParams'));
      nRest = cat54 ? total : total - act.length;
      detOpen = det ? det.open : true;
    }
    return { bad, actRows, nAct: act.length, detRows, nRest, cat57, detOpen, headOk, editOk };
  });
  add('activeParams.all', r1.bad.length === 0, r1.bad.join(',') || '全内蔵で宣言済み');
  add('activeParams.ui', r1.headOk && r1.actRows === r1.nAct && r1.detRows === r1.nRest
    && r1.detOpen === false && r1.editOk,
    `主役${r1.actRows}/${r1.nAct}行 カテゴリ内${r1.detRows}/${r1.nRest}キー(57C 7カテゴリ版=${r1.cat57} — 主役重複込み) 全カテゴリ閉=${r1.detOpen === false} 編集反映=${r1.editOk}`);

  // ---- 第54便 54D(原仮定者指示 アプリ7件): 前回プリセット復元 / プルダウン階層化 / pdesc色 /
  // ----   主役の詳細重複+同期 / カテゴリ折りたたみ / 相変化スライダー / 壁温色 ----
  const has54d = await page.evaluate(() => !!document.querySelector('#presetGroupSelect'));
  if (has54d) {
    const d1 = await page.evaluate(() => {
      const out = {};
      const gs = document.querySelector('#presetGroupSelect');
      out.groupOpts = [...gs.options].map(o => o.value);
      // ② カテゴリ絞り込み → 一覧が絞られ、カテゴリ外だった現行は先頭項目の自動ロードで置換
      HP.loadPreset('saturn', false);
      gs.value = '熱の実験室'; gs.dispatchEvent(new Event('change'));
      out.filtered = { preset: HP.currentPreset().id,
        opts: [...document.querySelectorAll('#presetSelect option')].map(o => o.value) };
      out.filteredAllInCat = out.filtered.opts.every(v => {
        const p = HP.allPresets().find(q => q.id === v); return p && p.group === '熱の実験室'; });
      // 絞り込み外のプリセットをコードから読込 → 「全カテゴリ」へ自動復帰して同期
      HP.loadPreset('saturn', false);
      out.backToAll = { gsVal: gs.value, selVal: document.querySelector('#presetSelect').value };
      // ① 前回プリセットの記録(復元側は別ページの boot で検査)
      out.lastStored = localStorage.getItem('hp_last_preset');
      // ③ 開いた説明(pdesc)の文字色 = 本文色(--fg。従来の --dim は読みにくい)
      const lab = document.querySelector('#paramRows .prow label.tappable');
      lab.click();
      const pd = document.querySelector('#paramRows .pdesc');
      out.pdescColor = getComputedStyle(pd).color;
      out.labColor = getComputedStyle(lab).color;
      lab.click();
      // ④ 主役キーの詳細重複と相互同期(saturn 主役筆頭 muF — 主役行+詳細行の2行)
      const muRows = [...document.querySelectorAll('#paramRows .prow')]
        .filter(r => r.querySelector('input[type=range]') && (r.querySelector('label') || {}).textContent
          && r.querySelector('label').textContent.includes('摩擦'));
      out.dupCount = muRows.length;
      if (muRows.length >= 2) {
        const i0 = muRows[0].querySelector('input.valIn'), i1 = muRows[1].querySelector('input.valIn');
        i0.value = '0.44'; i0.dispatchEvent(new Event('change'));
        out.dupSync = Math.abs(HP.sim.params.muF - 0.44) < 1e-12 && i1.value === '0.44';
      }
      // ⑤ カテゴリ折りたたみ: 法則/シミュレーション(詳細設定内)+表示が catParams で全て閉
      const cats = [...document.querySelectorAll('#paramRows details.catParams')];
      out.catSums = cats.map(d => (d.querySelector('summary').firstChild.textContent || '').trim());
      out.catsClosed = cats.every(d => !d.open);
      // ⑥ 相変化スライダー(melt): 全行にスライダー+スライダー編集反映+スライダー域外の直値
      HP.loadPreset('emergent2', false);
      const pcDet = [...document.querySelectorAll('#paramRows details.catParams')]
        .find(d => (d.querySelector('summary').textContent || '').includes('相変化'));
      const rows = pcDet ? [...pcDet.querySelectorAll('.prow')] : [];
      out.pcRows = rows.length;
      out.pcSliders = rows.filter(r => r.querySelector('input[type=range]')).length;
      const rng = rows[0].querySelector('input[type=range]');   // 第60便: 先頭行= bondN
      rng.value = '1.5'; rng.dispatchEvent(new Event('input'));
      out.pcSliderEdit = HP.sim.phase.bondN === 1.5;
      const num = rows[0].querySelector('input.valIn');
      num.value = '50'; num.dispatchEvent(new Event('change'));   // スライダー域(8)超の直値 → hi=12 へクランプ
      out.pcDirectBeyond = HP.sim.phase.bondN === 12;
      HP.loadPreset('saturn', false);
      return out;
    });
    // ⑦ 壁温色(描画関数内部のため静的検査): drawThermalWallBox の heat 分岐が
    //    実効壁温(T2/tSwitch 込み)を tempColor へ渡している
    const htmlSrc = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
    const wallFn = (htmlSrc.match(/function drawThermalWallBox\(([\s\S]*?)\n\}/) || [''])[0];
    const wallColorOk = /tSwitch/.test(wallFn) && /tempColor\(/.test(wallFn);
    // ① 前回プリセット復元: 新規ページ(別コンテキスト)の localStorage へ boot 前に
    //    hp_last_preset=melt を仕込み(addInitScript)、起動が melt を復元することを確認
    const p54 = await browser.newPage();
    await p54.addInitScript(() => { try { localStorage.setItem('hp_last_preset', 'emergent2'); } catch (_) {} });
    await p54.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
    await p54.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
    const restored = await p54.evaluate(() => HP.currentPreset().id);
    await p54.close();
    add('ui.54d-preset-nav',
      d1.groupOpts[0] === 'all' && d1.groupOpts.length >= 7
      && d1.filteredAllInCat && d1.filtered.opts.length > 0 && d1.filtered.opts.includes(d1.filtered.preset)
      && d1.backToAll.gsVal === 'all' && d1.backToAll.selVal === 'saturn'
      && d1.lastStored === 'saturn' && restored === 'emergent2',
      `カテゴリ選択肢=${d1.groupOpts.length}(先頭=all) 絞り込み(熱の実験室)=${d1.filtered.opts.length}件・全て域内=${d1.filteredAllInCat}・先頭自動ロード=${d1.filtered.preset} / ` +
      `域外読込で全カテゴリへ復帰=${d1.backToAll.gsVal === 'all'} / hp_last_preset=${d1.lastStored} / 仕込み emergent2 → 別ページ boot 復元=${restored}`);
    add('ui.54d-params',
      d1.pdescColor === d1.labColor
      && d1.dupCount === 2 && d1.dupSync === true
      && d1.catSums.some(t => t.includes('時空')) && d1.catSums.some(t => t.includes('スピン・熱'))
      && d1.catSums.some(t => t.includes('引きずり')) && d1.catSums.some(t => t.includes('実験箱'))
      && d1.catSums.some(t => t.includes('シミュレーション')) && d1.catSums.some(t => t.includes('表示'))
      && d1.catsClosed
      && d1.pcRows === 8 && d1.pcSliders === d1.pcRows && d1.pcSliderEdit && d1.pcDirectBeyond
      && wallColorOk,
      `pdesc色=本文色(${d1.pdescColor}) / 主役重複=2行・同期=${d1.dupSync} / カテゴリ=[${d1.catSums.join(',')}]・全閉=${d1.catsClosed} / ` +
      `相変化: ${d1.pcSliders}/${d1.pcRows}行にスライダー・編集反映=${d1.pcSliderEdit}・域外直値=${d1.pcDirectBeyond} / 壁温色(tempColor+tSwitch)=${wallColorOk}`);

    // ---- 第57便 57C: 実験箱カテゴリ(壁4面+一様重力)・タブ別スクロール・開閉保持 ----
    const d57 = await page.evaluate(() => {
      const out = {};
      HP.loadPreset('emergent2', false);
      const cats = [...document.querySelectorAll('#paramRows details.catParams')];
      const labBox = cats.find(d => (d.querySelector('summary').textContent || '').includes('実験箱'));
      out.hasLab = !!labBox;
      if (labBox) {
        const rows = [...labBox.querySelectorAll('.prow')];
        // emergent2: 壁8行(4面×T/レート — rad なし)+ 一様重力 g_x/g_y。
        // 第79便(原仮定者指示)で g_x/g_y は「時空」カテゴリへ移したので、移動後は 8 行・
        // 移動前(root 昇格前)は 10 行。どちらの配置かを実測して期待値を決める
        out.labRows = rows.length;
        out.gravInLab = /一様重力/.test(labBox.textContent);
        const stBox = [...document.querySelectorAll('#paramRows details.catParams')]
          .find(d => (d.querySelector('summary').textContent || '').includes('時空'));
        out.gravInSt = !!stBox && /一様重力 g_x/.test(stBox.textContent) && /一様重力 g_y/.test(stBox.textContent);
        // 未設定の面(天井=idx1)のレートを編集 → {mode:"heat",rate} が生成される。T=0/rate=0 は物理不変
        const rateRow = rows.find(r => (r.querySelector('label') || {}).textContent === (HP.T ? HP.T('pcWallRate')('天井') : '壁レート(天井)'));
        out.hasTopRate = !!rateRow;
        if (rateRow) {
          const inp = rateRow.querySelector('input.valIn');
          inp.value = '0.5'; inp.dispatchEvent(new Event('change'));
          const w = HP.sim.twall[1];
          out.created = !!(w && w.mode === 'heat' && Math.abs(w.rate - 0.5) < 1e-12);
          inp.value = '0'; inp.dispatchEvent(new Event('change'));   // 後続ゲートのため戻す
          out.reset0 = HP.sim.twall[1].rate === 0;
        }
      }
      // 57B: カテゴリ開閉の保持 — 実験箱を開いて再構築(プリセット再読込)しても開いたまま
      if (labBox) { labBox.open = true; }
      HP.loadPreset('emergent2', false);
      const labBox2 = [...document.querySelectorAll('#paramRows details.catParams')]
        .find(d => (d.querySelector('summary').textContent || '').includes('実験箱'));
      out.keptOpen = !!(labBox2 && labBox2.open);
      if (labBox2) labBox2.open = false;
      HP.loadPreset('saturn', false);
      // 57B: タブ別スクロール管理のコードが配線されている(静的確認は下の wallColorOk と同様の方針)
      return out;
    });
    const htmlSrc57 = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
    const tabScrollOk = /tabScroll\[curTab\]=\$\("#panel"\)\.scrollTop/.test(htmlSrc57)
      && /\$\("#panel"\)\.scrollTop=tabScroll\[t\]\|\|0/.test(htmlSrc57);
    const want57 = d57.gravInLab ? 10 : 8;   // 第79便: g_x/g_y の所在で期待行数が変わる
    add('ui.57c-labbox',
      d57.hasLab && d57.labRows === want57 && (d57.gravInLab || d57.gravInSt)
      && d57.hasTopRate && d57.created === true && d57.reset0 === true
      && d57.keptOpen === true && tabScrollOk,
      `実験箱カテゴリ=${d57.hasLab}・行数=${d57.labRows}(期待${want57}=壁4面×2${d57.gravInLab ? '+g_x/g_y' : ''}) / ` +
      `一様重力の所在=${d57.gravInLab ? '実験箱(従来)' : '時空(第79便)'}・時空に有=${d57.gravInSt} / 未設定面の編集で生成=${d57.created}(レート0へ復帰=${d57.reset0} — 物理不変) / ` +
      `再構築後もカテゴリ開いたまま=${d57.keptOpen}(57B) / タブ別スクロール配線=${tabScrollOk}`);

    // ---- 第58便 58B: ①⏮初めから で相変化ノブ・壁温/壁レート編集を保持(h 正本のまま
    // ---- 温度・相率を再導出)②rad 面(♨️天井など)にも壁温・壁レート行 — T>0 編集で heat 変換 ----
    const d58 = await page.evaluate(() => {
      const out = {};
      // ① emergent2 で相変化ノブ(bondN/condN)+底壁 T+未設定面(天井)を編集 → ⏮
      // (第60便: 相率の再導出は機構ごと廃止 — ノブ保持と壁保持だけを検査する)
      HP.loadPreset('emergent2', false);
      let s = HP.sim;
      s.phase.bondN = 4.5; s.phase.condN = 5;
      s.twall[0].T = 0.9;
      s.twall[1] = { mode: 'heat', T: 0.4, rate: 0.2 };
      document.getElementById('btnReset').click();
      s = HP.sim;
      out.keepPhase = Math.abs(s.phase.bondN - 4.5) < 1e-12 && Math.abs(s.phase.condN - 5) < 1e-12;
      out.keepWall = !!(s.twall[0] && Math.abs(s.twall[0].T - 0.9) < 1e-12);
      out.keepNew = !!(s.twall[1] && s.twall[1].mode === 'heat'
        && Math.abs(s.twall[1].T - 0.4) < 1e-12 && Math.abs(s.twall[1].rate - 0.2) < 1e-12);
      // ② convection(天井=rad)で壁行が4面すべて出る+rad 面の T>0 編集は heat へ変換(レート保持)
      HP.loadPreset('convection', false);
      const lab = [...document.querySelectorAll('#paramRows details.catParams')]
        .find(d => (d.querySelector('summary').textContent || '').includes('実験箱'));
      const rows = lab ? [...lab.querySelectorAll('.prow')] : [];
      out.convRows = rows.length;
      out.convGravInLab = !!lab && /一様重力/.test(lab.textContent);   // 第79便: 時空へ移動済みなら false
      const tRow = rows.find(r => (r.querySelector('label') || {}).textContent === (HP.T ? HP.T('pcWallT')('天井') : '壁温(天井)'));
      out.hasTopT = !!tRow;
      if (tRow) {
        const w0 = HP.sim.twall[1]; out.topWasRad = !!(w0 && w0.mode === 'rad'); const rate0 = w0 ? w0.rate : 0;
        const inp = tRow.querySelector('input.valIn');
        inp.value = '1.2'; inp.dispatchEvent(new Event('change'));
        const w1 = HP.sim.twall[1];
        out.radConv = !!(w1 && w1.mode === 'heat' && Math.abs(w1.T - 1.2) < 1e-12 && Math.abs(w1.rate - rate0) < 1e-12);
      }
      HP.loadPreset('saturn', false);
      return out;
    });
    const want58 = d58.convGravInLab ? 10 : 8;   // 第79便: g_x/g_y の所在で期待行数が変わる
    add('ui.58b-reset-keep',
      d58.keepPhase && d58.keepWall && d58.keepNew
      && d58.convRows === want58 && d58.hasTopT && d58.topWasRad === true && d58.radConv === true,
      `⏮保持: 相変化ノブ(bondN/condN)=${d58.keepPhase}・既存壁=${d58.keepWall}・新設面=${d58.keepNew} / ` +
      `rad面: convection 実験箱行=${d58.convRows}(期待${want58} — 4面すべて表示${d58.convGravInLab ? '+g_x/g_y' : '。一様重力は時空へ移動〔第79便〕'})・天井(rad)T編集→heat変換(レート保持)=${d58.radConv}`);

    // ---- 第61便 61B(レビューP1): チェックポイント・ワンタップ対照A/B・step/モデル時刻併記 ----
    const d61 = await page.evaluate(() => {
      const out = {};
      if (!document.getElementById('btnCkSave')) return { gone: true };
      const s = HP.sim;
      // ① チェックポイント: 保存 → 500步 → 復帰で x/t が bit 一致・プリセット読込で無効化
      HP.loadPreset('chain2', false);
      for (let k = 0; k < 300; k++) s.step(0.016);
      document.getElementById('btnCkSave').click();
      const x0 = s.x[0], t0 = s.t, w0 = s.wallEin;
      for (let k = 0; k < 500; k++) s.step(0.016);
      out.moved = s.x[0] !== x0;
      document.getElementById('btnCkLoad').click();
      out.back = s.x[0] === x0 && s.t === t0 && s.wallEin === w0;
      HP.loadPreset('chain2', false);
      out.invalidated = document.getElementById('btnCkLoad').disabled;
      // ② ワンタップ対照A/B: ボタンで A/B 開始・B 側の angK だけ 0
      const btn = document.getElementById('btnAbQuick');
      out.btn = !!btn;
      if (btn) {
        btn.click();
        out.abOn = !!HP.ab();
        out.bV = HP.ab() ? HP.ab().simB.phase.angK : null;
        out.aV = s.phase.angK;
        for (let k = 0; k < 100; k++) { s.step(0.016); HP.ab().simB.step(0.016); }
        out.abNan = s.hasNaN() || HP.ab().simB.hasNaN();
        HP.abStop();
      }
      HP.loadPreset('saturn', false);
      return out;
    });
    // ③ step/モデル時刻併記(HUD はキャンバス描画のため静的検査 — wallColorOk と同方針)
    const htmlSrc61 = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
    const hudStepOk = /Math\.round\(sim\.t\/0\.016\)\}步/.test(htmlSrc61);
    if (d61.gone) {
      console.log('SKIP ui.61b-tools(対象に第61便 61B の UI なし — root 等)');
    } else {
      add('ui.61b-tools',
        d61.moved && d61.back && d61.invalidated
        && d61.btn && d61.abOn === true && d61.bV === 0 && d61.aV === 1.2 && d61.abNan === false
        && hudStepOk,
        `チェックポイント: 500步進めて復帰=bit一致(${d61.back})・プリセット読込で無効化=${d61.invalidated} / ` +
        `ワンタップ対照A/B(chain2): B側 angK=${d61.bV}(A側=${d61.aV})・100步併走 NaNなし / HUD 步数併記(静的)=${hudStepOk}`);
    }

    // ---- 第63便(原仮定者指示): ①ワンタップA/Bのタイトル統一(相変化系書式)②粒子patch系は
    // ---- ⏮初めから で B側へ再patch(「A/B比較を終了」まで有効)③チェックポイントの A/B B側対応
    // ---- (A/B中の保存は A+B 両側・復帰も両側同時・A/B終了で無効化)----
    const d63 = await page.evaluate(() => {
      const out = {};
      if (!document.getElementById('abQuickRow')) return { gone: true };
      // ① タイトル統一: 相変化系(chain2)と粒子patch系(darkrotor)が同じ「⚖️ ワンタップ対照A/B(B側: …)」
      HP.loadPreset('chain2', false);
      const b1 = document.getElementById('btnAbQuick');
      out.t1 = b1 ? b1.textContent : '';
      HP.loadPreset('darkrotor', false);
      const b2 = document.querySelector('#abQuickRow button');
      out.t2 = b2 ? b2.textContent : '';
      const PRE = '⚖️ ワンタップ対照A/B(B側:';
      out.unified = out.t1.startsWith(PRE) && out.t2.startsWith(PRE);
      // ② darkrotor: ワンタップ → ⏮初めから → B側の対象粒子へ再patch(spin=0)・A側は保持・A/B継続
      if (b2) b2.click();
      const ab0 = HP.ab();
      out.abOn = !!ab0;
      out.bPatched0 = ab0 ? (ab0.simB.spin[1] === 0 && ab0.simB.spin[2] === 0) : false;
      document.getElementById('btnReset').click();
      const ab1 = HP.ab();
      out.stillAb = !!ab1;
      out.bRepatched = ab1 ? (ab1.simB.spin[1] === 0 && ab1.simB.spin[2] === 0) : false;
      out.aKept = ab1 ? (HP.sim.spin[1] !== 0 && HP.sim.spin[2] !== 0) : false;
      HP.abStop();
      // ③ チェックポイント A/B 両側: ワンタップA/B中に保存 → 200步 → 復帰で A/B とも bit一致
      HP.loadPreset('chain2', false);
      document.getElementById('btnAbQuick').click();
      const S = HP.sim, B = HP.ab().simB;
      for (let k = 0; k < 100; k++) { S.step(0.016); B.step(0.016); }
      document.getElementById('btnCkSave').click();
      const ax0 = S.x[0], at0 = S.t, bx0 = B.x[0], bt0 = B.t;
      for (let k = 0; k < 200; k++) { S.step(0.016); B.step(0.016); }
      out.ckMoved = S.x[0] !== ax0 || B.x[0] !== bx0;
      document.getElementById('btnCkLoad').click();
      out.ckBothBack = S.x[0] === ax0 && S.t === at0 && B.x[0] === bx0 && B.t === bt0;
      HP.abStop();
      out.ckInvalidatedOnStop = document.getElementById('btnCkLoad').disabled;
      HP.loadPreset('saturn', false);
      return out;
    });
    if (d63.gone) {
      console.log('SKIP ui.63-ab-tools(対象に第62〜63便の #abQuickRow なし — root 等)');
    } else {
      add('ui.63-ab-tools',
        d63.unified && d63.abOn && d63.bPatched0 && d63.stillAb && d63.bRepatched && d63.aKept
        && d63.ckMoved && d63.ckBothBack && d63.ckInvalidatedOnStop,
        `タイトル統一(⚖️ ワンタップ対照A/B(B側: …))=${d63.unified} / ` +
        `darkrotor: ⏮初めから後もB側へ再patch(spin=0)=${d63.bRepatched}(A/B継続=${d63.stillAb}・A側spin保持=${d63.aKept}) / ` +
        `チェックポイント: A/B中の保存→200步→復帰で両側bit一致=${d63.ckBothBack}・A/B終了で無効化=${d63.ckInvalidatedOnStop}`);
    }
  } else {
    console.log('SKIP ui.54d-*(対象に第54便 54D の UI なし — root 等)');
  }

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
    // 詳細設定(advParams)の中ではない(第54便 54D⑤: 表示グループ自体は catParams の
    // details に入ったため、details 一般ではなく advParams 限定で判定する)
    res.tsInDisplay = !tsRows[0].closest('details.advParams');
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
    `行数=${r.tsSingle ? 1 : '複数'} カテゴリ内(58B: シミュレーション)=${r.tsInDisplay} 両方反映=${r.tsBoth} activeParams残=${r.tsInAct.join(',') || 'なし'}`);
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
  // 第37便 C1(台帳4-70)再較正: 主張「床の加熱と天井の放熱で組織化した循環セルが *長時間持続* する」
  // は不変で、♨️ が伝熱する箱(world.thermalWalls)へ再設計されたのに合わせて評価を差し替えた。
  //  ・評価窓: 8000步 → **24000步**(第36便 D で「15000步以降に循環が反転しうる」ため 8000 へ退避
  //    していたが、pinned ヒーター/冷却板を全廃して壁が熱をやり取りする構成にしたことで、
  //    循環が持続し温度も定常化した ⇒ 原設計の 24000步 窓へ復帰した)
  //  ・座標系: 箱が size 190 → 60 に縮んだので循環指標(⟨x·vy−y·vx⟩)の絶対値も小さくなる。
  //    実測(beta 2026-07-27・3000步ごと): 2.2 / 9.8 / 16.2 / 21.4 / 16.9 / 23.3 / 23.1 / **24.9**、
  //    平均|v|=0.84。閾値 循環>12(実測の2.0倍下・9000步以降の最小16.2に対しても1.35倍下)・|v|>0.5。
  //  ・**定常熱流**を新たに機械判定する(本再設計の目的): 最後の3000步窓で
  //    「壁が入れた熱 ≒ 壁が回収した熱 + 壁が吸った運動E」。実測の相対差は 0.0%(9000步以降は≤1.7%)、
  //    閾値は 20%。系は開放系なので、これが成り立って初めて「定常対流」と言える。
  // root(Wave C 未適用 = pinned ヒーターの旧設計・スピン=熱モード)では壁帳簿が存在しないので、
  // 循環と平均|v|だけの旧判定(24000步・循環>5・|v|>0.3。旧実測 65.5 / 1.05)へ自動的に分岐する
  if (r.convWall) {
    add('behavior.convection',
      !r.convNaN && r.convPin === 0 && r.convCirc > 12 && r.convV > 0.5 && r.convImb < 0.2,
      `24000步(伝熱する箱・pinned=0): 循環=${r.convCirc.toFixed(1)} (>12) 平均|v|=${r.convV.toFixed(2)} (>0.5) / ` +
      `定常熱流(最後の3000步) 壁注入=${r.convQIn.toFixed(1)} 壁回収+壁吸収KE=${r.convQOut.toFixed(1)} ` +
      `相対差=${(r.convImb * 100).toFixed(1)}% (<20%)`);
  } else {
    add('behavior.convection', !r.convNaN && r.convCirc > 5 && r.convV > 0.3,
      `24000步(旧設計 pinned ヒーター・Wave C 未適用): 循環=${r.convCirc.toFixed(1)} (>5) ` +
      `平均|v|=${r.convV.toFixed(2)} (>0.3)`);
  }

  // ---- 8a2) 第66便 66B(P2 標準サンプル): 🎡galaxyStd — 空間引きずりの基準実験 ----
  // 🌌 の単一機構純化版(kRep=muF=γn=κs=0・恒星スピン0)で、E4+E6′ だけの外縁増強を機械固定する。
  // 手順・指標は claim.galaxy-outerboost(galaxyAB ユニット)と同一の A/B・同一の外縁帯式。
  // 較正実測(66A・seed 20260727・6000步): kF1/kF0 = 1.2646(中心スピンのみ 1.2646 ≈ 全スピン
  // 1.2648 / 恒星のみ 1.0215 — 主源は中心天体のコヒーレントスピン。tests/exp-scale66.mjs)。
  // 窓は claims の {1.15,1.4} と同期(claims.sync が説明文の「実測約1.26倍」と照合)
  {
    const hasStd = await page.evaluate(() => HP.allPresets().some(p => p.id === 'galaxyStd'));
    if (hasStd) {
      const r2 = await page.evaluate(() => {
        const s = HP.sim;
        HP.loadPreset('galaxyStd', false);
        HP.abStart('kFrame', 0);
        const abG = HP.ab();
        const outer = (sm) => { let sum = 0, c = 0;
          for (let i = 1; i < sm.n; i++) { const rr = Math.hypot(sm.x[i], sm.y[i]);
            if (rr >= 156 && rr <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / rr; c++; } }
          return c ? sum / c : 0; };
        for (let k = 0; k < 6000; k++) { s.step(0.016); abG.simB.step(0.016); }
        const gA = outer(s), gB = outer(abG.simB);
        const bad = s.hasNaN() || abG.simB.hasNaN();
        // 純度の機械確認: overlay は preset で ON — 6000步の窓を読む。熱斥力・結合・測地線は厳密 0
        // (接触は法線ばね〔弾性・重なり防止の芯〕が残るので 0 にはならない — 説明文と同じ整理)
        const spec = s.mechSpec(true);
        HP.abStop();
        return { gA, gB, bad, pi: spec ? spec.pi : null };
      });
      const ratio = r2.gA / r2.gB;
      // 較正実測(66A → 本経路で再現 1.2646): Π = [重力41.3, 測地線0, 熱斥力0, 接触34.2, 結合0, 引きずり24.5]%
      add('claim.galaxystd-outerboost',
        !r2.bad && ratio > 1.1 && ratio >= 1.15 && ratio <= 1.4
        && !!r2.pi && r2.pi[1] === 0 && r2.pi[2] === 0 && r2.pi[4] === 0 && r2.pi[5] > 0.15,
        `vφ外縁 kF1=${r2.gA.toFixed(3)} kF0=${r2.gB.toFixed(3)} 比=${ratio.toFixed(4)}` +
        `(窓1.15〜1.4・較正実測1.2646) / 純度Π: 測地線=${r2.pi ? r2.pi[1] : '?'} 熱斥力=${r2.pi ? r2.pi[2] : '?'} ` +
        `結合=${r2.pi ? r2.pi[4] : '?'}(厳密0)・引きずり=${r2.pi ? (r2.pi[5] * 100).toFixed(1) + '%' : '?'}(>15% — 実測24.5%)`);
    } else {
      console.log('SKIP claim.galaxystd-outerboost(対象に 66B 未適用 — root 等)');
    }
  }

  // ---- 8a2b) 第70便: 💫galaxyGeo2 — v−u 統一測地線則の基準銀河(beta 先行) ----
  // 🎡galaxyStd と厳密同一の初期配置で geoPN=2 だけを変えた統一則の較正値を機械固定する。
  // 較正実測(第69便 exp-p4b → 第70便 exp-4-70 でプリセット経路の再現を確認):
  //   外縁増強 kF1/kF0 = 1.0803(legacy 🎡 1.2646 の約1/3 — 「legacy 較正値を統一則に
  //   流用しない」ChatGPT レビュー裁定の実装)。純度Π: 熱斥力=0・結合=0(厳密)、
  //   測地線=6.7%(1PN — geoPN=2 で初めて銀河系に立つ)・引きずり=19.3%(輸送+渦度)
  {
    const hasG2 = await page.evaluate(() => HP.allPresets().some(p => p.id === 'galaxyGeo2'));
    if (hasG2) {
      const r2 = await page.evaluate(() => {
        const s = HP.sim;
        HP.loadPreset('galaxyGeo2', false);
        HP.abStart('kFrame', 0);
        const abG = HP.ab();
        const outer = (sm) => { let sum = 0, c = 0;
          for (let i = 1; i < sm.n; i++) { const rr = Math.hypot(sm.x[i], sm.y[i]);
            if (rr >= 156 && rr <= 286) { sum += (sm.x[i] * sm.vy[i] - sm.y[i] * sm.vx[i]) / rr; c++; } }
          return c ? sum / c : 0; };
        for (let k = 0; k < 6000; k++) { s.step(0.016); abG.simB.step(0.016); }
        const gA = outer(s), gB = outer(abG.simB);
        const bad = s.hasNaN() || abG.simB.hasNaN();
        const spec = s.mechSpec(true);
        const clampV = s.clampVN, clampR = (s.clampRN || 0);   // 第72便: 反作用上限の無発動も piggyback で機械固定
        HP.abStop();
        return { gA, gB, bad, clampV, clampR, pi: spec ? spec.pi : null };
      });
      const ratio = r2.gA / r2.gB;
      add('claim.galaxygeo2-outerboost',
        !r2.bad && r2.clampV === 0 && r2.clampR === 0 && ratio >= 1.05 && ratio <= 1.12
        && !!r2.pi && r2.pi[2] === 0 && r2.pi[4] === 0 && r2.pi[1] > 0.02 && r2.pi[5] > 0.1,
        `vφ外縁 kF1=${r2.gA.toFixed(3)} kF0=${r2.gB.toFixed(3)} 比=${ratio.toFixed(4)}` +
        `(窓1.05〜1.12・較正実測1.0803 — legacy 🎡 1.2646 の約1/3)/ 純度Π: 熱斥力=${r2.pi ? r2.pi[2] : '?'} ` +
        `結合=${r2.pi ? r2.pi[4] : '?'}(厳密0)・測地線=${r2.pi ? (r2.pi[1] * 100).toFixed(1) + '%' : '?'}(>2% — 1PN)` +
        `・引きずり=${r2.pi ? (r2.pi[5] * 100).toFixed(1) + '%' : '?'}(>10% — 輸送+渦度)/ クランプ=${r2.clampV}`);
    } else {
      console.log('SKIP claim.galaxygeo2-outerboost(対象に 💫galaxyGeo2 なし — root 等。第70便)');
    }
  }

  // ---- 8a2b1) 第74便: 5段階スケール(scaleTier)— 分類の完全性と表示換算の物理不変 ----
  // scaleTier は UI 分類・表示換算専用のメタデータ(ChatGPT §8「スケールを物理入力にしない」)。
  // ①全内蔵が正規5値のいずれかを宣言し、5スケールすべてが空でない(較正: 分子8・日常4・
  //   天体18・銀河6+2・宇宙全体10)②換算表示トグル+指数スライダーを操作しても物理
  //   (240步後の x/vx/spin)が bit 一致 ③AI追加のスケール雛形が5件あり、挿入で要望欄と
  //   ベースサンプルが埋まる(未選択時の素通し ai.base-context は不変)
  {
    const hasScale = await page.evaluate(() => !!(window.HP && HP.SCALE_TIERS));
    if (hasScale) {
      const r = await page.evaluate(() => {
        const res = {};
        const builtins = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'));
        res.missing = builtins.filter(p => HP.SCALE_TIERS.indexOf(p.scaleTier) < 0).map(p => p.id);
        res.counts = {};
        builtins.forEach(p => { res.counts[p.scaleTier] = (res.counts[p.scaleTier] || 0) + 1; });
        res.allTiers = HP.SCALE_TIERS.every(t => (res.counts[t] || 0) > 0);
        res.total = builtins.length;
        return res;
      });
      add('preset.scale-tier', r.missing.length === 0 && r.allTiers,
        `未分類=${r.missing.join(',') || 'なし'} 内訳=${JSON.stringify(r.counts)}(全${r.total}件)`);

      const inv = await page.evaluate(() => {
        const run = (touch) => {
          HP.loadPreset('gas', false);
          if (touch) {
            HP.setScaleDisp(true);
            const sl = document.querySelector('#scaleExpSlider');
            for (const v of [-10, 3, 19, 24]) { sl.value = String(v); sl.dispatchEvent(new Event('input')); }
          }
          for (let k = 0; k < 240; k++) HP.sim.step(0.016);
          const S = HP.sim, out = [];
          for (let i = 0; i < S.n; i++) out.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
          if (touch) { HP.setScaleDisp(false); HP.setScaleExp(null); }
          return out;
        };
        const a = run(false), b = run(true);
        let same = a.length === b.length;
        if (same) for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) { same = false; break; }
        const conv = HP.scaleConvStr('cLight', 60);
        HP.setScaleExp(0);
        const conv0 = HP.scaleConvStr('cLight', 60);
        HP.setScaleExp(null);
        return { same, n: a.length / 5, conv0, convNullKey: HP.scaleConvStr('kRep', 1) === null };
      });
      add('scale.display-invariant', inv.same && inv.conv0 === '≈60 m/s' && inv.convNullKey,
        `240步 bit一致=${inv.same}(N=${inv.n})/ 換算 exp0: cLight60→"${inv.conv0}"(=≈60 m/s)/ 無次元キーは非換算=${inv.convNullKey}`);

      const tpl = await page.evaluate(() => {
        const sel = document.querySelector('#aiScaleTpl'), btn = document.querySelector('#btnAiTpl');
        if (!sel || !btn) return null;
        const res = { opts: [...sel.options].map(o => o.value) };
        const ta = document.querySelector('#aiPrompt'), base = document.querySelector('#aiBasePreset');
        const ta0 = ta.value, base0 = base.value;
        ta.value = ''; sel.value = 'molecular'; btn.click();
        res.prompt = ta.value;
        res.base = base.value;
        ta.value = ta0; base.value = base0 || '';   // 後続テストを汚さない
        res.plain = HP.aiUserContent('X') === 'X' || base.value !== '';
        return res;
      });
      add('ai.scale-templates',
        !!tpl && tpl.opts.length === 5 && tpl.prompt.length > 20 && tpl.prompt.includes('scaleTier')
        && tpl.base === 'emergent' && tpl.plain,
        tpl ? `候補=${tpl.opts.length} 挿入長=${tpl.prompt.length} base=${tpl.base}` : 'UIなし');
    } else {
      console.log('SKIP preset.scale-tier / scale.display-invariant / ai.scale-templates(対象に第74便 未適用 — root 等)');
    }
  }

  // ---- 8a2b2) 第74便: 🍳galaxyDB — ディスク/バルジ対比(回転支持 vs 分散支持) ----
  // 同一中心天体・同一恒星質量で「円運動ディスク190体」と「等方分散バルジ190体」を同時配置し、
  // 固定ID追跡(build順: disk=1..190 / bulge=191..380 — 第71便の訂正に従い終状態での再分類はしない)
  // で3対比を機械固定する: ①σ比(バルジ/ディスク)②E6′③残余トルクのスピン強制(|spin| 比・
  // バルジ側が強い)③kFrame=0 対照では両群のスピンが厳密0(経路の唯一性)。
  // 較正実測(exp-4-75 kf1・seed 20260804・6000步): σ 4.246/1.624=2.61・|spin| 5.040/2.618=1.92・
  // 対照は厳密0・保持 disk99.5%/bulge97.4%
  {
    const hasDB = await page.evaluate(() => HP.allPresets().some(p => p.id === 'galaxyDB'));
    if (hasDB) {
      const r = await page.evaluate(() => {
        HP.loadPreset('galaxyDB', false);
        HP.abStart('kFrame', 0);
        const abG = HP.ab();
        const S = HP.sim, B = abG.simB;
        const disk = [], bulge = [];
        for (let i = 1; i <= 190; i++) disk.push(i);
        for (let i = 191; i < S.n; i++) bulge.push(i);
        for (let k = 0; k < 6000; k++) { S.step(0.016); B.step(0.016); }
        const stat = (sm, idx) => {
          const vt = [], sp = [];
          for (const i of idx) {
            const rr = Math.hypot(sm.x[i], sm.y[i]) || 1;
            vt.push((sm.vx[i] * -sm.y[i] + sm.vy[i] * sm.x[i]) / rr);
            sp.push(sm.spin[i]);
          }
          const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
          const dv = (a) => { const m = mean(a); return Math.sqrt(mean(a.map(v => (v - m) * (v - m)))); };
          return { sigT: dv(vt), vt: mean(vt), spinAbs: mean(sp.map(Math.abs)) };
        };
        const d = stat(S, disk), b = stat(S, bulge);
        const d0 = stat(B, disk), b0 = stat(B, bulge);
        const bad = S.hasNaN() || B.hasNaN();
        HP.abStop();
        return { d, b, d0, b0, bad, clampV: S.clampVN, clampR: S.clampRN || 0 };
      });
      const sigR = r.b.sigT / r.d.sigT, spinR = r.b.spinAbs / r.d.spinAbs;
      add('claim.galaxydb-contrast',
        !r.bad && r.clampV === 0 && r.clampR === 0
        && sigR >= 2.2 && sigR <= 3.0 && spinR >= 1.5 && spinR <= 2.4
        && r.d.vt > 3 && Math.abs(r.b.vt) < r.d.vt / 3
        && r.d0.spinAbs === 0 && r.b0.spinAbs === 0,
        `σT bulge/disk=${r.b.sigT.toFixed(3)}/${r.d.sigT.toFixed(3)}=${sigR.toFixed(2)}(窓2.2〜3.0・実測2.61)/ ` +
        `|spin| ${r.b.spinAbs.toFixed(2)}/${r.d.spinAbs.toFixed(2)}=${spinR.toFixed(2)}(窓1.5〜2.4・実測1.92)/ ` +
        `公転 vt disk=${r.d.vt.toFixed(2)} bulge=${r.b.vt.toFixed(2)}(回転支持 vs 分散支持)/ ` +
        `kF0対照 spin=${r.d0.spinAbs}/${r.b0.spinAbs}(厳密0 — E6′③が唯一の経路)`);
    } else {
      console.log('SKIP claim.galaxydb-contrast(対象に 🍳galaxyDB なし — root 等。第74便)');
    }
  }

  // ---- 8a2b3) 第74便: 🌑nebulaRotor — ローター星雲の減光コントラスト(暗黒⇔散光) ----
  // 高スピンコア(lightSweep auto・粒子0..53)の平均減光がエンベロープ(54..)より1桁以上高く、
  // コアのスピンを0にした対照(abBody と同一 patch)では散光化することを機械固定する。
  // 較正実測(exp-4-75・seed 20260804・3000步): コア0.767/エンベロープ0.052(×14.9)・対照0.025
  {
    const hasNeb = await page.evaluate(() => HP.allPresets().some(p => p.id === 'nebulaRotor'));
    if (hasNeb) {
      const r = await page.evaluate(() => {
        HP.loadPreset('nebulaRotor', false);
        const ent = HP.allPresets().find(p => p.id === 'nebulaRotor').abBody;
        HP.abStart(undefined, undefined, { targets: ent.targets, patch: ent.patch });
        const abG = HP.ab();
        const S = HP.sim, B = abG.simB;
        for (let k = 0; k < 3000; k++) { S.step(0.016); B.step(0.016); }
        const g = (sm, lo, hi) => { let s = 0; for (let i = lo; i < hi; i++) s += sm.lSw[i] / (hi - lo); return s; };
        const res = { core: g(S, 0, 54), env: g(S, 54, S.n), ctrl: g(B, 0, 54),
          bad: S.hasNaN() || B.hasNaN() };
        HP.abStop();
        return res;
      });
      add('claim.nebularotor-contrast',
        !r.bad && r.core >= 0.65 && r.core <= 0.85 && r.env < 0.1 && r.ctrl < 0.1
        && r.core / r.env > 10,
        `lS̄ コア=${r.core.toFixed(3)}(窓0.65〜0.85・実測0.767) エンベロープ=${r.env.toFixed(3)}(<0.1) ` +
        `コントラスト=${(r.core / r.env).toFixed(1)}倍(>10)/ スピン0対照 コア=${r.ctrl.toFixed(3)}(<0.1 — 散光化)`);
    } else {
      console.log('SKIP claim.nebularotor-contrast(対象に 🌑nebulaRotor なし — root 等。第74便)');
    }
  }

  // ---- 8a2b4) 第75便: 2層減光形(lightSweep auto のコア差動)+群コアの配線 ----
  // ①機能検出: 「殻はゆっくり・コアは高速」の孤立2層粒で lSw が単層値より大きければ拡張あり
  //   (root は従来式 = 小 → SKIP)。②単層は解析式 min(1,|s|R/c_surf) と厳密一致・
  //   rigid(Ω_c≡s)は単層と bit 等価(A8 と同じ「差動分だけがコアから効く」原則)・
  //   2層(Ω_c≠s)は同じ殻スピンで単層より暗い。③disk/ring 群の core:{} 通し(第80便)+
  //   **旧キー(コアv1)の移行**(第81便)— validatePreset 保持+build 配線(RcV>0・hasCoreV2)
  {
    const r = await page.evaluate(() => {
      const PH = { G: 0.8, D0: 1.5, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
        cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
        pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 };
      const one = (core) => {
        HP.sim.build({ id: 'qa_l2', name: 'd', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, seed: 7, physics: PH,
          bodies: [Object.assign({ type: 'single', rMul: 1, m: 30, x: 0, y: 0, vx: 0, vy: 0,
            spin: 0.6, pinned: false, radius: 4, lightSweep: 'auto' }, core)] });
        HP.sim.step(0.016);
        return HP.sim.lSw[0];
      };
      // 第81便: コアv2 直指定(R_c=0.3·R=1.2・Ω_c=20·0.6=12 は旧 coreSR:20/coreRR:0.3 と同じ値)
      const single = one({});
      const rigid = one({ core: { mode: 'rigid', massFrac: 0.4, radius: 1.2 } });
      const two = one({ core: { mode: 'differential', massFrac: 0.4, radius: 1.2, omega: 12 } });
      // 解析式(単層): lS = min(1, |s|·R/(c₀·e^{−2ψ}))・ψ=(D0+m/√(R²+ε²))/Kt(孤立なので ΣW=0)
      const psi = (1.5 + 30 / Math.sqrt(16 + 9)) / 50;
      const ana = Math.min(1, 0.6 * 4 / (40 * Math.exp(-2 * psi)));
      return { single, rigid, two, ana };
    });
    if (r.two > r.single + 0.2) {
      const g = await page.evaluate(() => {
        const PH = { G: 0.8, D0: 1.5, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
          cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 };
        const v = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 300 },
          world: { boundary: 'none', size: 0 }, seed: 1, physics: PH,
          bodies: [
            // 第81便: 群に**旧キー(コアv1)**を書いた JSON を読ませ、移行式で v2 へ変換されることを見る。
            // disk: R_c=0.3·(0.7·√8)=0.5940・Ω_c=20·0.3=6 / ring(空洞): voidFraction=0.5・
            // R_c=0.2·(1·√8)=0.5657・Ω_c=10·0.3=3
            { type: 'disk', n: 6, cx: 0, cy: 0, radius: 40, mMin: 8, mMax: 8, spinMin: 0.3, spinMax: 0.3,
              vMode: 'random', vScale: 0.5, aroundMass: 0, direction: 1, rMul: 0.7,
              coreMR: 0.4, coreSR: 20, coreRR: 0.3, lightSweep: 'auto' },
            { type: 'ring', n: 6, cx: 0, cy: 0, rIn: 80, rOut: 80, mMin: 8, mMax: 8, spinMin: 0.3, spinMax: 0.3,
              vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0, direction: 1, pinned: false,
              coreMR: -0.5, coreSR: 10, coreRR: 0.2, lightSweep: 'auto' }] });
        const b0 = v.ok ? v.preset.bodies[0] : {}, b1 = v.ok ? v.preset.bodies[1] : {};
        HP.sim.build(v.preset);
        const S = HP.sim;
        const migrated = !!(b0.core && b1.core) && b0.coreMR === undefined && b1.coreMR === undefined;
        if (migrated) return { ok: v.ok, warn: v.warnings.length, migrated,
          diskCore: [b0.core.mode, b0.core.massFrac, +b0.core.radius.toFixed(4), b0.core.omega],
          ringCore: [b1.core.mode, b1.core.voidFraction, +b1.core.radius.toFixed(4), b1.core.omega],
          hasCore: S.hasCoreV2, md0: S.coreMd[0], md6: S.coreMd[6],
          Rc0: S.RcV[0], Rc6: S.RcV[6], n: S.n };
        // 旧ビルド(root 等・第81便未適用): 旧キーがそのまま保持され、コアv1 の配列へ配線される
        return { ok: v.ok, warn: v.warnings.length, migrated,
          diskCore: [b0.coreMR, b0.coreSR, b0.coreRR], ringCore: [b1.coreMR, b1.coreSR, b1.coreRR],
          hasCore: S.hasCore, md0: 0, md6: 0, Rc0: S.Rc[0], Rc6: S.Rc[6], n: S.n };
      });
      add('lsw.core-auto',
        Math.abs(r.single - r.ana) < 1e-6 && r.rigid === r.single && r.two > r.single + 0.2,
        `単層=解析式 ${r.single.toFixed(6)}(=${r.ana.toFixed(6)}) / 剛体コア(mode=rigid)=単層 bit等価=${r.rigid === r.single} / ` +
        `2層(Ω_c=12)=${r.two.toFixed(3)}(単層+0.2 以上 — 差動コアが暗さを担う)`);
      const gOk = g.migrated
        ? (g.diskCore[0] === 'differential' && g.diskCore[1] === 0.4 && Math.abs(g.diskCore[2] - 0.594) < 0.002 && g.diskCore[3] === 6
          && g.ringCore[0] === 'cavity' && g.ringCore[1] === 0.5 && Math.abs(g.ringCore[2] - 0.5657) < 0.002 && g.ringCore[3] === 3
          && g.md0 === 2 && g.md6 === 4)
        : (g.warn === 0 && g.diskCore[0] === 0.4 && g.diskCore[1] === 20 && g.diskCore[2] === 0.3
          && g.ringCore[0] === -0.5 && g.ringCore[1] === 10 && g.ringCore[2] === 0.2);
      add('preset.group-core',
        g.ok && gOk && g.hasCore && g.Rc0 > 0 && g.Rc6 > 0 && g.n === 12,
        `群コア: ${g.migrated ? '旧キー → コアv2 移行(第81便)' : '旧キー保持(コアv1・第75便)'}(警告${g.warn}件) ` +
        `disk=[${g.diskCore}] ring=[${g.ringCore}](空洞も通る) ` +
        `コア配線=${g.hasCore} md=${g.md0}/${g.md6} R_c=${g.Rc0.toFixed(3)}/${g.Rc6.toFixed(3)}`);
    } else {
      console.log('SKIP lsw.core-auto / preset.group-core(対象に第75便 2層減光 未適用 — root 等)');
    }
  }

  // ---- 8a2b4b) 第77便: コアv2 — 独立コアの力学(zero-shell・収縮・τ_cs・保存) ----
  // ①zero-shell: 殻 spin=0+独立コア Ω=12 が300步後も保持され減光が立つ(旧比率仕様では
  //   0×coreSR=0 で不可能だった形)②収縮: J 厳密保存で Ω=J/I 上昇(裁定「スピン加速の主要因=
  //   自己重力圧縮」の機械化)③τ_cs: コア⇄殻の J 交換が合計保存(T7 拡張)
  {
    const hasV2 = await page.evaluate(() => {
      const v = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'single', m: 30, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false,
          core: { mode: 'differential', massFrac: 0.3, radius: 1.8, omega: 12 } }] });
      return v.ok && !!v.preset.bodies[0].core;
    });
    if (hasV2) {
      const r = await page.evaluate(() => {
        const PH = { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
          cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 };
        const build = (core) => { const v = HP.validatePreset({ name: 't', description: 'd',
          camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 7, physics: PH,
          bodies: [{ type: 'single', rMul: 1, m: 30, x: 0, y: 0, vx: 0, vy: 0, spin: 0,
            pinned: false, radius: 6, lightSweep: 'auto', core }] });
          HP.sim.build(v.preset); return HP.sim; };
        const out = {};
        { const S = build({ mode: 'differential', massFrac: 0.3, radius: 1.8, omega: 12 });
          for (let k = 0; k < 300; k++) S.step(0.016);
          const cs = HP.coreState(0);
          out.zs = { lSw: S.lSw[0], om: cs.omega, shell: S.spin[0], nan: S.hasNaN() }; }
        { const S = build({ mode: 'differential', massFrac: 0.3, radius: 3, omega: 2, contract: 0.05 });
          const J0 = HP.coreState(0).J;
          for (let k = 0; k < 1200; k++) S.step(0.016);
          const cs = HP.coreState(0);
          out.ct = { J0, J1: cs.J, om1: cs.omega, Rc1: cs.Rc, work: S.coreWork, nan: S.hasNaN() }; }
        { const S = build({ mode: 'differential', massFrac: 0.3, radius: 1.8, omega: 12, Kcs: 0.05 });
          const Ish = 0.5 * 30 * 36;
          const t0 = HP.coreState(0).J + Ish * S.spin[0];
          for (let k = 0; k < 2400; k++) S.step(0.016);
          const cs = HP.coreState(0);
          out.tq = { om1: cs.omega, shell1: S.spin[0],
            drift: Math.abs(cs.J + Ish * S.spin[0] - t0), nan: S.hasNaN() }; }
        return out;
      });
      add('core.v2-mech',
        !r.zs.nan && !r.ct.nan && !r.tq.nan
        && r.zs.lSw > 0.7 && Math.abs(r.zs.om - 12) < 0.5 && r.zs.shell === 0
        && r.ct.J0 === r.ct.J1 && r.ct.om1 > 10 && r.ct.work > 0
        && r.tq.shell1 > 0.02 && r.tq.om1 < 11 && r.tq.drift < 1e-3,
        `zero-shell: lSw=${r.zs.lSw.toFixed(3)}(>0.7) Ω=${r.zs.om.toFixed(2)}(≈12) 殻=${r.zs.shell}(=0) / ` +
        `収縮: J ${r.ct.J0}→${r.ct.J1}(厳密保存) Ω→${r.ct.om1.toFixed(1)}(>10・Rc=${r.ct.Rc1.toFixed(2)}) W=${r.ct.work.toFixed(0)} / ` +
        `τ_cs: コア→殻 J 移送(殻=${r.tq.shell1.toFixed(3)}) 合計ドリフト=${r.tq.drift.toExponential(1)}(<1e-3)`);
    } else {
      console.log('SKIP core.v2-mech(対象に第77便 コアv2 未適用 — root 等)');
    }
  }

  // ---- 8a2b4c) 第77便: 🌱starSeed — 圧縮スピンアップ+パワーボール ----
  // 差動種A: Ω 1.5→約162(比107.9・窓80〜140)・減光0.14→0.999(≥0.98)。rigid種B: 同じ揺すりで
  // 減速(spin 3→2.61・比0.8〜0.95)。帳簿込み総 L 保存(<1e-3)。対照(pump/contract 0)は不変
  {
    const hasSeed = await page.evaluate(() => HP.allPresets().some(p => p.id === 'starSeed'));
    if (hasSeed) {
      const r = await page.evaluate(() => {
        HP.loadPreset('starSeed', false);
        const S = HP.sim;
        const om0 = HP.coreState(1).omega;
        const L0 = S.totals().L + S.resL + S.radL;
        const sB0 = S.spin[2];
        for (let k = 0; k < 6000; k++) S.step(0.016);
        const L1 = S.totals().L + S.resL + S.radL;
        let lScale = 0;
        for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
          + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
        return { om0, om1: HP.coreState(1).omega, lSwA: S.lSw[1], sB0, sB1: S.spin[2],
          relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), work: S.coreWork,
          nan: S.hasNaN(), clampV: S.clampVN };
      });
      const ratio = r.om1 / r.om0, bRatio = r.sB1 / r.sB0;
      add('claim.starseed-powerball',
        !r.nan && r.clampV === 0 && ratio >= 80 && ratio <= 140
        && r.lSwA >= 0.98 && bRatio >= 0.8 && bRatio <= 0.95
        && r.relL < 1e-3 && r.work > 0,
        `種A: Ω比=${ratio.toFixed(1)}(窓80〜140・実測107.9) 減光=${r.lSwA.toFixed(4)}(≥0.98) / ` +
        `種B(軸固定): spin比=${bRatio.toFixed(3)}(0.8〜0.95 — 同じ揺すりで減速) / ` +
        `帳簿込み|ΔL|=${r.relL.toExponential(1)}(<1e-3) コア仕事W=${r.work.toFixed(0)}`);
    } else {
      console.log('SKIP claim.starseed-powerball(対象に 🌱starSeed なし — root 等。第77便)');
    }
  }

  // ---- 8a2b4d) 第78便→第81便: ⚫bhCore — DFM版BH 5層の自走と因果分離(自由な中心)----
  // 第81便で ⚫ の中心を自由(pinned:false + E6′-R + 重心系)へ正式移行したので、観測は
  // **中心天体基準の相対座標**で取る。①自走: τ_cs で殻スピン 0.15→1.33・コアΩ 20→4.24
  // (コアの貯金が外殻へ)②暗いまま回す: 中心 lSw=1.00 で外縁増強 1.52(可視の🎡標準 1.2646 超)
  // ③因果: コアなし対照は 1.05(=コアが主因)④帳簿込み総 L 保存(<1e-3)。
  // 較正実測は exp-4-81(seed 20260805・6000步): 増強 1.5236 / 殻 1.3302 / Ω_c 4.241 /
  // コアなし対照 1.0453 / |ΔL| 1.3e-6(pinned 対照は 1.5215 — 同帯)
  {
    const hasBH = await page.evaluate(() => HP.allPresets().some(p => p.id === 'bhCore'));
    if (hasBH) {
      const r = await page.evaluate(() => {
        const run = (mod) => {
          const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
          p.physics.kFrame = mod.kFrame;
          if (mod.noCore) delete p.bodies[0].core;
          HP.sim.build(p);
          const S = HP.sim;
          const L0 = S.totals().L + S.resL + S.radL;
          const cs0 = HP.coreState(0);
          for (let k = 0; k < 6000; k++) S.step(0.016);
          // 中心天体基準の相対座標(自由中心の並進を混ぜない)
          const x0 = S.x[0], y0 = S.y[0], vx0 = S.vx[0], vy0 = S.vy[0];
          let sum = 0, c = 0;
          for (let i = 121; i < S.n; i++) { const dx = S.x[i] - x0, dy = S.y[i] - y0, rr = Math.hypot(dx, dy);
            if (rr >= 156 && rr <= 286) { sum += (dx * (S.vy[i] - vy0) - dy * (S.vx[i] - vx0)) / rr; c++; } }
          const L1 = S.totals().L + S.resL + S.radL;
          let lScale = 0;
          for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
            + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
          const cs1 = HP.coreState(0);
          return { outer: c ? sum / c : 0, shell: S.spin[0],
            om0: cs0 ? cs0.omega : 0, om1: cs1 ? cs1.omega : 0, lSw: S.lSw[0],
            relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), bad: S.hasNaN(), n: S.n };
        };
        const a = run({ kFrame: 1 }), z = run({ kFrame: 0 });
        const nc1 = run({ kFrame: 1, noCore: true }), nc0 = run({ kFrame: 0, noCore: true });
        return { a, z, ncBoost: nc1.outer / nc0.outer };
      });
      const boost = r.a.outer / r.z.outer;
      add('claim.bhcore-selfdrive',
        !r.a.bad && !r.z.bad && r.a.n === 321
        && boost >= 1.37 && boost <= 1.68 && boost > 1.2646
        && r.a.shell >= 1.20 && r.a.shell <= 1.47 && r.a.om1 < r.a.om0 * 0.5
        && r.a.lSw > 0.95 && r.ncBoost < 1.15 && r.a.relL < 1e-3,
        `外縁増強(中心基準)=${boost.toFixed(4)}(窓1.37〜1.68・実測1.5236・可視の🎡標準1.2646超)/ ` +
        `自走: 殻 0.15→${r.a.shell.toFixed(3)}(窓1.20〜1.47) コアΩ ${r.a.om0.toFixed(1)}→${r.a.om1.toFixed(2)}(半減以下)/ ` +
        `中心lSw=${r.a.lSw.toFixed(3)}(>0.95 — 真っ暗)/ コアなし対照=${r.ncBoost.toFixed(3)}(<1.15 — コアが主因)/ ` +
        `帳簿込み|ΔL|=${r.a.relL.toExponential(1)}(<1e-3)`);
    } else {
      console.log('SKIP claim.bhcore-selfdrive(対象に ⚫bhCore なし — root 等。第78便)');
    }
  }

  // ---- 8a2b4d2) 第80便 A → 第81便: ⚫bhCore の「自由な支配天体 + E6′-R」の固定seed受入 ----
  // 第80便は実験サンプル 🕳️bhCoreFree でこの受入を組んでいたが、第81便で ⚫bhCore 本体が
  // 自由中心へ移行したので、本テストは ⚫ を対象に統合した(🕳️ は廃止)。
  // ①安全上限(反作用・速度・スピン)が一度も発動しない ②中心基準の外縁増強が pinned 版と同帯
  // ③τ_cs の自走(殻 0.15→1.33・コアΩ 20→4.24)が保たれる ④支配天体は重心まわりに有限反跳
  // ⑤帳簿込み総 L が保存する。較正実測は exp-4-81(seed 20260805・6000步)。
  // 「安定」の定義は原点不動ではなく上の5点(提案 §12.4)。対象に無ければ SKIP(root 等)
  {
    const hasBHF = await page.evaluate(() => {
      const p = HP.allPresets().find(q => q.id === 'bhCore');
      return !!(p && p.balanceFrame === 'barycentric' && p.bodies[0].pinned === false);
    });
    if (hasBHF) {
      const r = await page.evaluate(() => {
        const run = (kFrame) => {
          const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
          p.physics.kFrame = kFrame;
          HP.sim.build(p);
          const S = HP.sim;
          const L0 = S.totals().L + S.resL + S.radL;
          const cs0 = HP.coreState(0);
          const com = () => { let M = 0, cx = 0, cy = 0, cvx = 0, cvy = 0;
            for (let i = 0; i < S.n; i++) { const mi = S.m[i]; M += mi;
              cx += mi * S.x[i]; cy += mi * S.y[i]; cvx += mi * S.vx[i]; cvy += mi * S.vy[i]; }
            return [cx / M, cy / M, cvx / M, cvy / M]; };
          let dMax = 0, vMax = 0;
          for (let k = 0; k < 6000; k++) {
            S.step(0.016);
            const c = com();
            const d = Math.hypot(S.x[0] - c[0], S.y[0] - c[1]);
            const v = Math.hypot(S.vx[0] - c[2], S.vy[0] - c[3]);
            if (d > dMax) dMax = d;
            if (v > vMax) vMax = v;
          }
          // 観測はすべて中心天体基準の相対座標(自由中心の並進を混ぜない — exp-4-79 の流儀)
          const x0 = S.x[0], y0 = S.y[0], vx0 = S.vx[0], vy0 = S.vy[0];
          let sum = 0, c2 = 0, keep = 0;
          for (let i = 121; i < S.n; i++) {
            const dx = S.x[i] - x0, dy = S.y[i] - y0, rr = Math.hypot(dx, dy);
            if (rr >= 156 && rr <= 286) { sum += (dx * (S.vy[i] - vy0) - dy * (S.vx[i] - vx0)) / rr; c2++; }
            if (rr < 450) keep++;
          }
          const L1 = S.totals().L + S.resL + S.radL;
          let lScale = 0;
          for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
            + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
          const cs1 = HP.coreState(0);
          return { outer: c2 ? sum / c2 : 0, shell: S.spin[0], keep: keep / (S.n - 121),
            om0: cs0 ? cs0.omega : 0, om1: cs1 ? cs1.omega : 0, lSw: S.lSw[0],
            relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), bad: S.hasNaN(), n: S.n,
            bf: S.balanceFrame, dMax, vMax,
            clampR: S.clampRN || 0, clampV: S.clampVN, clampS: S.clampSN };
        };
        const a = run(1), z = run(0);
        return { a, z };
      });
      const boost = r.a.outer / r.z.outer;
      add('claim.bhcore-free',
        !r.a.bad && !r.z.bad && r.a.n === 321 && r.a.bf === 'barycentric'
        && r.a.clampR === 0 && r.a.clampV === 0 && r.a.clampS === 0
        && boost >= 1.37 && boost <= 1.68
        && r.a.shell >= 1.20 && r.a.shell <= 1.47
        && r.a.om1 >= 3.8 && r.a.om1 <= 4.7
        && r.a.lSw >= 0.99 && r.a.keep >= 0.95
        && r.a.relL < 1e-5 && r.a.dMax >= 0.2 && r.a.dMax < 8 && r.a.vMax < 0.2,
        `外縁増強=${boost.toFixed(4)}(窓1.37〜1.68・実測1.5236。同構成 pinned 対照 1.5215)/ ` +
        `上限発動 R/V/S=${r.a.clampR}/${r.a.clampV}/${r.a.clampS}(すべて0)/ ` +
        `自走: 殻 0.15→${r.a.shell.toFixed(3)}(窓1.20〜1.47) コアΩ ${r.a.om0.toFixed(1)}→${r.a.om1.toFixed(2)}(窓3.8〜4.7)/ ` +
        `中心lSw=${r.a.lSw.toFixed(3)}(≥0.99) 保持率=${r.a.keep.toFixed(3)}(≥0.95)/ ` +
        `BH重心相対 最大変位=${r.a.dMax.toFixed(3)}(0.2〜8 — 固定ではない有限反跳) 最大速度=${r.a.vMax.toFixed(4)}(<0.2)/ ` +
        `重心系初期化=${r.a.bf} 帳簿込み|ΔL|=${r.a.relL.toExponential(1)}(<1e-5)`);
    } else {
      console.log('SKIP claim.bhcore-free(対象の ⚫bhCore が自由中心構成でない — root 等。第81便)');
    }
  }

  // ---- 8a2b4e) 第78便: コアv2 の堅牢性(ChatGPT P1: extreme-fuzz / 保存互換) ----
  // ①境界値・不正値の総当たりで NaN/Infinity/負慣性/半径逆転を起こさない(validate のクランプが
  //   効き、build→step が走り切る)②root(コアv2 非対応)は未知の core:{} を**安全に無視**して
  //   従来の単層として読める(beta で作った JSON を root へ持ち込む経路の防御 — 保存互換)
  {
    const hasV2b = await page.evaluate(() => !!(window.HP && HP.coreState));
    if (hasV2b) {
      const r = await page.evaluate(() => {
        const PH = { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
          cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 };
        const cases = [
          { mode: 'differential', massFrac: 0, radius: 0, omega: 0 },
          { mode: 'differential', massFrac: 1e9, radius: 1e9, omega: 1e9, Kcs: 1e9, pump: 1e9, contract: 1e9 },
          { mode: 'differential', massFrac: -5, radius: -5, omega: -1e9, Kcs: -5, pump: -5, contract: -5 },
          { mode: 'rigid', massFrac: 0.6, radius: 200, omega: 50, pump: 5 },
          { mode: 'bogus', massFrac: 0.3, radius: 2, omega: 3 },
          { mode: 'differential', massFrac: 0.3, radius: 2 },                      // omega 省略
          { mode: 'differential', massFrac: 0.3 },                                 // radius 欠落 → core 無視
        ];
        let bad = 0, ran = 0, nan = 0;
        for (const c of cases) {
          const v = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 200 },
            world: { boundary: 'none', size: 0 }, seed: 3, physics: PH,
            bodies: [{ type: 'single', rMul: 1, m: 30, x: 0, y: 0, vx: 0, vy: 0, spin: 0.5,
              pinned: false, radius: 5, lightSweep: 'auto', core: c },
              { type: 'single', rMul: 1, m: 20, x: 40, y: 0, vx: 0, vy: 0.6, spin: 0, pinned: false }] });
          if (!v.ok) { bad++; continue; }
          HP.sim.build(v.preset);
          for (let k = 0; k < 200; k++) HP.sim.step(0.016);
          ran++;
          const cs = HP.coreState(0);
          if (HP.sim.hasNaN() || !isFinite(HP.sim.spin[0])
            || (cs && (!isFinite(cs.omega) || !isFinite(cs.J) || cs.Rc < 0))) nan++;
        }
        // 保存互換: 未知キー core を持つ body を、コアv2 非対応の読み手が無視できる形か
        // (validatePreset は core を保持し、build は coreMd=0 で単層として扱えること)
        const v2 = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, physics: {},
          bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: false,
            core: { mode: 'differential', massFrac: 0.3, radius: 1, omega: 5 } }] });
        const keep = v2.ok && !!v2.preset.bodies[0].core;
        const strip = JSON.parse(JSON.stringify(v2.preset));
        delete strip.bodies[0].core;                    // root 相当(未知キーを落とした読み)
        HP.sim.build(strip);
        for (let k = 0; k < 60; k++) HP.sim.step(0.016);
        const legacyOK = !HP.sim.hasNaN() && HP.coreState(0) === null;
        return { cases: cases.length, bad, ran, nan, keep, legacyOK };
      });
      add('core.extreme-fuzz',
        r.nan === 0 && r.ran >= 5 && r.keep && r.legacyOK,
        `境界・不正値 ${r.cases}件: 走行=${r.ran} 拒否=${r.bad} NaN/Inf/負半径=${r.nan}(=0)/ ` +
        `保存互換: core 保持=${r.keep}・core を落とした読み(root 相当)も単層として走行=${r.legacyOK}`);
    } else {
      console.log('SKIP core.extreme-fuzz(対象に第77便 コアv2 未適用 — root 等)');
    }
  }

  // ---- 8a2b4f) 第80便: コアv2 残段(active / cavity / 群開放 / 融合分裂継承 / schemaVersion)----
  // 機能判定子: validatePreset が core.mode="active" を受理するか(第77/78便までのビルドは
  // "differential" へ丸めるので 5 件とも SKIP。root も同様)
  {
    const hasV3 = await page.evaluate(() => {
      const v = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: false,
          core: { mode: 'active', massFrac: 0.3, radius: 1, omega: 5, sourceRate: 1 } }] });
      return !!(v.ok && v.preset.bodies[0].core && v.preset.bodies[0].core.mode === 'active');
    });
    if (hasV3) {
      // 共通の物理(孤立・散逸なし)。コアパスの検査なので殻の力学は極力効かせない
      const PH80 = { G: 0.8, D0: 1.5, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
        Kt: 50, cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0,
        lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 };

      // ① core.active-energy: sourceRate は **E_int を増やすだけ**(回転化しない)。
      //    帳簿 coreSrcE と Σ(E_int − E_int(0)) が一致し、J_core は 1 ビットも動かない。
      //    対照として differential に同じ sourceRate を書いても注入されない(active 限定)
      const ae = await page.evaluate((PH) => {
        const v = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 300 },
          world: { boundary: 'none', size: 0 }, seed: 7, physics: PH,
          bodies: [
            { type: 'single', rMul: 1, m: 30, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false,
              radius: 6, lightSweep: 'auto',
              core: { mode: 'active', massFrac: 0.3, radius: 2, omega: 3, sourceRate: 5, internalEnergy: 4 } },
            { type: 'single', rMul: 1, m: 30, x: 200, y: 0, vx: 0, vy: 0, spin: 0, pinned: false,
              radius: 6, core: { mode: 'differential', massFrac: 0.3, radius: 2, omega: 3, sourceRate: 5 } }] });
        const S = HP.sim; S.build(v.preset);
        const sum0 = S.coreEint[0] + S.coreEint[1];
        const J0 = HP.coreState(0).J, om0 = HP.coreState(0).omega;
        for (let k = 0; k < 500; k++) S.step(0.016);
        const cs = HP.coreState(0);
        return { warn: v.warnings.length, mode: cs.mode, t: S.t,
          E0: sum0, E1: S.coreEint[0] + S.coreEint[1], srcE: S.coreSrcE,
          eDiff: S.coreEint[1], J0, J1: cs.J, om0, om1: cs.omega, nan: S.hasNaN() };
      }, PH80);
      const aeExp = 5 * ae.t;                                  // sourceRate·t
      const aeRel = Math.abs((ae.E1 - ae.E0) - ae.srcE) / Math.max(Math.abs(ae.srcE), 1e-9);
      add('core.active-energy',
        !ae.nan && ae.warn === 0 && ae.mode === 'active'
        && aeRel < 1e-12 && Math.abs(ae.srcE - aeExp) / aeExp < 1e-12
        && ae.J1 === ae.J0 && ae.om1 === ae.om0 && ae.eDiff === 0,
        `注入 ΣΔE_int=${(ae.E1 - ae.E0).toFixed(6)} = 帳簿 coreSrcE=${ae.srcE.toFixed(6)}(相対差 ${aeRel.toExponential(1)}<1e-12・` +
        `理論値 sourceRate·t=${aeExp.toFixed(6)})/ 回転化しない: J=${ae.J1}(不変) Ω=${ae.om1}(不変)/ ` +
        `differential 対照の E_int=${ae.eDiff}(=0 — 注入は active 限定)`);

      // ② core.cavity-no-negative-mass: 空洞は質量0・慣性0・J0(負質量はどこにも生じない)。
      //    第81便: コアv1 廃止に伴い、この検査は**移行式の機械検証(reimport 型)**を兼ねる —
      //    旧キー入り JSON(coreMR<0)を読ませると validatePreset が cavity へ変換し、
      //    手書きの cavity と**同一状態からの1步が bit 一致**する(移行式: voidFraction=|coreMR|・
      //    Ω_c=coreSR·s・R_c=coreRR·R)。長時間走らせても NaN・負半径が出ない
      const cv = await page.evaluate((PH) => {
        const mk = (c0) => ({ name: 't', description: 'd', camera: { scale: 300 },
          world: { boundary: 'none', size: 0 }, seed: 7, physics: Object.assign({}, PH, { kFrame: 1 }),
          bodies: [Object.assign({ type: 'single', rMul: 1, m: 30, x: 0, y: 0, vx: 0, vy: 0,
              spin: 0.5, pinned: false, radius: 5, lightSweep: 'auto' }, c0),
            { type: 'single', rMul: 1, m: 20, x: 14, y: 0, vx: 0, vy: 0.4, spin: 0.2, pinned: false, radius: 4 }] });
        // 旧: coreMR=−0.5(空洞)・coreSR=3・coreRR=0.4(R=5 → Rc=2)/ 新: cavity voidFraction=0.5・
        //     radius=2・omega=3×0.5=1.5(すべて2進で厳密 — 丸めの入る余地を作らない)
        const snap = (S) => ({ ax: S.ax[0], ay: S.ay[0], s0: S.spin[0], s1: S.spin[1],
          lsw: S.lSw[0], x1: S.x[1], vy1: S.vy[1] });
        const run1 = (c0) => { const v = HP.validatePreset(mk(c0)); HP.sim.build(v.preset);
          HP.sim.step(0.016); return { w: v.warnings.length, o: snap(HP.sim) }; };
        const oldC = run1({ coreMR: -0.5, coreSR: 3, coreRR: 0.4 });   // 第81便: 旧キー → 移行式で cavity へ
        const newC = run1({ core: { mode: 'cavity', voidFraction: 0.5, radius: 2, omega: 1.5 } });
        const same = Object.keys(oldC.o).every(k => oldC.o[k] === newC.o[k]);
        // 長時間: 質量・慣性が非負(空洞は 0)で NaN・負半径なし
        const v2 = HP.validatePreset(mk({ core: { mode: 'cavity', voidFraction: 0.5, radius: 2, omega: 1.5 } }));
        const S = HP.sim; S.build(v2.preset);
        const M0 = S.m[0] + S.m[1];
        for (let k = 0; k < 400; k++) S.step(0.016);
        const cs = HP.coreState(0);
        let minM = Infinity; for (let i = 0; i < S.n; i++) minM = Math.min(minM, S.m[i]);
        return { same, oldW: oldC.w, newW: newC.w, old: oldC.o, nw: newC.o,
          mode: cs.mode, mass: cs.mass, J: cs.J, Rc: cs.Rc, vf: cs.voidFraction,
          om: cs.omega, mf: S.coreMF[0], M0, M1: S.m[0] + S.m[1], minM, nan: S.hasNaN() };
      }, PH80);
      add('core.cavity-no-negative-mass',
        cv.same && cv.oldW >= 1 && cv.newW === 0 && !cv.nan
        && cv.mode === 'cavity' && cv.mass === 0 && cv.J === 0 && cv.Rc > 0 && cv.vf === 0.5
        && cv.mf < 0 && cv.minM > 0 && Math.abs(cv.M1 - cv.M0) < 1e-6,
        `旧キー読込 coreMR=−0.5/coreSR=3/coreRR=0.4(移行警告${cv.oldW}件)⇔ 手書き cavity(voidFraction=0.5・R_c=2・Ω=1.5): 1步 bit一致=${cv.same}(a=${cv.nw.ax.toFixed(6)},${cv.nw.ay.toFixed(6)} lSw=${cv.nw.lsw.toFixed(6)})/ ` +
        `空洞の質量=${cv.mass}・J=${cv.J}(ともに厳密0)・R_c=${cv.Rc}(>0)/ 引きずり重み coreMF=${cv.mf}(負の**重み**であって質量ではない)/ ` +
        `400步後: 総質量 ${cv.M0}→${cv.M1}(不変)・最小質量=${cv.minM}(>0 — 負質量なし)`);

      // ③ core.group-core: disk/ring 群へ core:{} を付けると全メンバーが同じコア設定を持つ。
      //    付けない構成は coreMd 全0・hasCoreV2=false(ゼロコスト経路が生き残る)。
      //    群コアつきで 600步走らせても帳簿込み総 L が保存する(T7)
      const gc = await page.evaluate((PH) => {
        const mk = (dCore, rCore) => {
          const d = { type: 'disk', n: 6, cx: -60, cy: 0, radius: 30, mMin: 8, mMax: 8,
            spinMin: 0.3, spinMax: 0.3, vMode: 'random', vScale: 0.3, aroundMass: 0,
            direction: 1, rMul: 0.7, lightSweep: 'auto' };
          const r = { type: 'ring', n: 6, cx: 60, cy: 0, rIn: 30, rOut: 30, mMin: 8, mMax: 8,
            spinMin: 0.3, spinMax: 0.3, vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0,
            direction: 1, pinned: false, lightSweep: 'auto' };
          if (dCore) d.core = dCore;
          if (rCore) r.core = rCore;
          return { name: 't', description: 'd', camera: { scale: 300 },
            world: { boundary: 'none', size: 0 }, seed: 11,
            physics: Object.assign({}, PH, { kFrame: 1 }), bodies: [d, r] };
        };
        const S = HP.sim;
        // 群コアなし: 形も経路も従来どおり
        const v0 = HP.validatePreset(mk(null, null)); S.build(v0.preset);
        let md0 = 0; for (let i = 0; i < S.n; i++) md0 += S.coreMd[i];
        const zero = { hasV2: S.hasCoreV2, md: md0, n: S.n };
        // 群コアあり(disk=differential・ring=cavity)
        const v = HP.validatePreset(mk({ mode: 'differential', massFrac: 0.3, radius: 1.5, omega: 4 },
          { mode: 'cavity', voidFraction: 0.4, radius: 1.2, omega: 0 }));
        S.build(v.preset);
        const md = [], rc = [];
        for (let i = 0; i < S.n; i++) { md.push(S.coreMd[i]); rc.push(S.RcV[i]); }
        const L0 = S.totals().L + S.resL + S.radL;
        const om0 = HP.coreState(0).omega;
        for (let k = 0; k < 600; k++) S.step(0.016);
        const L1 = S.totals().L + S.resL + S.radL;
        let lScale = 0;
        for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
          + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]) + Math.abs(S.coreJ[i]);
        return { warn: v.warnings.length, ok: v.ok, keep: !!v.preset.bodies[0].core,
          zero, n: S.n, hasV2: S.hasCoreV2, nDiff: md.filter(m => m === 2).length,
          nCav: md.filter(m => m === 4).length, rcMin: Math.min(...rc),
          om0, om1: HP.coreState(0).omega, lsw: S.lSw[0],
          relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), nan: S.hasNaN() };
      }, PH80);
      add('core.group-core',
        gc.ok && gc.warn === 0 && gc.keep && !gc.nan && gc.n === 12
        && gc.nDiff === 6 && gc.nCav === 6 && gc.rcMin > 0 && gc.relL < 1e-3
        && !gc.zero.hasV2 && gc.zero.md === 0 && gc.zero.n === 12,
        `disk 6粒=differential・ring 6粒=cavity(全メンバーに同一設定)/ R_c min=${gc.rcMin}(>0) コアΩ=${gc.om1.toFixed(3)} lSw=${gc.lsw.toFixed(3)}/ ` +
        `帳簿込み|ΔL|=${gc.relL.toExponential(1)}(<1e-3・600步)/ core 無しの同構成: hasCoreV2=${gc.zero.hasV2}(false) ΣcoreMd=${gc.zero.md}(=0 — ゼロコスト経路)`);

      // ④ core.merge-split: 融合はコアを保存則ベースで合算(M_c 和・R_c は面積等価 √和・
      //    J_c と E_int は厳密和)、分裂は質量比例で分配(J_c/E_int の和が親と厳密一致・
      //    R_c,1²+R_c,2²=R_c²)。第77便の「非継承+J をリザーバへ退避」を置き換えたので、
      //    融合で resL が動かないことも同時に固定する
      const ms = await page.evaluate((PH) => {
        const S = HP.sim;
        const base = (bodies, fusion) => ({ name: 't', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, seed: 5, thermal: 'tint', fusion,
          physics: Object.assign({}, PH, { G: 0.2, cHeat: 0.2 }), bodies });
        // --- 融合 ---
        const vF = HP.validatePreset(base([
          { type: 'single', rMul: 1, m: 4, x: -6, y: 0, vx: 5, vy: 0, spin: 0, pinned: false, tInt: 1,
            core: { mode: 'differential', massFrac: 0.3, radius: 1, omega: 5, internalEnergy: 7 } },
          { type: 'single', rMul: 1, m: 4, x: 6, y: 0, vx: -5, vy: 0, spin: 0, pinned: false, tInt: 1,
            core: { mode: 'differential', massFrac: 0.5, radius: 1.5, omega: -2, internalEnergy: 3 } }],
          { dFrac: 0.7 }));
        S.build(vF.preset);
        const a0 = HP.coreState(0), b0 = HP.coreState(1);
        const fJ0 = a0.J + b0.J, fE0 = a0.Eint + b0.Eint, fM0 = a0.mass + b0.mass;
        const fL0 = S.totals().L + S.resL + S.radL, resL0 = S.resL;
        for (let k = 0; k < 300 && S.fusN === 0; k++) S.step(0.016);
        const a1 = S.fusN ? HP.coreState(0) : null;
        const fus = { n: S.fusN, nPart: S.n,
          J0: fJ0, J1: a1 ? a1.J : NaN, E0: fE0, E1: a1 ? a1.Eint : NaN,
          M0: fM0, M1: a1 ? a1.mass : NaN, mode: a1 ? a1.mode : '',
          Rc: a1 ? a1.Rc : NaN, RcExp: Math.sqrt(1 * 1 + 1.5 * 1.5),
          dResL: S.resL - resL0, dL: Math.abs((S.totals().L + S.resL + S.radL) - fL0),
          nan: S.hasNaN() };
        // --- 分裂 ---
        const vS = HP.validatePreset(base([
          { type: 'single', rMul: 1, m: 2, x: 0, y: 0, vx: 0.5, vy: -0.3, spin: 1.2, pinned: false, tInt: 100,
            core: { mode: 'active', massFrac: 0.3, radius: 1, omega: 4, sourceRate: 2, internalEnergy: 6 } }],
          { dFrac: 0.35, fission: { Tcrit: 50, frac: 0.5 } }));
        S.build(vS.preset);
        const c0 = HP.coreState(0);
        S.step(0.016);
        const p = HP.coreState(0), q = S.n > 1 ? HP.coreState(1) : null;
        const inj = S.coreSrcE;   // 分裂と同じサブステップで注入された分(E_int の突き合わせに要る)
        const spl = { n: S.n, fisN: S.fisN,
          J0: c0.J, Jsum: q ? p.J + q.J : NaN, E0: c0.Eint + inj, Esum: q ? p.Eint + q.Eint : NaN,
          Rc0: c0.Rc, RcSq: q ? p.Rc * p.Rc + q.Rc * q.Rc : NaN,
          mf0: c0.massFrac, mf1: p.massFrac, mf2: q ? q.massFrac : NaN,
          mode: p.mode, mode2: q ? q.mode : '', nan: S.hasNaN() };
        return { fus, spl };
      }, PH80);
      const f = ms.fus, s2 = ms.spl;
      add('core.merge-split',
        !f.nan && !s2.nan && f.n === 1 && f.nPart === 1 && f.mode === 'differential'
        && f.J1 === f.J0 && f.E1 === f.E0 && Math.abs(f.M1 - f.M0) < 1e-6
        && Math.abs(f.Rc - f.RcExp) < 1e-6 && f.dResL === 0 && f.dL < 1e-5
        && s2.n === 2 && s2.fisN === 1 && s2.mode === 'active' && s2.mode2 === 'active'
        && Math.abs(s2.Jsum - s2.J0) < 1e-12 && Math.abs(s2.Esum - s2.E0) < 1e-12
        && Math.abs(s2.RcSq - s2.Rc0 * s2.Rc0) < 1e-6 && s2.mf1 === s2.mf0 && s2.mf2 === s2.mf0,
        `融合: J_c ${f.J0}→${f.J1}(厳密和) E_int ${f.E0}→${f.E1}(厳密和) M_c ${f.M0.toFixed(6)}→${f.M1.toFixed(6)} ` +
        `R_c=${f.Rc.toFixed(6)}(面積等価 √(1²+1.5²)=${f.RcExp.toFixed(6)})/ リザーバ退避 ΔresL=${f.dResL}(=0 — 継承なので不要)・帳簿込み|ΔL|=${f.dL.toExponential(1)}/ ` +
        `分裂: J_c ${s2.J0}→${s2.Jsum}(和が厳密一致) E_int ${s2.E0}→${s2.Esum} R_c²=${s2.Rc0 * s2.Rc0}→${s2.RcSq.toFixed(6)}(和が不変) massFrac=${s2.mf1}(両片とも親と同値)`);

      // ⑤ core.schema-roundtrip: 第81便 — エクスポートは **schemaVersion 4** で、コアは core:{} のみ
      //    (第80便の旧キー併記 withLegacyCore は廃止)。読み戻しても core の値が 1 つも壊れず、
      //    旧キーは 1 つも書き出されない(=読み戻しの警告 0 件)
      const rt = await page.evaluate(() => {
        const keep = localStorage.getItem('hp_custom_presets');
        try {
          const src = { id: 'custom_qa_core80', name: 'core80', description: 'roundtrip',
            camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, seed: 3,
            physics: { radiusScale: 1 },
            bodies: [
              { type: 'single', m: 30, x: 0, y: 0, vx: 0, vy: 0, spin: 0.5, pinned: false, radius: 5,
                core: { mode: 'differential', massFrac: 0.3, radius: 2, omega: 1.5, Kcs: 0.2,
                  pump: 0.4, contract: 0.01, sourceRate: 0, internalEnergy: 0, voidFraction: 0 } },
              { type: 'single', m: 30, x: 40, y: 0, vx: 0, vy: 0, spin: 0.5, pinned: false, radius: 5,
                core: { mode: 'cavity', voidFraction: 0.5, radius: 2, omega: 1.5 } }] };
          const v0 = HP.validatePreset(src);
          localStorage.setItem('hp_custom_presets', JSON.stringify([Object.assign({ id: src.id }, v0.preset)]));
          const ex = JSON.parse(HP.exportData());
          const b0 = ex.customPresets[0].bodies[0], b1 = ex.customPresets[0].bodies[1];
          // 読み戻し(新形式優先+併記警告)
          const back = HP.validatePreset(ex.customPresets[0]);
          const c0 = back.ok ? back.preset.bodies[0].core : null;
          const c1 = back.ok ? back.preset.bodies[1].core : null;
          const noLegacy = [b0, b1].every(b => b.coreMR === undefined && b.coreSR === undefined
            && b.coreRR === undefined);
          return { schema: ex.schemaVersion, ok: v0.ok, warn0: v0.warnings.length, noLegacy,
            keepCore0: !!b0.core, keepCore1: !!b1.core,
            backOk: back.ok, backWarn: back.warnings.length,
            backMR: back.ok ? (back.preset.bodies[0].coreMR || 0) : 0,
            c0, c1 };
        } finally {
          if (keep === null) localStorage.removeItem('hp_custom_presets');
          else localStorage.setItem('hp_custom_presets', keep);
        }
      });
      const c0 = rt.c0 || {}, c1 = rt.c1 || {};
      add('core.schema-roundtrip',
        rt.schema === 4 && rt.ok && rt.warn0 === 0 && rt.keepCore0 && rt.keepCore1
        && rt.noLegacy                                   // 第81便: 旧キーは 1 つも書き出さない
        && rt.backOk && rt.backWarn === 0 && rt.backMR === 0
        && c0.mode === 'differential' && c0.massFrac === 0.3 && c0.radius === 2 && c0.omega === 1.5
        && c0.Kcs === 0.2 && c0.pump === 0.4 && c0.contract === 0.01
        && c1.mode === 'cavity' && c1.voidFraction === 0.5 && c1.radius === 2 && c1.omega === 1.5,
        `export: schemaVersion=${rt.schema}(=4)/ 旧キー併記なし=${rt.noLegacy}(第81便でコアv1 廃止)/ ` +
        `読み戻し: core 保持=${rt.backOk}(警告${rt.backWarn}件=0)・` +
        `mode=${c0.mode}/${c1.mode} 値の欠落なし`);
    } else {
      console.log('SKIP core.active-energy / core.cavity-no-negative-mass / core.group-core / core.merge-split / core.schema-roundtrip(対象に第80便 コアv2 残段 未適用 — root 等)');
    }
  }

  // ---- 8a2b5) 第75便: 🐚nebulaShell — 重殻+高速コアの耐圧試験 ----
  // 熱圧 kRep=0.3 の下で「同じ暗さ」を保てるのは 2層だけであることを機械固定する:
  // 2層(既定)= コア lS̄ 0.8〜0.95・保持≥0.93・エンベロープ保持=1 ⇔ 単層対照(同一幾何・
  // 同一質量・spin6 で同等の暗さ)= 保持 0.4〜0.6 に自壊・エンベロープ|spin| 攪乱が2層の2.5倍超。
  // 較正実測(exp-4-76): 2層 lS̄0.886/保持0.963/env|spin|0.968 ⇔ 単層 lS̄0.954/保持0.481/3.769
  {
    const hasShell = await page.evaluate(() => HP.allPresets().some(p => p.id === 'nebulaShell'));
    if (hasShell) {
      const r = await page.evaluate(() => {
        const run = (mod) => {
          const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'nebulaShell')));
          if (mod) for (let bi = 0; bi < 3; bi++) { const b = p.bodies[bi];
            // 第81便: コアv2 の core:{} と旧コアv1 の両キーを外して単層化する
            // (root 等の旧ビルドではプリセットが旧キーを持つため、両方消さないと単層にならない)
            delete b.core; delete b.coreMR; delete b.coreSR; delete b.coreRR;
            b.spinMin = 4.8; b.spinMax = 7.2; }
          HP.sim.build(p);
          const S = HP.sim;
          for (let k = 0; k < 3000; k++) S.step(0.016);
          let lS = 0, keep = 0, envKeep = 0, envSp = 0;
          for (let i = 0; i < 54; i++) { lS += S.lSw[i] / 54; if (Math.hypot(S.x[i], S.y[i]) < 400) keep++; }
          for (let i = 54; i < S.n; i++) { if (Math.hypot(S.x[i], S.y[i]) < 400) envKeep++;
            envSp += Math.abs(S.spin[i]) / (S.n - 54); }
          return { lS, keep: keep / 54, envKeep: envKeep / (S.n - 54), envSp, bad: S.hasNaN() };
        };
        return { two: run(false), one: run(true) };
      });
      add('claim.nebulashell-stress',
        !r.two.bad && !r.one.bad
        && r.two.lS >= 0.8 && r.two.lS <= 0.95 && r.two.keep >= 0.93 && r.two.envKeep === 1
        && r.one.lS >= 0.9 && r.one.keep >= 0.4 && r.one.keep <= 0.6
        && r.one.envSp > 2.5 * r.two.envSp,
        `2層: lS̄=${r.two.lS.toFixed(3)}(窓0.8〜0.95) 保持=${r.two.keep.toFixed(3)}(≥0.93) env保持=${r.two.envKeep} / ` +
        `単層(spin6・同等暗さ${r.one.lS.toFixed(3)}): 保持=${r.one.keep.toFixed(3)}(0.4〜0.6 — 熱圧で自壊) ` +
        `env|spin| ${r.one.envSp.toFixed(2)} vs ${r.two.envSp.toFixed(2)}(>2.5倍 — 影響範囲の狭さ)`);
    } else {
      console.log('SKIP claim.nebulashell-stress(対象に 🐚nebulaShell なし — root 等。第75便)');
    }
  }

  // ---- 8a2b6) 第75便: ⏳nebulaBipolar — 極方向ローブ(E5′圧力+幾何) ----
  // 系外(r>200)到達ガスの ±y30°以内割合が 0.5〜0.72(等方1/3 — 実測0.610)・脱出数30〜55・
  // 中心 lSw>0.95・アーク帯 lS̄>0.85(暗黒帯)。対照は kRep=0(圧力オフ)で脱出≤3(実測0)。
  // ※ガスのスピンを0にするだけでは対照にならない — 中心・アークの回転が E6′残余トルクで
  //   スピンを再注入し圧力が再点火する(実測32体脱出 — 説明文に明記済み)
  {
    const hasBip = await page.evaluate(() => HP.allPresets().some(p => p.id === 'nebulaBipolar'));
    if (hasBip) {
      const r = await page.evaluate(() => {
        HP.loadPreset('nebulaBipolar', false);
        HP.abStart('kRep', 0);
        const abG = HP.ab();
        const S = HP.sim, B = abG.simB;
        for (let k = 0; k < 6000; k++) { S.step(0.016); B.step(0.016); }
        const escOf = (sm) => { let esc = 0, polar = 0;
          for (let i = 23; i < sm.n; i++) { const rr = Math.hypot(sm.x[i], sm.y[i]);
            if (rr > 200) { esc++; if (Math.atan2(Math.abs(sm.x[i]), Math.abs(sm.y[i])) < Math.PI / 6) polar++; } }
          return { esc, polar }; };
        const a = escOf(S), c = escOf(B);
        let lSt = 0; for (let i = 1; i < 23; i++) lSt += S.lSw[i] / 22;
        const res = { esc: a.esc, frac: a.esc ? a.polar / a.esc : 0, ctrlEsc: c.esc,
          lSwC: S.lSw[0], lSwArc: lSt, bad: S.hasNaN() || B.hasNaN() };
        HP.abStop();
        return res;
      });
      add('claim.nebulabipolar-polar',
        !r.bad && r.esc >= 30 && r.esc <= 55 && r.frac >= 0.5 && r.frac <= 0.72
        && r.lSwC > 0.95 && r.lSwArc > 0.85 && r.ctrlEsc <= 3,
        `脱出=${r.esc}(30〜55) 極方向比=${r.frac.toFixed(3)}(窓0.5〜0.72・等方1/3・実測0.610) / ` +
        `中心lSw=${r.lSwC.toFixed(2)}(>0.95) アーク帯lS̄=${r.lSwArc.toFixed(3)}(>0.85) / ` +
        `スピン0対照 脱出=${r.ctrlEsc}(≤3 — 圧力が唯一の駆動源)`);
    } else {
      console.log('SKIP claim.nebulabipolar-polar(対象に ⏳nebulaBipolar なし — root 等。第75便)');
    }
  }

  // ---- 8a2b7) 第84便B(創発の標準試験を ⏳ へ展開): claim.nebulabipolar-multiseed ----
  // 「たまたま極方向に出た1本」ではないことを、seed を振って機械固定する。判定量は claims の
  // nebulaBipolar.multi-seed-min-polar-fraction =「seed 集合を通した極方向比の**最小値**」。
  // 内蔵 seed は claim.nebulabipolar-polar が既に見ているので、QA は内蔵 seed **以外**の
  // 3seed(20260805〜20260807)だけを回す縮約版。16seed の分布は tests/exp-4-88.mjs が正本。
  // ⏳ は赤道アーク22個が pinned(=外部固定の幾何)なので E水準は **E1**(外部駆動下の
  // 自己組織化)で、閉鎖系を要件とする E2/E3 には定義上該当しない — その宣言も併せて固定する。
  // 軽い(83粒子×6000步×6構成 ≈ 10s)が、方針どおり QA_FAST=1 では実行しない(FAST への時間増ゼロ)。
  if (!FAST) {
    const hasBipMS = await page.evaluate(() => HP.allPresets().some(p => p.id === 'nebulaBipolar'
      && Array.isArray(p.claims)
      && p.claims.some(c => c.id === 'nebulaBipolar.multi-seed-min-polar-fraction')));
    if (hasBipMS) {
      const r = await page.evaluate((seeds) => {
        const P = HP.allPresets().find(q => q.id === 'nebulaBipolar');
        const NARC = P.bodies.filter(b => b.pinned).length;   // 赤道ダークアーク(=22)
        const GAS0 = NARC + 1;                                 // ガスの先頭 index(=23)
        const run = (seed, kRep) => {
          const p = JSON.parse(JSON.stringify(P));
          p.seed = seed;
          if (kRep !== undefined) p.physics.kRep = kRep;
          const v = HP.validatePreset(p);
          if (!v.ok) return { seed, err: v.errors.join(',') };
          HP.sim.build(v.preset);
          const s = HP.sim;
          for (let k = 0; k < 6000; k++) s.step(0.016);
          let esc = 0, pol = 0, lSwArc = 0;
          for (let i = GAS0; i < s.n; i++) { const rr = Math.hypot(s.x[i], s.y[i]);
            if (rr > 200) { esc++;
              if (Math.atan2(Math.abs(s.x[i]), Math.abs(s.y[i])) < Math.PI / 6) pol++; } }
          for (let i = 1; i <= NARC; i++) lSwArc += s.lSw[i] / NARC;
          return { seed, esc, frac: esc ? pol / esc : 0, lSwC: s.lSw[0], lSwArc,
            nGas: s.n - GAS0, nan: s.hasNaN() };
        };
        return { main: seeds.map(sd => run(sd, undefined)), ctrl: seeds.map(sd => run(sd, 0)),
          claim: P.claims.find(c => c.id === 'nebulaBipolar.multi-seed-min-polar-fraction'),
          emergence: P.emergence, nPin: NARC, nAll: HP.sim.n };
      }, [20260805, 20260806, 20260807]);
      const C = r.claim;
      const fr = r.main.map(v => v.frac);
      const minF = Math.min(...fr), maxF = Math.max(...fr);
      const ctrlEscMax = Math.max(...r.ctrl.map(v => v.esc));
      add('claim.nebulabipolar-multiseed',
        r.emergence === 'E1'
        && r.main.every(v => !v.err && !v.nan) && r.ctrl.every(v => !v.err && !v.nan)
        && minF >= C.expected.min && maxF <= C.expected.max
        && ctrlEscMax <= C.control.expected.max
        && minF > 1 / 3 && r.main.every(v => v.esc >= 20 && v.lSwC > 0.95 && v.lSwArc > 0.85),
        `${r.main.length}seed(${r.main.map(v => v.seed).join('/')}・内蔵seedは claim.nebulabipolar-polar が担当)` +
        ` 6000步 極方向比 ${fr.map(v => v.toFixed(3)).join('/')} → **最小=${minF.toFixed(3)}**` +
        `(claim 窓 ${C.expected.min}〜${C.expected.max}・等方 1/3=0.333 — 最小でも` +
        `${(minF / (1 / 3)).toFixed(2)}倍の集中) / ` +
        `脱出 ${r.main.map(v => v.esc + '/' + v.nGas).join(' ')}(各≥20) / ` +
        `圧力オフ対照(kRep=0)の脱出 ${r.ctrl.map(v => v.esc).join('/')}(最大 ≤${C.control.expected.max}) / ` +
        `中心lSw ${r.main.map(v => v.lSwC.toFixed(2)).join('/')}(>0.95) ` +
        `アーク帯lS̄ ${r.main.map(v => v.lSwArc.toFixed(3)).join('/')}(>0.85) / ` +
        `E水準=${r.emergence}(赤道アーク22体が pinned = 外部固定の幾何なので閉鎖系ではなく、` +
        `E2/E3 には定義上該当しない — 第84便B) / 16seed の分布の正本は tests/exp-4-88.mjs`);
    } else {
      console.log('SKIP claim.nebulabipolar-multiseed(対象に ⏳ の multi-seed claim なし — 第84便B 未適用の root 等)');
    }
  }

  // ---- 8a2c) 第70便: 減光(lightSweep)の力学不変性 — 「暗いが重い」の機械証明 ----
  // 減光は光学のみ(観測温度と放射冷却)に作用し、etaRad=0 では軌道・スピン・固有時計・光線が
  // 1 bit も変わらないことを機械固定する(ChatGPT レビュー §8.2 実験1の QA 化 — 隠れ質量実験の
  // 前提)。disk 群の新属性 lightSweep:"auto"(第70便)の配線検査を兼ねる。
  // 較正実測(exp-4-70 E2): 121粒子×2000步で 力学差=0(auto/固定1とも)・光線差=0・auto配線=121/121
  {
    const hasDiskLsw = await page.evaluate(() => {
      HP.sim.build({ id: 'qa_dlsw', name: 'p', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 },
        physics: { G: 0, D0: 1, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
          Kt: 60, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 },
        bodies: [{ type: 'disk', n: 8, cx: 0, cy: 0, radius: 100, mMin: 1, mMax: 1,
          spinMin: 1, spinMax: 1, vMode: 'none', aroundMass: 0, vScale: 0, direction: 1,
          lightSweep: 'auto' }] });
      let c = 0; for (let i = 0; i < HP.sim.n; i++) if (HP.sim.lSwAuto[i]) c++;
      return c === HP.sim.n && HP.sim.n === 8;
    });
    if (hasDiskLsw) {
      const r = await page.evaluate(() => {
        const build = (lsw) => {
          HP.sim.build({ id: 'qa_dim', name: 'd', description: 'd', camera: { scale: 300 },
            world: { boundary: 'none', size: 0 }, seed: 20260804,
            physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0.5, muF: 0.3, gammaN: 0.2, kappaS: 0.05,
              Kt: 50, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
              geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
            bodies: [
              { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15,
                ...(lsw === null ? {} : { lightSweep: lsw }) },
              { type: 'disk', rMul: 1.2, n: 120, cx: 0, cy: 0, radius: 220, mMin: 0.2, mMax: 0.5,
                spinMin: 0.5, spinMax: 1.5, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
                bulkVx: 0, bulkVy: 0, ...(lsw === null ? {} : { lightSweep: lsw }) }] });
          return HP.sim;
        };
        const run = (lsw) => {
          const S = build(lsw);
          let auto = 0; for (let i = 0; i < S.n; i++) if (S.lSwAuto[i]) auto++;
          for (let k = 0; k < 2000; k++) S.step(0.016);
          let dimmed = 0; for (let i = 0; i < S.n; i++) if (S.lSw[i] > 0) dimmed++;
          const ray = HP.traceRay(S, -400, 30, 1, 0, 2, 400, null);
          return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin],
            tau: [...S.tau], ray: [ray.cx, ray.cy], auto, dimmed, n: S.n };
        };
        const a = run(null), b = run('auto'), c = run(1);
        const diffCount = (p, q) => { let d = 0;
          for (let i = 0; i < p.x.length; i++)
            for (const kk of ['x', 'y', 'vx', 'vy', 'sp', 'tau']) if (p[kk][i] !== q[kk][i]) d++;
          return d; };
        HP.loadPreset('saturn', false);
        return { n: a.n, autoB: b.auto, dimmedB: b.dimmed, dimmedC: c.dimmed,
          dA: diffCount(a, b), dC: diffCount(a, c),
          rayA: Math.hypot(a.ray[0] - b.ray[0], a.ray[1] - b.ray[1]),
          rayC: Math.hypot(a.ray[0] - c.ray[0], a.ray[1] - c.ray[1]) };
      });
      add('dimming.dynamics-invariant',
        r.dA === 0 && r.dC === 0 && r.rayA === 0 && r.rayC === 0
        && r.autoB === r.n && r.dimmedB === r.n && r.dimmedC === r.n,
        `減光なし vs auto vs 固定1(${r.n}粒子・2000步・etaRad=0): 力学+時計の不一致=` +
        `${r.dA}/${r.dC}(厳密0 — x,y,vx,vy,spin,τ)・光線差=${r.rayA}/${r.rayC}(厳密0)/ ` +
        `disk群 lightSweep:"auto" 配線=${r.autoB}/${r.n}・実効減光>0=${r.dimmedB}/${r.n} — ` +
        `減光は光学のみ(「暗いが重い」天体の前提の機械証明)`);
    } else {
      console.log('SKIP dimming.dynamics-invariant(対象に disk 群 lightSweep 未対応 — root 等。第70便)');
    }
  }

  // ---- 8a2d) 第71便 P0: E6′③反作用の1サブステップ上限(|Δv|≤16・帳簿化) ----
  // D0=0+極端質量比(1:10⁴)で③反作用が軽い側へ全recoilし発振→速度クランプに到達する既存特性
  // (第70便実測・legacyから)への対策。上限16の較正: 全内蔵プリセットの per-particle 最大
  // |Δv|/サブステップ = darkrotor 7.52・merger 1.59・他≤1e-4 ⇔ 病的構成 9406(千倍の分離)。
  // 検査: ①病的構成で発動+発振停止(v最大<20・速度クランプ0)+P が帳簿込みで閉じる
  //       ②正規のドラッグ系(darkrotor/galaxy)では発動0(既存挙動 bit 不変 — baseline QA も担保)
  // 機能判定子 = S.clampRN の有無(root は SKIP)
  {
    const hasRN = await page.evaluate(() => {
      HP.loadPreset('galaxy', false); return HP.sim.clampRN !== undefined; });
    if (hasRN) {
      const r = await page.evaluate(() => {
        const A = HP.RAY_ALPHA_MIN, PN_R = 12.247, pnThr = (A / 4) * 1600 * Math.max(PN_R, 0.5);
        HP.sim.build({ id: 'qa_rcap', name: 's', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 },
          physics: { G: 1, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
            Kt: 10000, cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
            geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
          bodies: [
            { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false },
            { type: 'single', m: 0.01, x: 47.664, y: 0, vx: 0, vy: 1.94787, spin: 0, pinned: false }] });
        const S = HP.sim;
        // 第72便(ChatGPT Release レビュー P1): 運動量に加えて**角運動量も帳簿込みで**検証する
        // (資本の式は保存則モニタと同形: L = Σ[m(x×v) + I·s] + resL。スピンクランプ±40 の
        // 発動分だけは帳簿外〔既存の設計どおり clampSN に計数〕なので、その分を許容窓に含める)
        const tot = () => { let px = 0, py = 0, L = 0;
          for (let i = 0; i < S.n; i++) { px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i];
            L += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) + 0.5 * S.m[i] * S.R[i] * S.R[i] * S.spin[i]; }
          return { px: px + S.resPx, py: py + S.resPy, L: L + S.resL }; };
        const t0 = tot(); let vMax = 0;
        for (let k = 0; k < 2000; k++) { S.step(0.016); vMax = Math.max(vMax, Math.hypot(S.vx[1], S.vy[1])); }
        const t1 = tot();
        let lScale = Math.abs(t0.L); for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]));
        const patho = { clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN, vMax,
          dP: Math.hypot(t1.px - t0.px, t1.py - t0.py),
          dL: Math.abs(t1.L - t0.L), lScale,
          res: Math.hypot(S.resPx, S.resPy), nan: S.hasNaN() };
        // 第72便(同レビュー P1): 無発動の確認を正規ドラッグ系の**有効窓相当**へ延長
        // (🕶️=6000步〔腕の分離窓〕・🌠merger=4000步。較正実測の 6000/24000步 不発〔第71便〕の
        //  QA 側スナップショット — 全 6000步走査は夜間ジョブ相当のため代表2系+piggyback で担保)
        const inert = (id, steps) => { HP.loadPreset(id, false);
          for (let k = 0; k < steps; k++) HP.sim.step(0.016);
          return HP.sim.clampRN; };
        const drN = inert('darkrotor', 6000), mgN = inert('merger', 4000);
        HP.loadPreset('saturn', false);
        return { patho, drN, mgN };
      });
      const relL = r.patho.dL / Math.max(1, r.patho.lScale);
      add('clamp.reaction-cap',
        !r.patho.nan && r.patho.clampR > 0 && r.patho.clampV === 0 && r.patho.vMax < 20
        && r.patho.dP < 0.05 && relL < 2e-3 && r.patho.res > 1 && r.drN === 0 && r.mgN === 0,
        `病的構成(D0=0・質量比1:1.2e4・2000步): 発動=${r.patho.clampR}回・速度クランプ=${r.patho.clampV}` +
        `(旧実測1998回 → 0)・惑星 v最大=${r.patho.vMax.toFixed(1)}(<20・旧100)・` +
        `|ΔΣP|帳簿込み=${r.patho.dP.toExponential(1)}(<0.05)・|ΔΣL|帳簿込み/スケール=` +
        `${relL.toExponential(1)}(<2e-3・スピンクランプ${r.patho.clampS}回分は帳簿外)・` +
        `リザーバ吸収=${r.patho.res.toFixed(1)} / 正規ドラッグ系は不発: 🕶️6000步=${r.drN}回・` +
        `🌠merger4000步=${r.mgN}回(=0 — 既存挙動 bit 不変)`);
    } else {
      console.log('SKIP clamp.reaction-cap(対象に clampRN なし — root 等。第71便 P0)');
    }
  }

  // ---- 8a3) 第69便 P4b(E12v2): geoPN=2 — v−u 統一測地線則(beta 先行) ----
  // DERIVATIONS §18 の実装アンカーを機械固定する: ①kF=0 で geoPN=1 と bit 等価(段階導入)
  // ③共動連星(ガリレイ共変性のエンジン版 — P4a-2)⑤保存則(反作用返しで P・L が対で閉じる)。
  // ②☿回帰は ①+既存 behavior.mercury-builtin が担い、④🎡リトマスは exp-p4b.mjs(裁定材料)。
  // 較正実測(2026-08-03 第69便): bitDiff=0 / 共動 relDev=0.75% / 保存 relP=1.3e-6・relL=6.6e-6
  // (geoPN=1 の開放 1PN は relL=1.7e-4 — 対反作用で約26倍閉じる)。
  // 機能判定子 = geoPN=2 で 1 步進めたとき _core が ∇u 勾配集積(S._g2)を確保するか(root は SKIP)
  {
    const hasGeo2 = await page.evaluate(() => {
      HP.sim.build({ id: 'qa_g2probe', name: 'p', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 },
        physics: { G: 1, D0: 0.05, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
          Kt: 10000, cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
        bodies: [
          { type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
          { type: 'single', m: 0.01, x: 40, y: 0, vx: 0, vy: 1, spin: 0, pinned: false }] });
      HP.sim.step(0.016);
      return !!HP.sim._g2;
    });
    if (hasGeo2) {
      const r = await page.evaluate(() => {
        const A = HP.RAY_ALPHA_MIN;
        const PN_R = 12.247, pnThr = (A / 4) * 1600 * Math.max(PN_R, 0.5);
        const PHYS = { G: 1, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
          Kt: 10000, cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 };
        const build = (over, bodies) => {
          HP.sim.build({ id: 'qa_g2', name: 'p', description: 'd', camera: { scale: 300 },
            world: { boundary: 'none', size: 0 }, physics: { ...PHYS, ...over }, bodies });
          return HP.sim;
        };
        // ① bit 等価(☿型: pinned 1PN 源+スピン・kFrame=0)— 全状態の厳密一致を数える
        const stateRun = (geoPN) => {
          const S = build({ geoPN, kFrame: 0, D0: 0.05 }, [
            { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 0, y: 0, vx: 0, vy: 0, spin: 0.5, pinned: true },
            { type: 'single', m: 0.01, x: 47.664, y: 0, vx: 0, vy: 1.94787, spin: 0.1, pinned: false }]);
          for (let k = 0; k < 1500; k++) S.step(0.016);
          return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin] };
        };
        const s2 = stateRun(2), s1 = stateRun(1);
        let bitDiff = 0;
        for (let i = 0; i < s2.x.length; i++)
          for (const kk of ['x', 'y', 'vx', 'vy', 'sp']) if (s2[kk][i] !== s1[kk][i]) bitDiff++;
        // ③ 共動連星(等質量の自由 1PN 源対+トレーサ・D0=0)。V=3 ブーストの前後で
        //   連星間距離の窓平均(位相に鈍い観測量)が一致するか
        const binBodies = (V) => [
          { type: 'single', m: pnThr * 1.2, radius: PN_R, x: -40, y: 0, vx: V, vy: -0.9, spin: 0.5, pinned: false },
          { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 40, y: 0, vx: V, vy: 0.9, spin: 0.5, pinned: false },
          { type: 'single', m: 0.01, x: 0, y: 180, vx: V + 1.1, vy: 0, spin: 0, pinned: false }];
        const comoving = (V) => {
          const S = build({}, binBodies(V));
          let sepSum = 0, c = 0;
          for (let k = 0; k < 2000; k++) { S.step(0.016);
            if (k >= 1200 && k % 10 === 0) { sepSum += Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]); c++; } }
          return { sep: sepSum / c, clampV: S.clampVN, nan: S.hasNaN() };
        };
        const rest = comoving(0), boost = comoving(3);
        // ⑤ 保存則(全粒子自由・D0=0 → リザーバ帳簿もゼロのまま)。ΣP・ΣL(軌道+スピン+res)
        //   の 3000 步ドリフトを geoPN=1(開放 1PN)と比較する
        const cons = (geoPN) => {
          const S = build({ geoPN }, [
            { type: 'single', m: pnThr * 1.2, radius: PN_R, x: -40, y: 0, vx: 0, vy: -1.1, spin: 0.8, pinned: false },
            { type: 'single', m: pnThr * 1.2, radius: PN_R, x: 40, y: 0, vx: 0, vy: 1.1, spin: 0.8, pinned: false },
            { type: 'single', m: 0.01, x: 150, y: 0, vx: 0, vy: 1.6, spin: 0, pinned: false },
            { type: 'single', m: 0.01, x: 0, y: -170, vx: 1.5, vy: 0, spin: 0, pinned: false }]);
          const tot = () => { let px = 0, py = 0, L = 0;
            for (let i = 0; i < S.n; i++) { px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i];
              L += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) + 0.5 * S.m[i] * S.R[i] * S.R[i] * S.spin[i]; }
            return { px: px + S.resPx, py: py + S.resPy, L: L + S.resL }; };
          const t0 = tot();
          for (let k = 0; k < 3000; k++) S.step(0.016);
          const t1 = tot();
          let pS = 0; for (let i = 0; i < S.n; i++) pS += S.m[i] * Math.hypot(S.vx[i], S.vy[i]);
          return { dP: Math.hypot(t1.px - t0.px, t1.py - t0.py), dL: Math.abs(t1.L - t0.L),
            pScale: pS, L0: Math.abs(t0.L), resP: Math.hypot(S.resPx, S.resPy), nan: S.hasNaN() };
        };
        const c2 = cons(2), c1 = cons(1);
        HP.loadPreset('saturn', false);
        return { bitDiff, n: s2.x.length, rest, boost, c2, c1 };
      });
      const relDev = Math.abs(r.boost.sep - r.rest.sep) / r.rest.sep;
      add('geo2.kf0-bitequal', r.bitDiff === 0,
        `geoPN=2∧kFrame=0 ≡ geoPN=1(☿型 pinned 源・1500步): 全状態(x,y,vx,vy,spin×${r.n}粒子)の` +
        `不一致=${r.bitDiff}(厳密0 — P4a-4 のエンジン版・段階導入アンカー)`);
      add('geo2.comoving', !r.rest.nan && !r.boost.nan && r.rest.clampV === 0 && r.boost.clampV === 0
        && relDev < 0.03,
        `共動連星(等質量自由源対・D0=0・2000步): V=0 の分離窓平均=${r.rest.sep.toFixed(2)} ⇔ ` +
        `V=3 ブースト=${r.boost.sep.toFixed(2)} 相対差=${(relDev * 100).toFixed(2)}%(<3%・較正実測0.75%) — ` +
        `統一則のガリレイ共変性(P4a-2 のエンジン版。現行 E12 の絶対 v は式レベルで 34% 破れ)`);
      const relP2 = r.c2.dP / r.c2.pScale, relL2 = r.c2.dL / r.c2.L0, relL1 = r.c1.dL / r.c1.L0;
      add('geo2.conservation', !r.c2.nan && !r.c1.nan && r.c2.resP === 0
        && relP2 < 1e-4 && relL2 < 1e-4 && relL2 < relL1 * 0.2,
        `自由連星+惑星2(D0=0・3000步)の帳簿: geoPN=2 で |ΔΣP|/Σm|v|=${relP2.toExponential(2)}` +
        `(<1e-4)・|ΔΣL|/|L₀|=${relL2.toExponential(2)}(<1e-4・リザーバ=0のまま) ⇔ ` +
        `geoPN=1(開放 1PN)は ΔL 比=${relL1.toExponential(2)} — 対反作用で ${(relL1 / relL2).toFixed(1)}倍閉じる` +
        `(較正実測26倍。§18.4 反作用返し)`);
    } else {
      console.log('SKIP geo2.*(対象に geoPN=2 未実装 — root 等。第69便 P4b/E12v2)');
    }
  }

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

// ---- 8b81) 第81便 B: 🪜massLadder — 隠れ質量ラダーの固定seed受入 ----
// ①3つの暗い中心核の実効減光が 1(=光度質量 0・観測温度が厳密に 0)②外縁リングから読む
// 力学質量 M_dyn=⟨v²r⟩/G が実質量に比例する(比 1.960 / 3.840 — 真の 2 / 4 の ±10% 窓)
// ③リングが評価窓内で円軌道を保つ(半径ばらつき ≤15%)④NaN・速度/スピン/反作用クランプが 0 回。
// 較正実測は exp-4-82(seed 20260806・6000步=t96)。プリセットが無い対象は SKIP(root 等)。
// 1構成6000步(147粒子)と軽いので QA_FAST=1 でも実行する ----
{
  const hasML = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'massLadder'));
  if (hasML) {
    const r = await page.evaluate(() => {
      const P = HP.allPresets().find((q) => q.id === 'massLadder');
      HP.loadPreset('massLadder', false);
      const S = HP.sim;
      const NR = 48, D = 1440, R0 = 180, MS = [2500, 5000, 10000];
      for (let k = 0; k < 6000; k++) S.step(0.016);
      const G = S.params.G, sys = [];
      for (let g = 0; g < 3; g++) {
        const cx = (g - 1) * D;
        let mD = 0, rq = 0;
        for (let i = 3 + g * NR; i < 3 + (g + 1) * NR; i++) {
          const rr = Math.hypot(S.x[i] - cx, S.y[i]);
          mD += (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]) * rr / G / NR;
          rq += (rr - R0) * (rr - R0) / NR;
        }
        sys.push({ m: MS[g], mDyn: mD, ratio: mD / MS[g], rRms: Math.sqrt(rq) / R0,
          lSw: S.lSw[g], Tobs: HP.obsTemp(S, g) });
      }
      return { n: S.n, sys, camScale: P.camera.scale,
        r21: sys[1].mDyn / sys[0].mDyn, r41: sys[2].mDyn / sys[0].mDyn,
        bad: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
    });
    const lSwMin = Math.min(...r.sys.map((s) => s.lSw));
    const rRmsMax = Math.max(...r.sys.map((s) => s.rRms));
    add('claim.massladder',
      !r.bad && r.n === 147 && r.clampV === 0 && r.clampS === 0 && r.clampR === 0
      && r.r21 >= 1.76 && r.r21 <= 2.16 && r.r41 >= 3.46 && r.r41 <= 4.22
      && lSwMin >= 0.99 && r.sys.every((s) => s.Tobs === 0)
      && r.sys.every((s) => s.ratio > 1 && s.ratio < 1.3)
      && rRmsMax <= 0.15,
      `力学質量=${r.sys.map((s) => s.mDyn.toFixed(0)).join('/')}(実質量 2500/5000/10000)/ ` +
      `比=${r.r21.toFixed(4)}(窓1.76〜2.16・実測1.960) ${r.r41.toFixed(4)}(窓3.46〜4.22・実測3.840)/ ` +
      `M_dyn/m=${r.sys.map((s) => s.ratio.toFixed(3)).join('/')}(いずれも1超1.3未満 — E6′超過)/ ` +
      `中心lSw 最小=${lSwMin.toFixed(4)}(≥0.99 — 真っ暗) T_obs=${r.sys.map((s) => s.Tobs).join('/')}(全て0)/ ` +
      `リング半径ばらつき 最大=${(rRmsMax * 100).toFixed(1)}%(≤15%)/ ` +
      `上限発動 V/S/R=${r.clampV}/${r.clampS}/${r.clampR}(すべて0)`);
  } else {
    console.log('SKIP claim.massladder(対象に 🪜massLadder なし — root 等。第81便)');
  }
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
      // ---- 第40便 40C(台帳4-82)再較正: 環粒子 300→240(総 301→241)へ削減した新構成で全チェック
      // ---- ポイントを実測し直した(tests/out/40c-report.md §1)。**判定の向きも閾値も据え置き**で、
      // ---- 新構成でも同じ余裕があることを確認した(粒子数が減ると1粒の重みが 0.33%→0.42% になるので
      // ---- 「落下0粒」の意味が変わらないよう閾値は率のまま):
      // ---- 新(n=241)  t150 帯内100.0%/落下0 ・ t210 96.7%/1.67% ・ **t360 97.1%/0.42%/散逸0/平均|spin|0.115**
      // ----             t600 99.6%/0.42% ・ t1200 98.8%/0.42%/散逸0
      // ---- 旧(n=301)  t150 100.0%/0 ・ t210 97.0%/1.33% ・ t360 97.3%/0.33% ・ t600 99.7%/0 ・ t1200 98.3%/0
      // ---- 余裕: 帯内 0.971 対 閾値 0.95(絶対 2.1 ポイント)/ 落下 0.0042 対 0.02(4.8倍)/
      // ----       散逸 0 対 0.05 / 平均|spin| 0.115 対 0.5(4.4倍)。平均|spin| が 0.164→0.115(−30%)に
      // ----       下がったのは粒子が減って接触がさらに減ったため(4-82 の副作用として想定内・向きも安全側)
      const iso = await w5cGetUnit('saturnExp');
      add('behavior.saturnExp',
        !iso.nan && iso.inB >= 0.95 && iso.fall <= 0.02 && iso.esc <= 0.05 && iso.mean < 0.5,
        `t≈360: 帯内=${(iso.inB * 100).toFixed(1)}%(≥95%) 落下=${(iso.fall * 100).toFixed(1)}%(≤2%) 散逸=${(iso.esc * 100).toFixed(1)}%(≤5%) 平均|spin|=${iso.mean.toFixed(3)}(<0.5)`);

      // ---- 第40便 40C(台帳4-79 P2-4/P2-5): 🪐 の因果対照2本 ----
      // 閾値は **4-82 適用後(環240粒)の実測** から起こしているので、301粒のままの対象
      // (root=v1.33 以前)では走らせない(agnjet/cosmicweb/spinup と同じ「beta 先行サンプルは
      //  対象の中身から自動判定してスキップ」の運用。root へ昇格した時点で自動的に有効になる)
      if (hasSat240) {
      // ---- 第40便 40C(台帳4-79 P2-4): 🪐 の kFrame 因果対照 ----
      // 説明文の主張「環は空間引きずりによる近点移動で形を保つ」を同一 seed の A/B で検証したところ、
      // **実測は主張と逆向き**だった(3000步・n=241):
      //     kFrame=1: 離心率RMS 0.1422 / 帯中央値 159.2 / 動径速度RMS 0.341 / 帯内 100%
      //     kFrame=0: 離心率RMS 0.0634 / 帯中央値 170.8 / 動径速度RMS 0.172 / 帯内 100%
      //   → 引きずりは環を内側へ寄せ(−7%)、離心率をむしろ **2.24倍** に上げる。引きずりを切っても
      //     環は 100% 保たれる(9000步でも帯内100%・離心率RMS 0.123 と kFrame=1 の 0.239 の半分)。
      //   よって「引きずりが環を円くして保つ」とは言えない。説明文は 40C で実測に合わせて弱め、
      //   本 QA は **測れた因果**(kFrame が環の形を有意に変える・その向き)を固定する。
      // 閾値の根拠(実測÷余裕):
      //   ・離心率比 e(kF1)/e(kF0) > 1.5 … 実測 2.243 → 1.5倍の余裕
      //   ・帯中央値 p50(kF1) < p50(kF0) − 5 … 実測差 11.60 → 2.3倍の余裕
      //   ・両条件とも帯内 ≥95% … 実測 100%/100%(片方だけ壊れて差が出た、を排除する健全性条件)
      const skf = await w5cGetUnit('saturnKFrame');
      const eRatio = skf.on.eRMS / (skf.off.eRMS || 1e-12);
      add('behavior.saturn-kframe-control',
        !skf.on.nan && !skf.off.nan && skf.on.inB >= 0.95 && skf.off.inB >= 0.95 &&
        eRatio > 1.5 && skf.on.p50 < skf.off.p50 - 5,
        `${skf.steps}步・同一seed で kFrame だけを 1/0: 離心率RMS=${skf.on.eRMS.toFixed(4)}/${skf.off.eRMS.toFixed(4)}` +
        `(比=${eRatio.toFixed(2)}倍 >1.5) 帯中央値=${skf.on.p50.toFixed(1)}/${skf.off.p50.toFixed(1)}` +
        `(引きずり側が ${(skf.off.p50 - skf.on.p50).toFixed(1)} 内側 >5) ` +
        `動径速度RMS=${skf.on.vrRMS.toFixed(3)}/${skf.off.vrRMS.toFixed(3)} 帯内=${(skf.on.inB * 100).toFixed(1)}%/${(skf.off.inB * 100).toFixed(1)}%(両方≥95%) ` +
        `— 引きずりは環を内側へ寄せ離心率を上げる。kFrame=0 でも環は保たれるので「引きずりが環を円くして保つ」` +
        `とは主張しない(第40便 40C で説明文を実測に合わせて弱めた)`);

      // ---- 第40便 40C(台帳4-79 P2-5): 🪐 の muF 因果対照(**否定的結果の固定**)----
      // 説明文の主張「muF=0 にすると円形化が止まる」を検証したところ、氷粒の半径が
      // R=rMul·√m ≈ 0.18〜0.31 と小さく **接触自体がほとんど起きない**ため、muF はこの窓で
      // ほぼ効かないことが分かった(実測・n=241):
      //   ・3000步では muF=0.2 / 0 / 1.0 の3本が **倍精度で完全一致**(= 接触ゼロ)
      //   ・6000步 平均|spin| = 0.15824(muF0.2)/ 0.16087(muF0)/ 0.15823(muF1.0)
      //     → 0.2 と 0 の差は 1.66% だが、**5倍の muF=1.0 にしても値が動かない**(差 8e-5)
      //     = 用量反応が無く、この 1.66% は稀な1接触に起因する差であって「摩擦が効いている」規模ではない
      //   ・6000步 離心率RMS = 0.241009 / 0.240965 → 相対差 0.018%
      // よって本 QA は「muF は環に届いてはいる(差はゼロでない)が効きは小さい」を **両側から** 固定する。
      // 閾値の根拠: 下限 1e-4(実測の相対差 0.0166 = 166倍上)・上限 0.10(実測 0.0166 の 6.0倍)。
      // 離心率RMS の相対差 <0.01(実測 1.8e-4 = 55倍の余裕)。説明文は 40C で該当主張を撤回した。
      const smf = await w5cGetUnit('saturnMuF');
      const dSpin = Math.abs(smf.on.meanSpin - smf.off.meanSpin) / (smf.off.meanSpin || 1e-12);
      const dEcc = Math.abs(smf.on.eRMS - smf.off.eRMS) / (smf.off.eRMS || 1e-12);
      add('behavior.saturn-muf-control',
        !smf.on.nan && !smf.off.nan && dSpin > 1e-4 && dSpin < 0.10 && dEcc < 0.01,
        `${smf.steps}步・同一seed で muF だけを 0.2/0: 平均|spin|=${smf.on.meanSpin.toFixed(5)}/${smf.off.meanSpin.toFixed(5)}` +
        `(相対差 ${(dSpin * 100).toFixed(2)}% — 下限0.01%<差<上限10%) ` +
        `離心率RMS=${smf.on.eRMS.toFixed(6)}/${smf.off.eRMS.toFixed(6)}(相対差 ${(dEcc * 100).toFixed(3)}% <1%) ` +
        `動径速度RMS=${smf.on.vrRMS.toFixed(4)}/${smf.off.vrRMS.toFixed(4)} ` +
        `氷粒の半径 R=${smf.Rmin.toFixed(3)}〜${smf.Rmax.toFixed(3)}(環の半径域 104〜212 に対し極小 → 接触がまれ。` +
        `計測時点の重なり対数=${smf.on.contacts}/${smf.off.contacts}) ` +
        `— **否定的結果の固定**: muF は「円形化の主因」ではない(3000步では muF 0.2/0/1.0 が倍精度で完全一致・` +
        `6000步で muF を5倍にしても値が動かない=用量反応なし)。第40便 40C で説明文の該当主張を撤回した`);
      } else {
        console.log('SKIP behavior.saturn-kframe-control / -muf-control(対象の🪐は環300粒の旧構成 — 閾値は4-82の240粒で較正)');
      }
    }
  } else {
    console.log('SKIP ice./saturnExp(対象に 🪐実験版なし)');
  }
}

// ---- 8d2) 第40便 40C(台帳4-79 P2-7/P2-8): 🌠merger・🌫️collapse の因果対照 ----
// どちらも「説明文が主張している因果」を同一 seed の A/B で機械検証する。実測が主張を支持しない
// 部分は、主張の側を弱めて **測れた事実の方**(効き所・否定的結果)を固定する方針(誠実性優先)。
if (!FAST) {
  // ---- P2-7: 🌠merger の3点セット(潮汐尾の成長 / kFrame の効き所 / muF の効き)----
  // 実測(3000步・同一seed。**beta〔4-81適用〕と root〔v1.33〕の両方**で採った — 閾値は両者が
  // 通る位置に置き、ばらつきの大きい量はその旨を明記する):
  //                         beta(4-81)     root(v1.33)
  //   潮汐尾率(1.5倍外)   0.0%→3.70%      0.0%→3.70%     (2倍外 1.11% / 1.11%)
  //   平均|spin| kF1/kF0    0.5723/0.2639   0.5142/0.2639  → 比 **2.17倍 / 1.95倍**
  //   平均|spin| muF差      10.1%           **0.87%**      ← 桁が違う(カオス由来・大きさは再現しない)
  //   核間距離 kFrame差     0.55%           0.52%          ← 大きさまで再現する
  // → 引きずりの効きは **スピン加熱に集中** していて、核どうしの接近そのものはほとんど変わらない。
  //   説明文「kFrame=1 のフレームドラッギングが合体ダイナミクスに効く」はこの内訳を明記する形へ改めた。
  // 閾値の根拠(実測÷余裕。カッコ内は beta/root の順):
  //   ・潮汐尾率 >0.02(実測 0.0370/0.0370 = 1.85倍)かつ t0 では 0(尾が「育った」ことの確認)
  //   ・平均|spin| 比 kF1/kF0 >1.4(実測 2.17/1.95 = 1.55/1.39倍の余裕)
  //   ・muF の効き: 平均|spin| の相対差 >0.002(実測 0.101/0.0087 = 50/4.4倍)。
  //     **向きも大きさも主張しない** — 2ビルドで 0.87% と 10.1% と一桁違い、素朴な「摩擦が加熱する」
  //     向きにもならない(実測では muF=0 の方が高温になる時刻がある)。ここで固定しているのは
  //     「muF は円盤に届いていて結果を変える」という **存在** だけである
  //   ・核間距離の kFrame 差: 相対差 >1e-3(実測 5.5e-3/5.2e-3 = 5.5/5.2倍)かつ <0.05
  //     (実測の 9.1/9.7倍下 — **「引きずりは軌道にはほとんど効かない」ことの上限側の固定**)
  const mg = await w5cGetUnit('mergerCausal');
  const spinRatio = mg.base.end.meanSpin / (mg.kf0.end.meanSpin || 1e-12);
  const mufRel = Math.abs(mg.base.end.meanSpin - mg.muf0.end.meanSpin) / (mg.muf0.end.meanSpin || 1e-12);
  // 第50便 50I: 「引きずりは軌道にほとんど効かない」は**接近期**の主張として判定する。
  // 接近期 = 核間が初期の 0.72 倍に達した最初のチェックポイント(root 旧配置では 3000步 =
  // 従来の判定点と同一。beta 新配置では 2000步)。深い接触期には軌道差が育つ(beta 実測
  // 3000步で 11.5% — 説明文と claims が別途この値を固定する)
  const sep0 = mg.base.t0.sep;
  let apIdx = mg.base.cks.length - 1;
  for (let i = 0; i < mg.base.cks.length; i++) if (mg.base.cks[i].sep <= 0.72 * sep0) { apIdx = i; break; }
  const apB = mg.base.cks[apIdx], apK = mg.kf0.cks[apIdx];
  const sepRel = Math.abs(apB.sep - apK.sep) / (apK.sep || 1e-12);
  // 深接触期の分母は kF1(base)側 — 説明文・claims(11.5%)と同じ規約に揃える
  const sepRelEnd = Math.abs(mg.base.end.sep - mg.kf0.end.sep) / (mg.base.end.sep || 1e-12);
  // 第51便 51E: beta は両円盤を軌道順行へ(潮汐尾の育ちを最優先 — 6000步で10%)。この配置では
  // 3000步時点のスピン加熱比が 1.42(6000步では 3.35 — 深接触とともに開く)なので、閾値を
  // 1.4→1.25 へ調整(root 旧配置は 1.9〜2.2 のまま余裕で通る。6000步側の 3.35 は claims が
  // ±15% 窓で別途固定)
  add('behavior.merger-causal',
    !mg.base.end.nan && !mg.kf0.end.nan && !mg.muf0.end.nan &&
    mg.base.t0.tail15 === 0 && mg.base.end.tail15 > 0.02 &&
    spinRatio > 1.25 && mufRel > 0.002 && sepRel > 5e-4 && sepRel < 0.05,
    `${mg.steps}步・同一seed: ①潮汐尾率(自核から初期円盤半径の1.5倍外)=${(mg.base.t0.tail15 * 100).toFixed(1)}%→` +
    `${(mg.base.end.tail15 * 100).toFixed(2)}%(>2%。2倍外は ${(mg.base.end.tail20 * 100).toFixed(2)}%) ` +
    `②kFrame の効き所=**スピン加熱**: 平均|spin|=${mg.base.end.meanSpin.toFixed(4)}(kF1)/${mg.kf0.end.meanSpin.toFixed(4)}(kF0)` +
    `=${spinRatio.toFixed(2)}倍(>1.25) ③muF の効き: 平均|spin|=${mg.base.end.meanSpin.toFixed(4)}/${mg.muf0.end.meanSpin.toFixed(4)}` +
    `(相対差 ${(mufRel * 100).toFixed(2)}% >0.2% — 存在のみを固定。大きさは対象間で一桁違い、向きも一定しない) ` +
    `④接近期(${apB.ck}步・核間 ${sep0.toFixed(1)}→${apB.sep.toFixed(1)})の kFrame 差=${(sepRel * 100).toFixed(2)}%` +
    `(5e-4 < 差 < 5% — **接近期の軌道にはほとんど効かないことの上限固定**。深接触期 ${mg.steps}步では ` +
    `${(sepRelEnd * 100).toFixed(2)}% まで育つ — 効きの現れる時期の内訳ごと固定) ` +
    `— 引きずりの効きはまずスピン加熱に集中し、接近期の軌道は変えない(第40便 40C+第50便 50I)`);

  // ---- P2-8: 🌫️collapse の etaRad 対照(**否定的結果の固定**)----
  // 説明文の主張「放射冷却(E11)による収縮」「etaRad/pRad を変えると冷却効率が崩壊速度に効く」を
  // 同一 seed の A/B で検証したところ、**冷却は温度だけを動かし、収縮の速さは変えなかった**:
  //   6000步: 半質量半径 r50 = 133.13(etaRad=0.004)/ 132.65(0)→ 相対差 **0.36%**
  //           温度(spin モードなので平均|spin|)= 0.944 / 1.090 → **13.4% 低い**
  //   12000步でも r50 = 98.61 / 96.56(2.1%)で **符号すら一定しない**(冷却ONの方が大きい=収縮が遅い)
  //   用量反応: etaRad=0.02(5倍)で 12000步 温度 1.037(単調に低下)なのに r50 は 98.17 で
  //             0.004 の 98.61 とほぼ同じ → **温度には用量反応があり、収縮には無い**
  //   root(v1.33・4-81 未適用)でも同じ: 6000步で T=0.9373/1.0324(比 0.908)・r50=133.41/133.55(0.11%)
  // → 「冷却が収縮を駆動する」は成立しない(収縮を駆動しているのは自己重力)。40C で説明文を修正し、
  //   本 QA はこの否定的結果そのものを固定する。閾値の根拠(実測÷余裕。beta/root の順):
  //   ・温度比 T(on)/T(off) < 0.97 … 実測 0.866/0.908 → 「冷却で下がった分」1−比 = 13.4%/9.2% に対し
  //     閾値 3% は 4.5倍/3.1倍の余裕(2ビルドの差 4.2 ポイントより十分広く取る)
  //   ・r50 の相対差 < 0.05 … 実測 0.0036/0.0011 → **13.9倍/45倍**の余裕(これが「収縮に効かない」の機械的表現)
  //   ・両方とも t0 から実際に縮んでいること(r50(end) < r50(t0)·0.98。実測 143.74→133.4)= 健全性条件
  // 第51便 51F 改訂: 判定点を分離 — r50 の冷却非依存は崩壊中盤 6000步(mid)、温度対照は
  // 加熱ピーク後の 12000步(end)で見る。実測: 温度比 on/off = beta 0.545 / root 0.761(<0.85)・
  // r50 相対差@6000 = beta 1.29% / root 0.15%(<5%)。beta は G 2.2/kRep 0.6 の塊形成構成
  // (r50 144→48 = 3.0倍集中)・root は旧構成のまま両方この閾値で通る
  const cc = await w5cGetUnit('collapseCooling');
  const tRatio = cc.on.end.T / (cc.off.end.T || 1e-12);
  const r50Rel = Math.abs(cc.on.mid.r50 - cc.off.mid.r50) / (cc.off.mid.r50 || 1e-12);
  add('behavior.collapse-cooling',
    !cc.on.end.nan && !cc.off.end.nan &&
    cc.on.end.r50 < cc.on.t0.r50 * 0.98 && cc.off.end.r50 < cc.off.t0.r50 * 0.98 &&
    tRatio < 0.85 && r50Rel < 0.05,
    `${cc.steps}步・同一seed で etaRad だけを 0.004/0: 温度(平均|spin|・12000步)=${cc.on.end.T.toFixed(4)}/${cc.off.end.T.toFixed(4)}` +
    `(比=${tRatio.toFixed(3)} <0.85 = 冷却は効いている) ` +
    `半質量半径 r50(6000步)=${cc.on.mid.r50.toFixed(2)}/${cc.off.mid.r50.toFixed(2)}(相対差 ${(r50Rel * 100).toFixed(2)}% <5%) ` +
    `r50 終端=${cc.on.end.r50.toFixed(1)}/${cc.off.end.r50.toFixed(1)} 収縮 ${cc.on.t0.r50.toFixed(1)}→${cc.on.end.r50.toFixed(1)}(両条件とも収縮する) ` +
    `— **否定的結果の固定**: 放射冷却は温度を下げるが崩壊速度は変えない。収縮を駆動しているのは自己重力`);
} else {
  console.log('SKIP behavior.merger-causal / behavior.collapse-cooling(QA_FAST=1)');
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

// ---- 第12〜14便→第81便: 主星2層コアのエンジン検証(コアv2 一本化)----
// 第81便でコアv1(比率仕様 coreMR/coreSR/coreRR)を廃止したので、検査対象はコアv2 だけ:
// m は総質量のまま、coreMF=Mc/m・RcV=R_c(絶対)・coreJ=J_core が主変数で、
// 差動形 ω += (Mc/m)·(Ω_c−s)·f(R_c,d)。rigid(Ω_c≡s)と Ω_c=s の differential は差動0で
// 単層と厳密等価(錨)。コアなしの宇宙は hasCoreV2=false で分岐ごと素通り(高速化)。
// 負質量は実験用に受理(0除算保護のみ)。
{
  const hasCoreEng = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.coreMd));
  if (hasCoreEng) {
    // 第35便 W5c: 計算部分は W5C_UNITS.twolayerCore へ移し、ワーカーで実行する
    const r = await w5cGetUnit('twolayerCore');
    add('core.twolayer',
      // 第40便 40C(台帳4-82): n の期待値は 🪐 のプリセット定義から数える(🎯 は「環の帯が 🪐 と
      // 同一」が不変条件なので、両者の総粒子数が一致していること自体が検査になる)。旧: 固定値 301
      r.preset.n === satTotN && r.preset.md === (r.v2 ? 2 : 0) && r.preset.massFrac === 0.18 &&
      Math.abs(r.preset.omega - 0.0525) < 1e-4 && r.preset.hasCoreV2 &&
      Math.abs(r.preset.R0 - 1.8 * Math.sqrt(1500)) < 0.01 && Math.abs(r.preset.Rc0 - 1.8 * Math.sqrt(270)) < 0.01 &&
      r.m0 === 1500 && r.noCore === false && r.hcRigid && r.eqRigid < 1e-9 &&
      r.restDx > 1e-4 &&                                       // コア静止は引きずり低下で差が出る
      r.eqZero < 1e-9 &&
      r.effDx > 0.1 && !r.effNan && r.holDx > 0.1 && !r.holNan &&
      r.negR > 0 && !r.negNan,
      `🎯 n=${r.preset.n} コア=${r.v2 ? 'v2(mode=' + r.preset.md + ')' : 'v1(比率)'} Mc/m=${r.preset.massFrac} Ω_c=${r.preset.omega} ` +
      `R/Rc=${r.preset.R0.toFixed(1)}/${r.preset.Rc0.toFixed(1)} ` +
      `rigid 等価=${r.eqRigid}(<1e-9) 差動0(Ω_c=s)等価=${r.eqZero}(<1e-9) ` +
      `コア静止差=${r.restDx.toExponential(1)}(>1e-4) コアなし高速パス=${!r.noCore} 高速コア効果=${r.effDx.toFixed(2)}(>0.1) ` +
      `空洞NaNなし=${!r.holNan}&効果=${r.holDx.toFixed(2)} 負質量NaNなし=${!r.negNan}`);

    // ---- 第12便: A/B比較中の粒子編集(選択・パネル表示・編集先の分離・負値)----
    // 第81便: mc/m(#beMc)・sc/s(#beSc)・Rc/R(#beRr)の編集欄はコアv1 の廃止に伴い削除した。
    // 検査は「A/B のどちらを編集しているかが分離されている」ことに絞り、m と s の2欄で見る
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
      // 第81便でコアv1 欄(mc/m・sc/s・Rc/R)を撤去した。旧ビルド(root 等)では残っているので、
      // 「エンジンからコアv1 が消えていること」と「欄が消えていること」の**一致**を検査する
      const v1Gone = !HP.sim.coreMR;
      const gone = !document.getElementById('beMc') && !document.getElementById('beSc')
        && !document.getElementById('beRr');
      HP.selectBody(3, 'A');
      const titleA = document.getElementById('beTitle').textContent;
      const beS = document.getElementById('beS');
      beS.value = '1.5'; beS.dispatchEvent(new Event('change'));
      const sA = HP.sim.spin[3], sB = HP.ab().simB.spin[3];
      HP.abStop();
      const hiddenAfter = HP.selInfo().selIdx === -1;
      HP.loadPreset('saturn', false);
      return { shownB, titleB, titleA, mB, mA_after_B, gone, v1Gone, sA, sB, hiddenAfter };
    });
    add('core.ab-body-edit',
      e.shownB && /\(B\)/.test(e.titleB) && /\(A\)/.test(e.titleA) &&
      e.mB === -2 && Math.abs(e.mA_after_B - (-2)) > 1e-6 &&        // B編集はAに波及しない
      e.gone === e.v1Gone &&                                        // 第81便: エンジンと UI の同期
      e.sA === 1.5 && Math.abs(e.sB - 1.5) > 1e-9 &&                // A編集はBに波及しない
      e.hiddenAfter,
      `B選択表示=${e.shownB}(${e.titleB}) m(B)=-2受理=${e.mB === -2} A非波及=true ` +
      `コアv1欄(mc/sc/Rc)撤去=${e.gone}(エンジン側の撤去=${e.v1Gone} と一致) s(A)=1.5/s(B)=${e.sB}(非波及) 終了で選択解除=${e.hiddenAfter}`);

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
        // 第81便: コアv2 の読み口へ(mode="rigid" は旧コアv1 の sc/s=1 と同義)。
        // 旧ビルド(root 等)は従来どおり coreMR/coreSR を読む
        const cE = HP.coreState(0), cM = HP.coreState(1);
        const core = cE
          ? { mcr: cE.massFrac, mode: cE.mode, mcrM: cM ? cM.massFrac : NaN, spinM: s.spin[1] }
          : { mcr: s.coreMR[0], mode: (s.coreSR[0] === 1 ? 'rigid' : 'differential'),
              mcrM: s.coreMR[1], spinM: s.spin[1] };
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
        Math.abs(em.mcr - 0.325) < 1e-6 && em.mode === 'rigid' &&   // 第16便: コア観測値(Float32丸め許容)
        Math.abs(em.mcrM - 0.0168) < 1e-6 &&                                   // 月コア(LLR 中央値)
        em.rMin >= 180 * 0.98 && em.rMax <= 180 * 1.02 &&        // 円軌道が ±2% で維持
        em.orbits > 1.5 &&                                        // 2周走行の確認
        em.syncPerOrbit <= 2 &&                                   // 潮汐固定: 同期誤差 ≤2°/周
        emSpinRel < 0.05,                                         // spin月 ≈ 実測 ω(±5%)
        `🌍 t≈900(${em.orbits.toFixed(2)}周): r=${em.rMin.toFixed(1)}〜${em.rMax.toFixed(1)}(180±2%) ` +
        `同期誤差=${em.syncPerOrbit.toFixed(2)}°/周(≤2) spin月/ω実測 相対差=${(emSpinRel * 100).toFixed(1)}%(<5%) ` +
        `コア 地球=${em.mcr.toFixed(3)}(${em.mode})・月=${em.mcrM.toFixed(4)} NaNなし=${!em.nan}`);

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
// 対象が観測温度系を持つときだけ実行(判定子は第85便で `HP.sim.obsT` → `HP.obsTemp + lSw` へ置換
// — 旧判定子は第61便の obsT 廃止以降ずっと恒常 false で、この区画は休眠していた)。較正実測は 2026-07-24 第22便:
// darkrotor v3(root)= 中心(m600・R45・spin0.12・コア mc/m=0.1・sc/s=20・Rc/R=0.3・掻出1・pinned)+
// コア付きハロー20体(m30・R12・spin0.15・掻出1・レール駆動)。u_φ 比 1.954/1.543/1.562(r=140/200/260)・
// 12000步安定(r90 220〜239 有界・外縁 2.0→2.8・中心スピン厳密不変)
// darkrotor v4(beta・第32便 W3b / 台帳4-47 Phase C)= ピン・レール全廃の閉鎖系。
// 中心BH(m2000・R45・spin0.12・単層・掻出1・自由)+ ハロー10体(m150・R18・spin0.15・コア付き・自由)+
// 恒星200体。u_φ 比 1.891/1.268/1.543・3000步(外縁3.574・r90 207.6・偏差1.59%・max|spin|2.197)・
// 12000步(偏差8.01%・max|spin|1.30・恒星保持100%・重心移動0.264)。以下の darkrotor 系 QA は
// プリセット定義(ピン・レールの有無)で新旧を機械判別して分岐する
{
  // 第85便(休眠QAの復旧): 門を現行 API へ置換(式・理由とも上の w5cHasObsLayer と同一 — 236-247行のコメント参照)。
  // 旧 `!!(HP.sim && HP.sim.obsT)` は第61便の obsT 廃止以降 root/beta とも恒常 false で、
  // この区画まるごと(obs.attrs / obs.equivalence / darkrotor.uphi / darkrotor.allfree /
  // behavior.darkrotor / behavior.darkrotorLong / behavior.darkrotor-pitch)が休眠していた。
  const hasObsLayer = await page.evaluate(() =>
    !!(window.HP && typeof HP.obsTemp === 'function' && HP.sim && HP.sim.lSw));
  // 第85便: obs.attrs だけは**門の付け替えでは復旧できない**ので旧判定子の副門に閉じ込める。
  // 理由: 本体が「第61便で廃止された属性層(obsT/coreOT)」と「第81便で廃止されたコアv1
  // (coreRR → HP.sim.Rc)」を直に読む(`HP.sim.obsT[0] = 7` は現行ビルドで TypeError・
  // `HP.sim.Rc[0]` は beta に存在しない)。現行 API での等価な検査は「旧キーは警告つきで無視される」
  // という**別の主張**になり、しかも root(Rc あり)と beta(第81便で撤去)で期待値が割れる。
  // 本便のスコープ(🕶️darkrotor 系5件の復旧)から外し、SKIP 理由を明示して統括へ引き継ぐ。
  const hasLegacyObsAttrs = await page.evaluate(() => !!(window.HP && HP.sim && HP.sim.obsT));
  if (hasObsLayer) {
   if (hasLegacyObsAttrs) {
    // 属性の受理・クランプ・実効値: radius が R を、coreRR が Rc を上書きし、
    // lightSweep=1 は η_rad>0 でも放射冷却しない(光が外に出ない)。A/B 転写も検査
    const at = await page.evaluate(() => {
      const mk = (over, phys) => ({ name: 'at', description: 'd', seed: 7, camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: Object.assign({ G: 1, D0: 1, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 60, cLight: 60,
          bM: 1, etaRad: 0, pRad: 2, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
          radiusScale: 1.2, softening: 2, timeScale: 1 }, phys || {}),
        bodies: [Object.assign({ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 2, pinned: false }, over)] });
      HP.sim.build(HP.validatePreset(mk({ radius: 20, coreMR: 0.5, coreSR: 4, coreRR: 0.5 })).preset);
      // 第38便 A4(原仮定者指示): radiusScale(この mk() の既定1.2)は明示半径(radius/radOv)にも
      // 乗るようになった — R=radiusScale·radius(=1.2*20=24)。Rc はコア半径比×Rの経路のまま
      // 不変(R に比例して自動追従。=0.5*24=12)。root 等の未適用ビルドでは従来どおり
      // R=radius(=20)・Rc=0.5*20=10 のままなので、HP.rayBandColor(第38便で新規公開)の
      // 有無で期待値を分岐する
      const has38A = typeof HP.rayBandColor === 'function';
      const okR = has38A ? (HP.sim.R[0] === 1.2 * 20 && HP.sim.Rc[0] === 0.5 * 1.2 * 20)
                          : (HP.sim.R[0] === 20 && HP.sim.Rc[0] === 10);
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
   } else {
    // 第85便: 恒常 SKIP(現行ビルドはすべてこちら)。復旧には検査内容の再定義が要る — 統括へ申し送り。
    console.log('SKIP obs.attrs(第61便で廃止された obsT/coreOT 属性層+第81便で廃止されたコアv1 Rc を直に読む検査 — ' +
      '門の付け替えでは復旧できず、現行 API 向けの再定義が必要。第85便で休眠を明示化)');
   }

    // 等価性: 明示既定値(obsT:1, lightSweep:0, coreOT:1)は省略時と bit 等価(回帰の錨)
    // 第85便: obsT/coreOT は第61便で廃止され、validatePreset が警告つきで delete する。したがって
    // 本検査は現行ビルドでは「lightSweep:0 の明示が既定と bit 等価」+「廃止済み旧キーを書いても
    // 力学は 1 bit も動かない(移行処理が preset を汚さない)」の2点の錨として機能する。
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
    // 第33便 X4(台帳4-65b): v5 でローターが単層化(コア廃止・対向2体のみ spin 2.0)したため
    // 旧判定「中心(i=0)+コアを持つ粒子」ではローターを選べなくなった(選択が中心1体だけに
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
            // 第81便: コア差動項はコアv2 の形へ(md≥2 = differential/active/cavity)
            if (s.coreMd && s.coreMd[j] >= 2 && s.RcV[j] > 0) {
              const cs = HP.coreState(j), dOm = (cs ? cs.omega : 0) - sj;
              if (dOm !== 0) { const tt = s.RcV[j] / (s.RcV[j] + d); om += s.coreMF[j] * dOm * Math.pow(tt, q); }
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
      // v5 判別: ローターが単層(コアなし)/ v6 判別: type:"single" が3体(中心BH+対向2ローター)。
      // 閾値はこの構成差で切り替える(第39便 39A・台帳4-72)
      const nSingle = P.bodies.filter(b => b.type === 'single').length;
      return { on: run(false), off: run(true), nSingle,
        v6: nSingle === 3, v5: P.bodies.filter(b => b.type === 'single').every(b => !b.core) };
    });
    // 第33便 X4 / 第39便 39A: 閾値は対象構成ごとの t=0 実測 ÷ 1.10(v4 と同等マージン)。
    // v6 実測 3.850/2.198/4.030 → 3.50/2.00/3.66 / v5 実測 1.760/1.314/1.823 → 1.60/1.19/1.65 /
    // 旧v3(root)は 1.954/1.543/1.562 のまま 1.70/1.15/1.35。
    const uTh = up.v6 ? [3.50, 2.00, 3.66] : (up.v5 ? [1.60, 1.19, 1.65] : [1.70, 1.15, 1.35]);
    add('darkrotor.uphi', up.on.u140 > up.off.u140 * uTh[0] && up.on.u200 > up.off.u200 * uTh[1]
      && up.on.u260 > up.off.u260 * uTh[2],
      `u_φ(140)=${up.on.u140.toFixed(4)}/${up.off.u140.toFixed(4)} 比=${(up.on.u140 / up.off.u140).toFixed(3)}(>${uTh[0]}) ` +
      `u_φ(200)=${up.on.u200.toFixed(4)}/${up.off.u200.toFixed(4)} 比=${(up.on.u200 / up.off.u200).toFixed(3)}(>${uTh[1]}) ` +
      `u_φ(260)=${up.on.u260.toFixed(4)}/${up.off.u260.toFixed(4)} 比=${(up.on.u260 / up.off.u260).toFixed(3)}(>${uTh[2]}) ` +
      `スピン0にしたローター=${up.off.nOff}体(single=${up.nSingle}) v6=${up.v6} 単層v5=${up.v5} / ` +
      `第39便 39A v6 の実測=3.850/2.198/4.030(第33便 X4 v5=1.760/1.314/1.823・v4=1.891/1.268/1.543・` +
      `旧v3=1.954/1.543/1.562)。v6 は閾値を実測÷1.10 で再設定: 1.60→3.50 / 1.19→2.00 / 1.65→3.66 ` +
      `(全域で強化 — ローターを対向2体だけにしてハロー質量 1500→300 に落としたことで、対照側の ` +
      `u_φ(スピンを全て 0 にした残り = 公転速度だけの引きずり)が下がり、比が2倍以上に開いた。` +
      `引きずり経路そのものが強くなったのではなく、対照の分母が小さくなったことによる)。` +
      `root(旧v3)は旧閾値のまま`);

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
    // ---- 第39便 39A(台帳4-72)v6 の再較正 ----
    // v6 実測(3000步・tests/exp-4-72.mjs): 外縁3.230・r90=238.5・ローター残存2/2・偏差1.74%・
    // ローター平均|spin|=1.769・全粒子max|spin|=3.258(本ユニットは 3000步**終了時点の瞬時値**を
    // 測る。走行中の最大は t≈1000步 の 4.640 で、そちらは下の behavior.darkrotorLong が
    // 500步ごとの走査で捉えている — 閾値 6.0 は厳しい側の 4.640 に合わせた共通値)・
    // BHスピン0.12593・恒星保持380/380(100%)・重心移動0.341・t=0 総運動量 9.35e-6。
    // ローター体数に依存する3項だけを構成から機械判別して切替える:
    //   ローター残存 ===10 → ===NH(定義上の全数。v6 は2・v5 は10 — 体数のハードコードを外した)
    //   ローター平均|spin| <0.80 → <2.10(v6 の初期値は (2.0+2.0)/2=2.0 = 設計値そのもの。
    //     実測は 3000步で 1.769 まで減衰。閾値の役割「暴走検出」は不変で、初期設計値のすぐ上に置く)
    //   全粒子max|spin| <4.0 → <6.0(v6 の走行中最大は 4.640。正体は恒星 index185〔m=0.272・R=1.042・r_BH≈245〕で
    //     t≈1000步 がピーク。ローター自身は 2.0→1.58・BH は 0.120→0.131 なので、
    //     「恒星の E6′ 汲み上げ検出」という閾値の意味は v5 から変わっていない。v5 実測2.770 の 1.59倍に
    //     上がったのは、低スピン8体を抜いてハロー質量を 1500→300 にしたぶん恒星が強スピン体へ
    //     近づけるようになったため。マージンは実測×1.29)
    // 外縁>2.9・r90<260・偏差<10%・BHスピン・恒星保持・重心移動<0.5(実測0.341 — v5 の0.041より
    // 1桁大きいが、ハロー質量が 1/5 になり BH の反跳が効くようになったため。閾値は据置)・
    // t=0 総運動量<0.01 は据置(v6 は 9.35e-6 で v5 の 0.0037 より3桁良い)。
    if (!FAST) {
      if (drFree) {
        // 第35便 W5c: 計算部分は W5C_UNITS.darkrotorMidNew へ移し、ワーカーで実行する
        const st = await w5cGetUnit('darkrotorMidNew');
        const drV6 = st.NH === 2;                       // v6(対向2ローター)判別
        const spinLim = drV6 ? 2.10 : 0.80, maxSpinLim = drV6 ? 6.0 : 4.0;
        add('behavior.darkrotor', !st.nan
          && st.r90 < 260 && st.outer > 2.9 && st.haloIn === st.NH && st.haloDev < 0.10
          && st.haloSpin < spinLim && st.maxSpin < maxSpinLim && Math.abs(st.bhSpin - 0.12) < 0.02
          && st.keepPct >= 95 && st.comMove < 0.5 && st.pTot0 < 0.01,
          `外縁v_φ=${st.outer.toFixed(3)}(>2.9・BH基準156〜286のn=${st.nOuter}) r90=${st.r90.toFixed(1)}(<260: 円盤非破壊) ` +
          `ローター残存=${st.haloIn}/${st.NH}(=NH) ローター半径偏差=${(st.haloDev * 100).toFixed(2)}%(<10%) ` +
          `ローター平均|spin|=${st.haloSpin.toFixed(3)}(<${spinLim}: 初期${drV6 ? '2.0' : '0.52'}=設計値) ` +
          `全粒子max|spin|=${st.maxSpin.toFixed(3)}(<${maxSpinLim}: 恒星のE6′汲み上げ検出。下限はローター自身の2.0) ` +
          `BHスピン=${st.bhSpin.toFixed(5)}(|Δ|<0.02 — 自由なので「不変」ではなく有界) ` +
          `恒星保持=${st.keep}/${st.tot}(${st.keepPct.toFixed(1)}%≥95) 重心移動=${st.comMove.toFixed(3)}(<0.5) ` +
          `t=0総運動量=${st.pTot0.toExponential(2)}(<0.01) NaN=${st.nan} ` +
          `/ 第39便 39A v6 実測=3.230/238.5/1.74%/1.769/3.258(3000步時点の瞬時値。走行中最大は4.640)` +
          `/0.12593/100%/0.341/9.35e-6 ` +
          `(第33便 X4 v5 実測=3.747/214.1/5.97%/0.458/2.770/0.12389/100%/0.041/0.0037・` +
          `旧v4実測=3.574/207.6/1.59%/0.133/2.197/0.11774/100%/0.020/0.0006 — ローター体数に依存する ` +
          `3項〔残存数・平均|spin|・max|spin|〕だけを構成から機械判別して切替。詳細は上のコメント) ` +
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
      // 対照 = 同一 build のまま「中心BH+全ローターのスピンを 0」にしたもの。
      // 実測(beta v5): 本体 A2 後半平均 0.542/0.589/0.323/0.456 / 対照 0.067/0.065/0.046/0.108 /
      //   NaN なし・恒星保持 380/380(100%)・全期間 max|spin| 2.928・ローター半径偏差 17.23%。
      // ---- 第39便 39A(台帳4-72)v6 の再較正 ----
      // v6(中心BH+対向2ローター)実測: 腕 0.583/0.680/0.546/0.431(帯平均0.560)/
      //   対照 0.158/0.204/0.121/0.141(帯平均0.156)/ 恒星保持380/380(100%)/
      //   全期間 max|spin| 4.640 / ローター半径偏差 4.46%。
      // **対照側の意味が v5 から変わった(重要)**: v5 の10体等間隔リングは m<10 に対して軸対称
      // だったので、対照に残る A2 は方位ランダムの統計下限 √(π/4N) と同オーダーだった。
      // v6 の対向2体は 180°回転対称 = m=2 の質量四重極そのものなので、対照には**配置由来の
      // 実在する m=2** が残る(帯平均 0.156 = 終端ノイズ床 0.099 の約1.6倍。v5 の対照は 0.0715)。
      // したがって対照の閾値は「m=2 が無いこと」ではなく「配置由来分に留まること」の検査になる。
      // 閾値 0.15→0.25 は v6 実測 0.156 に約1.6倍の余裕(v5 の 0.15/0.113=1.3倍より広い —
      // 対照側が統計下限ではなく実在の物理量になったぶん、seed 揺らぎの幅も広く取る)。
      // max|spin| <4→<6.0 は behavior.darkrotor と同じ理由(v6 実測4.640・正体は恒星)。
      // 腕側 >0.22 据置(v6 実測の最小帯 0.431 = 約2.0倍の余裕)・恒星保持≥95・偏差<25% 据置。
      if (drFree) {
        // 第35便 W5c: 計算部分は W5C_UNITS.darkrotorLong へ移し、ワーカーで実行する
        const lg = await w5cGetUnit('darkrotorLong');
        const drV6 = lg.on.NH === 2;                    // v6(対向2ローター)判別
        const armOk = lg.on.A2.every(v => v > 0.22);
        // 第37便 B3(設計裁定・台帳4-69): 対照側の判定を単帯 every(v<0.19) → 帯平均<0.15 へ変更。
        // 単帯は方位ランダムの統計下限 √(π/4N) 由来でノイズ床が高く(8seed実測でmax 0.200)、
        // 特定の帯だけが閾値付近まで揺れて偽陽性(誤FAIL)を起こし得た。8seed×4帯実測
        // (tests/out/seeds-results.json・seed=20260723,1〜7): 帯平均は 0.068〜0.113
        // (最小seed3・最大seed2)、単帯最大 0.200(seed2 帯4 [200,240])。0.15 は帯平均実測最大
        // 0.113 に対し余裕約1.3倍(単帯ノイズ床〜0.2 に対しては帯平均を取ることで統計的に安定化)
        const ctrlAvg = lg.ctrl.A2.reduce((a, v) => a + v, 0) / lg.ctrl.A2.length;
        const ctrlLim = drV6 ? 0.25 : 0.15, maxSpinLim = drV6 ? 6.0 : 4.0;
        const ctrlOk = ctrlAvg < ctrlLim;
        const f3 = (a) => a.map(v => v.toFixed(3)).join('/');
        add('behavior.darkrotorLong', !lg.on.nan && !lg.ctrl.nan && lg.on.keepPct >= 95
          && lg.on.maxSpin < maxSpinLim && lg.on.rotDev < 0.25 && armOk && ctrlOk,
          `6000步(t≈96・seed固定で決定論) 腕A2(後半平均 t=3000〜6000 の${lg.on.nLate}点・環帯 ` +
          `[80,120][120,160][160,200][200,240])=${f3(lg.on.A2)}(4帯すべて>0.22) ` +
          `対照(中心BH+全ローターのスピン0)=${f3(lg.ctrl.A2)}・帯平均=${ctrlAvg.toFixed(3)}(<${ctrlLim}) ` +
          `増強比=${(lg.on.A2.reduce((a, v) => a + v, 0) / 4 / (ctrlAvg || 1e-9)).toFixed(2)}倍 ` +
          `恒星保持=${lg.on.keep}/${lg.on.tot}(${lg.on.keepPct.toFixed(1)}%≥95) ` +
          `全期間max|spin|=${lg.on.maxSpin.toFixed(3)}(<${maxSpinLim}) ローター半径偏差=${(lg.on.rotDev * 100).toFixed(2)}%(<25%) ` +
          `ローター残存=${lg.on.rotIn}/${lg.on.NH} NaN=${lg.on.nan}/${lg.ctrl.nan} ` +
          (drV6
            ? `— v6(第39便 39A・台帳4-72): ローターは対向2体(x=±200・m150・R18・両方 spin2.0)。` +
              `**この配置自体が m=2 の質量四重極**なので、対照(全スピン0)に残る A2 は統計下限ではなく ` +
              `配置由来の実在する m=2 である(終端の帯人数 N=${lg.ctrl.nBand.join('/')} → ` +
              `ノイズ床 ${f3(lg.ctrl.noise)} の約1.6倍)。よって本検査は「対照に m=2 が無いこと」ではなく ` +
              `「対照が配置由来分に留まり、スピンを入れると有意に増強されること」を見ている。` +
              `スピン起因分の分離は用量反応(6000步窓の帯平均: spin 0→0.186 / 1→0.209 / 2→0.560 / ` +
              `3→0.707 = 単調増加)で担保する。`
            : `— 腕の主因=ローターのスピン: ローターの質量・半径・軌道配置は完全に軸対称(10体すべて ` +
              `m=150・R=18・r=200 の等間隔リング)で、m=2 をつくっているのは対向2体のスピンだけ。` +
              `よって対照は厳密な軸対称系であり、そこに残る A2 は方位ランダムの統計下限 √(π/4N)` +
              `(終端の帯人数 N=${lg.ctrl.nBand.join('/')} → ${f3(lg.ctrl.noise)})と同オーダー ` +
              `— 対照側の帯平均判定は真の m=2 の不在ではなく統計下限との比較であることに注意` +
              `(単帯は方位ノイズで閾値付近まで揺れ得るため、第37便 B3 で帯平均判定へ変更 — 台帳4-69)。`) +
          `有効窓は2本立て: 恒星の安定は24000步(t≈384・保持87.9%)まで/腕の分離は6000步まで` +
          `(12000步では対照の帯平均が0.382まで育って比が1.47に落ち、24000步では環帯の人数が` +
          `3〜12まで減って腕の統計そのものが成立しない。24000步の状態は1e-9レベルの初期摂動にも` +
          `敏感なので QA には使わない — 第39便 39A)。` +
          `較正実測(ドリフト比較用の基準値)= 第39便 39A v6: 腕 0.583/0.680/0.546/0.431・` +
          `対照 0.158/0.204/0.121/0.141・max|spin| 4.640・ローター半径偏差 4.46% ` +
          `(第33便 X4 v5: 腕 0.542/0.589/0.323/0.456・対照 0.067/0.065/0.046/0.108・` +
          `max|spin| 2.928・ローター半径偏差 17.23%)`);

        // ---- 第40便 40C(台帳4-79 P2-9): 渦状腕のピッチ角を探索指標から QA へ昇格 ----
        // 計測は上の darkrotorLong の走行に相乗り(状態を書き換えない読み取りのみ = 追加走行コストゼロ)。
        // 判定を **7点の中央値** で行う理由(実測 2026-07-28・beta v1.34-b1):
        //   点別ピッチ(t=3000/3500/…/6000)= 35.15/31.13/28.20/27.02/28.43/26.20/24.20°
        //   → 中央値 28.20°・最小 24.20°・最大 35.15°。**点別の最大は 35.15° で 35° をわずかに超える**ため、
        //     点別の [20,35] 判定にすると 1 点だけで落ちる。中央値なら 20 まで 8.2°・35 まで 6.8° の余裕がある。
        //   root(v1.33 = 4-81 未適用)を同じ計測にかけると 34.91/31.15/28.71/25.02/26.02/24.28/24.50°
        //   (中央値 26.02°・7/7 後行)で、これは第39便 39A が tests/exp-4-72.mjs で採った値と
        //   **完全一致** した = 移植が原実装と同一であることの機械的証跡。40A の倍精度化(4-81)で
        //   中央値が 26.02→28.20(+2.2°)動く = 数値経路の変更に対する感度がこの規模。
        //   閾値 [20,35](統括指定の帯域)は、この ±2〜3° の世代間ドリフトに対して約3倍の余裕がある。
        // 後行(trailing)判定: 円盤の回転向き dirSign と傾き b の積が負。実測は 7/7 点で後行
        //   (b = −1.42〜−2.23 と 0 から十分離れている)。対照(ローターのスピン0)では有意帯が
        //   4帯以上そろう点が 3/7 しかなく、しかもその3点は **先行(leading)** で符号が逆 —
        //   「後行螺旋はローターのスピンが作る」という主張の対照として機能する(判定には使わず detail に記録)。
        const pOn = lg.on.pitch.filter(p => p.ok);
        const pd = pOn.map(p => p.pitchDeg).sort((a, b) => a - b);
        const pMed = pd.length ? pd[Math.floor(pd.length / 2)] : null;
        const pTrail = pOn.filter(p => p.trailing === true).length;
        const pCtrl = lg.ctrl.pitch.filter(p => p.ok);
        add('behavior.darkrotor-pitch',
          pd.length >= 6 && pMed !== null && pMed >= 20 && pMed <= 35 && pTrail === pOn.length,
          `6000步窓(t=3000〜6000 の${lg.on.pitch.length}点)で有意帯4本以上=${pd.length}点(≥6) ` +
          `ピッチ角 中央値=${pMed === null ? '—' : pMed.toFixed(2)}°(20〜35°) ` +
          `点別=${lg.on.pitch.map(p => p.ok ? p.pitchDeg.toFixed(1) : '—').join('/')}° ` +
          `(最小${pd.length ? pd[0].toFixed(2) : '—'}°/最大${pd.length ? pd[pd.length - 1].toFixed(2) : '—'}° ` +
          `— 点別の最大は 35° 際どいので判定は中央値で行う) ` +
          `後行=${pTrail}/${pOn.length}点(全点が後行・傾き b=${lg.on.pitch.filter(p => p.ok).map(p => p.slope.toFixed(2)).join('/')}・` +
          `円盤の回転向き dirSign=${lg.on.dirSign}) R²=${pOn.map(p => p.R2 === null ? '—' : p.R2.toFixed(2)).join('/')} ` +
          `対照(ローターのスピン0)= 有意帯がそろう点 ${pCtrl.length}/${lg.ctrl.pitch.length}・` +
          `ピッチ ${pCtrl.map(p => p.pitchDeg.toFixed(1)).join('/') || '測定不能'}°・` +
          `後行 ${lg.ctrl.pitch.filter(p => p.trailing === true).length}/${pCtrl.length}点(= 対照側は先行で符号が逆・判定には未使用) ` +
          `— 計測は darkrotorLong の走行に相乗り(追加の走行コストなし)`);

      } else {
        console.log('SKIP behavior.darkrotorLong(対象の🕶️はレール駆動の旧v3構成)');
      }
    }
  } else {
    console.log('SKIP obs.*/darkrotor.*(対象に観測温度系〔HP.obsTemp + lSw〕なし)');
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
      // 第79便(原仮定者指示): サンプルカテゴリの表示順をスケール準拠へ並べ替え
      // (分子=熱の実験室 → 日常〜天体の基礎=空間と時間 → 天体=光/天体の物語 → 銀河 → 宇宙全体=箱宇宙)。
      // 第79便を適用していない対象(root 昇格前)は従来順のままなので、両方を許容して判定する
      const wantNew = hasBox ? ['熱の実験室', '空間と時間', '光', '天体の物語', '銀河', '箱宇宙'] : null;
      const want = hasBox ? ['空間と時間', '箱宇宙', '銀河', '光', '熱の実験室', '天体の物語']
                          : ['空間と時間', '銀河', '光', '熱の実験室', '天体の物語'];
      res.groups = labels.slice(0, want.length);
      res.groupsOk = JSON.stringify(res.groups) === JSON.stringify(want)
        || (!!wantNew && JSON.stringify(res.groups) === JSON.stringify(wantNew));
      res.scaleOrder = !!wantNew && JSON.stringify(res.groups) === JSON.stringify(wantNew);
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
      // 第33便 X4: 🕶️ v5 でローターが単層化(コア廃止)したため、検査キーを coreMR →
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
    add('groups.reorder', r.groupsOk, `optgroups=${JSON.stringify(r.groups)}(${r.scaleOrder ? '第79便 スケール準拠順' : '従来順'})`);
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

// ---- 7o) 第27便: タイトルタップの説明パネル / A/B説明の折り畳み / 文字サイズ既定
// ----     (beta 先行 — ルート対象時はスキップ)----
// ----     旧④❄️改名検査(preset.snowline-name)は第37便 B2(原仮定者裁定)で snowline 自体を
// ----     廃止したため削除(v1.24 の🪣mach/🕰twin/💫drag 廃止に倣う運用)----
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
      return res;
    });
    add('about.panel', r.opened && r.hasOps && r.hasLaws && r.hasAbout && r.closed,
      `開閉=${r.opened}/${r.closed} 操作=${r.hasOps} 法則=${r.hasLaws} 説明=${r.hasAbout}`);
    add('about.help-moved', r.helpMoved, '説明タブから操作・法則要約が移動(外部要素は残置)');
    add('ab.note-collapsed', r.abCollapsed, '');
    add('ui.scale-default', r.uiScale === 1.15 && r.uiOpts, `既定=${r.uiScale}(=1.15) 選択肢=小/標準/大: ${r.uiOpts}`);
  } else {
    console.log('SKIP 第27便系(about.panel / ab.note-collapsed / ui.scale-default — 対象に説明パネルなし)');
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

    // ④ 第29便 P0-2 で導入した描画半径の品質連動上限(自動=40px・軽量=30px)は、
    //    第37便 A5(原仮定者裁定)で全品質から撤廃 — 大粒子を実寸より小さく見せてしまい
    //    「全品質で半径に忠実」の原則に反するため。drawRadiusCap() は品質を問わず常に
    //    Infinity になったことを確認する(旧 perf.draw-radius-cap を改名・改訂 — 品質段階の
    //    他の縮退〔解像度・決定力マップ格子・光線本数・軌跡記録間隔〕は本便の対象外で不変)。
    //    A5 は beta 先行(root には未適用で旧来の 30/40px 頭打ちのまま)のため、hasV29 とは
    //    別に hasEchoFlipAt(7h1e で定義済み — 本便一式を含む beta の代理指標)でも重ねてガードする
    //    (drawRadiusCap 自体は root にも存在するため hasV29 だけでは区別できない)。
    //    検査後は既定(自動)へ戻す
    if (hasEchoFlipAt) {
      const rc = await page.evaluate(() => {
        HP.setQuality('exact'); const ex = HP.drawRadiusCap();
        HP.setQuality('lite'); const lt = HP.drawRadiusCap();
        HP.setQuality('auto'); const au = HP.drawRadiusCap();
        HP.setQuality('auto');   // 既定へ復帰
        return { ex, lt, au };
      });
      add('perf.draw-radius-uncapped', rc.ex === Infinity && rc.lt === Infinity && rc.au === Infinity,
        `正確=${rc.ex} 軽量=${rc.lt} 自動=${rc.au}(第37便A5: 全品質で∞を期待 — 旧perf.draw-radius-cap[軽量30/自動40]から改訂)`);
    } else {
      console.log('SKIP perf.draw-radius-uncapped(対象に echoFlipAt なし — 第37便 A5 未適用の root 等。旧来の30/40px頭打ちのまま)');
    }
  } else {
    console.log('SKIP 第29便系(perf.convection-timescale / perf.rail-indices / perf.trail-cap / perf.draw-radius-uncapped — 対象に描画半径上限なし)');
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
  // 第37便 B2: ❄️snowline 廃止(原仮定者裁定)に伴い対象から除外
  // 第40便 40C(台帳4-82): 🎯saturnLayered を対象へ追加(🪐 と同時に環粒子を減らしたので、
  // 見た目の回帰も 2 ID 揃えて追えるようにする)。root/beta とも初回実行で基準を新規記録する
  const BASE_SHOT_IDS = ['gclock', 'boxcomoving', 'boxredshift', 'galaxy', 'darkrotor', 'lensing',
    'gas', 'convection', 'saturn', 'saturnLayered', 'earthMoon', 'fig8'];
  // 第35便 W2/W3 の ⏪echo・🕊️freebox、第39便 39A の 🌪️spinup、第46便 46S の ☀️starcore が
  // 対象に存在すれば追加する(対象の有無で自動判定 — root には無い beta 先行サンプル)。
  // 第46便 46S: ☀️starcore は基準が未登録なので、本便を含むビルドでの**初回のフルQA実行で
  // 基準が新規記録され PASS する**(第40便 40C の 🎯saturnLayered 追加と同じ運用 —
  // tests/baseline-shots.json に starcore の行が1つ増える)。捕捉経路(HP.loadPreset +
  // HP.tick(120) + #cv スクショ)が例外なく通ることは 46S で下見済み(t=7.68・n=199・
  // 融合2回・NaN なし・pageerror/console error ゼロ)
  const presentIds = await page.evaluate((extra) => {
    const all = HP.allPresets();
    return extra.filter(id => all.some(p => p.id === id));
  }, ['echo', 'freebox', 'spinup', 'starcore']);
  const SHOT_IDS = BASE_SHOT_IDS.concat(presentIds);
  // 第39便 39A(台帳4-72): 🕶️darkrotor は beta で v6(中心BH+対向2ローター)へ改訂したが、
  // ルート index.html は v5(ローター10体)のまま。同じ id で見た目が構造的に違うので、基準の
  // 保存キーをプリセット定義から機械判別して分ける(echo/freebox の「対象に在れば追加」と同じ
  // 「対象の中身から自動判定する」方針)。ルート側の既存基準 'darkrotor' はそのまま生き続け、
  // beta 側は 'darkrotor-v6' として新規に記録される。テスト名(shot.regress-darkrotor)は不変。
  // 第40便 40C(台帳4-82): 🪐/🎯 も同じ方式で世代を分ける。beta は環粒子 240(総241)に
  // 減らしたので見た目が構造的に違う(粒の数そのものが変わる)。root 側の既存基準 'saturn' は
  // そのまま生き続け、beta 側は 'saturn-r240' / 'saturnLayered-r240' として新規に記録される。
  // テスト名(shot.regress-saturn / -saturnLayered)は不変
  const shotKeyOf = await page.evaluate((ids) => {
    const o = {};
    for (const id of ids) {
      const p = HP.allPresets().find(q => q.id === id);
      let key = id;
      if (id === 'darkrotor' && p && p.bodies.filter(b => b.type === 'single').length === 3) key = 'darkrotor-v6';
      if ((id === 'saturn' || id === 'saturnLayered') && p &&
          p.bodies.reduce((a, b) => a + (b.type === 'ring' ? (b.n || 0) : 1), 0) === 241) key = id + '-r240';
      // 第50便 50J: ♨️convection は beta で気体 210 粒+壁の色分け描画へ改訂(root は 300 粒のまま)。
      // 見た目が構造的に違うので世代キーを分ける(darkrotor-v6 / saturn-r240 と同じ運用 —
      // root 側の既存基準 'convection' は生き続け、beta 側は 'convection-n210' として新規記録される)
      if (id === 'convection' && p && p.bodies[0] && p.bodies[0].n === 210) key = 'convection-n210';
      o[id] = key;
    }
    return o;
  }, SHOT_IDS);

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

    const key = shotKeyOf[id] || id;
    const prev = baseline.presets[key];
    if (!prev) {
      // 基準が無いid: 本便の初回実行で基準を書き込みPASS(以降のQA実行〔同一コミット・別コミット問わず〕から回帰対象になる)
      baseline.presets[key] = { luma: hex, capturedAt: new Date().toISOString(), commit: shotCommit };
      baselineDirty = true;
      add(`shot.regress-${id}`, true, `BASELINE recorded(key=${key} path=${path.join(shotsDir, id + '.png')})`);
      continue;
    }
    let sumAbs = 0, over = 0;
    for (let i = 0; i < hex.length; i++) {
      const d = Math.abs(parseInt(hex[i], 16) - parseInt(prev.luma[i], 16)) * 17;   // 4bit値を0-255相当へ復元して比較
      sumAbs += d; if (d > 24) over++;
    }
    const mAD = sumAbs / hex.length, frac = over / hex.length;
    const allow = SHOT_ALLOW[key] || SHOT_ALLOW[id];
    const limMAD = allow ? allow.mAD : 10, limFrac = allow ? allow.frac : 0.15;
    // 実測(beta 2026-07-26): 同一コミットを独立4回撮影した自然ゆらぎ(表示更新タイミング由来 —
    // requestAnimationFrame ループが HP.tick() の手動 render() と非同期に競合し得るための残差)は
    // 最大 mAD=1.56・diff>24セル比率=6.4%(boxcomoving。他は概ね0)。閾値10/15%はそれぞれ
    // 実測最大値の約6.4倍・2.3倍の余裕
    add(`shot.regress-${id}`, mAD <= limMAD && frac <= limFrac,
      `mAD=${mAD.toFixed(2)}(≤${limMAD}) diff>24セル比率=${(frac * 100).toFixed(1)}%(≤${(limFrac * 100).toFixed(0)}%)` +
      (allow ? ` [SHOT_ALLOW: ${allow.reason}]` : '') + (key !== id ? ` key=${key}` : '') +
      ` baseline capturedAt=${prev.capturedAt} commit=${prev.commit.slice(0, 8)}`);
  }
  if (baselineDirty) fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 1) + '\n');
} else {
  console.log('SKIP shot.regress-*(QA_FAST=1 — 段階導入の差分回帰はフルQAのみ)');
}

// ---- 7u) 第33便(実装4): ui.aitab-no-hscroll。原仮定者指摘「AI追加タブだけパネルの中身が
// ----     左右にスクロールする」の機械回帰ガード。viewport は本スイート既定の 390×844
// ----     (page 生成時に指定済み)をそのまま使う。
// ----     第86便(v1.38.0 昇格): 第33便の `TARGET.startsWith('beta/')` は「修正がまだ root に
// ----     昇格していない」ための beta 先行ガードだったが、本便の昇格で root←beta が byte 同一に
// ----     なり root にも修正が載った。ガードを**AIタブの存在**の機能判定へ差し替えて root でも
// ----     実行する(第79便と同じ「実測して期待値を分岐」— 昇格後の root/beta 両方で
// ----     はみ出し要素0を実測して確認済み。ガードを残すと root 側が恒久的に休眠する)----
const hasAiTabForHscroll = await page.evaluate(() =>
  !!document.querySelector('#tabs button[data-tab=ai]') && !!document.querySelector('#page-ai'));
if (hasAiTabForHscroll) {
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
  console.log('SKIP ui.aitab-no-hscroll(対象に AI追加タブなし)');
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
// ----     hasEchoFlipAt(7h1e で定義済み)を「本便一式を含む beta」の代理指標として使う
// ----     (root=旧版は echoFlipAt 自体が無く universeBox 等の署名漏れも root 側の既存問題の
// ----     ため、単一ガードでまとめて SKIP させる)。
// ----     drawScale は第37便 A6(原仮定者裁定)で廃止されて presetSig からも外れたため、
// ----     この CONDS から削除した — drawScale だけが異なる2件は「もう挙動に差がない」ので
// ----     重複スキップされるのが正しい新挙動であり、旧来の「区別できる」検査対象ではない----
if (hasEchoFlipAt) {
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
  console.log('SKIP import.distinct-topkeys(対象に echoFlipAt なし — 第36便 P1-2 未適用の root 等)');
}

// ---- 7x) 第36便 Wave A(P1-3): セーブ重複判定キー sKey へ universeBox を追加 ----
if (hasEchoFlipAt) {
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
  console.log('SKIP save.dedup-box(対象に echoFlipAt なし — 第36便 P1-3 未適用の root 等)');
}

// ---- 7y) 第36便 Wave A(P2-1): 未保存ドラフトへ universeBox の実行中編集を含める
// ----     (saveDraft/restoreDraft)。draft.restore と同じくダイアログ処理は専用ページで行う ----
{
  const hasDraftFns = await page.evaluate(() =>
    typeof window.restoreDraft === 'function' && typeof window.saveDraft === 'function');
  if (hasDraftFns && hasEchoFlipAt) {
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
// ----     フォールバックすることも併せて確認する。
// ----     第40便 40P(v1.33昇格・統括裁定=案a): ガードを「BETA_BUILD 定数の有無」から
// ----     「対象が beta 配信版(TARGET が beta/)か」へ変更。昇格で root←beta 全文置換となり
// ----     root にも死んだ BETA_BUILD 文字列が残る(isBetaServe() が root では常に偽 — 実行時
// ----     無害)ため、旧ガードでは root が誤って検査対象になる。テストの意図(beta 配信の
// ----     ラベルと SW 接尾辞の同期)は beta 固有なので、beta 対象時のみ実行する ----
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const bb = (html.match(/const BETA_BUILD\s*=\s*"([^"]+)"/) || [])[1];
  if (bb && TARGET.startsWith('beta/')) {
    const sw = fs.readFileSync(path.join(ROOT, 'beta/sw.js'), 'utf8');
    const cache = (sw.match(/CACHE = CACHE_PREFIX \+ "([^"]+)"/) || [])[1];
    const av = (html.match(/const APP_VERSION = "([^"]+)"/) || [])[1];
    const domVer = await page.evaluate(() => document.querySelector('#appVer')?.textContent || '');
    add('version.beta-label', bb === cache && domVer === ('v' + av),
      `BETA_BUILD=${bb} sw.CACHE接尾辞=${cache}(要一致) DOM表示(file://)=${domVer}(期待=v${av}。` +
      `isBetaServe()がfile://で偽になり"v"+APP_VERSIONへ落ちる仕様を利用した検証)`);
  } else {
    console.log('SKIP version.beta-label(beta 配信版のみの検査 — root は isBetaServe() 常偽で対象外・第40便 40P)');
  }
}

// ---- 7z1) 第41便 41A(台帳4-83・ChatGPT beta動作確認レポート L3): version.beta-label-http —
// ----      7z は file:// フォールバック(v+APP_VERSION)の検証で、実際の beta 配信条件
// ----      (http(s) かつパスに /beta/)で DOM が BETA_BUILD を表示することは直接 assert して
// ----      いなかった。ローカル HTTP サーバで ROOT を配信し、/beta/index.html を実 URL 条件で
// ----      開いて #appVer === BETA_BUILD を1件だけ統合検査する(beta 対象時のみ)----
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const bb = (html.match(/const BETA_BUILD\s*=\s*"([^"]+)"/) || [])[1];
  if (bb && TARGET.startsWith('beta/')) {
    const http = await import('node:http');
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html');
      const fp = path.join(ROOT, rel);
      if (!fp.startsWith(ROOT + path.sep) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.writeHead(404); res.end(); return;
      }
      const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
        '.webmanifest': 'application/manifest+json', '.png': 'image/png' }[path.extname(fp)] || 'application/octet-stream';
      res.writeHead(200, { 'content-type': mime });
      fs.createReadStream(fp).pipe(res);
    });
    await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
    const port = srv.address().port;
    const p2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
    let domVer = '';
    try {
      await p2.goto(`http://127.0.0.1:${port}/beta/index.html`);
      await p2.waitForFunction(() => window.HP && HP.sim);
      domVer = await p2.evaluate(() => document.querySelector('#appVer')?.textContent || '');
    } finally {
      await p2.close().catch(() => {});
      await new Promise((ok) => srv.close(ok));
    }
    add('version.beta-label-http', domVer === bb,
      `http://127.0.0.1:${port}/beta/index.html の DOM表示=${domVer}(期待=BETA_BUILD=${bb} — ` +
      `isBetaServe() が http(s)+/beta/ で真になる実配信経路の直接検証。7z の file:// 検証を補完)`);
  } else {
    console.log('SKIP version.beta-label-http(beta 配信版のみの検査 — 第41便 41A)');
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

// ---- 7z2b) 第45便 45A(台帳4-48): ray.alpha-threshold — 光線源/1PN源のしきい値が
// ----      固定質量(旧 RAY_MASS_MIN=40)ではなく偏向角基準
// ----        m_i ≥ (α_min/4)·Kt·max(R_i, ε)      (α = 4ψ = 4m/(Kt·b) の逆読み)
// ----      で決まっていることを機械固定する。時空係数は部門ごと: 光線は Kt(この宇宙の
// ----      光学そのもの)、E12 1PN は c²/G(E12 に Kt は現れず、補正の小ささは U/c² が決める
// ----      = 同じ α_min を GR の偏向 α=4Gm/(bc²) に当てた形)。物理対応ロック Kt=c²/G では
// ----      両者は厳密に一致する(設計: 内部開発文書 DESIGN_4-48_RAY_MASS_MIN.md — 非公開管理)。
// ----      検査は5節: ①全内蔵プリセットで実使用の光線源集合(光線キャッシュキーの構成要素)が
// ----      式どおり ②しきい直上/直下のカナリア対で曲げる/曲げないが切り替わる
// ----      ③しきい値が Kt・R・ε に式どおり比例(=光速とGからの導出が効いている)
// ----      ④1PN 源のカナリア対 — しきい直上/直下で E12 の効き(λ_PN=1 と 0 の差)が
// ----      現れる/厳密に消える ⑤源集合が変わればキャッシュキーも必ず変わる(v1.22 追随性)。
// ----      機能判定子 = HP.RAY_ALPHA_MIN(旧定数のままの root では SKIP)----
{
  const hasAlpha = await page.evaluate(() => typeof window.HP.RAY_ALPHA_MIN === 'number');
  if (hasAlpha) {
    const r = await page.evaluate(() => {
      const A = HP.RAY_ALPHA_MIN;
      // 光線キャッシュキーから実使用の源集合を取り出す(";<i>,<x>,..." が源1件ぶん。";B..." は箱)
      // 第82便 A: kAbs>0 のプリセットではキー末尾に光学節(";O<kAbs,...>" と吸収体 ";a<i>,...")が
      // 付く。ここで見たいのは「光線を曲げる源集合」なので、箱(";B")と同様に取り除く
      const keySet = () => [...HP.rayKeyOf({ n: 26, spread: 0.85 }).split(';').slice(1)]
        .filter((s) => s[0] !== 'B' && s[0] !== 'O' && s[0] !== 'a').map((s) => +s.split(',')[0]);
      // ① 全内蔵プリセット: 式で独立に組み直した集合と、実使用の集合が一致するか
      const bad = [];
      for (const P of HP.allPresets()) {
        HP.loadPreset(P.id, false);
        const S = HP.sim, Kt = S.params.Kt, eps = S.params.softening;
        const want = [];
        for (let i = 0; i < S.n; i++)
          if (S.m[i] >= (A / 4) * Kt * Math.max(S.R[i], eps)) want.push(i);
        const got = keySet();
        if (want.length !== got.length || want.some((v, k) => v !== got[k]))
          bad.push(`${P.id}(式=${want.length}件/実使用=${got.length}件)`);
      }
      // ②③ カナリア: 1天体だけの合成 sim。R・Kt・ε を直接置いてしきい質量を確定させ、
      //    m をその直上/直下に置いて「曲げる/曲げない」が切り替わることを見る。
      //    G=0・D0=0・kFrame=0 なので、曲がりの源は当該天体の 2∇ψ だけ。
      const canary = (Kt, Rv, eps, mul) => {
        HP.sim.build({ id: 'qa_alpha', name: 'a', description: 'd',
          camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
          physics: { G: 0, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
            Kt, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
            geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: eps, timeScale: 1 },
          bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true }] });
        const S = HP.sim;
        S.R[0] = Rv;
        const mThr = (A / 4) * Kt * Math.max(Rv, eps);
        S.m[0] = mThr * mul; S.mEff[0] = S.m[0];
        const t = HP.traceRay(S, -400, Rv, 1, 0, 2, 400, null);
        return { mThr, m: S.m[0], heavy: HP.rayHeavy(S, 0),
          bend: Math.atan2(t.cy, t.cx), nSrc: keySet().length };
      };
      const up = canary(100, 20, 2, 1.0001), dn = canary(100, 20, 2, 0.9999);
      // ③ しきい質量は Kt・max(R,ε) に比例(ε 支配域では R に依らず ε で決まる)
      const kt2 = canary(200, 20, 2, 1.0001).mThr, r2 = canary(100, 40, 2, 1.0001).mThr;
      const epsDom = canary(100, 1, 8, 1.0001).mThr;   // R=1 < ε=8 → max(R,ε)=8 側で決まる
      // ④ 1PN 源のカナリア: V18 と同形の軌道(GM~98・a=60・e=0.2056)で λ_PN=1 と 0 の差を見る。
      //    しきい質量は c²/G=1600・R=12.247(明示半径)で m_min=(α/4)·1600·12.247。
      const PN_R = 12.247, PN_KGR = 1600, pnThr = (A / 4) * PN_KGR * Math.max(PN_R, 0.5);
      const pnRun = (mul, lam) => {
        HP.sim.build({ id: 'qa_alpha_pn', name: 'a', description: 'd',
          camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
          physics: { G: 1, D0: 0.05, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
            Kt: 10000, cLight: 40, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
            geoPN: 1, lambdaPN: lam, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
          bodies: [
            { type: 'single', m: pnThr * mul, radius: PN_R, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
            { type: 'single', m: 0.01, x: 47.664, y: 0, vx: 0, vy: 1.94787, spin: 0, pinned: false }] });
        const S = HP.sim;
        for (let k = 0; k < 2000; k++) S.step(0.016);
        return { x: S.x[1], y: S.y[1], src: HP.pnSource(S, 0), R: S.R[0],
          mThr: HP.pnMassMin(S.params, S.R[0]) };
      };
      const pnUp = pnRun(1.0001, 1), pnUp0 = pnRun(1.0001, 0);
      const pnDn = pnRun(0.9999, 1), pnDn0 = pnRun(0.9999, 0);
      const pn = { thr: pnThr, thrGot: pnUp.mThr, R: pnUp.R, srcUp: pnUp.src, srcDn: pnDn.src,
        dUp: Math.hypot(pnUp.x - pnUp0.x, pnUp.y - pnUp0.y),
        dDn: Math.hypot(pnDn.x - pnDn0.x, pnDn.y - pnDn0.y) };
      // 物理対応ロック Kt=c²/G のときのしきい質量 = (α/4)(c²/G)max(R,ε)(光速とGからの導出)。
      // このとき光線側 rayMassMin と 1PN 側 pnMassMin は厳密一致する
      HP.setPhysLock(false); HP.loadPreset('grcal', false); HP.setPhysLock(true);
      const S2 = HP.sim, p2 = S2.params;
      const lock = { Kt: p2.Kt, want: (A / 4) * (p2.cLight * p2.cLight / p2.G) * Math.max(S2.R[0], p2.softening),
        got: HP.rayMassMin(p2, S2.R[0]), pnGot: HP.pnMassMin(p2, S2.R[0]), bendsStill: HP.rayHeavy(S2, 0) };
      HP.setPhysLock(false);
      // ⑤ キャッシュキーの追随: 源集合が変わればキーも変わる/変わらなければキーも同一
      HP.loadPreset('lensing', false);
      const S3 = HP.sim, k0 = HP.rayKeyOf({ n: 26, spread: 0.85 }), n0 = keySet().length;
      const m0 = S3.m[0];
      S3.m[0] = HP.rayMassMin(S3.params, S3.R[0]) * 0.999;   // 源から外れる
      const kOut = HP.rayKeyOf({ n: 26, spread: 0.85 }), nOut = keySet().length;
      S3.m[0] = m0;
      const kBack = HP.rayKeyOf({ n: 26, spread: 0.85 });
      HP.loadPreset('lensing', false);
      return { A, bad, up, dn, kt2, r2, epsDom, pn,
        lock, cache: { changed: kOut !== k0, restored: kBack === k0, n0, nOut } };
    });
    const eq = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
    const chk = {
      set: r.bad.length === 0,
      upHeavy: r.up.heavy, upBend: Math.abs(r.up.bend) > 1e-4, upKey: r.up.nSrc === 1,
      dnLight: !r.dn.heavy, dnBend: r.dn.bend === 0, dnKey: r.dn.nSrc === 0,
      mThr: eq(r.up.mThr, (r.A / 4) * 100 * 20), propKt: eq(r.kt2, 2 * r.up.mThr),
      propR: eq(r.r2, 2 * r.up.mThr), propEps: eq(r.epsDom, (r.A / 4) * 100 * 8),
      // R は Float32 格納なので、実装値は「同じ R で組み直した式」と一致するかで見る
      pnThr: eq(r.pn.thrGot, (r.A / 4) * 1600 * Math.max(r.pn.R, 0.5)),
      pnSrcUp: r.pn.srcUp, pnSrcDn: !r.pn.srcDn,
      pnUp: r.pn.dUp > 1e-3, pnDn: r.pn.dDn === 0,
      lockRay: eq(r.lock.got, r.lock.want), lockPn: eq(r.lock.pnGot, r.lock.want),
      lockKt: r.lock.Kt === 3600, lockBend: r.lock.bendsStill,
      keyChanged: r.cache.changed, keyRestored: r.cache.restored,
      keyN0: r.cache.n0 === 2, keyNOut: r.cache.nOut === 1 };
    const ng = Object.keys(chk).filter((k) => !chk[k]);
    const ok = ng.length === 0;
    add('ray.alpha-threshold', ok,
      `α_min=${r.A}rad / ①全内蔵プリセットで光線源集合=式 m≥(α/4)Kt·max(R,ε)(不一致=${r.bad.length}件` +
      `${r.bad.length ? ':' + r.bad.slice(0, 3).join(' ') : ''}) / ②カナリア(Kt=100,R=20,ε=2 → ` +
      `m_min=${r.up.mThr.toFixed(3)}): 直上 m=${r.up.m.toFixed(4)} 源=${r.up.heavy} ` +
      `偏向=${r.up.bend.toExponential(2)}rad(≠0) ⇔ 直下 m=${r.dn.m.toFixed(4)} 源=${r.dn.heavy} ` +
      `偏向=${r.dn.bend}(厳密0) / ③比例: Kt×2→m_min=${r.kt2.toFixed(3)} R×2→${r.r2.toFixed(3)} ` +
      `R<εではε支配→${r.epsDom.toFixed(3)} / ④1PN源(c²/G=1600,R=12.247 → ` +
      `m_min=${r.pn.thr.toFixed(3)}=実装${r.pn.thrGot.toFixed(3)}): 直上 源=${r.pn.srcUp} ` +
      `|Δr(λ_PN 1−0)|=${r.pn.dUp.toExponential(2)}(>1e-3) ⇔ 直下 源=${r.pn.srcDn} ` +
      `|Δr|=${r.pn.dDn}(厳密0) / 物理対応ロック(Kt=c²/G=${r.lock.Kt}): ` +
      `m_min=${r.lock.got.toFixed(2)}=(α/4)(c²/G)max(R,ε)=${r.lock.want.toFixed(2)}` +
      `(1PN側も同値=${r.lock.pnGot.toFixed(2)}・🛰️の主星は源のまま=${r.lock.bendsStill}) / ` +
      `⑤キャッシュキー追随: 源${r.cache.n0}→${r.cache.nOut}件でキー変化=${r.cache.changed} ` +
      `復帰で同一=${r.cache.restored}${ok ? '' : ' / NG項目=' + ng.join(',')}`);
  } else {
    console.log('SKIP ray.alpha-threshold(対象に HP.RAY_ALPHA_MIN なし — 旧 RAY_MASS_MIN=40 のままの root 等。第45便 45A/台帳4-48)');
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
    //    第39便 39A(台帳4-72): 🕶️ を v6(中心BH+対向2ローター・n=391→383)へ**意図的に再設計した**
    //    ため、旧基準 4dee00d8f2db22aa…(v5 の軌道)は原理的に一致しえない。基準を v6 の実測へ
    //    貼り直した(同一ページで2回走らせてハッシュ一致=決定論であることを確認済み)。
    //    検査している不変条件(数値指定の掻出は auto 経路に入らず lightSweep が動かない・
    //    走行が bit 決定論)は変わっていない。なお「Wave C の実装が既存の数値経路を1ビットも
    //    変えていない」という当初の証跡自体は、下の tint.zero-cost が持つ galaxy/saturn/
    //    counterring/freebox/echo の5件(いずれも実装前に採取した基準のまま)で維持される。
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
    // 第39便 39A で v6 へ貼り直し(旧 v5 基準 = 4dee00d8f2db22aa…・n=391)
    // 第40便 40A(台帳4-81): E6′ 反作用③を倍精度アキュムレータ化 = **意図的な数値経路の変更**。
    // 🕶️は kFrame=1 なので③を通り、軌道は bit 一致しえない。基準を 4-81 実装後の実測へ貼り直した
    // (同一ページで2回走らせてハッシュ一致=決定論であることを確認済み)。倍精度化前の対象
    // (root=v1.33 以前)には旧基準を当てる。検査している不変条件(数値指定の掻出は auto 経路に
    // 入らず lightSweep が動かない・走行が bit 決定論)は変わっていない
    const DR_BASE = hasE6Acc
      ? '187585513e1d5c0a041b0aa000751099175cbf45c7828bcc550dec530cdf9af2'   // 40A(倍精度化後)実測
      : 'b9fc553c3fe6569ef48a34a9719abdadc4e046a76f2016471d706d34ee3e836c';  // 39A v6・倍精度化前
    add('sweep.numeric-unchanged',
      dr.n === 383 && drHash === DR_BASE && dr.auto === false &&
      dr.lS0[0] === 1 && dr.lS0[1] === 1 && dr.lS1[0] === 1 && dr.lS1[1] === 1,
      `🕶️darkrotor 300步 x,y,spinハッシュ=${drHash.slice(0, 16)}…(基準=${DR_BASE.slice(0, 16)}… bit一致=${drHash === DR_BASE}) ` +
      `auto経路=${dr.auto}(false=ゼロコスト) lightSweep=${dr.lS1.join(',')}(不変) [E6′倍精度化(4-81)=${hasE6Acc}]`);

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP radius.default-one/rmul.schema/sweep.auto-*/sweep.numeric-unchanged(対象に Wave C 未適用 — root 等)');
  }
}

// ---- 7z5) 第36便 Wave D(台帳4-51 / A9 改訂): 温度の内部状態変数化 thermal:"tint"
// ----      (beta 先行 — ルート対象時はスキップ)----
{
  const hasTint = await page.evaluate(() => typeof HP.obsTemp === 'function' && !!HP.sim.thermal);
  if (hasTint) {
    // ① tint.schema: 最上位キー thermal の enum クランプ(integrator と同形)と body.tInt の値域クランプ。
    //    thermal は SYSTEM_PROMPT に載せない(AI 生成に開放しない)ので、受理してクランプするだけ
    const sc = await page.evaluate(() => {
      const mk = (extra, body) => Object.assign({ name: 't', description: 'thermal スキーマ検査',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [Object.assign({ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }, body || {})] }, extra);
      const V = (o) => { const v = HP.validatePreset(o); return { ok: v.ok, p: v.preset, w: v.warnings.length }; };
      const tint = V(mk({ thermal: 'tint' }));
      const spin = V(mk({ thermal: 'spin' }));
      const bad = V(mk({ thermal: 'hot' }));
      const none = V(mk({}));
      const tHi = V(mk({ thermal: 'tint' }, { tInt: 99999 }));
      const tLo = V(mk({ thermal: 'tint' }, { tInt: -5 }));
      const tOk = V(mk({ thermal: 'tint' }, { tInt: 12.5 }));
      const tNaN = V(mk({ thermal: 'tint' }, { tInt: 'x' }));
      // エンジン側: thermal 省略/spin では Tint を確保しない(ゼロコスト)・tint では確保する
      const s = HP.sim;
      s.build(mk({ thermal: 'tint' }, { tInt: 7 }));
      const engTint = { thermal: s.thermal, has: !!s.Tint, T0: s.Tint ? s.Tint[0] : null };
      s.build(mk({}, { tInt: 7 }));
      const engSpin = { thermal: s.thermal, has: !!s.Tint };
      return { tint: tint.p.thermal, spin: spin.p.thermal, bad: bad.p.thermal, badW: bad.w,
        none: none.p.thermal, tHi: tHi.p.bodies[0].tInt, tHiW: tHi.w, tLo: tLo.p.bodies[0].tInt,
        tOk: tOk.p.bodies[0].tInt, tOkW: tOk.w, tNaNok: tNaN.ok, engTint, engSpin };
    });
    add('tint.schema',
      sc.tint === 'tint' && sc.spin === 'spin' && sc.bad === 'spin' && sc.badW === 1 && sc.none === undefined
      && sc.tHi === 10000 && sc.tHiW === 1 && sc.tLo === 0 && sc.tOk === 12.5 && sc.tOkW === 0
      && sc.tNaNok === false
      && sc.engTint.thermal === 'tint' && sc.engTint.has && sc.engTint.T0 === 7
      && sc.engSpin.thermal === 'spin' && !sc.engSpin.has,
      `thermal: "tint"→${sc.tint} "spin"→${sc.spin} "hot"→${sc.bad}(警告${sc.badW}件) 省略→${sc.none} / ` +
      `tInt: 99999→${sc.tHi}(警告${sc.tHiW}件) -5→${sc.tLo} 12.5→${sc.tOk}(警告${sc.tOkW}件=0) "x"→検証NG=${!sc.tNaNok} / ` +
      `エンジン: tint で Tint 確保=${sc.engTint.has}(T=${sc.engTint.T0}) spin で未確保=${!sc.engSpin.has}`);

    // ② tint.zero-cost: thermal 省略(spin モード)のプリセットは Wave D の実装前と 1 ビットも変わらない。
    //    基準ハッシュは本便 D 着手時点(第36便 36C 完了 = f1468b1)の beta/index.html で採取した実測値で、
    //    さらに第35便 W2 直前(ea9c8a2)でも同一であることを確認済み(= 移行しない全系統の無変更の証跡)。
    //    形式は sweep.numeric-unchanged と同じ 300步 x,y,spin ハッシュ
    //    第39便 39A(台帳4-72): darkrotor だけ v6 への意図的な再設計で軌道が変わったため基準を
    //    貼り直した(n=391→383)。**他の5件は実装前に採取した基準のまま**なので、
    //    「thermal 省略のプリセットは Wave D 実装前と1ビットも変わらない」という当初の証跡は
    //    その5件で維持される(darkrotor の行は以後「v6 の軌道が spin モードのまま決定論で
    //    再現すること」の回帰検査として働く)。
    //    第40便 40A(台帳4-81): E6′ 反作用③を倍精度アキュムレータ化 = **意図的な数値経路の変更**。
    //    kFrame>0 の3件(galaxy/saturn/darkrotor)だけ③を通るため bit が変わり、基準を 4-81 実装後の
    //    実測へ貼り直した。kFrame=0 の3件(counterring/freebox/echo)は③に入らないので基準は
    //    実装前のまま **1 ビットも変わっていない** — この3件が「4-81 の変更が E6′ 経路の外へ
    //    漏れていない」ことの機械的な証跡になる(Wave D 実装前からの無変更の証跡もこの3件で継続)。
    //    倍精度化前の対象(root=v1.33 以前)には旧基準を当てる
    //    第40便 40C(台帳4-82): さらに 🪐saturn だけ環粒子 300→240(n=301→241)= **初期配置の
    //    意図的な変更**なので、🪐 の行だけ 4-82 実装後の実測へ貼り直した(判定子は環粒子数から
    //    直接数える hasSat240)。galaxy/darkrotor は 4-82 で 1 ビットも触っていないので 40A の基準のまま。
    const ZC = hasE6Acc ? {
      galaxy: ['2f9f3b381a962df5826c340cfbbec9449707f8c758b94523c23237b3ec909f80', 381],   // 40A で貼り直し
      saturn: hasSat240
        ? ['5a4e97ec425c03b30803e3f8bc4dc419b66f57d1c1a62cd0d5a6df8e7e480085', 241]                                                   // 40C(4-82・n=241)で貼り直し
        : ['d77783f2c321a6c84a457492d869a5d68a35061c82d957d0597a5864e3938fbb', 301],        // 40A(n=301)
      darkrotor: ['187585513e1d5c0a041b0aa000751099175cbf45c7828bcc550dec530cdf9af2', 383], // 40A で貼り直し
      counterring: ['29fb3cab287f4fd0301b3843575b3acf24709e687574a4135f6df135dd687f11', 201], // kFrame=0 = 不変
      freebox: ['a9fbb51894a298af70dc7350e61f9e8fce32e10abddd2ecdafa989312260bc7d', 72],      // kFrame=0 = 不変
      echo: ['9e09d365c44a32ebd423d933eab9ea494bfb9a69a46eebd316aaf1bde1dac4d7', 31],        // kFrame=0 = 不変
    } : {
      galaxy: ['51a8ff116ddd4aee4849a8db61a53d3ab8d9da6df8b3606cc52ed369ca853386', 381],
      saturn: ['6e6ee844cc3cb82b4052885c8d86ccffad44f74c0b44c3da253007e398e1fb87', 301],
      // 第39便 39A で v6 へ貼り直し(旧 v5 基準 = 4dee00d8f2db22aa…・n=391)
      darkrotor: ['b9fc553c3fe6569ef48a34a9719abdadc4e046a76f2016471d706d34ee3e836c', 383],
      counterring: ['29fb3cab287f4fd0301b3843575b3acf24709e687574a4135f6df135dd687f11', 201],
      freebox: ['a9fbb51894a298af70dc7350e61f9e8fce32e10abddd2ecdafa989312260bc7d', 72],
      echo: ['9e09d365c44a32ebd423d933eab9ea494bfb9a69a46eebd316aaf1bde1dac4d7', 31],
    };
    const zc = [];
    for (const [id, [base, n]] of Object.entries(ZC)) {
      const r = await page.evaluate((pid) => {
        HP.loadPreset(pid, false);
        const s = HP.sim;
        for (let k = 0; k < 300; k++) s.step(0.016);
        const a = [];
        for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.spin[i]);
        return { n: s.n, thermal: s.thermal, has: !!s.Tint, str: a.map(v => v.toExponential(12)).join(',') };
      }, id);
      const h = crypto.createHash('sha256').update(r.str).digest('hex');
      zc.push({ id, ok: h === base && r.n === n && r.thermal === 'spin' && !r.has, h: h.slice(0, 8) });
    }
    const zbad = zc.filter(z => !z.ok).map(z => `${z.id}(${z.h})`);
    add('tint.zero-cost', zbad.length === 0,
      zbad.length ? `bit不一致/経路混入: ${zbad.join(' ')}`
        : `${zc.length}件が bit 一致(300步 x,y,spin ハッシュ): ${zc.map(z => z.id).join(' ')} — 全て thermal=spin・Tint 未確保`);

    // ③ tint.migrated: 移行7サンプルが thermal:"tint" を宣言し、初期の熱が spin ではなく tInt にある
    //    (spin 初期値は 0 か微小 — 「高スピン=熱い」からの移行が漏れていないことの機械固定)
    //    第37便 B2: ❄️snowline 廃止(原仮定者裁定)に伴い対象から除外(8→7件)
    const mig = await page.evaluate(() => {
      // 第60便: 🧊phase は beta で廃止 — 存在するものだけを対象にする(root は7件のまま)
      const IDS = ['gas', 'pressure', 'conduction', 'coolrace', 'phase', 'convection', 'buoyancy']
        .filter(id => HP.allPresets().some(q => q.id === id));
      const out = {};
      for (const id of IDS) {
        const p = HP.allPresets().find(q => q.id === id);
        if (!p) { out[id] = { missing: true }; continue; }
        HP.loadPreset(id, false);
        const s = HP.sim;
        let maxSpin = 0, maxT = 0;
        for (let i = 0; i < s.n; i++) { maxSpin = Math.max(maxSpin, Math.abs(s.spin[i])); maxT = Math.max(maxT, s.Tint ? s.Tint[i] : 0); }
        out[id] = { thermal: p.thermal, mode: s.thermal, maxSpin, maxT };
      }
      return out;
    });
    const mbad = Object.entries(mig).filter(([, v]) => v.missing || v.thermal !== 'tint' || v.mode !== 'tint'
      || v.maxSpin > 0.5 || !(v.maxT > 0)).map(([k]) => k);
    add('tint.migrated', mbad.length === 0,
      mbad.length ? `未移行/初期条件が spin のまま: ${mbad.join(' ')}`
        : Object.entries(mig).map(([k, v]) => `${k}(T≤${v.maxT}·s≤${v.maxSpin})`).join(' '));

    // ---- 第37便 C2(台帳4-71 / L17 解消): 融解の潜熱 ----
    // ④ tint.latent-heat: 冷たい塊に一定パワーで熱を入れると、吸熱の大半が E5′ の対ポテンシャル
    //    U_rep(=塊をほどく仕事)へ入り、観測温度 T_obs の上がり方が「潜熱なし」の基準線
    //    ΔT=ΔQ/(C·M) より大幅に鈍る(潜熱プラトー)。第36便 D の §D3 では U_rep が帳簿外(L17)
    //    だったため、この鈍りは一切現れなかった(T は単調に上がるだけ)。
    //    構成: 箱(size30)の中央に pinned の高温粒子(T_int=120)、その周りに自己重力で固まる24粒子。
    const lat = await page.evaluate(() => {
      const s = HP.sim;
      s.build({
        id: 'qa_latent', name: 'latent', camera: { scale: 200 }, world: { boundary: 'box', size: 30 },
        thermal: 'tint',
        physics: { G: 4, D0: 0, kFrame: 0, kRep: 2, q: 2, muF: 0.3, gammaN: 0.5, kappaS: 0.15,
          etaRad: 0, pRad: 1, cHeat: 0.2, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [
          { type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 120, pinned: true },
          { type: 'disk', n: 24, cx: 0, cy: 0, radius: 12, mMin: 1, mMax: 1, tInt: 0.01,
            spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, vScale: 0, direction: 1 }
        ], overlays: {}
      });
      const C = s.params.cHeat;
      let M = 0; for (let i = 0; i < s.n; i++) if (!s.pinned[i]) M += s.m[i];
      const T = () => { let a = 0, c = 0; for (let i = 0; i < s.n; i++) if (!s.pinned[i]) { a += s.Tint[i]; c++; } return a / c; };
      // 系が吸った熱 = 顕熱 ΣC·m·T_int + 潜熱 U_rep(pinned は無限熱容量なので除外)
      const Q = () => { let a = 0; for (let i = 0; i < s.n; i++) if (!s.pinned[i]) a += C * s.m[i] * s.Tint[i]; return a + HP.urepEnergy(s); };
      const snap = [];
      for (let k = 0; k <= 2400; k++) { if (k % 100 === 0) snap.push([k, T(), Q(), HP.urepEnergy(s)]); s.step(0.016); }
      const at = (k) => snap.find(r => r[0] === k);
      const a = at(100), b = at(600), e = at(1200), f = at(2400);
      let umax = 0, ufrac = 0;
      for (const r of snap) if (r[3] > umax) { umax = r[3]; ufrac = r[3] / r[2]; }
      return { slope: (b[1] - a[1]) / (b[2] - a[2]), ideal: 1 / (C * M), umax, ufrac,
        T: [a[1], b[1], e[1], f[1]], plateau: f[1] / e[1], nan: s.hasNaN(), M };
    });
    // 実測(beta 2026-07-27): dT/dQ=0.0536 / 潜熱なし基準 1/(C·M)=0.2083 → 比 0.257(閾値0.6の2.3倍下)。
    // U_rep が吸熱に占める最大割合 0.665(閾値0.35の1.9倍上)。T_obs 平均は
    // 3.09(100步)→9.56(600步)→11.50(1200步)→12.44(2400步)で、1200→2400步の伸びは1.08倍(閾値1.3)
    add('tint.latent-heat',
      !lat.nan && lat.slope / lat.ideal < 0.6 && lat.ufrac > 0.35 && lat.plateau < 1.3,
      `融解区間(100→600步)の ΔT/ΔQ=${lat.slope.toFixed(4)} / 潜熱なし基準 1/(C·M)=${lat.ideal.toFixed(4)} → ` +
      `比=${(lat.slope / lat.ideal).toFixed(3)}(<0.6 — 吸熱の${((1 - lat.slope / lat.ideal) * 100).toFixed(0)}%が U_rep へ) / ` +
      `U_rep 最大=${lat.umax.toFixed(1)}(吸熱の${(lat.ufrac * 100).toFixed(1)}%>35%) / ` +
      `T_int平均 ${lat.T.map(v => v.toFixed(2)).join(' → ')}(1200→2400步 ${lat.plateau.toFixed(2)}倍<1.3 = プラトー)`);

    // ⑤ 第64便 64B(A9″): tint.microspin-alias — thermal:"microspin" は "tint" の同義の別名として
    //    受理・正規化され、body.microSpinRms は tInt = rms² へ正規化される(正本状態は tInt のまま)。
    //    数値等価は 300步の x/y/vx/vy/Tint 全要素一致で機械証明する(別名は新モードではない —
    //    A9″ は既存 T_int の意味論の正式化。PHYSICS.md §2 A9″)。64B 未適用の対象(root 等)では
    //    "microspin" が enum 外 → "spin" へクランプされるので、正規化の成否を検出子にして分岐する
    const hasMicrospin = await page.evaluate(() =>
      HP.validatePreset({ name: 'd', description: 'd', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: {}, thermal: 'microspin',
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }).preset.thermal === 'tint');
    if (hasMicrospin) {
      const ms = await page.evaluate(() => {
        const mk = (thermal, body) => ({ name: 'ms', description: 'microspin 別名検査', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, seed: 1, thermal,
          physics: { G: 0, D0: 1, kFrame: 0, q: 2, kRep: 0.5, muF: 0.3, gammaN: 0.2, kappaS: 0.05,
            etaRad: 0.01, pRad: 4, cHeat: 1, softening: 2, radiusScale: 1, timeScale: 1 },
          bodies: [body,
            { type: 'box', rMul: 1, n: 20, cx: 0, cy: 0, w: 100, h: 100, mMin: 1, mMax: 1,
              spinMin: 0, spinMax: 0, tInt: 1, vScale: 0.2 }] });
        const V = (o) => HP.validatePreset(o);
        const body = (extra) => Object.assign({ type: 'single', m: 2, x: 10, y: 0, vx: 0, vy: 0, spin: 0.5, pinned: false }, extra);
        const A = V(mk('microspin', body({ microSpinRms: 3 })));
        const B = V(mk('tint', body({ tInt: 9 })));
        const clampHi = V(mk('microspin', body({ microSpinRms: 200 })));
        const both = V(mk('microspin', body({ microSpinRms: 3, tInt: 4 })));
        const nonNum = V(mk('microspin', body({ microSpinRms: 'x' })));
        const s = HP.sim;
        const run = (v) => { s.build(v.preset); for (let k = 0; k < 300; k++) s.step(0.016);
          return { x: [...s.x], y: [...s.y], vx: [...s.vx], vy: [...s.vy], T: [...s.Tint], nan: s.hasNaN() }; };
        const ra = run(A), rb = run(B);
        const eq = (u, v) => u.length === v.length && u.every((w, i) => w === v[i]);
        return { aThermal: A.preset.thermal, aW: A.warnings.length, aTint: A.preset.bodies[0].tInt,
          aNoRms: !('microSpinRms' in A.preset.bodies[0]),
          bitEq: eq(ra.x, rb.x) && eq(ra.y, rb.y) && eq(ra.vx, rb.vx) && eq(ra.vy, rb.vy) && eq(ra.T, rb.T),
          nan: ra.nan || rb.nan,
          hiTint: clampHi.preset.bodies[0].tInt, hiW: clampHi.warnings.length,
          bothTint: both.preset.bodies[0].tInt, bothW: both.warnings.some(w => /併記/.test(w)),
          nonNumOk: nonNum.ok };
      });
      add('tint.microspin-alias',
        ms.aThermal === 'tint' && ms.aW === 0 && ms.aTint === 9 && ms.aNoRms
        && ms.bitEq && !ms.nan
        && ms.hiTint === 10000 && ms.hiW === 1
        && ms.bothTint === 4 && ms.bothW
        && ms.nonNumOk === false,
        `"microspin"→${ms.aThermal}(警告${ms.aW}件=0) microSpinRms:3→tInt=${ms.aTint}(キー削除=${ms.aNoRms}) / ` +
        `300步 bit 等価=${ms.bitEq}(NaN=${ms.nan}) / 200→tInt=${ms.hiTint}(警告${ms.hiW}件) / ` +
        `tInt併記→tInt=${ms.bothTint} 優先(警告=${ms.bothW}) / 非数値→検証NG=${!ms.nonNumOk}`);
    } else {
      console.log('SKIP tint.microspin-alias(対象に 64B 未適用 — root 等)');
    }

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP tint.schema/tint.zero-cost/tint.migrated/tint.latent-heat(対象に Wave D 未適用 — root 等)');
  }
}

// ---- 7z5c) 第65便 65A(機構スペクトル診断・P0 — 第64便裁定 §2-3): 機構別 RMS 寄与の診断集積。
// ----       ① mechspec.zero-cost: overlays.mechSpectrum が無い既定状態は実装前基準(5e6ec71 の
// ----          beta で採取した 300步 x,y,spin(+Tint) ハッシュ)と bit 一致 = OFF はゼロコスト経路
// ----       ② mechspec.on-unchanged: 診断 ON でも同じ基準と bit 一致 = 集積は物理へ一切還流しない
// ----          (E14″ の「観測ラベルは物理へ還流しない」原則の機械固定)
// ----       ③ mechspec.sanity: 支配機構の分離 — ☿=重力+測地線 / 🧊=結合優勢 / 🕊️=熱斥力 /
// ----          🌌=引きずりチャネルが kFrame=1 でだけ立つ(T13 の診断層としての妥当性)----
{
  const hasMech = await page.evaluate(() => !!(HP.sim && typeof HP.sim.mechSpec === 'function'));
  if (hasMech) {
    // 基準は 65A 実装直前の beta(= 第64便 5e6ec71)で採取(tint.zero-cost と同形式+tint 系は Tint も連結)
    const MB = {
      mercury: '8666f01f3849fa6e2a409915b3a336bc8d8a1b4fa0f8b8d0a2ab3eb6f4e1abca',
      galaxy: '2f9f3b381a962df5826c340cfbbec9449707f8c758b94523c23237b3ec909f80',
      saturn: '5a4e97ec425c03b30803e3f8bc4dc419b66f57d1c1a62cd0d5a6df8e7e480085',
      emergent2: '0d1381838490754920051e5ff0a4123a3ce1483c38cdecfd5b777b7bdd46aa95',
      convection: 'd03bf56fce6814531be08249b2697ae487f98e109a4a3da6acd1181fa8550219',
      freebox: 'a9fbb51894a298af70dc7350e61f9e8fce32e10abddd2ecdafa989312260bc7d',
    };
    const run = (pid, mon, kF) => page.evaluate(({ pid, mon, kF }) => {
      HP.loadPreset(pid, false);
      const s = HP.sim;
      if (mon) s.overlays.mechSpectrum = true;
      if (kF !== undefined) s.params.kFrame = kF;
      for (let k = 0; k < 300; k++) s.step(0.016);
      const a = [];
      for (let i = 0; i < s.n; i++) { a.push(s.x[i], s.y[i], s.spin[i]); if (s.Tint) a.push(s.Tint[i]); }
      const spec = (mon && s.mechSpec) ? s.mechSpec(true) : null;
      const slots = mon ? HP.overlaySlots() : [];
      return { str: a.map(v => v.toExponential(12)).join(','), spec, hasMech: !!s.mech, slots };
    }, { pid, mon, kF });
    const H = (str) => crypto.createHash('sha256').update(str).digest('hex');
    const offBad = [], onBad = [], specs = {};
    for (const id of Object.keys(MB)) {
      const off = await run(id, false);
      if (H(off.str) !== MB[id] || off.hasMech) offBad.push(`${id}(${H(off.str).slice(0, 8)}${off.hasMech ? '・mech確保' : ''})`);
      const on = await run(id, true);
      if (H(on.str) !== MB[id]) onBad.push(`${id}(${H(on.str).slice(0, 8)})`);
      specs[id] = on;
    }
    add('mechspec.zero-cost', offBad.length === 0,
      offBad.length ? `bit不一致/経路混入: ${offBad.join(' ')}`
        : `${Object.keys(MB).length}件が実装前基準と bit 一致(300步)・OFF では mech 未確保`);
    add('mechspec.on-unchanged', onBad.length === 0,
      onBad.length ? `診断ONで物理が動いた: ${onBad.join(' ')}`
        : `診断ON(集積+読み出し)でも全${Object.keys(MB).length}件が同じ基準と bit 一致 = 物理への還流ゼロ`);
    // ③ 支配機構の分離(実測 65A: ☿ 98.6/1.4/0/0/0/0・🧊 0.5/0/22.9/17.8/58.8/0・
    //    🕊️ 1.7/0/98.3/0/0/0・🌌 30.4/0/5.1/50.7/0/13.8。チャネル順 [重力,測地線,熱斥力,接触,結合,引きずり])
    const gal0 = await run('galaxy', true, 0);   // 対照: kFrame=0 では引きずりチャネルが厳密 0
    const pm = specs.mercury.spec.pi, pe = specs.emergent2.spec.pi, pf = specs.freebox.spec.pi,
          pg = specs.galaxy.spec.pi, pg0 = gal0.spec.pi;
    const fmt = (p) => p.map(v => (v * 100).toFixed(1)).join('/');
    add('mechspec.sanity',
      pm[0] > 0.9 && pm[1] > 0.005 && pm[3] === 0 && pm[4] === 0 && pm[5] === 0
      && pe[4] > 0.4 && pe[4] > pe[0] && pe[1] === 0 && pe[5] === 0
      && pf[2] > 0.9
      && pg[5] > 0.05 && pg0[5] === 0
      && specs.galaxy.slots.includes('mechSpectrum'),
      `☿ Π=${fmt(pm)}(重力>90%・測地線>0.5%・接触/結合/引きずり=0) / ` +
      `🧊 Π=${fmt(pe)}(結合>40%かつ重力超え・測地線/引きずり=0) / ` +
      `🕊️ Π=${fmt(pf)}(熱斥力>90%) / ` +
      `🌌 Π=${fmt(pg)} vs kFrame=0 の引きずり=${(pg0[5] * 100).toFixed(1)}%(ON>5%・対照=厳密0) / ` +
      `スロット割当=${specs.galaxy.slots.includes('mechSpectrum')}`);
    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP mechspec.zero-cost/on-unchanged/sanity(対象に 65A 未適用 — root 等)');
  }
}

// ---- 7z5d) 第67便 67B(P3 サンプル分類 — 第64便裁定キュー): sampleClass 4分類チップ ----
// ----      ①全内蔵が有効値を宣言(principle/composite/calibration/semantic)②スポット照合
// ----      (🕶️=複合現象の明示は裁定要件・🎡☿=原理実証・🛰️=現実較正・boxredshift=意味論)
// ----      ③スキーマ(不正値は警告つき削除・有効値は保持)④チップの DOM 表示 ----
{
  const hasSC = await page.evaluate(() => HP.allPresets().some(p => p.sampleClass !== undefined));
  if (hasSC) {
    const r = await page.evaluate(() => {
      const SC = ['principle', 'composite', 'calibration', 'semantic'];
      const builtin = HP.allPresets().filter(p => !String(p.id).startsWith('custom_'));
      const missing = builtin.filter(p => SC.indexOf(p.sampleClass) < 0).map(p => p.id);
      const of = (id) => (builtin.find(p => p.id === id) || {}).sampleClass;
      const dist = {};
      for (const p of builtin) dist[p.sampleClass] = (dist[p.sampleClass] || 0) + 1;
      const mk = (sc) => ({ name: 't', description: 'sampleClass 検査', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {}, sampleClass: sc,
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      const good = HP.validatePreset(mk('composite'));
      const bad = HP.validatePreset(mk('hero'));
      HP.loadPreset('darkrotor', false);
      const chips = Array.from(document.querySelectorAll('#classChips .classChip')).map(e => e.dataset.g);
      return { n: builtin.length, missing, dist,
        spots: { darkrotor: of('darkrotor'), galaxyStd: of('galaxyStd'), mercury: of('mercury'),
                 zonal: of('saturnZonalD68'), redshift: of('boxredshift'), chaincycle: of('chaincycle') },
        goodKeep: good.preset.sampleClass === 'composite', goodW: good.warnings.length,
        badDrop: bad.preset.sampleClass === undefined, badW: bad.warnings.length,
        chipShown: chips.includes('sclass-composite') };
    });
    add('p3.sample-class',
      r.missing.length === 0
      && r.spots.darkrotor === 'composite' && r.spots.galaxyStd === 'principle'
      && r.spots.mercury === 'principle' && r.spots.zonal === 'calibration'
      && r.spots.redshift === 'semantic' && r.spots.chaincycle === 'principle'
      && r.goodKeep && r.goodW === 0 && r.badDrop && r.badW === 1
      && r.chipShown,
      `全内蔵${r.n}件が宣言(分布: ${Object.entries(r.dist).map(([k, v]) => `${k}=${v}`).join(' ')}) / ` +
      `スポット: 🕶️=${r.spots.darkrotor}(複合の明示は裁定要件) 🎡=${r.spots.galaxyStd} ☿=${r.spots.mercury} ` +
      `🛰️=${r.spots.zonal} 赤方偏移=${r.spots.redshift} ♻️=${r.spots.chaincycle} / ` +
      `スキーマ: 有効値保持=${r.goodKeep}(警告0) 不正値削除=${r.badDrop}(警告1) / チップ表示=${r.chipShown}` +
      (r.missing.length ? ` / 未宣言: ${r.missing.join(',')}` : ''));
  } else {
    console.log('SKIP p3.sample-class(対象に 67B 未適用 — root 等)');
  }
}

// ---- 7z5a2) 第47便 47A(台帳4-86 / 原仮定者裁定「対応する」・統括裁定=案B「pinned を外部熱浴
// ----        として扱う」): E10′(κs 熱伝導)は計算段階では pinned 天体との対も熱を交換するのに、
// ----        適用段階の②粒子ループが pinned を continue するため、pinned が受け取るはずの dQi が
// ----        どのリザーバにも載らずに消えていた(= 見かけのエネルギー消失。第46便 46S が
// ----        ☀️starcore で特定し、外部レビューが P0 判定)。新設リザーバ pinHeat に計上して
// ----        「粒子系+外部拘束」で第一法則が閉じることを機械証明する。
// ----        機能判定子: エンジンに 'pinHeat' があるか(root は未実装なので 2 件とも SKIP)----
{
  const hasPinHeat = await page.evaluate(() => 'pinHeat' in HP.sim);
  if (hasPinHeat) {
    // ① conduction.pinned-bath(外部レビューの必須QA仕様):
    //    pinned 1体(T高)+ free 1体(T低)・κs>0・etaRad=0・G=0・kRep=0・muF=0・γn=0・非接触。
    //    力が一つも働かないので粒子は 1 ビットも動かず、変わるのは T_int だけの純粋な伝熱系。
    //    (a) 1步の熱量が E10′ の解析値 Q̇=C·κs·(T_j−T_i)·g²·μ·dt と一致し、向きが高温→低温
    //    (b) ΔH_free + pinHeat = 0(free の内部熱の増分は、そっくり pinned 熱浴から出た分)
    //    (c) 逆向き(free が高温)も同じ恒等式で閉じる
    const bath = await page.evaluate(() => {
      const s = HP.sim, DT = 0.016;
      // m=100(R=10)の pinned と m=1(R=1)の free を d=11.5 に置く。sumR=11 < d なので
      // 法線ばね(E9)は働かず、G=kRep=0 で力はゼロ。R も d も Float32 で厳密表現できる値
      const build = (Tp, Tf) => s.build({
        id: 'qa_pinbath', name: 'pinbath', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        thermal: 'tint',
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 2,
          etaRad: 0, pRad: 1, cHeat: 1, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [
          { type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: Tp, pinned: true },
          { type: 'single', m: 1, x: 11.5, y: 0, vx: 0, vy: 0, spin: 0, tInt: Tf, pinned: false }
        ], overlays: {}
      });
      // (a) 1步の解析値照合
      build(200, 0);
      const C = s.params.cHeat, K = s.params.kappaS;
      const sumR = s.R[0] + s.R[1], d = 11.5, g = sumR / (sumR + d), gg = g * g;
      const mu = s.m[0] * s.m[1] / (s.m[0] + s.m[1]);
      const T0p = s.Tint[0], T0f = s.Tint[1];
      const qAna = C * K * (T0f - T0p) * gg * mu * DT;   // E10′(第37便 C2 の熱流形)
      s.step(DT);
      const one = { qAna, pin: s.pinHeat, dH: C * s.m[1] * (s.Tint[1] - T0f), gg, mu,
        pinFixed: s.Tint[0] === T0p, still: s.vx[1] === 0 && s.vy[1] === 0 && s.x[1] === 11.5 };
      // (b)(c) N步の閉性
      const run = (N, Tp, Tf) => {
        build(Tp, Tf);
        const H0 = C * s.m[1] * s.Tint[1];
        for (let k = 0; k < N; k++) s.step(DT);
        const H1 = C * s.m[1] * s.Tint[1];
        return { dH: H1 - H0, pin: s.pinHeat, Tf0: Tf, Tf1: s.Tint[1], Tp1: s.Tint[0],
          radE: s.radE, nan: s.hasNaN(), still: s.vx[1] === 0 && s.vy[1] === 0 && s.x[1] === 11.5 };
      };
      return { one, fwd: run(120, 200, 0), rev: run(120, 0, 200) };
    });
    const relQ = Math.abs(bath.one.pin - bath.one.qAna) / Math.abs(bath.one.qAna);
    const relC = (r) => Math.abs(r.dH + r.pin) / Math.max(Math.abs(r.pin), 1e-30);
    const rF = relC(bath.fwd), rR = relC(bath.rev);
    // 実測(beta 2026-07-30 第47便 47A): 1步 pinHeat=−1.5145336755897811 が解析値と bit 一致(相対 0)。
    // 120步: 順方向 ΔH_free=+119.6703 / pinHeat=−119.6703(相対 3.9e-8)、逆方向は符号が反転して
    // 相対 1.2e-8。残差は T_int が Float32 で格納されることによる丸めのみ(閾値 1e-6 の 25 倍以上の余裕)
    add('conduction.pinned-bath',
      !bath.fwd.nan && !bath.rev.nan && bath.one.pinFixed && bath.one.still
      && bath.fwd.still && bath.rev.still && bath.fwd.radE === 0 && bath.rev.radE === 0
      && relQ < 1e-9 && bath.one.pin < 0
      && bath.fwd.dH > 0 && bath.fwd.pin < 0 && rF <= 1e-6
      && bath.rev.dH < 0 && bath.rev.pin > 0 && rR <= 1e-6
      && bath.fwd.Tf1 > 100 && bath.rev.Tf1 < 100,
      `E10′ 解析値 Q=C·κs·(T_f−T_p)·g²·μ·dt=${bath.one.qAna.toExponential(12)}(g²=${bath.one.gg.toFixed(6)} μ=${bath.one.mu.toFixed(6)}) ` +
      `→ 1步の pinHeat=${bath.one.pin.toExponential(12)}(相対差=${relQ.toExponential(2)}<1e-9 = 解析値と bit 一致・` +
      `符号<0 = 高温 pinned → 低温 free の向き) 熱浴の T は不変=${bath.one.pinFixed} 粒子は静止=${bath.one.still} / ` +
      `**閉性 ΔH_free + pinHeat = 0**: 順(pinned 200 → free 0)120步 ΔH_free=${bath.fwd.dH.toFixed(6)} ` +
      `pinHeat=${bath.fwd.pin.toFixed(6)} 相対=${rF.toExponential(2)}(≤1e-6) T_free 0→${bath.fwd.Tf1.toFixed(3)} / ` +
      `逆(free 200 → pinned 0)120步 ΔH_free=${bath.rev.dH.toFixed(6)} pinHeat=${bath.rev.pin.toFixed(6)} ` +
      `相対=${rR.toExponential(2)}(≤1e-6) T_free 200→${bath.rev.Tf1.toFixed(3)} / radE=0(放射経路なし)`);

    // ② conduction.pinned-zero-cost: κs>0 と pinned を併用する唯一の内蔵プリセット 📏conduction
    //    (thermal:"tint"・κs=0.3・pinned 2体の熱浴)を 300 步走らせ、全粒子の
    //    x,y,vx,vy,spin,R,m,T_int を **基点 3cc348b(修正前)で採取した実測ハッシュ**と照合する。
    //    一致すれば「本修正は帳簿(pinHeat)の追加だけで、自由粒子側の数値経路を 1 ビットも
    //    変えていない」ことの機械証明になる(統括裁定の受け入れ条件)。
    //    同時に、この既存プリセットでも ΔH_free + pinHeat = 0 が成り立つことを確認する
    //    (修正前はこの 64.63 がどの帳簿にも載らずに消えていた = 台帳4-86 の本体)。
    //    ※ spin モードの κs>0+pinned(🌌galaxy/🪐saturn/🔭lensing 等)は dQi 経路を通らない
    //       (E10′ はスピンを直接動かし、その回転エネルギー差は既に radE へ計上済み)ので無影響。
    const CPZ_BASE = 'beb44e8d05eb1fed8fb0becc9ac672ce7d6644cda37afeca24541d2695a9fadc';
    const cpz = await page.evaluate(() => {
      HP.loadPreset('conduction', false);
      const s = HP.sim;
      const C = s.params.cHeat;
      let np = 0, H0 = 0;
      for (let i = 0; i < s.n; i++) { if (s.pinned[i]) np++; else H0 += C * s.m[i] * s.Tint[i]; }
      for (let k = 0; k < 300; k++) s.step(0.016);
      let H1 = 0;
      for (let i = 0; i < s.n; i++) if (!s.pinned[i]) H1 += C * s.m[i] * s.Tint[i];
      const a = [];
      for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.vx[i], s.vy[i], s.spin[i], s.R[i], s.m[i], s.Tint[i]);
      return { n: s.n, np, thermal: s.thermal, kappaS: s.params.kappaS, dH: H1 - H0,
        pin: s.pinHeat, radE: s.radE, nan: s.hasNaN(), str: a.map(v => v.toExponential(12)).join(',') };
    });
    const cpzHash = crypto.createHash('sha256').update(cpz.str).digest('hex');
    const cpzRel = Math.abs(cpz.dH + cpz.pin) / Math.max(Math.abs(cpz.pin), 1e-30);
    add('conduction.pinned-zero-cost',
      !cpz.nan && cpz.n === 28 && cpz.np === 2 && cpz.thermal === 'tint' && cpz.kappaS === 0.3
      && cpzHash === CPZ_BASE && cpz.pin < 0 && cpz.dH > 0 && cpzRel <= 1e-6 && cpz.radE === 0,
      `📏conduction(tint・κs=${cpz.kappaS}・pinned ${cpz.np}/${cpz.n}体)300步 x,y,vx,vy,spin,R,m,T_int ハッシュ=` +
      `${cpzHash.slice(0, 16)}…(基点 3cc348b〔修正前〕の実測=${CPZ_BASE.slice(0, 16)}… bit一致=${cpzHash === CPZ_BASE}) ` +
      `= 自由粒子側の数値経路は 1 ビットも変わっていない(修正は帳簿追加のみ) / ` +
      `帳簿: ΔH_free=${cpz.dH.toFixed(6)} pinHeat=${cpz.pin.toFixed(6)} 相対=${cpzRel.toExponential(2)}(≤1e-6) ` +
      `— 修正前はこの ${Math.abs(cpz.pin).toFixed(2)} がどのリザーバにも載らず消えていた(台帳4-86)`);

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP conduction.pinned-bath/conduction.pinned-zero-cost(対象に 47A 未適用 — root 等)');
  }
}

// ---- 7z5b) 第44便 44B(台帳4-68c 再挑戦条件): 粒子の融合 fusion:{dFrac}(beta 先行)----
// ----       機能判定子: 「thermal:"spin" のプリセットの fusion キーを削除するか」+ エンジンに
// ----       _fuse/fusU があるか。root は fusion 未実装なので 3 件とも SKIP ----
{
  const hasFusion = await page.evaluate(() => {
    if (typeof HP.sim._fuse !== 'function' || !('fusU' in HP.sim) || !('fusion' in HP.sim)) return false;
    const base = { name: 'f', description: 'fusion 機能判定', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, physics: {},
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] };
    const v = HP.validatePreset(Object.assign({}, base, { thermal: 'spin', fusion: { dFrac: 0.4 } }));
    // 未実装ビルドでは未知の最上位キーとしてそのまま残る。実装済みなら tint 以外で削除される
    return !!(v.ok && v.preset.fusion === undefined);
  });
  if (hasFusion) {
    // 共通の計測基盤(ページ側)。第一法則の物差しは V30 の energyOf と同一式
    // (KE並進+KE回転+内部熱 C·m·T_int − 重力 + E9 法線ばね + E5′ U_rep)に、放射 radE と
    // 融合リザーバ fusU(= 融合で消えた重力束縛+第三者との相互作用差分)を足したもの。
    const HARNESS = () => {
      const s = HP.sim;
      window.__fus = {
        mk: (bodies, fusion, phys) => ({
          id: 'qa_fusion', name: 'fusion', description: '融合の保存検査(隠し構成)',
          camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
          thermal: 'tint', fusion,
          physics: Object.assign({ G: 1, D0: 0, kFrame: 0, kRep: 2, q: 2, muF: 0, gammaN: 0,
            kappaS: 0, etaRad: 0, pRad: 1, cHeat: 0.2, softening: 2, radiusScale: 1, timeScale: 1 }, phys || {}),
          bodies, overlays: {}
        }),
        energy: (s) => {
          const G = s.params.G, eps2 = s.params.softening * s.params.softening, C = s.params.cHeat;
          let E = 0;
          for (let i = 0; i < s.n; i++) {
            E += 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]);
            E += 0.25 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];
            E += C * s.m[i] * (s.Tint ? s.Tint[i] : 0);
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
          // 第47便 47A(台帳4-86): pinned 熱浴のリザーバ pinHeat も保持量に加える(案B)。
          // ☀️starcore 系は κs=0 なので pinHeat は厳密に 0 のまま — 式の完全性のための項で、
          // 判定値は変わらない(pinHeat を持たない対象=root では ||0 で従来式に退化する)
          return E + HP.urepEnergy(s) + s.radE + s.fusU + (s.pinHeat || 0);
        },
        // 1サブステップずつ進め、粒子数が減った step(=融合)の帳簿の跳びと、
        // 融合しなかった step の跳び(=積分器そのものの1步誤差)を別々に最大値で採る
        run: (preset, steps) => {
          const F = window.__fus;
          s.build(preset);
          let mass0 = 0; for (let i = 0; i < s.n; i++) mass0 += s.m[i];
          const n0 = s.n;
          let eFus = 0, eStep = 0, pFus = 0, lFus = 0;
          for (let k = 0; k < steps; k++) {
            const nb = s.n, Eb = F.energy(s), Tb = s.totals();
            s.step(0.016);
            const dE = Math.abs(F.energy(s) - Eb), T1 = s.totals();
            if (s.n !== nb) {
              eFus = Math.max(eFus, dE);
              pFus = Math.max(pFus, Math.abs(T1.px - Tb.px), Math.abs(T1.py - Tb.py));
              lFus = Math.max(lFus, Math.abs(T1.L - Tb.L));
            } else eStep = Math.max(eStep, dE);
          }
          let mass1 = 0; for (let i = 0; i < s.n; i++) mass1 += s.m[i];
          const lg = s.fusLog || [];
          const mx = (f) => lg.reduce((a, e) => Math.max(a, f(e)), 0);
          return { n0, n1: s.n, fusN: s.fusN, mass0, mass1, fusU: s.fusU,
            eFus, eStep, pFus, lFus,
            rP: mx(e => e.rP), rL: mx(e => e.rL), rE: mx(e => e.rE),
            // 融合則の Float64 残差は「Float32 状態配列への格納丸め」だけ。回収帳簿
            // fusPx/fusPy/fusL がその全量を持っていることを恒等式で確認する
            carry: Math.max(Math.abs(s.fusPx + lg.reduce((a, e) => a + e.ePx, 0)),
                            Math.abs(s.fusPy + lg.reduce((a, e) => a + e.ePy, 0)),
                            Math.abs(s.fusL + lg.reduce((a, e) => a + e.eL, 0))),
            ev: lg.map(e => ({ t: e.t, dKE: e.dKE, uGrav: e.uGrav, uRep: e.uRep, uSpr: e.uSpr,
              dU3: e.dU3, eSc: e.eSc, dFrac: e.dFrac })),
            T: s.Tint ? Array.from(s.Tint.slice(0, s.n)) : [] };
        }
      };
    };

    // ① fusion.conservation: 隠し構成(2体正面 + 2体オフセンター・thermal:"tint")で融合が起き、
    //    対ごとの P(2成分)・L_z・第一法則の残差が Float32 状態配列の丸め水準に収まる。
    //    さらに系全体の帳簿の跳び(融合した step)が、融合しなかった step の跳び(=積分器の
    //    1步誤差)を超えないことを確認する — 融合が新しい不連続を持ち込んでいないことの機械証明。
    //    スキーマ検証(最上位キー fusion の構造検査)も同時に固定する。
    const cons = await page.evaluate((HS) => {
      eval('(' + HS + ')()');
      const F = window.__fus;
      // 2体正面(y=0・スピン非対称)/ 2体オフセンター(y オフセットで軌道角運動量を持たせる)
      const head = F.run(F.mk([
        { type: 'single', m: 1, x: -12, y: 0, vx: 6, vy: 0, spin: 2, tInt: 20 },
        { type: 'single', m: 2, x: 12, y: 0, vx: -6, vy: 0, spin: -1, tInt: 12 }], { dFrac: 0.35 }), 400);
      const off = F.run(F.mk([
        { type: 'single', m: 1, x: -12, y: -0.3, vx: 6, vy: 0, spin: 2, tInt: 20 },
        { type: 'single', m: 2, x: 12, y: 0.3, vx: -6, vy: 0, spin: -1.5, tInt: 12 }], { dFrac: 0.35 }), 400);
      // スキーマ: 構造検査(不正は警告つきでキー削除)・dFrac の値域クランプ・未知サブキーの除去
      const base = (extra) => Object.assign({ name: 'f', description: 'fusion スキーマ検査',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }, extra);
      const V = (o) => { const v = HP.validatePreset(o); return { ok: v.ok, w: v.warnings.length, f: v.preset.fusion }; };
      const sc = {
        ok: V(base({ thermal: 'tint', fusion: { dFrac: 0.5 } })),
        def: V(base({ thermal: 'tint', fusion: {} })),
        hi: V(base({ thermal: 'tint', fusion: { dFrac: 9 } })),   // 上限は 1/√2(第45便 45B(2))
        lo: V(base({ thermal: 'tint', fusion: { dFrac: 0 } })),
        nan: V(base({ thermal: 'tint', fusion: { dFrac: 'x' } })),
        arr: V(base({ thermal: 'tint', fusion: [] })),
        spin: V(base({ fusion: { dFrac: 0.4 } })),
        extra: V(base({ thermal: 'tint', fusion: { dFrac: 0.4, foo: 1 } })),
        none: V(base({ thermal: 'tint' })),
      };
      // エンジン側の門番: 内蔵プリセット経路(バリデータを通らない)でも spin では無効化される
      const s = HP.sim;
      s.build(Object.assign(F.mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0 }], { dFrac: 0.4 }), { thermal: 'spin' }));
      const engSpin = s.fusion;
      s.build(F.mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 1 }], { dFrac: 0.4 }));
      const engTint = s.fusion ? s.fusion.dFrac : null;
      return { head, off, sc, engSpin, engTint };
    }, HARNESS.toString());

    // 実測(beta 2026-07-29): 対ごとの相対残差は P≤1.6e-8 / L_z≤1.2e-8 / E≤1.2e-8。
    // 融合則そのものは Float64 で厳密(スピンを L_tot から逆算するため位置・速度の丸めも吸収する)で、
    // 残るのは Float32 状態配列(x/v/spin/m/R/T_int)への格納丸め 1 回分だけ。したがって
    // 指示書の 1e-9 はエンジンの格納精度(Float32 eps=1.19e-7)より下で原理的に到達不能 —
    // 判定は格納丸めのすぐ上の 1e-7(P・L)/ 1e-6(E)に置き、実測値を detail に残す。
    const CP = 1e-7, CL = 1e-7, CE = 1e-6;
    const okOne = (r) => r.n0 === 2 && r.n1 === 1 && r.fusN === 1
      && Math.abs(r.mass1 - r.mass0) <= 1e-6 * r.mass0
      && r.rP <= CP && r.rL <= CL && r.rE <= CE
      && r.eFus <= r.eStep && r.carry <= 1e-12
      && r.ev[0].uRep > 0.05 * r.ev[0].eSc;   // U_rep は発火時点で「ほぼ0」ではない(無視できない)
    const fmtR = (r) => `n ${r.n0}→${r.n1}(融合${r.fusN}回) 質量 ${r.mass0.toFixed(6)}→${r.mass1.toFixed(6)} `
      + `相対残差 P=${r.rP.toExponential(2)} L_z=${r.rL.toExponential(2)} E=${r.rE.toExponential(2)} / `
      + `系全体の帳簿の跳び: 融合step=${r.eFus.toExponential(2)} ≤ 非融合stepの最大=${r.eStep.toExponential(2)} / `
      + `内訳 ΔKE=${r.ev[0].dKE.toFixed(2)} U_rep=${r.ev[0].uRep.toFixed(2)} U_spring=${r.ev[0].uSpr.toFixed(2)} `
      + `U_grav=${r.ev[0].uGrav.toFixed(2)}(E_scale=${r.ev[0].eSc.toFixed(2)}・d/ΣR=${r.ev[0].dFrac.toFixed(3)})`;
    const S2 = cons.sc;
    const scOk = S2.ok.f && S2.ok.f.dFrac === 0.5 && S2.ok.w === 0
      && S2.def.f && S2.def.f.dFrac === 0.35
      && S2.hi.f && S2.hi.f.dFrac === Math.SQRT1_2 && S2.hi.w === 1
      && S2.lo.f && S2.lo.f.dFrac === 0.05 && S2.lo.w === 1
      && S2.nan.f === undefined && S2.nan.w === 1
      && S2.arr.f === undefined && S2.arr.w === 1
      && S2.spin.f === undefined && S2.spin.w === 1
      && S2.extra.f && S2.extra.f.dFrac === 0.4 && S2.extra.f.foo === undefined
      && S2.none.f === undefined
      && cons.engSpin === null && cons.engTint === 0.4;
    add('fusion.conservation', okOne(cons.head) && okOne(cons.off) && scOk,
      `正面: ${fmtR(cons.head)} / オフセンター: ${fmtR(cons.off)} / `
      + `スキーマ: 0.5→${S2.ok.f && S2.ok.f.dFrac} 省略→${S2.def.f && S2.def.f.dFrac} 9→${S2.hi.f && S2.hi.f.dFrac}(=1/√2・第45便 45B(2)で 1 から引下げ) `
      + `0→${S2.lo.f && S2.lo.f.dFrac} "x"→${S2.nan.f}(警告${S2.nan.w}) 配列→${S2.arr.f}(警告${S2.arr.w}) `
      + `spin熱→${S2.spin.f}(警告${S2.spin.w}) 未知サブキー除去=${S2.extra.f && S2.extra.f.foo === undefined} / `
      + `エンジン門番: spin→${cons.engSpin} tint→dFrac=${cons.engTint} / `
      + `回収帳簿 fusPx+Σe=${Math.max(cons.head.carry, cons.off.carry).toExponential(1)}(≤1e-12)`);

    // ② fusion.zero-cost: fusion キーの無いプリセットは機構追加前(基点コミット 9ec1300)と
    //    1 ビットも変わらない。tint 系の代表4件を 300 步走らせた x,y,spin,T_int のハッシュを、
    //    9ec1300 の beta/index.html で採取した実測基準と照合する(tint.zero-cost の流儀)。
    //    融合は tint モードにだけ載る機構なので、対象は spin ではなく tint 側から採る。
    const ZCF = {
      gas: ['da983bab338a8e79adcda619c5c47d886eeada5fb7ffc5e00f8094fa24353a63', 240],
      pressure: ['71717c06b87d55652456e1e5c33a847287f610c5083a55018c7da38eac5f5d69', 240],
      convection: null,   // 第50便 50J: 世代別に直下で解決(300粒=基点 9ec1300 / 210粒=50J 再採取)

      coolrace: ['a09a5cb44ae9e035409f377588ae2c967d62ca9ce9cc2f9d4bd4c31a6b6d659b', 3],
    };
    // 第50便 50J: ♨️convection は beta で気体 300→210 粒へ改訂(意図的変更)。零コスト基準は
    // 対象の構成(n)から選ぶ — root=300粒は基点 9ec1300 の実測のまま、beta=210粒は 50J で
    // 再採取した実測(以降この基準に対する bit 一致が「融合機構の零コスト」を保証し続ける)
    const convN0 = await page.evaluate(() => HP.allPresets().find((q) => q.id === 'convection').bodies[0].n);
    ZCF.convection = convN0 === 210
      ? ['d03bf56fce6814531be08249b2697ae487f98e109a4a3da6acd1181fa8550219', 210]
      : ['aae1ee8ffb73b13fc1a9b407277b719ed507e549d2b490dcbb4951e55a283422', 300];
    const zf = [];
    for (const [id, [base, n]] of Object.entries(ZCF)) {
      const r = await page.evaluate((pid) => {
        HP.loadPreset(pid, false);
        const s = HP.sim;
        for (let k = 0; k < 300; k++) s.step(0.016);
        const a = [];
        for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.spin[i], s.Tint ? s.Tint[i] : 0);
        return { n: s.n, fusion: s.fusion, fusN: s.fusN, fusU: s.fusU, str: a.map(v => v.toExponential(12)).join(',') };
      }, id);
      const h = crypto.createHash('sha256').update(r.str).digest('hex');
      zf.push({ id, ok: h === base && r.n === n && r.fusion === null && r.fusN === 0 && r.fusU === 0, h: h.slice(0, 8) });
    }
    const zfBad = zf.filter(z => !z.ok).map(z => `${z.id}(${z.h})`);
    add('fusion.zero-cost', zfBad.length === 0,
      zfBad.length ? `bit不一致/経路混入: ${zfBad.join(' ')}`
        : `${zf.length}件が基点 9ec1300 と bit 一致(300步 x,y,spin,T_int ハッシュ): ${zf.map(z => z.id).join(' ')} `
          + `— 全て sim.fusion=null・融合0回・fusU=0(機構追加の零コスト)`);

    // ③ fusion.chain: 3体が連鎖して最終的に1体になる(1サブステップに同一粒子は1回まで =
    //    連鎖は次サブステップ以降)。各イベントの保存残差と総質量が維持されることも同時に確認する。
    const ch = await page.evaluate((HS) => {
      eval('(' + HS + ')()');
      const F = window.__fus;
      return F.run(F.mk([
        { type: 'single', m: 1, x: -14, y: 0, vx: 7, vy: 0, spin: 1.5, tInt: 20 },
        { type: 'single', m: 1.5, x: 0, y: 0.2, vx: 0, vy: 0, spin: -1, tInt: 10 },
        { type: 'single', m: 1, x: 14, y: -0.2, vx: -7, vy: 0, spin: 0.7, tInt: 15 }], { dFrac: 0.35 }), 800);
    }, HARNESS.toString());
    const chOk = ch.n0 === 3 && ch.n1 === 1 && ch.fusN === 2
      && Math.abs(ch.mass1 - ch.mass0) <= 1e-6 * ch.mass0
      && ch.rP <= CP && ch.rL <= CL && ch.rE <= CE
      && ch.eFus <= ch.eStep && ch.carry <= 1e-12
      && ch.ev.length === 2 && ch.ev[0].t < ch.ev[1].t   // 連鎖は別サブステップで起きている
      && Math.abs(ch.ev[0].dU3) > 0.1;                   // 第三者との相互作用差分が実際に効いている
    add('fusion.chain', chOk,
      `n ${ch.n0}→${ch.n1}(融合${ch.fusN}回 t=${ch.ev.map(e => e.t.toFixed(3)).join(',')} — 別サブステップ=${ch.ev.length === 2 && ch.ev[0].t < ch.ev[1].t}) `
      + `質量 ${ch.mass0.toFixed(6)}→${ch.mass1.toFixed(6)} 相対残差 P=${ch.rP.toExponential(2)} L_z=${ch.rL.toExponential(2)} E=${ch.rE.toExponential(2)} / `
      + `系全体の帳簿の跳び: 融合step=${ch.eFus.toExponential(2)} ≤ 非融合stepの最大=${ch.eStep.toExponential(2)} / `
      + `第三者との相互作用差分 ΔU₃=${ch.ev.map(e => e.dU3.toFixed(2)).join(',')}(リザーバ fusU=${ch.fusU.toFixed(2)}) / `
      + `融合体の T_int=${ch.T.map(v => v.toFixed(1)).join(',')}`);

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP fusion.conservation / fusion.zero-cost / fusion.chain(対象に第44便 44B の融合機構なし — root 等)');
  }
}

// ---- 7z5c) 第45便 45B(台帳4-68d): 粒子の分裂 fusion:{dFrac, fission:{Tcrit,frac}}(beta 先行)----
// ----       機能判定子: エンジンに _fission/_grow/fisLog があるか + validatePreset が
// ----       Tcrit 無しの fission を落とすか。第44便までのビルドでは 3 件とも SKIP ----
{
  const hasFission = await page.evaluate(() => {
    const s = HP.sim;
    if (typeof s._fission !== 'function' || typeof s._grow !== 'function' || !('fisN' in s)) return false;
    const base = { name: 'f', description: 'fission 機能判定', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, physics: {}, thermal: 'tint',
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] };
    const v = HP.validatePreset(Object.assign({}, base, { fusion: { dFrac: 0.4, fission: { frac: 0.5 } } }));
    // Tcrit(正の数値)が無ければ fission だけを落として fusion は生かす
    return !!(v.ok && v.preset.fusion && v.preset.fusion.dFrac === 0.4 && v.preset.fusion.fission === undefined);
  });
  if (hasFission) {
    // 共通の計測基盤(ページ側)。第一法則の物差しは fusion.* と同一式に、外部一様重力場の
    // ポテンシャル U=-m(gX·x+gY·y) と箱の反発係数<1 で壁に吸われた wallKE を足したもの。
    // 融合と分裂の回収帳簿 fusPx/fusPy/fusL は**共有**なので、carry の恒等式は両ログの和で採る。
    const FIS = () => {
      const s = HP.sim;
      window.__fis = {
        mk: (bodies, fusion, phys, world) => ({
          id: 'qa_fission', name: 'fission', description: '分裂の保存検査(隠し構成)',
          camera: { scale: 200 }, world: world || { boundary: 'none', size: 0 },
          thermal: 'tint', fusion,
          physics: Object.assign({ G: 1, D0: 0, kFrame: 0, kRep: 2, q: 2, muF: 0, gammaN: 0,
            kappaS: 0, etaRad: 0, pRad: 1, cHeat: 0.2, softening: 2, radiusScale: 1, timeScale: 1 }, phys || {}),
          bodies, overlays: {}
        }),
        energy: (s) => {
          const G = s.params.G, eps2 = s.params.softening * s.params.softening, C = s.params.cHeat;
          const gX = s.params.gravityX || 0, gY = s.params.gravityY || 0;
          let E = 0;
          for (let i = 0; i < s.n; i++) {
            E += 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]);
            E += 0.25 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];
            E += C * s.m[i] * (s.Tint ? s.Tint[i] : 0);
            E -= s.m[i] * (gX * s.x[i] + gY * s.y[i]);
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
          // 第47便 47A(台帳4-86): pinned 熱浴のリザーバ pinHeat も保持量に加える(案B)
          return E + HP.urepEnergy(s) + s.radE + s.fusU + s.wallKE + (s.pinHeat || 0);
        },
        run: (preset, steps) => {
          const F = window.__fis;
          s.build(preset);
          let mass0 = 0; for (let i = 0; i < s.n; i++) mass0 += s.m[i];
          const n0 = s.n;
          let eEv = 0, eStep = 0, pEv = 0, lEv = 0, nMax = s.n;
          const nSeq = [s.n];
          for (let k = 0; k < steps; k++) {
            const nb = s.n, Eb = F.energy(s), Tb = s.totals();
            s.step(0.016);
            const dE = Math.abs(F.energy(s) - Eb), T1 = s.totals();
            if (s.n !== nb) {
              eEv = Math.max(eEv, dE);
              pEv = Math.max(pEv, Math.abs(T1.px - Tb.px), Math.abs(T1.py - Tb.py));
              lEv = Math.max(lEv, Math.abs(T1.L - Tb.L));
              nSeq.push(s.n);
            } else eStep = Math.max(eStep, dE);
            if (s.n > nMax) nMax = s.n;
          }
          let mass1 = 0; for (let i = 0; i < s.n; i++) mass1 += s.m[i];
          const fu = s.fusLog || [], fi = s.fisLog || [];
          const mx = (a, f) => a.reduce((r, e) => Math.max(r, f(e)), 0);
          // 融合と分裂は**同じサブステップ**で連続して起きうる(_fuse の直後に _fission が走り、
          // 融合体の T_int がその場で Tcrit を超えるため)。サブステップ境界の粒子数 n は変わらない
          // ので、サイクルはイベントログを時刻順に並べた記号列(F=融合 S=分裂)で数える
          const evSeq = fu.map(e => ({ t: e.t, k: 'F' })).concat(fi.map(e => ({ t: e.t, k: 'S' })))
            .sort((a, b) => a.t - b.t || (a.k === 'F' ? -1 : 1)).map(e => e.k).join('');
          return { n0, n1: s.n, nMax, nSeq, evSeq, mass0, mass1, fusN: s.fusN, fisN: s.fisN, fusU: s.fusU,
            eEv, eStep, pEv, lEv,
            rP: Math.max(mx(fu, e => e.rP), mx(fi, e => e.rP)),
            rL: Math.max(mx(fu, e => e.rL), mx(fi, e => e.rL)),
            rE: Math.max(mx(fu, e => e.rE), mx(fi, e => e.rE)),
            carry: Math.max(
              Math.abs(s.fusPx + fu.reduce((a, e) => a + e.ePx, 0) + fi.reduce((a, e) => a + e.ePx, 0)),
              Math.abs(s.fusPy + fu.reduce((a, e) => a + e.ePy, 0) + fi.reduce((a, e) => a + e.ePy, 0)),
              Math.abs(s.fusL + fu.reduce((a, e) => a + e.eL, 0) + fi.reduce((a, e) => a + e.eL, 0))),
            fis: fi.map(e => ({ t: e.t, m: e.m, m1: e.m1, m2: e.m2, R: e.R, R1: e.R1, R2: e.R2,
              d: e.d, dFrac: e.dFrac, w: e.w, T0: e.T0, T1: e.T1, dKE: e.dKE, dEsplit: e.dEsplit,
              uGrav: e.uGrav, uRep: e.uRep, uSpr: e.uSpr, heat: e.heat, eSc: e.eSc })),
            fus: fu.map(e => ({ t: e.t, dKE: e.dKE, Tn: e.Tn })),
            T: s.Tint ? Array.from(s.Tint.slice(0, s.n)) : [] };
        }
      };
    };

    // 判定閾値は融合と同水準(Float32 状態配列の格納精度 eps=1.19e-7 が床)
    const CP = 1e-7, CL = 1e-7, CE = 1e-6;

    // ① fission.conservation: 高温1粒子が Tcrit を超えて2片に割れる(等分 frac=0.5 と
    //    非等分 frac=0.3)。P(2成分)・L_z・第一法則の残差が格納丸め水準に収まり、
    //    断面積分割 R₁²+R₂²=R² と質量保存が成り立つ。スキーマ検証も同時に固定する。
    const fc = await page.evaluate((HS) => {
      eval('(' + HS + ')()');
      const F = window.__fis;
      const half = F.run(F.mk([
        { type: 'single', m: 2, x: 0, y: 0, vx: 0.5, vy: -0.3, spin: 1.2, tInt: 100 }],
        { dFrac: 0.35, fission: { Tcrit: 50, frac: 0.5 } }), 1);
      const uneq = F.run(F.mk([
        { type: 'single', m: 2, x: 0, y: 0, vx: 0.5, vy: -0.3, spin: 1.2, tInt: 100 }],
        { dFrac: 0.35, fission: { Tcrit: 50, frac: 0.3 } }), 1);
      // T が足りなければ発火しない(吸熱の暴走防止)— 同じ構成で T を下げるだけ
      const poor = F.run(F.mk([
        { type: 'single', m: 2, x: 0, y: 0, vx: 0.5, vy: -0.3, spin: 1.2, tInt: 12 }],
        { dFrac: 0.35, fission: { Tcrit: 10, frac: 0.5 } }), 1);
      // スキーマ: fission の構造検査・Tcrit 必須・frac の値域クランプ・未知サブキーの除去
      const base = (extra) => Object.assign({ name: 'f', description: 'fission スキーマ検査',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {}, thermal: 'tint',
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] }, extra);
      const V = (o) => { const v = HP.validatePreset(o); return { ok: v.ok, w: v.warnings.length,
        f: v.preset.fusion && v.preset.fusion.fission, d: v.preset.fusion && v.preset.fusion.dFrac }; };
      const sc = {
        ok: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: 30, frac: 0.4 } } })),
        def: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: 30 } } })),
        hiF: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: 30, frac: 0.9 } } })),
        loF: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: 30, frac: 0.01 } } })),
        noT: V(base({ fusion: { dFrac: 0.4, fission: { frac: 0.5 } } })),
        negT: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: -1 } } })),
        arr: V(base({ fusion: { dFrac: 0.4, fission: [] } })),
        nanF: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: 30, frac: 'x' } } })),
        extra: V(base({ fusion: { dFrac: 0.4, fission: { Tcrit: 30, foo: 1 } } })),
        none: V(base({ fusion: { dFrac: 0.4 } })),
        // 第45便 45B(2): dFrac の受理上限は ΔKE≥0 が保証される 1/√2
        cap: V(base({ fusion: { dFrac: 0.95, fission: { Tcrit: 30 } } }))
      };
      // エンジン門番(内蔵プリセット経路 — バリデータを通らない)
      const s = HP.sim;
      s.build(F.mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 1 }],
        { dFrac: 0.4, fission: { Tcrit: 0 } }));
      const engBad = s.fusion.fission;
      s.build(F.mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 1 }],
        { dFrac: 0.4, fission: { Tcrit: 7, frac: 9 } }));
      const engOk = s.fusion.fission ? [s.fusion.fission.Tcrit, s.fusion.fission.frac] : null;
      s.build(F.mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 1 }],
        { dFrac: 0.95, fission: { Tcrit: 7 } }));
      const engCap = s.fusion.dFrac;   // 第45便 45B(2): エンジン門番も上限 1/√2 でクランプする
      return { half, uneq, poor, sc, engBad, engOk, engCap };
    }, FIS.toString());

    const okSplit = (r, fr) => {
      const e = r.fis[0];
      return r.n0 === 1 && r.n1 === 2 && r.fisN === 1 && r.fusN === 0 && e
        && Math.abs(r.mass1 - r.mass0) <= 1e-6 * r.mass0
        && r.rP <= CP && r.rL <= CL && r.rE <= CE && r.carry <= 1e-12
        && Math.abs(e.m1 / e.m - fr) <= 1e-6                       // 質量比 m₁=frac·m
        && Math.abs(e.R1 * e.R1 + e.R2 * e.R2 - e.R * e.R) <= 1e-5 * e.R * e.R   // 断面積分割
        && e.dFrac > 0.35 && e.w > 0                               // 発火域の外 + 離反初速>0
        && e.dEsplit > 0 && e.T1 < e.T0 && e.heat > 0;             // ΔE_split>0 を T_int が払った
    };
    const fmtF = (r) => { const e = r.fis[0]; return `n ${r.n0}→${r.n1} 質量 ${r.mass0.toFixed(6)}→${r.mass1.toFixed(6)} `
      + `m=${e.m.toFixed(3)}→${e.m1.toFixed(3)}+${e.m2.toFixed(3)} R=${e.R.toFixed(4)}→√(${e.R1.toFixed(4)}²+${e.R2.toFixed(4)}²)=${Math.sqrt(e.R1 * e.R1 + e.R2 * e.R2).toFixed(4)} `
      + `d/ΣR=${e.dFrac.toFixed(4)}(>dFrac=0.35) w=${e.w.toFixed(3)} / `
      + `ΔE_split=${e.dEsplit.toFixed(3)}(=−ΔKE ${(-e.dKE).toFixed(3)} + U_spring ${e.uSpr.toFixed(3)} + U_rep ${e.uRep.toFixed(3)}) `
      + `を T_int が支払い ${e.T0.toFixed(2)}→${e.T1.toFixed(2)} / `
      + `相対残差 P=${r.rP.toExponential(2)} L_z=${r.rL.toExponential(2)} E=${r.rE.toExponential(2)}`; };
    const S3 = fc.sc;
    const scOk3 = S3.ok.f && S3.ok.f.Tcrit === 30 && S3.ok.f.frac === 0.4 && S3.ok.w === 0
      && S3.def.f && S3.def.f.frac === 0.5
      && S3.hiF.f && S3.hiF.f.frac === 0.5 && S3.hiF.w === 1
      && S3.loF.f && S3.loF.f.frac === 0.1 && S3.loF.w === 1
      && S3.noT.f === undefined && S3.noT.w === 1 && S3.noT.d === 0.4     // fission だけ落ちて fusion は生きる
      && S3.negT.f === undefined && S3.negT.w === 1
      && S3.arr.f === undefined && S3.arr.w === 1
      && S3.nanF.f === undefined && S3.nanF.w === 1
      && S3.extra.f && S3.extra.f.foo === undefined
      && S3.none.f === undefined
      && Math.abs(S3.cap.d - Math.SQRT1_2) < 1e-12 && S3.cap.w === 1
      && fc.engBad === null && fc.engOk && fc.engOk[0] === 7 && fc.engOk[1] === 0.5
      && Math.abs(fc.engCap - Math.SQRT1_2) < 1e-12;
    add('fission.conservation', okSplit(fc.half, 0.5) && okSplit(fc.uneq, 0.3)
      && fc.poor.fisN === 0 && fc.poor.n1 === 1 && scOk3,
      `等分(frac=0.5): ${fmtF(fc.half)} / 非等分(frac=0.3): ${fmtF(fc.uneq)} / `
      + `熱不足(T=12 で Tcrit=10 超だが ΔE_split を払えない)→ 発火せず n=${fc.poor.n1}・分裂${fc.poor.fisN}回 / `
      + `回収帳簿 carry=${Math.max(fc.half.carry, fc.uneq.carry).toExponential(1)}(≤1e-12) / `
      + `スキーマ: frac 0.9→${S3.hiF.f && S3.hiF.f.frac} 0.01→${S3.loF.f && S3.loF.f.frac} 省略→${S3.def.f && S3.def.f.frac} `
      + `Tcrit無し→${S3.noT.f}(fusion は残る dFrac=${S3.noT.d}) Tcrit≤0→${S3.negT.f} 配列→${S3.arr.f} frac="x"→${S3.nanF.f} `
      + `未知サブキー除去=${!!(S3.extra.f && S3.extra.f.foo === undefined)} dFrac 0.95→${S3.cap.d}(=1/√2) / `
      + `エンジン門番: Tcrit=0→${fc.engBad} Tcrit=7,frac=9→[${fc.engOk}] dFrac 0.95→${fc.engCap.toFixed(7)}`);

    // ② fission.zero-cost: fission サブキーの無い fusion 構成は、機構追加前(基点コミット
    //    5b00341 = 第44便 44B)と 1 ビットも変わらない。x,y,vx,vy,spin,R,m,T_int と
    //    リザーバ/回収帳簿(fusU,fusPx,fusPy,fusL)の全量をハッシュして実測基準と照合する。
    const ZCF2 = {
      // id: [基準ハッシュ, 步数, 終端n, 融合回数, 初期n(=確保長。分裂が無ければ拡張されない)]
      head:  ['46688b075a9cf4f618f27b3f7c993772054c7671195d50897fafea9d60186bfc', 400, 1, 1, 2],
      off:   ['0e58f5e6212dd2c8c68e24506b2f8b70c779d5b13b383bf6c643f09f95d9d58b', 400, 1, 1, 2],
      chain: ['c1c8a8ab9110697c1820331ff5bcdab36ff476ca6615303bb021ba261f762bd0', 800, 1, 2, 3],
      boxg:  ['725938a35286a6ad526e5d65e52ab9d05ad3d47727b8c0fdd270bc3f33aeac1b', 20000, 1, 1, 2],
    };
    const zc2 = [];
    for (const [id, [base, steps, n, fusN, cap0]] of Object.entries(ZCF2)) {
      const r = await page.evaluate(([HS, cid, st]) => {
        eval('(' + HS + ')()');
        const F = window.__fis, s = HP.sim;
        const CFG = {
          head: F.mk([{ type: 'single', m: 1, x: -12, y: 0, vx: 6, vy: 0, spin: 2, tInt: 20 },
                      { type: 'single', m: 2, x: 12, y: 0, vx: -6, vy: 0, spin: -1, tInt: 12 }], { dFrac: 0.35 }),
          off: F.mk([{ type: 'single', m: 1, x: -12, y: -0.3, vx: 6, vy: 0, spin: 2, tInt: 20 },
                     { type: 'single', m: 2, x: 12, y: 0.3, vx: -6, vy: 0, spin: -1.5, tInt: 12 }], { dFrac: 0.35 }),
          chain: F.mk([{ type: 'single', m: 1, x: -14, y: 0, vx: 7, vy: 0, spin: 1.5, tInt: 20 },
                       { type: 'single', m: 1.5, x: 0, y: 0.2, vx: 0, vy: 0, spin: -1, tInt: 10 },
                       { type: 'single', m: 1, x: 14, y: -0.2, vx: -7, vy: 0, spin: 0.7, tInt: 15 }], { dFrac: 0.35 }),
          boxg: F.mk([{ type: 'single', m: 1.5, x: -5, y: -10, vx: 0, vy: 0, spin: 0.3, tInt: 1 },
                      { type: 'single', m: 1.5, x: 5, y: -11, vx: 0, vy: 0, spin: -0.3, tInt: 1 }],
                     { dFrac: 0.35 }, { G: 8, kRep: 1, cHeat: 0.2, gammaN: 0, softening: 1, gravityY: 1 },
                     { boundary: 'box', size: 14 })
        };
        s.build(CFG[cid]);
        for (let k = 0; k < st; k++) s.step(0.016);
        const a = [];
        for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.vx[i], s.vy[i], s.spin[i], s.R[i], s.m[i], s.Tint[i]);
        a.push(s.fusU, s.fusPx, s.fusPy, s.fusL);
        return { n: s.n, fusN: s.fusN, fisN: s.fisN, fis: s.fusion.fission, cap: s.m.length,
          str: a.map(v => v.toExponential(12)).join(',') };
      }, [FIS.toString(), id, steps]);
      const h = crypto.createHash('sha256').update(r.str).digest('hex');
      zc2.push({ id, steps, ok: h === base && r.n === n && r.fusN === fusN && r.fisN === 0
        && r.fis === null && r.cap === cap0, h: h.slice(0, 8), n: r.n, fusN: r.fusN, cap: r.cap });
    }
    const zcBad = zc2.filter(z => !z.ok).map(z => `${z.id}(${z.h} n=${z.n} fusN=${z.fusN})`);
    add('fission.zero-cost', zcBad.length === 0,
      zcBad.length ? `bit不一致/経路混入: ${zcBad.join(' ')}`
        : `${zc2.length}件が基点 5b00341(第44便 44B)と bit 一致(x,y,v,spin,R,m,T_int + fusU/fusPx/fusPy/fusL のハッシュ): `
          + `${zc2.map(z => `${z.id}:${z.steps}步 ${z.h}`).join(' / ')} — 全て fusion.fission=null・分裂0回・確保長の拡張なし`);

    // ③ fission.cycle: 融合→(重力落下による)加熱→分裂→冷却→再融合が保存を保って 1 サイクル回る。
    //    一様重力場の箱に2粒子を落とし、床で衝突して融合 → T_int が Tcrit を超えて分裂 →
    //    破片は冷えて(T が ΔE_split を払った分だけ下がる)再び落ちて融合する。
    //    粒子数の履歴 nSeq が 2→1→2→1 と往復することが「サイクルが回った」の機械判定。
    const cy = await page.evaluate((HS) => {
      eval('(' + HS + ')()');
      const F = window.__fis;
      return F.run(F.mk([
        { type: 'single', m: 1.5, x: -5, y: -10, vx: 0, vy: 0, spin: 0.3, tInt: 1 },
        { type: 'single', m: 1.5, x: 5, y: -11, vx: 0, vy: 0, spin: -0.3, tInt: 1 }],
        { dFrac: 0.35, fission: { Tcrit: 25, frac: 0.5 } },
        { G: 8, kRep: 1, cHeat: 0.2, gammaN: 0, softening: 1, gravityY: 1 },
        { boundary: 'box', size: 14 }), 20000);
    }, FIS.toString());
    const cyc = (cy.evSeq.match(/FS/g) || []).length;   // 「融合してから分裂した」回数 = サイクル数
    const cyOk = cy.fusN >= 2 && cy.fisN >= 2 && cy.nMax === 2 && cyc >= 2 && /^(FS)+$/.test(cy.evSeq)
      && Math.abs(cy.mass1 - cy.mass0) <= 1e-6 * cy.mass0
      && cy.rP <= CP && cy.rL <= CL && cy.rE <= CE && cy.carry <= 1e-12
      && cy.eEv <= cy.eStep                       // 融合/分裂 step の帳簿の跳び ≤ 積分器の1步誤差
      && cy.fis.every(e => e.T1 < e.T0 && e.dEsplit > 0)
      && cy.fus.every(e => e.dKE > 0);            // 融合は発熱(dFrac=0.35 ≤ 1/√2)
    add('fission.cycle', cyOk,
      `一様重力場の箱(gravityY=1・size=14・G=8)で 20000 步: 融合${cy.fusN}回 / 分裂${cy.fisN}回 / `
      + `イベント記号列(F=融合 S=分裂・時刻順)=${cy.evSeq}(厳密交互・"FS" が ${cyc} 回 = ${cyc} サイクル) 最大n=${cy.nMax} / `
      + `※ 融合体はその場で Tcrit を超えるので融合と分裂は同一サブステップで連続する(サブステップ境界の n は 2 のまま) / `
      + `融合の ΔKE=${cy.fus.map(e => e.dKE.toFixed(2)).join(',')}(>0=発熱) → T′=${cy.fus.map(e => e.Tn.toFixed(1)).join(',')} / `
      + `分裂の ΔE_split=${cy.fis.map(e => e.dEsplit.toFixed(2)).join(',')} を T_int が支払い `
      + `${cy.fis.map(e => `${e.T0.toFixed(1)}→${e.T1.toFixed(1)}`).join(' , ')}(冷却) / `
      + `質量 ${cy.mass0.toFixed(6)}→${cy.mass1.toFixed(6)} 相対残差 P=${cy.rP.toExponential(2)} L_z=${cy.rL.toExponential(2)} E=${cy.rE.toExponential(2)} / `
      + `系全体の帳簿の跳び: イベントstep=${cy.eEv.toExponential(2)} ≤ 非イベントstepの最大=${cy.eStep.toExponential(2)} / `
      + `リザーバ fusU=${cy.fusU.toFixed(3)}`);

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP fission.conservation / fission.zero-cost / fission.cycle(対象に第45便 45B の分裂機構なし — root 等)');
  }
}

// ---- 7z6) 第37便 Wave C1(台帳4-70): 伝熱作用する箱 world.thermalWalls ----
// ----      (beta 先行 — ルート対象時はスキップ)----
{
  const hasTW = await page.evaluate(() => typeof HP.normThermalWalls === 'function');
  if (hasTW) {
    // ① thermalwalls.schema: 有効条件(boundary:"box" かつ thermal:"tint")・mode の enum クランプ・
    //    T/rate の値域クランプ・省略面=断熱。条件外は警告つきで丸ごと無視(挙動を静かに変えない)
    const sc = await page.evaluate(() => {
      const mk = (world, extra) => Object.assign({ name: 'tw', description: '伝熱する箱のスキーマ検査',
        camera: { scale: 200 }, world, physics: {},
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 5, pinned: false }] }, extra || {});
      const V = (o) => { const v = HP.validatePreset(o); return { ok: v.ok, w: v.warnings.length, tw: v.preset && v.preset.world ? v.preset.world.thermalWalls : undefined }; };
      const box = (tw) => ({ boundary: 'box', size: 100, thermalWalls: tw });
      const good = V(mk(box({ bottom: { mode: 'heat', T: 50, rate: 2 }, top: { mode: 'rad', rate: 1 } }), { thermal: 'tint' }));
      const notBox = V(mk({ boundary: 'none', size: 0, thermalWalls: { bottom: { mode: 'heat', T: 50 } } }, { thermal: 'tint' }));
      const notTint = V(mk(box({ bottom: { mode: 'heat', T: 50 } })));
      const badMode = V(mk(box({ bottom: { mode: 'burn', T: 50 }, top: { mode: 'rad' } }), { thermal: 'tint' }));
      const clamped = V(mk(box({ bottom: { mode: 'heat', T: 99999, rate: 500 } }), { thermal: 'tint' }));
      const adia = V(mk(box({ left: { mode: 'adiabatic' } }), { thermal: 'tint' }));
      const badT = V(mk(box({ bottom: { mode: 'heat', T: 'x' } }), { thermal: 'tint' }));
      // エンジン側: 有効条件を満たすときだけ内部表現 twall が立つ
      const s = HP.sim;
      s.build(mk(box({ bottom: { mode: 'heat', T: 50, rate: 2 } }), { thermal: 'tint' }));
      const engOn = !!s.twall && !!s.twall[0] && s.twall[0].T === 50;
      s.build(mk(box({ bottom: { mode: 'heat', T: 50, rate: 2 } }), {}));   // thermal 省略 = spin
      const engOff = !s.twall;
      return { good: good.tw, goodW: good.w, notBox: notBox.tw, notBoxW: notBox.w,
        notTint: notTint.tw, notTintW: notTint.w, badMode: badMode.tw, badModeW: badMode.w,
        clamped: clamped.tw, clampedW: clamped.w, adia: adia.tw, badTok: badT.ok, engOn, engOff };
    });
    add('thermalwalls.schema',
      sc.good && sc.good.bottom.mode === 'heat' && sc.good.bottom.T === 50 && sc.good.top.mode === 'rad' && sc.goodW === 0
      && sc.notBox === undefined && sc.notBoxW === 1 && sc.notTint === undefined && sc.notTintW === 1
      && sc.badMode && sc.badMode.bottom === undefined && sc.badMode.top && sc.badModeW === 1
      && sc.clamped && sc.clamped.bottom.T === 10000 && sc.clamped.bottom.rate === 100 && sc.clampedW === 2
      && sc.adia === undefined && sc.badTok === false && sc.engOn && sc.engOff,
      `正常受理(警告${sc.goodW}件=0) / boundary≠box→無視(警告${sc.notBoxW}件) / thermal≠tint→無視(警告${sc.notTintW}件) / ` +
      `mode:"burn"→adiabatic(警告${sc.badModeW}件・面が落ちる=${sc.badMode.bottom === undefined}) / ` +
      `T:99999→${sc.clamped.bottom.T} rate:500→${sc.clamped.bottom.rate}(警告${sc.clampedW}件) / ` +
      `mode:"adiabatic"のみ→状態なし=${sc.adia === undefined} / T:"x"→検証NG=${!sc.badTok} / ` +
      `エンジン twall: tint+box で有効=${sc.engOn} spin で無効=${sc.engOff}`);

    // ② thermalwalls.ledger: 帳簿の閉性。伝熱する箱に閉じ込めた気体を床で加熱・天井で放熱し、
    //    ΔE_系 = 壁注入 − 壁回収 − 壁が吸った運動E − 放射 が成り立つこと(相対誤差 < 1e-3)。
    //    ③ 断熱壁(全面省略)では壁の熱帳簿が厳密に 0 のまま = 熱交換が一切起きないことも同時に確認する
    const led = await page.evaluate(() => {
      const build = (tw) => {
        const s = HP.sim;
        s.build({
          id: 'qa_tw', name: 'tw', camera: { scale: 200 },
          world: Object.assign({ boundary: 'box', size: 26 }, tw ? { thermalWalls: tw } : {}),
          thermal: 'tint',
          physics: { G: 0.5, D0: 0, kFrame: 0, kRep: 1.5, q: 2, muF: 0.3, gammaN: 0.4, kappaS: 0.5,
            etaRad: 1e-3, pRad: 1, cHeat: 0.4, softening: 2, radiusScale: 1, timeScale: 1 },
          bodies: [{ type: 'disk', n: 26, cx: 0, cy: 0, radius: 20, mMin: 1, mMax: 1.5, tInt: 4,
            spinMin: 0, spinMax: 0, vMode: 'random', aroundMass: 0, vScale: 0.5, direction: 1 }],
          overlays: {}
        });
        return s;
      };
      const energy = (s) => {   // 系のエネルギー(並進+マクロ回転+内部熱+重力U+ばねU+U_rep)
        const C = s.params.cHeat, eps2 = s.params.softening ** 2, G = s.params.G;
        let E = 0;
        for (let i = 0; i < s.n; i++) {
          E += 0.5 * s.m[i] * (s.vx[i] ** 2 + s.vy[i] ** 2) + 0.25 * s.m[i] * s.R[i] ** 2 * s.spin[i] ** 2;
          E += C * s.m[i] * s.Tint[i];
        }
        for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
          const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j], d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
          E -= G * s.m[i] * s.m[j] / Math.sqrt(d2 + eps2);
          const sumR = s.R[i] + s.R[j];
          if (d < sumR) {
            const muM = s.m[i] * s.m[j] / (s.m[i] + s.m[j]), maxInv = Math.max(1 / s.m[i], 1 / s.m[j]);
            const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
            E += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC);
          }
        }
        return E + HP.urepEnergy(s);
      };
      // (A) 床=加熱面・天井=放熱面
      let s = build({ bottom: { mode: 'heat', T: 60, rate: 2 }, top: { mode: 'rad', rate: 2 } });
      let scale = 0;
      const smp = () => { const v = Math.abs(energy(s)); if (v > scale) scale = v; };
      const E0 = energy(s), r0 = s.radE;
      for (let k = 0; k < 6000; k++) { s.step(0.016); if ((k & 255) === 0) smp(); }
      const E1 = energy(s);
      // 第47便 47A(台帳4-86): pinned 熱浴へ出た熱 pinHeat も収支に入れる(案B)。この構成に
      // pinned は無いので厳密に 0 のままで、判定値は不変(式の完全性のための項)
      const bal = (E1 - E0) - (s.wallEin - s.wallEout - s.wallKE - (s.radE - r0) - (s.pinHeat || 0));
      const active = { in: s.wallEin, out: s.wallEout, ke: s.wallKE, rad: s.radE,
        err: Math.abs(bal) / Math.max(scale, s.wallEin, 1e-9), nan: s.hasNaN() };
      // (B) 断熱(thermalWalls 無し)— 壁の熱帳簿は厳密に 0 のまま
      s = build(null);
      for (let k = 0; k < 6000; k++) s.step(0.016);
      const adia = { tw: !!s.twall, in: s.wallEin, out: s.wallEout, ke: s.wallKE };
      return { active, adia };
    });
    add('thermalwalls.ledger',
      !led.active.nan && led.active.err < 1e-3 && led.active.in > 0 && led.active.out > 0
      && !led.adia.tw && led.adia.in === 0 && led.adia.out === 0 && led.adia.ke > 0,
      `帳簿の閉性 |ΔE_系 −(壁注入−壁回収−壁吸収KE−放射)|/E_scale=${led.active.err.toExponential(2)} (<1e-3) ` +
      `壁注入=${led.active.in.toFixed(2)} 壁回収=${led.active.out.toFixed(2)} 壁吸収KE=${led.active.ke.toFixed(2)} ` +
      `放射=${led.active.rad.toFixed(2)} / 断熱壁(thermalWalls 省略): twall=${led.adia.tw} ` +
      `壁注入=${led.adia.in} 壁回収=${led.adia.out}(熱交換ゼロ)・反射の運動E吸収のみ=${led.adia.ke.toFixed(2)}`);

    await page.evaluate(() => HP.loadPreset('saturn', false));
  } else {
    console.log('SKIP thermalwalls.schema/thermalwalls.ledger(対象に Wave C 未適用 — root 等)');
  }
}

// ---- 7z5b) E14″ 創発相変化 phaseChange(beta 先行 — ルート対象時はスキップ)----
// 第60便で創発一本化: 相を物理入力にしない。結合予算 bondN(必須)を核に、引力・角度・減衰・
// 熱伝導のすべてを「いまの結合状態(滑らかな配位数)」から導出する。エンタルピー正本・潜熱・
// 相率・valence リンク台帳は廃止(旧テスト群は git 履歴 — 第59便 c833013 以前を参照)。
// 機能判定子: HP.phaseEnergy + S.angNbr(第60便ビルドの指紋)
{
  const hasPC = await page.evaluate(() => typeof HP.phaseEnergy === 'function' && 'angNbr' in HP.sim);
  if (hasPC) {
    // ① phasechange.schema: バリデータ(tint 必須・fusion 排他・bondN 必須・値域クランプ・
    //    廃止キーの移行警告)とエンジン門番(build 側の最終防衛 — 内蔵プリセットはバリデータを
    //    通らない)。旧機構の配列(hInt/fLiq/chainP)が確保されないことも指紋として固定
    const sc = await page.evaluate(() => {
      const mk = (pc, extra) => Object.assign({ name: 'pc', description: 'x',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {}, thermal: 'tint',
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 0.5, pinned: false }] },
        extra || {}, pc !== undefined ? { phaseChange: pc } : {});
      const V = (o) => { const v = HP.validatePreset(o); return { ok: v.ok, p: v.preset, w: v.warnings.length }; };
      const good = V(mk({ bondN: 3, bondK: 5, angK: 2, condN: 2, condS: 1, condG: 0.15 }));
      const notTint = V(mk({ bondN: 3 }, { thermal: 'spin' }));
      const withFus = V(mk({ bondN: 3 }, { fusion: { dFrac: 0.35 } }));
      const noBondN = V(mk({ bondK: 5 }));
      const clamp1 = V(mk({ bondN: 99, bondK: 9999, bondRange: 99, angK: 99, condN: 99 }));
      const badSub = V(mk({ bondN: 3, bondK: 'x' }));
      const legacy = V(mk({ bondN: 3, meltT: 1, latentF: 4, cohesion: 2, valence: 3, visc: 0.1, condL: 0.5 }));
      const notObj = V(mk('hot'));
      const s = HP.sim;
      const base = { id: 'qa_pc_eng', name: 'x', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        thermal: 'tint', phaseChange: { bondN: 6, bondK: 3, bondRange: 1.6 },
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0, cHeat: 2, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'grid', rMul: 2.5, n: 25, cols: 5, cx: 0, cy: 0, pitch: 5, mMin: 1, mMax: 1, tInt: 0.2 }], overlays: {} };
      s.build(base);
      const engOn = { phase: !!s.phase, coordN: s.coordN instanceof Float32Array,
        shPrev: s.shPrev instanceof Float32Array,
        noLegacy: s.hInt === undefined && s.fLiq === undefined && s.chainP === undefined,
        cMid: s.coordN ? s.coordN[12] : -1 };   // 5×5 六方格子の中央粒子 — 6近傍
      let n0 = 0; for (let i = 0; i < s.n; i++) if (s.coordN[i] > 0) n0++;
      const shOk = s.shPrev[12] > 0 && s.shPrev[12] <= 2.0001;
      for (let k = 0; k < 100; k++) s.step(0.016);
      const nanOk = !s.hasNaN();
      s.build(Object.assign({}, base, { thermal: 'spin' }));
      const engSpin = { phase: !!s.phase };
      s.build(Object.assign({}, base, { fusion: { dFrac: 0.35 } }));
      const engFus = { phase: !!s.phase, fus: !!s.fusion };
      s.build(Object.assign({}, base, { phaseChange: { bondK: 3 } }));   // bondN 欠落 → 門番で null
      const engNoBN = { phase: !!s.phase, coordN: s.coordN };
      return { goodPC: good.p.phaseChange, goodW: good.w,
        notTintPC: notTint.p.phaseChange, notTintW: notTint.w,
        withFusPC: withFus.p.phaseChange, noBondNPC: noBondN.p.phaseChange,
        clamp1PC: clamp1.p.phaseChange, clamp1W: clamp1.w,
        badSubPC: badSub.p.phaseChange, badSubW: badSub.w,
        legacyPC: legacy.p.phaseChange, legacyW: legacy.w,
        notObjPC: notObj.p.phaseChange,
        engOn, n0, shOk, nanOk, engSpin, engFus, engNoBN };
    });
    add('phasechange.schema',
      sc.goodPC && sc.goodPC.bondN === 3 && sc.goodPC.bondK === 5 && sc.goodPC.angK === 2
      && sc.goodPC.condN === 2 && sc.goodW === 0
      && sc.notTintPC === undefined && sc.notTintW >= 1
      && sc.withFusPC === undefined && sc.noBondNPC === undefined
      && sc.clamp1PC && sc.clamp1PC.bondN === 12 && sc.clamp1PC.bondK === 100
      && sc.clamp1PC.bondRange === 3 && sc.clamp1PC.angK === 10 && sc.clamp1PC.condN === 12
      && sc.badSubPC && sc.badSubPC.bondK === 0 && sc.badSubW === 1
      && sc.legacyPC && sc.legacyPC.bondN === 3 && sc.legacyPC.meltT === undefined
      && sc.legacyPC.cohesion === undefined && sc.legacyPC.valence === undefined && sc.legacyW === 6
      && sc.notObjPC === undefined
      && sc.engOn.phase && sc.engOn.coordN && sc.engOn.shPrev && sc.engOn.noLegacy
      && sc.engOn.cMid > 3 && sc.n0 === 25 && sc.shOk && sc.nanOk
      && !sc.engSpin.phase && !sc.engFus.phase && sc.engFus.fus
      && !sc.engNoBN.phase && sc.engNoBN.coordN === null,
      `受理={bondN:3,bondK:5,angK:2,condN:2}(警告0) / spin→無効 fusion→無効 bondN欠落→無効 / ` +
      `クランプ: bondN99→${sc.clamp1PC && sc.clamp1PC.bondN} bondK9999→${sc.clamp1PC && sc.clamp1PC.bondK} angK99→${sc.clamp1PC && sc.clamp1PC.angK} condN99→${sc.clamp1PC && sc.clamp1PC.condN} / ` +
      `bondK"x"→既定0(警告${sc.badSubW}) / 廃止キー6件(meltT/latentF/cohesion/valence/visc/condL)→警告${sc.legacyW}で無視 / ` +
      `エンジン: coordN/shPrev確保・旧配列なし=${sc.engOn.noLegacy}・格子中央c=${(+sc.engOn.cMid).toFixed(2)}(>3)・初期配位>0=${sc.n0}/25・share≤上限=${sc.shOk}・100步NaNなし=${sc.nanOk}`);

    // ② phasechange.zero-cost: phaseChange キーの無い tint プリセット3件は機構追加前
    //    (基点コミット 0cd7eb7 = v1.34.0)と 1 ビットも変わらない(300步 x,y,spin,Tint ハッシュ。
    //    第60便: 🧊phase は廃止のため対象から除外 — 残る3件のハッシュは 53A 以来不変)
    const ZPC = {
      convection: ['d03bf56fce6814531be08249b2697ae487f98e109a4a3da6acd1181fa8550219', 210],
      buoyancy: ['8846253d75f40189e0708238588e2a500df10f2d18e1ed892b8a9c4aa679feed', 280],
      gas: ['da983bab338a8e79adcda619c5c47d886eeada5fb7ffc5e00f8094fa24353a63', 240],
    };
    const zpc = [];
    for (const [id, [base, n]] of Object.entries(ZPC)) {
      const r = await page.evaluate((pid) => {
        HP.loadPreset(pid, false);
        const s = HP.sim;
        for (let k = 0; k < 300; k++) s.step(0.016);
        const a = [];
        for (let i = 0; i < s.n; i++) a.push(s.x[i], s.y[i], s.spin[i], s.Tint ? s.Tint[i] : 0);
        return { n: s.n, phase: !!s.phase, str: a.map(v => v.toExponential(12)).join(',') };
      }, id);
      const h = crypto.createHash('sha256').update(r.str).digest('hex');
      zpc.push({ id, ok: h === base && r.n === n && !r.phase, h: h.slice(0, 8) });
    }
    const zpcBad = zpc.filter(z => !z.ok).map(z => `${z.id}(${z.h})`);
    add('phasechange.zero-cost', zpcBad.length === 0,
      zpcBad.length ? `bit不一致/経路混入: ${zpcBad.join(' ')}`
        : `${zpc.length}件が bit 一致(300步 x,y,spin,Tint ハッシュ): ${zpc.map(z => z.id).join(' ')} — 全て phase=null`);

    // ③ phasechange.schema-angK(第58便 58A → 第59便 59A → 第60便): 結合角ポテンシャル —
    //    バリデータ(値域 [0,10]・クランプ・不正値無視)とエンジン(angNbr 確保・U_ang が監査
    //    phaseEnergy に入る〔angK on/off で U が変わる〕・300步 NaN なし)
    const sa = await page.evaluate(() => {
      const mk = (pc) => ({ name: 'pc', description: 'x',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {}, thermal: 'tint',
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 0.5, pinned: false }],
        phaseChange: pc });
      const V = (o) => { const v = HP.validatePreset(o); return { p: v.preset.phaseChange, w: v.warnings.length }; };
      const good = V(mk({ bondN: 3, bondK: 3, angK: 2 }));
      const big = V(mk({ bondN: 3, bondK: 3, angK: 99 }));   // → 10(クランプ+警告)
      const bad = V(mk({ bondN: 3, bondK: 3, angK: 'x' }));  // → 既定0+警告
      const s = HP.sim;
      s.build({ id: 'qa_pc_ang', name: 'x', camera: { scale: 200 },
        world: { boundary: 'box', size: 60 }, thermal: 'tint',
        phaseChange: { bondN: 3, bondK: 3, bondRange: 1.6, angK: 2 },
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0,
          etaRad: 0, pRad: 2, cHeat: 1, gravityY: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'grid', rMul: 2.5, n: 25, cols: 5, cx: 0, cy: 0, pitch: 5, mMin: 1, mMax: 1, tInt: 0.2 }],
        overlays: {} });
      const alloc = s.angNbr instanceof Int32Array && s.angNbrN instanceof Int32Array;
      const U1 = HP.phaseEnergy(s); s.phase.angK = 0; const U2 = HP.phaseEnergy(s); s.phase.angK = 2;
      const angTerm = Math.abs(U1 - U2) > 1e-9;
      for (let k = 0; k < 300; k++) s.step(0.016);
      const nanOk = !s.hasNaN();
      return { good, big, bad, alloc, angTerm, nanOk, ovf: s.angOvfN };
    });
    add('phasechange.schema-angK',
      sa.good.p.angK === 2 && sa.good.w === 0
      && sa.big.p.angK === 10 && sa.big.w === 1
      && sa.bad.p.angK === 0 && sa.bad.w === 1
      && sa.alloc && sa.angTerm && sa.nanOk && sa.ovf === 0,
      `angK 受理=2(警告0) / 99→${sa.big.p.angK}(クランプ) / "x"→既定0(警告${sa.bad.w}) / ` +
      `angNbr確保=${sa.alloc} U_ang監査=${sa.angTerm}(on/offでUが変わる) 300步NaNなし=${sa.nanOk} 近傍あふれ=${sa.ovf}回`);

    // ④ phasechange.schema-condN(第59便 59B — 創発熱伝導): バリデータ(値域・condG 同時受理)と
    //    エンジンの解析検証 — 2粒子接触系(B=1 厳密)で c=condG+(condS−condG)/(1+condN) が実測
    //    熱流と一致・condN=0 は素の κs(pc なしビルドと bit 一致)
    const scn = await page.evaluate(() => {
      const mk = (pc) => ({ name: 'pc', description: 'x',
        camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, physics: {}, thermal: 'tint',
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, tInt: 0.5, pinned: false }],
        phaseChange: pc });
      const V = (o) => { const v = HP.validatePreset(o); return { p: v.preset.phaseChange, w: v.warnings.length }; };
      const good = V(mk({ bondN: 6, condS: 3, condG: 0.5, condN: 2 }));
      const big = V(mk({ bondN: 6, condN: 99 }));      // → 12(クランプ+警告)
      const bad = V(mk({ bondN: 6, condN: 'x' }));     // → 既定0+警告
      const mkP = (pc) => ({ id: 'qa_pc_condn', name: 'x', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, thermal: 'tint', phaseChange: pc,
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0.5,
          etaRad: 0, pRad: 2, cHeat: 1, gravityY: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [
          { type: 'single', m: 1, x: -2.5, y: 0, vx: 0, vy: 0, spin: 0, tInt: 2, pinned: false },
          { type: 'single', m: 1, x: 2.5, y: 0, vx: 0, vy: 0, spin: 0, tInt: 0.2, pinned: false }],
        overlays: {} });
      const s = HP.sim;
      s.build(mkP({ bondN: 6, bondK: 0, condS: 3, condG: 0.5, condN: 2 }));
      // 接触(d=R0+R1)へ配置し直す — B=1 厳密(唯一の近傍・接触で W=1)。力はゼロ(bondK=0・
      // kRep=0・重なりなし)なので静止のまま純粋な伝導を1步測る
      s.x[0] = -s.R[0]; s.x[1] = s.R[1];
      s.coordN[0] = 1; s.coordN[1] = 1;
      const T0a = s.Tint[0], T0b = s.Tint[1];
      s.step(0.016);
      const dT = T0a - s.Tint[0];
      const cAna = 0.5 + (3 - 0.5) * 1 / (1 + 2);   // condG+(condS−condG)·B/(B+condN), B=1
      const expN = 0.5 * (T0a - T0b) * 0.25 * 0.5 * 0.016 * cAna;   // κs·ΔT·g²·μ·dt·調和平均(c,c)=c
      // 対照①: condN=0(素の κs — 倍率なし)
      s.build(mkP({ bondN: 6, bondK: 0, condS: 3, condG: 0.5 }));
      s.x[0] = -s.R[0]; s.x[1] = s.R[1];
      const Tc0 = s.Tint[0];
      s.step(0.016);
      const dTc = Tc0 - s.Tint[0];
      // 対照②: phaseChange なしの同一構成(condN=0 と bit 一致するはず)
      const noPc = mkP({ bondN: 6 }); delete noPc.phaseChange;
      s.build(noPc);
      s.x[0] = -s.R[0]; s.x[1] = s.R[1];
      const Tn0 = s.Tint[0];
      s.step(0.016);
      const dTn = Tn0 - s.Tint[0];
      const expC = 0.5 * (T0a - T0b) * 0.25 * 0.5 * 0.016;   // 倍率 1
      return { good, big, bad,
        dT, errN: Math.abs(dT - expN), dTc, errC: Math.abs(dTc - expC), bitOff: dTc === dTn };
    });
    add('phasechange.schema-condN',
      scn.good.p.condN === 2 && scn.good.p.condG === 0.5 && scn.good.p.condS === 3 && scn.good.w === 0
      && scn.big.p.condN === 12 && scn.big.w === 1
      && scn.bad.p.condN === 0 && scn.bad.w === 1
      && scn.errN < 1e-6 && scn.errC < 1e-6 && scn.bitOff,
      `condN 受理=2(condS=3/condG=0.5 同時受理・警告0) / 99→${scn.big.p.condN}(クランプ) / "x"→既定0 / ` +
      `2粒子接触 B=1: 実測ΔT=${scn.dT.toExponential(3)} vs 解析 c=κ_G+(κ_S−κ_G)/(1+condN)(誤差${scn.errN.toExponential(1)}<1e-6) / ` +
      `condN=0 → 素のκs(誤差${scn.errC.toExponential(1)})・pcなしビルドと bit 一致=${scn.bitOff}`);

    // ⑤ phasechange.angK-budget(第59便 59A — 保存則): 孤立クラスタ(壁なし・G=0)で 1000步 —
    //    幾何近傍角ポテンシャルは位置だけの保存力(符号付き線形 g)なので運動量・角運動量が
    //    厳密保存(Float32 丸めのみ)・U_ang が監査に入る・近傍あふれ0・力クランプ0・NaN なし。
    //    エネルギードリフトは share 会計の既知の交差項のみ(rel<3e-2 — angK=0 でも同階級)
    const ab59 = await page.evaluate(() => {
      const s = HP.sim;
      s.build({ id: 'qa_angbn2', name: 'x', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, thermal: 'tint',
        phaseChange: { bondN: 3, bondK: 5, bondRange: 1.6, angK: 2 },
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 2, q: 2, muF: 0, gammaN: 0, kappaS: 0,
          etaRad: 0, pRad: 2, cHeat: 1, gravityY: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'grid', rMul: 2.5, n: 25, cols: 5, cx: 0, cy: 0, pitch: 5.5, mMin: 1, mMax: 1, tInt: 0.5 }],
        overlays: {} });
      const Uon = HP.phaseEnergy(s);
      s.phase.angK = 0; const Uoff = HP.phaseEnergy(s); s.phase.angK = 2;
      const E = () => {
        let e = 0;
        for (let i = 0; i < s.n; i++) e += s.params.cHeat * s.m[i] * s.Tint[i]
          + 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]);
        for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
          const d = Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]), sumR = s.R[i] + s.R[j];
          if (d >= sumR) continue;
          const muM = s.m[i] * s.m[j] / (s.m[i] + s.m[j]), maxInv = Math.max(1 / s.m[i], 1 / s.m[j]);
          const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
          e += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC);
        }
        return e + HP.phaseEnergy(s) + HP.urepEnergy(s);
      };
      const mom = () => {
        let px = 0, py = 0, L = 0;
        for (let i = 0; i < s.n; i++) { px += s.m[i] * s.vx[i]; py += s.m[i] * s.vy[i];
          L += s.m[i] * (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) + 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i]; }
        return { px, py, L };
      };
      const E0 = E(), m0 = mom();
      for (let k = 0; k < 1000; k++) s.step(0.016);
      const E1 = E(), m1 = mom();
      return { angOn: Uon < Uoff - 1e-9,
        dpx: Math.abs(m1.px - m0.px), dpy: Math.abs(m1.py - m0.py), dL: Math.abs(m1.L - m0.L),
        rel: Math.abs(E1 - E0) / Math.max(1, Math.abs(E0)),
        nan: s.hasNaN(), ovf: s.angOvfN, clampA: s.clampAN };
    });
    add('phasechange.angK-budget',
      ab59.angOn && ab59.dpx < 1e-3 && ab59.dpy < 1e-3 && ab59.dL < 1e-2
      && ab59.rel < 3e-2 && !ab59.nan && ab59.ovf === 0 && ab59.clampA === 0,
      `U_ang監査(井戸側が優勢: U低下)=${ab59.angOn} / 1000步: |Δp|=(${ab59.dpx.toExponential(1)},${ab59.dpy.toExponential(1)})<1e-3 ` +
      `|ΔL|=${ab59.dL.toExponential(1)}<1e-2(3体力の厳密保存 — Float32丸めのみ) / E相対ドリフト=${ab59.rel.toExponential(2)}(<3e-2 — share会計の既知交差項) / ` +
      `近傍あふれ=${ab59.ovf}回・力クランプ=${ab59.clampA}回・NaN=${ab59.nan}`);

    // ⑥ phasechange.grid: 格子配置 type:"grid" — 六方格子(隣接距離=pitch が同行・隣行とも成立)・
    //    決定論配置・バリデータ(pitch 必須・jitter クランプ)
    const gr = await page.evaluate(() => {
      const s = HP.sim;
      s.build({ id: 'qa_grid', name: 'x', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'grid', n: 10, cols: 4, cx: 5, cy: -3, pitch: 2, mMin: 1, mMax: 1 }], overlays: {} });
      const d01 = Math.hypot(s.x[1] - s.x[0], s.y[1] - s.y[0]);
      const d04 = Math.hypot(s.x[4] - s.x[0], s.y[4] - s.y[0]);   // 隣行(六方: √((p/2)²+(p·√3/2)²)=p)
      let v0max = 0;
      for (let i = 0; i < s.n; i++) v0max = Math.max(v0max, Math.hypot(s.vx[i], s.vy[i]));
      // 第53便 53B: vScale(攪拌) — 速度が付与されること
      s.build({ id: 'qa_grid2', name: 'x', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'grid', n: 10, cols: 4, cx: 0, cy: 0, pitch: 2, mMin: 1, mMax: 1, vScale: 0.5 }], overlays: {} });
      let vsMax = 0;
      for (let i = 0; i < s.n; i++) vsMax = Math.max(vsMax, Math.hypot(s.vx[i], s.vy[i]));
      const v = HP.validatePreset({ name: 'g', description: 'x', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'grid', n: 9, cols: 3, cx: 0, cy: 0, pitch: 3, mMin: 1, mMax: 1, jitter: 99, vScale: 99 }] });
      const vb = HP.validatePreset({ name: 'g', description: 'x', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'grid', n: 9, cols: 3, cx: 0, cy: 0, mMin: 1, mMax: 1 }] });   // pitch 欠落 → NG
      return { n: s.n, d01, d04, v0max, vsMax, vOk: v.ok, vJit: v.ok ? v.preset.bodies[0].jitter : null,
        vVs: v.ok ? v.preset.bodies[0].vScale : null, vW: v.warnings.length, vbOk: vb.ok };
    });
    add('phasechange.grid',
      gr.n === 10 && Math.abs(gr.d01 - 2) < 1e-6 && Math.abs(gr.d04 - 2) < 1e-6
      && gr.v0max === 0 && gr.vsMax > 0.01
      && gr.vOk && gr.vJit === 20 && gr.vVs === 50 && gr.vW === 2 && !gr.vbOk,
      `n=10 同行隣接=${gr.d01}(=pitch) 隣行隣接=${gr.d04.toFixed(6)}(六方=pitch) / ` +
      `vScale省略→静止=${gr.v0max === 0} vScale0.5→|v|max=${gr.vsMax.toFixed(3)}(>0.01) / ` +
      `バリデータ: jitter99→${gr.vJit} vScale99→${gr.vVs}(警告${gr.vW}) pitch欠落→NG=${!gr.vbOk}`);

    // ⑥b phasechange.compat(第53便 53B): セーブ互換。
    //    ①元プリセットの無いセーブは読込を**中止**する(先頭サンプルへのフォールバック廃止)
    //    ②エクスポート JSON に書き出し元ビルド識別 appBuild が入る
    const cp = await page.evaluate(() => {
      HP.loadPreset('pressure', false);
      const before = HP.currentPreset().id;
      HP.loadSaveItem({ presetId: 'zzz_nope_53b', name: 'x', physics: { G: 9 } });
      const afterUnknown = HP.currentPreset().id;
      const gUnchanged = HP.sim.params.G;   // 中止なら pressure の G のまま(9 が適用されていない)
      HP.loadSaveItem({ presetId: 'gas', name: 'x', physics: Object.assign({}, HP.sim.params, { G: 0.123 }) });
      const afterKnown = HP.currentPreset().id, gKnown = HP.sim.params.G;
      const ex = JSON.parse(HP.exportData());
      const expectBuild = HP.isBetaServe() ? undefined : 'v' + HP.APP_VERSION;   // file:// 実行では後者
      // 第81便: コアv1 を廃止したビルドは schemaVersion 4(コアは core:{} のみ)。
      // 未適用のビルド(root 等)は従来どおり 2 — 同じ検査を両対象で回すための機能判定子
      const v3 = HP.validatePreset({ name: 't', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {},
        bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: false,
          core: { mode: 'active', massFrac: 0.3, radius: 1, omega: 5, sourceRate: 1 } }] });
      const hasV4 = !!(v3.ok && v3.preset.bodies[0].core && v3.preset.bodies[0].core.mode === 'active');
      return { before, afterUnknown, gUnchanged, afterKnown, gKnown, hasV4,
        schema: ex.schemaVersion, appBuild: ex.appBuild, expectBuild, isBeta: HP.isBetaServe() };
    });
    add('phasechange.compat',
      cp.before === 'pressure' && cp.afterUnknown === 'pressure' && cp.gUnchanged !== 9
      && cp.afterKnown === 'gas' && Math.abs(cp.gKnown - 0.123) < 1e-12
      && cp.schema === (cp.hasV4 ? 4 : 2) && (cp.isBeta ? typeof cp.appBuild === 'string' : cp.appBuild === cp.expectBuild),
      `未知ID読込 → 中止(現行=${cp.afterUnknown}・保存physicsも未適用=${cp.gUnchanged !== 9}) / ` +
      `既知ID読込 → ${cp.afterKnown}(G=${cp.gKnown}) / export: schemaVersion=${cp.schema}(期待=${cp.hasV4 ? 4 : 2}) appBuild=${cp.appBuild}(期待=${cp.expectBuild ?? 'BETA_BUILD'})`);

    // ⑥b2 phasechange.saveparams(第54便 54B → 第60便): 実験ノブ編集(E14″係数+heat 壁)が
    //    phaseParams/twallHeat としてセーブに入り、読込で値域クランプつきで復元される。
    //    旧スキーマの phaseParams(meltT 等)は新 PC_PARAM_DEFS に無いので黙って無視される
    const sp = await page.evaluate(() => {
      const keep = localStorage.getItem('hp_saves');
      try {
        HP.loadPreset('emergent2', false);
        const s = HP.sim;
        s.phase.bondK = 7; s.phase.condN = 5; s.phase.angK = 1.1;
        s.twall[0].T = 9; s.twall[0].rate = 0.7;
        document.querySelector('#saveName').value = 'qa54b';
        document.querySelector('#btnSave').click();
        const item = JSON.parse(localStorage.getItem('hp_saves'))[0];
        const saved = { pp: item.phaseParams, tw: item.twallHeat };
        HP.loadPreset('emergent2', false);   // 素の emergent2 に戻す(bondK=5 等)
        const defBondK = s.phase.bondK, defWallT = s.twall[0].T;
        HP.loadSaveItem(item);
        const restored = { bondK: s.phase.bondK, condN: s.phase.condN, angK: s.phase.angK,
          wallT: s.twall[0].T, wallRate: s.twall[0].rate };
        // 旧スキーマ+値域クランプ: bondK 99999→100・meltT は無視(phase に載らない)
        HP.loadSaveItem({ presetId: 'emergent2', name: 'x', physics: Object.assign({}, s.params),
          phaseParams: { bondK: 99999, meltT: 5, cohesion: 2 } });
        const legacy = { bondK: s.phase.bondK, meltT: s.phase.meltT, cohesion: s.phase.cohesion };
        return { saved, defBondK, defWallT, restored, legacy };
      } finally {
        if (keep === null) localStorage.removeItem('hp_saves'); else localStorage.setItem('hp_saves', keep);
      }
    });
    add('phasechange.saveparams',
      sp.saved.pp && sp.saved.pp.bondK === 7 && sp.saved.pp.condN === 5 && sp.saved.pp.angK === 1.1
      && sp.saved.tw && sp.saved.tw[0] && sp.saved.tw[0].T === 9 && sp.saved.tw[0].rate === 0.7
      && sp.defBondK === 5 && sp.defWallT !== 9
      && sp.restored.bondK === 7 && sp.restored.condN === 5 && sp.restored.angK === 1.1
      && sp.restored.wallT === 9 && sp.restored.wallRate === 0.7
      && sp.legacy.bondK === 100 && sp.legacy.meltT === undefined && sp.legacy.cohesion === undefined,
      `保存: phaseParams bondK=${sp.saved.pp && sp.saved.pp.bondK}/condN=${sp.saved.pp && sp.saved.pp.condN}/angK=${sp.saved.pp && sp.saved.pp.angK}・` +
      `twallHeat[床]=T${sp.saved.tw && sp.saved.tw[0] && sp.saved.tw[0].T}/rate${sp.saved.tw && sp.saved.tw[0] && sp.saved.tw[0].rate} / ` +
      `読込: 復元=${sp.restored.bondK}/${sp.restored.condN}/${sp.restored.angK}・壁=${sp.restored.wallT}/${sp.restored.wallRate} / ` +
      `旧スキーマ: bondK99999→${sp.legacy.bondK}(クランプ)・meltT/cohesion→無視=${sp.legacy.meltT === undefined && sp.legacy.cohesion === undefined}`);

    // ⑥c phasechange.wallschedule(第53便 53D): 壁温スケジュール T2/tSwitch —
    //    ①バリデータ: 両方指定で受理・片方だけは警告して無視
    //    ②エンジン: t<tSwitch は T・t≥tSwitch は T2 へ緩和(1粒子の到達温度で機械確認 —
    //      第60便: phaseChange 抜きの素の tint 構成に変更〔スケジュールは壁の機能で E14 と独立〕)
    const ws = await page.evaluate(() => {
      const mk = (tw) => ({ name: 'ws', description: 'x', camera: { scale: 200 },
        world: { boundary: 'box', size: 20, thermalWalls: tw }, thermal: 'tint', physics: {},
        bodies: [{ type: 'single', m: 1, x: 0, y: 19, vx: 0, vy: 0, spin: 0, tInt: 0.5, pinned: false }] });
      const V = (o) => { const v = HP.validatePreset(o); return { ok: v.ok, tw: v.preset.world.thermalWalls, w: v.warnings.length }; };
      const good = V(mk({ bottom: { mode: 'heat', T: 3, rate: 1, T2: 0.2, tSwitch: 40 } }));
      const half = V(mk({ bottom: { mode: 'heat', T: 3, rate: 1, T2: 0.2 } }));   // tSwitch 欠落 → 無視+警告
      const s = HP.sim;
      s.build({ id: 'qa_ws', name: 'x', camera: { scale: 200 },
        world: { boundary: 'box', size: 20,
          thermalWalls: { bottom: { mode: 'heat', T: 3, rate: 1.5, T2: 0.2, tSwitch: 16 } } },
        thermal: 'tint',
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0,
          etaRad: 0, pRad: 2, cHeat: 1, gravityY: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'single', m: 1, x: 0, y: 19, vx: 0, vy: 0, spin: 0, tInt: 0.5, pinned: false }],
        overlays: {} });
      for (let k = 0; k < 1000; k++) s.step(0.016);
      const Tpre = s.Tint[0];
      for (let k = 0; k < 3000; k++) s.step(0.016);
      const Tpost = s.Tint[0];
      return { goodT2: good.tw && good.tw.bottom.T2, goodSw: good.tw && good.tw.bottom.tSwitch, goodW: good.w,
        halfHasT2: !!(half.tw && half.tw.bottom.T2 !== undefined), halfW: half.w, Tpre, Tpost };
    });
    add('phasechange.wallschedule',
      ws.goodT2 === 0.2 && ws.goodSw === 40 && ws.goodW === 0
      && !ws.halfHasT2 && ws.halfW === 1
      && ws.Tpre > 2 && ws.Tpost < 0.5,
      `バリデータ: T2/tSwitch 受理=${ws.goodT2}/${ws.goodSw}(警告0) 片方欠落→無視(警告${ws.halfW}) / ` +
      `エンジン: 切替前 T=${ws.Tpre.toFixed(2)}(>2 — 壁温3へ加熱) 切替後 T=${ws.Tpost.toFixed(2)}(<0.5 — 壁温0.2へ冷却)`);

    // ⑥d phasechange.damp-residual(第53便 53D → 第60便 60A 創発減衰版): 2粒子の結合捕獲で、
    //    帳簿外に落ちる散逸の割合が構造誤差 cD_eff/2 に従うことを機械固定(PHYSICS §E14 限界②)。
    //    60A の cD = bondDamp·(√(share·share)/S_max)·W は bondN=2 の2粒子系で share 因子=1、
    //    W は捕獲軌道の帯内分布で平均されるため cD_eff ≈ 0.63·bondDamp(実測 — 幾何のみで決まり
    //    bondDamp に比例)。検証は ①実測窓(0.095±0.02 / 0.0157±0.005)②bondDamp 6倍に対する
    //    残差比の線形性(6±15%)の両建て
    const dr2 = await page.evaluate(() => {
      const run = (damp, steps) => {
        const s = HP.sim;
        s.build({ id: 'qa_damp', name: 'x', camera: { scale: 200 }, world: { boundary: 'none', size: 0 },
          thermal: 'tint',
          phaseChange: { bondN: 2, bondK: 8, bondRange: 1.6, bondDamp: damp },
          physics: { G: 0, D0: 0, kFrame: 0, kRep: 0, q: 2, muF: 0, gammaN: 0, kappaS: 0,
            etaRad: 0, pRad: 2, cHeat: 1, gravityY: 0, softening: 2, radiusScale: 1, timeScale: 1 },
          bodies: [
            { type: 'single', m: 1, x: -1.4, y: 0, vx: 0, vy: 0, spin: 0, tInt: 0.1, pinned: false },
            { type: 'single', m: 1, x: 1.4, y: 0, vx: 0, vy: 0, spin: 0, tInt: 0.1, pinned: false }
          ], overlays: {} });
        const H0 = s.Tint[0] + s.Tint[1];   // C=1・m=1 → 内部熱=ΣT
        const U0 = HP.phaseEnergy(s);
        for (let k = 0; k < steps; k++) s.step(0.016);
        const KE = 0.5 * (s.vx[0] ** 2 + s.vx[1] ** 2 + s.vy[0] ** 2 + s.vy[1] ** 2);
        const hGain = (s.Tint[0] + s.Tint[1]) - H0;
        const released = U0 - HP.phaseEnergy(s) - KE;
        return { ratio: (released - hGain) / released, d: Math.abs(s.x[0] - s.x[1]) };
      };
      return { d03: run(0.3, 3000), d005: run(0.05, 8000) };
    });
    add('phasechange.damp-residual',
      Math.abs(dr2.d03.ratio - 0.095) < 0.02 && Math.abs(dr2.d005.ratio - 0.0157) < 0.005
      && Math.abs(dr2.d03.ratio / dr2.d005.ratio - 6) < 0.9
      && Math.abs(dr2.d03.d - 2) < 0.01 && Math.abs(dr2.d005.d - 2) < 0.01,
      `帳簿外に落ちる散逸の割合: bondDamp=0.3 → ${dr2.d03.ratio.toFixed(4)}(実測窓0.095±0.02) / ` +
      `bondDamp=0.05 → ${dr2.d005.ratio.toFixed(4)}(実測窓0.0157±0.005) / 比=${(dr2.d03.ratio / dr2.d005.ratio).toFixed(2)}(=6±15% — cD_eff∝bondDamp の線形性) ` +
      `— 60A 創発減衰の cD_eff/2 則(W の軌道平均で cD_eff≈0.63·bondDamp・終端 d=r0=2)`);

    // ⑥e phasechange.abclone(第53便 53D → 第60便): A/B 複製で E14″ 状態(配位数2バッファ・
    //    share・phase 係数・相変化履歴)が bit 一致で転写されること
    const abc = await page.evaluate(() => {
      HP.loadPreset('emergent2', false);
      const s = HP.sim;
      for (let k = 0; k < 3000; k++) s.step(0.016);
      HP.abStart('kRep', 0);
      const B = HP.ab().simB;
      let dc = 0, dsh = 0;
      for (let i = 0; i < s.n; i++) { dc = Math.max(dc, Math.abs(B.coordN[i] - s.coordN[i])); dsh = Math.max(dsh, Math.abs(B.shPrev[i] - s.shPrev[i])); }
      const r = { dc, dsh, phaseB: !!B.phase, bnB: B.phase ? B.phase.bondN : null,
        histB: B.phHist.length, histA: s.phHist.length, kRepB: B.params.kRep, kRepA: s.params.kRep };
      for (let k = 0; k < 200; k++) { s.step(0.016); B.step(0.016); }   // 両宇宙とも走る
      r.nanA = s.hasNaN(); r.nanB = B.hasNaN();
      HP.abStop();
      return r;
    });
    add('phasechange.abclone',
      abc.dc === 0 && abc.dsh === 0 && abc.phaseB && abc.bnB === 3
      && abc.histB === abc.histA && abc.kRepB === 0 && abc.kRepA === 8
      && !abc.nanA && !abc.nanB,
      `A/B複製: coordN/shPrev の最大差=${abc.dc}/${abc.dsh}(bit一致) phase係数複製=${abc.phaseB}(bondN=${abc.bnB}) ` +
      `相変化履歴=${abc.histA}/${abc.histB}点 一致 / B側 kRep=${abc.kRepB}(対照)・200步併走 NaNなし`);

    // ⑥f phasechange.observables(第61便 61A — 観測層): ψ6(六方配向秩序)・組替率 churn・
    //    相前線プロファイルを phHist データ層で計測(表示のみ — 物理不変)。
    //    結晶(低温・静止)= ψ6≈1・churn=0 / 温かい液体(emergent2 3000步)= ψ6 低・churn>0
    //    → 「液体=速い組替・固体=組替ゼロ」= 減衰・粘性の寿命依存が観測量として読める
    const ob = await page.evaluate(() => {
      const s = HP.sim;
      HP.loadPreset('emergent2', false);
      for (let k = 0; k < 3000; k++) s.step(0.016);
      const l1 = s.phHist[s.phHist.length - 1];
      const prof = Array.from(s._phProf);
      const liq = { psi6: l1.psi6, churn: l1.churn, hasFields: 'psi6' in l1 && 'churn' in l1 };
      const botC = (prof[5] + prof[6] + prof[7]) / 3, topC = (prof[0] + prof[1] + prof[2]) / 3;
      s.build({ id: 'qa_obs_solid', name: 'x', camera: { scale: 200 }, world: { boundary: 'box', size: 60 },
        thermal: 'tint', phaseChange: { bondN: 6, bondK: 5, bondRange: 1.6, bondDamp: 0.1 },
        physics: { G: 0, D0: 0, kFrame: 0, kRep: 1, q: 2, muF: 0, gammaN: 0.3, kappaS: 0,
          etaRad: 0, pRad: 2, cHeat: 1, gravityY: 0, softening: 2, radiusScale: 1, timeScale: 1 },
        bodies: [{ type: 'grid', rMul: 2.5, n: 25, cols: 5, cx: 0, cy: 0, pitch: 5, mMin: 1, mMax: 1, tInt: 0.1 }],
        overlays: {} });
      for (let k = 0; k < 3000; k++) s.step(0.016);
      const l2 = s.phHist[s.phHist.length - 1];
      return { liq, botC, topC, sol: { psi6: l2.psi6, churn: l2.churn }, nan: s.hasNaN() };
    });
    add('phasechange.observables',
      ob.liq.hasFields && ob.liq.psi6 < 0.85 && ob.liq.churn > 0.005
      && ob.sol.psi6 > 0.97 && ob.sol.churn < 1e-4
      && ob.botC > ob.topC + 1 && !ob.nan,
      `液体(emergent2 3000步): ψ6=${ob.liq.psi6.toFixed(2)}(<0.85) 組替率=${ob.liq.churn.toFixed(3)}(>0.005 — 速い組替) / ` +
      `結晶(低温格子): ψ6=${ob.sol.psi6.toFixed(2)}(>0.97) 組替率=${ob.sol.churn.toExponential(1)}(<1e-4 — 凍結) / ` +
      `前線プロファイル: 床側c̄=${ob.botC.toFixed(1)} > 天井側=${ob.topC.toFixed(1)}+1 — 「液体=速い組替」の粘性シグネチャが観測量として創発`);

    // ---- 長時間系(QA_FAST=1 では省略)----
    if (!FAST) {
      const runStats = (pid, steps, marks, opts) => page.evaluate(({ pid, steps, marks, opts }) => {
        HP.loadPreset(pid, false);
        const s = HP.sim;
        if (opts && opts.angK !== undefined) s.phase.angK = opts.angK;
        if (opts && opts.seed !== undefined) { /* seed はプリセット再構築で焼かれる — 使わない */ }
        const gY = s.params.gravityY;
        const E = () => {
          let a = 0;
          for (let i = 0; i < s.n; i++) a += s.params.cHeat * s.m[i] * s.Tint[i]
            + 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]) - s.m[i] * gY * s.y[i];
          for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
            const d = Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]), sumR = s.R[i] + s.R[j];
            if (d >= sumR) continue;
            const muM = s.m[i] * s.m[j] / (s.m[i] + s.m[j]), maxInv = Math.max(1 / s.m[i], 1 / s.m[j]);
            const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
            a += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC);
          }
          return a + HP.phaseEnergy(s) + HP.urepEnergy(s);
        };
        const stats = () => {
          const nbr = Array.from({ length: s.n }, () => []);
          for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
            const d = Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]);
            if (d < s.phase.bondRange * (s.R[i] + s.R[j])) { nbr[i].push(j); nbr[j].push(i); }
          }
          let T = 0, cSum = 0, c2 = 0, c3 = 0, ang120 = 0, n120 = 0, ang180 = 0, n180 = 0;
          for (let i = 0; i < s.n; i++) {
            T += s.Tint[i]; cSum += nbr[i].length;
            if (nbr[i].length === 2) {
              c2++;
              const [j, k] = nbr[i];
              const a1 = Math.atan2(s.y[j] - s.y[i], s.x[j] - s.x[i]);
              const a2 = Math.atan2(s.y[k] - s.y[i], s.x[k] - s.x[i]);
              let da = Math.abs(a1 - a2); if (da > Math.PI) da = 2 * Math.PI - da;
              ang180 += Math.abs(Math.PI - da); n180++;
            }
            if (nbr[i].length === 3) {
              c3++;
              const angs = nbr[i].map(j => Math.atan2(s.y[j] - s.y[i], s.x[j] - s.x[i])).sort((a, b) => a - b);
              for (let k = 0; k < 3; k++) {
                let da = angs[(k + 1) % 3] - angs[k]; if (k === 2) da += 2 * Math.PI;
                ang120 += Math.abs(da - 2 * Math.PI / 3); n120++;
              }
            }
          }
          const par = Array.from({ length: s.n }, (_, i) => i);
          const find = (a) => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
          for (let i = 0; i < s.n; i++) for (const j of nbr[i]) { const a = find(i), b = find(j); if (a !== b) par[a] = b; }
          const cn = {};
          for (let i = 0; i < s.n; i++) { const r0 = find(i); cn[r0] = (cn[r0] || 0) + 1; }
          const sizes = Object.values(cn).sort((a, b) => b - a);
          return { T: T / s.n, cMean: cSum / s.n, frac2: c2 / s.n, frac3: c3 / s.n,
            ang120: n120 ? ang120 / n120 * 180 / Math.PI : 999,
            ang180: n180 ? ang180 / n180 * 180 / Math.PI : 999,
            nComp: sizes.length, maxComp: sizes[0] };
        };
        const E0 = E();
        const out = {};
        for (let k = 1; k <= steps; k++) { s.step(0.016); if (marks.includes(k)) out[k] = stats(); }
        out.end = stats();
        const flow = s.wallEin - s.wallEout - s.radE - s.wallKE;
        out.res = Math.abs(E() - E0 - flow) / Math.max(1, Math.abs(flow));
        out.nan = s.hasNaN(); out.ovf = s.angOvfN; out.clampA = s.clampAN;
        return out;
      }, { pid, steps, marks, opts: opts || {} });

      // ⑦ phasechange.emergent: 🧬 三態の創発(純創発版 — 潜熱・相率なし)。実測(第60便
      //    2026-08-02): 1500步 固体状(c̄3.46・最大32粒)→ 12000步 液滴・分子群(c̄2.36・34成分)
      //    → 45000步 分子ガスの準定常(c̄2.41・30成分 最大9粒)。res 6.3e-4・クランプ0
      const em = await runStats('emergent', 45000, [1500, 12000]);
      add('phasechange.emergent',
        !em.nan
        && em[1500].cMean > 3.2 && em[1500].maxComp >= 25
        && em[12000].cMean < 2.9 && em[12000].nComp >= 20
        && em.end.cMean < 2.9 && em.end.nComp >= 20 && em.end.maxComp <= 15
        && em[1500].cMean > em[12000].cMean
        && em.clampA === 0 && em.ovf === 0 && em.res < 1e-2,
        `🧬emergent: 1500步 固体状(c̄=${em[1500].cMean.toFixed(2)}>3.2・最大${em[1500].maxComp}≥25) → ` +
        `12000步 液滴・分子群(c̄=${em[12000].cMean.toFixed(2)}<2.9・${em[12000].nComp}成分) → ` +
        `45000步 分子ガス(c̄=${em.end.cMean.toFixed(2)}・${em.end.nComp}成分 最大${em.end.maxComp}≤15 — 予算集中で「分子」が創発) ` +
        `帳簿残差=${em.res.toExponential(2)}(<1e-2 — 潜熱なしでも share 再配分の熱交換で閉鎖) クランプ=${em.clampA}回・あふれ=${em.ovf}回`);

      // ⑧ phasechange.emergent2: 🧊 格子も分子も(予算3×角度120°+創発伝導)。実測(第60便):
      //    60000步冷却で T̄=0.15・c̄3.04・3配位率0.375・角偏差17.5°(angK=0 対照は 79.2° の
      //    密集塊 c̄4.09)・3成分 最大44粒・res 2.8e-2・クランプ0
      const e2 = await runStats('emergent2', 60000, []);
      add('phasechange.emergent2',
        !e2.nan
        && e2.end.T < 0.25 && e2.end.frac3 > 0.3 && e2.end.ang120 < 25
        && e2.end.cMean > 2.7 && e2.end.cMean < 3.4 && e2.end.maxComp >= 35 && e2.end.nComp <= 6
        && e2.clampA === 0 && e2.ovf === 0 && e2.res < 0.1,
        `🧊emergent2: 60000步冷却 T̄=${e2.end.T.toFixed(2)}(<0.25 凝固)・幾何配位c̄=${e2.end.cMean.toFixed(2)}(2.7〜3.4=開いた網)・3配位率=${e2.end.frac3.toFixed(2)}(>0.3) ` +
        `角偏差=${e2.end.ang120.toFixed(1)}°(<25° — angK=0 対照の実測79.2°から1/4=リンク台帳なしの蜂の巣格子) ` +
        `連結=${e2.end.nComp}成分(≤6・最大${e2.end.maxComp}≥35) 帳簿残差=${e2.res.toExponential(2)}(<0.1 — bondN=3域のshare交差項・angK=0対照でも同階級) ` +
        `クランプ=${e2.clampA}回・近傍あふれ=${e2.ovf}回`);

      // ⑨ phasechange.chain2: ⛓️ 鎖の創発(予算2×角度180°)。実測(第60便): 45000步で
      //    2配位率0.80・c̄1.89・180°偏差13°(angK=0 対照は 94.5° の等方塊 c̄3.0)・8成分 最大37粒・
      //    res 2.3e-2・クランプ0 — 結合価の台帳なしで鎖が自己組織化
      const c2r = await runStats('chain2', 45000, []);
      add('phasechange.chain2',
        !c2r.nan
        && c2r.end.frac2 > 0.6 && c2r.end.cMean > 1.6 && c2r.end.cMean < 2.2
        && c2r.end.ang180 < 25 && c2r.end.nComp <= 15 && c2r.end.maxComp >= 25
        && c2r.end.T < 0.8
        && c2r.clampA === 0 && c2r.ovf === 0 && c2r.res < 0.1,
        `⛓️chain2: 45000步 2配位率=${c2r.end.frac2.toFixed(2)}(>0.6 鎖)・c̄=${c2r.end.cMean.toFixed(2)}(1.6〜2.2)・` +
        `180°偏差=${c2r.end.ang180.toFixed(1)}°(<25° — angK=0 対照の実測94.5°=まっすぐな鎖) ` +
        `連結=${c2r.end.nComp}成分(≤15・最大${c2r.end.maxComp}≥25 — 長い鎖) T̄=${c2r.end.T.toFixed(2)} ` +
        `帳簿残差=${c2r.res.toExponential(2)}(<0.1) クランプ=${c2r.clampA}回・あふれ=${c2r.ovf}回`);

      // ⑩ phasechange.multiseed: ⛓️chain2 の鎖創発が seed に依らない(seed 7/8/9 × 15000步 —
      //    ノイズ実現が違っても構造の族〔鎖〕は同じ。欠陥・端点数だけが変動する)
      const seeds = [];
      for (const sd of [7, 8, 9]) {
        const r = await page.evaluate(({ sd }) => {
          const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'chain2')));
          p.seed = sd;
          const s = HP.sim;
          s.build(p);
          for (let k = 0; k < 15000; k++) s.step(0.016);
          const nbr = Array.from({ length: s.n }, () => []);
          for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
            const d = Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]);
            if (d < s.phase.bondRange * (s.R[i] + s.R[j])) { nbr[i].push(j); nbr[j].push(i); }
          }
          let c2 = 0, ang180 = 0, n180 = 0;
          for (let i = 0; i < s.n; i++) if (nbr[i].length === 2) {
            c2++;
            const [j, k] = nbr[i];
            const a1 = Math.atan2(s.y[j] - s.y[i], s.x[j] - s.x[i]);
            const a2 = Math.atan2(s.y[k] - s.y[i], s.x[k] - s.x[i]);
            let da = Math.abs(a1 - a2); if (da > Math.PI) da = 2 * Math.PI - da;
            ang180 += Math.abs(Math.PI - da); n180++;
          }
          return { frac2: c2 / s.n, ang: n180 ? ang180 / n180 * 180 / Math.PI : 999, nan: s.hasNaN() };
        }, { sd });
        seeds.push({ sd, ...r });
      }
      add('phasechange.multiseed',
        seeds.every(x => !x.nan && x.frac2 > 0.5 && x.ang < 30),
        `⛓️chain2 15000步 × seed3種: ` + seeds.map(x => `seed${x.sd}: 2配位率=${x.frac2.toFixed(2)}(>0.5) 180°偏差=${x.ang.toFixed(1)}°(<30°)`).join(' / ') +
        ` — 鎖の創発は seed 非依存(欠陥数のみ変動)`);

      // ⑪ phasechange.dt-convergence: dt 半減(0.016→0.008)で同じモデル時刻 t=96 の熱力学
      //    集計量(T̄・c̄)が収束していること(軌道は混沌でも集計量は壁駆動で頑健 — emergent2 冷却)
      const dtc = await page.evaluate(() => {
        const run = (dt, steps) => {
          HP.loadPreset('emergent2', false);
          const s = HP.sim;
          for (let k = 0; k < steps; k++) s.step(dt);
          let T = 0, c = 0;
          for (let i = 0; i < s.n; i++) { T += s.Tint[i]; c += s.coordN[i]; }
          return { T: T / s.n, c: c / s.n, nan: s.hasNaN() };
        };
        const a = run(0.016, 6000), b = run(0.008, 12000);
        return { a, b, dT: Math.abs(a.T - b.T) / Math.max(0.05, a.T), dC: Math.abs(a.c - b.c) / Math.max(0.5, a.c) };
      });
      add('phasechange.dt-convergence',
        !dtc.a.nan && !dtc.b.nan && dtc.dT < 0.1 && dtc.dC < 0.15,
        `t=96(6000步@0.016 vs 12000步@0.008): T̄=${dtc.a.T.toFixed(3)}/${dtc.b.T.toFixed(3)}(相対差${(dtc.dT * 100).toFixed(1)}%<10%) ` +
        `c̄=${dtc.a.c.toFixed(2)}/${dtc.b.c.toFixed(2)}(相対差${(dtc.dC * 100).toFixed(1)}%<15%) — 集計量の dt 収束`);

      // ⑫ 第67便 67A: claim.chaincycle — ♻️温度循環(凍結→解離)。⛓️と同一物理・同一 seed で
      //    床壁だけ T=0.6 → (t=288) → T2=20。較正実測: t=288 最大連結36・14成分・組替0.01・T̄1.24 /
      //    t=528 最大6・71成分・組替0.30・T̄12.5。壁温8では解けない(断片化止まり)ことも67Aで実測。
      //    判定は構造の族(凍結=大きな連結+組替≈0/解離=多成分+速い組替)+T̄の交差
      {
        const hasCyc = await page.evaluate(() => HP.allPresets().some(p => p.id === 'chaincycle'));
        if (hasCyc) {
          const cyc = await page.evaluate(() => {
            HP.loadPreset('chaincycle', false);
            const s = HP.sim;
            let prevNbr = null;
            const stats = () => {
              const nbr = Array.from({ length: s.n }, () => []);
              for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
                const d = Math.hypot(s.x[i] - s.x[j], s.y[i] - s.y[j]);
                if (d < s.phase.bondRange * (s.R[i] + s.R[j])) { nbr[i].push(j); nbr[j].push(i); }
              }
              let T = 0;
              for (let i = 0; i < s.n; i++) T += s.Tint[i];
              const seen = new Uint8Array(s.n); let nComp = 0, maxComp = 0;
              for (let i = 0; i < s.n; i++) { if (seen[i]) continue; nComp++; let sz = 0; const st = [i]; seen[i] = 1;
                while (st.length) { const u = st.pop(); sz++; for (const w of nbr[u]) if (!seen[w]) { seen[w] = 1; st.push(w); } }
                if (sz > maxComp) maxComp = sz; }
              let churn = NaN;
              if (prevNbr) { let diff = 0, tot = 0;
                for (let i = 0; i < s.n; i++) { const a = new Set(prevNbr[i]), b = new Set(nbr[i]);
                  for (const w of a) { tot++; if (!b.has(w)) diff++; } for (const w of b) if (!a.has(w)) { tot++; diff++; } }
                churn = tot ? diff / tot : 0; }
              prevNbr = nbr.map(a => a.slice());
              return { T: T / s.n, nComp, maxComp, churn };
            };
            for (let k = 0; k < 15000; k++) s.step(0.016);
            stats();   // churn の基準(t=240)
            for (let k = 0; k < 3000; k++) s.step(0.016);
            const fz = stats();   // t=288(凍結末)
            for (let k = 0; k < 12000; k++) s.step(0.016);
            stats();   // churn の基準(t=480)
            for (let k = 0; k < 3000; k++) s.step(0.016);
            const ml = stats();   // t=528(解離末)
            return { fz, ml, nan: s.hasNaN() };
          });
          add('claim.chaincycle',
            !cyc.nan
            && cyc.fz.maxComp >= 25 && cyc.fz.maxComp <= 50 && cyc.fz.churn < 0.05
            && cyc.ml.nComp >= 50 && cyc.ml.nComp <= 95 && cyc.ml.maxComp <= 12 && cyc.ml.churn > 0.15
            && cyc.ml.T > cyc.fz.T * 3,
            `♻️凍結末(t=288): 最大連結=${cyc.fz.maxComp}(窓25〜50・実測36) 組替=${cyc.fz.churn.toFixed(3)}(<0.05) T̄=${cyc.fz.T.toFixed(2)} / ` +
            `解離末(t=528): ${cyc.ml.nComp}成分(窓50〜95・実測71) 最大=${cyc.ml.maxComp}(≤12) 組替=${cyc.ml.churn.toFixed(3)}(>0.15) ` +
            `T̄=${cyc.ml.T.toFixed(2)}(凍結末の3倍超) — 相・融点・潜熱の入力なしで凍結⇄解離が壁温だけで往復`);
        } else {
          console.log('SKIP claim.chaincycle(対象に 67A 未適用 — root 等)');
        }
      }
    } else {
      console.log('SKIP phasechange.emergent/emergent2/chain2/multiseed/dt-convergence/claim.chaincycle(QA_FAST=1 — 長時間系)');
    }

    await page.evaluate(() => HP.loadPreset('saturn', false));   // 後続項目のため既定プリセットへ戻す
  } else {
    console.log('SKIP phasechange.*(対象に E14″ 創発相変化なし — root 等)');
  }
}

// ==================== 第37便 Wave A(原仮定者指示): UI 6件 ====================

// ---- 7z6) A1: ui.tabbar-safearea — 下部タブがホームインジケーター(iPhone の
// ----      safe-area-inset-bottom)に被らないよう、nav#tabs に #panel と同じ --sab
// ----      (env(safe-area-inset-bottom,0px))由来の padding-bottom を確保した。beta 先行
// ----      (root には未適用)なので、version.beta-label と同型の静的検査で対象の有無を
// ----      判定してから実行する。iPhone実機の無いヘッドレス環境での検証は二段構え:
// ----      ①静的にCSS宣言の存在を確認(nav#tabs ルール本体に padding-bottom:var(--sab) が
// ----      あり、--sab 自体が env(safe-area-inset-bottom を参照)②動的に本スイート既定の
// ----      390×844 で横スクロールが出ないこと・タブ全ボタンが viewport 内に収まることを
// ----      確認する(インセット0のヘッドレス環境でも従来レイアウトが崩れないことの担保)----
{
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const rule = (html.match(/nav#tabs\{([\s\S]*?)\}/) || [])[1] || '';
  const hasSabDecl = /padding-bottom\s*:\s*var\(--sab\)/.test(rule);
  const hasSabVar = /--sab\s*:\s*env\(safe-area-inset-bottom/.test(html);
  if (hasSabDecl && hasSabVar) {
    const r = await page.evaluate(() => {
      HP.loadPreset('saturn', false);
      document.querySelector('#btnPanelClose')?.click();   // パネルを閉じた状態(タブが画面最下段になる条件)で検査
      const doc = document.documentElement;
      const noHScroll = doc.scrollWidth <= doc.clientWidth + 1;
      const btns = [...document.querySelectorAll('#tabs button')];
      const vw = window.innerWidth, vh = window.innerHeight;
      const allVisible = btns.length > 0 && btns.every((b) => {
        const rc = b.getBoundingClientRect();
        return rc.width > 0 && rc.height > 0 && rc.left >= -1 && rc.right <= vw + 1 && rc.bottom <= vh + 1;
      });
      const tabsEl = document.querySelector('#tabs');
      const cs = getComputedStyle(tabsEl);
      return { noHScroll, allVisible, nBtns: btns.length, padBottom: cs.paddingBottom,
        tabsBottom: tabsEl.getBoundingClientRect().bottom, vh };
    });
    add('ui.tabbar-safearea',
      r.noHScroll && r.allVisible && r.nBtns > 0,
      `CSS宣言: nav#tabs{padding-bottom:var(--sab)}=${hasSabDecl} --sab=env(safe-area-inset-bottom,...)由来=${hasSabVar} / ` +
      `390×844実測(パネル閉): 横スクロールなし=${r.noHScroll} タブ${r.nBtns}件全表示=${r.allVisible}` +
      `(computed padding-bottom=${r.padBottom}・ヘッドレスはインセット0のため0px相当が正常) ` +
      `タブ下端=${r.tabsBottom.toFixed(1)}px/vh=${r.vh}`);
  } else {
    console.log('SKIP ui.tabbar-safearea(対象に nav#tabs の --sab padding-bottom 宣言なし — 第37便 A1 未適用の root 等)');
  }
}

// ---- 7z7) A2: ui.sweep-auto-checkbox — 粒子編集パネルの「掻出」欄に auto チェックボックスを
// ----      追加した。ON で lightSweep="auto" 相当(S.lSwAuto=1)になり数値欄(#beSw)が
// ----      読み取り専用になる。OFF で現在の実効値を数値指定として引き継ぎ、数値欄が編集可能に
// ----      戻る(#beSw への直接 "auto" 文字列入力の従来経路も unchanged — どちらも S.lSwAuto を
// ----      単一の真実として操作する)。
// ----      第38便(原仮定者指示): #beSwEff(実効値の別表示スパン)を廃止し、#beSw 自体が auto中も
// ----      実効値を表示するように変更 — 新仕様は「auto ON→ #beSw.readOnly===true かつ
// ----      #beSw.value が fmt(lS_eff) と一致」であることを見る(step後に HP.selectBody で
// ----      再同期して比較)。
// ----      beta 先行(root には #beSwAuto 自体が無い)なので DOM 要素の有無で先にガードする ----
const hasSwAutoCb = await page.evaluate(() => !!document.querySelector('#beSwAuto'));
if (hasSwAutoCb) {
  const r = await page.evaluate(() => {
    const s = HP.sim;
    s.build({ id: 'qa37_sw', name: 'sw', description: 'd', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 },
      physics: { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 60,
        cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
        pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 },
      bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 1, pinned: true, radius: 20, lightSweep: 0.3 }],
      overlays: {} });
    s.step(0.016);
    HP.selectBody(0, 'A');
    const swEl = document.querySelector('#beSw'), cbEl = document.querySelector('#beSwAuto');
    const before = { val: parseFloat(swEl.value), ro: swEl.readOnly, cb: cbEl.checked, auto: s.lSwAuto[0] };
    cbEl.click();   // ON — ユーザーのタップと同じ経路(change イベントも実発火)
    s.step(0.016);   // 実効値 lS_eff の算出は毎ステップなので、通常のプレイと同じく1步進める
    HP.selectBody(0, 'A');   // updateBodyEdit() 再同期(step 後の実効値を#beSwへ反映)
    const on = { val: parseFloat(swEl.value), ro: swEl.readOnly, auto: s.lSwAuto[0], lSwEff: s.lSwEff(0) };
    cbEl.click();   // OFF
    HP.selectBody(0, 'A');
    const off = { val: parseFloat(swEl.value), ro: swEl.readOnly, auto: s.lSwAuto[0], numVal: s.lSw[0] };
    HP.selectBody(-1, 'A');   // 選択解除(以降の項目へ影響させない)
    return { before, on, off };
  });
  // #beSw の表示値は fmt() で小数2桁に丸められる(index.html の fmt 定義)ため、生の実効値
  // (lSwEff/numVal)との比較は丸め誤差(最大0.005)を許容する必要がある — 1e-6 は表示丸めを考慮しない
  // 誤った期待値だった(初回実行の実測: val=0.42 / numVal=0.420586・差0.000586 で誤FAIL)
  const ok = !r.before.cb && r.before.ro === false && Math.abs(r.before.val - 0.3) < 1e-6 && r.before.auto === 0
    && r.on.auto === 1 && r.on.ro === true && isFinite(r.on.val)
    && Math.abs(r.on.val - r.on.lSwEff) < 0.006 && r.on.lSwEff > 0 && r.on.lSwEff <= 1
    && r.off.auto === 0 && r.off.ro === false && isFinite(r.off.val) && Math.abs(r.off.val - r.off.numVal) < 0.006;
  add('ui.sweep-auto-checkbox', ok,
    `OFF初期: 読取専用=${r.before.ro} 値=${r.before.val}(数値0.3) auto=${r.before.auto} / ` +
    `ONタップ後(1步): auto=${r.on.auto} 読取専用=${r.on.ro} 値=${r.on.val}` +
    `(実効値lS_eff=${r.on.lSwEff.toFixed(6)}と一致・第38便で#beSwEff廃止→#beSw自体が表示) / ` +
    `OFFタップで復帰: auto=${r.off.auto} 読取専用=${r.off.ro} 値=${r.off.val}(実効値${r.off.numVal.toFixed(6)}を引き継いだ数値)`);
} else {
  console.log('SKIP ui.sweep-auto-checkbox(対象に #beSwAuto なし — 第37便 A2 未適用の root 等)');
}

// ---- 7z8) A3+第38便 A1/A2: ui.ray-lambda0 — 光線の基準波長λ0(nm)を表示設定として選べるように
// ----      した(セーブ対象外・物理不変)。HP.setRayLambda0 で変更すると drawRays の色計算
// ----      (λ_seg=λ0·e^{ψ0−ψ})に反映されることを HP.traceRay の計算値(ray.wavelength-color と
// ----      同じ Wtot 取得法)+ HP.wavelengthColor で確認し、物理ハッシュ(位置・速度・スピン・
// ----      半径)が変更前後で bit 一致することも見る。
// ----      第38便(原仮定者指示): 既定を550→580へ変更。setRayLambda0/読み込みのクランプは
// ----      [0.001,1e6]へ拡大(可視clampはスライダー表示のみの制約になった)。可視光外の記号色
// ----      (rayBandColor)と、旧既定550の保存値だけを580へ移行する既定移行ロジック
// ----      (rayLambda0FromRaw)も併せて検証する ----
{
  const hasWL = await page.evaluate(() => typeof window.HP.wavelengthColor === 'function');
  const hasLensing = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'lensing'));
  if (hasWL && hasLensing) {
    const r = await page.evaluate(() => {
      HP.loadPreset('lensing', false);
      const S = HP.sim, Kt = S.params.Kt;
      const trace = () => {
        const pts = [];
        HP.traceRay(S, -600, -20, 1, 0, 3, 800, (nx, ny, Wtot) => { pts.push(Wtot); return true; });
        return pts.map((w) => w / Kt);
      };
      const hashPhys = () => {
        const a = [];
        for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i], S.R[i]);
        return a.join(',');
      };
      const before = { lam0: HP.rayLambda0(), physHash: hashPhys() };
      const psi = trace();
      const psi0 = psi[0];
      let maxIdx = 0;
      for (let i = 1; i < psi.length; i++) if (psi[i] > psi[maxIdx]) maxIdx = i;
      const psiDeep = psi[maxIdx];
      const colAt = (lam0) => {
        const nm0 = lam0 * Math.exp(psi0 - psi0), nmDeep = lam0 * Math.exp(psi0 - psiDeep);
        return { nm0, nmDeep, col0: HP.wavelengthColor(nm0), colDeep: HP.wavelengthColor(nmDeep) };
      };
      const default580 = colAt(580);
      HP.setRayLambda0(650);   // 変更
      const after650 = { lam0: HP.rayLambda0(), physHash: hashPhys(), ...colAt(650) };
      // 第38便(a): クランプは[0.001,1e6]へ拡大 — 直値は可視外(赤外1200nm・γ線0.001nm)もそのまま
      // 受理される(旧来の[380,780]クランプはスライダー表示だけの制約になった)
      const noClampHi = (() => { HP.setRayLambda0(1200); return HP.rayLambda0(); })();
      const noClampLo = (() => { HP.setRayLambda0(0.001); return HP.rayLambda0(); })();
      HP.setRayLambda0(580);   // 既定へ戻す(以降の項目へ影響させない)
      // 第38便(b): 可視光外の記号色(rayBandColor)
      const bandColors = {
        gamma: HP.rayBandColor(0.005), xray: HP.rayBandColor(5),
        uv: HP.rayBandColor(200), ir: HP.rayBandColor(1200),
      };
      // 第38便(c): 旧既定550の保存値だけが580へ移行し、他の値・未保存/不正値はそれぞれ保持/新既定になる
      const migrate = {
        none: HP.rayLambda0FromRaw(null), old550: HP.rayLambda0FromRaw('550'),
        kept650: HP.rayLambda0FromRaw('650'), invalid: HP.rayLambda0FromRaw('abc'),
      };
      return { before, default580, after650, noClampHi, noClampLo, restored: HP.rayLambda0(), bandColors, migrate };
    });
    const ok = r.before.lam0 === 580 && r.after650.lam0 === 650
      && r.after650.physHash === r.before.physHash   // 物理(位置・速度・スピン・半径)は不変
      && Math.abs(r.after650.nm0 - 650) < 1e-9 && r.after650.nmDeep < r.after650.nm0 - 1
      && r.after650.col0 !== r.default580.col0   // λ0 変更で色計算に反映(基準色が変わる)
      && r.noClampHi === 1200 && r.noClampLo === 0.001 && r.restored === 580
      && r.bandColors.gamma === '#ffffff' && r.bandColors.xray === '#7fdfff'
      && r.bandColors.uv === '#c44dff' && r.bandColors.ir === '#b22222'
      && r.migrate.none === 580 && r.migrate.old550 === 580
      && r.migrate.kept650 === 650 && r.migrate.invalid === 580;
    add('ui.ray-lambda0', ok,
      `既定λ0=${r.before.lam0}(=580・第38便で550から移行) → HP.setRayLambda0(650)後=${r.after650.lam0}` +
      `(λ0色 ${r.default580.col0}→${r.after650.col0}) 物理ハッシュ不変=${r.after650.physHash === r.before.physHash} ` +
      `可視外直値は非clamp: 1200→${r.noClampHi} 0.001→${r.noClampLo} 復帰=${r.restored} ` +
      `帯域色: γ=${r.bandColors.gamma}(白) X=${r.bandColors.xray}(淡シアン) UV=${r.bandColors.uv}(明紫) IR=${r.bandColors.ir}(暗赤) ` +
      `既定移行: 未保存=${r.migrate.none}(=580) 旧550=${r.migrate.old550}(=580) 650保持=${r.migrate.kept650}(=650) 不正値=${r.migrate.invalid}(=580)`);
  } else {
    console.log('SKIP ui.ray-lambda0(対象に wavelengthColor 公開 or 💡lensing なし — 第36便 B3 未適用の root 等)');
  }
}

// ---- 7z8b) 第38便 A4: radius.explicit-scale — radiusScale(全粒子共通の相対ノブ)が明示半径
// ----      (body.radius/radOv)の粒子にも効くようにした(従来は radiusScale を無視していた)。
// ----      rotorSolo の中心天体相当(radius:45)で radiusScale=2 のとき R=90 になること、
// ----      radiusScale=1(既定)では従来値(=45)と bit 一致することを見る。
// ----      HP.rayBandColor(第38便で新規公開)の有無で対象を先にガードする(この便で同時に
// ----      入るため、他の第38便項目と同一ビルドかどうかの判定を兼ねる)----
{
  const has38A = await page.evaluate(() => typeof HP.rayBandColor === 'function');
  if (has38A) {
    const r = await page.evaluate(() => {
      const mk = (rs) => ({ id: 'qa38_rs', name: 'r', description: 'd', camera: { scale: 300 },
        world: { boundary: 'none', size: 0 },
        physics: { G: 1, D0: 2, kFrame: 1, q: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 60,
          cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: rs, softening: 2, timeScale: 1 },
        // rotorSolo の中心天体相当(m=2000, radius=45, spin=2)
        bodies: [{ type: 'single', m: 2000, x: 0, y: 0, vx: 0, vy: 0, spin: 2, pinned: false, radius: 45 }],
        overlays: {} });
      const s = HP.sim;
      s.build(mk(1));
      const rAt1 = s.R[0];
      s.params.radiusScale = 2; s.updateRadii();
      const rAt2 = s.R[0];
      return { rAt1, rAt2 };
    });
    const ok = Math.abs(r.rAt1 - 45) < 1e-9 && Math.abs(r.rAt2 - 90) < 1e-9;
    add('radius.explicit-scale', ok,
      `radiusScale=1: R=${r.rAt1}(=45・従来値とbit一致) radiusScale=2: R=${r.rAt2}(=90・明示半径にもradiusScaleが乗る)`);
  } else {
    console.log('SKIP radius.explicit-scale(対象に HP.rayBandColor なし — 第38便 A4 未適用の root 等)');
  }
}

// ---- 7z9) A4: field.uniform-gravity — 決定力マップの表示規約 W_disp=W+Φ_g
// ----      (Φ_g=(gravityX·x+gravityY·y)/G_eff、G_eff=(G>0?G:1))を追加した。gravityY≠0 の
// ----      実験室サンプル(⚾projectile・♨️convection)で、画面上端と下端の W_disp に
// ----      差が生じることを HP.fieldWDisp(表示合成そのもの・drawField 専用)の計算値で
// ----      機械判定する。gravityX=gravityY=0 のプリセットでは HP.fieldWDisp===HP.sim.Wat
// ----      (物理の W そのもの)のままであることも併せて確認し、既存プリセットの表示が
// ----      不変であることを担保する(物理は不変 — S.Wat 自体・光線・時計・接触判定は
// ----      HP.fieldWDisp を一切経由しない)----
{
  const hasFieldWDisp = await page.evaluate(() => typeof HP.fieldWDisp === 'function');
  const hasProjectile = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'projectile'));
  if (hasFieldWDisp && hasProjectile) {
    const r = await page.evaluate(() => {
      HP.loadPreset('projectile', false);   // gravityY=0.08・G=0(自己重力なし→G_eff=1)
      const S = HP.sim;
      // x=0固定・yを画面の上下端よりさらに遠くまで振って比較する(camera.scale=220 程度の
      // プリセットに対し ±3000)。粒子群(x∈[-170,-110],y∈[-140,100])からの寄与 S.Wat は
      // 上下でほぼ等しい遠方まで距離を離すことで、Φ_g の符号だけを機械判定できるようにする
      // (画面近傍の点だと粒子配置の非対称性がΦ_gの寄与と紛れうるため、Φ_g の寄与を
      // 支配的にする設計 — 「床方向ほどW_dispが高い」という主張は Φ_g 単体の式で厳密に
      // 保証されるので、以下ではΦ_g=W_disp−Wat を各点で直接検算する)
      const yTop = -3000, yBot = 3000;
      const wTop = HP.fieldWDisp(0, yTop), wBot = HP.fieldWDisp(0, yBot);
      const wPlainTop = S.Wat(0, yTop), wPlainBot = S.Wat(0, yBot);
      const gravOk = wBot > wTop;   // 遠方では Φ_g が支配的なので厳密にこの符号になるはず
      const Geff = S.params.G > 0 ? S.params.G : 1;
      const phiTop = wTop - wPlainTop, phiBot = wBot - wPlainBot;
      const expectedPhiTop = S.params.gravityY * yTop / Geff, expectedPhiBot = S.params.gravityY * yBot / Geff;
      // gravityX=gravityY=0 のプリセット(saturn)では fieldWDisp が Wat と厳密一致
      HP.loadPreset('saturn', false);
      const S2 = HP.sim;
      const noGravSame = Math.abs(HP.fieldWDisp(50, 30) - S2.Wat(50, 30)) < 1e-12
        && S2.params.gravityX === 0 && S2.params.gravityY === 0;
      HP.loadPreset('saturn', false);   // 既定へ戻す
      return { wTop, wBot, gravOk, phiTop, phiBot, expectedPhiTop, expectedPhiBot, noGravSame };
    });
    const phiOk = Math.abs(r.phiTop - r.expectedPhiTop) < 1e-9 && Math.abs(r.phiBot - r.expectedPhiBot) < 1e-9;
    add('field.uniform-gravity',
      r.gravOk && phiOk && r.noGravSame,
      `⚾projectile(gravityY=0.08,G=0→G_eff=1): W_disp(y=-3000)=${r.wTop.toFixed(2)} ` +
      `W_disp(y=+3000)=${r.wBot.toFixed(2)}(下端>上端=${r.gravOk}) ` +
      `Φ_g(y=-3000)=${r.phiTop.toFixed(4)}(期待${r.expectedPhiTop.toFixed(4)}) ` +
      `Φ_g(y=+3000)=${r.phiBot.toFixed(4)}(期待${r.expectedPhiBot.toFixed(4)}) Φ_g式一致=${phiOk} / ` +
      `🪐saturn(重力場なし): fieldWDisp≡Wat=${r.noGravSame}`);
  } else {
    console.log('SKIP field.uniform-gravity(対象に HP.fieldWDisp なし or ⚾projectile なし — 第37便 A4 未適用の root 等)');
  }
}

// ==================== 第37便 Wave D: 新サンプル4件 ====================
// 🕳️rotorSolo(原仮定者指示)/ 🌋agnjet・🕸️cosmicweb・☀️starcore(台帳4-68)。
// 対象(root)に該当プリセットが無い場合は各ブロック冒頭で SKIP する(beta 先行の段階導入)。

// ---- 7z12) D1: behavior.rotorSolo — ダークローター単体。「暗さ」の②自光の掻出(lightSweep="auto"
// ----      の実効値)と ③外来光線の掃き出し が別機構であることを、同一プリセット上の
// ----      スピン用量反応で機械固定する(DERIVATIONS §17 の分解表をサンプル1件に落とし込んだもの)。
// ----      光線の判定は tests/exp-darkrotor.mjs 実験A / tests/exp-darkness.mjs と同一
// ----      (x=-300 から +x へ dl=2.7 で 340步・終端半径<300 を「有限時間非脱出」とする)。
// ----      軽い(25粒子・ファン50本×3構成)ので QA_FAST でも実行する ----
{
  const hasRotorSolo = await page.evaluate(() => HP.allPresets().some(p => p.id === 'rotorSolo'));
  if (hasRotorSolo) {
    const r = await page.evaluate(() => {
      const s = HP.sim;
      const P = (spin) => { const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'rotorSolo')));
        p.bodies[0].spin = spin; return p; };
      const trace = (y0) => { let minR = Infinity;
        const t = HP.traceRay(s, -300, y0, 1, 0, 2.7, 340, (px, py) => {
          const rr = Math.hypot(px, py); if (rr < minR) minR = rr; });
        return { endR: Math.hypot(t.x, t.y), minR }; };
      const fan = () => { let cap = 0, n = 0, mrP = 0, mrR = 0;
        for (let y = 8; y <= 200; y += 8) { n++;
          const tp = trace(-y), tr = trace(y);      // y<0=順行側 / y>0=逆行側
          mrP += tp.minR; mrR += tr.minR;
          if (tp.endR < 300) cap++; if (tr.endR < 300) cap++; }
        return { rate: cap / (2 * n), minRpro: mrP / n, minRretro: mrR / n }; };
      const rays = (spin, Kt) => { const p = P(spin); if (Kt) p.physics.Kt = Kt;
        s.build(p); s.step(0.016);
        return Object.assign({ lS: s.lSw[0] }, fan()); };
      const totals = () => { let px = 0, py = 0, L = 0;
        for (let i = 0; i < s.n; i++) { px += s.m[i] * s.vx[i]; py += s.m[i] * s.vy[i];
          L += s.m[i] * (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) + 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i]; }
        return { px, py, L }; };
      const ringLz = () => { let lz = 0; for (let i = 1; i < s.n; i++) lz += s.x[i] * s.vy[i] - s.y[i] * s.vx[i];
        return lz / (s.n - 1); };
      const dyn = (spin) => { s.build(P(spin));
        const t0 = totals(); let acc = 0, cnt = 0, keep = 0;
        for (let k = 0; k < 6000; k++) { s.step(0.016); if ((k % 25) === 0) { acc += ringLz(); cnt++; } }
        for (let i = 1; i < s.n; i++) if (Math.hypot(s.x[i], s.y[i]) < 600) keep++;
        const t1 = totals();
        return { lzMean: acc / cnt, keep, nFree: s.n - 1, nan: s.hasNaN(),
          dP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / Math.max(1, Math.hypot(t0.px, t0.py)),
          dL: Math.abs(t1.L + s.resL - t0.L) / Math.max(1, Math.abs(t0.L)) }; };
      const out = { ctrl: rays(0), sat: rays(0.3), def: rays(2), lock: rays(2, 3600),
        dynDef: dyn(2), dynCtrl: dyn(0) };
      HP.loadPreset('saturn', false);
      return out;
    });
    // 実測(beta 2026-07-27・内蔵プリセットそのもの):
    //  spin      : 0     0.1   0.16  0.2   0.3   0.5   0.6   0.7   1.0   1.5   2.0   3.0
    //  ② lS_eff  : 0     0.351 0.561 0.702 1.00  1.00  1.00  1.00  1.00  1.00  1.00  1.00 (飽和 spin≈0.285)
    //  ③ 非脱出率: 0.66  0.72  0.74  0.72  0.72  0.72  0.70  0.08  0.02  0.00  0.00  0.00 (立上り 0.6→0.7)
    //  最小接近半径(spin2.0) 順行=123.4 逆行=40.4(対照は両側 34.6)/ Kt=3600 ロック: 非脱出 0.00
    //  リング平均L_z(6000步) 既定=954.10 / 対照=632.45(=初期値のまま厳密一定)→ 比 1.509
    //  帳簿込みの保存 |ΔP|/P₀=1.27e-4 |ΔL|/L₀=1.26e-4
    // 閾値: lS_eff>0.3(実測1.00=3.3倍上)/ 対照の非脱出>0.4(実測0.66=1.65倍上)/
    //       既定の非脱出<0.15(実測0.00)/ 飽和点(spin0.3)の非脱出≥対照×0.8(実測0.72 vs 0.528=1.36倍上)/
    //       順行/逆行の最小接近半径>2倍(実測3.06倍)/ L_z比>1.2(実測1.51)/ 保存<1e-3(実測1.3e-4=7.9倍下)
    const lzRatio = r.dynDef.lzMean / r.dynCtrl.lzMean;
    add('behavior.rotorSolo',
      !r.dynDef.nan && !r.dynCtrl.nan
      && r.dynDef.keep === r.dynDef.nFree && r.dynCtrl.keep === r.dynCtrl.nFree
      && r.def.lS > 0.3 && r.ctrl.lS === 0
      && r.ctrl.rate > 0.4 && r.def.rate < 0.15                    // ③ 掃き出しで捕捉が消える
      && r.sat.lS > 0.99 && r.sat.rate >= r.ctrl.rate * 0.8        // ②が飽和しても③はまだ起きない=別機構
      && r.def.minRpro > 2 * r.def.minRretro                       // 順行/逆行の非対称(T8 と同型)
      && r.lock.rate < 0.05                                        // 物理対応ロックで③消失(反証条件7)
      && lzRatio > 1.2 && Math.abs(r.dynCtrl.lzMean - 632.46) < 1  // 引きずりの順行汲み上げ
      && r.dynDef.dP < 1e-3 && r.dynDef.dL < 1e-3,                 // 閉鎖系の帳簿込み保存
      `②掻出 lS_eff: spin0=${r.ctrl.lS.toFixed(2)} spin0.3=${r.sat.lS.toFixed(2)} spin2=${r.def.lS.toFixed(2)}(>0.3) / ` +
      `③非脱出率(340步・終端r<300): 対照spin0=${r.ctrl.rate.toFixed(2)}(>0.4) spin0.3=${r.sat.rate.toFixed(2)}` +
      `(≥対照×0.8 — ②飽和でも③未発火=別機構) spin2=${r.def.rate.toFixed(2)}(<0.15) Kt3600ロック=${r.lock.rate.toFixed(2)}(<0.05) / ` +
      `最小接近半径 順行=${r.def.minRpro.toFixed(1)} 逆行=${r.def.minRretro.toFixed(1)}(>2倍) / ` +
      `リング平均L_z(6000步) 既定=${r.dynDef.lzMean.toFixed(1)} 対照=${r.dynCtrl.lzMean.toFixed(2)}` +
      `(比=${lzRatio.toFixed(2)}>1.2) 保持=${r.dynDef.keep}/${r.dynDef.nFree} / ` +
      `帳簿込み保存 |ΔP|/P₀=${r.dynDef.dP.toExponential(2)} |ΔL|/L₀=${r.dynDef.dL.toExponential(2)}(<1e-3)`);
  } else {
    console.log('SKIP behavior.rotorSolo(対象に 🕳️rotorSolo なし — 第37便 D1 未適用の root 等)');
  }
}

// ---- 50D) 第50便 50D(台帳4-88): ray.observer-flux — darkrotor 系の「暗さ」を観測面
// ----      (observer screen)の光束で実測する。論文2 §V が「観測面光束は未計装 — future work」
// ----      としていた測定を計装し、暗さ主張を観測者の位置で回復する(ChatGPT Major5)。
// ----      構成: rotorSolo(behavior.rotorSolo と同一の光線条件 x0=-300・dl=2.7)で、
// ----      x=+300 の鉛直スクリーンへの ①到達率 hitRate ②軸上光束 onAxisRate(|y|≤60 —
// ----      幾何基準は直進光で 14/50=0.28)③角度再配分(横断点 y の平均・横断方向角)を測る。
// ----      步数は 2000(340步は捕捉判定用の有限時間窓 — 観測面測定では非捕捉光線を
// ----      決着させるため延長。捕捉判定そのものは behavior.rotorSolo の 340步窓が正)。
// ----      判定: 物理対応ロック Kt=c²/G は明るい基準(到達率>0.95・軸上≥幾何基準×0.9)/
// ----      spin0(強場)は捕捉で暗い(軸上<0.1)/ spin2 は捕捉ゼロでも掃き出しの角度再配分で
// ----      暗い(軸上<0.2)+再配分は逆行側へ偏る(横断 y 平均>50・平均方向角>0.3rad)。
// ----      軽い(光線のみ・粒子時間発展なし)ので QA_FAST でも実行する ----
{
  const hasRotorSolo2 = await page.evaluate(() => HP.allPresets().some(p => p.id === 'rotorSolo') && !!HP.traceRay);
  if (hasRotorSolo2) {
    const r = await page.evaluate(() => {
      const s = HP.sim;
      const P = (spin) => { const q = JSON.parse(JSON.stringify(HP.allPresets().find(x => x.id === 'rotorSolo')));
        q.bodies[0].spin = spin; return q; };
      const SCREEN = 300, AXIS = 60, MAXS = 2000;
      const trace = (y0) => {
        let cross = null, exit = null;
        const t = HP.traceRay(s, -300, y0, 1, 0, 2.7, MAXS, (px, py) => {
          if (px >= SCREEN) { cross = { x: px, y: py }; return false; }
          if (px < -400 || Math.abs(py) > 800) { exit = { x: px, y: py }; return false; }
        });
        return { cross, exit, cx: t.cx, cy: t.cy };
      };
      const fan = () => {
        let n = 0, hit = 0, onAxis = 0, exitN = 0, orbit = 0; const ys = [], angs = [];
        for (let y = 8; y <= 200; y += 8) for (const sgn of [-1, 1]) { n++;
          const t = trace(sgn * y);
          if (t.cross) { hit++; ys.push(t.cross.y); angs.push(Math.atan2(t.cy, t.cx));
            if (Math.abs(t.cross.y) <= AXIS) onAxis++; }
          else if (t.exit) exitN++;
          else orbit++;   // MAXS 内に決着せず(周回捕捉)
        }
        const mean = (a) => a.length ? a.reduce((x, v) => x + v, 0) / a.length : 0;
        const meanAbs = (a) => a.length ? a.reduce((x, v) => x + Math.abs(v), 0) / a.length : 0;
        return { n, hitRate: hit / n, onAxisRate: onAxis / n, exitRate: exitN / n, orbitRate: orbit / n,
          meanY: mean(ys), meanAbsAngle: meanAbs(angs) };
      };
      const run = (spin, Kt) => { const q = P(spin); if (Kt) q.physics.Kt = Kt;
        s.build(q); s.step(0.016); return fan(); };
      return { base: 14 / 50, spin0: run(0), spin2: run(2), lock: run(2, 3600) };
    });
    // 実測(2026-07-30・beta): 幾何基準0.28 / ロック 到達1.00・軸上0.30(弱い収束で基準よりやや明るい)/
    // spin0 軸上0.04(基準の1/7 — 捕捉の暗さ・周回0.16)/ spin2 軸上0.12(捕捉ゼロでも掃き出しの
    // 再配分で暗い)・横断y平均+188.6(逆行側へ偏る)・平均方向角0.84rad
    add('ray.observer-flux',
      r.lock.hitRate > 0.95 && r.lock.onAxisRate >= r.base * 0.9
      && r.spin0.onAxisRate < 0.1
      && r.spin2.onAxisRate < 0.2 && r.spin2.orbitRate === 0
      && r.spin2.meanY > 50 && r.spin2.meanAbsAngle > 0.3,
      `幾何基準(直進光の軸上|y|≤60)=${r.base.toFixed(2)} / Kt=c²/G ロック: 到達=${r.lock.hitRate.toFixed(2)}(>0.95) ` +
      `軸上=${r.lock.onAxisRate.toFixed(2)}(≥基準×0.9 — 明るい基準) / spin0: 軸上=${r.spin0.onAxisRate.toFixed(2)}` +
      `(<0.1 — 捕捉の暗さ・周回=${r.spin0.orbitRate.toFixed(2)}) / spin2: 軸上=${r.spin2.onAxisRate.toFixed(2)}` +
      `(<0.2 — 捕捉ゼロでも角度再配分で暗い) 横断y平均=${r.spin2.meanY.toFixed(1)}(>50 — 逆行側へ偏る) ` +
      `平均方向角=${r.spin2.meanAbsAngle.toFixed(2)}rad(>0.3)`);
  } else {
    console.log('SKIP ray.observer-flux(対象に 🕳️rotorSolo または HP.traceRay なし)');
  }
}

// ---- 50E) 第50便 50E(台帳4-89): clamp.ledger-zero — 安全クランプ(速度100・スピン±40・
// ----      Hubble率±0.5)の発動回数帳簿 sim.clampVN/clampSN/clampHN。保存則主張の例外を
// ----      機械固定する(ChatGPT 4.12): ①配線検証 — 挑発構成(v=200/spin=50/sin箱 amp0.9
// ----      freq2)でそれぞれの帳簿が実際に増えること ②発動0回 — 保存則を主張する代表構成
// ----      (freebox 1200步=ゲート窓 / boxcomoving 2000步 / echo 2400步=反転後含む)で
// ----      3帳簿とも厳密0のままであること。クランプの規則そのものは1ビットも変えていない。
// ----      帳簿が無い対象(root v1.33 等)は SKIP。軽いので QA_FAST でも実行する ----
{
  const hasClampLedger = await page.evaluate(() => typeof HP.sim.clampVN === 'number');
  if (hasClampLedger) {
    const r = await page.evaluate(() => {
      const s = HP.sim;
      const mk = (bodies, extra) => Object.assign({ id: 'clamp_probe', name: 'clamp', description: 'p',
        camera: { scale: 100 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 0, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 300,
          cLight: 60, etaRad: 0, softening: 4, timeScale: 1 },
        bodies, overlays: {} }, extra || {});
      // ①配線検証(挑発構成 — 発動して帳簿が増えることの確認)
      s.build(mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 200, vy: 0, spin: 0, pinned: false }]));
      s.step(0.016);
      const vFired = s.clampVN;
      s.build(mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 50, pinned: false }]));
      s.step(0.016);
      const sFired = s.clampSN;
      s.build(mk([{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }],
        { universeBox: { mode: 'sin', H0: 0, D: 10, dPower: 1, L: 100, cx: 0, cy: 0, vx: 0, vy: 0,
          omega: 0, amp: 0.9, freq: 2, phase: 0 } }));
      s.step(0.016);
      const hFired = s.clampHN;
      // ②発動0回(保存則主張の代表構成)。build が帳簿をリセットすることも同時に確認される
      const zero = {};
      const runZero = (id, steps) => {
        if (!HP.allPresets().some((p) => p.id === id)) { zero[id] = null; return; }
        HP.loadPreset(id, false);
        for (let k = 0; k < steps; k++) s.step(0.016);
        zero[id] = s.clampVN + s.clampSN + s.clampHN;
      };
      runZero('freebox', 1200);
      runZero('boxcomoving', 2000);
      runZero('echo', 2400);
      HP.loadPreset(HP.allPresets()[0].id, false);   // 後続テストへ既定状態を返す
      return { vFired, sFired, hFired, zero };
    });
    const zs = Object.entries(r.zero).filter(([, v]) => v !== null);
    add('clamp.ledger-zero',
      r.vFired > 0 && r.sFired > 0 && r.hFired > 0 && zs.length >= 2 && zs.every(([, v]) => v === 0),
      `配線: 挑発構成で発動 速度=${r.vFired} スピン=${r.sFired} H=${r.hFired}(各>0) / ` +
      `発動0回: ${zs.map(([k, v]) => `${k}=${v}`).join(' ')}(保存則主張の代表構成で全帳簿が厳密0)`);
  } else {
    console.log('SKIP clamp.ledger-zero(対象にクランプ帳簿 sim.clampVN なし — 第50便 50E 未適用の root 等)');
  }
}

// ---- 7z13) D2: behavior.agnjet — 円盤の内縁で摩擦加熱されたガスが、抵抗の少ない極方向(±y)へ
// ----      抜けて双極の噴出になる(圧力 E5′ + 幾何 の 2D アナロジー)。
// ----      判定量: 内縁(初期 |x|≤80)起源のガスのうち 4000步後に r>300 へ出たものの方位が
// ----      ±y から30°以内に入る割合。等方なら 1/3 なので、その2倍(=2/3)を要求する。
// ----      A/B 対照は kRep=0(熱の斥力を切る)。重いので W5c ユニット(!FAST)----
{
  if (!FAST && w5cHasAgnjet) {
    const r = await w5cGetUnit('agnjet');
    const d = r.jetDef, c = r.jetCtrl;
    const ratio = c.frac > 0 ? d.frac / c.frac : Infinity;
    // 実測(beta 2026-07-27・内蔵プリセットそのもの。1000步ごと・内縁起源 37 粒子中):
    //   步数        1000  2000  3000  4000  5000  6000
    //   既定 kRep=2  —    0.895 0.815 0.839 0.758 0.758(極/赤道 4000步で 26/0)
    //   対照 kRep=0  —    0.583 0.526 0.542 0.560 0.560
    //   全ガスで測っても 4000步 0.689(等方の 2.07 倍)/ 対照 0.483
    // 閾値: 極方向割合 ≥ 2/3(=等方 1/3 の2倍。実測 0.839 = 1.26倍の余裕。窓 2000〜6000步 の
    //       最小 0.758 でも 1.14倍上)/ 対照比 ≥ 1.25(実測 1.55)/ 脱出数 ≥ 20(実測 31)
    add('behavior.agnjet',
      !d.nan && !c.nan && d.tot >= 20 && d.frac >= 2 / 3 && ratio >= 1.25,
      `4000步・内縁(初期|x|≤80)起源で r>300 へ出たガス: 既定(kRep=2) ${d.tot}個中 極方向(±y±30°)=${d.pol} ` +
      `赤道方向(±x±30°)=${d.eq} → 割合=${d.frac.toFixed(3)}(等方=1/3 の ${(d.frac * 3).toFixed(2)}倍・閾値 2/3) / ` +
      `対照(kRep=0) ${c.tot}個中 極=${c.pol} 赤道=${c.eq} → 割合=${c.frac.toFixed(3)}(比=${ratio.toFixed(2)}倍 ≥1.25)`);
  } else {
    console.log('SKIP behavior.agnjet(QA_FAST=1 または対象に 🌋agnjet なし — 第37便 D2 未適用の root 等)');
  }
}

// ---- 7z13b) 第39便 39A(台帳4-74): behavior.spinup — 圧力を切った自己重力雲が縮み、内側半質量
// ----      (コア)の回転が ω ∝ 1/R² に沿って速くなる。外部駆動ゼロの完全閉鎖系なので、
// ----      リザーバ帳簿が全ゼロのまま L_z が閉じることも同時に機械証明する ----
{
  if (!FAST && w5cHasSpinup) {
    const r = await w5cGetUnit('spinup');
    const shrink = r.m0.Rc / r.m1.Rc;              // コア半径の収縮率 R₀/R
    const omX = r.m1.omC / r.m0.omC;               // ω_core の倍率(実測)
    const pred = shrink * shrink;                  // 角運動量保存の予測 (R₀/R)²
    const agree = omX / pred;                      // 一致率(≡ L_c/L_c0 — 恒等)
    const ledgerZero = r.ledger[0] === 0 && r.ledger[1] === 0 && r.ledger[2] === 0 && r.ledger[4] === 0;
    // 実測(beta・内蔵プリセットそのもの・seed 20260728 固定で決定論・6000步。tests/exp-4-74.mjs):
    //   R_core 76.25→25.26(収縮 3.019倍)・ω_core 6.745e-3→5.708e-2(×8.462)・
    //   予測(R₀/R)²=9.112 → 一致 92.86%(= L_c/L_c0。ずれは恒等的にコアが失った L の割合)・
    //   帳簿[resPx,resPy,resL]=[0,0,0]・radL=0・|ΔP|/pScale=2.34e-7・|ΔL|/L_scale=1.70e-7・
    //   |ω·I−L_orb|/|L_orb|=0・T_mean 2.00→3.03・r<150 の粒子 228/240・NaN なし。
    // 閾値(統括承認): 収縮≥2.9(実測3.019・余裕1.04倍)/ ω倍率≥6.5(実測8.462・1.30倍)/
    //   一致≥75%(実測92.9%・1.24倍)/ |ΔL|/L_scale<1e-3(実測1.7e-7 = 5900倍の余裕)/
    //   帳簿ゼロ / NaN なし。
    // **閾値の根拠と限界(そのまま記録)**: これらは「内蔵の固定 seed に対する回帰検出」の閾値であって
    //   seed 頑健ではない。同構成を3 seed(20260728/29/30)で走らせた 6000步の実測は
    //   収縮 3.019/2.988/2.924・ω倍率 8.462/6.414/6.672・一致 92.9/71.8/78.0% で、
    //   seed 20260729 は ω倍率・一致率の閾値を下回る。N=240 の自己重力系の緩和ゆらぎが大きいことは
    //   第38便 38C が既に記録している(台帳4-68c §4.3)。本サンプルは seed を固定した有限時間デモで
    //   あり、QA は「この固定 seed の軌道が変わっていないこと」を見る回帰テストとして機能する。
    add('behavior.spinup',
      !r.nan && r.thermal === 'tint' && ledgerZero && r.relL < 1e-3
      && shrink >= 2.9 && omX >= 6.5 && agree >= 0.75,
      `6000步(t≈96・seed固定で決定論) コア半径 R_core ${r.m0.Rc.toFixed(2)}→${r.m1.Rc.toFixed(2)}` +
      `(収縮 ${shrink.toFixed(3)}倍 ≥2.9) ω_core ${r.m0.omC.toExponential(3)}→${r.m1.omC.toExponential(3)}` +
      `(×${omX.toFixed(3)} ≥6.5) 予測(R₀/R)²=×${pred.toFixed(3)} → 一致=${(agree * 100).toFixed(2)}%(≥75%` +
      ` — ずれは恒等的にコアが外へ渡した軌道角運動量の割合 L_c/L_c0=${(r.m1.Lc / r.m0.Lc).toFixed(4)}) ` +
      `R_half ${r.m0.Rhalf.toFixed(1)}→${r.m1.Rhalf.toFixed(1)} コア粒子=${r.m1.nc}/${r.m1.n} ` +
      `T_mean ${r.m0.Tmean.toFixed(2)}→${r.m1.Tmean.toFixed(2)} 放射E=${r.ledger[3].toFixed(1)} ` +
      `r<150 の粒子=${r.m1.keepR0}/${r.m1.n} 温度モード=${r.thermal} ` +
      `/ 保存則: 帳簿[resPx,resPy,resL]=[${r.ledger.slice(0, 3).join(',')}]・放射L=${r.ledger[4]}` +
      `(全ゼロ=${ledgerZero}: 外部駆動ゼロの完全閉鎖系の機械証明) L_z ${r.Lz0.toFixed(4)}→${r.Lz1.toFixed(4)} ` +
      `|ΔP|/pScale=${r.relP.toExponential(2)} |ΔL|/L_scale=${r.relL.toExponential(2)}(<1e-3) ` +
      `|ω·I−L_orb|/|L_orb|=${r.m1.idOm.toExponential(1)} NaN=${r.nan} ` +
      `/ 全体の ω_eff は ×${(r.m1.omEff / r.m0.omEff).toFixed(3)}(6000步時点。24000步では逃走粒子が ` +
      `Σmr² を支配して ×0.275 まで下がる — 主張は必ずコア限定で読むこと) ` +
      `/ 第39便 39A の較正実測 = 25.26/8.462/92.86%/1.70e-7(3seed の幅は 2.924〜3.019・` +
      `6.414〜8.462・71.8〜92.9% — 上のコメントの「閾値の根拠と限界」を参照)`);
  } else {
    console.log('SKIP behavior.spinup(QA_FAST=1 または対象に 🌪️spinup なし — 第39便 39A 未適用の root 等)');
  }
}

// ---- 7z13c) 第46便 46S(台帳4-68c 再挑戦・原仮定者裁定「進める」): behavior.starcore ----
// ---- ☀️starcore は「重力収縮 → 融合加熱 → 放射」を1画面で示すサンプル。熱を作る経路を融合だけに
// ----   絞ってある(γn=0・μF=0 で接触は完全弾性・kRep=0 で圧力なし・κs=0 で伝導なし)ので、
// ----   熱の出入りは「融合で入る Q」と「E11 で出る radE」の2本だけになり、帳簿が閉じる。
// ----   本テストは説明文の主張を**そのまま数値判定**する(claims の testId もここを指す):
// ----     ① 融合が起きて燃料が減る(fusN・残ガス数)
// ----     ② 温度が上がって保たれる(T_mean)
// ----     ③ 融合を切った対照より放射エネルギーが桁で大きい(radE 比)= 第37便 D の否定的結論の裏返し
// ----     ④ 融合が入れた熱 Q=ΔH+radE の大半が同じ窓で放射される(準定常)・対照では Q≡0
// ----     ⑤ 温度は力に一切入らない(etaRad=0 にしても軌道が bit 一致)
// ----     ⑥ 第一法則(KE+熱−重力+E9ばね+U_rep+radE+fusU+wallKE)が丸め水準で閉じる
// ----   決定論(seed 20260730 固定)。QA_FAST でも実行する(第46便 46S の完遂条件) ----
{
  if (hasStarcore) {
    const r = await page.evaluate(() => {
      const S = HP.sim;
      const P = HP.allPresets().find((p) => p.id === 'starcore');
      // 第一法則の物差しは fusion.* / exp-45-* と同一式 + 円境界の wallKE(反発係数<1 で壁に吸われた分)
      const energy = () => {
        const G = S.params.G, eps2 = S.params.softening * S.params.softening, C = S.params.cHeat;
        let E = 0;
        for (let i = 0; i < S.n; i++) {
          E += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
          E += 0.25 * S.m[i] * S.R[i] * S.R[i] * S.spin[i] * S.spin[i];
          E += C * S.m[i] * S.Tint[i];
        }
        for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) {
          const dx = S.x[i] - S.x[j], dy = S.y[i] - S.y[j], d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
          E -= G * S.m[i] * S.m[j] / Math.sqrt(d2 + eps2);
          const sumR = S.R[i] + S.R[j];
          if (d < sumR) {
            const muM = S.m[i] * S.m[j] / (S.m[i] + S.m[j]);
            const maxInv = Math.max(1 / S.m[i], 1 / S.m[j]);
            const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
            E += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC);
          }
        }
        // 第47便 47A(台帳4-86): pinned 熱浴のリザーバ pinHeat も保持量に加える(案B)。
        // ☀️starcore は κs=0(46S がこの帳簿漏れを避けるために選んだ構成)なので pinHeat≡0
        return E + HP.urepEnergy(S) + S.radE + S.fusU + S.wallKE + (S.pinHeat || 0);
      };
      const escale = () => {
        const G = S.params.G, eps2 = S.params.softening * S.params.softening, C = S.params.cHeat;
        let A = 0;
        for (let i = 0; i < S.n; i++) A += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]) + C * S.m[i] * S.Tint[i];
        for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) {
          const dx = S.x[i] - S.x[j], dy = S.y[i] - S.y[j], d2 = dx * dx + dy * dy;
          A += G * S.m[i] * S.m[j] / Math.sqrt(d2 + eps2);
        }
        return A + Math.abs(S.radE) + Math.abs(S.fusU) + Math.abs(S.wallKE);
      };
      const stats = () => {
        let Tm = 0, Tmax = 0, rr = 0, nG = 0, H = 0, mass = 0;
        const C = S.params.cHeat;
        for (let i = 0; i < S.n; i++) {
          const T = S.Tint[i];
          if (!S.pinned[i]) { Tm += T; nG++; rr += Math.hypot(S.x[i], S.y[i]); }
          if (T > Tmax) Tmax = T;
          H += C * S.m[i] * T; mass += S.m[i];
        }
        return { n: S.n, nG, T: nG ? Tm / nG : 0, Tmax, rMean: nG ? rr / nG : 0, H, mass,
          fusN: S.fusN, radE: S.radE, fusU: S.fusU, wallKE: S.wallKE };
      };
      const run = (patch, steps, dropFusion, ckEvery) => {
        const p = JSON.parse(JSON.stringify(P));
        if (patch) Object.assign(p.physics, patch);
        if (dropFusion) delete p.fusion;
        S.build(p);
        const s0 = stats(), E0 = energy();
        const ck = [];
        for (let k = 0; k < steps; k++) {
          S.step(0.016);
          // bit 一致の照合キー: 粒子数・融合回数・平均半径(ガスのみ・小数6桁)
          if (ckEvery && (k + 1) % ckEvery === 0) ck.push([S.n, S.fusN, stats().rMean.toFixed(6)]);
        }
        return { s0, s1: stats(), E0, E1: energy(), sc: escale(), ck, nan: S.hasNaN() };
      };
      HP.loadPreset('starcore', false);   // 正規経路で1回読む(currentPreset 同期)
      const main = run(null, 12000);          // 既定(t≈192 = validT)
      const ctrl = run(null, 12000, true);    // 対照: 同一初期配置で融合だけ切る
      const a6 = run(null, 6000, false, 500);            // etaRad 既定
      const b6 = run({ etaRad: 0 }, 6000, false, 500);   // 対照: 放射を切っても軌道は変わらないはず
      return { main, ctrl, ckN: a6.ck.length,
        bitSame: JSON.stringify(a6.ck) === JSON.stringify(b6.ck),
        thermal: S.thermal, dFrac: P.fusion ? P.fusion.dFrac : null,
        hasFission: !!(P.fusion && P.fusion.fission), validT: P.validT,
        psi: HP.strongFieldPsi(P), cls: HP.classifyPreset(P) };
    });
    const m = r.main, c = r.ctrl;
    const Q = m.s1.H - m.s0.H + m.s1.radE;         // 融合が入れた熱(帳簿が閉じるので etaRad に依らない)
    const Qc = c.s1.H - c.s0.H + c.s1.radE;        // 対照は熱源が無いので厳密に 0
    const radFrac = Q > 0 ? m.s1.radE / Q : 0;     // そのうち窓内に放射で出た割合
    const ratio = c.s1.radE > 0 ? m.s1.radE / c.s1.radE : Infinity;
    const relE = Math.abs(m.E1 - m.E0) / m.sc;
    const massOk = Math.abs(m.s1.mass - m.s0.mass) < 1e-3 * m.s0.mass;   // 融合は質量保存
    // 実測(beta・内蔵プリセットそのもの・seed 20260730 固定で決定論・12000步=t≈192。46S):
    //   融合124回 / ガス 200→76粒 / T_mean 2.000→4.911(最高66.93)/ radE=4554.6 /
    //   Q=ΔH+radE=5312.5(etaRad=0 でも同値 = 帳簿が閉じている)/ radE/Q=85.7% /
    //   fusU=−1827.3 / wallKE=40.5 / |ΔE|/scale=2.0e-3 / NaN なし。
    //   対照(融合だけ切る): T_mean 2.000→0.491・radE=60.4・Q=−0.0(厳密)→ radE 比 75.46倍。
    //   etaRad=0 の 6000步 12点 [n,fusN,rMean] は既定と完全一致(温度は力に入らない)。
    // 閾値: 融合≥90回(実測124・dt 1/2・1/4 で 122/113・3seed で 116/114 = 余裕1.27倍)/
    //   残ガス 40〜130粒(実測76)/ T_mean 3.0〜9.0(実測4.911・dt 収束 3.73〜4.91)/
    //   radE 比≥40(実測75.46・dt 収束 67.1〜83.8)/ radE/Q 0.70〜1.00(実測0.857)/
    //   |Qc|<0.01(対照の熱源ゼロ)/ |ΔE|/scale<1e-2(実測2.0e-3 = 5倍の余裕)/ bit 一致 / NaN なし。
    // **閾値の性格**: 固定 seed の軌道に対する回帰検出であって seed 頑健性の主張ではない
    //   (3seed の実測幅は上のコメントのとおりで、いずれも閾値の内側)。
    add('behavior.starcore',
      !m.nan && !c.nan && r.thermal === 'tint' && r.dFrac === 0.35 && !r.hasFission && r.validT === 192
      && massOk && r.bitSame && r.ckN === 12
      && m.s1.fusN >= 90 && m.s1.nG >= 40 && m.s1.nG <= 130
      && m.s1.T >= 3.0 && m.s1.T <= 9.0
      && ratio >= 40 && radFrac >= 0.70 && radFrac <= 1.0
      && Math.abs(Qc) < 0.01 && relE < 1e-2,
      `12000步(t≈192=validT・seed固定で決定論) 融合=${m.s1.fusN}回(≥90) ガス ${m.s0.nG}→${m.s1.nG}粒` +
      `(燃料消費 ${((1 - m.s1.nG / m.s0.nG) * 100).toFixed(1)}%・窓40〜130) T_mean ${m.s0.T.toFixed(3)}→${m.s1.T.toFixed(3)}` +
      `(窓3.0〜9.0・最高${m.s1.Tmax.toFixed(2)}) radE=${m.s1.radE.toFixed(1)} / ` +
      `対照(融合だけ切る): T_mean ${c.s0.T.toFixed(3)}→${c.s1.T.toFixed(3)} radE=${c.s1.radE.toFixed(1)} ` +
      `→ **放射エネルギー比=${ratio.toFixed(2)}倍**(≥40) / 熱収支: 融合が入れた熱 Q=ΔH+radE=${Q.toFixed(1)}・` +
      `そのうち放射で出た割合=${(radFrac * 100).toFixed(1)}%(窓70〜100%)・対照の Q=${Qc.toFixed(4)}(≈0 = 熱源なし) / ` +
      `etaRad=0 対照との bit 一致(6000步 ${r.ckN}点の [n,fusN,rMean])=${r.bitSame}(温度は力に一切入らない) / ` +
      `保存: 質量 ${m.s0.mass.toFixed(1)}→${m.s1.mass.toFixed(1)}(融合は質量保存=${massOk})・` +
      `fusU=${m.s1.fusU.toFixed(1)}・wallKE=${m.s1.wallKE.toFixed(1)}・|ΔE|/scale=${relE.toExponential(2)}(<1e-2) ` +
      `NaN=${m.nan || c.nan} / バッジ: 分類=${r.cls.layers.join('+')}・温度モード=${r.thermal}・` +
      `閉鎖系=${r.cls.closed}(中心核が pinned なので false)・ψ_static=${r.psi.toFixed(4)}` +
      `(強場バッジ=${r.cls.strongField} — 0.5 未満なので付かない) / ` +
      `46S の較正実測 = 124回/76粒/4.911/4554.6/75.46倍/85.7%/2.0e-3`);
  } else {
    console.log('SKIP behavior.starcore(対象に ☀️starcore なし — 第46便 46S 未適用の root 等)');
  }
}

// ---- 82B) 第82便B(創発の推進): behavior.selfrotor — 🥚selfRotor(自己形成ダークローター)。
// ----   「目標形状を初期条件に埋め込まず、局所則から構造が生成される」ことをノックアウト対照
// ----   つきで機械固定する。本則(9000步=validT)+対照2本(融合オフ / コア種なし)を走らせ、
// ----   claims の5窓(最大天体の質量比・J_core の継承個数・中心と周囲の実効減光・
// ----   継承則の総和恒等式)をそのまま判定に使う。決定論(seed 20260806 固定)。
// ----   軽量寄り(180粒→25体・9000步×3構成)なので QA_FAST=1 でも実行する。
// ----   実測ハーネスは tests/exp-4-84.mjs(3seed・G/Kt/dFrac 用量反応つき)----
{
  const hasSR = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'selfRotor'));
  if (hasSR) {
    const r = await page.evaluate(() => {
      const S = HP.sim;
      const P = HP.allPresets().find((p) => p.id === 'selfRotor');
      const meas = () => {
        let bi = 0, mTot = 0;
        for (let i = 0; i < S.n; i++) { mTot += Math.abs(S.m[i]); if (Math.abs(S.m[i]) > Math.abs(S.m[bi])) bi = i; }
        const cs = HP.coreState(bi);
        const G = S.params.G, MB = Math.abs(S.m[bi]);
        let bound = 0, lswH = 0, nH = 0, jSum = 0;
        for (let i = 0; i < S.n; i++) {
          const c2 = HP.coreState(i); if (c2) jSum += c2.J;
          if (i === bi) continue;
          const dx = S.x[i] - S.x[bi], dy = S.y[i] - S.y[bi];
          const dvx = S.vx[i] - S.vx[bi], dvy = S.vy[i] - S.vy[bi];
          const rr = Math.hypot(dx, dy);
          if (0.5 * (dvx * dvx + dvy * dvy) - G * MB / Math.max(rr, 1) < 0) bound++;
          lswH += S.lSw[i]; nH++;
        }
        return { n: S.n, fusN: S.fusN, mMax: MB, mFrac: MB / mTot, spin: S.spin[bi], R: S.R[bi],
          lSw: S.lSw[bi], lSwHalo: nH ? lswH / nH : 0, Jc: cs ? cs.J : 0, JcSum: jSum,
          bound: bound / Math.max(1, nH), em: HP.emergenceStats(S) };
      };
      const run = (mod, steps) => {
        const p = JSON.parse(JSON.stringify(P));
        if (mod.noFuse) delete p.fusion;
        if (mod.noCore) delete p.bodies[0].core;
        S.build(p);
        const c0 = HP.coreState(0);
        const jSeed = c0 ? c0.J : 0, mSeed = Math.abs(S.m[0]);
        const t0 = S.totals(), L0 = t0.L + S.resL + S.radL;
        const em0 = HP.emergenceStats(S), lsw0 = S.lSw[0];
        for (let k = 0; k < steps; k++) S.step(0.016);
        const t1 = S.totals(), L1 = t1.L + S.resL + S.radL;
        let lScale = 0;
        for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
          + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
        const m1 = meas();
        return Object.assign(m1, { jSeed, mSeed, lsw0, align0: em0.align, K0: em0.nCluster,
          relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), nan: S.hasNaN(),
          clampV: S.clampVN, clampR: S.clampRN || 0 });
      };
      HP.loadPreset('selfRotor', false);   // 正規経路で1回読む(currentPreset 同期)
      const main = run({}, 9000);
      const noFuse = run({ noFuse: true }, 9000);
      const noCore = run({ noCore: true }, 9000);
      const cl = {}; for (const c of P.claims) cl[c.id] = c;
      return { main, noFuse, noCore, claims: cl, validT: P.validT,
        dFrac: P.fusion ? P.fusion.dFrac : null, thermal: P.thermal,
        balance: P.balanceFrame, emergence: P.emergence,
        cls: HP.classifyPreset(P), n0: P.bodies[0].n };
    });
    const m = r.main, nf = r.noFuse, nc = r.noCore;
    const inW = (v, c) => c && v >= c.expected.min && v <= c.expected.max;
    const inC = (v, c) => c && c.control && v >= c.control.expected.min && v <= c.control.expected.max;
    const seeds = m.jSeed > 0 ? m.Jc / m.jSeed : 0;             // 中心天体が飲み込んだ「種の個数」
    const massSeeds = m.mSeed > 0 ? m.mMax / m.mSeed : 0;       // 同じものを質量で数えた値
    const idRatio = massSeeds > 0 ? seeds / massSeeds : 0;      // 継承則の総和恒等式(=1)
    const C = r.claims;
    // 実測(beta・内蔵プリセットそのもの・seed 20260806 固定で決定論・9000步=t144。第82便B):
    //   本則: 180粒→25体・融合155回・最大天体 m=48(質量比26.7%)・殻スピン0.351・R=6.93・
    //     lS_eff 中心0.589 / 周囲平均0.159・J_core=0.0960(=種48個ぶん=質量48)・ΣJ_core=0.3600・
    //     束縛率0.75・創発モニタ 塊166→2・整列度0.000→1.000・V/σ=10.90・|ΔL|/L=1.8e-7
    //   対照①融合オフ: 最大天体 質量比0.56%(=1/180)・束縛率0.14(中心天体が育たない)
    //   対照②コア種なし: J_core=0.0000・ΣJ_core=0.0000(継承以外の生成経路が無い)
    //   3seed(20260806/07/08): 質量比 18.3/30.0/26.7% ・中心減光 0.472〜0.589・J_core 0.0660〜0.1080
    // 判定は claims の窓そのもの(claims.sync が説明文との一致を別途固定する)+ 帳簿・NaN・clamp。
    add('behavior.selfrotor',
      !m.nan && !nf.nan && !nc.nan && m.clampV === 0 && m.clampR === 0
      && r.validT === 144 && r.dFrac === 0.7 && r.thermal === 'tint'
      && r.balance === 'barycentric' && r.emergence === 'E3' && r.cls.closed === true   // 第83便A: E2→E3
      && m.lsw0 === 0 && m.align0 === 0 && m.K0 > 100
      && inW(m.mFrac, C['selfRotor.max-mass-fraction'])
      && inC(nf.mFrac, C['selfRotor.max-mass-fraction'])
      && inW(seeds, C['selfRotor.core-J-inherited'])
      && inC(nc.Jc, C['selfRotor.core-J-inherited'])
      && inW(m.lSw, C['selfRotor.center-dimming'])
      && inW(m.lSwHalo, C['selfRotor.halo-dimming'])
      && inW(idRatio, C['selfRotor.core-J-counts-mass'])
      && Math.abs(m.JcSum - r.n0 * m.jSeed) < 1e-6 && nc.JcSum === 0
      && m.relL < 1e-4,
      `9000步(t=144=validT・seed固定で決定論) 生成: ${r.n0}粒→${m.n}体(融合${m.fusN}回) ` +
      `最大天体 m=${m.mMax.toFixed(0)}・**質量比=${(m.mFrac * 100).toFixed(1)}%**` +
      `(窓${C['selfRotor.max-mass-fraction'].expected.min}〜${C['selfRotor.max-mass-fraction'].expected.max}) ` +
      `殻スピン=${m.spin.toFixed(3)} R=${m.R.toFixed(2)} 束縛率=${m.bound.toFixed(2)} / ` +
      `対照①融合オフ: 質量比=${(nf.mFrac * 100).toFixed(2)}%(=1/${r.n0}・束縛率${nf.bound.toFixed(2)}) ` +
      `→ 中心天体は初期条件ではなく融合則の生成物 / ` +
      `J_core 継承: 中心天体 J_core=${m.Jc.toFixed(4)}=**種${seeds.toFixed(1)}個ぶん**` +
      `(窓${C['selfRotor.core-J-inherited'].expected.min}〜${C['selfRotor.core-J-inherited'].expected.max})・` +
      `質量で数えた個数=${massSeeds.toFixed(1)} → 総和恒等式 J/J_seed ÷ m/m_seed=${idRatio.toFixed(6)}(=1) ・` +
      `ΣJ_core=${m.JcSum.toFixed(4)}(=${r.n0}×${m.jSeed.toFixed(4)} 不変) / ` +
      `対照②コア種なし: J_core=${nc.Jc.toFixed(4)} ΣJ_core=${nc.JcSum.toFixed(4)}(継承以外の生成経路なし) / ` +
      `暗さの生成: lS_eff t=0 で ${m.lsw0.toFixed(3)} → 中心=${m.lSw.toFixed(3)}` +
      `(窓${C['selfRotor.center-dimming'].expected.min}〜${C['selfRotor.center-dimming'].expected.max})・` +
      `周囲平均=${m.lSwHalo.toFixed(3)}(窓${C['selfRotor.halo-dimming'].expected.min}〜${C['selfRotor.halo-dimming'].expected.max})` +
      `= コントラスト${(m.lSw / Math.max(m.lSwHalo, 1e-9)).toFixed(2)}倍 ` +
      `※対照①では周囲も${nf.lSwHalo.toFixed(3)}まで暗い(暗さ単独では融合の有無を判別しない) / ` +
      `創発モニタ: 塊 ${m.K0}→${m.em.nCluster}・最大塊質量比=${m.em.maxFrac.toFixed(3)}・` +
      `スピン整列度 ${m.align0.toFixed(3)}→${m.em.align.toFixed(3)}・V/σ=${m.em.vsig.toFixed(2)} / ` +
      `保存: |ΔL|/L_scale=${m.relL.toExponential(2)}(<1e-4) clamp=${m.clampV}/${m.clampR} NaN=${m.nan} / ` +
      `バッジ: 閉鎖系=${r.cls.closed}・E水準=${r.emergence}・分類=${r.cls.sampleClass} / ` +
      `第82便B の較正実測 = 25体/155回/26.7%/0.589/0.159/種48個/対照0.56%・J=0`);
  } else {
    console.log('SKIP behavior.selfrotor(対象に 🥚selfRotor なし — 第82便B 未適用の root 等)');
  }
}

// ---- 83A) 第83便A(創発の標準試験化): behavior.selfrotor-multiseed — 🥚selfRotor の
// ----   **多seed頑健性**(E3 の要件)を機械固定する。第82便B の behavior.selfrotor が
// ----   「固定seed 1本+ノックアウト対照」を見るのに対し、こちらは seed を振って
// ----   「乱数の引きが変わっても同じ現象が立つ」ことを claims の窓で判定する。
// ----   **QA は縮約版・exp 側が全数の正本**という既存の kind:"multi-seed" の流儀に合わせる
// ----   (galaxy.outer-boost-ratio: QA claim.galaxy-outerboost は固定seedの A/B 1組で、
// ----    5seed の統計は tests/exp-scale66.mjs 側が持つ)。ここでは QA を先頭4seed
// ----   (20260806〜20260809)に絞り、16seed の分布そのものは tests/exp-4-85.mjs
// ----   (→ tests/out/exp-4-85.json)が正本として持つ。
// ----   判定量は「seed 集合を通した最大天体の質量比の**最小値**」= claims の
// ----   selfRotor.multi-seed-min-mass-fraction の窓(0.10〜0.60)。対照(融合オフ)は
// ----   融合が無ければ質量が動かないので全seedで厳密に 1/180=0.5556% になることも固定する。
// ----   **重い(9000步 × 8構成)ので QA_FAST=1 では実行しない**(FAST への時間増はゼロ)----
if (!FAST) {
  const hasSR2 = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'selfRotor'
    && Array.isArray(p.claims) && p.claims.some((c) => c.id === 'selfRotor.multi-seed-min-mass-fraction')));
  if (hasSR2) {
    const r = await page.evaluate((seeds) => {
      const S = HP.sim;
      const P = HP.allPresets().find((p) => p.id === 'selfRotor');
      const run = (seed, noFuse, steps) => {
        const p = JSON.parse(JSON.stringify(P));
        if (noFuse) delete p.fusion;
        p.seed = seed;
        const v = HP.validatePreset(p);
        if (!v.ok) return { err: v.errors };
        S.build(v.preset);
        for (let k = 0; k < steps; k++) S.step(0.016);
        let bi = 0, mTot = 0;
        for (let i = 0; i < S.n; i++) { mTot += Math.abs(S.m[i]); if (Math.abs(S.m[i]) > Math.abs(S.m[bi])) bi = i; }
        const em = HP.emergenceStats(S);
        let lswH = 0, nH = 0;
        for (let i = 0; i < S.n; i++) if (i !== bi) { lswH += S.lSw[i]; nH++; }
        return { seed, n: S.n, fusN: S.fusN, mFrac: Math.abs(S.m[bi]) / mTot,
          maxFrac: em.maxFrac, align: em.align, vsig: em.vsig,
          lSw: S.lSw[bi], lSwHalo: nH ? lswH / nH : 0, nan: S.hasNaN(),
          clampV: S.clampVN, clampR: S.clampRN || 0 };
      };
      const main = seeds.map((sd) => run(sd, false, 9000));
      const ctl = seeds.map((sd) => run(sd, true, 9000));
      HP.loadPreset('selfRotor', false);
      const cl = P.claims.find((c) => c.id === 'selfRotor.multi-seed-min-mass-fraction');
      return { main, ctl, claim: cl, n0: P.bodies[0].n, emergence: P.emergence };
    }, [20260806, 20260807, 20260808, 20260809]);
    const C = r.claim;
    const mFracs = r.main.map((v) => v.mFrac);
    const minMF = Math.min(...mFracs), maxMF = Math.max(...mFracs);
    const ctlMF = r.ctl.map((v) => v.mFrac);
    const ctlMed = [...ctlMF].sort((a, b) => a - b)[Math.floor(ctlMF.length / 2)];
    // 減光コントラスト(中心/周囲)— 第83便A の16seedで本則2.41〜5.30・対照0.40〜1.26 と重ならない
    const con = r.main.map((v) => v.lSw / Math.max(v.lSwHalo, 1e-9));
    const conC = r.ctl.map((v) => v.lSw / Math.max(v.lSwHalo, 1e-9));
    // 実測(beta・第83便A・16seed 20260806〜20260821・9000步=validT):
    //   質量比 18.3〜53.3%(中央34.7%)・最大塊 0.972〜1.000・整列度 0.985〜1.000・
    //   V/σ 3.1〜20.8・中心減光 0.472〜0.919・周囲 0.126〜0.235・コントラスト 2.41〜5.30
    //   対照(融合オフ)は全seed で質量比 0.5556%(=1/180 厳密)・コントラスト 0.40〜1.26
    //   → 本則の最小 18.3% は対照中央値の 33.0 倍(統括の判定基準①「10倍超」を満たす)
    add('behavior.selfrotor-multiseed',
      r.emergence === 'E3'
      && r.main.every((v) => !v.nan && v.clampV === 0 && v.clampR === 0)
      && r.ctl.every((v) => !v.nan)
      && minMF >= C.expected.min && maxMF <= C.expected.max
      && ctlMF.every((v) => Math.abs(v - 1 / r.n0) < 1e-12)
      && ctlMed >= C.control.expected.min && ctlMed <= C.control.expected.max
      && minMF > 10 * ctlMed
      && r.main.every((v) => v.maxFrac >= 0.9 && v.align >= 0.9)
      && Math.min(...con) > Math.max(...conC),
      `${r.main.length}seed(${r.main.map((v) => v.seed).join('/')}・9000步=validT) 最大天体の質量比 ` +
      `${r.main.map((v) => (v.mFrac * 100).toFixed(1) + '%').join('/')} → **最小=${(minMF * 100).toFixed(1)}%**` +
      `(claim 窓 ${C.expected.min * 100}〜${C.expected.max * 100}%) / ` +
      `対照(融合オフ)は全seed ${(ctlMed * 100).toFixed(4)}%(=1/${r.n0} 厳密 — 融合が無ければ質量は動かない) ` +
      `→ 比=${(minMF / ctlMed).toFixed(1)}倍(>10) / ` +
      `秩序変数: 最大塊 ${r.main.map((v) => v.maxFrac.toFixed(3)).join('/')}(≥0.9) ` +
      `整列度 ${r.main.map((v) => v.align.toFixed(3)).join('/')}(≥0.9) ` +
      `V/σ ${r.main.map((v) => v.vsig.toFixed(1)).join('/')} / ` +
      `減光コントラスト(中心/周囲) 本則 ${con.map((v) => v.toFixed(2)).join('/')} vs ` +
      `対照 ${conC.map((v) => v.toFixed(2)).join('/')}(重なりなし) / ` +
      `E水準=${r.emergence} / 16seed の正本は tests/exp-4-85.mjs(質量比 18.3〜53.3%・中央34.7%)`);
  } else {
    console.log('SKIP behavior.selfrotor-multiseed(対象に 🥚 の multi-seed claim なし — 第83便A 未適用の root 等)');
  }
}

// ---- 84A) 第84便A(創発の標準試験の展開): behavior.phase-multiseed — 熱の実験室の創発4件
// ----   (🧬emergent / 🧊emergent2 / ⛓️chain2 / ♻️chaincycle)の**多seed頑健性**を機械固定する。
// ----   第83便A の behavior.selfrotor-multiseed と同じ流儀:**QA は少seed 縮約・exp が全seed の正本**
// ----   (16seed 7〜22 の分布は tests/exp-4-87.mjs → tests/out/exp-4-87.json が持つ)。
// ----   ここでは先頭3seed(7/8/9)に絞り、各プリセットの kind:"multi-seed" claim の窓で判定する。
// ----   実測の要点(第84便A・16seed):
// ----     🧬 素の 🧬 は grid の jitter/vScale が無く mMin=mMax なので **seed を振っても粒子の初期
// ----        状態が 1ビットも変わらない**(16seed が bit 一致 = 素の多seed試験は空虚)。そこで
// ----        jitter 0.3 / vScale 0.05 の初期条件ノイズを足した版で c̄ を測る(16seed 1.98〜2.75)
// ----     🧊 120°角偏差 12.3〜44.1°(対照 angK=0 は 73.1〜79.0° — 16seed を通して重ならない)
// ----     ⛓️ 2配位率 0.696〜0.804(対照 0.268〜0.375 — 重ならない)= 4件中唯一 16/16 で通った
// ----     ♻️ 解離末(t=528)の成分数 48〜84。凍結期は ⛓️ と**壁スケジュール以外が同一設定**なので
// ----        t=288(18000步)までの軌道が一致する — ⛓️ の値は ♻️ の run から読み、同一性も検査する
// ----   **重い(3seed × 63000步 + 対照1seed)ので QA_FAST=1 では実行しない**(FAST への時間増はゼロ)----
if (!FAST) {
  const PIDS = ['emergent', 'emergent2', 'chain2', 'chaincycle'];
  const hasPM = await page.evaluate((pids) => pids.every((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    return p && Array.isArray(p.claims) && p.claims.some((c) => c.kind === 'multi-seed');
  }), PIDS);
  if (hasPM) {
    const r = await page.evaluate((seeds) => {
      const S = HP.sim;
      // 秩序変数(相変化グラフ量と同じ定義 — 第60便 QA と一致)
      const stats = () => {
        const nbr = Array.from({ length: S.n }, () => []);
        for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++) {
          const d = Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j]);
          if (d < S.phase.bondRange * (S.R[i] + S.R[j])) { nbr[i].push(j); nbr[j].push(i); }
        }
        let T = 0, cS = 0, c2 = 0, c3 = 0, a120 = 0, n120 = 0, a180 = 0, n180 = 0;
        for (let i = 0; i < S.n; i++) {
          T += S.Tint[i]; cS += nbr[i].length;
          if (nbr[i].length === 2) {
            c2++;
            const [j, k] = nbr[i];
            const q1 = Math.atan2(S.y[j] - S.y[i], S.x[j] - S.x[i]);
            const q2 = Math.atan2(S.y[k] - S.y[i], S.x[k] - S.x[i]);
            let da = Math.abs(q1 - q2); if (da > Math.PI) da = 2 * Math.PI - da;
            a180 += Math.abs(Math.PI - da); n180++;
          }
          if (nbr[i].length === 3) {
            c3++;
            const A = nbr[i].map((j) => Math.atan2(S.y[j] - S.y[i], S.x[j] - S.x[i])).sort((x, y) => x - y);
            for (let k = 0; k < 3; k++) { let da = A[(k + 1) % 3] - A[k]; if (k === 2) da += 2 * Math.PI;
              a120 += Math.abs(da - 2 * Math.PI / 3); n120++; }
          }
        }
        const par = Array.from({ length: S.n }, (_, i) => i);
        const find = (a) => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
        for (let i = 0; i < S.n; i++) for (const j of nbr[i]) { const a = find(i), b = find(j); if (a !== b) par[a] = b; }
        const cn = {};
        for (let i = 0; i < S.n; i++) { const r0 = find(i); cn[r0] = (cn[r0] || 0) + 1; }
        const sz = Object.values(cn).sort((a, b) => b - a);
        return { T: T / S.n, cMean: cS / S.n, frac2: c2 / S.n, frac3: c3 / S.n,
          ang120: n120 ? a120 / n120 * 180 / Math.PI : null,
          ang180: n180 ? a180 / n180 * 180 / Math.PI : null,
          nComp: sz.length, maxComp: sz[0], nan: S.hasNaN(), clampA: S.clampAN, ovf: S.angOvfN };
      };
      // mode: 'main' | 'ko'(機構ノックアウト対照) / icn: 初期条件ノイズ
      const run = (pid, seed, steps, marks, opt) => {
        const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === pid)));
        p.seed = seed;
        if (opt && opt.ko) Object.assign(p.phaseChange, opt.ko);
        if (opt && opt.icn) Object.assign(p.bodies[0], opt.icn);
        const v = HP.validatePreset(p);
        if (!v.ok) return { err: v.errors };
        S.build(v.preset);
        const out = {};
        let k = 0;
        for (const M of marks) { while (k < M) { S.step(0.016); k++; } out[M] = stats(); }
        while (k < steps) { S.step(0.016); k++; }
        out.end = stats();
        return out;
      };
      const ICN = { jitter: 0.3, vScale: 0.05 };
      const o = { emergent: {}, emergent2: {}, chain2: {}, chaincycle: {}, ctl: {} };
      for (const sd of seeds) {
        o.emergent['s' + sd] = run('emergent', sd, 12000, [], { icn: ICN });
        o.emergent2['s' + sd] = run('emergent2', sd, 18000, [], {});
        // ♻️ を 33000步 走らせ、@18000步(t=288)を ⛓️ の値として読む(下で同一性を検査)
        o.chaincycle['s' + sd] = run('chaincycle', sd, 33000, [18000], {});
      }
      // 対照(機構ノックアウト)は時間予算のため seed 7 のみ。3seed の統計は exp-4-87 が持つ。
      // 🧬 の対照は tests/exp-4-87.mjs と揃えて**素の初期配置**で測る(c̄=0.125)。初期条件ノイズを
      // 入れた対照でも 0.089 とほぼ同値(結合を切れば配位数は幾何だけで決まる)ことも併せて出す
      o.ctl.emergent = run('emergent', seeds[0], 12000, [], { ko: { bondK: 0 } });
      o.ctl.emergentIcn = run('emergent', seeds[0], 12000, [], { icn: ICN, ko: { bondK: 0 } });
      o.ctl.emergent2 = run('emergent2', seeds[0], 18000, [], { ko: { angK: 0 } });
      o.ctl.chain2 = run('chain2', seeds[0], 18000, [], { ko: { angK: 0 } });
      // ⛓️≡♻️(t≤288)の同一性: ⛓️ を単独で 18000步 走らせて ♻️@18000步 と全量比較する
      const c2solo = run('chain2', seeds[0], 18000, [], {});
      const a = c2solo.end, b = o.chaincycle['s' + seeds[0]][18000];
      const identical = ['T', 'cMean', 'frac2', 'frac3', 'ang120', 'ang180', 'nComp', 'maxComp']
        .every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k]));
      HP.loadPreset('emergent', false);
      const claimOf = (pid, id) => (HP.allPresets().find((q) => q.id === pid).claims || []).find((c) => c.id === id);
      return { o, identical, seeds,
        claims: { emergent: claimOf('emergent', 'emergent.multi-seed-min-coordination'),
          emergent2: claimOf('emergent2', 'emergent2.multi-seed-max-honeycomb-angle-dev'),
          chain2: claimOf('chain2', 'chain2.multi-seed-min-chain-fraction'),
          chaincycle: claimOf('chaincycle', 'chaincycle.multi-seed-min-melt-ncomp') },
        emergence: Object.fromEntries(['emergent', 'emergent2', 'chain2', 'chaincycle']
          .map((id) => [id, HP.allPresets().find((q) => q.id === id).emergence])) };
    }, [7, 8, 9]);
    const S3 = r.seeds;
    const inWin = (x, e) => Number.isFinite(x) && x >= e.min && x <= e.max;
    // 🧬 初期条件ノイズ版の c̄(seed 集合の最小値)
    const emC = S3.map((sd) => r.o.emergent['s' + sd].end.cMean);
    const emMin = Math.min(...emC), emCtl = r.o.ctl.emergent.end.cMean;
    // 🧊 120°角偏差(seed 集合の最大値)— 対照(angK=0)と重ならないこと
    const e2A = S3.map((sd) => r.o.emergent2['s' + sd].end.ang120);
    const e2Max = Math.max(...e2A), e2Ctl = r.o.ctl.emergent2.end.ang120;
    // ⛓️ 2配位率(seed 集合の最小値)— ♻️ の run の @18000步 から読む
    const c2F = S3.map((sd) => r.o.chaincycle['s' + sd][18000].frac2);
    const c2Min = Math.min(...c2F), c2Ctl = r.o.ctl.chain2.end.frac2;
    // ♻️ 解離末の成分数(seed 集合の最小値)
    const cyN = S3.map((sd) => r.o.chaincycle['s' + sd].end.nComp);
    const cyMin = Math.min(...cyN);
    const C = r.claims;
    const noNaN = S3.every((sd) => ['emergent', 'emergent2', 'chaincycle']
      .every((p) => !r.o[p]['s' + sd].end.nan && r.o[p]['s' + sd].end.clampA === 0 && r.o[p]['s' + sd].end.ovf === 0));
    add('behavior.phase-multiseed',
      noNaN && r.identical
      && inWin(emMin, C.emergent.expected) && inWin(emCtl, C.emergent.control.expected) && emMin > 10 * emCtl
      && inWin(e2Max, C.emergent2.expected) && inWin(e2Ctl, C.emergent2.control.expected) && e2Max < e2Ctl
      && inWin(c2Min, C.chain2.expected) && inWin(c2Ctl, C.chain2.control.expected) && c2Min > c2Ctl
      && inWin(cyMin, C.chaincycle.expected)
      // E水準は第84便A の実測どおり据え置き(⑤摂動回復が4件とも通らないので E3 昇格はしていない)
      && r.emergence.emergent === 'E1' && r.emergence.emergent2 === 'E1'   // 第84便統合裁定: 加熱床=外部駆動で E1
      && r.emergence.chain2 === 'E1' && r.emergence.chaincycle === 'E1',   // 第84便統合裁定
      `${S3.length}seed(${S3.join('/')}) / ` +
      `🧬 初期条件ノイズ版の配位数 c̄ ${emC.map((v) => v.toFixed(3)).join('/')} → **最小=${emMin.toFixed(3)}**` +
      `(claim 窓 ${C.emergent.expected.min}〜${C.emergent.expected.max}) vs 対照 bondK=0 の ${emCtl.toFixed(3)}` +
      `(=結合が消える・同じ初期条件ノイズを入れた対照でも ${r.o.ctl.emergentIcn.end.cMean.toFixed(3)})` +
      ` 比 ${(emMin / Math.max(1e-9, emCtl)).toFixed(1)}倍(>10) / ` +
      `🧊 120°角偏差 ${e2A.map((v) => v.toFixed(1) + '°').join('/')} → **最大=${e2Max.toFixed(1)}°**` +
      `(窓 ${C.emergent2.expected.min}〜${C.emergent2.expected.max}) vs 対照 angK=0 の ${e2Ctl.toFixed(1)}°(密集塊)— 分離 / ` +
      `⛓️ 2配位率 ${c2F.map((v) => v.toFixed(3)).join('/')} → **最小=${c2Min.toFixed(3)}**` +
      `(窓 ${C.chain2.expected.min}〜${C.chain2.expected.max}) vs 対照 angK=0 の ${c2Ctl.toFixed(3)}(等方の液滴)— 分離 / ` +
      `♻️ 解離末(t=528)の成分数 ${cyN.join('/')} → **最小=${cyMin}**(窓 ${C.chaincycle.expected.min}〜${C.chaincycle.expected.max}) / ` +
      `⛓️≡♻️(t≤288)の全秩序変数一致=${r.identical}(③④の run 共有の根拠) / ` +
      `E水準=🧬${r.emergence.emergent}・🧊${r.emergence.emergent2}・⛓️${r.emergence.chain2}・♻️${r.emergence.chaincycle}` +
      `(第84便A: ⑤摂動回復が4件とも通らないため E3 昇格なし) / ` +
      `16seed(7〜22)の分布は tests/exp-4-87.mjs が正本: 🧬c̄1.98〜2.75・🧊角偏差12.3〜44.1°・⛓️2配位率0.696〜0.804・♻️成分48〜84`);
  } else {
    console.log('SKIP behavior.phase-multiseed(対象に 🧬🧊⛓️♻️ の multi-seed claim なし — 第84便A 未適用の root 等)');
  }
}

// ---- 84B) 第84便B(創発の標準試験を 🕶️ へ展開): behavior.darkrotor-multiseed ----
// ----   「それらしく見えた固定seed 1本」ではないことを、seed を振って機械固定する。
// ----   判定量は claims の darkrotor.multi-seed-min-arm-ratio =「seed 集合を通した
// ----   腕振幅帯平均の増強比(本則/対照)の**最小値**」。QA は内蔵 seed 以外の 2seed
// ----   (20260727/20260728)だけの縮約版で、8seed の分布は tests/exp-4-88.mjs
// ----   (→ tests/out/exp-4-88.json)が正本として持つ(既存の kind:"multi-seed" と同じ流儀)。
// ----   E水準タグが E2(閉鎖系の創発)であることも併せて固定する — 🕶️ は pinned 0 の
// ----   閉鎖系だが、⑤摂動回復(自己維持)が通らなかったので E3 ではない(第84便B の実測)。
// ----   **重い(6000步 × 4構成)ので QA_FAST=1 では実行しない**(FAST への時間増はゼロ)。
// ----   ※ detail の「内蔵seed は behavior.darkrotorLong が担当」は**設計上の役割分担**を指す。
// ----     第84便B の時点ではその区画(`if (hasObs)`)が廃止済み `HP.sim.obsT` を門にしていて
// ----     休眠しており、実際には走っていなかった。**第85便で門を現行 API(HP.obsTemp + lSw)へ
// ----     置換して復旧済み**なので、いまは分担どおり両方が走る ----
if (!FAST && w5cDrFree && w5cDrMulti) {
  const mm = await w5cGetUnit('darkrotorMultiseed');
  const P = await page.evaluate(() => {
    const p = HP.allPresets().find((q) => q.id === 'darkrotor');
    return { claim: p.claims.find((c) => c.id === 'darkrotor.multi-seed-min-arm-ratio'),
      emergence: p.emergence };
  });
  const C = P.claim;
  const ratios = mm.main.map((v, i) => v.bandAvg / Math.max(mm.ctrl[i].bandAvg, 1e-9));
  const minR = Math.min(...ratios), maxR = Math.max(...ratios);
  const minBand = Math.min(...mm.main.map((v) => Math.min(...v.A2)));
  const ctrlMax = Math.max(...mm.ctrl.map((v) => v.bandAvg));
  // 実測(beta・第84便B・8seed 20260726〜20260733・6000步 = 腕の窓):
  //   本則の帯平均 0.500〜0.569(中央0.551)/ 対照(中心BH込み全 single spin=0)0.157〜0.265
  //   → 増強比 2.15〜3.62(中央2.51)。QA の 2seed は 20260727=2.48倍・20260728=2.15倍
  add('behavior.darkrotor-multiseed',
    P.emergence === 'E2'
    && mm.main.every((v) => !v.err && !v.nan && v.clampV === 0 && v.clampR === 0)
    && mm.ctrl.every((v) => !v.err && !v.nan)
    && minR >= C.expected.min && maxR <= C.expected.max
    && ctrlMax <= C.control.expected.max
    && minBand > 0.22 && mm.main.every((v) => v.keepPct >= 95 && v.maxSpin < 6.0),
    `${mm.seeds.length}seed(${mm.seeds.join('/')}・内蔵seed 20260726 は既存の behavior.darkrotorLong が担当)` +
    ` 6000步 腕A2帯平均 本則 ${mm.main.map((v) => v.bandAvg.toFixed(3)).join('/')}` +
    ` / 対照(中心BH込み全 single spin=0) ${mm.ctrl.map((v) => v.bandAvg.toFixed(3)).join('/')}` +
    ` → 増強比 ${ratios.map((v) => v.toFixed(2)).join('/')}倍・**最小=${minR.toFixed(2)}倍**` +
    `(claim 窓 ${C.expected.min}〜${C.expected.max}) / ` +
    `対照の帯平均 最大=${ctrlMax.toFixed(3)}(≤${C.control.expected.max} — 配置由来分に留まる) / ` +
    `単帯の最小=${minBand.toFixed(3)}(>0.22) 恒星保持 ${mm.main.map((v) => v.keepPct.toFixed(1) + '%').join('/')}(≥95) ` +
    `全期間max|spin| ${mm.main.map((v) => v.maxSpin.toFixed(2)).join('/')}(<6.0) ` +
    `NaN/clamp=${mm.main.filter((v) => v.nan || v.clampV || v.clampR).length}件 / ` +
    `E水準=${P.emergence}(閉鎖系の創発。⑤摂動回復が通らないので E3 ではない — 第84便B) / ` +
    `8seed の分布(帯平均 0.500〜0.569・増強比 2.15〜3.62・後行56/56点)の正本は tests/exp-4-88.mjs`);
} else if (!FAST) {
  console.log('SKIP behavior.darkrotor-multiseed(対象に 🕶️ の multi-seed claim なし — 第84便B 未適用の root 等)');
}

// ---- 82B) 第82便B: emergence.tag — E水準タグ(emergence:"E0".."E3")の最小導入。
// ----   ①宣言済みプリセット(🧬🧊⛓️=E1〔第84便統合裁定: 加熱床=外部駆動〕/ ♻️=E1 / 🥚=E3)が
// ----     期待どおりの値を持つ
// ----   ②未宣言のプリセットにはバッジが出ない(ノイズ回避の仕様)
// ----   ③スキーマ: 有効値は保持(警告0)・未知値は警告つき無視=削除
// ----   ④説明パネルのチップ DOM(data-g="emg-E3")が sampleClass チップの隣に出る
// ----   軽量(DOM検査+validatePreset の往復のみ)なので QA_FAST=1 でも実行する ----
{
  const hasEmg = await page.evaluate(() => !!(window.HP && HP.EMERGENCE_LEVELS));
  if (hasEmg) {
    const r = await page.evaluate(() => {
      const LV = HP.EMERGENCE_LEVELS;
      const builtin = HP.allPresets().filter((p) => !String(p.id).startsWith('custom_'));
      const declared = {};
      for (const p of builtin) if (p.emergence !== undefined) declared[p.id] = p.emergence;
      const badVal = Object.entries(declared).filter(([, v]) => LV.indexOf(v) < 0).map(([k]) => k);
      // チップ DOM(宣言あり=出る / 宣言なし=出ない)。sampleClass チップの直後に並ぶこと
      const chipsOf = (id) => { HP.loadPreset(id, false);
        return Array.from(document.querySelectorAll('#classChips .classChip')).map((e) => e.dataset.g); };
      const cSelf = chipsOf('selfRotor'), cGal = chipsOf('galaxy'), cCyc = chipsOf('chaincycle');
      // 第83便A: 🥚 は E2 → E3 へ昇格(多seed16・粒子数スケーリング・摂動回復の実測を通した)
      const iSC = cSelf.findIndex((g) => g.startsWith('sclass-')), iE = cSelf.indexOf('emg-E3');
      const mk = (e) => ({ name: 't', description: 'emergence 検査', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: {}, emergence: e,
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      const good = HP.validatePreset(mk('E2')), bad = HP.validatePreset(mk('E9'));
      return { levels: LV, declared, badVal,
        selfChip: iE >= 0, selfAdjacent: iSC >= 0 && iE === iSC + 1,
        galChip: cGal.some((g) => g.startsWith('emg-')),
        cycChip: cCyc.indexOf('emg-E1') >= 0,
        keep: good.ok && good.preset.emergence === 'E2', goodW: good.warnings.length,
        drop: bad.ok && bad.preset.emergence === undefined,
        badW: bad.warnings.filter((w) => w.includes('emergence')).length,
        clsPass: HP.classifyPreset(HP.allPresets().find((p) => p.id === 'selfRotor')).emergence };
    });
    // 第83便A: 🥚=E3 / 第84便B: 🕶️darkrotor=E2(pinned 0 の閉鎖系だが⑤摂動回復が通らない)・
    // ⏳nebulaBipolar=E1(赤道アーク22体が pinned = 外部固定の幾何なので閉鎖系ではない)
    const want = { emergent: 'E1', emergent2: 'E1', chain2: 'E1', chaincycle: 'E1', selfRotor: 'E3',   // 第84便統合裁定
      darkrotor: 'E2', nebulaBipolar: 'E1' };   // 第83便A: 🥚=E3 / 第84便B: 🕶️=E2・⏳=E1
    const missing = Object.entries(want).filter(([k, v]) => r.declared[k] !== v).map(([k]) => k);
    add('emergence.tag',
      r.badVal.length === 0 && missing.length === 0
      && r.selfChip && r.selfAdjacent && !r.galChip && r.cycChip
      && r.keep && r.goodW === 0 && r.drop && r.badW === 1 && r.clsPass === 'E3',   // 第83便A: 🥚=E3
      `水準=[${r.levels.join(',')}] 宣言=${Object.entries(r.declared).map(([k, v]) => `${k}:${v}`).join(' ')}` +
      `(未宣言は非表示 — 🌌galaxy のバッジ=${r.galChip}) / ` +
      `チップ: 🥚=${r.selfChip}(sampleClass の隣=${r.selfAdjacent}) ♻️=E1 ${r.cycChip} / ` +
      `スキーマ: 有効値保持=${r.keep}(警告${r.goodW}) 未知値は警告つき無視=${r.drop}(警告${r.badW}) / ` +
      `classifyPreset パススルー=${r.clsPass}` +
      (missing.length ? ` / 宣言ずれ: ${missing.join(',')}` : '') +
      (r.badVal.length ? ` / 不正値: ${r.badVal.join(',')}` : ''));
  } else {
    console.log('SKIP emergence.tag(対象に E水準タグなし — 第82便B 未適用の root 等)');
  }
}

// ---- 82B) 第82便B: emergence.monitor — 創発モニタ(表示専用グラフ)のスモーク。
// ----   ①「グラフ」カテゴリにトグルが在る ②ON にすると値が出る(統計関数が有限値を返し、
// ----   描画でスロットが割り当たり履歴が積まれる)③OFF/ON で物理が bit 不変
// ----   (600步の x,y,spin ハッシュ一致 = 計測は sim.step に一切載っていない)
// ----   ④統計式の健全性: 単一の接触塊は nCluster=1・maxFrac=1、離れた2群は nCluster=2、
// ----     同符号スピンの整列度=+1・逆符号対称なら 0、剛体回転の V/σ は分散≈0 で大きくなる ----
{
  const hasEM = await page.evaluate(() => !!(window.HP && HP.emergenceStats));
  if (hasEM) {
    const r = await page.evaluate(() => {
      const hash = () => { const S = HP.sim; const a = [];
        for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.spin[i]);
        return a.map((v) => v.toExponential(12)).join(','); };
      // ③ 物理 bit 不変(OFF / ON の 600步)
      HP.loadPreset('galaxy', false); HP.sim.overlays.emergence = false;
      for (let k = 0; k < 600; k++) HP.sim.step(0.016);
      const hOff = hash();
      HP.loadPreset('galaxy', false); HP.sim.overlays.emergence = true;
      for (let k = 0; k < 600; k++) HP.sim.step(0.016);
      const hOn = hash();
      // ① UI トグル(「グラフ」カテゴリ)
      document.querySelector('#tabs button[data-tab=params]').click();
      const labels = Array.from(document.querySelectorAll('#paramRows .prow label')).map((e) => e.textContent);
      const hasToggle = labels.some((t) => t === HP.T('tgEmergence'));
      // ② ON で値が出る(スロット割当・履歴)
      HP.loadPreset('selfRotor', false);
      const st0 = HP.emergenceStats();
      HP.sim.overlays.emergence = true; HP.tick(40);
      const slots = HP.overlaySlots();
      const hist = HP.emergenceHist();
      // ④ 統計式の健全性(合成配置で解析値と突き合わせる)
      const mkP = (bodies) => ({ name: 't', description: 'd', camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 0, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 60,
          cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 }, bodies });
      const B = (x, y, vx, vy, spin) => ({ type: 'single', m: 1, x, y, vx, vy, spin, pinned: false, radius: 1, rMul: 1 });
      // 接触した3体(間隔1.5 < 1.2·(1+1)=2.4)= 1塊・スピン同符号 → 整列度 +1
      const v1 = HP.validatePreset(mkP([B(0, 0, 0, 0, 0.5), B(1.5, 0, 0, 0, 0.5), B(3, 0, 0, 0, 0.5)]));
      HP.sim.build(v1.preset); const s1 = HP.emergenceStats();
      // 離れた2群(間隔100)= 2塊・スピン逆符号対称 → 整列度 0
      const v2 = HP.validatePreset(mkP([B(0, 0, 0, 0, 0.5), B(1.5, 0, 0, 0, 0.5),
        B(100, 0, 0, 0, -0.5), B(101.5, 0, 0, 0, -0.5)]));
      HP.sim.build(v2.preset); const s2 = HP.emergenceStats();
      // 剛体回転する4体(v=ω×r・分散0)→ V/σ は非常に大きい(σ²≈0)
      const w = 0.1, R4 = 50;
      const v3 = HP.validatePreset(mkP([0, 1, 2, 3].map((k) => { const a = k * Math.PI / 2;
        return B(R4 * Math.cos(a), R4 * Math.sin(a), -w * R4 * Math.sin(a), w * R4 * Math.cos(a), 0); })));
      HP.sim.build(v3.preset); const s3 = HP.emergenceStats();
      return { bitEqual: hOff === hOn, hasToggle, slots, histN: hist.length,
        st0: { K: st0.nCluster, f: st0.maxFrac, a: st0.align, v: st0.vsig },
        s1: { K: s1.nCluster, f: s1.maxFrac, a: s1.align },
        s2: { K: s2.nCluster, f: s2.maxFrac, a: s2.align },
        s3: { K: s3.nCluster, v: s3.vsig } };
    });
    add('emergence.monitor',
      r.bitEqual && r.hasToggle && r.slots.indexOf('emergence') >= 0 && r.histN >= 1
      && Number.isFinite(r.st0.v) && r.st0.K > 1
      && r.s1.K === 1 && Math.abs(r.s1.f - 1) < 1e-9 && Math.abs(r.s1.a - 1) < 1e-9
      && r.s2.K === 2 && Math.abs(r.s2.f - 0.5) < 1e-9 && Math.abs(r.s2.a) < 1e-9
      && r.s3.K === 4 && r.s3.v >= 1e9,
      `トグル(グラフカテゴリ)=${r.hasToggle} スロット=[${r.slots.join(',')}] 履歴=${r.histN}点 / ` +
      `OFF/ON で物理 bit 一致=${r.bitEqual}(600步 x,y,spin — 計測は sim.step に載っていない) / ` +
      `🥚初期値: 塊${r.st0.K} 最大塊${r.st0.f.toFixed(4)} 整列${r.st0.a.toFixed(3)} V/σ=${r.st0.v.toFixed(2)} / ` +
      `解析照合: 接触3体→塊${r.s1.K}・最大塊${r.s1.f.toFixed(3)}・整列${r.s1.a.toFixed(3)}(=1) / ` +
      `離れた2群(逆符号スピン)→塊${r.s2.K}・最大塊${r.s2.f.toFixed(3)}・整列${r.s2.a.toFixed(3)}(=0) / ` +
      `剛体回転4体→塊${r.s3.K}・V/σ=${r.s3.v.toExponential(2)}(分散が数値0 → 上限1e9=完全回転支持)`);
  } else {
    console.log('SKIP emergence.monitor(対象に 創発モニタ なし — 第82便B 未適用の root 等)');
  }
}

// ---- 83B) 第83便B: phasemap.smoke — 相図ランナー(2変数バッチ掃引 → 秩序変数の色マップ)。
// ----   ①宣言の受理: 🧬emergent / 🥚selfRotor が phaseMap を持ち、正規化後も保持される
// ----     (phaseMap 由来の警告0)。未宣言(🌌galaxy)は持たず、パラメータタブの行も出ない
// ----   ②スキーマ: 未知キー/非数/不正 metric/xKey=yKey は「警告つき無視」= phaseMap ごと削除。
// ----     有効宣言は値域(CLAMPS)と steps 上限 20000 へクランプして保持
// ----   ③UI: 宣言ありでボタン行が出る・パネルが開き canvas に実寸が入る
// ----   ④2×2 の極小バッチを headless で走らせ、有限値のグリッドが得られる(同期版 runSync)
// ----   ⑤本編状態のハッシュ不変(x,y,spin と t が1ビットも動かない = スクラッチ sim だけで走る)
// ----   ⑥分割実行版(UI と同じ経路)も 2×2 を完走し、本編は pause 状態に落ちる
// ----   ⑦セル適用の導線は確認ダイアログを承諾したときだけ本編 params を書き換える
// ----   軽量(2×2×150〜200步のみ)なので QA_FAST=1 でも実行する ----
{
  const hasPM = await page.evaluate(() => !!(window.HP && HP.phaseMap && HP.phaseMap.runSync));
  if (hasPM) {
    const TINY = { xKey: 'kRep', xValues: [0, 20], yKey: 'gravityY', yValues: [0, 0.5], steps: 200, metric: 'maxFrac' };
    const r = await page.evaluate(async (TINY) => {
      const pmW = (v) => v.warnings.filter((w) => w.indexOf('phaseMap') >= 0).length;
      // ① 宣言の受理(内蔵プリセット)
      const decl = {};
      for (const id of ['emergent', 'selfRotor', 'galaxy']) {
        const p = HP.allPresets().find((q) => q.id === id);
        const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
        decl[id] = { has: !!p.phaseMap, kept: !!(v.ok && v.preset.phaseMap), w: pmW(v),
          metric: p.phaseMap ? p.phaseMap.metric : null,
          axes: p.phaseMap ? (p.phaseMap.xKey + '×' + p.phaseMap.yKey) : null,
          n: p.phaseMap ? p.phaseMap.xValues.length * p.phaseMap.yValues.length : 0,
          steps: p.phaseMap ? p.phaseMap.steps : 0 };
      }
      // ② スキーマ(未知・非数・不正 metric・同一キー → 警告つき無視 / 有効宣言はクランプ保持)
      const mk = (pm) => { const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'emergent')));
        p.phaseMap = pm; return HP.validatePreset(p); };
      const bad = {
        unknownKey: mk({ xKey: 'nope', xValues: [1, 2], yKey: 'kRep', yValues: [1, 2], steps: 100, metric: 'maxFrac' }),
        nonNum: mk({ xKey: 'kRep', xValues: [1, 'a'], yKey: 'gravityY', yValues: [1, 2], steps: 100, metric: 'maxFrac' }),
        badMetric: mk({ xKey: 'kRep', xValues: [1, 2], yKey: 'gravityY', yValues: [1, 2], steps: 100, metric: 'zzz' }),
        sameKey: mk({ xKey: 'kRep', xValues: [1, 2], yKey: 'kRep', yValues: [1, 2], steps: 100, metric: 'maxFrac' }),
        tooFew: mk({ xKey: 'kRep', xValues: [1], yKey: 'gravityY', yValues: [1, 2], steps: 100, metric: 'maxFrac' }),
      };
      const dropped = Object.entries(bad).filter(([, v]) => v.ok && v.preset.phaseMap === undefined && pmW(v) === 1).map(([k]) => k);
      const clampCase = mk({ xKey: 'kRep', xValues: [0, 99], yKey: 'gravityY', yValues: [-99, 1], steps: 1e9, metric: 'align' });
      const cl = clampCase.preset.phaseMap;
      // ③ UI(宣言ありで行が出る / 未宣言では出ない / パネルが開いて canvas に実寸が入る)
      HP.loadPreset('emergent', false);
      document.querySelector('#tabs button[data-tab=params]').click();
      const rowOn = document.querySelector('#pmRow').style.display;
      const btn = document.querySelector('#btnPhaseMap');
      if (btn) btn.click();
      const panelOpen = document.querySelector('#pmPanel').style.display === 'block';
      const cv = document.querySelector('#pmCv');
      const drawn = cv.width > 0 && cv.height > 0;
      const axesTxt = document.querySelector('#pmAxes').textContent;
      HP.phaseMap.open(false);
      HP.loadPreset('galaxy', false);
      const rowOff = document.querySelector('#pmRow').style.display;
      // ④⑤ 2×2 の極小バッチ + 本編状態の不変
      const hash = () => { const S = HP.sim; const a = [];
        for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.spin[i]);
        return a.map((v) => v.toExponential(12)).join(','); };
      HP.loadPreset('emergent', false);
      for (let k = 0; k < 300; k++) HP.sim.step(0.016);
      const h0 = hash(), t0 = HP.sim.t, n0 = HP.sim.n;
      const g = HP.phaseMap.runSync('emergent', TINY);
      const bitEqual = (h0 === hash()) && t0 === HP.sim.t && n0 === HP.sim.n;
      // ⑥ 分割実行版(UI と同じ経路)— 本番宣言(6×6×2500步)は QA には重いので、
      //    内蔵プリセットの宣言を一時的に 2×2×150步へ差し替えて回し、必ず元へ戻す
      HP.loadPreset('emergent', false);
      const cp = HP.currentPreset(), keepPM = cp.phaseMap;
      cp.phaseMap = { xKey: 'kRep', xValues: [0, 20], yKey: 'gravityY', yValues: [0, 0.5], steps: 150, metric: 'maxFrac' };
      HP.setRunning(true);
      HP.phaseMap.open(true); HP.phaseMap.start();
      const tw = Date.now();
      while (HP.phaseMap.running() && Date.now() - tw < 60000) await new Promise((rs) => setTimeout(rs, 20));
      const R = HP.phaseMap.result();
      const asyncOk = !!R && R.done === 4 && R.vals.every((v) => Number.isFinite(v)) && !R.aborted;
      const paused = HP.running() === false;
      HP.phaseMap.open(false);
      cp.phaseMap = keepPM;   // 内蔵プリセットの宣言を復元(以降のテストに影響を残さない)
      return { decl, dropped, badN: Object.keys(bad).length,
        clamp: cl ? { x1: cl.xValues[1], y0: cl.yValues[0], steps: cl.steps } : null,
        rowOn, rowOff, panelOpen, drawn, axesTxt, cvw: cv.width, cvh: cv.height,
        grid: g ? { nx: g.nx, ny: g.ny, vals: g.vals, ms: Math.round(g.ms) } : null,
        bitEqual, asyncOk, paused, asyncVals: R ? R.vals : null };
    }, TINY);
    // ⑦ セル適用の導線(confirm を承諾したときだけ本編へ書く)— dialog を受ける別ページで検査
    const dp = await browser.newPage();
    let dlg = 0;
    dp.on('dialog', (d) => { dlg++; d.accept(); });
    await dp.goto(INDEX);
    await dp.waitForFunction(() => !!(window.HP && HP.phaseMap));
    const ap = await dp.evaluate(() => {
      HP.loadPreset('emergent', false);
      const tiny = { xKey: 'kRep', xValues: [0, 20], yKey: 'gravityY', yValues: [0, 0.5], steps: 60, metric: 'maxFrac' };
      HP.currentPreset().phaseMap = tiny;
      HP.phaseMap.open(true);
      const g = HP.phaseMap.runSync('emergent', tiny);
      // 器(pmRes)を確保してから左上セル(ix=0,iy=1)= kRep 0 / g_y 0.5 を適用する
      // (🧬の既定は kRep=20・g_y=0.03 なので、両方の値が動くことを見る)
      HP.phaseMap.start(); HP.phaseMap.stop();
      const before = { kRep: HP.sim.params.kRep, gy: HP.sim.params.gravityY };
      HP.phaseMap.applyCell(0, 1);
      const after = { kRep: HP.sim.params.kRep, gy: HP.sim.params.gravityY };
      return { before, after, gridOk: !!g && g.vals.every((v) => Number.isFinite(v)) };
    });
    await dp.close();
    const d0 = r.decl;
    const grid = r.grid;
    add('phasemap.smoke',
      d0.emergent.has && d0.emergent.kept && d0.emergent.w === 0
      && d0.selfRotor.has && d0.selfRotor.kept && d0.selfRotor.w === 0
      && !d0.galaxy.has && r.rowOn === 'flex' && r.rowOff === 'none'
      && r.panelOpen && r.drawn
      && r.dropped.length === r.badN
      && r.clamp && r.clamp.x1 === 20 && r.clamp.y0 === -10 && r.clamp.steps === 20000
      && grid && grid.nx === 2 && grid.ny === 2 && grid.vals.length === 4
      && grid.vals.every((v) => Number.isFinite(v))
      && r.bitEqual && r.asyncOk && r.paused
      && dlg === 1 && ap.gridOk
      && Math.abs(ap.after.kRep - 0) < 1e-12 && Math.abs(ap.after.gy - 0.5) < 1e-12
      && Math.abs(ap.before.kRep - 20) < 1e-12 && Math.abs(ap.before.gy - 0.03) < 1e-12,
      `宣言: 🧬${d0.emergent.axes}/${d0.emergent.metric}(${d0.emergent.n}セル×${d0.emergent.steps}步) ` +
      `🥚${d0.selfRotor.axes}/${d0.selfRotor.metric}(${d0.selfRotor.n}セル×${d0.selfRotor.steps}步) ` +
      `未宣言🌌=行なし(${r.rowOff}) / スキーマ: 警告つき無視 ${r.dropped.length}/${r.badN}(${r.dropped.join(',')})・` +
      `クランプ kRep99→${r.clamp && r.clamp.x1}・g_y −99→${r.clamp && r.clamp.y0}・steps 1e9→${r.clamp && r.clamp.steps} / ` +
      `UI: 行=${r.rowOn} パネル=${r.panelOpen} canvas=${r.cvw}×${r.cvh} / ` +
      `2×2 バッチ(200步)=[${grid ? grid.vals.map((v) => v.toFixed(3)).join(',') : '-'}] ${grid ? grid.ms : '-'}ms / ` +
      `本編 bit 不変(x,y,spin・t・n)=${r.bitEqual} / 分割実行 2×2 完走=${r.asyncOk}` +
      `[${r.asyncVals ? r.asyncVals.map((v) => v.toFixed(3)).join(',') : '-'}] 本編pause=${r.paused} / ` +
      `セル適用: 確認ダイアログ${dlg}回 → kRep ${ap.before.kRep}→${ap.after.kRep} g_y ${ap.before.gy}→${ap.after.gy}`);
  } else {
    console.log('SKIP phasemap.smoke(対象に 相図ランナー なし — 第83便B 未適用の root 等)');
  }
}

// ---- 7z14) D3: behavior.cosmicweb — 膨張する箱の中で自己重力が構造(フィラメント/ボイド類似)を
// ----      作る。判定量: 共動座標の 10×10 セルでの密度コントラスト δ²=Var(N)/⟨N⟩²(初期は
// ----      配置のポアソンゆらぎ = 1/⟨N⟩)の成長倍率と、ボイド率(空セル比)の増加。
// ----      A/B 対照は H=0(膨張なし)— 膨張が構造の成長を抑えることまで機械固定する ----
{
  if (!FAST && w5cHasCosmicweb) {
    const r = await w5cGetUnit('cosmicweb');
    const d = r.webDef, z = r.webNoH;
    const growth = d.d21 / d.d20;
    // 第51便 51G 再実測(既定 H0=0.01 へ変更 — 旧既定 0.004 は評価窓の先で1塊に潰れていた):
    //   H0=0.01(既定): δ² 0.272→1.482(5.4倍)/ ボイド率 0.013→0.342(12000步でも 2.91/0.55 と
    //                   複数ノット+フィラメント維持 — 1塊にならない)
    //   H0=0  (対照): δ² →8.426(31.0倍)/ ボイド率 0.750
    //   H0=0.02      : δ² →0.748(2.8倍)/ ボイド率 0.105(膨張が速いほど構造が育たない)
    //   etaRad=0 対照: δ²=1.458(既定との差 1.6%)= E11 は構造形成の主因ではない(説明文に明記)
    // 閾値: 成長倍率 ≥ 3(実測 5.4 = 1.8倍の余裕)/ ボイド率が増加(実測 0.013→0.342)/
    //       H=0 対照の δ² が既定より大きい(実測 8.426 > 1.482 = 5.7倍)
    add('behavior.cosmicweb',
      !d.nan && !z.nan && growth >= 3 && d.void1 > d.void0 && z.d21 > d.d21,
      `6000步(共動10×10セル): δ²=Var(N)/⟨N⟩² ${d.d20.toFixed(3)} → ${d.d21.toFixed(3)}` +
      `(${growth.toFixed(1)}倍 ≥3) ボイド率 ${(d.void0 * 100).toFixed(1)}% → ${(d.void1 * 100).toFixed(1)}%(増加) ` +
      `a(t)=${d.a1.toFixed(3)} / 膨張なし対照(H=0): δ²=${z.d21.toFixed(3)}(>既定 — 膨張が成長を抑える) ` +
      `ボイド率=${(z.void1 * 100).toFixed(1)}%`);
  } else {
    console.log('SKIP behavior.cosmicweb(QA_FAST=1 または対象に 🕸️cosmicweb なし — 第37便 D3 未適用の root 等)');
  }
}

// ---- 40B パイロット) 第40便 40B(台帳4-78): claims.sync-pilot — プリセットの新設 claims
// ----      (数値主張の機械可読データ・表示はしない)の expected が、①説明文中の実測数値
// ----      (正規表現で当該数値を検索する程度の抽出で足りる)、②既存 behavior.* テストの
// ----      閾値、のいずれとも矛盾しないことを機械照合する。対象は agnjet/cosmicweb の
// ----      2プリセット・3claim(パイロット — 4-78 は本便では claims の仕組みを検証するに
// ----      とどめ、UI表示・全プリセット展開は次便裁定)----
{
  const hasClaims = await page.evaluate(() =>
    HP.allPresets().some((p) => Array.isArray(p.claims) && p.claims.length));
  if (hasClaims) {
    const r = await page.evaluate(() => {
      const get = (id) => HP.allPresets().find((p) => p.id === id);
      const findClaim = (p, id) => (p && Array.isArray(p.claims)) ? p.claims.find((c) => c.id === id) : null;
      const inRange = (x, e) => !!e && Number.isFinite(x) && x >= e.min && x <= e.max;
      const out = {};

      // agnjet.polar-fraction: ja "…84%が±y…"(既定 kRep=2)/ "…実測54% —…"(対照 kRep=0)。
      // behavior.agnjet の実閾値: 既定 frac≥2/3・対照比(既定/対照)≥1.25 と矛盾しないか
      {
        const agn = get('agnjet');
        const c = findClaim(agn, 'agnjet.polar-fraction');
        const ja = (agn && agn.description) || '';
        const mDef = ja.match(/(\d+(?:\.\d+)?)%が±y/);
        const mCtl = ja.match(/実測(\d+(?:\.\d+)?)%/);
        const defVal = mDef ? (+mDef[1] / 100) : NaN;
        const ctlVal = mCtl ? (+mCtl[1] / 100) : NaN;
        out.agnjetPolarFraction = {
          found: !!c, descMatch: !!mDef && !!mCtl, defVal, ctlVal,
          defInRange: !!c && inRange(defVal, c.expected),
          ctlInRange: !!c && !!c.control && inRange(ctlVal, c.control.expected),
          thresholdOk: !!c && c.expected.min >= 2 / 3
            && !!c.control && (c.expected.min / c.control.expected.max) >= 1.25,
        };
      }
      // cosmicweb.delta2-growth: ja "…(13.1倍)…"(既定 H=0.004)/ "…δ²=8.55・ボイド率75%…"
      // (対照 H=0。テキストは絶対値のみなので実測初期値0.272で割って倍率へ換算)。
      // behavior.cosmicweb の実閾値: growth≥3 と矛盾しないか
      {
        const cw = get('cosmicweb');
        const c = findClaim(cw, 'cosmicweb.delta2-growth');
        const ja = (cw && cw.description) || '';
        const mDef = ja.match(/\((\d+(?:\.\d+)?)倍\)/);
        const mCtl = ja.match(/δ²=(\d+(?:\.\d+)?)・ボイド率75%/);
        const defVal = mDef ? +mDef[1] : NaN;
        const ctlVal = mCtl ? (+mCtl[1] / 0.272) : NaN;
        out.cosmicwebDelta2Growth = {
          found: !!c, descMatch: !!mDef && !!mCtl, defVal, ctlVal,
          defInRange: !!c && inRange(defVal, c.expected),
          ctlInRange: !!c && !!c.control && inRange(ctlVal, c.control.expected),
          thresholdOk: !!c && c.expected.min >= 3,
        };
      }
      // cosmicweb.void-rate-final: ja "…→57.9%まで増える…"(既定)/ "…ボイド率75%)…"(対照 H=0)。
      // behavior.cosmicweb は既定内の増加(void1>void0)だけを閾値化しているので、claim側は
      // 「既定の最終域が対照の最終域を上回らない(=対照の方がボイドが育つという説明文の主張と
      // 同じ向き)」ことを非矛盾の条件とする
      {
        const cw = get('cosmicweb');
        const c = findClaim(cw, 'cosmicweb.void-rate-final');
        const ja = (cw && cw.description) || '';
        const mDef = ja.match(/→(\d+(?:\.\d+)?)%まで増える/);
        const mCtl = ja.match(/ボイド率(\d+(?:\.\d+)?)%\)/);
        const defVal = mDef ? (+mDef[1] / 100) : NaN;
        const ctlVal = mCtl ? (+mCtl[1] / 100) : NaN;
        out.cosmicwebVoidRateFinal = {
          found: !!c, descMatch: !!mDef && !!mCtl, defVal, ctlVal,
          defInRange: !!c && inRange(defVal, c.expected),
          ctlInRange: !!c && !!c.control && inRange(ctlVal, c.control.expected),
          thresholdOk: !!c && !!c.control && c.expected.max <= c.control.expected.min,
        };
      }
      return out;
    });
    const allOk = Object.values(r).every((v) => v.found && v.descMatch && v.defInRange && v.ctlInRange && v.thresholdOk);
    add('claims.sync-pilot', allOk,
      Object.entries(r).map(([k, v]) =>
        `${k}: claim有=${v.found} 数値抽出=${v.descMatch}(既定=${v.defVal}/対照=${v.ctlVal}) ` +
        `既定域内=${v.defInRange} 対照域内=${v.ctlInRange} 閾値整合=${v.thresholdOk}`).join(' / '));
  } else {
    console.log('SKIP claims.sync-pilot(対象に claims 宣言プリセットなし — 第40便 40B 未適用の root 等)');
  }
}

// ---- 42A) 第42便 42A(台帳4-78 A案): claims.sync — claims.sync-pilot の汎用版。
// ----      プリセット別にハードコードした正規表現を並べる代わりに、全プリセットの全 claims を
// ----      走査し、claim.descPattern(ja description に対する正規表現・キャプチャ群1つ)を持つ
// ----      ものについて「抽出値×descScale が expected の {min,max} 窓内か」を機械照合する。
// ----      control.descPattern があれば同様に control.expected 窓内かも見る。判定は全 claim の
// ----      AND。descPattern を持つ claim が1件も無い対象(claims 自体が無い root 等)は SKIP する。
// ----      軽量(page.evaluate 1回・正規表現マッチのみ)なので QA_FAST=1 でも実行する。
// ----      claims.sync-pilot(agnjet/cosmicweb の3claim・ハードコード版)はそのまま残置する ----
{
  const hasDescClaims = await page.evaluate(() =>
    HP.allPresets().some((p) => Array.isArray(p.claims)
      && p.claims.some((c) => typeof c.descPattern === 'string')));
  if (hasDescClaims) {
    const rows = await page.evaluate(() => {
      const inRange = (x, e) => !!e && Number.isFinite(x) && x >= e.min && x <= e.max;
      const extract = (desc, pattern, scale) => {
        try {
          const m = (desc || '').match(new RegExp(pattern));
          if (!m || m[1] === undefined) return NaN;
          return parseFloat(m[1]) * (scale === undefined ? 1 : scale);
        } catch (e) { return NaN; }
      };
      const out = [];
      for (const p of HP.allPresets()) {
        if (!Array.isArray(p.claims)) continue;
        for (const c of p.claims) {
          if (typeof c.descPattern === 'string') {
            const val = extract(p.description, c.descPattern, c.descScale);
            out.push({ label: c.id, val, min: c.expected.min, max: c.expected.max, ok: inRange(val, c.expected) });
          }
          if (c.control && typeof c.control.descPattern === 'string') {
            const cval = extract(p.description, c.control.descPattern, c.control.descScale);
            out.push({ label: c.id + '.control', val: cval,
              min: c.control.expected.min, max: c.control.expected.max, ok: inRange(cval, c.control.expected) });
          }
        }
      }
      return out;
    });
    const allOk = rows.length > 0 && rows.every((v) => v.ok);
    add('claims.sync', allOk,
      rows.map((v) => `${v.label}: ${Number.isFinite(v.val) ? v.val : 'NaN'}(窓${v.min}〜${v.max})${v.ok ? '' : ' ✗'}`).join(' / '));
  } else {
    console.log('SKIP claims.sync(対象に descPattern 付き claims 宣言なし — 第42便 42A 未適用の root 等)');
  }
}

// ---- 81B) 第81便 B(原仮定者指示): camera.follow — カメラの天体追従(描画層のみ・物理不変)。
// ----      ①「表示」カテゴリに追従コントロールがある ②validatePreset が camera.follow(整数)を
// ----      受理し、非整数・負値は警告つきで無視する ③追従ONで camX/camY が対象天体の現在位置に
// ----      一致する ④追従中のパンは「対象からのオフセット」として生き、camX=対象位置+オフセット
// ----      ⑤対象が範囲外(融合等で消滅)になったら自動で「なし」へ戻る ⑥sim.params・粒子状態は
// ----      1 つも変わらない(表示専用の証明)。未対応の対象(root 等)は SKIP。
// ----      軽量(DOM検査+短時間走行のみ)なので QA_FAST=1 でも実行する ----
{
  const hasCF = await page.evaluate(() => !!(window.HP && HP.camState && HP.setCamFollow));
  if (hasCF) {
    const r = await page.evaluate(() => {
      const res = {};
      // ① コントロールの存在(「表示」カテゴリの select)
      const sel = document.getElementById('camFollowSel');
      res.ctrl = !!sel && sel.tagName === 'SELECT';
      res.ctrlOpts = sel ? [...sel.options].map((o) => o.value) : [];
      res.ctrlInDisplay = !!(sel && sel.closest('details') &&
        /表示|Display/.test(sel.closest('details').querySelector('summary').textContent));
      // ② validatePreset の受理・拒否
      const mk = (follow) => ({ name: 'cf', description: 'd',
        camera: (follow === undefined) ? { scale: 300 } : { scale: 300, follow },
        world: { boundary: 'none', size: 0 },
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      const v2 = HP.validatePreset(mk(2));
      const vNeg = HP.validatePreset(mk(-1));
      const vFrac = HP.validatePreset(mk(1.5));
      const vStr = HP.validatePreset(mk('x'));
      const vNone = HP.validatePreset(mk(undefined));
      res.accept = v2.ok && v2.preset.camera.follow === 2;
      res.reject = [vNeg, vFrac, vStr].every((v) => v.ok && v.preset.camera.follow === undefined
        && v.warnings.some((w) => /camera\.follow/.test(w)));
      res.noneKeepsClean = vNone.ok && vNone.preset.camera.follow === undefined
        && !vNone.warnings.some((w) => /camera\.follow/.test(w));
      // ③〜⑥ 実挙動(既存プリセットは follow なし=「なし」で起動する)
      HP.loadPreset('binary', false);
      res.defaultNone = HP.camState().mode === 'none';
      const S = HP.sim;
      const before = { p: JSON.stringify(S.params), x: [...S.x], v: [...S.vx] };
      HP.selectBody(1, 'A');
      HP.setCamFollow('sel');
      HP.tick(4);
      const c1 = HP.camState();
      res.follows = c1.mode === 'sel' && c1.idx === 1
        && c1.x === S.x[1] && c1.y === S.y[1];
      // ④ 追従中のパンはオフセットとして積まれ、対象位置+オフセットになる
      HP.panCam(30, -20);
      HP.tick(4);
      const c2 = HP.camState();
      res.panOffset = c2.offX !== 0 && c2.offY !== 0
        && Math.abs(c2.x - (S.x[1] + c2.offX)) < 1e-9
        && Math.abs(c2.y - (S.y[1] + c2.offY)) < 1e-9;
      // ⑥ 表示専用: 物理パラメータ・粒子状態は追従で 1 つも変わらない(step ぶんは進む)
      res.physUntouched = JSON.stringify(S.params) === before.p;
      // ⑤ 対象が範囲外になったら自動解除(UI の選択も「なし」へ戻る)
      HP.selectBody(S.n + 10, 'A');
      HP.tick(2);
      res.autoRelease = HP.camState().mode === 'none'
        && document.getElementById('camFollowSel').value === 'none';
      HP.setCamFollow('none');
      // ⑦ プリセットに camera.follow があれば読込時に既定ON(=追従先が指定 index)。
      //    内蔵側は 🪜/⚫ の有無に依存させず、カスタムプリセット経由で経路そのものを検査する
      const saved = localStorage.getItem('hp_custom_presets');
      localStorage.setItem('hp_custom_presets', JSON.stringify([{ id: 'custom_qa_follow',
        name: 'cf', description: 'd', camera: { scale: 300, follow: 1 },
        world: { boundary: 'none', size: 0 }, seed: 7,
        physics: { G: 1, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
          cLight: 60, bM: 1, etaRad: 0, pRad: 2, gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1,
          pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 1 },
        bodies: [
          { type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true },
          { type: 'single', m: 1, x: 80, y: 0, vx: 0, vy: 1.1, spin: 0, pinned: false }] }]));
      HP.loadPreset('custom_qa_follow', false);
      const c3 = HP.camState();
      HP.tick(20);
      const c4 = HP.camState();
      res.presetFollow = c3.mode === 'preset' && c3.presetIdx === 1 && c3.idx === 1
        && c4.x === HP.sim.x[1] && c4.y === HP.sim.y[1]
        && HP.sim.x[1] !== 80   // 実際に動いている対象を追えている
        && [...document.getElementById('camFollowSel').options].map((o) => o.value).join(',') === 'none,preset,sel';
      if (saved === null) localStorage.removeItem('hp_custom_presets');
      else localStorage.setItem('hp_custom_presets', saved);
      HP.loadPreset('binary', false);
      res.afterNoFollowPreset = HP.camState().mode === 'none';
      return res;
    });
    add('camera.follow-ui',
      r.ctrl && r.ctrlInDisplay && r.ctrlOpts.length >= 2
      && r.ctrlOpts.indexOf('none') === 0 && r.ctrlOpts.indexOf('sel') >= 0
      && r.accept && r.reject && r.noneKeepsClean
      && r.defaultNone && r.follows && r.panOffset && r.physUntouched && r.autoRelease
      && r.presetFollow && r.afterNoFollowPreset,
      `コントロール=${r.ctrl}(表示カテゴリ内=${r.ctrlInDisplay}・選択肢=${r.ctrlOpts.join(',')})/ ` +
      `validate: follow=2受理=${r.accept} 不正値は警告つき無視=${r.reject} 未指定は無警告=${r.noneKeepsClean}/ ` +
      `既定なし=${r.defaultNone} 追従でcamX=天体位置=${r.follows} パン=対象からのオフセット=${r.panOffset}/ ` +
      `物理不変=${r.physUntouched} 範囲外で自動解除=${r.autoRelease}/ ` +
      `プリセット camera.follow で既定ON=${r.presetFollow}(follow なしプリセットへ戻すと「なし」=${r.afterNoFollowPreset})`);
  } else {
    console.log('SKIP camera.follow-ui(対象にカメラ追従なし — root 等。第81便)');
  }
}

// ---- 50H) 第50便 50H(台帳4-92): claims.kind — 主張の検証形態分類メタデータ。
// ----      kind ∈ {analytic, conservation, semantic, fixed-seed, multi-seed}(ChatGPT 7.5末+Minor9)。
// ----      ①全内蔵 claims が有効な kind を宣言 ②validatePreset が kind を保持し不正値は
// ----      警告つきで無視 ③説明タブの claims 折畳みに分類チップ(.claimKind)が claim 数だけ
// ----      描画され、en 切替でラベルが変わる。kind 未導入の対象(root 等)は SKIP。
// ----      軽量(走査+DOM検査のみ)なので QA_FAST=1 でも実行する ----
{
  const hasKinds = await page.evaluate(() =>
    HP.allPresets().some((p) => Array.isArray(p.claims) && p.claims.some((c) => c.kind !== undefined)));
  if (hasKinds) {
    const r = await page.evaluate(() => {
      const VALID = ['analytic', 'conservation', 'semantic', 'fixed-seed', 'multi-seed'];
      let total = 0, withKind = 0; const bad = [], dist = {};
      for (const p of HP.allPresets()) {
        if (!Array.isArray(p.claims)) continue;
        for (const c of p.claims) { total++;
          if (VALID.indexOf(c.kind) >= 0) { withKind++; dist[c.kind] = (dist[c.kind] || 0) + 1; }
          else bad.push(p.id + '/' + c.id + '=' + String(c.kind)); }
      }
      // validatePreset の往復: kind 保持+不正値は警告つき無視
      const gx = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'galaxy')));
      const v1 = HP.validatePreset(JSON.parse(JSON.stringify(gx)));
      const kept = v1.ok && v1.preset.claims.every((c, i) => c.kind === gx.claims[i].kind);
      gx.claims[0].kind = 'bogus';
      const v2 = HP.validatePreset(gx);
      const dropped = v2.ok && v2.preset.claims[0].kind === undefined
        && v2.warnings.some((w) => w.includes('kind'));
      // UI: 分類チップの描画(ja)と en 切替
      HP.loadPreset('galaxy', false);
      const det = document.querySelector('#claimsDetails');
      const chipJa = det ? det.querySelectorAll('.claimKind').length : -1;
      const txtJa = det && det.querySelector('.claimKind') ? det.querySelector('.claimKind').textContent : '';
      const nClaims = HP.allPresets().find((q) => q.id === 'galaxy').claims.length;
      return { total, withKind, bad: bad.slice(0, 5), dist, kept, dropped, chipJa, txtJa, nClaims };
    });
    add('claims.kind',
      r.total > 0 && r.withKind === r.total && r.kept && r.dropped
      && r.chipJa === r.nClaims && r.txtJa.length > 0,
      `全${r.total}claims が kind 宣言(分布: ${Object.entries(r.dist).map(([k, v]) => `${k}=${v}`).join(' ')}) / ` +
      `validatePreset 保持=${r.kept} 不正値は警告つき無視=${r.dropped} / ` +
      `UI チップ ${r.chipJa}/${r.nClaims}件(galaxy・例「${r.txtJa}」)` +
      (r.bad.length ? ` / 不正: ${r.bad.join(',')}` : ''));
  } else {
    console.log('SKIP claims.kind(対象に kind 付き claims なし — 第50便 50H 未適用の root 等)');
  }
}

// ---- 50K) 第50便 50K(台帳4-78 C案パイロット): desc.struct-sync — 構造化説明 descStruct
// ----      (summary/observe/control)。①descStruct を持つ全プリセットで
// ----      「summary+observe+control の連結 === description」(純分割の同一性 — 起動時に
// ----      description を連結から生成する実装の独立検算)を ja/en とも機械固定 ②パイロット
// ----      3件(convection/merger/probeH)が揃っている ③説明タブに区分見出し(.descSectHead)が
// ----      3つ描画され、en 切替で見出しが変わる ④validatePreset は連結不一致の descStruct を
// ----      警告つきで削除する。descStruct 未導入の対象(root 等)は SKIP。軽量なので FAST でも実行 ----
{
  const hasDS = await page.evaluate(() => HP.allPresets().some((p) => p.descStruct));
  if (hasDS) {
    const r = await page.evaluate(() => {
      const joined = (d) => (d.summary || '') + (d.observe || '') + (d.control || '');
      const bad = []; const ids = [];
      for (const p of HP.allPresets()) {
        if (p.descStruct) { ids.push(p.id);
          if (joined(p.descStruct) !== p.description) bad.push(p.id + ':ja'); }
        if (p.en && p.en.descStruct) {
          if (joined(p.en.descStruct) !== p.en.description) bad.push(p.id + ':en'); }
      }
      const pilots = ['convection', 'merger', 'probeH'].every((id) => ids.includes(id));
      // UI: 区分見出し(ja)
      HP.loadPreset('convection', false);
      const headsJa = document.querySelectorAll('#helpBody .descSectHead').length;
      const firstJa = headsJa ? document.querySelector('#helpBody .descSectHead').textContent : '';
      // validatePreset: 連結不一致は警告つき削除・一致は保持。検査は短い合成プリセットで行う
      // (validatePreset は description を200字に切り詰めるため、長い内蔵説明の往復では
      // descStruct が仕様どおり削除される — その仕様も dropped 側で確認される)
      const mkSp = (ds) => ({ id: 't', name: 't', description: '要約。観察。操作。', descStruct: ds,
        camera: { scale: 100 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: {}, overlays: {},
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
      const v1 = HP.validatePreset(mkSp({ summary: '要約。', observe: '観察。', control: '操作。' }));
      const kept = v1.ok && !!v1.preset.descStruct && joined(v1.preset.descStruct) === v1.preset.description;
      const v2 = HP.validatePreset(mkSp({ summary: 'ズレた要約。', observe: '', control: '' }));
      const dropped = v2.ok && v2.preset.descStruct === undefined && v2.warnings.some((w) => w.includes('descStruct'));
      return { nDS: ids.length, ids, bad, pilots, headsJa, firstJa, kept, dropped };
    });
    add('desc.struct-sync',
      r.bad.length === 0 && r.pilots && r.headsJa === 3 && r.firstJa.length > 0 && r.kept && r.dropped,
      `descStruct ${r.nDS}件(${r.ids.join(' ')})の連結=description 一致(ja/en)` +
      (r.bad.length ? ` / 不一致: ${r.bad.join(',')}` : '') +
      ` / パイロット3件=${r.pilots} / UI 区分見出し=${r.headsJa}(例「${r.firstJa}」) / ` +
      `validatePreset 保持=${r.kept} 連結不一致は警告つき削除=${r.dropped}`);
  } else {
    console.log('SKIP desc.struct-sync(対象に descStruct なし — 第50便 50K 未適用の root 等)');
  }
}

// ---- 43A) 第43便 43A(台帳4-78 B案): ui.claims-display — 説明タブに追加した「数値主張
// ----      (機械検証済み)」折畳み(#claimsDetails)の表示条件を検査する。
// ----      claims を持つ代表2プリセット(galaxy/spinup)ではセクションが存在し、
// ----      claim 行(.claimRow)の数が preset.claims の数と一致すること。claims の無い
// ----      プリセット(boxrot)では非表示であること。en切替で見出しラベルが変わり、
// ----      DOM 表示にも反映されること。claims 宣言のない対象(root 等)は SKIP する。
// ----      軽量(DOM検査のみ)なので QA_FAST=1 でも実行する ----
{
  const setup = await page.evaluate(() => {
    const galaxy = HP.allPresets().find((p) => p.id === 'galaxy');
    const spinup = HP.allPresets().find((p) => p.id === 'spinup');
    const boxrot = HP.allPresets().find((p) => p.id === 'boxrot');
    return {
      galaxyN: (galaxy && Array.isArray(galaxy.claims)) ? galaxy.claims.length : 0,
      spinupN: (spinup && Array.isArray(spinup.claims)) ? spinup.claims.length : 0,
      hasBoxrot: !!boxrot,
      boxrotHasClaims: !!(boxrot && Array.isArray(boxrot.claims) && boxrot.claims.length),
    };
  });
  if (setup.galaxyN > 0 && setup.spinupN > 0 && setup.hasBoxrot && !setup.boxrotHasClaims) {
    const r = await page.evaluate(() => {
      const inspect = (id) => {
        HP.loadPreset(id, false);
        const det = document.querySelector('#claimsDetails');
        return {
          present: !!det,
          rows: det ? det.querySelectorAll('.claimRow').length : 0,
          summary: det ? det.querySelector('summary').textContent : null,
        };
      };
      HP.setLang('ja');
      const headJa = HP.T('claimsHead');
      const galaxyJa = inspect('galaxy');
      const spinupJa = inspect('spinup');
      const boxrotJa = inspect('boxrot');
      HP.setLang('en');
      const headEn = HP.T('claimsHead');
      const galaxyEn = inspect('galaxy');
      HP.setLang('ja');
      HP.loadPreset('saturn', false);   // 後続項目のため既定プリセットへ戻す
      return { headJa, headEn, galaxyJa, spinupJa, boxrotJa, galaxyEn };
    });
    const ok = r.galaxyJa.present && r.galaxyJa.rows === setup.galaxyN
      && r.spinupJa.present && r.spinupJa.rows === setup.spinupN
      && !r.boxrotJa.present
      && r.headJa !== r.headEn
      && r.galaxyEn.present && r.galaxyEn.summary === r.headEn && r.galaxyEn.summary !== r.headJa;
    add('ui.claims-display', ok,
      `galaxy: present=${r.galaxyJa.present} rows=${r.galaxyJa.rows}/${setup.galaxyN} / `
      + `spinup: present=${r.spinupJa.present} rows=${r.spinupJa.rows}/${setup.spinupN} / `
      + `boxrot: present=${r.boxrotJa.present}(期待false) / `
      + `ja見出し="${r.headJa}" en見出し="${r.headEn}" / en切替後DOM見出し(galaxy)="${r.galaxyEn.summary}"`);
  } else {
    console.log('SKIP ui.claims-display(対象に galaxy/spinup の claims 宣言または boxrot が揃っていない — 第43便 43A 未適用の root 等)');
  }
}

// ---- 45C) 第45便 45C(台帳4-85): ui.strongfield-badge — 説明タブの分類バッジ列(#classChips)に
// ----      追加した「⚠強場トイ領域」チップ(data-g=strongfield)の表示条件を検査する。
// ----      ψ_static = max(universeBox の D/Kt, 各 single 天体の m/(max(R,ε)·Kt)) が 0.5 を
// ----      超えるプリセットでのみ出現すること。強場代表は galaxy(中心星 m=2500・radius=15・
// ----      Kt=50 → ψ_static≈3.33 — universeBox の D=80/Kt=300(ψ=0.267)は対象外なので使わない)。
// ----      弱場代表は gclock(m=1500・rMul=1.2・Kt=300 → ψ_static≈0.108)。en切替でラベル
// ----      (HP.T('bdgStrongField'))が変わり、DOM表示にも反映されること。HP.strongFieldPsi/
// ----      classifyPreset または対象プリセットが揃わない対象(root等)は SKIP する。
// ----      軽量(page.evaluate 2回・DOM検査のみ)なので QA_FAST=1 でも実行する ----
{
  const setup = await page.evaluate(() => {
    const hasFn = typeof HP.strongFieldPsi === 'function' && typeof HP.classifyPreset === 'function';
    const galaxy = HP.allPresets().find((p) => p.id === 'galaxy');
    const gclock = HP.allPresets().find((p) => p.id === 'gclock');
    return {
      hasFn, hasGalaxy: !!galaxy, hasGclock: !!gclock,
      galaxyPsi: (hasFn && galaxy) ? HP.strongFieldPsi(galaxy) : null,
      gclockPsi: (hasFn && gclock) ? HP.strongFieldPsi(gclock) : null,
    };
  });
  if (setup.hasFn && setup.hasGalaxy && setup.hasGclock
      && setup.galaxyPsi > 0.5 && setup.gclockPsi !== null && setup.gclockPsi <= 0.5) {
    const r = await page.evaluate(() => {
      const inspect = (id) => {
        HP.loadPreset(id, false);
        const chip = document.querySelector('#classChips .classChip[data-g="strongfield"]');
        return { present: !!chip, text: chip ? chip.textContent : null };
      };
      HP.setLang('ja');
      const galaxyJa = inspect('galaxy');
      const gclockJa = inspect('gclock');
      const labelJa = HP.T('bdgStrongField');
      HP.setLang('en');
      const labelEn = HP.T('bdgStrongField');
      const galaxyEn = inspect('galaxy');
      HP.setLang('ja');
      HP.loadPreset('saturn', false);   // 後続項目のため既定プリセットへ戻す
      return { galaxyJa, gclockJa, labelJa, labelEn, galaxyEn };
    });
    const ok = r.galaxyJa.present && r.galaxyJa.text === r.labelJa
      && !r.gclockJa.present
      && r.labelJa !== r.labelEn
      && r.galaxyEn.present && r.galaxyEn.text === r.labelEn && r.galaxyEn.text !== r.labelJa;
    add('ui.strongfield-badge', ok,
      `galaxy: ψ_static=${setup.galaxyPsi.toFixed(3)} present=${r.galaxyJa.present}(期待true) / `
      + `gclock: ψ_static=${setup.gclockPsi.toFixed(3)} present=${r.gclockJa.present}(期待false) / `
      + `jaラベル="${r.labelJa}" enラベル="${r.labelEn}" / en切替後DOM(galaxy)="${r.galaxyEn.text}"`);
  } else {
    console.log('SKIP ui.strongfield-badge(対象に galaxy/gclockのψ_static条件またはHP.strongFieldPsi/classifyPresetが揃っていない — 第45便 45C 未適用の root 等)');
  }
}

// ---- 80A) 第80便 A(E6′-R): physics.frameReaction:"pairReduced" — 換算質量対称インパルス ----
// ① reaction.pair-momentum: 閉鎖系(D0=0・境界なし・全自由・正質量のみ)で、自由対の
//    線運動量・角運動量が**帳簿なしで**閉じる(resP=resL=0 のまま相対ずれが 1e-6/1e-5 未満)。
//    legacy も同じ構成で保存するが、pairReduced は対単位で構成的に閉じる(A13 の対単位実現)。
// ② reaction.pair-test-particle-limit: 重い pinned 中心+軽粒子では、pairReduced の
//    「pinned 相手 φ·d + 背景 φ_bg·d = d」が legacy の直接適用と同式になる — 軽粒子側の
//    E6′ 応答は**厳密に一致**する。中心を自由にしても差は 0.1% 程度に留まる(提案 §4.4)。
// 軽量(粒子8体・2体系の短時間走行)なので QA_FAST=1 でも実行する。未対応の対象は SKIP。
{
  const hasPR = await page.evaluate(() => {
    const v = HP.validatePreset({ name: 'x', description: 'd', camera: { scale: 100 },
      world: { boundary: 'none', size: 0 },
      physics: { frameReaction: 'pairReduced' },
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
    return !!(v.ok && v.preset.physics.frameReaction === 'pairReduced');
  });
  if (hasPR) {
    const r = await page.evaluate(() => {
      const PH = (fr, extra) => ({ G: 0.6, D0: 0, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0,
        kappaS: 0, Kt: 300, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1,
        ...(extra || {}), ...(fr ? { frameReaction: fr } : {}) });
      // ① 閉鎖系: 8体・正質量のみ・全自由・D0=0・境界なし
      const closed = (fr) => {
        const bodies = [];
        for (let i = 0; i < 8; i++) { const a = i * 0.7853981633974483, rr = 30 + 11 * i;
          bodies.push({ type: 'single', m: 1 + 0.9 * i, x: rr * Math.cos(a), y: rr * Math.sin(a),
            vx: -0.4 * Math.sin(a), vy: 0.4 * Math.cos(a), spin: 0.25 * (i % 3) - 0.25,
            pinned: false, rMul: 1 }); }
        const v = HP.validatePreset({ name: 'closed', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, seed: 20260805, physics: PH(fr), bodies });
        HP.sim.build(v.preset);
        const S = HP.sim;
        const t0 = S.totals(), L0 = t0.L + S.resL + S.radL;
        for (let k = 0; k < 1500; k++) S.step(0.016);
        const t1 = S.totals();
        let pS = 0, lS = 0;
        for (let i = 0; i < S.n; i++) {
          pS += Math.abs(S.m[i] * S.vx[i]) + Math.abs(S.m[i] * S.vy[i]);
          lS += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
            + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
        }
        return { relP: Math.hypot(t1.px - t0.px, t1.py - t0.py) / Math.max(pS, 1e-9),
          relL: Math.abs(t1.L + S.resL + S.radL - L0) / Math.max(lS, 1e-9),
          resP: Math.hypot(S.resPx, S.resPy), resL: S.resL,
          clampR: S.clampRN || 0, bad: S.hasNaN() };
      };
      // ② テスト粒子極限: 中心 m=2500(pinned/自由)+ 軽粒子 m=0.05・D0=1.5
      const tp = (fr, pin, kF) => {
        const v = HP.validatePreset({ name: 'tp', description: 'd', camera: { scale: 200 },
          world: { boundary: 'none', size: 0 }, seed: 20260805, physics: PH(fr, { G: 0.8, D0: 1.5, kFrame: kF, Kt: 50, softening: 3 }),
          bodies: [
            { type: 'single', m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 3, pinned: pin, radius: 15, rMul: 1 },
            { type: 'single', m: 0.05, x: 120, y: 0, vx: 0, vy: Math.sqrt(0.8 * 2500 / 120),
              spin: 0, pinned: false, radius: 1, rMul: 1 }] });
        HP.sim.build(v.preset);
        const S = HP.sim;
        for (let k = 0; k < 200; k++) S.step(0.016);
        return [S.vx[1], S.vy[1]];
      };
      const resp = (fr, pin) => { const a = tp(fr, pin, 1), z = tp(fr, pin, 0);
        return [a[0] - z[0], a[1] - z[1]]; };
      const nrm = (v) => Math.hypot(v[0], v[1]);
      const dif = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) / Math.max(nrm(b), 1e-30);
      const legPin = resp(null, true), prPin = resp('pairReduced', true), prFree = resp('pairReduced', false);
      return { pair: closed('pairReduced'), legacy: closed(null),
        respLegacy: nrm(legPin), relPin: dif(prPin, legPin), relFree: dif(prFree, legPin) };
    });
    add('reaction.pair-momentum',
      !r.pair.bad && r.pair.clampR === 0 && r.pair.resP === 0 && r.pair.resL === 0
      && r.pair.relP < 1e-6 && r.pair.relL < 1e-5,
      `pairReduced: |ΔP|/scale=${r.pair.relP.toExponential(1)}(<1e-6) |ΔL|/scale=${r.pair.relL.toExponential(1)}(<1e-5) ` +
      `帳簿 resP=${r.pair.resP} resL=${r.pair.resL}(自由対のみ=帳簿なしで閉じる) 上限=${r.pair.clampR} / ` +
      `legacy 対照: ${r.legacy.relP.toExponential(1)} / ${r.legacy.relL.toExponential(1)}`);
    add('reaction.pair-test-particle-limit',
      r.respLegacy > 0 && r.relPin < 1e-9 && r.relFree < 5e-3,
      `固定中心での差=${r.relPin.toExponential(1)}(<1e-9 — 解析的に同式)/ ` +
      `自由中心での差=${r.relFree.toExponential(1)}(<5e-3 = 0.5%)/ legacy 応答=${r.respLegacy.toExponential(2)}`);
  } else {
    console.log('SKIP reaction.pair-*(対象に physics.frameReaction:"pairReduced" なし — root 等。第80便)');
  }
}

// ---- 82A) 第82便 A(光学輸送拡張): 体積吸収・波長依存(赤化)・散乱 ----
// ① optics.dynamics-invariant: 吸収 on/off で軌道・スピン・固有時計 τ が **bit 一致**
//    (dimming.dynamics-invariant と同格の機械固定 — 光学輸送は観測層のみという主張の証明)。
//    同時に、光線の**幾何**(終端位置・方向)も bit 一致し、τ_ref だけが 0→正になることを見る。
// ② optics.default-bitequal: 既定値(kAbs=0/pAbs=4/fScat=0)は validatePreset が physics へ
//    書き出さない ⇒ 既存プリセットの署名・エクスポート JSON が 1 文字も変わらない。
//    併せて 全内蔵プリセットで τ_ref≡0(🌆reddening を除く)・rayKeyOf に光学節が出ないことも見る。
// ③ claim.reddening: 🌆reddening の固定seed受入(τ_ref・青/赤透過率比・雲の脇の厳密0・
//    pAbs 掃引・kAbs 用量反応)。較正実測は tests/exp-4-83.mjs。
// いずれも軽量(154粒子・2000步1本)なので QA_FAST=1 でも実行する。未対応の対象は SKIP。
{
  const hasOptics = await page.evaluate(() => {
    const v = HP.validatePreset({ name: 'x', description: 'd', camera: { scale: 100 },
      world: { boundary: 'none', size: 0 }, physics: { kAbs: 0.5, pAbs: 2, fScat: 0.25 },
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
    return !!(v.ok && v.preset.physics.kAbs === 0.5 && typeof HP.opticsTransmit === 'function');
  });
  if (hasOptics) {
    // ---- ① 力学 bit 不変 ----
    const inv = await page.evaluate(() => {
      const PH = (o) => ({ G: 0.5, D0: 2, kFrame: 1, q: 2, kRep: 0.5, muF: 0.3, gammaN: 0.2, kappaS: 0.05,
        Kt: 200, cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 2, softening: 3, timeScale: 1, ...(o || {}) });
      const run = (opt) => {
        const v = HP.validatePreset({ name: 'qa_opt', description: 'd', camera: { scale: 300 },
          world: { boundary: 'none', size: 0 }, seed: 20260806, physics: PH(opt),
          bodies: [
            { type: 'single', rMul: 1.2, m: 900, x: -60, y: 0, vx: 0, vy: 0, spin: 1.1, pinned: true, radius: 12 },
            { type: 'disk', rMul: 4, n: 60, cx: 120, cy: 0, radius: 90, mMin: 0.4, mMax: 0.9,
              spinMin: 0, spinMax: 0.8, vMode: 'kepler', aroundMass: 900, vScale: 1, direction: 1,
              bulkVx: 0, bulkVy: 0 }] });
        HP.sim.build(v.preset);
        const S = HP.sim;
        for (let k = 0; k < 2000; k++) S.step(0.016);
        const r0 = HP.traceRay(S, -400, 0, 1, 0, 2.7, 400, null);
        const r1 = HP.traceRay(S, -400, 120, 1, 0, 2.7, 400, null);
        return { x: [...S.x], y: [...S.y], vx: [...S.vx], vy: [...S.vy], sp: [...S.spin], tau: [...S.tau],
          ray: [r0.x, r0.y, r0.cx, r0.cy, r1.x, r1.y, r1.cx, r1.cy], t0: r0.tau, t1: r1.tau,
          n: S.n, nan: S.hasNaN(), kAbs: S.params.kAbs === undefined ? null : S.params.kAbs };
      };
      const diff = (a, b) => { let d = 0;
        for (let i = 0; i < a.n; i++) for (const k of ['x', 'y', 'vx', 'vy', 'sp', 'tau']) if (a[k][i] !== b[k][i]) d++;
        return d; };
      const rayDiff = (a, b) => { let d = 0; for (let i = 0; i < a.ray.length; i++) if (a.ray[i] !== b.ray[i]) d++; return d; };
      const off = run({}), on = run({ kAbs: 4 }), sc = run({ kAbs: 4, fScat: 0.4, pAbs: 2 });
      HP.loadPreset('saturn', false);
      return { n: off.n, dOn: diff(off, on), dSc: diff(off, sc),
        rOn: rayDiff(off, on), rSc: rayDiff(off, sc),
        tauOff: off.t0, tauOn: on.t0, tauOffClear: off.t1, tauOnClear: on.t1,
        kAbsOff: off.kAbs, kAbsOn: on.kAbs, nan: off.nan || on.nan || sc.nan };
    });
    add('optics.dynamics-invariant',
      !inv.nan && inv.dOn === 0 && inv.dSc === 0 && inv.rOn === 0 && inv.rSc === 0
      && inv.kAbsOff === null && inv.kAbsOn === 4 && inv.tauOff === 0 && inv.tauOn > 0.1,
      `吸収なし vs kAbs=4 vs kAbs=4+散乱(${inv.n}粒子・2000步): 力学+時計の不一致=${inv.dOn}/${inv.dSc}` +
      `(厳密0 — x,y,vx,vy,spin,τ)・光線の幾何(終端位置/方向)の不一致=${inv.rOn}/${inv.rSc}(厳密0)/ ` +
      `光学的深さ τ_ref=${inv.tauOff}→${inv.tauOn.toFixed(4)}(吸収は τ にだけ乗る)・` +
      `雲外の光線=${inv.tauOnClear}(コンパクト台の外は厳密0)/ 既定は physics に kAbs キーごと不在=${inv.kAbsOff === null}`);

    // ---- ② 既定値 bit 等価(署名・エクスポート・光線キー・全プリセット τ≡0)----
    const dfl = await page.evaluate(() => {
      const base = { name: 'qa_dflt', description: 'd', camera: { scale: 100 },
        world: { boundary: 'none', size: 0 },
        bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] };
      const sig = (ph) => JSON.stringify(HP.validatePreset({ ...base, physics: ph }).preset.physics);
      const bare = sig({ G: 1 });
      const explicit = sig({ G: 1, kAbs: 0, pAbs: 4, fScat: 0 });
      const vNeg = HP.validatePreset({ ...base, physics: { G: 1, kAbs: -1, fScat: 5 } });
      const vBad = HP.validatePreset({ ...base, physics: { G: 1, kAbs: 'x' } });
      // 全内蔵プリセット: 既定のままの presets には光学キーが 1 つも書き出されない
      // 第83便C: バリデータを通らない内蔵4件の除外(`if(!v.ok) continue;`)を撤去し全件対象へ戻した
      // (根本原因は解消済み — preset.validate-all-builtins が「全内蔵が致命エラー0」を独立に固定する)。
      // 通らない内蔵が再び生じたら valNg に載せてここでも FAIL させる
      const leak = [], valNg = [];
      for (const p of HP.allPresets()) {
        if (String(p.id).startsWith('custom_')) continue;
        const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
        if (!v.ok) { valNg.push(p.id); continue; }
        const has = ['kAbs', 'pAbs', 'fScat'].filter((k) => v.preset.physics[k] !== undefined);
        if (has.length && p.id !== 'reddening') leak.push(p.id + ':' + has.join('+'));
      }
      // 光線を持つ内蔵プリセットの τ_ref はすべて厳密 0(🌆reddening を除く)
      const tauLeak = [];
      let keyPlain = '', keyOpt = '';
      for (const p of HP.allPresets()) {
        if (!p.rays || p.id === 'reddening' || String(p.id).startsWith('custom_')) continue;
        HP.loadPreset(p.id, false);
        const t = HP.traceRay(HP.sim, -400, 20, 1, 0, 2.7, 400, null).tau;
        if (t !== 0) tauLeak.push(p.id + '=' + t);
        if (!keyPlain) {
          keyPlain = HP.rayKeyOf(HP.sim.rays);
          HP.sim.params.kAbs = 0.5; keyOpt = HP.rayKeyOf(HP.sim.rays); delete HP.sim.params.kAbs;
        }
      }
      HP.loadPreset('saturn', false);
      return { bare, explicit, same: bare === explicit,
        negOk: vNeg.ok && vNeg.preset.physics.kAbs === undefined && vNeg.preset.physics.fScat === 1
          && vNeg.warnings.some((w) => /kAbs/.test(w)),
        badOk: !vBad.ok, leak, valNg, tauLeak,
        keyPlainNoOptics: keyPlain.indexOf(';O') < 0, keyOptHasOptics: keyOpt.indexOf(';O') >= 0,
        keyGrew: keyOpt.length > keyPlain.length };
    });
    add('optics.default-bitequal',
      dfl.same && dfl.negOk && dfl.badOk && dfl.leak.length === 0 && dfl.valNg.length === 0
      && dfl.tauLeak.length === 0
      && dfl.keyPlainNoOptics && dfl.keyOptHasOptics && dfl.keyGrew,
      `既定値明示 {kAbs:0,pAbs:4,fScat:0} と省略の physics が文字単位一致=${dfl.same}` +
      `(=署名・エクスポート JSON 不変)/ 値域外は警告つきクランプ後に既定なら削除=${dfl.negOk}・` +
      `非数は致命=${dfl.badOk}/ 光学キーが漏れた内蔵=[${dfl.leak.slice(0, 4).join(' ')}](0件・` +
      `第83便Cで除外リスト撤去 → 全内蔵が対象。検証子を通らない内蔵=[${dfl.valNg.join(' ')}](0件))/ ` +
      `光線プリセットの τ_ref≠0=[${dfl.tauLeak.slice(0, 4).join(' ')}](0件)/ ` +
      `rayKeyOf: 既定に光学節なし=${dfl.keyPlainNoOptics} kAbs>0 で吸収体を追跡=${dfl.keyOptHasOptics}`);

    // ---- ③ claim.reddening(🌆 デモサンプルの固定seed受入)----
    const hasRed = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'reddening'));
    if (hasRed) {
      const r = await page.evaluate(() => {
        const base = JSON.parse(JSON.stringify(HP.allPresets().find((p) => p.id === 'reddening')));
        const tauAt = (y) => HP.traceRay(HP.sim, -310, y, 1, 0, 2.7, 400, null).tau;
        const build = (mod) => { const p = JSON.parse(JSON.stringify(base));
          Object.assign(p.physics, mod || {});
          if (mod && mod.pAbs === undefined) delete p.physics.pAbs;
          HP.sim.build(HP.validatePreset(p).preset); return HP.sim; };
        build({});
        const S = HP.sim, LR = HP.ABS_LAMBDA_REF;
        const tauCloud = tauAt(0), tauClear = tauAt(200);
        const tr = (t, lam) => HP.opticsTransmit(t, lam, LR);
        const ratio = tr(tauCloud, 450) / tr(tauCloud, 650);
        // pAbs 掃引(0=グレー / 2 / 4=既定)
        const pr = [0, 2, 4].map((pA) => { build({ pAbs: pA }); const t = tauAt(0);
          return HP.opticsTransmit(t, 450, LR, HP.sim.params) / HP.opticsTransmit(t, 650, LR, HP.sim.params); });
        // kAbs 用量反応(τ/kAbs が一定)
        const k0 = base.physics.kAbs;
        const dose = [k0 / 2, k0, k0 * 2].map((k) => { build({ kAbs: k }); return tauAt(0) / k; });
        build({});
        return { n: S.n, kAbs: S.params.kAbs, fScat: S.params.fScat,
          supportK: HP.ABS_SUPPORT_K, lamRef: LR,
          tauCloud, tauClear, Tblue: tr(tauCloud, 450), Tred: tr(tauCloud, 650), ratio,
          pr, dose, doseSpread: Math.max(...dose) - Math.min(...dose),
          nan: S.hasNaN(), heavy: (() => { let c = 0; for (let i = 0; i < S.n; i++) if (HP.rayHeavy(S, i)) c++; return c; })() };
      });
      add('claim.reddening',
        !r.nan && r.n === 154 && r.heavy === 0
        && r.tauCloud >= 2.19 && r.tauCloud <= 2.67 && r.tauClear === 0
        && r.ratio >= 0.0139 && r.ratio <= 0.0169
        && Math.abs(r.pr[0] - 1) < 1e-12 && r.pr[1] > r.ratio && r.pr[1] > 0.135 && r.pr[1] < 0.167
        && r.doseSpread < 1e-12,
        `🌆reddening(${r.n}粒子・光線源0本=純吸収・λ_ref=${r.lamRef}nm・台係数K=${r.supportK}): ` +
        `雲中心 τ_ref=${r.tauCloud.toFixed(4)}(窓2.19〜2.67・実測2.429) T(450)=${r.Tblue.toFixed(4)} ` +
        `T(650)=${r.Tred.toFixed(4)} 青/赤=${r.ratio.toFixed(4)}(窓0.0139〜0.0169・実測0.0154)/ ` +
        `雲の脇 τ_ref=${r.tauClear}(厳密0 = コンパクト台)/ pAbs 掃引 0/2/4 の青赤比=` +
        `${r.pr.map((v) => v.toFixed(4)).join('/')}(pAbs=0 は厳密に1)/ ` +
        `kAbs 用量反応 τ/kAbs=${r.dose.map((v) => v.toFixed(6)).join('/')}(ばらつき=${r.doseSpread.toExponential(1)})`);
    } else {
      console.log('SKIP claim.reddening(対象に 🌆reddening なし — root 等。第82便)');
    }
  } else {
    console.log('SKIP optics.*/claim.reddening(対象に physics.kAbs(光学輸送)なし — root 等。第82便)');
  }
}

// ---- 85) 第85便(休眠検出の再発防止): qa.testid-live ----
// ----   第84便B が見つけた事故の型 =「claims の testId が指す QA テストが、廃止済み API を見る
// ----   古い判定子(`HP.sim.obsT`)に閉じ込められて**フルQAでも一度も走っていない**」。
// ----   claims.sync / claims.sync-pilot は claim の窓と説明文の数値の一致だけを見るので、
// ----   testId の先が実在するか・実行されるかは誰も検査していなかった(第85便で発覚)。
// ----   本ゲートは全 claims 横断で次の2点を機械検査する(DOM 不要 = 追加の走行コストなし):
// ----     ① 定義: testId が qa.mjs に `add('<testId>'` として実在する(常に判定)
// ----     ② 実行: そのテストが**このラン中に実際に results へ入った**(!FAST のときだけ判定)
// ----   ② を FAST で判定しないのは、!FAST ガードつきの重量テスト(behavior.darkrotorLong 等)が
// ----   QA_FAST では正当に走らないため。FAST では未実行分を detail に列挙するだけに留める
// ----   (= QA_FAST への時間増はゼロ。本ゲート自体も page.evaluate 1回+文字列検索のみ)。
// ----   置き場所は全テストの後(results が出そろってから判定する必要があるため)----
{
  const claimList = await page.evaluate(() => {
    const o = [];
    for (const p of HP.allPresets())
      if (Array.isArray(p.claims)) for (const c of p.claims)
        o.push({ preset: p.id, id: c.id, testId: c.testId || null });
    return o;
  });
  if (claimList.length) {
    const qaSrc = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
    const ids = [...new Set(claimList.map(c => c.testId).filter(Boolean))].sort();
    const ranIds = new Set(results.map(r => r.id));
    const where = (id) => claimList.filter(c => c.testId === id).map(c => `${c.preset}:${c.id}`).join(',');
    // 定義の判定は `add('<id>'` の文字列一致(qa.mjs の add() 呼び出しは全て単一引用符のリテラル)。
    // 末尾の引用符まで含めるので behavior.darkrotor と behavior.darkrotor-pitch を取り違えない
    const undef = ids.filter(id => !qaSrc.includes(`add('${id}'`));
    const dormant = ids.filter(id => !undef.includes(id) && !ranIds.has(id));
    const noTid = claimList.filter(c => !c.testId);
    add('qa.testid-live', undef.length === 0 && (FAST || dormant.length === 0),
      `claims=${claimList.length}件(${new Set(claimList.map(c => c.preset)).size}プリセット)・` +
      `testId 実体=${ids.length}種 → qa.mjs に定義あり=${ids.length - undef.length}/${ids.length}` +
      `(未定義=[${undef.map(id => id + '←' + where(id)).join(' ')}]) / ` +
      `このランで実行済み=${ids.length - undef.length - dormant.length}/${ids.length - undef.length}` +
      `(未実行=${dormant.length}件[${dormant.slice(0, 8).join(' ')}${dormant.length > 8 ? ' …他' + (dormant.length - 8) + '件' : ''}]` +
      `${FAST ? ' — QA_FAST では !FAST ガードのぶんが正当に未実行なので判定対象外' : ' — !FAST なので 0件であること'}) / ` +
      `testId 無しの claim=${noTid.length}件(${noTid.map(c => c.preset + ':' + c.id).join(',') || 'なし'}` +
      `— 説明文の数値だけを固定する claim は testId を持たなくてよいので判定しない) / ` +
      `第85便: 🕶️ の behavior.darkrotorLong・behavior.darkrotor-pitch が「定義あり・未実行」で ` +
      `第84便まで休眠していた(門が第61便で廃止された HP.sim.obsT を見ていた)— 本ゲートはその再発を検出する`);
  } else {
    console.log('SKIP qa.testid-live(対象に claims 宣言プリセットなし)');
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
// 第53便 53B(外部レビュー P2「beta の完全な結果JSONが最終状態に残らない」): 検査対象ごとに
// ファイルを分ける — beta 対象時は qa-results-beta.json へも同内容を保存する(qa-results.json は
// 従来どおり常に書く = CI・既存ツールの参照は不変。root 実行が beta の証跡を上書きしない)
const QA_OUT = JSON.stringify({
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
}, null, 1);
fs.writeFileSync(path.join(OUT_DIR, 'qa-results.json'), QA_OUT);
if (TARGET.startsWith('beta/')) fs.writeFileSync(path.join(OUT_DIR, 'qa-results-beta.json'), QA_OUT);
console.log(`\n${pass ? 'ALL PASS' : 'FAILED'} (${results.filter(r => r.pass).length}/${results.length}) → tests/out/qa-results.json${TARGET.startsWith('beta/') ? ' (+qa-results-beta.json)' : ''}`);
process.exit(pass ? 0 : 1);

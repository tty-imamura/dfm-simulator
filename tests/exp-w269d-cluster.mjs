// 第269便d(第59報 W4)「**星団 47 Tuc の比較サンプル v1a**: 内部診断の完成」。
//
// ■ 原仮定者の指示(第59報): 「ブラックホール連星、星団、銀河の各サンプルの完成を目指す」。
//   統括の読み (A): **「完成」= 比較サンプル v1** である ——「観測一致」ではない。
//   統括の読み (D): 星団は 2 段階に分ける。
//     **v1a(本器)= 内部診断の完成** —— 共通 f・virial 初期化・**中心の契約**・半質量半径 2 種・
//       分散・束縛率・コア半径を、**3 刻み(h/h2/h4)× seed × N** で別々に測り、
//       **どの量が数値的に未解決か**を明示状態で出す。
//     **v1b = 観測比較用の別抽出器の設計宣言**(本便は**実装しない** —— JSON `v1bDesign` と文書に宣言だけ)。
//
// ■ 本器が**しないこと**(厳守)
//   ・🍇 tuc47 / 🫐 tuc47DFM の **JSON・入力を 1 bit も書き換えない**(新版 GGCD は採らない)。
//   ・**新しいプリセットを足さない**(走るのは `sampleClass:"principle"` の診断コピーだけ)。
//   ・**エンジンを 3D 化しない**(z/vz を補って「視線速度分散を測った」としない)。
//   ・**47 Tuc の観測量と値の比較を出さない** —— 観測量はすべて `mapping-unresolved` /
//     `not-applicable` / `not-measurable` で、`stateRecord` が比較の数の同梱を**器で止める**。
//   ・`tests/exp-w265a-analogy.mjs`(旧器)と `tests/out/analogy-w265a.json`(旧 JSON)は**対照として温存**。
//   ・`S._core` には 1 命令も足していない(ページは読むだけ)。
//
// ■ この器が**言わないこと**
//   「47 Tuc と比べられる投影半径を作った」「視線速度分散を測った」「観測と合った」「収束済み」
//   「星団を較正した」「星団サンプルが完成した(観測一致版)」。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w269d-cluster.mjs
//   [--only base,seed,n] [--cl-T 9.6]
// 出力: tests/out/cluster-w269d.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3, protocolDeclaration } from './lib-w265a-analogy.mjs';
import { STATES, stateRecord, numericalVerdict, halfRadiusRatioTheory } from './lib-w269d-state.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'cluster-w269d.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();
const want = (tag) => !ONLY || ONLY.includes(tag);
const DT0 = 0.016;
const DIVS = [1, 2, 4];
const CL_T = Number(arg('--cl-T', 9.6));      // **第265便a と同じ終了時刻**(保存値の再現に使う)
// seed 感度: **プリセットの JSON は触らず、診断コピーの seed だけ変える**(2 本)
const SEEDS = [269104001, 269104002];
// N 感度: 半分と 2 倍。**既定で総質量を保存**する(m ← m×240/N)
const NS = [120, 480];

// **第265便a の保存値**(照合のためだけの定数。観測値ではない)
const PRELIM = { tuc47_projHalfMass_T9p6: [7.637, 7.627, 7.441] };
// 第265便a の**実測**(tests/out/analogy-w265a.json の asIs_tuc47 列・原点基準)—— 再現の照合先
const SAVED_W265A = { projected: [4.32158899307251, 4.409515857696533, 4.305429458618164],
  twoD: [7.417587937593405, 7.370095141938997, 7.3895010765744855],
  core: [3.081144871350859, 5.635947186076264, 5.572675389740999],
  sigma: [1.8812670609513202, 1.9021447800729312, 1.9084223005533834] };

const sha = (rel) => { try { return crypto.createHash('sha256')
  .update(fs.readFileSync(path.join(ROOT, rel))).digest('hex').slice(0, 16); } catch { return null; } };
const stamp = (rel) => { try { const st = fs.statSync(path.join(ROOT, rel));
  return { file: rel, bytes: st.size, mtime: st.mtime.toISOString(), sha256_16: sha(rel) }; }
  catch { return { file: rel, missing: true }; } };
let headSha = null;
try { headSha = execSync('git -C ' + JSON.stringify(ROOT) + ' rev-parse HEAD',
  { encoding: 'utf8' }).trim().slice(0, 12); } catch { headSha = null; }

// ---- CSV(**観測量の名前を読むだけ**。値は 1 つも比較に使わない)
function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur); return cols;
}
const CSV_REL = 'paper/data/cluster-galaxy-observations.csv';
const tucRows = [];
{
  const lines = fs.readFileSync(path.join(ROOT, CSV_REL), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!line.trim() || line.startsWith('body,')) return;
    const c = parseCsvLine(line);
    if (c[0] !== '47 Tuc') return;
    const note = c[7] || '';
    tucRows.push({ row: i + 1, quantity: c[1], unit: c[3],
      source: String(c[4]).slice(0, 60),
      sigmaPresent: !!(c[8] && c[8].trim()),
      sigmaKind: (note.match(/sigma_kind=([a-z-]+)/) || [])[1] || null,
      sigmaPrimary: (note.match(/sigma_primary=([a-z]+)/) || [])[1] || null });
  });
}

// ---- 観測量の**状態**(統括の読み (A) ③ (D))。**値の比較は 1 つも作らない。**
function stateForQuantity(q) {
  const base = q.replace(/_candidate$/, '').replace(/\(.*\)$/, '').trim();
  if (/^sigma_los/.test(base)) return { state: 'not-applicable',
    why: '**視線方向が無い**(2D エンジンに z/vz は無い)。面内 1 成分 v_y は視線速度分散ではない ——'
      + 'z/vz を補って「視線速度分散を測った」とはしない(統括の読み (D))。' };
  if (base === 'sigma0') return { state: 'not-applicable',
    why: '中心 1D 視線分散である(GGCD の N-body fit の中心外挿)。**視線方向が無い**ので'
      + '本器の面内 1 成分と同じ量にならない。**モデル依存の外挿でもある**(直接観測の独立測定ではない)。' };
  if (/^sigma_pm/.test(base)) return { state: 'mapping-unresolved',
    why: '天球面 2 成分の固有運動分散である。面内 (vx, vy) と対応させるには「**シミュレーション面 = 天球面**」'
      + 'という宣言が要り、現行の抽出器の宣言(x へ射影・y を「視線」と呼ぶ)と両立しない。'
      + 'さらに開口・トレーサー選択・距離換算(v=4.74047 D[kpc] μ[mas/yr])が未固定である。' };
  if (base === 'half_mass_radius_3d') return { state: 'not-applicable',
    why: '**3D の量**である(z が無い)。面内 2D 半質量半径 √(x²+y²) は別の量である。' };
  if (base === 'half_light_radius_projected') return { state: 'mapping-unresolved',
    why: '**光度重み**の投影半径である。本器の半質量半径は**質量重み**で、質量光度比の宣言が無い。'
      + 'さらに開口・中心・視線方向が未固定である(v1b の設計宣言へ)。' };
  if (base === 'core_radius') return { state: 'mapping-unresolved',
    why: 'GGCD の Spitzer コア半径(N-body fit)である。本器の `coreRadiusHalfDensity` は'
      + '**一次元線密度が半値に落ちる |x|** であって King の r_c でも Spitzer の r_c でもない。' };
  if (base === 'total_mass' || base === 'distance') return { state: 'not-applicable',
    why: '**プリセットへ転写した入力**である(独立に検証する量ではない —— 転写の確認にとどめる)。'
      + 'GGCD の値の多くは N-body fit の結果で、直接観測の独立誤差付き測定ではない。' };
  if (base === 'tidal_radius') return { state: 'not-applicable',
    why: '**転写した入力**(生成円盤の外縁 419 単位・Webb 定義)である。'
      + '本器は外部潮汐場を置いていないので、走行から潮汐半径は出ない。' };
  return { state: 'not-measurable',
    why: '**本器が対応する量を出していない**(窓・抽出器のどちらにも無い)。'
      + '回転・IMBH・星数・M/L は v1 では置かない、というプリセット側の宣言に従う。' };
}

// ---- ページ
const LIB_ANALOGY = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w265a-analogy.mjs'), 'utf8')
  .replace(/^export /gm, '');
const LIB_STATE = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w269d-state.mjs'), 'utf8')
  .replace(/^export /gm, '');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_ANALOGY });
await pg.addScriptTag({ content: LIB_STATE });
const libOk = await pg.evaluate(() => typeof projectedStats === 'function'
  && typeof centerOf === 'function' && typeof boundFraction === 'function'
  && typeof clusterDiagCopy === 'function');
if (!libOk) { console.error('[w269d] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(() => {
  // **診断コピーを 1 回走らせ、t=0 と t=T の内部診断を返す。**
  //   3 つの中心(原点 / 質量重心 / 密度ピーク)で同じ量を出し、原点は第265便a の基準として残す。
  window.__w269dRun = (spec) => {
    const src = HP.allPresets().find((q) => q.id === spec.srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + spec.srcId] };
    const rep = {};
    const asIs = !(spec.seed !== undefined && spec.seed !== null) && !spec.n;
    const pd = asIs ? JSON.parse(JSON.stringify(src))
      : clusterDiagCopy(src, { seed: spec.seed, n: spec.n, id: 'w269d' + spec.tag, report: rep });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    const S = HP.sim;
    S.build(v.preset);
    const snapPts = () => { const pts = [];
      for (let i = 0; i < S.n; i++) pts.push({ x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], m: S.m[i] });
      return pts; };
    const pick = (st) => (st ? { projectedHalfMassRadius: st.projectedHalfMassRadius,
      halfMassRadius2D: st.halfMassRadius2D, rMax: st.rMax,
      coreRadiusHalfDensity: st.coreRadiusHalfDensity, coreWindowParticles: st.coreWindowParticles,
      sigmaInPlaneProxyAll: st.sigmaInPlaneProxyAll,
      bands: (st.bands || []).map((b) => ({ i: b.i, rLo: b.rLo, rHi: b.rHi, n: b.n,
        vMean: b.vMean, sigmaInPlaneProxy: b.sigmaInPlaneProxy })) } : null);
    const shot = () => {
      const pts = snapPts();
      const mc = projectedStats(pts, { bands: 5, center: 'mass-centroid' });
      if (!mc) return null;
      const dpCenter = centerOf(pts, 'density-peak', {});
      const dp = projectedStats(pts, { bands: 5, center: dpCenter });
      const cMc = mc.centerContract.used, cDp = dpCenter;
      return { n: mc.n, mTotal: mc.mTotal,
        origin: pick(mc),                         // **従来の欄 = 原点基準**(第265便a と同じ数)
        massCentroid: pick(mc.centered),
        densityPeak: pick(dp.centered),
        centers: {
          origin: { mode: 'origin', x: 0, y: 0, vx: 0, vy: 0, definition: mc.centerContract.origin.definition },
          massCentroid: { mode: cMc.mode, x: cMc.x, y: cMc.y, vx: cMc.vx, vy: cMc.vy,
            definition: cMc.definition },
          densityPeak: { mode: cDp.mode, x: cDp.x, y: cDp.y, vx: cDp.vx, vy: cDp.vy,
            kWindow: cDp.kWindow, definition: cDp.definition } },
        centerDelta: mc.centerDelta,
        bound: (() => { const b = boundFraction(pts,
          { G: S.params.G, softening: S.params.softening, cvx: cMc.vx, cvy: cMc.vy });
          return b ? { n: b.n, nBound: b.nBound, countFraction: b.countFraction,
            massFraction: b.massFraction, massTotal: b.massTotal, kineticTotal: b.kineticTotal,
            potentialTotal: b.potentialTotal, virialRatio: b.virialRatio } : null; })() };
    };
    const start = shot();
    const nSteps = Math.round(spec.tEnd / spec.dt);
    let k = 0, nan = false;
    for (; k < nSteps; k++) { S.step(spec.dt); if (S.hasNaN()) { nan = true; break; } }
    const end = shot();
    let mTot = 0; for (let i = 0; i < S.n; i++) mTot += S.m[i];
    return { ok: true, steps: k, nan, tEndActual: k * spec.dt, n: S.n, start, end,
      diag: rep, massTotal: mTot,
      kFrame: v.preset.physics.kFrame, softening: v.preset.physics.softening, G: v.preset.physics.G,
      sampleClass: v.preset.sampleClass, seedUsed: v.preset.seed,
      vMode: v.preset.bodies[0].vMode, vScale: v.preset.bodies[0].vScale,
      mPerParticle: v.preset.bodies[0].mMin,
      eqInit: S.eqInit ? S.eqInit.rows[0] : null,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0) };
  };
  window.__w269dFacts = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) return { id, missing: true };
    const b = p.bodies[0];
    return { id, emoji: p.emoji, sampleClass: p.sampleClass, seed: p.seed,
      kFrame: p.physics.kFrame, G: p.physics.G, softening: p.physics.softening,
      scaleExp: p.scaleExp, notClaim: p.notClaim || null,
      n: b.n, profile: b.profile, plummerScale: b.plummerScale, diskRadius: b.radius,
      mPerParticle: b.mMin, vMode: b.vMode, vScale: b.vScale,
      lightSweep: b.lightSweep === undefined ? null : b.lightSweep,
      massCalibration: p.massCalibration || null };
  });
});

const facts = await pg.evaluate((ids) => window.__w269dFacts(ids), ['tuc47', 'tuc47DFM']);

const out = {
  meta: {
    wave: '第269便d(第59報 W4)— 星団 47 Tuc **比較サンプル v1a**(内部診断の完成)',
    when: new Date().toISOString(),
    codeCommit: headSha,
    target: TARGET,
    inputs: [stamp(TARGET), stamp('tests/lib-w265a-analogy.mjs'), stamp('tests/lib-w269d-state.mjs'),
      stamp(CSV_REL), stamp('tests/out/analogy-w265a.json')],
    declarationVersion: 'v1a-2026-09-17',
    window: { tStart: 0, tEnd: CL_T, unit: 'sim time',
      why: '**第265便a と同じ終了時刻**(保存値の再現で中心契約の差だけを見るため)' },
    grid: { dt0: DT0, divs: DIVS, seeds: SEEDS, nVariants: NS,
      note: '3 刻みは**同一終了時刻**(步数ではなく時刻を揃える)。seed・N の診断コピーは'
        + '`sampleClass:"principle"`・台帳と claims を外したもの。**本体 🍇🫐 の JSON は 1 bit も触っていない。**' },
    claim: '**完成 = 比較サンプル v1** である(統括の読み (A))。**観測一致版ではない。**'
      + 'v1a は内部診断の完成であり、**47 Tuc の公表値との比較は 1 つも出していない**。',
    doNotSay: ['47 Tuc と比べられる投影半径を作った', '視線速度分散を測った', '観測と合った',
      '収束済み', '星団を較正した', '星団サンプルが完成した(観測一致版)', '3D の半質量半径を測った'],
    touched: '**🍇🫐 の JSON・入力は 1 bit も書き換えていない**(新版 GGCD は採らない)。'
      + '新プリセットは足していない。エンジンは 3D 化していない。`S._core` には 1 命令も足していない。',
  },
  states: STATES,
  presetFacts: facts,
  contracts: null, geometry: null, columns: [],
  centerContractCheck: null, observationStates: null, v1bDesign: null, pageErrors: [],
};

// ---- 診断の契約(共通 f・virial 初期化・中心・抽出器)
const fOf = (f) => (f && f.massCalibration && Number.isFinite(f.massCalibration.factorUniform)
  ? f.massCalibration.factorUniform : 1);
out.contracts = {
  declaration: protocolDeclaration({ systemKind: 'cluster', id: 'tuc47',
    sampleClass: 'principle', calibrationClass: 'principle-internal-diagnostic-v1a',
    window: { tStart: 0, tEnd: CL_T, unit: 'sim time', why: '第265便a と同じ終了時刻' },
    extractor: { name: 'projected-x-axis-v1a-centered',
      quantity: ['projected-half-mass-radius(|x|)', 'in-plane-half-mass-radius(√(x²+y²))',
        'core-radius-half-line-density', 'in-plane-sigma-by-band', 'bound-fraction'],
      definition: '投影は x 軸・「視線」と呼んでいるのは面内 y 成分である。'
        + '**中心を宣言して引く**(既定 = 質量重心。原点 = 第265便a の対照。密度ピーク = k 窓の線密度最大)。'
        + '半質量半径は**質量重み**であり、光度重みの投影半光半径ではない。'
        + 'コア半径は線密度半値幅であり King/Spitzer の r_c ではない。' },
    observationVersion: { csv: CSV_REL + ' の 47 Tuc 行(値は 1 つも比較に使っていない)' },
    quantities: ['projectedHalfMassRadius', 'halfMassRadius2D', 'coreRadiusHalfDensity',
      'sigmaInPlaneProxyAll', 'boundFraction'],
    gateConnected: false }),
  commonF: { tuc47: fOf(facts[0]), tuc47DFM: fOf(facts[1]),
    definition: '**共通 f** は「全恒星粒に一様に掛ける質量係数」である。'
      + '🍇 は f=1(転写のまま)・🫐 は台帳の f=C·2χ̄(C=1・ゼロフィット)。'
      + '**本便はこの f を動かしていない**(hold-out 質量の探索は v1a の仕事ではない)。' },
  virialInit: { tuc47: { vMode: facts[0].vMode, vScale: facts[0].vScale },
    tuc47DFM: { vMode: facts[1].vMode, vScale: facts[1].vScale },
    definition: '🫐 は `vMode:"virial"`(配置の実ポテンシャル W から ⟨v²⟩=−W/M)・'
      + '🍇 は `vMode:"random"`(観測 σ の規約転写)。**初期化の流儀が違う 2 本を同じ表に並べている**ので、'
      + '同じ窓の同じ量でも t=0 が違う(比較は列内で行う)。' },
  center: { default: 'mass-centroid', controls: ['origin', 'density-peak'],
    why: '走行中に群が並進しても量が動かない、という理由で質量重心を既定にする。'
      + '**原点は第265便a の基準**なので対照として必ず並べる(保存値の再現に使う)。'
      + '**どれを既定にするかは決断事項**(密度ピークは中心集中した系で意味を持つが N=240 では窓幅に依存する)。' },
  boundFraction: { definition: 'E_i = ½|v_i−v_c|² + Φ_i < 0(Φ は E4 と同じ軟化核 ε=softening)。'
    + 'v_c は**質量重心速度**。**kFrame=1 の走行ではこの E は保存量ではない**(引きずりが入る)。',
    note: '既存 QA `behavior.tuc47` の束縛率は「原点からの点質量脱出速度」による別定義である'
      + '(v² < 2GM/max(r,1))—— **同じ名前の別の量**なので、本器の値と直接比べない。' },
};

// ---- 幾何比の理論(等方・円対称の 2D 配置)
out.geometry = { theory: halfRadiusRatioTheory({ plummerScale: facts[0].plummerScale,
  truncationRadius: facts[0].diskRadius }), measured: null };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

// ---- 走行
const COLUMNS = [];
if (want('base')) {
  COLUMNS.push({ tag: 'tuc47_asIs', srcId: 'tuc47', seed: null, n: null, emoji: '🍇' });
  COLUMNS.push({ tag: 'tuc47DFM_asIs', srcId: 'tuc47DFM', seed: null, n: null, emoji: '🫐' });
}
if (want('seed')) for (const s of SEEDS) {
  COLUMNS.push({ tag: 'tuc47_seed' + s, srcId: 'tuc47', seed: s, n: null, emoji: '🍇' });
  COLUMNS.push({ tag: 'tuc47DFM_seed' + s, srcId: 'tuc47DFM', seed: s, n: null, emoji: '🫐' });
}
if (want('n')) for (const n of NS) {
  COLUMNS.push({ tag: 'tuc47_N' + n, srcId: 'tuc47', seed: null, n, emoji: '🍇' });
  COLUMNS.push({ tag: 'tuc47DFM_N' + n, srcId: 'tuc47DFM', seed: null, n, emoji: '🫐' });
}

const tAll = Date.now();
const QKEYS = ['projectedHalfMassRadius', 'halfMassRadius2D', 'coreRadiusHalfDensity', 'sigmaInPlaneProxyAll'];
const CKEYS = ['origin', 'massCentroid', 'densityPeak'];

for (const spec of COLUMNS) {
  const col = { tag: spec.tag, srcId: spec.srcId, emoji: spec.emoji, seed: spec.seed, n: spec.n,
    stages: [], richardson: {}, numerical: {} };
  out.columns.push(col);
  for (const div of DIVS) {
    const dt = DT0 / div;
    const r = await pg.evaluate((s) => window.__w269dRun(s),
      { srcId: spec.srcId, seed: spec.seed, n: spec.n, dt, tEnd: CL_T, tag: spec.tag });
    col.stages.push({ div, dt, ok: r.ok, steps: r.steps, nan: r.nan, n: r.n, clamp: r.clamp,
      massTotal: r.massTotal, mPerParticle: r.mPerParticle, seedUsed: r.seedUsed,
      kFrame: r.kFrame, softening: r.softening, G: r.G, sampleClass: r.sampleClass,
      vMode: r.vMode, vScale: r.vScale, eqInit: r.eqInit, diag: r.diag || null,
      start: r.start, end: r.end, errors: r.errors || null });
    const e = (r.end && r.end.massCentroid) || {};
    const f4 = (z) => (z === null || z === undefined ? '—' : z.toFixed(4));
    console.error(`  ${spec.emoji} ${spec.tag} dt/${div}: R1d=${f4(e.projectedHalfMassRadius)}`
      + ` R2d=${f4(e.halfMassRadius2D)} rCore=${f4(e.coreRadiusHalfDensity)}`
      + ` σ=${f4(e.sigmaInPlaneProxyAll)} 束縛=${r.end && r.end.bound ? (r.end.bound.countFraction * 100).toFixed(1) + '%' : '—'}`
      + `  [${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
  for (const ck of CKEYS) {
    col.richardson[ck] = {}; col.numerical[ck] = {};
    for (const q of QKEYS) {
      const g = col.stages.map((s) => ((s.end && s.end[ck]) ? s.end[ck][q] : null));
      const rich = richardson3(...g);
      col.richardson[ck][q] = rich;
      col.numerical[ck][q] = numericalVerdict(rich);
    }
    const gb = col.stages.map((s) => ((s.end && s.end.bound) ? s.end.bound.countFraction : null));
    col.richardson[ck].boundFractionCount = (ck === 'origin') ? richardson3(...gb) : null;
  }
  col.boundFraction = { start: col.stages.map((s) => (s.start && s.start.bound
    ? { count: s.start.bound.countFraction, mass: s.start.bound.massFraction,
      virialRatio: s.start.bound.virialRatio } : null)),
    end: col.stages.map((s) => (s.end && s.end.bound
      ? { count: s.end.bound.countFraction, mass: s.end.bound.massFraction,
        virialRatio: s.end.bound.virialRatio } : null)) };
  // 幾何比(実測)。**理論比は円対称・無限標本の極限**なので、差を力学の効果と読まない。
  col.geometryRatio = { start: col.stages.map((s) => (s.start && s.start.massCentroid
    && s.start.massCentroid.projectedHalfMassRadius
    ? s.start.massCentroid.halfMassRadius2D / s.start.massCentroid.projectedHalfMassRadius : null)),
    end: col.stages.map((s) => (s.end && s.end.massCentroid && s.end.massCentroid.projectedHalfMassRadius
      ? s.end.massCentroid.halfMassRadius2D / s.end.massCentroid.projectedHalfMassRadius : null)),
    endOrigin: col.stages.map((s) => (s.end && s.end.origin && s.end.origin.projectedHalfMassRadius
      ? s.end.origin.halfMassRadius2D / s.end.origin.projectedHalfMassRadius : null)) };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

// ---- 初期化の契約の照合: **エンジンの virial 初期化の宣言と、本器の独立な帳簿**
{
  out.virialCheck = { rows: out.columns.map((c) => {
    const s0 = c.stages[0];
    const eq = s0.eqInit;
    const U = s0.start.bound.potentialTotal, K = s0.start.bound.kineticTotal;
    return { tag: c.tag, emoji: c.emoji, vMode: s0.vMode,
      engineW: eq ? eq.W : null, harnessU: U,
      relDiff: (eq && eq.W) ? (U - eq.W) / eq.W : null,
      twoKoverAbsU_t0: c.boundFraction.start.map((z) => z.virialRatio),
      twoKoverAbsU_T: c.boundFraction.end.map((z) => z.virialRatio) };
  }),
  note: '**エンジンの `vMode:"virial"` は ⟨v²⟩=−W/M(2K=−W)を宣言する**が、'
    + '本器の独立な帳簿では **t=0 の 2K/|U| は 1.000 ではない**(🫐 の既定 seed で 0.869)。'
    + 'ポテンシャル自体は一致する(エンジンの W と本器の ½Σm_iΦ_i が 7 桁一致 —— 実行時は Float32)ので、'
    + 'ずれは**単位乱数速度の実現**(規約 ⟨v²⟩=vScale²/3 に対する有限 N の標本ゆらぎ)に由来すると読めるが、'
    + '**本便では機構を確定させない**(seed 3 本・N 3 種で 0.632〜1.032 の幅がある、という記録にとどめる)。'
    + '🍇 は `vMode:"random"`(観測 σ の規約転写)なので t=0 でビリアル平衡にないことは設計どおりである。' };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

// ---- 中心の契約の照合: **原点基準の欄が第265便a の保存値を再現する**
{
  const c0 = out.columns.find((c) => c.tag === 'tuc47_asIs');
  const got = c0 ? c0.stages.map((s) => (s.end && s.end.origin ? s.end.origin.projectedHalfMassRadius : null)) : null;
  const got2 = c0 ? c0.stages.map((s) => (s.end && s.end.origin ? s.end.origin.halfMassRadius2D : null)) : null;
  const gotC = c0 ? c0.stages.map((s) => (s.end && s.end.origin ? s.end.origin.coreRadiusHalfDensity : null)) : null;
  const gotS = c0 ? c0.stages.map((s) => (s.end && s.end.origin ? s.end.origin.sigmaInPlaneProxyAll : null)) : null;
  const bitSame = (a, b) => (a && b && a.length === b.length && a.every((z, i) => Object.is(z, b[i])));
  out.centerContractCheck = {
    savedW265a: SAVED_W265A,
    measuredOrigin: { projected: got, twoD: got2, core: gotC, sigma: gotS },
    bitIdentical: { projected: bitSame(got, SAVED_W265A.projected), twoD: bitSame(got2, SAVED_W265A.twoD),
      core: bitSame(gotC, SAVED_W265A.core), sigma: bitSame(gotS, SAVED_W265A.sigma) },
    prelim: { value: PRELIM.tuc47_projHalfMass_T9p6,
      what: '**統括の予備測定**(照合のためだけの定数。観測値ではない)',
      deltaVsOrigin1D: got ? got.map((z, i) => (z === null ? null : z - PRELIM.tuc47_projHalfMass_T9p6[i])) : null,
      deltaVsOrigin2D: got2 ? got2.map((z, i) => (z === null ? null : z - PRELIM.tuc47_projHalfMass_T9p6[i])) : null,
      deltaVsMassCentroid1D: c0 ? c0.stages.map((s, i) => (s.end && s.end.massCentroid
        ? s.end.massCentroid.projectedHalfMassRadius - PRELIM.tuc47_projHalfMass_T9p6[i] : null)) : null,
      deltaVsMassCentroid2D: c0 ? c0.stages.map((s, i) => (s.end && s.end.massCentroid
        ? s.end.massCentroid.halfMassRadius2D - PRELIM.tuc47_projHalfMass_T9p6[i] : null)) : null,
      identifiedAs: (() => {
        // **中心の契約を宣言して初めて分かったこと**: 予備測定の 3 値は、
        // **質量重心を引いた面内 2D 半質量半径 √((x−x_c)²+(y−y_c)²)** と 3 桁一致する。
        const mc2 = c0 ? c0.stages.map((s) => (s.end && s.end.massCentroid
          ? s.end.massCentroid.halfMassRadius2D : null)) : null;
        if (!mc2 || mc2.some((z) => z === null)) return null;
        const d = mc2.map((z, i) => Math.abs(z - PRELIM.tuc47_projHalfMass_T9p6[i]));
        return { candidate: 'massCentroid.halfMassRadius2D', measured: mc2, absDelta: d,
          roundsToPrelim: mc2.every((z, i) => Math.abs(Number(z.toFixed(3)) - PRELIM.tuc47_projHalfMass_T9p6[i]) < 1e-9),
          what: '**3 段とも小数第 3 位まで一致する。** 予備測定の量は「原点基準の一次元射影半径」ではなく'
            + '**質量重心を引いた面内 2D 半質量半径**だった、と読めるが、**予備測定側の定義は本便では'
            + '確認できない**ので「一致する候補が 1 つ見つかった」以上のことは書かない。' };
      })(),
      note: '**第265便a の走行もこの予備測定値を再現していない**(保存 JSON の `deltaProjected` は'
        + '−3.32/−3.22/−3.14・`delta2D` は −0.22/−0.26/−0.05)。本便はその差を**そのまま残す** ——'
        + '予備測定の量の定義(中心・射影・重み)が分からないので、**どちらが正しいとも書かない**。' },
    centerShift: c0 ? c0.stages.map((s) => ({ div: s.div,
      start: s.start ? { mc: [s.start.centers.massCentroid.x, s.start.centers.massCentroid.y],
        dp: [s.start.centers.densityPeak.x, s.start.centers.densityPeak.y],
        vmc: [s.start.centers.massCentroid.vx, s.start.centers.massCentroid.vy] } : null,
      end: s.end ? { mc: [s.end.centers.massCentroid.x, s.end.centers.massCentroid.y],
        dp: [s.end.centers.densityPeak.x, s.end.centers.densityPeak.y],
        vmc: [s.end.centers.massCentroid.vx, s.end.centers.massCentroid.vy] } : null })) : null,
    note: '**原点基準の欄は第265便a と 1 bit 同じでなければならない**(中心オプションは'
      + '新しい欄を足しただけで、従来の数を動かしていない、という機械照合)。',
  };
  out.geometry.measured = {
    theoryRatioClosedForm: out.geometry.theory.closedFormUntruncated.ratio,
    theoryRatioTruncated: out.geometry.theory.truncatedNumeric.ratio,
    perColumn: out.columns.map((c) => ({ tag: c.tag, emoji: c.emoji,
      startMassCentroid: c.geometryRatio.start, endMassCentroid: c.geometryRatio.end,
      endOrigin: c.geometryRatio.endOrigin })),
    note: '**理論比は円対称・無限標本・Plummer 面密度の幾何だけ**から出る(力学も観測も入っていない)。'
      + '実測との差は**有限 N の標本ゆらぎ**と**階段推定の偏り**と**走行中に円対称でなくなること**を含む ——'
      + '差を「引きずりの効果」と読まない。**観測との比較ではない。**' };
}

// ---- 観測量の状態(**値の比較は 1 つも作らない** —— `stateRecord` が器で止める)
{
  const recs = [];
  for (const r of tucRows) {
    const s = stateForQuantity(r.quantity);
    recs.push(Object.assign(stateRecord({ quantity: r.quantity, state: s.state, why: s.why,
      source: r.source, unit: r.unit }),
    { csvRow: r.row, sigmaPresent: r.sigmaPresent, sigmaKind: r.sigmaKind, sigmaPrimary: r.sigmaPrimary }));
  }
  const tally = {};
  for (const r of recs) tally[r.state] = (tally[r.state] || 0) + 1;
  out.observationStates = { rows: recs, tally,
    comparableCount: recs.filter((r) => !r.comparisonWithheld).length,
    rvAsymmetric: recs.filter((r) => r.sigmaKind === 'asymmetric').length,
    pmCovariance: recs.filter((r) => r.sigmaKind === 'covariance').length,
    note: '**47 Tuc の観測量と値の比較は 1 つも出していない**(comparableCount=0)。'
      + 'RV 候補 6 点は `sigma_kind=asymmetric` で**対称 σ が無い**(verified σ 6 件の census は'
      + '「RV 6 点が判定できる」という意味ではない)。固有運動 7 点は `sigma_kind=covariance` で'
      + '**sigma 列は空**(印字 1σ を列へ移すかは決断事項のまま)。'
      + '**GGCD の構造量の多くは N-body fit の結果**で、直接観測の独立誤差付き測定ではない。' };
}

// ---- v1b(観測比較用の別抽出器)の**設計宣言**。**本便は実装しない。**
out.v1bDesign = {
  status: 'declared-not-implemented',
  what: '**観測比較用の別抽出器**の設計宣言である。v1a(内部診断)とは**別の器**にする ——'
    + 'v1a の量を観測量の名前で呼び替えることはしない。',
  items: [
    { id: 'v1b-1', title: '投影面半光半径は**光度重み**',
      design: '観測の half_light_radius_projected は光度重みである。比較するなら'
        + '**質量光度比の宣言**(M/L_V=1.95±0.09 は CSV にあるが、粒ごとの L を置く規約が無い)と、'
        + '等質量粒 N=240 に光度をどう割り当てるかの規約が要る。'
        + '**質量重みの半質量半径を半光半径と呼ばない。**',
      openQuestion: '等質量粒に一様な L を置くのか、質量関数を置くのか(置けば 🍇 の入力が変わる — 本便は変えない)。' },
    { id: 'v1b-2', title: 'RV は**観測と同じ環状開口**',
      design: 'sigma_los の 16 点(+候補 6 点)は半径 r の**環状開口**の中の視線速度分散である。'
        + '比較器は ①同じ環の内外半径 ②同じトレーサー(BH18 の LOS RV 系列・PM 系列は除外)'
        + '③同じ中心 ④空ビンは null(0 で埋めない)を満たす必要がある。'
        + '**候補 6 点は非対称 σ(`sigma_kind=asymmetric`)なので対称 1σ の判定に入れない。**',
      openQuestion: '**現行 2D エンジンに視線方向が無い** —— この項目は v1b-4 の決断に従属する。' },
    { id: 'v1b-3', title: 'PM は **v = 4.74047 · D[kpc] · μ[mas/yr]**',
      design: '固有運動分散 7 点(Watkins 2015 Table 4)は mas/yr が一次単位である。'
        + 'km/s へ写すには距離が要り、**距離の不確かさは全点に共通の系統要因**である ——'
        + '各点の独立誤差として二乗和に入れない。CSV の該当行は表の距離(Harris カタログ 4.5 kpc)と'
        + 'GGCD の距離(4.52±0.03 kpc)が別である、という注記も持ち回る。',
      openQuestion: 'mas/yr のまま比較するか km/s へ写すか(写すなら距離の系統項を別枠で持つ)。' },
    { id: 'v1b-4', title: '**3D 化するか、球対称+速度異方性の前向きモデルにするか**(決断事項)',
      design: '現行エンジンは 2D で z/vz を持たない。案 A: エンジンを 3D 化する(力・積分・描画・'
        + '既定経路のビット同一性に広く波及する)。案 B: 2D の走行から**球対称+速度異方性を明示した'
        + '前向きモデル**で視線量を作る(モデル依存比較であることを状態に書く)。'
        + '**どちらも「補って測った」とは書かない。**',
      openQuestion: '**本便では決めない**(統括・原仮定者の裁定を待つ)。' },
    { id: 'v1b-5', title: '**GGCD の構造量は N-body fit の結果**である',
      design: '距離 4.52±0.03 kpc・質量 (8.53±0.05)×10⁵ M☉・投影半光半径 4.03 pc・3D 半質量半径 6.44 pc・'
        + '中心 1D 分散 11.9 km/s は、多くが N-body fit の出力であって直接観測の独立誤差付き測定ではない。'
        + '比較器は各量に `role`(input / fit-output / independent-observation)を持たせ、'
        + '**fit-output を独立検証に数えない**。🍇🫐 は**旧 V2 系の入力**のままである'
        + '(新版を採るなら一組で更新し、旧構成を対照に残す —— 本便は入力を変えない)。',
      openQuestion: '入力を新版 GGCD へ更新する便をいつ切るか(決断事項)。' },
  ],
  doNotSay: ['視線速度分散を測った', '47 Tuc の半光半径と比べた', '観測と合った',
    'v1b を実装した', '3D 化した'],
};

out.meta.spentSec = +((Date.now() - tAll) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w269d-cluster] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)');

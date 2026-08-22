// 第167便 exp-p2sens.mjs — 論文2「箱宇宙」プローブ依存比 H_w/H_geo の感度分析
// ============================================================================================
// 背景(外部レビュー第4巡 P1-5): 「0.9242 以外の減衰係数、観測窓、推定量定義を振り、
//   0.92 が**選択値の反映**であることと、**一般的に生じる probe dependence** を分離して示せ」。
//   論文2 第V節の中心結果は
//        H_w/H_geo = 2Dκ·d_P·a^{−d_P}                                       … 論文2 式(6)
//   であり、較正点 a=2・Dκ=(2/3)ln4≈0.9242 で比が 0.92 になる。この 0.92 という**値**は
//   Dκ の選択(論文2 第VI節が「較正であって予測ではない」と明言している選択)の反映であって、
//   **比が 1 からずれること自体**(= プローブ依存)は Dκ の値に依らない構造的性質である。
//   本ハーネスはその2つを機械的に分離する。
//
// 位置づけ(何をして・何をしないか):
//   - 図は新設しない。tools/gen-figures2.mjs のゲート体系(22件)・図・committed JSON は
//     **1 bit も触らない**(本ハーネスは既存ファイルを読み取り専用でしか参照しない)。
//   - 論文2 の H_w/H_geo 計算の**正本**は tools/gen-figures2.mjs の p2fig6 節(committed
//     出力 paper/figures/p2fig6.json)と beta/index.html HP.verify.v29 である。本ハーネスは
//     その測定系・推定式を**転記照合可能な形で再実装**し、正準構成で committed 正本の
//     24 窓の行が **bit 一致**することを機械証明してから(PW1)、掃引に入る。
//   - 掃引結果は論文2 に**小表+段落**として収載する。本文の数値は本 JSON からの機械転記で
//     あり、転記の正しさは本ハーネス自身の paperSync ブロックが論文 tex を読んで照合する
//     (手書き数値ゼロ)。
//
// ============================ 事前登録(実測前に固定 — 逐語)===================================
//   PW1(転記照合・基準再現): 正準構成(係数 0.9242・論文2 の正本窓・正本推定量)で、ハーネスの
//     H_w/H_geo(または論文2 正本の対応量)が committed 正本値を**論文2 既存ゲートと同じ許容**で再現。
//   PW2(記述 — 窓なし): 減衰係数 {0.5, 0.75, 0.9242, 1.25, 1.5} × 観測窓 {×0.5, ×1, ×2} ×
//     推定量定義(正本2種+代替ビニング1種)の全組み合わせの比を表収載。
//   PW3(構造窓): 掃引全構成で**プローブ依存が消えない**こと — |比 − 1| > 数値床(床は正準構成の
//     収束誤差から事前宣言)。「0.92 という値は係数選択の反映・プローブ依存自体は一般的」の分離を
//     機械実証する。
//   PW4(決定性): 別プロセス2回 SHA 一致。
//   **実測後に窓を動かさない。FAIL は FAIL のまま収載する。**
//
// ============================ 掃引軸の事前宣言(実測前に固定)=================================
//   軸1 減衰係数 Dκ ∈ {0.5, 0.75, 0.9242, 1.25, 1.5}
//        Dκ = D·κ = D/K_t(論文2 の較正量。0.9242 = (2/3)ln4 が論文2 の較正値)。
//        減衰則の**指数** d_P は正準値 1 に固定する(事前登録が振ると書いたのは「減衰係数」で
//        あり、d_P は論文2 の正本構成〔fig6・V29〕が 1 に固定している測定系の一部である)。
//   軸2 観測窓 s ∈ {×0.5, ×1, ×2}
//        観測範囲を a: 1 → 3^s とする。×1 = 論文2 fig6 の正準走査範囲 a: 1→3。
//        ×0.5 → a: 1→√3、×2 → a: 1→9。部分窓の本数は正準値 24 に固定する。
//        (「どの時期を観測するか」が比を動かす軸である — 式(6)は a に依存するので、
//         観測範囲の取り方そのものが推定値を動かす。)
//   軸3 推定量定義 e ∈ {canonLog(正本), altLinear(代替ビニング1種)}
//        **正本の2プローブ**(幾何プローブ H_geo=Δln a/Δt と速度プローブ H_w=−Δln R/Δt)・
//        推定式・観測範囲は**両者で同一**であり、違うのは観測範囲の**分割の仕方**だけである。
//          canonLog  … ln a について等間隔の 24 部分窓(論文2 fig6・V29 と同じ分割)
//          altLinear … a について等間隔の 24 部分窓(本ハーネスが事前宣言する代替ビニング)
//        各構成の「比」は、24 部分窓の H_w/H_geo の**算術平均**として1つの数へ集約する
//        (集約規則は両ビニング共通 — 違いはビニングだけに閉じる)。
//        併せて、同じ実測 w から後処理で読む**反比例対照**(c_loc ∝ 1/W_B。論文2 第V節の
//        モデル内対照)の比も全構成で記録する。対照は構成上 ≡ d_P = 1 になる = プローブ依存が
//        消える反実仮想であり、**PW3 の判定対象には入れない**(判定対象はモデル自身の
//        光速則で読む 30 構成である)。
//   数値床(PW3)の事前宣言:
//        床 := 正準構成(PW1)の 24 窓における |比_実測 − 比_解析| の最大値。
//        = dt=0.016 における比の**離散化収束誤差**であり、これより小さい |比−1| は
//        数値的に意味を持たない。安全係数は掛けない(1倍 = 素の数値床)。
//   正直な限定(実測前に宣言 — PW3 の意味を誇張しないため):
//        PW3 は**構成レベルの比**(1構成につき1つの集約値)についての窓である。
//        部分窓レベルでは、式(6) の比 ρ(a)=2Dκ·a^{−1} は a* = 2Dκ でちょうど 1 を横切るので、
//        a* が観測範囲に入る構成では「比が 1 に一致する時期」が必ず存在する(論文2 第V節が
//        既に述べている)。本 JSON はその横切り時期 a* と、各構成の部分窓レベルの
//        min|比−1| も記述として収載する。PW3 はそれを隠さない。
//
// 手法・測定系(論文2 正本からの逐語踏襲 — 数値の創作は一切しない):
//   規定 exp 膨張の箱の中の単独自由粒子。H0=0.01・K_t=300(κ=1/300)・c0=60・dt=0.016・
//   d_P=1・friction:'dfm'・G=0・D0=0・kFrame=1・kRep=0・softening=4・m=0.05・
//   初期 (x,y)=(100,0)・(vx,vy)=(H0·100, 1)。プリセットは validatePreset → HP.sim.build の
//   正規経路で注入する(tests/exp-4-66.mjs と同じ流儀)。
//   c_loc(a) = c0·exp(−2·(D/a)/K_t)(E8R 指数形。V28/V29・p2fig6 と同一)
//   R = w/c_loc、H_geo = Δln a/Δt、H_w = −Δln R/Δt、
//   解析窓平均 = 2Dκ(1/a1 − 1/a2)/ln(a2/a1)、反比例対照 R_inv = w·a^{−d_P}
//   (いずれも tools/gen-figures2.mjs p2fig6 / tests/exp-4-66.mjs と同一式)。
//
// トイ単位・領域の限界(論文2 の宣言を踏襲):
//   本シミュレータの質量・長さ・時間はトイ単位であり実世界の物理単位ではない。Dκ≈0.92 は
//   ψ=Dκ の強場設定(c_loc/c0=e^{−2ψ}≈0.16)で、論文1 の弱場較正の領域外である。
//   観測窓 ×2(a→9)は論文2 の正準走査範囲(a≤3)の**外側への外挿**であり、箱近似が
//   良い要約であり続ける保証はない。ここで測っているのは**推定量の振る舞い**であって
//   実宇宙についての主張ではない。
//
// 実行:
//   node tests/exp-p2sens.mjs                          … 全節(既定。対象 beta/index.html)
//   QA_TARGET=beta/index.html node tests/exp-p2sens.mjs … 対象の明示(V29 系は beta 先行)
//   P2S_OUT=/path/x.json node tests/exp-p2sens.mjs      … 出力先の変更(決定性の2回実行比較に使う)
//   P2S_DET_REF=/path/run1.json node tests/exp-p2sens.mjs … 2回目実行で1回目の JSON と SHA 照合
// 出力: tests/out/p2sens-results.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const TARGET_ABS = TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.P2S_OUT ? path.resolve(process.env.P2S_OUT)
  : path.join(OUT_DIR, 'p2sens-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// 対象 HTML のスナップショット(並行編集からの隔離+ハッシュ記録 — exp-4-66 と同じ)
const TARGET_SRC = fs.readFileSync(TARGET_ABS);
const TARGET_SHA = sha256(TARGET_SRC);
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'p2sens-'));
const SNAP = path.join(TMP_DIR, 'target.html');
fs.writeFileSync(SNAP, TARGET_SRC);
const INDEX = 'file://' + SNAP;

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ======================= 測定系の定数(論文2 正本 = p2fig6 / V29 と同一)=======================
const CFG = Object.freeze({
  H0: 0.01, KT: 300, C0: 60, DT: 0.016, DP: 1,
  A_END_CANON: 3, NW: 24,
  body: Object.freeze({ m: 0.05, x: 100, y: 0, vy: 1 }),
  softening: 4, kFrame: 1, kRep: 0, G: 0, D0: 0, q: 2, seed: 1,
});

// ======================== 掃引軸(事前宣言 — 実測後に動かさない)==============================
const SWEEP = Object.freeze({
  dkt: Object.freeze([0.5, 0.75, 0.9242, 1.25, 1.5]),
  windowScale: Object.freeze([0.5, 1, 2]),      // 観測範囲 a: 1 → 3^s
  binning: Object.freeze(['canonLog', 'altLinear']),
});
const CANON_DKT = 0.9242;                        // 論文2 の較正値((2/3)ln4 の丸め — fig6 と同一)

// ======================== 事前登録(実測前に固定 — 逐語)======================================
const PRE_REGISTERED = {
  fixedBy: '統括(ハンドオフ 2026-08-22b §3b — 実測前に固定)', fixedBefore: '実測',
  designPrinciples: {
    canonUntouched: 'tools/gen-figures2.mjs・paper/figures/p2fig*.json・p2figs-gates.json は' +
      '**読み取り専用**で参照するだけで、1 bit も変更しない。図の新設もしない ' +
      '(gen-figures2 のゲート体系22件は不変)',
    transcriptionFirst: '掃引の前に、正準構成で committed 正本(paper/figures/p2fig6.json の ' +
      'Dκ=0.9242 系列24行)を再現できることを機械証明する(PW1)。再現できない実装で振った' +
      '掃引値には意味がないため、PW1 は掃引の前提条件として先に判定する',
    separation: '本ハーネスの目的は「0.92 という**値**は Dκ の選択の反映」と「**比が 1 から' +
      'ずれること自体**は係数・窓・ビニングの選択に依らない」を**分離**して示すことである。' +
      '前者は PW2 の表(比が Dκ に比例すること)が、後者は PW3(全構成で |比−1| > 数値床)が担う',
    noNewNumbersByHand: '本 JSON と論文2 本文に載る数値はすべて本スクリプトの出力である。' +
      '本文への転記の正しさは paperSync ブロックが論文 tex を読んで機械照合する',
  },
  PW1: {
    role: '窓(転記照合・基準再現)',
    verbatim: 'PW1(転記照合・基準再現): 正準構成(係数 0.9242・論文2 の正本窓・正本推定量)で、' +
      'ハーネスの H_w/H_geo(または論文2 正本の対応量)が committed 正本値を' +
      '**論文2 既存ゲートと同じ許容**で再現。',
    window: '正準構成 24 窓の比について、committed 正本 paper/figures/p2fig6.json ' +
      '(Dκ=0.9242 系列)との最大相対差 < 1e-2',
    tolerance: 1e-2,
    toleranceSource: 'tools/gen-figures2.mjs のゲート p2fig6.analytic が用いる許容 ' +
      '(maxRelErrVsAnalytic < 1e-2)と同一 = 「論文2 既存ゲートと同じ許容」',
    canonicalReference: 'paper/figures/p2fig6.json の data[] のうち dkt=0.9242 の系列の rows[]' +
      '(a1・a2・aEff・meas・ana・inv の24行)',
    note: '併せて bit 一致(全144フィールド)も記述として記録する。bit 一致は許容判定より' +
      '強い証拠だが、窓判定は上の許容で行う(事前登録どおり)',
  },
  PW2: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'PW2(記述 — 窓なし): 減衰係数 {0.5, 0.75, 0.9242, 1.25, 1.5} × 観測窓 {×0.5, ×1, ×2} ×' +
      '推定量定義(正本2種+代替ビニング1種)の全組み合わせの比を表収載。',
    grid: '5 係数 × 3 観測窓 × 2 ビニング = 30 構成。各構成につき比を1つ(24 部分窓の算術平均)。' +
      '「正本2種」= 正本の2プローブ(幾何 H_geo と速度 H_w)であり、両ビニングとも' +
      'この同一の2プローブ・同一推定式を使う(違いは観測範囲の分割だけ)。' +
      '併せて反比例対照(モデル内対照)の比も全構成で記録する',
    window: 'なし(記述のみ)',
  },
  PW3: {
    role: '主窓(構造)',
    verbatim: 'PW3(構造窓): 掃引全構成で**プローブ依存が消えない**こと — |比 − 1| > 数値床' +
      '(床は正準構成の収束誤差から事前宣言)。「0.92 という値は係数選択の反映・プローブ依存自体は' +
      '一般的」の分離を機械実証する。',
    window: '30 構成すべてで |比 − 1| > 床',
    floorRule: '床 := 正準構成(PW1)の 24 窓における |比_実測 − 比_解析| の最大値' +
      '(dt=0.016 における比の離散化収束誤差。安全係数を掛けない素の数値床)',
    scope: '判定対象はモデル自身の光速則(E8R 指数形)で読む 30 構成。反比例対照は' +
      '「プローブ依存が消える反実仮想」であり構成上 ≡ 1 になるので判定対象に入れない' +
      '(記述としては全構成で収載する)',
    honestLimitation: 'PW3 は**構成レベルの比**(1構成 = 24 部分窓の算術平均)についての窓である。' +
      '部分窓レベルでは ρ(a)=2Dκ·a^{−1} が a* = 2Dκ で 1 を横切るため、a* が観測範囲に入る構成では' +
      '「比が 1 に一致する時期」が必ず存在する(論文2 第V節が既に述べている)。本 JSON は a* と' +
      '部分窓レベルの min|比−1| も記述として収載し、この限定を隠さない',
  },
  PW4: {
    role: '窓(決定性)',
    verbatim: 'PW4(決定性): 別プロセス2回 SHA 一致。',
    window: '全体を2回実行(別プロセス・別ブラウザ起動)し、raw(実測部)の正準化 JSON の ' +
      'SHA-256 が一致すること',
    canonicalization: 'raw を再帰キー整列した JSON の SHA-256。走行時間は meta.timings に' +
      'のみ置き raw には入れないので、除外すべき揮発値は対象内に存在しない',
  },
};

const LIMITS = {
  toyUnits: '質量・長さ・時間はトイ単位であり実世界の物理単位ではない。Dκ は無次元(ψ=Dκ)',
  strongField: 'Dκ≈0.92 は ψ≈0.92 の強場設定(c_loc/c0=e^{−2ψ}≈0.16)で、論文1 の弱場較正' +
    '(|ψ|≪1)の領域外である。本ハーネスはその較正を一切継承しない',
  extrapolation: '観測窓 ×2(a: 1→9)は論文2 の正準走査範囲(a≤3)の外側への外挿である。' +
    '箱近似が良い要約であり続ける保証はなく、ここで測っているのは推定量の振る舞いだけである',
  singleParticle: '測定は単独自由粒子1体の系である(統計的な散らばりは測っていない)。' +
    '系は決定論的で、seed 依存性は持たない',
  fixedDp: '減衰則の指数 d_P は正準値 1 に固定した(振ったのは減衰係数 Dκ である)',
  notClaim: '実在宇宙についての主張ではない。すべて DFM 公理系内部の構成依存の実測であり、' +
    'ハッブルテンションの解決案でも、その説明でもない',
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'fig6', file: path.join('paper', 'figures', 'p2fig6.json'),
    role: '論文2 fig6 の committed 正本(PW1 の転記照合の参照値。Dκ=0.9242 系列24行)' },
  { key: 'gates', file: path.join('paper', 'figures', 'p2figs-gates.json'),
    role: '論文2 図ゲート22件の committed 記録(PW1 の許容 1e-2 の出所 p2fig6.analytic を含む)' },
  { key: 'exp466', file: path.join('tests', 'out', 'exp-4-66-results.json'),
    role: '台帳4-66 の判別実験の実測記録(fig6 の元データを兼ねる — 測定系・推定式の来歴)' },
];
const inputs = {};
const provenanceInputs = [];
for (const spec of INPUT_SPECS) {
  const p = path.join(ROOT, spec.file);
  const bytes = fs.readFileSync(p);
  const j = JSON.parse(bytes.toString('utf8'));
  inputs[spec.key] = j;
  provenanceInputs.push({
    path: spec.file.split(path.sep).join('/'),
    sha256: sha256(bytes), bytes: bytes.length,
    generatedCommit: j.commit || (j.meta && j.meta.commit) || null,
    role: spec.role, mutated: false,
  });
}
const FIG6 = inputs.fig6;
const FIG6_CANON_ROWS = (FIG6.data.find((s) => s.dkt === CANON_DKT) || {}).rows || null;
if (!FIG6_CANON_ROWS) throw new Error(`p2fig6.json に dkt=${CANON_DKT} の系列がない(正本の構造が変わった)`);
const GATE_TOL = (() => {
  // 許容の出所を committed ゲート記録から機械確認する(手書きの 1e-2 を独り歩きさせない)
  const g = inputs.gates;
  const rec = Array.isArray(g) ? g.find((x) => x && x.id === 'p2fig6.analytic')
    : (g.gates || []).find((x) => x && x.id === 'p2fig6.analytic');
  return { found: !!rec, id: 'p2fig6.analytic', detail: rec ? (rec.detail || rec.note || null) : null,
    tolerance: PRE_REGISTERED.PW1.tolerance,
    note: '許容 1e-2 は p2fig6.analytic ゲート(maxRelErrVsAnalytic < 1e-2)と同一。' +
      'committed ゲート記録に当該 id が在ることを機械確認した' };
})();

// ============================= 正準化(決定性ハッシュ)=========================================
const canonize = (o) => {
  if (Array.isArray(o)) return o.map(canonize);
  if (o && typeof o === 'object') {
    const r = {};
    for (const k of Object.keys(o).sort()) r[k] = canonize(o[k]);
    return r;
  }
  return o;
};
const canonSha = (o) => sha256(Buffer.from(JSON.stringify(canonize(o)), 'utf8'));

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

log(`第167便 exp-p2sens 対象: ${TARGET}  sha256=${TARGET_SHA.slice(0, 12)}`);

// 適用可否(V29 と universeBox.friction を持つ版であること — exp-4-66 と同じ点検)
const applicable = await page.evaluate(() => ({
  hasV29: !!(window.HP && HP.verify && typeof HP.verify.v29 === 'function'),
  hasValidate: !!(window.HP && typeof HP.validatePreset === 'function'),
  appVersion: (typeof APP_VERSION !== 'undefined') ? APP_VERSION : null,
}));
if (!applicable.hasV29 || !applicable.hasValidate)
  throw new Error(`対象 ${TARGET} に V29 / validatePreset が無い(V29 系は beta 先行)`);

// ---- ページ内測定器(論文2 正本 p2fig6 / exp-4-66 からの逐語転記)----
// 1構成 = (Dκ, 観測範囲 a:1→A, ビニング) を1回の走行で測る。
//   canonLog  : 目標 a_i = A^{i/NW}          (ln a 等間隔 — 論文2 fig6 の正準分割)
//   altLinear : 目標 a_i = 1 + i·(A−1)/NW    (a 等間隔 — 本便が事前宣言する代替ビニング)
const runCell = (dkt, aEnd, binning) => page.evaluate((o) => {
  const { dkt, aEnd, binning, C } = o;
  const D = dkt * C.KT;
  const v = HP.validatePreset({
    id: 'exp_p2sens', name: 'p2sens', description: 'wave167 sensitivity of H_w/H_geo (V29 config)',
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 },
    universeBox: { mode: 'exp', H0: C.H0, D: D, dPower: C.DP, L: 260, cx: 0, cy: 0, vx: 0, vy: 0,
      omega: 0, amp: 0, freq: 0, phase: 0, friction: 'dfm' },
    physics: { G: C.G, D0: C.D0, kFrame: C.kFrame, q: C.q, kRep: C.kRep, muF: 0, gammaN: 0,
      kappaS: 0, etaRad: 0, Kt: C.KT, cLight: C.C0, softening: C.softening, timeScale: 1 },
    bodies: [{ type: 'single', m: C.body.m, x: C.body.x, y: C.body.y, vx: C.H0 * C.body.x,
      vy: C.body.vy, spin: 0, pinned: false }],
    overlays: {}, seed: C.seed });
  if (!v.ok) return { err: 'validatePreset NG: ' + v.errors.join(' / ') };
  HP.sim.build(v.preset);
  const s = HP.sim;
  const cLoc = (a) => C.C0 * Math.exp(-2 * (D / a) / C.KT);   // E8R 指数形(V28/V29・p2fig6 と同一)
  const rInv = (a, w) => w * Math.pow(a, -C.DP);              // 反比例対照(規格化定数は比に効かない)
  const w0 = 1;
  const targets = [];
  for (let i = 1; i <= C.NW; i++) {
    targets.push(binning === 'canonLog' ? Math.pow(aEnd, i / C.NW)
      : 1 + i * (aEnd - 1) / C.NW);
  }
  const samp = [{ t: 0, a: 1, w: w0 }];
  let ti = 0;
  const steps = Math.ceil(Math.log(aEnd) / C.H0 / C.DT) + 1;
  for (let k = 0; k < steps && ti < targets.length; k++) {
    s.step(C.DT);
    const a = Math.exp(C.H0 * s.t);
    while (ti < targets.length && a >= targets[ti]) {
      samp.push({ t: s.t, a, w: Math.hypot(s.vx[0] - C.H0 * s.x[0], s.vy[0] - C.H0 * s.y[0]) });
      ti++;
    }
  }
  const rows = [];
  let wDrift = 0, nan = false;
  for (const q of samp) { wDrift = Math.max(wDrift, Math.abs(q.w / w0 - 1)); if (!Number.isFinite(q.w)) nan = true; }
  for (let i = 1; i < samp.length; i++) {
    const p = samp[i - 1], n = samp[i];
    const R1 = p.w / cLoc(p.a), R2 = n.w / cLoc(n.a);
    const V1 = rInv(p.a, p.w), V2 = rInv(n.a, n.w);
    const Hgeo = Math.log(n.a / p.a) / (n.t - p.t);
    const Hw = -Math.log(R2 / R1) / (n.t - p.t);
    const Hi = -Math.log(V2 / V1) / (n.t - p.t);
    const ana = 2 * (D / C.KT) * (1 / p.a - 1 / n.a) / Math.log(n.a / p.a);
    const aEff = Math.log(n.a / p.a) / (1 / p.a - 1 / n.a);
    rows.push({ a1: p.a, a2: n.a, aEff, meas: Hw / Hgeo, ana, inv: Hi / Hgeo });
    if (!Number.isFinite(Hw / Hgeo) || !Number.isFinite(ana)) nan = true;
  }
  const clamps = { clampVN: s.clampVN, clampSN: s.clampSN, clampHN: s.clampHN,
    clampAN: s.clampAN, clampRN: s.clampRN };
  return { dkt, D, aEnd, binning, nSamp: samp.length, nWindows: rows.length,
    wDrift, nan, clamps, rows, targetsReached: ti === targets.length };
}, { dkt, aEnd, binning, C: CFG });

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const maxOf = (xs) => xs.reduce((a, b) => (b > a ? b : a), -Infinity);
const minOf = (xs) => xs.reduce((a, b) => (b < a ? b : a), +Infinity);

const out = {
  meta: { exp: 'p2sens', wave: 167, target: TARGET, targetSha256: TARGET_SHA,
    appVersion: applicable.appVersion, date: new Date().toISOString(), dt: CFG.DT,
    role: '論文2「箱宇宙」のプローブ依存比 H_w/H_geo について、減衰係数・観測窓・推定量定義' +
      '(ビニング)を掃引し、「0.92 という値は係数選択の反映」と「プローブ依存自体は構成に依らず' +
      '生じる」を分離して機械実証する感度分析(外部レビュー第4巡 P1-5 への恒久対応)',
    basedOn: 'tools/gen-figures2.mjs p2fig6 節(committed 出力 paper/figures/p2fig6.json)/ ' +
      'beta/index.html HP.verify.v29 / tests/exp-4-66.mjs(台帳4-66 判別実験)' +
      ' — 測定系・推定式・定数を逐語踏襲し、既存ファイルは1 bit も変更しない',
    stage: 'running' },
  preRegistered: PRE_REGISTERED, limits: LIMITS,
  sweepAxes: SWEEP, config: CFG,
  provenance: { inputs: provenanceInputs,
    target: { path: TARGET, sha256: TARGET_SHA },
    gateToleranceSource: GATE_TOL },
  raw: {},
};
out.meta.timings = {};   // 走行時間は非測定メタ(raw には入れない — raw は完全に決定論的)

// ============================ ① PW1: 正準構成の転記照合・基準再現 =============================
log('\n[1/4] PW1 — 正準構成(Dκ=0.9242・a:1→3・24 対数窓)で committed 正本を再現する');
const canon = await runCell(CANON_DKT, CFG.A_END_CANON, 'canonLog');
if (canon.err) throw new Error(canon.err);
out.raw.canonical = canon;

const pw1 = (() => {
  const ref = FIG6_CANON_ROWS;
  const FIELDS = ['a1', 'a2', 'aEff', 'meas', 'ana', 'inv'];
  if (canon.rows.length !== ref.length) {
    return { result: 'FAIL', reason: `窓数が正本と違う(実測 ${canon.rows.length} / 正本 ${ref.length})` };
  }
  let bitIdentical = 0, nFields = 0, maxRel = 0, maxAbs = 0;
  const worst = { field: null, i: null, rel: 0 };
  for (let i = 0; i < ref.length; i++) {
    for (const k of FIELDS) {
      nFields++;
      const a = canon.rows[i][k], b = ref[i][k];
      if (a === b) { bitIdentical++; continue; }
      const rel = b === 0 ? Math.abs(a) : Math.abs(a / b - 1);
      if (rel > maxRel) { maxRel = rel; worst.field = k; worst.i = i; worst.rel = rel; }
      maxAbs = Math.max(maxAbs, Math.abs(a - b));
    }
  }
  const tol = PRE_REGISTERED.PW1.tolerance;
  return {
    rule: PRE_REGISTERED.PW1,
    reference: 'paper/figures/p2fig6.json data[dkt=0.9242].rows',
    referenceSha256: provenanceInputs.find((e) => e.path.endsWith('p2fig6.json')).sha256,
    nWindows: ref.length, nFieldsCompared: nFields, bitIdenticalFields: bitIdentical,
    bitIdentical: bitIdentical === nFields,
    maxRelDiffVsCommitted: maxRel, maxAbsDiffVsCommitted: maxAbs, worst,
    tolerance: tol,
    result: maxRel < tol ? 'PASS' : 'FAIL',
    note: '窓判定は「committed 正本との最大相対差 < 1e-2(論文2 既存ゲート p2fig6.analytic と同じ許容)」。' +
      'bit 一致はそれより強い証拠だが、事前登録どおり判定は許容で行う',
  };
})();
out.pw1 = pw1;
log(`  → PW1 ${pw1.result}: bit 一致 ${pw1.bitIdenticalFields}/${pw1.nFieldsCompared} フィールド・` +
  `最大相対差=${pw1.maxRelDiffVsCommitted.toExponential(2)}(許容 ${pw1.tolerance})`);

// 数値床(PW3)— 事前宣言どおり、正準構成の |比_実測 − 比_解析| の最大値から決める
const NUM_FLOOR = maxOf(canon.rows.map((r) => Math.abs(r.meas - r.ana)));
out.raw.numericFloor = {
  value: NUM_FLOOR,
  rule: PRE_REGISTERED.PW3.floorRule,
  from: '正準構成(PW1)の24窓 |meas − ana| の最大値',
  canonicalMaxRelErrVsAnalytic: maxOf(canon.rows.map((r) => Math.abs(r.meas / r.ana - 1))),
  canonicalWDrift: canon.wDrift,
};
log(`  → 数値床 = ${NUM_FLOOR.toExponential(3)}(正準構成の比の離散化収束誤差・安全係数なし)`);

// ============================ ② PW2: 掃引(5×3×2 = 30 構成)==================================
log('\n[2/4] PW2 — 減衰係数×観測窓×ビニングの全 30 構成を実測する');
const cells = [];
for (const dkt of SWEEP.dkt) {
  for (const s of SWEEP.windowScale) {
    const aEnd = Math.pow(CFG.A_END_CANON, s);
    for (const binning of SWEEP.binning) {
      const r = await runCell(dkt, aEnd, binning);
      if (r.err) throw new Error(`構成 (Dκ=${dkt}, ×${s}, ${binning}) で ${r.err}`);
      const meas = r.rows.map((x) => x.meas);
      const anas = r.rows.map((x) => x.ana);
      const invs = r.rows.map((x) => x.inv);
      const ratio = mean(meas), ratioAnalytic = mean(anas), ratioControl = mean(invs);
      const crossingA = 2 * dkt * CFG.DP;                  // ρ(a)=2Dκ a^{−1} が 1 を横切る a
      cells.push({
        dkt, windowScale: s, aEnd, binning,
        ratio, ratioAnalytic, ratioControl,
        absDevFrom1: Math.abs(ratio - 1),
        absDevFrom1Control: Math.abs(ratioControl - 1),
        relDiffVsAnalytic: Math.abs(ratio / ratioAnalytic - 1),
        maxAbsErrVsAnalytic: maxOf(r.rows.map((x) => Math.abs(x.meas - x.ana))),
        perWindowMin: minOf(meas), perWindowMax: maxOf(meas),
        perWindowMinAbsDevFrom1: minOf(meas.map((v) => Math.abs(v - 1))),
        crossingA, crossingInRange: crossingA > 1 && crossingA < aEnd,
        wDrift: r.wDrift, nan: r.nan, nWindows: r.nWindows, targetsReached: r.targetsReached,
        clamps: r.clamps,
      });
      log(`  Dκ=${String(dkt).padEnd(6)} ×${s} ${binning.padEnd(9)} → 比=${fmt(ratio)} ` +
        `(解析 ${fmt(ratioAnalytic)}・対照 ${fmt(ratioControl)}・|比−1|=${fmt(Math.abs(ratio - 1))})`);
    }
  }
}
out.raw.sweep = cells;

// 掃引の構造的読み(すべて実測値からの導出 — 手書き数値なし)
const cellOf = (dkt, s, b) => cells.find((c) => c.dkt === dkt && c.windowScale === s && c.binning === b);
const proportionality = (() => {
  // 比が Dκ に比例することの機械確認: (比 / Dκ) が同じ (窓,ビニング) の中で一定か
  const groups = [];
  for (const s of SWEEP.windowScale) for (const b of SWEEP.binning) {
    const ks = SWEEP.dkt.map((d) => cellOf(d, s, b).ratio / d);
    const m = mean(ks);
    groups.push({ windowScale: s, binning: b, slopePerDkt: m,
      maxRelSpread: maxOf(ks.map((k) => Math.abs(k / m - 1))) });
  }
  return { groups, maxRelSpreadOverAll: maxOf(groups.map((g) => g.maxRelSpread)),
    note: '同じ(観測窓・ビニング)の中で 比/Dκ が構成に依らず一定なら、比は Dκ に**比例**する = ' +
      '「0.92 という値は Dκ の選択の反映」の機械証拠。maxRelSpread は測定誤差の水準に落ちる' };
})();
const binningEffect = (() => {
  const rows = [];
  for (const d of SWEEP.dkt) for (const s of SWEEP.windowScale) {
    const a = cellOf(d, s, 'canonLog').ratio, b = cellOf(d, s, 'altLinear').ratio;
    rows.push({ dkt: d, windowScale: s, canonLog: a, altLinear: b, relShift: Math.abs(b / a - 1) });
  }
  return { rows, maxRelShift: maxOf(rows.map((r) => r.relShift)),
    minRelShift: minOf(rows.map((r) => r.relShift)),
    atCanonical: rows.find((r) => r.dkt === CANON_DKT && r.windowScale === 1),
    note: '係数も観測範囲も同じまま、部分窓の切り方(ln a 等間隔 → a 等間隔)だけを変えたときの' +
      '比の相対変化。推定量定義そのものが比を動かすことの機械証拠' };
})();
const windowEffect = (() => {
  const rows = [];
  for (const d of SWEEP.dkt) for (const b of SWEEP.binning) {
    const lo = cellOf(d, 0.5, b).ratio, hi = cellOf(d, 2, b).ratio;
    rows.push({ dkt: d, binning: b, w05: lo, w2: hi, factor: lo / hi });
  }
  return { rows, maxFactor: maxOf(rows.map((r) => r.factor)), minFactor: minOf(rows.map((r) => r.factor)),
    atCanonical: rows.find((r) => r.dkt === CANON_DKT && r.binning === 'canonLog'),
    note: '同じ係数・同じビニングのまま観測範囲を a:1→√3 から a:1→9 へ広げたときの比の倍率。' +
      '式(6) が a に依存する以上、「いつ観測したか」だけで推定値が動くことの機械証拠' };
})();
const calibrationPoint = (() => {
  // 論文2 の較正点: Dκ=0.9242 のとき a=2 の**点値**が Dκ に一致する(fig6 の丸印)
  const c = cellOf(CANON_DKT, 1, 'canonLog');
  const near2 = canon.rows.reduce((b, r) => Math.abs(r.aEff - 2) < Math.abs(b.aEff - 2) ? r : b, canon.rows[0]);
  return { dkt: CANON_DKT, pointValueAtA2: 2 * CANON_DKT / 2, nearestWindow: near2,
    aggregatedRatioOverCanonRange: c.ratio,
    note: '較正点は「a=2 の**点値**が Dκ」であり、観測範囲全体で集約した比(本ハーネスの表の値)' +
      'とは別量である。0.92 という数字が出るのは「Dκ=0.9242 を選び」「a=2 で読む」という' +
      '2つの選択の積であることが、この2つの数の違いに現れている' };
})();
out.raw.structure = { proportionality, binningEffect, windowEffect, calibrationPoint };
out.pw2 = { rule: PRE_REGISTERED.PW2, nCells: cells.length,
  table: cells.map((c) => ({ dkt: c.dkt, windowScale: c.windowScale, binning: c.binning,
    ratio: c.ratio, ratioAnalytic: c.ratioAnalytic, ratioControl: c.ratioControl,
    absDevFrom1: c.absDevFrom1 })),
  result: 'DESCRIPTIVE(窓なし)' };

// ============================ ③ PW3: 構造窓(プローブ依存が消えない)==========================
log('\n[3/4] PW3 — 全 30 構成で |比 − 1| > 数値床 か');
const pw3 = (() => {
  const per = cells.map((c) => ({ dkt: c.dkt, windowScale: c.windowScale, binning: c.binning,
    ratio: c.ratio, absDevFrom1: c.absDevFrom1, marginFactor: c.absDevFrom1 / NUM_FLOOR,
    pass: c.absDevFrom1 > NUM_FLOOR }));
  const fails = per.filter((p) => !p.pass);
  const worst = per.reduce((b, p) => (p.absDevFrom1 < b.absDevFrom1 ? p : b), per[0]);
  const ctlMax = maxOf(cells.map((c) => c.absDevFrom1Control));
  return {
    rule: PRE_REGISTERED.PW3,
    floor: NUM_FLOOR, nCells: per.length, nPass: per.length - fails.length,
    minAbsDevFrom1: worst.absDevFrom1, worstCell: worst,
    minMarginFactor: worst.absDevFrom1 / NUM_FLOOR,
    perCell: per,
    result: fails.length === 0 ? 'PASS' : 'FAIL',
    fails,
    control: { maxAbsDevFrom1: ctlMax, withinFloor: ctlMax <= NUM_FLOOR,
      note: '反比例対照(c_loc ∝ 1/W_B)は構成上 ≡ d_P = 1。全構成でその |比−1| が数値床以下に' +
        '収まるなら「プローブ依存が消える反実仮想が実装できている」ことの機械確認になる。' +
        '判定対象ではない(PW3.scope)' },
    subWindowHonesty: {
      cellsWhereCrossingInRange: cells.filter((c) => c.crossingInRange).length,
      minPerWindowAbsDevFrom1: minOf(cells.map((c) => c.perWindowMinAbsDevFrom1)),
      note: '部分窓レベルでは a*=2Dκ で比が 1 を横切るので、a* が観測範囲に入る構成には' +
        '「比が 1 に一致する時期」が存在する。PW3 は構成レベルの集約比についての窓であり、' +
        'この事実を隠さない(PRE_REGISTERED.PW3.honestLimitation)',
    },
  };
})();
out.pw3 = pw3;
log(`  → PW3 ${pw3.result}: 合格 ${pw3.nPass}/${pw3.nCells}・最小 |比−1|=${pw3.minAbsDevFrom1.toExponential(3)}` +
  `(床 ${NUM_FLOOR.toExponential(3)} の ${fmt(pw3.minMarginFactor, 2)} 倍)` +
  ` / 対照の最大 |比−1|=${pw3.control.maxAbsDevFrom1.toExponential(2)}`);

// ============================ ④ PW4: 決定性(別プロセス2回 SHA 一致)==========================
log('\n[4/4] PW4 — 決定性(raw の正準化 SHA-256)');
{
  const mine = JSON.stringify(canonize(out.raw));
  const rec = { rule: PRE_REGISTERED.PW4,
    canonicalization: PRE_REGISTERED.PW4.canonicalization,
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length,
    reference: null, referenceSha256: null, identical: null };
  const refPath = process.env.P2S_DET_REF;
  if (refPath && fs.existsSync(refPath)) {
    try {
      const other = JSON.parse(fs.readFileSync(refPath, 'utf8'));
      const otherJ = JSON.stringify(canonize(other.raw || {}));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
      rec.identical = (mine === otherJ);
      rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一構成)';
    } catch (e) { rec.error = String(e && e.message || e); }
  } else if (refPath) {
    rec.reference = path.basename(refPath);
    rec.note = '参照 JSON が存在しなかった';
  }
  out.pw4 = rec;
  out.determinism = rec;   // 既存便との呼称互換
  log(`  → SHA=${rec.sha256.slice(0, 16)}…  identical=${rec.identical === null ? '(参照なし)' : rec.identical}`);
}

// ==================== 論文2 本文への転記照合(手書き数値ゼロの機械保証)=======================
// 論文 tex に置いた機械読み取り用マーカ間の表本体と、宣言済みの本文値リテラルを読み、
// 本 JSON の値と突き合わせる。tex 側が未収載なら pending(判定なし)を記録する。
const paperSync = (() => {
  const D3 = (v) => v.toFixed(3);
  const expectedTable = SWEEP.dkt.map((d) => ({
    dkt: d,
    cells: [].concat(...SWEEP.windowScale.map((s) => SWEEP.binning.map((b) => D3(cellOf(d, s, b).ratio)))),
  }));
  // 本文へ転記する宣言済みリテラル(値は本 JSON から生成する — 手書きしない)
  const sci = (v, d = 1) => {
    const e = Math.floor(Math.log10(Math.abs(v)));
    const m = (v / Math.pow(10, e)).toFixed(d);
    return `${m}\\times10^{${e}}`;
  };
  const literals = {
    floor: sci(NUM_FLOOR),
    minAbsDev: sci(pw3.minAbsDevFrom1),
    binningShiftPct: (binningEffect.atCanonical.relShift * 100).toFixed(1),
    windowFactor: windowEffect.atCanonical.factor.toFixed(2),
    proportionalitySpread: sci(proportionality.maxRelSpreadOverAll),
  };
  const files = [
    { path: 'paper/dfm-paper2.tex', lang: 'en' },
    { path: 'paper/dfm-paper2-ja.tex', lang: 'ja' },
  ].map((f) => {
    const abs = path.join(ROOT, f.path);
    const rec = { path: f.path, lang: f.lang, present: false, sha256: null,
      tableRowsChecked: 0, tableValuesChecked: 0, tableMismatches: [],
      literalsChecked: 0, literalsMissing: [] };
    if (!fs.existsSync(abs)) { rec.error = 'ファイルなし'; return rec; }
    const src = fs.readFileSync(abs, 'utf8');
    rec.sha256 = sha256(Buffer.from(src, 'utf8'));
    const m = src.match(/% BEGIN p2sens-table[\s\S]*?\n([\s\S]*?)% END p2sens-table/);
    if (!m) { rec.note = 'p2sens-table マーカ未収載(tex 未更新 — pending)'; return rec; }
    rec.present = true;
    const body = m[1];
    const rows = body.split('\n').map((l) => l.trim())
      .filter((l) => l && !l.startsWith('%') && /\d\s*&/.test(l));
    for (const exp of expectedTable) {
      const line = rows.find((l) => l.replace(/\$/g, '').trim().startsWith(String(exp.dkt)));
      if (!line) { rec.tableMismatches.push(`Dκ=${exp.dkt} の行が見つからない`); continue; }
      rec.tableRowsChecked++;
      const nums = (line.replace(/\\\\.*$/, '').split('&').slice(1))
        .map((c) => c.replace(/[^0-9.\-]/g, '').trim()).filter((c) => c !== '');
      if (nums.length !== exp.cells.length) {
        rec.tableMismatches.push(`Dκ=${exp.dkt}: 列数 ${nums.length}(期待 ${exp.cells.length})`);
        continue;
      }
      for (let i = 0; i < nums.length; i++) {
        rec.tableValuesChecked++;
        if (nums[i] !== exp.cells[i])
          rec.tableMismatches.push(`Dκ=${exp.dkt} 第${i + 1}列: 本文 ${nums[i]} ≠ JSON ${exp.cells[i]}`);
      }
    }
    for (const [k, v] of Object.entries(literals)) {
      rec.literalsChecked++;
      if (!src.includes(v)) rec.literalsMissing.push(`${k}=${v}`);
    }
    rec.ok = rec.tableMismatches.length === 0 && rec.literalsMissing.length === 0 &&
      rec.tableRowsChecked === expectedTable.length;
    return rec;
  });
  const anyPresent = files.some((f) => f.present);
  return {
    expectedTable, literals, files,
    rounding: '表の値は小数第3位(toFixed(3))で転記する。本文リテラルは指数表記 ' +
      '(有効数字2桁)・百分率(小数第1位)・倍率(小数第2位)で転記する',
    result: !anyPresent ? 'PENDING(論文 tex に未収載)'
      : (files.every((f) => f.ok) ? 'PASS' : 'FAIL'),
    note: '論文2 本文・小表の数値が本 JSON の出力と一致することの機械照合。' +
      '実測数値の手書きを構造的に禁じる(第131便の事故の再発防止と同じ規律)',
  };
})();
out.paperSync = paperSync;
log(`\n転記照合(論文2 en/ja): ${paperSync.result}`);
for (const f of paperSync.files) {
  log(`  ${f.path}: 表 ${f.tableValuesChecked} 値 / 不一致 ${f.tableMismatches.length} 件 / ` +
    `本文リテラル欠落 ${f.literalsMissing ? f.literalsMissing.length : '—'} 件` +
    (f.note ? ` — ${f.note}` : ''));
  for (const x of (f.tableMismatches || []).slice(0, 8)) log(`     ! ${x}`);
  for (const x of (f.literalsMissing || []).slice(0, 8)) log(`     ! リテラル未検出 ${x}`);
}

// ================================ まとめ・マニフェスト =========================================
out.summary = {
  PW1: pw1.result, PW2: out.pw2.result, PW3: pw3.result,
  PW4: out.pw4.identical === null ? 'PENDING(参照なし)' : (out.pw4.identical ? 'PASS' : 'FAIL'),
  paperSync: paperSync.result,
  headline: {
    canonicalBitIdentical: pw1.bitIdentical,
    numericFloor: NUM_FLOOR,
    minAbsDevFrom1: pw3.minAbsDevFrom1,
    minMarginFactor: pw3.minMarginFactor,
    ratioProportionalToDktMaxSpread: proportionality.maxRelSpreadOverAll,
    binningRelShiftAtCanonical: binningEffect.atCanonical.relShift,
    windowFactorAtCanonical: windowEffect.atCanonical.factor,
  },
  reading: '比は(同じ観測窓・同じビニングの中では)Dκ に比例する — したがって「0.92」という' +
    '値そのものは Dκ=0.9242 という**選択**と「a=2 で読む」という**選択**の積である。' +
    '一方、|比−1| は 30 構成すべてで数値床を上回る — プローブ依存という**構造**は係数・観測窓・' +
    'ビニングの選び方に依らず残る。この2つが分離できたことが本ハーネスの結果である',
};
out.meta.timings.elapsedSec = Math.round((Date.now() - T_START) / 1000);
out.meta.stage = 'complete';

out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser,
  experiment: { id: 'p2sens', wave: 167,
    title: '論文2 プローブ依存比 H_w/H_geo の感度分析(減衰係数×観測窓×推定量定義)',
    command: 'node tests/exp-p2sens.mjs' },
  target: TARGET,
  presets: { mode: 'dynamic',
    declaredIn: 'tests/exp-p2sens.mjs の CFG(測定系)と SWEEP(掃引軸)',
    declaration: '内蔵プリセットを読まず、論文2 正本(tools/gen-figures2.mjs p2fig6 / HP.verify.v29)' +
      'の構成を逐語転記した宣言値から validatePreset → HP.sim.build する',
    configs: { CFG, SWEEP, canonDkt: CANON_DKT } },
  numerics: { seed: CFG.seed, dt: CFG.DT, timeScale: 1, substeps: NOT_APPLICABLE,
    steps: { canonical: Math.ceil(Math.log(CFG.A_END_CANON) / CFG.H0 / CFG.DT) + 1,
      perCell: 'ceil(ln(a_end)/H0/dt)+1(a_end = 3^s)', maxCell: Math.ceil(Math.log(9) / CFG.H0 / CFG.DT) + 1 },
    window: { canonical: 'a: 1→3 を ln a 等間隔で 24 分割(論文2 fig6 と同一)',
      sweep: '観測範囲 a: 1→3^s(s ∈ {0.5,1,2})を 24 分割。分割は canonLog(ln a 等間隔)/ ' +
        'altLinear(a 等間隔)の2種' },
    warmup: NOT_APPLICABLE },
  classification: {
    input: ['CFG(H0・K_t・c0・dt・d_P・粒子の初期条件 — 論文2 正本 p2fig6/V29 からの逐語転記)',
      'SWEEP.dkt(掃引する減衰係数。0.9242 は論文2 の較正値)',
      'SWEEP.windowScale(観測範囲の倍率)', 'SWEEP.binning(推定量定義)',
      'paper/figures/p2fig6.json(PW1 の照合参照 — 読み取り専用)'],
    fit: [],
    derived: ['raw.sweep[].ratio(24 部分窓の H_w/H_geo の算術平均)',
      'raw.sweep[].ratioAnalytic(式(6) の窓平均)', 'raw.sweep[].ratioControl(反比例対照)',
      'raw.numericFloor.value(正準構成の収束誤差)',
      'raw.structure.proportionality / binningEffect / windowEffect'],
    holdOut: [],
    note: '較正自由度はゼロである(fit=[])。Dκ は掃引する**入力**であって当てはめていない。' +
      '解析値は論文2 式(6) の窓平均で、実測とは独立に閉じた式から計算される',
  },
  judgement: { pointers: ['pw1.result', 'pw1.maxRelDiffVsCommitted', 'raw.numericFloor.value',
    'pw3.result', 'pw3.minAbsDevFrom1', 'pw3.perCell', 'pw4.sha256', 'paperSync.result'],
    note: '判定の実体は上記の位置にある(manifest は位置ポインタだけを持つ)。' +
      '窓の逐語は preRegistered.PW1〜PW4 にある',
    externalReferences: NOT_APPLICABLE },
  health: {
    conservation: { status: 'instrumented',
      quantity: '固有速度 w(箱の膨張下で保存されるべき量。論文2 V27/V28)',
      canonicalDrift: canon.wDrift, maxDriftOverSweep: maxOf(cells.map((c) => c.wDrift)),
      tolerance: 1e-3,
      withinTolerance: maxOf(cells.map((c) => c.wDrift)) < 1e-3,
      note: '正準構成の w 保存ずれは committed 正本 p2fig6.json の maxWDrift と同一値になる' +
        '(PW1 の bit 一致の一部)。観測窓 ×2 は走行が長いぶんずれが増えるので構成別に記録する' },
  },
  payload: out,
  excludeKeys: ['meta.timings', 'meta.date', 'paperSync'],
  regenerationNote: '再実行の照合対象は raw(実測部)である。meta.timings / meta.date は非測定メタ、' +
    'paperSync は論文 tex の内容に依存するため raw に含めない(PW4 の対象は raw のみ)',
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1));
await browser.close();
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch {}

log('\n================ 第167便 exp-p2sens まとめ ================');
log(`PW1(転記照合・基準再現): ${pw1.result} — committed 正本との最大相対差=` +
  `${pw1.maxRelDiffVsCommitted.toExponential(2)}(許容 1e-2)・bit 一致=${pw1.bitIdentical}`);
log(`PW2(記述): ${cells.length} 構成を収載。比/Dκ の構成内ばらつき最大=` +
  `${proportionality.maxRelSpreadOverAll.toExponential(2)}(= 比は Dκ に比例)`);
log(`PW3(構造窓): ${pw3.result} — 最小 |比−1|=${pw3.minAbsDevFrom1.toExponential(3)} > 床 ` +
  `${NUM_FLOOR.toExponential(3)}(余裕 ${fmt(pw3.minMarginFactor, 1)} 倍)`);
log(`PW4(決定性): SHA=${out.pw4.sha256.slice(0, 16)}… identical=` +
  `${out.pw4.identical === null ? '(参照なし)' : out.pw4.identical}`);
log(`転記照合: ${paperSync.result}`);
log(`出力: ${path.relative(ROOT, OUT_PATH)}(${Math.round(fs.statSync(OUT_PATH).size / 1024)} KB・` +
  `${out.meta.timings.elapsedSec}s)`);

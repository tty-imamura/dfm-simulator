// 第276便a(原仮定者の裁定〔第66報〕(1))— **背景複素決定力 (W₀, A₀, ∇W₀, ∇A₀, ∂ₜW₀, ∂ₜA₀) の純関数**。
//
// ■ 裁定の字義(第66報 (1))
//   「**『背景決定力 D₀』と別途『背景複素決定力』を用意する。**『引きずり減衰 q』の算出や計算など
//     影響箇所を精査する。両者はサンプルによって変動するがシチュエーションで決まるので事前予測が可能。」
//
// ■ 本器が測ること(**すべて実測・判定はしない**)
//   ① **源分割の同値**: 同じ物理配置を「明示して置く源」と「背景へ畳む源」に分ける**分け方を変えても**
//      u・∇u・∂ₜu・W が変わらないか。**第275便b のスカラー版と違い、背景側にも同じ ε を入れる**ので
//      **厳密な同値が成り立つはず**である(成り立たなければそれは実装の誤りとして出る)。
//   ② **空間微分の中心差分検算**: ∇u=(∇A−u⊗∇W)/W が、評価点をずらして作り直した u の中心差分と合うか。
//   ③ **時間微分の検算**: ∂ₜu=(∂ₜA−u·∂ₜW)/W が、源を ±h 進めた u の中心差分と合うか。
//   ④ **不完全な背景データの拒否**: 成分が欠けた背景・W₀<0・W₀=0 なのに A₀≠0 などが **null** になるか
//      (**未入力の背景を静止ゼロで埋めない** —— 「ゼロと宣言」は全成分 0 を明示したときだけ)。
//   ⑤ **旧経路との一致**: ページの `dfmLocalMeshField`(χ=W/(D₀+W)・背景 u_bg)は、
//      (N3) で **W₀=D₀ / A₀=D₀·u_bg / ∇W₀=0 / ∇A₀=D₀·∇u_bg / ∂ₜW₀=0 / ∂ₜA₀=D₀·∂ₜu_bg** と
//      置いた**特別な場合**か。**p=2 ではビット一致を要求する**(p=1 は `Math.pow(·,−0.5)` の
//      ページと node の 1 ULP 差があるので相対差で見る —— 第275便b ⑥ で実測済み)。
//   ⑥ **W₀ と A₀ を同じ数にしてはならない**ことの否定対照(統括の読み R40): 反対向きに動く 2 源は
//      **分子 A では相殺しても重み W には正で残る**。同じ数を入れた場合との差を数で出す。
//
// ■ しないこと
//   ・エンジンの既定経路へ接続しない(`beta/index.html` の力学は 1 bit も変えていない ——
//     足したのは**宣言鍵 `physics.backgroundComplex` の受理契約**と、読み取り専用の `HP.qLockCalc` だけ)。
//   ・「複素決定力場を実装した」「背景を較正した」とは書かない。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w276a-bgfield.mjs
// 出力: tests/out/bgfield-w276a.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { MESHFIELD_VERSION, NOD0_NORMS, NOD0_LAW_NAME, BG_COMPONENTS,
  normalizeBackground, meshFieldNoD0 } from './lib-w275b-meshfield.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'bgfield-w276a.json');
const HARNESS_VERSION = 'w276a-bgfield-1';

// ---------------------------------------------------------------- 試験配置(**宣言**)
// 5 源。速度・加速度・角速度・角加速度をすべて別の値にして、どの項が落ちても差が出るようにする。
const SRC = [
  { id: 's0', m: 3.0, x: -4.0, y: 1.5, vx: 0.30, vy: -0.20, ax: 0.010, ay: 0.020, omega: 0.05, omegaDot: 0.003 },
  { id: 's1', m: 1.0, x: 2.5, y: -3.0, vx: -0.10, vy: 0.40, ax: -0.020, ay: 0.005, omega: -0.02, omegaDot: 0.001 },
  { id: 's2', m: 7.5, x: 9.0, y: 6.0, vx: 0.05, vy: 0.05, ax: 0.001, ay: -0.003, omega: 0.01, omegaDot: -0.002 },
  { id: 's3', m: 0.5, x: -8.0, y: -7.0, vx: 0.22, vy: 0.11, ax: 0.004, ay: 0.002, omega: 0.00, omegaDot: 0.000 },
  { id: 's4', m: 12.0, x: 25.0, y: -18.0, vx: -0.07, vy: 0.09, ax: 0.0005, ay: 0.0007, omega: 0.03, omegaDot: 0.0004 },
];
const PX = 0.75, PY = -0.25;                     // 評価点(源の上に乗らない)
const EPS = 0.05, PSET = [1, 2];

// **背景 = 畳んだ源の (W,A,∇W,∇A,∂ₜW,∂ₜA)**(同じ点・同じ ε・同じ p で作る)。
// 源が 1 つも無ければ **「ゼロと宣言」**(全成分 0)—— **黙って既定を置くのではなく明示する**。
function backgroundFromSources(folded, px, py, o) {
  if (!folded.length) return { W0: 0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
  const r = meshFieldNoD0(folded, px, py, { p: o.p, eps: o.eps, norm: 'self' });
  if (!r) return null;
  return { W0: r.W, A0: r.A.slice(), gradW: r.gradW.slice(), gradA: r.gradA.slice(),
    dWdt: r.dWdt, dAdt: r.dAdt.slice() };
}
const relDiff = (a, b) => {
  const d = Math.abs(a - b), s = Math.max(Math.abs(a), Math.abs(b));
  return s > 0 ? d / s : d;
};
const cmp = (r, q) => {
  if (!r || !q) return null;
  const pairs = [['ux', r.u[0], q.u[0]], ['uy', r.u[1], q.u[1]],
    ['gradU0', r.gradU[0], q.gradU[0]], ['gradU1', r.gradU[1], q.gradU[1]],
    ['gradU2', r.gradU[2], q.gradU[2]], ['gradU3', r.gradU[3], q.gradU[3]],
    ['dUdt0', r.dUdt[0], q.dUdt[0]], ['dUdt1', r.dUdt[1], q.dUdt[1]]];
  let maxRel = 0, maxAbs = 0, bits = 0;
  for (const [, a, b] of pairs) {
    maxRel = Math.max(maxRel, relDiff(a, b)); maxAbs = Math.max(maxAbs, Math.abs(a - b));
    if (a === b) bits++;
  }
  return { n: pairs.length, bitSame: bits, maxRel, maxAbs };
};

// ================================================================ ① 源分割の同値
const PARTITIONS = [[], ['s4'], ['s3', 's4'], ['s1', 's2', 's3'], ['s0', 's1', 's2', 's3', 's4']];
const splitEquiv = [];
for (const p of PSET) {
  const ref = meshFieldNoD0(SRC, PX, PY, { p, eps: EPS, norm: 'self' });
  for (const fold of PARTITIONS) {
    const placed = SRC.filter((b) => fold.indexOf(b.id) < 0);
    const folded = SRC.filter((b) => fold.indexOf(b.id) >= 0);
    const bg = backgroundFromSources(folded, PX, PY, { p, eps: EPS });
    const got = meshFieldNoD0(placed, PX, PY, { p, eps: EPS, norm: 'background', bg });
    splitEquiv.push({ p, folded: fold.slice(), nPlaced: placed.length, nFolded: folded.length,
      W0: bg ? bg.W0 : null, Wplaced: got ? got.W : null,
      Wtotal: got ? got.W + got.W0 : null, WtotalRef: ref ? ref.W : null,
      chi: got ? got.chi : null, cmp: cmp(ref, got),
      WrelDiff: (got && ref) ? relDiff(got.W + got.W0, ref.W) : null });
  }
}
const splitMaxRel = Math.max(...splitEquiv.map((z) => (z.cmp ? z.cmp.maxRel : Infinity)));

// ================================================================ ② 空間微分の中心差分
//   背景も評価点ごとに作り直す(= 背景は場であって定数ではない)。誤差は h² で落ちる。
const FOLD_FD = ['s2', 's4'];
const fdSpace = [];
for (const p of PSET) {
  const placed = SRC.filter((b) => FOLD_FD.indexOf(b.id) < 0);
  const folded = SRC.filter((b) => FOLD_FD.indexOf(b.id) >= 0);
  const at = (qx, qy) => meshFieldNoD0(placed, qx, qy,
    { p, eps: EPS, norm: 'background', bg: backgroundFromSources(folded, qx, qy, { p, eps: EPS }) });
  const r0 = at(PX, PY);
  for (const h of [1e-2, 1e-3, 1e-4]) {
    const xp = at(PX + h, PY), xm = at(PX - h, PY), yp = at(PX, PY + h), ym = at(PX, PY - h);
    const num = [(xp.u[0] - xm.u[0]) / (2 * h), (yp.u[0] - ym.u[0]) / (2 * h),
      (xp.u[1] - xm.u[1]) / (2 * h), (yp.u[1] - ym.u[1]) / (2 * h)];
    const numW = [(xp.W + xp.W0 - xm.W - xm.W0) / (2 * h), (yp.W + yp.W0 - ym.W - ym.W0) / (2 * h)];
    fdSpace.push({ p, h,
      gradU: r0.gradU.slice(), gradUFd: num,
      gradURelMax: Math.max(...r0.gradU.map((z, i) => relDiff(z, num[i]))),
      gradW: r0.gradW.slice(), gradWFd: numW,
      gradWRelMax: Math.max(...r0.gradW.map((z, i) => relDiff(z, numW[i]))) });
  }
}

// ================================================================ ③ 時間微分の検算
//   源を ±h 進める(x+vt+½at²・v+at・ω+ω̇t)。評価点は**固定**(∂ₜ|_x の定義そのもの)。
const advance = (arr, t) => arr.map((b) => ({ ...b,
  x: b.x + b.vx * t + 0.5 * b.ax * t * t, y: b.y + b.vy * t + 0.5 * b.ay * t * t,
  vx: b.vx + b.ax * t, vy: b.vy + b.ay * t,
  omega: b.omega + b.omegaDot * t }));
const fdTime = [];
for (const p of PSET) {
  const at = (t) => {
    const A = advance(SRC, t);
    const placed = A.filter((b) => FOLD_FD.indexOf(b.id) < 0);
    const folded = A.filter((b) => FOLD_FD.indexOf(b.id) >= 0);
    return meshFieldNoD0(placed, PX, PY, { p, eps: EPS, norm: 'background',
      bg: backgroundFromSources(folded, PX, PY, { p, eps: EPS }) });
  };
  const r0 = at(0);
  for (const h of [1e-2, 1e-3, 1e-4]) {
    const tp = at(h), tm = at(-h);
    const num = [(tp.u[0] - tm.u[0]) / (2 * h), (tp.u[1] - tm.u[1]) / (2 * h)];
    const numW = (tp.W + tp.W0 - tm.W - tm.W0) / (2 * h);
    fdTime.push({ p, h, dUdt: r0.dUdt.slice(), dUdtFd: num,
      dUdtRelMax: Math.max(...r0.dUdt.map((z, i) => relDiff(z, num[i]))),
      dWdt: r0.dWdt, dWdtFd: numW, dWdtRel: relDiff(r0.dWdt, numW) });
  }
}

// ================================================================ ④ 不完全な背景の拒否
const FULL = { W0: 1.5, A0: [0.3, -0.2], gradW: [0.01, 0.02], gradA: [0.001, 0.002, 0.003, 0.004],
  dWdt: 0.05, dAdt: [0.006, 0.007] };
const ZERO = { W0: 0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
const drop = (k) => { const o = JSON.parse(JSON.stringify(FULL)); delete o[k]; return o; };
const set = (k, v) => { const o = JSON.parse(JSON.stringify(FULL)); o[k] = v; return o; };
const gateCases = {
  full: FULL, zeroDeclared: ZERO,
  missingW0: drop('W0'), missingA0: drop('A0'), missingGradW: drop('gradW'),
  missingGradA: drop('gradA'), missingDWdt: drop('dWdt'), missingDAdt: drop('dAdt'),
  negativeW0: set('W0', -1), nanW0: set('W0', NaN), infDWdt: set('dWdt', Infinity),
  shortA0: set('A0', [0.3]), longGradA: set('gradA', [1, 2, 3, 4, 5]),
  stringW0: set('W0', '1.5'), arrayBg: [1, 2, 3], nullBg: null,
  zeroW0WithA0: Object.assign({}, ZERO, { W0: 0, A0: [0.1, 0] }),
  zeroW0WithGradW: Object.assign({}, ZERO, { W0: 0, gradW: [0.1, 0] }),
};
const gate = {};
for (const [k, v] of Object.entries(gateCases)) {
  const nb = normalizeBackground(v);
  const fld = meshFieldNoD0(SRC, PX, PY, { p: 2, eps: EPS, norm: 'background', bg: v });
  gate[k] = { normalized: nb !== null, field: fld !== null };
}
// **未宣言(bg そのものが無い)は null**(= 静止ゼロで埋めない)
gate.noBgAtAll = { normalized: normalizeBackground(undefined) !== null,
  field: meshFieldNoD0(SRC, PX, PY, { p: 2, eps: EPS, norm: 'background' }) !== null };
// **源が 0 本でも背景だけで場は定義される**(ゼロ宣言の背景 + 源 0 は分母 0 なので null)
gate.bgOnlyNoSources = { normalized: true,
  field: meshFieldNoD0([], PX, PY, { p: 2, eps: EPS, norm: 'background', bg: FULL }) !== null };
gate.zeroBgNoSources = { normalized: true,
  field: meshFieldNoD0([], PX, PY, { p: 2, eps: EPS, norm: 'background', bg: ZERO }) !== null };

// ================================================================ ⑥ W₀ と A₀ を同じ数にしない
//   反対向きに動く 2 源: A は相殺に向かうが W は正のまま残る(統括の読み R40)。
const OPP = [
  { m: 1, x: -3, y: 0, vx: 0, vy: 1.0 },
  { m: 1, x: 3, y: 0, vx: 0, vy: -1.0 },
];
const oppSelf = meshFieldNoD0(OPP, 0, 0, { p: 2, eps: EPS, norm: 'self' });
const oppBg = backgroundFromSources(OPP, 0, 0, { p: 2, eps: EPS });
// 「W₀ と A₀ を同じ数にした」誤った背景(A₀=[W₀,W₀])と、正しい背景で u を比べる
const oppRight = meshFieldNoD0(SRC, PX, PY, { p: 2, eps: EPS, norm: 'background', bg: oppBg });
const oppWrongBg = Object.assign({}, oppBg, { A0: [oppBg.W0, oppBg.W0] });
const oppWrong = meshFieldNoD0(SRC, PX, PY, { p: 2, eps: EPS, norm: 'background', bg: oppWrongBg });
const oppositePair = { W0: oppBg.W0, A0: oppBg.A0.slice(),
  A0overW0: [oppBg.A0[0] / oppBg.W0, oppBg.A0[1] / oppBg.W0],
  uSelf: oppSelf ? oppSelf.u.slice() : null,
  uWithCorrectBg: oppRight ? oppRight.u.slice() : null,
  uWithA0EqualW0: oppWrong ? oppWrong.u.slice() : null,
  relChange: (oppRight && oppWrong)
    ? [relDiff(oppRight.u[0], oppWrong.u[0]), relDiff(oppRight.u[1], oppWrong.u[1])] : null };

// ================================================================ ⑤ 旧経路との一致(ページ)
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);

const D0_PROBE = 2.5;
const UBG = { u: [0.4, -0.3], gradU: [0.01, -0.02, 0.03, 0.04], dUdt: [0.005, -0.006] };
const legacy = [];
for (const p of PSET) {
  const eng = await page.evaluate((z) => {
    const r = HP.dfmLocalMeshField(z.src, z.px, z.py,
      { D0: z.D0, eps: z.eps, p: z.p, support: false, bg: z.ubg });
    return r ? { u: r.u, gradU: r.gradU, dUdt: r.dUdt, chi: r.chi, W: r.W } : null;
  }, { src: SRC, px: PX, py: PY, D0: D0_PROBE, eps: EPS, p, ubg: UBG });
  // (N3) で旧経路と同じ背景を作る: W₀=D₀ / A₀=D₀·u_bg / ∇W₀=0 / ∇A₀=D₀·∇u_bg / ∂ₜW₀=0 / ∂ₜA₀=D₀·∂ₜu_bg
  const bg = { W0: D0_PROBE, A0: [D0_PROBE * UBG.u[0], D0_PROBE * UBG.u[1]],
    gradW: [0, 0], gradA: UBG.gradU.map((z) => D0_PROBE * z),
    dWdt: 0, dAdt: UBG.dUdt.map((z) => D0_PROBE * z) };
  const got = meshFieldNoD0(SRC, PX, PY, { p, eps: EPS, norm: 'background', bg });
  legacy.push({ p, D0: D0_PROBE, engine: eng, nod0: got ? { u: got.u, gradU: got.gradU,
    dUdt: got.dUdt, chi: got.chi, W: got.W } : null, cmp: cmp(eng, got),
    chiRel: (eng && got) ? relDiff(eng.chi, got.chi) : null });
}
// **背景を「ゼロと宣言」した場合**は旧経路の D₀=0 と一致するか(源だけの自己規格化)
const zeroVsD0zero = [];
for (const p of PSET) {
  const eng = await page.evaluate((z) => {
    const r = HP.dfmLocalMeshField(z.src, z.px, z.py, { D0: 0, eps: z.eps, p: z.p, support: false });
    return r ? { u: r.u, gradU: r.gradU, dUdt: r.dUdt, chi: r.chi, W: r.W } : null;
  }, { src: SRC, px: PX, py: PY, eps: EPS, p });
  const got = meshFieldNoD0(SRC, PX, PY, { p, eps: EPS, norm: 'background', bg: ZERO });
  zeroVsD0zero.push({ p, cmp: cmp(eng, got), chi: got ? got.chi : null });
}
await browser.close();

// ---------------------------------------------------------------- 書き出し
const CODE = ['tests/exp-w276a-bgfield.mjs', 'tests/lib-w275b-meshfield.mjs',
  'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第276便a', target: TARGET,
    code: CODE, inputs: [TARGET] }), {
    harness: 'tests/exp-w276a-bgfield.mjs', harnessVersion: HARNESS_VERSION,
    meshfieldVersion: MESHFIELD_VERSION, norms: NOD0_NORMS, lawVersionProposed: NOD0_LAW_NAME,
    bgComponents: BG_COMPONENTS,
    ruling: '第66報 (1): 「背景決定力 D₀」と別途「背景複素決定力」を用意する。'
      + '引きずり減衰 q の算出や計算など影響箇所を精査する',
    definition: 'W = W₀ + Σ w_i ・ A = A₀ + Σ w_i u_i ・ u = A/W ・ '
      + '∇u = (∇A − u⊗∇W)/W ・ ∂ₜu = (∂ₜA − u·∂ₜW)/W ・ χ = (Σ w_i)/W',
    units: { D0: 'M/L(スカラーの背景決定力 —— 別の量)', W0: 'M/L²', A0: 'M/(L·T)',
      gradW: 'M/L³', gradA: 'M/(L²·T)', dWdt: 'M/(L²·T)', dAdt: 'M/(L·T²)' },
    config: { sources: SRC, px: PX, py: PY, eps: EPS, pSet: PSET, foldForFd: FOLD_FD,
      note: '背景は**同じ点・同じ ε・同じ p** で畳んだ源から作る(第275便b のスカラー版は背景に '
        + 'ε を入れなかったので ε>0 でずれた —— 本便は入れるので同値が厳密になる)' },
    notClaim: ['複素決定力場を実装した', '背景を較正した', '背景の定義を解決した',
      'エンジンへ接続した', '観測と一致した'] }),
  splitEquivalence: { rows: splitEquiv, maxRel: splitMaxRel, exact: splitMaxRel === 0 },
  fdSpace, fdTime, gate, oppositePair,
  legacyEquivalence: { rows: legacy, background: UBG, D0: D0_PROBE },
  zeroDeclaredVsD0Zero: zeroVsD0zero,
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote ' + OUT);
console.log('split maxRel = ' + splitMaxRel + ' (exact=' + (splitMaxRel === 0) + ')');
for (const r of legacy) {
  console.log('legacy p=' + r.p + ' bitSame=' + (r.cmp ? r.cmp.bitSame : '-')
    + '/8 maxRel=' + (r.cmp ? r.cmp.maxRel : '-'));
}

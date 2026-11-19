// 第344便c(原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN879「推奨で進める」・原仮定者の回答(2026-11-19 —— 第143報の回答 1)AN866・原仮定者の回答(2026-11-19 —— 第143報)AN853 = B・
//   原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・統括の検証項目 R387): **時計の形と中くらいの速さでの時計の測定(文献の値・未照合)との並び・h の立ち上がりの鋭さのノブ・
//   光の経路(当事者時間で測った速さの読み —— 主の列)・atX1 の定義域を並べる純関数 —— 診断だけ**
//   (器 tests/exp-w344c-clockmid.mjs と QA behavior.clockmid344c・docs.clockmid344c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   エンジン・時計の式・運動の式・光線・内蔵の本・受理器は変えない(読むだけ)。第343便c・第342便b・第341便e の lib は呼ぶだけ。
//
// ■ 記号(〔第343便c〕と同じ —— 無次元・基準光速 c₀ = 1): x = w ÷ c_loc(絶対時間で見た速さ)・g = 速さによる時計の因子・y = x ÷ g(当事者時間で測った速さ —— 主の列 B)。
// ■ 観測量(その実験が測った量に合わせる): 速いイオンに同方向と逆方向の光を当てた 2 つの周波数 ν_p・ν_a と、静止の 2 つの遷移の周波数 ν_1・ν_2 から ε = √(ν_a ν_p ÷(ν_1 ν_2))− 1。
//   比べる仮定(この器の宣言): 実験室 = 場の枠/光の位相の伝わりと向きの因子 1 ∓ x は今のまま/原子の遷移は当事者時間に従う/同じ場所の静止の時計 N は比で消える。
//   このとき ν_a(1 + x)÷ g = ν_1・ν_p(1 − x)÷ g = ν_2 → ε の見込み = g ÷ √(1 − x²) − 1(今の点の時計の形 g = √(1 − x²)では 0)。
//   光学と原子の遷移の側も変える候補には、この表を流用しない(4 つの周波数を、その候補で別に数える)。
// ■ 言わないこと: 形は候補(時計の則ではない)・どの形を採るかを決めない・文献の値は未照合(採用・棄却に使わない)・アプリの時計と光線には何も入れない。
import * as C343 from './lib-w343c-clockread.mjs';
import * as B342 from './lib-w342b-clockstop.mjs';
import * as L341 from './lib-w341e-lightmass.mjs';

export const LIB_VERSION = 'w344c-clockmid-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const E2 = Math.E - 2;

export const DECL = Object.freeze({
  /** T2: 中くらいの速さのイオンの時計の測定(文献の値・未照合) */
  ion: Object.freeze({ xHigh: 0.338, xLow: 0.064, epsRep: 1.5e-9, epsSig: 2.3e-9,
    freqMHz: Object.freeze({ nu1: 546455143.0, nu2: 546474960.7, nua: 384225534.98, nup: 777210326.98 }),
    srcHigh: 'β = 0.338 のリチウムのイオンの蓄積リングの時計の測定の報告 ε = (1.5 ± 2.3)e-9(Botermann ほか、Phys. Rev. Lett. 113, 120405, 2014)(文献の値・未照合 —— この環境では一次資料と照合していない)',
    srcFreq: '同じ測定の 4 つの周波数(MHz —— 静止の遷移 546455143.0・546474960.7・逆方向 384225534.98・同方向 777210326.98)は、出典の表の数として伝えられた値(文献の値・未照合 —— この環境では一次資料と照合していない)',
    srcLow: 'β = 0.064 の測定(Saathoff ほか、Phys. Rev. Lett. 91, 190403, 2003)(文献・未照合 —— 報告の上限の桁は出典で照合していないので、数は書かない)' }),
  ionAssume: Object.freeze(['実験室 = 場の枠(リングの場に対するイオンの速さ = 実験室の速さ)', '光の位相の伝わりと向きの因子 1 ∓ x は今のまま', '原子の遷移は当事者時間に従う(遷移の周波数 ÷ g)', '同じ場所の静止の時計 N は比で消える']),
  /** T2 と T5: ε の見込みを読む x(T2 は測定の速さ・T5 は中くらい〜速い側) */
  xIon: Object.freeze([0.064, 0.338]),
  xFast: Object.freeze([0.6, 0.9]),
  /** T3: h = (e − 2) y^n ÷(1 + c (y^m − 1))の鋭さ n・遠くの型(m = 2n で h → 0/m = n で h → (e − 2)/c)・係数 c */
  nGrid: Object.freeze([4, 8, 12, 16, 20, 24, 32]),
  farTypes: Object.freeze(['m2n', 'mn']),
  cKnob: 0.5,
  xMid: Object.freeze([0.5, 0.6, 0.7, 0.8, 0.9]),
  nMid: Object.freeze([4, 12, 20, 32]),
  /** T3: 指数の立ち上がりの型の a₀(y = 1 の立ち上がりの傾き + 2)と p(鋭さ)・y = 1 の近くの表に載せる組 */
  a0Grid: Object.freeze([3, 4, 6]),
  pGrid: Object.freeze([1, 2, 3, 4, 6]),
  xMidSpecs: Object.freeze([Object.freeze([4, 2]), Object.freeze([4, 3]), Object.freeze([4, 4])]),
  /** 単調の走査: 対数の格子 1e-2〜1e3 の点の数 */
  nScan: 20000,
  /** T4: 光の経路 —— 有限の y の列・駆動のべき(0 = 今のアプリの力学・1 = 第342便b のべき 1)・代表の鋭さ・数値の走りの衝突径数 ÷ μ */
  yLight: Object.freeze([1, 2, 4, 8, 16]),
  nDrive: Object.freeze([0, 1]),
  nLight: Object.freeze([4, 20]),
  bNum: 1e5,
});

/* ───────── 観測量の算術 ───────── */
/** 4 つの周波数からの ε = √(ν_a ν_p ÷(ν_1 ν_2))− 1(比を先に取る —— 大きな数の積を作らない) */
export function epsOfFreq(f = DECL.ion.freqMHz) { const r = (f.nua / f.nu1) * (f.nup / f.nu2); return Math.sqrt(r) - 1; }
/** 比べる仮定の下の ε の見込み(g と x から) */
export const epsOf = (g, x) => g / Math.sqrt(1 - x * x) - 1;
/** 仮定の下で 4 つの周波数を作り直す(静止の 2 つの遷移と g・x から ν_a・ν_p)—— 零試験: g = √(1 − x²)で ε = 0 */
export function freqOf(g, x, nu1, nu2) { return { nua: nu1 * g / (1 + x), nup: nu2 * g / (1 - x) }; }

/* ───────── T2 の形(〔第343便c〕の関数を呼ぶ)───────── */
// 'F'   今の点の時計の形(B の読みの k = ½ —— √(1 − x²) と同じ時計)
// 'k1' 'k2' 'kinf' 'kstar'  1 ノブの族(B の読み・下の枝)
// 'h1' 'h2' 'h3'  2 ノブの族(統括の参考の試作 —— 〔第343便c〕T6・h3 は下の枝)
export const FORMS2 = Object.freeze(['F', 'k1', 'k2', 'kinf', 'kstar', 'h1', 'h2', 'h3']);
const kOfForm = (f) => ({ F: 0.5, k1: 1, k2: 2, kinf: 'inf' })[f];
/** 形 f の絶対時間の速さ x での時計(B の読み・下の枝)と y。届かない x は null */
export function clockAtX(f, x) {
  if (!(fin(x) && x >= 0 && x < 1)) throw new Error('clockAtX: x は 0 ≤ x < 1 ' + x);
  if (f === 'F') return { y: x / Math.sqrt(1 - x * x), g: Math.sqrt(1 - x * x), eps: 0 };
  if (f === 'k1' || f === 'k2' || f === 'kinf' || f === 'kstar') {
    const k = f === 'kstar' ? C343.kStar() : kOfForm(f), G = C343.gOfXB(k, x).lower;
    if (G === null) return null;
    return { y: x / G, g: G, eps: epsOf(G, x) };
  }
  if (f === 'h1' || f === 'h2' || f === 'h3') {
    const y = C343.yOfX2(f, x); if (y === null) return null;
    const h = C343.hOf(f, y);
    return { y, g: C343.g2(f, y), eps: Math.expm1(-0.5 * Math.log1p(h)) };   // 恒等式 g ÷ √(1 − x²) = (1 + h)^(−½)
  }
  throw new Error('clockAtX: 形が無い ' + f);
}
export function t2Rows() {
  const I = DECL.ion, epsArith = epsOfFreq();
  const rows = FORMS2.map((f) => {
    const at = DECL.xIon.map((x) => clockAtX(f, x));
    const hi = at[1];
    return { form: f, y: at.map((r) => (r ? r.y : null)), g: at.map((r) => (r ? r.g : null)), eps: at.map((r) => (r ? r.eps : null)),
      dSigHigh: hi ? (hi.eps - I.epsRep) / I.epsSig : null, dSigHighArith: hi ? (hi.eps - epsArith) / I.epsSig : null };
  });
  // 零試験: 今の点の時計の形で仮定の下の 4 つの周波数を作り直すと ε = 0/1 ノブの族の k = ½ を gOfXB で読んでも 0
  let zF = 0; for (const x of [0.064, 0.338, 0.6, 0.9]) { const F = freqOf(Math.sqrt(1 - x * x), x, I.freqMHz.nu1, I.freqMHz.nu2); zF = Math.max(zF, Math.abs(epsOfFreq({ ...I.freqMHz, nua: F.nua, nup: F.nup }))); }
  let zK = 0; for (const x of [0.064, 0.338, 0.6]) zK = Math.max(zK, Math.abs(epsOf(C343.gOfXB(0.5, x).lower, x)));
  // 2 ノブの族の ε の 2 つの数え方(恒等式 (1 + h)^(−½) − 1 と g ÷ √(1 − x²) − 1)の差
  let zH = 0; for (const f of ['h1', 'h2', 'h3']) for (const x of [0.338, 0.6]) { const r = clockAtX(f, x); if (r) zH = Math.max(zH, Math.abs(r.eps - epsOf(r.g, x))); }
  return { epsArith, epsRep: I.epsRep, epsSig: I.epsSig, arithOverSig: (epsArith - I.epsRep) / I.epsSig, rows, zero: { freqF: zF, kHalf: zK, hTwoWays: zH } };
}
export function t5Rows() {
  return FORMS2.map((f) => { const at = DECL.xFast.map((x) => clockAtX(f, x)); return { form: f, y: at.map((r) => (r ? r.y : null)), eps: at.map((r) => (r ? r.eps : null)) }; });
}

/* ───────── T3 h の立ち上がりの鋭さ(ノブ)───────── */
// 2 ノブの族 g(y)^(−2) = 1 + y² + h(y)・h(1) = e − 2 のまま、h の立ち上がりの型を 2 つ:
//   有理の型 S: h = (e − 2) y^n ÷(1 + c (y^m − 1))(0 ≤ c < 1)—— 遠くの型 'm2n' = m = 2n(h → 0)/'mn' = m = n(h → (e − 2)/c)。c = 0 は h = (e − 2) y^n(遠くで増す —— 〔第343便c〕の h3 は n = 4)。
//   指数の立ち上がりの型 X: h = (e − 2) exp(A (1 − y^(−p))) × 2 ÷(1 + y⁴)・A = a₀ ÷ p(y = 1 での立ち上がりの傾き d ln h/d ln y = a₀ − 2)。遠くで h → 0。
//   x(y) が単調 ⇔ y h′ < 2(1 + h)(h が e − 2 の近くでは d ln h/d ln y < 2(e − 1)/(e − 2) = 4.78)。
const mOf = (far, n) => (far === 'm2n' ? 2 * n : far === 'mn' ? n : NaN);
/** 型の宣言 spec = { kind: 'S', n, far, c } か { kind: 'X', p, a0 } の h(y) */
export function hSpec(spec, y) {
  if (!(fin(y) && y >= 0)) throw new Error('hSpec: y は有限で非負 ' + y);
  if (spec.kind === 'S') {
    const { n, far, c } = spec;
    if (!(fin(c) && c >= 0 && c < 1)) throw new Error('hSpec: c は 0 ≤ c < 1 ' + c);
    if (!(fin(n) && n > 0)) throw new Error('hSpec: n は正 ' + n);
    const m = mOf(far, n); if (!fin(m)) throw new Error('hSpec: 遠くの型が無い ' + far);
    return E2 * Math.pow(y, n) / (1 + c * (Math.pow(y, m) - 1));
  }
  if (spec.kind === 'X') {
    const { p, a0 } = spec; if (!(fin(p) && p > 0 && fin(a0) && a0 > 0)) throw new Error('hSpec: p と a₀ は正 ' + p + ' ' + a0);
    if (y === 0) return 0;
    return E2 * Math.exp((a0 / p) * (1 - Math.pow(y, -p))) * 2 / (1 + Math.pow(y, 4));
  }
  throw new Error('hSpec: 型が無い ' + spec.kind);
}
export const gSpec = (spec, y) => 1 / Math.sqrt(1 + y * y + hSpec(spec, y));
export const xSpec = (spec, y) => y * gSpec(spec, y);
const scanYs = () => { const N = DECL.nScan, a = []; for (let i = 0; i <= N; i++) a.push(Math.pow(10, -2 + i * 5 / N)); return a; };
let SCAN = null;
const scan = () => (SCAN === null ? (SCAN = scanYs()) : SCAN);
/** 単調か・最初の折り返し(最初の局所の最大の x とその y —— 走査の格子)・遠くの x(解析: h が有界なら 1・h が y² より速く増すなら 0) */
export function shapeSpec(spec) {
  let prev = 0, mono = true, fx = null, fy = null, py = 0;
  for (const y of scan()) { const x = xSpec(spec, y); if (x < prev - 1e-15 && mono) { mono = false; fx = prev; fy = py; } prev = x; py = y; }
  const bounded = spec.kind === 'X' || (spec.c > 0 && mOf(spec.far, spec.n) >= spec.n);
  return { monotone: mono, xFold: fx, yFold: fy, xLimit: bounded ? 1 : 0 };
}
/** 下の枝(最小の y)で x を与えて y を解く。届かない x は null */
export function yOfXSpec(spec, x) {
  let lo = 0, hi = null;
  for (const y of scan()) { if (xSpec(spec, y) >= x) { hi = y; break; } lo = y; }
  if (hi === null) return null;
  for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (xSpec(spec, mid) < x) lo = mid; else hi = mid; }
  return 0.5 * (lo + hi);
}
export function epsSpec(spec, x) {
  const y = yOfXSpec(spec, x); if (y === null) return null;
  const h = hSpec(spec, y); return { y, g: gSpec(spec, y), eps: Math.expm1(-0.5 * Math.log1p(h)) };
}
const muonX = () => Math.sqrt(1 - 1 / (C343.DECL.muon.gamma * C343.DECL.muon.gamma));
export function muonSpec(spec) {
  const M = C343.DECL.muon, r = epsSpec(spec, muonX()); if (r === null) return { note: 'unreached' };
  const tau = M.tau0us / r.g; return { note: 'ok', y: r.y, g: r.g, tauUs: tau, dSig: (tau - M.tauObsUs) / M.tauObsSigUs };
}
/** (c) が報告の不確かさの k 倍の内に入る n の下限(有理の型の m・c を固定して n を実数で二分 —— x = 0.338) */
export function nMin(far, c, kSig) {
  const I = DECL.ion, lim = I.epsRep - kSig * I.epsSig;   // 見込みは負(h > 0)—— 下の端だけが効く
  const ok = (n) => { const r = epsSpec({ kind: 'S', n, far, c }, I.xHigh); return r !== null && r.eps >= lim; };
  let lo = 2, hi = 80; if (ok(lo) || !ok(hi)) return null;
  for (let i = 0; i < 60; i++) { const m = 0.5 * (lo + hi); if (ok(m)) hi = m; else lo = m; }
  return 0.5 * (lo + hi);
}
const rowOf = (spec) => {
  const I = DECL.ion, ref = Math.exp(-0.5), sh = shapeSpec(spec), hi = epsSpec(spec, I.xHigh), lo = epsSpec(spec, I.xLow), mu = muonSpec(spec);
  return { ...spec, gAt1: gSpec(spec, 1), dRef: gSpec(spec, 1) - ref, ...sh, epsLow: lo ? lo.eps : null, epsHigh: hi ? hi.eps : null,
    dSigHigh: hi ? (hi.eps - I.epsRep) / I.epsSig : null, inSig1: hi ? Math.abs(hi.eps - I.epsRep) <= I.epsSig : false, muon: mu };
};
export const specS = (far, n, c = DECL.cKnob) => ({ kind: 'S', n, far, c });
export const specX = (a0, p) => ({ kind: 'X', p, a0 });
export function t3Rows() {
  const c = DECL.cKnob, rows = [];
  for (const far of DECL.farTypes) for (const n of DECL.nGrid) rows.push(rowOf(specS(far, n, c)));
  const ctrl = DECL.nGrid.map((n) => rowOf(specS('m2n', n, 0)));   // 対照: c = 0(h = (e − 2) y^n —— 遠くで増す)
  const xrows = []; for (const a0 of DECL.a0Grid) for (const p of DECL.pGrid) xrows.push(rowOf(specX(a0, p)));
  const nmin = DECL.farTypes.map((far) => ({ far, c, n1: nMin(far, c, 1), n2: nMin(far, c, 2) }));
  // y = 1 の近く(速さ 0.5〜0.9)の ε(下の枝)
  const mids = DECL.farTypes.flatMap((far) => DECL.nMid.map((n) => specS(far, n, c))).concat(DECL.xMidSpecs.map(([a0, p]) => specX(a0, p)));
  const mid = mids.map((spec) => ({ ...spec, eps: DECL.xMid.map((x) => { const r = epsSpec(spec, x); return r ? r.eps : null; }), y: DECL.xMid.map((x) => { const r = epsSpec(spec, x); return r ? r.y : null; }) }));
  // 零試験: h(1) = e − 2 で g(1) = e^(−½)/c = 0・n = 4 は〔第343便c〕の h3 と同じ
  let z1 = 0; for (const r of rows.concat(xrows, ctrl)) z1 = Math.max(z1, Math.abs(r.dRef));
  let z3 = 0; for (const y of [0.3, 1, 3]) z3 = Math.max(z3, Math.abs(gSpec(specS('m2n', 4, 0), y) - C343.g2('h3', y)));
  const all = rows.concat(xrows), joint = all.filter((r) => r.monotone && r.xLimit === 1 && r.inSig1 && r.muon.note === 'ok' && Math.abs(r.muon.dSig) <= 1).map((r) => (r.kind === 'S' ? 'S ' + r.far + ' n=' + r.n : 'X a0=' + r.a0 + ' p=' + r.p));
  return { rows, ctrl, xrows, nmin, mid, joint, zero: { gAt1: z1, h3: z3 } };
}

/* ───────── T4 光の経路(当事者時間で測った速さの読み —— 主の列)───────── */
// 質量 0・y を有限の列で上げる。絶対時間の速さ x = y g・同じ長さの飛行の時間 ÷(L ÷ c_loc)= 1/x・弱い場の一次の曲がり ÷ 今のアプリの光 = g^n ÷(2 x²)(〔第342便b〕の宣言 —— 加速 × g^n を重力の加速にも当てる)。
// 形: 'F'(今の点の時計の形)・'S20'(T3 の有理の型 —— n = 20・m = 2n・c = ½)・'X4p3'(T3 の指数の立ち上がりの型 —— a₀ = 4・p = 3)。比べる列: A の読み(絶対時間の速さが無限)の k = ½。
export const LIGHT_FORMS = Object.freeze(['F', 'S20', 'X4p3']);
const gLight = (f, y) => (f === 'F' ? C343.formG(0.5, y) : f === 'S20' ? gSpec(specS('m2n', 20), y) : f === 'X4p3' ? gSpec(specX(4, 3), y) : NaN);
/** 解析の極限(y → ∞): どの形も h → 0 で g y → 1 —— 速さ 1・飛行の時間 1・曲がり n = 0 で ½・n ≥ 1 で 0 */
export const limitLight = (f, n) => ({ speed: 1, time: 1, bend: n === 0 ? 0.5 : 0 });
export function t4Rows() {
  const rows = [];
  for (const f of LIGHT_FORMS) for (const n of DECL.nDrive) {
    const finite = DECL.yLight.map((y) => { const g = gLight(f, y), x = y * g; return { y, x, time: 1 / x, bend: C343.bendOverLight(g, x, n) }; });
    const lim = limitLight(f, n);
    rows.push({ read: 'B', form: f, n, finite, limit: lim, sameAsLight: lim.speed === 1 && lim.time === 1 && lim.bend === 1 });
  }
  for (const n of DECL.nDrive) { const lim = C343.limitA(0.5, n); rows.push({ read: 'A', form: 'F', n, finite: null, limit: lim, sameAsLight: false }); }
  // 数値の走り(第342便b の deflectionG —— 今の点の時計の形は型 F の走り・n = 1・y = 1・2)と閉じた式・光の走り(第341便e)
  const b = DECL.bNum, light = L341.deflection('light', b).alpha, num = [];
  for (const y of [1, 2]) { const x = C343.xOfY(0.5, y), d = B342.deflectionG('F', 1, b, x); num.push({ form: 'F', n: 1, y, x, ratio: d.alpha / light, closed: C343.bendOverLight(C343.formG(0.5, y), x, 1) }); }
  const numRel = Math.max(...num.map((r) => Math.abs(r.ratio / r.closed - 1)));
  // 有限の列の大きな y が極限へ寄る差(y = 16 —— S20 と F は h が丸めで 0 に近い)
  return { rows, num, numRel, bNum: b };
}

/* ───────── T1 atX1 の定義域(〔第343便c〕の lib-2)───────── */
export function t1Rows() {
  const outs = [0, 0.5, 1, 'inf', -0.25].map((k) => { let threw = false; try { C343.atX1(k); } catch (e) { threw = true; } return { k, threw }; });
  const ks = C343.kStar(), A = C343.atX1(ks), ins = [0.25, 0.4].map((k) => { const r = C343.atX1(k); return { k, y: r.y, g: r.g }; });
  return { libVersion343c: C343.LIB_VERSION, outs, kStar: ks, gAtKStar: A.g, dRefKStar: A.g - Math.exp(-0.5), yAtKStar: A.y, ins };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const T2 = t2Rows(), T1 = t1Rows();
  // ① 今の点の時計の形で ε = 0(4 つの周波数の作り直し・gOfXB の k = ½)
  // ② h = 0 で k = ½ に戻る(T3 の族で E2 の係数を 0 にした値 = g(1 + y²)^(−½))
  let h0 = 0; for (const y of [0.1, 0.5, 1, 3, 10]) h0 = Math.max(h0, Math.abs(1 / Math.sqrt(1 + y * y) - C343.formG(0.5, y)), Math.abs(C343.g2('h0', y) - C343.formG(0.5, y)));
  // ③ 2 ノブの族の ε の 2 つの数え方
  // ④ atX1 の定義域(範囲の外 5 つで例外・k* で e^(−½))
  // ⑤ 4 つの周波数の算術(比を先に取る式と積の式)
  const f = DECL.ion.freqMHz, e2 = Math.sqrt((f.nua * f.nup) / (f.nu1 * f.nu2)) - 1, arithDiff = Math.abs(e2 - T2.epsArith) / Math.abs(T2.epsArith);
  // ⑥ 拒否: x が 1 以上・形が無い・c が 1 以上・遠くの型が無い・h の型が無い
  let rej = 0; try { clockAtX('F', 1); } catch (e) { rej++; } try { clockAtX('V', 0.3); } catch (e) { rej++; } try { hSpec(specS('m2n', 4, 1), 1); } catch (e) { rej++; } try { hSpec(specS('zz', 4), 1); } catch (e) { rej++; } try { hSpec({ kind: 'Q' }, 1); } catch (e) { rej++; }
  return { freqF: T2.zero.freqF, kHalf: T2.zero.kHalf, h0, hTwoWays: T2.zero.hTwoWays, atX1Outs: T1.outs.filter((r) => r.threw).length, atX1Of: T1.outs.length, kStarRef: Math.abs(T1.dRefKStar), arithDiff, reject: { n: rej, of: 5 } };
}
export function pureGates(S) {
  return { epsZeroF: S.freqF < 1e-15 && S.kHalf < 1e-15, h0: S.h0 < 1e-15, twoWays: S.hTwoWays < 1e-12, atX1Domain: S.atX1Outs === S.atX1Of && S.kStarRef < 1e-12,
    arith: S.arithDiff < 1e-6, reject: S.reject.n === S.reject.of };
}

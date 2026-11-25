// 第353便o(原仮定者の回答(2026-11-25 —— 第151報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R479):
//   **太陽の自転軸の傾きを「作る」話と、いまの円錐の読みを分ける —— 主の式 (g2−)・主の向き (N+) での届きと、比べる列 (g2+)・(G−)・2 つの向きの項・公転面も応える組を
//   同じ口で数える包みの純関数 —— 届きの表・診断だけ**
//   (器 tests/exp-w353o-suntiltmain.mjs と QA behavior.suntiltmain353o・docs.suntiltmain353o が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便l(twoAxisStep・axisCoef)・第352便x(coefOf・mapAxis・stateAt・bgDir・reachScan・tauAge)・第352便r(bgTwo・abOf・nowDAz・uVenusRad)・
//   第352便w(fKeep・DECL.crits —— 傾きを保つ物差し q10)・第353便e(fMaxAt —— 零試験の照合)・第352便c(refAxes)・第351便d(r3Coeffs)・第347便e(t1Table・geometry)・第337便c(年の長さ)。
//   第352便r の lib の閉包に第352便b の仮の値の lib が入る —— この lib を呼ぶ段の正本は、最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 主の列(第151報の回答): 背景の向き (N+)(太陽系の基準軸の向き —— 基準軸 L)・歳差の式 (g2−) = −Ω × ŝ(「こまの式」)。比べる列: (g2+)・(G−)・2 つの向きの項(比 ρ = b ÷ a)。
// ■ 「作る」の届き: 初めにそろった輪の法線 n̂ と太陽の自転軸 ŝ が、年齢の間に開く角(いまの角 5.968°〔L〕・5.230°〔eq〕)といまの方位に届くか(第352便x の読み A・B)。
//   「保つ」の読み: 初めの角(いまの円錐の半頂角)が年齢の間に 10% より縮まないこと(第352便w の q10・寄る割合 f の上限)。
// ■ 言わないこと: 太陽の傾きの原因の答え・作れない事の答えとは書かない(この式・この列・この格子での届きの表)。
import * as SL from './lib-w352l-suntilt.mjs';
import * as X from './lib-w352x-sunorigin.mjs';
import * as T from './lib-w352r-twobg.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as FE from './lib-w353e-focus098.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w353o-suntiltmain-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = X.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = X.angDeg;
export const YR = TL.YR;
export const vec = X.vec;

/* ───────── 宣言(主の列と比べる列の名・物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 主の列が先頭(基準軸 L・(g2−))—— 比べる列は eq・(g2+) */
  axes: Object.freeze(['L', 'eq']), senses: Object.freeze(['g2m', 'g2p']), reads: X.DECL.reads,
  main: Object.freeze({ axis: 'L', sense: 'g2m', dir: 'Np', rho: 0 }),
  senseLabels: Object.freeze({ g2m: '(g2−)(主の式)', g2p: '(g2+)(比べる式)' }),
  tiltDeg: X.DECL.tiltDeg, tol: X.DECL.tol, ageYr: X.DECL.ageYr, omegaG: X.DECL.omegaG, uV: X.DECL.uV,
  /** 傾きを保つ物差し(第352便w の q10 —— 年齢の間に円錐が 10% より縮まない) */
  crit: W.DECL.crits[0],
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const chkSense = (s) => { if (!DECL.senses.includes(s)) throw new RangeError('歳差の向きは g2m・g2p'); return s; };
const chkAxis = (a) => { if (!DECL.axes.includes(a)) throw new RangeError('基準軸は L・eq'); return a; };

/* ───────── 包み 1: 第352便l の twoAxisStep を 2 つの式で ───────── */
/**
 * o: { n0, s0, om(rad/s のベクトルか関数), T(秒), steps, ring: { f, ratio }, spin: { f, ratio }, track }
 * 戻り値 { g2m: twoAxisStep の戻り値, g2p: 同じ }(係数は第352便l の axisCoef —— 経路の比率 f と応答の係数 ratio)
 */
export function twoAxisBoth({ n0, s0, om, T: Tsec, steps = 1, ring = {}, spin = {}, track = false } = {}) {
  const out = {};
  for (const sense of DECL.senses) {
    out[sense] = SL.twoAxisStep({ n0, s0, om, T: Tsec, steps, track,
      ring: SL.axisCoef(ring.f ?? 0, { sense, ratio: ring.ratio ?? 1 }), spin: SL.axisCoef(spin.f ?? 0, { sense, ratio: spin.ratio ?? 1 }) });
  }
  return out;
}

/* ───────── 包み 2: 第352便x の状態と走査を 2 つの式で ───────── */
/** 背景の向き(比 ρ = b ÷ a —— 0 は純粋な (N+)・∞ は純粋な (G−))と、いまの角・いまの方位 */
export function frameOf(GEO, axisVec, axn, rho) {
  chkAxis(axn);
  const d = X.bgDir(axisVec, rho);
  return { w: d.w, om1: d.om1, thDeg: d.thDeg, gT: DECL.tiltDeg[axn], azT: T.nowDAz(GEO, axisVec) };
}
/** 状態(読み A・B)を 2 つの式で: { g2m: stateAt, g2p: stateAt } */
export function stateBoth({ GEO, axisVec, axn, rho, tau, ring = {}, spin = {}, read = 'B' }) {
  const fr = frameOf(GEO, axisVec, axn, rho), out = {};
  for (const sense of DECL.senses) out[sense] = X.stateAt({ GEO, axis: axisVec, w: fr.w, tau, read,
    ring: X.coefOf({ f: ring.f ?? 0, sense, ratio: ring.ratio ?? 1 }), spin: X.coefOf({ f: spin.f ?? 0, sense, ratio: spin.ratio ?? 1 }) });
  return out;
}
/** 届く組の走査(1 組 —— 式 1 つ): 第352便x の reachScan(輪 c_n 1・太陽 1 + q) */
export function reachOne({ GEO, axisVec, axn, rho, sense, f, q, read, tauMax = null, nTau = 200, dec = 8 }) {
  chkSense(sense);
  const fr = frameOf(GEO, axisVec, axn, rho), tm = tauMax ?? Math.max(200, 50 / Math.abs(q));
  const r = X.reachScan({ GEO, axis: axisVec, w: fr.w, read, gT: fr.gT, azT: fr.azT, tauMax: tm, nTau, dec,
    ring: X.coefOf({ f, sense, ratio: 1 }), spin: X.coefOf({ f, sense, ratio: 1 + q }) });
  return { ...r, gReach: fin(r.nearGDeg) && r.nearGDeg <= DECL.tol.gammaDeg, azReach: fin(r.nearAzDeg) && r.nearAzDeg <= DECL.tol.azDeg, thDeg: fr.thDeg, om1: fr.om1 };
}
/** 同じ組を 2 つの式で */
export function reachBoth(o) { const out = {}; for (const sense of DECL.senses) out[sense] = reachOne({ ...o, sense }); return out; }
/**
 * 読み B の f の窓(第352便x の器の fWindow と同じ格子・同じ走査 —— 器を import せずに lib の口だけで): f ∈ [lo, hi]・刻み step
 * 戻り値 { fLo, fHi, n, mid(窓の中ほどの { f, tau, turnDeg, dAzDeg })| null }
 */
export function fWindowB({ GEO, axisVec, axn, rho, sense, q, lo = 0.5, hi = 1, step = 0.005, nTau = 200, dec = 8 }) {
  const hits = [], nF = Math.round((hi - lo) / step);
  for (let i = 0; i <= nF; i++) {
    const ff = Math.round((lo + i * step) * 1e6) / 1e6;
    const r = reachOne({ GEO, axisVec, axn, rho, sense, f: ff, q, read: 'B', nTau, dec });
    if (r.tau !== null) hits.push({ f: ff, tau: r.tau, turnDeg: r.turnDeg, dAzDeg: r.hit.dAzDeg });
  }
  if (!hits.length) return { fLo: null, fHi: null, n: 0, mid: null };
  return { fLo: hits[0].f, fHi: hits[hits.length - 1].f, n: hits.length, mid: hits[Math.floor(hits.length / 2)] };
}

/**
 * 角と方位を別々に数える走査(1 組 —— 第352便x の reachScan と同じ τ の格子・同じ幅): 角だけ・方位だけ(2 つの軸の角が 0.5° 以上の標本で)・同時。
 * 戻り値 { gReach, azReach, both, tauHit | null, turnDeg | null, nearAzDeg(角が幅の内の標本での方位の差の最小)| null, nearAzAnyDeg(方位だけの差の最小)| null, nIll }
 */
export function scanCell({ GEO, axisVec, axn, rho, sense, f, q, read, nTau = 200, dec = 8 }) {
  chkSense(sense);
  const fr = frameOf(GEO, axisVec, axn, rho), tm = Math.max(200, 50 / Math.abs(q)), tol = DECL.tol;
  const ring = X.coefOf({ f, sense, ratio: 1 }), spin = X.coefOf({ f, sense, ratio: 1 + q });
  let gR = false, aR = false, hit = null, near = null, nearAny = null, nIll = 0;
  for (let k = 0; k <= nTau; k++) {
    const tau = tm * Math.pow(10, -dec + dec * k / nTau), st = X.stateAt({ GEO, axis: axisVec, w: fr.w, tau, ring, spin, read });
    if (st.illCond) { nIll++; continue; }
    if (st.dAzDeg === null || st.gammaDeg < tol.gammaDeg) continue;
    const eg = Math.abs(st.gammaDeg - fr.gT), ea = Math.abs(RC.dAz(st.dAzDeg, fr.azT));
    nearAny = nearAny === null ? ea : Math.min(nearAny, ea);
    if (ea <= tol.azDeg) aR = true;
    if (eg <= tol.gammaDeg) { gR = true; near = near === null ? ea : Math.min(near, ea); if (ea <= tol.azDeg && hit === null) hit = { tau, turnDeg: st.turnDeg }; }
  }
  return { gReach: gR, azReach: aR, both: hit !== null, tauHit: hit ? hit.tau : null, turnDeg: hit ? hit.turnDeg : null, nearAzDeg: near, nearAzAnyDeg: nearAny, nIll };
}

/* ───────── 包み 3: 第352便r の口(輪が動かない組・経路 ② だけの帯)───────── */
/** 輪が動かない組(c_n 0)・経路 ② だけ: ŝ は Ω̂ のまわりの円 —— 届く角の上限 2θ と、方位の側(円の上の点は Ω̂ の方位の側 ±90° の内) */
export function ringFixedBand(GEO, axisVec, axn, rho) {
  const fr = frameOf(GEO, axisVec, axn, rho), gMax = 2 * fr.thDeg;
  const wAz = fr.thDeg > 1e-9 ? T.dAzAround(GEO, unit(axisVec), fr.w) : null;
  return { thDeg: fr.thDeg, gMaxDeg: gMax, gReach: gMax >= fr.gT, wAzDeg: wAz, azT: fr.azT, azReach: wAz !== null && Math.abs(RC.dAz(wAz, fr.azT)) < 90 };
}

/* ───────── 主の列(T2): (N+)・(g2−) での「作る」と「保つ」───────── */
/**
 * 純粋な (N+)(ρ 0)の背景 u ω_G N̂ の下で、輪の法線 n̂₀ = N̂・太陽の自転軸 ŝ₀(N̂ から tilt0 傾けた向き)を年齢の間進める(第352便l の twoAxisStep —— 2 つの式)。
 * 戻り値 { g2m, g2p }: { movedDeg(ŝ が動いた角), gammaEndDeg(終わりの 2 つの軸の角), coneEndDeg(終わりの ŝ と N̂ の角), ringOffDeg(終わりの n̂ と N̂ の角) }
 */
export function mainMake({ axisVec, u, f = 0, q = 0, tilt0Deg = 0, ageYr = DECL.ageYr, steps = 1 }) {
  if (!(isVec(axisVec) && fin(u) && u >= 0 && fin(tilt0Deg) && tilt0Deg >= 0 && tilt0Deg < 90)) throw new RangeError('mainMake: 軸・u ≥ 0・0 ≤ tilt0 < 90');
  const N = unit(axisVec), perp = unit(crs(N, Math.abs(N[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
  const s0 = X.rotAbout(N, perp, tilt0Deg * D2R), om = scl(N, u * DECL.omegaG);
  const R = twoAxisBoth({ n0: N, s0, om, T: ageYr * YR, steps, ring: { f, ratio: 1 }, spin: { f, ratio: 1 + q } }), out = {};
  for (const sense of DECL.senses) { const r = R[sense]; out[sense] = { movedDeg: angDeg(r.s, s0), gammaEndDeg: r.gammaDeg, coneEndDeg: angDeg(r.s, N), ringOffDeg: angDeg(r.n, N) }; }
  return out;
}
/** 円錐の閉じた形(一定の Ω のまわり・係数 c): tan(θ/2) = tan(θ₀/2) e^(−k₁ c τ)(τ = abs(Ω) t) */
export function coneAfter({ th0Deg, f, tau, ratio = 1 }) {
  const k1 = R3.r3Coeffs(f, 'N1').kTilt;
  return 2 * Math.atan(Math.tan(th0Deg * D2R / 2) * Math.exp(-k1 * ratio * tau)) / D2R;
}
/** 傾きを保つ f の上限(第352便w の fKeep —— q10・円錐 θ・背景の大きさ u ω_G) */
export function fKeepAt({ thDeg, u }) { return W.fKeep({ thDeg, W: u * DECL.omegaG, crit: DECL.crit }); }
/** f を置いたとき、傾きを保つ背景の大きさの上限 u(閉じた形: k₁(f) u ω_G 年齢 ≤ x) */
export function uKeepAt({ thDeg, f }) {
  const x = W.fKeep({ thDeg, W: DECL.omegaG, crit: DECL.crit }).x, k1 = R3.r3Coeffs(f, 'N1').kTilt;
  return k1 === 0 ? Infinity : x / (k1 * DECL.omegaG * DECL.ageYr * YR);
}

/* ───────── 分ける表(T4): 届いた後に、いまの角の帯に居る長さ ───────── */
/**
 * 届いた組(τ_hit)の前後で、2 つの軸の角がいまの角の ±frac の内に居る続きの τ の長さ Δτ と、Δτ ÷ τ_hit。
 * τ の刻みは一様(dτ = min(τ_hit × 2e-3, 0.01 ÷ (1 + abs(q))) —— 経路 ② の角の揺れの 1 周を 600 刻み以上で追う)・片側 nMax 刻みで帯を出なければ open(Δτ は下限)。
 * 年齢 = τ_hit に置いたとき(届くのがちょうどいま)、Δτ ÷ τ_hit は「いまの角の帯に居る時間 ÷ 年齢」。
 */
export function dwellOf({ GEO, axisVec, axn, rho, sense, f, q, read, tauHit, frac = 0.1, nMax = 4000 }) {
  if (!(fin(tauHit) && tauHit > 0)) throw new RangeError('dwellOf: τ_hit > 0');
  const fr = frameOf(GEO, axisVec, axn, rho), ring = X.coefOf({ f, sense, ratio: 1 }), spin = X.coefOf({ f, sense, ratio: 1 + q });
  const inB = (tau) => { if (!(tau > 0)) return false; const st = X.stateAt({ GEO, axis: axisVec, w: fr.w, tau, ring, spin, read }); return !st.illCond && Math.abs(st.gammaDeg - fr.gT) <= frac * fr.gT; };
  if (!inB(tauHit)) return { dTau: 0, ratio: 0, lo: tauHit, hi: tauHit, open: false };
  const dt = Math.min(tauHit * 2e-3, 0.01 / (1 + Math.abs(q)));
  let lo = tauHit, hi = tauHit, open = false, k = 0;
  for (k = 0; k < nMax; k++) { const t = lo - dt; if (!inB(t)) break; lo = t; }
  if (k === nMax) open = true;
  for (k = 0; k < nMax; k++) { const t = hi + dt; if (!inB(t)) break; hi = t; }
  if (k === nMax) open = true;
  return { dTau: hi - lo, ratio: (hi - lo) / tauHit, lo, hi, open };
}

/* ───────── 零試験 ───────── */
export const ANCHOR = Object.freeze({
  axisL: Object.freeze([0.026257, 0.008317, 0.999621]), omegaG: '9.09e-16', sunL: '5.968',
  /** 第352便x の読み B の f の窓((g2+)): L・ρ ∞・q −1 = 0.665〜0.765・eq・ρ 0.075・q −1 = 0.825〜0.91 —— 全体の「届く比率 0.67〜0.91」 */
  winLinf: Object.freeze([0.665, 0.765]), winEq075: Object.freeze([0.825, 0.91]), winAll: Object.freeze(['0.67', '0.91']),
  /** 第353便e: u 0.98・(N+) で太陽の傾きを保つ f の上限 */
  fKeepSun098: '8.34e-4',
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq };
  // ① 統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐(L)
  const axL = ax.L.map((x) => Number(x.toFixed(6))), omegaG = DECL.omegaG.toExponential(2), sunL = angDeg(unit(GEO['Earth|Sun'].s), ax.L).toFixed(3);
  // ② 包み 1(twoAxisBoth)= 第352便x の stateAt(読み A —— 同じ係数・同じ τ・2 つの式)
  const fr = frameOf(GEO, ax.L, 'L', 0.075), Om = scl(fr.w, 3.1 * DECL.omegaG), tau = 37;
  const TB = twoAxisBoth({ n0: ax.L, s0: ax.L, om: Om, T: tau / nrm(Om), ring: { f: 0.3, ratio: 1 }, spin: { f: 0.3, ratio: 0.9 } });
  const SB = stateBoth({ GEO, axisVec: ax.L, axn: 'L', rho: 0.075, tau, ring: { f: 0.3, ratio: 1 }, spin: { f: 0.3, ratio: 0.9 }, read: 'A' });
  const vsX = Math.max(...DECL.senses.map((s) => Math.abs(TB[s].gammaDeg - SB[s].gammaDeg)));
  // ③ 経路 ② だけ(f 0)・読み A では、2 つの式の角は同じ(方位だけが替わる)
  const S0 = stateBoth({ GEO, axisVec: ax.L, axn: 'L', rho: 0.075, tau: 40, ring: { ratio: 1 }, spin: { ratio: 0.97 }, read: 'A' });
  const symG = Math.abs(S0.g2m.gammaDeg - S0.g2p.gammaDeg), azDiff = Math.abs(S0.g2m.dAzDeg - S0.g2p.dAzDeg);
  // ④ 主の列: 純粋な (N+)・初めにそろった 2 つの軸は、どの f・係数の差・大きさでも動かない(作る届き 0)
  let moved = 0;
  for (const u of [DECL.uV, 0.0487, 0.98, 1, 100]) for (const f of [0, 0.5, 1]) for (const q of [-0.5, 1]) {
    const M = mainMake({ axisVec: ax.L, u, f, q, tilt0Deg: 0 }); for (const s of DECL.senses) moved = Math.max(moved, M[s].movedDeg, M[s].gammaEndDeg);
  }
  // ⑤ 主の列: f 0 なら初めの角(5.968°)は年齢の間そのまま —— 円錐の閉じた形と twoAxisStep が同じ
  const K = mainMake({ axisVec: ax.L, u: 1, f: 0, q: 0, tilt0Deg: 5.968 }), keep0 = Math.max(...DECL.senses.map((s) => Math.abs(K[s].coneEndDeg - 5.968)));
  const K5 = mainMake({ axisVec: ax.L, u: 1, f: 1e-3, q: 0, tilt0Deg: 5.968 }), cf = coneAfter({ th0Deg: 5.968, f: 1e-3, tau: DECL.omegaG * DECL.ageYr * YR });
  const vsCone = Math.max(...DECL.senses.map((s) => Math.abs(K5[s].coneEndDeg - cf)));
  // ⑥ 第352便x の読み B の f の窓((g2+) だけが窓を持つ)
  const wLinf = fWindowB({ GEO, axisVec: ax.L, axn: 'L', rho: Infinity, sense: 'g2p', q: -1 });
  const wLinfM = fWindowB({ GEO, axisVec: ax.L, axn: 'L', rho: Infinity, sense: 'g2m', q: -1 });
  const wEq = fWindowB({ GEO, axisVec: ax.eq, axn: 'eq', rho: 0.075, sense: 'g2p', q: -1 });
  const winAll = [Math.min(wLinf.fLo, wEq.fLo).toFixed(2), Math.max(wLinf.fHi, wEq.fHi).toFixed(2)];
  // ⑦ 第352便r の帯の両端(輪が動かない組 —— L 0.0605 は角に届かない・0.087 は届く)と方位の側((G−) の側 —— いまの方位に届かない)
  const bLo = ringFixedBand(GEO, ax.L, 'L', 0.0605), bHi = ringFixedBand(GEO, ax.L, 'L', 0.087);
  // ⑧ 傾きを保つ f の上限(u 0.98・太陽)= 第353便e の fMaxAt
  const fk = fKeepAt({ thDeg: 5.968, u: 0.98 }).fMax, fe = FE.fMaxAt('Sun|-', { T1, GEO }).fMax, uk = uKeepAt({ thDeg: 5.968, f: fk });
  // ⑨ 角と方位を別々に数える走査の「同時」= 第352便x の reachScan の届き(同じ格子 —— 標本 8 組)
  let scanSame = 0, nScan = 0;
  for (const [axn, rho, sense, f, q, read] of [['L', Infinity, 'g2p', 0.7, -1, 'B'], ['L', Infinity, 'g2m', 0.7, -1, 'B'], ['eq', 0.075, 'g2p', 0.85, -1, 'B'], ['L', 0.075, 'g2m', 0.3, -0.5, 'A'],
    ['L', 0.075, 'g2p', 0, 1, 'A'], ['eq', 1, 'g2m', 0.5, -0.1, 'A'], ['L', 0, 'g2m', 0.5, -1, 'B'], ['eq', Infinity, 'g2p', 0.2, 0.1, 'B']]) {
    const a = scanCell({ GEO, axisVec: ax[axn], axn, rho, sense, f, q, read }), b = reachOne({ GEO, axisVec: ax[axn], axn, rho, sense, f, q, read });
    nScan++; if (a.both === (b.tau !== null) && (a.tauHit === null ? b.tau === null : Math.abs(a.tauHit / b.tau - 1) < 1e-6)) scanSame++;   // τ の格子の点は pow で作る —— 尺度の走り直しで ulp の桁で揺れる
  }
  // ⑩ 拒否
  const rej = [() => reachOne({ GEO, axisVec: ax.L, axn: 'L', rho: 0, sense: 'x', f: 0, q: 1, read: 'A' }), () => frameOf(GEO, ax.L, 'ecl', 0),
    () => mainMake({ axisVec: ax.L, u: -1 }), () => dwellOf({ GEO, axisVec: ax.L, axn: 'L', rho: 1, sense: 'g2m', f: 0, q: 1, read: 'A', tauHit: 0 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { axL, omegaG, sunL, vsX, symG, azDiff, moved, keep0, vsCone, wLinf: [wLinf.fLo, wLinf.fHi], wLinfM: wLinfM.n, wEq: [wEq.fLo, wEq.fHi], winAll,
    band: { lo: bLo.gReach, hi: bHi.gReach, azLo: bLo.azReach, azHi: bHi.azReach }, fk, fe, ukRel: Math.abs(uk / 0.98 - 1), scanSame, nScan, rejects: rej };
}
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
export function pureGates(S) {
  return {
    anchor3: S.axL.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) < 5e-7) && S.omegaG === ANCHOR.omegaG && S.sunL === ANCHOR.sunL,
    wrapVsStateAt: S.vsX < 1e-9,
    path2SameAngle: S.symG < 1e-9 && S.azDiff > 1,
    mainNoMake: S.moved < 1e-9,
    mainKeepCone: S.keep0 < 1e-9 && S.vsCone < 1e-9,
    xWindow: S.wLinf[0] === ANCHOR.winLinf[0] && S.wLinf[1] === ANCHOR.winLinf[1] && S.wEq[0] === ANCHOR.winEq075[0] && S.wEq[1] === ANCHOR.winEq075[1] && S.wLinfM === 0
      && S.winAll[0] === ANCHOR.winAll[0] && S.winAll[1] === ANCHOR.winAll[1],
    rBand: S.band.lo === false && S.band.hi === true && S.band.azLo === false && S.band.azHi === false,
    keepVsE: rel(S.fk, S.fe) < 1e-6 && S.fk.toExponential(2) === ANCHOR.fKeepSun098 && S.ukRel < 1e-9,
    scanVsReach: S.nScan === 8 && S.scanSame === 8,
    rejects: S.rejects.every(Boolean),
  };
}

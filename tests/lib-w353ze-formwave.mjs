// 第353便ze(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R494):
//   **形成の段階の題の続き —— 始めの背景が「上下の揺れ」の位相で回る形(首を振る・脈を打つ)と、替わる幅のノブ 1 つで、作る段と保つ段をつなぐ条件を数える純関数 —— ノブの走査の表・診断だけ**
//   (器 tests/exp-w353ze-formwave.mjs と QA behavior.formwave353ze・docs.formwave353ze が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便w(bgOf・runForm・retainOf・retainClosed・xForRetain・windowOf・gridOf・nTFor・startOf)・第352便x(mapAxis・coefOf)・第352便r(bgTwo・abOf・nowDAz)・
//   第352便c(refAxes・galDirs・azimuthDeg・dAz)・第352便b(仮の値 —— 上下の揺れの周期の比べる欄だけ)・第347便e(t1Table・geometry)。
//   第353便w の lib の閉包と本 lib の import に第352便b の仮の値の lib が入る —— この lib を呼ぶ段の正本は、最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 背景の時間の形(ノブ —— 由来は書かない): Ω(t) = a(t) Ω̂_N + b(t) W(t) Ĝ。a・b は第353便w の bgOf と同じ(a = (1 − s) a₁ + s u₁・b = (1 − s) b₁)。
//   W(t) は「上下の揺れ」の位相 φ(t) = 2π t ÷ P + φ₀(P = 揺れの周期 —— 年齢を 1 とした時間)で (G−) の項を変える:
//     'nod'(首を振る): Ĝ を基準軸 N̂ のまわりに ψ(t) = A sin φ(t) だけ回す(A は度)/'pulse'(脈を打つ): (G−) の項の大きさに 1 + A sin φ(t) を掛ける(0 ≤ A ≤ 1)。
//   A 0 では第353便w の bgOf と同じ数(零試験)。
// ■ 言わないこと: 太陽の傾きの由来の答え・形成の段階の再現とは書かない(この形・この格子・この幅での、ノブの走査の表)。背景が替わる理由・揺れの由来は予想の文として引くだけ。
import * as W from './lib-w353w-formstage.mjs';
import * as X from './lib-w352x-sunorigin.mjs';
import * as T from './lib-w352r-twobg.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353ze-formwave-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = W.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = W.angDeg;
export const YR = W.YR;
const D2R = Math.PI / 180;

/* ───────── 宣言(ノブの名と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  forms: Object.freeze(['nod', 'pulse']), shapes: W.DECL.shapes, reads: W.DECL.reads, senses: W.DECL.senses, axes: W.DECL.axes,
  main: W.DECL.main, tiltDeg: W.DECL.tiltDeg, tol: W.DECL.tol, ageYr: W.DECL.ageYr, omegaG: W.DECL.omegaG, keepFrac: W.DECL.keepFrac,
  /** 揺れの在る区間の 1 刻みの歳差の角の上限(rad)と、揺れの 1 周あたりの刻みの下限 */
  dPhiWave: 0.04, perPeriod: 24,
  /** いまの方位の帯(位相の表 —— ±10°)—— 物差し・採否の判定ではない */
  azBandDeg: 10,
  /** 上下の揺れの共鳴の帯(背景の大きさ ÷ ω_G —— 〔第352便y〕の固定の点 u = 2π ÷ (P ω_G) の帯を引くだけ) */
  band: Object.freeze([2.4, 3.7]),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const chk = (c, m) => { if (!c) throw new RangeError(m); };
const AGE_S = () => DECL.ageYr * YR;

/* ───────── 背景の揺れの形 ───────── */
/** 基準軸 N̂ のまわりに v を角 a(rad)回す(右ねじ) */
function rotN(v, N, a) { return X.rotAbout(v, N, a); }
const GM = new WeakMap(), NPV = new WeakMap();
function basisOf(axisVec) { let B = GM.get(axisVec); if (!B) { B = { np: T.bgTwo({ a: 1, b: 0, axis: axisVec }), gm: T.bgTwo({ a: 0, b: 1, axis: axisVec }), N: unit(axisVec) }; GM.set(axisVec, B); } return B; }
/** 揺れの係数(nod: 回す角 ψ rad・pulse: 大きさの倍 m) */
export function waveOf(t, { zAmp = 0, zPeriod = 0.02, zPhase = 0, form = 'nod' } = {}) {
  if (!(zAmp > 0)) return { psi: 0, m: 1 };
  const ph = 2 * Math.PI * t / zPeriod + zPhase, sn = Math.sin(ph);
  return form === 'nod' ? { psi: zAmp * D2R * sn, m: 1 } : { psi: 0, m: 1 + zAmp * sn };
}
function chkWave({ zAmp = 0, zPeriod = 0.02, zPhase = 0, form = 'nod' }) {
  chk(DECL.forms.includes(form), 'bgWave: 揺れの形は nod・pulse');
  chk(fin(zAmp) && zAmp >= 0 && (form === 'nod' ? zAmp <= 180 : zAmp <= 1), 'bgWave: 揺れの大きさ A(nod は 0〜180°・pulse は 0〜1)');
  chk(fin(zPeriod) && zPeriod > 0 && fin(zPhase), 'bgWave: 揺れの周期 P > 0・位相 φ₀');
}
/**
 * 背景の時間の形(T1 の約束の口): bgWave(t, { axisVec, rho0, u0, u1, tSwitch, width, shape, zAmp, zPeriod, zPhase, form }) → { Om(rad/s), s, rho, u, psi, m }
 * A 0 では第353便w の bgOf をそのまま返す(同じ数)。
 */
export function bgWave(t, o) {
  chkWave(o);
  const B0 = W.bgOf(t, o);
  if (!(o.zAmp > 0)) return { ...B0, psi: 0, m: 1 };
  const s = B0.s, ab1 = T.abOf(o.rho0, o.u0), a = (1 - s) * ab1.a + s * o.u1, b = (1 - s) * ab1.b, Bs = basisOf(o.axisVec), wv = waveOf(t, o);
  const g = wv.psi === 0 ? Bs.gm : rotN(Bs.gm, Bs.N, wv.psi), bb = b * wv.m;
  const Om = add(scl(Bs.np, a), scl(g, bb));
  return { Om, s, rho: a > 0 ? bb / a : (bb > 0 ? Infinity : 0), u: nrm(Om) / nrm(Bs.np), psi: wv.psi, m: wv.m };
}
/** 共鳴の背景の大きさ u_res = 2π ÷ (P ω_G 年齢)(P は年齢の倍)と、その逆(u から P) —— 〔第352便y〕の固定の点の式 */
export function uRes(P) { chk(fin(P) && P > 0, 'uRes: P > 0'); return 2 * Math.PI / (P * DECL.omegaG * AGE_S()); }
export function pRes(u) { chk(fin(u) && u > 0, 'pRes: u > 0'); return 2 * Math.PI / (u * DECL.omegaG * AGE_S()); }
/** 仮の値の比べる欄: 上下の揺れの周期(仮・未照合 —— 鍵 gal.vertical.period)を年齢の倍に */
export function provPeriod(which = 'mid') { return PV.provValue('gal.vertical.period', which) / DECL.ageYr; }

/* ───────── 1 本の時間の列を進める ───────── */
function coefsOf(f, sense, q) {
  const one = (ff) => ({ ring: X.coefOf({ f: ff, sense, ratio: 1 }), spin: X.coefOf({ f: ff, sense, ratio: 1 + q }) });
  return typeof f === 'number' ? { c1: one(f), c2: one(f) } : { c1: one(f.f1), c2: one(f.f2) };
}
/**
 * 1 つの軸を t₀ → t₁(負の向きも)進める。第353便w の adv1 と同じ刻みの規則(一定の区間は閉じた形 1 回・窓の中は歳差の角 dPhiMax で刻む)に、
 * 揺れの在る区間(A > 0 かつ 替わる前か窓の中)は「歳差の角 dPhiWave・揺れの 1 周 perPeriod」で刻む規則を足す。A 0 では w の adv1 と同じ算術。
 */
function advW(Xv, t0, t1, op, which) {
  if (t1 === t0) return Xv;
  const { ta, tb } = op.win, sg = t1 > t0 ? 1 : -1, cuts = [t0], wave = op.bg.zAmp > 0;
  for (const c of [ta, tb]) if (fin(c) && (c - t0) * sg > 0 && (t1 - c) * sg > 0) cuts.push(c);
  cuts.sort((a, b) => sg * (a - b)); cuts.push(t1);
  let x = Xv;
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i], b = cuts[i + 1], mid = 0.5 * (a + b), inWin = mid > ta && mid < tb, waveSeg = wave && !(mid >= tb) && !(op.bg.tSwitch === Infinity ? false : (op.bg.shape === 'step' || !(op.bg.width > 0)) && mid >= op.bg.tSwitch);
    let n = 1;
    if (inWin) { const B = bgWave(mid, op.bg), rate = nrm(B.Om) * (1 + Math.abs(op.q)) * AGE_S(); n = Math.max(1, Math.min(200000, Math.ceil(rate * Math.abs(b - a) / W.DECL.dPhiMax))); }
    if (waveSeg || op.force) {
      const B = bgWave(mid, op.bg), rate = nrm(B.Om) * (1 + Math.abs(op.q)) * AGE_S() * (1 + (op.bg.form === 'pulse' ? op.bg.zAmp : 0));
      const nW = Math.ceil(Math.max(rate * Math.abs(b - a) / (op.dPhi ?? DECL.dPhiWave), wave ? DECL.perPeriod * Math.abs(b - a) / op.bg.zPeriod : 1));
      n = Math.max(n, Math.min(400000, nW));
    }
    const h = (b - a) / n;
    for (let k = 0; k < n; k++) {
      const tm = a + (k + 0.5) * h, B = bgWave(tm, op.bg), om = nrm(B.Om);
      if (!(om > 0)) continue;
      const c = (B.s >= 0.5 ? op.coefs.c2 : op.coefs.c1)[which];
      x = X.mapAxis(x, scl(B.Om, 1 / om), om * h * AGE_S(), c);
    }
  }
  return x;
}
function optsOf(o) {
  const { axisVec, rho0, u0, u1, tSwitch, width = 0, shape = 'step', sense, f = 0, q, read = 'B', zAmp = 0, zPeriod = 0.02, zPhase = 0, form = 'nod' } = o;
  chk(DECL.senses.includes(sense), 'runWave: 歳差の向きは g2m・g2p');
  chk(DECL.reads.includes(read), 'runWave: 読みは A・B');
  chk(fin(q) && q >= -1, 'runWave: q ≥ −1');
  chk(typeof f === 'number' ? (fin(f) && f >= 0 && f <= 1) : (shape === 'step' && fin(f.f1) && fin(f.f2) && f.f1 >= 0 && f.f1 <= 1 && f.f2 >= 0 && f.f2 <= 1), 'runWave: 0 ≤ f ≤ 1(時間で替わる f は形 step だけ)');
  const bg = { axisVec, rho0, u0, u1, tSwitch, width, shape, zAmp, zPeriod, zPhase, form };
  bgWave(0, bg);
  return { bg, win: W.windowOf({ tSwitch, width, shape }), sense, f, q, read, coefs: coefsOf(f, sense, q), force: !!o.forceStep, dPhi: o.dPhiWave };
}
/** 始まりの向き(読み A: いまの基準軸・読み B: t = 1 に輪の法線がいまの基準軸に来るよう輪だけを後ろへ解く)—— w の startOf と同じ置き方 */
export function startOfW(o) {
  const op = optsOf(o), N = unit(o.axisVec);
  if (op.read === 'A') return { X0: N, illCond: false };
  const X0 = advW(N, 1, 0, op, 'ring'), w1 = unit(bgWave(0, op.bg).Om);
  return { X0, illCond: angDeg(X0, w1) > 180 - 1e-4 };
}
const GAL = new WeakMap();
function dAzOf(GEO, n, s) { let g = GAL.get(GEO); if (!g) { g = RC.galDirs(GEO); GAL.set(GEO, g); } const a = RC.azimuthDeg(n, s).az; return a === null ? null : RC.dAz(a, RC.azimuthDeg(n, g.Gp).az); }
/** 時間の列(T1 の約束の口): w の trajOf と同じ戻り値の形 { ts, rows: [{ t, s, n, sv, gammaDeg, dAzDeg, coneDeg, ringOffDeg }], X0, illCond } */
export function trajOfW(o) {
  const op = optsOf(o), N = unit(o.axisVec), st = startOfW(o), ts = o.ts;
  chk(Array.isArray(ts) && ts.length >= 1 && ts.every((t, i) => fin(t) && t > 0 && t <= 1 && (i === 0 || t > ts[i - 1])), 'trajOfW: ts は 0 < t ≤ 1 の昇順');
  let n = st.X0, s = st.X0, tp = 0; const rows = [];
  for (const t of ts) {
    n = advW(n, tp, t, op, 'ring'); s = advW(s, tp, t, op, 'spin'); tp = t;
    const g = angDeg(n, s);
    rows.push({ t, s: W.sOf(t, op.bg), n, sv: s, gammaDeg: g, dAzDeg: g > 1e-9 ? dAzOf(o.GEO, n, s) : null, coneDeg: angDeg(s, N), ringOffDeg: angDeg(n, N) });
  }
  return { ts, rows, X0: st.X0, illCond: st.illCond };
}
/**
 * 作る段 → 保つ段(T1 の約束の口): runWave({ GEO, axisVec, axn, rho0, u0, u1, tSwitch, width, shape, sense, f, q, read, zAmp, zPeriod, zPhase, form, nT? })
 * 戻り値は w の runForm と同じ鍵 + azEndDev(t = 1 の方位 − いまの方位 —— 符号つき・°)・gammaSwDeg(替わる時刻の直前の 2 つの軸の角 —— 形 step だけ)。A 0 では runForm と同じ数(零試験)。
 */
export function runWave(o) {
  chk(o && o.GEO && DECL.axes.includes(o.axn), 'runWave: GEO・基準軸 L・eq');
  const gT = DECL.tiltDeg[o.axn], azT = T.nowDAz(o.GEO, o.axisVec), tol = DECL.tol, kf = DECL.keepFrac * gT, shape = o.shape ?? 'step', width = o.width ?? 0;
  const nT = o.nT ?? W.nTFor(o), ts = W.gridOf({ nT, tSwitch: o.tSwitch, width, shape });
  const st = startOfW(o);
  if (st.illCond) return { illCond: true, nIll: 1, gReach: false, azReach: false, both: false, make: false, keep: false, keepDev: null, keepSw: false, nowBoth: false, turnsAfter: null, tHit: null, hitStage: null, coneEndDeg: null, gammaEndDeg: null, ringOffEndDeg: null, azEndReach: false, dwell: 0, nearAzDeg: null, nT, azEndDev: null, gammaSwDeg: null };
  const R = trajOfW({ ...o, ts }), w = W.windowOf({ tSwitch: o.tSwitch, width, shape });
  let gR = false, aR = false, hit = null, near = null, inU = 0, gSw = null;
  const uni = new Set(); for (let k = 1; k <= nT; k++) uni.add(k / nT);
  for (const r of R.rows) {
    if (uni.has(r.t) && Math.abs(r.gammaDeg - gT) <= kf) inU++;
    if (r.t <= o.tSwitch) gSw = r.gammaDeg;
    if (r.dAzDeg === null || r.gammaDeg < tol.gammaDeg) continue;
    const eg = Math.abs(r.gammaDeg - gT), ea = Math.abs(RC.dAz(r.dAzDeg, azT));
    if (ea <= tol.azDeg) aR = true;
    if (eg <= tol.gammaDeg) { gR = true; near = near === null ? ea : Math.min(near, ea); if (ea <= tol.azDeg && hit === null) hit = r.t; }
  }
  let keep = false, keepDev = null;
  if (hit !== null) { const t0 = Math.max(hit, fin(w.tb) ? w.tb : 1), after = R.rows.filter((r) => r.t >= t0); keepDev = Math.max(...after.map((r) => Math.abs(r.gammaDeg - gT) / gT)); keep = keepDev <= DECL.keepFrac; }
  const tAfter = fin(w.tb) ? w.tb : 1, afterSw = R.rows.filter((r) => r.t >= tAfter), keepSw = afterSw.every((r) => Math.abs(r.gammaDeg - gT) <= kf);
  const end = R.rows[R.rows.length - 1];
  const azDev = end.dAzDeg === null ? null : RC.dAz(end.dAzDeg, azT), azEnd = azDev === null ? null : Math.abs(azDev), azEndR = azEnd !== null && azEnd <= tol.azDeg && Math.abs(end.gammaDeg - gT) <= tol.gammaDeg;
  return { illCond: false, nIll: 0, gReach: gR, azReach: aR, both: hit !== null, tHit: hit, hitStage: hit === null ? null : (hit < w.ta ? 'form' : 'after'), keep, keepDev, make: hit !== null && keep,
    keepSw, nowBoth: azEndR && keepSw, coneEndDeg: end.coneDeg, gammaEndDeg: end.gammaDeg, ringOffEndDeg: end.ringOffDeg, azEndReach: azEndR,
    dwell: inU / nT, nearAzDeg: near, nT, turnsAfter: o.tSwitch === Infinity ? 0 : nrm(bgWave(1, optsOf(o).bg).Om) * (1 + o.q) * coefsOf(typeof o.f === 'number' ? o.f : o.f.f2, o.sense, o.q).c2.ring.kPrec * AGE_S() * Math.max(0, 1 - tAfter) / (2 * Math.PI),
    azEndDev: azDev, gammaSwDeg: (shape === 'step' || !(width > 0)) ? gSw : null };
}

/* ───────── 替わる幅のノブ(x = 歳差の率 × 幅)───────── */
/** 組の歳差の率 p(年齢あたり rad —— 替わりの中ほどの背景で・w の retainOf と同じ式)。幅 = x ÷ p */
export function rateAtSwitch({ axisVec, rho0, u0, u1, tSwitch, sense = DECL.main.sense, f = 0, q = 0 }) {
  const Bm = W.bgOf(tSwitch, { axisVec, rho0, u0, u1, tSwitch, width: 1e-9, shape: 'tanh' });
  return nrm(Bm.Om) * (1 + q) * X.coefOf({ f, sense, ratio: 1 }).kPrec * AGE_S();
}
export function widthForX(cell, x) { chk(fin(x) && x >= 0, 'widthForX: x ≥ 0'); const p = rateAtSwitch(cell); return p > 0 ? x / p : Infinity; }
/** 閉じた形で、作った角 γ がいまの角の帯(±10%)の下端まで落ちる x(tanh)—— 残る角の割合 0.9(= 1 − 帯)の境目 */
export function xKeepClosed(shape = 'tanh', frac = DECL.keepFrac) { return W.xForRetain(shape, 1 - frac); }
export const retainClosed = W.retainClosed;

/* ───────── 方位の位相 ───────── */
/** 方位の外れ(°)の一覧から、いまの方位の帯 ±band に居る割合と、一様なら来る割合(2 band ÷ 360) */
export function phaseFrac(devs, band = DECL.azBandDeg) {
  const v = devs.filter(fin); return { n: v.length, nIn: v.filter((d) => Math.abs(d) <= band).length, frac: v.length ? v.filter((d) => Math.abs(d) <= band).length / v.length : null, uniform: 2 * band / 360 };
}

/* ───────── 零試験 ───────── */
export const ANCHOR = Object.freeze({
  axisL: Object.freeze([0.026257, 0.008317, 0.999621]), omegaG: '9.09e-16', sunL: '5.968',
  /** 第353便w の表 3: 読み B・基準軸 L・f 0 の行 —— u₁ 0.0487 は作る→保つ 17・いまの姿 2/u₁ 0.98 は 23・0(行ごと 240 組) */
  wRow0487: Object.freeze({ make: 17, now: 2 }), wRow098: Object.freeze({ make: 23, now: 0 }), nRow: 240,
  band: Object.freeze(['2.4', '3.7']),
});
const W_TSWS = Object.freeze([0.01, 0.1, 0.3, 0.5]), W_RHOS = Object.freeze([0.0605, 0.075, 0.087, 0.1, 1, Infinity]), W_U0S = Object.freeze([2.4, 3.7]), W_QS = Object.freeze([-1, -0.5, -0.1, 0.1, 1]);
export const W_GRID = Object.freeze({ tSws: W_TSWS, rho0s: W_RHOS, u0s: W_U0S, qs: W_QS });
const KEYS = ['gReach', 'azReach', 'both', 'tHit', 'hitStage', 'keep', 'keepDev', 'make', 'keepSw', 'nowBoth', 'coneEndDeg', 'gammaEndDeg', 'ringOffEndDeg', 'azEndReach', 'dwell', 'nearAzDeg', 'nT', 'turnsAfter', 'nIll'];
const relSame = (a, b) => (a === b) || (fin(a) && fin(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq };
  // ① 統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐(L)
  const axL = ax.L.map((x) => Number(x.toFixed(6))), omegaG = DECL.omegaG.toExponential(2), sunL = angDeg(unit(GEO['Earth|Sun'].s), ax.L).toFixed(3);
  // ② 揺れ 0: 第353便w の表 3 の 2 行(読み B・L・f 0・u₁ 0.0487 と 0.98 —— 各 240 組)を runWave で数え直す・組ごとに runForm と同じ(相対 1e-9)
  const zero = {};
  let nCell = 0, nSame = 0;
  for (const u1 of [0.0487, 0.98]) {
    let mk = 0, now = 0;
    for (const tSwitch of W_TSWS) for (const rho0 of W_RHOS) for (const u0 of W_U0S) for (const q of W_QS) {
      const o = { GEO, axisVec: ax.L, axn: 'L', rho0, u0, u1, tSwitch, width: 0, shape: 'step', sense: 'g2m', f: 0, q, read: 'B' };
      const a = runWave({ ...o, zAmp: 0 }), b = W.runForm(o);
      nCell++; if (KEYS.every((k) => relSame(a[k], b[k]))) nSame++;
      if (a.make) mk++; if (a.nowBoth) now++;
    }
    zero[u1 === 0.98 ? 'u098' : 'u0487'] = { make: mk, now };
  }
  // ③ 背景: A 0 は bgOf と同じ(差 0)・nod は (G−) の項と基準軸の角と大きさを保つ・pulse は向きを保つ
  const bgo = { axisVec: ax.L, rho0: Infinity, u0: 3, u1: 0.98, tSwitch: 0.5, width: 0, shape: 'step' };
  let vs0 = 0, nodAng = 0, nodMag = 0, pulseDir = 0;
  const Bs = basisOf(ax.L), th0 = angDeg(Bs.gm, Bs.N);
  for (const t of [0.013, 0.2, 0.37, 0.61]) {
    const a = bgWave(t, { ...bgo, zAmp: 0 }), b = W.bgOf(t, bgo); vs0 = Math.max(vs0, nrm(sub(a.Om, b.Om)));
    const n1 = bgWave(t, { ...bgo, zAmp: 40, zPeriod: 0.03, form: 'nod' });
    if (t < 0.5) { nodAng = Math.max(nodAng, Math.abs(angDeg(n1.Om, Bs.N) - th0)); nodMag = Math.max(nodMag, Math.abs(nrm(n1.Om) / nrm(b.Om) - 1)); }
    const p1 = bgWave(t, { ...bgo, zAmp: 0.5, zPeriod: 0.03, form: 'pulse' });
    if (t < 0.5) pulseDir = Math.max(pulseDir, angDeg(p1.Om, b.Om));
  }
  // ④ 刻みの進め方 = 閉じた形(揺れ 0 の一定の背景を、揺れの規則で刻んで進めても 1 回の閉じた形と同じ —— 相対 1e-9)
  const cS = { GEO, axisVec: ax.L, axn: 'L', rho0: 0.087, u0: 2.4, u1: 0.98, tSwitch: 0.3, sense: 'g2m', f: 0.2, q: -0.5, read: 'B', ts: [0.1, 0.3, 1] };
  const tc = trajOfW(cS), tf = trajOfW({ ...cS, forceStep: true });
  let vsForce = 0; for (let i = 0; i < 3; i++) vsForce = Math.max(vsForce, nrm(sub(tc.rows[i].sv, tf.rows[i].sv)), nrm(sub(tc.rows[i].n, tf.rows[i].n)));
  // ⑤ 刻みの細かさ: 揺れの在る組で刻みを半分にしたときの終わりの向きの差(rad)
  let refine = 0;
  for (const form of DECL.forms) {
    const c = { GEO, axisVec: ax.L, axn: 'L', rho0: 0.075, u0: 3.0, u1: 0.98, tSwitch: 0.3, sense: 'g2m', f: 0, q: 0.1, read: 'B', zAmp: form === 'nod' ? 60 : 0.6, zPeriod: 0.0167, zPhase: 0.4, form, ts: [0.3, 1] };
    const a = trajOfW(c), b = trajOfW({ ...c, dPhiWave: DECL.dPhiWave / 2 });
    refine = Math.max(refine, nrm(sub(a.rows[1].sv, b.rows[1].sv)), nrm(sub(a.rows[0].sv, b.rows[0].sv)));
  }
  // ⑥ 共鳴の式: u_res(P) と P_res(u) が逆・仮の値の周期の範囲で帯 2.4〜3.7(〔第352便y〕の固定の点)
  const bandLo = uRes(provPeriod('hi')), bandHi = uRes(provPeriod('lo')), inv = Math.abs(pRes(uRes(0.037)) / 0.037 - 1);
  // ⑦ 閉じた形の境目: 帯の下端(残る角 0.9)の x(tanh・exp)
  const xK = { tanh: xKeepClosed('tanh'), exp: xKeepClosed('exp') };
  // ⑧ 拒否
  const rej = [() => bgWave(0, { ...bgo, zAmp: 10, form: 'swing' }), () => bgWave(0, { ...bgo, zAmp: 1.5, form: 'pulse' }), () => bgWave(0, { ...bgo, zAmp: 10, zPeriod: 0 }), () => uRes(-1), () => widthForX({ ...bgo, q: 0 }, -1)]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { axL, omegaG, sunL, zero, nCell, nSame, vs0, nodAng, nodMag, pulseDir, vsForce, refine, bandLo, bandHi, inv, xK, rejects: rej };
}
export function pureGates(S) {
  return {
    anchor3: S.axL.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) < 5e-7) && S.omegaG === ANCHOR.omegaG && S.sunL === ANCHOR.sunL,
    zeroVsW: S.nCell === 2 * ANCHOR.nRow && S.nSame === S.nCell && S.zero.u0487.make === ANCHOR.wRow0487.make && S.zero.u0487.now === ANCHOR.wRow0487.now && S.zero.u098.make === ANCHOR.wRow098.make && S.zero.u098.now === ANCHOR.wRow098.now,
    bgForms: S.vs0 === 0 && S.nodAng < 1e-9 && S.nodMag < 1e-9 && S.pulseDir < 1e-6,
    stepVsClosed: S.vsForce < 1e-7,
    refine: S.refine < 2e-3,
    resonance: S.bandLo.toFixed(1) === ANCHOR.band[0] && S.bandHi.toFixed(1) === ANCHOR.band[1] && S.inv < 1e-12,
    keepClosed: S.xK.tanh > 0.5 && S.xK.tanh < 0.6 && Math.abs(W.retainClosed('tanh', S.xK.tanh) - 0.9) < 1e-9 && Math.abs(S.xK.exp - Math.sqrt(1 / 0.81 - 1)) < 1e-9,
    rejects: S.rejects.every(Boolean),
  };
}

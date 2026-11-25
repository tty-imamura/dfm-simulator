// 第353便w(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R487):
//   **形成の段階の題の入口 —— 背景が時間で替わる模型(始めは (G−) の項を持つ背景 → いまの (N+) へ移る)で、太陽の傾きを「作る段」と「保つ段」を 1 本の時間の列でつなぐ純関数 —— ノブの走査の表・診断だけ**
//   (器 tests/exp-w353w-formstage.mjs と QA behavior.formstage353w・docs.formstage353w が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便o(twoAxisBoth・frameOf・scanCell・dwellOf・fKeepAt)・第352便x(mapAxis・coefOf・stateAt)・第352便r(bgTwo・abOf・dAzAround)・第352便l(closedAxis)・第352便c(refAxes・dAz)・第347便e(t1Table・geometry)。
//   第353便o の lib の閉包に第352便b の仮の値の lib が入る —— この lib を呼ぶ段の正本は、最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 背景の時間の形(ノブ —— 由来は書かない): Ω(t) = (1 − s(t)) Ω₁ + s(t) Ω₂。Ω₁ = 始めの背景(比 ρ₀ = (G−) の項 ÷ (N+) の項・大きさ u₀ —— ω_G の倍)・Ω₂ = いまの (N+)(大きさ u₁)。
//   s(t) の形: 'step'(t ≥ t_sw で 1)・'exp'(t > t_sw で 1 − e^(−(t − t_sw)/w))・'tanh'(½(1 + tanh((t − t_sw)/w)))。t は年齢を 1 とした時間。
// ■ 読み: A = 始まりに 2 つの軸がいまの基準軸にそろう/B = 終わり(t = 1)に輪の法線がいまの基準軸に来る(輪だけを後ろへ解いて始まりを置く)。
// ■ 言わないこと: 太陽の傾きの由来の答え・形成の段階の再現とは書かない(この形・この格子・この幅での、ノブの走査の表)。背景が替わる理由は予想の文として引くだけ。
import * as O from './lib-w353o-suntiltmain.mjs';
import * as X from './lib-w352x-sunorigin.mjs';
import * as T from './lib-w352r-twobg.mjs';
import * as SL from './lib-w352l-suntilt.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353w-formstage-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = O.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = O.angDeg;
export const YR = O.YR;
export const vec = O.vec;

/* ───────── 宣言(ノブの名と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  shapes: Object.freeze(['step', 'exp', 'tanh']), reads: Object.freeze(['A', 'B']), senses: O.DECL.senses, axes: O.DECL.axes,
  main: O.DECL.main, tiltDeg: O.DECL.tiltDeg, tol: O.DECL.tol, ageYr: O.DECL.ageYr, omegaG: O.DECL.omegaG,
  /** 保つの帯(いまの角 ±10%)—— 物差し・採否の判定ではない */
  keepFrac: 0.1,
  /** 移り変わりの窓の端(形の裾 —— exp は 30 w・tanh は ±15 w で残り 1e-13 の桁) */
  tail: Object.freeze({ exp: 30, tanh: 15 }),
  /** 移り変わりの窓の中の 1 刻みの歳差の角の上限(rad) */
  dPhiMax: 0.01,
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const chk = (c, m) => { if (!c) throw new RangeError(m); };

/* ───────── 背景の時間の形 ───────── */
/** 第352便r の bgTwo の 2 つの項の向き(a 1・b 0 と a 0・b 1)—— 軸ごとに 1 回だけ作る(bgTwo は a・b の 1 次) */
const BASIS = new WeakMap();
function basisOf(axisVec) { let B = BASIS.get(axisVec); if (!B) { B = { np: T.bgTwo({ a: 1, b: 0, axis: axisVec }), gm: T.bgTwo({ a: 0, b: 1, axis: axisVec }) }; BASIS.set(axisVec, B); } return B; }
/** 方位の基準((G+) の方位 —— 第352便r の dAzAround と同じ式)—— GEO ごとに銀河の向きを 1 回だけ作る */
const GAL = new WeakMap();
function dAzOf(GEO, n, s) { let g = GAL.get(GEO); if (!g) { g = RC.galDirs(GEO); GAL.set(GEO, g); } const a = RC.azimuthDeg(n, s).az; return a === null ? null : RC.dAz(a, RC.azimuthDeg(n, g.Gp).az); }
/** 替わりの割合 s(t)(0 = 始めの背景・1 = いまの (N+)) */
export function sOf(t, { tSwitch, width = 0, shape = 'step' }) {
  if (tSwitch === Infinity) return 0;
  if (shape === 'step' || !(width > 0)) return t >= tSwitch ? 1 : 0;
  if (shape === 'exp') return t <= tSwitch ? 0 : 1 - Math.exp(-(t - tSwitch) / width);
  return 0.5 * (1 + Math.tanh((t - tSwitch) / width));
}
/** 移り変わりの窓 [ta, tb](この外は背景が一定 —— 閉じた形で進める) */
export function windowOf({ tSwitch, width = 0, shape = 'step' }) {
  if (tSwitch === Infinity) return { ta: Infinity, tb: Infinity };
  if (shape === 'step' || !(width > 0)) return { ta: tSwitch, tb: tSwitch };
  if (shape === 'exp') return { ta: tSwitch, tb: tSwitch + DECL.tail.exp * width };
  return { ta: Math.max(0, tSwitch - DECL.tail.tanh * width), tb: tSwitch + DECL.tail.tanh * width };
}
/**
 * 背景の時間の形(T1 の約束の口): bgOf(t, { axisVec, rho0, u0, u1, tSwitch, width, shape }) → { Om(rad/s), s, rho(その時の比 (G−) ÷ (N+)), u(大きさ ÷ ω_G) }
 * 始めの背景は第352便r の abOf(ρ₀, u₀)(ρ₀ ∞ は純粋な (G−))・いまは (N+) × u₁。
 */
export function bgOf(t, { axisVec, rho0, u0, u1, tSwitch, width = 0, shape = 'step' }) {
  chk(DECL.shapes.includes(shape), 'bgOf: 形は step・exp・tanh');
  chk(isVec(axisVec) && fin(u0) && u0 >= 0 && fin(u1) && u1 >= 0 && (rho0 === Infinity || (fin(rho0) && rho0 >= 0)), 'bgOf: 軸・u₀ ≥ 0・u₁ ≥ 0・ρ₀ ≥ 0 か ∞');
  chk(tSwitch === Infinity || (fin(tSwitch) && tSwitch >= 0), 'bgOf: t_sw ≥ 0 か ∞');
  chk(fin(width) && width >= 0, 'bgOf: 幅 ≥ 0');
  const s = sOf(t, { tSwitch, width, shape }), ab1 = T.abOf(rho0, u0);
  const a = (1 - s) * ab1.a + s * u1, b = (1 - s) * ab1.b, B = basisOf(axisVec);
  const Om = add(scl(B.np, a), scl(B.gm, b));   // = 第352便r の bgTwo({ a, b, axis })(2 つの項の和 —— 零試験 ⑧)
  return { Om, s, rho: a > 0 ? b / a : (b > 0 ? Infinity : 0), u: Math.hypot(a, b) };
}

/* ───────── 1 本の時間の列を進める ───────── */
const AGE_S = () => DECL.ageYr * YR;
/** 係数(第352便x の coefOf —— 輪 c_n 1・太陽 1 + q)。f は数か { f1, f2 }(f2 は替わった後 —— 形 step だけ) */
function coefsOf(f, sense, q) {
  const one = (ff) => ({ ring: X.coefOf({ f: ff, sense, ratio: 1 }), spin: X.coefOf({ f: ff, sense, ratio: 1 + q }) });
  return typeof f === 'number' ? { c1: one(f), c2: one(f) } : { c1: one(f.f1), c2: one(f.f2) };
}
/** 1 つの軸を t₀ → t₁(負の向きも)進める(一定の区間は閉じた形 1 回・窓の中は刻む —— 刻みの中は中点の背景で閉じた形) */
function adv1(Xv, t0, t1, o, which) {
  if (t1 === t0) return Xv;
  const { ta, tb } = o.win, sg = t1 > t0 ? 1 : -1, cuts = [t0];
  for (const c of [ta, tb]) if (fin(c) && (c - t0) * sg > 0 && (t1 - c) * sg > 0) cuts.push(c);
  cuts.sort((a, b) => sg * (a - b)); cuts.push(t1);
  let x = Xv;
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i], b = cuts[i + 1], mid = 0.5 * (a + b), inWin = mid > ta && mid < tb;
    let n = 1;
    if (inWin) { const B = bgOf(mid, o.bg), rate = nrm(B.Om) * (1 + Math.abs(o.q)) * AGE_S(); n = Math.max(1, Math.min(200000, Math.ceil(rate * Math.abs(b - a) / DECL.dPhiMax))); }
    const h = (b - a) / n;
    for (let k = 0; k < n; k++) {
      const tm = a + (k + 0.5) * h, B = bgOf(tm, o.bg), om = nrm(B.Om);
      if (!(om > 0)) continue;
      const c = (B.s >= 0.5 ? o.coefs.c2 : o.coefs.c1)[which];
      x = X.mapAxis(x, scl(B.Om, 1 / om), om * h * AGE_S(), c);
    }
  }
  return x;
}
function optsOf(o) {
  const { axisVec, rho0, u0, u1, tSwitch, width = 0, shape = 'step', sense, f = 0, q, read = 'B' } = o;
  chk(DECL.senses.includes(sense), 'runForm: 歳差の向きは g2m・g2p');
  chk(DECL.reads.includes(read), 'runForm: 読みは A・B');
  chk(fin(q) && q >= -1, 'runForm: q ≥ −1(−1 は太陽の係数 0 —— 枝 o の格子)');
  chk(typeof f === 'number' ? (fin(f) && f >= 0 && f <= 1) : (shape === 'step' && fin(f.f1) && fin(f.f2) && f.f1 >= 0 && f.f1 <= 1 && f.f2 >= 0 && f.f2 <= 1), 'runForm: 0 ≤ f ≤ 1(時間で替わる f は形 step だけ)');
  bgOf(0, { axisVec, rho0, u0, u1, tSwitch, width, shape });
  return { bg: { axisVec, rho0, u0, u1, tSwitch, width, shape }, win: windowOf({ tSwitch, width, shape }), sense, f, q, read, coefs: coefsOf(f, sense, q) };
}
/** 始まりの向き X₀(読み A: いまの基準軸・読み B: t = 1 に輪の法線がいまの基準軸に来るよう輪だけを後ろへ解く)と、条件の悪さの印 */
export function startOf(o) {
  const op = optsOf(o), N = unit(o.axisVec);
  if (op.read === 'A') return { X0: N, illCond: false };
  const X0 = adv1(N, 1, 0, op, 'ring'), w1 = unit(bgOf(0, op.bg).Om);
  return { X0, illCond: angDeg(X0, w1) > 180 - 1e-4 };
}
/**
 * 時間の列(T1 の約束の口): o = { GEO, axisVec, axn, rho0, u0, u1, tSwitch, width, shape, sense, f, q, read, ts(標本の時刻 —— 昇順・0 < t ≤ 1)}
 * 戻り値 { ts, rows: [{ t, s, n, sv, gammaDeg, dAzDeg, coneDeg(ŝ と基準軸), ringOffDeg(n̂ と基準軸)}], X0, illCond }
 */
export function trajOf(o) {
  const op = optsOf(o), N = unit(o.axisVec), st = startOf(o), ts = o.ts;
  chk(Array.isArray(ts) && ts.length >= 1 && ts.every((t, i) => fin(t) && t > 0 && t <= 1 && (i === 0 || t > ts[i - 1])), 'trajOf: ts は 0 < t ≤ 1 の昇順');
  let n = st.X0, s = st.X0, tp = 0; const rows = [];
  for (const t of ts) {
    n = adv1(n, tp, t, op, 'ring'); s = adv1(s, tp, t, op, 'spin'); tp = t;
    const g = angDeg(n, s);
    rows.push({ t, s: sOf(t, op.bg), n, sv: s, gammaDeg: g, dAzDeg: g > 1e-9 ? dAzOf(o.GEO, n, s) : null, coneDeg: angDeg(s, N), ringOffDeg: angDeg(n, N) });
  }
  return { ts, rows, X0: st.X0, illCond: st.illCond };
}
/** 標本の時刻: 一様 nT 点(k/nT)+ 対数 nLog 点(1e-6〜1)+ t_sw と窓の端 */
export function gridOf({ nT = 1000, nLog = 60, tSwitch = Infinity, width = 0, shape = 'step' } = {}) {
  const set = new Set();
  for (let k = 1; k <= nT; k++) set.add(k / nT);
  for (let k = 0; k < nLog; k++) set.add(Math.pow(10, -6 + 6 * k / nLog));
  const w = windowOf({ tSwitch, width, shape });
  for (const c of [w.ta, w.tb]) if (fin(c) && c > 0 && c <= 1) set.add(c);
  return [...set].sort((a, b) => a - b);
}
/** 標本の数の目安(歳差の 1 周を 16 点以上で —— 上限 nMax・下限 nMin) */
export function nTFor(o, { perTurn = 16, nMin = 400, nMax = 1600 } = {}) {
  const om = Math.max(nrm(bgOf(0, o).Om), nrm(bgOf(1, o).Om)), turns = om * (1 + Math.abs(o.q)) * AGE_S() / (2 * Math.PI);
  return Math.max(nMin, Math.min(nMax, Math.ceil(turns * perTurn)));
}
/**
 * 作る段 → 保つ段(T1 の約束の口): runForm({ GEO, axisVec, axn, rho0, u0, u1, tSwitch, width, shape, sense, f, q, read, nT? })
 * 戻り値 { gReach, azReach, both(角と方位に同時に届いた —— 標本のどれか), tHit, hitStage('form' = 替わる前・'after' = 替わった後), keep(届いた後で窓の後の標本が全部いまの角 ±10%),
 *   keepSw(窓の後の標本が全部いまの角 ±10%)・nowBoth(t = 1 に角と方位が幅の内 かつ keepSw —— いまの姿)・turnsAfter(替わった後の (N+) での太陽の歳差の周の数)・keepDev(届いた後・窓の後の標本でのいまの角からの外れの最大 ÷ いまの角), make(both かつ keep), coneEndDeg(t = 1 の ŝ と基準軸 —— 移った後の (N+) での円錐の角), gammaEndDeg, ringOffEndDeg, azEndReach(t = 1 の方位が幅の内), dwell(一様の標本でいまの角 ±10% に居る割合 = 長さ ÷ 年齢), nearAzDeg, nIll }
 */
export function runForm(o) {
  chk(o && o.GEO && DECL.axes.includes(o.axn), 'runForm: GEO・基準軸 L・eq');
  const gT = DECL.tiltDeg[o.axn], azT = T.nowDAz(o.GEO, o.axisVec), tol = DECL.tol, kf = DECL.keepFrac * gT;
  const nT = o.nT ?? nTFor(o), ts = gridOf({ nT, tSwitch: o.tSwitch, width: o.width ?? 0, shape: o.shape ?? 'step' });
  const st = startOf(o);
  if (st.illCond) return { illCond: true, nIll: 1, gReach: false, azReach: false, both: false, make: false, keep: false, keepDev: null, keepSw: false, nowBoth: false, turnsAfter: null, tHit: null, hitStage: null, coneEndDeg: null, gammaEndDeg: null, ringOffEndDeg: null, azEndReach: false, dwell: 0, nearAzDeg: null, nT };
  const R = trajOf({ ...o, ts }), w = windowOf({ tSwitch: o.tSwitch, width: o.width ?? 0, shape: o.shape ?? 'step' });
  let gR = false, aR = false, hit = null, near = null, inU = 0;
  const uni = new Set(); for (let k = 1; k <= nT; k++) uni.add(k / nT);
  for (const r of R.rows) {
    if (uni.has(r.t) && Math.abs(r.gammaDeg - gT) <= kf) inU++;
    if (r.dAzDeg === null || r.gammaDeg < tol.gammaDeg) continue;
    const eg = Math.abs(r.gammaDeg - gT), ea = Math.abs(RC.dAz(r.dAzDeg, azT));
    if (ea <= tol.azDeg) aR = true;
    if (eg <= tol.gammaDeg) { gR = true; near = near === null ? ea : Math.min(near, ea); if (ea <= tol.azDeg && hit === null) hit = r.t; }
  }
  let keep = false, keepDev = null;
  if (hit !== null) { const t0 = Math.max(hit, fin(w.tb) ? w.tb : 1), after = R.rows.filter((r) => r.t >= t0); keepDev = Math.max(...after.map((r) => Math.abs(r.gammaDeg - gT) / gT)); keep = keepDev <= DECL.keepFrac; }
  const tAfter = fin(w.tb) ? w.tb : 1, afterSw = R.rows.filter((r) => r.t >= tAfter), keepSw = afterSw.every((r) => Math.abs(r.gammaDeg - gT) <= kf);
  const end = R.rows[R.rows.length - 1];
  const azEnd = end.dAzDeg === null ? null : Math.abs(RC.dAz(end.dAzDeg, azT)), azEndR = azEnd !== null && azEnd <= tol.azDeg && Math.abs(end.gammaDeg - gT) <= tol.gammaDeg;
  return { illCond: false, nIll: 0, gReach: gR, azReach: aR, both: hit !== null, tHit: hit, hitStage: hit === null ? null : (hit < w.ta ? 'form' : 'after'), keep, keepDev, make: hit !== null && keep,
    keepSw, nowBoth: azEndR && keepSw, coneEndDeg: end.coneDeg, gammaEndDeg: end.gammaDeg, ringOffEndDeg: end.ringOffDeg, azEndReach: azEndR,
    dwell: inU / nT, nearAzDeg: near, nT, turnsAfter: o.tSwitch === Infinity ? 0 : nrm(bgOf(1, o).Om) * (1 + o.q) * coefsOf(typeof o.f === 'number' ? o.f : o.f.f2, o.sense, o.q).c2.ring.kPrec * AGE_S() * Math.max(0, 1 - tAfter) / (2 * Math.PI) };
}

/* ───────── 替わり方の急さ(T3)———— 1 つの軸が背景に付いて回るか ───────── */
/**
 * 1 つの軸(係数 = 太陽 —— f・比 1 + q)が、始めの背景の向きにそろって居るところで背景が (N+) へ替わる。終わりの軸と基準軸の角(残る角)。
 * 戻り値 { thDeg(始めの背景と基準軸の角), residDeg(残る角), ratio(残る角 ÷ θ), x(歳差の率 × 幅 —— 替わりの中ほどの背景で), perTurn(幅 ÷ 歳差の 1 周 = x ÷ 2π) }
 */
export function retainOf({ axisVec, rho0, u0, u1, width, shape, sense = DECL.main.sense, f = 0, q = 0, tSwitch = 0.5 }) {
  const op = optsOf({ axisVec, rho0, u0, u1, tSwitch, width, shape, sense, f, q, read: 'A' }), N = unit(axisVec);
  const w1 = unit(bgOf(0, op.bg).Om), tEnd = Math.min(1, windowOf(op.bg).tb + 1e-9);
  const x1 = adv1(w1, 0, tEnd, op, 'spin'), th = angDeg(w1, N), res = angDeg(x1, N);
  const Bm = bgOf(tSwitch, op.bg), p = nrm(Bm.Om) * (1 + q) * X.coefOf({ f, sense, ratio: 1 }).kPrec * AGE_S(), x = p * width;
  return { thDeg: th, residDeg: res, ratio: th > 0 ? res / th : null, x, perTurn: x / (2 * Math.PI) };
}
/** 残る角 ÷ θ の閉じた形(小さい角・f 0 —— 背景の向きの替わりの速さ ṡ の、歳差の率でのフーリエの大きさ): step 1・exp 1 ÷ √(1 + x²)・tanh (πx/2) ÷ sinh(πx/2) */
export function retainClosed(shape, x) {
  chk(DECL.shapes.includes(shape) && fin(x) && x >= 0, 'retainClosed: 形・x ≥ 0');
  if (shape === 'step' || x === 0) return 1;
  if (shape === 'exp') return 1 / Math.sqrt(1 + x * x);
  const y = Math.PI * x / 2; return y > 700 ? 0 : y / Math.sinh(y);
}
/** 閉じた形で残る角が割合 r になる x(二分)—— 境目の幅 */
export function xForRetain(shape, r) {
  chk(shape !== 'step' && fin(r) && r > 0 && r < 1, 'xForRetain: exp・tanh・0 < r < 1');
  let lo = 0, hi = 1e3; for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); if (retainClosed(shape, m) > r) lo = m; else hi = m; } return 0.5 * (lo + hi);
}

/* ───────── 零試験 ───────── */
export const ANCHOR = Object.freeze({
  axisL: Object.freeze([0.026257, 0.008317, 0.999621]), omegaG: '9.09e-16', sunL: '5.968',
  /** 第353便o の届く組: (g2−) 読み A 18 組・(g2+) 読み B 36 組(基準軸 2 × 比 7 × f 11 × q 5) */
  oA18: 18, oB36: 36,
});
const O_RHOS = Object.freeze([0, 0.0605, 0.075, 0.087, 0.1, 1, Infinity]);
const O_FS = Object.freeze([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]), O_QS = Object.freeze([-1, -0.5, -0.1, 0.1, 1]);
/**
 * t_sw → ∞ の極限(背景が始めのまま)で、枝 o の τ の格子(scanCell と同じ: τ_k = τ_m 10^(−8 + 8k/200))を「年齢 = τ_k」として終わりの状態を本 lib の進め方で数える
 * (u₀ = τ_k ÷ (abs(Ω₁(u₀ 1)) × 年齢) —— abs(Ω₁(u₀ 1)) は第353便o の frameOf の om1〔rad/s〕 —— 読み B は輪が t = 1 にいまの基準軸に来る置き方 = 第352便x の読み B)。戻り値は scanCell と同じ形の { both, tauHit }。
 */
export function limitCell({ GEO, axisVec, axn, rho, sense, f, q, read, nTau = 200, dec = 8 }) {
  const tm = Math.max(200, 50 / Math.abs(q)), om1 = O.frameOf(GEO, axisVec, axn, rho).om1, gT = DECL.tiltDeg[axn], azT = T.nowDAz(GEO, axisVec), tol = DECL.tol;
  for (let k = 0; k <= nTau; k++) {
    const tau = tm * Math.pow(10, -dec + dec * k / nTau), u0 = tau / (om1 * AGE_S());
    const o = { GEO, axisVec, axn, rho0: rho, u0, u1: 1, tSwitch: Infinity, sense, f, q, read };
    const st = startOf(o); if (st.illCond) continue;
    const R = trajOf({ ...o, ts: [1] }).rows[0];
    if (R.dAzDeg === null || R.gammaDeg < tol.gammaDeg) continue;
    if (Math.abs(R.gammaDeg - gT) <= tol.gammaDeg && Math.abs(RC.dAz(R.dAzDeg, azT)) <= tol.azDeg) return { both: true, tauHit: tau };
  }
  return { both: false, tauHit: null };
}
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const RA = RC.refAxes(T1, GEO), ax = { L: RA.L, eq: RA.eq };
  // ① 統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐(L)
  const axL = ax.L.map((x) => Number(x.toFixed(6))), omegaG = DECL.omegaG.toExponential(2), sunL = angDeg(unit(GEO['Earth|Sun'].s), ax.L).toFixed(3);
  // ② t_sw → ∞: 枝 o の届く組の数((g2−) 読み A 18・(g2+) 読み B 36)を本 lib の進め方で数え直す・枝 o の scanCell と組ごとに同じ(届き・τ を相対 1e-6)
  let nA = 0, nB = 0, same = 0, nCell = 0;
  for (const axn of DECL.axes) for (const rho of O_RHOS) for (const f of O_FS) for (const q of O_QS) {
    for (const [sense, read] of [['g2m', 'A'], ['g2p', 'B']]) {
      const a = limitCell({ GEO, axisVec: ax[axn], axn, rho, sense, f, q, read }), b = O.scanCell({ GEO, axisVec: ax[axn], axn, rho, sense, f, q, read });
      nCell++; if (a.both === b.both && (a.tauHit === null ? b.tauHit === null : Math.abs(a.tauHit / b.tauHit - 1) < 1e-6)) same++;
      if (a.both) { if (read === 'A') nA++; else nB++; }
    }
  }
  // ③ t_sw → 0: はじめから (N+) —— 2 つの軸は基準軸にそろったまま(届き 0・動く角 0)
  let moved = 0, make0 = 0;
  for (const read of DECL.reads) for (const sense of DECL.senses) for (const rho0 of [0.075, 1, Infinity]) for (const f of [0, 0.5]) for (const q of [-0.5, 1]) {
    const r = runForm({ GEO, axisVec: ax.L, axn: 'L', rho0, u0: 3, u1: 0.98, tSwitch: 0, sense, f, q, read, nT: 400 });
    moved = Math.max(moved, r.gammaEndDeg, r.coneEndDeg); if (r.both || r.gReach) make0++;
  }
  // ④ 進め方 = 枝 o の twoAxisBoth(om は関数 —— 形 step・刻みを t_sw にそろえる)・相対 1e-9
  const bgS = { axisVec: ax.L, rho0: 1, u0: 0.02, u1: 0.98, tSwitch: 0.25, shape: 'step' };
  const om = (tsec) => bgOf(tsec / AGE_S(), bgS).Om, n0 = ax.L;
  const TB = O.twoAxisBoth({ n0, s0: n0, om, T: AGE_S(), steps: 4, ring: { f: 0.1, ratio: 1 }, spin: { f: 0.1, ratio: 0.5 } });
  let vsTB = 0;
  for (const sense of DECL.senses) {
    const R = trajOf({ GEO, ...bgS, axn: 'L', sense, f: 0.1, q: -0.5, read: 'A', ts: [1] }).rows[0];
    vsTB = Math.max(vsTB, nrm(sub(R.n, TB[sense].n)), nrm(sub(R.sv, TB[sense].s)), Math.abs(R.gammaDeg - TB[sense].gammaDeg) / TB[sense].gammaDeg);
  }
  // ⑤ 枝 o の dwellOf と同じ帯の長さ(t_sw ∞・読み A・届いた組 1 つ —— 本 lib の進め方で同じ刻み)
  const cell = { GEO, axisVec: ax.L, axn: 'L', rho: 0.0605, sense: 'g2m', f: 0, q: -1, read: 'A' }, sc = O.scanCell(cell);
  let dwVs = null;
  if (sc.both) {
    const dO = O.dwellOf({ ...cell, tauHit: sc.tauHit }), om1 = O.frameOf(GEO, ax.L, 'L', cell.rho).om1, gT = DECL.tiltDeg.L;
    const inB = (tau) => { if (!(tau > 0)) return false; const u0 = tau / (om1 * AGE_S()); const R = trajOf({ GEO, axisVec: ax.L, axn: 'L', rho0: cell.rho, u0, u1: 1, tSwitch: Infinity, sense: 'g2m', f: 0, q: cell.q, read: 'A', ts: [1] }).rows[0]; return Math.abs(R.gammaDeg - gT) <= 0.1 * gT; };
    const dt = Math.min(sc.tauHit * 2e-3, 0.01 / (1 + Math.abs(cell.q))); let lo = sc.tauHit, hi = sc.tauHit;
    for (let k = 0; k < 4000; k++) { const t = lo - dt; if (!inB(t)) break; lo = t; }
    for (let k = 0; k < 4000; k++) { const t = hi + dt; if (!inB(t)) break; hi = t; }
    dwVs = Math.abs((hi - lo) / sc.tauHit - dO.ratio) / Math.max(dO.ratio, 1e-300);
  }
  // ⑥ 替わり方の急さ: 閉じた形の極限(step 1・幅 0 → 1・幅が大きい → 0)と、小さい角(比 0.0605)の数え直し(tanh・x ≈ 1.4 —— 相対 2%)
  const r0 = retainOf({ axisVec: ax.L, rho0: 0.0605, u0: 1, u1: 1, width: 0, shape: 'step' });
  const pTanh = retainOf({ axisVec: ax.L, rho0: 0.0605, u0: 1, u1: 1, width: 1.4 / (nrm(bgOf(0.5, { axisVec: ax.L, rho0: 0.0605, u0: 1, u1: 1, tSwitch: 0.5, width: 0.01, shape: 'tanh' }).Om) * AGE_S()), shape: 'tanh' });
  const cT = retainClosed('tanh', pTanh.x), cTRel = Math.abs(pTanh.ratio / cT - 1);
  const xHalf = { exp: xForRetain('exp', 0.5), tanh: xForRetain('tanh', 0.5) };
  // ⑧ 背景の和 = 第352便r の bgTwo・方位 = 第352便r の dAzAround(相対 1e-12)
  let vsBg = 0;
  for (const [rho0, u0, u1, t] of [[0.087, 3.1, 0.98, 0.1], [Infinity, 2.4, 0.0487, 0.6], [1, 3.7, 0.835, 0.3]]) {
    const B = bgOf(t, { axisVec: ax.L, rho0, u0, u1, tSwitch: 0.3, width: 0.05, shape: 'tanh' }), s = B.s, ab = T.abOf(rho0, u0), ref = T.bgTwo({ a: (1 - s) * ab.a + s * u1, b: (1 - s) * ab.b, axis: ax.L });
    vsBg = Math.max(vsBg, nrm(sub(B.Om, ref)) / nrm(ref));
  }
  const nT = unit([0.1, 0.2, 0.97]), sT = unit([0.2, -0.1, 0.95]), vsAz = Math.abs(dAzOf(GEO, nT, sT) - T.dAzAround(GEO, nT, sT));
  // ⑦ 拒否
  const rej = [() => bgOf(0, { axisVec: ax.L, rho0: 1, u0: 1, u1: 1, tSwitch: 0.5, shape: 'box' }), () => runForm({ GEO, axisVec: ax.L, axn: 'ecl', rho0: 1, u0: 1, u1: 1, tSwitch: 0.5, sense: 'g2m', q: 0 }),
    () => runForm({ GEO, axisVec: ax.L, axn: 'L', rho0: 1, u0: 1, u1: 1, tSwitch: 0.5, shape: 'tanh', width: 0.01, sense: 'g2m', f: { f1: 0.8, f2: 0 }, q: 0 }), () => retainClosed('step', -1)]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { axL, omegaG, sunL, nA, nB, same, nCell, moved, make0, vsTB, dwVs, r0: r0.ratio, cT, cTRel, xTanh: pTanh.x, xHalf, vsBg, vsAz, rejects: rej };
}
export function pureGates(S) {
  return {
    anchor3: S.axL.every((x, i) => Math.abs(x - ANCHOR.axisL[i]) < 5e-7) && S.omegaG === ANCHOR.omegaG && S.sunL === ANCHOR.sunL,
    limitInfO: S.nA === ANCHOR.oA18 && S.nB === ANCHOR.oB36 && S.same === S.nCell && S.nCell === 2 * 2 * 7 * 11 * 5,
    limitZeroMain: S.moved < 1e-9 && S.make0 === 0,
    stepVsTwoAxis: S.vsTB < 1e-9,
    dwellVsO: S.dwVs !== null && S.dwVs < 1e-9,
    retainLimits: Math.abs(S.r0 - 1) < 1e-9 && S.cTRel < 0.02 && S.xHalf.exp > 1.73 && S.xHalf.exp < 1.7321 && S.xHalf.tanh > 1.38 && S.xHalf.tanh < 1.39,
    bgAzVsR: S.vsBg < 1e-12 && S.vsAz < 1e-9,
    rejects: S.rejects.every(Boolean),
  };
}

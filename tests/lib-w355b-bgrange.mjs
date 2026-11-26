// 第355便b(原仮定者の指示(2026-11-25)「この結果を尊重する」・原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・統括の検証項目 R505):
//   **「潮汐力 ÷ 軸引きずり = 1」の線でロックの側とロックしない側が分かれる背景の大きさ u(銀河の公転の角速度の倍)の範囲を、主の作り
//   (換算の係数 = 太陽の自転の分が金星で背景と等大になる値〔第353便zf の列 (イ) の作り〕・受け手の半径 = 応答の側だけ (P-応)・源の扁平率 = 体積を保つ扁平 (O2b))で
//   閉じた形で数える純関数** —— 診断だけ(器 tests/exp-w355b-bgrange.mjs と QA behavior.bgrange355b・docs.bgrange355b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便zk(lockdef —— bodyOf・tideTorque・omOf・xOf・separateAt・uBand・venusEarthRow・synAvg)・第353便zf(localAtLam・bgUnit・uVenus・DECL.sats)・
//   第353便c(rateMult —— (P-応) の率の倍)・第352便k(recvRadius —— 規則の半径・vec)・第353便z(sigmaN・fOf —— (O2b) の σ = (1 − f)^(−2/3))・第348便c(radiusOf)・第353便g(egRow)・第337便c(G・BODY_SRC)。
//   潮汐のトルクは全部「比べる列(DFM の式ではない)」。k₂/Q・観測の自転・構造の係数は仮の値・未照合のノブ。第353便zk の lib は仮の値の lib を閉包に持つ(本 lib は仮の値を読まない)。
//   (前倒しの作業中の版の口を名と版を付け替えて写し、零試験を足した —— 数は器で数え直す。)
//
// ■ 語: X = N_潮 ÷ N_軸(第353便zk と同じ)。Ω(u) = u × bgUnit + k(u) × 局所。列 (イ) の作り: k(u) = u ÷ 金星の条件の値(太陽の自転の分 ÷ 銀河の公転の角速度)。
//   作り 4 つ: 'R' 規則の球(第353便zk そのまま —— 衛星の母天体の項には第353便zk の既定どおり (O2b) の σ が掛かっている)/'O' (O2b) だけ(太陽の項にも σ_太陽・金星の条件の値も σ_太陽 倍)/
//   'P' (P-応) だけ/'M' 両方(主の作り)。
//   (P-応): 軸の率 = 場の Ω × 率の倍 m、m =(c_ref ÷ c)(R_ref ÷ (c_R R_観測))²(第353便c の rateMult)。
//     軸引きずりのトルク(主の読み —— 潮汐の率も軸引きずりの率も同じ慣性モーメント c M (c_R R)² で割る)= c M (c_R R)² × 自転の率 × 直交成分 × m = c_ref M R_ref² × 自転の率 × 直交成分。
//     → X_P = X_R × (C R²)÷(c_ref R_ref²)(C・R は第353便zk の dragTorque の文献の係数と観測半径)。c と c_R は分子と分母で消える。R_ref 観測なら倍は C ÷ c_ref・R_ref 規則なら桁で動く。
//     比べる読み: 潮汐の率だけを第353便zk の慣性モーメント(c = 文献・c_R 1)で割る → X = X_R ÷ m(c, c_R)(c_R² に比例)。
import * as Z from './lib-w353zk-lockdef.mjs';
import * as ZF from './lib-w353zf-threecols.mjs';
import * as CC from './lib-w353c-recvradius.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as ZP from './lib-w353z-obpower.mjs';
import * as AB from './lib-w348c-axisbalance.mjs';
import * as G from './lib-w353g-venuslock.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w355b-bgrange-lib-1';
const { crs, nrm, scl, add, sub } = K.vec;
export const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

export const BUILDS = Object.freeze([
  Object.freeze({ id: 'R', label: '規則の球(第353便zk)', ob: false, resp: false }),
  Object.freeze({ id: 'O', label: '(O2b) だけ', ob: true, resp: false }),
  Object.freeze({ id: 'P', label: '(P-応) だけ', ob: false, resp: true }),
  Object.freeze({ id: 'M', label: '両方(主の作り)', ob: true, resp: true }),
]);
export const DECL = Object.freeze({
  builds: Object.freeze(BUILDS.map((b) => b.id)), mainBuild: 'M',
  refs: Object.freeze(['obs', 'rule']), refMain: 'obs', cRef: CC.DECL.cRef,
  cRShow: Object.freeze([1, 0.1, 0.0128, 1e-3, 1e-6]),
  modes: Z.DECL.modes, k2qModes: Z.DECL.k2qModes, bodies: Z.DECL.bodies, planets: Z.DECL.planets,
  modeMain: 'obs', k2qMain: 'common', partAsLockMain: true,
  k2qScan: Z.DECL.k2qScan, window: Z.DECL.window, uFocus: Z.DECL.uFocus,
  reps: Object.freeze([0.41, 0.84, 0.98, 3.2]), egQ: 1e-5,
  judge: '零試験は相対 1e-9 の床(同じ入力の照合)・第353便zk の正本の数とも相対 1e-9・逐語の表は有効数字 3 桁',
});
const CACHE = { loc: {}, uV: {} };

/* ───────── 局所の項(源ごと)と (O2b) の σ ───────── */
export const sigmaOf = (src) => ZP.sigmaN(ZP.fOf(src === 'EarthHi' ? 'Earth' : src), Z.DECL.obN);
/** 局所の項: 太陽の分と母天体の分(衛星のみ)を別々に(λ 1) */
export function locParts(id, o = {}) {
  if (CACHE.loc[id]) return CACHE.loc[id];
  const srcs = ZF.DECL.sats[id] || ['Sun'];
  const sun = ZF.localAtLam(id, srcs[0], 1, o), host = srcs.length > 1 ? ZF.localAtLam(id, srcs[1], 1, o) : null;
  return (CACHE.loc[id] = { srcs, sun, host });
}
/** 金星の条件の値(規則の球 = 第353便zf の uVenus/(O2b) = 太陽の項に σ_太陽) */
export function uVOf(ob, o = {}) {
  const key = ob ? 'O' : 'R';
  if (CACHE.uV[key] !== undefined) return CACHE.uV[key];
  const v = locParts('Venus', o).sun, s = ob ? sigmaOf('Sun') : 1;
  return (CACHE.uV[key] = nrm(scl(v, s)) / nrm(ZF.bgUnit(o)));
}
/** Ω(u)(作りの ob に合わせる): u bg + (u ÷ uV) (σ_太陽 太陽の分 + σ_母 母天体の分)。母天体の σ は第353便zk の既定(O2b)と同じ(作り R でも掛かる)・hostOb 'none' で外す */
export function omOfB(id, build, u, { hostOb = 'O2b' } = {}, o = {}) {
  const B = BUILDS.find((b) => b.id === build); if (!B) throw new RangeError('omOfB: 作りは ' + DECL.builds.join('・'));
  const L = locParts(id, o), sS = B.ob ? sigmaOf('Sun') : 1, sH = L.host ? (hostOb === 'none' ? 1 : sigmaOf(L.srcs[1])) : 0;
  const loc = L.host ? add(scl(L.sun, sS), scl(L.host, sH)) : scl(L.sun, sS), k = u / uVOf(B.ob, o);
  const zk = Z.omOf(id, 'I', { u }, o), Om = add(scl(ZF.bgUnit(o), u), scl(loc, k));
  return { u, k, Om, sHat: zk.sHat, W: nrm(Om), perp: nrm(crs(Om, zk.sHat)) };
}
/** (P-応) の倍(主の読み —— 正本の口): (C R²) ÷ (c_ref R_ref²) —— X_P = X × この倍 */
export function respFactor(id, ref = 'obs', { cRef = DECL.cRef } = {}) {
  if (!DECL.refs.includes(ref)) throw new RangeError('respFactor: ref は obs・rule');
  const b = Z.bodyOf(id), Rref = ref === 'rule' ? K.recvRadius(id) : b.R;
  return (b.C * b.R * b.R) / (cRef * Rref * Rref);
}
/** 比べる読み: X = X_R ÷ m(c, c_R)(m は第353便c の rateMult —— c は第353便zk の C・観測半径は第353便c の radiusOf) */
export function respFactorAlt(id, ref = 'obs', { cR = 1, c = null } = {}) {
  const m = CC.rateMult(id, { c: c === null ? Z.bodyOf(id).C : c, cR, ref });
  return m === null ? null : 1 / m;
}
/** X(作り・置き方・k₂/Q・u・R_ref) */
export function xOfB(id, build, { mode = 'obs', k2q = 'common', u = DECL.uFocus, ref = DECL.refMain, hostOb = 'O2b', alt = null } = {}, o = {}) {
  const B = BUILDS.find((b) => b.id === build), b = Z.bodyOf(id, o), w = omOfB(id, build, u, { hostOb }, o);
  const rate = mode === 'obs' ? Math.abs(b.spin) : b.nOrb, comp = mode === 'syncAbs' ? w.W : w.perp;
  const x = Z.tideTorque(id, null, { k2q }) / (b.I * rate * comp);
  if (!B.resp) return x;
  return x * (alt ? respFactorAlt(id, ref, alt) : respFactor(id, ref));
}
export function xRowsB(build, opts = {}, o = {}) {
  return DECL.bodies.map((id) => ({ id, state: Z.lockStates[id], X: xOfB(id, build, opts, o) }));
}
/**
 * 線 1 で分かれる u の範囲(閉じた形 —— 正本の口。Ω は u に比例するので X(u) = X(1) ÷ u):
 *   下端 = ロックしない側の X(1) の最大(その天体)・上端 = ロックの側の X(1) の最小(その天体)。下端 ≥ 上端なら空。
 */
export function uRange(build, { mode = 'obs', k2q = 'common', ref = DECL.refMain, partAsLock = true, hostOb = 'O2b', alt = null } = {}, o = {}) {
  const rows = xRowsB(build, { mode, k2q, u: 1, ref, hostOb, alt }, o), s = Z.separateAt(rows, { partAsLock });
  const lo = s.notMax, hi = s.lockMin;
  return { build, mode, k2q, ref, partAsLock, lo, hi, loBody: s.notMaxId, hiBody: s.lockMinId, open: lo < hi, width: hi / lo, rows };
}
export const inRange = (u, r) => r.open && u > r.lo && u < r.hi;
/** 区間 [a, b] と範囲の関係: 'in'(全部内)・'part'・'out' */
export function relWin(r, a, b) { if (!r.open || r.hi <= a || r.lo >= b) return 'out'; return r.lo <= a && r.hi >= b ? 'in' : 'part'; }
/** 2 つの範囲の重なり(下端・上端 —— 無ければ null) */
export function overlap(r1, r2) { if (!r1.open || !r2.open) return null; const lo = Math.max(r1.lo, r2.lo), hi = Math.min(r1.hi, r2.hi); return lo < hi ? { lo, hi } : null; }
/**
 * 共通部分(置き方 × k₂/Q の組の範囲を全部重ねる): 下端 = 組の下端の最大・上端 = 組の上端の最小。空なら open false(下端 ≥ 上端 —— 差の倍 gap = 下端 ÷ 上端)。
 *   sets: [{ mode, k2q }] —— 既定は置き方 3 × k₂/Q 2 の 6 組。
 */
export function commonPart(build, { ref = DECL.refMain, partAsLock = true, sets = null } = {}, o = {}) {
  const ss = sets || DECL.modes.flatMap((m) => DECL.k2qModes.map((q) => ({ mode: m, k2q: q })));
  const rs = ss.map((s) => uRange(build, { ...s, ref, partAsLock }, o));
  const loR = rs.reduce((a, r) => (r.lo > a.lo ? r : a), rs[0]), hiR = rs.reduce((a, r) => (r.hi < a.hi ? r : a), rs[0]);
  return { build, ref, partAsLock, n: rs.length, lo: loR.lo, hi: hiR.hi, open: loR.lo < hiR.hi && rs.every((r) => r.open), gap: loR.lo / hiR.hi,
    loFrom: { mode: loR.mode, k2q: loR.k2q, body: loR.loBody }, hiFrom: { mode: hiR.mode, k2q: hiR.k2q, body: hiR.hiBody },
    each: rs.map((r) => ({ mode: r.mode, k2q: r.k2q, lo: r.lo, hi: r.hi, in098: inRange(DECL.uFocus, r) })) };
}

/* ───────── 金星の代表の値(範囲の内の u で —— 主の作り・R_ref 観測・観測の自転・共通 1e-2)───────── */
/** o は { T1, GEO }(第347便e の t1Table・geometry —— 第353便g の egRow が読む) */
export function repOf(u, o) {
  const bV = Z.bodyOf('Venus', o), sa = Z.synAvg(), ME = TL.BODY_SRC.Earth.M[0];
  const tideBase = 1.5 * 1e-2 * TL.G_SI * ME * ME * Math.pow(bV.R, 5), tideInf = tideBase * sa.invD6Inf, tideMean = tideBase * sa.invD6Mean;
  const egT = bV.I * G.egRow(o.T1, o.GEO, DECL.egQ).torqueRate;
  const w = omOfB('Venus', 'M', u, {}, o), bg = u * Math.hypot(...Z.omOf('Venus', 'I', { u: 1 }, o).bg);
  const Nax = bV.I * Math.abs(bV.spin) * w.perp / respFactor('Venus', 'obs');
  return { u, k: w.k, venusPerpOverBg: w.perp / bg, venusWOverBg: w.W / bg, earthTideInfOverRes: tideInf / Nax, earthTideMeanOverRes: tideMean / Nax, egMaxOverRes: egT / Nax,
    xVenus: xOfB('Venus', 'M', { u }, o), xEarth: xOfB('Earth', 'M', { u }, o), xMercury: xOfB('Mercury', 'M', { u }, o) };
}

/* ───────── 零試験(既存の lib の口と同じ入力で照合 —— J353zk は正本 tests/out/lockdef-353zk.json の中身〔器と QA が読んで渡す〕)───────── */
export function pureScenes(J353zk, o = {}) {
  // ① 作り R = 第353便zk の xOf(列イ・u 0.98)と同じ入力で(10 天体 × 置き方 3 × k₂/Q 2)
  const xR = DECL.modes.flatMap((m) => DECL.k2qModes.flatMap((q) => DECL.bodies.map((id) => ({ id, mode: m, k2q: q, mine: xOfB(id, 'R', { mode: m, k2q: q, u: 0.98 }, o), zk: Z.xOf(id, 'I', { mode: m, k2q: q, u: 0.98 }, o) }))));
  // ② 正本 lockdef-353zk.json の t1.x(列イ)と
  const xJ = J353zk.t1.x.filter((r) => r.col === 'I').flatMap((r) => r.rows.map((w) => ({ id: w.id, mode: r.mode, k2q: r.k2q, json: w.X, mine: xOfB(w.id, 'R', { mode: r.mode, k2q: r.k2q, u: 0.98 }, o) })));
  // ③ 閉じた形の範囲 = 正本の t3(列イ)の格子 + 二分の範囲(格子で切った端は除く)
  const t3 = J353zk.t3.filter((r) => r.col === 'I').map((r) => { const g = uRange('R', { mode: r.mode, k2q: r.k2q }, o), j = r.ranges[0] || null;
    return { mode: r.mode, k2q: r.k2q, json: j, mine: { lo: g.lo, hi: g.hi, loBody: g.loBody, hiBody: g.hiBody } }; });
  // ④ X は u に反比例(Ω が u に比例)
  const lin = DECL.bodies.map((id) => ({ id, r: xOfB(id, 'M', { u: 0.5 }, o) / xOfB(id, 'M', { u: 1 }, o) }));
  // ⑤ (O2b) の σ_太陽 と 金星の条件の値の比(第353便zf の uVenus と)
  const sS = sigmaOf('Sun'), uR = uVOf(false, o), uO = uVOf(true, o), uZF = ZF.uVenus(o);
  // ⑥ 惑星の Ω は (O2b) で同じ(k が σ で割れる)
  const omPl = DECL.planets.map((id) => { const a = omOfB(id, 'R', 0.98, {}, o).Om, b = omOfB(id, 'O', 0.98, {}, o).Om; return { id, d: nrm(sub(a, b)) / nrm(a) }; });
  // ⑦ (P-応) の倍 = 1 ÷ 第353便c の rateMult(c = 第353便zk の C・c_R 1)× 規則の半径では (第353便zk の R ÷ 第348便c の観測半径)²(半径の出どころの差)
  const resp = DECL.bodies.flatMap((id) => DECL.refs.map((ref) => { const m = CC.rateMult(id, { c: Z.bodyOf(id).C, cR: 1, ref }), rr = Z.bodyOf(id).R / AB.radiusOf(id);
    return { id, ref, mine: respFactor(id, ref), viaC: m === null ? null : 1 / m, radiusRatio: rr, viaCcorr: m === null ? null : (ref === 'rule' ? rr * rr : 1) / m }; }));
  // ⑧ 比べる読みは c_R² に比例
  const cr2 = xOfB('Earth', 'P', { alt: { cR: 0.1 } }, o) / xOfB('Earth', 'P', { alt: { cR: 1 } }, o);
  // ⑨ 母天体の σ を外すと第353便zk の ob 'none' と同じ
  const hostNone = ['Moon', 'Io'].map((id) => ({ id, mine: xOfB(id, 'R', { hostOb: 'none' }, o), zk: Z.xOf(id, 'I', { u: 0.98, ob: 'none' }, o) }));
  // ⑩ 衛星の Ω(作り R)= 第353便zk の omOf
  const omSat = ['Moon', 'Io'].map((id) => { const a = omOfB(id, 'R', 0.98, {}, o).Om, b = Z.omOf(id, 'I', { u: 0.98 }, o).Om; return { id, d: nrm(sub(a, b)) / nrm(b) }; });
  // ⑪ 金星の代表の値(u 0.98)= 第353便zk の venusEarthRow('I')(規則の球)× (P-応) の倍(金星・観測)
  const ve = (o.T1 && o.GEO) ? (() => { const zr = Z.venusEarthRow('I', {}, o), r98 = repOf(0.98, o), fV = respFactor('Venus', 'obs');
    return { inf: [r98.earthTideInfOverRes, zr.rInf * fV], mean: [r98.earthTideMeanOverRes, zr.rMean * fV], eg: [r98.egMaxOverRes, zr.eg[zr.eg.length - 1].ratio * fV], perp: [r98.venusPerpOverBg, zr.perpOverBg] }; })() : null;
  // ⑫ 閉じた形の範囲 = 第353便zk の uBand(格子 61 点 + 二分)を走らせ直した範囲(作り R・6 組 —— 格子で切った端は除く)
  const band = DECL.modes.flatMap((m) => DECL.k2qModes.map((q) => { const B = Z.uBand('I', { mode: m, k2q: q }, o).ranges[0] || null, g = uRange('R', { mode: m, k2q: q }, o);
    return { mode: m, k2q: q, grid: B, lo: g.lo, hi: g.hi }; }));
  // ⑬ 範囲の両端は k₂/Q(共通)に比例(主の作り・置き方 3)
  const kq = DECL.modes.map((m) => { const a = uRange('M', { mode: m, k2q: 1e-3 }, o), b = uRange('M', { mode: m, k2q: 1e-1 }, o); return { mode: m, lo: b.lo / a.lo, hi: b.hi / a.hi }; });
  return { xR, xJ, t3, lin, sS, uR, uO, uZF, omPl, resp, cr2, hostNone, omSat, ve, band, kq };
}
export function pureGates(S) {
  const r9 = (p) => rel(p[0], p[1]) <= 1e-9;
  return {
    xRsame: S.xR.length === 60 && S.xR.every((r) => rel(r.mine, r.zk) <= 1e-9),
    xJson: S.xJ.length === 60 && S.xJ.every((r) => rel(r.mine, r.json) <= 1e-9),
    t3Json: S.t3.length === 6 && S.t3.every((r) => r.json && rel(r.json.hi, r.mine.hi) <= 1e-9 && (r.json.loClipped || rel(r.json.lo, r.mine.lo) <= 1e-9) && r.json.hiEdgeBody === r.mine.hiBody && (r.json.loClipped || r.json.loEdgeBody === r.mine.loBody)),
    invU: S.lin.every((r) => rel(r.r, 2) <= 1e-9),
    uVO2b: rel(S.uR, S.uZF) <= 1e-9 && rel(S.uO / S.uR, S.sS) <= 1e-9 && S.sS > 1,
    planetsO2b: S.omPl.length === 8 && S.omPl.every((r) => r.d <= 1e-9),
    respRateMult: S.resp.every((r) => r.viaC !== null && rel(r.mine, r.viaCcorr) <= 1e-9),
    altCR2: rel(S.cr2, 0.01) <= 1e-9,
    hostNone: S.hostNone.every((r) => rel(r.mine, r.zk) <= 1e-9),
    omSat: S.omSat.every((r) => r.d <= 1e-9),
    venusEarthZk: S.ve !== null && r9(S.ve.inf) && r9(S.ve.mean) && r9(S.ve.eg) && r9(S.ve.perp),
    bandLive: S.band.length === 6 && S.band.every((r) => r.grid && (r.grid.loClipped || rel(r.grid.lo, r.lo) <= 1e-9) && (r.grid.hiClipped || rel(r.grid.hi, r.hi) <= 1e-9)),
    k2qLinear: S.kq.every((r) => rel(r.lo, 100) <= 1e-9 && rel(r.hi, 100) <= 1e-9),
  };
}

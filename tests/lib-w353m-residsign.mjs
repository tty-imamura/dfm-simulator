// 第353便m(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R477):
//   **歳差の率の残り(仮の値 − 重力の側の潮汐のトルクの列)の符号が、入力と定義の幅で替わるかを数える純関数 —— 地球の残りの符号(月の道の置き方・
//   慣性モーメントの係数の置き方・質量と距離の最後の桁)・金星の極と ŝ の向きと仮の値の回る向き・火星と金星の残りを埋めるのに要る応答の係数の並び —— 診断だけ**
//   (器 tests/exp-w353m-residsign.mjs と QA behavior.residsign353m・docs.residsign353m が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便f(tideRate・dragRate・provRate・sumRow・axesOf・poleVec・cUpper —— 符号つきの和)・第352便u(tG・tB・tideAvg・gravSrcs・shapeOf・axesOf —— 重力の側の列)・
//   第352便y(gravPert・pertSteps・lastDigit —— 入力の振れ)・第352便q(candOf・structOf —— 構造の量の式の候補)・第353便c(rateMult —— (P-応) の率の倍)・
//   第352便d(poleRates)・第352便c(refAxis)・第352便b(prov・tagProv —— 仮の値)・第348便c(massOf)・第347便e(t1Table・geometry)。
//
// ■ 語: 方位の率 az = 極 p のまわりを右ねじで正の、軸の方位の速さ(″/年 —— 第352便d の poleRates)。**重力の列**は比べる列(DFM の式ではない —— 第352便u の (T-g))。
//   **残り** = 仮の値(符号つき —— 第353便f の provRate)− 重力の列(同じ極)。**埋める向き** = c > 0 の軸引きずりの方位の率が残りと同じ符号。
//   **月の道の置き方**(地球の重力の列の月の項 —— 1 公転の平均の潮汐のテンソル T = (G M ÷ a³)(3 (I − n̂n̂) ÷ 2 − I) の n̂n̂ の置き方):
//     'fixed' リポジトリの月の公転の北極そのもの(第352便u —— 傾き 5.145°・交点はリポジトリの向き)/'ecl' 黄道の面(傾き 0)/
//     'node' 傾き i のまま交点の経度を nodeDeg に回す(黄道の極のまわり —— 0° = リポジトリの向き)/
//     'avg' 交点の 1 巡(18.6 年)の平均の閉じた形: ⟨n̂n̂⟩ = cos² i ẑẑ + (sin² i ÷ 2)(I − ẑẑ)(ẑ = 黄道の極)。
//   **慣性モーメントの係数の置き方**: 'repo' H = J2 ÷ (C/MR²)(第352便u の shapeOf —— リポジトリの J2 と係数から作る)/'lit' H = 0.0032737(第330便b の器の地球の歳差の入力の
//     力学的偏平率 —— リポジトリに在る数・文献の値・未照合)。
//   **離心率の倍**(1 公転の平均の 1/r³ = (1 − e²)^(−3/2) ÷ a³)—— 'none'(第352便u の置き方 —— 円)/'repo'(月 0.0549・太陽 0.0167 —— 第330便b の器の入力・第347便b の REAL と同じ数)。
//   **ŝ の向きの置き方**(金星): 'L' 有向の角運動量(第347便e の geometry)/'N' 北半球の極(黄道の極の側を向く側 —— sign(ŝ·ẑ) ŝ)。
// ■ 言わないこと: 歳差の率が説明できたとは書かない・地球の残りの原因が分かったとは書かない。重力の側の列を DFM の結果と書かない。仮の値を合否に使わない(印つき)。
import * as F from './lib-w353f-ratesum.mjs';
import * as U from './lib-w352u-tidaldrag.mjs';
import * as Y from './lib-w352y-bgwindow.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as CR from './lib-w353c-recvradius.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353m-residsign-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = U.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const ASYR = D.ASYR;
export const vec = U.vec;
const D2R = Math.PI / 180;
const Z = Object.freeze([0, 0, 1]);

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  moonModes: Object.freeze(['fixed', 'ecl', 'node', 'avg']),
  moonLabels: Object.freeze({ fixed: 'リポジトリの月の公転の北極(固定)', ecl: '黄道の面(傾き 0)', node: '傾きのまま交点を回す', avg: '交点の 1 巡(18.6 年)の平均の閉じた形' }),
  hModes: Object.freeze(['repo', 'lit']),
  /** 力学的偏平率(第330便b の器 tests/exp-w330b-dragweight.mjs の earthPrec.H —— リポジトリに在る数・文献の値・未照合) */
  hLit: 0.0032737, hLitFrom: 'tests/exp-w330b-dragweight.mjs の earthPrec.H(文献の値・未照合)',
  eModes: Object.freeze(['none', 'repo']),
  /** 離心率(第330便b の器の earthPrec.eMoon・eSun —— 第347便b の REAL.eMoon と同じ数) */
  ecc: Object.freeze({ Moon: 0.0549, Sun: 0.0167 }),
  /** 交点の経度の格子(° —— 0 = リポジトリの向き) */
  nodeGrid: Object.freeze([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]),
  /** 最後の桁(質量はリポジトリの数 —— 第348便c の massOf の書き方から Y.lastDigit・距離は書かれた数の桁の宣言: 太陽 1.496e11 m・月 3.844e8 m) */
  aLast: Object.freeze({ Sun: 1e8, Moon: 1e5 }),
  /** 金星の極の候補・ŝ の向き・仮の値の回る向き */
  venusPoles: Object.freeze(['orbN', 'orbS', 'eclN', 'eclS', 'L']),
  venusPoleLabels: Object.freeze({ orbN: '金星の公転の北極', orbS: '金星の公転の南極', eclN: '黄道の北極', eclS: '黄道の南極', L: '基準軸 L' }),
  axisModes: Object.freeze(['L', 'N']), axisLabels: Object.freeze({ L: '有向の角運動量', N: '北半球の極' }),
  venusSenses: Object.freeze(['tide', 'anti']),
  /** 主の列の u(注目の列 0.98)と窓の下端 */
  uMain: 0.98, uGrid: Object.freeze([0.0487, 0.98]),
  /** 表 3 の天体 */
  cBodies: Object.freeze(['Mars', 'Venus', 'Earth']),
  /** 第353便f の数(文字で持つ —— 零試験の相手): 残り・要る c(u 0.98)・入力の振れの和(幅) */
  anchorF: Object.freeze({ resid: Object.freeze({ Earth: '5.50', Mars: '-0.142', Venus: '-1.54' }), cNeed: Object.freeze({ Mars: '24.4', Venus: '1.58e+3', Earth: '-967' }),
    pertSum: Object.freeze({ Earth: '0.0347', Mars: '0.00303', Venus: '1.45' }), venusAz: Object.freeze({ ecl: '-45.5', orb: '46.1', L: '258' }) }),
  /** 統括の数え直し 3 の点検の数 */
  anchor3: Object.freeze({ L: Object.freeze([0.026257, 0.008317, 0.999621]), Ltol: 5e-7, omegaG: 9.09e-16, phiVenusDeg: 0.7606 }),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 入力 ───────── */
const ctx = (o = {}) => F.ctxOf(o);
/** 月の道の n̂n̂ の置き方(3 × 3・行の順 9 個) */
export function nnOf(mode, nHat, { nodeDeg = 0, iDeg = null } = {}) {
  if (!DECL.moonModes.includes(mode)) throw new RangeError('nnOf: 置き方は ' + DECL.moonModes.join('・'));
  const n0 = unit(nHat), i0 = Math.acos(Math.max(-1, Math.min(1, dot(n0, Z)))), inc = iDeg === null ? i0 : iDeg * D2R;
  const outer = (v) => [0, 1, 2].flatMap((a) => [0, 1, 2].map((b) => v[a] * v[b]));
  if (mode === 'fixed') return outer(n0);
  if (mode === 'ecl') return outer(Z);
  if (mode === 'node') {
    const lam0 = Math.atan2(n0[1], n0[0]), lam = (nrm(crs(n0, Z)) > 1e-15 ? lam0 : 0) + nodeDeg * D2R;
    return outer([Math.sin(inc) * Math.cos(lam), Math.sin(inc) * Math.sin(lam), Math.cos(inc)]);
  }
  const c2 = Math.cos(inc) ** 2, s2h = Math.sin(inc) ** 2 / 2;   // 'avg'
  return [s2h, 0, 0, 0, s2h, 0, 0, 0, c2];
}
/** n̂n̂ を受ける 1 公転の平均の潮汐のテンソル(第352便u の tideAvg と同じ形 —— n̂n̂ の所だけ置き換え) */
export function tideOfNN(GM, a, NN) {
  const g = GM / (a * a * a), T = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const d = i === j ? 1 : 0; T[3 * i + j] = g * (1.5 * (d - NN[3 * i + j]) - d); }
  return T;
}
const eccFac = (e) => Math.pow(1 - e * e, -1.5);
/**
 * 地球の重力の側の列(比べる列)を、入力と定義の候補で数え直す(黄道の極のまわり —— ″/年)。
 * o2: moon('fixed'・'ecl'・'node'・'avg')・nodeDeg・iDeg(省けばリポジトリの傾き)・h('repo'・'lit' か数)・ecc('none'・'repo')・dMsun・dMmoon(質量の相対の振れ)・daSun・daMoon(距離の相対の振れ)。
 * 返す { az, sun, moon(月の項・太陽の項の方位の率), H, resid(仮 − 重力 —— 印つき), flip(残りの符号が既定と逆) }。
 */
export function earthGrav(o2 = {}, o = {}) {
  const { moon = 'fixed', nodeDeg = 0, iDeg = null, h = 'repo', ecc = 'none', dMsun = 0, dMmoon = 0, daSun = 0, daMoon = 0 } = o2;
  if (!DECL.eModes.includes(ecc)) throw new RangeError('earthGrav: 離心率の置き方は none・repo');
  if (!(fin(h) || DECL.hModes.includes(h))) throw new RangeError('earthGrav: h は repo・lit か数');
  const Cx = ctx(o), sh = U.shapeOf(Cx.T1, Cx.GEO, 'Earth'), ax = U.axesOf(Cx.T1, Cx.GEO, 'Earth'), H = h === 'repo' ? sh.H : h === 'lit' ? DECL.hLit : h;
  const srcs = U.gravSrcs(Cx.T1, Cx.GEO, 'Earth', 'sunMoon'), part = {};
  let az = 0;
  for (const s of srcs) {
    const isM = s.src === 'Moon', GM = s.GM * (1 + (isM ? dMmoon : dMsun)) * (ecc === 'repo' ? eccFac(DECL.ecc[s.src]) : 1), a = s.a * (1 + (isM ? daMoon : daSun));
    const NN = isM ? nnOf(moon, s.nHat, { nodeDeg, iDeg }) : nnOf('fixed', s.nHat), ds = U.tB(ax.sHat, tideOfNN(GM, a, NN), { H, omega: sh.omega, kappa: 1, sense: 'nat' });
    const r = D.poleRates(Z, ax.sHat, ds), v = r.az * ASYR; part[isM ? 'moon' : 'sun'] = v; az += v;
  }
  const P = F.provRate('Earth', {}, o), resid = P.value - az, base = P.value - F.tideRate('Earth', {}, o).az;
  return B.tagProv({ id: 'Earth', moon, nodeDeg: moon === 'node' ? nodeDeg : null, iDeg: iDeg, h, ecc, dMsun, dMmoon, daSun, daMoon, H, az, sun: part.sun, moon_: part.moon, prov: P.value, resid,
    flip: Math.sign(resid) !== Math.sign(base) }, P.provKeys);
}
/** 月の道の傾き(リポジトリ —— 黄道の極との角 °) */
export function moonIncDeg(o = {}) { const Cx = ctx(o), s = U.gravSrcs(Cx.T1, Cx.GEO, 'Earth', 'sunMoon').find((q) => q.src === 'Moon'); return Math.acos(Math.max(-1, Math.min(1, dot(unit(s.nHat), Z)))) / D2R; }
/** 地球の残りの符号を 0 にする交点の経度(二分 —— 'node' の列で残りが 0 になる角が在れば [°] の列) */
export function nodeZeros(o2 = {}, o = {}, { n = 360 } = {}) {
  const f = (d) => earthGrav({ ...o2, moon: 'node', nodeDeg: d }, o).resid, out = [];
  let pd = 0, pf = f(0);
  for (let k = 1; k <= n; k++) {
    const d = 360 * k / n, v = f(d);
    if (Math.sign(v) !== Math.sign(pf)) { let lo = pd, hi = d, flo = pf; for (let i = 0; i < 60; i++) { const m = 0.5 * (lo + hi), fm = f(m); if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m; } out.push(0.5 * (lo + hi)); }
    pd = d; pf = v;
  }
  return out;
}
/** 質量と距離の最後の桁の振れ(相対 —— 質量はリポジトリの数の書き方から・距離は宣言の桁) */
export function lastDigitRel() {
  const mS = C.massOf('Sun'), mM = C.massOf('Moon');
  return { dMsun: Y.lastDigit(mS) / mS, dMmoon: Y.lastDigit(mM) / mM, daSun: DECL.aLast.Sun / 1.496e11, daMoon: DECL.aLast.Moon / 3.844e8 };
}

/* ───────── 金星の極と ŝ の向き ───────── */
/** 金星の極のベクトル */
export function venusPole(name, o = {}) {
  const Cx = ctx(o), n = F.axesOf('Venus', o).nHat;
  if (name === 'orbN') return n; if (name === 'orbS') return scl(n, -1);
  if (name === 'eclN') return Z.slice(); if (name === 'eclS') return [0, 0, -1];
  if (name === 'L') return RC.refAxis('L', Cx.T1, Cx.GEO);
  throw new RangeError('venusPole: 極は ' + DECL.venusPoles.join('・'));
}
/** 軸の向きの置き方 'L'(ŝ)・'N'(sign(ŝ·ẑ) ŝ)の符号 */
export function axisSign(id, mode, o = {}) {
  if (!DECL.axisModes.includes(mode)) throw new RangeError('axisSign: 置き方は L・N');
  if (mode === 'L') return 1;
  const s = F.axesOf(id, o).sHat; return dot(s, Z) >= 0 ? 1 : -1;
}
/**
 * 金星の 1 行(極 pole・ŝ の向き axis・仮の値の回る向き sense・背景の倍 u・軸引きずりの向き dsense —— 主 'g2m')。
 * 軸 a = σ ŝ(σ = axisSign)・その動き σ dŝ/dt を極に投影。仮の値 = (sense 'tide' なら重力の列と同じ符号・'anti' なら逆)× 大きさ。
 * 返す { grav, drag(c 1), prov, resid, fill, cNeed, width, inWidth, closes(残りが幅の内 かつ 埋める向き), sinPole(abs(極 × 軸)) }(印つき)。
 */
export function venusRow({ pole = 'orbN', axis = 'L', sense = 'tide', u = DECL.uMain, dsense = 'g2m' } = {}, o = {}) {
  if (!DECL.venusSenses.includes(sense)) throw new RangeError('venusRow: 仮の値の回る向きは tide・anti');
  const p = venusPole(pole, o), sg = axisSign('Venus', axis, o), s = F.axesOf('Venus', o).sHat, a = scl(s, sg);
  const g = F.tideRate('Venus', { pole: p }, o), d = F.dragRate('Venus', { u, sense: dsense, pole: p }, o);
  const pr = (ds) => { const r = D.poleRates(p, a, scl(ds, sg)); return r === null ? null : r.az * ASYR; };
  const grav = pr(g.ds), drag = pr(d.ds), P = F.provRate('Venus', { venusSense: 'tide' }, o), mag = P.abs;
  const prov = (sense === 'tide' ? 1 : -1) * Math.sign(grav) * mag, resid = prov - grav, w = widthOf('Venus', o);
  const fill = fin(drag) && drag !== 0 ? Math.sign(resid) === Math.sign(drag) : null, inWidth = Math.abs(resid) <= w;
  return B.tagProv({ id: 'Venus', pole, axis, sense, u, dsense, grav, drag, prov, resid, fill, cNeed: fin(drag) && drag !== 0 ? resid / drag : null, width: w, inWidth, closes: inWidth && fill === true,
    sinPole: nrm(crs(p, a)) }, P.provKeys);
}

/* ───────── 幅(第353便f の表 4 と同じ作り)───────── */
/** 入力の振れの和(第352便y の gravPert の各段の上下の振れの大きい方の和 —— 第353便f の器の widthOf と同じ作り)+ 仮の値の幅(σ・sigmaGiven) */
export function widthParts(id, o = {}) {
  const Cx = ctx(o), base = Y.gravPert(Cx.T1, Cx.GEO, id).az, neg = (st) => Object.fromEntries(Object.entries(st).map(([k, v]) => [k, -v]));
  const pert = Y.pertSteps(Cx.T1, Cx.GEO, id).reduce((t, [, st]) => t + Math.max(Math.abs(Y.gravPert(Cx.T1, Cx.GEO, id, st).az - base), Math.abs(Y.gravPert(Cx.T1, Cx.GEO, id, neg(st)).az - base)), 0);
  const e = B.prov(F.DECL.provKeys[id]), sig = fin(e.sigma) ? e.sigma : fin(e.sigmaGiven) ? e.sigmaGiven : 0;
  return { pert, sig, width: pert + sig };
}
export function widthOf(id, o = {}) { const Cx = ctx(o), ck = 'w|' + id; if (Cx.cache[ck] === undefined) Cx.cache[ck] = widthParts(id, o).width; return Cx.cache[ck]; }

/* ───────── 要る応答の係数の並び ───────── */
/**
 * 天体 1 つの「残りを埋めるのに要る c」(第353便f の sumRow の cNeed —— u・極は家の極)と、構造の量の式の候補(第352便q の candOf —— (ウ′) uJ・(ウ) u・(イ) i)・
 * (P-応) の率の倍(第353便c の rateMult —— 観測半径・文献の慣性モーメントの係数)。残りが幅の内なら upperOnly(上限としてだけ)。
 */
export function cRow(id, { u = DECL.uMain, venusSense = 'tide' } = {}, o = {}) {
  const Cx = ctx(o), r = F.sumRow(id, { u, venusSense }, o), w = widthOf(id, o), K = Q.candOf(Cx.T1, Cx.GEO, id, { bg: 'Np', axis: 'L', tSrc: 0, u: 1 });
  return B.tagProv({ id, u, venusSense: r.venusSense ?? null, resid: r.resid, cNeed: r.cNeed, cMax: r.cMax, fill: r.fillSense, width: w, inWidth: Math.abs(r.resid) <= w, upperOnly: Math.abs(r.resid) <= w,
    cUpperW: F.cUpper(r.drag1, Math.abs(r.resid), w), uJ: K.uJ, uC: K.u, iC: K.i, mObs: CR.rateMult(id, { ref: 'obs' }), mRule: CR.rateMult(id, { ref: 'rule' }) }, r.provKeys);
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO, cache: {} };
  // ① 既定(fixed・repo・円)= 第353便f の tideRate(地球 —— 黄道の極)
  const eg0 = earthGrav({}, o), f0 = F.tideRate('Earth', {}, o).az, gravErr = Math.abs(eg0.az / f0 - 1);
  // ② 'avg' の閉じた形 = 'node' の交点 72 点の平均(方位の率は dŝ/dt に線形 —— テンソルの平均と率の平均は同じ)
  let mean = 0; const N = 72; for (let k = 0; k < N; k++) mean += earthGrav({ moon: 'node', nodeDeg: 360 * (k + 0.5) / N }, o).az / N;
  const avg = earthGrav({ moon: 'avg' }, o).az, avgErr = Math.abs(avg / mean - 1);
  // ③ 'node' 0° = 'fixed'・'avg' の傾き 0 = 'ecl'・n̂n̂ の跡 = 1
  const node0 = Math.abs(earthGrav({ moon: 'node', nodeDeg: 0 }, o).az / eg0.az - 1), avg0 = Math.abs(earthGrav({ moon: 'avg', iDeg: 0 }, o).az / earthGrav({ moon: 'ecl' }, o).az - 1);
  const tr = ['fixed', 'ecl', 'avg'].map((m) => { const M = nnOf(m, [0.1, -0.2, 0.97]); return Math.abs(M[0] + M[4] + M[8] - 1); });
  // ④ tideOfNN(n̂n̂ = 外積)= 第352便u の tideAvg
  const nT = unit([0.2, -0.1, 0.95]), tA = tideOfNN(3.1, 2.2, nnOf('fixed', nT)), tB = U.tideAvg(3.1, 2.2, nT), tideErr = Math.max(...tA.map((x, i) => Math.abs(x - tB[i]))) / U.fro(tB);
  // ⑤ 金星: 既定(orbN・L・tide)= 第353便f の sumRow の resid・drag・極を反転すると方位の率が反転・ŝ を反転しても方位の率は同じ
  const v0 = venusRow({}, o), fv = F.sumRow('Venus', { u: DECL.uMain }, o), vErr = Math.max(Math.abs(v0.resid / fv.resid - 1), Math.abs(v0.drag / fv.drag - 1), Math.abs(v0.grav / fv.tide - 1));
  const vS = venusRow({ pole: 'orbS' }, o), vN = venusRow({ axis: 'N' }, o), vES = venusRow({ pole: 'eclS' }, o), vE = venusRow({ pole: 'eclN' }, o);
  const flipPole = Math.max(Math.abs(vS.grav + v0.grav) / Math.abs(v0.grav), Math.abs(vS.drag + v0.drag) / Math.abs(v0.drag), Math.abs(vES.grav + vE.grav) / Math.abs(vE.grav));
  const flipAxis = Math.max(Math.abs(vN.grav - v0.grav) / Math.abs(v0.grav), Math.abs(vN.drag - v0.drag) / Math.abs(v0.drag));
  const vAz = { ecl: vE.grav, orb: v0.grav, L: venusRow({ pole: 'L' }, o).grav };
  // ⑥ 幅(入力の振れの和)= 第353便f の表 4 の数・要る c = 第353便f の cNeed
  const pert = Object.fromEntries(F.DECL.provBodies.map((id) => [id, widthParts(id, o).pert]));
  const cNeed = Object.fromEntries(DECL.cBodies.map((id) => [id, cRow(id, {}, o).cNeed]));
  const resid = Object.fromEntries(F.DECL.provBodies.map((id) => [id, F.sumRow(id, { u: DECL.uMain }, o).resid]));
  // ⑦ 統括の数え直し 3(基準軸 L・ω_G・金星の φ —— 規則の半径)
  const L = RC.refAxis('L', T1, GEO), Lerr = Math.max(...L.map((x, i) => Math.abs(x - DECL.anchor3.L[i]))), omegaG = nrm(F.bgOf({ u: 1 }, o));
  const phiV = Math.acos(Math.max(-1, Math.min(1, dot(scl(unit(F.localOf('Venus', {}, o)), -1), L)))) / D2R;
  // ⑧ 振れの算術: 質量の振れ dM は太陽・月の項をそれぞれ (1 + dM) 倍・距離の振れ da は (1 + da)^(−3) 倍・離心率は (1 − e²)^(−3/2) 倍
  const eM = earthGrav({ dMmoon: 1e-3 }, o), eA = earthGrav({ daSun: 1e-3 }, o), eE = earthGrav({ ecc: 'repo' }, o);
  const arith = [Math.abs(eM.moon_ / eg0.moon_ / 1.001 - 1), Math.abs(eA.sun / eg0.sun * 1.001 ** 3 - 1), Math.abs(eE.moon_ / eg0.moon_ / eccFac(0.0549) - 1), Math.abs(eE.sun / eg0.sun / eccFac(0.0167) - 1)];
  const hLin = Math.abs(earthGrav({ h: 2 * eg0.H }, o).az / eg0.az / 2 - 1);
  // ⑨ 拒否
  const rej = [() => nnOf('x', Z), () => earthGrav({ ecc: 'x' }, o), () => earthGrav({ h: 'x' }, o), () => venusPole('x', o), () => axisSign('Venus', 'x', o), () => venusRow({ sense: 'x' }, o)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { gravErr, avgErr, node0, avg0, tr, tideErr, vErr, flipPole, flipAxis, vAz, pert, cNeed, resid, Lerr, omegaG, phiV, arith, hLin, iMoon: moonIncDeg(o), rejects: rej };
}
export function pureGates(S) {
  const A = DECL.anchorF, p3 = (x) => Number(x).toPrecision(3);
  return {
    gravIsF: S.gravErr < 1e-12,
    avgIsMean: S.avgErr < 1e-12 && S.node0 < 1e-12 && S.avg0 < 1e-12 && S.tr.every((e) => e < 1e-12),
    tideIsU: S.tideErr < 1e-14,
    venusIsF: S.vErr < 1e-12,
    poleAxisSym: S.flipPole < 1e-12 && S.flipAxis < 1e-12 && Object.entries(A.venusAz).every(([k, v]) => p3(S.vAz[k]) === v),
    widthIsF: Object.entries(A.pertSum).every(([k, v]) => p3(S.pert[k]) === v),
    cNeedIsF: Object.entries(A.cNeed).every(([k, v]) => p3(S.cNeed[k]) === v) && Object.entries(A.resid).every(([k, v]) => p3(S.resid[k]) === v),
    anchor3: S.Lerr < DECL.anchor3.Ltol && Math.abs(S.omegaG / DECL.anchor3.omegaG - 1) < 1e-12 && Number(S.phiV).toFixed(4) === DECL.anchor3.phiVenusDeg.toFixed(4),
    pertArith: S.arith.every((e) => e < 1e-12) && S.hLin < 1e-12 && Number(S.iMoon).toFixed(3) === '5.145',
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

// 第341便d(原仮定者の回答(2026-11-17 —— 第140報の回答)「扁平の則は、赤道面から離れた際の、軸引きずりの軸の傾きに効くのではないか。扁平で傾きが強くなるので、回転引きずりも強くなる」・
//   原仮定者の指示(2026-11-12 —— 第135報)の回転引きずりの条件(引きずり半径 R_d・扁平の則 R_eq = R_d/(1 − f_flat)^{1/3}・一様厚みの区間)・
//   原仮定者の補足(2026-11-18 —— 第141報)「引きずり自体は、座標変換なので熱を発生しない。潮汐力などで軸を傾ける力が加わると、ジャイロトルクが発生し、動かなかった分が熱になる。
//   ジャイロトルクの向きは90度ズレるので、継続した力が加わり続ける」・統括の検証項目 R367):
//   **回転引きずりの 3 つの診断の純関数**(段 oblatering-341d —— 器 tests/exp-w341d-oblatering.mjs・正本 tests/out/oblatering-341d.json・収束の表 tests/data-w341d-oblatering-converge.json)。
//   **探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない(第340便d・第338便d・第338便b・第337便i の lib は呼ぶだけ)。html を読まない・ネットへ取りに行かない・乱数を使わない。
//
// ■ T1 扁平の源の区切りを細かく: 第340便d の T4 の部位の和(源 = 体積を保つ回転楕円体・R_d = 1・赤道の半径 R_eq = (1 − f)^{−1/3})を、球の座標の求積(層 nr × 角 nμ × 方位 nφ)に置き直し、
//   区切りを 960 → 3840 → 15360 → 61440 点と細かくする。並び 5(focus = 等しい体積の層 + 受け手の向き〔赤道・方位 0〕の近くを細かくする角の写像 —— 主/surf = 等しい体積の層・一様の角/
//   uni = 一様の半径の層/ang = 層を固定して角だけ細かく/lay = 角を固定して層だけ細かく)と、第340便d の 960 点(円柱の区切り —— 起点)。
//   読む量: (i) 球の源(f = 0)の部位の和 ÷ 点の源(第340便d の T1 の場)—— 場の強さ・寄せる力(corV・corS・drag90)/(ii) 扁平の源 ÷ 球の源(同じ並び・同じ区切り)—— 場の強さ・
//   軸の傾き(場の向きの、源の軸の逆向きからの角 —— atan2)・寄せる力。隣どうしの差と Richardson の外挿で「収束した桁」と「区切りで消える差/細かくしても残る差」を分ける。
// ■ T2 R_eq の内と外で落ち方を変える型: 鉛直へ位置を運ぶ場 d = −λ s r (R_eq/ρ) Z(z/R_eq) M(r) k̂(第339便a のアプリの型〔slice —— 帯を入力として与えた型〕と同じ作用の型)で、
//   Z(t) = t/(1 + |t|^m)^{(1 + p)/m}(内 = 高さに比例〔剛体の捩れ〕・外 = |t|^{−p} で落ちる・m = 境の滑らかさ)・M(r) = (r/r_ref)^{−k}(k = 0 か第340便d の経路の型の z を固定した距離のべき)。
//   (i) 一様厚みの区間(傾きが 1e7 年で e 分の 1 になる高さ z* の、環の中心どうしの距離のべき)(ii) 帯の内だけで効くか(z* ÷ R_eq・外 ÷ 内の率)(iii) 第337便i の環の物差しと 4 惑星の尺度。
// ■ T3 環の口の熱を補足 1 で読み直す: 第340便d の口の熱 τ_p(Ω_行き先 − n)の 20 行を、(a) 一緒に動く座標変換の分(熱 0・仕事でもない)/(b) 傾ける力のうち動いた分(力学の仕事)/
//   (c) 動かなかった分(熱 —— 非負。負なら「傾ける力の仕事のノブ」の行へ)に分ける。AN803 の A の列(主)と B の列(比べる列)。
// ■ T4 90° の 2 つの読みを 4 天体で: 時間が無いので次の便(報告に書く)。
// ■ 言わないこと: 扁平で回転引きずりが強くなると分かったとは書かない(この区切り・このノブの組では、の表と収束した桁)。一様厚みが導けたとは書かない。負の熱が解消したとは書かない。
//   環が薄い理由が分かったとは書かない。光速を超えるかどうかを判定に使わない。文献の値は未照合。薄い角は atan2(|外積|, 内積)。
import { muOf } from './lib-w338b-bevelknob.mjs';
import { gyroRow, fieldOmega, spheroidParts, angleAtan2, DECL as D340D } from './lib-w340d-gyropath.mjs';
import { k4Sets, dlnAFast, srcOf, nOf, centerKm, LIT as LIT338D, DECL as D338D, SETS } from './lib-w338d-ringbook.mjs';
import { colAmp } from './lib-w338b-bevelknob.mjs';
import { sourceOf, rdOf, ringSys, pointsOf, ringRow, ringJudge, planetSys, planetRow, planetScaleRatios, scalePlanetRow } from './lib-w337i-rotring.mjs';
import { shareRing } from './lib-w340d-gyropath.mjs';

export const LIB_VERSION = 'w341d-oblatering-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const YR = 365.25 * 86400, G = 6.6743e-11;
/** 部位の和の内側の環(点 × 受け手の部位)は四則と平方根だけで書く(p = 2 は 1/r² —— 冪の関数を通さない)。平方根は読み込みの時の関数を持つ(第338便c の ulp の揺らしは部位の和の外の関数に掛かる —— 四則と正しく丸める平方根は Node の版で変わらない) */
const SQRT = Math.sqrt, POW = Math.pow;
const invPow = (r2, p) => (p === 2 ? 1 / r2 : POW(r2, -p / 2));

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const ARRS = Object.freeze(['focus', 'surf', 'uni', 'ang', 'lay']);
export const ARR_JA = Object.freeze({
  focus: 'focus —— 等しい体積の層(s = t^(1/3))+ 角の写像で受け手の向き(赤道・方位 0)の近くを 5 倍に細かく(主の並び)',
  surf: 'surf —— 等しい体積の層(表面の近くほど層が薄い)・一様の角(μ と方位)',
  uni: 'uni —— 一様の半径の層(重み s²)・一様の角',
  ang: 'ang —— 層を 8 に固定して角だけ細かく(等しい体積の層)',
  lay: 'lay —— 角を 16 × 30 に固定して層だけ細かく(等しい体積の層)',
  cyl340: 'cyl340 —— 第340便d の円柱の区切り(半径 6・高さ 8・方位 24 = 960 点 —— 起点)',
});
export const DECL = Object.freeze({
  t1: Object.freeze({
    /** 区切りの点の数(層 × 角 × 方位)—— 並びごと。主の並び focus と surf・uni は同じ割り(nr・nμ・nφ)で、ang は層を固定・lay は角を固定 */
    levels: Object.freeze([960, 3840, 15360, 61440]),
    dims: Object.freeze({
      focus: Object.freeze([[4, 12, 20], [8, 16, 30], [16, 24, 40], [32, 32, 60]]),
      surf: Object.freeze([[4, 12, 20], [8, 16, 30], [16, 24, 40], [32, 32, 60]]),
      uni: Object.freeze([[4, 12, 20], [8, 16, 30], [16, 24, 40], [32, 32, 60]]),
      ang: Object.freeze([[8, 8, 15], [8, 16, 30], [8, 32, 60], [8, 64, 120]]),
      lay: Object.freeze([[2, 16, 30], [8, 16, 30], [32, 16, 30], [128, 16, 30]]),
    }),
    /** focus の角の写像の強さ(φ = u − β sin u・μ = (1 − γ) v + γ v³ —— 受け手の向きで 1/(1 − β)・1/(1 − γ) 倍に細かい) */
    beta: 0.8, gamma: 0.8,
    /** 扁平率(0 = 球 —— 対照・負 = 長球 —— 対照・0.098 = 土星〔第340便d の T4 と同じ文献の値・未照合〕)・距離 ÷ 赤道半径(環の範囲 —— 1.1・1.24・1.5・1.95・2・2.27 と F 環 2.33)・高さ z/r */
    fGrid: Object.freeze([0, 0.05, 0.098, 0.2, 0.3, -0.1]), rOverReq: Object.freeze([1.1, 1.24, 1.5, 1.95, 2, 2.27, 2.33]), zOverR: Object.freeze([0.01, 0.1]), zMain: 0.01,
    /** 高さ 0.1(主の並び focus だけ)と並び surf・uni は、扁平率 0 と 0.098 だけ・並び ang・lay(層と角のどちらが効くかの診断)は扁平率 0 だけ(走行の長さ —— 主の並び focus の高さ 0.01 は扁平率の全部) */
    fSub: Object.freeze([0, 0.098]), fDiag: Object.freeze([0]),
    /** 段(既定の口)で作る区切り(960・3840)と、収束の口(--converge)で作る区切り(全部) */
    stageLevels: Object.freeze([0, 1]),
    /** 場の向きの型(h1 = 部位ごとに 2 倍角の則の主の列 q = 1・rotU = 自転で運ぶ座標の速度の重みつき和の回転〔J 固定〕)・経路の型(第340便d の corV・corS・drag90 —— h1 の場) */
    kinds: Object.freeze(['h1', 'rotU']), pathActions: Object.freeze(['corV', 'corS', 'drag90']), p: 2, recvCubeK: 2,
    /** 収束の読み: 隣どうしの差の比 ρ = d_{k−1}/d_k > 1.5 なら Richardson(Q∞ = Q_k + d_k/(ρ − 1))・収束した桁 = −log10(|d_k|/|Q_k|) の床。残る差 = |Q∞ − 1| が 3 |d_k| より大きい */
    rhoMin: 1.5, keepFactor: 3,
  }),
  t2: Object.freeze({
    /** 落ち方のべき p(外 |t|^{−p})・境の滑らかさ m・経路の型の距離のべき k(0 = アプリの型と同じ・3.5 = corV・4 = drag90 —— 第340便d の正本の z を固定した距離のべき〔p 2〕) */
    pGrid: Object.freeze([1, 2, 3]), mGrid: Object.freeze([2, 8, 32]), kGrid: Object.freeze([0, 3.5, 4]),
    /** 強さ λ の代表(第337便i の代表の組 —— 第339便a のアプリの候補と同じ 6.5606e-7)・物差しの時間 1e7 年・環の中心 5(第338便d)・距離の基準 r_ref(土星 1e8 m・太陽 1 au) */
    lambdaRef: 6.5606e-7, tYr: 1e7, centers: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']), rRefSat: 1e8, rRefSun: 1.495978707e11,
    /** 一様の物差し(局所のべき |d ln H/d ln r| ≤ 0.1 —— 第338便d と同じ)・帯の型の物差し(z* ≤ 3 R_eq かつ 外 ÷ 内の率 ≤ 0.1 —— 外 t 3・内 t 0.5) */
    uniformPow: 0.1, bandTStar: 3, bandOutIn: 0.1, tOut: 3, tIn: 0.5,
    /** 環の物差しの点(第337便i: 傾き z_max 10 m —— 文献の値・未照合の典型の厚み)・惑星 4 */
    zMax: 10, planets: Object.freeze(['merc', 'venus', 'earth', 'mars']),
  }),
  t3: Object.freeze({
    /** 口(土星の自転・ミマス)・4 天体の強さの組 2・環の中心 5 = 20 行(第340便d の portHeatRows)。座標変換の取り分 χ_a の列(第338便b の 3 列 A・B・B′ の順の分 ÷ (順 + 逆)) */
    cols: Object.freeze(['A', 'B', 'Bp']), colMain: 'A',
    /** 動いた割合 μ_m(行き先が動く割合): 土星の自転 0(第128報「自転軸は遠方宇宙に対して固定」の極限)・0.5・1/ミマス 1(軌道は動く)・0 */
    muSpin: Object.freeze([0, 0.5, 1]), muMimas: Object.freeze([1, 0]), mimasKm: 185539,
  }),
  floor: 1e-12,
});

/* ───────── T1 源の求積(球の座標 —— 回転楕円体へ写す)───────── */
/** 単位の球の求積の点(並び arr・層 nr・角 nμ・方位 nφ)を回転楕円体(R_eq = (1 − f)^{−1/3}・R_pol = (1 − f)^{2/3})へ写す。質量は体積の重み(和 1)。 */
export function quadParts(f, arr, [nr, nmu, nphi], D = DECL.t1) {
  if (!(f < 1) || !ARRS.includes(arr) || !(nr >= 1 && nmu >= 1 && nphi >= 1)) throw new RangeError('quadParts: f < 1・並び・区切り ≥ 1');
  const a = Math.pow(1 - f, -1 / 3), c = Math.pow(1 - f, 2 / 3), out = [], foc = arr === 'focus', be = foc ? D.beta : 0, ga = foc ? D.gamma : 0;
  const rs = [], ms = [], ps = [];
  for (let i = 0; i < nr; i++) { const t = (i + 0.5) / nr; if (arr === 'uni') rs.push([t, t * t / nr]); else rs.push([Math.cbrt(t), 1 / (3 * nr)]); }
  for (let k = 0; k < nmu; k++) { const v = -1 + (k + 0.5) * 2 / nmu; ms.push([(1 - ga) * v + ga * v * v * v, ((1 - ga) + 3 * ga * v * v) * 2 / nmu]); }
  for (let j = 0; j < nphi; j++) { const u = 2 * Math.PI * (j + 0.5) / nphi; ps.push([u - be * Math.sin(u), (1 - be * Math.cos(u)) * 2 * Math.PI / nphi]); }
  for (const [s, ws] of rs) for (const [mu, wm] of ms) { const st = Math.sqrt(Math.max(0, 1 - mu * mu));
    for (const [ph, wp] of ps) out.push({ y: [a * s * st * Math.cos(ph), a * s * st * Math.sin(ph), c * s * mu], m: ws * wm * wp }); }
  const M = out.reduce((t, q) => t + q.m, 0); for (const q of out) q.m /= M;
  const I = out.reduce((t, q) => t + q.m * (q.y[0] * q.y[0] + q.y[1] * q.y[1]), 0);
  return { parts: out, Req: a, Rpol: c, I, n: out.length };
}
/** 第340便d の区切り(起点 —— 960 点の円柱の区切り)を同じ形で */
export function cylParts(f) { const s = spheroidParts(f); return { parts: s.parts, Req: s.Req, Rpol: s.Rpol, I: s.I, n: s.parts.length }; }

const MU1 = muOf(1);
/** h1(主の列 q = 1)の場 —— 第338b の twistAxis(ŝ = ẑ・q = 1)を展開した形(純関数の場面で twistAxis と照らす): −s⊥ + √2 cos el s∥ */
function h1At(d) { const r = nrm(d), ux = d[0] / r, uy = d[1] / r, uz = d[2] / r, pz = uz, c = Math.sqrt(Math.max(0, 1 - pz * pz)), k = MU1 * c * pz;
  return [-(0 - pz * ux) + k * ux, -(0 - pz * uy) + k * uy, -(1 - pz * uz) + k * uz]; }
export const h1Unit = (d) => h1At(d);
/** 部位の和の場(h1 か rotU —— 第340便d の spheroidField と同じ型・memo つき): 同じ点を何度も問う受け手の部位の格子のために、点の文字列で覚える */
export function partsField(src, kind, { p = DECL.t1.p, h = 1e-6, Iref = null } = {}) {
  const P = src.parts, n = P.length, Y0 = new Float64Array(n), Y1 = new Float64Array(n), Y2 = new Float64Array(n), Mm = new Float64Array(n);
  for (let i = 0; i < n; i++) { Y0[i] = P[i].y[0]; Y1[i] = P[i].y[1]; Y2[i] = P[i].y[2]; Mm[i] = P[i].m; }
  const memo = new Map();
  if (kind === 'h1') {
    const F = (x) => { let o0 = 0, o1 = 0, o2 = 0;
      for (let i = 0; i < n; i++) { const d0 = x[0] - Y0[i], d1 = x[1] - Y1[i], d2 = x[2] - Y2[i], r2 = d0 * d0 + d1 * d1 + d2 * d2, r = SQRT(r2), uz = d2 / r, ux = d0 / r, uy = d1 / r;
        const c = SQRT(Math.max(0, 1 - uz * uz)), k = MU1 * c * uz, w = Mm[i] * invPow(r2, p);
        o0 += w * (uz * ux + k * ux); o1 += w * (uz * uy + k * uy); o2 += w * (-(1 - uz * uz) + k * uz); }
      return [o0, o1, o2]; };
    return (x) => { const key = x[0] + ',' + x[1] + ',' + x[2]; let v = memo.get(key); if (!v) { v = F(x); memo.set(key, v); } return v; };
  }
  if (kind === 'rotU') {
    const jk = Iref ? Iref / src.I : 1;
    const U = (x) => { let o0 = 0, o1 = 0; for (let i = 0; i < n; i++) { const d0 = x[0] - Y0[i], d1 = x[1] - Y1[i], d2 = x[2] - Y2[i], w = jk * Mm[i] * invPow(d0 * d0 + d1 * d1 + d2 * d2, p); o0 -= w * Y1[i]; o1 += w * Y0[i]; } return [o0, o1, 0]; };
    const F = (x) => { const J = [0, 1, 2].map((j) => { const e = [0, 0, 0]; e[j] = h; const a = U([x[0] + e[0], x[1] + e[1], x[2] + e[2]]), b = U([x[0] - e[0], x[1] - e[1], x[2] - e[2]]); return scl(sub(a, b), 1 / (2 * h)); });
      return scl([J[1][2] - J[2][1], J[2][0] - J[0][2], J[0][1] - J[1][0]], 0.5); };
    return (x) => { const key = x[0] + ',' + x[1] + ',' + x[2]; let v = memo.get(key); if (!v) { v = F(x); memo.set(key, v); } return v; };
  }
  throw new RangeError('partsField: 型 ' + kind);
}
const pointH1 = (x) => fieldOmega(x, { q: 1, p: DECL.t1.p });
/** 受け手の位置(距離 ÷ 赤道半径・高さ z/r)の 1 点の量: 場の強さ・軸の傾き(源の軸の逆向きからの角)・経路の型の寄せる力 */
export function probe(field, Req, rOverReq, zOverR, D = DECL.t1) {
  const r = rOverReq * Req, se = zOverR, ce = Math.sqrt(1 - se * se), x = [r * ce, 0, r * se], o = { field: {}, pull: {} };
  for (const k of Object.keys(field.kinds)) { const v = field.kinds[k](x); o.field[k] = { mag: nrm(v), axisTilt: angleAtan2(v, [0, 0, -1]), v }; }
  for (const a of D.pathActions) { const g = gyroRow({ action: a, q: 1, p: D.p, body: 'sphere', zOverR, r, field: field.path, cubeK: D.recvCubeK }); o.pull[a] = g.pull; }
  return o;
}
/** 点の源(第340便d の T1 の場)の同じ量 */
export function probePoint(Req, rOverReq, zOverR, D = DECL.t1) {
  return probe({ kinds: { h1: pointH1 }, path: pointH1 }, Req, rOverReq, zOverR, D);
}
/** 1 つの並び・区切りで、扁平率ごとの源の場を作る(球の源の I で rotU を J 固定) */
export function sourcesAt(arr, level, fList, D = DECL.t1) {
  const mk = (f) => (arr === 'cyl340' ? cylParts(f) : quadParts(f, arr, D.dims[arr][level], D));
  const s0 = mk(0), out = {};
  for (const f of fList) { const s = f === 0 ? s0 : mk(f), h1 = partsField(s, 'h1'), rotU = partsField(s, 'rotU', { Iref: s0.I });
    out[f] = { src: s, field: { kinds: { h1, rotU }, path: h1 } }; }
  return out;
}
/** 区切りの 1 段の行: 扁平率 × 距離 × 高さ(高さ 0.1 は fSub だけ)—— 比は同じ並び・同じ区切りの球の源に対して(f = 0 は点の源に対して) */
export function levelRows(arr, level, fList, zList, D = DECL.t1) {
  const S = sourcesAt(arr, level, fList.includes(0) ? fList : [0, ...fList], D), out = [];
  const nPts = S[0].src.n;
  for (const z of zList) { const fs = z === D.zMain ? fList : fList.filter((f) => D.fSub.includes(f));
    for (const rr of D.rOverReq) {
      const pt = probePoint(S[0].src.Req, rr, z, D);
      // 比べる位置は扁平の源の赤道半径で測った同じ点(第340便d の T4 と同じ —— 球の源もその点で問う)
      for (const f of fs) { const sph = probe(S[0].field, S[f].src.Req, rr, z, D), o = f === 0 ? sph : probe(S[f].field, S[f].src.Req, rr, z, D), row = { arr, level, n: nPts, f, rOverReq: rr, zOverR: z, field: {}, pull: {} };
        for (const k of D.kinds) { const a = o.field[k], b = sph.field[k];
          row.field[k] = { magRatio: a.mag / b.mag, axisTiltRatio: b.axisTilt > 0 ? a.axisTilt / b.axisTilt : null, tiltFromSphere: angleAtan2(a.v, b.v) }; }
        for (const a of D.pathActions) row.pull[a] = { pull: o.pull[a], pullSphere: sph.pull[a], ratio: sph.pull[a] ? o.pull[a] / sph.pull[a] : null };
        if (f === 0) { row.vsPoint = { magH1: sph.field.h1.mag / pt.field.h1.mag, tiltH1: angleAtan2(sph.field.h1.v, pt.field.h1.v) };
          for (const a of D.pathActions) row.vsPoint[a] = pt.pull[a] ? sph.pull[a] / pt.pull[a] : null; }
        out.push(row); } } }
  return out;
}
/** 収束の読み(区切りの列 Q_0..Q_K): 隣どうしの差・比 ρ・Richardson の外挿・収束した桁・区切りで消える差(|Q_0 − Q∞|)と残る差(|Q∞ − 1|) */
export function convergeOf(qs, D = DECL.t1) {
  const ok = qs.every((x) => fin(x)); if (!ok || qs.length < 2) return { qs, ok: false };
  const d = qs.slice(1).map((x, i) => x - qs[i]), K = qs.length - 1, dk = d[d.length - 1], dk1 = d.length > 1 ? d[d.length - 2] : null;
  const rho = dk1 !== null && dk !== 0 ? dk1 / dk : null, rich = rho !== null && rho > D.rhoMin ? qs[K] + dk / (rho - 1) : null;
  const best = rich !== null ? rich : qs[K], last = Math.abs(dk) + (rich !== null ? Math.abs(rich - qs[K]) : 0);
  const digits = qs[K] !== 0 && dk !== 0 ? Math.max(0, Math.floor(-Math.log10(Math.abs(dk) / Math.abs(qs[K])))) : dk === 0 ? 15 : 0;
  const remain = Math.abs(best - 1), vanish = Math.abs(qs[0] - best);
  return { qs, ok: true, diffs: d, rho, richardson: rich, best, digits, remain, vanish, remainKept: remain > D.keepFactor * last, signStable: qs.slice(-2).every((x) => Math.sign(x) === Math.sign(best)) };
}

/* ───────── T2 R_eq の内と外で落ち方を変える型 ───────── */
/** 高さの形 Z(t)(t = z/R_eq): slice = 帯を入力として与えた型(|t| ≤ 1 で t・外は 0 —— 第339便a のアプリの型)/fall = t/(1 + |t|^m)^{(1 + p)/m}(落ち方から帯が出るかを見る型) */
export function zShape(t, spec) {
  if (spec.prof === 'slice') return Math.abs(t) <= 1 ? t : 0;
  if (spec.prof === 'fall') { const { p, m } = spec; if (!(p > 0 && m > 0)) throw new RangeError('zShape: p > 0・m > 0'); return t / Math.pow(1 + Math.pow(Math.abs(t), m), (1 + p) / m); }
  throw new RangeError('zShape: 型 ' + spec.prof);
}
/** 単位の高さあたりの率 Z(t)/t(t → 0 で 1) */
export const zRate = (t, spec) => (t === 0 ? 1 : zShape(t, spec) / t);
/** 位置を運ぶ場の効果(第337便i の ratesOn の型 { kind:'vel', d })—— d = −λ s r (R_eq/ρ) Z(z/R_eq) M(r) k̂ */
export function fallEffect(src, spec, { lambda = 1, rRef } = {}) {
  const Req = rdOf(src, 'Req'), s = src.s, k = src.axis, kk = spec.k || 0;
  return { kind: 'vel', d: (x) => { const z = dot(x, k), rho = nrm(sub(x, scl(k, z))), r = nrm(x), M = kk === 0 ? 1 : Math.pow(r / rRef, -kk);
    return scl(k, -lambda * s * r * (Req / rho) * zShape(z / Req, spec) * M); }, meta: { Req, s } };
}
/** 一様厚みの読み: 傾きが T で e 分の 1 になる高さ z*(率 λ s M(r) Z(t)/t の T 倍が 1)—— 環の中心ごと(z ≪ r で r/ρ = 1 と置く・閉じた式) */
export function tStarOf(spec, A) {
  if (!(A > 0)) return null;
  if (spec.prof === 'slice') return A >= 1 ? 1 : null;   // 帯の内は一様の率・外は 0 —— 帯の縁 1(A < 1 なら薄くならない)
  if (A <= 1) return null;
  return Math.pow(Math.pow(A, spec.m / (1 + spec.p)) - 1, 1 / spec.m);
}
export function t2Specs(D = DECL.t2) {
  const out = [];
  for (const k of D.kGrid) { out.push({ key: 'slice|k' + k, prof: 'slice', k, given: true });
    for (const p of D.pGrid) for (const m of D.mGrid) out.push({ key: 'fall|p' + p + '|m' + m + '|k' + k, prof: 'fall', p, m, k, given: false }); }
  return out;
}
/** (i)(ii): 環の中心ごとの z*・厚み 2 z*・局所の距離のべき・帯の型かどうか */
export function uniformRow(spec, D = DECL.t2) {
  const sat = sourceOf('saturn'), Req = rdOf(sat, 'Req'), T = D.tYr * YR, lam = D.lambdaRef;
  const rows = D.centers.map((c) => { const r = centerKm(c) * 1e3, M = spec.k ? Math.pow(r / D.rRefSat, -spec.k) : 1, A = lam * Math.abs(sat.s) * M * T, ts = tStarOf(spec, A);
    return { key: c, r, A, tStar: ts, H: ts === null ? null : 2 * ts * Req }; });
  const pows = []; for (let i = 1; i < rows.length; i++) { const a = rows[i - 1], b = rows[i]; pows.push(a.H && b.H ? Math.log(b.H / a.H) / Math.log(b.r / a.r) : null); }
  const allThin = rows.every((x) => x.H !== null), uniform = allThin && pows.every((x) => x !== null && Math.abs(x) <= D.uniformPow);
  const outIn = zRate(D.tOut, spec) / zRate(D.tIn, spec), tMax = allThin ? Math.max(...rows.map((x) => x.tStar)) : null;
  return { key: spec.key, prof: spec.prof, p: spec.p || null, m: spec.m || null, k: spec.k, given: spec.given, Req, rows, pows, allThin, uniform, outIn, tStarMax: tMax,
    bandLike: allThin && tMax <= D.bandTStar && outIn <= D.bandOutIn };
}
/** (iii): 第337便i の環の物差し(中心 5・傾き z_max 10 m)で要る λ と、同じ λ の 4 惑星の尺度の比(源は太陽 —— 同じ型) */
export function judgeRow(spec, D = DECL.t2) {
  const sat = sourceOf('saturn'), sun = sourceOf('sun'), eS = fallEffect(sat, spec, { lambda: 1, rRef: D.rRefSat }), Req = eS.meta.Req;
  const rows = D.centers.map((c) => { const sys = ringSys(sat, { r: centerKm(c) * 1e3, zMax: D.zMax }); return Object.assign({ key: c }, ringRow(sys, eS, pointsOf(sys, Req))); });
  const J = ringJudge(rows), out = { key: spec.key, ring: { thin: J.thin, why: J.why || null, lambdaNeed: J.lambdaNeed, pass: J.pass === undefined ? null : J.pass, kepler: J.kepler === undefined ? null : J.kepler, drift: J.drift === undefined ? null : J.drift }, planets: null };
  if (J.thin) { const eP = fallEffect(sun, spec, { lambda: 1, rRef: D.rRefSun }), RqS = eP.meta.Req, per = {};
    for (const pk of D.planets) { const sys = planetSys(pk), u = planetRow(sys, eP, pointsOf(sys, RqS), RqS), r = scalePlanetRow(u, J.lambdaNeed), sr = planetScaleRatios(sys, r);
      per[pk] = { scaleRatios: sr, maxRatio: Math.max(...Object.values(sr)), inside: Object.values(sr).every((x) => x <= 1) }; }
    out.planets = { per, allInside: Object.values(per).every((x) => x.inside), worst: Math.max(...Object.values(per).map((x) => x.maxRatio)) }; }
  return out;
}

/* ───────── T3 環の口の熱を補足 1 で読み直す ───────── */
/** 20 行(口 2 × 組 2 × 中心 5): 旧い口の熱 Q = τ_p(Ω_行き先 − n)を |τ_p| n で割った q = sgn(τ_p)(Ω/n − 1)を、
 *  (a) 座標変換の分 χ_a q(熱 0・仕事でもない —— χ_a = 順の分 ÷ (順 + 逆)〔第338便b の列〕・B の列〔AN803 の比べる列 —— 引きずりは全部熱 0〕では χ_a = 1)/
 *  (b) 傾ける力の分のうち動いた分 (1 − χ_a) sgn(τ_p)(μ_m Ω/n − 1)(環の軌道の変化と、行き先の動いた分の仕事)/
 *  (c) 動かなかった分 (1 − χ_a)(1 − μ_m) sgn(τ_p) Ω/n(熱 —— 非負。負なら「傾ける力の仕事のノブ」〔源の側が固定を保つための仕事〕の行)に分ける。a + b + c = q(帳簿の閉じ)。
 *  物理の率: 単位の質量あたりの τ_p n = ½ n² r² |d ln a/dt|(η = 1 —— 正味のトルクを全部口へ)・区分の質量 = 2π r Δr Σ(第338便d の LIT —— 文献の値・未照合・確かさ 低) */
export function portSplitRows(sets, D = DECL.t3) {
  const sat = srcOf('saturn'), GM = G * sat.m, OmM = Math.sqrt(GM / Math.pow(D.mimasKm * 1e3, 3)), out = [];
  for (const port of ['spin', 'mimas']) { const Om = port === 'spin' ? sat.s : OmM;
    for (const k of SETS) for (const c of D338D.t1.ringCenters) {
      const r = centerKm(c) * 1e3, n = nOf(sat, r), dlnA = dlnAFast(sat, r, sets[k]), sg = -Math.sign(dlnA), q = sg * (Om / n - 1), f = shareRing(r);
      const Rg = LIT338D.regions.find((g) => g.key === c), mass = 2 * Math.PI * r * (Rg.r1 - Rg.r0) * 1e3 * Rg.sigma, unitP = 0.5 * n * n * r * r * Math.abs(dlnA);
      const cols = {};
      for (const col of D.cols) { const A = colAmp(col, f), fwd = 1, back = Math.abs(A / f), chi = fwd / (fwd + back);
        const mus = port === 'spin' ? D.muSpin : D.muMimas, byMu = {};
        for (const mu of mus) { const a = chi * q, b = (1 - chi) * sg * (mu * Om / n - 1), cc = (1 - chi) * (1 - mu) * sg * Om / n;
          byMu[String(mu)] = { a, b, c: cc, closed: Math.abs(a + b + cc - q) <= DECL.floor * Math.max(1, Math.abs(q), Om / n), heat: cc >= 0 ? cc : 0, workKnob: cc < 0 ? cc : 0, cW: cc * unitP, cWregion: cc * unitP * mass }; }
        cols[col] = { chiA: chi, byMu }; }
      // B の列(AN803 の比べる列): 引きずりは全部熱 0 —— χ_a = 1
      out.push({ port, set: k, key: c, nOverS: n / sat.s, OmDestOverN: Om / n, tauPSign: sg, qOld: q, heatSignOld: Math.sign(q), f, unitPowerWkg: unitP, regionMassKg: mass,
        colA: cols, colB: { chiA: 1, a: q, b: 0, c: 0, closed: true } }); } }
  return out;
}
/** 負の行の数と総残差(列ごと・μ_m ごと・口ごと) */
export function portSplitSummary(rows, D = DECL.t3) {
  const out = { old: { neg: rows.filter((r) => r.qOld < 0).length, n: rows.length }, colA: {}, colB: { neg: rows.filter((r) => r.colB.c < 0).length, n: rows.length } };
  for (const col of D.cols) { const by = {};
    for (const mu of [...new Set([...D.muSpin, ...D.muMimas])]) { const key = String(mu), rr = rows.filter((r) => r.colA[col].byMu[key]);
      if (!rr.length) continue;
      const per = {}; for (const port of ['spin', 'mimas']) { const pr = rr.filter((r) => r.port === port); if (!pr.length) continue;
        per[port] = { n: pr.length, neg: pr.filter((r) => r.colA[col].byMu[key].c < 0).length, sumNegW: pr.reduce((t, r) => t + Math.min(0, r.colA[col].byMu[key].cWregion), 0), sumPosW: pr.reduce((t, r) => t + Math.max(0, r.colA[col].byMu[key].cWregion), 0) }; }
      by[key] = { n: rr.length, neg: rr.filter((r) => r.colA[col].byMu[key].c < 0).length, per, closedAll: rr.every((r) => r.colA[col].byMu[key].closed) }; }
    out.colA[col] = by; }
  return out;
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① h1 の展開の形と第338便b の twistAxis(主の列 q = 1)が同じ(第340便d の fieldOmega の向き)
  { let m = 0; for (const d of [[1, 0, 0.01], [0.3, -0.7, 0.5], [0.2, 0.1, -0.9], [-1, 2, 0.001]]) { const r = nrm(d), a = scl(h1At(d), 1), b = scl(fieldOmega(d, { q: 1, p: 0 }), 1); m = Math.max(m, nrm(sub(a, b)) / nrm(b)); void r; } S.h1 = m; }
  // ② 求積の質量の和・重心・球の I(連続の 2/5 —— 区切り 3840 で 1e-2 の内)・扁平率で I が変わる(J 固定に使う)
  { const q = quadParts(0, 'surf', DECL.t1.dims.surf[1]), cm = q.parts.reduce((s, p) => [s[0] + p.m * p.y[0], s[1] + p.m * p.y[1], s[2] + p.m * p.y[2]], [0, 0, 0]);
    S.quad = { mass: Math.abs(q.parts.reduce((t, p) => t + p.m, 0) - 1), cm: nrm(cm), I: Math.abs(q.I / 0.4 - 1), n: q.n, n0: quadParts(0, 'uni', DECL.t1.dims.uni[0]).n }; }
  // ③ 球の源の比は 1(同じ並び・同じ区切り —— 扁平率 0 の行の対照)
  { const S0 = sourcesAt('surf', 0, [0]), o = probe(S0[0].field, S0[0].src.Req, 2, 0.01); S.sphereSelf = Math.abs(o.field.h1.mag / o.field.h1.mag - 1); }
  // ④ T2 の形: slice の内は t(アプリの型と同じ)・fall は t → 0 で率 1・外で |t|^{−p} の桁・連続
  { const f = { prof: 'fall', p: 2, m: 8 }; S.shape = { sliceIn: Math.abs(zShape(0.5, { prof: 'slice' }) - 0.5), sliceOut: zShape(1.5, { prof: 'slice' }), rate0: Math.abs(zRate(1e-6, f) - 1), tail: Math.abs(zShape(100, f) * Math.pow(100, 2) - 1) }; }
  // ⑤ T3 の閉じ(a + b + c = q)と B の列の熱 0
  { const qv = 0.7, sg = Math.sign(qv), Om = 1.7, chi = 0.5, mu = 0.5, q = sg * (Om - 1), a = chi * q, b = (1 - chi) * sg * (mu * Om - 1), c = (1 - chi) * (1 - mu) * sg * Om; S.splitClosed = Math.abs(a + b + c - q); }
  // ⑥ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => quadParts(1, 'focus', [1, 1, 1])), rejects(() => quadParts(0, 'x', [1, 1, 1])), rejects(() => zShape(1, { prof: 'x' })), rejects(() => zShape(1, { prof: 'fall', p: 0, m: 2 })), rejects(() => partsField({ parts: [] }, 'x'))];
  return S;
}
export function pureView(S) {
  return { h1Below1e14: S.h1 <= 1e-14, quadMassBelow1e12: S.quad.mass <= 1e-12, quadCmBelow1e12: S.quad.cm <= 1e-12, quadIBelow1e2: S.quad.I <= 1e-2, nQuad: S.quad.n, nQuad0: S.quad.n0,
    sphereSelfZero: S.sphereSelf === 0, sliceIn: S.shape.sliceIn === 0, sliceOutZero: S.shape.sliceOut === 0, rate0Below1e9: S.shape.rate0 <= 1e-9, tailBelow1e2: S.shape.tail <= 1e-2,
    splitClosedBelow1e15: S.splitClosed <= 1e-15, rejects: S.rejects };
}
export function pureGates(S) {
  const V = pureView(S);
  return { h1: V.h1Below1e14, quad: V.quadMassBelow1e12 && V.quadCmBelow1e12 && V.quadIBelow1e2 && V.nQuad === 3840 && V.nQuad0 === 960, sphereSelf: V.sphereSelfZero,
    shape: V.sliceIn && V.sliceOutZero && V.rate0Below1e9 && V.tailBelow1e2, split: V.splitClosedBelow1e15, rejects: S.rejects.length === 5 && S.rejects.every(Boolean) };
}
export { k4Sets, SETS, YR, D340D };

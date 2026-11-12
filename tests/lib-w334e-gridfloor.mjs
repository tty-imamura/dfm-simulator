// 第334便e(原仮定者の回答(2026-11-11 —— AN638 = A「先に離散化の依存を下げる」・AN640 = A「主列は W₀ = 0」)・原仮定者の整理(2026-11-11)「土星の環と銀河の円盤について」・
//   統括の検証項目 R326): **受け手を固定の格子に置いた統合した並進の場 U の純関数**(器 tests/exp-w334e-gridfloor.mjs と QA lint.gridFloor334e・behavior.gridFloor334e が読む ——
//   html を読まない・状態を持たない・第333便d の lib〔tests/lib-w333d-noncirc.mjs —— 円盤 buildDisk・帯の読み annulusKinematics・乱数 rngOf〕と第332便b の lib〔tests/lib-w332b-transgeo2.mjs
//   —— 場の式 frameField〕は呼ぶだけ・エンジンの式を写さない)。**診断だけ —— 運動学の対照(相互作用の時間発展はしない)**。
//
// ■ 場の式(gridField —— 三次元の受け手・面内か z に散らした源・1 回の走査で軟化の列と重みの次数 α ∈ {1, 2} と引きずり自転の 2 つの宣言を同時に):
//   重み w_j = m_j (r² + ε²)^(−α/2)(Plummer の軟化 —— ε = 0 で点の重み m/r^α)・r = ‖p − p_j‖(三次元)・
//   源の座標の速度 c_j = v_j + s_d,j ẑ × (p − p_j)(座標変換の回転 —— 半径を見ない・ẑ × (dx, dy, dz) = (−dy, dx, 0))・
//   U(p) = Σ w_j c_j /(W₀ + Σ w_j)(**主列は W₀ = 0 —— 背景慣性決定力も自己の重みも分母に入れない**・受け手は格子の点で星ではないので自己の項は無い)。
//   z = 0 で第332便b の frameField(座標変換の回転・同じ ε と p)と同じ値(場面 ①)。円筒の成分: U_φ = U · φ̂・U_R = U · R̂・U_z。
// ■ 言わないこと: 離散化の幅は宣言した格子と離散化の列の表(連続の円盤の値の同定ではない)・軟化は離散化の依存を下げるための宣言の長さ(物理の厚みではない)・
//   z の列は表だけ(高さの則の式を当てない)・腕の形成・回転曲線の機構の同定に使わない・`κ_epi` と κ_D は別の量・棒は扱わない。
import * as N3 from './lib-w333d-noncirc.mjs';
import * as TG from './lib-w332b-transgeo2.mjs';

export const LIB_VERSION = 'w334e-gridfloor-lib-1';
/** 場の組(α = 2 の場の読みが主・α = 1 と s_d = Ω〔sync〕は対照)—— 鍵の並びは gridField の戻り値の並び */
export const COMBOS = Object.freeze(['a2|none', 'a1|none', 'a2|sync']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 恒等式の門の相対の許容 */
  idTol: 1e-12,
  /** 受け手と星の格子の最小の方位の隔たり(星の方位の間隔に対する割合 —— 円軌道の格子で受け手が星と重ならない宣言の下限) */
  minAzFrac: 0.1,
  /** 厚みの散らし方: 鉛直の密度 ∝ sech²(z/z₀) の逆関数 z = z₀ artanh(2u − 1)(u は種を宣言した乱数 —— 第333便d の rngOf) */
  thickProfile: 'sech2',
});

const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));

/** 源の点の列(第333便d の buildDisk の pts —— spin は none の型・spinSync は sync の型)を走査の形(型付きの配列)へ。zs は各点の z(省略で 0) */
export function packSources(ptsNone, ptsSync, zs = null) {
  if (!Array.isArray(ptsNone) || !Array.isArray(ptsSync) || ptsNone.length !== ptsSync.length || !ptsNone.length) throw new RangeError('packSources: 同じ長さの空でない 2 つの点の列');
  const n = ptsNone.length, S = { n, x: new Float64Array(n), y: new Float64Array(n), z: new Float64Array(n), vx: new Float64Array(n), vy: new Float64Array(n), vz: new Float64Array(n), m: new Float64Array(n), sn: new Float64Array(n), ss: new Float64Array(n) };
  for (let j = 0; j < n; j++) {
    const a = ptsNone[j], b = ptsSync[j];
    if (![a.x, a.y, a.vx, a.vy, a.m, a.spin, b.spin].every(fin) || a.m < 0 || a.x !== b.x || a.y !== b.y || a.vx !== b.vx || a.vy !== b.vy || a.m !== b.m) throw new RangeError('packSources: 2 つの列は位置・速度・質量が同じで、有限の値');
    const zz = zs ? zs[j] : 0; if (!fin(zz)) throw new RangeError('packSources: z は有限');
    S.x[j] = a.x; S.y[j] = a.y; S.z[j] = zz; S.vx[j] = a.vx; S.vy[j] = a.vy; S.vz[j] = 0; S.m[j] = a.m; S.sn[j] = a.spin; S.ss[j] = b.spin;
  }
  return S;
}

/**
 * 三次元の受け手の場(1 回の走査で軟化の列 × 組)。rec:[[x, y, z], …]・S は packSources・epsList:[ε ≥ 0, …](源と同じ長さの単位)・exclude:受け手 k に対して外す源の番号(星の点を受け手にするとき —— 無ければ -1)・
 * W0 ≥ 0(背景 —— 速度 0 の項・主は 0)。戻り値 out[k][e][combo] = [Ux, Uy, Uz](combo は COMBOS の順)・minDist[k](源への最小の距離)
 */
export function gridField({ rec, S, epsList, exclude = null, W0 = 0 }) {
  if (!Array.isArray(rec) || !rec.length || !rec.every((p) => Array.isArray(p) && p.length === 3 && p.every(fin))) throw new RangeError('gridField: 受け手は有限の 3 成分の配列の列');
  if (!S || !(S.n > 0) || !Array.isArray(epsList) || !epsList.length || !epsList.every((e) => fin(e) && e >= 0) || !fin(W0) || W0 < 0) throw new RangeError('gridField: 源・軟化 ≥ 0 の列・W₀ ≥ 0');
  if (exclude !== null && !(Array.isArray(exclude) && exclude.length === rec.length)) throw new RangeError('gridField: exclude は受け手と同じ長さ');
  const nE = epsList.length, E2 = epsList.map((e) => e * e), NA = 14, out = [], minDist = [];
  const { n, x, y, z, vx, vy, vz, m, sn, ss } = S;
  for (let k = 0; k < rec.length; k++) {
    const px = rec[k][0], py = rec[k][1], pz = rec[k][2], ex = exclude ? exclude[k] : -1, A = new Float64Array(nE * NA);
    let dmin = Infinity;
    for (let j = 0; j < n; j++) {
      if (j === ex) continue;
      const dx = px - x[j], dy = py - y[j], dz = pz - z[j], d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < dmin) dmin = d2;
      const mj = m[j], vxj = vx[j], vyj = vy[j], vzj = vz[j], tnx = -sn[j] * dy, tny = sn[j] * dx, tsx = -ss[j] * dy, tsy = ss[j] * dx;
      for (let e = 0; e < nE; e++) {
        const q2 = d2 + E2[e];
        if (!(q2 > 0)) throw new RangeError('gridField: 受け手と源が一致(ε = 0)—— 受け手の自分は exclude で外す');
        const inv = 1 / q2, w2 = mj * inv, w1 = mj * Math.sqrt(inv), b = e * NA;
        A[b] += w2; A[b + 1] += w2 * vxj; A[b + 2] += w2 * vyj; A[b + 3] += w2 * vzj; A[b + 4] += w2 * tnx; A[b + 5] += w2 * tny; A[b + 6] += w2 * tsx; A[b + 7] += w2 * tsy;
        A[b + 8] += w1; A[b + 9] += w1 * vxj; A[b + 10] += w1 * vyj; A[b + 11] += w1 * tnx; A[b + 12] += w1 * tny; A[b + 13] += w1 * vzj;
      }
    }
    const row = [];
    for (let e = 0; e < nE; e++) {
      const b = e * NA, W2 = W0 + A[b], W1 = W0 + A[b + 8];
      if (!(W2 > 0 && W1 > 0)) throw new RangeError('gridField: 分母が 0');
      row.push([[(A[b + 1] + A[b + 4]) / W2, (A[b + 2] + A[b + 5]) / W2, A[b + 3] / W2], [(A[b + 9] + A[b + 11]) / W1, (A[b + 10] + A[b + 12]) / W1, A[b + 13] / W1], [(A[b + 1] + A[b + 6]) / W2, (A[b + 2] + A[b + 7]) / W2, A[b + 3] / W2]]);
    }
    out.push(row); minDist.push(Math.sqrt(dmin));
  }
  return { out, minDist };
}

/** 円筒の成分 { phi, R, z }(受け手の位置 p・ベクトル u —— p の面内の動径が 0 なら RangeError) */
export function cyl(p, u) {
  const r = Math.hypot(p[0], p[1]);
  if (!(r > 0)) throw new RangeError('cyl: 軸の上は方位が決まらない');
  const c = p[0] / r, s = p[1] / r;
  return { phi: -u[0] * s + u[1] * c, R: u[0] * c + u[1] * s, z: u[2] };
}

/** 固定の受け手の格子(半径の列 × 方位 nAz 点 —— 方位 φ_j = 2π(j + offFrac)/nAz・高さ z) */
export function receiverGrid(radii, nAz, offFrac, zz = 0) {
  if (!Array.isArray(radii) || !radii.length || !radii.every((R) => fin(R) && R > 0) || !(Number.isInteger(nAz) && nAz >= 2) || !fin(offFrac) || !fin(zz)) throw new RangeError('receiverGrid: 半径 > 0 の列・nAz ≥ 2・有限の位相と高さ');
  const pts = [];
  for (let i = 0; i < radii.length; i++) for (let j = 0; j < nAz; j++) { const f = 2 * Math.PI * (j + offFrac) / nAz; pts.push({ ri: i, j, R: radii[i], phi: f, p: [radii[i] * Math.cos(f), radii[i] * Math.sin(f), zz] }); }
  return pts;
}

/** 円盤の全体を角 ang だけ回す(位置・速度・加速度 —— 星の格子と腕の向きが受け手の格子に対して回る) */
export function rotateDisk(pts, ang) {
  if (!Array.isArray(pts) || !fin(ang)) throw new RangeError('rotateDisk: 点の列と有限の角');
  if (ang === 0) return pts;
  const c = Math.cos(ang), s = Math.sin(ang), rot = (a, b) => [a * c - b * s, a * s + b * c];
  return pts.map((P) => { const [x, y] = rot(P.x, P.y), [vx, vy] = rot(P.vx, P.vy), [ax, ay] = rot(P.ax, P.ay); return Object.assign({}, P, { x, y, vx, vy, ax, ay }); });
}

/** 厚みの散らし(鉛直の密度 ∝ sech²(z/z₀) —— z = z₀ artanh(2u − 1)・中心の点〔ring −1〕は z = 0)。戻り値は各点の z の配列 */
export function thickZ(pts, z0, seed) {
  if (!Array.isArray(pts) || !(fin(z0) && z0 > 0)) throw new RangeError('thickZ: 点の列と z₀ > 0');
  const r = N3.rngOf(seed);
  return pts.map((P) => { if (P.ring === -1) return 0; let u = r(); if (u <= 0) u = 1e-12; return z0 * Math.atanh(2 * u - 1); });
}

/** 幅(最大 − 最小)÷ |平均| —— 誤差の幅の定義(値の列は全部が有限・平均が 0 でない) */
export function bandOf(vals) {
  if (!Array.isArray(vals) || vals.length < 2 || !vals.every(fin)) throw new RangeError('bandOf: 2 つ以上の有限の値');
  const mx = Math.max(...vals), mn = Math.min(...vals), mean = vals.reduce((a, x) => a + x, 0) / vals.length;
  if (!(Math.abs(mean) > 0)) throw new RangeError('bandOf: 平均が 0');
  return (mx - mn) / Math.abs(mean);
}

/** 高さの偶奇と小さい z の次数: f(z) の表 { z → 値 }(z = 0 と ±z の対)→ 各 z > 0 の { even: (f(z)+f(−z))/2 − f(0), odd: (f(z) − f(−z))/2 }・
 *  次数 n = log(|even(z₂)|/|even(z₁)|)/log(z₂/z₁)(z₁ < z₂ の隣どうし)・二階の微分 2 even(z₁)/z₁²・一階の微分 odd(z₁)/z₁ */
export function parityOf(zs, fz) {
  if (!Array.isArray(zs) || !Array.isArray(fz) || zs.length !== fz.length || !fz.every(fin)) throw new RangeError('parityOf: 同じ長さの有限の値');
  const at = (zz) => { const k = zs.findIndex((q) => q === zz); if (k < 0) throw new RangeError('parityOf: z = ' + zz + ' が無い'); return fz[k]; };
  const f0 = at(0), pos = [...new Set(zs.filter((q) => q > 0))].sort((a, b) => a - b), rows = pos.map((q) => ({ z: q, even: (at(q) + at(-q)) / 2 - f0, odd: (at(q) - at(-q)) / 2 }));
  const orders = []; for (let k = 0; k + 1 < rows.length; k++) { const a = rows[k], b = rows[k + 1]; orders.push(Math.abs(a.even) > 0 && Math.abs(b.even) > 0 ? Math.log(Math.abs(b.even) / Math.abs(a.even)) / Math.log(b.z / a.z) : null); }
  const z1 = rows[0];
  return { f0, rows, orders, d2: 2 * z1.even / (z1.z * z1.z), d1: z1.odd / z1.z, oddOverEven: Math.max(...rows.map((r) => (Math.abs(r.even) > 0 ? Math.abs(r.odd) / Math.abs(r.even) : (r.odd === 0 ? 0 : Infinity)))) };
}

/** 円軌道の格子で、受け手の方位と星の方位の最小の隔たり(星の方位の間隔に対する割合 —— 0 なら重なる)。K は方位の数・phaseFrac は星の格子の回し(間隔の割合) */
export function azGapFrac({ nAz, offFrac, K, phaseFrac }) {
  if (![nAz, K].every((q) => Number.isInteger(q) && q >= 2) || ![offFrac, phaseFrac].every(fin)) throw new RangeError('azGapFrac: 整数の nAz・K ≥ 2・有限の割合');
  let g = Infinity;
  for (let j = 0; j < nAz; j++) { const t = ((j + offFrac) / nAz * K - phaseFrac) % 1, u = ((t % 1) + 1) % 1; g = Math.min(g, u, 1 - u); }
  return g;
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const Sx = {};
  const rings = [{ Rg: 1, m: 3, Omega: 1, kappaEpi: 1.4 }, { Rg: 2, m: 5, Omega: 0.5, kappaEpi: 0.72 }, { Rg: 3.5, m: 2, Omega: 0.29, kappaEpi: 0.41 }], ctr = { m: 4, spin: 0.3 };
  const mk = (family, spin, extra = {}) => N3.buildDisk(Object.assign({ rings, K: 12, family, amp: family === 'circ' ? 0 : 0.15, seed: 3, R0: 1, center: ctr, spin }, extra)).pts;
  // ① z = 0 の受け手で第332便b の frameField(座標変換の回転)と同じ値(α 1・2 × ε 0・0.1 × s_d none・sync)
  { const A = mk('random', 'none'), B = mk('random', 'sync'), S = packSources(A, B), at = [[1.63, -0.91], [-2.4, 1.1], [0.37, 3.02]], eps = [0, 0.1];
    const G = gridField({ rec: at.map((p) => [p[0], p[1], 0]), S, epsList: eps }); let mx = 0, n = 0;
    at.forEach((p, k) => eps.forEach((e, ei) => [['a2|none', 2, A], ['a1|none', 1, A], ['a2|sync', 2, B]].forEach(([key, pp, src]) => {
      const F = TG.frameField({ at: p, sources: src, kernel: { p: pp, eps: e }, rot: { type: 'coord' } }), U = G.out[k][ei][COMBOS.indexOf(key)];
      mx = Math.max(mx, relD(U[0], F.u[0]), relD(U[1], F.u[1]), Math.abs(U[2])); n++; })));
    Sx.sameAsFrame = { maxRel: mx, n }; }
  // ② 星の点を受け手にする(自分を外す): z = 0・ε = 0 で frameField の受け手の自分を外した値と同じ
  { const A = mk('kin', 'none'), B = mk('kin', 'sync'), S = packSources(A, B), ks = [3, 17, 30];
    const G = gridField({ rec: ks.map((i) => [A[i].x, A[i].y, 0]), S, epsList: [0], exclude: ks }); let mx = 0;
    ks.forEach((i, q) => { const F = TG.frameField({ at: [A[i].x, A[i].y], sources: A.filter((_, j) => j !== i), kernel: { p: 2, eps: 0 }, rot: { type: 'coord' } }), U = G.out[q][0][0]; mx = Math.max(mx, relD(U[0], F.u[0]), relD(U[1], F.u[1])); });
    Sx.starReceiver = { maxRel: mx, n: ks.length }; }
  // ③ 薄い円盤の z の偶奇: f(z) と f(−z) はビットで同じ(r² が z² だけで決まる)・鉛直の成分は恒等的に 0(源の速度に z が無く、回転は ẑ 軸)
  { const A = mk('circ', 'none'), B = mk('circ', 'sync'), S = packSources(A, B), zs = [0, 0.05, -0.05, 0.3, -0.3];
    let odd = 0, uz = 0; const vals = zs.map((zz) => gridField({ rec: [[1.7, 0.6, zz]], S, epsList: [0, 0.1] }).out[0]);
    for (const [ip, im] of [[1, 2], [3, 4]]) for (let e = 0; e < 2; e++) for (let c = 0; c < 3; c++) for (let a = 0; a < 3; a++) odd = Math.max(odd, Math.abs(vals[ip][e][c][a] - vals[im][e][c][a]));
    vals.forEach((v) => v.forEach((ve) => ve.forEach((u) => { uz = Math.max(uz, Math.abs(u[2])); })));
    Sx.zParity = { oddAbs: odd, uzAbs: uz }; }
  // ④ 回す不変: 円盤を θ 回して受け手も θ 回すと円筒の成分が同じ
  { const th = 0.73, A = mk('pattern', 'none', { OmegaP: 0.45 }), B = mk('pattern', 'sync', { OmegaP: 0.45 }), A2 = rotateDisk(A, th), B2 = rotateDisk(B, th);
    const p = [1.9, -0.7, 0.2], c = Math.cos(th), s = Math.sin(th), p2 = [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
    const U1 = gridField({ rec: [p], S: packSources(A, B), epsList: [0.05] }).out[0][0], U2 = gridField({ rec: [p2], S: packSources(A2, B2), epsList: [0.05] }).out[0][0]; let mx = 0;
    for (let k = 0; k < 3; k++) { const a = cyl(p, U1[k]), b = cyl(p2, U2[k]); mx = Math.max(mx, relD(a.phi, b.phi), relD(a.R, b.R)); }
    Sx.rotateInvariant = { maxRel: mx }; }
  // ⑤ 離散化を倍にしたときの差: 一様な環(半径 1・剛体の回転)の外の受け手(半径 2)—— 方位の数 K を倍にすると差が速く小さくなる(滑らかな場の離散化)
  { const val = (K) => { const pts = N3.buildDisk({ rings: [{ Rg: 1, m: 1, Omega: 1, kappaEpi: 2 }], K, family: 'circ', R0: 1, center: { m: 0, spin: 0 }, spin: 'none' }).pts; return cyl([2, 0.3, 0], gridField({ rec: [[2, 0.3, 0]], S: packSources(pts, pts), epsList: [0] }).out[0][0][0]).phi; };
    const v8 = val(8), v16 = val(16), v32 = val(32); Sx.doubling = { d1: Math.abs(v16 - v8) / Math.abs(v32), d2: Math.abs(v32 - v16) / Math.abs(v32) }; }
  // ⑥ 軟化が大きいと近い点の重みが抑えられる: 受け手のすぐそばの 1 点の源の分(ε 0 → 0.25)が下がる
  { const pts = [{ x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0, m: 1, spin: 0, ring: -1 }, { x: 1.001, y: 0, vx: 0, vy: 1, ax: 0, ay: 0, m: 1e-3, spin: 0, ring: 0 }];
    const G = gridField({ rec: [[1, 0, 0]], S: packSources(pts, pts), epsList: [0, 0.25] }).out[0]; Sx.softening = { u0: G[0][0][1], u25: G[1][0][1] }; }
  // ⑦ 幅と偶奇の関数: 既知の列
  { const P = parityOf([0, 0.1, -0.1, 0.2, -0.2], [1, 1 + 0.01 + 0.003, 1 + 0.01 - 0.003, 1 + 0.04 + 0.006, 1 + 0.04 - 0.006]);
    Sx.helpers = { band: bandOf([0.99, 1, 1.01]), order: P.orders[0], d2: P.d2, d1: P.d1, oddOverEven: P.oddOverEven }; }
  // ⑧ 方位の隔たり: 格子の宣言(nAz 24・位相 0.4)で K ∈ {24, 48, 96} × 星の格子の回し {0, 1/4, 1/2} の最小 ・重なる宣言(位相 0)は 0
  { let g = Infinity; for (const K of [24, 48, 96]) for (const f of [0, 0.25, 0.5]) g = Math.min(g, azGapFrac({ nAz: 24, offFrac: 0.4, K, phaseFrac: f }));
    Sx.azGap = { min: g, overlap: azGapFrac({ nAz: 24, offFrac: 0, K: 48, phaseFrac: 0 }) }; }
  // ⑨ 厚みの散らし: 種で同じ列・中心は 0・|z| の中央値 ≈ z₀ artanh(1/2)(2 万点)
  { const pts = [{ ring: -1 }].concat(Array.from({ length: 20000 }, () => ({ ring: 0 }))), a = thickZ(pts, 0.3, 11), b = thickZ(pts, 0.3, 11), az = a.slice(1).map(Math.abs).sort((x, y) => x - y);
    Sx.thick = { same: a.every((q, i) => q === b[i]), center: a[0], medAbsOverZ0: az[az.length >> 1] / 0.3, expect: Math.atanh(0.5), mean: a.reduce((s, q) => s + q, 0) / 20000 / 0.3 }; }
  // ⑩ 入力の拒否
  { const P0 = mk('circ', 'none'), S0 = packSources(P0, P0);
    const bad = [() => packSources([], []), () => packSources(P0, P0.slice(1)), () => gridField({ rec: [[P0[1].x, P0[1].y, 0]], S: S0, epsList: [0] }), () => gridField({ rec: [[1, 0]], S: S0, epsList: [0] }),
      () => gridField({ rec: [[1, 0, 0]], S: S0, epsList: [-1] }), () => cyl([0, 0, 1], [1, 0, 0]), () => receiverGrid([0], 24, 0.4), () => rotateDisk(P0, NaN), () => thickZ(P0, 0, 1), () => bandOf([1]), () => bandOf([1, -1]),
      () => parityOf([0, 0.1], [1, 2]), () => azGapFrac({ nAz: 1, offFrac: 0, K: 24, phaseFrac: 0 })];
    let n = 0; for (const f of bad) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    Sx.reject = { n, of: bad.length }; }
  return Sx;
}
export function pureGates(S) {
  const tol = DECL.idTol;
  return {
    sameAsFrame: S.sameAsFrame.n === 18 && S.sameAsFrame.maxRel <= tol,
    starReceiver: S.starReceiver.n === 3 && S.starReceiver.maxRel <= tol,
    zParity: S.zParity.oddAbs === 0 && S.zParity.uzAbs === 0,
    rotateInvariant: S.rotateInvariant.maxRel <= 1e-10,
    doubling: S.doubling.d2 < S.doubling.d1 && S.doubling.d2 < 1e-3,
    softening: S.softening.u25 < S.softening.u0 && S.softening.u0 > 0,
    helpers: Math.abs(S.helpers.band - 0.02) <= tol && Math.abs(S.helpers.order - 2) <= 1e-9 && Math.abs(S.helpers.d2 - 2) <= 1e-9 && Math.abs(S.helpers.d1 - 0.03) <= 1e-9 && Math.abs(S.helpers.oddOverEven - 0.3) <= 1e-9,
    azGap: S.azGap.min >= DECL.minAzFrac - 1e-12 && S.azGap.overlap === 0,
    thick: S.thick.same && S.thick.center === 0 && Math.abs(S.thick.medAbsOverZ0 - S.thick.expect) < 0.02 && Math.abs(S.thick.mean) < 0.03,
    reject: S.reject.n === S.reject.of,
  };
}

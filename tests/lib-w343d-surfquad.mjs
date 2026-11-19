// 第343便d(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN841「推奨で進める」(弦の向きの積分を主の列・接線は向きの目安)・AN842「推奨で進める」・
//   原仮定者の回答(2026-11-18 —— 第142報)AN800「扁平率は、源の区切りを細かくしないで計算する近似を検証する」・統括の検証項目 R381):
//   **扁平の源の h1 の場を、楕円体の物理の表面にだけ点を置く求積で数える純関数**(段 surfquad-343d —— 器 tests/exp-w343d-surfquad.mjs・正本 tests/out/surfquad-343d.json)。
//   **診断だけ** —— エンジン・内蔵の本・受理器は変えない。html を読まない・ファイルを読まない・ネットへ取りに行かない・乱数を使わない。61440 点の表の点は増やさない(表は器が読んで数として渡す)。
//
// ■ 式(発散定理 —— 統括の参考の試作・統括の検証項目 R381 を今のコードで書き直した形): 外の点 x・R = y − x・r = |R|。向きだけの核 H(R の向きにだけ依る —— 0 次の斉次)では
//   R·∇_y H = 0(Euler の関係)なので div_y[(R/r²) H] = H div_y(R/r²) = H/r²(3 次元で div(R/r²) = 1/r²)。x は源の外なので、体積の積分は表面のフラックスに直る:
//   ∫_V H/r² dV = ∮_∂V H (R·n̂)/r² dS。密度が一様(質量 1 ÷ 体積 V)なら h1 の場 = (1/V) ∮ H(û)(R·n̂)/r² dS(û = (x − y)/r —— 部位から受け手への向き)。
// ■ 表面の座標: 単位の球の点 u(θ, φ) = cos θ p̂ + sin θ (cos φ q̂ + sin φ k̂) を y = (a u_x, a u_y, c u_z) へ写す・n̂ dS = (a c u_x, a c u_y, a² u_z) sin θ dθ dφ(外向き)。
//   極 p̂ は受け手に一番近い表面の点を単位の球へ写した向き(第342便c の nearestPoint)・補助の軸は ẑ(|p̂ の z| > 0.9 なら x̂)。
//   θ ∈ [0, π] は Gauss–Legendre(nθ)・φ は周期の中点(nφ)。核 H は第341便d の lib の h1Unit(主の列 q = 1 —— 呼ぶだけ)。
//   弦の向きの積分(第342便c —— 受け手から見た向きの球の上の求積・弦の長さの閉じた形)とも、第341便d の表(源の体積の部位の和)とも、積分の座標・領域・重みが別。
//   共通なのは核 H と Gauss–Legendre の点の表(第342便c の lib の gaussLegendre —— 標準の点)だけ。
// ■ 零試験: 体積 = (1/3) ∮ y·n̂ dS(表面の求積で体積を数え直す)。
// ■ 言わないこと: 弦の積分が正しいと分かったとは書かない・表の誤りが分かったとは書かない・扁平の効きが導けたとは書かない。表面の刻みの差は厳密な誤差の上限ではない。
//   試した範囲は「外の点・一様な密度の回転楕円体・逆二乗の核・h1 の軸の傾きと強さ」だけ(源の内・密度の偏り・経路の型・環の幅は数えていない)。薄い角は atan2(第340便h の thinAngle)。
import { h1Unit } from './lib-w341d-oblatering.mjs';
import { thinAngle } from './lib-w340h-thin.mjs';
import { radii, receiver, chordField, gaussLegendre, nearestPoint } from './lib-w342c-oblateapprox.mjs';

export const LIB_VERSION = 'w343d-surfquad-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], unit = (a) => { const m = nrm(a); return [a[0] / m, a[1] / m, a[2] / m]; };
const rej = (e, p) => { const d = dot(e, p); return [e[0] - d * p[0], e[1] - d * p[1], e[2] - d * p[2]]; };
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 比べる 42 条件(第341便d の正本の t1.summary の q = 'h1Tilt' —— 第342便c と同じ点)・第342便c の正本(弦の列) */
  ref: Object.freeze({ file: 'tests/out/oblatering-341d.json', q: 'h1Tilt', nPts: 42 }),
  chordFile: 'tests/out/oblateapprox-342c.json', chordMain: 1, chordFine: 2,
  /** 表面の刻み(nθ × nφ —— 粗・細)。主は細 */
  surfLevels: Object.freeze([[64, 128], [96, 192]]), surfMain: 1,
  /** 極の試験: 扁平率 3(球・土星の型・長球)× 極の真上と真下・極のすぐ横(横のずれ 1e-6)・受け手の高さ z = ±2(R_d 単位)。弦の向きの数 16 × 32 */
  pole: Object.freeze({ fGrid: Object.freeze([0, 0.098, -0.1]), z: 2, side: 1e-6, chordDims: Object.freeze([16, 32]) }),
  /** 適用の境目の表(T4): 扁平率 3 × 距離 2 × 高さ 6(1 = 極の真上)。弦の向き 16 × 32・表面は細 */
  edge: Object.freeze({ fGrid: Object.freeze([0.098, 0.3, -0.1]), dGrid: Object.freeze([1.1, 2]), sGrid: Object.freeze([0.01, 0.1, 0.5, 0.9, 0.99, 1]), chordDims: Object.freeze([16, 32]) }),
  /** 門: 表面の体積の求積の差 ≤ volTol・極の連続(場のベクトルの相対の差 ≤ poleTol —— 横のずれ 1e-6 の 1 次の量より大きく置く)・弦と表面の場の相対の差 ≤ agreeTol */
  volTol: 1e-12, poleTol: 1e-5, agreeTol: 1e-4, floor: 1e-12,
  /** 外の試算の 3 つの数と弦の 2 つの数(統括の参考の試作 —— 比べるだけ・照合しない) */
  outside: Object.freeze({ surfSelf: 2.61e-10, surfVsChord: 5.93e-6, surfVsRef: 1.83e-4, chordSat6: 7.905e-5, chordS01: 9.470e-5, w342cSat6: 7.11e-5, w342cS01: 8.46e-5 }),
});

/* ───────── 表面の求積 ───────── */
/** 回転楕円体(赤道 a・極 c)の一様な密度(質量 1)の h1 の場を外の点 x で、表面のフラックスで数える。
 *  戻り値 { v(場), volRatio((1/3)∮ y·n̂ dS ÷ 体積 —— 零試験), nKernel(核の評価の回数) } */
export function surfaceField(a, c, x, nt, np) {
  if (!(fin(a) && a > 0 && fin(c) && c > 0)) throw new RangeError('surfaceField: a > 0・c > 0');
  if (!(Number.isInteger(nt) && nt >= 2 && Number.isInteger(np) && np >= 2)) throw new RangeError('surfaceField: 刻み ≥ 2');
  if (!((x[0] * x[0] + x[1] * x[1]) / (a * a) + (x[2] * x[2]) / (c * c) > 1)) throw new RangeError('surfaceField: 外の点でない');
  // 表面の座標の極 p̂ を、受け手に一番近い表面の点(第342便c の nearestPoint —— 法線の条件の根)を単位の球へ写した向きに置く(近い所で φ の刻みが物理の長さで細かくなる)
  const rho = Math.hypot(x[0], x[1]), NP = nearestPoint(a, c, rho, x[2]), cx = rho > 0 ? x[0] / rho : 1, cy = rho > 0 ? x[1] / rho : 0;
  const p = unit([NP.rho * cx / a, NP.rho * cy / a, NP.z / c]), q = unit(rej(Math.abs(p[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1], p)), k = crs(p, q);
  const G = gaussLegendre(nt), V = (4 / 3) * Math.PI * a * a * c, hp = Math.PI / 2, dph = 2 * Math.PI / np;
  let o0 = 0, o1 = 0, o2 = 0, vol = 0, nK = 0;
  for (let i = 0; i < nt; i++) {
    const th = hp * (G.x[i] + 1), wt = hp * G.w[i], st = Math.sin(th), ct = Math.cos(th);
    for (let j = 0; j < np; j++) {
      const ph = dph * (j + 0.5), cp = Math.cos(ph), sp = Math.sin(ph);
      const u = [ct * p[0] + st * (cp * q[0] + sp * k[0]), ct * p[1] + st * (cp * q[1] + sp * k[1]), ct * p[2] + st * (cp * q[2] + sp * k[2])];
      const y = [a * u[0], a * u[1], c * u[2]], nd = [a * c * u[0] * st, a * c * u[1] * st, a * a * u[2] * st];
      const R = sub(y, x), r2 = R[0] * R[0] + R[1] * R[1] + R[2] * R[2], flux = (R[0] * nd[0] + R[1] * nd[1] + R[2] * nd[2]) / r2;
      const H = h1Unit([-R[0], -R[1], -R[2]]), w = wt * dph;
      o0 += w * flux * H[0]; o1 += w * flux * H[1]; o2 += w * flux * H[2];
      vol += w * (y[0] * nd[0] + y[1] * nd[1] + y[2] * nd[2]) / 3; nK++;
    }
  }
  return { v: [o0 / V, o1 / V, o2 / V], volRatio: vol / V, nKernel: nK, pole: p };
}
/** 1 点の表面の行: 扁平の源と同じ物理の位置の等体積の球の源の場から、h1 の軸の傾きの比と場の強さの比(第342便c の chordRow と同じ量) */
export function surfaceRow(f, d, s, [nt, np]) {
  const R = receiver(f, d, s), O = surfaceField(R.a, R.c, R.x, nt, np), S = surfaceField(1, 1, R.x, nt, np), down = [0, 0, -1];
  const tO = thinAngle(O.v, down), tS = thinAngle(S.v, down);
  return { f, d, s, nSurf: nt * np, tiltRatio: tO / tS, magRatio: nrm(O.v) / nrm(S.v), volRatioOblate: O.volRatio, volRatioSphere: S.volRatio, nKernel: O.nKernel + S.nKernel };
}
/** 2 つの場のベクトルの相対の差(大きい方の強さで割る) */
export const relVec = (u, v) => nrm(sub(u, v)) / Math.max(nrm(u), nrm(v));

/* ───────── 極の試験(T1 —— 第342便c の chordField の lib-2 を呼ぶ)───────── */
/** 扁平率 f の源で、極の真上・真下・すぐ横の 4 点の場(弦と表面)と体積。傾きの比は極で 0/0 なので場のベクトルと体積で比べる */
export function poleRows(D = DECL) {
  const P = D.pole, [nt, np] = P.chordDims, [st, sp] = D.surfLevels[D.surfMain];
  return P.fGrid.map((f) => {
    const { a, c } = radii(f), pts = { top: [0, 0, P.z], bottom: [0, 0, -P.z], topSide: [P.side, 0, P.z], bottomSide: [P.side, 0, -P.z] }, o = { f, a, c };
    for (const [k, x] of Object.entries(pts)) { const C = chordField(a, c, x, nt, np), S = surfaceField(a, c, x, st, sp); o[k] = { chord: C.v, chordVol: C.volRatio, surf: S.v, surfVol: S.volRatio, chordVsSurf: relVec(C.v, S.v) }; }
    // 連続: 極とすぐ横の場の相対の差(弦・表面)と体積の差・上と下の対称(z → −z で (−F_x, −F_y, F_z))
    o.contChord = Math.max(relVec(o.top.chord, o.topSide.chord), relVec(o.bottom.chord, o.bottomSide.chord));
    o.contSurf = Math.max(relVec(o.top.surf, o.topSide.surf), relVec(o.bottom.surf, o.bottomSide.surf));
    o.contVol = Math.max(Math.abs(o.top.chordVol - o.topSide.chordVol), Math.abs(o.bottom.chordVol - o.bottomSide.chordVol));
    o.volErr = Math.max(...['top', 'bottom', 'topSide', 'bottomSide'].map((k) => Math.max(Math.abs(o[k].chordVol - 1), Math.abs(o[k].surfVol - 1))));
    o.agreeMax = Math.max(...['top', 'bottom', 'topSide', 'bottomSide'].map((k) => o[k].chordVsSurf));
    const u = o.top.chord, b = o.bottom.chord; o.mirror = (Math.abs(u[0] + b[0]) + Math.abs(u[1] + b[1]) + Math.abs(u[2] - b[2])) / nrm(u);
    return o;
  });
}

/* ───────── 適用の境目(T4)───────── */
/** 扁平率 × 距離 × 高さ(1 = 極の真上)の点で、弦と表面の場の相対の差と傾きの比の差(極では傾きの比を出さない) */
export function edgeRows(D = DECL) {
  const E = D.edge, [nt, np] = E.chordDims, [st, sp] = D.surfLevels[D.surfMain], down = [0, 0, -1], rows = [];
  for (const f of E.fGrid) for (const d of E.dGrid) for (const s of E.sGrid) {
    const { a, c } = radii(f), r = d * a, x = s === 1 ? [0, 0, r] : [r * Math.sqrt(1 - s * s), 0, r * s];
    // 外の点の判定は 1e-9 の余白つき(長球 −0.1・距離 1.1・極の真上は r = 1.1^(2/3) = c —— 表面の上の点で、数えない)
    if (!((x[0] * x[0]) / (a * a) + (x[2] * x[2]) / (c * c) - 1 > 1e-9)) { rows.push({ f, d, s, outside: false }); continue; }
    const CO = chordField(a, c, x, nt, np), SO = surfaceField(a, c, x, st, sp), CS = chordField(1, 1, x, nt, np), SS = surfaceField(1, 1, x, st, sp);
    // 刻みを 2 倍にした自分の列の中の差(弦 16 × 32 → 32 × 64・表面 96 × 192 → 192 × 384 —— 扁平の源)と、受け手の真下・真上の線が源を通るか(ρ < a —— h1 の核の √(1 − u_z²) の折れが源の上に在る)
    const CO2 = chordField(a, c, x, 2 * nt, 2 * np), SO2 = surfaceField(a, c, x, 2 * st, 2 * sp), rho = Math.hypot(x[0], x[1]);
    const row = { f, d, s, outside: true, verticalHits: rho < a, gapOverA: nearestPoint(a, c, rho, x[2]).dist / a, fieldRel: Math.max(relVec(CO.v, SO.v), relVec(CS.v, SS.v)), fieldRelFine: relVec(CO2.v, SO2.v),
      chordSelf: relVec(CO.v, CO2.v), surfSelf: relVec(SO.v, SO2.v), volErr: Math.max(Math.abs(CO.volRatio - 1), Math.abs(SO.volRatio - 1)) };
    if (s === 1) row.tiltNote = '極(傾きの比は 0/0 —— 場のベクトルで比べる)';
    else { const tc = thinAngle(CO.v, down) / thinAngle(CS.v, down), ts = thinAngle(SO.v, down) / thinAngle(SS.v, down); row.tiltChord = tc; row.tiltSurf = ts; row.tiltDiff = Math.abs(tc - ts); }
    rows.push(row);
  }
  return rows;
}
/** 適用の境目の範囲(数えたもの/数えていないもの —— 文の表) */
export const EDGE_SCOPE = Object.freeze([
  Object.freeze({ range: '扁平(扁平率 0.05〜0.3)・外の点・高さ 0.01〜0.99', counted: true, how: '42 条件と境目の表の点' }),
  Object.freeze({ range: '受け手の真下・真上の線が源を通る点(ρ < 赤道半径 —— 核の折れが源の上)', counted: true, how: '境目の表の点(刻みを 2 倍にした差で、どちらの方法も落ち着きが遅い)' }),
  Object.freeze({ range: '長球(扁平率 −0.1)・外の点', counted: true, how: '42 条件の 7 点と境目の表の点' }),
  Object.freeze({ range: '極の真上と真下・極のすぐ横', counted: true, how: '極の試験(場のベクトルと体積)' }),
  Object.freeze({ range: '源の内の点(表面より内)', counted: false, how: '数えていない(発散定理の変形は x が源の外のときだけ —— 弦の形も外の点だけ)' }),
  Object.freeze({ range: '密度の偏り(中心に寄った密度・層)', counted: false, how: '数えていない(弦の長さの打ち消しと表面への変形は一様な密度のときだけ)' }),
  Object.freeze({ range: '逆二乗でない核・経路の型(corV・corS・drag90)・rotU', counted: false, how: '数えていない(div(R/r²) = 1/r² と弦の ρ² の打ち消しは逆二乗のときだけ)' }),
]);

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① 球の源(a = c = 1)の表面の求積と弦の向きの積分が同じ場(外の点 3)・体積の求積
  { let m = 0, vol = 0; for (const x of [[1.5, 0, 0.1], [0.3, 1.2, -0.8], [0, 0, 3]]) { const A = surfaceField(1, 1, x, 48, 96), B = chordField(1, 1, x, 16, 32); m = Math.max(m, relVec(A.v, B.v)); vol = Math.max(vol, Math.abs(A.volRatio - 1)); } S.sphere = { agree: m, vol }; }
  // ② 扁平・長球の体積の求積((1/3)∮ y·n̂ dS = 体積)
  { S.vol = Math.max(...[0.3, -0.1, 0.098].map((f) => { const { a, c } = radii(f); return Math.abs(surfaceField(a, c, [2, 0, 0.3], 32, 64).volRatio - 1); })); }
  // ③ 上下の対称(z → −z で (−F_x, −F_y, F_z))
  { const R = receiver(0.2, 1.24, 0.1), Rm = receiver(0.2, 1.24, -0.1), u = surfaceField(R.a, R.c, R.x, 32, 64).v, b = surfaceField(Rm.a, Rm.c, Rm.x, 32, 64).v; S.mirror = (Math.abs(u[0] + b[0]) + Math.abs(u[1] + b[1]) + Math.abs(u[2] - b[2])) / nrm(u); }
  // ④ 球の源で傾きの比 1
  { S.ratio1 = Math.abs(surfaceRow(0, 1.5, 0.01, [32, 64]).tiltRatio - 1); }
  // ⑤ 入力の拒否
  const rejects = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => surfaceField(1, 1, [0.5, 0, 0], 8, 8)), rejects(() => surfaceField(0, 1, [2, 0, 0], 8, 8)), rejects(() => surfaceField(1, 1, [2, 0, 0], 1, 8)), rejects(() => surfaceField(1, 1, [2, 0, 0], 8, 2.5))];
  return S;
}
export function pureView(S) {
  return { sphereAgreeBelow1e8: S.sphere.agree <= 1e-8, sphereVolBelow1e12: S.sphere.vol <= 1e-12, volBelow1e12: S.vol <= 1e-12, mirrorBelow1e12: S.mirror <= 1e-12, ratio1Below1e12: S.ratio1 <= 1e-12, rejects: S.rejects };
}
export function pureGates(S) {
  const V = pureView(S);
  return { sphere: V.sphereAgreeBelow1e8 && V.sphereVolBelow1e12, vol: V.volBelow1e12, mirror: V.mirrorBelow1e12, ratio1: V.ratio1Below1e12, rejects: S.rejects.length === 4 && S.rejects.every(Boolean) };
}

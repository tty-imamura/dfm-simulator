// 第307便b(原仮定者の裁定(第100報)「潮汐のブレーキが効く相手は慣性軸回転そのもの・失われる回転のエネルギーは内部熱・増え続けるので放射も必要」・
// 決断事項 AN345 ③⑤・統括の検証項目 R210)—— **三次元の明示潮汐(定時間遅延 CTL のベクトル形)と内部熱の純関数**(Node だけ・html を読まない)。
//
// ■ 式(三次元 —— 受け手 i の慣性自転のベクトル Ω_I = s â〔s は慣性自転の角速度 S.spin・â は自転軸の単位ベクトル〕)
//   変形する天体 i(半径 R_i・Love 数 k₂_i・遅延 Δt_i)と伴星 j(点質量 m_j)・r = x_j − x_i・相対速度 V = v_j − v_i:
//     B       = G k₂_i m_j² R_i⁵
//     s_slip  = V − Ω_I × r          (Ω×r = s (â_y r_z − â_z r_y, â_z r_x − â_x r_z, â_x r_y − â_y r_x) —— エンジンと同じ演算順)
//     F_cons  = −3 B r / r⁸           (j に作用・i へ反力)
//     F_diss  = −(3 B Δt / r¹⁰) { 2 r (r·V) + r² s_slip }
//     τ_i     = −r × F_diss           (3 成分 —— 軌道角運動量の変化 r × F_diss の厳密な負)
//     Q̇       = (3 B Δt / r¹⁰) { 2 (r·V)² + r² |s_slip|² } ≥ 0
//   恒等式(同じ V で): F_diss·V + τ_i·Ω_I = −Q̇(r·(Ω×r) = 0・(Ω×r)·s_slip の交差項が打ち消す)。
//   二次元の極限(r_z = V_z = 0・â = +z)では tests/lib-w292d-tide.mjs の ctlPair と同じ浮動小数(Ω×r の x 成分 s(0·0 − 1·r_y) = −s r_y は丸めない)。
// ■ 内部熱(過剰の内部エネルギー E ≥ 0 —— 初期値 0 は診断の基準): dE/dt = H − E/τ を一定の H の区間 h で解析的に積分。
//     E′ = E e^{−x} + Hτ (1 − e^{−x})・放射 = E (1 − e^{−x}) + Hτ (x − (1 − e^{−x}))(x = h/τ —— x − (1 − e^{−x}) は x < 1e-4 で級数)。E′ + 放射 = E + H h。
// ■ 言わないこと: 実在天体の広い周波数で CTL が正しい・観測の k₂ と遅延・実在の天体の温度や放射(線形の緩和の診断 —— 黒体 T⁴ は熱容量・基準温度・放射率が要る)。
//   冪は `**`/Math.pow を使わず積で書く(エンジンと同じ演算順 —— tests/README §1)。
export const LIB_VERSION = 'w307b-tide3d-lib-1';
export const INERTIA_FACTOR = Object.freeze({ half: 0.5, sphere: 0.4 });
export const HEAT_SERIES_X = 1e-4;

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const norm = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
export const unit = (a) => scale(a, 1 / norm(a));

/**
 * 1 対(i を受け手・j を伴星)の三次元 CTL。エンジン tideEvalRates3 の内側と同じ式・同じ演算順。
 * @param {{G:number,k2:number,lag:number,R:number,mj:number,r:number[],V:number[],Vread?:number[],spin:number,axis:number[]}} o
 * @returns 力(j に作用 —— i へはその負)・トルク(ベクトル)・発熱率・率の内訳
 */
export function ctl3(o) {
  if (![o.G, o.k2, o.lag, o.R, o.mj, o.spin].every(Number.isFinite) || !(o.G > 0) || !(o.k2 > 0) || o.lag < 0 || !(o.R > 0) || !(o.mj > 0)) throw new Error('ctl3: 定義域の外');
  const [rx, ry, rz] = o.r, r2 = rx * rx + ry * ry + rz * rz;
  if (!(r2 > 0)) throw new Error('ctl3: 一致点');
  const [vvx, vvy, vvz] = o.V, [Vx, Vy, Vz] = o.Vread || o.V;
  const R = o.R, R2 = R * R, R5 = R2 * R2 * R, mj = o.mj, Om = o.spin, [ax, ay, az] = o.axis;
  const B = o.G * o.k2 * mj * mj * R5, r4 = r2 * r2, r6 = r4 * r2, r8 = r4 * r4;
  const cc = 3 * B / r8;
  const cons = [-cc * rx, -cc * ry, -cc * rz];
  let diss = [0, 0, 0], torque = [0, 0, 0], heat = 0, mix = 0, Kspin = 0, Korb = 0, slip = [0, 0, 0];
  if (o.lag > 0) {
    const d = 3 * B * o.lag / (r8 * r2), rv = rx * Vx + ry * Vy + rz * Vz;
    const sx = Vx - Om * (ay * rz - az * ry), sy = Vy - Om * (az * rx - ax * rz), sz = Vz - Om * (ax * ry - ay * rx);
    const dx = -d * (2 * rx * rv + r2 * sx), dy = -d * (2 * ry * rv + r2 * sy), dz = -d * (2 * rz * rv + r2 * sz);
    diss = [dx, dy, dz]; slip = [sx, sy, sz];
    torque = [-(ry * dz - rz * dy), -(rz * dx - rx * dz), -(rx * dy - ry * dx)];
    heat = d * (2 * rv * rv + r2 * (sx * sx + sy * sy + sz * sz));
    mix = dx * (vvx - Vx) + dy * (vvy - Vy) + dz * (vvz - Vz);
    Kspin = 3 * B * o.lag / r6; Korb = 9 * B * o.lag / r8;
  }
  const F = [cons[0] + diss[0], cons[1] + diss[1], cons[2] + diss[2]];
  const omega = [Om * ax, Om * ay, Om * az];
  return { B, F, cons, diss, torque, heat, mix, slip, Kspin, Korb, U: -B / (2 * r6),
    brake: torque[0] * ax + torque[1] * ay + torque[2] * az,
    powerCons: cons[0] * vvx + cons[1] * vvy + cons[2] * vvz, powerDissOrbit: dot(diss, o.V), powerSpin: dot(torque, omega) };
}

/**
 * 少数粒子の系(エンジンと同じ和の順序: 受け手 i の昇順 × 伴星 j の昇順)。
 * bodies: [{m, x:[3], v:[3], spin, axis:[3], R, tide:{k2,lag}|null, pinned?}]
 */
export function ctl3System(bodies, opt) {
  const G = opt.G, f = INERTIA_FACTOR[opt.inertia || 'half'];
  const n = bodies.length, F = bodies.map(() => [0, 0, 0]), T = bodies.map(() => [0, 0, 0]), H = bodies.map(() => 0);
  let heat = 0, powerCons = 0, tauMin = Infinity, pairs = 0;
  for (let i = 0; i < n; i++) {
    const bi = bodies[i];
    if (!bi || bi.pinned || !bi.tide || !(bi.R > 0) || !(bi.m > 0)) continue;
    const Ii = f * bi.m * bi.R * bi.R;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const bj = bodies[j];
      if (!bj || bj.pinned || !(bj.m > 0)) continue;
      const p = ctl3({ G, k2: bi.tide.k2, lag: bi.tide.lag, R: bi.R, mj: bj.m, r: sub(bj.x, bi.x), V: sub(bj.v, bi.v), spin: bi.spin, axis: bi.axis });
      for (let c = 0; c < 3; c++) { F[j][c] += p.F[c]; F[i][c] -= p.F[c]; T[i][c] += p.torque[c]; }
      heat += p.heat; H[i] += p.heat; powerCons += p.powerCons; pairs++;
      if (p.Kspin > 0) { const mu = bi.m * bj.m / (bi.m + bj.m); tauMin = Math.min(tauMin, Ii / p.Kspin, mu / p.Korb); }
    }
  }
  return { F, torque: T, heatRate: H, heat, powerCons, tauMin, pairs };
}

/** 内部熱の 1 区間(エンジン tideHeatCell と同じ式)。返り値 [E′, 放射] */
export function heatCell(E, H, h, tau) {
  if (![E, H, h, tau].every(Number.isFinite) || E < 0 || H < 0 || h < 0 || !(tau > 0)) throw new Error('heatCell: 定義域の外');
  const x = h / tau, loss = -Math.expm1(-x);
  const g = (x < HEAT_SERIES_X) ? x * x * (0.5 - x * (1 / 6 - x / 24)) : x - loss;
  return [E - E * loss + H * tau * loss, E * loss + H * tau * g];
}

/** 円軌道・自転軸が軌道の法線と平行のときの解析式: τ∥ = (3BΔt/r⁶)(n − Ω)(Ω > n で減速)・Q̇ = (3BΔt/r⁶) r² ... の自転の項 */
export function circularTorque({ G, k2, lag, R, mj, a, n, spin }) {
  const R2 = R * R, R5 = R2 * R2 * R, B = G * k2 * mj * mj * R5, a2 = a * a, a6 = a2 * a2 * a2;
  return 3 * B * lag / a6 * (n - spin);
}

/** 軸 n̂ まわりの角 θ の回転行列(Rodrigues)を v に掛ける */
export function rotate(v, nAxis, th) {
  const k = unit(nAxis), c = Math.cos(th), s = Math.sin(th), kv = dot(k, v), kx = cross(k, v);
  return [v[0] * c + kx[0] * s + k[0] * kv * (1 - c), v[1] * c + kx[1] * s + k[1] * kv * (1 - c), v[2] * c + kx[2] * s + k[2] * kv * (1 - c)];
}

/** 純関数の検査(QA が同じ関数を QA の中で走らせる)。planarCtlPair は tests/lib-w292d-tide.mjs の ctlPair(呼ぶ側が渡す —— 循環を避ける) */
export function runChecks(planarCtlPair) {
  const out = {};
  // ① 二次元の極限: ctlPair とビット同一
  const P = { G: 1, k2: 0.3, lag: 0.05, R: 0.7, mj: 2, r: [3, 0.4], V: [-0.2, 0.6], Omega: 0.8 };
  const old = planarCtlPair(P), flat = ctl3({ G: P.G, k2: P.k2, lag: P.lag, R: P.R, mj: P.mj, r: [P.r[0], P.r[1], 0], V: [P.V[0], P.V[1], 0], spin: P.Omega, axis: [0, 0, 1] });
  out.planarBitSame = Object.is(flat.diss[0], old.diss[0]) && Object.is(flat.diss[1], old.diss[1]) && Object.is(flat.torque[2], old.torque) && Object.is(flat.heat, old.heat)
    && Object.is(flat.cons[0], old.cons[0]) && Object.is(flat.cons[1], old.cons[1]) && flat.diss[2] === 0 && flat.torque[0] === 0 && flat.torque[1] === 0;
  // ② 非共面の配置で仕事と熱の恒等式・熱の非負・角運動量の交換
  const C = { G: 1, k2: 0.3, lag: 0.05, R: 0.7, mj: 2, r: [3, 0.4, 0.8], V: [-0.2, 0.6, 0.1], spin: 0.9, axis: unit([0.2, -0.1, 0.8]) };
  const t = ctl3(C);
  const er = t.powerDissOrbit + t.powerSpin + t.heat;
  out.workHeatResidual = er / Math.max(t.heat, Math.abs(t.powerSpin), Math.abs(t.powerDissOrbit));
  out.heatPositive = t.heat > 0;
  const rxF = cross(C.r, t.diss), lres = norm(add(rxF, t.torque)) / norm(t.torque);
  out.angMomResidual = lres;
  // ③ 回転の共変性(座標軸の正の循環置換はビット同一・一般の回転は丸め床)
  const perm = (x) => [x[1], x[2], x[0]];
  const tp = ctl3(Object.assign({}, C, { r: perm(C.r), V: perm(C.V), axis: perm(C.axis) }));
  out.permBitSame = [0, 1, 2].every((k) => Object.is(tp.torque[k], perm(t.torque)[k]) && Object.is(tp.diss[k], perm(t.diss)[k])) && Object.is(tp.heat, t.heat);
  const nA = [0.3, -0.7, 0.4], th = 0.83, Rv = (v) => rotate(v, nA, th);
  const tr = ctl3(Object.assign({}, C, { r: Rv(C.r), V: Rv(C.V), axis: Rv(C.axis) }));
  out.rotCovRel = Math.max(norm(sub(tr.torque, Rv(t.torque))) / norm(t.torque), norm(sub(tr.diss, Rv(t.diss))) / norm(t.diss), Math.abs(tr.heat - t.heat) / t.heat);
  // ④ 円軌道の解析式(自転軸 ∥ 軌道の法線): τ∥ = (3BΔt/r⁶)(n − Ω)
  const G = 1, M = 2, a = 3, n = Math.sqrt(G * (M + 0.1) / (a * a * a));
  const circ = (spin) => ctl3({ G, k2: 0.3, lag: 0.05, R: 0.7, mj: M, r: [a, 0, 0], V: [0, n * a, 0], spin, axis: [0, 0, 1] });
  const ratios = [3 * n, 0.5 * n, -n].map((sp) => circ(sp).brake / circularTorque({ G, k2: 0.3, lag: 0.05, R: 0.7, mj: M, a, n, spin: sp }));
  out.circularRatio = ratios;
  out.circularSigns = { fastPrograde: circ(3 * n).brake < 0, slowPrograde: circ(0.5 * n).brake > 0, retrograde: circ(-n).brake > 0, synchronous: Math.abs(circ(n).brake) < 1e-12 * Math.abs(circ(3 * n).brake) };
  // ⑤ 内部熱の 1 区間: 非負・収支・半歩 2 回・級数と直接の継ぎ目
  const hc = heatCell(3, 2, 0.4, 5), h1 = heatCell(3, 2, 0.2, 5), h2 = heatCell(h1[0], 2, 0.2, 5);
  out.heatNonNeg = hc[0] >= 0 && hc[1] >= 0 && heatCell(0, 0, 1, 1)[0] === 0 && heatCell(0, 1, 1e-12, 1)[1] >= 0;
  out.heatBudget = Math.abs(hc[0] + hc[1] - 3 - 2 * 0.4) / 3.8;
  out.heatHalfTwice = Math.abs(hc[0] - h2[0]) / hc[0];
  out.heatHalfTwiceRad = Math.abs(hc[1] - (h1[1] + h2[1])) / hc[1];
  const xs = HEAT_SERIES_X, seam = [0.999999 * xs, 1.000001 * xs].map((x) => heatCell(0, 1, x, 1)[1] / (x - (-Math.expm1(-x))));
  out.heatSeriesSeam = Math.abs(seam[0] - 1) + Math.abs(seam[1] - 1);
  out.heatSteady = Math.abs(heatCell(0, 2, 200, 5)[0] / (2 * 5) - 1);   // 長い区間で E → Hτ
  // ⑥ 定義域の外は投げる
  let threw = 0;
  for (const fn of [() => ctl3(Object.assign({}, C, { lag: -1 })), () => ctl3(Object.assign({}, C, { r: [0, 0, 0] })), () => heatCell(1, -1, 1, 1), () => heatCell(1, 1, 1, 0)]) { try { fn(); } catch (e) { threw++; } }
  out.domainThrows = threw;
  out.gates = {
    planarBitSame: out.planarBitSame === true, workHeat: Math.abs(out.workHeatResidual) < 1e-12 && out.heatPositive, angMom: out.angMomResidual < 1e-14,
    permBitSame: out.permBitSame === true, rotCov: out.rotCovRel < 1e-13, circular: ratios.every((r) => Math.abs(r - 1) < 1e-12) && Object.values(out.circularSigns).every(Boolean),
    heatNonNeg: out.heatNonNeg === true, heatBudget: out.heatBudget < 1e-15, heatHalfTwice: out.heatHalfTwice < 1e-14 && out.heatHalfTwiceRad < 1e-13,
    heatSeries: out.heatSeriesSeam < 1e-9 && out.heatSteady < 1e-12, domain: threw === 4 };
  out.ok = Object.values(out.gates).every(Boolean);
  return out;
}

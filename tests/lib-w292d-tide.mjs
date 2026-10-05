// 第292便d(原仮定者の裁定(第82報)⑦「慣性決定力版では引きずりの実装とともに潮汐力の実装も進める。引きずりと潮汐力が合わさることで
// 自転速度に影響する高次の項が出現する。粒子を近似した多粒子サンプルでは潮汐力は無視するなど最適化を行う」・統括の検証項目 R140)——
// **明示潮汐の純関数**(Node だけ・html を読まない)。最初の部品は**定時間遅延模型 CTL**(constant time lag)。
//
// ■ 式(2 次元・自転は z 成分のスカラー Ω —— Ω×r = (−Ω r_y, Ω r_x))
//   変形する天体 i(半径 R_i・Love 数 k₂_i・遅延 Δt_i・自転 Ω_i)と伴星 j(点質量 m_j)・r = x_j − x_i・相対速度 V = v_j − v_i:
//     B_i     = G k₂_i m_j² R_i⁵
//     F_cons  = −3 B_i r / r⁸                                      (j に作用・i へ反力 —— 有効ポテンシャル U = −B_i/(2r⁶))
//     F_diss  = −(3 B_i Δt_i / r¹⁰) { 2 r (r·V) + r² [V − Ω_i×r] }  (j に作用・i へ反力)
//     τ_i     = −(r × F_diss)_z                                    (自転へ —— 軌道角運動量の変化 r×F_diss の厳密な負)
//     Q̇       = (3 B_i Δt_i / r¹⁰) { 2 (r·V)² + r² |V − Ω_i×r|² } ≥ 0
//   相手も変形するなら役割を入れ替えて**別に**評価して足す(対ごとに i を受け手として)。
//   恒等式(同じ V で): F_diss·V + τ_i Ω_i = −Q̇(r·(Ω×r)=0 から)。円軌道で Ω_i = n(同期)なら V − Ω×r = 0・r·V = 0 で散逸 0(保存力は 0 でない)。
//   円軌道の自転トルク τ_i = (3 B_i Δt_i / r⁶)(n − Ω_i) —— Ω_i > n で減速・発熱は正。
// ■ 監視する時間尺度: K_spin = 3BΔt/r⁶ = |∂τ/∂Ω|・τ_spin = I/K_spin、K_orb = 9BΔt/r⁸(動径の減衰率の最大)・τ_orb = μ/K_orb、
//   τ_tide = min(τ_spin, τ_orb)。エンジンは dt > 0.1 τ_tide なら潮汐だけを分割する。
// ■ 0 にするもの: 試験粒子(源にならない —— 潮汐を起こさない・受けない)・代表粒子(superparticle —— 平滑化長を R⁵ に入れない)・
//   pinned(規定運動 —— 対から外す)・質量が正でない粒子・宣言の無い受け手。
// ■ しないこと・言わないこと: 実在天体の広い周波数で CTL が正しいとは仮定しない・月の後退率に合わせない・
//   「全系の保存則が閉じた」と書かない(潮汐の部品は角運動量交換と熱が閉じるが、慣性引きずりの u の移送の帳簿は別)。
//   冪は `**`/Math.pow を使わず積で書く(tests/README §1)。**エンジン(beta/index.html の tideEvalRates)と同じ式・同じ演算順**。
export const TIDE_LIB_VERSION = 'w292d-tide-lib-1';
export const INERTIA_FACTOR = Object.freeze({ half: 0.5, sphere: 0.4 });

/**
 * 1 対(i を受け手・j を伴星)の CTL。返り値は j に作用する力(i にはその負)・i の自転トルク・発熱率・率の内訳。
 * @param {{G:number,k2:number,lag:number,R:number,mj:number,r:number[],V:number[],Omega:number,Vread?:number[]}} o
 *   Vread: 潮汐が読む相対速度(既定 V —— velocity:"xdot" のときは V+Δu)。仕事は V(力学の速度)で測る。
 */
export function ctlPair(o) {
  const rx = o.r[0], ry = o.r[1], r2 = rx * rx + ry * ry;
  const vvx = o.V[0], vvy = o.V[1];
  const Vx = o.Vread ? o.Vread[0] : vvx, Vy = o.Vread ? o.Vread[1] : vvy;
  const R = o.R, R2 = R * R, R5 = R2 * R2 * R, mj = o.mj, Om = o.Omega;
  const B = o.G * o.k2 * mj * mj * R5, r4 = r2 * r2, r6 = r4 * r2, r8 = r4 * r4;
  const cc = 3 * B / r8;
  const cons = [-cc * rx, -cc * ry];
  let diss = [0, 0], torque = 0, heat = 0, Kspin = 0, Korb = 0, mix = 0;
  if (o.lag > 0) {
    const d = 3 * B * o.lag / (r8 * r2), rv = rx * Vx + ry * Vy;
    const sx = Vx + Om * ry, sy = Vy - Om * rx;
    const dx = -d * (2 * rx * rv + r2 * sx), dy = -d * (2 * ry * rv + r2 * sy);
    diss = [dx, dy];
    torque = -(rx * dy - ry * dx);
    heat = d * (2 * rv * rv + r2 * (sx * sx + sy * sy));
    mix = dx * (vvx - Vx) + dy * (vvy - Vy);
    Kspin = 3 * B * o.lag / r6; Korb = 9 * B * o.lag / r8;
  }
  const F = [cons[0] + diss[0], cons[1] + diss[1]];
  return { B, F, cons, diss, torque, heat, mix, Kspin, Korb, U: -B / (2 * r6),
    powerCons: cons[0] * vvx + cons[1] * vvy, powerDissOrbit: diss[0] * vvx + diss[1] * vvy, powerSpin: torque * Om };
}

/**
 * 少数粒子の系(エンジンと同じ和の順序: 受け手 i の昇順 × 伴星 j の昇順)。
 * bodies: [{m, x, y, vx, vy, spin, R, tide:{k2,lag}|null, pinned?, test?, superparticle?, u?:[ux,uy]}]
 * @returns {{F:number[][], torque:number[], heat:number, mix:number, powerCons:number, tauMin:number, pairs:number}}
 */
export function ctlSystem(bodies, opt) {
  const G = opt.G, f = INERTIA_FACTOR[opt.inertia || 'half'], xdot = opt.velocity === 'xdot';
  const n = bodies.length, F = bodies.map(() => [0, 0]), torque = bodies.map(() => 0);
  let heat = 0, mix = 0, powerCons = 0, tauMin = Infinity, pairs = 0;
  const skip = (b) => !b || b.pinned || b.test || b.superparticle || !(b.m > 0);
  for (let i = 0; i < n; i++) {
    const bi = bodies[i];
    if (skip(bi) || !bi.tide || !(bi.R > 0)) continue;
    const Ii = f * bi.m * bi.R * bi.R;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const bj = bodies[j];
      if (skip(bj)) continue;
      const r = [bj.x - bi.x, bj.y - bi.y];
      if (!(r[0] * r[0] + r[1] * r[1] > 0)) continue;
      const V = [bj.vx - bi.vx, bj.vy - bi.vy];
      const Vread = xdot ? [V[0] + ((bj.u || [0, 0])[0] - (bi.u || [0, 0])[0]), V[1] + ((bj.u || [0, 0])[1] - (bi.u || [0, 0])[1])] : null;
      const p = ctlPair({ G, k2: bi.tide.k2, lag: bi.tide.lag, R: bi.R, mj: bj.m, r, V, Vread, Omega: bi.spin });
      F[j][0] += p.F[0]; F[j][1] += p.F[1]; F[i][0] -= p.F[0]; F[i][1] -= p.F[1];
      torque[i] += p.torque; heat += p.heat; mix += p.mix; powerCons += p.powerCons; pairs++;
      if (p.Kspin > 0) { const mu = bi.m * bj.m / (bi.m + bj.m); tauMin = Math.min(tauMin, Ii / p.Kspin, mu / p.Korb); }
    }
  }
  return { F, torque, heat, mix, powerCons, tauMin, pairs };
}

/** 円軌道の解析の自転トルク τ = (3BΔt/r⁶)(n − Ω)(B = G k₂ m_j² R⁵)。 */
export function circularSpinTorque({ G, k2, lag, R, mj, r, n, Omega }) {
  const R2 = R * R, R5 = R2 * R2 * R, B = G * k2 * mj * mj * R5, r2 = r * r, r6 = r2 * r2 * r2;
  return 3 * B * lag / r6 * (n - Omega);
}

/** 純関数の検査 6 項(R140 —— 数値は器が正本に記録し、QA が同じ関数で引き直す)。 */
export const CHECK_DECL = Object.freeze({
  G: 1, bodies: Object.freeze([
    Object.freeze({ m: 3, x: 0.25, y: -0.5, vx: 0.125, vy: -0.375, spin: 0.75, R: 0.6, tide: Object.freeze({ k2: 0.3, lag: 0.05 }) }),
    Object.freeze({ m: 1.5, x: 4.5, y: 1.25, vx: -0.25, vy: 0.625, spin: -0.2, R: 0.4, tide: Object.freeze({ k2: 0.1, lag: 0.02 }) }),
    Object.freeze({ m: 0.5, x: -3, y: 2.75, vx: 0.375, vy: 0.25, spin: 0.1, R: 0.2, tide: null }),
  ]),
  circ: Object.freeze({ M: 2, m: 0.5, a: 6, R: 0.7, k2: 0.25, lag: 0.04 }),
  fastFactor: 3,
});
const relErr = (a, s) => Math.abs(a) / Math.max(s, 1e-300);
export function runChecks() {
  const D = CHECK_DECL, bodies = D.bodies.map((b) => Object.assign({}, b));
  const S = ctlSystem(bodies, { G: D.G });
  // ① 作用反作用: ΣF = 0
  const sF = [0, 0]; let fScale = 0;
  for (const z of S.F) { sF[0] += z[0]; sF[1] += z[1]; fScale = Math.max(fScale, Math.abs(z[0]), Math.abs(z[1])); }
  const c1 = { sumF: sF, scale: fScale, rel: relErr(Math.hypot(sF[0], sF[1]), fScale) };
  c1.ok = c1.rel <= 1e-12;
  // ② 軌道 + 自転のトルク収支: Σ x×F + Σ τ = 0
  let dLorb = 0, tq = 0, lScale = 0;
  bodies.forEach((b, k) => { const t = b.x * S.F[k][1] - b.y * S.F[k][0]; dLorb += t; lScale = Math.max(lScale, Math.abs(t)); });
  for (const t of S.torque) { tq += t; lScale = Math.max(lScale, Math.abs(t)); }
  const c2 = { orbit: dLorb, spin: tq, residual: dLorb + tq, rel: relErr(dLorb + tq, lScale) };
  c2.ok = c2.rel <= 1e-12;
  // ③ 散逸仕事 + 発熱の残差: ΣF·v + Στ Ω − P_cons + Q̇ = 0(丸め床)
  let pw = 0, eScale = S.heat;
  bodies.forEach((b, k) => { const t = S.F[k][0] * b.vx + S.F[k][1] * b.vy; pw += t; eScale = Math.max(eScale, Math.abs(t)); });
  bodies.forEach((b, k) => { const t = S.torque[k] * b.spin; pw += t; eScale = Math.max(eScale, Math.abs(t)); });
  const res3 = pw - S.powerCons + S.heat;
  const c3 = { work: pw, cons: S.powerCons, heat: S.heat, residual: res3, rel: relErr(res3, eScale), heatPositive: S.heat > 0 };
  c3.ok = c3.rel <= 1e-12 && c3.heatPositive;
  // ④ 同期自転の円軌道: 散逸トルク・発熱 0(保存力は 0 でない)
  const C = D.circ, nC = Math.sqrt(D.G * (C.M + C.m) / (C.a * C.a * C.a)), vRel = nC * C.a;
  const sync = ctlPair({ G: D.G, k2: C.k2, lag: C.lag, R: C.R, mj: C.m, r: [C.a, 0], V: [0, vRel], Omega: nC });
  const c4 = { n: nC, torque: sync.torque, heat: sync.heat, consMag: Math.hypot(sync.cons[0], sync.cons[1]),
    dissMag: Math.hypot(sync.diss[0], sync.diss[1]) };
  c4.ok = Math.abs(c4.torque) <= 1e-15 * c4.consMag * C.a && c4.heat <= 1e-15 * c4.consMag * vRel && c4.consMag > 0 && c4.dissMag <= 1e-15 * c4.consMag;
  // ⑤ 自転を速くすると減速トルクと正の発熱(解析の τ=(3BΔt/r⁶)(n−Ω) と一致)
  const fast = ctlPair({ G: D.G, k2: C.k2, lag: C.lag, R: C.R, mj: C.m, r: [C.a, 0], V: [0, vRel], Omega: D.fastFactor * nC });
  const ana = circularSpinTorque({ G: D.G, k2: C.k2, lag: C.lag, R: C.R, mj: C.m, r: C.a, n: nC, Omega: D.fastFactor * nC });
  const slow = ctlPair({ G: D.G, k2: C.k2, lag: C.lag, R: C.R, mj: C.m, r: [C.a, 0], V: [0, vRel], Omega: 0.5 * nC });
  const c5 = { torqueFast: fast.torque, analytic: ana, rel: relErr(fast.torque - ana, Math.abs(ana)), heatFast: fast.heat, torqueSlow: slow.torque, heatSlow: slow.heat };
  c5.ok = fast.torque < 0 && fast.heat > 0 && c5.rel <= 1e-12 && slow.torque > 0 && slow.heat > 0;
  // ⑥ 代表粒子・試験粒子は 0(受け手としても伴星としても)
  const zero = (mod) => { const bs = D.bodies.map((b) => Object.assign({}, b)); mod(bs); return ctlSystem(bs, { G: D.G }); };
  const z1 = zero((bs) => { bs[0] = Object.assign({}, bs[0], { superparticle: true }); bs[1] = Object.assign({}, bs[1], { test: true }); });
  const z2 = zero((bs) => { bs[1] = Object.assign({}, bs[1], { test: true }); bs[2] = Object.assign({}, bs[2], { test: true }); });
  const allZero = (s) => s.F.every((z) => z[0] === 0 && z[1] === 0) && s.torque.every((t) => t === 0) && s.heat === 0;
  const c6 = { superAndTest: allZero(z1), pairsSuperAndTest: z1.pairs, onlyReceiverLeft: allZero(z2), pairsOnlyReceiver: z2.pairs };
  c6.ok = c6.superAndTest && c6.onlyReceiverLeft;
  return { actionReaction: c1, torqueBalance: c2, workHeat: c3, syncZero: c4, fastBrakes: c5, superTestZero: c6,
    ok: c1.ok && c2.ok && c3.ok && c4.ok && c5.ok && c6.ok };
}

// 第327便a(原仮定者の回答(2026-11-05 —— AN534「金星の逆回転と内部熱がまだ解決していないので、金星に影響する項目は検証対象。「角速度の和」は依頼したイメージ」・
//   AN535「両方K1が成立する太陽と木星は、密度が低い恒星と気体惑星である。金星は固体惑星なので、金星の引きずり半径でのフィットを検証する」・
//   AN537「潮汐の応答は、天体ごとに自由。法則を探す検証は行う」)・統括の検証項目 R295): **軸引きずりの「角速度の和」の族 S と否定対照の族 E の純関数**
//   (器 tests/exp-w327a-axialsum.mjs と QA lint.axialSum327a が読む —— html を読まない・状態を持たない・エンジンの式を写さない)。
//
// ■ 族 S(主 —— 依頼の像「観測の自転 = 由来ごとの角速度の和」を実現する受動の構成則 —— 宣言)
//   受け手 i の潮汐でない由来 s(銀河・K1)の角速度の寄与 v_s(銀河 v_G = A f_i ĝ・K1 v_j = s_j t_ij —— 第326便d の伝達)と正の配分 w_s(Σ_s w_s = 1 —— 宣言の構成則で、
//   観測で決まった値ではない)で、目標 ν_s = v_s/w_s・応答 Γ_s = Γ_i⁰ w_s → 口のトルク N_s = Γ_i⁰(v_s − w_s Ω)。潮汐と源の反作用を除いた定常は **Ω = Σ_s v_s**(omegaSum)。
//   潮汐は天体ごとに自由な非負の係数 β_i で口 Γ = Γ_i⁰ β_i y_ij・目標 n_ij(y は法則の重み —— 自由な段では 1)—— 角速度の寄与 β_i y_ij (n_ij − Ω) として和に入る。
//   各口は受動(Q_s = Γ_s abs(ν_s − Ω)² ≥ 0・P_s = N_s·ν_s = N_s·Ω + Q_s)—— 和を採ってもエネルギーの帳簿は閉じる。由来を細分しても(v と w を同じ比で分ける)
//   目標 v/w は同じなので、トルク・供給・熱は変わらない。定常の自転は配分 w に依らない(源の反作用の分を除く —— K1 の伝達は 1e-20 の桁)が、熱は w で変わる。
// ■ 族 E(否定対照 —— 第326便d のトルクの釣り合い: 目標 ν_s = v_s・Γ_s = Γ_i⁰ —— 同じ Γ の口の定常は目標の**平均**)。和と平均の違いの最小の例を門に置く。
// ■ 帳簿は第326便d と同じ口座(Q は口ごと —— 合成の後に取らない・逆向きも足す・K1 の口の仕事は源の自転の口座の移し替え・銀河の中心の供給 + 軌道の仕事 = 熱 = 放射)。
//   応答の絶対の尺度(全 Γ の倍率 λ)は自転の定常値だけでは決まらない(A・β は同じ・熱は λ 倍)。
// ■ 言わないこと: 内部熱・金星の逆回転を説明したとは書かない・銀河場を同定したと数えない・負の係数を要する解は不採用(0 へ丸めない)・格子で見つけた数を条件と残差なしに結論にしない。
import * as E from './lib-w326d-axialheat.mjs';
export const LIB_VERSION = 'w327a-axialsum-lib-1';
const { dot, add, sub, scale, norm, relD } = E;
const vec3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
const SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違える)

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  families: Object.freeze(['S', 'E']), main: 'S', control: 'E',
  // 配分 w(族 S の構成則 —— 主は均等・感度の列は銀河の口に 0.9/0.1・残りを K1 の口で均等に分ける)
  allocations: Object.freeze({ equal: Object.freeze({ gal: null }), galHeavy: Object.freeze({ gal: 0.9 }), k1Heavy: Object.freeze({ gal: 0.1 }) }),
  allocationMain: 'equal',
  // 受け手の応答のべき p の格子(第326便d と同じ —— f_i = (R_d,i/R_d,☉)^p)・主の p(第326便d の熱の表の p —— 太陽–木星–イオが族 E で入る格子の点のうち 0 に最も近い p)
  pGrid: E.DECL.pGrid, pMain: -0.75,
  // 銀河の応答の規約(金星の R_d を振るとき —— f_i = (R_d,i^規則/R_d,☉)^p × (R_d,i/R_d,i^規則)^q。規則の天体〔R_d = Y_k m〕では (m_i/m_☉)^p —— 第326便d と同じ)
  //   q = 1・p = 0: 今のエンジンの銀河の軸の口の型(rdPow 1・massPow −1 —— R_d に比例)/q = 0: 金星の R_d は太陽の K1 の受け口だけを変える(銀河の応答は R_d に依らない)/
  //   q = 1・p = 1: 半径だけ(R_d/R_d,☉)/p = −0.75 の 3 列(木星とイオが入る p —— 同じ q の型)
  conventions: Object.freeze([
    Object.freeze({ key: 'q1mass', q: 1, p: 0, ja: 'R_d に比例(q = 1・p = 0 —— 今のエンジンの型 (R_d/R_d,☉)(m_☉/m))' }),
    Object.freeze({ key: 'rdFree', q: 0, p: 0, ja: 'R_d に依らない(q = 0・p = 0 —— 金星の R_d は太陽の K1 の受け口だけを変える)' }),
    Object.freeze({ key: 'radiusOnly', q: 1, p: 1, ja: '半径だけ(q = 1・p = 1 —— R_d/R_d,☉)' }),
    Object.freeze({ key: 'q1mass_pMain', q: 1, p: -0.75, ja: 'R_d に比例(q = 1)・p = -0.75' }),
    Object.freeze({ key: 'rdFree_pMain', q: 0, p: -0.75, ja: 'R_d に依らない(q = 0)・p = -0.75' }),
    Object.freeze({ key: 'rdPow_pMain', q: -0.75, p: -0.75, ja: '第326便d の型 (R_d/R_d,☉)^p(q = p = -0.75)' }),
  ]),
  // 金星の受け手の R_d の格子(器が作り直す —— K1 の値の倍率・絶対の値〔半桁ごと〕・観測半径 R_obs)と重なりの手前の探り
  venusRd: Object.freeze({ k1Mult: Object.freeze([0.25, 0.5, 1, 2, 4, 8]), absLog10: Object.freeze(Array.from({ length: 27 }, (_, k) => -2 + k / 2)), robs: true,
    overlapProbe: Object.freeze([1.5e11, 3e11, 1e12]), bisectIter: 40, rootIter: 50 }),
  sources: Object.freeze(['now', 'J']),   // 源の R_src(今 R_src = R_d・J〔太陽 0.07・木星 0.254〕—— 太陽と木星の核は K1 のまま・R_src は変えない)
  orders: Object.freeze([8, 12, 16]),   // 求積の次数の感度(既定 8)
  // 固体の R_d の規則の候補(走行の前の宣言 —— 合わせない): K1 の規則のまま/観測半径。地球に当てる(検査)・イオは参考の列
  solidRules: Object.freeze(['k1', 'robs']),
  phase: Object.freeze({ sun: 'stellar', venus: 'solid', earth: 'solid', jupiter: 'fluidGiant', io: 'solid', [SAT]: 'fluidGiant' }),
  // 文献の k2/Q(比べる列 —— 固定しない・概数・本便は一次資料に当たっていない。金星の Q は文献で決まっていない)
  k2Q: Object.freeze({ venus: null, earth: 0.025, jupiter: 1.1e-5, io: 0.015, [SAT]: 2.3e-4 }),
  k2: Object.freeze({ venus: 0.295, earth: 0.30, jupiter: 0.59, io: null, [SAT]: 0.39 }),
  // 潮汐の法則の候補(Γ_ij = Γ_i⁰ C y_ij —— y は受け手 i・起潮天体 j の重み): const(y = 1 —— 全天体に同じ係数)/classical(y = X_ij = G M_j² R_i⁵/(a_ij⁶ I_i)
  //   —— 一定の時間の遅れの古典の尺度を受け手の慣性で割った s⁻²)/classicalPow(y = X_ij^α —— α も決める)。学ぶ天体は金星・木星・イオのうち非負の係数を持つ天体・予言は地球と土星
  laws: Object.freeze([
    Object.freeze({ key: 'const', ja: 'y = 1(全天体に同じ係数 C)', params: 1 }),
    Object.freeze({ key: 'classical', ja: 'y = X = G M_j² R_i⁵/(a⁶ I_i)(古典の尺度・α = 1)', params: 1 }),
    Object.freeze({ key: 'classicalPow', ja: 'y = X^α(α も決める)', params: 2 }),
  ]),
  trainBodies: Object.freeze(['venus', 'jupiter', 'io']), predictBodies: Object.freeze(Object.keys({ earth: 1, saturn: 1 })),
  scaleLambda: 2,
});

/* ───────── 角速度の和 ───────── */
/** 由来ごとの角速度の寄与のベクトルの和(Γ を入れない —— 熱の尺度は決まらない) */
export function omegaSum(parts) {
  const z = [0, 0, 0];
  for (const v of parts) { if (!vec3(v)) throw new RangeError('omegaSum: 各由来は有限の 3 成分'); z[0] += v[0]; z[1] += v[1]; z[2] += v[2]; }
  return z;
}
/** 由来ごとの寄与の平均(族 E の同じ Γ の口の定常 —— 否定対照) */
export function omegaMean(parts) { const z = omegaSum(parts); return scale(z, 1 / parts.length); }
/** 族 S の口(寄与 v・配分 w > 0・基準の応答 Γ0 ≥ 0): 目標 v/w・応答 Γ0 w */
export function sumPort(Omega, v, w, Gamma0) {
  if (!(w > 0) || !Number.isFinite(w)) throw new RangeError('sumPort: 配分 w は正の有限の数');
  const q = E.port(Omega, scale(v, 1 / w), Gamma0 * w);
  return Object.assign(q, { nu: scale(v, 1 / w), Gamma: Gamma0 * w, w });
}

/* ───────── 系(口を明示)———————— */
// 系の形: bodies = [{key, s, a:[3], f(銀河の応答), ports:[{kind:'gal'} | {kind:'k1', src, t:[3]} | {kind:'tide', src, n:[3], y?:number}]}]
//   prm = {family:'S'|'E', A, g:[3], gamma0:{key:Γ⁰}, beta:{key:β}, alloc:{gal:null|w}, k1Mul?:{'recv:src': 倍率}}
const keyIndex = (bodies) => Object.fromEntries(bodies.map((b, i) => [b.key, i]));
/** 受け手の潮汐でない口の配分(族 S): 銀河の口に alloc.gal(null は均等)・残りを K1 の口で均等 */
export function weightsOf(ports, alloc) {
  const nt = ports.filter((q) => q.kind !== 'tide'), n = nt.length, wg = alloc && alloc.gal !== null && alloc.gal !== undefined ? alloc.gal : null;
  return ports.map((q) => {
    if (q.kind === 'tide') return null;
    if (n === 1) return 1;
    if (wg === null) return 1 / n;
    return q.kind === 'gal' ? wg : (1 - wg) / (n - 1);
  });
}
/** 口ごとの寄与 v・目標 ν・応答 Γ・実効の伝達 t'(k1)を作る */
export function portTargets(bodies, prm) {
  const ix = keyIndex(bodies);
  return bodies.map((b) => {
    const g0 = prm.gamma0[b.key], W = weightsOf(b.ports, prm.alloc);
    return b.ports.map((q, k) => {
      if (q.kind === 'tide') { const y = q.y === undefined ? 1 : q.y; return { kind: 'tide', src: q.src, nu: q.n.slice(), Gamma: g0 * prm.beta[b.key] * y, y, w: null }; }
      const w = prm.family === 'S' ? W[k] : 1;
      if (q.kind === 'gal') {
        const v = scale(prm.g, prm.A * b.f);
        return prm.family === 'S' ? { kind: 'gal', v, nu: scale(v, 1 / w), Gamma: g0 * w, w, f: b.f } : { kind: 'gal', v, nu: v, Gamma: g0 * 1, w: 1, f: b.f };
      }
      if (q.kind === 'k1') {
        const src = bodies[ix[q.src]], mul = (prm.k1Mul && prm.k1Mul[b.key + ':' + q.src]) || 1, t1 = scale(q.t, mul), v = scale(t1, src.s);
        const tt = prm.family === 'S' ? scale(t1, 1 / w) : t1;
        return { kind: 'k1', src: q.src, v, t: tt, nu: scale(tt, src.s), Gamma: prm.family === 'S' ? g0 * w : g0 * 1, w, mul };
      }
      throw new RangeError('portTargets: 口の種類 ' + q.kind);
    });
  });
}
/** 系の評価(第326便d の evaluate と同じ口座 —— 目標と応答は portTargets から) */
export function evaluate(bodies, prm) {
  const ix = keyIndex(bodies), PT = portTargets(bodies, prm), react = bodies.map(() => 0), frame = [0, 0, 0];
  const rows = bodies.map((b, i) => {
    const Om = scale(b.a, b.s);
    const ports = PT[i].map((q) => {
      const G = q.Gamma, slip = sub(q.nu, Om), N = scale(slip, G), heat = G * dot(slip, slip), supply = dot(N, q.nu), recvWork = dot(N, Om);
      const r = { kind: q.kind, src: q.src || null, w: q.w, v: q.v || null, nu: q.nu, nuAlong: dot(q.nu, b.a), vAlong: q.v ? dot(q.v, b.a) : null, Gamma: G, negative: G < 0, torque: N, torqueAlong: dot(N, b.a),
        heat, supply, recvWork, closeRes: supply - recvWork - heat };
      if (q.kind === 'k1') {
        const js = ix[q.src], aj = bodies[js].a, tN = dot(q.t, N);
        react[js] += -tN; r.reactionSrc = -tN; r.drawFromSrc = tN * bodies[js].s;
        r.frameReaction = scale(sub(N, scale(aj, tN)), -1);
        for (let c = 0; c < 3; c++) frame[c] += r.frameReaction[c];
      }
      if (q.kind === 'tide') r.y = q.y;
      return r;
    });
    return { key: b.key, s: b.s, a: b.a, Omega: Om, ports };
  });
  let PG = 0, Porb = 0, PK1 = 0, Q = 0, Kdot = 0, maxClose = 0;
  const Lacc = { galaxyCenter: [0, 0, 0], orbits: [0, 0, 0], farFrameHold: [0, 0, 0], farFrameK1: frame.slice() };
  for (let i = 0; i < rows.length; i++) {
    const R = rows[i], b = bodies[i];
    let Nsum = [0, 0, 0], q = 0, absAlong = 0, sc = Math.abs(react[i]);
    for (const p of R.ports) {
      Nsum = add(Nsum, p.torque); q += p.heat; absAlong += Math.abs(p.torqueAlong); sc += Math.abs(p.Gamma) * (norm(p.nu) + Math.abs(b.s));
      if (p.kind === 'gal') { PG += p.supply; Lacc.galaxyCenter = sub(Lacc.galaxyCenter, p.torque); }
      if (p.kind === 'tide') { Porb += p.supply; Lacc.orbits = sub(Lacc.orbits, p.torque); }
      if (p.kind === 'k1') PK1 += p.supply;
      maxClose = Math.max(maxClose, Math.abs(p.closeRes) / Math.max(Math.abs(p.supply), Math.abs(p.recvWork), Math.abs(p.heat), 1e-300));
    }
    const along = dot(Nsum, b.a) + react[i], hd = E.holdOf(Nsum, b.a, R.Omega);
    R.torqueSum = Nsum; R.reaction = react[i]; R.alongResidual = along; R.alongScale = sc; R.alongRel = Math.abs(along) / Math.max(sc, 1e-300); R.heat = q; R.sumAbsAlong = absAlong;
    R.hold = hd.hold; R.holdWork = hd.holdWork; R.reactionVec = scale(b.a, react[i]);
    Lacc.farFrameHold = sub(Lacc.farFrameHold, hd.hold);
    Kdot += along * b.s; Q += q;
  }
  let Lspin = [0, 0, 0];
  for (const R of rows) Lspin = add(Lspin, add(add(R.torqueSum, R.reactionVec), R.hold));
  const Ltot = add(Lspin, add(add(Lacc.galaxyCenter, Lacc.orbits), add(Lacc.farFrameHold, Lacc.farFrameK1)));
  const Lscale = Math.max(...rows.flatMap((R) => R.ports.map((p) => norm(p.torque))), 1e-300);
  const ledger = { galaxySupply: PG, orbitWork: Porb, k1Draw: PK1, heat: Q, radiation: Q, spinPower: Kdot,
    residualRel: Math.abs(PG + Porb - Q - Kdot) / Math.max(Math.abs(PG), Math.abs(Porb), Math.abs(Q), 1e-300),
    k1Transfer: { draw: PK1, sourceReactionWork: -react.reduce((s, r, i) => s + r * bodies[i].s, 0) }, portCloseMaxRel: maxClose,
    L: { galaxyCenter: Lacc.galaxyCenter, orbits: Lacc.orbits, farFrameHold: Lacc.farFrameHold, farFrameK1: Lacc.farFrameK1, totalRel: norm(Ltot) / Lscale } };
  return { rows, ledger, react };
}

/* ───────── 解く(族 S・族 E —— 太陽の式から A・各天体の式から潮汐の係数 β)───────── */
/** 軸の向きの残差を未知の一次式に: res_i = cA_i A + cB_i β_i + c0_i(cB は潮汐の口の y (n·â − s) Γ⁰ の和) */
export function linearRows(bodies, prm) {
  const z = Object.assign({}, prm, { A: 0, beta: Object.fromEntries(bodies.map((b) => [b.key, 0])) }), base = evaluate(bodies, z);
  return bodies.map((b, i) => {
    const g0 = prm.gamma0[b.key];
    let cA = 0, cB = 0;
    for (const q of b.ports) {
      if (q.kind === 'gal') cA += g0 * 1 * b.f * dot(prm.g, b.a);   // 族 S: Γ⁰ w · (f ĝ·â / w) —— 配分は打ち消す
      if (q.kind === 'tide') cB += g0 * (q.y === undefined ? 1 : q.y) * (dot(q.n, b.a) - b.s);
    }
    return { key: b.key, cA, cB, c0: base.rows[i].alongResidual, hasTide: b.ports.some((q) => q.kind === 'tide') };
  });
}
/** 三角の系を解く(第327便a の採否の規則 —— 自由な未知の残らない行は残差が丸めの内でなければ不採用・負の β は不採用で 0 に丸めない) */
export function solve(bodies, prm, ref = 'sun') {
  const L = linearRows(bodies, prm), r0 = L.find((r) => r.key === ref);
  if (!(r0 && !r0.hasTide && r0.cA !== 0)) throw new RangeError('solve: 基準の天体は潮汐の口を持たず銀河の口の係数が 0 でない');
  const A = -r0.c0 / r0.cA, beta = {}, rows = [];
  for (const r of L) {
    const nonTide = r.cA * A + r.c0;   // 潮汐でない口と反作用の軸の向きのトルク(β に依らない)
    if (r.key === ref) { beta[r.key] = 0; rows.push({ key: r.key, beta: null, rejected: false, nonTide }); continue; }
    if (!r.hasTide || r.cB === 0) {
      const scl = Math.abs(r.cA * A) + Math.abs(r.c0), ok = Number.isFinite(nonTide) && Math.abs(nonTide) <= 1e-12 * Math.max(scl, 1e-300);
      beta[r.key] = 0; rows.push({ key: r.key, beta: null, rejected: !ok, unresolved: true, nonTide, residualRel: Math.abs(nonTide) / Math.max(scl, 1e-300) }); continue;
    }
    const bb = -nonTide / r.cB;
    beta[r.key] = bb; rows.push({ key: r.key, beta: bb, rejected: !(bb >= 0), nonTide });
  }
  const ev = evaluate(bodies, Object.assign({}, prm, { A, beta }));
  return { A, beta, rows, lin: L, ev, accepted: rows.every((r) => r.rejected !== true), alongMaxRel: Math.max(...ev.rows.map((q) => q.alongRel)) };
}
/** 潮汐でない口の実効の目標(軸の向き): 族 S は T = â·Σv + 反作用/Γ⁰(定常 Ω = Σv の軸の向き)・族 E は口の目標の平均(反作用は Γ⁰ と口の数で割る) */
export function effectiveTarget(row, s, gamma0, nNonTide, family) {
  return family === 'S' ? s + row.nonTide / gamma0 : s + row.nonTide / (gamma0 * nNonTide);
}
/** Γ に依らない判定(族 S): β ≥ 0 の定常は T と潮汐の目標 n_j の凸結合 —— s がその間に無ければどの β ≥ 0 でも入らない */
export function hullS(s, target, tideTargets) { return E.hullOf(s, [target].concat(tideTargets)); }

/* ───────── 根(符号の変化の二分法 —— 格子の隣り合う点)———————— */
/** fn(x) の符号が x0・x1 で変わるなら二分法の根(対数の軸 —— x > 0)。変わらなければ null */
export function bisectLog(fn, x0, x1, iter = 50) {
  let a = x0, b = x1, fa = fn(a), fb = fn(b);
  if (!(Number.isFinite(fa) && Number.isFinite(fb)) || Math.sign(fa) === Math.sign(fb)) return null;
  for (let k = 0; k < iter; k++) { const m = Math.sqrt(a * b), fm = fn(m); if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else { b = m; fb = fm; } }
  return { x: Math.sqrt(a * b), lo: a, hi: b, fLo: fa, fHi: fb };
}
/** 格子の上の符号の変化の位置(隣り合う点の添字) */
export function signChanges(vals) { const out = []; for (let k = 0; k + 1 < vals.length; k++) if (Number.isFinite(vals[k]) && Number.isFinite(vals[k + 1]) && Math.sign(vals[k]) !== Math.sign(vals[k + 1])) out.push(k); return out; }

/* ───────── 潮汐の法則(Γ_ij = Γ_i⁰ C y_ij)———————— */
/** 法則の重み y_ij(X は古典の尺度 G M_j² R_i⁵/(a_ij⁶ I_i) [s⁻²]) */
export function lawWeight(law, X, alpha) {
  if (law === 'const') return 1;
  if (law === 'classical') return X;
  if (law === 'classicalPow') return Math.pow(X, alpha);
  throw new RangeError('lawWeight: 法則 ' + law);
}
/** 天体の係数の振幅 C_i(法則の重みで起潮天体に分けたとき —— 潮汐でない口のトルク nonTide を打ち消す): C_i = −nonTide/(Γ⁰ Σ_j y_ij (n_ij·â − s)) */
export function amplitudeOf({ nonTide, gamma0, s, tides, law, alpha }) {
  let d = 0;
  for (const t of tides) d += lawWeight(law, t.X, alpha) * (t.nAlong - s);
  return d === 0 ? { C: null, denom: 0 } : { C: -nonTide / (gamma0 * d), denom: gamma0 * d };
}
/** 法則を学ぶ(学ぶ天体の振幅が全部非負のときだけ —— 1 母数は対数の平均・2 母数〔α〕は 2 天体で C が等しい α を二分法で) */
export function fitLaw(law, train) {
  if (law === 'classicalPow') {
    if (train.length !== 2) return { ok: false, why: '2 母数の法則は学ぶ天体 2 つ(厳密に決まる —— 残差は検査にならない)' };
    const gap = (al) => { const a = amplitudeOf(Object.assign({}, train[0], { law, alpha: al })).C, b = amplitudeOf(Object.assign({}, train[1], { law, alpha: al })).C; return Math.log(a) - Math.log(b); };
    let lo = -3, hi = 3, glo = gap(lo), ghi = gap(hi);
    if (!(Number.isFinite(glo) && Number.isFinite(ghi)) || Math.sign(glo) === Math.sign(ghi)) return { ok: false, why: 'α の区間 [−3, 3] に C の等しい点が無い' };
    for (let k = 0; k < 80; k++) { const m = 0.5 * (lo + hi), gm = gap(m); if (Math.sign(gm) === Math.sign(glo)) { lo = m; glo = gm; } else { hi = m; ghi = gm; } }
    const alpha = 0.5 * (lo + hi), Cs = train.map((t) => amplitudeOf(Object.assign({}, t, { law, alpha })).C);
    return { ok: Cs.every((c) => c > 0), alpha, C: Math.sqrt(Cs[0] * Cs[1]), Cs, spreadLog10: Math.abs(Math.log10(Cs[0] / Cs[1])), dof: 0 };
  }
  const Cs = train.map((t) => amplitudeOf(Object.assign({}, t, { law })).C);
  if (!Cs.every((c) => c > 0)) return { ok: false, why: '学ぶ天体の振幅に負か無し', Cs };
  const lg = Cs.map(Math.log10), mean = lg.reduce((a, b) => a + b, 0) / lg.length;
  return { ok: true, alpha: law === 'classical' ? 1 : null, C: Math.pow(10, mean), Cs, spreadLog10: Math.max(...lg) - Math.min(...lg), dof: Cs.length - 1 };
}
/** 法則を固定した予言(族 S: s = (T + C Σ y n)/(1 + C Σ y)・族 E: s = (Σ ν + C Σ y n)/(m + C Σ y) —— T・Σν は観測の s に依らない分) */
export function predictSpin({ family, nonTideAtS0, nNonTide, gamma0, tides, law, C, alpha }) {
  // nonTideAtS0: s = 0 で評価した潮汐でない口の軸の向きのトルク(族 S は Γ⁰(â·Σv) + 反作用・族 E は Γ⁰ Σ ν·â + 反作用)
  let sy = 0, syn = 0;
  for (const t of tides) { const y = lawWeight(law, t.X, alpha); sy += y; syn += y * t.nAlong; }
  const m = family === 'S' ? 1 : nNonTide;
  return (nonTideAtS0 / gamma0 + C * syn) / (m + C * sy);
}

/* ───────── 純関数の場面(QA lint.axialSum327a と器の P 段)———————— */
export function pureScenes() {
  const S = {};
  // ① 和と平均の最小の例(同じ軸の 2 由来 1 と 2・Γ⁰ = 1・潮汐なし): 族 S の定常 3・族 E の定常 1.5(Ω = 3 で族 S の和のトルク 0・族 E の和は −3)
  { const a = [0, 0, 1], v = [[0, 0, 1], [0, 0, 2]], O3 = [0, 0, 3];
    const tS = v.reduce((s, x) => s + sumPort(O3, x, 0.5, 1).torque[2], 0), tE = v.reduce((s, x) => s + E.port(O3, x, 1).torque[2], 0);
    //   系で: 基準 sun(銀河だけ・s = 1 → A = 1)・源 Q(s = 2 —— 反作用は Q の潮汐が受ける)・受け手 P(s = 3 —— 銀河の寄与 1 + Q の K1 の寄与 2)。族 S は β_P = 0(和が観測)・族 E は β_P = 1.5
    const bod = (fam) => solve([{ key: 'sun', s: 1, a, f: 1, ports: [{ kind: 'gal' }] }, { key: 'Q', s: 2, a, f: 1, ports: [{ kind: 'gal' }, { kind: 'tide', src: 'sun', n: [0, 0, 4] }] },
      { key: 'P', s: 3, a, f: 1, ports: [{ kind: 'gal' }, { kind: 'k1', src: 'Q', t: [0, 0, 1] }, { kind: 'tide', src: 'Q', n: [0, 0, 5] }] }],
      { family: fam, g: [0, 0, 1], gamma0: { sun: 1, Q: 1, P: 1 }, beta: {}, alloc: { gal: null } });
    const s3 = bod('S'), e3 = bod('E');
    S.sumVsMean = { sum: omegaSum(v)[2], mean: omegaMean(v)[2], torqueSumAt3: tS, torqueMeanAt3: tE, betaS: s3.beta.P, betaE: e3.beta.P, A: s3.A, sumRow: s3.rows[2].nonTide, meanRow: e3.rows[2].nonTide,
      acceptedS: s3.accepted, acceptedE: e3.accepted }; }
  // ② 120° の 2 由来(同じ大きさ): 和の大きさは 1・平均は 0.5 —— 族 S の口(w = 1/2)の合計トルクは Ω = 和で 0(ベクトルで)
  { const u = [1, 0, 0], v = [Math.cos(2 * Math.PI / 3), Math.sin(2 * Math.PI / 3), 0], O = omegaSum([u, v]), t = add(sumPort(O, u, 0.5, 1).torque, sumPort(O, v, 0.5, 1).torque);
    S.compose120 = { sumNorm: norm(O), meanNorm: norm(omegaMean([u, v])), torqueAtSum: norm(t) }; }
  // ③ 細分の不変(v・w を α と 1 − α に分ける): トルク・供給・熱・受け手の仕事が同じ
  { const O = [0.1, 0.2, 0.3], v = [0.7, -0.2, 0.8], w = 0.4, al = 0.3, a = sumPort(O, v, w, 2.5), b = sumPort(O, scale(v, al), w * al, 2.5), c = sumPort(O, scale(v, 1 - al), w * (1 - al), 2.5);
    S.split = { torque: norm(sub(a.torque, add(b.torque, c.torque))) / norm(a.torque), supply: relD(a.supply, b.supply + c.supply), heat: relD(a.heat, b.heat + c.heat), recvWork: relD(a.recvWork, b.recvWork + c.recvWork) }; }
  // ④ 受動の口(Q ≥ 0・P = N·Ω + Q)—— 決めた 3 例(寄与・配分・Γ⁰)
  S.passive = [[[0.1, -0.2, 0.3], [0.4, 0.5, -0.3], 0.25, 0.7], [[0, 0, -2.99e-7], [0.8, 0, -0.5], 0.5, 1e35], [[1e-6, 2e-6, -5e-6], [-3e-5, 1e-6, 2e-6], 0.9, 3.3e30]]
    .map(([O, v, w, G]) => { const q = sumPort(O, v, w, G); return { heat: q.heat, closeRel: Math.abs(q.residual) / Math.max(Math.abs(q.supply), Math.abs(q.recvWork), q.heat) }; });
  // ⑤ 系(3 天体 —— 銀河・K1・潮汐の口)を族 S と族 E で解く: 帳簿の閉じ・L の総和・支えの仕事 0・K1 の移し替え・尺度 λ・配分の感度(定常は w に依らず熱は変わる)
  { const bodies = [
      { key: 'sun', s: 2, a: [0, 0, 1], f: 1, ports: [{ kind: 'gal' }] },
      { key: 'P', s: 0.25, a: [Math.sin(0.1), 0, Math.cos(0.1)], f: 0.8, ports: [{ kind: 'gal' }, { kind: 'k1', src: 'sun', t: [0, 0.2, -0.9] }, { kind: 'tide', src: 'sun', n: [0, 0, 1] }] },
      { key: 'M', s: 0.6, a: [0, Math.sin(0.05), Math.cos(0.05)], f: 1.5, ports: [{ kind: 'gal' }, { kind: 'k1', src: 'sun', t: [0.1, 0, 0.05] }, { kind: 'k1', src: 'P', t: [0, 0.1, 0.3] }, { kind: 'tide', src: 'P', n: [0, 0, 0.2] }] },
    ];
    const prm = (fam, alloc, lam = 1) => ({ family: fam, g: [0.6, 0, -0.8], gamma0: { sun: 3 * lam, P: 0.5 * lam, M: 0.2 * lam }, beta: {}, alloc });
    // 配分の感度は源の反作用の小さい写し(K1 の伝達 × 1e-9 —— 実在の系の伝達は 1e-20 の桁)で: 定常の β は w に依らず(反作用の分 ≤ 1e-9)・熱は w で変わる
    const tiny = bodies.map((b) => Object.assign({}, b, { ports: b.ports.map((q) => (q.kind === 'k1' ? Object.assign({}, q, { t: scale(q.t, 1e-9) }) : q)) }));
    const sE = solve(bodies, prm('S', { gal: null })), s2 = solve(bodies, prm('S', { gal: null }, 2)), eE = solve(bodies, prm('E', { gal: null }));
    const tE = solve(tiny, prm('S', { gal: null })), sG = solve(tiny, prm('S', { gal: 0.9 })), sK = solve(tiny, prm('S', { gal: 0.1 }));
    const led = (q) => ({ rel: q.ev.ledger.residualRel, L: q.ev.ledger.L.totalRel, hold: Math.max(...q.ev.rows.map((r) => Math.abs(r.holdWork))), k1: relD(q.ev.ledger.k1Transfer.draw, q.ev.ledger.k1Transfer.sourceReactionWork), close: q.ev.ledger.portCloseMaxRel });
    S.system = { S: { A: sE.A, beta: sE.beta, accepted: sE.accepted, along: sE.alongMaxRel, ledger: led(sE), heat: sE.ev.ledger.heat }, E: { A: eE.A, beta: eE.beta, accepted: eE.accepted, along: eE.alongMaxRel, ledger: led(eE) },
      scale: { ARel: relD(s2.A, sE.A), betaRel: Math.max(relD(s2.beta.P, sE.beta.P), relD(s2.beta.M, sE.beta.M)), heatRatio: s2.ev.ledger.heat / sE.ev.ledger.heat },
      alloc: { betaRelG: Math.max(relD(sG.beta.P, tE.beta.P), relD(sG.beta.M, tE.beta.M)), betaRelK: Math.max(relD(sK.beta.P, tE.beta.P), relD(sK.beta.M, tE.beta.M)), heatG: sG.ev.ledger.heat / tE.ev.ledger.heat, heatK: sK.ev.ledger.heat / tE.ev.ledger.heat,
        accepted: tE.accepted && sG.accepted && sK.accepted, betaRelFull: Math.max(relD(solve(bodies, prm('S', { gal: 0.9 })).beta.P, sE.beta.P), relD(solve(bodies, prm('S', { gal: 0.9 })).beta.M, sE.beta.M)),
        ledgerG: led(sG).rel, ledgerK: led(sK).rel } };
  }
  // ⑥ 族 E の evaluate は第326便d の lib の evaluate と同じ数(口を明示した書き直しの照合)
  { const b6 = [{ key: 'sun', s: 2, a: [0, 0, 1], Rd: 1, f: 1, ports: [{ kind: 'gal' }] }, { key: 'P', s: 0.25, a: [Math.sin(0.1), 0, Math.cos(0.1)], Rd: 0.01, f: Math.pow(0.01, -0.5), ports: [{ kind: 'gal' }, { kind: 'k1', src: 'sun', t: [0, 0.2, -0.9] }, { kind: 'tide', src: 'sun', n: [0, 0, 0.3] }] }];
    const p6 = { ref: 'sun', p: -0.5, g: [0.6, 0, -0.8], gamma0: { sun: 3, P: 0.5 }, cGalaxy: 1, cK1: 1, k: { sun: 0, P: 0.7 }, A: 1.3 };
    const old = E.evaluate(b6, p6), neu = evaluate(b6, { family: 'E', A: 1.3, g: p6.g, gamma0: p6.gamma0, beta: { sun: 0, P: 0.7 }, alloc: { gal: null } });
    let d = 0;
    for (let i = 0; i < 2; i++) for (let k = 0; k < old.rows[i].ports.length; k++) for (const f of ['heat', 'supply', 'recvWork', 'torqueAlong']) d = Math.max(d, relD(old.rows[i].ports[k][f], neu.rows[i].ports[k][f]));
    for (const f of ['galaxySupply', 'orbitWork', 'k1Draw', 'heat']) d = Math.max(d, relD(old.ledger[f], neu.ledger[f]));
    S.sameAsW326d = { maxRel: d, alongOld: old.rows[1].alongResidual, alongNew: neu.rows[1].alongResidual }; }
  // ⑦ 採否: 自由な未知の残らない行(潮汐の口なし・ck = 0)の残差は不採用・負の β は不採用で値を残す
  { const a = [0, 0, 1], mk = (s, ports) => [{ key: 'sun', s: 1, a, f: 1, ports: [{ kind: 'gal' }] }, { key: 'P', s, a, f: 1, ports }], pr = { family: 'S', g: [0, 0, 1], gamma0: { sun: 1, P: 1 }, beta: {}, alloc: { gal: null } };
    const r1 = solve(mk(2, [{ kind: 'gal' }]), pr), r2 = solve(mk(2, [{ kind: 'gal' }, { kind: 'tide', src: 'sun', n: [0, 0, 2] }]), pr), r3 = solve(mk(-1, [{ kind: 'gal' }, { kind: 'tide', src: 'sun', n: [0, 0, 0.5] }]), pr);
    S.accept = { noTide: r1.accepted, noTideRes: r1.rows[1].nonTide, ck0: r2.accepted, negBeta: r3.rows[1].beta, negRejected: r3.rows[1].rejected, negAccepted: r3.accepted }; }
  // ⑧ 凸包(族 S): β ≥ 0 は s が T と n の間
  S.hull = { inside: hullS(0.5, 1, [0]).inside, outside: hullS(-0.2, 1, [0.3]).inside };
  // ⑨ 法則の学びと予言(合成の 2 天体 —— 既知の C = 4・α = 0.8 から作った振幅を学び直す・予言は既知の s を返す)
  { const mkT = (X, nA) => ({ X, nAlong: nA }), C0 = 4, al = 0.8;
    const train = [{ s: 2, gamma0: 1, tides: [mkT(0.5, 1), mkT(0.05, 0.2)] }, { s: 3, gamma0: 2, tides: [mkT(2, 1.5)] }].map((t) => {
      let d = 0; for (const q of t.tides) d += Math.pow(q.X, al) * (q.nAlong - t.s); return Object.assign(t, { nonTide: -C0 * t.gamma0 * d });
    });
    const fp = fitLaw('classicalPow', train), f1 = fitLaw('classical', train);
    const sp = predictSpin({ family: 'S', nonTideAtS0: train[1].nonTide + train[1].gamma0 * train[1].s, nNonTide: 1, gamma0: train[1].gamma0, tides: train[1].tides, law: 'classicalPow', C: C0, alpha: al });
    S.law = { alpha: fp.alpha, C: fp.C, ok: fp.ok, spread1: f1.spreadLog10, predS: sp, trueS: train[1].s }; }
  // ⑩ 二分法の根(対数の軸): f(x) = log10(x) − 2 の根 100・符号の変わらない区間は null
  { const r = bisectLog((x) => Math.log10(x) - 2, 1, 1e4, 60); S.root = { x: r ? r.x : null, none: bisectLog((x) => x, 1, 10) === null, changes: signChanges([3, 1, -1, -2, 4]) }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
  const L = S.system;
  return {
    sumVsMean: S.sumVsMean.sum === 3 && S.sumVsMean.mean === 1.5 && S.sumVsMean.torqueSumAt3 === 0 && S.sumVsMean.torqueMeanAt3 === -3 && close(S.sumVsMean.A, 1)
      && S.sumVsMean.sumRow === 0 && close(S.sumVsMean.meanRow, -3) && S.sumVsMean.betaS === 0 && close(S.sumVsMean.betaE, 1.5) && S.sumVsMean.acceptedS && S.sumVsMean.acceptedE,
    compose120: close(S.compose120.sumNorm, 1) && close(S.compose120.meanNorm, 0.5) && S.compose120.torqueAtSum <= 1e-15,
    splitInvariant: S.split.torque <= 1e-14 && S.split.supply <= 1e-14 && S.split.heat <= 1e-14 && S.split.recvWork <= 1e-14,
    passivePorts: S.passive.every((q) => q.heat >= 0 && q.closeRel <= 1e-12),
    systemLedgerS: L.S.accepted && L.S.along <= 1e-12 && L.S.ledger.rel <= 1e-12 && L.S.ledger.L <= 1e-12 && L.S.ledger.hold <= 1e-15 && L.S.ledger.k1 <= 1e-12 && L.S.ledger.close <= 1e-12,
    systemLedgerE: L.E.along <= 1e-12 && L.E.ledger.rel <= 1e-12 && L.E.ledger.L <= 1e-12 && L.E.ledger.k1 <= 1e-12,
    scaleNotIdentified: L.scale.ARel <= 1e-12 && L.scale.betaRel <= 1e-12 && close(L.scale.heatRatio, 2),
    allocationSteadyHeatMoves: L.alloc.betaRelG <= 1e-8 && L.alloc.betaRelK <= 1e-8 && Math.abs(L.alloc.heatG - 1) > 1e-3 && Math.abs(L.alloc.heatK - 1) > 1e-3 && L.alloc.ledgerG <= 1e-12 && L.alloc.ledgerK <= 1e-12
      && L.alloc.betaRelFull > 1e-6,   // 反作用の大きい写しでは β が w で動く(源の反作用は配分に依る —— 「反作用を除く」の但し書きの門)
    familyEsameAsW326d: S.sameAsW326d.maxRel <= 1e-15 && S.sameAsW326d.alongOld === S.sameAsW326d.alongNew,
    acceptRules: S.accept.noTide === false && S.accept.noTideRes !== 0 && S.accept.ck0 === false && S.accept.negBeta < 0 && S.accept.negRejected === true && S.accept.negAccepted === false,
    hullS: S.hull.inside === true && S.hull.outside === false,
    lawFitPredict: S.law.ok && close(S.law.alpha, 0.8, 1e-9) && close(S.law.C, 4, 1e-9) && S.law.spread1 > 0.01 && close(S.law.predS, S.law.trueS, 1e-12),
    rootBisect: close(S.root.x, 100, 1e-12) && S.root.none === true && JSON.stringify(S.root.changes) === '[1,3]',
  };
}

// 第326便d(原仮定者の指示(第128報)「軸引きずりについて」「引きずり計算の補足」・統括の検証項目 R293): **軸引きずりの定常の釣り合いと由来ごとの熱の帳簿の純関数**
// (器 tests/exp-w326d-axialheat.mjs と QA lint.axialHeat326d が読む —— html を読まない・状態を持たない・エンジンの式を写さない)。
//
// ■ 模型(宣言 —— 探索の構成則の候補。今の DFM の式から導いた法則ではない)
//   天体 i の自転軸 â_i は遠方宇宙に対して固定(歳差なし)・観測の自転 Ω_i = s_i â_i(s_i は符号つき —— 金星は負)。
//   由来(口)ごとに目標の角速度 ν と応答 Γ ≥ 0 を置き、口のトルク N = Γ(ν − Ω)。定常は軸の向きの釣り合い â_i·(Σ_口 N + τ_反作用 â_i) = 0。
//   軸に垂直な成分は固定軸を支える反作用 H_i = −(Σ N)⊥(遠方の枠 —— H_i·Ω_i = 0 なので熱を作らない)。
//   口の種類: galaxy(銀河の局所の軸場 ν = A f_i(p) ĝ —— 向きは銀河の回転軸の宣言・A は符号つきの大きさ・f_i(p) = (R_d,i/R_d,ref)^p は受け手の応答)/
//     k1(太陽・木星の軸引きずり —— 今の K1 の核が作る ω_ij を源の符号つきの自転 s_j で割った伝達 t_ij〔ν = s_j t_ij〕・器がエンジンの読み口から取る)/
//     tide(潮汐 —— 同期の目標 ν = n〔起潮天体との相対の公転の角速度のベクトル —— 宣言〕)。
//   熱は**口ごと**に Q = Γ|ν − Ω|²(逆向きでも打ち消さない —— 合計トルクが 0 でも熱は残る)。口の供給 P = N·ν = 受け手の仕事 N·Ω + Q。
//   k1 の源 j の反作用(軸の向き): τ_j = −t·N(源の自転から引き落とす仕事 −τ_j s_j = N·ν)。L の残り F = −(N − â_j(t·N))は遠方の枠へ(仕事 0)。
//   帳簿(定常): 銀河の中心の供給 P_G(固定の外部の口座 —— 中心の変化は無視)+ 潮汐の軌道の仕事 P_orb(固定の軌道の口座)= Σ Q = 背景への放射 L_rad
//   (定常の内部エネルギー・即時の放射は採用した境界の条件 —— 観測の熱流への一致ではない)。k1 の口の仕事は源の自転の口座の間の移し替え(二重に数えない)。
// ■ 言わないこと: 内部熱・金星の逆回転を説明したとは書かない。銀河場を同定したとは数えない。応答の尺度 Γ は宣言の模型のノブ(熱の大きさを観測の熱流に合わせない)。
//   負の散逸(Γ < 0)を要求する解は不採用(0 へ丸めない・残差を熱として消さない)。
export const LIB_VERSION = 'w326d-axialheat-lib-1';
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const norm = (a) => Math.hypot(a[0], a[1], a[2]);
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vec = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
const unitOk = (a) => vec(a) && Math.abs(norm(a) - 1) <= 1e-10;
export const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
/** 角度 [deg](atan2 —— 小さい角も精度を落とさない) */
export const angDeg = (a, b) => Math.atan2(norm(cross(a, b)), dot(a, b)) * 180 / Math.PI;

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  solveBodies: Object.freeze(['sun', 'venus', 'jupiter', 'io']),   // 方程式を立てる天体(太陽–金星・太陽–木星–イオ)
  checkBodies: Object.freeze(Object.keys({ earth: 1, saturn: 1 })),   // 検査だけ(合わせない)—— 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違える)
  // 口の接続(原仮定者の指示(第128報)の 3 文 —— 太陽系の全天体に銀河・惑星と衛星に太陽・イオに木星。潮汐は起潮天体ごと)
  ports: Object.freeze({
    sun: Object.freeze({ k1: Object.freeze([]), tide: Object.freeze([]) }),
    venus: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    jupiter: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun', 'io']) }),
    io: Object.freeze({ k1: Object.freeze(['sun', 'jupiter']), tide: Object.freeze(['jupiter']) }),
    earth: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun', 'moon']) }),
    saturn: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun', 'titan']) }),
  }),
  // 応答の族 E: 受け手ごとの基準 Γ_i⁰ = I_i/τ_0(I_i = f_recv m R² —— 文献の慣性係数)・銀河と k1 の口は c = 1(由来ごとに同じ応答)・潮汐の口は k_i(天体ごとの未知 —— 起潮天体の間は同じ k)
  family: 'E',
  cGalaxy: 1, cK1: 1,
  // 受け手の応答のべき p の表の格子(f_i = (R_d,i/R_d,☉)^p —— 規則 R_d = Y_k m の本では (m_i/m_☉)^p。エンジンの galaxyAxial の型は p = 0〔massPow −1〕・1・2)
  pGrid: Object.freeze([-1, -0.75, -0.5, -0.25, 0, 1, 2]),
  tau0: 'τ_0(応答の時間の尺度 —— 宣言の模型のノブ・本便は値を置かない。熱と仕事は Q τ_0 [J] で書く —— W にするには τ_0 で割る)',
  tideTarget: '起潮天体に対する接触の二体の公転の角速度 n(J2000 の本の状態から μ = G(m_i + m_j) —— 平均運動ではない・宣言)',
  axis: '本の宣言の傾きと方位(J2000 の黄道 —— 軸は一定の近似)',
  // 統括の参考の試作の型の否定対照(今のコードで書き直す —— 数を写さない)
  controls: Object.freeze(['identity', 'freeVector', 'scale']),
  scaleLambda: 2,
  // 金星の条件つきの写し(K1 の太陽の項に要る倍率 —— K1 は固定なので採らない): 族 E の下限の倍率 × marginVenus
  marginVenus: 2,
});
/** 受け手の慣性係数 I/(m R²)(文献の値 —— 本便は一次資料に当たっていない。太陽・金星・地球・木星・土星は第320便a の lib の MOI16 と同じ値・イオは文献の値) */
export const MOI = Object.freeze({ sun: 0.07, venus: 0.33, earth: 0.3307, jupiter: 0.254, saturn: 0.21, io: 0.378 });

/* ───────── 1 つの口 ───────── */
/** 受け手 Ω・目標 ν・応答 Γ ≥ 0 の口(トルク・熱・供給・受け手の仕事・閉じ) */
export function port(Omega, nu, Gamma) {
  if (!vec(Omega) || !vec(nu) || !Number.isFinite(Gamma) || Gamma < 0) throw new RangeError('port: Ω・ν は有限の 3 成分・Γ は 0 以上の有限の数');
  const slip = sub(nu, Omega), torque = scale(slip, Gamma), heat = Gamma * dot(slip, slip), supply = dot(torque, nu), recvWork = dot(torque, Omega);
  return { slip, torque, heat, supply, recvWork, residual: supply - recvWork - heat };
}
/** 固定軸の分解: 軸の向きの成分・軸を支える反作用 H = −N⊥・H の仕事 H·Ω(â ∥ Ω なので 0) */
export function holdOf(N, a, Omega) {
  if (!unitOk(a)) throw new RangeError('holdOf: 軸は単位ベクトル');
  const par = dot(N, a), hold = scale(sub(N, scale(a, par)), -1);
  return { par, hold, holdWork: dot(hold, Omega), holdAlong: dot(hold, a) };
}
/** 1 つの源・固定軸・一定の目標の厳密な 1 步(指数の緩和 —— 刻み h と h/2 の 2 回が同じになる型。軸に垂直な分は軸の反作用へ —— 受け手の仕事 0)。
 *  入力: 軸 a・軸の向きの自転 s0・目標 ν・Γ・慣性 I・時間 dt。出力: s1・源の仕事 = 自転のエネルギーの差 + 熱(閉じ) */
export function fixedAxisStep({ a, s0, nu, Gamma, I, dt }) {
  if (!unitOk(a) || !vec(nu) || !Number.isFinite(s0) || !Number.isFinite(Gamma) || Gamma < 0 || !(I > 0) || !Number.isFinite(dt) || dt < 0) throw new RangeError('fixedAxisStep: 入力');
  const p = dot(nu, a), perp = sub(nu, scale(a, p)), slip0 = s0 - p, x = Gamma * dt / I, ds = slip0 * Math.expm1(-x), s1 = s0 + ds;
  const impulse = add(scale(a, I * ds), scale(perp, Gamma * dt));
  const sourceWork = dot(impulse, nu), deltaK = I * ds * (s0 + 0.5 * ds), heat = -0.5 * I * Math.expm1(-2 * x) * slip0 * slip0 + Gamma * dt * dot(perp, perp);
  return { s1, impulse, holdImpulse: scale(perp, -Gamma * dt), sourceWork, deltaK, heat, residual: sourceWork - deltaK - heat };
}

/* ───────── 系(天体と口)の評価 ───────── */
// 系の形: bodies = [{key, s, a:[3], I, Rd, ports:[{kind:'gal'|'k1'|'tide', src?, t?:[3](k1 —— 源の単位の自転あたりの ν), n?:[3](tide), c?:number}]}]
//   params = {A, p, k:{<key>: k_i}, ref:'sun'(f の基準の天体), g:[3](銀河の回転軸 ĝ), gamma0:{<key>: Γ_i⁰}, cGalaxy, cK1, k1Mul?:{'<recv>:<src>': 倍率}(条件つきの写しだけ)}
const keyIndex = (bodies) => Object.fromEntries(bodies.map((b, i) => [b.key, i]));
export function responseOf(bodies, ref, p) {
  const R0 = bodies.find((b) => b.key === ref).Rd;
  if (!(R0 > 0)) throw new RangeError('responseOf: 基準の天体の R_d > 0');
  return Object.fromEntries(bodies.map((b) => [b.key, Math.pow(b.Rd / R0, p)]));
}
/** 口ごとの目標 ν と応答 Γ(k1 は ν = s_src t・倍率 k1Mul は条件つきの写しだけ) */
export function portTargets(bodies, params) {
  const ix = keyIndex(bodies), f = responseOf(bodies, params.ref, params.p);
  return bodies.map((b) => b.ports.map((q) => {
    const g0 = params.gamma0[b.key];
    if (q.kind === 'gal') return { kind: 'gal', nu: scale(params.g, params.A * f[b.key]), Gamma: g0 * params.cGalaxy, f: f[b.key] };
    if (q.kind === 'k1') {
      const src = bodies[ix[q.src]], mul = (params.k1Mul && params.k1Mul[b.key + ':' + q.src]) || 1;
      return { kind: 'k1', src: q.src, t: scale(q.t, mul), nu: scale(q.t, mul * src.s), Gamma: g0 * params.cK1, mul };
    }
    if (q.kind === 'tide') return { kind: 'tide', src: q.src, nu: q.n.slice(), Gamma: g0 * params.k[b.key] };
    throw new RangeError('portTargets: 口の種類 ' + q.kind);
  }));
}
/** 系の評価: 口ごとのトルク・熱・供給・反作用・固定軸の分解・軸の向きの残差・帳簿(E と L)。Γ < 0 の口は評価するが印を付ける(採否は呼び手) */
export function evaluate(bodies, params) {
  const ix = keyIndex(bodies), PT = portTargets(bodies, params), react = bodies.map(() => 0), frame = [0, 0, 0];
  const rows = bodies.map((b, i) => {
    const Om = scale(b.a, b.s);
    const ports = PT[i].map((q, k) => {
      const G = q.Gamma, slip = sub(q.nu, Om), N = scale(slip, G), heat = G * dot(slip, slip), supply = dot(N, q.nu), recvWork = dot(N, Om);
      const r = { kind: q.kind, src: q.src || null, nu: q.nu, nuAlong: dot(q.nu, b.a), Gamma: G, negative: G < 0, torque: N, torqueAlong: dot(N, b.a), heat, supply, recvWork, closeRes: supply - recvWork - heat };
      if (q.kind === 'k1') {
        const js = ix[q.src], aj = bodies[js].a, tN = dot(q.t, N);
        react[js] += -tN;   // 源の軸の向きの反作用(スカラー)
        r.reactionSrc = -tN; r.drawFromSrc = tN * bodies[js].s;   // 源の自転から引き落とす仕事 = N·ν
        r.frameReaction = scale(sub(N, scale(aj, tN)), -1);
        for (let c = 0; c < 3; c++) frame[c] += r.frameReaction[c];
      }
      if (q.kind === 'gal') r.f = q.f;
      if (q.kind === 'k1') r.mul = q.mul;
      return r;
    });
    return { key: b.key, s: b.s, a: b.a, Omega: Om, ports };
  });
  let PG = 0, Porb = 0, PK1 = 0, Q = 0, Kdot = 0, sumAbsAlong = 0, maxClose = 0;
  const Lacc = { galaxyCenter: [0, 0, 0], orbits: [0, 0, 0], farFrameHold: [0, 0, 0], farFrameK1: frame.slice(), sources: [0, 0, 0] };
  for (let i = 0; i < rows.length; i++) {
    const R = rows[i], b = bodies[i];
    let Nsum = [0, 0, 0], q = 0, absAlong = 0, sc = Math.abs(react[i]);
    for (const p of R.ports) {
      Nsum = add(Nsum, p.torque); q += p.heat; absAlong += Math.abs(p.torqueAlong); sc += Math.abs(p.Gamma) * (norm(p.nu) + Math.abs(b.s));   // 丸めの尺度(Γ|ν| + Γ|s| —— 引き算の前の大きさ)
      if (p.kind === 'gal') { PG += p.supply; Lacc.galaxyCenter = sub(Lacc.galaxyCenter, p.torque); }
      if (p.kind === 'tide') { Porb += p.supply; Lacc.orbits = sub(Lacc.orbits, p.torque); }
      if (p.kind === 'k1') PK1 += p.supply;
      maxClose = Math.max(maxClose, Math.abs(p.closeRes) / Math.max(Math.abs(p.supply), Math.abs(p.recvWork), Math.abs(p.heat), 1e-300));
    }
    const along = dot(Nsum, b.a) + react[i], hd = holdOf(Nsum, b.a, R.Omega);
    R.torqueSum = Nsum; R.reaction = react[i]; R.alongResidual = along; R.alongScale = sc; R.alongRel = Math.abs(along) / Math.max(sc, 1e-300); R.heat = q; R.sumAbsAlong = absAlong; R.netAlongPorts = dot(Nsum, b.a);
    R.hold = hd.hold; R.holdWork = hd.holdWork; R.holdAlong = hd.holdAlong;
    R.reactionVec = scale(b.a, react[i]);
    Lacc.farFrameHold = sub(Lacc.farFrameHold, hd.hold);
    Lacc.sources = add(Lacc.sources, R.reactionVec);
    Kdot += along * b.s;   // 軸の向きの自転のエネルギーの変化(定常なら 0)
    Q += q; sumAbsAlong += absAlong;
  }
  // L の総和: 天体のスピンが受けるトルク(口 + 反作用 + 支え)と外の口座(銀河の中心・軌道・遠方の枠)の和は 0
  let Lspin = [0, 0, 0];
  for (const R of rows) Lspin = add(Lspin, add(add(R.torqueSum, R.reactionVec), R.hold));
  const Lext = add(add(Lacc.galaxyCenter, Lacc.orbits), add(Lacc.farFrameHold, Lacc.farFrameK1));
  // 外の口座の符号: 天体が受けたトルクの逆(銀河の中心 −N_G・軌道 −N_T・遠方の枠 −H と F)。反作用 τ_j â_j は源の天体のスピンに入る(Lspin の内 —— 二度足さない)
  const Ltot = add(Lspin, Lext);
  const Lscale = Math.max(...rows.flatMap((R) => R.ports.map((p) => norm(p.torque))), 1e-300);
  const ledger = {
    galaxySupply: PG, orbitWork: Porb, k1Draw: PK1, heat: Q, radiation: Q, spinPower: Kdot,
    residual: PG + Porb - Q - Kdot, residualRel: Math.abs(PG + Porb - Q - Kdot) / Math.max(Math.abs(PG), Math.abs(Porb), Math.abs(Q), 1e-300),
    // k1 の口の仕事(源の自転の口座 → 受け手)と源の反作用の仕事(−Σ τ_j s_j)は等しい(移し替え —— 二重に数えない)
    k1Transfer: { draw: PK1, sourceReactionWork: -react.reduce((s, r, i) => s + r * bodies[i].s, 0) },
    portCloseMaxRel: maxClose,
    L: { galaxyCenter: Lacc.galaxyCenter, orbits: Lacc.orbits, farFrameHold: Lacc.farFrameHold, farFrameK1: Lacc.farFrameK1, totalRel: norm(Ltot) / Lscale },
  };
  return { rows, ledger, react };
}

/* ───────── 解く(軸の向きの釣り合い —— 族 E)───────── */
/** 天体 i の軸の向きの残差を未知(A・k_i)の一次式に分ける: res_i = cA_i·A + ck_i·k_i + c0_i(p・Γ⁰・c は固定)。反作用は未知に依らない(k1 の口の Γ は c_K1 Γ⁰) */
export function linearRows(bodies, params) {
  const base = evaluate(bodies, Object.assign({}, params, { A: 0, k: Object.fromEntries(bodies.map((b) => [b.key, 0])) }));
  const f = responseOf(bodies, params.ref, params.p);
  return bodies.map((b, i) => {
    const g0 = params.gamma0[b.key];
    let cA = 0, ck = 0;
    for (const q of b.ports) {
      if (q.kind === 'gal') cA += g0 * params.cGalaxy * f[b.key] * dot(params.g, b.a);
      if (q.kind === 'tide') ck += g0 * (dot(q.n, b.a) - b.s);
    }
    // A = 0・k = 0 の残差には銀河の口の −Γ s が入る(A に依らない分)
    return { key: b.key, cA, ck, c0: base.rows[i].alongResidual, hasTide: b.ports.some((q) => q.kind === 'tide') };
  });
}
/** 太陽(潮汐の口の無い基準の天体)の式から A、残りの天体の式から k_i(三角の系 —— 一意)。Γ < 0 を要求する k は印(rejected) */
export function solveFamilyE(bodies, params) {
  const L = linearRows(bodies, params), ref = L.find((r) => r.key === params.ref);
  if (!(ref && !ref.hasTide && ref.cA !== 0)) throw new RangeError('solveFamilyE: 基準の天体は潮汐の口を持たず銀河の口の係数が 0 でない');
  const A = -ref.c0 / ref.cA, k = {}, rows = [];
  for (const r of L) {
    if (r.key === params.ref) { k[r.key] = 0; rows.push({ key: r.key, k: null, rejected: false }); continue; }
    if (!r.hasTide || r.ck === 0) { k[r.key] = 0; rows.push({ key: r.key, k: null, rejected: null, residual: r.cA * A + r.c0 }); continue; }
    const kk = -(r.cA * A + r.c0) / r.ck;
    k[r.key] = kk; rows.push({ key: r.key, k: kk, rejected: !(kk >= 0) });
  }
  return { A, k, rows, lin: L, accepted: rows.every((r) => r.rejected !== true) };
}

/* ───────── Γ に依らない判定(凸包)───────── */
/** Γ ≥ 0 の定常の軸の自転は口の目標(軸の向き)の重みつき平均 —— 観測の s が目標の最小と最大の間に無ければ、どの Γ ≥ 0 でも定常にならない(負の散逸が要る) */
export function hullOf(s, targets) {
  const lo = Math.min(...targets), hi = Math.max(...targets);
  return { lo, hi, inside: s >= lo && s <= hi, below: s < lo, above: s > hi };
}
/** 銀河の目標 G_i(p) = A f_i(p) g_i が動くとき、Γ に依らずに入る p の範囲(f_i = (m_i/m_ref)^p —— x = R_d,i/R_d,ref)。fixed は銀河以外の目標 */
export function hullPBound({ s, fixed, Ag, x }) {
  const lo = Math.min(...fixed), hi = Math.max(...fixed);
  if (s >= lo && s <= hi) return { kind: 'all', p: null, need: null };
  const need = s > hi ? 'G>=s' : 'G<=s';
  // G(p) = Ag x^p の符号は Ag の符号で一定(x^p > 0)
  if (need === 'G>=s' && !(Ag > 0 && s > 0)) return { kind: 'none', p: null, need, why: '銀河の目標の符号が観測と逆' };
  if (need === 'G<=s' && !(Ag < 0 && s < 0)) return { kind: 'none', p: null, need, why: '銀河の目標の符号が観測と逆' };
  const pStar = Math.log(s / Ag) / Math.log(x);   // G(p*) = s
  // x < 1 なら x^p は p について減少 —— G ≥ s(G > 0)は p ≤ p*
  const le = (need === 'G>=s') === (x < 1);
  return { kind: le ? 'le' : 'ge', p: pStar, need };
}
/** 族 E の k_i ≥ 0 の p の範囲(k_i の分子の符号が銀河の目標の閾値 G* で変わる —— 一次の式から) */
export function familyEPBound({ row, Ag, x, cGalaxyGamma0 }) {
  // row: linearRows の行(A = 0 の残差 c0 と係数)。res = cA A + ck k + c0 = 0 → k = −(cA A + c0)/ck。cA A = cGalaxyGamma0·G(p)
  // k ≥ 0 ⟺ (cGalaxyGamma0·G + c0)·sign(−ck) ≥ 0 → 閾値 G* = −c0/cGalaxyGamma0
  const Gs = -row.c0 / cGalaxyGamma0, needGe = row.ck < 0;   // ck < 0(s > n —— 潮汐が減速)なら G ≥ G*
  if (needGe) {
    if (!(Gs > 0)) return { kind: 'all', Gstar: Gs };
    if (!(Ag > 0)) return { kind: 'none', Gstar: Gs, why: '銀河の目標の符号' };
    const p = Math.log(Gs / Ag) / Math.log(x);
    return { kind: x < 1 ? 'le' : 'ge', p, Gstar: Gs };
  }
  if (!(Gs < 0) && Ag > 0) {   // G ≤ G*(G > 0)
    const p = Math.log(Gs / Ag) / Math.log(x);
    return { kind: x < 1 ? 'ge' : 'le', p, Gstar: Gs };
  }
  return { kind: 'none', Gstar: Gs, why: '銀河の目標の符号が閾値と逆(どの p でも k < 0)' };
}

/* ───────── 線形代数(小さい行列 —— ランク・条件数・連立)───────── */
/** 列を単位の長さに揃えた行列の特異値(片側 Jacobi —— 列どうしを回して直交させ、列の長さが特異値。小さい行列だけ) */
export function singularValues(M, colScale = true) {
  const m = M.length, n = M[0].length, U = [];
  for (let j = 0; j < n; j++) { let s = 0; for (let i = 0; i < m; i++) s += M[i][j] * M[i][j]; const c = colScale ? (Math.sqrt(s) || 1) : 1; U.push(M.map((r) => r[j] / c)); }
  for (let sweep = 0; sweep < 80; sweep++) {
    let rot = 0;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
      let al = 0, be = 0, ga = 0;
      for (let i = 0; i < m; i++) { al += U[a][i] * U[a][i]; be += U[b][i] * U[b][i]; ga += U[a][i] * U[b][i]; }
      if (Math.abs(ga) <= 1e-17 * Math.sqrt(al * be) || ga === 0) continue;
      rot++;
      const z = (be - al) / (2 * ga), tt = Math.sign(z || 1) / (Math.abs(z) + Math.sqrt(1 + z * z)), c = 1 / Math.sqrt(1 + tt * tt), s = c * tt;
      for (let i = 0; i < m; i++) { const x = U[a][i], y = U[b][i]; U[a][i] = c * x - s * y; U[b][i] = s * x + c * y; }
    }
    if (!rot) break;
  }
  return U.map((col) => Math.sqrt(col.reduce((s, q) => s + q * q, 0))).sort((p, q) => q - p);
}
export function rankOf(M, tol = 1e-9, colScale = true) {
  const sv = singularValues(M, colScale), mx = sv[0] || 0, r = sv.filter((v) => v > tol * mx).length;
  return { rank: r, cols: M[0].length, rows: M.length, sv, cond: sv[sv.length - 1] > 0 ? mx / sv[sv.length - 1] : Infinity };
}
/** 二次 a2 x² + a1 x + a0 の実根(打ち消しの少ない形 —— 無ければ null) */
export function quadRoots(a2, a1, a0) {
  const d = a1 * a1 - 4 * a2 * a0;
  if (!(d >= 0) || a2 === 0) return null;
  const q = -0.5 * (a1 + (a1 >= 0 ? 1 : -1) * Math.sqrt(d)), r1 = q / a2, r2 = q !== 0 ? a0 / q : r1;
  return [Math.min(r1, r2), Math.max(r1, r2)];
}
/** 部分の枢軸の Gauss の消去(正方) */
export function solveLinear(A, b) {
  const n = A.length, R = A.map((r, i) => [...r, b[i]]), s = Math.max(...A.flat().map(Math.abs));
  if (!(s > 0)) throw new RangeError('solveLinear: 0 の行列');
  for (let k = 0; k < n; k++) {
    let pv = k; for (let i = k + 1; i < n; i++) if (Math.abs(R[i][k]) > Math.abs(R[pv][k])) pv = i;
    if (Math.abs(R[pv][k]) < 1e-14 * s) throw new RangeError('solveLinear: ランクが足りない');
    [R[k], R[pv]] = [R[pv], R[k]];
    const d = R[k][k]; for (let j = k; j <= n; j++) R[k][j] /= d;
    for (let i = 0; i < n; i++) if (i !== k) { const c = R[i][k]; for (let j = k; j <= n; j++) R[i][j] -= c * R[k][j]; }
  }
  return R.map((r) => r[n]);
}

/* ───────── 純関数の場面(QA lint.axialHeat326d と器の P 段)───────── */
export function pureScenes() {
  const S = {};
  // ① 反対向きの 2 源(+1・−1 —— 静止の受け手・Γ = 1): 合計トルク 0・熱は 1 + 1 = 2・供給 2
  { const a = port([0, 0, 0], [0, 0, 1], 1), b = port([0, 0, 0], [0, 0, -1], 1);
    S.opposed = { torqueSum: norm(add(a.torque, b.torque)), heat: a.heat + b.heat, supply: a.supply + b.supply, netSlipHeat: dot(add(a.slip, b.slip), add(a.slip, b.slip)) }; }
  // ② 120° の合成: 同じ大きさの 2 源の目標の和は同じ大きさ —— 熱は口ごと(和の目標の 1 口の熱とは違う)
  { const u = [1, 0, 0], v = [Math.cos(2 * Math.PI / 3), Math.sin(2 * Math.PI / 3), 0], O = [0, 0, 0];
    const two = port(O, u, 1).heat + port(O, v, 1).heat, one = port(O, add(u, v), 1).heat;
    S.compose120 = { sumNorm: norm(add(u, v)), perPortHeat: two, combinedHeat: one }; }
  // ③ 固定軸に垂直な目標: 受け手の仕事 0・支えの仕事 0・熱 = 供給
  { const a = [0, 0, 1], Om = [0, 0, 0.3], q = port(Om, [1, 0, 0.3], 2), h = holdOf(q.torque, a, Om);
    S.perp = { recvWork: q.recvWork, holdWork: h.holdWork, heat: q.heat, supply: q.supply, along: h.par }; }
  // ④ 口の閉じ(乱数の代わりに決めた 3 例): P = N·Ω + Q
  S.closeRel = Math.max(...[[[0.1, -0.2, 0.3], [0.4, 0.5, -0.3], 0.7], [[1e-6, 2e-6, -5e-6], [-3e-5, 1e-6, 2e-6], 3.3e30], [[0, 0, -2.99e-7], [0.8, 0, -0.5], 1e35]]
    .map(([O, n, G]) => { const q = port(O, n, G); return Math.abs(q.residual) / Math.max(Math.abs(q.supply), Math.abs(q.recvWork), q.heat); }));
  // ⑤ 負・非有限の Γ は拒否
  S.rejectGamma = [-1, NaN, Infinity].every((g) => { try { port([0, 0, 0], [1, 0, 0], g); return false; } catch (e) { return true; } });
  // ⑥ 向きを反転する伝達(2nnᵀ − I —— n ⟂ â の受け手は源と逆向き)でも Γ ≥ 0・熱 ≥ 0・反作用の仕事 = 供給
  { const nn = [1, 0, 0], aj = [0, 0, 1], t = sub(scale(nn, 2 * dot(nn, aj)), aj), sj = 2, nu = scale(t, sj), q = port([0, 0, 0], nu, 1.5), tN = dot(t, q.torque);
    S.reversal = { nuAlongSrc: dot(nu, aj), heat: q.heat, supply: q.supply, srcReactionWork: tN * sj, frameReactionNorm: norm(sub(q.torque, scale(aj, tN))) }; }
  // ⑦ 系の帳簿(2 天体 —— 銀河の口・k1 の口・潮汐の口): 定常に解いた系で 銀河の供給 + 軌道の仕事 = 熱・L の総和 0・支えの仕事 0
  { const bodies = [
      { key: 'S', s: 2, a: [0, 0, 1], Rd: 1, ports: [{ kind: 'gal' }] },
      { key: 'P', s: 0.25, a: [Math.sin(0.1), 0, Math.cos(0.1)], Rd: 0.01, ports: [{ kind: 'gal' }, { kind: 'k1', src: 'S', t: [0, 0.2, -0.9] }, { kind: 'tide', src: 'S', n: [0, 0, 0.3] }] },
    ];
    const params = { ref: 'S', p: 0, g: [0.6, 0, -0.8], gamma0: { S: 3, P: 0.5 }, cGalaxy: 1, cK1: 1, k: { S: 0, P: 0 } };
    const sol = solveFamilyE(bodies, params), ev = evaluate(bodies, Object.assign({}, params, { A: sol.A, k: sol.k }));
    const ev2 = evaluate(bodies, Object.assign({}, params, { A: sol.A, k: sol.k, gamma0: { S: 6, P: 1 } }));
    S.system = { A: sol.A, kP: sol.k.P, accepted: sol.accepted, alongMax: Math.max(...ev.rows.map((r) => r.alongRel)),
      ledgerRel: ev.ledger.residualRel, LRel: ev.ledger.L.totalRel, holdWorkMax: Math.max(...ev.rows.map((r) => Math.abs(r.holdWork))), k1TransferRel: relD(ev.ledger.k1Transfer.draw, ev.ledger.k1Transfer.sourceReactionWork),
      scaleHeatRatio: ev2.ledger.heat / ev.ledger.heat, scaleAlongMax: Math.max(...ev2.rows.map((r) => r.alongRel)),
      heatP: ev.rows[1].heat, heatPorts: ev.rows[1].ports.map((p) => p.heat), alongSigns: ev.rows[1].ports.map((p) => Math.sign(p.torqueAlong)), netAlongP: ev.rows[1].netAlongPorts + ev.rows[1].reaction, absAlongP: ev.rows[1].sumAbsAlong, scaleP: ev.rows[1].alongScale };
    // 観測が目標の外(凸包の外)なら族 E の k は負(不採用)
    const out = solveFamilyE([bodies[0], Object.assign({}, bodies[1], { s: -5 })], params);
    S.system.outsideRejected = out.rows.find((r) => r.key === 'P').rejected === true;
  }
  // ⑧ 厳密な 1 步(固定軸・一定の目標): 閉じ・h と h/2 の 2 回が同じ・垂直だけの目標は自転を変えず熱 = 供給
  { const x = { a: [0, 0, 1], s0: 0.1, nu: [0.4, 0.5, -0.3], Gamma: 0.7, I: 2, dt: 0.4 }, r1 = fixedAxisStep(x), h1 = fixedAxisStep(Object.assign({}, x, { dt: 0.2 })), h2 = fixedAxisStep(Object.assign({}, x, { s0: h1.s1, dt: 0.2 }));
    const pp = fixedAxisStep({ a: [0, 0, 1], s0: 0, nu: [1, 0, 0], Gamma: 2, I: 3, dt: 0.5 });
    S.step = { closeRel: Math.abs(r1.residual) / Math.abs(r1.sourceWork), halfS: relD(r1.s1, h2.s1), halfHeat: relD(r1.heat, h1.heat + h2.heat), halfWork: relD(r1.sourceWork, h1.sourceWork + h2.sourceWork),
      perpS1: pp.s1, perpDeltaK: pp.deltaK, perpHeat: pp.heat, perpWork: pp.sourceWork }; }
  // ⑨ ランク: 既知の 4×4(三角)は 4・同じ列を 2 本持つ 3×3 は 2
  S.rank = { full: rankOf([[2, 0, 0, 0], [1, 3, 0, 0], [0.5, 0, -1, 0], [4, 0, 0, 7]]).rank, deficient: rankOf([[1, 2, 2], [3, 1, 1], [0, 5, 5]]).rank };
  // ⑩ 凸包の p の範囲: G(p) = Ag x^p(x < 1)が s を超えるのは p ≤ p*
  { const b = hullPBound({ s: 4, fixed: [0, 1], Ag: 1, x: 0.01 }); S.hullP = { kind: b.kind, p: b.p, check: Math.pow(0.01, b.p) }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
  return {
    opposedHeatAdds: S.opposed.torqueSum === 0 && S.opposed.heat === 2 && S.opposed.supply === 2 && S.opposed.netSlipHeat === 0,
    compose120PerPort: close(S.compose120.sumNorm, 1) && close(S.compose120.perPortHeat, 2) && close(S.compose120.combinedHeat, 1),
    perpNoSpinWork: Math.abs(S.perp.recvWork) <= 1e-15 && Math.abs(S.perp.holdWork) <= 1e-15 && close(S.perp.heat, S.perp.supply) && S.perp.heat > 0 && Math.abs(S.perp.along) <= 1e-15,
    portCloses: S.closeRel <= 1e-12,
    negativeGammaRejected: S.rejectGamma === true,
    reversalPositiveHeat: S.reversal.nuAlongSrc < 0 && S.reversal.heat > 0 && close(S.reversal.srcReactionWork, S.reversal.supply) && S.reversal.frameReactionNorm >= 0,
    systemLedgerCloses: S.system.accepted && S.system.alongMax <= 1e-12 && S.system.ledgerRel <= 1e-12 && S.system.LRel <= 1e-12 && S.system.holdWorkMax <= 1e-15 && S.system.k1TransferRel <= 1e-12,
    scaleNotIdentified: close(S.system.scaleHeatRatio, 2) && S.system.scaleAlongMax <= 1e-12,
    heatPerPortAdds: S.system.heatPorts.every((q) => q > 0) && close(S.system.heatP, S.system.heatPorts.reduce((a, b) => a + b, 0)) && S.system.alongSigns.includes(1) && S.system.alongSigns.includes(-1)
      && Math.abs(S.system.netAlongP) <= 1e-12 * S.system.scaleP,
    outsideHullRejected: S.system.outsideRejected === true,
    exactStep: S.step.closeRel <= 1e-12 && S.step.halfS <= 1e-12 && S.step.halfHeat <= 1e-12 && S.step.halfWork <= 1e-12 && S.step.perpS1 === 0 && S.step.perpDeltaK === 0 && close(S.step.perpHeat, 1) && close(S.step.perpWork, 1),
    rank: S.rank.full === 4 && S.rank.deficient === 2,
    hullPBound: S.hullP.kind === 'le' && close(S.hullP.check, 4),
  };
}

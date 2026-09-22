// 第277便c(原仮定者の裁定(第67報)(2)「観測値の自転軸の傾きと、潮汐力と、パワーボール効果を
// 利用して、DFM 版中性子星連星の安定状態を検証する」)—— **診断格子の純関数**。
//
// ■ 立場(**主張しないこと** —— 先に書く)
//   ・これは**較正ではない**。観測から値を決めた量は 1 つも無い。k₂・R₁/a・K・λ(γ)・η・
//     要求率・I_a・minOrbitalL・ξ は**すべて宣言**である。
//   ・観測の自転軸の傾き(PSR J0737−3039A の上限 3.2°・B の 40.6°)は
//     **確認依頼で照合する材料**として**初期値**にだけ使う。**値を作らないし、「観測から決めた」
//     とも書かない。「観測角を保持した」ことを平衡の証拠にもしない。**
//   ・**エンジンには 1 バイトも接続していない**(`beta/index.html` はこの lib を 1 度も読まない。
//     `S._core` には 1 命令も足していない)。
//   ・「NS の平衡を実証した」「ロックすると加速する」「潮汐ロックを証明した」とは **1 行も書かない**。
//
// ■ 何を持っているか
//   (1) **相対すべり** `pairSlip` / `slipRmsCircular`(統括の検証項目 R46 の零条件)
//       s_i = v − ω_i × r(相手との相対速度から自転による表面速度を引いた量)。
//       共通並進 V を足しても不変(v も ω_i×r も V に依らない形で入る —— 器が実測する)。
//       円軌道 360 位相の RMS |s_i|/v_orb は、軸対称回転の閉形式
//         RMS/n = √( (n−ω cosθ)² + ½ω² sin²θ ) / n
//       と一致する(器が突き合わせる)。**相互同期(= 零条件)なら 0 になる**。
//   (2) **潮汐の手**(宣言): τ_tide = C_t sin 2θ を軸へ与える。θ は自転軸と公転角運動量のなす角。
//       **供給元を必ず減らす**(無限電源にしない):
//         ・手が機械エネルギーへした仕事 Ẇ_mech = Σ g_i·τ_t,i(g は受動散逸と同じ勾配)
//         ・口座へ積む仕事      Ẇ_feed = ξ |τ_t| |Ω_prec|(**宣言**。Ω_prec は実測した歳差率)
//       の**両方**を供給元から引く。供給元は `supply:"internal"`(内部モード口座 E_int)か
//       `supply:"orbit"`(軌道 E —— **準円パラメータ化では E_orb は L_orb だけの関数なので、
//       引くと L も動く = J_z が閉じない**。これは**否定対照**であって採用形ではない)。
//   (3) **有限口座**(`lib-w276c-axiswork.mjs` の契約をそのまま使う): 口座から w=min(要求, 口座)を
//       引き出し、ηw を自転(+δ ŝ)と**反作用ローター**(−δ ŝ)へ、(1−η)w を熱へ。
//       ローターは**慣性系の 3D ベクトル** J_a として持つので、ŝ が歳差しても J_z が構造的に閉じる。
//   (4) **受動散逸**(`lib-w275e-powerball.mjs` の `passiveBinaryTorque` をそのまま呼ぶ。複製しない)。
//   (5) **門**(R49): (A) 保存系の相対平衡 / (B) 散逸系の吸引状態 / (C) 長寿命の過渡 の機械分類。
//       **観測角を初期値にして保持しただけでは (A)(B) と書かない**(平均トルク・小摂動の有界性・
//       収支の閉じ・小摂動の復帰をすべて数で見る)。
//   (6) **N3 の可逆対照**(R50): 同じ ±w を 100 往復して、現行の非負口座(整流)と
//       `signedAxisWork`(実際に返す)を並べる。
//   (7) **無減衰の局所試作を NS へ延長した否定対照**: R44 の局所調和則 a_r=−κ₀r を
//       NS 連星の分離へ当てると、ニュートン値 −1 に対して何倍になるかを出す。
//
// ■ 単位(**実系の数は無次元比としてだけ入る**)
//   G=1・M=m₁+m₂=1・n(平均運動)=1 → a=1。実系からは
//     質量比 m₁/M・**ω_spin/n**・**R/a**・e(記録のみ)だけが入る。
//   **離心率は記録した入力であって、本格子の軌道は準円である**(秤動・近点集中は入っていない)。
import * as PB from './lib-w275e-powerball.mjs';
import * as AW from './lib-w276c-axiswork.mjs';

/** この lib の版(形を変えたら上げる。QA `behavior.nsGridLedger` がこの文字列を見る)。 */
export const NSGRID_VERSION = 'w277c-1';

/** 裁定 (2) と本格子の立場(器の結果 JSON の meta に同じ文字列が載る)。 */
export const NSGRID_PREMISE = {
  version: NSGRID_VERSION,
  source: '原仮定者の裁定(第67報)(2)',
  adopted: '観測の自転軸の傾き・潮汐の手・パワーボールの有限口座を同時に入れた**診断格子**を作り、'
    + '各 (系, θ*) が (A) 保存系の相対平衡 / (B) 散逸系の吸引状態 / (C) 長寿命の過渡 の'
    + 'どれになるかを**門で機械分類**する',
  acceptance: '① 帳簿が閉じること(E の相対誤差と J_z の相対誤差)② 熱が減らないこと '
    + '③ 供給元が増えないこと ④ 分類が門の式どおりであること。**観測との一致は採用条件ではない**',
  declared: ['k₂', 'R₁/a', 'K(歳差結合)', 'λ(受動散逸 γ=λ|S|)', 'η', '要求率', 'I_a',
    'ξ(口座への取込率)', 'C_t(診断用の潮汐係数)', '初期の方位角'],
  notClaim: ['NS 連星の平衡の実証', '潮汐ロックの証明', 'ロックすると加速すること',
    '観測との一致', 'k₂・K・λ・η の実在天体での同定', '離心軌道の秤動の取り扱い'],
  observedRole: '観測の傾き(A の 95% 上限 3.2°・B の 40.6°)は**照合前の材料**であり、'
    + '**初期値としてのみ**使う。値を作らないし、観測から係数を決めることもしない',
  negativeControl: 'C_t=0・λ=0・口座なし(k=0)の行が格子に入っている(手が無ければ θ は動かない)。'
    + '供給元を軌道 E にした行は **J_z が閉じない**ことを示す否定対照である',
};

const v3 = PB.v3;
const clamp1 = (x) => Math.max(-1, Math.min(1, x));
const DEG = 180 / Math.PI;

/* ══════════════════════════════════════════════════════════════════════════
 * (1) 相対すべり s_i = v − ω_i × r(統括の検証項目 R46 の零条件)
 * ════════════════════════════════════════════════════════════════════════ */
/**
 * @param {number[]} r 天体 i から相手へ向かうベクトル
 * @param {number[]} v 相手の**相対**速度(v_rel = v_j − v_i)
 * @param {number[]} w1 天体 i の自転角速度ベクトル
 * @param {number[]} w2 天体 j の自転角速度ベクトル
 * @returns {{s1:number[], s2:number[], s1mag:number, s2mag:number, vmag:number}}
 *   s1 = v − ω_1×r(天体 1 の表面から見た相手の相対速度)/ s2 = v + ω_2×r
 *   (天体 2 では相手へ向かうベクトルが −r なので符号が返る)。
 */
export function pairSlip(r, v, w1, w2) {
  const s1 = v3.sub(v, v3.cross(w1, r));
  const s2 = v3.add(v, v3.cross(w2, r));
  return { s1, s2, s1mag: v3.norm(s1), s2mag: v3.norm(s2), vmag: v3.norm(v) };
}

/**
 * 円軌道 360 位相の RMS |s|/v_orb。**相互同期(ω=n ẑ)なら 0 になる**。
 * @param {object} o {omegaOverN, thetaDeg, phases, azimuthDeg}
 * @returns {{rms:number, closed:number, relDiff:number, min:number, max:number}}
 *   `closed` は閉形式 √((1−(ω/n)cosθ)² + ½(ω/n)²sin²θ)。
 */
export function slipRmsCircular(o) {
  const W = o.omegaOverN, th = (o.thetaDeg || 0) / DEG;
  const az = (o.azimuthDeg || 0) / DEG;
  const nph = o.phases || 360;
  const w = [W * Math.sin(th) * Math.cos(az), W * Math.sin(th) * Math.sin(az), W * Math.cos(th)];
  let sum = 0, mn = Infinity, mx = -Infinity;
  for (let i = 0; i < nph; i++) {
    const ph = (2 * Math.PI * i) / nph;
    const r = [Math.cos(ph), Math.sin(ph), 0];
    const v = v3.cross([0, 0, 1], r);                 // 円軌道(n=1・a=1 → |v|=1)
    const s = v3.sub(v, v3.cross(w, r));
    const m = v3.norm(s);
    sum += m * m; mn = Math.min(mn, m); mx = Math.max(mx, m);
  }
  const rms = Math.sqrt(sum / nph);
  const c = Math.sqrt((1 - W * Math.cos(th)) ** 2 + 0.5 * W * W * Math.sin(th) ** 2);
  return { rms, closed: c, relDiff: Math.abs(rms - c) / Math.max(1e-30, Math.abs(c)), min: mn, max: mx };
}

/** 共通並進 V を足しても s は動かないこと(R46 の「共通並進を足しても不変」)を数で返す。 */
export function slipTranslationInvariance(r, v, w1, w2, V) {
  const a = pairSlip(r, v, w1, w2);
  // 共通並進は**相対**速度 v を変えない(v_j+V)−(v_i+V)=v_j−v_i。
  const b = pairSlip(r, v3.sub(v3.add(v, V), V), w1, w2);
  return { d1: v3.norm(v3.sub(a.s1, b.s1)), d2: v3.norm(v3.sub(a.s2, b.s2)) };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (2) 潮汐の手(**宣言**)
 * ════════════════════════════════════════════════════════════════════════ */
/**
 * 潮汐偶力の係数(**宣言**)。裁定の書式は τ=(3 G M₂ R₁⁵ k₂ / r⁶) sin2θ だが、
 * この形は次元が [m²/s²] = **単位質量あたりのトルク**である。トルク [kg m²/s²] にするには
 * M₂ がもう 1 つ要るので、`massPower` で**両方を出して記帳する**(黙って次元を合わせない)。
 * @param {object} o {G, m2, R1, k2, r, massPower}
 */
export function tidalCoeff(o) {
  const mp = (o.massPower === undefined) ? 2 : o.massPower;
  const base = 3 * o.k2 * o.G * Math.pow(o.R1, 5) / Math.pow(o.r, 6);
  return { value: base * Math.pow(o.m2, mp), massPower: mp,
    written: base * o.m2,                    // 裁定の書式そのまま(単位質量あたり)
    torque: base * o.m2 * o.m2,              // トルクの次元に合う形
    note: '裁定の書式(massPower=1)は**単位質量あたり**のトルクである。本格子は massPower=2 を使う' };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (3) 格子の力学(状態と導関数)
 * ════════════════════════════════════════════════════════════════════════ */
const IX = { S1: 0, S2: 3, LORB: 6, PHI: 7, HEAT: 8, BANK1: 9, BANK2: 10,
  ESUP: 11, WFEED: 12, WMECH: 13 };
export const NS_LEN = 14;
export const NS_INDEX = IX;

/**
 * 1 天体ぶんのトルクと診断。**すべてのトルクは ŝ に直交する**(第275便e の負の対照 R37 は生きている)。
 * @param {number[]} S 自転角運動量
 * @param {number[]} rhat 連結線の単位ベクトル
 * @param {object} c {K, I, gamma, Ct, Omega, xi}
 */
export function bodyTorques(S, rhat, c) {
  const s = v3.unit(S), Smag = v3.norm(S);
  const a = v3.dot(s, rhat);
  // 保存(向き)トルク —— 第275便e と同じ形
  const tc = v3.mul(v3.cross(s, rhat), c.K * a);
  // 受動散逸(第276便c の τ_d=−γP_s g・Q̇=γ|P_s g|²≥0)—— **複製せず呼ぶ**
  const pd = PB.passiveBinaryTorque(S, rhat, c.K, c.I, c.Omega, c.gamma);
  // 潮汐の手: θ は ŝ と ẑ のなす角。ê_θ = unit(ẑ − s_z ŝ) は θ を**減らす**向き
  const sz = clamp1(s[2]);
  const theta = Math.acos(sz);
  const eThetaRaw = v3.sub([0, 0, 1], v3.mul(s, sz));
  const eTheta = v3.unit(eThetaRaw);
  const tt = v3.mul(eTheta, c.Ct * Math.sin(2 * theta));
  const tau = v3.add(v3.add(tc, pd.tau), tt);
  // 歳差率 ψ̇(ŝ の ẑ まわりの方位角の速さ)—— **実測**であって宣言ではない
  const sdot = (Smag > 0) ? v3.mul(tau, 1 / Smag) : [0, 0, 0];
  const den = s[0] * s[0] + s[1] * s[1];
  const prec = (den > 1e-300) ? (s[0] * sdot[1] - s[1] * sdot[0]) / den : 0;
  // 機械エネルギーの勾配(受動散逸と同じ g)—— 手がした仕事はここから読む
  const g = PB.passiveGradient(S, rhat, c.K, c.I, c.Omega).g;
  const wMech = v3.dot(g, tt);
  const wFeed = (c.xi === 0) ? 0 : c.xi * v3.norm(tt) * Math.abs(prec);
  return { tau, tauC: tc, tauD: pd.tau, tauT: tt, heat: pd.heat,
    theta, thetaDeg: theta * DEG, a, Smag, prec, wMech, wFeed,
    sdotAxial: v3.dot(tau, s) };
}

/** 格子の導関数(y の並びは NS_INDEX)。**ローター J_a は離散移送でしか動かないので P に持つ**。 */
export function nsDerivs(P, t, y) {
  const k = PB.keplerFromL(P, y[IX.LORB]);
  const phi = y[IX.PHI], rhat = [Math.cos(phi), Math.sin(phi), 0];
  const d = new Array(NS_LEN).fill(0);
  let tauZ = 0, heat = 0, wMech = 0, wFeed = 0;
  for (let b = 0; b < 2; b++) {
    const o = (b === 0) ? IX.S1 : IX.S2;
    const S = [y[o], y[o + 1], y[o + 2]];
    const c = { K: P.K[b], I: P.I[b], gamma: P.gamma[b], Ct: P.Ct[b],
      Omega: k.Omega, xi: P.useBank ? P.xi[b] : 0 };
    const r = bodyTorques(S, rhat, c);
    d[o] = r.tau[0]; d[o + 1] = r.tau[1]; d[o + 2] = r.tau[2];
    tauZ += r.tau[2]; heat += r.heat; wMech += r.wMech; wFeed += r.wFeed;
    d[(b === 0) ? IX.BANK1 : IX.BANK2] = r.wFeed;
  }
  // **供給元は単調に減る**: 手が機械系へ**入れた**ぶん(Ẇ_mech>0)と口座へ積むぶん(Ẇ_feed≥0)だけを
  //   引く。手が機械系から**抜いた**ぶん(Ẇ_mech<0 —— 整列で解放される軌道 E)は**熱へ落とす**
  //   (供給元へは戻さない)。こうすると Heat も Esup も単調で、帳簿が閉じる:
  //     d(E_mech+Heat)/dt = Ẇ_mech + max(−Ẇ_mech,0) = max(Ẇ_mech,0)
  //     d(bank+Esup)/dt   = Ẇ_feed − (max(Ẇ_mech,0) + Ẇ_feed) = −max(Ẇ_mech,0)
  const wPlus = Math.max(wMech, 0), wMinus = Math.max(-wMech, 0);
  d[IX.LORB] = -tauZ;              // **反作用**(J_z = L_orb + Σ(S+J_a) が構造的に閉じる)
  d[IX.PHI] = k.Omega;
  d[IX.HEAT] = heat + wMinus;      // **先に定義した非負の熱**(第276便c の Q̇ + 手が抜いたぶん)
  d[IX.WFEED] = wFeed;
  d[IX.WMECH] = wMech;
  if (P.supply === 'orbit') {
    // **否定対照**: 準円パラメータ化では E_orb=E(L) なので、E を引くと L も動く(J_z が閉じない)
    d[IX.LORB] += (k.Omega !== 0) ? (-(wPlus + wFeed) / k.Omega) : 0;
    d[IX.ESUP] = 0;
  } else {
    d[IX.ESUP] = -(wPlus + wFeed);   // 内部モード口座が減る(**供給元は必ず減る**)
  }
  return d;
}

/** 保存量と診断(積分器は触らない)。 */
export function nsInvariants(P, t, y) {
  const k = PB.keplerFromL(P, y[IX.LORB]);
  const phi = y[IX.PHI], rhat = [Math.cos(phi), Math.sin(phi), 0];
  let Espin = 0, Erot = 0, U = 0, Jz = 0;
  const bodies = [];
  for (let b = 0; b < 2; b++) {
    const o = (b === 0) ? IX.S1 : IX.S2;
    const S = [y[o], y[o + 1], y[o + 2]];
    const Smag = v3.norm(S), s = v3.unit(S), a = v3.dot(s, rhat);
    const Ja = P.rotor[b];
    Espin += (Smag * Smag) / (2 * P.I[b]);
    Erot += v3.dot(Ja, Ja) / (2 * P.Ia[b]);
    U += -0.5 * P.K[b] * a * a;
    Jz += S[2] + Ja[2];
    bodies.push({ Smag, a, thetaDeg: Math.acos(clamp1(s[2])) * DEG,
      psiDeg: Math.atan2(s[1], s[0]) * DEG, omega: Smag / P.I[b],
      Sz: S[2], JaZ: Ja[2], JaPar: v3.dot(Ja, s) });
  }
  const bank = y[IX.BANK1] + y[IX.BANK2];
  return { Lorb: y[IX.LORB], Omega: k.Omega, sep: k.sep, Eorb: k.Eorb,
    Espin, Erotor: Erot, U, heat: y[IX.HEAT], bank, Esup: y[IX.ESUP],
    Wfeed: y[IX.WFEED], Wmech: y[IX.WMECH],
    Jz: y[IX.LORB] + Jz,
    E: k.Eorb + Espin + Erot + U + y[IX.HEAT] + bank + y[IX.ESUP],
    bodies };
}

/** 1 步ぶんの**離散移送**(口座 → 自転 + 反作用ローター + 熱)。`lib-w276c` の契約をそのまま使う。 */
export function transferStep(P, y, dt) {
  const out = { transfers: 0, refusals: 0, drawn: 0, delta: [0, 0], reason: null };
  if (!P.useBank) return out;
  for (let b = 0; b < 2; b++) {
    const o = (b === 0) ? IX.S1 : IX.S2;
    const bi = (b === 0) ? IX.BANK1 : IX.BANK2;
    const S = [y[o], y[o + 1], y[o + 2]];
    const Smag = v3.norm(S);
    if (!(Smag > 0)) continue;
    const s = v3.unit(S), Ja = P.rotor[b];
    const JaPar = v3.dot(Ja, s);
    const st = AW.makeAxisState({ Smag, JaPar, JaPerp2: Math.max(0, v3.dot(Ja, Ja) - JaPar * JaPar),
      I: P.I[b], Ia: P.Ia[b], bank: y[bi] });
    const req = P.requestRate[b] * dt;
    const r = AW.transferFromBank(st, req, P.eta);
    if (!r.ok) { out.refusals++; out.reason = r.reason; continue; }
    if (!(r.w > 0)) continue;
    const d = r.delta;
    y[o] += s[0] * d; y[o + 1] += s[1] * d; y[o + 2] += s[2] * d;
    P.rotor[b] = v3.sub(Ja, v3.mul(s, d));
    y[bi] -= r.w;
    y[IX.HEAT] += (1 - P.eta) * r.w;
    out.transfers++; out.drawn += r.w; out.delta[b] += d;
  }
  return out;
}

/**
 * 1 本の走行。**RK4(滑らかなトルク)+ 離散移送(口座)の分離**である(どちらも帳簿を閉じる)。
 * P: { G,m1,m2, I[2], Ia[2], K[2], gamma[2], Ct[2], xi[2], requestRate[2], eta,
 *      useBank, supply:'internal'|'orbit', rotor:[[3],[3]], minOrbitalL, dt, steps, samples, y0, id }
 */
export function runNsRun(P) {
  const Q = Object.assign({}, P, { rotor: [P.rotor[0].slice(), P.rotor[1].slice()] });
  let y = P.y0.slice(), t = 0;
  const inv0 = nsInvariants(Q, 0, y);
  const snaps = [{ t: 0, inv: inv0 }];
  const every = Math.max(1, Math.floor(P.steps / (P.samples || 16)));
  let worstJz = 0, worstE = 0, heatDrops = 0, heatPrev = inv0.heat;
  let supRise = 0, supPrev = inv0.Esup, bankNeg = 0, transfers = 0, refusals = 0;
  let thMin = [inv0.bodies[0].thetaDeg, inv0.bodies[1].thetaDeg];
  let thMax = thMin.slice();
  // **secular(永年)成分**: θ の時間平均を前半/後半で分けて取る。公転周期の振動(章動)は
  //   平均で落ちるので、「平均トルク ≈ 0」を振動と分けて読める(門はこちらを見る)。
  const thSum = [[0, 0], [0, 0]], thN = [0, 0];
  const halfStep = Math.floor(P.steps / 2);
  let stopped = null, done = 0;
  const Eref = Math.max(1e-30, Math.abs(inv0.E));
  const Jref = Math.max(1e-30, Math.abs(inv0.Jz));
  for (let n = 0; n < P.steps; n++) {
    const yn = PB.rk4(nsDerivs, Q, t, y, P.dt);
    if (P.minOrbitalL !== undefined && yn[IX.LORB] < P.minOrbitalL) {
      stopped = { reason: 'minOrbitalL', t, Lorb: y[IX.LORB], minOrbitalL: P.minOrbitalL };
      break;
    }
    y = yn; t += P.dt; done = n + 1;
    const tr = transferStep(Q, y, P.dt);
    transfers += tr.transfers; refusals += tr.refusals;
    if (y[IX.BANK1] < -1e-15 || y[IX.BANK2] < -1e-15) bankNeg++;
    const iv = nsInvariants(Q, t, y);
    if (iv.heat < heatPrev - 1e-18) heatDrops++;
    heatPrev = iv.heat;
    if (iv.Esup > supPrev + 1e-18) supRise++;      // **供給元は増えない**
    supPrev = iv.Esup;
    worstE = Math.max(worstE, Math.abs(iv.E - inv0.E) / Eref);
    worstJz = Math.max(worstJz, Math.abs(iv.Jz - inv0.Jz) / Jref);
    const half = (n < halfStep) ? 0 : 1;
    thN[half]++;
    for (let b = 0; b < 2; b++) {
      thMin[b] = Math.min(thMin[b], iv.bodies[b].thetaDeg);
      thMax[b] = Math.max(thMax[b], iv.bodies[b].thetaDeg);
      thSum[b][half] += iv.bodies[b].thetaDeg;
    }
    if ((n + 1) % every === 0 || n === P.steps - 1) snaps.push({ t, inv: iv });
  }
  const last = nsInvariants(Q, t, y);
  const mean = (b, h) => (thN[h] > 0 ? thSum[b][h] / thN[h] : inv0.bodies[b].thetaDeg);
  const thMean1 = [mean(0, 0), mean(1, 0)], thMean2 = [mean(0, 1), mean(1, 1)];
  return { id: P.id, t, y, rotor: Q.rotor, first: inv0, last, snaps, steps: done,
    worstErel: worstE, worstJzRel: worstJz, heatDrops, supplyRises: supRise,
    bankNegSteps: bankNeg, transfers, refusals,
    thetaMinDeg: thMin, thetaMaxDeg: thMax,
    thetaMeanFirstHalfDeg: thMean1, thetaMeanSecondHalfDeg: thMean2,
    thetaSecularDeg: [Math.abs(thMean2[0] - thMean1[0]), Math.abs(thMean2[1] - thMean1[1])],
    thetaOscDeg: [thMax[0] - thMin[0], thMax[1] - thMin[1]],
    stopped,
    supplyDrop: inv0.Esup - last.Esup, dLorb: last.Lorb - inv0.Lorb };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (4) 門(R49): (A) 相対平衡 / (B) 吸引状態 / (C) 長寿命の過渡
 * ════════════════════════════════════════════════════════════════════════ */
/** 門のしきい値(**宣言**。器と QA が同じ定数を読む)。 */
export const GATE = {
  perturbDeg: 1,          // 小摂動の大きさ Δ
  secularTolDeg: 0.05,    // 「平均トルク ≈ 0」とみなす基準走行の**永年**変位(前半平均 vs 後半平均)
  boundFactor: 3,         // 小摂動が有界とみなす上限(基準の振動幅 + boundFactor·Δ まで)
  returnFactor: 0.5,      // 吸引とみなす復帰(永年のずれが初期のずれの何倍以下か)
  dissipationTol: 1e-14,  // 「散逸していない」とみなす基準走行の熱の上限(絶対値)
  ledgerTol: 1e-10,       // 収支が閉じたとみなす E / J_z の相対誤差
};

/**
 * 基準走行 1 本 + 小摂動 2 本から (A)/(B)/(C) を機械分類する。
 * **観測角を初期値にして保持しただけでは (A)(B) にならない**(下の条件をすべて満たす必要がある)。
 * @param {object} o {base, plus, minus, bodyIndex, thetaStarDeg}
 */
export function classifyTheta(o) {
  const b = o.base, p = o.plus, m = o.minus, i = o.bodyIndex, th0 = o.thetaStarDeg;
  // ① **平均トルク ≈ 0**: 基準走行の θ の**永年**変位(前半平均 vs 後半平均)。
  //    公転周期の章動(振動)は平均で落ちるので、「振動しているが動いていない」と
  //    「じわじわ動いている」を分けて読める。
  const secular = b.thetaSecularDeg[i];
  const osc = b.thetaOscDeg[i];
  // ② **小摂動の有界性**: 摂動走行の θ が θ* から離れる量が、基準の振動幅 + 3Δ を超えないこと。
  const dev = (r) => Math.max(Math.abs(r.thetaMaxDeg[i] - th0), Math.abs(th0 - r.thetaMinDeg[i]));
  const devMax = Math.max(dev(p), dev(m));
  const bounded = devMax <= osc + GATE.boundFactor * GATE.perturbDeg;
  // ③ **復帰(吸引)**: 摂動の**永年**ずれ(基準との差)が初期の何倍になったか。
  const off = (r, h) => Math.abs((h === 0 ? r.thetaMeanFirstHalfDeg : r.thetaMeanSecondHalfDeg)[i]
    - (h === 0 ? b.thetaMeanFirstHalfDeg : b.thetaMeanSecondHalfDeg)[i]);
  const ratio = (r) => (off(r, 0) > 1e-12 ? off(r, 1) / off(r, 0) : (off(r, 1) <= 1e-12 ? 0 : Infinity));
  const returnRatio = Math.max(ratio(p), ratio(m));
  const returning = returnRatio <= GATE.returnFactor;
  // ④ **散逸しているか**(基準走行だけを見る —— 分類する状態は θ* そのものである)
  const heat = b.last.heat;
  const dissipating = !(heat <= GATE.dissipationTol && b.transfers === 0);
  // ⑤ **収支が閉じるか**(3 本とも)
  const closes = Math.max(b.worstErel, p.worstErel, m.worstErel) <= GATE.ledgerTol
    && Math.max(b.worstJzRel, p.worstJzRel, m.worstJzRel) <= GATE.ledgerTol
    && b.heatDrops === 0 && p.heatDrops === 0 && m.heatDrops === 0
    && b.supplyRises === 0 && p.supplyRises === 0 && m.supplyRises === 0;
  let cls = 'C', why = '';
  if (secular <= GATE.secularTolDeg && bounded && !dissipating && closes) {
    cls = 'A'; why = '基準走行が散逸しておらず(熱 0・移送 0)永年変位が門内・小摂動が有界';
  } else if (secular <= GATE.secularTolDeg && returning && dissipating && closes) {
    cls = 'B'; why = '基準走行が散逸し・永年変位が門内・小摂動の永年ずれが θ* へ縮む・収支が閉じる';
  } else {
    why = (secular > GATE.secularTolDeg) ? 'θ の永年変位が門を越える(過渡)'
      : (!closes) ? '収支が閉じない'
        : (dissipating && !returning) ? '散逸しているが小摂動が θ* へ戻らない'
          : (!bounded) ? '小摂動が有界でない' : '保存系でも吸引でもない';
  }
  return { cls, why, secularDeg: secular, oscDeg: osc, devMaxDeg: devMax,
    returnRatio, bounded, returning, dissipating, closes, heat,
    thetaMeanFirstHalfDeg: b.thetaMeanFirstHalfDeg[i],
    thetaMeanSecondHalfDeg: b.thetaMeanSecondHalfDeg[i] };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (5) N3 の可逆対照(R50)
 * ════════════════════════════════════════════════════════════════════════ */
/**
 * 同じ ±w を `cycles` 回往復させて、**現行の非負口座**(整流)と
 * **`signedAxisWork` の可逆対照**(実際に返す)を並べる。
 * @param {object} o {w, cycles, Smag, JaPar, I, Ia, eta}
 */
export function runReversibleRoundTrip(o) {
  const w = (o.w === undefined) ? 0.01 : o.w;
  const cycles = o.cycles || 100;
  const eta = (o.eta === undefined) ? 1 : o.eta;
  const mk = () => AW.makeAxisState({ Smag: (o.Smag === undefined) ? 2 : o.Smag,
    JaPar: o.JaPar || 0, I: (o.I === undefined) ? 1 : o.I, Ia: (o.Ia === undefined) ? 1 : o.Ia });
  const read = (st, extra) => Object.assign({
    omega: AW.omegaSpin(st), Smag: st.Smag, JaPar: st.JaPar, bank: st.bank, heat: st.heat,
    Win: st.Win, Wdrawn: st.Wdrawn, Espin: AW.spinEnergy(st), Erotor: AW.rotorEnergy(st),
    C: AW.ledgerC(st), Jtot: AW.totalAxialJ(st), transfers: st.transfers,
    refusals: st.refusals, clippedReturn: st.clippedReturn,
    returns: st.returns || 0, returned: st.returned || 0 }, extra || {});

  // (a) **現行**: depositWork(非負口座)+ transferFromBank
  const A = mk();
  const C0a = AW.ledgerC(A);
  let rawA = 0, worstCa = 0;
  for (let i = 0; i < cycles; i++) {
    for (const ww of [w, -w]) {
      rawA += ww;
      AW.depositWork(A, ww);
      if (ww > 0) AW.transferFromBank(A, ww, eta);
      worstCa = Math.max(worstCa, Math.abs(AW.ledgerC(A) - C0a));
    }
  }
  // (b) **可逆対照**: signedAxisWork(負は実際に返す・返せなければ拒否)
  const Bst = mk();
  const C0b = AW.ledgerC(Bst);
  let rawB = 0, refusedB = 0, worstCb = 0, worstJb = 0;
  const J0b = AW.totalAxialJ(Bst);
  for (let i = 0; i < cycles; i++) {
    for (const ww of [w, -w]) {
      rawB += ww;
      const r = AW.signedAxisWork(Bst, ww, 1);
      if (!r.ok) refusedB += r.refusedWork;
      worstCb = Math.max(worstCb, Math.abs(AW.ledgerC(Bst) - C0b));
      worstJb = Math.max(worstJb, Math.abs(AW.totalAxialJ(Bst) - J0b));
    }
  }
  return {
    w, cycles, eta,
    current: read(A, { Wraw: rawA, ledgerWorstAbs: worstCa, model: '現行(非負口座・整流)' }),
    reversible: read(Bst, { Wraw: rawB, refusedWork: refusedB, ledgerWorstAbs: worstCb,
      axialJWorstAbs: worstJb, model: '可逆対照(signedAxisWork)' }),
    omegaStart: (o.Smag === undefined ? 2 : o.Smag) / ((o.I === undefined) ? 1 : o.I),
  };
}

/** `solveDelta` の有理化の検算(R50): 小さい E で桁落ちしないこと。 */
export function rationalisedDeltaProbe(cases) {
  return (cases || [{ Smag: 2, JaPar: 0, I: 1, Ia: 1, e: 1e-20 }]).map((c) => {
    const st = AW.makeAxisState(c);
    const s = AW.solveDelta(st, c.e);
    const A = s.A, B = s.B;
    const naive = (B >= 0) ? (-B + Math.sqrt(B * B + 4 * A * c.e)) / (2 * A) : NaN;
    const exact = (B > 0) ? (c.e / B) * (1 - (A * c.e) / (B * B)) : Math.sqrt(c.e / A); // 1 次展開
    return { ...c, A, B, delta: s.delta, naive,
      dE: s.ok ? AW.deltaEnergy(st, s.delta) : null,
      series: exact,
      relToSeries: (exact !== 0) ? Math.abs(s.delta - exact) / Math.abs(exact) : null,
      naiveRelToSeries: (exact !== 0 && Number.isFinite(naive))
        ? Math.abs(naive - exact) / Math.abs(exact) : null };
  });
}

/* ══════════════════════════════════════════════════════════════════════════
 * (6) 無減衰の局所試作を NS へ延長した**否定対照**
 * ════════════════════════════════════════════════════════════════════════ */
/**
 * R44 の局所調和則(**r/r_c < 0.05 の局所模型**)a_r = −κ₀ r・κ₀ = GM_c/r_c³ を、
 * NS 連星の分離 r へそのまま当てたときの動径加速度を、**ニュートン値 −1 に規格化して**返す。
 * @param {object} o {r, rc, label}
 */
export function undampedLocalProbe(o) {
  const ratio = o.r / o.rc;
  return { label: o.label, r: o.r, rc: o.rc, rOverRc: ratio,
    windowMax: 0.05, insideWindow: ratio <= 0.05,
    // a_proto/a_newton = (GM/r_c³·r)/(GM/r²) = (r/r_c)³  —— ニュートンを −1 に規格化
    aNewtonNormalised: -1, aProtoNormalised: -(ratio ** 3),
    factor: ratio ** 3,
    verdict: (ratio <= 0.05) ? '窓の中' : '**窓の外**(局所模型を NS の分離へ一般則として延長しない)' };
}

export default { NSGRID_VERSION, NSGRID_PREMISE, NS_LEN, NS_INDEX, GATE,
  pairSlip, slipRmsCircular, slipTranslationInvariance, tidalCoeff,
  bodyTorques, nsDerivs, nsInvariants, transferStep, runNsRun, classifyTheta,
  runReversibleRoundTrip, rationalisedDeltaProbe, undampedLocalProbe };

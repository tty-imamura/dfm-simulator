// 第278便c(統括の検証項目 R55 の H6・AM15 —— **導出できた範囲だけ**)
// **内部モードの共役変数模型**: 潮汐の手との交換を**エネルギーと角力積の両方**で記帳する純関数。
//
// ■ 立場(先に書く)
//   ・これは**較正ではない**し、**NS の平衡の実証でもない**。モードの慣性 μ・固有振動数 ω_m・
//     摩擦 γ・結合(潮汐の強さ f)・容量 E_cap・飽和摩擦 γ_sat・自転の慣性 I_s は**すべて宣言**である。
//   ・観測の傾き(3.2°・40.6°)に**合わせる係数探索はしない**(したら fit と表示する)。
//   ・**エンジンには 1 バイトも接続していない**(`beta/index.html` はこの lib を読まない)。
//
// ■ 模型(単位: G=1・公転角速度 n=1・準円の公転は**与えた**円運動 r̂=(cos nt, sin nt, 0))
//   内部モードは**慣性系の対称トレースなし 3×3 テンソル** Q(5 自由度)と共役運動量 P:
//     H_mode = P:P/(2μ) + μω_m² Q:Q/2、 相互作用 U = −Q:F、 F(t) = f(3 r̂r̂ᵀ − I)(潮汐テンソル)
//   摩擦は**自転とともに回る流体に対する**変形速度にだけ効く(Rayleigh 型):
//     D = Q̇ − [W,Q](W = ω× の反対称行列)、 F_f = −γ_eff μ D、 γ_eff = γ + γ_sat·max(0, E_mode/E_cap − 1)
//     (**有限容量**: モードのエネルギーが E_cap を超えたぶんだけ摩擦が増える —— 宣言)
//   運動方程式: Q̇ = P/μ、 Ṗ = −μω_m²Q + F + F_f
//   角力積(回転の生成子 G_k v = e_k × v・トルク τ_k(X) = tr(G_k [Q, X])):
//     モードの角運動量  J_mode,k = tr(G_k [Q, P])
//     潮汐がモードへ与えるトルク τ_tid = τ(F)、摩擦がモードへ与えるトルク τ_f = τ(F_f)
//     dJ_mode/dt = τ_tid + τ_f、 **dS/dt = −τ_f**(自転)、 **dL_orb/dt = −τ_tid**(軌道の反作用)
//     → **J = L_orb + S + J_mode は連続系で厳密に保存**する(双線形の恒等式)。ただし J_mode は
//        状態の 2 次式なので **RK4 では刻みの 4 次で漂う**(器が実測して刻みを詰める —— 構造保存とは書かない)
//   **自転の大きさを外部で固定する対照**(`holdSpin:true` —— 宣言した供給): τ_s を打ち消すトルク
//     τ_agent = −(ŝ·τ_spin)ŝ を自転へ足し、その角力積 J_agent と仕事 W_agent を**別口座で記帳**する
//     (J − J_agent と E − W_agent が保存量)。固定 ω の零点が吸引かを時間領域で見るためだけに使う
//   エネルギー:
//     d(H_mode+U)/dt = Q̇:F_f − Q:Ḟ、 Q̇:F_f = −(熱) − dE_spin/dt(E_spin = |S|²/(2I_s))
//     **dE_orb/dt = Q:Ḟ = −n τ_tid,z = n dL_orb,z/dt**(円軌道の交換則 —— 恒等式として器が測る)
//     熱 Q̇_heat = γ_eff μ D:D ≥ 0
//     → E = E_orb + H_mode + U + E_spin + Heat − W_switch は保存(W_switch は供給停止の瞬間に
//        U を 0 にした仕事 = Q:F —— 黙って落とさない)
//
// ■ 導出できた式(**遅れの小さい極限** ω_m ≫ n, ω・γ ≪ ω_m)
//   Q ≈ F/(μω_m²) − (γ/(μω_m⁴))(Ḟ − [W,F]) を入れると、公転平均トルク(自転が受ける)は
//     ⟨τ⟩ = K (½Δ_x, ½Δ_y, Δ_z)、 Δ = n ẑ − ω、 **K = 18 f² γ / (μ ω_m⁴)**
//   ŝ=(sinθ,0,cosθ) の成分で書くと
//     τ_θ(傾きを増やす向き)= K sinθ (½ω cosθ − n) = **(Kω/4) sin2θ − K n sinθ**
//     τ_s(自転軸方向)    = K (n cosθ − ½ω(1+cos²θ))、 τ_ψ(歳差方向)= 0
//     熱 = K(½(Δ_x²+Δ_y²) + Δ_z²) ≥ 0、 軌道の供給 n τ_z = 自転の仕事 ω·τ + 熱(厳密)
//   → **sin2θ 以外に sinθ 項(係数 −Kn)が出る**。零点は cosθ* = 2n/ω(ω > 2n のときだけ中間角)。
//   **有限の ω_m では遅れが周波数に依るので sin3θ・sin4θ も出る**(器が数値で測る)。
import * as PB from './lib-w275e-powerball.mjs';

/** この lib の版(形を変えたら上げる。QA `behavior.nsModeExchange` がこの文字列を見る)。 */
export const NSMODE_VERSION = 'w278c-1';

export const NSMODE_PREMISE = {
  version: NSMODE_VERSION,
  source: '統括の検証項目 R55(H6 の帰還路 —— 共役変数と有限容量を持つ内部モード)',
  declared: ['μ(モードの慣性)', 'ω_m(モードの固有振動数)', 'γ(自転流体に対する摩擦)',
    'f(潮汐テンソルの強さ)', 'E_cap(容量)', 'γ_sat(飽和摩擦)', 'I_s(自転の慣性)', 'Ω_p(与えた歳差)'],
  notClaim: ['NS 連星の平衡の実証', '観測角の再現', '観測から係数を決めたこと', '中間傾斜で安定すること',
    '実在 NS の傾きの進化速度'],
  fitPolicy: '観測角(3.2°・40.6°)に合わせる係数探索はしない。したら fit と表示する',
  timeScale: '与えた係数に対する応答であり、実在の NS の時間尺度ではない(not_a_prediction)',
};

/* ── 3×3 行列(行優先の長さ 9 配列) ─────────────────────────────────────────── */
const Z9 = () => new Array(9).fill(0);
export const mat = {
  add: (a, b) => a.map((x, i) => x + b[i]),
  sub: (a, b) => a.map((x, i) => x - b[i]),
  scale: (a, k) => a.map((x) => x * k),
  mul(a, b) {
    const c = Z9();
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      let s = 0; for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j];
      c[3 * i + j] = s;
    }
    return c;
  },
  comm(a, b) { return mat.sub(mat.mul(a, b), mat.mul(b, a)); },
  dot: (a, b) => { let s = 0; for (let i = 0; i < 9; i++) s += a[i] * b[i]; return s; },
  tr: (a) => a[0] + a[4] + a[8],
  transpose: (a) => [a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]],
};
/** 回転の生成子 G_k(G_k v = e_k × v)。 */
export const GEN = [
  [0, 0, 0, 0, 0, -1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, -1, 0, 0],
  [0, -1, 0, 1, 0, 0, 0, 0, 0],
];
export function skew(w) { return [0, -w[2], w[1], w[2], 0, -w[0], -w[1], w[0], 0]; }
/** τ_k(Q, X) = tr(G_k [Q, X])(実行列)。 */
export function torqueOf(Q, X) {
  const c = mat.comm(Q, X);
  return [0, 1, 2].map((k) => mat.tr(mat.mul(GEN[k], c)));
}
/** 回転行列(軸 u・角 a)。器が torqueOf を有限回転で検算するのに使う。 */
export function rotMat(u, a) {
  const [x, y, z] = u, c = Math.cos(a), s = Math.sin(a), C = 1 - c;
  return [c + x * x * C, x * y * C - z * s, x * z * C + y * s,
    y * x * C + z * s, c + y * y * C, y * z * C - x * s,
    z * x * C - y * s, z * y * C + x * s, c + z * z * C];
}

/* ── 潮汐テンソル ────────────────────────────────────────────────────────── */
export function tideTensor(f, phase) {
  const c = Math.cos(phase), s = Math.sin(phase);
  const r = [c, s, 0];
  const F = Z9();
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) F[3 * i + j] = f * (3 * r[i] * r[j] - (i === j ? 1 : 0));
  return F;
}
function tideTensorDot(f, n, phase) {
  const c = Math.cos(phase), s = Math.sin(phase);
  const r = [c, s, 0], rd = [-n * s, n * c, 0];
  const F = Z9();
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) F[3 * i + j] = 3 * f * (rd[i] * r[j] + r[i] * rd[j]);
  return F;
}

/* ══════════════════════════════════════════════════════════════════════════
 * (1) 時間領域: makeMode / modeExchange / runMode
 * ════════════════════════════════════════════════════════════════════════ */
const IQ = 0, IP = 9, IS = 18, IL = 21, IE = 24, IH = 25, IA = 26, IW = 29;
export const MODE_LEN = 30;

/**
 * 模型と初期状態を作る。
 * @param {object} o {mu, omegaM, gamma, f, n, Ecap, gammaSat, Is, spin:{theta, psi, omega},
 *   kinematic:{precRate}(与えるなら自転は積分せず ŝ(t) を与える), phase0}
 */
export function makeMode(o) {
  const p = {
    mu: o.mu === undefined ? 1 : o.mu, omegaM: o.omegaM, gamma: o.gamma, f: o.f === undefined ? 1 : o.f,
    n: o.n === undefined ? 1 : o.n, Ecap: o.Ecap || 0, gammaSat: o.gammaSat || 0,
    Is: o.Is === undefined ? 1 : o.Is, phase0: o.phase0 || 0,
    kinematic: o.kinematic || null, supplyOn: true, holdSpin: !!o.holdSpin,
    spin0: { theta: o.spin.theta, psi: o.spin.psi || 0, omega: o.spin.omega },
  };
  const th = p.spin0.theta, ps = p.spin0.psi;
  const sh = [Math.sin(th) * Math.cos(ps), Math.sin(th) * Math.sin(ps), Math.cos(th)];
  const y = new Array(MODE_LEN).fill(0);
  const S0 = sh.map((x) => x * p.Is * p.spin0.omega);
  y[IS] = S0[0]; y[IS + 1] = S0[1]; y[IS + 2] = S0[2];
  return { p, y, t: 0, Wswitch: 0 };
}
function spinVector(p, t, y) {
  if (p.kinematic) {
    const th = p.spin0.theta, ps = p.spin0.psi + p.kinematic.precRate * t;
    const w = p.spin0.omega;
    return [w * Math.sin(th) * Math.cos(ps), w * Math.sin(th) * Math.sin(ps), w * Math.cos(th)];
  }
  return [y[IS] / p.Is, y[IS + 1] / p.Is, y[IS + 2] / p.Is];
}
function modeParts(p, t, y) {
  const Q = y.slice(IQ, IQ + 9), P = y.slice(IP, IP + 9);
  const w = spinVector(p, t, y), W = skew(w);
  const F = p.supplyOn ? tideTensor(p.f, p.n * t + p.phase0) : Z9();
  const Qd = mat.scale(P, 1 / p.mu);
  const D = mat.sub(Qd, mat.comm(W, Q));
  const Emode = mat.dot(P, P) / (2 * p.mu) + 0.5 * p.mu * p.omegaM * p.omegaM * mat.dot(Q, Q);
  const gEff = p.gamma + ((p.Ecap > 0 && p.gammaSat > 0) ? p.gammaSat * Math.max(0, Emode / p.Ecap - 1) : 0);
  const Ff = mat.scale(D, -gEff * p.mu);
  return { Q, P, w, W, F, Qd, D, Emode, gEff, Ff };
}
export function modeDerivs(p, t, y) {
  const m = modeParts(p, t, y);
  const d = new Array(MODE_LEN).fill(0);
  const Pd = mat.add(mat.add(mat.scale(m.Q, -p.mu * p.omegaM * p.omegaM), m.F), m.Ff);
  for (let i = 0; i < 9; i++) { d[IQ + i] = m.Qd[i]; d[IP + i] = Pd[i]; }
  const tTid = torqueOf(m.Q, m.F), tF = torqueOf(m.Q, m.Ff);
  for (let k = 0; k < 3; k++) { d[IS + k] = -tF[k]; d[IL + k] = -tTid[k]; }
  if (p.holdSpin && !p.kinematic) {
    // 外部の供給: 自転軸方向の成分だけを打ち消す(角力積と仕事を別口座へ)
    const wn = Math.hypot(m.w[0], m.w[1], m.w[2]);
    const sh = m.w.map((x) => x / wn);
    const ts = -(sh[0] * -tF[0] + sh[1] * -tF[1] + sh[2] * -tF[2]);
    for (let k = 0; k < 3; k++) { d[IS + k] += ts * sh[k]; d[IA + k] = ts * sh[k]; }
    d[IW] = ts * wn;
  }
  const Fd = p.supplyOn ? tideTensorDot(p.f, p.n, p.n * t + p.phase0) : Z9();
  d[IE] = mat.dot(m.Q, Fd);                       // dE_orb/dt = Q:Ḟ
  d[IH] = m.gEff * p.mu * mat.dot(m.D, m.D);      // 熱 ≥ 0
  return d;
}
/** 帳簿の読み口。 */
export function modeLedger(st) {
  const { p, y, t } = st;
  const m = modeParts(p, t, y);
  const S = y.slice(IS, IS + 3), L = y.slice(IL, IL + 3);
  const Jmode = torqueOf(m.Q, m.P);
  const Espin = p.kinematic ? 0 : (S[0] * S[0] + S[1] * S[1] + S[2] * S[2]) / (2 * p.Is);
  const U = -mat.dot(m.Q, m.F);
  const E = y[IE] + m.Emode + U + Espin + y[IH] - st.Wswitch - y[IW];
  return { t, E, Eorb: y[IE], Emode: m.Emode, U, Espin, heat: y[IH], Wswitch: st.Wswitch, Wagent: y[IW],
    J: [0, 1, 2].map((k) => L[k] + S[k] + Jmode[k] - y[IA + k]), Jagent: y.slice(IA, IA + 3),
    Lorb: L, S, Jmode, gEff: m.gEff,
    tauTid: torqueOf(m.Q, m.F), tauSpin: torqueOf(m.Q, m.Ff).map((x) => -x), w: m.w };
}
/**
 * 1 步(RK4)と、その步の**交換の記帳**(エネルギーと角力積)。
 * 返り値の sumE・sumJ は「各口座の変化の和」で、構造的に 0(丸め以外)。
 */
export function modeExchange(st, dt) {
  const a = modeLedger(st);
  st.y = PB.rk4(modeDerivs, st.p, st.t, st.y, dt);
  st.t += dt;
  const b = modeLedger(st);
  const dJ = { orbit: [0, 1, 2].map((k) => b.Lorb[k] - a.Lorb[k]),
    spin: [0, 1, 2].map((k) => b.S[k] - a.S[k]), mode: [0, 1, 2].map((k) => b.Jmode[k] - a.Jmode[k]),
    agent: [0, 1, 2].map((k) => b.Jagent[k] - a.Jagent[k]) };
  const dE = { orbit: b.Eorb - a.Eorb, spin: b.Espin - a.Espin,
    modeAndInteraction: (b.Emode + b.U) - (a.Emode + a.U), heat: b.heat - a.heat, agent: b.Wagent - a.Wagent };
  return { dE, dJ, sumE: dE.orbit + dE.spin + dE.modeAndInteraction + dE.heat - dE.agent,
    sumJ: [0, 1, 2].map((k) => dJ.orbit[k] + dJ.spin[k] + dJ.mode[k] - dJ.agent[k]),
    orbitIdentity: dE.orbit - st.p.n * dJ.orbit[2] };
}
/** 供給停止(潮汐テンソルを 0 にする)。U を 0 にした仕事 Q:F を W_switch に積む。 */
export function stopSupply(st) {
  if (!st.p.supplyOn) return 0;
  const m = modeParts(st.p, st.t, st.y);
  const w = mat.dot(m.Q, m.F);
  st.Wswitch += w;
  st.p.supplyOn = false;
  return w;
}
/** ŝ の傾き θ(度)と方位角 ψ(度)。 */
export function spinAngles(st) {
  const w = modeParts(st.p, st.t, st.y).w;
  const n = Math.hypot(w[0], w[1], w[2]);
  return { thetaDeg: Math.acos(Math.max(-1, Math.min(1, w[2] / n))) * 180 / Math.PI,
    psiDeg: Math.atan2(w[1], w[0]) * 180 / Math.PI, omega: n };
}
/** 局所基底(ŝ・ê_θ〔θ を増やす向き〕・ê_ψ)での成分。 */
export function localComponents(v, w) {
  const n = Math.hypot(w[0], w[1], w[2]);
  const s = w.map((x) => x / n);
  const rho = Math.hypot(s[0], s[1]);
  const eth = rho > 1e-300 ? [s[0] * s[2] / rho, s[1] * s[2] / rho, -rho] : [1, 0, 0];
  const eps = rho > 1e-300 ? [-s[1] / rho, s[0] / rho, 0] : [0, 1, 0];
  const d = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return { s: d(v, s), theta: d(v, eth), psi: d(v, eps) };
}

/**
 * 走行。`avgFrom` 以降の自転トルク(= −τ_f)と潮汐トルクを時間平均する。
 * @param {object} o {mode(makeMode の引数), dt, steps, avgFrom, stopAt, samples}
 */
export function runMode(o) {
  const st = makeMode(o.mode);
  const L0 = modeLedger(st);
  let worstE = 0, worstJ = 0, heatDrops = 0, worstStepE = 0, worstStepJ = 0, worstOrbitId = 0;
  let prevHeat = L0.heat, stopW = null;
  const acc = { spin: [0, 0, 0], tid: [0, 0, 0], local: { s: 0, theta: 0, psi: 0 }, heat: 0, n: 0,
    orbitPower: 0, spinPower: 0 };
  const Escale = Math.max(1e-300, o.Escale || Math.abs(L0.E) || 1);
  const Jscale = Math.max(1e-300, o.Jscale || Math.hypot(...L0.J) || 1);
  const trace = [];
  const every = Math.max(1, Math.floor(o.steps / (o.samples || 40)));
  for (let k = 0; k < o.steps; k++) {
    if (o.stopAt !== undefined && k === o.stopAt) stopW = stopSupply(st);
    const before = (k >= (o.avgFrom || 0)) ? modeLedger(st) : null;
    const ex = modeExchange(st, o.dt);
    const L = modeLedger(st);
    worstStepE = Math.max(worstStepE, Math.abs(ex.sumE) / Escale);
    worstStepJ = Math.max(worstStepJ, Math.hypot(...ex.sumJ) / Jscale);
    worstOrbitId = Math.max(worstOrbitId, Math.abs(ex.orbitIdentity) / Escale);
    worstE = Math.max(worstE, Math.abs(L.E - L0.E) / Escale);
    worstJ = Math.max(worstJ, Math.hypot(L.J[0] - L0.J[0], L.J[1] - L0.J[1], L.J[2] - L0.J[2]) / Jscale);
    if (L.heat < prevHeat - 1e-18 * Math.max(1, Math.abs(prevHeat))) heatDrops++;
    prevHeat = L.heat;
    if (before) {
      // 台形則: 步の両端の平均
      for (let i = 0; i < 3; i++) {
        acc.spin[i] += 0.5 * (before.tauSpin[i] + L.tauSpin[i]);
        acc.tid[i] += 0.5 * (before.tauTid[i] + L.tauTid[i]);
      }
      const lc = localComponents(before.tauSpin, before.w), lc2 = localComponents(L.tauSpin, L.w);
      acc.local.s += 0.5 * (lc.s + lc2.s); acc.local.theta += 0.5 * (lc.theta + lc2.theta);
      acc.local.psi += 0.5 * (lc.psi + lc2.psi);
      acc.heat += (L.heat - before.heat) / o.dt;
      acc.orbitPower += -(L.Eorb - before.Eorb) / o.dt;
      acc.spinPower += 0.5 * (mdot(before.w, before.tauSpin) + mdot(L.w, L.tauSpin));
      acc.n++;
    }
    if ((k + 1) % every === 0 || k === o.steps - 1) {
      const a = spinAngles(st);
      trace.push({ t: st.t, thetaDeg: a.thetaDeg, psiDeg: a.psiDeg, omega: a.omega, Emode: L.Emode,
        heat: L.heat, Jmode: Math.hypot(...L.Jmode), gEff: L.gEff });
    }
  }
  const N = Math.max(1, acc.n);
  const last = modeLedger(st);
  return { steps: o.steps, t: st.t, worstErel: worstE, worstJrel: worstJ, worstStepErel: worstStepE,
    worstStepJrel: worstStepJ, worstOrbitIdentityRel: worstOrbitId, heatDrops,
    avg: { tauSpin: acc.spin.map((x) => x / N), tauTid: acc.tid.map((x) => x / N),
      local: { s: acc.local.s / N, theta: acc.local.theta / N, psi: acc.local.psi / N },
      heat: acc.heat / N, orbitPower: acc.orbitPower / N, spinPower: acc.spinPower / N, samples: acc.n },
    first: L0, last, stopWork: stopW, trace, final: spinAngles(st) };
}
const mdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/* ══════════════════════════════════════════════════════════════════════════
 * (2) 周波数領域: 線形の定常応答(公転平均を**積分なしで**出す)
 * ════════════════════════════════════════════════════════════════════════ */
// 複素数は [re, im]。9×9 複素線形系をガウス消去(部分ピボット)で解く。
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cabs2 = (a) => a[0] * a[0] + a[1] * a[1];
function csolve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => row.map((x) => x.slice()).concat([b[i].slice()]));
  for (let c = 0; c < n; c++) {
    let piv = c, best = cabs2(M[c][c]);
    for (let r = c + 1; r < n; r++) { const v = cabs2(M[r][c]); if (v > best) { best = v; piv = r; } }
    if (piv !== c) { const tmp = M[c]; M[c] = M[piv]; M[piv] = tmp; }
    for (let r = c + 1; r < n; r++) {
      const fct = cdiv(M[r][c], M[c][c]);
      for (let k = c; k <= n; k++) M[r][k] = csub(M[r][k], cmul(fct, M[c][k]));
    }
  }
  const x = new Array(n);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n].slice();
    for (let k = r + 1; k < n; k++) s = csub(s, cmul(M[r][k], x[k]));
    x[r] = cdiv(s, M[r][r]);
  }
  return x;
}
// 複素行列(長さ 9 の [re,im])
const cm = {
  fromReal: (a) => a.map((x) => [x, 0]),
  mulRC(a, b) { // 実 a × 複素 b
    const c = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      let s = [0, 0]; for (let k = 0; k < 3; k++) s = cadd(s, [a[3 * i + k] * b[3 * k + j][0], a[3 * i + k] * b[3 * k + j][1]]);
      c[3 * i + j] = s;
    }
    return c;
  },
  mulCR(a, b) {
    const c = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      let s = [0, 0]; for (let k = 0; k < 3; k++) s = cadd(s, [a[3 * i + k][0] * b[3 * k + j], a[3 * i + k][1] * b[3 * k + j]]);
      c[3 * i + j] = s;
    }
    return c;
  },
  mulCC(a, b) {
    const c = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      let s = [0, 0]; for (let k = 0; k < 3; k++) s = cadd(s, cmul(a[3 * i + k], b[3 * k + j]));
      c[3 * i + j] = s;
    }
    return c;
  },
  ad(A, X) { // [A, X](A 実・X 複素)
    const l = cm.mulRC(A, X), r = cm.mulCR(X, A);
    return l.map((z, i) => csub(z, r[i]));
  },
  conj: (a) => a.map((z) => [z[0], -z[1]]),
  scale: (a, k) => a.map((z) => cmul(z, k)),
  add: (a, b) => a.map((z, i) => cadd(z, b[i])),
};
/** 複素の双線形トルク tr(G_k [A, B])(A・B 複素)の実部。 */
function ctorqueRe(A, B) {
  const c = cm.mulCC(A, B), d = cm.mulCC(B, A);
  const K = c.map((z, i) => csub(z, d[i]));
  return [0, 1, 2].map((k) => { let s = 0; for (let i = 0; i < 9; i++) s += GEN[k][(i % 3) * 3 + Math.floor(i / 3)] * K[i][0]; return s; });
}
// tr(G K) = Σ_ij G_ij K_ji  → 上の添字: i=3a+b(K_ab)に G_ba を掛ける

/**
 * 線形(容量なし)の定常応答。ŝ=(sinθ,0,cosθ)・ψ=0 の瞬間を、**歳差 Ω_p で回る座標**で解く
 * (Ω_p=0 なら慣性系)。σ ∈ {0, 2(n−Ω_p)} の 2 成分。
 * 返り値の tauSpin は自転が受ける公転平均トルク(= −⟨τ_f⟩)、tauTid は潮汐がモードへ与える平均トルク。
 * @param {object} p {mu, omegaM, gamma, f, n}
 * @param {number} theta rad
 * @param {object} [o] {omega(自転角速度), precRate(Ω_p)}
 */
export function steadyState(p, theta, o) {
  const mu = p.mu === undefined ? 1 : p.mu, wm = p.omegaM, g = p.gamma, f = p.f === undefined ? 1 : p.f;
  const n = p.n === undefined ? 1 : p.n, om = o.omega, Op = o.precRate || 0;
  const sh = [Math.sin(theta), 0, Math.cos(theta)];
  const Wp = skew(sh.map((x) => x * om)), Pp = skew([0, 0, Op]);
  const PmW = mat.sub(Pp, Wp);
  const F0 = [0.5 * f, 0, 0, 0, 0.5 * f, 0, 0, 0, -f];
  const F2 = [[1.5 * f, 0], [0, -1.5 * f], [0, 0], [0, -1.5 * f], [-1.5 * f, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  const solveAt = (sigma, Fc) => {
    const isig = [0, sigma];
    const op = (X) => {
      // μ(iσ + ad_P)²X + μω_m²X + γμ(iσX + ad_{P−W}X)
      const a1 = cm.add(cm.scale(X, isig), cm.ad(Pp, X));
      const a2 = cm.add(cm.scale(a1, isig), cm.ad(Pp, a1));
      const t1 = cm.scale(a2, [mu, 0]);
      const t2 = cm.scale(X, [mu * wm * wm, 0]);
      const t3 = cm.scale(cm.add(cm.scale(X, isig), cm.ad(PmW, X)), [g * mu, 0]);
      return cm.add(cm.add(t1, t2), t3);
    };
    const A = Array.from({ length: 9 }, () => new Array(9));
    for (let j = 0; j < 9; j++) {
      const E = new Array(9).fill(0).map(() => [0, 0]); E[j] = [1, 0];
      const col = op(E);
      for (let i = 0; i < 9; i++) A[i][j] = col[i];
    }
    const Q = csolve(A, Fc);
    const D = cm.add(cm.scale(Q, isig), cm.ad(PmW, Q));
    const Pm = cm.scale(cm.add(cm.scale(Q, isig), cm.ad(Pp, Q)), [mu, 0]);
    return { Q, D, Pm };
  };
  const s0 = solveAt(0, cm.fromReal(F0));
  const sig = 2 * (n - Op);
  const s2 = solveAt(sig, F2);
  // 平均 ⟨B(A,B)⟩ = B(A0,B0) + ½ Re B(A2, conj(B2))
  const avgTorque = (A0, B0, A2, B2) => {
    const t0 = ctorqueRe(A0, B0), t2 = ctorqueRe(A2, cm.conj(B2));
    return [0, 1, 2].map((k) => t0[k] + 0.5 * t2[k]);
  };
  const tauTid = avgTorque(s0.Q, cm.fromReal(F0), s2.Q, F2);
  const Ff0 = cm.scale(s0.D, [-g * mu, 0]), Ff2 = cm.scale(s2.D, [-g * mu, 0]);
  const tauF = avgTorque(s0.Q, Ff0, s2.Q, Ff2);
  const tauSpin = tauF.map((x) => -x);
  const Jmode = avgTorque(s0.Q, s0.Pm, s2.Q, s2.Pm);
  let heat = 0;
  for (let i = 0; i < 9; i++) heat += cabs2(s0.D[i]) + 0.5 * cabs2(s2.D[i]);
  heat *= g * mu;
  const w = sh.map((x) => x * om);
  const orbitSupply = n * tauTid[2];                 // −dE_orb/dt(⟨Ė_orb⟩ = −n⟨τ_tid,z⟩)
  const spinPower = mdot(w, tauSpin);
  const lc = localComponents(tauSpin, w);
  // 静的成分の最大虚部(解の健全性: σ=0 の解は実でなければならない)
  const imag0 = Math.max(...s0.Q.map((z) => Math.abs(z[1])));
  return { theta, omega: om, precRate: Op, tauTid, tauSpin, tauF, Jmode, heat, orbitSupply, spinPower,
    agentWork: orbitSupply - spinPower - heat, local: lc, imag0,
    // 歳差座標での平均角運動量の回転ぶん Ω_p ẑ × ⟨J_mode⟩(慣性系で J_mode が回るぶん)
    precJ: [-Op * Jmode[1], Op * Jmode[0], 0] };
}

/** 遅れの小さい極限の閉形式(導出した式)。 */
export function lagLimit(p, theta, o) {
  const mu = p.mu === undefined ? 1 : p.mu, f = p.f === undefined ? 1 : p.f, n = p.n === undefined ? 1 : p.n;
  const K = 18 * f * f * p.gamma / (mu * Math.pow(p.omegaM, 4));
  const om = o.omega;
  const w = [om * Math.sin(theta), 0, om * Math.cos(theta)];
  const Dl = [-w[0], -w[1], n - w[2]];
  const tau = [0.5 * K * Dl[0], 0.5 * K * Dl[1], K * Dl[2]];
  return { K, tauSpin: tau,
    tauTheta: K * Math.sin(theta) * (0.5 * om * Math.cos(theta) - n),
    tauS: K * (n * Math.cos(theta) - 0.5 * om * (1 + Math.cos(theta) ** 2)), tauPsi: 0,
    heat: K * (0.5 * (Dl[0] ** 2 + Dl[1] ** 2) + Dl[2] ** 2),
    thetaStarDeg: (om > 2 * n) ? Math.acos(2 * n / om) * 180 / Math.PI : null,
    sin2Coef: K * om / 4, sin1Coef: -K * n };
}

/** 公転平均トルク(自転が受ける)の局所成分。容量なし・線形の定常応答。 */
export function averagedTorque(p, theta, o) {
  const r = steadyState(p, theta, o);
  return { theta, tauSpin: r.tauSpin, tauTheta: r.local.theta, tauS: r.local.s, tauPsi: r.local.psi };
}
/** 公転平均の仕事(軌道の供給・自転の仕事・熱・歳差を与えた側の仕事)。 */
export function averagedWork(p, theta, o) {
  const r = steadyState(p, theta, o);
  return { theta, orbitSupply: r.orbitSupply, spinPower: r.spinPower, heat: r.heat, agentWork: r.agentWork,
    closure: r.agentWork };
}

/**
 * θ 依存の係数表。θ を 0..180° で標本化し、
 *  ① 正弦級数 b_k = (2/π)∫T(θ) sin kθ dθ(k=1..kmax)
 *  ② 多項式 T = sinθ Σ_{j=0}^{3} c_j cos^jθ の最小二乗
 *  ③ g(θ) = T/sin2θ と数値微分 dg/dθ(T が sin2θ だけなら g は一定・dg/dθ=0)
 *  ④ 零点(0° と 180° を除く)とその安定性(dT/dθ<0 なら θ̇=T/|S| で吸引)
 * @param {function} T θ(rad) → τ_θ
 */
export function thetaCoefficients(T, o) {
  const N = (o && o.samples) || 720, kmax = (o && o.kmax) || 6;
  const th = [], val = [];
  for (let i = 0; i <= N; i++) { const t = Math.PI * i / N; th.push(t); val.push(T(t)); }
  const h = Math.PI / N;
  const b = [];
  for (let k = 1; k <= kmax; k++) {
    let s = 0;
    for (let i = 0; i <= N; i++) { const w = (i === 0 || i === N) ? 0.5 : 1; s += w * val[i] * Math.sin(k * th[i]); }
    b.push((2 / Math.PI) * s * h);
  }
  // 多項式(正規方程式 4×4)
  const nb = 4, ATA = Array.from({ length: nb }, () => new Array(nb).fill(0)), ATy = new Array(nb).fill(0);
  for (let i = 0; i <= N; i++) {
    const s = Math.sin(th[i]), c = Math.cos(th[i]);
    const row = [s, s * c, s * c * c, s * c * c * c];
    for (let a = 0; a < nb; a++) { ATy[a] += row[a] * val[i]; for (let q = 0; q < nb; q++) ATA[a][q] += row[a] * row[q]; }
  }
  const c = solveReal(ATA, ATy);
  let polyRes = 0, maxAbs = 0;
  for (let i = 0; i <= N; i++) {
    const s = Math.sin(th[i]), cc = Math.cos(th[i]);
    const fit = s * (c[0] + c[1] * cc + c[2] * cc * cc + c[3] * cc * cc * cc);
    polyRes = Math.max(polyRes, Math.abs(fit - val[i])); maxAbs = Math.max(maxAbs, Math.abs(val[i]));
  }
  // sin2θ だけで表したときの残差
  let s2Res = 0;
  for (let i = 0; i <= N; i++) s2Res = Math.max(s2Res, Math.abs(val[i] - b[1] * Math.sin(2 * th[i])));
  // g(θ) と dg/dθ(代表角)
  const probes = ((o && o.probesDeg) || [10, 20, 30, 40.6, 60, 75]).map((d) => {
    const t = d * Math.PI / 180, e = 1e-4;
    const g = (x) => T(x) / Math.sin(2 * x);
    return { thetaDeg: d, T: T(t), g: g(t), dgdtheta: (g(t + e) - g(t - e)) / (2 * e),
      relSlope: (g(t + e) - g(t - e)) / (2 * e) / Math.max(1e-300, Math.abs(g(t))) };
  });
  // 零点
  const zeros = [];
  for (let i = 1; i < N - 1; i++) {
    if (val[i] === 0 || val[i] * val[i + 1] < 0) {
      let a = th[i], bb = th[i + 1];
      for (let it = 0; it < 80; it++) { const m = 0.5 * (a + bb); if (T(a) * T(m) <= 0) bb = m; else a = m; }
      const z = 0.5 * (a + bb), e = 1e-6;
      const slope = (T(z + e) - T(z - e)) / (2 * e);
      zeros.push({ thetaDeg: z * 180 / Math.PI, slope, attracting: slope < 0 });
    }
  }
  return { samples: N, sineCoef: b, sineCoefRel: b.map((x) => x / Math.max(1e-300, Math.abs(b[1]))),
    polyCoef: c, polyMaxResidualRel: polyRes / Math.max(1e-300, maxAbs),
    sin2OnlyMaxResidualRel: s2Res / Math.max(1e-300, maxAbs), maxAbs, probes, zeros };
}
function solveReal(A, b) {
  const n = b.length, M = A.map((r, i) => r.slice().concat([b[i]]));
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = c + 1; r < n; r++) { const k = M[r][c] / M[c][c]; for (let q = c; q <= n; q++) M[r][q] -= k * M[c][q]; }
  }
  const x = new Array(n);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let q = r + 1; q < n; q++) s -= M[r][q] * x[q]; x[r] = s / M[r][r]; }
  return x;
}

/**
 * 平均化した永年方程式(遅れの小さい極限の閉形式): dθ/dt = τ_θ/|S|、 d|S|/dt = τ_s。
 * 時間領域の走行と突き合わせる(「平均化が正しいか」の検算)。
 */
export function secularEvolve(p, o) {
  let th = o.theta, S = o.Is * o.omega, t = 0;
  const out = [{ t, thetaDeg: th * 180 / Math.PI, omega: S / o.Is }];
  const every = Math.max(1, Math.floor(o.steps / (o.samples || 40)));
  const rhs = (x) => { const ll = lagLimit(p, x[0], { omega: x[1] / o.Is });
    return [ll.tauTheta / x[1], o.holdSpin ? 0 : ll.tauS]; };
  for (let k = 0; k < o.steps; k++) {
    const y = [th, S];
    const k1 = rhs(y), k2 = rhs([y[0] + 0.5 * o.dt * k1[0], y[1] + 0.5 * o.dt * k1[1]]);
    const k3 = rhs([y[0] + 0.5 * o.dt * k2[0], y[1] + 0.5 * o.dt * k2[1]]);
    const k4 = rhs([y[0] + o.dt * k3[0], y[1] + o.dt * k3[1]]);
    th += (o.dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    S += (o.dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    t += o.dt;
    if ((k + 1) % every === 0 || k === o.steps - 1) out.push({ t, thetaDeg: th * 180 / Math.PI, omega: S / o.Is });
  }
  return out;
}

export default { NSMODE_VERSION, NSMODE_PREMISE, MODE_LEN, mat, GEN, skew, torqueOf, rotMat, tideTensor,
  makeMode, modeDerivs, modeLedger, modeExchange, stopSupply, spinAngles, localComponents, runMode,
  steadyState, lagLimit, averagedTorque, averagedWork, thetaCoefficients, secularEvolve };

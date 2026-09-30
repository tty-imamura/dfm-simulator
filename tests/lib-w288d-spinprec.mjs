// 第288便d(原仮定者の裁定(第78報)⑥・統括の検証項目 R116)—— **スピン・歳差・熱の口座**(node 模型・**エンジン未接続**)。
//
// ■ 何であって、何でないか
//   ・裁定 ⑥ の文(粒子は合体で運動エネルギー〔慣性移動とスピン〕を保存する・熱もミクロのスピン・ブレーキが熱を出す・
//     スピンが極限で軸を傾けて歳差へ・パワーボールの軸を押す仕事はスピンの加速へ〔減速方向はスピン減速〕・歳差も極限で
//     軸が 90° まで傾く・連星では公転周期と歳差が近づく〔同方向で近づき逆で反発〕・歳差の限界 → スピン再加速 → 限界超過で
//     初めて渦伸長)を、**測れる口座の形**に書いた**構成則の候補**である。**DFM から導出した法則ではない。**
//   ・`tests/lib-w275e-powerball.mjs`(POWERBALL_VERSION w275e-1)と `tests/lib-w276c-axiswork.mjs`(AXISWORK_VERSION w276c-2)の
//     関数と恒等式は**1 行も変えていない**。本 lib はその上に置き、剛体対照(I_∥=I_⊥ の球)で両者の値を再現する。
//   ・`beta/index.html` はこの lib を読まない。`S._core` には 1 命令も足していない。内蔵プリセットは 1 本も変わらない。
//
// ■ 状態と、エネルギーの正本(**剛体式を正本にする** —— 版 w288d-spinprec-1 の宣言)
//   軸 n=(sinθ cosφ, sinθ sinφ, cosθ)・θ は公転面法線から(0°=垂直・90°=面内)・φ は歳差位相・ψ は自転位相。
//   E_rot = ½I_∥(ψ̇+φ̇cosθ)² + ½I_⊥(θ̇² + φ̇² sin²θ)            (対称こまの剛体式 —— **正本**)
//   ω₃ ≡ ψ̇+φ̇cosθ(体軸まわりの角速度)を状態に持ち、口座を
//     E_spin = ½I_∥ω₃²・E_prec = ½I_⊥φ̇² sin²θ・E_nut = ½I_⊥θ̇²(準静的な口座移送では 0 と宣言)
//   に分ける(E_spin + E_prec + E_nut = E_rot は恒等式)。既存の |J|²/(2I) は**球(I_∥=I_⊥)でだけ**剛体式と一致する比較値で、
//   **両方を足さない**(二重計上しない)。I_∥≠I_⊥ では |J|²/(2I) は一つの I では書けない —— 比較欄に I=I_∥ の値を並べるだけ。
//   E_axis = K_tilt(1−cosθ)                                    (**トルクに逆らって軸を倒す**仕事の貯蔵 —— 宣言)
//     K_tilt は軸を公転面法線へ戻すトルクの強さ(宣言)。θ=90° で E_axis = K_tilt(**傾きの口座の上限**)。
//   Q = 熱(**ランダムなミクロ回転のエネルギーの和** —— ネット J=0 でも Q>0。符号付きスピンで代用しない)。
//
// ■ 上限は**無次元指標**で別々に宣言する(エンジンの柵 ±40 とは別物・天体種別と単位に依らない)
//   χ_spin = ω₃/ω_ref,spin・χ_prec = |φ̇|/ω_ref,prec。ω_ref の定義は INDEX_DEFS(kerr: cJ/(GM²)・surface: ΩR/c・
//   breakup: Ω/√(GM/R³)・ratio: 模型単位で宣言)から選ぶ —— どれを採るかは**決断事項候補**。
//   上限 σ_spin・σ_prec を超えない口座の容量: cap_spin = ½I_∥(σ_spin ω_ref,spin)²・cap_prec = ½I_⊥(σ_prec ω_ref,prec)²(θ=90°)。
//
// ■ 供給は W_drive だけ(τ·ŝ=0 —— ジャイロトルクは |S| を変えない。`lib-w275e-powerball` の負の対照 R37 のまま)
//   W_drive>0 → スピン口座へ(効率 η・(1−η) は熱)/ W_drive<0 → スピン口座から(**新しい項は要らない**・口座が 0 に
//   なった先は**拒否して `refused` に残す** —— 切り捨てて捨てない・スピンの向きの反転は本模型では扱わない)。
//   ブレーキ(減衰 γ_b)はスピン口座から Q へ: dE_spin/dt = −2γ_b E_spin(厳密な指数解で 1 刻みを進める)。
//   「パワーボールの摩擦説明」は採らない —— 手の結合 D が落ちると **W_drive が減る**(既存の分離のまま)。
//
// ■ 上限の連鎖(**構成則として宣言** —— 導出ではない)
//   ① E_spin が cap_spin を超えた分 → E_axis(θ が増える)
//   ② θ が 90°(E_axis = K_tilt)に達した後の余剰 → E_prec(φ̇ が増える)
//   ③ E_prec が cap_prec を超えた分 → スピンへ戻る(E_spin > cap_spin のまま残る)
//   ④ **そのときだけ** 渦伸長の旗 `stretchFlag` が立つ(旗と超過量 E_over だけ —— 伸長そのものは実装しない)
//   旧模型の Ω_prec = K a/|S|(|S| に従属)は `legacyPrecRate` として**そのまま残し**、口座の φ̇ と並べて比べる。
//   **従属を外すのはこの口座を足すときだけ**(旧模型の関数は変えない)。
//
// ■ 恒等式(このライブラリの受入条件)
//   Δ(E_spin + E_axis + E_prec + Q) = W_drive(受理した分)      —— 刻みごと・丸めの範囲
//
// ■ 周波数ロックの小模型(`lockToyDerivs`)
//   U_lock = −K cos(Δφ)・Δφ = φ_prec − φ_orb。位相差のトルク −K sinΔφ を歳差へ・+K sinΔφ を軌道へ(**反対符号**)。
//   減衰 γ(φ̇_prec−φ̇_orb) を同じく反対符号で・その仕事 γ(φ̇_prec−φ̇_orb)² を熱へ。
//   **符号は宣言**: 共通座標の軸が同向なら K>0(Δφ=0 へ近づく)・逆向なら K<0(Δφ=0 から離れる = 反発)。
//   「互いを向く局所軸」で数える規約では同じ配置の符号が逆になりうる(`lockSign` が両方の列を出す)。
//   既存物理が保証する普遍則ではない。γ=0 では収束しない(周期が近いだけでは自動でロックしない)。
//
// ■ 言わないこと: 歳差の発見・潮汐ロックの成立・腕の渦伸長による生成の主張・「DFM から導出した」「エンジンに実装した」
//   「実物のパワーボールの機構を証明した」「新発見」。
import * as PB from './lib-w275e-powerball.mjs';
import * as AW from './lib-w276c-axiswork.mjs';

export const SPINPREC_VERSION = 'w288d-spinprec-1';

export const SPINPREC_PREMISE = {
  version: SPINPREC_VERSION,
  source: '原仮定者の裁定(第78報)⑥・統括の検証項目 R116',
  status: '構成則の候補(DFM から導出した法則ではない)。エンジン未接続の node 模型',
  energyCanon: '剛体式 E_rot=½I_∥(ψ̇+φ̇cosθ)²+½I_⊥(θ̇²+φ̇²sin²θ) を正本とし E_spin/E_prec/E_nut に分ける。|J|²/(2I) は球でだけ一致する比較値(足さない)',
  supply: 'W_drive だけ(τ·ŝ=0 のジャイロトルクは供給源ではない)。W_drive<0 はスピン口座から・口座を越える分は拒否して記録',
  chain: '①スピン上限の超過→傾き(E_axis)②θ=90° 後の余剰→歳差(E_prec)③歳差上限の超過→スピンへ戻る④そのときだけ stretchFlag',
  heat: '熱 Q はランダムなミクロ回転のエネルギーの和(ネット J=0 でも Q>0)。符号付きスピンで代用しない',
  lockSign: '共通座標の軸が同向なら K>0・逆向なら K<0(宣言)。局所軸(互いを向く)の規約では符号が変わりうる',
  unchanged: ['tests/lib-w275e-powerball.mjs(w275e-1)', 'tests/lib-w276c-axiswork.mjs(w276c-2)'],
  notClaim: ['歳差の発見', '潮汐ロックの成立', '腕の渦伸長による生成', 'DFM からの導出', 'エンジンへの実装',
    '実物のパワーボールの接触機構の証明', 'σ_spin・σ_prec・K_tilt・K・γ の実在天体での同定'],
};

/* ── (1) 無次元指標(単位と天体種別に依らない) ─────────────────────────────── */
/** ω_ref の定義。どれも ω に**線形**なので、指標 χ = ω/ω_ref の上限は ω の上限に 1 対 1 で写る。 */
export const INDEX_DEFS = {
  kerr: { formula: 'χ = c J/(G M²)・J = I ω', omegaRef: (b) => (b.G * b.M * b.M) / (b.c * b.I) },
  surface: { formula: 'χ = Ω R / c', omegaRef: (b) => b.c / b.R },
  breakup: { formula: 'χ = Ω / √(G M / R³)', omegaRef: (b) => Math.sqrt(b.G * b.M / (b.R * b.R * b.R)) },
  ratio: { formula: 'χ = ω / ω_ref(模型単位で宣言した ω_ref)', omegaRef: (b) => b.omegaRef },
};
/** 無次元指標 χ = |ω| / ω_ref(def は INDEX_DEFS の鍵)。 */
export function indexOf(def, body, omega) {
  const D = INDEX_DEFS[def];
  if (!D) throw new Error('未知の指標: ' + def);
  const w = D.omegaRef(body);
  return Math.abs(omega) / w;
}
/** 口座の容量(指標の上限 σ から): cap = ½ I (σ ω_ref)²。 */
export function capOf(def, body, sigma) {
  const w = INDEX_DEFS[def].omegaRef(body) * sigma;
  return 0.5 * body.I * w * w;
}

/* ── (2) 剛体式と比較値 ─────────────────────────────────────────────────── */
/** 対称こまの剛体式 E_rot(**正本**)。 */
export function rigidErot(Ipar, Iperp, psiDot, phiDot, theta, thetaDot) {
  const w3 = psiDot + phiDot * Math.cos(theta), s = Math.sin(theta);
  return 0.5 * Ipar * w3 * w3 + 0.5 * Iperp * ((thetaDot || 0) * (thetaDot || 0) + phiDot * phiDot * s * s);
}
/** ∂²E_rot/∂ψ̇∂φ̇ = I_∥ cosθ(自転と歳差の**交差項**の係数 —— θ=90° で機械ゼロ)。 */
export const crossCoupling = (Ipar, theta) => Ipar * Math.cos(theta);
/** 比較値 |J|²/(2I)(球でだけ剛体式と一致 —— **足さない**)。J=(I_⊥φ̇ sinθ, I_⊥θ̇, I_∥ω₃) の大きさ。 */
export function jSquaredOver2I(Ipar, Iperp, w3, phiDot, theta, thetaDot, I) {
  const a = Iperp * phiDot * Math.sin(theta), b = Iperp * (thetaDot || 0), c = Ipar * w3;
  return (a * a + b * b + c * c) / (2 * I);
}
/** 旧模型の歳差率 Ω_prec = K a/|S|(`lib-w275e-powerball` の precessionRate をそのまま呼ぶ —— |S| に従属)。 */
export const legacyPrecRate = (K, a, Smag) => PB.precessionRate(K, a, Smag);

/* ── (3) 口座の状態 ─────────────────────────────────────────────────────── */
/**
 * @param {object} o {Ipar, Iperp, omega0, Ktilt, capSpin, capPrec, eta}
 *   capSpin / capPrec は capOf(…) で指標の上限から作る(**エンジンの柵 40 とは無関係**)。
 */
export function makeAccounts(o) {
  const s = o || {};
  const Ipar = s.Ipar, Iperp = s.Iperp;
  const w0 = s.omega0 || 0;
  return {
    t: 0, Ipar, Iperp, Ktilt: s.Ktilt, capSpin: s.capSpin, capPrec: s.capPrec,
    Espin: 0.5 * Ipar * w0 * w0, Eaxis: 0, Eprec: 0, Q: 0,
    Win: 0, refused: 0,                 // 受理した W_drive の和・拒否した分(口座を越えた引き出し)
    flowSA: 0, flowSP: 0, flowPS: 0,    // 連鎖の流れ(スピン→傾き・スピン→歳差・歳差→スピン)
    stretchFlag: false, Eover: 0,
    events: { spinCap: null, axisFull: null, precCap: null, stretch: null },
    steps: 0,
  };
}
/** 総エネルギー(口座の和)。 */
export const totalE = (st) => st.Espin + st.Eaxis + st.Eprec + st.Q;
/** 状態から読む幾何量(ω₃・θ・φ̇・ψ̇)。 */
export function geometry(st) {
  const w3 = Math.sqrt(Math.max(0, 2 * st.Espin / st.Ipar));
  const c = (st.Ktilt > 0) ? Math.max(-1, Math.min(1, 1 - st.Eaxis / st.Ktilt)) : 1;
  const theta = Math.acos(c);
  const s = Math.sin(theta);
  const phiDot = (s > 0 && st.Eprec > 0) ? Math.sqrt(2 * st.Eprec / (st.Iperp * s * s)) : 0;
  return { omega3: w3, theta, thetaDeg: theta * 180 / Math.PI, phiDot, psiDot: w3 - phiDot * Math.cos(theta) };
}

/* ── (4) 1 刻み ─────────────────────────────────────────────────────────── */
/**
 * @param {object} st makeAccounts の状態(**破壊的に更新**)
 * @param {object} o {P(W_drive の仕事率・符号つき), eta(0..1・既定 1), gamma(ブレーキ・既定 0), dt}
 * 手順(宣言): P≥0 は供給とブレーキを同じ指数解で(dE/dt = ηP − 2γE)・P<0 は先に引き出し(口座を越える分は拒否)→ ブレーキ。
 * 最後に上限の連鎖。
 */
export function stepAccounts(st, o) {
  const dt = o.dt, g = o.gamma || 0;
  const eta = (o.eta === undefined) ? 1 : Math.max(0, Math.min(1, o.eta));
  // o.W(その刻みの仕事)を直接渡せる —— 既存の器の刻みごとの W を丸めずに受け取る対照用
  const W = (o.W !== undefined) ? o.W : (o.P || 0) * dt;
  const P = (o.W !== undefined) ? o.W / dt : (o.P || 0);
  if (W >= 0) {
    const E0 = st.Espin;
    let E1;
    if (g > 0) { const a = Math.exp(-2 * g * dt); E1 = E0 * a + eta * P * (1 - a) / (2 * g); }
    else E1 = E0 + eta * W;
    st.Espin = E1;
    st.Q += W - (E1 - E0);              // (1−η)W と、ブレーキの熱(= ηW − ΔE_spin)
    st.Win += W;
  } else {
    const want = -W;
    const take = Math.min(want, st.Espin);
    st.Espin -= take; st.Win -= take; st.refused += want - take;
    if (g > 0) { const E0 = st.Espin, E1 = E0 * Math.exp(-2 * g * dt); st.Espin = E1; st.Q += E0 - E1; }
  }
  st.t += dt; st.steps++;
  cascade(st);
  return st;
}

/** 上限の連鎖(構成則)。**移すだけ**で総和は変えない(丸めの範囲)。 */
export function cascade(st) {
  // 到達(=)は記録し、超過(>)だけを移す。旗は歳差の上限を**超えた**刻みで初めて立つ
  if (st.Espin >= st.capSpin && st.events.spinCap === null) st.events.spinCap = st.t;
  if (!(st.Espin > st.capSpin)) return;
  // ① スピン → 傾き
  if (st.Eaxis < st.Ktilt) {
    const ex = st.Espin - st.capSpin, room = st.Ktilt - st.Eaxis;
    if (ex < room) { st.Espin -= ex; st.Eaxis += ex; st.flowSA += ex; return; }
    st.Espin -= room; st.Eaxis = st.Ktilt; st.flowSA += room;
    if (st.events.axisFull === null) st.events.axisFull = st.t;
  }
  // ② θ=90° の後の余剰 → 歳差
  const ex2 = st.Espin - st.capSpin;
  if (!(ex2 > 0)) return;
  st.Espin -= ex2; st.Eprec += ex2; st.flowSP += ex2;
  if (st.Eprec >= st.capPrec && st.events.precCap === null) st.events.precCap = st.t;
  // ③ 歳差の上限の超過 → スピンへ戻る(④ そのときだけ旗)
  if (st.Eprec > st.capPrec) {
    const back = st.Eprec - st.capPrec;
    st.Eprec = st.capPrec; st.Espin += back; st.flowPS += back;
    st.stretchFlag = true; st.Eover = st.Espin - st.capSpin;
    if (st.events.stretch === null) st.events.stretch = st.t;
  }
}

/**
 * 走行。P(t)・gamma・eta は宣言。スナップショットは `every` 刻みごと(最初と最後を含む)。
 * 返り値に**刻みごとの恒等式の最悪残差**(|Δ総和 − W_in|)と、旗が立つ前の口座の状態を持つ。
 */
export function runAccounts(o) {
  const st = makeAccounts(o.init);
  const E0 = totalE(st);
  const snaps = [];
  const snap = () => {
    const g = geometry(st);
    snaps.push({ t: st.t, Espin: st.Espin, Eaxis: st.Eaxis, Eprec: st.Eprec, Q: st.Q, Win: st.Win,
      thetaDeg: g.thetaDeg, phiDot: g.phiDot, omega3: g.omega3, psiDot: g.psiDot,
      chiSpin: o.omegaRefSpin ? g.omega3 / o.omegaRefSpin : null,
      chiPrec: o.omegaRefPrec ? g.phiDot / o.omegaRefPrec : null,
      stretchFlag: st.stretchFlag, Eover: st.Eover });
  };
  snap();
  let worstRes = 0, flagBeforePrecCap = false, spinAboveCapBeforeFlag = 0;
  const every = Math.max(1, Math.round((o.sampleEvery || 1) / o.dt));
  for (let k = 0; k < o.steps; k++) {
    const t = st.t;
    stepAccounts(st, { P: o.P(t), gamma: o.gamma || 0, eta: o.eta, dt: o.dt });
    const res = Math.abs((totalE(st) - E0) - st.Win);
    if (res > worstRes) worstRes = res;
    if (st.stretchFlag && st.events.precCap === null) flagBeforePrecCap = true;
    if (!st.stretchFlag && st.Espin > st.capSpin) spinAboveCapBeforeFlag = Math.max(spinAboveCapBeforeFlag, st.Espin - st.capSpin);
    if ((k + 1) % every === 0 || k === o.steps - 1) snap();
  }
  const scale = Math.max(1, Math.abs(E0), Math.abs(st.Win) + Math.abs(st.refused));
  return { id: o.id, st, snaps, E0, worstResAbs: worstRes, worstResRel: worstRes / scale,
    flagBeforePrecCap, spinAboveCapBeforeFlag, geometry: geometry(st) };
}

/* ── (5) 閉形式(一定の仕事率 P・ブレーキ γ) ───────────────────────────── */
/**
 * E' = ηP − 2γE の解と、連鎖の各段の到達時刻。スピンが cap に張り付いた後は
 * 傾き・歳差の口座へ入る正味の率 r = ηP − 2γ cap_spin(一定)で線形に増える(宣言した手順と同じ構成則)。
 * @returns {{tSpinCap, tAxisFull, tPrecCap, Espin(t), Eaxis(t), Eprec(t)}}
 */
export function closedForm(o) {
  const { P, gamma: g = 0, eta = 1, E0, capSpin, Ktilt, capPrec } = o;
  const Pin = eta * P;
  const Espin0 = (t) => (g > 0 ? Pin / (2 * g) + (E0 - Pin / (2 * g)) * Math.exp(-2 * g * t) : E0 + Pin * t);
  let tS;
  if (E0 >= capSpin) tS = 0;
  else if (g > 0) { const Einf = Pin / (2 * g); tS = (Einf > capSpin) ? -Math.log((capSpin - Einf) / (E0 - Einf)) / (2 * g) : Infinity; }
  else tS = (Pin > 0) ? (capSpin - E0) / Pin : Infinity;
  const r = Pin - 2 * g * capSpin;       // 張り付いた後の正味の率
  const tA = (Number.isFinite(tS) && r > 0) ? tS + Ktilt / r : Infinity;
  const tP = (Number.isFinite(tA) && r > 0) ? tA + capPrec / r : Infinity;
  // 張り付いた後の閉形式は**ブレーキ 0 のときだけ**刻みの手順と厳密に一致する(γ>0 では「刻みの指数解 → 連鎖」の
  // 分割が連続の張り付きと O(γ dt) 違う —— 器は γ>0 の走行では張り付く前の E_spin(t) と到達時刻の刻みだけを照合する)
  const exact = !(g > 0);
  return {
    tSpinCap: tS, tAxisFull: tA, tPrecCap: tP, rateAfterCap: r, exactAfterCap: exact,
    Espin: (t) => (t <= tS ? Espin0(t) : (!exact ? null : (t <= tP ? capSpin : capSpin + Pin * (t - tP)))),
    Eaxis: (t) => (t <= tS ? 0 : (!exact ? null : Math.min(Ktilt, r * (t - tS)))),
    Eprec: (t) => (t <= tA ? 0 : (!exact ? null : Math.min(capPrec, r * (t - tA)))),
  };
}

/* ── (6) 熱 = ミクロのスピンの和(ネット J=0 でも Q>0) ─────────────────── */
/** 決定論的な擬似乱数(mulberry32)。 */
export function prng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/**
 * N 個のミクロ回転子(対で ±ω —— ネット J は構成で厳密に 0)。Q = Σ½Iω² > 0。
 * 「符号付きスピンの和」(= ネット J)は 0 で、Q の代用にならない(負の対照)。
 */
export function microSpinHeat(o) {
  const N = o.N, I = o.I, rnd = prng(o.seed);
  const om = [];
  for (let k = 0; k < N / 2; k++) {
    const u1 = Math.max(1e-300, rnd()), u2 = rnd();
    const w = o.omegaRms * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    om.push(w, -w);
  }
  let Q = 0, Jnet = 0;
  for (let k = 0; k < om.length; k += 2) { Q += 0.5 * I * (om[k] * om[k] + om[k + 1] * om[k + 1]); Jnet += I * om[k] + I * om[k + 1]; }
  // ブレーキで ΔE を受け取ったとき: 全員の |ω| を同じ比で上げる(ネット J は 0 のまま・Q だけ増える)
  const addHeat = (dE) => { const f = Math.sqrt((Q + dE) / Q); let Q2 = 0, J2 = 0;
    for (let k = 0; k < om.length; k += 2) { const a = om[k] * f, b = om[k + 1] * f; Q2 += 0.5 * I * (a * a + b * b); J2 += I * a + I * b; }
    return { Q: Q2, Jnet: J2 }; };
  return { N: om.length, Q, Jnet, signedSpinProxy: Jnet, addHeat };
}

/* ── (7) 周波数ロックの小模型 ─────────────────────────────────────────── */
/** 状態 z = [φ_prec, φ̇_prec, φ_orb, φ̇_orb, Q]。P = {Ip, Io, K, gamma}。 */
export const LOCKTOY_LEN = 5;
export function lockToyDerivs(P, t, z) {
  const d = z[0] - z[2], f = P.K * Math.sin(d), dw = z[1] - z[3], g = P.gamma * dw;
  return [z[1], (-f - g) / P.Ip, z[3], (f + g) / P.Io, g * dw];
}
export function lockToyInvariants(P, z) {
  const d = z[0] - z[2];
  const Emech = 0.5 * P.Ip * z[1] * z[1] + 0.5 * P.Io * z[3] * z[3] - P.K * Math.cos(d);
  return { dphi: d, dphiWrapped: wrapPi(d), detune: z[1] - z[3], Emech, Etot: Emech + z[4], Q: z[4],
    Jsum: P.Ip * z[1] + P.Io * z[3] };
}
export function wrapPi(a) { let x = a % (2 * Math.PI); if (x > Math.PI) x -= 2 * Math.PI; if (x < -Math.PI) x += 2 * Math.PI; return x; }
/** 宣言の符号: 共通座標の軸の内積の符号(common)か、相手を向く方向への射影の積の符号(local)。 */
export function lockSign(n1, n2, rhat) {
  const dot = PB.v3.dot(n1, n2);
  const a1 = PB.v3.dot(n1, rhat), a2 = PB.v3.dot(n2, PB.v3.mul(rhat, -1));
  return { common: Math.sign(dot), local: Math.sign(a1 * a2), dot, a1, a2 };
}
/**
 * ロックの走行。`center` は Δφ を測る基準(K>0 なら 0・K<0 なら π)。
 * 返り値: 窓ごとの Δφ の振れ幅(最初の 20%・最後の 20%)・最悪の総 E の増加・J の漂い・循環回数。
 */
export function runLockToy(o) {
  const P = { Ip: o.Ip, Io: o.Io, K: o.K, gamma: o.gamma };
  let z = o.z0.slice(), t = 0;
  const inv0 = lockToyInvariants(P, z);
  const center = (o.K >= 0) ? 0 : Math.PI;
  const dev = (d) => wrapPi(d - center);
  const n = o.steps, w = Math.max(1, Math.floor(n / 5));
  let firstAmp = 0, lastAmp = 0, maxDev = Math.abs(dev(inv0.dphi)), worstEup = 0, worstJ = 0, circ = 0;
  let prev = dev(inv0.dphi), EmechPrev = inv0.Emech, worstEmechUp = 0;
  const snaps = [{ t: 0, dphi: inv0.dphi, dev: prev, detune: inv0.detune, Etot: inv0.Etot, Q: inv0.Q }];
  const every = Math.max(1, Math.floor(n / (o.samples || 40)));
  for (let k = 0; k < n; k++) {
    z = PB.rk4(lockToyDerivs, P, t, z, o.dt); t += o.dt;
    const iv = lockToyInvariants(P, z), dv = dev(iv.dphi);
    if (Math.abs(dv - prev) > Math.PI) circ++;
    prev = dv;
    const a = Math.abs(dv);
    if (k < w) firstAmp = Math.max(firstAmp, a);
    if (k >= n - w) lastAmp = Math.max(lastAmp, a);
    maxDev = Math.max(maxDev, a);
    worstEup = Math.max(worstEup, iv.Etot - inv0.Etot);
    worstEmechUp = Math.max(worstEmechUp, iv.Emech - EmechPrev);
    EmechPrev = iv.Emech;
    worstJ = Math.max(worstJ, Math.abs(iv.Jsum - inv0.Jsum));
    if ((k + 1) % every === 0 || k === n - 1) snaps.push({ t, dphi: iv.dphi, dev: dv, detune: iv.detune, Etot: iv.Etot, Q: iv.Q });
  }
  const last = lockToyInvariants(P, z);
  return { id: o.id, K: o.K, gamma: o.gamma, t, z, first: inv0, last, center,
    devFinal: Math.abs(dev(last.dphi)), detuneFinal: Math.abs(last.detune),
    firstAmp, lastAmp, maxDev, circulations: circ,
    worstEtotUp: worstEup, worstEmechStepUp: worstEmechUp, worstJsumAbs: worstJ, snaps };
}
/** 振り子の厳密周期(振幅 A・線形角振動数 Ω₀=√(K/μ)): T = 4K(k)/Ω₀・k = sin(A/2)(K(k) は AGM)。 */
export function pendulumPeriod(A, Omega0) {
  const k = Math.sin(A / 2);
  let a = 1, b = Math.sqrt(1 - k * k);
  for (let i = 0; i < 40 && Math.abs(a - b) > 1e-17 * a; i++) { const an = 0.5 * (a + b); b = Math.sqrt(a * b); a = an; }
  return 4 * (Math.PI / (2 * a)) / Omega0;
}

export default { SPINPREC_VERSION, SPINPREC_PREMISE, INDEX_DEFS, indexOf, capOf, rigidErot, crossCoupling, jSquaredOver2I,
  legacyPrecRate, makeAccounts, totalE, geometry, stepAccounts, cascade, runAccounts, closedForm, prng, microSpinHeat,
  LOCKTOY_LEN, lockToyDerivs, lockToyInvariants, wrapPi, lockSign, runLockToy, pendulumPeriod };
// 既存の器との対照に使う名前(本 lib は AW を読むだけ —— 変えない)
export { PB, AW };

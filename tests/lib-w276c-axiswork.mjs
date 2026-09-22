// 第276便c(原仮定者の裁定(第66報)(3)「パワーボール」)—— **軸へなされた仕事が自転へ移る
// 有限の移送チャネル**の純関数。**エンジンには 1 バイトも接続していない**(`S._core` には
// 1 命令も足していない)。
//
// ■ 何を認め、何を認めないか(採用条件)
//   裁定 (3) が重要視するのは「**ジャイロの軸に対して与えたエネルギーが、ジャイロの加速に繋がる**」
//   経路の**存在**である。裁定は「アナロジーでは、経路の物理的証明が出来なくても**エネルギーが
//   保存されれば許容する**」と述べている。したがって本ライブラリの採用条件は **帳簿が閉じること**
//   ただ 1 つであり、**実物のパワーボールの接触機構を証明するものではない**。
//   第275便e の負の対照(軸に垂直なジャイロトルクは τ·ŝ=0 なので |S| を動かさない)は**否定されていない** ——
//   本チャネルは「垂直トルクが直接加速する」経路ではなく、**軸へなされた仕事を口座に貯め、
//   そこから有限量だけ機械的に移す**経路である(供給源が無ければ 1 も動かない)。
//
// ■ 口座(bank)と移送(統括の検証項目 R42)
//   ・**口座**: W_axis = ∫ τ_axis·ω_axis dt を `bank` に貯める。入力が 0 なら 1 も増えない。
//   ・**移送**: 要求 `request` と効率 η∈[0,1] で、口座から w = min(request, bank) を引き出し、
//     **ηw を機械的交換**・**(1−η)w を熱**へ回す。
//   ・**機械的交換**は自転へ角力積 +δ ŝ・**反作用ローターへ −δ ŝ**(S + J_a は**構造的に保存**)。
//     I・I_a 固定なら
//         ΔE = A δ² + B δ,  A = ½(1/I + 1/I_a),  B = |S|/I − (J_a·ŝ)/I_a
//     なので ΔE = ηw を δ について解く(**B ≥ 0 の仕事駆動枝のみ**。B<0 は拒否 —— 受動交換は別枝)。
//         δ = (−B + √(B² + 4A ηw)) / (2A)  ≥ 0
//   ・**w=0 なら δ=0**。**口座が尽きれば停止**(無限電源にしない)。
//
// ■ 「力を抜く」(裁定 (3) の対照 —— **負の drive の手入力ではない**)
//   入力を 0 にして**抵抗・逆移送だけを残す**操作である。受動ブレーキは同じ 2 次式を δ<0 で使い、
//   **δ ∈ (−B/A, 0)** に収めることで ΔE = Aδ²+Bδ < 0 を**構造的に**保証する
//   (熱 = −ΔE ≥ 0 が丸め以外で破れない)。角運動量は +|δ| がローターへ移るので保存する。
//
// ■ 閉じの恒等式(**このライブラリの唯一の採用条件**)
//       C = E_spin + E_rotor + Heat + bank − W_in = 一定
//   ・口座へ積む:  bank +w_in・W_in +w_in            → ΔC = 0
//   ・移送:        bank −w・(E_spin+E_rotor) +ηw・Heat +(1−η)w → ΔC = 0
//   ・受動ブレーキ:(E_spin+E_rotor) +ΔE・Heat −ΔE     → ΔC = 0
//   丸め以外で漂わないことを器が実測する。
//
// ■ 言わないこと
//   「パワーボールの機構を証明した」「実物の接触機構を再現した」「自転が無限に上がる」
//   「エンジンに実装した」「新発見」。
// 第277便c(R50)で `solveDelta` の有理化と `signedAxisWork`(可逆対照)を足したので版を上げた。
// **既存の関数の外から見える契約は変えていない**(solveDelta は同じ根を桁落ちなしで返す)。
export const AXISWORK_VERSION = 'w276c-2';

/** 裁定 (3) の要旨と、本チャネルの採用条件(器の結果 JSON の meta に同じ文字列が載る)。 */
export const AXISWORK_PREMISE = {
  version: AXISWORK_VERSION,
  source: '原仮定者の裁定(第66報)(3)',
  adopted: '軸に対して与えたエネルギーが自転の加速に繋がる**経路の存在**を、有限の口座と'
    + '機械的交換として置く(裁定「経路の物理的証明が出来なくてもエネルギーが保存されれば許容する」)',
  acceptance: '**帳簿が閉じること**(C = E_spin + E_rotor + Heat + bank − W_in が一定)。これだけが採用条件である',
  notClaim: ['実物のパワーボールの接触機構の証明', '垂直トルクが直接 |S| を動かすこと',
    'エンジンへの実装', '自転の無限加速', 'η・γ・要求率の実在天体での同定'],
  negativeControl: '入力 0(W=0)なら δ=0 で自転は 1 も動かない。口座が尽きればそれ以上加速しない'
    + '(第275便e R37 の負の対照は**否定されていない**)',
};

/* ── (1) 口座の状態 ───────────────────────────────────────────────────────── */
/**
 * @param {object} o {Smag, JaPar(=J_a·ŝ), JaPerp2(=|J_a⊥|²・不変), I, Ia, bank, heat}
 */
export function makeAxisState(o) {
  const s = o || {};
  return {
    t: 0,
    Smag: s.Smag === undefined ? 2 : s.Smag,      // 自転の大きさ(軸 ŝ は動かさない)
    JaPar: s.JaPar || 0,                          // 反作用ローターの ŝ 成分
    JaPerp2: s.JaPerp2 || 0,                      // ローターの面外成分の二乗(この枝では不変)
    I: s.I === undefined ? 1 : s.I,
    Ia: s.Ia === undefined ? 1 : s.Ia,
    bank: s.bank || 0,
    heat: s.heat || 0,
    Win: 0,                                       // 受け入れた入力仕事の総和
    Wdrawn: 0,                                    // 口座から引き出した総和
    transfers: 0, refusals: 0, brakes: 0,
    depletedAt: null,                             // 口座が初めて尽きた時刻
    lastRefuseReason: null,
    clippedReturn: 0,                             // 口座が負になるのを止めた分(逆流の頭打ち)
  };
}

export const spinEnergy = (st) => (st.I > 0 ? (st.Smag * st.Smag) / (2 * st.I) : 0);
export const rotorEnergy = (st) => (st.Ia > 0 ? (st.JaPerp2 + st.JaPar * st.JaPar) / (2 * st.Ia) : 0);
export const omegaSpin = (st) => (st.I > 0 ? st.Smag / st.I : 0);
/** 閉じの量 C = E_spin + E_rotor + Heat + bank − W_in。**一定であるべき**。 */
export const ledgerC = (st) => spinEnergy(st) + rotorEnergy(st) + st.heat + st.bank - st.Win;
/** 全角運動量の ŝ 成分 S + J_a·ŝ(**構造的に保存**)。 */
export const totalAxialJ = (st) => st.Smag + st.JaPar;

/* ── (2) 2 次式の係数と解 ─────────────────────────────────────────────────── */
/** A = ½(1/I + 1/I_a)。 */
export const coefA = (st) => 0.5 * (1 / st.I + 1 / st.Ia);
/** B = |S|/I − (J_a·ŝ)/I_a。**B<0 は仕事駆動枝では拒否する**。 */
export const coefB = (st) => st.Smag / st.I - st.JaPar / st.Ia;
/** ΔE(δ) = A δ² + B δ(I・I_a 固定・ŝ 一定)。 */
export const deltaEnergy = (st, d) => coefA(st) * d * d + coefB(st) * d;

/**
 * ΔE = e(>0)を満たす δ ≥ 0 を解く(仕事駆動枝)。
 * @returns {{delta:number, ok:boolean, reason:string, A:number, B:number}}
 */
export function solveDelta(st, e) {
  const A = coefA(st), B = coefB(st);
  if (!(e > 0)) return { delta: 0, ok: true, reason: 'W=0', A, B };
  if (!(B >= 0)) return { delta: 0, ok: false, reason: 'B<0(受動交換の枝 — 仕事駆動では拒否)', A, B };
  const disc = B * B + 4 * A * e;
  if (!(disc >= 0) || !(A > 0)) return { delta: 0, ok: false, reason: '判別式/慣性が不正', A, B };
  // 第277便c(統括の検証項目 R50): **有理化**。(−B+√(B²+4AE))/(2A) は E ≪ B² のとき
  //   √(B²+4AE) ≈ B の引き算で桁落ちする(E=1e−20・A=1・B=2 で δ が 0 に潰れる)。
  //   **B ≥ 0 の枝**では分子分母に (B+√) を掛けた **2E/(B+√(B²+4AE))** が同じ根を与え、
  //   引き算が無いので小さい E でも有効数字が残る(E=1e−20・A=1・B=2 → δ=5e−21)。
  //   **B=0 のときは 2E/√(4AE)=√(E/A) で従来と同じ**(0/0 にならない)。
  const s = Math.sqrt(disc);
  const den = B + s;
  if (!(den > 0)) return { delta: 0, ok: false, reason: '分母が 0(B=0 かつ E=0)', A, B };
  return { delta: (2 * e) / den, ok: true, reason: '', A, B };
}

/* ── (3) 1 回の移送(**口座から引き出す・尽きたら止まる**) ───────────────── */
/**
 * @param {object} st makeAxisState の状態(**破壊的に更新する**)
 * @param {number} request 要求する仕事量(≥0)
 * @param {number} eta 機械的交換の効率 η∈[0,1](残りは熱)
 */
export function transferFromBank(st, request, eta) {
  const q = Math.max(0, Math.min(1, eta));
  const w = Math.max(0, Math.min(request || 0, st.bank));
  if (!(w > 0)) {
    if (st.bank <= 0 && st.depletedAt === null && (request || 0) > 0) st.depletedAt = st.t;
    return { w: 0, delta: 0, dE: 0, ok: true, reason: '口座が空(または要求 0)' };
  }
  const sol = solveDelta(st, q * w);
  if (!sol.ok) { st.refusals++; st.lastRefuseReason = sol.reason;
    return { w: 0, delta: 0, dE: 0, ok: false, reason: sol.reason }; }
  const d = sol.delta;
  const dE = deltaEnergy(st, d);
  st.Smag += d; st.JaPar -= d;                 // **S + J_a·ŝ は構造的に不変**
  st.bank -= w; st.Wdrawn += w;
  st.heat += (1 - q) * w;                      // 残りは熱(η<1 のとき正)
  st.transfers++;
  return { w, delta: d, dE, ok: true, reason: '', eta: q };
}

/* ── (3′) 第277便c: **可逆対照** signedAxisWork(統括の検証項目 R50 の N3 の切り分け) ──
   ■ 何のためか
     現行の `depositWork`(非負口座)+ `transferFromBank` の組は、**負の仕事を口座不足で切る**ので
     ±w を往復させると正の側だけが通る = **境界の一方向性が整流器として働く**(N3)。
     これが「ロックすると加速する」の一部を作っていることを**数で分ける**ための対照が本枝である。
     **無から生まれたエネルギーではない** —— 切っているのは返却であって、生成ではない。
   ■ 規約
     ・**正の仕事**は現行のまま(口座へ積んで `transferFromBank` で移す)。
     ・**負の仕事**は自転(+δ・δ<0)と反作用ローター(−δ)から**実際に返す**。
         ΔE = Aδ² + Bδ = e (< 0) を δ ∈ (−B/(2A), 0) の枝で解く(有理化 δ = 2e/(B+√(B²+4Ae)))。
       返せる上限は ΔE の最小値 **−B²/(4A)** なので、それを超える要求は**状態を 1 つも変えずに拒否**し、
       生仕事 `Wraw` と受理仕事 `Win` の差を `refusedWork` に残す(黙って切らない)。
     ・**η=1 の対照専用**である(η<1 は熱を出す非可逆枝なので、逆向きに熱を回収しない = 拒否)。
     ・帳簿: 返した分は **W_in を減らす**(供給元へ戻す)。口座は触らない。
       C = E_spin + E_rotor + Heat + bank − W_in は前後で不変である。 */
/**
 * 符号つきの軸仕事。**既存の関数は 1 行も変えていない**(これは追加の枝である)。
 * @param {object} st makeAxisState の状態(**破壊的に更新する**)
 * @param {number} w 符号つきの仕事(w>0 = 与える・w<0 = 返してもらう)
 * @param {number} [eta] η∈[0,1](負の枝は η=1 のみ)
 */
export function signedAxisWork(st, w, eta) {
  const q = (eta === undefined) ? 1 : Math.max(0, Math.min(1, eta));
  const ww = w || 0;
  if (!Number.isFinite(ww) || ww === 0) return { ok: true, sign: 0, w: 0, delta: 0, dE: 0,
    Wraw: 0, Win: 0, refusedWork: 0, reason: 'W=0' };
  if (ww > 0) {                               // **正: 現行の経路をそのまま使う**
    depositWork(st, ww);
    const r = transferFromBank(st, ww, q);
    return { ok: r.ok, sign: 1, w: r.w, delta: r.delta, dE: r.dE,
      Wraw: ww, Win: ww, refusedWork: 0, reason: r.reason };
  }
  // **負: 実際に返す**(η=1 の対照専用)
  if (q !== 1) {
    st.refusals++; st.lastRefuseReason = 'η<1 では逆向きに熱を回収しない(可逆対照は η=1 のみ)';
    return { ok: false, sign: -1, w: 0, delta: 0, dE: 0, Wraw: ww, Win: 0,
      refusedWork: -ww, reason: st.lastRefuseReason };
  }
  const A = coefA(st), B = coefB(st);
  const cap = (A > 0) ? (B * B) / (4 * A) : 0;      // **返せる上限**(ΔE の最小値の絶対値)
  const disc = B * B + 4 * A * ww;
  if (!(A > 0) || !(B >= 0) || !(disc >= 0) || !(-ww <= cap)) {
    st.refusals++;
    st.lastRefuseReason = '返却可能量を超えた(|W| > B²/(4A))';
    return { ok: false, sign: -1, w: 0, delta: 0, dE: 0, Wraw: ww, Win: 0,
      refusedWork: -ww, reason: st.lastRefuseReason };
  }
  const d = (2 * ww) / (B + Math.sqrt(disc));       // **有理化**(δ<0・0 に近い側の根)
  if (!(d <= 0) || !(st.Smag + d >= 0)) {
    st.refusals++; st.lastRefuseReason = '返すと |S| が負になる';
    return { ok: false, sign: -1, w: 0, delta: 0, dE: 0, Wraw: ww, Win: 0,
      refusedWork: -ww, reason: st.lastRefuseReason };
  }
  const dE = deltaEnergy(st, d);                    // = ww(< 0)
  st.Smag += d; st.JaPar -= d;                      // **S + J_a·ŝ は構造的に不変**
  st.Win += ww;                                     // **供給元へ返す**(口座は触らない)
  st.returns = (st.returns || 0) + 1;
  st.returned = (st.returned || 0) + (-ww);
  return { ok: true, sign: -1, w: -ww, delta: d, dE, Wraw: ww, Win: ww,
    refusedWork: 0, reason: '', cap };
}

/* ── (4) 受動ブレーキ(「力を抜く」—— 入力 0 で抵抗・逆移送だけを残す) ───── */
/**
 * δ<0 を **(−B/A, 0)** に収めるので ΔE<0 が構造的に保証され、熱 = −ΔE ≥ 0 になる。
 * @param {number} rate 抵抗の強さ(1/時間・≥0)
 * @param {number} dt 刻み
 * @param {number} [safety] −B/A に対する上限比(既定 0.5・0<safety<1)
 */
export function passiveBrake(st, rate, dt, safety) {
  const A = coefA(st), B = coefB(st);
  const sf = (safety === undefined) ? 0.5 : Math.max(0, Math.min(0.999, safety));
  if (!(rate > 0) || !(dt > 0) || !(B > 0) || !(A > 0)) return { delta: 0, dE: 0, heat: 0 };
  const want = rate * dt * st.Smag;                  // 抵抗が持ち去りたい角力積
  const cap = sf * (B / A);                          // これを越えると ΔE が正に転じる
  const d = -Math.min(want, cap);
  if (!(d < 0)) return { delta: 0, dE: 0, heat: 0 };
  const dE = deltaEnergy(st, d);                     // **< 0** が構造的に保証される
  st.Smag += d; st.JaPar -= d;
  st.heat += -dE;
  st.brakes++;
  return { delta: d, dE, heat: -dE };
}

/* ── (5) 口座への積み立て(入力が無ければ 1 も増えない) ─────────────────── */
/**
 * bank へ w_in を積む。逆流(w_in<0)は口座が負にならないところで頭打ちにし、
 * 止めた分を `clippedReturn` に残す(**黙って落とさない**)。
 */
export function depositWork(st, win) {
  let w = win || 0;
  if (st.bank + w < 0) { st.clippedReturn += -(st.bank + w); w = -st.bank; }
  st.bank += w; st.Win += w;
  return w;
}

/* ── (6) 走行(宣言した入力と要求で回す) ────────────────────────────────── */
/**
 * P: { state, dt, steps, samples,
 *      workRate(t, st)  … τ_axis·ω_axis(**入力**。0 を返せば口座は増えない)
 *      requestRate(t, st) … 1 步あたりに要求する仕事(既定 0)
 *      eta … η∈[0,1]
 *      brakeRate(t, st) … 受動ブレーキの強さ(既定 0)
 *      id }
 */
export function runAxisWork(P) {
  const st = P.state;
  const snap = () => ({ t: st.t, omega: omegaSpin(st), Smag: st.Smag, JaPar: st.JaPar,
    bank: st.bank, heat: st.heat, Win: st.Win, Wdrawn: st.Wdrawn,
    Espin: spinEnergy(st), Erotor: rotorEnergy(st), C: ledgerC(st), Jtot: totalAxialJ(st),
    transfers: st.transfers, refusals: st.refusals, brakes: st.brakes });
  const first = snap();
  const snaps = [first];
  const every = Math.max(1, Math.floor(P.steps / (P.samples || 20)));
  let worstC = 0, worstJ = 0, heatDrops = 0, heatPrev = st.heat, bankNeg = 0;
  let omegaPeak = omegaSpin(st), omegaAtDepletion = null;
  for (let k = 0; k < P.steps; k++) {
    const win = (P.workRate ? P.workRate(st.t, st) : 0) * P.dt;
    if (win !== 0) depositWork(st, win);
    const req = P.requestRate ? P.requestRate(st.t, st) * P.dt : 0;
    if (req > 0) transferFromBank(st, req, P.eta === undefined ? 1 : P.eta);
    const br = P.brakeRate ? P.brakeRate(st.t, st) : 0;
    if (br > 0) passiveBrake(st, br, P.dt, P.brakeSafety);
    st.t += P.dt;
    if (st.bank < 0) bankNeg++;
    if (st.heat < heatPrev - 1e-18) heatDrops++;
    heatPrev = st.heat;
    worstC = Math.max(worstC, Math.abs(ledgerC(st) - first.C));
    worstJ = Math.max(worstJ, Math.abs(totalAxialJ(st) - first.Jtot));
    omegaPeak = Math.max(omegaPeak, omegaSpin(st));
    if (st.depletedAt !== null && omegaAtDepletion === null) omegaAtDepletion = omegaSpin(st);
    if ((k + 1) % every === 0 || k === P.steps - 1) snaps.push(snap());
  }
  const last = snap();
  return { id: P.id, first, last, snaps,
    worstLedgerAbs: worstC,
    worstLedgerRel: worstC / Math.max(1e-30, Math.abs(first.Espin) + Math.abs(first.bank) + 1),
    worstAxialJAbs: worstJ, heatDrops, bankNegSteps: bankNeg,
    omegaPeak, omegaAtDepletion, depletedAt: st.depletedAt,
    lastRefuseReason: st.lastRefuseReason, clippedReturn: st.clippedReturn, steps: P.steps };
}

/* ── (7) 歳差ロックの位相(H4)—— 相対位相 ψ と**共役運動量** ─────────────
   状態 z = [phiP, pP, phiD, pD]。U_lock = −K_lock cos ψ(ψ = phiP − phiD)。
     φ̇_P = p_P/I_P ,  ṗ_P = −∂U/∂φ_P = −K_lock sin ψ
     φ̇_D = p_D/I_D ,  ṗ_D = −∂U/∂φ_D = +K_lock sin ψ      ← **両側へ反作用**
   ・p_P + p_D は**構造的に保存**(ロック位相へ毎歩上書きしない)。
   ・E_lock = p_P²/(2I_P) + p_D²/(2I_D) − K_lock cos ψ は保存する(供給を止めた後の対照)。
   ・ロックの判定は **ψ の循環回数と秤動幅**で行う(「ロックした」と決め打ちしない)。
   ・供給(トルク `driveP`)は宣言であり、**止めれば E_lock は保存に戻る**。 */
export const LOCK_LEN = 4;

export function lockDerivs(P, t, z) {
  const psi = z[0] - z[2];
  const f = P.Klock * Math.sin(psi);
  const dP = (P.driveP ? P.driveP(t, z) : 0);
  const dD = (P.driveD ? P.driveD(t, z) : 0);
  return [z[1] / P.Ip, -f + dP, z[3] / P.Id, f + dD];
}

export function lockInvariants(P, t, z) {
  const psi = z[0] - z[2];
  const wrap = (a) => { let x = a % (2 * Math.PI); if (x > Math.PI) x -= 2 * Math.PI;
    if (x < -Math.PI) x += 2 * Math.PI; return x; };
  return { psi, psiWrapped: wrap(psi), psiDeg: wrap(psi) * 180 / Math.PI,
    pP: z[1], pD: z[3], pSum: z[1] + z[3],
    omegaP: z[1] / P.Ip, omegaD: z[3] / P.Id,
    detune: z[1] / P.Ip - z[3] / P.Id,
    Elock: (z[1] * z[1]) / (2 * P.Ip) + (z[3] * z[3]) / (2 * P.Id) - P.Klock * Math.cos(psi) };
}

/** 汎用 RK4(配列状態)。 */
export function rk4v(deriv, P, t, y, h) {
  const n = y.length;
  const k1 = deriv(P, t, y);
  const y2 = new Array(n); for (let i = 0; i < n; i++) y2[i] = y[i] + 0.5 * h * k1[i];
  const k2 = deriv(P, t + 0.5 * h, y2);
  const y3 = new Array(n); for (let i = 0; i < n; i++) y3[i] = y[i] + 0.5 * h * k2[i];
  const k3 = deriv(P, t + 0.5 * h, y3);
  const y4 = new Array(n); for (let i = 0; i < n; i++) y4[i] = y[i] + h * k3[i];
  const k4 = deriv(P, t + h, y4);
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = y[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  return out;
}

/**
 * ロックの走行と、**位相に乗った軸仕事**の口座。
 * 入力の仕事率は **Ẇ = τ_amp · ω_P · cos ψ**(位相が循環すれば cos ψ の平均は 0 に近く、
 * 秤動すれば 1 に近い)。**これは宣言**であって導出ではない。
 * P: { Ip, Id, Klock, tauAmp, dt, steps, samples, z0, axis:{state, eta, requestRate}, stopSupplyAt }
 */
export function runLock(P) {
  let z = P.z0.slice(), t = 0;
  const st = P.axis ? P.axis.state : null;
  const C0 = st ? ledgerC(st) : 0;
  const inv0 = lockInvariants(P, 0, z);
  const snaps = [{ t: 0, inv: inv0, bank: st ? st.bank : 0, omega: st ? omegaSpin(st) : 0 }];
  const every = Math.max(1, Math.floor(P.steps / (P.samples || 20)));
  let circ = 0, prevWrap = inv0.psiWrapped, psiMin = inv0.psiWrapped, psiMax = inv0.psiWrapped;
  let worstElock = 0, worstPsum = 0, cosSum = 0, Wraw = 0;
  const ElockRef = inv0.Elock, PsumRef = inv0.pSum;
  let supplyOffElock = null, supplyOffCirc = null, supplyOffPsi = [Infinity, -Infinity];
  const Q = { Ip: P.Ip, Id: P.Id, Klock: P.Klock, driveP: P.driveP, driveD: P.driveD };
  for (let k = 0; k < P.steps; k++) {
    const off = (P.stopSupplyAt !== undefined && t >= P.stopSupplyAt);
    if (off && supplyOffElock === null) { supplyOffElock = lockInvariants(P, t, z).Elock;
      supplyOffCirc = circ; supplyOffPsi = [Infinity, -Infinity]; }
    Q.driveP = off ? null : P.driveP; Q.driveD = off ? null : P.driveD;
    const ivPre = lockInvariants(P, t, z);
    // **位相に乗った軸仕事**を口座へ(供給停止後は 0)
    if (st) {
      const w = off ? 0 : P.tauAmp * ivPre.omegaP * Math.cos(ivPre.psi) * P.dt;
      Wraw += w;                       // **頭打ちする前の生の位相平均**(口座の逆流制限の影響を分けて見る)
      if (w !== 0) depositWork(st, w);
      const req = P.axis.requestRate ? P.axis.requestRate * P.dt : 0;
      if (req > 0) transferFromBank(st, req, P.axis.eta === undefined ? 1 : P.axis.eta);
      st.t = t;
    }
    z = rk4v(lockDerivs, Q, t, z, P.dt); t += P.dt;
    const iv = lockInvariants(P, t, z);
    cosSum += Math.cos(iv.psi);
    if (Math.abs(iv.psiWrapped - prevWrap) > Math.PI) circ++;   // 折り返し = 循環
    prevWrap = iv.psiWrapped;
    psiMin = Math.min(psiMin, iv.psiWrapped); psiMax = Math.max(psiMax, iv.psiWrapped);
    if (off) { supplyOffPsi[0] = Math.min(supplyOffPsi[0], iv.psiWrapped);
      supplyOffPsi[1] = Math.max(supplyOffPsi[1], iv.psiWrapped); }
    if (!P.driveP && !P.driveD) worstElock = Math.max(worstElock, Math.abs(iv.Elock - ElockRef));
    worstPsum = Math.max(worstPsum, Math.abs(iv.pSum - PsumRef));
    if ((k + 1) % every === 0 || k === P.steps - 1)
      snaps.push({ t, inv: iv, bank: st ? st.bank : 0, omega: st ? omegaSpin(st) : 0 });
  }
  const last = lockInvariants(P, t, z);
  return { id: P.id, t, z, first: inv0, last, snaps,
    circulations: circ, psiSpanDeg: (psiMax - psiMin) * 180 / Math.PI,
    cosPsiMean: cosSum / P.steps, worstElockAbs: worstElock, worstPsumAbs: worstPsum,
    supplyOffElock, supplyOffCirc,
    supplyOffPsiSpanDeg: (supplyOffPsi[1] > supplyOffPsi[0])
      ? (supplyOffPsi[1] - supplyOffPsi[0]) * 180 / Math.PI : null,
    bank: st ? st.bank : null, omegaLast: st ? omegaSpin(st) : null,
    Win: st ? st.Win : null, Wraw, clippedReturn: st ? st.clippedReturn : null,
    ledgerC: st ? ledgerC(st) : null,
    ledgerDriftAbs: st ? Math.abs(ledgerC(st) - C0) : null };
}

export default { AXISWORK_VERSION, AXISWORK_PREMISE, makeAxisState, spinEnergy, rotorEnergy,
  omegaSpin, ledgerC, totalAxialJ, coefA, coefB, deltaEnergy, solveDelta, transferFromBank,
  passiveBrake, depositWork, runAxisWork, lockDerivs, lockInvariants, rk4v, runLock, LOCK_LEN,
  signedAxisWork };

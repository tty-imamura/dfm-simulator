// 第258便d(第50報 W4)「現実較正 40 本の合否再判定」の**純関数**ライブラリ。
//
// ここに置くのは 5 つだけで、**どれも入力から出力を作るだけの関数**である(ブラウザも fs も触らない)。
// 検証器(tests/exp-w249b-calaudit.mjs)と QA(behavior.calauditMapping)が**同じ 1 本**を読む。
//
//   ① `enforceMeasurementCondition` … **条件不一致の隔離**。
//      obsCard の行が「kFrame=0 対照」と書いているのに、割り当てられている測定値が
//      **kFrame=1 の走行**のものである行が 8 行ある(🟠 木星衛星 4・🌇 金星・🥔 火星衛星の対照差・
//      ❄️ 冥王星/カロン・🌊 海王星)。プリセットの physics は 1 つなので、1 回の走行から
//      2 つの条件の行へ同じ数値が配られていた。**これは「合っている」でも「合っていない」でもない** ——
//      **条件が違う**。元の証拠は捨てずに `conditionRejectedEvidence` へ移し、判定を `条` にする。
//   ② `predictionEligible` … **証拠付き予測の資格**。③(3σ の門を通った)だけでは予測に数えない。
//      `usedForFit:false` / `validation:"held-out"` / `dataset` / `frozenProtocol` の 4 つが
//      **宣言として揃っている**量だけを ④ に数える(宣言が無ければ 0 である)。
//   ③ `refinedNumBound` … |Q_h − Q_{h/4}| は**上限ではない**。漸近形 E(h)=C·h^p なら
//      Q_h − Q_{h/4} = C·h^p·(1 − 4^−p) なので、粗い側の誤差は **|Q_h−Q_{h/4}| / (1 − 4^−p)** である
//      (p≈1 で ×4/3・p=2 で ×16/15)。門が読む ε_num は従来どおり |Q_h−Q_{h/4}| のままにし、
//      **この補正値は別欄**(推定誤差欄)に置く —— 門を緩めも締めもしない記録である。
//   ④ `degPerYear` … 近点移動を **deg/yr** で読む。unwrap した近点角を**実時刻**に線形 fit した
//      傾き(deg/シミュレータ時間)を、scaleExp の T と**年の長さ**で deg/yr へ直す。
//      「°/周」は別欄に残す(°/周 は周期を 1 つ選ばないと作れない量で、⚡ の P_b と ω̇ は
//      **別解**から来ているため、°/周 の換算は 2 つの解をまたぐ)。
//   ⑤ `assessDegYearGate` … ④ の量に、棚卸しと**同じ門**(3σ+ε_num・ε_num ≤ 0.3σ・収束条件)を掛ける。
//
// **単位を変えても比は直らない**(⚡ の ω̇_sim/ω̇_obs ≈ 2 は deg/yr でも °/周 でも同じ比である)。
// この lib は測り直す道具であって、合わせる道具ではない。

// 年の長さは**単位の約束**であって観測ではない(ユリウス年 365.25 d)。CSV の deg/yr もこの約束で読む。
export const YEAR_SEC = 3.15576e7;

// 棚卸しの門の状態(第257便d の 5 つ + 第258便d の `condition-mismatch`)
export const GATE = {
  OK: '合(3σ)', NG: '否(3σ)', NUM: '数値未解決',
  MAP: 'mapping-unresolved', COND: 'condition-mismatch', NA: '未判定',
};
// 5 区分(合/窓/否/従/転)は来歴の欄である。第258便d は**隔離の 1 区分だけ**を足す。
export const VERDICT_CONDITION = '条';
export const VERDICTS6 = ['合', '窓', '否', '従', '転', VERDICT_CONDITION];

// ---------------------------------------------------------------- ① 条件不一致の隔離
// 行の文面から**その行が要求している条件**を読む(宣言である — 閾値による自動判定ではない)。
// 現行の宣言は kFrame だけ: 「kFrame=0 対照」「kFrame=1(…)での周期」のように行が明記している。
const KF_RE = /kFrame\s*[=＝]\s*([01])/;
export function readRequiredContext(row, fallbackKFrame) {
  const texts = [row && row.name, row && row.declaredObs, row && row.declaredModel];
  for (const t of texts) {
    if (typeof t !== 'string') continue;
    const m = t.match(KF_RE);
    if (m) return { kFrame: Number(m[1]), source: 'obsCard-row', evidence: t.slice(0, 80) };
  }
  return { kFrame: (Number.isFinite(fallbackKFrame) ? fallbackKFrame : null),
    source: 'preset-physics', evidence: null };
}

// 走行そのものの条件(プリセットの physics を 1 bit も変えずに走らせているので、走行は 1 条件しかない)
export function measurementContextOf(presetRec) {
  const c = (presetRec && presetRec.correlates) || {};
  const run = (presetRec && presetRec.run) || {};
  return { kFrame: Number.isFinite(Number(c.kFrame)) ? Number(c.kFrame) : null,
    source: 'run(preset physics)', dt: run.dt !== undefined ? run.dt : null,
    steps: run.steps !== undefined ? run.steps : null };
}

// 1 行に条件の印を付け、食い違っていれば隔離する。**戻り値は「隔離したか」だけ**(q は破壊的に更新)。
export function enforceMeasurementCondition(presetRec, q) {
  const meas = measurementContextOf(presetRec);
  const req = readRequiredContext(q, meas.kFrame);
  q.requiredContext = req;
  q.measurementContext = meas;
  // 宣言行(kind:"other")は測定値を持たないので隔離の対象にしない(条件の印だけ付ける)
  const judged = q.kind && q.kind !== 'other';
  const mismatch = judged && Number.isFinite(req.kFrame) && Number.isFinite(meas.kFrame)
    && req.kFrame !== meas.kFrame;
  q.conditionMatch = !mismatch;
  if (!mismatch) return false;
  q.conditionRejectedEvidence = {
    verdict: q.verdict, residualPct: q.residualPct === undefined ? null : q.residualPct,
    residualPctRev: q.residualPctRev === undefined ? null : q.residualPctRev,
    residualPctPeri: q.residualPctPeri === undefined ? null : q.residualPctPeri,
    strictOK: q.strictOK === undefined ? null : q.strictOK,
    meas: q.meas === undefined ? null : q.meas, obs: q.obs === undefined ? null : q.obs,
    note: q.note || null,
    why: '**証拠として捨てていない** —— この数値は kFrame=' + meas.kFrame
      + ' の走行の実測であり、kFrame=' + req.kFrame + ' の行に割り当てられていたことだけが誤りである',
  };
  q.conditionMismatch = {
    requiredKFrame: req.kFrame, measuredKFrame: meas.kFrame, evidence: req.evidence,
    note: 'この行は kFrame=' + req.kFrame + ' の条件を要求しているが、割り当てられている測定値は '
      + 'kFrame=' + meas.kFrame + ' の走行のものである(プリセットの physics は 1 つで、'
      + '1 回の走行から 2 つの条件の行へ同じ数値が配られていた)。'
      + '**合っていないのではなく、条件が違う** —— 対照条件の走行は行われていない',
    fix: '対照条件(kFrame=' + req.kFrame + ')を**別の走行**として測り、その行に割り当てる'
      + '(プリセットの physics は変えない —— 検証器の中で physics を差し替えた診断コピーを走らせる)',
  };
  q.verdict = VERDICT_CONDITION;
  q.residualPct = null;
  q.note = (q.note ? q.note + ' / ' : '') + '**条件不一致(condition-mismatch)**: ' + q.conditionMismatch.note;
  if (q.gate) {
    q.gate.status = GATE.COND;
    q.gate.reason = '測定条件が行の要求条件と違う(kFrame ' + meas.kFrame + ' ≠ ' + req.kFrame + ')';
    q.gate.conditionMismatch = q.conditionMismatch;
  }
  return true;
}

// 40 本すべてに掛けて、隔離した行の一覧と再集計した tally を返す(純関数 — presets は破壊的に更新)。
export function enforceAllConditions(presets) {
  const isolated = [];
  for (const p of (presets || [])) {
    for (const q of (p.quantities || [])) {
      if (enforceMeasurementCondition(p, q)) {
        isolated.push({ id: p.id, emoji: p.emoji || null, target: q.target || null,
          kind: q.kind, name: q.name,
          requiredKFrame: q.conditionMismatch.requiredKFrame,
          measuredKFrame: q.conditionMismatch.measuredKFrame,
          formerVerdict: q.conditionRejectedEvidence.verdict,
          formerResidualPct: q.conditionRejectedEvidence.residualPct });
      }
    }
    // tally を**再計算**する(隔離した行が「合」に残らないように)
    const t = {}; for (const v of VERDICTS6) t[v] = 0;
    for (const q of (p.quantities || [])) t[q.verdict] = (t[q.verdict] || 0) + 1;
    p.tally = t;
  }
  return { isolated, n: isolated.length };
}

// ---------------------------------------------------------------- ② 証拠付き予測の資格
// ③(3σ の門)を通っただけでは ④ に数えない。**④ ⊆ ③** であり、加えて 4 つの宣言が要る。
// 宣言が無ければ資格は無い(「無いものを無いと数える」— 既定は 0 件である)。
export function predictionEligible(q) {
  const reasons = [];
  const g = (q && q.gate) || null;
  if (!g || g.status !== GATE.OK) reasons.push('③観測適合(3σ)を通っていない');
  if (q && q.verdict === '従') reasons.push('較正の従属量である(5 区分の 従)');
  const ev = (q && q.predictionEvidence) || null;
  if (!ev) reasons.push('predictionEvidence の宣言が無い(usedForFit/validation/dataset/frozenProtocol)');
  else {
    if (ev.usedForFit !== false) reasons.push('usedForFit:false が宣言されていない(fit に使っていないことの記録が無い)');
    if (ev.validation !== 'held-out') reasons.push('validation:"held-out" が宣言されていない');
    if (!ev.dataset) reasons.push('dataset(どの観測データか)が宣言されていない');
    if (!ev.frozenProtocol) reasons.push('frozenProtocol(凍結手順の記録)が宣言されていない');
  }
  return { eligible: reasons.length === 0, reasons };
}

// ---------------------------------------------------------------- ③ ε_num の推定誤差欄
// |Q_h − Q_{h/4}| は**上限ではない**。漸近形なら粗い側の真の誤差は /(1 − 4^−p) 倍である。
export function refinedNumBound(value, order, ratio = 4) {
  if (!Number.isFinite(value)) return null;
  if (!Number.isFinite(order) || !(order > 0)) {
    return { raw: value, order: Number.isFinite(order) ? order : null, factor: null, refined: null,
      note: '**観測次数が正でない/測れていない**ので漸近形の補正はできない(raw をそのまま置く)' };
  }
  const f = 1 / (1 - Math.pow(ratio, -order));
  return { raw: value, order, factor: f, refined: value * f,
    note: '漸近形 E(h)=C·h^p なら Q_h−Q_{h/' + ratio + '} = C·h^p·(1−' + ratio + '^−p) なので、'
      + '粗い側の誤差は |Q_h−Q_{h/' + ratio + '}|/(1−' + ratio + '^−p) = ' + f.toFixed(4)
      + ' 倍である(p≈1 で 4/3)。**門が読む ε_num は raw のまま**で、これは推定誤差の記録である' };
}

// ---------------------------------------------------------------- ④ deg/yr の門
// 近点角の**実時刻**に対する線形 fit の傾き(deg / シミュレータ時間単位)を deg/yr へ直す。
export function degPerYear({ slopeDegPerSimTime, toSec, yearSec = YEAR_SEC }) {
  if (!Number.isFinite(slopeDegPerSimTime) || !Number.isFinite(toSec) || !(toSec > 0)) return null;
  return slopeDegPerSimTime / toSec * yearSec;
}

// ⑤ deg/yr の門(棚卸しと同じ規則 — 3σ+ε_num かつ ε_num ≤ 0.3σ・収束条件つき)
export function assessDegYearGate({ value, reference, sigma, numBound, converged }) {
  if (![value, reference].every(Number.isFinite) || !Number.isFinite(sigma) || !(sigma > 0))
    return { status: GATE.NA, reason: 'deg/yr の観測値または σ が無い' };
  const residual = value - reference, nSigma = Math.abs(residual) / sigma;
  const base = { residual, nSigma, sigma, ratio: (reference !== 0) ? value / reference : null };
  if (!converged || !Number.isFinite(numBound) || numBound > 0.3 * sigma)
    return Object.assign(base, { status: GATE.NUM, numBound,
      reason: '数値誤差幅が予算(0.3σ)を超える/収束未確認(dt 3 段+正の実測次数が無い)' });
  const tolerance = 3 * sigma + numBound;
  return Object.assign(base, { status: (Math.abs(residual) <= tolerance) ? GATE.OK : GATE.NG,
    numBound, tolerance });
}

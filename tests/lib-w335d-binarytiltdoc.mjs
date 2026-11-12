// 第335便d(原仮定者の補足(2026-11-12)・原仮定者の回答(2026-11-12 —— AN660〜AN664・AN650)・統括の検証項目 R331): **正本 tests/out/binarytilt-w335d.json から PHYSICS〔第335便d〕の表を作る文書の lib**
// (QA docs.binaryTilt335d が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔閉じた式との差・漂いの数値の残り〕は「< 1e-13」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w335d-binarytiltdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (x === null || x === undefined ? '—' : Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const TYPE = Object.freeze({ circ: '円・相互同期(Ω = n)', instant: '瞬間の同期(Ω = ḟ)', mean: '平均の同期(Ω = n)' });
const MODE = Object.freeze({ k1: 'K1 の並進(自転なし —— 基線)', instant: '瞬間の同期', mean: '平均の同期' });
const LT = Object.freeze({ recv2K1: '受け手 n = 2 + K1(今)', sym2K1: '対称 n = 2 + K1', sym4K1: '対称 n = 4 + K1', recv2: '受け手 n = 2(K1 なし)', sym2: '対称 n = 2' });
const REL = Object.freeze({ orbit: '軌道の軸(軸一致)', same: '天体 1 と同じ軸', opposite: '同じ傾き・方位 +180°', ortho: '直交(同じ子午面で +90°)' });
const ROLE = Object.freeze({ design: '第334便d の設計の本', verify: '検証', reading: '読み', spin: '自転の宣言' });
export function tablesOf(J) {
  const T = {}, D = J.decl;
  // 表 1 同期の型の閉じた式との照合
  T.sync = ['| 型 | e | 配置の数 | 動径の閉じた式との差の最大 | 接線の差の最大 | 面外の最大 | 残る動径 ‖d_r‖ の最大(÷ n a) | 残る接線 ‖d_t‖ の最大 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.sync.summary.map((q) => `| ${TYPE[q.type]} | ${q.e} | ${q.n} | ${lt(q.maxErrR, D.sync.tol)} | ${lt(q.maxErrT, D.sync.tol)} | ${lt(q.maxErrZ, D.sync.tol)} | ${lt(q.maxDr, D.sync.tol)} | ${lt(q.maxDt, D.sync.tol)} |`)).join('\n');
  // 表 2 一周の平均の永年の効き(求積 —— 分担 = Δϖ ÷ [6πε/(1 − e²)])
  T.secular = ['| e | 動径 −(10ε/r) ṙ r̂ | 接線(ḟ の分)−10ε ḟ φ̂ | 接線(Ω の分)+10ε n φ̂ | K1 = 動径 + 接線(ḟ) | 瞬間の同期 = 動径 | 平均の同期 = K1 + 接線(Ω) | Δe・Δa(平均の同期・ε あたり/公転) |', '|---|---|---|---|---|---|---|---|']
    .concat(J.secular.rows.map((q) => `| ${q.e} | ${f4(q.radial.share)} | ${f4(q.tangF.share)} | ${lt(q.tangOmega.share, 1e-8)} | ${f4(q.k1.share)} | ${f4(q.instant.share)} | ${f4(q.mean.share)} | ${lt(q.mean.de, 1e-9)}・${lt(q.mean.da, 1e-9)} |`)).join('\n');
  // 表 3 同期の型の同時発展(η = 0.0974)
  T.lock = ['| 型 | G_loc | e | ε | 分担(通過の角)| 分担(窓の平均 —— 補助) | 一次の分担(求積) | 近点の周期 ΔP/P ÷ ε(通過の時刻) | 平均経度の ΔP/P ÷ ε(補助) | e の漂い〔/公転〕 |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.lock.rows.map((r) => `| ${MODE[r.mode]} | ${r.g ? '受け手 n = 2' : 'なし'} | ${r.e} | ${r.eps} | ${f4(r.sharePass)} | ${f4(r.shareWin)} | ${f4(r.first)} | ${f4(r.dPanom / r.eps)} | ${f4(r.dPoverP / r.eps)} | ${lt(r.de, 1e-12)} |`)).join('\n');
  // 表 4 本の系の位置(相対の d —— β 和 10ε/r)
  T.positions = ['| 本 | e | ε | 出どころ | 瞬間の同期の動径の最大(÷ n a) | 平均の同期の接線の最大 | 瞬間の同期の近点の率〔rad/公転〕 | K1(と平均の同期)の近点の率 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.positions.rows.map((q) => `| ${q.ja} | ${lt(q.e, 1e-6)} | ${fe(q.eps)} | ${q.src} | ${lt(q.maxDrInstant, 1e-20)} | ${lt(q.maxDtMean, 1e-20)} | ${fe(q.apsInstant)} | ${fe(q.apsK1)} |`)).join('\n');
  // 表 5 系の表
  T.systems = ['| 本 | 役割 | η | e | ε = GM/(a c₀²) | 自転 ÷ 公転(主・伴) | 自転の出どころ | ‖d_回転‖/v の目安 | 線形の範囲 | ε の床で走らせる |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.systems.map((s) => `| ${s.ja} | ${ROLE[s.role]} | ${f4(s.eta)} | ${lt(s.e, 1e-6)} | ${fe(s.eps)} | ${s.spins.map((x) => fx(x.overN)).join('・')} | ${s.spins.map((x) => x.src).join('・')} | ${s.rotRatio.map((x) => fe(x)).join('・')} | ${tf(s.linear)} | ${tf(s.floored)} |`)).join('\n');
  // 表 6 設計の系の δ/ε(通過の角と窓の平均 —— ε = 1e-6)
  const pick = (t, eta, e, eps) => J.law.design.find((r) => r.type === t && r.eta === eta && r.e === e && r.eps === eps);
  T.design = ['| 型 | η | δ/ε 通過の角: e = 0.1 | e = 0.3 | e = 0.6 | δ/ε 窓の平均(補助): e = 0.1 | e = 0.3 | e = 0.6 |', '|---|---|---|---|---|---|---|---|']
    .concat(D.law.types.flatMap((t) => [1e-6, 0.0974, 0.25].map((eta) => { const r = D.law.design.e.map((e) => pick(t.key, eta, e, 1e-6));
      return `| ${LT[t.key]} | ${eta} | ${r.map((q) => f4(q.deltaPass / q.eps)).join(' | ')} | ${r.map((q) => f4(q.deltaWin / q.eps)).join(' | ')} |`; }))).join('\n');
  // 表 7 残差の族の判定(検証の系の ‖予測 − 同時発展‖ ÷ 幅の最大)
  T.law = ['| 型 | 定義 | G1(k・a) | ÷ 幅 | G2(k・a・b) | ÷ 幅 | G3(k・a・b・c) | ÷ 幅 | 法則と呼ぶ族 | ε の傾きの範囲(1e-6 → 1e-4) |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.law.combos.flatMap((c) => ['pass', 'win'].map((df) => { const F = c[df].fams, cf = (f) => f.k + '・' + f.coef.map((x) => f4(x)).join('・');
      return `| ${LT[c.type]} | ${df === 'pass' ? '通過の角(主)' : '窓の平均(補助)'} | ${cf(F[0])} | ${f4(F[0].maxRatio)} | ${cf(F[1])} | ${f4(F[1].maxRatio)} | ${cf(F[2])} | ${f4(F[2].maxRatio)} | ${c[df].lawKey || '無し(残差のまま)'} | ${df === 'pass' ? f4(c.propRange[0]) + '〜' + f4(c.propRange[1]) : '—'} |`; }))).join('\n');
  // 表 8 検証の系の δ/ε(通過の角)
  const vids = J.law.verifyIds;
  T.verify = ['| 点 | η | e | ε(走行) | ' + D.law.types.map((t) => LT[t.key]).join(' | ') + ' |', '|---|---|---|---|' + D.law.types.map(() => '---|').join('')]
    .concat(vids.map((id) => { const rr = D.law.types.map((t) => J.law.verify.find((r) => r.type === t.key && r.id === id)), r0 = rr[0];
      return `| ${id} | ${f4(r0.eta)} | ${f4(r0.e)} | ${fe(r0.eps)} | ${rr.map((r) => f4(r.deltaPass / r.eps)).join(' | ')} |`; })).join('\n');
  // 表 9 傾きの組み合わせ(方位 0° —— 1 つの軸の組の 1 行に複数の量)
  const row = (q) => `| ${q.spin} n | ${q.theta}°・${q.phi}° | ${REL[q.rel]} | ${f4(q.rho)} | ${fe(q.dRho)} | ${f4(q.dPdiff / D.tilt.eps)} | ${lt(q.tiltRateOverQ1, 1e-9)} | ${lt(q.de, 1e-12)} | ${lt(q.vcm, 1e-12)} | ${fe(q.eSlopeRel)} | ${q.spin === 100 ? (q.linBreak ? '壊れる(' + f4(q.linRatio) + ')' : '線形(' + f4(q.linRatio) + ')') : '—'} |`;
  const head = ['| 自転 | 天体 1 の軸 θ・φ | 天体 2 | ρ(通過の角) | Δρ | 近点の周期の差 ÷ ε | 面(L̂)の率 ÷ q_1PN | e の率〔/公転〕 | 重心の速さ(8 公転後) | E_N の永年の率(相対/公転) | 一次外挿(100 n ÷ 10 × 10 n) |', '|---|---|---|---|---|---|---|---|---|---|---|'];
  T.tilt = head.concat(J.tilt.rows.filter((q) => q.phi === 0).map(row)).join('\n');
  // 表 10 方位の依存(自転 10 n —— 天体 2 は同じ軸と軌道の軸)
  T.tiltPhi = head.concat(J.tilt.rows.filter((q) => q.spin === 10 && (q.rel === 'same' || q.rel === 'orbit')).map(row)).join('\n');
  // 表 11 傾きの読み (a) と共変
  const R = J.tilt.reading, B = J.tilt.base;
  T.tiltRead = ['| 自転 | ρ の最小 | ρ の最大 | ρ ≤ 基線 − 1%·ρ₁ の行 | ρ ≤ 0 の行 | 面の率 ÷ q_1PN の最大 | 近点の周期の差の最大(‖ΔP/P‖) | 一次外挿が壊れる行 |', '|---|---|---|---|---|---|---|---|']
    .concat(R.perSpin.map((p) => `| ${p.spin} n | ${f4(p.minRho)} | ${f4(p.maxRho)} | ${p.nReduce} | ${p.nZero} | ${f4(p.maxTiltOverQ1)} | ${fe(p.maxAbsDP)} | ${p.nLinBreak === null ? '—' : p.nLinBreak + '/88'} |`))
    .concat([`| 基線(回転の分なし) | ${f4(B.rho)} | — | 物差し ${f4(R.threshold)} | — | 0 | 近点の周期 ΔP/P ÷ ε ${f4(B.dPanom / D.tilt.eps)} | ρ₁ = ${f4(B.rho1)} |`,
      `| ρ が最小の行 | ${f4(R.best.rho)} | ${R.best.theta}°・${R.best.phi}°・${REL[R.best.rel]}・${R.best.spin} n | — | — | ${f4(R.best.tiltRateOverQ1)} | 近点の周期の差 ÷ ε ${f4(R.best.dPdiff / D.tilt.eps)} | — |`,
      `| 全体を同じだけ回す(軸 [1, −2, 0.5]・${D.tilt.covAngleDeg}°)の 3 行 | 相対の差の最大 ${lt(J.tilt.covMax, 1e-7)} | — | — | — | — | — | 共変(別のノブに数えない) |`]).join('\n');
  // 表 12 重心の自己加速と周期(第334便d の一次の式との比 —— 受け手の型)
  T.cm = ['| 型 | η | e | ε | 重心の速さの増え〔/公転・÷ n a〕 | 一次の式 | 比 | 近点の周期 ΔP/P ÷ ε | (Ṗ/P)_cm ÷ n の上限 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.cm.rows.filter((q) => q.type !== 'sym2K1').map((q) => `| ${LT[q.type]} | ${q.eta} | ${q.e} | ${q.eps} | ${fe(q.vcmPerOrbit)} | ${fe(q.firstPerOrbit)} | ${f4(q.ratio)} | ${f4(q.dPanom / q.eps)} | ${fe(q.pdotOverN)} |`))
    .concat([`| ${LT.sym2K1}(全 18 行) | — | — | — | ${lt(Math.max(...J.cm.rows.filter((q) => q.type === 'sym2K1').map((q) => q.vcmPerOrbit)), 1e-12)} | 0(作用反作用を保つ) | — | — | — |`]).join('\n');
  // 表 13 刻みの感度と純関数の場面
  T.band = ['| 部分集合 | 近点の分担・ρ の h と h/2 の差(通過の角) | 窓の平均 | 近点の周期の差 |', '|---|---|---|---|'].concat(J.band.rows.map((q) => `| ${q.id} | ${fe(q.d)} | ${fe(q.dWin)} | ${lt(q.dP, 1e-12)} |`)).join('\n');
  T.pure = ['| 場面 | 結果 |', '|---|---|'].concat(Object.entries(J.pure.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)).join('\n');
  return T;
}

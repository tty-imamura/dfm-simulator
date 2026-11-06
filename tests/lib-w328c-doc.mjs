// 第328便c(統括の検証項目 R303): **PHYSICS〔第328便c〕の表を作る文書の lib** —— 第327便f の器の版 2 の正本 tests/out/venustide-w327f.json(検査の範囲・件数・位相の有無・捕獲の幅)と
//   共鳴の口の仕事の契約 tests/lib-w328c-respower.mjs(純関数の場面と金星の例)から(QA docs.w328c が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数は「< 1e-12」の形)。
import * as RP from './lib-w328c-respower.mjs';
export const DOC_VERSION = 'w328c-doc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(d));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const ni = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');   // 整数の 3 桁の区切り(空白)
const ex = (x) => (Number.isFinite(x) && Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-9 ? String(Math.round(x * 1000) / 1000) : fe(x));   // 純関数の場面の短い小数(整数・0.5 など)はそのまま
const GAM = (g) => { const k = g / (Math.PI / 8); return Math.abs(k - Math.round(k)) < 1e-12 ? ({ 0: '0', 1: 'π/8', 2: 'π/4', 3: '3π/8', 4: 'π/2', '-2': '−π/4' })[String(Math.round(k))] : fx(g, 4); };

/** 正本 J(第327便f の器の版 2)から表(キー → markdown の表)を作る */
export function tablesOf(J) {
  const T = {}, V = J.venus, R = J.resonance, H = J.ledger, cov = V.coverage, cg = V.caseGrid, prod = Object.values(cg).reduce((x, y) => x * y, 1);
  // 表 1 検査の範囲(版 1 → 版 2)
  T.coverage = ['| 器の版 | 条件の格子(積) | 帳簿まで評価した条件 | 振幅だけの条件 | 不採用(N_0 < 0) | 件数の門 allVenusCasesChecked |', '|---|---|---|---|---|---|',
    `| 版 1(第327便f) | ${ni(prod)} | ${ni(V.coverageV1.checked)} | ${ni(prod - V.coverageV1.checked)} | 0(帳簿まで評価した条件の内) | —(門なし) |`,
    `| 版 2(第328便c) | ${ni(cov.total)} | ${ni(cov.checked)} | ${ni(cov.total - cov.checked)} | ${ni(cov.rejected)} | ${J.gates.allVenusCasesChecked === true ? '真' : '偽'} |`].join('\n');
  T.grid = ['| 源 | 族 | p | Q | τ_0(格子 7 + 年齢 + ∞) | χ | 固体の型 | 熱潮汐の型(一定の位相 + 熱の緩和の ω_0 の格子) | 積 |', '|---|---|---|---|---|---|---|---|---|',
    `| ${cg.sources} | ${cg.families} | ${cg.p} | ${cg.Q} | ${cg.tau0} | ${cg.chi} | ${cg.solidForms} | ${cg.thermalForms} | ${ni(prod)} |`].join('\n');
  const w = V.worst;
  T.worst = ['| 版 2 の全部の条件の最大 | 軸の向きの残差 | 帳簿(エネルギー)の閉じ | L の閉じ | 口の閉じ | K1 の移し替え |', '|---|---|---|---|---|---|',
    `| ${ni(cov.checked)} 条件 | ${lt(w.alongRel)} | ${lt(w.residualRel)} | ${lt(w.LTotalRel)} | ${lt(w.portCloseMaxRel)} | ${lt(w.k1TransferRel)} |`].join('\n');
  // 表 2 accepted と位相・捕獲の幅(全部の条件の件数)
  { const A = V.admissible, nChi0 = prod / cg.chi;
    T.admissible = ['| 数える物 | 件数(全 ' + ni(prod) + ' 条件の内) | 読み |', '|---|---|---|',
      `| accepted(N_0 ≥ 0) | ${ni(A.accepted)} | 熱潮汐の振幅が負でない(駆動の口の向き)だけの判定 |`,
      `| 共鳴の口のトルクに位相がある(abs(N_r) ≤ N_max —— 文献の桁の (B − A)/C) | ${ni(A.withPhase)} | ${A.withPhase === nChi0 ? 'χ = 0 の条件の数と同じ(N_r = 0)—— χ ≥ 0.25 の条件は全部 abs(N_r) > N_max' : '—'} |`,
      `| 観測の自転が捕獲の幅の内(観測の差 ≤ 固定の幅) | ${ni(A.insideWidth)} | 観測の差/固定の幅 = ${fx(A.offsetOverWidth, 2)}(どの条件でも同じ) |`].join('\n'); }
  // 表 3 共鳴の口の仕事の契約の場面(純関数 —— 整数で閉じる)
  { const C = RP.DECL.counter, d = RP.DECL.frameShift, base = { gamma: C.gamma, Nmax: C.Nmax };
    const rows = [['共鳴の外の反例', C.spinOmega, C.orbitalModes], ['捕獲(Ω = ω_res)', null, C.orbitalModes], ['共通の回転(全部に +' + d + ')', C.spinOmega + d, C.orbitalModes.map((q) => Object.assign({}, q, { omega: q.omega + d }))]].map(([nm, om, md]) => {
      const pat = md.reduce((s, q) => s + q.coefficient * q.omega, 0), r = RP.resonancePower(Object.assign({}, base, { spinOmega: om === null ? pat : om, orbitalModes: md }));
      return `| ${nm} | ${ex(om === null ? pat : om)} | ${ex(md[0].omega)}・${ex(md[1].omega)} | ${ex(r.patternOmega)} | ${GAM(C.gamma)} | ${ex(r.torque)} | ${ex(r.spinPower)} | ${ex(r.potentialRate)} | ${ex(r.orbitDraw)} | ${ex(r.prescribed.orbitWork)} | ${ex(r.prescribed.gap)} | ${ex(r.orbits[0].torque)}・${ex(r.orbits[1].torque)} | ${ex(r.energyResidual)}・${ex(r.angularResidual)} |`; });
    T.contract = ['| 場面(N_max = ' + C.Nmax + ') | Ω | ω_⊕・ω_♀ | ω_res = 5ω_⊕ − 4ω_♀ | γ | N = −N_max sin 2γ | P_spin = NΩ | dU/dt = −N(Ω − ω_res) | P_orb→res = Nω_res | resPort の軌道の仕事 NΩ | 差(契約 − resPort) | 軌道のトルク −5N・+4N | 帳簿・反作用の閉じ |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 4 金星の例(宣言の観測の周期・N_max は文献の桁の (B − A)/C —— 記録)
  { const X = RP.venusExample(J);
    T.venus = ['| γ | N [N·m] | P_spin [W] | dU/dt [W] | P_orb→res [W] | resPort の軌道の仕事 [W] | 差/abs(P_spin) | 地球の軌道のトルク −5N [N·m] | 金星の軌道のトルク +4N [N·m] | 地球の軌道の仕事 [W] | 金星の軌道の仕事 [W] | 帳簿・反作用の閉じ |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(X.rows.map((r) => `| ${GAM(r.gamma)} | ${fe(r.torque)} | ${fe(r.spinPower)} | ${fe(r.potentialRate)} | ${fe(r.orbitDraw)} | ${fe(r.prescribed.orbitWork)} | ${fe(r.prescribed.gapRel)} | ${fe(r.orbits[0].torque)} | ${fe(r.orbits[1].torque)} | ${fe(r.orbits[0].power)} | ${fe(r.orbits[1].power)} | ${lt(Math.max(r.energyResidualRel, r.angularResidualRel))} |`)).join('\n');
    const avRel = Math.max(Math.abs(X.average.torque) / X.Nmax, Math.abs(X.average.potentialRate) / (X.Nmax * Math.abs(X.slip)));
    T.venusScalars = ['| 量(金星 —— 宣言の観測の周期) | 値 |', '|---|---|',
      `| N_max(文献の桁の (B − A)/C = ${fe(R.BA0)})[N·m] | ${fe(X.Nmax)} |`,
      `| 観測の自転 Ω [rad/s] | ${fe(X.spinOmega)} |`,
      `| ω_res = 5n_⊕ − 4n_♀ [rad/s] | ${fe(X.patternOmega)} |`,
      `| Ω − ω_res = γ̇ [rad/s] | ${fe(X.slip)} |`,
      `| 固定の幅 sqrt(2N_max/C) [rad/s] | ${fe(X.halfWidth)} |`,
      `| abs(Ω − ω_res)/固定の幅 | ${fx(X.slipOverWidth, 2)} |`,
      `| 位相が 1 周する時間 π/abs(Ω − ω_res) [年] | ${fx(X.circulationYears, 1)} |`,
      `| 1 周の平均のトルク/N_max・平均の dU/dt/(N_max abs(Ω − ω_res)) | ${lt(avRel)} |`,
      `| 厳密な共鳴の周期: 宣言の周期・本の状態(接触の二体)[d] | ${fx(X.book.declResDays, 3)}・${fx(X.book.resDays, 3)} |`,
      `| 2 つの厳密な共鳴の角速度の差/固定の幅 | ${fx(X.book.diffOverWidth, 1)} |`].join('\n'); }
  // 表 5 文の限定の数(正本の欄から)
  { const nd = R.need.find((q) => q.fam === 'E' && q.p === -0.75 && q.Q === 30 && q.tau === 'inf'), g1 = R.grid.find((q) => q.mult === 1), hInf = H.rows.find((q) => q.tau === 'inf' && q.chi === 0), hAge = H.rows.find((q) => q.tau === 'age' && q.p === 0 && q.chi === 0);
    T.limits = ['| 文の限定 | 値 | 読み |', '|---|---|---|',
      `| 「0.9%」 = χ_max = N_max/abs(D)(古典の極限・Q 30) | ${fe(nd.chiMax)} | 厳密な共鳴(Ω = ω_res)・有利な位相(abs(sin 2γ) = 1)での上限 —— 観測の自転では位相が回り、長い時間の平均のトルクは 0 |`,
      `| 共鳴だけで駆動の口のトルクを持つ (B − A)/C の倍率(振幅の条件) | ${fe(nd.BAforAll / R.BA0)} | abs(D) = N_max になる四重極 —— 捕獲の条件とは別 |`,
      `| 捕獲の幅へ入る四重極の倍率 (観測の差/固定の幅)² | ${fe(g1.offsetOverWidth * g1.offsetOverWidth)} | = 固定の幅が観測の差を覆う (B − A)/C(${fe(R.BAforWidth)})/文献の桁 —— 「112 倍」(振幅の条件)とは別の条件 |`,
      `| τ_0 = ∞ の列の銀河の中心の供給 P_G(年齢・p 0 の列) | ${fe(hInf.ledger.galaxySupply)}(${fe(hAge.ledger.galaxySupply)}) | τ_0 = ∞ では銀河と K1 の口のトルクが 0 —— その列の A は有限の τ_0 の解の極限の宣言(その列単独で銀河場を拘束しない) |`].join('\n'); }
  return T;
}

// 第329便a(統括の検証項目 R304): **PHYSICS〔第329便a〕の表を作る文書の lib** —— 正本 tests/out/spinbias-w329a.json から(QA docs.spinBias329a が節の表と逐語で照合する ——
//   表の数は有効数字 4 桁・丸めの程度の数は「< 1e-12」の形 —— 位相の模型の帳簿と h/h2 の差は「< 1e-10」「< 1e-6 rad」の形〔Node の版で丸めの桁が動く〕)。AN574 の印の文(第327便f の χ ≥ 0.25 の行 —— 数は動かさない)もここに置く。
import * as LF from './lib-w327f-venustide.mjs';
export const DOC_VERSION = 'w329a-spinbiasdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(d));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const gd = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) < 5e-5 ? fe(x) : x.toFixed(4)));   // 位相 [deg](小さい値は指数の形)
const yn = (b) => (b === true ? '真' : (b === false ? '偽' : '—'));
const ni = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const NAME = { sun: '太陽', mercury: '水星', venus: '金星', earth: '地球', moon: '月', jupiter: '木星', io: 'イオ' };
const KIND = { gasSolid: '気体と固体', solidSolid: '固体同士' }, ROLE = { main: '主に比べる', control: '対照', side: '並べる' };
const TAU = { inf: '∞', age: '年齢' };
const pairJa = (r) => NAME[r.src] + '–' + NAME[r.recv];

/** AN574 の印(第327便f の χ ≥ 0.25 の行 —— 宣言の格子から数える) */
export function an574Counts() {
  const D = LF.DECL, sizes = { sources: D.sources.length, families: D.families.length, p: D.pGrid.length, Q: D.lit.Q.venus.length, tau0: D.tau0.grid.length + 2, chi: D.shares.length, solid: D.solidForms.length, thermal: 1 + D.relaxOmega0.length };
  const total = Object.values(sizes).reduce((a, b) => a * b, 1), chi0 = total / sizes.chi;
  return { total, chi0, chiPos: total - chi0, shares: D.shares.slice() };
}
export const AN574_MARK = '位相なし(指定のトルクの帳簿)';

/** 正本 J から表(キー → markdown の表)を作る */
export function tablesOf(J) {
  const T = {}, tb = J.table;
  // 表 1 4 組の共通の入力表
  T.input = ['| 組 | 種類 | 役 | m_src [kg] | m_受け手 [kg] | R [m] | R_d(K1)[m] | 観測の k | 像の k | 本の k | N = abs(1 − k)(観測) | 像の k を源の軌道 1 項の位相で書ける | 源に対する自転の周期 [d] | 会合の周期 [d](相手) | 会合/源に対する自転の周期 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(tb.map((r) => `| ${pairJa(r)} | ${KIND[r.kind]} | ${ROLE[r.role]} | ${fe(r.mSrc)} | ${fe(r.mRecv)} | ${fe(r.Rrecv)} | ${fe(r.RdRecv)} | ${fx(r.kObs, 8)} | ${r.kImage} | ${fx(r.kBook, 6)} | ${fx(r.NObs, 8)} | ${yn(r.imageOneTerm)} | ${Number.isFinite(r.solarDays) ? fx(r.solarDays, 3) : '∞(同期)'} | ${fx(r.synodicDays, 3)}(${NAME[r.synodicWith]}) | ${r.synodicOverSolar === null ? '—' : fx(r.synodicOverSolar, 4)} |`)).join('\n');
  // 表 2 受動の口(第327便a の型 —— 潮汐の係数を非負の未知・族 E・球の平均 p = 0・源 J)
  T.passiveBeta = ['| 組 | 系 | 受け手の潮汐の係数 β | 受け手の採否 | 系の他の天体の β(採否) | 帳簿の閉じ・L |', '|---|---|---|---|---|---|'].concat(['mercury', 'venus', 'io', 'moon'].map((k) => {
    const q = J.passive.beta[k + '|J'], r = q.recv, others = q.rows.filter((z) => z.key !== k && z.key !== 'sun');
    return `| ${pairJa(tb.find((z) => z.key === k))} | ${q.rows.map((z) => NAME[z.key]).join('–')} | ${fe(r.beta)} | ${r.rejected ? '不採用(負)' : '採る'} | ${others.length ? others.map((z) => NAME[z.key] + ' ' + fe(z.beta) + (z.rejected ? '(不採用)' : '(採る)')).join('・') : '—'} | ${lt(Math.max(q.ledgerRel, q.LRel))} |`; })).join('\n');
  // 表 3 受動の口(文献の k2/Q の SI の型 —— ロックの自転・同じ面の射影)
  const si = (k, tau, col) => J.passive.si.find((q) => q.key === k && q.tau === tau && q.col === col && q.proj === 'coplanar');
  T.passiveSI = ['| 組 | τ_0 | 合計のトルク(ロックの自転)[N·m] | 同(観測の自転) | 銀河の口 | K1 の口(和) | 固体の潮汐(組の源) | 固体の潮汐(太陽) | 由来ごとの熱の最小 [W] | 帳簿・L・口の閉じ |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(['mercury', 'venus', 'io', 'moon'].flatMap((k) => ['inf', 'age'].map((tau) => { const r = si(k, tau, 'lock'), o = si(k, tau, 'obs'), pr = tb.find((z) => z.key === k);
      const g = r.origins.find((z) => z.key === 'gal'), k1 = r.origins.filter((z) => z.key.indexOf('k1:') === 0).reduce((s, z) => s + z.torqueAlong, 0), ts = r.origins.find((z) => z.key === 'solid:' + pr.src), tsun = pr.src === 'sun' ? null : r.origins.find((z) => z.key === 'solid:sun');
      return `| ${pairJa(pr)} | ${TAU[tau]} | ${fe(r.torque)} | ${fe(o.torque)} | ${g ? fe(g.torqueAlong) : '0(τ_0 = ∞)'} | ${g ? fe(k1) : '0(τ_0 = ∞)'} | ${fe(ts.torqueAlong)} | ${tsun ? fe(tsun.torqueAlong) : '—'} | ${fe(r.heatMinOrigin)} | ${lt(Math.max(r.ledgerRel, r.LRel, r.portClose))} |`; }))).join('\n');
  // 表 4 s_d の受理器の読み口(源 3・受け手 4 を 1 つずつ —— 0・0.5・1・2・−1 倍)
  const S = J.sd, byKey = (k) => S.engine.filter((q) => q.key === k);
  T.sdEngine = ['| 天体 | 側 | 受理した倍率 | 拒否した倍率(理由) | K1 の R_d が不変 | 本の自転が不変 | 自身の受ける目標が不変 | 源の寄与の倍率への比例(最大の相対の差) |', '|---|---|---|---|---|---|---|---|']
    .concat(['sun', 'jupiter', 'earth', 'mercury', 'venus', 'io', 'moon'].map((k) => { const rs = byKey(k), ok = rs.filter((q) => q.ok), ng = rs.filter((q) => !q.ok);
      return `| ${NAME[k]} | ${['sun', 'jupiter', 'earth'].indexOf(k) >= 0 ? '源' : '受け手'} | ${ok.map((q) => q.f).join('・')} | ${ng.length ? ng.map((q) => q.f + '(spin の値域 −20〜20 の外)').join('・') : '—'} | ${yn(ok.every((q) => q.RdSame))} | ${yn(ok.every((q) => q.spinSame))} | ${yn(ok.every((q) => q.ownTargetSame === true))} | ${lt(Math.max(...ok.map((q) => q.linMaxRel)))} |`; })).join('\n');
  T.sdGuard = ['| 源 | dragCore と sourceMoment J(R_src)を同じ天体に | 受理器の答え |', '|---|---|---|'].concat(S.guard.map((q) => `| ${NAME[q.key]} | 置く | ${q.sourceMomentGuard ? '拒否(dragCore を宣言した天体には R_src を置けない —— 源の慣性と倍率を同時に自由にしない)' : '受理'} |`)).join('\n');
  // 表 5 残差を消す源の倍率(閉じた式)
  T.sdSource = ['| 組 | 源 | 源の R_src | 伝達 t·â | 残差を消す倍率 f*(SI・年齢・ロック) | 本の単位の s_d | spin の値域の内 | β = 0 の倍率(第327便a の型) | 値域の内 | 閉じた式の確かめ(受け手の残差の相対) |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(S.pairSrc.map((q) => `| ${pairJa(tb.find((z) => z.key === q.key))} | ${NAME[q.src]} | ${q.variant === 'now' ? '今(R_src = R_d —— 受理器が受ける組)' : 'J(比べる列 —— 受理器が拒否する組)'} | ${fe(q.tAlong)} | ${fe(q.fStar)} | ${fe(q.sdBookStar)} | ${yn(q.inRange)} | ${fe(q.fBeta)} | ${yn(q.inRangeBeta)} | ${q.checkRel <= 1e-9 ? '< 1e-9' : fe(q.checkRel)} |`)).join('\n');
  T.sdDegen = ['| 組 | 源 | t_J/t_今(軸の向き) | 源の慣性の倍率(受理器の momentFactor) | ν(J, f) と ν(今, f × 比)の差 |', '|---|---|---|---|---|']
    .concat(S.degen.map((q) => `| ${pairJa(tb.find((z) => z.key === q.key))} | ${NAME[q.src]} | ${fe(q.ratio)} | ${q.momentFactor === null ? '—(源 J を置かない天体)' : fe(q.momentFactor)} | ${lt(q.rel)} |`)).join('\n');
  // 表 6 受け手の核の自転(結合の口)
  T.sdCore = ['| 組 | 核の口の目標の和 Σν [rad/s] | 0 倍 | 0.5 倍 | 2 倍 | −1 倍 | 残差を消す s_d*(s_d*/観測の自転) | 本の単位 | 値域の内 | s_d* の結合の口 |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(S.core.map((c) => { const cell = (f) => { const r = c.rows.find((z) => z.f === f); return (r.coupling.admissible ? '採る' : '不採用') + '(トルク ' + fe(r.torque) + ')'; };
      return `| ${pairJa(tb.find((z) => z.key === c.key))} | ${fe(c.sumNu)} | ${cell(0)} | ${cell(0.5)} | ${cell(2)} | ${cell(-1)} | ${fe(c.sdStar)}(${fe(c.sdStarOverS)}) | ${fe(c.sdStarBook)} | ${yn(c.inRange)} | ${c.couplingStar.admissible ? '採る' : '不採用(要る Γ_cs ' + fe(c.couplingStar.Gamma) + ')'} |`; })).join('\n');
  // 表 7 偏りの 3 列
  const B = J.bias.rows;
  T.bias = ['| 組 | τ_0 | 無偏り: 偏りの口が持つトルク [N·m] | 文献の四重極の N₂ [N·m] | 文献の四重極で保つ | N₂ だけ: 要る N₂(条件) | γ* [deg] | ∂N/∂γ [N·m] | 裏の井戸 | N₁ を足す: 要る N₁(条件) | γ* [deg] | ∂N/∂γ [N·m] | 裏の井戸 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(B.map((r) => { const pr = tb.find((z) => z.key === r.key), c2 = r.n2 && r.n2.phase ? r.n2.phase : null, c1 = r.n1 && r.n1.phase ? r.n1.phase : null, gv = (g) => ({ torque: 'トルク', width: '幅', none: '要らない' })[g];
      return `| ${pairJa(pr)} | ${TAU[r.tau]} | ${fe(-r.none.torqueLock)} | ${fe(r.quad.N2)} | ${yn(r.quadHolds)} | ${fe(r.required.n2.required)}(${gv(r.required.n2.governs)}) | ${c2 ? gd(c2.gammaDeg) : '—'} | ${c2 ? fe(c2.gradient) : '—'} | ${c2 ? (c2.back ? 'ある' : '無い') : '—'} | ${r.required.n1 ? fe(r.required.n1.required) + '(' + gv(r.required.n1.governs) + ')' : '—(1 回対称の項が一価でない)'} | ${c1 ? gd(c1.gammaDeg) : '—'} | ${c1 ? fe(c1.gradient) : '—'} | ${c1 ? (c1.back ? 'ある' : '無い') : '—'} |`; })).join('\n');
  // 表 8 会合のたびの幾何と復元の位相(別の検査)
  T.geometry = ['| 組 | パターンの周期 2π/ω_res [d] | abs(Ω_obs − ω_res)/abs(ω_res) | 会合ごとの向きのずれ [deg] | 向きが 1 周する時間 [年] | N₁ を足す列の観測の差/分離線の半幅 | N₂ だけの列の同じ比 |', '|---|---|---|---|---|---|---|']
    .concat(B.filter((r) => r.tau === 'age').map((r) => `| ${pairJa(tb.find((z) => z.key === r.key))} | ${fx(r.resDays, 3)} | ${fe(r.DeltaRel)} | ${fe(r.driftDegPerSynodic)} | ${r.cycleYears === null ? '—(同期の宣言 —— 差 0)' : fe(r.cycleYears)} | ${r.n1 && r.n1.phase ? fe(r.n1.phase.deltaOverWidth) : '—'} | ${r.n2 && r.n2.phase ? fe(r.n2.phase.deltaOverWidth) : '—'} |`)).join('\n');
  // 表 9 偏りの列の熱・反作用・帳簿(位相のある全部の列の最大)
  const cols = B.flatMap((r) => [r.n2, r.n1].filter((c) => c && c.phase));
  const mx = (f) => Math.max(...cols.map(f));
  T.biasLedger = ['| 位相のある列 | 偏りの口の熱 | 契約の反作用の和 | 契約の帳簿 | 系の軸の向きの残差 | 系の帳簿 | L | 口の閉じ | 受動の口の由来ごとの熱の最小 [W] |', '|---|---|---|---|---|---|---|---|---|',
    `| ${cols.length} | ${cols.every((c) => c.contract.heat === 0 && c.ledger.biasHeat === 0) ? '0' : '**0 でない**'} | ${lt(mx((c) => c.contract.angularRel))} | ${lt(mx((c) => c.contract.energyRel))} | ${lt(mx((c) => c.ledger.alongRel))} | ${lt(mx((c) => c.ledger.residualRel))} | ${lt(mx((c) => c.ledger.LRel))} | ${lt(mx((c) => c.ledger.portClose))} | ${fe(Math.min(...cols.map((c) => c.ledger.heatMinOrigin)))} |`].join('\n');
  // 表 10 気体と固体の 2 組の式の形
  const F = J.forms, KN = { torque: 'トルクの条件(無偏りのトルク)', widthN2: '幅の条件(N₂ だけ)' }, FN = { tidal: 'X′ = G m_src² R⁵/d⁶', quad: '(3/2) G m_src (B − A)/d³', spin: 'C n²' };
  T.forms = ['| 条件 | 尺度 | 金星(∞・年齢) | イオ(∞・年齢) | log10(金星/イオ)(∞・年齢) | 共通の形の候補(2 倍の内・両方の枝) | 単純な関数の候補(1 つのべき) |', '|---|---|---|---|---|---|---|']
    .concat(F.compare.map((c) => `| ${KN[c.kind]} | ${FN[c.form]} | ${fe(c.per.inf.a)}・${fe(c.per.age.a)} | ${fe(c.per.inf.b)}・${fe(c.per.age.b)} | ${c.per.inf.log10Ratio === null ? '—' : fx(c.per.inf.log10Ratio, 3)}・${c.per.age.log10Ratio === null ? '—' : fx(c.per.age.log10Ratio, 3)} | ${c.candidate ? '候補' : '残差'} | ${c.anySimple ? c.simple.filter((z) => z.simple).map((z) => z.q).join('・') : '無い'} |`)).join('\n');
  T.formsAll = ['| 組 | 役 | トルクの条件 / X′(∞・年齢) | トルクの条件 / 四重極の尺度(∞・年齢) | トルクの条件 / C n²(∞・年齢) | 幅の条件 / X′ |', '|---|---|---|---|---|---|']
    .concat(F.table.map((t) => { const pr = tb.find((z) => z.key === t.key), c = t.c; return `| ${pairJa(pr)} | ${ROLE[pr.role]} | ${fe(c.inf.torque.tidal)}・${fe(c.age.torque.tidal)} | ${fe(c.inf.torque.quad)}・${fe(c.age.torque.quad)} | ${fe(c.inf.torque.spin)}・${fe(c.age.torque.spin)} | ${fe(c.age.widthN2.tidal)} |`; })).join('\n');
  // 表 11 AN570 の限定の列
  const A = J.an570;
  T.an570 = ['| 天体 | A の閾値 A_th [rad/s] | β ≥ 0 の A の範囲 | 太陽の式の A(' + fe(A.Asun) + ')が範囲の内 | A_th/A_☉ |', '|---|---|---|---|---|']
    .concat(A.rows.map((r) => `| ${NAME[r.body]} | ${fe(r.Ath)} | ${r.range.lo === null ? 'A ≤ ' + fe(r.range.hi) : 'A ≥ ' + fe(r.range.lo)} | ${yn(r.AsunInside)} | ${fe(r.AthOverAsun)} |`)).join('\n');
  { const I = A.mainIntersection; T.an570main = ['| 金星・木星・イオの範囲の共通部分 | 値 |', '|---|---|', `| 下の端(A ≥) | ${fe(I.lo)} |`, `| 上の端(A ≤) | ${fe(I.hi)} |`, `| 空(交わらない) | ${yn(I.empty)} |`, `| 太陽の式の A が 3 天体の範囲の全部の内 | ${yn(A.mainConsistent)} |`].join('\n'); }
  T.an570si = ['| 組 | 受け手のトルクを 0 にする A*(文献の k2/Q・τ_0 = 年齢)[rad/s] | A*/A_☉ |', '|---|---|---|'].concat(A.si.map((r) => `| ${pairJa(tb.find((z) => z.key === r.key))} | ${fe(r.Astar)} | ${fe(r.AstarOverAsun)} |`)).join('\n');
  // 表 12 AN575 の小さな位相の模型(金星)
  const M = J.phaseModel;
  T.phaseDecl = ['| 宣言 | 値 |', '|---|---|', `| 組・列・τ_0 | 太陽–金星(パターンは地球との 5:−4)・N₁ を足す列・${TAU[M.tau]} |`, `| C [kg m²] | ${fe(M.C)} |`, `| N₁・N₂ [N·m] | ${fe(M.N1)}・${fe(M.N2)} |`,
    `| ω_res [rad/s](周期 [d]) | ${fe(M.omegaRes)}(${fx(2 * Math.PI / M.omegaRes / 86400, 3)}) |`, `| ロックの受動の口のトルク [N·m] | ${fe(M.torqueLock)} |`, `| γ* [deg]・∂N/∂γ [N·m] | ${fx(M.gammaStar * 180 / Math.PI, 4)}・${fe(M.gradient)} |`,
    `| 秤動の周期 [年] | ${fe(M.libPeriodYears)} |`, `| 減衰 D = Σ Γ_α [N·m·s](減衰の時間 C/D [年]) | ${fe(M.damping)}(${fe(M.dampTimeYears)}) |`, `| 分離線の半幅 [rad/s] | ${fe(M.width)} |`].join('\n');
  T.phaseRuns = ['| 開始 | k_0 | 滑り/分離線の半幅 | 模型の長さ [年]・步の数(h) | 判定 h・h/2 | 帳簿(パターンの枠)h・h/2 | 帳簿(慣性の枠)h/2 | 最後の γ の差(h と h/2)| 熱の積分 [J](h/2) |', '|---|---|---|---|---|---|---|---|---|']
    .concat(M.runs.map((r) => `| ${r.start === 'observed' ? '観測の k' : '像の k'} | ${fx(r.k0, 8)} | ${fe(r.slip0OverWidth)} | ${fe(r.spanYears)}・${ni(r.steps)} | ${r.h.state === 'libration' ? '秤動' : '循環'}・${r.h2.state === 'libration' ? '秤動' : '循環'} | ${lt(r.h.patternRel, 1e-10)}・${lt(r.h2.patternRel, 1e-10)} | ${lt(r.h2.inertialRel, 1e-10)} | ${lt(r.gammaDiff, 1e-6)} rad | ${fe(r.h2.heat)} |`)).join('\n');
  // 表 13 AN574 の印
  const c4 = an574Counts();
  T.an574 = ['| 第327便f の行 | 条件の数(宣言の格子) | 印 |', '|---|---|---|', `| χ = 0 | ${ni(c4.chi0)} | 共鳴の口のトルク 0(位相の有無を問わない) |`, `| χ ≥ 0.25(${c4.shares.filter((x) => x > 0).join('・')}) | ${ni(c4.chiPos)} | ${AN574_MARK} —— abs(N_r) > N_max(文献の桁の四重極)で位相が無い。数は第327便f・第328便c のまま |`].join('\n');
  return T;
}

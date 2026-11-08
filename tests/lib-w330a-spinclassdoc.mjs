// 第330便a(統括の検証項目 R307): **PHYSICS〔第330便a〕の表を作る文書の lib** —— 正本 tests/out/spinclass-w330a.json から(QA docs.spinClass330a が節の表と逐語で照合する ——
//   表の数は有効数字 4 桁・帳簿の残差は「< 1e-12」の形〔丸めの程度の数を逐語の表に書かない〕)。第329便a の節の「第330便の更新」の行(N₁ の倍率の読み・AN579 の注記)もここに置く。
export const DOC_VERSION = 'w330a-spinclassdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(d));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const yn = (b) => (b === true ? '真' : (b === false ? '偽' : '—'));
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];
const NAME = { sun: '太陽', [MER]: '水星', venus: '金星', earth: '地球', moon: '月', mars: '火星', jupiter: '木星', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', [SAT]: '土星',
  titan: 'タイタン', uranus: '天王星', neptune: '海王星', triton: 'トリトン' };
const CLS = { tidalLock: '潮汐ロック', partialLock: 'ある程度ロック', noLock: 'ロックしない' };
const GRP = { axial: '軸引きずり', tide: '潮汐', mixed: '混ざる', none: '無し', bias: '偏り' };
const FORM = { ballMean: '球の平均 p = 0', inertiaShare: '慣性で配る' };
const TAU = { inf: '∞', age: '年齢' };
const SET = { galOnly: '銀河の 1 口', galK1: '銀河 + K1', galK1Tide: '銀河 + K1 + 潮汐(τ_0 = 年齢)', tideOnlyInf: '潮汐だけ(τ_0 = ∞)' };
const ORG = (k) => { const [a, b] = k.split(':'); return ({ gal: '銀河', k1: 'K1', solid: '固体の潮汐', thermal: '熱潮汐', res: '偏り' })[a] + (b ? '(' + NAME[b] + ')' : ''); };
const SRC = { lit: '文献の値', order: '文献の桁', formulaSun: '古典の式(太陽だけ —— 下限の目安)', nodeJ2: '親の J2 の節の歳差の式' };
const POLE = { orbitNormal: '公転の法線', eclipticPole: '黄道の極', parentAxis: '親の自転軸' };

/** 第329便a の節の「第330便の更新」の行(数は第329便a の正本と本便の正本の AN577 の列から —— 第329便a の正本の数は動かさない) */
export function update329aLine(J) {
  const A = J.an577.A;
  return `**第330便の更新(第330便a —— 原仮定者の回答(2026-11-08 —— AN577 = C・AN579 = A)・統括の検証項目 R307)**: 金星の偏りの N₁ の倍率の読み —— 要る最小の N₁(${fe(A.requiredN1)} N·m —— 幅の条件)はトルクの条件(${fe(A.torqueCond)} N·m)の **${fx(A.requiredOverTorque, 1)} 倍**、余裕 ${A.margin} を掛けた宣言の値(${fe(A.declaredN1)} N·m —— 位相の模型に使った値)が **${fx(A.declaredOverTorque, 1)} 倍**(最小と宣言を分けて読む —— 本節の数は動かしていない)。`
    + `AN579 の注記: 表 14〜16 の「金星と木星・イオの有効な滑り A の範囲は交わらない」は族 E・球の平均 p = 0・今の K1 の核・文献の k2/Q の条件の下の記録(結論や「共通の A が無い法則」にしない —— 新しい重みの式〔第330便b〕の模型の否定に広げない)。`
    + `AN577 = C の 2 列(A 秤動・B 観測の自転を目標にした有効なパターン)は本便の第330便a の節の表 9。過去の行は書き換えていない。`;
}

/** 正本 J から表(キー → markdown の表)を作る */
export function tablesOf(J) {
  const T = {}, B = J.inputs.bodies, keys = Object.keys(B), C = J.classTable;
  // 表 1 16 体の入力(分類は宣言)
  T.input = ['| 天体 | 分類(宣言) | m [kg] | R [m] | R_d(K1)[m] | C/(M R²) | 自転(本)[rad/s] | 自転(観測)[rad/s] | k = ω/n(観測) | k(本) | 軸と公転の法線の角 [deg] | ĝ·â | 慣性で配る型の f_i |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(keys.map((k) => { const b = B[k], o = b.orbit;
    return `| ${NAME[k]} | ${CLS[b.cls]} | ${fe(b.m)} | ${fe(b.R)} | ${fe(b.Rd)} | ${b.moi} | ${fe(b.sBook)} | ${fe(b.sObs)} | ${o ? fe(o.kObs) : '—'} | ${o ? fe(o.kBook) : '—'} | ${o ? fx(o.obliqDeg, 3) : '—'} | ${fx(b.gDotA, 4)} | ${fe(J.inputs.fOf.inertiaShare[k])} |`; })).join('\n');
  // 表 2 由来ごとの軸の向きのトルク(球の平均 p = 0・τ_0 = 年齢・本の向き —— 観測の自転)
  const rowOf = (k, form, tau, proj = 'book') => C.rows.find((q) => q.key === k && q.form === form && q.tau === tau && q.proj === proj);
  const sumK = (r, pre) => r.origins.filter((q) => q.key.indexOf(pre) === 0).reduce((s, q) => s + q.torqueAlong, 0);
  const tideCell = (r) => { const ts = r.origins.filter((q) => q.key.indexOf('solid:') === 0); return ts.length ? ts.map((q) => NAME[q.key.split(':')[1]] + ' ' + fe(q.torqueAlong)).join('・') : '—'; };
  const ratio = (r) => (r.tideMag > 0 && r.axialMag > 0 ? fe(r.axialMag / r.tideMag) : (r.axialMag > 0 ? '∞' : (r.tideMag > 0 ? '0' : '—')));
  const origTable = (form, tau) => ['| 天体 | 分類 | 銀河 [N·m] | K1(和) | 固体の潮汐(起潮天体ごと) | 合計 | 最大の由来 | 軸引きずり/潮汐(Σ\\|N\\|) | 軸引きずりの重み Σw | 判定(トルク) | 判定(重み) | 期待 | 一致(トルク・重み) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(keys.map((k) => { const r = rowOf(k, form, tau), g = r.origins.find((q) => q.key === 'gal');
    const hasK1 = r.origins.some((q) => q.key.indexOf('k1:') === 0);
    return `| ${NAME[k]} | ${CLS[r.cls]} | ${g ? fe(g.torqueAlong) : '0(τ_0 = ∞)'} | ${!g ? '0(τ_0 = ∞)' : (hasK1 ? fe(sumK(r, 'k1:')) : '—(口なし)')} | ${tideCell(r)} | ${fe(r.along)} | ${r.maxTorque ? ORG(r.maxTorque.key) : '—(合計 0)'} | ${ratio(r)} | ${fe(r.axialWeight)} | ${GRP[r.verdictTorque]} | ${GRP[r.verdictWeight]} | ${GRP[r.expected]} | ${yn(r.matchTorque)}・${yn(r.matchWeight)} |`; })).join('\n');
  T.originsBallAge = origTable('ballMean', 'age');
  T.originsInertiaAge = origTable('inertiaShare', 'age');
  // 表 3 分類の作業仮説と由来ごとの最大・重みの一致(型 × τ_0 —— 本の向き)
  T.classSummary = ['| 型 | τ_0 | 一致(トルク)/16 | 一致(重み)/16 | 潮汐ロック 7(トルク・重み) | ある程度ロック 2 | ロックしない 7 | 射影 2 で判定が同じ |', '|---|---|---|---|---|---|---|---|']
    .concat(C.summary.map((s) => { const c = (k) => s.byClass[k].matchTorque + '・' + s.byClass[k].matchWeight;
      return `| ${FORM[s.form]} | ${TAU[s.tau]} | ${s.matchTorque} | ${s.matchWeight} | ${c('tidalLock')} | ${c('partialLock')} | ${c('noLock')} | ${yn(s.projAgree)} |`; })).join('\n');
  // 表 4 代表の桁の k2/Q の天体で重みの判定が入れ替わる潮汐の Γ の倍率
  const flips = C.rows.filter((q) => q.flip && q.proj === 'book' && q.form === 'ballMean');
  T.flip = ['| 天体 | 判定(重み —— τ_0 = 年齢・球の平均) | 軸引きずりの重み Σw | 入れ替わる潮汐の Γ の倍率(上) | 同(下) | 感度の範囲(10^±2 倍)の内で入れ替わる |', '|---|---|---|---|---|---|']
    .concat(flips.map((r) => `| ${NAME[r.key]} | ${GRP[r.flip.verdict]} | ${fe(r.axialWeight)} | ${fe(r.flip.up)} | ${fe(r.flip.down)} | ${yn((r.flip.up !== null && r.flip.up <= 100) || (r.flip.down !== null && r.flip.down >= 0.01))} |`)).join('\n');
  // 表 5 1 つの A(本の自転 —— ロックしない天体)
  const E = J.earthMars;
  T.singleA = ['| 天体 | 型 | f_i | ĝ·â | 銀河の 1 口: A [rad/s](A/A_☉) | 銀河 + K1: A(A/A_☉) | 銀河 + K1 + 潮汐: A(A/A_☉) | A_☉ の定常の目標/観測(銀河の 1 口) | 同(銀河 + K1 + 潮汐) | 同(潮汐だけ・τ_0 = ∞) |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(E.rows.filter((q) => q.col === 'book').map((r) => `| ${NAME[r.key]} | ${FORM[r.form]} | ${fe(r.f)} | ${fx(r.gDotA, 4)} | ${fe(r.galOnly.A)}(${fe(r.galOnly.AOverAsun)}) | ${fe(r.galK1.A)}(${fe(r.galK1.AOverAsun)}) | ${fe(r.galK1Tide.A)}(${fe(r.galK1Tide.AOverAsun)}) | ${fe(r.galOnly.steadyOverSpin)} | ${fe(r.galK1Tide.steadyOverSpin)} | ${fe(r.tideOnlyInf.steadyOverSpin)} |`)).join('\n');
  // 表 6 A の広がりと地球と火星の比
  T.spread = ['| 型 | 口 | 太陽・地球・火星の A の広がり(log10) | 地球・火星の広がり(log10) | ロックしない 7 天体(符号) | A_☉ の定常の目標の火星/地球 | 観測の角速度の火星/地球 |', '|---|---|---|---|---|---|---|']
    .concat(E.spread.filter((q) => q.col === 'book').map((s) => { const m = E.modelRatio.find((q) => q.form === s.form && q.set === s.set);
      return `| ${FORM[s.form]} | ${SET[s.set]} | ${fx(s.sunEarthMars.spreadLog10, 3)} | ${fx(s.earthMars.spreadLog10, 3)} | ${s.allNoLock.sameSign ? '同符号' : '符号が混ざる(' + s.allNoLock.signs.map((x) => (x > 0 ? '+' : '−')).join('') + ')'} | ${m ? fe(m.marsOverEarth) : '—'} | ${fx(E.earthMars.book.omegaRatio, 4)} |`; })).join('\n');
  // 表 7 金星の符号の表(本の向き —— 同じ面の列は正本)
  const V = J.venusSigns;
  T.venusSigns = ['| 型 | τ_0 | 熱潮汐 | 銀河 [N·m] | 太陽 K1 | 太陽の固体の潮汐 | 太陽の熱潮汐 | 太陽の群 | 合計 | 銀河と太陽の群が逆符号 | \\|合計\\|/max | 合計を 0 にする熱潮汐の N_0 [N·m](文献の下の端の倍) |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(V.rows.filter((q) => q.proj === 'book').map((r) => `| ${FORM[r.form]} | ${TAU[r.tau]} | ${({ none: 'なし', lo: '文献の下の端', hi: '文献の上の端' })[r.thermal]} | ${fe(r.gal)} | ${fe(r.sunK1)} | ${fe(r.sunSolid)} | ${fe(r.sunThermal)} | ${fe(r.sunGroup)} | ${fe(r.net)} | ${yn(r.opposite)} | ${fx(r.balanceRel, 4)} | ${fe(r.n0Zero)}(${fx(r.n0ZeroOverLo, 3)}) |`)).join('\n');
  // 表 8 AN577 = C の 2 列
  const N = J.an577, A = N.A, Bc = N.B;
  T.an577 = ['| 列 | 読み | 要る N₁ [N·m](条件) | トルクの条件 [N·m] | 幅の条件 [N·m] | 宣言の N₁ | 最小/トルク | 宣言/トルク | ω_res との差 [rad/s] | 仕事の差の尺度 [W] | 位相の模型(観測の k・像の k) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    `| A(秤動) | 軌道の周波数(5 n_地球 − 4 n_金星)のパターン —— 観測の差を秤動の一瞬と読む | ${fe(A.requiredN1)}(${A.governs === 'width' ? '幅' : 'トルク'}) | ${fe(A.torqueCond)} | ${fe(A.widthCond)} | ${fe(A.declaredN1)}(余裕 ${A.margin}) | ${fx(A.requiredOverTorque, 2)} | ${fx(A.declaredOverTorque, 2)} | ${fe(Bc.deltaOmega)}(観測の差 —— 分離線の内) | — | ${A.phaseModel.runs.map((q) => ({ libration: '秤動', circulation: '循環' })[q.stateH2]).join('・')}(h と h/2 で同じ) |`,
    `| B(有効なパターン) | 観測の自転を目標にしたパターン(現象論の宣言 —— 5:−4 の周波数を観測で確定した列ではない) | ${fe(Bc.requiredN1)}(トルク) | ${fe(Bc.torqueCondObs)} | 0(差 0 の宣言) | — | — | — | 0(宣言 —— 現在の軌道の ω_res との差は ${fe(Bc.deltaOmega)}) | ${fe(Bc.workGapScale)} | —(位相の時間変化か追加の駆動の口座が要る) |`].join('\n');
  // 表 9 内部熱の帳簿(球の平均 p = 0・本の向き)
  const H = J.heat;
  const hr = (k, tau, form = 'ballMean', variant = 'base') => H.rows.find((q) => q.key === k && q.tau === tau && q.form === form && q.variant === variant);
  T.heat = ['| 天体 | τ_0 | Q_軸引きずり [W] | Q_潮汐 [W] | Q(由来ごとの和) | 同(慣性で配る) | 受け手と系の収支(閉じたか) | 観測の自転が定常 | 変化の時間 I\\|s\\|/\\|N\\| [年] | 観測の熱流 [W](文献の値) | Q/観測の熱流 | 同(慣性で配る) |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(keys.flatMap((k) => ['inf', 'age'].map((tau) => { const r = hr(k, tau), ri = hr(k, tau, 'inertiaShare');
      return `| ${NAME[k]} | ${TAU[tau]} | ${fe(r.Qaxial)} | ${fe(r.Qtide)} | ${fe(r.Q)} | ${fe(ri.Q)} | ${r.closed ? '閉じた(' + lt(Math.max(r.recvResidualRel, r.systemResidualRel)) + ')' : '**閉じない**'} | ${yn(r.steady)} | ${fe(r.tChangeYears)} | ${r.heatObsDeclared === 'lit' ? fe(r.heatObs) : (r.heatObsDeclared === 'unknown' ? '不明(null)' : '宣言しない')} | ${fe(r.obsRatio)} | ${fe(ri.obsRatio)} |`; }))).join('\n');
  T.heatVenus = ['| 列 | 型 | τ_0 | 足す口 | Q [W] | 偏りの口の熱 | 自転の仕事 dE_spin/dt [W] | 定常 | 受け手と系の収支 | 日射の供給 [W] | 偏りの口の軌道の口座 [W] |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(['bias', 'thermal:lo', 'thermal:hi'].flatMap((v) => ['ballMean', 'inertiaShare'].flatMap((form) => ['inf', 'age'].map((tau) => { const r = hr('venus', tau, form, v);
      return `| 金星 | ${FORM[form]} | ${TAU[tau]} | ${({ bias: '偏りの口(合トルクを打ち消す N_r)', 'thermal:lo': '熱潮汐(文献の下の端)', 'thermal:hi': '熱潮汐(文献の上の端)' })[v]} | ${fe(r.Q)} | ${fe(r.Qbias)} | ${r.steady ? '0(定常)' : fe(r.spinPower)} | ${yn(r.steady)} | ${r.closed ? '閉じた' : '**閉じない**'} | ${fe(r.supply.solar)} | ${fe(r.supply.biasOrbit)} |`; })))).join('\n');
  // 表 10 測地の歳差
  const G = J.geodetic;
  T.geodetic = ['| 天体 | Ω_geo [″/世紀] | 近点の移動の 1PN の型 [″/世紀](軌道の量) | Ω_geo/自転 | 自転の軸の向きの釣り合いへの寄与 | Ω_geo/重力トルクの歳差(主の値) | 地球 1 年の角 [rad] | 同じ角速度を剛体で作る垂直のトルクの尺度 [N·m] |', '|---|---|---|---|---|---|---|---|']
    .concat(G.rows.map((r) => `| ${NAME[r.key]} | ${fe(r.geoArcsecPerCentury)} | ${fe(r.periArcsecPerCentury)} | ${fe(r.geoOverSpin)} | 0(足さない) | ${fe(r.geoOverPrecession)} | ${fe(r.geoAngleEarthYear)} | ${fe(r.perpTorqueScale)} |`)).join('\n');
  T.geodeticMercury = `水星の近点の移動の 1PN の型(本の二体の a・e と文献の公転の周期)は ${fx(G.mercury.periArcsecPerCentury, 3)}″/世紀 —— paper/data の行(${fx(G.mercury.periCsvArcsecPerCentury, 3)}″/世紀)との相対の差 ${fe(G.mercury.periRelToCsv)}。測地の歳差 Ω_geo は ${fx(G.mercury.geoArcsecPerCentury, 3)}″/世紀(1PN の近点の移動の半分 —— 試験質点の極限の式の関係)。`;
  // 表 11 歳差の窓
  const Wp = J.precession;
  T.precession = ['| 天体 | 極(円錐の軸) | 円錐の半角 ε [deg] | 歳差の角速度 [″/年](出どころ) | 周期 [年] | 要る角の精度 [rad](ĝ·â が 1% 動く角) | イオ 1 公転: 軸の変位 [rad](/精度) | 地球 1 年: 位相 [rad] | 地球 1 年: 軸の変位(/精度) | 10 年: 軸の変位(/精度) |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(Wp.rows.map((r) => { const w = (k) => r.windows ? r.windows.find((q) => q.key === k) : null, cell = (k) => { const q = w(k); return q ? fe(q.displacement) + '(' + fe(q.overRequired) + ')' : '—'; };
      return `| ${NAME[r.key]} | ${r.pole ? POLE[r.pole] : '—'} | ${fx(r.epsDeg, 3)} | ${r.rate ? fe(r.arcsecPerYear) + '(' + SRC[r.rateSource] + ')' : '宣言しない(null)'} | ${fe(r.periodYears)} | ${fe(r.requiredAngle)} | ${cell('ioOrbit')} | ${w('earthYear') ? fe(w('earthYear').phase) : '—'} | ${cell('earthYear')} | ${cell('decade')} |`; })).join('\n');
  const pm = Wp.phaseModelRow;
  T.phaseModel = `位相の模型の期間の行(別 —— 模型の計算): 金星の ${fx(pm.spanYears, 0)} 年で歳差の位相 ${fx(pm.phase, 3)} rad(${fx(pm.phaseOver2Pi, 3)} 周)・軸の変位 ${fe(pm.displacement)} rad(要る角の精度の ${fe(pm.overRequired)} 倍)。`;
  return T;
}

// 第330便a(原仮定者の整理(2026-11-08)「自転が潮汐ロックしている天体: 潮汐力に強く影響されている(各惑星の主要衛星)」「自転がある程度ロックしている天体: 太陽に近い水星と金星」
//   「自転がロックしていない天体: 軸引きずりに強く影響されている(銀河に含まれる太陽・地球以遠の各惑星)」「軌道が近い地球と火星の自転速度がほぼ同じ」「金星は、太陽と銀河の影響がほぼ
//   釣り合っているのではないか」「水星は、測地線の影響も検討」「歳差運動は、シミュレーションの時間スケールでは無視出来る」「重み付けされた軸引きずりと潮汐力の合算が観測自転。観測自転に
//   対する、重み付けされた軸引きずりによるトルクのトータルが内部熱」・原仮定者の回答(2026-11-08 —— AN577 = C・AN578 = A と C を同じ表に・AN579 = A)・統括の検証項目 R307):
//   **自転の 3 分類と由来ごとのトルクの表・地球と火星の対照・金星の符号の表・内部熱の帳簿・測地の歳差・歳差の窓の純関数**(器 tests/exp-w330a-spinclass.mjs と QA lint.spinClass330a が読む ——
//   html を読まない・ファイルを読まない・状態を持たない・エンジンの式を写さない。受動の口〔銀河・K1・固体の潮汐〕の評価は器が第327便a・第327便f の lib をそのまま呼ぶ —— ここは
//   由来ごとの行を読む集計と、文献の式の値〔測地の歳差・古典の歳差・節の歳差〕と窓の角だけ)。
//
// ■ 3 分類は**宣言の作業仮説**(原仮定者の整理(2026-11-08)—— 走行の前に置く。結果を見て分類を書き換えない): 潮汐ロック(tidalLock)= 月・イオ・エウロパ・ガニメデ・カリスト・タイタン・トリトン
//   (各惑星の主要衛星 —— 本 🗺️ にある衛星)/ある程度ロック(partialLock)= 水星・金星/ロックしない(noLock)= 太陽・地球・火星・木星・土星・天王星・海王星。
//   期待の群: 潮汐ロック → 潮汐が主・ある程度ロック → 混ざる(潮汐の群と軸引きずりの群の大きさの比が 1 桁の内)・ロックしない → 軸引きずりが主。
//   群: 軸引きずり(銀河の口・K1 の口)/潮汐(固体の潮汐・熱潮汐)/偏り(保存の口 —— 金星の AN577 の列だけ)。比べるのは**由来ごとのトルクの大きさ**(合トルクに対する比ではない ——
//   釣り合いの点では合トルクが 0 に近い)と、由来ごとの応答 Γ の重み w_α = Γ_α/ΣΓ(線形の受動の口の定常 Ω* = Σ w_α ν_α —— 原仮定者の整理の「重み付けされた合算」の読み)。
// ■ 熱: 由来ごとに Q_α = Γ_α (ν_α − Ω)² ≥ 0(逆向きの由来を先に合成して二乗しない —— 合トルク 0 でも熱 > 0)。収支 P_source + P_orbit + P_solar + P_contraction = dE_spin/dt + dU_bias/dt + Q・
//   Q = P_rad + dE_th/dt(定常で蓄積 0)。ジャイロ・歳差は熱に数えない。凝縮の供給は固定の口座(短い計算では追わない —— 銀河の口の供給と二重に入れない)。
//   「口座が閉じた(宣言した範囲で収支が閉じた)」「観測の熱流〔文献の値〕との比」「アプリのサンプルで放射まで接続した」は**別の欄**(本便は前の 2 つ —— 3 つ目は記録しない)。
// ■ 水星の測地線: 自転のベクトルの測地の歳差(de Sitter の型 Ω_geo = (3/2) n GM/(c² a (1 − e²)))は近点の移動(1PN の型 3 n GM/(c² a (1 − e²)) —— 軌道の量)と別の量。自転の軸の向きの
//   トルクの釣り合い(3:2)へは足さない(輸送はトルクではない —— 二重に投入しない)。
// ■ 歳差の窓: 判断の量は |Ω_prec| T(位相)と、円錐の半角 ε の上の軸の向きの変位 δ = 2 asin(sin ε sin(|Ω_prec| T/2))と、要る角の精度(宣言 —— ĝ·â が 1% 動く角)。
//   位相の模型の期間(第329便a —— 約 3.2e4 年)は軌道・軸・供給を固定した模型の計算で、窓の行とは別の行。
// ■ 言わないこと: 分類の作業仮説を検査した結果は「宣言した型で表の値になった」「残差」—— 分類を直さない・「説明した」「確かめた」と書かない。金星の釣り合いは「今の応答の型では同符号」か
//   「逆符号の列がある」の列の値(仮説の否定とも肯定とも書かない)。負の Γ は採らない(0 に丸めない)。内部熱は「宣言した範囲で収支が閉じた」と観測の熱流との比を別の欄に。
export const LIB_VERSION = 'w330a-spinclass-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const DAY = 86400, YEAR = 365.25 * DAY, ARCSEC = Math.PI / 180 / 3600;
export const G_SI = 6.6743e-11;      // SI の重力定数(第327便f の lib と同じ値)
export const C_SI = 299792458;       // 光速(定義の値)
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違えない書き方 —— 第327便a と同じ)

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  // 16 体の本 🗺️(solarSystem16Inertial3d)の添字の順
  bodies: Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', 'europa', 'ganymede', 'callisto', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  // 3 分類(原仮定者の整理(2026-11-08)—— 宣言の作業仮説)
  classes: Object.freeze({
    tidalLock: Object.freeze(['moon', 'io', 'europa', 'ganymede', 'callisto', 'titan', 'triton']),
    partialLock: Object.freeze([MER, 'venus']),
    noLock: Object.freeze(['sun', 'earth', 'mars', 'jupiter', SAT, 'uranus', 'neptune']),
  }),
  expected: Object.freeze({ tidalLock: 'tide', partialLock: 'mixed', noLock: 'axial' }),
  mixedBandLog10: 1,   // 「混ざる」= 潮汐の群と軸引きずりの群の大きさの比が 10^±1 の内
  // 公転の中心(潮汐の目標の公転と k = ω/n の n)
  primary: Object.freeze({ [MER]: 'sun', venus: 'sun', earth: 'sun', mars: 'sun', jupiter: 'sun', [SAT]: 'sun', uranus: 'sun', neptune: 'sun', moon: 'earth', io: 'jupiter', europa: 'jupiter',
    ganymede: 'jupiter', callisto: 'jupiter', titan: SAT, triton: 'neptune' }),
  // 口の接続(銀河は全天体・K1 は源ごと・固体の潮汐は起潮天体ごと —— 第326便d・第327便e・第329便a の接続に本の他の天体を足す。太陽の口は銀河だけ〔第329便a と同じ〕)
  ports: Object.freeze({
    sun: Object.freeze({ k1: Object.freeze([]), tide: Object.freeze([]) }),
    [MER]: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    venus: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    earth: Object.freeze({ k1: Object.freeze(['sun', 'moon']), tide: Object.freeze(['sun', 'moon']) }),
    moon: Object.freeze({ k1: Object.freeze(['sun', 'earth']), tide: Object.freeze(['earth', 'sun']) }),
    mars: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    jupiter: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun', 'io']) }),
    io: Object.freeze({ k1: Object.freeze(['sun', 'jupiter']), tide: Object.freeze(['jupiter', 'sun']) }),
    europa: Object.freeze({ k1: Object.freeze(['sun', 'jupiter']), tide: Object.freeze(['jupiter', 'sun']) }),
    ganymede: Object.freeze({ k1: Object.freeze(['sun', 'jupiter']), tide: Object.freeze(['jupiter', 'sun']) }),
    callisto: Object.freeze({ k1: Object.freeze(['sun', 'jupiter']), tide: Object.freeze(['jupiter', 'sun']) }),
    [SAT]: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun', 'titan']) }),
    titan: Object.freeze({ k1: Object.freeze(['sun', SAT]), tide: Object.freeze([SAT, 'sun']) }),
    uranus: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }),
    neptune: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun', 'triton']) }),
    triton: Object.freeze({ k1: Object.freeze(['sun', 'neptune']), tide: Object.freeze(['neptune', 'sun']) }),
  }),
  // 受け手の応答の演算の型(原仮定者の回答(2026-11-08 —— AN578 = A と C を同じ表に)—— 主と副を付けない 2 列。球の平均 p = 0 は第329便a の主列・慣性で配る型は第328便b の lib の inertiaShare)
  responseForms: Object.freeze(['ballMean', 'inertiaShare']),
  tau0: Object.freeze(['inf', 'age']),   // 応答の時間の尺度 τ_0(Γ⁰ = I/τ_0 —— 熱だけのノブではない: 銀河と K1 の口の重みも変える)
  projections: Object.freeze({ main: 'book', also: 'coplanar', ja: '潮汐の目標の公転の向き —— 主は本の J2000 の二体の向き(大きさは文献の周期)・比べる列は同じ面(軸 â の向き —— 第329便a の主)' }),
  solidMain: 'constLag',   // 固体の潮汐の型(第329便a と同じ —— 観測の滑りで一定の Q と同じトルク・同期の組は |n| で揃える)
  // 文献の値(本便は一次資料に当たっていない —— 比べる列・合わせない)。代表の桁の値は role 'order'(感度の列で 10^±2 倍)
  lit: Object.freeze({
    // 慣性係数 C/(M R²)(太陽・金星・地球・木星・土星・イオは第326便d の MOI・火星と月は第327便e・水星は第329便a と同じ値。他は文献の値の桁 —— トリトンは測られていない代表の値)
    moi: Object.freeze({ sun: 0.07, [MER]: 0.346, venus: 0.33, earth: 0.3307, moon: 0.3929, mars: 0.3662, jupiter: 0.254, io: 0.378, europa: 0.346, ganymede: 0.3115, callisto: 0.3549,
      [SAT]: 0.21, titan: 0.3414, uranus: 0.225, neptune: 0.23, triton: 0.33 }),
    // 固体の潮汐の k2/Q(水星・金星・イオ・月は第329便a・地球・木星・土星は第327便a・火星は第327便f と同じ値。天王星・海王星は k2 と Q の下限の桁・他の衛星は代表の桁)
    k2Q: Object.freeze({ [MER]: 0.45 / 100, venus: 0.295 / 30, earth: 0.025, moon: 0.024 / 38, mars: 0.17 / 90, jupiter: 1.1e-5, io: 0.015, [SAT]: 2.3e-4, uranus: 0.104 / 1e4, neptune: 0.127 / 1e4,
      europa: 1e-2, ganymede: 1e-2, callisto: 1e-2, titan: 1e-2, triton: 1e-2 }),
    k2QRole: Object.freeze({ europa: 'order', ganymede: 'order', callisto: 'order', titan: 'order', triton: 'order', uranus: 'order', neptune: 'order' }),
    k2QSens: Object.freeze([0.01, 100]),   // 代表の桁の値の感度の倍率
    // 恒星に対する自転の周期 [d](符号つき —— 負は逆行。太陽は本の値〔Carrington の恒星自転〕を使う —— 銀河の 1 口の式の A は本の太陽の自転から)
    //   水星・金星・月・イオは第329便a・地球と火星は第327便f・木星とガリレオ衛星は paper/data/jovian-satellites.csv・天王星・海王星・トリトン・タイタンは paper/data/solar-observations.csv の行と同じ値・
    //   土星は System III(10.656 h —— 文献の値)。同期の衛星の自転は公転と同じ値の宣言
    spinDays: Object.freeze({ sun: null, [MER]: 58.6462, venus: -243.025, earth: 0.99727, moon: 27.3217, mars: 1.02596, jupiter: 9.925 / 24, io: 1.769138, europa: 3.551181, ganymede: 7.154553,
      callisto: 16.689017, [SAT]: 10.656 / 24, titan: 1377686.7072 / DAY, uranus: -62064 / DAY, neptune: 57996 / DAY, triton: -507760.1856 / DAY }),
    // 公転の周期 [d](中心に対する恒星の周期 —— 正。逆行は本の二体の向きの符号で持つ)
    orbitDays: Object.freeze({ [MER]: 87.969, venus: 224.701, earth: 365.256, mars: 686.980, jupiter: 4332.59, [SAT]: 10759.22, uranus: 30685.4, neptune: 60189, moon: 27.3217, io: 1.769138,
      europa: 3.551181, ganymede: 7.154553, callisto: 16.689017, titan: 1377686.7072 / DAY, triton: 507760.1856 / DAY }),
    // J2 と参照の半径 [m](文献の値 —— 古典の歳差の定数と衛星の節の歳差の式に使う)
    J2: Object.freeze({ [MER]: 5.03e-5, venus: 4.458e-6, earth: 1.08263e-3, mars: 1.9566e-3, jupiter: 1.4696e-2, [SAT]: 1.6291e-2, uranus: 3.3434e-3, neptune: 3.4083e-3 }),
    J2Ref: Object.freeze({ [MER]: 2440.5e3, venus: 6051.8e3, earth: 6378.137e3, mars: 3396.2e3, jupiter: 71492e3, [SAT]: 60330e3, uranus: 25559e3, neptune: 25225e3 }),
    // 実際の自転軸の歳差の角速度 [″/年](文献の値 —— 地球は paper/data/solar-observations.csv の一般歳差 p = 5028.792″/世紀・火星と金星は測地の測定の値の桁・月は節の 18.61 年に従う
    //   カッシーニ状態・水星は軌道の歳差に従うカッシーニ状態〔約 3e5 年の桁〕)。衛星(月の他)は親の J2 の節の歳差の式・巨大惑星と太陽は宣言しない(式の行は太陽だけの古典の定数 —— 下限の目安)
    precessionArcsecPerYear: Object.freeze({ earth: 50.28792, mars: 7.594, venus: 44.58, moon: 360 * 3600 / 18.6130, [MER]: 360 * 3600 / 3e5 }),
    precessionRole: Object.freeze({ earth: 'lit', mars: 'lit', venus: 'lit', moon: 'lit', [MER]: 'order' }),
    // 観測の熱流 [W](文献の値 —— 地球の表面の熱流・木星と土星の内部の熱の放射の超過・イオの熱の放射。金星は不明 —— null。他は宣言しない —— null)
    heatFlowW: Object.freeze({ earth: 4.7e13, jupiter: 3.35e17, io: 1.0e14, [SAT]: 8.6e16, venus: null }),
    // 水星の近点の移動の 1PN の寄与(paper/data/solar-observations.csv の行 —— Park ら 2017 の Gravitoelectric の行と同じ値 [deg/年])
    mercuryPeriGRDegPerYear: 0.000119388611111111,
  }),
  // 金星の熱潮汐(駆動の口 —— 比べる列): 一定の位相の型・振幅は第327便f の文献の範囲 ε(N_0 = c_lat (M_☉/M)(R⁶/a³) ε p_s)
  venusThermal: Object.freeze({ form: 'constPhase', epsKeys: Object.freeze(['none', 'lo', 'hi']) }),
  // 歳差の窓(アプリの典型の時間 —— 本 🗺️ の観測カード「公称 120 步/秒でイオ 1 公転 12 s・地球 1 年 41 分」)と要る角の精度(ĝ·â が 1% 動く角 —— 宣言)
  windows: Object.freeze([
    Object.freeze({ key: 'ioOrbit', ja: 'イオ 1 公転(本の刻みの基準 —— 公称 12 s)', seconds: 1.769138 * DAY }),
    Object.freeze({ key: 'earthYear', ja: '地球 1 年(公称 41 分)', seconds: 365.256 * DAY }),
    Object.freeze({ key: 'decade', ja: '10 年(公称 7 時間弱 —— 長い走行の目安)', seconds: 10 * 365.256 * DAY }),
  ]),
  precisionRel: 0.01,
  ledgerTol: 1e-12,
  notClaim: Object.freeze(['3 分類は宣言の作業仮説 —— 表の値で分類を書き換えない', '金星の釣り合いは列の値(仮説の否定とも肯定とも書かない)', '内部熱は宣言した範囲の収支(観測の熱流との比は別の欄)',
    '測地の歳差はトルクではない(自転の釣り合いへ足さない)', '歳差の窓は表の角(無視してよいことの確認ではない)', '負の Γ は採らない(0 に丸めない)']),
});

/* ───────── 分類と群 ───────── */
/** 天体の宣言の分類 */
export function classOf(key) {
  for (const [c, ks] of Object.entries(DECL.classes)) if (ks.includes(key)) return c;
  throw new RangeError('classOf: 天体 ' + key);
}
/** 由来の鍵 → 群(軸引きずり axial・潮汐 tide・偏り bias) */
export function groupOf(originKey) {
  if (originKey === 'gal' || originKey.indexOf('k1:') === 0) return 'axial';
  if (originKey.indexOf('solid:') === 0 || originKey.indexOf('thermal:') === 0) return 'tide';
  if (originKey.indexOf('res:') === 0) return 'bias';
  throw new RangeError('groupOf: 由来 ' + originKey);
}
/** 2 つの群の大きさから判定(0 と 0 は none・片方 0 はもう片方・比が 10^±band の内は mixed) */
export function verdictOf(axialMag, tideMag, band = DECL.mixedBandLog10) {
  if (!(fin(axialMag) && fin(tideMag) && axialMag >= 0 && tideMag >= 0)) throw new RangeError('verdictOf: 0 以上の有限の数');
  if (axialMag === 0 && tideMag === 0) return 'none';
  if (axialMag === 0) return 'tide';
  if (tideMag === 0) return 'axial';
  const r = Math.log10(axialMag / tideMag);
  return Math.abs(r) <= band ? 'mixed' : (r > 0 ? 'axial' : 'tide');
}
/**
 * 由来ごとの行(器が第327便f の evaluateAll から作る: {key, torqueAlong, heat, Gamma|null, nuAlong|null})の集計: 最大の由来(トルクの大きさ)・群の大きさ(Σ|N| —— 逆向きを打ち消さない)・
 * 重み(線形の受動の口 Γ の比 —— 駆動の口と偏りの口は重みを持たない)・重みの定常 Ω* = Σ w ν・判定(トルク・重み)と分類の期待の一致。
 */
export function classifyOrigins(origins, cls) {
  if (!Array.isArray(origins) || origins.some((q) => !q || typeof q.key !== 'string' || !fin(q.torqueAlong) || !fin(q.heat))) throw new RangeError('classifyOrigins: 由来の行');
  if (origins.some((q) => q.heat < 0)) throw new RangeError('classifyOrigins: 由来ごとの熱は 0 以上');
  const rows = origins.map((q) => ({ key: q.key, group: groupOf(q.key), torque: q.torqueAlong, abs: Math.abs(q.torqueAlong), heat: q.heat, Gamma: fin(q.Gamma) ? q.Gamma : null, nu: fin(q.nuAlong) ? q.nuAlong : null }));
  if (rows.some((r) => r.Gamma !== null && r.Gamma < 0)) throw new RangeError('classifyOrigins: 負の Γ は採らない');
  const mag = (g) => rows.filter((r) => r.group === g).reduce((s, r) => s + r.abs, 0), wsum = rows.reduce((s, r) => s + (r.Gamma !== null && r.group !== 'bias' ? r.Gamma : 0), 0);
  const gw = (g) => (wsum > 0 ? rows.filter((r) => r.group === g && r.Gamma !== null).reduce((s, r) => s + r.Gamma, 0) / wsum : 0);
  for (const r of rows) r.weight = r.Gamma !== null && r.group !== 'bias' && wsum > 0 ? r.Gamma / wsum : null;
  const maxT = rows.reduce((a, b) => (b.abs > a.abs ? b : a), rows[0]), withW = rows.filter((r) => r.weight !== null), maxW = withW.length ? withW.reduce((a, b) => (b.weight > a.weight ? b : a)) : null;
  const nuStar = wsum > 0 ? withW.reduce((s, r) => s + r.weight * r.nu, 0) : null;
  const axialMag = mag('axial'), tideMag = mag('tide'), vT = verdictOf(axialMag, tideMag), vW = verdictOf(gw('axial'), gw('tide')), exp = cls ? DECL.expected[cls] : null;
  return { rows, maxTorque: maxT && maxT.abs > 0 ? { key: maxT.key, group: maxT.group, torque: maxT.torque } : null, maxWeight: maxW ? { key: maxW.key, group: maxW.group, weight: maxW.weight } : null,
    axialMag, tideMag, axialWeight: gw('axial'), tideWeight: gw('tide'), sumTorque: rows.reduce((s, r) => s + r.torque, 0), heat: rows.reduce((s, r) => s + r.heat, 0), nuStar,
    verdictTorque: vT, verdictWeight: vW, expected: exp, matchTorque: exp ? vT === exp : null, matchWeight: exp ? vW === exp : null };
}
/** 代表の桁の k2/Q の天体で、重みの判定が入れ替わる潮汐の Γ の倍率(潮汐の重みの群を x 倍にしたとき verdictOf の答えが変わる最小の x —— 上と下。無ければ null) */
export function flipFactor(axialW, tideW, band = DECL.mixedBandLog10) {
  if (!(fin(axialW) && fin(tideW) && axialW >= 0 && tideW >= 0)) throw new RangeError('flipFactor: 入力');
  if (axialW === 0 || tideW === 0) return { up: null, down: null };
  const r = Math.log10(axialW / tideW);   // x 倍で r − log10 x
  const v0 = verdictOf(axialW, tideW, band);
  const edges = [r - band, r + band].map((e) => Math.pow(10, e));   // log10 x = r ∓ band が境
  const up = edges.filter((x) => x > 1).sort((a, b) => a - b)[0] || null, down = edges.filter((x) => x < 1).sort((a, b) => b - a)[0] || null;
  return { verdict: v0, up, down };
}

/* ───────── 1 つの A(銀河の 1 口・K1・潮汐の定常の目標)———————— */
/**
 * 線形の受動の口の定常 Ω* = Σ Γ ν/ΣΓ が観測の自転 s になる A(銀河の口の目標 ν_G = A f (ĝ·â) —— A に一次)。
 * 入力: s・f・gDotA・Ggal(銀河の口の Γ)・others [{Gamma, nu}](K1・潮汐の口)。他の口が無ければ A = s/(f ĝ·â)。
 */
export function requiredA({ s, f, gDotA, Ggal, others = [] }) {
  if (![s, f, gDotA, Ggal].every(fin) || !(Ggal > 0) || others.some((q) => !fin(q.Gamma) || !fin(q.nu) || q.Gamma < 0)) throw new RangeError('requiredA: 入力(Γ ≥ 0・銀河の口の Γ > 0)');
  const den = Ggal * f * gDotA;
  if (den === 0) return null;
  const Gs = Ggal + others.reduce((a, q) => a + q.Gamma, 0), num = s * Gs - others.reduce((a, q) => a + q.Gamma * q.nu, 0);
  return num / den;
}
/** 同じ口で、A を与えたときの定常の目標 Ω*(と観測の自転との比) */
export function steadyTarget({ A, f, gDotA, Ggal, others = [] }) {
  if (![A, f, gDotA, Ggal].every(fin) || Ggal < 0 || others.some((q) => !fin(q.Gamma) || !fin(q.nu) || q.Gamma < 0)) throw new RangeError('steadyTarget: 入力');
  const Gs = Ggal + others.reduce((a, q) => a + q.Gamma, 0);
  if (!(Gs > 0)) return null;
  return (Ggal * A * f * gDotA + others.reduce((a, q) => a + q.Gamma * q.nu, 0)) / Gs;
}
/** A の列の広がり(log10 の最大 − 最小 —— 符号が混ざれば null と符号の列) */
export function spreadOf(As) {
  const v = As.filter(fin);
  if (v.length < 2) return { spreadLog10: null, signs: v.map(Math.sign), sameSign: null };
  const sg = v.map(Math.sign), same = sg.every((x) => x === sg[0]);
  return { spreadLog10: same && v.every((x) => x !== 0) ? Math.log10(Math.max(...v.map(Math.abs)) / Math.min(...v.map(Math.abs))) : null, signs: sg, sameSign: same };
}

/* ───────── 金星の符号の表 ───────── */
/** 銀河の口と太陽の群(K1 + 固体の潮汐 + 熱潮汐)の符号と釣り合いの度合い(|合計|/max(|銀河|, |太陽の群|))・合計を 0 にする熱潮汐の振幅の倍率(熱潮汐の項に一次) */
export function balanceRow({ gal, sunK1, sunSolid, sunThermal = 0, thermalUnit = null }) {
  if (![gal, sunK1, sunSolid, sunThermal].every(fin)) throw new RangeError('balanceRow: 有限の数');
  const sunGroup = sunK1 + sunSolid + sunThermal, net = gal + sunGroup, sc = Math.max(Math.abs(gal), Math.abs(sunGroup));
  const sg = (x) => (x > 0 ? 1 : (x < 0 ? -1 : 0));
  // 熱潮汐の単位の振幅あたりのトルク thermalUnit(N_0 = 1 のときの軸の向きのトルク)で、合計を 0 にする N_0 = −(gal + sunK1 + sunSolid)/thermalUnit(0 以上だけ採る —— 負の振幅は駆動の口ではない)
  const n0Zero = fin(thermalUnit) && thermalUnit !== 0 ? -(gal + sunK1 + sunSolid) / thermalUnit : null;
  return { gal, sunK1, sunSolid, sunThermal, sunGroup, net, signGal: sg(gal), signSun: sg(sunGroup), opposite: sg(gal) * sg(sunGroup) < 0, balanceRel: sc > 0 ? Math.abs(net) / sc : null,
    n0Zero: n0Zero !== null && n0Zero >= 0 ? n0Zero : null, n0ZeroRejected: n0Zero !== null && n0Zero < 0 };
}

/* ───────── 内部熱の帳簿(第132報の定義)———————— */
/**
 * 帳簿の分け方(器が第327便f の evaluateAll の ledger と受け手の由来ごとの行 {key, torqueAlong, heat, supply, recvWork} から):
 *   受け手の熱 Q = Σ_α Q_α(由来ごと ≥ 0)= Q_軸引きずり(銀河・K1 —— 原仮定者の整理の「観測自転に対する重み付けされた軸引きずりによるトルクのトータル」の熱の読み)+ Q_潮汐 + Q_偏り(0)。
 *   受け手の収支: Σ_α 供給_α(銀河の中心の口座・K1 の源の自転の口座・軌道の仕事・日射・偏りの口の軌道の口座)= Σ_α 受け手の仕事_α(dE_spin/dt —— 軸を固定するので垂直の成分は仕事をしない)+ Q。
 *   系の収支(第327便f の ledger —— 源の天体の口〔例: 太陽の銀河の口の軸に垂直な滑りの熱〕と K1 の反作用を含む): 残差の相対 ≤ tol。
 * closed: 受け手と系の両方の収支が tol の内(宣言した範囲で収支が閉じた)/steady: 受け手の合トルクの相対 ≤ tol(観測の自転が定常)/obsRatio: Q/観測の熱流(文献の値 —— 無ければ null)。
 * 凝縮の口座は固定(短い計算では追わない —— 銀河の口の供給と二重に入れない)。
 */
export function heatLedger({ origins, ledger, along, alongScale, heatObs = null, tol = DECL.ledgerTol }) {
  if (!Array.isArray(origins) || !ledger || ![along, alongScale].every(fin)) throw new RangeError('heatLedger: 入力');
  if (origins.some((q) => !(q.heat >= 0) || !fin(q.supply) || !fin(q.recvWork))) throw new RangeError('heatLedger: 由来ごとの熱は 0 以上・供給と受け手の仕事は有限');
  const by = (g, f) => origins.filter((q) => groupOf(q.key) === g).reduce((s, q) => s + q[f], 0);
  const Qaxial = by('axial', 'heat'), Qtide = by('tide', 'heat'), Qbias = by('bias', 'heat'), Q = Qaxial + Qtide + Qbias;
  const pick = (pre) => origins.filter((q) => q.key === pre || q.key.indexOf(pre + ':') === 0).reduce((s, q) => s + q.supply, 0);
  const supply = { galaxyCenter: pick('gal'), k1SourceSpin: pick('k1'), orbitWork: pick('solid') + origins.filter((q) => q.key.indexOf('thermal:') === 0).reduce((s, q) => s + (fin(q.orbitWork) ? q.orbitWork : 0), 0),
    solar: origins.filter((q) => q.key.indexOf('thermal:') === 0).reduce((s, q) => s + (fin(q.solar) ? q.solar : 0), 0), biasOrbit: pick('res'), contraction: null };
  const supplyTotal = origins.reduce((s, q) => s + q.supply, 0), spinPower = origins.reduce((s, q) => s + q.recvWork, 0), resid = supplyTotal - spinPower - Q;
  const sc = Math.max(...origins.map((q) => Math.max(Math.abs(q.supply), Math.abs(q.recvWork), q.heat)), 1e-300), recvRel = Math.abs(resid) / sc;
  const sysRel = Math.max(ledger.residualRel, fin(ledger.LTotalRel) ? ledger.LTotalRel : 0, fin(ledger.portCloseMaxRel) ? ledger.portCloseMaxRel : 0);
  return { Qaxial, Qtide, Qbias, Q, supply, supplyTotal, spinPower, residual: resid, recvResidualRel: recvRel, systemResidualRel: sysRel, Qsystem: ledger.heat, QotherBodies: ledger.heat - Q,
    closed: recvRel <= tol && sysRel <= tol, steady: Math.abs(along) <= tol * Math.max(alongScale, 1e-300), alongRel: Math.abs(along) / Math.max(alongScale, 1e-300),
    heatObs: fin(heatObs) ? heatObs : null, obsRatio: fin(heatObs) && heatObs > 0 ? Q / heatObs : null, axialObsRatio: fin(heatObs) && heatObs > 0 ? Qaxial / heatObs : null,
    contraction: '固定の口座(短い計算では追わない —— 銀河の口の供給と二重に入れない)' };
}

/* ───────── 測地の歳差と近点の移動(文献の式)———————— */
/** 自転のベクトルの測地の歳差(de Sitter の型 —— 公転の平均)Ω_geo = (3/2) n GM/(c² a (1 − e²)) [rad/s] */
export function geodeticRate({ GM, a, e, n, c = C_SI }) {
  if (![GM, a, e, n, c].every(fin) || !(GM > 0 && a > 0 && c > 0) || !(e >= 0 && e < 1)) throw new RangeError('geodeticRate: 入力');
  return 1.5 * Math.abs(n) * GM / (c * c * a * (1 - e * e));
}
/** 近点の移動の 1PN の型 3 n GM/(c² a (1 − e²)) [rad/s](軌道の量 —— 自転の口と別) */
export function periRate1PN({ GM, a, e, n, c = C_SI }) { return 2 * geodeticRate({ GM, a, e, n, c }); }
/** 古典の歳差の定数(太陽だけ —— 衛星の系の寄与を含まない): α = (3/2)(n²/s)(J2/C̄)(1 − e²)^{−3/2}・Ω_prec = α cos ε [rad/s] */
export function precessionSolar({ n, e, s, J2, Cbar, obliqRad }) {
  if (![n, e, s, J2, Cbar, obliqRad].every(fin) || s === 0 || !(Cbar > 0) || !(e >= 0 && e < 1)) throw new RangeError('precessionSolar: 入力');
  return 1.5 * n * n / Math.abs(s) * (J2 / Cbar) * Math.pow(1 - e * e, -1.5) * Math.abs(Math.cos(obliqRad));
}
/** 衛星の軌道の節の歳差(親の J2 —— 一次の式)Ω_node = (3/2) n J2 (R_ref/a)² [rad/s](カッシーニ状態の衛星の軸はこの角速度で歳差する宣言) */
export function nodeRateJ2({ n, J2, Rref, a }) {
  if (![n, J2, Rref, a].every(fin) || !(a > 0 && Rref > 0)) throw new RangeError('nodeRateJ2: 入力');
  return 1.5 * Math.abs(n) * J2 * (Rref / a) * (Rref / a);
}

/* ───────── 歳差の窓 ───────── */
/** 窓の角: 位相 φ = |Ω| T・円錐の半角 ε の上の軸の変位 δ = 2 asin(sin ε sin(φ/2))(φ が 2π を超えると δ は 2ε で頭打ち —— 位相を別の列に) */
export function windowAngles({ rate, T, epsRad }) {
  if (![rate, T, epsRad].every(fin) || T < 0) throw new RangeError('windowAngles: 入力');
  const phi = Math.abs(rate) * T, half = Math.min(phi / 2, Math.PI / 2);
  return { phase: phi, displacement: 2 * Math.asin(Math.min(1, Math.abs(Math.sin(epsRad)) * Math.sin(half))) };
}
/** 要る角の精度(宣言): ĝ·â が rel × |ĝ·â| 動く最小の軸の回転(一次 —— 回転の向きの最悪)δ_req = rel |ĝ·â|/sin θ(θ = acos(ĝ·â)) */
export function requiredAngle(gDotA, rel = DECL.precisionRel) {
  if (!fin(gDotA) || Math.abs(gDotA) > 1 + 1e-12 || !(rel > 0)) throw new RangeError('requiredAngle: 入力');
  const st = Math.sqrt(Math.max(0, 1 - gDotA * gDotA));
  return st > 0 ? rel * Math.abs(gDotA) / st : null;
}
export const arcsecPerYear = (rate) => rate * YEAR / ARCSEC;
export const rateFromArcsecPerYear = (asy) => asy * ARCSEC / YEAR;

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const S = {};
  // ① 合トルク 0 でも熱 > 0(目標 +1 と −1・同じ Γ = 1・Ω = 0 —— 由来ごとの熱 2・合成の後に二乗すると 0)
  const o1 = [{ key: 'gal', torqueAlong: 1, heat: 1, Gamma: 1, nuAlong: 1 }, { key: 'solid:sun', torqueAlong: -1, heat: 1, Gamma: 1, nuAlong: -1 }], c1 = classifyOrigins(o1, 'partialLock');
  S.heat = { sumTorque: c1.sumTorque, heat: c1.heat, mergedHeat: c1.sumTorque * c1.sumTorque / 2, verdict: c1.verdictTorque, nuStar: c1.nuStar };
  // ② 重みの定常: Γ 3 の目標 2 と Γ 1 の目標 −2 → Ω* = 1
  const c2 = classifyOrigins([{ key: 'gal', torqueAlong: 3, heat: 3, Gamma: 3, nuAlong: 2 }, { key: 'k1:sun', torqueAlong: -3, heat: 9, Gamma: 1, nuAlong: -2 }], 'noLock');
  S.weight = { nuStar: c2.nuStar, axialWeight: c2.axialWeight, verdict: c2.verdictWeight, match: c2.matchWeight };
  // ③ 1 つの A: 銀河だけ A = s/(f ĝ·â)・口を足すと A は ΣΓ の比で変わり、その A の定常の目標は観測の自転に戻る
  const a1 = requiredA({ s: 2, f: 1, gDotA: -0.5, Ggal: 1 }), oth = [{ Gamma: 1, nu: 0.5 }], a2 = requiredA({ s: 2, f: 1, gDotA: -0.5, Ggal: 1, others: oth });
  S.singleA = { galOnly: a1, withOther: a2, back: steadyTarget({ A: a2, f: 1, gDotA: -0.5, Ggal: 1, others: oth }), spread: spreadOf([1e-6, 1e-3, 1e-5]).spreadLog10, mixed: spreadOf([1, -1]).sameSign };
  // ④ 判定と境(10^±1)
  S.verdict = { axial: verdictOf(100, 1), tide: verdictOf(1, 100), mixed: verdictOf(3, 1), none: verdictOf(0, 0), edge: verdictOf(10, 1), flip: flipFactor(1, 1e-3) };
  // ⑤ 金星の符号の表の型: 同符号・逆符号・熱潮汐の振幅の零点
  S.balance = { same: balanceRow({ gal: 1, sunK1: 0.1, sunSolid: 10 }).opposite, opp: balanceRow({ gal: 1, sunK1: 0.1, sunSolid: 10, sunThermal: -12 }).opposite,
    n0: balanceRow({ gal: 1, sunK1: 0.1, sunSolid: 10, sunThermal: 0, thermalUnit: -2 }).n0Zero };
  // ⑥ 測地の歳差: 水星(GM_☉・a・e・n の文献の桁)で約 21.5″/世紀・1PN の近点の移動は 2 倍
  const merc = { GM: 1.32712440018e20, a: 5.7909e10, e: 0.2056, n: 2 * Math.PI / (87.969 * DAY) }, g = geodeticRate(merc), p = periRate1PN(merc);
  S.geodetic = { arcsecPerCentury: arcsecPerYear(g) * 100, periArcsecPerCentury: arcsecPerYear(p) * 100, ratio: p / g };
  // ⑦ 古典の歳差の太陽の分: 地球(J2 1.08263e-3・C̄ 0.3307・ε 23.44°)で約 15.9″/年の桁
  S.precession = { earthSolarArcsecPerYear: arcsecPerYear(precessionSolar({ n: 2 * Math.PI / (365.256 * DAY), e: 0.0167, s: 7.2921150e-5, J2: 1.08263e-3, Cbar: 0.3307, obliqRad: 23.44 * Math.PI / 180 })),
    ioNodeYears: 2 * Math.PI / nodeRateJ2({ n: 2 * Math.PI / (1.769138 * DAY), J2: 1.4696e-2, Rref: 71492e3, a: 4.217e8 }) / YEAR };
  // ⑧ 窓の角: 小さい角で δ ≈ ε φ・φ = π で δ = 2ε・要る角の精度
  const w1 = windowAngles({ rate: 1e-9, T: 1e3, epsRad: 0.1 }), w2 = windowAngles({ rate: Math.PI, T: 1, epsRad: 0.1 });
  S.window = { small: w1.displacement / (Math.sin(0.1) * 1e-6), half: w2.displacement / 0.2, req: requiredAngle(0.5) };
  // ⑨ 入力の拒否
  const rej = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  S.reject = { negGamma: rej(() => classifyOrigins([{ key: 'gal', torqueAlong: 1, heat: 1, Gamma: -1, nuAlong: 0 }], 'noLock')), negHeat: rej(() => classifyOrigins([{ key: 'gal', torqueAlong: 1, heat: -1 }], 'noLock')),
    badOrigin: rej(() => groupOf('wind')), badClass: rej(() => classOf('pluto')), badA: rej(() => requiredA({ s: 1, f: 1, gDotA: 1, Ggal: 0 })), badGeo: rej(() => geodeticRate({ GM: 1, a: 1, e: 1, n: 1 })) };
  return S;
}
export function pureGates(S) {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
  return {
    heatPerOrigin: S.heat.sumTorque === 0 && S.heat.heat === 2 && S.heat.mergedHeat === 0 && S.heat.verdict === 'mixed' && S.heat.nuStar === 0,
    weightedSteady: near(S.weight.nuStar, 1) && near(S.weight.axialWeight, 1) && S.weight.verdict === 'axial' && S.weight.match === true,
    singleA: near(S.singleA.galOnly, -4) && near(S.singleA.withOther, -7) && near(S.singleA.back, 2) && near(S.singleA.spread, 3) && S.singleA.mixed === false,
    verdict: S.verdict.axial === 'axial' && S.verdict.tide === 'tide' && S.verdict.mixed === 'mixed' && S.verdict.none === 'none' && S.verdict.edge === 'mixed' && S.verdict.flip.down === null && near(S.verdict.flip.up, 100, 1e-9),
    balance: S.balance.same === false && S.balance.opp === true && near(S.balance.n0, 5.55),
    geodetic: S.geodetic.arcsecPerCentury > 21.3 && S.geodetic.arcsecPerCentury < 21.7 && near(S.geodetic.ratio, 2) && S.geodetic.periArcsecPerCentury > 42.6 && S.geodetic.periArcsecPerCentury < 43.4,
    precession: S.precession.earthSolarArcsecPerYear > 15 && S.precession.earthSolarArcsecPerYear < 17 && S.precession.ioNodeYears > 7 && S.precession.ioNodeYears < 8.5,
    window: near(S.window.small, 1, 1e-9) && near(S.window.half, 1, 1e-6) && near(S.window.req, 0.01 * 0.5 / Math.sqrt(0.75)),
    reject: Object.values(S.reject).every((v) => v === true),
  };
}

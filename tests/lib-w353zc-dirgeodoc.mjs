// 第353便zc(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R493):
// **正本 tests/out/dirgeo-353zc.json から PHYSICS〔第353便zc〕の表を作る文書の lib**
// (QA docs.dirgeo353zc が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353zc-dirgeodoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const d3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const d1 = (x) => (!fin(x) ? '—' : Number(x).toFixed(1));
const pc = (x) => (!fin(x) ? '—' : (100 * x).toFixed(1) + '%');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ', Callisto: 'カリスト', Titan: 'タイタン' });
const AX = Object.freeze({ L: 'L(主)', eq: 'eq(比べる列)', ecl: '黄道の極(比べる列)' });
const WAY = Object.freeze({ rule: '規則の半径', uni: '全部同じ c_R', star: 'r × c_R★(受け手ごと)', mass: 'C0 × 質量 ÷ 観測半径(C0 ÷ Y_K)' });
const nm = (k) => NM[k] || k;

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「金星で 1% まで打ち消す」を、金星の公転の法線が基準軸と太陽の自転軸を結ぶ弧の 1/3 の所(n★)の近くに在る、という配置の文に読み替え、8 惑星の法線の並びとして数える', '表 2・表 3']),
  Object.freeze(['向きの一致 2 sin(φ/2) は背景の大きさに依らない —— 向きの側だけを取り出し、太陽の自転軸の円錐の位相と公転面の交点を動かしたときに保たれるかを数える', '表 4〜表 6']),
  Object.freeze(['「見ている時間の間は変わらない」(C)に照らし、向きの一致が保たれる時間の長さを、太陽の円錐の周期(注目の列 0.98)と交点の周期のノブの格子で並べる', '表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 〔第353便t〕の表 2a と同じ(n★ からの角・閉じた形の φ の相対差の最大)・金星の n★ からの角・土星・金星の φ | ${fl9(Math.max(...S.rows.map((r) => Math.max(r.dN, r.dP))))}・${d3(S.venusToN)}°・${S.saturnToN.toFixed(2)}°・${S.venusPhi.toFixed(4)}° | ${tf(G.anchorT)} |`,
    `| ② 閉じた形と〔第353便t〕の dirMatch の数えた φ の差の最大(8 惑星) | ${fe(S.dNum)}° | ${tf(G.closedNum)} |`,
    `| ③ 1/3 の由来: 1 周の平均の数と閉じた形の重みの相対差・その向きと〔第352便h〕の (S) の向きの角・弧の上の厳密な点の割合 | ${fl9(S.avgRel)}・${fe(S.avgToSDir)}°・${S.fracExact.toFixed(4)} | ${tf(G.third)} |`,
    `| ④ 回さないときの φ = いまの φ・相対の位相の同値(太陽 +p と交点 −p)・b̂ との角をいまの値に置き替えたとき | ${fl9(S.p0)}・${fl9(S.rs)}・${fl9(S.pi)} | ${tf(G.phiAt)} |`,
    `| ⑤ 太陽の円錐の半頂角(位相 0・90・200°)・円錐の周期(u 0.98) | ${S.cone.map(d3).join('・')}°・${fe(S.Ps)} 年 | ${tf(G.cone)} |`,
    `| ⑥ 一律の c_R 0.0128 で受け手ごとの順位 = 〔第353便t〕の rankAll・衛星の道 w 0・1 = 〔第353便t〕の赤道の円・公転面の円(ベクトルの相対差) | ${tf(S.dRank)}・${fl9(S.dW)} | ${tf(G.rankPer)} |`,
    `| ⑦ c_R★: イオの二分 = 閉じた形(相対差) | ${fl9(S.dStarIo)} | ${tf(G.cRStar)} |`,
    `| ⑧ 変異(重み 3/2・1/2 を 1・1 に —— φ が動く・n★ を 1/2 の所に —— 角が動く)・拒否 9 | ${tf(S.mW)}・${tf(S.mHalf)}・${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.mutants)} |`].join('\n');
  T.t1 = ['| 基準軸 | 惑星 | 弧の上の位置 t(0 = 基準軸・1 = 太陽の自転軸) | 横のずれ ° | 法線と基準軸 ° | n★ からの角 ° | φ ° | 2 sin(φ/2) | φ ÷ n★ からの角 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t1.flatMap((a) => a.rows.map((r) => `| ${AX[a.axis]} | ${nm(r.key)} | ${d3(r.t)} | ${d3(r.sideDeg)} | ${d3(r.nToB)} | ${d3(r.toNstarDeg)} | ${d3(r.phiDeg)} | ${f3(r.own)} | ${d3(r.ratio)} |`))].join('\n');
  T.t1b = ['| 基準軸 | 基準軸と太陽の自転軸 ° | 法線の重み ÷ 自転軸の重み の逆(1/2 ÷ 3/2) | 傾き 3/2 ÷ (3/2 − 1/2) | 弧の上で φ が 0 の点の割合(厳密) | 弦の形の n★ と厳密な点の角 ° | 平均の数と閉じた形の相対差 |', '|---|---|---|---|---|---|---|',
    ...J.t1b.map((r) => `| ${AX[r.axis]} | ${d3(r.arcDeg)} | ${r.wRatio.toFixed(4)} | ${r.slope.toFixed(2)} | ${r.fracExact.toFixed(4)} | ${fe(r.chordToExact)} | ${fl9(r.avgRel)} |`)].join('\n');
  T.t2 = ['| 基準軸 | 惑星 | いまの φ ° | 1 周の最小 ° | 最大 ° | 最小の位相 ° | いまの百分位(φ がいまより小さい位相の割合) | 8 惑星で 1 番の位相の割合 |', '|---|---|---|---|---|---|---|---|',
    ...J.t2.flatMap((a) => a.rows.map((r) => `| ${AX[a.axis]} | ${nm(r.id)} | ${d3(r.phi0)} | ${d3(r.min)} | ${d3(r.max)} | ${d1(r.argMin)} | ${pc(r.pct)} | ${pc(r.firstFrac)} |`))].join('\n');
  T.t3 = ['| 基準軸 | 惑星 | いまの φ ° | 交点 1 周の最小 ° | 最大 ° | 最小の交点(いまから)° | いまの百分位 | φ ≤ 2 × いまの交点の割合 | いまを含む窓(いまから)° | 8 惑星で 1 番の交点の割合(ほかは固定) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...[...J.t3.nodes, J.t3.nodeEq].map((r) => `| ${AX[r.axis]} | ${nm(r.id)} | ${d3(r.phi0)} | ${d3(r.min)} | ${d3(r.max)} | ${d1(r.argMin)} | ${pc(r.pct)} | ${pc(r.fracLe)} | ${d1(r.winLo)}〜${d1(r.winHi)} | ${pc(r.firstFrac)} |`)].join('\n');
  T.t3time = ['| 動くもの | 交点の周期(年 —— ノブ・未照合) | 交点の向き(ノブ) | 相対の位相の周期(年) | 金星の φ ≤ 2 × いまで在る時間(年) | いまから窓を出るまで(年) |', '|---|---|---|---|---|---|',
    ...J.t3.time.map((r) => `| ${r.case === 'sunOnly' ? '太陽の円錐だけ(公転面は固定)' : '太陽の円錐 + 交点'} | ${r.Pnode === null ? '—' : fe(r.Pnode)} | ${r.sense === null ? '—' : r.sense > 0 ? '+(b̂ のまわりに右ねじ)' : '−'} | ${fe(r.relYr)} | ${fe(r.inWinYr)} | ${fe(r.toExitYr)} |`)].join('\n');
  const C = J.t3b;
  T.t3b = ['| 惑星 | 法線と基準軸 L ° | 交点 1 周での n★ からの角の最小 ° | n★ から金星のいまの角以内に来る交点の割合 |', '|---|---|---|---|',
    ...C.rows.map((r) => `| ${nm(r.id)} | ${d3(r.incDeg)} | ${d3(r.minToNstar)} | ${pc(r.frac)} |`),
    ...C.caps.map((c) => `| 帽子の見本(半径 ${c.capDeg}° に一様 —— ノブ) | — | 1 本が入る見込み ${pc(c.p1)} | 8 本のどれかが入る見込み ${pc(c.pAny8)} |`)].join('\n');
  T.t4 = ['| 置き方 | ノブ | 金星の c_R | 金星の 2 sin(φ/2) | 金星の順位(14) | 1 番と値 | 2 番と値 |', '|---|---|---|---|---|---|---|',
    ...J.t4.rows.map((r) => `| ${WAY[r.way]} | ${r.knob === null ? '—' : f3(r.knob)} | ${r.cRVenus === null ? '—' : fe(r.cRVenus)} | ${f3(r.venusOwn)} | ${r.venusRank} | ${nm(r.first)} ${f3(r.firstOwn)} | ${nm(r.second)} ${f3(r.secondOwn)} |`)].join('\n');
  const Ed = J.t4.edges;
  T.t4edge = ['| 置き方 | 金星が 1 番を保つ端(ノブ) | そこで 1 番になる受け手 |', '|---|---|---|', ...['uni', 'star', 'mass'].map((k) => `| ${WAY[k]} | ${f3(Ed[k].at)} | ${nm(Ed[k].next)} |`)].join('\n');
  T.t4b = ['| 衛星の道の面 w(0 = 母天体の赤道面・1 = 母天体の公転面) | 金星の順位(14) | 1 番と値 | 衛星で一番小さい受け手と値 | 金星以外の一番小さい値 ÷ 金星 |', '|---|---|---|---|---|',
    ...J.t4b.map((r) => `| ${r.w} | ${r.venusRank} | ${nm(r.first)} ${f3(r.firstOwn)} | ${nm(r.bestMoon)} ${f3(r.bestMoonOwn)} | ${f3(r.margin)} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, L = J.t1.find((a) => a.axis === 'L').rows, v = L.find((r) => r.key === 'Venus'), b1 = J.t1b.find((r) => r.axis === 'L');
  const near = L.filter((r) => r.t > 0.2 && r.t < 0.5).map((r) => nm(r.key));
  F.t1 = `- 基準軸 L では、金星の公転の法線は弧の上の位置 ${d3(v.t)}(1/3 の近く)・横のずれ ${d3(v.sideDeg)}°・n★ から ${d3(v.toNstarDeg)}°。弧の上の位置が 0.2〜0.5 に在る惑星は ${near.join('・')} だけ(ほかは 0 の近くか水星の ${d3(L.find((r) => r.key === 'Mercury').t)})。1/3 は、公転の 1 周で平均した (S) の項の重み(法線の成分 3/2・自転軸の成分 1/2)の比で、弧の上で φ が 0 になる厳密な点は ${b1.fracExact.toFixed(4)}(L)—— 平均の数と閉じた形は相対 ${fl9(b1.avgRel)} で同じ。φ ÷ n★ からの角は 8 惑星で ${d3(Math.min(...L.map((r) => r.ratio)))}〜${d3(Math.max(...L.map((r) => r.ratio)))}(傾き 3/2 ÷ (3/2 − 1/2) = 1.5)。`;
  const a2 = J.t2.find((a) => a.axis === 'L'), V2 = a2.rows.find((r) => r.id === 'Venus'), e2 = J.t2.find((a) => a.axis === 'eq').rows.find((r) => r.id === 'Venus');
  const oth = a2.rows.filter((r) => r.id !== 'Venus' && r.firstFrac > 0).map((r) => nm(r.id) + ' ' + pc(r.firstFrac)).join('・');
  F.t2 = `- 太陽の自転軸を円錐(L のまわり・半頂角 ${d3(J.pure.scenes.cone[0])}°)の上で 1 周回すと(公転面は固定)、金星の φ は ${d3(V2.min)}〜${d3(V2.max)}° を動く。いまの位相の φ(${d3(V2.phi0)}°)より小さい位相は ${pc(V2.pct)}(百分位 —— 1 周の中で小さい側の端の近く)。金星が 8 惑星で 1 番の位相は ${pc(V2.firstFrac)} で、ほかの位相では ${oth} が 1 番になる。eq では金星の百分位 ${pc(e2.pct)}・1 番の位相 ${pc(e2.firstFrac)}。円錐の周期は注目の列 0.98 で ${fe(J.t3.sunPeriodYr)} 年。`;
  const n3 = J.t3.nodes.find((r) => r.id === 'Venus'), tS = J.t3.time.find((r) => r.case === 'sunOnly'), tn = J.t3.time.filter((r) => r.case === 'node');
  const inMin = Math.min(...tn.map((r) => r.inWinYr)), inMax = Math.max(...tn.map((r) => r.inWinYr));
  F.t3 = `- φ は太陽の位相と交点の差(相対の位相)だけで決まる(同値の相対差 ${fl9(J.t3.relSame)})。金星の交点を L のまわりに 1 周回すと(L との角 ${d3(v.nToB)}° を保つ)、φ は ${d3(n3.min)}〜${d3(n3.max)}°・いまの百分位 ${pc(n3.pct)}・φ がいまの 2 倍以下の交点は ${pc(n3.fracLe)}(いまを含む窓 ${d1(n3.winLo)}〜${d1(n3.winHi)}°)—— 「いまの配置が 1 周の中でどれだけ特別か」の 1 つの数は ${pc(n3.pct)}。時間に直すと、太陽の円錐だけが回るとき窓に居る時間は ${fe(tS.inWinYr)} 年(いまから出るまで ${fe(tS.toExitYr)} 年)・交点の周期をノブの格子 ${fe(J.decl.nodePeriodsYr[0])}〜${fe(J.decl.nodePeriodsYr[J.decl.nodePeriodsYr.length - 1])} 年で振ると ${fe(inMin)}〜${fe(inMax)} 年(交点の周期と向きは未照合 —— DFM の式ではない比べる列)。`;
  const C = J.t3b, can = C.rows.filter((r) => r.frac > 0).map((r) => nm(r.id) + ' ' + pc(r.frac)).join('・');
  F.t3b = `- n★ は L から ${d3(C.nStarToB)}° の所に在る。b̂ との角を保って交点を回したとき、法線が n★ から金星のいまの角(${d3(C.dVenus)}°)以内に来ることが在る惑星は ${can}(ほかは b̂ との角が n★ までの角から離れていて届かない)。法線が半径 ${C.caps.map((c) => c.capDeg + '°').join('・')} の帽子に一様に散らばる見本(ノブ)では、1 本が入る見込み ${C.caps.map((c) => pc(c.p1)).join('・')}・8 本のどれかが入る見込み ${C.caps.map((c) => pc(c.pAny8)).join('・')}。`;
  const E4 = J.t4.edges, w = J.t4b, lose = w.filter((r) => r.venusRank !== 1);
  F.t4 = `- 受け手の半径の置き方で金星が 1 番を保つ端: 全部同じ c_R で ${f3(E4.uni.at)}(次は${nm(E4.uni.next)} —— 〔第353便t〕の上端と同じ桁)・r × c_R★ で r ${f3(E4.star.at)}(次は${nm(E4.star.next)})・C0 × 質量 ÷ 観測半径で C0 ÷ Y_K ${fe(E4.mass.at)}(次は${nm(E4.mass.next)})。衛星の道の面を母天体の赤道面(w 0)から公転面(w 1)へ振ると、w ${lose.length ? lose.map((r) => r.w).join('・') : '—'} で衛星が金星より小さくなる(一番小さいのは w ${lose.length ? lose.reduce((m, r) => (r.firstOwn < m.firstOwn ? r : m)).w : '—'} の${lose.length ? nm(lose.reduce((m, r) => (r.firstOwn < m.firstOwn ? r : m)).first) + ' ' + f3(lose.reduce((m, r) => (r.firstOwn < m.firstOwn ? r : m)).firstOwn) : '—'})—— 母天体の赤道面と公転面の途中に衛星の φ が小さくなる道の面が在り、14 の受け手の順位は衛星の道の面の置き方で入れ替わる(道の面のいまの置き方はリポジトリの組と円の道の近似 —— 未照合)。`;
  return F;
}

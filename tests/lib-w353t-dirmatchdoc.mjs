// 第353便t(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R484):
// **正本 tests/out/dirmatch-353t.json から PHYSICS〔第353便t〕の表を作る文書の lib**
// (QA docs.dirmatch353t が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353t-dirmatchdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const f4 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(4));
const d3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ', Callisto: 'カリスト', Titan: 'タイタン' });
const AX = Object.freeze({ L: 'L(主)', eq: 'eq(比べる列)', ecl: '黄道の極(比べる列)' });
const RCV = Object.freeze({ rule: '規則の半径', 'f1e-3': '(P-場) c_R 1e-3', 'f0.0128': '(P-場) c_R 0.0128', f1: '(P-場) c_R 1', resp: '(P-応)' });
const SRC = Object.freeze({ 0: '規則の半径(主)', 1: '観測の半径(比べる列)' });
const PART = Object.freeze({ S: '(S) 源の自転の分(主の列)', M: '(M) 相対の運動の分(比べる列)', MS: '(MS) 両方(比べる列)' });
const BG = Object.freeze({ Np: '(N+)(主)', Nm: '(N−)(比べる列)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。逆回転は地球の影響であり、「金星は、自転に地球の影響が出るほどに釣り合っている」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「金星で釣り合う」を選び出す量の候補として、大きさの一致((uV) —— 金星から作った倍率)と並べて、背景の大きさに依らない向きの一致 2 sin(φ/2)(局所の (S) の逆向きと基準軸のなす角 φ)の順位を数える', '表 3〜表 5'],),
  Object.freeze(['向きの一致と大きさの一致を別々の量として表に置く —— 本節は向きの側だけを数え、大きさは〔第353便l〕の (L2) と並べる', '表 3・表 6'],),
  Object.freeze(['背景の向きは (N+) 太陽系の基準軸の向き(主の列 —— 基準軸 L)。eq・黄道の極は比べる列として同じ表に並べる', '表 3・表 8'],),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 第353便l の 14 の受け手の own・φ と同じ(相対差の最大)・金星 own・土星 own・金星の順位・土星の順位・金星の φ | ${fl9(Math.max(...S.rows.map((r) => Math.max(r.dOwn, r.dPhi))))}・${S.venusOwn.toFixed(6)}・${f3(S.saturnOwn)}・${S.venusRank}・${S.saturnRank}・${d3(S.venusPhi)}° | ${tf(G.anchorL)} |`,
    `| ② 受け手の半径 (P-場) c_R 1e-3・1e-2・1 の金星 own(第353便c の cancelOf と同じ・統括の数え直し 3)・(P-応) は規則の半径と同じ | ${S.cRrows.map((r) => r.own.toFixed(6)).join('・')}・${tf(S.respSame)} | ${tf(G.recvRadius)} |`,
    `| ③ 源の扁平 (O2b): 金星・イオの φ = 第353便d の obCancel・イオ c_R 0.0128 と月 c_R 1e-3 の局所 = 第353便p の localStd(相対差) | ${fl9(S.dObV)}・${fl9(S.dObI)}・${fl9(S.dPI)}・${fl9(S.dPM)} | ${tf(G.srcOblate)} |`,
    `| ④ 円の道の衛星(規則の半径・球)= 第353便l の localOf(相対差の最大) | ${fl9(S.dCirc)} | ${tf(G.circMoon)} |`,
    `| ⑤ 基準軸 L の成分・eq との角(統括の数え直し 3) | (${S.Lvec.map((c) => c.toFixed(6)).join(', ')})・${S.eqDeg.toFixed(4)}° | ${tf(G.axisL)} |`,
    `| ⑥ 閉じた形と数えた φ の差の最大(8 惑星)・金星の (M) ÷ (S)・(M) と公転の法線の cos | ${fe(S.gmax)}°・${fe(S.mOverS)}・${S.mCosN.toFixed(4)} | ${tf(G.closed)} |`,
    `| ⑦ 変異(−局所 を +局所 に —— 打ち消さない・閉じた形の 3 を 1 に —— φ が動く) | ${tf(S.mFlip)}・${tf(S.mClosed)} | ${tf(G.mutants)} |`,
    `| ⑧ 拒否(受け手の名・基準軸の名・成分の名・源の半径 0.5・c_R なしの (P-場)・扁平の名・衛星の置き方の名・背景の向きの名・半径 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 1a を 30 行に(扁平 2 × 衛星の置き方 3 の 6 組をまとめる)
  const D = J.decl, rows = [];
  for (const axis of D.axes) for (const tSrc of D.tSrcs) for (const rc of D.recvCols) {
    const g = J.t1a.filter((r) => r.axis === axis && r.tSrc === tSrc && r.recv === rc.id), rk = g.map((r) => r.venusRank);
    const bo = g.reduce((m, r) => { const k = r.first === 'Venus' ? r.second : r.first, o = r.first === 'Venus' ? r.secondOwn : r.firstOwn; return m === null || o < m.own ? { key: k, own: o } : m; }, null);
    rows.push(`| ${AX[axis]} | ${SRC[tSrc]} | ${RCV[rc.id]} | ${f3(g[0].venusOwn)} | ${Math.min(...rk) === Math.max(...rk) ? rk[0] : Math.min(...rk) + '〜' + Math.max(...rk)} | ${g.filter((r) => r.venusRank === 1).length}/${g.length} | ${NM[bo.key]} ${f3(bo.own)} | ${f3(Math.min(...g.map((r) => r.margin)))} |`);
  }
  T.t1a = ['| 基準軸 | 源の半径 | 受け手の半径 | 金星の own | 金星の順位(扁平 2 × 衛星の置き方 3 の 6 組) | 金星が 1 番の組 | 金星を除いて一番小さい受け手と own(6 組の最小) | 金星を除いた一番小さい own ÷ 金星の own(6 組の最小) |', '|---|---|---|---|---|---|---|---|', ...rows].join('\n');
  const SU = J.t1sum;
  T.t1sum = ['| 受け手の半径の列 | 金星が 1 番の組 | 入れ替わる組 |', '|---|---|---|', ...D.recvCols.map((c) => `| ${RCV[c.id]} | ${SU.byRecv[c.id].keep} | ${SU.byRecv[c.id].lose} |`),
    `| 計 | ${SU.keep}/${SU.n} | ${SU.lose}/${SU.n}(金星の順位 ${SU.loseRanks.join('・')}・1 番は ${SU.loseFirst.map((k) => NM[k]).join('・')}) |`].join('\n');
  const C = [['rule', '規則'], ['f1e-3', 'c_R 1e-3'], ['f0.0128', 'c_R 0.0128'], ['f1', 'c_R 1'], ['mEq', '衛星 赤道の円'], ['mOrb', '衛星 公転面の円'], ['O2b', '源 (O2b)']];
  T.t1b = ['| 受け手 | φ(規則)° | ' + C.map(([, n]) => 'own・順位: ' + n).join(' | ') + ' |', '|' + '---|'.repeat(2 + C.length),
    ...J.t1b.map((r) => `| ${NM[r.key]} | ${d3(r.phi_rule)} | ${C.map(([id]) => f3(r['own_' + id]) + '・' + r['rank_' + id]).join(' | ')} |`)].join('\n');
  T.t1c = ['| 基準軸 | 源の半径 | 金星が 1 番を保つ c_R の上端((P-場)) | そこで 1 番になる受け手 |', '|---|---|---|---|', ...J.t1c.map((r) => `| ${AX[r.axis]} | ${SRC[r.tSrc]} | ${f3(r.cRcross)} | ${NM[r.next]} |`)].join('\n');
  T.t2a = ['| 惑星 | 数えた φ ° | 閉じた形 ∠(3(ŝ☉·n̂)n̂ − ŝ☉, L) ° | 小さい角の形 ° | 太陽の自転軸と L ° | 公転の法線と L ° | 公転の法線と太陽の自転軸 ° | 公転の法線と n★ ° | 閉じた形 ÷ n★ からの角 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t2a.map((r) => `| ${NM[r.id]} | ${d3(r.phiNum)} | ${d3(r.phiClosed)} | ${d3(r.phiSmall)} | ${d3(r.sunToB)} | ${d3(r.nToB)} | ${d3(r.nToSun)} | ${d3(r.toNstar)} | ${d3(r.ratio)} |`)].join('\n');
  T.t2b = ['| 基準軸 | いまの φ ° | ' + D.tiltDeg.map((t) => '法線を ' + t + '° 回す: φ の最小〜最大 °').join(' | ') + ' | φ が 0 の法線 n★ までの角 ° | そこでの φ ° | φ の傾き °/° | n★ と基準軸 ° | 基準軸のまわりに回す: φ が最小の ψ ° | そこでの φ ° |', '|' + '---|'.repeat(8 + D.tiltDeg.length),
    ...J.t2b.map((r) => `| ${AX[r.axis]} | ${d3(r.tilt.phi0)} | ${r.tilt.rows.map((q) => d3(q.min) + '〜' + d3(q.max)).join(' | ')} | ${d3(r.tilt.nStarDeg)} | ${fe(r.tilt.phiMin)} | ${d3(r.tilt.gradDegPerDeg)} | ${d3(r.tilt.nStarToB)} | ${d3(r.turn.psiMin)} | ${d3(r.turn.phiMin)} |`)].join('\n');
  T.t2c = ['| 基準軸の定義 | 金星の φ ° | 金星の own | 軸と L の角 ° |', '|---|---|---|---|', ...J.t2c.map((r) => `| ${r.note} | ${f4(r.phiDeg)} | ${f4(r.own)} | ${d3(r.toL)} |`)].join('\n');
  T.t3 = ['| 成分 | 背景の向き | 金星の φ ° | 金星の own | 金星の順位 | 1 番の受け手と own | 2 番の受け手と own | (uV) のままの金星の (L2) |', '|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${PART[r.part]} | ${BG[r.bg]} | ${d3(r.venusPhi)} | ${f4(r.venusOwn)} | ${r.venusRank} | ${NM[r.first]} ${f3(r.firstOwn)} | ${NM[r.second]} ${f3(r.secondOwn)} | ${fe(r.L2uV)} |`)].join('\n');
  T.t3b = ['| 惑星 | (MS) と (N−) の φ ° | 公転の法線と L ° |', '|---|---|---|', ...J.t3b.map((r) => `| ${NM[r.id]} | ${d3(r.phiNm)} | ${d3(r.nToB)} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, SU = J.t1sum, mm = SU.minMargin, c = (a, t) => J.t1c.find((r) => r.axis === a && r.tSrc === t);
  F.t1 = `- 置き方の組 ${SU.n}(基準軸 3 × 源の半径 2 × 受け手の半径 5 × 源の扁平 2 × 衛星の置き方 3)のうち、金星が 2 sin(φ/2) で 1 番の組は ${SU.keep}・入れ替わる組は ${SU.lose}。入れ替わるのは全部、受け手の半径を (P-場) c_R 1(観測半径そのまま)に置いた組(金星の順位 ${SU.loseRanks.join('・')})。金星が 1 番を保つ c_R の上端は L で ${f3(c('L', 0).cRcross)}(次は${NM[c('L', 0).next]})・eq で ${f3(c('eq', 0).cRcross)}・黄道の極で ${f3(c('ecl', 0).cRcross)} —— 〔第353便c〕の金星の cR★ 0.0657 より下。源の半径(規則・観測)・源の扁平 (O2b)・(P-応) は金星の φ を動かさない(球のモーメントの形では向きは源の半径に依らない)。2 番との開きが一番狭いのは${AX[mm.axis]}・${RCV[mm.recv]} の組(${NM[mm.other]} が金星の ${f3(mm.margin)} 倍)。`;
  const v = J.t2a.find((r) => r.id === 'Venus'), sa = J.t2a.find((r) => r.id === 'Saturn'), rs = J.t2a.map((r) => r.ratio), tb = J.t2b.find((r) => r.axis === 'L'), te = J.t2b.find((r) => r.axis === 'eq');
  const eq = J.t2c.find((r) => r.name === 'eq'), nv = J.t2c.find((r) => r.name === 'LnoV'), dv = J.t2c.find((r) => r.name === 'L2V'), mx = J.t2c.filter((r) => /^mix/.test(r.name)).reduce((m, r) => (m === null || r.phiDeg < m.phiDeg ? r : m), null);
  F.t2 = `- φ は閉じた形 ∠(3(ŝ☉·n̂)n̂ − ŝ☉, L)(〔第352便h〕の (S) の向き)と ${fe(J.pure.scenes.gmax)}° の内で同じ。小さい角では φ ≈ 1.5 × ∠(n̂, n̂★)・n̂★ = L から太陽の自転軸の向きへ 1/3 の所(L と ${d3(tb.tilt.nStarToB)}°)—— 8 惑星で比 ${d3(Math.min(...rs))}〜${d3(Math.max(...rs))}。金星の公転の法線は n̂★ から ${d3(v.toNstar)}°(次は土星 ${d3(sa.toNstar)}°)。法線を n̂★ の向きに ${d3(tb.tilt.nStarDeg)}° 回すと φ は 0 —— いまの金星の φ は最小(0)そのものではない。基準軸 L のまわりに回す動かし方(〔第352便n〕の turnRow の型)では、φ が最小の向きはいまから ${d3(tb.turn.psiMin)}°(φ ${d3(tb.turn.phiMin)}°)・eq では ${d3(te.turn.psiMin)}°(〔第352便n〕の「最小から 4〜13°」と同じ桁)。基準軸の定義: eq では金星の φ ${f4(eq.phiDeg)}°(own ${f4(eq.own)} —— L の ${f4(J.t2c[0].phiDeg)}° より小さい)・L と eq の間で最小 ${f4(mx.phiDeg)}°(${mx.note})。L の金星の重みを外すと ${f4(nv.phiDeg)}°・2 倍で ${f4(dv.phiDeg)}° —— 角運動量の重みの金星の分が金星の φ を小さくする向きの効きは 0.001° の桁。`;
  const s = J.t3.find((r) => r.part === 'S' && r.bg === 'Np'), ms = J.t3.find((r) => r.part === 'MS' && r.bg === 'Np'), mn = J.t3.find((r) => r.part === 'MS' && r.bg === 'Nm');
  F.t3 = `- 局所の成分を (MS)(比べる列)に替えると、金星の局所は (S) の ${fe(J.partGeom.mOverS)} 倍・向きは公転の法線(cos ${J.partGeom.M.cosN.toFixed(4)})。背景 (N+) とは同じ向きに近く(φ ${d3(ms.venusPhi)}°)、等大の残りは ${f4(ms.venusOwn)}(打ち消さない —— 主の列の ${f4(s.venusOwn)} に対して)・(uV) のままでは (L2) ${fe(ms.L2uV)}。順位は金星 ${ms.venusRank} 番(14 の受け手がどれも 2 の近く —— 選び出さない)。背景を (N−)(比べる列)に置くと (MS) は打ち消す向きになり、φ = 公転の法線と L の角(金星 ${d3(J.t3b.find((r) => r.id === 'Venus').phiNm)}°)—— 1 番は${NM[mn.first]}(${f3(mn.firstOwn)})・金星は ${mn.venusRank} 番。(MS) では向きの一致は公転面の傾きの順になり、金星を選び出さない。(M) と (MS) の順位は同じ。`;
  return F;
}

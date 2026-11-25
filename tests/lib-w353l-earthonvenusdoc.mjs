// 第353便l(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R476):
// **正本 tests/out/earthonvenus-353l.json から PHYSICS〔第353便l〕の表を作る文書の lib**
// (QA docs.earthonvenus353l が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353l-earthonvenusdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const f4 = (x) => (!fin(x) ? '—' : Number(x).toFixed(4));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ', Callisto: 'カリスト', Titan: 'タイタン' });
const KIND = Object.freeze({ sun: '太陽由来', pair: '太陽由来 + 母天体由来(リポジトリの組)', circ: '太陽由来 + 母天体由来(赤道の円の道)' });
const SRC = Object.freeze({ rule: '主(地球・太陽とも規則の半径)', Eobs: '地球だけ観測の半径(比べる列)', obs: '地球・太陽とも観測の半径(比べる列)' });
const PROV = '(仮)';

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。逆回転は地球の影響であり、「金星は、自転に地球の影響が出るほどに釣り合っている」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「地球の影響が出るほどに」を、地球を源にした金星への項 ÷ 金星の残り(主の列の (S) と背景 (N+) の合成)で読み、DFM の側の置き方の中に 1 に届く所が在るかを走査する。「釣り合っている」は (L2) 軸の拘束(残り ÷ 背景)で読み、全部の受け手で金星を選び出すかを数える', '表 2〜表 6']),
  Object.freeze(['走査の軸: 引きずる側(地球と太陽)の半径は規則の半径が基準・観測の半径は比べる列。引きずられる側(金星)の半径は観測半径 × 構造の係数(c_R)を、第353便c の入れ方 (P-場)・(P-応) で振る', '表 2']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 第353便g の数を自分の口で: (E-S) 内合 ÷ 残り・平均 ÷ 残り・(E-M) 内合 ÷ 残り・(L2) | ${fe(S.esInf)}・${fe(S.esMean)}・${fe(S.emInf)}・${S.L2.toFixed(6)} | ${tf(G.anchorG)} |`,
    `| ② 第353便g の earthDrag・residualOf と同じ(相対 1e-9 の床) | ${tf(S.sameG)} | ${tf(G.sameAsG)} |`,
    `| ③ 受け手の半径を口にした点の回転 = 第352便h の pointRot・地球の項 = otherSrc の内合の (S)(相対差) | ${fl9(S.pr)}・${fl9(S.oS)} | ${tf(G.pointRot)} |`,
    `| ④ 統括の数え直し 3 の c_R 1e-3〜1 の (L2)(等大)と等大の倍率 ÷ k(第353便c の cancelOf と同じ) | ${S.cRrows.map((r) => r.L2.toFixed(5)).join('・')} | ${tf(G.anchorCR)} |`,
    `| ⑤ (P-応): 場は規則の半径 —— 比は規則の半径と同じ | ${tf(S.respSame)} | ${tf(G.respSame)} |`,
    `| ⑥ (L2) を全部の受け手で: 金星・イオ・月 = 第352便v の cancelPoint・(L2) − 1 を差で作らない形 = 差(相対差) | ${tf(S.vSame)}・${fl9(S.dStable)} | ${tf(G.residAll)} |`,
    `| ⑦ 円の道の衛星: 母天体由来と母天体の自転軸の cos・距離のべき | ${S.cosPar.toFixed(4)}・${S.slope.toFixed(3)} | ${tf(G.circMoon)} |`,
    `| ⑧ 内合の算術: 内合の経度の歩み・5 回でのずれ・内合ごとの自転のずれ ${PROV}・残りの軸と L の角・公転面からの仰角 | ${S.step.toFixed(2)}°・${S.drift.toFixed(2)}°・${S.shift.toFixed(3)}°・${S.resToL.toFixed(2)}°・${S.resBeta.toFixed(2)}° | ${tf(G.conj)} |`,
    `| ⑨ 変異(内合を外合に —— (E-S) が小さくなる・(L2) − 1 の符号を逆に —— 差と合わない) | ${tf(S.mSup)}・${tf(S.mSign)} | ${tf(G.mutants)} |`,
    `| ⑩ 拒否(成分の名・c_R 0・位相の名・大きさの置き方・受け手の名・倍率 −1・半径 0・源の半径 0.5) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  const D = J.decl, cols = D.srcCols.flatMap((s) => D.uModes.map((u) => [s.id, u]));
  T.scan = ['| 受け手(金星)の半径 | (L2) 等大(主) | φ(主)° | ' + cols.map(([s, u]) => SRC[s] + '・' + (u === 'same' ? '(uV) 数え直し' : '(uV) 固定')).join(' | ') + ' |', '|' + '---|'.repeat(3 + cols.length),
    ...J.scan.map((r) => `| ${r.cR === null ? '規則の半径' : '(P-場) c_R ' + r.cR} | ${f4(r['L2|rule'])} | ${f3(r['phi|rule'])} | ${cols.map(([s, u]) => fe(r[s + '|' + u])).join(' | ')} |`)].join('\n');
  const PH = Object.freeze({ inf: '内合の時', sup: '外合の時', mean: '1 会合のベクトルの平均', mag: '1 会合の大きさの平均' });
  const PN = Object.freeze({ S: '(E-S) 地球の自転の分', M: '(E-M) 相対の運動の分(比べる列)', MS: '(E-MS) 両方(比べる列)' });
  T.parts = ['| 成分 | ' + Object.values(PH).join(' | ') + ' |', '|---|---|---|---|---|', ...J.parts.map((r) => `| ${PN[r.part]} | ${fe(r.inf)} | ${fe(r.sup)} | ${fe(r.mean)} | ${fe(r.mag)} |`)].join('\n');
  T.phase = ['| 内合からの会合の位相 ° | (E-M) ÷ 残り | (E-M) の ŝ に沿う成分 ÷ 残り | (E-M) の ŝ に直交する成分 ÷ 残り | (E-S) ÷ 残り | (E-S) の ŝ に沿う成分 ÷ 残り | (E-S) の ŝ に直交する成分 ÷ 残り |', '|---|---|---|---|---|---|---|',
    ...J.phase.map((r) => `| ${r.phaseDeg} | ${fe(r.M)} | ${fe(r.Max)} | ${fe(r.Mperp)} | ${fe(r.S)} | ${fe(r.Sax)} | ${fe(r.Sperp)} |`)].join('\n');
  T.mean = ['| 列 | ÷ 残り | 金星の自転軸 ŝ との cos | 金星の公転の法線との cos |', '|---|---|---|---|', ...J.mean.map((r) => `| ${r.note} | ${fe(r.ratio)} | ${f4(r.cosS)} | ${f4(r.cosN)} |`)].join('\n');
  T.l2 = ['| 受け手 | 局所の作り | φ(−局所と背景の角)° | 受け手ごとの等大の残り 2 sin(φ/2) | x = abs(局所) ÷ 金星の abs(S) | (L2) (uV) | (L2) − 1: 0.0487 | (L2) − 1: 0.835 | (L2) − 1: 0.98 | 順位 (L2) (uV) | 順位 等大の残り | 順位 abs((L2) − 1) 0.98 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.l2.map((r) => `| ${NM[r.key]} | ${KIND[r.kind]} | ${f3(r.phiDeg)} | ${f3(r.own)} | ${fe(r.x)} | ${f3(r.L2_uV)} | ${fe(r['dL2_0.0487'])} | ${fe(r['dL2_0.835'])} | ${fe(r['dL2_0.98'])} | ${r.rankUV} | ${r.rankOwn} | ${r.rank098} |`)].join('\n');
  T.conj = ['| 最初の内合の経度 − 残りの軸の方位 d °(ノブ) | 内合 1〜5 の地球の向きと残りの軸の角 ° | 最小 ° | 最大 ° |', '|---|---|---|---|',
    ...J.conj.map((r) => `| ${r.d} | ${r.angles.map((a) => a.toFixed(1)).join('・')} | ${r.min.toFixed(1)} | ${r.max.toFixed(1)} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, M = J.scanMax, mx = (k) => M.max[k], cr = (k) => (mx(k).cR === null ? '規則の半径' : 'c_R ' + mx(k).cR);
  F.scan = `- (E-S) ÷ 残り の最大は、主(地球・太陽とも規則の半径)で ${fe(mx('rule|same').v)}((uV) を数え直す・${cr('rule|same')})・${fe(mx('rule|fixed').v)}((uV) を固定・${cr('rule|fixed')})/地球・太陽とも観測の半径(比べる列)で ${fe(mx('obs|same').v)}・${fe(mx('obs|fixed').v)}。**1 に届くのは、地球だけを観測の半径に置いた列だけ**(${fe(mx('Eobs|same').v)}・${fe(mx('Eobs|fixed').v)} —— 引きずる側の半径を地球と太陽で別に置く列)。(E-S) は地球の源の半径の ${f3(M.pow)} 乗で、主の列で 1 に届くには地球の源の半径を規則の半径の ${fe(M.needR)} 倍(規則と観測の幾何の倍で t = ${f3(M.needT)})・または地球の項だけに換算の係数 ${fe(M.needK)} が要る。`;
  const em = J.mean.find((r) => r.id === 'EM_mean'), sm = J.mean.find((r) => r.id === 'SunM'), ss = J.mean.find((r) => r.id === 'SunS'), p0 = J.phase.find((r) => r.phaseDeg === 0);
  F.phase = `- (E-M)(比べる列)は金星の公転の法線に沿う(内合の時 ${fe(p0.M)} 倍・ŝ に直交する成分は ${fe(p0.Mperp)} 倍)。ŝ に沿う成分の符号は内合の前後で替わらず(位相 ± で同じ —— 向きは道の対称で揃う)、内合から ±${J.emZeroDeg.toFixed(1)}° で替わる。1 会合の平均は残りの ${fe(em.ratio)} 倍で、向きは金星の公転の法線(cos ${f4(em.cosN)})—— 太陽由来の (M)(残りの ${fe(sm.ratio)} 倍・cos ${f4(sm.cosN)})と同じ向きで、その ${fe(em.ratio / sm.ratio)} 倍。「地球の影響」が大きく出るのは (M) の側だけ —— 太陽由来の (M) は太陽由来の (S)(残りの ${f3(ss.ratio)} 倍)の ${fe(sm.ratio / ss.ratio)} 倍。`;
  const v = J.l2.find((r) => r.key === 'Venus'), by = (k) => [...J.l2].sort((a, b) => a[k] - b[k]), s2 = by('L2_uV')[1], o2 = by('own')[1], t1 = [...J.l2].sort((a, b) => Math.abs(b['dL2_0.98']) - Math.abs(a['dL2_0.98']))[0];
  F.l2 = `- (uV)(金星の条件の倍率を全部の受け手に同じに)で (L2) が一番小さいのは金星(${f3(v.L2_uV)})・次は${NM[s2.key]}(${f3(s2.L2_uV)})。受け手ごとに等大に置いた残り 2 sin(φ/2) でも金星が一番小さい(${f3(v.own)}・次は${NM[o2.key]} ${f3(o2.own)})—— こちらは背景の大きさに依らず、局所の (S) の向きと基準軸 L の角 φ(金星 ${f3(v.phiDeg)}°)だけで決まる。0.0487・0.835・0.98 では (L2) は全部の受け手で 1 から ${fe(Math.max(...J.l2.map((r) => Math.abs(r['dL2_0.0487']))))} の内 —— 0.98 の abs((L2) − 1) が一番大きいのは${NM[t1.key]}(金星は ${v.rank098} 番目 —— この量は x に比例)。`;
  const c = J.conjStep, A = J.resAxis;
  F.conj = `- 残り(金星・(uV)・(N+) L)の軸は金星の公転面から ${A.beta.toFixed(2)}° の所に寝ている(L と ${A.toLDeg.toFixed(2)}°・金星の自転軸と ${A.toSpinDeg.toFixed(2)}°)。内合の経度は 1 会合で ${c.stepDeg.toFixed(2)}° 進み、5 回で ${c.driftDeg5.toFixed(2)}° ずれる(5 つの内合が 1 組 —— 1 周 ${f3(Math.abs(360 / c.driftDeg5) * 5 * c.S / 365.25)} 年)。5 つの内合の地球の向きと残りの軸の角は、最初の内合の経度の置き方 d で動き、最小は ${Math.min(...J.conj.map((r) => r.min)).toFixed(1)}〜${Math.max(...J.conj.map((r) => r.min)).toFixed(1)}°。比べる数: 内合ごとの自転のずれ ${c.spinShiftDeg.toFixed(3)}° ${PROV}(5 回で ${(5 * c.spinShiftDeg).toFixed(2)}°)。`;
  return F;
}

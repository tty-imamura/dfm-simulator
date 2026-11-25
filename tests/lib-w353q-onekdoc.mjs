// 第353便q(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R481):
// **正本 tests/out/onek-353q.json から PHYSICS〔第353便q〕の表と数の文を作る文書の lib**
// (QA docs.onek353q が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 1 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353q-onekdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const f1 = (x) => (!fin(x) ? '—' : Number(x).toFixed(1));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const RN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ' });
const RING = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });
const FRAME = Object.freeze({ F1: '(F1) 軸引きずりの (S) の作り', F2: '(F2) 円盤引きずりの側の作り' });
const RECV = Object.freeze({ rule: '受け手の半径を当てない(規則の半径)', obs: '当てる(粒子 1 m × 組の c_R)' });
const band = (c) => fe(c.v) + (c.inBand ? ' ●' : Math.abs(c.v) > 10 ? ' ▲' : ' ▽');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「計算が合う方式」を探す材料として、1 つの換算の係数 k を全部の題に同じに掛けたときの桁を並べる(組を選ばない)', '表 3・表 5']),
  Object.freeze(['土星の環を、軸引きずりの (S) の作り (F1) と円盤引きずりの側の作り (F2) の両方で、受け手(環の粒子)の半径を当てる/当てないの 2 列で並べる', '表 3・表 4']),
  Object.freeze(['金星の条件 = u 0.98 で金星の局所 (S) と背景 (N+) の大きさが同じ。その k を組ごとに 1 つ置く(k は局所の項だけに掛ける)', '表 2']),
  Object.freeze(['注目の列 u = 0.98(向きは (N+) のまま・大きさだけ)。背景には k を掛けない', '表 2・表 3']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const setName = (J, id) => J.sets.find((s) => s.id === id).label;
const topicName = (J, id) => J.topics.find((t) => t.id === id).label;

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, sets = J.sets, ids = sets.map((s) => s.id), hdr = '| ' + sets.map((s) => s.label).join(' | ') + ' |', sep = sets.map(() => '---|').join('');
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 組の k = 〔第353便j〕の kFor(規則の半径・(P-場) 1e-4・1e-3・2% の端・(P-応) —— 最大の相対の差) | ${fe(S.vsKJ)}(${fe(S.kQ.rule)}・${fe(S.kQ['f1e-4'])}・${fe(S.kQ.fe2)}) | ${tf(G.kSame)} |`,
    `| ② 副作用(局所 ÷ 背景・合成 ÷ 背景・合成と L の角・円錐)= 〔第353便j〕の sideRow(規則の半径と (P-場) 1e-3 —— 6 受け手) | ${fe(S.vsSide)} | ${tf(G.sideSame)} |`,
    `| ③ 環 (F1)・受け手 規則の半径 = 〔第353便h〕の axialRow(5 区分) | ${fe(Math.max(...S.ringH))}(${fe(Math.min(...S.ringAx))}〜${fe(Math.max(...S.ringAx))}) | ${tf(G.ringH)} |`,
    `| ④ 環 (F2)・受け手 粒子 1 m × c_R 1 = 〔第353便k〕の t1Row の主の列(5 区分) | ${fe(Math.max(...S.ringK))}(${fe(Math.min(...S.ringDisk))}〜${fe(Math.max(...S.ringDisk))}) | ${tf(G.ringK)} |`,
    `| ⑤ 公転面(規則の半径)= 〔第352便za〕の題 plane(倍率 0) | ${fe(S.planeZ)} | ${tf(G.planeZ)} |`,
    `| ⑥ 軸引きずりの方位の率(地球・k 1 と 3e11)= 〔第353便f〕の dragRate | ${fe(Math.max(S.dE, S.dEk))} | ${tf(G.dragF)} |`,
    `| ⑦ 要る応答の係数(k 1)= 〔第353便m〕(地球 18.6 年の平均・火星) | ${fp(S.cE)}・${fp(S.cM)} | ${tf(G.cNeedM)} |`,
    `| ⑧ 地球の傾き・イオの内部熱・潮汐ロック(規則の半径・k 5e10)= 〔第352便za〕の topicCell | ${S.zz.map(fe).join('・')} | ${tf(G.zaSame)} |`,
    `| ⑨ イオの合成 ÷ 背景(規則の半径・σ つき)= 〔第353便j〕の ioRow | ${S.ioErr.map(fe).join('・')} | ${tf(G.ioJ)} |`,
    `| ⑩ 金星の局所 ÷ 背景 = 1(組 6 —— 最大の差) | ${fe(S.venus1)} | ${tf(G.venus1)} |`,
    `| ⑪ 基準軸 L・ω_G・2% の端 c_R | (${S.ax.map((x) => x.toFixed(6)).join(', ')})・${fe(S.omegaG)} rad/s・${Number(S.edge).toFixed(4)} | ${tf(G.axisL)} |`,
    `| ⑫ 拒否(組の名・題の名) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 組 | 換算の係数 k(金星で等大)| 〔第353便j〕の kFor | σ_太陽 | 金星の残り(等大)| 金星の φ ° |', '|---|---|---|---|---|---|',
    ...J.t1.ks.map((k) => `| ${setName(J, k.set)} | ${fe(k.k)} | ${fe(k.kJ)} | ${fp(k.sigSun)} | ${fe(k.residEqual)} | ${fp(k.phiDeg)} |`)].join('\n');
  T.t1b = ['| 題(値 = k を掛けた量 ÷ 物差し —— ● 0.1〜10・▲ 10 を越える・▽ 0.1 に届かない) | ' + sets.map((s) => s.label).join(' | ') + ' |', '|---|' + sep,
    ...J.t1.rows.map((r) => `| ${topicName(J, r.topic)} | ${r.cells.map(band).join(' | ')} |`),
    `| **物差しの桁に入る題の数(11 題のうち)** | ${J.t1.count.join(' | ')} |`].join('\n');
  const cell = (t, i) => J.t1.rows.find((r) => r.topic === t).cells[i];
  T.t1c = ['| 添えの量 | ' + sets.map((s) => s.label).join(' | ') + ' |', '|---|' + sep,
    ...['ringAx', 'io', 'moon', 'mercury', 'tilt', 'ioHeat', 'ioLock'].map((t) => `| ${topicName(J, t)} —— 背景を含む値 | ${ids.map((id, i) => fe(cell(t, i).vComp)).join(' | ')} |`),
    `| 地球: 要る応答の係数(k を置いた後の合成で —— k 1 は ${fp(cell('precEarth', 0).cNeed1)}) | ${ids.map((id, i) => fp(cell('precEarth', i).cNeed)).join(' | ')} |`,
    `| 火星: 要る応答の係数(k 1 は ${fp(cell('precMars', 0).cNeed1)}) | ${ids.map((id, i) => fp(cell('precMars', i).cNeed)).join(' | ')} |`,
    `| 地球: 傾きを保つ f の上限(k 1 は ${fe(cell('tilt', 0).fMax1)}) | ${ids.map((id, i) => fe(cell('tilt', i).fMax)).join(' | ')} |`,
    `| 水星: 合成と L の角 ° | ${ids.map((id, i) => f1(cell('mercury', i).omToAxisDeg)).join(' | ')} |`].join('\n');
  const rng = (frame, recv, i) => { const vs = J.t2.ring.filter((r) => r.frame === frame && r.recv === recv).map((r) => r.cells[i].ratio); return fe(Math.min(...vs)) + '〜' + fe(Math.max(...vs)); };
  const rB = (frame, recv, i) => J.t2.ring.find((r) => r.key === 'ringB' && r.frame === frame && r.recv === recv).cells[i].ratio;
  T.t2 = ['| 環の作り | 受け手(環の粒子)の半径 | ' + sets.map((s) => s.label).join(' | ') + ' |', '|---|---|' + sep,
    ...['F1', 'F2'].flatMap((fr) => ['rule', 'obs'].map((rv) => `| ${FRAME[fr]} | ${RECV[rv]} | ${ids.map((id, i) => 'B ' + fe(rB(fr, rv, i)) + '(5 区分 ' + rng(fr, rv, i) + ')').join(' | ')} |`))].join('\n');
  T.t2b = ['| 題(要る k ÷ 金星の k —— 1 に近いほど同じ k で物差しに届く) | ' + sets.map((s) => s.label).join(' | ') + ' |', '|---|' + sep,
    ...J.t2.topics.map((r) => `| ${topicName(J, r.topic)} | ${r.ratio.map(fe).join(' | ')} |`)].join('\n');
  const nm = (a) => (a.length ? a.map((t) => (J.topics.find((x) => x.id === t) ? topicName(J, t) : RN[t] || t)).join('・') : 'なし');
  T.t3 = ['| 組 | 10 倍を越える題 | 1/10 に届かない題 | 副作用の受け手(局所 ÷ 背景 > 0.1) | 〔第353便j〕の表 2 と同じ顔ぶれ |', '|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${setName(J, r.set)} | ${nm(r.over)} | ${nm(r.under)} | ${nm(r.side)} | ${r.sameAsJ ? '同じ' : '違う'} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語で置く) */
export function factsOf(J) {
  const F = {}, ix = (id) => J.sets.findIndex((s) => s.id === id), iR = ix('rule'), iE = ix('fe2'), i4 = ix('f1e-4'), i3 = ix('f1e-3');
  const row = (t) => J.t1.rows.find((r) => r.topic === t), c = (t, i) => row(t).cells[i];
  const ring = (fr, rv, i) => J.t2.ring.filter((r) => r.frame === fr && r.recv === rv).map((r) => r.cells[i].v);
  const mm = (a) => fe(Math.min(...a)) + '〜' + fe(Math.max(...a));
  F.t1 = `組ごとに 1 つ置いた k は、規則の半径(と (P-応)・σ つき)で ${fe(J.t1.ks[iR].k)}・(P-場) c_R 1e-4 で ${fe(J.t1.ks[i4].k)}・1e-3 で ${fe(J.t1.ks[i3].k)}・0.0128 で ${fe(J.t1.ks[iE].k)}。物差しの桁(0.1〜10)に入る題は 11 題のうち、規則の半径 ${J.t1.count[iR]}・(P-場) c_R 1e-4 ${J.t1.count[i4]}・1e-3 ${J.t1.count[i3]}・0.0128 ${J.t1.count[iE]}・(P-応) ${J.t1.count[ix('resp')]}・σ つき ${J.t1.count[ix('ruleSig')]}。`;
  F.ring = `土星の環(5 区分)は、規則の半径の k で (F1)・受け手の半径を当てない列が ${mm(ring('F1', 'rule', iR))}・(F2) が ${mm(ring('F2', 'rule', iR))}。(P-場) c_R 0.0128 の k で粒子に同じ c_R を当てる列は (F1) ${mm(ring('F1', 'obs', iE))}・(F2) ${mm(ring('F2', 'obs', iE))}。組と受け手の半径の当て方を食い違わせると(規則の半径の k で粒子に当てる・c_R の k で当てない)、物差しから 6 桁以上離れる。`;
  F.plane = `公転面の集まりは、どの組でも物差しの桁(規則の半径 ${fp(c('plane', iR).v)}・(P-場) c_R 1e-4〜0.0128 で ${fp(c('plane', i4).v)}〜${fp(c('plane', iE).v)})—— 受け手(地球)の半径を組と同じに当てると、(P-場) の小さい k でも同じ桁に来る。`;
  F.prec = `歳差の率の残り(仮・未照合)を軸引きずりで埋めるのに要る応答の係数は、k 1 の地球 ${fp(c('precEarth', iR).cNeed1)}・火星 ${fp(c('precMars', iR).cNeed1)} から、k を置いた後の合成で地球 ${fp(Math.min(...row('precEarth').cells.filter((x) => x.set !== 'resp').map((x) => x.cNeed)))}〜${fp(Math.max(...row('precEarth').cells.filter((x) => x.set !== 'resp').map((x) => x.cNeed)))}・火星 ${fp(Math.min(...row('precMars').cells.filter((x) => x.set !== 'resp').map((x) => x.cNeed)))}〜${fp(Math.max(...row('precMars').cells.filter((x) => x.set !== 'resp').map((x) => x.cNeed)))}(どの組でも埋める向き)。`;
  const t3 = J.t3, sameJ = t3.filter((r) => r.sameAsJ).length;
  F.t3 = `どの組でも 1/10 に届かない題は ${t3[iR].under.map((t) => topicName(J, t)).join('・')}。地球の傾き(局所だけで ${fp(c('tilt', iR).v)})はどの組でも 10 倍を越える。副作用の受け手(局所 ÷ 背景 > 0.1)は ${sameJ} 組で〔第353便j〕の表 2 と同じ顔ぶれ(水星・地球・火星・月・イオ)。`;
  return F;
}

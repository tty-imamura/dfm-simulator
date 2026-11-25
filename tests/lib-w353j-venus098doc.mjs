// 第353便j(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R474):
// **正本 tests/out/venus098-353j.json から PHYSICS〔第353便j〕の表と数の文を作る文書の lib**
// (QA docs.venus098_353j が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353j-venus098doc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const RN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Sun: '太陽', Moon: '月', Io: 'イオ', Pluto: '冥王星' });
const TOPN = Object.freeze({ ring: '土星の環(B 環・1° 傾き)', tilt: '惑星の傾き(地球)', plane: '公転面の集まり(地球の道の輪)' });
const sense = (x) => (x === 1 ? '同じ回り' : x === -1 ? '逆回り' : '—');
/** 組の名(表の見出し) */
export function comboName(c) {
  if (c.place === 'rule') return '規則の半径';
  if (c.place === 'resp') return '(P-応)';
  return '(P-場) c_R ' + fp(c.cR) + (c.edge === 'e2' ? '(2% の端)' : c.edge === 'e5' ? '(5% の端)' : '');
}
const over = (v, tol) => fe(v) + (fin(v) && v > tol ? ' ▲' : '');
const tri = (v) => fe(v) + (fin(v) && v > 1 + 1e-6 ? ' ▲' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['金星の条件 = 金星で局所 (S) と背景 (N+) の大きさが同じ。そのときの金星の残りは 2 sin(φ/2)(φ = −S と基準軸 L のなす角)', '表 2・表 3']),
  Object.freeze(['注目の列 u = 0.98(向きは (N+) のまま・大きさだけ)。金星の条件と同時に置くには、局所の項の大きさを換算の係数 k で合わせる', '表 2・表 3']),
  Object.freeze(['受け手の半径 = c_R × 観測半径を場の式に入れる (P-場) と応答の側だけに入れる (P-応)〔第353便c〕。k と c_R を組で振る', '表 2・表 4・表 5・表 6']),
  Object.freeze(['「計算が合う方式」を探す材料として、組ごとの副作用を全部の受け手で並べる(組を選ばない)', '表 4〜表 8']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, P = J.t2.pairs, C = J.t1.map((r) => r.combo), recvs = J.decl.recvs, tol = J.decl.sideTol;
  const row = (i, key) => P[i].rows.find((r) => r.key === key);
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 規則の半径で金星が等大の k(u 0.98)= 〔第353便e〕の kVenusAt | ${fe(S.kr)}・${fe(S.kE)} | ${tf(G.kRule)} |`,
    `| ② 統括の数え直し 3 の金星の 6 行(等大の倍率 ÷ k・φ・残り —— 規則・c_R 1e-3・1e-2・0.1・0.3・1) | ${S.venus.map((v) => fp(v.res)).join('・')} | ${tf(G.venus6)} |`,
    `| ③ 規則の半径・k 金星で等大 = 〔第353便e〕の table3Recv(8 惑星の局所 ÷ 背景・円錐・f の上限 —— 最大の相対の差) | ${fe(S.vsE)} | ${tf(G.sameAsE)} |`,
    `| ④ k 1 の f の上限 = 〔第353便e〕の fMaxAt(8 惑星 —— 最大の相対の差) | ${fe(S.vsF)} | ${tf(G.fMaxE)} |`,
    `| ⑤ (P-応) の k = 規則の半径の k | ${fe(S.vsResp)} | ${tf(G.respK)} |`,
    `| ⑥ (P-場) の局所 = 〔第353便c〕の sOf(地球・c_R 0.01・k 3) | ${fe(S.vsC)} | ${tf(G.fieldC)} |`,
    `| ⑦ 衛星の局所(規則の半径・源の和)= 〔第352便za〕の localOf(イオ・月) | ${S.satZ.map(fe).join('・')} | ${tf(G.satZ)} |`,
    `| ⑧ 地球の傾きの欄(規則の半径)= 〔第352便za〕の topicCell | ${fp(S.tilt[0])}・${fp(S.tilt[1])} | ${tf(G.tiltZ)} |`,
    `| ⑨ 金星の等大の点: 合成 ÷ 背景(直接)= 2 sin(φ/2) | ${fe(S.vEq[0])}・${fe(S.vEq[1])} | ${tf(G.venusEq)} |`,
    `| ⑩ 基準軸 L・ω_G(統括の数え直し 3) | (${S.ax.map((x) => x.toFixed(6)).join(', ')})・${fe(S.omegaG)} rad/s | ${tf(G.axisL)} |`,
    `| ⑪ 拒否(c_R 0・入れ方の名・受け手の名・負の k・u 0) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 組 | 要る k | 等大の倍率 ÷ k | 金星の φ ° | 金星の残り(等大)| 係数を自由に振った下限 | 金星の合成と L の角 ° | 金星の円錐 ° | 率の倍((P-応)) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => `| ${comboName(r.combo)} | ${fe(r.kv.k)} | ${fe(r.kv.uEqualOverK)} | ${fd(r.kv.phiDeg)} | ${fe(r.kv.residEqual)} | ${fe(r.kv.residMin)} | ${fd(r.venus.omToAxisDeg)} | ${fd(r.venus.coneDeg)} | ${fe(r.kv.rateMult)} |`)].join('\n');
  T.t2a = ['| 受け手 | ' + C.map(comboName).join(' | ') + ' |', '|---|' + C.map(() => '---|').join(''),
    ...recvs.map((key) => `| ${RN[key]} | ${C.map((c, i) => over(row(i, key).locOverBg, tol)).join(' | ')} |`)].join('\n');
  const hit = J.t2.summary.overAll.concat(J.t2.summary.overSome).filter((k) => k !== 'Venus');
  T.t2b = ['| 受け手 | 量 | k 1・規則の半径 | ' + C.map(comboName).join(' | ') + ' |', '|---|---|---|' + C.map(() => '---|').join(''),
    ...hit.flatMap((key) => { const r0 = row(0, key);
      return [`| ${RN[key]} | 円錐 ° | ${fd(r0.coneDeg - r0.dConeDeg)} | ${C.map((c, i) => fd(row(i, key).coneDeg)).join(' | ')} |`,
        `| ${RN[key]} | 合成と L の角 ° | ${fd(r0.omToAxisDeg - r0.dAxisDeg)} | ${C.map((c, i) => fd(row(i, key).omToAxisDeg)).join(' | ')} |`,
        `| ${RN[key]} | 自転と合成 | ${r0.spinOm0 === 1 ? '順' : '逆'} | ${C.map((c, i) => (row(i, key).spinOm === 1 ? '順' : '逆')).join(' | ')} |`,
        `| ${RN[key]} | 合成の軸のまわりの回る向き((g2−)) | ${sense(r0.relOm0)} | ${C.map((c, i) => { const r = row(i, key); return sense(r.relOm) + (r.relOm !== r.relOm0 ? ' ◆' : ''); }).join(' | ')} |`,
        `| ${RN[key]} | 傾きを保つ f の上限 | ${fe(r0.fMax0)} | ${C.map((c, i) => fe(row(i, key).fMax)).join(' | ')} |`]; })].join('\n');
  const pv = (i, key) => { const r = row(i, key); return r.prov ? (r.prov.sameSense === true ? '同じ' : r.prov.sameSense === false ? '逆 ※' : '—') : '—'; };
  const rel = (r, p) => (p === 'om' ? r.relOm : p === 'ax' ? r.relAx : r.relOrb), rel0 = (r, p) => (p === 'om' ? r.relOm0 : p === 'ax' ? r.relAx0 : r.relOrb0);
  const obsCell = (i, key, p) => { const r = row(i, key); return sense(rel(r, p)) + (rel(r, p) !== rel0(r, p) ? ' ◆' : ''); };
  T.t2c = ['| 当たり所 | ' + C.map(comboName).join(' | ') + ' |', '|---|' + C.map(() => '---|').join(''),
    `| 地球: 歳差の回る向き(仮の値 —— 未照合)と同じか | ${C.map((c, i) => pv(i, 'Earth')).join(' | ')} |`,
    `| 地球: 基準軸 L のまわりの回る向き | ${C.map((c, i) => obsCell(i, 'Earth', 'ax')).join(' | ')} |`,
    `| 地球: 円錐の動き °(k 1 から) | ${C.map((c, i) => fd(row(i, 'Earth').dConeDeg)).join(' | ')} |`,
    `| 火星: 歳差の回る向き(仮の値 —— 未照合)と同じか | ${C.map((c, i) => pv(i, 'Mars')).join(' | ')} |`,
    `| 火星: 自分の公転の北極のまわりの回る向き | ${C.map((c, i) => obsCell(i, 'Mars', 'orb')).join(' | ')} |`,
    `| 火星: 円錐の動き °(k 1 から) | ${C.map((c, i) => fd(row(i, 'Mars').dConeDeg)).join(' | ')} |`,
    `| 水星: 合成の軸のまわりの回る向き | ${C.map((c, i) => obsCell(i, 'Mercury', 'om')).join(' | ')} |`,
    `| 水星: 自分の公転の北極のまわりの回る向き | ${C.map((c, i) => obsCell(i, 'Mercury', 'orb')).join(' | ')} |`,
    `| 水星: 円錐の動き °(k 1 から) | ${C.map((c, i) => fd(row(i, 'Mercury').dConeDeg)).join(' | ')} |`].join('\n');
  T.t2d = ['| 題(第352便za の物差し —— 単位の係数) | 受け手の半径の口 | k 1・規則の半径 | ' + C.map(comboName).join(' | ') + ' |', '|---|---|---|' + C.map(() => '---|').join(''),
    ...J.decl.topics.map((t) => `| ${TOPN[t]} | ${J.t2.topic1.recvRadius[t] ? 'あり' : 'なし(k だけ)'} | ${tri(J.t2.topic1[t])} | ${J.t2.topics.map((r) => tri(r[t])).join(' | ')} |`)].join('\n');
  const SM = J.t2.summary, nm = (a) => (a.length ? a.map((k) => RN[k] || TOPN[k]).join('・') : 'なし');
  T.t2e = ['| 分け | 受け手・題 |', '|---|---|',
    `| 局所 ÷ 背景が 0.1 を越える —— どの組でも | ${nm(SM.overAll)} |`, `| 局所 ÷ 背景が 0.1 を越えない —— どの組でも | ${nm(SM.overNone)} |`, `| 組によって越える | ${nm(SM.overSome)} |`,
    `| 題の欄が物差しを越える —— どの組でも | ${nm(SM.topicAll)} |`, `| 題の欄が物差しを越えない —— どの組でも | ${nm(SM.topicNone)} |`].join('\n');
  const yn = (x) => (x ? '在る' : '無い');
  T.t3 = ['| 組 | 金星の残り(等大)| イオの x(木星由来 ÷ 金星の (S))| イオ自身の残り(等大)| 金星の k でのイオの合成 ÷ 背景 | 同(σ 木星 (O2b))| 同時に 10% 以下 | 同時に 20% 以下 | σ つきで 10% | σ つきで 20% |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r, i) => `| ${comboName(C[i])} | ${fe(r.venusResid)} | ${fp(r.x)} | ${fe(r.ioResidEqual)} | ${fp(r.ioTot)} | ${fp(r.ioTotSigma)} | ${yn(r.both10)} | ${yn(r.both20)} | ${yn(r.both10s)} | ${yn(r.both20s)} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語で置く) */
export function factsOf(J) {
  const F = {}, P = J.t2.pairs, C = J.t1.map((r) => r.combo), row = (i, key) => P[i].rows.find((r) => r.key === key), ic = (id) => C.findIndex((c) => c.id === id);
  const iR = ic('rule'), iE2 = ic('field-e2'), iE5 = ic('field-e5'), i4 = ic('field-0.0001'), i01 = ic('field-0.1');
  const ks = J.t1.filter((r) => r.combo.place === 'field').map((r) => r.kv.k);
  F.t1 = `u 0.98 で金星が等大になる k は、規則の半径(と (P-応))で ${fe(J.t1[iR].kv.k)}・(P-場) では c_R 1e-4〜0.1 で ${fe(Math.min(...ks))}〜${fe(Math.max(...ks))}。金星の残り(等大)は c_R ${fp(C[iE2].cR)} で 2%・${fp(C[iE5].cR)} で 5%・0.1 で ${fe(J.t1[i01].kv.residEqual)}(規則の半径 ${fe(J.t1[iR].kv.residEqual)})。どの組でも金星の合成は基準軸 L からほぼ直交(${fd(Math.min(...J.t1.map((r) => r.venus.omToAxisDeg)))}〜${fd(Math.max(...J.t1.map((r) => r.venus.omToAxisDeg)))}°)。`;
  const mer = J.t1.map((r, i) => row(i, 'Mercury').locOverBg);
  F.t2 = `どの組でも、局所 ÷ 背景が 0.1 を越える受け手は ${J.t2.summary.overAll.map((k) => ({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Moon: '月', Io: 'イオ' }[k] || k)).join('・')}(木星より外・太陽・冥王星はどの組でも越えない)。水星の局所 ÷ 背景は規則の半径で ${fp(mer[iR])}・(P-場) で c_R 1e-4 の ${fp(mer[i4])} から 0.1 の ${fp(mer[i01])} まで —— c_R 0.1 より下の組では水星の合成と L の角が 90° を越え(自転と合成が逆)、合成の軸のまわりの回る向きが k 1 と替わる。`;
  F.t2b = `地球の円錐は k 1 の ${fd(row(iR, 'Earth').coneDeg - row(iR, 'Earth').dConeDeg)}° から、規則の半径で ${fd(row(iR, 'Earth').coneDeg)}°・2% の端で ${fd(row(iE2, 'Earth').coneDeg)}°・5% の端で ${fd(row(iE5, 'Earth').coneDeg)}°。地球と火星の歳差の回る向き(仮の値 —— 未照合)との並べは、どの組でも同じ向き。月とイオは (P-場) の小さい c_R で局所が背景を越え(月 c_R 1e-4 で ${fp(row(i4, 'Moon').locOverBg)}・イオ ${fp(row(i4, 'Io').locOverBg)})、合成と L の角が 90° を越える。`;
  const tp = (i, t) => J.t2.topics[i][t];
  F.t2c = `題の欄: 土星の環と地球の傾きは k 1 でも物差しを越える(背景の分 —— ${fp(J.t2.topic1.ring)}・${fp(J.t2.topic1.tilt)})。公転面の集まりは規則の半径の k では ${fp(tp(iR, 'plane'))}(物差しを越える)・(P-場) の組では k が小さいので ${fe(Math.max(...C.map((c, i) => (c.place === 'field' ? tp(i, 'plane') : 0))))} 以下。`;
  const t3 = J.t3, b10 = t3.filter((r) => r.both10).length, b20 = t3.filter((r) => r.both20).length;
  F.t3 = `イオ(源 = 木星 + 太陽)を金星と同じ組で数えると、イオの x は規則の半径で ${fp(t3[iR].x)}・(P-場) では c_R 1e-4 で ${fp(t3[i4].x)}・0.1 で ${fp(t3[i01].x)} —— (P-場) では金星の k でイオの局所が背景を越え、イオの合成 ÷ 背景は ${fp(Math.min(...t3.filter((r, i) => C[i].place === 'field').map((r) => r.ioTot)))} 以上。金星とイオが同時に 10% 以下になる組は ${b10} 組・20% 以下は ${b20} 組(規則の半径でイオ ${fp(t3[iR].ioTot)})。木星の源に σ((O2b))を掛けた列では、規則の半径でイオ ${fp(t3[iR].ioTotSigma)}・金星 ${fe(t3[iR].venusResid)}。`;
  return F;
}

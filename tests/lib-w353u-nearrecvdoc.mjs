// 第353便u(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R485):
// **正本 tests/out/nearrecv-353u.json から PHYSICS〔第353便u〕の表と数の文を作る文書の lib**
// (QA docs.nearrecv353u が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353u-nearrecvdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const RN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ' });
const sense = (x) => (x === 1 ? '同じ回り' : x === -1 ? '逆回り' : '—');
const ord = (x) => (x === 1 ? '順' : x === -1 ? '逆' : '—');
/** 組の名(表の見出し) */
export function comboName(id, cR) {
  if (id === 'k1') return 'k 1(背景だけ —— 比べる列)';
  if (id === 'rule') return '規則の半径';
  if (id === 'resp') return '(P-応)';
  return '(P-場) c_R ' + fp(cR) + (id === 'field-e2' ? '(2% の端)' : id === 'field-e5' ? '(5% の端)' : '');
}
const over = (v) => fe(v) + (fin(v) && v > 0.1 ? ' ▲' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['金星で局所 (S) と背景 (N+) が同じ大きさの点で、金星の合成は背景の 1% の桁まで小さくなる(金星の条件)。その k を全部の受け手に同じに掛ける', '表 3・表 6']),
  Object.freeze(['注目の列 u = 0.98(向きは (N+) のまま・大きさだけ)。0.98 のまま金星の条件を置くには換算の係数 k で局所の大きさを合わせる(〔第353便j〕の組 8)', '表 3']),
  Object.freeze(['観測値(傾き・歳差の回る向き・自転の状態)に沿うかを、合否でなく食い違いの表として並べる材料にする(仮の値は未照合の印つき)', '表 4・表 5']),
  Object.freeze(['「見ている時間の間は変わらない」—— 公転の極に対する傾きの揺れの幅(〔第353便n〕の形)を組ごとに並べる', '表 3']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const GATE_TEXT = Object.freeze({
  t4j: ['〔第353便j〕の表 4 の局所 ÷ 背景(受け手 5 × 組 8 —— 有効数字 3 桁)', 'S.t4'],
  t5j: ['〔第353便j〕の表 5 の円錐 °(受け手 5 × k 1 と組 8 —— 小数 3 桁)', 'S.t5'],
  satSame: ['衛星の状態の作り直し = 〔第353便j〕の sideRow(局所 ÷ 背景・円錐 —— 最大の相対の差)', 'satVs'],
  rateB: ['率 = 〔第353便b〕の precRate(惑星 3 × 組 9 —— 最大の相対の差)', 'rateVs'],
  fMaxE: ['傾きを保つ f の上限 = 〔第353便e〕の fMaxAt(k 1 と規則の半径の k —— 最大の相対の差)', 'fmVs'],
  wobN: ['揺れの幅(k 1)= 〔第353便n〕の watchRow の coneEps(最大の相対の差)', 'wobVs'],
  dragF: ['軸引きずりの方位の率 = 〔第353便f〕の dragRate(地球・火星 × k 1 と規則の半径の k —— 最大の相対の差)', 'dragVs'],
  spinOrbitQ: ['自転と公転の率 = 〔第352便q〕の structOf(水星・月 —— 最大の相対の差)', 'soVs'],
  closedLarge: ['閉じた形の候補 g* ÷ g(木星・土星・c_R ≤ 1e-2 —— 1 からの差の最大)', 'closed'],
  kRule: ['規則の半径で金星が等大の k(8.22e+11)', 'kr'],
  axisL: ['基準軸 L・ω_G(統括の数え直し 3)', 'ax'],
  rejects: ['拒否(受け手の名・組の名・u ≤ 0・並びの受け手・極の名・自転と公転の受け手 —— RangeError)', 'rejects'],
});
export function gateTable(J) {
  const S = J.pure.scenes, G = J.pure.gates, v = (k) => {
    if (k === 't4j' || k === 't5j') return '25・45 個';
    if (k === 'closedLarge') return fe(Math.max(...S.closed.map((x) => Math.abs(x - 1))));
    if (k === 'kRule') return fe(S.kr);
    if (k === 'axisL') return S.ax.map((x) => x.toFixed(6)).join(', ') + '・' + S.omegaG;
    if (k === 'rejects') return S.rejects.length + ' 本';
    const x = S[GATE_TEXT[k][1]]; return x === 0 ? '0' : fe(x);
  };
  return ['| 零試験 | 値 | 真偽 |', '|---|---|---|', ...Object.keys(G).map((k, i) => `| ${'①②③④⑤⑥⑦⑧⑨⑩⑪⑫'[i]} ${GATE_TEXT[k][0]} | ${v(k)} | ${tf(G[k])} |`)].join('\n');
}
/** 表 3 受け手 5 × 組 9 の状態 */
export function stateTable(J) {
  const ids = J.t1[0].rows.map((r) => [r.combo, r.cR]), head = '| 受け手 | 量 | ' + ids.map(([i, c]) => comboName(i, c)).join(' | ') + ' |';
  const lines = [head, '|---|---|' + ids.map(() => '---:|').join('')];
  for (const b of J.t1) {
    const n = RN[b.key], r0 = b.rows[0], row = (q, f) => lines.push(`| ${n} | ${q} | ${b.rows.map(f).join(' | ')} |`);
    row('局所 ÷ 背景', (r) => over(r.locOverBg));
    row('合成と L の角 °', (r) => fd(r.omToAxisDeg));
    row('円錐 °', (r) => fd(r.coneDeg));
    row('自転と合成', (r) => ord(r.spinOm));
    row('合成の軸のまわりの回る向き((g2−))', (r) => sense(r.relOm) + (r.relOm !== r0.relOm ? ' ◆' : ''));
    row('公転の北極のまわりの回る向き', (r) => sense(r.relOrb) + (r.relOrb !== r0.relOrb ? ' ◆' : ''));
    row('率(合成 × 応答 1)″/年', (r) => fe(r.rateAsYr));
    row('一周 年', (r) => fe(r.periodYr));
    row('傾きを保つ f の上限', (r) => fe(r.fMax));
    row('公転の極に対する傾きの揺れの幅 °(ε₀ ' + fd(r0.eps0Deg) + ')', (r) => fd(r.wob.swingDeg));
  }
  return lines.join('\n');
}
/** 表 4 地球・火星の歳差の率(仮の値は未照合 —— 重力の側の列は比べる列) */
export function precTable(J) {
  const ids = J.t1[0].rows.map((r) => [r.combo, r.cR]), lines = ['| 受け手 | 量 | ' + ids.map(([i, c]) => comboName(i, c)).join(' | ') + ' |', '|---|---|' + ids.map(() => '---:|').join('')];
  for (const key of ['Earth', 'Mars']) {
    const rs = ids.map(([i]) => J.t2.prec.find((r) => r.key === key && r.combo === i)), n = RN[key], row = (q, f) => lines.push(`| ${n} | ${q} | ${rs.map(f).join(' | ')} |`);
    const pl = rs[0].pole === 'ecl' ? '黄道の極' : '自分の公転の北極';
    row('軸引きずり ″/年(' + pl + ' —— (g2−)・応答 1)', (r) => fe(r.drag));
    row('重力の側の潮汐のトルクの列 ″/年(比べる列 —— DFM の式ではない)', (r) => fe(r.tide));
    row('軸引きずり ÷ 重力の側の列', (r) => fe(r.dragOverTide));
    row('残り ″/年(仮の値 − 重力の側の列 —— 仮・未照合)', (r) => fp(r.resid));
    row('残りを埋める c(符号つき)', (r) => fp(r.cNeed));
    if (key === 'Earth') { row('残り ″/年(月の道の 18.6 年の平均の列 —— 仮・未照合)', (r) => fp(r.residAvg)); row('平均の列の残りを埋める c', (r) => fp(r.cNeedAvg)); }
    row('歳差の回る向き(仮の値 —— 未照合)と同じか', (r) => (r.provSame === true ? '同じ' : r.provSame === false ? '逆 ※' : '—'));
  }
  return lines.join('\n');
}
/** 表 5 水星・月・イオ(リポジトリに在る自転と公転) */
export function spinTable(J) {
  const ids = J.t1[0].rows.map((r) => [r.combo, r.cR]), lines = ['| 受け手 | 量 | ' + ids.map(([i, c]) => comboName(i, c)).join(' | ') + ' |', '|---|---|' + ids.map(() => '---:|').join('')];
  for (const key of ['Mercury', 'Moon', 'Io']) {
    const rs = ids.map(([i]) => J.t2.spin.find((r) => r.key === key && r.combo === i)), n = RN[key], r0 = rs[0];
    lines.push(`| ${n} | リポジトリの自転 ÷ 公転(自転 ${fp(r0.spinPeriodDay)} 日・公転 ${fp(r0.orbitPeriodDay)} 日)・傾き ε₀ ${fd(r0.eps0Deg)}° | ${rs.map((r) => fp(r.spinOverOrbit)).join(' | ')} |`);
    lines.push(`| ${n} | 合成と公転の極の角 ° | ${rs.map((r) => fd(r.omToOrbDeg)).join(' | ')} |`);
    lines.push(`| ${n} | 公転の極に対する傾きの範囲 °(最小〜最大) | ${rs.map((r) => fd(r.wob.minDeg) + '〜' + fd(r.wob.maxDeg)).join(' | ')} |`);
    lines.push(`| ${n} | 自転と合成 | ${rs.map((r) => ord(r.spinOm)).join(' | ')} |`);
  }
  return lines.join('\n');
}
/** 表 6 並び(8 惑星 —— 局所 ÷ 背景・距離の比の 3 乗) */
export function orderTable(J) {
  const cs = J.t3.rows, keys = cs[0].items.map((x) => x.key), cR = (id) => (J.t1[0].rows.find((r) => r.combo === id) || {}).cR;
  const lines = ['| 惑星 | (金星の距離 ÷ 距離)³ | 規則の半径の abs(S) ÷ 金星の abs(S) | ' + cs.slice(1).map((c) => comboName(c.combo, cR(c.combo))).join(' | ') + ' |', '|---|---:|---:|' + cs.slice(1).map(() => '---:|').join('')];
  for (const k of keys) { const it = cs.map((c) => c.items.find((x) => x.key === k)); lines.push(`| ${RN[k]} | ${fp(it[0].dRatio3)} | ${fp(it[0].sRuleOverVenus)} | ${it.slice(1).map((x) => over(x.locOverBg)).join(' | ')} |`); }
  return lines.join('\n');
}
/** 表 7 自分の重み ÷ 源の重みと、閉じた形の候補 ÷ 局所 ÷ 背景 */
export function closedTable(J) {
  const cs = J.t3.rows.slice(1), keys = cs[0].items.map((x) => x.key), cR = (id) => (J.t1[0].rows.find((r) => r.combo === id) || {}).cR;
  const lines = ['| 惑星 | 量 | ' + cs.map((c) => comboName(c.combo, cR(c.combo))).join(' | ') + ' |', '|---|---|' + cs.map(() => '---:|').join('')];
  for (const k of keys) {
    const it = cs.map((c) => c.items.find((x) => x.key === k));
    lines.push(`| ${RN[k]} | 自分の重み ÷ 源の重み | ${it.map((x) => fe(x.selfOverSrc)).join(' | ')} |`);
    lines.push(`| ${RN[k]} | 閉じた形の候補 ÷ 局所 ÷ 背景 | ${it.map((x) => fp(x.closedOverLoc)).join(' | ')} |`);
  }
  return lines.join('\n');
}
/** 表 8 「岩石の惑星は局所が効き、木星より外は背景だけ」の分け */
export function pictureTable(J) {
  const cR = (id) => (J.t1[0].rows.find((r) => r.combo === id) || {}).cR;
  return ['| 組 | 岩石の惑星(水星・地球・火星)の局所 ÷ 背景の最小 | 木星より外の局所 ÷ 背景の最大 | 岩石の惑星がどれも 0.1 を越える | 木星より外がどれも 0.1 の内 |', '|---|---:|---:|---|---|',
    ...J.t3.picture.map((p) => `| ${comboName(p.combo, cR(p.combo))} | ${fe(p.minRocky)} | ${fe(p.maxOuter)} | ${tf(p.rockyOver)} | ${tf(p.outerUnder)} |`)].join('\n');
}
export function tablesOf(J) {
  return { gate: gateTable(J), state: stateTable(J), prec: precTable(J), spin: spinTable(J), order: orderTable(J), closed: closedTable(J), picture: pictureTable(J) };
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const t1 = (k) => J.t1.find((b) => b.key === k).rows, me = t1('Mercury'), ea = t1('Earth'), ma = t1('Mars'), mo = t1('Moon'), io = t1('Io');
  const rng = (rs, f, g = fp) => { const v = rs.slice(1).map(f).filter(fin); return g(Math.min(...v)) + '〜' + g(Math.max(...v)); };
  const flipM = me.slice(1).filter((r) => r.relOm !== me[0].relOm).length, nC = me.length - 1;
  const ep = J.t2.prec.filter((r) => r.key === 'Earth'), mp = J.t2.prec.filter((r) => r.key === 'Mars');
  const pic = J.t3.picture.filter((p) => !p.k1), picAll = pic.every((p) => p.rockyOver && p.outerUnder);
  return {
    mercury: `水星: 合成の軸のまわりの回る向きが k 1 と替わる組は ${flipM}/${nC}。合成と L の角は ${rng(me, (r) => r.omToAxisDeg, fd)}°・公転の北極のまわりの回る向きはどの組でも ${sense(me[0].relOrb)}(k 1 と同じ)。リポジトリの傾き ε₀ ${fd(me[0].eps0Deg)}° に対し、公転の極に対する傾きの揺れの幅は k 1 で ${fd(me[0].wob.swingDeg)}°・組で ${rng(me, (r) => r.wob.swingDeg, fd)}°。`,
    earthMars: `地球: 円錐 ${fd(ea[0].coneDeg)}°(k 1)→ ${rng(ea, (r) => r.coneDeg, fd)}°・揺れの幅 ${fd(ea[0].wob.swingDeg)}° → ${rng(ea, (r) => r.wob.swingDeg, fd)}°。火星: 円錐 ${fd(ma[0].coneDeg)}° → ${rng(ma, (r) => r.coneDeg, fd)}°・揺れの幅 ${fd(ma[0].wob.swingDeg)}° → ${rng(ma, (r) => r.wob.swingDeg, fd)}°。地球・火星の歳差の回る向き(仮の値 —— 未照合)と同じ組は ${ep.filter((r) => r.provSame).length}/${ep.length}・${mp.filter((r) => r.provSame).length}/${mp.length}。`,
    rate: `軸引きずり ÷ 重力の側の列(比べる列): 地球 ${fe(ep[0].dragOverTide)}(k 1)→ ${rng(ep, (r) => r.dragOverTide, fe)}・火星 ${fe(mp[0].dragOverTide)} → ${rng(mp, (r) => r.dragOverTide, fe)}。残りを埋める c: 火星 ${fp(mp[0].cNeed)} → ${rng(mp, (r) => r.cNeed)}・地球(月の道の平均の列)${fp(ep[0].cNeedAvg)} → ${rng(ep, (r) => r.cNeedAvg)}・地球(固定の列)${fp(ep[0].cNeed)} → ${rng(ep, (r) => r.cNeed)}(仮・未照合)。`,
    moons: `月: 合成と公転の極の角 ${fd(mo[0].omToOrbDeg)}°(k 1)→ ${rng(mo, (r) => r.omToOrbDeg, fd)}°・自転と合成が逆になる組 ${mo.slice(1).filter((r) => r.spinOm === -1).length}/${nC}。イオ: ${fd(io[0].omToOrbDeg)}° → ${rng(io, (r) => r.omToOrbDeg, fd)}°・逆になる組 ${io.slice(1).filter((r) => r.spinOm === -1).length}/${nC}。`,
    order: `「岩石の惑星は局所が効き、木星より外は背景だけ」の分け(0.1 の物差し)は、金星の条件の組 ${pic.length} つの${picAll ? 'どれでも同じ' : 'うち ' + pic.filter((p) => p.rockyOver && p.outerUnder).length + ' つで同じ'}(岩石の惑星の最小 ${rng(J.t3.picture, (p) => p.minRocky, fe)}・木星より外の最大 ${rng(J.t3.picture, (p) => p.maxOuter, fe)})。`,
  };
}

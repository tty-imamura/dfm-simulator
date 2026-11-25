// 第353便za(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」・統括の検証項目 R491):
// **正本 tests/out/ktilt-353za.json から PHYSICS〔第353便za〕の表と数の文を作る文書の lib**
// (QA docs.ktilt353za が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353za-ktiltdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const fy = (x) => (x === null || x === undefined ? '届かない' : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const RN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Moon: '月', Io: 'イオ', Sun: '太陽' });
const GN = Object.freeze({ prov: '仮の値(未照合)', tide: '重力の側の潮汐のトルクの列', moonAvg: '月の道の 18.6 年の平均の列' });
const WN = Object.freeze({ 100: '100 年', 10000: '1 万年', 1000000: '100 万年', 4500000000: '45 億年' });
const wn = (y) => WN[y] || fe(y) + ' 年';
/** 組の名(表の見出し) */
export function comboName(id, cR) {
  if (id === 'k1') return 'k 1(k を置かない列)';
  if (id === 'rule') return '規則の半径';
  if (id === 'resp') return '(P-応)';
  return '(P-場) c_R ' + fp(cR) + (id === 'field-e2' ? '(2% の端)' : id === 'field-e5' ? '(5% の端)' : '');
}
const over = (v) => fe(v) + (fin(v) && v > 0.1 ? ' ▲' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '歳差の率: 潮汐を併用『「重力の側の潮汐のトルク」は、仮の値の 3〜11% の内に並びます。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1052: イ']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「見ている時間の間は変わらない」—— 見ている時間を観測の歴史の長さ(1 万年 —— 推奨の値)に、変わらないの物差しを 0.1°(推奨の値)に置いて、k を置いた列の傾きの変化を窓ごとに並べる(100 年・100 万年・45 億年と 1° も並べる)', '表 3・表 6']),
  Object.freeze(['観測値(いまの傾き・歳差の回る向き・公転面の集まり)に沿うかを、合否でなく「有り・無し・物差しなし」の 3 つの印で並べる材料にする', '表 6']),
  Object.freeze(['注目の列 u = 0.98(向きは (N+))。0.98 のまま金星を打ち消すには換算の係数 k で局所の大きさを合わせる(〔第353便j〕の組 8)—— その k を全部の受け手に同じに掛けた列(〔第353便q〕・〔第353便u〕)を読み直す', '表 3〜表 6']),
  Object.freeze(['歳差の本体を重力の側の列(比べる列 —— DFM の式ではない)に置き、軸引きずりを足す 2 つの軸(〔第353便x〕)で、k を置いた後の傾きの揺れを数える', '表 4']),
  Object.freeze(['歳差の率は重力の側の潮汐のトルクの列を基準に・軸引きずりは残り・向き・円錐・打ち消しを受け持つ小さい項(2 つの軸の読みを主の読みの 1 つとして並べる)', '表 4・表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const GATE_TEXT = Object.freeze({
  reachN: '0.1° と 1° に達する年 = 〔第353便n〕の tReach(k 1・地球・水星・火星 —— 最大の相対の差。地球 2.39e+6 年・水星 7.02e+5 年)',
  endN: '窓の終わりの ε の変化 = 〔第353便n〕の watchRow(k 1・地球・火星 × 1 万年・100 万年 —— 最大の相対の差)',
  swingU: '一周の揺れの幅 = 〔第353便u〕の nearState(受け手 5 × 組 9 —— 最大の相対の差。k 1 の地球 3.16°・水星 12.69°)',
  swingRangeU: '地球の揺れの幅の組 8 の範囲(〔第353便u〕の 7.84〜38.79°)',
  twoX: '2 つの軸(k 1・仮の値)= 〔第353便x〕の twoRow(地球・火星の一周の幅と 1 万年の窓 —— 最大の相対の差)',
  coZero: '共回り(公転面も同じ係数)では ε の変化 0(地球・火星・規則の半径 —— 45 億年の最大)',
  fWinE: '公転面が寄る f_輪 の下限 = 〔第353便e〕の fRingAt(0.98)・f の上限 = 〔第353便u〕(1.15e-2)',
  sunFlat: '太陽(k 1)の ε の変化(45 億年の最大 —— 丸めの床)',
  moonNone: '月の 2 つの軸は数なし(リポジトリに重力の側の率が無い)',
  kRule: '規則の半径で金星が等大の k(8.22e+11)',
  axisL: '基準軸 L・ω_G(統括の数え直し 3)',
  rejects: '拒否(受け手の名・窓 ≤ 0・読みの名・2 つの軸で f > 0・重力の側の列の名・u ≤ 0 —— RangeError)',
});
export function gateTable(J) {
  const S = J.pure.scenes, G = J.pure.gates, v = (k) => {
    if (k === 'reachN') return fe(S.reachVs);
    if (k === 'endN') return fe(S.endVs);
    if (k === 'swingU') return fe(S.swVs);
    if (k === 'swingRangeU') return fd(Math.min(...S.swE)) + '〜' + fd(Math.max(...S.swE));
    if (k === 'twoX') return fe(S.twoVs);
    if (k === 'coZero') return fe(S.coMax);
    if (k === 'fWinE') return fe(S.fRingBg);
    if (k === 'sunFlat') return fe(S.sunWin);
    if (k === 'moonNone') return '数なし';
    if (k === 'kRule') return fe(S.kr);
    if (k === 'axisL') return S.ax.map((x) => x.toFixed(6)).join(', ') + '・' + S.omegaG;
    if (k === 'rejects') return S.rejects.length + ' 本';
    return '—';
  };
  const circ = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';
  return ['| 零試験 | 値 | 真偽 |', '|---|---|---|', ...Object.keys(GATE_TEXT).map((k, i) => `| ${circ[i]} ${GATE_TEXT[k]} | ${v(k)} | ${tf(G[k])} |`)].join('\n');
}
/** 表 3: 受け手 7 × 組 9 × 窓 4(公転の極を固定・軸引きずりだけ・f 0) */
export function watchTable(J) {
  const C = J.t1[0].rows, head = '| 受け手 | 量 | ' + C.map((r) => comboName(r.combo, r.cR)).join(' | ') + ' |', sep = '|---|---|' + C.map(() => '---:|').join('');
  const L = [head, sep];
  for (const b of J.t1) {
    const nm = RN[b.key] + '(ε₀ ' + fd(b.rows[0].eps0Deg) + '°)';
    for (let i = 0; i < b.rows[0].win.length; i++) L.push(`| ${nm} | ${wn(b.rows[0].win[i].years)} の内の ε の変化の最大 ° | ` + b.rows.map((r) => over(r.win[i].winDeg)).join(' | ') + ' |');
    L.push(`| ${nm} | 0.1° に達する年 | ` + b.rows.map((r) => fy(r.reach['0.1'])).join(' | ') + ' |');
    L.push(`| ${nm} | 1° に達する年 | ` + b.rows.map((r) => fy(r.reach['1'])).join(' | ') + ' |');
    L.push(`| ${nm} | 一周の揺れの幅 ° | ` + b.rows.map((r) => fd(r.swingDeg)).join(' | ') + ' |');
    L.push(`| ${nm} | 一周 年 | ` + b.rows.map((r) => fe(r.periodYr)).join(' | ') + ' |');
  }
  return L.join('\n');
}
/** 表 4: 2 つの軸(地球・火星 —— 重力の側の列は比べる列)・月とイオは数なし */
export function twoTable(J) {
  const C = J.t1[0].rows, head = '| 受け手 | 重力の側の列(比べる列 —— DFM の式ではない) | 量 | ' + C.map((r) => comboName(r.combo, r.cR)).join(' | ') + ' |', sep = '|---|---|---|' + C.map(() => '---:|').join('');
  const L = [head, sep], R = J.t2.rows, keys = [...new Set(R.map((r) => r.key))];
  for (const key of keys) {
    for (const g of [...new Set(R.filter((r) => r.key === key).map((r) => r.grav))]) {
      const rs = C.map((c) => R.find((r) => r.key === key && r.grav === g && r.combo === c.combo)), gn = GN[g] + '(' + fp(rs[0].gravAsYr) + '″/年)' + (g === 'prov' ? ' ※' : '');
      L.push(`| ${RN[key]} | ${gn} | 一周の幅 ° | ` + rs.map((r) => fe(r.swingDeg)).join(' | ') + ' |');
      L.push(`| ${RN[key]} | ${gn} | 1 万年の内の変化の最大 ° | ` + rs.map((r) => fe(r.win1e4)).join(' | ') + ' |');
      L.push(`| ${RN[key]} | ${gn} | 45 億年の内の変化の最大 ° | ` + rs.map((r) => fe(r.winAge)).join(' | ') + ' |');
    }
    const rs = C.map((c) => R.find((r) => r.key === key && r.grav === 'prov' && r.combo === c.combo));
    L.push(`| ${RN[key]} | なし(軸引きずりだけ —— 表 3 と同じ) | 一周の幅 ° | ` + rs.map((r) => fd(r.dragSwingDeg)).join(' | ') + ' |');
  }
  for (const n of J.t2.none) L.push(`| ${RN[n.key]} | リポジトリに率が無い | 一周の幅 ° | ` + C.map(() => '数なし').join(' | ') + ' |');
  return L.join('\n');
}
/** 表 5: 寄る割合の窓(受け手 6 × 組 9) */
export function fTable(J) {
  const C = J.t1[0].rows, head = '| 受け手 | 量 | ' + C.map((r) => comboName(r.combo, r.cR)).join(' | ') + ' |', sep = '|---|---|' + C.map(() => '---:|').join('');
  const L = [head, sep], keys = [...new Set(J.t3.map((r) => r.key))];
  for (const key of keys) {
    const rs = C.map((c) => J.t3.find((r) => r.key === key && r.combo === c.combo));
    L.push(`| ${RN[key]} | 傾きを保つ f の上限(q10) | ` + rs.map((r) => (r.noLimit ? '上限なし' : fe(r.fMax))).join(' | ') + ' |');
    L.push(`| ${RN[key]} | f_輪 の下限(背景だけ)÷ f の上限 | ` + rs.map((r) => fp(r.gapBg) + (r.windowBg ? ' ○' : '')).join(' | ') + ' |');
    L.push(`| ${RN[key]} | f_輪 の下限(組の合成)÷ f の上限 | ` + rs.map((r) => (r.gapW === null ? '寄れない' : fp(r.gapW) + (r.windowW ? ' ○' : ''))).join(' | ') + ' |');
  }
  return L.join('\n');
}
const TOPIC = Object.freeze({ tilt1e4: '傾きの変化〔1 万年〕', swing: '傾きの揺れ〔一周〕', sense: '歳差の回る向き', fwin: '寄る割合の窓' });
/** 表 6: 1 枚のまとめ(題 4 × 列 3) */
export function sumTable(J) {
  const cols = J.t4.cols, cR = (id) => J.t1[0].rows.find((r) => r.combo === id).cR;
  const L = ['| 題 | 物差し | ' + cols.map((id) => comboName(id, cR(id))).join(' | ') + ' |', '|---|---|' + cols.map(() => '---|').join('')];
  for (const r of J.t4.rows) {
    const cell = (c) => {
      if (r.topic === 'tilt1e4') return `${fe(c.value)}°(${RN[c.key]})・比 ${fe(c.ratio)}・地球 ${fe(c.earth)}°(2 つの軸 ${fe(c.earthTwo)}°)—— ${c.mark}`;
      if (r.topic === 'swing') return `${fd(c.value)}°・比 ${fp(c.ratio)}・一周 ${fe(c.periodYr)} 年(2 つの軸 ${fe(c.twoSwing)}°・${fe(c.twoPeriodYr)} 年)—— ${c.mark}`;
      if (r.topic === 'sense') return `同じ向き ${c.value}/${c.of} ※ —— ${c.mark}`;
      return `比 ${fp(c.ratio)}(f の上限 ${fe(c.fMax)}・f_輪 ${fe(c.fRingBg)}・組の合成で ${fp(c.gapW)})—— ${c.mark}`;
    };
    L.push(`| ${TOPIC[r.topic]} | ${r.scale} | ` + r.cells.map(cell).join(' | ') + ' |');
  }
  return L.join('\n');
}
export function tablesOf(J) {
  return { 2: gateTable(J), 3: watchTable(J), 4: twoTable(J), 5: fTable(J), 6: sumTable(J) };
}
export function factsOf(J) {
  const all = J.t1.flatMap((b) => b.rows.map((r) => ({ key: b.key, combo: r.combo, cR: r.cR, w: r.win, reach: r.reach })));
  const nW = (i) => all.filter((x) => x.w[i].over01), mx1 = all.reduce((a, b) => (b.w[1].winDeg > a.w[1].winDeg ? b : a));
  const rk = all.filter((x) => x.combo !== 'k1' && x.reach['0.1'] !== null), mn = rk.reduce((a, b) => (b.reach['0.1'] < a.reach['0.1'] ? b : a));
  const ea = J.t1.find((b) => b.key === 'Earth').rows, rng = (rs, f, g = fe) => { const v = rs.map(f).filter(fin); return g(Math.min(...v)) + '〜' + g(Math.max(...v)); };
  const e2 = J.t2.rows.filter((r) => r.key === 'Earth' && r.grav === 'prov'), m2 = J.t2.rows.filter((r) => r.key === 'Mars' && r.grav === 'prov');
  const fe3 = J.t3.filter((r) => r.key === 'Earth'), fm3 = J.t3.filter((r) => r.key === 'Mars'), w3 = J.t3.filter((r) => r.windowBg);
  const keysOf = (xs) => [...new Set(xs.map((x) => RN[x.key]))].join('・') || 'なし';
  return {
    window: `1 万年の窓で ε の変化が 0.1° を越える行は、受け手 7 × 組 9 の ${all.length} 行のうち ${nW(1).length}(最大は ${RN[mx1.key]}・${comboName(mx1.combo, mx1.cR)} の ${fe(mx1.w[1].winDeg)}° —— 物差しの ${fe(mx1.w[1].winDeg / 0.1)} 倍)。100 年では ${nW(0).length}・100 万年では ${nW(2).length}(${keysOf(nW(2))})・45 億年では ${nW(3).length}。`,
    reach: `k を置いた組で 0.1° に達するのが最も早いのは ${RN[mn.key]}・${comboName(mn.combo, mn.cR)} の ${fe(mn.reach['0.1'])} 年(観測の歴史の長さ 1 万年の ${fp(mn.reach['0.1'] / 1e4)} 倍)。地球は k 1 で ${fe(ea[0].reach['0.1'])} 年・組で ${rng(ea.slice(1), (r) => r.reach['0.1'])} 年。`,
    two: `2 つの軸(仮の値 ※ —— 重力の側の列は比べる列): 地球の一周の幅 ${fe(e2[0].swingDeg)}°(k 1)→ ${rng(e2.slice(1), (r) => r.swingDeg)}°・1 万年の変化 ${fe(e2[0].win1e4)}° → ${rng(e2.slice(1), (r) => r.win1e4)}°。火星 ${fe(m2[0].swingDeg)}° → ${rng(m2.slice(1), (r) => r.swingDeg)}°。月・イオは数なし。`,
    fwin: `寄る割合の窓: 地球の f_輪 の下限(背景だけ)÷ f の上限は ${fp(fe3[0].gapBg)}(k 1)→ ${rng(fe3.slice(1), (r) => r.gapBg, fp)}・組の合成の大きさで読むと ${rng(fe3.slice(1), (r) => r.gapW, fp)}。火星 ${fp(fm3[0].gapBg)} → ${rng(fm3.slice(1), (r) => r.gapBg, fp)}。同じ f で両方が入る行(背景だけの読み)は ${w3.length}(${keysOf(w3)})。`,
    sun: `太陽(基準軸 L に対する傾き ${fd(J.t1.find((b) => b.key === 'Sun').rows[0].eps0Deg)}°)の ε の変化は、どの組でも 45 億年で ${fe(Math.max(...J.t1.find((b) => b.key === 'Sun').rows.map((r) => r.win[3].winDeg)))}° 以下(惑星由来の局所が背景の 1e-10 の桁)。`,
  };
}

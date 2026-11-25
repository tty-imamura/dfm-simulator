// 第353便e(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R469):
// **正本 tests/out/focus098-353e.json から PHYSICS〔第353便e〕の表と数の文を作る文書の lib**
// (QA docs.focus098_353e が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353e-focus098doc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const KEYN = Object.freeze({ 'Mercury|Sun': '水星', 'Venus|Sun': '金星', 'Earth|Sun': '地球', 'Mars|Sun': '火星', 'Jupiter|Sun': '木星', 'Saturn|Sun': '土星', 'Uranus|Sun': '天王星', 'Neptune|Sun': '海王星', 'Sun|-': '太陽' });
const COLN = Object.freeze({ NpF: '(N+) × 0.98(注目の列)', GmF: '(G−) × 0.98(比べる列)', NpTop: '(N+) × 窓の上端(比べる列)', Np1: '(N+) × 倍率 1(比べる列)' });
const DIRN = Object.freeze({ Np: '(N+)', Gm: '(G−)' });
const CLSN = Object.freeze({ dir: '向きだけで決まる', mag: '大きさだけで決まる', both: '両方に依る', none: '動かない' });
const TOPN = Object.freeze({ prec: '惑星の歳差の率(地球)', tilt: '惑星の傾き(地球)', sunTilt: '太陽の傾き', vCancel: '金星の打ち消し(局所 ÷ 背景)', vRev: '金星の逆回転', ioHeat: 'イオの内部熱', lock: '潮汐ロック(イオ)', ring: '土星の環(B 環・1° 傾き)', plane: '公転面の集まり(地球の道の輪)' });
const BGN = Object.freeze({ NpL: '(N+) L', Gm: '(G−)' });
const tri = (v) => fe(v) + (fin(v) && v > 1 + 1e-6 ? ' ▲' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1058: 置かない']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['注目の列 u = 0.98(背景の大きさ ÷ 銀河の公転の角速度)。向きは基準軸の向き (N+) のまま、大きさだけ 0.98 を置いて数える。0.98 は〔第352便y〕の (G−) の窓の上端 0.984 の近くの数で、(N+) の窓の上端 0.835 より上に在る', '表 3・表 4・表 5']),
  Object.freeze(['背景の大きさを 1 つの値には置かない(窓のまま)。注目の列は窓と並べる列', '表 4・表 5']),
  Object.freeze(['背景の向きの主の列 = (N+) 太陽系の基準軸の向き。(G−) は比べる列として残す', '表 3・表 6']),
  Object.freeze(['主の成分 (S)・背景 (N+) の幾何(太陽の円錐・金星の打ち消し)を、向きと大きさのどちらで決まるかに分けて数える', '表 6・表 7・表 8・表 9']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① (N+) × 0.98 の f の上限(q10・規則の半径・k 1)= 統括の数え直し 3(水星・金星・地球・火星・木星・土星・天王星・海王星) | ${Object.values(S.fNp).map(fe).join('・')} | ${tf(G.fNp)} |`,
    `| ② (G−) × 0.98 の f の上限(地球・木星) | ${Object.values(S.fGm).map(fe).join('・')} | ${tf(G.fGm)} |`,
    `| ③ 〔第352便y〕の窓の数(下限・上限 (N+)・上限 (G−) —— f 1e-3) | ${fp(S.lo)}・${fp(S.hiNp)}・${fp(S.hiGm)} | ${tf(G.window)} |`,
    `| ④ k 1 の状態 = 〔第352便w〕の stateW(地球の円錐) | ${fd(S.thSame[0])}° | ${tf(G.stateSame)} |`,
    `| ⑤ k は局所だけに掛かる(合成 − (背景 + k × 局所) の相対) | ${fe(S.kAdd)} | ${tf(G.kLocal)} |`,
    `| ⑥ 合成と背景の角: 直交成分の式 = 外積の式 | ${fd(S.angle[1])}° | ${tf(G.angleDirect)} |`,
    `| ⑦ 背景だけの歳差の一周(k₂ 1)= 太陽の一周 | ${fe(S.bgOnly)} 年 | ${tf(G.bgOnly)} |`,
    `| ⑧ 金星の条件の倍率 ÷ k・0.98 で等大の k | ${fe(S.uV)}・${fe(S.kV)} | ${tf(G.venus)} |`,
    `| ⑨ 基準軸 L・ω_G(統括の数え直し 3) | (${S.axL.map((x) => x.toFixed(6)).join(', ')})・${fe(S.omegaG)} rad/s | ${tf(G.axisL)} |`,
    `| ⑩ 分けの関数(向きだけ・大きさだけ・両方・動かない) | ${S.cl.dir}・${S.cl.mag}・${S.cl.both}・${S.cl.none} | ${tf(G.classify)} |`,
    `| ⑪ 拒否(向きの名・負の k・W 0) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  const R = J.t1.rows, rw = (col, key) => R.find((r) => r.col === col && r.key === key);
  T.t1 = ['| 受け手 | (N+) × 0.98: 合成と基準軸の角 ° | 円錐 ° | f の上限 | f_輪 の下限 ÷ f の上限 | (G−) × 0.98: 円錐 ° | f の上限 | (N+) × 窓の上端: f の上限 | (N+) × 倍率 1: f の上限 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.decl.keys.map((k) => { const a = rw('NpF', k), g = rw('GmF', k), t = rw('NpTop', k), o = rw('Np1', k);
      return `| ${KEYN[k]} | ${fd(a.omAxisDeg)} | ${fd(a.thDeg)} | ${fe(a.fMax)} | ${fp(a.ringOverF)} | ${fd(g.thDeg)} | ${fe(g.fMax)} | ${fe(t.fMax)} | ${fe(o.fMax)} |`; })].join('\n');
  T.t1min = ['| 列 | u | 最小の受け手(f の上限) | 歳差の一周(k₂ 1)年 | 太陽が年齢の内に回る周 | f_輪 の下限 | f_輪 の下限 ÷ 最小の f の上限 |', '|---|---|---|---|---|---|---|',
    ...J.t1.min.map((m) => { const s = rw(m.col, 'Sun|-'); return `| ${COLN[m.col]} | ${fp(m.u)} | ${KEYN[m.minKeyAll]}(${fe(m.minFAll)}) | ${fe(s.periodYr)} | ${fp(s.turnsAge)} | ${fe(m.fRing)} | ${fp(m.ringOverMin)} |`; })].join('\n');
  T.top = ['| f | (N+) の上端 u | (G−) の上端 u | (G−) ÷ (N+) |', '|---|---|---|---|',
    ...[...new Set(J.t1.top.map((r) => r.f))].map((f) => { const n = J.t1.top.find((r) => r.f === f && r.dir === 'Np').u, g = J.t1.top.find((r) => r.f === f && r.dir === 'Gm').u; return `| ${fe(f)} | ${fp(n)} | ${fp(g)} | ${fp(g / n)} |`; })].join('\n');
  const us = J.t2[0].us, uh = us.map((u, i) => (J.decl.uGrid[i] === 'uV' ? '(uV) ' + fe(u) : u < 1e-2 ? fe(u) : fp(u)));
  const fv = (r, v) => (v === null || v === undefined ? '届かない' : r.kind === 'deg' ? fd(v) : fe(v));
  T.t2v = ['| 条件 | 向き | ' + uh.join(' | ') + ' |', '|---|---|' + us.map(() => '---|').join(''),
    ...J.t2.flatMap((r) => ['Np', 'Gm'].map((d) => `| ${r.label} | ${DIRN[d]} | ${r.vals[d].map((v) => fv(r, v)).join(' | ')} |`))].join('\n');
  const dd = (r, x) => (r.kind === 'deg' ? fd(x) + '°' : fe(x));
  T.t2c = ['| 条件 | 当たり所 | 全格子: 向きの差 | 大きさの差 | 分け | 窓の下限から上(u ≥ 0.0487): 向きの差 | 大きさの差 | 分け |', '|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${r.label} | ${r.obs} | ${dd(r, r.all.dirDiff)} | ${dd(r, r.all.magDiff)} | ${CLSN[r.all.cls]} | ${dd(r, r.win.dirDiff)} | ${dd(r, r.win.magDiff)} | ${CLSN[r.win.cls]} |`)].join('\n');
  const tp = (topic, bg) => J.t3.topics.find((r) => r.topic === topic && r.bg === bg);
  T.t3 = ['| 題 | (N+) L: k 1 | (N+) L: k = 金星で等大 | (G−): k 1 | (G−): k = 金星で等大 |', '|---|---|---|---|---|',
    ...Object.keys(TOPN).map((t) => `| ${TOPN[t]} | ${tri(tp(t, 'NpL').v1)} | ${tri(tp(t, 'NpL').vK)} | ${tri(tp(t, 'Gm').v1)} | ${tri(tp(t, 'Gm').vK)} |`)].join('\n');
  const rv = (key, one) => J.t3.recv.find((r) => r.key === key && (one ? r.k === 1 : r.k !== 1));
  T.t3r = ['| 受け手 | k 1: 局所 ÷ 背景 | k = 金星で等大: 局所 ÷ 背景 | 合成 ÷ 背景 | 合成と背景の角 ° | 円錐 °(k 1 → 金星で等大) | f の上限(k 1 → 金星で等大) |', '|---|---|---|---|---|---|---|',
    ...J.decl.keys.map((k) => { const a = rv(k, true), b = rv(k, false); return `| ${KEYN[k]} | ${fe(a.locOverBg)} | ${fe(b.locOverBg)} | ${fe(b.omOverBg)} | ${fd(b.omBgDeg)} | ${fd(a.thDeg)} → ${fd(b.thDeg)} | ${fe(a.fMax)} → ${fe(b.fMax)} |`; })].join('\n');
  return T;
}

/** 数の文(節に逐語で置く) */
export function factsOf(J) {
  const F = {}, R = J.t1.rows, rw = (col, key) => R.find((r) => r.col === col && r.key === key), mn = (col) => J.t1.min.find((m) => m.col === col);
  const np = R.filter((r) => r.col === 'NpF'), maxAx = Math.max(...np.map((r) => r.omAxisDeg));
  F.t1 = `(N+) × 0.98 では、9 受け手とも合成の向きは基準軸 L から ${fe(maxAx)}° 以内(背景がほぼ全部)・円錐は太陽 ${fd(rw('NpF', 'Sun|-').thDeg)}°・地球 ${fd(rw('NpF', 'Earth|Sun').thDeg)}°・金星 ${fd(rw('NpF', 'Venus|Sun').thDeg)}°。傾きを年齢の間 10% 以内に保つ寄る割合 f の上限の最小は${KEYN[mn('NpF').minKeyAll]} ${fe(mn('NpF').minFAll)}(太陽 ${fe(rw('NpF', 'Sun|-').fMax)}・地球 ${fe(rw('NpF', 'Earth|Sun').fMax)})—— 0.98 は (N+) の窓の上。寄る割合が ${fe(mn('NpF').minFAll)} 以下なら、8 惑星と太陽の傾きは保たれる。`;
  F.t1b = `単位の応答(k₂ 1)の歳差の一周は (N+) × 0.98 で ${fe(rw('NpF', 'Sun|-').periodYr)} 年(背景だけの値と同じ)・太陽は年齢の内に ${fp(rw('NpF', 'Sun|-').turnsAge)} 周。公転面が寄る f_輪 の下限 ${fe(mn('NpF').fRing)} は、最小の f の上限の ${fp(mn('NpF').ringOverMin)} 倍(比べる列 (G−) × 0.98 では ${fp(mn('GmF').ringOverMin)} 倍)。`;
  const t = (f, d) => J.t1.top.find((r) => r.f === f && r.dir === d).u;
  F.top = `窓の上端は向きで変わる: f 1e-3 で (N+) ${fp(t(1e-3, 'Np'))}・(G−) ${fp(t(1e-3, 'Gm'))}(比 ${fp(t(1e-3, 'Gm') / t(1e-3, 'Np'))} —— f を替えても同じ比)。上端は f にほぼ反比例する(f 1e-2 で (N+) ${fp(t(1e-2, 'Np'))}・f 1e-4 で ${fp(t(1e-4, 'Np'))})。`;
  const C = (id) => J.t2.find((r) => r.id === id), cls = (id, w) => CLSN[C(id)[w].cls];
  F.t2 = `窓の下限から上(u ≥ 0.0487)では、太陽の円錐と地球の合成と基準軸の角は${cls('sunCone', 'win')}・太陽の周の数と公転面が寄る条件と歳差の率の残り(仮)は${cls('sunTurns', 'win')}・地球の傾きを保つ f の上限だけが${cls('keepEarth', 'win')}(向きの差 ${fe(C('keepEarth').win.dirDiff)})。金星の打ち消しと地球の合成と背景の角は、窓の下限から上では${cls('venusCancel', 'win')}(金星の合成 ÷ 背景 = 1 —— 全格子では ${cls('venusCancel', 'all')}: (uV) の点でだけ (N+) ${fe(C('venusCancel').vals.Np[0])}・(G−) ${fe(C('venusCancel').vals.Gm[0])})。`;
  const rv = (key, one) => J.t3.recv.find((r) => r.key === key && (one ? r.k === 1 : r.k !== 1)), tp = (topic, bg) => J.t3.topics.find((r) => r.topic === topic && r.bg === bg);
  F.t3 = `規則の半径では、金星で等大になる倍率は ${fe(J.t3.uV)} × k —— 0.98 に置くと k = ${fe(J.t3.kV)}。この k を全部の受け手に掛けると、金星の合成 ÷ 背景は ${fe(rv('Venus|Sun', false).omOverBg)}(円錐 ${fd(rv('Venus|Sun', false).thDeg)}°)・地球の合成は背景から ${fd(rv('Earth|Sun', false).omBgDeg)}° ずれ(円錐 ${fd(rv('Earth|Sun', false).thDeg)}°)・水星は局所が背景の ${fp(rv('Mercury|Sun', false).locOverBg)} 倍(円錐 ${fd(rv('Mercury|Sun', false).thDeg)}°)。公転面の集まりの欄は ${fe(tp('plane', 'NpL').v1)} → ${fe(tp('plane', 'NpL').vK)}・土星の環の欄は ${fe(tp('ring', 'NpL').v1)} → ${fe(tp('ring', 'NpL').vK)}。k 1 のままなら金星の合成 ÷ 背景は ${fp(rv('Venus|Sun', true).omOverBg)}(局所 ÷ 背景 ${fe(rv('Venus|Sun', true).locOverBg)} —— 打ち消さない)。`;
  return F;
}

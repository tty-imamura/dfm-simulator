// 第352便o(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R452):
// **正本 tests/out/obsradius-352o.json から PHYSICS〔第352便o〕の表と数の文を作る文書の lib**
// (QA docs.obsradius352o が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角の差の床は 1e-9 度〔それより小さいものは 0 と書く〕)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352o-obsradiusdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const fd = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 1e-9 ? '0' : Number(x).toExponential(2));   // 角の差(床 1e-9 度)
const CN = Object.freeze({ 'R-M1': '規則・M1(在位)', 'O-M1': '観測・M1', 'R-q1.2': '規則・q 1.2', 'O-q1.2': '観測・q 1.2', 'R-q0': '規則・q 0', 'O-q0': '観測・q 0' });
const FN = Object.freeze({ M1: 'M1(球のモーメント)', 'q1.2': 'q 1.2', q0: 'q 0' });
const BN = Object.freeze({ NpL: '(N+) L', NpEq: '(N+) eq', Gm: '(G−)' });
const PJ = Object.freeze({ 'Mercury|Sun': '水星', 'Venus|Sun': '金星', 'Earth|Sun': '地球', 'Mars|Sun': '火星', 'Jupiter|Sun': '木星', 'Saturn|Sun': '土星', 'Uranus|Sun': '天王星', 'Neptune|Sun': '海王星', 'Sun|-': '太陽',
  'Moon|EarthHi': '月(地球の高い自転)', 'Moon|EarthLo': '月(地球の低い自転)', 'Io|Jupiter': 'イオ', 'Pluto|Charon': '冥王星(カロン由来)', 'Charon|Pluto': 'カロン(冥王星由来)' });
const PL = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足)', '軸引きずりは、並進引きずりで引きずられる側の、近い面と遠い面の差分なので、赤道面では源の回転と逆回転になる']),
  Object.freeze(['原仮定者の回答(2026-11-18 —— 第141報 AN790)', '天体の特性を表す係数のノブにする']),
]);
export const READINGS = Object.freeze([
  '局所の軸引きずりの主の成分 = (S) 源の自転の分。(S) の大きさは源の半径の置き方で 9 桁動く —— 本節は「源の半径 = 観測の半径」の列を規則の半径の列と同じ重さで主な表に通す。後半は予想の文',
  '「逆回転」の向きを持つ形(球のモーメント・q 1.2)を主に、向きが順になる形(q 0 —— 落ちない形)を比べる列に置く',
  '源の半径の置き方と形を、天体の特性の係数の候補の 1 つと読む(統括の読み —— 同じノブとは決めない)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 既定(規則の半径・M1)の局所の (S) が〔第351便e〕の `localOf`(16 組)・太陽の行が〔第352便e〕の `sunLocal` と同じ(相対の差)', `${fe(S.vsLocal)}・${fe(S.vsSun)}`, G.localVsJ],
      ['② 太陽を受け手にした口の既定が〔第352便e〕の `rotOf` と同じ(8 惑星 × 成分 3 × 読み 2)', fe(S.vsRotOf), G.sunVsRotOf],
      ['③ 1 つのセルの既定が〔第352便j〕の `cellOf` と同じ(11 行 × 背景 2 × 基準軸 2 × 向き 2 —— Ω・角・方位の率・傾きの率)', fe(S.vsCell), G.cellVsJ],
      ['④〔第352便k〕の表の数: 金星の条件の倍率 ÷ k(規則・観測・q 0)と `spinRot` と同じ', `${S.uV.rule.toExponential(5)}・${S.uV.obs.toExponential(2)}・${S.uV.q0.toExponential(2)}/${fe(S.vsK)}`, G.anchorK],
      ['⑤ M1 で (S) が源の半径の 2 乗に比例(太陽由来・母天体由来〔イオ〕・太陽を受け手に〔地球由来〕)', fe(S.sq), G.radiusSq],
      ['⑥ q 0 は源の半径に依らない(母天体由来・太陽を受け手に)', fe(S.q0inv), G.q0Indep],
      ['⑦ 金星の 2 つの読み: 大きさが同じの残りがセルの合成 ÷ 背景と同じ・合成が最小の点の前後 ±0.1% で大きくなる', `${fe(S.magErr)}・${S.minOk ? '真' : '偽'}`, G.venusTwo],
      ['⑧ 換算の係数 k は局所の項にだけ掛かる(k 2 は 2 倍)', fe(S.k2), G.kLocal],
      ['⑨ 変異: 局所を落とすと金星の打ち消しが消える・列の局所を渡さない `cellOf` では観測の半径の倍率で金星は打ち消さない', `${S.muts.noLocal ? '真' : '偽'}・${S.muts.plain ? '真' : '偽'}`, G.mutants],
      ['⑩ 入力の拒否(列・組・成分・t・背景の向き・形)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  { const g = (col, key, bg) => J.t1.find((r) => r.col === col && r.key === key && r.bg === bg && r.axis === 'L' && r.sense === 'g2m'), rows = [];
    for (const c of J.decl.cols) for (const key of J.decl.rows) { const n = g(c, key, 'Np'), m = g(c, key, 'Gm');
      rows.push(`| ${CN[c]} | ${PJ[key]} | ${fe(n.omAsYr)} | ${fe(n.periodYr)} | ${f3(n.refDeg)} | ${f3(n.coneDeg)} | ${fe(m.omAsYr)} | ${f3(m.refDeg)} | ${f3(m.coneDeg)} |`); }
    T.t1 = '| 列(源の半径・形) | 受け手 | (N+) 合成 ″/年 | (N+) 一周 [年] | (N+) 合成と基準軸 ° | (N+) 円錐 ° | (G−) 合成 ″/年 | (G−) 合成と基準軸 ° | (G−) 円錐 ° |\n|---|---|---|---|---|---|---|---|---|\n' + rows.join('\n'); }
  { const rows = [];
    for (const f of J.decl.forms) for (const key of J.decl.rows) { const d = (bg) => J.diff.find((r) => r.form === f && r.key === key && r.bg === bg && r.axis === 'L'), n = d('Np'), m = d('Gm');
      rows.push(`| ${FN[f]} | ${PJ[key]} | ${fd(n.dRef)} | ${fd(n.dCone)} | ${fe(n.rateRatio)} | ${fd(m.dRef)} | ${fd(m.dCone)} | ${fe(m.rateRatio)} | ${n.flips.length + m.flips.length} |`); }
    T.diff = '| 形 | 受け手 | (N+) 基準軸の角の差 ° | (N+) 円錐の差 ° | (N+) 率の比 | (G−) 基準軸の角の差 ° | (G−) 円錐の差 ° | (G−) 率の比 | 回る向きが替わる極の数 |\n|---|---|---|---|---|---|---|---|---|\n' + rows.join('\n'); }
  T.t2 = '| 列(源の半径・形) | 背景の向き | cos(背景, S_金星) | 大きさが同じの倍率 ÷ k | 大きさが同じの残り | 合成が最小の倍率 ÷ k | 合成が最小の残り | 最小 ÷ 同じ |\n|---|---|---|---|---|---|---|---|\n'
    + J.t2.map((r) => `| ${CN[r.col]} | ${BN[r.bg]} | ${f3(r.cos)} | ${fe(r.uMag)} | ${f3(r.residMag)} | ${fe(r.uMin)} | ${r.residMin === null ? '最小は 0(打ち消さない)' : f3(r.residMin)} | ${f3(r.minOverMag)} |`).join('\n');
  T.t3 = '| 列(源の半径・形) | 背景の向き・基準軸 | 要る k | 地球 ″/年 | 地球 一周 [年] | 火星 ″/年 | 火星 一周 [年] | 太陽 ″/年 | 太陽 一周 [年] | 地球に要る倍(仮) | 火星に要る倍(仮) |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.t3.map((r) => { const R = r.rates; return `| ${CN[r.col]} | ${r.bg === 'Np' ? '(N+)' : '(G−)'} ${r.axis} | ${fe(r.kNeed)} | ${fe(R['Earth|Sun'].asYr)} | ${fe(R['Earth|Sun'].periodYr)} | ${fe(R['Mars|Sun'].asYr)} | ${fe(R['Mars|Sun'].periodYr)} | ${fe(R['Sun|-'].asYr)} | ${fe(R['Sun|-'].periodYr)} | ${fe(r.needEarth)} | ${fe(r.needMars)} |`; }).join('\n');
  T.t4 = '| 列(惑星の源の半径・形) | 惑星由来の (S) の和 ″/年 | 背景 (uV) ″/年 | 和 ÷ 背景 | 最も大きい源(和に占める割合) | (N+) L の円錐 ° | 局所を入れた円錐の差 ° | (G−) の円錐 ° | 局所を入れた円錐の差 ° |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.t4.map((r) => `| ${CN[r.col]} | ${fe(r.sumAsYr)} | ${fe(r.bgAsYr)} | ${fe(r.sumOverBg)} | ${PL[r.big]}(${f3(r.bigShare)}) | ${f3(r.coneNpL)} | ${fd(r.dConeNpL)} | ${f3(r.coneGm)} | ${fd(r.dConeGm)} |`).join('\n');
  T.t5 = '| 列(源の半径・形) | 衛星 | 母天体由来 ÷ 太陽由来 | 母天体由来 ÷ 背景 | cos(ŝ, 母天体由来) | 合成 ÷ 背景 (N+) L | 合成 ÷ 背景 (N+) eq | 合成 ÷ 背景 (G−) | (N+) L 円錐 ° |\n|---|---|---|---|---|---|---|---|---|\n'
    + J.t5.map((r) => `| ${CN[r.col]} | ${PJ[r.key]} | ${fe(r.parOverSun)} | ${fe(r.parOverBg)} | ${f3(r.cosParS)} | ${f3(r.totNpL)} | ${f3(r.totNpEq)} | ${f3(r.totGm)} | ${f3(r.coneNpL)} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, S = J.summary, uV = J.uV;
  F.uv = `金星の条件(大きさが同じ)が決める倍率 ÷ k は、規則の半径・M1(在位)で ${uV['R-M1'].toExponential(5)}・観測の半径・M1 で ${fe(uV['O-M1'])}・規則の半径・q 1.2 で ${fe(uV['R-q1.2'])}・観測の半径・q 1.2 で ${fe(uV['O-q1.2'])}・q 0 で ${fe(uV['R-q0'])}(源の半径に依らない)。`;
  F.dir = `M1 では、観測の半径の列は規則の半径の列と比べて、8 惑星の合成と基準軸の角・円錐の差が ${Math.max(S.M1.planetsMaxDRef, S.M1.planetsMaxDCone) < 1e-9 ? '床(1e-9°)より小さく' : '最大 ' + fd(S.M1.planetsMaxDRef) + '°・' + fd(S.M1.planetsMaxDCone) + '° で'}、率だけが ${rng([S.M1.planetsRateLo, S.M1.planetsRateHi], fe)} 倍になる(回る向きが替わる極 ${S.M1.planetsFlips})。`
    + `太陽の行は円錐が最大 ${fd(S.M1.sunMaxDCone)}° 動く(惑星由来の局所の項が背景に対して大きくなる分)。`;
  F.q12 = `q 1.2 では、観測の半径にすると 8 惑星の合成と基準軸の角が最大 ${f3(S['q1.2'].planetsMaxDRef)}°・円錐が最大 ${f3(S['q1.2'].planetsMaxDCone)}° 動き、率は ${rng([S['q1.2'].planetsRateLo, S['q1.2'].planetsRateHi], fe)} 倍(惑星ごとに違う —— 回る向きが替わる極 ${S['q1.2'].planetsFlips})。q 0 は 2 つの列が同じ。`;
  { const g = (c, b) => J.t2.find((r) => r.col === c && r.bg === b);
    F.venus = `金星の (N+) での残りは、大きさが同じの読みで M1 の規則の半径 ${f3(g('R-M1', 'NpL').residMag)}(L)・${f3(g('R-M1', 'NpEq').residMag)}(eq)、観測の半径 ${f3(g('O-M1', 'NpL').residMag)}(L)・${f3(g('O-M1', 'NpEq').residMag)}(eq)、`
      + `q 1.2 の観測の半径 ${f3(g('O-q1.2', 'NpL').residMag)}(L)。合成が最小の読みとの倍率の比は M1 で ${f3(g('O-M1', 'NpL').minOverMag)}((N+) L)・${f3(g('O-M1', 'Gm').minOverMag)}((G−))。q 0 は (N+) で打ち消さない(残り ${f3(g('O-q0', 'NpL').residMag)})。`; }
  { const g = (c) => J.t3.find((r) => r.col === c && r.bg === 'Np' && r.axis === 'L');
    F.k = `背景を銀河の公転の角速度そのまま(倍率 1)に置くと、金星の条件に要る k は規則の半径・M1 で ${fe(g('R-M1').kNeed)}・観測の半径・M1 で ${fe(g('O-M1').kNeed)}・観測の半径・q 1.2 で ${fe(g('O-q1.2').kNeed)}・q 0 で ${fe(g('R-q0').kNeed)}。`
      + `そのときの地球の合成の率は M1 で ${fe(g('O-M1').rates['Earth|Sun'].asYr)}″/年(一周 ${fe(g('O-M1').rates['Earth|Sun'].periodYr)} 年 —— 規則の半径の列と同じ数)・太陽は ${fe(g('O-M1').rates['Sun|-'].asYr)}″/年(一周 ${fe(g('O-M1').rates['Sun|-'].periodYr)} 年)。`
      + `仮の比べる数(仮・未照合)に単位の応答で届くのに要る倍は、地球 ${rng(J.t3.map((r) => r.needEarth), fe)}・火星 ${rng(J.t3.map((r) => r.needMars), fe)}。`; }
  { const g = (c) => J.t4.find((r) => r.col === c);
    F.sun = `太陽を受け手にしたとき、惑星由来の (S) の和 ÷ 背景 (uV) は、規則の半径・M1 で ${fe(g('R-M1').sumOverBg)}・観測の半径・M1 で ${fe(g('O-M1').sumOverBg)}・観測の半径・q 1.2 で ${fe(g('O-q1.2').sumOverBg)}・q 0 で ${fe(g('R-q0').sumOverBg)}。`
      + `円錐の差は最大 ${rng(J.t4.map((r) => Math.max(Math.abs(r.dConeNpL), Math.abs(r.dConeGm))), fe)}°(最も大きい源はどの列も${PL[g('O-M1').big]})。`; }
  { const g = (c, k) => J.t5.find((r) => r.col === c && r.key === k);
    F.sat = `イオは、規則の半径・M1 で母天体由来 ÷ 背景 ${f3(g('R-M1', 'Io|Jupiter').parOverBg)}・合成 ÷ 背景 ${f3(g('R-M1', 'Io|Jupiter').totNpL)}((N+) L)、観測の半径・M1 では母天体由来 ÷ 背景 ${fe(g('O-M1', 'Io|Jupiter').parOverBg)}・合成 ÷ 背景 ${fe(g('O-M1', 'Io|Jupiter').totNpL)}(木星の (S) が主 —— 打ち消しの行ではなくなる)。`
      + `月は母天体由来 ÷ 太陽由来が ${fe(g('R-M1', 'Moon|EarthHi').parOverSun)} から ${f3(g('O-M1', 'Moon|EarthHi').parOverSun)} に(地球の高い自転の行)・合成 ÷ 背景 ${f3(g('R-M1', 'Moon|EarthHi').totNpL)} から ${f3(g('O-M1', 'Moon|EarthHi').totNpL)} に。`; }
  return F;
}

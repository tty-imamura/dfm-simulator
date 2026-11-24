// 第352便c(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R440):
// **正本 tests/out/refaxis-352c.json から PHYSICS〔第352便c〕の表を作る文書の lib**
// (QA docs.refaxis352c が節の表と逐語で照合する —— 角は小数 3 桁・成分は小数 7 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352c-refaxisdoc-1';
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f7 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(7));
const sg = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 5e-4 ? '0.000' : (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(3));
const sm = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 1e-9 ? '< 1e-9' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const v7 = (a) => '(' + a.map(f7).join(', ') + ')';
const NM = Object.freeze({ Sun: '太陽', Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン' });
const CN = Object.freeze({ eq: '等しい重み (eq)', L: '角運動量の重み (L)', La: '質量 × √a の重み (La)', ecl: '黄道の極 (ecl)', med: '球面上の中央値 (med)', noMer: '水星を外す', giant4: '巨大惑星 4 つ', rock4: '地球型 4 つ', eqPluto: '冥王星を足す (eq)', LPluto: '冥王星を足す (L)' });
const AX = Object.freeze({ eq: 'eq', L: 'L', ecl: 'ecl' });
const DN = Object.freeze({ sun: '太陽の自転軸', Gm: '(G−) 銀河の回転と逆向き', ngp: '銀河の面の法線(北極)', Gp: '(G+) 銀河の回転の軸', gc: '銀河中心の向き', eclPole: '黄道の極', node: '銀河の面と基準面の交線' });
const BN = Object.freeze({ Gm: '(G−)', Gp: '(G+)', Np: '(N+)', Nm: '(N−)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の公転面は、原始太陽系の円盤引きずりに由来する。公転面に薄く集まる事で、惑星の形成を促進した']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「多くの天体の公転面に垂直」= 8 惑星の公転の法線の平均の向き —— 重みの置き方は決めない(等しい重み・角運動量の重み・黄道の極・中央値・部分集合を並べる)。「歳差運動の中心軸」は読み (ア) 各天体の歳差の中心 = 自分の公転の法線・(イ) 中心 = 基準軸そのもの、の 2 つを並べる', '表 2・表 3・表 4']),
  Object.freeze(['読み (イ) では、太陽の円錐の半頂角 = 太陽の自転軸と基準軸の角。背景の向き (N+)(基準軸の向き)を主に置くと、この角が背景だけに応答する太陽の円錐になる —— 基準軸の候補の違いがそのまま出る', '表 5・表 7']),
  Object.freeze(['予想の文 —— 今の積分に入れない・結果と書かない(公転面の由来は数えていない)', '(数えていない)']),
  Object.freeze(['予想の文 —— 数えるのは幾何だけ: 基準軸に垂直な面での、太陽の自転軸が傾いている方位と、銀河の向きの方位の差', '表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.decl.anchor;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 統括の数え直しの軸: 等しい重み ${v7(A.eq)}・質量 × √a の重み ${v7(A.La)}(成分 5e-7 の内) | ${v7(S.anc.eq)}・${v7(S.anc.La)} | ${tf(G.anchorAxes)} |`,
    `| ② 太陽の自転軸との角 [°](${A.sunEq}・${A.sunLa}・${A.sunEcl} —— 小数 3 桁) | ${f3(S.anc.sunEq)}・${f3(S.anc.sunLa)}・${f3(S.anc.sunEcl)} | ${tf(G.anchorSun)} |`,
    `| ③ 1 つ外した等しい重みの軸の動き [°](最小 ${A.looMin}・最大 ${A.looMax}・最大は水星) | ${f3(Math.min(...S.anc.loo))}〜${f3(Math.max(...S.anc.loo))}・${NM[S.looMaxId]} | ${tf(G.anchorLoo)} |`,
    `| ④ 背景の向き (G−) との角 [°](eq ${A.bgEq}・La ${A.bgLa}・ecl ${A.bgEcl}・太陽の自転軸 ${A.bgSun})と、(G−) と銀河の面の法線の角 | ${f3(S.anc.bgEq)}・${f3(S.anc.bgLa)}・${f3(S.anc.bgEcl)}・${f3(S.anc.bgSun)}・${sm(S.gmIsNgp)} | ${tf(G.anchorBg)} |`,
    `| ⑤ 重みを全部同じにした L の作りが eq と同じ(床 < 1e-9) | ${sm(S.sameW)} | ${tf(G.sameWeights)} |`,
    `| ⑥ 公転の法線を全部 1 本にそろえた変異で eq・L・La・中央値がその 1 本になる | ${sm(S.oneAx)} | ${tf(G.oneNormal)} |`,
    `| ⑦ 中央値の自己試験(z のまわりに 90° ごと・z から 10° の 4 本の中央値は z)[°] | ${sm(S.medSym)} | ${tf(G.median)} |`,
    `| ⑧ 方位の自己試験(黄道の極のまわりで x̂ は 0°・ŷ は +90°・極そのものは方位なし) | ${S.azT.map((x) => (x === null ? 'なし' : f3(x))).join('・')} | ${tf(G.azimuth)} |`,
    `| ⑨ 角の道具(45° の差・1e-10 rad の小さな角を atan2 で) | ${sm(S.angT.a)}・${sm(S.angT.small)} | ${tf(G.angleTool)} |`,
    `| ⑩ 入力の拒否(軸の名・ecl の 1 つ外し・空の群・負の重み・長さ 2 の向き 2 つ) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.cand = ['| 候補 | 成分(黄道 J2000) | eq との角 [°] | L との角 [°] | ecl との角 [°] | 中央値との角 [°] | 太陽の自転軸との角 [°] | 8 惑星の公転の法線の散らばり: 角の二乗平均・最大・角の和 [°] |', '|---|---|---|---|---|---|---|---|',
    ...J.cand.map((r) => `| ${CN[r.name]} | ${v7(r.axis)} | ${f3(r.toEq)} | ${f3(r.toL)} | ${f3(r.toEcl)} | ${f3(r.toMed)} | ${f3(r.sunDeg)} | ${f3(r.rms)}・${f3(r.max)}・${f3(r.sum)} |`)].join('\n');
  T.loo = ['| 外した天体 | eq の動き [°] | L の動き [°] | 外した eq と太陽の自転軸の角 [°] | 外した L と太陽の自転軸の角 [°] |', '|---|---|---|---|---|',
    ...J.loo.map((r) => `| ${NM[r.out]} | ${f3(r.eq)} | ${f3(r.L)} | ${f3(r.sunEq)} | ${f3(r.sunL)} |`)].join('\n');
  const PLN = J.decl.planets;
  T.reading = ['| 読み | 歳差の中心の群 | 中心の群の平均と eq の角 [°] | eq のまわりの中心の散らばり(角の二乗平均)[°] | 円錐の半頂角: ' + PLN.map((id) => NM[id]).join('・') + ' [°] | 8 惑星の平均 [°] |', '|---|---|---|---|---|---|',
    ...J.reading.map((r) => `| ${r.reading === 'A' ? '(ア) 中心 = 自分の公転の法線' : '(イ) 中心 = 基準軸(eq)'} | ${r.reading === 'A' ? '公転の法線 8 本' : '基準軸 1 本'} | ${f3(r.centersMeanToEq)} | ${f3(r.centersRms)} | ${r.cones.map(f3).join('・')} | ${f3(r.coneMean)} |`)].join('\n');
  T.cone = ['| 天体 | 行の扱い | 自転軸と自分の公転の法線の角(これまでの傾き)[°] | eq: 円錐の半頂角・差 [°] | L: 円錐の半頂角・差 [°] | ecl: 円錐の半頂角・差 [°] |', '|---|---|---|---|---|---|',
    ...J.cone.map((r) => `| ${NM[r.id]} | ${r.role} | ${f3(r.obl)} | ${f3(r.eq.cone)}・${sg(r.eq.diff)} | ${f3(r.L.cone)}・${sg(r.L.diff)} | ${f3(r.ecl.cone)}・${sg(r.ecl.diff)} |`)].join('\n');
  T.az = ['| 基準軸 | 向き | 基準軸からの角 [°] | 方位 [°] | 太陽の傾きの方位との差 [°] |', '|---|---|---|---|---|',
    ...J.az.map((r) => `| ${AX[r.axis]} | ${DN[r.dir]} | ${f3(r.offDeg)} | ${r.az === null ? 'なし' : sg(r.az)} | ${r.dAzSun === null ? '—' : sg(r.dAzSun)} |`)].join('\n');
  T.bg = ['| 基準軸 | 背景の向き | 背景と基準軸の角 [°] | 背景と太陽の自転軸の角 [°] | 背景と eq の角 [°] | 背景と ecl の角 [°] |', '|---|---|---|---|---|---|',
    ...J.bg.map((r) => `| ${AX[r.axis]} | ${BN[r.bg]} | ${f3(r.toAxis)} | ${f3(r.toSun)} | ${f3(r.toEq)} | ${f3(r.toEcl)} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, c = (n) => J.cand.find((r) => r.name === n), az = (ax, d) => J.az.find((r) => r.axis === ax && r.dir === d), bg = (ax, d) => J.bg.find((r) => r.axis === ax && r.bg === d), co = (id) => J.cone.find((r) => r.id === id);
  F.axes = `基準軸の候補(黄道 J2000): 等しい重み ${v7(c('eq').axis)}・角運動量の重み L ${v7(c('L').axis)}(質量 × √a の重みとの角 ${f3(c('La').toL)}°)・中央値 ${v7(c('med').axis)}。候補どうしの角: eq と L ${f3(c('L').toEq)}°・eq と ecl ${f3(c('ecl').toEq)}°・L と ecl ${f3(c('ecl').toL)}°・中央値と eq ${f3(c('med').toEq)}°・中央値と L ${f3(c('med').toL)}°`;
  F.spread = `8 惑星の公転の法線の散らばり(角の二乗平均): eq ${f3(c('eq').rms)}°・L ${f3(c('L').rms)}°・ecl ${f3(c('ecl').rms)}°・中央値 ${f3(c('med').rms)}°。角の和は中央値で ${f3(c('med').sum)}°(eq ${f3(c('eq').sum)}°・L ${f3(c('L').sum)}°・ecl ${f3(c('ecl').sum)}°)`;
  F.subsets = `部分集合: 水星を外すと eq から ${f3(c('noMer').toEq)}°・巨大惑星 4 つの eq は L から ${f3(c('giant4').toL)}°・地球型 4 つの eq は eq から ${f3(c('rock4').toEq)}°(太陽との角 ${f3(c('rock4').sunDeg)}°)・冥王星を足すと eq は ${f3(c('eqPluto').toEq)}° 動き(太陽との角 ${f3(c('eqPluto').sunDeg)}°)・L は ${f3(c('LPluto').toL)}° 動く`;
  const lmax = J.loo.reduce((b, r) => (r.L > b.L ? r : b));
  F.loo = `1 つ外した軸: eq は ${f3(Math.min(...J.loo.map((r) => r.eq)))}〜${f3(Math.max(...J.loo.map((r) => r.eq)))}°(最大は${NM[J.loo.reduce((b, r) => (r.eq > b.eq ? r : b)).out]})・L は ${f3(Math.min(...J.loo.map((r) => r.L)))}〜${f3(lmax.L)}°(最大は${NM[lmax.out]})`;
  F.sunCone = `太陽の円錐の半頂角(読み (イ) —— 太陽の自転軸と基準軸の角): eq ${f3(co('Sun').eq.cone)}°・L ${f3(co('Sun').L.cone)}°・ecl ${f3(co('Sun').ecl.cone)}°・中央値 ${f3(c('med').sunDeg)}°・地球型 4 つ ${f3(c('rock4').sunDeg)}°・冥王星を足した eq ${f3(c('eqPluto').sunDeg)}°`;
  F.cones = `円錐の半頂角とこれまでの傾きの差(eq・L・ecl): 水星 ${sg(co('Mercury').eq.diff)}・${sg(co('Mercury').L.diff)}・${sg(co('Mercury').ecl.diff)}°・金星 ${sg(co('Venus').eq.diff)}・${sg(co('Venus').L.diff)}・${sg(co('Venus').ecl.diff)}°・地球 ${sg(co('Earth').eq.diff)}・${sg(co('Earth').L.diff)}・${sg(co('Earth').ecl.diff)}°・海王星 ${sg(co('Neptune').eq.diff)}・${sg(co('Neptune').L.diff)}・${sg(co('Neptune').ecl.diff)}°`;
  F.az = `太陽の傾きの方位と (G+) 銀河の回転の軸の方位の差: eq ${sg(az('eq', 'Gp').dAzSun)}°・L ${sg(az('L', 'Gp').dAzSun)}°・ecl ${sg(az('ecl', 'Gp').dAzSun)}°/銀河中心の向きとの差: eq ${sg(az('eq', 'gc').dAzSun)}°・L ${sg(az('L', 'gc').dAzSun)}°・ecl ${sg(az('ecl', 'gc').dAzSun)}°/銀河の面と基準面の交線との差: eq ${sg(az('eq', 'node').dAzSun)}°・L ${sg(az('L', 'node').dAzSun)}°・ecl ${sg(az('ecl', 'node').dAzSun)}°`;
  F.bg = `背景の向きと基準軸の角: (G−) eq ${f3(bg('eq', 'Gm').toAxis)}°・L ${f3(bg('L', 'Gm').toAxis)}°・ecl ${f3(bg('ecl', 'Gm').toAxis)}°/(G+)(銀河の回転の軸)eq ${f3(bg('eq', 'Gp').toAxis)}°・L ${f3(bg('L', 'Gp').toAxis)}°・ecl ${f3(bg('ecl', 'Gp').toAxis)}°/(G+) と太陽の自転軸 ${f3(bg('eq', 'Gp').toSun)}°/(N+) と太陽の自転軸 eq ${f3(bg('eq', 'Np').toSun)}°・L ${f3(bg('L', 'Np').toSun)}°・ecl ${f3(bg('ecl', 'Np').toSun)}°`;
  return F;
}

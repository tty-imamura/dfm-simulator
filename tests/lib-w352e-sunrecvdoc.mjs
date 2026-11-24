// 第352便e(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R442):
// **正本 tests/out/sunrecv-352e.json から PHYSICS〔第352便e〕の表を作る文書の lib**
// (QA docs.sunrecv352e が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352e-sunrecvdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fe3 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(3));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const ag = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? '< 0.001' : Number(x).toFixed(3));
const sg = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', sum: '8 惑星の和' });
const DN = Object.freeze({ 'G-': '(G−)', 'G+': '(G+)', 'N+': '(N+)', 'N-': '(N−)' });
const PN = Object.freeze({ M: '(M)', S: '(S)', MS: '(MS)' });
const AXN = Object.freeze({ eq: '等重み', lw: '角運動量の重み', ecl: '黄道の極' });
const MG = (m) => (m === 'uV' ? '(uV)' : '倍率 ' + m);
const PK = Object.freeze({ gal: '銀河の公転の周期', age: '太陽系の年齢の宣言' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河の並進引きずりの計算が未確定なので、銀河の回転から軸引きずりの計算は出来ない。太陽系に及ぼす影響から逆算する段階']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '自転速度や、歳差運動の傾きは、天体の構造に左右されるので、先に銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['背景は銀河の回転からは作らず、太陽系への影響から逆に置く段階。本節は太陽を受け手に置き、太陽の向きと円錐から背景の向き・大きさの候補を列で持つ', '表 3・表 5・表 6']),
  Object.freeze(['「中心軸方向」= 合成の向き —— 背景が主なら背景の向き (N+) という読み。基準軸の候補は 8 惑星の公転の法線の等重み・質量 × √a の重み・黄道の極の 3 つ(どれかに決めない)', '表 2・表 3・表 4']),
  Object.freeze(['太陽の傾き(基準軸から 5〜7°)を「合成の軸のまわりの円錐の半頂角」と読めるのは、合成の軸が基準軸の近くに在る候補だけ。大きさは太陽の歳差の率の観測が無いので 1 つに決まらない —— 列と「何が分かれば決まるか」の表', '表 4・表 5・表 6・表 7']),
  Object.freeze(['構造のノブ(太陽の応答の係数 = 比 ω_T ÷ ω_L・k₂・構造の係数)は 1 を主に置き、背景の向きと円錐を先に置く。係数は率(周期)だけを変え、向きと円錐は変えない', '表 8']),
  Object.freeze(['局所の主の成分は (S)(源の自転の分)。太陽を受け手にしたときの惑星由来の (S) の大きさを背景と比べる。「弱いと推測する」は予想の文(結果と書かない)', '表 3']),
  Object.freeze(['背景の大きさの主の列 (uV) = 金星で太陽由来の (S) と背景の大きさが同じになる値(k 1 で銀河の公転の角速度の 1.19282e-12 倍 —— 決まるのは倍率 ÷ k)。後半の文は予想の文(本節では数えない)', '表 5・表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
/** 何が分かれば背景の大きさが決まるか(表 7 —— 数に依らない宣言の表) */
export const KNOWN = Object.freeze([
  Object.freeze(['太陽の歳差の率(または周期)', '無い(リポジトリに太陽の自転軸の方位の時間変化の数は無い)', '比 × k₂ を置けば背景の大きさ(表 6 の (i))', '観測の弧の長さで上限だけ置ける(仮の値の器の数 —— 本節では使わない)']),
  Object.freeze(['傾きを作る率 A(一定の向きへ倒す率)', '無い(候補: 銀河の円盤への引き寄せ —— 原仮定者の予想の文・円盤引きずり)', '半頂角と組めば歳差の率 Ω_p = A ÷ sin θ(表 6 の (ii) の逆)', '形成の文は予想の文 —— 今の積分に入れない']),
  Object.freeze(['太陽の応答の係数(比 ω_T ÷ ω_L・k₂・構造の係数)', '置き方を 1 を主に(構造のノブは後)', '率と背景の大きさの換算(表 8 —— 向きと円錐は変えない)', '比を 1 から動かすと周期は反比例']),
  Object.freeze(['背景の向き((N+)・(G−))', '伺っている(どちらにも寄せない)', '円錐の半頂角: (N+) 5.230°・(G−) 67.231°(表 4)', '(G−) では太陽の傾きを円錐と読めない(数だけ)']),
  Object.freeze(['基準軸の候補(等重み・角運動量の重み・黄道の極)', '3 つを並べる(枝 c の口が統合された後に差し替え)', '要る A の差は 1.14〜1.39 倍(表 6)', '1 つ外した等重みの軸の動き 0.12〜0.75°']),
]);
export function knownTable() {
  return ['| 分かれば決まる量 | 今の在り方 | 分かれば何が決まるか | 注 |', '|---|---|---|---|', ...KNOWN.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = S.anchor;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 入れ替える前の形: 本 lib の \`rotOf\` を第351便c の \`partRot\`(地球|太陽)と同じ入力で(成分 3 × 読み 2)—— 相対の差の最大 | ${S.vsPart === 0 ? '0' : fe(S.vsPart)} | ${tf(G.vsPartRot)} |`,
    `| ② 太陽を受け手に: (M) + (S) と (MS) の差 ÷ 大きい方((C2)・(W)) | ${S.lin === 0 && S.wLin === 0 ? '0・0' : fe(S.lin) + '・' + fe(S.wLin)} | ${tf(G.linear)} |`,
    `| ③ (S) を直接に数える(相対の速度 0 の場 —— (MS) の速度の倍率 0 と (S) の差) | ${S.sDirect.vel0 === 0 ? '0' : fe(S.sDirect.vel0)} | ${tf(G.sDirect)} |`,
    `| ④ 惑星の質量を 0 にした変異で (M)(S)(MS) が 0(木星) | ${S.mass0.join('・')} | ${tf(G.mass0)} |`,
    `| ⑤ 入れ替えの入力(受け手の質量 = 太陽・自転軸 = 太陽〔8 組で同じ〕・距離 = 惑星|太陽の組・源の軸 = 惑星の自転軸)の差の最大 | ${S.swap === 0 ? '0' : fe(S.swap)} | ${tf(G.swapInput)} |`,
    `| ⑥ 統括の数え直し 1: 基準軸(等重み・角運動量の重み)と太陽の自転軸との角(等重み・角運動量の重み・黄道の極) | ${A.refEq}/${A.refLw}/${A.sunDeg.eq}°・${A.sunDeg.lw}°・${A.sunDeg.ecl}° | ${tf(G.anchorRef)} |`,
    `| ⑦ 統括の数え直し 1: 背景 (G−) と太陽の自転軸の角・基準軸 3 つとの角 | ${A.gmSunDeg}°/${A.gmRefDeg.eq}°・${A.gmRefDeg.lw}°・${A.gmRefDeg.ecl}° | ${tf(G.anchorBg)} |`,
    `| ⑧ 統括の数え直し 1: 金星で大きさが同じになる倍率 (S)・(MS) と、(S) の倍率の背景の大きさ [rad/s] | ${A.uV}・${A.uVMS}・${A.bgVRadS} | ${tf(G.anchorUV)} |`,
    `| ⑨ 向きの約束: (G+) = −(G−)・(N−) = −(N+)・(G−) は第351便e の \`bgTerm\` と同じ・大きさ = ω_G × 倍率 | ${[S.dirs.gpm, S.dirs.npm, S.dirs.vsBB, S.dirs.mag].map((x) => (x === 0 ? '0' : fe(x))).join('・')} | ${tf(G.dirs)} |`,
    `| ⑩ 背景だけ(局所 0)の円錐: (N+) と (G−)・背景も 0 なら向きは決まらない(null) | ${S.cone.np}°・${S.cone.gm}°・${S.cone.nul ? 'null' : '—'} | ${tf(G.coneBgOnly)} |`,
    `| ⑪ 周期の往復: 倍率 1 の周期 = 2π ÷ ω_G・周期 → 倍率 → 周期・比 × k₂ = 10 で周期 1/10 | ${[S.period.galYr, S.period.round].map((x) => (x === 0 ? '0' : fe(x))).join('・')}・${S.period.scale < 1e-12 ? '< 1e-12' : fe(S.period.scale)} | ${tf(G.period)} |`,
    `| ⑫ 中心の点の步(無次元・Ω_p 1・A = sin 5.230°): ŝ* から始めた動きの最大 [°]・p̂ から始めた ŝ* との角の範囲 − 5.230 [°] | ${S.fixed.atStar === 0 ? '0' : fe(S.fixed.atStar)}・${f3(S.fixed.circMin)}〜${f3(S.fixed.circMax)} | ${tf(G.fixedPoint)} |`,
    `| ⑬ 入力の拒否(成分の名・読みの名・k −1・源が月・向きの名・倍率 −1・周期 0・大きさなし・A > Ω_p・合成の成分の名) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.local = ['| 源 | 成分 | 大きさ [″/年] | 太陽の自転軸との cos | 基準軸との角 [°]: 等重み・角運動量の重み・黄道の極 | 背景との比: 倍率 1・(uV) |', '|---|---|---|---|---|---|',
    ...J.local.flatMap((r) => ['M', 'S', 'MS'].map((p) => { const q = r.parts[p]; return `| ${NM[r.id]} | ${PN[p]} | ${fe(q.asYr)} | ${f3(q.cosSun)} | ${ag(q.eqDeg)}・${ag(q.lwDeg)}・${ag(q.eclDeg)} | ${fe(q.overBg1)}・${fe(q.overBgV)} |`; }))].join('\n');
  T.cone = ['| 背景の向き | 成分 | 背景の大きさ | 合成と太陽の自転軸の角(円錐の半頂角)[°] | 合成と基準軸の角 [°]: 等重み・角運動量の重み・黄道の極 | 合成と背景の角 [°] | 合成の大きさ [″/年] | 局所 ÷ 背景 | 等重みの軸から 0.5° の内 | 方位の率 [″/年] (g2+): 合成の軸のまわり・基準軸(等重み)のまわり | 傾きの率(基準軸)[″/年] |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.cone.map((r) => `| ${DN[r.dir]} | ${PN[r.part]} | ${MG(r.mag)} | ${f3(r.coneDeg)} | ${ag(r.eqDeg)}・${ag(r.lwDeg)}・${ag(r.eclDeg)} | ${ag(r.bgDeg)} | ${fe(r.magAsYr)} | ${fe(r.locOverBg)} | ${tf(r.near)} | ${sg(r.azComb)}・${sg(r.azRef)} | ${sg(r.incRef)} |`)].join('\n');
  T.period = ['| 背景の向き | 成分 | 背景の大きさ | 合成の大きさ [″/年] | 歳差の周期 [年](比 1・k₂ 1) | 太陽系の年齢の宣言の間に方位が進む角 [°]・周 | 銀河の公転の周期の間に進む角 [°]・周 | 円錐の半頂角 [°] |', '|---|---|---|---|---|---|---|---|',
    ...J.period.rows.map((r) => `| ${DN[r.dir]} | ${PN[r.part]} | ${MG(r.mag)} | ${fe(r.magAsYr)} | ${fe(r.periodYr)} | ${fe(r.ageDeg)}・${fe(r.ageTurns)} | ${fe(r.galDeg)}・${fe(r.galTurns)} | ${f3(r.coneDeg)} |`)].join('\n');
  T.invert = ['| 周期 | 周期 [年] | 背景の大きさ [rad/s] | 銀河の公転の角速度の倍 | [″/年] | (uV) の倍 |', '|---|---|---|---|---|---|',
    ...J.invert.inv.map((r) => `| ${PK[r.key] || '格子'} | ${fe(r.periodYr)} | ${fe(r.radS)} | ${fe(r.mult)} | ${fe(r.asYr)} | ${fe(r.overUV)} |`)].join('\n');
  T.need = ['| 背景の大きさ | 基準軸 | 半頂角 θ [°] | 歳差の率 Ω_p [″/年](比 1・k₂ 1) | 要る A = Ω_p sin θ [″/年] | 小角の式 Ω_p θ [″/年] | 小角の式の相対の差 |', '|---|---|---|---|---|---|---|',
    ...J.invert.need.map((r) => `| ${MG(r.mag)} | ${AXN[r.axis]} | ${f3(r.thDeg)} | ${fe(r.OpAsYr)} | ${fe(r.AAsYr)} | ${fe(r.AsmallAsYr)} | ${fe(r.smallRel)} |`)].join('\n');
  T.step = ['| 基準軸 | 半頂角 θ [°] | 中心の点 ŝ* と基準軸の角 [°] | ŝ* から始めた動きの最大 [°](無次元の時間 20) | 基準軸から始めた ŝ* との角の範囲 [°](1 周) |', '|---|---|---|---|---|',
    ...J.invert.step.map((r) => `| ${AXN[r.axis]} | ${f3(r.thDeg)} | ${f3(r.offDeg)} | ${r.stayDeg < 1e-6 ? '< 1e-6' : fe(r.stayDeg)} | ${f3(r.circMinDeg)}〜${f3(r.circMaxDeg)} |`)].join('\n');
  T.resp = ['| 背景の向き | 比 ω_T ÷ ω_L | k₂ | 円錐の半頂角 [°] | 合成と基準軸(等重み)の角 [°] | 歳差の周期 [年] | 周期 ÷ 比 1・k₂ 1 の周期 | 方位の率 [″/年] |', '|---|---|---|---|---|---|---|---|',
    ...J.resp.rows.map((r) => `| ${DN[r.dir]} | ${r.ratio} | ${r.kPrec} | ${f3(r.coneDeg)} | ${ag(r.eqDeg)} | ${fe(r.periodYr)} | ${f3(r.periodOverBase)} | ${fe(r.rateAsYr)} |`)].join('\n');
  T.diag = ['| 背景の向き | 換算の係数 k(局所の (S) に掛ける) | 円錐の半頂角 [°] | 合成と基準軸(等重み)の角 [°] | 合成の大きさ [″/年] |', '|---|---|---|---|---|',
    ...J.resp.diag.map((r) => `| ${DN[r.dir]} | ${r.k === 1 ? '1(主)' : fe(r.k) + '(診断 —— 8 惑星の (S) の和を (uV) の背景の大きさに)'} | ${f3(r.coneDeg)} | ${ag(r.eqDeg)} | ${fe(r.magAsYr)} |`)].join('\n');
  T.known = knownTable();
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, sum = J.local[J.local.length - 1].parts, ju = J.local.find((r) => r.id === 'Jupiter').parts;
  const c = (dir, part, mag) => J.cone.find((r) => r.dir === dir && r.part === part && r.mag === mag), p = (dir, part, mag) => J.period.rows.find((r) => r.dir === dir && r.part === part && r.mag === mag);
  F.local = `太陽を受け手にした 8 惑星の和: (M) ${fe(sum.M.asYr)}″/年(太陽の自転軸との cos ${f3(sum.M.cosSun)}・等重みの基準軸との角 ${ag(sum.M.eqDeg)}°・角運動量の重みの軸 ${ag(sum.M.lwDeg)}°・黄道の極 ${ag(sum.M.eclDeg)}°)/(S) ${fe(sum.S.asYr)}″/年(cos ${f3(sum.S.cosSun)}・等重みの軸との角 ${ag(sum.S.eqDeg)}°)。(S) の和のうち木星が ${f3(ju.S.asYr / sum.S.asYr)}`;
  F.ratio = `局所の (S) の和 ÷ 背景の大きさ: (uV) で ${fe(sum.S.overBgV)}・倍率 1 で ${fe(sum.S.overBg1)}/局所の (M) の和 ÷ 背景: (uV) で ${fe(sum.M.overBgV)}・倍率 1 で ${fe(sum.M.overBg1)}`;
  F.cone = `円錐の半頂角(成分 (S)・(uV)): (N+) ${f3(c('N+', 'S', 'uV').coneDeg)}°・(G−) ${f3(c('G-', 'S', 'uV').coneDeg)}°・(G+) ${f3(c('G+', 'S', 'uV').coneDeg)}°・(N−) ${f3(c('N-', 'S', 'uV').coneDeg)}°/成分 (MS)・(uV) では 4 つとも ${f3(c('N+', 'MS', 'uV').coneDeg)}°(合成と等重みの軸の角 ${ag(c('N+', 'MS', 'uV').eqDeg)}°)・(MS)・倍率 1 では (N+) ${f3(c('N+', 'MS', 1).coneDeg)}°・(G−) ${f3(c('G-', 'MS', 1).coneDeg)}°`;
  F.near = `等重みの軸から 0.5° の内に合成が在る組: ${J.cone.filter((r) => r.near).map((r) => DN[r.dir] + PN[r.part] + MG(r.mag)).join('・')}(${J.cone.filter((r) => r.near).length}/${J.cone.length})`;
  F.period = `歳差の周期(比 1・k₂ 1・成分 (S)): (uV) ${fe(p('N+', 'S', 'uV').periodYr)} 年・倍率 1 ${fe(p('N+', 'S', 1).periodYr)} 年(銀河の公転の周期 ${fe(J.period.galYr)} 年)・倍率 8500 ${fe(p('N+', 'S', 8500).periodYr)} 年。太陽系の年齢の宣言 ${fe(J.period.ageYr)} 年の間に方位が進む角: (uV) ${fe(p('N+', 'S', 'uV').ageDeg)}°・倍率 1 ${fe(p('N+', 'S', 1).ageDeg)}°(${fe(p('N+', 'S', 1).ageTurns)} 周)/成分 (MS)・(uV) では ${fe(p('N+', 'MS', 'uV').periodYr)} 年(局所の (M) が主)`;
  const inv = (k) => J.invert.inv.find((r) => r.key === k), nd = (m, a) => J.invert.need.find((r) => r.mag === m && r.axis === a);
  F.invert = `周期が太陽系の年齢の宣言と同じなら背景は銀河の公転の角速度の ${fe(inv('age').mult)} 倍((uV) の ${fe(inv('age').overUV)} 倍)・銀河の公転の周期と同じなら 1 倍。半頂角 5.230° を中心の点の離れに保つのに要る A: (uV) ${fe(nd('uV', 'eq').AAsYr)}″/年・倍率 1 ${fe(nd(1, 'eq').AAsYr)}″/年・倍率 8500 ${fe(nd(8500, 'eq').AAsYr)}″/年(角運動量の重み 5.968° で ${f3(nd(1, 'lw').AAsYr / nd(1, 'eq').AAsYr)} 倍・黄道の極 7.252° で ${f3(nd(1, 'ecl').AAsYr / nd(1, 'eq').AAsYr)} 倍)`;
  const st = J.invert.step.find((r) => r.axis === 'eq');
  F.step = `中心の点の步(等重み・5.230°): ŝ* から始めると動きの最大 ${st.stayDeg < 1e-6 ? '< 1e-6' : fe(st.stayDeg)}°・基準軸から始めると ŝ* との角は ${f3(st.circMinDeg)}〜${f3(st.circMaxDeg)}°(球面の上では円から ${f3(st.circMaxDeg - st.circMinDeg)}° 外れる)`;
  const dg = (dir) => J.resp.diag.find((r) => r.dir === dir && r.k !== 1);
  F.diag = `診断の列: 8 惑星の (S) の和を (uV) の背景の大きさに持ち上げる k は ${fe(J.resp.kStar)}。そのとき (N+) の円錐 ${f3(dg('N+').coneDeg)}°・合成の大きさ ${fe(dg('N+').magAsYr)}″/年(背景だけの ${f3(dg('N+').magAsYr / c('N+', 'S', 'uV').magAsYr)} 倍)・(G−) の円錐 ${f3(dg('G-').coneDeg)}°`;
  return F;
}

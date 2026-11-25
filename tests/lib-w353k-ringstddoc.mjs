// 第353便k(原仮定者の回答(2026-11-25 —— 第151報)AN1045・統括の検証項目 R475):
// **正本 tests/out/ringstd-353k.json から PHYSICS〔第353便k〕の表を作る文書の lib**
// (QA docs.ringstd353k が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353k-ringstddoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const KEYN = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環' });
const PLN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星' });
/** 表 3 の列の名(主の列を先頭に —— 比べる列は「比べる列」と明記) */
export const COLN = Object.freeze({
  stdO0F2: '主: 源 規則 (O0)・受け手 観測 × c_R(F2)', stdO1F2: '主: 源 規則 (O1)・受け手 観測 × c_R(F2)', stdO2bF2: '主: 源 規則 (O2b)・受け手 観測 × c_R(F2)',
  stdO0F1: '主: 源 規則 (O0)・受け手 観測 × c_R(F1)', stdO2bF1: '主: 源 規則 (O2b)・受け手 観測 × c_R(F1)',
  h353C2: '比べる列: 〔第353便h〕の (C2)(源 観測・受け手 規則)', ruleRule: '比べる列: 軸引きずりの (S)・規則の半径(受け手 規則)', obsRule: '比べる列: 軸引きずりの (S)・観測の半径(受け手 規則)', obsObsF2: '比べる列: 源 観測 (O1)・受け手 観測 × c_R(F2)' });
export const PLANEN = Object.freeze({ stdO0: '主: 源 規則 (O0)・受け手 観測 × 1', stdO2b: '主: 源 規則 (O2b)・受け手 観測 × 1', stdO0cR01: '主: 源 規則 (O0)・受け手 観測 × 0.1',
  ruleRule: '比べる列: 源 規則・受け手 規則(〔第352便za〕の (S) 規則)', obsRule: '比べる列: 源 観測・受け手 規則(〔第352便za〕の (S) 観測)', obsObs: '比べる列: 源 観測 (O1)・受け手 観測 × 1' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1059: 推奨']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['円盤引きずりの側の輪の場を、源の半径 = 規則の半径・源の扁平(〔第353便d〕の候補)・受け手(輪の粒子)の自分の重み = 観測半径 × 構造の係数 c_R で作る(回答の基準)。これまでの場(〔第353便h〕—— 源 観測・受け手 規則)は比べる列に残す。「計算が合う方式」は表で選ぶ(本節は選ばない)', '表 3・表 4・表 5・表 6・表 7・表 8']),
  Object.freeze(['推奨 = 物差しから遠い列も表のまま持つ(省かない)', '表 3・表 8']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, cols = J.cols.map((c) => c.id);
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① (F2) 源 観測・受け手 規則・球 = 〔第353便h〕の diskRow((S)・(C1)(C2) —— 相対差の最大・区分 5 × 読み 2) | ${fl9(Math.max(...S.vsDisk))} | ${tf(G.vsDisk)} |`,
    `| ② (F1) 受け手 規則・球 = 〔第353便h〕の axialRow(源の半径 2 —— 相対差の最大・区分 5 × 2) | ${fl9(Math.max(...S.vsAx))} | ${tf(G.vsAx)} |`,
    `| ③ 〔第353便h〕の比べる数: (C2) ÷ (S) 観測・(C2) の最小と最大・(S) 規則の最小 | ${S.c2OverObs[0].toFixed(3)}・${S.c2Lo.toPrecision(3)}〜${S.c2Hi.toPrecision(3)}・${S.ruleLo.toPrecision(3)} | ${tf(G.anchor353h)} |`,
    `| ④ ringStdOm の既定 = 〔第352便s〕の ringRot((S)・A 環・傾き 3° —— 相対差) | ${fl9(S.vsRingRot)} | ${tf(G.vsRingRot)} |`,
    `| ⑤ 公転面: 受け手 規則・球 = 〔第352便za〕の題「公転面の集まり」(源の半径 2 —— 相対差の最大) | ${fl9(Math.max(...S.vsPlane))} | ${tf(G.vsPlane)} |`,
    `| ⑥ (O2b) の率 ÷ 球の率 と σ(B 環・F2) | ${S.o2bRatio.toFixed(5)}・${S.o2bSigma.toFixed(5)} | ${tf(G.o2b)} |`,
    `| ⑦ 共通の点検の数: 基準軸 L の z 成分・(uV)・金星の φ(c_R 1) | ${S.L[2].toFixed(6)}・${S.uV.toPrecision(6)}・${S.venusPhiCR1.toFixed(2)}° | ${tf(G.common)} |`,
    `| ⑧ 閉じた形: a★ での自分の重み ÷ 源の重み・規則の半径と同じ重みの c_R での重みの比 | ${S.aStarRatio.toFixed(4)}・${S.cRRule.toFixed(4)} | ${tf(G.closed)} |`,
    `| ⑨ 拒否(源の半径の名・扁平の名・読みの名・負の大きさ・傾き 0・c_R 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.yard = ['| 区分 | 半径 ÷ 土星の観測の半径 | ' + cols.map((c) => COLN[c]).join(' | ') + ' |', '|---|---|' + cols.map(() => '---|').join(''),
    ...J.t1.map((r) => `| ${KEYN[r.key]} | ${r.rOverRobs.toFixed(3)} | ${cols.map((c) => fe(r.yard[c])).join(' | ')} |`)].join('\n');
  const nc = ['stdO0F2', 'stdO2bF2', 'stdO0F1', 'h353C2'];
  T.need = ['| 区分 | ' + nc.map((c) => COLN[c]).join(' | ') + ' | 主 (O0)(F2) ÷ 比べる列 (C2) |', '|---|' + nc.map(() => '---|').join('') + '---|',
    ...J.t1.map((r) => `| ${KEYN[r.key]} | ${nc.map((c) => fe(r.need[c])).join(' | ')} | ${fe(r.yard.stdO0F2 / r.yard.h353C2)} |`)].join('\n');
  const DIRN = { std: '主: 源 規則・受け手 観測 × c_R(粒子 1 m・c_R 1)', h353C2: '比べる列: 源 観測・受け手 規則(〔第353便h〕)', ruleRule: '比べる列: 源 規則・受け手 規則', obsObs: '比べる列: 源 観測・受け手 観測 × c_R' };
  T.dir = ['| 置き方(B 環・F2・球) | (C2) 率 ÷ 物差し | (C2) 輪の回転と法線の cos | (C1) 率 ÷ 物差し | (C1) cos | 受け手の自分の重み ÷ 源の重み |', '|---|---|---|---|---|---|',
    ...J.t1dir.map((r) => `| ${DIRN[r.id]} | ${fe(r.C2.yard)} | ${fe(r.C2.cos)} | ${fe(r.C1.yard)} | ${fe(r.C1.cos)} | ${fe(r.C2.A0OverWS)} |`)].join('\n');
  T.ob = ['| 区分 | 主: 源 規則・受け手 観測 × c_R | 比べる列: 源 観測・受け手 規則(〔第353便h〕) | 比べる列: 源 観測・受け手 観測 × c_R |', '|---|---|---|---|',
    ...J.t1ob.map((r) => `| ${KEYN[r.key]} | ${fl9(Math.abs(r.std))} | ${fe(r.h353)} | ${fl9(Math.abs(r.obsObs))} |`)].join('\n');
  T.recv = ['| 粒子の大きさ a(m) | c_R | (F2) 率 ÷ 物差し | (F1) 率 ÷ 物差し | 自分の重み ÷ 源の重み(F2) | 自分の重み ÷(源 + 太陽の重み)(F1) |', '|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${r.a} | ${r.cR} | ${fe(r.yardF2)} | ${fe(r.yardF1)} | ${fe(r.A0OverWS)} | ${fe(r.A0OverWF1)} |`)].join('\n');
  T.sweep = ['| 粒子の大きさ a(m —— 格子の外・c_R 1) | (F2) 率 ÷ 物差し | 輪の回転と法線の cos | 自分の重み ÷ 源の重み |', '|---|---|---|---|',
    ...J.t2.sweep.map((r) => `| ${fe(r.a)} | ${fe(r.yard)} | ${fe(r.cos)} | ${fe(r.A0OverWS)} |`)].join('\n')
    + '\n\n' + ['| c_R | a★(自分の重み = 源の重み・m) |', '|---|---|', ...J.t2.aStar.map((r) => `| ${r.cR} | ${fe(r.a)} |`)].join('\n')
    + '\n\n' + ['| 粒子の大きさ a(m) | 規則の半径の受け手と同じ自分の重みになる c_R |', '|---|---|', ...J.t2.cRRule.map((r) => `| ${r.a} | ${fe(r.cR)} |`)].join('\n');
  const pc = Object.keys(PLANEN);
  T.plane = ['| 惑星 | ' + pc.map((c) => PLANEN[c]).join(' | ') + ' | 自分の重み ÷ 源の重み(受け手 観測 × 1) |', '|---|' + pc.map(() => '---|').join('') + '---|',
    ...J.t3.map((r) => `| ${PLN[r.id]} | ${pc.map((c) => fe(r.v[c])).join(' | ')} | ${fe(r.A0OverWS.stdO0)} |`)].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, mm = (c) => [Math.min(...J.t1.map((r) => r.yard[c])), Math.max(...J.t1.map((r) => r.yard[c]))];
  const [a0, a1] = mm('stdO0F2'), [b0, b1] = mm('stdO0F1'), [c0, c1] = mm('h353C2'), [d0, d1] = mm('obsObsF2'), [e0, e1] = mm('ruleRule');
  const n0 = Math.min(...J.t1.map((r) => r.need.stdO0F2)), n1 = Math.max(...J.t1.map((r) => r.need.stdO0F2));
  const o1 = J.t1.map((r) => r.yard.stdO1F2 / r.yard.stdO0F2), o2 = J.t1.map((r) => r.yard.stdO2bF2 / r.yard.stdO0F2);
  F.main = `回答の基準(源 = 規則の半径・受け手 = 粒子 1 m × c_R 1)の率 ÷ 環の物差しは、(F2) ${fe(a0)}〜${fe(a1)}・(F1) ${fe(b0)}〜${fe(b1)} —— 物差しに届くのに要る倍は (F2) ${fe(n0)}〜${fe(n1)}。比べる列は、〔第353便h〕の (C2) ${fe(c0)}〜${fe(c1)}・源 規則 + 受け手 規則 ${fe(e0)}〜${fe(e1)}・源 観測 + 受け手 観測 ${fe(d0)}〜${fe(d1)}`;
  F.ob = `源の扁平の倍(F2): (O1) ÷ (O0) ${Math.min(...o1).toFixed(4)}〜${Math.max(...o1).toFixed(4)}・(O2b) ÷ (O0) ${Math.min(...o2).toFixed(4)}〜${Math.max(...o2).toFixed(4)}`;
  const y2 = J.t2.rows.map((r) => r.yardF2), w2 = J.t2.rows.map((r) => r.A0OverWS);
  F.recv = `粒子の大きさ 0.01〜10 m × c_R 1e-3〜1 の格子では、自分の重み ÷ 源の重みは ${fe(Math.min(...w2))}〜${fe(Math.max(...w2))} で、(F2) の率 ÷ 物差しは ${fe(Math.min(...y2))}〜${fe(Math.max(...y2))}(格子の内で動かない)`;
  const pe = J.t3.find((r) => r.id === 'Earth');
  F.plane = `公転面の集まり(地球の道の輪 ÷ 23°): 主(源 規則・受け手 観測 × 1)${fe(pe.v.stdO0)}・比べる列 源 規則・受け手 規則 ${fe(pe.v.ruleRule)}・源 観測・受け手 規則 ${fe(pe.v.obsRule)}・源 観測・受け手 観測 ${fe(pe.v.obsObs)}`;
  return F;
}

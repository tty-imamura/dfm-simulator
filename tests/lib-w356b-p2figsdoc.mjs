// 第356便b(統括の検証項目 R514): **論文 2 の仕上げの材料の文書の lib** —— 純関数(ファイルを読まない・import しない)。
//   正本 tests/out/p2figs-356b.json(器 tests/exp-w356b-p2figs.mjs)から表と数の文を作る。QA docs.p2figs356b が、PAPER_PLAN の論文2 の ④ の表 3a・表 3b と
//   PHYSICS〔第356便b〕の表・数の文がこの出力と逐語かを見る。**図の行き先は案 —— 決めていない。模式図は数の図ではない。**
export const DOC_VERSION = 'w356b-p2figsdoc-1';

/** 原仮定者の文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  ['原仮定者の指示(2026-11-21)', '主にgeoPN=0を使用。「もしも宇宙に天体が１つだけだったら」の思考実験で始まる。ハッブルテンション類似などを扱う'],
]);
export function originalTable() {
  return ['| 出どころ | 原文 |', '|---|---|', ...ORIGINAL.map(([s, o]) => `| ${s} | 「${o}」 |`)].join('\n');
}

const STATE_JA = Object.freeze({ keep: '残す', move: '移す', new: '新しい模式図', plan: '案のまま(この枝では作らない)' });
const e3 = (x) => Number(x).toExponential(2);
const p3 = (x) => Number(x).toPrecision(3), p4 = (x) => Number(x).toPrecision(4), tl = (x) => Number(x).toExponential(0), f3 = (q) => q.map((x) => Number(x).toFixed(3)).join(', ');

/** 表 3a 改訂の後の図の並び(案)—— PAPER_PLAN の論文2 の ④ と PHYSICS〔第356便b〕に同じ字 */
export function tableFigs(J) {
  const gN = (f) => (f.state === 'new' ? '0(模式 —— 新しい)' : f.state === 'plan' ? '0(図のデータなし)'
    : String(J.gates.byFig[f.id]) + (J.gates.schematic.some((id) => id.startsWith(f.id + '.')) ? '(模式 —— 数値ゲートなし)' : ''));
  const rows = J.figPlan.map((f, k) => [String(k + 1), f.fig, f.chapter, f.shows, f.src, gN(f), f.state === 'keep' || f.state === 'move' ? f.to : f.state === 'new' ? STATE_JA.new + '(' + f.to + ')' : STATE_JA[f.state]]);
  return ['| 順 | 図 | 章 | 何を見せるか | データの出どころ | 今のゲートの数 | 残す/移す |', '|---|---|---|---|---|---|---|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
}
/** 表 3a の下の数の行(今の 22 ゲートの分け方) */
export function gateSumLine(J) {
  const G = J.gates;
  return `今の ${G.total} ゲート(\`paper/figures/p2figs-gates.json\`)を図ごとに数えた分け方: 残す図(p2fig1〜p2fig6)の分 ${G.keep}(数値ゲート ${G.keepNumeric} + 模式図のゲート ${G.keep - G.keepNumeric})・移す図(p2fig7・p2fig8)の分 ${G.move}・どちらでもない分 ${G.other}。図ごと: ${Object.entries(G.byFig).map(([f, n]) => f + ' ' + n).join('・')}。`;
}
/** 表 3b 図 6 の精度の書き方 */
export function tablePrec(J) {
  const s = J.prec.scan, v = J.prec.v29;
  const rows = [
    ['`verify.V29`', '検証 V29(1 つの走り —— 較正 D X_k ' + v.dkt + ')', String(v.nWin) + '(a: 1 → 1.5 → 2 → 3)', v.maxRelText + '(区間ごと ' + v.per.map((x) => x.toExponential(1)).join('・') + ')', tl(v.tol), v.wDriftText,
      '「V29(3 区間)の最大の相対の誤差 ' + v.maxRelText + '」'],
    ['`p2fig6.analytic`', '図 6 の走査(図のゲート —— 較正 D X_k ' + s.perCal.map((c) => c.dkt).join('・') + ')', s.nWin + ' × 較正 ' + s.nCal + ' = ' + s.nAll + '(a: 1 → 3 を ' + s.nWin + ' の等比の区間)',
      e3(s.maxRel) + '(較正ごと ' + s.perCal.map((c) => e3(c.maxRel)).join('・') + ' —— 最大は D X_k ' + s.atCal + ')', tl(s.tol), e3(s.wDrift),
      '「図 6 の走査(' + s.nWin + ' 区間 × 較正 ' + s.nCal + ')の最大の相対の誤差 ' + e3(s.maxRel) + '」'],
  ];
  return ['| 検査の名 | 何の検査か | 区間の数 | 最大の相対の誤差 | 許容 | w の保存のずれの最大 | 引くときの書き方 |', '|---|---|---|---|---|---|---|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
}
/** 表 3b の下の書き方の決まり(3 項) */
export function precRules(J) {
  const s = J.prec.scan, v = J.prec.v29;
  return [
    `1. 精度を引くときは、**検査の名と区間の数を添える**(「V29(${v.nWin} 区間)の ${v.maxRelText}」・「図 6 の走査(${s.nWin} 区間 × 較正 ${s.nCal})の ${e3(s.maxRel)}」)。数だけを書かない。`,
    `2. 2 つの数は別の検査の精度で、比は ${J.prec.ratio.toFixed(1)} 倍。「同じ水準」とまとめず、**どちらも許容 ${tl(s.tol)} の内**と書く。`,
    `3. w の保存も同じ形で引く(V29 ${v.wDriftText}・図 6 の走査 ${e3(s.wDrift)})。`,
  ].join('\n');
}
/** 模式図 A の描く量(PHYSICS〔第356便b〕だけ) */
export function tableSchemA(J) {
  const A = J.schematicA;
  const arr = (p) => p.arrows.map((q) => q.kind === 'arc' ? `弧(中心 (${q.center.join(', ')})・半径 ${q.radius}・${q.fromDeg}° → ${q.toDeg}°・反時計回り)` : `(${f3(q.from)}) → (${f3(q.to)})`).join('・');
  const rows = A.panels.map((p) => [p.name.ja, p.readable ? '読める' : '読めない', arr(p), p.label.ja]);
  return ['| 枠 | 中から | 矢印(枠 [0, 1] × [0, 1] の描く位置) | ラベルの字 |', '|---|---|---|---|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
}
/** 模式図 B の描く量(PHYSICS〔第356便b〕だけ) */
export function tableSchemB(J) {
  const B = J.schematicB;
  const rows = B.layers.map((l) => [l.name.ja, `${l.x0} 〜 ${l.x1}`, l.give.ja, l.read.ja, l.numText.ja, '`' + l.fig + '`(' + l.gates.map((g) => '`' + g + '`').join('・') + ')']);
  return ['| 層 | 列の境(x) | 与えるもの(上の箱) | 読むもの(下の箱 —— 矢印は上から下) | ラベルの数(今の図のデータの写し) | 数の出どころ(図・ゲート) |', '|---|---|---|---|---|---|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');
}
/** 数の文(PHYSICS〔第356便b〕に逐語) */
export function factsOf(J) {
  const s = J.prec.scan, v = J.prec.v29, A = J.schematicA, B = J.schematicB, G = J.gates;
  return {
    keep: `残す図の分は ${G.total} ゲートのうち ${G.keep}(数値ゲート ${G.keepNumeric})、移す図の分は ${G.move}。新しい模式図 2 枚はゲートを持たない(足すなら p2fig1 と同じ「模式図 —— 数値ゲートなし」の形で 2 本 —— ${G.keep + 2} になる)。`,
    prec: `図 6 の走査の最大の相対の誤差は、行から作り直して ${e3(s.maxRel)}(図のデータの記録と同じ —— 較正 D X_k ${s.atCal} の区間)。較正点 D X_k ${s.perCal[1].dkt} の走査では ${e3(s.perCal[1].maxRel)}。V29 は D X_k ${v.dkt} の 3 区間で ${v.maxRelText}。比 ${J.prec.ratio.toFixed(1)} 倍。`,
    schemA: `模式図 A のラベルの利得は図 2 の r = 20 の値(回転 ${p4(A.panels[1].gainMeasured)}・膨張 ${p4(A.panels[2].gainMeasured)}・解析 ${p4(A.panels[1].gainAnalytic)})—— 箱の壁は質点 96 のリングで、天体が 1 つの本は未。`,
    schemB: `模式図 B の列の境は x = ${B.bounds.join('・')}、下の横の矢印は「${B.across.label.ja}」。`,
    phrase: `「同水準」の字は、図のゲートの記録 \`p2fig6.analytic\` の「本文 5.3e-4 と同水準」(字の出どころは図の生成器 \`tools/gen-figures2.mjs\` の ${J.phrase.gen.map((h) => h.line).join('・')} 行)と、V29 の記録の「…と同水準の較正点」(アプリの検証の記録の字 —— 較正点の値の言い方で、精度の言い方ではない)の ${J.phrase.gateLog.length} か所。`,
  };
}

// 第353便zl(原仮定者の補足(2026-11-25 —— 第152報)・原仮定者の回答(2026-11-25 —— 第153報)・統括の検証項目 R502):
// **第152報と第153報の文書の lib —— 原文(言葉を変えずに引く —— 第152報 5 文・第153報 4 文)と当たる節の表・主の列の切り替えの表(第153報)・
// 訂正の鎖 3(前の節の当時の文は消さない)・主の列 (ウ) と選択肢 (ア)(イ) を並べる表(枝 zf の正本の数を逐語で —— 数え直さない)と、QA docs.report153_353zl の照合の関数**
// (純関数 —— ファイルを読まない。QA が文書の文字列と枝 zf の正本の中身を渡す)。器・正本・段は無い(文書の枝)。
// 主の列は「回答で主に置いた列」—— 正しさの判定ではない。選択肢 (ア)(イ) の採否は置いていない。潮汐の側の列は比べる列(DFM の式ではない)。
// 外部の名・private の文書の名は第350便a〜第353便a の lib の反転の綴りの表を使う(本文に綴りを置かない)。
import * as A351 from './lib-w351a-report147.mjs';
import * as A352 from './lib-w352a-report148.mjs';
import * as A353 from './lib-w353a-report151.mjs';
import * as ZF from './lib-w353zf-threecolsdoc.mjs';

export const LIB_VERSION = 'w353zl-report153doc-lib-1';

export const SRC152 = '原仮定者の補足(2026-11-25 —— 第152報)';
export const SRC153 = '原仮定者の回答(2026-11-25 —— 第153報)';
export const SRC151 = A353.SRC_DEC;
export const SRC148 = A352.SRC_DEC;

// ---- 原文(言葉を変えずに)
const L = Object.freeze({
  s152: '金星の自転の補足: 金星の自転は、潮汐力で太陽と地球に同時にロックした状態であり、地球の潮汐力でたまたま逆回転している。地球の軸引きずりが金星を逆回転させている訳では無い。金星に影響する軸引きずりの影響が、潮汐力を下回っている。また、潮汐ロックは、天体の特定の向きが安定する為に起こり、金星は地球と接近した時に特定の面を地球に向ける。月も同じ面を地球に向ける',
  d1069: 'AN1069: 推奨',
  d1077: 'AN1077: 推奨',
  d1082: 'AN1082: ウ。0.98 倍も選択肢で、計算が合う方式を採用する',
});
export const LINES = L;
export const LINE_KEYS = Object.freeze(['s152', 'd1069', 'd1077', 'd1082']);
export const SRC_OF = Object.freeze({ s152: SRC152, d1069: SRC153, d1077: SRC153, d1082: SRC153 });
export const splitSent = A353.splitSent;
export const sentencesOf = (k) => splitSent(L[k]);
export const N152 = 5, N153 = 4;

// ---- 表 1: 文の種類(4 つ)と当たる節
const K = Object.freeze({ te: '定義', jo: '条件', yo: '予想', ju: '手順' });
export const KINDS = K;
const S = (...ids) => ids.map((x) => '〔第353便' + x + '〕').join('・');
/** 並行の枝の節 —— 名だけ書く(実在の検査に入れない) */
export const NAME_ONLY = Object.freeze(['〔第353便zk〕']);
/** [番号, 行の鍵, 文の番号(0 起点), 種類, 読み(原文と分ける), 当たる節] */
export const TABLE1 = Object.freeze([
  ['補 1', 's152', 0, K.yo, '金星の自転の状態の文。逆回転の出どころを地球の潮汐力(重力の側 —— 比べる列(DFM の式ではない))に置く。状態の名は「ロックの判定の量」(〔第353便g〕)のまま', S('g', 'l') + '・〔第353便zk〕(名だけ)'],
  ['補 2', 's152', 1, K.jo, '〔第353便g〕〔第353便l〕の (E-S) 地球の自転の分の軸引きずりは、逆回転の出どころとしては読まない —— 大きさを比べる行として残す', S('g', 'l')],
  ['補 3', 's152', 2, K.jo, '金星に掛かる軸引きずりの項と潮汐力の側(比べる列)の不等式。第138報の定義と同じ向きの不等式を金星に当てる文', S('g') + '・〔第353便zk〕(名だけ)'],
  ['補 4', 's152', 3, K.te, '潮汐ロックの起こり方を「特定の向きが安定する」で書く定義。内合ごとに同じ面を地球に向ける共鳴の算術(〔第353便g〕の (L1))と同じ形', S('g', 'l') + '・〔第353便zk〕(名だけ)'],
  ['補 5', 's152', 4, K.jo, '月の潮汐ロックは観測の事実として置く(積分で作らない)。金星の文と並べる対照の行', S('g')],
  ['回 1', 'd1069', 0, K.ju, '受け手の半径の入れ方の主の列 = (P-応) 応答の側だけ(場の式の自分の重みは規則の半径のまま)。(P-場)・(P-平) は比べる列', S('c', 'j', 'v')],
  ['回 2', 'd1077', 0, K.ju, '源の扁平率の式の主の列 = (O2b) 体積を保つ扁平(σ = (1 − f)^(−2/3) —— 冪で書けば n 2)。(O1)・(O2a)・(O3)・冪 n 5 ほかは比べる列', S('d', 'z', 'zg')],
  ['回 3', 'd1082', 0, K.ju, '主の列 = 〔第353便zf〕の列 (ウ)(換算の係数 1・背景の大きさ = 金星の条件 (uV))', S('zf')],
  ['回 4', 'd1082', 1, K.ju, '列 (ア)(換算の係数 1・0.98)と (イ)(換算の係数 8.22e11・0.98)は選択肢として残す(採否は置いていない)。「計算が合う方式」は採否を題ごとの数で読む方針の句(第151報 AN1039・AN1045 と同じ句)', S('zf', 'q')],
].map((r) => Object.freeze(r)));
export const sentOf = (r) => sentencesOf(r[1])[r[2]];

// ---- 表 2: 主の列の切り替え(第153報)—— [題, 主の列, 選択肢か比べる列, 当たる節]
export const OPT = '選択肢(採否は置いていない)';
export const MAIN = Object.freeze([
  ['受け手の半径の入れ方', '**(P-応) 応答の側だけ**(AN1069 の推奨)', '比べる列: (P-場)・(P-平)', S('c')],
  ['源の扁平率の式', '**(O2b) 体積を保つ扁平**(AN1077 の推奨 —— σ = (1 − f)^(−2/3)・冪で n 2)', '比べる列: (O1)・(O2a)・(O3)・冪 n', S('d', 'z')],
  ['換算の係数と背景の大きさ', '**(ウ) 換算の係数 1・背景 = 金星の条件 (uV)**(AN1082 の「ウ」)', OPT + ': (ア)(換算の係数 1・0.98 倍)・(イ)(換算の係数 8.22e11・0.98 倍)・比べる列: 窓', S('zf')],
  ['金星の条件の読み', '**大きさの一致**((uV) の作りそのもの)', '比べる列: 向きの一致(3 列に共通の量)', S('t', 'zf')],
  ['「地球の影響」', '**潮汐力の側**(第152報 —— 潮汐の側の列は比べる列(DFM の式ではない))', '比べる列: 〔第353便g〕の (E-g)・(E-潮)(比べる列(DFM の式ではない))・比べる行: (E-S) 地球の自転の分の軸引きずり', S('g', 'l')],
].map((r) => Object.freeze(r)));

// ---- 表 3: 訂正の鎖(前の節の当時の文は消さない)—— [鎖, 題, [[出どころ, 原文, 原文が在る節の見出しの頭]...], 読み]
const H352A = '〔第352便a — ', H353A = '〔第353便a — ', H337C = '〔第337便c — ', HZL = '〔第353便zl — ';
const L148 = A352.LINES148, L151 = A353.LINES151, E147 = A351.EARLIER147;
const sent152 = (i) => sentencesOf('s152')[i];
export const CHAIN = Object.freeze([
  ['鎖 1', '背景の大きさ', [[SRC148, L148.d1019, H352A], [SRC151, L151.size, H353A], [SRC151, L151.d1058, H353A], [SRC153, L.d1082, HZL]],
    '金星の条件から置く(第148報)→ 注目の列 0.98・1 つの値に置かない(窓 0.0487〜0.835 —— 第151報)→ 主の列 (ウ) = 金星の条件 (uV)・0.98 倍は選択肢(第153報)'],
  ['鎖 2', '金星の逆回転', [[SRC148, L148.d1019, H352A], [SRC151, L151.d1034, H353A], [SRC152, sent152(0), HZL]],
    '地球とも共鳴(第148報)→ 地球の影響(第151報)→ 地球の潮汐力(第152報 —— 地球の軸引きずりの (E-S) は逆回転の出どころに読まない)'],
  ['鎖 3', '潮汐ロックの定義', [[E147.lock138[0], E147.lock138[1], E147.lock138[2]], [SRC152, sent152(2), HZL], [SRC152, sent152(3), HZL]],
    '外部からの軸引きずりより潮汐力が上回る(第138報)→ 金星でも軸引きずりの影響が潮汐力を下回る・向きが安定する為に起こる(第152報 —— 定義は継ぐ)'],
].map((r) => Object.freeze(r)));

// ---- 表 4: 主の列 (ウ) と選択肢 (ア)(イ) —— 枝 zf の正本の行(列の順を (ウ)(ア)(イ) に並べ替えるだけ)
export const T4_IDS = Object.freeze(['venusResid', 'venusRank', 'ringAx', 'ringDisk', 'plane', 'mercury', 'sideEarth', 'sideMars', 'moon', 'io', 'tilt',
  'watch10000', 'watch1000000', 'watch4500000000', 'periodSun', 'periodEarth', 'turnsSun']);
export const RING_NOTE = SRC151 + ' AN1045「' + A353.sentencesOf('d1045')[1] + '」(軸引きずりだけで読む題ではない)';
const cellsOf = (l) => l.split(' | ').map((c, i, a) => (i === 0 ? c.replace(/^\| /, '') : i === a.length - 1 ? c.replace(/ \|$/, '') : c));
const ORDER = [0, 1, 2, 5, 3, 4];   // # | 題 | 物差し | (ア) | (イ) | (ウ) → # | 題 | 物差し | (ウ) | (ア) | (イ)
/** 枝 zf の文書の lib の表(主の表)の行を、正本の行の id で引く */
export function zfMainRows(J) {
  const T = ZF.tablesOf(J), lines = T.main.split('\n');
  const head = cellsOf(lines[0]), body = lines.slice(2);
  if (body.length !== J.t1.rows.length) throw new Error('枝 zf の表の行の数が正本と違う');
  const m = new Map(); J.t1.rows.forEach((r, i) => m.set(r.id, cellsOf(body[i])));
  return { head, rows: m };
}
export function table4Md(J) {
  const { head, rows } = zfMainRows(J);
  const R = ['| ' + ORDER.map((i) => head[i]).join(' | ') + ' | 添え |', '|---|---|---|---|---|---|---|'];
  for (const id of T4_IDS) { const c = rows.get(id); if (!c) throw new Error('正本に行 ' + id + ' が無い');
    R.push('| ' + ORDER.map((i) => c[i]).join(' | ') + ' | ' + (/^ring/.test(id) ? RING_NOTE : '—') + ' |'); }
  return R.join('\n');
}
export function countMd(J) {
  const lines = ZF.tablesOf(J).count.split('\n'), body = lines.slice(2);
  const by = new Map(body.map((l) => [cellsOf(l)[0], l]));
  return [lines[0], lines[1]].concat(['(ウ)', '(ア)', '(イ)'].map((k) => by.get(k))).join('\n');
}
/** 1 段: 主の列 (ウ) で読める帰結(正本の字だけ)と、まだ置いていない所 */
export function factsU(J) {
  const { rows } = zfMainRows(J), u = (id) => rows.get(id)[5];
  return '主の列 (ウ) の数(枝 zf の正本の字 —— 数え直していない): 太陽の歳差の 1 周 ' + u('periodSun') + ' 年・太陽の円錐の年齢の内の周の数 ' + u('turnsSun')
    + '・地球の傾きの変化(°)1 万年 ' + u('watch10000') + '・45 億年 ' + u('watch4500000000') + '・局所 ÷ 背景 水星 ' + u('mercury') + '・地球 ' + u('sideEarth') + '・火星 ' + u('sideMars')
    + '・月 ' + u('moon') + '・イオ ' + u('io') + '。まだ置いていない所: 採否(「計算が合う方式」をどの題の数で読むか)・k₂/Q ほかの未照合のノブ・物差しの照合(文献の値・未照合)・公転の道と暦表の参考の幅(〔第353便zj〕の題 —— 枝 zf の正本に無いので本表に並べない)';
}

// ---- 表の markdown(本節の表はこの関数の出力と逐語で同じ)
const q = (x) => '「' + x + '」';
export function table1Md() {
  const R = ['| # | 出どころ | 原文(言葉を変えずに引く —— 「。」で文に分けた。継ぐと原文に戻る) | 文の種類 | 読み(原文と分ける) | 当たる節 |', '|---|---|---|---|---|---|'];
  for (const r of TABLE1) R.push(`| ${r[0]} | ${SRC_OF[r[1]]} | ${q(sentOf(r))} | ${r[3]} | ${r[4]} | ${r[5]} |`);
  return R.join('\n');
}
export function table2Md() {
  const R = ['| 題 | 主の列(' + SRC153 + ' —— 回答で主に置いた列) | 選択肢か比べる列(残す) | 当たる節 |', '|---|---|---|---|'];
  for (const r of MAIN) R.push(`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`);
  return R.join('\n');
}
export function table3Md() {
  const R = ['| 鎖 | 題 | 文の並び(出どころと原文 —— 前の文は当時の節に残る) | 読み(原文と分ける) |', '|---|---|---|---|'];
  for (const r of CHAIN) R.push(`| ${r[0]} | ${r[1]} | ${r[2].map(([s, t]) => s + ' ' + q(t)).join(' → ')} | ${r[3]} |`);
  return R.join('\n');
}

// ---- 書かない語
export const EXT_NAMES = A353.EXT_NAMES;
const rv = (x) => x.split('').reverse().join('');
export const PRIVATE_NAMES = Object.freeze(A353.PRIVATE_NAMES.concat(['lz353w', 'lz353-W', '251TROPER', '351TROPER', 'sfeirb'].map(rv)));
export const PRIVATE_RE = A353.PRIVATE_RE;
export const PAST = Object.freeze(A353.PAST.concat(['ロックした', '採用した', '外れた']));
export const NOT153 = Object.freeze([/正しい/, /ロックしている/, /主が決まった/, /型が決まった/, /採る型/, /観測に合った/, /主の列が合った/]);
export const cells = A353.cells, tabIn = A353.tabIn, physSecOf = A353.physSecOf, para = A353.para, outsideQuotes = A353.outsideQuotes;
const strip = (t) => outsideQuotes(t).replace(/『[^』]*』/g, '').replace(/[^。\n]*と書かない[^。\n]*。/g, '').replace(/[^。\n]*とは書かない[^。\n]*。/g, '');

// ---- docs.report153_353zl の照合(ph = PHYSICS・as = AI_SPEC・pm = post-merge・J = 枝 zf の正本)
export const HEAD = HZL;
export const PREV_HEAD = '〔第353便zz — ';
export const SEC_HEADS = Object.freeze(['**① 原文と読み。**', '**表 1 第152報と第153報の文の当たる節(', '**表 2 主の列の切り替え(', '**表 3 訂正の鎖(', '**表 4 主の列 (ウ) と選択肢 (ア)(イ)(',
  '**表 5 物差しの 0.1〜10 倍の数え(', '**② 主の列 (ウ) で読める帰結と、まだ置いていない所。**', '**③ 検査。**', '**④ 決断事項の候補。**', '**⑤ 言わないこと。**', 'docs.report153_353zl', 'tests/lib-w353zl-report153doc.mjs']);
export function checkReport153(ph, as, pm, J) {
  const bad = [], cases = [];
  ph = String(ph || ''); as = String(as || ''); pm = String(pm || '');
  const sec = physSecOf(ph, HEAD), iL = ph.indexOf('\n' + HEAD), iZ = ph.indexOf('\n' + PREV_HEAD), iT = ph.indexOf('\n〔第328便 — 統括');
  // ① 位置(〔第353便zz〕より後・第328便の統括の節より前)・見出し・必須の語
  if (!(iL >= 0 && iZ >= 0 && iZ < iL && iT > iL)) bad.push('① PHYSICS〔第353便zl〕の位置(〔第353便zz〕より後・第328便の統括の節より前)');
  const h1 = sec.split('\n')[0];
  for (const w of [SRC152, SRC153, 'R502', '文書だけ', 'html は変えていない']) if (h1.indexOf(w) < 0) bad.push('① 見出しに「' + w + '」が無い');
  for (const w of SEC_HEADS) if (sec.indexOf(w) < 0) bad.push('① PHYSICS〔第353便zl〕に「' + w + '」が無い');
  if (/〔第\d+便 — 統括〕/.test(sec)) bad.push('① 本節に統括の節の見出しの字をそのまま書いている');
  cases.push('① 位置(〔第353便zz〕より後・統括の節より前)・見出し・必須の語');
  // ② 表 1 —— 第152報 5 文・第153報 4 文(継ぐと原文に戻る)
  { const T = tabIn(sec, '**表 1 ');
    if (sentencesOf('s152').length !== N152 || ['d1069', 'd1077', 'd1082'].reduce((a, k) => a + sentencesOf(k).length, 0) !== N153) bad.push('② 文の数(第152報 ' + N152 + '・第153報 ' + N153 + ' のはず)');
    for (const k of LINE_KEYS) { const rows = TABLE1.filter((r) => r[1] === k).sort((a, b) => a[2] - b[2]);
      if (rows.length !== sentencesOf(k).length || rows.map(sentOf).join('。') !== L[k]) bad.push('② 行 ' + k + ' の文を継いでも原文に戻らない'); }
    if (T.map((l) => cells(l)[0]).join('|') !== TABLE1.map((r) => r[0]).join('|')) bad.push('② 表 1 の行の並び: ' + T.map((l) => cells(l)[0]).join('・'));
    for (const r of TABLE1) { const l = T.find((x) => x.startsWith('| ' + r[0] + ' |')), c = l ? cells(l) : null;
      if (!c || c.length !== 6) { bad.push('② 表 1 に ' + r[0] + ' の 6 欄の行が無い'); continue; }
      if (c[1] !== SRC_OF[r[1]]) bad.push('② 表 1 の ' + r[0] + ' の出どころ');
      if (c[2] !== q(sentOf(r))) bad.push('② 表 1 の ' + r[0] + ' の原文の字が原文と違う');
      if (c[3] !== r[3] || !Object.values(K).includes(c[3])) bad.push('② 表 1 の ' + r[0] + ' の文の種類');
      if (c[4] !== r[4] || c[5] !== r[5]) bad.push('② 表 1 の ' + r[0] + ' の読みか当たる節');
      for (const m of c[5].match(/〔第353便[a-z]+〕/g) || []) if (!NAME_ONLY.includes(m) && ph.indexOf('\n' + m.replace('〕', ' — ')) < 0) bad.push('② 表 1 の ' + r[0] + ' の当たる節 ' + m + ' が PHYSICS に無い'); }
    const joined = T.map((l) => cells(l)[2] || '').join('\n');
    for (const k of LINE_KEYS) if (!TABLE1.filter((r) => r[1] === k).every((r) => joined.indexOf(q(sentOf(r))) >= 0)) bad.push('② 原文 ' + k + ' の文が逐語で無い'); }
  cases.push(`② 表 1 の ${TABLE1.length} 文(第152報 ${N152}・第153報 ${N153} —— 継ぐと原文に戻る・原文の字・文の種類 4 つ・読みは原文と別の欄・当たる節が PHYSICS に在る〔並行の枝の節は名だけ〕)`);
  // ③ 表 2 —— 主の列の切り替え(lib の出力と逐語)
  { const T = tabIn(sec, '**表 2 '), W = table2Md().split('\n').slice(2);
    if (T.join('\n') !== W.join('\n')) bad.push('③ 表 2 が lib の出力と違う(主の列・選択肢か比べる列)');
    for (const r of MAIN) for (const m of r[3].match(/〔第353便[a-z]+〕/g) || []) if (ph.indexOf('\n' + m.replace('〕', ' — ')) < 0) bad.push('③ 表 2 の ' + r[0] + ' の当たる節 ' + m + ' が PHYSICS に無い');
    const kr = T.find((l) => l.startsWith('| 換算の係数と背景の大きさ |')) || '';
    if (!((cells(kr)[1] || '').startsWith('**(ウ)') && (cells(kr)[2] || '').startsWith(OPT))) bad.push('③ 表 2 の換算の係数と背景の大きさの主の列が (ウ) でないか、(ア)(イ) が「' + OPT + '」でない');
    const er = T.find((l) => l.startsWith('| 「地球の影響」 |')) || '';
    if ((er.match(/比べる列\(DFM の式ではない\)/g) || []).length < 2) bad.push('③ 表 2 の「地球の影響」の行で潮汐の側の列を比べる列(DFM の式ではない)と書いていない'); }
  cases.push(`③ 表 2 の主の列の切り替え ${MAIN.length} 題(lib の出力と逐語・主の列 (ウ)・選択肢は「${OPT}」・潮汐の側の列は比べる列)`);
  // ④ 表 3 —— 訂正の鎖・前の文が当時の節に残る
  { const T = tabIn(sec, '**表 3 '), W = table3Md().split('\n').slice(2);
    if (T.join('\n') !== W.join('\n')) bad.push('④ 表 3 が lib の出力と違う');
    for (const r of CHAIN) for (const [, t, h] of r[2]) if (h !== HZL && physSecOf(ph, h).indexOf(t) < 0) bad.push('④ 表 3 の ' + r[0] + ' の前の文が ' + h.replace(' — ', '') + '〕に残っていない'); }
  cases.push(`④ 表 3 の訂正の鎖 ${CHAIN.length}(lib の出力と逐語・前の文が〔第352便a〕〔第353便a〕〔第337便c〕に残る)`);
  // ⑤ 表 4・表 5 —— 枝 zf の正本と逐語(列の順を (ウ)(ア)(イ) に)
  if (!J || !J.t1) bad.push('⑤ 枝 zf の正本が無い');
  else {
    const T = tabIn(sec, '**表 4 '), W = table4Md(J).split('\n').slice(2);
    if (T.join('\n') !== W.join('\n')) bad.push('⑤ 表 4 が枝 zf の正本(と文書の lib)から作った行と違う');
    const T5 = tabIn(sec, '**表 5 '), W5 = countMd(J).split('\n').slice(2);
    if (T5.join('\n') !== W5.join('\n')) bad.push('⑤ 表 5 が枝 zf の正本の数えと違う');
    for (const c of J.t1.count) { const l = T5.find((x) => x.startsWith('| ' + ({ A: '(ア)', I: '(イ)', U: '(ウ)' })[c.col] + ' |')), x = l ? cells(l) : [];
      if (!(x[1] === String(c.inBand) && x[2] === String(c.over) && x[3] === String(c.under))) bad.push('⑤ 表 5 の ' + c.col + ' の入る・越える・届かないが正本と違う'); }
    const hd = cells((sec.split('\n').find((l) => l.startsWith('| # | 題 | 物差し')) || ''));
    if (!((hd[3] || '').startsWith('(ウ)') && (hd[4] || '').startsWith('(ア)') && (hd[5] || '').startsWith('(イ)'))) bad.push('⑤ 表 4 の列の順が (ウ)(ア)(イ) でない');
    for (const l of T.filter((x) => /土星の環/.test(x))) if (l.indexOf(RING_NOTE) < 0) bad.push('⑤ 表 4 の土星の環の行に AN1045 の文が無い');
    if (para(sec, '**② 主の列 (ウ) で読める帰結').indexOf(factsU(J)) < 0) bad.push('⑤ ② の帰結の文が正本の字と違う');
  }
  cases.push(`⑤ 表 4 の ${T4_IDS.length} 行(枝 zf の正本と文書の lib の字を逐語 —— 列の順 (ウ)(ア)(イ)・土星の環に AN1045)・表 5 の数え(入る・越える・届かない)・② の帰結の文`);
  // ⑥ AI_SPEC §394・post-merge
  { const a394 = as.search(/\n## 394\. 第353便zl/), a392 = as.search(/\n## 392\. 第353便zz/);
    let ai = ''; if (a394 >= 0) { const z = as.indexOf('\n## ', a394 + 4); ai = as.slice(a394 + 1, z < 0 ? as.length : z); }
    if (!(a394 >= 0 && a392 >= 0 && a392 < a394 && [SRC152, SRC153, 'R502', '(ウ)', OPT, 'SYSTEM_PROMPT には載せない', 'docs.report153_353zl'].every((w) => ai.indexOf(w) >= 0))) bad.push('⑥ AI_SPEC §394(§392 より後・必須の語)');
    const eZZ = pm.indexOf('# ==== 第353便zz の塊(ここまで)====');
    if (!(eZZ >= 0 && pm.indexOf('# ==== 第353便zl の塊(ここから)====') > eZZ && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.report153_353zl/.test(pm))) bad.push('⑥ post-merge に第353便zl の塊(第353便zz の塊より後)');
    // ⑦ 書かない語
    for (const [nm, tx] of [['PHYSICS〔第353便zl〕', sec], ['AI_SPEC §394', ai]]) {
      for (const w of EXT_NAMES.concat(PRIVATE_NAMES)) if (tx.indexOf(w) >= 0) bad.push('⑦ ' + nm + ' に禁句(引用も含めて —— ' + w.length + ' 字)');
      if (PRIVATE_RE.test(tx)) bad.push('⑦ ' + nm + ' に private の文書の名の形');
      const s = strip(tx);
      for (const w of PAST) if (s.indexOf(w) >= 0) bad.push('⑦ ' + nm + ' に書かない語「' + w + '」');
      for (const re of NOT153) if (re.test(s)) bad.push('⑦ ' + nm + ' に書かない語 ' + re.source);
      if (/(^|[^_A-Za-z])κ/.test(tx)) bad.push('⑦ ' + nm + ' に裸の係数記号');
    } }
  cases.push(`⑥ AI_SPEC §394(§392 より後)・post-merge の塊 / ⑦ 禁句 ${EXT_NAMES.length + PRIVATE_NAMES.length + 1}(引用も含めて)・書かない語 ${PAST.length + NOT153.length}(引用と「書かない」の文の外)・係数記号`);
  return { bad, cases };
}

/** 純関数の零試験(QA が呼ぶ —— 文の分け方・表の形・列の並べ替え) */
export function libGates() {
  const bad = [];
  if (sentencesOf('s152').length !== N152) bad.push('第152報の文の数');
  if (['d1069', 'd1077', 'd1082'].reduce((a, k) => a + sentencesOf(k).length, 0) !== N153) bad.push('第153報の文の数');
  for (const k of LINE_KEYS) if (sentencesOf(k).join('。') !== L[k]) bad.push('継ぎ ' + k);
  if (TABLE1.length !== N152 + N153) bad.push('表 1 の行の数');
  if (MAIN.length !== 5 || CHAIN.length !== 3) bad.push('表 2・表 3 の行の数');
  const fx = '| 1 | 題 | — | a | i | u |', c = cellsOf(fx);
  if (ORDER.map((i) => c[i]).join('/') !== '1/題/—/u/a/i') bad.push('列の並べ替え');
  if (cellsOf('| x | y |').join('/') !== 'x/y') bad.push('欄の切り出し');
  if (RING_NOTE.indexOf('土星の環は、円盤引きずりが影響している') < 0) bad.push('AN1045 の文');
  if (CHAIN[2][2][0][1] !== '潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている') bad.push('第138報の公開の節の字');
  return { bad, n: 9 + LINE_KEYS.length };
}

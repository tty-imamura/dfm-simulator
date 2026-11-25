// 第355便a(原仮定者の指示(2026-11-25)・原仮定者の回答(2026-11-25)・統括の検証項目 R504):
// **軸引きずりの主の列の印の置き直しの文書の lib —— 原文(言葉を変えずに引く —— 指示 1 文・回答 2 文)と当たる節の表・主の列の切り替えの表(前 = 〔第353便zl〕の表 2 の形/後 = 回答の形)・
// 訂正の鎖(〔第353便zl〕の鎖を消さずに後ろに 1 段継ぐ)・計算式の一覧の主の列の印の置き直し(前の印は残し、後ろに「。」で継ぐ)と、QA docs.report155_355a の照合の関数**
// (純関数 —— ファイルを読まない。QA が文書の文字列を渡す)。器・正本・段は無い(文書の枝)。
// 主の列は「回答で主に置いた列」—— 正しさの判定ではない。0.98 倍は背景の大きさの範囲の内の 1 点(固定しない)。範囲の数は枝 b の正本(この lib は数を持たない)。
// 外部の名・private の文書の名は第350便a〜第353便zl の lib の反転の綴りの表を使う(本文に綴りを置かない)。
import * as ZL from './lib-w353zl-report153doc.mjs';

export const LIB_VERSION = 'w355a-report155doc-lib-1';

export const SRC_I = '原仮定者の指示(2026-11-25)';
export const SRC_A = '原仮定者の回答(2026-11-25)';
export const SRC153 = ZL.SRC153;
/** 原文が逐語で在る節(第353便の統括の節 —— 見出しの頭。本節の本文にはこの字をそのまま書かない) */
export const ORIG_HEAD = '〔第353便 — 統括';
export const ORIG_NAME = '第353便の統括の節';

// ---- 原文(言葉を変えずに —— リポジトリの第353便の統括の節の字から写した)
const L = Object.freeze({
  respect: 'AN1082: この結果を尊重する『…比 = 1 の線で惑星が分かれる背景の大きさには範囲が在ります(…銀河の公転の角速度の 0.26〜1.16 倍の桁)。これまでの窓(0.049〜0.84 倍)と重なり、注目の 0.98 倍を含みます。「向きと大きさは別々に合わせて良い」の、大きさの側の独立な材料になり得ます…』',
  d1113: 'AN1113: 推奨。ただし、必ず0.98 倍である必要は無い',
});
export const LINES = L;
export const LINE_KEYS = Object.freeze(['respect', 'd1113']);
export const SRC_OF = Object.freeze({ respect: SRC_I, d1113: SRC_A });
export const splitSent = ZL.splitSent;
export const sentencesOf = (k) => splitSent(L[k]);
export const N_I = 1, N_A = 2;

// ---- 表 1: 文の当たる節
const K = ZL.KINDS;
const S = (...ids) => ids.map((x) => '〔第353便' + x + '〕').join('・');
/** 並行の枝の節 —— 名だけ書く(実在の検査に入れない) */
export const NAME_ONLY = Object.freeze(['〔第355便b〕']);
export const RANGE_TBD = '未 —— 枝 b の後';
/** [番号, 行の鍵, 文の番号(0 起点), 種類, 読み(原文と分ける), 当たる節] */
export const TABLE1 = Object.freeze([
  ['指 1', 'respect', 0, K.jo, '背景の大きさの側の材料 = 比 1 の線(潮汐力 ÷ 軸引きずり = 1)で惑星が分かれる背景の大きさの範囲。範囲はこれまでの窓と重なり、注目の 0.98 倍を含む(引かれた文は〔第353便zk〕の表の読み)', S('zk', 'zf') + '・〔第355便b〕(名だけ)'],
  ['回 1', 'd1113', 0, K.ju, '換算の係数の主の列 = 金星で局所の項と背景が同じ大きさになる値(〔第353便zf〕の列 (イ) の作り —— 換算の係数 = 背景の倍率 ÷ 1.19282e-12)', S('zf', 'j', 'q')],
  ['回 2', 'd1113', 1, K.jo, '背景の大きさは 0.98 倍に固定しない —— 比 1 の線で惑星が分かれる範囲の内の値として持つ(0.98 倍は範囲の内の 1 点)。範囲の数: ' + RANGE_TBD, S('e', 'zk') + '・〔第355便b〕(名だけ)'],
].map((r) => Object.freeze(r)));
export const sentOf = (r) => sentencesOf(r[1])[r[2]];

// ---- 表 2: 主の列の切り替え —— [題, 前(〔第353便zl〕の表 2 の字), 後(回答の形), 比べる列か選択肢(残す), 当たる節]
const Z = (i) => ZL.MAIN[i][1];
export const SAME = '前のまま';
export const MAIN = Object.freeze([
  ['換算の係数', Z(2), '**金星で等大になる値**(〔第353便zf〕の列 (イ) の作り —— 換算の係数 = 背景の倍率 ÷ 1.19282e-12・0.98 倍の点では 8.2158e11)', '比べる列: 換算の係数 1((ウ)・(ア))', S('zf', 'j')],
  ['背景の大きさ', Z(2), '**比 1 の線で惑星が分かれる範囲の内**(0.98 倍は範囲の内の 1 点 —— 固定しない。範囲の数: ' + RANGE_TBD + ')', '比べる列: (ウ) 金星の条件 (uV)・(ア) 換算の係数 1 で 0.98 倍・これまでの窓(0.0487〜0.835)', S('zk', 'zf') + '・〔第355便b〕(名だけ)'],
  ['受け手の半径の入れ方', Z(0), SAME, ZL.MAIN[0][2], ZL.MAIN[0][3]],
  ['源の扁平率の式', Z(1), SAME, ZL.MAIN[1][2], ZL.MAIN[1][3]],
  ['金星の条件の読み', Z(3), SAME + '(換算の係数を置く条件として使う)', ZL.MAIN[3][2], ZL.MAIN[3][3]],
  ['「地球の影響」', Z(4), SAME, ZL.MAIN[4][2], ZL.MAIN[4][3]],
].map((r) => Object.freeze(r)));

// ---- 表 3: 訂正の鎖 —— 〔第353便zl〕の鎖を消さずに、後ろに 1 段継ぐ([鎖, 題, [[出どころ, 原文, 原文が在る節の見出しの頭]...], 読み])
export const HEAD = '〔第355便a — ';
export const PREV_HEAD = '〔第354便a — ';
const ZC = ZL.CHAIN;
const STEP_I = Object.freeze([SRC_I, L.respect, ORIG_HEAD]), STEP_A = Object.freeze([SRC_A, L.d1113, ORIG_HEAD]);
export const CHAIN = Object.freeze([
  [ZC[0][0], ZC[0][1], ZC[0][2].concat([STEP_I, STEP_A]), ZC[0][3] + ' → 比 1 の線で分かれる範囲の内・0.98 倍は範囲の内の 1 点(2026-11-25 の指示と回答 —— 固定しない)'],
  [ZC[1][0], ZC[1][1], ZC[1][2], ZC[1][3]],
  [ZC[2][0], ZC[2][1], ZC[2][2], ZC[2][3]],
  ['鎖 4', '換算の係数', [ZC[0][2][3], STEP_A], '主の列 (ウ) = 換算の係数 1・金星で等大の値の列は選択肢(第153報)→ 換算の係数 = 金星で等大になる値(2026-11-25 の回答 —— 列 (イ) の作り)'],
].map((r) => Object.freeze(r)));
const q = (x) => '「' + x + '」';

// ---- 計算式の一覧の主の列の印(前の印〔第153報の時点の字〕は残し、後ろに「。」で継ぐ)
export const MA153 = '**主の列(原仮定者の回答 2026-11-25 —— 第153報)**: ';
export const ANS153 = Object.freeze({ mag: '背景の大きさ 金星の条件 (uV) —— ' + ZL.OPT + ': 0.98 倍・比べる列: 窓', k: '換算の係数 1 —— ' + ZL.OPT + ': 金星の条件の値(0.98 倍の列)' });
export const MA155 = '**主の列(原仮定者の指示と回答 2026-11-25 —— 前の印を置き直す)**: ';
export const ANS155 = Object.freeze({
  mag: '背景の大きさ 比 1 の線で惑星が分かれる範囲の内(0.98 倍は範囲の内の 1 点 —— 固定しない)—— 比べる列: 金星の条件 (uV)・窓',
  k: '換算の係数 金星で等大になる値(列 (イ) の作り)—— 比べる列: 換算の係数 1',
});
export const MARK_KEYS = Object.freeze(['mag', 'k']);
export const MARK_NAME = Object.freeze({ mag: '背景の大きさ', k: '換算の係数' });
export const MARK_FIRST = 130, MARK_LAST = 182;
const MK_RE = /\n- \*\*主の列の印\*\*: [^\n]*/;
/** 計算式の一覧の項の塊([id, num, 始まり, 終わり]) */
export function itemsOf(eq) {
  eq = String(eq || ''); const out = [], re = /\n### (EQ-(\d+)) /g; let m;
  const ends = []; const re2 = /\n### |\n## /g;
  while ((m = re.exec(eq))) out.push({ id: m[1], num: Number(m[2]), start: m.index + 1 });
  for (const it of out) { re2.lastIndex = it.start + 4; const z = re2.exec(eq); it.end = z ? z.index : eq.length; ends.push(it.end); }
  return out;
}
/** 1 行の印から、前の印(第153報)の題と、継いだ印の題を読む */
export function markParts(line) {
  const s = String(line || ''), i153 = s.indexOf(MA153), i155 = s.indexOf('。' + MA155);
  const seg153 = i153 < 0 ? '' : s.slice(i153, i155 < 0 ? s.length : i155), seg155 = i155 < 0 ? '' : s.slice(i155 + 1);
  const pre = MARK_KEYS.filter((k) => seg153.indexOf(ANS153[k]) >= 0), post = MARK_KEYS.filter((k) => seg155.indexOf(ANS155[k]) >= 0);
  return { pre, post, seg153, seg155, n155: s.split(MA155).length - 1 };
}
/** 継ぐ印の字(前の印の題の順) */
export const seg155Of = (keys) => '。' + MA155 + keys.map((k) => ANS155[k]).join('/');
/** EQ-130〜EQ-182 の主の列の印で、前の印に背景の大きさか換算の係数の第153報の字を持つ項に、後ろの印を継ぐ(既に継いである項は変えない —— 冪等) */
export function remark155(eq) {
  eq = String(eq || ''); let out = '', last = 0;
  for (const it of itemsOf(eq)) {
    if (it.num < MARK_FIRST || it.num > MARK_LAST) continue;
    const blk = eq.slice(it.start, it.end), m = MK_RE.exec(blk); if (!m) continue;
    const line = m[0], p = markParts(line);
    if (!p.pre.length || p.n155) continue;
    const at = it.start + m.index + line.length;
    out += eq.slice(last, at) + seg155Of(p.pre); last = at;
  }
  return out + eq.slice(last);
}
/** 継いだ印を外す(前の形に戻す —— 照合用) */
export function unremark155(eq) {
  return String(eq || '').split('\n').map((l) => { if (!l.startsWith('- **主の列の印**: ')) return l; const i = l.indexOf('。' + MA155); return i < 0 ? l : l.slice(0, i); }).join('\n');
}
/** 項ごとの印の一覧(EQ-130〜EQ-182) */
export function marksOf(eq) {
  eq = String(eq || ''); const R = [];
  for (const it of itemsOf(eq)) {
    if (it.num < MARK_FIRST || it.num > MARK_LAST) continue;
    const m = MK_RE.exec(eq.slice(it.start, it.end)); if (!m) continue;
    const p = markParts(m[0]); if (!p.pre.length && !p.n155) continue;
    R.push({ id: it.id, num: it.num, pre: p.pre, post: p.post, n155: p.n155, seg155: p.seg155 });
  }
  return R;
}
export function countsOf(eq) {
  const R = marksOf(eq), c = { items: R.length, mag: 0, k: 0, seg: 0 };
  for (const r of R) for (const k of r.pre) { c[k]++; c.seg++; }
  return c;
}

// ---- 表の markdown(本節の表はこの関数の出力と逐語で同じ)
export function table1Md() {
  const R = ['| # | 出どころ | 原文(言葉を変えずに引く —— 「。」で文に分けた。継ぐと原文に戻る) | 文の種類 | 読み(原文と分ける) | 当たる節 |', '|---|---|---|---|---|---|'];
  for (const r of TABLE1) R.push(`| ${r[0]} | ${SRC_OF[r[1]]} | ${q(sentOf(r))} | ${r[3]} | ${r[4]} | ${r[5]} |`);
  return R.join('\n');
}
export function table2Md() {
  const R = ['| 題 | 前(〔第353便zl〕の表 2 の字 —— 当時の節に残る) | 後(回答の形 —— 回答で主に置いた列) | 比べる列か選択肢(残す) | 当たる節 |', '|---|---|---|---|---|'];
  for (const r of MAIN) R.push(`| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} |`);
  return R.join('\n');
}
export function table3Md() {
  const R = ['| 鎖 | 題 | 文の並び(出どころと原文 —— 前の文は当時の節に残る) | 読み(原文と分ける) |', '|---|---|---|---|'];
  for (const r of CHAIN) R.push(`| ${r[0]} | ${r[1]} | ${r[2].map(([s, t]) => s + ' ' + q(t)).join(' → ')} | ${r[3]} |`);
  return R.join('\n');
}
/** 表 4: 計算式の一覧の印の置き直しの所(どこに・いくつ・どの字)—— 置き直した後の一覧から作る */
export function table4Md(eq) {
  const R = ['| 項 | 前の印(第153報の時点の字 —— 残す)の題 | 継いだ印の題 | 継いだ印の字の数 |', '|---|---|---|---|'];
  for (const r of marksOf(eq)) R.push(`| ${r.id} | ${r.pre.map((k) => MARK_NAME[k]).join('・')} | ${r.post.map((k) => MARK_NAME[k]).join('・') || '無い'} | ${r.post.length} |`);
  return R.join('\n');
}
export function countLine(eq) {
  const c = countsOf(eq);
  return '置き直した所: 計算式の一覧の項 ' + c.items + '・継いだ印の字 ' + c.seg + '(背景の大きさ ' + c.mag + '・換算の係数 ' + c.k + ')';
}

// ---- 書かない語
export const EXT_NAMES = ZL.EXT_NAMES;
const rv = (x) => x.split('').reverse().join('');
export const PRIVATE_NAMES = Object.freeze(ZL.PRIVATE_NAMES.concat(['a553-W', '451TROPER', '551TROPER', '553evaw-piw', '553nommoc'].map(rv)));
export const PRIVATE_RE = ZL.PRIVATE_RE;
/** 引用の中でも書かない語(共通の教訓 1) */
export const NEVER = Object.freeze(['再現した', '再現しない', '私信', '添付', '審査', '合わせられない', '普遍定数', '収束した', '法則を発見した', 'フィットした', '較正した', '完全に一致']);
/** 引用の外で書かない語(共通の教訓 2 と〔第353便zl〕の語) */
export const PAST = Object.freeze(ZL.PAST.concat(['合った', '決まった', '導けた', '確かめた', '示した', '説明できた', '直った', '対応した', '通るようになった']).filter((w, i, a) => a.indexOf(w) === i));
export const NOT155 = Object.freeze(ZL.NOT153.concat([/固定(?!しない|せず)/, /0\.98 倍に置いた/, /0\.98 倍を主/]));
export const cells = ZL.cells, tabIn = ZL.tabIn, physSecOf = ZL.physSecOf, para = ZL.para, outsideQuotes = ZL.outsideQuotes;
const strip = (t) => outsideQuotes(t).replace(/『[^』]*』/g, '').replace(/[^。\n]*と書かない[^。\n]*。/g, '').replace(/[^。\n]*とは書かない[^。\n]*。/g, '');

// ---- docs.report155_355a の照合(ph = PHYSICS・as = AI_SPEC・pm = post-merge・eq = 計算式の一覧・eq0 = 置き直す前の一覧〔変異の自己試験用に任意〕)
export const SEC_HEADS = Object.freeze(['**① 原文と読み。**', '**表 1 指示と回答の文の当たる節(', '**表 2 主の列の切り替え(', '**表 3 訂正の鎖(', '**表 4 計算式の一覧の主の列の印の置き直し(',
  '**② 印の置き方。**', '**③ 検査。**', '**④ 決断事項の候補。**', '**⑤ 言わないこと。**', 'docs.report155_355a', 'tests/lib-w355a-report155doc.mjs']);
export function checkReport155(ph, as, pm, eq) {
  const bad = [], cases = [];
  ph = String(ph || ''); as = String(as || ''); pm = String(pm || ''); eq = String(eq || '');
  const sec = physSecOf(ph, HEAD), iA = ph.indexOf('\n' + HEAD), iP = ph.indexOf('\n' + PREV_HEAD), iZ = ph.indexOf('\n' + ZL.HEAD), iT = ph.indexOf('\n〔第328便 — 統括');
  // ① 位置・見出し・必須の語
  if (!(iA >= 0 && iP >= 0 && iZ >= 0 && iZ < iA && iP < iA && iT > iA)) bad.push('① PHYSICS〔第355便a〕の位置(〔第353便zl〕〔第354便a〕より後・第328便の統括の節より前)');
  const h1 = sec.split('\n')[0];
  for (const w of [SRC_I, SRC_A, 'R504', '文書だけ', 'html は変えていない']) if (h1.indexOf(w) < 0) bad.push('① 見出しに「' + w + '」が無い');
  for (const w of SEC_HEADS) if (sec.indexOf(w) < 0) bad.push('① PHYSICS〔第355便a〕に「' + w + '」が無い');
  if (/〔第\d+便 — 統括〕/.test(sec)) bad.push('① 本節に統括の節の見出しの字をそのまま書いている');
  if (/第15[45]報/.test(sec)) bad.push('① 本節に原仮定者の文の番号(日付で指す)');
  cases.push('① 位置(〔第353便zl〕〔第354便a〕より後・統括の節より前)・見出し・必須の語・文の番号を書かない');
  // ② 原文 —— 逐語・第353便の統括の節に同じ字で在る・継ぐと原文に戻る
  { const T = tabIn(sec, '**表 1 '), orig = physSecOf(ph, ORIG_HEAD);
    for (const k of LINE_KEYS) if (orig.indexOf(L[k]) < 0) bad.push('② 原文 ' + k + ' が' + ORIG_NAME + 'に同じ字で無い');
    if (sentencesOf('respect').length !== N_I || sentencesOf('d1113').length !== N_A) bad.push('② 文の数(指示 ' + N_I + '・回答 ' + N_A + ' のはず)');
    for (const k of LINE_KEYS) { const rows = TABLE1.filter((r) => r[1] === k).sort((a, b) => a[2] - b[2]);
      if (rows.length !== sentencesOf(k).length || rows.map(sentOf).join('。') !== L[k]) bad.push('② 行 ' + k + ' の文を継いでも原文に戻らない'); }
    if (T.join('\n') !== table1Md().split('\n').slice(2).join('\n')) bad.push('② 表 1 が lib の出力と違う(原文・出どころ・読み・当たる節)');
    for (const r of TABLE1) for (const m of r[5].match(/〔第35\d便[a-z]+〕/g) || []) if (!NAME_ONLY.includes(m) && ph.indexOf('\n' + m.replace('〕', ' — ')) < 0) bad.push('② 表 1 の ' + r[0] + ' の当たる節 ' + m + ' が PHYSICS に無い'); }
  cases.push(`② 表 1 の ${TABLE1.length} 文(指示 ${N_I}・回答 ${N_A} —— 原文が${ORIG_NAME}に同じ字で在る・継ぐと原文に戻る・lib の出力と逐語・当たる節が PHYSICS に在る〔並行の枝の節は名だけ〕)`);
  // ③ 表 2 —— 主の列の切り替え(前 = 〔第353便zl〕の表 2 の字・後 = 回答の形)
  { const T = tabIn(sec, '**表 2 ');
    if (T.join('\n') !== table2Md().split('\n').slice(2).join('\n')) bad.push('③ 表 2 が lib の出力と違う(前・後・比べる列)');
    const zt = tabIn(physSecOf(ph, ZL.HEAD), '**表 2 ');
    for (const r of MAIN) if (!zt.some((l) => cells(l)[1] === r[1])) bad.push('③ 表 2 の ' + r[0] + ' の「前」の字が〔第353便zl〕の表 2 に無い');
    const kr = cells(T.find((l) => l.startsWith('| 換算の係数 |')) || ''), mr = cells(T.find((l) => l.startsWith('| 背景の大きさ |')) || '');
    if (!((kr[2] || '').startsWith('**金星で等大になる値**') && /列 \(イ\) の作り/.test(kr[2] || ''))) bad.push('③ 表 2 の換算の係数の後が「金星で等大になる値(列 (イ) の作り)」でない');
    if (!((mr[2] || '').startsWith('**比 1 の線で惑星が分かれる範囲の内**') && /0\.98 倍は範囲の内の 1 点 —— 固定しない/.test(mr[2] || ''))) bad.push('③ 表 2 の背景の大きさの後が「範囲の内・0.98 倍は 1 点(固定しない)」でない');
    if (!/\(ウ\)/.test(mr[3] || '') || !/\(ア\)/.test(mr[3] || '') || !/窓/.test(mr[3] || '')) bad.push('③ 表 2 の背景の大きさの比べる列に (ウ)・(ア)・窓が無い'); }
  cases.push(`③ 表 2 の主の列の切り替え ${MAIN.length} 題(lib の出力と逐語・前の字が〔第353便zl〕の表 2 に在る・換算の係数 = 金星で等大・背景 = 範囲の内〔0.98 倍は 1 点 —— 固定しない〕・比べる列 (ウ)(ア)・窓)`);
  // ④ 表 3 —— 訂正の鎖(〔第353便zl〕の鎖が頭に在り、後ろに継ぐ・前の文が当時の節に残る)
  { const T = tabIn(sec, '**表 3 ');
    if (T.join('\n') !== table3Md().split('\n').slice(2).join('\n')) bad.push('④ 表 3 が lib の出力と違う');
    const zt = tabIn(physSecOf(ph, ZL.HEAD), '**表 3 ');
    for (let n = 0; n < ZL.CHAIN.length; n++) { const zc = cells(zt[n] || ''), mc = cells(T[n] || '');
      if (!(zc.length === 4 && mc[0] === zc[0] && mc[1] === zc[1] && (mc[2] || '').startsWith(zc[2]) && (mc[3] || '').startsWith(zc[3]))) bad.push('④ 表 3 の ' + (ZL.CHAIN[n][0]) + ' が〔第353便zl〕の鎖を頭に持たない(前の段を消さずに継ぐ)'); }
    for (const r of CHAIN) for (const [, t, h] of r[2]) if (h !== HEAD && physSecOf(ph, h).indexOf(t) < 0) bad.push('④ 表 3 の ' + r[0] + ' の前の文が ' + (h === ORIG_HEAD ? ORIG_NAME : h.replace(' — ', '') + '〕') + 'に残っていない');
    const c1 = cells(T[0] || '')[2] || '';
    if (!(c1.indexOf(SRC_I + ' ' + q(L.respect)) >= 0 && c1.indexOf(SRC_A + ' ' + q(L.d1113)) > c1.indexOf(SRC_I))) bad.push('④ 表 3 の鎖 1 の後ろに指示と回答の段が無い'); }
  cases.push(`④ 表 3 の訂正の鎖 ${CHAIN.length}(lib の出力と逐語・〔第353便zl〕の鎖 ${ZL.CHAIN.length} を頭に持ち後ろに継ぐ・前の文が当時の節に残る)`);
  // ⑤ 計算式の一覧の印 —— 置き直した所が lib の口と同じ(冪等)・継いだ印のほかは 1 字も変えていない・表 4 が一覧から作った行と逐語
  { const c = countsOf(eq), R = marksOf(eq);
    if (remark155(eq) !== eq) bad.push('⑤ 計算式の一覧の印に、継いでいない項か形の違う印が在る(lib の remark155 で一覧が変わる)');
    for (const r of R) { if (r.n155 !== 1) bad.push('⑤ ' + r.id + ' の継いだ印の数 ' + r.n155 + '(1)'); if (r.pre.join('|') !== r.post.join('|')) bad.push('⑤ ' + r.id + ' の継いだ印の題(' + r.post.join('・') + ')が前の印の題(' + r.pre.join('・') + ')と違う');
      if (r.seg155 !== seg155Of(r.pre).slice(1)) bad.push('⑤ ' + r.id + ' の継いだ印の字が lib の口と違う'); }
    if (!(c.items >= 1 && c.seg === c.mag + c.k)) bad.push('⑤ 印の数え');
    const u = unremark155(eq), a = eq.split('\n'), b = u.split('\n');
    if (a.length !== b.length || a.some((l, n) => l !== b[n] && !l.startsWith('- **主の列の印**: '))) bad.push('⑤ 継いだ印のほかの行が変わっている');
    if (u.indexOf(MA155) >= 0 || eq.split(MA155).length - 1 !== c.items) bad.push('⑤ 継いだ印が主の列の印の欄の外に在る');
    const T = tabIn(sec, '**表 4 ');
    if (T.join('\n') !== table4Md(eq).split('\n').slice(2).join('\n')) bad.push('⑤ 表 4 が計算式の一覧から作った行と違う');
    if (para(sec, '**② 印の置き方。**').indexOf(countLine(eq)) < 0) bad.push('⑤ ② の数の文が一覧の数と違う');
    cases.push(`⑤ 計算式の一覧の印 —— 項 ${c.items}・継いだ印の字 ${c.seg}(背景の大きさ ${c.mag}・換算の係数 ${c.k})が lib の口と同じ(冪等)・継いだ印のほかの行は変わらない・表 4 と ② の数の文が一覧と逐語`); }
  // ⑥ 前の節(〔第353便zl〕)の本文が変わっていない(lib の表と逐語のまま)
  { const zs = physSecOf(ph, ZL.HEAD);
    if (tabIn(zs, '**表 2 ').join('\n') !== ZL.table2Md().split('\n').slice(2).join('\n') || tabIn(zs, '**表 3 ').join('\n') !== ZL.table3Md().split('\n').slice(2).join('\n') || tabIn(zs, '**表 1 ').join('\n') !== ZL.table1Md().split('\n').slice(2).join('\n')) bad.push('⑥ 〔第353便zl〕の表 1〜3 が当時の lib の出力と違う(前の節の本文を書き換えない)');
    if (zs.indexOf(MA155) >= 0 || zs.indexOf('〔第355便a') >= 0) bad.push('⑥ 〔第353便zl〕に本節の字が入っている'); }
  cases.push('⑥ 〔第353便zl〕の表 1〜3 が当時の lib の出力と逐語のまま・本節の字が入っていない');
  // ⑦ AI_SPEC §396・post-merge
  let ai = '';
  { const a396 = as.search(/\n## 396\. 第355便a/), a395 = as.search(/\n## 395\. 第354便a/);
    if (a396 >= 0) { const z = as.indexOf('\n## ', a396 + 4); ai = as.slice(a396 + 1, z < 0 ? as.length : z); }
    if (!(a396 >= 0 && a395 >= 0 && a395 < a396 && [SRC_I, SRC_A, 'R504', '金星で等大になる値', '範囲の内', 'SYSTEM_PROMPT には載せない', 'docs.report155_355a'].every((w) => ai.indexOf(w) >= 0))) bad.push('⑦ AI_SPEC §396(§395 より後・必須の語)');
    const e354 = pm.indexOf('# ==== 第354便a の塊(ここまで)====');
    if (!(e354 >= 0 && pm.indexOf('# ==== 第355便a の塊(ここから)====') > e354 && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.report155_355a/.test(pm))) bad.push('⑦ post-merge に第355便a の塊(第354便a の塊より後)'); }
  cases.push('⑦ AI_SPEC §396(§395 より後)・post-merge の塊');
  // ⑧ 書かない語
  { const marks = marksOf(eq).map((r) => r.seg155).join('\n');
    for (const [nm, tx] of [['PHYSICS〔第355便a〕', sec], ['AI_SPEC §396', ai], ['継いだ印', marks]]) {
      for (const w of EXT_NAMES.concat(PRIVATE_NAMES)) if (tx.indexOf(w) >= 0) bad.push('⑧ ' + nm + ' に禁句(引用も含めて —— ' + w.length + ' 字)');
      if (PRIVATE_RE.test(tx)) bad.push('⑧ ' + nm + ' に private の文書の名の形');
      for (const w of NEVER) if (tx.indexOf(w) >= 0) bad.push('⑧ ' + nm + ' に引用の中でも書かない語「' + w + '」');
      const s = strip(tx);
      for (const w of PAST) if (s.indexOf(w) >= 0) bad.push('⑧ ' + nm + ' に書かない語「' + w + '」');
      for (const re of NOT155) if (re.test(s)) bad.push('⑧ ' + nm + ' に書かない語 ' + re.source);
      if (/(^|[^_A-Za-z])κ/.test(tx)) bad.push('⑧ ' + nm + ' に裸の係数記号');
    } }
  cases.push(`⑧ 禁句 ${EXT_NAMES.length + PRIVATE_NAMES.length + 1}・引用の中でも書かない語 ${NEVER.length}・書かない語 ${PAST.length + NOT155.length}(引用と「書かない」の文の外 —— 「固定」は「固定しない」のほか書かない)・係数記号(本節・§396・継いだ印)`);
  return { bad, cases };
}

/** 純関数の零試験(QA が呼ぶ —— 文の分け方・鎖の継ぎ・印の継ぎと外し・冪等) */
export function libGates() {
  const bad = [];
  if (sentencesOf('respect').length !== N_I || sentencesOf('d1113').length !== N_A) bad.push('文の数');
  for (const k of LINE_KEYS) if (sentencesOf(k).join('。') !== L[k]) bad.push('継ぎ ' + k);
  if (TABLE1.length !== N_I + N_A) bad.push('表 1 の行の数');
  if (MAIN.length !== 6 || CHAIN.length !== ZL.CHAIN.length + 1) bad.push('表 2・表 3 の行の数');
  for (let n = 0; n < ZL.CHAIN.length; n++) { const a = ZL.CHAIN[n][2], b = CHAIN[n][2]; if (!a.every((x, i) => b[i] === x)) bad.push('鎖 ' + (n + 1) + ' の頭が〔第353便zl〕の鎖と違う'); }
  if (CHAIN[0][2].length !== ZL.CHAIN[0][2].length + 2) bad.push('鎖 1 に継ぐ段の数');
  const fx = '\n## 4. 各項\n\n### EQ-150 a\n\n- **主の列の印**: X。' + MA153 + ANS153.mag + '/' + ANS153.k + '\n- **解説**: y\n\n### EQ-151 b\n\n- **主の列の印**: X。' + MA153 + 'ほか\n\n### EQ-183 c\n\n- **主の列の印**: X。' + MA153 + ANS153.k + '\n\n## 5. 名\n';
  const r1 = remark155(fx);
  if (r1.split(MA155).length - 1 !== 1 || r1.indexOf(ANS153.k + seg155Of(['mag', 'k'])) < 0) bad.push('remark155 の継ぎ(範囲の内の 1 項だけ・前の題の順)');
  if (remark155(r1) !== r1) bad.push('remark155 の冪等');
  if (unremark155(r1) !== fx) bad.push('unremark155 で元に戻らない');
  const c = countsOf(r1); if (!(c.items === 1 && c.mag === 1 && c.k === 1 && c.seg === 2)) bad.push('countsOf');
  if (markParts('a。' + MA153 + ANS153.k).pre.join() !== 'k') bad.push('markParts');
  for (const k of MARK_KEYS) if (ANS155[k].indexOf(ANS153[k]) >= 0 || ANS153[k].indexOf(ANS155[k]) >= 0) bad.push('継ぐ字と前の字が重なる ' + k);
  if (ANS153.mag.indexOf(ZL.OPT) < 0) bad.push('前の字の選択肢の印');
  return { bad, n: 12 + LINE_KEYS.length };
}

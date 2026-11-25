// 第355便e(統括の検証項目 R508): **計算式の一覧(docs/EQUATIONS.md)に〔第355便b〕の式を EQ-190 から載せた項と、冒頭の 1 行・§2a・§7 の規則 24(第355便 a・d・e の分をまとめて)の照合の純関数 —— 文書だけ**
//   (QA docs.equations355e が読む —— ファイルを読まない・状態を持たない。読むファイルは呼ぶ側が渡す: rd(経路) → 文字列か null・exists(経路) → 真偽)。
//   html・エンジン・内蔵の本・受理器・physics の鍵・既存の lib の本文・既存の項(EQ-01〜EQ-189)の行は変えない。項は第350便h の共通の読み手で読む。
//   世代の写し view355dOf355e: 第355便d の照合(docs.equations355d)は「EQ-183 以降は EQ-183〜EQ-189 だけ」「項は 189」を見るので、EQ-190 以降の項と §2a の EQ-190 以降の参照を外した写し
//   (第350便h の eqFixedView350h(eq, 189) —— 第355便d が第353便zz に渡した写しと同じ型)で読む。照合の中身は変えない。
// ■ 言わないこと: 項は候補の式の索引(現実の宇宙の主張ではない)。潮汐のトルクは「比べる列(DFM の式ではない)」。観測の自転・k₂/Q は仮の値・未照合。範囲を 1 つの値に置かない。
import * as ER from './lib-w350h-eqreader.mjs';
import * as T34 from './lib-w334f-terms.mjs';
import * as T37 from './lib-w337g-equations.mjs';
import * as D from './lib-w355d-equations.mjs';

export const LIB_VERSION = 'w355e-equations-lib-1';
export const FIRST = 190, LAST = 194, PREV_LAST = 189;
export const SEC = '〔第355便b — ', SEC_NAME = '〔第355便b〕';
export const PATHS = Object.freeze(['tests/exp-w355b-bgrange.mjs', 'tests/lib-w355b-bgrange.mjs', 'tests/out/bgrange-355b.json']);
export const GRAV = D.GRAV, PROV = D.PROV;
const KQ = '潮汐の k₂/Q(潮汐ロックの定義の比 X)(第353便zk)', KM = '自転の率と直交成分の置き方(第353便zk)', KC = '主の列の候補 3 本((ア)(イ)(ウ))の並べ方(第353便zf)',
  KO = '源の扁平の候補 (O0)〜(O3)(第353便d)', KP = '(P-応) の物差し c_ref・R_ref と慣性モーメントの係数 c(第353便c)';
/** 項ごとの錨: fns = 正本を作る関数(lib の名指しの定義)・eqs = 出どころの節と同じ字の式・knobs = 台帳の行の名と状態・grav = 比べる列の印・prov = 仮の値の印 */
export const ANCHOR = Object.freeze({
  'EQ-190': { name: '主の作りの換算の係数 k(u) と合成の回転 Ω(u)', fns: ['pureScenes', 'uVOf', 'omOfB', 'locParts'],
    eqs: ['k(u) = u ÷ u_V', 'u_V = 金星の条件の値 = abs(σ_太陽 × 金星での太陽の自転の分) ÷ ω_G', 'Ω(u) = u × ω_G n̂ + k(u) ×(σ_太陽 × 太陽の自転の分 + σ_母 × 母天体の自転の分〔衛星だけ〕)', 'σ = (1 − f)^(−2/3)'],
    knobs: [[KC, '候補'], [KO, '候補']], grav: false, prov: false },
  'EQ-191': { name: '比 X(主の作り —— 物差しの半径 R_ref の慣性で読む軸引きずりの直交成分のトルク)', fns: ['pureScenes', 'xOfB', 'respFactor'],
    eqs: ['X = N_潮 ÷ N_軸', 'N_潮 = 1.5 × k₂/Q × G M_相手² R⁵ ÷ a⁶', 'N_軸 = c_ref M R_ref² × 自転の率 × abs(Ω × ŝ)'],
    knobs: [[KQ, '候補'], [KM, '候補'], [KP, '候補']], grav: true, prov: true },
  'EQ-192': { name: '範囲の端(閉じた形 —— X は u に反比例)', fns: ['pureScenes', 'uRange', 'xRowsB'],
    eqs: ['X(u) = X(1) ÷ u', '下端 = ロックしない側の X(1) の最大', '上端 = ロックの側の X(1) の最小'],
    knobs: [[KQ, '候補'], [KM, '候補']], grav: true, prov: true },
  'EQ-193': { name: '(P-応) の倍(X に掛かる)', fns: ['pureScenes', 'respFactor', 'respFactorAlt'],
    eqs: ['X_(P-応) = X_規則の球 ×(C R_観測²)÷(c_ref R_ref²)', 'm =(c_ref ÷ c)(R_ref ÷ (c_R R_観測))²'],
    knobs: [[KP, '候補']], grav: true, prov: false },
  'EQ-194': { name: '置き方の組の範囲の共通部分', fns: ['pureScenes', 'commonPart', 'overlap'],
    eqs: ['下端 = 組の下端の最大・上端 = 組の上端の最小'],
    knobs: [[KQ, '候補'], [KM, '候補']], grav: true, prov: true },
});
export const IDS = Object.freeze(Object.keys(ANCHOR));
export const FIELDS = D.FIELDS;
export const S6_LINE = '第355便b の候補の型の式(主の作りの換算の係数と合成の回転・比 X・範囲の端・(P-応) の倍・置き方の組の範囲の共通部分)は EQ-190〜EQ-194 が拾う(第355便e —— 項は 194)。';
/** 冒頭の 1 行・§2a の 1 行・§7 の規則 24 の頭(第355便 a・d・e の分をまとめて —— 照合はこの頭と必須の語) */
export const HEAD_LINE = '- **第353便zk・第355便b の式と主の列の印の置き直し(第355便 a・d・e)**: ';
export const S2A_LINE = '- **第355便の式**(第355便d・第355便e —— ';
export const S7_RULE = '24. **第355便の式と主の列の印の置き直し**(第355便 a・d・e —— `docs.report155_355a`・`docs.equations355d`・`docs.equations355e`): ';
export const HEAD_MUST = Object.freeze(['原仮定者の指示(2026-11-25)', '原仮定者の回答(2026-11-25)', 'R504', 'R507', 'R508', 'EQ-183〜EQ-189', 'EQ-190〜EQ-194', '診断', '前の印を残して', '式とラベルは変えていない']);
export const S2A_MUST = Object.freeze(['EQ-183〜EQ-189', 'EQ-190〜EQ-194', '〔第353便zk〕', '〔第355便b〕', GRAV]);
export const S7_MUST = Object.freeze(['EQ-183〜EQ-194', '診断', '「主の列の印」', '「。」で継ぐ', 'eqFixedView350h', 'EQ-182', 'EQ-189', '`MARK`']);
export const PH_HEAD = '〔第355便e — ';
export const AS_RE = /\n## 400\. 第355便e/;
export const AS_MUST = Object.freeze(['EQ-190〜EQ-194', '診断', 'docs.equations355e', 'docs.equations355d', 'view355dOf355e', 'SYSTEM_PROMPT には載せない', '現実の宇宙の主張ではない', GRAV, 'R508']);
export const PM_LINE = 'DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.equations355e docs.equations355d"';
export const NOT_WORDS = D.NOT_WORDS;
export const PRIVATE = D.PRIVATE;
export const physSecOf = D.physSecOf, stripQ = D.stripQ, stripCode = D.stripCode, norm = D.norm;
/** 世代の写し: 第355便d の照合へ渡す EQ-189 までの写し */
export function view355dOf355e(eq) { return ER.eqFixedView350h(String(eq || ''), PREV_LAST); }
const field = (text, f) => ((new RegExp('\\n- \\*\\*' + f.replace(/[()]/g, '\\$&') + '\\*\\*: ([^\\n]+)')).exec(text) || [])[1] || '';
const secUntil = (as, re) => { const i = as.search(re); if (i < 0) return ''; const j = as.indexOf('\n## ', i + 1); return as.slice(i, j < 0 ? as.length : j); };
const lineOf = (s, head) => (String(s || '').split('\n').find((l) => l.startsWith(head)) || '');
const topOf = (eq) => { const i = eq.indexOf('\n## 0. '); return i < 0 ? '' : eq.slice(0, i); };

/**
 * 照合: inp = { eq, ph, as, pm, rd, exists }。返す { bad, cases }。
 * ① 番号の連続と重複・EQ-190 以降は EQ-190〜EQ-194 だけ ② 欄・出どころの節と同じ字の式・経路・抜粋の範囲・台帳・比べる列・仮の値 ③ §3 の行・§6 の件数の文
 * ④ 世代の写し(EQ-189 までが元と同じ・EQ-190 以降と §2a の参照が無い) ⑤ 冒頭の 1 行・§2a の 1 行・§7 の規則 24 ⑥ PHYSICS〔第355便e〕の表・AI_SPEC §400・post-merge ⑦ 書かない語
 */
export function check355e(inp) {
  const { eq, ph, as, pm, rd, exists } = inp, bad = [], cases = [];
  const all = ER.eqItems350h(eq), A = ER.eqAudit350h(eq), nw = all.filter((z) => z.num >= FIRST);
  if (A.dups.length) bad.push('① 項の番号が重複(' + A.dups.join('・') + ')');
  if (A.firstGap) bad.push('① 項の番号が EQ-01 から連続でない(最初の外れ EQ-' + String(A.firstGap).padStart(2, '0') + '・項 ' + A.n + ')');
  if (nw.map((z) => z.id).join('|') !== IDS.join('|')) bad.push('① EQ-190 以降の項の番号: ' + (nw.map((z) => z.id).join('・') || '無い'));
  if (all.filter((z) => z.num >= 183 && z.num <= PREV_LAST).length !== 7) bad.push('① EQ-183〜EQ-189 の 7 項がそろわない');
  cases.push(`① 項の番号 EQ-01〜EQ-${A.last} の連続と重複(${A.n} 項)・EQ-190 以降は ${nw.length} 項`);
  const st = new Map(T37.parseKnobLedger337g(T37.policySection337g(ph)).rows.map((r) => [r[0], r[6]]));
  const ps = physSecOf(ph, SEC), libSrc = rd(PATHS[1]) || '', expSrc = rd(PATHS[0]) || '';
  if (!ps) bad.push('② 出どころの節 ' + SEC_NAME + ' が PHYSICS に無い');
  let nA = 0, nB = 0, nG = 0, nK = 0, nF = 0;
  for (const id of IDS) {
    const a = ANCHOR[id], it = all.find((z) => z.id === id);
    if (!it) { bad.push('② ' + id + ' が無い'); continue; }
    if (it.label !== '診断') bad.push('② ' + id + ' のラベル「' + it.label + '」が 診断 でない');
    if (T37.IMPL_MARK_337G.test(stripCode(it.text).replace(/\n- \*\*ラベル\*\*: [^\n]*/, ''))) bad.push('② ' + id + ' に実装の印');
    if (!(it.physRefs.length >= 1 && it.physRefs[0].head === SEC)) bad.push('② ' + id + ' の PHYSICS の節の行の先頭が ' + SEC_NAME + ' でない');
    const fm = field(it.text, '数式版');
    for (const w of a.eqs) { nA++; if (fm.indexOf(w) < 0) bad.push('② ' + id + ' の数式版に式「' + w.slice(0, 24) + '」が無い'); else if (ps.indexOf(w) < 0) bad.push('② ' + id + ' の式「' + w.slice(0, 24) + '」が出どころの節に同じ字で無い'); }
    for (const f of FIELDS) { nF++; if (!field(it.text, f)) bad.push('② ' + id + ' に欄「' + f + '」が無い'); }
    const tu = field(it.text, '時間の単位'); if (tu && !/絶対時間|当事者時間|時間を含まない/.test(tu)) bad.push('② ' + id + ' の時間の単位の欄に単位の語が無い');
    const kd = field(it.text, '実装か診断か'); if (kd && kd.indexOf('診断') !== 0) bad.push('② ' + id + ' の実装か診断かの欄が「診断」で始まらない');
    const mk = field(it.text, '正本を作る関数');
    if (mk.indexOf('器 `' + PATHS[0] + '` の `runAll`') < 0 || !T34.defSpan334f(expSrc, 'runAll')) bad.push('② ' + id + ' の正本を作る関数に器の runAll が無いか、器に runAll の定義が無い');
    for (const fn of a.fns) { if (mk.indexOf('`' + fn + '`') < 0) bad.push('② ' + id + ' の正本を作る関数に ' + fn + ' が無い'); else if (!T34.defSpan334f(libSrc, fn)) bad.push('② ' + id + ' の正本を作る関数 ' + fn + ' が lib に無い'); }
    const srcLine = field(it.text, '出どころ');
    for (const p of PATHS) { if (srcLine.indexOf('`' + p + '`') < 0) bad.push('② ' + id + ' の出どころに ' + p + ' が無い'); else if (!exists(p)) bad.push('② ' + id + ' の出どころの経路 ' + p + ' が実在しない'); }
    const progs = it.blocks || [];
    if (!progs.length) bad.push('② ' + id + ' にプログラム版が無い');
    for (const b of progs) { nB++;
      const wh = id + ' の抜粋 ' + b.k + '(' + b.file + ' · ' + b.name + ')';
      if (b.file !== PATHS[1]) { bad.push('② ' + wh + ' が出どころの lib でない'); continue; }
      const span = T34.defSpan334f(libSrc, b.name);
      if (!span) { bad.push('② ' + wh + ': 名の定義が無い'); continue; }
      const ns = norm(span);
      (b.frags || []).forEach((f, mi) => { nG++; const nf = norm(f); if (!nf || ns.indexOf(nf) < 0) bad.push('② ' + wh + ' の断片 ' + (mi + 1) + ' が定義の範囲に無い: «' + nf.slice(0, 50) + '»');
        const ln = f.split('\n').length; if (ln > 6 || nf.length > 320) bad.push('② ' + wh + ' の断片 ' + (mi + 1) + ': 長い(' + ln + ' 行・' + nf.length + ' 字 —— 6 行・320 字まで)'); }); }
    const kl = field(it.text, 'ノブの台帳'), pairs = [...kl.matchAll(/「((?:[^「」]|「[^「」]*」)+)」\(([^()]+)\)/g)].map((m) => [m[1], m[2]]);
    if (pairs.map((p) => p.join('|')).join('/') !== a.knobs.map((p) => p.join('|')).join('/')) bad.push('② ' + id + ' のノブの台帳の欄の行が錨と違う');
    for (const [nm, s] of pairs) { nK++; if (!st.has(nm)) bad.push('② ' + id + ' の台帳の行「' + nm.slice(0, 24) + '」が台帳に無い'); else if (st.get(nm) !== s) bad.push('② ' + id + ' の台帳の行「' + nm.slice(0, 24) + '」の状態「' + s + '」が台帳の「' + st.get(nm) + '」と違う'); }
    const ex = field(it.text, '解説'); if (!ex) bad.push('② ' + id + ' に解説が無い');
    if ((it.text.match(/\n- \*\*主の列の印\*\*: /g) || []).length) bad.push('② ' + id + ' に主の列の印の欄(主の作りの式 —— 欄を置かない)');
    if (a.grav) { if (!(fm.indexOf(GRAV) >= 0 && ex.indexOf(GRAV) >= 0)) bad.push('② ' + id + ' の比べる列の印(数式版と解説に「' + GRAV + '」)'); }
    else if (/潮汐のトルク|N_潮/.test(fm) && fm.indexOf(GRAV) < 0) bad.push('② ' + id + ' の数式版に潮汐のトルクが在るのに「' + GRAV + '」が無い');
    if (a.prov && fm.indexOf(PROV) < 0) bad.push('② ' + id + ' の数式版に仮の値の印「' + PROV + '」が無い');
  }
  cases.push(`② EQ-190〜EQ-194(診断)—— 出どころの節${SEC_NAME}と同じ字の式 ${nA}・欄 ${nF}・出どころの経路・抜粋 ${nB}・断片 ${nG}・台帳の欄 ${nK} 行・比べる列の印・仮の値の印・主の列の印の欄なし`);
  const s3 = ER.eqSection350h(eq, '3');
  for (const id of IDS) { const it = all.find((z) => z.id === id); if (!s3.split('\n').some((l) => it && l === '| ' + id + ' | ' + it.title + ' | ' + it.label + ' |')) bad.push('③ §3 の一覧に ' + id + ' の行が無い'); }
  const s6 = ER.eqSection350h(eq, '6');
  if (s6.indexOf('\n' + S6_LINE) < 0 || all.length !== LAST) bad.push('③ §6 の件数の文(EQ-190〜EQ-194・項は 194)');
  if (s6.indexOf('\n' + D.S6_LINE) < 0 || s6.indexOf('\n' + D.S6_LINE) > s6.indexOf('\n' + S6_LINE)) bad.push('③ §6 の第355便e の文が第355便d の文の後に無い');
  cases.push(`③ §3 の ${IDS.length} 行・§6 の件数の文(項 ${LAST} —— 第355便d の文の後)`);
  const V = view355dOf355e(eq), vi = ER.eqItems350h(V);
  if (vi.some((z) => z.num > PREV_LAST) || vi.length !== PREV_LAST) bad.push('④ 世代の写しに EQ-190 以降の項が残るか、項が 189 でない');
  for (const z of vi) { const o = all.find((x) => x.id === z.id); if (!o || o.text !== z.text) { bad.push('④ 世代の写しの ' + z.id + ' が元の項と違う'); break; } }
  const v2a = ER.eqSection350h(V, '2a'); if (/EQ-19\d/.test(v2a)) bad.push('④ 世代の写しの §2a に EQ-190 以降の参照が残る');
  cases.push(`④ 第355便d の照合へ渡す世代の写し view355dOf355e(EQ-01〜EQ-189 の ${vi.length} 項が元と同じ・EQ-190 以降と §2a の参照が無い)`);
  const top = topOf(eq), hl = lineOf(top, HEAD_LINE), s2a = ER.eqSection350h(eq, '2a'), al = lineOf(s2a, S2A_LINE), s7 = ER.eqSection350h(eq, '7'), rl = lineOf(s7, S7_RULE);
  if (!hl) bad.push('⑤ 冒頭に第355便の 1 行が無い'); for (const w of HEAD_MUST) if (hl && hl.indexOf(w) < 0) bad.push('⑤ 冒頭の 1 行に「' + w + '」が無い');
  if (top.split('\n').filter((l) => l.startsWith('- **')).pop() !== hl) bad.push('⑤ 冒頭の第355便の 1 行が冒頭の最後の行でない');
  if (!al) bad.push('⑤ §2a に第355便の式の 1 行が無い'); for (const w of S2A_MUST) if (al && al.indexOf(w) < 0) bad.push('⑤ §2a の 1 行に「' + w + '」が無い');
  if (!rl) bad.push('⑤ §7 に規則 24 が無い'); for (const w of S7_MUST) if (rl && rl.indexOf(w) < 0) bad.push('⑤ §7 の規則 24 に「' + w + '」が無い');
  if (rl && s7.split('\n').filter((l) => /^\d+\. /.test(l)).pop() !== rl) bad.push('⑤ §7 の規則 24 が最後の規則でない');
  cases.push(`⑤ 冒頭の 1 行(必須の語 ${HEAD_MUST.length})・§2a の 1 行(${S2A_MUST.length})・§7 の規則 24(${S7_MUST.length})—— 第355便 a・d・e の分をまとめて`);
  const sec = physSecOf(ph, PH_HEAD), iE = ph.indexOf('\n' + PH_HEAD), iD = ph.indexOf('\n〔第355便d — '), iT = ph.indexOf('\n〔第328便 — 統括');
  if (!(iE >= 0 && iD >= 0 && iD < iE && iT > iE)) bad.push('⑥ PHYSICS〔第355便e〕の位置(〔第355便d〕より後・統括の節より前)');
  for (const id of IDS) if (!sec.split('\n').some((l) => l.startsWith('| ' + id + ' | ' + SEC_NAME + ' | ' + ANCHOR[id].name + ' | 診断 |'))) bad.push('⑥ PHYSICS〔第355便e〕の表に ' + id + ' の行が無い');
  const ai = secUntil(as, AS_RE), i399 = as.search(/\n## 399\. 第355便d/);
  if (!(ai && i399 >= 0 && i399 < as.search(AS_RE))) bad.push('⑥ AI_SPEC §400 の位置(§399 の後)');
  for (const w of AS_MUST) if (ai.indexOf(w) < 0) bad.push('⑥ AI_SPEC §400 に「' + w.slice(0, 24) + '」が無い');
  const p0 = pm.indexOf('# ==== 第355便d の塊(ここまで)===='), p1 = pm.indexOf('# ==== 第355便e の塊(ここから)===='), p2 = pm.indexOf('# ==== 第355便e の塊(ここまで)====');
  if (!(p0 >= 0 && p0 < p1 && p1 < p2 && pm.slice(p1, p2).indexOf(PM_LINE) >= 0)) bad.push('⑥ post-merge に第355便e の塊(第355便d の塊の後)');
  cases.push(`⑥ PHYSICS〔第355便e〕(位置・表の ${IDS.length} 行)・AI_SPEC §400・post-merge の塊`);
  let nW = 0;
  for (const [nm, tx] of [['§6 の第355便e の文', S6_LINE], ['冒頭の 1 行', hl], ['§2a の 1 行', al], ['§7 の規則 24', rl]].concat(nw.map((z) => [z.id, z.text]))) {
    const s = stripQ(tx);
    for (const re of NOT_WORDS) if (re.test(stripCode(s))) bad.push('⑦ ' + nm + ' に書かない語 ' + re.source);
    for (const w of PRIVATE) if (String(tx).indexOf(w) >= 0) bad.push('⑦ ' + nm + ' に private の文書の名か書かない語(' + w.length + ' 字)');
    for (const b of T37.wordAudit337g(nm, tx)) bad.push('⑦ ' + b);
    for (const w of T34.DECIDE_WORDS_334F) if (stripCode(s).indexOf(w) >= 0) bad.push('⑦ ' + nm + ' に主の型を決めた語(' + w.length + ' 字)');
    if (stripCode(s).indexOf('法則') >= 0) bad.push('⑦ ' + nm + ' に式を指す「法則」の語');
    if (/固定(?!しない|せず)/.test(stripCode(s))) bad.push('⑦ ' + nm + ' に「固定」(固定しない のほか)');
    nW++;
  }
  cases.push(`⑦ 書かない語(${NOT_WORDS.length} 型・private の文書の名 ${PRIVATE.length}・第337便までの禁句・主の型を決めた語・「法則」・「固定」)—— ${nW} 本`);
  return { bad, cases };
}

export function mutations355e(inp) {
  const { eq, ph, as, pm } = inp;
  const blk = (id) => new RegExp('(### ' + id + ' [\\s\\S]*?)(?=\\n### |\\n## )');
  const inItem = (id, a, b) => eq.replace(blk(id), (m) => m.replace(a, b));
  const inSec = (a, b) => { const s = physSecOf(ph, PH_HEAD); return s ? ph.replace(s, s.replace(a, b)) : ph; };
  const E = (e) => ({ ...inp, eq: e }), P = (p) => ({ ...inp, ph: p }), S = (s) => ({ ...inp, as: s }), M = (m) => ({ ...inp, pm: m });
  return [
    ['EQ-192 の番号を EQ-199 に', E(eq.replace('\n### EQ-192 ', '\n### EQ-199 ')), /^① 項の番号が EQ-01 から連続でない/],
    ['EQ-191 を 2 つにする(番号の重複)', E(eq.replace('\n### EQ-192 ', '\n### EQ-191 ')), /^① 項の番号が重複/],
    ['EQ-191 の式の字を節と違える', E(inItem('EQ-191', 'N_軸 = c_ref M R_ref² × 自転の率', 'N_軸 = c_ref M R_ref² × 自転の速さ')), /^② EQ-191 の数式版に式「N_軸/],
    ['EQ-193 のラベルを実装〔opt-in〕に', E(eq.replace(/(### EQ-193 [^\n]*\n\n- \*\*ラベル\*\*: )診断/, '$1実装〔opt-in〕')), /^② EQ-193 のラベル/],
    ['EQ-192 の正本を作る関数の名を 1 字変える', E(inItem('EQ-192', '`uRange`(範囲の端)', '`uRangf`(範囲の端)')), /^② EQ-192 の正本を作る関数に uRange が無い/],
    ['EQ-194 の抜粋の断片の 1 字違い', E(inItem('EQ-194', 'r.lo > a.lo ? r : a', 'r.lo < a.lo ? r : a')), /^② EQ-194 の抜粋 1/],
    ['EQ-193 の台帳の欄の状態を対照に', E(inItem('EQ-193', '慣性モーメントの係数 c(第353便c)」(候補)', '慣性モーメントの係数 c(第353便c)」(対照)')), /^② EQ-193 の台帳の行/],
    ['EQ-190 に主の列の印の欄を足す', E(inItem('EQ-190', '\n- **プログラム版 1**', '\n- **主の列の印**: ' + D.MARK + '\n- **プログラム版 1**')), /^② EQ-190 に主の列の印の欄/],
    ['EQ-191 の数式版から比べる列の印を消す', E(inItem('EQ-191', '(' + GRAV + ')・N_軸', '・N_軸')), /^② EQ-191 の比べる列の印/],
    ['EQ-194 の数式版から仮の値の印を消す', E(inItem('EQ-194', '(観測の自転・k₂/Q は ' + PROV + ')', '')), /^② EQ-194 の数式版に仮の値の印/],
    ['EQ-190 の出どころの経路の字を変える', E(inItem('EQ-190', '正本 `tests/out/bgrange-355b.json`', '正本 `tests/out/bgrange-355x.json`')), /^② EQ-190 の出どころに tests\/out\/bgrange-355b\.json が無い/],
    ['§3 の EQ-193 の行を消す', E(eq.replace(/\n\| EQ-193 \| [^\n]*/, '')), /^③ §3 の一覧に EQ-193 の行が無い/],
    ['§6 の件数の文を消す', E(eq.replace('\n\n' + S6_LINE, '')), /^③ §6 の件数の文/],
    ['既存の項 EQ-189 の行を写しの外で変える(世代の写しの照合は通る)', E(inItem('EQ-189', '- **ラベル**: 診断', '- **ラベル**: 診断 ')), null],
    ['冒頭の 1 行から R508 を消す', E(eq.replace(/(\n- \*\*第353便zk・第355便b の式と主の列の印の置き直し[^\n]*?)R508/, '$1R5O8')), /^⑤ 冒頭の 1 行に「R508」/],
    ['§2a の 1 行を消す', E(eq.replace(new RegExp('\\n' + S2A_LINE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^\\n]*'), '')), /^⑤ §2a に第355便の式の 1 行が無い/],
    ['§7 の規則 24 を消す', E(eq.replace(new RegExp('\\n' + S7_RULE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^\\n]*'), '')), /^⑤ §7 に規則 24 が無い/],
    ['PHYSICS〔第355便e〕の表から EQ-194 の行を消す', P(inSec(/\n\| EQ-194 \| 〔第355便b〕 [^\n]*/, '')), /^⑥ PHYSICS〔第355便e〕の表に EQ-194 の行が無い/],
    ['AI_SPEC §400 から鍵の名を消す', S(as.replace('QA `docs.equations355e`', 'QA')), /^⑥ AI_SPEC §400 に「docs\.equations355e」が無い/],
    ['post-merge の第355便e の塊の鍵の行を消す', M(pm.replace(PM_LINE, '')), /^⑥ post-merge に第355便e の塊/],
    ['項に「第〜報」の番号を書く', E(inItem('EQ-192', '範囲を 1 つの値に置かない。', '範囲を 1 つの値に置かない(第154報)。')), /^⑦ EQ-192 に書かない語 第\\d\+報/],
    ['項に「固定」を書く', E(inItem('EQ-192', '範囲を 1 つの値に置かない。', '範囲を 1 つの値に置かない。0.98 倍に固定する。')), /^⑦ EQ-192 に「固定」/],
    ['書かない語を「」の中に置く(数えない)', E(inItem('EQ-192', '範囲を 1 つの値に置かない。', '範囲を 1 つの値に置かない(「決まった」とは書かない)。')), null],
  ];
}
export function selfTest355e(inp) {
  const bad = [], lines = [];
  for (const [nm, mi, re] of mutations355e(inp)) {
    if (mi.eq === inp.eq && mi.ph === inp.ph && mi.as === inp.as && mi.pm === inp.pm) { bad.push('⑧ 変異「' + nm + '」が入力を変えていない(置き換えの字が見つからない)'); continue; }
    const r = check355e(mi);
    if (re === null) { if (r.bad.length) bad.push('⑧ 変異「' + nm + '」が落ちた: ' + r.bad[0]); lines.push(nm + ' → ' + (r.bad.length ? '落ちる' : '通る')); continue; }
    const hit = r.bad.some((b) => re.test(b));
    if (!hit) bad.push('⑧ 変異「' + nm + '」が期待の違反で落ちない: ' + (r.bad[0] || '通った'));
    lines.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
  }
  return { bad, lines };
}

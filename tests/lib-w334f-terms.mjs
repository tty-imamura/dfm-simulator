// 第334便f(原仮定者の整理(2026-11-11)「引きずりについて」・原仮定者の回答(2026-11-10 —— AN609・AN610)・原仮定者の回答(2026-11-11 —— AN643)・統括の検証項目 R327):
//   **引きずり 3 種の用語の表(docs/EQUATIONS.md §2a)・第333便の診断の式の項(EQ-29 以降)・現象の状況一覧の更新した行の照合の純関数**
//   (QA lint.terms334f・docs.terms334f と docs.phenomena331e の転記の照合が読む —— html・エンジン・正本は読まない・状態を持たない・第331便e の lib は呼ぶだけ)。
//   照合: (i) §2a の位置(§2 の後・§3 の前)と表(5 欄・3 行 —— 並進引きずり・軸引きずり・回転引きずりの順・各行の必須の語と項の参照・状態のラベルの語彙)
//         (ii) 比べる列(第332〜333便の回転引きずりの式 —— 凍結の対照)・自己の並進 = 慣性・第334便で診断中の 1 行の明記
//         (iii) EQ-29 以降の項(番号の連番・ラベルは 診断 か 宣言〔未接続〕・PHYSICS の節の見出しの実在〔第333便の節を 1 つ以上〕・プログラム版の抜粋が tests の lib の
//               名指しの定義の範囲に空白をまとめた形で在る)(iv) EQ-15・EQ-16・EQ-28 の用語の注記 (v) 書かない語(主の型を決めた語・第334便の禁句)
//         (vi) 現象の状況一覧の更新した行(欄「第333便の調べ」を持つ行の集合・P33 の欄)。変異の自己試験(selfTest334f)は実物の写しを壊して期待の違反で落ちることを見る。
//   壊れたときは「どの表のどの行・どの項のどの抜粋・どの語か」を違反の文に書く。
import { NOT_WORDS_331E, wordAudit331e, parsePhenoDoc331e } from './lib-w331e-phenostatus.mjs';

export const TERMS_VERSION_334F = 'w334f-terms-1';
export const TERM_KINDS_334F = Object.freeze(['並進引きずり', '軸引きずり', '回転引きずり']);
export const TERM_COLS_334F = Object.freeze(['種', '定義(原仮定者の整理(2026-11-11)の語)', '式(説明の記号)', '今のエンジンの口との対応', '状態のラベル']);
export const EQ_LABELS_334F = Object.freeze(['実装〔既定〕', '実装〔opt-in〕', '実装〔読み口〕', '診断', '宣言〔未接続〕']);
export const NEW_LABELS_334F = Object.freeze(['診断', '宣言〔未接続〕']);
export const NEW_EQ_FROM_334F = 29;
/** 本便で足した項(第333便の診断の式) */
export const NEW_EQ_IDS_334F = Object.freeze(['EQ-29', 'EQ-30', 'EQ-31', 'EQ-32', 'EQ-33']);
/** 各行の必須の語(定義の語・項の参照) */
export const TERM_MUST_334F = Object.freeze({
  並進引きずり: Object.freeze(['移動と回転を使った座標変換', '慣性', 'W_ii', 'EQ-11', 'EQ-12', 'EQ-13', 'EQ-28', 'EQ-31']),
  軸引きずり: Object.freeze(['受ける側の部位による差分', '潮汐力の引きずり版', '源が横を通り抜けても', 'ω_field = ½∇×U', 'EQ-16', 'EQ-31', '別の量']),
  回転引きずり: Object.freeze(['回転による空間の捩れ', 'J 案が有望', 's_d = λ_J (f_obs/f_d)(R_obs/R_d)² s', 'EQ-15', 'EQ-29', 'EQ-30', '比べる列', '第334便で診断中']),
});
/** §2a の地の文の必須の語 */
export const SEC_MUST_334F = Object.freeze(['原仮定者の整理(2026-11-11)', 'R327', '比べる列(凍結の対照 —— 消さない)', '同じ「回転引きずり」の名で 2 つの型を両方とも主の型にしない',
  '自己の並進 = 慣性', 'EQ-12', '慣性の起源の主張ではない', '第334便で診断中']);
/** 注記を足した既存の項 */
export const NOTE_EQ_334F = Object.freeze(['EQ-15', 'EQ-16', 'EQ-28']);
/** 現象の状況一覧で欄「第333便の調べ」を持つ行(第334便f で更新した行と足した行) */
export const PHENO_ROWS_334F = Object.freeze(['P01', 'P05', 'P10', 'P12', 'P23', 'P24', 'P33']);
export const PHENO_FIELD_334F = '第333便の調べ';
/** 書かない語(「」の中の引用は除く): 主の型を決めた語(診断・宣言〔未接続〕の項と §2a)と第334便の禁句 */
const cp = (a) => String.fromCodePoint(...a);
export const DECIDE_WORDS_334F = Object.freeze([cp([0x63a1, 0x7528]), cp([0x78ba, 0x5b9a])]);   // 文字で持たない(本 lib の照合の語がそのまま文書の検索に掛からないように)
export const NOT_WORDS_334F = Object.freeze([/慣性を引きずりから導/, /高さ則で環の厚み/, /扁平な天体で引きずりが強まることを導/, /交点の並進の回転で水星の近点を/, /連星の残差の法則で観測に合/, /観測に合った/]);

// ── 主な数の転記の表(第334便f —— 第331便e の TRANSCRIPTS_331E と同じ型。docs.phenomena331e が第331便e の 86 項に足して照合する)──
export const TRANSCRIPTS_334F = Object.freeze([
  { row: 'P01', text: '交点 +20.27″/世紀・傾き +14.11″/世紀', src: 'phys', ref: '〔第333便c — ' },
  { row: 'P01', text: '+242.9″/世紀', src: 'phys', ref: '〔第333便c — ' },
  { row: 'P01', text: 'ϖ は +0.42″/世紀', src: 'phys', ref: '〔第333便c — ' },
  { row: 'P05', text: '等質量では受け手 n = 2 と対称 n = 2 は同じ 4/3', src: 'phys', ref: '〔第333便c — ' },
  { row: 'P05', text: '一次と 6e-5 の内', src: 'phys', ref: '〔第333便c — ' },
  { row: 'P12', text: '2Y_k m ÷ H = 1.001', src: 'phys', ref: '〔第332便a — ' },
  { row: 'P12', text: '2e-6° の桁', src: 'phys', ref: '〔第333便a — ' },
  { row: 'P12', text: 'x = 0.46〜1.35', src: 'phys', ref: '〔第333便b — ' },
  { row: 'P23', text: '腕で 1〜8 %・分散で 1〜5 % の桁', src: 'phys', ref: '〔第333便d — ' },
  { row: 'P23', text: '腕 ÷ ばらつき 0.85〜1.35', src: 'phys', ref: '〔第333便d — ' },
  { row: 'P23', text: '方位 24 点 −0.32 %・48 点 1.77 %・間隔 0.5 kpc 11.66 %', src: 'phys', ref: '〔第333便d — ' },
  { row: 'P24', text: '非円の族で 0.24〜0.71', src: 'phys', ref: '〔第333便d — ' },
  { row: 'P33', text: '惑星 8/8・衛星 6/7〔逆行のトリトンは逆〕・環の粒子 6/6', src: 'phys', ref: '〔第333便a — ' },
  { row: 'P33', text: '7.166e-19〜7.264e-14', src: 'phys', ref: '〔第333便a — ' },
  { row: 'P33', text: '1.979e-10〜2.006e-5', src: 'phys', ref: '〔第333便a — ' },
  { row: 'P33', text: '5.464e-2〜5.538e3', src: 'phys', ref: '〔第333便a — ' },
].map((o) => Object.freeze(o)));

const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const stripQ = (t) => String(t || '').replace(/「[^」]*」/g, '');
const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());

// ── 読み取り ──
/** 見出し「## 2a. 」から次の「## 」まで */
export function termSection334f(eq) {
  const s = String(eq || ''), i = s.indexOf('\n## 2a. ');
  if (i < 0) return '';
  const j = s.indexOf('\n## ', i + 1);
  return s.slice(i + 1, j < 0 ? s.length : j);
}
/** §2a の表(頭と行) */
export function parseTermTable334f(sec) {
  const L = String(sec || '').split('\n'), tb = { head: null, rows: [] };
  for (const l of L) {
    if (!/^\|/.test(l)) { if (tb.head) break; continue; }
    if (!tb.head) { tb.head = cells(l); continue; }
    if (/^\|[-| ]+\|$/.test(l)) continue;
    tb.rows.push(cells(l));
  }
  return tb;
}
/** 項(### EQ-NN の見出しから次の「### 」か「## 」まで)・ラベル・PHYSICS の節の参照・抜粋のブロック */
export function eqItems334f(eq) {
  const s = String(eq || ''), out = [], re = /\n### (EQ-\d\d) ([^\n]*)/g;
  let m;
  while ((m = re.exec(s))) {
    const a = m.index + 1, n1 = s.indexOf('\n### ', a + 1), n2 = s.indexOf('\n## ', a + 1);
    const ends = [n1, n2].filter((x) => x >= 0), text = s.slice(a, ends.length ? Math.min(...ends) : s.length);
    const label = ((/\n- \*\*ラベル\*\*: ([^\n]+)/.exec(text) || [])[1] || '').trim();
    const physLine = (/\n- \*\*PHYSICS の節\*\*: ([^\n]+)/.exec(text) || [])[1] || '';
    const physRefs = [...physLine.matchAll(/〔第(\d+)便([a-z]*)〕/g)].map((z) => ({ ref: z[0], head: '〔第' + z[1] + '便' + z[2] + ' — ', wave: Number(z[1]) }));
    const blocks = [];
    for (const b of text.matchAll(/- \*\*プログラム版 (\d+)\*\*\(`([^`]+)` · `([^`]+)`\)\n\n```js\n([\s\S]*?)\n```/g)) {
      const frags = [], cur = [];
      for (const ln of b[4].split('\n')) { if (ln.trim() === '// …') frags.push(cur.splice(0).join('\n')); else cur.push(ln); }
      frags.push(cur.splice(0).join('\n'));
      blocks.push({ k: Number(b[1]), file: b[2], name: b[3], frags });
    }
    out.push({ id: m[1], num: Number(m[1].slice(3)), title: m[2], text, label, physRefs, blocks });
  }
  return out;
}
/** 名指しの定義(function NAME( か const/let NAME =)から、次の列 0 の最上位の定義(export・function・const・let・class)の手前まで */
export function defSpan334f(src, name) {
  const s = String(src || ''), nm = esc(name);
  const re = new RegExp('^(?:export\\s+)?(?:async\\s+)?(?:function\\s+' + nm + '\\s*\\(|(?:const|let|var)\\s+' + nm + '\\s*=)', 'm');
  const m = re.exec(s);
  if (!m) return null;
  const nx = /\n(?:export |function |const |let |var |class |\/\* ─)/g; nx.lastIndex = m.index + m[0].length;
  const z = nx.exec(s);
  return s.slice(m.index, z ? z.index : s.length);
}

// ── 照合: 式の一覧(§2a と EQ-29 以降)──
// inp = { eq, ph, readText(rel) → string|null }
export function checkTerms334f(inp) {
  const bad = [], cases = [], eq = String(inp.eq || ''), ph = String(inp.ph || '');
  const items = eqItems334f(eq), ids = new Set(items.map((z) => z.id));
  // ① §2a の位置と表
  const i2 = eq.indexOf('\n## 2. '), i2a = eq.indexOf('\n## 2a. '), i3 = eq.indexOf('\n## 3. ');
  if (!(i2 >= 0 && i2a > i2 && i3 > i2a)) bad.push('① §2a の位置(§2 の後・§3 の前)');
  const sec = termSection334f(eq), tb = parseTermTable334f(sec);
  if (!tb.head || JSON.stringify(tb.head) !== JSON.stringify(TERM_COLS_334F)) bad.push('① §2a の表の頭が 5 欄の宣言と違う: ' + JSON.stringify(tb.head));
  const kinds = tb.rows.map((r) => r[0]);
  if (JSON.stringify(kinds) !== JSON.stringify(TERM_KINDS_334F)) bad.push('① §2a の表の行が 3 種の順でない: ' + kinds.join('・'));
  for (const r of tb.rows) {
    const k = r[0], row = r.join(' | ');
    if (r.length !== TERM_COLS_334F.length || r.some((c) => !c)) { bad.push('① ' + k + ' の行の欄が 5 つでないか空の欄'); continue; }
    for (const w of (TERM_MUST_334F[k] || [])) if (row.indexOf(w) < 0) bad.push('① ' + k + ' の行に「' + w + '」が無い');
    for (const z of row.matchAll(/EQ-\d\d/g)) if (!ids.has(z[0])) bad.push('① ' + k + ' の行が無い項 ' + z[0] + ' を指す');
    const labs = EQ_LABELS_334F.filter((l) => r[4].indexOf(l) >= 0);
    if (!labs.length) bad.push('① ' + k + ' の状態のラベルが 5 種のどれも含まない');
    const rest = EQ_LABELS_334F.reduce((t, l) => t.split(l).join(''), r[4]).replace(/[(（][^)）]*[)）]/g, '').replace(/[・\s]/g, '');
    if (rest) bad.push('① ' + k + ' の状態のラベルに語彙の外の語「' + rest.slice(0, 20) + '」');
  }
  cases.push(`① §2a(§2 の後・§3 の前)の表 ${tb.rows.length} 行(${kinds.join('・')})・5 欄・必須の語 ${Object.values(TERM_MUST_334F).reduce((a, x) => a + x.length, 0)}・項の参照は本書に在る・状態のラベルは 5 種の語彙`);
  // ② 比べる列・自己の並進 = 慣性・第334便で診断中
  for (const w of SEC_MUST_334F) if (sec.indexOf(w) < 0) bad.push('② §2a に「' + w + '」が無い');
  cases.push(`② §2a の地の文の必須の語 ${SEC_MUST_334F.length}(比べる列〔凍結の対照 —— 消さない〕・同じ名で 2 つの型を主にしない・自己の並進 = 慣性〔EQ-12〕・第334便で診断中)`);
  // ③ EQ-29 以降の項
  const nw = items.filter((z) => z.num >= NEW_EQ_FROM_334F);
  const nwIds = nw.map((z) => z.id);
  if (JSON.stringify(nwIds) !== JSON.stringify(NEW_EQ_IDS_334F)) bad.push('③ EQ-29 以降の項の番号: ' + nwIds.join('・') + '(宣言 ' + NEW_EQ_IDS_334F.join('・') + ')');
  let nB = 0, nF = 0, nH = 0;
  const fileCache = new Map(), rd = (f) => { if (!fileCache.has(f)) fileCache.set(f, inp.readText ? inp.readText(f) : null); return fileCache.get(f); };
  for (const it of nw) {
    if (!NEW_LABELS_334F.includes(it.label)) bad.push('③ ' + it.id + ' のラベル「' + it.label + '」が 診断・宣言〔未接続〕でない');
    if (!it.physRefs.length) bad.push('③ ' + it.id + ' に PHYSICS の節の参照が無い');
    if (!it.physRefs.some((r) => r.wave === 333)) bad.push('③ ' + it.id + ' が第333便の節を指さない');
    for (const r of it.physRefs) { nH++; if (ph.indexOf('\n' + r.head) < 0) bad.push('③ ' + it.id + ' の節 ' + r.ref + ' の見出しが PHYSICS に無い'); }
    if (!it.blocks.length) bad.push('③ ' + it.id + ' にプログラム版が無い');
    for (const b of it.blocks) {
      nB++;
      const where = it.id + ' の抜粋 ' + b.k + '(' + b.file + ' · ' + b.name + ')';
      if (!/^tests\/lib-[^/]+\.mjs$/.test(b.file)) { bad.push('③ ' + where + ' が tests の lib でない'); continue; }
      const src = rd(b.file);
      if (!src) { bad.push('③ ' + where + ': ファイルが無い'); continue; }
      const span = defSpan334f(src, b.name);
      if (!span) { bad.push('③ ' + where + ': 名の定義が無い'); continue; }
      const ns = norm(span);
      b.frags.forEach((f, mi) => { nF++; const nf = norm(f); if (!nf || ns.indexOf(nf) < 0) bad.push('③ ' + where + ' の断片 ' + (mi + 1) + ' が定義の範囲に無い: «' + nf.slice(0, 60) + '»'); });
    }
  }
  cases.push(`③ EQ-29 以降の項 ${nw.length}(${nw.map((z) => z.id + ' ' + z.label).join('・')})—— 節の参照 ${nH}(見出しの行・第333便の節を各項 1 つ以上)・抜粋 ${nB}・断片 ${nF}(tests の lib の名指しの定義の範囲に在る)`);
  // ④ 既存の項の用語の注記
  for (const id of NOTE_EQ_334F) {
    const it = items.find((z) => z.id === id), sx = it ? (/\n- \*\*解説\*\*: ([^\n]+)/.exec(it.text) || [])[1] || '' : '';
    if (!(sx.indexOf('原仮定者の整理(2026-11-11)') >= 0 && sx.indexOf('§2a') >= 0)) bad.push('④ ' + id + ' の解説に本便の用語の注記(原仮定者の整理(2026-11-11)・§2a)が無い');
  }
  cases.push('④ ' + NOTE_EQ_334F.join('・') + ' の解説に本便の用語の注記');
  // ⑤ 書かない語
  const targets = [['§2a', sec]].concat(nw.map((z) => [z.id, z.text]));
  for (const [nm, tx] of targets) {
    const s = stripQ(tx).replace(/```[\s\S]*?```/g, ' ');
    for (const w of DECIDE_WORDS_334F) if (s.indexOf(w) >= 0) bad.push('⑤ ' + nm + ' に主の型を決めた語(' + w.length + ' 字)');
    for (const re of NOT_WORDS_334F.concat(NOT_WORDS_331E)) if (re.test(s)) bad.push('⑤ ' + nm + ' に書かない語 ' + re.source);
  }
  cases.push(`⑤ 書かない語(主の型を決めた語 ${DECIDE_WORDS_334F.length}・第334便の禁句 ${NOT_WORDS_334F.length}・第331便e の語)—— §2a と EQ-29 以降の項 ${nw.length}`);
  return { ok: bad.length === 0, bad, cases, items: nw, table: tb };
}

// ── 照合: 現象の状況一覧の更新した行 ──
export function checkPhenoRows334f(inp) {
  const bad = [], cases = [], md = String(inp.md || '');
  const P = parsePhenoDoc331e(md);
  const have = P.rows.filter((r) => PHENO_FIELD_334F in r.fields).map((r) => r.id);
  if (JSON.stringify(have) !== JSON.stringify(PHENO_ROWS_334F)) bad.push('⑥ 欄「' + PHENO_FIELD_334F + '」を持つ行 ' + have.join('・') + ' ≠ 宣言 ' + PHENO_ROWS_334F.join('・'));
  for (const r of P.rows) {
    if (!(PHENO_FIELD_334F in r.fields)) continue;
    const v = String(r.fields[PHENO_FIELD_334F] || '').trim();
    if (!v || v === '—') bad.push('⑥ ' + r.id + ' の「' + PHENO_FIELD_334F + '」が空');
    const iA = r.order.indexOf('第331便の調べ'), iB = r.order.indexOf(PHENO_FIELD_334F), iC = r.order.indexOf('食い違いの理由');
    if (!(iA >= 0 && iA < iB && iB < iC)) bad.push('⑥ ' + r.id + ' の「' + PHENO_FIELD_334F + '」の位置(第331便の調べの後・食い違いの理由の前)');
  }
  const p33 = P.rows.find((r) => r.id === 'P33');
  if (!p33) bad.push('⑥ P33 が無い');
  else if (!(p33.stage === '一部' && p33.mech === '宣言(未接続)' && p33.ledger === '未' && /公転面の揃い/.test(p33.name))) bad.push('⑥ P33 の名・段階・仕組み・帳簿(公転面の揃い・一部・宣言(未接続)・未)');
  if (md.indexOf('**第334便f の更新**') < 0 || md.indexOf('**段階・仕組み・帳簿の語彙と各行の段階は変えていない**') < 0) bad.push('⑥ 冒頭の第334便f の更新の注記');
  const per = PHENO_ROWS_334F.map((id) => id + ' ' + TRANSCRIPTS_334F.filter((t) => t.row === id).length);
  cases.push(`⑥ 欄「${PHENO_FIELD_334F}」の行 ${have.length}(${have.join('・')})・P33(${p33 ? p33.stage + '・' + p33.mech + '・' + p33.ledger : '無い'})・転記 ${TRANSCRIPTS_334F.length} 項(${per.join('・')})`);
  return { ok: bad.length === 0, bad, cases };
}

// ── 変異の自己試験(実物の写しを壊す —— 良い形は通り、壊した形は期待の違反で落ちる)──
// src = { eq, ph, md, readText }
export function selfTest334f(src) {
  const cases = [], bad = [];
  const run = (o) => { const a = checkTerms334f(Object.assign({}, src, o)), b = checkPhenoRows334f(Object.assign({}, src, o)); return { ok: a.ok && b.ok, bad: a.bad.concat(b.bad) }; };
  const g = run({});
  if (!g.ok) bad.push('良い形が落ちた: ' + g.bad.slice(0, 3).join(' / '));
  cases.push('良い形 ' + (g.ok ? '通る' : '落ちる'));
  const eq = String(src.eq || ''), md = String(src.md || '');
  const tb = parseTermTable334f(termSection334f(eq)), rowLine = (k) => eq.split('\n').find((l) => l.startsWith('| ' + k + ' |')) || '';
  const it29 = eqItems334f(eq).find((z) => z.id === 'EQ-29');
  const lab29 = '### EQ-29 ' + (it29 ? it29.title : '') + '\n\n- **ラベル**: 宣言〔未接続〕';
  const sx30 = (() => { const it = eqItems334f(eq).find((z) => z.id === 'EQ-30'); return it ? (/\n(- \*\*解説\*\*: [^\n]+)/.exec(it.text) || [])[1] || '' : ''; })();
  const MUT = [
    ['用語の表の行を 1 つ消す(軸引きずり)', { eq: eq.replace(rowLine('軸引きずり') + '\n', '') }, /^① §2a の表の行が 3 種の順でない/],
    ['用語の表の行の順を入れ替える', { eq: eq.replace(rowLine('並進引きずり') + '\n' + rowLine('軸引きずり'), rowLine('軸引きずり') + '\n' + rowLine('並進引きずり')) }, /^① §2a の表の行が 3 種の順でない/],
    ['回転引きずりの行の「比べる列」を消す', { eq: eq.replace(rowLine('回転引きずり'), rowLine('回転引きずり').split('比べる列').join('対照')) }, /^① 回転引きずり の行に「比べる列」が無い/],
    ['用語の表が無い項を指す', { eq: eq.replace(rowLine('軸引きずり'), rowLine('軸引きずり').replace('(EQ-16 ', '(EQ-96 ')) }, /^① 軸引きずり の行が無い項 EQ-96 を指す/],
    ['状態のラベルに語彙の外の語', { eq: eq.replace(rowLine('並進引きずり'), rowLine('並進引きずり').replace(/\| ([^|]*) \|$/, '| $1・本採用 |')) }, /^① 並進引きずり の状態のラベルに語彙の外の語/],
    ['比べる列の明記を消す', { eq: eq.replace('比べる列(凍結の対照 —— 消さない)', '対照') }, /^② §2a に「比べる列\(凍結の対照 —— 消さない\)」が無い/],
    ['EQ-29 のラベルを実装〔opt-in〕に', { eq: eq.replace(lab29, lab29.replace('宣言〔未接続〕', '実装〔opt-in〕')) }, /^③ EQ-29 のラベル「実装〔opt-in〕」/],
    ['EQ-31 の抜粋の断片の 1 字違い', { eq: eq.replace('```js\n' + 'const w = weightOf(s.m', '```js\n' + 'const w = weightOf(s.M') }, /^③ EQ-31 の抜粋 1\(tests\/lib-w333b-axialfield\.mjs · integratedField\) の断片 1 が定義の範囲に無い/],
    ['EQ-30 の抜粋の名の 1 字違い', { eq: eq.replace('(`tests/lib-w333a-rotdiff.mjs` · `srcMomentRatio`)', '(`tests/lib-w333a-rotdiff.mjs` · `srcMomentRatioX`)') }, /^③ EQ-30 の抜粋 2\(tests\/lib-w333a-rotdiff\.mjs · srcMomentRatioX\): 名の定義が無い/],
    ['EQ-32 の節を無い節へ', { eq: eq.replace('- **PHYSICS の節**: 〔第333便b〕(遠心の要求の表)', '- **PHYSICS の節**: 〔第999便z〕(遠心の要求の表)') }, /^③ EQ-32 /],
    ['EQ-30 の解説に主の型を決めた語', { eq: sx30 ? eq.replace(sx30, sx30 + ' s_d の J 案を' + DECIDE_WORDS_334F[0] + 'した。') : eq + '\n種が無い' }, /^⑤ EQ-30 に主の型を決めた語/],
    ['EQ-30 の解説の「」の中の語(数えない)', { eq: sx30 ? eq.replace(sx30, sx30 + ' 「' + DECIDE_WORDS_334F[1] + '」とは書かない。') : eq }, null],
    ['EQ-16 の用語の注記を消す', { eq: eq.replace('原仮定者の整理(2026-11-11)の用語の軸引きずり(', '用語の軸引きずり(') }, /^④ EQ-16 の解説に本便の用語の注記/],
    ['現象の一覧の P05 の欄「第333便の調べ」を消す', { md: md.replace(/\n- \*\*第333便の調べ\*\*: 枝 c\(R319 —— 原仮定者の回答\(2026-11-10 —— AN600\)\)[^\n]*/, '') }, /^⑥ 欄「第333便の調べ」を持つ行 /],
    ['現象の一覧の P33 の段階を門の内に', { md: md.replace('### P33 太陽系の公転面の揃い(惑星・衛星・環の粒子)\n- **段階**: 一部', '### P33 太陽系の公転面の揃い(惑星・衛星・環の粒子)\n- **段階**: 門の内') }, /^⑥ P33 の名・段階・仕組み・帳簿/],
  ];
  for (const [nm, o, re] of MUT) {
    const r = run(o);
    if (re === null) { if (!r.ok) bad.push('変異「' + nm + '」が落ちた: ' + r.bad[0]); cases.push(nm + ' → ' + (r.ok ? '通る' : '落ちる')); continue; }
    const hit = r.bad.some((b) => re.test(b));
    if (r.ok || !hit) bad.push('変異「' + nm + '」が期待の違反で落ちない: ' + (r.bad[0] || '通った'));
    cases.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
  }
  return { ok: bad.length === 0, cases, bad, n: MUT.length };
}

/** 書かない語・禁句(PHYSICS の本枝の節・AI_SPEC・CHANGELOG の行 —— 第331便e の wordAudit331e に第334便の禁句と主の型を決めた語を足す) */
export function wordAudit334f(name, text, opts = {}) {
  const bad = wordAudit331e(name, text, opts);
  if (!opts.noNot) { const s = stripQ(text); for (const re of NOT_WORDS_334F) if (re.test(s)) bad.push(name + ' に書かない語 ' + re.source); }
  return bad;
}

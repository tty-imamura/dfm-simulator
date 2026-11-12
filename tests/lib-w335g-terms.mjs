// 第335便g(原仮定者の決断(2026-11-12)・原仮定者の補足(2026-11-12)・原仮定者の回答(2026-11-12 —— AN646〜AN666 のうち AN666 = 第334便の式を文書の枝で EQ-34 から)・
//   原仮定者の回答(2026-11-10 —— AN609・AN610)・統括の検証項目 R334):
//   **第334便の診断の式の項(docs/EQUATIONS.md の EQ-34 以降)・用語の表(§2a)の更新・現象の状況一覧の欄「第334便の調べ」の照合の純関数**
//   (QA lint.terms335g・docs.terms335g と、世代の注記つきの lint.terms334f・docs.phenomena331e が読む —— html・エンジン・正本は読まない・状態を持たない・
//   第334便f と第331便e の lib は呼ぶだけ)。
//   照合: (i) EQ-34 以降の項(番号の連番・宣言したラベル・4 つの部分・PHYSICS の第334便の節の見出しの実在・プログラム版の抜粋が tests の lib の名指しの定義の範囲に
//         空白をまとめた形で在る・回答の番号と「主の候補」の語・EQ-40 は文献の物差しの数を書かない・水星の lib の文献の値の宣言〔LIT〕の行を抜粋に載せない)
//         (ii) §2a の表の 3 行の更新の語と表の下の 3 項(ロックした連星・供給・銀河の段階)と「第335便で診断中」の 1 行・項の参照の実在
//         (iii) §3 の一覧・§6 の件数の文・§7 の規則 8・冒頭の 1 行 (iv) 書かない語(主の型を決めた語・第334便と第335便の禁句)
//         (v) 現象の状況一覧の欄「第334便の調べ」(行の集合・位置・段階の不変・冒頭の注記)。変異の自己試験(selfTest335g)は実物の写しを壊して期待の違反で落ちることを見る。
//   **第334便f の照合の世代の写し**(view334fOf335g): lint.terms334f は EQ-29 以降の項を EQ-29〜EQ-33 に固定している(lib-w334f-terms.mjs の本文は変えない)ので、
//   EQ-34 以降の項を除き、§2a の表の EQ-34 以降の参照を外した写しを渡す —— EQ-34 以降と参照の実在は本 lib が持つ。
import { eqItems334f, defSpan334f, termSection334f, parseTermTable334f, DECIDE_WORDS_334F, NOT_WORDS_334F, wordAudit334f } from './lib-w334f-terms.mjs';
import { parsePhenoDoc331e, NOT_WORDS_331E } from './lib-w331e-phenostatus.mjs';

export const TERMS_VERSION_335G = 'w335g-terms-1';
export const NEW_EQ_FROM_335G = 34;
/** 本便で足した項(第334便の診断の式)と宣言のラベル */
export const NEW_EQ_IDS_335G = Object.freeze(['EQ-34', 'EQ-35', 'EQ-36', 'EQ-37', 'EQ-38', 'EQ-39', 'EQ-40', 'EQ-41', 'EQ-42', 'EQ-43']);
export const EQ_LABELS_335G = Object.freeze({ 'EQ-34': '宣言〔未接続〕', 'EQ-35': '診断', 'EQ-36': '宣言〔未接続〕', 'EQ-37': '診断', 'EQ-38': '診断', 'EQ-39': '宣言〔未接続〕',
  'EQ-40': '診断', 'EQ-41': '診断', 'EQ-42': '診断', 'EQ-43': '診断' });
export const EQ_WAVE_335G = 334;
/** 各項の必須の語(回答の番号・主の候補の語・物差しの語) */
export const EQ_MUST_335G = Object.freeze({
  'EQ-34': Object.freeze(['AN646', '主の候補', 's·r̂ = s z/r', '参照の腕', '受け手の中心で速度 0', 'AN650', 'z の偶関数']),
  'EQ-35': Object.freeze(['AN647', '加速度の割合が主', '適用外']),
  'EQ-36': Object.freeze(['AN648', 'AN649', '主の候補', 'R_eq = R_d/(1 − f_flat)^q', 'q = 1/3', 'J 固定']),
  'EQ-37': Object.freeze(['AN651', '観測自転', '開いた系の口', '供給なしの列']),
  'EQ-38': Object.freeze(['AN653', '源ごとに足してから 1 つの口', 'Γ は同定していない']),
  'EQ-39': Object.freeze(['AN654', 'v を分けた形が主', 'U_i = v_i + d_i', 'W₀ = 0', 'AN650', '慣性の起源の主張ではない']),
  'EQ-40': Object.freeze(['AN655', 'AN659', '比べる尺度(参考の比)', '交点の非対称の一次は 0']),
  'EQ-41': Object.freeze(['恒等的に 0', '冥王星–カロン', '条件付きの恒等式']),
  'EQ-42': Object.freeze(['AN660', 'AN662', 'AN663', 'max(0.01 |ρ|, 1e-4)', '2π |n| ε η √(1 − 4η) e/(1 − e²)^{3/2}']),
  'EQ-43': Object.freeze(['b = (max − min)/|mean|', '幅 9 ≤ 1%', 'まず楕円銀河', '腕が形成される力学ではない']),
});
/** EQ-40 に書かない文献の物差しの数(第334便c の比と上限 —— 枝 c が訂正する)・載せない lib の宣言 */
export const LIT_NUMS_335G = Object.freeze(['6.3e3', '1.6e-4', '5.7e-13', '1.2e-5', '1.2e-6', '2.3e5', '3.8e6']);
export const LIT_GUARD_335G = Object.freeze({ file: 'tests/lib-w334c-mercurynode.mjs', name: 'LIT' });
/** §2a の表の 3 行に足した語(原仮定者の決断と補足(2026-11-12))と項の参照 */
export const TERM_ADD_335G = Object.freeze({
  並進引きずり: Object.freeze(['自己を運ぶ式(v を分けた形)', '自分自身は分母に入る', '距離の変化による並進引きずり', '動径の成分', '今の K1 の並進の分に含まれる', '原仮定者の決断(2026-11-12)', '原仮定者の補足(2026-11-12)', 'EQ-39', 'EQ-41', 'EQ-43']),
  軸引きずり: Object.freeze(['熱の口は物理の源ごと', 'トルクは向き付きで足す', '足してから 1 つの口', 'AN653', 'EQ-38']),
  回転引きずり: Object.freeze(['T1 = 線のまわりの捩れの率が主の候補', '参照の腕を置いた速さの指標', '扁平の則は軸比', 'R_eq = R_d/(1 − f_flat)^{1/3}', 'AN646', 'EQ-34', 'EQ-35', 'EQ-36', 'EQ-37']),
});
/** §2a の表の下の必須の語 */
export const SEC_ADD_335G = Object.freeze(['原仮定者の決断と補足(2026-11-12)', 'R334', '**ロックした連星**', '**瞬間の角速度への同期**', '**平均の角速度への同期**', 'C_{j→i} − v_i = −ṙ r̂ + r(Ω − ḟ) φ̂',
  '遠方の宇宙に対する慣性の移動は消えない', '**供給**', '**開いた系の口**', '供給なしの列を対照に残す', '**銀河の段階**', '**まず楕円銀河**', '未解決のまま', '**第335便で診断中**', 'EQ-34〜EQ-43',
  '今のエンジンの口との対応と状態のラベルは変えていない']);
/** 現象の状況一覧で欄「第334便の調べ」を持つ行と、その行の段階(変えていない —— 第334便f の時点の段階) */
export const PHENO_ROWS_335G = Object.freeze(['P01', 'P05', 'P08', 'P10', 'P12', 'P18', 'P19', 'P23', 'P24', 'P33']);
export const PHENO_FIELD_335G = '第334便の調べ';
export const PHENO_STAGES_335G = Object.freeze({ P01: '門の内', P05: '残差', P08: '門の内', P10: '残差', P12: '一部', P18: '一部', P19: '残差', P23: '一部', P24: '一部', P33: '一部' });
/** 第334便の節を挙げない行(調べは第335便に入る —— 「第335便で診断中」を持つ) */
export const PHENO_NOSEC_335G = Object.freeze(['P08']);
/** 書かない語(「」の中の引用は除く): 第335便の禁句(共通の守ること —— 宣言した型の表・条件付きの恒等式・残差・候補で書く) */
export const NOT_WORDS_335G = Object.freeze([/既に出ている/, /楕円銀河が出来た/, /引きずりが合った/, /残差が消えた/, /供給で熱が合/, /観測に合った/]);

// ── 主な数の転記の表(第335便g —— 第331便e の TRANSCRIPTS_331E と同じ型。docs.phenomena331e が第331便e と第334便f の項に足して照合する)──
export const TRANSCRIPTS_335G = Object.freeze([
  { row: 'P01', text: '全周の dL̂/dt の大きさは 14.33″/世紀', src: 'phys', ref: '〔第334便c — ' },
  { row: 'P01', text: '面内の回転 ω_W は 6.3e-5″/世紀', src: 'phys', ref: '〔第334便c — ' },
  { row: 'P05', text: '法則と呼べた 6 型はどれも F1', src: 'phys', ref: '〔第334便d — ' },
  { row: 'P05', text: '公転面を q_1PN の 1.65 倍の率で回す', src: 'phys', ref: '〔第334便d — ' },
  { row: 'P05', text: '格子の内で ρ が 0 を横切る傾きは無い', src: 'phys', ref: '〔第334便d — ' },
  { row: 'P10', text: '冥王星–カロンでは並進引きずり(K1 の並進 + 回転の分)が恒等的に 0 になり、G_loc の型の残差だけが残る配置', src: 'phys', ref: '〔第334便d — ' },
  { row: 'P12', text: 'T1 = T2① = T3 ≈ s_d z', src: 'phys', ref: '〔第334便a — ' },
  { row: 'P12', text: '速度の比例則だけでは平衡の厚みは決まらない', src: 'phys', ref: '〔第334便a — ' },
  { row: 'P12', text: '軸比 q = 1 で ≈ 11.1 m(1.11 倍)', src: 'phys', ref: '〔第334便a — ' },
  { row: 'P18', text: 'ω_field·ŝ/s は −36(月)〜+71(海王星)', src: 'phys', ref: '〔第334便b — ' },
  { row: 'P19', text: 'J/|N_orb| は 6.1e8 年', src: 'phys', ref: '〔第334便b — ' },
  { row: 'P19', text: '同期の半径の内側', src: 'phys', ref: '〔第334便b — ' },
  { row: 'P23', text: '幅 9 の最大 16.77%', src: 'phys', ref: '〔第334便e — ' },
  { row: 'P23', text: '0/504', src: 'phys', ref: '〔第334便e — ' },
  { row: 'P24', text: '0.01〜0.15', src: 'phys', ref: '〔第334便e — ' },
].map((o) => Object.freeze(o)));

const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const stripQ = (t) => String(t || '').replace(/「[^」]*」/g, '');
const stripCode = (t) => String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');
const isNew = (id) => /^EQ-\d\d$/.test(id) && Number(id.slice(3)) >= NEW_EQ_FROM_335G;

// ── 第334便f の照合の世代の写し ──
/** EQ-34 以降の項の節を除き、§2a の最初の表の行から EQ-34 以降の参照の字を外した写し(lint.terms334f と selfTest334f に渡す) */
export function view334fOf335g(eq) {
  let s = String(eq || '');
  s = s.replace(/\n### EQ-(\d\d) [^\n]*[\s\S]*?(?=\n### |\n## )/g, (m, n) => (Number(n) >= NEW_EQ_FROM_335G ? '' : m));
  const i = s.indexOf('\n## 2a. '), j = i >= 0 ? s.indexOf('\n## ', i + 1) : -1;
  if (i < 0 || j < 0) return s;
  const sec = s.slice(i, j).split('\n');
  let inT = false, seen = false;
  for (let k = 0; k < sec.length; k++) {
    const l = sec[k];
    if (/^\|/.test(l)) { if (seen && !inT) break; inT = true; seen = true; sec[k] = l.replace(/EQ-(\d\d)/g, (m, n) => (Number(n) >= NEW_EQ_FROM_335G ? '' : m)); }
    else if (inT) break;
  }
  return s.slice(0, i) + sec.join('\n') + s.slice(j);
}

// ── 照合: 式の一覧(EQ-34 以降・§2a の更新・§3/§6/§7)──
// inp = { eq, ph, readText(rel) → string|null }
export function checkTerms335g(inp) {
  const bad = [], cases = [], eq = String(inp.eq || ''), ph = String(inp.ph || '');
  const all = eqItems334f(eq), ids = new Set(all.map((z) => z.id));
  // ① EQ-34 以降の項
  const nw = all.filter((z) => z.num >= NEW_EQ_FROM_335G), nwIds = nw.map((z) => z.id);
  if (JSON.stringify(nwIds) !== JSON.stringify(NEW_EQ_IDS_335G)) bad.push('① EQ-34 以降の項の番号: ' + nwIds.join('・') + '(宣言 ' + NEW_EQ_IDS_335G.join('・') + ')');
  const fileCache = new Map(), rd = (f) => { if (!fileCache.has(f)) fileCache.set(f, inp.readText ? inp.readText(f) : null); return fileCache.get(f); };
  const litSrc = rd(LIT_GUARD_335G.file), litSpan = litSrc ? norm(defSpan334f(litSrc, LIT_GUARD_335G.name) || '') : '';
  if (!litSpan) bad.push('① 文献の値の宣言(' + LIT_GUARD_335G.file + ' · ' + LIT_GUARD_335G.name + ')が読めない');
  let nB = 0, nF = 0, nH = 0, nM = 0, nLitF = 0;
  for (const it of nw) {
    const want = EQ_LABELS_335G[it.id];
    if (it.label !== want) bad.push('① ' + it.id + ' のラベル「' + it.label + '」が宣言「' + (want || '—') + '」でない');
    for (const part of ['\n- **数式版**: ', '\n- **解説**: ', '\n- **プログラム版 1**', '\n- **PHYSICS の節**: ']) if (it.text.indexOf(part) < 0) bad.push('① ' + it.id + ' に「' + part.replace(/[\n*:-]/g, '').trim() + '」が無い');
    if (!it.physRefs.some((r) => r.wave === EQ_WAVE_335G)) bad.push('① ' + it.id + ' が第334便の節を指さない');
    for (const r of it.physRefs) { nH++; if (ph.indexOf('\n' + r.head) < 0) bad.push('① ' + it.id + ' の節 ' + r.ref + ' の見出しが PHYSICS に無い'); }
    for (const w of (EQ_MUST_335G[it.id] || [])) { nM++; if (it.text.indexOf(w) < 0) bad.push('① ' + it.id + ' に「' + w + '」が無い'); }
    if (!it.blocks.length) bad.push('① ' + it.id + ' にプログラム版が無い');
    for (const b of it.blocks) {
      nB++;
      const where = it.id + ' の抜粋 ' + b.k + '(' + b.file + ' · ' + b.name + ')';
      if (!/^tests\/lib-[^/]+\.mjs$/.test(b.file)) { bad.push('① ' + where + ' が tests の lib でない'); continue; }
      const src = rd(b.file);
      if (!src) { bad.push('① ' + where + ': ファイルが無い'); continue; }
      const span = defSpan334f(src, b.name);
      if (!span) { bad.push('① ' + where + ': 名の定義が無い'); continue; }
      const ns = norm(span);
      b.frags.forEach((f, mi) => {
        nF++; const nf = norm(f);
        if (!nf || ns.indexOf(nf) < 0) bad.push('① ' + where + ' の断片 ' + (mi + 1) + ' が定義の範囲に無い: «' + nf.slice(0, 60) + '»');
        if (b.file === LIT_GUARD_335G.file) { nLitF++; if (litSpan && nf && litSpan.indexOf(nf) >= 0) bad.push('① ' + where + ' の断片 ' + (mi + 1) + ' が文献の値の宣言(LIT)の行'); }
      });
    }
  }
  const e40 = nw.find((z) => z.id === 'EQ-40');
  const litHit = e40 ? LIT_NUMS_335G.filter((x) => stripCode(e40.text).indexOf(x) >= 0) : [];
  if (litHit.length) bad.push('① EQ-40 に文献の物差しの数 ' + litHit.join('・') + '(比べる尺度〔参考の比〕と書いて PHYSICS の節を指す)');
  cases.push(`① EQ-34 以降の項 ${nw.length}(${nw.map((z) => z.id + ' ' + z.label).join('・')})—— 4 つの部分・節の参照 ${nH}(第334便の節を各項 1 つ以上・見出しの行)・必須の語 ${nM}・抜粋 ${nB}・断片 ${nF}(tests の lib の名指しの定義の範囲)・水星の lib の断片 ${nLitF} は文献の値の宣言の外・EQ-40 に文献の物差しの数 0`);
  // ② §2a の更新
  const sec = termSection334f(eq), tb = parseTermTable334f(sec);
  let nT = 0;
  for (const [k, ws] of Object.entries(TERM_ADD_335G)) {
    const r = tb.rows.find((x) => x[0] === k);
    if (!r) { bad.push('② §2a の表に ' + k + ' の行が無い'); continue; }
    const row = r.join(' | ');
    for (const w of ws) { nT++; if (row.indexOf(w) < 0) bad.push('② ' + k + ' の行に「' + w + '」が無い'); }
  }
  const below = (() => { const L = sec.split('\n'); let i = L.findIndex((l) => /^\|/.test(l)); while (i >= 0 && i < L.length && /^\|/.test(L[i])) i++; return i >= 0 ? L.slice(i).join('\n') : ''; })();
  for (const w of SEC_ADD_335G) if (below.indexOf(w) < 0) bad.push('② §2a の表の下に「' + w + '」が無い');
  const refs = [...new Set([...sec.matchAll(/EQ-\d\d/g)].map((m) => m[0]))];
  for (const id of refs) if (!ids.has(id)) bad.push('② §2a が無い項 ' + id + ' を指す');
  const refNew = refs.filter(isNew);
  for (const id of NEW_EQ_IDS_335G) if (refNew.indexOf(id) < 0) bad.push('② §2a が ' + id + ' を指さない');
  cases.push(`② §2a: 表の 3 行の更新の語 ${nT}・表の下の必須の語 ${SEC_ADD_335G.length}(ロックした連星〔瞬間の同期・平均の同期〕・供給〔開いた系の口〕・銀河の段階〔まず楕円銀河〕・第335便で診断中)・項の参照 ${refs.length}(本書に在る・EQ-34〜EQ-43 を全部指す)`);
  // ③ §3・§6・§7・冒頭
  const s3i = eq.indexOf('\n## 3. '), s3 = s3i >= 0 ? eq.slice(s3i, eq.indexOf('\n## ', s3i + 1)) : '';
  for (const id of NEW_EQ_IDS_335G) if (!s3.split('\n').some((l) => l.startsWith('| ' + id + ' |') && l.trim().endsWith('| ' + EQ_LABELS_335G[id] + ' |'))) bad.push('③ §3 の一覧に ' + id + '(' + EQ_LABELS_335G[id] + ')の行が無い');
  const s6i = eq.indexOf('\n## 6. '), s6 = s6i >= 0 ? eq.slice(s6i, eq.indexOf('\n## ', s6i + 1)) : '';
  const nAll = all.length;
  if (s6.indexOf('EQ-34〜EQ-43 が拾う(第335便g —— 項は ' + nAll + ')') < 0) bad.push('③ §6 の件数の文(EQ-34〜EQ-43・項は ' + nAll + ')');
  const s7i = eq.indexOf('\n## 7. '), s7 = s7i >= 0 ? eq.slice(s7i) : '';
  if (!/\n8\. \*\*用語の更新と第334便の式\*\*\(第335便g —— `lint\.terms335g`・`docs\.terms335g`\)/.test(s7) || s7.indexOf('view334fOf335g') < 0) bad.push('③ §7 の規則 8(用語の更新と第334便の式・世代の写し)');
  if (eq.indexOf('- **第334便の診断の式と用語の更新(第335便g)**: ') < 0) bad.push('③ 冒頭の第335便g の 1 行');
  cases.push(`③ §3 の一覧に ${NEW_EQ_IDS_335G.length} 行(宣言のラベル)・§6 の件数の文(項 ${nAll})・§7 の規則 8・冒頭の 1 行`);
  // ④ 書かない語
  const targets = [['§2a', sec]].concat(nw.map((z) => [z.id, z.text]));
  for (const [nm, tx] of targets) {
    const s = stripCode(stripQ(tx));
    for (const w of DECIDE_WORDS_334F) if (s.indexOf(w) >= 0) bad.push('④ ' + nm + ' に主の型を決めた語(' + w.length + ' 字)');
    for (const re of NOT_WORDS_335G.concat(NOT_WORDS_334F, NOT_WORDS_331E)) if (re.test(s)) bad.push('④ ' + nm + ' に書かない語 ' + re.source);
  }
  cases.push(`④ 書かない語(主の型を決めた語 ${DECIDE_WORDS_334F.length}・第335便の禁句 ${NOT_WORDS_335G.length}・第334便の禁句・第331便e の語)—— §2a と EQ-34 以降の項 ${nw.length}`);
  return { ok: bad.length === 0, bad, cases, items: nw };
}

// ── 照合: 現象の状況一覧の欄「第334便の調べ」──
export function checkPhenoRows335g(inp) {
  const bad = [], cases = [], md = String(inp.md || '');
  const P = parsePhenoDoc331e(md);
  const have = P.rows.filter((r) => PHENO_FIELD_335G in r.fields).map((r) => r.id);
  if (JSON.stringify(have) !== JSON.stringify(PHENO_ROWS_335G)) bad.push('⑤ 欄「' + PHENO_FIELD_335G + '」を持つ行 ' + have.join('・') + ' ≠ 宣言 ' + PHENO_ROWS_335G.join('・'));
  for (const r of P.rows) {
    if (!(PHENO_FIELD_335G in r.fields)) continue;
    const v = String(r.fields[PHENO_FIELD_335G] || '').trim();
    if (!v || v === '—') bad.push('⑤ ' + r.id + ' の「' + PHENO_FIELD_335G + '」が空');
    const iPrev = Math.max(r.order.indexOf('第331便の調べ'), r.order.indexOf('第333便の調べ')), iB = r.order.indexOf(PHENO_FIELD_335G), iC = r.order.indexOf('食い違いの理由');
    if (!(r.order.indexOf('第331便の調べ') >= 0 && iPrev < iB && iB < iC)) bad.push('⑤ ' + r.id + ' の「' + PHENO_FIELD_335G + '」の位置(第331便・第333便の調べの後・食い違いの理由の前)');
    const want = PHENO_STAGES_335G[r.id];
    if (want && r.stage !== want) bad.push('⑤ ' + r.id + ' の段階「' + r.stage + '」が第334便f の時点の「' + want + '」と違う(段階は変えない)');
    if (PHENO_NOSEC_335G.includes(r.id)) { if (v.indexOf('第335便で診断中') < 0) bad.push('⑤ ' + r.id + ' に「第335便で診断中」が無い'); }
    else if (!/〔第334便[a-e]〕/.test(v)) bad.push('⑤ ' + r.id + ' の「' + PHENO_FIELD_335G + '」が第334便の節を挙げない');
    const s = stripCode(stripQ(v));
    for (const w of DECIDE_WORDS_334F) if (s.indexOf(w) >= 0) bad.push('⑤ ' + r.id + ' に主の型を決めた語(' + w.length + ' 字)');
    for (const re of NOT_WORDS_335G) if (re.test(s)) bad.push('⑤ ' + r.id + ' に書かない語 ' + re.source);
  }
  if (md.indexOf('**第335便g の更新**') < 0 || md.indexOf('欄「第334便の調べ」**(第335便g') < 0) bad.push('⑤ 冒頭の第335便g の更新の注記と照合の規則の 1 項');
  const per = PHENO_ROWS_335G.map((id) => id + ' ' + TRANSCRIPTS_335G.filter((t) => t.row === id).length);
  cases.push(`⑤ 欄「${PHENO_FIELD_335G}」の行 ${have.length}(${have.join('・')})・段階は不変(${PHENO_ROWS_335G.map((id) => id + ' ' + PHENO_STAGES_335G[id]).join('・')})・転記 ${TRANSCRIPTS_335G.length} 項(${per.join('・')})`);
  return { ok: bad.length === 0, bad, cases };
}

// ── 変異の自己試験(実物の写しを壊す —— 良い形は通り、壊した形は期待の違反で落ちる)──
// src = { eq, ph, md, readText }
export function selfTest335g(src) {
  const cases = [], bad = [];
  const run = (o) => { const s = Object.assign({}, src, o), a = checkTerms335g(s), b = checkPhenoRows335g(s); return { ok: a.ok && b.ok, bad: a.bad.concat(b.bad) }; };
  const g = run({});
  if (!g.ok) bad.push('良い形が落ちた: ' + g.bad.slice(0, 3).join(' / '));
  cases.push('良い形 ' + (g.ok ? '通る' : '落ちる'));
  const eq = String(src.eq || ''), md = String(src.md || '');
  const rowLine = (k) => eq.split('\n').find((l) => l.startsWith('| ' + k + ' |')) || '';
  const it = (id) => eqItems334f(eq).find((z) => z.id === id) || { title: '', text: '' };
  const lab = (id) => '### ' + id + ' ' + it(id).title + '\n\n- **ラベル**: ' + EQ_LABELS_335G[id];
  const sx = (id) => (/\n(- \*\*解説\*\*: [^\n]+)/.exec(it(id).text) || [])[1] || '';
  const p08 = (/\n- \*\*第334便の調べ\*\*: 第334便の枝には本行の量の調べは無い[^\n]*/.exec(md) || [''])[0];
  const litLine = (() => { const s = src.readText ? src.readText(LIT_GUARD_335G.file) : null, sp = s ? defSpan334f(s, LIT_GUARD_335G.name) : null; const l = sp ? sp.split('\n').map((x) => x.trim()).find((x, k) => k > 0 && x.length > 20) : null; return l ? l.slice(0, 40) : 'LIT の行が無い'; })();
  const MUT = [
    ['EQ-36 のラベルを診断に', { eq: eq.replace(lab('EQ-36'), lab('EQ-36').replace('宣言〔未接続〕', '診断')) }, /^① EQ-36 のラベル「診断」/],
    ['EQ-34 の項を消す', { eq: eq.replace(/\n### EQ-34 [\s\S]*?(?=\n### EQ-35 )/, '') }, /^① EQ-34 以降の項の番号/],
    ['EQ-37 の節を第333便へ', { eq: eq.replace('- **PHYSICS の節**: 〔第334便b〕(押しと滑りの', '- **PHYSICS の節**: 〔第333便b〕(押しと滑りの') }, /^① EQ-37 が第334便の節を指さない/],
    ['EQ-38 の抜粋の断片の 1 字違い', { eq: eq.replace('excessFormula = Gamma * (P.sumAbs', 'excessFormula = Gamma * (P.sumAbz') }, /^① EQ-38 の抜粋 2\(tests\/lib-w334b-ledger\.mjs · axialLedger\) の断片 1 が定義の範囲に無い/],
    ['EQ-42 の抜粋の名の 1 字違い', { eq: eq.replace('(`tests/lib-w334d-binarylaw.mjs` · `cmKickPerOrbit`)', '(`tests/lib-w334d-binarylaw.mjs` · `cmKickPerOrbitX`)') }, /^① EQ-42 の抜粋 3\(tests\/lib-w334d-binarylaw\.mjs · cmKickPerOrbitX\): 名の定義が無い/],
    ['EQ-40 に文献の物差しの数', { eq: sx('EQ-40') ? eq.replace(sx('EQ-40'), sx('EQ-40') + ' 上限 1.6e-4。') : eq + '\n種が無い' }, /^① EQ-40 に文献の物差しの数 1\.6e-4/],
    ['EQ-40 の抜粋を文献の値の宣言の行に', { eq: eq.replace('- **プログラム版 3**(`tests/lib-w334c-mercurynode.mjs` · `nodeWindows`)\n\n```js\n', '- **プログラム版 4**(`tests/lib-w334c-mercurynode.mjs` · `LIT`)\n\n```js\n' + litLine + '\n```\n\n- **プログラム版 3**(`tests/lib-w334c-mercurynode.mjs` · `nodeWindows`)\n\n```js\n') }, /^① EQ-40 の抜粋 4\(tests\/lib-w334c-mercurynode\.mjs · LIT\) の断片 1 が文献の値の宣言\(LIT\)の行/],
    ['EQ-34 の「主の候補」を消す', { eq: sx('EQ-34') ? eq.replace(sx('EQ-34'), sx('EQ-34').split('主の候補').join('候補')) : eq + '\n種が無い' }, /^① EQ-34 に「主の候補」が無い/],
    ['並進引きずりの行の自己を運ぶ式を消す', { eq: eq.replace(rowLine('並進引きずり'), rowLine('並進引きずり').split('自己を運ぶ式(v を分けた形)').join('自己の式')) }, /^② 並進引きずり の行に「自己を運ぶ式\(v を分けた形\)」が無い/],
    ['§2a のロックした連星の平均の同期を消す', { eq: eq.replace('**平均の角速度への同期**', '平均の同期') }, /^② §2a の表の下に「\*\*平均の角速度への同期\*\*」が無い/],
    ['§2a が無い項を指す', { eq: eq.replace('格子の受け手 EQ-43 ——', '格子の受け手 EQ-93 ——') }, /^② §2a が無い項 EQ-93 を指す/],
    ['§3 の一覧の EQ-39 の行を消す', { eq: eq.replace(/\n\| EQ-39 \|[^\n]*/, '') }, /^③ §3 の一覧に EQ-39/],
    ['EQ-39 の解説に主の型を決めた語', { eq: sx('EQ-39') ? eq.replace(sx('EQ-39'), sx('EQ-39') + ' v を分けた形を' + DECIDE_WORDS_334F[1] + 'した。') : eq + '\n種が無い' }, /^④ EQ-39 に主の型を決めた語/],
    ['EQ-41 の解説に第335便の禁句', { eq: sx('EQ-41') ? eq.replace(sx('EQ-41'), sx('EQ-41') + ' ロックした連星で引きずりが合った。') : eq + '\n種が無い' }, /^④ EQ-41 に書かない語 引きずりが合った/],
    ['EQ-39 の解説の「」の中の語(数えない)', { eq: sx('EQ-39') ? eq.replace(sx('EQ-39'), sx('EQ-39') + ' 「' + DECIDE_WORDS_334F[0] + '」とは書かない。') : eq }, null],
    ['現象の一覧の P08 の欄「第334便の調べ」を消す', { md: p08 ? md.replace(p08, '') : md + '\n種が無い' }, /^⑤ 欄「第334便の調べ」を持つ行 /],
    ['現象の一覧の P12 の段階を門の内に', { md: md.replace('### P12 土星の環(周期・面・厚み)\n- **段階**: 一部', '### P12 土星の環(周期・面・厚み)\n- **段階**: 門の内') }, /^⑤ P12 の段階「門の内」/],
    ['現象の一覧の P23 の欄を食い違いの理由の後へ', { md: md.replace(/(\n- \*\*第334便の調べ\*\*: 枝 e\(R326 —— 原仮定者の回答\(2026-11-11 —— AN638\)\)[^\n]*)(\n- \*\*食い違いの理由\*\*: [^\n]*)/, '$2$1') }, /^⑤ P23 の「第334便の調べ」の位置/],
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

/** 書かない語・禁句(PHYSICS の本枝の節・AI_SPEC・CHANGELOG の行 —— 第334便f の wordAudit334f に第335便の禁句を足す) */
export function wordAudit335g(name, text, opts = {}) {
  const bad = wordAudit334f(name, text, opts);
  if (!opts.noNot) { const s = stripQ(text); for (const re of NOT_WORDS_335G) if (re.test(s)) bad.push(name + ' に書かない語 ' + re.source); }
  return bad;
}

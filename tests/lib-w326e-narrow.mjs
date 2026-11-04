// 第326便e(統括の検証項目 R294 —— 第325便a の決断事項候補 D2「1 本の物理の宣言の変更で presets:'all' の領域の段が 40 段以上走る」): **全部の本を領域に持つ段を
//   本ごとの部分で絞る探索**(影 —— 印字だけ・段の判定〔regen/reuse〕は変えない・器と REGEN_SCOPE の宣言は変えない)。
//
// ■ 何をするか
//   (1) 名簿(narrowRoster): 領域の宣言が presets:"all" の現行の段(tests/data-w312c-scopeall.json —— 器と lib の allPresets()/BUILTIN_PRESETS の使い方の一覧)ごとに、
//       器が全部の本を読むか、**宣言の条件で選んだ本だけ**を読むかを器のコードから読む:
//         named   … 宣言だけが all(器と lib の下限は名指しの本 —— 第312便c の narrow-now)→ 読む本 = 名指しの本
//         filter  … 使い方が「条件で全本から選ぶ(.filter)」と名指し(.find)だけで、条件の式が本の宣言だけを読む(headless で全本に当てて評価できる)→ 読む本 = 条件に合う本 ∪ 名指しの本
//         enumerates … 全本を回る・写す・数える・変数に受けて他へ渡す(本ごとの部分では絞れない —— 1 本の変更でも段の出力が動く)・条件の式が評価できない
//   (2) 影(narrowShadow): 刻印の html と今の html の**本ごとの変化**(版 7 の説明の欄を外した生の定義と受理後の定義)を引き、計画で「領域だけ」の理由(causeKinds = scope)で
//       regen の presets:"all" の段のうち、named・filter の段で**変わった本が読む本(刻印の html と今の html の両方の条件で選んだ本 ∪ 名指し)に入らない**段を「絞れば reuse」と数える。
//       閉包の関数・HP・S._core・定数の差がある段(核)は絞れない(計画の理由の文 —— 刻印時の html が --base のときの内訳 —— か、本の変化だけの写しであること)。
//
// ■ しないこと
//   ・計画の status・鎖・REGEN_SCOPE を変えない(採るなら器の宣言を名指しの本へ絞る —— 次の便の統括の判断)。
//   ・「条件で選ぶ器の出力は選ばれない本に依存しない」を証明しない(器の条件の式の外で全本を読む口が無いことは名簿の使い方の種類で見るだけ)。
import fs from 'node:fs';
import path from 'node:path';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { stripPresetProse, canonJson, scanJs } from './lib-w281a-scope.mjs';

export const NARROW_VERSION = 'w326e-narrow-1';
export const SCOPEALL_FILE_326E = 'tests/data-w312c-scopeall.json';
/** 絞れる使い方の種類(これ以外が 1 つでもあれば enumerates)。 */
export const NARROW_KINDS_326E = Object.freeze(['filter', 'find-via-var']);

/** 文字列 s の i 文字目の '(' に対応する ')' の位置(文字列・注釈を潰した写しで数える)。無ければ -1。 */
function matchParen(code, i) {
  let d = 0;
  for (let k = i; k < code.length; k++) { const c = code[k]; if (c === '(') d++; else if (c === ')') { d--; if (d === 0) return k; } }
  return -1;
}
/**
 * 器の本文の line 行目から始まる文の中の、allPresets() / BUILTIN_PRESETS の直後の .filter(<式>) の式を取り出す(無ければ null)。
 * @returns {string|null}
 */
export function filterPredicateAt(text, line) {
  const lines = String(text).split('\n');
  if (!(line >= 1 && line <= lines.length)) return null;
  const off = lines.slice(0, line - 1).reduce((a, l) => a + l.length + 1, 0);
  const sc = scanJs(text);   // code = 文字列と注釈を潰した写し(同じ長さ)
  const code = sc.code, raw = text;
  const end = Math.min(code.length, off + 4000);
  const re = /(?:allPresets\(\)|BUILTIN_PRESETS)\s*\.\s*filter\s*\(/g;
  re.lastIndex = off;
  const m = re.exec(code);
  if (!m || m.index > end) return null;
  const open = m.index + m[0].length - 1, close = matchParen(code, open);
  if (close < 0) return null;
  return raw.slice(open + 1, close).trim();
}
/** 条件の式を本の写し 1 つに当てる関数にする(式が本の外の名を読めば評価で投げる —— 呼ぶ側が unknown にする)。 */
export function predicateFn(src) {
  // eslint-disable-next-line no-new-func
  return new Function('p', '"use strict"; return (' + src + ')(p);');
}

/** html の内蔵の本(生の定義と受理後の定義 —— 版 7 の説明の欄を外した写しの正準 JSON)。 */
export function bookParts(htmlPath) {
  const L = loadHtmlHeadless(htmlPath);
  const B = L.evalExpr('BUILTIN_PRESETS');
  const out = new Map();
  for (const p of B) {
    let acc = null;
    try { const v = L.HP.validatePreset(JSON.parse(JSON.stringify(p))); acc = { ok: !!v.ok, preset: v.preset ? stripPresetProse(v.preset) : null, warnings: (v.warnings || []).map(String) }; }
    catch (e) { acc = { threw: String(e && e.message || e).slice(0, 80) }; }
    out.set(String(p.id), { raw: canonJson(stripPresetProse(p)), acc: canonJson(acc), obj: JSON.parse(JSON.stringify(p)) });
  }
  return out;
}
/** 2 つの html の本ごとの変化(足した・外した本を含む)。 */
export function changedBooks(a, b) {
  const ids = new Set([...a.keys(), ...b.keys()]);
  return [...ids].filter((id) => { const x = a.get(id), y = b.get(id); return !x || !y || x.raw !== y.raw || x.acc !== y.acc; }).sort();
}

/**
 * 名簿(presets:"all" の現行の段 —— 器のコードから読む)。
 * @param {{root:string, rows?:Array, books?:Map}} o rows = data-w312c-scopeall.json の steps(無ければファイルから)・books = bookParts(今の html)
 */
export function narrowRoster(o) {
  const root = String(o.root).replace(/\/$/, '');
  let rows = o.rows;
  if (!rows) { try { rows = JSON.parse(fs.readFileSync(path.join(root, SCOPEALL_FILE_326E), 'utf8')).steps; } catch { rows = []; } }
  const books = o.books || null;
  const out = [];
  for (const r of rows) {
    const kinds = (r.kinds || []).slice();
    const named = (r.namedIds || []).slice();
    let cls = 'enumerates', why = '', preds = [];
    if (r.prospect === 'narrow-now' || (kinds.length === 1 && kinds[0] === 'declared-wide')) { cls = 'named'; why = '宣言だけが all —— 器と lib の下限は名指しの本 ' + named.length + ' 本'; }
    else if (kinds.length && kinds.every((k) => NARROW_KINDS_326E.includes(k))) {
      const fr = (r.reasons || []).filter((q) => q.kind === 'filter');
      preds = fr.map((q) => { let t = null; try { t = fs.readFileSync(path.join(root, q.file), 'utf8'); } catch { t = null; } const src = t ? filterPredicateAt(t, q.line) : null; return { file: q.file, line: q.line, src }; });
      const bad = preds.filter((z) => !z.src);
      if (bad.length) { cls = 'enumerates'; why = '条件の式が取り出せない: ' + bad.map((z) => z.file.replace('tests/', '') + ':' + z.line).join(','); }
      else if (books) {
        const ev = preds.map((z) => { try { const f = predicateFn(z.src); const hit = []; for (const [id, b] of books) if (f(JSON.parse(JSON.stringify(b.obj)))) hit.push(id); return { ok: true, hit }; } catch (e) { return { ok: false, why: String(e && e.message || e).slice(0, 60) }; } });
        const ng = ev.map((z, i) => z.ok ? null : preds[i].file.replace('tests/', '') + ':' + preds[i].line + '(' + z.why + ')').filter(Boolean);
        if (ng.length) { cls = 'enumerates'; why = '条件の式が本の外の名を読む(評価できない): ' + ng.join(' / '); }
        else { cls = 'filter'; preds.forEach((z, i) => { z.hit = ev[i].hit.length; }); why = '条件で選ぶ ' + preds.length + ' 式(今の html で ' + [...new Set(ev.flatMap((z) => z.hit))].length + ' 本)∪ 名指し ' + named.length + ' 本'; }
      } else { cls = 'filter'; why = '条件で選ぶ(本の写しが無いので数は出さない)'; }
    } else why = '使い方 ' + kinds.join('・') + '(全本を回る・写す・数える・渡す —— 本ごとの部分では絞れない)';
    out.push({ key: r.key, harness: r.harness, cls, kinds, named, preds: preds.map((z) => ({ file: z.file, line: z.line, src: z.src, hit: z.hit })), why });
  }
  const count = {}; for (const z of out) count[z.cls] = (count[z.cls] || 0) + 1;
  return { version: NARROW_VERSION, count, rows: out };
}

/** 段が読む本(条件の式を刻印の html と今の html の本に当てた和 ∪ 名指し)。enumerates は null(全部)。 */
export function readsBooks(row, booksList) {
  if (row.cls === 'enumerates') return null;
  const S = new Set(row.named);
  if (row.cls === 'filter') for (const z of row.preds) { const f = predicateFn(z.src); for (const books of booksList) for (const [id, b] of books) { try { if (f(JSON.parse(JSON.stringify(b.obj)))) S.add(id); } catch { return null; } } }
  return S;
}

/**
 * 影: 計画の行(regen・理由が領域だけ)のうち presets:"all" の段を名簿で絞ったら reuse になる段。
 * @param {object} plan regen-plan の計画(steps)
 * @param {object} roster narrowRoster の戻り
 * @param {{changed:string[], booksList:Map[], coreSame?:boolean, ignoreCode?:string[]}} o changed = 刻印の html と今の html で変わった本・booksList = [刻印の html の本, 今の html の本]・
 *   coreSame = 閉包・HP・S._core・定数の差が無い(本の変化だけの写し —— 既定 true。計画の理由の文に「式」「定数」があれば絞らない)・
 *   ignoreCode = 探索の写しで外す「式(器・lib)」の理由のファイル(本便の道具の変更 —— 通常の便には無い理由を外して数える。既定は外さない)
 *   理由の種類 tool(刻印の道具の変更で引き直した領域 hash が違う —— 理由の文が「領域 hash」だけ)は領域の差として数える
 */
export function narrowShadow(plan, roster, o) {
  const by = new Map(roster.rows.map((z) => [z.key, z]));
  const changed = new Set(o.changed || []);
  const rows = [];
  for (const r of (plan.steps || [])) {
    const z = by.get(r.key);
    if (!z) continue;   // presets:"all" の段でない
    const ign = (o.ignoreCode || []);
    const codeIgn = (r.cause || []).filter((c) => /^式\(器・lib\): /.test(c)).every((c) => ign.some((f) => c.endsWith(f)));
    const kinds = (r.causeKinds || []).filter((k) => !(k === 'code' && codeIgn));
    const toolRegion = (r.reasons || []).filter((x) => /道具 .* が変わり/.test(x)).every((x) => /領域 hash/.test(x) && !/安定 hash/.test(x));
    const regionOnly = r.ownStatus === 'regen' && kinds.length > 0 && kinds.every((k) => k === 'scope' || (k === 'tool' && toolRegion)) && kinds.includes('scope');
    const coreText = (r.cause || []).some((c) => /式|定数|S\._core|受理規則/.test(c) && !/^プリセット/.test(c) && !(/^式\(器・lib\): /.test(c) && codeIgn) && !/^道具/.test(c));
    let narrowed = null, why = '';
    if (r.ownStatus !== 'regen') why = '計画で regen でない(' + r.status + ')';
    else if (!regionOnly) why = '理由が領域だけでない(' + kinds.join(',') + ')';
    else if (o.coreSame === false || coreText) why = '核(閉包・HP・S._core・定数)の差がある';
    else {
      const S = readsBooks(z, o.booksList || []);
      if (!S) why = '全本を読む(' + z.why.slice(0, 40) + ')';
      else { const hit = [...changed].filter((id) => S.has(id)); narrowed = hit.length === 0; why = narrowed ? '変わった本 ' + [...changed].slice(0, 3).join(',') + ' は読まない(読む本 ' + S.size + ')' : '読む本が変わった: ' + hit.slice(0, 3).join(','); }
    }
    rows.push({ key: r.key, sec: Number(r.sec) || 0, status: r.status, ownStatus: r.ownStatus, cls: z.cls, narrowed, why });
  }
  const regen = rows.filter((z) => z.ownStatus === 'regen');
  return { version: NARROW_VERSION, changed: [...changed], count: { allSteps: rows.length, regen: regen.length, narrowedReuse: regen.filter((z) => z.narrowed === true).length,
    secRegen: regen.reduce((a, z) => a + z.sec, 0), secNarrowed: regen.filter((z) => z.narrowed === true).reduce((a, z) => a + z.sec, 0) }, rows };
}

/** 名簿の表(PHYSICS の表)。 */
export function rosterRows(R) {
  const out = ['| 段 | 型 | 使い方 | 読む本 |', '|---|---|---|---|'];
  for (const z of R.rows) out.push(`| ${z.key} | ${z.cls} | ${z.kinds.join('・')} | ${z.why.replace(/\|/g, '\\|').slice(0, 110)} |`);
  return out.join('\n');
}

/** 自己試験(I/O なし): 条件の式の取り出し・評価・影の数え方。 */
export function narrowSelfTest() {
  const bad = [], cases = [];
  const src = "const a = 1;\nconst ids = HP.allPresets().filter((p) => p.physics && p.physics.geoPN === 4).map((p) => p.id);\nfor (const p of HP.allPresets()) x(p);\n";
  const pr = filterPredicateAt(src, 2), pr3 = filterPredicateAt(src, 3);
  if (pr !== '(p) => p.physics && p.physics.geoPN === 4' || pr3 !== null) bad.push('① 条件の式の取り出し: ' + pr + ' / ' + pr3);
  const f = predicateFn(pr);
  if (!(f({ physics: { geoPN: 4 } }) === true && !f({ physics: { geoPN: 3 } }))) bad.push('① 条件の式の評価');
  let threw = false; try { predicateFn('(p) => OUTER.includes(p.id)')({ id: 'a' }); } catch { threw = true; }
  if (!threw) bad.push('① 本の外の名を読む式が投げない');
  cases.push('① 条件の式: allPresets().filter(<式>) の式を取り出し・本に当てて評価(本の外の名を読む式は投げる → enumerates)');
  const mk = (id, g) => [id, { raw: id + g, acc: id + g, obj: { id, physics: { geoPN: g } } }];
  const A = new Map([mk('a', 4), mk('b', 3), mk('c', 3)]), B2 = new Map([mk('a', 4), mk('b', 3), mk('c', 2)]);
  const roster = { rows: [{ key: 'F', cls: 'filter', named: [], preds: [{ src: '(p) => p.physics.geoPN === 4' }], why: '' }, { key: 'E', cls: 'enumerates', named: [], preds: [], why: 'iterate' },
    { key: 'N', cls: 'named', named: ['c'], preds: [], why: '' }] };
  const plan = { steps: [{ key: 'F', status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], cause: ['プリセット: c'], sec: 10 }, { key: 'E', status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], cause: ['プリセット: c'], sec: 20 },
    { key: 'N', status: 'regen', ownStatus: 'regen', causeKinds: ['scope'], cause: ['プリセット: c'], sec: 5 }] };
  const ch = changedBooks(A, B2);
  const s = narrowShadow(plan, roster, { changed: ch, booksList: [A, B2] });
  const k = s.rows.map((z) => z.key + ':' + z.narrowed).join(',');
  if (!(ch.join(',') === 'c' && k === 'F:true,E:null,N:false' && s.count.narrowedReuse === 1 && s.count.secNarrowed === 10)) bad.push('② 影の数え方: ' + ch.join(',') + ' / ' + k);
  const s2 = narrowShadow({ steps: [Object.assign({}, plan.steps[0], { cause: ['プリセット: c', '式: makeSim'] })] }, roster, { changed: ch, booksList: [A, B2] });
  if (s2.rows[0].narrowed !== null) bad.push('② 核の差があっても絞った');
  // 条件の境界: 変更で条件に入る本(刻印では外・今は内)は読む本に入る
  const B3 = new Map([mk('a', 4), mk('b', 4), mk('c', 3)]);
  const s3 = narrowShadow({ steps: [Object.assign({}, plan.steps[0], { cause: ['プリセット: b'] })] }, roster, { changed: changedBooks(A, B3), booksList: [A, B3] });
  if (s3.rows[0].narrowed !== false) bad.push('② 条件に入った本を読まない側に数えた');
  cases.push('② 影: 条件で選ぶ段は選ばれない本の変更で reuse・全本を読む段は絞らない・名指しの本の変更は regen・核の差があれば絞らない・変更で条件に入った本は読む本(刻印と今の両方の条件)');
  return { version: NARROW_VERSION, ok: bad.length === 0, bad, cases };
}

export default { NARROW_VERSION, SCOPEALL_FILE_326E, NARROW_KINDS_326E, filterPredicateAt, predicateFn, bookParts, changedBooks, narrowRoster, readsBooks, narrowShadow, rosterRows, narrowSelfTest };

// 第323便d(決断事項 AN428 ①・統括の検証項目 R278): **来歴の語が量の名と世代の印に残る箇所の一覧**(純関数 —— 器・道具・QA が同じ 1 本を読む)。
//
// ■ 何を数えるか(データの側 —— html の内蔵の本と表)
//   ・`obsCardQ`   … 較正の分類の本(在位と退役)の観測結果カード obsCard の行名 `q`(ja)。判定器が**量の名**として読む。
//   ・`obsCardQEn` … 同じ行の英語の行名(`en.obsCard[].q`)—— 表示だけ(判定器は読まない)。
//   ・`fitRecord`  … フィットの記録の箱の文(law・procedure・fixed・notFitted・targets の source/tol.note)—— QA が便の語を世代の目印に読む。
//   ・`retiredReason` … 退役の本の理由(RETIRED_PRESETS の ja/en)—— QA が先頭の「第90報」を世代の目印に読む。
//   来歴の語の判定は**html 自身の判定**(`PROV_TEXT_CLEAN.PROV_TEST` —— 画面で出す側が外す語と同じ集合)を引数で受ける
//   (この lib は html を読まない —— 判定の正規表現を写して持たない)。
// ■ 読む側(読み手の箇所)
//   旧い名を**完全一致**で持つファイルと、名前の**部分一致の鍵**(来歴の語を含む引用の文字列で、旧い名の一部であるもの —— 例
//   `'近点間(第250便d)'`)を持つファイルを、種類(器・lib・道具・データ・凍結の写し・正本・QA・html)で数える。
//   ① で互換にした読み手(本便): 判定器の行の測定定義の表(ROW_MEASUREMENT_DEF —— `rowId` を足した)・h/4 の例外の照合
//   (`h4ExceptionCompat`)・判定器の正本の量の行(`rowId` を書き足す)。② で変える読み手: html の表と受理器・QA の名前の照合。
//   凍結の写しと過去の正本は書き換えない(読込は `rowIdOf` が通す)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const PROV_INV_VERSION = 'w323d-provinv-1';
export const INV_KINDS = Object.freeze(['obsCardQ', 'obsCardQEn', 'fitRecord', 'retiredReason']);

/** html の本(allPresets)と退役の表から、来歴の語を含む文字列の一覧を作る。`test(s)` は来歴の語の判定(html の PROV_TEST)。 */
export function inventoryData({ presets, retired, test, clean }) {
  const items = [];
  const cl = typeof clean === 'function' ? clean : (s) => s;
  for (const p of (presets || [])) {
    if (!p || String(p.id).startsWith('custom_')) continue;
    const isCal = p.sampleClass === 'calibration', isRet = p.familyRole === 'retired';
    (p.obsCard || []).forEach((r, i) => {
      if (r && typeof r.q === 'string' && test(r.q))
        items.push({ kind: 'obsCardQ', preset: p.id, index: i, calibration: isCal, retired: isRet, text: r.q, cleaned: cl(r.q) });
    });
    ((p.en && p.en.obsCard) || []).forEach((r, i) => {
      if (r && typeof r.q === 'string' && test(r.q))
        items.push({ kind: 'obsCardQEn', preset: p.id, index: i, calibration: isCal, retired: isRet, text: r.q, cleaned: cl(r.q) });
    });
    if (p.fitRecord && typeof p.fitRecord === 'object') {
      const walk = (o, at) => {
        if (typeof o === 'string') { if (test(o)) items.push({ kind: 'fitRecord', preset: p.id, path: at, calibration: isCal, retired: isRet, text: o, cleaned: cl(o) }); }
        else if (Array.isArray(o)) o.forEach((v, k) => walk(v, at + '.' + k));
        else if (o && typeof o === 'object') for (const k of Object.keys(o)) walk(o[k], at + '.' + k);
      };
      walk(p.fitRecord, 'fitRecord');
    }
  }
  for (const id of Object.keys(retired || {})) {
    const e = retired[id] || {};
    for (const lang of ['ja', 'en']) if (typeof e[lang] === 'string' && test(e[lang]))
      items.push({ kind: 'retiredReason', preset: id, lang, text: e[lang], cleaned: cl(e[lang]), head: (e[lang].match(/^第\d+報/) || [null])[0] });
  }
  return items;
}

/** 引用の文字列(' " `)を取り出す(`${` を含むテンプレートは除く)。JSON は文字列の値。 */
export function quotedLiterals(src) {
  const out = [];
  const re = /'((?:[^'\\\n]|\\.){4,400})'|"((?:[^"\\\n]|\\.){4,400})"|`((?:[^`\\$]|\\.){4,400})`/g;
  let m;
  while ((m = re.exec(src))) {
    const raw = m[1] != null ? m[1] : (m[2] != null ? m[2] : m[3]);
    out.push(raw.replace(/\\(.)/g, '$1'));
  }
  return out;
}

/** ファイルの種類(読む側の分類)。 */
export function readerKindOf(rel) {
  if (rel === 'tests/qa.mjs') return 'qa';
  if (rel === 'beta/index.html' || rel === 'index.html') return 'html';
  if (rel.startsWith('tests/fixtures/')) return 'fixture';
  if (rel.startsWith('tests/out/')) return 'canon';
  if (/^tests\/data-.*\.json$/.test(rel)) return 'data';
  if (/^tests\/lib-.*\.mjs$/.test(rel)) return 'lib';
  if (/^tests\/exp-.*\.mjs$/.test(rel)) return 'device';
  if (rel.startsWith('tools/')) return 'tool';
  return 'other';
}

/** 走査するファイル(器・lib・道具・データ・凍結の写し・QA・html。正本 tests/out は量の名の写しなので別に数える)。 */
export function readerFiles(root, opt) {
  const o = opt || {};
  const ls = (d, re) => { try { return fs.readdirSync(path.join(root, d)).filter((f) => re.test(f)).map((f) => d + '/' + f); } catch (e) { return []; } };
  const files = [].concat(ls('tests', /^(exp|lib)-.*\.mjs$/), ls('tests', /^data-.*\.json$/), ls('tools', /\.mjs$/), ls('tests/fixtures', /\.json$/),
    ['tests/qa.mjs', 'beta/index.html'], o.withCanon ? ls('tests/out', /\.json$/) : []);
  return [...new Set(files)].filter((f) => !o.exclude || !o.exclude.has(f)).sort();
}

/**
 * 旧い名ごとに、完全一致の出現と部分一致の鍵の出現をファイルで数える。
 * @param {{root, names: string[], files: string[], test: (s)=>boolean, clean: (s)=>string, defsInHtml?: Map<string, number>}} a
 *   defsInHtml … html の中で名前が**定義**として現れる数(obsCard の ja 行 —— 読み手の数から引く)。
 */
export function scanReaders({ root, names, files, test, clean, defsInHtml }) {
  const res = new Map(names.map((n) => [n, { exact: [], fragment: [] }]));
  for (const rel of files) {
    let src; try { src = fs.readFileSync(path.join(root, rel), 'utf8'); } catch (e) { continue; }
    const kind = readerKindOf(rel);
    const isHtml = rel.endsWith('.html');
    const decls = isHtml ? htmlDeclIndex(src) : null;
    for (const n of names) {
      let k = 0, at = src.indexOf(n);
      const where = {};
      while (at >= 0) { k++; if (decls) { const d = htmlDeclAt(decls, at); where[d] = (where[d] || 0) + 1; } at = src.indexOf(n, at + n.length); }
      if (isHtml && defsInHtml) {
        // 定義(内蔵の本の配列 BUILTIN_PRESETS の中の行名)を読み手の数から引く
        const nd = defsInHtml.get(n) || 0;
        k -= nd;
        if (where.BUILTIN_PRESETS) { where.BUILTIN_PRESETS -= nd; if (where.BUILTIN_PRESETS <= 0) delete where.BUILTIN_PRESETS; }
      }
      if (k > 0) res.get(n).exact.push(Object.assign({ file: rel, kind, n: k }, isHtml ? { where } : {}));
    }
    const lits = quotedLiterals(src).filter((L) => test(L) && String(clean(L) || '').replace(/[\s()()〔〕[\]—・:]/g, '').length >= 2);
    const seen = new Set();
    for (const L of lits) for (const n of names) {
      if (L === n || n.indexOf(L) < 0 || seen.has(n + '\u0000' + L)) continue;
      seen.add(n + '\u0000' + L);
      res.get(n).fragment.push({ file: rel, kind, literal: L });
    }
  }
  return res;
}

/** html の最上位の宣言(列 0 の const/let/function/var)の位置の索引。 */
export function htmlDeclIndex(src) {
  const idx = [];
  const re = /^(?:const|let|var|function\*?|async function)\s+([A-Za-z_$][\w$]*)/gm;
  let m;
  while ((m = re.exec(src))) idx.push([m.index, m[1]]);
  return idx;
}
/** 位置 `at` を含む最上位の宣言の名(無ければ "(top)")。 */
export function htmlDeclAt(idx, at) {
  let lo = 0, hi = idx.length - 1, best = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (idx[mid][0] <= at) { best = mid; lo = mid + 1; } else hi = mid - 1; }
  return best >= 0 ? idx[best][1] : '(top)';
}

/**
 * 世代の印の読み(読込の互換 —— 専用の欄があればそれ、無ければ旧い文字列から導く)。
 *   退役の理由: 欄 `ruling`(数)→ 旧い文の先頭「第N報」の N。
 *   フィットの記録: 欄 `wave`(「323d」の型)→ procedure の先頭の「第N便x」。
 * どちらも ② の QA の読み口(本便では QA の判定の鍵を変えない —— 関数を置くだけ)。
 */
export function rulingOf(entry) {
  if (entry && Number.isFinite(entry.ruling)) return { ruling: entry.ruling, source: 'key' };
  const s = String((entry && entry.ja) || '');
  const m = s.match(/^第(\d+)報/);
  return m ? { ruling: Number(m[1]), source: 'legacy' } : { ruling: null, source: 'none' };
}
export function waveOf(rec) {
  if (rec && typeof rec.wave === 'string' && rec.wave) return { wave: rec.wave, source: 'key' };
  const s = String((rec && rec.procedure) || '');
  const m = s.match(/第(\d+)便([a-z]?)/);
  return m ? { wave: m[1] + m[2], source: 'legacy' } : { wave: null, source: 'none' };
}

/** 種類ごとの要約(数・本の数・読む側の種類ごとのファイル数)。 */
export function summarizeInventory(items, readers) {
  const by = {};
  for (const k of INV_KINDS) by[k] = { n: 0, presets: new Set(), calibration: 0, retired: 0 };
  for (const it of items) { const b = by[it.kind]; b.n++; b.presets.add(it.preset); if (it.calibration) b.calibration++; if (it.retired) b.retired++; }
  const out = {};
  for (const k of INV_KINDS) out[k] = { n: by[k].n, presets: by[k].presets.size, calibration: by[k].calibration, retired: by[k].retired };
  if (readers) {
    const files = {};
    for (const [, r] of readers) for (const z of r.exact.concat(r.fragment)) (files[z.kind] = files[z.kind] || new Set()).add(z.file);
    out.readerFiles = Object.fromEntries(Object.entries(files).map(([k, v]) => [k, [...v].sort()]));
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------
// 判定の値の前後(AN428 ① の照合 —— 行の id を足す前と後で判定が同じか)
// ---------------------------------------------------------------------------------------------------------------------
export const CALVERDICT_VERSION = 'w323d-calverdict-1';
const numOrNull = (v) => (typeof v === 'number' && Number.isFinite(v)) ? v : (v === undefined ? null : v);
/**
 * 判定器の正本の**判定の値**の写し: 4 値の台帳(本ごとの 4 値・門の内訳・代表量・最悪の差・欠け)と数・量の 5 区分の数・門の状態の数・
 * 行ごとの 5 区分・門の状態と σ 倍・差 %・実測値(行名で引く —— 行の id は使わない〔id を足した前後で比べるため〕)。
 */
export function calJudgementProjection(canon) {
  const C = canon || {};
  const L = (C.verdictLedger || {});
  return {
    counts: L.counts || null,
    tally: (C.summary || {}).tally || null,
    gate: ((C.summary || {}).gate || {}).byStatus || null,
    ledger: (L.rows || []).map((r) => ({ id: r.id, verdict4: r.verdict4, gateCounts: r.gateCounts || null, representative: r.representative || null,
      residualWorst: r.residualWorst || null, missing: r.missing || null, residualPeriodPct: numOrNull(r.residualPeriodPct) })),
    rows: (C.presets || []).flatMap((p) => (p.quantities || []).map((q) => ({ preset: p.id, name: q.name, kind: q.kind || null, target: q.target || null,
      verdict: q.verdict || null, gateStatus: (q.gate || {}).status || null, nSigma: numOrNull((q.gate || {}).nSigma),
      residualPct: numOrNull(q.residualPct), meas: numOrNull(q.meas) }))),
  };
}
/** 物理の入力の指紋(法則の指紋〔停止集合つき依存閉包〕・観測 CSV と判定の出典の sha・本ごとの h/2 の安定 hash)。同じなら判定は同じであるべき。 */
export function calPhysicsKeyOf(canon) {
  const C = canon || {};
  const parts = { engine: (((C.h2Reuse || {}).engineFingerprint) || {}).sha256 || null, csvSha: (C.mergeKey || {}).csvSha || null,
    judgementSourcesSha: (C.mergeKey || {}).judgementSourcesSha || null,
    stable: Object.fromEntries((C.presets || []).map((p) => [p.id, ((((p.run || {}).h2Reuse) || {}).stable || {}).sha || null])) };
  return { sha256: crypto.createHash('sha256').update(JSON.stringify(parts)).digest('hex'), parts };
}
/** 2 つの写しの差(数は相対 1e-12 の内を同じとする)。返す: 差の JSON Pointer の配列。 */
export function projectionDiff(a, b, tol) {
  const T = Number.isFinite(tol) ? tol : 1e-12;
  const out = [];
  const walk = (x, y, ptr) => {
    if (x === y) return;
    if (typeof x === 'number' && typeof y === 'number') { if (Math.abs(x - y) <= T * Math.max(Math.abs(x), Math.abs(y))) return; out.push(ptr); return; }
    if (!x || !y || typeof x !== 'object' || typeof y !== 'object' || Array.isArray(x) !== Array.isArray(y)) { out.push(ptr); return; }
    if (Array.isArray(x) && x.length !== y.length) { out.push(ptr + '(長さ)'); return; }
    for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[k], y[k], ptr + '/' + k);
  };
  walk(a, b, '');
  return out;
}
export function projectionDigest(proj) {
  return crypto.createHash('sha256').update(JSON.stringify(proj, (k, v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(12)) : v)).digest('hex');
}

#!/usr/bin/env node
// 第352便g(統括の検証項目 R444): **root の全 QA で SKIP になった試験が、beta の全 QA で PASS しているか**の突き合わせ(読むだけ —— 何も書かない)。
//   昇格の公開ノートの「root で SKIP する試験」の数を数える道具。入力は保存の全 QA の結果 2 本(既定 tests/out/qa-results-full.json〔root〕・
//   tests/out/qa-results-full-beta.json〔beta〕)と、任意で root の全 QA のログ(--root-log —— SKIP の行は保存の結果に残らず、ログにだけ在る)。
//   (A) 結果 2 本だけで: beta に行が在って root に行が無い鍵(root で SKIP か、root では印字せずに飛ぶ鍵)の数と、その中の beta の FAIL・
//       root に行が在って beta に行が無い鍵の一覧(root だけで走る鍵)。2 本の commit・対象の html・総数を並べる。
//   (B) --root-log を渡したとき: 行頭「SKIP 」の行を数え、1 行に試験を並べる 2 つの書き方(「 / 」と「・」)の両方で分けて、試験の名ごとに beta の結果を引く
//       → beta で PASS・beta で FAIL・beta に行が無い(beta に無い試験の一覧)・重複・名として読めない片。
// 使い方:
//   node tools/root-skip-check.mjs [--root-json <f>] [--beta-json <f>] [--root-log <f>] [--json]
//   node tools/root-skip-check.mjs --self-test
// 終了コード: 0 = 読めた(数を出すだけ —— beta に無い試験や FAIL が在っても 0)/ 2 = 入力が読めない。判定はしない(数を出す道具)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT_SKIP_CHECK_VERSION = 'w352g-root-skip-check-1';
const KEY_RE = /^[A-Za-z][\w.\-]*$/;

/** ログの本文 → { rows, names:[{id, why}], unreadable:[片] }(純関数 —— 行頭「SKIP 」の行だけ・名の部分は最初の括弧〔全角・半角〕の前・「 / 」と「・」で分ける) */
export function parseSkipLines(text) {
  const names = [], unreadable = [];
  let rows = 0;
  for (const raw of String(text || '').split('\n')) {
    const l = raw.replace(/\r$/, '');
    if (!l.startsWith('SKIP ')) continue;
    rows++;
    const body = l.slice(5);
    const cut = [body.indexOf('('), body.indexOf('(')].filter((i) => i >= 0);
    const i = cut.length ? Math.min(...cut) : -1;
    const head = i >= 0 ? body.slice(0, i) : body, why = i >= 0 ? body.slice(i + 1).replace(/[))]$/, '') : '';
    for (const part of head.split(/ \/ |・/)) {
      const tok = part.trim().split(/\s+/)[0] || '';
      if (!tok) continue;
      if (KEY_RE.test(tok)) names.push({ id: tok, why: why.slice(0, 60) });
      else unreadable.push(tok.slice(0, 40));
    }
  }
  return { rows, names, unreadable };
}

/** 結果の配列 → Map(id → {pass, n})(同じ id が複数行なら、1 つでも FAIL なら FAIL) */
function byId(results) {
  const m = new Map();
  for (const r of results || []) {
    if (!r || typeof r.id !== 'string') continue;
    const z = m.get(r.id) || { pass: true, n: 0 };
    z.n++; if (r.pass !== true) z.pass = false;
    m.set(r.id, z);
  }
  return m;
}

/** (A)(B) の突き合わせ(純関数) */
export function crossCheck({ rootResults, betaResults, skipParse }) {
  const R = byId(rootResults), B = byId(betaResults);
  const betaOnly = [...B.keys()].filter((k) => !R.has(k)), rootOnly = [...R.keys()].filter((k) => !B.has(k));
  const A = {
    rootIds: R.size, betaIds: B.size,
    betaOnly: betaOnly.length, betaOnlyFail: betaOnly.filter((k) => !B.get(k).pass),
    rootOnly, rootFail: [...R.keys()].filter((k) => !R.get(k).pass), betaFail: [...B.keys()].filter((k) => !B.get(k).pass),
  };
  if (!skipParse) return { A, B: null };
  const ids = skipParse.names.map((z) => z.id), uniq = [...new Set(ids)];
  const betaPass = [], betaFail = [], notInBeta = [], ranOnRoot = [];
  for (const k of uniq) {
    const b = B.get(k);
    if (!b) notInBeta.push(k); else if (b.pass) betaPass.push(k); else betaFail.push(k);
    if (R.has(k)) ranOnRoot.push(k);   // SKIP の行に名が在るのに root の結果にも行が在る(同じ鍵の別の部分が走った等 —— 情報)
  }
  return {
    A,
    B: { rows: skipParse.rows, names: ids.length, unique: uniq.length, dup: ids.length - uniq.length, betaPass: betaPass.length, betaFail, notInBeta, ranOnRoot, unreadable: skipParse.unreadable },
  };
}

export function selfTest352g() {
  const rows = [];
  const t = (name, cond, info) => rows.push({ name, ok: !!cond, info: info || '' });
  const log = [
    'PASS lint.a  x',
    'SKIP lint.b(beta 対象でない: index.html — 理由)',
    'SKIP docs.c / docs.d(beta 対象でない・第311便c 未適用 — index.html)',
    'SKIP lint.e・docs.f(前の世代か beta 対象でない —— index.html)',
    'SKIP behavior.old(半角の括弧 (旧い API))',
    'SKIP docs.c(同じ鍵がもう 1 行)',
    'SKIP 第149便 未適用(名でない)',
    '  SKIP lint.indent(行頭でない —— 数えない)',
    'SKIP ui.noparen',
  ].join('\n');
  const P = parseSkipLines(log);
  t('SKIP の行の数(行頭だけ)', P.rows === 7, P.rows);
  t('「 / 」と「・」の両方で分ける', ['docs.c', 'docs.d', 'lint.e', 'docs.f'].every((k) => P.names.some((z) => z.id === k)));
  t('半角の括弧も名の終わり', P.names.some((z) => z.id === 'behavior.old'));
  t('括弧の無い行も名を拾う', P.names.some((z) => z.id === 'ui.noparen'));
  t('名として読めない片を別に数える', P.unreadable.length === 1 && P.unreadable[0] === '第149便', P.unreadable.join(','));
  t('名の数(重複を含む)', P.names.length === 8, P.names.length);
  const beta = ['lint.a', 'lint.b', 'docs.c', 'docs.d', 'lint.e', 'ui.noparen', 'beta.only'].map((id) => ({ id, pass: true })).concat([{ id: 'docs.f', pass: false }]);
  const root = [{ id: 'lint.a', pass: true }, { id: 'root.only', pass: true }];
  const X = crossCheck({ rootResults: root, betaResults: beta, skipParse: P });
  t('(B) beta で PASS', X.B.betaPass === 5, X.B.betaPass);
  t('(B) beta で FAIL', X.B.betaFail.length === 1 && X.B.betaFail[0] === 'docs.f', X.B.betaFail.join(','));
  t('(B) beta に無い試験の一覧', X.B.notInBeta.length === 1 && X.B.notInBeta[0] === 'behavior.old', X.B.notInBeta.join(','));
  t('(B) 重複', X.B.dup === 1 && X.B.unique === 7, X.B.dup);
  t('(A) beta に行が在って root に無い鍵', X.A.betaOnly === 7 && X.A.betaOnlyFail.length === 1, X.A.betaOnly);
  t('(A) root だけの鍵', X.A.rootOnly.length === 1 && X.A.rootOnly[0] === 'root.only', X.A.rootOnly.join(','));
  const Y = crossCheck({ rootResults: root, betaResults: beta, skipParse: null });
  t('ログが無ければ (B) は無い', Y.B === null);
  t('空のログ → 0 行', parseSkipLines('').rows === 0);
  return { ok: rows.every((z) => z.ok), rows };
}

function readJson(f) { return JSON.parse(fs.readFileSync(f, 'utf8')); }

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const a = process.argv.slice(2);
  if (a.includes('--self-test')) {
    const st = selfTest352g();
    for (const z of st.rows) console.log((z.ok ? 'ok ' : 'NG ') + z.name + (z.info !== '' ? '(' + z.info + ')' : ''));
    console.log('root-skip-check --self-test: ' + st.rows.filter((z) => z.ok).length + '/' + st.rows.length + ' → ' + (st.ok ? 'OK' : 'NG'));
    process.exit(st.ok ? 0 : 1);
  }
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const opt = (n, d) => { const i = a.indexOf('--' + n); return i >= 0 && a[i + 1] ? a[i + 1] : d; };
  const rf = path.resolve(ROOT, opt('root-json', 'tests/out/qa-results-full.json')), bf = path.resolve(ROOT, opt('beta-json', 'tests/out/qa-results-full-beta.json'));
  const lf = opt('root-log', '');
  let RJ, BJ, LT = null;
  try { RJ = readJson(rf); BJ = readJson(bf); if (lf) LT = fs.readFileSync(path.resolve(lf), 'utf8'); }
  catch (e) { console.error('root-skip-check: 入力が読めない —— ' + String(e && e.message || e).split('\n')[0]); process.exit(2); }
  const X = crossCheck({ rootResults: RJ.results, betaResults: BJ.results, skipParse: LT === null ? null : parseSkipLines(LT) });
  const meta = (j) => ({ commit: String(j.commit || '').slice(0, 8), target: j.target, total: j.total, failed: j.failed, chromium: j.env && j.env.chromium });
  const out = { version: ROOT_SKIP_CHECK_VERSION, root: meta(RJ), beta: meta(BJ), ...X };
  if (a.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
  const mr = out.root, mb = out.beta;
  console.log(`root-skip-check(${ROOT_SKIP_CHECK_VERSION}): root ${mr.target} ${mr.commit} 総数 ${mr.total}・FAIL ${mr.failed} / beta ${mb.target} ${mb.commit} 総数 ${mb.total}・FAIL ${mb.failed}` + (mr.commit !== mb.commit ? '(‼ 2 本の commit が違う)' : ''));
  console.log(`(A) 結果 2 本: 鍵 root ${X.A.rootIds}・beta ${X.A.betaIds} / beta に行が在って root に行が無い鍵 ${X.A.betaOnly}(うち beta で FAIL ${X.A.betaOnlyFail.length}${X.A.betaOnlyFail.length ? ': ' + X.A.betaOnlyFail.slice(0, 10).join(' ') : ''})/ root だけの鍵 ${X.A.rootOnly.length}${X.A.rootOnly.length ? ': ' + X.A.rootOnly.join(' ') : ''}`);
  if (X.B) {
    const b = X.B;
    console.log(`(B) root のログの SKIP: 行 ${b.rows}・試験 ${b.names}(重複を除いて ${b.unique}・重複 ${b.dup})→ beta で PASS ${b.betaPass}・beta で FAIL ${b.betaFail.length}・beta に無い ${b.notInBeta.length}・名として読めない片 ${b.unreadable.length}`
      + (b.ranOnRoot.length ? `・root の結果にも行が在る ${b.ranOnRoot.length}(情報)` : ''));
    if (b.notInBeta.length) console.log('    beta に無い試験: ' + b.notInBeta.join(' '));
    if (b.betaFail.length) console.log('    beta で FAIL: ' + b.betaFail.join(' '));
    if (b.unreadable.length) console.log('    名として読めない片: ' + b.unreadable.slice(0, 20).join(' '));
  } else console.log('(B) root のログを渡していない(SKIP の行は保存の結果に残らない —— --root-log <root の全 QA のログ> で試験ごとに突き合わせる)');
}

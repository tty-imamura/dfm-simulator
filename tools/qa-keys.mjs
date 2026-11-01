#!/usr/bin/env node
// 第322便d(統括の検証項目 R273 —— 第321便の運用の教訓)— **版名 QA の鍵の抜き出し**(便の開始に beta の版名を変えた後、版名を読む QA のブロックの鍵を
//   部分 QA `tests/exp-w258c-qapart.mjs` で引けるものだけ選び、50 鍵ずつのファイルに分ける)。
//
// ■ 何をするか
//   ① 鍵: tests/qa.mjs の `add('<id>'` のうち**コードの位置**(コメント・文字列・テンプレートの地の文・正規表現の中でない —— `scanJs` の写しで確かめる)にある
//      静的な id(文字列の中の `add('"'` などを拾わない)。
//   ② 範囲: qapart と**同じ関数**(`tests/lib-w322d-qapart.mjs` qaSpanner —— 器から移した本文)で切り出しの範囲を取る。外す鍵:
//      ・qapart の検索(`add('<id>'` を含む最初の行)が、コードの add の行より前のコメントか文字列の行に当たる
//      ・範囲が add の行を含まない・範囲が取れない(列 0 の { } が無い)
//      ・範囲の中のコードが **w5cGetUnit**(W5c のワーカープール)を読む —— 前後の add の位置でなく**範囲そのもの**で判定する(第321便の pwa.sw-fail-ui → behavior.saturnExp の型)
//      ・範囲の中のコードが、qapart の前文に無い**上流の最上位の名前**(範囲より前の const/let・関数宣言 —— 範囲の中で宣言した同名は除く)を読む
//   ③ 版名を読むブロック: 範囲の**コメントを除いた本文**(文字列は残す —— `rd('CHANGELOG.md')` 型の読みを拾う)が正規表現のどれかに合う(既定 CHANGELOG・BETA_BUILD・APP_VERSION・sw.js —— `--re` で差し替え・足す)。
//   ④ 束: 範囲の順に並べ、範囲が重なる鍵は同じ束に入れて **50 鍵ずつ**(`--chunk`)のファイル `<out-dir>/qa-keys-<k>.txt`(1 行・空白区切り)と `index.json`。
//
// ■ 使い方(統括の便の開始 —— 1 行)
//   node tools/qa-keys.mjs --out-dir <scratch>/qakeys     # 版名 QA の鍵を 50 鍵ずつ → 各ファイルを qapart で:
//   for f in <scratch>/qakeys/qa-keys-*.txt; do node tests/exp-w258c-qapart.mjs $(cat $f); done   (root は QA_TARGET=index.html を前に)
//   --re <正規表現>(繰り返し可 —— 既定の 4 つを置き換える)/ --re+ <正規表現>(既定に足す)/ --chunk 50 / --json <file> / --list(鍵を印字するだけ)/ --self-test
//
// ■ 言わないこと
//   「選んだ鍵は全部 PASS する」(切り出しは行の範囲だけ —— ページの上流の状態〔__qaPreset の写しなど〕に依るブロックは qapart の前文に無い)。
//   「外した鍵は版名を読まない」(外した鍵はフル QA が見る —— 外した理由を index.json と印字に出す)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const QA_KEYS_VERSION = 'w322d-qa-keys-1';
/** 版名を読むブロックの既定の正規表現(CHANGELOG の beta 節・BETA_BUILD・APP_VERSION・sw.js のキャッシュ名)。 */
export const DEFAULT_RES = ['CHANGELOG', 'BETA_BUILD', 'APP_VERSION', 'sw\\.js'];
export const DEFAULT_CHUNK = 50;
const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function libs(root) {
  const QO = await import(pathToFileURL(path.join(root, 'tests', 'lib-w279b-qaorder.mjs')).href);
  const QP = await import(pathToFileURL(path.join(root, 'tests', 'lib-w322d-qapart.mjs')).href);
  const SC = await import(pathToFileURL(path.join(root, 'tests', 'lib-w281a-scope.mjs')).href);
  return { QO, QP, SC };
}

/**
 * 鍵を抜き出す(純関数 —— 自己試験が缶詰の qa.mjs で照合する)。
 * @param {{qaSrc:string, QO:object, QP:object, SC:object, res?:string[], chunk?:number}} o
 * @returns {{selected:Array<{id,span,line,match}>, excluded:Array<{id,line,why}>, unmatched:number, batches:string[][], keys:number}}
 */
export function extractKeys(o) {
  const { qaSrc, QO, QP, SC } = o;
  const res = (o.res && o.res.length ? o.res : DEFAULT_RES).map((r) => new RegExp(r));
  const lines = qaSrc.split('\n');
  const scan = SC.scanJs(qaSrc);
  const starts = [0];
  for (let i = 0; i < qaSrc.length; i++) if (qaSrc[i] === '\n') starts.push(i + 1);
  const lineOf = (pos) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (starts[m] <= pos) lo = m; else hi = m - 1; } return lo; };
  const textOf = (s, e, which) => which.slice(starts[s], e < starts.length ? starts[e] : which.length);
  // ① コードの位置の静的な add の id(最初のコードの行)
  const firstCode = new Map();
  for (const m of qaSrc.matchAll(/add\('([^'\\\n]+)'\s*[,)]/g)) {
    const pos = m.index;
    if (scan.code.slice(pos, pos + 4) !== 'add(') continue;              // コメント・文字列・正規表現の中
    if (pos > 0 && /[\w$.]/.test(qaSrc[pos - 1])) continue;              // 別の関数(seen.add など)
    if (!firstCode.has(m[1])) firstCode.set(m[1], lineOf(pos));
  }
  // 上流の最上位の名前(qapart の前文に無いもの)
  const units = QO.splitTopLevel(qaSrc);
  const provided = new Set(QP.QAPART_PRELUDE_NAMES);
  for (const l of lines) { const mc = /^const (W\d{3}[A-Z]_[A-Z0-9_]+) = /.exec(l); if (mc) provided.add(mc[1]); }
  const i284a = lines.findIndex((l) => l.startsWith('const W284_PSR_F1 = ')), i284b = lines.findIndex((l) => l.startsWith('const W284_CORE = '));
  if (i284a >= 0 && i284b >= i284a) for (const l of lines.slice(i284a, i284b + 1)) { const mc = /^const ([A-Za-z_$][\w$]*) = /.exec(l); if (mc) provided.add(mc[1]); }
  const topDecl = new Map();   // name -> { l0 (0 始まり), hoisted }
  for (const u of units) for (const nm of u.names) if (!topDecl.has(nm)) topDecl.set(nm, { l0: u.l0 - 1, hoisted: u.kind === 'fn' || /^await w5bRun\(/.test(u.head) });
  const SP = QP.qaSpanner(qaSrc, QO);
  const selected = [], excluded = [];
  let unmatched = 0;
  for (const [id, line] of firstCode) {
    const qLine = lines.findIndex((l) => l.includes("add('" + id + "'"));
    if (qLine !== line) { excluded.push({ id, line: line + 1, why: `qapart の検索が先に ${qLine + 1} 行(コメントか文字列)に当たる` }); continue; }
    let span;
    try { span = SP.spanOf(id); } catch (e) { excluded.push({ id, line: line + 1, why: '範囲が取れない: ' + String(e.message || e).slice(0, 80) }); continue; }
    if (!(span[0] <= line && line < span[1])) { excluded.push({ id, line: line + 1, why: `範囲 ${span[0] + 1}-${span[1]} が add の行を含まない` }); continue; }
    // W5b の範囲は qapart が見出し行を `if (<ガード>) {` に戻して走らせる(見出しの w5bRun は走らない)—— 照合も戻した見出しで
    const head = SP.headRewrite.get(span[0]);
    const code = head === undefined ? textOf(span[0], span[1], scan.code) : SC.scanJs(head).code + '\n' + textOf(span[0] + 1, span[1], scan.code);
    if (/(^|[^\w$.])w5cGetUnit\s*\(/.test(code)) { excluded.push({ id, line: line + 1, why: `範囲 ${span[0] + 1}-${span[1]} が w5cGetUnit(W5c のワーカープール)を読む` }); continue; }
    const idents = new Set(code.match(/(?<![\w$.])[A-Za-z_$][\w$]*(?![\w$])/g) || []);
    const up = [];
    for (const nm of idents) {
      const d = topDecl.get(nm);
      if (!d || provided.has(nm)) continue;
      if (!(d.hoisted || d.l0 < span[0])) continue;                       // 範囲より後の宣言は局所の同名(TDZ)
      if (d.l0 >= span[0] && d.l0 < span[1]) continue;                    // 範囲の中の最上位の宣言
      if (new RegExp('(?:const|let|var|function\\*?|class)\\s+' + nm.replace(/\$/g, '\\$') + '(?![\\w$])|[{,]\\s*' + nm.replace(/\$/g, '\\$') + '\\s*[,}=]|\\(\\s*' + nm.replace(/\$/g, '\\$') + '\\s*[,)=]').test(code)) continue;   // 範囲の中の局所の宣言・分割代入・引数
      up.push(nm);
    }
    if (up.length) { excluded.push({ id, line: line + 1, why: `範囲 ${span[0] + 1}-${span[1]} が qapart の前文に無い上流の名前を読む: ${up.slice(0, 4).join(',')}` }); continue; }
    const nocom = textOf(span[0], span[1], scan.nocom);
    const hit = res.filter((r) => r.test(nocom)).map((r) => r.source);
    if (!hit.length) { unmatched++; continue; }
    selected.push({ id, span, line: line + 1, match: hit });
  }
  // 版名を読む範囲で外した鍵だけを報告に残す(版名を読まない範囲の外した鍵は数だけ)
  const exVersion = excluded.filter((z) => {
    const s0 = Math.max(0, z.line - 1);
    let span = null;
    try { span = SP.spanOf(z.id); } catch { span = [s0, s0 + 1]; }
    return res.some((r) => r.test(textOf(span[0], Math.max(span[1], span[0] + 1), scan.nocom)));
  });
  const chunk = Math.max(1, Number(o.chunk) || DEFAULT_CHUNK);
  const batches = QP.batchKeys(selected.map((z) => ({ id: z.id, span: z.span })), chunk);
  return { keys: firstCode.size, selected, excluded, excludedVersion: exVersion, unmatched, batches, res: res.map((r) => r.source), chunk };
}

/** 自己試験(缶詰の qa.mjs —— QA が呼ぶ)。 */
export async function selfTest(opt) {
  const root = (opt && opt.root) || TOOL_ROOT;
  const L = await libs(root);
  const bad = [], cases = [];
  const Q = [
    "const W999A_X = 1;",
    "async function w5cGetUnit(key) { return key; }",
    "const upstreamThing = 3;",
    "// ---- a",
    "{",
    "  const CL = rd('CHANGELOG.md');",
    "  add('docs.a', true, 'x');",
    "  const note = `add('\"', 1) add('docs.ghost', 2)`;",
    "}",
    "// add('docs.b', …) の注記(コメント)",
    "{",
    "  const s = String(BETA_BUILD);",
    "  add('docs.b', !!s, 'y');",
    "  const iso = await w5cGetUnit('k');",
    "  add('docs.c', !!iso, 'z');",
    "}",
    "{",
    "  const v = upstreamThing + W999A_X;",
    "  add('docs.d', v > 0, 'sw.js');",
    "}",
    "{",
    "  const upstreamThing = 4;",
    "  add('docs.e', upstreamThing > 0, 'APP_VERSION');",
    "  add('docs.f', true, 'no version here');",
    "}",
    "{",
    "  add('docs.g', true, 'nothing');",
    "}",
  ].join('\n');
  const r = extractKeys({ qaSrc: Q, QO: L.QO, QP: L.QP, SC: L.SC, chunk: 1 });
  const sel = r.selected.map((z) => z.id).join(','), ex = Object.fromEntries(r.excluded.map((z) => [z.id, z.why]));
  if (r.keys !== 7) bad.push('① コードの位置の鍵が 7 でない: ' + r.keys + '(文字列の中の add を拾った?)');
  if ('docs.ghost' in ex || r.selected.some((z) => z.id === 'docs.ghost')) bad.push('① 文字列の中の add を鍵にした');
  if (!/コメントか文字列/.test(ex['docs.b'] || '')) bad.push('② qapart の検索がコメントに当たる鍵を外さない: ' + ex['docs.b']);
  if (!/w5cGetUnit/.test(ex['docs.c'] || '')) bad.push('② 範囲が w5cGetUnit を読む鍵を外さない: ' + ex['docs.c']);
  if (!/上流の名前を読む: upstreamThing/.test(ex['docs.d'] || '')) bad.push('② 上流の名前を読む鍵を外さない: ' + ex['docs.d']);
  if (sel !== 'docs.a,docs.e,docs.f') bad.push('③ 選んだ鍵が docs.a,docs.e,docs.f でない: ' + sel);
  if (r.unmatched !== 1) bad.push('③ 版名を読まない範囲が 1 でない: ' + r.unmatched);
  if (JSON.stringify(r.batches) !== JSON.stringify([['docs.a'], ['docs.e', 'docs.f']])) bad.push('④ 束(範囲が重なる鍵は同じ束): ' + JSON.stringify(r.batches));
  const r2 = extractKeys({ qaSrc: Q, QO: L.QO, QP: L.QP, SC: L.SC, res: ['nothing'] });
  if (r2.selected.map((z) => z.id).join(',') !== 'docs.g') bad.push('③ --re の差し替え: ' + r2.selected.map((z) => z.id).join(','));
  cases.push(`缶詰: 鍵 ${r.keys}(文字列の中の add を数えない)・選ぶ ${sel}・外す ${Object.keys(ex).sort().join(',')}(コメントに当たる・w5cGetUnit・上流の名前)・版名を読まない ${r.unmatched}・束 ${JSON.stringify(r.batches)}・--re で差し替え → ${r2.selected.map((z) => z.id).join(',')}`);
  // 実物(今の qa.mjs): 選んだ鍵は qapart の範囲に w5cGetUnit を含まない・束は 50 鍵以下
  const qaSrc = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  const R = extractKeys({ qaSrc, QO: L.QO, QP: L.QP, SC: L.SC });
  const over = R.batches.filter((b) => b.length > DEFAULT_CHUNK).length;
  if (!R.selected.length) bad.push('⑤ 今の qa.mjs で版名 QA の鍵が 0');
  if (over) bad.push('⑤ 50 鍵を超える束 ' + over);
  cases.push(`実物: 鍵 ${R.keys}・版名を読む範囲で選んだ ${R.selected.length}・外した ${R.excluded.length}(うち版名を読む範囲 ${R.excludedVersion.length})・束 ${R.batches.length}(${R.batches.map((b) => b.length).join('/')})`);
  return { version: QA_KEYS_VERSION, ok: bad.length === 0, bad, cases, real: { keys: R.keys, selected: R.selected.length, excluded: R.excluded.length, excludedVersion: R.excludedVersion.length, batches: R.batches.map((b) => b.length) } };
}

async function main(argv) {
  const root = TOOL_ROOT;
  if (argv.includes('--self-test')) {
    const r = await selfTest({ root });
    for (const c of r.cases) console.log('  ' + c);
    console.log(`qa-keys --self-test: ${r.ok ? 'OK' : 'NG —— ' + r.bad.join(' / ')}`);
    process.exit(r.ok ? 0 : 1);
  }
  const all = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] !== undefined ? [argv[i + 1]] : []));
  const get = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
  const res = all('--re').length ? all('--re') : DEFAULT_RES.concat(all('--re+'));
  const chunk = Number(get('--chunk', DEFAULT_CHUNK));
  const L = await libs(root);
  const qaSrc = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  const R = extractKeys({ qaSrc, QO: L.QO, QP: L.QP, SC: L.SC, res, chunk });
  console.log(`qa-keys(${QA_KEYS_VERSION}): tests/qa.mjs の鍵 ${R.keys}・正規表現 ${R.res.join(' | ')} に合う範囲で選んだ ${R.selected.length}・`
    + `外した(版名を読む範囲) ${R.excludedVersion.length}・束 ${R.batches.length}(${R.batches.map((b) => b.length).join('/')} —— ${chunk} 鍵ずつ)`);
  for (const z of R.excludedVersion) console.log(`  外す ${z.id.padEnd(34)} ${z.why}`);
  if (argv.includes('--list')) { for (const b of R.batches) console.log(b.join(' ')); process.exit(0); }
  const outDir = path.resolve(get('--out-dir', path.join(process.env.TMPDIR || '/tmp', 'qa-keys-' + new Date().toISOString().replace(/[:.]/g, '').slice(0, 15))));
  fs.mkdirSync(outDir, { recursive: true });
  const files = R.batches.map((b, k) => { const f = path.join(outDir, `qa-keys-${k + 1}.txt`); fs.writeFileSync(f, b.join(' ') + '\n'); return f; });
  const doc = { version: QA_KEYS_VERSION, at: new Date().toISOString(), res: R.res, chunk, keys: R.keys, files: files.map((f) => path.basename(f)),
    selected: R.selected.map((z) => ({ id: z.id, line: z.line, span: [z.span[0] + 1, z.span[1]], match: z.match })), excludedVersion: R.excludedVersion, excludedAll: R.excluded.length, unmatched: R.unmatched };
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(doc, null, 1));
  const js = get('--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(doc, null, 1));
  console.log(`  → ${outDir}(${files.length} ファイル + index.json)`);
  console.log(`  beta: for f in ${outDir}/qa-keys-*.txt; do node tests/exp-w258c-qapart.mjs $(cat $f); done`);
  console.log(`  root: for f in ${outDir}/qa-keys-*.txt; do QA_TARGET=index.html node tests/exp-w258c-qapart.mjs $(cat $f); done`);
  process.exit(0);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main(process.argv.slice(2));

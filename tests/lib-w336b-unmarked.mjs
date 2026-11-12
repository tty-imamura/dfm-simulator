// 第336便b(統括の検証項目 R336 —— 第335便の統合の後の受け入れで、要約が種類の印のある行だけを数えていた): **印のない FAIL を数の外に置かない**。
//
// ■ 何が起きたか(第335便)
//   tools/post-merge-qa.sh の ① 静的受理は 518/526(FAIL 8 件)。要約は「刻印の型以外の違反 0 件(刻印の型 24 件 —— 鎖で直る)」と出た。
//   この数は種類の印 `〔違反の種類 w320d: 刻印の型以外 b 件・刻印の型 a 件〕`(tests/lib-w320d-lintkinds.mjs の markerOf)を出す 2 件
//   (lint.provenanceMeta・lint.canon304)だけの和で、**印のない 6 件**(lint.calauditMergeKeyHash・docs.d0sites-sync・docs.selfInertia-sync・
//   docs.kf0Ledger・lint.canon303・docs.uiText316)は数の外にいた。うち docs.uiText316(AI_SPEC §5 の逐語の 1 箇所)は鎖で直らない型で、
//   ゲートの beta のフル QA で初めて止まった。
//
// ■ 本 lib がすること(判定 PASS/FAIL は変えない —— 数と並びと一覧だけ)
//   ① `unmarkedRows(logText)` —— ログの印のない FAIL を**全件**、id・種類(文に刻印の型の語があれば 'stamp'・無ければ 'other')・理由の文の末尾
//      (TAIL_CHARS_336B 字 —— 末尾の所要 `[n.ns]` は外す)で返す(summarizeLog の unmarked と同じ集合・同じ順)。
//   ② `unmarkedFileText(logText, o)` —— 一覧のファイル(post-merge の `$LOG/1-unmarked.txt`・`$LOG/4-unmarked.txt`)の本文。
//   ③ `unmarkedNotice(n, label, file)` —— 要約の行に足す 1 句「・‼ ① の印のない FAIL を 1 件ずつ読むこと(一覧 <file>)」(0 件なら空)。
//   ④ `MARKED_KEYS_336B` —— 本便で detail に種類の印を付けた鍵(刻印の型の FAIL を出しうるのに印を出していなかった鍵 —— qa.mjs の add の detail が
//      lib の violationText を通る)。`markedPathStatic(qaSrc, ids)` が静的に照合する(QA lint.unmarkedFail336b ④)。
//   ⑤ `selfTest336b()` —— 合成のログ(印あり PASS/FAIL・印なし FAIL〔刻印の文あり/なし〕・PASS だけ・空)の自己試験。
// ■ CLI(post-merge-qa.sh が呼ぶ)
//   node tests/lib-w336b-unmarked.mjs --unmarked <log> --out <一覧のファイル> --label ①   → 要約の行に足す句を 1 行(0 件なら空行)・一覧を書く・終了コード 0
// ■ 規則: **印のない FAIL は 1 件ずつ理由の文を読む**(種類の数〔刻印の型以外 k 件〕には入っていない —— 数が 0 でも先へ進まない)。
// ■ しないこと: 判定しない・違反を足さない/消さない・印のない FAIL を推測で刻印の型に数えない(種類は文の語で付けた参考 —— 読むのは人)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const UNMARKED_VERSION_336B = 'w336b-unmarked-1';
export const TAIL_CHARS_336B = 120;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LK = await import(pathToFileURL(path.join(HERE, 'lib-w320d-lintkinds.mjs')).href);

/** 本便(第336便b)で detail に種類の印を付けた鍵(qa.mjs の順)。 */
export const MARKED_KEYS_336B = Object.freeze([
  'lint.pn1RegionDecl', 'docs.plutoStatesFile', 'docs.intakeC', 'docs.intakeD', 'docs.deimosSwap', 'docs.uranusSwap', 'docs.j1946adoptPublished', 'docs.families',
  'lint.calauditMergeKeyHash', 'docs.mappingRowsDeclared', 'docs.charonSeries', 'docs.charonKScan', 'docs.charonFactors', 'docs.d0audit-sync', 'docs.d0sites-sync',
  'docs.bgpredict-sync', 'docs.selfInertia-sync', 'docs.bgbudget-sync', 'docs.bgEquivalence', 'docs.bgCompose', 'docs.bgbudget2-sync', 'docs.mercuryDecomp',
  'docs.sphereKernel', 'docs.galaxyFieldContract', 'behavior.chainLedger', 'docs.nsLockBranch', 'docs.analogyLedger', 'behavior.bgTimeContract', 'behavior.bgRangeFlag',
  'behavior.clusterAnalogy', 'behavior.rayLensExcluded', 'behavior.clusterAnalogyW285', 'behavior.clusterScale', 'behavior.jeans2D', 'preset.layerAxisDecl',
  'behavior.tilt90LayersCopy', 'behavior.spinAxisDecl', 'behavior.tilt90Copy', 'behavior.weakfieldCoeff', 'docs.terminologyOpticalCamouflage', 'docs.calCause',
  'docs.coreCensus', 'behavior.coreRemovalGate', 'behavior.growthCopy', 'behavior.fixedCaptureContract', 'docs.charonInput', 'docs.analogyKernelNote',
  'docs.emgrid-sync', 'docs.geo3-sync', 'ui.assessedValuePanel', 'ui.obsCompareGraph', 'behavior.strainPure', 'behavior.dragProfilePure', 'docs.kf0Ledger',
  'docs.calContract', 'docs.geo1Contract', 'docs.pn1', 'docs.pn1Contract', 'behavior.pnSourceCompanion', 'behavior.coord3d298', 'behavior.drag3d298',
  'behavior.ref3d299', 'lint.canon303', 'docs.charonAudit305', 'docs.geo3Bin321b', 'lint.htmlPhys325a', 'behavior.axialRadius326d', 'docs.axialHeat326d',
  'behavior.axialSum327a', 'docs.axialSum327a', 'behavior.galaxis327b', 'docs.galaxis327b', 'behavior.axialDiff327e', 'docs.axialDiff327e', 'behavior.venusTide327f',
  'docs.venusTide327f', 'behavior.fieldContract328a', 'docs.fieldContract328a', 'behavior.response328b', 'docs.response328b', 'lint.venusCoverage328c',
  'behavior.spinBias329a', 'docs.spinBias329a', 'behavior.galRot329b', 'docs.galRot329b', 'lint.contractSeam329c', 'behavior.spinClass330a', 'docs.spinClass330a',
  'lint.dragWeight330b', 'behavior.dragWeight330b', 'docs.dragWeight330b', 'lint.coordTwist331a', 'behavior.coordTwist331a', 'docs.coordTwist331a',
  'behavior.centrifugal331b', 'docs.centrifugal331b', 'behavior.k1Scale331c', 'docs.k1Scale331c', 'behavior.eqBand332a', 'docs.eqBand332a', 'behavior.transGeo2332b',
  'docs.transGeo2332b', 'behavior.rotDiff333a', 'docs.rotDiff333a', 'behavior.axialField333b', 'docs.axialField333b', 'behavior.mercury3d333c', 'docs.mercury3d333c',
  'behavior.nonCirc333d', 'docs.nonCirc333d', 'behavior.heightLaw334a', 'docs.heightLaw334a', 'behavior.ledger334b', 'docs.ledger334b', 'behavior.mercuryNode334c',
  'docs.mercuryNode334c', 'behavior.binaryLaw334d', 'docs.binaryLaw334d', 'behavior.gridFloor334e', 'docs.gridFloor334e', 'behavior.carryLedger335b',
  'docs.carryLedger335b', 'behavior.mercuryCombo335c', 'docs.mercuryCombo335c', 'behavior.binaryTilt335d', 'docs.binaryTilt335d', 'behavior.moonApsis335e',
  'docs.moonApsis335e', 'behavior.elliptical335f', 'docs.elliptical335f'
]);
/** 第320便d・第335便までに印を出していた鍵(参考 —— 本便は変えていない)。 */
export const MARKED_KEYS_320D = Object.freeze(['lint.provenanceMeta', 'lint.regenScope', 'lint.stableHashPaths', 'lint.scopeAll312', 'lint.canon304']);

/** 行の detail(id の後ろ)から末尾の所要 [n.ns] を外し、末尾 n 字を返す(長ければ先頭に「…」)。 */
export function tailOf(detail, n) {
  const k = Number.isFinite(n) ? n : TAIL_CHARS_336B;
  const d = String(detail || '').replace(/\s+\[\d+(?:\.\d+)?s\]\s*$/, '').trim();
  return d.length > k ? '…' + d.slice(-k) : d;
}

/** 印のない FAIL を全件(summarizeLog の unmarked と同じ集合・同じ順)→ [{id, kind:'stamp'|'other', tail}]。 */
export function unmarkedRows(logText, o) {
  const rows = [];
  for (const line of String(logText || '').split('\n')) {
    const m = /^FAIL (\S+)(.*)$/.exec(line);
    if (!m || LK.MARKER_RE.test(line)) continue;
    rows.push({ id: m[1], kind: LK.classifyViolation(line), tail: tailOf(m[2], o && o.tail) });
  }
  return rows;
}

/** 種類の語(一覧の行の印)。 */
export const kindWord336b = (k) => (k === 'stamp' ? '〔文に刻印の型の語〕' : '〔文に刻印の型の語なし〕');

/** 一覧のファイルの本文。 */
export function unmarkedFileText(logText, o) {
  const label = (o && o.label) || '①', log = (o && o.log) || '';
  const rows = unmarkedRows(logText, o);
  const head = [`# post-merge ${label} の印のない FAIL ${rows.length} 件(${UNMARKED_VERSION_336B}${log ? ' —— ログ ' + log : ''})`,
    '# 種類の印 〔違反の種類 w320d: …〕 を出さない鍵の FAIL は「刻印の型以外の違反 k 件」の数に入らない —— 1 件ずつ理由の文を読んで分けること',
    '# 行: id 〔文に刻印の型の語 / 語なし〕(語は参考 —— 読むのは人)理由の文の末尾 ' + ((o && o.tail) || TAIL_CHARS_336B) + ' 字'];
  return head.concat(rows.map((r, i) => `${i + 1}. ${r.id} ${kindWord336b(r.kind)} ${r.tail}`)).join('\n') + '\n';
}

/** 要約の行に足す句(0 件なら空)。 */
export function unmarkedNotice(n, label, file) {
  return n > 0 ? `・‼ ${label || '①'} の印のない FAIL を 1 件ずつ読むこと(一覧 ${file})` : '';
}

/** 印を付けた鍵の detail が lib の violationText を通る経路を持つか(静的 —— add の呼び出しの範囲だけを見る)。 */
export function markedPathStatic(qaSrc, ids) {
  const src = String(qaSrc || ''), missing = [], noAdd = [];
  for (const id of ids || MARKED_KEYS_336B) {
    const i = src.indexOf("add('" + id + "'");
    if (i < 0) { noAdd.push(id); continue; }
    const e = src.indexOf('));', i);
    const seg = e < 0 ? '' : src.slice(i, e + 3);
    if (!(seg.indexOf('violationText(bad') >= 0 && seg.indexOf('lib-w320d-lintkinds.mjs') >= 0)) missing.push(id);
  }
  return { ok: !missing.length && !noAdd.length, n: (ids || MARKED_KEYS_336B).length, missing, noAdd };
}

/** 自己試験(合成のログ)。 */
export function selfTest336b() {
  const bad = [], cases = [];
  const S = '① meta.targetSha256 が検査対象の html と違う(器を走らせ直すこと)', O = 'AI_SPEC §5 に SYSTEM_PROMPT の逐語が無い';
  const mk = (bads) => LK.violationText(bads);
  const log = [
    'PASS lint.a  x' + mk([]),
    'FAIL lint.b  y' + mk([S, S]),
    'FAIL lint.c  z' + mk([O, S]),
    'FAIL docs.d  文 / **違反 1 件**: ' + S + '  [0.1s]',
    'FAIL docs.e  文 / **違反 1 件**: ' + O + '  [0.2s]',
    'PASS docs.f  文',
    'SKIP docs.g(beta 対象でない)',
    'FAIL docs.h  ' + 'あ'.repeat(300) + ' / **違反 1 件**: ①targetSha256 が現在の beta/index.html と違う(走行後に html が動いた)'].join('\n');
  const s = LK.summarizeLog(log), r = unmarkedRows(log);
  if (!(s.other === 1 && s.stamp === 3 && s.byLint.length === 2)) bad.push('(a) 印のある行の数(刻印の型以外 1・刻印の型 3)');
  if (JSON.stringify(s.unmarked) !== JSON.stringify([['docs.d', 'stamp'], ['docs.e', 'other'], ['docs.h', 'stamp']])) bad.push('(a) summarizeLog の印のない FAIL 全件 ' + JSON.stringify(s.unmarked));
  if (JSON.stringify(r.map((z) => [z.id, z.kind])) !== JSON.stringify(s.unmarked)) bad.push('(a) unmarkedRows と summarizeLog の集合・順');
  if (!(r[0].tail.endsWith('(器を走らせ直すこと)') && !/\[0\.1s\]/.test(r[0].tail) && r[2].tail.length === TAIL_CHARS_336B + 1 && r[2].tail.startsWith('…'))) bad.push('(a) 末尾の字(所要を外す・120 字に切る)');
  const onlyPass = 'PASS lint.a  x\nPASS lint.b  y' + mk([]);
  if (LK.summarizeLog(onlyPass).unmarked.length || unmarkedRows(onlyPass).length || LK.summarizeLog('').unmarked.length || unmarkedRows('').length) bad.push('(a) PASS だけ・空のログで印のない FAIL が出た');
  const ft = unmarkedFileText(log, { label: '①', log: '/tmp/x/1-preflight.log' });
  if (!(/印のない FAIL 3 件/.test(ft) && ft.indexOf('1. docs.d 〔文に刻印の型の語〕') >= 0 && ft.indexOf('2. docs.e 〔文に刻印の型の語なし〕 文 / **違反 1 件**: ' + O + '\n') >= 0 && ft.indexOf('3. docs.h') >= 0)) bad.push('(a) 一覧の本文');
  if (unmarkedNotice(0, '①', 'f') !== '' || unmarkedNotice(2, '④', '/l/4-unmarked.txt') !== '・‼ ④ の印のない FAIL を 1 件ずつ読むこと(一覧 /l/4-unmarked.txt)') bad.push('(a) 要約の句');
  cases.push('合成のログ 8 行(印あり PASS 1・印あり FAIL 2・印なし FAIL 3〔刻印の文 2・なし 1〕・PASS 1・SKIP 1)→ 印のない FAIL 3 件・PASS だけと空は 0 件');
  return { ok: !bad.length, bad, cases };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2), arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  if (argv.includes('--unmarked')) {
    const log = arg('--unmarked'), out = arg('--out'), label = arg('--label') || '①';
    let text = '';
    try { text = fs.readFileSync(log, 'utf8'); } catch (e) { console.log(''); process.exit(0); }
    const rows = unmarkedRows(text);
    if (out) fs.writeFileSync(out, unmarkedFileText(text, { label, log }));
    console.log(unmarkedNotice(rows.length, label, out || log));
    process.exit(0);
  }
  if (argv.includes('--self-test')) { const st = selfTest336b(); console.log(JSON.stringify(st, null, 1)); process.exit(st.ok ? 0 : 1); }
  console.error('使い方: node tests/lib-w336b-unmarked.mjs --unmarked <log> --out <file> --label ① | --self-test'); process.exit(2);
}

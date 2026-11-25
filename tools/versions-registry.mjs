#!/usr/bin/env node
// 第353便i(統括の検証項目 R473 —— 道具だけ・html は変えない): **版の番号の台帳**(tests/data-w353i-versions.json)を木と比べる・引き直す道具。
//   外からの点検で指摘された点: 版の照合を「正本の記録と名の型」で書く形(第344便f)は、lib と正本が一緒に版を上げると何版でも通る。
//   → 第353便以降の lib(tests/lib-w353*.mjs など —— 波の番号 ≥ 353)と器(tests/exp-w353*.mjs など)と、第352便za の lib・器の「期待する版の字」を 1 か所に持つ。
//   版の字は字句で読む: `export const LIB_VERSION = '…'`・`DOC_VERSION`・`HARNESS_VERSION`(import はしない —— 器を走らせない)。
//   正本(tests/out/*.json のうち、generator が台帳の器のもの)の `version` は器の HARNESS_VERSION・`libVersion` は台帳の lib の LIB_VERSION のどれか
//   (正本の target が台帳の lib ならその lib の版)と同じであること。事前検査の一時の写し(tests/.qa-preflight-<pid>.mjs)は読まない(tests/lib-w353i-qatemp.mjs)。
// 使い方:
//   node tools/versions-registry.mjs --check [--json]   … 台帳と木を比べる(終了コード 0 同じ / 1 違う / 2 読めない)
//   node tools/versions-registry.mjs --write            … 木から台帳を引き直す(統合のたびに統括が回す —— 名簿と同じ運用)
//   node tools/versions-registry.mjs --self-test        … 作りものの木で試す(QA lint.versionRegistry353i と同じ関数)
//   --root <dir>  木の置き場(既定はこのリポジトリ)
// 言わないこと: 「台帳で版の照合が厳しくなった」(版の字を 1 か所に書き、木と比べる道具を置くだけ)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const VERSIONS_REGISTRY_VERSION = 'w353i-versions-registry-1';
export const REGISTRY_PATH = 'tests/data-w353i-versions.json';
export const WAVE_FROM = 353;
export const EXTRA_NAMES = ['tests/lib-w352za-sconseq.mjs', 'tests/lib-w352za-sconseqdoc.mjs', 'tests/exp-w352za-sconseq.mjs'];
export const FIELDS = ['LIB_VERSION', 'DOC_VERSION', 'HARNESS_VERSION'];
const NAME_RE = /^(lib|exp)-w(\d{3})[a-z]*-[A-Za-z0-9_-]+\.mjs$/;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const QT = await import(pathToFileURL(path.join(HERE, '..', 'tests', 'lib-w353i-qatemp.mjs')).href);

/** 本文から版の字を読む(字句 —— `export const <名> = '…'` の形だけ) */
export function readVersions(text) {
  const o = {};
  for (const k of FIELDS) {
    const m = new RegExp('^export const ' + k + "\\s*=\\s*'([^'\\n]+)'", 'm').exec(String(text || ''));
    if (m) o[k] = m[1];
  }
  return o;
}

/** 台帳に載せる木のファイル(道の並び): 波の番号 ≥ WAVE_FROM の lib・器 + EXTRA_NAMES(在るものだけ) */
export function registryFiles(root) {
  let L = [];
  try { L = fs.readdirSync(path.join(root, 'tests')); } catch (e) { L = []; }
  const out = new Set();
  for (const f of L) {
    if (QT.isQaTempCopy(f)) continue;   // 事前検査の一時の写しは読まない
    const m = NAME_RE.exec(f);
    if (m && Number(m[2]) >= WAVE_FROM) out.add('tests/' + f);
  }
  for (const f of EXTRA_NAMES) if (fs.existsSync(path.join(root, f))) out.add(f);
  return [...out].sort();
}

/** 木を読む → { files: { 道: { LIB_VERSION?, DOC_VERSION?, HARNESS_VERSION? } } } */
export function scanTree(root) {
  const files = {};
  for (const f of registryFiles(root)) {
    let t = ''; try { t = fs.readFileSync(path.join(root, f), 'utf8'); } catch (e) { t = ''; }
    files[f] = readVersions(t);
  }
  return { files };
}

/** 台帳の形(書く中身) */
export function buildRegistry(scan) {
  return {
    version: 'w353i-versions-1',
    tool: 'tools/versions-registry.mjs',
    note: '第353便以降の lib・器(tests/lib-w353*.mjs・tests/exp-w353*.mjs など —— 波の番号 ≥ 353)と第352便za の lib・器の期待する版の字。統合のたびに node tools/versions-registry.mjs --write で引き直す(名簿と同じ運用)。QA lint.versionRegistry353i が木と比べる',
    waveFrom: WAVE_FROM,
    extra: EXTRA_NAMES.slice(),
    files: scan.files,
  };
}

/** 台帳と木の違い(配列 —— 空なら同じ) */
export function diffRegistry(reg, scan) {
  const d = [];
  const R = (reg && reg.files) || {}, S = scan.files;
  for (const f of Object.keys(S)) {
    if (!Object.prototype.hasOwnProperty.call(R, f)) { d.push('台帳に無い: ' + f); continue; }
    for (const k of FIELDS) if ((R[f][k] || null) !== (S[f][k] || null)) d.push('版の字が違う: ' + f + ' ' + k + ' 台帳 ' + (R[f][k] || '(無い)') + ' / 木 ' + (S[f][k] || '(無い)'));
  }
  for (const f of Object.keys(R)) if (!Object.prototype.hasOwnProperty.call(S, f)) d.push('木に無い: ' + f);
  return d;
}

/** 正本(tests/out/*.json)のうち generator が台帳の器のものを、台帳の版と比べる → { checked: [...], bad: [...] } */
export function outMismatches(root, reg) {
  const R = (reg && reg.files) || {}, checked = [], bad = [];
  const harn = new Set(Object.keys(R).filter((f) => R[f].HARNESS_VERSION));
  const libVers = new Set(Object.keys(R).map((f) => R[f].LIB_VERSION).filter(Boolean));
  let L = []; try { L = fs.readdirSync(path.join(root, 'tests', 'out')); } catch (e) { L = []; }
  for (const f of L.filter((x) => x.endsWith('.json')).sort()) {
    let J = null; try { J = JSON.parse(fs.readFileSync(path.join(root, 'tests', 'out', f), 'utf8')); } catch (e) { J = null; }
    const is353 = /-35[3-9][a-z]*\.json$|-3[6-9]\d[a-z]*\.json$/.test(f);
    if (!J || typeof J !== 'object') { if (is353) bad.push('正本が読めない: tests/out/' + f); continue; }
    const g = typeof J.generator === 'string' ? J.generator : null;
    if (!(g && harn.has(g)) && !is353) continue;
    checked.push('tests/out/' + f);
    if (!(g && harn.has(g))) { bad.push('正本 tests/out/' + f + ' の generator ' + g + ' が台帳の器に無い'); continue; }
    if (J.version !== R[g].HARNESS_VERSION) bad.push('正本 tests/out/' + f + ' の version ' + J.version + ' ≠ 台帳の ' + g + ' ' + R[g].HARNESS_VERSION);
    if ('libVersion' in J) {
      const tgt = typeof J.target === 'string' && R[J.target] && R[J.target].LIB_VERSION ? R[J.target].LIB_VERSION : null;
      if (tgt ? J.libVersion !== tgt : !libVers.has(J.libVersion)) bad.push('正本 tests/out/' + f + ' の libVersion ' + J.libVersion + ' ≠ 台帳の ' + (tgt ? J.target + ' ' + tgt : 'lib の版のどれか'));
    }
  }
  return { checked, bad };
}

/** 比べる(純関数に近い —— 木を読むだけ) */
export function checkRegistry(root) {
  let reg = null, readErr = null;
  try { reg = JSON.parse(fs.readFileSync(path.join(root, REGISTRY_PATH), 'utf8')); } catch (e) { readErr = String(e && e.message || e); }
  const scan = scanTree(root);
  if (!reg) return { ok: false, rc: 2, readErr, diff: [], outs: { checked: [], bad: [] }, files: Object.keys(scan.files).length };
  const diff = diffRegistry(reg, scan), outs = outMismatches(root, reg);
  const noVer = Object.keys(scan.files).filter((f) => !Object.keys(scan.files[f]).length);
  const ok = !diff.length && !outs.bad.length;
  return { ok, rc: ok ? 0 : 1, readErr: null, diff, outs, files: Object.keys(scan.files).length, noVer, registryVersion: reg.version };
}

/** 引き直す(台帳を書く) */
export function writeRegistry(root) {
  const reg = buildRegistry(scanTree(root));
  fs.writeFileSync(path.join(root, REGISTRY_PATH), JSON.stringify(reg, null, 1) + '\n');
  return reg;
}

/** 自己試験(作りものの木 —— 一時のディレクトリ) */
export function selfTest353i() {
  const rows = [];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w353i-vreg-'));
  const W = (f, t) => { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.writeFileSync(path.join(tmp, f), t); };
  try {
    W('tests/lib-w353q-a.mjs', "export const LIB_VERSION = 'w353q-a-lib-1';\n");
    W('tests/lib-w353q-adoc.mjs', "export const DOC_VERSION = 'w353q-adoc-1';\n");
    W('tests/exp-w353q-a.mjs', "export const HARNESS_VERSION = 'w353q-a-1';\n");
    W('tests/lib-w352za-sconseq.mjs', "export const LIB_VERSION = 'w352za-sconseq-lib-1';\n");
    W('tests/lib-w352y-old.mjs', "export const LIB_VERSION = 'w352y-old-lib-1';\n");   // 波 352(za の外)は載せない
    W('tests/.qa-preflight-77.mjs', "export const LIB_VERSION = 'w353q-copy-1';\n");   // 一時の写しは読まない
    W('tests/out/a-353q.json', JSON.stringify({ version: 'w353q-a-1', libVersion: 'w353q-a-lib-1', generator: 'tests/exp-w353q-a.mjs', target: 'tests/lib-w353q-a.mjs' }));
    writeRegistry(tmp);
    const c0 = checkRegistry(tmp);
    rows.push({ name: '引き直した直後は同じ(載るのは 4 本 —— 波 352 の y と一時の写しは載らない)', ok: c0.ok && c0.files === 4 && c0.outs.checked.length === 1 });
    W('tests/lib-w353q-a.mjs', "export const LIB_VERSION = 'w353q-a-lib-2';\n");
    const c1 = checkRegistry(tmp);
    rows.push({ name: 'lib の版だけを上げると台帳と違う(正本は台帳と同じ)', ok: !c1.ok && c1.diff.some((x) => /版の字が違う: tests\/lib-w353q-a\.mjs LIB_VERSION/.test(x)) && c1.outs.bad.length === 0 });
    W('tests/out/a-353q.json', JSON.stringify({ version: 'w353q-a-1', libVersion: 'w353q-a-lib-2', generator: 'tests/exp-w353q-a.mjs', target: 'tests/lib-w353q-a.mjs' }));
    const c2 = checkRegistry(tmp);
    rows.push({ name: 'lib と正本が一緒に版を上げても、台帳を引き直すまでは違う', ok: !c2.ok && c2.diff.length === 1 && c2.outs.bad.length === 1 });
    writeRegistry(tmp);
    rows.push({ name: '引き直すと同じ', ok: checkRegistry(tmp).ok });
    W('tests/exp-w354b-new.mjs', "export const HARNESS_VERSION = 'w354b-new-1';\n");
    const c3 = checkRegistry(tmp);
    rows.push({ name: '新しい器(波 354)が台帳に無い', ok: !c3.ok && c3.diff.some((x) => x === '台帳に無い: tests/exp-w354b-new.mjs') });
    fs.unlinkSync(path.join(tmp, 'tests/exp-w354b-new.mjs'));
    W('tests/out/b-353q.json', JSON.stringify({ version: 'w353q-z-1', generator: 'tests/exp-w353q-z.mjs' }));
    const c4 = checkRegistry(tmp);
    rows.push({ name: '第353便の正本の器が台帳に無い', ok: !c4.ok && c4.outs.bad.some((x) => /generator tests\/exp-w353q-z\.mjs が台帳の器に無い/.test(x)) });
    fs.unlinkSync(path.join(tmp, 'tests/out/b-353q.json'));
    fs.unlinkSync(path.join(tmp, 'tests/lib-w353q-adoc.mjs'));
    const c5 = checkRegistry(tmp);
    rows.push({ name: '台帳の lib が木に無い', ok: !c5.ok && c5.diff.some((x) => x === '木に無い: tests/lib-w353q-adoc.mjs') });
    fs.unlinkSync(path.join(tmp, REGISTRY_PATH));
    rows.push({ name: '台帳が無い → 終了コード 2', ok: checkRegistry(tmp).rc === 2 });
    rows.push({ name: '字句の読み(3 つの名・ほかの形は読まない)', ok: JSON.stringify(readVersions("export const LIB_VERSION = 'a-1';\nexport const DOC_VERSION='b-1';\nconst HARNESS_VERSION = 'c-1';\n")) === JSON.stringify({ LIB_VERSION: 'a-1', DOC_VERSION: 'b-1' }) });
  } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* 一時の木 */ } }
  return { version: VERSIONS_REGISTRY_VERSION, rows, ok: rows.every((r) => r.ok) };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2);
  const ri = argv.indexOf('--root');
  const root = ri >= 0 && argv[ri + 1] ? path.resolve(argv[ri + 1]) : path.resolve(HERE, '..');
  if (argv.includes('--self-test')) {
    const r = selfTest353i();
    for (const z of r.rows) console.log(`  ${z.ok ? 'ok' : 'NG'}  ${z.name}`);
    console.log(`versions-registry --self-test(${r.version}): ${r.ok ? 'OK' : 'NG'}(${r.rows.length} 通り)`);
    process.exit(r.ok ? 0 : 1);
  } else if (argv.includes('--write')) {
    const reg = writeRegistry(root);
    console.log(`versions-registry --write(${VERSIONS_REGISTRY_VERSION}): ${REGISTRY_PATH} に ${Object.keys(reg.files).length} 本を書いた`);
    for (const [f, v] of Object.entries(reg.files)) console.log(`  ${f}  ${Object.entries(v).map(([k, x]) => k + '=' + x).join('  ') || '(版の字なし)'}`);
    process.exit(0);
  } else if (argv.includes('--check')) {
    const c = checkRegistry(root);
    if (argv.includes('--json')) { console.log(JSON.stringify(c, null, 1)); process.exit(c.rc); }
    if (c.rc === 2) { console.log(`versions-registry --check: 台帳 ${REGISTRY_PATH} が読めない(${c.readErr})—— --write で作る`); process.exit(2); }
    console.log(`versions-registry --check(${VERSIONS_REGISTRY_VERSION}): ${c.ok ? '同じ' : '違う'} —— 木の lib・器 ${c.files} 本・正本 ${c.outs.checked.length} 本`
      + (c.noVer && c.noVer.length ? `・版の字が無い ${c.noVer.length} 本(${c.noVer.join('・')})` : ''));
    for (const x of c.diff.concat(c.outs.bad)) console.log('  ' + x);
    if (!c.ok) console.log('  → 統合の後なら node tools/versions-registry.mjs --write で引き直す(版を上げた lib・器と正本の組を確かめてから)');
    process.exit(c.rc);
  } else {
    console.log('使い方: node tools/versions-registry.mjs --check [--json] | --write | --self-test [--root <dir>]');
    process.exit(2);
  }
}

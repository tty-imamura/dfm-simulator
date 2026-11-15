#!/usr/bin/env node
// 第337便f(原仮定者の指示(恒久)「サンプルの変更だけでは、全行程を再実行しない」・決断事項 AN702・AN709・統括の検証項目 R342 —— 道具)—
//   **入力の指紋を読む部分(JSON の経路)に絞る**道具の口(tests/lib-w337f-jsonread.mjs)。**走らせない・正本を書かない**。
//
// 使い方:
//   node tools/jsonpaths337f.mjs --declared                 器の経路の宣言(`const JSON_READ_337F = [...]`)と段・正本の刻印の有無の一覧
//   node tools/jsonpaths337f.mjs --self-test                変異の試し(lib の mutationSelfTest337f —— QA lint.jsonPathInputs337f と同じ関数)と id の列の読みの試し
//   node tools/jsonpaths337f.mjs --replay <刻印の rev> <今の rev>
//        上流の正本を 2 つの版で読み、器の宣言の経路の指紋が同じか(= 経路の刻印があれば再利用だったか)を段ごとに出す(試算 —— 正本は書かない)
//   node tools/jsonpaths337f.mjs --compare <鎖の前の rev> [--keys a,b] [--json <file>]
//        **鎖の後に統括が回す 1 コマンド**: 宣言を変えた段(経路の宣言を持つ器の段・本便で宣言を変えた段)の正本の**物理の値**(tests/lib-w323b-quick.mjs の physSha ——
//        meta と壁時計の欄を除く)を鎖の前の rev と今の作業ツリーで比べる。初回の作り直しで物理の値が変わらないこと(宣言と meta だけが変わったこと)の記録。
//        終了コード: 0(全部同じ)/ 1(違う段がある —— 段ごとに理由を読む)/ 2(読めない)
//        第338便c(BL-090): 来歴の欄(列ごとの合流の鍵 mergeKey・壁時計 wallSec・持ち越しの刻印 carried.fromGeneratedAt・carried.fromTargetSha256)を除いて比べ、除いた欄の数を出力に書く
//   node tools/jsonpaths337f.mjs --compare-self-test        来歴の欄だけが違う写し → same・数値の欄が違う写し → diff(QA lint.jsonCompare338c と同じ関数)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const JR = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w337f-jsonread.mjs')).href);
const T = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
const SC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs')).href);

/** 本便で宣言を変えた段(経路の宣言のほか —— 文を読む段の宣言・偽の根を外した段)。 */
export const DECL_CHANGED_337F = Object.freeze(['pairnorm-305a', 'charonaudit-305e', 'charonfix-306e']);

/** 器の本文から経路の宣言を読む(1 行の JSON)。 */
export function readDecl337f(text) {
  const m = /^const JSON_READ_337F = (\[.*\]);\s*$/m.exec(String(text || ''));
  if (!m) return null;
  try { const d = JSON.parse(m[1]); return Array.isArray(d) ? d : null; } catch { return null; }
}
/** 経路の宣言を持つ器と段の一覧(表の段の cmd が器のパスを持つ)。 */
export function declaredSteps337f(root) {
  const out = [];
  for (const f of fs.readdirSync(path.join(root, 'tests')).filter((z) => /^exp-.*\.mjs$/.test(z)).sort()) {
    const rel = 'tests/' + f, d = readDecl337f(fs.readFileSync(path.join(root, rel), 'utf8'));
    if (!d) continue;
    const steps = T.REGEN_STEPS.filter((s) => s.role !== 'history' && String(s.cmd || '').split(/\s+/).includes(rel));
    out.push({ harness: rel, decl: d, steps: steps.map((s) => ({ key: s.key, outs: (s.outs || []).slice() })) });
  }
  return out;
}
const gitShow = (rev, file) => { try { return execFileSync('git', ['-C', ROOT, 'show', rev + ':' + file], { encoding: 'utf8', maxBuffer: 256 << 20 }); } catch { return null; } };

if (argv.includes('--declared')) {
  const rows = declaredSteps337f(ROOT);
  for (const r of rows) {
    console.log(`${r.harness}  宣言 ${r.decl.map((d) => d.file + '(' + d.paths.length + ' 経路' + (d.keyed ? '・id で引く ' + Object.keys(d.keyed).join(',') : '') + ')').join('; ')}`);
    for (const s of r.steps) for (const o of s.outs) {
      let m = null; try { m = JSON.parse(fs.readFileSync(path.join(ROOT, o), 'utf8')).meta; } catch { m = null; }
      const jr = m && m.jsonRead337f;
      console.log(`    ${s.key.padEnd(16)} ${o}  刻印 ${jr ? jr.version + '・行 ' + jr.rows.length + '・宣言の外 ' + jr.rows.reduce((a, z) => a + ((z.outside || []).length), 0) : 'なし(初回は走らせる —— 器の本文が変わったので次の鎖で作り直す)'}`);
    }
  }
  process.exit(0);
}
if (argv.includes('--self-test')) {
  const r = JR.mutationSelfTest337f();
  for (const z of r.table) console.log(`  ${z.got === z.want ? 'ok' : 'NG'}  ${z.name.padEnd(40)} 期待 ${z.want} / 判定 ${z.got}`);
  const TG = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w330c-toolguard.mjs')).href);
  const s2 = TG.idListSelfTest337f();
  for (const c of s2.cases) console.log('  ' + c);
  console.log(`jsonpaths337f --self-test(${r.version}・${s2.version}): ${r.ok && s2.ok ? 'OK' : 'NG —— ' + r.bad.concat(s2.bad).join(' / ')}`);
  process.exit(r.ok && s2.ok ? 0 : 1);
}
if (argv.includes('--compare-self-test')) {
  // 第338便c(BL-090): 来歴の欄だけが違う写し → same・数値の欄が違う写し → diff(QA lint.jsonCompare338c と同じ関数)
  const Q = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w323b-quick.mjs')).href), T338 = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w338c-tools.mjs')).href);
  const r = T338.compareSelfTest338c((x) => Q.physSha(x, 'tests/out/self-test-338c.json'));
  for (const [k, v] of Object.entries(r.gates)) console.log(`  ${v ? 'ok' : 'NG'}  ${k}`);
  console.log(`jsonpaths337f --compare-self-test(${r.version}): ${r.ok ? 'OK' : 'NG'}`);
  process.exit(r.ok ? 0 : 1);
}
if (argv.includes('--replay')) {
  const i = argv.indexOf('--replay'), a = argv[i + 1], b = argv[i + 2];
  if (!a || !b) { console.error('--replay <刻印の rev> <今の rev>'); process.exit(2); }
  const rows = [];
  for (const r of declaredSteps337f(ROOT)) for (const d of r.decl) {
    const ta = gitShow(a, d.file), tb = gitShow(b, d.file);
    if (ta === null || tb === null) { rows.push({ harness: r.harness, file: d.file, steps: r.steps.map((s) => s.key), verdict: 'na', why: '版に上流の正本が無い' }); continue; }
    const whole = ta === tb;
    const vol = T.volatilePathsOf(d.file);
    const sa = (() => { try { return SC.stableValueSha(JSON.parse(ta), vol); } catch { return null; } })(), sb = (() => { try { return SC.stableValueSha(JSON.parse(tb), vol); } catch { return null; } })();
    const fa = JR.pathsFingerprint337f(JSON.parse(ta), d), fb = JR.pathsFingerprint337f(JSON.parse(tb), d);
    const ov = JR.volatileOverlap337f(d, vol);
    const paths = fa.ok && fb.ok && fa.sha === fb.sha && !ov.length;
    rows.push({ harness: r.harness, file: d.file, steps: r.steps.map((s) => s.key), whole: whole ? 'same' : (sa && sa === sb ? 'stable-same' : 'diff'), paths: paths ? 'same' : 'diff',
      verdict: whole || (sa && sa === sb) ? 'reuse(ファイル丸ごとでも)' : paths ? '**reuse(経路の指紋で —— ファイル丸ごとなら走る)**' : 'run', why: fa.ok && fb.ok ? (ov.length ? '除外の重なり ' + ov[0] : null) : (fa.why || fb.why) });
  }
  for (const z of rows) console.log(`  ${z.verdict.padEnd(36)} ${z.file.padEnd(32)} ${z.harness.padEnd(34)} 段 ${z.steps.join(',')}${z.why ? '  (' + z.why + ')' : ''}`);
  const js = getArg('--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify({ version: JR.JSONREAD_VERSION_337F, stampRev: a, nowRev: b, rows }, null, 1));
  process.exit(0);
}
if (argv.includes('--compare')) {
  const rev = getArg('--compare', null);
  if (!rev) { console.error('--compare <鎖の前の rev>'); process.exit(2); }
  const Q = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w323b-quick.mjs')).href);
  const keysArg = getArg('--keys', null);
  const keys = keysArg ? keysArg.split(',') : [...new Set(declaredSteps337f(ROOT).flatMap((r) => r.steps.map((s) => s.key)).concat(DECL_CHANGED_337F))];
  const rows = [], stripped = {};
  const T338 = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w338c-tools.mjs')).href);
  for (const k of keys) {
    const st = T.REGEN_STEPS.find((s) => s.key === k);
    if (!st) { rows.push({ key: k, cat: 'na', why: '表に無い段' }); continue; }
    for (const o of (st.outs || [])) {
      const t0 = gitShow(rev, o);
      let J0 = null; try { J0 = t0 === null ? null : JSON.parse(t0); } catch { J0 = null; }
      // 第338便c(BL-090): 来歴の欄(列ごとの合流の鍵・壁時計・持ち越しの刻印 —— tests/lib-w338c-tools.mjs の PROV_KEYS_338C)を除いて比べる(除いた欄の数を行に残す)
      let J1 = null; try { J1 = JSON.parse(fs.readFileSync(path.join(ROOT, o), 'utf8')); } catch { J1 = null; }
      const s0 = J0 ? T338.stripProvenance338c(J0) : null, s1 = J1 ? T338.stripProvenance338c(J1) : null;
      const a = s0 ? Q.physSha(s0.value, o) : null, b = s1 ? Q.physSha(s1.value, o) : null;
      for (const sx of [s0, s1]) if (sx) for (const [kk, nn] of Object.entries(sx.removed)) stripped[kk] = (stripped[kk] || 0) + nn;
      let gen0 = null, gen1 = null;
      try { gen0 = J0 && J0.meta ? J0.meta.generatedAt || null : null; gen1 = JSON.parse(fs.readFileSync(path.join(ROOT, o), 'utf8')).meta.generatedAt || null; } catch { /* 無い */ }
      const cat = a === null || b === null ? 'na' : a === b ? 'same' : 'diff';
      rows.push({ key: k, out: o, cat, rerun: gen0 !== gen1, why: a === null ? '鎖の前の rev に正本が無い' : b === null ? '今の正本が読めない' : null });
    }
  }
  const n = (c) => rows.filter((z) => z.cat === c).length;
  console.log(`jsonpaths337f --compare ${rev}(物理の値 —— tests/lib-w323b-quick.mjs の physSha): same ${n('same')} / diff ${n('diff')} / na ${n('na')}・作り直した正本 ${rows.filter((z) => z.rerun).length}`);
  for (const z of rows) console.log(`  ${z.cat.padEnd(5)} ${String(z.key).padEnd(16)} ${z.out || ''}${z.rerun ? '' : '(作り直していない —— 刻印の時刻が同じ)'}${z.why ? '  ' + z.why : ''}`);
  console.log(`  除いた来歴の欄(第338便c —— 両方の版の数の和): ${Object.keys(stripped).length ? Object.entries(stripped).map(([kk, nn]) => kk + ' ' + nn).join('・') : 'なし'}`);
  const js = getArg('--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify({ version: JR.JSONREAD_VERSION_337F, rev, rows, strippedProvenance338c: { keys: T338.PROV_KEYS_338C, counts: stripped } }, null, 1));
  process.exit(n('diff') ? 1 : rows.length && n('na') === rows.length ? 2 : 0);
}
console.log('使い方: --declared / --self-test / --replay <刻印の rev> <今の rev> / --compare <鎖の前の rev> [--keys a,b] [--json f]');

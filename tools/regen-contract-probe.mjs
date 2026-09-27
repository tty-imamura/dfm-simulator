#!/usr/bin/env node
// 第283便e(原仮定者の裁定(第73報)AN29・AN32・統括の検証項目 R88)— **再生成契約の自己試験**(一時ディレクトリ・正本を書かない)。
//
//   AN29 … calaudit の非物理 meta を安定 hash から除く契約:
//     (i) 一時 root で「html だけ変わる再走」を模し(宣言した Pointer の値を全部書き換えた calaudit と diag)、calaudit を
//         入力にする現行の正本ごとに 今の刻印 / 今の宣言で刻み直した行 が一致するか・物理欄 1 つと diag の中身 1 つの変化を
//         見落とさないか(`an29Probe` —— QA `lint.stableHashPaths` ⑥ と同じ関数)
//     (ii) git の実物の組(既定 53aaa64→8b05232 = 既存 140 本 1 bit 不変の便の再走・8b05232→de9e39b = 物理が変わった便)で、
//         旧宣言/新宣言の安定 hash が一致するか(git が無ければ飛ばす)
//   AN32 … 説明文字列だけを領域から外す版 3:
//     (iii) `an32Probe`(内蔵の全プリセットの単体・⛄ の一時 html 5 種)
//     (iv) git の旧実装(既定 de9e39b の lib-w281a-scope.mjs)で引いた版 1・版 2 の領域 hash が、新しい lib の版 1・版 2 と
//          宣言した全器で一致するか(旧版の刻印は旧規則で照合される —— 元の実装と 1 字も違わない)
// 使い方: node tools/regen-contract-probe.mjs [--pairs 53aaa64:8b05232,8b05232:de9e39b] [--old-rev de9e39b] [--json <出力先>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PAIRS = getArg('--pairs', '53aaa64:8b05232,8b05232:de9e39b').split(',').filter(Boolean).map((z) => z.split(':'));
const OLD_REV = getArg('--old-rev', 'de9e39b');
const OUT = getArg('--json', null);
const SC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs')).href);
const RT = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs')).href);
const HTML = path.join(ROOT, 'beta', 'index.html');
const git = (args) => { try { return execFileSync('git', ['-C', ROOT].concat(args), { encoding: 'utf8', maxBuffer: 1 << 30 }); } catch { return null; } };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w283e-contract-'));
const t0 = Date.now();
const res = { an29: {}, an32: {} };
try {
  // (i)
  res.an29.probe = RT.an29Probe({ root: ROOT, tmpDir: path.join(tmp, 'an29'), stableJsonSha: SC.stableJsonSha, stableMatches: SC.stableMatches, STABLE_VERSION: SC.STABLE_VERSION });
  // (ii)
  const CAL = 'tests/out/calaudit-w249.json', DIAG = 'tests/out/calaudit-w249-diag.json';
  const vNew = RT.volatilePathsOf(CAL), vOld = vNew.filter((p) => !RT.V_CALAUDIT_META.includes(p)), vDiag = RT.volatilePathsOf(DIAG);
  res.an29.pairs = [];
  for (const [a, b] of PAIRS) {
    const A = git(['show', a + ':' + CAL]), B = git(['show', b + ':' + CAL]);
    const DA = git(['show', a + ':' + DIAG]), DB = git(['show', b + ':' + DIAG]);
    if (!A || !B) { res.an29.pairs.push({ a, b, skipped: 'git に無い' }); continue; }
    const JA = JSON.parse(A), JB = JSON.parse(B);
    res.an29.pairs.push({ a, b, oldDeclSame: SC.stableValueSha(JA, vOld) === SC.stableValueSha(JB, vOld),
      newDeclSame: SC.stableValueSha(JA, vNew) === SC.stableValueSha(JB, vNew),
      diagSame: (DA && DB) ? SC.stableValueSha(JSON.parse(DA), vDiag) === SC.stableValueSha(JSON.parse(DB), vDiag) : null });
  }
  // (iii)
  const decl = SC.readDeclaredScope(fs.readFileSync(path.join(ROOT, 'tests', 'exp-w277b-charondfm.mjs'), 'utf8'));
  res.an32.probe = SC.an32Probe({ html: HTML, decl, tmpDir: path.join(tmp, 'an32') });
  // (iv)
  const oldText = git(['show', OLD_REV + ':tests/lib-w281a-scope.mjs']);
  if (!oldText) res.an32.oldImpl = { skipped: 'git に無い: ' + OLD_REV };
  else {
    const base = pathToFileURL(path.join(ROOT, 'tests')).href + '/';
    const f = path.join(tmp, 'old-scope.mjs');
    fs.writeFileSync(f, oldText.replace(/(['"])\.\/(lib-[\w-]+\.mjs)\1/g, (m0, q, n) => q + base + n + q));
    const OLD = await import(pathToFileURL(f).href);
    const rows = await SC.declaredOuts(ROOT);
    const decls = [...new Map(rows.map((r) => [r.harness, r.decl])).entries()];
    let n = 0, same1 = 0, same2 = 0;
    const diff = [];
    for (const [h, d] of decls) {
      n++;
      const o1 = OLD.scopeHash(HTML, d, { version: 'w281a-scope-1' }).scopeSha256, n1 = SC.scopeHash(HTML, d, { version: 'w281a-scope-1' }).scopeSha256;
      const o2 = OLD.scopeHash(HTML, d, { version: 'w282e-scope-2' }).scopeSha256, n2 = SC.scopeHash(HTML, d, { version: 'w282e-scope-2' }).scopeSha256;
      if (o1 === n1) same1++; else diff.push(h + ' v1');
      if (o2 === n2) same2++; else diff.push(h + ' v2');
    }
    res.an32.oldImpl = { rev: OLD_REV, oldVersion: OLD.SCOPE_VERSION, decls: n, sameV1: same1, sameV2: same2, diff };
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
res.sec = +((Date.now() - t0) / 1000).toFixed(1);
const p = res.an29.probe, q = res.an32.probe;
console.log(`AN29(i): calaudit の Pointer ${p.calPointers}(合った位置 ${p.calHits})・diag ${p.diagPointers} / 下流 ${p.downstream} 本(安定 hash の刻印あり ${p.withStable})`
  + ` —— html だけの再走で 今の刻印のまま再利用 ${p.reusableOld}・刻み直せば ${p.reusableNew} / 物理欄 ${p.physPath} の変化を検出 ${p.physDetected}・diag ${p.diagPath} の変化を検出 ${p.diagDetected}・随伴の行の無い刻印は不一致 ${p.companionRequired}`
  + ` / 刻印が無く再利用できない(器が安定 hash を刻まない): ${p.needStamp.join(', ')}`);
for (const r of res.an29.pairs) console.log(`AN29(ii): ${r.a}→${r.b} ` + (r.skipped ? r.skipped : `旧宣言で同じ ${r.oldDeclSame}・新宣言で同じ ${r.newDeclSame}・diag ${r.diagSame}`));
console.log(`AN32(iii): 単体 ${q.u.presets} 本(説明文字列を持つ本 ${q.u.withProse}・欄 ${q.u.fields})—— 説明だけ変更で 版 3 同じ ${q.u.v3Same}・版 2 変わる ${q.u.v2Changed} / `
  + Object.entries(q.u.physical).map(([k, [a, b]]) => `${k} ${b}/${a} 変わる`).join('・'));
console.log('AN32(iii): ⛄ の一時 html —— ' + Object.entries(q.h).map(([k, v]) => `${k}: 版 3 ${v.v3Same ? '同じ' : '変わる'}・版 2 ${v.v2Same ? '同じ' : '変わる'}`).join(' / '));
const oi = res.an32.oldImpl;
console.log('AN32(iv): ' + (oi.skipped ? oi.skipped : `旧実装 ${oi.rev}(${oi.oldVersion})と新 lib の旧 2 版 —— 宣言 ${oi.decls} 器で 版 1 一致 ${oi.sameV1}・版 2 一致 ${oi.sameV2}` + (oi.diff.length ? ' 不一致 ' + oi.diff.join(',') : '')));
console.log(`所要 ${res.sec} s`);
if (OUT) fs.writeFileSync(path.resolve(OUT), JSON.stringify(res, null, 1));
const ok = p.reusableNew === p.withStable && p.reusableOld === 0 && p.physDetected && p.diagDetected && p.companionRequired && q.ok
  && (oi.skipped || (oi.sameV1 === oi.decls && oi.sameV2 === oi.decls));
process.exit(ok ? 0 : 1);

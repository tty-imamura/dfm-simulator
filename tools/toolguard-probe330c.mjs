#!/usr/bin/env node
// 第330便c(統括の検証項目 R309 —— 道具): **道具の照合の一致と physics の鍵の集合の守りの変異の試験**(走らせない・正本を書かない)。
//
//   node tools/toolguard-probe330c.mjs [--json <file>]
//     ① 道具の照合の規則(tests/lib-w281a-scope.mjs の toolCheckSelfTest330c —— 対象が html / lib × 領域一致 / 1 字違い)
//     ② 計画と lint の一致(一時の root の 4 段を planRegen に渡す —— a html・刻印だけ / b lib・刻印だけ〔第329便の chainledger の型〕/ c lib・領域 1 字違い / d 道具を計算に使う器)
//     ③ physics の鍵の集合の守りの判定(純関数 8 例)
//     ④ 計画の上の守り(名指しでない本に鍵を足した写し K・値だけの写し V・守りを切った K —— 名指しの段 n・宣言の表に無い読みを持つ段 u)
//   node tools/toolguard-probe330c.mjs --agree <plan.json> [--root <tree>] [--lib <tree>]
//     実物の正本で、計画(regen-plan の --out)と lint の道具の照合(lint.provenanceMeta の ④ と同じ条件)が揃うか —— 揃わなければ終了コード 1。
//     --root は正本と道具の木(既定はこのリポジトリ)・--lib は刻印の道具の lib を読む木(前後の比べ —— 旧の lib で同じ計画を見る)。
//   node tools/toolguard-probe330c.mjs --emit-html <dir>
//     変異の写し K(名指しでない本 plutoCharonReal の physics に鍵 w330cProbeKey)・V(同じ本の質量の最下位桁)を <dir>/htmlK.html・htmlV.html に書く
//     (`node tools/regen-plan.mjs --html <dir>/htmlK.html --base beta/_wNNN_base.html` で計画の全段の広さを見る)。
// 一時ファイルは TMPDIR の下(使い終わったら消す)。所要 15〜20 秒(--agree は正本の数だけ —— 数秒)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const imp = (root, f) => import(pathToFileURL(path.join(root, f)).href);
const TG = await imp(ROOT, 'tests/lib-w330c-toolguard.mjs');

if (argv.includes('--emit-html')) {
  const dir = path.resolve(getArg('--emit-html', '.'));
  fs.mkdirSync(dir, { recursive: true });
  const m = TG.mutateHtml330c(fs.readFileSync(path.join(ROOT, 'beta', 'index.html'), 'utf8'));
  if (!m.K || !m.V) { console.log('toolguard-probe330c --emit-html: 写しが作れない —— ' + m.why.join('・')); process.exit(1); }
  fs.writeFileSync(path.join(dir, 'htmlK.html'), m.K); fs.writeFileSync(path.join(dir, 'htmlV.html'), m.V);
  console.log(`toolguard-probe330c --emit-html: ${path.join(dir, 'htmlK.html')}(名指しでない本に physics の鍵)・${path.join(dir, 'htmlV.html')}(値だけ)`);
  process.exit(0);
}
if (argv.includes('--agree')) {
  const planFile = path.resolve(getArg('--agree', ''));
  const root = path.resolve(getArg('--root', ROOT)), lib = path.resolve(getArg('--lib', root));
  const RT = await imp(lib, 'tests/lib-w281a-regentable.mjs'), SC = await imp(lib, 'tests/lib-w281a-scope.mjs');
  const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  const r = TG.toolAgree330c({ root, plan, outsOf: (k) => (RT.REGEN_STEPS.find((z) => z.key === k) || { outs: [] }).outs, SC });
  const ng = r.rows.filter((z) => /NG/.test(z.lint));
  console.log(`toolguard-probe330c --agree(${SC.TOOL_CHECK_VERSION_330C || '旧の lib —— 第330便c の前'}): 道具の差がある正本 ${r.rows.length}・lint が落とす ${ng.length}・道具の照合で通した段 ${new Set(r.rows.filter((z) => z.toolChecked).map((z) => z.key)).size}`
    + ` —— ${r.agree ? '計画と lint が揃う' : '**食い違い**: 計画 reuse・lint が落とす ' + r.planReuseLintFail.join(',') + (r.planRegenLintOk.length ? ' / 計画 regen(道具)・lint は通す ' + r.planRegenLintOk.join(',') : '')}`);
  for (const z of ng) console.log(`  lint ${z.lint.padEnd(14)} 計画 ${String(z.own).padEnd(7)} ${z.key.padEnd(18)} ${z.out.replace('tests/out/', '')}`);
  const js = getArg('--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify({ plan: planFile, root, lib, agree: r.agree, planReuseLintFail: r.planReuseLintFail, planRegenLintOk: r.planRegenLintOk, rows: r.rows }, null, 1) + '\n');
  process.exit(r.agree ? 0 : 1);
}
const SC = await imp(ROOT, 'tests/lib-w281a-scope.mjs');
const out = {};
const t0 = Date.now();
out.toolCheck = SC.toolCheckSelfTest330c(ROOT, TG.SELFTEST_DECL_330C);
out.toolPlan = await TG.toolPlanSelfTest330c(ROOT, {});
out.physKeys = TG.physKeysSelfTest330c();
out.physKeysPlan = await TG.physKeysPlanSelfTest330c(ROOT, {});
const ok = Object.values(out).every((z) => z.ok);
for (const [k, z] of Object.entries(out)) { console.log(`${z.ok ? 'OK ' : 'NG '} ${k}: ${z.cases.join(' / ')}`); if (!z.ok) console.log('    ' + z.bad.join(' / ')); }
console.log(`toolguard-probe330c(${SC.TOOL_CHECK_VERSION_330C}・${TG.PHYSKEYS_GUARD_VERSION_330C}): ${ok ? 'OK' : 'NG'}(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
const js = getArg('--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(out, null, 1) + '\n');
process.exit(ok ? 0 : 1);

// 第323便c(決断事項 AN517・AN518・統括の検証項目 R277)—— **段 dragcore292 の簡易の窓**(器 tests/exp-w292c-dragcore.mjs の書き出した関数をそのまま使う写しの走行)。
//
// ■ なぜ別のファイルか
//   器 tests/exp-w292c-dragcore.mjs の開発用の窓 W292C_ONLY は「正本を書かずに終わる」(出力のファイルが無い —— 指紋が取れない)。器の本文に窓を足すと
//   器の sha が変わり、器を import する段(compose293・geo3-294a)まで鎖で走らせ直しになる。窓だけをこのファイルに置き、器の関数(gates・childTask)と
//   同じ順序(pinSplit302 → 純関数の自己試験 → 門 (b)〜(e) → 走行)で短く走らせる。**器の本文・既定の経路は 1 文字も変えない**。
//
// ■ 何をするか(1 プロセス・約 1 分)
//   ① 純関数の自己試験(LD.selfTest)・② 器の門 gates(HP)(エンジン ≡ 純関数・核の u・宣言・表)・
//   ③ 宣言の gain・宣言の dragCore で 8 公転(dt 0.016・窓 [0, 8])の走行 1 本(器の childTask —— 正本の段 sens・fit と同じ走行の関数)。
//   出力は W323C_DRAGCORE_OUT(必須 —— 正本を書かない)。時刻・所要の欄(generatedAt・wallSec・elapsedS)の外は同じ html・同じ Node で同じ数。
//
// ■ 言わないこと: 「窓で一致したので正本が同じ」(窓は 8 公転の 1 本と門だけ —— 27 公転のフィット・118 公転・感度・h/2 は輪番のフルで見る)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import * as LD from './lib-w292c-dragcore.mjs';
import { pinSplit302 } from './lib-w302h-splitrec.mjs';
import { HARNESS_VERSION as DRAGCORE_HARNESS_VERSION, RUN, gates, childTask } from './exp-w292c-dragcore.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const W323C_DRAGCORE_QUICK_VERSION = 'w323c-dragcorequick-1';
/** 窓の計画(器の RUN の dt と最初の窓 8 公転だけ) */
export const W323C_DRAGCORE_QUICK_PLAN = Object.freeze({ dt: RUN.dt, revMax: 8, spans: Object.freeze([Object.freeze([0, 8])]) });

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT = process.env.W323C_DRAGCORE_OUT;
  if (!OUT) throw new Error('W323C_DRAGCORE_OUT(窓の出力)が要る —— 窓は正本を書かない');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const pin302 = pinSplit302();
  const selfTest = LD.selfTest();
  const G = gates(HP);
  const gDecl = G.decl.gainDeclared;
  const plan = W323C_DRAGCORE_QUICK_PLAN;
  const t1 = Date.now();
  const run = childTask(HP, { key: 'quick-core8', kind: 'run', gain: gDecl, dragCore: undefined, dt: plan.dt, revMax: plan.revMax, spans: plan.spans.map((s) => s.slice()) });
  const runWallSec = (Date.now() - t1) / 1000;
  const out = { version: W323C_DRAGCORE_QUICK_VERSION, generator: 'tests/exp-w323c-dragcorequick.mjs', stage: 'dragcore292', harness: 'tests/exp-w292c-dragcore.mjs',
    harnessVersion: DRAGCORE_HARNESS_VERSION, target: TARGET, plan, stepOrderPin302: pin302, selfTest, gates: G, gainDeclared: gDecl, run, runWallSec,
    ok: selfTest.ok === true && G.ok === true && !run.nan };
  const CODE = ['tests/exp-w323c-dragcorequick.mjs', 'tests/exp-w292c-dragcore.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w293e-compose.mjs', 'tests/lib-w302a-wbg.mjs', 'tests/lib-w302h-splitrec.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第323便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: W323C_DRAGCORE_QUICK_VERSION, loadErrors: errors.length,
    reading: '統括の検証項目 R277(窓の無い大きい段の簡易の窓 —— 決断事項 AN517・AN518)', quick: true });
  out.elapsedS = (Date.now() - t0) / 1000;
  fs.mkdirSync(path.dirname(path.resolve(OUT)), { recursive: true });
  fs.writeFileSync(path.resolve(OUT), JSON.stringify(out, null, 1) + '\n');
  const w = run.windows && run.windows[0];
  console.log(`第323便c dragcore の窓: 自己試験 ${selfTest.ok}・門 ${G.ok}・8 公転 ${w ? 'Δϖ ' + w.dwRadPerPeri + '・近点周期 ' + w.apsPeriodYr + ' 年' : '—'} → ${path.relative(ROOT, path.resolve(OUT))}(${out.elapsedS.toFixed(1)} s)・ok ${out.ok}`);
  process.exit(out.ok ? 0 : 1);
}

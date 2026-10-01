// 第289便a(原仮定者の裁定(第79報)⑤「DFM について整理と修正を行なった。これを元に現状の実装を精査する」・統括の検証項目 R119)——
// **理論照合便の器**: 時計・光の弱場係数の検査・相対移動 r⁻³ 核の限定模型・現行実装の読み(PHYSICS〔第289便a〕の対応表の裏付け)。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む。**物理コードは html の本文そのまま**)
//   (A) 弱場の一次係数(tests/lib-w289a-weakfield.mjs —— 純関数): (i) 現行 E7R/E8R・(ii) 文字どおりの反比例・(iii) 第 3 案(実装しない)の
//       静止時計の率・光偏向(直線経路の求積とフェルマーの光線方程式の RK4)・シャピロ遅延の係数。解析と相対 1e-6(宣言の床)。
//   (B) 相対移動 r⁻³ 核の限定模型(同じ lib): Δϖ の解析 2π(√((1+a)/(1−2a))−1) と RK4・r 依存(GR の 6πGM/(c²r) と比べる)。
//   (C) **現行実装の実測**(html の関数をそのまま呼ぶ —— 法則は 1 文字も変えない):
//       ① 時計: ⏱️ gclock の写し(重い 1 体 + 軽い時計 2 個・すべて固定・kFrame 0・D₀ 0)で 1 步進めた後、`S.tauUpdate(i, 1)` の 1 回の増分を
//          e^{−κ W_ext}(倍精度で計算)と比べる。**S.tau・S.sumW・S.m は Float32** なので照合は Float32 の 2 ulp(2^−22)を門にする。
//       ② 光: 同じ写しで `traceRay`(E8R の実装そのもの —— 描画と V8 の共有の積分器)を衝突径数 b の水平の光線で走らせ、
//          偏向 α を Born の期待 4κMbX/((b²+ε²)√(X²+b²+ε²))(有限の経路 ±X・軟化 ε)と比べ、係数 α b/(κM) を出す。門: 相対 1e-4
//          (宣言 —— 二次の偏向は相対 ~(15π/16)κM/b ≈ 3×10⁻⁵)。
//       ③ 式の読み: `S.tauUpdate`・`traceRay`・`photonStep` の本文に ψ = W·κ・N = e^{−ψ}・n = e^{2ψ}(kU = 2κ)の綴りがあること・
//          `dfmPN1Delta` の本文に spin の語が無いこと(EIH はスピンを読まない)・frameWeightPow の既定(pull = 2)と share(= 1)。
//       ④ 枠の重みの棚卸し: 全プリセットの frameWeight(宣言の有無・在位/退役)と、銀河・星団アナロジー 6 本(🌚🧩🛸💮🌰🥜)の
//          frameWeight・geoPN・kFrame・spaceMesh.lawVersion・centerSpin・backgroundComplex の宣言。
//       ⑤ 記録の引用(**再測ではない**): `HP.grSI()`(🛰 grcal の式レベル出力 —— GPS・偏向・シャピロ)。
//
// ■ しないこと・言わないこと
//   ・html を書き換えない・法則を差し替えない・新しい核をエンジンに接続しない・🛰 の記録値を再測しない(引用だけ)。
//   ・「反比例則を実装した」「1PN と同等が証明された」「観測一致を再現した」と書かない。
//
// 実行(数秒・Chromium 不要・環境変数なし —— 既定で beta/index.html を読む。`QA_TARGET` で対象を替えられる):
//   node tests/exp-w289a-weakfield.mjs
// 読む正本: なし(html だけ)。正本: tests/out/weakfield-w289a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w289a-weakfield.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.frameWeightOf","HP.frameWeightPow","HP.grSI","HP.sim","HP.validatePreset","LAWS","T","ch","dfmPN1Delta","photonStep","rayField","rayHeavy","traceRay"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w289a-weakfield-h1';
/** 現行実装の実測の宣言(測る前に書いた)。 */
export const ENGINE = Object.freeze({ base: 'gclock', kappa: 1e-4, M: 1000, eps: 0.5, cLight: 100,
  clocks: Object.freeze([Object.freeze([50, 0]), Object.freeze([0, 200])]), clockMass: 1e-9,
  rays: Object.freeze([1e4, 2e4]), X: 1e6, dl: 10, f32Gate: 2 / 8388608, rayGate: 1e-4 });
/** 銀河・星団アナロジー(整理の複素核で動いているかを読む 6 本 —— 表示文は第289便f の担当)。 */
export const ANALOGY_IDS = Object.freeze(['galaxyAnalogyBH', 'galaxyAnalogyBHCompose', 'galaxyAnalogyBHTilt90', 'clusterAnalogyBH', 'clusterGrowthCopy', 'fixedCaptureCopy']);
/** 本文の綴り(式の読み —— 1 文字でも変われば器が落ちる)。 */
export const SOURCE_TOKENS = Object.freeze({
  tauUpdate: Object.freeze(['const psi=denom*S.params.kappaT;', 'const N=Math.exp(-psi), A=Math.exp(psi);', 'const denom=S.params.D0+WB+S.sumW[i];']),
  traceRay: Object.freeze(['kU=2*p.kappaT', 'const neff=Math.exp(kU*Wtot);', 'const Wtot=D0+WB+wSum']),
  photonStep: Object.freeze(['const neff=Math.exp(O.kU*Wtot);', 'const Wtot=O.D0+O.WB+_RF.w']),
});

const clone = (o) => JSON.parse(JSON.stringify(o));
const G = globalThis;

/** (C) ①② 現行の時計と光(gclock の写し)。 */
export function engineProbe(HP) {
  const E = ENGINE;
  const base = clone(HP.allPresets().find((p) => p.id === E.base));
  const p = Object.assign(base, {
    physics: Object.assign({}, base.physics, { G: 1, D0: 0, kFrame: 0, kappaT: E.kappa, cLight: E.cLight, geoPN: 0, softening: E.eps }),
    bodies: [{ type: 'single', m: E.M, radius: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true }]
      .concat(E.clocks.map(([x, y]) => ({ type: 'single', m: E.clockMass, radius: 0.1, x, y, vx: 0, vy: 0, spin: 0, pinned: true }))) });
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset: ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  const S = HP.sim;
  S.step(0.01);                                           // sumW・フレームの配列を 1 回作る(すべて固定 —— 位置は動かない)
  const e2 = E.eps * E.eps;
  const clocks = [];
  for (let i = 1; i < S.n; i++) {
    let W = 0;
    for (let j = 0; j < S.n; j++) { if (j === i) continue; const dx = S.x[i] - S.x[j], dy = S.y[i] - S.y[j]; W += S.m[j] / Math.sqrt(dx * dx + dy * dy + e2); }
    S.tau[i] = 0; S.tauUpdate(i, 1);
    const rate = S.tau[i], expect = Math.exp(-E.kappa * W), r = Math.hypot(S.x[i], S.y[i]);
    clocks.push({ i, r, W, psi: E.kappa * W, rate, expect, rel: Math.abs(rate / expect - 1), sumWf32: S.sumW[i], mClock: S.m[i] });
  }
  const rays = E.rays.map((b) => {
    const t0 = Date.now();
    const out = G.traceRay(S, -E.X, b, 1, 0, E.dl, Math.round(2 * E.X / E.dl), null);
    const alpha = -Math.atan2(out.cy, out.cx);
    const born = 4 * E.kappa * E.M * b * E.X / ((b * b + e2) * Math.sqrt(E.X * E.X + b * b + e2));
    return { b, alpha, born, rel: Math.abs(alpha / born - 1), coeff: alpha * b / (E.kappa * E.M), coeffFinite: (alpha / born) * 4,
      end: out.end, steps: out.steps, secondOrderRef: (15 * Math.PI / 16) * E.kappa * E.M / b, wallSec: (Date.now() - t0) / 1000 };
  });
  return { heavy: G.rayHeavy(S, 0), heavyClock: G.rayHeavy(S, 1), warnings: v.warnings || [], clocks, rays,
    clocksOk: clocks.every((c) => c.rel <= E.f32Gate), raysOk: rays.every((z) => z.rel <= E.rayGate && z.end === 'maxSteps') };
}

/** (C) ③ 式の読み(本文の綴り)。 */
export function sourceRead(HP) {
  const src = { tauUpdate: String(HP.sim.tauUpdate), traceRay: String(G.traceRay), photonStep: String(G.photonStep) };
  const tokens = Object.fromEntries(Object.entries(SOURCE_TOKENS).map(([k, list]) => [k, list.map((t) => ({ t, found: src[k].indexOf(t) >= 0 }))]));
  const eih = String(G.dfmPN1Delta);
  return { tokens, allFound: Object.values(tokens).every((l) => l.every((z) => z.found)),
    eihReadsSpin: /spin/i.test(eih), eihLen: eih.length,
    framePowDefault: HP.frameWeightPow({}), framePowShare: HP.frameWeightPow({ frameWeight: 'share' }), framePowPull: HP.frameWeightPow({ frameWeight: 'pull' }),
    frameDefault: HP.frameWeightOf({}) };
}

/** (C) ④ 枠の重みの棚卸し。 */
export function frameCensus(HP) {
  const all = HP.allPresets();
  const tally = {};
  for (const p of all) {
    const ph = p.physics || {}, retired = p.familyRole === 'retired';
    const k = (retired ? 'retired' : 'active') + ':' + (ph.frameWeight === undefined ? 'default(' + HP.frameWeightOf(ph) + ')' : ph.frameWeight);
    tally[k] = (tally[k] || 0) + 1;
  }
  const analogies = ANALOGY_IDS.map((id) => {
    const p = all.find((q) => q.id === id);
    if (!p) return { id, present: false };
    const ph = p.physics || {}, sm = ph.spaceMesh || null, bc = ph.backgroundComplex || null;
    return { id, present: true, emoji: p.emoji, sampleClass: p.sampleClass || null, frameWeight: HP.frameWeightOf(ph), pow: HP.frameWeightPow(ph),
      geoPN: ph.geoPN || 0, kFrame: ph.kFrame, lawVersion: sm ? (sm.lawVersion || null) : null, centerSpin: sm ? (sm.centerSpin || null) : null,
      bgcLaw: bc ? (bc.lawVersion || null) : null };
  });
  return { n: all.length, tally: Object.fromEntries(Object.keys(tally).sort().map((k) => [k, tally[k]])), analogies,
    analogiesShareP1: analogies.every((a) => a.present && a.frameWeight === 'share' && a.pow === 1),
    analogiesNoComplexP2: analogies.every((a) => a.present && a.bgcLaw !== 'complex-p2' && a.lawVersion !== 'complex') };
}

/** PHYSICS に載せる行(QA が正本から作り直して照合する)。 */
export function docRows(J) {
  const f = (x, d = 7) => x.toFixed(d), e = (x) => x.toExponential(2);
  const out = { coeff: [], kernelA: [], kernelR: [], engineClock: [], engineRay: [], analogy: [] };
  for (const r of J.coeffs) out.coeff.push(`| ${r.label} | ${f(r.clock)} | ${f(r.deflectionBorn)} | ${f(r.deflectionRay)} | ${f(r.shapiro)} | ${e(Math.max(r.relClock, r.relBorn, r.relRay, r.relShapiro))} |`);
  for (const s of J.kernel.sweep) out.kernelA.push(`| ${s.a} | ${e(s.dw)} | ${e(s.analytic)} | ${e(s.approx3pia)} | ${e(s.rel)} |`);
  for (const s of J.kernel.radial) out.kernelR.push(`| ${s.r0} | ${e(s.a)} | ${e(s.dw)} | ${e(s.gr)} | ${s.ratio.toFixed(4)} | ${s.powerLawRef.toFixed(4)} |`);
  for (const c of J.engine.clocks) out.engineClock.push(`| ${c.r.toFixed(0)} | ${e(c.psi)} | ${c.rate.toFixed(9)} | ${c.expect.toFixed(9)} | ${e(c.rel)} |`);
  for (const z of J.engine.rays) out.engineRay.push(`| ${z.b.toExponential(0)} | ${e(z.alpha)} | ${e(z.born)} | ${e(z.rel)} | ${z.coeffFinite.toFixed(5)} |`);
  for (const a of J.census.analogies) out.analogy.push(`| ${a.emoji} ${a.id} | ${a.frameWeight}(p=${a.pow}) | ${a.geoPN} | ${a.kFrame} | ${a.lawVersion} | ${a.centerSpin} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN) {
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const coeffs = L.coeffTable();
  for (const r of coeffs) console.log(`(A) ${r.key}: 時計 ${r.clock.toFixed(9)}・偏向 Born ${r.deflectionBorn.toFixed(9)} / 光線 ${r.deflectionRay.toFixed(9)}・シャピロ ${r.shapiro.toFixed(9)}・床内 ${r.withinFloor}`);
  const kernel = L.kernelTables();
  for (const s of kernel.sweep) console.log(`(B) a=${s.a}: Δϖ ${s.dw.toExponential(6)}・解析 ${s.analytic.toExponential(6)}・相対 ${s.rel.toExponential(2)}`);
  for (const s of kernel.radial) console.log(`(B) r0=${s.r0}: 核/GR ${s.ratio.toFixed(6)}(冪 (r_ref/r)² ${s.powerLawRef})`);
  const selfTest = L.selfTest();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const engine = engineProbe(HP);
  for (const c of engine.clocks) console.log(`(C①) r=${c.r}: τ̇ ${c.rate}・e^{−κW} ${c.expect}・相対 ${c.rel.toExponential(2)}`);
  for (const z of engine.rays) console.log(`(C②) b=${z.b}: α ${z.alpha.toExponential(6)}・Born ${z.born.toExponential(6)}・相対 ${z.rel.toExponential(2)}・係数 ${z.coeffFinite.toFixed(6)}`);
  const source = sourceRead(HP);
  console.log('(C③) ' + JSON.stringify({ allFound: source.allFound, eihReadsSpin: source.eihReadsSpin, pow: [source.framePowDefault, source.framePowShare] }));
  const census = frameCensus(HP);
  console.log('(C④) ' + JSON.stringify(census.tally) + ' アナロジー share p=1: ' + census.analogiesShareP1);
  const record = HP.grSI();
  const CODE = ['tests/exp-w289a-weakfield.mjs', 'tests/lib-w289a-weakfield.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第289便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.WEAKFIELD_LIB_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第79報)⑤: DFM について整理と修正を行なった。これを元に現状の実装を精査する(精査であって法則の差し替えではない)',
    reading: '統括の検証項目 R119(整理の各文と現行実装の対応表・時計/光の弱場係数の検査・相対移動 r⁻³ 核の限定模型・読みの固定 —— 物理不変・html の法則は 1 文字も変えない)',
    floor: L.FLOOR, strength: L.STRENGTH,
    notClaim: ['反比例則を実装した', '1PN と同等が証明された', '観測一致を再現した', '観測一致を達成した', '新しい法則を実装した', '複素場を接続した', '新発見'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  const out = { meta, laws: L.LAWS, units: L.UNITS, shapiroPath: L.SHAPIRO_PATH, rayPath: L.RAY_PATH, coeffs, kernelDecl: { a: L.KERNEL_A, r: L.KERNEL_R },
    kernel, selfTest, engineDecl: ENGINE, engine, source, census, record, recordNote: 'HP.grSI() の式レベル出力の引用(🛰 grcal —— 再測ではない)',
    elapsedS: (Date.now() - t0) / 1000 };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'weakfield-w289a.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/weakfield-w289a.json(' + out.elapsedS.toFixed(1) + ' s)');
}

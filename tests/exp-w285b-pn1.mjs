// 第285便b(原仮定者の裁定(第75報)⑦「現実較正 kF0 版: geoPN=1 の λ_PN=1 は GR の 1PN と同等の軌道になる想定。観測値で実行結果が
//   合わない場合は算出方法を調べつつ λ_PN=0 なども確認する」・統括の検証項目 R97/R98)—— **kF0 1PN 対照便の器**。
//
// ■ 何を測るか(Node だけ —— 対象 html と基点 html の inline script を tests/lib-w279b-headless.mjs で読み、物理コードは html の本文そのまま)
//   (A) 制御二体(R97 の条件: G=1・M=10・a=10・e=0.3・c=100・ε=0.01・両方 pnSource・自由・重心静止・dt 0.01・8 周・検出器 B):
//       質量比 q を 1e−4〜1 で振り、λ_PN=1 と 0 の近点移動の差を GR の主次数予測 6πGM/(c²a(1−e²)) と比べる。基点(旧 kF0 則 ——
//       試験粒子形 + ∇U 因子の対反作用)と現行(EIH 型)の両方。参照実装の相対二体 1PN の RK4 積分(抽出器を持たない照合先)と、
//       解析(旧則 1−10ν/3・EIH 1)を並べる。重心速度 V=3(c の 3%)のブースト・PPN の γ(pnAlpha 0.5/1.0)も同じ器で。
//   (B) 加速度の照合: 器の中の宇宙(源 2〜3・固定源・源でない受け手)で、html の `dfmPN1Delta`(差分 Δ)+ 試験粒子形の和と、
//       参照実装の EIH(全体の形)を相対 1e−12 で比べる。相対二体へ還元して Blanchet & Iyer の式と比べる。固定源 1 つの宇宙で Δ が厳密に 0。
//   (C) 参照実装の中の照合: EIH 型の運動方程式が PPN の N 体ラグランジアンの Euler–Lagrange 方程式から出ること(残差 ∝ c⁻⁴)。
//   (D) 保存量: 自由二体(q=0.5・c=100・ε=10⁻³・dt 10⁻³・2 周)で 1PN のエネルギー・運動量(Σ∂L/∂v)と Σm·v の振れ幅(現行・基点)。
//   (E) λ_PN=0 の対照: kF0 主系列(⚡✴️💫🧮🩺🧶 の kF0 診断コピー・☄️・❄️ の kF0 診断コピー)と kF0 の本(✨🌟📻📿)を calaudit の
//       `__w249build(id, true)` と同じ規則で組み、同じ窓で λ=1(現行・基点)と λ=0 を走らせる。近点移動の λ 増分を各本の接触要素から
//       作る GR の主次数予測と比べ、観測(正本 calaudit-w249.json の近点移動の行の obs)との残差を並べる。**較正ではない**(診断)。
//   (F) 水星(R98): ☄️ mercuryReal の ε 0.05/0.01・dt 0.016/0.008 × λ 0/1 の 8 周・検出器 B。Plummer 軟化の主次数の逆行
//       −3πε²/(a²(1−e²)²)・cLight=30000 の丸め((c_true/30000)² —— c_true=299792.458 km/s を 1 単位 10 km/s で)を数で示す。
//   (G) 前後: 内蔵全本を基点 html と現行 html で 1 歩と 128 歩(dt=DT)走らせ、位置・速度・自転をビットで比べる。署名(presetSig)も。
//
// ■ 測定演算子: 近点移動は正式の判定器 `tests/exp-w249b-calaudit.mjs` のページ側ヘルパ(近点抽出 A/B・近点位相の直線 fit)を
//   **ソースの文字列のまま**取り出して評価する(`extractCalauditHelpers` —— 写しを持たない)。
//
// ■ 言わないこと: 「λ_PN=1 で既に 1PN と合った」「不足は DFM の新現象」「観測一致を達成した」「較正を完了した」「kF0 版が成立した」
//   「精度を上げれば成立する」。Σm·v は状態変数の和で、相対論的な全運動量ではない。
//
// 環境変数: `W285B_BASE_REV`(基点の版 —— 既定 b92ffa1)/ `W285B_BASE_HTML`(基点 html を既に持っているときのパス・ROOT 相対)/
//   `QA_TARGET`(対象 html —— 既定 beta/index.html)。読む正本: tests/out/calaudit-w249.json(観測の近点移動 —— 段 kf0 の後)。
// 実行: node tests/exp-w285b-pn1.mjs
// 出力: tests/out/pn1-w285b.json(来歴 w272e-1・領域 hash つき)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { extractCalauditHelpers, softeningAnalyticDeg, arcsecPerCenturyToDegPerOrbit } from './lib-w280a-mercury.mjs';
import * as G1 from './lib-w282b-geo1.mjs';
import * as L283 from './lib-w283a-geomode.mjs';
import * as O from './lib-w285b-gr1pn.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の規約: この器が読む html の領域(1 行の JSON —— `lint.regenScope` が機械の下限と照合する)
const REGEN_SCOPE = {"presets":"all","roots":["DT","GEO_CORE_PN","GEO_MODE_VERSION","HP.allPresets","HP.coreState","HP.loadPreset","HP.sim","HP.validatePreset","PN1_CONTRACT","PN1_EIH_VERSION","RAY_ALPHA_MIN","dfmPN1Delta","dfmPN1EIHKick","geoCoreDispatch","geoModeOf","pnSource","presetSig","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'pn1-w285b.json');
const CALAUDIT = 'tests/exp-w249b-calaudit.mjs';
const CAL_JSON = 'tests/out/calaudit-w249.json';
export const HARNESS_VERSION = 'w285b-pn1-1';
const BASE_REV = process.env.W285B_BASE_REV || 'b92ffa1';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
const t0 = Date.now();
const log = (...a) => console.error('[w285b]', ((Date.now() - t0) / 1000).toFixed(0) + 's', ...a);
const J = (o) => JSON.stringify(o);
const DEG = 180 / Math.PI;
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');

// ---------------------------------------------------------------- 文脈(現行 HN と基点 HB)
const htmlAbs = path.join(ROOT, TARGET);
let baseAbs, tmpDir = null;
if (process.env.W285B_BASE_HTML) baseAbs = path.join(ROOT, process.env.W285B_BASE_HTML);
else {
  tmpDir = fs.mkdtempSync(path.join(ROOT, 'tests', 'out', '.w285b-pn1-'));
  baseAbs = path.join(tmpDir, 'base.html');
  fs.writeFileSync(baseAbs, execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':beta/index.html'], { maxBuffer: 64 << 20 }));
}
const baseSha = sha(baseAbs), nowSha = sha(htmlAbs);
const HN = loadHtmlHeadless(htmlAbs);
const HB = loadHtmlHeadless(baseAbs);
if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
if (!HN.HP || !HB.HP) throw new Error('HP が無い');
const DT = HN.evalExpr('DT');
const calSrc = fs.readFileSync(path.join(ROOT, CALAUDIT), 'utf8');
const helperBody = extractCalauditHelpers(calSrc);
const PERI_WINDOW = Number((calSrc.match(/const PERI_WINDOW = (\d+);/) || [])[1]);
const HOOK = `(function(){
  const ORIG = window.__w249build;
  window.__w285bVariants = {};
  window.__w249build = (id, kFrame0) => {
    const V = window.__w285bVariants[id];
    if (!V) return ORIG(id, kFrame0);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(V)));
    if (!v.ok) throw new Error('器の中の宇宙が受理されない: ' + id + ' / ' + JSON.stringify(v.errors || ''));
    HP.sim.build(v.preset);
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset), kFrameApplied: (v.preset.physics || {}).kFrame };
  };
  // 内蔵の診断コピー(calaudit の規則そのもの)を JSON で返す(λ だけ差し替えて変種を作るため)
  window.__w285bCopy = (id, kFrame0) => { const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (kFrame0 === true) { p.physics = p.physics || {}; p.physics.kFrame = 0; if (p.physics.geoPN === 2) p.physics.geoPN = 1; }
    return p; };
})()`;
for (const H of [HN, HB]) { H.evalExpr('(function(PERI_WINDOW){' + helperBody + '})(' + PERI_WINDOW + ')'); H.evalExpr(HOOK); }
const runPeri = (H, p, dt, orbMax) => {
  H.evalExpr(`window.__w285bVariants[${J(p.id)}] = ${J(p)};`);
  const b0 = H.evalExpr(`window.__w249build(${J(p.id)}, false)`);
  const Gv = H.evalExpr('HP.sim.params.G'), c = H.evalExpr('HP.sim.params.cLight');
  const tg = [{ ci: b0.map[0], oi: b0.map[1], label: p.id }];
  const osc0 = H.evalExpr(`window.__w249osc0(${tg[0].ci}, ${tg[0].oi}, ${Gv})`);
  const maxSteps = Math.ceil((orbMax + 1.5) * osc0.P / dt);
  const r = H.evalExpr(`window.__w249run(${J(p.id)}, ${dt}, ${maxSteps}, ${J(tg)}, ${orbMax}, ${Gv}, false)`);
  const t = r.targets[0];
  return { B: t.B.slopeDeg, A: t.A.slopeDeg, nB: t.B.nPeri, nA: t.A.nPeri, perFit: t.B.perMeanFit, nan: r.nan, clamp: r.clamp, steps: r.steps,
    osc0: { a: osc0.a, e: osc0.e, P: osc0.P, mu: osc0.mu }, c,
    grDeg: DEG * G1.gr1pnAdvanceRad({ GM: osc0.mu, c, a: osc0.a, e: osc0.e }) };
};
const lamVariant = (p, lam, id) => { const q = JSON.parse(J(p)); q.id = id; q.physics = Object.assign({}, q.physics, { lambdaPN: lam }); return q; };

// ---------------------------------------------------------------- (A) 制御二体
const A = { cond: { G: 1, M: 10, a: 10, e: 0.3, c: 100, eps: 0.01, dt: 0.01, orbits: 8, detector: 'B', sources: 'both pnSource・both free・barycentre at rest' },
  rows: [], boost: [], ppn: [] };
{
  const C = A.cond;
  const mk = (q, lam, extra) => { const m1 = C.M / (1 + q), m2 = C.M * q / (1 + q);
    const p = G1.boundBinary({ id: 'w285b_bin_' + String(q).replace('.', 'p') + '_' + lam + (extra && extra.tag ? '_' + extra.tag : ''), m1, m2, a: C.a, e: C.e, G: C.G, lambdaPN: lam, geoPN: 1,
      V: extra && extra.V, physics: Object.assign({ cLight: C.c, softening: C.eps, softeningFloor: C.eps }, (extra && extra.physics) || {}) });
    return p; };
  for (const q of [1e-4, 1e-3, 0.01, 0.1, 0.25, 0.5, 1]) {
    const n1 = runPeri(HN, mk(q, 1), C.dt, C.orbits), n0 = runPeri(HN, mk(q, 0), C.dt, C.orbits), b1 = runPeri(HB, mk(q, 1), C.dt, C.orbits);
    const b0 = (q === 1 || q === 1e-4) ? runPeri(HB, mk(q, 0), C.dt, C.orbits) : null;
    const m1 = C.M / (1 + q), m2 = C.M * q / (1 + q), nuDecl = m1 * m2 / (C.M * C.M);
    const gr = n0.grDeg;
    const orE = O.relOrbitAdvance({ GM: n0.osc0.mu, nu: nuDecl, c: C.c, a: n0.osc0.a, e: n0.osc0.e, orbits: 8, stepsPerOrbit: 4000, law: 'eih' });
    const orG = O.relOrbitAdvance({ GM: n0.osc0.mu, nu: nuDecl, c: C.c, a: n0.osc0.a, e: n0.osc0.e, orbits: 8, stepsPerOrbit: 4000, law: 'geo2' });
    const or0 = O.relOrbitAdvance({ GM: n0.osc0.mu, nu: nuDecl, c: C.c, a: n0.osc0.a, e: n0.osc0.e, orbits: 8, stepsPerOrbit: 4000, law: 'eih', lambda: 0 });
    A.rows.push({ q, nu: nuDecl, grDeg: gr, osc0: n0.osc0,
      now: { lam1B: n1.B, lam0B: n0.B, lam1A: n1.A, lam0A: n0.A, nB: n1.nB }, base: { lam1B: b1.B, lam1A: b1.A, lam0B: b0 ? b0.B : null },
      lam0BitSameBase: b0 ? b0.B === n0.B : null,
      ratioNowB: (n1.B - n0.B) / gr, ratioNowA: (n1.A - n0.A) / gr, ratioBaseB: (b1.B - n0.B) / gr, ratioBaseA: (b1.A - n0.A) / gr,
      analyticOld: O.analyticRatio('geo2', nuDecl), analyticNew: 1,
      oracleNew: (orE.advDeg - or0.advDeg) / gr, oracleOld: (orG.advDeg - or0.advDeg) / gr,
      nan: n1.nan || n0.nan || b1.nan, clamp: n1.clamp + n0.clamp + b1.clamp });
    const z = A.rows[A.rows.length - 1];
    log(`(A) q=${q} ν=${nuDecl.toFixed(5)}: 基点 ${z.ratioBaseB.toFixed(5)}(解析 1−10ν/3 ${z.analyticOld.toFixed(5)}・RK4 ${z.oracleOld.toFixed(5)})→ 現行 ${z.ratioNowB.toFixed(5)}(RK4 ${z.oracleNew.toFixed(5)})`);
  }
  // 重心のブースト V=3(c の 3%)—— 比は V に依らないはず(相対論的な二体の 1PN は重心の一様運動に依らない)
  for (const q of [1, 0.1]) for (const H of [['now', HN], ['base', HB]]) {
    const r1 = runPeri(H[1], mk(q, 1, { V: 3, tag: 'V3' }), C.dt, C.orbits), r0 = runPeri(H[1], mk(q, 0, { V: 3, tag: 'V3' }), C.dt, C.orbits);
    const s1 = runPeri(H[1], mk(q, 1), C.dt, C.orbits), s0 = runPeri(H[1], mk(q, 0), C.dt, C.orbits);
    A.boost.push({ q, html: H[0], V: 3, ratioV: (r1.B - r0.B) / s0.grDeg, ratioRest: (s1.B - s0.B) / s0.grDeg, nan: r1.nan || r0.nan });
  }
  // PPN の γ(pnAlpha 0.5 → γ=0・1.0 → γ=0.5): 比 (1+2γ)/3 が ν に依らない
  for (const alpha of [0.5, 1.0]) for (const q of [1e-4, 1]) {
    const ph = { pnAlpha: alpha };
    const r1 = runPeri(HN, mk(q, 1, { physics: ph, tag: 'a' + alpha }), C.dt, C.orbits), r0 = runPeri(HN, mk(q, 0, { physics: ph, tag: 'a' + alpha }), C.dt, C.orbits);
    const gam = alpha - 0.5, pred = O.analyticRatio('eihPPN', 0, gam);
    A.ppn.push({ alpha, gamma: gam, q, ratio: (r1.B - r0.B) / r0.grDeg, predicted: pred, relToPred: (r1.B - r0.B) / r0.grDeg / pred - 1 });
  }
  const rq = (q) => A.rows.find((z) => z.q === q);
  A.summary = { reproBase: { q1e4: rq(1e-4).ratioBaseB, q1: rq(1).ratioBaseB }, now: { q1e4: rq(1e-4).ratioNowB, q1: rq(1).ratioNowB },
    minNow: Math.min(...A.rows.map((z) => z.ratioNowB)), maxDevNow: Math.max(...A.rows.map((z) => Math.abs(z.ratioNowB - 1))),
    maxDevNowVsOracle: Math.max(...A.rows.map((z) => Math.abs(z.ratioNowB - z.oracleNew))),
    maxDevBaseVsOracle: Math.max(...A.rows.map((z) => Math.abs(z.ratioBaseB - z.oracleOld))),
    testLimitNowMinusBase: rq(1e-4).ratioNowB - rq(1e-4).ratioBaseB, testLimitAnalytic: 10 * rq(1e-4).nu / 3 };
  log(`(A) 再現(基点): q=1e−4 ${A.summary.reproBase.q1e4.toFixed(4)}・q=1 ${A.summary.reproBase.q1.toFixed(4)} → 現行 ${A.summary.now.q1e4.toFixed(5)}・${A.summary.now.q1.toFixed(5)}`);
}

// ---------------------------------------------------------------- (B) 加速度の照合(html の Δ + 試験粒子形 vs 参照実装の EIH)
const Bk = { cases: [] };
{
  const phys = (o) => Object.assign({ G: 1, cLight: 30, softening: 0.05, softeningFloor: 1e-9, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0,
    lambdaPN: 1, pnAlpha: 1.5, stateCarry: 'double', frameWeight: 'share', timeScale: 1, massFloor: 1e-9, geoPN: 1 }, o || {});
  const uni = (id, bodies, ph) => ({ id, name: id, emoji: '🧪', description: '第285便b 器の中の宇宙(内蔵ではない)', sampleClass: 'principle',
    world: { boundary: 'none', size: 0 }, camera: { scale: 20 }, physics: phys(ph), bodies: bodies.map((b) => Object.assign({ type: 'single', spin: 0, radius: 0.1, pinned: false }, b)) });
  const CASES = [
    { key: 'two-free', label: '自由な源 2(質量比 3/1)', u: uni('w285b_b2', [{ m: 30, x: 0, y: 0, vx: 0.1, vy: -0.3, pnSource: true }, { m: 10, x: 9, y: 2, vx: -0.3, vy: 0.9, pnSource: true }]) },
    { key: 'three-free', label: '自由な源 3', u: uni('w285b_b3', [{ m: 30, x: 0, y: 0, vx: 0.1, vy: -0.2, pnSource: true }, { m: 10, x: 8, y: 1, vx: -0.2, vy: 0.6, pnSource: true }, { m: 5, x: -5, y: 6, vx: 0.5, vy: 0.3, pnSource: true }]) },
    { key: 'pinned-one', label: '固定源 1 + 源でない受け手 2(Δ は厳密に 0)', u: uni('w285b_bp', [{ m: 30, x: 0, y: 0, vx: 0, vy: 0, pinned: true, pnSource: true }, { m: 1e-6, x: 9, y: 2, vx: -0.3, vy: 1.6, pnSource: false }, { m: 1e-6, x: -7, y: 3, vx: 0.4, vy: -1.2, pnSource: false }]), zero: true },
    { key: 'free-one-test', label: '自由な源 1 + 源でない受け手 1(🌙 型)', u: uni('w285b_b1', [{ m: 30, x: 0, y: 0, vx: 0.05, vy: -0.02, pnSource: true }, { m: 1e-3, x: 9, y: 2, vx: -0.3, vy: 1.6, pnSource: false }]) },
    { key: 'pinned-plus-free', label: '固定源 1 + 自由な源 1 + 受け手 1(🔆 型)', u: uni('w285b_bpf', [{ m: 30, x: 0, y: 0, pinned: true, pnSource: true, vx: 0, vy: 0 }, { m: 3, x: 10, y: 0, vx: 0, vy: 1.7, pnSource: true }, { m: 1e-6, x: 10.6, y: 0, vx: 0, vy: 2.5, pnSource: false }]) },
    { key: 'ppn-gamma0', label: '自由な源 3・pnAlpha 0.5(γ=0)', u: uni('w285b_bg0', [{ m: 30, x: 0, y: 0, vx: 0.1, vy: -0.2, pnSource: true }, { m: 10, x: 8, y: 1, vx: -0.2, vy: 0.6, pnSource: true }, { m: 5, x: -5, y: 6, vx: 0.5, vy: 0.3, pnSource: true }], { pnAlpha: 0.5 }), gamma: 0 },
  ];
  for (const cs of CASES) {
    const st = HN.evalExpr(`(()=>{ const v=HP.validatePreset(${J(cs.u)}); if(!v.ok) return {err:JSON.stringify(v.errors)};
      HP.sim.build(v.preset); const S=HP.sim, n=S.n, DX=new Float64Array(n), DY=new Float64Array(n);
      const nAny=dfmPN1Delta(S,DX,DY);
      return { n, nAny, DX:Array.from(DX), DY:Array.from(DY), m:Array.from(S.mEff.subarray(0,n)), x:Array.from(S.x.subarray(0,n)), y:Array.from(S.y.subarray(0,n)),
        vx:Array.from(S.vx.subarray(0,n)), vy:Array.from(S.vy.subarray(0,n)), pin:Array.from(S.pinned.subarray(0,n)).map(Boolean),
        src:[...Array(n).keys()].map((i)=>pnSource(S,i)), eps:S.params.softening, c:S.params.cLight, G:S.params.G, lam:S.params.lambdaPN, alpha:S.params.pnAlpha }; })()`);
    if (st.err) { Bk.cases.push({ key: cs.key, err: st.err }); continue; }
    const bodies = st.m.map((m, i) => ({ m, x: st.x[i], y: st.y[i], vx: st.vx[i], vy: st.vy[i], source: st.src[i], pinned: st.pin[i] }));
    const o = { G: st.G, c: st.c, lambda: st.lam, gamma: st.alpha - 0.5, eps: st.eps };
    const full = O.eihAccel(bodies, o), tf = O.testFormSum(bodies, o);
    let maxAbs = 0, maxPn = 0;
    for (let i = 0; i < st.n; i++) {
      maxAbs = Math.max(maxAbs, Math.hypot(tf[i].ax + st.DX[i] - full[i].pnx, tf[i].ay + st.DY[i] - full[i].pny));
      maxPn = Math.max(maxPn, Math.hypot(full[i].pnx, full[i].pny));
    }
    const deltaZero = st.DX.every((v) => v === 0) && st.DY.every((v) => v === 0);
    Bk.cases.push({ key: cs.key, label: cs.label, n: st.n, sources: st.src.filter(Boolean).length, pinned: st.pin.filter(Boolean).length,
      nAny: st.nAny, deltaZero, expectZero: !!cs.zero, maxAbs, maxPn, rel: maxPn > 0 ? maxAbs / maxPn : 0,
      maxDelta: Math.max(...st.DX.map((v, i) => Math.hypot(v, st.DY[i]))) });
  }
  // 相対二体への還元(Newton の重心系・ε=10⁻⁹): html の Δ + 試験粒子形 → a₁−a₂ を Blanchet & Iyer と比べる
  Bk.bi = [];
  for (const q of [1e-4, 0.3, 1]) {
    const M = 10, m1 = M / (1 + q), m2 = M * q / (1 + q), X1 = m1 / M, X2 = m2 / M;
    const r = [7.3, -3.1], v = [0.4, 0.9];
    const u = uni('w285b_bi', [{ m: m1, x: X2 * r[0], y: X2 * r[1], vx: X2 * v[0], vy: X2 * v[1], pnSource: true },
      { m: m2, x: -X1 * r[0], y: -X1 * r[1], vx: -X1 * v[0], vy: -X1 * v[1], pnSource: true }], { cLight: 100, softening: 1e-9 });
    const st = HN.evalExpr(`(()=>{ const v=HP.validatePreset(${J(u)}); HP.sim.build(v.preset); const S=HP.sim, DX=new Float64Array(2), DY=new Float64Array(2);
      dfmPN1Delta(S,DX,DY); return { DX:Array.from(DX), DY:Array.from(DY), m:Array.from(S.mEff.subarray(0,2)), x:Array.from(S.x.subarray(0,2)), y:Array.from(S.y.subarray(0,2)),
      vx:Array.from(S.vx.subarray(0,2)), vy:Array.from(S.vy.subarray(0,2)), eps:S.params.softening }; })()`);
    const bodies = st.m.map((m, i) => ({ m, x: st.x[i], y: st.y[i], vx: st.vx[i], vy: st.vy[i] }));
    const o = { G: 1, c: 100, eps: st.eps };
    const tf = O.testFormSum(bodies, o);
    const pn = [0, 1].map((i) => [tf[i].ax + st.DX[i], tf[i].ay + st.DY[i]]);
    const Mh = st.m[0] + st.m[1], nuh = st.m[0] * st.m[1] / (Mh * Mh);
    const rx = st.x[0] - st.x[1], ry = st.y[0] - st.y[1], vrx = st.vx[0] - st.vx[1], vry = st.vy[0] - st.vy[1];
    const bi = O.biRelAccel({ GM: Mh, nu: nuh, c: 100, x: rx, y: ry, vx: vrx, vy: vry });
    // Newton の重心系は Float32 の丸めで厳密でない —— 重心速度 V の 1PN 項(O(V·v/c²))は還元式に無いので、V を記録して残差と並べる
    const V = [(st.m[0] * st.vx[0] + st.m[1] * st.vx[1]) / Mh, (st.m[0] * st.vy[0] + st.m[1] * st.vy[1]) / Mh];
    const d = Math.hypot(pn[0][0] - pn[1][0] - bi.pnx, pn[0][1] - pn[1][1] - bi.pny), s = Math.hypot(bi.pnx, bi.pny);
    Bk.bi.push({ q, nu: nuh, rel: d / s, cmSpeed: Math.hypot(V[0], V[1]), eps: st.eps, epsOverR2: (st.eps * st.eps) / (rx * rx + ry * ry) });
  }
  Bk.maxRel = Math.max(...Bk.cases.filter((z) => !z.err).map((z) => z.rel));
  Bk.zeroOk = Bk.cases.filter((z) => z.expectZero).every((z) => z.deltaZero && z.nAny === 0);
  Bk.biMaxRel = Math.max(...Bk.bi.map((z) => z.rel));
  log(`(B) 加速度: html(Δ+試験粒子形)vs 参照 EIH の最大相対差 ${Bk.maxRel.toExponential(2)} ・ 固定源 1 つで Δ≡0 ${Bk.zeroOk} ・ B&I への還元 ${Bk.biMaxRel.toExponential(2)}`);
}

// ---------------------------------------------------------------- (C) ラグランジアンとの照合(参照実装の中)
const Cc = { rows: [] };
{
  const b = [{ m: 3, x: 0, y: 0, vx: 0.1, vy: -0.2 }, { m: 1, x: 8, y: 1, vx: -0.2, vy: 0.6 }, { m: 0.5, x: -5, y: 6, vx: 0.5, vy: 0.3 }];
  for (const gam of [1, 0.5, 0]) for (const c of [30, 100, 300]) {
    const o = { G: 1, c, gamma: gam };
    const E = O.eihAccel(b, o), L = O.elAccel(b, o, 1e-5);
    let md = 0, mp = 0; for (let i = 0; i < b.length; i++) { md = Math.max(md, Math.hypot(E[i].ax - L[i].ax, E[i].ay - L[i].ay)); mp = Math.max(mp, Math.hypot(E[i].pnx, E[i].pny)); }
    Cc.rows.push({ gamma: gam, c, diff: md, pn: mp, rel: md / mp });
  }
  Cc.slope = {};
  for (const gam of [1, 0.5, 0]) {
    const r = Cc.rows.filter((z) => z.gamma === gam);
    Cc.slope[gam] = Math.log(r[1].diff / r[0].diff) / Math.log(r[1].c / r[0].c);   // diff ∝ c^slope(30→100)
  }
  log(`(C) EL 残差の c 依存(30→100): γ=1 ${Cc.slope[1].toFixed(2)}・γ=0.5 ${Cc.slope[0.5].toFixed(2)}・γ=0 ${Cc.slope[0].toFixed(2)}(−4 なら 1PN の範囲で一致)`);
}

// ---------------------------------------------------------------- (D) 保存量(自由二体)
const Dd = { cond: { q: 0.5, c: 100, eps: 1e-3, dt: 1e-3, orbits: 2, sampleEvery: 200 }, rows: [] };
{
  const C = Dd.cond, M = 10, q = C.q, m1 = M / (1 + q), m2 = M * q / (1 + q);
  const p = G1.boundBinary({ id: 'w285b_cons', m1, m2, a: 10, e: 0.3, G: 1, geoPN: 1, physics: { cLight: C.c, softening: C.eps, softeningFloor: C.eps } });
  const P = 2 * Math.PI * Math.sqrt(1000 / 10), steps = Math.round(C.orbits * P / C.dt);
  const p0 = JSON.parse(J(p)); p0.id = 'w285b_cons0'; p0.physics.lambdaPN = 0;
  for (const [tag, H, pp] of [['now', HN, p], ['base', HB, p], ['now-lambda0', HN, p0]]) {
    const samples = H.evalExpr(`(()=>{ const v=HP.validatePreset(${J(pp)}); HP.sim.build(v.preset); const S=HP.sim, out=[];
      for(let k=0;k<=${steps};k++){ if(k%${C.sampleEvery}===0) out.push([S.mEff[0],S.x[0],S.y[0],S.vx[0],S.vy[0],S.mEff[1],S.x[1],S.y[1],S.vx[1],S.vy[1]]); S.step(${C.dt}); }
      return out; })()`);
    const o = { G: 1, c: C.c, lambda: pp.physics.lambdaPN };
    const cons = samples.map((s) => O.ppnConserved([{ m: s[0], x: s[1], y: s[2], vx: s[3], vy: s[4] }, { m: s[5], x: s[6], y: s[7], vx: s[8], vy: s[9] }], o));
    const spread = (f) => { const v = cons.map(f); return Math.max(...v) - Math.min(...v); };
    const E0 = Math.abs(cons[0].newton.E), Ps = m1 * Math.hypot(samples[0][3], samples[0][4]) + m2 * Math.hypot(samples[0][8], samples[0][9]);
    Dd.rows.push({ html: tag, samples: cons.length, steps,
      E1pnRel: spread((z) => z.E) / E0, ENewtonRel: spread((z) => z.newton.E) / E0,
      P1pnRel: Math.max(spread((z) => z.Px), spread((z) => z.Py)) / Ps, PNewtonRel: Math.max(spread((z) => z.newton.Px), spread((z) => z.newton.Py)) / Ps,
      J1pnRel: spread((z) => z.Jz) / Math.abs(cons[0].Jz) });
  }
  const n = Dd.rows.find((z) => z.html === 'now');
  log(`(D) 現行: 1PN のエネルギー振れ ${n.E1pnRel.toExponential(2)}(ニュートン ${n.ENewtonRel.toExponential(2)})・1PN の運動量 ${n.P1pnRel.toExponential(2)}(Σm·v ${n.PNewtonRel.toExponential(2)})`);
}

// ---------------------------------------------------------------- (E) kF0 主系列の λ=0/1 対照(診断)
const cal = JSON.parse(fs.readFileSync(path.join(ROOT, CAL_JSON), 'utf8'));
const obsPrec = (id) => { const p = (cal.presets || []).find((z) => z.id === id);
  const q = p && (p.quantities || []).find((z) => z.kind === 'precession' && z.unit === 'deg/orbit' && typeof z.obs === 'number');
  return q ? { obs: q.obs, from: id, name: q.name || null } : null; };
const E = { rule: 'calaudit の __w249build(id, true) と同じ: 複製の kFrame=0・geoPN 2→1(kF0 の本は複製をそのまま)。λ だけ差し替えた変種を同じ窓・同じ dt で',
  dt: 0.016, rows: [] };
{
  const LIST = [
    { id: 'psrDoubleABDFM', kf0: true, obsFrom: 'psrDoubleAB', orb: 8 }, { id: 'alphaCenABDFM', kf0: true, orb: 4 }, { id: 'siriusABDFM', kf0: true, orb: 4 },
    { id: 'psrJ1757DFM', kf0: true, obsFrom: 'psrJ1757DFM', orb: 8 }, { id: 'psrJ1946DFM', kf0: true, obsFrom: 'psrJ1946DFM', orb: 8 },
    { id: 'psrB1534DFM', kf0: true, obsFrom: 'psrB1534DFM', orb: 8 }, { id: 'mercuryReal', kf0: false, obsFrom: 'mercuryReal', orb: 8 },
    { id: 'plutoCharonReal', kf0: true, orb: 3 },
    { id: 'alphaCenAB', kf0: false, orb: 4 }, { id: 'siriusAB', kf0: false, orb: 4 }, { id: 'psrDoubleAB', kf0: false, obsFrom: 'psrDoubleAB', orb: 8 },
    { id: 'psrB1534', kf0: false, obsFrom: 'psrB1534DFM', orb: 8 }];
  for (const L of LIST) {
    const pN = HN.evalExpr(`window.__w285bCopy(${J(L.id)}, ${L.kf0})`), pB = HB.evalExpr(`window.__w285bCopy(${J(L.id)}, ${L.kf0})`);
    const emoji = pN.emoji;
    const n1 = runPeri(HN, lamVariant(pN, 1, 'w285b_' + L.id + '_n1'), E.dt, L.orb);
    const n0 = runPeri(HN, lamVariant(pN, 0, 'w285b_' + L.id + '_n0'), E.dt, L.orb);
    const b1 = runPeri(HB, lamVariant(pB, 1, 'w285b_' + L.id + '_b1'), E.dt, L.orb);
    const nSrc = HN.evalExpr(`(()=>{ const S=HP.sim; let k=0; for(let i=0;i<S.n;i++) if(pnSource(S,i)) k++; return k; })()`);
    const ob = L.obsFrom ? obsPrec(L.obsFrom) : null;
    const m = HN.evalExpr('Array.from(HP.sim.mEff.subarray(0,2))'), M = m[0] + m[1], nu = m[0] * m[1] / (M * M);
    const row = { id: L.id, emoji, kf0Copy: L.kf0, geoPN: pN.physics.geoPN, kFrame: pN.physics.kFrame, nSources: nSrc, nu, orbits: L.orb,
      GMoverAc2: n0.osc0.mu / (n0.osc0.a * n0.c * n0.c), grDeg: n0.grDeg,
      lam0B: n0.B, lam1NowB: n1.B, lam1BaseB: b1.B, incNow: n1.B - n0.B, incBase: b1.B - n0.B,
      circular: n0.osc0.e < 0.01, e: n0.osc0.e,
      ratioNow: n0.osc0.e < 0.01 ? null : (n1.B - n0.B) / n0.grDeg, ratioBase: n0.osc0.e < 0.01 ? null : (b1.B - n0.B) / n0.grDeg,
      periodRelNow: (n1.perFit && n0.perFit) ? n1.perFit / n0.perFit - 1 : null,
      obs: ob ? ob.obs : null, obsFrom: ob ? ob.from : null,
      residNow: ob ? (n1.B - ob.obs) / ob.obs : null, residBase: ob ? (b1.B - ob.obs) / ob.obs : null, residLam0: ob ? (n0.B - ob.obs) / ob.obs : null,
      nPeri: n1.nB, nan: n1.nan || n0.nan || b1.nan, clamp: n1.clamp + n0.clamp + b1.clamp };
    E.rows.push(row);
    log(`(E) ${emoji} ${L.id}: λ 増分/GR 基点 ${row.circular ? '—(e≈0)' : row.ratioBase.toFixed(4)} → 現行 ${row.circular ? '—(e≈0 —— 近点が定まらない)' : row.ratioNow.toFixed(4)}(ν=${nu.toFixed(3)}・源 ${nSrc}・周期の λ 相対差 ${row.periodRelNow === null ? '—' : row.periodRelNow.toExponential(2)})`
      + (ob ? ` ・ 観測との残差 基点 ${(row.residBase * 100).toFixed(1)}% → 現行 ${(row.residNow * 100).toFixed(1)}%(λ=0 ${(row.residLam0 * 100).toFixed(1)}%)` : ''));
  }
}

// ---------------------------------------------------------------- (F) 水星(R98)
const F = { grid: [], note: 'mercuryReal(太陽は pinned —— 源 1 つ固定なので本便の変更で 1 bit も変わらない)・8 周・検出器 B' };
{
  const base = HN.evalExpr(`window.__w285bCopy('mercuryReal', false)`);
  for (const eps of [0.05, 0.01]) for (const dt of [0.016, 0.008]) {
    const mk = (lam) => { const q = lamVariant(base, lam, `w285b_merc_${eps}_${dt}_${lam}`); q.physics.softening = eps; return q; };
    const r1 = runPeri(HN, mk(1), dt, 8), r0 = runPeri(HN, mk(0), dt, 8);
    const soft = softeningAnalyticDeg({ eps, a: r0.osc0.a, e: r0.osc0.e });
    F.grid.push({ eps, dt, lam0B: r0.B, lam1B: r1.B, incB: r1.B - r0.B, lam0A: r0.A, softAnalytic: soft, lam0MinusSoft: r0.B - soft, nPeri: r0.nB, nan: r0.nan || r1.nan });
    log(`(F) ε=${eps} dt=${dt}: λ=0 基線 ${r0.B.toExponential(3)}(Plummer ${soft.toExponential(3)})・λ 増分 ${(r1.B - r0.B).toExponential(5)}`);
  }
  const g = F.grid[0];
  const o = runPeri(HN, lamVariant(base, 0, 'w285b_merc_osc'), 0.016, 1).osc0;
  const cSim = HN.evalExpr('HP.sim.params.cLight');
  const cTrue = 299792.458 / 10;   // 1 単位 = 10⁸ m / 10⁴ s = 10 km/s
  const pnPred = DEG * G1.gr1pnAdvanceRad({ GM: o.mu, c: cSim, a: o.a, e: o.e });
  const pnPredTrue = DEG * G1.gr1pnAdvanceRad({ GM: o.mu, c: cTrue, a: o.a, e: o.e });
  const obs = obsPrec('mercuryReal');
  F.analytic = { osc0: o, cSim, cTrue, pn1PredSimC: pnPred, pn1PredTrueC: pnPredTrue, cRoundingFactor: (cTrue / cSim) ** 2, cRoundingRel: (cTrue / cSim) ** 2 - 1,
    obs: obs ? obs.obs : null, obsFrom: obs ? obs.from : null, obsFrom4298: arcsecPerCenturyToDegPerOrbit(42.98, 87.9691),
    obsOverPredSimC: obs ? obs.obs / pnPred : null, obsOverPredTrueC: obs ? obs.obs / pnPredTrue : null };
  const at = (eps, dt) => F.grid.find((z) => z.eps === eps && z.dt === dt);
  F.summary = { base005: at(0.05, 0.016).lam0B, base001: at(0.01, 0.016).lam0B, base001h2: at(0.01, 0.008).lam0B,
    incRange: [Math.min(...F.grid.map((z) => z.incB)), Math.max(...F.grid.map((z) => z.incB))],
    incOverPred: F.grid.map((z) => z.incB / pnPred),
    deficitFormal: obs ? (at(0.05, 0.016).lam1B - obs.obs) / obs.obs : null, deficitSmall: obs ? (at(0.01, 0.008).lam1B - obs.obs) / obs.obs : null,
    softAnalytic005: at(0.05, 0.016).softAnalytic };
  log(`(F) 1PN 予測(c=${cSim})${pnPred.toExponential(5)}・(c=${cTrue})${pnPredTrue.toExponential(5)}・観測 ${F.analytic.obs}・不足 ${(F.summary.deficitFormal * 100).toFixed(1)}% → ${(F.summary.deficitSmall * 100).toFixed(1)}%`);
}

// ---------------------------------------------------------------- (G) 前後(内蔵全本・1 歩と 128 歩・署名)
const CTX = `globalThis.__w285b = {
  snap(){ const S=HP.sim, n=S.n; const A=(k)=>Array.from(S[k].subarray(0,n));
    return { n, t:S.t, x:A('x'), y:A('y'), vx:A('vx'), vy:A('vy'), spin:A('spin'), nan:S.hasNaN() }; },
  loaded(id, dt, s1, s2){ HP.loadPreset(id, false); const S=HP.sim; for(let k=0;k<s1;k++) S.step(dt); const a=this.snap();
    for(let k=s1;k<s2;k++) S.step(dt); return { one:a, many:this.snap() }; },
  sig(id){ return presetSig(HP.allPresets().find((q)=>q.id===id)); },
  mode(id){ const p=HP.allPresets().find((q)=>q.id===id); const g=geoModeOf(p.physics||{}); return { core:g.core, pn1:g.pn1||null, geoPN:g.geoPN, kFrame:g.kFrame }; },
};`;
HN.evalExpr(CTX); HB.evalExpr(CTX);
const Gb = { steps: [1, 128], dt: DT, rows: [], diff1: [], diff128: [], sigDiff: [], scope: null, nAll: null };
{
  // **geoPN が 1 か 2 の本だけ**(kF0 の分岐と DFM の分岐を通る本 —— 0・3 の本と kFrame>0 の分岐は geoCoreDispatch の同じ行を通るので
  // コードの上で変わらない)。内蔵全本の 600 歩のビット比較は Chromium の器 tests/exp-w258c-bitsame.mjs(統合の手順)で見る。
  const ids = HN.evalExpr('HP.allPresets().filter((p)=>{ const g=(p.physics||{}).geoPN; return g>0 && g<3; }).map((p)=>p.id)'),
    baseIds = new Set(HB.evalExpr('HP.allPresets().map((p)=>p.id)'));
  Gb.scope = 'geoPN 1/2 の内蔵(' + ids.length + ' 本)—— 0・3 は geoCoreDispatch の変わらない行を通る';
  Gb.nAll = HN.evalExpr('HP.allPresets().length');
  for (const id of ids) {
    if (!baseIds.has(id)) continue;
    const a = HN.evalExpr(`__w285b.loaded(${J(id)}, ${DT}, 1, 128)`), b = HB.evalExpr(`__w285b.loaded(${J(id)}, ${DT}, 1, 128)`);
    const c1 = L283.bitCompare(a.one, b.one), c2 = L283.bitCompare(a.many, b.many);
    const sN = HN.evalExpr(`__w285b.sig(${J(id)})`), sB = HB.evalExpr(`__w285b.sig(${J(id)})`);
    const md = HN.evalExpr(`__w285b.mode(${J(id)})`);
    Gb.rows.push({ id, geoPN: md.geoPN, kFrame: md.kFrame, pn1: md.pn1, bitSame1: c1.bitSame, bitSame128: c2.bitSame, maxPos128: c2.maxPos, sigSame: sN === sB, nan: a.many.nan });
    if (!c1.bitSame) Gb.diff1.push(id);
    if (!c2.bitSame) Gb.diff128.push(id);
    if (sN !== sB) Gb.sigDiff.push(id);
  }
  Gb.n = Gb.rows.length;
  Gb.bitSame128 = Gb.n - Gb.diff128.length; Gb.sigSame = Gb.n - Gb.sigDiff.length;
  Gb.eihBooks = Gb.rows.filter((z) => z.pn1 === 'eih').map((z) => z.id);
  Gb.eihUnchanged = Gb.rows.filter((z) => z.pn1 === 'eih' && z.bitSame128).map((z) => z.id);
  Gb.changedNotEih = Gb.diff128.filter((id) => !Gb.eihBooks.includes(id));
  log(`(G) 128 歩 ${Gb.bitSame128}/${Gb.n}(差 ${Gb.diff128.join(',')})・署名 ${Gb.sigSame}/${Gb.n} ・ EIH の本 ${Gb.eihBooks.length}(うち不変 ${Gb.eihUnchanged.join(',')})・EIH 以外の差 ${Gb.changedNotEih.length}`);
}

// ---------------------------------------------------------------- 出力
const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第285便b', target: TARGET, inputs: [TARGET, CALAUDIT, CAL_JSON],
    code: ['tests/exp-w285b-pn1.mjs', 'tests/lib-w285b-gr1pn.mjs', 'tests/lib-w282b-geo1.mjs', 'tests/lib-w280c-geo3.mjs', 'tests/lib-w283a-geomode.mjs',
      'tests/lib-w280a-mercury.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'] }),
  harnessVersion: HARNESS_VERSION, libVersion: O.GR1PN_W285B_VERSION, htmlPn1Version: HN.evalExpr('PN1_EIH_VERSION'),
  htmlGeoModeVersion: HN.evalExpr('GEO_MODE_VERSION'), coreTable: Array.from(HN.evalExpr('GEO_CORE_PN')), contract: HN.evalExpr('JSON.parse(JSON.stringify(PN1_CONTRACT))'),
  ruling: '原仮定者の裁定(第75報)⑦: 「geoPN=1」の「λ_PN=1」は GR の 1PN と同等の軌道になる想定。観測値で実行結果が合わない場合は算出方法を調べつつ「λ_PN=0」なども確認する',
  base: { rev: BASE_REV, sha256: baseSha, note: '基点 html は git show の一時ファイル(終了後に削除)' }, nowSha256: nowSha,
  note: 'geoPN はアプリのモード番号(標準理論の 2PN・3PN ではない)。kF0 の 1PN は PPN(β=1・γ=α−½)の N 体 1PN(α=1.5 で EIH)—— DFM から導出した項ではない。'
    + 'S._core は 1 命令も変えていない(geoCoreDispatch が kF0 の役割に core=1 を渡し、差分 Δ を _core の前に当てる)。Σm·v は状態変数の和で、相対論的な全運動量ではない。',
  A, B: Bk, C: Cc, D: Dd, E, F, G: Gb,
  doNotWrite: ['λ_PN=1 で既に 1PN と合った', '不足は DFM の新現象', '観測一致を達成した', '較正を完了した', 'f=1 で合った', 'kF0 版が成立した', '精度を上げれば成立する', '新発見', 'RC を切った'],
  headless: { now: { wallSec: HN.ms / 1000, errors: HN.errors.length }, base: { wallSec: HB.ms / 1000, errors: HB.errors.length } }, elapsedS: null,
};
out.elapsedS = (Date.now() - t0) / 1000;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log(`→ ${path.relative(ROOT, OUT)}(${out.elapsedS.toFixed(1)} s)`);

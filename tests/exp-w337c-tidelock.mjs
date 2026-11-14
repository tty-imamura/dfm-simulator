// 第337便c(原仮定者の指示(2026-11-14 —— 第138報)「宇宙には、恒星を除き、潮汐ロックした状態を多く見掛ける。これは、潮汐ロックが安定した状態である事を示している」
//   「潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている」
//   「互いに潮汐ロックしていると、どちらかを基準にした座標系では、距離以外の引きずりが消え、遠方宇宙が回転している。遠方宇宙基準の通常の慣性系では、互いを自転速度で回す引きずりとなる」
//   「連星は、互いの潮汐力の反作用により、軸引きずりが連星同士の回転として現れる。これは、気体天体が、剛体で無くても軸引きずりで天体全体が回転するのと似た作用である」・統括の検証項目 R339):
//   **潮汐ロックと連星の探索の器**(段 tidelock-337c —— 正本 tests/out/tidelock-337c.json・lib tests/lib-w337c-tidelock.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。加減速の繰り返しの損失は枝 d の題(持たない)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337c-tidelock.mjs —— 第335便f の型・領域の宣言なし)。入力のファイルは無い(実在の天体の値は lib の写し ——
//   paper/data の CSV の行の値の写しは QA behavior.tidelock337c が CSV と照らす)。1 プロセス。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・knobs)は、走らせたノブの格子と判定の物差し(何と比べて「合う」と言うか)の記録。
// ■ 何をするか
//   T1 2 つの座標系の読み(片方の天体に固定して回る座標系/遠方宇宙基準の慣性系 —— 型 3 × e × 位相 8 × 質量比 3 × 受け手 2 × 自己の重み 3 × 背景の重み 4)・第335便d の同期の型との照らし・E′ = E − Ω·L
//   T2 ロックの条件(円の最小の型 —— N/K 7 × Γ_t 3 × 初期の自転 2・時定数 9・受動の型 8・離心 16・水星の離心 6)と実在の天体の表(15 行 —— 比のしきい・k₂/Q・年齢・初期の自転)
//   T3 角運動量の帳簿(σ 3 × K 3 × Γ_t 4 の円 + 反作用なしの対照 + 離心 3)と層の模型(層 3 × 結合 3)
//   T4 同期の 3 列と秤動(e 3 × K 6 × Γ_t 4 —— 周期の解と求積の近点の永年の率・端の列 ±5/3)・通過の角の同時発展の照らし 3 行
// ■ 言わないこと: 候補の型の表と条件付きの恒等式と残差(観測と比べた結果ではない・潮汐の則を採ったのではない)・実在の天体の表の比のしきいはノブ(係数は決めない)・
//   文献の値は一次資料に当たっていない(未照合)・固体と気体に同じ応答を強いない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w337c-tidelock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337c-tidelock-1';
export const OUT_MAIN = 'tests/out/tidelock-337c.json';
export const TARGET = 'tests/lib-w337c-tidelock.mjs';   // html を読まない器の来歴の対象(純関数 —— 第335便f の型)
/** 版の履歴(結果を見て変えた所 —— 理由つき。探索の方針により型とノブは後から足してよい —— 足した順に書く) */
export const AMEND = Object.freeze([
  '探索の記録 1(初走の後): T4 の周期の解は K の梯子(0 から 1/8 桁ずつ)で求め、解けない点は初期値 2 つ(n・近点の ḟ)を足して試した —— 解けない行は消さずに「解けない」で残す',
  '探索の記録 2(初走の後): 実在の天体の表に源ごとの比(主星・太陽・銀河)と、比のしきいで分けた後の 2 本目の読み(k₂/Q・年齢・初期の自転 —— ロックへ入る時間 < 年齢)を足した',
  '探索の記録 3(原仮定者の補足(2026-11-14 —— 第138報の補足)が走行中に届いた): 外部の軸引きずりの向きを「近い面と遠い面の差分 —— 赤道面では源の回転と逆回転」で置く列を足した(係数 c = 1 − α + f α/2・α = 2・f は差分の読みのノブ —— f = 0 が補足の読み・f = 1 が回転率の全部)。銀河は太陽系の軸と 120°。T2 に逆回転の N_ext の 5 行・T3 に逆回転の外部のトルクの 3 行。従来の列(向きを揃えた |ω_src − n|)は比べる列に残した',
  '探索の記録 4(原仮定者の補足(2026-11-14 —— 第138報の補足 2)が走行中に届いた): 銀河の軸引きずりを全部の行の源に置き(180° の軸 —— 太陽系の中では順行・射影 +0.5)、太陽の軸引きずりは太陽の自転と逆回転、大きさは閉じた形 (α − 1) s f(源の取り分 f はノブ)。分類(主要な衛星 = 潮汐ロック/水星 = 太陽が強い/金星 = 釣り合い + 地球/ほかの惑星 = 銀河の側)を目標の列にして、α 3 × 幅 3 で 3 つの比の読みを足した。金星の行に地球の潮汐の物差し',
]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '候補の型の表・条件付きの恒等式・残差(観測と比べた結果ではない)', 'T2 の型 I ṡ = −K sin(2δ) − Γ_t (s − n) + N_ext は探索の出発点(採った潮汐の則ではない)',
  '実在の天体の表の比のしきい・k₂/Q はノブ(係数は決めない —— 境目の帯を読む)', '文献の値は本環境では一次資料に当たっていない(未照合)',
  '固体と気体に同じ応答を強いない(k₂/Q を分けてよい)', '加減速の繰り返しの損失は枝 d の題(この器は持たない)', '2 つの座標系の差が丸めの桁なのは座標変換の恒等式(新しい物理の結果ではない)']);
/** 器の宣言(QA の作り直しの部分集合) */
export const PLAN = Object.freeze({
  behaviorSubset: Object.freeze({
    lock: Object.freeze([[1, 0.9], [0.1, 0.9], [10, 1.01]]),   // [Γ_t, N/K](K = 1・初期の自転 n と 6 n)
    ledger: Object.freeze([[0.1, 100, 1], [0.5, 1, 1], [0.01, 0, 0]]),   // [σ, K, Γ_t](円・反作用あり)
    libr: Object.freeze([[0.2, 1, 1], [0.1, 100, 0], [0.4, 0, 10]]),   // [e, K, Γ_t]
  }),
});

/* ───────── T1 ───────── */
export function partFrames() {
  const F = L.frameTable(), X = L.syncCrossCheck();
  const energy = [[0.3, 0, 0.4], [0.3, 0.2, 0.9], [1, 0.6, 2.5]].map(([q, e, ph]) => L.energyRow({ q, e, phase: ph }));
  return { n: F.rows.length, maxErr: F.maxErr, summary: F.summary, w0: F.w0, sync335d: X, energy };
}
/* ───────── T2 ───────── */
export function partLock() {
  const D = L.DECL.lock, rows = [];
  for (const G of D.gammas) for (const N of D.nOverK) for (const s0 of D.s0) rows.push(L.lockRow({ K: D.K, G, N: N * D.K, s0 }));
  const tau = []; for (const G of D.gammas) for (const N of D.tauN) tau.push(L.tauRow({ K: D.K, G, N: N * D.K }));
  const passive = []; for (const gax of D.passive.gax) for (const ra of D.passive.ratio) passive.push(L.lockRow({ K: D.K, G: D.passive.gamma, gax, wext: 1 + ra * D.K / gax }));
  const E = D.ecc, ecc = []; for (const e of E.e) for (const damp of E.damp) for (const N of E.nOverK) ecc.push(L.eccLockRow({ e, K: D.K, G: E.gamma, N: N * D.K, damp, nOrb: E.nOrb, win: E.win, stepsPerOrbit: E.stepsPerOrbit }));
  const M = D.mercury, eM = L.BODY_SRC.Mercury.e[0], mercury = []; for (const G of M.gammas) for (const s0 of M.s0) mercury.push(L.eccLockRow({ e: eM, K: D.K, G, s0, damp: 'inst', nOrb: M.nOrb, win: M.win, stepsPerOrbit: E.stepsPerOrbit }));
  const neg = D.negN.map((N) => L.lockRow({ K: D.K, G: 1, N: N * D.K, s0: 1 }));   // 補足の向き: 逆回転の外部の軸引きずり(Γ_t 1・初期 n)
  const agree = rows.filter((r) => r.agree).length, capFail = rows.filter((r) => r.pred && !r.locked).map((r) => ({ G: r.G, N: r.N, s0: r.s0, meanSlip: r.meanSlip }));
  return { rows, tau, passive, ecc, mercury, neg, mercuryE: eM, pseudoMercury: L.pseudoSync(eM), fdotPeriMercury: L.fdotPeri(eM), summary: { n: rows.length, agree, capFail, noLockBeyond: rows.filter((r) => !r.pred).every((r) => !r.locked), lockedHasFixed: rows.filter((r) => r.locked).every((r) => r.pred) } };
}
export function partBodies() { return Object.assign(L.bodyTable(), { classify: L.classTable() }); }
/* ───────── T3 ───────── */
export function partLedger() {
  const D = L.DECL.ledger, rows = [];
  for (const sigma of D.sigma) for (const kTil of D.kTil) for (const gTil of D.gTil) rows.push(L.ledgerRow({ sigma, kTil, gTil }));
  const control = [L.ledgerRow({ sigma: 0.1, kTil: 100, gTil: 1, react: false }), L.ledgerRow({ sigma: 0.1, kTil: 0, gTil: 0, react: false })];
  const ecc = D.ecc.rows.map(([k, g]) => L.ledgerRow({ sigma: D.ecc.sigma, kTil: k, gTil: g, e: D.ecc.e }));
  const neg = D.neg.map(([sigma, kTil, gTil, nu]) => L.ledgerRow({ sigma, kTil, gTil, nu }));   // 補足の向き: 逆回転の外部の軸引きずり(ν < 0)
  const layers = []; for (const nL of L.DECL.layers.nL) for (const c of L.DECL.layers.c) layers.push(L.layerRow({ nL, c }));
  return { rows, control, ecc, neg, layers };
}
/* ───────── T4 ───────── */
export function partLibr() {
  const T = L.librTable(), D = L.DECL.libr, S = L.secularTable();
  const cross = T.ends.map((x) => { const q = S.rows.find((r) => r.e === x.e); return { e: x.e, inst: x.instant.share, mean: x.mean.share, inst335d: q ? q.instant.share : null, mean335d: q ? q.mean.share : null }; });
  const pass = D.pass.map(([e, K, G]) => { const r = T.rows.find((q) => q.e === e && q.K === K && q.G === G); if (!r || !r.ok) return { e, K, G, ok: false };
    const P = L.passRun({ e, K, G, eps: D.passEps, nOrb: D.passOrb, steps: D.passSteps, d0: r.d0, s0: r.s0 }); return { e, K, G, ok: true, sharePass: P.share, shareQuad: r.share, d: P.share - r.share, dPanom: P.dPanom, nPass: P.nPass }; });
  return { rows: T.rows, ends: T.ends, cross, pass };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, F = J.frames, tol = D.frames.tol;
  const nF = (() => { let n = 0; for (const m of D.frames.modes) for (const e of D.frames.e) if ((m === 'circ') === (e === 0)) n++; return n * D.frames.nPhase * D.frames.q.length * D.frames.receivers.length * D.frames.selfRatios.length * D.frames.w0Ratios.length; })();
  const circ = F.summary.filter((q) => q.mode === 'circ'), inst = F.summary.filter((q) => q.mode === 'instant');
  const lr = J.ledger.rows.filter((r) => r.sigma < 1 / 3 && (r.kTil >= 1 || r.gTil >= 1));
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    frames: F.n === nF && F.maxErr <= tol && circ.every((q) => q.maxRadA <= tol && q.maxTanA <= tol) && inst.every((q) => q.maxTanA <= tol) && F.w0[0].w0Ratio === 0 && F.w0[0].maxNaive <= tol
      && F.w0.every((q) => q.errCov <= tol && q.errNaiveCf <= tol) && F.sync335d.maxErr <= tol && F.energy.every((q) => q.err <= tol),
    lock: J.lock.rows.length === D.lock.gammas.length * D.lock.nOverK.length * D.lock.s0.length && J.lock.summary.noLockBeyond && J.lock.summary.lockedHasFixed
      && J.lock.rows.filter((r) => r.locked).every((r) => r.errDstar <= 1e-6) && J.lock.tau.every((q) => q.rel !== null && q.rel <= 0.01) && J.lock.passive.every((r) => !r.locked || r.pred) && J.lock.passive.filter((r) => !r.pred).every((r) => !r.locked)
      && J.lock.neg.length === D.lock.negN.length && J.lock.neg.every((r) => (r.pred || !r.locked) && (!r.locked || r.errDstar <= 1e-6) && (() => { const q = J.lock.rows.find((x) => x.G === 1 && x.s0 === 1 && Math.abs(x.N + r.N) < 1e-12); return !q || q.locked === r.locked; })())
      && J.lock.ecc.length === D.lock.ecc.e.length * D.lock.ecc.damp.length * D.lock.ecc.nOverK.length && J.lock.ecc.every((r) => Number.isFinite(r.meanS)) && J.lock.mercury.every((r) => Number.isFinite(r.meanS)),
    bodies: J.bodies.rows.length === L.BODY_ROWS.length && J.bodies.rows.every((r) => Number.isFinite(r.Ntide) && r.Ntide > 0 && Number.isFinite(r.X) && r.X > 0)
      && J.bodies.rows.filter((r) => r.state === 'locked' && !r.mutual).every((r) => r.hostDiff < 0) && J.bodies.sepRead.length === L.DECL.bodies.sideScan.length
      && J.bodies.classify.out.length === L.DECL.classify.alphas.length * L.DECL.classify.tols.length && J.bodies.classify.out.every((o) => o.n === Object.keys(L.CLASS_TARGET).length && Math.abs(o.rows.find((q) => q.id === 'Venus').R - 1) <= 1e-12),
    ledger: lr.every((r) => Math.abs(r.dfOrb / r.cf.fOrb) <= 5e-3) && J.ledger.rows.concat(J.ledger.ecc, J.ledger.neg).every((r) => r.resRel <= 1e-7)
      && J.ledger.neg.filter((r) => r.kTil > 0).every((r) => Math.abs(r.dfOrb / r.cf.fOrb) <= 5e-3 && r.adot < 0) && J.ledger.control.every((r) => !r.react)
      && J.ledger.control[0].resRel >= 0.5 && J.ledger.rows.filter((r) => r.kTil === 0 && r.gTil === 0).every((r) => Math.abs(r.fOrb) <= 1e-8),
    layers: J.ledger.layers.length === D.layers.nL.length * D.layers.c.length && J.ledger.layers.every((q) => q.relLam <= 1e-6 && q.errLag <= 1e-9 && Math.abs(q.innerRateShare - 1) <= 1e-9),
    librEnds: J.libr.ends.every((x) => Math.abs(x.instant.share + 5 / 3) <= D.libr.endTol && Math.abs(x.mean.share - 5 / 3) <= D.libr.endTol)
      && J.libr.cross.every((q) => q.inst335d !== null && Math.abs(q.inst - q.inst335d) <= 1e-8 && Math.abs(q.mean - q.mean335d) <= 1e-8),
    librRows: J.libr.rows.length === D.libr.e.length * D.libr.K.length * D.libr.gamma.length && J.libr.rows.filter((r) => r.K === 0 && r.G === 0).every((r) => r.ok && r.x === 1)
      && J.libr.rows.filter((r) => r.ok).every((r) => Number.isFinite(r.share)),
    pass: J.libr.pass.every((q) => q.ok && Math.abs(q.d) <= D.libr.passTol && q.nPass === D.libr.passOrb),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { gates: L.pureGates(PS) }; mark('pure');
  const frames = partFrames(); mark('frames');
  const lock = partLock(); mark('lock');
  const bodies = partBodies(); mark('bodies');
  const ledger = partLedger(); mark('ledger');
  const libr = partLibr(); mark('libr');
  const J = { pure, frames, lock, bodies, ledger, libr, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W337C_OUT ? (path.isAbsolute(process.env.W337C_OUT) ? process.env.W337C_OUT : path.join(ROOT, process.env.W337C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第337便c tidelock(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337c-tidelock.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-14 —— 第138報の補足 2)「銀河の軸引きずりの影響は、太陽だけでなく、惑星や衛星にも及んでいる。主要な衛星は、惑星に潮汐ロックしている。水星は太陽の影響が強い。金星は、太陽と銀河が釣り合っていて、さらに地球が影響を与えている」・原仮定者の補足(2026-11-14 —— 第138報の補足)「軸引きずりは、並進引きずりで引きずられる側の、近い面と遠い面の差分なので、赤道面では源の回転と逆回転になる」・原仮定者の指示(2026-11-14 —— 第138報)「潮汐ロックしている状態は、外部からの軸引きずりによる回転よりも、潮汐力が上回っている」「互いに潮汐ロックしていると、どちらかを基準にした座標系では、距離以外の引きずりが消え、遠方宇宙が回転している。遠方宇宙基準の通常の慣性系では、互いを自転速度で回す引きずりとなる」「連星は、互いの潮汐力の反作用により、軸引きずりが連星同士の回転として現れる」・統括の検証項目 R339',
    decl: L.DECL, knobs: L.KNOBS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w337c-tidelock.mjs', 'tests/lib-w337c-tidelock.mjs', 'tests/lib-w335b-carryledger.mjs', 'tests/lib-w335d-binarytilt.mjs', 'tests/lib-w334d-binarylaw.mjs', 'tests/lib-w334b-ledger.mjs', 'tests/lib-w334a-heightlaw.mjs',
    'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w331b-centrifugal.mjs',
    'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs',
    'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便c', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'tidelock', engine: 'Node(html を読まない —— 純関数の lib の表・RK4 の積分・射撃・求積)・1 プロセス', notClaim: NOT_CLAIM });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

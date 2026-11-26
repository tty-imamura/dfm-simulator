// 第357便e(原仮定者の指示(2026-11-21)「論文3: 主にgeoPN=3を使用。「もしも宇宙に天体が２つだけだったら」の思考実験で始まる。…」・統括の検証項目 R526):
//   **天体が 2 つだけの宇宙の本 👥 twoBodyOnly3d の器**(段 twobody-357e —— 正本 tests/out/twobody-w357e.json・lib tests/lib-w357e-twobody.mjs)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で vm に読み、html の本文の受理器・coord3d の makeSim・build・步をそのまま実行 ——
//   1 本の近点の走行は第321便b の器の runBook・OFF の対照と geo1 の参照は第322便b の lib の offOf・geo1Of)。本の JSON は 1 bit も変えない(写しを作って走らせるだけ)。
// ■ 何をするか(門の宣言 DECL と門は lib —— 走行の前に置く・結果を見て変えない)
//   count    👥・♊・⚖️(と比べる 🫂)の数え上げと、宣言の D0・q を差し替えた写しの 1 公転のビット
//   trans    👥・♊・⚖️ に共通の速度 0.01・0.1 を足した写しと本の 1 公転の後の相対の位置・相対の速さの差
//   beta     👥・♊・⚖️ の引きずりの比 β・局所重力のポテンシャル ψ の比と質量の比(1 公転の平均)
//   ratio    入口の表(質量比の列 q = 1・1/3・1/10・1/100 × 刻み h・h/4)—— ♊ の宣言の質量だけを変えた写し × 列 self・off・g1
//   canon    q = 1・1/3 の比が正本 tests/out/binbooks-w322b.json の h・h/4 の比とビットで同じ
//   bookRun  本 👥 そのものの近点の率が q = 1/10 の写しの列 self とビットで同じ(h・h/4)
//   rerun    本 👥 を 2 回組んで 1 公転 —— ビットが同じ
// ■ 所要: 1 プロセス・約 1 分(枝の実測は正本の elapsedS)
// ■ 言わないこと: lib の NOT_CLAIM。
// 使い方: node tests/exp-w357e-twobody.mjs   W357E_OUT=<json>(試走)・W357E_TARGET=<html>(既定 beta/index.html)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as B from './lib-w322b-binbooks.mjs';
import { runBook } from './exp-w321b-geo3bin.mjs';
import * as L from './lib-w357e-twobody.mjs';
// 第281便a の領域 hash の宣言(器と lib と import の閉包から deriveScope で引いた下限)
const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABInertial3d","binary","binaryCheckEqualInertial3d","binaryCheckRatio3Inertial3d","boxBinaryToy","compactForceToy","coord3dKeplerTilt","coord3dSpinPrecess","fig8","gw150914","inertialDragPair","psrB1534","psrDoubleAB","psrJ1757DFM","psrJ1946DFM","siriusAB","siriusABInertial3d","spinDipoleBinary","twoBodyOnly3d"],"roots":["$","HP.MASS_BASIS","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDragLedgerOf","HP.sim","HP.validatePreset","OBS_SPIN_KEYS","T","calTargetOf","ctx","cw","makeSim","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w357e-twobody-1';
export const OUT_MAIN = 'tests/out/twobody-w357e.json';
export const BOOK_ID = L.BOOK_ID;
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const { DECL, fx } = L;

function buildOf(H, book) {
  const HP = H.HP, v = HP.validatePreset(clone(book));
  if (!v.ok) throw new Error('受理されない: ' + book.id + ' ' + (v.errors || []).join(' / '));
  const S = (book.physics && book.physics.coord === '3d') ? HP.coord3d.makeSim() : H.evalExpr('makeSim')();
  S.build(clone(v.preset));
  return { S, warnings: (v.warnings || []).length };
}
const arrs = (S) => ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'].filter((k) => S[k]).map((k) => S[k]);
function fp(S) { const h = crypto.createHash('sha256'); for (const a of arrs(S)) h.update(Buffer.from(new Float64Array(Array.from(a)).buffer)); h.update(String(S.t)); return h.digest('hex').slice(0, 16); }
const runN = (S, N, dt) => { for (let k = 0; k < N; k++) S.step(dt); };
const rel = (S) => [S.x[1] - S.x[0], S.y[1] - S.y[0], (S.z ? S.z[1] - S.z[0] : 0)];
const relV = (S) => [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], (S.vz ? S.vz[1] - S.vz[0] : 0)];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

/** ① 数え上げと、宣言の背景が走行に効かないこと */
export function partCount(H, book) {
  const ph = book.physics, out = { id: book.id, emoji: book.emoji, group: book.group, sampleClass: book.sampleClass || null, referenceKind: book.referenceKind || null,
    geoPN: ph.geoPN, kFrame: ph.kFrame, D0: ph.D0, coord: ph.coord || '2d', gravityXY: [ph.gravityX || 0, ph.gravityY || 0],
    bgKeys: ['backgroundComplex', 'spaceMesh', 'D0pull', 'universeBox'].filter((k) => ph[k] !== undefined), boundary: (book.world || {}).boundary || null,
    relativeDrag: ph.relativeDrag ? ph.relativeDrag.law : null, gLoc: ph.gLoc ? ph.gLoc.law : null };
  out.declBodies = book.bodies.length; out.declTest = book.bodies.filter((b) => b.testParticle === true).length; out.declPinned = book.bodies.filter((b) => b.pinned === true).length;
  const r = buildOf(H, book), S = r.S; out.warnings = r.warnings;
  out.n = S.n; out.tp = S.tpFlag ? Array.from(S.tpFlag).filter((x) => x === 1).length : 0; out.m = Array.from(S.m);
  const pat = clone(book); Object.assign(pat.physics, DECL.inertPatch);
  const A = buildOf(H, book).S, Bp = buildOf(H, pat).S, dt = ph.stepDt;
  runN(A, DECL.inertSteps, dt); runN(Bp, DECL.inertSteps, dt);
  out.inert = { patch: DECL.inertPatch, steps: DECL.inertSteps, same: fp(A) === fp(Bp), fp: fp(A) };
  return out;
}

/** ② 共通の並進 */
export function partTrans(H, book) {
  const dt = book.physics.stepDt, A = buildOf(H, book).S; runN(A, DECL.transSteps, dt);
  const rA = rel(A), vA = relV(A), rows = [];
  for (const V of DECL.transV) {
    const S = buildOf(H, L.withBulk(book, V)).S; runN(S, DECL.transSteps, dt);
    rows.push({ V, dRelPos: fx(nrm(sub(rel(S), rA)) / nrm(rA), 4), dRelVel: fx(nrm(sub(relV(S), vA)) / nrm(vA), 4) });
  }
  return { id: book.id, steps: DECL.transSteps, rows };
}

/** ③ 互いの決定(引きずりの比 β と局所重力 ψ —— エンジンの欄を読むだけ) */
export function partBeta(H, book) {
  const dt = book.physics.stepDt, S = buildOf(H, book).S, m = Array.from(S.m);
  const acc = { b0: 0, b1: 0, p0: 0, p1: 0, mom: 0, n: 0 };
  for (let k = 0; k < DECL.betaSteps; k++) {
    S.step(dt);
    const u = [0, 1].map((i) => [S._rdUX[i], S._rdUY[i], S._rdUZ ? S._rdUZ[i] : 0]), w = nrm(relV(S));
    if (!(nrm(u[0]) > 0)) continue;
    acc.b0 += nrm(u[0]) / w; acc.b1 += nrm(u[1]) / w; acc.p0 += S._glPsi[0]; acc.p1 += S._glPsi[1];
    const P = [0, 1, 2].map((c) => m[0] * u[0][c] + m[1] * u[1][c]);
    acc.mom = Math.max(acc.mom, nrm(P) / (m[0] * nrm(u[0]))); acc.n++;
  }
  const n = acc.n || 1;
  return { id: book.id, m: m.map((x) => fx(x, 9)), steps: acc.n, beta: [fx(acc.b0 / n), fx(acc.b1 / n)], betaRatio01: fx(acc.b0 / acc.b1, 7), massRatio10: fx(m[1] / m[0], 7),
    psi: [fx(acc.p0 / n), fx(acc.p1 / n)], psiRatio01: fx(acc.p0 / acc.p1, 7), momSumRelMax: fx(acc.mom, 3) };
}

/** ④ 質量比の列(入口の表) */
export function partRatio(H) {
  const HP = H.HP, find = (id) => HP.allPresets().find((p) => p.id === id) || null;
  const base = clone(find('binaryCheckEqualInertial3d')), spec = B.BOOKS[0];
  const cols = { self: base, off: B.offOf(base), g1: B.geo1Of(spec, find) };
  const h = base.physics.stepDt, P0 = 2 * Math.PI * Math.sqrt(DECL.a ** 3 / (base.physics.G * DECL.M));
  const rows = [];
  for (const q of DECL.ratios) for (const div of DECL.divs) {
    const s = L.twoBodyState(q, base.physics.G), rs = {}, raw = {};
    for (const [c, bk] of Object.entries(cols)) {
      const r = runBook(HP, L.withRatio(bk, q), { dt: h / div, N: DECL.N, K: DECL.K, P0 });
      raw[c] = { status: r.status, complete: r.complete, rate: r.rate, nan: r.nan, steps: r.steps };
      rs[c] = r.rate;
    }
    rows.push(Object.assign({ div }, L.ratioRow(q, s.eta, rs), { raw }));
  }
  return { base: base.id, h, N: DECL.N, rows };
}
/** 本 👥 そのものの近点の率(列 self の写しとビットで同じか) */
export function partBookRun(H, R) {
  const book = clone(H.HP.allPresets().find((p) => p.id === BOOK_ID)), h = book.physics.stepDt, P0 = 2 * Math.PI * Math.sqrt(DECL.a ** 3 / (book.physics.G * DECL.M));
  return DECL.divs.map((div) => { const r = runBook(H.HP, book, { dt: h / div, N: DECL.N, K: DECL.K, P0 }), cp = R.rows.find((z) => z.q === DECL.bookRatio && z.div === div);
    return { div, rate: r.rate, copyRate: cp ? cp.raw.self.rate : null, sameAsCopy: !!cp && r.rate === cp.raw.self.rate, steps: r.steps }; });
}
/** 正本 tests/out/binbooks-w322b.json の h・h/4 の比との照合(q = 1・1/3) */
export function canonCheck(R) {
  const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/out/binbooks-w322b.json'), 'utf8')), out = [];
  for (const [id, q] of [['binaryCheckEqualInertial3d', 1], ['binaryCheckRatio3Inertial3d', 1 / 3]]) {
    const row = J.T.rows.find((r) => r.id === id), m1 = R.rows.find((r) => r.q === q && r.div === 1), m4 = R.rows.find((r) => r.q === q && r.div === 4);
    out.push({ id, q, canonRatioH: row.byQty.rate.ratio[0], mineRatioH: m1.ratioFull, relDiffH: L.relDiff(row.byQty.rate.ratio[0], m1.ratioFull),
      canonRatioH4: row.byQty.rate.ratio[2], mineRatioH4: m4.ratioFull, relDiffH4: L.relDiff(row.byQty.rate.ratio[2], m4.ratioFull) });
  }
  return out;
}
/** ⑤ 走り直し */
export function partRerun(H) {
  const book = H.HP.allPresets().find((p) => p.id === BOOK_ID), dt = book.physics.stepDt;
  const A = buildOf(H, book).S, Bq = buildOf(H, book).S; runN(A, DECL.rerunSteps, dt); runN(Bq, DECL.rerunSteps, dt);
  return { steps: DECL.rerunSteps, same: fp(A) === fp(Bq), fp: fp(A) };
}

export function measure(H) {
  const find = (id) => H.HP.allPresets().find((p) => p.id === id) || null;
  const books = L.BOOKS.map((b) => clone(find(b.id))), cmp = L.COMPARE.map((b) => clone(find(b.id)));
  const count = books.concat(cmp).map((b) => partCount(H, b));
  const trans = books.map((b) => partTrans(H, b));
  const beta = books.map((b) => partBeta(H, b));
  const ratio = partRatio(H);
  const bk = find(BOOK_ID);
  return { count, trans, beta, ratio, canon: canonCheck(ratio), bookRun: partBookRun(H, ratio), rerun: partRerun(H),
    book: { id: BOOK_ID, emoji: bk.emoji, group: bk.group, physics: bk.physics, bodies: bk.bodies } };
}
export function gatesOf(J) { return L.gatesFrom(J); }

export async function main() {
  const TARGET = process.env.W357E_TARGET || 'beta/index.html';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const OUT = process.env.W357E_OUT ? (path.isAbsolute(process.env.W357E_OUT) ? process.env.W357E_OUT : path.join(ROOT, process.env.W357E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  console.log('第357便e twobody(版 ' + HARNESS_VERSION + ')');
  const tm = Date.now(), M = measure(H), measSec = (Date.now() - tm) / 1000;
  const J = { ...M, pageErrors: H.errors.slice(0, 5), timing: { measure: { wallSec: measSec } } };
  J.selfTest = L.selfTest(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w357e-twobody.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の指示(2026-11-21)「論文3: 主にgeoPN=3を使用。「もしも宇宙に天体が２つだけだったら」の思考実験で始まる。…」・統括の検証項目 R526',
    decl: L.DECL, notClaim: L.NOT_CLAIM, ...J };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w357e-twobody.mjs', 'tests/lib-w357e-twobody.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs',
    'tests/lib-w322b-binbooks.mjs', 'tests/exp-w321b-geo3bin.mjs', 'tests/lib-w321b-geo3bin.mjs'].filter((f) => fs.existsSync(path.join(ROOT, f)));
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第357便e', target: TARGET, code: CODE, inputs: [TARGET, 'tests/out/binbooks-w322b.json'] }), {
    harnessVersion: HARNESS_VERSION, stage: 'twobody-357e', engine: 'Node(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文の受理器・build・步をそのまま実行)・👥 ♊ ⚖️ の宣言と質量比の写しを走らせる', notClaim: L.NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

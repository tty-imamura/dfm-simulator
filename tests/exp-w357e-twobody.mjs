// 第357便e(原仮定者の指示 2026-11-21「もしも宇宙に天体が２つだけだったら」・統括の検証項目 R526 —— 第 1 段): **論文 3 の入口の下見の器**
//   「今の連星の検証の本 ♊ binaryCheckEqualInertial3d・⚖️ binaryCheckRatio3Inertial3d で入口として足りるか」の表の材料を数える(正本・段は作らない —— 第 2 段で形が決まってから)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で vm に読み、html の本文の受理器・coord3d の makeSim・build・步をそのまま実行 ——
//   1 本の近点の走行は第321便b の器の runBook)。本の JSON は 1 bit も変えない(写しを作って走らせるだけ)。項目と読みは lib tests/lib-w357e-twobody.mjs の注記。
// ■ 使い方: node tests/exp-w357e-twobody.mjs [出力の JSON の道 —— 省略すると標準出力だけ]。W357E_TARGET(既定 beta/index.html)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import * as B from './lib-w322b-binbooks.mjs';
import { runBook } from './exp-w321b-geo3bin.mjs';
import * as L from './lib-w357e-twobody.mjs';

export const HARNESS_VERSION = 'w357e-twobody-1';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const { DECL, fx } = L;

let MAKE2D = null;   // 二次元の本(比べる 🫂)は html の makeSim(main で evalExpr から渡す)
function buildOf(HP, book) {
  const v = HP.validatePreset(clone(book));
  if (!v.ok) throw new Error('受理されない: ' + book.id + ' ' + (v.errors || []).join(' / '));
  const S = (book.physics && book.physics.coord === '3d') ? HP.coord3d.makeSim() : (MAKE2D ? MAKE2D() : null);
  if (S) { S.build(clone(v.preset)); return { S, warnings: (v.warnings || []).length }; }
  return { S: null, warnings: (v.warnings || []).length, preset: v.preset };
}
const arrs = (S) => ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'].filter((k) => S[k]).map((k) => S[k]);
function fp(S) { const h = crypto.createHash('sha256'); for (const a of arrs(S)) h.update(Buffer.from(new Float64Array(Array.from(a)).buffer)); h.update(String(S.t)); return h.digest('hex').slice(0, 16); }
const runN = (S, N, dt) => { for (let k = 0; k < N; k++) S.step(dt); };
const rel = (S) => [S.x[1] - S.x[0], S.y[1] - S.y[0], (S.z ? S.z[1] - S.z[0] : 0)];
const relV = (S) => [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], (S.vz ? S.vz[1] - S.vz[0] : 0)];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

/** ① 数え上げと、宣言の背景が走行に効かないこと */
export function partCount(HP, book) {
  const ph = book.physics, out = { id: book.id, emoji: book.emoji, group: book.group, name: book.name, sampleClass: book.sampleClass || null, referenceKind: book.referenceKind || null,
    geoPN: ph.geoPN, kFrame: ph.kFrame, D0: ph.D0, D0pull: ph.D0pull === undefined ? null : ph.D0pull, coord: ph.coord || '2d', gravityXY: [ph.gravityX || 0, ph.gravityY || 0],
    bgKeys: ['backgroundComplex', 'spaceMesh', 'D0pull', 'universeBox'].filter((k) => ph[k] !== undefined), boundary: (book.world || {}).boundary || null,
    relativeDrag: ph.relativeDrag ? ph.relativeDrag.law : null, gLoc: ph.gLoc ? ph.gLoc.law : null };
  const decl = book.bodies.map((b) => ({ type: b.type, n: b.n || 1, test: b.testParticle === true, pinned: b.pinned === true, m: b.m }));
  out.declBodies = decl.length; out.declTest = decl.filter((d) => d.test).length; out.declPinned = decl.filter((d) => d.pinned).length;
  const r = buildOf(HP, book); out.warnings = r.warnings;
  if (r.S) {
    const S = r.S; out.n = S.n; out.tp = S.tpFlag ? Array.from(S.tpFlag).filter((x) => x === 1).length : 0; out.m = Array.from(S.m);
    out.frameSrc = S.frameSrc ? Array.from(S.frameSrc) : null;
    // 宣言の D0・q を差し替えた写しと 1 公転のビット
    const pat = clone(book); Object.assign(pat.physics, DECL.inertPatch);
    const A = buildOf(HP, book).S, Bp = buildOf(HP, pat).S, dt = ph.stepDt;
    runN(A, DECL.inertSteps, dt); runN(Bp, DECL.inertSteps, dt);
    out.inert = { patch: DECL.inertPatch, steps: DECL.inertSteps, same: fp(A) === fp(Bp), fp: fp(A) };
  }
  return out;
}

/** ② 共通の並進 */
export function partTrans(HP, book) {
  const dt = book.physics.stepDt, A = buildOf(HP, book).S; runN(A, DECL.transSteps, dt);
  const rA = rel(A), vA = relV(A), rows = [];
  for (const V of DECL.transV) {
    const S = buildOf(HP, L.withBulk(book, V)).S; runN(S, DECL.transSteps, dt);
    rows.push({ V, dRelPos: fx(nrm(sub(rel(S), rA)) / nrm(rA), 4), dRelVel: fx(nrm(sub(relV(S), vA)) / nrm(vA), 4), bitSameRel: nrm(sub(rel(S), rA)) === 0 && nrm(sub(relV(S), vA)) === 0,
      cmShift: fx((S.m[0] * S.x[0] + S.m[1] * S.x[1]) / (S.m[0] + S.m[1]) - (A.m[0] * A.x[0] + A.m[1] * A.x[1]) / (A.m[0] + A.m[1]) - V * DECL.transSteps * dt, 4) });
  }
  return { id: book.id, steps: DECL.transSteps, relSpeed: fx(nrm(relV(buildOf(HP, book).S)), 5), rows };
}

/** ③ 互いの決定(引きずりの比 β と局所重力 ψ —— エンジンの欄を読むだけ) */
export function partBeta(HP, book) {
  const dt = book.physics.stepDt, S = buildOf(HP, book).S, m = Array.from(S.m);
  const acc = { b0: 0, b1: 0, p0: 0, p1: 0, mom: 0, n: 0 };
  for (let k = 0; k < DECL.betaSteps; k++) {
    S.step(dt);
    if (!S._rdUX) continue;
    const u = [0, 1].map((i) => [S._rdUX[i], S._rdUY[i], S._rdUZ ? S._rdUZ[i] : 0]), w = nrm(relV(S));
    if (!(nrm(u[0]) > 0)) continue;
    acc.b0 += nrm(u[0]) / w; acc.b1 += nrm(u[1]) / w;
    acc.p0 += S._glPsi ? S._glPsi[0] : 0; acc.p1 += S._glPsi ? S._glPsi[1] : 0;
    const P = [0, 1, 2].map((c) => m[0] * u[0][c] + m[1] * u[1][c]);
    acc.mom = Math.max(acc.mom, nrm(P) / (m[0] * nrm(u[0]))); acc.n++;
  }
  const n = acc.n || 1;
  return { id: book.id, m, steps: acc.n, beta: [fx(acc.b0 / n), fx(acc.b1 / n)], betaRatio01: fx(acc.b0 / acc.b1, 6), massRatio10: fx(m[1] / m[0], 6),
    psi: [fx(acc.p0 / n), fx(acc.p1 / n)], psiRatio01: fx(acc.p0 / acc.p1, 6), momSumRelMax: fx(acc.mom, 3),
    Rd: S._rdIsqRd ? Array.from(S._rdIsqRd).map((x) => fx(x)) : null };
}

/** ④ 質量比の列(下見 —— 刻み h) */
export function partRatio(HP) {
  const find = (id) => HP.allPresets().find((p) => p.id === id) || null;
  const base = clone(find('binaryCheckEqualInertial3d')), spec = B.BOOKS[0];
  const cols = { self: base, off: B.offOf(base), g1: B.geo1Of(spec, find) };
  const h = base.physics.stepDt, P0 = 2 * Math.PI * Math.sqrt(DECL.a ** 3 / (base.physics.G * DECL.M));
  const rows = [], beta = [];
  for (const q of DECL.ratios) for (const div of DECL.divs) {
    const s = L.twoBodyState(q, base.physics.G), rs = {}, raw = {};
    for (const [c, bk] of Object.entries(cols)) {
      const r = runBook(HP, L.withRatio(bk, q), { dt: h / div, N: DECL.N, K: DECL.K, P0 });
      raw[c] = { status: r.status, complete: r.complete, rate: r.rate, rateB: r.rateB, nan: r.nan, steps: r.steps };
      rs[c] = r.rate;
    }
    rows.push(Object.assign({ div }, L.ratioRow(q, s.eta, rs), { raw }));
    if (div !== DECL.divs[0]) continue;
    const bq = partBeta(HP, L.withRatio(base, q)); beta.push({ q, betaRatio01: bq.betaRatio01, massRatio10: bq.massRatio10, psiRatio01: bq.psiRatio01, beta: bq.beta });
  }
  return { base: base.id, h, N: DECL.N, rows, beta };
}

/** 正本 tests/out/binbooks-w322b.json の刻み h の値との照合(q = 1・1/3 —— 写しの作りの確かめ) */
export function canonCheck(R) {
  const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/out/binbooks-w322b.json'), 'utf8')), out = [];
  for (const [id, q] of [['binaryCheckEqualInertial3d', 1], ['binaryCheckRatio3Inertial3d', 1 / 3]]) {
    const row = J.T.rows.find((r) => r.id === id), mine = R.rows.find((r) => r.q === q && r.div === 1), m4 = R.rows.find((r) => r.q === q && r.div === 4);
    out.push({ id, q, canonRatioH: row.byQty.rate.ratio[0], mineRatioH: mine.ratioFull, relDiffH: fx(L.relDiff(row.byQty.rate.ratio[0], mine.ratioFull), 3),
      canonRatioH4: row.byQty.rate.ratio[2], mineRatioH4: m4 ? m4.ratioFull : null, relDiffH4: m4 ? fx(L.relDiff(row.byQty.rate.ratio[2], m4.ratioFull), 3) : null });
  }
  return out;
}

export function measure(HP) {
  const find = (id) => HP.allPresets().find((p) => p.id === id) || null;
  const books = L.BOOKS.map((b) => clone(find(b.id))), cmp = L.COMPARE.map((b) => clone(find(b.id)));
  const count = books.concat(cmp).map((b) => partCount(HP, b));
  const trans = books.map((b) => partTrans(HP, b));
  const beta = books.map((b) => partBeta(HP, b));
  const ratio = partRatio(HP);
  return { count, trans, beta, ratio, canon: canonCheck(ratio) };
}

export async function main() {
  const TARGET = process.env.W357E_TARGET || 'beta/index.html', html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), H = loadHtmlHeadless(html);
  if (H.errors && H.errors.length) throw new Error('html の読み込みの誤り: ' + H.errors.slice(0, 3).join(' / '));
  MAKE2D = H.evalExpr('makeSim');
  const R = measure(H.HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, target: TARGET, targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    decl: DECL, ...R, notClaim: L.NOT_CLAIM, node: process.version, elapsedS: (Date.now() - t0) / 1000 };
  const dest = process.argv[2];
  if (dest) { fs.mkdirSync(path.dirname(path.resolve(dest)), { recursive: true }); fs.writeFileSync(path.resolve(dest), JSON.stringify(out, null, 1) + '\n'); }
  console.log(JSON.stringify(out, null, 1));
}
if (IS_MAIN) await main();

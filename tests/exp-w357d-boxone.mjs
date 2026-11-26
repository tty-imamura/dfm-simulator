// 第357便d(原仮定者の指示(2026-11-21)「論文2: 主にgeoPN=0を使用。「もしも宇宙に天体が１つだけだったら」の思考実験で始まる。…」・統括の検証項目 R525):
//   **天体が 1 つだけの箱の本 ☝️ boxone の器**(段 boxone-357d —— 正本 tests/out/boxone-w357d.json・lib tests/lib-w357d-boxone.mjs)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で vm に読み、html の本文の受理器・build・步をそのまま実行 —— 本の JSON は 1 bit も変えない)。
// 他の正本は読まない。
//
// ■ 何をするか(門の宣言 DECL は lib —— 走行の前に置く・結果を見て変えない)
//   count     本を受理して組み、箱の中の質量を持つ天体の数・壁の質点の数・試験粒子の数・試験粒子の契約の入場を数える
//   trans     本(並進あり)と、並進を引いた写し(全部の vx から 6 を引く —— bulkVx と vx)を 600 步ずつ走らせ、天体と見張りの粒の相対の位置・相対の速さ・時計の比 τ/t を比べる
//   rerun     本を 2 回組んで 600 步 —— 位置・速度・時計のビットの sha256 が同じ
//   conserve  2 つの走行の 600 步の運動量(+ リザーバ)とエネルギー(並進 + 自転)の変化
//   readings  (門ではない)回る壁(🌀 と同じ Ω = 0.15 のレール)・膨らむ壁(📈 と同じ railH = 0.005)の写しの 1 步めのフレームの利得を半径 70・130 で、天体あり/なし・
//             天体の自転(s = 0.5)だけの写しの利得・天体の位置の決定力 sumW(天体の質量を 10 倍にした写しでも同じか)
// ■ 所要: 1 プロセス・数秒(枝の実測は正本の elapsedS)
// ■ 言わないこと: 「天体が 1 つなら何も検知できない」とは書かない(門で見た 3 つの量だけ)。現実の宇宙が箱である・天体が 1 つである、とは書かない。自己の力が在る・無いの結論は書かない(未解決 U2-1 のまま)。
//
// 使い方: node tests/exp-w357d-boxone.mjs   W357D_OUT=<json>(試走)・W357D_TARGET=<html>(既定 beta/index.html)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w357d-boxone.mjs';
// 第281便a の領域 hash の宣言(器と lib と import の閉包から deriveScope で引いた下限。器が引く本は ☝️ の 1 本〔.find —— physics と bodies を読む〕・エンジンを走らせる〔core:true〕)
const REGEN_SCOPE = {"presets":["boxone"],"roots":["HP.allPresets","HP.validatePreset","T","appStepDt","ctx","makeSim","xkLockPhysicsCopy"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w357d-boxone-1';
export const OUT_MAIN = 'tests/out/boxone-w357d.json';
export const BOOK_ID = 'boxone';
const SELF = fileURLToPath(import.meta.url);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === SELF;
const clone = (x) => JSON.parse(JSON.stringify(x));
const fx = (x) => Number(x.toFixed(9));

export const NOT_CLAIM = Object.freeze([
  '「天体が 1 つなら何も検知できない」とは主張しない —— 門で見たのは相対の位置・相対の速さ・時計の比の 3 つの量だけ',
  '現実の宇宙が箱である・天体が 1 つである、とは主張しない(思考実験の入口の本)',
  '自己の力が在る・無いの結論は出していない —— 今の模型では自己の項は 0(未解決 U2-1 のまま)',
  '回転と膨張の読み(利得)は写しの 1 步めの量で、本では回さない・膨らませない —— 新しい式は足していない']);

/** 本を組む(受理器 → 物理対応ロックの写し → makeSim → build)—— loadPreset の build の前と同じ並び */
function buildBook(H, preset) {
  const v = H.HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + (v.errors || []).join(' / '));
  const m = clone(v.preset); m.physics = H.evalExpr('xkLockPhysicsCopy')(m.physics);
  const S = H.evalExpr('makeSim')(); S.build(m);
  return S;
}
/** 並進を引いた写し(全部の x 向きの速度から V を引く) */
function unTranslated(book, V) {
  const c = clone(book);
  for (const b of c.bodies) {
    if (b.type === 'single') b.vx = b.vx - V;
    else b.bulkVx = (b.bulkVx || 0) - V;
  }
  return c;
}
const wallEnd = (book) => book.bodies[0].n;   // 壁は宣言の 0 番の群(質点リング)
function fpOf(S) {
  const h = crypto.createHash('sha256');
  for (const k of ['x', 'y', 'vx', 'vy', 'tau', 'spin']) h.update(Buffer.from(S[k].buffer, S[k].byteOffset, S[k].byteLength));
  h.update(String(S.t));
  return h.digest('hex');
}
function runN(S, N, dt) { for (let k = 0; k < N; k++) S.step(dt); }
/** 回る壁・膨らむ壁・天体の自転の写しの 1 步めのフレームの利得(半径ごとの平均 —— ut/(Ω r)・ur/(H r)) */
function gainOf(S, iA, iB, kind, rate) {
  let g = 0;
  for (let i = iA; i < iB; i++) {
    const x = S.x[i], y = S.y[i], r = Math.hypot(x, y);
    const ut = (-y * S.uPx[i] + x * S.uPy[i]) / r, ur = (x * S.uPx[i] + y * S.uPy[i]) / r;
    g += (kind === 'exp' ? ur : ut) / (rate * r);
  }
  return fx(g / (iB - iA));
}

export function measure(H) {
  const HP = H.HP, book = clone(HP.allPresets().find((q) => q.id === BOOK_ID));
  const nW = wallEnd(book);
  // ── count
  const S0 = buildBook(H, book), parts = [];
  for (let i = 0; i < S0.n; i++) parts.push({ wall: i < nW, test: S0.tpFlag[i] === 1, m: S0.m[i] });
  const cnt = L.countBodies(parts);
  let iBody = -1; for (let i = nW; i < S0.n; i++) if (!parts[i].test) { iBody = i; break; }
  const count = { ...cnt, n: S0.n, iBody, bodyMass: S0.m[iBody], wallMass: nW * S0.m[0], testParticleOn: S0.hasTestParticle === true, deny: S0.testParticleDeny, tpN0: S0.tpN0,
    geoPN: book.physics.geoPN, G: book.physics.G, D0: book.physics.D0, kFrame: book.physics.kFrame };
  // ── trans / conserve
  const dt = H.evalExpr('appStepDt')(S0), N = L.DECL.steps, V = L.DECL.bulkV;
  const SA = buildBook(H, book), SB = buildBook(H, unTranslated(book, V));
  const stat = (S) => { const T = S.totals(), E = S.energies(); let pS = 0, eS = 0; for (let i = 0; i < S.n; i++) { const sp = Math.hypot(S.vx[i], S.vy[i]); pS += S.m[i] * sp; eS += 0.5 * S.m[i] * sp * sp; } return { p: [T.px, T.py], e: E.kin + E.rot, pS, eS }; };
  const a0 = stat(SA), b0 = stat(SB);
  runN(SA, N, dt); runN(SB, N, dt);
  const rows = [];
  for (let i = iBody + 1; i < SA.n; i++) rows.push({ rA: [SA.x[i] - SA.x[iBody], SA.y[i] - SA.y[iBody]], rB: [SB.x[i] - SB.x[iBody], SB.y[i] - SB.y[iBody]],
    vA: [SA.vx[i] - SA.vx[iBody], SA.vy[i] - SA.vy[iBody]], vB: [SB.vx[i] - SB.vx[iBody], SB.vy[i] - SB.vy[iBody]], tauA: SA.tau[i] / SA.t, tauB: SB.tau[i] / SB.t });
  const tc = L.transCompare(rows);
  const trans = { steps: N, dt, t: SA.t, bulkV: V, ...tc,
    tauOverT: { comoving: SA.tau[SA.n - 2] / SA.t, proper: SA.tau[SA.n - 1] / SA.t, probeRingMin: Math.min(...rows.slice(0, 8).map((r) => r.tauA)), probeRingMax: Math.max(...rows.slice(0, 8).map((r) => r.tauA)) },
    tauSameBits: rows.every((r) => r.tauA === r.tauB), nanA: SA.hasNaN(), nanB: SB.hasNaN() };
  const a1 = stat(SA), b1 = stat(SB);
  const conserve = {
    A: L.conserveOf({ p0: a0.p, p1: a1.p, res1: [SA.resPx || 0, SA.resPy || 0], e0: a0.e, e1: a1.e, pScale: a0.pS, eScale: a0.eS }),
    B: L.conserveOf({ p0: b0.p, p1: b1.p, res1: [SB.resPx || 0, SB.resPy || 0], e0: b0.e, e1: b1.e, pScale: b0.pS, eScale: b0.eS }),
  };
  // ── rerun
  const R1 = buildBook(H, book), R2 = buildBook(H, book); runN(R1, N, dt); runN(R2, N, dt);
  const h1 = fpOf(R1), h2 = fpOf(R2), hA = fpOf(SA);
  const rerun = { steps: N, same: h1 === h2 && h1 === hA };
  // ── readings(門ではない)
  const RD = L.DECL.readings, readings = { rot: [], exp: [], spin: null, selfW: null };
  const wallFree = clone(book.bodies[0]); wallFree.bulkVx = 0;
  const probeRing = (r) => ({ type: 'ring', n: 8, cx: 0, cy: 0, rIn: r, rOut: r, mMin: 0.05, mMax: 0.05, spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, omega: 0, vNoise: 0, direction: 1, pinned: false, testParticle: true });
  const copyWith = (wall, bodyM, spin) => { const c = clone(book); c.bodies = [wall].concat(bodyM > 0 ? [{ type: 'single', m: bodyM, x: 0, y: 0, vx: 0, vy: 0, spin, pinned: false }] : []).concat(RD.radii.map(probeRing)); return c; };
  const wallRot = { ...wallFree, pinned: true, vMode: 'omega', omega: RD.rotOmega }, wallExp = { ...wallFree, pinned: true, railH: RD.expH };
  for (const [kind, wall, rate] of [['rot', wallRot, RD.rotOmega], ['exp', wallExp, RD.expH]]) for (const bm of [0, L.DECL.body.m]) {
    const S = buildBook(H, copyWith(wall, bm, 0)); S.step(dt);
    readings[kind].push({ bodyM: bm, gain: RD.radii.map((r, j) => gainOf(S, S.n - 8 * (RD.radii.length - j), S.n - 8 * (RD.radii.length - j - 1), kind, rate)), testParticleOn: S.hasTestParticle === true });
  }
  { const S = buildBook(H, copyWith(wallFree, L.DECL.body.m, RD.spin)); S.step(dt);
    readings.spin = { s: RD.spin, R: S.R[nW], q: S.params.q, gain: RD.radii.map((r, j) => gainOf(S, S.n - 8 * (RD.radii.length - j), S.n - 8 * (RD.radii.length - j - 1), 'rot', RD.spin)) }; }
  { const W = []; for (const mul of [1, RD.massMul]) { const c = clone(book); c.bodies[1].m = L.DECL.body.m * mul; const S = buildBook(H, c); S.step(dt); W.push(S.sumW[nW]); }
    readings.selfW = { massMul: RD.massMul, sumWAtBody: W.map(fx), sameUnderMassMul: W[0] === W[1] }; }
  return { count, trans, conserve, rerun, readings, book: { id: BOOK_ID, emoji: book.emoji, group: book.group, physics: book.physics, nBodies: S0.n } };
}

export function gatesOf(J) { return L.gatesFrom(J); }

export async function main() {
  const TARGET = process.env.W357D_TARGET || 'beta/index.html';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const OUT = process.env.W357D_OUT ? (path.isAbsolute(process.env.W357D_OUT) ? process.env.W357D_OUT : path.join(ROOT, process.env.W357D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  console.log('第357便d boxone(版 ' + HARNESS_VERSION + ')');
  const tm = Date.now(), M = measure(H), measSec = (Date.now() - tm) / 1000;
  const J = { ...M, selfTest: L.selfTest(), pageErrors: H.errors.slice(0, 5), timing: { measure: { wallSec: measSec } } };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w357d-boxone.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の指示(2026-11-21)「論文2: 主にgeoPN=0を使用。「もしも宇宙に天体が１つだけだったら」の思考実験で始まる。…」・統括の検証項目 R525',
    decl: L.DECL, notClaim: NOT_CLAIM, ...J };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w357d-boxone.mjs', 'tests/lib-w357d-boxone.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'].filter((f) => fs.existsSync(path.join(ROOT, f)));
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第357便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'boxone-357d', engine: 'Node(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文の受理器・build・步をそのまま実行)・☝️ の宣言と並進を引いた写しと読みの写しを走らせる', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

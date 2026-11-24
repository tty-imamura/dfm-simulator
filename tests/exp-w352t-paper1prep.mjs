// 第352便t(原仮定者の指示(2026-11-21 —— 第145報)「論文の改訂案」・原仮定者の回答(2026-11-21 —— 第145報の回答 1)AN925・統括の検証項目 R457):
//   **論文1 の本文の改訂の前に要る検証の器**(docs/PAPER_PLAN.md §2 ⑧ の V1-1・V1-4・V1-3 —— 段 paper1prep-352t・正本 tests/out/paper1prep-352t.json・
//   lib tests/lib-w352t-paper1prep.mjs)。**診断だけ** —— html・内蔵の本・エンジン・受理器・論文の本文と図・既存の lib の本文は変えない。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で vm に読み、html の本文の受理器・build・步をそのまま実行 ——
//   本の宣言は写しを作って geoPN だけを 1 にする。内蔵の本の JSON は 1 bit も変えない)。1 プロセス。
//
// ■ 何をするか
//   t1(V1-1)GPS・太陽縁の偏向・シャピロ遅延・時計・光の本(🛰️ grcal・🕰️ grcalGps・🌟 grcalLight・⏲️ grcalShapiro・⏱️ gclock)を、宣言のまま(geoPN=0)と
//            geoPN だけを 1 にした写しで走らせ、既存の鍵 grcal.clocks・grcal.rays・behavior.grcal3 が見ている量を並べる(差・相対の差)。
//   t2(V1-4)照合の表: 模型の値(エンジンの式の出力 HP.grSI と 🛰️ の説明文の正典)・換算の規約(X_k = G_0/c_0² —— 本の宣言・grcal.calib-text の字句)・
//            観測の値(リポジトリに既に在る数だけ —— 論文1 の日本語版の照合の表と 🛰️ の説明文の字句から拾う。「文献の値・未照合」)。
//   t3(V1-3)水星の近点の一次の項: 第344便b の正本(tests/out/partyconv-344b.json)の「現行の近似」の列と主の候補の列を、行 = 項・列 = 候補の形に写す(数は逐語)。
// ■ 言わないこと: geoPN=1 で観測に合った・論文の主張が確かめられた、とは書かない(模型の値と、文献の値・未照合の列を並べるだけ)。
//
// 使い方: node tests/exp-w352t-paper1prep.mjs   W352T_OUT=<json>(試走)・W352T_TARGET=<html>(既定 beta/index.html)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w352t-paper1prep.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 5 本〔.find —— physics・bodies・rays を読む〕・
//   エンジンを走らせる〔core:true〕・本の abBody は読まない〔abBody:false —— A/B は走らせない〕)
const REGEN_SCOPE = {"presets":["gclock","grcal","grcalGps","grcalLight","grcalShapiro"],"roots":["$","HP.allPresets","HP.geoLawOfSim","HP.sim","HP.validatePreset","T","ctx"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352t-paper1prep-1';
export const OUT_MAIN = 'tests/out/paper1prep-352t.json';
export const AMEND = Object.freeze([]);
const SELF = fileURLToPath(import.meta.url);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === SELF;
const clone = (x) => JSON.parse(JSON.stringify(x));
export const NOT_CLAIM = Object.freeze([
  'geoPN=1 で観測に合ったとは書かない —— 宣言のままの値と geoPN だけを 1 にした写しの値を並べただけ(同じ・変わるの数)',
  '論文の主張が確かめられたとは書かない —— 照合の表は、模型の値・換算の規約・文献の値(未照合)を 1 つの表に並べただけ',
  '観測の値は足していない —— リポジトリに既に在る字句(論文1 の日本語版の照合の表・🛰️ の説明文)から拾った数だけ。シャピロ遅延の観測の遅延の値はリポジトリに無い',
  '水星の近点の表は第344便b の正本の写し(誇張した場 μ = 1e-5 の比)—— 水星の観測の値へ合わせたものではない・どの列を採るかを決めない',
  '内蔵の本・エンジン・受理器・論文の本文と図は変えない(geoPN=1 の写しは器の中だけ)']);
export const PLAN = Object.freeze({
  t1: '本 5 つ × geoPN 0・1(宣言のままと、geoPN だけを 1 にした写し)—— 受理・走る法則・既存の鍵の量(τ/t・解析の式との差・偏向の比・遅れの比)の差と相対の差',
  t2: '模型の値(HP.grSI・🛰️ の説明文の正典)・換算の規約(本 4 つの X_k と G_0 ÷ c_0²・SI の X_k = G/c²・grcal.calib-text の字句)・観測の値(リポジトリの字句から拾う)',
  t3: '第344便b の正本の t1(水星の型 e 0.2056・受け手)と added から、4 列(現行の近似・主の候補・比べる列 2)× 6 行の写し',
});

/* ───────── t1: 本ごとの量 ───────── */
function build(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) return { S: null, v };
  HP.sim.build(clone(v.preset));
  return { S: HP.sim, v };
}
const MEAS = {
  grcal(S, b) {
    for (let k = 0; k < b.steps; k++) S.step(b.dt);
    const eps = S.params.softening, c0 = S.params.cLight, M = S.m[0], PSI = (w) => w * S.params.kappaT;
    const psiG = PSI(M / Math.sqrt(60 * 60 + eps * eps) + 2 / Math.sqrt(120 * 120 + eps * eps));
    const rS = Math.hypot(S.x[2], S.y[2]), dG = Math.hypot(S.x[2] - S.x[1], S.y[2] - S.y[1]);
    const psiS = PSI(M / Math.sqrt(rS * rS + eps * eps) + 2 / Math.sqrt(dG * dG + eps * eps));
    const v = Math.hypot(S.vx[2], S.vy[2]), N = Math.exp(-psiS), A = Math.exp(psiS), thS = Math.sqrt(N * N - A * A * v * v / (c0 * c0));
    const g = S.tau[1] / S.t, sat = S.tau[2] / S.t;
    return [['地上の時計 τ/t', g], ['衛星の時計 τ/t', sat], ['地上の時計 ÷ e^(−ψ) − 1 の大きさ', Math.abs(g - Math.exp(-psiG)) / Math.exp(-psiG)],
      ['衛星の時計 ÷ √(N² − A²v²/c₀²) − 1 の大きさ', Math.abs(sat - thS) / thS], ['衛星が地上より速く進む', sat > g], ['衛星の軌道の半径(終わり)', rS], ['NaN', S.hasNaN()]];
  },
  grcalGps(S, b) {
    for (let k = 0; k < b.steps; k++) S.step(b.dt);
    const c0 = S.params.cLight, tG = S.tau[1] / S.t, tS = S.tau[2] / S.t, tR = S.tau[3] / S.t, vSat = Math.hypot(S.vx[2], S.vy[2]);
    return [['地上の時計 τ/t', tG], ['衛星の時計 τ/t', tS], ['参照の時計 τ/t', tR], ['順 地上 < 衛星 < 参照', tG < tS && tS < tR],
      ['重力項 ÷ 運動項(一次)', (Math.log(tR) - Math.log(tG)) / (vSat * vSat / (2 * c0 * c0))], ['衛星の軌道の半径(終わり)', Math.hypot(S.x[2], S.y[2])], ['NaN', S.hasNaN()]];
  },
  grcalLight(S, b) {
    const bL = Math.abs(S.y[1]), ML = S.m[0], GL = S.params.G, cL = S.params.cLight;
    let a0 = null, aF = null, yF = null;
    for (let k = 0; k < b.steps && aF === null; k++) {
      S.step(b.dt);
      if (S.photons && S.photons.length) { const ph = S.photons[0]; if (a0 === null) a0 = Math.atan2(ph.dy, ph.dx); if (ph.x >= S.x[2]) { aF = Math.atan2(ph.dy, ph.dx); yF = ph.y; } }
    }
    const defl = (a0 !== null && aF !== null) ? a0 - aF : null, an = 4 * GL * ML / (cL * cL * bL);
    return [['光子の偏向(rad)', defl], ['弱場一次 4GM/(c₀²b)(rad)', an], ['偏向 ÷ 弱場一次', defl === null ? null : defl / an], ['観測者を外す距離', yF === null ? null : Math.abs(bL - yF)], ['NaN', S.hasNaN()]];
  },
  grcalShapiro: null,   // 2 回走らせる(下の shapiro)
  gclock(S, b) {
    for (let k = 0; k < b.steps; k++) S.step(b.dt);
    const out = [];
    for (let i = 0; i < S.n; i++) out.push([`粒子 ${i} の τ/t`, S.tau[i] / S.t]);
    out.push(['NaN', S.hasNaN()]);
    return out;
  },
};
function shapiro(HP, preset, b) {
  const run = (kap) => {
    const { S } = build(HP, preset); S.params.kappaT = kap;
    for (let k = 0; k < b.steps; k++) { S.step(b.dt); if (S.photons && S.photons.length && S.photons[0].x >= L.DECL.shapiroX) return { t: S.t, nan: S.hasNaN() }; }
    return { t: null, nan: S.hasNaN() };
  };
  const { S, v } = build(HP, preset);
  const sp = S.params, bS = Math.abs(S.y[1]), x1 = Math.abs(S.x[1]), MS = S.m[0], kap = v.preset.physics.kappaT;
  const w1 = run(kap), w0 = run(0), asinh = (x) => Math.log(x + Math.sqrt(x * x + 1));
  const delay = w1.t !== null && w0.t !== null ? w1.t - w0.t : null, an = (2 * sp.G * MS / Math.pow(sp.cLight, 3)) * (asinh(x1 / bS) + asinh(L.DECL.shapiroX / bS));
  return [['x = 300 を通る時刻(X_k 宣言)', w1.t], ['x = 300 を通る時刻(X_k = 0)', w0.t], ['遅れ', delay], ['有限の幾何のシャピロ形', an], ['遅れ ÷ シャピロ形', delay === null ? null : delay / an], ['NaN', w1.nan || w0.nan]];
}
export function t1Of(HP) {
  const rows = [], books = [];
  for (const b of L.DECL.books) {
    const p0 = HP.allPresets().find((q) => q.id === b.id);
    const res = {}, info = { id: b.id, key: b.key, steps: b.steps, dt: b.dt, decl0: p0.physics.geoPN === undefined ? 0 : p0.physics.geoPN };
    for (const g of L.DECL.geoPNs) {
      const q = clone(p0); q.physics.geoPN = g;
      const { S, v } = build(HP, q);
      info['ok' + g] = v.ok === true;
      info['warn' + g] = (v.warnings || []).length === 0 ? 'なし' : (v.warnings || []).length + ' 件';
      if (!S) { res[g] = null; continue; }
      info['law' + g] = HP.geoLawOfSim(S); info['kFrame' + g] = S.params.kFrame; info['geoPNRun' + g] = S.params.geoPN;
      res[g] = b.id === 'grcalShapiro' ? shapiro(HP, q, b) : MEAS[b.id](S, b);
    }
    books.push(info);
    const r0 = res[0] || [], r1 = res[1] || [];
    for (let j = 0; j < r0.length; j++) {
      const [qn, v0] = r0[j], v1 = r1[j] ? r1[j][1] : null;
      const d = typeof v0 === 'number' && typeof v1 === 'number' ? L.relDiff(v0, v1) : { diff: null, rel: null };
      rows.push({ book: b.id, q: qn, v0, v1, diff: d.diff, rel: d.rel, same: typeof v0 === 'number' ? L.sameOf(d.rel) : (v0 === v1 ? true : false) });
    }
  }
  // 光線ファンの宣言(grcal.rays —— 宣言の量。geoPN の写しで変えない欄)
  for (const id of ['grcal', 'grcalLight', 'grcalShapiro']) {
    const p0 = HP.allPresets().find((q) => q.id === id), q = clone(p0); q.physics.geoPN = 1;
    const v1 = HP.validatePreset(clone(q)), n0 = p0.rays ? p0.rays.n : null, n1 = v1.ok && v1.preset.rays ? v1.preset.rays.n : null;
    rows.push({ book: id, q: '光線ファンの本数(宣言)', v0: n0, v1: n1, diff: n0 === null || n1 === null ? null : n1 - n0, rel: n0 === null || n1 === null ? null : L.relDiff(n0, n1).rel, same: n0 === n1 });
  }
  const nNum = rows.filter((r) => typeof r.v0 === 'number' && r.q !== 'NaN').length;
  return { rows, books, nRows: rows.length, nNum, nSame: rows.filter((r) => r.same === true).length, nChanged: rows.filter((r) => r.same === false).length };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const g = (id, q, k) => { const r = J.t1.rows.find((x) => x.book === id && x.q === q); return r ? r[k] : undefined; };
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1Books: J.t1.books.length === L.DECL.books.length && J.t1.books.every((b) => b.ok0 && b.ok1 && b.decl0 === 0 && b.geoPNRun0 === 0 && b.geoPNRun1 === 1),
    t1Rows: J.t1.rows.every((r) => r.v0 !== null && r.v1 !== null) && J.t1.rows.filter((r) => r.q === 'NaN').every((r) => r.v0 === false && r.v1 === false),
    t1Base: g('grcal', '地上の時計 ÷ e^(−ψ) − 1 の大きさ', 'v0') < 2e-3 && g('grcal', '衛星の時計 ÷ √(N² − A²v²/c₀²) − 1 の大きさ', 'v0') < 2e-3 && g('grcal', '衛星が地上より速く進む', 'v0') === true
      && g('grcalGps', '順 地上 < 衛星 < 参照', 'v0') === true && g('grcalLight', '偏向 ÷ 弱場一次', 'v0') > 0.9 && g('grcalLight', '偏向 ÷ 弱場一次', 'v0') < 1.1
      && g('grcalShapiro', '遅れ ÷ シャピロ形', 'v0') > 0.9 && g('grcalShapiro', '遅れ ÷ シャピロ形', 'v0') < 1.25,
  };
}

export function runAll(H) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = t1Of(H.HP); mark('t1');
  const J = { pure, t1, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** 来歴の code の一覧(器・lib と、刻印の道具 3 本 —— 第339便a の器と同じ形) */
export function codeClosure() {
  return ['tests/exp-w352t-paper1prep.mjs', 'tests/lib-w352t-paper1prep.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
}

/** 照合(QA が呼ぶ —— 数でない欄は完全一致・数は相対 1e-9 か、行の geoPN=0 の値の大きさの 1e-9 倍の内) */
export function compareOf(fresh, canon) {
  const hits = [];
  const w = (x, y, pth, scale) => {
    if (typeof x === 'number' || typeof y === 'number') {
      if (typeof x !== 'number' || typeof y !== 'number') { hits.push(pth); return; }
      if (x === y) return;
      const lim = 1e-9 * Math.max(Math.abs(x), Math.abs(y), scale || 0);
      if (!(Math.abs(x - y) <= lim)) hits.push(pth);
      return;
    }
    if (x === null || y === null || typeof x !== 'object' || typeof y !== 'object') { if (x !== y) hits.push(pth); return; }
    const sc = typeof x.v0 === 'number' ? Math.abs(x.v0) : scale;
    for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) w(x[k], y[k], pth + '/' + k, k === 'rel' ? 1e-3 : sc);
  };
  w(fresh, canon, '', 0);
  return hits;
}

export async function main() {
  const TARGET = process.env.W352T_TARGET || 'beta/index.html';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const OUT = process.env.W352T_OUT ? (path.isAbsolute(process.env.W352T_OUT) ? process.env.W352T_OUT : path.join(ROOT, process.env.W352T_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const H = loadHtmlHeadless(html);
  console.log('第352便t paper1prep(版 ' + HARNESS_VERSION + ')');
  const R = runAll(H), tm = R.timing; delete R.timing;
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352t-paper1prep.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の指示(2026-11-21 —— 第145報)「論文の改訂案」・原仮定者の回答(2026-11-21 —— 第145報の回答 1)AN925・統括の検証項目 R457',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R, pageErrors: H.errors.slice(0, 5), timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便t', target: TARGET, code: codeClosure(), inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'paper1prep-352t', engine: 'Node(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文の受理器・build・步をそのまま実行)・本の宣言の写し(geoPN だけを 1)を走らせる・1 プロセス', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

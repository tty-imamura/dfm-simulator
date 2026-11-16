// 第340便g(原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-14 —— AN725 = A)・統括の検証項目 R362):
//   **銀河を流体と見る探索の続きの器 —— T1 標本の並び(乱数・準一様・ガラス)× N × 種で、引きずりの大きさと補正の向きが並びと種に依るか/T2 刻み h・h/2・h/4 の収束(速度の場と慣性の項の列)**
//   (段 fluidconv-340g —— 正本 tests/out/fluidconv-340g.json・lib tests/lib-w340g-fluidconv.mjs・文書の lib tests/lib-w340g-fluidconvdoc.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・第337便e と第335便f の lib の本文は変えない(呼ぶだけ)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w340g-fluidconv.mjs —— 領域の宣言なし)。入力のファイルは無い(標本は種を宣言した自前の乱数〔第333便d の rngOf〕から)。1 プロセス。
//   正本へ書く出力は第338便c の settleRun(Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度とし、尺度の 4 倍の内の葉〔丸めの残り〕を 0 と書く)。
//
// ■ 走らせた格子と判定の物差し(式の形の宣言ではなく、何を測ったかの記録 —— PLAN。後から型やノブを足したら AMEND に理由と一緒に書く)
//   T1(静的): 切った Plummer 球(G = M = a = 1)× 並び random・quasi・glass × N 64・128・256・512 × 種 1・2・3 × 速度の場 diff(Ω₀ 0.5)・rigid(Ω 0.5)× 軟化 ε 0.05 × 重み α 2 ×
//     自己の重み none・B(体積の内の積分 —— 解析の密度)の row の引きずり + B の symCentral。量は lib の staticRow(自己の分け前・全体の重みの連続の場との差・RMS|d|/RMS|V|・
//     連続の引きずりとの差・外縁の速さの比・角運動量の率・運動量の率)と並びの質 CV_nn。
//     補正の向き(符号を読む量): 全体の重みの差の符号(none)・B が連続の場へ寄せるか(|差_B| < |差_none|)・外縁の速さの比 − 1 の符号(none)・角運動量の率の符号(none と B)。
//     揃いの割合 = 多い側の符号の数 ÷ 本数(並び 3 × 種 3 = 9 本 —— N と場ごと)。物差し: 9/9 を「並びと種に依らない」・7/9 以上を「ほぼ揃う」・それ未満を「並びか種に依る」。
//     大きさのばらつき = 種の間の (最大 − 最小)/平均。N の依存 = ln(Q₅₁₂/Q₆₄)/ln 8(種の平均)—— |傾き| < 0.1 を「この並びでは N に依らない」(第337便e と同じ物差し)。
//   T2(動的・刻み): 並び 3 × 種 1 × N 256 × 窓 1 t_cr × 刻み h = t_cr/50・h/2・h/4 × 作用 重力だけ・速度の場(陽 —— 第337便e の vel)・慣性の項の列(速度を直接置かず、
//     運ばれた速度 v + d へ時定数 τ で寄せる加速度 d/τ —— 第337便e の push の γ = 1/τ)τ 0.1・0.03 t_cr × 自己の重み B(解析の密度)の row。
//     速度は同じ種の random の標本から半径の順位で写す + 回転の支え(第335便f の rotateOf)。量: 外縁の V_φ の比・L_z の比・r50 の相対の変化・2K/|W|・E の相対の変化(1 t_cr の後)。
//     e₁・e₂・見かけの次数 p・外挿(lib の convOf)。物差し: e₂ ≤ e₁/2 を「刻みで決まる向き」・重力だけの列を混沌の床として並べる。
// ■ 言わないこと: 表は宣言した並び・刻み・N・ノブの組の測った数(銀河の回転曲線・流体の計算の解ではない)・N は解像の要素の数・軟化は宣言の長さ・観測の銀河の値に合わせない・主列は W₀ = 0。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w340g-fluidconv.mjs';
import * as F7 from './lib-w337e-fluid.mjs';
import * as E5 from './lib-w335f-elliptical.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w340g-fluidconv-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/fluidconv-340g.json';
export const TARGET = 'tests/lib-w340g-fluidconv.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['表は宣言した並び・刻み・N・ノブの組の測った数 —— 銀河の回転曲線や流体の計算の解ではない', 'N は解像の要素の数(実在の星の数ではない)',
  '軟化 ε とガラスの緩めの長さは宣言の長さ', '慣性の項の列の τ はノブ(物理の時定数の主張ではない)', '観測の銀河の値に合わせない', '主列は W₀ = 0',
  '軸引きずりの新しい定義(部位差分)はこの器に入れていない —— 並びと刻みの数値の題だけ']);
export const PLAN = Object.freeze({
  model: 'plummer', eps: 0.05, alpha: 2,
  t1: Object.freeze({ arrangements: L.ARRANGEMENTS, Ns: Object.freeze([64, 128, 256, 512]), seeds: Object.freeze([1, 2, 3]), fields: Object.freeze(['diff', 'rigid']), rules: Object.freeze(['none', 'B']),
    agreeAll: 9, agreeMost: 7, slopeFlat: 0.1 }),
  t2: Object.freeze({ arrangements: L.ARRANGEMENTS, N: 256, seed: 1, windowTcr: 1, stepsPerTcr: 50, hdivs: Object.freeze([1, 2, 4]), everyPerTcr: 25,
    actions: Object.freeze(['grav', 'velE', 'inert0.1', 'inert0.03']), self: 'B', rhoMode: 'analytic', keys: Object.freeze(['vphiOuterRatio', 'LzRatio', 'r50', 'vir', 'dE']) }),
});
const SC = E5.scalesOf('plummer');
const sgn = (x) => (fin(x) ? (x > 0 ? 1 : x < 0 ? -1 : 0) : null);
const mean = (a) => (a.length && a.every(fin) ? a.reduce((s, x) => s + x, 0) / a.length : null);
const spreadRel = (a) => { const m = mean(a); return m === null || m === 0 ? null : (Math.max(...a) - Math.min(...a)) / Math.abs(m); };
const agreeOf = (signs) => { const p = signs.filter((s) => s === 1).length, n = signs.filter((s) => s === -1).length; return { plus: p, minus: n, zero: signs.length - p - n, frac: Math.max(p, n) / signs.length, major: p >= n ? 1 : -1 }; };
const judgeOf = (a, P = PLAN.t1) => (Math.max(a.plus, a.minus) >= P.agreeAll ? 'all' : Math.max(a.plus, a.minus) >= P.agreeMost ? 'most' : 'depends');

/* ───────── T1 ───────── */
export function t1Rows() {
  const P = PLAN.t1, tab = F7.continuumTable(PLAN.eps, F7.rCutOf()), rows = [];
  for (const arr of P.arrangements) for (const N of P.Ns) for (const seed of P.seeds) for (const field of P.fields) rows.push(L.staticRow({ arr, N, seed, field, eps: PLAN.eps, table: tab }));
  return rows;
}
/** 向きの読み(1 本) */
export function dirsOf(r) {
  return { biasNone: sgn(r.none.wTotBias), bCloser: Math.abs(r.B.wTotBias) < Math.abs(r.none.wTotBias) ? 1 : -1, outerNone: sgn(r.none.outerRatio - 1), outerB: sgn(r.B.outerRatio - 1),
    torqueNone: sgn(r.none.torqueRate), torqueB: sgn(r.B.torqueRate) };
}
export const DIR_KEYS = Object.freeze(['biasNone', 'bCloser', 'outerNone', 'outerB', 'torqueNone', 'torqueB']);
export function t1Summary(rows) {
  const P = PLAN.t1, agree = [], arrStats = [], slopes = [];
  for (const field of P.fields) for (const N of P.Ns) {
    const sel = rows.filter((r) => r.field === field && r.N === N), D = sel.map(dirsOf), out = { field, N, n: sel.length };
    for (const k of DIR_KEYS) { const a = agreeOf(D.map((d) => d[k])); out[k] = Object.assign(a, { judge: judgeOf(a) }); }
    // 並びの内(種 3)の揃い
    out.withinArr = Object.fromEntries(P.arrangements.map((arr) => { const Dd = sel.filter((r) => r.arr === arr).map(dirsOf); return [arr, Object.fromEntries(DIR_KEYS.map((k) => [k, agreeOf(Dd.map((d) => d[k])).frac]))]; }));
    agree.push(out);
    for (const arr of P.arrangements) {
      const s = sel.filter((r) => r.arr === arr), g = (rule, k) => s.map((r) => r[rule][k]);
      arrStats.push({ field, N, arr, cv: mean(s.map((r) => r.cv)),
        none: { dOverV: mean(g('none', 'dOverV')), dOverVSpread: spreadRel(g('none', 'dOverV')), wTotBias: mean(g('none', 'wTotBias')), outerRatio: mean(g('none', 'outerRatio')), torqueRate: mean(g('none', 'torqueRate')), contErr: mean(g('none', 'contErr')) },
        B: { dOverV: mean(g('B', 'dOverV')), dOverVSpread: spreadRel(g('B', 'dOverV')), wTotBias: mean(g('B', 'wTotBias')), outerRatio: mean(g('B', 'outerRatio')), torqueRate: mean(g('B', 'torqueRate')), contErr: mean(g('B', 'contErr')), shareMean: mean(g('B', 'shareMean')) },
        symB: { torqueRate: Math.max(...s.map((r) => Math.abs(r.symB.torqueRate))), momRate: Math.max(...s.map((r) => r.symB.momRate)) },
        momRateRow: Math.max(...s.map((r) => Math.max(r.none.momRate, r.B.momRate))) });
    }
  }
  for (const field of P.fields) for (const arr of P.arrangements) {
    const at = (N) => arrStats.find((x) => x.field === field && x.arr === arr && x.N === N), a = at(P.Ns[0]), b = at(P.Ns[P.Ns.length - 1]), lg = Math.log(P.Ns[P.Ns.length - 1] / P.Ns[0]);
    const sl = (x, y) => (fin(x) && fin(y) && x !== 0 && y !== 0 ? Math.log(Math.abs(y) / Math.abs(x)) / lg : null);
    const o = { field, arr, dOverVNone: sl(a.none.dOverV, b.none.dOverV), dOverVB: sl(a.B.dOverV, b.B.dOverV), shareB: sl(a.B.shareMean, b.B.shareMean), wTotBiasB: sl(a.B.wTotBias, b.B.wTotBias), contErrB: sl(a.B.contErr, b.B.contErr) };
    o.dependB = o.dOverVB === null ? '—' : Math.abs(o.dOverVB) < P.slopeFlat ? 'flat' : Math.abs(o.dOverVB) < 0.5 ? 'weak' : 'strong';
    slopes.push(o);
  }
  // 並びの間の大きさの比(B の RMS|d|/RMS|V| の並びの最大 ÷ 最小 —— 場と N ごと)
  const between = [];
  for (const field of P.fields) for (const N of P.Ns) { const v = P.arrangements.map((arr) => arrStats.find((x) => x.field === field && x.N === N && x.arr === arr).B.dOverV); between.push({ field, N, maxOverMin: Math.max(...v) / Math.min(...v) }); }
  return { agree, arrStats, slopes, between };
}

/* ───────── T2 ───────── */
export function t2Spec(action, hdiv) {
  const P = PLAN.t2, h = SC.tcr / P.stepsPerTcr / hdiv, steps = P.stepsPerTcr * P.windowTcr * hdiv, every = P.everyPerTcr * hdiv;
  const base = { alpha: PLAN.alpha, eps: PLAN.eps, h, steps, every, self: P.self, rhoMode: P.rhoMode };
  if (action === 'grav') return Object.assign(base, { action: 'grav', drag: 'none', self: 'none' });
  if (action === 'velE') return Object.assign(base, { action: 'vel', drag: 'row' });
  const tau = Number(action.slice(5)); return Object.assign(base, { action: 'push', drag: 'row', gamma: 1 / (tau * SC.tcr) });
}
export function t2Rows() {
  const P = PLAN.t2, rows = [];
  for (const arr of P.arrangements) {
    const S0 = L.withRankVelocities(L.arrangementOf(arr, P.N, P.seed).S, P.N, P.seed);
    for (const action of P.actions) {
      const vals = P.hdivs.map((hd) => L.finalOf(F7.integrateFluid(S0, t2Spec(action, hd), SC), S0)), conv = {};
      for (const k of P.keys) conv[k] = Object.assign({ q: vals.map((v) => v[k]) }, L.convOf(vals[0][k], vals[1][k], vals[2][k]));
      rows.push({ arr, action, conv, decidesAll: P.keys.every((k) => conv[k].decides), nDecides: P.keys.filter((k) => conv[k].decides).length });
    }
  }
  return rows;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const P = PLAN;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: J.t1.rows.length === P.t1.arrangements.length * P.t1.Ns.length * P.t1.seeds.length * P.t1.fields.length && J.t1.rows.every((r) => P.t1.rules.every((k) => fin(r[k].dOverV) && fin(r[k].torqueRate))),
    t1Quality: J.t1.summary.arrStats.every((s) => s.arr !== 'glass' || s.cv < J.t1.summary.arrStats.find((x) => x.field === s.field && x.N === s.N && x.arr === 'random').cv),
    t1SymConserve: J.t1.summary.arrStats.every((s) => s.symB.torqueRate === 0 && s.symB.momRate === 0),
    t2Complete: J.t2.rows.length === P.t2.arrangements.length * P.t2.actions.length && J.t2.rows.every((r) => P.t2.keys.every((k) => r.conv[k].q.every(fin))),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const rows = t1Rows(), t1 = { rows, summary: t1Summary(rows) }; mark('t1');
  const t2 = { rows: t2Rows() }; mark('t2');
  const J = { pure, t1, t2, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 第338便c の型: 正本へ書く形 —— 生の runAll を元のまま 1 回と、Math の関数を ±1〜2 ulp ずらして 2 回走らせ、尺度の 4 倍の内の葉を 0 と書く(壁時計は元のままの走行の値) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  const J = Object.assign(rest, { timing: tm });
  const G = gatesOf(J);
  return { J: Object.assign(J, { gates: G, ok: Object.values(G).every(Boolean) }), recheck: S.meta };
}

/* ───────── 走らせる ───────── */
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w340g-fluidconv.mjs', 'tests/lib-w340g-fluidconv.mjs', 'tests/lib-w337e-fluid.mjs', 'tests/lib-w335f-elliptical.mjs', 'tests/lib-w333d-noncirc.mjs',
  'tests/lib-w333b-axialfield.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W340G_OUT ? (path.isAbsolute(process.env.W340G_OUT) ? process.env.W340G_OUT : path.join(ROOT, process.env.W340G_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第340便g fluidconv(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w340g-fluidconv.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-14 —— AN725 = A)・統括の検証項目 R362',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第340便g', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'fluidconv', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 第337便e の積分器を呼ぶ)', notClaim: NOT_CLAIM, recheck,
    zeroFloor: { floor: L.DECL.zeroFloor, scales: 'symCentral の角運動量の率(÷ Σ m |p × V|)と運動量の率(÷ Σ m |V|)・重力だけの L_z の比 − 1 —— 1e-12 より小さければ 0 と書く(解析的に 0 の量)' } });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

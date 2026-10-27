// 第317便a(原仮定者の裁定(第119報)・決断事項 AN431〔衛星の三体の永年の効きは 6 衛星とも帯の内で決まらない —— 何が必要かの探索〕・統括の検証項目 R250):
// **衛星 6 本の測る量と予算の器**(段 satmeas-317a —— 正本 tests/out/satmeas-w317a.json)。確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の本の宣言は変えない
// (写しは第315便d の lib tests/lib-w315d-satk1.mjs の bookOf で組む —— n=2・K1・第316便d と同じ本・同じ步。物理の変種は足さない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)。
// 走行は子プロセス(W317A_WORKERS —— 既定 2)。子は同じ衛星・系・刻みの q10 と q11 を続けて走らせ、差の系列(同じ時刻の標本)を子の中で回帰する。
//
// ■ 何をするか
//   E 走行(格子 GRIDS の和): 6 衛星 × 二体・三体 × q10・q11 × h・h/2・h/4 × 64 公転(基の格子)+ 長い窓 128 公転(三体のイオ・ガニメデ・カリスト —— 同じ走行を延ばす)+
//     細かい步 h/8(三体のエウロパ・タイタン)。**走行は通過の回数でなく步の数で止める**(runN · stepsPerOrbit · div 步 + 1/16 公転の余白 —— q10 と q11 で同じ終端)。
//     子は第315便d の抽出(attachSatSampler —— 每 h の慣性速度の接触の離心ベクトル)と、共通の座標時刻の標本(attachGridSampler —— Δ = P_seed/16 の E_I・E_C と位置)を重ねる。
//   M 測る量 × 格子の判定(HARM_RULE の R1・R2 —— 閾値 1e-2 のまま・走行の前に宣言): 近点の率の差 q11 − q10 を測る量ごとに
//       pass   = 通過の窓(第316便d の定義 —— 窓の終端は N 回目の通過)。基の格子の窓 8〜64 は第316便d の正本とビット同一(門 prefixSame)
//       M0     = 共通の座標時刻の窓(t₁ = N·P_seed —— q10 と q11 で同じ終端)・第316便d と同じ標本(每 h の慣性速度)と同じ L 模型(apsisRate —— 門 apsisSame)
//       EIg    = 慣性速度の離心ベクトル E_I・共通の時刻の標本 Δ = P_seed/16(M0 の標本の間引き)・L 模型
//       ECg    = 座標速度(位置の中心差分)の離心ベクトル E_C・Δ = P_seed/16・L 模型
//       EX     = 位置だけの離心ベクトル E_X(公転ごとの 1/r の最小二乗)・直線(調和なし —— 公転ごとの値は短周期を含まない)
//       direct = 差の系列の直接の回帰(M0 と同じ標本と窓 —— 固定の向き ê₀ に垂直な成分 Δϖ⊥ の傾き)
//       directRot = 同じ(基準の向きを q10 の回帰の永年の離心ベクトル ê₁₀(t) に回す —— 一次で ϖ̇₁₁ − ϖ̇₁₀ と同じ量)
//       syn    = 会合周期の窓(M0 の標本 —— 窓の終端 = 衛星の太陽に対する会合周期の整数倍 —— 短周期の太陽の項 2(λ☉ − λ) の打ち消し)
//     判定 = R1 ∧ R2(格子ごと —— 刻みは格子の 3 つ・窓は格子の最長とその前)。決まらなければ「この予算では永年項として決まらない」と書く(法則の否定ではない)。
//   I 差の回帰と回帰の差の一致の程度(一次の関係と線形の恒等式 —— 門 diffIdentity)
//   C 慣性速度と座標速度の要素の差(E_C − E_I —— 率と公転ごとの平均の離心ベクトルの差)
//   V 離心率ベクトルの差 q11 − q10(公転ごとの平均 —— E_I・E_C・E_X の 3 つの定義)と刻みの帯(トリトンの近点が定まらないことの量 —— AN432 の表の量は枝 d)
//   A 衛星ごとの答え(測り方だけで決まるか・予算〔步 h/8・窓 128〕で決まるか・どちらでも決まらないか)と刻みの見積り(外挿 —— 決まったことにしない)
//
// ■ 試走: W317A_QUICK=1(W317A_OUT が要る —— 正本を書かない)。再開: W317A_CACHE=<dir>(走行 1 組ごとの結果を逐次書き、同じ html・同じ器の版・同じ走行の鍵があれば読む)。
//   W317A_SATS=io,…(正本は 6 本)。W317A_PLAN=<json>(探索 —— 格子を差し替える。正本は器の宣言 PLAN だけ)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」「シュヴァルツシルト半径そのもの」。近似要素の種を観測レコードと呼ばない。
//   数値の帯と形式の標準誤差は観測の 3σ ではない。h〜h/8 は刻みの感度診断・窓は抽出の感度診断。回帰で窓の傾きを吸っただけを改善と呼ばない。
//   慣性速度と座標速度の要素の差を「現エンジンの誤り」と書かない。決まらない量を「効きが無い」と書かない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as M from './lib-w317a-satmeas.mjs';
import * as X315 from './exp-w315d-satk1.mjs';
import { HARM_RULE } from './exp-w316d-sath.mjs';
// 第281便a の領域 hash の宣言(第316便d の器と同じ読み口 —— 在位の本は .find で引く〔jupiterGalilean・saturnRingReal〕・母惑星と太陽は凍結の写しだけ)
const REGEN_SCOPE = {"presets":["jupiterGalilean","saturn","saturnRingReal"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w317a-satmeas-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const finiteOr = (x) => (Number.isFinite(x) ? x : null);
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', 'シュヴァルツシルト半径そのもの', '観測レコード', '精度の改善(窓の見かけの傾きを吸っただけのとき)', '現エンジンの誤り(慣性速度と座標速度の要素の差について)', '効きが無い(決まらない量について)'];
export const OUT_MEAS = 'tests/out/satmeas-w317a.json';
export const SATH_OUT = 'tests/out/sath-w316d.json';
export const SATS = X315.SATS;
export const KINDS = Object.freeze(['q10', 'q11']);
/** 測る量(近点の率の差 q11 − q10 —— ″/世紀) */
export const MEASURES = Object.freeze([
  Object.freeze({ key: 'pass', ja: '通過の窓(第316便d の定義 —— 窓の終端は N 回目の通過・慣性速度・每 h・L 模型)' }),
  Object.freeze({ key: 'M0', ja: 'M0 —— 共通の座標時刻の窓(t₁ = N·P_seed)・慣性速度・每 h・L 模型' }),
  Object.freeze({ key: 'EIg', ja: 'E_I —— 慣性速度・共通の時刻の標本 Δ = P_seed/16・L 模型' }),
  Object.freeze({ key: 'ECg', ja: 'E_C —— 座標速度(位置の中心差分)・Δ = P_seed/16・L 模型' }),
  Object.freeze({ key: 'EX', ja: 'E_X —— 位置だけ(公転ごとの 1/r の最小二乗)・直線' }),
  Object.freeze({ key: 'direct', ja: '差の系列の直接の回帰(M0 と同じ標本と窓 —— 固定の向き ê₀〔q10 の窓の平均〕に垂直な成分 Δϖ⊥ の傾き)' }),
  Object.freeze({ key: 'directRot', ja: '差の系列の直接の回帰(回る基準 —— 向きは q10 の回帰の永年の離心ベクトル ê₁₀(t))' }),
  Object.freeze({ key: 'syn', ja: '会合周期の窓(M0 の標本 —— 窓の終端 = 会合周期の整数倍)' })]);
export const MEASURE_KEYS = Object.freeze(MEASURES.map((m) => m.key));
/** 測り方の変種(pass と M0 以外 —— 「測り方だけで決まるか」の列) */
export const MEAS_ALT = Object.freeze(['M0', 'EIg', 'ECg', 'EX', 'direct', 'directRot', 'syn']);
/**
 * 格子(走行の前に宣言 —— 結果を見て変えない)。判定は格子ごとに HARM_RULE の R1・R2(刻みは格子の 3 つ —— 粗–中・中–細の 2 本の帯・窓は格子の最長とその前)。
 *   base  = 第316便d と同じ予算(h・h/2・h/4 × 64 公転)—— 6 衛星 × 二体・三体
 *   long  = 長い窓 128 公転(h・h/2・h/4)—— 三体で R1 に落ちた衛星(イオ・ガニメデ・カリスト)
 *   step8 = 細かい步(h/2・h/4・h/8 × 64 公転 —— 格子を 1 段細かくずらした同じ規則)—— 三体で R2 に落ちた衛星(エウロパ・タイタン)
 */
export const GRIDS = Object.freeze([
  Object.freeze({ key: 'base', ja: '基の格子(h・h/2・h/4 × 窓 8〜64 —— 第316便d と同じ予算)', divs: Object.freeze([1, 2, 4]), windows: Object.freeze([8, 16, 32, 64]), sats: SATS, systems: Object.freeze(['two', 'three']) }),
  Object.freeze({ key: 'long', ja: '長い窓(h・h/2・h/4 × 窓 8〜128)', divs: Object.freeze([1, 2, 4]), windows: Object.freeze([8, 16, 32, 64, 128]), sats: Object.freeze(['io', 'ganymede', 'callisto']), systems: Object.freeze(['three']) }),
  Object.freeze({ key: 'step8', ja: '細かい步(h/2・h/4・h/8 × 窓 8〜64)', divs: Object.freeze([2, 4, 8]), windows: Object.freeze([8, 16, 32, 64]), sats: Object.freeze(['europa', 'titan']), systems: Object.freeze(['three']) })]);
export const PLAN = Object.freeze({ stepsPerOrbit: 720, grid: M.GRID_S, grids: GRIDS });
export const QUICK = Object.freeze({ stepsPerOrbit: 480, grid: M.GRID_S, grids: Object.freeze([
  Object.freeze({ key: 'base', ja: '試走', divs: Object.freeze([1, 2]), windows: Object.freeze([6, 8]), sats: SATS, systems: Object.freeze(['two', 'three']) }),
  Object.freeze({ key: 'long', ja: '試走', divs: Object.freeze([1, 2]), windows: Object.freeze([6, 8, 12]), sats: Object.freeze(['io']), systems: Object.freeze(['three']) }),
  Object.freeze({ key: 'step8', ja: '試走', divs: Object.freeze([1, 2, 4]), windows: Object.freeze([6, 8]), sats: Object.freeze(['europa']), systems: Object.freeze(['three']) })]) });
const CENTURY = 36525 * 86400, RAD2AS = 180 / Math.PI * 3600;

/* ───────── 走行の計画(格子の和 —— 同じ衛星・系・刻みは最長の窓の 1 本)───────── */
export const specKey = (s) => 'meas:' + s.sat + '|' + s.sys + '|S=' + s.S + '|div=' + s.div + '|N=' + s.N;
export function specsOf(plan, sats) {
  const by = new Map();
  for (const g of plan.grids) for (const sat of g.sats) { if (!sats.includes(sat)) continue;
    for (const sys of g.systems) for (const div of g.divs) {
      const k = sat + '|' + sys + '|' + div, o = by.get(k) || { sat, sys, S: plan.stepsPerOrbit, div, N: 0, wins: [] };
      o.N = Math.max(o.N, ...g.windows); o.wins = [...new Set(o.wins.concat(g.windows))].sort((a, b) => a - b); by.set(k, o); } }
  return [...by.values()];
}

/* ───────── 走行(子 —— q10 と q11 を続けて)───────── */
function runKind(HP, sp, kind, sd, P, syn) {
  const book = L.bookOf(HP, sp.sat, sp.sys, kind, { seed: sd, stepsPerOrbit: sp.S }), v = HP.validatePreset(clone(book));
  if (!v.ok) return { status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) return { status: 'rejected', err: '三次元の本ではない' };
  const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]), h = book.physics.stepDt, pRef = book.timeRef.pRef;
  const dt = h / sp.div, Tsec = Math.pow(10, book.scaleExp.T), t0 = Date.now(), everyG = sp.S * sp.div / M.GRID_S;
  if (!Number.isInteger(everyG)) throw new Error('stepsPerOrbit · div が ' + M.GRID_S + ' で割り切れない');
  const smp = L.attachSatSampler(S, { ci: ip, oi: is, mu, every: sp.div, pole: P.orbitPole });
  const grd = M.attachGridSampler(S, { ci: ip, oi: is, mu, every: everyG, basis: smp.basis });
  const nSteps = sp.N * sp.S * sp.div + everyG - 1;   // 步の数で止める(余白 1/16 公転 − 1 步 —— 最後の標本の座標速度と N 回目の通過のため)
  let k = 0, stop = null;
  for (; k < nSteps; k++) {   // tests/lib-w315d-satk1.mjs の runBook と同じ步の回し方(通過の回数では止めない)
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (S.hasNaN()) { stop = 'nan'; break; }
  }
  if (stop === null) stop = 'steps';
  const s = smp.samples(), R = { rev: smp.rev.slice(), s }, g = grd.samples(), ex = M.exPerOrbit(g);
  const gI = { t: g.t, eP: g.eIP, eQ: g.eIQ, th: g.th }, gC = { t: g.t, eP: g.eCP, eQ: g.eCQ, th: g.th }, gX = { t: ex.t, eP: ex.eP, eQ: ex.eQ, th: ex.th };
  const win = {}; let apsisSame = true;
  for (const N of sp.wins) {
    const t1 = N * pRef + h / 2, w = {};
    if (R.rev.length >= N) { const z = L.windowOf(R, N, Tsec); w.pass = { aps: z.aps, sidDays: z.sidDays, node: z.node, axSat: z.axSat, axPar: z.axPar, eMean: z.eMean, incMeanDeg: z.incMeanDeg, t1: z.t1 }; }
    else w.pass = null;
    const f0 = M.fitL(s, { t0: 0, t1, K: M.K_HARM, diag: true }), ref = AP.apsisRate(s, { t0: 0, t1, K: M.K_HARM });
    if (!(f0 && ref && Object.is(f0.rate, ref.rate))) apsisSame = false;
    w.M0 = M.fitSum(f0, Tsec);
    let iLast = -1; for (let i = 0; i < s.t.length; i++) if (s.t[i] <= t1) iLast = i;
    w.tLastOverP = iLast >= 0 ? s.t[iLast] / pRef : null;
    const fI = M.fitL(gI, { t0: 0, t1, K: M.K_HARM, diag: true }), fC = M.fitL(gC, { t0: 0, t1, K: M.K_HARM, diag: true }), fX = M.fitL(gX, { t0: 0, t1, K: 0, diag: true });
    w.EIg = M.fitSum(fI, Tsec); w.ECg = M.fitSum(fC, Tsec); w.EX = M.fitSum(fX, Tsec);
    const m = Math.floor(N * pRef / syn.Psyn), fS = m >= 1 ? M.fitL(s, { t0: 0, t1: m * syn.Psyn, K: M.K_HARM }) : null;
    w.syn = fS ? Object.assign(M.fitSum(fS, Tsec), { m, t1OverP: m * syn.Psyn / pRef }) : null;
    // E_C − E_I(率と公転 N の平均の離心ベクトルの差)と、公転 N の離心ベクトル(3 つの定義 —— 差 q11 − q10 は組の段で)
    const nO = Math.floor(g.t.length / M.GRID_S);
    if (N <= nO) {
      const eI = M.orbitMean(g.eIP, g.eIQ, N - 1), eC = M.orbitMean(g.eCP, g.eCQ, N - 1), eX = [ex.eP[N - 1], ex.eQ[N - 1]], sv = M.splitVec(eI, [eC[0] - eI[0], eC[1] - eI[1]]);
      w.ce = { dRate: (fI && fC) ? M.perCentury(fC.rate - fI.rate, Tsec) : null, dEOverE: sv.mag / sv.e, parOverE: sv.parOverE, perpOverE: sv.perpOverE };
      w.evec = { EIg: eI, ECg: eC, EX: eX };
    }
    win[N] = w;
  }
  const out = { status: 'run', kind, steps: k, stop, complete: stop === 'steps', nan: S.hasNaN(), unbound: smp.unbound() || grd.unbound(), dt, warnings: (v.warnings || []).length, revCount: R.rev.length,
    nSamp: s.t.length, nGrid: g.t.length, nOrb: Math.floor(g.t.length / M.GRID_S), exRmsRelMax: ex.rmsRel.length ? Math.max(...ex.rmsRel) : null, apsisSame, win, wallSec: (Date.now() - t0) / 1000 };
  smp.detach(); grd.detach();
  return { out, s, g, pRef, h, Tsec };
}
export function runPair(HP, sp) {
  const sd = L.seedOf(HP, sp.sat), P = L.parentOf(sd.parent), syn = M.synodicOf(sd), key = specKey(sp), t0 = Date.now();
  const a = runKind(HP, sp, 'q10', sd, P, syn); if (a.status === 'rejected') return { key, spec: sp, status: 'rejected', err: a.err };
  const b = runKind(HP, sp, 'q11', sd, P, syn); if (b.status === 'rejected') return { key, spec: sp, status: 'rejected', err: b.err };
  let sameTimes = a.s.t.length === b.s.t.length && a.g.t.length === b.g.t.length;
  if (sameTimes) { for (let i = 0; i < a.s.t.length; i++) if (!Object.is(a.s.t[i], b.s.t[i])) { sameTimes = false; break; } for (let i = 0; i < a.g.t.length; i++) if (!Object.is(a.g.t[i], b.g.t[i])) { sameTimes = false; break; } }
  const pair = {};
  for (const N of sp.wins) {
    const t1 = N * a.pRef + a.h / 2, d = M.diffFit(a.s, b.s, { t0: 0, t1, K: M.K_HARM }), z = {};
    if (d && d.sameTimes) z.direct = { c1: M.perCentury(d.c1, a.Tsec), se1: Number.isFinite(d.se1) ? M.perCentury(d.se1, a.Tsec) : null, c1rot: M.perCentury(d.c1rot, a.Tsec), seRot: Number.isFinite(d.seRot) ? M.perCentury(d.seRot, a.Tsec) : null,
      perp0: d.perp0, par0: d.par0, parSlope: M.perCentury(d.parSlope, a.Tsec),
      cond: d.cond, rank: d.rank, sameX: M.perCentury(d.sameX, a.Tsec), c1reg: M.perCentury(d.c1reg, a.Tsec), lin: d.lin, corr1: M.perCentury(d.corr1, a.Tsec), corr2: M.perCentury(d.corr2, a.Tsec),
      resid2: M.perCentury(d.resid2, a.Tsec), parE: d.parE, perpE: d.perpE, e0: d.e0 };
    else z.direct = null;
    const ea = a.out.win[N].evec, eb = b.out.win[N].evec;
    if (ea && eb) { z.dE = {}; for (const D of ['EIg', 'ECg', 'EX']) z.dE[D] = { d: [eb[D][0] - ea[D][0], eb[D][1] - ea[D][1]], e10: ea[D] }; }
    pair[N] = z;
  }
  const strip = (o) => { const c = Object.assign({}, o); for (const N of Object.keys(c.win)) { c.win[N] = Object.assign({}, c.win[N]); delete c.win[N].evec; } return c; };
  return { key, spec: sp, status: 'run', h: a.h, pRef: a.pRef, syn, sameTimes, q10: strip(a.out), q11: strip(b.out), pair, wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── 子プロセスの池と再開の写し(第316便d と同じ型)───────── */
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, targetSha256, stat) {
  if (!dir) return run;
  fs.mkdirSync(dir, { recursive: true });
  const fileOf = (sp) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + M.LIB_VERSION + '|' + L.LIB_VERSION + '|' + targetSha256 + '|' + specKey(sp) + '|' + JSON.stringify(sp.wins)).digest('hex').slice(0, 32) + '.json');
  return (sp, pri) => {
    const f = fileOf(sp);
    try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.row && c.row.key === specKey(sp)) { stat.resumed++; return Promise.resolve(c.row); } } catch (e) { /* 無い */ }
    return run(sp, pri).then((r) => { const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, row: r })); fs.renameSync(tmp, f); return r; });
  };
}

/* ───────── 段 M(測る量 × 格子の判定 —— E の行から純関数 —— QA が作り直す)───────── */
const rowAt = (J, sat, sys, div) => { const r = Object.values(J.E.rows).find((x) => x.status === 'run' && x.spec.sat === sat && x.spec.sys === sys && x.spec.div === div); return r || null; };
/** 測る量の値(差 q11 − q10 —— ″/世紀) */
export function measureOf(r, N, key) {
  if (!r || !r.q10.win[N] || !r.q11.win[N]) return null;
  if (key === 'direct' || key === 'directRot') { const z = r.pair[N] && r.pair[N].direct; return z ? finiteOr(key === 'direct' ? z.c1 : z.c1rot) : null; }
  const a = r.q10.win[N][key], b = r.q11.win[N][key];
  return (a && b && Number.isFinite(a.aps) && Number.isFinite(b.aps)) ? b.aps - a.aps : null;
}
export function partM(J) {
  const out = { rule: { version: J.harmRule.version, rel: J.harmRule.rel, applied: 'R1 ∧ R2(HARM_RULE —— 格子ごと: 刻みは格子の 3 つ〔粗–中・中–細の 2 本の帯〕・窓は格子の最長とその前・閾値 1e-2 のまま)' }, grids: {} };
  for (const G of J.plan.grids) {
    const gOut = { key: G.key, divs: G.divs.slice(), windows: G.windows.slice(), systems: {} };
    for (const sat of G.sats) { if (!J.E.sats.includes(sat)) continue;
      for (const sys of G.systems) {
        const o = { measures: {} };
        for (const Mk of MEASURE_KEYS) {
          const vals = {}; for (const N of G.windows) { vals[N] = {}; for (const d of G.divs) vals[N][d] = measureOf(rowAt(J, sat, sys, d), N, Mk); }
          const r = M.ruleOf(vals, G, J.harmRule.rel); r.vals = vals; o.measures[Mk] = r;
        }
        o.determinedBy = MEASURE_KEYS.filter((k) => o.measures[k].determined);
        o.verdict = o.determinedBy.length ? '帯の内で決まった(' + o.determinedBy.join('・') + ')' : 'この予算では永年項として決まらない';
        const sn = M.stepNeed(o.measures.M0, G.divs[G.divs.length - 1]); o.stepNeedM0 = sn;
        gOut.systems[sat + '|' + sys] = o;
      } }
    out.grids[G.key] = gOut;
  }
  return out;
}

/* ───────── 段 I(差の回帰と回帰の差 —— 最も細かい刻み・各窓)───────── */
export function partI(J) {
  const out = { note: '回帰の差 ϖ̇₁₁ − ϖ̇₁₀(M0 —— 各走行の θ)・同じ計画行列(q10 の θ)の回帰の差 sameX・差の直接の回帰 c₁(ê₀ = q10 の窓の平均の向き)と c₁reg(ê₀ = q10 の回帰の (A, C))・一次の補正 corr1 = −ϖ̇₁₀·Δe∥/e・corr2 = −(ė₁₀/e)·Δϖ⊥・二次の残り resid2 = sameX − (c₁reg + corr1 + corr2)・θ の効き = M0 − sameX(すべて ″/世紀)', systems: {}, linMax: 0 };
  const G = J.plan.grids.find((g) => g.key === 'base'), fine = G.divs[G.divs.length - 1];
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run') continue; for (const N of Object.keys(r.pair)) { const z = r.pair[N].direct; if (z && Number.isFinite(z.lin)) out.linMax = Math.max(out.linMax, z.lin); } }
  for (const sat of G.sats) { if (!J.E.sats.includes(sat)) continue; for (const sys of G.systems) {
    const r = rowAt(J, sat, sys, fine); if (!r) continue; const rows = [];
    for (const N of G.windows) { const z = r.pair[N] && r.pair[N].direct, m0 = measureOf(r, N, 'M0'); if (!z) continue;
      rows.push({ N, M0: m0, sameX: z.sameX, c1: z.c1, c1rot: z.c1rot, c1reg: z.c1reg, corr1: z.corr1, corr2: z.corr2, resid2: z.resid2, thetaEff: Number.isFinite(m0) ? m0 - z.sameX : null,
        dirMinusM0: Number.isFinite(m0) ? z.c1 - m0 : null, rotMinusM0: Number.isFinite(m0) ? z.c1rot - m0 : null, se1: z.se1, seRot: z.seRot, parE: z.parE, perpE: z.perpE, lin: z.lin }); }
    out.systems[sat + '|' + sys] = { div: fine, rows }; } }
  return out;
}
/* ───────── 段 C(E_C − E_I —— 最も細かい刻み・最長の窓)───────── */
export function partC(J) {
  const out = { note: '座標速度の要素 E_C と慣性速度の要素 E_I の差(同じ時刻の標本 —— 率の差〔″/世紀〕と、公転 N の平均の離心ベクトルの差の大きさ・平行・垂直〔e で割る〕)。慣性速度で定義した接触要素の率と座標の軌跡の要素の率の違いの記録(エンジンの誤りとは断定しない)', systems: {} };
  const G = J.plan.grids.find((g) => g.key === 'base'), fine = G.divs[G.divs.length - 1], N = G.windows[G.windows.length - 1];
  for (const sat of G.sats) { if (!J.E.sats.includes(sat)) continue; for (const sys of G.systems) {
    const r = rowAt(J, sat, sys, fine); if (!r || !r.q10.win[N] || !r.q11.win[N]) continue;
    const a = r.q10.win[N].ce, b = r.q11.win[N].ce, mI = measureOf(r, N, 'EIg'), mC = measureOf(r, N, 'ECg');
    out.systems[sat + '|' + sys] = { N, div: fine, q10: a, q11: b, measEIg: mI, measECg: mC, dMeas: (Number.isFinite(mI) && Number.isFinite(mC)) ? mC - mI : null }; } }
  return out;
}
/* ───────── 段 V(離心率ベクトルの差 q11 − q10 —— 3 つの定義・刻みの帯)───────── */
export function partV(J) {
  const out = { note: '公転 N の離心率ベクトルの差 q11 − q10(E_I・E_C は公転 N の共通の時刻の標本 16 個の平均・E_X は公転 N の 1/r の最小二乗)—— 大きさ・平行 Δe∥/e・垂直 Δe⊥/e〔rad〕(e = q10 の同じ定義の大きさ)・刻みの帯(最も細かい 2 刻みの差のベクトルの大きさ)', systems: {} };
  const G = J.plan.grids.find((g) => g.key === 'base'), ds = G.divs, fine = ds[ds.length - 1], fine2 = ds[ds.length - 2];
  for (const sat of G.sats) { if (!J.E.sats.includes(sat)) continue; for (const sys of G.systems) {
    const r = rowAt(J, sat, sys, fine), r2 = rowAt(J, sat, sys, fine2); if (!r) continue; const rows = [];
    for (const N of G.windows) { const z = r.pair[N] && r.pair[N].dE, z2 = r2 && r2.pair[N] && r2.pair[N].dE; if (!z) continue;
      const defs = {}; for (const D of ['EIg', 'ECg', 'EX']) { const sv = M.splitVec(z[D].e10, z[D].d), band = z2 ? Math.hypot(z[D].d[0] - z2[D].d[0], z[D].d[1] - z2[D].d[1]) : null;
        defs[D] = { e10: sv.e, dE: sv.mag, parOverE: sv.parOverE, perpOverE: sv.perpOverE, band, overBand: band > 0 ? sv.mag / band : null }; }
      rows.push({ N, defs }); }
    out.systems[sat + '|' + sys] = { eSeed: J.T.systems[sat].e, rows }; } }
  return out;
}
/* ───────── 段 A(衛星ごとの答え —— 三体)───────── */
export function partA(J) {
  const out = { note: '測り方だけで決まる(基の格子で M0・E_I・E_C・E_X・差の直接の回帰・会合周期の窓のどれかが R1 ∧ R2)/予算で決まる(長い窓 128 公転・細かい步 h/8 の格子で R1 ∧ R2)/この予算では永年項として決まらない(物理の側 —— 枝 b・c の領分)', systems: {} };
  for (const sat of J.E.sats) {
    const id = sat + '|three', base = J.M.grids.base && J.M.grids.base.systems[id]; if (!base) continue;
    const meas = MEAS_ALT.filter((k) => base.measures[k].determined), budget = {};
    for (const gk of ['long', 'step8']) { const z = J.M.grids[gk] && J.M.grids[gk].systems[id]; if (z) budget[gk] = { determinedBy: z.determinedBy.slice(), M0: { R1: z.measures.M0.R1, R2: z.measures.M0.R2, r1Ratio: z.measures.M0.r1Ratio, r2Ratio: z.measures.M0.r2Ratio, v: z.measures.M0.v } }; }
    const two = J.M.grids.base.systems[sat + '|two'];
    const budgetBy = Object.entries(budget).filter(([, z]) => z.determinedBy.length).map(([k]) => k);
    out.systems[sat] = { passBase: base.measures.pass.determined, measOnly: meas, budget, budgetBy, twoM0: two ? two.measures.M0.determined : null,
      M0base: { R1: base.measures.M0.R1, R2: base.measures.M0.R2, r1Ratio: base.measures.M0.r1Ratio, r2Ratio: base.measures.M0.r2Ratio, v: base.measures.M0.v }, stepNeedM0: base.stepNeedM0,
      answer: meas.length ? '測り方で決まる(' + meas.join('・') + ')' : (budgetBy.length ? '予算で決まる(' + budgetBy.join('・') + ')' : 'この予算では永年項として決まらない') };
  }
  return out;
}

/* ───────── 門(器の健全さ —— 判定〔M・A〕は結果で、ここに入れない)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.T) g.seedsFinite = Object.values(J.T.systems).every((t) => [t.m, t.R, t.a, t.e, t.iEqDeg, t.spin, t.PDays, t.q1pn, t.gLocAnalytic].every(Number.isFinite) && t.e >= 0 && t.e < 1 && t.a > 0);
  if (J.E) { const run = Object.values(J.E.rows).filter((r) => r.status === 'run');
    g.noRejected = Object.values(J.E.rows).every((r) => r.status === 'run');
    g.allRows = Object.keys(J.E.rows).length === specsOf(J.plan, J.E.sats).length;
    const finWin = (k, N) => ['M0', 'EIg', 'ECg'].every((f) => k.win[N][f] && Number.isFinite(k.win[N][f].aps)) && (N < 6 || (k.win[N].EX && Number.isFinite(k.win[N].EX.aps))) && k.win[N].pass && Number.isFinite(k.win[N].pass.aps);
    g.runsComplete = run.every((r) => KINDS.every((kd) => { const k = r[kd]; return k.complete && !k.nan && !k.unbound && k.revCount >= r.spec.N && k.nOrb === r.spec.N && r.spec.wins.every((N) => finWin(k, N)); }));
    g.sameTimes = run.every((r) => r.sameTimes === true);
    g.gridAligned = run.every((r) => KINDS.every((kd) => r.spec.wins.every((N) => Math.abs(r[kd].win[N].tLastOverP - N) <= 1e-9 * N)));
    g.apsisSame = run.every((r) => KINDS.every((kd) => r[kd].apsisSame === true));
    g.diffIdentity = run.every((r) => r.spec.wins.every((N) => r.pair[N] && r.pair[N].direct && Number.isFinite(r.pair[N].direct.c1) && Number.isFinite(r.pair[N].direct.c1rot) && r.pair[N].direct.lin <= 1e-6));
    if (J.prefix) g.prefixSame = J.prefix.compared > 0 && J.prefix.same === J.prefix.compared;
  }
  return g;
}
/* ───────── 第316便d の走行との照合(通過の窓 8〜64・h〜h/4 —— 同じ本・同じ步)───────── */
export function prefixOf(J, Jh) {
  const out = { source: SATH_OUT, fields: ['sidDays', 'aps', 'node', 'axSat', 'axPar', 'eMean', 'incMeanDeg'], compared: 0, same: 0, diff: [] };
  if (!Jh || !Jh.E) return Object.assign(out, { note: '第316便d の正本が無い' });
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run' || r.spec.S !== Jh.E.stepsPerOrbit || !Jh.E.divs.includes(r.spec.div)) continue;
    for (const kind of KINDS) { const o = Jh.E.rows[X315.specKey({ sat: r.spec.sat, sys: r.spec.sys, kind, S: r.spec.S, div: r.spec.div, N: Jh.E.runN })]; if (!o || o.status !== 'run') continue;
      for (const N of Jh.E.windows) { const a = r[kind].win[N] && r[kind].win[N].pass, b = o.windows[N]; if (!a || !b) continue; out.compared++;
        if (out.fields.every((f) => Object.is(a[f], b[f]))) out.same++; else if (out.diff.length < 8) out.diff.push(r.key + '|' + kind + '@' + N); } } }
  return out;
}
export function costOf(J) {
  const by = {};
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run') continue;
    for (const kd of KINDS) { const k = r.spec.sys + '|' + kd + '|h/' + r.spec.div, w = by[k] || (by[k] = { n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r[kd].steps; w.wallSec += r[kd].wallSec; } }
  const rate = {}; for (const [k, w] of Object.entries(by)) rate[k] = { rateStepsPerSec: w.wallSec > 0 ? w.steps / w.wallSec : null };
  return { rows: by, rate };
}
/** 数だけの配列を 1 行に畳む(JSON の中身は同じ) */
export const packJson = (J) => JSON.stringify(J, null, 1).replace(/\[\n\s*((?:-?[\d.eE+-]+|null)(?:,\n\s*(?:-?[\d.eE+-]+|null))*)\n\s*\]/g, (m, body) => '[' + body.replace(/,\n\s*/g, ',') + ']');
export async function runMeas(HP, o) {
  const P = o.plan, sats = o.sats, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'satmeas', quick: !!o.quick, sats: sats.slice(), kernel: 'k1', rule: 'rdRule:"kappaM"(全天体 R_d = Y_k m —— 鍵の名は r_d・説明は R_d)', plan: clone(P), harmRule: clone(HARM_RULE),
    measures: MEASURES.map((m) => ({ key: m.key, ja: m.ja })) };
  J.book = { units: clone(L.UNITS), softening: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, integrator: L.INTEGRATOR, gLoc: clone(L.GLOC), offDrag: clone(L.OFF_DRAG), k1Drag: clone(L.K1_RULE_DRAG),
    declFile: L.DECL_FILE, parents: clone(L.PARENTS), seedBooks: ['jupiterGalilean', 'saturnRingReal'], libFrom: 'tests/lib-w315d-satk1.mjs(bookOf・seedOf・attachSatSampler・windowOf —— 第316便d と同じ本・同じ步)',
    stop: '步の数で止める(runN · stepsPerOrbit · div 步 + 1/16 公転 − 1 步の余白 —— 最後の標本の座標速度と N 回目の通過のため・q10 と q11 で同じ終端)',
    window: 't₁ = N·P_seed + h/2(P_seed = 本の timeRef.pRef —— 標本 t = N·P_seed を含む・q10 と q11 で同じ標本)',
    notIncluded: ['母惑星の J₂ と潮汐(在位の本が持たない —— 第315便d と同じ)', '他の衛星と他の惑星(衛星ごとに 1 本 —— 第315便d と同じ)', 'q00(差 q11 − q10 だけを測る —— 費用を抑える)'] };
  J.T = { systems: X315.targetsOf(HP, sats) };
  J.syn = {}; for (const k of sats) { const z = M.synodicOf(L.seedOf(HP, k)); J.syn[k] = { PplanetDays: z.Pplanet * Math.pow(10, L.UNITS.T) / 86400, sense: z.sense, PsynDays: z.Psyn * Math.pow(10, L.UNITS.T) / 86400, ratio: z.ratio }; }
  tick('T');
  const rows = {}, specs = specsOf(P, sats);
  await Promise.all(specs.map((sp) => o.run(sp, sp.div * sp.N * (sp.sys === 'three' ? 2 : 1)).then((r) => { rows[r.key] = r; o.log(r); return r; })));
  J.E = { sats: sats.slice(), stepsPerOrbit: P.stepsPerOrbit, grid: P.grid, rows };
  J.prefix = o.sath ? prefixOf(J, o.sath) : null;
  tick('E');
  J.M = partM(J); J.I = partI(J); J.C = partC(J); J.V = partV(J); J.A = partA(J); tick('MICVA');
  J.cost = costOf(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = Object.values(J.E.rows).filter((r) => r.status === 'run');
  J.stats = { pairs: runs.length, runs: 2 * runs.length, steps: runs.reduce((s, r) => s + r.q10.steps + r.q11.steps, 0) };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W317A_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runPair(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W317A_QUICK === '1', explore = !!process.env.W317A_PLAN;
  const OUT = process.env.W317A_OUT ? (path.isAbsolute(process.env.W317A_OUT) ? process.env.W317A_OUT : path.join(ROOT, process.env.W317A_OUT)) : path.join(ROOT, OUT_MEAS);
  if ((quick || explore) && !process.env.W317A_OUT) throw new Error('試走(W317A_QUICK=1)と探索(W317A_PLAN)は W317A_OUT を指定する(正本を書かない)');
  const sats = process.env.W317A_SATS ? process.env.W317A_SATS.split(',') : SATS.slice();
  if (sats.some((k) => !L.satOf(k))) throw new Error('W317A_SATS は ' + SATS.join(',') + ' から');
  if (!process.env.W317A_OUT && sats.length !== SATS.length) throw new Error('正本は 6 衛星(一部は W317A_OUT へ)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  let sath = null; try { sath = JSON.parse(fs.readFileSync(path.join(ROOT, SATH_OUT), 'utf8')); } catch (e) { sath = null; }
  const NW = Math.max(1, Number(process.env.W317A_WORKERS) || 2), cstat = { resumed: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W317A_CACHE ? path.resolve(process.env.W317A_CACHE) : null, targetSha256, cstat);
  const log = (r) => { const N = r.spec ? r.spec.N : null, w = r.status === 'run' ? measureOf(r, N, 'M0') : null;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・M0 ' + (Number.isFinite(w) ? w.toExponential(6) : '—') + '・direct ' + (r.pair[N] && r.pair[N].direct ? r.pair[N].direct.c1.toExponential(6) : '—')
      + '・' + (r.q10.steps + r.q11.steps) + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`); };
  const plan = explore ? Object.assign(clone(PLAN), JSON.parse(process.env.W317A_PLAN)) : (quick ? QUICK : PLAN);
  console.log('第317便a satmeas: ' + (quick ? '試走' : (explore ? '探索' : '正本')) + '・workers ' + NW + '・衛星 ' + sats.join(',') + '・走行の組 ' + specsOf(plan, sats).length);
  const R = await runMeas(HP, { quick, plan, sats, run, log, sath: (quick || plan.stepsPerOrbit !== 720) ? null : sath });
  const out = { version: HARNESS_VERSION, libVersion: M.LIB_VERSION, satk1LibVersion: L.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, generator: 'tests/exp-w317a-satmeas.mjs', target: TARGET, targetSha256, reuseFrom: null, explore,
    ruling: '原仮定者の裁定(第119報)・決断事項 AN431(衛星の三体の永年の効きは 6 衛星とも帯の内で決まらない —— 何が必要かを探索する)・統括の検証項目 R250(測る量と予算 —— 物理の変種は足さない)。'
      + '確認の材料(在位へ入れない —— 近似要素の種は観測レコードではない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w317a-satmeas.mjs', 'tests/lib-w317a-satmeas.mjs', 'tests/exp-w316d-sath.mjs', 'tests/exp-w315d-satk1.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第317便a', target: TARGET, code: CODE, inputs: [TARGET, L.DECL_FILE, SATH_OUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satmeas',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W317A_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, packJson(out) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', out.A ? JSON.stringify(Object.fromEntries(Object.entries(out.A.systems).map(([k, v]) => [k, v.answer]))) : '');
}
if (IS_MAIN) await main();

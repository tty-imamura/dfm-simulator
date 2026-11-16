// 第340便d(原仮定者の指示(2026-11-17 —— 第140報)の回転引きずり・ジャイロトルク・軸引きずりの文・原仮定者の指示(2026-11-12 —— 第135報)の回転引きずりの条件・統括の検証項目 R359):
//   **回転引きずりの経路「軸引きずり + 公転 + ジャイロ」を受け手の部位ごとの力で数える(T1)・土星の環の帳簿に環の外の受け取り手(主の列)と方向別の係数(比べる列)を足す(T2)**
//   (段 gyropath-340d —— 正本 tests/out/gyropath-340d.json・lib tests/lib-w340d-gyropath.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w340d-gyropath.mjs —— 領域の宣言なし)・入力のファイルは無い(4 天体の強さの組は第338便d の lib の k4Sets を呼んで作り直す)。1 プロセス。
// 正本へ書く形は第338便c の settleRun(Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉〔丸めの残り〕を 0 と書く)。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 作用の型 4(drag・corV・corS・drag90)× 向きの列 q 2(主 1・比べる 0)× 強さのべき p 5(0〜4)× 体 2(球・輪)× 仰角 9(z/r −0.3〜0.3)・半径 3・部位の大きさ R/r 0.01(振る 4 点)。
//     対照 8(基準・受け手の自転 0・公転 0・軸の反転・軸を 30° 傾ける・源の自転の反転・逆行・点の受け手)・赤道面の上で軸を傾けた 4 例。
//     物差し: 赤道面へ寄せる向き(z > 0 と z < 0 の両方で −sgn(z) F·ê_el > 0)・z のべき(小さい z)・r のべき(z を固定)・赤道面の上の軸の向きの変化(dθ/dt・歳差)。
//   T2: 4 天体の強さの組 2(χ ½・1)× 環の中心 5。物差し: 1e7 年の漂い ≤ 区分の幅・傾きが 1e7 年の内に e 分の 1・帳簿の閉じ(第338便d の輪の列)・口の熱の符号。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w340d-gyropath.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w340d-gyropath-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/gyropath-340d.json';
export const TARGET = 'tests/lib-w340d-gyropath.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['回転引きずりの機構が導けたとは書かない(この型・このノブの組ではこうなる、の表)', '環が薄い理由が分かったとは書かない',
  'アプリの型が経路から出た/出ない、とは書かない(符号・べき・応答の比べの表)', '打ち消されたと仮定した後の値を結果と書かない(行き先を帳簿に置いた値だけ)', '光速を超えるかどうかを判定に使わない', '文献の値は未照合(出典と確かさを書く)']);
const D1 = L.DECL.t1, D2 = L.DECL.t2;

/* ───────── T1 ───────── */
export function partT1() {
  const summaries = [];
  for (const action of L.ACTIONS) for (const q of D1.qGrid) for (const p of D1.pGrid) for (const body of D1.bodies) summaries.push(L.summaryRow({ action, q, p, body }));
  const controls = D1.controls.map((c) => L.controlRow(c));
  const eqTilt = L.eqTiltRows(), sizeScan = L.sizeScanRows(), app = L.appRow();
  // アプリの型(第339便a)と経路の型(主の列 q 1・p 2・球)の比べ
  const main = (a) => summaries.find((s) => s.action === a && s.q === D1.qMain && s.p === D1.pMain && s.body === 'sphere'), ctl = (c) => controls.find((x) => x.ctl === c);
  const sgn = (x) => (x === null ? null : Math.sign(x));
  const appCompare = L.ACTIONS.map((a) => { const s = main(a);
    return { action: a, toward: s.towardBoth ? 1 : s.awayBoth ? -1 : 0, zPow: s.zPow === undefined ? null : s.zPow, rPowFixedZ: s.rPowFixedZ === undefined ? null : s.rPowFixedZ,
      sFlip: sgn(ctl('sFlip').by[a].pullUp), spin0: sgn(ctl('spin0').by[a].pullUp), orbit0: sgn(ctl('orbit0').by[a].pullUp), Lflip: sgn(ctl('Lflip').by[a].pullUp), point: sgn(ctl('point').by[a].pullUp) }; });
  const appSide = { toward: app.towardUp === 1 && app.towardDown === 1 ? 1 : -1, zPow: app.zPow, rPowFixedZ: app.rPowFixedZ, sFlip: app.sFlipTowardUp, spin0: 1, orbit0: 1, Lflip: 1, point: 1, band: 'R_eq の内だけ' };
  // 「赤道面へ寄せる向き」が両側で出る組の数(型 × q × 体ごとの p の一覧)
  const towardTable = [];
  for (const action of L.ACTIONS) for (const q of D1.qGrid) for (const body of D1.bodies) { const rows = summaries.filter((s) => s.action === action && s.q === q && s.body === body);
    towardTable.push({ action, q, body, toward: rows.filter((s) => s.towardBoth).map((s) => s.p), away: rows.filter((s) => s.awayBoth).map((s) => s.p), none: rows.filter((s) => !s.towardBoth && !s.awayBoth).map((s) => s.p) }); }
  return { nSummaries: summaries.length, summaries, controls, eqTilt, sizeScan, app, appCompare, appSide, towardTable };
}

/* ───────── T2 ───────── */
export function partT2() {
  const sets = L.k4Sets(), need = L.ringNeedRows(sets);
  const bMin = Object.fromEntries(L.SETS.map((k) => [k, Math.min(...need.filter((r) => r.set === k).map((r) => r.bNeed))]));
  const thinAll = Object.fromEntries(L.SETS.map((k) => [k, need.filter((r) => r.set === k).every((r) => r.thin)]));
  const ports = [];
  for (const k of L.SETS) for (const port of D2.ports) for (const pt of D2.etaPts) { const eta = pt === 'none' ? 0 : pt === 'inside' ? 1 - bMin[k] / 2 : 1 - 2 * bMin[k];
    ports.push(Object.assign({ etaPt: pt }, L.portLedger({ set: sets[k], setKey: k, eta, port }))); }
  const portHeat = L.portHeatRows(need), coef = L.coefGridRows(need), eqCols = L.eqColRows(sets);
  const coefBoth = L.SETS.map((k) => { const r = coef.filter((c) => c.set === k && c.both); return { set: k, n: r.length, caMax: r.length ? Math.max(...r.map((c) => c.ca)) : null, ciMin: r.length ? Math.min(...r.map((c) => c.ci)) : null }; });
  return { sets: Object.fromEntries(L.SETS.map((k) => [k, { chi: sets[k].chi, q: sets[k].q, p: sets[k].p, lambda: sets[k].lambda }])), need, bMin, thinAll, ports, portHeat, coef, coefBoth, eqCols };
}

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, c = (k) => t1.controls.find((x) => x.ctl === k);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: t1.summaries.length === L.ACTIONS.length * D1.qGrid.length * D1.pGrid.length * D1.bodies.length && t1.controls.length === D1.controls.length && t1.eqTilt.length === L.EQ_TILTS.length * 3,
    t1DragAzimuthOnly: t1.summaries.filter((s) => s.action === 'drag').every((s) => s.zs.every((z) => z.Fel === 0)),
    t1Controls: c('spin0').by.corS.pullUp === 0 && c('spin0').by.drag90.pullUp === 0 && c('orbit0').by.corV.pullUp === 0 && c('point').by.drag.pullUp === 0 && c('point').by.corS.pullUp === 0
      && Math.abs(c('spin0').by.corV.pullUp - c('base').by.corV.pullUp) <= 1e-12 * Math.abs(c('base').by.corV.pullUp) && Math.sign(c('sFlip').by.corV.pullUp) === -Math.sign(c('base').by.corV.pullUp),
    t1EqPrecession: t1.eqTilt.filter((r) => r.action === 'corS').every((r) => r.dTheta === 0 || r.dTheta === null),
    t2Complete: t2.need.length === L.SETS.length * D2.centers.length && t2.ports.length === L.SETS.length * D2.ports.length * D2.etaPts.length && t2.eqCols.length === L.SETS.length * D2.centers.length * D2.cols.length,
    t2Closed: t2.ports.every((p) => p.amClosed && p.enClosed),
    t2EqColTwoParts: t2.eqCols.every((r) => fin(r.fwdRate) && fin(r.backRate) && r.fwdDest && r.backDest),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: L.pureView(PS), gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const J = { pure, t1, t2, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 第338便c の形: 生の runAll を元のまま 1 回と、Math の関数を ±1〜2 ulp ずらして 2 回走らせ、葉ごとの尺度 σ の 4 倍の内の葉を 0 と書く(壁時計は元のままの走行の値)*/
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value, g2 = gatesOf(S.value);
  return { J: Object.assign(rest, { timing: tm, gates: g2, ok: Object.values(g2).every(Boolean) }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w340d-gyropath.mjs', 'tests/lib-w340d-gyropath.mjs', 'tests/lib-w338b-bevelknob.mjs', 'tests/lib-w338d-ringbook.mjs', 'tests/lib-w339a-rotvert.mjs', 'tests/lib-w337l-bevel.mjs',
  'tests/lib-w337k-gyrodrag.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w337i-rotring.mjs', 'tests/lib-w337a-supply.mjs', 'tests/lib-w335b-carryledger.mjs', 'tests/lib-w292d-tide.mjs', 'tests/lib-w338c-recheck.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W340D_OUT ? (path.isAbsolute(process.env.W340D_OUT) ? process.env.W340D_OUT : path.join(ROOT, process.env.W340D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第340便d gyropath(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w340d-gyropath.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-17 —— 第140報)の回転引きずり・ジャイロトルク・軸引きずりの文・原仮定者の指示(2026-11-12 —— 第135報)の回転引きずりの条件・統括の検証項目 R359',
    decl: L.DECL, actions: L.ACTION_JA, eqTilts: L.EQ_TILTS, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第340便d', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'gyropath', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 部位の和と第338便d の輪の列)', notClaim: NOT_CLAIM, recheck,
    units: 'T1 は無次元(源の自転の速さ 1・源の G m 1・場の強さ A 1・長さ r₀ —— 符号とべきの表)・T2 は SI(土星の環)' });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

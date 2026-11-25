// 第353便f(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R470):
//   **歳差の率を符号つきで同じ極へ足す器 —— 表 1 符号つきの率(地球・火星・金星 —— 仮の値〔印つき〕・重力の側の列〔比べる列〕・残り・軸引きずりの列 (g2−) 主・(g2+) 比べる列)・
//   表 2 応答の係数の上限(残りの大きさと入力の桁の幅から)・表 3 極の取り方(黄道の極・自分の公転の北極・基準軸 L・eq・合成の軸)・表 4 予告(水星・木星・土星 —— 比べる数なし)・零試験 11**
//   (段 ratesum-353f —— 正本 tests/out/ratesum-353f.json・lib tests/lib-w353f-ratesum.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353f-ratesum.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 歳差の率の答えとは書かない・重力の側の列を DFM の結果と書かない。仮の値を使う行は合否にしない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as F from './lib-w353f-ratesum.mjs';
import * as Y from './lib-w352y-bgwindow.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353f-ratesum-1';
export const OUT_MAIN = 'tests/out/ratesum-353f.json';
export const TARGET = 'tests/lib-w353f-ratesum.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']);
export const NOT_CLAIM = Object.freeze([
  '符号つきの率の表 —— 歳差の率の答えとは書かない(この極・この背景・この応答の係数では、の数)',
  '重力の側の列(第352便u の (T-g))は比べる列 —— DFM の式ではない。残り(仮の値 − 重力の列)は仮・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  '金星の仮の値は大きさだけ —— 回る向きは「重力の列と同じ回り」「逆の回り」の 2 列で持つ(どちらにも寄せない)',
  '応答の係数 c は単位の応答 1 からの倍 —— 要る c・上限の c は、残りを軸引きずりだけに割り当てたときの数(構造の係数の式は置いていない)',
  '背景の大きさ u = 0.98 は (N+) の窓(0.0487〜0.835)の上端より上 —— 窓の内とは書かない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 11(重力の列 = 第352便u・残り = 第352便y・単位の応答 = 第352便q・局所の (S) = 第352便q・合成の軸のまわりの閉じた形・(g2±) の反転と c・u の比例・統括の数え直し 3(基準軸 L・ω_G・金星の φ)・和の算術・仮の値の符号・上限の算術・拒否)',
  t1: '表 1: 地球・火星・金星(金星は仮の値の向き 2)× 歳差の式 (g2−)(g2+)× u 3(0.0487・0.835・0.98)—— 家の極(地球 黄道の極・火星と金星 公転の北極)の符号つきの率: 仮の値・重力の列・残り・軸引きずり(c 1)・同じ回りか・広がるか・要る c(符号つき)',
  t2: '表 2: 応答の係数の上限 = (abs(残り) ± 入力の桁の幅)÷ abs(軸引きずり(c 1))(地球・火星・金星 × u 3 × (g2−)(g2+))・第352便q の要る係数の比(1・0.151・0.885)と並べる',
  t3: '表 3: 極 5(黄道の極・自分の公転の北極・基準軸 L・基準軸 eq・合成の軸)× 地球・火星・金星 —— 重力の列と軸引きずり(主の列・u 0.98・c 1)の方位の率・比・同じ回りか・極と ŝ の角の sin',
  t4: '表 4: 予告 —— 水星・木星・土星 × 極 3(黄道の極・自分の公転の北極・基準軸 L)の重力の列と軸引きずり(u 3・(g2−))(比べる数なし)' });

const RD = Object.freeze({ t1Bodies: Object.freeze([['Earth', 'tide'], ['Mars', 'tide'], ['Venus', 'tide'], ['Venus', 'anti']]), senses: F.DECL.senses, uGrid: F.DECL.uGrid,
  t3Bodies: F.DECL.provBodies, t3Poles: F.DECL.poles, t3U: 0.98, t4Bodies: F.DECL.previewBodies, t4Poles: Object.freeze(['ecl', 'orb', 'L']),
  needQ: Object.freeze({ Earth: 1, Mars: 0.151, Venus: 0.885 }) });
export const ROWDECL = RD;
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── 表 1: 符号つきの率 ───────── */
export function signRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const [id, vs] of RD.t1Bodies) for (const sense of RD.senses) for (const u of RD.uGrid) {
    const r = F.sumRow(id, { u, sense, venusSense: vs }, o);
    rows.push(PV.tagProv({ id, venusSense: r.venusSense, sense, u, pole: r.pole, prov: r.prov, tide: r.tide, resid: r.resid, drag1: r.drag1, sameAsTide: r.sameAsTide, spin: r.spin, rel: r.rel,
      cNeed: r.cNeed, fillSense: r.fillSense, widensUnit: Math.abs(r.resid - r.drag1) > Math.abs(r.resid) }, r.provKeys));
  }
  return PV.tagProv({ rows }, PROV_KEYS.slice());
}
/* ───────── 表 2: 応答の係数の上限 ───────── */
/** 入力の桁の幅(第352便y の重力の列の入力の感度 —— 振れの和)と仮の値の sigma(在れば) */
export function widthOf(T1, GEO, id) {
  const base = Y.gravPert(T1, GEO, id).az;
  let tot = 0;
  for (const [, op] of Y.pertSteps(T1, GEO, id)) {
    const up = Y.gravPert(T1, GEO, id, op).az - base, dn = Y.gravPert(T1, GEO, id, Object.fromEntries(Object.entries(op).map(([k, v]) => [k, -v]))).az - base;
    tot += Math.max(Math.abs(up), Math.abs(dn));
  }
  const e = PV.prov(F.DECL.provKeys[id]), sig = fin(e.sigma) ? e.sigma : fin(e.sigmaGiven) ? e.sigmaGiven : 0;
  return { swing: tot, sigma: sig, sigmaKind: fin(e.sigma) ? 'sigma' : fin(e.sigmaGiven) ? 'sigmaGiven' : 'none' };
}
export function upperRows(T1, GEO, t1) {
  const rows = [], W = {};
  for (const id of F.DECL.provBodies) W[id] = widthOf(T1, GEO, id);
  for (const r of t1.rows) {
    const w = W[r.id], ra = Math.abs(r.resid), cMax = F.cUpper(r.drag1, ra), cLo = F.cUpper(r.drag1, Math.max(0, ra - w.swing - w.sigma)), cHi = F.cUpper(r.drag1, ra, w.swing + w.sigma);
    rows.push(PV.tagProv({ id: r.id, venusSense: r.venusSense, sense: r.sense, u: r.u, residAbs: ra, swing: w.swing, sigma: w.sigma, sigmaKind: w.sigmaKind, cMax, cLo, cHi, fillSense: r.fillSense, residZeroIn: ra <= w.swing + w.sigma }, r.provKeys));
  }
  // 第352便q の要る係数の比(地球 1)と、本表の要る c の比(地球の同じ列 —— 大きさ)
  const ratio = [];
  for (const sense of RD.senses) for (const u of RD.uGrid) {
    const e = t1.rows.find((r) => r.id === 'Earth' && r.sense === sense && r.u === u);
    for (const [id, vs] of RD.t1Bodies) { const r = t1.rows.find((q) => q.id === id && (q.venusSense || 'tide') === vs && q.sense === sense && q.u === u);
      ratio.push(PV.tagProv({ id, venusSense: vs, sense, u, needQ: RD.needQ[id], cRatio: Math.abs(r.cNeed) / Math.abs(e.cNeed) }, PROV_KEYS.slice())); }
  }
  return PV.tagProv({ rows, width: W, ratio }, PROV_KEYS.slice());
}
/* ───────── 表 3: 極の取り方 ───────── */
export function poleRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const id of RD.t3Bodies) {
    const s = F.axesOf(id, o).sHat;
    for (const p of RD.t3Poles) {
      const d = F.dragRate(id, { u: RD.t3U, pole: p }, o), g = F.tideRate(id, { pole: p, om: d.Om }, o), pv = F.poleVec(id, p, { om: d.Om }, o);
      const sinP = pv === null ? null : F.vec.nrm(F.vec.crs(pv, s));
      rows.push({ id, pole: p, tide: g.az, drag: d.az, ratio: fin(g.az) && fin(d.az) && g.az !== 0 ? d.az / g.az : null, same: fin(g.az) && fin(d.az) ? Math.sign(g.az) === Math.sign(d.az) : null,
        tideInc: g.inc, dragInc: d.inc, sinPole: sinP });
    }
  }
  return { rows };
}
/* ───────── 表 4: 予告(比べる数なし)───────── */
export function previewRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const id of RD.t4Bodies) {
    const s = F.axesOf(id, o).sHat;
    for (const p of RD.t4Poles) {
      const g = F.tideRate(id, { pole: p }, o), pv = F.poleVec(id, p, {}, o), drag = RD.uGrid.map((u) => F.dragRate(id, { u, pole: p }, o).az);
      rows.push({ id, pole: p, tide: g.az, tideMag: g.mag, drag, dragOverTide: fin(g.az) && g.az !== 0 ? drag.map((x) => x / g.az) : null, sinPole: F.vec.nrm(F.vec.crs(pv, s)) });
    }
  }
  return { rows };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = J.t1.rows, n1 = RD.t1Bodies.length * RD.senses.length * RD.uGrid.length;
  const vsOf = (r) => r.venusSense || 'tide', pair = (id, vs, u) => [t1.find((r) => r.id === id && vsOf(r) === vs && r.sense === 'g2m' && r.u === u), t1.find((r) => r.id === id && vsOf(r) === vs && r.sense === 'g2p' && r.u === u)];
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 11,
    provTop: J.provisional === true && JSON.stringify(J.provKeys) === JSON.stringify(PROV_KEYS) && J.t1.provisional === true && J.t2.provisional === true,
    t1: t1.length === n1 && t1.every((r) => fin(r.prov) && fin(r.tide) && fin(r.resid) && fin(r.drag1) && r.provisional === true)
      && RD.t1Bodies.every(([id, vs]) => RD.uGrid.every((u) => { const [a, b] = pair(id, vs, u); return Math.abs(a.drag1 + b.drag1) <= 1e-9 * Math.abs(a.drag1) && a.fillSense === !b.fillSense; })),
    t2: J.t2.rows.length === n1 && J.t2.rows.every((r) => r.cLo <= r.cMax && r.cMax <= r.cHi) && J.t2.ratio.length === n1,
    t3: J.t3.rows.length === RD.t3Bodies.length * RD.t3Poles.length && J.t3.rows.filter((r) => r.pole === 'om').every((r) => fin(r.drag) && r.drag !== 0),
    t4: J.t4.rows.length === RD.t4Bodies.length * RD.t4Poles.length && J.t4.rows.every((r) => r.drag.length === RD.uGrid.length),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = F.pureScenes(T1, GEO), pure = { scenes: PS, gates: F.pureGates(PS) }; mark('pure');
  const t1 = signRows(T1, GEO, cache); mark('t1');
  const t2 = upperRows(T1, GEO, t1); mark('t2');
  const t3 = poleRows(T1, GEO, cache); mark('t3');
  const t4 = previewRows(T1, GEO, cache); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm, provisional: true, provKeys: PROV_KEYS.slice() };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  delete J.provisional; delete J.provKeys;
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353f-ratesum.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353F_OUT ? (path.isAbsolute(process.env.W353F_OUT) ? process.env.W353F_OUT : path.join(ROOT, process.env.W353F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便f ratesum(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: F.LIB_VERSION, generator: 'tests/exp-w353f-ratesum.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R470', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: F.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ratesum', engine: 'Node(html を読まない —— 純関数の lib・第352便b・c・d・k・q・u・y の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

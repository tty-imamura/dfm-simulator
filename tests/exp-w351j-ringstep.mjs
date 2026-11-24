// 第351便j(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)AN1000・AN1008・統括の検証項目 R436):
//   **円盤引きずりの側を (R3) の 2 経路の步の形で数える器 —— 粒子の輪の法線を步に載せる(表 1 の率と步)・輪の 3 つの結果と 2 経路の当たり方(〔第350便g〕の粒子の輪と並べる)・
//   受け手の速度で向きが入れ替わる行を源の成分 (M)(S) で見る(表 3)・🛟 saturnRotVertExplore3d の傾きの減りの率を経路 ① の寄る速さに換算(表 2 —— 読むだけ)・土星の環の物差し(表 4)**
//   (段 ringstep-351j —— 正本 tests/out/ringstep-351j.json・lib tests/lib-w351j-ringstep.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。physics の鍵を足さない。🛟 の本と鍵 physics.rotDragVert は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351j-ringstep.mjs —— 領域の宣言なし)。入力のファイルは 🛟 の正本 tests/out/rotvert-w339a.json と
//   〔第350便g〕の正本 tests/out/diskcheck-350g.json(どちらも読むだけ —— 粒子の輪の結果と向きが入れ替わる行の旗を並べる)。1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。比率 f の既定の値は決めない。
// ■ 判定の物差し(零試験 10): 共通の点検の数/止めた Ω の步 = 〔第351便d〕の r3Step/f 0 は傾きを保ち f 1 は交点を保つ/順行と逆行で寄る・離れるが入れ替わる/
//   (M) は輪の法線と平行・(MS) の直交の成分 = (S)/経路 ② の k₂ 1 = 剛体の回転の大きさ/傾き 0 の輪 = 〔第350便g〕の点・〔第351便c〕の閉じた形/寄せる力の線形/変異 2/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w351j-ringstep.mjs';
import * as G from './lib-w350g-diskcheck.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351j-ringstep-1';
export const OUT_MAIN = 'tests/out/ringstep-351j.json';
export const TARGET = 'tests/lib-w351j-ringstep.mjs';
export const INPUT_ROTVERT = 'tests/out/rotvert-w339a.json';
export const INPUT_DISKCHECK = 'tests/out/diskcheck-350g.json';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '粒子の輪の法線を (R3) の 2 経路の步に載せた候補の表(円盤引きずりの型・環の厚みの答えではない)', '比率 f の既定の値は決めていない(0・0.5・1 を並べた)・回転の読み (C1)(C2) は列',
  '🛟 saturnRotVertExplore3d は探索用・未較正 —— 寄る速さへの換算は見える倍率のままの数と、強さの倍で割った数(較正ではない)',
  '輪が傾く・傾きが減る・厚みを保つは別の結果 —— (R3) の步は輪を剛体として回すので厚みには当たらない(構造)',
  '土星の環の厚み 10 m ほかはリポジトリの中の数(文献の値・未照合)—— 主の物差しにしない', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', rates: '輪 1 つ × 読み 2 × 成分 3 × 順逆 2(1 点の率)', runs: '読み 2 × 成分 (S)(MS) × f 3 × 順逆 2(3 公転の步 —— Ω を毎步作り直す)+ 刻み半分',
  outcome: '輪の 3 つの結果 × 経路 2 +〔第350便g〕の粒子の輪 3 列(両方・源の回転だけ・並進だけ)', swap: '〔第350便g〕の表 8 の 60 行 × 成分 3(寄せる力の高さ ±6)+ 赤道面の閉じた形 2 点',
  rotvert: '🛟 の正本の要点 2 行 + 区分の中心 5 × 読み 2(寄る速さの等価・源の赤道面に対する率)', saturn: '区分の中心 5 × 読み 2 × 順逆 2 × 成分 3' });

/* ───────── 輪の 3 つの結果と 2 経路(表 1)───────── */
/** 〔第350便g〕の粒子の輪(表 10 —— 3 公転の傾きの変化・厚みの比)と、同じ輪の (R3) の步(f 1・k₁ 1 —— 3 公転)を並べる */
export function outcomeRows(DC, runs) {
  const p = (cfg) => DC.T4.find((r) => r.cfg === cfg), pick = (read, part) => runs.rows.find((r) => r.read === read && r.part === part && r.f === 1 && r.sense === 'pro');
  const prec = (read) => runs.rows.find((r) => r.read === read && r.part === 'S' && r.f === 0 && r.sense === 'pro');
  return {
    particle: ['both', 'spin', 'trans'].map((cfg) => ({ cfg, dTiltDeg: p(cfg).dTilt, rmsMeanRatio: p(cfg).rmsMeanRatio })),
    r3: L.DECL.reads.map((read) => ({ read, tiltS: pick(read, 'S').dEpsDeg, tiltMS: pick(read, 'MS').dEpsDeg, tiltM: 0, nodeF0: prec(read).dNodeDeg, tiltF0: prec(read).dEpsDeg })),
  };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nR = D.reads.length * D.parts.length * D.senses.length, nRun = D.reads.length * 2 * D.step.fShow.length * D.senses.length, nSat = D.sat.centers.length * D.reads.length * D.senses.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    rates: J.rates.length === nR && J.rates.filter((r) => r.part === 'M').every((r) => r.perp === 0 && r.raise === 0)
      && J.rates.filter((r) => r.part === 'S').every((r) => (r.sense === 'pro') === (r.dLine > 0)),
    runs: J.runs.rows.length === nRun && J.runs.rows.every((r) => r.lenErr < 1e-12) && J.runs.rows.filter((r) => r.f === 1).every((r) => r.dNodeDeg === 0) && J.runs.half.rel < 1e-2,
    outcome: J.outcome.particle.length === 3 && J.outcome.r3.length === D.reads.length,
    swap: J.swap.rows.length === 60 && J.swap.rows.every((r) => r.linRel < 1e-8) && J.swap.vs350g === 0 && J.swap.rows.filter((r) => r.swap).every((r) => r.nOver >= r.nHeights - 2) && J.swap.closed.every((c) => c.relM < 1e-12 && c.relS < 1e-12),
    rotvert: J.rotvert.rows.length === D.sat.centers.length && J.rotvert.book.length === 2 && J.rotvert.inDefault === false,
    saturn: J.saturn.rows.length === nSat && J.saturn.rows.every((r) => r.M.cos > 0.999 && (r.sense === 'pro' ? r.S.cos < -0.999 : r.S.cos > 0.999)),
  };
}
/** 入力の正本を読む(器だけがファイルを読む) */
export function readInputs() { return { RV: JSON.parse(fs.readFileSync(path.join(ROOT, INPUT_ROTVERT), 'utf8')), DC: JSON.parse(fs.readFileSync(path.join(ROOT, INPUT_DISKCHECK), 'utf8')) }; }
const snap0 = (x) => (Math.abs(x) < 1e-12 ? 0 : x);
export function runAll(IN = readInputs()) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const rates = L.ringRates(); mark('rates');
  const runs = L.ringRuns(); for (const r of runs.rows) r.dNodeDeg = snap0(r.dNodeDeg); mark('runs');
  const outcome = outcomeRows(IN.DC, runs); mark('outcome');
  const sw = L.swapParts(), flags = IN.DC.T3.rows.map((r) => r.swap);
  const swap = { rows: sw, closed: L.closedCheck(), vs350g: sw.filter((r, k) => r.swap !== flags[k]).length, nSwapK1: sw.filter((r) => r.col === 'k1' && r.swap).length, nK1: sw.filter((r) => r.col === 'k1').length,
    nSwapIn: sw.filter((r) => r.col === 'inPos' && r.swap).length, nIn: sw.filter((r) => r.col === 'inPos').length }; mark('swap');
  const saturn = L.saturnRows(); mark('saturn');
  const RS = G.rotvertSummary(IN.RV), rotvert = Object.assign({ version: RS.version, ok: RS.ok, key: RS.key, inDefault: RS.inDefault, book: RS.book }, L.rotvertRows(RS, saturn)); mark('rotvert');
  const J = { pure, rates, runs, outcome, swap, rotvert, saturn: { rSync: saturn.rSync, Wrule: saturn.Wrule, units: saturn.units, rows: saturn.rows }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351j-ringstep.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351J_OUT ? (path.isAbsolute(process.env.W351J_OUT) ? process.env.W351J_OUT : path.join(ROOT, process.env.W351J_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便j ringstep(版 ' + HARNESS_VERSION + ')');
  let tm = null; const IN = readInputs();
  const S = settleRun(() => { const R = runAll(IN); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351j-ringstep.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R436',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便j', target: TARGET, code: codeClosure(), inputs: [INPUT_ROTVERT, INPUT_DISKCHECK] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ringstep', engine: 'Node(html を読まない —— 純関数の lib: 〔第350便g〕の在位の形の場・〔第351便d〕の 2 経路・〔第351便c〕の閉じた形)・🛟 と〔第350便g〕の正本は読むだけ・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

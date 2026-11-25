// 第352便f(原仮定者の回答(2026-11-24 —— 第148報)AN1015・原仮定者の整理(2026-11-24 —— 第148報)「銀河由来の軸引きずりについて」・統括の検証項目 R443):
//   **銀河の円盤の中の回転の差分を数える器 —— 表 1 速度の場の運動学(速さの差分・向きの変化の分・局所の回転)/表 2 在位の形の場に輪の上の点の源を並べた小さな対照の模型で、
//   R₀ に置いた受け手(太陽)の回転を読みごと((M 型)・(源の運動だけ)・(S 型-点)・(S 型-体))に Ω₀ の倍で/表 3 一様な背景(倍率 1 = ω_G)と (uV) との比/表 4 上下の運動と傾き(トルクの零試験)**
//   (段 galdisk-352f —— 正本 tests/out/galdisk-352f.json・lib tests/lib-w352f-galdisk.mjs)。
//   **診断だけ** —— 銀河の回転から背景軸引きずりを作らない(原文の段階の指示)。背景の大きさを本器の数で置かない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352f-galdisk.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 9): 閉じた形(p 1 → Ω₀・p 0 → Ω₀/2・p −½ → Ω₀/4)/平坦の速さの差分 0 と向きの変化の分 Ω₀/一様な並進 0/共通の点検の数/
//   自分の重み off の M 型 = 源の運動だけ・(S 型-点) 0・(S 型-体) q 0 = 剛体の回転/反転とガリレイ/変異/拒否/トルク(一様・高さの 1 次・球の潮汐で 0・扁平の潮汐の閉じた形)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352f-galdisk.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352f-galdisk-1';
export const OUT_MAIN = 'tests/out/galdisk-352f.json';
export const TARGET = 'tests/lib-w352f-galdisk.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '予想の文を数えられる形に直した対照の表(銀河の回転から背景軸引きずりを作った値ではない —— 原文の段階の指示)',
  '「並進引きずりの差分」を速さの差分と読むか向きの変化の分を含めて読むかは決めていない(両方の列)',
  '「銀河由来の (S)」を点の源の自転と読むか円盤全体の回転と読むかは決めていない(両方の列)',
  '円盤の模型(面密度・外縁・輪の数・核・受け手の自分の重み)は宣言のノブ —— 銀河の質量の分布の答えではない(銀河の質量は第348便h の galMass の桁・文献の値・未照合の組から)',
  '背景の大きさは本器の数で置かない —— (uV) との桁の差は数だけ', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 9', kin: '表 1: p 3 × 閉じた形と数値(有限の差・(C2) の求積)',
  disk: '表 2: p 3 × 面密度 2 × 外縁 2 × 輪の密さ 2 × 核 2 × 自分の重み 2 × 読み (M 型)(源の運動だけ) × 回転の読み (W)(C2) + (S 型-体) 2 + (S 型-点)',
  conv: '基準の組・p 0・N_φ 64・128・256', c2check: '自分の重み off・基準の組・p 3 の c2Quad(半径 0.02)と (W)',
  bg: '表 3: 表 1 と表 2 の基準の組の数 × ω_G・(uV) との桁の差 + (uV) の数え直し', torque: '表 4: 場 4 × 球と扁平' });

/* ───────── 表 3 ───────── */
export function bgRows(kin, disk, uv) {
  const B = L.DECL.disk.base, base = (p, al = B.al) => disk.find((r) => r.p === p && r.sigma === B.sigma && r.edge === B.edge && r.perUnit === B.perUnit && r.al === al), out = [];
  for (const k of kin) {
    out.push({ src: 'kin', what: 'vOverR', p: k.p, ...L.bgRatio(k.vOverR) });
    out.push({ src: 'kin', what: 'omega', p: k.p, ...L.bgRatio(k.omega) });
    out.push({ src: 'kin', what: 'dvdR', p: k.p, ...L.bgRatio(k.dvdR) });
  }
  for (const p of L.DECL.ps) for (const al of L.DECL.disk.als) { const r = base(p, al), b0 = r.body.find((b) => b.kind === 'atR0');
    out.push({ src: 'disk', what: 'Moff', p, al, ...L.bgRatio(r.off.M.W) });
    out.push({ src: 'disk', what: 'MruleC2', p, al, ...L.bgRatio(r.rule.M.C2) });
    out.push({ src: 'disk', what: 'srcRuleC2', p, al, ...L.bgRatio(r.rule.src.C2) });
    out.push({ src: 'disk', what: 'bodyRuleC2', p, al, ...L.bgRatio(b0.rule.M.C2) }); }
  return { rows: out, uv };
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nGrid = D.ps.length * D.disk.sigmas.length * D.disk.edges.length * D.disk.perUnits.length * D.disk.als.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    kin: J.kin.length === D.ps.length && J.kin.every((r) => r.relFD < 1e-6 && r.relC2 < 2e-4),
    disk: J.disk.length === nGrid && J.disk.every((r) => Math.abs(r.off.M.W - r.off.src.W) <= 1e-12 * Math.abs(r.off.M.W) + 1e-15 && r.off.M.Wxy === 0 && r.body.length === 2
      && r.body.every((b) => Math.abs(b.off.M.W - b.spin) < 1e-12) && r.sPoint === 0),
    conv: J.conv.length === 3 && Math.abs(J.conv[2].W / J.conv[1].W - 1) < 0.01,
    c2check: J.c2check.length === D.ps.length && J.c2check.every((r) => r.rel < 1e-2),
    bg: J.bg.rows.length === D.ps.length * 3 + D.ps.length * D.disk.als.length * 4 && J.bg.uv.relDecl < 1e-5 && Math.abs(J.bg.uv.b1OverOmegaG - 1) < 1e-12,
    torque: J.torque.length === 4 && J.torque[0].sphere.every((x) => x === 0) && J.torque[1].sphere.every((x) => x === 0) && J.torque[1].oblate.every((x) => x === 0)
      && J.torque[2].sphere.every((x) => x === 0) && Math.abs(J.torque[2].oblate[1] / J.torque[2].closedY[1] - 1) < 1e-9 && Math.abs(J.torque[3].sphere[1] / J.torque[3].closedY[0] - 1) < 1e-9,
  };
}
const snap = (x, s) => (Math.abs(x) <= 1e-12 * s ? 0 : x);
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const kin = L.kinRows().map((r) => ({ p: r.p, dvdR: r.dvdR, vOverR: r.vOverR, omega: r.omega, shearA: r.shearA, numDvdR: snap(r.num.dvdR, 1), numVOverR: r.num.vOverR, omegaFD: r.num.omegaFD, omegaC2: r.num.omegaC2,
    relFD: r.relFD, relC2: r.relC2 })); mark('kin');
  const disk = L.diskRows().map((r) => ({ ...r, sPoint: L.sPointCase(r) })); mark('disk');
  const conv = L.convRows(); mark('conv');
  const c2check = L.c2CheckRows(); mark('c2check');
  const bg = bgRows(kin, disk, L.uvCheck()); mark('bg');
  const torque = L.torqueRows(); mark('torque');
  const J = { pure, kin, disk, conv, c2check, bg, torque, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352f-galdisk.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352F_OUT ? (path.isAbsolute(process.env.W352F_OUT) ? process.env.W352F_OUT : path.join(ROOT, process.env.W352F_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便f galdisk(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352f-galdisk.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R443',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便f', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'galdisk', engine: 'Node(html を読まない —— 純関数の lib: 〔第348便h〕の在位の形の場・〔第350便b〕の (C2)・〔第351便e〕の背景の項)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第352便c(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R440):
//   **太陽系の基準軸の候補と、太陽の自転軸の円錐の器 —— 候補(等しい重み eq・角運動量の重み L・黄道の極 ecl・質量 × √a の重み La・球面上の中央値・水星を外す・巨大惑星 4 つ・地球型 4 つ・冥王星を足す)と
//   8 惑星の公転の法線の散らばり・1 つ外した軸・「歳差運動の中心軸」の読み (ア)(イ)・円錐の半頂角(太陽・8 惑星・比べる行)・基準軸に垂直な面での太陽の傾きの方位・背景の向きの候補 4 つと基準軸**
//   (段 refaxis-352c —— 正本 tests/out/refaxis-352c.json・lib tests/lib-w352c-refaxis.mjs)。
//   **診断だけ** —— 基準軸を 1 つに選ぶものではない。エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352c-refaxis.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、並べた候補と判定の物差しの記録。観測の向きは固定の比べる列(合わせない)。
// ■ 判定の物差し(零試験 10): 統括の数え直しの数 4 組(軸・太陽との角・1 つ外し・背景との角)/重みを同じにした L = eq/法線を 1 本にそろえた変異/中央値/方位/角の道具/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as L from './lib-w352c-refaxis.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352c-refaxis-1';
export const OUT_MAIN = 'tests/out/refaxis-352c.json';
export const TARGET = 'tests/lib-w352c-refaxis.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '基準軸の候補を並べるだけ —— 基準軸を 1 つに選んでいない(定義は原仮定者に伺う項)',
  '「歳差運動の中心軸」は、自転軸の歳差の中心の時系列がリポジトリに無いので、読み (ア)(イ) の幾何だけを数えた(歳差を積分していない)',
  '太陽の傾きの方位と銀河の向きの方位は数だけ —— 傾きの原因・公転面の由来の答えとは書かない(形成の文は予想の文)',
  '向き(自転の極・公転の要素・銀河の北極と中心)はリポジトリの中の値(文献の値・未照合)の固定の比べる列', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 10', cand: '候補 10', loo: '8 惑星 × 軸 2(eq・L)', reading: '読み 2((ア)(イ))', cone: '13 天体 × 軸 3', az: '軸 3 × 向き 7', bg: '軸 3 × 背景の向き 4' });

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nCand = L.CAND_ORDER.length, eq = J.cand.find((r) => r.name === 'eq'), med = J.cand.find((r) => r.name === 'med');
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    cand: J.cand.length === nCand && eq.toEq === 0 && J.cand.every((r) => r.sum >= med.sum - 1e-9),
    loo: J.loo.length === L.DECL.planets.length && J.loo.every((r) => r.eq > 0 && r.L > 0),
    reading: J.reading.length === 2 && J.reading[0].centersMeanToEq < 1e-9 && J.reading.every((r) => r.cones.length === L.DECL.planets.length),
    cone: J.cone.length === 1 + L.DECL.planets.length + L.DECL.compareRows.length && J.cone.filter((r) => r.id !== 'Sun').every((r) => ['eq', 'L', 'ecl'].every((k) => Math.abs(r[k].cone - r.obl - r[k].diff) < 1e-9)),
    az: J.az.length === 3 * (L.AZ_DIRS.length + 1) && J.az.filter((r) => r.dir === 'sun').every((r) => r.dAzSun === 0),
    bg: J.bg.length === 3 * L.BG_ORDER.length && J.bg.filter((r) => r.bg === 'Np').every((r) => r.toAxis < 1e-9) && J.bg.filter((r) => r.bg === 'Nm').every((r) => Math.abs(r.toAxis - 180) < 1e-9),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry();
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const axes = L.refAxes(T1, GEO); mark('axes');
  const cand = L.candRows(T1, GEO); mark('cand');
  const loo = L.looRows(T1, GEO); mark('loo');
  const reading = L.readingRows(T1, GEO); mark('reading');
  const cone = L.coneRows(T1, GEO); mark('cone');
  const az = L.azRows(T1, GEO); mark('az');
  const bg = L.bgRows(T1, GEO); mark('bg');
  const J = { pure, axes, cand, loo, reading, cone, az, bg, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352c-refaxis.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352C_OUT ? (path.isAbsolute(process.env.W352C_OUT) ? process.env.W352C_OUT : path.join(ROOT, process.env.W352C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便c refaxis(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352c-refaxis.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R440',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便c', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'refaxis', engine: 'Node(html を読まない —— 純関数の lib・第347便e・第348便c・第351便e・第350便e・第342便e・第341便g の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

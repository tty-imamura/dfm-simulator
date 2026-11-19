// 第338便b(原仮定者の回答(2026-11-15 —— 第138報の回答 5)・原仮定者の指示(2026-11-15 —— 第139報)・原仮定者の指示(2026-10-18 —— 第101報・第103報)・
//   原仮定者の指示(2026-10-30 —— 第121報)・統括の検証項目 R350):
//   **軸引きずりの向きの補正のノブ(⑪ を 2 倍角の則に対する補正として q で振る)・AN747 の 3 列・合成の規則の一般の比** の器。
//   T2 (a) q と p の向きと強さの表 (b)「軸方向で弱くなる」の 2 つの置き方を差分の読みと回転引きずりの高さの型から (c) q を振ったときの天体の読み (d) q ごとの向き × 強さ/
//   T3 AN747 の 3 列(列 A・列 B・列 B′)の天体の符号と大きさ・金星の釣り合いの根と 3 成分の残り・赤道面の有限差分/T4 合成の規則の 3 列。
//   (段 bevelknob-338b —— 正本 tests/out/bevelknob-338b.json・lib tests/lib-w338b-bevelknob.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w338b-bevelknob.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T2: q 0・0.25・0.5・0.75・1(μ = 2^{q/2})と全体に掛ける型 p 0・1・2 × 仰角 9 点(0°〜90°)。物差し: 原文の 3 点の**種類**(赤道 = 逆の側・45° = 90° 傾き・軸の方向 = 順の側 ——
//     角度の数で候補を落とさない)と「軸方向で弱くなる」(軸の方向の強さ ÷ 赤道の強さ)を**向き × 強さ**で数に。置き方の比べ: 逆回転の分の大きさが差分の読みの cos el と同じか・
//     順回転の分の落ち方が回転引きずりの高さの型(第337便i の ball)と同じか(最大の差)。天体: 太陽 → 8 惑星と衛星 7 の軌道の平均の向きの因子・銀河 → 太陽系の向きと 120° に要る仰角・金星の釣り合いの根(第337便l 版 2 の式)・自転軸の傾いた受け手。
//   T3: 列 A f(α_e − 1)・列 B f・列 B′ α f(1 − f)(背景慣性決定力 W₀ は第337便a の解のまま)。物差し: 符号(逆の側か順の側か)と大きさ・金星の釣り合いの根の読み(零点合わせ/有限の 2 項の拮抗)・
//     この列でこの f に固定したら要る背景の項の倍率(定数にしない)・黄道の北の 1 成分の式の 3 成分の残り・有限差分が R/r → 0 で勾配へ寄るか。
//   T4: 比 B/A 1・0.5・0.1 × 角 13 点。物差し: 普通のベクトル和・今の規則(120° 以下なら大きい側を下回らない)・境目を比で動かす型(cos θ ≥ −B/(2A))—— どれを採るかは決めない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as K from './lib-w338b-bevelknob.mjs';
import * as F from './lib-w343f-judge3rest.mjs';   // 第343便f: 軸の上・赤道の行の閉じた形と 3 値の判定
import { sigmaOf, settle, recheckTree, LIB_VERSION as R338_VERSION, DECL as R338_DECL } from './lib-w338c-recheck.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w338b-bevelknob-2';
export const AMEND = Object.freeze(['版 2(第343便f —— 統括の検証項目 R383・AN798): 正本へ書く形を第338便c の settle の型に(Math の関数を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉を 0 と書く —— 門は 0 と書いた後の値で作る)。'
  + '仰角 0°・90° の行は閉じた形の値(tests/lib-w343f-judge3rest.mjs の closedCell —— 軸の上で強さが解析的に 0 の欄の種類は「解析の 0」・旧は「強さ 0」を数から読み、ずらした走行で向きのある種類に変わった)。'
  + '「軸方向で弱くなる」は 3 値の文字(赤道 − 軸の上の強さが解析的に 0 なら「解析の 0」・正・負)・合成の規則 (iii) の「減速しない」は余裕 cos θ + B/(2A) の 3 値(judge3 —— 120°・比 1 は「未解決」)。式・格子・ほかの値は不変']);
export const OUT_MAIN = 'tests/out/bevelknob-338b.json';
export const TARGET = 'tests/lib-w338b-bevelknob.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['補正のノブ q の値を決めない(候補の表)', 'AN747 の列のどれかを採らない(両方の列を残す —— 原仮定者の指示(2026-11-15 —— 第139報))',
  '背景の項の倍率を定数にしない(この列でこの f に固定したら要る数)', '金星の釣り合いの根は黄道の北の 1 成分の式(3 成分の定常ではない)', '合成の規則のどれを採るかを決めない(原仮定者の規則は書き換えない)', '文献の値は未照合']);
export const PLAN = Object.freeze({ parts: Object.freeze(['t2', 't3', 't4']), floor: K.FLOOR, floorNote: '解析的に 0 になる量・打ち消しの残りは、同じ単位の尺度 × 1e-12 より小さければ 0 と書く(尺度は各欄の注)' });

export function partT2() {
  const rows = F.elevRows343f(), place = K.placementRows();
  return { rows, placement: place, placementJudge: K.placementJudge(place), read: K.knobReadRows(), tilt: K.tiltRows(), judge: F.knobJudge343f(rows) };
}
export function partT3() { return { bodies: K.an747Bodies(), venus: K.an747Venus(), fd: K.an747Fd() }; }
export function partT4() { return F.ruleTable343f(); }

export function gatesOf(J) {
  const t2 = J.t2, t3 = J.t3, t4 = J.t4, r = (el) => t2.rows.find((x) => x.elDeg === el), Q = K.DECL.qGrid, P = K.DECL.pGrid, pj = t2.placementJudge;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    // (a) どの q・p も赤道 180°・45° で 90°(q は強さ 1)・q 0 と p 0 が同じ・q > 0 と p > 0 は軸の方向で強さ 0
    t2Table: t2.rows.length === K.DECL.elevDeg.length && Q.every((q) => r(0).q[q].ang === 180 && Math.abs(r(45).q[q].ang - 90) <= 1e-9 && Math.abs(r(45).q[q].mag - 1) <= 1e-12)
      && P.every((p) => r(0).p[p].ang === 180 && Math.abs(r(45).p[p].ang - 90) <= 1e-9) && t2.rows.every((x) => x.q[0].ang === x.p[0].ang && x.q[0].mag === x.p[0].mag)
      && Q.filter((q) => q > 0).every((q) => r(90).q[q].mag === 0) && P.filter((p) => p > 0).every((p) => r(90).p[p].mag === 0),
    // (b) q 1 は逆回転の分が差分の読みと同じで順回転の分が ball の高さの型と同じ落ち方・p 1 は順回転の分だけ同じ・q 0(= p 0)は順回転の分が落ちない
    t2Place: pj.q1.perpDev === 0 && pj.q1.parDevBall === 0 && pj.p1.parDevBall === 0 && pj.p1.perpDev > 0 && pj.q0.parDevBall > 0 && Q.every((q) => pj['q' + q].perpDev === 0),
    // (c) 天体の表がそろう・q 0 で 120° に要る仰角 30°・金星の根は符号つき 2・取り分 1・仰角 0° の受け手は q に依らない
    t2Read: t2.read.planets.length === 8 && t2.read.moons.length === 7 && t2.read.galaxy.rows.length === Q.length && Math.abs(t2.read.galaxy.rows[0].el120 - 30) <= 1e-9
      && t2.read.venus.length === (Q.length + P.length) * 2 && t2.read.venus.every((v) => v.nRoots === (v.amp === 'signed' ? 2 : 1) && v.roots.every((x) => x.sumOverScale === 0))
      && t2.tilt.filter((x) => x.elDeg === 0).every((x) => x.spreadQ === 0) && t2.tilt.some((x) => x.elDeg > 0 && x.spreadQ > 0.05),
    // (d) どの q も赤道 = 逆の側・45° = 90° 傾き・軸の方向 = 順の側(種類)・q > 0 は軸方向で弱くなる(「正」)・q 0 は差が解析的に 0(第343便f —— 「未解決」を成功に数えない)
    t2Judge: Q.every((q) => { const j = t2.judge['q' + q]; return j.eqKind === '逆の側' && j.midKind === '90° 傾き' && j.poleKind === '順の側' && (q === 0 ? j.weak === F.DECL.ANALYTIC_ZERO : j.weak === '正'); }),
    // T3: 列 A・B が本体(第337便l の planetRows)の太陽の項と同じ・列 B と B′ は全天体で同じ符号(逆の側)・金星の根 A 2・B 1・B′ 1 で黄道の北の成分 0・自転の軸に垂直な残り > 0.1
    t3Bodies: t3.bodies.planets.length === 8 && t3.bodies.planets.every((p) => p.bodyA === 0 && p.bodyB === 0 && p.sign.B === p.sign.Bp) && t3.bodies.moons.length === 7 && t3.bodies.moons.every((m) => m.sign.B === m.sign.Bp),
    t3Venus: t3.venus.length === 3 && t3.venus.find((v) => v.col === 'A').nRoots === 2 && t3.venus.find((v) => v.col === 'B').nRoots === 1 && t3.venus.find((v) => v.col === 'Bp').nRoots === 1
      && t3.venus.every((v) => v.roots.every((x) => x.north === 0 && x.sumOverScale === 0 && x.perpSpinRel > 0.1)),
    t3Fd: t3.fd.length === K.DECL.fdF.length && t3.fd.every((x) => x.errA[1e-4] < x.errA[1e-3] && x.errA[1e-5] <= 1e-9 && x.errBp[1e-5] <= 1e-9 && (x.errBp[1e-3] === 0 || x.errBp[1e-4] < x.errBp[1e-3]) && x.signBp === -1)
      && t3.fd.filter((x) => x.f < 0.5).every((x) => x.signA === -1) && t3.fd.filter((x) => x.f > 0.5).every((x) => x.signA === 1),
    // T4: 等しい大きさで 120° のベクトル和 1・比 0.1 で 0.9539…(今の規則は 1 へ持ち上げる)・境目を比で動かす型の境目は比 1 で 120°
    t4Rule: t4.rows.length === K.DECL.ruleRatios.length * K.DECL.ruleAngles.length && Math.abs(t4.gal120[0].vecSum - 1) <= 1e-12 && t4.gal120[2].liftII > 0.04
      && Math.abs(t4.gal120[0].boundaryIII - 120) <= 1e-9 && t4.rows.every((x) => x.ruleIII === x.vecSum) && t4.bodies.length === 3,
  };
}
/** 生の走行(門なし —— 尺度を測る対象) */
export function runRaw() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = K.pureScenes(); mark('pure');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(); mark('t4');
  return { pure: { scenes: PS }, t2, t3, t4, timing: tm };
}
/** 第343便f: 正本へ書く形(第338便c の settle の型)—— 尺度を測る → 3 値の判定を書く → 0 と書く → 門を 0 と書いた後の値で作る(壁時計は元のままの走行の値) */
export function runSettled() {
  let tm = null;
  const run = () => { const R = runRaw(); if (tm === null) tm = R.timing; delete R.timing; return R; };
  const { base, sigma, unstable } = sigmaOf(run), j3 = F.judge343f(base, sigma), S = settle(base, sigma);
  const J = S.value; J.pure.gates = K.pureGates(J.pure.scenes); J.timing = tm;
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return { J, recheck: { version: R338_VERSION, decl: R338_DECL, zeroed: S.zeroed, kept: S.kept, zeroPathsHead: S.zeroPaths, unstable: unstable.length, unstableHead: unstable.slice(0, 20), judge3: j3 } };
}
/** 器の走行(正本と同じ形 —— settle の後の値・門) */
export function runAll() { return runSettled().J; }
/** 第343便f: QA の作り直しの照合(recheckRun と同じ戻りの形 —— 尺度を測り、3 値の判定を書いてから正本と比べる) */
export function recheck343f(canon, parts) {
  const { base, sigma, unstable } = sigmaOf(() => { const q = runRaw(); delete q.timing; return q; });
  F.judge343f(base, sigma);
  const diffs = {}; let nLeaves = 0, nZero = 0;
  for (const k of parts) { diffs[k] = recheckTree(base[k], sigma[k], canon[k]); nLeaves += diffs[k].nLeaves; nZero += diffs[k].nZero; }
  return { diffs, unstable, nLeaves, nZero, base, sigma };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w338b-bevelknob.mjs', 'tests/lib-w338b-bevelknob.mjs', 'tests/lib-w343f-judge3rest.mjs', 'tests/lib-w338c-recheck.mjs', 'tests/lib-w340h-thin.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W338B_OUT ? (path.isAbsolute(process.env.W338B_OUT) ? process.env.W338B_OUT : path.join(ROOT, process.env.W338B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第338便b bevelknob(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: K.LIB_VERSION, lib343fVersion: F.LIB_VERSION, lib337Version: K.L337_VERSION, generator: 'tests/exp-w338b-bevelknob.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-15 —— 第138報の回答 5)「⑪は２倍角に対する補正だと思われるので、廃止せず経緯を見直し」・原仮定者の指示(2026-11-15 —— 第139報)・原仮定者の指示(2026-10-18 —— 第101報・第103報)・原仮定者の指示(2026-10-30 —— 第121報)・統括の検証項目 R350',
    decl: K.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第338便b', target: TARGET, code: CODE_ALL, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bevelknob', recheck, engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない)', notClaim: NOT_CLAIM, floor: K.FLOOR,
    floorNote: '丸めの残り: 同じ単位の尺度 × 1e-12 より小さい量は 0 と書く(向きの強さは ÷ s・差は ÷ 1・金星の和は打ち消しの前の尺度・有限差分の誤差は ÷ s f・合成の持ち上げは ÷ A)' });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
/** 来歴のコード(器・lib と import の閉包) */
function closure(start) {
  const seen = new Set(), st = [...start];
  while (st.length) { const f = st.pop(); if (seen.has(f)) continue; seen.add(f); let t = ''; try { t = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) st.push('tests/' + m[1]); }
  return [...seen].sort();
}
const CODE_ALL = closure([...CODE, 'tests/lib-w272e-provenance.mjs']);
if (IS_MAIN) await main();

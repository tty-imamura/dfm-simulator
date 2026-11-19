// 第344便d(原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・同 回答 3 AN876・統括の検証項目 R388):
//   **T1 今のアプリの引きずりの步の読み(どの量をどの時間で足しているか)/T2 当事者時間の因子を掛ける所の宣言(D0〜D3・対照 DC)と零試験 3/
//   T3 近点の一次の項(K1 だけ・重力だけ・両方 × 宣言 × 時計の型 2 × 刻み 2・二次の読み・足した列)/T4 2 体の移送の力積と仕事/T5 軸・回転の引きずりの率に q を掛けたときの相対の変化の桁**
//   (段 dragconv-344d —— 正本 tests/out/dragconv-344d.json・lib tests/lib-w344d-dragconv.mjs)。**診断だけ** —— アプリの引きずり・重力・時計・積分・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w344d-dragconv.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。T1 の表のコードの引用は QA が対象の html で引く。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T2: 宣言 D0・D1・D2・D3・対照 DC × 零試験 3(静止・一様な場〔源なし・背景 ψ₀ = 0.3〕・一様に動く枠〔u = 0.05・2 体・2 周〕)。物差し: 宣言の間の差 0(動く枠は 1e-11)。
//   T3: 重力 none(ニュートン)・(i)(今の G_loc n_G = 2 受け手)・(iii)(同じ G_loc を当事者時間 1 秒あたり —— 第343便b)× 引きずり なし・D0〜DC × 時計の型 F・U1 × 1 周の刻み 3000・6000
//       (a = 1・μ = 1e-5・e = 水星・近点 4 回の差)。物差し: 弱い場の 1PN = 1・見込み = 重力の宣言の一次(第343便b)+ K1 の一次 +5/3(第331便c)。一次の門は 4e-4(誇張した場の二次の項)。
//       二次の読み: 宣言の差 ÷ μ を μ = 1e-4・2e-4・4e-4 で(ニュートンだけ・型 F —— 差 ÷ μ がほぼ一定なら二次・差が μ に依らないなら一次)。
//   T4: 2 体(質量 0.01・0.005・a = 1・e = 0.3 —— 第343便b の系)× 宣言 5 × 型 2(RK4・1 周 4000 刻み・6 周)。近点ごとのニュートンの E と、移送が運んだ運動量の積み。
//   T5: 水星・金星・月(太陽の場と地球の場の 2 つの読み)の q − 1(型 F・U1 —— 定数は文献の値・未照合)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w344d-dragconv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w344d-dragconv-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/dragconv-344d.json';
export const TARGET = 'tests/lib-w344d-dragconv.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['引きずりの換算がどの宣言かを結論しない(宣言は比べるための宣言 —— 今のアプリの步は D0)',
  '2 度数えかどうかを結論しない(対照 DC は同じ q を 3 か所に重ねた組を表に並べるまで)',
  '近点の数は誇張した場(μ/a = 1e-5)の比 —— 水星の観測の値へ合わせたものではない・今の収支(42.98″/世紀)に項を足さない(足した列は別に置く)',
  'アプリの引きずり・重力・積分を変える提案は決断事項の候補に置く(本器はアプリに何も入れない)',
  '光速を、候補の採否に使わない(座標を運ぶ速さ u は切らない)']);
/** T1: 今のアプリの引きずりの步の読み(beta の html の該当の行 —— 走らせない表。引用は QA が対象の html で引く) */
export const T1 = Object.freeze({
  steps: Object.freeze([
    Object.freeze({ part: '(a) 枠の速度 u を作る所', code: '`ux+=b*(VX[j]-VX[i])`(K1 の新則 `inertialDragIsqBuild`)・`ux+=a*(WX[j]-WX[i])`(三次元の従来の核)・`VX=vel? S.vx : S._rdVX`', time: '源と受け手の速度(絶対時間で見た速度 —— 状態の v か、座標の差 ÷ 絶対時間の刻み)' }),
    Object.freeze({ part: '(b) 相対の速度 w = v − u を作る所', code: '`rvx=S.vx[i]-(S.uAx[i]+ubx)/denU`(点の時計 `tauUpdate` の中だけ)', time: '絶対時間で見た速度。引きずりの步は w を作らない(源との速度の差 v_j − v_i を重みで寄せる)' }),
    Object.freeze({ part: '(c) 速度を足す所(キック)', code: '`vz[i]+=az[i]*kickDt`(重力のキック —— 引きずりは足さない)', time: '絶対時間の刻み(半キック)。引きずりは速度 v を変えない(座標を運ぶ移送)' }),
    Object.freeze({ part: '(d) 位置を進める所(ドリフト)', code: '`if(doDrift){ x[i]+=vx[i]*dt; y[i]+=vy[i]*dt; z[i]+=vz[i]*dt; }`・移送 `NX[i]=(ux!==0)? X[i]+ux*dt : X[i]`', time: '絶対時間の刻み dt(移送 u dt はドリフトとは別の步で足す)' }),
    Object.freeze({ part: '回転引きずり', code: '`ux+=ay0*RC[c+2]-az0*RC[c+1]`(源の回転 Ω × r を u に)・`inertialDrag3RigidStep(S,n,dt,C,eps,KX,KY,KZ)`', time: '源の角速度(絶対時間 1 秒あたり)・変位は dt' }),
    Object.freeze({ part: '軸引きずり', code: '`inertialDrag3AxialApply(S,n,dt)`・`S.rotA[i]+=wp*dt`', time: '受け手の姿勢を ω dt だけ回す(絶対時間の刻み —— 位置と速度は触らない)' }),
    Object.freeze({ part: '点の時計(当事者時間)', code: '`S.tau[i]+= rad>0 ? dt*Math.sqrt(rad) : 0`', time: '積むだけ(表示と記録)。引きずりと重力の步は読まない(QA が該当の関数の本文に時計の配列が無いことを引く)' }),
  ]),
  noClockIn: Object.freeze(['dfmInertialDragStep3', 'dfmInertialDragStep', 'inertialDragIsqBuild', 'dfmInertialDrag3Build', 'inertialDrag3AxialApply', 'inertialDrag3RigidStep', 'inertialDrag3RotTerm']),
});
export const PLAN = Object.freeze({ expect: '重力の宣言の一次(第343便b の −(2 n_G q + ℓ + s)/6)+ K1 の一次 +5/3(第331便c)',
  currentBudget: '−28.65 + 71.63 = 42.98″/世紀(G_loc n_G = 2 受け手 + K1 —— 動かさない)', q: 'q = N g(x)・低速の展開 q = 1 − ψ − x²/2 + …' });

export function gatesOf(J) {
  const t3 = J.t3, z = J.t2zero, t4 = J.t4, t5 = J.t5;
  const sl = (d) => t3.slope.find((s) => s.drag === d).rows;
  const cand = t3.rows.filter((r) => r.drag !== 'DC');
  const t4r = (d) => t4.rows.filter((r) => r.drag === d);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t2Rest: z.rest.every((r) => r.maxDiff < 1e-15),
    t2Uniform: z.uniform.every((r) => (r.drag === 'DC' ? r.maxDiff > 1e-2 : r.maxDiff < 1e-15)),
    t2Boost: z.boost.every((r) => (r.drag === 'DC' ? r.maxShift > 1e-3 : r.maxShift < 1e-11)),
    t3First: cand.every((r) => Math.abs(r.dExpect) < 4e-4) && t3.rows.every((r) => r.halfDiff < 1e-6),
    t3Second: ['D1', 'D3'].every((d) => { const v = sl(d).map((r) => r.perMu); return v.every((x) => x < 0 && Math.abs(x / v[0] - 1) < 0.05); }) && sl('D2').every((r) => Math.abs(r.diff) < 1e-9),
    t3Control: sl('DC').every((r) => Math.abs(r.diff - 1 / 3) < 0.01) && t3.rows.filter((r) => r.drag === 'DC').every((r) => r.overPN - t3.rows.find((q) => q.grav === r.grav && q.drag === 'D0' && q.type === r.type).overPN > 0.33),
    t3Mercury: Math.abs(t3.pn.arcsecCy - 42.98) < 0.01,
    t4D0: t4r('D0').every((r) => r.xpEnd < 1e-14 && Math.abs(r.dESlope) < 1e-12),
    t4Break: ['D1', 'D2', 'D3', 'DC'].every((d) => t4r(d).every((r) => r.xpEnd > 1e-3)),
    t5Order: t5.rows.every((r) => r.qm1F < 0 && Math.abs(r.qm1F) > 1e-9 && Math.abs(r.qm1F) < 1e-7 && Math.abs(r.qm1U1 / r.qm1F - 1) < 1e-6),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t2zero = L.zeroTests(); mark('t2zero');
  const t3 = L.t3Rows(); mark('t3');
  const t4 = L.t4Rows(); mark('t4');
  const t5 = L.t5Rows(); mark('t5');
  const J = { pure, t2zero, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 正本へ書く形(第338便c の settleRun) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  const J = Object.assign(rest, { timing: tm });
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);   // 0 と書いた形で門を作り直す(正本の値で門が立つこと)
  return { J, recheck: S.meta, gatesRaw: gates, okRaw: ok };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w344d-dragconv.mjs', 'tests/lib-w344d-dragconv.mjs', 'tests/lib-w343b-partytime.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W344D_OUT ? (path.isAbsolute(process.env.W344D_OUT) ? process.env.W344D_OUT : path.join(ROOT, process.env.W344D_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第344便d dragconv(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck, okRaw } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w344d-dragconv.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・同 回答 3 AN876・原仮定者の補足(2026-11-18 —— 第141報)「引きずり自体は、座標変換なので熱を発生しない」・統括の検証項目 R388',
    decl: L.DECL, plan: PLAN, t1: T1, amend: AMEND, notClaim: NOT_CLAIM, ...R, okRaw };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第344便d', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'dragconv', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の RK4 の積分・第343便b の重力の宣言と第342便b の時計の型と第331便c の K1 の一次と第341便e の RK4 の 1 步を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第343便b(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN839「…加減速は、当事者時間で決まる。加減速のステップで進む時間を、当事者時間に合わせる。局所重力加速度との関係を確認する」・
//   統括の検証項目 R379): **T1 重力の加速の時間の 3 つの宣言/T2 近点の一次の項(3 つの宣言 + 対照の列 × n_G 0・1・2 × 時計の型 4 × 刻み 2・対称の型・当事者時間で書き換えた積分の零試験)/
//   T3 2 度数えの組と釣り合い(n_G = ½ の恒等式・今の在位の組と同じ一次になる n_G・足した列)/T4 多体の保存(2 体・3 体 × 対称と受け手 × n_G × 宣言・零試験 4)/T5 局所重力加速度(深さ 3)**
//   (段 partytime-343b —— 正本 tests/out/partytime-343b.json・lib tests/lib-w343b-partytime.mjs)。**診断だけ** —— アプリの積分・重力の式・時計・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w343b-partytime.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   (型に依らない列〔(i)・(N)〕の型の間の広がりと n_G = ½ の恒等式の門は 1e-8 —— 丸めの 1〜2 ulp をずらした走りの差が 2e-10 の桁・刻みの半分の差 5.6e-8 より小さい)
//   (一次の門は |数 − 見込み| < 2e-4 —— 誇張した場 μ = 1e-5 の二次の項〔μ の 10 倍の桁〕が残るので、第342便b の 1e-4 より広い。型・宣言の差の門は 1e-4)
//   T2: 宣言 (i)・(ii)・(iii)・対照 (N) × n_G ∈ {0, 1, 2}(受け手の型)× 時計の型 F・U1・U2・U3 × 1 周の刻み 3000・6000(a = 1・μ = 1e-5・e = 水星・近点 4 回の差)・
//       対称の型 n_G ∈ {1, 2}(U3)・宣言 (i) を当事者時間で書き換えた積分(n_G 0・2 × F・U3)。物差し: 弱い場の 1PN = 1 と見込みの式 −(2 n_G q + ℓ + s)/6。
//   T3: 受け手 n_G = ½ と対照 (N)・今の在位の組と同じ一次になる n_G(宣言ごと)・n_G = 2 のまま宣言を変えた足した列(K1 の +5/3 は第331便c の文書の値)。
//   T4: 2 体・3 体 × 対称・受け手 × n_G ∈ {0, 2} × 宣言 × 型 F・U3(RK4 4000 步・2 周)の運動量の残り・エネルギーの残り(ニュートンの E)・重心の漂い。零試験 4。
//   T5: 静止の ψ ∈ {1e-3, 0.1, 0.5} × n_G ∈ {0, 2} × 宣言の、静止から放した瞬間の絶対時間の加速とその場の時計で測った加速(閉じた形と短い落下の数値)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w343b-partytime.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w343b-partytime-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/partytime-343b.json';
export const TARGET = 'tests/lib-w343b-partytime.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['当事者時間で重力が出るとは書かない(3 つの宣言は比べるための宣言 —— 今のアプリの步は宣言 (i))',
  '近点の数は誇張した場(μ/a = 1e-5)の比 —— 水星の観測の値へ合わせたものではない・今の収支(42.98″/世紀)に項を足さない(足した列は別に置く)',
  '2 度数えかどうかを結論しない(同じ ψ の因子を 2 か所で掛ける組を表に並べるまで —— アプリの G_loc の ψ と時計の ψ は作り方が違う)',
  'アプリの積分を変える提案は決断事項の候補に置く(本器はアプリに何も入れない)',
  '光速を、候補の採否に使わない(本器の速さは場に対する物質の相対の速さ —— 座標を運ぶ速さは切らない)']);
/** T1: 今のアプリのコードがどの宣言に当たるか(html の該当の行の読み —— 走らせない表) */
export const T1 = Object.freeze({
  decls: Object.freeze([
    Object.freeze({ decl: 'i', absAccel: 'a_G', perTau: 'a_G/(N g)', note: '当事者時間に書き換えるだけ —— 軌道は同じ(T2 の書き換えの零試験)' }),
    Object.freeze({ decl: 'ii', absAccel: 'a_G g', perTau: 'a_G/N', note: '静止では今の重力のまま・動くときだけ変わる' }),
    Object.freeze({ decl: 'iii', absAccel: 'a_G N g', perTau: 'a_G', note: '静止でも変わる(N の因子)—— 局所の重力の因子と同じ ψ を 2 か所で掛け得る列' }),
  ]),
  app: Object.freeze([
    Object.freeze({ what: '重力の步', code: 'vx[i]+=ax[i]*kickDt(キックの步 —— 絶対時間の刻み)', reads: '宣言 (i)' }),
    Object.freeze({ what: '局所の重力の ψ', code: 'gLocKick3: PS[i] = κ_g Σ_j m_j/√(d² + ε²)(外部の他の天体だけ・軟化つき・背景 D₀ なし)', reads: 'ψ_G' }),
    Object.freeze({ what: '受け手の型', code: 'dGi = G·expm1(−2 n ψ_i)(差 G_i − G を今のニュートンの項に足す)', reads: 'G_i = G e^(−2 n_G ψ_i)' }),
    Object.freeze({ what: '対称の型', code: 'gi = G·expm1(−n (ψ_i + ψ_j))', reads: 'G_ij = G e^(−n_G (ψ_i + ψ_j))' }),
    Object.freeze({ what: '点の時計の ψ', code: 'tauUpdate: psi = (D0 + W_B + sumW[i])·kappaT', reads: 'ψ_clock(背景 D₀ と箱の決定力を含む)' }),
    Object.freeze({ what: '局所の重力を受ける本', code: 'gLocPrepare: S.coord3d !== true なら宣言を外す', reads: '三次元の本だけ' }),
  ]),
});
export const PLAN = Object.freeze({ closed: '−(2 n_G q + ℓ + s)/6(q = 受け手 1・対称 ½・ℓ = N を掛けると 1・s = g を掛けると 1)', currentBudget: '−28.65 + 71.63 = 42.98″/世紀(G_loc n_G = 2 受け手 + K1 —— 動かさない)' });

export function partT2() { return L.t2Rows(); }
export function partT3() { return L.t3Rows(); }
export function partT4() { return Object.assign(L.t4Rows(), { zero: L.t4Zero() }); }
export function partT5() { return L.t5Rows(); }

export function gatesOf(J) {
  const t2 = J.t2, t3 = J.t3, t4 = J.t4, t5 = J.t5, z = t4.zero;
  const r4 = (k, p, n, d) => t4.rows.filter((r) => r.kind === k && r.pair === p && r.nG === n && r.decl === d);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t2First: t2.rows.every((r) => Math.abs(r.dClosed) < 2e-4 && r.halfDiff < 1e-6) && t2.sym.every((r) => Math.abs(r.dClosed) < 2e-4 && r.halfDiff < 1e-6),
    t2Rewrite: t2.rewrite.every((r) => r.diff < 1e-8),
    t2Spread: t2.spread.every((s) => ((s.decl === 'i' || s.decl === 'N') ? s.spread < 1e-8 : s.spread < 1e-5)),
    t2Step: t2.step.every((s) => Math.abs(s.iiMinusI + 1 / 6) < 1e-4 && Math.abs(s.iiiMinusIi + 1 / 6) < 1e-4 && Math.abs(s.nMinusI + 1 / 6) < 1e-4),
    t2Mercury: Math.abs(t2.pn.arcsecCy - 42.98) < 0.01,
    t3Half: t3.half.diff < 1e-8,
    t3Balance: t3.balance.every((b) => Math.abs(b.overPN + 2 / 3) < 2e-4) && [1, 5 / 6, 2 / 3].every((v, i) => Math.abs(t3.added[i].withK1 - v) < 2e-4),
    t4Sym: ['two', 'three'].every((k) => r4(k, 'symmetric', 0, 'i').concat(r4(k, 'symmetric', 2, 'i')).every((r) => r.dP < 1e-12 && r.drift < 1e-12)),
    t4Break: t4.rows.filter((r) => r.decl !== 'i' || (r.pair === 'receiver' && r.nG === 2)).every((r) => r.dP > 1e-4 && r.drift > 1e-4),
    t4Energy: ['two', 'three'].every((k) => r4(k, 'symmetric', 0, 'i').every((r) => r.dE < 1e-9)),
    t4Zero: z.restMax < 1e-15 && z.uniMax === 0 && z.boost.every((b) => b.maxShift < 1e-11) && z.field.dV === 0 && Math.abs(z.field.mixErr - z.field.A * z.field.T) < 1e-15,
    t5Drop: t5.rows.every((r) => r.rel < 1e-4),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(); mark('t4');
  const t5 = partT5(); mark('t5');
  const J = { pure, t2, t3, t4, t5, timing: tm };
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
export const CODE = Object.freeze(['tests/exp-w343b-partytime.mjs', 'tests/lib-w343b-partytime.mjs', 'tests/lib-w342b-clockstop.mjs', 'tests/lib-w341e-lightmass.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W343B_OUT ? (path.isAbsolute(process.env.W343B_OUT) ? process.env.W343B_OUT : path.join(ROOT, process.env.W343B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第343便b partytime(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck, okRaw } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w343b-partytime.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN839「決定力場に対して動いている当事者の時間を「当事者時間」とする。速度は、決定力場に対する相対速度を、絶対時間で見る。加減速は、当事者時間で決まる。加減速のステップで進む時間を、当事者時間に合わせる。局所重力加速度との関係を確認する」・統括の検証項目 R379',
    decl: L.DECL, plan: PLAN, t1: T1, amend: AMEND, notClaim: NOT_CLAIM, ...R, okRaw };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第343便b', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'partytime', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の RK4 の積分・第342便b の時計の型と第341便e の RK4 の 1 步と水星の 1PN を呼ぶ)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

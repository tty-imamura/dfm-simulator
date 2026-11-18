// 第341便b(原仮定者の回答(2026-11-18 —— 第141報)AN790・原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-15 —— AN720)・統括の検証項目 R365):
//   **軸引きずりの天体の特性の係数のノブ C_b・和の型を金星の釣り合い・8 惑星と主な衛星・冥王星とカロンへ・赤道面以外の仰角のずれの率** の器。
//   T1 係数 C_b 6 × 仰角 7 × 源の取り分 6 の和の向きと強さ・境目の閉じた形・C_b 1 と ½ が第340便b の置き方 (b)・(a) と同じか・零試験/
//   T2 金星の釣り合い(和の型と差分だけの型 × C_b 8)の根・根の数・3 成分の残り/T3 天体ごとの要る C_b(釣り合いの読みと速さの一致の読み)・順位相関・候補の関数の形・相互ロックの部位差分/
//   T4 赤道面以外の仰角のずれの率 (b) と最小二乗の回転 (a) の閉じた形との差(受け手の半径 ÷ 距離 0.01〜0.5)・2 層の球/T5 赤道面の見え方の境を C_b 0.5・1・2 で引き直す。
//   (段 bodycoef-341b —— 正本 tests/out/bodycoef-341b.json・lib tests/lib-w341b-bodycoef.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w341b-bodycoef.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
// 正本へ書く形は第338便c の settleRun(Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉を 0 と書く)。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: C_b 0・0.25・0.5・1・1.5・2 × 仰角 0°〜90°(15° ごと)× f 1e-6・0.01・0.1・0.3・0.5・0.7。物差し: 和の向き(源の自転軸からの角 —— 種類)× 強さ ÷ f・数値(第340便b の列 (iii) の数値の回転 × 2 C_b + 座標の回転)と閉じた形の差・
//     90° 傾く仰角 sin² el* = 1 − 1/(C_b α (1 − f))・赤道面の和が 0 になる取り分 f₀ = 1 − 1/(C_b α)・天体が 1 つと軸の方向で C_b に依らず差分 0。
//   T2: C_b 0〜2(8 点)× 和の型 S(f) = f − C_b α P⊥ f(1 − f)/差分だけ C_b α P⊥ f(1 − f) × 0 < f < 1 の根(黄道の北の 1 成分の釣り合い・金星の自転の軸に沿う釣り合い)。物差し: 根の数と種類・W₀・3 成分の残り。
//   T3: 太陽 → 8 惑星と冥王星・惑星 → 主な衛星 7・冥王星 → カロン。物差し: 要る C_b(釣り合い = 和の自転の軸に沿う分 0/速さの一致 = その分が観測の自転の速さ)・C_b < 0 は「このノブだけでは定常にならない」・
//     要る C_b と密度・半径・扁平率・気体か・自転の周期・取り分・半長軸の順位相関(惑星 8 + 冥王星)・候補の関数の形 3 つの対数の残差の標準偏差。
//   T4: 仰角 15°〜75° × R/r 0.01・0.1・0.3・0.5(f 0.3)。物差し: 閉じた形との相対の差・R/r 0.01 → 0.1 の傾き(R/r の何乗で落ちるか)・2 層の球(核の半径 ½・密度の比 1・3・10)。
//   T5: C_b 0.5・1・2 で赤道面の和の符号(順/逆)の天体の分け。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as K from './lib-w341b-bodycoef.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w341b-bodycoef-1';
export const OUT_MAIN = 'tests/out/bodycoef-341b.json';
export const TARGET = 'tests/lib-w341b-bodycoef.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['天体の特性の係数 C_b の値を決めない(要る値の表 —— このノブの組では)', '係数を天体ごとに自由に振れば 1 つの量は何でも合う —— 合うこと自体は成果にしない',
  '係数を 1 に固定した結果を「合った」と書かない', '要る係数と天体の性質の順位相関は点が少ない(関係が見えるか、まで)—— 法則と書かない', '金星の 3 成分の残りは今の 2 つの向き(太陽の自転の軸と銀河の軸)では C_b に依らない',
  '光速を超えるかどうかを判定に使わない', '文献の値は未照合']);
export const PLAN = Object.freeze({ parts: Object.freeze(['t1', 't2', 't3', 't4', 't5']), floor: K.FLOOR,
  floorNote: '解析的に 0 になる量は、同じ単位の尺度 × 1e-12 より小さければ 0 と書く。正本へ書くときに第338便c の settleRun で丸めの残りを 0 に' });

export function partT1() { return { rows: K.t1Rows(), bounds: K.t1Bounds(), same340: K.t1Same340() }; }
export function partT2() { return K.t2Venus(); }
export function partT3() { const bodies = K.t3Bodies(); return { bodies, law: K.t3Law(bodies), locked: K.lockedPair() }; }
export function partT4() { return K.t4Rows(); }
export function partT5() { return K.t5Rows(); }

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, b = (C) => t1.bounds.find((x) => x.C === C), V = (C, col) => t2.rows.find((x) => x.C === C && x.col === col), B = (k) => t3.bodies.find((x) => x.key === k);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    // T1: 数値と閉じた形が同じ・C_b 1 と ½ が第340便b の (b)・(a) と同じ・天体が 1 つと軸の方向で 0・C_b 1 の f → 0 で 45°・f ½ で 0・C_b ½ 以下は赤道の境なし
    t1Sum: t1.rows.length === K.DECL.cGrid.length * K.DECL.fGrid.length && t1.rows.every((r) => r.cells.every((c) => c.dNum <= 1e-6)) && t1.same340.dB === 0 && t1.same340.dA === 0
      && t1.same340.nul.every((x) => x.single === 0 && x.axis === 0 && x.singleFactor === 0)
      && Math.abs(b(1).el90Small - 45) <= 1e-9 && Math.abs(b(1).fZeroEq - 0.5) <= 1e-12 && b(0.5).fZeroEq === null && b(0.25).fZeroEq === null && b(0).el90Small === null && Math.abs(b(2).el90Half - 45) <= 1e-9,
    // T2: 3 成分の残り(黄道の北の釣り合い)はどの C_b・どの列の根でも同じ(C_b は根の f を動かすだけ)・和の型の零点合わせの根は C_b > 1/(α P⊥) で在る
    t2Venus: t2.rows.length === K.DECL.cVenus.length * 2 && t2.rows.flatMap((r) => r.roots).every((x) => Math.abs(Math.abs(x.alongRel) - t2.invariant.alongRel) <= 1e-3 && Math.abs(x.perpRel - t2.invariant.perpRel) <= 1e-3)
      && V(1, 'sum').nRoots === 2 && V(0.5, 'sum').nRoots === 0 && V(1, 'diff').nRoots === 1 && t2.rows.filter((r) => r.col === 'sum' && r.C > 1 / (2 * t2.Pp)).every((r) => r.roots.some((x) => x.kind === 'zeroNode')) && t2.invariant.perpRel > 0.5,
    // T3: 釣り合いの読みの要る C_b は全部の受け手で在る・閉じた形 1/(α P⊥ (1 − f)) と対数で 1e-6 dex の内・速さの一致は順行の速い惑星で無い(地球・火星・木星・土星・海王星)・カロンも無い・相互ロックの部位差分は φ 0 で 0・φ ½ で半分
    t3Need: t3.bodies.length === 17 && t3.bodies.every((x) => x.bal !== null) && t3.law.forms.balClosed.sd <= 1e-6 && ['earth', 'mars', 'jupiter', 'saturn', 'neptune', 'charon'].every((k) => B(k).spd === null)
      && ['mercury', 'venus'].every((k) => B(k).spd !== null) && t3.locked[0].ratio === 0 && Math.abs(t3.locked[1].ratio - 0.5) <= 1e-9 && Math.abs(t3.locked[2].ratio - 1) <= 1e-9,
    // T4: (b) と (a) の閉じた形との差は R/r の 2 乗で落ちる(傾き 1.9〜2.1)・R/r 0.01 で 2e-4 より小さい・2 層の球は差を変えるが桁は同じ
    t4Shear: t4.rows.length === K.DECL.elevT4.length && t4.rows.every((r) => r.slopeB > 1.9 && r.slopeB < 2.1 && r.slopeA > 1.9 && r.slopeA < 2.1 && r.b[0.01] < 2e-4 && r.a[0.01] < 2e-4)
      && t4.layers.length === 3 && t4.layers.every((l) => l[0.5] > 0.01 && l[0.5] < 0.2),
    // T5: C_b ½ は全部が順の側・C_b 1 の境は f ½・C_b 2 の境は f ¾
    t5Eq: J.t5.length === 3 && J.t5[0].retro.length === 0 && Math.abs(J.t5[1].f0 - 0.5) <= 1e-12 && Math.abs(J.t5[2].f0 - 0.75) <= 1e-12,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = K.pureScenes(), pure = { scenes: PS, gates: K.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(); mark('t2');
  const t3 = partT3(); mark('t3');
  const t4 = partT4(); mark('t4');
  const t5 = partT5(); mark('t5');
  const J = { pure, t1, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 第338便c の型: 正本へ書く形(壁時計は元のままの走行の値) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w341b-bodycoef.mjs', 'tests/lib-w341b-bodycoef.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W341B_OUT ? (path.isAbsolute(process.env.W341B_OUT) ? process.env.W341B_OUT : path.join(ROOT, process.env.W341B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第341便b bodycoef(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: K.LIB_VERSION, lib340bVersion: K.B340_VERSION, lib338bVersion: K.K338_VERSION, lib337lVersion: K.L337_VERSION, lib337cVersion: K.C337_VERSION,
    generator: 'tests/exp-w341b-bodycoef.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-18 —— 第141報)AN790「推奨で進める。ただし、軸引きずりにおける近い面と遠い面の差は近似である。…しかしそれは難しいので、天体の特性を表す係数のノブにする」・原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の回答(2026-11-15 —— AN720)・統括の検証項目 R365',
    decl: K.DECL, lit: K.LIT, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第341便b', target: TARGET, code: CODE_ALL, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bodycoef', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない)', notClaim: NOT_CLAIM, floor: K.FLOOR, floorNote: PLAN.floorNote, recheck });
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

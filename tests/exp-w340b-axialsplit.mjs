// 第340便b(原仮定者の指示(2026-11-17 —— 第140報)・原仮定者の指示(2026-10-18 —— 第101報・第103報)・原仮定者の指示(2026-10-30 —— 第121報)・統括の検証項目 R357):
//   **軸引きずりの回転成分の二重計上の切り分け(軸方向で 0 になる候補の列)・赤道面の見え方(並進は順・軸は逆)・合成の規則の主の列・金星の 3 成分** の器。
//   T1 仰角 7 点 × 4 列(q 0・q 1・場の勾配の第 2 項・有限の受け手の部位差分)と比べる列(q 0.25〜0.75・p 1・p 2)・有限の受け手の寄り方・天体が 1 つの零試験/
//   T2 赤道面の見え方(順の分・逆の分・和 —— 距離の走査と太陽 → 8 惑星・惑星 → 主な衛星)/T3 合成の規則の主の列(普通のベクトル和)と「どんな比でも 120°」の列の差/
//   T4 金星の 3 成分(q 0・q 1 × 4 列 × 根)・歳差の読み・3 成分とも定常になる組の有無。
//   (段 axialsplit-340b —— 正本 tests/out/axialsplit-340b.json・lib tests/lib-w340b-axialsplit.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w340b-axialsplit.mjs —— 領域の宣言なし)・入力のファイルは無い。1 プロセス。
// 正本へ書く形は第338便c の settleRun(Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉を 0 と書く)。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 仰角 0°〜90°(15° ごと)× 列 (i) q 0・(ii) q 1・(iii) 場の勾配の第 2 項(数値の差分のヤコビアンと閉じた形)・(iv) 有限の受け手(球の表面 400 点・R/r 1e-2・1e-3・1e-4・W₀ の割合 0 と ½・
//     受け手の並進 0 と公転の向き n/s 0.3)。物差し: 向き(源の自転軸からの角 —— 種類は逆の側/90° 傾き/順の側)× 強さ・軸の方向で強さ 0 になる列の一覧・45° の向き・q 1 との向きの角の差と強さの比・
//     列 (iv) が R/r → 0 で列 (iii) に寄るか(相対の差)・天体が 1 つ(受け手と背景の重み 0 —— f ≡ 1)でどの量が 0 になるか。
//   T2: 順の分 f s・逆の分 2 つ(列 B′ α f(1 − f) s・列 (iii) (α/2) f(1 − f) s)・和と符号・f ½ の距離。比べる列: 今の並進の式の形の公転の分 f[(1 − α) s + α n] の符号。潮汐ロックの衛星は根拠にしない。
//   T3: 比 1・0.5・0.1 と実際の 2 つの項の比 × 配置 120°・180°・実際の角(太陽の自転軸と L̂)。物差し: 主の列(普通のベクトル和)と今の規則(120° 以下なら大きい側を下回らない)の差 = 持ち上げの分。
//   T4: q 0・q 1 × 列 A・B・B′・(iii) × 0 < f < 1 の根。物差し: 金星の自転の軸に平行な分(大きさを変える)と垂直な分(向きを変える)・垂直な分を軸を回す率と読んだ歳差の周期 ÷ 文献の値(桁)・
//     和 = a ŝ☉ + b L̂ の 3 成分の最小(0 なら定常の組がある)と、背景の軸の向きを ŝ☉ の線に重ねるのに要る角。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as K from './lib-w340b-axialsplit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w340b-axialsplit-2';
export const AMEND = Object.freeze(['版 2(第340便b 追加の依頼 1 —— 統括の検証項目 R357): T5 を足した(和〔見え方〕= 座標の回転 f s + 部位差分 —— 置き方 (a) 半分の渦度・(b) 角速度の勾配 × 仰角 7 × f 6・f → 0 の極限と第338便b の q 0 の差・α 1・2・3 の 45°・有限の受け手のずれの率)。T1〜T4 の式・格子・値は不変']);
export const OUT_MAIN = 'tests/out/axialsplit-340b.json';
export const TARGET = 'tests/lib-w340b-axialsplit.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['どの列(q 0・q 1・場の勾配の第 2 項・有限の受け手)を採るかを決めない(候補の表 —— q 1 は主の列・q 0 は比べる列の読みで並べる)',
  '軸方向で 0 になる列は q 1 だけではない(q > 0・p > 0・場の勾配の第 2 項・有限の受け手も 0 へ寄る)', '和と差分だけのどちらを受け手の自転の式に入れるかを決めない',
  '合成の規則のどれを採るかを決めない(原仮定者の規則は書き換えない —— 主の列は普通のベクトル和の読み)', '金星の根は黄道の北の 1 成分の式(3 成分の定常ではない)・歳差の読みは桁の比べ',
  '光速を超えるかどうかを判定に使わない', '文献の値は未照合']);
export const PLAN = Object.freeze({ parts: Object.freeze(['t1', 't2', 't3', 't4', 't5']), floor: K.FLOOR,
  floorNote: '解析的に 0 になる量は、同じ単位の尺度 × 1e-12 より小さければ 0 と書く(列 (iii) の数値は s/h × 1e-2・列 (iv) は (s r + |v|)/R × 1e-1 の尺度 —— 差分の刻みと受け手の半径で割る増幅)。正本へ書くときに第338便c の settleRun で丸めの残りを 0 に' });

export function partT1() { const rows = K.t1Rows(); return { rows, axisZero: K.t1AxisZero(rows), converge: K.t1Converge(), null: K.t1Null() }; }
export function partT2() { return { scan: K.t2Scan(), bodies: K.t2Bodies() }; }
export function partT3() { return K.t3Rule(); }
export function partT4() { return { venus: K.t4Venus(), steady: K.t4Steady() }; }
/** T5(追加の依頼 1): 和(見え方)= 座標の回転 f s + 部位差分(置き方 (a) 半分の渦度・(b) 角速度の勾配)の仰角 × f の表・f → 0 の極限と第338便b の q 0 の差・α 1・2・3 の 45°・有限の受け手のずれの率 */
export function partT5() { return { rows: K.t5Rows(), limit: K.t5Limit(), shear: K.t5Shear() }; }

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, r = (el) => t1.rows.find((x) => x.elDeg === el), az = (c) => t1.axisZero.find((x) => x.col === c), kmin = K.DECL.rOverR[K.DECL.rOverR.length - 1];
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    // T1: q 0 は軸の方向で強さ 1(順の側)・q 1 は 0・列 (iii) は軸で 0・赤道で 180°・45° で 135°(90° 傾きを保たない)・数値と閉じた形が同じ・列 (iv) は軸で 1e-6 より小さい
    t1Table: t1.rows.length === K.DECL.elevDeg.length && Math.abs(r(90).q[0].mag - 1) <= 1e-12 && r(90).q[1].mag === 0 && r(90).c3.mag === 0 && Math.abs(r(0).c3.ang - 180) <= 1e-9 && Math.abs(r(45).c3.ang - 135) <= 1e-9
      && t1.rows.every((x) => x.c3.dNumClosed <= 1e-6) && r(90).c4.mag <= 1e-6 && Math.abs(r(45).q[1].ang - 90) <= 1e-9,
    // 軸の方向で強さ 0 になる列は q 1 のほかにもある(q > 0・p > 0・列 (iii))
    t1AxisZero: az('q0').axisZero === false && ['q0.25', 'q0.5', 'q0.75', 'q1', 'p1', 'p2', 'c3'].every((c) => az(c).axisZero) && az('c3').mid90 === false && az('q1').mid90 === true,
    // 列 (iv) が R/r → 0 で列 (iii) に寄る(R/r 1/10 で誤差がおよそ 1/100)・W₀ の割合は受け手が静止なら効かず、動くなら効く
    t1Converge: t1.converge.every((c) => c.err[kmin] <= 1e-6 && (c.elDeg === 90 || c.err[1e-3] < c.err[1e-2] / 30))
      && t1.converge.filter((c) => !c.moving).every((c) => { const o = t1.converge.find((x) => x.f === c.f && x.elDeg === c.elDeg && x.moving === false && x.phi !== c.phi); return Math.abs(o.mag - c.mag) <= 1e-9 * c.mag; })
      && t1.converge.filter((c) => c.moving && c.phi === 0).every((c) => { const o = t1.converge.find((x) => x.f === c.f && x.elDeg === c.elDeg && x.moving && x.phi !== 0); return Math.abs(o.mag - c.mag) > 1e-3 * c.mag; }),
    // 天体が 1 つ: 列 (iii)(iv) の部位差分は全部の仰角で 0・座標の回転は 1・強さの係数 f(1 − f)・列 B′・列 (iii) は 0・列 A は −1(座標の回転を含む)・列 B は 1
    t1Null: t1.null.rows.every((x) => x.c3 === 0 && x.c3strain === 0 && x.c4 === 0 && x.c4small === 0 && x.coordRot === 1) && t1.null.coef.ff === 0 && t1.null.coef.Bp === 0 && t1.null.coef.Bh === 0 && t1.null.coef.A === -1 && t1.null.coef.B === 1,
    // T2: 和(B′)の符号は f ½ を境に逆 → 順・和(iii)は全域で順・逆の分は全域で逆の側・天体の表がそろう
    t2View: t2.scan.every((x) => x.retroBp > 0 && x.retroH > 0 && x.signH === 1 && (x.f > 0.5 + 1e-12 ? x.signBp === 1 : x.f < 0.5 - 1e-12 ? x.signBp === -1 : x.signBp === 0))
      && t2.bodies.planets.length === 8 && t2.bodies.moons.length === 7 && [...t2.bodies.planets, ...t2.bodies.moons].every((b) => b.signBp === (b.f > 0.5 ? 1 : -1) && b.signH === 1 && b.retroBp > 0),
    // T3: 比 1 の 120° は両方 1・比 0.5 の 120° で持ち上げ 0.134・180° は持ち上げ 0・天体 8
    t3Rule: Math.abs(t3.rows.find((x) => x.cfg === '120' && x.ratio === 1).main - 1) <= 1e-12 && Math.abs(t3.rows.find((x) => x.cfg === '120' && x.ratio === 0.5).lift - (1 - Math.sqrt(0.75))) <= 1e-12
      && t3.rows.filter((x) => x.cfg === '180').every((x) => x.lift === 0) && t3.bodies.length === 8,
    // T4: 根は黄道の北の成分 0・自転の軸に垂直な残り > 0.1(列 A・B・B′ の根)・3 成分とも 0 になる組は今のノブには無い(最小 > 0.1)
    t4Venus: t4.venus.rows.length === K.DECL.venusQ.length * K.DECL.venusCols.length && t4.venus.rows.every((v) => v.nRoots >= 1 && v.roots.every((x) => x.north === 0))
      && t4.venus.rows.filter((v) => v.col !== 'Bh').every((v) => v.roots.every((x) => x.perpRel > 0.1)) && t4.steady.possible === false && t4.steady.minRel > 0.1
      && Math.abs(t4.steady.minRel - t4.steady.minClosed) <= 1e-6,
    // T5: 数値と閉じた形が同じ・f 1e-6 の (b) の和が第338便b の q 0 と向き 1e-3° 強さ 1e-5 の内・(a) は 45° で 45° の側・α 2 の (b) だけが 45° で 90°・f ½ の (b) の赤道の和は 0・f 0.7 の (b) は全仰角で順の側・
    //   ずれの率 − 座標の回転 = (b) の大きさ・列 (iv) の回転 = (a) の大きさ(相対 1e-6)
    t5Sum: J.t5.rows.length === K.DECL.elevDeg.length * K.T5.fGrid.length && J.t5.rows.every((r) => r.a.dNum <= 1e-6 && r.b.dNum <= 1e-6)
      && J.t5.limit.vsQ0.every((r) => Math.abs(r.b.dAng) <= 1e-3 && Math.abs(r.b.dMag) <= 1e-5) && J.t5.limit.vsQ0.filter((r) => r.elDeg > 0 && r.elDeg < 90).every((r) => Math.abs(r.a.dAng) > 10)
      && J.t5.limit.alphas.every((o) => (o.alpha === 2) === (Math.abs(o.b.ang45 - 90) <= 1e-9)) && J.t5.rows.find((r) => r.elDeg === 0 && r.f === 0.5).b.magOverF === 0
      && J.t5.rows.filter((r) => r.f === 0.7).every((r) => r.b.kind === '順の側') && J.t5.shear.every((x) => x.relB <= 1e-6 && x.relA <= 1e-6),
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
/** 第338便c の型: 正本へ書く形 —— 生の runAll を元のまま 1 回と、Math の関数を ±1〜2 ulp ずらして 2 回走らせ、葉ごとの尺度 σ の 4 倍の内の葉を 0 と書く(壁時計は元のままの走行の値) */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w340b-axialsplit.mjs', 'tests/lib-w340b-axialsplit.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W340B_OUT ? (path.isAbsolute(process.env.W340B_OUT) ? process.env.W340B_OUT : path.join(ROOT, process.env.W340B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第340便b axialsplit(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: K.LIB_VERSION, t5Decl: K.T5, lib338bVersion: K.K338_VERSION, lib337Version: K.L337_VERSION, generator: 'tests/exp-w340b-axialsplit.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-17 —— 第140報)「回転成分は並進引きずりに含まれるので、二重計上を避けると、軸方向では軸引きずりがゼロになる」「赤道面での引きずりは、並進引きずりは順回転だが、軸引きずりでは逆回転となる」・原仮定者の指示(2026-10-18 —— 第101報・第103報)・原仮定者の指示(2026-10-30 —— 第121報)・統括の検証項目 R357',
    decl: K.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第340便b', target: TARGET, code: CODE_ALL, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axialsplit', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない)', notClaim: NOT_CLAIM, floor: K.FLOOR, floorNote: PLAN.floorNote, recheck });
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

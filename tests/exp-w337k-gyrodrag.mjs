// 第337便k(原仮定者の回答(2026-11-15 —— 第138報の回答 2)AN729・AN732・原仮定者の指示(2026-11-08 —— 第132報)「ジャイロ効果」の節・統括の検証項目 R347):
//   **T1 回転引きずり(剛体の場に対する相対の速度の型)の強さとノブを観測の公転の変化のある 4 天体(フォボス・月・タイタン・トリトン)だけで決める・T2 その組のまま土星の環へ持ち出し、
//   環の側を直す補正のノブを解く・T3 ジャイロの直交 —— 方位の作用の交点の率を直交に回して傾きの率に読む(読み替えの列と足す列・符号の読み 2)・T4 鉛直の作用の強さを源の扁平率のべきで読む**
//   (段 gyrodrag-337k —— 正本 tests/out/gyrodrag-337k.json・lib tests/lib-w337k-gyrodrag.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第337便j までの lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337k-gyrodrag.mjs —— 領域の宣言なし)・入力のファイルは無い(第337便i の正本の値 2 つは lib の宣言に写した —— 出典を書いた)。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: χ ½・1 × 速さ s・s_d × 落ち方の基準の半径 R_eq(主)・R_obs × 受け手の大きさの読み 半径・質量 —— 各組で q・p を 4 天体の対数の最小二乗で(連続)と格子 q 7 × p 10 で。
//     物差し: 観測 ÷ 計算(第338便c の訂正 —— lib の式 ln(観測/計算))の最大 ÷ 最小 S(1 桁の内 = S ≤ 100・2 倍の内 = S ≤ 4)。4 つ目のノブ(源の質量のべき)で 4 式 4 未知(自由度 0 —— 比べる列)。潮汐は積まない。
//   T2: T1 の主の組(R_eq・半径の読み・速さ s・χ ½ と 1 —— 連続の解)と p ≥ 0 の格子の最良を、土星の D・C・B・A・F 環の粒子(半径 1 m・高さの振れ 10 m)へ。物差し: 1e7 年の |Δ ln a| ÷ 1e-5。
//     補正のノブ: (a) 粒子の半径 (b) 集まりの係数 ε と光学的厚さ τ・半径のべき (c) 半長軸の率を粒子どうしで打ち消す読みで残る定常のずれ (d) 帯の外の落ち方(lor4)の環と 4 天体の因子。
//   T3: 方位の作用の型 5(第337便i の座標を運ぶ方位の場 slice・lor4・ball〔R_eq・s・λ 6.56e-7〕・対照の剛体の場〔λ 同じ〕・T1 の組)× 受け手 9 × 直交の読み(c 1・符号 plus・minus・列 replace・add)。
//     物差し: 環の傾きが 1e7 年で e 分の 1(いちばん遅い環)—— 要る c。順行と逆行で赤道面へ寄る/離れる。受け手の自転の軸にも同じ直交の 1 行。
//   T4: 源 7 × 扁平率のべき k 0・1・2 —— 高さ則 T1 の鉛直の率と直交の読みの傾きの率(土星で 1e7 年になる強さ)。物差し: 環や赤道面の衛星を持つ源(有)の時間の最大 < 持たない源(無)の最小。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w337k-gyrodrag.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337k-gyrodrag-3';
export const AMEND = Object.freeze([
  '第338便c(統括の検証項目 R351 —— 原仮定者の指示(2026-11-15 —— 第139報)): 正本へ書く出力を量ごとの数値の尺度で整える(tests/lib-w338c-recheck.mjs の settleRun —— Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉〔丸めの残り —— 有効数字が 1 桁に満たない〕を 0 と書く・meta.recheck に係数と 0 と書いた葉の数)。式・格子・判定は不変',
  '第338便c(統括の指摘): T1 の比 ratios は 観測 ÷ 計算(lib の式 ln(観測/計算))—— lib と器の注釈・文書の lib の列名の「計算 ÷ 観測」を直した(値は不変 —— S と範囲は逆数で対称)',
  '第340便h(統括の検証項目 R363 —— 原仮定者の指示(2026-11-17 —— 第140報)): T3 の行の傾き i と赤道面からの角 δ を桁を失わない形で(tests/lib-w337k-gyrodrag.mjs の orthRow —— sin i = |Ŵ × k̂|・i = atan2(sin i, cos i)・δ = atan2(sin i, |cos i|)・lib-2。旧 acos と min(i, π − i) の差は土星の環〔z/r ≈ 1e-7〕で δ の相対の誤差 1e-4〜2.5e-3 —— δ は傾きの率の分母)・傾きの式(第333便c の anglesOn・lib-2)。式・格子・判定は不変',
]);
export const OUT_MAIN = 'tests/out/gyrodrag-337k.json';
export const TARGET = 'tests/lib-w337k-gyrodrag.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
export const NOT_CLAIM = Object.freeze(['回転引きずりの強さを決めたとは書かない(このノブの組で 4 天体が何倍の内かまで)', 'フォボスの軌道の縮みが回転引きずりで出るとは書かない(潮汐は積まない —— 照らすだけ)',
  '環の傾きがジャイロの直交で出るとは書かない(直交の係数 1 での桁と要る係数まで)', '扁平率のべきは候補(観測の配置と並べる表まで)', '文献の値は未照合(出典と確かさを書く)',
  '環の補正のノブは近似の側(環)を直すノブ —— 4 天体の側の強さは動かさない']);
/** 器の宣言 */
export const PLAN = Object.freeze({
  t2Sets: Object.freeze([Object.freeze({ key: 'mainHalf', chi: 0.5, from: 'fitQP' }), Object.freeze({ key: 'mainOne', chi: 1, from: 'fitQP' }), Object.freeze({ key: 'posHalf', chi: 0.5, from: 'gridPos' })]),
  t3SpinRecv: Object.freeze(['ringD', 'phobos', 'moon', 'titan', 'triton']),
});

/* ───────── T1 ───────── */
export function partT1() {
  const sets = [];
  for (const chi of L.DECL.t1.chi) for (const speed of L.DECL.t1.speeds) for (const base of L.DECL.t1.bases) for (const size of L.DECL.t1.sizes) {
    const t = L.t1Set({ chi, speed, base, size }); t.key = `chi${chi}|${speed}|${base}|${size}`; sets.push(t); }
  const okSets = sets.filter((s) => s.ok), o1 = L.DECL.t1.order1, o2 = L.DECL.t1.order2;
  const summary = { nSets: sets.length, nSign4: okSets.length, bestFit: okSets.reduce((a, b) => (b.fitQP.S < a.fitQP.S ? b : a)).key, bestFitS: Math.min(...okSets.map((s) => s.fitQP.S)),
    order1Fit: okSets.filter((s) => s.fitQP.S <= o1).length, order2Fit: okSets.filter((s) => s.fitQP.S <= o2).length,
    order1Pos: okSets.filter((s) => s.gridPos.S <= o1).length, order2Pos: okSets.filter((s) => s.gridPos.S <= o2).length, bestPosS: Math.min(...okSets.map((s) => s.gridPos.S)),
    pNegFit: okSets.filter((s) => s.fitQP.p < 0).length };
  return { sets, summary };
}

/* ───────── T2 ───────── */
export function partT2(T1) {
  const M = L.DECL.t1.main, T = L.DECL.t2.tYr * L.YR;
  const out = PLAN.t2Sets.map((ps) => {
    const s = T1.sets.find((x) => x.key === `chi${ps.chi}|${M.speed}|${M.base}|${M.size}`);
    const pick = ps.from === 'fitQP' ? { q: s.fitQP.q, p: s.fitQP.p, lambda: s.fitQP.lambda, S: s.fitQP.S, ratios: s.fitQP.ratios } : { q: s.gridPos.q, p: s.gridPos.p, lambda: s.gridPos.lambda, S: s.gridPos.S, ratios: s.gridPos.ratios };
    const spec = { chi: ps.chi, speed: M.speed, base: M.base, size: M.size };
    const rows = L.ringRows({ ...spec, q: pick.q, p: pick.p, lambda: pick.lambda });
    const corr = L.corrections(rows, { p: pick.p, size: M.size }, spec);
    // 補正のノブ (b) を 1 つの値 ε で全部に掛けたときの傾きの e 分の 1 の時間(傾きの率にも同じ ε が掛かる —— (c) の読みでは傾きの率は残る)
    const tiltAfterColl = rows.map((r) => (r.tiltEfoldYr === null ? null : r.tiltEfoldYr / corr.collOne));
    const ratioPow = (() => { const xs = rows.map((r) => Math.log(r.a)), ys = rows.map((r) => Math.log(r.ratio)), mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
      return xs.reduce((q, x, i) => q + (x - mx) * (ys[i] - my), 0) / xs.reduce((q, x) => q + (x - mx) ** 2, 0); })();
    return { key: ps.key, from: ps.from, spec, pick, rows, corr, tiltAfterColl, maxRatio: Math.max(...rows.map((r) => r.ratio)), minRatio: Math.min(...rows.map((r) => r.ratio)), ratioPow,
      thinAll: rows.every((r) => r.tiltEfoldYr !== null && r.tiltEfoldYr <= L.DECL.t2.tYr), signs: rows.map((r) => r.sign) };
  });
  // 対照: 補正のノブ 1(ε = 1)・q = 0・p = 0・λ = 1・基準 R_obs の単位の率(第337便j の正本の dampRig|ball|chi½・chi1|q0 の環と 4 天体の行と同じ数 —— QA が照らす)と λ = 0
  const control = L.DECL.t1.chi.map((chi) => ({ chi, rows: L.RINGS.concat(L.SAT4).map((k) => ({ key: k, dlnA: L.unitRate(k, { chi, speed: 'obs', base: 'Robs', qFall: 0 }).dlnA })),
    zero: L.ringRows({ chi, speed: 'obs', base: 'Robs', size: 'R', q: 0, p: 0, lambda: 0 }).every((r) => r.dlnA === 0 && r.ratio === 0) }));
  return { sets: out, control, tol: { tYr: L.DECL.t2.tYr, drift: L.DECL.t2.drift, T } };
}

/* ───────── T3 ───────── */
export function partT3(T1, T2) {
  const M = L.DECL.t1.main, main = T2.sets.find((s) => s.key === 'mainHalf'), t1 = { chi: main.spec.chi, speed: M.speed, base: M.base, q: main.pick.q };
  const k = [0, 0, 1], T = L.DECL.t3.tThinYr * L.YR, lam0 = L.DECL.t3.lambdaMain337i;
  const types = L.DECL.t3.azTypes.map((type) => {
    const rows = L.DECL.t3.recv.map((key) => { const R = L.recvSysOf(key), lam = type === 'dampRigT1' ? main.pick.lambda * L.sizeFactor(key, M.size, main.pick.p) : lam0;
      const eff = L.azEffect(R.src, type, { lambda: lam, t1 }), H0 = (type === 'vel|slice' || type === 'vel|lor4') ? L.rdOf(R.src, 'Req') : null, row = L.orthRow(R.sys, eff, L.pointsOf(R.sys, H0), k);
      const kep = eff.kind === 'vel' ? Math.abs(L.ringRow(R.sys, eff, L.pointsOf(R.sys, H0)).dOmOverOm) : 0;
      return { key, iDeg: row.iDeg, pro: row.iDeg < 90, dnode: row.dnode, dlnIown: row.dlnIown, dlnA: row.dlnA, kepler: kep,
        per: Object.fromEntries(Object.entries(row.per).map(([kk, v]) => [kk, { dlnIorth: v.dlnIorth, dnode: v.dnode, toPlane: v.toPlane }])) }; });
    const rings = rows.filter((r) => L.RINGS.includes(r.key)), orth = rings.map((r) => r.per['plus|replace'].dlnIorth);
    const sameSign = orth.every((x) => x < 0) || orth.every((x) => x > 0), slow = Math.min(...orth.map(Math.abs));
    const cNeed = sameSign && slow > 0 ? (1 / T) / slow : null, efoldC1 = slow > 0 ? 1 / (slow * L.YR) : null;
    const pw = (() => { const xs = rings.map((r) => Math.log(L.recvOf(r.key).a)), ys = rings.map((r) => Math.log(Math.abs(r.per['plus|replace'].dlnIorth))), mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
      return xs.reduce((q, x, i) => q + (x - mx) * (ys[i] - my), 0) / xs.reduce((q, x) => q + (x - mx) ** 2, 0); })();
    const toward = orth.every((x) => x < 0);
    return { type, lambda: type === 'dampRigT1' ? main.pick.lambda : lam0, rows, ringOrthSlow: slow, efoldYrC1: efoldC1, cNeed, ringToward: toward, ringPow: pw,
      keplerMax: Math.max(...rings.map((r) => r.kepler)), passC1: toward && efoldC1 !== null && efoldC1 <= L.DECL.t3.tThinYr && Math.max(...rings.map((r) => r.kepler)) <= L.DECL.t2.kepler };
  });
  // (iv) 受け手の自転の軸: 方位の場 ball(λ 6.56e-7)の受け手の位置の場の角速度 Ω_f = U/ρ が自転の軸を源の軸のまわりに回す率 → 直交の読みで軸を源の軸へ寄せる率 c Ω_f sin θ(e 分の 1 の時間 1/Ω_f)
  const spin = PLAN.t3SpinRecv.map((key) => { const R = L.recvSysOf(key), Rd = L.rdOf(R.src, 'Req'), Om = lam0 * 2 * R.src.s * Rd * Rd / (5 * R.r.a * R.r.a);
    return { key, OmegaF: Om, efoldYr: 1 / (Om * L.YR) }; });
  // EQ-23 との並べ(L̂̇_az = Ω k̂ × L̂ のとき EQ-23 の歳差の軸 = 直交の読みの L̂̇)
  const eq = L.eq23Compare([0.1, -0.2, 1], k, 1);
  return { t1, types, spin, eq23: { rel: eq.rel, dLsame: eq.dLsame } };
}

/* ───────── T4 ───────── */
export function partT4() {
  const rows = L.DECL.t4.sources.map((k) => L.flatRow(k));
  const splits = [];
  for (const col of ['hlDlnI', 'orthDlnI']) for (const kk of L.DECL.t4.kPow) splits.push(L.flatSplit(rows, col, kk));
  // 水星(太陽 —— 扁平率 9e-6)の近点への効き: 第337便i の 3 組の 1PN 比 × (f_太陽/f_土星)^k
  const sun = rows.find((r) => r.key === 'sun'), sat = rows.find((r) => r.key === 'saturn');
  const merc = L.DECL.t4.kPow.map((kk) => ({ k: kk, factor: Math.pow(sun.fFlat / sat.fFlat, kk), ratios: L.LIT.merc337i.map((x) => x * Math.pow(sun.fFlat / sat.fFlat, kk)) }));
  return { rows, splits, merc };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t1Complete: t1.sets.length === 16 && t1.sets.every((s) => s.nMatch >= 0 && (!s.ok || (fin(s.fitQP.S) && fin(s.grid.S) && fin(s.gridPos.S)))),
    t1Signs: t1.sets.filter((s) => s.spec.speed === 'obs').every((s) => s.nMatch === 4) && t1.sets.filter((s) => s.spec.speed === 'sd').every((s) => s.nMatch < 4),
    t1Approx: t1.sets.filter((s) => s.ok).every((s) => s.fitQP.approxGap <= 0.1),
    t2Complete: t2.sets.length === PLAN.t2Sets.length && t2.sets.every((s) => s.rows.length === L.RINGS.length && s.rows.every((r) => fin(r.ratio))),
    t3Complete: t3.types.length === L.DECL.t3.azTypes.length && t3.types.every((t) => t.rows.length === L.DECL.t3.recv.length),
    t3Signs: t3.types.filter((t) => t.type.startsWith('vel|') || t.type === 'rigid').every((t) => t.rows.every((r) => r.per['plus|replace'].toPlane === (r.pro ? 1 : -1) && r.per['minus|replace'].toPlane === -r.per['plus|replace'].toPlane)),
    t3Eq23: t3.eq23.rel <= 1e-12 && t3.eq23.dLsame === 0,
    t4Complete: t4.rows.length === L.DECL.t4.sources.length && t4.rows.every((r) => fin(r.hlDlnI) && fin(r.orthDlnI)) && t4.splits.length === 2 * L.DECL.t4.kPow.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(); mark('t1');
  const t2 = partT2(t1); mark('t2');
  const t3 = partT3(t1, t2); mark('t3');
  const t4 = partT4(); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** 第338便c: 正本へ書く形 —— 生の runAll を元のまま 1 回と、Math の関数を ±1〜2 ulp ずらして 2 回走らせ、葉ごとの尺度 σ の 4 倍の内の葉(丸めの残り —— 有効数字が 1 桁に満たない)を 0 と書く(壁時計は元のままの走行の値)。戻り値 { J, recheck } */
export function runSettled() {
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w337k-gyrodrag.mjs', 'tests/lib-w337k-gyrodrag.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w337i-rotring.mjs', 'tests/lib-w337a-supply.mjs', 'tests/lib-w337b-mercuryband.mjs',
  'tests/lib-w335c-mercurycombo.mjs', 'tests/lib-w334c-mercurynode.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332b-transgeo2.mjs',
  'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w312a-decay.mjs',
  'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337K_OUT ? (path.isAbsolute(process.env.W337K_OUT) ? process.env.W337K_OUT : path.join(ROOT, process.env.W337K_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便k gyrodrag(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337k-gyrodrag.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-15 —— 第138報の回答 2)AN729「鉛直の型は有力。方位の型が同時に効いても良い」・AN732「回転引きずりは、４天体で合う結果を重視。環の方が近似なので、環をノブで補正する」・原仮定者の指示(2026-11-08 —— 第132報)「この直行を、物理現象と仮定する」・統括の検証項目 R347',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便k', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'gyrodrag', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積と RK4)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第353便zh(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R497):
//   **向きの一致が時間の間保たれる条件の器 —— 表 1 公転面の応える比 c_輪 ÷ c × 8 惑星の相対の 1 周と金星の φ がいまの 2 倍以下で在る年数(閉じた形と数えた出口)・位相の割合・年齢の間に要る 1 からのずれ/
//   表 2 換算の係数を置いた組(第353便za の組 9)× 金星・地球・水星の公転面: 太陽の自転軸との相対の率と窓の年数/表 3 破れる条件 (i) 1 からのずれ (ii) 重力の側の交点の回り(ノブ)(iii) 太陽の寄る割合 f と順/
//   表 4 水星の 2 つの軸(組 9 × 窓 4)・月とイオの道の面の歳差の周期(ノブ)と一周の揺れが 0.1° の内の上限・零試験 9**
//   (段 comove-353zh —— 正本 tests/out/comove-353zh.json・lib tests/lib-w353zh-comove.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zh-comove.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。**第353便zc・x・b・n・za の lib を通して仮の値の lib(第352便b)に届く —— 正本の最上位に provisional: true と使った鍵の一覧**(本器の数には使わない)。
//
// ■ 言わないこと: 配置が保たれる条件・金星の自転の状態を言い当てる表とは書かない(比の走査の表)。重力の側の交点の回り・月とイオの道の面の歳差の周期はノブ(値は未照合)の格子で、DFM の式ではない比べる列。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353zh-comove.mjs';
import * as ZA from './lib-w353za-ktilt.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zh-comove-1';
export const OUT_MAIN = 'tests/out/comove-353zh.json';
export const TARGET = 'tests/lib-w353zh-comove.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '比の走査の表 —— 配置が保たれる条件・金星の自転の状態を言い当てる表ではない',
  '公転面の応える比 c_輪 ÷ c は決めない(主の列で 1 に置く列を持つかは決断事項の候補)',
  '重力の側の交点の回り・月とイオの道の面の歳差の周期は、リポジトリに数が無い —— ノブ(値は未照合)の格子で、DFM の式ではない比べる列',
  '水星の 2 つの軸の重力の側は第353便x の重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)',
  '組の列の相対の率は t = 0 の方位の率(合成の軸が基準軸から離れる受け手では一様でない —— 窓の年数は φ(t) を数えて出す)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 9(比 0 で第353便zc の周期・窓・出口/位相の割合 7.1%・17.7%/比 1 で相対の率 0/閉じた形 (1 − 比) u ω_G/φ(t) = 相対の位相/回転の口 = 第352便l・第353便x・第353便n/組の状態/月の単調/変異と拒否)',
  t1: '表 1 比 8 × 8 惑星の相対の 1 周・金星の窓の年数(閉じた形と数えた出口)・8 惑星の比 0 の窓・位相の割合(比 0・0.5・2)・年齢の間に要る 1 からのずれ',
  t2: '表 2 組 9 × 受け手 3(金星・地球・水星)の相対の率と窓の年数(比 1)',
  t3: '表 3 破れる条件: 1 からのずれ 5・重力の側の交点の回り 4 × 向き 2(ノブ)・太陽の寄る割合 f 6 と順',
  t4: '表 4 水星の 2 つの軸(組 9 × 窓 4 + 軸引きずりだけの 100 万年)・月とイオ(組 9 × 向き 2)の一周の揺れが 0.1° の内の周期の上限と周期の格子 7',
});

export function gatesOf(J) {
  const D = Z.DECL, ok = (x) => typeof x === 'number' && Number.isFinite(x);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    t1: J.t1.rows.length === D.ratios.length && J.t1.rows.every((r) => Object.keys(r.relPeriods).length === 8 && (r.ratio === 1 ? r.venus.fwdYr === null && r.venus.bwdYr === null : ok(r.venus.fwdYr) && ok(r.venus.closed.winYr)))
      && J.t1.hold0.length === 8 && J.t1.phase.length === 3 && J.t1.phase.every((p) => p.pct === J.t1.phase[0].pct && p.first === J.t1.phase[0].first) && ok(J.t1.bound.win),
    t2: J.t2.length === D.comboIds.length * D.t2Recvs.length && J.t2.every((r) => ok(r.relPeriodYr) || r.combo === 'k1'),
    t3: J.t3.devs.length === D.devs.length && J.t3.grav.length === D.gravPeriodsYr.length * D.gravSenses.length && J.t3.f.length === D.fGrid.length && J.t3.order.length >= 3,
    t4: J.t4.mercury.length === D.comboIds.length && J.t4.mercury.every((r) => r.wins.length === D.windowsYr.length && r.wins.every((w) => ok(w.winDeg)))
      && J.t4.moons.length === D.moonKeys.length * D.comboIds.length * D.moonSenses.length && J.t4.moons.every((r) => ok(r.periodMaxYr) && r.swings.length === D.moonPeriodsYr.length),
  };
}
const pick = (h) => ({ phi0: h.phi0, lim: h.lim, relRate: h.relRate, relPeriodYr: h.relPeriodYr, fwdYr: h.fwdYr, bwdYr: h.bwdYr, winYr: h.winYr, closed: h.closed });
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}, C = { T1, GEO, cache }, D = Z.DECL; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  // 表 1
  const rows = D.ratios.map((q) => ({ ratio: q, relPeriods: Object.fromEntries(D.planets.map((id) => [id, Z.relPhaseRate(id, { ratioRing: q, ...C }).relPeriodYr])), venus: pick(Z.holdYears('Venus', { ratioRing: q, ...C })) }));
  const hold0 = D.planets.map((id) => { const h = Z.holdYears(id, { ratioRing: 0, ...C }); return { id, phi0: h.phi0, relPeriodYr: h.relPeriodYr, winYr: h.closed.winYr, fwdYr: h.closed.fwdYr, bwdYr: h.closed.bwdYr, winDeg: h.closed.winDeg }; });
  const phase = [0, 0.5, 2].map((q) => Z.phaseStats({ ratioRing: q, ...C }));
  const v0 = rows[0].venus.closed, age = D.ageYr;
  const bound = { win: v0.winYr / age, fwdBelow: v0.fwdYr / age, bwdBelow: v0.bwdYr / age, fwdAbove: v0.bwdYr / age, bwdAbove: v0.fwdYr / age };
  const t1 = { rows, hold0, phase, bound }; mark('t1');
  // 表 2
  const t2 = [];
  for (const c of D.comboIds) for (const k of D.t2Recvs) {
    const r = Z.relPhaseRate(k, { ratioRing: 1, combo: c, ...C }), h = Z.holdYears(k, { ratioRing: 1, combo: c, ...C });
    t2.push({ combo: c, key: k, k: r.k, ringOverSun: r.ringOverSun, ringOmToBDeg: r.ringOmToBDeg, sunOmToBDeg: r.sunOmToBDeg, sunAz: r.sunAz, ringAz: r.ringAz, relRate: r.relRate, relPeriodYr: r.relPeriodYr, phi0: h.phi0, fwdYr: h.fwdYr, bwdYr: h.bwdYr, winYr: h.winYr });
  }
  mark('t2');
  // 表 3
  const devs = D.devs.map((d) => { const lo = Z.holdYears('Venus', { ratioRing: 1 - d, ...C }).closed, hi = Z.holdYears('Venus', { ratioRing: 1 + d, ...C }).closed; return { dev: d, winYr: lo.winYr, fwdBelow: lo.fwdYr, bwdBelow: lo.bwdYr, fwdAbove: hi.fwdYr, bwdAbove: hi.bwdYr }; });
  const grav = [];
  for (const P of D.gravPeriodsYr) for (const sg of D.gravSenses) { const h = Z.holdYears('Venus', { ratioRing: 1, gravRing: { periodYr: P, sense: sg }, ...C }); grav.push({ periodYr: P, sense: sg, relPeriodYr: h.relPeriodYr, winYr: h.closed.winYr, fwdYr: h.fwdYr, bwdYr: h.bwdYr }); }
  const f = D.fGrid.map((fv) => { const h = Z.holdYears('Venus', { ratioRing: 1, f: fv, ...C }), tr = Z.phiTrack('Venus', { years: [1e9, D.ageYr], ratioRing: 1, f: fv, ...C });
    return { f: fv, fwdYr: h.fwdYr, phi1e9: tr[0].phiDeg, phiAge: tr[1].phiDeg, coneAge: tr[1].sunToBDeg }; });
  const g7 = grav.filter((r) => r.periodYr === 1e7).map((r) => r.fwdYr), dv = devs.find((r) => r.dev === 1e-2), fv = f.filter((r) => r.fwdYr !== null);
  const order = [
    { cond: 'grav', knob: 1e7, yr: Math.min(...g7) },
    { cond: 'dev', knob: 1e-2, yr: Math.min(dv.fwdBelow, dv.fwdAbove) },
    { cond: 'f', knob: fv.length ? Math.min(...fv.map((r) => r.f)) : null, yr: fv.length ? fv.find((r) => r.f === Math.min(...fv.map((q) => q.f))).fwdYr : null },
  ].sort((a, b) => (a.yr === null ? 1 : b.yr === null ? -1 : a.yr - b.yr));
  const t3 = { devs, grav, f, order }; mark('t3');
  // 表 4
  const mercury = D.comboIds.map((c) => { const ws = D.windowsYr.map((y) => ZA.kWatch('Mercury', c, { years: y, mode: 'two', grav: 'tide', ...C })), fx = ZA.kWatch('Mercury', c, { years: 1e6, mode: 'fixed', ...C });
    return { combo: c, k: ws[0].k, gravAsYr: ws[0].grav.asYr, signG: ws[0].grav.signG, periodYr: ws[0].periodYr, swingDeg: ws[0].swingDeg, wins: ws.map((w) => ({ years: w.years, winDeg: w.winDeg, over01: w.over01 })), fixed1e6: fx.winDeg }; });
  const moons = [];
  for (const k of D.moonKeys) for (const c of D.comboIds) for (const sg of D.moonSenses) {
    const nd = Z.moonNeed(k, c, { signG: sg, ...C }), sw = D.moonPeriodsYr.map((P) => Z.moonTwo(k, c, { periodYr: P, signG: sg, ...C }));
    moons.push({ key: k, combo: c, signG: sg, k: sw[0].k, eps0Deg: sw[0].eps0Deg, W: sw[0].W, periodMaxYr: nd.periodMaxYr, rateMinAsYr: nd.rateMinAsYr, swings: sw.map((r) => ({ periodYr: r.periodYr, swingDeg: r.swingDeg, winDeg: r.winDeg })) });
  }
  const t4 = { mercury, moons }; mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zh-comove.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZH_OUT ? (path.isAbsolute(process.env.W353ZH_OUT) ? process.env.W353ZH_OUT : path.join(ROOT, process.env.W353ZH_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zh comove(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: [...Z.DECL.provKeys], provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は値を読まない)',
    version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353zh-comove.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R497', decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zh', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'comove', engine: 'Node(html を読まない —— 純関数の lib・第353便zc・x・b・n・za・第352便w・l ほかの lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

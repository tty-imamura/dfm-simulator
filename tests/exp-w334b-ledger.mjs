// 第334便b(原仮定者の整理(2026-11-11)「並進引きずり = 引きずる側の移動と回転を使った座標変換 —— 自分自身への並進引きずりが慣性」「軸引きずり = 受ける側の部位による差分の回転 ——
//   潮汐力の引きずり版」「回転引きずり = 引きずる側の回転による空間の捩れ —— s_d は J 案が有望」・原仮定者の回答(2026-11-11 —— AN624・AN625・AN626・AN628・AN629・AN630)・
//   統括の検証項目 R323):
//   **仕事とトルクの帳簿の器 —— 回転引きずりの押し(NF)と滑り(NS)の軌道のトルクと仕事・源の自転の反作用・共役の角速度の 2 列(S 観測自転 s/D J 等価の s_d)・軸引きずりの応答
//   (経路ごとの口と相殺の否定対照・今の軸の口と並べる)・2 体 3 体の短い窓(h と h/2)・潮汐力との対応・自分自身への並進引きずりの割合**
//   (段 ledger-334b —— 正本 tests/out/ledger-w334b.json・lib tests/lib-w334b-ledger.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第329〜333便の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w334b-ledger.mjs —— 第333便d の型・領域の宣言なし)。入力は第333便b の正本 tests/out/axialfield-w333b.json
//   (本の時刻の 🗺️ の写しの ω_field の 3 部と今の軸の口の読み口の値 —— 並べるだけ・写しは走らせない)。1 プロセス。
//
// ■ 何をするか(宣言は走行の前 —— PLAN と lib の DECL・DECL_LEDGER)
//   P 純関数の場面(lib)
//   A 押しの帳簿(円軌道の 1 周の平均): 太陽–木星・地球–月・土星–環の粒子(3 半径)・木星–イオ × 傾き(0 と宣言の傾き)× 列 5 × 応答率 2 × 型 2(NF・NS)—— トルク・仕事・源の反作用・
//     共役の 2 列 S/D の熱・比 Q_D/Q_S・観測の熱流との比(源の熱流 —— 文献の値)・補助の帳簿(源を固定する近似の流出)
//   B 軸の応答の帳簿(本の時刻 —— 第333便b の正本の ω_field の 3 部 × 自己の重み 3 × τ の格子 3): 経路ごとの口と相殺の否定対照の熱・恒等式・観測の熱流との比・今の軸の口の値と並べる
//   C 2 体・3 体の窓: 太陽–水星–金星・地球–月・冥王星–カロン・木星–イオ × 自己の重み 3 × τ 3(軸の応答だけ)+ 押しだけ + 両方(自己 none・τ = 10³ 公転)× 刻み h・h/2
//   D 潮汐力との対応: 4 組 × 自己の重み 3(距離 2 倍・源の質量 2 倍・受け手の半径 2 倍の次数)
//   E 自己の割合: 太陽系の天体・冥王星とカロン・連星 3 組・銀河の星(太陽)× 規則(Y_k m・観測半径)と今の K1 の分母の一次
// ■ 言わないこと: 帳簿は宣言した応答則と共役の角速度の恒等式と表の値・s_d は J を表す等価なパラメータ(物質の表面の速度ではない)・ω_field は回転率(トルクでも熱でもない)・
//   新しい軸の差分と今の軸の口は並べる(足さない)・Γ と τ は単位の格子(同定しない)・自己の割合は読みの対応・文献の値は一次資料に当たっていない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w334b-ledger.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';
import * as A333 from './lib-w333a-rotdiff.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w334b-ledger-1';
export const OUT_MAIN = 'tests/out/ledger-w334b.json';
export const AXF_JSON = 'tests/out/axialfield-w333b.json';
export const TARGET = 'tests/lib-w334b-ledger.mjs';   // html を読まない器の来歴の対象(純関数 —— 第333便d の型)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const DAY = 86400, DEG = Math.PI / 180;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限の取り違えを避ける書き方 —— 第333便b の型)
export const NOT_CLAIM = Object.freeze(['帳簿は宣言した応答則と宣言した共役の角速度の恒等式と表の値(押しの加速度の則が同じ式を満たす保証ではない)',
  's_d は J を表す等価なパラメータ(物質の表面の速度・実体の自転ではない —— D の列は共役を s_d に置いた比べる列)', 'ω_field は局所の場の回転率(トルクでも熱でもない —— 応答 Γ を介す)',
  '新しい軸の差分と今の軸の口は並べる(重ねて足した値を合計と呼ばない)', 'Γ と τ は単位の格子(観測に合わせて同定しない)', '熱の比は文献の値との比(機構の同定ではない)',
  '自己の割合の表は読みの対応(慣性の導出ではない)', '窓の軌道は重力だけ(引きずりの力は軌道に戻さない一次の帳簿)・作った円軌道は暦表の時刻ではない']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** A 押しの帳簿の組(源・受け手・軌道の半径・傾き〔0 と宣言の傾き〕・熱流を読む源の鍵) */
  pushPairs: Object.freeze([
    Object.freeze({ key: 'sunJup', src: 'sun', recv: 'jupiter', a: L.LIT.bodies.jupiter.a, iDeg: Object.freeze([0, 6.09]), heat: null }),
    Object.freeze({ key: 'earthMoon', src: 'earth', recv: 'moon', a: L.LIT.bodies.moon.a, iDeg: Object.freeze([0, 23.44]), heat: 'earth' }),
    Object.freeze({ key: 'satRingC', src: SAT, recv: null, a: L.LIT.ring.a[0], iDeg: Object.freeze([0, 'zMax']), heat: SAT }),
    Object.freeze({ key: 'satRingB', src: SAT, recv: null, a: L.LIT.ring.a[1], iDeg: Object.freeze([0, 'zMax']), heat: SAT }),
    Object.freeze({ key: 'satRingA', src: SAT, recv: null, a: L.LIT.ring.a[2], iDeg: Object.freeze([0, 'zMax']), heat: SAT }),
    Object.freeze({ key: 'jupIo', src: 'jupiter', recv: 'io', a: L.LIT.bodies.io.a, iDeg: Object.freeze([0, 0.05]), heat: 'jupiter' }),
  ]),
  /** 環の粒子は単位の質量 1 kg(熱の合計は主な環の質量を同じ半径に置いた宣言の倍率 —— 比べる列) */
  ringParticleKg: 1,
  /** B 軸の応答の帳簿: 受け手(第333便b の docBodies)・自己の重みの列・τ の格子(公転の周期の倍数 —— 公転の周期は第330便a の lib の文献の値) */
  epochBodies: Object.freeze([MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  epochCols: Object.freeze(['2|none', '2|kappaM', '2|robs']), epochPerSource: '2|none', engineVariants: Object.freeze(['k1Rule', 'k2Radius']),
  /** 16 体の本の添字(第333便a の MOI の添字と同じ順) */
  bookKeys: Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', 'europa', 'ganymede', 'callisto', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  /** C 窓: 系・自己の重み・τ の格子(lib の DECL)・押しだけの列・両方の列(自己 none・τ = 10³ 公転) */
  windowSystems: Object.freeze(['smv', 'em', 'pc', 'ji']), bothSelf: 'none', bothTau: 1e3,
  /** 自己の項が受け手自身の運動を運ぶ読み(慣性の比べる列 —— lib の carryAt)の自己の重みの列 */
  carrySelf: Object.freeze(['kappaM', 'robs']),
  /** D 潮汐の組(源 → 受け手 —— 窓の系の円軌道の配置)と太陽–木星 */
  tidePairs: Object.freeze([Object.freeze(['em', 0, 1]), Object.freeze(['ji', 0, 1]), Object.freeze(['sj', 0, 1]), Object.freeze(['pc', 1, 0])]),
  /** E 自己の割合の受け手(太陽系は主星だけを源に —— 2 体の円軌道の配置) */
  selfSolar: Object.freeze([MER, 'venus', 'earth', 'jupiter', SAT]),
});

/* ───────── 入力 ───────── */
export function readAxf(root = ROOT) {
  const J = JSON.parse(fs.readFileSync(path.join(root, AXF_JSON), 'utf8'));
  if (!(J.version === 'w333b-axialfield-1' && J.libVersion === 'w333b-axialfield-lib-1' && J.field && J.field.epoch && J.engine && J.engine.epoch)) throw new RangeError('readAxf: 第333便b の正本の版が違う');
  return J;
}
const orbitDaysOf = (k) => S330.DECL.lit.orbitDays[k];

/* ───────── A 押しの帳簿 ───────── */
export function partPush() {
  const rows = [];
  for (const pr of PLAN.pushPairs) {
    const src = L.bodyOf(pr.src), m = pr.recv ? L.bodyOf(pr.recv).m : PLAN.ringParticleKg, heatObs = pr.heat ? L.LIT.heatFlowW[pr.heat] : null, massScale = pr.recv ? 1 : L.LIT.ring.mass;
    for (const iD of pr.iDeg) {
      const i = iD === 'zMax' ? Math.asin(L.LIT.ring.zMax / pr.a) : iD * DEG;
      for (const col of L.DECL.pushCols) for (const rate of L.DECL.rates) for (const dir of L.DIRS) {
        const r = L.pushLedger({ src, m, a: pr.a, i, col, rate, dir, heatObs, massScale });
        rows.push(Object.assign({ pair: pr.key, src: pr.src, recv: pr.recv, tilted: iD !== 0, heatKey: pr.heat, heatObs, sdOverS: src.sdOverS, sOverN: src.s / r.n }, r));
      }
    }
  }
  return { rows, sources: Object.fromEntries([...new Set(PLAN.pushPairs.map((p) => p.src))].map((k) => { const b = L.bodyOf(k); return [k, { s: b.s, sd: b.sd, sdOverS: b.sdOverS, I: b.I, Id: b.Id, Rd: b.Rd, J: b.I * Math.abs(b.s) }]; })) };
}

/* ───────── B 軸の応答の帳簿(本の時刻)───────── */
export function partEpoch(AX) {
  const F = AX.field.epoch, rows = [];
  const bodyRow = (key) => F.bodies.find((b) => b.key === key);
  for (const key of PLAN.epochBodies) {
    const b = bodyRow(key), idx = PLAN.bookKeys.indexOf(key), f = A333.fObsOf(idx), I = f * b.m * b.Robs * b.Robs, sVec = scl(b.sHat, b.sObs), Pd = orbitDaysOf(key);
    const heatObs = L.LIT.heatFlowW[key] === undefined ? null : L.LIT.heatFlowW[key];
    const eng = Object.fromEntries(PLAN.engineVariants.map((v) => { const q = AX.engine.epoch[v].rows.find((z) => z.key === key); return [v, q ? q.par : null]; }));
    const row = { key, sObs: b.sObs, I, f, fIsLit: A333.fObsIsLit(idx), orbitDays: Pd, heatObs, engine: eng, cols: {} };
    for (const c of PLAN.epochCols) {
      const q = F.cols[c].find((z) => z.key === key), par = q.par, parts = L.PART_KEYS.map((k) => ({ key: 'all|' + k, omega: scl(b.sHat, q.parts[k]) }));
      const perSrc = c === PLAN.epochPerSource ? F.perSource[c][idx].flatMap((z) => L.PART_KEYS.map((k) => ({ key: z.key + '|' + k, omega: scl(b.sHat, z[k]) }))) : null;
      const out = { omegaPar: par, omegaParOverS: par / b.sObs, parts: Object.fromEntries(L.PART_KEYS.map((k) => [k, q.parts[k]])), tau: {} };
      for (const tf of L.DECL.tauOrbits) {
        const tau = tf * Pd * DAY, Gam = I / tau, A = L.axialLedger({ parts, s: sVec, Gamma: Gam }), P = perSrc ? L.axialLedger({ parts: perSrc, s: sVec, Gamma: Gam }) : null;
        out.tau[tf] = { tauSec: tau, Gamma: Gam, torquePar: A.torque.reduce((s, x, k) => s + x * b.sHat[k], 0), heatParts: A.heat, heatMerged: A.merged.heat, excessParts: A.excess, excessFormulaRel: A.excessRel,
          identityRel: A.identityRel, torqueRel: A.torqueMergedRel, supply: A.supply, recvWork: A.recvWork, obsRatio: heatObs ? A.heat / heatObs : null,
          perSource: P ? { heat: P.heat, merged: P.merged.heat, excess: P.excess, identityRel: P.identityRel, torqueRel: P.torqueMergedRel, nPorts: P.nPorts, excessFormulaRel: P.excessRel } : null };
      }
      row.cols[c] = out;
    }
    rows.push(row);
  }
  return { rows };
}

/* ───────── C 窓 ───────── */
const systemOf = (k) => (k === 'sj' ? L.sjSystem() : L.WINDOW_SYSTEMS[k]());
export function partWindows() {
  const W = L.DECL.window, out = {};
  for (const k of PLAN.windowSystems) {
    const sys0 = systemOf(k), P = 2 * Math.PI / sys0.n, T = W.orbits * P, runs = [];
    const job = (label, selfRule, tauF, push, carry = false) => {
      const r = [1, 2].map((m) => L.windowRun(systemOf(k), { selfRule, tauSec: tauF ? tauF * P : null, push, carry, steps: W.stepsPerOrbit * W.orbits * m, T }));
      const [a, b] = r, conv = b.closeE > 0 ? a.closeE / b.closeE : null;
      runs.push({ label, selfRule, tauOrbits: tauF, push, carry, h: a.h, closeE: [a.closeE, b.closeE], closeL: [a.closeL, b.closeL], convRatio: conv,
        closed: b.closeE <= W.closeTol && (b.closeE <= W.floor || (conv !== null && conv >= W.convRatio)) && b.closeL <= W.closeTol,
        ledgerAxialRel: Math.abs(b.ledgerAxial) / Math.max(Math.abs(b.acc.supply), Math.abs(b.acc.recvWork), b.acc.heatPath, 1e-300),
        heatPath: b.acc.heatPath, heatMerged: b.acc.heatMerged, heatExcess: b.heatExcess, supply: b.acc.supply, recvWork: b.acc.recvWork, dE: b.dE, dED: b.dED, dEoverE0: b.dEoverE0,
        pOrb: b.acc.pOrb, srcSupplyS: b.acc.srcSupplyS, srcSupplyD: b.acc.srcSupplyD, QnfS: b.QnfS, QnfD: b.QnfD, QnfDoverS: b.QnfS !== 0 ? b.QnfD / b.QnfS : null, QnfSRel: b.acc.srcSupplyS !== 0 ? b.QnfS / Math.max(Math.abs(b.acc.srcSupplyS), Math.abs(b.acc.pOrb)) : null,
        QnfDRel: b.acc.srcSupplyD !== 0 ? b.QnfD / Math.max(Math.abs(b.acc.srcSupplyD), Math.abs(b.acc.pOrb)) : null, dsRel: b.dsRel,
        hHalfDiff: { heatPath: Math.abs(a.acc.heatPath - b.acc.heatPath) / Math.max(Math.abs(b.acc.heatPath), 1e-300), QnfS: Math.abs(a.QnfS - b.QnfS) / Math.max(Math.abs(b.QnfS), 1e-300) } });
    };
    for (const sr of L.SELF_RULES) for (const tf of L.DECL.tauOrbits) job('axial', sr, tf, false);
    for (const sr of PLAN.carrySelf) for (const tf of L.DECL.tauOrbits) job('carry', sr, tf, false, true);
    job('push', 'none', null, true);
    job('both', PLAN.bothSelf, PLAN.bothTau, true);
    // 時刻 0 の ω_field と自転の差(同期の 0 の読み —— 自己の重み 3 列)
    const sync = L.SELF_RULES.map((sr) => ({ selfRule: sr, rows: sys0.bodies.map((b, i) => { const srcs = sys0.bodies.filter((_, j) => j !== i).map((q) => ({ key: q.key, p: q.p, v: q.v, s: q.s, m: q.m }));
      const fa = L.fieldAt({ at: b.p, sources: srcs, selfRule: sr, m: b.m, R: b.R }), ca = sr === 'none' ? null : L.carryAt({ at: b.p, sources: srcs, selfRule: sr, m: b.m, R: b.R, v: b.v, s: b.s });
      return { key: b.key, omegaMinusSRel: nrm(sub(fa.F.omega, b.s)) / nrm(b.s), omegaOverS: nrm(fa.F.omega) / nrm(b.s), fSelf: fa.F.shares.self, oneMinusF: fa.F.shares.src,
        carryMinusSRel: ca ? nrm(sub(ca.omegaEff, b.s)) / nrm(b.s) : null }; }) }));
    out[k] = { keys: sys0.keys, periodDays: P / DAY, T, runs, sync };
  }
  return out;
}

/* ───────── D 潮汐力との対応 ───────── */
export function partTide() {
  const rows = [];
  for (const [k, iS, iR] of PLAN.tidePairs) {
    const sys = systemOf(k), src = sys.bodies[iS], rc = sys.bodies[iR], n = sys.n;
    for (const sr of L.SELF_RULES) {
      const S0 = { p: src.p, v: src.v, s: src.s, m: src.m }, R0 = { p: rc.p, m: rc.m, R: rc.R }, d = sub(rc.p, src.p);
      const base = L.tideDragRow({ src: S0, recv: R0, selfRule: sr, n });
      const far = L.tideDragRow({ src: S0, recv: Object.assign({}, R0, { p: add(src.p, scl(d, 2)) }), selfRule: sr, n });
      const heavy = L.tideDragRow({ src: Object.assign({}, S0, { m: 2 * src.m }), recv: R0, selfRule: sr, n });
      const big = L.tideDragRow({ src: S0, recv: Object.assign({}, R0, { R: 2 * rc.R, m: rc.m }), selfRule: sr, n });
      const sl = (a, b) => (a > 0 && b > 0 ? Math.log2(b / a) : null);
      rows.push({ pair: k, src: src.key, recv: rc.key, selfRule: sr, n, base, slope: { rT: sl(base.Tnorm, far.Tnorm), rOmega: sl(base.omega, far.omega), rStrain: sl(base.strain, far.strain),
        mT: sl(base.Tnorm, heavy.Tnorm), mOmega: sl(base.omega, heavy.omega), mStrain: sl(base.strain, heavy.strain), ROmega: sl(base.omega, big.omega), RStrain: sl(base.strain, big.strain) } });
    }
  }
  return { rows };
}

/* ───────── E 自己の割合 ───────── */
function starBody(key, m, R, Pdays, p, v) { return { key, m, R, p, v, s: [0, 0, 2 * Math.PI / (Pdays * DAY)] }; }
export function partSelf() {
  const rows = [], twoBodyRows = (sysKey, recvIdx, group) => { const s = systemOf(sysKey), r = s.bodies[recvIdx], srcs = s.bodies.filter((_, j) => j !== recvIdx);
    rows.push(Object.assign({ group, sys: sysKey }, L.selfShareRow({ recv: r, sources: srcs }))); };
  for (const k of PLAN.selfSolar) {   // 太陽と惑星の 2 体(太陽を源)
    const A = L.bodyOf('sun'), B = L.bodyOf(k), a = B.a, M = A.m + B.m, n = Math.sqrt(L.DECL.G * M / a ** 3);
    const sun = { key: 'sun', m: A.m, R: A.R, p: [-a * B.m / M, 0, 0], v: [0, -n * a * B.m / M, 0], s: [0, 0, A.s] }, pl = { key: k, m: B.m, R: B.R, p: [a * A.m / M, 0, 0], v: [0, n * a * A.m / M, 0], s: [0, 0, B.s] };
    rows.push(Object.assign({ group: 'solar', sys: 'sun+' + k }, L.selfShareRow({ recv: pl, sources: [sun] })));
    if (k === 'jupiter') rows.push(Object.assign({ group: 'solar', sys: 'sun+jupiter' }, L.selfShareRow({ recv: sun, sources: [pl] })));
  }
  twoBodyRows('em', 1, 'solar'); twoBodyRows('ji', 1, 'solar'); twoBodyRows('pc', 0, 'binary'); twoBodyRows('pc', 1, 'binary');
  const Ms = L.LIT.msun;
  for (const bq of L.LIT.binaries) {
    const mA = bq.mA * Ms, mB = bq.mB * Ms, M = mA + mB, a = bq.a, n = Math.sqrt(L.DECL.G * M / a ** 3);
    const A = starBody(bq.key + 'A', mA, bq.RA, bq.PspinA, [-a * mB / M, 0, 0], [0, -n * a * mB / M, 0]), B = starBody(bq.key + 'B', mB, bq.RB, bq.PspinB, [a * mA / M, 0, 0], [0, n * a * mA / M, 0]);
    rows.push(Object.assign({ group: 'binary', sys: bq.key }, L.selfShareRow({ recv: A, sources: [B] })));
    rows.push(Object.assign({ group: 'binary', sys: bq.key }, L.selfShareRow({ recv: B, sources: [A] })));
  }
  { const g = L.LIT.galaxy, R0 = g.R0kpc * 1e3 * L.LIT.pc, Mg = g.v0 * g.v0 * R0 / L.DECL.G, sunB = L.bodyOf('sun');
    const sunG = { key: 'sun', m: sunB.m, R: sunB.R, p: [R0, 0, 0], v: [0, g.v0, 0], s: [0, 0, sunB.s] }, core = { key: 'galaxyInner', m: Mg, R: 1, p: [0, 0, 0], v: [0, 0, 0], s: [0, 0, 0] };
    const ac = L.LIT.binaries.find((b) => b.key === g.nearKey), near = { key: 'alphaCenNear', m: (ac.mA + ac.mB) * Ms, R: 1, p: [R0, g.nearPc * L.LIT.pc, 0], v: [0, g.v0, 0], s: [0, 0, 0] };
    rows.push(Object.assign({ group: 'galaxy', sys: 'galaxy', MgalKg: Mg }, L.selfShareRow({ recv: sunG, sources: [core, near] }))); }
  return { rows };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const A = J.push.rows, W = J.windows, nPush = PLAN.pushPairs.reduce((s, p) => s + p.iDeg.length, 0) * L.DECL.pushCols.length * L.DECL.rates.length * L.DIRS.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    input: J.inputs.axfVersion === 'w333b-axialfield-1' && J.inputs.axfLibVersion === 'w333b-axialfield-lib-1',
    pushComplete: A.length === nPush && A.every((r) => fin(r.P) && r.N.every(fin) && fin(r.S.Q) && fin(r.D.Q)),
    pushIdentity: A.every((r) => r.PnRel <= 1e-12 && (r.tidalForm === null || r.tidalForm <= 1e-12)),
    pushVsOrbitPush: A.filter((r) => r.dir === 'NF').every((r) => r.vsOrbitPush.P <= L.DECL.pushTol && r.vsOrbitPush.Nh <= L.DECL.pushTol && (r.vsOrbitPush.Ni === null || r.vsOrbitPush.Ni <= L.DECL.pushTol)),
    epochComplete: J.epoch.rows.length === PLAN.epochBodies.length && J.epoch.rows.every((r) => PLAN.epochCols.every((c) => r.cols[c] && L.DECL.tauOrbits.every((t) => fin(r.cols[c].tau[t].heatParts)))),
    epochIdentity: J.epoch.rows.every((r) => PLAN.epochCols.every((c) => L.DECL.tauOrbits.every((t) => { const q = r.cols[c].tau[t]; return q.identityRel <= 1e-12 && q.torqueRel <= 1e-12 && q.excessParts >= -1e-12 * q.heatMerged
      && (q.perSource === null || (q.perSource.identityRel <= 1e-12 && q.perSource.torqueRel <= 1e-12 && q.perSource.excess >= -1e-12 * q.perSource.merged)); }))),
    windowsComplete: PLAN.windowSystems.every((k) => W[k] && W[k].runs.length === (L.SELF_RULES.length + PLAN.carrySelf.length) * L.DECL.tauOrbits.length + 2),
    windowsClosed: PLAN.windowSystems.every((k) => W[k].runs.every((r) => r.closed && r.ledgerAxialRel <= 1e-9 && r.heatExcess >= -1e-9 * Math.abs(r.heatMerged))),
    pcSyncNone: W.pc.sync.find((q) => q.selfRule === 'none').rows.every((r) => r.omegaMinusSRel <= 1e-12) && W.pc.sync.filter((q) => q.selfRule !== 'none').every((q) => q.rows.every((r) => r.carryMinusSRel <= 1e-9)) && W.pc.runs.filter((r) => r.label === 'axial' && r.selfRule === 'none').every((r) => Math.abs(r.heatPath) <= 1e-12 * Math.abs(r.supply) + 1e-300 || r.heatPath === 0),
    tide: J.tide.rows.length === PLAN.tidePairs.length * L.SELF_RULES.length && J.tide.rows.every((r) => Math.abs(r.slope.rT + 3) <= 1e-9 && Math.abs(r.slope.mT - 1) <= 1e-9 && r.base.Ttrace <= 1e-12 * r.base.Tnorm),
    self: J.self.rows.length > 0 && J.self.rows.every((r) => r.kappaM.boundOk && r.robs.boundOk && fin(r.engineK1.sumBeta)),
  };
}
export function runAll(root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const AX = readAxf(root); mark('inputs');
  const push = partPush(); mark('push');
  const epoch = partEpoch(AX); mark('epoch');
  const windows = partWindows(); mark('windows');
  const tide = partTide(); mark('tide');
  const self = partSelf(); mark('self');
  const J = { inputs: { axf: AXF_JSON, axfVersion: AX.version, axfLibVersion: AX.libVersion, axfTargetSha256: AX.targetSha256 || null }, pure, push, epoch, windows, tide, self, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W334B_OUT ? (path.isAbsolute(process.env.W334B_OUT) ? process.env.W334B_OUT : path.join(ROOT, process.env.W334B_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第334便b ledger(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w334b-ledger.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-11)「並進引きずり = 引きずる側の移動と回転を使った座標変換 —— 自分自身への並進引きずりが慣性」「軸引きずり = 受ける側の部位による差分 —— 潮汐力の引きずり版」'
      + '「回転引きずり = 引きずる側の回転による空間の捩れ —— s_d は J 案が有望」(作業仮説 —— 診断で検査)・原仮定者の回答(2026-11-11 —— AN624 = A・AN625 = A・AN626 = A・AN628 = B・AN629 = D・AN630 = A)・統括の検証項目 R323',
    declLedger: L.DECL_LEDGER, decl: L.DECL, plan: PLAN, lit: L.LIT, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w334b-ledger.mjs', 'tests/lib-w334b-ledger.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs',
    'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs',
    'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第334便b', target: TARGET, code: CODE, inputs: [AXF_JSON] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ledger', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 第333便b の正本の本の時刻の値を読む)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

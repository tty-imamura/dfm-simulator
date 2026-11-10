// 第333便c(原仮定者の整理(2026-11-10)「水星は絡む要素が多く難しい天体・軌道も公転面に対して斜め」「G_loc も次数を含めて選択肢のひとつ」「新しい解釈の引きずりも検証する」・
//   原仮定者の回答(2026-11-10 —— AN597・AN598・AN600)・統括の検証項目 R319): **水星の三次元の対照の器 —— 今の組(G_loc n = 2 + K1)を凍結の基準に、G_loc の次数と対称・統合した並進引きずり・
//   回転引きずりの差分(切り口の式と対向 2 点の三次元の差分)を効果ごとに単独で(近点引数・近点経度・交点・傾き・軌道面の中の近点の回り —— 太陽の赤道面と黄道を分ける)・地球・火星・金星の対照・
//   連星の対称 G_loc の小さな診断**(段 mercury3d-333c —— 正本 tests/out/mercury3d-w333c.json・lib tests/lib-w333c-mercury3d.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🌡️ mercurySunInertial3d・🌋 venusSunInertial3d・🔴 marsSunInertial3d の宣言の値を .find で引いて読む ——
//   本の JSON は 1 bit も変えない・步は進めない)。今の組の値は正本 tests/out/inposk1-w315c.json を読む(写しは走らせない —— 第315便c の器の値)。1 プロセス。
//
// ■ 何をするか
//   G 三次元の幾何(本の太陽の極と惑星の状態 → 軌道の要素・太陽の赤道面に対する傾き・交点・近点引数 —— 文献の値と照らす)
//   E1 今の組(正本の値 + 一次の分担を Gauss の式で —— 交点と傾きは 0)/E2 G_loc の n × 受け手/対称(単独の率 —— 今の組の n = 2 を置き換えると動く量)/
//   E3 統合した並進引きずり(α × 自己の規則 × 並進の分/回転の分 —— 今の組に足すと動く量)/E4 回転引きずりの差分(切り口の式・対向 2 点 × α × s_d × 応答率)
//   N 純粋な三次元の積分器の照合(効果の型ごとに係数を上げた写し —— h と h/2)/C 対照(金星・地球・火星 —— 大きさ)/B 連星の対称 G_loc(η の格子 × 型 —— 一次と純粋な積分器)
// ■ 言わないこと: 表は宣言した型の一次の率・基準との差・残差。G_loc の次数を決めた・新しい引きずりで水星の近点の値を出したとは書かない。一次の率は無摂動の軌道の平均で、
//   写しの時間発展ではない(率 × 周期が 1e-3 を超える列は一次外挿が壊れる印)。文献の値は本便は一次資料に当たっていない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w333c-mercury3d.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🌡️🌋🔴 の 3 本〔宣言の値を .find で引いて読む〕。
//   roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt・HP.validatePreset は import した tests/lib-w280b-emgrid.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   エンジンは読まない〔core:false —— 步を進めない・写しを作らない〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["marsSunInertial3d","mercurySunInertial3d","venusSunInertial3d"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w333c-mercury3d-1';
export const OUT_MAIN = 'tests/out/mercury3d-w333c.json';
export const INPOS_JSON = 'tests/out/inposk1-w315c.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const { add, sub, scl, dot, crs, nrm, unit } = L.vec;
const DEG = Math.PI / 180;
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const asec = (r) => (r === null ? null : L.toArcsecCy(r));
export const NOT_CLAIM = Object.freeze(['表は宣言した型の一次の率・基準との差・残差(G_loc の次数を決めたとは書かない)', '新しい引きずりで水星の近点の値を出したとは書かない',
  '一次の率は無摂動の軌道の平均(写しの時間発展ではない)—— 率 × 周期が 1e-3 を超える列は一次外挿が壊れる印', '統合した並進引きずり・回転引きずりの差分・対称の G_loc の n の格子は宣言(未接続 —— 今のエンジンに無い)',
  '今の組(G_loc n = 2 + K1)は凍結の基準(AN597 —— 将来まで固定しない)', '文献の値は本便は一次資料に当たっていない', '太陽の赤道面・黄道・水星の公転面は別の面(基準面ごとに率を出す)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 本(宣言の値を読む —— bodies[0] = 太陽・bodies[1] = 惑星) */
  books: Object.freeze({ merc: 'mercurySunInertial3d', venus: 'venusSunInertial3d', mars: 'marsSunInertial3d' }),
  /** 対照の惑星(地球は本を読まない —— 文献の値の宣言〔🌦️ は太陽–地球–月で二体の本ではない〕) */
  controls: Object.freeze(['venus', 'earth', 'mars']),
  /** 本の状態と文献の要素の照らしの上限(a・e は相対・角は度) */
  elemTol: Object.freeze({ rel: 1e-6, deg: 1e-5 }),
  /** 今の組の正本の刻み(inposk1-w315c の byDiv —— 2 = h/2) */
  inposDiv: '2',
  /** 純粋な三次元の積分器の照合の型(単位の軌道 μ = a = 1・e は水星・面は太陽の赤道面に対する水星の傾き —— 係数は一次の線形の範囲へ上げた写し) */
  numeric: Object.freeze([
    Object.freeze({ key: 'gLoc', label: 'G_loc の力の型(n = 2)', kind: 'accel', eps: 1e-7 }),
    Object.freeze({ key: 'k1', label: 'K1 の並進(速度の型)', kind: 'vel', b: 1e-6 }),
    Object.freeze({ key: 'transRot1', label: '統合した並進の回転の分(α = 1)', kind: 'vel', c: 1e-5, alpha: 1 }),
    Object.freeze({ key: 'transTr2', label: '統合した並進の並進の分(α = 2)', kind: 'vel', c: 1e-6, alpha: 2 }),
    Object.freeze({ key: 'pair2', label: '対向 2 点の差分(α = 2・NF)', kind: 'accel', amp: 1e-8, alpha: 2 }),
  ]),
  /** 照合の上限(一次 ÷ 数値 —— h/2 の比の 1 からの外れ)と h と h/2 の差の上限(相対) */
  numericTol: 2e-3,
  /** 連星の純粋な積分器の η(第331便c の apsidalNumeric —— 相対の軌道に還元した力・e = 0.2) */
  binaryNumericEta: Object.freeze([0, 0.25]),
  G: L.DECL.G, c: L.DECL.c,
});

/* ───────── 入力(本の宣言 —— SI へ)───────── */
const axisOfSpin = (b) => (b.spinAxis ? L.axisOf(b.spinAxis.tiltDeg, b.spinAxis.azimuthDeg) : [0, 0, 1]);
function bookOf(p) {
  const se = p.scaleExp, uL = 10 ** se.L, uT = 10 ** se.T, uM = 10 ** se.M, b = p.bodies;
  const conv = (q) => ({ m: q.m * uM, R: q.radius * uL, x: [q.x * uL, q.y * uL, (q.z || 0) * uL], v: [q.vx * uL / uT, q.vy * uL / uT, (q.vz || 0) * uL / uT], spin: q.spin / uT, axis: axisOfSpin(q),
    tiltDeg: q.spinAxis ? q.spinAxis.tiltDeg : null, azimuthDeg: q.spinAxis ? q.spinAxis.azimuthDeg : null });
  return { id: p.id, sun: conv(b[0]), planet: conv(b[1]), G: p.physics.G * uL ** 3 / (uM * uT * uT), c: p.physics.cLight * uL / uT, scaleExp: se };
}
export function readBooks(HP) {
  // 名指しの 3 本だけを `.find` で直に引く(変数に受けると領域の下限が「内蔵の全本」になる)
  const me = clone(HP.allPresets().find((q) => q.id === 'mercurySunInertial3d'));
  const ve = clone(HP.allPresets().find((q) => q.id === 'venusSunInertial3d'));
  const ma = clone(HP.allPresets().find((q) => q.id === 'marsSunInertial3d'));
  if (!me || !ve || !ma) throw new Error('readBooks: 🌡️🌋🔴 の本が無い');
  return { merc: bookOf(me), venus: bookOf(ve), mars: bookOf(ma) };
}
/** 系(太陽 + 惑星 —— 軌道・太陽の軸と自転・惑星の質量と半径) */
export function systemOf(BK, key) {
  const G = PLAN.G, lit = L.GEOM.planets[key], Lsun = L.GEOM.sun;
  if (key === 'earth') {   // 文献の値の宣言(本を読まない)
    const fr = L.frameOfElements(lit), sunAxis = L.poleToEcliptic(L.GEOM.sunPole.ra, L.GEOM.sunPole.dec).u, M = Lsun.m, mu = G * (M + lit.m);
    return { key, src: '文献の値(本を読まない)', M, Rsun: Lsun.R, sSun: BK.merc.sun.spin, sunAxis, m: lit.m, R: lit.R, spin: lit.spin, orb: { a: lit.a * L.GEOM.AU, e: lit.e, mu, P: fr.P, Q: fr.Q, W: fr.W }, lit };
  }
  const B = BK[key], mu = G * (B.sun.m + B.planet.m), o = L.orbitOfState(sub(B.planet.x, B.sun.x), sub(B.planet.v, B.sun.v), mu);
  return { key, src: B.id, M: B.sun.m, Rsun: B.sun.R, sSun: B.sun.spin, sunAxis: B.sun.axis, m: B.planet.m, R: B.planet.R, spin: B.planet.spin, orb: { a: o.a, e: o.e, mu, P: o.P, Q: o.Q, W: o.W, M: o.M }, lit };
}

/* ───────── G 三次元の幾何 ───────── */
export function partGeom(BK) {
  const sunLit = L.poleToEcliptic(L.GEOM.sunPole.ra, L.GEOM.sunPole.dec), b = BK.merc.sun;
  const sunBook = { tiltDeg: b.tiltDeg, azimuthDeg: b.azimuthDeg, spin: b.spin, periodDays: 2 * Math.PI / b.spin / 86400 };
  const rows = ['merc', 'venus', 'earth', 'mars'].map((k) => {
    const S = systemOf(BK, k), o = S.orb, ecl = L.anglesOn(o, [0, 0, 1], [1, 0, 0]), eq = L.anglesOn(o, S.sunAxis, crs([0, 0, 1], S.sunAxis));
    const lit = L.GEOM.planets[k], fl = L.frameOfElements(lit), aLit = lit.a * L.GEOM.AU;
    const iEcl = ecl.i / DEG, nodeEcl = ecl.node === null ? null : ((ecl.node / DEG) % 360 + 360) % 360, omEcl = ecl.omega === null ? null : ((ecl.omega / DEG) % 360 + 360) % 360;
    const varpiEcl = nodeEcl === null ? null : (nodeEcl + omEcl) % 360;
    const dAngle = Math.acos(Math.max(-1, Math.min(1, dot(o.W, fl.W)))) / DEG, dPeri = Math.acos(Math.max(-1, Math.min(1, dot(o.P, fl.P)))) / DEG;
    return { key: k, ja: lit.ja, src: S.src, a: o.a, e: o.e, aAU: o.a / L.GEOM.AU, iEclDeg: iEcl, nodeEclDeg: nodeEcl, omegaEclDeg: omEcl, varpiEclDeg: varpiEcl,
      iEqDeg: eq.i / DEG, nodeEqDeg: eq.node === null ? null : ((eq.node / DEG) % 360 + 360) % 360, omegaEqDeg: eq.omega === null ? null : ((eq.omega / DEG) % 360 + 360) % 360, eqIncLit: lit.eqIncLit,
      vsLit: { aRel: relD(o.a, aLit), eAbs: Math.abs(o.e - lit.e), normalDeg: dAngle, periDeg: dPeri }, mu: o.mu, period: 2 * Math.PI / Math.sqrt(o.mu / o.a ** 3) };
  });
  return { frame: L.GEOM.frame, sunLit: { tiltDeg: sunLit.tiltDeg, azimuthDeg: sunLit.azimuthDeg }, sunBook, rows,
    defs: { omega: '近点引数 ω —— 公転面の中で、基準面の昇交点から近日点までの角', varpi: '近点経度 ϖ = Ω_node + ω(折れた角)', node: '交点の歳差 dΩ_node/dt(基準面の上の昇交点の経度の率)', inc: '傾きの率 di/dt', apsIn: '軌道面の中の近点の回り dω/dt + cos i dΩ_node/dt(基準面に依らない —— 一次)' },
    note: '基準面は黄道(J2000 の平均黄道 —— 本の xy 面)と太陽の赤道面(本の太陽の自転軸に垂直)。太陽の赤道面の基準の向きは黄道の上の昇交点(ẑ × ŝ)。地球(EMB)は黄道の傾きが 0 に近く、黄道の交点と近点引数は定まらない' };
}

/* ───────── 効果ごとの率 ───────── */
function ratesRow(S, R, extra = {}) {
  const P = R.period, per = R.per, pick = (k) => (per[k] && !per[k].degenerate ? { di: asec(per[k].di), dnode: asec(per[k].dnode), domega: asec(per[k].domega), dvarpi: asec(per[k].dvarpi) } : { di: null, dnode: null, domega: null, dvarpi: null, degenerate: true });
  return Object.assign({ apsIn: asec(R.apsIn), ecl: pick('ecl'), sun: pick('sun'), dlnAcy: R.dadtOverA * L.CENTURY_S, decy: R.dedt * L.CENTURY_S, breaks: R.flags.breaks,
    perOrbitMax: Math.max(Math.abs(R.apsIn), Math.abs(R.dadtOverA), ...['ecl', 'sun'].filter((k) => per[k] && !per[k].degenerate).map((k) => Math.max(Math.abs(per[k].di), Math.abs(per[k].dnode)))) * P }, extra);
}
const polesOf = (S) => (S.key === 'earth' ? { sun: S.sunAxis } : { ecl: [0, 0, 1], sun: S.sunAxis });
/** E1・E2(G_loc と K1 —— 中心力・公転面の中の力) */
export function partGlocK1(S, inposSys = null) {
  const poles = polesOf(S), q1 = L.q1PNPerOrbit(S.orb.mu, S.orb.a, S.orb.e), P = 2 * Math.PI / Math.sqrt(S.orb.mu / S.orb.a ** 3), q1cy = asec(q1 / P), eta = S.M * S.m / (S.M + S.m) ** 2;
  const b = 10 * PLAN.G * (S.M + S.m) / (PLAN.c * PLAN.c);
  const Rg = L.secularRates(S.orb, L.gLocAccel({ mu: S.orb.mu, n: 2, muEff: S.orb.mu * (1 - 2 * eta) }), { poles });
  const Rk = L.secularRates(S.orb, L.velocityToAccel(S.orb, L.k1Velocity(b)), { poles });
  const now = { gLoc: ratesRow(S, Rg), k1: ratesRow(S, Rk) };
  now.sumApsIn = now.gLoc.apsIn + now.k1.apsIn; now.shareG = now.gLoc.apsIn / q1cy; now.shareK = now.k1.apsIn / q1cy;
  if (inposSys) { const d = inposSys.byDiv[PLAN.inposDiv]; now.canon = { q00: d.q.q00, q10: d.q.q10, q11: d.q.q11, dqG: d.dqG, DG: d.DG, r1pn: d.r1pn, sum: d.q.q11 - d.q.q00, band: inposSys.bands ? Object.values(inposSys.bands)[0] : null };
    now.vsCanon = { gRel: relD(now.gLoc.apsIn, d.dqG), kRel: relD(now.k1.apsIn, d.DG) }; }
  // E2: n × 型(一次の分担は第331便c の gLocShare —— 受け手 −(n/3)(1 − 2η)・対称 −n/6。Gauss の率は μ_eff の力の型で)
  const grid = [];
  for (const pair of L.DECL.pairs) for (const n of L.DECL.nGrid) {
    const fac = pair === 'receiver' ? 1 - 2 * eta : 0.5, R = n === 0 ? null : L.secularRates(S.orb, L.gLocAccel({ mu: S.orb.mu, n, muEff: S.orb.mu * fac }), { poles });
    const share = L.gLocShare(n, pair, eta), row = R ? ratesRow(S, R) : { apsIn: 0, ecl: { di: 0, dnode: 0, domega: 0, dvarpi: 0 }, sun: { di: 0, dnode: 0, domega: 0, dvarpi: 0 }, dlnAcy: 0, decy: 0, breaks: false, perOrbitMax: 0 };
    grid.push(Object.assign(row, { pair, n, share, shareGauss: row.apsIn / q1cy, vsNow: row.apsIn - now.gLoc.apsIn, totalWithK1: (row.apsIn + now.k1.apsIn) / q1cy, totalNoK1: row.apsIn / q1cy }));
  }
  return { q1cy, eta, b, now, grid };
}
/** E3 統合した並進引きずり(α × 自己の規則 × 部分) */
export function partTrans(S) {
  const poles = polesOf(S), spin = scl(S.sunAxis, S.sSun), rows = [];
  for (const rule of L.DECL.selfRules) for (const alpha of L.DECL.alphaGrid) {
    const Rself = rule === 'kappaM' ? 10 * PLAN.G / (L.C1 * PLAN.c * PLAN.c) * S.m : S.R, self = L.selfOf({ alpha, m: S.m, R: Rself });
    for (const part of ['trans', 'rot']) {
      const R = L.secularRates(S.orb, L.velocityToAccel(S.orb, L.transDragVelocity({ Msrc: S.M, selfW: self.w, alpha, spinVec: spin, part })), { poles });
      const beta0 = L.weightOf(S.M, S.orb.a, alpha) / (self.w + L.weightOf(S.M, S.orb.a, alpha));
      rows.push(ratesRow(S, R, { rule, alpha, part, selfType: self.type, Rself, betaAtA: beta0 }));
    }
  }
  return { rows, spin: S.sSun, note: '源は太陽(静止 —— 反動は持たない)・受け手は惑星(自己の重みの半径は規則 kappaM = Y_k m か観測の半径)。α = 1・ballHarmonic・kappaM の並進の分は K1 の β = C₁R_d/r と同じ係数(今の組の K1 と同じ値 —— 太陽の質量だけの分)' };
}
/** E4 回転引きずりの差分(切り口の式・対向 2 点 × α × s_d × 応答率)。率は加速度に一次 —— a ∝ |s_γ| s_d なので基準(s_γ = s_d = 観測の s)の率を倍する */
export function partRotDiff(S) {
  const poles = polesOf(S), Rd = 10 * PLAN.G / (L.C1 * PLAN.c * PLAN.c) * S.M, s = S.sSun;
  const win = L.bandWindows(S.orb, S.sunAxis, Rd);
  const Rc = L.secularRates(S.orb, L.cutAccel({ M: S.M, axis: S.sunAxis, Omega: s }), { poles, windows: win, gl: L.DECL.bandGL });
  const RcF = L.secularRates(S.orb, L.cutAccel({ M: S.M, axis: S.sunAxis, Omega: s }), { poles, windows: win, gl: L.DECL.bandGLFine });
  const cut = Object.assign(ratesRow(S, Rc), { fineRel: relD(Rc.per.sun.di, RcF.per.sun.di), windowsE: win, crossSec: win.map(([a, b]) => (b - a) / Math.sqrt(S.orb.mu / S.orb.a ** 3) * (1 - S.orb.e * Math.cos((a + b) / 2))) });
  const sds = [{ key: 'observed', label: '観測自転', sd: s }].concat(L.DECL.lambdaJ.map((lj) => ({ key: 'lambdaJ=' + lj, label: 'λ_J = ' + lj, lambdaJ: lj, sd: L.dragSpin({ s, Robs: S.Rsun, Rd, fObs: L.GEOM.sunMoI.value, lambdaJ: lj }) })));
  const pair = [];
  for (const alpha of L.DECL.pairAlpha) {
    const R = L.secularRates(S.orb, L.pairAccel({ Rd, axis: S.sunAxis, sd: s, sGamma: s, alpha }), { poles }), base = ratesRow(S, R);
    const RF = L.secularRates(S.orb, L.pairAccel({ Rd, axis: S.sunAxis, sd: s, sGamma: s, alpha }), { poles, nodes: L.DECL.nodesFine });
    for (const sd of sds) for (const resp of ['fixed', 'linked']) {
      const k = (sd.sd / s) * (resp === 'fixed' ? 1 : Math.abs(sd.sd / s));
      const scaleObj = (o) => Object.fromEntries(Object.entries(o).map(([kk, v]) => [kk, v === null || typeof v !== 'number' ? v : v * k]));
      const row = { alpha, sdKey: sd.key, sdLabel: sd.label, sd: sd.sd, sdRdOverC: sd.sd * Rd / PLAN.c, resp, factor: k, apsIn: base.apsIn * k, ecl: scaleObj(base.ecl), sun: scaleObj(base.sun), dlnAcy: base.dlnAcy * k, decy: base.decy * k,
        perOrbitMax: base.perOrbitMax * Math.abs(k) };
      row.breaks = row.perOrbitMax > L.DECL.breakPerOrbit;
      if (sd.key === 'observed' && resp === 'fixed') row.fineRel = relD(R.per.sun.di, RF.per.sun.di);
      pair.push(row);
    }
  }
  return { Rd, s, sds: sds.map((q) => ({ key: q.key, label: q.label, sd: q.sd, sdRdOverC: q.sd * Rd / PLAN.c })), cut, pair,
    note: '切り口の式(第332便a の主)は帯の外で 0 —— 水星は太陽の赤道面を横切る区間(|z| ≤ R_d)だけ。対向 2 点の差分は帯の外にも尾(遠方 α s_d R_d² ρ/r²)。率は加速度に一次 —— 固定の応答率は s_d に比例・連動の応答率は s_d|s_d| に比例' };
}

/* ───────── N 純粋な三次元の積分器の照合 ───────── */
export function partNumeric(S) {
  const g = L.anglesOn(S.orb, S.sunAxis), el = { I: g.i / DEG, Om: 0, varpi: g.omega / DEG }, fr = L.frameOfElements(el), orb0 = { a: 1, e: S.orb.e, mu: 1, P: fr.P, Q: fr.Q, W: fr.W }, pole = [0, 0, 1];
  const rows = PLAN.numeric.map((T) => {
    let accelX = null, velX = null, aSt = null;
    if (T.key === 'gLoc') { const f = L.gLocAccel({ mu: 1, n: 2, muEff: 1, c: 1 / Math.sqrt(T.eps) }); aSt = f; accelX = (x) => f({ x, r: nrm(x) }); }
    if (T.key === 'k1') velX = L.k1Velocity(T.b);
    if (T.key === 'transRot1' || T.key === 'transTr2') { const part = T.key === 'transRot1' ? 'rot' : 'trans', spin = [0, 0, T.key === 'transRot1' ? 1 : 0.5];
      velX = (x, v) => { const r = nrm(x), beta = T.c / Math.pow(r, T.alpha); return part === 'rot' ? scl(crs(spin, x), beta) : scl(v, -beta); }; }
    if (T.key === 'pair2') { const Rd = 1e-3, f = L.pairAccel({ Rd, axis: pole, sd: T.amp / (L.C1 * Rd * Rd * Rd), sGamma: 1, alpha: T.alpha }); aSt = f; accelX = (x, v) => f({ x, v }); }
    const an = L.secularRates(orb0, aSt || L.velocityToAccel(orb0, velX), { poles: { p: pole } }), P = 2 * Math.PI;
    const ana = { aps: an.apsIn * P, di: an.per.p.di * P, dnode: an.per.p.dnode * P, domega: an.per.p.domega * P, dlnA: an.dadtOverA * P };
    const n1 = L.integrate3d({ orb0, accelX, velX, pole, stepsPerOrbit: L.DECL.integ.stepsPerOrbit }), n2 = L.integrate3d({ orb0, accelX, velX, pole, stepsPerOrbit: 2 * L.DECL.integ.stepsPerOrbit });
    const KS = ['aps', 'di', 'dnode', 'domega', 'dlnA'], scale = Math.max(...KS.map((k) => Math.abs(ana[k])));
    const dev = Math.max(...KS.map((k) => Math.abs(n2[k] - ana[k]))) / scale, band = Math.max(...KS.map((k) => Math.abs(n2[k] - n1[k]))) / scale;
    return { key: T.key, label: T.label, analytic: ana, h: n1, h2: n2, devOverScale: dev, bandOverScale: band };
  });
  return { orb0: { e: orb0.e, iDeg: el.I, omegaDeg: el.varpi }, rows, note: '単位の軌道(μ = a = 1・e と面は太陽の赤道面に対する水星の値)・係数を一次の線形の範囲へ上げた写し(本物の大きさの列は一次の解析)・公転ごとの同じ位相の標本・無摂動の同じ刻みを引く・h = 2π/2000 と h/2' };
}

/* ───────── C 対照・B 連星 ───────── */
export function partControls(BK) {
  return PLAN.controls.map((k) => {
    const S = systemOf(BK, k), GK = partGlocK1(S), TR = partTrans(S), RD = partRotDiff(S);
    const pick = (q) => ({ apsIn: q.apsIn, sunNode: q.sun.dnode, sunDi: q.sun.di, eclNode: q.ecl.dnode, eclDi: q.ecl.di, breaks: q.breaks });
    return { key: k, ja: L.GEOM.planets[k].ja, q1cy: GK.q1cy, gLoc: GK.now.gLoc.apsIn, k1: GK.now.k1.apsIn,
      transRot1: pick(TR.rows.find((q) => q.rule === 'kappaM' && q.alpha === 1 && q.part === 'rot')), transTr1: pick(TR.rows.find((q) => q.rule === 'kappaM' && q.alpha === 1 && q.part === 'trans')),
      transRot2r: pick(TR.rows.find((q) => q.rule === 'radius' && q.alpha === 2 && q.part === 'rot')),
      cut: pick(RD.cut), pair2obs: pick(RD.pair.find((q) => q.alpha === 2 && q.sdKey === 'observed' && q.resp === 'fixed')), pair2J3linked: pick(RD.pair.find((q) => q.alpha === 2 && q.sdKey === 'lambdaJ=0.001' && q.resp === 'linked')),
      spin: S.spin, iEqDeg: L.anglesOn(S.orb, S.sunAxis).i / DEG };
  });
}
export function partBinary() {
  const first = L.BINARY_TYPES.map((T) => ({ key: T.key, label: T.label, status: T.status, shares: L.DECL.etaGrid.map((eta) => ({ eta, total: L.binaryShare(T, eta), overTest: L.binaryShare(T, eta) / L.binaryShare(T, 0) })) }));
  const numeric = [];
  for (const T of L.BINARY_TYPES) for (const eta of PLAN.binaryNumericEta) { const r = L.binaryNumeric(T, eta); numeric.push({ key: T.key, eta, g: r.g, k: r.k, total: r.total, first: L.binaryShare(T, eta), dev: Math.abs(r.total - L.binaryShare(T, eta)) }); }
  return { first, numeric, note: '一次: G_loc の分担は第331便c の gLocShare(受け手 −(n/3)(1 − 2η)・対称 −n/6)+ K1 +5/3(η に依らない)。純粋な積分器は相対の軌道に還元した力(第331便c の apsidalNumeric —— e = 0.2・ε = 1e-6)。在位の連星の本は変えない・写しは走らせない(一次と純粋な積分器だけ —— 宣言)' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = J.geom, M = J.mercury, N = J.numeric, B = J.binary;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    geomBooks: G.rows.filter((q) => q.key !== 'earth').every((q) => q.vsLit.aRel <= PLAN.elemTol.rel && q.vsLit.eAbs <= PLAN.elemTol.rel && q.vsLit.normalDeg <= PLAN.elemTol.deg && q.vsLit.periDeg <= PLAN.elemTol.deg * 10)
      && Math.abs(G.sunBook.tiltDeg - G.sunLit.tiltDeg) <= 1e-8 && Math.abs(G.sunBook.azimuthDeg - G.sunLit.azimuthDeg) <= 1e-8,
    nowCanon: M.glock1.now.vsCanon.gRel <= 1e-4 && M.glock1.now.vsCanon.kRel <= 1e-4 && ['gLoc', 'k1'].every((k) => ['ecl', 'sun'].every((f) => Math.abs(M.glock1.now[k][f].di) <= 1e-9 && Math.abs(M.glock1.now[k][f].dnode) <= 1e-9)),
    glocGrid: M.glock1.grid.length === L.DECL.pairs.length * L.DECL.nGrid.length && M.glock1.grid.every((q) => Math.abs(q.shareGauss - q.share) <= 1e-6 * Math.max(1, Math.abs(q.share)) && Math.abs(q.ecl.di) <= 1e-9 && Math.abs(q.sun.dnode) <= 1e-9),
    transRows: M.trans.rows.length === L.DECL.selfRules.length * L.DECL.alphaGrid.length * 2 && M.trans.rows.filter((q) => q.part === 'trans').every((q) => Math.abs(q.sun.di) <= 1e-6 * Math.abs(q.apsIn) + 1e-12)
      && Math.abs(M.trans.rows.find((q) => q.rule === 'kappaM' && q.alpha === 1 && q.part === 'trans').apsIn / M.glock1.now.k1.apsIn - 1) <= 1e-5,
    rotDiff: M.rotDiff.cut.fineRel <= 1e-6 && M.rotDiff.pair.filter((q) => q.fineRel !== undefined).every((q) => q.fineRel <= 1e-6) && M.rotDiff.pair.length === L.DECL.pairAlpha.length * (1 + L.DECL.lambdaJ.length) * 2,
    numeric: N.rows.every((q) => q.devOverScale <= PLAN.numericTol && q.bandOverScale <= PLAN.numericTol),
    controls: J.controls.length === PLAN.controls.length && J.controls.every((q) => Number.isFinite(q.gLoc) && Number.isFinite(q.k1) && Math.abs(q.k1 / q.q1cy - 5 / 3) <= 1e-3),
    binary: B.numeric.every((q) => q.dev <= 2e-4) && B.first.find((q) => q.key === 'sym4').shares.every((s) => Math.abs(s.total - 1) <= 1e-15),
  };
}
export function runAll(HP, inpos) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const geom = partGeom(BK); mark('geom');
  const S = systemOf(BK, 'merc'), inSys = inpos && inpos.K && inpos.K.systems ? inpos.K.systems.mercury : null;
  const mercury = { glock1: partGlocK1(S, inSys), trans: partTrans(S), rotDiff: partRotDiff(S) }; mark('merc3d');
  const numeric = partNumeric(S); mark('numeric');
  const controls = partControls(BK); mark('controls');
  const binary = partBinary(); mark('bin');
  const J = { books: { merc: { sun: { m: BK.merc.sun.m, spin: BK.merc.sun.spin, tiltDeg: BK.merc.sun.tiltDeg, azimuthDeg: BK.merc.sun.azimuthDeg }, G: BK.merc.G, c: BK.merc.c } }, pure, geom, mercury, numeric, controls, binary, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W333C_TARGET || 'beta/index.html';
  const OUT = process.env.W333C_OUT ? (path.isAbsolute(process.env.W333C_OUT) ? process.env.W333C_OUT : path.join(ROOT, process.env.W333C_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  const inpos = JSON.parse(fs.readFileSync(path.join(ROOT, INPOS_JSON), 'utf8'));
  console.log('第333便c mercury3d(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP, inpos);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w333c-mercury3d.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の整理(2026-11-10)「水星は絡む要素が多く難しい天体・軌道も公転面に対して斜め」「G_loc も次数を含めて選択肢のひとつ」「新しい解釈の引きずりも検証する」・原仮定者の回答(2026-11-10 —— AN597)今の G_loc n = 2 + K1 を凍結の基準の列に・原仮定者の回答(2026-11-10 —— AN598)K1 の +5/3 は相対の並進・原仮定者の回答(2026-11-10 —— AN600)連星の +33% は残差 + 対称の G_loc n = 2 の小さな診断・統括の検証項目 R319',
    inposVersion: inpos.version, decl: L.DECL, geomLit: L.GEOM, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w333c-mercury3d.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs',
    'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第333便c', target: TARGET, code: CODE, inputs: [TARGET, INPOS_JSON] }), {
    harnessVersion: HARNESS_VERSION, stage: 'mercury3d', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🌡️🌋🔴 の本の宣言を読む(步を進めない)・正本 inposk1-w315c の値を読む・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

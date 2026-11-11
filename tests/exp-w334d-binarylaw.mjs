// 第334便d(原仮定者の整理(2026-11-11)「連星について —— 新しい引きずりや、傾いた自転軸でのフィットなどを検証する」「冥王星とカロンが、連星のヒントになると想定」
//   「合わなくても、合わない量に法則性が見付かれば、進展したとする」・原仮定者の回答(2026-11-11 —— AN637・AN634・AN624)・統括の検証項目 R325):
//   **連星と冥王星–カロンの器 —— 同期の零試験と反例・二体の同時発展の格子(G_loc の型 × K1 の有無 × η × e × ε)と還元の和との差・残差の法則(宣言した族と物差し・設計の系と検証の系)・
//   傾いた自転軸(並進引きずりの回転の分 —— 1 つの軸の宣言で複数の量)・冥王星–カロンの位置づけ**(段 binarylaw-334d —— 正本 tests/out/binarylaw-w334d.json・lib tests/lib-w334d-binarylaw.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、連星と冥王星–カロンの在位の本 10 本の宣言の値を .find で引いて読む —— 本の JSON は 1 bit も変えない・
//   步は進めない・説明文の欄〔obsCard・status など〕は値として読まない)。他の正本は読まない。1 プロセス。
//
// ■ 何をするか
//   S 同期の零試験(質量比 × 位相 × 受け手 × 自己の重み)と反例(離心率・源の軸の傾き・非同期・源の角速度の混同)・次数・共変性
//   B 二体の同時発展の格子(近点の率 ÷ 1PN・周期の相対差・e と面の漂い・E と L の帳簿・重心)・h/h/2/h/4(間引きの宣言の部分集合)・還元の和(第333便c の binaryNumeric)との差
//   L 残差の法則(族 F1〜F4 を設計の格子に当て、検証の系の本の η・e・ε の点で判定)・T 傾いた自転軸(軸の傾き × 軸の組 × 自転の設定)・Y 系の表(本の η・e・ε・自転)・P 冥王星–カロンの読み
// ■ 言わないこと: 連星の観測と比べた結果ではない・一次の式((4/3)η)は入れた式・残差の法則の有無は宣言した物差しの判定・傾いた軸は比べる列(量ごとに別の軸を選ばない)・
//   冥王星–カロンの在位の本は引きずり OFF のケプラーの基線(新しい引きずりが合った証拠に数えない)。文献の値は本便は一次資料に当たっていない(未照合)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w334d-binarylaw.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は連星と冥王星–カロンの 10 本〔宣言の値を .find で引いて読む〕。
//   roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt・HP.validatePreset は import した tests/lib-w280b-emgrid.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   エンジンは読まない〔core:false —— 步を進めない・写しを作らない〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["alphaCenABInertial3d","alphaCenABInertial3dJ","binaryCheckEqualInertial3d","binaryCheckRatio3Inertial3d","plutoCharonDiagInput","plutoCharonInertialFit","psrB1534","psrDoubleABInertial3d","psrJ1757DFM","psrJ1946DFM"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w334d-binarylaw-1';
export const OUT_MAIN = 'tests/out/binarylaw-w334d.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const { sub, nrm } = L.vec;
export const NOT_CLAIM = Object.freeze(['連星の観測と比べた結果ではない(無次元の格子と本の η・e・ε の点 —— 宣言した型の表・候補・残差)', '一次の式((4/3)η など)は入れた式 —— 同時発展の表から相関を作ったことを発見と呼ばない',
  '残差の法則の有無は走行の前に宣言した族と物差しの判定(観測に合うように後から選ばない)', '傾いた自転軸は比べる列(量ごとに別の自由な軸を選ばない —— 1 つの軸の宣言で複数の量を並べる)',
  '同期の零試験は座標変換の部分だけ(空間の捩れとしての回転引きずりまで 0 とは言わない)', 'J 案の引きずり自転 s_d を座標変換の角速度に入れない(入れた列は源の角速度の混同の否定対照)',
  '冥王星–カロンの在位の本は引きずり OFF のケプラーの基線(新しい引きずりが合った証拠に数えない)', '同じ近点の率でも、周期・時刻・自転・他の観測量まで同じとは言わない', '文献の値は本便は一次資料に当たっていない(未照合)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 本(宣言の値を読む —— bodies[0]・bodies[1] の二体)。役割: design・verify・reading・spin(自転の宣言だけを読む) */
  books: Object.freeze([
    Object.freeze({ id: 'binaryCheckEqualInertial3d', role: 'design', ja: '♊ 検証サンプル 等質量' }),
    Object.freeze({ id: 'binaryCheckRatio3Inertial3d', role: 'design', ja: '⚖️ 検証サンプル 1:3' }),
    Object.freeze({ id: 'alphaCenABInertial3d', role: 'design', ja: '🔶 α Cen AB' }),
    Object.freeze({ id: 'alphaCenABInertial3dJ', role: 'spin', ja: '🔸 α Cen AB(観測自転の宣言)' }),
    Object.freeze({ id: 'psrDoubleABInertial3d', role: 'verify', ja: '📟 PSR J0737−3039A/B' }),
    Object.freeze({ id: 'psrJ1757DFM', role: 'verify', ja: '🧮 PSR J1757−1854' }),
    Object.freeze({ id: 'psrJ1946DFM', role: 'verify', ja: '🩺 PSR J1946+2052' }),
    Object.freeze({ id: 'psrB1534', role: 'verify', ja: '📿 PSR B1534+12' }),
    Object.freeze({ id: 'plutoCharonInertialFit', role: 'reading', ja: '🟪 冥王星–カロン(引きずり OFF の基線)' }),
    Object.freeze({ id: 'plutoCharonDiagInput', role: 'reading', ja: '🥶 冥王星–カロン(入力の整合の診断)' })]),
  /** 傾いた軸の観測の制約(文献の値・未照合 —— 本の宣言の値は器が読む: 📟 の obsSpin.axis.tiltDeg) */
  tiltLit: Object.freeze({
    plutoCharon: Object.freeze({ maxDeg: 1, src: '冥王星の自転軸とカロンの公転の軸はほぼ一致(相互同期 —— 傾きは 1° より小さい桁と読む。文献の値・未照合)' }),
  }),
  /** 冥王星–カロンの記録の引用(本の obsCard・status —— 説明文の欄なので器は値として読まない・文書の引用だけ) */
  plutoQuote: Object.freeze({
    fit: '🟪 の obsCard: 模型 551856.44309 s・残差 +0.00437 s(軟化 1 km の分 +0.00431 s)・周期の一致は入力の整合(標的の P と GM から a を作った合成のケプラー状態)',
    diag: '🥶 の status: 保留(calibration "hold")—— 周期 +0.00131%(279σ)・定義の差・同じ解の状態が未接続',
  }),
  /** 二体の還元の和の型(第333便c の BINARY_TYPES と同じ鍵の組 —— 照らすだけ) */
  binaryTypeKeys: Object.freeze(['now', 'sym2', 'sym4', 'recvM3', 'symM6']),
  /** QA の作り直しの部分集合(behavior —— 格子の行を作り直して正本と照らす) */
  behaviorSubset: Object.freeze({ g: Object.freeze(['recv2', 'sym4']), k1: Object.freeze([true]), eta: Object.freeze([0.05, 0.25]), e: Object.freeze([0.3]), eps: Object.freeze([1e-6]) }),
});

/* ───────── 入力(本の宣言 —— 二体の η・e・ε・自転)───────── */
const HZ = 2 * Math.PI;
function spinOfBody(b, T) {
  if (b.obsSpin && b.obsSpin.kind === 'omega') { const w = b.obsSpin.omega * (b.obsSpin.unit === 'Hz' ? HZ : 1) * Math.pow(10, T); return { s: w, src: 'obsSpin', tilt: b.obsSpin.axis && b.obsSpin.axis.tiltDeg ? clone(b.obsSpin.axis.tiltDeg) : null }; }
  if (b.pulse && b.pulse.source === 'observed' && Number.isFinite(b.pulse.omega)) return { s: b.pulse.omega, src: 'pulse', tilt: null };
  return { s: b.spin || 0, src: 'spin', tilt: null };
}
export function sysOfBook(p) {
  const se = p.scaleExp || { L: 0, T: 0, M: 0 }, b = p.bodies, G = p.physics.G, c = p.physics.cLight;
  const m0 = b[0].m, m1 = b[1].m, mu = G * (m0 + m1);
  const x = [b[1].x - b[0].x, b[1].y - b[0].y, (b[1].z || 0) - (b[0].z || 0)], v = [b[1].vx - b[0].vx, b[1].vy - b[0].vy, (b[1].vz || 0) - (b[0].vz || 0)];
  const o = L.orbitOfState(x, v, mu), n = Math.sqrt(mu / (o.a * o.a * o.a)), eps = mu / (o.a * c * c), eta = m0 * m1 / ((m0 + m1) * (m0 + m1));
  const sp = [spinOfBody(b[0], se.T), spinOfBody(b[1], se.T)], mf = [m0 / (m0 + m1), m1 / (m0 + m1)];
  // 並進引きずりの回転の分の目安 |d_回転|/v ≈ 10 ε m_j (s_j/n)(β_ij s_j r ÷ n a —— 源 j の自転)
  const rotRatio = [10 * eps * mf[1] * Math.abs(sp[1].s) / n, 10 * eps * mf[0] * Math.abs(sp[0].s) / n];
  return { id: p.id, eta, e: o.e, eps, a: o.a, n, q: m1 / m0, scaleExp: se, spins: sp.map((q) => ({ s: q.s, src: q.src, overN: q.s / n, tilt: q.tilt })), rotRatio, geoPN: p.physics.geoPN,
    fitRecord: p.fitRecord ? { target: p.fitRecord.targets[0].q, obs: p.fitRecord.targets[0].obs, unit: p.fitRecord.targets[0].unit, sigma: p.fitRecord.targets[0].tol.value } : null };
}
export function readBooks(HP) {
  // 名指しの 10 本を `.find` で直に引く(変数に受けると領域の下限が「内蔵の全本」になる)
  const out = {};
  out.binaryCheckEqualInertial3d = clone(HP.allPresets().find((q) => q.id === 'binaryCheckEqualInertial3d'));
  out.binaryCheckRatio3Inertial3d = clone(HP.allPresets().find((q) => q.id === 'binaryCheckRatio3Inertial3d'));
  out.alphaCenABInertial3d = clone(HP.allPresets().find((q) => q.id === 'alphaCenABInertial3d'));
  out.alphaCenABInertial3dJ = clone(HP.allPresets().find((q) => q.id === 'alphaCenABInertial3dJ'));
  out.psrDoubleABInertial3d = clone(HP.allPresets().find((q) => q.id === 'psrDoubleABInertial3d'));
  out.psrJ1757DFM = clone(HP.allPresets().find((q) => q.id === 'psrJ1757DFM'));
  out.psrJ1946DFM = clone(HP.allPresets().find((q) => q.id === 'psrJ1946DFM'));
  out.psrB1534 = clone(HP.allPresets().find((q) => q.id === 'psrB1534'));
  out.plutoCharonInertialFit = clone(HP.allPresets().find((q) => q.id === 'plutoCharonInertialFit'));
  out.plutoCharonDiagInput = clone(HP.allPresets().find((q) => q.id === 'plutoCharonDiagInput'));
  for (const s of PLAN.books) if (!out[s.id]) throw new Error('readBooks: 本が無い ' + s.id);
  return Object.fromEntries(PLAN.books.map((s) => [s.id, sysOfBook(out[s.id])]));
}

/* ───────── S 同期の零試験 ───────── */
export function partSync() {
  const N = L.syncNullTable(), O = L.syncOpsTable(), C = L.syncCovariance();
  return { null: { n: N.rows.length, maxD: N.maxD, maxSlip: N.maxSlip }, ops: O.rows, order: O.order, cov: C,
    note: '無次元(G = 1・M = 1・a = 1・n = 1)・大きさは公転の速さ n a で割った相対。操作の行は質量比 × 位相 × 受け手 × 自己の重みの最大と、代表の配置(q = 0.122・位相 0.7・受け手 = 伴・自己 1)。源の軸の操作は源の側だけ' };
}

/* ───────── B 二体の同時発展の格子 ───────── */
const GT = L.DECL.grid.gTypes;
const gOf = (key) => GT.find((t) => t.key === key);
const comboKey = (gk, k1) => gk + (k1 ? '+K1' : '');
export function gridRow(gk, k1, eta, e, eps, opt = {}) {
  const g = gOf(gk), R = L.twoBody(Object.assign({ eta, e, eps, g, k1 }, opt)), s1 = L.firstShare(g, k1, eta);
  return { g: gk, k1, eta, e, eps, share: R.share, rho: R.rho, rho1: s1 - 1, dRho: R.rho === null ? null : R.rho - (s1 - 1), dPoverP: R.dPoverP, de: R.de, tiltRate: R.tiltRate,
    eSlopeRel: R.ledger.eSlopeRel, eSpanRel: R.ledger.eSpanRel, lSlopeRel: R.ledger.lSlopeRel, lSpanRel: R.ledger.lSpanRel, cm: R.ledger.cmFinal, vcm: R.ledger.vcmFinal,
    vcmFirst: L.cmKickPerOrbit({ pair: g.pair, n: g.n, eta, e, eps }) * (opt.nOrb || L.DECL.grid.nOrb) };
}
export function partGrid() {
  const G = L.DECL.grid, cache = new Map(), rows = [];
  for (const t of G.gTypes) for (const k1 of G.k1) for (const eta of G.eta) for (const e of G.e) for (const eps of G.eps) rows.push(gridRow(t.key, k1, eta, e, eps, { offCache: cache }));
  // h/h/2/h/4(宣言の部分集合)
  const band = [], B = G.bandSubset;
  for (const t of G.gTypes) for (const k1 of G.k1) for (const eta of B.eta) for (const e of B.e) for (const eps of B.eps) {
    const r1 = rows.find((q) => q.g === t.key && q.k1 === k1 && q.eta === eta && q.e === e && q.eps === eps);
    const r2 = gridRow(t.key, k1, eta, e, eps, { stepsPerOrbit: 2 * G.stepsPerOrbit, offCache: cache }), r4 = gridRow(t.key, k1, eta, e, eps, { stepsPerOrbit: 4 * G.stepsPerOrbit, offCache: cache });
    band.push({ g: t.key, k1, eta, e, eps, rho: r1.rho, rho2: r2.rho, rho4: r4.rho, d12: Math.abs(r1.rho - r2.rho), d24: Math.abs(r2.rho - r4.rho), p12: Math.abs(r1.dPoverP - r2.dPoverP) });
  }
  // 還元の和(第333便c の binaryNumeric —— 相対の軌道に還元した G_loc と K1 の別々の計算の和)
  const reduced = [], RS = G.reducedSubset;
  for (const t of G.gTypes) for (const k1 of G.k1) for (const eta of G.eta) for (const e of RS.e) for (const eps of RS.eps) {
    const r = rows.find((q) => q.g === t.key && q.k1 === k1 && q.eta === eta && q.e === e && q.eps === eps), red = L.reducedShare(t, k1, eta, e, eps);
    // 交差の項(同時発展の中で G_loc と K1 を同時に入れた分担 − G_loc だけ − K1 だけ —— 同じ定義どうし)
    const gOnly = rows.find((q) => q.g === t.key && q.k1 === false && q.eta === eta && q.e === e && q.eps === eps), kOnly = k1 ? k1OnlyOf(e, eps, cache) : null;
    reduced.push({ g: t.key, k1, eta, e, eps, share: r.share, reduced: red, first: r.rho1 + 1, diff: r.share - red, diffFirst: r.share - (r.rho1 + 1), cross: k1 ? r.share - gOnly.share - kOnly : null });
  }
  return { rows, band, reduced, bandMax: Math.max(...band.map((q) => Math.max(q.d12, q.d24))) };
}

const K1ONLY = new Map();
/** K1 だけ(G_loc なし)の同時発展の分担(相対の軌道は η に依らない —— η = 0.25 で走らせる) */
function k1OnlyOf(e, eps, cache) {
  const key = e + '|' + eps;
  if (!K1ONLY.has(key)) K1ONLY.set(key, L.twoBody({ eta: 0.25, e, eps, g: null, k1: true, offCache: cache }).share);
  return K1ONLY.get(key);
}
/** 走行の後の読み(判定に使わない —— 二次の項の形の記述): δ = ρ − ρ₁ の ε の傾き(1e-6 → 1e-4)と δ/ε の e・η の依存 */
export function partShape(GR) {
  const G = L.DECL.grid, out = [];
  for (const t of G.gTypes) for (const k1 of G.k1) for (const eta of [1e-6, 0.25]) {
    const pick = (e, eps) => GR.rows.find((q) => q.g === t.key && q.k1 === k1 && q.eta === eta && q.e === e && q.eps === eps);
    out.push({ g: t.key, k1, eta, perE: [0.1, 0.3, 0.6].map((e) => { const a = pick(e, 1e-6), b = pick(e, 1e-4);
      return { e, dRhoOverEps: a.dRho / 1e-6, epsSlope: Math.log(Math.abs(b.dRho) / Math.abs(a.dRho)) / Math.log(100) }; }) });
  }
  return { rows: out, note: '走行の後の読み —— 判定に使わない(族は走行の前の宣言のまま)。δ/ε の e と η の依存は次の便の族の候補を宣言する材料' };
}

/* ───────── Y 系の表 ───────── */
export function partSystems(BK) {
  return PLAN.books.map((s) => { const y = BK[s.id]; return { id: s.id, ja: s.ja, role: s.role, eta: y.eta, e: y.e, eps: y.eps, q: y.q, geoPN: y.geoPN, spins: y.spins, rotRatio: y.rotRatio,
    linear: y.rotRatio.every((x) => x <= L.DECL.tilt.linearMax), rho1Now: (4 / 3) * y.eta, apsDefined: y.e >= L.DECL.law.eMin }; });
}

/* ───────── L 残差の法則 ───────── */
export function partLaw(GR, BK) {
  const LW = L.DECL.law, G = L.DECL.grid, out = [];
  const vSys = LW.verify.map((id) => BK[id]).filter((y) => y.e >= LW.eMin), dSys = LW.design.filter((id) => id !== 'grid').map((id) => BK[id]).filter((y) => y.e >= LW.eMin);
  for (const t of G.gTypes) for (const k1 of G.k1) {
    const pts = GR.rows.filter((q) => q.g === t.key && q.k1 === k1 && q.e > 0).map((q) => ({ eta: q.eta, e: q.e, eps: q.eps, rho: q.rho }));
    const runSys = (y) => { const epsRun = Math.max(y.eps, LW.epsFloor), r = gridRow(t.key, k1, y.eta, y.e, epsRun); return { id: y.id, eta: y.eta, e: y.e, eps: epsRun, epsBook: y.eps, rho: r.rho, rho1: r.rho1 }; };
    const vpts = vSys.map(runSys), dpts = dSys.map(runSys);
    const band = Math.max(...GR.band.filter((q) => q.g === t.key && q.k1 === k1).map((q) => Math.max(q.d12, q.d24)));
    const fams = LW.families.map((f) => { const fit = L.fitFamily(f, pts), J = L.judgeFamily(fit, vpts), Jd = L.judgeFamily(fit, dpts), tc = L.termContrib(fit, pts);
      const newTerms = Object.fromEntries(Object.entries(tc).map(([k, v]) => [k, { contrib: v, present: v > LW.termSig && v > LW.bandFactor * band }]));
      return { key: f.key, coef: fit.coef, maxRes: fit.maxRes, rms: fit.rms, law: J.law, verify: J.rows, designCheck: Jd.rows, newTerms }; });
    const lawFam = fams.find((f) => f.law);
    out.push({ g: t.key, k1, combo: comboKey(t.key, k1), first: { c0: L.firstShare(t, k1, 0) - 1, c1: L.firstShare(t, k1, 0.25) * 4 - L.firstShare(t, k1, 0) * 4 }, band, fams,
      lawKey: lawFam ? lawFam.key : null, newTermsPresent: lawFam ? Object.entries(lawFam.newTerms).filter(([, v]) => v.present).map(([k]) => k) : null, vpts, dpts });
  }
  return { combos: out, verifyIds: vSys.map((y) => y.id), designIds: dSys.map((y) => y.id), skipped: LW.verify.filter((id) => BK[id].e < LW.eMin) };
}

/* ───────── T 傾いた自転軸 ───────── */
export function partTilt() {
  const T = L.DECL.tilt, g = gOf(T.gType), cache = new Map(), rows = [];
  const base = L.twoBody({ eta: T.eta, e: T.e, eps: T.eps, g, k1: true, offCache: cache });
  for (const [sk, mag] of Object.entries(T.spins)) {
    const zero = L.twoBody({ eta: T.eta, e: T.e, eps: T.eps, g, k1: true, spins: L.spinPair('both', 0, mag), offCache: cache });
    for (const pair of T.pairs) for (const th of T.tiltDeg) {
      const R = th === 0 ? zero : L.twoBody({ eta: T.eta, e: T.e, eps: T.eps, g, k1: true, spins: L.spinPair(pair, th, mag), offCache: cache });
      rows.push({ spin: sk, overN: mag, pair, tiltDeg: th, rho: R.rho, dRho: R.rho - base.rho, tiltRate: R.tiltRate, tiltRateOverQ1: R.tiltRate / R.q1, dPoverP: R.dPoverP, dPdiff: R.dPoverP - base.dPoverP, de: R.de });
    }
  }
  const cross = [];
  for (const sk of Object.keys(T.spins)) for (const pair of T.pairs) {
    const rr = rows.filter((q) => q.spin === sk && q.pair === pair), zs = L.zeroCrossings(rr.map((q) => q.tiltDeg), rr.map((q) => q.rho));
    cross.push({ spin: sk, pair, zeros: zs, inPlutoRange: sk === 'sync' ? zs.some((z) => z <= PLAN.tiltLit.plutoCharon.maxDeg) : null });
  }
  return { base: { rho: base.rho, dPoverP: base.dPoverP, tiltRate: base.tiltRate, rho1: L.firstShare(g, true, T.eta) - 1 }, rows, cross };
}

/* ───────── P 冥王星–カロン ───────── */
export function partPluto(BK, GR) {
  const y = BK.plutoCharonInertialFit, yd = BK.plutoCharonDiagInput, LW = L.DECL.law;
  const sync = L.syncCase({ q: y.q, phase: 0.7, recv: 1, selfRatio: 1 }), syncE = L.syncCase({ q: y.q, phase: 0.7, recv: 1, selfRatio: 1, op: { e: 2e-4 } });
  // 周期への効き: 格子の e = 0・ε = 1e-8 の行の ΔP/P ÷ ε(一次 —— ε に比例する宣言)× 本の ε
  const per = GL_PERIOD_KEYS.map((ck) => { const [gk, k] = ck; const r = GR.rows.filter((q) => q.g === gk && q.k1 === k && q.e === 0 && q.eps === 1e-8);
    const near = r.reduce((a, q) => (Math.abs(q.eta - y.eta) < Math.abs(a.eta - y.eta) ? q : a), r[0]);
    return { combo: comboKey(gk, k), etaGrid: near.eta, dPoverPperEps: near.dPoverP / 1e-8, dPoverP: near.dPoverP / 1e-8 * y.eps, dPs: near.dPoverP / 1e-8 * y.eps * (y.fitRecord ? y.fitRecord.obs : NaN) }; });
  return { eta: y.eta, e: y.e, eps: y.eps, q: y.q, spinOverN: y.spins.map((s) => s.overN), diagEta: yd.eta, diagE: yd.e, syncD: sync.dNorm, syncSlip: sync.slipNorm, eccD: syncE.dNorm,
    rho1: { now: (4 / 3) * y.eta, sym2: 1 / 3, sym4: 0, recvM3: -2 * y.eta, symM6: 0 }, apsDefined: y.e >= LW.eMin, period: per, fitRecord: y.fitRecord, quote: PLAN.plutoQuote };
}
const GL_PERIOD_KEYS = [['recv2', true], ['recv2', false], ['sym4', true], ['recvM3', false]];

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = L.DECL.grid, S = J.sync, B = J.grid;
  const nGrid = G.gTypes.length * G.k1.length * G.eta.length * G.e.length * G.eps.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    syncNull: S.null.maxD <= L.DECL.sync.nullTol && S.null.maxSlip <= L.DECL.sync.nullTol && S.cov.rotRel <= 1e-12 && S.cov.frameRel <= 1e-12,
    syncCounter: S.ops.every((q) => q.maxD >= L.DECL.sync.counterMin),
    grid: B.rows.length === nGrid && B.rows.every((q) => (q.e === 0 ? q.rho === null : Number.isFinite(q.rho)) && Number.isFinite(q.dPoverP)),
    testParticle: B.rows.filter((q) => q.eta === 1e-6 && q.e > 0 && q.eps <= 1e-6).every((q) => Math.abs(q.dRho) <= 2e-3),
    band: B.bandMax <= 1e-6,
    reduced: B.reduced.filter((q) => q.eps === 1e-6).every((q) => Math.abs(q.diff) <= 1e-3) && B.reduced.filter((q) => q.cross !== null).every((q) => Math.abs(q.cross) <= 1e3 * q.eps),
    cmKick: B.rows.filter((q) => q.g.startsWith('recv') && q.e > 0 && q.eta > 1e-6 && q.eta < 0.25 && q.eps <= 1e-6).every((q) => Math.abs(q.vcm / q.vcmFirst - 1) <= 1e-2),
    momentum: B.rows.filter((q) => q.g.startsWith('sym')).every((q) => q.cm <= 1e-10) && B.rows.filter((q) => q.g.startsWith('recv') && q.eta === 0.25).every((q) => q.cm <= 1e-10),
    law: J.law.combos.length === G.gTypes.length * G.k1.length && J.law.verifyIds.length >= 3,
    tilt: J.tilt.rows.length === Object.keys(L.DECL.tilt.spins).length * L.DECL.tilt.pairs.length * L.DECL.tilt.tiltDeg.length && J.tilt.rows.every((q) => Number.isFinite(q.rho)),
    pluto: J.pluto.syncD <= L.DECL.sync.nullTol && J.pluto.eccD > 0 && Math.abs(J.pluto.eta - 0.0969) <= 5e-4,
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { gates: L.pureGates(PS), order: PS.order }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const sync = partSync(); mark('sync');
  const grid = partGrid(); mark('grid');
  const shape = partShape(grid); mark('shape');
  const systems = partSystems(BK); mark('systems');
  const law = partLaw(grid, BK); mark('law');
  const tilt = partTilt(); mark('tilt');
  const pluto = partPluto(BK, grid); mark('pluto');
  const J = { pure, systems, sync, grid, shape, law, tilt, pluto, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W334D_TARGET || 'beta/index.html';
  const OUT = process.env.W334D_OUT ? (path.isAbsolute(process.env.W334D_OUT) ? process.env.W334D_OUT : path.join(ROOT, process.env.W334D_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第334便d binarylaw(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w334d-binarylaw.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の整理(2026-11-11)「連星について —— 新しい引きずりや、傾いた自転軸でのフィットなどを検証する」「冥王星とカロンが、連星のヒントになると想定」「合わなくても、合わない量に法則性が見付かれば、進展したとする」・原仮定者の回答(2026-11-11 —— AN637)連星の残差は残す・η の依存を成果として記録・原仮定者の回答(2026-11-11 —— AN634)二体の同時発展の小さな診断・原仮定者の回答(2026-11-11 —— AN624)s_d は J を表す等価なパラメータ・統括の検証項目 R325',
    decl: L.DECL, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w334d-binarylaw.mjs', 'tests/lib-w334d-binarylaw.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w330b-dragweight.mjs',
    'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第334便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'binarylaw', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・連星と冥王星–カロンの本 10 本の宣言の値を読む(步を進めない)・純関数(lib —— 二体の同時発展の RK4)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第326便d(原仮定者の指示(第128報)「軸引きずりについて」4 項・「引きずり計算の補足」・統括の検証項目 R293): **軸引きずりの定常の釣り合いと由来ごとの熱の帳簿の器**
//   (段 axialheat-326d —— 正本 tests/out/axialheat-w326d.json・lib tests/lib-w326d-axialheat.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器は変えない(写しにだけ宣言を足す)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build と読み口 inertialDragIsqState〔perSource の選択〕
//   をそのまま呼ぶ —— K1 の核の式を写さない)。入力は html だけ(他の正本・データは読まない)。1 プロセス(子プロセスなし)。
//
// ■ 何をするか(入力は在位の 🗺️ solarSystem16Inertial3d の J2000 の転記 —— 新たに一次資料を取らない)
//   I 入力: 太陽・金星・地球・月・木星・イオ・土星・タイタンの質量・半径・符号つきの自転・自転軸(宣言の傾きと方位)・R_d(規則 R_d = Y_k m の読み口)・起潮天体に対する接触の二体の公転の角速度
//   K 今の K1 の核の源ごとの軸の ω_ij(🗺️ の写しに spinDrag {axial:"on", axialModel:"bevel"} —— 第320便a の器の写しと同じ型)→ 伝達 t_ij = ω_ij/s_j。R_src の 2 列(今 R_src = R_d・J〔太陽 0.07・木星 0.254〕)
//   S 解く(族 E —— 由来ごとに同じ応答・潮汐の応答 k_i は天体ごとの未知): 太陽の式から銀河の局所場の大きさ A(向きは ĝ)・各天体の式から k_i。p の格子ごとの解・ランク・Γ ≥ 0 の採否
//   G Γ に依らない判定(凸包 —— 観測の自転が口の目標の間に無ければどの Γ ≥ 0 でも定常にならない)と p の範囲
//   H 熱の表と帳簿(太陽–木星–イオが族 E で入る格子の点のうち 0 に最も近い p): 口ごとの熱・トルク・供給・源の反作用・固定軸の支え・銀河の供給 + 軌道の仕事 = 熱 = 放射・L の口座
//   V 金星: 不採用の解(k < 0 —— 負の散逸)・K1 の太陽の項に要る倍率(Γ に依らない下限と族 E の下限 —— 採らない)・条件つきの写しの熱(逆向きの源が熱を足す)
//   C 地球と土星の検査(合わせない —— 凸包の p の範囲と族 E の k)
//   N 否定対照(統括の参考の試作の型を今のコードで書き直す): 恒等の伝達(源の自転そのものを目標に)・自由なベクトルの銀河場(3 成分)・応答の尺度の倍率
//   R 引きずりの半径: 受け手の R_d と源の R_src を天体ごとに別々に宣言できるか(写しで確かめる —— 受理・読み口・β と R_d のビット・ω の比)と画面の経路
//   P 純関数の場面(lib の pureScenes —— QA lint.axialHeat326d と同じ)
// ■ 言わないこと: 内部熱・金星の逆回転を説明したとは書かない・銀河場を同定したと数えない・応答の尺度 Γ は宣言の模型のノブ(熱の大きさを観測の熱流に合わせない)・
//   負の散逸を要求する解を 0 へ丸めない・解いた数を条件と残差なしに結論にしない・地球と土星で合わせない・K1 の倍率の列は要る大きさの記録(K1 は固定)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { galaxyAxis } from './lib-w319a-axisheat.mjs';
import * as L from './lib-w326d-axialheat.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— roots の ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・
//   tests/lib-w279b-headless.mjs の綴りが数えられた分。presets は器が .find で引く在位の本 1 本だけ)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","ctx","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w326d-axialheat-1';
export const OUT_MAIN = 'tests/out/axialheat-w326d.json';
export const BOOK_ID = 'solarSystem16Inertial3d';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const NOT_CLAIM = Object.freeze(['内部熱を説明したとは書かない', '金星の逆回転を説明したとは書かない', '銀河場を同定したと数えない(条件つきの解・残差・不成立の条件を並べる)',
  '応答の尺度 Γ は宣言の模型のノブ —— 内部熱を観測の熱流に合わせていない', '負の散逸を要求する解は不採用(0 へ丸めない)', '地球と土星は検査だけ(合わせていない)',
  'K1 の倍率の列は要る大きさの記録(太陽と木星の核は今の K1 に固定 —— 新しい係数にしない)', '恒星の点火は同じ帳簿の応用(本便は解かない)']);
/** 天体の鍵 → 🗺️ の添字 */
export const IDX = Object.freeze({ sun: 0, venus: 2, earth: 3, moon: 4, jupiter: 6, io: 7, saturn: 11, titan: 12 });
export const NAME_JA = Object.freeze({ sun: '太陽', venus: '金星', earth: '地球', moon: '月', jupiter: '木星', io: 'イオ', saturn: '土星', titan: 'タイタン' });
const SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違える)
/** 潮汐の目標の公転(受け手 → [中心, 回る天体] —— 起潮天体 j に対する受け手 i の相対の公転の角速度。i が j を回るか j が i を回るかで同じベクトル) */
const ORBIT_OF = (recv, raiser) => ({ 'venus:sun': ['sun', 'venus'], 'jupiter:sun': ['sun', 'jupiter'], 'jupiter:io': ['jupiter', 'io'], 'io:jupiter': ['jupiter', 'io'],
  'earth:sun': ['sun', 'earth'], 'earth:moon': ['earth', 'moon'], 'saturn:sun': ['sun', SAT], 'saturn:titan': [SAT, 'titan'] })[recv + ':' + raiser];
export const SRC_F = Object.freeze({ 0: 0.07, 6: 0.254 });   // 源の慣性係数 f_src(第320便a の lib の MOI16 と同じ値 —— 文献の値・本便は一次資料に当たっていない)

/* ───────── 写しと読み口 ───────── */
export function copyBook(HP, o = {}) {
  const b = clone(HP.allPresets().find((p) => p.id === BOOK_ID));
  b.id = BOOK_ID + '_w326d'; b.description = '器の写し(内蔵ではない —— 第326便d)';
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } });
  if (o.sm) b.physics.relativeDrag.invSq = Object.assign(clone(b.physics.relativeDrag.invSq), { sourceMoment: clone(o.sm) });
  if (o.dragCore) for (const [k, v] of Object.entries(o.dragCore)) b.bodies[Number(k)].dragCore = clone(v);
  if (o.obsSpin) for (const [k, v] of Object.entries(o.obsSpin)) b.bodies[Number(k)].obsSpin = clone(v);
  return b;
}
export function stateOf(HP, book) {
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { ok: false, err: JSON.stringify(v.errors).slice(0, 400) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { ok: true, S, preset: v.preset, isq: HP.inertialDragIsqState(S, { perSource: true }) };
}
const axisOfDecl = (b) => { const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
/** 二体の接触の公転の角速度ベクトル(本の状態 —— SI の rad/s) */
function orbitOmega(book, ci, oi, uT) {
  const a = book.bodies[ci], b = book.bodies[oi], r = [b.x - a.x, b.y - a.y, b.z - a.z], v = [b.vx - a.vx, b.vy - a.vy, b.vz - a.vz];
  const h = L.cross(r, v), mu = book.physics.G * (a.m + b.m), sma = 1 / (2 / L.norm(r) - L.dot(v, v) / mu), n = Math.sqrt(mu / (sma * sma * sma)) / uT;
  return L.scale(h, n / L.norm(h));
}

/* ───────── I・K 入力と K1 の伝達 ───────── */
export function partI(HP) {
  const st = stateOf(HP, copyBook(HP)), book = st.preset, se = book.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M);
  const rdB = st.isq.rdRule.bodies, bodies = {};
  for (const [key, i] of Object.entries(IDX)) {
    const b = book.bodies[i], a = axisOfDecl(b), aE = [st.S.sax[i], st.S.say[i], st.S.saz[i]], Rd = rdB.find((q) => q.i === i).Rd * uL;
    bodies[key] = { key, i, name: NAME_JA[key], m: b.m * uM, R: b.radius * uL, s: b.spin / uT, a, axisEngineAngDeg: L.angDeg(a, aE), Rd, moi: L.MOI[key] || null,
      I: L.MOI[key] ? L.MOI[key] * b.m * uM * Math.pow(b.radius * uL, 2) : null };
  }
  const tides = {};
  for (const [recv, P] of Object.entries(L.DECL.ports)) for (const raiser of P.tide) { const [c, o] = ORBIT_OF(recv, raiser); tides[recv + ':' + raiser] = orbitOmega(book, IDX[c], IDX[o], uT); }
  const ga = galaxyAxis();
  return { units: { lenSI: uL, timeSI: uT, massSI: uM }, bodies, tides, g: ga.g, OmRefSI: ga.OmRefSI, gamma0Unit: 'Γ_i⁰ τ_0 = I_i [kg m²](τ_0 は宣言のノブ)', st };
}
/** K1 の伝達 t_ij(源の単位の自転あたりの ν —— SI)。variant: 'now'(R_src = R_d)・'J'(sourceMoment J —— 太陽 0.07・木星 0.254) */
export function partK(HP, I, variant) {
  const st = variant === 'J' ? stateOf(HP, copyBook(HP, { sm: { kind: 'J', f: SRC_F } })) : stateOf(HP, copyBook(HP));
  if (!st.ok) return { ok: false, err: st.err };
  const uT = I.units.timeSI, t = {}, om = {};
  for (const [recv, P] of Object.entries(L.DECL.ports)) for (const src of P.k1) {
    const i = IDX[recv], j = IDX[src], r = st.isq.receivers.find((q) => q.i === i), w = r.omegaSrc.slice(j * 4, j * 4 + 3), sj = st.S.spin[j];   // 状態の自転(エンジンの配列)で割る —— ω は s_j に一次
    om[recv + ':' + src] = { omegaSI: w.map((q) => q / uT), signed: r.omegaSrc[j * 4 + 3] / uT, along: L.dot(w, I.bodies[recv].a) / uT };
    t[recv + ':' + src] = w.map((q) => q / sj);   // 本の角速度 / 本の角速度 —— 無次元(ν = s_j t は SI のまま)
  }
  const sm = st.isq.sourceMoment ? st.isq.sourceMoment.bodies.filter((q) => q.applied).map((q) => ({ i: q.i, Rd: q.Rd * I.units.lenSI, Rsrc: q.Rsrc * I.units.lenSI, momentFactor: q.momentFactor })) : [];
  return { ok: true, variant, t, omega: om, sourceMoment: sm };
}
/** 系を組む(lib の evaluate の形)。keys: 方程式の天体の鍵の列 */
export function systemOf(I, K, keys) {
  return keys.map((key) => {
    const b = I.bodies[key], P = L.DECL.ports[key], ports = [{ kind: 'gal' }];
    for (const src of P.k1) ports.push({ kind: 'k1', src, t: K.t[key + ':' + src] });
    for (const raiser of P.tide) ports.push({ kind: 'tide', src: raiser, n: I.tides[key + ':' + raiser] });
    return { key, s: b.s, a: b.a, Rd: b.Rd, ports };
  });
}
/** 源の天体(k1 の src)が方程式に無いときは源の自転を宣言の値で置く(反作用の天体が系に無い —— 検査の天体だけ) */
function withSources(I, sys) {
  const have = new Set(sys.map((b) => b.key)), extra = [];
  for (const b of sys) for (const q of b.ports) if (q.kind === 'k1' && !have.has(q.src)) { have.add(q.src); extra.push({ key: q.src, s: I.bodies[q.src].s, a: I.bodies[q.src].a, Rd: I.bodies[q.src].Rd, ports: [{ kind: 'gal' }] }); }
  return extra.concat(sys);
}
export function paramsOf(I, p, extra = {}) {
  const gamma0 = Object.fromEntries(Object.values(I.bodies).filter((b) => b.I).map((b) => [b.key, b.I]));
  return Object.assign({ ref: 'sun', p, g: I.g, gamma0, cGalaxy: L.DECL.cGalaxy, cK1: L.DECL.cK1, k: {} }, extra);
}

/* ───────── S・G 解く ───────── */
export function solveAt(I, K, keys, p, extra = {}) {
  const sys = withSources(I, systemOf(I, K, keys)), prm = paramsOf(I, p, extra), sol = L.solveFamilyE(sys, prm);
  const ev = L.evaluate(sys, Object.assign({}, prm, { A: sol.A, k: sol.k }));
  return { p, A: sol.A, k: sol.k, rows: sol.rows, accepted: sol.accepted, lin: sol.lin, ev, sys, prm };
}
/** ランク: 固定の p で未知 (A, k_V, k_J, k_Io) の 4×4・p も未知にした 4×5(数値の微分 —— 列を単位の長さに揃える) */
export function rankAt(I, K, p) {
  const keys = L.DECL.solveBodies, base = solveAt(I, K, keys, p), lin = base.lin, nk = keys.filter((k) => k !== 'sun');
  const M4 = keys.map((key) => { const r = lin.find((q) => q.key === key); return [r.cA].concat(nk.map((k) => (k === key ? r.ck : 0))); });
  const dp = 1e-6, lin2 = solveAt(I, K, keys, p + dp).lin;
  const M5 = keys.map((key, ix) => { const r = lin.find((q) => q.key === key), r2 = lin2.find((q) => q.key === key), A = base.A, kk = base.k[key] || 0;
    const res = (q) => q.cA * A + q.ck * kk + q.c0; return M4[ix].concat([(res(r2) - res(r)) / dp]); });
  return { fixedP: L.rankOf(M4), withP: L.rankOf(M5), scale: '応答の絶対の尺度(全 Γ を λ 倍)は解を変えない —— 自転の定常値だけでは同定できない方向(部 N の scale)' };
}
/** Γ に依らない凸包の判定(天体ごと —— 銀河の目標は A f_i(p) g_i で動く・他の目標は固定) */
export function hullAt(I, K, key, A, p) {
  const b = I.bodies[key], P = L.DECL.ports[key], fixed = [];
  for (const src of P.k1) fixed.push(I.bodies[src].s * L.dot(K.t[key + ':' + src], b.a));
  for (const raiser of P.tide) fixed.push(L.dot(I.tides[key + ':' + raiser], b.a));
  const g = L.dot(I.g, b.a), x = b.Rd / I.bodies.sun.Rd, G = A * Math.pow(x, p) * g, hull = L.hullOf(b.s, fixed.concat([G]));
  const bound = fixed.length ? L.hullPBound({ s: b.s, fixed, Ag: A * g, x }) : { kind: 'exact', p: null };
  return { key, s: b.s, g, x, G, fixed, inside: hull.inside, lo: hull.lo, hi: hull.hi, bound };
}
export function partS(I, K) {
  const keys = L.DECL.solveBodies, grid = L.DECL.pGrid.map((p) => {
    const r = solveAt(I, K, keys, p);
    return { p, A: r.A, k: Object.fromEntries(keys.filter((k) => k !== 'sun').map((k) => [k, r.k[k]])), rejected: r.rows.filter((q) => q.rejected).map((q) => q.key),
      sjiAccepted: ['jupiter', 'io'].every((k) => r.rows.find((q) => q.key === k).rejected === false), alongMaxRel: Math.max(...r.ev.rows.map((q) => q.alongRel)) };
  });
  const A0 = grid[0].A;
  // 族 E の p の端(天体ごと —— k_i = 0 の p)と Γ に依らない端
  const r0 = solveAt(I, K, keys, 0), edges = {};
  for (const key of keys.filter((k) => k !== 'sun')) {
    const b = I.bodies[key], row = r0.lin.find((q) => q.key === key), g = L.dot(I.g, b.a), x = b.Rd / I.bodies.sun.Rd;
    const eE = L.familyEPBound({ row, Ag: A0 * g, x, cGalaxyGamma0: I.bodies[key].I * L.DECL.cGalaxy }), eH = hullAt(I, K, key, A0, 0).bound;
    edges[key] = { familyE: eE, hull: eH };
  }
  const ranks = rankAt(I, K, -0.75);
  const sr = r0.ev.rows.find((q) => q.key === 'sun');
  const sunExact = { A: A0, AOverOmRef: A0 / I.OmRefSI, gDotSun: L.dot(I.g, I.bodies.sun.a), alongRel: sr.alongRel, reactionRel: Math.abs(sr.reaction) / sr.alongScale,
    AWithoutReaction: I.bodies.sun.s / L.dot(I.g, I.bodies.sun.a), AReactionRel: L.relD(A0, I.bodies.sun.s / L.dot(I.g, I.bodies.sun.a)) };
  return { grid, edges, ranks, sunExact, AIndependentOfP: grid.every((q) => L.relD(q.A, A0) <= 1e-12) };
}

/* ───────── H 熱の表と帳簿 ───────── */
function portRows(ev) {
  return ev.rows.map((R) => ({ key: R.key, s: R.s, heat: R.heat, alongResidual: R.alongResidual, alongRel: R.alongRel, reaction: R.reaction, holdNorm: L.norm(R.hold), holdWork: R.holdWork, sumAbsAlong: R.sumAbsAlong,
    ports: R.ports.map((q) => ({ kind: q.kind, src: q.src, nuAlong: q.nuAlong, nuNorm: L.norm(q.nu), Gamma: q.Gamma, torqueAlong: q.torqueAlong, torqueNorm: L.norm(q.torque), heat: q.heat, supply: q.supply,
      negative: q.negative, drawFromSrc: q.drawFromSrc === undefined ? null : q.drawFromSrc, reactionSrc: q.reactionSrc === undefined ? null : q.reactionSrc })) }));
}
export function partH(I, K, S) {
  const acc = S.grid.filter((q) => q.sjiAccepted).map((q) => q.p);
  const pHeat = acc.length ? Math.max(...acc) : null;
  if (pHeat === null) return { pHeat: null, why: '太陽–木星–イオが族 E で入る格子の点が無い' };
  const keys = ['sun', 'jupiter', 'io'], r = solveAt(I, K, keys, pHeat), lam = L.DECL.scaleLambda;
  const prm2 = Object.assign({}, r.prm, { A: r.A, k: r.k, gamma0: Object.fromEntries(Object.entries(r.prm.gamma0).map(([k, v]) => [k, v * lam])) }), ev2 = L.evaluate(r.sys, prm2);
  const ld = r.ev.ledger;
  const eJ = S.edges.jupiter.familyE;
  return { pHeat, pJupiterEdge: eJ.kind === 'le' ? eJ.p : null, rule: '族 E で太陽–木星–イオが入る格子の点のうち 0 に最も近い p(格子は走行の前の宣言)', A: r.A, k: { jupiter: r.k.jupiter, io: r.k.io },
    rows: portRows(r.ev), ledger: { galaxySupply: ld.galaxySupply, orbitWork: ld.orbitWork, k1Draw: ld.k1Draw, heat: ld.heat, radiation: ld.radiation, spinPower: ld.spinPower, residualRel: ld.residualRel,
      k1TransferRel: L.relD(ld.k1Transfer.draw, ld.k1Transfer.sourceReactionWork), portCloseMaxRel: ld.portCloseMaxRel, LTotalRel: ld.L.totalRel,
      LGalaxyCenter: L.norm(ld.L.galaxyCenter), LOrbits: L.norm(ld.L.orbits), LFarFrameHold: L.norm(ld.L.farFrameHold), LFarFrameK1: L.norm(ld.L.farFrameK1) },
    scale: { lambda: lam, heatRatio: ev2.ledger.heat / ld.heat, alongMaxRel: Math.max(...ev2.rows.map((q) => q.alongRel)) },
    holdWorkMaxRel: Math.max(...r.ev.rows.map((q) => Math.abs(q.holdWork) / Math.max(q.heat, 1e-300))), allGammaNonNeg: r.ev.rows.every((q) => q.ports.every((z) => !z.negative)) };
}

/* ───────── V 金星 ───────── */
/** 太陽–金星の系で、金星の k1 の口(太陽の K1 の項)に倍率 λ を掛けたときの族 E の k_V ≥ 0 の λ の区間。
 *  太陽の式は源の反作用 R_☉(λ) = −λ t·N_V(λ)(N_V = Γ_V c_K1(λ s_☉ t − Ω_V))を含む —— A(λ) = −(c0_☉ + R_☉(λ))/cA_☉。
 *  金星の式の k を除いた分 F(λ) = cA_V A(λ) − Γ_V c_G s_V + Γ_V c_K1(λ s_☉ t·â_V − s_V) は λ の二次 a2 λ² + a1 λ + a0(a2 > 0)・k_V ≥ 0 ⟺ F(λ)·sign(−ck_V) ≥ 0 */
export function venusLambdaAt(I, K, p) {
  const r = solveAt(I, K, ['sun', 'venus'], p), lV = r.lin.find((q) => q.key === 'venus'), lS = r.lin.find((q) => q.key === 'sun'), b = I.bodies.venus, sS = I.bodies.sun.s;
  const t = K.t['venus:sun'], gV = b.I, OmV = L.scale(b.a, b.s), cK = L.DECL.cK1, cG = L.DECL.cGalaxy, c0S = -I.bodies.sun.I * cG * sS;   // 太陽の A = 0 の分(他の口は無い)
  const q = lV.cA / lS.cA, a2 = q * gV * cK * sS * L.dot(t, t), a1 = -q * gV * cK * L.dot(t, OmV) + gV * cK * sS * L.dot(t, b.a), a0 = -q * c0S - gV * (cG + cK) * b.s;
  const sg = Math.sign(-lV.ck), disc = a1 * a1 - 4 * a2 * a0, rr = sg < 0 ? L.quadRoots(a2, a1, a0) : null;
  const lo = rr ? rr[0] : null, hi = rr ? rr[1] : null;   // F ≤ 0 の区間(根の間 —— a2 > 0)
  const tS = sS * L.dot(t, b.a);
  return { p, a2, a1, a0, disc, sign: sg, lo, hi, exists: lo !== null && hi > 0, tS, lambdaHullMin: b.s / tS, kAtOne: r.k.venus, rejectedAtOne: r.rows.find((z) => z.key === 'venus').rejected };
}
export function partV(I, K, H) {
  const pH = H.pHeat === null ? 0 : H.pHeat, grid = L.DECL.pGrid.map((pp) => {
    const q = solveAt(I, K, ['sun', 'venus'], pp), lam = venusLambdaAt(I, K, pp);
    return { p: pp, k: q.k.venus, rejected: q.rows.find((z) => z.key === 'venus').rejected, inside: hullAt(I, K, 'venus', q.A, pp).inside, lambdaLo: lam.lo, lambdaHi: lam.hi, lambdaExists: lam.exists };
  });
  const r = solveAt(I, K, ['sun', 'venus'], pH), lamH = venusLambdaAt(I, K, pH);
  // λ の区間が在る p の端(族 E —— 判別式の符号が変わる p を二分法で。格子の隣り合う点で有無が変わる所)
  let pEdge = null;
  for (let k = 0; k + 1 < grid.length; k++) if (grid[k].lambdaExists !== grid[k + 1].lambdaExists) {
    let a = grid[k].p, c = grid[k + 1].p; const ea = grid[k].lambdaExists;
    for (let it = 0; it < 60; it++) { const m = 0.5 * (a + c); if (venusLambdaAt(I, K, m).exists === ea) a = m; else c = m; }
    pEdge = { p: 0.5 * (a + c), existsBelow: ea };
  }
  // 条件つきの写し: λ の区間がある格子の点のうち p_heat に最も近い点・λ は区間の幾何平均(走行の前の規則)
  const cand = grid.filter((q) => q.lambdaExists && q.lambdaLo > 0).sort((a, c) => Math.abs(a.p - pH) - Math.abs(c.p - pH) || a.p - c.p)[0] || null;
  let conditional = null;
  if (cand) {
    const lamUse = Math.sqrt(cand.lambdaLo * cand.lambdaHi), rc = solveAt(I, K, ['sun', 'venus'], cand.p, { k1Mul: { 'venus:sun': lamUse } }), vr = rc.ev.rows.find((q) => q.key === 'venus');
    conditional = { p: cand.p, lambda: lamUse, lambdaLo: cand.lambdaLo, lambdaHi: cand.lambdaHi, A: rc.A, k: rc.k.venus, accepted: rc.rows.find((q) => q.key === 'venus').rejected === false,
      rows: portRows(rc.ev).filter((q) => q.key === 'venus'), ledgerRel: rc.ev.ledger.residualRel, netAlongRel: vr.alongRel, sumAbsAlong: vr.sumAbsAlong, netAlong: vr.alongResidual,
      ARatioToOne: rc.A / r.A };
  }
  // 族 E の窓: 金星に λ の区間が在る p(≥ 端)と木星が入る p(≤ 木星の端)の重なり。窓の中点で、金星の口だけに λ(区間の幾何平均)を掛けた場合と、
  //   同じ倍率を太陽の全部の k1 の口(金星・木星・イオ)に掛けた場合(太陽の核の倍率は受け手を選ばない —— r⁻³ の比は K1 のまま)の 4 天体の採否
  let window = null;
  const pJ = H.pJupiterEdge;
  if (pEdge && !pEdge.existsBelow && Number.isFinite(pJ) && pJ > pEdge.p) {
    const pm = 0.5 * (pEdge.p + pJ), lm = venusLambdaAt(I, K, pm), lam = Math.sqrt(lm.lo * lm.hi), keys = L.DECL.solveBodies;
    const one = solveAt(I, K, keys, pm, { k1Mul: { 'venus:sun': lam } }), all = solveAt(I, K, keys, pm, { k1Mul: { 'venus:sun': lam, 'jupiter:sun': lam, 'io:sun': lam } });
    const pick = (q) => ({ A: q.A, k: Object.fromEntries(['venus', 'jupiter', 'io'].map((z) => [z, q.k[z]])), rejected: q.rows.filter((z) => z.rejected).map((z) => z.key), accepted: q.accepted });
    window = { lo: pEdge.p, hi: pJ, width: pJ - pEdge.p, pMid: pm, lambda: lam, lambdaLo: lm.lo, lambdaHi: lm.hi, venusOnly: pick(one), allSunPorts: pick(all),
      jupiterSunTargetAll: I.bodies.sun.s * L.dot(K.t['jupiter:sun'], I.bodies.jupiter.a) * lam };
  }
  return { pHeat: pH, A: r.A, kRejected: r.k.venus, window, rejected: r.rows.find((q) => q.key === 'venus').rejected, rowsRejected: portRows(r.ev).filter((q) => q.key === 'venus'),
    sunTargetAlong: lamH.tS, lambdaHullMin: lamH.lambdaHullMin, lambdaAtPHeat: { lo: lamH.lo, hi: lamH.hi, exists: lamH.exists }, lambdaPEdge: pEdge, conditional, hull: hullAt(I, K, 'venus', r.A, pH), grid };
}

/* ───────── C 地球・土星(検査)───────── */
export function partC(I, K, S, H) {
  const A = S.sunExact.A, out = {};
  for (const key of L.DECL.checkBodies) {
    const hz = hullAt(I, K, key, A, 0), pH = H.pHeat === null ? 0 : H.pHeat, r = solveAt(I, K, ['sun', key], pH);
    out[key] = { s: I.bodies[key].s, hullBound: hz.bound, insideAtPHeat: hullAt(I, K, key, A, pH).inside, kAtPHeat: r.k[key], acceptedAtPHeat: r.rows.find((q) => q.key === key).rejected === false,
      grid: L.DECL.pGrid.map((pp) => { const q = solveAt(I, K, ['sun', key], pp); return { p: pp, k: q.k[key], rejected: q.rows.find((z) => z.key === key).rejected }; }) };
  }
  return out;
}

/* ───────── N 否定対照 ───────── */
export function partN(I, K) {
  // ① 恒等の伝達: k1 の口の目標を源の自転のベクトルそのもの(ν = Ω_src)に —— t = â_src(族 E・p = 0)
  const Kid = { t: {} };
  for (const k of Object.keys(K.t)) Kid.t[k] = I.bodies[k.split(':')[1]].a.slice();
  const id = solveAt(I, Kid, L.DECL.solveBodies, 0);
  // ② 自由なベクトルの銀河場(3 成分 —— 潮汐 0・族 E・k1 は今の K1): 太陽・金星・木星の軸の向きの 3 式 → イオは外して残差
  const sys = withSources(I, systemOf(I, K, L.DECL.solveBodies)), prm = paramsOf(I, 0, { k: { sun: 0, venus: 0, jupiter: 0, io: 0 } });
  const rowFor = (key) => {   // a·(Γ_G (ν − Ω)) + Σ_k1 + 反作用 = 0 → Γ_G a·ν = −(残り)
    const ev0 = L.evaluate(sys, Object.assign({}, prm, { A: 0 })), R = ev0.rows.find((q) => q.key === key), b = I.bodies[key], gG = b.I * L.DECL.cGalaxy;
    return { A: b.a.slice(), rhs: -R.alongResidual / gG };   // 行を Γ_G で割る(行の大きさを揃え、条件数を軸の幾何で読む)
  };
  const rs = ['sun', 'venus', 'jupiter'].map(rowFor), v = L.solveLinear(rs.map((q) => q.A), rs.map((q) => q.rhs)), io = rowFor('io');
  const rk = L.rankOf(rs.map((q) => q.A), 1e-9, false);   // 未知は同じ単位の 3 成分 —— 列を揃えない(条件数は軸の幾何)
  const free = { vector: v, norm: L.norm(v), angleToGDeg: L.angDeg(v, I.g), overOmSun: L.norm(v) / I.bodies.sun.s, ioResidualRel: (L.dot(io.A, v) - io.rhs) / Math.abs(io.rhs), rank: rk.rank, cond: rk.cond,
    axesSpreadDeg: Math.max(L.angDeg(I.bodies.sun.a, I.bodies.venus.a), L.angDeg(I.bodies.sun.a, I.bodies.jupiter.a), L.angDeg(I.bodies.venus.a, I.bodies.jupiter.a)) };
  // ③ 応答の尺度: 全 Γ を λ 倍 —— A・k は同じ・熱は λ 倍(部 H の scale と同じ型を p = 0 の全 4 天体で)
  const s0 = solveAt(I, K, L.DECL.solveBodies, 0), lam = L.DECL.scaleLambda, prm2 = paramsOf(I, 0), g2 = Object.fromEntries(Object.entries(prm2.gamma0).map(([k, q]) => [k, q * lam]));
  const s2 = L.solveFamilyE(s0.sys, Object.assign({}, prm2, { gamma0: g2 })), e2 = L.evaluate(s0.sys, Object.assign({}, prm2, { gamma0: g2, A: s2.A, k: s2.k }));
  const scaleRow = { lambda: lam, ARel: L.relD(s2.A, s0.A), kRelMax: Math.max(...Object.keys(s0.k).map((k) => L.relD(s2.k[k], s0.k[k]))), heatRatio: e2.ledger.heat / s0.ev.ledger.heat };
  return { identity: { A: id.A, k: Object.fromEntries(['venus', 'jupiter', 'io'].map((q) => [q, id.k[q]])), rejected: id.rows.filter((q) => q.rejected).map((q) => q.key) }, freeVector: free, scale: scaleRow };
}

/* ───────── R 引きずりの半径 ───────── */
const arrSame = (a, b) => a.length === b.length && a.every((q, k) => Object.is(q, b[k]));
export function partR(HP, html) {
  const u = (st) => st.preset.scaleExp, base = stateOf(HP, copyBook(HP));
  const recv = (st, i) => st.isq.receivers.find((q) => q.i === i), om = (st, i, j) => recv(st, i).omegaSrc.slice(j * 4, j * 4 + 3);
  const sameBetaRd = (a, b) => a.isq.receivers.every((q, k) => arrSame(q.beta, b.isq.receivers[k].beta) && Object.is(q.Rd, b.isq.receivers[k].Rd));
  const ratio = (a, b, i, j) => L.norm(om(b, i, j)) / L.norm(om(a, i, j));
  const rows = [];
  // R1 太陽だけ R_src(J・f 0.07): 受け手の R_d と β は同じビット・金星 ← 太陽の ω の比 = (R_src/R_d)²・イオ ← 木星は同じビット
  const s1 = stateOf(HP, copyBook(HP, { sm: { kind: 'J', f: { 0: 0.07 } } })), f1 = s1.isq.sourceMoment.bodies[0];
  rows.push({ key: 'R1', ja: '源の R_src を太陽だけ(sourceMoment J・f_src 0.07)', ok: s1.ok, betaRdSame: sameBetaRd(base, s1), RdSun: f1.Rd * 10 ** u(s1).L, RsrcSun: f1.Rsrc * 10 ** u(s1).L,
    momentFactor: f1.momentFactor, venusRatioRel: L.relD(ratio(base, s1, 2, 0), f1.momentFactor), ioFromJupiterSame: arrSame(om(base, 7, 6), om(s1, 7, 6)),
    pass: s1.ok && sameBetaRd(base, s1) && L.relD(ratio(base, s1, 2, 0), f1.momentFactor) <= 1e-5 && arrSame(om(base, 7, 6), om(s1, 7, 6)) });
  // R2 木星だけ R_src(f 0.254): イオ ← 木星の比 = 木星の (R_src/R_d)²・金星 ← 太陽は同じビット
  const s2 = stateOf(HP, copyBook(HP, { sm: { kind: 'J', f: { 6: 0.254 } } })), f2 = s2.isq.sourceMoment.bodies[6];
  rows.push({ key: 'R2', ja: '源の R_src を木星だけ(f_src 0.254)', ok: s2.ok, betaRdSame: sameBetaRd(base, s2), RdJup: f2.Rd * 10 ** u(s2).L, RsrcJup: f2.Rsrc * 10 ** u(s2).L, momentFactor: f2.momentFactor,
    ioRatioRel: L.relD(ratio(base, s2, 7, 6), f2.momentFactor), venusFromSunSame: arrSame(om(base, 2, 0), om(s2, 2, 0)),
    pass: s2.ok && sameBetaRd(base, s2) && L.relD(ratio(base, s2, 7, 6), f2.momentFactor) <= 1e-5 && arrSame(om(base, 2, 0), om(s2, 2, 0)) });
  // R3 受け手の R_d を金星だけ別に(dragCore.radius = 2 R_d —— 天体ごとの宣言)+ 太陽の R_src(f 0.07): 金星の R_d が 2 倍・太陽の R_src は R1 と同じビット・他の受け手の R_d は同じビット
  const RdV = recv(base, 2).Rd, s3 = stateOf(HP, copyBook(HP, { sm: { kind: 'J', f: { 0: 0.07 } }, dragCore: { 2: { massFrac: 1, radius: 2 * RdV } } }));
  const f3 = s3.ok ? s3.isq.sourceMoment.bodies[0] : null;
  rows.push({ key: 'R3', ja: '受け手の R_d を金星だけ 2 倍(dragCore.radius —— 天体ごと)+ 太陽の R_src', ok: s3.ok, err: s3.ok ? null : s3.err,
    venusRdRatio: s3.ok ? recv(s3, 2).Rd / RdV : null, sunRsrcSameAsR1: s3.ok ? Object.is(f3.Rsrc, f1.Rsrc) : null,
    otherRdSame: s3.ok ? s3.isq.receivers.filter((q) => q.i !== 2).every((q) => Object.is(q.Rd, base.isq.receivers.find((z) => z.i === q.i).Rd)) : null,
    pass: s3.ok && recv(s3, 2).Rd / RdV === 2 && Object.is(f3.Rsrc, f1.Rsrc) && s3.isq.receivers.filter((q) => q.i !== 2).every((q) => Object.is(q.Rd, base.isq.receivers.find((z) => z.i === q.i).Rd)) });
  // R4 同じ天体に明示の R_d(dragCore)と R_src(f)を両方 —— 今の受理器は拒否(f は規則の天体だけ —— 欠けている組の記録)
  const b4 = copyBook(HP, { sm: { kind: 'J', f: { 0: 0.07, 2: 0.33 } }, dragCore: { 2: { massFrac: 1, radius: 2 * RdV } } }), v4 = HP.validatePreset(clone(b4));
  const e4 = v4.ok ? '' : JSON.stringify(v4.errors);
  rows.push({ key: 'R4', ja: '同じ天体に明示の R_d(dragCore)と R_src(f)の両方', ok: v4.ok, expectReject: true, reason: e4.slice(0, 220), pass: !v4.ok && e4.indexOf('sourceMoment') >= 0 });
  // R5 源の観測の J の経路(obsSpin —— fSrc と rObs を天体ごとに明示 —— R_src = rObs√(5 fSrc/2)・受け手の R_d と β は同じビット)
  const sun = base.preset.bodies[0], uL = 10 ** u(base).L, uT = 10 ** u(base).T, a0 = axisOfDecl(sun), rObs = sun.radius * uL;
  const s5 = stateOf(HP, copyBook(HP, { sm: { kind: 'obsSpin' }, obsSpin: { 0: { kind: 'omega', omega: sun.spin / uT, unit: 'rad/s', fSrc: 0.07, rObs, axis: a0, frame: 'book', source: '器の写し(🗺️ の太陽の宣言の自転と半径)', epoch: 'J2000' } } }));
  const f5 = s5.ok && s5.isq.sourceMoment ? s5.isq.sourceMoment.bodies[0] : null;
  rows.push({ key: 'R5', ja: '源の観測の J(obsSpin —— fSrc 0.07・rObs を明示)', ok: s5.ok, err: s5.ok ? null : s5.err, betaRdSame: s5.ok ? sameBetaRd(base, s5) : null,
    Rsrc: f5 ? f5.Rsrc * uL : null, RsrcExpect: rObs * Math.sqrt(5 * 0.07 / 2), RsrcRel: f5 ? L.relD(f5.Rsrc * uL, rObs * Math.sqrt(5 * 0.07 / 2)) : null,
    pass: !!(s5.ok && sameBetaRd(base, s5) && f5 && L.relD(f5.Rsrc * uL, rObs * Math.sqrt(5 * 0.07 / 2)) <= 1e-12) });
  // 画面の経路(選択粒子の編集): dragCore の欄の R_d(id beDcR)はある・R_src の欄は無い(html の本文の input の id で数える)
  const ids = [...html.matchAll(/<input[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
  const ui = { rdInput: ids.includes('beDcR'), srcInputs: ids.filter((q) => /rsrc|srcr|fsrc|srcmoment/i.test(q)), editorInputs: ids.filter((q) => /^be/.test(q)).length };
  return { rows, ui, pass: rows.every((q) => q.pass) && ui.rdInput && ui.srcInputs.length === 0 };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP, html) {
  const t0 = Date.now(), tm = {};
  const I = partI(HP); tm.I = (Date.now() - t0) / 1000;
  const Know = partK(HP, I, 'now'), KJ = partK(HP, I, 'J'); tm.K = (Date.now() - t0) / 1000;
  const S = partS(I, Know), SJ = partS(I, KJ); tm.S = (Date.now() - t0) / 1000;
  const H = partH(I, Know, S), V = partV(I, Know, H), VJ = partV(I, KJ, H), C = partC(I, Know, S, H), N = partN(I, Know); tm.HVCN = (Date.now() - t0) / 1000;
  const R = partR(HP, html); tm.R = (Date.now() - t0) / 1000;
  const P = L.pureScenes(), PG = L.pureGates(P);
  const inputs = { units: I.units, g: I.g, OmRefSI: I.OmRefSI, bodies: Object.fromEntries(Object.entries(I.bodies).map(([k, b]) => [k, { i: b.i, name: b.name, m: b.m, R: b.R, s: b.s, a: b.a, axisEngineAngDeg: b.axisEngineAngDeg, Rd: b.Rd, moi: b.moi, I: b.I, gDotA: L.dot(I.g, b.a) }])),
    tides: Object.fromEntries(Object.entries(I.tides).map(([k, n]) => [k, { n, along: L.dot(n, I.bodies[k.split(':')[0]].a) }])) };
  const k1 = { now: { omega: Know.omega }, J: { omega: KJ.omega, sourceMoment: KJ.sourceMoment } };
  const J = { inputs, k1, solve: { now: S, J: { grid: SJ.grid, edges: SJ.edges, sunExact: SJ.sunExact } }, heat: H, venus: { now: V, J: { lambdaHullMin: VJ.lambdaHullMin, lambdaEMin: VJ.lambdaEMin, kRejected: VJ.kRejected, rejected: VJ.rejected } },
    checks: C, controls: N, radius: R, pure: { scenes: P, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const S = J.solve.now, H = J.heat, V = J.venus.now, N = J.controls;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    axesFromDecl: Object.values(J.inputs.bodies).every((b) => b.axisEngineAngDeg < 1e-5),
    sunExact: S.sunExact.alongRel <= 1e-12 && S.AIndependentOfP,
    alongBalanced: S.grid.every((q) => q.alongMaxRel <= 1e-12),
    rankFixedPFull: S.ranks.fixedP.rank === 4 && S.ranks.withP.rank === 4 && S.ranks.withP.cols === 5,
    venusRejectedAllP: V.grid.every((q) => q.rejected === true && q.inside === false) && J.solve.J.grid.every((q) => q.rejected.includes('venus')),
    heatTable: H.pHeat !== null && H.allGammaNonNeg && H.ledger.residualRel <= 1e-12 && H.ledger.LTotalRel <= 1e-12 && H.ledger.k1TransferRel <= 1e-12 && H.ledger.portCloseMaxRel <= 1e-12 && H.holdWorkMaxRel <= 1e-12,
    scaleNotIdentified: L.relD(H.scale.heatRatio, H.scale.lambda) <= 1e-12 && H.scale.alongMaxRel <= 1e-12 && N.scale.ARel <= 1e-12 && N.scale.kRelMax <= 1e-12 && L.relD(N.scale.heatRatio, N.scale.lambda) <= 1e-12,
    venusConditional: !!V.conditional && V.conditional.accepted && V.conditional.ledgerRel <= 1e-12 && V.conditional.netAlongRel <= 1e-12 && V.conditional.rows[0].ports.some((q) => q.torqueAlong > 0)
      && V.conditional.rows[0].ports.some((q) => q.torqueAlong < 0) && V.conditional.rows[0].ports.every((q) => q.heat >= 0) && V.lambdaHullMin > 1e15,
    identityRejected: N.identity.rejected.length > 0,
    freeVectorNotFourBody: Math.abs(N.freeVector.ioResidualRel) > 1e-6 && N.freeVector.rank === 3,
    radius: J.radius.pass,
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W326D_TARGET || 'beta/index.html';
  const OUT = process.env.W326D_OUT ? (path.isAbsolute(process.env.W326D_OUT) ? process.env.W326D_OUT : path.join(ROOT, process.env.W326D_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第326便d axialheat(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP, text);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w326d-axialheat.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(第128報)「軸引きずりについて」(太陽系の全天体は銀河の回転由来の軸引きずり・惑星と衛星は太陽由来・イオは木星由来 —— 太陽–金星・太陽–木星–イオの自転で銀河の軸引きずりの方程式を解く/観測の自転は軸引きずりと潮汐の合算・自転軸は遠方宇宙に対して固定・由来ごとの差分のトルクを内部熱へ・逆向きは打ち消さない/歳差は無視/エネルギーの出所は銀河の中心〔変化は無視〕・最後は背景宇宙へ放射)・「引きずり計算の補足」(引きずる側と引きずられる側の計算上の半径を別々に設定可能)・統括の検証項目 R293',
    decl: L.DECL, moi: L.MOI, srcF: SRC_F, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第326便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axialheat', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

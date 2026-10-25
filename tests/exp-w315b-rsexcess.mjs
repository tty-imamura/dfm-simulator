// 第315便b(決断事項 AN415・原仮定者の裁定(第116報)の補足と訂正②「観測半径を超えた R_d の表示を、観測半径を超えたシュヴァルツシルト半径の表示に変更」・
// 原仮定者の裁定(第117報)AN414 の記号〔r_s・r_d・G_0・c_0〕・DECISIONS の K1 の境界の 1 点・統括の検証項目 R243):
// **観測半径 R_obs を超えたシュヴァルツシルト半径 r_s = 2G_0m/c_0² の表示の読み口の器**と **K1 の境界の 1 点の受理の表**。
// 本の宣言は変えない(写しは器の中で組む)。r_s は GR の参照の尺度(本の基準値 G_0・c_0 と全質量から)で、DFM による地平面の判定ではない。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 schwarzschildExcessOf・validatePreset・
// validateDragCoreBody・inertialDragIsqState・inertialDragIsqRdExcessOf・appStepDt と本の入口 coord3d.makeSim・build・step・loadPreset・allPresets をそのまま呼ぶ)。
//
// ■ 段
//   P(写しの表): 中性子星の写し(1.4 M☉・R 12 km —— r_d > R・r_s < R → 円なし)・r_s > R の写し(1.4 M☉・R 3 km —— 円あり・比)。読み口の r_s を器の中で
//     作り直した (2·G_0·m)/(c_0·c_0)(エンジンの全質量)と SI の閉じた式 2GM/c² と比べる。r_d の超過の読み口 radiusExcess・受理の警告(AN404)は残る。
//   E(等号の境界): G_0 = 2・c_0 = 2(2G_0/c_0² = 1 —— r_s = m を厳密に)・m = 3 の二次元の写しで R_obs = 3(等号 —— 超過でない)・Float32 の 1 つ下(超過)・1 つ上・
//     2.999・3.001。
//   F(質量の割合): r_s > R の写しの dragCore の massFrac 1・0.5・0.2(明示の radius 2)と規則の本の radius の省略(massFrac 0.5)で r_s がビットで同じ(全質量 ——
//     割合を掛けない)。R_obs は dragCore の宣言の R。
//   V(本の種類): K1 + rdRule・K1(規則なし)・K2・旧則・引きずりなし・geoPN 1・3(三次元)・引きずりなし・旧則(二次元)で r_s・R_obs・比がビットで同じ。
//   Z(状態を書かない): 読み口を呼ぶ前後の状態の指紋・10 步の走行で毎步読み口を呼んだ写しと呼ばない写しの指紋。
//   B(内蔵の全本): t = 0 の全本で r_s > R_obs の天体(本・天体・r_s・R_obs・比 —— 器の中で作り直した判定と読み口の一致)・判定した天体の数・
//     太陽系の三次元の本(🌡️🌋🔴🏀🟡🔷💙🌦️)の最大の r_s/R_obs(本の値で)と太陽の SI の閉じた式。
//   K(K1 の境界の 1 点): K1 外殻なし × massFrac 0.5・0.9・1 × r_d = R の受理・規則の本の radius の省略・外殻 uniform・thin の拒否・K2 の拒否と massFrac 1 の受理・
//     旧則の拒否・内(r_d < R)の受理。受理した写しの 10 步が有限。
//
// ■ 言わないこと: 「法則を確かめた」「フィットした」「較正した」「完全に一致」「確認した」。r_s は本の基準値から計算した参照の尺度で、DFM が地平面を解いたものではない。
//   r_d(引きずりの半径)の超過の受理・警告・読み口は第314便a のまま(表示からは外した)。
//
// ■ 使い方
//   node tests/exp-w315b-rsexcess.mjs   → 正本 tests/out/rsexcess-w315b.json(段 rsexcess-315b)
//   W315B_OUT=<json> で出力先を変える(試走は正本を書かない)・W315B_TARGET=<html>(既定 beta/index.html)・W315B_QUICK=1(走行の步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fmtFloor } from './lib-w311c-h4carry.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 段 B は全本を読む)
const REGEN_SCOPE = {"presets":"all","roots":["$","AN415_RS_VERSION","HP.allPresets","HP.coord3d","HP.loadPreset","HP.sim","HP.validatePreset","T","appStepDt","ctx","inertialDragIsqRdExcessOf","inertialDragIsqState","schwarzschildExcessOf","validateDragCoreBody"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w315b-rsexcess-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const NOT_CLAIM = ['法則を確かめた', 'フィットした', '較正した', '完全に一致', '確認した', '収束した'];
/** 写しの単位(本の長さ 1 km・質量 10³⁰ kg・時間 10 μs —— 第314便a の中性子星の写しと同じ)と SI の定数 */
export const UNITS = Object.freeze({ L: 3, T: -5, M: 30 });
export const SI = Object.freeze({ G: 6.6743e-11, c: 299792458, Msun: 1.98847e30, Rsun: 6.957e8 });
const Lm = 1e3, Mm = 1e30;
/** 本の G_0・c_0(SI を本の単位へ —— 6.6743・2.99792458 になるように単位を選んだ) */
export const BOOK_G = 6.6743, BOOK_C = 2.99792458;
/** 写しの天体: 1.4 M☉ の星(観測半径 12 km —— 中性子星 / 3 km —— r_s > R)と試験粒子(1e-6 M☉・R 10 m)。距離 100 km の円軌道 */
export const STAR = Object.freeze({ mSun: 1.4, R_NS: 12, R_IN: 3, spin: 0.04 }), PTCL = Object.freeze({ mSun: 1e-6, R: 0.01 }), DIST = 100;
export const STEPS = 10, STEPS_QUICK = 3;
/** 太陽系の三次元の本(本の値で r_s/R_obs の最大を読む) */
export const SOLAR3D = Object.freeze([
  ['mercurySunInertial3d', '🌡️', '太陽と水星'], ['venusSunInertial3d', '🌋', '太陽と金星'], ['marsSunInertial3d', '🔴', '太陽と火星'],
  ['jupiterSunInertial3d', '🏀', '太陽と木星'], ['saturnSunInertial3d', '🟡', '太陽と土星'], ['uranusSunInertial3d', '🔷', '太陽と天王星'],
  ['neptuneSunInertial3d', '💙', '太陽と海王星'], ['earthMoonSunInertial3d', '🌦️', '太陽と地球と月'],
].map(([id, emoji, ja]) => Object.freeze({ id, emoji, ja })));

/* ───────── 写し ───────── */
const mStar = STAR.mSun * SI.Msun / Mm, mP = PTCL.mSun * SI.Msun / Mm;
/** 読み口と同じ演算の順の r_s(器の中で独立に —— (2·G_0·m)/(c_0·c_0)) */
export const rsOf = (G, c, m) => (2 * G * m) / (c * c);
/** 引きずりの宣言: kind = "k1rule" | "k1" | "k2" | "old" | "none"・shell(outerShell) */
export function dragOf(kind, o = {}) {
  if (kind === 'none') return null;
  if (kind === 'old') return { law: 'inertial', gain: 1, eps: 0.1, pairs: 'all', history: 'positions' };
  const isq = {};
  if (o.shell) isq.outerShell = o.shell;
  if (kind === 'k1' || kind === 'k1rule') isq.kernel = 'k1';
  if (kind === 'k1rule') isq.rdRule = 'kappaM';
  return { law: 'inertial', invSq: isq, pairs: 'all', history: 'positions', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
}
/**
 * 1.4 M☉ の星と試験粒子の写し(星の質量中心の円軌道 —— 粒子は +x・速度 +y)。o = {R(星の観測半径 —— 既定 12 km), kind(引きずり —— 既定 "k1rule"),
 * shell, core(星の dragCore), coord("3d" | "2d" —— 既定 "3d"), geoPN}
 */
export function starBook(o = {}) {
  const coord = o.coord || '3d', kind = o.kind || 'k1rule', mt = mStar + mP, v = Math.sqrt(BOOK_G * mt / DIST);
  const st = { type: 'single', m: mStar, radius: o.R || STAR.R_NS, x: -DIST * mP / mt, y: 0, vx: 0, vy: -v * mP / mt, spin: STAR.spin, pinned: false };
  const pt = { type: 'single', m: mP, radius: PTCL.R, x: DIST * mStar / mt, y: 0, vx: 0, vy: v * mStar / mt, spin: 0, pinned: false };
  if (coord === '3d') { st.z = 0; st.vz = 0; pt.z = 0; pt.vz = 0; }
  if (o.core) st.dragCore = clone(o.core);
  const physics = { G: BOOK_G, cLight: BOOK_C, D0: 0.1, kFrame: 0, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    lambdaPN: 0, geoPN: o.geoPN || 0, softening: 0.05, radiusScale: 1, timeScale: 1, frameWeight: 'share', stepDt: 0.5, massFloor: 1e-6 };
  if (coord === '3d') { physics.coord = '3d'; physics.stateCarry = 'double'; }
  const rd = dragOf(kind, o);
  if (rd) physics.relativeDrag = rd;
  return { id: 'w315bCompactStar', name: '1.4 M☉ の星と試験粒子の写し(第315便b の器 —— 内蔵の本ではない)', emoji: '⭐', description: '第315便b の器の写し(r_s > R_obs の表示の読み口)',
    camera: { scale: 150 }, world: { boundary: 'none', size: 0 }, scaleExp: { L: UNITS.L, T: UNITS.T, M: UNITS.M }, physics, bodies: [st, pt] };
}
/** 等号の境界の写し(二次元・引きずりなし —— G_0 = 2・c_0 = 2 で r_s = m を厳密に。m = 3・観測半径 R) */
export function edgeBook(R) {
  return { id: 'w315bEdge', name: '等号の境界の写し(第315便b の器 —— 内蔵の本ではない)', emoji: '⚪', description: '第315便b の器の写し(r_s = R_obs の境界)',
    camera: { scale: 5 }, world: { boundary: 'none', size: 0 },
    physics: { G: 2, cLight: 2, D0: 0.1, kFrame: 0, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, lambdaPN: 0, geoPN: 0,
      softening: 0.05, radiusScale: 1, timeScale: 1 },
    bodies: [{ type: 'single', m: 3, radius: R, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false },
      { type: 'single', m: 0.001, radius: 0.5, x: 60, y: 0, vx: 0, vy: Math.sqrt(2 * 3 / 60), spin: 0, pinned: false }] };
}
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: (v.errors || []).join(' ').slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset, warnings: v.warnings || [] };
}
const isX = (w) => /AN404/.test(w) && /観測半径/.test(w);
/** 写しの要点(本の ID と宣言の要点 —— R・m・dragCore・引きずり —— 出力に必ず印字する) */
const declOf = (q) => ({ id: q.id, coord: q.physics.coord || '2d', G: q.physics.G, cLight: q.physics.cLight, geoPN: q.physics.geoPN, drag: q.physics.relativeDrag ? (q.physics.relativeDrag.invSq || { law: q.physics.relativeDrag.law }) : null,
  bodies: q.bodies.map((b) => ({ m: b.m, R: b.radius === undefined ? null : b.radius, dragCore: b.dragCore || null })) });
/** 器の中で作り直した判定(読み口と同じ R_obs の読み —— dragCore の宣言の R・他は radOv。質量が正・R_obs > 0 の天体だけ) */
function rowsOf(S) {
  const G = S.params.G, c = S.params.cLight, D = S.dragCoreD || null, out = [];
  let judged = 0;
  for (let j = 0; j < S.n; j++) {
    const m = S.m[j]; if (!(m > 0) || !Number.isFinite(m)) continue;
    const d = D ? D[j] : null, Ro = (d && d.R > 0) ? d.R : S.radOv[j];
    if (!(Ro > 0) || !Number.isFinite(Ro)) continue;
    judged++;
    const rs = rsOf(G, c, m);
    out.push({ i: j, m, rs, Robs: Ro, ratio: rs / Ro, excess: rs > Ro });
  }
  return { rows: out, judged };
}
const sameRows = (rx, mine) => {
  const ex = mine.filter((r) => r.excess);
  if (!rx) return ex.length === 0;
  return rx.n === ex.length && rx.bodies.every((b, k) => b.i === ex[k].i && rel(b.rs, ex[k].rs) < 1e-12 && b.Robs === ex[k].Robs && rel(b.ratio, ex[k].ratio) < 1e-12)
    && rel(rx.maxRatio, Math.max(...ex.map((r) => r.ratio))) < 1e-12;
};
/** 状態の指紋(読み口が書かないことを見る —— 型付き配列の倍精度の写しと t) */
const STATE_KEYS = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'm', 'R', 'radOv', 'mEff'];
const fpOf = (S) => { const h = crypto.createHash('sha256'); for (const k of STATE_KEYS) if (S[k]) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); h.update(String(S.t)); return h.digest('hex'); };

/* ───────── 段 P(写しの表)───────── */
export function partP(H) {
  const HP = H.HP, sx = E(H, 'schwarzschildExcessOf'), st = E(H, 'inertialDragIsqState'), rx = E(H, 'inertialDragIsqRdExcessOf'), rows = [];
  const RsSI = 2 * SI.G * (STAR.mSun * SI.Msun) / (SI.c * SI.c);   // 閉じた式(宣言の質量 —— 倍精度・SI)
  for (const [lab, R] of [['中性子星の写し(R 12 km —— r_d > R・r_s < R)', STAR.R_NS], ['r_s > R の写し(R 3 km)', STAR.R_IN]]) {
    const q = starBook({ R }), z = simOf(HP, q);
    if (z.err) { rows.push({ case: lab, decl: declOf(q), accepted: false, err: z.err }); continue; }
    const S = z.S, x = sx(S), mine = rowsOf(S), s0 = st(S), r0 = rx(S), rsE = rsOf(S.params.G, S.params.cLight, S.m[0]);
    rows.push({ case: lab, decl: declOf(q), accepted: true, mEngine: S.m[0], rsEngine: rsE, rsKm: rsE, Robs: R, ratio: rsE / R, readout: x ? { version: x.version, n: x.n, maxRatio: x.maxRatio, bodies: x.bodies } : null,
      ring: !!(x && x.by.get(0)), sameAsMine: sameRows(x, mine.rows), relSI: rel(rsE * Lm, RsSI),
      rdExcess: s0.radiusExcess ? s0.radiusExcess.bodies.map((b) => ({ i: b.i, Rd: b.Rd, Robs: b.Robs, ratio: b.ratio })) : null, rdDisplayReadoutN: r0 ? r0.n : 0, nWarnX: z.warnings.filter(isX).length });
  }
  return { rows, RsSI, RsSIkm: RsSI / Lm };
}

/* ───────── 段 E(等号の境界)───────── */
export function partE(H) {
  const HP = H.HP, sx = E(H, 'schwarzschildExcessOf'), rows = [];
  const below = Math.fround(3 - 2 ** -22), above = Math.fround(3 + 2 ** -22);
  for (const [lab, R, exp] of [['R_obs = r_s = 3(等号)', 3, false], ['R_obs = r_s の Float32 の 1 つ下', below, true], ['R_obs = r_s の Float32 の 1 つ上', above, false],
    ['R_obs = 2.999', 2.999, true], ['R_obs = 3.001', 3.001, false]]) {
    const q = edgeBook(R), z = simOf(HP, q);
    if (z.err) { rows.push({ case: lab, decl: declOf(q), expectExcess: exp, accepted: false, err: z.err, pass: false }); continue; }
    const S = z.S, x = sx(S), b = x ? x.by.get(0) : null, rs = rsOf(S.params.G, S.params.cLight, S.m[0]);
    rows.push({ case: lab, decl: declOf(q), expectExcess: exp, accepted: true, rs, Robs: S.radOv[0], excess: !!b, ratio: b ? b.ratio : rs / S.radOv[0], pass: (!!b) === exp && rs === 3 });
  }
  return { rows, allPass: rows.every((r) => r.pass) };
}

/* ───────── 段 F(質量の割合 —— 全質量)───────── */
export function partF(H) {
  const HP = H.HP, sx = E(H, 'schwarzschildExcessOf'), rows = [];
  const cases = [['dragCore なし(K1 + rdRule)', null, 'k1rule'], ['明示 {massFrac:1, radius:2}', { massFrac: 1, radius: 2 }, 'k1rule'], ['明示 {massFrac:0.5, radius:2}', { massFrac: 0.5, radius: 2 }, 'k1rule'],
    ['明示 {massFrac:0.2, radius:2}', { massFrac: 0.2, radius: 2 }, 'k1rule'], ['規則の本の radius の省略 {massFrac:0.5}', { massFrac: 0.5 }, 'k1rule'], ['K2 明示 {massFrac:0.5, radius:2}', { massFrac: 0.5, radius: 2 }, 'k2']];
  for (const [lab, core, kind] of cases) {
    const q = starBook({ R: STAR.R_IN, core, kind }), z = simOf(HP, q);
    if (z.err) { rows.push({ case: lab, decl: declOf(q), accepted: false, err: z.err }); continue; }
    const x = sx(z.S), b = x ? x.by.get(0) : null;
    rows.push({ case: lab, decl: declOf(q), accepted: true, rs: b ? b.rs : null, Robs: b ? b.Robs : null, ratio: b ? b.ratio : null, massFrac: core ? core.massFrac : 1 });
  }
  const ok = rows.filter((r) => r.accepted), r0 = ok[0];
  return { rows, allAccepted: ok.length === rows.length, bitSame: !!r0 && r0.rs !== null && ok.every((r) => r.rs === r0.rs && r.Robs === r0.Robs && r.ratio === r0.ratio) };
}

/* ───────── 段 V(本の種類)───────── */
export function partV(H) {
  const HP = H.HP, sx = E(H, 'schwarzschildExcessOf'), rows = [];
  const cases = [['三次元 K1 + rdRule', { kind: 'k1rule' }], ['三次元 K1(規則なし)', { kind: 'k1' }], ['三次元 K2', { kind: 'k2' }], ['三次元 旧則', { kind: 'old' }], ['三次元 引きずりなし', { kind: 'none' }],
    ['三次元 K1 + rdRule・geoPN 1', { kind: 'k1rule', geoPN: 1 }], ['三次元 K1 + rdRule・geoPN 3', { kind: 'k1rule', geoPN: 3 }], ['二次元 引きずりなし', { kind: 'none', coord: '2d' }], ['二次元 旧則', { kind: 'old', coord: '2d' }]];
  for (const [lab, o] of cases) {
    const q = starBook(Object.assign({ R: STAR.R_IN }, o)), z = simOf(HP, q);
    if (z.err) { rows.push({ case: lab, decl: declOf(q), accepted: false, err: z.err }); continue; }
    const x = sx(z.S), b = x ? x.by.get(0) : null;
    rows.push({ case: lab, decl: declOf(q), accepted: true, coord3d: z.S.coord3d === true, n: x ? x.n : 0, rs: b ? b.rs : null, Robs: b ? b.Robs : null, ratio: b ? b.ratio : null });
  }
  const ok = rows.filter((r) => r.accepted), r0 = ok[0];
  return { rows, allAccepted: ok.length === rows.length, bitSame: !!r0 && r0.rs !== null && ok.every((r) => r.n === 1 && r.rs === r0.rs && r.Robs === r0.Robs && r.ratio === r0.ratio) };
}

/* ───────── 段 Z(状態を書かない)───────── */
export function partZ(H, quick) {
  const HP = H.HP, sx = E(H, 'schwarzschildExcessOf'), dtOf = E(H, 'appStepDt'), nst = quick ? STEPS_QUICK : STEPS, rows = [];
  for (const [lab, o] of [['r_s > R の写し(三次元 K1 + rdRule)', { R: STAR.R_IN }], ['r_s > R の写し(二次元 引きずりなし)', { R: STAR.R_IN, kind: 'none', coord: '2d' }]]) {
    const q = starBook(o), a = simOf(HP, q), b = simOf(HP, q);
    if (a.err || b.err) { rows.push({ case: lab, decl: declOf(q), err: a.err || b.err }); continue; }
    const f0 = fpOf(a.S); for (let k = 0; k < 5; k++) sx(a.S); const f1 = fpOf(a.S);
    const dt = dtOf(a.S);
    let n = 0;
    for (let i = 0; i < nst; i++) { a.S.step(dt); if (sx(a.S)) n++; b.S.step(dt); }
    const fa = fpOf(a.S), fb = fpOf(b.S);
    rows.push({ case: lab, decl: declOf(q), steps: nst, dt, readSame: f0 === f1, runSame: fa === fb, excessSteps: n, fpA: fa.slice(0, 16), fpB: fb.slice(0, 16) });
  }
  return { rows, ok: rows.every((r) => r.readSame && r.runSame && r.excessSteps === r.steps) };
}

/* ───────── 段 B(内蔵の全本 —— t = 0)───────── */
export function partB(H) {
  const HP = H.HP, sx = E(H, 'schwarzschildExcessOf'), list = HP.allPresets(), excess = [], near = [], solar = [];
  let judged = 0, nPresets = 0, nSame = 0, maxBelow = 0;
  for (const p of list) {
    HP.loadPreset(p.id, false);
    const S = HP.sim, x = sx(S), mine = rowsOf(S);
    nPresets++; judged += mine.judged;
    if (sameRows(x, mine.rows)) nSame++;
    for (const r of mine.rows) {
      if (r.excess) excess.push({ id: p.id, i: r.i, m: r.m, rs: r.rs, Robs: r.Robs, ratio: r.ratio, coord3d: S.coord3d === true, G: S.params.G, cLight: S.params.cLight });
      else { if (r.ratio > maxBelow) maxBelow = r.ratio; if (r.ratio >= 0.5) near.push({ id: p.id, i: r.i, ratio: r.ratio }); }
    }
    const so = SOLAR3D.find((b) => b.id === p.id);
    if (so) { let mx = 0, at = -1; for (const r of mine.rows) if (r.ratio > mx) { mx = r.ratio; at = r.i; }
      solar.push({ id: p.id, maxRatio: mx, at, m: at >= 0 ? S.m[at] : null, Robs: at >= 0 ? mine.rows.find((r) => r.i === at).Robs : null, rs: at >= 0 ? mine.rows.find((r) => r.i === at).rs : null, readoutNull: x === null }); }
  }
  near.sort((a, b) => b.ratio - a.ratio);
  const exIds = [...new Set(excess.map((r) => r.id))];
  const sunSI = 2 * SI.G * SI.Msun / (SI.c * SI.c);
  return { nPresets, judged, nSame, excess, excessPresets: exIds, nearTop: near.slice(0, 8), maxBelow, solar, solarMax: Math.max(...solar.map((r) => r.maxRatio)),
    sunSI: { rsM: sunSI, Rm: SI.Rsun, ratio: sunSI / SI.Rsun } };
}

/* ───────── 段 K(K1 の境界の 1 点)───────── */
export function partK(H, quick) {
  const HP = H.HP, VB = E(H, 'validateDragCoreBody'), dtOf = E(H, 'appStepDt'), rows = [], R = STAR.R_NS, nst = quick ? STEPS_QUICK : STEPS;
  const T = (lab, q, ok, re, run) => {
    const v = HP.validatePreset(clone(q)), m = (v.errors || []).join(' ');
    const pass = ok ? v.ok : (!v.ok && re.test(m));
    const row = { case: lab, decl: declOf(q), expectOk: ok, expectErr: ok ? null : re.source, ok: v.ok, err: v.ok ? null : m.slice(0, 240), nWarnX: v.ok ? (v.warnings || []).filter(isX).length : null, pass };
    if (run && v.ok) {
      const S = HP.coord3d.makeSim(); S.build(clone(v.preset)); const dt = dtOf(S);
      let finite = true;
      for (let i = 0; i < nst; i++) { S.step(dt); for (let j = 0; j < S.n; j++) if (![S.x[j], S.y[j], S.z[j], S.vx[j], S.vy[j], S.vz[j]].every(Number.isFinite)) finite = false; }
      row.run = { steps: nst, finite, badRow: S.inertialDragIsqBadRow || 0 };
      row.pass = row.pass && finite && row.run.badRow === 0;
    }
    rows.push(row);
  };
  const D = (lab, b, ph, re) => {
    const v = VB(clone(b), clone(ph));
    rows.push({ case: lab, decl: { body: b, physics: ph }, expectOk: false, expectErr: re.source, ok: v.ok, err: v.ok ? null : String(v.err).slice(0, 240), nWarnX: null, pass: !v.ok && re.test(String(v.err)) });
  };
  const SHELL = /AN403・AN409/, ZERO = /マントルの体積が 0/;
  T('K1 外殻なし・明示 {massFrac:0.5, radius:R}(r_d = R —— 第315便b で受理)', starBook({ kind: 'k1', core: { massFrac: 0.5, radius: R } }), true, null, true);
  T('K1 外殻なし・明示 {massFrac:0.9, radius:R}(r_d = R)', starBook({ kind: 'k1', core: { massFrac: 0.9, radius: R } }), true, null, true);
  T('K1 + rdRule・外殻なし・明示 {massFrac:0.5, radius:R}(r_d = R)', starBook({ kind: 'k1rule', core: { massFrac: 0.5, radius: R } }), true, null, true);
  T('K1 外殻なし・明示 {massFrac:1, radius:R}(r_d = R —— 前から受理)', starBook({ kind: 'k1', core: { massFrac: 1, radius: R } }), true, null, false);
  T('K1 外殻なし・明示 {massFrac:0.5, radius:0.999R}(内 —— 前から受理)', starBook({ kind: 'k1', core: { massFrac: 0.5, radius: 0.999 * R } }), true, null, false);
  T('K1 外殻 uniform・明示 {massFrac:0.5, radius:R}(r_d = R —— 外殻の組)', starBook({ kind: 'k1', shell: 'uniform', core: { massFrac: 0.5, radius: R } }), false, SHELL);
  T('K1 外殻 thin・明示 {massFrac:0.5, radius:R}(r_d = R —— 外殻の組)', starBook({ kind: 'k1', shell: 'thin', core: { massFrac: 0.5, radius: R } }), false, SHELL);
  T('K2・明示 {massFrac:0.5, radius:R}(R_c = R —— 今のまま)', starBook({ kind: 'k2', core: { massFrac: 0.5, radius: R } }), false, ZERO);
  T('K2・明示 {massFrac:1, radius:R}(マントルなし —— 今のまま受理)', starBook({ kind: 'k2', core: { massFrac: 1, radius: R } }), true, null, false);
  D('旧則(invSq なし)・{massFrac:0.5, radius:R}(R_c = R —— 今のまま)', { radius: R, m: mStar, dragCore: { massFrac: 0.5, radius: R } }, { relativeDrag: { law: 'inertial', gain: 1, eps: 0.1, pairs: 'all', history: 'positions' }, softening: 0.1 }, ZERO);
  return { rows, allPass: rows.every((r) => r.pass), n: rows.length };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const p = J.P.rows, ns = p[0], inn = p[1];
  return {
    nsNoRing: !!(ns && ns.accepted && ns.readout === null && !ns.ring && ns.ratio < 1 && ns.rdExcess && ns.rdExcess.length === 1 && ns.rdExcess[0].ratio > 1 && ns.rdDisplayReadoutN === 1 && ns.nWarnX === 1 && ns.sameAsMine),
    innerRing: !!(inn && inn.accepted && inn.readout && inn.readout.n === 1 && inn.readout.bodies[0].i === 0 && inn.ring && inn.sameAsMine && rel(inn.readout.maxRatio, inn.ratio) < 1e-12
      && inn.readout.version === J.rsVersion),
    closedForm: p.every((r) => r.accepted && r.relSI < 1e-6),
    edge: J.E.allPass,
    massFracInvariant: J.F.allAccepted && J.F.bitSame,
    kindInvariant: J.V.allAccepted && J.V.bitSame,
    stateUntouched: J.Z.ok,
    builtinScanned: J.B.nPresets === J.nBuiltin && J.B.nSame === J.B.nPresets && J.B.excess.every((r) => r.rs > r.Robs),
    solarSmall: J.B.solar.length === SOLAR3D.length && J.B.solar.every((r) => r.readoutNull && r.maxRatio < 1e-4),
    k1Edge: J.K.allPass,
    version: J.rsVersion === 'w315b-rs-excess-1',
  };
}

/* ───────── 文書の表と数(PHYSICS〔第315便b〕—— QA docs.rsExcess315 が正本から作り直して逐語で照合する)───────── */
const p5 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toPrecision(5);
const e3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : Number(v).toExponential(3));
const fl = (v, floor) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : fmtFloor(v, floor, 3));
export function physicsTables(J) {
  const out = [];
  out.push('| 写しの表(1.4 M☉ の星 —— 本の長さ 1 km・G_0・c_0 は SI の値) | R_obs [km] | r_s [km](読み口) | r_s/R_obs | 円 | r_d の超過(読み口 radiusExcess) | 受理の警告(AN404) |', '|---|---|---|---|---|---|---|');
  for (const r of J.P.rows) out.push(`| ${r.case} | ${r.Robs} | ${p5(r.rsEngine)} | ${p5(r.ratio)} | ${r.ring ? 'あり' : 'なし'} | ${r.rdExcess ? 'r_d/R_obs ' + p5(r.rdExcess[0].ratio) : 'なし'} | ${r.nWarnX} |`);
  out.push('', '| 等号の境界(G_0 = 2・c_0 = 2 —— r_s = m = 3・二次元の写し) | R_obs(Float32) | r_s/R_obs − 1 | 超過 | 期待 |', '|---|---|---|---|---|');
  for (const r of J.E.rows) out.push(`| ${r.case} | ${Number(r.Robs).toPrecision(8)} | ${r.ratio === null ? '—' : (r.ratio === 1 ? '0' : fl(r.ratio - 1, 1e-12))} | ${r.excess ? 'あり' : 'なし'} | ${r.expectExcess ? 'あり' : 'なし'}${r.pass ? '' : '(違う)'} |`);
  out.push('', '| 質量の割合(R_obs 3 km の写し) | massFrac | r_s [km] | r_s/R_obs |', '|---|---|---|---|');
  for (const r of J.F.rows) out.push(`| ${r.case} | ${r.massFrac} | ${p5(r.rs)} | ${p5(r.ratio)} |`);
  out.push('', '| 本の種類(R_obs 3 km の写し) | r_s [km] | r_s/R_obs | 超過の天体 |', '|---|---|---|---|');
  for (const r of J.V.rows) out.push(`| ${r.case} | ${p5(r.rs)} | ${p5(r.ratio)} | ${r.n} |`);
  out.push('', '| 内蔵の本(t = 0)で r_s > R_obs の天体 | 天体 | m(本の質量) | r_s | R_obs | r_s/R_obs |', '|---|---|---|---|---|---|');
  for (const r of J.B.excess) out.push(`| ${r.id} | ${r.i} | ${p5(r.m)} | ${p5(r.rs)} | ${p5(r.Robs)} | ${p5(r.ratio)} |`);
  out.push('', '| 太陽系の三次元の本(本の値) | r_s/R_obs の最大 | 天体 | 表示の読み口 |', '|---|---|---|---|');
  for (const r of J.B.solar) { const b = SOLAR3D.find((x) => x.id === r.id); out.push(`| ${b.emoji} ${b.ja} | ${e3(r.maxRatio)} | ${r.at} | ${r.readoutNull ? 'null' : '超過あり'} |`); }
  out.push('', '| K1 の境界の 1 点(1.4 M☉・R 12 km の写し) | 期待 | 結果 |', '|---|---|---|');
  for (const r of J.K.rows) out.push(`| ${r.case} | ${r.expectOk ? '受理' : '拒否'} | ${r.ok ? '受理' : '拒否'}${r.pass ? '' : '(違う)'}${r.run ? '・' + r.run.steps + ' 步 ' + (r.run.finite ? '有限' : '非有限') : ''} |`);
  out.push('', '| 照合 | 値 |', '|---|---|');
  out.push(`| 内蔵の本(t = 0): 判定した天体(質量が正・R_obs > 0)/ 本 | ${J.B.judged} / ${J.B.nPresets} |`);
  out.push(`| 内蔵の本(t = 0): r_s > R_obs の本 / 天体 | ${J.B.excessPresets.length} / ${J.B.excess.length} |`);
  out.push(`| 読み口と器の中で作り直した判定の一致(本) | ${J.B.nSame}/${J.B.nPresets} |`);
  out.push(`| 1.4 M☉ の r_s(読み口 —— エンジンの質量)と SI の閉じた式 2GM/c² の相対の差 | ${fl(Math.max(...J.P.rows.map((r) => r.relSI)), 1e-6)} |`);
  out.push(`| 状態を書かない(読み口の前後・毎步読み口を呼んだ走行の指紋) | ${J.Z.ok ? '同じ' : '違う'} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  return [p5(J.P.rows[0].rsEngine), p5(J.P.rows[1].ratio), p5(J.P.RsSIkm), e3(J.B.sunSI.ratio), String(J.B.judged)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const P = partP(H); tick('P');
  const Ee = partE(H); tick('E');
  const F = partF(H); tick('F');
  const V = partV(H); tick('V');
  const Z = partZ(H, quick); tick('Z');
  const B = partB(H); tick('B');
  const K = partK(H, quick); tick('K');
  const J = { quick, rsVersion: E(H, 'AN415_RS_VERSION'), nBuiltin: E(H, 'BUILTIN_PRESETS').length, P, E: Ee, F, V, Z, B, K };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W315B_TARGET || 'beta/index.html';
  const OUT = process.env.W315B_OUT || path.join(ROOT, 'tests', 'out', 'rsexcess-w315b.json');
  const quick = process.env.W315B_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w315b-rsexcess.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '決断事項 AN415 観測半径を超えた R_d の表示を、観測半径を超えたシュヴァルツシルト半径 r_s の表示に変更(r_s は全質量と本の G_0・c_0 から・DFM による地平面の判定ではない・R_d の受理と警告と読み口は残す)・原仮定者の裁定(第117報)AN414 の記号・K1 の境界の 1 点・統括の検証項目 R243',
    units: { book: UNITS, G: BOOK_G, cLight: BOOK_C, si: SI }, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w315b-rsexcess.mjs', 'tests/lib-w311c-h4carry.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第315便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
  for (const r of out.P.rows) console.log('P', r.decl.id, r.decl.coord, JSON.stringify(r.decl.drag), r.decl.bodies.map((b) => 'm=' + b.m + ' R=' + b.R).join(' / '), 'r_s=' + r.rsEngine, 'r_s/R=' + r.ratio, 'ring=' + r.ring,
    'r_d=' + (r.rdExcess ? r.rdExcess[0].Rd : null), 'warnX=' + r.nWarnX);
  for (const r of out.E.rows) console.log('E', r.decl.id, 'G=' + r.decl.G, 'c=' + r.decl.cLight, 'm=3 R=' + r.Robs, 'excess=' + r.excess, 'pass=' + r.pass);
  for (const r of out.F.rows.concat(out.V.rows)) console.log('FV', r.decl.id, r.decl.coord, JSON.stringify(r.decl.drag), 'geoPN=' + r.decl.geoPN, 'R=' + r.decl.bodies[0].R, 'dragCore=' + JSON.stringify(r.decl.bodies[0].dragCore), 'r_s=' + r.rs, 'ratio=' + r.ratio);
  console.log('B', 'presets=' + out.B.nPresets, 'judged=' + out.B.judged, 'same=' + out.B.nSame, 'excess=' + JSON.stringify(out.B.excess.map((r) => r.id + '#' + r.i + ' ' + r.ratio)), 'solarMax=' + out.B.solarMax);
  for (const r of out.K.rows) console.log('K', r.case, JSON.stringify(r.decl.drag || null), 'ok=' + r.ok, 'pass=' + r.pass, r.err ? r.err.slice(0, 80) : '');
}
if (IS_MAIN) await main();

// 第313便a(原仮定者の裁定(第115報)AN399「K1 を採用する」・AN402「太陽を含む全天体に同じ規則 R_d = κm —— R_d は重力半径に比例する長さ」・補足「m_obs − m_d の外殻は近距離の
// 計算に必要・R_d は密度では無いので外殻の厚みを考慮する必要は無い」「6.5e6 m は K2 で未宣言時の上限 —— K1 では無視して構わない」・決断事項 AN403・AN404・統括の検証項目 R234):
// **K1 の規則の鍵 invSq.rdRule:"kappaM"(全天体 R_d = κ₀ m_d)と外殻の受け手の opt-in invSq.shellRecv の器**。在位の本の宣言は変えない(写しは器の中で組む)・合わせない
// (κ₀ = 10G/(C₁c²) は一次の値に固定 —— 本の G・c と閉じた式 C₁ = 6[(√3/2)ln(2+√3) − 1] から)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 validatePreset・inertialDragIsqState・
// inertialDragInitObsState・appStepDt と本の入口 coord3d.makeSim・build・step をそのまま呼ぶ)。
//
// ■ 段
//   A(受理の表): rdRule・shellRecv の値と組み合わせ(K1 の本だけ・dragCoreDefault と一緒にしない・outerShell と一緒にだけ・規則の R_d が天体の半径を超える天体の拒否〔AN404〕・
//     規則の本の dragCore:{massFrac} の radius の省略・明示の dragCore.radius が規則より優先)と正準形。
//   R(規則の表): 太陽・水星・金星・地球・月・火星・木星の R_d = κ₀m(写しの本の読み口 rdRule —— エンジンが使う質量)と閉じた式(器の中の SI の式 10Gm/(C₁c²))の差・
//     r_s = 2Gm/c² との比(5/C₁)。規則の鍵で置いた本と、器の写しで全天体に明示の dragCore {massFrac:1, radius:κ₀·m}(本の単位・エンジンと同じ演算の順・エンジンが使う質量)を
//     置いた本が**ビット同一**(読み口の受け手の行と観測の初期値の分解と N 步の状態の指紋)か。宣言の質量(倍精度)で置いた写しとの R_d と β の相対の差(Float32 の質量の丸め)。
//   B(外殻の受け手): 水星の写し(太陽 κ₀M☉ —— 規則)で水星の m_d/M ∈ {1, 0.999999, 0.99, 0.5}(dragCore:{massFrac} —— 規則の R_d = κ₀ m_d)× outerShell {thin, uniform}
//     × shellRecv {mass, core} の t = 0 の β(水星 ← 太陽)・回転の係数・軸の ω。core の β と C₁κ₀M☉/r の差・m_d/M に依らないか。統括の写しの型(R_d = κ₀m —— 全質量の明示の
//     radius)の mass の列。近距離の場: 外殻を持つ水星(m_d/M = 0.5)の観測半径の 1.01・1.5・3 倍に試験の受け手を置き、受け手の β・源の外殻の分・回転の係数が shellRecv に
//     依らない(ビット同一)か・外殻の分の割合。
//   E(エンジン): 3 惑星・木星・太陽と地球と月の写しを K1 + rdRule(+ 外殻 uniform・観測の初期値の分解・回転と軸)で —— 受理・分解・N 步が有限・行の帳簿(badRow・lowDen)・
//     質量の下限の天体の記録の例(小さい質量の写し)。
//
// ■ 言わないこと: 「法則を確かめた」「フィットした」「較正した」「完全に一致」「確認した」。R_d は重力半径に比例する長さ(天体の大きさではない)。κ₀ は一次の値(合わせない)。
//
// ■ 使い方
//   node tests/exp-w313a-kappam.mjs   → 正本 tests/out/kappam-w313a.json(段 kappam-313a)
//   W313A_OUT=<json> で出力先を変える(試走は正本を書かない)・W313A_TARGET=<html>(既定 beta/index.html)・W313A_QUICK=1(步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as Q from './lib-w311d-planet3.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限)
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","saturn","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.validatePreset","REL_DRAG_INVSQ_C1","REL_DRAG_INVSQ_KERNEL_VERSION","REL_DRAG_INVSQ_RDRULE_VERSION","REL_DRAG_INVSQ_SHELL_RECV_VERSION","T","appStepDt","ch","ctx","inertialDragInitObsState","inertialDragIsqState"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w313a-kappam-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const nrm = (v) => Math.hypot(v[0], v[1], v[2]);
const NOT_CLAIM = ['法則を確かめた', 'フィットした', '較正した', '完全に一致', '確認した', '収束した'];
export const DECL_FILE = 'tests/data-w306a-decl305.json';
const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
/** C₁ = 6[(√3/2) ln(2 + √3) − 1](閉じた式 —— 器の中で独立に) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
/** 写しの本(器の --book の鍵 —— 3 惑星と木星は第306便a の世代の凍結の写し・🌦️ は生きている本〔太陽 pinned〕) */
export const BOOKS = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', ja: '水星', pin: true, names: ['sun', 'mercury'] }),
  Object.freeze({ key: 'venus', id: 'venusSunInertial3d', emoji: '🌋', ja: '金星', pin: true, names: ['sun', 'venus'] }),
  Object.freeze({ key: 'mars', id: 'marsSunInertial3d', emoji: '🔴', ja: '火星', pin: true, names: ['sun', 'mars'] }),
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '木星', pin: true, names: ['sun', 'jupiter'] }),
  Object.freeze({ key: 'earthmoon', id: 'earthMoonSunInertial3d', emoji: '🌦️', ja: '太陽と地球と月', pin: false, names: ['sun', 'earth', 'moon'] }),
]);
const JA = { sun: '☀️ 太陽', mercury: '🌡️ 水星', venus: '🌋 金星', earth: '🌍 地球', moon: '🌙 月', mars: '🔴 火星', jupiter: '🏀 木星' };
/** 規則の表の天体の並び(太陽は 🌡️ の写しの値) */
export const RULE_ROWS = Object.freeze([['sun', 'mercury', 0], ['mercury', 'mercury', 1], ['venus', 'venus', 1], ['earth', 'earthmoon', 1], ['moon', 'earthmoon', 2], ['mars', 'mars', 1], ['jupiter', 'jupiter', 1]]);
/** 段 B の点 */
export const MD_POINTS = Object.freeze([1, 0.999999, 0.99, 0.5]);
export const SHELLS = Object.freeze(['thin', 'uniform']);
export const RECVS = Object.freeze(['mass', 'core']);
export const NEAR_D = Object.freeze([1.01, 1.5, 3]);
export const STEPS = 60, STEPS_QUICK = 6, STEPS_BIT = 30, STEPS_BIT_QUICK = 4;

/* ───────── 写し ───────── */
const unitsOf = (q) => ({ Lm: Math.pow(10, q.scaleExp.L), Tm: Math.pow(10, q.scaleExp.T), Mm: Math.pow(10, q.scaleExp.M) });
/** 写しの基(引きずりの宣言の前)—— 3 惑星・木星は凍結の写し(G_loc は外す)・🌦️ は生きている本 */
export function baseOf(HP, key) {
  const b = BOOKS.find((x) => x.key === key);
  if (b.pin) { const q = Q.pinnedBook(HP, PIN, b.id); delete q.physics.gLoc; return q; }
  const p = HP.allPresets().find((x) => x.id === b.id); if (!p) throw new Error('本が無い: ' + b.id);
  const q = clone(p); delete q.fitRecord; delete q.abBody; delete q.physics.gLoc; return q;
}
/** K1 の新則の宣言(第311便d の NEW_DRAG から dragCoreDefault を外す —— 規則の本は cap を見ない)。o = {rule, shell, recv, noShell} */
export function dragOf(o = {}) {
  const rd = clone(Q.NEW_DRAG); delete rd.dragCoreDefault;
  rd.invSq.kernel = 'k1';
  if (o.noShell) delete rd.invSq.outerShell; else if (o.shell) rd.invSq.outerShell = o.shell;
  if (o.rule !== false) rd.invSq.rdRule = 'kappaM';
  if (o.recv) rd.invSq.shellRecv = o.recv;
  return rd;
}
/** 規則の写し(全天体に規則 —— 在位の構造核の宣言〔🌦️ の地球〕は外す) */
export function ruleBook(HP, key, o = {}) {
  const q = baseOf(HP, key); q.physics.relativeDrag = dragOf(o);
  for (const b of q.bodies) delete b.dragCore;
  return q;
}
/** κ₀(本の単位 —— エンジンと同じ演算の順 (10·G)/(C₁·c·c))とエンジンが使う質量(massPrecision が single の本は Float32) */
export const kappaBook = (ph) => (10 * ph.G) / (C1 * ph.cLight * ph.cLight);
export const engineMass = (m, ph) => (ph.massPrecision === 'double' ? m : Math.fround(m));
/** 器の写しの明示の dragCore(枝 d の型 —— 全天体 {massFrac:1, radius}): how = "engine"(κ₀·m_engine —— エンジンと同じ値)| "declared"(10·G·m/(C₁·c·c) —— 宣言の質量・別の演算の順) */
export function explicitBook(HP, key, how) {
  const q = baseOf(HP, key); q.physics.relativeDrag = dragOf({ rule: false });
  const ph = q.physics, k = kappaBook(ph);
  for (const b of q.bodies) b.dragCore = { massFrac: 1, radius: how === 'engine' ? k * engineMass(b.m, ph) : 10 * ph.G * b.m / (C1 * ph.cLight * ph.cLight) };
  return q;
}
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: (v.errors || []).join(' ').slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset, warnings: v.warnings || [] };
}
const fpOf = (S) => { const h = crypto.createHash('sha256'); for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA']) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); return h.digest('hex'); };
const run = (H, S, k) => { const dt = E(H, 'appStepDt')(S); for (let i = 0; i < k; i++) S.step(dt); return fpOf(S); };
const recvJson = (st) => JSON.stringify(st.receivers);
/** 写しの要点(本の ID と宣言の要点 —— 出力に必ず印字する) */
const declOf = (q) => ({ id: q.id, invSq: q.physics.relativeDrag.invSq, bodies: q.bodies.map((b) => ({ m: b.m, R: b.radius, dragCore: b.dragCore || null, pinned: !!b.pinned })) });

/* ───────── 段 A(受理の表)───────── */
/** 第314便a の世代(原仮定者の裁定(第116報)AN404「R_d は観測半径を超えても受理する」—— 規則の写しで太陽の半径を κ₀M☉ より小さくした本を受理する html)。前の世代は AN404 の拒否で偽 */
export function rdxGen(H) {
  const q = ruleBook(H.HP, 'mercury', { rule: false }); q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.physics.radiusFloor = 0.001; q.bodies[0].m = 1988.5 * 10; q.bodies[0].radius = 0.001;
  return H.HP.validatePreset(clone(q)).ok === true;
}
export function partA(H) {
  const HP = H.HP, rows = [];
  const base = () => ruleBook(HP, 'mercury', { rule: false });
  const gen314 = rdxGen(H);   // 第314便a(世代切替 —— 受理の振る舞いで判定・REGEN_SCOPE は動かさない)
  const T = (lab, mod, ok, re, canon) => {
    const q = base(); mod(q);
    const v = HP.validatePreset(clone(q)), m = (v.errors || []).join(' ');
    let pass;
    if (ok) pass = v.ok && (canon ? canon(v.preset, v) : true);
    else pass = !v.ok && re.test(m);
    rows.push({ case: lab, ok: v.ok, pass, err: v.ok ? null : m.slice(0, 160) });
  };
  const isq = (p) => p.physics.relativeDrag.invSq;
  T('rdRule 省略(K1)', () => {}, true, null, (p) => !('rdRule' in isq(p)));
  T('rdRule null', (q) => { q.physics.relativeDrag.invSq.rdRule = null; }, true, null, (p) => !('rdRule' in isq(p)));
  T('rdRule "kappaM"(K1)', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; }, true, null, (p) => isq(p).rdRule === 'kappaM');
  T('rdRule "kappaM" + kernel 省略(K2)', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; delete q.physics.relativeDrag.invSq.kernel; }, false, /rdRule は kernel:"k1" の本だけ/);
  T('rdRule "kappaM" + kernel "k2"', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.physics.relativeDrag.invSq.kernel = 'k2'; }, false, /rdRule は kernel:"k1" の本だけ/);
  for (const bad of ['KappaM', 'kappa', '', 1, true, ['kappaM'], {}]) T('rdRule ' + JSON.stringify(bad), (q) => { q.physics.relativeDrag.invSq.rdRule = bad; }, false, /rdRule は "kappaM"/);
  T('rdRule + dragCoreDefault', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.physics.relativeDrag.dragCoreDefault = 'cap6500km'; }, false, /dragCoreDefault は invSq\.rdRule と一緒に宣言しない/);
  T('shellRecv 省略', () => {}, true, null, (p) => !('shellRecv' in isq(p)));
  T('shellRecv null', (q) => { q.physics.relativeDrag.invSq.shellRecv = null; }, true, null, (p) => !('shellRecv' in isq(p)));
  T('shellRecv "mass"', (q) => { q.physics.relativeDrag.invSq.shellRecv = 'mass'; }, true, null, (p) => !('shellRecv' in isq(p)));
  T('shellRecv "core"(K1・outerShell)', (q) => { q.physics.relativeDrag.invSq.shellRecv = 'core'; }, true, null, (p) => isq(p).shellRecv === 'core');
  T('shellRecv "core" + outerShell 省略', (q) => { q.physics.relativeDrag.invSq.shellRecv = 'core'; delete q.physics.relativeDrag.invSq.outerShell; }, false, /shellRecv:"core" は outerShell と一緒にだけ/);
  T('shellRecv "core" + K2', (q) => { q.physics.relativeDrag.invSq.shellRecv = 'core'; delete q.physics.relativeDrag.invSq.kernel; }, false, /shellRecv:"core" は kernel:"k1" の本だけ/);
  for (const bad of ['Core', 'shell', 0, false, ['core']]) T('shellRecv ' + JSON.stringify(bad), (q) => { q.physics.relativeDrag.invSq.shellRecv = bad; }, false, /shellRecv は "mass"/);
  // 第314便a(世代切替): R_d > 観測半径を受理する html では受理して警告 1 行(AN404 —— 第116報)・前の世代は拒否(AN404 —— 第313便a)
  T('規則 + 太陽の半径 1.0e-3 < κ₀M☉ = 1.75e-4 × 10(radiusFloor 0.001 —— AN404)', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.physics.radiusFloor = 0.001; q.bodies[0].m = 1988.5 * 10; q.bodies[0].radius = 0.001; },
    gen314, gen314 ? null : /AN404/, gen314 ? (p, v) => p.bodies[0].radius === 0.001 && (v.warnings || []).some((w) => /AN404/.test(w)) : undefined);
  T('規則 + 太陽の半径 0.001(radiusFloor —— R_d = κ₀M☉ の内)', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.physics.radiusFloor = 0.001; q.bodies[0].radius = 0.001; }, true, null, (p) => p.bodies[0].radius === 0.001);
  T('規則 + dragCore:{massFrac:0.5}(radius の省略)', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.bodies[1].dragCore = { massFrac: 0.5 }; }, true, null, (p) => JSON.stringify(p.bodies[1].dragCore) === '{"massFrac":0.5}');
  // 第314便a(世代切替): 新則の本の明示の radius の文は「正の有限数 —— radius の省略は invSq.rdRule の本だけ」(R_c > radius は受理の世代)・前の世代は「0<R_c≤radius」
  T('規則なし + dragCore:{massFrac:0.5}(radius の省略)', (q) => { q.bodies[1].dragCore = { massFrac: 0.5 }; }, false, gen314 ? /radius の省略は invSq\.rdRule の本だけ/ : /dragCore\.radius は 0<R_c≤radius/);
  T('規則 + 明示の dragCore.radius(規則より優先 —— cap を見ない)', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.bodies[0].dragCore = { massFrac: 1, radius: 0.5 }; }, true, null, (p) => p.bodies[0].dragCore.radius === 0.5);
  T('規則 + dragCore:{massFrac:0.5} + outerShell uniform', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.physics.relativeDrag.invSq.outerShell = 'uniform'; q.bodies[1].dragCore = { massFrac: 0.5 }; }, true, null, (p) => p.bodies[1].dragCore.radius === undefined);
  T('規則 + 群の代表粒子の半径 particleRadius', (q) => { q.physics.relativeDrag.invSq.rdRule = 'kappaM'; q.bodies.push({ type: 'ring', n: 4, cx: 0, cy: 0, rIn: 2000, rOut: 2100, mMin: 1e-6, mMax: 1e-6, spinMin: 0, spinMax: 0, omega: 0, vNoise: 0, vMode: 'none', direction: 1, pinned: false, particleRadius: 1e-3 }); }, false, /particleRadius は invSq\.rdRule の本では宣言しない/);
  return { rows, allPass: rows.every((r) => r.pass), n: rows.length };
}

/* ───────── 段 R(規則の表とビット同一)───────── */
export function partR(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), obs = E(H, 'inertialDragInitObsState'), books = {}, nb = quick ? STEPS_BIT_QUICK : STEPS_BIT;
  const engKap = E(H, 'REL_DRAG_INVSQ_C1');
  for (const b of BOOKS) {
    const qR = ruleBook(HP, b.key), U = unitsOf(qR), zR = simOf(HP, qR);
    if (zR.err) { books[b.key] = { key: b.key, id: b.id, err: zR.err }; continue; }
    const sR = st(zR.S), rr = sR.rdRule;
    const qX = explicitBook(HP, b.key, 'engine'), zX = simOf(HP, qX), sX = zX.err ? null : st(zX.S);
    const qD = explicitBook(HP, b.key, 'declared'), zD = simOf(HP, qD), sD = zD.err ? null : st(zD.S);
    const oR = obs(zR.S), oX = zX.err ? null : obs(zX.S);
    const bitReadout = !!sX && recvJson(sR) === recvJson(sX), bitInit = !!oX && JSON.stringify(oR) === JSON.stringify(oX);
    const fR = run(H, zR.S, nb), fX = zX.err ? null : run(H, zX.S, nb);
    let dRd = 0, dBeta = 0;
    if (sD) for (const r of sR.receivers) { const d = sD.receivers.find((x) => x.i === r.i); dRd = Math.max(dRd, rel(d.Rd, r.Rd)); for (let j = 0; j < r.beta.length; j++) if (r.beta[j] > 0) dBeta = Math.max(dBeta, rel(d.beta[j], r.beta[j])); }
    const G = qR.physics.G * U.Lm ** 3 / (U.Mm * U.Tm ** 2), c = qR.physics.cLight * U.Lm / U.Tm;
    const bodies = rr.bodies.map((x, i) => {
      const mSI = x.m * U.Mm, RdSI = x.Rd * U.Lm, closed = 10 * G * mSI / (C1 * c * c), rs = 2 * G * mSI / (c * c);
      return { name: b.names[i], i, m: x.m, mSI, mDeclared: qR.bodies[i].m, RdBook: x.Rd, RdM: RdSI, closedM: closed, relClosed: rel(RdSI, closed), rdOverRs: RdSI / rs, src: x.src, floored: x.floored,
        R_M: qR.bodies[i].radius * U.Lm, RdOverR: x.Rd / qR.bodies[i].radius };
    });
    books[b.key] = { key: b.key, id: b.id, decl: declOf(qR), kappaBook: rr.kappa, kappaSI: rr.kappaSI, kappaBookSame: rr.kappa === kappaBook(qR.physics), C1Same: rr.C1 === C1 && engKap === C1,
      GSI: G, cSI: c, bodies, bitReadout, bitInit, bitSteps: fR === fX, steps: nb, initOk: !!(oR && oR.ok), declaredMassRelRd: dRd, declaredMassRelBeta: dBeta,
      receivers: sR.receivers.map((r) => ({ i: r.i, Rd: r.Rd, betaSum: r.betaSum })) };
  }
  const rows = RULE_ROWS.map(([name, bk, i]) => Object.assign({ book: bk }, books[bk].bodies[i]));
  const all = Object.values(books);
  return { C1, kappaSI: books.mercury.kappaSI, books, rows,
    maxRelClosed: Math.max(...rows.map((r) => r.relClosed)), maxRdOverRsDev: Math.max(...rows.map((r) => rel(r.rdOverRs, 5 / C1))),
    allBit: all.every((b) => b.bitReadout && b.bitInit && b.bitSteps), allRule: all.every((b) => b.bodies.every((x) => x.src === 'rule')),
    maxDeclaredRelRd: Math.max(...all.map((b) => b.declaredMassRelRd)), maxDeclaredRelBeta: Math.max(...all.map((b) => b.declaredMassRelBeta)) };
}

/* ───────── 段 B(外殻の受け手)───────── */
export function partB(H) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), rows = [], snap = [], near = [];
  const meas = (q) => {
    const z = simOf(HP, q); if (z.err) return { err: z.err };
    const s = st(z.S), r = s.receivers.find((x) => x.i === 1);
    const dx = z.S.x[1] - z.S.x[0], dy = z.S.y[1] - z.S.y[0], dz = z.S.z[1] - z.S.z[0], rn = Math.hypot(dx, dy, dz);
    return { beta: r.beta[0], rot: nrm(r.rot.slice(0, 3)), omega: nrm(r.omega), Rd: r.Rd, md: r.md, shellInfo: r.shell || null, form: C1 * s.rdRule.kappa * z.S.m[0] / rn, r: rn, kappa: s.rdRule.kappa };
  };
  for (const shell of SHELLS) for (const recv of RECVS) for (const f of MD_POINTS) {
    const q = ruleBook(HP, 'mercury', { shell, recv: recv === 'core' ? 'core' : undefined });
    if (f < 1) q.bodies[1].dragCore = { massFrac: f };
    const m = meas(q);
    rows.push(Object.assign({ shell, recv, f, decl: declOf(q) }, m, m.err ? {} : { formDev: rel(m.beta, m.form), shellFrac: 1 - f }));
  }
  // 統括の写しの型(水星の R_d = κ₀m —— 全質量の明示の radius・mass の列 —— 統括の数との照合)
  for (const shell of SHELLS) for (const recv of RECVS) for (const f of MD_POINTS) {
    const q = ruleBook(HP, 'mercury', { shell, recv: recv === 'core' ? 'core' : undefined });
    const k = kappaBook(q.physics);
    q.bodies[1].dragCore = { massFrac: f, radius: k * engineMass(q.bodies[1].m, q.physics) };
    const m = meas(q);
    snap.push(Object.assign({ shell, recv, f }, m));
  }
  // 近距離の場(外殻を持つ水星 m_d/M = 0.5 の観測半径の d 倍に試験の受け手 —— 質量の下限の天体・半径 10 km)
  for (const shell of SHELLS) for (const d of NEAR_D) {
    const one = {};
    for (const recv of RECVS) {
      const q = ruleBook(HP, 'mercury', { shell, recv: recv === 'core' ? 'core' : undefined });
      delete q.physics.relativeDrag.initMotion; delete q.physics.relativeDrag.spinDrag.initSpin;   // 源(水星)の慣性自転が受け手の型の分解で変わらないように(観測の初期値の分解なし)
      q.bodies[1].dragCore = { massFrac: 0.5 };
      const M = q.bodies[1], Rm = M.radius;
      q.bodies.push({ type: 'single', m: 1e-6, radius: 1e-4, x: M.x, y: M.y, z: (M.z || 0) + d * Rm, vx: M.vx, vy: M.vy, vz: M.vz || 0, spin: 0, pinned: false });
      const z = simOf(HP, q);
      if (z.err) { one[recv] = { err: z.err }; continue; }
      const s = st(z.S), r = s.receivers.find((x) => x.i === 2), m1 = s.receivers.find((x) => x.i === 1);
      one[recv] = { beta: r.beta[1], betaShell: r.betaSrcShell ? r.betaSrcShell[1] : null, rot: nrm(r.rot.slice(3, 6)), rotShell: r.rotSrcShell ? nrm(r.rotSrcShell.slice(3, 6)) : null, omega: nrm(r.omega),
        row: JSON.stringify(r), mercuryBeta: m1.beta[0] };
    }
    const a = one.mass, b = one.core;
    near.push({ shell, d, decl: 'mercury m_d/M=0.5 + 試験の受け手 m=1e-6・R=1e-4(本の単位)を水星の中心から ' + d + ' × R', mass: a, core: b,
      bitSame: !!(a && b && !a.err && !b.err && a.row === b.row), shellFrac: (a && !a.err && a.beta > 0) ? a.betaShell / a.beta : null, rotShellFrac: (a && !a.err && a.rot > 0) ? a.rotShell / a.rot : null });
  }
  for (const n of near) { if (n.mass) delete n.mass.row; if (n.core) delete n.core.row; }
  const core = rows.filter((r) => r.recv === 'core' && !r.err), mass = rows.filter((r) => r.recv === 'mass' && !r.err);
  const coreSpread = (sh) => { const v = core.filter((r) => r.shell === sh).map((r) => r.beta); return Math.max(...v) / Math.min(...v) - 1; };
  return { rows, snap, near,
    coreFormDevMax: Math.max(...core.map((r) => r.formDev)), coreSpread: { thin: coreSpread('thin'), uniform: coreSpread('uniform') },
    massShellFracDev: Math.max(...mass.filter((r) => r.f <= 0.99).map((r) => Math.abs(r.beta / r.shellFrac - 1))),
    nearBitSame: near.every((n) => n.bitSame), nearShellFrac: near.map((n) => n.shellFrac), allAccepted: rows.every((r) => !r.err) && snap.every((r) => !r.err) };
}

/* ───────── 段 E(エンジン)───────── */
export function partE(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), obs = E(H, 'inertialDragInitObsState'), nst = quick ? STEPS_QUICK : STEPS, rows = [];
  const one = (lab, q) => {
    const z = simOf(HP, q);
    if (z.err) return { case: lab, decl: declOf(q), accepted: false, err: z.err };
    const s0 = st(z.S), o = obs(z.S), dt = E(H, 'appStepDt')(z.S);
    let finite = true;
    for (let k = 0; k < nst; k++) { z.S.step(dt); for (let i = 0; i < z.S.n; i++) if (![z.S.x[i], z.S.y[i], z.S.z[i], z.S.vx[i], z.S.vy[i], z.S.vz[i]].every(Number.isFinite)) finite = false; }
    const s1 = st(z.S);
    return { case: lab, decl: declOf(q), accepted: true, warnings: z.warnings.filter((w) => /値域|massFloor|m を/.test(w)).slice(0, 3), initOk: !!(o && o.ok), initWhy: o ? (o.why || null) : null,
      rdRule: s0.rdRule.bodies.map((b) => ({ i: b.i, m: b.m, Rd: b.Rd, src: b.src, floored: b.floored, rdOverRs: b.rdOverRs })),
      betaMax0: Math.max(...s0.receivers.map((r) => r.betaSum)), betaMaxRun: s1.betaMax, steps: nst, finite,
      badRow: z.S.inertialDragIsqBadRow || 0, lowDen: z.S.inertialDragIsqLowDen || 0, overlap: s1.overlapSteps, tooLarge: s1.tooLarge };
  };
  for (const b of BOOKS) rows.push(Object.assign({ key: b.key, id: b.id }, one(b.emoji + ' ' + b.ja, ruleBook(HP, b.key, { shell: 'uniform' }))));
  // 質量の下限の天体(水星の宣言の質量 1e-12 → 下限 1e-6 へ持ち上げる —— 規則はエンジンが使う質量から)
  const qf = ruleBook(HP, 'mercury', { shell: 'uniform' }); qf.bodies[1].m = 1e-12;
  const fl = Object.assign({ key: 'floored', id: 'mercurySunInertial3d' }, one('🌡️ 水星の質量 1e-12(宣言)→ 下限', qf));
  const ph = qf.physics, k = kappaBook(ph);
  fl.expectRd = k * engineMass(1e-6, ph);
  fl.flooredOk = fl.accepted && fl.rdRule[1].floored === true && fl.rdRule[1].Rd === fl.expectRd && fl.rdRule[0].floored === false;
  return { rows, floored: fl, allOk: rows.every((r) => r.accepted && r.initOk && r.finite && r.badRow === 0) && fl.flooredOk };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  return {
    acceptance: J.A.allPass,
    ruleClosedForm: J.R.maxRelClosed < 1e-14,
    ruleOverRs: J.R.maxRdOverRsDev < 1e-14,
    ruleAllBodies: J.R.allRule,
    explicitBitSame: J.R.allBit,
    kappaFixed: Object.values(J.R.books).every((b) => b.kappaBookSame && b.C1Same),
    shellAccepted: J.B.allAccepted,
    coreForm: J.B.coreFormDevMax < 1e-5,
    coreIndependentOfShell: J.B.coreSpread.thin < 1e-6 && J.B.coreSpread.uniform < 1e-6,
    massShellFraction: J.B.massShellFracDev < 2e-2,
    nearFieldShellSource: J.B.nearBitSame && J.B.near.every((n) => n.shellFrac > 0.49 && n.shellFrac < 0.51),
    engine: J.E.allOk,
  };
}

/* ───────── 文書の表と数(PHYSICS〔第313便a〕—— QA docs.kappaM313 が正本から作り直して逐語で照合する)───────── */
const e3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toExponential(3);
const e2 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toExponential(2);
const fl = (v, floor = 1e-12) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : (Math.abs(v) < floor ? '< ' + Number(floor).toExponential(0) : Number(v).toExponential(2)));
const len = (m) => (m >= 1e3 ? (m / 1e3).toPrecision(5) + ' km' : m >= 1 ? m.toPrecision(5) + ' m' : (m * 1e3).toPrecision(5) + ' mm');
export function physicsTables(J) {
  const out = [];
  out.push('| 天体(写し) | m [kg](エンジンが使う質量) | R_d = κ₀m | R_d/R(観測半径) | R_d/r_s | 閉じた式 10Gm/(C₁c²) との相対の差 |', '|---|---|---|---|---|---|');
  for (const r of J.R.rows) out.push(`| ${JA[r.name]}(${BOOKS.find((b) => b.key === r.book).emoji}) | ${e3(r.mSI)} | ${len(r.RdM)} | ${e2(r.RdOverR)} | ${r.rdOverRs.toFixed(6)} | ${fl(r.relClosed, 1e-15)} |`);
  out.push('', '| 写し(K1 + rdRule・外殻 uniform・観測の初期値の分解) | 規則と明示の dragCore(κ₀·m —— エンジンと同じ値)の読み口・分解・' + J.R.books.mercury.steps + ' 步 | 宣言の質量で置いた写しとの R_d・β の相対の差の最大 | 受理・分解 | ' + J.E.rows[0].steps + ' 步 | β の最大(t = 0) | badRow・lowDen |', '|---|---|---|---|---|---|---|');
  for (const b of BOOKS) {
    const R = J.R.books[b.key], Ev = J.E.rows.find((x) => x.key === b.key);
    out.push(`| ${b.emoji} ${b.ja} | ${R.bitReadout && R.bitInit && R.bitSteps ? 'ビット同一' : '違う'} | ${e2(R.declaredMassRelRd)}・${e2(R.declaredMassRelBeta)} | ${Ev.accepted ? '受理' : '拒否'}・${Ev.initOk ? '分解した' : '分解しない'} | ${Ev.finite ? '有限' : '非有限'} | ${e3(Ev.betaMax0)} | ${Ev.badRow}・${Ev.lowDen} |`);
  }
  out.push('', '| 外殻の受け手(☿ の写し・太陽 κ₀M☉・水星 dragCore:{massFrac} —— R_d = κ₀m_d) | m_d/M = 1 | 0.999999 | 0.99 | 0.5 |', '|---|---|---|---|---|');
  for (const shell of SHELLS) for (const recv of RECVS) {
    const v = MD_POINTS.map((f) => J.B.rows.find((r) => r.shell === shell && r.recv === recv && r.f === f));
    out.push(`| β(☿ ← ☉)・${shell}・${recv} | ${v.map((r) => e3(r.beta)).join(' | ')} |`);
  }
  for (const shell of SHELLS) {
    const v = MD_POINTS.map((f) => J.B.rows.find((r) => r.shell === shell && r.recv === 'core' && r.f === f));
    out.push(`| core の β と C₁κ₀M☉/r の相対の差・${shell} | ${v.map((r) => e2(r.formDev)).join(' | ')} |`);
  }
  for (const shell of SHELLS) for (const recv of RECVS) {
    const v = MD_POINTS.map((f) => J.B.rows.find((r) => r.shell === shell && r.recv === recv && r.f === f));
    out.push(`| 回転の係数・軸の ω・${shell}・${recv} | ${v.map((r) => e2(r.rot) + '・' + e2(r.omega)).join(' | ')} |`);
  }
  out.push('', '| 統括の写しの型(水星の R_d = κ₀m —— 全質量の明示の radius) | m_d/M = 1 | 0.999999 | 0.99 | 0.5 |', '|---|---|---|---|---|');
  for (const shell of SHELLS) for (const recv of RECVS) {
    const v = MD_POINTS.map((f) => J.B.snap.find((r) => r.shell === shell && r.recv === recv && r.f === f));
    out.push(`| β(☿ ← ☉)・${shell}・${recv} | ${v.map((r) => e3(r.beta)).join(' | ')} |`);
  }
  out.push('', '| 近距離の場(水星 m_d/M = 0.5 の観測半径の d 倍の試験の受け手) | d | β(受け手 ← 水星) | 源の外殻の分の割合 | 回転の係数の外殻の分の割合 | mass と core |', '|---|---|---|---|---|---|');
  for (const n of J.B.near) out.push(`| ${n.shell} | ${n.d} | ${e3(n.mass.beta)} | ${n.shellFrac.toFixed(6)} | ${n.rotShellFrac === null ? '—' : n.rotShellFrac.toFixed(6)} | ${n.bitSame ? 'ビット同一' : '違う'} |`);
  out.push('', '| 照合 | 値 |', '|---|---|');
  out.push(`| 受理の表(rdRule・shellRecv の値と組み合わせ・AN404・radius の省略・明示の優先・群の代表粒子の半径) | ${J.A.rows.filter((r) => r.pass).length}/${J.A.n} |`);
  out.push(`| C₁(閉じた式)・κ₀(本の単位の読み口から SI へ) | ${J.R.C1.toFixed(10)}・${e3(J.R.kappaSI)} m/kg |`);
  out.push(`| 質量の下限の天体(宣言 1e-12 → 下限): 読み口 floored・R_d = κ₀ × 下限 | ${J.E.floored.flooredOk ? '記録した' : '違う'}・${e3(J.E.floored.rdRule[1].Rd * 1e8)} m |`);
  return out.join('\n');
}
export function docNumbers(J) {
  const r = (n) => J.R.rows.find((x) => x.name === n);
  return [J.R.C1.toFixed(10), e3(J.R.kappaSI), len(r('sun').RdM), len(r('mercury').RdM), len(r('jupiter').RdM), len(r('moon').RdM), (5 / J.R.C1).toFixed(6)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const A = partA(H); tick('A');
  const R = partR(H, quick); tick('R');
  const B = partB(H); tick('B');
  const Ev = partE(H, quick); tick('E');
  const J = { quick, A, R, B, E: Ev };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 新則の鍵と読み口を読む既存の器・正本の扱い(第313便a の枝で scratch で走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w312a-decay.mjs・exp-w312b-galaxialrd.mjs・exp-w311d-planet3.mjs・exp-w312d-confirm.mjs・exp-w311a-corespin.mjs', reads: 'invSq の受理と K1/K2 の核・読み口', handling: 'rdRule・shellRecv を宣言しない —— 省略は今と同じ経路(正本の値は不変 —— scratch で照合)' },
];

export async function main() {
  const TARGET = process.env.W313A_TARGET || 'beta/index.html';
  const OUT = process.env.W313A_OUT || path.join(ROOT, 'tests', 'out', 'kappam-w313a.json');
  const quick = process.env.W313A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w313a-kappam.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第115報)AN399 K1 を採用・AN402 太陽を含む全天体に R_d = κm(重力半径に比例する長さ)・補足(外殻は近距離の計算に要る・厚みは考えない・6.5e6 m は K2 の未宣言の上限 —— K1 では無視)・決断事項 AN403・AN404・統括の検証項目 R234',
    rdRuleVersion: E(H, 'REL_DRAG_INVSQ_RDRULE_VERSION'), shellRecvVersion: E(H, 'REL_DRAG_INVSQ_SHELL_RECV_VERSION'), kernelVersion: E(H, 'REL_DRAG_INVSQ_KERNEL_VERSION'),
    versionReaders: VERSION_READERS, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w313a-kappam.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w306a-an336.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第313便a', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
  for (const b of Object.values(out.R.books)) console.log('R', b.id, JSON.stringify(b.decl.invSq), b.bodies.map((x) => x.name + ' m=' + x.m + ' R=' + x.R_M.toExponential(3) + ' Rd=' + x.RdM.toExponential(4)).join(' / '));
}
if (IS_MAIN) await main();

// 第314便b(原仮定者の裁定(第116報)の補足「現状の R_d = κm = Gm/c² が重力半径(シュヴァルツシルト半径)= 2Gm/c² = 2κm の半分だが、置き換えて(2κm を使用して)引きずりの式を
// 合わせた場合を検討する。κ の認識が違い複雑化する場合は採用せず、解説を行う」・統括の検証項目 R239):
// **R_d の倍率の器**(検討と解説の材料 —— html・本の宣言・エンジンの式・規則の鍵 invSq.rdRule:"kappaM"〔κ₀ = 10G/(C₁c²)〕は 1 bit も変えない。写しは器の中で組む・
// 在位の本は宣言しない・合わせない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState をそのまま呼ぶ・1 プロセス)。
//
// ■ 段
//   K(式の整理 —— 純関数 formulaOf・bodyRow): C₁ = 6[(√3/2)ln(2+√3) − 1] の閉じた式・κ₀ = 10G/(C₁c²)(本の G・c —— SI の換算も本の G)・κ₀ と G/c²・2G/c² の比(10/C₁・5/C₁)・
//     置き換えの倍率 a(C₁/10 → R_d = Gm/c²・C₁/5 → R_d = r_s = 2Gm/c²・2 → R_d = 2κ₀m)・κ₀ の導出の数(水星の写し: 1PN の q_1PN・在位の G_loc の解析の一次 ΔqG・
//     引きずりの分の標的 t_D = q_1PN − ΔqG ≈ (5/3) q_1PN)・天体の表(太陽・水星〜海王星・月 —— 在位の本の宣言の質量と観測半径から Gm/c²・r_s・R_d・観測半径との比)。
//     エンジンの C₁・κ₀ は規則の鍵の写しの読み口 rdRule から読む(閉じた式とビット同一か)。
//   S(倍率の実測 —— t = 0 の写し): 🌡️ 水星・🏀 木星の写し(第306便a の世代の凍結の写し tests/data-w306a-decl305.json・G_loc を外す・K1 の新則 —— 全天体に明示の dragCore
//     {massFrac:1, radius: s·(κ₀·m)}〔m はエンジンが使う質量・s = 1 は規則の鍵 rdRule:"kappaM" と読み口がビット同一〕)で、受け手(惑星)だけ・源(太陽)だけ・両方の R_d を
//     a ∈ {C₁/10, C₁/5, 1/2, 2} 倍にして、読み口の β(惑星 ← 太陽)・回転の係数(|rot| —— 源の自転を掛ける前の係数)・軸の ω(|ω| —— 源の自転を含む)の比 X(a)/X(1) と
//     冪 p = ln(比)/ln a。太陽を受け手にした行も記録(役割が入れ替わる)。元へ戻すのに要る係数 X(1)/X(a)。
//   P(置き換えた本の近点の見積り —— 短い走行): ☿ の写し q00・q10(G_loc の固定の宣言)・q11(K1・G_loc + 両天体の dragCore a·(κ₀·m))× a ∈ {1, C₁/10, C₁/5, 2}・刻み h・2 公転。
//     D_G(a) = q11 − q10・D_G(a)/D_G(1)・r_1PN = q11 − q00 − q_1PN(抽出器は第304便e の近点率の回帰 K = 3 —— 窓は 0〜N 公転)。
//   R(宣言の長さだけの再パラメータ化 —— 同値): 宣言の長さ ℓ = r_s = 2Gm/c²(本の単位・エンジンの質量)・内部の有効長 R_eff = (5/C₁)ℓ を dragCore の半径に置いた写しと
//     κ₀m の写しの t = 0 の読み口の相対の差(核・自己の場・回転・軸・重なりの判定は全部 dragCore の半径 = R_eff を使う)。
//   C(結論 conclusionOf): 原仮定者の条件「κ の認識が違い複雑化する場合は採用せず、解説を行う」に照らした判定(採用しない理由の列 —— 実測から)。
//
// ■ 言わないこと: 「法則を確かめた」「フィットした」「較正した」「完全に一致」「確認した」「収束した」「R_d を決めた」と、R_d を重力半径そのものと書くこと。R_d は重力半径に
//   比例する長さ(天体の大きさではない)。κ₀ は一次の値(合わせない —— 本便も κ₀ を動かさない)。
//
// ■ 使い方
//   node tests/exp-w314b-rdscale.mjs   → 正本 tests/out/rdscale-w314b.json(段 rdscale-314b)
//   W314B_OUT=<json> で出力先を変える(試走は正本を書かない)・W314B_TARGET=<html>(既定 beta/index.html)・W314B_QUICK=1(段 P を 1 公転 × a = 1・C₁/5 に縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限)
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w314b-rdscale-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const nrm = (v) => Math.hypot(v[0], v[1], v[2]);
const NOT_CLAIM = ['法則を確かめた', 'フィットした', '較正した', '完全に一致', '確認した', '収束した', 'R_d を決めた'];
export const DECL_FILE = 'tests/data-w306a-decl305.json';
const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
/** C₁ = 6[(√3/2) ln(2 + √3) − 1](閉じた式 —— 器の中で独立に) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
/** 照合の門の参照(DECISIONS の閉じた項 —— 本の G = 6.674×10⁻¹¹・c = 2.99792458×10⁸ の κ₀ [m/kg]) */
export const C1_REF = 0.8431139667;
export const KAPPA0_REF = 8.80761886e-27;
/** 置き換えの倍率(R_d → a·R_d)。gm: κ = G/c² と読んだ R_d = κm・rs: 同じ読みの 2κm(= r_s)・two: 今の κ₀ と読んだ 2κm */
export const SCALES = Object.freeze([
  Object.freeze({ key: 'gm', a: C1 / 10, ja: 'C₁/10', to: 'Gm/c²' }),
  Object.freeze({ key: 'rs', a: C1 / 5, ja: 'C₁/5', to: 'r_s = 2Gm/c²' }),
  Object.freeze({ key: 'half', a: 0.5, ja: '1/2', to: '(1/2)κ₀m' }),
  Object.freeze({ key: 'two', a: 2, ja: '2', to: '2κ₀m' })]);
export const scaleOf = (k) => SCALES.find((s) => s.key === k) || null;
/** R_d を変える天体: recv = 受け手(段 S の惑星)だけ・src = 源(太陽)だけ・both = 両方 */
export const MODES = Object.freeze(['recv', 'src', 'both']);
export const MODE_JA = Object.freeze({ recv: '受け手だけ', src: '源だけ', both: '両方' });
export const QTYS = Object.freeze(['beta', 'rot', 'omega']);
export const QTY_JA = Object.freeze({ beta: 'β(並進)', rot: '回転の係数', omega: '軸の ω' });
/** 解析の冪(弱結合の一次 —— β = ⟨m_d,j K1_j/W⟩ の分母 W は受け手の自己の場 m_i/R_d,i が大半・K1 は源の球の外で 1/r(源の R_d に依らない)・回転と軸は源の第 1 モーメント
 *  M₁ = R_d,j²/(5r²) を通る)。実測の冪と分けて記録する(門は実測と解析の差) */
export const EXPECT_POW = Object.freeze({ recv: Object.freeze({ beta: 1, rot: 1, omega: 1 }), src: Object.freeze({ beta: 0, rot: 2, omega: 2 }), both: Object.freeze({ beta: 1, rot: 3, omega: 3 }) });
/** 冪の門の幅(β・回転は分母に入る他の源の場の割合〔水星で 3e-7 の程度〕・軸は受け手の上の源の距離の変化を倍精度で表す丸めの尺度 ε r/R_d〔〔第313便b〕④〕の分) */
export const POW_TOL = Object.freeze({ beta: 1e-5, rot: 1e-5, omega: 2e-3 });
export const SYSTEMS = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', ja: '水星', sym: '☿' }),
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '木星', sym: '♃' })]);
export const sysOf = (k) => SYSTEMS.find((s) => s.key === k) || null;
/** 天体の表の行(在位の本の宣言 —— 太陽は 🌡️ の本の値) */
export const BODY_ROWS = Object.freeze([
  ['sun', 'mercurySunInertial3d', 0, '☀️ 太陽'], ['mercury', 'mercurySunInertial3d', 1, '🌡️ 水星'], ['venus', 'venusSunInertial3d', 1, '🌋 金星'],
  ['earth', 'earthMoonSunInertial3d', 1, '🌍 地球'], ['moon', 'earthMoonSunInertial3d', 2, '🌙 月'], ['mars', 'marsSunInertial3d', 1, '🔴 火星'],
  ['jupiter', 'jupiterSunInertial3d', 1, '🏀 木星'], ['saturn', 'saturnSunInertial3d', 1, '🪐 土星'], ['uranus', 'uranusSunInertial3d', 1, '🧊 天王星'],
  ['neptune', 'neptuneSunInertial3d', 1, '🔵 海王星']].map((z) => Object.freeze(z)));
/** 段 P の計画(正本)と試走 */
export const P_PLAN = Object.freeze({ N: 2, scales: Object.freeze([1, C1 / 10, C1 / 5, 2]) });
export const P_QUICK = Object.freeze({ N: 1, scales: Object.freeze([1, C1 / 5]) });
/** 器の刻み h(lib-w299c-planets3d の stepsOf(pRef).h と同じ式 —— 第306便a の刻み。lib は allPresets() を値で読むので import しない —— 器の領域を "all" にしない) */
export const hOf = (pRef) => Number((0.016 * pRef / (7600521.6 / 1e4)).toPrecision(4));

/* ───────── 純関数(式の整理 —— QA docs.rdScale314 が作り直して照合する)───────── */
const unitsOf = (se) => ({ Lm: Math.pow(10, se.L), Tm: Math.pow(10, se.T), Mm: Math.pow(10, se.M) });
/** 式の数。inp = {G, cLight, scaleExp(本の単位の G・c), q1pn, dqG(水星の写しの ″/世紀)} */
export function formulaOf(inp) {
  const U = unitsOf(inp.scaleExp), G = inp.G * U.Lm ** 3 / (U.Mm * U.Tm ** 2), c = inp.cLight * U.Lm / U.Tm;
  const kappaBook = (10 * inp.G) / (C1 * inp.cLight * inp.cLight), kappaSI = (10 * G) / (C1 * c * c), gOverC2 = G / (c * c);
  const tD = inp.q1pn - inp.dqG;
  return { C1, kappaBook, GSI: G, cSI: c, kappaSI, gOverC2, kappaOverGc2: kappaSI / gOverC2, rdOverRs: kappaSI / (2 * gOverC2), tenOverC1: 10 / C1, fiveOverC1: 5 / C1,
    aGm: C1 / 10, aRs: C1 / 5, c1KappaOver10Gc2: C1 * kappaSI / (10 * gOverC2), q1pn: inp.q1pn, dqG: inp.dqG, tD, tDOverQ: tD / inp.q1pn, dqGOverQ: inp.dqG / inp.q1pn };
}
/** 天体の表の 1 行。inp = {name, id, i, ja, m, R(本の単位), scaleExp, G, cLight} */
export function bodyRow(inp) {
  const U = unitsOf(inp.scaleExp), G = inp.G * U.Lm ** 3 / (U.Mm * U.Tm ** 2), c = inp.cLight * U.Lm / U.Tm, m = inp.m * U.Mm, R = inp.R * U.Lm;
  const gm = G * m / (c * c), rs = 2 * gm, kappa = (10 * G) / (C1 * c * c), Rd = kappa * m;
  return { name: inp.name, id: inp.id, i: inp.i, mSI: m, RSI: R, gm, rs, Rd, rdOverRs: Rd / rs, rdOverGm: Rd / gm, rdOverR: Rd / R, rsOverR: rs / R };
}
/** 冪と戻す係数(比から) */
export const powOf = (ratio, a) => Math.log(ratio) / Math.log(a);
export const restoreOf = (ratio) => 1 / ratio;

/* ───────── 写し ───────── */
/** K1 の新則の宣言(第311便d の NEW_DRAG から dragCoreDefault を外す —— 全天体に明示の dragCore を置く) */
export function dragK1() { const rd = clone(Q.NEW_DRAG); delete rd.dragCoreDefault; rd.invSq.kernel = 'k1'; return rd; }
/** κ₀(本の単位 —— エンジンと同じ演算の順 (10·G)/(C₁·c·c))とエンジンが使う質量(massPrecision が single の本は Float32) */
export const kappaBook = (ph) => (10 * ph.G) / (C1 * ph.cLight * ph.cLight);
export const engineMass = (m, ph) => (ph.massPrecision === 'double' ? m : Math.fround(m));
/** 凍結の写しの基(G_loc を外す —— 段 S・R) */
function baseOf(HP, key) { const q = Q.pinnedBook(HP, PIN, sysOf(key).id); delete q.physics.gLoc; return q; }
/** 倍率の写し: 惑星の R_d = sP·(κ₀·m)・太陽の R_d = sS·(κ₀·m)(明示の dragCore・m はエンジンが使う質量) */
export function scaledBook(HP, key, sP, sS) {
  const q = baseOf(HP, key); q.physics.relativeDrag = dragK1();
  const ph = q.physics, k = kappaBook(ph);
  q.bodies[0].dragCore = { massFrac: 1, radius: sS * (k * engineMass(q.bodies[0].m, ph)) };
  q.bodies[1].dragCore = { massFrac: 1, radius: sP * (k * engineMass(q.bodies[1].m, ph)) };
  return q;
}
/** 規則の鍵の写し(全天体 R_d = κ₀m_d —— エンジンが置く) */
export function ruleBook(HP, key) { const q = baseOf(HP, key); q.physics.relativeDrag = dragK1(); q.physics.relativeDrag.invSq.rdRule = 'kappaM'; return q; }
/** 再パラメータ化の写し: 宣言の長さ ℓ = r_s = (2·G·m)/(c·c)・dragCore の半径 R_eff = (5/C₁)·ℓ */
export function reparamBook(HP, key) {
  const q = baseOf(HP, key); q.physics.relativeDrag = dragK1();
  const ph = q.physics;
  for (const b of q.bodies) { const ell = (2 * ph.G * engineMass(b.m, ph)) / (ph.cLight * ph.cLight); b.dragCore = { massFrac: 1, radius: (5 / C1) * ell }; }
  return q;
}
const declOf = (q) => ({ id: q.id, invSq: q.physics.relativeDrag.invSq, bodies: q.bodies.map((b) => ({ m: b.m, R: b.radius, Rd: b.dragCore ? (b.dragCore.radius === undefined ? null : b.dragCore.radius) : null, pinned: !!b.pinned })) });
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: (v.errors || []).join(' ').slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset };
}
/** t = 0 の読み口(惑星 ← 太陽・太陽 ← 惑星) */
function readout(HP, q) {
  const z = simOf(HP, q); if (z.err) return { err: z.err };
  const S = z.S, s = HP.inertialDragIsqState(S);
  if (!s || s.overlap) return { err: '読み口が無い・重なり' };
  const dist = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]);
  const row = (i, j) => { const r = s.receivers.find((x) => x.i === i);
    return { i, j, Rd: r.Rd, md: r.md, beta: r.beta[j], rot: nrm(r.rot.slice(3 * j, 3 * j + 3)), omega: nrm(r.omega), spinSrc: S.spin[j], roundScale: Math.pow(2, -52) * dist / r.Rd }; };
  return { planet: row(1, 0), sun: row(0, 1), dist, betaMax: Math.max(...s.receivers.map((r) => r.betaSum)), receiversJson: JSON.stringify(s.receivers), rdRule: s.rdRule || null };
}

/* ───────── 段 K(式の整理)───────── */
export function partK(HP) {
  const live = (id) => { const p = HP.allPresets().find((x) => x.id === id); if (!p) throw new Error('本が無い: ' + id); return p; };
  const mer = Q.pinnedBook(HP, PIN, 'mercurySunInertial3d'), pn = AN.pn1Of(mer), dqG = Q.gLocAnalytic(mer, 2);
  const inp = { G: mer.physics.G, cLight: mer.physics.cLight, scaleExp: clone(mer.scaleExp), q1pn: pn.value, dqG };
  const f = formulaOf(inp);
  const bodyInputs = BODY_ROWS.map(([name, id, i, ja]) => { const p = live(id), b = p.bodies[i];
    return { name, id, i, ja, m: b.m, R: b.radius, scaleExp: clone(p.scaleExp), G: p.physics.G, cLight: p.physics.cLight }; });
  const bodies = bodyInputs.map(bodyRow);
  // エンジンの C₁・κ₀(規則の鍵の写しの読み口 —— 閉じた式とビット同一か)
  const eng = {};
  for (const s of SYSTEMS) { const z = simOf(HP, ruleBook(HP, s.key)); const r = z.err ? null : HP.inertialDragIsqState(z.S).rdRule;
    eng[s.key] = r ? { C1: r.C1, kappa: r.kappa, kappaSI: r.kappaSI, rdOverRs: r.rdOverRs, C1Same: r.C1 === C1, kappaSame: r.kappa === kappaBook(z.preset.physics) } : { err: z.err || '読み口が無い' }; }
  return { inputs: inp, bodyInputs, formula: f, bodies, engine: eng, mercuryPn1: { a: pn.a, e: pn.e, P: pn.P, formulaVersion: pn.formulaVersion },
    maxRdOverRsDev: Math.max(...bodies.map((b) => rel(b.rdOverRs, 5 / C1))), maxRdOverGmDev: Math.max(...bodies.map((b) => rel(b.rdOverGm, 10 / C1))) };
}

/* ───────── 段 S(倍率の実測 —— t = 0)───────── */
const SWAP = { recv: 'src', src: 'recv', both: 'both' };
export function partS(HP) {
  const out = { systems: {}, rows: [] };
  for (const sy of SYSTEMS) {
    const q1 = scaledBook(HP, sy.key, 1, 1), b1 = readout(HP, q1), qr = ruleBook(HP, sy.key), br = readout(HP, qr);
    const sys = { key: sy.key, id: sy.id, decl: declOf(q1), base: b1.err ? { err: b1.err } : { planet: b1.planet, sun: b1.sun, dist: b1.dist, betaMax: b1.betaMax },
      ruleBitSame: !b1.err && !br.err && b1.receiversJson === br.receiversJson, configs: [] };
    for (const mode of MODES) for (const sc of SCALES) {
      const sP = mode === 'src' ? 1 : sc.a, sS = mode === 'recv' ? 1 : sc.a, q = scaledBook(HP, sy.key, sP, sS), x = readout(HP, q);
      sys.configs.push({ mode, scale: sc.key, a: sc.a, decl: declOf(q), err: x.err || null, betaMax: x.err ? null : x.betaMax,
        RdPlanet: x.err ? null : x.planet.Rd, RdSun: x.err ? null : x.sun.Rd, roundScalePlanet: x.err ? null : x.planet.roundScale, spinSunSame: !x.err && x.planet.spinSrc === b1.planet.spinSrc });
      if (x.err || b1.err) continue;
      for (const recv of ['planet', 'sun']) {
        const role = recv === 'planet' ? mode : SWAP[mode];
        for (const qty of QTYS) {
          const v = x[recv][qty], v1 = b1[recv][qty], ratio = v / v1, pow = powOf(ratio, sc.a), expect = EXPECT_POW[role][qty];
          out.rows.push({ sys: sy.key, recv, mode, role, scale: sc.key, a: sc.a, qty, value: v, base: v1, ratio, pow, expect, dev: Math.abs(pow - expect), restore: restoreOf(ratio) });
        }
      }
    }
    out.systems[sy.key] = sys;
  }
  const rr = out.rows;
  out.devMax = Object.fromEntries(QTYS.map((qq) => [qq, Math.max(...rr.filter((r) => r.qty === qq).map((r) => r.dev))]));
  out.powOk = rr.length === SYSTEMS.length * MODES.length * SCALES.length * 2 * QTYS.length && rr.every((r) => r.dev <= POW_TOL[r.qty] && Number.isFinite(r.ratio) && r.ratio > 0);
  out.allAccepted = Object.values(out.systems).every((s) => !s.base.err && s.configs.every((c) => !c.err));
  out.spinUnchanged = Object.values(out.systems).every((s) => s.configs.every((c) => c.spinSunSame));
  out.ruleBitSame = Object.values(out.systems).every((s) => s.ruleBitSame);
  return out;
}
/** 段 S の行を引く */
export const sRow = (J, sys, recv, mode, scale, qty) => J.S.rows.find((r) => r.sys === sys && r.recv === recv && r.mode === mode && r.scale === scale && r.qty === qty) || null;

/* ───────── 段 P(置き換えた本の近点の見積り —— 短い走行)───────── */
/** 走行の本(☿ の凍結の写し —— q00・q10 は第311便d の bookOf・q11 は G_loc + K1 + 両天体の dragCore a·(κ₀·m)) */
export function bookP(HP, kind, a) {
  const base = Q.pinnedBook(HP, PIN, 'mercurySunInertial3d');
  if (kind !== 'q11') return Q.bookOf(base, kind);
  const q = Q.bookOf(base, 'q10'); q.physics.relativeDrag = dragK1();
  const ph = q.physics, k = kappaBook(ph);
  for (const b of q.bodies) b.dragCore = { massFrac: 1, radius: a * (k * engineMass(b.m, ph)) };
  return q;
}
/** 1 本の走行: 刻み dt で N 公転(初期の軌道面の角の累積)まで・近点率の回帰(第304便e —— K = 3・窓 0〜N 公転) */
export function runAps(HP, q, dt, N) {
  const z = simOf(HP, q); if (z.err) return { err: z.err };
  const S = z.S, mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m), smp = AP.attachSampler(S, { ci: 0, oi: 1, mu }), s = smp.samples();
  const goal = 2 * Math.PI * N, t0 = Date.now(); let k = 0, tEnd = null, nan = false;
  for (; k < 5e7; k++) {
    S.step(dt);
    const L = s.th.length, th = Math.abs(s.th[L - 1]);
    if (!Number.isFinite(th) || !Number.isFinite(S.x[1])) { nan = true; break; }
    if (th >= goal) { const thp = L > 1 ? Math.abs(s.th[L - 2]) : 0, tp = L > 1 ? s.t[L - 2] : 0; tEnd = tp + (goal - thp) / (th - thp) * dt; break; }
  }
  const f = (!nan && tEnd !== null) ? AP.apsisRate(s, { t0: 0, t1: tEnd, K: 3 }) : null, st = HP.inertialDragIsqState(S);
  return { aps: f ? AP.toArcsecPerCentury(f.rate, Math.pow(10, q.scaleExp.T)) : null, steps: k + 1, tEnd, nan, betaMax: st ? st.betaMax : null, overlap: st ? st.overlapSteps : null,
    wallSec: (Date.now() - t0) / 1000 };
}
export function partP(HP, plan, log = () => {}) {
  const base = Q.pinnedBook(HP, PIN, 'mercurySunInertial3d'), h = hOf(base.timeRef.pRef), q1pn = AN.pn1Of(base).value, runs = [];
  const go = (kind, a) => { const q = bookP(HP, kind, a), r = runAps(HP, q, h, plan.N); const row = Object.assign({ kind, a, decl: declOf(q) }, r); runs.push(row); log(row); return row; };
  const q00 = go('q00', 1), q10 = go('q10', 1), q11 = plan.scales.map((a) => go('q11', a));
  const dg1 = q11[0].aps - q10.aps;
  const rows = q11.map((r) => { const DG = r.aps - q10.aps, ratio = DG / dg1;
    return { a: r.a, scale: (SCALES.find((s) => s.a === r.a) || { key: 'one' }).key, RdSun: r.decl.bodies[0].Rd, RdPlanet: r.decl.bodies[1].Rd, q11: r.aps, DG, ratio, ratioOverA: ratio / r.a - 1, r1pn: r.aps - q00.aps - q1pn }; });
  return { id: base.id, h, N: plan.N, q1pn, q00: q00.aps, q10: q10.aps, dqG: q10.aps - q00.aps, runs, rows,
    complete: runs.every((r) => !r.err && !r.nan && Number.isFinite(r.aps) && r.overlap === (r.kind === 'q11' ? 0 : r.overlap)) };
}

/* ───────── 段 R(宣言の長さだけの再パラメータ化 —— 同値)───────── */
export function partR(HP) {
  const out = { systems: {} };
  for (const sy of SYSTEMS) {
    const q1 = scaledBook(HP, sy.key, 1, 1), qe = reparamBook(HP, sy.key), b1 = readout(HP, q1), be = readout(HP, qe);
    if (b1.err || be.err) { out.systems[sy.key] = { err: b1.err || be.err }; continue; }
    const ph = qe.physics, ells = qe.bodies.map((b) => (2 * ph.G * engineMass(b.m, ph)) / (ph.cLight * ph.cLight));
    let dRd = 0; const dQ = { beta: 0, rot: 0, omega: 0 };
    for (const recv of ['planet', 'sun']) { dRd = Math.max(dRd, rel(be[recv].Rd, b1[recv].Rd)); for (const qq of QTYS) dQ[qq] = Math.max(dQ[qq], rel(be[recv][qq], b1[recv][qq])); }
    out.systems[sy.key] = { id: sy.id, decl: declOf(qe), ell: ells, Reff: qe.bodies.map((b) => b.dragCore.radius), ellOverRd: ells.map((l, i) => l / q1.bodies[i].dragCore.radius),
      RdUlpSame: qe.bodies.map((b, i) => b.dragCore.radius === q1.bodies[i].dragCore.radius), maxRelRd: dRd, maxRel: dQ, roundScale: b1.planet.roundScale, bitSame: b1.receiversJson === be.receiversJson };
  }
  const s = Object.values(out.systems);
  out.maxRelRd = Math.max(...s.map((z) => (z.err ? Infinity : z.maxRelRd)));
  out.maxRel = Object.fromEntries(QTYS.map((qq) => [qq, Math.max(...s.map((z) => (z.err ? Infinity : z.maxRel[qq])))]));
  return out;
}

/* ───────── 段 C(結論)───────── */
/** 原仮定者の条件「κ の認識が違い複雑化する場合は採用せず、解説を行う」に照らした判定(実測の数から —— 純関数) */
export function conclusionOf(J) {
  const K = J.K.formula, fac = {}, facSrc = {}, facRecv = {};
  for (const sy of SYSTEMS) {
    fac[sy.key] = Object.fromEntries(QTYS.map((qq) => { const r = sRow(J, sy.key, 'planet', 'both', 'rs', qq); return [qq, r ? r.restore : null]; }));
    facRecv[sy.key] = Object.fromEntries(QTYS.map((qq) => { const r = sRow(J, sy.key, 'planet', 'recv', 'rs', qq); return [qq, r ? r.restore : null]; }));
    facSrc[sy.key] = Object.fromEntries(QTYS.map((qq) => { const r = sRow(J, sy.key, 'planet', 'src', 'rs', qq); return [qq, r ? r.restore : null]; }));
  }
  const fm = fac.mercury, spread = Math.max(fm.beta, fm.rot, fm.omega) / Math.min(fm.beta, fm.rot, fm.omega);
  const pr = J.P.rows.find((r) => r.scale === 'rs') || null;
  const reasons = [
    { code: 'kappa', ja: '今の κ₀ は G/c² ではなく 10/C₁ 倍(R_d = κ₀m は Gm/c² の 10/C₁ 倍・r_s の 5/C₁ 倍)—— 「現状の R_d = Gm/c²」は今のエンジンの値ではない',
      kappaOverGc2: K.kappaOverGc2, rdOverRs: K.rdOverRs },
    { code: 'powers', ja: '置き換え(R_d を C₁/5 倍)を戻す係数は項ごとに違う —— 並進は 5/C₁・回転と軸は (5/C₁)³(受け手の分母に 5/C₁・源の第 1 モーメントに (5/C₁)² の 2 か所)。1 つの係数では戻らない',
      restoreBoth: fac, restoreRecv: facRecv, restoreSrc: facSrc, spread },
    { code: 'periapsis', ja: '係数なしで置き換えると引きずりの近点の分 D_G が約 C₁/5 倍になり、1PN の近点から外れる', DGratio: pr ? pr.ratio : null, r1pn: pr ? pr.r1pn : null },
    { code: 'reparam', ja: '宣言の長さだけを r_s にして内部で (5/C₁) 倍の有効長を使う形は今と同値(新しい物理ではない)—— 表示の長さと核の球の半径が別になり、κ の読みが 2 つになる',
      maxRel: J.R.maxRel }];
  const reparamSame = J.R.maxRel.beta <= 1e-12 && J.R.maxRel.rot <= 1e-12 && J.R.maxRel.omega <= POW_TOL.omega;
  const adopt = !(K.kappaOverGc2 > 2 && spread > 10 && (!pr || pr.ratio < 0.5) && reparamSame);
  return { adopt, verdict: adopt ? '採用する' : '採用しない(解説を行う)', keep: 'エンジン・規則の鍵 invSq.rdRule:"kappaM"・κ₀ = 10G/(C₁c²) は今のまま', reasons };
}

/* ───────── 門(器の健全さ)───────── */
export function gatesOf(J) {
  const K = J.K, f = K.formula, P = J.P;
  const g = {
    kappaClosed: Math.abs(f.C1 - C1_REF) <= 1e-10 && Math.abs(f.kappaSI / KAPPA0_REF - 1) <= 1e-8 && Math.abs(f.c1KappaOver10Gc2 - 1) <= 1e-14,
    engineSame: SYSTEMS.every((s) => K.engine[s.key] && K.engine[s.key].C1Same && K.engine[s.key].kappaSame),
    ratiosClosed: K.maxRdOverRsDev <= 1e-14 && K.maxRdOverGmDev <= 1e-14 && Math.abs(f.kappaOverGc2 - 10 / C1) <= 1e-12 * (10 / C1),
    scaleAccepted: J.S.allAccepted,
    ruleBitSame: J.S.ruleBitSame,
    sourceSpinUnchanged: J.S.spinUnchanged,
    powers: J.S.powOk,
    periapsisRuns: P.complete && P.rows.length === (J.quick ? P_QUICK : P_PLAN).scales.length,
    periapsisScales: P.rows.every((r) => Math.abs(r.ratioOverA) <= 2e-2),
    reparamSame: J.R.maxRelRd <= 1e-14 && J.R.maxRel.beta <= 1e-12 && J.R.maxRel.rot <= 1e-12 && J.R.maxRel.omega <= POW_TOL.omega,
    conclusion: J.C && J.C.adopt === false,
  };
  return g;
}

/* ───────── 文書の表と数(PHYSICS〔第314便b〕—— QA docs.rdScale314 が正本から作り直して逐語で照合する)───────── */
const e3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toExponential(3);
const len = (m) => (m >= 1e8 ? (m / 1e3).toFixed(0) + ' km' : m >= 1e3 ? (m / 1e3).toPrecision(5) + ' km' : m >= 1 ? m.toPrecision(5) + ' m' : m >= 1e-3 ? (m * 1e3).toPrecision(5) + ' mm' : (m * 1e6).toPrecision(5) + ' µm');
const fx = (v, d) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v < 0 ? '−' + Number(-v).toFixed(d) : Number(v).toFixed(d));
const sg = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v < 0 ? '−' : '+') + Math.abs(v).toFixed(4);
const p5 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toPrecision(5);
const p3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : String(Number(Number(v).toPrecision(3)));
export function physicsTables(J) {
  const out = [], K = J.K, f = K.formula;
  out.push('| 量 | 値 |', '|---|---|');
  out.push(`| C₁ = 6[(√3/2)ln(2+√3) − 1] | ${fx(f.C1, 10)} |`);
  out.push(`| κ₀ = 10G/(C₁c²)(本の G = 6.674×10⁻¹¹・c = 2.99792458×10⁸) | ${e3(f.kappaSI)} m/kg |`);
  out.push(`| G/c²(同じ G・c) | ${e3(f.gOverC2)} m/kg |`);
  out.push(`| κ₀ ÷ (G/c²) = 10/C₁(R_d ÷ Gm/c²) | ${fx(f.kappaOverGc2, 5)} |`);
  out.push(`| κ₀ ÷ (2G/c²) = 5/C₁(R_d ÷ r_s) | ${fx(f.rdOverRs, 6)} |`);
  out.push(`| R_d を Gm/c² にする倍率 a = C₁/10 | ${fx(f.aGm, 6)} |`);
  out.push(`| R_d を r_s = 2Gm/c² にする倍率 a = C₁/5 | ${fx(f.aRs, 6)} |`);
  out.push(`| 🌡️ 水星の 1PN の近点 q_1PN | ${fx(f.q1pn, 4)} ″/世紀 |`);
  out.push(`| 🌡️ 在位の G_loc の解析の一次 ΔqG(kappaC2・n = 2 —— G_loc の κ はロックの G/c₀²) | ${sg(f.dqG)} ″/世紀(q_1PN の ${fx(f.dqGOverQ, 4)} 倍) |`);
  out.push(`| 🌡️ 引きずりが担う分 t_D = q_1PN − ΔqG | ${fx(f.tD, 4)} ″/世紀(q_1PN の ${fx(f.tDOverQ, 4)} 倍) |`);
  out.push('', '| 天体(在位の本の宣言) | m [kg] | 観測半径 R | Gm/c² | r_s = 2Gm/c² | R_d = κ₀m | R_d/r_s | R_d/R |', '|---|---|---|---|---|---|---|---|');
  for (const b of K.bodies) { const ja = BODY_ROWS.find((z) => z[0] === b.name)[3]; out.push(`| ${ja} | ${e3(b.mSI)} | ${len(b.RSI)} | ${len(b.gm)} | ${len(b.rs)} | ${len(b.Rd)} | ${fx(b.rdOverRs, 6)} | ${e3(b.rdOverR)} |`); }
  // 軸の ω は受け手の上の源の距離の変化を倍精度で表す丸めの尺度 ε r/R_d の分だけ動く(水星で 1e-3 の程度 ——〔第313便b〕④)ので、冪は 2 桁・ずれは床 2e-3 で書く
  out.push('', '| 写し・R_d を a 倍にした天体 | 量 | 実測の冪 p(a = C₁/10・C₁/5・1/2・2 の最小〜最大) | 解析の冪 | 整数からのずれの最大 |', '|---|---|---|---|---|');
  for (const sy of SYSTEMS) for (const mode of MODES) for (const qq of QTYS) {
    const rs = SCALES.map((sc) => sRow(J, sy.key, 'planet', mode, sc.key, qq)), ps = rs.map((r) => r.pow), d = qq === 'omega' ? 2 : 6, dv = Math.max(...rs.map((r) => r.dev));
    out.push(`| ${sy.emoji} ${sy.sym} ← ☉・${MODE_JA[mode]} | ${QTY_JA[qq]} | ${fx(Math.min(...ps), d)}〜${fx(Math.max(...ps), d)} | ${rs[0].expect} | ${qq === 'omega' ? Q.fmtFloor(dv, POW_TOL.omega, 2) : Q.fmtFloor(dv, 1e-12, 2)} |`);
  }
  out.push('', '| 写し(両方の R_d を a 倍) | a(置き換え先) | β を戻す係数 X(1)/X(a) | 回転の係数を戻す係数 | 軸の ω を戻す係数 | 解析の 1/a・1/a³ |', '|---|---|---|---|---|---|');
  for (const sy of SYSTEMS) for (const k of ['gm', 'rs', 'two']) {
    const sc = scaleOf(k), v = QTYS.map((qq) => sRow(J, sy.key, 'planet', 'both', k, qq).restore);
    out.push(`| ${sy.emoji} ${sy.sym} ← ☉ | ${sc.ja}(${sc.to}) | ${p5(v[0])} | ${p5(v[1])} | ${p3(v[2])} | ${p5(1 / sc.a)}・${p5(1 / (sc.a * sc.a * sc.a))} |`);
  }
  const P = J.P;
  out.push('', `| 🌡️ の写し(K1・刻み h = ${P.h}・${P.N} 公転) | 太陽の R_d | 水星の R_d | q11 [″/世紀] | D_G = q11 − q10 | D_G(a)/D_G(1) | r_1PN = q11 − q00 − q_1PN |`, '|---|---|---|---|---|---|---|');
  const Lm = Math.pow(10, J.K.inputs.scaleExp.L);
  for (const r of P.rows) { const sc = SCALES.find((s) => s.key === r.scale);
    out.push(`| a = ${sc ? sc.ja + '(' + sc.to + ')' : '1(κ₀m —— 今)'} | ${len(r.RdSun * Lm)} | ${len(r.RdPlanet * Lm)} | ${fx(r.q11, 4)} | ${fx(r.DG, 4)} | ${fx(r.ratio, 5)} | ${sg(r.r1pn)} |`); }
  out.push(`| 引きずりなし q00・G_loc だけ q10 | — | — | ${fx(P.q00, 4)}・${fx(P.q10, 4)} | — | — | — |`);
  out.push('', '| 写し(宣言の長さ ℓ = r_s・内部の R_eff = (5/C₁)ℓ) | R_eff と κ₀m の相対の差の最大 | t = 0 の β・回転の係数の相対の差の最大 | 軸の ω の相対の差 | 丸めの尺度 ε r/R_d(惑星) |', '|---|---|---|---|---|');
  for (const sy of SYSTEMS) { const z = J.R.systems[sy.key]; out.push(`| ${sy.emoji} ${sy.ja} | ${Q.fmtFloor(z.maxRelRd, 1e-15, 2)} | ${Q.fmtFloor(Math.max(z.maxRel.beta, z.maxRel.rot), 1e-12, 2)} | ${Q.fmtFloor(z.maxRel.omega, 1e-3, 2)} | ${e3(z.roundScale)} |`); }
  return out.join('\n');
}
export function docNumbers(J) {
  const f = J.K.formula, rs = J.P.rows.find((r) => r.scale === 'rs');
  return [fx(f.C1, 10), fx(f.kappaOverGc2, 5), fx(f.rdOverRs, 6), fx(f.aRs, 6), e3(f.kappaSI), fx(f.tD, 4), rs ? fx(rs.ratio, 5) : '—', HARNESS_VERSION];
}

export function runAll(HP, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const K = partK(HP); tick('K');
  const S = partS(HP); tick('S');
  const R = partR(HP); tick('R');
  const P = partP(HP, quick ? P_QUICK : P_PLAN, o.log); tick('P');
  const J = { quick, K, S, R, P };
  J.C = conclusionOf(J);
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

export async function main() {
  const TARGET = process.env.W314B_TARGET || 'beta/index.html';
  const OUT = process.env.W314B_OUT ? (path.isAbsolute(process.env.W314B_OUT) ? process.env.W314B_OUT : path.join(ROOT, process.env.W314B_OUT)) : path.join(ROOT, 'tests', 'out', 'rdscale-w314b.json');
  const quick = process.env.W314B_QUICK === '1';
  if (quick && !process.env.W314B_OUT) throw new Error('試走(W314B_QUICK=1)は W314B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const log = (r) => console.log(`  ${new Date().toISOString().slice(11, 19)} P ${r.decl.id} ${r.kind} a=${r.a} R_d(太陽・水星)=${r.decl.bodies.map((b) => (b.Rd === null ? '—' : b.Rd.toExponential(4))).join('・')} m=${r.decl.bodies.map((b) => b.m).join('・')} R=${r.decl.bodies.map((b) => b.R).join('・')}: ${r.err ? '拒否 ' + r.err : Number(r.aps).toFixed(6) + '″/世紀・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s'}`);
  const R = runAll(HP, { quick, log });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w314b-rdscale.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第116報)の補足(現状の R_d = κm を重力半径 2κm へ置き換えて引きずりの式を合わせた場合を検討する —— κ の認識が違い複雑化する場合は採用せず解説を行う)・' +
      '統括の検証項目 R239。検討と解説の材料(html・本の宣言・エンジンの式・κ₀ は変えない —— 写しは器の中で組む)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w314b-rdscale.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w306a-an336.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第314便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
  for (const s of Object.values(out.S.systems)) console.log('S', s.id, JSON.stringify(s.decl.invSq), s.decl.bodies.map((b) => 'm=' + b.m + ' R=' + b.R + ' R_d=' + b.Rd.toExponential(6)).join(' / '), 'ruleBitSame=' + s.ruleBitSame);
  console.log('S 冪の外れの最大', JSON.stringify(out.S.devMax), '| C', out.C.verdict, JSON.stringify(out.C.reasons.map((r) => r.code)));
  for (const r of out.P.rows) console.log('P a=' + r.a + ' D_G=' + r.DG + ' 比=' + r.ratio + ' r_1PN=' + r.r1pn);
}
if (IS_MAIN) await main();

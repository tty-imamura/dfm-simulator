// 第311便b(原仮定者の裁定(第110報)「太陽系における天の川銀河による一様軸引きずりを検討 —— 太陽系の全ての天体の軸引きずりに影響」・「一様並進引きずりと
// 一様回転引きずりは慣性系では無視できる」・背景慣性決定力は二重計上を避けるため引きずりの分母に入れない・(第113報)・決断事項 AN389・AN382・AN390・AN395・
// 統括の検証項目 R227): **銀河の一様軸引きずり galaxyAxial と、新則の受け手の制限・観測の初期値の分解の拒否の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step と
// 読み口 inertialDragIsqState・inertialDragGalaxyAxialState・inertialDragInitObsState・inertialDrag3SpinState・評価の写し inertialDragInitObsEval をそのまま呼ぶ)。
// 写しは器の中で組む(**在位の本の宣言は変えない** —— 在位の本は 1 本も galaxyAxial を宣言しない)。
//
// ■ 段
//   A(受理): galaxyAxial の受理の表(省略・{wx,wy,wz}・明示の 0・−0・null・配列・成分の欠け・未知の鍵・NaN・Infinity・文字列・旧則の本・axial:"off")・
//     新則の受け手の制限(AN389: 宣言の質量 m ≤ 0 の天体に半径・dragCore → 拒否/半径の無い質量 0 → 受理〔受け手でない〕/小さい正の質量 → 受理〔受け手〕)・
//     観測の移動の分解の拒否(質量の下限 10⁻⁹ の受け手 + initMotion → why "motionDenomSmall"・通常の写しは分解する)。
//   B(確かめ): ② 同じ状態で銀河の有無の build —— β・並進の右辺・回転の係数はビット同一・軸の ω = 銀河なし + ω_G(ビット)/③ 孤立の 1 体で ω = ω_G/
//     ④ 二体で両受け手に同じ ω_G/⑤ invSq.Wbg2 は 0 のまま/明示の 0 は未宣言と走りがビット同一/実行時の質量 0(受理を通らない状態)は β = 0・u = 0・源の重み 0/
//     非有限の行(内部状態 Wbg2 = NaN —— 公開の受理を通らない参照)は 0 にして数える/分母の小さい行は数えるだけ(値を変えない)。
//   G(向きと尺度): 銀河の北極・中心の向き(銀河座標の定義)を J2000 の黄道へ・銀河の角運動量の向き(−ê_GC × ê_l90 —— 南銀極の向き)・
//     尺度 Ω_ref = V₀/R₀(230 km/s ÷ 8.2 kpc —— **尺度だけ・大きさは決めない**)を本の単位へ。
//   D(診断 —— AN395 (ii)): 新則の太陽系の写し(太陽・水星・金星・地球・火星・木星 —— 近似要素の種〔JPL SSD Table 1・T = 0〕・IAU の極・本の単位 10⁹ m / 10⁵ s / 10²⁸ kg)に
//     ω_G = f Ω_ref ĝ(f = 0・10⁻²・10⁻¹・1・10 —— ĝ = 銀河の角運動量の向き)を宣言し、水星の 2 公転だけ走らせる(長期の積算は外挿で書かない):
//     受け手ごとの ω_D の銀河の分と局所の分(t = 0)・軸の向きの変化(固定の参照 â(0) との角・銀河なしの写しとの角と一次の見積り |ω_G × â| t)・
//     軌道法線との角の変化(太陽は全系の角運動量の向き)・天体どうしの軸の角の変化(共通の回転だけなら変わらない —— 局所の項との合成の分)・
//     維持の型(axisHold maintain)の軸のコストと速さの差・観測の初期自転の分解(initSpin)の慣性の軸の向きの差。
//
// ■ 言わないこと: 「天の川を較正した」「フィットした」「法則を発見した」「完全に一致」・ω_G の大きさを決めた・銀河の模型から ω_G を導いた。
//   表の大きさは**未定(AN395)の格子** —— 銀河の模型からの数ではない。受け手ごとの応答の型(新則の正規化を通す型)は比較の列にしない(源の場を作る模型が要る —— 次の裁定)。
//
// ■ 使い方
//   node tests/exp-w311b-galaxial.mjs   → 正本 tests/out/galaxial-w311b.json(段 galaxial-311b)
//   W311B_OUT=<json> で出力先を変える(試走は正本を書かない)・W311B_TARGET=<html>(既定 beta/index.html)・W311B_QUICK=1(水星の 1/4 公転 —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 器の本は .find で引く・第319便c(R260): tests/lib-w299c-planets3d.mjs の allPresets() を .find で直に引く形にしたので presets は名指しの本 —— 下限 ∪ 器が読む凍結の写しの本)
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d","galaxy","galaxyGeo2","galaxyStd","jupiterGalilean","jupiterSunInertial3d","marsMoonsReal","marsSunInertial3d","mercury","mercuryReal","mercurySunInertial3d","neptuneReal","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusReal","uranusSunInertial3d","venusReal","venusSunInertial3d"],"roots":["$","GALAXY_AXIAL_VERSION","HP.allPresets","HP.coord3d","HP.inertialDrag3HoldF","HP.validatePreset","INERTIAL_DRAG3_MAINT_SC","REL_DRAG_AXIS_HOLD_INTERVAL_UNDECLARED","REL_DRAG_AXIS_HOLD_LEDGER_VERSION","REL_DRAG_AXIS_HOLD_MAINT_VERSION","REL_DRAG_INIT_DEN_MIN","REL_DRAG_INIT_OBS_VERSION","REL_DRAG_INVSQ_VERSION","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","cw","inertialDrag3SpinState","inertialDragGalaxyAxialState","inertialDragInitObsEval","inertialDragInitObsRedo","inertialDragInitObsState","inertialDragInverseMap","inertialDragIsqState","pnSource","retiredOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w311b-galaxial-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const unit = (a) => scale(a, 1 / norm(a));
const ang = (a, b) => Math.atan2(norm(cross(a, b)), dot(a, b));   // atan2(|a×b|, a·b)(acos は 1 の近くで桁を落とす)
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['天の川を較正した', 'フィットした', '法則を発見した', '完全に一致', 'ω_G の大きさを決めた', '銀河の模型から ω_G を導いた'];
const MER = 'mercurySunInertial3d', JUP = 'jupiterSunInertial3d';

/* ───────── 天文の定数(出所の行つき —— 第308便c の器と同じ行・ネットワークでの一次の照合はしていない)───────── */
const C0 = (value, unitStr, source) => Object.freeze({ value, unit: unitStr, source, primary_numeric_verified: false });
export const GAL = Object.freeze({
  ngpRaDeg: C0(192.85948, 'deg', '銀河座標の定義(ICRS)—— 銀河の北極の赤経(Hipparcos and Tycho Catalogues, ESA SP-1200, Vol. 1 §1.5.3)'),
  ngpDecDeg: C0(27.12825, 'deg', '同 —— 銀河の北極の赤緯'),
  gcRaDeg: C0(266.40499, 'deg', '同 —— 銀河中心の向き(l = 0°・b = 0°)の赤経'),
  gcDecDeg: C0(-28.93617, 'deg', '同 —— 銀河中心の向きの赤緯'),
  V0kms: C0(230, 'km/s', '太陽の位置の銀河の回転の速さ Θ₀ の中央の値(第308便c の器の走査の中央 —— 尺度だけ)'),
  R0kpc: C0(8.2, 'kpc', '太陽と銀河中心の距離 R₀ の中央の値(Bland-Hawthorn & Gerhard 2016, ARA&A 54, 529 —— 尺度だけ)'),
  pcMeters: C0(3.0856775814913673e16, 'm', 'IAU 2015 Resolution B2(1 pc = 648000/π au)'),
});
/** |ω_G| = f Ω_ref の格子(大きさは未定 —— AN395) */
export const GRID = Object.freeze([0, 1e-2, 1e-1, 1, 10]);
export const N_ORB = 2, N_ORB_QUICK = 0.25;   // 水星の公転の数(長期の積算は外挿で書かない)
/** 地球(🌦️ earthMoonSunInertial3d の地球の質量・半径・自転)の近似要素と極(第299便c の表に地球の行が無いので器が持つ —— 地月の重心の行を地球の種に使う) */
export const EARTH = Object.freeze({ key: 'earth', ja: '地球', id: 'earthMoonSunInertial3d', index: 1,
  el: Object.freeze({ a: 1.00000261, e: 0.01671123, I: -0.00001531, L: 100.46457166, varpi: 102.93768193, Om: 0 }),
  elSource: 'JPL SSD「Approximate Positions of the Planets」Table 1 の EM Bary(地月の重心)の T = 0 の行 —— 地球の種(精密な状態ではない)',
  pole: Object.freeze({ ra: 0, dec: 90, wSign: 1 }), poleSource: 'IAU WGCCRE 2009 の地球の極(T = 0: α0 0°・δ0 90°)' });
export const PLANET_KEYS = Object.freeze(['mercury', 'venus', 'earth', 'mars', 'jupiter']);
export const LABELS = Object.freeze(['太陽', '水星', '金星', '地球', '火星', '木星']);

/* ───────── G(向きと尺度)───────── */
export function geometry() {
  const ngp = P3.poleEcliptic(GAL.ngpRaDeg.value, GAL.ngpDecDeg.value).u, gc = P3.poleEcliptic(GAL.gcRaDeg.value, GAL.gcDecDeg.value).u;
  const l90 = cross(ngp, gc), omHat = unit(cross(scale(gc, -1), l90));   // 太陽の位置 −ê_GC・速度 ê_l90 → 銀河の角運動量の向き(北極から見て時計回り —— 南銀極の向き)
  const lb = (u) => { let l = Math.atan2(u[1], u[0]) * 180 / Math.PI; if (l < 0) l += 360; return { lambdaDeg: l, betaDeg: Math.asin(Math.max(-1, Math.min(1, u[2]))) * 180 / Math.PI }; };
  const R0 = GAL.R0kpc.value * 1e3 * GAL.pcMeters.value, OmRef = GAL.V0kms.value * 1e3 / R0;
  return { ngp, gc, ngpDotGc: dot(ngp, gc), ngpEcl: lb(ngp), omHat, omHatEcl: lb(omHat), omHatDotNgp: dot(omHat, ngp), OmRefSI: OmRef };
}

/* ───────── 写し ───────── */
const findP = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); };
export const INVSQ = Object.freeze({ law: 'inertial', invSq: { order: 8 }, pairs: 'all', history: 'positions', dragCoreDefault: 'cap6500km', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } });
/** ☿ 3D の写し(新則・既定の半径 —— 第310便a の写しの作り方)。extra は relativeDrag に足す鍵・sd は spinDrag に足す鍵 */
export function merCopy(HP, extra = {}, sd = {}) {
  const q = findP(HP, MER); delete q.fitRecord; delete q.abBody;
  q.physics.relativeDrag = { ...clone(INVSQ), ...clone(extra) }; q.physics.relativeDrag.spinDrag = { ...q.physics.relativeDrag.spinDrag, ...clone(sd) };
  return q;
}
/** 新則の太陽系の写し(太陽 + 水星・金星・地球・火星・木星 —— 本の単位は 🏀 の 10⁹ m / 10⁵ s / 10²⁸ kg)。drag は relativeDrag(省略は INVSQ) */
export function solarCopy(HP, drag) {
  const q = findP(HP, JUP), X = q.scaleExp, G = q.physics.G, mer = findP(HP, MER), sun = clone(q.bodies[0]), Lm = Math.pow(10, X.L), bodies = [], P = [0, 0, 0], Q = [0, 0, 0];
  for (const k of PLANET_KEYS) {
    const pl = (k === 'earth') ? EARTH : P3.planetOf(k), book = findP(HP, pl.id), src = book.bodies[(k === 'earth') ? EARTH.index : 1], c = P3.convUnits(book.scaleExp, X);
    const m = src.m * c.m, mu = G * (sun.m + m), st = P3.elementsToState(pl.el, mu, pl.el.a * P3.AU_M / Lm), pe = P3.poleEcliptic(pl.pole.ra, pl.pole.dec);
    bodies.push({ type: 'single', m, radius: src.radius * c.len, x: st.r[0], y: st.r[1], z: st.r[2], vx: st.v[0], vy: st.v[1], vz: st.v[2], spin: src.spin * c.spin, pinned: false,
      spinAxis: { enable: true, tiltDeg: pe.tiltDeg, azimuthDeg: pe.azimuthDeg, source: (k === 'earth' ? EARTH.poleSource : 'IAU WGCCRE 2009 の' + pl.ja + 'の極') + ' を J2000 の黄道へ(器の写し・軸は一定の近似)' } });
    for (let a = 0; a < 3; a++) { P[a] += m * st.r[a]; Q[a] += m * st.v[a]; }
  }
  sun.x = -P[0] / sun.m; sun.y = -P[1] / sun.m; sun.z = -P[2] / sun.m; sun.vx = -Q[0] / sun.m; sun.vy = -Q[1] / sun.m; sun.vz = -Q[2] / sun.m;   // 重心 0・全運動量 0
  delete q.fitRecord; delete q.abBody; delete q.physics.gLoc;
  q.id = 'w311bSolarCopy'; q.bodies = [sun, ...bodies];
  q.physics.radiusFloor = 0.001;   // 水星の半径 2.44×10⁶ m = 0.00244(明示半径の下限 0.01 を下げる —— 第300便c の宣言)
  const pRef = 7600521.6 / Math.pow(10, X.T);   // 水星の公転周期(☿ の timeRef と同じ観測値)を本の時間単位へ
  q.timeRef = { ...mer.timeRef, pRef, pair: [0, 1] }; q.physics.stepDt = pRef / 360;
  q.physics.relativeDrag = clone(drag || INVSQ);
  return q;
}
function build(H, q) {
  const HP = H.HP, v = HP.validatePreset(clone(q));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset, warnings: v.warnings || [] };
}
const XV = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA'];
const fpS = (S, keys = XV) => { const h = crypto.createHash('sha1'); for (const k of keys) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); return h.digest('hex'); };
const same = (a, b, n) => { for (let k = 0; k < n; k++) if (!Object.is(a[k], b[k])) return false; return true; };

/* ───────── 段 A(受理)───────── */
export function partA(H) {
  const HP = H.HP, rows = [];
  const tryV = (q) => { const v = HP.validatePreset(clone(q)); return { ok: v.ok, errFull: v.ok ? '' : String((v.errors || [])[0] || ''), err: v.ok ? null : String((v.errors || [])[0] || '').slice(0, 160), canon: v.ok ? (v.preset.physics.relativeDrag || {}).galaxyAxial : undefined, preset: v.ok ? v.preset : null }; };
  const G = [['省略', undefined, true], ['{1e-12, −2e-12, 3e-12}', { wx: 1e-12, wy: -2e-12, wz: 3e-12 }, true], ['明示の 0', { wx: 0, wy: 0, wz: 0 }, true], ['−0 を含む', { wx: -0, wy: 1e-12, wz: 0 }, true],
    ['null', null, false], ['配列', [1e-12, 0, 0], false], ['成分の欠け', { wx: 1e-12, wy: 0 }, false], ['未知の鍵 vx', { wx: 0, wy: 0, wz: 0, vx: 1 }, false], ['未知の鍵 rot', { wx: 0, wy: 0, wz: 0, rot: 1 }, false],
    ['NaN', { wx: NaN, wy: 0, wz: 0 }, false], ['Infinity', { wx: 0, wy: Infinity, wz: 0 }, false], ['文字列', { wx: '1', wy: 0, wz: 0 }, false], ['数でない(真偽値)', { wx: 0, wy: 0, wz: true }, false]];
  for (const [name, g, expect] of G) {
    const q = merCopy(HP, g === undefined ? {} : { galaxyAxial: g }), r = tryV(q);
    let pass = r.ok === expect;
    if (pass && r.ok) pass = (g === undefined) ? r.canon === undefined : (r.canon && ['wx', 'wy', 'wz'].every((k) => Object.is(r.canon[k], g[k] === 0 ? 0 : g[k])) && Object.keys(r.canon).join() === 'wx,wy,wz');
    if (pass && !r.ok) pass = /galaxyAxial/.test(r.errFull);
    rows.push({ key: 'galaxyAxial', name, ok: r.ok, expectOk: expect, pass, canon: r.canon === undefined ? null : r.canon, err: r.err });
  }
  { const q = merCopy(HP, { galaxyAxial: { wx: 1e-12, wy: 0, wz: 0 } }); q.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'off' }; const r = tryV(q);
    rows.push({ key: 'galaxyAxial', name: 'spinDrag.axial:"off"', ok: r.ok, expectOk: false, pass: !r.ok && /axial:"on"/.test(r.errFull), err: r.err }); }
  { const q = findP(HP, MER); delete q.fitRecord; q.physics.relativeDrag.galaxyAxial = { wx: 1e-12, wy: 0, wz: 0 }; const r = tryV(q);
    rows.push({ key: 'galaxyAxial', name: '旧則の本(在位の ☿ 3D の宣言 + galaxyAxial)', ok: r.ok, expectOk: false, pass: !r.ok && /invSq の本だけ/.test(r.errFull), err: r.err }); }
  // 新則の受け手の制限(AN389)
  const R = [];
  const recv = (name, mut, expect, wantRecv) => {
    const q = merCopy(HP); mut(q); const r = tryV(q);
    const row = { name, ok: r.ok, expectOk: expect, err: r.err, mCanon: r.ok ? r10(r.preset.bodies[1].m) : null };
    if (r.ok) { const S = HP.coord3d.makeSim(); S.build(clone(r.preset)); const s = E(H, 'inertialDragIsqState')(S); row.merIsReceiver = s ? s.receivers.some((x) => x.i === 1) : null; }
    row.pass = r.ok === expect && (r.ok ? row.merIsReceiver === wantRecv : /宣言の質量が正でない/.test(r.errFull) && /AN389|質量の下限で持ち上げて受け手にしない/.test(r.errFull));   // 第316便c(R248): 受理の理由の文から来歴の語(AN・第N便)を外した世代も同じ文の本体で引く
    R.push(row);
  };
  recv('質量 0・半径あり(既定の massFloor)', (q) => { q.bodies[1].m = 0; }, false);
  recv('質量 0・半径あり(massFloor 1e-30)', (q) => { q.physics.massFloor = 1e-30; q.bodies[1].m = 0; }, false);
  recv('質量 −1e-4・半径あり', (q) => { q.bodies[1].m = -1e-4; }, false);
  recv('質量 0・pinned・半径あり(源だけの天体も持ち上げた質量で源にしない)', (q) => { q.bodies[1].m = 0; q.bodies[1].pinned = true; }, false);
  recv('質量 0・半径なし', (q) => { q.bodies[1].m = 0; delete q.bodies[1].radius; }, true, false);
  recv('質量 1e-12・半径あり(massFloor 1e-30 —— 正の宣言)', (q) => { q.physics.massFloor = 1e-30; q.bodies[1].m = 1e-12; }, true, true);
  recv('旧則の本で質量 0・半径あり(今の受理のまま)', (q) => { const p = findP(HP, MER); q.physics = p.physics; q.bodies[1].m = 0; }, true, undefined);
  { const last = R[R.length - 1]; last.pass = last.ok === true; delete last.merIsReceiver; }
  // 観測の移動の分解の拒否(AN389 —— 新則の行の分母 1 − Σβ < REL_DRAG_INIT_DEN_MIN)
  const M = [];
  const mot = (name, mut, expectWhy) => {
    const q = merCopy(HP, { initMotion: 'observed' }); mut(q); const b = build(H, q), io = E(H, 'inertialDragInitObsState')(b.S);
    const row = { name, ok: io.ok, why: io.why, at: io.motion ? (io.motion.at === undefined ? null : io.motion.at) : null, den: (io.motion && io.motion.den !== undefined) ? r10(io.motion.den) : null,
      denMin: (io.motion && io.motion.denMin !== undefined) ? io.motion.denMin : null };
    if (io.ok && io.motion && io.motion.rows) { const s = E(H, 'inertialDragIsqState')(b.S), mr = s.receivers.find((x) => x.i === 1); row.oneMinusSum = r10(1 - mr.betaSum); }
    row.pass = expectWhy === null ? (io.ok === true && io.why === null) : (io.ok === false && io.why === expectWhy && row.at === 1 && row.den < 1e-2);
    M.push(row);
  };
  mot('通常の写し(☿ 3D・新則)', () => {}, null);
  mot('質量 1e-16(massFloor 1e-30 —— 下限 10⁻⁹ の受け手)', (q) => { q.physics.massFloor = 1e-30; q.bodies[1].m = 1e-16; }, 'motionDenomSmall');
  mot('質量 1e-8(massFloor 1e-30)', (q) => { q.physics.massFloor = 1e-30; q.bodies[1].m = 1e-8; }, 'motionDenomSmall');
  return { galaxy: rows, receiver: R, motion: M, denMin: E(H, 'REL_DRAG_INIT_DEN_MIN'),
    nPass: rows.concat(R, M).filter((r) => r.pass).length, nCases: rows.length + R.length + M.length, allPass: rows.concat(R, M).every((r) => r.pass) };
}

/* ───────── 段 B(確かめ)───────── */
export function partB(H) {
  const HP = H.HP, out = {}, ev = E(H, 'inertialDragInitObsEval');
  const g = { wx: 3.1e-11, wy: -1.7e-11, wz: 4.3e-11 };
  // ② 同じ状態で銀河の有無の build(評価の写し —— 状態を動かさない)
  const b = build(H, merCopy(HP, { galaxyAxial: g })), S = b.S, n = S.n, vel = [S.vx, S.vy, S.vz];
  const S0 = Object.create(S); S0.relDrag = clone(S.relDrag); delete S0.relDrag.galaxyAxial;
  const T1 = ev(S, n, null, null, null, null, vel).T, T0 = ev(S0, n, null, null, null, null, vel).T;
  const eqA = (k, len) => same(T1[k], T0[k], len);
  out.fixedState = { A: eqA('_rdA', n * n), U: eqA('_rdUX', n) && eqA('_rdUY', n) && eqA('_rdUZ', n), beta: eqA('_rdIsqBE', n * n), rot: eqA('_rdIsqRV', n * n * 3), deg: eqA('_rdDeg', n),
    omegaPlusG: [...Array(n).keys()].every((i) => T1._rdWX[i] === T0._rdWX[i] + g.wx && T1._rdWY[i] === T0._rdWY[i] + g.wy && T1._rdWZ[i] === T0._rdWZ[i] + g.wz),
    omegaDiffers: [...Array(n).keys()].some((i) => T1._rdWX[i] !== T0._rdWX[i]) };
  // 2 步(最初の步は u = 0 —— 2 步目に同じ状態で build): 並進・自転の大きさはビット同一・軸の ω は + ω_G・軸だけが違う
  const run2 = (q) => { const r = build(H, q); for (let k = 0; k < 2; k++) r.S.step(r.dt); return r.S; };
  const A2 = run2(merCopy(HP, { galaxyAxial: g })), B2 = run2(merCopy(HP));
  out.twoSteps = { xv: fpS(A2, ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin']) === fpS(B2, ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin']),
    u: same(A2._rdUX, B2._rdUX, 2) && same(A2._rdUY, B2._rdUY, 2) && same(A2._rdUZ, B2._rdUZ, 2),
    omegaPlusG: [0, 1].every((i) => A2._rdWX[i] === B2._rdWX[i] + g.wx && A2._rdWY[i] === B2._rdWY[i] + g.wy && A2._rdWZ[i] === B2._rdWZ[i] + g.wz),
    axesDiffer: fpS(A2, ['sax', 'say', 'saz']) !== fpS(B2, ['sax', 'say', 'saz']) };
  // ③ 孤立の 1 体(太陽だけ —— 他の源なし): ω = ω_G・Σβ = 0
  { const S1 = Object.create(S); S1.n = 1; const T = ev(S1, 1, null, null, null, null, vel).T;
    out.isolated = { omega: [T._rdWX[0], T._rdWY[0], T._rdWZ[0]], equalsG: T._rdWX[0] === g.wx && T._rdWY[0] === g.wy && T._rdWZ[0] === g.wz, betaSum: T._rdA[0] }; }
  // ④ 二体: 両受け手に同じ ω_G(重みで割らない)—— ② の固定の状態の差
  out.twoBody = [0, 1].map((i) => ({ i, dWx: T1._rdWX[i] - T0._rdWX[i], dWy: T1._rdWY[i] - T0._rdWY[i], dWz: T1._rdWZ[i] - T0._rdWZ[i] }));
  out.twoBodySame = out.twoBody.every((r) => r.dWx === out.twoBody[0].dWx && r.dWy === out.twoBody[0].dWy && r.dWz === out.twoBody[0].dWz);
  // ⑤ Wbg2 は 0 のまま(正準形と状態)
  out.wbg2Zero = Object.is(b.preset.physics.relativeDrag.invSq.Wbg2, 0) && Object.is(S.relDrag.invSq.Wbg2, 0);
  // 明示の 0 は未宣言と走りがビット同一(20 步)・読み口で区別
  { const run = (q) => { const r = build(H, q); for (let k = 0; k < 20; k++) r.S.step(r.dt); return r.S; };
    const Z = run(merCopy(HP, { galaxyAxial: { wx: 0, wy: 0, wz: 0 } })), U = run(merCopy(HP)), st = E(H, 'inertialDragGalaxyAxialState');
    const sz = st(Z), su = st(U);
    out.explicitZero = { runSame: fpS(Z) === fpS(U), declared: [sz.declared, su.declared], explicitZero: [sz.explicitZero, su.explicitZero], active: [sz.active, su.active] }; }
  // 実行時の質量 0(受理を通らない状態 —— 正準形の質量を 0 に置き換えて build): β = 0・u = 0・源の重み 0
  { const v = HP.validatePreset(merCopy(HP)), p = clone(v.preset); p.bodies[1].m = 0;
    const Sm = HP.coord3d.makeSim(); Sm.build(p); const dt = E(H, 'appStepDt')(Sm); for (let k = 0; k < 3; k++) Sm.step(dt);
    const s = E(H, 'inertialDragIsqState')(Sm), sun = s.receivers.find((r) => r.i === 0);
    out.runtimeMass0 = { merIsReceiver: s.receivers.some((r) => r.i === 1), sunBetaFromMer: sun ? sun.beta[1] : null, uMer: [Sm._rdUX[1], Sm._rdUY[1], Sm._rdUZ[1]],
      pass: !s.receivers.some((r) => r.i === 1) && (!sun || sun.beta[1] === 0) && Sm._rdUX[1] === 0 && Sm._rdUY[1] === 0 && Sm._rdUZ[1] === 0 }; }
  // 非有限の行(内部状態 Wbg2 = NaN —— 公開の受理を通らない参照): 行を 0 にして数える
  { const Sn = Object.create(S); Sn.relDrag = clone(S.relDrag); Sn.relDrag.invSq.Wbg2 = NaN; Sn.inertialDragIsqBadRow = 0;
    const T = ev(Sn, n, null, null, null, null, vel).T, rowsZero = [...Array(n * n).keys()].every((k) => T._rdA[k] === 0), uZero = [0, 1].every((i) => T._rdUX[i] === 0 && T._rdUY[i] === 0 && T._rdUZ[i] === 0);
    const wG = [0, 1].every((i) => T._rdWX[i] === g.wx && T._rdWY[i] === g.wy && T._rdWZ[i] === g.wz);
    out.badRow = { counted: T.inertialDragIsqBadRow, rowsZero, uZero, omegaIsGOnly: wG, pass: T.inertialDragIsqBadRow === 2 && rowsZero && uZero && wG }; }
  // 分母の小さい行(質量の下限 10⁻⁹ の受け手 —— 分解なし): 数えるだけ・β は残す
  { const q = merCopy(HP); q.physics.massFloor = 1e-30; q.bodies[1].m = 1e-16; const r = build(H, q); for (let k = 0; k < 3; k++) r.S.step(r.dt);
    const s = E(H, 'inertialDragGalaxyAxialState')(r.S), mr = E(H, 'inertialDragIsqState')(r.S).receivers.find((x) => x.i === 1);
    out.lowDen = { lowDenRows: s.rowGuard.lowDenRows, builds: r.S.inertialDragIsqN, badRows: s.rowGuard.badRows, merBetaSum: r10(mr.betaSum), pass: s.rowGuard.lowDenRows === r.S.inertialDragIsqN && r.S.inertialDragIsqN > 0 && s.rowGuard.badRows === 0 && mr.betaSum > 0.99 }; }
  out.allPass = Object.values(out.fixedState).every(Boolean) && Object.values(out.twoSteps).every(Boolean) && out.isolated.equalsG && out.isolated.betaSum === 0 && out.twoBodySame
    && out.wbg2Zero && out.explicitZero.runSame && out.explicitZero.explicitZero[0] === true && out.explicitZero.declared[1] === false && out.explicitZero.active[0] === false
    && out.runtimeMass0.pass && out.badRow.pass && out.lowDen.pass;
  return out;
}

/* ───────── 段 D(診断 —— AN395 (ii))───────── */
function orbitNormals(S) {
  const n = S.n, R = (i) => [S.x[i], S.y[i], S.z[i]], V = (i) => [S.vx[i], S.vy[i], S.vz[i]], out = [];
  let L = [0, 0, 0];
  for (let i = 0; i < n; i++) { const l = scale(cross(R(i), V(i)), S.m[i]); L = [L[0] + l[0], L[1] + l[1], L[2] + l[2]]; }
  out.push(unit(L));   // 太陽: 全系の角運動量の向き(不変面の法線)
  for (let i = 1; i < n; i++) out.push(unit(cross(sub(R(i), R(0)), sub(V(i), V(0)))));   // 惑星: 太陽に対する軌道の法線
  return out;
}
const axesOf = (S) => [...Array(S.n).keys()].map((i) => [S.sax[i], S.say[i], S.saz[i]]);
function runSolar(H, f, geo, o) {
  const HP = H.HP, base = solarCopy(HP), X = base.scaleExp, Tm = Math.pow(10, X.T), Om = geo.OmRefSI * Tm, gv = scale(geo.omHat, f * Om);
  const drag = clone(INVSQ);
  if (o.declare !== false) drag.galaxyAxial = { wx: gv[0], wy: gv[1], wz: gv[2] };
  if (o.maintain) drag.spinDrag.axisHold = { mode: 'maintain' };
  if (o.initSpin) drag.spinDrag.initSpin = 'observed';
  const q = solarCopy(HP, drag), b = build(H, q), S = b.S, n = S.n;
  const st0 = E(H, 'inertialDragIsqState')(S), a0 = axesOf(S), n0 = orbitNormals(S);
  const io = o.initSpin ? E(H, 'inertialDragInitObsState')(S) : null;
  if (o.initOnly) return { io, axesI: a0 };
  for (let k = 0; k < o.steps; k++) S.step(b.dt);
  const res = { f, steps: o.steps, T: (o.steps - 1) * b.dt, dt: b.dt, unitT: Tm, g: gv, a0, n0, aT: axesOf(S), nT: orbitNormals(S), fp: fpS(S), finite: XV.every((k) => Array.from(S[k].subarray(0, n)).every(Number.isFinite)),
    omegaL: st0.receivers.map((r) => r.omega), badRows: S.inertialDragIsqBadRow || 0, lowDenRows: S.inertialDragIsqLowDen || 0 };
  if (o.maintain) { const m = E(H, 'inertialDrag3SpinState')(S).axisHold.maintain; res.maint = { axisCost: m.heat.axisCost, speed: m.speed.signed, heat: m.heat.total, perBody: m.heat.perBody, steps: m.steps }; }
  return res;
}
export function partD(H, quick) {
  const geo = geometry(), HP = H.HP, base = solarCopy(HP), b0 = build(H, base), dt = b0.dt, pRef = base.timeRef.pRef, steps = Math.round((quick ? N_ORB_QUICK : N_ORB) * pRef / dt);
  const Tm = Math.pow(10, base.scaleExp.T), OmBook = geo.OmRefSI * Tm, n = b0.S.n;
  const ref = runSolar(H, 0, geo, { steps, declare: false });   // 未宣言(この項を使っていない)
  const free = GRID.map((f) => runSolar(H, f, geo, { steps }));
  const maint = GRID.map((f) => runSolar(H, f, geo, { steps, maintain: true })), maintRef = runSolar(H, 0, geo, { steps, maintain: true, declare: false });
  const z = free[0];
  const bodies = [];
  for (let i = 0; i < n; i++) {
    const a = z.a0[i], wL = z.omegaL[i], wLp = norm(sub(wL, scale(a, dot(wL, a)))), gp = norm(cross(geo.omHat, a));   // ⊥ = 軸に垂直な分(軸を回す分)
    bodies.push({ i, label: LABELS[i], omegaLocal: r10(norm(wL)), omegaLocalPerp: r10(wLp), omegaGPerUnitF: r10(OmBook), omegaGPerpPerUnitF: r10(OmBook * gp),
      ratioGperpOverLperpAtF1: r10(wLp > 0 ? OmBook * gp / wLp : null), axisToOrbitNormal0Deg: r10(ang(a, z.n0[i]) * 180 / Math.PI) });
  }
  const rows = [];
  for (const r of free) {
    const per = [];
    for (let i = 0; i < n; i++) {
      const a0 = r.a0[i], aT = r.aT[i], th = ang(aT, z.aT[i]), pred = norm(cross(r.g, a0)) * r.T;
      const thN = ang(aT, r.nT[i]) - ang(z.aT[i], z.nT[i]), sn = Math.sin(ang(a0, r.n0[i])), predN = sn > 0 ? -dot(cross(r.g, a0), r.n0[i]) * r.T / sn : null;
      per.push({ i, driftFromA0: r10(ang(aT, a0)), vsNoGalaxy: r10(th), firstOrder: r10(pred), ratio: r10(pred > 0 ? th / pred : null), orbitNormalAngleChange: r10(ang(aT, r.nT[i]) - ang(a0, r.n0[i])),
        orbitNormalVsNoGalaxy: r10(thN), orbitNormalFirstOrder: r10(predN) });
    }
    let pairMax = 0, pairAt = null;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const d = Math.abs((ang(r.aT[i], r.aT[j]) - ang(r.a0[i], r.a0[j])) - (ang(z.aT[i], z.aT[j]) - ang(z.a0[i], z.a0[j]))); if (d > pairMax) { pairMax = d; pairAt = [i, j]; } }
    const thMax = Math.max(...per.map((p) => p.vsNoGalaxy));
    rows.push({ f: r.f, omegaG: r10(r.f * OmBook), finite: r.finite, badRows: r.badRows, per, pairAngleChangeMax: r10(pairMax), pairAt, pairOverAxisMax: r10(thMax > 0 ? pairMax / thMax : null) });
  }
  const mrows = maint.map((m) => ({ f: m.f, axisCost: r10(m.maint.axisCost), speed: r10(m.maint.speed), heat: r10(m.maint.heat), axisCostRatio: r10(maint[0].maint.axisCost > 0 ? m.maint.axisCost / maint[0].maint.axisCost : null),
    axesHeld: m.aT.every((a, i) => a[0] === m.a0[i][0] && a[1] === m.a0[i][1] && a[2] === m.a0[i][2]), finite: m.finite,
    perBodyCost: m.maint.perBody.map(r10) }));
  // 観測の初期自転の分解(initSpin —— ω_D に銀河の分も入る): f = 1 と f = 0 の慣性の軸の角と一次の見積り |ω_G⊥|/|s_obs|
  const i0 = runSolar(H, 0, geo, { initSpin: true, initOnly: true }), i1 = runSolar(H, 1, geo, { initSpin: true, initOnly: true });
  const init = { ok: [i0.io.ok, i1.io.ok], rows: [] };
  if (i0.io.ok && i1.io.ok) for (let i = 0; i < n; i++) { const r0 = i0.io.spin.rows[i], r1 = i1.io.spin.rows[i], d = ang(r1.axisI, r0.axisI), est = OmBook * norm(cross(geo.omHat, r0.axisObs)) / Math.abs(r0.sObs);
    init.rows.push({ i, label: LABELS[i], axisIDiff: r10(d), firstOrder: r10(est), ratio: r10(est > 0 ? d / est : null) }); }
  const zeroSame = ref.fp === free[0].fp && maintRef.fp === maint[0].fp;
  return { geometry: geo, OmRefBook: r10(OmBook), unitT: Tm, steps, dt, T: r10(steps * dt), Teff: r10((steps - 1) * dt), firstStepNote: '最初の步は履歴が無く u = 0・軸の ω を使わない(今の経路 —— 一次の見積りの時間は (步数 − 1) h)', orbitsMercury: quick ? N_ORB_QUICK : N_ORB, labels: LABELS, bodies, rows, maintain: mrows, initSpin: init, zeroDeclaredSameAsUndeclared: zeroSame,
    note: '大きさは未定(AN395)・銀河の模型からの数ではない —— |ω_G| = f Ω_ref の格子(Ω_ref = V₀/R₀ は尺度だけ)' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = J.D, lin = D.rows.filter((r) => r.f >= 1e-2).flatMap((r) => r.per);
  return {
    acceptance: J.A.allPass,
    receiverRestriction: J.A.receiver.every((r) => r.pass),
    motionDenomSmall: J.A.motion.every((r) => r.pass),
    fixedStateBitSame: Object.values(J.B.fixedState).every(Boolean),
    twoStepsTranslationSame: Object.values(J.B.twoSteps).every(Boolean),
    isolatedOmegaIsG: J.B.isolated.equalsG && J.B.isolated.betaSum === 0,
    twoBodySameG: J.B.twoBodySame,
    wbg2StaysZero: J.B.wbg2Zero,
    explicitZeroSameRun: J.B.explicitZero.runSame,
    runtimeMass0: J.B.runtimeMass0.pass,
    badRowZeroed: J.B.badRow.pass,
    lowDenCounted: J.B.lowDen.pass,
    galaxyAngularMomentumSouth: J.D.geometry.omHatDotNgp < -0.999999,
    zeroDeclaredSameAsUndeclared: D.zeroDeclaredSameAsUndeclared,
    allFinite: D.rows.every((r) => r.finite && r.badRows === 0) && D.maintain.every((m) => m.finite),
    linearResponse: lin.every((p) => p.ratio !== null && Math.abs(p.ratio - 1) < 1e-3),
    maintainAxesHeld: D.maintain.every((m) => m.axesHeld),
    initSpinBothOk: D.initSpin.ok.every(Boolean),
  };
}

/* ───────── 文書の表と数(PHYSICS〔第311便b〕—— QA docs.galaxial311 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const e3s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(3);
const f2 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(2);
const fl = (v, floor) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : (Math.abs(v) < floor ? '< ' + Number(floor).toExponential(0) : Number(v).toExponential(2)));
export function physicsTables(J) {
  const D = J.D, out = [];
  out.push('| 照合 | 値 |', '|---|---|');
  out.push(`| 受理の表(galaxyAxial・受け手の制限・分解の拒否) | ${J.A.nPass}/${J.A.nCases} |`);
  out.push(`| 同じ状態の build の β・並進の右辺・回転の係数(銀河の有無)・軸の ω = 銀河なし + ω_G | ${Object.values(J.B.fixedState).every(Boolean) ? 'ビット同一' : '違う'} |`);
  out.push(`| 孤立の 1 体の軸の ω と ω_G・二体の両受け手に足した ω_G | ${J.B.isolated.equalsG && J.B.twoBodySame ? 'ビット同一' : '違う'} |`);
  out.push(`| 明示の 0 と未宣言の 20 步・invSq.Wbg2 | ${J.B.explicitZero.runSame ? 'ビット同一' : '違う'}・${J.B.wbg2Zero ? '0' : '0 でない'} |`);
  out.push(`| 非有限の行(内部状態 Wbg2 = NaN)を 0 にして数えた行・分母の小さい行(質量の下限 10⁻⁹ —— 3 步)の数 | ${J.B.badRow.counted}・${J.B.lowDen.lowDenRows} |`);
  const g = D.geometry;
  out.push(`| 銀河の北極の黄道座標 λ・β [°] | ${f2(g.ngpEcl.lambdaDeg)}・${f2(g.ngpEcl.betaDeg)} |`);
  out.push(`| 銀河の角運動量の向きの黄道座標 λ・β [°](南銀極の向き)・銀河の北極との内積 | ${f2(g.omHatEcl.lambdaDeg)}・${f2(g.omHatEcl.betaDeg)}・${f2(g.omHatDotNgp)} |`);
  out.push(`| 尺度 Ω_ref = V₀/R₀ [rad/s]・本の単位 [1/10⁵ s] | ${e3s(g.OmRefSI)}・${e3s(D.OmRefBook)} |`);
  out.push('', '| 天体(t = 0) | 局所の ω_D の大きさ [1/10⁵ s] | 軸に垂直な分 | ω_G の軸に垂直な分(f = 1) | 比(f = 1) | 軸と軌道法線の角 [°] |', '|---|---|---|---|---|---|');
  for (const b of D.bodies) out.push(`| ${b.label} | ${e2s(b.omegaLocal)} | ${e2s(b.omegaLocalPerp)} | ${e2s(b.omegaGPerpPerUnitF)} | ${e2s(b.ratioGperpOverLperpAtF1)} | ${f2(b.axisToOrbitNormal0Deg)} |`);
  out.push('', `| f(abs(ω_G) = f Ω_ref)| 軸の角(銀河なしの写しとの)の最大 [rad] | 一次の見積り abs(ω_G × â) t との比の範囲 | 軌道法線との角の変化(銀河の分)の最大 [rad] | 天体どうしの軸の角の変化(銀河の分)の最大 [rad] |`, '|---|---|---|---|---|');
  for (const r of D.rows) {
    const th = Math.max(...r.per.map((p) => p.vsNoGalaxy)), rs = r.per.map((p) => p.ratio).filter((x) => x !== null), on = Math.max(...r.per.map((p) => Math.abs(p.orbitNormalVsNoGalaxy)));
    out.push(`| ${r.f} | ${fl(th, 1e-20)} | ${rs.length ? f2(Math.min(...rs)) + '〜' + f2(Math.max(...rs)) : '—'} | ${fl(on, 1e-20)} | ${fl(r.pairAngleChangeMax, 1e-13)} |`);
  }
  out.push('', '| f | 維持の型の軸のコストの和 [本の単位] | f = 0 との比 | 速さの差の和(符号つき) | 軸は保たれた |', '|---|---|---|---|---|');
  for (const m of D.maintain) out.push(`| ${m.f} | ${e3s(m.axisCost)} | ${m.axisCostRatio === null ? '—' : e2s(m.axisCostRatio)} | ${e2s(m.speed)} | ${m.axesHeld ? 'はい' : 'いいえ'} |`);
  out.push('', '| 天体 | 観測の初期自転の分解(f = 1 と f = 0)の慣性の軸の角 [rad] | 一次の見積り abs(ω_G⊥)/abs(s_obs) | 比 |', '|---|---|---|---|');
  for (const r of D.initSpin.rows) out.push(`| ${r.label} | ${e2s(r.axisIDiff)} | ${e2s(r.firstOrder)} | ${r.ratio === null ? '—' : f2(r.ratio)} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  const g = J.D.geometry;
  return [e3s(g.OmRefSI), e3s(J.D.OmRefBook), f2(g.ngpEcl.betaDeg), String(J.D.steps)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const A = partA(H); tick('A');
  const B = partB(H); tick('B');
  const D = partD(H, quick); tick('D');
  const J = { quick, A, B, D };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 受理・分解・build を読む既存の器・QA・正本の扱い(第311便b の枝で列挙して走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w310a-invsq.mjs(段 Z)・正本 invsq-w310a.json', reads: '受理(質量 0 の受け手)・initMotion の記録', handling: '質量 0 + 半径の 2 行は拒否へ(AN389)・質量 1e-16 + initMotion の行は分解しない(motionDenomSmall —— 段 Z の記録を rows の無い失敗にも耐える形へ)・正本を作り直し PHYSICS〔第310便a〕の 2 行を注記つきで' },
  { file: 'tests/exp-w310d-mdsweep.mjs・正本 mdsweep-w310d.json', reads: '新則 + initMotion・initSpin の写し(質量はすべて正・1 − Σβ ≥ 0.99)', handling: '変わらない(試走で照合 —— 鎖は領域 hash で判定)' },
  { file: 'tests/exp-w309c-recheck.mjs・正本 recheck-w309c.json', reads: '旧則の initMotion(分母 ≥ 1)', handling: '変わらない(新則の行だけに下限)' },
  { file: 'tests/exp-w309a-invsq.mjs・tests/exp-w310b-pairheat.mjs', reads: '新則の受理・build(質量はすべて正)', handling: '変わらない' },
  { file: 'tests/qa.mjs behavior.invSq309・behavior.invSq310・behavior.initObs309', reads: '新則の受理・build・initMotion', handling: '変わらない(質量 0 の受け手を宣言しない)' },
];

export async function main() {
  const TARGET = process.env.W311B_TARGET || 'beta/index.html';
  const OUT = process.env.W311B_OUT || path.join(ROOT, 'tests', 'out', 'galaxial-w311b.json');
  const quick = process.env.W311B_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  pinDecl315c(H.evalExpr);   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w311b-galaxial.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第110報)太陽系における天の川銀河による一様軸引きずりを検討・一様並進引きずりと一様回転引きずりは慣性系では無視できる・背景慣性決定力は引きずりの分母に入れない・(第113報)・決断事項 AN389・AN382・AN390・AN395・統括の検証項目 R227',
    galaxyAxialVersion: E(H, 'GALAXY_AXIAL_VERSION'), invSqVersion: E(H, 'REL_DRAG_INVSQ_VERSION'), denMin: E(H, 'REL_DRAG_INIT_DEN_MIN'), constants: GAL, grid: GRID, versionReaders: VERSION_READERS, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w311b-galaxial.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第311便b', target: TARGET, code: CODE, inputs: [TARGET, LEGACY7_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

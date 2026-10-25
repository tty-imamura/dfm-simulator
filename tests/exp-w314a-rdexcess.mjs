// 第314便a(原仮定者の裁定(第116報)AN404「R_d は観測半径を超えても受理する。超えた場合の表示も用意する」・AN403/AN409「外殻の引きずりは粒子同士が触れるぐらいの距離の
// 特別処理 —— 将来の球体の地表のサンプル」・決断事項 AN411 の推奨の型・統括の検証項目 R238):
// **引きずりの半径 R_d が観測半径 R を超える天体の受理と表示の器**。在位の本の宣言は変えない(写しは器の中で組む)・合わせない(κ₀ = 10G/(C₁c²) は一次の値のまま)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 validatePreset・validateDragCoreBody・inertialDragIsqState・
// inertialDragIsqRdExcessOf・dragCoreDefaultState・appStepDt と本の入口 coord3d.makeSim・build・step をそのまま呼ぶ)。
//
// ■ 段
//   A(受理の表): K1 × 規則/radius の省略/明示 × 超過/内・K2 × massFrac 1/0.5 × 超過/内・外殻 + 超過・点の天体・正と有限の検査・K2 の cap(☿ の写し —— 太陽はクランプ)・
//     旧則と law が inertial でない本(今の契約 0 < R_c ≤ R)。受理の警告(AN404 の行)の数。
//   W(警告の文): 超過の天体ごとの 1 行の語(R_d・R・比・物質半径ではない・重なりは今のまま数える)と cap の文と別か。
//   N(写しの走行): 中性子星(1.4 M☉・R 12 km)と試験粒子(1e-6 M☉・R 10 m)を R_d の和の 3・1.5・0.8 倍(0.8 倍は引きずり球の重なり)の円軌道に置いた K1 + rdRule の写し ——
//     読み口 radiusExcess(R_d・R・比)と閉じた式 10Gm/(C₁c²)・t = 0 の重なり・β・30 步が有限・overlap の数。明示の dragCore.radius が規則より優先する写しの比。
//     K2 の明示 {massFrac:1, radius:κ₀m} の写し(AN411 の受理)。
//   S(太陽系の写し): ☿♀♂♃(第306便a の凍結の写し)と 🌦️ を K1 + rdRule(+ 外殻 uniform)で —— radiusExcess の欄が無い・AN404 の警告 0・表示の読み口が null。
//
// ■ 第315便b(決断事項 AN415・K1 の境界の 1 点)の世代切替: 段 A の「K1 外殻なし・明示の dragCore {massFrac:0.5, radius:12}(R_c = R)」の行は、K1 の外殻なしの
//   R_c = R ∧ massFrac < 1 を受理する html(k1EdgeGen —— 受理の振る舞いで判定・REGEN_SCOPE は動かさない)では受理を期待する(前の世代は「マントルの体積が 0」で拒否)。
//   表示は第315便b で r_s > R_obs へ付け替えた(inertialDragIsqRdExcessOf は表示が読まない —— 本器の照合のために残る・本文は不変)。
//
// ■ 言わないこと: 「法則を確かめた」「フィットした」「較正した」「完全に一致」「確認した」。R_d は重力半径に比例する長さ(物質半径ではない)。受理は重なった引きずり球の積分を
//   意味しない(重なりの検査は今のまま —— 閉じた式は球の外だけ)。
//
// ■ 使い方
//   node tests/exp-w314a-rdexcess.mjs   → 正本 tests/out/rdexcess-w314a.json(段 rdexcess-314a)
//   W314A_OUT=<json> で出力先を変える(試走は正本を書かない)・W314A_TARGET=<html>(既定 beta/index.html)・W314A_QUICK=1(步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fmtFloor } from './lib-w311c-h4carry.mjs';
import * as Q from './lib-w311d-planet3.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限)
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","saturn","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.validatePreset","REL_DRAG_INVSQ_C1","REL_DRAG_INVSQ_KERNEL_VERSION","REL_DRAG_INVSQ_RDRULE_VERSION","REL_DRAG_INVSQ_SHELL_RECV_VERSION","REL_DRAG_RD_EXCESS_VERSION","T","appStepDt","ch","ctx","inertialDragInitObsState","inertialDragIsqRdExcessOf","inertialDragIsqState","validateDragCoreBody"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w314a-rdexcess-1';
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
/** 中性子星の写しの単位(本の長さ 1 km・質量 10³⁰ kg・時間 10 μs)と SI の定数 */
export const UNITS = Object.freeze({ L: 3, T: -5, M: 30 });
export const SI = Object.freeze({ G: 6.6743e-11, c: 299792458, Msun: 1.98847e30 });
const Lm = 1e3, Tm = 1e-5, Mm = 1e30;
/** 本の G・c(SI を本の単位へ —— 6.6743・2.99792458 になるように単位を選んだ) */
export const NS_G = 6.6743, NS_C = 2.99792458;
/** 中性子星(1.4 M☉・R 12 km)と試験粒子(1e-6 M☉・R 10 m —— 明示半径の下限 0.01) */
export const NS = Object.freeze({ mSun: 1.4, R: 12, spin: 0.04 }), PTCL = Object.freeze({ mSun: 1e-6, R: 0.01 });
export const NS_D = Object.freeze([3, 1.5, 0.8]);
export const STEPS = 30, STEPS_QUICK = 4;
/** 太陽系の写し(☿♀♂♃ は第306便a の世代の凍結の写し・🌦️ は生きている本) */
export const SOLAR = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', ja: '太陽と水星', pin: true }),
  Object.freeze({ key: 'venus', id: 'venusSunInertial3d', emoji: '🌋', ja: '太陽と金星', pin: true }),
  Object.freeze({ key: 'mars', id: 'marsSunInertial3d', emoji: '🔴', ja: '太陽と火星', pin: true }),
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '太陽と木星', pin: true }),
  Object.freeze({ key: 'earthmoon', id: 'earthMoonSunInertial3d', emoji: '🌦️', ja: '太陽と地球と月', pin: false }),
]);

/* ───────── 写し ───────── */
/** κ₀(本の単位 —— エンジンと同じ演算の順 (10·G)/(C₁·c·c))とエンジンが使う質量(massPrecision が single の本は Float32) */
export const kappaBook = (G, c) => (10 * G) / (C1 * c * c);
export const engineMass = (m, ph) => (ph && ph.massPrecision === 'double' ? m : Math.fround(m));
const mNS = NS.mSun * SI.Msun / Mm, mP = PTCL.mSun * SI.Msun / Mm;
/** 中性子星の写しの引きずりの宣言: kernel("k1" | "k2")・rule(rdRule)・shell(outerShell)・cap(dragCoreDefault) */
export function nsDrag(o = {}) {
  const isq = {};
  if (o.shell) isq.outerShell = o.shell;
  if ((o.kernel || 'k1') === 'k1') isq.kernel = 'k1';
  if (o.rule) isq.rdRule = 'kappaM';
  const rd = { law: 'inertial', invSq: isq, pairs: 'all', history: 'positions', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
  if (o.cap) rd.dragCoreDefault = 'cap6500km';
  return rd;
}
/** R_d の和(規則 —— エンジンが使う質量)。中性子星が明示の radius を持つ写しはその値 */
export function rdSum(o = {}) { const k = kappaBook(NS_G, NS_C); return (o.nsRd || k * Math.fround(mNS)) + k * Math.fround(mP); }
/**
 * 中性子星と試験粒子の写し(中性子星の質量中心の円軌道 —— 粒子は +x・速度 +y)。o = {d(R_d の和の倍率・既定 3), kernel, rule, shell, cap, nsCore(中性子星の dragCore), nsR(観測半径),
 * pCore, point(粒子の半径を宣言しない), nsRd(距離の基準に使う中性子星の R_d —— 明示の radius の写し)}
 */
export function nsBook(o = {}) {
  const r = (o.d || 3) * rdSum(o), mt = mNS + mP, v = Math.sqrt(NS_G * mt / r);
  const ns = { type: 'single', m: mNS, radius: o.nsR || NS.R, x: -r * mP / mt, y: 0, z: 0, vx: 0, vy: -v * mP / mt, vz: 0, spin: NS.spin, pinned: false };
  const pt = { type: 'single', m: mP, radius: PTCL.R, x: r * mNS / mt, y: 0, z: 0, vx: 0, vy: v * mNS / mt, vz: 0, spin: 0, pinned: false };
  if (o.nsCore) ns.dragCore = clone(o.nsCore);
  if (o.pCore) pt.dragCore = clone(o.pCore);
  if (o.point) delete pt.radius;
  return { id: 'w314aNeutronStar', name: '中性子星と試験粒子の写し(第314便a の器 —— 内蔵の本ではない)', emoji: '⭐', description: '第314便a の器の写し(R_d > R の受理と表示)',
    camera: { scale: 150 }, world: { boundary: 'none', size: 0 }, scaleExp: { L: UNITS.L, T: UNITS.T, M: UNITS.M },
    physics: { coord: '3d', G: NS_G, cLight: NS_C, D0: 0.1, kFrame: 0, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      lambdaPN: 0, geoPN: 0, softening: 0.05, radiusScale: 1, timeScale: 1, frameWeight: 'share', stepDt: 0.5, stateCarry: 'double', massFloor: 1e-6, relativeDrag: nsDrag(o) },
    bodies: [ns, pt] };
}
/** 太陽系の写しの基(引きずりの宣言の前 —— G_loc は外す) */
export function solarBase(HP, key) {
  const b = SOLAR.find((x) => x.key === key);
  if (b.pin) { const q = Q.pinnedBook(HP, PIN, b.id); delete q.physics.gLoc; return q; }
  const p = HP.allPresets().find((x) => x.id === b.id); if (!p) throw new Error('本が無い: ' + b.id);
  const q = clone(p); delete q.fitRecord; delete q.abBody; delete q.physics.gLoc; return q;
}
/** 太陽系の K1 + rdRule の写し(第311便d の NEW_DRAG から dragCoreDefault を外す・外殻 uniform —— 在位の構造核の宣言は外す)。cap = K2 + dragCoreDefault の写し */
export function solarBook(HP, key, o = {}) {
  const q = solarBase(HP, key), rd = clone(Q.NEW_DRAG);
  if (o.cap) { delete rd.invSq.kernel; delete rd.invSq.rdRule; }
  else { delete rd.dragCoreDefault; rd.invSq.kernel = 'k1'; rd.invSq.rdRule = 'kappaM'; }
  q.physics.relativeDrag = rd;
  for (const b of q.bodies) delete b.dragCore;
  return q;
}
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: (v.errors || []).join(' ').slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset, warnings: v.warnings || [] };
}
const isX = (w) => /AN404/.test(w) && /観測半径/.test(w);
/** 写しの要点(本の ID と宣言の要点 —— 出力に必ず印字する) */
const declOf = (q) => ({ id: q.id, invSq: q.physics.relativeDrag.invSq, cap: q.physics.relativeDrag.dragCoreDefault || null,
  bodies: q.bodies.filter((b) => b.type === 'single').map((b) => ({ m: b.m, R: b.radius === undefined ? null : b.radius, dragCore: b.dragCore || null })) });

/* ───────── 段 A(受理の表)───────── */
/** 第315便b の世代(K1 の境界の 1 点 —— K1 で外殻を宣言しない本の massFrac < 1 ∧ R_c = R を受理する html)。前の世代は「マントルの体積が 0」で偽。
 *  探りの写しは段 A の行と別の massFrac(0.9)—— 受理の振る舞いで判定・REGEN_SCOPE は動かさない */
export function k1EdgeGen(H) {
  return H.HP.validatePreset(clone(nsBook({ nsCore: { massFrac: 0.9, radius: NS.R } }))).ok === true;
}
export function partA(H) {
  const HP = H.HP, VB = E(H, 'validateDragCoreBody'), rows = [], k = kappaBook(NS_G, NS_C), RdNS = k * Math.fround(mNS);
  const g315 = k1EdgeGen(H);   // 第315便b(世代切替): K1 の外殻なしの R_c = R ∧ massFrac < 1 は受理(前の世代は拒否)
  const T = (lab, path, q, ok, nWarn, re) => {
    const v = HP.validatePreset(clone(q)), m = (v.errors || []).join(' '), wx = (v.warnings || []).filter(isX);
    const pass = ok ? (v.ok && wx.length === nWarn) : (!v.ok && re.test(m));
    rows.push({ case: lab, path, decl: declOf(q), expectOk: ok, expectWarn: ok ? nWarn : null, expectErr: ok ? null : re.source, ok: v.ok, nWarnX: wx.length,
      warn: wx.length ? wx[0].slice(0, 240) : null, err: v.ok ? null : m.slice(0, 240), pass });
  };
  const D = (lab, path, b, ph, re) => {
    const v = VB(clone(b), clone(ph));
    rows.push({ case: lab, path, decl: { body: b, physics: ph }, expectOk: false, expectWarn: null, expectErr: re.source, ok: v.ok, nWarnX: 0, warn: null, err: v.ok ? null : String(v.err).slice(0, 240), pass: !v.ok && re.test(String(v.err)) });
  };
  const SHELL = /AN403・AN409/;
  T('K1 規則・dragCore なし(R_d = κ₀m > R —— 規則の経路)', 'rule', nsBook({ rule: true }), true, 1);
  T('K1 規則・dragCore:{massFrac:1}(radius の省略の経路)', 'omit', nsBook({ rule: true, nsCore: { massFrac: 1 } }), true, 1);
  T('K1 規則・dragCore:{massFrac:0.5}(radius の省略・外殻なし —— R_d = κ₀·0.5m > R)', 'omit', nsBook({ rule: true, nsCore: { massFrac: 0.5 } }), true, 1);
  T('K1 規則なし・明示の dragCore {massFrac:1, radius:κ₀m}(明示の経路)', 'explicit', nsBook({ nsCore: { massFrac: 1, radius: RdNS } }), true, 1);
  T('K1 規則・明示の dragCore {massFrac:1, radius:30}(明示が規則より優先)', 'explicit', nsBook({ rule: true, nsCore: { massFrac: 1, radius: 30 } }), true, 1);
  T('K1 明示の dragCore {massFrac:0.5, radius:20}(外殻なし)', 'explicit', nsBook({ nsCore: { massFrac: 0.5, radius: 20 } }), true, 1);
  T('K1 規則・観測半径 30(R_d < R —— 内)', 'inside', nsBook({ rule: true, nsR: 30 }), true, 0);
  T('K1 規則・外殻 uniform・dragCore:{massFrac:0.5}(R_d ≥ R —— 外殻の組)', 'shell', nsBook({ rule: true, shell: 'uniform', nsCore: { massFrac: 0.5 } }), false, 0, SHELL);
  T('K1 規則・外殻 thin・dragCore:{massFrac:0.5}(R_d ≥ R —— 外殻の組)', 'shell', nsBook({ rule: true, shell: 'thin', nsCore: { massFrac: 0.5 } }), false, 0, SHELL);
  T('K1 外殻 uniform・明示の dragCore {massFrac:0.5, radius:12}(R_d = R —— 外殻の組)', 'shell', nsBook({ shell: 'uniform', nsCore: { massFrac: 0.5, radius: 12 } }), false, 0, SHELL);
  T('K1 規則・外殻 uniform・dragCore なし(m_d = m —— 外殻を持たない)', 'shell', nsBook({ rule: true, shell: 'uniform' }), true, 1);
  T('K1 規則・外殻 uniform・明示の dragCore {massFrac:0.9, radius:6}(内 —— 外殻あり)', 'shell', nsBook({ rule: true, shell: 'uniform', nsCore: { massFrac: 0.9, radius: 6 } }), true, 0);
  if (g315) T('K1 外殻なし・明示の dragCore {massFrac:0.5, radius:12}(R_c = R —— 第315便b で受理)', 'explicit', nsBook({ nsCore: { massFrac: 0.5, radius: 12 } }), true, 0);
  else T('K1 外殻なし・明示の dragCore {massFrac:0.5, radius:12}(R_c = R —— 今のまま)', 'explicit', nsBook({ nsCore: { massFrac: 0.5, radius: 12 } }), false, 0, /マントルの体積が 0/);
  T('K1 規則なし・dragCore:{massFrac:0.5}(radius の省略は規則の本だけ)', 'omit', nsBook({ nsCore: { massFrac: 0.5 } }), false, 0, /radius の省略は invSq\.rdRule の本だけ/);
  T('K2 明示の dragCore {massFrac:1, radius:κ₀m}(マントルなし —— AN411)', 'k2', nsBook({ kernel: 'k2', nsCore: { massFrac: 1, radius: RdNS } }), true, 1);
  T('K2 明示の dragCore {massFrac:0.5, radius:κ₀m}(マントルあり —— AN411)', 'k2', nsBook({ kernel: 'k2', nsCore: { massFrac: 0.5, radius: RdNS } }), false, 0, /AN411/);
  T('K2 外殻 uniform・明示の dragCore {massFrac:0.5, radius:κ₀m}', 'k2', nsBook({ kernel: 'k2', shell: 'uniform', nsCore: { massFrac: 0.5, radius: RdNS } }), false, 0, /AN411/);
  T('K2 明示の dragCore {massFrac:0.5, radius:6}(内)', 'k2', nsBook({ kernel: 'k2', nsCore: { massFrac: 0.5, radius: 6 } }), true, 0);
  T('K2 明示の dragCore {massFrac:1, radius:12}(R_c = R —— 超過でない)', 'k2', nsBook({ kernel: 'k2', nsCore: { massFrac: 1, radius: 12 } }), true, 0);
  T('K2 dragCore なし(R_d = R —— 今のまま)', 'k2', nsBook({ kernel: 'k2' }), true, 0);
  T('K1 明示の dragCore.radius −1(正の検査は残す)', 'finite', nsBook({ nsCore: { massFrac: 1, radius: -1 } }), false, 0, /正の有限数/);
  T('K1 明示の dragCore.radius "24"(文字列 —— 有限の数の検査は残す)', 'finite', nsBook({ nsCore: { massFrac: 1, radius: '24' } }), false, 0, /正の有限数/);
  T('K1 規則・試験粒子の半径なし(点 —— 規則を当てない)', 'point', nsBook({ rule: true, point: true }), true, 1);
  T('K2 + dragCoreDefault cap6500km(☿ の写し —— 太陽の R はクランプ・cap の超過は AN404 の警告でない)', 'cap', solarBook(HP, 'mercury', { cap: true }), true, 0);
  const inert = { relativeDrag: { law: 'inertial', gain: 1, eps: 0.1, pairs: 'all', history: 'positions' }, softening: 0.1 };
  D('旧則(invSq なし)の構造核 R_c > R(今の契約 0 < R_c ≤ R)', 'old', { radius: 12, m: mNS, dragCore: { massFrac: 1, radius: RdNS } }, inert, /dragCore\.radius は 0<R_c≤radius/);
  D('law が inertial でない本の dragCore R_c > R(今の契約)', 'old', { radius: 12, m: mNS, dragCore: { massFrac: 1, radius: RdNS } }, { relativeDrag: { law: 'pairSlip', kappa: 1 } }, /dragCore\.radius は 0<R_c≤radius/);
  return { rows, allPass: rows.every((r) => r.pass), n: rows.length, kappaBook: k, RdNS };
}

/* ───────── 段 W(警告の文)───────── */
export function partW(H) {
  const HP = H.HP, v = HP.validatePreset(clone(nsBook({ rule: true }))), w = (v.warnings || []).filter(isX), line = w[0] || '';
  const words = ['R_d = ', '観測半径 R = 12', '比 R_d/R = ', '重力半径に比例する長さとして受理', '物質半径ではない', '引きずり球どうしの重なりは今のまま数える', '第314便a', 'AN404'];
  const miss = words.filter((x) => line.indexOf(x) < 0), cap = /cap|6\.5/.test(line);
  const v2 = HP.validatePreset(clone(nsBook({ rule: true, nsCore: { massFrac: 1 } }))), w2 = (v2.warnings || []).filter(isX);
  return { line, perBody: w.length, miss, mentionsCap: cap, omitLine: w2[0] || '', omitPrefixed: /^bodies\[0\]\.dragCore の引きずりの半径/.test(w2[0] || ''), ok: w.length === 1 && !miss.length && !cap && /^bodies\[0\] の規則の引きずりの半径/.test(line) && /^bodies\[0\]\.dragCore の引きずりの半径/.test(w2[0] || '') };
}

/* ───────── 段 N(写しの走行)───────── */
export function partN(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), ex = E(H, 'inertialDragIsqRdExcessOf'), nst = quick ? STEPS_QUICK : STEPS, rows = [];
  const k = kappaBook(NS_G, NS_C);
  const RdSI = 10 * SI.G * (NS.mSun * SI.Msun) / (C1 * SI.c * SI.c);   // 閉じた式(宣言の質量 —— 倍精度・SI)
  const one = (lab, q, d) => {
    const z = simOf(HP, q);
    if (z.err) return { case: lab, d, decl: declOf(q), accepted: false, err: z.err };
    const s0 = st(z.S), x0 = ex(z.S), rx = s0.radiusExcess || null, dt = E(H, 'appStepDt')(z.S);
    const r0 = Math.hypot(z.S.x[1] - z.S.x[0], z.S.y[1] - z.S.y[0], z.S.z[1] - z.S.z[0]);
    const rp = s0.receivers.find((x) => x.i === 1), rn = s0.receivers.find((x) => x.i === 0);
    let finite = true;
    for (let i = 0; i < nst; i++) { z.S.step(dt); for (let j = 0; j < z.S.n; j++) if (![z.S.x[j], z.S.y[j], z.S.z[j], z.S.vx[j], z.S.vy[j], z.S.vz[j]].every(Number.isFinite)) finite = false; }
    const s1 = st(z.S), r1 = Math.hypot(z.S.x[1] - z.S.x[0], z.S.y[1] - z.S.y[0], z.S.z[1] - z.S.z[0]);
    return { case: lab, d, decl: declOf(q), accepted: true, nWarnX: z.warnings.filter(isX).length, radiusExcess: rx, displayN: x0 ? x0.n : 0, displayMax: x0 ? x0.maxRatio : null,
      displaySame: !!(x0 && rx && x0.bodies.length === rx.bodies.length && x0.bodies.every((b, i) => b.i === rx.bodies[i].i && b.Rd === rx.bodies[i].Rd && b.Robs === rx.bodies[i].Robs)),
      rdRule: s0.rdRule ? s0.rdRule.bodies.map((b) => ({ i: b.i, m: b.m, Rd: b.Rd, src: b.src })) : null,
      r0, rdSum: rdSum(), overlap0: s0.overlap, betaP: rp ? rp.beta[0] : null, betaNS: rn ? rn.beta[1] : null, rotP: (rp && rp.rot) ? nrm(rp.rot.slice(0, 3)) : null,
      steps: nst, dt, finite, r1, overlapSteps: s1.overlapSteps, betaMaxRun: s1.betaMax, badRow: z.S.inertialDragIsqBadRow || 0, lowDen: z.S.inertialDragIsqLowDen || 0, tooLarge: s1.tooLarge };
  };
  for (const d of NS_D) rows.push(one('K1 + rdRule・距離 ' + d + ' × (R_d,NS + R_d,p)', nsBook({ rule: true, d }), d));
  const explicit = one('K1 + rdRule・明示の dragCore {massFrac:1, radius:30}(規則より優先)・距離 3 × (30 + R_d,p)', nsBook({ rule: true, d: 3, nsCore: { massFrac: 1, radius: 30 }, nsRd: 30 }), 3);
  const k2 = one('K2・明示の dragCore {massFrac:1, radius:κ₀m}(AN411)・距離 3 × R_d の和', nsBook({ kernel: 'k2', d: 3, nsCore: { massFrac: 1, radius: k * Math.fround(mNS) } }), 3);
  const ns = rows.map((r) => r.radiusExcess && r.radiusExcess.bodies[0]).filter(Boolean);
  const RdEng = k * Math.fround(mNS);
  return { rows, explicit, k2, kappaBook: k, RdEngine: RdEng, RdClosedSI: RdSI, RdClosedKm: RdSI / 1e3,
    ratioEngine: RdEng / NS.R, relEngineVsClosed: rel(RdEng * Lm, RdSI),
    maxRelReadout: Math.max(...ns.map((b) => rel(b.Rd, RdEng)), ...ns.map((b) => rel(b.ratio, RdEng / NS.R))),
    allFinite: rows.concat([explicit, k2]).every((r) => r.accepted && r.finite && r.badRow === 0) };
}

/* ───────── 段 S(太陽系の写し)───────── */
export function partS(H) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), ex = E(H, 'inertialDragIsqRdExcessOf'), rows = [];
  for (const b of SOLAR) {
    const q = solarBook(HP, b.key), z = simOf(HP, q);
    if (z.err) { rows.push({ key: b.key, id: b.id, decl: declOf(q), accepted: false, err: z.err }); continue; }
    const s = st(z.S), rr = s.rdRule.bodies;
    const ratios = rr.map((x) => x.Rd / q.bodies[x.i].radius);
    rows.push({ key: b.key, id: b.id, decl: declOf(q), accepted: true, nWarnX: z.warnings.filter(isX).length, nWarn: z.warnings.length, hasField: 'radiusExcess' in s, display: ex(z.S),
      maxRdOverR: Math.max(...ratios), maxAt: rr[ratios.indexOf(Math.max(...ratios))].i, src: rr.map((x) => x.src) });
  }
  return { rows, allNone: rows.every((r) => r.accepted && r.nWarnX === 0 && !r.hasField && r.display === null && r.maxRdOverR < 1) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const n = J.N.rows, near = n.filter((r) => r.d >= 1), ov = n.filter((r) => r.d < 1);
  return {
    acceptance: J.A.allPass,
    warnText: J.W.ok,
    excessReadout: n.every((r) => r.accepted && r.radiusExcess && r.radiusExcess.version === J.rdExcessVersion && r.radiusExcess.bodies.length === 1 && r.radiusExcess.bodies[0].i === 0 && r.radiusExcess.bodies[0].Robs === NS.R) && J.N.maxRelReadout < 1e-12,
    displaySame: n.concat([J.N.explicit, J.N.k2]).every((r) => r.displaySame && r.displayN === 1),
    overlapKept: near.every((r) => r.overlap0 === null && r.overlapSteps === 0 && r.betaP > 0) && ov.every((r) => Array.isArray(r.overlap0) && r.overlap0[0] === 0 && r.overlap0[1] === 1 && r.overlapSteps === r.steps),
    finite: J.N.allFinite,
    explicitPriority: J.N.explicit.radiusExcess && J.N.explicit.radiusExcess.bodies[0].Rd === 30 && J.N.explicit.radiusExcess.bodies[0].ratio === 2.5,
    k2Excess: !!(J.N.k2.radiusExcess && J.N.k2.radiusExcess.bodies.length === 1),
    closedForm: J.N.relEngineVsClosed < 1e-6,
    solarNone: J.S.allNone,
    version: J.rdExcessVersion === 'w314a-rd-excess-1',
  };
}

/* ───────── 文書の表と数(PHYSICS〔第314便a〕—— QA docs.rdExcess314 が正本から作り直して逐語で照合する)───────── */
const e3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : Number(v).toExponential(3));
const fl = (v, floor) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : fmtFloor(v, floor, 3));
const p4 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toPrecision(4);
export function physicsTables(J) {
  const out = [];
  out.push('| 受理の表(中性子星 1.4 M☉・R 12 km の写し —— 本の長さ 1 km) | 経路 | 期待 | 結果 | AN404 の警告 |', '|---|---|---|---|---|');
  for (const r of J.A.rows) out.push(`| ${r.case} | ${r.path} | ${r.expectOk ? '受理' : '拒否'} | ${r.ok ? '受理' : '拒否'}${r.pass ? '' : '(違う)'} | ${r.ok ? r.nWarnX : '—'} |`);
  out.push('', '| 写しの走行(K1 + rdRule・' + J.N.rows[0].steps + ' 步) | 距離 r [km] | R_d/R(読み口) | t = 0 の重なり | β(粒子 ← 中性子星) | overlap の步 | 有限・badRow |', '|---|---|---|---|---|---|---|');
  for (const r of J.N.rows.concat([J.N.explicit, J.N.k2])) out.push(`| ${r.case} | ${p4(r.r0)} | ${r.radiusExcess ? p4(r.radiusExcess.bodies[0].ratio) : '—'} | ${r.overlap0 ? '重なる' : 'なし'} | ${e3(r.betaP)} | ${r.overlapSteps}/${r.steps} | ${r.finite ? '有限' : '非有限'}・${r.badRow} |`);
  out.push('', '| 太陽系の写し(K1 + rdRule・外殻 uniform) | R_d/R の最大 | radiusExcess の欄 | AN404 の警告 | 表示の読み口 |', '|---|---|---|---|---|');
  for (const r of J.S.rows) { const b = SOLAR.find((x) => x.key === r.key); out.push(`| ${b.emoji} ${b.ja} | ${e3(r.maxRdOverR)} | ${r.hasField ? 'ある' : 'なし'} | ${r.nWarnX} | ${r.display === null ? 'null' : '超過あり'} |`); }
  out.push('', '| 照合 | 値 |', '|---|---|');
  out.push(`| 受理の表(K1 × 規則/省略/明示 × 超過/内・K2 × massFrac 1/0.5・外殻 + 超過・点・正と有限・cap・旧則) | ${J.A.rows.filter((r) => r.pass).length}/${J.A.n} |`);
  out.push(`| 中性子星の R_d = κ₀m(読み口 —— エンジンが使う質量)・閉じた式 10GM/(C₁c²)(SI・宣言の質量)との相対の差 | ${p4(J.N.RdEngine)} km・${fl(J.N.relEngineVsClosed, 1e-6)} |`);
  out.push(`| 警告の文(超過の天体ごとに 1 行・cap の文と別) | ${J.W.ok ? '語がそろう' : '違う'} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  return [p4(J.N.ratioEngine), p4(J.N.RdEngine), p4(J.N.RdClosedKm), String(J.A.n)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const A = partA(H); tick('A');
  const W = partW(H); tick('W');
  const N = partN(H, quick); tick('N');
  const S = partS(H); tick('S');
  const J = { quick, rdExcessVersion: E(H, 'REL_DRAG_RD_EXCESS_VERSION'), A, W, N, S };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 受理を変えた鍵を読む既存の器・正本の扱い(第314便a の枝で scratch で走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w313a-kappam.mjs', reads: '段 A の AN404 の拒否の行(規則 + 太陽の半径 1.0e-3・規則なし + dragCore:{massFrac:0.5} の文)', handling: '受理の振る舞いで世代を判定(rdxGen —— REGEN_SCOPE は動かさない)・新しい世代は受理して警告・文は「radius の省略は invSq.rdRule の本だけ」' },
  { file: 'tests/exp-w311a-corespin.mjs・exp-w310a-invsq.mjs・exp-w312a-decay.mjs・exp-w313b-galaxialrdm.mjs', reads: 'dragCore と invSq の受理・読み口', handling: '超過の天体を宣言しない —— 受理と読み口は今と同じ(正本の値は不変 —— scratch で照合)' },
];

export async function main() {
  const TARGET = process.env.W314A_TARGET || 'beta/index.html';
  const OUT = process.env.W314A_OUT || path.join(ROOT, 'tests', 'out', 'rdexcess-w314a.json');
  const quick = process.env.W314A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w314a-rdexcess.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第116報)AN404 R_d は観測半径を超えても受理する・超えた場合の表示も用意する・AN403/AN409 外殻の引きずりは粒子同士が触れるぐらいの距離の特別処理(将来の地表のサンプル)・決断事項 AN411 の推奨の型・統括の検証項目 R238',
    units: { book: UNITS, G: NS_G, cLight: NS_C, si: SI }, versionReaders: VERSION_READERS, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w314a-rdexcess.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w311c-h4carry.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第314便a', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
  console.log('A', out.A.rows.filter((r) => r.pass).length + '/' + out.A.n, out.A.rows.filter((r) => !r.pass).map((r) => r.case + ' ok=' + r.ok + ' ' + (r.err || '')).join(' / '));
  for (const r of out.N.rows.concat([out.N.explicit, out.N.k2])) console.log('N', r.decl.id, JSON.stringify(r.decl.invSq), r.decl.bodies.map((b) => 'm=' + b.m + ' R=' + b.R + ' dragCore=' + JSON.stringify(b.dragCore)).join(' / '),
    'r0=' + r.r0, 'Rd/R=' + (r.radiusExcess ? r.radiusExcess.bodies[0].ratio : null), 'ov0=' + JSON.stringify(r.overlap0), 'betaP=' + r.betaP, 'ov=' + r.overlapSteps + '/' + r.steps, 'finite=' + r.finite);
  for (const r of out.S.rows) console.log('S', r.id, JSON.stringify(r.decl.invSq), r.decl.bodies.map((b) => 'm=' + b.m + ' R=' + b.R).join(' / '), 'maxRd/R=' + r.maxRdOverR, 'field=' + r.hasField, 'warnX=' + r.nWarnX);
}
if (IS_MAIN) await main();

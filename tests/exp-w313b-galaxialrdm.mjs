// 第313便b(原仮定者の裁定(第115報)「一様軸引きずりの R_d の応答の次数は、K1 を主にする q = 1 で、質量も入る」(決断事項 AN395)・「K1 を採用する」(AN399)・
// 「太陽を含む全天体に同じ規則 R_d = κm を当てる」(AN402)・統括の検証項目 R235): **一様軸引きずりの受け手の質量の次数**(galaxyAxial.massPow・refMass —— K1・rdPow 1 と
// 一緒にだけ)**と、K1 の核の自然な応答を規則の値(ミリメートル)の R_d で測る器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の validatePreset・coord3d.makeSim・build・step と
// 読み口 inertialDragIsqState・inertialDragGalaxyAxialState・評価の写し inertialDragInitObsEval をそのまま呼ぶ)。写しは器の中で組む(**在位の本の宣言は変えない** ——
// 在位の本は 1 本も galaxyAxial を宣言しない)。太陽系の写しと向きと尺度は第311便b の器(tests/exp-w311b-galaxial.mjs)のもの。**全天体の R_d = κ₀m は写しの明示の dragCore**
// (κ₀ = 10G/(C₁c²) —— 閉じた式・本の G と c から本の単位で作る・m はエンジンの質量〔Float32 の本は丸めた値〕)。
//
// ■ 段
//   A(受理): massPow(−1 だけ —— K1〔invSq.kernel:"k1"〕・rdPow 1 と一緒にだけ)・refMass(massPow と一緒に必須・正の有限の数 —— 単独は拒否)・未知の鍵・物理の単位の無い本・
//     旧則の本・rdPow だけの K1 の本(第312便b の形)。
//   B(確かめ): ① rdPow だけの宣言の読み口は第312便b の形(mass・responseFactor・rdm の欄なし)・軸の ω = 銀河なし + ω_G (R_d/R_ref)
//     ② 同じ状態の build(評価の写し —— 観測の初期値の分解と同じ経路)で β・並進の右辺・回転の係数はビット同一・軸の ω = 銀河なし + ω_G (R_d,i/R_ref)(m_ref/m_i)
//     ③ 孤立の受け手(R_d = R_ref × {1/2, 1, 2}・m = m_ref × {1, 10})で ω/ω_G = (R_d/R_ref)(m_ref/m)(R_d 2 倍 → 2 倍・質量 10 倍 → 0.1 倍)
//     ④ 位置の不変(受け手を 3 か所へ)・R_d と質量を同じ倍率(2 倍)にした双子は同じ係数(R_d/m が同じなら同じ)
//     ⑤ 2 步の並進・自転の大きさはビット同一・軸だけが違う ⑥ R_ref の既定(6.5×10⁶ m / 10^L)⑦ 下限で持ち上げた天体の質量(エンジンの質量 —— 持ち上げた値)
//   N(K1 の核の自然な応答 —— 規則の値の R_d): 源(太陽 —— R_d = κ₀M☉)から距離 r に置いた受け手(水星の写し —— R_d = κ₀m = 2.9075 mm)の軸の ω(源から来る分 ——
//     読み口 inertialDragIsqState の receivers[].omega)を、受け手の R_d を 1/2・1・2 倍・質量を 1/10・1・10 倍に変えて次数を測る(距離 0.387・3.87・38.7 au・
//     求積の次数 8・16・原点は源の中心と受け手の中心〔近い原点〕と遠い原点〔両方を 10 r ずらす〕)。対照: R_d と質量を同じ 10⁶ 倍(R_d/m が同じ —— 一様の極限の ω は同じ・
//     受け手の上の源の距離の変化 R_d/r が倍精度で表せる)。
//   X(軸の角の試験): 太陽系の写し(太陽・水星・金星・地球・火星・木星)を K1 + 全天体 R_d = κ₀m + rdPow 1・massPow −1(基準の組 R_ref = κ₀m_ref・m_ref = 太陽の質量 ——
//     規則の上の基準)で、ω_G = f Ω_ref ĝ(f = 10⁻²・1 —— 尺度 V₀/R₀・大きさは未定)。全天体の係数が共通 → 天体どうしの軸の角は丸めの床より変わらない。
//     軌道法線と銀河なしの写しの軸(外部の参照)に対する変化は測る。1 天体だけ規則から外した写し(地球の R_d を 2κ₀m)で地球を含む対の角が一次の見積り
//     −(f_i − f_j) ω_G·(â_i × â_j) t / sin ψ_ij のとおりに変わる。比較: q = 0(共通の ω_G)と rdPow 1 だけ(質量なし —— 係数は R_d/R_ref で天体ごとに違う)。
//
// ■ 言わないこと: 「天の川を較正した」「フィットした」「法則を発見した」「完全に一致」・ω_G の大きさを決めた・κ を合わせた。表の大きさは**未定(AN395)の格子**。
//   2 公転の窓の数を長い時間へ外挿して書かない。段 N の値は二体の写しの読み口(步を進めない)で、在位の本の値ではない。
//
// ■ 使い方
//   node tests/exp-w313b-galaxialrdm.mjs   → 正本 tests/out/galaxialrdm-w313b.json(段 galaxialrdm-313b)
//   W313B_OUT=<json> で出力先を変える(試走は正本を書かない)・W313B_TARGET=<html>(既定 beta/index.html)・W313B_QUICK=1(水星の 1/4 公転 —— 煙試験の窓)・
//   W313B_STAGES=A,B,N,X(走らせる段 —— 既定は全部)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fmtFloor } from './lib-w311c-h4carry.mjs';
import * as G311 from './exp-w311b-galaxial.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 器の本は .find で引く・tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","GALAXY_AXIAL_MASS_POWS","GALAXY_AXIAL_RDM_VERSION","GALAXY_AXIAL_RD_VERSION","GALAXY_AXIAL_REF_RADIUS_M","GALAXY_AXIAL_VERSION","HP.allPresets","HP.coord3d","HP.validatePreset","INERTIAL_DRAG3_MAINT_SC","REL_DRAG_AXIS_HOLD_INTERVAL_UNDECLARED","REL_DRAG_AXIS_HOLD_LEDGER_VERSION","REL_DRAG_AXIS_HOLD_MAINT_VERSION","REL_DRAG_INIT_DEN_MIN","REL_DRAG_INIT_OBS_VERSION","REL_DRAG_INVSQ_KERNEL_VERSION","REL_DRAG_INVSQ_VERSION","T","appStepDt","ckRestoreOne","ckSnapOne","ctx","cw","inertialDrag3AxialSign","inertialDrag3SpinState","inertialDragGalaxyAxialState","inertialDragInitObsEval","inertialDragInitObsRedo","inertialDragInitObsState","inertialDragInverseMap","inertialDragIsqState","pnSource","retiredOf","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w313b-galaxialrdm-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.hypot(a[0], a[1], a[2]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const ang = (a, b) => Math.atan2(norm(cross(a, b)), dot(a, b));   // atan2(|a×b|, a·b)
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['天の川を較正した', 'フィットした', '法則を発見した', '完全に一致', 'ω_G の大きさを決めた', 'κ を合わせた', '銀河の模型から ω_G を導いた'];
const MER = 'mercurySunInertial3d';
/** |ω_G| = f Ω_ref の格子(大きさは未定 —— AN395) */
export const F_GRID = Object.freeze([1e-2, 1]);
/** 段 N の距離(水星の軌道の長半径 0.387 au の倍数)・受け手の変え方・求積の次数・原点・対照の倍率 */
export const N_DIST = Object.freeze([1, 10, 100]);
export const N_RD = Object.freeze([0.5, 1, 2]), N_M = Object.freeze([0.1, 1, 10]), N_ORDERS = Object.freeze([8, 16]), N_CTRL = 1e6, N_FAR = 10;
export const AU_M = 1.495978707e11, A_MER_AU = 0.387, EPS = Math.pow(2, -52);
/** 段 B の孤立の受け手の R_ref(本の長さの単位 —— 二進で正確な 1/16)と m_ref(太陽の写しの質量 1988.5 —— Float32 でも正確) */
export const B_REF = 0.0625;
/** 段 X で規則から外す天体(地球 —— R_d = 2κ₀m) */
export const X_OFF = 3;
const FLOOR_ANG = 1e-13;   // 天体どうしの軸の角の変化の丸めの床 [rad](第311便b・第312便b の表と同じ)

/** C₁ = 6[(√3/2) ln(2 + √3) − 1](K1 の受け手の自己の場の比の体積平均 —— 閉じた式)と κ₀ = 10G/(C₁c²)(本の G・c から本の単位 [L/M]) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
export const kappaBook = (q) => 10 * q.physics.G / (C1 * q.physics.cLight * q.physics.cLight);
export const kappaSI = (q) => kappaBook(q) * Math.pow(10, q.scaleExp.L) / Math.pow(10, q.scaleExp.M);

const findP = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); };
/** ☿ 3D の写し(第311便b の器 —— 新則・cap6500km)に K1 と galaxyAxial を足す(kernel を null にすると K2 のまま) */
export function merCopy(HP, galaxy, kernel = 'k1') {
  const q = G311.merCopy(HP, galaxy === undefined ? {} : { galaxyAxial: clone(galaxy) });
  if (kernel) q.physics.relativeDrag.invSq.kernel = kernel;
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
/** html と同じ演算の順の係数(massPow −1: x = R_d/R_ref → x·(m_ref/m)・rdPow だけ: x)—— 器の側の作り直し */
export const rdmFactor = (Rd, Rr, m, Mr) => { const x = Rd / Rr; return x * (Mr / m); };
export const rdFactor1 = (Rd, Rr) => Rd / Rr;

/* ───────── 段 A(受理)───────── */
export function partA(H) {
  const HP = H.HP, rows = [];
  const tryV = (q) => { const v = HP.validatePreset(clone(q)); return { ok: v.ok, errFull: v.ok ? '' : String((v.errors || [])[0] || ''), err: v.ok ? null : String((v.errors || [])[0] || '').slice(0, 160), canon: v.ok ? (v.preset.physics.relativeDrag || {}).galaxyAxial : undefined, preset: v.ok ? v.preset : null }; };
  const G0 = { wx: 1e-12, wy: -2e-12, wz: 3e-12 }, J0 = '"wx":1e-12,"wy":-2e-12,"wz":3e-12';
  const MP = /massPow は -1〔K1・rdPow 1 と一緒にだけ〕/, MPv = /massPow は -1〔K1・rdPow 1 と一緒にだけ〕[^]*値が -1 でない/, MPk = /massPow は -1〔K1・rdPow 1 と一緒にだけ〕[^]*invSq\.kernel が "k1" でない/,
    MPr = /massPow は -1〔K1・rdPow 1 と一緒にだけ〕[^]*rdPow が 1 でない/, RM = /refMass は正の有限の数/, RO = /refMass は massPow と一緒にだけ/;
  const A = [
    // [名前, galaxyAxial, kernel, 受理の期待, 正準形 | 理由の正規表現]
    ['K1・rdPow 1・massPow −1・refMass 1', { ...G0, rdPow: 1, massPow: -1, refMass: 1 }, 'k1', true, '{' + J0 + ',"rdPow":1,"massPow":-1,"refMass":1}'],
    ['K1・rdPow 1・refRadius・massPow −1・refMass 2.5', { ...G0, rdPow: 1, refRadius: 0.0625, massPow: -1, refMass: 2.5 }, 'k1', true, '{' + J0 + ',"rdPow":1,"refRadius":0.0625,"massPow":-1,"refMass":2.5}'],
    ['K1・rdPow 1 だけ(第312便b の形)', { ...G0, rdPow: 1 }, 'k1', true, '{' + J0 + ',"rdPow":1}'],
    ['K1・省略(第311便b の形)', { ...G0 }, 'k1', true, '{' + J0 + '}'],
    ['K2(省略)・rdPow 1・massPow −1', { ...G0, rdPow: 1, massPow: -1, refMass: 1 }, null, false, MPk],
    ['K2("k2" を明示)・rdPow 1・massPow −1', { ...G0, rdPow: 1, massPow: -1, refMass: 1 }, 'k2', false, MPk],
    ['K1・rdPow 2・massPow −1', { ...G0, rdPow: 2, massPow: -1, refMass: 1 }, 'k1', false, MPr],
    ['K1・rdPow 0・massPow −1', { ...G0, rdPow: 0, massPow: -1, refMass: 1 }, 'k1', false, MPr],
    ['K1・rdPow なし・massPow −1', { ...G0, massPow: -1, refMass: 1 }, 'k1', false, MPr],
    ['K1・rdPow 1・massPow 1', { ...G0, rdPow: 1, massPow: 1, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow −2', { ...G0, rdPow: 1, massPow: -2, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow −0.5', { ...G0, rdPow: 1, massPow: -0.5, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow 0', { ...G0, rdPow: 1, massPow: 0, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow −0', { ...G0, rdPow: 1, massPow: -0, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow 文字列 "-1"', { ...G0, rdPow: 1, massPow: '-1', refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow null', { ...G0, rdPow: 1, massPow: null, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow NaN', { ...G0, rdPow: 1, massPow: NaN, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow 真偽値', { ...G0, rdPow: 1, massPow: true, refMass: 1 }, 'k1', false, MPv],
    ['K1・rdPow 1・massPow −1・refMass なし', { ...G0, rdPow: 1, massPow: -1 }, 'k1', false, RM],
    ['K1・rdPow 1・massPow −1・refMass 0', { ...G0, rdPow: 1, massPow: -1, refMass: 0 }, 'k1', false, RM],
    ['K1・rdPow 1・massPow −1・refMass −1', { ...G0, rdPow: 1, massPow: -1, refMass: -1 }, 'k1', false, RM],
    ['K1・rdPow 1・massPow −1・refMass Infinity', { ...G0, rdPow: 1, massPow: -1, refMass: Infinity }, 'k1', false, RM],
    ['K1・rdPow 1・massPow −1・refMass NaN', { ...G0, rdPow: 1, massPow: -1, refMass: NaN }, 'k1', false, RM],
    ['K1・rdPow 1・massPow −1・refMass 文字列', { ...G0, rdPow: 1, massPow: -1, refMass: '1' }, 'k1', false, RM],
    ['K1・rdPow 1・massPow −1・refMass null', { ...G0, rdPow: 1, massPow: -1, refMass: null }, 'k1', false, RM],
    ['K1・rdPow 1・refMass だけ(massPow なし)', { ...G0, rdPow: 1, refMass: 1 }, 'k1', false, RO],
    ['K2・refMass だけ', { ...G0, refMass: 1 }, null, false, RO],
    ['未知の鍵 massRef', { ...G0, rdPow: 1, massPow: -1, refMass: 1, massRef: 1 }, 'k1', false, /未知の鍵/],
    ['未知の鍵 rot(一様回転)', { ...G0, rot: 1e-12 }, 'k1', false, /未知の鍵/],
  ];
  for (const [name, g, kernel, expect, chk] of A) {
    const r = tryV(merCopy(HP, g, kernel));
    let pass = r.ok === expect;
    if (pass && r.ok) pass = JSON.stringify(r.canon) === chk;
    if (pass && !r.ok) pass = /galaxyAxial/.test(r.errFull) && chk.test(r.errFull) && (chk !== RM && chk !== RO ? MP.test(r.errFull) || /未知の鍵/.test(r.errFull) : true);
    rows.push({ key: 'galaxyAxial', name, kernel: kernel || null, ok: r.ok, expectOk: expect, pass, canon: r.canon === undefined ? null : r.canon, err: r.err });
  }
  // 物理の単位の無い本・旧則の本
  const U = [];
  const unitsCase = (name, g, expect, re) => {
    const q = merCopy(HP, g, 'k1'); delete q.physics.relativeDrag.dragCoreDefault; delete q.scaleExp;
    const r = tryV(q), row = { name, ok: r.ok, expectOk: expect, err: r.err };
    row.pass = r.ok === expect && (r.ok || re.test(r.errFull)); U.push(row);
  };
  unitsCase('単位なし・K1・rdPow 1・massPow −1・refRadius 省略', { wx: 1e-12, wy: 0, wz: 0, rdPow: 1, massPow: -1, refMass: 1 }, false, /scaleExp\.L が要る/);
  unitsCase('単位なし・K1・rdPow 1・massPow −1・refRadius 0.0625', { wx: 1e-12, wy: 0, wz: 0, rdPow: 1, refRadius: 0.0625, massPow: -1, refMass: 1 }, true);
  { const q = findP(HP, MER); delete q.fitRecord; q.physics.relativeDrag.galaxyAxial = { wx: 1e-12, wy: 0, wz: 0, rdPow: 1, massPow: -1, refMass: 1 }; const r = tryV(q);
    U.push({ name: '旧則の本 + massPow −1', ok: r.ok, expectOk: false, err: r.err, pass: !r.ok && /invSq の本だけ/.test(r.errFull) }); }
  const all = rows.concat(U);
  return { galaxy: rows, units: U, nPass: all.filter((r) => r.pass).length, nCases: all.length, allPass: all.every((r) => r.pass),
    massPows: E(H, 'GALAXY_AXIAL_MASS_POWS'), rdmVersion: E(H, 'GALAXY_AXIAL_RDM_VERSION'), rdVersion: E(H, 'GALAXY_AXIAL_RD_VERSION'), version: E(H, 'GALAXY_AXIAL_VERSION') };
}

/* ───────── 段 B(確かめ)───────── */
export function partB(H) {
  const HP = H.HP, out = {}, ev = E(H, 'inertialDragInitObsEval'), st = E(H, 'inertialDragGalaxyAxialState'), isq = E(H, 'inertialDragIsqState'), sgn = E(H, 'inertialDrag3AxialSign');
  const g = { wx: 3.1e-11, wy: -1.7e-11, wz: 4.3e-11 }, Lm = Math.pow(10, 8), RrDef = E(H, 'GALAXY_AXIAL_REF_RADIUS_M') / Lm, MREF = 0.5;
  const run = (q, k = 20) => { const r = build(H, q); for (let s = 0; s < k; s++) r.S.step(r.dt); return r.S; };
  const evPair = (S) => { const n = S.n, vel = [S.vx, S.vy, S.vz], S0 = Object.create(S); S0.relDrag = clone(S.relDrag); delete S0.relDrag.galaxyAxial;
    return { T1: ev(S, n, null, null, null, null, vel).T, T0: ev(S0, n, null, null, null, null, vel).T }; };
  // ① rdPow だけの宣言(K1)の読み口は第312便b の形・軸の ω = 銀河なし + ω_G (R_d/R_ref)
  { const b = build(H, merCopy(HP, { ...g, rdPow: 1 })), S = b.S, n = S.n, s = st(S), { T1, T0 } = evPair(S), Rd = isq(S).receivers.map((r) => r.Rd);
    const okW = [...Array(n).keys()].every((i) => { const f = rdFactor1(Rd[i], RrDef); return T1._rdWX[i] === T0._rdWX[i] + g.wx * f && T1._rdWY[i] === T0._rdWY[i] + g.wy * f && T1._rdWZ[i] === T0._rdWZ[i] + g.wz * f && s.receivers[i].rdFactor === f; });
    out.rdOnly = { shape312: s.rd !== undefined && s.rd.version === E(H, 'GALAXY_AXIAL_RD_VERSION') && s.rdm === undefined && s.receivers.every((r) => r.mass === undefined && r.responseFactor === undefined) && s.decl.massPow === undefined,
      omegaPlusFG: okW, version: s.version }; }
  // ② 同じ状態の build(評価の写し —— 状態を動かさない・観測の初期値の分解と同じ経路)
  { const b = build(H, merCopy(HP, { ...g, rdPow: 1, massPow: -1, refMass: MREF })), S = b.S, n = S.n, { T1, T0 } = evPair(S), s = st(S), Rd = isq(S).receivers.map((r) => r.Rd);
    const eqA = (k, len) => same(T1[k], T0[k], len), f = Rd.map((R, i) => rdmFactor(R, RrDef, S.m[i], MREF));
    const okW = [...Array(n).keys()].every((i) => { const gx = g.wx * f[i], gy = g.wy * f[i], gz = g.wz * f[i], pa = gx * S.sax[i] + gy * S.say[i] + gz * S.saz[i];
      return T1._rdWX[i] === T0._rdWX[i] + gx && T1._rdWY[i] === T0._rdWY[i] + gy && T1._rdWZ[i] === T0._rdWZ[i] + gz && T1._rdWS[i] === T0._rdWS[i] + (sgn(S.sax[i], S.say[i], S.saz[i]) > 0 ? pa : -pa)
        && s.receivers[i].omegaG[0] === gx && s.receivers[i].omegaG[1] === gy && s.receivers[i].omegaG[2] === gz && s.receivers[i].responseFactor === f[i] && s.receivers[i].mass === S.m[i] && s.receivers[i].rdFactor === rdFactor1(Rd[i], RrDef); });
    out.fixedState = { A: eqA('_rdA', n * n), U: eqA('_rdUX', n) && eqA('_rdUY', n) && eqA('_rdUZ', n), beta: eqA('_rdIsqBE', n * n), rot: eqA('_rdIsqRV', n * n * 3), deg: eqA('_rdDeg', n),
      omegaPlusFG: okW, factors: f.map(r10), Rd: Rd.map(r10), mass: Array.from(S.m.subarray(0, n)).map(r10), refMass: s.rdm.refMass,
      rdm: { version: s.rdm.version, rule: s.rdm.rule, kernel: s.rdm.kernel, rdPow: s.rdm.rdPow, massPow: s.rdm.massPow }, versionSame: s.version === E(H, 'GALAXY_AXIAL_VERSION') && s.rd.version === E(H, 'GALAXY_AXIAL_RD_VERSION') }; }
  // ③ 孤立の受け手(太陽だけ —— dragCore の半径 R_d = R_ref × k・massFrac 1・質量 m = m_ref × j): ω/ω_G = k/j(二進で正確な k・j = 1 は丸めなし)
  out.isolated = [];
  { const mSun = 1988.5;   // ☿ の本の太陽の質量(Float32 でも正確)
    for (const j of [1, 10]) for (const k of [0.5, 1, 2]) {
      const qq = merCopy(HP, { ...g, rdPow: 1, refRadius: B_REF, massPow: -1, refMass: mSun }); qq.bodies[0].dragCore = { massFrac: 1, radius: B_REF * k }; qq.bodies[0].m = mSun * j;
      const b = build(H, qq), S = b.S, S1 = Object.create(S); S1.n = 1;
      const T = ev(S1, 1, null, null, null, null, [S.vx, S.vy, S.vz]).T, fx = rdmFactor(B_REF * k, B_REF, S.m[0], mSun);
      out.isolated.push({ k, j, ratio: T._rdWX[0] / g.wx, expect: k / j, exact: T._rdWX[0] === g.wx * fx && T._rdWY[0] === g.wy * fx && T._rdWZ[0] === g.wz * fx,
        nearExpect: Math.abs(T._rdWX[0] / g.wx - k / j) <= 4 * EPS * (k / j), betaSum: T._rdA[0], m: S.m[0] });
    }
    const w = (k, j) => out.isolated.find((r) => r.k === k && r.j === j).ratio;
    out.isolatedRatios = { rd2: w(2, 1) / w(1, 1), rdHalf: w(0.5, 1) / w(1, 1), m10: w(1, 10) / w(1, 1) }; }
  // ④ 位置の不変・R_d と質量を同じ倍率にした双子は同じ係数(受け手を 3 か所に置いても銀河の分はビット同一)
  { const base = merCopy(HP, { ...g, rdPow: 1, massPow: -1, refMass: MREF }), tw = clone(base.bodies[1]);
    base.bodies[1].dragCore = { massFrac: 1, radius: 0.0078125 };   // 水星の R_d を二進で正確な 1/128(半径 0.0244 の内)
    tw.m = base.bodies[1].m * 2; tw.dragCore = { massFrac: 1, radius: 0.015625 };   // R_d と質量を 2 倍(R_d/m が同じ —— 二進の倍率で係数がビット同一)
    tw.x = -base.bodies[1].x * 1.5; tw.y = -base.bodies[1].y * 1.5; tw.z = -base.bodies[1].z * 1.5; tw.vx = -tw.vx; tw.vy = -tw.vy; tw.vz = -tw.vz;
    base.bodies.push(tw);
    const rows = [];
    for (const sc of [1, 0.5, 3]) {
      const q = clone(base); for (const k of ['x', 'y', 'z']) q.bodies[1][k] = base.bodies[1][k] * sc;
      const b = build(H, q), S = b.S, n = S.n, { T1, T0 } = evPair(S), s = st(S);
      const fs = [1, 2].map((i) => s.receivers[i].responseFactor);
      rows.push({ scale: sc, r1: r10(Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0])), omegaG1: s.receivers[1].omegaG, omegaG2: s.receivers[2].omegaG, factor1: fs[0], factor2: fs[1],
        m1: S.m[1], m2: S.m[2], twinSame: JSON.stringify(s.receivers[1].omegaG) === JSON.stringify(s.receivers[2].omegaG) && fs[0] === fs[1],
        buildPlusFG: [1, 2].every((i) => T1._rdWX[i] === T0._rdWX[i] + g.wx * fs[i - 1] && T1._rdWY[i] === T0._rdWY[i] + g.wy * fs[i - 1] && T1._rdWZ[i] === T0._rdWZ[i] + g.wz * fs[i - 1]),
        betaSame: same(T1._rdIsqBE, T0._rdIsqBE, n * n) && same(T1._rdUX, T0._rdUX, n) && same(T1._rdUY, T0._rdUY, n) && same(T1._rdUZ, T0._rdUZ, n) });
    }
    out.position = { rows, invariant: rows.every((r) => JSON.stringify(r.omegaG1) === JSON.stringify(rows[0].omegaG1) && JSON.stringify(r.omegaG2) === JSON.stringify(rows[0].omegaG2)),
      twinSame: rows.every((r) => r.twinSame), massExact: rows.every((r) => r.m2 === 2 * r.m1), buildPlusFG: rows.every((r) => r.buildPlusFG), betaSame: rows.every((r) => r.betaSame), twinRatio: 2 }; }
  // ⑤ 2 步(最初の步は u = 0)—— 並進・自転の大きさはビット同一・軸だけが違う
  { const A2 = run(merCopy(HP, { ...g, rdPow: 1, massPow: -1, refMass: MREF }), 2), B2 = run(merCopy(HP), 2), K = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin'];
    out.twoSteps = { xv: fpS(A2, K) === fpS(B2, K), u: same(A2._rdUX, B2._rdUX, 2) && same(A2._rdUY, B2._rdUY, 2) && same(A2._rdUZ, B2._rdUZ, 2), axesDiffer: fpS(A2, ['sax', 'say', 'saz']) !== fpS(B2, ['sax', 'say', 'saz']) }; }
  // ⑥ R_ref の既定(6.5×10⁶ m / 10^L —— refRadius を省略)
  { const b = build(H, merCopy(HP, { ...g, rdPow: 1, massPow: -1, refMass: MREF })), s = st(b.S), Rd = isq(b.S).receivers.map((r) => r.Rd);
    out.refDefault = { refRadius: s.rd.refRadius, expect: RrDef, ok: s.rd.refRadius === RrDef && s.rd.refRadiusDeclared === false && s.receivers.every((r, i) => r.responseFactor === rdmFactor(Rd[i], RrDef, b.S.m[i], MREF)) }; }
  // ⑦ 下限で持ち上げた天体: 宣言の質量 1e-8 < 下限 1e-6 → 受理が 1e-6 へ持ち上げる(警告)—— 係数の m_i はエンジンの質量(持ち上げた値)
  { const q = merCopy(HP, { ...g, rdPow: 1, massPow: -1, refMass: MREF }), lt = clone(q.bodies[1]);
    lt.m = 1e-8; lt.x = -q.bodies[1].x * 2; lt.y = -q.bodies[1].y * 2; lt.z = -q.bodies[1].z * 2; lt.dragCore = { massFrac: 1, radius: 0.0078125 }; q.bodies.push(lt);
    const b = build(H, q), S = b.S, s = st(S), i = 2, r = s.receivers[i];
    out.liftedMass = { declared: 1e-8, engine: S.m[i], readMass: r.mass, warned: b.warnings.some((w) => /bodies\[2\]\.m を値域に修正/.test(w)),
      factorIsEngineMass: r.responseFactor === rdmFactor(0.0078125, RrDef, S.m[i], MREF), notDeclared: r.responseFactor !== rdmFactor(0.0078125, RrDef, 1e-8, MREF) };
    out.liftedMass.ok = out.liftedMass.warned && out.liftedMass.readMass === S.m[i] && S.m[i] === Math.fround(1e-6) && out.liftedMass.factorIsEngineMass && out.liftedMass.notDeclared; }
  out.allPass = out.rdOnly.shape312 && out.rdOnly.omegaPlusFG && out.fixedState.A && out.fixedState.U && out.fixedState.beta && out.fixedState.rot && out.fixedState.deg && out.fixedState.omegaPlusFG && out.fixedState.versionSame
    && out.isolated.every((r) => r.exact && r.nearExpect && r.betaSum === 0) && out.position.invariant && out.position.twinSame && out.position.massExact && out.position.buildPlusFG && out.position.betaSame
    && Object.values(out.twoSteps).every(Boolean) && out.refDefault.ok && out.liftedMass.ok;
  return out;
}

/* ───────── 段 N(K1 の核の自然な応答 —— 規則の値の R_d)───────── */
/** 二体の写し(源 = 太陽 —— R_d = κ₀M☉・受け手 = 水星の写し —— R_d = κ₀m × rd・質量 m × mf)。ctrl: R_d と質量を同じ倍率(R_d/m は同じ)。位置は build の後に置く */
function nCopy(HP, o) {
  const q = merCopy(HP, undefined, 'k1'), kb = kappaBook(q), s = q.bodies[0], p = q.bodies[1], c = o.ctrl || 1;
  delete q.physics.relativeDrag.dragCoreDefault;
  q.physics.relativeDrag.invSq.order = o.order;
  q.physics.radiusFloor = 0.001;
  Object.assign(s, { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  Object.assign(p, { x: 100, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  s.dragCore = { massFrac: 1, radius: kb * Math.fround(s.m) };
  const m0 = Math.fround(p.m * c);   // 受け手の基準の質量(エンジンの質量 —— Float32)
  p.m = m0 * o.mf;
  p.dragCore = { massFrac: 1, radius: kb * m0 * o.rd };
  return q;
}
function nOmega(H, q, rBook, origin) {
  const v = H.HP.validatePreset(clone(q));
  if (!v.ok) return { err: String((v.errors || [])[0] || '').slice(0, 200) };
  const S = H.HP.coord3d.makeSim(); S.build(clone(v.preset));
  // 状態の位置を直に置く(読み口だけ —— 步を進めない・本の値域 ±5000 の外まで): src = 源の中心が原点・recv = 受け手の中心が原点・far = 両方を N_FAR × r ずらす
  const x0 = origin === 'recv' ? -rBook : (origin === 'far' ? N_FAR * rBook : 0);
  S.x[0] = x0; S.x[1] = x0 + rBook; S.y[0] = S.y[1] = 0; S.z[0] = S.z[1] = 0;
  const s = E(H, 'inertialDragIsqState')(S), rc = s.receivers.find((x) => x.i === 1), w = rc.omega;
  return { w: norm(w), vec: w, Rd: rc.Rd, md: rc.md, mSrc: S.m[0], RdSrc: s.receivers.find((x) => x.i === 0).Rd, betaSum: rc.betaSum, nodes: s.nodes, law: s.law };
}
const pw = (a, b, ratio) => (a > 0 && b > 0) ? Math.log(b / a) / Math.log(ratio) : null;
export function partN(H) {
  const HP = H.HP, q0 = findP(HP, MER), L = Math.pow(10, q0.scaleExp.L), rMer = A_MER_AU * AU_M / L, rows = [];
  const cases = [];
  for (const d of N_DIST) {
    for (const order of N_ORDERS) for (const origin of ['src', 'recv']) cases.push({ d, order, origin, ctrl: 1 });
    cases.push({ d, order: 8, origin: 'far', ctrl: 1 });
    for (const order of N_ORDERS) cases.push({ d, order, origin: 'recv', ctrl: N_CTRL });
  }
  for (const c of cases) {
    const r = rMer * c.d, g = (o) => nOmega(H, nCopy(HP, { order: c.order, ctrl: c.ctrl, rd: 1, mf: 1, ...o }), r, c.origin);
    const b = g({}), rd = N_RD.map((k) => g({ rd: k })), mm = N_M.map((k) => g({ mf: k }));
    if (b.err) { rows.push({ ...c, err: b.err }); continue; }
    const b2 = nOmega(H, nCopy(HP, { order: c.order, ctrl: c.ctrl, rd: 1, mf: 1 }), 2 * r, c.origin);
    const dirs = rd.concat(mm, [b2]).map((x) => ang(x.vec, b.vec));
    rows.push({ dAU: r10(A_MER_AU * c.d), order: c.order, origin: c.origin, ctrl: c.ctrl, rM: r10(r * L), RdM: r10(b.Rd * L), m: r10(b.md), RdSrcM: r10(b.RdSrc * L), nodes: b.nodes,
      omega: b.w, betaSum: r10(b.betaSum), xi: r10((b.mSrc / r) / (b.md / b.Rd)),
      pRdLo: pw(rd[0].w, rd[1].w, 2), pRdHi: pw(rd[1].w, rd[2].w, 2), pmLo: pw(mm[0].w, mm[1].w, 10), pmHi: pw(mm[1].w, mm[2].w, 10), pr: pw(b.w, b2.w, 2),
      roundScale: r10(EPS * (c.origin === 'far' ? (N_FAR + 1) : 1) * r / b.Rd), dirMaxRad: r10(Math.max(...dirs)), omegaR3PerRdm: (b.w * r * r * r) / (b.Rd / b.md) });
  }
  for (const r of rows) {
    if (r.err) continue;
    const dev = [Math.abs(r.pRdLo - 1), Math.abs(r.pRdHi - 1), Math.abs(r.pmLo + 1), Math.abs(r.pmHi + 1), Math.abs(r.pr + 3)];
    r.devMax = Math.max(...dev);
    const ctl = rows.find((x) => x.dAU === r.dAU && x.ctrl === N_CTRL && x.order === r.order && !x.err) || rows.find((x) => x.dAU === r.dAU && x.ctrl === N_CTRL && !x.err);
    r.vsCtrl = ctl ? r.omega / ctl.omega - 1 : null;   // 同じ R_d/m の対照(丸めの小さい写し)との ω の比 − 1
  }
  const ok = rows.filter((r) => !r.err), mm1 = ok.filter((r) => r.ctrl === 1 && r.origin !== 'far'), ctl = ok.filter((r) => r.ctrl === N_CTRL);
  const srcRecvSame = N_DIST.every((d) => N_ORDERS.every((o) => { const a = ok.find((r) => r.dAU === r10(A_MER_AU * d) && r.order === o && r.origin === 'src' && r.ctrl === 1), b = ok.find((r) => r.dAU === r10(A_MER_AU * d) && r.order === o && r.origin === 'recv' && r.ctrl === 1);
    return a && b && a.omega === b.omega && a.pRdLo === b.pRdLo && a.pRdHi === b.pRdHi && a.pmLo === b.pmLo && a.pmHi === b.pmHi && a.pr === b.pr; }));
  const k1 = q0.physics, kb = kappaBook(q0);
  for (const r of rows) for (const k of ['omega', 'pRdLo', 'pRdHi', 'pmLo', 'pmHi', 'pr', 'devMax', 'vsCtrl', 'omegaR3PerRdm']) if (typeof r[k] === 'number') r[k] = r10(r[k]);
  const ctlR3 = ctl.map((r) => r.omegaR3PerRdm), ctlSpread = ctlR3.length ? (Math.max(...ctlR3) - Math.min(...ctlR3)) / Math.max(...ctlR3) : null;
  return { kernel: 'k1', recv: { id: MER, body: '水星の写し', RdRule: 'κ₀m', mBook: r10(Math.fround(q0.bodies[1].m)), RdM: r10(kb * Math.fround(q0.bodies[1].m) * L) },
    src: { body: '太陽', RdRule: 'κ₀M☉', RdM: r10(kb * Math.fround(q0.bodies[0].m) * L) }, kappaBook: r10(kb), kappaSI: r10(kappaSI(q0)), G: k1.G, cLight: k1.cLight, C1: r10(C1),
    distAU: N_DIST.map((d) => r10(A_MER_AU * d)), orders: N_ORDERS, ctrl: N_CTRL, far: N_FAR, rows,
    summary: { mmDevMax: r10(Math.max(...mm1.map((r) => r.devMax))), mmDevOverRound: r10(Math.max(...mm1.map((r) => r.devMax / r.roundScale))), ctrlDevMax: r10(Math.max(...ctl.map((r) => r.devMax))),
      srcRecvSame, ctrlOmegaR3Spread: r10(ctlSpread), vsCtrlMax: r10(Math.max(...mm1.map((r) => Math.abs(r.vsCtrl)))), vsCtrlOverRoundMax: r10(Math.max(...mm1.map((r) => Math.abs(r.vsCtrl) / r.roundScale))) },
    estimate: { pRd: 1, pm: -1, pr: -3, why: '一様の極限(源の場 ≪ 受け手の自己の場・受け手の上で源の M1 の場がほぼ一様な勾配)の見積り: W ≈ 受け手の自己の場 m_d,i K1(t R_d,i; R_d,i) ∝ m_d,i/R_d,i。amp = −n̂·∇(m_d,j M1_j/W) の第 1 項 m_d,j M1′/W ∝ R_d,i/m_d,i・第 2 項 m_d,j M1 (n̂·∇W)/W² ∝ (m_d,i/R_d,i²)/(m_d,i/R_d,i)² × (受け手の上の M1 の変化 ∝ R_d,i/r) = R_d,i/m_d,i —— どちらも R_d,i/m_d,i・M1′ ∝ r⁻³',
      round: '第 2 項は受け手の上の源の距離の変化 R_d/r(水星の写し 0.387 au で 5×10⁻¹⁴)を倍精度の距離で表す —— 丸めの尺度 ε r/R_d(ε = 2⁻⁵²・遠い原点は座標の大きさ (N_FAR + 1) r で)' } };
}

/* ───────── 段 X(軸の角の試験)───────── */
function orbitNormals(S) {
  const n = S.n, R = (i) => [S.x[i], S.y[i], S.z[i]], V = (i) => [S.vx[i], S.vy[i], S.vz[i]], out = [];
  let L = [0, 0, 0];
  for (let i = 0; i < n; i++) { const l = scale(cross(R(i), V(i)), S.m[i]); L = [L[0] + l[0], L[1] + l[1], L[2] + l[2]]; }
  out.push(scale(L, 1 / norm(L)));
  for (let i = 1; i < n; i++) { const c = cross(sub(R(i), R(0)), sub(V(i), V(0))); out.push(scale(c, 1 / norm(c))); }
  return out;
}
const axesOf = (S) => [...Array(S.n).keys()].map((i) => [S.sax[i], S.say[i], S.saz[i]]);
/** 太陽系の写し(第311便b)を K1 + 全天体 R_d = κ₀m(写しの明示の dragCore —— m はエンジンの質量)に。off: 規則から外す天体(R_d = 2κ₀m) */
export function solarK1(HP, drag, off = null) {
  const q = G311.solarCopy(HP, drag), kb = kappaBook(q);
  delete q.physics.relativeDrag.dragCoreDefault;
  q.physics.relativeDrag.invSq.kernel = 'k1';
  q.bodies.forEach((b, i) => { b.dragCore = { massFrac: 1, radius: kb * Math.fround(b.m) * (i === off ? 2 : 1) }; });
  return q;
}
function runSolar(H, o, geo) {
  const HP = H.HP, base = solarK1(HP), Tm = Math.pow(10, base.scaleExp.T), kb = kappaBook(base), mS = Math.fround(base.bodies[0].m), Om = geo.OmRefSI * Tm, gv = scale(geo.omHat, (o.f || 0) * Om);
  const drag = clone(G311.INVSQ);
  if (o.initSpin) drag.spinDrag.initSpin = 'observed';
  if (o.mode === 'rule') drag.galaxyAxial = { wx: gv[0], wy: gv[1], wz: gv[2], rdPow: 1, refRadius: kb * mS, massPow: -1, refMass: mS };
  else if (o.mode === 'rdOnly') drag.galaxyAxial = { wx: gv[0], wy: gv[1], wz: gv[2], rdPow: 1, refRadius: kb * mS };
  else if (o.mode === 'q0') drag.galaxyAxial = { wx: gv[0], wy: gv[1], wz: gv[2] };
  const b = build(H, solarK1(HP, drag, o.off === undefined ? null : o.off)), S = b.S, n = S.n;
  const s0 = o.mode ? E(H, 'inertialDragGalaxyAxialState')(S) : null, sq = E(H, 'inertialDragIsqState')(S), Rd = sq.receivers.map((r) => r.Rd);
  const a0 = axesOf(S), n0 = orbitNormals(S);
  if (o.initSpin) return { io: E(H, 'inertialDragInitObsState')(S), factors: s0 ? s0.receivers.map((r) => (r.responseFactor !== undefined ? r.responseFactor : 1)) : null };   // 観測の初期自転の分解だけ(步を進めない)
  for (let k = 0; k < o.steps; k++) S.step(b.dt);
  const fac = s0 ? s0.receivers.map((r) => (r.responseFactor !== undefined ? r.responseFactor : (r.rdFactor !== undefined ? r.rdFactor : 1))) : null;
  return { mode: o.mode || null, off: o.off === undefined ? null : o.off, f: o.f || 0, steps: o.steps, T: (o.steps - 1) * b.dt, g: gv, Rd, m: Array.from(S.m.subarray(0, n)), factors: fac,
    omegaG: s0 ? s0.receivers.map((r) => r.omegaG) : null, a0, n0, aT: axesOf(S), nT: orbitNormals(S), fp: fpS(S), law: sq.law,
    finite: XV.every((k) => Array.from(S[k].subarray(0, n)).every(Number.isFinite)), badRows: S.inertialDragIsqBadRow || 0, betaMax: sq.receivers.reduce((a, r) => Math.max(a, r.betaSum), 0) };
}
export function partX(H, quick) {
  const geo = G311.geometry(), HP = H.HP, base = solarK1(HP), b0 = build(H, base), dt = b0.dt, pRef = base.timeRef.pRef;
  const steps = Math.round((quick ? G311.N_ORB_QUICK : G311.N_ORB) * pRef / dt), Tm = Math.pow(10, base.scaleExp.T), OmBook = geo.OmRefSI * Tm, n = b0.S.n, L = Math.pow(10, base.scaleExp.L), Mu = Math.pow(10, base.scaleExp.M);
  const ref = runSolar(H, { steps }, geo), refOff = runSolar(H, { steps, off: X_OFF }, geo);
  const plan = [];
  for (const f of F_GRID) plan.push({ mode: 'rule', f }, { mode: 'rule', off: X_OFF, f });
  plan.push({ mode: 'q0', f: 1 }, { mode: 'rdOnly', f: 1 });
  const runs = plan.map((p) => runSolar(H, { ...p, steps }, geo));
  const rule1 = runs.find((r) => r.mode === 'rule' && r.off === null && r.f === 1), off1 = runs.find((r) => r.mode === 'rule' && r.off === X_OFF && r.f === 1), rdo = runs.find((r) => r.mode === 'rdOnly');
  const bodies = G311.LABELS.map((label, i) => ({ i, label, RdM: r10(ref.Rd[i] * L), mKg: r10(ref.m[i] * Mu), RdPerM: r10((ref.Rd[i] * L) / (ref.m[i] * Mu)),
    fRule: r10(rule1.factors[i]), fOff: r10(off1.factors[i]), fRdOnly: r10(rdo.factors[i]) }));
  const rows = runs.map((r) => {
    const rf = r.off === null ? ref : refOff, per = [], pairs = [];
    for (let i = 0; i < n; i++) {
      const th = ang(r.aT[i], rf.aT[i]), wG = r.omegaG[i], pred = norm(cross(wG, r.a0[i])) * r.T;
      const thN = ang(r.aT[i], r.nT[i]) - ang(rf.aT[i], rf.nT[i]);
      per.push({ i, factor: r10(r.factors[i]), vsNoGalaxy: r10(th), firstOrder: r10(pred), ratio: r10(pred > 10 * FLOOR_ANG ? th / pred : null), orbitNormalVsNoGalaxy: r10(thN) });   // 比は見積りが床の 10 倍より大きい天体だけ(rdPow 1 だけの写しの水星の係数は 10⁻⁷ の程度)
    }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = (ang(r.aT[i], r.aT[j]) - ang(r.a0[i], r.a0[j])) - (ang(rf.aT[i], rf.aT[j]) - ang(rf.a0[i], rf.a0[j]));
      const psi = ang(r.a0[i], r.a0[j]), dw = sub(r.omegaG[i], r.omegaG[j]), est = -dot(dw, cross(r.a0[i], r.a0[j])) * r.T / Math.sin(psi);
      pairs.push({ i, j, sameFactor: r.factors[i] === r.factors[j], dfactor: r10(r.factors[i] - r.factors[j]), withOff: r.off !== null && (i === r.off || j === r.off), change: r10(d), firstOrder: r10(est), ratio: r10(Math.abs(est) > 10 * FLOOR_ANG ? d / est : null) });
    }
    const fs = r.factors, spread = (Math.max(...fs) - Math.min(...fs)) / Math.max(...fs), th = per.map((p) => p.vsNoGalaxy);
    const wOff = pairs.filter((p) => p.withOff), nOff = pairs.filter((p) => !p.withOff), est = pairs.filter((p) => p.ratio !== null);
    return { mode: r.mode, off: r.off, f: r.f, omegaG: r10(r.f * OmBook), finite: r.finite, badRows: r.badRows, betaMax: r10(r.betaMax), law: r.law, factorSpread: r10(spread), per, pairs,
      axisMax: r10(Math.max(...th)), ratioMin: r10(Math.min(...per.filter((p) => p.ratio !== null).map((p) => p.ratio))), ratioMax: r10(Math.max(...per.filter((p) => p.ratio !== null).map((p) => p.ratio))), nRatio: per.filter((p) => p.ratio !== null).length,
      orbitNormalMax: r10(Math.max(...per.map((p) => Math.abs(p.orbitNormalVsNoGalaxy)))), allPairMax: r10(Math.max(...pairs.map((p) => Math.abs(p.change)))),
      offPairMax: wOff.length ? r10(Math.max(...wOff.map((p) => Math.abs(p.change)))) : null, nonOffPairMax: r10(Math.max(...nOff.map((p) => Math.abs(p.change)))),
      estRatioMin: est.length ? r10(Math.min(...est.map((p) => p.ratio))) : null, estRatioMax: est.length ? r10(Math.max(...est.map((p) => p.ratio))) : null, nEst: est.length };
  });
  // q = 0(共通の ω_G)と規則の上の massPow(係数 = 1 —— 丸めの差だけ)の軸の向きの差
  const q0 = runs.find((r) => r.mode === 'q0'), ruleVsQ0 = Math.max(...q0.aT.map((a, i) => ang(a, rule1.aT[i])));
  // 観測の初期自転の分解(initSpin —— 同じ build を通るので ω_D に f_i ω_G が入る): 銀河なしとの慣性の軸の角と一次の見積り f_i |ω_G × â_obs|/|s_obs|(f = 1)
  const iN = runSolar(H, { initSpin: true }, geo), iR = runSolar(H, { initSpin: true, mode: 'rule', f: 1 }, geo), iQ = runSolar(H, { initSpin: true, mode: 'q0', f: 1 }, geo);
  const iNo = runSolar(H, { initSpin: true, off: X_OFF }, geo), iO = runSolar(H, { initSpin: true, mode: 'rule', off: X_OFF, f: 1 }, geo);
  const init = { ok: [iN.io.ok, iR.io.ok, iQ.io.ok, iNo.io.ok, iO.io.ok], rows: [] };
  if (init.ok.every(Boolean)) for (let i = 0; i < n; i++) {
    const r0 = iN.io.spin.rows[i], est1 = OmBook * norm(cross(geo.omHat, r0.axisObs)) / Math.abs(r0.sObs);
    const dR = ang(iR.io.spin.rows[i].axisI, r0.axisI), dQ = ang(iR.io.spin.rows[i].axisI, iQ.io.spin.rows[i].axisI), dO = ang(iO.io.spin.rows[i].axisI, iNo.io.spin.rows[i].axisI);
    const fR = iR.factors[i], fO = iO.factors[i];
    init.rows.push({ i, label: G311.LABELS[i], ruleVsNone: r10(dR), ruleFirstOrder: r10(fR * est1), ruleRatio: r10(est1 > 10 * FLOOR_ANG ? dR / (fR * est1) : null), ruleVsQ0: r10(dQ),
      offVsNone: r10(dO), offFactor: r10(fO), offRatio: r10(est1 > 10 * FLOOR_ANG ? dO / (fO * est1) : null) });
  }
  return { kernel: 'k1', geometry: { omHat: geo.omHat, OmRefSI: geo.OmRefSI, omHatDotNgp: geo.omHatDotNgp }, OmRefBook: r10(OmBook), steps, dt, Teff: r10((steps - 1) * dt),
    orbitsMercury: quick ? G311.N_ORB_QUICK : G311.N_ORB, kappaBook: r10(kappaBook(base)), refRadiusM: r10(kappaBook(base) * Math.fround(base.bodies[0].m) * L), refMassKg: r10(Math.fround(base.bodies[0].m) * Mu),
    offBody: X_OFF, bodies, rows, ruleVsQ0AxisMax: r10(ruleVsQ0), initSpin: init, refFinite: ref.finite && refOff.finite,
    firstStepNote: '最初の步は履歴が無く u = 0・軸の ω を使わない(今の経路 —— 一次の見積りの時間は (步数 − 1) h)',
    note: '大きさは未定(AN395)・銀河の模型からの数ではない —— abs(ω_G) = f Ω_ref の格子(Ω_ref = V₀/R₀ は尺度だけ)。基準の組 (R_ref, m_ref) = (κ₀M☉, M☉) は規則の上の基準(係数は全天体 κ₀m で 1)' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const g = {};
  if (J.A) g.acceptance = J.A.allPass === true;
  if (J.B) {
    g.confirm = J.B.allPass === true;
    g.rd2Ratio2 = J.B.isolatedRatios.rd2 === 2;
    g.mass10Ratio01 = Math.abs(J.B.isolatedRatios.m10 - 0.1) <= 4 * EPS * 0.1;
  }
  if (J.N) {
    const S = J.N.summary, ok = J.N.rows.filter((r) => !r.err);
    g.naturalAllFinite = ok.length === J.N.rows.length && ok.every((r) => Number.isFinite(r.omega) && r.omega > 0);
    g.naturalCtrlLimit = S.ctrlDevMax < 1e-5;   // 同じ R_d/m の対照: R_d¹·m⁻¹·r⁻³(有限の ξ の分だけ外れる)
    g.naturalMmWithinRound = S.mmDevOverRound < 1;   // 規則の値の R_d: 次数の外れは丸めの尺度 ε r/R_d より小さい
    g.naturalOriginNearSame = S.srcRecvSame === true;   // 近い原点(源の中心・受け手の中心)は同じ値
    g.naturalCtrlOmegaR3 = S.ctrlOmegaR3Spread < 1e-5;   // ω r³ m/R_d は対照の距離と次数で同じ
    g.naturalMmVsCtrlWithinRound = S.vsCtrlOverRoundMax < 1;
  }
  if (J.X) {
    const X = J.X, rule = X.rows.filter((r) => r.mode === 'rule' && r.off === null), off = X.rows.filter((r) => r.mode === 'rule' && r.off !== null), rdo = X.rows.find((r) => r.mode === 'rdOnly'), q0 = X.rows.find((r) => r.mode === 'q0');
    g.allFinite = X.refFinite && X.rows.every((r) => r.finite && r.badRows === 0);
    g.ruleFactorCommon = rule.every((r) => r.factorSpread < 1e-15) && X.bodies.every((b) => Math.abs(b.fRule - 1) < 1e-12);
    g.ruleAllPairsUnchanged = rule.every((r) => r.allPairMax < FLOOR_ANG);
    g.linearResponse = X.rows.every((r) => Math.abs(r.ratioMin - 1) < 1e-3 && Math.abs(r.ratioMax - 1) < 1e-3);
    g.offPairsFirstOrder = off.every((r) => r.nEst > 0 && Math.abs(r.estRatioMin - 1) < 1e-2 && Math.abs(r.estRatioMax - 1) < 1e-2 && r.pairs.filter((p) => p.ratio !== null).every((p) => p.withOff));
    g.offOtherPairsUnchanged = off.every((r) => r.nonOffPairMax < FLOOR_ANG);
    g.offFactor2 = X.bodies.every((b, i) => Math.abs(b.fOff - (i === X.offBody ? 2 : 1)) < 1e-12);
    g.q0AllPairsUnchanged = q0.allPairMax < FLOOR_ANG;
    g.rdOnlyNotCommon = rdo.factorSpread > 0.5;
    const IR = X.initSpin.rows.filter((r) => r.ruleRatio !== null), IO = X.initSpin.rows.filter((r) => r.offRatio !== null);
    g.initSpinFirstOrder = X.initSpin.ok.every(Boolean) && IR.length > 0 && IR.every((r) => Math.abs(r.ruleRatio - 1) < 1e-3) && IO.every((r) => Math.abs(r.offRatio - 1) < 1e-3)
      && X.initSpin.rows.every((r) => r.ruleVsQ0 < FLOOR_ANG) && X.initSpin.rows[X.offBody].offFactor === 2;
  }
  return g;
}

/* ───────── 文書の表と数(PHYSICS〔第313便b〕—— QA docs.galaxialRdm313 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const e3s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(3);
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
const f6 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(6);
const fl = (v, floor) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : fmtFloor(v, floor, 3));
const ORIGIN_JA = { src: '源の中心', recv: '受け手の中心', far: '遠い原点(10 r ずらす)' };
const MODE_JA = (r) => r.mode === 'rule' ? (r.off === null ? '全天体 κ₀m・massPow −1' : '地球だけ 2κ₀m・massPow −1') : (r.mode === 'q0' ? 'q = 0(共通の ω_G)' : 'rdPow 1 だけ(質量なし)');
export function physicsTables(J) {
  const out = [], B = J.B;
  out.push('| 照合 | 値 |', '|---|---|');
  out.push(`| 受理の表(massPow・refMass・K1 と rdPow 1 の条件・未知の鍵・物理の単位・旧則の本) | ${J.A.nPass}/${J.A.nCases} |`);
  out.push(`| rdPow だけの宣言(K1)の読み口は第312便b の形・軸の ω = 銀河なし + ω_G (R_d/R_ref) | ${B.rdOnly.shape312 && B.rdOnly.omegaPlusFG ? 'ビット同一' : '違う'} |`);
  out.push(`| 同じ状態の build の β・並進の右辺・回転の係数(massPow −1 —— 銀河の有無) | ${B.fixedState.A && B.fixedState.U && B.fixedState.beta && B.fixedState.rot && B.fixedState.deg ? 'ビット同一' : '違う'} |`);
  out.push(`| 軸の ω = 銀河なし + ω_G (R_d,i/R_ref)(m_ref/m_i)(器が同じ式で作った係数) | ${B.fixedState.omegaPlusFG ? 'ビット同一' : '違う'} |`);
  out.push(`| 孤立の受け手の ω/ω_G(R_d = R_ref × 1/2・1・2 —— m = m_ref・10 m_ref) | ${B.isolated.every((r) => r.exact) ? B.isolated.map((r) => r10(r.ratio)).join('・') : '違う'} |`);
  out.push(`| R_d 2 倍の比・質量 10 倍の比 | ${B.isolatedRatios.rd2}・${r10(B.isolatedRatios.m10)} |`);
  out.push(`| 位置の不変(受け手を 3 か所へ)・R_d と質量を ${B.position.twinRatio} 倍にした双子の銀河の分 | ${B.position.invariant ? 'ビット同一' : '違う'}・${B.position.twinSame ? 'ビット同一' : '違う'} |`);
  out.push(`| 2 步の並進・自転の大きさ(massPow −1 と銀河なし) | ${B.twoSteps.xv && B.twoSteps.u ? 'ビット同一' : '違う'} |`);
  out.push(`| R_ref の既定(6.5×10⁶ m / 10^L)[本の長さ] | ${B.refDefault.refRadius} |`);
  out.push(`| 下限で持ち上げた天体の質量(宣言 1e-8 → エンジン)・係数の m_i | ${r10(B.liftedMass.engine)}・${B.liftedMass.factorIsEngineMass ? 'エンジンの質量' : '違う'} |`);
  if (J.N) {
    out.push('', '| 距離 [au] | 受け手の R_d [m] | 求積の次数 | 原点 | 受け手の Σβ | 軸の ω [1/本の時間] | R_d の次数(1/2→1・1→2) | 質量の次数(1/10→1・1→10) | 距離の次数 | 丸めの尺度 ε r/R_d | 対照との ω の比 − 1 |', '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const r of J.N.rows) if (!r.err) out.push(`| ${r.dAU} | ${r.ctrl === 1 ? e3s(r.RdM) : e3s(r.RdM) + '(対照)'} | ${r.order} | ${ORIGIN_JA[r.origin]} | ${e2s(r.betaSum)} | ${e3s(r.omega)} | ${f6(r.pRdLo)}・${f6(r.pRdHi)} | ${f6(r.pmLo)}・${f6(r.pmHi)} | ${f6(r.pr)} | ${e2s(r.roundScale)} | ${r.ctrl === 1 ? e2s(r.vsCtrl) : '—'} |`);
  }
  if (J.X) {
    const X = J.X;
    out.push('', '| 天体 | 引きずりの半径 R_d [m] | R_d/m [m/kg] | 係数(全天体 κ₀m) | 係数(地球だけ 2κ₀m) | 係数(rdPow 1 だけ) |', '|---|---|---|---|---|---|');
    for (const b of X.bodies) out.push(`| ${b.label} | ${e3s(b.RdM)} | ${e3s(b.RdPerM)} | ${f3(b.fRule)} | ${f3(b.fOff)} | ${e2s(b.fRdOnly)} |`);
    out.push('', '| 天体 | 初期自転の分解の慣性の軸(全天体 κ₀m —— 銀河なしとの角)[rad] | 一次の見積りとの比 | q = 0 との角 [rad] | 地球だけ 2κ₀m の写しの角 [rad] | その一次の見積りとの比 |', '|---|---|---|---|---|---|');
    for (const r of X.initSpin.rows) out.push(`| ${r.label} | ${e2s(r.ruleVsNone)} | ${r.ruleRatio === null ? '—' : f3(r.ruleRatio)} | ${fl(r.ruleVsQ0, FLOOR_ANG)} | ${e2s(r.offVsNone)} | ${r.offRatio === null ? '—' : f3(r.offRatio)} |`);
    out.push('', '| 写し | f | 係数の広がり | 軸の角(銀河なしとの)の最大 [rad] | 一次の見積りとの比の範囲 | 軌道法線との角の変化の最大 [rad] | 天体どうしの軸の角の変化の最大 [rad] | 地球を含む対の変化の最大 [rad] | 地球を含まない対の変化の最大 [rad] | 対の一次の見積りとの比の範囲 |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const r of X.rows) out.push(`| ${MODE_JA(r)} | ${r.f} | ${fl(r.factorSpread, 1e-15)} | ${e2s(r.axisMax)} | ${f3(r.ratioMin)}〜${f3(r.ratioMax)} | ${e2s(r.orbitNormalMax)} | ${fl(r.allPairMax, FLOOR_ANG)} | ${r.offPairMax === null ? '—' : fl(r.offPairMax, FLOOR_ANG)} | ${fl(r.nonOffPairMax, FLOOR_ANG)} | ${r.estRatioMin === null ? '—' : f3(r.estRatioMin) + '〜' + f3(r.estRatioMax)} |`);
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const out = [];
  if (J.X) out.push(String(J.X.steps), fl(J.X.ruleVsQ0AxisMax, FLOOR_ANG));
  if (J.N) out.push(e2s(J.N.summary.mmDevMax), e2s(J.N.summary.ctrlDevMax), e2s(J.N.summary.vsCtrlMax), (J.N.recv.RdM * 1e3).toFixed(4), Number(J.N.kappaSI).toExponential(8));
  return out.filter((s) => s !== '');
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, stages = o.stages || ['A', 'B', 'N', 'X'], t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { quick, stages };
  if (stages.includes('A')) { J.A = partA(H); tick('A'); }
  if (stages.includes('B')) { J.B = partB(H); tick('B'); }
  if (stages.includes('N')) { J.N = partN(H); tick('N'); }
  if (stages.includes('X')) { J.X = partX(H, quick); tick('X'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 鍵と読み口を読む既存の器・QA(第313便b の枝で列挙して走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w312b-galaxialrd.mjs・正本 galaxialrd-w312b.json', reads: 'galaxyAxial の受理(未知の鍵 massPow の行)・build・読み口 inertialDragGalaxyAxialState', handling: '受理の行を世代切替(massPow を受理する html では「K1・rdPow 1 と一緒にだけ」の拒否)—— 値は変わらない(試走で正本と照合・領域 hash は変わる〔鎖で作り直す〕)' },
  { file: 'tests/exp-w311b-galaxial.mjs・正本 galaxial-w311b.json', reads: 'galaxyAxial の受理・build・読み口', handling: '変わらない(massPow の無い宣言は第312便b とビット同一 —— 試走で正本と照合)' },
  { file: 'tests/qa.mjs behavior.galaxial311・docs.galaxial311・behavior.galaxialRd312・docs.galaxialRd312', reads: 'GALAXY_AXIAL_VERSION・GALAXY_AXIAL_RD_VERSION の世代切替・受理・build', handling: '変わらない(版は据え置き —— 質量の次数は別の版 GALAXY_AXIAL_RDM_VERSION)' },
];

export async function main() {
  const TARGET = process.env.W313B_TARGET || 'beta/index.html';
  const OUT = process.env.W313B_OUT || path.join(ROOT, 'tests', 'out', 'galaxialrdm-w313b.json');
  const quick = process.env.W313B_QUICK === '1', stages = process.env.W313B_STAGES ? process.env.W313B_STAGES.split(',') : undefined;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick, stages });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w313b-galaxialrdm.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第115報)一様軸引きずりの R_d の応答の次数は K1 を主にする q = 1 で質量も入る(決断事項 AN395)・K1 を採用する(AN399)・太陽を含む全天体に同じ規則 R_d = κm(AN402)・統括の検証項目 R235',
    galaxyAxialVersion: E(H, 'GALAXY_AXIAL_VERSION'), galaxyAxialRdVersion: E(H, 'GALAXY_AXIAL_RD_VERSION'), galaxyAxialRdmVersion: E(H, 'GALAXY_AXIAL_RDM_VERSION'),
    massPows: E(H, 'GALAXY_AXIAL_MASS_POWS'), refRadiusDefaultM: E(H, 'GALAXY_AXIAL_REF_RADIUS_M'), invSqKernelVersion: E(H, 'REL_DRAG_INVSQ_KERNEL_VERSION'),
    fGrid: F_GRID, versionReaders: VERSION_READERS, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w313b-galaxialrdm.mjs', 'tests/exp-w311b-galaxial.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w311c-h4carry.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第313便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

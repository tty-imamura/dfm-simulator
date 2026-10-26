// 第312便d(原仮定者の裁定(第114報)「水星、金星、火星で絞り込んだ候補を、木星、『太陽と地球と月』で確認する」・「R_d² が惑星の質量 × 軌道の半直弦に比例すると
// 言う結果は、距離に応じた引きずりの減衰が強すぎる可能性がある」・決断事項 AN398〔軌道に依る R_d を天体の性質として採らない・確認の系は候補から決めた規則で R_d を置き
// 残差を測る・太陽は固定・G_loc の分は各系で・1 つの天体に 1 つの宣言・月は受け手としても源としても〕・AN396・AN336・統括の検証項目 R233):
// **確認の器**(確認の材料 —— 合わせない・探索の値を在位へ入れない・在位の宣言は変えない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState をそのまま呼ぶ)。走行は子プロセス(W312D_WORKERS —— 既定 2)。純関数は tests/lib-w312d-confirm.mjs(規則・p・受理の目安・標的)。
//
// ■ 写し(器の中で組む —— 在位の本の宣言は変えない)
//   🏀 jupiterSunInertial3d: 第306便a の世代の凍結の写し(tests/data-w306a-decl305.json —— 第311便d と同じ作り方 tests/lib-w311d-planet3.mjs の pinnedBook・bookOf)。
//   🌦️ earthMoonSunInertial3d: 三体のまま(太陽 pinned・地球〔J₂〕・月)。physics・bodies・scaleExp・timeRef は基点 c98db78 の在位の宣言の凍結の写し(PIN_EM —— 生きている
//     html と同じかを liveSame に記録)。q00・q10 は在位の宣言の引きずり(無効)のまま・q10 は在位の G_loc の固定の宣言 {law:"kappaC2"}(7 惑星の本と同じ宣言)を足す。
//   引きずりの走行(q01・q11)は新則(第311便d と同じ NEW_DRAG —— outerShell uniform・pairs all・cap6500km・initMotion observed・spinDrag の回転と軸)に置き換え、
//   規則の R_d を dragCore {massFrac: 1, radius: R_d} に(🌦️ は地球と月の両方 —— 月は受け手としても源としても)。太陽は cap6500km(R_d = 6.5×10⁶ m・m_d = M☉)に固定。
//   G_loc の k・n・λ・GM・初期要素は在位のまま(掃引しない)。
//
// ■ 4 つの走行(第311便d の型): q00(G_loc なし・引きずりなし)・q10(G_loc)・q01(引きずり)・q11(両方)。ΔqG = q10 − q00・t_D = q⋆ − ΔqG・
//   残差 r = q11 − q00 − q⋆・交差 I = q11 − q10 − q01 + q00。**G_loc の分は各系で測る**(水星の分を流用しない)。
//   🏀: 窓 8 公転・刻み h = 0.0788(第306便a と同じ)・主の抽出器は新しい抽出器(第304便e)・検出器 B は副。標的は AN336 の 1PN + A1(木星の行)。
//   🌦️: 窓は月の 118 公転(≈ 8.83 年 —— 第303便c の B1 の窓)・刻み h = 0.016(第303便c)。地球の近日点は**地球–月の重心(EMB)**の接触の離心ベクトルの回帰
//     (新しい抽出器と同じ式 —— 最初の 8 公転)・地球自身は副。標的は AN336 に地球の行が無いので**同じ生成器の 1PN の式の値だけ**(「1PN だけの数値の参照」)。
//     月は第303便c の抽出器 emx4(恒星月 sidH〔調和の回帰〕・近地点の周期 T4p・交点の周期 node)で、引きずりの有無の差と在位の観測 OBS_B1 との比較。
//
// ■ 規則(--rule —— 3 惑星の値から決めた比を同じ式で置く。**1 つの天体に 1 つの宣言**・確認の系で k を動かさない)
//   {"type":"rdOverR"|"rdOverM"|"rd2OverMp","k":<比>,"moonP":"earth"|"sun"} か {"type":"explicit","Rd":{"jupiter":m,"earth":m,"moon":m}}。
//   既定は tests/out/planet3-w311d.json の 3 惑星の R_d²/(m p) の平均(今の法則 K2 の数値の根の並び —— 月の p は "earth")。cap と観測半径を超える R_d は拒否と記録(走らせない)。
//
// ■ 段(正本 tests/out/confirm-w312d.json —— 段 confirm-312d)。W312D_PARTS=E,T,C で選ぶ(正本は全段)・W312D_OUT で出力先・W312D_QUICK=1 で縮める
//   E 走行(枝のうちは K2 —— 🏀 の 4 つの走行 × h・h/2・🌦️ の q00・q10 × h・h/2 と q11 × h〔月の p は地球のまわり —— 費用の見積りのための 1 本〕)
//   T 標的と G_loc の分(ΔqG の実測と解析の一次)
//   C 確認の表: 規則の比の表(3 惑星)・規則を確認の系へ当てた R_d と受理の目安・t = 0 の β(月の p の 2 つの選び方)・残差と数値の門・月の診断・所要と 2 段目の費用の見積り
//
// ■ 2 段目(統合の後に統括 —— 出力は tests/out/confirm-w312d-stage2-<系>.json〔W312D_OUT で変える・鎖の正本ではない〕)
//   node tests/exp-w312d-confirm.mjs --system jupiter --kernel k1 --planet3 <K1 の 3 惑星の --merge の出力> --rule '{"type":"rdOverM"}' --divs 1,2 [--h4] [--kinds q00,q10,q01,q11]
//   node tests/exp-w312d-confirm.mjs --system earthmoon --kernel k1 --planet3 <同じ> --rule '{"type":"rdOverM"}' --divs 1,2 [--moon 118]
//   (--rule の k を省けば --planet3 の 3 惑星の平均 —— 規則は 3 惑星の値から決め、確認の系では動かさない。--planet3 の既定は正本 tests/out/planet3-w311d.json)
//   --kernel k1 は枝 a の invSq.kernel(受理しない html では「未接続」と記録して走らせない —— 門 noRejected は偽)。
//
// ■ v2(第313便d —— 原仮定者の裁定(第115報)AN399・AN402・決断事項 AN401・AN405・統括の検証項目 R237)
//   ・`--rule '{"type":"kappa0"}'`(`--kernel k1` だけ): **太陽を含む全天体**に写しの明示の dragCore {massFrac: 1, radius: 10 G m/(C₁ c²)}(本の単位 —— κ₀ は閉じた式で固定・
//     合わせない・枝 a の鍵 rdRule:"kappaM" と同値の写し)。🌦️ の太陽は pinned(受け手でない —— 源としてだけ効く)を記録する。
//   ・受理の目安から cap を外す(lib の admissibleOf —— 0 < R_d ≤ 観測半径だけ)。正本の版が PREV_VERSIONS なら第312便の世代(QA の世代切替が capM で作り直す)。
//   ・既定の計画(鎖の正本 confirm-w312d.json)は v1 と同じ(K2・規則 R_d²/(m p))—— 段 C の規則の表の受理の欄だけが cap を外して変わる(🏀 の R_d/m の行)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「R_d を決めた」。「確認した」は規則で置いた残差が数値の門の内のときだけ
//   (そうでなければ「規則が届かない」と数で)。数値の門は観測の 3σ ではない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as PL3 from './exp-w311d-planet3.mjs';
import * as EMX from './exp-w303c-earthmoon.mjs';
import * as C from './lib-w312d-confirm.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragNormApply","pnSource","relDragCoefficientOf","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w313d-confirm-2';
/** v2: 正本の版の前の世代(鎖で作り直す前の正本 —— QA docs.confirm312 の世代切替が読む)と、その世代の受理の目安の cap(m) */
export const PREV_VERSIONS = Object.freeze(['w312d-confirm-1']);
export const PREV_LIB_VERSIONS = Object.freeze(['w312d-confirm-lib-1']);
export const PREV_CAP_M = 6.5e6;
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', 'R_d を決めた'];
export const PLANET3_OUT = 'tests/out/planet3-w311d.json';
export const AN336_OUT = 'tests/out/an336-w306a.json';
export const OUT_MAIN = 'tests/out/confirm-w312d.json';
export const OUT_STAGE2 = 'tests/out/confirm-w312d-stage2.json';
export const PARTS_ALL = Object.freeze(['E', 'T', 'C']);
/** 基点 c98db78 の 🌦️ earthMoonSunInertial3d の physics・bodies・scaleExp・timeRef(凍結の写し —— 後の便が宣言を変えても正本は値を保つ。生きている html と同じかは liveSame) */
export const PIN_EM_BASE = Object.freeze({ commit: 'c98db78', note: '第312便の基点の 🌦️ earthMoonSunInertial3d の宣言(太陽 pinned・地球の J₂・引きずり無効)' });
export const PIN_EM = Object.freeze({"physics":{"coord":"3d","G":6.674,"D0":0.1,"kFrame":0,"q":3,"kRep":0,"muF":0,"gammaN":0,"kappaS":0,"kappaT":7.425826474101849e-9,"cLight":29979.2458,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"massFloor":0.000001,"geoPN":3,"lambdaPN":0,"pnAlpha":1.5,"radiusScale":1,"softening":0.0005,"softeningFloor":0.0005,"timeScale":1,"stepDt":0.655721,"dispMag":10,"stateCarry":"double","frameWeight":"share","relativeDrag":{"law":"inertial","Wbg":null,"enabled":false,"eps":0.0005,"history":"positions","pairs":[[1,2]]}},"bodies":[{"type":"single","m":1988.5,"radius":6.96,"x":0,"y":0,"z":0,"vx":0,"vy":0,"vz":0,"spin":0.029031,"pinned":true,"pnSource":true},{"type":"single","m":0.0059724,"radius":0.06371,"x":1470.9409086355943,"y":0,"z":0,"vx":0,"vy":3.0273226087555525,"vz":-0.00012354309610317952,"spin":0.729212,"pinned":false,"pnSource":true,"dragCore":{"massFrac":0.325,"radius":0.0348},"j2":{"J2":0.00108263,"req":0.06378137,"axis":{"tiltDeg":23.4392911,"azimuthDeg":90}}},{"type":"single","m":0.00007346,"radius":0.0174,"x":1474.5094929355944,"y":0,"z":0,"vx":0,"vy":3.1371687801910997,"vz":0.010044225254106035,"spin":0.026617,"pinned":false}],"scaleExp":{"L":8,"T":4,"M":27},"timeRef":{"basis":"orbit","pRef":236.059488,"pair":[1,2],"def":"revolution","source":"観測の正本 OBS_COMPARE_ROWS(emAuditSolar の 月 の周期 2360594.88 s ÷ 10^4 s)","stepsPerOrbit":360}});
export const N_JUP = 8, N_JUP_QUICK = 3;            // 🏀 の窓(公転)
export const N_MOON = 118, N_MOON_QUICK = 16;       // 🌦️ の窓(月の公転 —— 第303便c の B1 の窓)
export const N_EARTH = 8, N_EARTH_QUICK = 1;        // 🌦️ の地球(EMB)の近日点の窓(公転 —— 月の 118 公転の内)
export const EM_SAMPLE_EVERY = 8;                   // EMB と地球の接触の離心ベクトルの標本の間隔(步)
export const APSIS_K = PL3.APSIS_K;
/** 枝のうちの走行(正本 —— K2)。2 段目は CLI */
export const BRANCH_PLAN = Object.freeze({
  jupiter: Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q01', 'q11']), divs: Object.freeze([1, 2]) }),
  earthmoon: Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), divs: Object.freeze([1, 2]), dragDivs: Object.freeze([1]) }) });
export const QUICK_PLAN = Object.freeze({
  jupiter: Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), divs: Object.freeze([1]) }),
  earthmoon: Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), divs: Object.freeze([1]), dragDivs: Object.freeze([1]) }) });

/* ───────── 写し ───────── */
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
export function pinnedEM(HP) {
  const p = findPreset(HP, 'earthMoonSunInertial3d'); if (!p) throw new Error('🌦️ が無い');
  const q = clone(p); delete q.fitRecord; delete q.abBody;
  q.physics = clone(PIN_EM.physics); q.bodies = clone(PIN_EM.bodies); q.scaleExp = clone(PIN_EM.scaleExp); q.timeRef = clone(PIN_EM.timeRef);
  return q;
}
export const baseOf = (HP, sys) => (sys === 'jupiter' ? Q.pinnedBook(HP, PL3.PIN, 'jupiterSunInertial3d') : pinnedEM(HP));
/** 走行の本。spec = {system, kind, Rd:{jupiter|earth|moon: m}, kernel}。v2: Rd.rule === "kappa0" は全天体の規則(太陽も —— 本の単位の 10 G m/(C₁ c²)) */
export function bookOf(base, sys, kind, Rd, kernel) {
  const k = Q.KINDS[kind]; if (!k) throw new Error('走行の種類 ' + kind);
  const kap = !!(Rd && Rd.rule === 'kappa0');
  if (kap && k.drag && kernel !== 'k1') throw new Error('全天体の規則 kappa0 は K1 の写しだけ(--kernel k1)');
  if (sys === 'jupiter') {
    if (kap && k.drag) return Q.bookOf(base, kind, Q.withKernel({ rd: Q.rdOfKf(base, 1), rule: 'kappa0', kf: 1 }, kernel));   // 太陽と木星に κ₀m(lib の bookOf)
    const R = base.bodies[1].radius * Math.pow(10, base.scaleExp.L);
    return Q.bookOf(base, kind, k.drag ? Q.withKernel({ rd: Rd.jupiter / R }, kernel) : Q.THETA0);
  }
  const q = clone(base);
  if (k.gLoc) q.physics.gLoc = clone(Q.GLOC_FIXED); else delete q.physics.gLoc;
  if (!k.drag) return q;   // 在位の宣言の引きずり(無効)のまま
  q.physics.relativeDrag = clone(Q.NEW_DRAG);
  if (kernel === 'k1') q.physics.relativeDrag.invSq.kernel = 'k1';
  const L = Math.pow(10, q.scaleExp.L);
  if (kap) {   // v2: 全天体の規則 —— 太陽(pinned —— 源としてだけ)・地球・月に κ₀m(本の単位)
    for (const i of [0, 1, 2]) q.bodies[i].dragCore = { massFrac: 1, radius: Q.rdBookKappa0(q, q.bodies[i].m) };
    return q;
  }
  q.bodies[1].dragCore = { massFrac: 1, radius: Rd.earth / L };   // 1 つの天体に 1 つの宣言(規則の R_d —— 在位の構造核の宣言は写しの中で置き換える)
  q.bodies[2].dragCore = { massFrac: 1, radius: Rd.moon / L };
  return q;
}

/* ───────── 走行(子プロセスの中)───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]); return [a[0] / n, a[1] / n, a[2] / n]; };
/** tests/lib-w304e-apsis.mjs の attachSampler と同じ式(相対の位置・速度を関数で受ける —— EMB と地球自身)。巻き戻した黄経 th と接触の離心ベクトルの P・Q 成分 */
export function attachFnSampler(S, rel, relV, mu, every = 1) {
  const r0 = rel(), v0 = relV(), W = unit(cross(r0, v0)), P = unit(r0), Qv = cross(W, P);
  const T = [], EP = [], EQ = [], TH = [];
  let t = 0, k = 0, thPrev = Math.atan2(dot(r0, Qv), dot(r0, P)), thAcc = thPrev;
  const th0 = thAcc, orig = S.step;
  S.step = function (dt) {
    const out = orig.apply(this, arguments);
    t += dt; k++;
    const r = rel(), th = Math.atan2(dot(r, Qv), dot(r, P));
    let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    thAcc += d; thPrev = th;
    if (k % every === 0) { const e = AP.eccVector(r, relV(), mu); T.push(t); EP.push(dot(e, P)); EQ.push(dot(e, Qv)); TH.push(thAcc); }
    return out;
  };
  return { th0, samples: () => ({ t: T, eP: EP, eQ: EQ, th: TH }) };
}
/** 巻き戻した黄経から公転の時刻(th − th0 が 2πk を越える時刻 —— 標本の間の線形補間) */
export function revTimes(s, th0, nMax) {
  const out = []; let kk = 1;
  for (let i = 1; i < s.t.length && out.length < nMax; i++) {
    const a = s.th[i - 1] - th0, b = s.th[i] - th0, tg = 2 * Math.PI * kk;
    if (a < tg && b >= tg) { out.push(s.t[i - 1] + (s.t[i] - s.t[i - 1]) * (tg - a) / (b - a)); kk++; }
  }
  return out;
}
/** 🌦️ の 1 走行: 地球(EMB と地球自身)の近日点・月の emx4 の窓 */
export function runEM(HP, q, dt, nMoon, nEarth) {
  const t0 = Date.now(), v = HP.validatePreset(clone(q));
  if (!v.ok) return { status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const G = S.params.G, mS = S.m[0], mE = S.m[1], mM = S.m[2], mt = mE + mM, Tsec = Math.pow(10, q.scaleExp.T);
  const embR = () => [(mE * S.x[1] + mM * S.x[2]) / mt - S.x[0], (mE * S.y[1] + mM * S.y[2]) / mt - S.y[0], (mE * S.z[1] + mM * S.z[2]) / mt - S.z[0]];
  const embV = () => [(mE * S.vx[1] + mM * S.vx[2]) / mt - S.vx[0], (mE * S.vy[1] + mM * S.vy[2]) / mt - S.vy[0], (mE * S.vz[1] + mM * S.vz[2]) / mt - S.vz[0]];
  const eR = () => [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]], eV = () => [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]];
  const sB = attachFnSampler(S, embR, embV, G * (mS + mt), EM_SAMPLE_EVERY), sE = attachFnSampler(S, eR, eV, G * (mS + mE), EM_SAMPLE_EVERY);
  const relM = () => [S.x[2] - S.x[1], S.y[2] - S.y[1], S.z[2] - S.z[1]], sunLon = () => Math.atan2(S.y[0] - S.y[1], S.x[0] - S.x[1]);
  const rec = EMX.makeRec(G * mt, dt, relM(), sunLon());
  const maxSteps = Math.ceil(1.5 * nMoon * q.timeRef.pRef / dt);
  let k = 0, stop = null;
  for (; ; k++) {
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    const tp = S.t; S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (!(S.t > tp)) { stop = 'coord3dHalt'; break; }
    const d = relM(); if (!Number.isFinite(d[0] + d[1] + d[2])) { stop = 'nan'; break; }
    rec.push(k, d, sunLon());
    if (rec.ev.rev.length >= nMoon) { k++; stop = 'revMax'; break; }
  }
  const sb = sB.samples(), se = sE.samples(), revE = revTimes(sb, sB.th0, nEarth), tE = revE.length >= nEarth ? revE[nEarth - 1] : null;
  const fB = tE ? AP.apsisRate(sb, { t0: 0, t1: tE, K: APSIS_K }) : null, fE = tE ? AP.apsisRate(se, { t0: 0, t1: tE, K: APSIS_K }) : null;
  const W = stop === 'revMax' ? EMX.winOf(rec.ev, 0, nMoon) : { complete: false };
  const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
  return { status: 'run', steps: k, stop, complete: stop === 'revMax' && !!tE, nan: S.hasNaN(),
    emb: fB ? AP.toArcsecPerCentury(fB.rate, Tsec) : null, earth: fE ? AP.toArcsecPerCentury(fE.rate, Tsec) : null, embE: fB ? fB.e : null, nEarth, tEarth: tE,
    moon: W.complete ? { sidH: W.sidH, T4p: W.T4p, node: W.node, sid: W.sid, anom: W.anom, T1: W.T1, T2: W.T2, eMean: W.eMean, incMean: W.incMean, nPeri: W.nPeri } : null,
    betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: (Date.now() - t0) / 1000 };
}
export const specKey = (s) => s.system + '|' + s.kind + '|' + (Q.KINDS[s.kind].drag ? s.ruleKey + '|kernel=' + (s.kernel || 'k2') : '-') + '|div=' + s.div + '|N=' + s.N;
const hOf = (sys, base) => (sys === 'jupiter' ? P3.stepsOf(base.timeRef.pRef).h : EMX.DT);
/** 1 本の走行(spec = {system, kind, Rd, ruleKey, kernel, div, N, nEarth?}) */
export function runSpec(HP, spec) {
  const base = baseOf(HP, spec.system), h = hOf(spec.system, base), q = bookOf(base, spec.system, spec.kind, spec.Rd || {}, spec.kernel);
  const wantK1 = Q.KINDS[spec.kind].drag && spec.kernel === 'k1', v = HP.validatePreset(clone(q));
  if (!v.ok) { const err = JSON.stringify(v.errors).slice(0, 300);
    return { key: specKey(spec), spec, status: 'rejected', err, unconnected: wantK1 && /kernel/.test(err) ? '未接続(invSq.kernel を受理しない html)' : null }; }
  if (wantK1 && !(v.preset.physics.relativeDrag && v.preset.physics.relativeDrag.invSq && v.preset.physics.relativeDrag.invSq.kernel === 'k1'))
    return { key: specKey(spec), spec, status: 'rejected', err: '受理した写しに invSq.kernel:"k1" が無い', unconnected: '未接続(invSq.kernel を正準形に残さない html)' };
  const r = spec.system === 'jupiter' ? PL3.measure(HP, q, h / spec.div, spec.N) : runEM(HP, q, h / spec.div, spec.N, spec.nEarth);
  return Object.assign({ key: specKey(spec), spec, h, dt: h / spec.div, warnings: (v.warnings || []).length }, r, { status: r.status || 'run' });
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp) => new Promise((res, rej) => { q.push({ sp, res, rej }); pump(); });
}

/* ───────── 規則(段 C の前半 —— t = 0 だけ・純関数と写しの読み口)───────── */
/** 3 惑星の探索の出力(既定は正本 —— 2 段目は --planet3 で K1 の --merge の出力などを渡す) */
export function planet3Of(f) { const g = f || PLANET3_OUT; return JSON.parse(fs.readFileSync(path.isAbsolute(g) ? g : path.join(ROOT, g), 'utf8')); }
export function ruleBasis(HP, P311) {
  const books = Q.PLANETS.map((p) => Q.pinnedBook(HP, PL3.PIN, p.id)), rows = C.planetRows(P311, books);
  return { rows, table: C.ruleTable(rows), planet3: { version: P311.version, targetSha256: P311.targetSha256, kernel: P311.kernel || 'k2' } };
}
/** 既定の規則(今の法則 K2 の数値の根の並び —— 3 惑星の R_d²/(m p) の平均・月の p は地球のまわり) */
export const defaultRule = (basis) => ({ type: 'rd2OverMp', k: Number(basis.table.rd2OverMp.mean.toPrecision(6)), moonP: 'earth' });
/** 規則を確認の系の天体へ(R_d・R_d/R・受理の目安)—— 月は p の 2 つの選び方を両方並べる(rd2OverMp のとき) */
export function applyRule(HP, rule, capM) {
  const props = { jupiter: C.bodyProps('jupiter', baseOf(HP, 'jupiter')), earthmoon: C.bodyProps('earthmoon', baseOf(HP, 'earthmoon')) };
  // v2: 受理の目安は 0 < R_d ≤ 観測半径だけ(capM は第312便の世代の作り直しだけ —— QA の世代切替)
  const cell = (bk, b, r) => { const Rd = C.rdOfRule(r, bk, b), a = C.admissibleOf(Rd, b.R, Number.isFinite(capM) ? { capM } : {}); return { Rd, rdOverR: Number.isFinite(Rd) ? Rd / b.R : null, R: b.R, m: b.m, admissible: a.ok, why: a.why }; };
  const out = { jupiter: cell('jupiter', props.jupiter.jupiter, rule), earth: cell('earth', props.earthmoon.earth, rule), props };
  if (rule.type === 'kappa0') { out.sun = cell('sun', props.earthmoon.sun, rule); out.sunJ = cell('sun', props.jupiter.sun, rule); }   // v2: 全天体の規則は太陽も
  if (rule.type === 'rd2OverMp') { out.moonEarthP = cell('moon', props.earthmoon.moon, Object.assign({}, rule, { moonP: 'earth' })); out.moonSunP = cell('moon', props.earthmoon.moon, Object.assign({}, rule, { moonP: 'sun' })); }
  out.moon = cell('moon', props.earthmoon.moon, rule);
  out.moonDefined = Number.isFinite(out.moon.Rd);
  return out;
}
/** t = 0 の写しの β(エンジンの読み口 —— 受け手 i ← 源 j)。🌦️ は月の p の 2 つの選び方で。v2: Rd.rule === "kappa0" は全天体の規則 */
export function betaAt0(HP, sys, Rd, kernel) {
  const base = baseOf(HP, sys), q = bookOf(base, sys, 'q11', Rd, kernel), v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: JSON.stringify(v.errors).slice(0, 200) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const st = HP.inertialDragIsqState(S), b = (i, j) => { const r = st.receivers.find((z) => z.i === i); return r ? r.beta[j] : null; };
  return sys === 'jupiter' ? { jupiterSun: b(1, 0), sunJupiter: b(0, 1) } : { earthSun: b(1, 0), earthMoon: b(1, 2), moonSun: b(2, 0), moonEarth: b(2, 1) };
}

/* ───────── 段 T と C(E の行から —— 純関数 —— QA が作り直す)───────── */
const qOf = (E, sys, kind, rk, kern, div, ex) => { const r = E.rows[specKey({ system: sys, kind, ruleKey: rk, kernel: kern, div, N: E.N[sys] })]; return r && r.status === 'run' ? (ex ? ex(r) : r) : undefined; };
export const EXTRACT = Object.freeze({ jupiter: Object.freeze({ main: 'apsNew', sub: 'detB' }), earthmoon: Object.freeze({ main: 'emb', sub: 'earth' }) });
export function targetTable(HP) {
  const recs = AN.readRecords(ROOT), out = {};
  let live = null; try { live = JSON.parse(fs.readFileSync(path.join(ROOT, AN336_OUT), 'utf8')).transfer.table; } catch (e) { live = null; }
  for (const s of C.SYSTEMS) {
    const base = baseOf(HP, s.key), t = C.targetOf(ROOT, s.key, base, recs), L = live && s.key === 'jupiter' ? live.find((z) => z.id === s.id) : null;
    out[s.key] = Object.assign({ id: s.id }, t, { gLocAnalytic: C.gLocAnalyticOf(s.key, base), h: hOf(s.key, base),
      an336: L ? { value: L.target.value, pn1: L.target.pn1, a1: L.target.a1, recordId: L.target.recordId, h: L.h } : null });
  }
  return out;
}
/** 系ごとの残差の表(主と副の抽出器 × 刻み)。rk = 規則の鍵・kern = kernel */
export function confirmOf(J, sys, rk, kern) {
  const E = J.E, tg = J.T.targets[sys], divs = E.divs[sys] || [], X = EXTRACT[sys], out = { byDiv: {} };
  for (const dv of divs) {
    const g = (kind, ex) => qOf(E, sys, kind, rk, kern, dv, (r) => r[ex]);
    const q = { q00: g('q00', X.main), q10: g('q10', X.main), q01: g('q01', X.main), q11: g('q11', X.main) };
    if (!Number.isFinite(q.q00) || !Number.isFinite(q.q10)) continue;
    const qs = { q00: g('q00', X.sub), q10: g('q10', X.sub), q01: g('q01', X.sub), q11: g('q11', X.sub) };
    out.byDiv[dv] = Object.assign({ q }, Q.residualOf(q, tg.value), { sub: Q.residualOf(qs, tg.value) });
  }
  const dsG = divs.filter((d) => out.byDiv[d]), dsR = divs.filter((d) => out.byDiv[d] && Number.isFinite(out.byDiv[d].r));
  out.dqG = dsG.length ? out.byDiv[dsG[dsG.length - 1]].dqG : null;
  out.dqGBand = dsG.length >= 2 ? Math.abs(out.byDiv[dsG[dsG.length - 1]].dqG - out.byDiv[dsG[dsG.length - 2]].dqG) : null;
  out.dqGVsAnalytic = out.dqG !== null ? Math.abs(out.dqG - tg.gLocAnalytic) / Math.abs(tg.gLocAnalytic) : null;
  out.tD = out.dqG !== null ? tg.value - out.dqG : null;
  out.fine = dsR.length ? dsR[dsR.length - 1] : null;
  out.r = out.fine ? out.byDiv[out.fine].r : null;
  out.DG = out.fine ? out.byDiv[out.fine].DG : null;
  out.band = dsR.length >= 2 ? Q.bandOf(out.byDiv[dsR[dsR.length - 1]].r, out.byDiv[dsR[dsR.length - 2]].r) : null;
  out.gate = Q.gateOf(out.r, out.band);
  out.rOverTD = Number.isFinite(out.r) && Number.isFinite(out.tD) ? out.r / out.tD : null;
  const dI = divs.filter((d) => out.byDiv[d] && Number.isFinite(out.byDiv[d].I));
  out.I = dI.length ? out.byDiv[dI[dI.length - 1]].I : null;
  // 確認の語の条件: 規則で置いた残差が数値の門の内(帯があるとき)
  out.verdict = out.r === null ? '走らせていない' : (out.gate.pass === true ? '数値の門の内' : (out.gate.pass === false ? '規則が届かない' : '帯なし(h だけ —— 門は判定しない)'));
  return out;
}
/** 🌦️ の月の診断(引きずりの有無の差・G_loc の差・在位の観測 OBS_B1 との比較)—— 同じ刻みの q00・q10・q11 */
export const MOON_Q = Object.freeze([['sidH', 'sid', 'd', '恒星月(調和の回帰)'], ['T4p', 'aps', 'yr', '近地点の周期(調和の回帰)'], ['node', 'node', 'yr', '交点の周期']]);
export function moonOf(J, rk, kern) {
  const E = J.E, divs = E.divs.earthmoon || [], out = { byDiv: {} };
  for (const dv of divs) {
    const m = (kind) => { const r = qOf(E, 'earthmoon', kind, rk, kern, dv); return r && r.moon ? r.moon : null; };
    const a = m('q00'), b = m('q10'), c = m('q11');
    if (!a) continue;
    const row = {};
    for (const [k, ok, u] of MOON_Q) row[k] = { unit: u, obs: EMX.OBS_B1[ok].value, q00: a[k], q10: b ? b[k] : null, q11: c ? c[k] : null,
      dG: b ? b[k] - a[k] : null, dD: c ? c[k] - a[k] : null, dDG: (b && c) ? c[k] - b[k] : null, q00MinusObs: a[k] - EMX.OBS_B1[ok].value, q11MinusObs: c ? c[k] - EMX.OBS_B1[ok].value : null };
    out.byDiv[dv] = row;
  }
  return out;
}
/**
 * 所要(系・走行・刻みごと —— 新しく走らせた行だけ)と 2 段目の費用の見積り。揮発の欄は安定 hash の除外の語彙だけ(wallSec・rateStepsPerSec・spentSec ——
 * lint.stableHashPaths)—— 步(steps)は決定的。rate は引きずりの步の速さ(步/s)・stage2 の spentSec は見積りの CPU 秒(步 ÷ 速さ)
 */
export function costOf(J) {
  const rows = Object.values(J.E.rows).filter((r) => r.status === 'run' && !r.reused), by = {};
  for (const r of rows) { const k = r.spec.system + '|' + (Q.KINDS[r.spec.kind].drag ? 'drag' : 'nodrag') + '|h/' + r.spec.div;
    const w = by[k] || (by[k] = { system: r.spec.system, drag: Q.KINDS[r.spec.kind].drag, div: r.spec.div, n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r.steps; w.wallSec += r.wallSec; }
  const rate = {};
  for (const sys of ['jupiter', 'earthmoon']) { const z = Object.values(by).filter((w) => w.system === sys && w.drag);
    if (z.length) rate[sys] = { rateStepsPerSec: z.reduce((s, w) => s + w.steps, 0) / z.reduce((s, w) => s + w.wallSec, 0) }; }
  const stepsOf = (sys, div, N) => { const z = rows.find((r) => r.spec.system === sys && r.spec.div === 1 && Q.KINDS[r.spec.kind].drag) || rows.find((r) => r.spec.system === sys && r.spec.div === 1);
    return z ? z.steps * div * N / z.spec.N : null; };
  const est = (sys, div, N) => { const s = stepsOf(sys, div, N); return (rate[sys] && s) ? { steps: Math.round(s), spentSec: Math.round(s / rate[sys].rateStepsPerSec) } : null; };
  return { rows: by, rate,
    stage2: {
      note: '1 走行の CPU 秒の見積り spentSec = 步 ÷ 引きずりの步の実測の速さ rate(步は刻みと窓に比例)。K1 の步の費用は K2 と同じ程度の見込み(統合の後に実測)',
      jupiter: { h: est('jupiter', 1, N_JUP), h2: est('jupiter', 2, N_JUP), h4: est('jupiter', 4, N_JUP) },
      earthmoon: { h: est('earthmoon', 1, N_MOON), h2: est('earthmoon', 2, N_MOON), h4: est('earthmoon', 4, N_MOON), long354: est('earthmoon', 1, 354), long1062: est('earthmoon', 1, 1062) } } };
}
export function partC(HP, J, o = {}) {
  // v2: o.capM は第312便の世代の受理の目安(QA の世代切替だけ)。全天体の規則 kappa0 の t = 0 の β は全天体に κ₀m(K1 —— 確認の系の規則)
  const capM = o.capM, basis = o.basis || ruleBasis(HP, planet3Of()), rule = J.rule, applied = applyRule(HP, rule, capM), kern = J.kernel || 'k2', rk = C.ruleKey(rule);
  const rd2 = rule.type === 'rd2OverMp' ? rule : defaultRule(basis);
  // 今の法則の規則(R_d²/(m p) が一定)を全部の型と並べた表(t = 0 だけ)
  const k2Rule = defaultRule(basis), byType = {};
  for (const t of ['rdOverR', 'rdOverM', 'rd2OverMp']) byType[t] = applyRule(HP, { type: t, k: Number(basis.table[t].mean.toPrecision(6)), moonP: 'earth' }, capM);
  const beta0 = {};
  const kap = rule.type === 'kappa0' ? { rule: 'kappa0' } : null;
  if (applied.jupiter.admissible) beta0.jupiter = betaAt0(HP, 'jupiter', kap || { jupiter: applied.jupiter.Rd }, kern);
  const apE = applyRule(HP, Object.assign({}, rd2, { moonP: 'earth' }), capM), apS = applyRule(HP, Object.assign({}, rd2, { moonP: 'sun' }), capM);
  beta0.earthmoonMoonEarthP = betaAt0(HP, 'earthmoon', kap || { earth: apE.earth.Rd, moon: apE.moon.Rd }, kern);
  beta0.earthmoonMoonSunP = betaAt0(HP, 'earthmoon', kap || { earth: apS.earth.Rd, moon: apS.moon.Rd }, kern);
  // EMB の近日点への引きずりの重み(推定 —— 地球と月の β(← 太陽)の質量の平均 / 地球の β)。月の p の 2 つの選び方で
  const mE = applied.props.earthmoon.earth.m, mM = applied.props.earthmoon.moon.m, wEMB = (b) => (b && Number.isFinite(b.earthSun) && b.earthSun > 0) ? (mE * b.earthSun + mM * b.moonSun) / ((mE + mM) * b.earthSun) : null;
  const out = { rule, ruleKey: rk, kernel: kern, basis: { rows: basis.rows, table: basis.table, planet3: basis.planet3 }, k2Rule, applied: { jupiter: applied.jupiter, earth: applied.earth, moon: applied.moon, moonEarthP: applied.moonEarthP || null, moonSunP: applied.moonSunP || null, moonDefined: applied.moonDefined },
    byType: Object.fromEntries(Object.entries(byType).map(([t, a]) => [t, { jupiter: a.jupiter, earth: a.earth, moonEarthP: a.moonEarthP || a.moon, moonSunP: a.moonSunP || null }])),
    orbits: { jupiter: applied.props.jupiter.jupiter.orbit, earth: applied.props.earthmoon.earth.orbit, moon: applied.props.earthmoon.moon.orbit },
    beta0, embWeight: { moonEarthP: wEMB(beta0.earthmoonMoonEarthP), moonSunP: wEMB(beta0.earthmoonMoonSunP), massFracEarth: mE / (mE + mM) } };
  if (J.E && J.T) {
    out.systems = {};
    for (const s of C.SYSTEMS) if ((J.E.divs[s.key] || []).length) out.systems[s.key] = confirmOf(J, s.key, rk, kern);
    if ((J.E.divs.earthmoon || []).length) out.moon = moonOf(J, rk, kern);
    out.cost = costOf(J);
  }
  return out;
}

/* ───────── 門(器の健全さ)───────── */
export function liveSame(HP) {
  const p = findPreset(HP, 'earthMoonSunInertial3d'), j = findPreset(HP, 'jupiterSunInertial3d'), d = PL3.PIN.decl.jupiterSunInertial3d, rdj = j.physics.relativeDrag || {};
  return { earthmoon: !!p && JSON.stringify(p.physics) === JSON.stringify(PIN_EM.physics) && JSON.stringify(p.bodies) === JSON.stringify(PIN_EM.bodies)
      && JSON.stringify(p.scaleExp) === JSON.stringify(PIN_EM.scaleExp) && JSON.stringify(p.timeRef) === JSON.stringify(PIN_EM.timeRef),
    jupiter: JSON.stringify(j.bodies) === JSON.stringify(d.bodies) && JSON.stringify(j.scaleExp) === JSON.stringify(d.scaleExp) && JSON.stringify(j.timeRef) === JSON.stringify(d.timeRef)
      && rdj.law === 'inertial' && typeof rdj.Wbg === 'number' && !rdj.invSq && !!j.physics.gLoc && j.physics.gLoc.law === 'kappaC2' && !j.bodies.some((b) => b.dragCore) };
}
export function gatesOf(J) {
  const g = {};
  if (J.T) g.targetsAn336 = !!(J.T.targets.jupiter.an336 && J.T.targets.jupiter.an336.value === J.T.targets.jupiter.value && J.T.targets.jupiter.an336.recordId === J.T.targets.jupiter.recordId
    && J.T.targets.earthmoon.a1 === null && J.T.targets.earthmoon.kind === 'pn1only');
  if (J.E) {
    const run = Object.values(J.E.rows);
    g.runsComplete = run.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && (r.spec.system === 'jupiter'
      ? (Number.isFinite(r.detB) && Number.isFinite(r.apsNew) && r.nPeri >= r.spec.N - 1)
      : (Number.isFinite(r.emb) && Number.isFinite(r.earth) && r.moon && Number.isFinite(r.moon.sidH) && Number.isFinite(r.moon.T4p) && Number.isFinite(r.moon.node))));
    g.noRejected = run.every((r) => r.status === 'run');
    if (J.T) g.gLocMeasured = (J.systems || []).every((s) => (J.E.divs[s] || []).length > 0 && (J.E.divs[s] || []).every((d) => J.C && J.C.systems && J.C.systems[s] && J.C.systems[s].byDiv[d] && Number.isFinite(J.C.systems[s].byDiv[d].dqG)));
  }
  if (J.C) g.ruleFromPlanet3 = !!(J.C.basis && J.C.basis.rows.length === 3 && J.C.basis.rows.every((r) => Number.isFinite(r.rd)));
  if (J.live) g.inPositionUnchanged = J.live.earthmoon === true && J.live.jupiter === true;
  return g;
}

/* ───────── 文書の表(PHYSICS〔第312便d〕—— QA docs.confirm312 が逐語で照合)───────── */
const { fx, ex } = Q;
const fb = (x) => Q.fmtFloor(x, 1e-6, 2);
const km = (m) => Number.isFinite(m) ? (m / 1e3).toPrecision(4) : '—';
const RULE_JA = { rdOverR: 'R_d/R が一定', rdOverM: 'R_d/m が一定 [m/kg]', rd2OverMp: 'R_d²/(m p) が一定 [m/kg]' };
const adm = (c) => !c ? '—' : (c.admissible ? km(c.Rd) + '(' + ex(c.rdOverR, 2) + ')' : km(c.Rd) + '(拒否)');
export function physicsTables(J) {
  const out = [], Cc = J.C;
  if (Cc) {
    out.push('| 規則(3 惑星の値 —— 水星は区間の割線・金星と火星は段 S の一次の見積り) | 🌡️ 水星 | 🌋 金星 | 🔴 火星 | 平均 | 最大/最小 |', '|---|---|---|---|---|---|');
    for (const t of ['rdOverR', 'rdOverM', 'rd2OverMp']) { const T = Cc.basis.table[t];
      out.push(`| ${RULE_JA[t]} | ${T.values.map((z) => ex(z.v, 3)).join(' | ')} | ${ex(T.mean, 3)} | ${fx(T.spread, 3)} |`); }
    out.push('', '| 規則を確認の系へ(同じ式・1 つの天体に 1 つ)—— R_d [km](R_d/R) | 🏀 木星 | 地球 | 月(p = 地球のまわり) | 月(p = 太陽のまわり) |', '|---|---|---|---|---|');
    out.push(...byTypeRows(Cc.byType));
    const b0 = Cc.beta0, E0 = b0.earthmoonMoonEarthP, S0 = b0.earthmoonMoonSunP;
    if (E0 && S0 && !E0.err && !S0.err) {
      out.push('', '| t = 0 の β(R_d²/(m p) が一定の規則 —— エンジンの読み口) | 地球 ← 太陽 | 地球 ← 月 | 月 ← 太陽 | 月 ← 地球 | EMB の重み(推定) |', '|---|---|---|---|---|---|');
      out.push(`| 月の p = 地球のまわり | ${ex(E0.earthSun, 3)} | ${ex(E0.earthMoon, 3)} | ${ex(E0.moonSun, 3)} | ${ex(E0.moonEarth, 3)} | ${fx(Cc.embWeight.moonEarthP, 5)} |`);
      out.push(`| 月の p = 太陽のまわり | ${ex(S0.earthSun, 3)} | ${ex(S0.earthMoon, 3)} | ${ex(S0.moonSun, 3)} | ${ex(S0.moonEarth, 3)} | ${fx(Cc.embWeight.moonSunP, 5)} |`);
    }
    if (Cc.systems) {
      out.push('', '| 系(規則 ' + Cc.ruleKey + '・kernel ' + Cc.kernel + ') | 標的 q⋆ [″/世紀] | ΔqG(最も細かい刻み) | ΔqG の解析の一次 | t_D | D_G | r(h) | r(最も細かい刻み) | 帯 | 数値の門 | r/t_D |', '|---|---|---|---|---|---|---|---|---|---|---|');
      for (const s of C.SYSTEMS) { const o = Cc.systems[s.key]; if (!o) continue; const t = J.T.targets[s.key], b1 = o.byDiv[1];
        out.push(`| ${s.emoji} ${s.ja}(${s.key === 'jupiter' ? '1PN + A1' : 'EMB・1PN だけ'}) | ${fx(t.value, 6)} | ${fx(o.dqG, 6)} | ${fx(t.gLocAnalytic, 6)} | ${fx(o.tD, 6)} | ${fx(o.DG, 6)} | ${b1 && Number.isFinite(b1.r) ? fx(b1.r, 6) : '—'} | ${fx(o.r, 6)} | ${o.band === null ? '—' : fb(o.band)} | ${o.verdict} | ${fx(o.rOverTD, 4)} |`); }
    }
    if (Cc.moon) {
      const dv = Math.max(...Object.keys(Cc.moon.byDiv).map(Number)), M = Cc.moon.byDiv[1] || Cc.moon.byDiv[dv];
      out.push('', '| 月(🌦️ の三体 —— 118 公転の窓・刻み h) | 在位の観測 OBS_B1 | q00(在位の写し) | q00 − 観測 | q10 − q00(G_loc) | q11 − q00(G_loc + 引きずり) | q11 − q10(引きずり) |', '|---|---|---|---|---|---|---|');
      for (const [k, , u, ja] of MOON_Q) { const z = M[k];
        out.push(`| ${ja} [${u}] | ${fx(z.obs, 6)} | ${fx(z.q00, 6)} | ${ex(z.q00MinusObs, 3)} | ${ex(z.dG, 3)} | ${ex(z.dD, 3)} | ${ex(z.dDG, 3)} |`); }
    }
    // 所要(壁時計の秒・ms/步)は揮発の値 —— 逐語の表に入れない(正本の C.cost と本文の「程度」で書く)
  }
  return out.join('\n');
}
/** 規則を確認の系へ当てた表の行(3 つの型 —— 第312便d の physicsTables と同じ行。v2: cap を外した後の表〔PHYSICS〔第313便d〕〕にも使う) */
export function byTypeRows(byType) {
  return ['rdOverR', 'rdOverM', 'rd2OverMp'].map((t) => { const a = byType[t];
    return `| ${RULE_JA[t]} | ${adm(a.jupiter)} | ${adm(a.earth)} | ${adm(a.moonEarthP)} | ${t === 'rd2OverMp' ? adm(a.moonSunP) : '(p に依らない)'} |`; });
}
export function docNumbers(J) {
  const out = [], Cc = J.C; if (!Cc) return out;
  out.push(ex(Cc.basis.table.rd2OverMp.mean, 3), km(Cc.applied.jupiter.Rd), km(Cc.applied.earth.Rd));
  if (Cc.applied.moonEarthP) out.push(km(Cc.applied.moonEarthP.Rd), km(Cc.applied.moonSunP.Rd));
  if (Cc.systems) for (const s of C.SYSTEMS) { const o = Cc.systems[s.key]; if (o) out.push(fx(o.r, 6)); }
  return out;
}

/* ───────── 走行の計画と組み立て ───────── */
export function planOf(o) {
  const specs = [], seen = new Set();
  for (const sys of o.systems) {
    const kap = o.ruleKey === 'kappa0';   // v2: 全天体の規則(太陽も —— 本の単位の κ₀m は bookOf が置く)
    const P = o.plan[sys], N = sys === 'jupiter' ? o.nJup : o.nMoon, Rd = kap ? { rule: 'kappa0' } : (sys === 'jupiter' ? { jupiter: o.applied.jupiter.Rd } : { earth: o.applied.earth.Rd, moon: o.applied.moon.Rd });
    const ok = sys === 'jupiter' ? o.applied.jupiter.admissible : (o.applied.earth.admissible && o.applied.moon.admissible);
    for (const kind of P.kinds) {
      const drag = Q.KINDS[kind].drag; if (drag && !ok) continue;   // 規則の R_d が受理の目安の外 —— 走らせない(段 C の拒否の記録)
      for (const div of (drag && P.dragDivs ? P.dragDivs : P.divs)) {
        const s = { system: sys, kind, div, N, ruleKey: o.ruleKey, kernel: o.kernel };
        if (drag) s.Rd = Rd;
        if (sys === 'earthmoon') s.nEarth = o.nEarth;
        const k = specKey(s); if (!seen.has(k)) { seen.add(k); specs.push(s); }
      }
    }
  }
  return specs;
}
const costRank = (s) => (Q.KINDS[s.kind].drag ? 100 : 1) * s.div * (s.system === 'earthmoon' ? 5 : 1);
export async function runAll(HP, o = {}) {
  const parts = o.parts || PARTS_ALL.slice(), t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const basis = ruleBasis(HP, planet3Of(o.planet3File)), rule = o.rule ? C.fillRule(o.rule, basis.table) : defaultRule(basis), kern = o.kernel || 'k2';
  const J = { quick: !!o.quick, parts, stage2: !!o.stage2, kernel: kern, rule, systems: o.systems.slice(), planet3File: o.planet3File || PLANET3_OUT };
  J.live = liveSame(HP);
  J.book = { ids: C.SYSTEMS.map((s) => s.id), newDrag: clone(Q.NEW_DRAG), gLoc: clone(Q.GLOC_FIXED), pinEM: PIN_EM_BASE, declFile: PL3.DECL_FILE, capM: C.CAP_M,
    window: { jupiter: o.nJup, earthmoonMoon: o.nMoon, earthmoonEarth: o.nEarth }, extractor: EXTRACT, sampleEvery: EM_SAMPLE_EVERY };
  const applied = applyRule(HP, rule);
  if (parts.includes('E')) {
    const plan = planOf({ systems: o.systems, plan: o.plan, nJup: o.nJup, nMoon: o.nMoon, nEarth: o.nEarth, applied, ruleKey: C.ruleKey(rule), kernel: kern });
    J.plan = { systems: o.systems, plan: o.plan, specs: plan.length };
    const todo = plan.slice().sort((a, b) => costRank(b) - costRank(a));
    const res = await Promise.all(todo.map((s) => o.run(s).then((r) => { (o.log || (() => {}))(r); return r; })));
    const rows = {}; for (const r of res) rows[r.key] = r;
    const divs = {}; for (const s of o.systems) divs[s] = [...new Set(plan.filter((z) => z.system === s && !Q.KINDS[z.kind].drag).map((z) => z.div))].sort((a, b) => a - b);
    J.E = { N: { jupiter: o.nJup, earthmoon: o.nMoon }, nEarth: o.nEarth, divs, rows };
    tick('E');
  }
  if (parts.includes('T')) { J.T = { targets: targetTable(HP) }; tick('T'); }
  if (parts.includes('C')) { J.C = partC(HP, J, { basis }); tick('C'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
const listOf = (k) => (argOf(k) ? argOf(k).split(',').map((s) => s.trim()).filter(Boolean) : null);
export async function main() {
  const TARGET = process.env.W312D_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W312D_QUICK === '1';
  const sysArg = listOf('--system'), systems = sysArg ? sysArg.map((s) => { const z = C.systemOf(s); if (!z) throw new Error('--system ' + s); return z.key; }) : C.SYSTEMS.map((s) => s.key);
  const rule = argOf('--rule') ? JSON.parse(argOf('--rule')) : null;
  if (rule) { const e = C.checkRule(rule); if (e) throw new Error(e); }
  const kernel = argOf('--kernel') || 'k2'; if (!Q.KERNELS.includes(kernel)) throw new Error('--kernel は ' + Q.KERNELS.join('|'));
  if (rule && rule.type === 'kappa0' && kernel !== 'k1') throw new Error('--rule kappa0 は --kernel k1 と一緒にだけ(K1 の写しだけ)');
  const divL = listOf('--divs'), kindsL = listOf('--kinds'), h4 = process.argv.includes('--h4'), moonN = Number(argOf('--moon')) || null, p3f = argOf('--planet3');
  const stage2 = !!(sysArg || rule || kernel !== 'k2' || divL || kindsL || h4 || moonN || p3f);
  const base = quick ? QUICK_PLAN : BRANCH_PLAN, plan = {};
  for (const s of systems) {
    const P = base[s], divs = (divL ? divL.map(Number) : P.divs.slice()).concat(h4 ? [4] : []).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => a - b);
    plan[s] = { kinds: kindsL || P.kinds.slice(), divs, dragDivs: (divL || h4) ? divs : (P.dragDivs ? P.dragDivs.slice() : divs) };
  }
  const out2 = sysArg ? OUT_STAGE2.replace('.json', '-' + systems.join('-') + '.json') : OUT_STAGE2;
  const OUT = process.env.W312D_OUT ? (path.isAbsolute(process.env.W312D_OUT) ? process.env.W312D_OUT : path.join(ROOT, process.env.W312D_OUT)) : path.join(ROOT, stage2 ? out2 : OUT_MAIN);
  if (quick && !process.env.W312D_OUT) throw new Error('試走(W312D_QUICK=1)は W312D_OUT を指定する(正本を書かない)');
  const parts = process.env.W312D_PARTS ? process.env.W312D_PARTS.split(',') : PARTS_ALL.slice();
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const NW = Math.max(1, Number(process.env.W312D_WORKERS) || 2), run = makePool(NW, fileURLToPath(import.meta.url));
  const log = (r) => console.log(`  ${r.key}: ${r.status}${r.status === 'run' ? (r.spec.system === 'jupiter' ? '・新 ' + Number(r.apsNew).toFixed(6) + '・B ' + Number(r.detB).toFixed(6) + '″/世紀'
    : '・EMB ' + Number(r.emb).toFixed(6) + '・地球 ' + Number(r.earth).toFixed(6) + '″/世紀・月 ' + (r.moon ? Number(r.moon.sidH).toFixed(9) + ' d・' + Number(r.moon.T4p).toFixed(6) + ' 年・' + Number(r.moon.node).toFixed(6) + ' 年' : '—'))
    + '・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.unconnected ? r.unconnected + '・' : '') + (r.err || '').slice(0, 120)}`);
  const R = await runAll(HP, { quick, parts, systems, plan, rule, kernel, planet3File: p3f, nJup: quick ? N_JUP_QUICK : N_JUP, nMoon: moonN || (quick ? N_MOON_QUICK : N_MOON), nEarth: quick ? N_EARTH_QUICK : N_EARTH, run, log, stage2 });
  const out = { version: HARNESS_VERSION, libVersion: C.LIB_VERSION, planet3LibVersion: Q.LIB_VERSION, planet3HarnessVersion: PL3.HARNESS_VERSION, an336LibVersion: AN.LIB_VERSION, apsisVersion: AP.APSIS_VERSION,
    emxVersion: EMX.EXTRACTOR_VERSION, generator: 'tests/exp-w312d-confirm.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の裁定(第114報): 水星・金星・火星で絞り込んだ候補を、木星と「太陽と地球と月」で確認する —— 決断事項 AN398(軌道に依る R_d を天体の性質として採らない・' +
      '候補から決めた規則で R_d を置き残差を測る・合わせない・1 つの天体に 1 つの宣言・太陽は固定・G_loc の分は各系で)・AN396・AN336・統括の検証項目 R233。確認の材料(在位へ入れない)。' +
      'v2(第313便d —— 原仮定者の裁定(第115報)AN399・AN402・統括の検証項目 R237): 全天体の規則 kappa0(太陽も・κ₀ 固定)の口・受理の目安の cap を外す',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w312d-confirm.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w312d-confirm.mjs', 'tests/exp-w311d-planet3.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/exp-w303c-earthmoon.mjs', 'tests/lib-w306a-an336.mjs',
    'tests/lib-w304e-apsis.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第313便d', target: TARGET, code: CODE,
    inputs: [TARGET, LEGACY7_DATA_FILE, PL3.DECL_FILE, PLANET3_OUT, AN336_OUT, AN.CANDIDATE_FILE, AN.AUDIT_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W312D_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  const S = out.C && out.C.systems ? Object.fromEntries(Object.entries(out.C.systems).map(([k, v]) => [k, { r: v.r, band: v.band, verdict: v.verdict }])) : null;
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(S));
}
if (IS_MAIN) await main();

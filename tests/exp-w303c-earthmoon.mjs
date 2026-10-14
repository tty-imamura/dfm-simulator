// 第303便c(原仮定者の裁定(第93報)③「dragCore について、太陽と水星の関係では、太陽は質点とみなせる事を 1PN が証明している。密度が高く距離が近い
// 地球と月の関係では、質点とはみなせず天体半径の影響が大きい」・統括の検証項目 R193)——
// **地球–月の基線の監査と、天体半径の効き方の目録の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// アプリの三次元の步〔HP.coord3d.makeSim の step〕を走らせる。走行は 1 プロセスで順に —— 118 公転の走行は同時 1 本)。
//
// ■ 段(正本 tests/out/earthmoon-w303c.json —— 段 earthmoon-303c)。W303C_PARTS=audit,radius,sunbg,ident(既定は全部)で段を分けて走らせられる
//   (分けたときは既存の出力 JSON の他の段を残して上書き —— 鎖は全段で走らせる)。W303C_OUT で出力先を変える(試走は正本を書かない)。
//   audit  基線の監査: 🌦️ の写しの引きずり OFF(宣言の初期配置のまま)を長い窓(1062 公転 ≈ 79 年)で走らせ、(ii) 窓と抽出器
//          (t=0 からの 118/354/708/1062 公転・118 公転窓を 12 公転ずつずらした窓の分布・M1 近点の通過・M2 接触離心ベクトル・M3 位相の回帰・
//          M4 調和の回帰〔ϖ の時刻への直線に、太陽と近点の角 φ = 2(λ☉ − ϖ̄) の 1〜3 倍の正弦・余弦を加えた最小二乗〕)を分ける。
//          (iv) 重力の軟化 ε=0.01(10⁶ m —— 本の宣言)を 0 にした写し・(iii) 地球–月の重心の公転離心率 e′=0.0167 の写し(近日点から/遠日点から)・
//          引きずり ON(宣言の W_bg)・(i) 初期配置の感度(近地点距離・接触離心率・接触傾斜を動かした写しで、長い窓の平均の要素と近点周期の
//          応答を測り、平均の要素あたりの近点周期の感度に直す)。器の中だけの参照積分器(アプリの物理ではない —— 速度 Verlet・同じ抽出器)で
//          エンジンとの一致を門にして、他の惑星(金星・火星・木星・土星を円軌道の規定運動の摂動体として)・地球の J₂・潮汐の保存項(🌜 の宣言の k₂)
//          の寄与を足し算で測る。
//   radius 天体半径の効き方の目録(宣言の W_bg のまま): (a) 源の有限球(地球の dragCore の格子・点源・一様球)/(b) 受け手の有限球
//          (月の体積で地球の引きずり場を平均 —— エンジンの構造核の表を器の中で二重平均の表に差し替えた写し・対称にした写しも)/(c) 自己の慣性決定力
//          (受け手自身の m_i/(λR_i²) を行の分母に足す —— エンジンの関数 inertialDragNormApply を器の process の中で包んだ写し。λ は 3r_s☉ の
//          普遍の長さと λ ∝ m の 2 つの読み)/(d) 地球の J₂(参照積分器)/(e) 潮汐の保存項(参照積分器 —— 三次元の本は明示潮汐を受理しない)。
//          近点周期・恒星月・交点周期への効き(同じ刻みの差 —— h/2 でも測る)と解析の見積り。
//   sunbg  太陽が背景側: 枝 b の r⁻² の読み(太陽の w_I = M☉/(λ d²)・d = 1 au —— 公転半径から)を宣言の W_bg の値として入れた 🌦️ と 🌔 の写し
//          (λ = (6+2n)GM☉/c² の n ∈ {0, +1, −1, −2})で、月の ξ = w/(W+w) と近点周期・恒星月の変化。瞬間の距離の写し(器の中で行の分母に足す)も。
//   ident  多量の同定: W_bg を固定し(宣言のフィット値と r⁻² の読み)、地球の dragCore(f・R_c/R)と受け手の有限球の 1 パラメータを、
//          近点周期+恒星月+交点周期の 3 量で同時に見る —— 許容で割った感度行列の特異値・複数の初期値からの解の広がり。
//
// ■ しないこと・言わないこと
//   ・本の宣言は変えない(🌦️🌔 の dragCore・W_bg —— 写しは器の中だけ)。エンジンの分母の式は変えない(枝 b の領分 —— 器の中の写しと宣言の W_bg で測る)。
//   ・閾値を作り替えない。届かない量は「この探索範囲では未達 —— 次の見直し」と書く。参照積分器の値で fitted にしない(アプリの物理ではない)。
//   ・「地球の核を同定した」「dragCore が一意に決まった」「天体半径の効果が大きいことを示した/示せない」(数なしで)「月を再現した」「現実を再現した」とは書かない。
//
// 実行(Node だけ):
//   node tests/exp-w303c-earthmoon.mjs                       → 正本 tests/out/earthmoon-w303c.json
//   W303C_PARTS=audit node tests/exp-w303c-earthmoon.mjs     → 段 audit だけ(他の段は既存の出力から残す)
//   W303C_OUT=<json> W303C_LONG=<公転数> で試走(正本を書かない)。走行は決定的(同じ html・同じ Node で同じ数 —— 壁時計の欄は volatilePaths)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as DC from './lib-w292c-dragcore.mjs';
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d","mercurySunInertial3d","plutoCharonInertialFit"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragState","HP.sim","HP.validatePreset","T","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","inertialDragNormApply","pnSource","relDragCoefficientOf","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w303c-earthmoon-1';
export const EXTRACTOR_VERSION = 'w303c-emx4-1';   // M1・M2・M3 は第298便c の runEmx3(w298c-emx3-1)と同じ式・M4(調和の回帰)と交点 Ω を足した
const clone = (x) => JSON.parse(JSON.stringify(x));
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const FIT_ID = 'earthMoonSunInertial3d';   // 🌦️
export const EMO_ID = 'earthMoonOnly3d';          // 🌔
export const DT = 0.016;
export const YEAR = 3155.76, DAY = 8.64;          // 本の時間単位(10⁴ s)で 1 ユリウス年・1 日
export const EV_EVERY = 64;                       // 接触要素の標本の間隔(步)
// 観測(B1 —— Chapront 2002・Simon 1994 の恒星系の周期。σ なし・一次資料での確認は未〔sigma_primary=unverified〕)。近点・交点の年の周期は係数からの換算
export const OBS_B1 = Object.freeze({
  sid: Object.freeze({ value: 27.321661554, unit: 'd', q: '恒星月' }),
  anom: Object.freeze({ value: 27.554549886, unit: 'd', q: '近点月' }),
  drac: Object.freeze({ value: 27.212220815, unit: 'd', q: '交点月' }),
  aps: Object.freeze({ value: 8.850391, unit: 'yr', q: '近地点の周期(恒星系・派生)' }),
  node: Object.freeze({ value: 18.599525, unit: 'yr', q: '交点の周期(恒星系・派生)' }),
  source: 'Chapront et al. 2002・Simon et al. 1994(恒星系の周期 —— σ なし・sigma_primary=unverified)',
});
// 照合許容の宣言(出典に σ が無い —— kind:"declared"。近点は 🌦️ の fitRecord と同じ 0.005 年・恒星月 0.00005 日・交点は近点と同じ 0.005 年)
export const TOL = Object.freeze({ aps: 0.005, sid: 0.00005, node: 0.005 });
export const LONG = Math.max(118, Number(process.env.W303C_LONG) || 1062);   // 長い窓の公転数(9 × 118)
export const SLIDE = 12;                                                       // 118 公転窓をずらす間隔(公転)
// 物理定数(本の単位 —— 🌦️ の physics と同じ G・c₀)
export const PHYS = Object.freeze({ G: 6.674, c0: 29979.2458, Msun: 1988.5, au: 1495.9787 });

/* ── 写し ── */
// 第303便の基点(9f92262 = public main 7598e8e・html の sha256 18a3e903a898)の 🌦️🌔 の physics と bodies の写し(器の中に固定 —— 後の便が宣言を
// 再フィットしても〔枝 a の semic の再フィットなど〕この正本は基点の宣言の監査として値を保つ。生きている html の宣言と同じかは liveSame に記録する)
export const PIN_BASE = Object.freeze({ commit: '9f92262', publicMain: '7598e8e', htmlSha12: '18a3e903a898', note: '第303便の基点の 🌦️ earthMoonSunInertial3d・🌔 earthMoonOnly3d の physics と bodies' });
export const PIN_DECL = Object.freeze({"earthMoonSunInertial3d":{"physics":{"coord":"3d","G":6.674,"D0":0.1,"kFrame":0,"q":3,"kRep":0,"muF":0,"gammaN":0,"kappaS":0,"kappaT":7.425826474101849e-9,"cLight":29979.2458,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"massFloor":0.000001,"geoPN":3,"lambdaPN":0,"pnAlpha":1.5,"radiusScale":1,"softening":0.01,"timeScale":1,"stepDt":0.655721,"dispMag":10,"stateCarry":"double","frameWeight":"share","relativeDrag":{"law":"inertial","Wbg":3.8560163495093223,"eps":0.01,"history":"positions","pairs":[[1,2]]}},"bodies":[{"type":"single","m":1988.5,"radius":6.96,"x":0,"y":0,"z":0,"vx":0,"vy":0,"vz":0,"spin":0.029031,"pinned":true,"pnSource":true},{"type":"single","m":0.0059724,"radius":0.06371,"x":1495.936602568754,"y":0,"z":0,"vx":0,"vy":2.977134946107245,"vz":-0.0001234441189683723,"spin":0.729212,"pinned":false,"pnSource":true,"dragCore":{"massFrac":0.325,"radius":0.0348}},{"type":"single","m":0.00007346,"radius":0.0174,"x":1499.508272768754,"y":0,"z":0,"vx":0,"vy":3.086884556617057,"vz":0.010036178275615391,"spin":0.026617,"pinned":false}]},"earthMoonOnly3d":{"physics":{"coord":"3d","G":6.674,"D0":0.1,"kFrame":0,"q":3,"kRep":0,"muF":0,"gammaN":0,"kappaS":0,"kappaT":7.425826474101849e-9,"cLight":29979.2458,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"massFloor":0.000001,"geoPN":3,"lambdaPN":0,"pnAlpha":1.5,"radiusScale":1,"softening":0.01,"timeScale":1,"stepDt":0.655721,"dispMag":10,"stateCarry":"double","frameWeight":"share","relativeDrag":{"law":"inertial","Wbg":3.8560163495093223,"eps":0.01,"history":"positions","pairs":[[0,1]]}},"bodies":[{"type":"single","m":0.0059724,"radius":0.06371,"x":-0.04339744765707408,"y":0,"z":0,"vx":0,"vy":-0.0013335086138367054,"vz":-0.0001234441189683723,"spin":0.729212,"pinned":false,"pnSource":true,"dragCore":{"massFrac":0.325,"radius":0.0348}},{"type":"single","m":0.00007346,"radius":0.0174,"x":3.528272752342897,"y":0,"z":0,"vx":0,"vy":0.10841610189597521,"vz":0.010036178275615391,"spin":0.026617,"pinned":false}]}});
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
/** 生きている html の宣言(physics・bodies)が器の固定の写しと同じか */
export function liveSame(HP) {
  return Object.fromEntries(Object.keys(PIN_DECL).map((id) => { const p = findPreset(HP, id);
    return [id, !!p && JSON.stringify(p.physics) === JSON.stringify(PIN_DECL[id].physics) && JSON.stringify(p.bodies) === JSON.stringify(PIN_DECL[id].bodies)]; }));
}
/** 🌦️(か 🌔)の写し —— 本の他の鍵は html から・physics と bodies は基点の固定の写し・fitRecord を外す。
 *  o: {id, drag:"decl"|"off"|<W_bg の数>, dragCore:{massFrac, radius}|null, rel:{rp,e0,inc}, bary:{e, phase}} */
export function copyEM(HP, o = {}) {
  const id = o.id || FIT_ID, q = clone(findPreset(HP, id));
  delete q.fitRecord;
  q.physics = clone(PIN_DECL[id].physics); q.bodies = clone(PIN_DECL[id].bodies);
  const rd = q.physics.relativeDrag;
  if (o.drag === 'off') { rd.Wbg = null; rd.enabled = false; }
  else if (typeof o.drag === 'number') { rd.Wbg = o.drag; delete rd.enabled; }
  const iE = id === EMO_ID ? 0 : 1;
  if (o.dragCore !== undefined) { if (o.dragCore === null) delete q.bodies[iE].dragCore; else q.bodies[iE].dragCore = clone(o.dragCore); }
  if (o.rel) q.bodies = relPlace(q.bodies, q.physics.G, o.rel);
  if (o.bary) q.bodies = baryEllipse(q.bodies, q.physics.G, o.bary);
  return q;
}
/** 地球–月の重心(位置・速度)を保ち、相対ベクトルを第298便c の規則(近地点 = +x・昇交点 = 近地点・傾斜 inc)で置き直す(初期配置の感度) */
export function relPlace(bodies, G, o) {
  const B = clone(bodies), E = B[1], M = B[2], mt = E.m + M.m, fM = M.m / mt, mu = G * mt;
  const bx = (E.m * E.x + M.m * M.x) / mt, by = (E.m * E.y + M.m * M.y) / mt, bz = (E.m * E.z + M.m * M.z) / mt;
  const bvx = (E.m * E.vx + M.m * M.vx) / mt, bvy = (E.m * E.vy + M.m * M.vy) / mt, bvz = (E.m * E.vz + M.m * M.vz) / mt;
  const vp = Math.sqrt(mu * (1 + o.e0) / o.rp), ci = Math.cos(o.inc * Math.PI / 180), si = Math.sin(o.inc * Math.PI / 180);
  const r = [o.rp, 0, 0], w = [0, vp * ci, vp * si];
  E.x = bx - fM * r[0]; E.y = by - fM * r[1]; E.z = bz - fM * r[2]; E.vx = bvx - fM * w[0]; E.vy = bvy - fM * w[1]; E.vz = bvz - fM * w[2];
  M.x = bx + (1 - fM) * r[0]; M.y = by + (1 - fM) * r[1]; M.z = bz + (1 - fM) * r[2]; M.vx = bvx + (1 - fM) * w[0]; M.vy = bvy + (1 - fM) * w[1]; M.vz = bvz + (1 - fM) * w[2];
  return B;
}
/** 宣言の bodies の地球→月の相対ベクトルから (rp, e0, inc) を読む(近地点に置いた宣言 —— relPlace の逆) */
export function relOf(bodies, G) {
  const E = bodies[1], M = bodies[2], mu = G * (E.m + M.m);
  const r = [M.x - E.x, M.y - E.y, (M.z || 0) - (E.z || 0)], w = [M.vx - E.vx, M.vy - E.vy, (M.vz || 0) - (E.vz || 0)];
  const rn = Math.hypot(...r), v2 = w[0] ** 2 + w[1] ** 2 + w[2] ** 2;
  return { rp: rn, e0: rn * v2 / mu - 1, inc: Math.atan2(w[2], w[1]) * 180 / Math.PI };
}
/** 地球–月の重心の公転を離心率 e′ の楕円へ(同じ長半径 —— 円の半径・太陽 pinned なので μ = G M☉。phase 0 = 近日点から・180 = 遠日点から)。相対ベクトルは変えない */
export function baryEllipse(bodies, G, o) {
  const B = clone(bodies), S = B[0], E = B[1], M = B[2], mt = E.m + M.m, fM = M.m / mt, fE = E.m / mt;
  const bx = (E.m * E.x + M.m * M.x) / mt, by = (E.m * E.y + M.m * M.y) / mt, bz = (E.m * E.z + M.m * M.z) / mt;
  const a = Math.hypot(bx - S.x, by - S.y, bz - (S.z || 0)), mu = G * S.m, e = o.e;
  const peri = (o.phase || 0) === 0, r0 = peri ? a * (1 - e) : a * (1 + e), v0 = Math.sqrt(mu * (peri ? (1 + e) : (1 - e)) / r0);
  const rel = ['x', 'y', 'z'].map((k) => (M[k] || 0) - (E[k] || 0)), wel = ['vx', 'vy', 'vz'].map((k) => (M[k] || 0) - (E[k] || 0));
  const nb = [S.x + r0 * (bx - S.x) / a, S.y + r0 * (by - S.y) / a, (S.z || 0) + r0 * (bz - (S.z || 0)) / a], vb = [0, v0, 0];
  ['x', 'y', 'z'].forEach((k, i) => { E[k] = nb[i] - fM * rel[i]; M[k] = nb[i] + fE * rel[i]; });
  ['vx', 'vy', 'vz'].forEach((k, i) => { E[k] = vb[i] - fM * wel[i]; M[k] = vb[i] + fE * wel[i]; });
  return B;
}

/* ── 事象の記録(第298便c の runEmx3 と同じ式・同じ順序 —— 交点 Ω・太陽の黄経 λ☉ を足した)── */
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export function inPlaneLongitude(v, h) {
  const hn = Math.hypot(h[0], h[1], h[2]), nx = -h[1], ny = h[0], nn = Math.hypot(nx, ny);
  if (!(hn > 0)) return Math.atan2(v[1], v[0]);
  if (nn < 1e-12 * hn) return Math.atan2(v[1], v[0]);
  const Om = Math.atan2(ny, nx), nu = [nx / nn, ny / nn, 0], hu = [h[0] / hn, h[1] / hn, h[2] / hn];
  return Om + Math.atan2(dot(cross(nu, v), hu), dot(nu, v));
}
/** p0 = t=0 の地球→月・sun0 = t=0 の地球→太陽の黄経(太陽の無い本は null)。push(k, d, sunLon) は k 步目の後の相対ベクトル d */
export function makeRec(mu, dt, p0, sun0) {
  const ev = { rev: [], revAux: [], peri: [], apo: [], samp: [] };   // samp: [t, ϖ(M2), e, a, inc, Ω, λ☉]・revAux: 通過の時の [λ☉, Ω]
  let angPrev = Math.atan2(p0[1], p0[0]), angAcc = 0, r1 = Math.hypot(...p0), r2 = r1, P1 = p0, P2 = p0, PP = p0, hPrev = null, sPrev = sun0, sPrev2 = sun0;
  const push = (k, d, sunLon) => {
    const rr = Math.hypot(...d), th = Math.atan2(d[1], d[0]);
    let dd = th - angPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += dd; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    const h = cross(P1, d);
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); ev.rev.push((k + fr) * dt); ev.revAux.push([sunLon, Math.atan2(h[0], -h[1])]); }
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const den = (r2 - 2 * r1 + rr), fr = (den !== 0) ? 0.5 * (r2 - rr) / den : 0;
      const hh = hPrev || h;
      let a1 = inPlaneLongitude(P2, hh), a2 = inPlaneLongitude(P1, hh), a3 = inPlaneLongitude(d, hh);
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (den !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * den) : r1;
      (r1 < r2 ? ev.peri : ev.apo).push({ t: (k + fr) * dt, ang, r: rv, sun: sPrev });
    }
    if (k >= 1 && (k % EV_EVERY) === 0) {
      const w = [(d[0] - PP[0]) / (2 * dt), (d[1] - PP[1]) / (2 * dt), (d[2] - PP[2]) / (2 * dt)], r = Math.hypot(...P1), hv = cross(P1, w);
      const vxh = cross(w, hv), e = [vxh[0] / mu - P1[0] / r, vxh[1] / mu - P1[1] / r, vxh[2] / mu - P1[2] / r];
      ev.samp.push([k * dt, inPlaneLongitude(e, hv), Math.hypot(...e), 1 / (2 / r - dot(w, w) / mu), Math.acos(Math.max(-1, Math.min(1, hv[2] / Math.hypot(...hv)))) * 180 / Math.PI,
        Math.atan2(hv[0], -hv[1]), sPrev]);
    }
    PP = P1; P2 = P1; P1 = d; r2 = r1; r1 = rr; hPrev = h; sPrev2 = sPrev; sPrev = sunLon;
  };
  return { ev, push };
}

/* ── アプリの三次元の步で走らせる(写しを受理器に通して build —— hook は build の後に器の中だけの差し替え)── */
export function runEngine(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) throw new Error('三次元の本ではない');
  const two = o.two === true, ci = two ? 0 : 1, oi = two ? 1 : 2, si = two ? -1 : 0;
  if (o.hook) o.hook(S);
  const dt = o.dt, revMax = o.revMax, mu = S.params.G * (S.m[ci] + S.m[oi]);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], S.z[oi] - S.z[ci]];
  const sunLon = () => (si < 0 ? null : Math.atan2(S.y[si] - S.y[ci], S.x[si] - S.x[ci]));
  const p0 = rel(), dx = p0, dv = [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], S.vz[oi] - S.vz[ci]];
  const inv = 2 / Math.hypot(...dx) - dot(dv, dv) / mu;
  if (!(inv > 0)) throw new Error('束縛していない初期状態');
  const maxSteps = Math.ceil(3 * revMax * 2 * Math.PI * Math.sqrt(1 / (inv * inv * inv) / mu) / dt);
  const rec = makeRec(mu, dt, p0, sunLon());
  let k = 0, stop = null;
  for (; ; k++) {
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    const t0 = S.t;
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (!(S.t > t0)) { stop = 'coord3dHalt'; break; }
    const d = rel();
    if (!Number.isFinite(d[0] + d[1] + d[2])) { stop = 'nan'; break; }
    rec.push(k, d, sunLon());
    if (rec.ev.rev.length >= revMax) { k++; stop = 'revMax'; break; }
  }
  const st = HP.inertialDragState ? HP.inertialDragState(S) : null;
  return { ev: rec.ev, steps: k, stop, complete: stop === 'revMax', nan: S.hasNaN(), warnings: v.warnings || [],
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax } : null };
}

/* ── 窓の抽出(純関数)── */
// 小さな最小二乗(正規方程式・ガウス消去 —— 列は 8 本まで)
export function lsq(X, y) {
  const p = X[0].length, A = Array.from({ length: p }, () => new Float64Array(p + 1));
  for (let i = 0; i < X.length; i++) { const xi = X[i]; for (let a = 0; a < p; a++) { A[a][p] += xi[a] * y[i]; for (let b = 0; b < p; b++) A[a][b] += xi[a] * xi[b]; } }
  for (let k = 0; k < p; k++) {
    let piv = k; for (let i = k + 1; i < p; i++) if (Math.abs(A[i][k]) > Math.abs(A[piv][k])) piv = i;
    const tmp = A[k]; A[k] = A[piv]; A[piv] = tmp;
    for (let i = k + 1; i < p; i++) { const f = A[i][k] / A[k][k]; for (let j = k; j <= p; j++) A[i][j] -= f * A[k][j]; }
  }
  const c = new Array(p).fill(0);
  for (let i = p - 1; i >= 0; i--) { let s = A[i][p]; for (let j = i + 1; j < p; j++) s -= A[i][j] * c[j]; c[i] = s / A[i][i]; }
  let ss = 0; for (let i = 0; i < X.length; i++) { let f = 0; for (let a = 0; a < p; a++) f += X[i][a] * c[a]; ss += (y[i] - f) ** 2; }
  return { c, rms: Math.sqrt(ss / X.length) };
}
/** M4: ϖ(t) = c₀ + c₁ t + Σ_{k=1..K} [a_k cos kφ + b_k sin kφ]・φ = 2(λ☉ − ϖ̄(t))(ϖ̄ は前の反復の直線 —— 3 回)。返す傾き c₁ と残差 */
export function harmonicRate(ts, ws, suns, K = 3) {
  const n = ts.length; if (n < 2 * K + 4) return null;
  const tm = ts.reduce((s, x) => s + x, 0) / n;
  let lf = L.linfit(ts, ws); if (!lf) return null;
  let c0 = ws.reduce((s, x) => s + x, 0) / n, c1 = lf.slope, out = null;
  for (let it = 0; it < 3; it++) {
    const X = ts.map((t, i) => { const ph = 2 * (suns[i] - (c0 + c1 * (t - tm))); const row = [1, t - tm]; for (let k = 1; k <= K; k++) row.push(Math.cos(k * ph), Math.sin(k * ph)); return row; });
    out = lsq(X, ws); c0 = out.c[0]; c1 = out.c[1];
  }
  return { slope: c1, rms: out.rms, amp1: Math.hypot(out.c[2], out.c[3]), c0, tm };
}
/** 偏りのない恒星月: 通過の時刻 t_k(黄経 0 の通過)を k の直線と、その時の角の正弦・余弦(中心差 ϖ・2ϖ・出差 2λ☉−ϖ・二均差 2λ☉・黄道への還元 2Ω)で回帰した傾き。
 *  ϖ̄ は同じ窓の M4(近点の通過の調和の回帰)の直線。固定方向の通過は中心差 2e sin(λ−ϖ) を拾うので、近点の一周より短い/ずれた窓の直線 fit は偏る(±0.008 日) */
export function sidHarmonic(ev, i0, N, h1) {
  const ts = ev.rev.slice(i0, i0 + N), ax = ev.revAux.slice(i0, i0 + N);
  if (ts.length < 16) return null;
  const sunU = L.unwrap(ax.map((z) => z[0])), nodeU = L.unwrap(ax.map((z) => z[1])), km = (ts.length - 1) / 2;
  const X = ts.map((t, i) => { const w = h1.c0 + h1.slope * (t - h1.tm), ls = sunU[i], om = nodeU[i];
    return [1, i - km, Math.cos(w), Math.sin(w), Math.cos(2 * w), Math.sin(2 * w), Math.cos(2 * ls - w), Math.sin(2 * ls - w), Math.cos(2 * ls), Math.sin(2 * ls), Math.cos(2 * om), Math.sin(2 * om)]; });
  const f = lsq(X, ts);
  return { P: f.c[1], rms: f.rms };
}
/** 窓 = 周回の番号 [i0, i0+N−1] の時刻(t0 = 前の周回の時刻か 0・t1 = 最後の周回の時刻)。U = {year, day} */
export function winOf(ev, i0, N) {
  if (ev.rev.length < i0 + N) return { i0, N, complete: false };
  const t0 = i0 ? ev.rev[i0 - 1] : 0, t1 = ev.rev[i0 + N - 1];
  const P = ev.peri.filter((z) => z.t > t0 && z.t <= t1), E = ev.samp.filter((z) => z[0] > t0 && z[0] <= t1);
  const T = (sl) => (sl && sl.slope) ? 2 * Math.PI / sl.slope / YEAR : null;
  const pw = L.unwrap(P.map((z) => z.ang)), ew = L.unwrap(E.map((z) => z[1])), nw = L.unwrap(E.map((z) => z[5]));
  const m1 = L.linfit(P.map((z) => z.t), pw), m2 = L.linfit(E.map((z) => z[0]), ew), nd = L.linfit(E.map((z) => z[0]), nw);
  const sunU = (arr) => L.unwrap(arr);
  const h1 = harmonicRate(P.map((z) => z.t), pw, sunU(P.map((z) => z.sun)));
  const sh = h1 ? sidHarmonic(ev, i0, N, h1) : null;
  const h2 = harmonicRate(E.map((z) => z[0]), ew, sunU(E.map((z) => z[6])));
  const pa = L.linfit(P.map((_, i) => i), P.map((z) => z.t)), revs = ev.rev.slice(i0, i0 + N), ps = L.linfit(revs.map((_, i) => i), revs);
  const mean = (j) => E.length ? E.reduce((s, z) => s + z[j], 0) / E.length : null;
  return { i0, N, complete: true, t0, t1, nPeri: P.length, nSamp: E.length,
    T1: T(m1), rms1: m1 ? m1.rms * 180 / Math.PI : null, T2: T(m2), rms2: m2 ? m2.rms * 180 / Math.PI : null,
    T4p: h1 ? T(h1) : null, rms4p: h1 ? h1.rms * 180 / Math.PI : null, amp4p: h1 ? h1.amp1 * 180 / Math.PI : null,
    T4s: h2 ? T(h2) : null, rms4s: h2 ? h2.rms * 180 / Math.PI : null,
    T3: (pa && ps) ? 1 / (1 / ps.slope - 1 / pa.slope) / YEAR : null,
    sid: ps ? ps.slope / DAY : null, anom: pa ? pa.slope / DAY : null, sidH: sh ? sh.P / DAY : null, sidHrms: sh ? sh.rms / DAY : null,
    node: nd ? -2 * Math.PI / nd.slope / YEAR : null,   // 交点の後退の周期(正の年)
    eMean: mean(2), aMean: mean(3), incMean: mean(4) };
}
/** 同じ走行の窓の束: t=0 からの窓・118 公転窓をずらした分布 */
export function windowsOf(ev, wins, slide) {
  const out = { fromZero: wins.filter((N) => ev.rev.length >= N).map((N) => winOf(ev, 0, N)) };
  if (slide) {
    const S = [];
    for (let i0 = 0; i0 + 118 <= ev.rev.length; i0 += slide) S.push(winOf(ev, i0, 118));
    const st = (k) => { const v = S.map((w) => w[k]).filter(Number.isFinite); const m = v.reduce((s, x) => s + x, 0) / v.length;
      return { n: v.length, mean: m, min: Math.min(...v), max: Math.max(...v), sd: Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length) }; };
    out.slide = { every: slide, n: S.length, T1: st('T1'), T2: st('T2'), T4p: st('T4p'), T4s: st('T4s'), sid: st('sid'), sidH: st('sidH'), node: st('node'), eMean: st('eMean'), incMean: st('incMean'),
      rows: S.map((w) => ({ i0: w.i0, T1: w.T1, T2: w.T2, T4p: w.T4p, T4s: w.T4s, sid: w.sid, sidH: w.sidH, node: w.node })) };
  }
  return out;
}

/* ── 器の中だけの参照積分器(アプリの物理ではない —— 太陽固定・地球と月・速度 Verlet・同じ記録器)──
   o: {bodies(🌦️ の宣言の並び), dt, revMax, eps(重力の軟化 —— 宣言は 0.01), planets:[{m, a, L0}](円軌道の規定運動・黄道面・太陽中心 —— 間接項つき),
       J2:{J2, R, pole:[x,y,z]}(地球の扁平 —— 月に働く力と地球への反作用), tide:{k2E, k2M, RE, RM}(潮汐の保存項 F = −3(B_E + B_M) r/r⁸ —— 遅延なし)} */
export const PLANETS = Object.freeze([   // 質量 [10²⁷ kg]・長半径 [au]・J2000 の平均黄経 L [°](JPL SSD の近似要素 Table 1 —— 地球–月の重心の L 100.46457166° を本の +x に置き直して使う)
  Object.freeze({ name: '金星', m: 0.0048675, a: 0.72333566, L: 181.97909950 }),
  Object.freeze({ name: '火星', m: 0.00064171, a: 1.52371034, L: -4.55343205 }),
  Object.freeze({ name: '木星', m: 1.89819, a: 5.20288700, L: 34.39644051 }),
  Object.freeze({ name: '土星', m: 0.56834, a: 9.53667594, L: 49.95424423 })]);
export const EMB_L = 100.46457166;
export const J2_EARTH = Object.freeze({ J2: 1.0826359e-3, R: 0.063781366, obliquityDeg: 23.4392911, note: 'IERS Conventions 2010(J₂ = 1.0826359×10⁻³・赤道半径 6378136.6 m)・黄道傾斜 23.4392911°(極は黄経 90° 側 —— 本の +x を春分点とみなした置き方・元期の宣言なし)' });
export const TIDE_EM = Object.freeze({ k2E: 0.3, k2M: 0.024, RE: 0.06371, RM: 0.0174, note: '🌜 earthMoonTide(第292便d・退役)の宣言の k₂(地球 0.3・月 0.024)—— 遅延なしの保存項だけ' });
export function refRun(o) {
  const G = PHYS.G, B = o.bodies, Ms = B[0].m, Me = B[1].m, Mm = B[2].m, e2 = (o.eps ?? 0.01) ** 2, dt = o.dt || DT, revMax = o.revMax;
  const x = [[B[1].x, B[1].y, B[1].z || 0], [B[2].x, B[2].y, B[2].z || 0]], v = [[B[1].vx, B[1].vy, B[1].vz || 0], [B[2].vx, B[2].vy, B[2].vz || 0]];
  const sx = [B[0].x || 0, B[0].y || 0, B[0].z || 0], m = [Me, Mm];
  const PL = (o.planets || []).map((p) => ({ m: p.m, R: p.a * PHYS.au, n: Math.sqrt(G * Ms / Math.pow(p.a * PHYS.au, 3)), L0: (p.L - EMB_L) * Math.PI / 180 }));
  const J = o.J2 ? (() => { const ob = o.J2.obliquityDeg * Math.PI / 180; return { k: 1.5 * o.J2.J2 * G * Me * o.J2.R * o.J2.R, p: [0, Math.sin(ob), Math.cos(ob)] }; })() : null;
  const TD = o.tide ? 3 * G * (o.tide.k2E * Mm * Mm * Math.pow(o.tide.RE, 5) + o.tide.k2M * Me * Me * Math.pow(o.tide.RM, 5)) : 0;
  const a = [[0, 0, 0], [0, 0, 0]];
  const acc = (t) => {
    for (let i = 0; i < 2; i++) { const dx = x[i][0] - sx[0], dy = x[i][1] - sx[1], dz = x[i][2] - sx[2], r2 = dx * dx + dy * dy + dz * dz + e2, f = -G * Ms / (r2 * Math.sqrt(r2)); a[i][0] = f * dx; a[i][1] = f * dy; a[i][2] = f * dz; }
    const d = [x[1][0] - x[0][0], x[1][1] - x[0][1], x[1][2] - x[0][2]], r2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2] + e2, f = G / (r2 * Math.sqrt(r2));
    for (let k = 0; k < 3; k++) { a[0][k] += f * m[1] * d[k]; a[1][k] -= f * m[0] * d[k]; }
    if (J) {   // 月に働く J₂ の加速度(地球中心)と地球への反作用
      const rr2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], rr = Math.sqrt(rr2), z = d[0] * J.p[0] + d[1] * J.p[1] + d[2] * J.p[2], c = -J.k / (rr2 * rr2 * rr), q = 1 - 5 * z * z / rr2;
      for (let k = 0; k < 3; k++) { const am = c * (q * d[k] + 2 * z * J.p[k]); a[1][k] += am; a[0][k] -= am * m[1] / m[0]; }
    }
    if (TD) {   // 潮汐の保存項(地球と月の膨らみ —— 引力・r⁻⁷)
      const rr2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], c = TD / (rr2 * rr2 * rr2 * rr2);
      for (let k = 0; k < 3; k++) { a[1][k] -= c * d[k] / m[1]; a[0][k] += c * d[k] / m[0]; }
    }
    for (const p of PL) {   // 規定運動の惑星(円・黄道面)—— 直接項と間接項(太陽の加速度を引く)
      const ph = p.L0 + p.n * t, px = sx[0] + p.R * Math.cos(ph), py = sx[1] + p.R * Math.sin(ph), pz = sx[2];
      const ind = G * p.m / (p.R * p.R * p.R);
      for (let i = 0; i < 2; i++) { const dx = px - x[i][0], dy = py - x[i][1], dz = pz - x[i][2], r2 = dx * dx + dy * dy + dz * dz, f = G * p.m / (r2 * Math.sqrt(r2));
        a[i][0] += f * dx - ind * (px - sx[0]); a[i][1] += f * dy - ind * (py - sx[1]); a[i][2] += f * dz - ind * (pz - sx[2]); }
    }
  };
  const rel = () => [x[1][0] - x[0][0], x[1][1] - x[0][1], x[1][2] - x[0][2]];
  const sunLon = () => Math.atan2(sx[1] - x[0][1], sx[0] - x[0][0]);
  const mu = G * (Me + Mm), rec = makeRec(mu, dt, rel(), sunLon());
  acc(0);
  let k = 0;
  for (; ; k++) {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) { v[i][j] += 0.5 * dt * a[i][j]; x[i][j] += dt * v[i][j]; }
    acc((k + 1) * dt);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) v[i][j] += 0.5 * dt * a[i][j];
    rec.push(k, rel(), sunLon());
    if (rec.ev.rev.length >= revMax) { k++; break; }
    if (k > 1e9) break;
  }
  return { ev: rec.ev, steps: k, complete: rec.ev.rev.length >= revMax };
}

/* ── 初期配置を長い窓の平均の要素に合わせる 3 元 Newton(近地点距離 rp・t=0 の接触離心率 e0・接触傾斜 inc → 偏りのない恒星月 sidH・平均離心率・平均傾斜)──
   run(rel) は {sidH, eMean, incMean, …} を返す(参照積分かエンジン)。目標は B1 の恒星月・第298便c と同じ平均離心率 0.0549・平均傾斜 5.145°(118 公転窓でなく長い窓) */
export const MEAN_TARGET = Object.freeze({ sid: OBS_B1.sid.value, e: 0.0549, inc: 5.145, note: '恒星月は B1(27.321661554 日)・平均離心率 0.0549(NASA NSSDC —— 第298便c と同じ)・平均傾斜 5.145°(NASA NSSDC)—— 長い窓の平均で満たす' });
const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
export function solve3(Jm, F) { const D = det3(Jm); return [0, 1, 2].map((c) => det3(Jm.map((row, i) => row.map((v, j) => (j === c ? F[i] : v)))) / D); }
export async function solveMeanIc(run, x0, o = {}) {
  const tg = o.target || MEAN_TARGET, hist = [];
  let x = x0.slice();
  for (let it = 0; it < (o.iter || 5); it++) {
    const dr = 0.001, de = 0.001, di = 0.02;
    const [w0, wa, wb, wc] = await Promise.all([run({ rp: x[0], e0: x[1], inc: x[2] }), run({ rp: x[0] + dr, e0: x[1], inc: x[2] }), run({ rp: x[0], e0: x[1] + de, inc: x[2] }), run({ rp: x[0], e0: x[1], inc: x[2] + di })]);
    const F = [w0.sidH - tg.sid, w0.eMean - tg.e, w0.incMean - tg.inc];
    hist.push({ it, rp: x[0], e0: x[1], inc0: x[2], sidH: w0.sidH, eMean: w0.eMean, incMean: w0.incMean, T4p: w0.T4p, T1: w0.T1, node: w0.node });
    if (Math.abs(F[0]) < 2e-6 && Math.abs(F[1]) < 2e-6 && Math.abs(F[2]) < 2e-4) return { rel: { rp: x[0], e0: x[1], inc: x[2] }, w: w0, hist, converged: true };
    const col = (w, h) => [(w.sidH - w0.sidH) / h, (w.eMean - w0.eMean) / h, (w.incMean - w0.incMean) / h];
    const ca = col(wa, dr), cb = col(wb, de), cc = col(wc, di);
    const dx = solve3([[ca[0], cb[0], cc[0]], [ca[1], cb[1], cc[1]], [ca[2], cb[2], cc[2]]], F);
    x = [x[0] - dx[0], x[1] - dx[1], x[2] - dx[2]];
  }
  const w = await run({ rp: x[0], e0: x[1], inc: x[2] });
  return { rel: { rp: x[0], e0: x[1], inc: x[2] }, w, hist, converged: false };
}

/* ── 天体半径の効き方の目録: 器の中の差し替え(本の宣言とエンジンの式は変えない)── */
export const DRAG_NR = 32;   // エンジンの DRAG_CORE_NR と同じ(源の球の求積の点数)
/** 一様球(半径 b)で受け手を平均した核: 球の中心が源から r(r > b)のとき ⟨f⟩ = (3/(4 b³ r)) ∫_{r−b}^{r+b} s f(s) (b² − (s−r)²) ds
 *  (r ≤ b は内側の殻 ∫_0^{b−r} 3 s² f(s) ds / b³ を足す)。f は源の核(点源 K_ε か構造核 ⟨K⟩)。Gauss–Legendre(n 点) */
export function ballAvg(f, r, b, n = 24) {
  const gl = DC.gaussLegendre01(n);
  const part = (a, c, w) => { let s = 0; const h = c - a; for (let k = 0; k < n; k++) { const x = a + h * gl.x[k]; s += gl.w[k] * w(x); } return s * h; };
  if (!(b > 0)) return f(r);
  if (r > b) return 3 / (4 * b * b * b * r) * part(r - b, r + b, (s) => s * f(s) * (b * b - (s - r) * (s - r)));
  const inner = (b - r > 0) ? 3 / (b * b * b) * part(0, b - r, (s) => s * s * f(s)) : 0;
  return inner + 3 / (4 * b * b * b * Math.max(r, 1e-300)) * part(b - r, b + r, (s) => s * f(s) * (b * b - (s - r) * (s - r)));
}
/** エンジンの表(S._dragCoreT[iSrc] —— Q = 核·(r²+R²)^{3/2} の ξ 格子)と同じ格子で、関数 g(r) の表を作る(器の中で差し替える表) */
export function tableLike(T0, g) {
  const T = Object.assign({}, T0, { Q: new Float64Array(T0.n) });
  for (let k = 0; k < T0.n; k++) { const rk = (k === T0.n - 1) ? T0.rMax : T0.R * Math.expm1(k * T0.dXi); T.Q[k] = g(rk) * DC.tableWeight(rk, T0.R); }
  T.w303c = true;
  return T;
}
/** (b) 受け手の有限球の写し: mode "moon" = 月の行だけ(源 地球の構造核 ⟨K⟩_E を月の一様球で平均)/ "sym" = 両方の行を二重平均(地球の分布 × 月の一様球 —— 対称)。
 *  hook(S) は build の後に呼ぶ(表の格子は地球の表のまま)。s = 受け手の半径の倍率(月の宣言半径 × s) */
export function rcvBallHook(mode, s = 1) {
  return (S) => {
    const T = S._dragCoreT;
    if (!T || !T[1]) throw new Error('地球の構造核の表が無い');
    const D = S.dragCoreD[1], eps = S.relDrag.eps, b = S.radOv[2] * s, R = D.R;
    const kE = (x) => DC.avgK(x, { massFrac: D.massFrac, radius: D.radius }, R, eps, DRAG_NR);
    const g = (r) => ballAvg(kE, r, b);
    T[1] = tableLike(T[1], g);
    if (mode === 'sym') T[2] = T[1];
    S.__w303cTableCheck = () => S._dragCoreT && S._dragCoreT[1] && S._dragCoreT[1].w303c === true && (mode !== 'sym' || (S._dragCoreT[2] && S._dragCoreT[2].w303c === true));
  };
}
/** (c)・太陽が背景側の瞬間の距離: 行 i の分母に足す慣性決定力 D_i [M/L³](定数の配列か S を受ける関数)。エンジンの関数 inertialDragNormApply を
 *  器の process の中で包む(行の対角 1+deg_i に c·D_i を足す —— c = 1/W_bg。u_i = Σ w (W_j − v_i)/(W_bg + D_i + Σ w) と同じ)。S.__w303cDen が無い本では素通り */
export function installDenWrap() {
  const G = globalThis;
  if (typeof G.inertialDragNormApply !== 'function') throw new Error('html に inertialDragNormApply が無い');
  if (G.inertialDragNormApply.__w303c) return { installed: true, already: true };
  const orig = G.inertialDragNormApply;
  const wrap = function (S, n, comp, om) {
    const out = orig(S, n, comp, om);
    const D = S.__w303cDen;
    if (D && comp) {
      const c = G.relDragCoefficientOf(S.relDrag), ex = (typeof D === 'function') ? D(S) : D, DG = S._rdDeg;
      if (c > 0) for (let i = 0; i < n; i++) if (ex[i] > 0) DG[i] += c * ex[i];
      S.__w303cDenN = (S.__w303cDenN || 0) + 1;
    }
    return out;
  };
  wrap.__w303c = true;
  G.inertialDragNormApply = wrap;
  return { installed: true, already: false };
}
/** λ の読み(枝 b の解析値): 普遍の長さ λ = 3 r_s☉ = 6GM☉/c² か、λ ∝ m(λ_i = 6 G m_i/c² —— 源と受け手ごと) */
export const LAMBDA_SUN3RS = 6 * PHYS.G * PHYS.Msun / (PHYS.c0 * PHYS.c0);
export function selfDen(bodies, reading) {
  return bodies.map((b) => {
    if (b.pinned || !(b.radius > 0)) return 0;
    const lam = reading === 'propM' ? 6 * PHYS.G * b.m / (PHYS.c0 * PHYS.c0) : LAMBDA_SUN3RS;
    return b.m / (lam * b.radius * b.radius);
  });
}
/** 太陽が背景側(r⁻² の読み): w_I = M☉/(λ d²)。λ = (6+2n)GM☉/c²(G_loc の族 n —— 枝 b の表)なので w_I = c²/((6+2n) G d²)(M☉ に依らない) */
export const wSunR2 = (n, d = PHYS.au) => (6 + 2 * n) > 0 ? PHYS.c0 * PHYS.c0 / ((6 + 2 * n) * PHYS.G * d * d) : Infinity;
/** 月の ξ = w/(W + D + w)(w = m⊕ 𝒦_E(r) —— 地球の構造核の ⟨K⟩・r は月の距離) */
export function xiMoon(W, r, o = {}) {
  const E = PIN_DECL[FIT_ID].bodies[1], eps = PIN_DECL[FIT_ID].physics.relativeDrag.eps;
  const k = o.point ? DC.kernelK(r, eps) : DC.avgK(r, { massFrac: E.dragCore.massFrac, radius: E.dragCore.radius }, E.radius, eps, DRAG_NR);
  const w = E.m * k;
  return { w, xi: w / (W + (o.D || 0) + w) };
}

/* ── 段 ── */
const winSummary = (w) => w && w.complete ? { N: w.N, i0: w.i0, T1: w.T1, T2: w.T2, T3: w.T3, T4p: w.T4p, T4s: w.T4s, rms1: w.rms1, rms4p: w.rms4p, amp4p: w.amp4p,
  sid: w.sid, sidH: w.sidH, anom: w.anom, node: w.node, eMean: w.eMean, incMean: w.incMean, aMean: w.aMean, nPeri: w.nPeri } : { N: w ? w.N : null, complete: false };
function engRun(HP, o, N, hook) {
  const t0 = Date.now();
  const R = runEngine(HP, copyEM(HP, o), { dt: o.dt || DT, revMax: N, hook });
  if (!R.complete || R.nan) throw new Error(`走行が窓を満たさない(${JSON.stringify(o).slice(0, 120)}: stop=${R.stop}・公転 ${R.ev.rev.length}/${N})`);
  R.wallSec = (Date.now() - t0) / 1000;
  return R;
}
const refOpt = (c) => ({ eps: c.eps ?? 0, planets: c.planets ? PLANETS : undefined, J2: c.J2 ? J2_EARTH : undefined, tide: c.tide ? TIDE_EM : undefined });

/** 段 audit: 基線の監査 */
export async function stageAudit(HP, log) {
  const t0 = Date.now(), out = { note: '🌦️ の写し(基点の宣言)・引きずり OFF と宣言の W_bg・器の中の参照積分(アプリの物理ではない)', long: LONG, slideEvery: SLIDE };
  const wins = [118, 354, 708, LONG].filter((n, i, a) => n <= LONG && a.indexOf(n) === i);
  // (ii) 窓と抽出器: エンジンの引きずり OFF と宣言(長い窓・ずらした 118 公転窓)
  const Roff = engRun(HP, { drag: 'off' }, LONG), Rdecl = engRun(HP, {}, LONG);
  const Woff = windowsOf(Roff.ev, wins, SLIDE), Wdecl = windowsOf(Rdecl.ev, wins, SLIDE);
  out.engine = { off: { fromZero: Woff.fromZero.map(winSummary), slide: Woff.slide, steps: Roff.steps, wallSec: Roff.wallSec },
    decl: { fromZero: Wdecl.fromZero.map(winSummary), slide: Wdecl.slide, steps: Rdecl.steps, wallSec: Rdecl.wallSec, drag: Rdecl.drag } };
  log(`audit: エンジン OFF 118 M1 ${Woff.fromZero[0].T1.toFixed(5)}・長窓 M4p ${Woff.fromZero[Woff.fromZero.length - 1].T4p.toFixed(5)} / 宣言 118 M1 ${Wdecl.fromZero[0].T1.toFixed(5)}・長窓 M4p ${Wdecl.fromZero[Wdecl.fromZero.length - 1].T4p.toFixed(5)}`);
  // 参照積分: エンジンとの一致(ε 0.01)と軟化(ε 0)—— 宣言の初期配置のまま
  const off = copyEM(HP, { drag: 'off' });
  const ref01 = refRun({ bodies: off.bodies, revMax: LONG, eps: 0.01 }), ref0 = refRun({ bodies: off.bodies, revMax: LONG, eps: 0 });
  const Wr01 = windowsOf(ref01.ev, wins, SLIDE), Wr0 = windowsOf(ref0.ev, wins, SLIDE);
  out.ref = { decl01: { fromZero: Wr01.fromZero.map(winSummary), slide: Wr01.slide }, decl0: { fromZero: Wr0.fromZero.map(winSummary), slide: Wr0.slide } };
  const last = (W) => W.fromZero[W.fromZero.length - 1];
  out.refGate = { T4p: Math.abs(last(Wr01).T4p / last(Woff).T4p - 1), T2: Math.abs(last(Wr01).T2 / last(Woff).T2 - 1), sidH: Math.abs(last(Wr01).sidH / last(Woff).sidH - 1),
    node: Math.abs(last(Wr01).node / last(Woff).node - 1), lim: 1e-4 };
  out.refGate.ok = out.refGate.T4p <= 1e-4 && out.refGate.T2 <= 1e-4 && out.refGate.sidH <= 1e-6 && out.refGate.node <= 1e-4;
  log(`audit: 参照(ε 0.01)とエンジンの長窓の相対差 T4p ${out.refGate.T4p.toExponential(2)}・T2 ${out.refGate.T2.toExponential(2)} / ε 0 の長窓 M4p ${last(Wr0).T4p.toFixed(5)}`);
  // (i)+(iii)+(iv) 初期配置を長い窓の平均の要素に合わせ直す(参照積分 —— 354 公転の窓で 3 元 Newton・結果は長い窓で測る)
  const rel0 = relOf(off.bodies, off.physics.G), NS = Math.min(354, LONG);
  const scen = [
    { key: 'mean0', label: 'ε 0・e′ 0(純ニュートンの三体・太陽固定・円)', eps: 0 },
    { key: 'mean01', label: 'ε 0.01(エンジンの軟化)・e′ 0', eps: 0.01 },
    { key: 'meanEp', label: 'ε 0・e′ 0.0167(近日点から)', eps: 0, bary: { e: 0.0167086, phase: 0 } },
    { key: 'meanEa', label: 'ε 0・e′ 0.0167(遠日点から)', eps: 0, bary: { e: 0.0167086, phase: 180 } },
    { key: 'meanJ2', label: 'ε 0・e′ 0・地球の J₂', eps: 0, J2: true },
    { key: 'meanAll', label: 'ε 0・e′(近日点から)・惑星 4・J₂・潮汐の保存項', eps: 0, bary: { e: 0.0167086, phase: 0 }, planets: true, J2: true, tide: true },
    { key: 'meanAllA', label: 'ε 0・e′(遠日点から)・惑星 4・J₂・潮汐の保存項', eps: 0, bary: { e: 0.0167086, phase: 180 }, planets: true, J2: true, tide: true }];
  out.mean = {};
  for (const c of scen) {
    const runR = async (rel) => { const q = copyEM(HP, { drag: 'off', rel, bary: c.bary }); return winOf(refRun(Object.assign({ bodies: q.bodies, revMax: NS }, refOpt(c))).ev, 0, NS); };
    const S = await solveMeanIc(runR, [rel0.rp, rel0.e0, rel0.inc]);
    const q = copyEM(HP, { drag: 'off', rel: S.rel, bary: c.bary }), R = refRun(Object.assign({ bodies: q.bodies, revMax: LONG }, refOpt(c)));
    const W = windowsOf(R.ev, wins, SLIDE);
    out.mean[c.key] = { label: c.label, rel: S.rel, converged: S.converged, iters: S.hist, fromZero: W.fromZero.map(winSummary), slide: W.slide };
    log(`audit: ${c.key} 収束 ${S.converged}・長窓 M4p ${last(W).T4p.toFixed(5)}・交点 ${last(W).node.toFixed(4)}・近点月 ${last(W).anom.toFixed(6)}`);
  }
  // 惑星だけ・潮汐だけ(mean0 の初期配置のまま —— 平均の要素の動きは記録)
  for (const [key, c] of [['plan0', { eps: 0, planets: true }], ['tide0', { eps: 0, tide: true }]]) {
    const q = copyEM(HP, { drag: 'off', rel: out.mean.mean0.rel }), R = refRun(Object.assign({ bodies: q.bodies, revMax: LONG }, refOpt(c)));
    out.mean[key] = { label: key === 'plan0' ? 'ε 0・惑星 4(mean0 の初期配置)' : 'ε 0・潮汐の保存項(mean0 の初期配置)', rel: out.mean.mean0.rel, fromZero: windowsOf(R.ev, wins, 0).fromZero.map(winSummary) };
  }
  // エンジンで mean01 の初期配置(ε 0.01 —— エンジンの軟化と同じ)を確かめる(門: 参照積分と相対 1e-4)
  const Rm = engRun(HP, { drag: 'off', rel: out.mean.mean01.rel }, LONG), Wm = windowsOf(Rm.ev, wins, SLIDE);
  out.engineMean01 = { rel: out.mean.mean01.rel, fromZero: Wm.fromZero.map(winSummary), slide: Wm.slide, wallSec: Rm.wallSec };
  const mr = out.mean.mean01.fromZero[out.mean.mean01.fromZero.length - 1], me = last(Wm);
  out.engineMean01.gate = { T4p: Math.abs(me.T4p / mr.T4p - 1), sidH: Math.abs(me.sidH / mr.sidH - 1), lim: 1e-4 };
  out.engineMean01.gate.ok = out.engineMean01.gate.T4p <= 1e-4 && out.engineMean01.gate.sidH <= 1e-6;
  // 初期配置の感度(mean0 の最後の Newton の 4 走行 —— 平均の要素あたりの近点周期・交点周期)
  out.sens = icSensitivity(out.mean.mean0.iters);
  out.decomp = decompOf(out);
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}
/** 平均の要素あたりの感度 —— 解き直しの各反復の (sidH, e, inc, T4p, node) の差分から最小二乗(反復の点の散らばりで張る) */
export function icSensitivity(hist) {
  if (!hist || hist.length < 2) return null;
  const h0 = hist[hist.length - 1];
  const rows = hist.slice(0, -1).map((h) => [h.sidH - h0.sidH, h.eMean - h0.eMean, h.incMean - h0.incMean]);
  const yT = hist.slice(0, -1).map((h) => h.T4p - h0.T4p);
  if (rows.length < 1) return null;
  // 反復は ≈ 恒星月の向きにだけ動く(Newton の 1 歩目)—— 恒星月あたりの近点周期の傾き(1 次元)を記録する
  const k = rows.findIndex((r) => Math.abs(r[0]) > 1e-4);
  if (k < 0) return null;
  return { dT4p_dSid: yT[k] / rows[k][0], dSid: rows[k][0], dE: rows[k][1], dInc: rows[k][2], note: 'Newton の 1 歩目(宣言の初期配置 → 長窓の平均の要素)の差分 —— 主に恒星月の向き(e・傾斜の差は同時に小さく動く)' };
}
/** 宣言の 118 公転窓の M1(引きずり OFF)と B1 の差の内訳(順に置き換えた差 —— 各項は前の項の後の状態からの差) */
export function decompOf(A) {
  const last = (x) => x.fromZero[x.fromZero.length - 1];
  const off118 = A.engine.off.fromZero[0].T1, offLong = last(A.engine.off).T4p, r0 = last(A.ref.decl0).T4p, m0 = last(A.mean.mean0).T4p;
  const ep = 0.5 * (last(A.mean.meanEp).T4p + last(A.mean.meanEa).T4p), j2 = last(A.mean.meanJ2).T4p - m0;
  const plan = last(A.mean.plan0).T4p - m0, tide = last(A.mean.tide0).T4p - m0;
  const all = 0.5 * (last(A.mean.meanAll).T4p + last(A.mean.meanAllA).T4p), obs = OBS_B1.aps.value;
  const rows = [
    { key: 'window', label: '118 公転窓の M1(t=0 から)→ 長い窓の M4(同じ走行)', d: off118 - offLong },
    { key: 'softening', label: '重力の軟化 ε 0.01 → 0(参照積分・同じ初期配置)', d: last(A.ref.decl01).T4p - r0 },
    { key: 'icMean', label: '初期配置の平均の要素(118 公転窓の直線 fit → 長窓・偏りのない恒星月)', d: r0 - m0 },
    { key: 'ePrime', label: '地球–月の重心の公転離心率 e′ 0 → 0.0167(平均の要素を合わせ直し・2 位相の平均)', d: m0 - ep },
    { key: 'J2', label: '地球の J₂(平均の要素を合わせ直し)', d: -j2 },
    { key: 'planets', label: '惑星 4 つ(規定運動・間接項つき)', d: -plan },
    { key: 'tide', label: '潮汐の保存項(🌜 の k₂)', d: -tide }];
  const sum = rows.reduce((s, r) => s + r.d, 0);
  return { off118, offLong, obs, total: off118 - obs, rows, sum, allNewton: all, residualAll: all - obs, residualSum: (off118 - sum) - obs,
    engineDragEffect118: A.engine.decl.fromZero[0].T1 - off118, engineDragEffectLong: last(A.engine.decl).T4p - offLong,
    node: { all: 0.5 * (last(A.mean.meanAll).node + last(A.mean.meanAllA).node), obs: OBS_B1.node.value },
    anom: { all: 0.5 * (last(A.mean.meanAll).anom + last(A.mean.meanAllA).anom), obs: OBS_B1.anom.value } };
}

/** 段 radius: 天体半径の効き方の目録(宣言の W_bg・118 公転窓・h —— 差は同じ刻みの差。点源と宣言は h/2 でも) */
export async function stageRadius(HP, log) {
  const t0 = Date.now(), N = 118, out = { note: '🌦️ の写し(基点の宣言の W_bg 3.856・初期配置)・118 公転窓・差は宣言(f 0.325・R_c 0.0348)からの同じ刻みの差', rows: [] };
  const E = PIN_DECL[FIT_ID].bodies[1], R = E.radius;
  const meas = (key, label, o, hook, path) => {
    let Sx = null;
    const Rr = engRun(HP, o, N, (S) => { Sx = S; if (hook) hook(S); });
    const w = winOf(Rr.ev, 0, N);
    const row = { key, path, label, T1: w.T1, T4p: w.T4p, sidH: w.sidH, node: w.node, anom: w.anom, aMean: w.aMean, uMax: Rr.drag ? Rr.drag.uMax : null,
      tableHeld: Sx.__w303cTableCheck ? Sx.__w303cTableCheck() : null, denSteps: Sx.__w303cDenN || 0, wallSec: Rr.wallSec, dt: o.dt || DT };
    log(`radius: ${key} T1 ${w.T1.toFixed(7)}・T4p ${w.T4p.toFixed(7)}`);
    return row;
  };
  const base = meas('decl', '宣言(地球 dragCore f 0.325・R_c 0.0348)', {}, null, 'base');
  out.rows.push(base);
  for (const f of [0.125, 0.325, 0.6]) for (const rc of [0.4 * R, E.dragCore.radius, 0.7 * R]) {
    if (f === 0.325 && rc === E.dragCore.radius) continue;
    out.rows.push(meas(`a-f${f}-rc${(rc / R).toFixed(3)}`, `(a) 源の有限球 f ${f}・R_c ${(rc / R).toFixed(3)}R`, { dragCore: { massFrac: f, radius: Number(rc.toPrecision(6)) } }, null, 'a'));
  }
  out.rows.push(meas('a-point', '(a) 点源(dragCore なし)', { dragCore: null }, null, 'a'));
  out.rows.push(meas('a-uniform', '(a) 一様球(f 1・R_c = R)', { dragCore: { massFrac: 1, radius: R } }, null, 'a'));
  out.rows.push(meas('b-moon', '(b) 受け手の有限球(月の行 —— 月の一様球で地球の ⟨K⟩ を平均)', {}, rcvBallHook('moon'), 'b'));
  out.rows.push(meas('b-sym', '(b) 受け手の有限球(対称 —— 両方の行を地球の分布 × 月の一様球の二重平均)', {}, rcvBallHook('sym'), 'b'));
  const decl = copyEM(HP, {});
  out.rows.push(meas('c-univ', '(c) 自己の慣性決定力 m_i/(λR_i²)・λ = 3r_s☉(8.86 km)', {}, (S) => { S.__w303cDen = selfDen(decl.bodies, 'univ'); }, 'c'));
  out.rows.push(meas('c-propM', '(c) 自己の慣性決定力・λ ∝ m(λ_i = 6Gm_i/c²)', {}, (S) => { S.__w303cDen = selfDen(decl.bodies, 'propM'); }, 'c'));
  out.rows.push(meas('off', '引きずり OFF(対照)', { drag: 'off' }, null, 'ref'));
  // h/2 の差(点源と宣言)
  const b2 = meas('decl-h2', '宣言(h/2)', { dt: DT / 2 }, null, 'h2'), p2 = meas('a-point-h2', '(a) 点源(h/2)', { dt: DT / 2, dragCore: null }, null, 'h2');
  out.h2 = { decl: b2, point: p2, dPointH: out.rows.find((r) => r.key === 'a-point').T1 - base.T1, dPointH2: p2.T1 - b2.T1 };
  for (const r of out.rows) { r.dT1 = r.T1 - base.T1; r.dT4p = r.T4p - base.T4p; r.dSidH = r.sidH - base.sidH; r.dNode = r.node - base.node; }
  // 解析の見積り(遠方の 1 次 —— 月の距離 a)
  const a = base.aMean || 3.8347, dc = E.dragCore, m2E = DC.radialMoments(dc, R).rho2, m2M = 0.6 * PIN_DECL[FIT_ID].bodies[2].radius ** 2;
  const sd = selfDen(decl.bodies, 'univ'), sp = selfDen(decl.bodies, 'propM'), W = PIN_DECL[FIT_ID].physics.relativeDrag.Wbg;
  out.analytic = { a, srcRho2OverA2: m2E / (a * a), rcvRho2OverA2: m2M / (a * a), uniformMinusPointInit: 0.6 * (R / 3.5716702) ** 2,
    selfDenUniv: { earth: sd[1], moon: sd[2], overW: sd[2] / W }, selfDenPropM: { earth: sp[1], moon: sp[2], overW: sp[2] / W }, lambdaSun3rs: LAMBDA_SUN3RS,
    xiDecl: xiMoon(W, a).xi, xiSelfUniv: xiMoon(W, a, { D: sd[2] }).xi, xiSelfPropM: xiMoon(W, a, { D: sp[2] }).xi,
    J2: { coef: 1.5 * J2_EARTH.J2 * (J2_EARTH.R / a) ** 2, note: '(3/2)J₂(R/a)² —— 近点・交点の率の n あたりの桁(幾何の係数 O(1) を掛ける)' },
    tide: { earth: 15 * TIDE_EM.k2E * (PIN_DECL[FIT_ID].bodies[2].m / E.m) * (TIDE_EM.RE / a) ** 5, moon: 15 * TIDE_EM.k2M * (E.m / PIN_DECL[FIT_ID].bodies[2].m) * (TIDE_EM.RM / a) ** 5,
      note: '近点の率の n あたり 15 k₂ (m_他/m_自)(R/a)⁵(保存項 —— 遅延は数えない)' } };
  // 初期距離での一様球/点源 −1 の確かめ(太陽→水星・地球→月・冥王星→カロン —— 純関数の求積と遠方の 1 次 0.6(R/r)²)
  out.uniformCheck = UNIFORM_PAIRS.map((z) => uniformCheckOf(HP, z));
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/** 初期距離での一様球/点源 −1(源 = 天体の宣言半径の一様球・受け手は点 —— 純関数の求積〔エンジンと同じ式〕と遠方の 1 次 0.6(R/r)²)。本の t=0 の距離・核の ε */
export const UNIFORM_PAIRS = Object.freeze([
  Object.freeze({ pair: '地球→月', id: 'earthMoonSunInertial3d', src: 1, rcv: 2 }),
  Object.freeze({ pair: '太陽→水星', id: 'mercurySunInertial3d', src: 0, rcv: 1 }),
  Object.freeze({ pair: '冥王星→カロン', id: 'plutoCharonInertialFit', src: 0, rcv: 1 })]);
export function uniformCheckOf(HP, z) {
  const p = z.id === FIT_ID ? { bodies: PIN_DECL[FIT_ID].bodies, physics: PIN_DECL[FIT_ID].physics } : findPreset(HP, z.id);
  if (!p) return Object.assign({}, z, { missing: true });
  const A = p.bodies[z.src], B = p.bodies[z.rcv], r = Math.hypot(B.x - A.x, B.y - A.y, (B.z || 0) - (A.z || 0));
  const rd = p.physics.relativeDrag || {}, eps = (rd.eps !== undefined) ? rd.eps : p.physics.softening;
  const k1 = DC.avgK(r, { massFrac: 1, radius: A.radius }, A.radius, eps, DRAG_NR), k0 = DC.kernelK(r, eps);
  return Object.assign({}, z, { R: A.radius, r, eps, rOverR: r / A.radius, exactMinus1: k1 / k0 - 1, first: 0.6 * (A.radius / r) ** 2 });
}

/** 段 sunbg: 太陽が背景側(r⁻² の読み)—— 🌦️ と 🌔 の写しの W_bg に M☉/(λ d²) を入れる */
export async function stageSunBg(HP, log) {
  const t0 = Date.now(), N = 118, out = { note: 'W_bg = M☉/(λ d²) = c²/((6+2n)G d²)・d = 1 au(公転半径)—— 宣言の W_bg の値として写しに入れた(本の宣言は変えない)', rows: [], emo: [] };
  const a = 3.8347, Wfit = PIN_DECL[FIT_ID].physics.relativeDrag.Wbg;
  const row = (key, label, o, hook, n) => {
    const Rr = engRun(HP, o, N, hook), w = winOf(Rr.ev, 0, N);
    const W = typeof o.drag === 'number' ? o.drag : (o.drag === 'off' ? Infinity : Wfit);
    const r = { key, label, n, W, xi: Number.isFinite(W) ? xiMoon(W, a).xi : 0, T1: w.T1, T4p: w.T4p, sidH: w.sidH, node: w.node, uMax: Rr.drag ? Rr.drag.uMax : null, wallSec: Rr.wallSec };
    log(`sunbg: ${key} W ${Number.isFinite(W) ? W.toFixed(4) : '∞'}・ξ ${r.xi.toExponential(3)}・T1 ${w.T1.toFixed(5)}`);
    return r;
  };
  out.rows.push(row('fit', '宣言のフィット値(🌦️ —— 太陽は粒子・引きずりの対に入らない)', {}, null, null));
  for (const n of [0, 1, -1, -2]) out.rows.push(row(`r2-n${n}`, `r⁻² の読み λ = ${6 + 2 * n}GM☉/c²(n = ${n > 0 ? '+' : ''}${n})`, { drag: wSunR2(n) }, null, n));
  // 瞬間の距離(受け手ごとの M☉/(λ r_i☉²) を行の分母に —— 器の中の包み・W_bg は宇宙と銀河の桁の代わりに 1e-6)
  const lam = LAMBDA_SUN3RS;
  out.rows.push(row('inst-n0', '瞬間の距離 M☉/(λ r_i☉²)・λ = 3r_s☉(器の中で行の分母に)', { drag: 1e-6 }, (S) => { S.__w303cDen = (Sx) => { const D = new Float64Array(Sx.n);
    for (let i = 1; i < Sx.n; i++) { const dx = Sx.x[i] - Sx.x[0], dy = Sx.y[i] - Sx.y[0], dz = Sx.z[i] - Sx.z[0]; D[i] = Sx.m[0] / (lam * (dx * dx + dy * dy + dz * dz)); } return D; }; }, 0));
  out.rows[out.rows.length - 1].W = wSunR2(0); out.rows[out.rows.length - 1].xi = xiMoon(wSunR2(0), a).xi;
  out.rows.push(row('off', '引きずり OFF', { drag: 'off' }, null, null));
  // 🌔(太陽なし —— 太陽は背景側。W_bg の r⁻² の読みは 🌦️ と同じ d = 1 au)
  for (const [key, label, o] of [['emo-fit', '🌔 宣言(🌦️ からの移送 3.856)', { id: EMO_ID }], ['emo-r2n0', '🌔 r⁻² の読み n=0', { id: EMO_ID, drag: wSunR2(0) }], ['emo-off', '🌔 引きずり OFF', { id: EMO_ID, drag: 'off' }]]) {
    const Rr = runEngine(HP, copyEM(HP, o), { dt: DT, revMax: N, two: true }), w = winOf(Rr.ev, 0, N);
    const W = typeof o.drag === 'number' ? o.drag : (o.drag === 'off' ? Infinity : Wfit);
    out.emo.push({ key, label, W, xi: Number.isFinite(W) ? xiMoon(W, a).xi : 0, T1: w.T1, T2: w.T2, sid: w.sid, uMax: Rr.drag ? Rr.drag.uMax : null });
    log(`sunbg: ${key} T1 ${w.T1.toFixed(2)}・恒星月 ${w.sid.toFixed(5)}`);
  }
  const fit = out.rows[0], off = out.rows.find((r) => r.key === 'off');
  for (const r of out.rows) { r.dT1 = r.T1 - fit.T1; r.dragShare = (r.T1 - off.T1) / (fit.T1 - off.T1); }
  out.planetsNote = { mercury: wSunR2(0, 0.387098 * PHYS.au), venus: wSunR2(0, 0.723332 * PHYS.au), mars: wSunR2(0, 1.523679 * PHYS.au), note: '同じ読みの W_bg は公転半径の 2 乗に反比例(🌦️ の値を他の本へ写さない —— 写せるのは λ)' };
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/** 段 ident: 多量の同定 —— パラメータ p = (f, R_c/R, s〔受け手の球の半径 = s × 月の宣言半径〕)・観測 y = (近点周期 M4・偏りのない恒星月・交点周期)の 118 公転窓。
 *  W_bg は固定(宣言のフィット値と r⁻² の読み n=0)。感度は中心差分(エンジンの走行)・許容で割り、パラメータの幅を掛けた行列の特異値。
 *  (A) B1 への箱つき Gauss–Newton(線形模型・減衰つき)を 8 つの初期値から —— 終点の 2 つをエンジンで測り直す(箱の隅では線形模型は合わない —— 実測の変化を記録)。
 *  (B) 安定: 宣言の点の観測に数値の誤差(h と h/2 の差)の大きさの雑音を符号 8 通りで載せた合成の観測から 4 つの初期値で p を取り戻した広がり */
export const IDENT = Object.freeze({ p0: Object.freeze([0.325, 0.0348 / 0.06371, 0.5]), dp: Object.freeze([0.1, 0.1, 0.5]),
  lo: Object.freeze([0.01, 0.05, 0]), hi: Object.freeze([1, 1, 2]), names: Object.freeze(['f', 'R_c/R', 's(受け手の球)']) });
function identRun(HP, W, p, N, dt) {
  const R = PIN_DECL[FIT_ID].bodies[1].radius;
  const o = { drag: W, dragCore: { massFrac: p[0], radius: Number((p[1] * R).toPrecision(8)) }, dt };
  const Rr = engRun(HP, o, N, p[2] > 0 ? rcvBallHook('moon', p[2]) : null);
  const w = winOf(Rr.ev, 0, N);
  return { y: [w.T4p, w.sidH, w.node], T1: w.T1, wallSec: Rr.wallSec };
}
/** 対称 3×3 の固有値(Jacobi)—— 特異値 = √(JᵀJ の固有値) */
export function symEig3(A) {
  const a = A.map((r) => r.slice());
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = 0; for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) off += a[i][j] * a[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < 3; p++) for (let q = p + 1; q < 3; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), sn = t * c;
      for (let k = 0; k < 3; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - sn * akq; a[k][q] = sn * akp + c * akq; }
      for (let k = 0; k < 3; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - sn * aqk; a[q][k] = sn * apk + c * aqk; }
    }
  }
  return [a[0][0], a[1][1], a[2][2]].sort((x, y) => y - x);
}
export function boxGN(J, y0, p0, obs, tol, lo, hi, start, iters = 60) {
  let p = start.slice();
  const res = (q) => [0, 1, 2].map((i) => (y0[i] + J[i].reduce((s, Jij, j) => s + Jij * (q[j] - p0[j]), 0) - obs[i]) / tol[i]);
  for (let it = 0; it < iters; it++) {
    const r = res(p), Jn = J.map((row, i) => row.map((v) => v / tol[i]));
    const JtJ = [0, 1, 2].map((a) => [0, 1, 2].map((b) => Jn.reduce((s, row) => s + row[a] * row[b], 0))), Jtr = [0, 1, 2].map((a) => Jn.reduce((s, row, i) => s + row[a] * r[i], 0));
    const lam = 1e-6 * Math.max(JtJ[0][0], JtJ[1][1], JtJ[2][2], 1e-300);
    const M = JtJ.map((row, i) => row.map((v, j) => v + (i === j ? lam : 0)));
    const d = solve3(M, Jtr.map((v) => -v));
    p = p.map((v, j) => Math.min(hi[j], Math.max(lo[j], v + (Number.isFinite(d[j]) ? d[j] : 0))));
  }
  const r = res(p);
  return { p, resid: r, norm: Math.hypot(...r) };
}
export async function stageIdent(HP, log) {
  const t0 = Date.now(), N = 118, out = { note: 'p = (f, R_c/R, s)・y = (近点周期 M4 [年], 偏りのない恒星月 [日], 交点周期 [年])・118 公転窓・許容 (0.005 年, 0.00005 日, 0.005 年)', cases: [] };
  const obs = [OBS_B1.aps.value, OBS_B1.sid.value, OBS_B1.node.value], tol = [TOL.aps, TOL.sid, TOL.node];
  const width = IDENT.hi.map((h, j) => h - IDENT.lo[j]);
  for (const [key, W] of [['fit', PIN_DECL[FIT_ID].physics.relativeDrag.Wbg], ['r2n0', wSunR2(0)]]) {
    const base = identRun(HP, W, IDENT.p0, N);
    const J = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], runs = [];
    for (let j = 0; j < 3; j++) {
      const pp = IDENT.p0.slice(), pm = IDENT.p0.slice(); pp[j] += IDENT.dp[j]; pm[j] -= IDENT.dp[j];
      const a = identRun(HP, W, pp, N), b = identRun(HP, W, pm, N);
      runs.push({ j, pp, pm, yp: a.y, ym: b.y });
      for (let i = 0; i < 3; i++) J[i][j] = (a.y[i] - b.y[i]) / (2 * IDENT.dp[j]);
    }
    const Jn = J.map((row, i) => row.map((v, j) => v * width[j] / tol[i]));   // 許容の何倍を箱の全幅で動かせるか
    const JtJ = [0, 1, 2].map((a) => [0, 1, 2].map((b) => Jn.reduce((s, row) => s + row[a] * row[b], 0)));
    const sv = symEig3(JtJ).map((x) => Math.sqrt(Math.max(0, x)));
    // (A) 実の観測(B1)へ: 8 つの初期値からの箱つき Gauss–Newton の終点(残差が許容の何倍残るか —— パラメータで動かせる量 σ₁ との比較)
    const starts = [[0.05, 0.1, 0], [0.9, 0.9, 2], [0.325, 0.546, 0], [0.6, 0.3, 1.5], [0.2, 0.8, 0.5], [0.95, 0.15, 1], [0.5, 0.5, 2], [0.1, 0.95, 1.8]];
    const fin = starts.map((st) => boxGN(J, base.y, IDENT.p0, obs, tol, IDENT.lo, IDENT.hi, st));
    // (B) 安定: 宣言の点 p0 の観測に数値の誤差(h と h/2 の差)の大きさの雑音を符号 8 通りで載せた合成の観測から、4 つの初期値で p を取り戻した広がり
    const half = identRun(HP, W, IDENT.p0, N, DT / 2), numErr = [0, 1, 2].map((i) => Math.abs(base.y[i] - half.y[i]));
    const signs = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]], st4 = [starts[0], starts[1], [0.325, 0.546, 0.5], starts[3]];
    const rec = [];
    for (const sg of signs) { const ys = [0, 1, 2].map((i) => base.y[i] + sg[i] * numErr[i]); for (const st of st4) rec.push(boxGN(J, base.y, IDENT.p0, ys, tol, IDENT.lo, IDENT.hi, st).p); }
    const spread = [0, 1, 2].map((j) => ({ min: Math.min(...rec.map((p) => p[j])), max: Math.max(...rec.map((p) => p[j])), width: Math.max(...rec.map((p) => p[j])) - Math.min(...rec.map((p) => p[j])), box: width[j] }));
    // 終点の 2 つをエンジンで測り直す(線形模型の確かめ)
    const check = [fin[0], fin[1]].map((z) => { const m = identRun(HP, W, z.p, N); const pred = [0, 1, 2].map((i) => base.y[i] + J[i].reduce((s, Jij, j) => s + Jij * (z.p[j] - IDENT.p0[j]), 0));
      return { p: z.p, measured: m.y, predicted: pred, relErrOfChange: [0, 1, 2].map((i) => { const dm = m.y[i] - base.y[i], dpd = pred[i] - base.y[i]; return Math.abs(dm) > 0 ? Math.abs(dpd - dm) / Math.abs(dm) : null; }) }; });
    out.cases.push({ key, W, base: base.y, baseH2: half.y, numErr, numErrTol: numErr.map((x, i) => x / tol[i]), baseResid: [0, 1, 2].map((i) => (base.y[i] - obs[i]) / tol[i]), J, Jn, sv,
      cond: sv[0] > 0 ? sv[0] / Math.max(sv[2], 1e-300) : null, runs,
      finals: fin.map((z, k) => ({ start: starts[k], p: z.p, resid: z.resid, norm: z.norm })), spread, recovered: rec, check });
    log(`ident: ${key} 特異値 ${sv.map((x) => x.toExponential(2)).join(' / ')}・残差の初め ${out.cases[out.cases.length - 1].baseResid.map((x) => x.toFixed(2)).join(' / ')}・取り戻しの広がり ${spread.map((z) => z.width.toFixed(2)).join(' / ')}`);
  }
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/* ── 本体 ── */
export const PARTS_ALL = Object.freeze(['audit', 'radius', 'sunbg', 'ident']);
export function gatesOf(J) {
  const g = {};
  if (J.audit) { g.refEngine = !!J.audit.refGate.ok; g.engineMean01 = !!J.audit.engineMean01.gate.ok; g.icSolved = Object.values(J.audit.mean).every((m) => m.converged !== false); }
  if (J.radius) { g.tablesHeld = J.radius.rows.filter((r) => r.path === 'b').every((r) => r.tableHeld === true); g.denWrapped = J.radius.rows.filter((r) => r.path === 'c').every((r) => r.denSteps > 0); }
  if (J.sunbg) g.sunbgDen = J.sunbg.rows.filter((r) => r.key.startsWith('inst')).length === 1;
  if (J.ident) g.identChecked = J.ident.cases.every((c) => c.check.length === 2);
  return g;
}
export async function main() {
  const OUT = process.env.W303C_OUT || path.join(ROOT, 'tests', 'out', 'earthmoon-w303c.json');
  const PARTS = String(process.env.W303C_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const wrap = installDenWrap();
  const prev = (PARTS.length < PARTS_ALL.length && fs.existsSync(OUT)) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const J = { meta: null, pin: Object.assign({}, PIN_BASE, { liveSame: liveSame(HP) }), obs: OBS_B1, tol: TOL, long: LONG, slideEvery: SLIDE,
    constants: { G: PHYS.G, c0: PHYS.c0, au: PHYS.au, lambdaSun3rs: LAMBDA_SUN3RS, planets: PLANETS, J2: J2_EARTH, tide: TIDE_EM, meanTarget: MEAN_TARGET }, denWrap: wrap };
  const stages = { audit: stageAudit, radius: stageRadius, sunbg: stageSunBg, ident: stageIdent };
  J.partsRun = [];
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); J[k] = await stages[k](HP, log); J.partsRun.push(k); }
    else if (prev[k]) J[k] = prev[k];
  }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[k]);
  J.notClaim = ['「地球の核を同定した」', '「dragCore が一意に決まった」', '「月を再現した」', '「現実を再現した」', '「天体半径の効果が大きいことを示した」(数なし)'];   // 書かない語(引用 —— 本文には書かない)
  const CODE = ['tests/exp-w303c-earthmoon.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第303便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, extractorVersion: EXTRACTOR_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第93報)③「密度が高く距離が近い地球と月の関係では、質点とはみなせず天体半径の影響が大きい」', reading: '統括の検証項目 R193(地球–月の天体半径と基線の監査)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

/* ── 表の行(PHYSICS〔第303便c〕—— QA docs.earthMoon303 が正本から作り直して逐語で照合する)── */
const F = L.fx, EX = L.ex;
const lastW = (x) => x.fromZero[x.fromZero.length - 1];
/** 表 1: 窓と抽出器(エンジン・引きずり OFF・基点の初期配置)—— t=0 からの窓と、118 公転窓を SLIDE 公転ずつずらした分布 */
export function windowRows(J) {
  const A = J.audit.engine.off, rows = A.fromZero.map((w) => `| [0, ${w.N}] | ${F(w.T1, 4)} | ${F(w.T2, 4)} | ${F(w.T3, 4)} | ${F(w.T4p, 4)} | ${F(w.T4s, 4)} | ${F(w.sid, 5)} | ${F(w.sidH, 5)} | ${F(w.node, 4)} |`);
  const s = A.slide, mm = (k, d) => `${F(s[k].min, d)}〜${F(s[k].max, d)}(sd ${EX(s[k].sd, 1)})`;
  rows.push(`| 118 公転窓 ×${s.n}(${s.every} 公転ずつ) | ${mm('T1', 4)} | ${mm('T2', 4)} | — | ${mm('T4p', 4)} | ${mm('T4s', 4)} | ${mm('sid', 5)} | ${mm('sidH', 5)} | ${mm('node', 4)} |`);
  return rows;
}
/** 表 2: 平均の要素に合わせ直した写し(参照積分・長窓)とエンジンの確かめ */
export function meanRows(J) {
  const M = J.audit.mean, keys = ['mean0', 'mean01', 'meanEp', 'meanEa', 'meanJ2', 'plan0', 'tide0', 'meanAll', 'meanAllA'];
  const row = (label, w) => `| ${label} | ${F(w.T4p, 5)} | ${F(w.T1, 5)} | ${F(w.node, 4)} | ${F(w.anom, 6)} | ${F(w.sidH, 6)} | ${F(w.eMean, 5)} | ${F(w.incMean, 4)} |`;
  const rows = keys.filter((k) => M[k]).map((k) => row(M[k].label, lastW(M[k])));
  rows.push(row('エンジン(アプリの步)・ε 0.01 の解き直しの初期配置', lastW(J.audit.engineMean01)));
  rows.push(`| 観測 B1(恒星系・σ なし) | ${F(J.obs.aps.value, 5)} | — | ${F(J.obs.node.value, 4)} | ${F(J.obs.anom.value, 6)} | ${F(J.obs.sid.value, 6)} | — | — |`);
  return rows;
}
/** 表 3: 内訳(引きずり OFF・118 公転窓 M1 と B1 の差) */
export function decompRows(J) {
  const D = J.audit.decomp, obs = D.obs;
  const rows = D.rows.map((r) => `| ${r.label} | ${r.d >= 0 ? '+' : ''}${F(r.d, 5)} | ${r.d >= 0 ? '+' : ''}${F(100 * r.d / obs, 3)}% |`);
  rows.push(`| 合計(各項の和) | ${D.sum >= 0 ? '+' : ''}${F(D.sum, 5)} | ${D.sum >= 0 ? '+' : ''}${F(100 * D.sum / obs, 3)}% |`);
  rows.push(`| 引きずり OFF の 118 公転窓 M1 − B1(${F(D.off118, 5)} − ${F(obs, 6)}) | +${F(D.total, 5)} | +${F(100 * D.total / obs, 3)}% |`);
  rows.push(`| 残り: 全部入りの純ニュートン(平均の要素を合わせ直し・2 位相の平均 ${F(D.allNewton, 5)})− B1 | ${D.residualAll >= 0 ? '+' : ''}${F(D.residualAll, 5)} | ${D.residualAll >= 0 ? '+' : ''}${F(100 * D.residualAll / obs, 3)}% |`);
  return rows;
}
/** 表 4: 天体半径の効き方の目録(宣言からの差 —— 118 公転窓・h) */
export function radiusRows(J) {
  const S = (yr) => F(yr * YEAR * 1e4, 1), Sd = (d) => F(d * DAY * 1e4, 4);
  return J.radius.rows.filter((r) => r.key !== 'decl').map((r) => `| ${r.label} | ${S(r.dT1)} | ${S(r.dT4p)} | ${Sd(r.dSidH)} | ${S(r.dNode)} | ${EX(r.uMax, 3)} |`);
}
/** 表 5: 初期距離での一様球/点源 −1 */
export function uniformRows(J) {
  return J.radius.uniformCheck.map((z) => `| ${z.pair}(${z.id}) | ${F(z.rOverR, 2)} | ${EX(z.exactMinus1, 3)} | ${EX(z.first, 3)} |`);
}
/** 表 6: 太陽が背景側(🌦️ と 🌔 の写し) */
export function sunbgRows(J) {
  const rows = J.sunbg.rows.map((r) => `| ${r.label} | ${Number.isFinite(r.W) ? F(r.W, 4) : '—(OFF)'} | ${EX(r.xi, 3)} | ${F(r.T1, 5)} | ${r.dT1 >= 0 ? '+' : ''}${F(r.dT1, 5)} | ${F(r.dragShare, 3)} |`);
  for (const r of J.sunbg.emo) rows.push(`| ${r.label} | ${Number.isFinite(r.W) ? F(r.W, 4) : '—(OFF)'} | ${EX(r.xi, 3)} | ${F(r.T1, 1)} | — | — |`);
  return rows;
}
/** 表 7: 多量の同定 */
export function identRows(J) {
  return J.ident.cases.map((c) => `| ${c.key === 'fit' ? '宣言のフィット値' : 'r⁻² の読み n=0'} ${F(c.W, 4)} | ${c.sv.map((x) => EX(x, 2)).join(' / ')} | ${c.baseResid.map((x) => F(x, 2)).join(' / ')} | ${Math.min(...c.finals.map((z) => z.norm)).toFixed(2)} | ${c.numErrTol.map((x) => EX(x, 1)).join(' / ')} | ${c.spread.map((z) => `${F(z.min, 2)}〜${F(z.max, 2)}`).join(' / ')} |`);
}

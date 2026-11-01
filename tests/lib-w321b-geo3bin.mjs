// 第321便b(原仮定者の予定(第123報)「geoPN=3の予定: 連星サンプル群のgeoPN=3版を用意する」・統括の検証項目 R267 —— 策定の段 S1):
// **連星の geoPN=3 版の S1 の lib**(器 tests/exp-w321b-geo3bin.mjs が使う —— 純関数と宣言の型だけ。html・エンジン・在位の本は変えない)。
//
// ■ 何を置くか
//   ① 在位の連星の数え上げの規則(宣言から —— html の calTargetOf と同じ式の写し + 原理の連星の名指しの表)と一覧の行の型。
//   ② 同じ入力の兄弟の写しの宣言の型(在位の本 → 列 g1_2d・g1_2dx・g1_3d・off・gl・tr・on・J —— 器の中で組む。内蔵の本は足さない)。
//      geo3 の慣性版の宣言は固定: K1(invSq.kernel "k1")+ 規則 rdRule "kappaM"(R_d = Y_k m)・kFrame 0・λ_PN 0・G_loc {law:"kappaC2"}・initMotion "observed"・
//      旧 W_bg の compose/gain・補正質量・旧 q を流用しない(kFrame 0 の本では q は走行に効かない —— 写しでも値は触らない)。
//   ③ 玩具(等質量 1:1・質量比 1:3 × 円 e = 0・離心 e = 0.5 —— 本の単位 G = 1・M = 1・a = 100・c = 10 で GM/(c²a) = 1e-4)の宣言。
//   ④ 解析の目安(二体の 1PN の近点の移動 q_1PN = 6πGM/(c²a(1−e²))・G_loc の一次の式 −4π μ_eff/(c²a(1−e²))〔受け手の対・μ_eff = G(m₁²+m₂²)/M〕・
//      有限質量比の一次の予測 (4/3)η q_1PN —— 〔第313便d〕〔第314便c〕の型)と、量ごとの差の表・刻みの帯・器の門。
//
// ■ 言わないこと: 写しの比較を連星の観測との照合と呼ばない・近点の移動の原因を述べない・法則の検証と呼ばない・h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)。周期だけの一致を系全体の合格に広げない
//   (量ごとの表)。写しの比較で、観測との照合ではない。
export const LIB_VERSION = 'w321b-geo3bin-lib-1';

const clone = (x) => JSON.parse(JSON.stringify(x));
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a) => { const n = nrm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
export const relDiff = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b));
/** K1 の核の定数 C_1 = 6((√3/2) ln(2+√3) − 1)(html の REL_DRAG_INVSQ_C1 と同じ閉じた式 —— Y_k = 10G_0/(C_1c_0²)) */
export const C1_CLOSED = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);

/* ───────── ① 在位の連星の数え上げ ───────── */
/** html の calTargetOf(内蔵の表示の分類 —— HP に口が無いので式の写し)。連星の 3 族と太陽系。 */
export function calTargetOf(p) {
  if (!p) return null;
  const id = String(p.id || '');
  if (/^psr/.test(id)) return 'ns-binary';
  if (/^gw150914/.test(id) || p.familyId === 'gw150914') return 'bh-binary';
  if (p.familyId === 'alphaCen' || p.familyId === 'sirius') return 'stellar-binary';
  return 'solar-system';
}
export const BIN_TARGETS = Object.freeze(['stellar-binary', 'ns-binary', 'bh-binary']);
/** 原理の連星(名指し —— 策定の比較の「原理の本」と、二つの single が互いを回る小さな原理の本)。理由つき。 */
export const PRINCIPLE_BINARIES = Object.freeze([
  Object.freeze({ id: 'binary', why: '周連星円盤(連星 + リング —— 原理の本の候補)' }),
  Object.freeze({ id: 'fig8', why: '8 の字の三体(原理の本の候補)' }),
  Object.freeze({ id: 'boxBinaryToy', why: '箱宇宙の連星(原理の本の候補)' }),
  Object.freeze({ id: 'spinDipoleBinary', why: '自転の双極子の二体(spinDipole の原理)' }),
  Object.freeze({ id: 'inertialDragPair', why: '慣性引きずりの二体(geoPN=0 の原理)' }),
  Object.freeze({ id: 'compactForceToy', why: 'コンパクト天体の力の二体(原理)' }),
  Object.freeze({ id: 'coord3dKeplerTilt', why: '三次元の傾けた二体(原理)' }),
  Object.freeze({ id: 'coord3dSpinPrecess', why: '三次元の自転の歳差の二体(原理)' })]);
/** 較正母集団の 4 値(SAMPLE_STATUS の calibration —— 合・量限定合・否・保留。hold-definition と out-of-scope は外) */
export const POP_VALUES = Object.freeze(['pass', 'pass-limited', 'fail', 'hold']);
/** 観測の自転のチャネル(読み取り専用 —— 状態の S.spin と別)の鍵 */
export const OBS_SPIN_KEYS = Object.freeze(['pulse', 'spinDipole']);
/** 三次元で拒否される天体の鍵(coord3dDenyOf の理由の型 —— 連星の本に現れるもの) */
export const BODY_DENY3D = Object.freeze(['pulse', 'spinDipole', 'dragQ', 'dragQTrans', 'core', 'layers', 'zonal']);
/** 連星の本の物理の鍵のうち二次元の経路だけのもの(kFrame = 0 では走行に効かない —— 写しで外す。器の列 g1_2dx がビット同一を確かめる) */
export const DROP_2D_KEYS = Object.freeze(['frameReaction', 'D0pull', 'coupleSink', 'cmGauge', 'framePrecision']);
/** 写しで落とす説明・判定の鍵(力学に効かない —— 写しは較正の本にしない) */
export const META_DROP = Object.freeze(['descStruct', 'en', 'claims', 'status', 'calibrationForecast', 'obsCard', 'failureFirst', 'abBody', 'parameterAudit', 'activeParams', 'fitRecord', 'massCalibration', 'notClaim', 'orbitObs']);

/* ───────── ② 兄弟の写しの宣言の型 ───────── */
export const K1_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions', initMotion: 'observed' });
export const OFF_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ kernel: 'k1', rdRule: 'kappaM' }), enabled: false, pairs: 'all', history: 'positions' });
export const GLOC = Object.freeze({ law: 'kappaC2' });
export const SPIN_ROT = Object.freeze({ rot: 'surfaceFlip' });
/** 列(写しの種類)。law は宣言から解決する法則の期待(geoModeOf(...).law = geoLawOfSim(S))・ge は実効番号の期待 */
export const COLS = Object.freeze({
  g1_2d: Object.freeze({ ja: 'geo1 参照(二次元 —— 在位の本そのもの)', coord: '2d', law: 'eih-kf0', ge: 1 }),
  g1_2dx: Object.freeze({ ja: 'geo1(二次元 —— 二次元の経路の鍵を外した写し)', coord: '2d', law: 'eih-kf0', ge: 1 }),
  g1_3d: Object.freeze({ ja: 'geo1(三次元 —— z = v_z = 0 の写し)', coord: '3d', law: 'eih-kf0', ge: 1 }),
  off: Object.freeze({ ja: 'geo3 OFF(引きずり enabled:false・G_loc なし —— ニュートンの二体)', coord: '3d', law: 'inertial-drag', ge: 0 }),
  gl: Object.freeze({ ja: 'geo3 G_loc だけ(引きずり OFF + G_loc {law:"kappaC2"})', coord: '3d', law: 'inertial-drag', ge: 0 }),
  tr: Object.freeze({ ja: 'geo3 並進だけ(K1 + rdRule "kappaM" + G_loc)', coord: '3d', law: 'inertial-drag', ge: 0 }),
  on: Object.freeze({ ja: 'geo3 回転 ON(並進 + spinDrag {rot:"surfaceFlip"} —— 両星の spin を使う)', coord: '3d', law: 'inertial-drag', ge: 0 }),
  J: Object.freeze({ ja: 'geo3 J(回転 ON + invSq.sourceMoment {kind:"J"} —— 源の f は天体ごと)', coord: '3d', law: 'inertial-drag', ge: 0 }) });
export const MAIN_COLS = Object.freeze(['g1_2d', 'g1_3d', 'off', 'gl', 'tr', 'on']);
/** 源の慣性係数 f(J の列 —— 太陽の値 0.07 を両星へ流用した模型の宣言。星の内部構造から導いた値ではない・観測ではない) */
export const F_J = Object.freeze({ value: 0.07, why: '太陽の I/(m R²) ≈ 0.07(文献の値 —— 本便は一次資料に当たっていない)を両星へ流用した模型の宣言(観測ではない)' });

function stripMeta(p, id) {
  const c = clone(p);
  for (const k of META_DROP) delete c[k];
  c.id = id; c.description = '第321便b の兄弟の写し(器の中だけ —— 内蔵の本ではない)'; c.sampleClass = 'principle';
  if (c.familyRole) c.familyRole = 'variant';
  return c;
}
/**
 * 在位の本(または玩具の geo1 の本)から列 col の写しを組む。rot: 3×3 の回転(三次元の列だけ —— 位置・速度・自転軸を回す)。
 * 写しの規則: 同じ G・c・質量・半径・初期の位置と速度・stepDt・軟化・stateCarry・timeRef・scaleExp(元期と観測の入力は本のまま)。
 */
export function siblingOf(base, col, o = {}) {
  if (col === 'g1_2d') return clone(base);
  const c = stripMeta(base, base.id + '__w321b-' + col + (o.tag ? '-' + o.tag : ''));
  const ph = c.physics;
  for (const k of DROP_2D_KEYS) delete ph[k];
  if (col === 'g1_2dx') return c;
  ph.coord = '3d';
  const R = o.rot || null, ap = (v) => R ? [R[0][0] * v[0] + R[0][1] * v[1] + R[0][2] * v[2], R[1][0] * v[0] + R[1][1] * v[1] + R[1][2] * v[2], R[2][0] * v[0] + R[2][1] * v[1] + R[2][2] * v[2]] : v;
  c.bodies = c.bodies.map((b) => {
    const q = Object.assign({}, b), r = ap([b.x, b.y, b.z || 0]), v = ap([b.vx, b.vy, b.vz || 0]);
    q.x = r[0]; q.y = r[1]; q.z = r[2]; q.vx = v[0]; q.vy = v[1]; q.vz = v[2];
    delete q.spinAxis;   // 二次元の表示の軸(psrDoubleAB の B など)は三次元へ写さない —— 軸は軌道の法線(二次元の本の約束)
    if (R) { const a = ap([0, 0, 1]); q.spinAxis = { enable: true, tiltDeg: Math.acos(Math.max(-1, Math.min(1, a[2]))) * 180 / Math.PI, azimuthDeg: Math.atan2(a[1], a[0]) * 180 / Math.PI, source: '第321便b の回した写し(軸は軌道の法線を同じ回転で回した —— 二次元の本の約束)' }; }
    return q;
  });
  if (col === 'g1_3d') { ph.geoPN = 1; ph.kFrame = 0; ph.lambdaPN = 1; return c; }
  ph.geoPN = 3; ph.kFrame = 0; ph.lambdaPN = 0;
  if (col === 'off') { ph.relativeDrag = clone(OFF_DRAG); delete ph.gLoc; return c; }
  if (col === 'gl') { ph.relativeDrag = clone(OFF_DRAG); ph.gLoc = clone(GLOC); return c; }
  ph.relativeDrag = clone(K1_DRAG); ph.gLoc = clone(GLOC);
  if (col === 'tr') return c;
  ph.relativeDrag.spinDrag = clone(SPIN_ROT);
  if (col === 'on') return c;
  if (col === 'J') { const f = {}; c.bodies.forEach((b, i) => { if (b.type === 'single' && !b.dragCore) f[String(i)] = (o.f && o.f[i] !== undefined) ? o.f[i] : F_J.value; }); ph.relativeDrag.invSq.sourceMoment = { kind: 'J', f }; return c; }
  throw new Error('未知の列 ' + col);
}

/* ───────── ③ 玩具 ───────── */
export const TOY_UNITS = Object.freeze({ G: 1, c: 10, a: 100, M: 1, radius: 1, softening: 0.05, spin: 0.05,
  note: '本の単位の玩具(G = 1・M = m₁ + m₂ = 1・a = 100・c = 10 —— GM/(c²a) = 1e-4。半径 1 は R_d = Y_k m〔0.0593 m/0.5〕より大きく、軟化 0.05 は ε/a = 5e-4。自転 0.05 は玩具の宣言〔赤道の速さ 0.05 —— 公転の速さ約 0.1 の半分〕)' });
export const TOYS = Object.freeze([
  Object.freeze({ key: 'eq-c', ja: '等質量・円', q: 1, e: 0 }),
  Object.freeze({ key: 'eq-e', ja: '等質量・離心 0.5', q: 1, e: 0.5 }),
  Object.freeze({ key: 'r3-c', ja: '質量比 1:3・円', q: 3, e: 0 }),
  Object.freeze({ key: 'r3-e', ja: '質量比 1:3・離心 0.5', q: 3, e: 0.5 })]);
/** 玩具の geo1 の本(二次元 —— 在位の恒星連星と同じ物理の宣言の型 —— 遠点整列・重心系・両星 free・pnSource)。tpl は在位の本(alphaCenAB)の physics。 */
export function toyBook(t, tpl) {
  const U = TOY_UNITS, m1 = U.M / (1 + t.q), m2 = U.M - m1, ra = U.a * (1 + t.e), va = Math.sqrt(U.G * U.M * (1 - t.e) / (U.a * (1 + t.e)));
  const P = 2 * Math.PI * Math.sqrt(U.a ** 3 / (U.G * U.M));
  const ph = Object.assign(clone(tpl), { G: U.G, cLight: U.c, kappaT: U.G / (U.c * U.c), softening: U.softening, stepDt: P / 360, timeScale: 1, geoPN: 1, kFrame: 0, lambdaPN: 1 });
  for (const k of DROP_2D_KEYS) delete ph[k];
  delete ph.dispMag;
  const body = (m, x, vy, s) => ({ type: 'single', m, radius: U.radius, x, y: 0, vx: 0, vy, spin: s, pinned: false, pnSource: true });
  return { id: 'w321bToy-' + t.key, name: '第321便b の玩具 ' + t.ja, emoji: '🧪', group: '運動と時空', sampleClass: 'principle', description: '第321便b の玩具(器の中だけ —— 内蔵の本ではない)',
    timeRef: { basis: 'orbit', pRef: P, pair: [0, 1], def: 'revolution', source: '玩具のケプラー周期 2π√(a³/(GM))', stepsPerOrbit: 360 },
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: ph,
    bodies: [body(m1, -(m2 / U.M) * ra, -(m2 / U.M) * va, U.spin), body(m2, (m1 / U.M) * ra, (m1 / U.M) * va, U.spin)],
    overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
}

/* ───────── ④ 解析の目安・回転・抽出 ───────── */
/** 初期の接触要素(相対の二体 —— 宣言の値から)。 */
export function osc0Of(p) {
  const b0 = p.bodies[0], b1 = p.bodies[1], G = p.physics.G, M = b0.m + b1.m, mu = G * M;
  const r = [b1.x - b0.x, b1.y - b0.y, (b1.z || 0) - (b0.z || 0)], v = [b1.vx - b0.vx, b1.vy - b0.vy, (b1.vz || 0) - (b0.vz || 0)];
  const rn = nrm(r), v2 = dot(v, v), a = 1 / (2 / rn - v2 / mu), h = nrm(cross(r, v)), e = Math.sqrt(Math.max(0, 1 - h * h / (mu * a)));
  return { a, e, mu, M, P: 2 * Math.PI * Math.sqrt(a ** 3 / mu), eta: b0.m * b1.m / (M * M), m: [b0.m, b1.m] };
}
/** 解析の目安(1 公転あたり rad)。q1PN = 6πμ/(c²a(1−e²))・qGL = −4πμ_eff/(c²a(1−e²))(受け手の対・n = 2)・pred = q1PN(1 + (4/3)η)(有限質量比の一次の予測) */
export function analyticOf(p) {
  const o = osc0Of(p), c = p.physics.cLight, G = p.physics.G, den = c * c * o.a * (1 - o.e * o.e);
  const muEff = G * (o.m[0] * o.m[0] + o.m[1] * o.m[1]) / o.M;
  const q1PN = 6 * Math.PI * o.mu / den, qGL = -4 * Math.PI * muEff / den;
  return { a: o.a, e: o.e, P: o.P, eta: o.eta, gmOverC2a: o.mu / (c * c * o.a), q1PN, qGL, qDragNeed: q1PN - qGL, pred43: q1PN * (1 + 4 * o.eta / 3), r43: q1PN * 4 * o.eta / 3 };
}
/** z-x-z の Euler 角 [Ω, i, ω](度)の回転行列 */
export function rotZXZ(deg) {
  const [O, I, W] = deg.map((d) => d * Math.PI / 180), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I), sI = Math.sin(I), cW = Math.cos(W), sW = Math.sin(W);
  return [[cO * cW - sO * sW * cI, -cO * sW - sO * cW * cI, sO * sI], [sO * cW + cO * sW * cI, -sO * sW + cO * cW * cI, -cO * sI], [sW * sI, cW * sI, cI]];
}
export const ROT_DEG = Object.freeze([40, 30, 50]);
export function unwrap(a) { const out = []; for (let i = 0; i < a.length; i++) { let x = a[i]; if (i) { let d = x - out[i - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; x = out[i - 1] + d; } out.push(x); } return out; }
export function linfit(x, y) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; }
  const slope = sxy / sxx; let ss = 0; for (let i = 0; i < n; i++) ss += (y[i] - my - slope * (x[i] - mx)) ** 2;
  return { slope, rms: Math.sqrt(ss / n), n };
}

/* ───────── 量ごとの差の表 ───────── */
/** 走行の行の索引 runs[sys][col][div] → 行。量: rate(apsNew の近点の率 [rad/公転])・rateB(検出器 B)・P(周回の平均の間隔)・e(apsNew の窓の中央の離心率) */
export function rowOf(R, sys, col, div) { return ((R[sys] || {})[col] || {})[div] || null; }
export const QTY = Object.freeze({ rate: '近点の率 [rad/公転](離心ベクトルの回帰 —— 主)', rateB: '近点の率 [rad/公転](検出器 B —— 副)', P: '公転周期(同方向の周回の平均の間隔 —— 在位の本の観測の比較と同じ定義)',
  Pa: '近点から近点の周期(検出器 B の近点の時刻 —— 円の軌道は無し)', e: '離心率(離心ベクトルの回帰の窓の中央)' });
export const QTY_KEYS = Object.freeze(['rate', 'rateB', 'P', 'Pa', 'e']);
/** 差の定義(a − b)と解析の目安の名 */
export const DIFFS = Object.freeze([
  Object.freeze({ key: 'pn', a: 'g1_3d', b: 'off', ja: 'geo1 の 1PN(g1_3d − off)', ana: 'q1PN' }),
  Object.freeze({ key: 'gl', a: 'gl', b: 'off', ja: 'G_loc の分(gl − off)', ana: 'qGL' }),
  Object.freeze({ key: 'drag', a: 'tr', b: 'gl', ja: '並進の引きずりの分(tr − gl)', ana: 'qDragNeed' }),
  Object.freeze({ key: 'geo3', a: 'tr', b: 'off', ja: 'geo3 慣性版の全体(tr − off)', ana: 'pred43' }),
  Object.freeze({ key: 'geo31', a: 'tr', b: 'g1_3d', ja: 'geo3 と geo1 の差(tr − g1_3d)', ana: 'r43' }),
  Object.freeze({ key: 'rot', a: 'on', b: 'tr', ja: '回転の引きずりの分(on − tr)', ana: null }),
  Object.freeze({ key: 'plane', a: 'g1_3d', b: 'g1_2d', ja: '面への退化(g1_3d − g1_2d)', ana: null })]);
export function diffOf(R, sys, d, div, qty) {
  const A = rowOf(R, sys, d.a, div), B = rowOf(R, sys, d.b, div);
  if (!A || !B || A.status !== 'run' || B.status !== 'run') return null;
  const x = A[qty], y = B[qty];
  if (!(Number.isFinite(x) && Number.isFinite(y))) return null;
  return x - y;
}
/** 系 × 差 × 量の表(刻み h・h/2・h/4 と、最も細かい 2 刻みの差 = 帯・解析の目安との比) */
export function diffTable(R, sysList, divs, anaOf) {
  const out = [];
  for (const sys of sysList) for (const d of DIFFS) for (const qty of QTY_KEYS) {
    const v = divs.map((dv) => diffOf(R, sys, d, dv, qty));
    if (v.every((z) => z === null)) continue;
    const fine = v[v.length - 1], prev = v.length >= 2 ? v[v.length - 2] : null;
    const ana = (qty === 'rate' || qty === 'rateB') && d.ana && anaOf[sys] ? anaOf[sys][d.ana] : null;
    out.push({ sys, diff: d.key, qty, byDiv: v, band: (fine !== null && prev !== null) ? Math.abs(fine - prev) : null,
      ana, ratio: (ana && fine !== null) ? fine / ana : null });
  }
  return out;
}
/** 床つきの指数表記(逐語照合の表に丸めの程度の数を書かない —— 床の下は「< 床」) */
export function fmtFloor(x, floor = 1e-15, d = 3) {
  if (x === null || x === undefined || !Number.isFinite(x)) return '—';
  if (x === 0) return '0';
  if (Math.abs(x) < floor) return '< ' + floor.toExponential(0);
  return x.toExponential(d);
}

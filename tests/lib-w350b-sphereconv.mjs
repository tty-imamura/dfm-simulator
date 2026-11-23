// 第350便b(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R419):
//   **「軸引きずりの回転は、引きずられる側の、源に近い点と遠い点の並進引きずりから、球体に換算して計算する」の 3 つの読み (C1)(C2)(C3) を、geoPN=3 の場(在位の形)で並べて数える純関数 —— 診断だけ**
//   (器 tests/exp-w350b-sphereconv.mjs と QA behavior.sphereconv350b・docs.sphereconv350b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・pairRot3・YK)・第347便h(rotOf・gaussLegendre・makeField の rigid)・第348便c(composeAll・precess・massOf・radiusOf・DECL.parentRows・LIT)・
//   第347便e(DECL.pairs・t1Table・geometry)・第312便a(Kball)・第337便c(YR)。
//
// ■ 3 つの読み(枝で同じ名 —— 共通ブリーフ):
//   (C1) 2 点の速度の差 ÷ 直径 をそのまま球の回転の率に: Ω = ê × [u(p + hê) − u(p − hê)] ÷ (2h)(= (P2) —— 有限の差と、〔第348便h〕の rot3('P2') の腕 ≪ 距離の極限〔自分の重みは腕の点の値〕)。
//   (C2) 球全体の剛体回転への平均: Ω = I⁻¹ ∫ρ r × [u(p + r) − u(p)] dV(一様な球 —— I = (2/3) ∫ρ r² dV の等方)。求積は 〔第347便h〕の gaussLegendre(半径・cos θ)と方位の等分。
//        比べる形: 直交 3 直径の 6 点の平均(各直径の 2 点の差分の和の ½)/中心の渦度の半分 (W)(一次の場では (C2) と同じ数)。
//        天体の表(腕 ≪ 距離)では、場の一次の展開の下で (C2) = ⟨½ ∇×u(自分の重みを半径 ρ の値に置いた形)⟩(重み 5ρ⁴ ÷ R⁵ の半径の平均)—— 「(C2) の球」の列。
//   (C3) 係数 k × (C1)(k = 1・2/5〔一様な球の慣性モーメントの係数〕・1/2 —— ノブ。構造の係数 c_R とは別のノブ)。
// ■ 言わないこと: 「球体に換算」の読みが決まった・2 点の差分が球の自転を表す、とは書かない(この場・この配置・この読みでは、の表)。観測の値は固定の比べる列(合わせない)。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w350b-sphereconv-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  readings: Object.freeze(['C1', 'C2', 'C3']),
  /** (C3) の係数のノブ(1・一様な球の慣性モーメントの係数 2/5・1/2)と天体の表の k */
  k3: Object.freeze([1, 0.4, 0.5]), k3Body: 0.4,
  /** (C2) の球の求積(半径・cos θ は GL・方位は等分) */
  quad: Object.freeze({ nr: 8, nth: 8, nph: 16 }),
  /** (C2) の球(天体の表 —— 自分の重みの半径の平均)の GL の点の数 */
  ballN: 8,
  /** 共通の点検の場(統括の数え直し —— 共通ブリーフ): 源 m 1・R 1・(0,0,0)・速度 (0,1,0)・自転 0/受け手 m 1・R 1・(4,0,0)・速度 0/背景 0・在位の形・腕 0.01 */
  common: Object.freeze({ src: Object.freeze({ m: 1, R: 1, p: Object.freeze([0, 0, 0]), v: Object.freeze([0, 1, 0]) }), recv: Object.freeze({ m: 1, R: 1, p: Object.freeze([4, 0, 0]) }), h: 0.01,
    p2x: -0.03061311, p6: -0.01530656, w: -0.01530612, tol: 5e-9, shift: Object.freeze([3, -2, 1]), rigid: Object.freeze([1, 2, 3]) }),
  /** T1 の次数の表(共通の点検の場で球の半径・腕を振る) */
  orderA: Object.freeze([0.4, 0.2, 0.1, 0.05, 0.025]),
  /** T3 回転する源(源 m 1・R 1・自転 s ẑ・速度 (0, v, 0)/受け手 m 1・R = 腕 h・緯度 0・45・90) */
  spinSrc: Object.freeze({ s: 0.3, v: 0.1, lat: Object.freeze([0, 45, 90]), d: Object.freeze([1.2, 2, 4, 10]), h: Object.freeze([0.1, 0.3, 0.5]) }),
  /** T1 の (C2) の球の照合(腕 ≪ 距離 —— 球の求積と半径の平均の差の次数) */
  ballCheck: Object.freeze({ a: 0.5, d: Object.freeze([20, 40, 80]), v: 0.1 }),
  mainCombo: G3.DECL.mainCombo,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', precArcsecPerYr: C.LIT.precArcsecPerYr, precRole: C.LIT.precRole, precSrc: C.LIT.precSrc });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const curl = (J) => [J[7] - J[5], J[2] - J[6], J[3] - J[1]];
const tiny = (v, s) => (Math.abs(v) <= 1e-12 * s ? 0 : v);
const tinyV = (v, s) => v.map((x) => tiny(x, s));
/** ê に直交する単位ベクトル 2 つ(ê が座標軸なら残りの座標軸 —— 共通の点検の「直交 3 直径」) */
function triad(e) {
  const a = unit(e);
  if (Math.abs(Math.abs(a[0]) - 1) < 1e-15) return [a, [0, 1, 0], [0, 0, 1]];
  if (Math.abs(Math.abs(a[1]) - 1) < 1e-15) return [a, [0, 0, 1], [1, 0, 0]];
  if (Math.abs(Math.abs(a[2]) - 1) < 1e-15) return [a, [1, 0, 0], [0, 1, 0]];
  const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)); return [a, e2, crs(a, e2)];
}
const GLQ = Object.freeze({ r: H.gaussLegendre(DECL.quad.nr), th: H.gaussLegendre(DECL.quad.nth), ball: H.gaussLegendre(DECL.ballN) });

/* ───────── 3 つの読み ───────── */
/** (C1) 有限の差: ê × [u(p + hê) − u(p − hê)] ÷ (2h)。mut: 'nodiam'(直径で割らない)・'sign'(符号) */
export function c1(field, p, h, e, { mut = null } = {}) {
  if (!(isVec(p) && fin(h) && h > 0 && isVec(e) && nrm(e) > 0)) throw new RangeError('c1: 点・腕 h > 0・ê');
  const a = unit(e), du = sub(field.u(add(p, scl(a, h))), field.u(sub(p, scl(a, h))));
  return scl(crs(a, du), (mut === 'sign' ? -1 : 1) / (mut === 'nodiam' ? 1 : 2 * h));
}
/** (C1) の腕 ≪ 距離の極限(〔第348便h〕の rot3('P2') —— 自分の重みは腕の点の値) */
export const c1Lim = (field, p, h, e) => G3.rot3('P2', field, p, { e: unit(e), Rb: h });
/** 直交 3 直径の 6 点の平均: ½ Σ_k (C1)_k。mut: 'nohalf'(½ を落とす) */
export function p6(field, p, h, e = [1, 0, 0], { mut = null } = {}) {
  let s = [0, 0, 0];
  for (const ek of triad(e)) s = add(s, c1(field, p, h, ek));
  return scl(s, mut === 'nohalf' ? 1 : 0.5);
}
/** (C2) 一様な球の剛体回転への平均: [∫ r × (u(p + r) − u(p)) dV] ÷ [(2/3) ∫ r² dV](半径 a) */
export function c2Quad(field, p, a, { mut = null } = {}) {
  if (!(isVec(p) && fin(a) && a > 0)) throw new RangeError('c2Quad: 点・半径 a > 0');
  const u0 = field.u(p), nph = DECL.quad.nph; let num = [0, 0, 0], den = 0;
  for (let i = 0; i < GLQ.r.x.length; i++) {
    const rr = 0.5 * a * (GLQ.r.x[i] + 1), wr = 0.5 * a * GLQ.r.w[i] * rr * rr;
    for (let j = 0; j < GLQ.th.x.length; j++) {
      const ct = GLQ.th.x[j], st = Math.sqrt(1 - ct * ct), wt = GLQ.th.w[j];
      for (let k = 0; k < nph; k++) {
        const ph = 2 * Math.PI * (k + 0.5) / nph, rp = [rr * st * Math.cos(ph), rr * st * Math.sin(ph), rr * ct], wgt = wr * wt * (2 * Math.PI / nph);
        num = add(num, scl(crs(rp, sub(field.u(add(p, rp)), u0)), wgt)); den += wgt * rr * rr;
      }
    }
  }
  return scl(num, 1 / ((mut === 'inorm' ? 1 : 2 / 3) * den));
}
/** (C2) の球(腕 ≪ 距離の一次の展開): ⟨½ ∇×u(自分の重みを半径 ρ の値)⟩_{5ρ⁴/R⁵}(半径 R の受け手 —— 場は J(x, {selfR}) を持つ makeField3) */
export function c2Ball(field, p, R) {
  if (!(isVec(p) && fin(R) && R > 0)) throw new RangeError('c2Ball: 点・半径 R > 0');
  let s = [0, 0, 0];
  for (let i = 0; i < GLQ.ball.x.length; i++) { const rho = 0.5 * R * (GLQ.ball.x[i] + 1), w = 0.5 * R * GLQ.ball.w[i] * 5 * Math.pow(rho, 4) / Math.pow(R, 5); s = add(s, scl(curl(field.J(p, { selfR: rho })), 0.5 * w)); }
  return s;
}
/** (C3) k × (C1) */
export function c3(k, om) { if (!(fin(k) && k > 0 && isVec(om))) throw new RangeError('c3: 係数 k > 0・回転'); return scl(om, k); }
/** 中心の渦度の半分 (W)(〔第348便h〕の rot3('W')) */
export const wHalf = (field, p, h) => G3.rot3('W', field, p, { Rb: h });

/** 自分の重みの置き方の閉じた形(K1 の内部 S(ρ) = m (3R² − ρ²) ÷ (2R³)・自分の重みが支配する極限): 腕の点 S(0)/S(R) = 3/2・
 *  球の平均 ⟨S(0)/S(ρ)⟩_{5ρ⁴/R⁵} = −50 + (45√3/2) ln(2 + √3)(∫₀¹ x⁴/(3 − x²) dx = −10/3 + (3√3/2) ln(2 + √3))・⟨(S(0)/S(ρ))²⟩ は GL の数 */
export function selfFactors() {
  const L = Math.log(2 + Math.sqrt(3)), closed1 = -50 + (45 * Math.sqrt(3) / 2) * L, g = H.gaussLegendre(24);
  let q1 = 0, q2 = 0; for (let i = 0; i < g.x.length; i++) { const x = 0.5 * (g.x[i] + 1), w = 0.5 * g.w[i] * 5 * Math.pow(x, 4), f = 3 / (3 - x * x); q1 += w * f; q2 += w * f * f; }
  return { surface: 1.5, ball1: closed1, ball1Quad: q1, ball2: q2 };
}

/* ───────── 共通の点検の場 ───────── */
export function commonField({ srcV = DECL.common.src.v, shift = [0, 0, 0], self = true, W0 = 0, spin = [0, 0, 0], recvV = [0, 0, 0] } = {}) {
  const S = DECL.common.src, R = DECL.common.recv;
  return G3.makeField3({ sources: [{ m: S.m, R: S.R, p: S.p.slice(), v: add(srcV, shift), spin }], recv: { m: R.m, R: R.R, p: R.p.slice(), v: add(recvV, shift) }, W0, self });
}
/** 試しの場(u と J だけ): 剛体回転 u = Ω₀ × r・純粋なずれ u = (y, x, 0) */
export const rigidField = (Om) => H.makeField({ rigid: { V: [0, 0, 0], Om } });
export const shearField = () => ({ u: (x) => [x[1], x[0], 0], J: () => [0, 1, 0, 1, 0, 0, 0, 0, 0] });
/** 1 つの場の全部の読み(点 p・腕 h・ê) */
export function readAll(field, p, h, e, { lim = true, quadA = h } = {}) {
  const C1 = c1(field, p, h, e), out = { C1, P6: p6(field, p, h, e), C2: c2Quad(field, p, quadA), W: wHalf(field, p, h) };
  if (lim) out.C1lim = c1Lim(field, p, h, e);
  out.C3 = Object.fromEntries(DECL.k3.map((k) => [k, c3(k, C1)]));
  return out;
}

/* ───────── T1 3 つの読みの式と次数(表 1)───────── */
export function orderRows() {
  const f = commonField(), p = DECL.common.recv.p.slice(), out = [];
  for (const a of DECL.orderA) {
    const W = wHalf(f, p, a), C2 = c2Quad(f, p, a), P6 = p6(f, p, a), C1 = c1(f, p, a, [1, 0, 0]), C1l = c1Lim(f, p, a, [1, 0, 0]);
    out.push({ a, aOverD: a / 4, C1z: C1[2], C1limz: C1l[2], P6z: P6[2], C2z: C2[2], Wz: W[2], dC2W: rel(C2, W), dP6W: rel(P6, W), dC1lim: rel(C1, C1l), c2OverC1: C2[2] / C1[2] });
  }
  for (let k = 1; k < out.length; k++) { const r = out[k], q = out[k - 1], L = Math.log(q.a / r.a);
    r.ordC2W = Math.log(q.dC2W / r.dC2W) / L; r.ordP6W = Math.log(q.dP6W / r.dP6W) / L; r.ordC1lim = Math.log(q.dC1lim / r.dC1lim) / L; }
  return out;
}
/** T1 の (C2) の球: 腕 ≪ 距離で、全部の場の球の求積(受け手の半径 a・自分の重みは位置で変わる)と半径の平均 c2Ball の差 */
export function ballCheckRows() {
  const B = DECL.ballCheck, out = [];
  for (const d of B.d) {
    const p = [d, 0, 0], f = G3.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, B.v, 0], spin: [0, 0, 0] }], recv: { m: 1, R: B.a, p, v: [0, 0, 0] } });
    const Q = c2Quad(f, p, B.a), Bl = c2Ball(f, p, B.a), W = wHalf(f, p, B.a), P2 = c1Lim(f, p, B.a, [1, 0, 0]);
    out.push({ d, aOverD: B.a / d, quadZ: Q[2], ballZ: Bl[2], wZ: W[2], c1limZ: P2[2], dQB: rel(Q, Bl), ballOverW: Bl[2] / W[2], c1limOverW: P2[2] / W[2] });
  }
  for (let k = 1; k < out.length; k++) out[k].ord = Math.log(out[k - 1].dQB / out[k].dQB) / Math.log(out[k].d / out[k - 1].d);
  return out;
}

/* ───────── T2 試し(表 2)───────── */
export function trialRows() {
  const Cm = DECL.common, p = Cm.recv.p.slice(), h = Cm.h, ex = [1, 0, 0], out = [];
  const scenes = [
    ['pass', '自転しない源の横の通過(源の速度 (0,1,0))', commonField()],
    ['passRev', '通過の向きを反転(源の速度 (0,−1,0))', commonField({ srcV: [0, -1, 0] })],
    ['center', '中心線の向きの通過(源の速度 (1,0,0))', commonField({ srcV: [1, 0, 0] })],
    ['rest', '相対静止(源の速度 0)', commonField({ srcV: [0, 0, 0] })],
    ['noSelf', '自分の重みも背景も 0(源 1 つ)', commonField({ self: false })],
    ['shift', '両方に同じ速度 (3,−2,1) を足す', commonField({ shift: Cm.shift.slice() })],
    ['rigid', '剛体回転 u = (1,2,3) × r', rigidField(Cm.rigid.slice())],
    ['shear', '純粋なずれ u = (y, x, 0)', shearField()],
  ];
  for (const [id, nm, f] of scenes) {
    const R = readAll(f, p, h, ex, { lim: id !== 'rigid' && id !== 'shear' }), sc = Math.max(nrm(R.C1), nrm(R.W), 1e-300) || 1;
    out.push({ id, name: nm, C1: tinyV(R.C1, sc), C1lim: R.C1lim ? tinyV(R.C1lim, sc) : null, P6: tinyV(R.P6, sc), C2: tinyV(R.C2, sc), W: tinyV(R.W, sc), C3: Object.fromEntries(Object.entries(R.C3).map(([k, v]) => [k, tinyV(v, sc)])) });
  }
  return out;
}

/* ───────── T3 回転する源(表 3)───────── */
/** 配置が適用の内か(腕の点と (C2) の球が源の外 —— 在位の球のモーメントは外部の式) */
const inside = (d, h) => d - h > 1;
export function spinSrcRows() {
  const S = DECL.spinSrc, out = [];
  for (const lat of S.lat) for (const d of S.d) for (const h of S.h) {
    const eh = [Math.cos(lat * D2R), 0, Math.sin(lat * D2R)], p = scl(eh, d);
    if (!inside(d, h)) { out.push({ lat, d, h, applicable: false }); continue; }
    const mk = (sg, vg) => G3.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, vg * S.v, 0], spin: [0, 0, sg * S.s] }], recv: { m: 1, R: h, p, v: [0, 0, 0] } });
    const rd = (f) => ({ C1: c1(f, p, h, eh), C1lim: c1Lim(f, p, h, eh), P6: p6(f, p, h, eh), C2: c2Quad(f, p, h), W: wHalf(f, p, h) });
    const A = rd(mk(1, 1)), Bs = rd(mk(-1, 1)), Bv = rd(mk(1, -1)), row = { lat, d, h, applicable: true };
    for (const k of Object.keys(A)) {
      const rotI = scl(sub(A[k], Bs[k]), 0.5), movI = scl(add(A[k], Bs[k]), 0.5), movII = scl(sub(A[k], Bv[k]), 0.5), rotII = scl(add(A[k], Bv[k]), 0.5);
      const sc = Math.max(nrm(A[k]), 1e-300);
      const rT = tinyV(rotI, sc), mT = tinyV(movI, sc);
      row[k] = { rot: rT, mov: mT, rotMag: nrm(rT), movMag: nrm(mT), rotZ: rT[2], split: Math.max(nrm(sub(rotI, rotII)), nrm(sub(movI, movII))) / sc };
    }
    // 比は分母が他の読みの 1e-9 倍以下なら書かない(1 本の直径がその直径まわりの回転を見ない配置 —— 極の (C1))
    const ratio = (a, b) => (b > 1e-9 * a ? a / b : null);
    row.c2OverC1rot = ratio(row.C2.rotMag, row.C1.rotMag); row.c2OverC1mov = ratio(row.C2.movMag, row.C1.movMag);
    row.c2OverWrot = ratio(row.C2.rotMag, row.W.rotMag); row.c2OverWmov = ratio(row.C2.movMag, row.W.movMag);
    out.push(row);
  }
  return out;
}

/* ───────── T4 天体 15 組(表 4)───────── */
/** (C2) の球の天体の口: 受け手の自分の重みを半径 ρ の値 S(ρ) に置く = 中心の値が S(ρ) になる半径 R′ = 3R³ ÷ (3R² − ρ²) の受け手(〔第348便h〕の pairRot3 の c_R の口に R′ ÷ R_obs) */
export const equivR = (R, rho) => 3 * R * R * R / (3 * R * R - rho * rho);
const ballCombo = Object.freeze({ id: 'K1ballC2', al: 1, self: 'cR', rot: 'M', note: '(C2) の球の口(在位の K1・源の回転は球のモーメント・受け手の半径だけを R′ に)' });
export function bodyRowsC(T1 = E.t1Table(), GEO = E.geometry()) {
  const combo = G3.DECL.combos.find((c) => c.id === DECL.mainCombo), out = [], parentRows = C.DECL.parentRows;
  for (const [id, src] of E.DECL.pairs) {
    const key = id + '|' + src, r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w), Rr = G3.YK * C.massOf(id), Ro = C.radiusOf(id);
    const R = G3.pairRot3(T1, GEO, id, src, combo);
    // (C2) の球: 半径の平均(GL)
    const acc = { G: [0, 0, 0], S: [0, 0, 0], P: R.P ? [0, 0, 0] : null };
    for (let i = 0; i < GLQ.ball.x.length; i++) {
      const rho = 0.5 * Rr * (GLQ.ball.x[i] + 1), w = 0.5 * Rr * GLQ.ball.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5), Rb = G3.pairRot3(T1, GEO, id, src, ballCombo, { cRv: equivR(Rr, rho) / Ro });
      acc.G = add(acc.G, scl(Rb.G.W, w)); acc.S = add(acc.S, scl(Rb.S.W, w)); if (acc.P) acc.P = add(acc.P, scl(Rb.P.W, w));
    }
    const vecs = { C1: { G: R.G.P2, S: R.S.P2, P: R.P ? R.P.P2 : null }, C2: { G: R.G.W, S: R.S.W, P: R.P ? R.P.W : null }, C2ball: acc,
      C3: { G: scl(R.G.P2, DECL.k3Body), S: scl(R.S.P2, DECL.k3Body), P: R.P ? scl(R.P.P2, DECL.k3Body) : null } };
    const o = (() => { const NM = { Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' }[id]; return NM && LIT.precArcsecPerYr[NM] !== undefined ? LIT.precArcsecPerYr[NM] : null; })();
    const row = { id, src, I: r2.I, omega: r2.omega, betaS: R.S.beta, betaG: R.G.beta, betaP: R.P ? R.P.beta : null, Ri: Rr, obsAsYr: o };
    for (const [rk, v] of Object.entries(vecs)) {
      const CC = C.composeAll(v.G, v.S, v.P), one = (c) => { const p = C.precess(c.e, c.mag, wAx, r2.I, r2.omega); return { magYr: c.mag * YR, deltaDeg: p.deltaDeg, precAsYr: p.precAsYr, ratio: o && p.precAsYr > 0 ? p.precAsYr / o : null }; };
      row[rk] = { SmagYr: nrm(v.S) * YR, GmagYr: nrm(v.G) * YR, PmagYr: v.P ? nrm(v.P) * YR : null, W1: one(CC.W1), W1P: CC.W1P ? one(CC.W1P) : null, vec: v };
    }
    const ratio = (a, b) => (nrm(b) > 0 ? nrm(a) / nrm(b) : null);
    row.c1OverC2S = ratio(vecs.C1.S, vecs.C2.S); row.ballOverC2S = ratio(vecs.C2ball.S, vecs.C2.S); row.c1OverC2G = ratio(vecs.C1.G, vecs.C2.G); row.ballOverC2G = ratio(vecs.C2ball.G, vecs.C2.G);
    row.dirC1C2 = angDeg(C.composeAll(vecs.C1.G, vecs.C1.S).W1.e, C.composeAll(vecs.C2.G, vecs.C2.S).W1.e);
    row.dirBallC2 = angDeg(C.composeAll(vecs.C2ball.G, vecs.C2ball.S).W1.e, C.composeAll(vecs.C2.G, vecs.C2.S).W1.e);
    out.push(row);
  }
  return out;
}

/* ───────── T5 零試験・変異・照合 ───────── */
export function pureScenes() {
  const Cm = DECL.common, p = Cm.recv.p.slice(), h = Cm.h, ex = [1, 0, 0], f = commonField();
  // ① 共通の点検の数(統括の数え直し)
  const C1 = c1(f, p, h, ex), P6 = p6(f, p, h, ex), W = wHalf(f, p, h), C2 = c2Quad(f, p, h);
  const common = { p2x: C1[2], p6: P6[2], w: W[2], c2: C2[2], perp: Math.max(Math.abs(C1[0]), Math.abs(C1[1]), Math.abs(P6[0]), Math.abs(P6[1]), Math.abs(W[0]), Math.abs(W[1])) };
  // ② 反転で符号反転・中心線と相対静止で 0・自分の重みも背景も 0 で 0・同じ速度を足して不変(6 点の平均と (W) と (C1) と (C2))
  const all = (fx) => [c1(fx, p, h, ex), p6(fx, p, h, ex), wHalf(fx, p, h), c2Quad(fx, p, h)];
  const base = all(f), rev = all(commonField({ srcV: [0, -1, 0] })), cen = all(commonField({ srcV: [1, 0, 0] })), rst = all(commonField({ srcV: [0, 0, 0] })), nos = all(commonField({ self: false })), shf = all(commonField({ shift: Cm.shift.slice() }));
  const sym = { flip: Math.max(...base.map((v, k) => rel(rev[k], scl(v, -1)))), center: Math.max(...cen.map(nrm)) / nrm(base[0]), rest: Math.max(...rst.map(nrm)), noSelf: Math.max(...nos.map(nrm)) / nrm(base[0]), shift: Math.max(...base.map((v, k) => rel(shf[k], v))) };
  // ③ 剛体回転と純粋なずれ
  const rg = rigidField(Cm.rigid.slice()), sh = shearField();
  const trial = { rigidC1x: c1(rg, p, h, ex), rigidP6: p6(rg, p, h, ex), rigidC2: c2Quad(rg, p, h), shearC1x: c1(sh, p, h, ex), shearP6: p6(sh, p, h, ex), shearC2: c2Quad(sh, p, h) };
  // ④ (C2) の求積と〔第347便h〕の (V)(一様な密度・2/3 の正規化 —— 同じ定義の別の求積)・(C3) は k 倍
  const V = H.rotOf('V', f, p, { Rb: h, vN: 0, vLambda: 1 }).Om, vsV = rel(C2, V), c3k = Math.max(...DECL.k3.map((k) => rel(c3(k, C1), scl(C1, k))));
  // ⑤ 自分の重みの閉じた形・(C2) の球の天体の口(中心の値が S(ρ) になる半径 R′)
  const SF = selfFactors(), eqR = Math.max(...[0.1, 0.5, 0.9].map((x) => Math.abs(D.Kball(1, 0, equivR(1, x)) - D.Kball(1, x, 1)) / D.Kball(1, x, 1)));
  // ⑥ 変異: 6 点の ½ を落とす・直径で割らない・符号・(C2) の正規化を落とす → 共通の点検の数から外れる
  const mut = { nohalf: p6(f, p, h, ex, { mut: 'nohalf' })[2], nodiam: c1(f, p, h, ex, { mut: 'nodiam' })[2], sign: c1(f, p, h, ex, { mut: 'sign' })[2], inorm: c2Quad(f, p, h, { mut: 'inorm' })[2] };
  // ⑦ 拒否
  const rej = [() => c1(f, p, 0, ex), () => c1(f, p, h, [0, 0, 0]), () => c2Quad(f, p, -1), () => c2Ball(f, p, 0), () => c3(0, C1), () => c3(1, [1, 2])].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { common, sym, trial, vsV, c3k, SF, eqR, mut, rejects: rej };
}
export function pureGates(S) {
  const Cm = DECL.common, ok = (x, w) => Math.abs(x - w) <= Cm.tol, ve = (a, b) => nrm(sub(a, b)) <= 1e-12 * Math.max(1, nrm(b));
  return {
    common: ok(S.common.p2x, Cm.p2x) && ok(S.common.p6, Cm.p6) && ok(S.common.w, Cm.w) && S.common.perp <= 1e-15,
    symmetry: S.sym.flip < 1e-12 && S.sym.center < 1e-12 && S.sym.rest === 0 && S.sym.noSelf < 1e-12 && S.sym.shift < 1e-12,
    rigid: ve(S.trial.rigidC1x, [0, 2, 3]) && ve(S.trial.rigidP6, [1, 2, 3]) && rel(S.trial.rigidC2, [1, 2, 3]) < 1e-12,
    shear: ve(S.trial.shearC1x, [0, 0, 1]) && nrm(S.trial.shearP6) <= 1e-12 && nrm(S.trial.shearC2) <= 1e-12,
    quadVsV: S.vsV < 1e-4 && S.c3k < 1e-15,
    selfClosed: Math.abs(S.SF.ball1 - S.SF.ball1Quad) < 1e-12 && S.SF.ball1 > 1 && S.SF.ball1 < S.SF.surface && S.eqR < 1e-12,
    mutants: !ok(S.mut.nohalf, Cm.p6) && !ok(S.mut.nodiam, Cm.p2x) && !ok(S.mut.sign, Cm.p2x) && Math.abs(S.mut.inorm - S.common.c2) > 1e-3,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

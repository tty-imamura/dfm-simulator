// 第329便b(原仮定者の回答(2026-11-07 —— AN568 = A・AN569 = A・AN570 = A の限定 + B の限定)・統括の検証項目 R305): **場の契約の版 2(回転する枠)の純関数**
//   (器 tests/exp-w329b-galrot.mjs と QA lint.galRot329b・behavior.galRot329b が読む —— html を読まない・状態を持たない・
//   第321便c の場の API〔tests/lib-w321c-galfield.mjs〕と第328便a の契約〔tests/lib-w328a-fieldcontract.mjs〕の本文は変えない —— 包むだけ)。
//
// ■ 何をするか(宣言 —— 枠の取り換えの型。新しい力・新しい場を足す操作ではない)
//   枠(版 2): 原点 o [kpc]・回転の行列 Q(列が枠の軸 —— 銀河中心系の成分)・原点の速さ v_o [m/s]・Ω_frame [rad/s](枠の第 3 軸 ĝ′ 回り)・単位(kpc・m/s・s)。
//     点の取り換え: x′ = Qᵀ(x − o)・v′ = Qᵀ(v − v_o) − Ω_frame ĝ′ × x′(逆は x = Q x′ + o・v = Q(v′ + Ω_frame ĝ′ × x′) + v_o)。
//     **欠測は null**: 宣言した枠の原点・行列・原点の速さ・Ω_frame・単位のどれかが無ければ frame.complete = false —— 取り換えの関数は拒否(0 で埋めない)。
//     宣言の無い枠は版 1 と同じ回転しない銀河中心系(原点 0・Q = I・v_o = 0・Ω_frame = 0 —— 宣言の値)。
//   場の値の取り換え(sampleInFrame): 場の API の u は源の流れ ∫ρv/|x − x″| の場(速さの基準 = 源の流れの銀河中心系)。枠を回すと源の速さは v − v_o − Ω_frame â × (x″ − o) になるので
//     u′ = Qᵀ[u − β v_o − Ω_frame â × (W − β o)](β = (10G_0/c_0²)∫ρ/|x − x″|・W = (10G_0/c_0²)∫ρ x″/|x − x″| —— 引いた分は重みつきの積分で、Ω_frame â × x β(x) とは一般に違う)。
//     â(= Q の第 3 列)が ĝ と平行のときだけ作る(軸対称の W の動径の成分 W_R だけが効く —— 平行でない枠の場は版 2 の外で null)。∇u′ と半渦度は Ω_frame = 0 かつ v_o = 0 のときだけ
//     (軸と原点の取り換え —— Qᵀ G Q・Qᵀ ω½)。他は null(0 で埋めない)。**引いた速さを引きずりへもう一度足さない**(受け手の速さも同じ取り換えで —— 同じ点の相対の速さは Qᵀ で回るだけ)。
//   契約(版 CONTRACT2_VERSION): 版 1 の鍵に rates(Ω_frame・Ω_mat・Ω_field・Ω_p を別の欄 —— 単位 rad/s)と labels(既存の回転の理論のラベルの口 —— AN570 の B の限定・宣言が無ければ null)を足し、
//     frame を版 2 の形にする。**Ω_arm は受け手の側の入力**(AN569 —— 契約に入れない・滑りの関数の引数)。toV1(c2) は Ω_frame = 0 で恒等の枠のときだけ版 1 の形を返す(版 1 の意味を黙って変えない)。
//   opt-in: sampleWithContract2(位置, 時刻, 源, opts) は opts.contract2 が無ければ第328便a の sampleWithContract(さらに契約が無ければ第321便c の sample)をそのまま返す(ビット同一)。
// ■ 言わないこと: 枠の取り換えを新しい力と書かない・Ω_frame を引きずりへ足し戻さない・Ω_frame と Ω_mat・Ω_arm・Ω_field・Ω_p を同じ量と書かない・場の API の半渦度を Ω_field に写さない・
//   受け手の動きの項(−½∇β × V_ref)は今までどおり数えない(AN489 —— 本 lib は変えない)。
import * as F from './lib-w321c-galfield.mjs';
import * as C1 from './lib-w328a-fieldcontract.mjs';
import * as GR from './lib-w329b-galrot.mjs';
import { integrate, ringQ, ringP, sigOf, hOf, vOf, rhoBulge, COEF } from './lib-w320c-nbcompose.mjs';

export const LIB_VERSION = 'w329b-fieldcontract2-lib-1';
export const CONTRACT2_VERSION = 'w329b-fieldcontract-2';
export const BASE_CONTRACT_VERSION = C1.CONTRACT_VERSION;
export const CONTRACT2_KEYS = Object.freeze(['version', 'baseVersion', 'frame', 'rates', 'omegaField', 'convergence', 'sources', 'transfer', 'ledgerRefs', 'labels']);
export const FRAME2_KEYS = Object.freeze(['id', 'origin', 'originKpc', 'Q', 'axis', 'velocityRef', 'originVelocity', 'timeUnit', 'lengthUnit', 'velocityUnit', 'omegaFrame', 'complete']);
export const RATES_KEYS = Object.freeze(['omegaFrame', 'omegaMat', 'omegaField', 'omegaP', 'unit', 'ref', 'note']);
export const DECL = Object.freeze({
  units: Object.freeze({ length: 'kpc', velocity: 'm/s', time: 's' }),
  orthoTol: 1e-12,
  /** W_R と β の求積の許容(相対) */
  quadRel: 1e-10,
  ratesRef: '遠方の枠(回転しない銀河中心系)で宣言した値 —— 回す枠の中の値は ratesInFrame(各々から Ω_frame を引く)',
  armNote: 'Ω_arm は受け手の側の入力(契約に入れない —— 滑りの関数の引数・AN569)',
});

const KPC = GR.KPC_M;
const isFin = (x) => typeof x === 'number' && Number.isFinite(x);
const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const vec3 = (a) => Array.isArray(a) && a.length === 3 && a.every(isFin);
const mat3 = (m) => Array.isArray(m) && m.length === 3 && m.every((r) => vec3(r));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** Q x(Q[i][j] —— 列 j が枠の第 j 軸の銀河中心系の成分) */
export const mulQ = (Q, x) => [0, 1, 2].map((i) => Q[i][0] * x[0] + Q[i][1] * x[1] + Q[i][2] * x[2]);
/** Qᵀ x */
export const mulQT = (Q, x) => [0, 1, 2].map((j) => Q[0][j] * x[0] + Q[1][j] * x[1] + Q[2][j] * x[2]);
const I3 = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
/** ĝ 回りの角 a と x 軸回りの傾き b の回転 Q = R_z(a) R_x(b)(試験と器の宣言の枠) */
export function rotZX(a, b = 0) {
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const Rz = [[ca, -sa, 0], [sa, ca, 0], [0, 0, 1]], Rx = [[1, 0, 0], [0, cb, -sb], [0, sb, cb]];
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => Rz[i][0] * Rx[0][j] + Rz[i][1] * Rx[1][j] + Rz[i][2] * Rx[2][j]));
}
function orthoOk(Q) {
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const s = Q[0][i] * Q[0][j] + Q[1][i] * Q[1][j] + Q[2][i] * Q[2][j]; if (Math.abs(s - (i === j ? 1 : 0)) > DECL.orthoTol) return false; }
  const det = Q[0][0] * (Q[1][1] * Q[2][2] - Q[1][2] * Q[2][1]) - Q[0][1] * (Q[1][0] * Q[2][2] - Q[1][2] * Q[2][0]) + Q[0][2] * (Q[1][0] * Q[2][1] - Q[1][1] * Q[2][0]);
  return Math.abs(det - 1) <= DECL.orthoTol;
}

/* ───────── 枠(版 2)───────── */
/**
 * 枠の宣言 → 版 2 の frame。decl が無ければ版 1 と同じ回転しない銀河中心系(宣言の値 —— 欠測ではない)。decl があれば鍵ごとに明示(無い鍵は null —— complete = false)。
 * 置かれた値は検査する(原点・原点の速さは有限の 3 成分・Q は正規直交で行列式 +1・Ω_frame は有限・単位は kpc/m/s/s だけ)。
 */
export function frameOf2(sampleOut, decl) {
  const c = sampleOut && isObj(sampleOut.contract) ? sampleOut.contract : {};
  const velocityRef = typeof c.velocityRef === 'string' ? c.velocityRef : null;
  if (decl === undefined || decl === null) return { id: typeof c.frame === 'string' ? c.frame : 'galactocentric', origin: C1.DECL.frameOrigin, originKpc: [0, 0, 0], Q: I3(), axis: C1.DECL.axis.slice(), velocityRef,
    originVelocity: [0, 0, 0], timeUnit: DECL.units.time, lengthUnit: DECL.units.length, velocityUnit: DECL.units.velocity, omegaFrame: 0, complete: true };
  if (!isObj(decl)) throw new RangeError('frame の宣言は object');
  for (const k of Object.keys(decl)) if (!['id', 'originKpc', 'Q', 'originVelocity', 'omegaFrame', 'lengthUnit', 'velocityUnit', 'timeUnit'].includes(k)) throw new RangeError('frame: 知らない鍵 ' + k);
  const g = (k) => (decl[k] === undefined ? null : decl[k]);
  const o = g('originKpc'), Q = g('Q'), vo = g('originVelocity'), Om = g('omegaFrame'), lu = g('lengthUnit'), vu = g('velocityUnit'), tu = g('timeUnit');
  if (o !== null && !vec3(o)) throw new RangeError('frame.originKpc は有限の 3 成分 [kpc] か null');
  if (Q !== null && !(mat3(Q) && orthoOk(Q))) throw new RangeError('frame.Q は正規直交で行列式 +1 の 3×3 か null');
  if (vo !== null && !vec3(vo)) throw new RangeError('frame.originVelocity は有限の 3 成分 [m/s] か null');
  if (Om !== null && !isFin(Om)) throw new RangeError('frame.omegaFrame は有限の数 [rad/s] か null');
  if (lu !== null && lu !== DECL.units.length) throw new RangeError('frame.lengthUnit は kpc だけ');
  if (vu !== null && vu !== DECL.units.velocity) throw new RangeError('frame.velocityUnit は m/s だけ');
  if (tu !== null && tu !== DECL.units.time) throw new RangeError('frame.timeUnit は s だけ');
  const complete = [o, Q, vo, Om, lu, vu, tu].every((x) => x !== null);
  return { id: typeof decl.id === 'string' ? decl.id : null, origin: o === null ? null : '宣言の原点(銀河中心系の [kpc])', originKpc: o === null ? null : o.slice(), Q: Q === null ? null : Q.map((r) => r.slice()),
    axis: Q === null ? null : [Q[0][2], Q[1][2], Q[2][2]], velocityRef, originVelocity: vo === null ? null : vo.slice(), timeUnit: tu, lengthUnit: lu, velocityUnit: vu, omegaFrame: Om, complete };
}
const needComplete = (fr, what) => { if (!(isObj(fr) && fr.complete === true)) throw new RangeError(what + ': 枠の原点・行列・原点の速さ・Ω_frame・単位のどれかが null(欠測 —— 取り換えを拒否)'); };
/** 点の取り換え: x′ = Qᵀ(x − o) [kpc]・v′ = Qᵀ(v − v_o) − Ω_frame ĝ′ × x′ [m/s](ĝ′ = (0, 0, 1) —— 枠の第 3 軸) */
export function toFrame(fr, xKpc, vMs) {
  needComplete(fr, 'toFrame');
  if (!vec3(xKpc) || !vec3(vMs)) throw new RangeError('toFrame: 位置・速さは有限の 3 成分');
  const xp = mulQT(fr.Q, sub(xKpc, fr.originKpc)), vp = sub(mulQT(fr.Q, sub(vMs, fr.originVelocity)), scl(cross([0, 0, 1], xp), fr.omegaFrame * KPC));
  return { x: xp, v: vp };
}
/** 逆: x = Q x′ + o・v = Q(v′ + Ω_frame ĝ′ × x′) + v_o */
export function fromFrame(fr, xp, vp) {
  needComplete(fr, 'fromFrame');
  return { x: add(mulQ(fr.Q, xp), fr.originKpc), v: add(mulQ(fr.Q, add(vp, scl(cross([0, 0, 1], xp), fr.omegaFrame * KPC))), fr.originVelocity) };
}
/** 角速度の宣言を回す枠の中へ(各々から Ω_frame を引く —— 差〔滑り〕は変わらない)。null は null のまま */
export function ratesInFrame(rates, OmegaArm) {
  const sh = (x) => (x === null || x === undefined ? null : x - rates.omegaFrame);
  return { omegaMat: rates.omegaMat && rates.omegaMat.value !== null ? sh(rates.omegaMat.value) : null, omegaField: sh(rates.omegaField), omegaP: sh(rates.omegaP), omegaArm: sh(OmegaArm), omegaFrameInFrame: 0 };
}

/* ───────── 契約(版 2)───────── */
/** 物質の角速度の宣言({ value [rad/s] > 0, at: { R_kpc }, ref, source } —— 無ければ値 null) */
export function omegaMatOf(d) {
  const nul = { value: null, at: null, ref: null, source: null };
  if (d === undefined || d === null) return nul;
  if (!isObj(d)) throw new RangeError('omegaMat の宣言は object');
  for (const k of Object.keys(d)) if (!['value', 'at', 'ref', 'source'].includes(k)) throw new RangeError('omegaMat: 知らない鍵 ' + k);
  if (!(isFin(d.value) && d.value > 0)) throw new RangeError('omegaMat.value は正の有限の数 [rad/s]');
  if (!(isObj(d.at) && isFin(d.at.R_kpc) && d.at.R_kpc > 0)) throw new RangeError('omegaMat.at は { R_kpc > 0 }');
  if (!(typeof d.source === 'string' && d.source)) throw new RangeError('omegaMat.source(出どころ)が要る');
  return { value: d.value, at: { R_kpc: d.at.R_kpc }, ref: typeof d.ref === 'string' ? d.ref : DECL.ratesRef, source: d.source };
}
/**
 * **版 2 の契約の作り手** buildFieldContract2(sampleOut, decl) —— decl は { frame?, omegaField?, convergence?, transfer?, omegaMat?, labels? }(labels はラベルの口の宣言 —— 第329便b の galrot の lib)。
 * 版 1 の部分(omegaField・convergence・sources・transfer・ledgerRefs)は第328便a の buildFieldContract に委ねる(同じ値)。戻り値はただの JSON の値。
 */
export function buildFieldContract2(sampleOut, decl) {
  const d = decl === undefined || decl === null ? {} : decl;
  if (!isObj(d)) throw new RangeError('buildFieldContract2: decl は object');
  for (const k of Object.keys(d)) if (!['frame', 'omegaField', 'convergence', 'transfer', 'omegaMat', 'labels'].includes(k)) throw new RangeError('decl: 知らない鍵 ' + k);
  const v1 = C1.buildFieldContract(sampleOut, { omegaField: d.omegaField, convergence: d.convergence, transfer: d.transfer });
  const frame = frameOf2(sampleOut, d.frame), labels = GR.galaxyLabelPort(d.labels), om = omegaMatOf(d.omegaMat);
  const rates = { omegaFrame: frame.omegaFrame, omegaMat: om, omegaField: v1.omegaField.value, omegaP: labels.OmegaP === null ? null : labels.OmegaP * GR.KMS_KPC_RADS, unit: 'rad/s', ref: DECL.ratesRef, note: DECL.armNote };
  return { version: CONTRACT2_VERSION, baseVersion: BASE_CONTRACT_VERSION, frame, rates, omegaField: v1.omegaField, convergence: v1.convergence, sources: v1.sources, transfer: v1.transfer, ledgerRefs: v1.ledgerRefs, labels };
}
/** 版 1 の形へ(Ω_frame = 0・原点 0・Q = I・v_o = 0 のときだけ —— 他は null と理由: 版 1 は回転する枠を表さない) */
export function toV1(c2) {
  const f = c2.frame, idn = f.complete === true && f.omegaFrame === 0 && f.originKpc.every((x) => x === 0) && f.originVelocity.every((x) => x === 0) && JSON.stringify(f.Q) === JSON.stringify(I3());
  if (!idn) return { ok: false, contract: null, why: '版 1 の枠は回転しない銀河中心系だけ(Ω_frame・原点・行列・原点の速さのどれかが恒等でない —— 版 1 の意味を黙って変えない)' };
  return { ok: true, contract: { version: BASE_CONTRACT_VERSION, frame: { id: f.id, origin: f.origin, axis: f.axis.slice(), velocityRef: f.velocityRef, timeUnit: f.timeUnit, lengthUnit: f.lengthUnit, omegaFrame: 0 },
    omegaField: c2.omegaField, convergence: c2.convergence, sources: c2.sources, transfer: c2.transfer, ledgerRefs: c2.ledgerRefs } };
}
/** 版 2 の形(鍵の名と順・ただの JSON の値・rates が frame と omegaField の値を写す) */
export function contract2ShapeOk(c) {
  if (!(isObj(c) && JSON.stringify(Object.keys(c)) === JSON.stringify(CONTRACT2_KEYS) && c.version === CONTRACT2_VERSION && c.baseVersion === BASE_CONTRACT_VERSION)) return false;
  if (!(isObj(c.frame) && JSON.stringify(Object.keys(c.frame)) === JSON.stringify(FRAME2_KEYS))) return false;
  if (!(isObj(c.rates) && JSON.stringify(Object.keys(c.rates)) === JSON.stringify(RATES_KEYS) && c.rates.omegaFrame === c.frame.omegaFrame && c.rates.omegaField === c.omegaField.value)) return false;
  if ('omegaArm' in c.rates || 'omegaArm' in c.transfer) return false;
  if (!(isObj(c.labels) && JSON.stringify(Object.keys(c.labels)) === JSON.stringify(GR.PORT_KEYS))) return false;
  return C1.isPlainJson(c);
}
/** 直接の滑り(版 2 —— 回さない枠の宣言の値で: 差だけなので枠に依らない)。Ω_arm は受け手の側の入力 */
export function directSlipOf2(c2, OmegaArm) { return C1.directSlipOf({ transfer: c2.transfer, omegaField: c2.omegaField, frame: { axis: C1.DECL.axis.slice() } }, OmegaArm); }
/** **opt-in の口(版 2)** —— opts.contract2 が無ければ第328便a の sampleWithContract をそのまま(同じ関数・同じ引数)。あれば contract2 の鍵を除いた opts で場の API を呼び fieldContract2 を足す */
export function sampleWithContract2(positionKpc, time, sourceState, opts) {
  if (!(isObj(opts) && opts.contract2 !== undefined && opts.contract2 !== null)) return C1.sampleWithContract(positionKpc, time, sourceState, opts);
  const { contract2: req, ...rest } = opts;
  if (!isObj(req)) throw new RangeError('opts.contract2 は object');
  if ('contract' in rest) throw new RangeError('版 1 と版 2 の契約を同時に求めない');
  const out = F.sample(positionKpc, time, sourceState, rest);
  out.fieldContract2 = buildFieldContract2(out, req);
  return out;
}

/* ───────── 枠の取り換えの場の分(W_R と β —— 第321便c と同じ核・同じ模型)───────── */
const TERM_DISK = (comp) => F.MW.disks.find((D) => 'disk:' + D.key === comp);
function zBrk(D, z, lo, hi) {
  const zd = D.zd, b = [-5 * zd, -zd, -0.1 * zd, 0, 0.1 * zd, zd, 5 * zd];
  if (z !== 0) b.push(z - zd, z - 0.1 * zd, z, z + 0.1 * zd, z + zd);
  return b.filter((x) => x > lo && x < hi);
}
/** 円盤 D の a ∈ [lo, hi) の ∫dz′ h(z′) ∫ wa(a) kern(a, R, (z − z′)²) da(第321便c の環の積分と同じ形 —— 器の積分の道具の照合は u_φ と β で) */
export function diskRing(D, lo, hi, R, z, wa, kern, rel = DECL.quadRel) {
  const a0 = Math.max(0, lo), a1 = Math.min(F.MW.RmaxKpc, hi); if (!(a1 > a0)) return 0;
  const zmax = F.DECL.zTop * D.zd;
  const inner = (zp) => { const dz = z - zp, s2 = dz * dz, w = Math.max(Math.abs(dz), 1e-6);
    return hOf(D, zp) * integrate((a) => wa(a) * kern(a, R, s2), a0, a1, { brk: [R - 10 * w, R - w, R, R + w, R + 10 * w], rel: rel * 0.1 }).v; };
  if (z === 0) return 2 * integrate(inner, 0, zmax, { brk: zBrk(D, 0, 0, zmax), rel }).v;
  return integrate(inner, -zmax, zmax, { brk: zBrk(D, z, -zmax, zmax), rel }).v;
}
/** バルジの ∫ρ_b(r′) K dV′(K = ringP なら β の形・ringQ × R′ なら W_R の形) */
export function bulgeRing(R, z, withR, rel = DECL.quadRel) {
  const B = F.MW.bulge, rmax = F.MW.bulgeRmaxKpc;
  const inner = (rp) => integrate((mu) => { const st = Math.sqrt(Math.max(0, 1 - mu * mu)), dz = z - B.q * rp * mu, s2 = dz * dz, a = rp * st;
    return withR ? ringQ(a, R, s2) * a * KPC : ringP(a, R, s2); }, -1, 1, { brk: [0].concat(rp > 0 && Math.abs(z) < B.q * rp ? [z / (B.q * rp)] : []), rel: rel * 0.1 }).v * rhoBulge(rp) * B.q * rp * rp;
  return COEF * F.MSUN / KPC * integrate(inner, 0, rmax, { brk: [B.r0, B.rcut, 2 * B.rcut], rel }).v;
}
const KD = COEF * F.MSUN / KPC;
/** 源の宣言の項ごとの W_R [m] と β(係数つきの和)—— 代理の項は密度が無いので null */
export function frameShiftParts(sourceState, RKpc, zKpc, { needBeta = true, rel = DECL.quadRel } = {}) {
  const terms = F.checkState(sourceState || F.fullState());
  if (terms.some((t) => t.proxy)) return null;
  let W = 0, beta = 0;
  for (const t of terms) for (const ow of t.owns) {
    if (ow.comp === 'bulge') { W += t.coef * bulgeRing(RKpc, zKpc, true, rel); if (needBeta) beta += t.coef * bulgeRing(RKpc, zKpc, false, rel); continue; }
    const D = TERM_DISK(ow.comp);
    W += t.coef * KD * diskRing(D, ow.lo, ow.hi, RKpc, zKpc, (a) => a * sigOf(D, a) * a * KPC, ringQ, rel);
    if (needBeta) beta += t.coef * KD * diskRing(D, ow.lo, ow.hi, RKpc, zKpc, (a) => a * sigOf(D, a), ringP, rel);
  }
  return { W_R: W, beta: needBeta ? beta : null };
}
/** 器の積分の道具の照合(同じ道具で u_φ と β を作り、第321便c の diskUphiAt・diskBetaAt と比べる —— 相対の差) */
export function toolCheck(RKpc, zKpc, rel = DECL.quadRel) {
  const rows = F.MW.disks.map((D) => {
    const u = KD * diskRing(D, 0, Infinity, RKpc, zKpc, (a) => a * sigOf(D, a) * vOf(a), ringQ, rel), b = KD * diskRing(D, 0, Infinity, RKpc, zKpc, (a) => a * sigOf(D, a), ringP, rel);
    const uF = F.diskUphiAt(D, 0, Infinity, RKpc, zKpc).v, bF = F.diskBetaAt(D, 0, Infinity, RKpc, zKpc);
    return { key: D.key, uRel: Math.abs(u - uF) / Math.abs(uF), betaRel: Math.abs(b - bF) / Math.abs(bF) };
  });
  const bb = bulgeRing(RKpc, zKpc, false, rel), bbF = F.bulgeBetaAt(RKpc, zKpc);
  return { rows, bulgeBetaRel: Math.abs(bb - bbF) / Math.abs(bbF), maxRel: Math.max(...rows.map((q) => Math.max(q.uRel, q.betaRel)), Math.abs(bb - bbF) / Math.abs(bbF)) };
}
/**
 * **枠の中の場**: sampleInFrame(posFrameKpc, time, sourceState, { frame, ...opts })。x = Q x′ + o の場の API の値(版 1 の口 —— ビット同一の sample)を枠へ取り換える。
 * 戻り値 { frame, xGC, base, u′, gradU′, halfCurl′, shift: { W_R, beta, uOmega, betaVo, naiveRigid }, why }(作れない量は null と理由)。
 */
export function sampleInFrame(posFrameKpc, time, sourceState, opts = {}) {
  const { frame: fdecl, shiftRel, ...rest } = opts;
  const fr = frameOf2({ contract: { frame: 'galactocentric', velocityRef: 'source-flow-GC' } }, fdecl);
  needComplete(fr, 'sampleInFrame');
  if (!vec3(posFrameKpc)) throw new RangeError('sampleInFrame: 位置は有限の 3 成分');
  const xGC = add(mulQ(fr.Q, posFrameKpc), fr.originKpc), base = F.sample(xGC, time, sourceState, rest);
  const out = { frame: fr, xGC, base, u: null, gradU: null, halfCurl: null, shift: null, why: [] };
  if (!base.ok) { out.why.push('場の API の有効域の外'); return out; }
  const Om = fr.omegaFrame, vo = fr.originVelocity, o = fr.originKpc, ax = fr.axis, zero3 = (v) => v.every((x) => x === 0);
  if (Om === 0 && zero3(vo)) {   // 軸と原点の取り換えだけ(同じ点の場を Qᵀ で回す —— 恒等の枠ならビット同一)
    const G = [[base.gradU[0], base.gradU[1], base.gradU[2]], [base.gradU[3], base.gradU[4], base.gradU[5]], [base.gradU[6], base.gradU[7], base.gradU[8]]];
    const idn = JSON.stringify(fr.Q) === JSON.stringify(I3());
    const GQ = idn ? G : [0, 1, 2].map((i) => [0, 1, 2].map((j) => { let s = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += fr.Q[a][i] * G[a][b] * fr.Q[b][j]; return s; }));
    out.u = idn ? base.u.slice() : mulQT(fr.Q, base.u); out.gradU = GQ.flat(); out.halfCurl = idn ? base.halfCurl.slice() : mulQT(fr.Q, base.halfCurl);
    out.shift = { W_R: null, beta: null, uOmega: [0, 0, 0], betaVo: [0, 0, 0], naiveRigid: null };
    return out;
  }
  const par = Math.abs(Math.abs(ax[2]) - 1) <= DECL.orthoTol;
  if (!par && Om !== 0) { out.why.push('枠の軸が ĝ と平行でない回転(W の鉛直の成分が要る —— 版 2 の外)'); return out; }
  const R = base.cyl.RKpc, z = base.cyl.zKpc, phi = base.cyl.phi;
  const P = frameShiftParts(sourceState, R, z, { needBeta: true, rel: shiftRel || DECL.quadRel });
  if (P === null) { out.why.push('代理の項(J だけ)は密度が無い —— 取り換えの分が決まらない'); return out; }
  const phiHat = [-Math.sin(phi), Math.cos(phi), 0], s = Math.sign(ax[2]) || 1;
  const uOmega = Om === 0 ? [0, 0, 0] : sub(scl(phiHat, Om * s * P.W_R), scl(cross(ax, scl(o, KPC)), Om * P.beta));
  const betaVo = scl(vo, P.beta);
  out.u = mulQT(fr.Q, sub(sub(base.u, betaVo), uOmega));
  out.why.push('∇u′ と半渦度は Ω_frame = 0 かつ v_o = 0 のときだけ(版 2 の外 —— 0 で埋めない)');
  // 引いた分は Ω_frame â × x β(x) と一般に違う(重みつきの積分 —— 記録)
  const naive = Om === 0 ? null : scl(cross(ax, scl(sub(xGC, o), KPC)), Om * P.beta);
  out.shift = { W_R: P.W_R, beta: P.beta, uOmega, betaVo, naiveRigid: naive, naiveRatio: naive && Math.hypot(...naive) > 0 ? Math.hypot(...uOmega) / Math.hypot(...naive) : null };
  return out;
}

/* ───────── 純関数の場面(速い —— 場の API を呼ばない分。QA lint.galRot329b)───────── */
export function pureScenes() {
  const S = {}, fake = { version: C1.BASE_FIELD_VERSION, contract: { frame: 'galactocentric', velocityRef: 'source-flow-GC', units: { position: 'kpc' } }, source: { model: 'm', terms: [{ key: 'full', coef: 1, owns: ['disk:thin[0,∞)'] }] } };
  const at = { R_kpc: 8.2, z_kpc: 0 }, Q = rotZX(0.7, 0.3), fr = { originKpc: [1, -2, 0.5], Q, originVelocity: [1e3, -2e3, 5e2], omegaFrame: 3e-16, lengthUnit: 'kpc', velocityUnit: 'm/s', timeUnit: 's' };
  // ① 宣言の無い枠は版 1 と同じ(toV1 が第328便a の buildFieldContract と JSON の文字列で同じ)
  { const d = { omegaField: { value: 7e-6, at }, transfer: { gT: 1 }, convergence: { uConverged: true, curlConverged: false, method: 'm', gridSigns: [1, -1] } };
    const c2 = buildFieldContract2(fake, d), v = toV1(c2), c1 = C1.buildFieldContract(fake, d);
    S.v1same = { ok: v.ok, same: JSON.stringify(v.contract) === JSON.stringify(c1), shape: contract2ShapeOk(c2), v1shape: C1.contractShapeOk(v.contract), rates: c2.rates, labelsNull: c2.labels.mode === null && c2.labels.OmegaP === null && c2.rates.omegaP === null }; }
  // ② 回す枠は版 1 にしない(toV1 は null と理由)・第328便a の作り手は回す枠を拒否のまま
  { const c2 = buildFieldContract2(fake, { frame: fr }), v = toV1(c2);
    S.rot = { ok: v.ok, contract: v.contract, why: v.why, complete: c2.frame.complete, axis: c2.frame.axis, shape: contract2ShapeOk(c2), v1rejects: (() => { try { C1.buildFieldContract(fake, { frame: { omegaFrame: 3e-16 } }); return false; } catch (e) { return e instanceof RangeError; } })() }; }
  // ③ 欠測は null(原点・単位が無い枠)→ complete 偽・取り換えは拒否
  { const c2 = buildFieldContract2(fake, { frame: { Q, omegaFrame: 1e-16, originVelocity: [0, 0, 0], velocityUnit: 'm/s', timeUnit: 's' } });
    S.missing = { originKpc: c2.frame.originKpc, lengthUnit: c2.frame.lengthUnit, complete: c2.frame.complete, shape: contract2ShapeOk(c2),
      reject: [() => toFrame(c2.frame, [8, 0, 0], [0, 0, 0]), () => fromFrame(c2.frame, [0, 0, 0], [0, 0, 0])].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }) }; }
  // ④ 宣言の検査(Q が直交でない・行列式 −1・単位の違い・知らない鍵・Ω_mat の出どころなし・版 1 と版 2 を同時に)
  { const bad = [{ frame: { Q: [[1, 0, 0], [0, 1, 0], [0, 0.1, 1]] } }, { frame: { Q: [[1, 0, 0], [0, 1, 0], [0, 0, -1]] } }, { frame: { lengthUnit: 'pc' } }, { frame: { omega: 1 } }, { omegaMat: { value: 1e-16, at: { R_kpc: 8 } } }, { omegaArm: 1e-16 }];
    S.reject = bad.map((d) => { try { buildFieldContract2(fake, d); return false; } catch (e) { return e instanceof RangeError; } }); }
  // ⑤ 点の取り換えの往復(恒等の 1e-15 の内)・同じ点の相対の速さは Qᵀ で回るだけ・足し戻すと合わない(否定対照)
  { const c2 = buildFieldContract2(fake, { frame: fr }), F2 = c2.frame, x = [8.2, 0.3, 0.02], vr = [1e4, 2.3e5, 3e3], vs = [-2e3, 2.2e5, 0];
    const a = toFrame(F2, x, vr), b = fromFrame(F2, a.x, a.v), s = toFrame(F2, x, vs), w = sub(vr, vs), wp = sub(a.v, s.v), wq = mulQT(Q, w);
    const dbl = sub(add(a.v, scl(cross([0, 0, 1], a.x), F2.omegaFrame * KPC)), s.v);
    const rel = (p, q) => Math.hypot(...sub(p, q)) / Math.hypot(...q);
    S.round = { x: rel(b.x, x), v: rel(b.v, vr), relVel: rel(wp, wq), doubled: rel(dbl, wq), speedSame: Math.abs(Math.hypot(...wp) - Math.hypot(...w)) / Math.hypot(...w) }; }
  // ⑥ 滑りと帳簿は枠に依らない(角速度の宣言を枠の中へ —— 差は同じ・双対の供給の和も同じ・口座ごとの仕事は −τ Ω_frame だけ動き和は 0)
  { const c2 = buildFieldContract2(fake, { frame: fr, omegaField: { value: 3, at }, transfer: { gT: 2 }, omegaMat: { value: 1.2, at: { R_kpc: 8.2 }, source: 't' } }), R2 = ratesInFrame(c2.rates, 1);
    const sl0 = directSlipOf2(c2, 1).nuAlong, slF = c2.transfer.gT * (R2.omegaArm - R2.omegaField), N = [0.3, -0.2, 1.5];
    const d0 = C1.dualOf({ N, gT: 2, OmegaArm: 1, OmegaField: 3, axis: [0, 0, 1] }), d1 = C1.dualOf({ N, gT: 2, OmegaArm: R2.omegaArm, OmegaField: R2.omegaField, axis: [0, 0, 1] });
    S.invariant = { sl0, slF, supply0: d0.supplySum, supply1: d1.supplySum, workShift: (d1.workArm - d0.workArm) + (d1.workField - d0.workField), matInFrame: R2.omegaMat, armVsMatter: [R2.omegaArm - R2.omegaField, R2.omegaMat - R2.omegaField] }; }
  // ⑦ ラベルの口が契約に入る(宣言したときだけ —— Ω_p は rad/s で rates に)
  { const c2 = buildFieldContract2(fake, { labels: { mode: 'flatIdentity', v0: 150, RKpc: 20, source: 't' } });
    S.labels = { mode: c2.labels.mode, OmegaP: c2.labels.OmegaP, ratesP: c2.rates.omegaP, conv: c2.labels.OmegaP * GR.KMS_KPC_RADS, shape: contract2ShapeOk(c2) }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    v1SameWhenIdentity: S.v1same.ok === true && S.v1same.same === true && S.v1same.shape === true && S.v1same.v1shape === true && S.v1same.rates.omegaFrame === 0 && S.v1same.rates.omegaField === 7e-6
      && S.v1same.rates.omegaMat.value === null && S.v1same.labelsNull === true,
    rotatingNotV1: S.rot.ok === false && S.rot.contract === null && /黙って変えない/.test(S.rot.why) && S.rot.complete === true && S.rot.shape === true && S.rot.v1rejects === true,
    missingIsNull: S.missing.originKpc === null && S.missing.lengthUnit === null && S.missing.complete === false && S.missing.shape === true && S.missing.reject.every((x) => x === true),
    rejectBadDecl: S.reject.every((x) => x === true),
    roundTripAndRelVel: S.round.x <= 1e-15 && S.round.v <= 1e-14 && S.round.relVel <= 1e-14 && S.round.speedSame <= 1e-14 && S.round.doubled > 1e-3,
    slipLedgerInvariant: close(S.invariant.sl0, S.invariant.slF) && S.invariant.sl0 === -4 && close(S.invariant.supply0, S.invariant.supply1) && Math.abs(S.invariant.workShift) <= 1e-12
      && S.invariant.armVsMatter[0] !== S.invariant.armVsMatter[1],
    labelPortInContract: S.labels.mode === 'flatIdentity' && close(S.labels.ratesP, S.labels.conv) && S.labels.shape === true,
  };
}

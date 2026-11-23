// 第350便c(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R420):
//   **軸引きずりの案の步の形と向き —— 3D の姿勢(自転軸 ŝ の単位ベクトルを回転〔Rodrigues〕で更新)・平行成分 Ω∥ = 引きずり回転(毎ステップ場から作り直す)・
//   直交成分 Ω⊥ = ジャイロトルクの計算(トルクの大きさ = 慣性モーメント × ω_T × abs(Ω⊥))・トルクの式の自転速度 ω_T の読み (S1)・(S1e)・(S2)・(S2′)・
//   向きの読み〔第347便h〕の (g1)・(g2+)・(g2−)・(g3)・閉じた形と刻みの依り方・仕事率・天体 4 組の歳差の周期と向きの純関数 —— 診断だけ**
//   (器 tests/exp-w350c-gyrostep.mjs と QA behavior.gyrostep350c・docs.gyrostep350c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   **エネルギーの行き先(内部熱・自転の増し分)は持たない**(本便の枝 d)—— 慣性回転 ω_I は (S2′) の列のほかは一定。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・pairRot3・DECL・LIT)・第347便h(gyroPhrases —— 向きの読みの語と符号)・第348便b(stepRun —— スカラーの器)・
//   第348便c(composeAll —— 重みの型 (W1))・第347便e(t1Table・geometry —— 天体の I・ω・軸)。
//
// ■ 1 ステップの式(順を固定 —— 統括の読み・型は決めない):
//   ① 前のステップの終わりに保存した合成 W_save(n−1) と、前のステップの姿勢の相対の回転角 φ(n−1) を読む
//   ② 今のステップの引きずり回転の一時の値を消す(**リセットするのは引きずりの一時の成分だけ** —— 慣性回転 ω_I と姿勢 ŝ の履歴は消さない)
//   ③ 今の場から Ω∥ = ŝ·Ω(符号つき —— 今の ω_D)と Ω⊥ = Ω − Ω∥ ŝ を作る
//   ④ ω_T を読み (S1)(S1e)(S2)(S2′) で決め、トルク τ を数えて姿勢を回す(ŝ の角速度 Θ = ŝ × τ ÷ L・L = I ω_L・ω_L = ω_I + ω_D)
//   ⑤ このステップで実際に使った合成(このステップで体を回した自転の速さ ω_I + ω_D)を W_save(n) に保存。初回は宣言の初期の自転 ω_I(0) + ŝ(0)·Ω(0)。
// ■ 自転速度の読み: (S1) ω_T = ω_I(n−1) + ŝ(n)·Ω(t_n)(ステップの始めに作り直した合成 —— 〔第348便b〕)/(S1e) ω_T = W_save(n−1)(前のステップの終わりに実際に使った合成 —— R420 の列)/
//   (S2) ω_T = φ(n−1) ÷ Δt(姿勢の相対の回転角 —— 自転の回転と軸の回転の合成の角)/(S2′) ω_T は (S2) と同じ・加えて ω_I(n) = φ(n−1) ÷ Δt − ŝ(n)·Ω(t_n)。
// ■ 向きの読み(〔第347便h〕の gyroPhrases の語と符号): (g1) 枠に運ばれる Θ = Ω(トルク無し)/(g2+) τ = Ω⊥ × L/(g2−) τ = L × Ω⊥/(g3) τ = I ω_T (k_g Ω⊥ × ŝ + k_d Ω⊥)。
// ■ 言わないこと: ジャイロトルクの向き・歳差・步の形の答えとは書かない。この步の形・この例・このノブでは、の表。観測の値は固定の比べる列(合わせない —— 文献の値・未照合)。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as B from './lib-w348b-spinreset.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w350c-gyrostep-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400, AS = 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 向きの読み(〔第347便h〕の表 13 と同じ 5 行) */
  reads: Object.freeze([
    Object.freeze({ id: 'g1', kg: 0, kd: 0 }), Object.freeze({ id: 'g2p', kg: 0, kd: 0 }), Object.freeze({ id: 'g2m', kg: 0, kd: 0 }),
    Object.freeze({ id: 'g3a', kg: 0, kd: 1 }), Object.freeze({ id: 'g3b', kg: 1, kd: 0.1 })]),
  wReads: Object.freeze(['S1', 'S1e', 'S2', 'S2p']),
  /** 無次元の核: I 1・abs(Ω) 1・角 θ₀ 40°(〔第347便h〕〔第348便b〕と同じ)・慣性回転 ω_I(0) 1 と 10 */
  I: 1, theta0Deg: 40, wI0: Object.freeze([1, 10]), T: 10, dt0: 0.05,
  /** 刻み Δt₀ × 1・½・¼・⅛(刻みの依り方の次数) */
  dtFrac: Object.freeze([1, 0.5, 0.25, 0.125]),
  /** 場の例: const(Ω 一定 = ẑ)・cone(Ω の向きがゆっくり回る —— 半角 30°・率 ν 0.2)・tilt は const の上の (g3) の列 */
  examples: Object.freeze([
    Object.freeze({ id: 'const', kind: 'const', Om: Object.freeze([0, 0, 1]) }),
    Object.freeze({ id: 'cone', kind: 'cone', mag: 1, psiDeg: 30, nu: 0.2 })]),
  integ: Object.freeze(['rot', 'mid']),
  /** 天体 4 組(在位の形の場 —— 第348便h の主の組 K1rM) */
  bodies: Object.freeze([['Earth', 'Sun'], ['Venus', 'Sun'], ['Io', 'Jupiter'], ['Pluto', 'Charon']]),
  bodyCombo: 'K1rM', cands: Object.freeze(['W', 'P2']),
  /** 共通の点検(統括の数え直し)の場と腕 */
  check: Object.freeze({ h: 0.01, src: Object.freeze({ m: 1, R: 1, p: Object.freeze([0, 0, 0]), v: Object.freeze([0, 1, 0]) }), recv: Object.freeze({ m: 1, R: 1, p: Object.freeze([4, 0, 0]) }),
    want: Object.freeze({ diamX: -0.03061311, six: -0.01530656, curlW: -0.01530612 }), boost: Object.freeze([3, -2, 1]), rigid: Object.freeze([1, 2, 3]) }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/** 観測の歳差の角速度(第348便h の LIT —— 第330便a の lib の値・文献の値・未照合 —— 固定の比べる列) */
export const LIT_PREC = Object.freeze({ earth: G3.LIT.precArcsecPerYr.earth, venus: G3.LIT.precArcsecPerYr.venus });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const floor0 = (v, s) => (Math.abs(v) <= 1e-12 * s ? 0 : v);
/** Rodrigues の回転(軸 k の向きのまわりに角 a)—— 長さを保つ */
export function rodrigues(v, k, a) {
  const kn = nrm(k); if (!(kn > 0) || a === 0) return v.slice();
  const e = scl(k, 1 / kn), c = Math.cos(a), s = Math.sin(a);
  return add(add(scl(v, c), scl(crs(e, v), s)), scl(e, dot(e, v) * (1 - c)));
}
/** 四元数(回転の合成の角 —— (S2) の姿勢の相対の回転角) */
const quat = (k, a) => { const kn = nrm(k); if (!(kn > 0) || a === 0) return [1, 0, 0, 0]; const s = Math.sin(a / 2) / kn; return [Math.cos(a / 2), k[0] * s, k[1] * s, k[2] * s]; };
const qmul = (p, q) => [p[0] * q[0] - p[1] * q[1] - p[2] * q[2] - p[3] * q[3], p[0] * q[1] + p[1] * q[0] + p[2] * q[3] - p[3] * q[2], p[0] * q[2] - p[1] * q[3] + p[2] * q[0] + p[3] * q[1], p[0] * q[3] + p[1] * q[2] - p[2] * q[1] + p[3] * q[0]];
const qang = (q) => 2 * Math.atan2(Math.hypot(q[1], q[2], q[3]), Math.abs(q[0]));

/* ───────── トルクの大きさ(統括が枝 d と読み比べる純関数)───────── */
/** トルクの大きさ = 慣性モーメント × 自転速度 ω_T × abs(Ω⊥)(原文「トルク=慣性モーメント*自転速度*直交する回転成分」)。ω_T は符号つき(大きさは abs) */
export function torqueMag({ I, wT, omPerp } = {}) {
  if (!(fin(I) && I >= 0 && fin(wT) && fin(omPerp) && omPerp >= 0)) throw new RangeError('torqueMag: I ≥ 0・ω_T・abs(Ω⊥) ≥ 0');
  return I * Math.abs(wT) * omPerp;
}

/* ───────── 共通の点検(統括の数え直し)───────── */
/** 1 本の直径の 2 点の差分(有限の差)の回転 ê × (u(r + h ê) − u(r − h ê)) ÷ (2h) */
export function diamRot(u, rc, e, h) { const ee = unit(e), du = sub(u(add(rc, scl(ee, h))), u(sub(rc, scl(ee, h)))); return scl(crs(ee, du), 1 / (2 * h)); }
/** 直交 3 直径の 6 点の平均(各直径の 2 点の差分の和の ½) */
export function sixRot(u, rc, h, e1 = [1, 0, 0]) { const a = unit(e1), [b, c] = perpPair(a); let s = [0, 0, 0]; for (const e of [a, b, c]) s = add(s, diamRot(u, rc, e, h)); return scl(s, 0.5); }
export function checkField({ srcV = DECL.check.src.v, recvV = [0, 0, 0], recvP = DECL.check.recv.p, self = true, W0 = 0 } = {}) {
  const S = DECL.check.src, Rv = DECL.check.recv;
  return G3.makeField3({ sources: [{ m: S.m, R: S.R, p: S.p.slice(), v: srcV.slice(), spin: [0, 0, 0] }], recv: { m: Rv.m, R: Rv.R, p: recvP.slice(), v: recvV.slice() }, W0, self });
}
export function commonCheck() {
  const h = DECL.check.h, rc = DECL.check.recv.p.slice(), f = checkField(), ex = [1, 0, 0];
  const diamX = diamRot(f.u, rc, ex, h), six = sixRot(f.u, rc, h), curlW = G3.rot3('W', f, rc, { Rb: DECL.check.recv.R });
  const fr = checkField({ srcV: scl(DECL.check.src.v, -1) }), revX = diamRot(fr.u, rc, ex, h)[2];
  const fc = checkField({ srcV: [1, 0, 0] }), centerX = Math.max(nrm(diamRot(fc.u, rc, ex, h)), nrm(sixRot(fc.u, rc, h)));   // 中心線の向きの通過
  const fs = checkField({ srcV: [0, 0, 0] }), rest = Math.max(nrm(diamRot(fs.u, rc, ex, h)), nrm(sixRot(fs.u, rc, h)));     // 相対静止
  const f0 = checkField({ self: false, W0: 0 }), noSelf = Math.max(nrm(diamRot(f0.u, rc, ex, h)), nrm(sixRot(f0.u, rc, h)));   // 自分の重みも背景も 0
  const bv = DECL.check.boost, fb = checkField({ srcV: add(DECL.check.src.v, bv), recvV: bv }), boost = Math.max(nrm(sub(diamRot(fb.u, rc, ex, h), diamX)), nrm(sub(sixRot(fb.u, rc, h), six)));
  const om = DECL.check.rigid, uR = (x) => crs(om, x), rigidSix = sixRot(uR, [0.3, -0.2, 0.5], h), rigidX = diamRot(uR, [0.3, -0.2, 0.5], ex, h);
  const uS = (x) => [x[1], x[0], 0], shearX = diamRot(uS, [0.4, 0.1, 0], ex, h)[2], shearSix = nrm(sixRot(uS, [0.4, 0.1, 0], h));
  return { diamXz: diamX[2], sixZ: six[2], curlWz: curlW[2], diamXperp: Math.hypot(diamX[0], diamX[1]), revXz: revX, centerX, rest, noSelf, boost, rigidSix, rigidX, shearX, shearSix };
}

/* ───────── 場の例 ───────── */
export function omAt(ex, t) {
  if (ex.kind === 'const') return ex.Om.slice();
  if (ex.kind === 'cone') { const p = ex.psiDeg * D2R; return scl([Math.sin(p) * Math.cos(ex.nu * t), Math.sin(p) * Math.sin(ex.nu * t), Math.cos(p)], ex.mag); }
  if (ex.kind === 'zero') return [0, 0, 0];
  throw new RangeError('omAt: 例は const・cone');
}
const readOf = (id) => { const r = DECL.reads.find((x) => x.id === id); if (!r) throw new RangeError('stepGyro: 向きの読みは ' + DECL.reads.map((x) => x.id).join('・') + '・fixed'); return r; };

/* ───────── 1 本の走り(3D の步の形)───────── */
/** ŝ の角速度 Θ(ŝ × τ ÷ L —— (g1) は枠の回転 Ω そのもの)。r = ω_T ÷ ω_L。 */
function thetaOf(read, s, Om, wT, wL, kg, kd) {
  if (read === 'fixed') return [0, 0, 0];
  if (read === 'g1') return Om.slice();
  const par = dot(s, Om), perp = sub(Om, scl(s, par));
  if (wT === 0 || nrm(perp) === 0) return [0, 0, 0];   // トルク 0
  if (wL === 0) return [0, 0, 0];                     // 角運動量 0 —— 軸の角速度は定まらない(フラグを立てる)
  const r = wT / wL;
  if (read === 'g2p') return scl(perp, r);
  if (read === 'g2m') return scl(perp, -r);
  return scl(add(scl(perp, kg), scl(crs(s, perp), kd)), r);   // g3
}
function tauOf(read, s, Om, wT, I, kg, kd) {
  if (read === 'fixed' || read === 'g1') return [0, 0, 0];
  const perp = sub(Om, scl(s, dot(s, Om)));
  if (read === 'g2p') return scl(crs(perp, s), I * wT);
  if (read === 'g2m') return scl(crs(perp, s), -I * wT);
  return scl(add(scl(crs(perp, s), kg), scl(perp, kd)), I * wT);
}
/**
 * o: { read: g1|g2p|g2m|g3a|g3b|fixed, wRead: S1|S1e|S2|S2p, ex(場の例), s0, wI0, T, dt, I, integ: rot|mid, mut }
 * mut(変異 —— 零試験で落ちることを見る): 'noReset'(引きずり回転を毎ステップ慣性回転へ積む)・'wholeOm'(トルクの大きさに abs(Ω) を使う)・'noUnit'(回転でなく足し算で ŝ を更新)
 */
export function stepGyro(o) {
  const { read = 'g2p', wRead = 'S1', ex = DECL.examples[0], s0 = [Math.sin(DECL.theta0Deg * D2R), 0, Math.cos(DECL.theta0Deg * D2R)], wI0 = 10, T = DECL.T, dt = DECL.dt0, I = DECL.I, integ = 'rot', mut = null, keep = 0 } = o;
  if (!DECL.wReads.includes(wRead)) throw new RangeError('stepGyro: 自転速度の読みは ' + DECL.wReads.join('・'));
  if (!DECL.integ.includes(integ)) throw new RangeError('stepGyro: 積分は rot・mid');
  if (!(isVec(s0) && nrm(s0) > 0 && fin(wI0) && fin(T) && T > 0 && fin(dt) && dt > 0 && fin(I) && I > 0)) throw new RangeError('stepGyro: s0・wI0・T・dt・I');
  const rd = read === 'fixed' ? { kg: 0, kd: 0 } : readOf(read), steps = Math.round(T / dt);
  let s = unit(s0), wI = wI0, wSave = wI0 + dot(s, omAt(ex, 0)), phiPrev = null;
  const Om0 = omAt(ex, 0), oh0 = unit(Om0), [px, py] = nrm(Om0) > 0 ? perpPair(oh0) : [[1, 0, 0], [0, 1, 0]];
  let az = Math.atan2(dot(s, py), dot(s, px)), turns = 0, flagL = 0;
  let dS1S1e = 0, dS2S1 = 0, maxTauW = 0, maxTauTh = 0, torque0 = null, torqueEnd = 0, kinAxis = 0, wTsum = 0, wLsum = 0, lenErr = 0;
  const th0 = nrm(Om0) > 0 ? angDeg(s, Om0) : null, LOm0 = I * (wI0 + dot(s, Om0)) * dot(s, Om0);
  const trace = [];
  for (let n = 0; n < steps; n++) {
    const t = n * dt, Om = omAt(ex, t);
    // ① 前の終わりの合成と回転角を読む ② 引きずり回転の一時の値を消す(下の wD は今の場から作り直す)③ Ω∥・Ω⊥
    const wD = dot(s, Om), perp = sub(Om, scl(s, wD)), pm = nrm(perp);
    const S1 = wI + wD, S1e = wSave, S2 = phiPrev === null ? S1 : phiPrev / dt;
    const wT = wRead === 'S1' ? S1 : wRead === 'S1e' ? S1e : S2;
    dS1S1e = Math.max(dS1S1e, Math.abs(S1 - S1e)); dS2S1 = Math.max(dS2S1, Math.abs(S2 - S1));
    // ④ トルクと姿勢
    const wL = wI + wD;
    if (wL === 0 && wT !== 0 && read !== 'g1' && read !== 'fixed' && pm > 0) flagL++;
    const tq = torqueMag({ I, wT, omPerp: mut === 'wholeOm' ? nrm(Om) : pm }); if (torque0 === null) torque0 = tq; torqueEnd = tq;
    const tau = tauOf(read, s, Om, wT, I, rd.kg, rd.kd);
    let Th = thetaOf(read, s, Om, wT, wL, rd.kg, rd.kd); const Th0 = Th;
    if (integ === 'mid') { const sm = rodrigues(s, Th, nrm(Th) * dt / 2), Omm = omAt(ex, t + dt / 2); Th = thetaOf(read, sm, Omm, wT, wL, rd.kg, rd.kd); }   // 中点では Θ の向きだけを作り直す(ω_T ÷ ω_L はステップの始めの値)
    const spin = wL;
    // 仕事率の尺度: abs(τ) の上限 I abs(ω_T) abs(Ω)(k_g・k_d を含む)× abs(ω)・abs(Θ) の上限 abs(ω_T ÷ ω_L) abs(Ω)(打ち消しの丸めを Ω⊥ の小ささで割らない)
    const kk = Math.max(1, rd.kg + rd.kd), tS = I * Math.abs(wT) * nrm(Om) * kk, thS = (wL !== 0 ? Math.abs(wT / wL) : 0) * nrm(Om) * kk + (read === 'g1' ? nrm(Om) : 0);
    maxTauW = Math.max(maxTauW, tS > 0 && spin !== 0 ? Math.abs(dot(tau, scl(s, spin))) / (tS * Math.abs(spin)) : 0);
    maxTauTh = Math.max(maxTauTh, tS > 0 && thS > 0 ? Math.abs(dot(tau, Th0)) / (tS * thS) : 0);
    kinAxis = Math.max(kinAxis, 0.5 * I * dot(Th, Th));
    wTsum += wT; wLsum += wL;
    const s1 = mut === 'noUnit' ? add(s, scl(crs(Th, s), dt)) : rodrigues(s, Th, nrm(Th) * dt);
    // 姿勢の相対の回転角(自転の回転 → 軸の回転の合成)
    const q = qmul(quat(Th, nrm(Th) * dt), quat(s, spin * dt)), phi = qang(q) * Math.sign(spin || 1);
    // ⑤ 実際に使った合成を保存・慣性回転の更新
    wSave = spin;
    if (wRead === 'S2p') wI = phi / dt - dot(s1, omAt(ex, t + dt));
    if (mut === 'noReset') wI += wD;
    phiPrev = phi; s = s1; lenErr = Math.max(lenErr, Math.abs(nrm(s) - 1));
    // 方位(Ω のまわり —— 一定の Ω のときの歳差の率)
    const a = Math.atan2(dot(s, py), dot(s, px)); let da = a - az; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; turns += da; az = a;
    if (keep > 0 && (n + 1) % Math.max(1, Math.round(steps / keep)) === 0) trace.push({ t: t + dt, thDeg: angDeg(s, omAt(ex, t + dt)), wT });
  }
  const OmE = omAt(ex, T), thE = nrm(OmE) > 0 ? angDeg(s, OmE) : null;
  return { read, wRead, ex: ex.id || ex.kind, integ, dt, steps, sEnd: s, th0Deg: th0, thEndDeg: thE, dThDeg: th0 === null ? null : thE - th0, precRate: turns / T, turns,
    dS1S1e, dS2S1, maxTauW, maxTauTh, kinAxis, torque0, torqueEnd, wTmean: wTsum / steps, wLmean: wLsum / steps, wIEnd: wI, lenErr, flagL,
    dLOm: I * (wI + dot(s, OmE)) * dot(s, OmE) - LOm0, trace };
}

/* ───────── 閉じた形 ───────── */
/** 一定の Ω・ω_T = ω_L の極限: 歳差の率(Ω のまわり)・なす角(時刻 t)。(g1)(g2±) は角を保ち率 ±abs(Ω)・(g3) は tan(θ/2) = tan(θ₀/2) e^(−k_d abs(Ω) t)・率 k_g abs(Ω) */
export function closedForm(read, { th0Deg = DECL.theta0Deg, Om = 1, t = DECL.T } = {}) {
  const rd = readOf(read), th0 = th0Deg * D2R;
  if (read === 'g1' || read === 'g2p') return { rate: Om, thDeg: th0Deg, periodT: 2 * Math.PI / Om };
  if (read === 'g2m') return { rate: -Om, thDeg: th0Deg, periodT: 2 * Math.PI / Om };
  const th = 2 * Math.atan(Math.tan(th0 / 2) * Math.exp(-rd.kd * Om * t));
  return { rate: rd.kg * Om, thDeg: th / D2R, periodT: rd.kg > 0 ? 2 * Math.PI / (rd.kg * Om) : null };
}

/* ───────── 表 1 1 ステップの式の例(順と量)───────── */
export function stepRows() {
  const out = [];
  for (const ex of DECL.examples) for (const rd of ['g2p', 'g3a']) for (const wI0 of DECL.wI0) for (const wRead of DECL.wReads) {
    if (ex.kind === 'cone' && rd === 'g3a') continue;
    const R = stepGyro({ read: rd, wRead, ex, wI0, integ: 'mid' });
    out.push({ ex: ex.id, read: rd, wI0, wRead, thEndDeg: R.thEndDeg, dThDeg: R.dThDeg, precRate: R.precRate, wTmean: R.wTmean, wLmean: R.wLmean, wTOverWL: R.wTmean / R.wLmean,
      dS1S1e: floor0(R.dS1S1e, Math.abs(wI0)), dS2S1: floor0(R.dS2S1, Math.abs(wI0)), torque0: R.torque0, torqueEnd: R.torqueEnd, wIEnd: R.wIEnd, lenErr: R.lenErr <= 1e-12 ? 0 : R.lenErr });
  }
  return out;
}
/** (S2) の閉じた形の目安(一定の Ω・(g2+)・ω_T = ω_L = w): 姿勢の相対の回転角 ÷ Δt → √(w² + abs(Ω⊥)²)(Δt → 0) */
export const s2Closed = (w, perp) => Math.sqrt(w * w + perp * perp);

/* ───────── 表 2 向きの読み 4 列と原文の 3 句 ───────── */
export function dirRows() {
  const ph = H.gyroPhrases(), out = [], ex = DECL.examples[0], cth = Math.cos(DECL.theta0Deg * D2R), s0d = [Math.sin(DECL.theta0Deg * D2R), 0, cth];
  for (const rd of DECL.reads) {
    const base = stepGyro({ read: rd.id, wRead: 'S1', ex, integ: 'mid' });
    const rev = stepGyro({ read: rd.id, wRead: 'S1', ex, integ: 'mid', wI0: -10 - 2 * Math.cos(DECL.theta0Deg * D2R) });   // 合成の自転の反転(ω_I + ω_D → −(ω_I + ω_D))
    const omr = stepGyro({ read: rd.id, wRead: 'S1', ex: { id: 'constR', kind: 'const', Om: [0, 0, -1] }, integ: 'mid', wI0: 10 + 2 * Math.cos(DECL.theta0Deg * D2R) });   // Ω の反転(合成の自転は同じ)
    const w0 = stepGyro({ read: rd.id, wRead: 'S1', ex, integ: 'mid', wI0: 0, s0: [1, 0, 0] });   // 合成の自転 0(ŝ ⟂ Ω で ω_D = 0・ω_I 0 —— 厳密に 0)
    const par = stepGyro({ read: rd.id, wRead: 'S1', ex, integ: 'mid', s0: [0, 0, 1] });   // ŝ ∥ Ω
    const p0 = ph.find((x) => x.read === (rd.id === 'g3a' || rd.id === 'g3b' ? 'g3' : rd.id) && x.kg === (rd.id.startsWith('g3') ? rd.kg : 0) && x.kd === (rd.id.startsWith('g3') ? rd.kd : 0));
    const moved = (R) => angDeg(R.sEnd, base.sEnd);
    out.push({ read: rd.id, kg: rd.kg, kd: rd.kd, dThDeg: floor0(base.dThDeg, 180), precRate: floor0(base.precRate, 1), kind: Math.abs(base.dThDeg) > 0.1 ? 'raise' : 'precess',   // 0.1° 以下は刻みの残り(表 3)
      ninety: p0 ? p0.ninety : null, raise47h: p0 ? p0.raise : null, precess47h: p0 ? p0.precess : null,
      spinRev: { sMovedSame: moved(rev) < 1e-9, torqueFlip: rd.id === 'g1' ? null : nrm(add(tauOf(rd.id, s0d, ex.Om, 10 + cth, 1, rd.kg, rd.kd), tauOf(rd.id, s0d, ex.Om, -(10 + cth), 1, rd.kg, rd.kd))) < 1e-12 }, omRev: { precRate: floor0(omr.precRate, 1), dThDeg: floor0(omr.dThDeg, 180) },
      zeroSpin: { moved: floor0(angDeg(w0.sEnd, [1, 0, 0]), 180), torque0: floor0(w0.torque0, 1) },
      parallel: { moved: floor0(angDeg(par.sEnd, [0, 0, 1]), 180), torque0: floor0(par.torque0, 1) } });
  }
  return out;
}
/** 原文の 3 句の当たり方(〔第347便h〕表 13 の語 —— 1 つに決めない) */
export const PHRASES = Object.freeze([
  '自転方向に90度ズレた力', '自転軸を軸引きずりの回転軸に向けて起こす', '継続した自転軸を起こす力が歳差運動になる']);

/* ───────── 表 3 閉じた形と刻みの依り方 ───────── */
export function convRows() {
  const out = [], ex = DECL.examples[0];
  for (const rd of DECL.reads) for (const integ of DECL.integ) {
    const cf = closedForm(rd.id), errs = DECL.dtFrac.map((k) => { const R = stepGyro({ read: rd.id, wRead: 'S1', ex, integ, dt: DECL.dt0 * k });
      const eTh = Math.abs(R.thEndDeg - cf.thDeg), ePr = Math.abs(R.precRate - cf.rate);   // 誤差の物差し: (g1)(g2±) は角 [rad] と率の大きい方・(g3) は角だけ(Ω へ寄ると方位は定まりにくい)
      return { k, eTh: floor0(eTh, 180), ePr: floor0(ePr, 1), e: rd.id.startsWith('g3') ? eTh * D2R : Math.max(eTh * D2R, ePr) }; });
    const ord = errs.slice(1).map((x, j) => (errs[j].e > 1e-12 && x.e > 1e-12 ? Math.log2(errs[j].e / x.e) : null));
    out.push({ read: rd.id, integ, cfRate: cf.rate, cfThDeg: cf.thDeg, periodT: cf.periodT, errs, order: ord });
  }
  return out;
}

/* ───────── 表 4 仕事率と軸の運動 ───────── */
export function workRows() {
  const out = [], ex = DECL.examples[0];
  for (const rd of DECL.reads) for (const wRead of ['S1', 'S2']) {
    const R = stepGyro({ read: rd.id, wRead, ex, integ: 'mid' });
    out.push({ read: rd.id, wRead, tauDotSpin: floor0(R.maxTauW, 1), tauDotTheta: floor0(R.maxTauTh, 1), kinAxis: floor0(R.kinAxis, 1), dLOm: floor0(R.dLOm, 1), dest: '枝 d' });
  }
  return out;
}

/* ───────── 表 5 天体 4 組 ───────── */
const NAME = Object.freeze({ Earth: 'earth', Venus: 'venus' });
export function bodyRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [], combo = G3.DECL.combos.find((c) => c.id === DECL.bodyCombo);
  for (const [id, src] of DECL.bodies) {
    const key = id + '|' + src, R = G3.pairRot3(T1, GEO, id, src, combo), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), sAx = unit(GEO[key].w), nAx = unit(GEO[key].n);
    for (const cand of DECL.cands) for (const sum of (R.P ? ['W1P', 'W1'] : ['W1'])) {   // (W1P) = 〔第348便c〕の (W1) + 母天体・(W1) = 銀河 + 太陽だけ(母天体の在る組では比べる列)
      const OmG = R.G[cand], OmS = R.S[cand], OmP = R.P ? R.P[cand] : null, CC = C.composeAll(OmG, OmS, OmP);
      const Om = sum === 'W1P' ? CC.W1P.vec : CC.W1.vec;
      const m = nrm(Om), par = dot(sAx, Om), perp = nrm(sub(Om, scl(sAx, par))), w = Math.abs(r2.omega), k = NAME[id], lit = k ? G3.LIT.precArcsecPerYr[k] : null;
      out.push({ id, src, cand, sum, magYr: m * YR, precAsYr: m * YR * AS, periodYr: m > 0 ? 2 * Math.PI / (m * YR) : null, thetaDeg: m > 0 ? angDeg(sAx, Om) : null, perpOverMag: m > 0 ? perp / m : null,
        omNDeg: m > 0 ? angDeg(Om, nAx) : null, dragOverW: par / w, torque: torqueMag({ I: r2.I, wT: w + par, omPerp: perp }), g2pSense: '+', g2mSense: '−',
        obsAsYr: lit === undefined ? null : lit, obsPeriodYr: lit ? 360 * 3600 / lit : null, ratio: lit ? m * YR * AS / lit : null });
    }
  }
  return out;
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes() {
  const cc = commonCheck();
  const tm = { one: torqueMag({ I: 1, wT: 1, omPerp: 1 }), neg: torqueMag({ I: 2, wT: -3, omPerp: 0.5 }), rej: [() => torqueMag({ I: -1, wT: 1, omPerp: 1 }), () => torqueMag({ I: 1, wT: NaN, omPerp: 1 }), () => torqueMag({ I: 1, wT: 1, omPerp: -1 })].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } }) };
  // (g1) は Ω のまわりの厳密な回転 —— 角を保つ・率 abs(Ω)
  const g1 = stepGyro({ read: 'g1', wRead: 'S1', integ: 'rot' });
  // 刻みの依り方の次数((g2+) rot は 1・mid は 2 の桁)
  const cv = convRows(), ordRot = cv.find((r) => r.read === 'g2p' && r.integ === 'rot').order, ordMid = cv.find((r) => r.read === 'g2p' && r.integ === 'mid').order;
  // 仕事率: τ·(ω ŝ) と τ·Θ は丸めの床
  const wk = workRows();
  // スカラーの器(〔第348便b〕の stepRun)と: 軸を固定・一定の Ω・行き先は熱だけ(自転は変わらない)—— トルクと ω_T が同じ・(S1e) と (S2) は (S1) と同じ数
  const th = DECL.theta0Deg, sc = ['S1', 'S2'].map((type) => B.stepRun({ type, col: 'E3', split: [1, 0, 0], f: 0, theta0Deg: th, Om: 1, w0in: 1, T: 1, steps: 20 }));
  const mine = DECL.wReads.slice(0, 3).map((wRead) => stepGyro({ read: 'fixed', wRead, wI0: 1, T: 1, dt: 0.05 }));
  const vsB = Math.max(...sc.map((r) => Math.abs(r.torque0 - mine[0].torque0)), ...sc.map((r) => Math.abs(r.torqueEnd - mine[0].torqueEnd)), ...mine.map((r) => Math.abs(r.torqueEnd - mine[0].torqueEnd)), mine[0].dS1S1e, mine[0].dS2S1);
  // 長い走りで ŝ の長さ
  const lenR = stepGyro({ read: 'g3b', wRead: 'S1', T: 50, dt: 0.01 });
  // 変異: 引きずり回転を積む(ω_T が步の数に比例して増える)・トルクに abs(Ω)・回転でなく足し算(長さが崩れる)
  const base = stepGyro({ read: 'g2p', wRead: 'S1' }), mR = stepGyro({ read: 'g2p', wRead: 'S1', mut: 'noReset' }), mW = stepGyro({ read: 'g2p', wRead: 'S1', mut: 'wholeOm' }), mU = stepGyro({ read: 'g2p', wRead: 'S1', mut: 'noUnit' });
  const muts = { noReset: mR.wTmean / base.wTmean > 1.5, wholeOm: Math.abs(mW.torque0 / base.torque0 - 1 / Math.sin(th * D2R)) < 1e-12, noUnit: mU.lenErr > 1e-6 };
  // (S1) と (S1e): 一定の Ω・歳差だけ((g1) の厳密な回転)では同じ・Ω の向きが回る(cone)と違う・起こす (g3a) で違う
  const s1eConst = stepGyro({ read: 'g1', wRead: 'S1e' }).dS1S1e, s1eCone = stepGyro({ read: 'g2p', wRead: 'S1e', ex: DECL.examples[1] }).dS1S1e, s1eTilt = stepGyro({ read: 'g3a', wRead: 'S1e' }).dS1S1e;
  const rej = [() => stepGyro({ wRead: 'S3' }), () => stepGyro({ read: 'g4' }), () => stepGyro({ integ: 'rk' }), () => stepGyro({ dt: 0 }), () => omAt({ kind: 'x' }, 0)].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { cc, tm, g1: { dTh: g1.dThDeg, rate: g1.precRate }, ordRot, ordMid, wk: { tauW: Math.max(...wk.map((r) => r.tauDotSpin)), tauTh: Math.max(...wk.map((r) => r.tauDotTheta)) }, vsB, len: lenR.lenErr, muts, s1e: { c: s1eConst, cone: s1eCone, tilt: s1eTilt }, rejects: rej };
}
export function pureGates(S) {
  const W = DECL.check.want, c = S.cc, near = (a, b) => Math.abs(a - b) < 5e-9;
  return {
    commonNums: near(c.diamXz, W.diamX) && near(c.sixZ, W.six) && near(c.curlWz, W.curlW) && c.diamXperp < 1e-12,
    commonSym: Math.abs(c.revXz + c.diamXz) < 1e-12 && c.centerX < 1e-12 && c.rest === 0 && c.noSelf < 1e-12 && c.boost < 1e-12,
    commonRigid: nrmD(c.rigidSix, DECL.check.rigid) < 1e-9 && nrmD(c.rigidX, [0, 2, 3]) < 1e-9 && Math.abs(c.shearX - 1) < 1e-9 && c.shearSix < 1e-9,
    torqueMag: S.tm.one === 1 && S.tm.neg === 3 && S.tm.rej.every(Boolean),
    g1exact: Math.abs(S.g1.dTh) < 1e-9 && Math.abs(S.g1.rate - 1) < 1e-9,
    order: S.ordRot.every((x) => x > 0.9 && x < 1.1) && S.ordMid.every((x) => x > 1.8 && x < 2.2),
    workZero: S.wk.tauW < 1e-12 && S.wk.tauTh < 1e-12,
    vsScalar: S.vsB < 1e-12,
    unitLen: S.len < 1e-12,
    s1eWhen: S.s1e.c < 1e-12 && S.s1e.cone > 1e-4 && S.s1e.tilt > 1e-4,
    mutants: S.muts.noReset && S.muts.wholeOm && S.muts.noUnit,
    rejects: S.rejects.length === 5 && S.rejects.every(Boolean),
  };
}
function nrmD(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

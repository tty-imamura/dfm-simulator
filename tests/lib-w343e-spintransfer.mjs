// 第343便e(原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN843「パワーボール効果は、軸引きずりで回転が伝わる経路として見る。軸引きずりで、目標とする軸と回転が決まるが、
//   実際の経路は、ジャイロトルクを経由する」・AN844「銀河由来の軸引きずりに対する、太陽の軸は、112.8°。銀河由来の軸引きずりと、太陽由来の軸引きずりの釣り合いが、太陽系の軸の120°」・
//   統括の検証項目 R382): **「目標」と「経路」を分けた帳簿・経路の型ごとの保存の零試験・第342便e の残りの読み直し・釣り合いが 120° になる重みの比(平面)・宣言の極で数える三次元の角**
//   (器 tests/exp-w343e-spintransfer.mjs と QA behavior.spintransfer343e・docs.spintransfer343e が読む —— html を読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない —— AN712)。第342便e・第340便f・第341便g・第337便j・第337便c の lib は呼ぶだけ(本文は変えない)。
//
// ■ 目標(T1 (i) —— エネルギーとは別の量): 源 j ごとに、目標の軸 t̂_j(rev = 赤道面の逆回転の軸 −ŝ_src を主・fwd = ŝ_src を比べる列)と目標の回転の大きさ Ω_j の読み 2 つ
//     (m1) 軸引きずりの率 Ω_j = C_b β_j abs(1 − α) abs(ω_src)(第342便e の向ける力の大きさの率 —— C_b 1)/(m2) 源の自転の速さ abs(ω_src)(歯車の読み)。
//   差 Δ = Ω_j t̂_j − Ω_r(Ω_r = 今の自転)を、自転の向きの成分 Δ∥(負 = 今より遅い・逆向きの目標)と軸を倒す成分 Δ⊥ に分けて表にする。源ごと(合成は AN207 で単純加算しない —— 本表は足さない)。
// ■ 経路の型(T1 (ii) —— どれもノブ・候補):
//   (P1) 内部の軸 h を介したトルク T = k h × (Ω_s − Ω_r)(受け手)と源の反作用 −T。総トルク 0・総仕事率 T·Ω_r − T·Ω_s = −k (h × Δ)·Δ = 0(恒等式)。h が自転の軸と同じなら自転の仕事率 0。
//   (P2) 第342便e の「向ける力」N ⊥ ŝ(+ ジャイロ)—— 自転の仕事率 N·Ω_r = 0。自転が増す分の角運動量は向ける力からは来ない(残り = 第342便e の τ∥)。
//   (P3) 散逸のトルクを別に置く型: T_d = c Δ(受け手)・−T_d(源)。熱 = T_d·Δ = c abs(Δ)² ≥ 0。源の供給 = 自転の仕事 + 熱(軌道の仕事はこの 3 型では結びつけない —— 行に 0 で残す)。
//   大きさの尺度: k・c は、h が Δ に垂直のときのトルクの大きさが第342便e の向ける力の前の係数 a_j = s I β_j abs(1 − α) abs(ω_j)(s = 帯の上端 × 結びつきの係数の下限・C_b 1)に
//   なるように置く(k = c = a_j/abs(Δ) —— ノブ。天体の内部の軸を観測で決めたものではない)。
// ■ 帳簿(T1 (iii)): 源ごとの供給 T·Ω_s・自転の仕事 T·Ω_r・軌道の仕事(0 —— 結びつけない型)・熱(散逸のトルクを別に置いた型だけ)・残り = 供給 − 自転 − 軌道 − 熱(0 に丸めない)。
// ■ 釣り合い(T3 —— 平面): 残り R(θ) = A_g f(φ_g − θ) + A_s f(φ_s − θ)・φ_s = 112.8°(入力)・θ = 120°(釣り合いの結果として置く)。則の型 f: 単純な角の差 sin x・符号つきの 2 倍角 sin 2x・
//   第342便e の型 abs(sin 2x) × sign(sin x)(大きさは 2 倍角の絶対値・向きは外積)。銀河の向ける先 φ_g = 0°(自転の軸の向き)/180°(赤道面の逆回転の向き)。
//   要る比 A_g ÷ A_s = −f(φ_s − θ)/f(φ_g − θ)(符号つき —— 負は「正の重み 2 つでは無い」)。傾き dR/dθ の符号(緩和の型 dθ/dt ∝ R での安定 —— 実際の天体の安定ではない)。
// ■ 三次元(T4): 第342便e の lib が持つ太陽の極・銀河の極・黄道の傾き(と第341便g の lib の不変面の傾きと昇交点)の宣言のベクトルで角を数え、黄道の極・不変面の極(別の物 —— 2 列)の
//   接平面に投影した 2 つの寄せる向きのずれと、比を T3 の値に置いたときに残る成分を数える。
// ■ 言わないこと: 自転の由来の答え・120° の由来の答え・釣り合いの比の答え・金星と木星の内部熱の答え・拮抗の機構の答え、とは書かない。理想の直交するトルクだけでは散逸にならない
//   (仕事率 = トルク・角速度)。負の残り・負の比は 0 や絶対値にしない。112.8° は文献の値(太陽の自転の軸と銀河の極から —— この環境では一次資料と未照合)。AN711 の 120° は消さない。
import * as P from './lib-w342e-powerball.mjs';
import * as H340 from './lib-w340f-heatsource.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import { LIT as LIT341G } from './lib-w341g-plutocontrol.mjs';
import { orbitNormal } from './lib-w337j-spinorbit.mjs';
import * as F from './lib-w341f-gyroheat.mjs';

export const LIB_VERSION = 'w343e-spintransfer-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR;

/* ───────── 宣言(走らせるノブの格子と判定の物差し —— 式の形の宣言ではなく、何を測ったかの記録)───────── */
export const DECL = Object.freeze({
  bodies: Object.freeze(['Jupiter', 'Venus', 'Earth', 'Mars', 'Io', 'Pluto', 'Charon']),
  t2Bodies: Object.freeze(['Jupiter', 'Venus', 'Io']),
  targetSigns: Object.freeze(['rev', 'fwd']),
  magReadings: Object.freeze(['m1', 'm2']),
  paths: Object.freeze(['P1', 'P2', 'P3']),
  hDirs: Object.freeze(['spin', 'inPlane', 'normal']),
  alpha: 2,
  /** T3: 太陽の目標の角(入力)・釣り合いの角(結果として置く)・振る角・則・銀河の向ける先 */
  sunDeg: 112.8, balDeg: 120, thetaGrid: Object.freeze([100, 105, 110, 115, 118, 120, 122, 125, 130]),
  laws: Object.freeze(['k1', 'k2', 'abs2']), galPlace: Object.freeze([0, 180]),
  /** 窓(第342便e と同じ物差し): イオの熱 ≤ 観測・木星の熱 ≥ 物差しの 0.1 倍・帯(結びつきの係数 1) */
  highFrac: 0.1, ageYr: 4.57e9,
  bisect: Object.freeze({ iter: 200 }),
});

/** 文献の値(リポジトリの中の値を呼ぶ —— 一次資料には当たっていない: 文献の値・未照合) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 極の向きは第342便e の lib・不変面は第341便g の lib の宣言の写し)',
  poleSrc: P.LIT.poleSrc, ngpSrc: P.LIT.ngpSrc, eps: P.LIT.eps,
  invariable: LIT341G.invariable,
  sunDegSrc: '112.8° —— 原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN844 の値(太陽の自転の軸と銀河の極の文献の値から —— 未照合)',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
export const angleOf = P.angleOf;   // atan2(abs(外積), 内積)

/* ───────── 経路の型(純関数)───────── */
/** 経路のトルク(受け手)。type P1: k h × Δ・P2: a f (ŝ × t̂)/abs(ŝ × t̂)(f は sin の型)・P3: c Δ。戻り値: { T, heat } —— 源の反作用は −T */
export function pathTorque(type, { Os, Or, h, k }) {
  if (!(Array.isArray(Os) && Array.isArray(Or) && fin(k) && k >= 0)) throw new RangeError('pathTorque: Ω_s・Ω_r はベクトル・k ≥ 0');
  const D = sub(Os, Or);
  if (type === 'P1') { if (!Array.isArray(h)) throw new RangeError('pathTorque: P1 は h が要る'); return { T: scl(crs(h, D), k), heat: 0 }; }
  if (type === 'P2') { const x = crs(Or, Os), m = nrm(x); if (m === 0) return { T: [0, 0, 0], heat: 0 }; const f = Math.abs(Math.sin(angleOf(Or, Os))); return { T: scl(x, k * f / m), heat: 0 }; }
  if (type === 'P3') { const T = scl(D, k); return { T, heat: dot(T, D) }; }
  throw new RangeError('pathTorque: 型は ' + DECL.paths.join('・'));
}
/** 帳簿: 供給(源の側の仕事率 T·Ω_s)・自転の仕事 T·Ω_r・軌道の仕事(結びつけない型 —— 0)・熱・残り。総トルク(T + (−T))と総仕事率(受け手 + 源) */
export function pathLedger(type, args) {
  const { T, heat } = pathTorque(type, args), supply = dot(T, args.Os), spinW = dot(T, args.Or), orbitW = 0;
  const totT = add(T, scl(T, -1)), totP = spinW - supply;   // 源の仕事率は −T·Ω_s
  return { T, supply, spinW, orbitW, heat, resid: supply - spinW - orbitW - heat, totT: nrm(totT), totP };
}

/* ───────── T1 目標と今の自転の差(源ごと)───────── */
const sgnTheta = (theta, sign) => (sign === 'rev' ? Math.PI - theta : theta);
const omegaTarget = (q, reading, cb = 1) => (reading === 'm1' ? cb * q.beta * Math.abs(1 - DECL.alpha) * Math.abs(q.w) : reading === 'm2' ? Math.abs(q.w) : (() => { throw new RangeError('omegaTarget: 読みは m1・m2'); })());
export const baseScale = (ctx) => ctx.KB.band.hi * ctx.KB.kLo;
export const makeCtx = () => P.makeCtx();
export function t1Table(ctx = makeCtx()) {
  const rows = P.bodyRows(), s = baseScale(ctx), out = [];
  for (const id of DECL.bodies) {
    const r = rows.find((x) => x.id === id), w = Math.abs(r.omega);
    for (const q of r.tilt) for (const sg of DECL.targetSigns) for (const m of DECL.magReadings) {
      // sin(π − θ) = sin θ・cos(π − θ) = −cos θ(θ = 0 の源で丸めの残りを作らない)。目標と今の自転が同じ大きさ・同じ向き(同期の対)の差は尺度の 1e-12 で 0 と置く
      const th = sgnTheta(q.theta, sg), Ot = omegaTarget(q, m), cth = (sg === 'rev' ? -1 : 1) * Math.cos(q.theta), dPar0 = Ot * cth - w, dPar = Math.abs(dPar0) < 1e-12 * Math.max(Ot, w) ? 0 : dPar0;
      const dPerp = Ot * Math.sin(q.theta), dAbs = Math.hypot(dPar, dPerp);
      const a = s * r.I * q.beta * Math.abs(1 - DECL.alpha) * Math.abs(q.w);
      out.push({ id, src: q.src, sign: sg, mag: m, thetaTargetDeg: th / D2R, OmegaT: Ot, omega: w, OtOverOmega: Ot / w, dPar, dPerp, dAbs, dParOverOmega: dPar / w,
        towardSlower: dPar === 0 ? null : dPar < 0, a, relaxYrP3: a > 0 ? r.I * dAbs / a / YR : null });
    }
  }
  return out;
}

/* ───────── T1 (ii) 経路の型の表(受け手の枠: ŝ = ẑ・目標は xz 面)───────── */
function frameOf(theta, sign, Ot, w) { return { Or: [0, 0, w], Os: [Ot * Math.sin(theta), 0, (sign === 'rev' ? -1 : 1) * Ot * Math.cos(theta)] }; }
const hVec = (d) => (d === 'spin' ? [0, 0, 1] : d === 'inPlane' ? [1, 0, 0] : d === 'normal' ? [0, 1, 0] : (() => { throw new RangeError('hVec'); })());
export function pathTable(ctx = makeCtx()) {
  const rows = P.bodyRows(), s = baseScale(ctx), out = [];
  for (const id of DECL.t2Bodies) {
    const r = rows.find((x) => x.id === id), w = Math.abs(r.omega), q = r.tilt[0];   // 主の源(惑星は太陽・衛星は主星)
    for (const m of DECL.magReadings) {
      const Ot = omegaTarget(q, m), { Or, Os } = frameOf(q.theta, 'rev', Ot, w), dAbs = nrm(sub(Os, Or)), a = s * r.I * q.beta * Math.abs(1 - DECL.alpha) * Math.abs(q.w), k = a / dAbs;
      const cases = [['P1', 'spin'], ['P1', 'inPlane'], ['P1', 'normal'], ['P2', null], ['P3', null]];
      for (const [type, hd] of cases) {
        const L = pathLedger(type, { Os, Or, h: hd ? hVec(hd) : null, k: type === 'P2' ? a : k });
        out.push({ id, src: q.src, mag: m, path: type, h: hd, T: nrm(L.T), spinRateYr: L.T[2] / (r.I * w) * YR, tiltRateYr: Math.hypot(L.T[0], L.T[1]) / (r.I * w) * YR,
          supply: L.supply, spinW: L.spinW, orbitW: L.orbitW, heat: L.heat, resid: L.resid, totT: L.totT, totP: L.totP });
      }
    }
  }
  return out;
}

/* ───────── 零試験(保存の試験)───────── */
export function pureScenes() {
  const Os = [1, 0, 0], Or = [0, 0, 1], h = [0, -1, 0];
  const ex = pathLedger('P1', { Os, Or, h, k: 1 });   // 例: T = (1, 0, 1)・受け手 +1・源 −1
  const vecs = [[[0.3, -1.2, 0.7], [0.1, 0.4, 2.2], [0.5, 0.5, -0.7]], [[-2, 0.2, 0.1], [0, 0, 0.3], [0.9, -0.1, 0.4]], [[1e-3, 2e-3, -4e-3], [0.2, -0.3, 5], [0, 1, 1]]];
  let p1Tot = 0, p1Res = 0, p3Neg = 0, p3Bal = 0, p2Pow = 0, hSpin = 0;
  for (const [a, b, hh] of vecs) {
    const sc = nrm(a) * nrm(b) + nrm(b) * nrm(b);
    const L1 = pathLedger('P1', { Os: a, Or: b, h: hh, k: 1.7 }); p1Tot = Math.max(p1Tot, L1.totT, Math.abs(L1.totP) / (nrm(hh) * sc)); p1Res = Math.max(p1Res, Math.abs(L1.resid) / (nrm(hh) * sc));
    const L1s = pathLedger('P1', { Os: a, Or: b, h: scl(b, 2.5), k: 1.7 }); hSpin = Math.max(hSpin, Math.abs(L1s.spinW) / (2.5 * nrm(b) * sc));
    const L3 = pathLedger('P3', { Os: a, Or: b, k: 0.8 }); if (L3.heat < 0) p3Neg++; p3Bal = Math.max(p3Bal, Math.abs(L3.resid) / sc, Math.abs(L3.heat - 0.8 * dot(sub(a, b), sub(a, b))) / sc);
    const L2 = pathLedger('P2', { Os: a, Or: b, k: 1.3 }); p2Pow = Math.max(p2Pow, Math.abs(L2.spinW) / (1.3 * nrm(b)));
  }
  const z0 = DECL.paths.map((t) => pathLedger(t, { Os: [0.2, 0, 1], Or: [0, 0, 1], h: [0, 1, 0], k: 0 })).every((L) => L.supply === 0 && L.spinW === 0 && L.heat === 0 && nrm(L.T) === 0);
  const rej = [() => pathTorque('P9', { Os, Or, h, k: 1 }), () => pathTorque('P1', { Os, Or, k: 1 }), () => pathTorque('P3', { Os, Or, k: -1 }), () => omegaTarget({ beta: 1, w: 1 }, 'm9'),
    () => balanceRatio('k9', 0, 120), () => balanceRatio('k1', 0, NaN)].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { example: { T: ex.T, recv: ex.spinW, src: -ex.supply, totT: ex.totT, totP: ex.totP }, p1: { totRel: p1Tot, residRel: p1Res, hSpinRel: hSpin }, p2: { powerRel: p2Pow },
    p3: { negHeat: p3Neg, balRel: p3Bal }, driveZero: z0, rejects: rej };
}
export function pureGates(S) {
  const e = S.example;
  return {
    example: e.T[0] === 1 && e.T[1] === 0 && e.T[2] === 1 && e.recv === 1 && e.src === -1 && e.totT === 0 && e.totP === 0,
    p1Conserve: S.p1.totRel < 1e-12 && S.p1.residRel < 1e-12, hAlongSpin: S.p1.hSpinRel < 1e-12, p2NoPower: S.p2.powerRel < 1e-12,
    p3Heat: S.p3.negHeat === 0 && S.p3.balRel < 1e-12, driveZero: S.driveZero === true, rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

/* ───────── T2 第342便e の残りの読み直し(目標の回転へ向かう自転の変化の率と届くまでの時間)───────── */
export function t2Table(ctx = makeCtx()) {
  const rows = P.bodyRows(), T342 = P.t3Table(ctx), T1 = t1Table(ctx), out = [];
  for (const id of DECL.t2Bodies) {
    const r = rows.find((x) => x.id === id), w = Math.abs(r.omega), p = T342.find((x) => x.id === id), tau = p.tauParMax;
    for (const q of r.tilt) for (const m of DECL.magReadings) {
      const t = T1.find((x) => x.id === id && x.src === q.src && x.sign === 'rev' && x.mag === m);
      const rateYr = tau / (r.I * w) * YR, reachYr = r.I * Math.abs(t.dPar) / tau / YR;
      out.push({ id, src: q.src, mag: m, retro: r.omega < 0, tauPar: tau, rateYr, targetParOverOmega: (t.OmegaT * Math.cos(t.thetaTargetDeg * D2R)) / w, dParOverOmega: t.dParOverOmega,
        direction: t.dPar === 0 ? 'same' : t.dPar < 0 ? 'slower' : 'faster', reachYr, reachOverAge: reachYr / DECL.ageYr, relaxYrP3: t.relaxYrP3, relaxOverAge: t.relaxYrP3 === null ? null : t.relaxYrP3 / DECL.ageYr });
    }
  }
  return out;
}
/** 窓(散逸のトルクを別に置く型 P3 の熱を、第342便e と同じ 3 つの窓で): heat(X) = 潮汐 + X × Σ_j a_j abs(Δ_j)(源ごとに足す・打ち消さない) */
export function windowP3(ctx = makeCtx()) {
  const rows = P.bodyRows(), T1 = t1Table(ctx), out = [], kLo = ctx.KB.kLo;
  for (const m of DECL.magReadings) for (const sg of DECL.targetSigns) {
    const hOf = (id) => { const r = rows.find((x) => x.id === id), tide = F.tideHeat(r, F.LIT.k2q[id]).heat, u = T1.filter((x) => x.id === id && x.sign === sg && x.mag === m).reduce((t, x) => t + x.a * x.dAbs, 0); return { tide, u }; };
    const io = hOf('Io'), ju = hOf('Jupiter'), ve = hOf('Venus');
    const cap = (F.LIT.heat.Io - io.tide) / io.u, need = (DECL.highFrac * F.LIT.heat.Jupiter - ju.tide) / ju.u;
    out.push({ mag: m, sign: sg, ioU: io.u, juU: ju.u, juOverRuler: (ju.tide + ju.u) / F.LIT.heat.Jupiter, ioOverObs: (io.tide + io.u) / F.LIT.heat.Io, venusOverRuler: (ve.tide + ve.u) / F.LIT.heat.Venus,
      capX: cap, needX: need, needOverCap: cap > 0 ? need / cap : null, bandX: 1 / kLo, bandLoX: ctx.KB.band.lo / (ctx.KB.band.hi * kLo), openKfree: need <= cap, openK1: need <= Math.min(cap, 1 / kLo),
      openBandBoth: Math.max(need, ctx.KB.band.lo / (ctx.KB.band.hi * kLo)) <= Math.min(cap, 1 / kLo) });
  }
  return out;
}

/* ───────── T3 釣り合い(平面)───────── */
export function lawF(law, x) {
  if (!fin(x)) throw new RangeError('lawF: 角は有限');
  if (law === 'k1') return Math.sin(x);
  if (law === 'k2') return Math.sin(2 * x);
  if (law === 'abs2') { const s = Math.sin(x); return s === 0 ? 0 : Math.abs(Math.sin(2 * x)) * Math.sign(s); }
  throw new RangeError('lawF: 則は ' + DECL.laws.join('・'));
}
function lawD(law, x) {
  if (law === 'k1') return Math.cos(x);
  if (law === 'k2') return 2 * Math.cos(2 * x);
  return Math.sign(Math.sin(2 * x)) * Math.sign(Math.sin(x)) * 2 * Math.cos(2 * x);
}
/** 要る比 A_g ÷ A_s(符号つき)と傾き dR/dθ(A_s = 1)。分母 0 は null */
export function balanceRatio(law, galDeg, thDeg, sunDeg = DECL.sunDeg) {
  if (!DECL.laws.includes(law) || !fin(galDeg) || !fin(thDeg)) throw new RangeError('balanceRatio: 則・角');
  const xg = (galDeg - thDeg) * D2R, xs = (sunDeg - thDeg) * D2R, fg = lawF(law, xg), fs = lawF(law, xs);
  if (Math.abs(fg) < 1e-15) return { ratio: null, slope: null };
  const ratio = -fs / fg, slope = -ratio * lawD(law, xg) - lawD(law, xs);
  return { ratio, slope };
}
/** 比 ρ を与えて R(θ) = 0 の θ を 2 分で戻す(閉じた形との差の検査 —— [θ − 5°, θ + 5°] の内の根) */
export function thetaBack(law, galDeg, rho, th0, sunDeg = DECL.sunDeg) {
  const R = (t) => rho * lawF(law, (galDeg - t) * D2R) + lawF(law, (sunDeg - t) * D2R);
  let lo = th0 - 5, hi = th0 + 5, flo = R(lo); if (flo * R(hi) > 0) return null;
  for (let i = 0; i < DECL.bisect.iter; i++) { const m = 0.5 * (lo + hi), fm = R(m); if (fm === 0) return m; if (fm * flo < 0) hi = m; else { lo = m; flo = fm; } }
  return 0.5 * (lo + hi);
}
export function t3Table(ctx = makeCtx()) {
  const out = [];
  for (const law of DECL.laws) for (const g of DECL.galPlace) for (const th of DECL.thetaGrid) {
    const b = balanceRatio(law, g, th), back = b.ratio === null ? null : thetaBack(law, g, b.ratio, th);
    out.push({ law, gal: g, thetaDeg: th, ratio: b.ratio, positive: b.ratio !== null && b.ratio > 0, slope: b.slope, stableRelax: b.slope === null ? null : b.slope < 0,
      backErrDeg: back === null ? null : Math.abs(back - th) < 1e-9 ? 0 : back - th });
  }
  return out;
}
/** 並べる列(合わせない): 金星で釣り合う比 ρ_V(第340便f —— 銀河の項 ÷ 主星の項の係数の比)・第342便e の大きさの比 a_銀河/a_太陽(木星・金星) */
export function t3Side(ctx = makeCtx()) {
  const v = H340.venusBalance('diff', 'obsSpin'), t4 = P.t4Table(ctx);
  const ar = (id) => t4.find((r) => r.id === id && r.sign === 'rev' && r.law === 'sin').aRatio;
  return { rhoV: v.rhoV, rhoVreading: 'diff・obsSpin', aRatioJupiter: ar('Jupiter'), aRatioVenus: ar('Venus') };
}

/* ───────── T4 三次元(宣言の極)───────── */
export function poles() {
  const S = P.spinUnit('Sun'), G = P.galUnit(), E = [0, 0, 1], Inv = orbitNormal(LIT.invariable.iDeg, LIT.invariable.nodeDeg);
  return { S, G, E, Inv };
}
const tangent = (t, Pp) => { const v = sub(t, scl(Pp, dot(t, Pp))), m = nrm(v); return m > 0 ? scl(v, 1 / m) : null; };
export function t4Table(ctx = makeCtx()) {
  const { S, G, E, Inv } = poles(), T3 = t3Table(ctx), dg = (a, b) => angleOf(a, b) / D2R;
  const angles = { GS: dg(G, S), GE: dg(G, E), SE: dg(S, E), GInv: dg(G, Inv), SInv: dg(S, Inv), EInv: dg(E, Inv) };
  const rows = [];
  for (const [pn, Pp] of [['ecl', E], ['inv', Inv]]) for (const g of DECL.galPlace) {
    const tg = g === 0 ? G : scl(G, -1), dG = tangent(tg, Pp), dS = tangent(S, Pp), sep = angleOf(dG, dS) / D2R;
    const thG = angleOf(Pp, tg), thS = angleOf(Pp, S);
    for (const law of DECL.laws) {
      const t3 = T3.find((r) => r.law === law && r.gal === g && r.thetaDeg === DECL.balDeg), rho = t3.ratio, fG = lawF(law, thG), fS = lawF(law, thS);
      const Rv = add(scl(dG, rho * fG), scl(dS, fS)), resid = nrm(Rv) / Math.abs(fS);
      rows.push({ pole: pn, gal: g, law, sepDeg: sep, thetaGDeg: thG / D2R, thetaSDeg: thS / D2R, rho, residOverSun: resid, minResidOverSun: Math.sin(sep * D2R) });
    }
  }
  return { angles, rows };
}

/* ───────── T5 第342便e の表がどちらの角で数えたか・入れ替えると ───────── */
export function t5Table(ctx = makeCtx()) {
  const s = baseScale(ctx), rows = P.bodyRows(), { S, G, E } = poles(), out = [];
  // (a) 第342便e T3・第341便f: 銀河の向ける先の角 = 120°(F.DECL.t3.galTiltDeg)→ 112.8° に入れ替えた熱の上限(sin の型・η 0・μ 0)
  for (const id of ['Jupiter', 'Venus', 'Io']) {
    const r = rows.find((x) => x.id === id), alt = Object.assign({}, r, { tilt: r.tilt.map((q) => (q.src === 'galaxy' ? Object.assign({}, q, { theta: DECL.sunDeg * D2R }) : q)) });
    const L0 = P.ledger(r, { law: 'sin', s, mu: 0, split: 'const', knob: 0 });
    // 打ち消しを避けて、銀河の項の取り分の変化を直に作る: (N_銀河,alt² − N_銀河²)/Σ_j N_j²(保つ仕事率 = Σ N_j²/(I abs(ω)))
    const nOf = (rr) => P.torques(rr, 'sin', s), N0 = nOf(r), N1 = nOf(alt), g0 = N0.find((x) => x.src === 'galaxy').N, g1 = N1.find((x) => x.src === 'galaxy').N, sum = N0.reduce((t, x) => t + x.N * x.N, 0);
    out.push({ table: '342e-T3', id, angleUsedDeg: F.DECL.t3.galTiltDeg, altDeg: DECL.sunDeg, PunUsed: L0.Pun, galShareUsed: g0 * g0 / sum, relChange: (g1 * g1 - g0 * g0) / sum, galTorqueRatio: g1 / g0 });
  }
  // (b) 第342便e T4: 太陽の向ける先 = 太陽の自転の軸(銀河となす角 112.8° の側)→ 黄道の極(119.8° の側)に入れ替えた、両方 ÷ 太陽だけ − 1(sin の型・rev)
  const t4 = P.t4Table(ctx);
  for (const id of P.DECL.t4Bodies) {
    const r = rows.find((x) => x.id === id), sh = P.spinUnit(id), qS = r.tilt.find((q) => q.src === 'Sun'), qG = r.tilt.find((q) => q.src === 'galaxy');
    const aS = s * r.I * qS.beta * Math.abs(1 - DECL.alpha) * Math.abs(qS.w), aG = s * r.I * qG.beta * Math.abs(1 - DECL.alpha) * Math.abs(qG.w);
    const term = (t, a) => { const x = crs(sh, t), m = nrm(x); return m > 0 ? scl(x, a * Math.abs(Math.sin(angleOf(sh, t))) / m) : [0, 0, 0]; };
    const calc = (sunAxis) => { const nS = term(scl(sunAxis, -1), aS), nG = term(scl(G, -1), aG); return (2 * dot(nS, nG) + dot(nG, nG)) / dot(nS, nS); };
    const used = t4.find((x) => x.id === id && x.sign === 'rev' && x.law === 'sin');
    out.push({ table: '342e-T4', id, angleUsedDeg: angleOf(S, G) / D2R, altDeg: angleOf(E, G) / D2R, usedBothMinus1: used.bothOverSunMinus1, recompUsed: calc(S), altBothMinus1: calc(E) });
  }
  return out;
}

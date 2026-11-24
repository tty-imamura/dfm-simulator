// 第352便l(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R449):
//   **太陽の自転軸の傾き(太陽系の基準軸に対して 5〜7°)を作る作用の候補を、数えられる式に直した純関数 —— 2 つの軸(輪の法線 n̂・太陽の自転軸 ŝ)を同時に進める步・
//   候補 (b) 公転面の輪と自転軸が別々に応える/(c) 円盤引きずりの源に銀河の円盤の対照の模型を当てる/(d) 銀河の面を上下する運動で替わる分 —— 診断だけ**
//   (器 tests/exp-w352l-suntilt.mjs と QA behavior.suntilt352l・docs.suntilt352l が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import する)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便d(r3Rate・closedR3)・第351便j(ringOmega・ringRate)・第350便g(omegaField)・第352便c(refAxes・galDirs・azimuthDeg)・
//   第352便d(r3Ds・poleRates・bgVec)・第352便e(fixedOffset)・第352便f(diskSources・sunRecv・diskField・recvRot・torqueRows)・第348便h(makeField3・rot3)・第350便b(c2Ball)・
//   第348便c(massOf・radiusOf・galDistM)・第312便a(Kball)・第347便e(t1Table・geometry)・第337便c(年の長さ・年齢の宣言)。
//
// ■ 2 つの軸の步(T1): 輪の法線 n̂ と太陽の自転軸 ŝ は、どちらも第351便d の (R3) の 2 経路の形で同じ Ω に応える(応答の係数は軸ごと —— 比 ρ・k₁・k₂・歳差の向きの読み (g2±))。
//   一定の Ω では、Ω のまわりの極の角 θ と方位 φ が分かれる: θ は第351便d の closedR3((α) の読み —— tan(θ/2) = tan(θ₀/2) e^(−k₁ ρ abs(Ω) t))・
//   φ は ±k₂ ρ abs(Ω) t((g2+) は Ω × ŝ の向き = 右ねじで正・(g2−) は逆)。步は刻みごとにこの閉じた形を当てる(刻みの中の Ω は中点の値で一定 —— 第351便g の作りと同じ考え)。
// ■ 2 つの軸の角 γ: 同じ係数なら、経路 ② だけのとき γ はどの初めの向きでも変わらない(Ω のまわりの剛体の回転)・同じ初めの向きなら経路 ① を含めても γ = 0 のまま。
//   係数が違えば、初めにそろっていた 2 つの軸は開く —— 経路 ② だけなら sin(γ/2) = sin θ abs(sin(Δφ/2))(Δφ = 方位の率の差 × t)・経路 ① だけなら γ = abs(θ_n − θ_s)。
//   開き始めの率は、どちらの経路でも sin θ × (係数の差) × abs(Ω)。
// ■ 輪の平均(T2・T3): 場を引数で受ける輪の平均の口 ringAvg(omAt, L, …)(omAt(x, v) → Ω —— 粒子の位置と速度で)。第351便j の ringOmega と同じ入力で同じ数になることを零試験に置く。
//   一様な背景の回転(第351便e の (B2) —— 受け手の速度に依らない)では、輪の平均は背景そのもの((M) の型の分は無い)。
// ■ 銀河の円盤の対照の模型(T3・T4): 第352便f の円盤の点の源(単位は R₀・v₀・Ω₀ = v₀/R₀)。模型の枠: ẑ = 銀河の回転の向き((G+))・x̂ = 銀河中心から太陽の向き・ŷ = ẑ × x̂。
//   受け手は太陽(R₀ の点・速さ v₀)か、同じ位置の輪の粒子。受け手の自分の重みは在位の形(K1 は規則の半径 —— 質量に依らない・K2 は既定の半径 —— 質量で替わる)。
// ■ 上下の運動(T4): 面からの高さ ±Z の Ω を、面の上と下で符号が替わる分(面内の成分 —— 鏡映で反転)と替わらない分(面の法線の成分)に分ける(差で作らず、+Z の成分を直接に)。
//   揺れの作用 A sin(ω_z t) と歳差の率 Ω_p が同時に在るときの軸の円の半径は、閉じた形 (A/2)(1/abs(Ω_p − ω_z) + 1/abs(Ω_p + ω_z))(候補の式 —— 步で照らす)。
// ■ 言わないこと: 太陽の傾きの由来の答え・公転面の由来の答えとは書かない。この場・この候補・この係数では、の表。
import * as R3 from './lib-w351d-r3step.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as GD from './lib-w350g-diskcheck.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PD from './lib-w352d-precsense.mjs';
import * as SR from './lib-w352e-sunrecv.mjs';
import * as GF from './lib-w352f-galdisk.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w352l-suntilt-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export const angDeg = R3.angDeg;
export const YR = TL.YR;
export const ASYR = PD.ASYR;
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  senses: PD.DECL.senses, fs: Object.freeze([0, 0.5, 1]), norm: 'N1',
  omegaG: GF.DECL.gal.omegaG, uV: 1.19282e-12, ageYr: TL.DECL.bodies.ageYr,
  /** 太陽の傾きの比べる角(第352便c の基準軸 3 つ —— 等重み・角運動量の重み・黄道の極) */
  tiltDeg: Object.freeze({ eq: 5.230, L: 5.968, ecl: 7.252 }),
  /** 銀河の円盤の対照の模型(第352便f の基準の組 —— 平坦な回転 p 0)・核 K1(al 1)・K2(al 2) */
  disk: Object.freeze({ p: 0, sigma: 'exp', edge: 2, perUnit: 16, nPhi: 128 }), als: Object.freeze([1, 2]),
  /** 輪(太陽系の公転面 —— 木星の距離と速さの粒子の輪)・粒子の数 */
  ring: Object.freeze({ aAU: 5.2, N: 8 }), au: 1.495978707e11, pc: 648000 / Math.PI * 1.495978707e11,
  /** 受け手の自分の重みの置き方(輪の粒子の重みを太陽・木星・地球の質量で) */
  recvIds: Object.freeze(['Sun', 'Jupiter', 'Earth']),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 1 つの軸の閉じた形(一定の Ω)───────── */
const coef = (c = {}) => {
  const { sense = 'g2p', kTilt = 0, kPrec = 1, ratio = 1 } = c;
  if (!PD.DECL.senses.includes(sense)) throw new RangeError('係数: 歳差の向きの読みは g2p・g2m');
  if (!(fin(kTilt) && fin(kPrec) && fin(ratio) && kTilt >= 0 && kPrec >= 0 && ratio >= 0)) throw new RangeError('係数: k₁・k₂・比 ≥ 0');
  return { sense, kTilt, kPrec, ratio };
};
/** 比率のノブ f((N1))と歳差の向き・比から 1 つの軸の係数 */
export function axisCoef(f, { sense = 'g2p', ratio = 1, norm = DECL.norm } = {}) { const c = R3.r3Coeffs(f, norm); return coef({ sense, kTilt: c.kTilt, kPrec: c.kPrec, ratio }); }
/** 1 つの軸の dX/dt(第352便d の r3Ds —— 経路 ① + 経路 ②(向きの読みつき)) */
export function axisDs(X, Om, c) { const q = coef(c); return PD.r3Ds(X, Om, q); }
/**
 * 一定の Ω のもとで、時間 t の後の軸 X(閉じた形)。θ は第351便d の closedR3((α))・方位は ±k₂ ρ abs(Ω) t。Ω 0・X ∥ ±Ω̂ なら X のまま。
 */
export function closedAxis(X0, Om, t, c) {
  if (!(isVec(X0) && nrm(X0) > 0 && isVec(Om) && fin(t) && t >= 0)) throw new RangeError('closedAxis: X₀・Ω・t ≥ 0');
  const q = coef(c), om = nrm(Om), x = unit(X0);
  if (!(om > 0) || t === 0) return x;
  const w = scl(Om, 1 / om), cth = dot(x, w), u0 = sub(x, scl(w, cth)), su = nrm(u0);
  if (su < 1e-14) return x;
  const th0 = Math.atan2(su, cth) / D2R, u = scl(u0, 1 / su), v = crs(w, u);
  const th = q.kTilt === 0 ? th0 : R3.closedR3({ th0Deg: th0, Om: om, t, kTilt: q.kTilt, kPrec: 0, ratio: q.ratio, read: 'alpha' }).thDeg;
  const dphi = (q.sense === 'g2p' ? 1 : -1) * q.kPrec * q.ratio * om * t, s = Math.sin(th * D2R);
  return add(scl(w, Math.cos(th * D2R)), add(scl(u, s * Math.cos(dphi)), scl(v, s * Math.sin(dphi))));
}

/* ───────── 2 つの軸の步(T1 の約束の口)───────── */
const omFnOf = (om) => { if (isVec(om)) return () => om; if (typeof om === 'function') return om; throw new RangeError('twoAxisStep: Ω は [3] か関数 t → [3]'); };
/**
 * o: { n0, s0, om([3] か t → [3]), T, steps, ring(n̂ の係数), spin(ŝ の係数), track = false }
 * 刻みごとに中点の Ω で両方の軸に closedAxis を当てる(一定の Ω なら刻みに依らず閉じた形と同じ)。戻り値 { n, s, gammaDeg, gammaMaxDeg, gammaMinDeg }
 */
export function twoAxisStep({ n0, s0, om, T, steps = 1, ring = {}, spin = {}, track = false } = {}) {
  if (!(isVec(n0) && isVec(s0) && fin(T) && T >= 0 && Number.isInteger(steps) && steps >= 1)) throw new RangeError('twoAxisStep: n₀・s₀・T ≥ 0・steps');
  const f = omFnOf(om), dt = T / steps;
  let n = unit(n0), s = unit(s0), gMax = angDeg(n, s), gMin = gMax;
  for (let i = 0; i < steps; i++) {
    const O = f((i + 0.5) * dt);
    n = closedAxis(n, O, dt, ring); s = closedAxis(s, O, dt, spin);
    if (track) { const g = angDeg(n, s); gMax = Math.max(gMax, g); gMin = Math.min(gMin, g); }
  }
  const g = angDeg(n, s);
  return { n, s, gammaDeg: g, gammaMaxDeg: track ? gMax : null, gammaMinDeg: track ? gMin : null };
}
/** 経路 ② だけ・初めにそろった 2 つの軸(Ω との角 θ)の角 γ(閉じた形): sin(γ/2) = sin θ abs(sin(Δφ/2)) */
export function gammaPrec({ thDeg, dphi }) { return 2 * Math.asin(Math.min(1, Math.sin(thDeg * D2R) * Math.abs(Math.sin(dphi / 2)))) / D2R; }
/** 経路 ② だけで γ を開くのに要る方位の差 Δφ(rad)—— 届かない(sin(γ/2) > sin θ)なら null */
export function dphiFor({ thDeg, gammaDeg }) { const r = Math.sin(gammaDeg * D2R / 2) / Math.sin(thDeg * D2R); return r > 1 || !(r >= 0) ? null : 2 * Math.asin(r); }
/** 経路 ① だけ・片方が動かない(係数 0)とき、もう片方が θ₀ から γ だけ寄るのに要る無次元の時間 k₁ ρ abs(Ω) t —— 届かない(γ ≥ θ₀)なら null */
export function tiltProductFor({ th0Deg, gammaDeg }) {
  if (!(gammaDeg < th0Deg)) return null;
  return -Math.log(Math.tan((th0Deg - gammaDeg) * D2R / 2) / Math.tan(th0Deg * D2R / 2));
}
/**
 * 初めにそろった 2 つの軸(向き X0)が γ だけ開くまでの時間(一定の Ω —— 閉じた形の 2 本を時間で探す)。届かなければ null。tMax は探す上限。
 */
export function openTime({ X0, Om, gammaDeg, ring, spin, tMax }) {
  const g = (t) => angDeg(closedAxis(X0, Om, t, ring), closedAxis(X0, Om, t, spin));
  if (!(fin(tMax) && tMax > 0)) throw new RangeError('openTime: tMax > 0');
  // 対数の格子で最初に越える所を探し、二分で詰める
  let lo = 0, hi = null;
  for (let k = 0; k <= 400; k++) { const t = tMax * Math.pow(10, -12 + k * 12 / 400); if (g(t) >= gammaDeg) { hi = t; break; } lo = t; }
  if (hi === null) return null;
  for (let i = 0; i < 80; i++) { const m = 0.5 * (lo + hi); if (g(m) >= gammaDeg) hi = m; else lo = m; }
  return hi;
}

/* ───────── 輪の平均(場を引数で受ける口)───────── */
/**
 * 輪の粒子 N 点の位置の Ω の平均。omAt(x, v) → Ω[3]。粒子 k: 位置 center + r0 (cos φ_k e1 + sin φ_k e2)・速度 V + vc (L̂ × r̂)(e1・e2 は第351便j の ringBasis)。
 */
export function ringAvg(omAt, L, { center = [0, 0, 0], r0, N, vc, V = [0, 0, 0] } = {}) {
  if (typeof omAt !== 'function' || !(isVec(L) && nrm(L) > 0 && isVec(center) && isVec(V) && fin(r0) && r0 > 0 && Number.isInteger(N) && N >= 3 && fin(vc))) throw new RangeError('ringAvg: omAt・L̂・中心・r₀ > 0・N ≥ 3・vc');
  const l = unit(L), [e1, e2] = RJ.ringBasis(l);
  let Om = [0, 0, 0];
  for (let j = 0; j < N; j++) {
    const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph)));
    Om = add(Om, scl(omAt(add(center, scl(rh, r0)), add(V, scl(crs(l, rh), vc))), 1 / N));
  }
  return Om;
}
/** 第351便j の ringOmega と同じ場(第350便g の omegaField —— 源は原点)を ringAvg の omAt に写す */
export function ringOmAt350g({ read = 'C1', part = 'MS', s = RJ.DECL.ring.s, Wii = RJ.DECL.ring.Wii, Rself = RJ.DECL.ring.Rself } = {}) {
  const sp = part === 'M' ? 0 : s;
  return (x, v) => GD.omegaField(read, { s: sp, Wii, Rself, vRec: part === 'S' ? [0, 0, 0] : v })(x);
}

/* ───────── 銀河の円盤の対照の模型 ───────── */
/** 模型の枠(黄道 J2000 の成分): ẑ = (G+)・x̂ = 銀河中心から太陽の向き(−銀河中心の向きを ẑ に直交させたもの)・ŷ = ẑ × x̂ */
export function modelFrame(GEO = E.geometry()) {
  const g = RC.galDirs(GEO), z = unit(g.Gp), x0 = scl(g.gc, -1), x = unit(sub(x0, scl(z, dot(x0, z)))), y = crs(z, x);
  return { x, y, z, toModel: (a) => [dot(a, x), dot(a, y), dot(a, z)], toEcl: (m) => add(add(scl(x, m[0]), scl(y, m[1])), scl(z, m[2])) };
}
/** 受け手(模型の単位 —— 質量 M_gal・長さ R₀): K1 は規則の半径 Y_k m・K2 は min(観測の半径, 既定の上限)(第352便f の sunRecv と同じ置き方を天体 id で) */
export function recvOf(id, al) {
  const Mg = G3.galMass(), R0 = C.galDistM(), mk = C.massOf(id);
  const Rm = al === 1 ? G3.YK * mk : Math.min(C.radiusOf(id), G3.CAP_M);
  return { id, m: mk / Mg, R: Rm / R0, Rm, A: (mk / Mg) * DK.Kball(al, 0, Rm / R0) };
}
/** 円盤の模型の点の源(第352便f の diskSources —— 既定は DECL.disk・核 al) */
export const diskSrc = (al, cfg = DECL.disk) => GF.diskSources({ ...cfg, al });
/**
 * 円盤の場の Ω(模型の単位 Ω₀)を位置 x・速度 v の受け手で(在位の形 —— 受け手の速度を引く・自分の重みは recv)。read 'W'(中心)・'C2'(球の半径の平均)。
 */
export function diskOmAt(src, { al, recv, read = 'C2' } = {}) {
  if (!['W', 'C2'].includes(read)) throw new RangeError('diskOmAt: 読みは W・C2');
  return (x, v) => {
    const f = G3.makeField3({ sources: src, recv: { m: recv.m, R: recv.R, p: x.slice(), v: v.slice() }, kernel: { kind: 'ball', al }, rot: { form: 'M' }, self: true });
    return read === 'W' ? G3.rot3('W', f, x, { Rb: recv.R }) : SC.c2Ball(f, x, recv.R);
  };
}
export const P0 = Object.freeze([1, 0, 0]), V0 = Object.freeze([0, 1, 0]);
/** 太陽系の輪の大きさと速さ(模型の単位): 半径 = a(AU)÷ R₀・速さ = √(G M_☉ ÷ a) ÷ v₀(v₀ = Ω₀ R₀) */
export function ringScale(aAU = DECL.ring.aAU) {
  const R0 = C.galDistM(), a = aAU * DECL.au, v0 = DECL.omegaG * R0;
  return { r0: a / R0, vc: Math.sqrt(TL.G_SI * C.massOf('Sun') / a) / v0, v0, R0 };
}

/* ───────── 揺れと歳差(T4 の閉じた形)───────── */
/** 揺れの作用 A sin(ω t)(一定の向き)と歳差の率 Ω_p が同時に在るときの軸の円の半径(rad —— 小角の候補の式): 2 つの円 (A/2)/abs(Ω_p ∓ ω) の和と差 */
export function wobbleRadius({ A, Op, w }) {
  if (!(fin(A) && A >= 0 && fin(Op) && Op >= 0 && fin(w) && w > 0 && Op !== w)) throw new RangeError('wobbleRadius: A ≥ 0・Ω_p ≥ 0・ω > 0・Ω_p ≠ ω');
  const a = A / 2 / Math.abs(Op - w), b = A / 2 / (Op + w);
  return { max: a + b, min: Math.abs(a - b), a, b };
}

/* ───────── 零試験 ───────── */
export const ANCHOR = Object.freeze({ sunDeg: Object.freeze({ eq: '5.230', L: '5.968', ecl: '7.252' }), needA: Object.freeze({ uV: 6.43e-16, one: 5.39e-4 }), uV: 1.19282e-12 });
const f3 = (x) => x.toFixed(3);
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const z = [0, 0, 1], Om = [0.3, -0.2, 0.9], th = (a) => [Math.sin(a * D2R), 0, Math.cos(a * D2R)];
  // ① 同じ係数・経路 ② だけ: どの初めの向きでも γ は変わらない(一定の Ω)
  const nA = th(20), sA = [Math.sin(35 * D2R) * Math.cos(1), Math.sin(35 * D2R) * Math.sin(1), Math.cos(35 * D2R)];
  const same2 = PD.DECL.senses.map((sense) => { const c = coef({ sense, kTilt: 0, kPrec: 1 }), r = twoAxisStep({ n0: nA, s0: sA, om: Om, T: 7.3, steps: 50, ring: c, spin: c, track: true });
    return Math.max(Math.abs(r.gammaMaxDeg - angDeg(nA, sA)), Math.abs(r.gammaMinDeg - angDeg(nA, sA))); });
  // ② 同じ係数・同じ初めの向き(経路 ① を含む f 0.5)で γ = 0 のまま
  const c05 = axisCoef(0.5), same1 = twoAxisStep({ n0: nA, s0: nA, om: Om, T: 9, steps: 30, ring: c05, spin: c05, track: true }).gammaMaxDeg;
  // ③ 係数が違う(経路 ② だけ・比 1 と 0.4)—— 閉じた形 sin(γ/2) = sin θ abs(sin(Δφ/2)) と照合
  const om = nrm(Om), X0 = unit(add(unit(Om), [0.4, 0.1, -0.2])), thX = angDeg(X0, Om), tt = 2.1;
  const r3 = twoAxisStep({ n0: X0, s0: X0, om: Om, T: tt, steps: 40, ring: coef({ kPrec: 1, ratio: 1 }), spin: coef({ kPrec: 1, ratio: 0.4 }) });
  const diffPrec = Math.abs(r3.gammaDeg - gammaPrec({ thDeg: thX, dphi: 0.6 * om * tt }));
  // ④ 係数が違う(経路 ① だけ)—— γ = abs(θ_n − θ_s)(closedR3)
  const r4 = twoAxisStep({ n0: X0, s0: X0, om: Om, T: tt, steps: 7, ring: coef({ kTilt: 1, kPrec: 0, ratio: 1 }), spin: coef({ kTilt: 1, kPrec: 0, ratio: 0.25 }) });
  const cl = (k) => R3.closedR3({ th0Deg: thX, Om: om, t: tt, kTilt: 1, ratio: k }).thDeg, diffTilt = Math.abs(r4.gammaDeg - Math.abs(cl(1) - cl(0.25)));
  // ⑤ Ω = 0 で不変
  const r5 = twoAxisStep({ n0: nA, s0: sA, om: [0, 0, 0], T: 5, steps: 5, ring: c05, spin: axisCoef(1) }), zero = Math.max(rel(r5.n, unit(nA)), rel(r5.s, unit(sA)));
  // ⑥ 閉じた形と第352便d の r3Ds の細かい RK4(f 0.5・(g2±)・比 0.7)
  const rk = (X, c, T, n) => { let x = unit(X); const h = T / n, F = (y) => axisDs(y, Om, c); for (let i = 0; i < n; i++) { const k1 = F(x), k2 = F(add(x, scl(k1, h / 2))), k3 = F(add(x, scl(k2, h / 2))), k4 = F(add(x, scl(k3, h))); x = unit(add(x, scl(add(add(k1, scl(k2, 2)), add(scl(k3, 2), k4)), h / 6))); } return x; };
  const vsRk = Math.max(...PD.DECL.senses.map((sense) => { const c = axisCoef(0.5, { sense, ratio: 0.7 }); return rel(closedAxis(sA, Om, 3, c), rk(sA, c, 3, 4000)); }));
  // ⑦ 輪の平均の口: 第351便j の ringOmega と同じ入力で同じ数(成分 3 × 読み 2 × 傾き 2)
  let vsRing = 0;
  for (const part of ['M', 'S', 'MS']) for (const read of ['C1', 'C2']) for (const iDeg of [10, 140]) {
    const L = RJ.normalAt(iDeg, -60), R = RJ.DECL.ring;
    vsRing = Math.max(vsRing, rel(ringAvg(ringOmAt350g({ read, part }), L, { r0: R.r0, N: R.N, vc: Math.pow(R.r0, -0.5) }), RJ.ringOmega(L, { read, part })));
  }
  // ⑧ 一様な背景の回転: 輪の平均は背景そのもの(粒子の速度に依らない —— (M) の型の分は無い)・第351便j の ringRate と第352便d の r3Ds の経路 ① の大きさが同じ
  const bg = PD.bgVec('Gm', { u: 1 }), Lr = RC.refAxes(T1, GEO).L, uni = rel(ringAvg(() => bg, Lr, { r0: 1e-8, N: 8, vc: 0.05, V: [0, 1, 0] }), bg);
  const rr = RJ.ringRate(Lr, bg, { kTilt: 1, kPrec: 0 }), rrVs = Math.abs(rr.perp / nrm(axisDs(Lr, bg, coef({ kTilt: 1, kPrec: 0 }))) - 1);
  // ⑨ 揺れと歳差の閉じた形と步(無次元: Ω_p 1・ω 2.5・A 0.01 —— 特解の初めの点から)
  const Op = 1, w = 2.5, A = 0.01, a = A / 2 / (w - Op), b = A / 2 / (w + Op);
  const s0w = unit([0, a + b, 1]);   // ζ(0) = i A/2 (1/(ω − Ω_p) + 1/(ω + Ω_p))
  const omW = (t) => [A * Math.sin(w * t), 0, Op];
  const rw = twoAxisStep({ n0: z, s0: s0w, om: omW, T: 4 * Math.PI, steps: 20000, ring: coef({ kPrec: 0, ratio: 0 }), spin: coef({ kPrec: 1 }), track: true });
  const WR = wobbleRadius({ A, Op, w }), wob = { maxRel: Math.abs(rw.gammaMaxDeg * D2R / WR.max - 1), minRel: Math.abs(rw.gammaMinDeg * D2R / WR.min - 1) };
  // ⑩ 開く時間の往復(経路 ② だけ・θ 60°・γ 5.230°)と経路 ① の無次元の時間
  const Xo = th(60), Oz = z, tOpen = openTime({ X0: Xo, Om: Oz, gammaDeg: 5.230, ring: coef({ kPrec: 1 }), spin: coef({ kPrec: 0, ratio: 0 }), tMax: 10 });
  const round = Math.abs(tOpen - dphiFor({ thDeg: 60, gammaDeg: 5.230 })), tp = tiltProductFor({ th0Deg: 60, gammaDeg: 5.230 });
  const tilt1 = Math.abs(R3.closedR3({ th0Deg: 60, Om: 1, t: tp, kTilt: 1 }).thDeg - (60 - 5.230));
  // ⑪ 起点の数(第352便c・第352便e・第352便f): 太陽と基準軸 3 つの角・半頂角を保つ A((uV)・倍率 1)・一様・高さの 1 次の加速度のトルク 0
  const RA = RC.refAxes(T1, GEO), sun = unit(GEO['Earth|Sun'].s), uV = PD.uVenus(T1, GEO);
  const sunDeg = { eq: f3(angDeg(RA.eq, sun)), L: f3(angDeg(RA.L, sun)), ecl: f3(angDeg(RA.ecl, sun)) };
  const needA = { uV: SR.fixedOffset({ Op: nrm(PD.bgVec('Np', { u: uV })) * ASYR, thDeg: 5.230 }).A, one: SR.fixedOffset({ Op: nrm(PD.bgVec('Np', { u: 1 })) * ASYR, thDeg: 5.230 }).A };
  const tq = GF.torqueRows(), tqZero = tq.filter((r) => r.id === 'uniform' || r.id === 'height').map((r) => Math.max(nrm(r.sphere), nrm(r.oblate)));
  // ⑫ 模型の枠と受け手: 枠は右手の正規直交・ẑ = (G+)・K1 の自分の重みは質量に依らない・受け手の太陽は第352便f の sunRecv と同じ
  const MF = modelFrame(GEO), frame = Math.max(Math.abs(dot(MF.x, MF.y)), Math.abs(dot(MF.y, MF.z)), Math.abs(dot(MF.x, MF.z)), Math.abs(dot(crs(MF.x, MF.y), MF.z) - 1), rel(MF.z, RC.galDirs(GEO).Gp));
  const k1Mass = Math.abs(recvOf('Jupiter', 1).A / recvOf('Sun', 1).A - 1), sunVsF = Math.max(...DECL.als.map((al) => Math.abs(recvOf('Sun', al).A / GF.sunRecv(al).A - 1)));
  // ⑬ 拒否
  const rej = [() => coef({ sense: 'x' }), () => coef({ kTilt: -1 }), () => closedAxis([0, 0, 0], Om, 1, {}), () => closedAxis(z, Om, -1, {}), () => twoAxisStep({ n0: z, s0: z, om: 'x', T: 1 }),
    () => ringAvg(null, z, { r0: 1, N: 8, vc: 0 }), () => ringAvg(() => z, z, { r0: 1, N: 2, vc: 0 }), () => wobbleRadius({ A: 1, Op: 1, w: 1 }), () => diskOmAt([], { al: 1, recv: GF.sunRecv(1), read: 'P2' }), () => openTime({ X0: z, Om: z, gammaDeg: 1, ring: {}, spin: {}, tMax: 0 })]
    .map((fn) => { try { fn(); return false; } catch (er) { return er instanceof RangeError; } });
  return { same2, same1, diffPrec, diffTilt, zero, vsRk, vsRing, uni, rrVs, wob, round, tilt1, sunDeg, needA, uV, tqN: tq.length, tqZero, frame, k1Mass, sunVsF, rejects: rej };
}
export function pureGates(S) {
  return {
    samePrecKeepsGamma: S.same2.every((x) => x < 1e-9),
    sameStartStays: S.same1 < 1e-9,
    diffPrecClosed: S.diffPrec < 1e-9,
    diffTiltClosed: S.diffTilt < 1e-9,
    omZero: S.zero < 1e-15,
    closedVsRk: S.vsRk < 1e-9,
    ringAvgVsRingOmega: S.vsRing < 1e-12,
    uniformRing: S.uni < 1e-15 && S.rrVs < 1e-12,
    wobbleClosed: S.wob.maxRel < 2e-3 && S.wob.minRel < 2e-2,
    openRound: S.round < 1e-9 && S.tilt1 < 1e-9,
    anchors: S.sunDeg.eq === ANCHOR.sunDeg.eq && S.sunDeg.L === ANCHOR.sunDeg.L && S.sunDeg.ecl === ANCHOR.sunDeg.ecl && Math.abs(S.needA.uV / ANCHOR.needA.uV - 1) < 5e-3
      && Math.abs(S.needA.one / ANCHOR.needA.one - 1) < 5e-3 && Math.abs(S.uV / ANCHOR.uV - 1) < 5e-6 && S.tqZero.length === 2 && S.tqZero.every((x) => x < 1e-12),
    frameRecv: S.frame < 1e-12 && S.k1Mass < 1e-12 && S.sunVsF < 1e-12,
    rejects: S.rejects.every(Boolean),
  };
}

// 第344便e(原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN880「「目標とする軸と回転」は、「今の自転に合成する目標とする軸と回転」に訂正」・
//   原仮定者の回答(2026-11-19 —— 第143報の回答 2)「当事者時間については、相対的な時間に換算して重力加速度などの加減速を計算する」・原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・
//   統括の検証項目 R389): **「今の自転に合成する」の型を並べる(一度だけ足すベクトル・続けて足すトルク・2 倍角の則を通した和・飽和と重みつきの和)・型ごとの零試験・
//   天体の表(合成した先・増し分の率・届くまでの時間・熱・供給の側の仕事と反作用)・120° の釣り合いの三次元の残りを極の選び方と向ける先の写像で分けた表**
//   (器 tests/exp-w344e-spincompose.mjs と QA behavior.spincompose344e・docs.spincompose344e が読む —— html を読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない —— AN712)。第343便e・第342便e・第341便f・第337便c の lib は呼ぶだけ(本文は変えない —— 〔第343便e〕の表の数は当時の読みの列として残る)。
//
// ■ 合成の型(T1 —— どれもノブ・候補。源 j ごとの目標の回転 ΔΩ_j = Ω_j t̂_j —— 大きさの読みは〔第343便e〕の (m1) 軸引きずりの率・(m2) 源の自転の速さ)
//   (C1) 一度だけ足すベクトル: Ω′ = Ω + ΔΩ(合成した先 = 目標)。大きさの二乗の差 = 2 Ω·ΔΩ + abs(ΔΩ)²(同じ大きさ・120° でちょうど 0 —— 丸めの境は 3 値で「未解決」)。
//        毎步同じ ΔΩ を足すと刻みに比例して駆動が変わる —— 「続けて足す」は率(ΔΩ ÷ 時間)で定義する。
//   (C2) 続けて足すトルク: 受け手に T = c (k ẑ × D + b D)・源に −T(D = 源の側の回転 − 受け手の回転・ẑ = 受け手 × 源の向きの単位・k と b は別のノブ)。熱の率 = T·D = c b abs(D)²。
//        中点法(線形の陰の中点 —— b = 0 では大きさを保つ回転)。源の慣性モーメントが有限の場面で角運動量の和と「回転のエネルギー + 積んだ熱」が保存。
//        天体の行は源の側を目標(今の自転 + ΔΩ)に固定(源の慣性モーメント ∞ —— 反作用は −∫T を記録)・c = a_j ÷ abs(ΔΩ)(a_j は〔第343便e〕の向ける力の前の係数)。
//   (C3) 2 倍角の則を通した和(AN346 の型): 源の軸と今の自転の軸の角 θ を 2θ に写して足す(向きの成分だけを 2 倍角で重みづけ —— 大きさは C1 と同じ)。
//   (C4) 飽和と重みつきの和(AN207「引きずりは単純加算しない」に沿う型 —— 形は 2 つ・上限と重みはノブ):
//        (C4a) 余白の重み: Ω′ = Ω + w ΔΩ・w = max(0, 1 − abs(Ω) ÷ Ω_cap)(上限 Ω_cap → ∞ で C1)/
//        (C4b) 源ごとの重みの和が 1 を超えない: Ω′ = Ω + Σ_j λ_j ΔΩ_j・λ_j = 1 ÷ max(1, Σ_i abs(ΔΩ_i) ÷ Ω_sat)(Ω_sat → ∞ で源ごとの C1 の和)。
// ■ 釣り合い(T3): 〔第343便e〕の宣言の極(太陽の自転の軸 S・銀河の回転のベクトル G・黄道の極 E・不変面の極 Inv)で、向ける先の写像(恒等・赤道面の逆回転・2 倍角の則)を
//   先に数え、極の接平面の 2 つの寄せる向きのずれと、比を自由にしたときに残る成分の最小(= abs(sin ずれ) —— 則の型に依らない)を表に。それでも残る分 = 第 3 の項が要る大きさ。
//   合成の読み: 太陽の軸に銀河の向ける先を足して、合成した先が銀河と 120° になる比(平面・三次元)。
// ■ 言わないこと: 合成で自転の由来が分かった・パワーボール効果の量の答え・120° の由来が分かった・釣り合いの比が分かった・金星と木星の内部熱の答え、とは書かない。
//   上限 Ω_cap・Ω_sat を観測の自転に合わせた値とは書かない(ノブの範囲の事実)。同じ仕事を熱と自転の増し分に 2 度数えない(供給 = 自転のエネルギーの増し分 + 熱)。
import * as E343 from './lib-w343e-spintransfer.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as F from './lib-w341f-gyroheat.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w344e-spincompose-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR;

/* ───────── 宣言(走らせるノブの格子と判定の物差し)───────── */
export const DECL = Object.freeze({
  types: Object.freeze(['C1', 'C2', 'C3', 'C4a', 'C4b']),
  magReadings: Object.freeze(['m1', 'm2']),
  t2Bodies: Object.freeze(['Jupiter', 'Venus', 'Io', 'Earth', 'Mars']),
  alpha: 2,
  /** C2 のノブの組(k, b)—— 外の試算の 4 組と同じ点 */
  kb: Object.freeze([Object.freeze([1, 0]), Object.freeze([-1, 0]), Object.freeze([-1, 0.1]), Object.freeze([0, 0.1])]),
  /** 場面(源 (1, 0, 0)・受け手 (0, 1, 0)・慣性モーメント 1 と 1・無次元の時間 π/4・刻み 200 と 400) */
  toy: Object.freeze({ T: Math.PI / 4, steps: Object.freeze([200, 400]) }),
  reachFrac: 0.01,
  /** 3 値の判定の床(大きさの二乗の差 ÷ 尺度) */
  zeroTol: 1e-12,
  c1Angles: Object.freeze([119, 120, 121]),
  /** C4 のノブ: 上限 ÷ 今の自転・飽和 ÷ 今の自転 */
  capOverOmega: Object.freeze([1.5, 2, 10, Infinity]),
  satOverOmega: Object.freeze([1e-10, 1e-8, Infinity]),
  /** T3 */
  sunDeg: 112.8, balDeg: 120, poles: Object.freeze(['ecl', 'inv']), maps: Object.freeze(['ident', 'rev', 'dbl']),
  highFrac: 0.1, ageYr: 4.57e9,
});

/** 外の試算の表(統括の参考の試作 —— 4 組の受け手の速さの増し分と熱・有効数字 3 桁で比べる) */
export const TOY_REF = Object.freeze({ incr: Object.freeze([-1.0, 0.414, 0.311, -0.070]), heat: Object.freeze([0, 0, 0.135, 0.135]), digits: 3,
  note: '統括の参考の試作の表(T = π/4・刻み 400)。本枝のコードで作り直して比べる。向きの約束: ẑ = 受け手 × 源 の単位(外の表の k の符号と同じになる約束)' });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unitOr0 = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);

/** 3 値: 'up'(増す)・'down'(減る)・'unresolved'(床の内 —— 0 と言い切らない) */
export function judge3(x, scale, tol = DECL.zeroTol) {
  if (!fin(x) || !fin(scale) || !(scale > 0)) throw new RangeError('judge3: 値と正の尺度');
  return Math.abs(x) <= tol * scale ? 'unresolved' : x > 0 ? 'up' : 'down';
}

/* ───────── (C1) 一度だけ足すベクトル ───────── */
export function composeOnce(Or, dO) {
  if (!(isVec(Or) && isVec(dO))) throw new RangeError('composeOnce: ベクトル');
  const On = add(Or, dO), w = nrm(Or), dSq = 2 * dot(Or, dO) + dot(dO, dO), scale = 2 * w * nrm(dO) + dot(dO, dO);   // 打ち消し得る 2 つの項の大きさの和
  const incr = w > 0 ? dSq / (w * (nrm(On) + w)) : null;   // abs(Ω′) ÷ abs(Ω) − 1(打ち消さない形)
  return { On, dSq, incr, judge: scale > 0 ? judge3(dSq, scale) : 'unresolved' };
}
/** (C1) の零試験: 同じ大きさの 2 つを角 119°・120°・121° で足した大きさの二乗の差 */
export function c1ZeroScenes() {
  return DECL.c1Angles.map((deg) => { const a = deg * D2R, R = composeOnce([0, 0, 1], [Math.sin(a), 0, Math.cos(a)]); return { deg, judge: R.judge, dSqAbsUnderTol: Math.abs(R.dSq) <= DECL.zeroTol * 3 }; });
}
/** (C1) を毎步足す(同じ ΔΩ を毎步)と率で足す(ΔΩ = r dt)の 2 通りを、同じ時間・刻み 2 つで */
export function c1DriveScenes() {
  const Or = [0, 0, 1], dO = [1e-3, 0, 0], T = 1, out = [];
  for (const n of DECL.toy.steps) {
    let a = Or.slice(), b = Or.slice();
    for (let i = 0; i < n; i++) { a = add(a, dO); b = add(b, scl(dO, T / n)); }
    out.push({ steps: n, perStepAdded: nrm(sub(a, Or)) / nrm(dO), rateAdded: nrm(sub(b, Or)) / nrm(dO) });
  }
  return { rows: out, perStepRatio: out[1].perStepAdded / out[0].perStepAdded, rateRatio: out[1].rateAdded / out[0].rateAdded };
}

/* ───────── (C2) 続けて足すトルク ───────── */
/** M D = k ẑ × D + b D。(1 + c M) x = y を解く(ẑ に平行な成分と垂直な面の 2 次元に分けて) */
function solveM(cc, k, b, z, y) {
  const zz = dot(z, z);
  if (zz === 0) return scl(y, 1 / (1 + cc * b));
  const yPar = scl(z, dot(y, z) / zz), yPerp = sub(y, yPar), A = 1 + cc * b, B = cc * k;
  return add(scl(yPar, 1 / A), scl(sub(scl(yPerp, A), scl(crs(z, yPerp), B)), 1 / (A * A + B * B)));
}
const applyM = (k, b, z, D) => add(scl(crs(z, D), k), scl(D, b));
/** 陰の中点で積分。Is = Infinity なら源の側は動かない(反作用 −∫T を Lsrc に積む) */
export function runC2({ Or0, Os0, Ir, Is, k, b, c = 1, T, steps }) {
  if (!(isVec(Or0) && isVec(Os0) && fin(Ir) && Ir > 0 && (Is === Infinity || (fin(Is) && Is > 0)) && fin(k) && fin(b) && b >= 0 && fin(c) && c >= 0 && fin(T) && T > 0 && Number.isInteger(steps) && steps > 0))
    throw new RangeError('runC2: 入力(ベクトル・正の慣性モーメント・b ≥ 0・c ≥ 0・正の時間・整数の刻み)');
  const z = unitOr0(crs(Or0, Os0)), dt = T / steps, mu = 1 / Ir + (Is === Infinity ? 0 : 1 / Is);
  let Or = Or0.slice(), Os = Os0.slice(), heat = 0, Lsrc = [0, 0, 0], supply = 0;
  for (let i = 0; i < steps; i++) {
    const D = sub(Os, Or), Dm = solveM(0.5 * mu * dt * c, k, b, z, D);   // 中点の D(D_{n+1} = 2 Dm − D_n)
    const Tq = scl(applyM(k, b, z, Dm), c), Om = sub(Os, Dm);              // 受け手のトルク(中点)・中点の受け手の回転は Os_m − Dm(Os は下で動く)
    const OrNew = add(Or, scl(Tq, dt / Ir)), OsNew = Is === Infinity ? Os : sub(Os, scl(Tq, dt / Is));
    const OsM = scl(add(Os, OsNew), 0.5);
    supply += dt * dot(Tq, OsM); heat += dt * c * b * dot(Dm, Dm); Lsrc = sub(Lsrc, scl(Tq, dt));
    Or = OrNew; Os = OsNew; void Om;
  }
  return { Or, Os, heat, supply, Lsrc, z };
}
/** 外の試算の場面を作り直す(4 組 × 刻み 2)と保存の残り */
export function toyTable() {
  const { T, steps } = DECL.toy, rows = [];
  const Os0 = [1, 0, 0], Or0 = [0, 1, 0], E0 = 0.5 * (dot(Os0, Os0) + dot(Or0, Or0)), L0 = add(Os0, Or0), D0 = nrm(sub(Os0, Or0));
  for (const [k, b] of DECL.kb) {
    const R = steps.map((n) => runC2({ Or0, Os0, Ir: 1, Is: 1, k, b, T, steps: n }));
    const one = (r) => ({ incr: nrm(r.Or) - 1, heat: r.heat, remain: nrm(sub(r.Os, r.Or)) / D0,
      Lres: nrm(sub(add(r.Or, r.Os), L0)), Eres: Math.abs(0.5 * (dot(r.Or, r.Or) + dot(r.Os, r.Os)) + r.heat - E0) });
    const a = one(R[0]), s = one(R[1]);
    // 閉じた形(μ = 2): D(t) = e^{−2bt} × (ẑ のまわりに −2kt の回転) D0
    const ang = -2 * k * T, dec = Math.exp(-2 * b * T), z = R[1].z, Dv = sub(Os0, Or0);
    const Dt = scl(add(scl(Dv, Math.cos(ang)), scl(crs(z, Dv), Math.sin(ang))), dec), OrT = scl(sub(L0, Dt), 0.5);
    rows.push({ k, b, incr: s.incr, heat: s.heat, remain: s.remain, incr200: a.incr, diff200_400: Math.abs(a.incr - s.incr), closedIncr: nrm(OrT) - 1,
      closedHeat: 0.5 * D0 * D0 * 0.5 * (1 - Math.exp(-4 * b * T)), LconsOk: Math.max(a.Lres, s.Lres) < 1e-13, EconsOk: Math.max(a.Eres, s.Eres) < 1e-12,
      reachT: b > 0 ? Math.log(1 / DECL.reachFrac) / (2 * b) : null });
  }
  return rows;
}
const round3 = (x) => Math.round(x * 1000) / 1000;

/* ───────── 零試験の束 ───────── */
export function pureScenes() {
  const z1 = c1ZeroScenes(), dr = c1DriveScenes(), toy = toyTable();
  const same = toy.map((r, i) => round3(r.incr) === TOY_REF.incr[i] && round3(r.heat) === TOY_REF.heat[i]);
  // C4 の零試験: 足す分 0 → 変わらない・上限 → ∞ で C1 に戻る・Σλ ≤ 1
  const Or = [0, 0, 2], dO = [0.3, 0, -0.1];
  const c4aZero = nrm(sub(composeC4a(Or, [0, 0, 0], 10).On, Or)) === 0, c4bZero = nrm(sub(composeC4b(Or, [[0, 0, 0]], 1).On, Or)) === 0;
  const c4aInf = nrm(sub(composeC4a(Or, dO, Infinity).On, composeOnce(Or, dO).On)) === 0, c4bInf = nrm(sub(composeC4b(Or, [dO, scl(dO, 2)], Infinity).On, add(Or, scl(dO, 3)))) === 0;
  const c4aBelow = nrm(sub(composeC4a(Or, dO, 1).On, Or)) === 0;   // 上限が今の自転以下なら足さない
  const lam = composeC4b(Or, [dO, scl(dO, 2), [0, 1, 0]], 0.1).lambdaSum;
  const rej = [() => composeOnce([0, 0], [1, 0, 0]), () => runC2({ Or0: [0, 0, 1], Os0: [1, 0, 0], Ir: 1, Is: 1, k: 1, b: -1, T: 1, steps: 10 }),
    () => runC2({ Or0: [0, 0, 1], Os0: [1, 0, 0], Ir: 0, Is: 1, k: 1, b: 0, T: 1, steps: 10 }), () => composeC4a(Or, dO, -1), () => composeC4b(Or, [dO], 0), () => judge3(1, 0),
    () => mapAxis('dbl9', [0, 0, 1], [1, 0, 0])].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { c1Zero: z1, c1Drive: dr, toy, toySame: same, c4: { aZero: c4aZero, bZero: c4bZero, aInf: c4aInf, bInf: c4bInf, aBelow: c4aBelow, lambdaSum: lam }, rejects: rej };
}
export function pureGates(S) {
  return {
    c1Zero: S.c1Zero.map((r) => r.judge).join(',') === 'up,unresolved,down' && S.c1Zero[1].dSqAbsUnderTol === true,
    c1Drive: Math.abs(S.c1Drive.perStepRatio - 2) < 1e-12 && Math.abs(S.c1Drive.rateRatio - 1) < 1e-12,
    c2Conserve: S.toy.every((r) => r.LconsOk === true && r.EconsOk === true),
    c2Steps: S.toy.every((r) => r.diff200_400 < 1e-5 && Math.abs(r.incr - r.closedIncr) < 1e-5 && Math.abs(r.heat - r.closedHeat) < 1e-5),
    toyRef: S.toySame.length === 4 && S.toySame.every(Boolean),
    c4: S.c4.aZero && S.c4.bZero && S.c4.aInf && S.c4.bInf && S.c4.aBelow && S.c4.lambdaSum <= 1 + 1e-15,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}

/* ───────── (C3)(C4) ───────── */
/** 受け手の枠(今の自転 = ẑ 方向)で源の軸が角 θ のとき: rev(赤道面の逆回転 —— 角 π − θ)・dbl(2 倍角の則 —— 角 2θ)の単位ベクトル(〔第343便e〕と同じく xz 面) */
export const dirRev = (theta) => [Math.sin(theta), 0, -Math.cos(theta)];
export const dirDbl = (theta) => [Math.sin(2 * theta), 0, Math.cos(2 * theta)];
export function composeC4a(Or, dO, capOverOmega) {
  if (!(isVec(Or) && isVec(dO) && (capOverOmega === Infinity || (fin(capOverOmega) && capOverOmega > 0)))) throw new RangeError('composeC4a: ベクトルと正の上限');
  const w = capOverOmega === Infinity ? 1 : Math.max(0, 1 - 1 / capOverOmega);   // 上限は今の自転の倍数で与える(abs(Ω) ÷ Ω_cap = 1 ÷ 倍数)
  return Object.assign(composeOnce(Or, scl(dO, w)), { weight: w });
}
export function composeC4b(Or, dOs, satOverOmega) {
  if (!(isVec(Or) && Array.isArray(dOs) && dOs.every(isVec) && (satOverOmega === Infinity || (fin(satOverOmega) && satOverOmega > 0)))) throw new RangeError('composeC4b: ベクトルと正の飽和');
  const sat = satOverOmega * nrm(Or), u = dOs.reduce((t, d) => t + nrm(d), 0), lam = sat === Infinity ? 1 : 1 / Math.max(1, u / sat);
  const sum = dOs.reduce((t, d) => add(t, d), [0, 0, 0]);
  return Object.assign(composeOnce(Or, scl(sum, lam)), { lambda: lam, lambdaSum: sat === Infinity ? null : lam * u / sat });
}

/* ───────── T2 天体の表 ───────── */
export const makeCtx = () => E343.makeCtx();
export function t2Table(ctx = makeCtx()) {
  const rows = P.bodyRows(), T1 = E343.t1Table(ctx), T343 = E343.t2Table(ctx), out = [];
  for (const id of DECL.t2Bodies) {
    const r = rows.find((x) => x.id === id), w = Math.abs(r.omega), Or = [0, 0, w], I = r.I;
    for (const q of r.tilt) for (const m of DECL.magReadings) {
      const t = T1.find((x) => x.id === id && x.src === q.src && x.sign === 'rev' && x.mag === m), Ot = t.OmegaT, a = t.a;
      const dC1 = scl(dirRev(q.theta), Ot), dC3 = scl(dirDbl(q.theta), Ot);
      const c1 = composeOnce(Or, dC1), c3 = composeOnce(Or, dC3), dAbs = Ot, cc = dAbs > 0 ? a / dAbs : 0;
      const dE = (R) => 0.5 * I * R.dSq;
      const c2 = DECL.kb.map(([k, b]) => {
        const z = unitOr0(crs(Or, add(Or, dC1))), T0 = scl(applyM(k, b, z, dC1), cc);
        return { k, b, spinRateYr: T0[2] / (I * w) * YR, heatW: cc * b * dAbs * dAbs, heatOverRuler: F.LIT.heat[id] ? cc * b * dAbs * dAbs / F.LIT.heat[id] : null,
          reachYr: b > 0 && cc > 0 ? Math.log(1 / DECL.reachFrac) * I / (b * cc) / YR : null, periodYr: k !== 0 && cc > 0 ? 2 * Math.PI * I / (Math.abs(k) * cc) / YR : null,
          maxRatioGyro: b === 0 ? (nrm(c1.On) + dAbs) / w : null };
      });
      const c4a = DECL.capOverOmega.map((cap) => { const R = composeC4a(Or, dC1, cap); return { cap, incr: R.incr, judge: R.judge }; });
      const old = T343.find((x) => x.id === id && x.src === q.src && x.mag === m);
      out.push({ id, src: q.src, mag: m, retro: r.omega < 0, thetaDeg: q.theta / D2R, dOverOmega: Ot / w,
        c1: { incr: c1.incr, judge: c1.judge, dEJ: dE(c1), reactL: I * dAbs },
        c3: { incr: c3.incr, judge: c3.judge, dEJ: dE(c3), targetDeg: (2 * q.theta / D2R) % 360 },
        c2, c2HeatTotalJ: 0.5 * I * dAbs * dAbs, c2SupplyTotalJ: dE(c1) + 0.5 * I * dAbs * dAbs, c4a,
        old343e: old ? { direction: old.direction, reachYr: old.reachYr } : null });
    }
  }
  return out;
}
/** (C4b) 源の全部を 1 つの飽和で(天体ごと —— 源の方位は同じ面に置く宣言) */
export function c4bTable(ctx = makeCtx()) {
  const rows = P.bodyRows(), T1 = E343.t1Table(ctx), out = [];
  for (const id of DECL.t2Bodies) {
    const r = rows.find((x) => x.id === id), w = Math.abs(r.omega), Or = [0, 0, w];
    for (const m of DECL.magReadings) {
      const ds = r.tilt.map((q) => scl(dirRev(q.theta), T1.find((x) => x.id === id && x.src === q.src && x.sign === 'rev' && x.mag === m).OmegaT));
      for (const sat of DECL.satOverOmega) { const R = composeC4b(Or, ds, sat); out.push({ id, mag: m, sat, lambda: R.lambda, incr: R.incr, judge: R.judge }); }
    }
  }
  return out;
}
/** 窓(C2 の熱の率を同じ係数 X で —— X × Σ_j b̂ a_j abs(ΔΩ_j)・b̂ = 1 を単位に・潮汐の熱を足す) */
export function windowC2(ctx = makeCtx()) {
  const rows = P.bodyRows(), T1 = E343.t1Table(ctx), out = [], kLo = ctx.KB.kLo;
  for (const m of DECL.magReadings) {
    const hOf = (id) => { const r = rows.find((x) => x.id === id), tide = F.tideHeat(r, F.LIT.k2q[id]).heat, u = T1.filter((x) => x.id === id && x.sign === 'rev' && x.mag === m).reduce((t, x) => t + x.a * x.OmegaT, 0); return { tide, u }; };
    const io = hOf('Io'), ju = hOf('Jupiter'), ve = hOf('Venus');
    const cap = (F.LIT.heat.Io - io.tide) / io.u, need = (DECL.highFrac * F.LIT.heat.Jupiter - ju.tide) / ju.u;
    out.push({ mag: m, ioU: io.u, juU: ju.u, venusU: ve.u, juOverRuler: (ju.tide + ju.u) / F.LIT.heat.Jupiter, ioOverObs: (io.tide + io.u) / F.LIT.heat.Io, capX: cap, needX: need,
      needOverCap: cap > 0 ? need / cap : null, bandX: 1 / kLo, openKfree: need <= cap, openK1: need <= Math.min(cap, 1 / kLo) });
  }
  return out;
}

/* ───────── T3 三次元の残り(極の選び方 × 向ける先の写像)───────── */
const tangent = (t, Pp) => { const v = sub(t, scl(Pp, dot(t, Pp))), m = nrm(v); return m > 0 ? scl(v, 1 / m) : null; };
/** 極 Pp に対する写像: ident(そのまま)・rev(逆向き)・dbl(極からの角を 2 倍 —— 極と軸の面の内) */
export function mapAxis(map, v, Pp) {
  if (map === 'ident') return v.slice();
  if (map === 'rev') return scl(v, -1);
  if (map === 'dbl') { const a = E343.angleOf(Pp, v), u = tangent(v, Pp); return u ? add(scl(Pp, Math.cos(2 * a)), scl(u, Math.sin(2 * a))) : v.slice(); }
  throw new RangeError('mapAxis: 写像は ' + DECL.maps.join('・'));
}
export function t3Table() {
  const { S, G, E, Inv } = E343.poles(), out = [];
  for (const [pn, Pp] of [['ecl', E], ['inv', Inv]]) for (const gm of DECL.maps) for (const sm of DECL.maps) {
    const tg = mapAxis(gm, G, Pp), ts = mapAxis(sm, S, Pp), dG = tangent(tg, Pp), dS = tangent(ts, Pp);
    const sep = angleOfDeg(dG, dS), minResid = Math.abs(Math.sin(sep * D2R));
    out.push({ pole: pn, galMap: gm, sunMap: sm, sepDeg: sep, phaseNeedDeg: Math.min(sep, 180 - sep), minResidOverSun: minResid,
      galPoleDeg: angleOfDeg(Pp, tg), sunPoleDeg: angleOfDeg(Pp, ts) });
  }
  return out;
}
const angleOfDeg = (a, b) => E343.angleOf(a, b) / D2R;
/** 合成の読み: 太陽の軸に銀河の向ける先(rev = −G・fwd = G)を比 ρ で足して、合成した先が銀河と 120° になる ρ(平面の閉じた形と三次元)と、合成した先と極の角 */
export function composeBalance() {
  const { S, G, E, Inv } = E343.poles(), th = DECL.balDeg * D2R, out = [];
  for (const [nm, phiS, sv] of [['plane', DECL.sunDeg * D2R, null], ['3d', E343.angleOf(G, S), S]]) for (const [pl, phiG] of [['rev', Math.PI], ['fwd', 0]]) {
    const rho = Math.sin(phiS - th) / Math.sin(th - phiG);   // (cos φs + ρ cos φg, sin φs + ρ sin φg) が角 θ
    const row = { frame: nm, place: pl, sunGalDeg: phiS / D2R, rho, positive: rho > 0, magRatio: Math.hypot(Math.cos(phiS) + rho * Math.cos(phiG), Math.sin(phiS) + rho * Math.sin(phiG)) };
    if (sv) { const c = add(S, scl(G, pl === 'rev' ? -rho : rho)); Object.assign(row, { galDeg: angleOfDeg(G, c), eclDeg: angleOfDeg(E, c), invDeg: angleOfDeg(Inv, c), sunEclDeg: angleOfDeg(E, S) }); }
    out.push(row);
  }
  // 第121報の事実の行: 同じ大きさの 2 つを 120° で合成すると大きさは変わらない(C1 の零試験と同じ)
  return { rows: out, sameMag120: composeOnce([0, 0, 1], [Math.sin(th), 0, Math.cos(th)]).judge };
}
/** 並べる列(〔第343便e〕の平面の比と三次元の残り —— 呼んで読む) */
export function t3Side(ctx = makeCtx()) {
  const t3 = E343.t3Table(ctx), t4 = E343.t4Table(ctx), r = (law, g) => t3.find((x) => x.law === law && x.gal === g && x.thetaDeg === 120).ratio;
  const m4 = (p) => t4.rows.find((x) => x.pole === p && x.gal === 180 && x.law === 'k1');
  return { k1g0: r('k1', 0), k1g180: r('k1', 180), k2g0: r('k2', 0), sepEcl343: m4('ecl').sepDeg, minEcl343: m4('ecl').minResidOverSun, sepInv343: m4('inv').sepDeg, minInv343: m4('inv').minResidOverSun, eclInvDeg: t4.angles.EInv };
}

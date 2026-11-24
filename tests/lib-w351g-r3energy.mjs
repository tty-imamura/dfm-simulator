// 第351便g(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)「AN1008: R3で進める」「AN1001: Aで進める。主要衛星は潮汐ロックしている」・統括の検証項目 R433):
//   **エネルギーの帳簿を (R3) の 2 経路の步の上に載せる —— 1 ステップの帳簿の欄(供給の仕事・軸の運動・動かなかった分・内部熱・慣性回転の増し分・引きずり回転〔比べる列 —— リセットの後の (E1)(E2)(E3)〕)、
//   軸の応答 m と比率のノブ f の関係の置き方 (m1)(m2)(m3)、釣り合い方 (K1)(K2) と (R3) の步だけの列、潮汐ロックの拘束の 2 列(内部熱・場へ返る)、軸が起きる仕事の読み (A0)(A1) —— 診断だけ**
//   (器 tests/exp-w351g-r3energy.mjs と QA behavior.r3energy351g・docs.r3energy351g が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第350便d(torqueMag・supplyRate・heatRun・commonChecks・LIT —— 供給の則と帳簿の照合)・第351便d(r3Coeffs・r3Rate・r3Step・closedR3・rodrigues —— 步)・
//   第351便c(pairParts・pairInput・perpOf・cosTo・bgOm —— イオと月の成分)・第347便e(t1Table・geometry —— 慣性モーメントと自転の率)。
//
// ■ 量(無次元の核 —— 〔第350便d〕の例 fixed と同じ: I = 1・abs(Ω) = 1(Ω = ẑ)・ω_慣性(0) = 1・θ₀ 40°・T 50・1 万步):
//   ŝ = 自転軸(3D・回転〔Rodrigues〕で更新)・Ω∥ = ŝ·Ω = 引きずり回転 ω_D(状態に積まない・毎ステップ作り直す)・Ω⊥ = Ω − Ω∥ ŝ。ω_I = 慣性回転(状態)。ω_T = 前のステップの ω_I + ω_D((S1))。
//   軸の步は第351便d の r3Rate の姿勢の角速度 Θ(経路 ① k₁・経路 ② k₂・ratio)をそのまま使う。
// ■ 供給の則(仮定の列 —— 供給の率の出どころは決まっていない): (P1) P = (1 − m) × トルクの大きさ × abs(Ω⊥)(〔第350便d〕の supplyRate そのもの)/(P0) 供給 0(対照 —— 必ず並べる)。
//   「総量」G = トルクの大きさ × abs(Ω⊥)(m の前)。動かなかった分 = (1 − m) G = 供給の仕事。軸の運動の欄は読み (A0) 0・(A1) m G(T5)。
// ■ m と f の関係(T2 —— 列で分ける): (m1) m は f と独立のノブ(〔第350便d〕のまま)/(m2) m = 寄る成分の割合((N1) k₁²・(N2) f・(N3) k₁² ÷ (k₁² + k₂²))/
//   (m3) m = 軸が実際に動いた角 ÷ 拘束が無いとき(k₁ 1)に動く角(閉じた形 —— 窓 τ_w = 1 ÷ abs(Ω))。
// ■ 釣り合い方(T3): 'R3' = 步の率をそのまま(ratio 1)/(K1) ratio = abs(ω_T) ÷ abs(ω₀)(第146報「自転速度が増すと、軸を起こす為のトルクが増して釣り合う」の読み)/
//   (K2) ratio = abs(ω₀) ÷ abs(ω_T)(第145報の回答 9「…傾きにくくなり釣り合う」の読み)。
// ■ 潮汐ロック(T4 —— 本節の模型): ロックの拘束 = 慣性回転を保つ(ω_I 一定)。慣性回転へ入れる読み(主の列の a_in・(E2))は使えない → 行き先は内部熱('heat')か場へ返る('field')。
// ■ 言わないこと: 内部熱の出どころ・天体の内部熱の答え・供給の則の採否とは書かない。この供給の則の仮定・この行き先・この f と m の置き方では、の表。文献の値は固定の比べる列(合わせない)。
import * as AH from './lib-w350d-axisheat.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w351g-r3energy-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  rules: AH.DECL.rules, cols: AH.DECL.cols, bals: Object.freeze(['R3', 'K1', 'K2']), mMaps: Object.freeze(['m1', 'm2', 'm3']), locks: Object.freeze(['none', 'heat', 'field']),
  norms: Object.freeze(['N1', 'N2']), fShow: R3.DECL.fShow,
  /** 軸の步の積分: exact = 2 経路の流れの合成(一定の Ω では 2 つの流れは可換 —— 経路 ① は第351便d の closedR3・経路 ② は Ω のまわりの回転)/rot = 第351便d の r3Rate の Θ の回転 1 回(r3Step の rot と同じ) */
  integ: Object.freeze(['exact', 'rot']), thFloorDeg: 1e-150,
  /** 例 fixed(〔第350便d〕と同じ組) */
  base: AH.DECL.base,
  /** (m1) の m の格子・(m3) の窓 */
  m1Grid: Object.freeze([0, 0.5]), m3Win: 1,
  /** T3 釣り合い方(〔第350便d〕の表 6 と同じ時間と步) */
  bal: Object.freeze({ T: AH.DECL.bal.T, steps: AH.DECL.bal.steps, theta0Deg: AH.DECL.bal.theta0Deg }),
  /** 行き先の列(T2・T3) */
  dests: Object.freeze({ heat: Object.freeze({ split: Object.freeze([1, 0, 0]), col: 'E1' }), inertial: Object.freeze({ split: Object.freeze([0, 1, 0]), col: 'E1' }),
    dragE1: Object.freeze({ split: Object.freeze([0, 0, 1]), col: 'E1' }), dragE2: Object.freeze({ split: Object.freeze([0, 0, 1]), col: 'E2' }), dragE3: Object.freeze({ split: Object.freeze([0, 0, 1]), col: 'E3' }) }),
  /** T4 潮汐ロックの天体(イオ —— 内部熱の検証用〔第138報 回答 4〕・月)・由来・成分・読み (C2) が主 */
  lockBodies: Object.freeze([Object.freeze(['Io', 'Jupiter']), Object.freeze(['Moon', 'EarthHi'])]), origins: Object.freeze(['sun', 'parent', 'local']), parts: SP.DECL.parts, read: 'C2', den: 'out',
  /** 頭打ちの物差し(〔第350便d〕と同じ)・〔第350便d〕の数(比べる列) */
  flatTol: AH.DECL.flatTol, ref350d: Object.freeze({ inertial: 22.422214981379305, drag: 1.766044443118978, k1Range: '2.0〜2.6', k2Range: '2.0〜2.9' }),
  judge: '丸めの床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
/** 文献の値(固定の比べる列 —— 合わせない・〔第341便f〕の lib の値をそのまま) */
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', heat: AH.LIT.heat, heatSrc: AH.LIT.heatSrc });

/* ───────── m と f ───────── */
/** (m1) m は独立・(m2) 寄る成分の割合・(m3) 動いた角 ÷ 拘束が無いときに動く角(閉じた形・窓 τ_w) */
export function mOf({ mMap = 'm1', m = 0, kTilt, kPrec, norm = 'N1', theta0Deg = DECL.base.theta0Deg, Om = DECL.base.Om, win = DECL.m3Win }) {
  if (!DECL.mMaps.includes(mMap)) throw new RangeError('mOf: 置き方は ' + DECL.mMaps.join('・'));
  if (!(fin(kTilt) && fin(kPrec) && kTilt >= 0)) throw new RangeError('mOf: k₁ ≥ 0・k₂');
  if (mMap === 'm1') { if (!(fin(m) && m >= 0 && m <= 1)) throw new RangeError('mOf: m ∈ [0,1]'); return m; }
  if (mMap === 'm2') return norm === 'N2' ? kTilt : kTilt * kTilt / (kTilt * kTilt + kPrec * kPrec);
  if (kTilt === 0 || Om === 0) return 0;
  const a = R3.closedR3({ th0Deg: theta0Deg, Om, t: win, kTilt, kPrec: 0 }).thDeg, b = R3.closedR3({ th0Deg: theta0Deg, Om, t: win, kTilt: 1, kPrec: 0 }).thDeg;
  return (theta0Deg - a) / (theta0Deg - b);
}

/* ───────── 軸の 1 步(2 経路の流れの合成)───────── */
/** 一定の Ω の 1 步: 経路 ①(θ を closedR3 の (α) の式で dt だけ進め、ŝ と Ω を含む面の中で回す)の後に経路 ②(Ω のまわりに k₂ abs(Ω) dt 回す)。2 つの流れは Ω のまわりの回転で可換 */
export function exactStep(s, Omv, k1, k2, dt) {
  const om = nrm(Omv); if (!(om > 0)) return { s: s.slice(), dAng: 0 };
  const oh = scl(Omv, 1 / om), th = R3.angDeg(s, Omv);
  let s1 = s, dAng = 0;
  if (k1 !== 0 && th > DECL.thFloorDeg && th < 180 - DECL.thFloorDeg) {   // 床より小さい角はそろったとみる(非正規の数の向きを作らない)
    const th1 = R3.closedR3({ th0Deg: th, Om: om, t: dt, kTilt: k1, kPrec: 0 }).thDeg, ep = unit(sub(s, scl(oh, dot(s, oh))));
    s1 = add(scl(oh, Math.cos(th1 * D2R)), scl(ep, Math.sin(th1 * D2R))); dAng = Math.abs(th - th1) * D2R;
  }
  if (k2 !== 0) s1 = R3.rodrigues(s1, oh, k2 * om * dt);
  return { s: s1, dAng };
}

/* ───────── 1 本の走り(帳簿つき)───────── */
/**
 * o: { rule, split:[h,a_in,a_dr], col, bal, f, norm, kTilt, kPrec(省けば r3Coeffs(f, norm)), mMap, m, lock, theta0Deg, Om, w0in, T, steps, samples, mut }
 * mut(変異 —— 零試験で落ちることを見る): 'double'(リセットした分を熱と慣性回転の両方へ —— 〔第350便d〕と同じ形)・'noFieldX'(場との交換を帳簿に入れない)
 */
export function r3EnergyRun(o = {}) {
  const { rule = 'P1', split = [0, 1, 0], col = 'E1', bal = 'R3', f = 0, norm = 'N1', mMap = 'm1', m: mIn = 0, lock = 'none', theta0Deg = DECL.base.theta0Deg, Om = DECL.base.Om, w0in = DECL.base.w0in,
    T = DECL.base.T, steps = DECL.base.steps, samples = 0, integ = 'exact', mut = null } = o;
  if (!DECL.integ.includes(integ)) throw new RangeError('r3EnergyRun: 積分は ' + DECL.integ.join('・'));
  if (!DECL.rules.includes(rule)) throw new RangeError('r3EnergyRun: 則は ' + DECL.rules.join('・'));
  if (!DECL.cols.includes(col)) throw new RangeError('r3EnergyRun: 行き先は ' + DECL.cols.join('・'));
  if (!DECL.bals.includes(bal)) throw new RangeError('r3EnergyRun: 釣り合い方は ' + DECL.bals.join('・'));
  if (!DECL.locks.includes(lock)) throw new RangeError('r3EnergyRun: ロックの列は ' + DECL.locks.join('・'));
  if (!(Array.isArray(split) && split.length === 3 && split.every((x) => fin(x) && x >= 0) && Math.abs(split[0] + split[1] + split[2] - 1) < 1e-12)) throw new RangeError('r3EnergyRun: 行き先の割合(和 1・どれも ≥ 0)');
  if (!(fin(Om) && Om >= 0 && fin(w0in) && w0in !== 0 && fin(T) && T > 0 && Number.isInteger(steps) && steps > 0 && fin(theta0Deg))) throw new RangeError('r3EnergyRun: Om ≥ 0・w0in ≠ 0・T > 0・steps');
  if (mut !== null && !['double', 'noFieldX'].includes(mut)) throw new RangeError('r3EnergyRun: 変異の名');
  const c = o.kTilt !== undefined || o.kPrec !== undefined ? { kTilt: o.kTilt ?? 0, kPrec: o.kPrec ?? 0 } : R3.r3Coeffs(f, norm);
  const m = mOf({ mMap, m: mIn, kTilt: c.kTilt, kPrec: c.kPrec, norm, theta0Deg, Om });
  const [h, aIn, aDr] = split, Iz = 1, dt = T / steps, Omv = [0, 0, Om];
  let s = [Math.sin(theta0Deg * D2R), 0, Math.cos(theta0Deg * D2R)], wi = w0in;
  const w0 = wi + dot(s, Omv), sg = w0 >= 0 ? 1 : -1, aw0 = Math.abs(w0);
  let work = 0, heat = 0, given = 0, fieldX = 0, gross = 0, axisA1 = 0, axisAng = 0, residAbs = 0, scaleAbs = 0, torque0 = null, torque = 0, P0 = null, P = 0, sp0 = null, sp = 0;
  const E0 = 0.5 * Iz * w0 * w0, tr = [];
  for (let k = 0; k < steps; k++) {
    const wd = dot(s, Omv); sp = nrm(sub(Omv, scl(s, wd)));
    const wTot = wi + wd, wT = wTot;                                                                       // (S1): 前のステップの合成
    torque = AH.torqueMag({ I: Iz, wT, omPerp: sp }); if (torque0 === null) { torque0 = torque; sp0 = sp; }
    P = AH.supplyRate({ rule, I: Iz, wT, omPerp: sp, f: m }); if (P0 === null) P0 = P;
    const e = P * dt, G = rule === 'P0' ? 0 : torque * sp * dt;
    work += e; gross += G; axisA1 += m * G;
    let hStep = h * e, gStep = 0, eIn = aIn * e;
    if (lock !== 'none') { if (lock === 'heat') hStep += eIn; else gStep += eIn; eIn = 0; }                  // ロック: 慣性回転へ入れる読みは使えない
    const eDr = aDr * e, sgn = wTot === 0 ? sg : (wTot > 0 ? 1 : -1);
    const wTot1 = eIn === 0 ? wTot : sgn * Math.sqrt(wTot * wTot + 2 * eIn / Iz), wi1 = eIn === 0 ? wi : wTot1 - wd;
    const wTot2 = eDr === 0 ? wTot1 : sgn * Math.sqrt(wTot1 * wTot1 + 2 * eDr / Iz), delta = wTot2 - wTot1;
    const ratio = bal === 'K1' ? Math.abs(wT) / aw0 : bal === 'K2' ? aw0 / Math.max(Math.abs(wT), 1e-300) : 1;
    let s1;
    if (integ === 'rot') { const rr = R3.r3Rate(s, Omv, { kTilt: c.kTilt, kPrec: c.kPrec, ratio }); axisAng += nrm(rr.tilt) * dt; s1 = R3.rodrigues(s, rr.Th, nrm(rr.Th) * dt); }
    else { const st = exactStep(s, Omv, c.kTilt * ratio, c.kPrec * ratio, dt); axisAng += st.dAng; s1 = st.s; }
    // リセット(引きずり回転は新しい軸の Ω∥ に作り直す —— δ の行き先は (E1)(E2)(E3)。ロックでは (E2) も使えない)
    const colEff = lock !== 'none' && col === 'E2' ? (lock === 'heat' ? 'E3' : 'E1') : col;
    if (colEff === 'E1') { gStep += eDr; wi = wi1; }
    else if (colEff === 'E3') { hStep += eDr; wi = mut === 'double' ? wi1 + delta : wi1; }
    else wi = delta === 0 ? wi1 : wi1 + delta;
    const wdNew = dot(s1, Omv), fx = 0.5 * Iz * ((wi + wdNew) * (wi + wdNew) - (wi + wd) * (wi + wd));
    const fxBook = mut === 'noFieldX' ? 0 : fx, dEstep = 0.5 * Iz * ((wi + wdNew) * (wi + wdNew) - wTot * wTot);
    heat += hStep; given += gStep; fieldX += fxBook;
    residAbs += Math.abs(e + fxBook - gStep - dEstep - hStep); scaleAbs += Math.abs(e) + Math.abs(fx);
    s = s1;
    if (samples > 0 && (k + 1) % Math.round(steps / samples) === 0) tr.push({ t: (k + 1) * dt, w: wi + dot(s, Omv), thDeg: R3.angDeg(s, Omv), heat });
  }
  const wdEnd = dot(s, Omv), wEnd = wi + wdEnd, E1v = 0.5 * Iz * wEnd * wEnd, spEnd = nrm(sub(Omv, scl(s, wdEnd)));
  const PEnd = AH.supplyRate({ rule, I: Iz, wT: wEnd, omPerp: spEnd, f: m });
  return { rule, split, col, bal, f, norm, kTilt: c.kTilt, kPrec: c.kPrec, mMap, m, lock, T, steps, dt, w0, wEnd, wiEnd: wi, wdEnd, wRatio: wEnd / w0in, wTotRatio: wEnd / w0, wiRatio: wi / w0in,
    thEndDeg: R3.angDeg(s, Omv), sEnd: s, work, heat, given, fieldX, gross, axisA1, axisAng, dE: E1v - E0,
    ledgerResid: (E1v - E0 - (work - heat - given + fieldX)) / (Math.abs(work) + Math.abs(fieldX) + E0), stepResid: residAbs / (scaleAbs + E0),
    torque0, torqueEnd: torque, torqueRatio: torque0 > 0 ? torque / torque0 : null, supply0: P0, supplyEnd: PEnd, perp0: sp0, perpEnd: spEnd, trace: tr };
}
/** 頭打ちか(〔第350便d〕の plateau と同じ物差し)と時定数 */
export function plateau(o) {
  const a = r3EnergyRun(o), b = r3EnergyRun({ ...o, T: 2 * (o.T || DECL.base.T), steps: 2 * (o.steps || DECL.base.steps), samples: 4000 }), d1 = a.wEnd - a.w0, d2 = b.wEnd - a.wEnd;
  const judge = Math.abs(d1) < 1e-12 * Math.abs(a.w0) ? 'none' : Math.abs(d2) <= DECL.flatTol * Math.abs(d1) ? 'flat' : 'grow';
  let tau = null;
  if (judge === 'flat') { const wE = b.wEnd, hit = b.trace.find((p) => Math.abs(p.w - a.w0) >= (1 - Math.exp(-1)) * Math.abs(wE - a.w0)); tau = hit ? hit.t : null; }
  return { a, b, judge, tau };
}

/* ───────── T1 トルクと自転の仕事率 ───────── */
/** 経路 ①・② のトルク(I ω_L dŝ/dt —— 角運動量の向きだけを変える)と自転の角速度 ω_T ŝ の内積(仕事率 τ·ω)。返すのは abs(τ·ω) ÷ (abs(τ) abs(ω)) の最大 */
export function torquePower(cases) {
  let worst = 0, n = 0;
  for (const { s, Om, wT = 1.7, wL = 1.3, kTilt = 1, kPrec = 1 } of cases) {
    const sh = unit(s), r = R3.r3Rate(sh, Om, { kTilt, kPrec });
    for (const v of [r.tilt, r.prec]) { const tau = scl(v, wL), w = scl(sh, wT), d = Math.abs(dot(tau, w)), sc = nrm(tau) * nrm(w); if (sc > 0) { worst = Math.max(worst, d / sc); n++; } }
  }
  return { worst, n };
}
export const POWER_CASES = Object.freeze([[0.3, -0.2, 0.9], [1, 0, 0], [0.1, 0.7, -0.7], [-0.5, 0.5, 0.2], [0.64, 0, 0.77]].flatMap((s) =>
  [[0, 0, 1], [0.2, -1, 0.4], [3, 1, -2]].map((Om) => Object.freeze({ s: Object.freeze(s), Om: Object.freeze(Om) }))));

/* ───────── T2 m と f(表 1)───────── */
export function mfRows() {
  const out = [], D = DECL.dests;
  for (const norm of DECL.norms) for (const f of DECL.fShow) for (const [mMap, m] of [['m1', 0], ['m1', 0.5], ['m2', null], ['m3', null]]) {
    const base = { f, norm, mMap, m: m ?? 0 }, H = r3EnergyRun({ ...base, ...D.heat }), A = r3EnergyRun({ ...base, ...D.inertial });
    const H0 = r3EnergyRun({ ...base, ...D.heat, rule: 'P0' }), A0 = r3EnergyRun({ ...base, ...D.inertial, rule: 'P0' });
    out.push({ norm, f, mMap, mSet: m, m: H.m, kTilt: H.kTilt, kPrec: H.kPrec, thEndDeg: H.thEndDeg, heatH: H.heat, workH: H.work, wRatioH: H.wRatio, heatA: A.heat, wiRatioA: A.wiRatio, wRatioA: A.wRatio, workA: A.work,
      thEndA: A.thEndDeg, p0Heat: Math.max(H0.heat, A0.heat), p0Wi: Math.max(Math.abs(H0.wiRatio - 1), Math.abs(A0.wiRatio - 1)), ledger: Math.max(Math.abs(H.ledgerResid), Math.abs(A.ledgerResid), H.stepResid, A.stepResid) });
  }
  return out;
}

/* ───────── T3 釣り合い方(表 2)───────── */
export function balRows() {
  const out = [], B = DECL.bal;
  for (const bal of DECL.bals) for (const f of DECL.fShow) for (const dest of ['heat', 'inertial', 'dragE1', 'dragE2']) {
    const R = plateau({ ...DECL.dests[dest], bal, f, norm: 'N1', mMap: 'm2', T: B.T, steps: B.steps, theta0Deg: B.theta0Deg }), A = R.a;
    out.push({ bal, f, dest, m: A.m, wRatio: A.wRatio, wRatio2T: R.b.wRatio, thEndDeg: A.thEndDeg, heat: A.heat, heat2T: R.b.heat, work: A.work, judge: R.judge, tau: R.tau,
      perpRatio: A.perp0 > 0 ? A.perpEnd / A.perp0 : null, supplyRatio: A.supply0 > 0 ? A.supplyEnd / A.supply0 : null, ledger: Math.max(Math.abs(A.ledgerResid), A.stepResid) });
  }
  return out;
}

/* ───────── T4 潮汐ロックの天体(表 3)───────── */
export function lockRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const [id, src] of DECL.lockBodies) {
    const PP = SP.pairParts(T1, GEO, id, src, { read: DECL.read, den: DECL.den }), Pin = SP.pairInput(T1, GEO, id, src), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2');
    const sHat = Pin.sHat, w = Math.abs(r2.omega), Iz = r2.I, lit = LIT.heat[id] ?? null;
    const row = (origin, part, Om) => {
      const perp = nrm(SP.perpOf(sHat, Om)), P1 = AH.supplyRate({ rule: 'P1', I: Iz, wT: w, omPerp: perp }), P0 = AH.supplyRate({ rule: 'P0', I: Iz, wT: w, omPerp: perp });
      return { id, src, origin, part, om: nrm(Om), cos: SP.cosTo(sHat, Om), perp, supplyW: P1, lockHeatW: P1, lockFieldW: 0, p0W: P0, heatRuler: lit, overLit: lit ? P1 / lit : null, inertialRateYr: P1 / (Iz * w * w) * YR };
    };
    for (const origin of DECL.origins) for (const part of DECL.parts) {
      const Om = origin === 'sun' ? PP.sun[part] : origin === 'parent' ? PP.parent[part] : add(PP.sun[part], PP.parent[part]);
      out.push(row(origin, part, Om));
    }
    out.push(row('localBg', 'MS', add(add(PP.sun.MS, PP.parent.MS), SP.bgOm(id))));
  }
  return out;
}

/* ───────── T5 軸が起きる仕事の読み(表 4)───────── */
export function axisWorkRows() {
  const out = [];
  for (const f of DECL.fShow) for (const rule of DECL.rules) {
    const A = r3EnergyRun({ ...DECL.dests.inertial, f, norm: 'N1', mMap: 'm2', rule });
    out.push({ f, rule, m: A.m, gross: A.gross, work: A.work, axisA0: 0, axisA1: A.axisA1, sumA1: A.work + A.axisA1, axisAngDeg: A.axisAng / D2R, thEndDeg: A.thEndDeg,
      dEi: 0.5 * (A.wiEnd * A.wiEnd - 1), dLi: Math.abs(A.wiEnd) - 1, fieldX: A.fieldX, dE: A.dE, ledger: Math.max(Math.abs(A.ledgerResid), A.stepResid) });
  }
  return out;
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes() {
  const R = (o) => r3EnergyRun({ T: 10, steps: 2000, ...o }), D = DECL.dests;
  const kinds = [[[0, 1, 0], 'E1'], [[1, 0, 0], 'E1'], [[0.5, 0.5, 0], 'E1'], [[0, 0, 1], 'E1'], [[0, 0, 1], 'E2'], [[0, 0, 1], 'E3']];
  // ① 経路 ①・② のトルクは自転軸に直交 → 自転への仕事率 τ·ω は 0
  const pw = torquePower(POWER_CASES);
  // ② 供給 0 の対照 (P0): f に依らず熱 0・慣性回転は不変(行き先 6 × f 3 × 釣り合い方 3)
  const z2 = Math.max(...kinds.flatMap(([split, col]) => DECL.fShow.flatMap((f) => DECL.bals.map((bal) => { const a = R({ rule: 'P0', split, col, f, bal }); return Math.abs(a.heat) + Math.abs(a.work) + Math.abs(a.wiEnd - 1) + Math.abs(a.given); }))));
  // ③ 帳簿の残差が丸めの床/リセットした分を熱と慣性回転の両方へ入れる変異・場との交換を落とす変異で落ちる
  const led = Math.max(...kinds.flatMap(([split, col]) => DECL.fShow.flatMap((f) => DECL.bals.map((bal) => { const a = R({ split, col, f, bal, mMap: 'm2' }); return Math.max(Math.abs(a.ledgerResid), a.stepResid); }))));
  const ledLock = Math.max(...kinds.flatMap(([split, col]) => ['heat', 'field'].map((lock) => { const a = R({ split, col, f: 0.5, lock }); return Math.max(Math.abs(a.ledgerResid), a.stepResid); })));
  const mD = R({ split: [0, 0, 1], col: 'E3', mut: 'double', f: 0.5 }), mF = R({ split: [0, 1, 0], col: 'E1', f: 0.5, mut: 'noFieldX' });
  // ④ f 0 は〔第350便d〕の歳差だけの列(heatRun の bal 'none')と同じ数(行き先 6 × m 2 × 則 2)
  const f0 = Math.max(...kinds.flatMap(([split, col]) => [0, 0.5].flatMap((m) => DECL.rules.map((rule) => {
    const a = R({ split, col, f: 0, m, rule }), b = AH.heatRun({ split, col, m, rule, T: 10, steps: 2000 });
    return Math.abs(a.wEnd - b.wEnd) / Math.abs(b.wEnd) + Math.abs(a.heat - b.heat) / Math.max(Math.abs(b.work), 1) + Math.abs(a.work - b.work) / Math.max(Math.abs(b.work), 1) + Math.abs(a.thEndDeg - b.thEndDeg);
  }))));
  // f 0 の例 fixed は〔第350便d〕の 22.4 倍・1.77 倍
  const r22 = { inertial: r3EnergyRun({ ...D.inertial, f: 0 }).wRatio, dragE1: r3EnergyRun({ ...D.dragE1, f: 0 }).wRatio };
  // ⑤ 軸の步は第351便d の r3Step と同じ(P0・回転 1 回・刻み同じ —— 釣り合い方 R3)
  const vsD = Math.max(...[0.5, 1].flatMap((f) => DECL.norms.map((norm) => {
    const c = R3.r3Coeffs(f, norm), a = R({ rule: 'P0', f, norm, integ: 'rot' }), b = R3.r3Step({ ...c, T: 10, dt: 10 / 2000, integ: 'rot' }); return R3.angDeg(a.sEnd, b.sEnd);
  })));
  // ⑤′ exact の步は閉じた形(第351便d の closedR3)と同じ θ(P0・R3・f 0.25・0.5・1)と、rot の步は刻みを細かくすると exact に寄る(f 0.5)
  const vsC = Math.max(...[0.25, 0.5, 1].map((f) => { const c = R3.r3Coeffs(f, 'N1'), a = R({ rule: 'P0', f, T: 3, steps: 600 }); return Math.abs(a.thEndDeg - R3.closedR3({ ...c, t: 3 }).thDeg); }));
  const conv = [600, 2400].map((n) => { const a = R({ rule: 'P0', f: 0.5, T: 3, steps: n, integ: 'rot' }), b = R({ rule: 'P0', f: 0.5, T: 3, steps: n }); return R3.angDeg(a.sEnd, b.sEnd); });
  // ⑥ 軸が合成の向きにそろった後(Ω⊥ → 0)は供給も止まる(f 1・(N1)・m1 0・例 fixed)
  const stop = r3EnergyRun({ ...D.inertial, f: 1, mMap: 'm1', m: 0 });
  // ⑦ (A0)(A1): 供給の仕事 + 軸の運動の欄 (A1) = 総量 G(m2 —— f 3)
  const a1 = Math.max(...DECL.fShow.map((f) => { const a = R({ ...D.inertial, f, mMap: 'm2' }); return Math.abs(a.work + a.axisA1 - a.gross) / Math.max(a.gross, 1e-300); }));
  // ⑧ m の置き方: (m2) (N1) = k₁²・(N2) = f/(m3) は k₁ 0 で 0・k₁ 1 で 1/(m1) はそのまま
  const c5 = R3.r3Coeffs(0.5, 'N1'), mm = { n1: mOf({ mMap: 'm2', ...c5, norm: 'N1' }), n2: mOf({ mMap: 'm2', ...R3.r3Coeffs(0.25, 'N2'), norm: 'N2' }), m3a: mOf({ mMap: 'm3', kTilt: 0, kPrec: 1 }), m3b: mOf({ mMap: 'm3', kTilt: 1, kPrec: 0 }), m1: mOf({ mMap: 'm1', m: 0.3, kTilt: 1, kPrec: 0 }) };
  // ⑨ ロックの拘束: 慣性回転は不変・(heat) では供給が全部熱・(field) では熱 0
  const lh = R({ ...D.inertial, f: 0.5, lock: 'heat' }), lf = R({ ...D.inertial, f: 0.5, lock: 'field' }), lh2 = R({ ...D.dragE2, f: 0.5, lock: 'heat' });
  const lockOk = { wi: Math.max(Math.abs(lh.wiEnd - 1), Math.abs(lf.wiEnd - 1), Math.abs(lh2.wiEnd - 1)), heat: Math.abs(lh.heat - lh.work) / lh.work + Math.abs(lh2.heat - lh2.work) / lh2.work, field: lf.heat + Math.abs(lf.given - lf.work) / lf.work };
  // ⑩ 共通の点検の数(〔第350便d〕の lib の commonChecks を呼ぶ)
  const cc = AH.commonChecks();
  // ⑪ 入力の拒否
  const rej = [() => r3EnergyRun({ split: [0.5, 0.5, 0.5] }), () => r3EnergyRun({ rule: 'P9' }), () => r3EnergyRun({ col: 'E9' }), () => r3EnergyRun({ bal: 'none' }), () => r3EnergyRun({ lock: 'x' }),
    () => r3EnergyRun({ w0in: 0 }), () => r3EnergyRun({ mut: 'x' }), () => mOf({ mMap: 'm9', kTilt: 1, kPrec: 0 }), () => mOf({ mMap: 'm1', m: 2, kTilt: 1, kPrec: 0 }), () => r3EnergyRun({ f: 2 }), () => r3EnergyRun({ integ: 'mid' })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { pw, z2, led, ledLock, mledD: Math.abs(mD.ledgerResid), mledF: Math.abs(mF.ledgerResid), f0, r22, vsD, vsC, conv, stop: { perp: stop.perpEnd / stop.perp0, supply: stop.supplyEnd / stop.supply0, wRatio: stop.wRatio },
    a1, mm, lockOk, cc, rejects: rej };
}
export function pureGates(S) {
  const C = S.cc, near = (a, b, tol) => Math.abs(a - b) <= tol;
  return {
    torquePower: S.pw.worst < 1e-12 && S.pw.n === 30,
    p0Zero: S.z2 < 1e-12,
    ledger: S.led < 1e-9 && S.ledLock < 1e-9 && S.mledD > 1e-3 && S.mledF > 1e-3,
    f0is350d: S.f0 < 1e-9 && Math.abs(S.r22.inertial - DECL.ref350d.inertial) < 1e-9 && Math.abs(S.r22.dragE1 - DECL.ref350d.drag) < 1e-9,
    stepIs351d: S.vsD < 1e-9 && S.vsC < 1e-9 && S.conv[1] < S.conv[0] / 3,
    supplyStops: S.stop.perp < 1e-9 && S.stop.supply < 1e-9 && Number.isFinite(S.stop.wRatio),
    axisA1: S.a1 < 1e-12,
    mMaps: near(S.mm.n1, 0.5, 1e-15) && S.mm.n2 === 0.25 && S.mm.m3a === 0 && near(S.mm.m3b, 1, 1e-15) && S.mm.m1 === 0.3,
    lock: S.lockOk.wi === 0 && S.lockOk.heat < 1e-12 && S.lockOk.field < 1e-12,
    common: near(C.dxZ, -0.03061311, 5e-9) && near(C.sixZ, -0.01530656, 5e-9) && near(C.wZ, -0.01530612, 5e-9),
    rejects: S.rejects.length === 11 && S.rejects.every(Boolean),
  };
}

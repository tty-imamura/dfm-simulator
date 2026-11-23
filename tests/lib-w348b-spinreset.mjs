// 第348便b(原仮定者の回答(2026-11-23 —— 第145報の回答 10)「AN975」・統括の検証項目 R410):
//   **トルクの式の自転速度 = 前のステップの「慣性回転 + 引きずり回転」・引きずり回転は毎ステップリセット —— 步の形(離散)の型 S1・S2・S2′(と対照 S2″)と、
//   リセットの後のエネルギーの行き先 E1・E2・E3 を、〔第347便i〕のケース 1・ケース 2 の例・刻みの依り方・天体の桁で並べる純関数 —— 診断だけ**
//   (器 tests/exp-w348b-spinreset.mjs と QA behavior.spinreset348b・docs.spinreset348b が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第347便i(runCase —— (D1)(D2)(D3) の同じ入力の列・stiffness —— 「傾きにくくなり」の判定・tdRows —— (Td) の連続の列・
//   bodyRows —— 天体の Ω と観測の比べる列・DECL —— 行き先の割合と格子)・第347便h(bodyRows —— 天体の Ω)・第347便e(t1Table)・第344便e(composeBalance —— 120° の例の比 ρ)・
//   第343便e(poles —— 太陽の軸と銀河の向き)。
//
// ■ 量(無次元の核 —— I = 1・abs(Ω) = 1・ω_慣性(0) = 1 —— 〔第347便i〕と同じ組): 場の回転 Ω と自転の軸の角 θ —— Ω∥ = abs(Ω) cos θ・Ω⊥ = abs(Ω) sin θ。
//   **引きずり回転は状態として積まない** —— 毎ステップ、場の値 Ω∥ に作り直す(リセット)。自転(合成)= ω_慣性 + Ω∥。
//   步 n(刻み Δt)の順: ① トルクの式の自転速度 ω_T(n) を型で決める ② 軸が動かなかった分の率 P = (1 − f) I ω_T Ω⊥²(行き先の割合 h・a_in・a_dr)
//   ③ 熱へ h P Δt・慣性回転へ a_in P Δt(エネルギーで厳密に解く)④ 引きずり回転へ a_dr P Δt —— この步の引きずり回転は Ω∥ + δ(n)
//   ⑤ この步で回った角 ÷ Δt = ω_慣性 + Ω∥ + δ(n) ⑥ 軸の更新(型 Tc・TaTc)⑦ リセット —— δ(n) の分のエネルギーの行き先 E1 場へ返る/E2 慣性回転へ移る/E3 熱、
//   引きずり回転は新しい軸の Ω∥ に作り直す(合成の自転が変わった分は「場との交換」として帳簿に入れる)。
// ■ 型(「その前のステップとの差分を使用し」の読み —— 統括の読み・型は決めない):
//   (S1) ω_T(n) = ω_慣性(n−1) + ω_引きずり(n−1)(前の步の終わりの 2 つの値の合成 —— 引きずり回転はリセットの後の Ω∥)
//   (S2) ω_T(n) = 前の步で回った角 ÷ Δt(= ω_慣性 + Ω∥ + δ —— リセットの前に回った分を含む。最初の步は履歴が無いので (S1) と同じ)
//   (S2′) ω_T は (S2) と同じ。加えて、回った角の差分を次の步の慣性回転にも使う: ω_慣性(n) = 回った角 ÷ Δt − Ω∥(新しい軸)(引きずりで回った分が慣性へ移る —— E2 に当たる)
//   (S2″)(対照)回った角の差分を**そのまま**次の步の慣性回転にする(Ω∥ が毎步慣性へ積まれる —— 刻みに反比例して増える)
// ■ 言わないこと: 自転の式・釣り合いの形・歳差・ジャイロトルクの採否の答えとは書かない。この型・この例・このノブでは、の表。観測の値は固定の比べる列(合わせない)。
import * as I from './lib-w347i-axisenergy.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as C344 from './lib-w344e-spincompose.mjs';
import * as E343 from './lib-w343e-spintransfer.mjs';

export const LIB_VERSION = 'w348b-spinreset-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  types: Object.freeze(['S1', 'S2', 'S2p', 'S2pp']), cols: Object.freeze(['E1', 'E2', 'E3']),
  /** 表に並べる種(型 × 行き先)—— (S2′) は E2 に当たる 1 列・(S2″) は対照(T4・零試験だけ) */
  kinds1: Object.freeze([['S1', 'E1'], ['S1', 'E2'], ['S1', 'E3'], ['S2', 'E1'], ['S2', 'E2'], ['S2', 'E3'], ['S2p', 'E2']]),
  kinds2: Object.freeze([['S1', 'E1'], ['S1', 'E2'], ['S1', 'E3'], ['S2p', 'E2']]),
  /** ケース 1(〔第347便i〕表 4 と同じ組) */
  splits: I.DECL.splits, fCase1: I.DECL.fCase1, theta0Deg: I.DECL.theta0Deg, T: I.DECL.T, steps: I.DECL.steps, tauD3: I.DECL.tauD3,
  /** ケース 2(〔第347便i〕表 5 と同じ組 —— 行き先は慣性回転だけと引きずり回転だけの 2 つ) */
  bals: I.DECL.bals, kdList: I.DECL.kdList, kd: I.DECL.kd, f0: I.DECL.f0, omegaC: I.DECL.omegaC, nTb: I.DECL.nTb, T2: I.DECL.T2, steps2: I.DECL.steps2, flatTol: I.DECL.flatTol,
  splitsCase2: Object.freeze([Object.freeze([0, 1, 0]), Object.freeze([0, 0, 1])]),
  /** T4 刻みの依り方: ケース 1 の T 50 を 1000・10000・100000 步 */
  dtSteps: Object.freeze([1000, 10000, 100000]),
  /** (Td)(〔第347便i〕表 7 と同じ組) */
  tdScales: I.DECL.tdScales, tdKg: I.DECL.tdKg, tdT: I.DECL.tdT, tdSteps: I.DECL.tdSteps, tdReach: I.DECL.tdReach,
  /** T5 天体(〔第347便i〕表 9 と同じ 4 組 × q 2)・アプリの本の刻みの例 [s](🟫 水星の記録: dt 0.016 × 380027 步 = 8 公転 —— 1 步 ≈ 160 s) */
  bodies: I.DECL.bodies, bodyQ: I.DECL.bodyQ, appDtSec: 160,
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 1 本の走り(步の形)───────── */
/**
 * o: { type: S1|S2|S2p|S2pp, col: E1|E2|E3, bal, split: [h, a_in, a_dr], f, theta0Deg, Om, w0in, T, steps, kd, n, omegaC, accumulate, mut }
 * accumulate: 引きずり回転を積む形に戻す(リセットしない・場の値に作り直さない・ω_引きずり(0) = 0 —— 〔第347便i〕の (D1) の步の形。θ は固定の組だけ)
 * mut(変異 —— 零試験で落ちることを見る): 'noFieldX'(場との交換を帳簿に入れない)・'dropDelta'(E2 で δ を慣性へ移さない —— 帳簿は E2 のまま)
 */
export function stepRun(o) {
  const { type = 'S1', col = 'E1', bal = 'none', split = [0, 1, 0], f = 0, theta0Deg = DECL.theta0Deg, Om = 1, w0in = 1, T = DECL.T, steps = DECL.steps,
    kd = DECL.kd, n = DECL.nTb, omegaC = DECL.omegaC, accumulate = false, mut = null, samples = 0 } = o;
  if (!DECL.types.includes(type)) throw new RangeError('stepRun: 型は ' + DECL.types.join('・'));
  if (!DECL.cols.includes(col)) throw new RangeError('stepRun: 行き先は ' + DECL.cols.join('・'));
  if ((type === 'S2p' || type === 'S2pp') && col !== 'E2') throw new RangeError('stepRun: (S2′)・(S2″) は E2 に当たる(列は 1 つ)');
  if (!DECL.bals.includes(bal)) throw new RangeError('stepRun: 釣り合いの型は ' + DECL.bals.join('・'));
  if (!(Array.isArray(split) && split.length === 3 && split.every((x) => fin(x) && x >= 0) && Math.abs(split[0] + split[1] + split[2] - 1) < 1e-12)) throw new RangeError('stepRun: 行き先の割合(h + a_in + a_dr = 1・どれも ≥ 0)');
  if (!(fin(f) && f >= 0 && f <= 1 && fin(Om) && Om >= 0 && fin(w0in) && w0in >= 0 && fin(T) && T > 0 && Number.isInteger(steps) && steps > 0)) throw new RangeError('stepRun: f・Om・w0in・T・steps');
  if (accumulate && (type !== 'S1' || bal !== 'none')) throw new RangeError('stepRun: 積む形は (S1)・釣り合いの型なしだけ');
  const [h, aIn, aDr] = split, Iz = 1, dt = T / steps, th0 = theta0Deg * D2R;
  let th = th0, wi = w0in, wdAcc = 0, prevRot = null;
  const dragOf = (t) => (accumulate ? wdAcc : Om * Math.cos(t));
  const w0 = wi + dragOf(th), wRef = w0;
  const fEff = (w) => (bal === 'Tbm' ? DECL.f0 * Math.pow(wRef / w, n) : bal === 'Tbp' ? 1 - (1 - DECL.f0) * Math.pow(wRef / w, n)
    : bal === 'Tbc' ? 1 - (1 - DECL.f0) * Math.max(0, (omegaC * wRef - w) / (omegaC * wRef - wRef)) : f);
  const scaleTa = (w) => ((bal === 'Ta' || bal === 'TaTc') ? wRef / w : 1);
  let work = 0, heat = 0, given = 0, fieldX = 0, torque0 = null, torqueMax = -Infinity, torque = 0, wUsedEnd = w0;
  const E0 = 0.5 * Iz * w0 * w0, tr = [];
  for (let k = 0; k < steps; k++) {
    const sp = Om * Math.sin(th), wd = dragOf(th), wTot = wi + wd;
    const wT = (type === 'S1' || prevRot === null) ? wTot : prevRot;   // ① トルクの式の自転速度
    const P = (1 - fEff(wTot)) * Iz * wT * sp * sp;                   // ②
    torque = Iz * wT * sp; if (torque0 === null) torque0 = torque; if (torque > torqueMax) torqueMax = torque; wUsedEnd = wT;
    work += P * dt; heat += h * P * dt;                                 // ③
    const eIn = aIn * P * dt, eDr = aDr * P * dt;
    const wTot1 = eIn === 0 ? wTot : Math.sqrt(wTot * wTot + 2 * eIn / Iz), wi1 = eIn === 0 ? wi : wTot1 - wd;
    const wTot2 = eDr === 0 ? wTot1 : Math.sqrt(wTot1 * wTot1 + 2 * eDr / Iz), delta = wTot2 - wTot1;   // ④ この步の引きずり回転 = wd + δ
    const rot = wi1 + wd + delta;                                       // ⑤ この步で回った角 ÷ Δt
    const th1 = (bal === 'Tc' || bal === 'TaTc') ? th - kd * Om * Math.sin(th) * scaleTa(wTot) * dt : th;   // ⑥
    // ⑦ リセット
    if (accumulate) { wi = wi1; wdAcc = wd + delta; }
    else if (type === 'S1' || type === 'S2') {
      if (col === 'E1') { given += eDr; wi = wi1; }
      else if (col === 'E3') { heat += eDr; wi = wi1; }
      else wi = (mut === 'dropDelta' || delta === 0) ? wi1 : wi1 + delta;
      const wdNew = Om * Math.cos(th1);
      if (mut !== 'noFieldX') fieldX += 0.5 * Iz * ((wi + wdNew) * (wi + wdNew) - (wi + wd) * (wi + wd));
    } else if (type === 'S2p') { wi = rot - Om * Math.cos(th1); }      // 合成の自転は回った角のまま(場との交換なし)
    else { const wdNew = Om * Math.cos(th1); fieldX += 0.5 * Iz * ((rot + wdNew) * (rot + wdNew) - rot * rot); wi = rot; }   // (S2″) 対照
    th = th1; prevRot = rot;
    if (samples > 0 && (k + 1) % Math.round(steps / samples) === 0) tr.push({ t: (k + 1) * dt, w: wi + dragOf(th), wi, thDeg: th / D2R });
  }
  const wEnd = wi + dragOf(th), E1v = 0.5 * Iz * wEnd * wEnd;
  return { type, col, bal, split, f, T, steps, dt, w0, wEnd, wiEnd: wi, wdEnd: dragOf(th), wRatio: wEnd / w0in, wiRatio: w0in > 0 ? wi / w0in : null, thEndDeg: th / D2R,
    work, heat, given, fieldX, dE: E1v - E0, ledgerResid: (E1v - E0 - (work - heat - given + fieldX)) / Math.max(Math.abs(work) + Math.abs(fieldX), 1e-300),
    torque0, torqueEnd: torque, torqueRatio: torque0 > 0 ? torque / torque0 : null, torqueMaxRatio: torque0 > 0 ? torqueMax / torque0 : null, wUsedEnd, trace: tr };
}
/** 頭打ちか(T と 2T の自転の差 ÷ 0 から T の差)—— 〔第347便i〕の plateau と同じ物差し */
export function plateau(o, samples = 0) {
  const a = stepRun(o), b = stepRun({ ...o, T: 2 * (o.T || DECL.T), steps: 2 * (o.steps || DECL.steps), samples }), d1 = a.wEnd - a.w0, d2 = b.wEnd - a.wEnd;
  const tq = a.torqueRatio !== null && a.torqueRatio > 0 ? Math.abs(b.torqueRatio - a.torqueRatio) / a.torqueRatio : 0;
  return { a, b, wJudge: Math.abs(d1) < 1e-12 ? 'none' : Math.abs(d2) <= DECL.flatTol * Math.abs(d1) ? 'flat' : 'grow', torqueFlat: tq <= DECL.flatTol, growLate: d2 / Math.max(Math.abs(d1), 1e-300) };
}
/** 連続の極限の閉じた形(θ 固定・釣り合いの型なし・I = 1・abs(Ω) = 1): ω(t) = ω_慣性(0) + cos θ₀ + a_eff (1 − f) sin² θ₀ t(a_eff = a_in〔E1・E3〕・a_in + a_dr〔E2・(S2′)〕) */
export function closedFixed({ col, split, f, theta0Deg = DECL.theta0Deg, w0in = 1, t }) {
  const th = theta0Deg * D2R, aEff = col === 'E2' ? split[1] + split[2] : split[1];
  return w0in + Math.cos(th) + aEff * (1 - f) * Math.sin(th) ** 2 * t;
}
/** 連続の極限の閉じた形(軸が起きる型 (Tc)・(Ta)+(Tc)): 届く先 ω∞ */
export function closedAlign({ type, col, split, f = DECL.f0, theta0Deg = DECL.theta0Deg, kd = DECL.kd, w0in = 1, ta = false }) {
  const th0 = theta0Deg * D2R, A = (col === 'E2' ? split[1] + split[2] : split[1]) * (1 - f), c0 = 1 - Math.cos(th0), w0 = w0in + Math.cos(th0), field = type === 'S2p' ? 0 : 1;
  if (!ta) return w0 + (A / kd + field) * c0;
  const c = A / (kd * w0);
  if (c === 0) return w0 + field * c0;
  return field === 0 ? w0 * Math.exp(c * c0) : (w0 + 1 / c) * Math.exp(c * c0) - 1 / c;
}

/* ───────── T2 ケース 1(〔第347便i〕表 4 の組)───────── */
export function case1Rows() {
  const out = [];
  for (const [type, col] of DECL.kinds1) for (const split of DECL.splits) for (const f of DECL.fCase1) {
    const R = plateau({ type, col, split, f }), A = R.a;
    out.push({ type, col, h: split[0], aIn: split[1], aDr: split[2], f, wRatio: A.wRatio, wiRatio: A.wiRatio, wdEnd: A.wdEnd, torqueRatio: A.torqueRatio,
      heatOverWork: A.work > 0 ? A.heat / A.work : null, givenOverWork: A.work > 0 ? A.given / A.work : null, ledgerResid: A.ledgerResid, wJudge: R.wJudge, torqueFlat: R.torqueFlat,
      closed: closedFixed({ col, split, f, t: DECL.T }), closedDiff: Math.abs(A.wEnd - closedFixed({ col, split, f, t: DECL.T })) / closedFixed({ col, split, f, t: DECL.T }) });
  }
  return out;
}
/** 同じ入力の (D1)(D2)(D3)(〔第347便i〕の lib の runCase を呼ぶ —— 表 4 の数と同じ)と、新しい型の ω(T) ÷ ω₀ を並べる */
export function vsIRows(c1 = case1Rows()) {
  const out = [];
  for (const split of DECL.splits) for (const f of DECL.fCase1) {
    const d = (dest, tau = 1, ret = 'field') => I.runCase({ dest, split, f, tau, ret }).wRatio;
    const mine = Object.fromEntries(DECL.kinds1.map(([t, c]) => [t + c, c1.find((r) => r.type === t && r.col === c && r.h === split[0] && r.aIn === split[1] && r.aDr === split[2] && r.f === f).wRatio]));
    out.push({ h: split[0], aIn: split[1], aDr: split[2], f, D1: d('D1'), D2: d('D2'), D3field: d('D3', DECL.tauD3[0], 'field'), D3heat: d('D3', DECL.tauD3[0], 'heat'), mine });
  }
  return out;
}

/* ───────── T3 ケース 2(〔第347便i〕表 5・表 6 の組)───────── */
export function case2Rows() {
  const out = [];
  for (const [type, col] of DECL.kinds2) for (const split of DECL.splitsCase2) for (const bal of DECL.bals) for (const kd of (bal === 'Tc' || bal === 'TaTc' ? DECL.kdList : [DECL.kd])) {
    const o = { type, col, bal, split, f: DECL.f0, kd, T: DECL.T2, steps: DECL.steps2 }, R = plateau(o, 4000), A = R.a, st = I.stiffness(bal);
    const want = bal === 'Tc' ? closedAlign({ type, col, split, kd }) : bal === 'TaTc' ? closedAlign({ type, col, split, kd, ta: true }) : null;
    let reach = null;
    if (R.wJudge === 'flat') { const tr = R.b.trace, wE = tr[tr.length - 1].w; const hit = tr.find((p) => Math.abs(wE - p.w) <= 0.01 * Math.abs(wE - A.w0)); reach = hit ? hit.t : null; }
    const phr = { spin: A.wEnd > A.w0 * (1 + 1e-9), L: A.wEnd > A.w0 * (1 + 1e-9), torque: A.torqueMaxRatio > 1 + 1e-9, harder: st.harder, balance: R.wJudge === 'flat' };
    out.push({ type, col, bal, kd, h: split[0], aIn: split[1], aDr: split[2], w0: A.w0, wRatio: A.wEnd / A.w0, wRatio2T: R.b.wEnd / A.w0, closed: want, closedDiff: want === null ? null : Math.abs(A.wEnd - want) / want,
      thEndDeg: A.thEndDeg, torqueRatio: A.torqueRatio, torqueMaxRatio: A.torqueMaxRatio, wJudge: R.wJudge, reach, fieldXOverWork: A.work > 0 ? A.fieldX / A.work : null, ledgerResid: A.ledgerResid, phr,
      order: Object.values(phr).every(Boolean) ? 'yes' : (bal === 'Tbc' && phr.spin && phr.L && phr.torque && phr.balance) ? 'knob' : 'no' });
  }
  return out;
}
/** (Td) 2 つの源(〔第347便i〕表 7 の組)—— 引きずり回転は合成の場の Ω∥ にリセット。(S1)・(S2′) × k_g 2 × 尺度の型 2 × 自転の倍 2 × 熱と自転へ入る率の読み 2 */
export function tdRows() {
  const { S, G, E: Ecl } = E343.poles(), row = C344.composeBalance().rows.find((r) => r.frame === '3d' && r.place === 'rev'), rho = row.rho;
  const srcs = [S, scl(G, -rho)], sum = add(srcs[0], srcs[1]), sEq = unit(sum), out = [], dt = DECL.tdT / DECL.tdSteps;
  for (const type of ['S1', 'S2p']) for (const kg of DECL.tdKg) for (const sc of ['L', 'Ta']) for (const w0 of DECL.tdScales) for (const rd of ['each', 'sum']) {
    let s = Ecl.slice(), wi = w0, work = 0, fieldX = 0, reach = null;
    const wTot0 = wi + dot(sum, s), ang0 = angDeg(s, sEq), E0 = 0.5 * wTot0 * wTot0;
    for (let k = 0; k < DECL.tdSteps; k++) {
      const wd = dot(sum, s), wTot = wi + wd, fac = sc === 'Ta' ? 1 / wTot : 1;
      let ds = [0, 0, 0], each = 0, perpSum = [0, 0, 0];
      for (const O of srcs) { const pp = sub(O, scl(s, dot(O, s))); ds = add(ds, scl(add(scl(crs(pp, s), kg), scl(pp, DECL.kd)), fac)); each += dot(pp, pp); perpSum = add(perpSum, pp); }
      const X = rd === 'each' ? each : dot(perpSum, perpSum), P = (1 - DECL.f0) * wTot * X;   // I = 1・行き先は慣性回転(h 0)—— ω_T は (S1)・(S2′) とも合成(θ が動くと差は場との交換)
      work += P * dt; const wTot1 = Math.sqrt(wTot * wTot + 2 * P * dt), s1 = unit(add(s, scl(ds, dt))), wdNew = dot(sum, s1);
      if (type === 'S1') { wi = wTot1 - wd; fieldX += 0.5 * ((wi + wdNew) * (wi + wdNew) - wTot1 * wTot1); } else wi = wTot1 - wdNew;
      s = s1;
      if (reach === null && angDeg(s, sEq) <= DECL.tdReach * ang0) reach = (k + 1) * dt;
    }
    const wE = wi + dot(sum, s);
    out.push({ type, kg, scale: sc, w0, read: rd, ang0Deg: ang0, angEndDeg: angDeg(s, sEq), galDegEnd: angDeg(s, G), reach, wRatio: wE / wTot0, wEnd: wE,
      fieldXOverWork: work > 0 ? fieldX / work : null, ledgerResid: (0.5 * wE * wE - E0 - work - fieldX) / Math.max(work + Math.abs(fieldX), 1e-300), ledgerOverE0: (0.5 * wE * wE - E0 - work - fieldX) / E0 });
  }
  const TI = I.tdRows();
  return { rho, eqGalDeg: angDeg(sEq, G), rows: out, iRows: TI.rows.map((r) => ({ kg: r.kg, scale: r.scale, w0: r.w0, read: r.read, reach: r.reach, wRatio: r.wRatio })) };
}

/* ───────── T4 刻みの依り方 ───────── */
/** ケース 1 の代表(h 0・a_in 0.5・a_dr 0.5・f 0)と軸が起きる型((Tc) k_d 0.1・行き先は引きずり回転だけ)を 3 つの刻みで。連続の極限は閉じた形・刻みに比例して残る分は (ω(Δt) − 閉じた形) ÷ Δt */
export function dtRows() {
  const out = [], cases = [
    ['fixed', 'S1', 'E1', { split: [0, 0.5, 0.5], f: 0 }], ['fixed', 'S2', 'E1', { split: [0, 0.5, 0.5], f: 0 }], ['fixed', 'S1', 'E2', { split: [0, 0.5, 0.5], f: 0 }],
    ['fixed', 'S2p', 'E2', { split: [0, 0.5, 0.5], f: 0 }], ['fixed', 'S2pp', 'E2', { split: [0, 0.5, 0.5], f: 0 }],
    ['Tc', 'S1', 'E2', { split: [0, 0, 1], f: DECL.f0, bal: 'Tc', kd: 0.1 }], ['Tc', 'S1', 'E1', { split: [0, 0, 1], f: DECL.f0, bal: 'Tc', kd: 0.1 }], ['Tc', 'S2p', 'E2', { split: [0, 0, 1], f: DECL.f0, bal: 'Tc', kd: 0.1 }]];
  for (const [kind, type, col, o] of cases) {
    const T = kind === 'fixed' ? DECL.T : DECL.T2, want = kind === 'fixed' ? closedFixed({ col, split: o.split, f: o.f, t: T }) : closedAlign({ type, col, split: o.split, kd: o.kd });
    const runs = DECL.dtSteps.map((n) => { const R = stepRun({ type, col, T, steps: (kind === 'fixed' ? 1 : 4) * n, ...o }); return { steps: R.steps, dt: R.dt, wEnd: R.wEnd, coef: type === 'S2pp' ? null : (R.wEnd - want) / R.dt, ledgerResid: R.ledgerResid }; });
    const dd = runs[1].wEnd - runs[2].wEnd, lin = type === 'S2pp' || !(Math.abs(dd) > 1e-12 * Math.abs(runs[2].wEnd)) ? null : (runs[0].wEnd - runs[1].wEnd) / dd;
    out.push({ kind, type, col, T, want: type === 'S2pp' ? null : want, runs, lin, inv: type === 'S2pp' ? runs.map((r) => (r.wEnd - (1 + Math.cos(DECL.theta0Deg * D2R))) * r.dt / (Math.cos(DECL.theta0Deg * D2R) * T)) : null });
  }
  return out;
}

/* ───────── T5 天体の桁 ───────── */
export function bodyRows(HB = H.bodyRows(E.t1Table())) {
  const IB = I.bodyRows(HB), out = [];
  for (const r of IB) {
    const Om = Math.hypot(r.Wpar, r.Wperp), th0 = r.thetaDeg * D2R;
    const s1RateYr = r.d1RateYr;   // (S1)・行き先は慣性回転だけ(a_eff 1・f 0): dω/dt ÷ ω = Ω⊥² ÷ ω(引きずり回転の分 Ω∥ ≪ ω —— 〔第347便i〕の (D1) と同じ桁)
    const dragOverW = r.Wpar / r.omega;   // リセットで作り直す引きずり回転 Ω∥ ÷ ω
    const s2dt = r.Wperp * r.Wperp * DECL.appDtSec / r.omega;   // (S2) − (S1) の相対の差の桁 a_dr Ω⊥² Δt ÷ ω(a_dr 1・Δt 160 s)
    const tcField = r.edge ? null : Om * (1 - Math.cos(th0)) / r.omega;   // (Tc) で (S1) にだけ入る場との交換 abs(Ω)(1 − cos θ₀) ÷ ω
    out.push({ id: r.id, src: r.src, q: r.q, omega: r.omega, Wpar: r.Wpar, Wperp: r.Wperp, thetaDeg: r.thetaDeg, edge: r.edge, s1RateYr, s2pRateYr: s1RateYr, dragOverW, s2dt, tcTotal: r.tcTotal, tcField, obsRateYr: r.obsRateYr });
  }
  return out;
}

/* ───────── T6 零試験 ───────── */
export function pureScenes() {
  const R = (o) => stepRun({ T: 10, steps: 2000, ...o });
  // ① Ω⊥ = 0(θ = 0)で何も変わらない(型 3 × 行き先 × 釣り合いの型 5 —— (S2″) は除く)
  const z1 = Math.max(...DECL.kinds1.flatMap(([type, col]) => ['none', 'Ta', 'Tc', 'TaTc', 'Tbp'].map((bal) => { const a = R({ type, col, bal, split: [0, 0.5, 0.5], theta0Deg: 0 }); return Math.abs(a.wEnd - a.w0); })));
  // ② 引きずり回転を積む形に戻すと〔第347便i〕の (D1) に一致(刻み → 0 —— 1 次で縮む)
  const acc = (steps) => { const a = stepRun({ type: 'S1', col: 'E1', split: [0, 0.5, 0.5], f: 0.2, accumulate: true, T: 10, steps }), b = I.runCase({ dest: 'D1', split: [0, 0.5, 0.5], f: 0.2, T: 10, steps: 4000 });
    return Math.abs(a.wEnd - b.wEnd) / b.wEnd; };
  const acc1 = acc(2000), acc2 = acc(20000);
  // ③ 連続の極限の閉じた形(θ 固定): (S1)・(S2)・(S2′) × 行き先(10 万步)
  const cf = DECL.kinds1.map(([type, col]) => { const o = { type, col, split: [0.2, 0.3, 0.5], f: 0.2 }, a = stepRun({ ...o, T: 10, steps: 100000 }); return Math.abs(a.wEnd - closedFixed({ ...o, t: 10 })) / closedFixed({ ...o, t: 10 }); });
  // ④ 〔第347便i〕の (D3) の τ → 0 は (S1) の E1(場へ返す)・E3(熱)の連続の極限へ(τ 0.02・0.01 の差の比 ≈ 2)
  const d3 = (tau, ret) => { const c = closedFixed({ col: 'E1', split: [0, 0.5, 0.5], f: 0, t: 10 }), r = I.runCase({ dest: 'D3', split: [0, 0.5, 0.5], f: 0, tau, ret, w0in: 1, w0dr: Math.cos(DECL.theta0Deg * D2R), T: 10, steps: Math.round(40 / tau) });
    return Math.abs(r.wEnd - c) / c; };
  const d3a = d3(0.02, 'field'), d3b = d3(0.01, 'field'), d3c = d3(0.02, 'heat'), d3d = d3(0.01, 'heat');
  // ⑤ 帳簿(場との交換を入れないと残る —— 軸が起きる型)/E2 で δ を慣性へ移さない変異
  const r5 = R({ type: 'S1', col: 'E2', bal: 'Tc', split: [0.2, 0.3, 0.5], f: 0.5 }), m5 = R({ type: 'S1', col: 'E2', bal: 'Tc', split: [0.2, 0.3, 0.5], f: 0.5, mut: 'noFieldX' });
  const m5b = R({ type: 'S1', col: 'E2', split: [0, 0, 1], f: 0, mut: 'dropDelta' });
  // ⑥ (S2′) で引きずり回転 0(a_dr 0・Ω∥ 0 —— θ 90°)のとき (S1) と同じ・θ 固定では (S1) E2・(S2) E2・(S2′) が丸めの桁で同じ
  const s6a = R({ type: 'S1', col: 'E1', split: [0.3, 0.7, 0], theta0Deg: 90 }).wEnd, s6b = R({ type: 'S2p', col: 'E2', split: [0.3, 0.7, 0], theta0Deg: 90 }).wEnd, s6c = R({ type: 'S2', col: 'E3', split: [0.3, 0.7, 0], theta0Deg: 90 }).wEnd;
  const s6d = R({ type: 'S1', col: 'E2', split: [0, 0.5, 0.5] }).wEnd, s6e = R({ type: 'S2', col: 'E2', split: [0, 0.5, 0.5] }).wEnd, s6f = R({ type: 'S2p', col: 'E2', split: [0, 0.5, 0.5] }).wEnd;
  // ⑦ 軸が起きる型の連続の閉じた形((S1) E2・(S2′)・(Tc)・(Ta)+(Tc) —— 刻み 1e-3)
  const al = [['S1', 'E2', 'Tc'], ['S2p', 'E2', 'Tc'], ['S1', 'E2', 'TaTc'], ['S2p', 'E2', 'TaTc']].map(([type, col, bal]) => {
    const o = { type, col, bal, split: [0, 0.5, 0.5], f: DECL.f0, kd: 1 }, a = stepRun({ ...o, T: 40, steps: 400000 }), want = closedAlign({ type, col, split: o.split, kd: 1, ta: bal === 'TaTc' });
    return Math.abs(a.wEnd - want) / want; });
  // ⑧ (S2″)(対照)は Ω⊥ = 0 でも Ω∥ が毎步慣性へ積まれる: ω(T) = ω(0) + N abs(Ω)(N = 步の数)
  const p8a = stepRun({ type: 'S2pp', col: 'E2', theta0Deg: 0, T: 10, steps: 100 }), p8b = stepRun({ type: 'S2pp', col: 'E2', theta0Deg: 0, T: 10, steps: 1000 });
  // ⑨ (Td) の釣り合いの向き(合成のベクトル —— 銀河と 120°)
  const TD = tdRows();
  // ⑩ 入力の拒否
  const rej = [() => stepRun({ split: [0.5, 0.5, 0.5] }), () => stepRun({ type: 'S9' }), () => stepRun({ col: 'E9' }), () => stepRun({ type: 'S2p', col: 'E1' }), () => stepRun({ bal: 'T9' }),
    () => stepRun({ f: 2 }), () => stepRun({ accumulate: true, type: 'S2' })].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { z1, acc1, acc2, cfMax: Math.max(...cf), d3a, d3b, d3c, d3d, led5: Math.abs(r5.ledgerResid), mled5: Math.abs(m5.ledgerResid), mled5b: Math.abs(m5b.ledgerResid),
    s6: Math.max(Math.abs(s6a - s6b), Math.abs(s6a - s6c)), s6fix: Math.max(Math.abs(s6d - s6e), Math.abs(s6d - s6f)), alMax: Math.max(...al),
    p8a: Math.abs(p8a.wEnd - (p8a.w0 + 100)), p8b: Math.abs(p8b.wEnd - (p8b.w0 + 1000)), tdEq: Math.max(...TD.rows.map((r) => r.angEndDeg)), tdGal: TD.eqGalDeg, rejects: rej };
}
export function pureGates(S) {
  return {
    perpZero: S.z1 < 1e-12,
    accumulate: S.acc2 < 1e-4 && S.acc1 / S.acc2 > 5 && S.acc1 / S.acc2 < 20,
    closedFixed: S.cfMax < 1e-4,
    d3limit: S.d3b < S.d3a && S.d3a / S.d3b > 1.6 && S.d3a / S.d3b < 2.4 && S.d3d < S.d3c && S.d3c / S.d3d > 1.6 && S.d3c / S.d3d < 2.4,
    ledger: S.led5 < 1e-9 && S.mled5 > 1e-3 && S.mled5b > 1e-3,
    s2pSame: S.s6 < 1e-12 && S.s6fix < 1e-12,
    closedAlign: S.alMax < 1e-3,
    s2ppStep: S.p8a < 1e-9 && S.p8b < 1e-9,
    td: S.tdEq < 1e-2 && Math.abs(S.tdGal - 120) < 1e-9,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}

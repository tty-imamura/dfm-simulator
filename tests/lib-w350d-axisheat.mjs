// 第350便d(原仮定者の整理(2026-11-23 —— 第146報)・統括の検証項目 R421):
//   **軸引きずりの「軸が動かなかった分のエネルギー」の行き先 —— 主の 2 列(内部熱・慣性回転)と比べる列(引きずり回転 × リセットの後の読み (E1)(E2)(E3))、
//   供給の則の列((P1) 既存の診断の仮定・(P0) 供給 0 —— 理想の直交トルク)を、供給の仕事を熱・自転の増し分と別の欄に記録する帳簿の上で並べ、
//   釣り合い方の 2 列((K1) 第146報「自転速度が増すと、軸を起こす為のトルクが増して釣り合う」の読み・(K2) 回答 9「…傾きにくくなり釣り合う」の読み)と天体 4 組の桁を出す純関数 —— 診断だけ**
//   (器 tests/exp-w350d-axisheat.mjs と QA behavior.axisheat350d・docs.axisheat350d が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。**3D の向きは持たない**(スカラーの自転と軸のなす角 θ の模型)。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・pairRot3・bodyEnergy —— 在位の形の場と天体の Ω)・第348便b(stepRun —— 步の形の照合)・
//   第347便i(runCase —— 供給の則の照合・DECL.bodies)・第347便e(t1Table・geometry・observedRates)・第341便f(熱の物差し)。
//
// ■ 量(無次元の核 —— I = 1・abs(Ω) = 1・ω_慣性(0) = 1・θ₀ 40°・T 50・10000 步 —— 〔第348便b〕表 4・〔第348便h〕表 13 の例 fixed と同じ組):
//   ŝ = 自転軸・Ω∥ = abs(Ω) cos θ(引きずり回転 ω_D —— 状態に積まない・毎ステップ場から作り直す)・Ω⊥ = abs(Ω) sin θ。ω_I = 慣性回転(状態)。
//   トルクの式の自転速度 ω_T = 前のステップの ω_I + 前のステップの ω_D((S1) —— 〔第348便b〕)。**トルクの大きさ = I × abs(ω_T) × abs(Ω⊥)**(純関数 torqueMag)。
// ■ 供給の則(T1 —— 統括の検証項目 R421「直交のトルクは、理想の形では自転に仕事をしない —— 「軸が動かなかった」だけでは熱の量は決まらない」):
//   (P1) 既存の仮定: 軸が動かなかった分の率 P = (1 − f) × トルクの大きさ × abs(Ω⊥) = (1 − f) I abs(ω_T) Ω⊥²(〔第347便i〕runCase・〔第348便b〕stepRun・〔第348便h〕bodyEnergy の式)。
//   (P0) 対照: 供給 0(理想の直交トルク —— 歳差させるだけ)。
// ■ 帳簿(各ステップ): 供給 + 場との交換(符号つき)− 場への返し − 回転エネルギーの増し分 − 熱 = 残差(相対の残差の分母は 供給の和 + 場との交換の和 + 始めの回転エネルギー)。回転エネルギーは合成の自転 ω = ω_I + ω_D の ½ I ω² の前後で測る(平行成分の交差項を落とさない)。
//   逆自転は符号を保つ(大きさを増やす向きに入れる —— 鏡映の零試験)。
// ■ 行き先: 割合 [h, a_in, a_dr](和 1)—— 主の 2 列 = h(内部熱)と a_in(慣性回転)・その間 = h の格子・比べる列 = a_dr 1(引きずり回転)× リセットの後の読み
//   (E1) 場へ返る・(E2) 慣性回転へ移る・(E3) 熱(〔第348便b〕)。
// ■ 釣り合い方(T3 —— どちらの読みが原文かは決めない): 軸の応答 m(0 = 軸が動かない〜1)—— 供給は (1 − m) × トルクの大きさ × abs(Ω⊥)(m は〔第348便b〕の f の位置)。
//   (K1) dθ/dt = −m k_d (abs(ω_T) ÷ abs(ω₀)) abs(Ω) sin θ(自転が増す → トルクが増す → 軸が起きる → Ω⊥ が減る → 供給が減る)/
//   (K2) dθ/dt = −m k_d (abs(ω₀) ÷ abs(ω_T)) abs(Ω) sin θ(〔第347便i〕の (Ta)+(Tc) の型 —— 角運動量が増すと傾きにくくなる)/対照「歳差だけ」θ 不変。
// ■ 言わないこと: 熱の出どころ・釣り合いの形・天体の内部熱の答えとは書かない。この供給の則の仮定・この行き先・このノブでは、の表。観測の値は固定の比べる列(合わせない)。
import * as H from './lib-w348h-axisgeo3.mjs';
import * as B from './lib-w348b-spinreset.mjs';
import * as I from './lib-w347i-axisenergy.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as F from './lib-w341f-gyroheat.mjs';

export const LIB_VERSION = 'w350d-axisheat-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  rules: Object.freeze(['P1', 'P0']), cols: Object.freeze(['E1', 'E2', 'E3']), bals: Object.freeze(['none', 'K1', 'K2']),
  /** 例 fixed(〔第348便b〕表 4・〔第348便h〕表 13 と同じ組) */
  base: Object.freeze({ Om: 1, w0in: 1, theta0Deg: 40, T: 50, steps: 10000 }),
  /** T2 主の 2 列の間の格子(h = 内部熱の割合・a_in = 1 − h) */
  hGrid: Object.freeze([0, 0.25, 0.5, 0.75, 1]),
  /** T3 釣り合い方: 軸の応答 m × 熱の割合 h(残りは慣性回転)・k_d・時間 */
  bal: Object.freeze({ mGrid: Object.freeze([0, 0.25, 0.5, 1]), hGrid: Object.freeze([0, 0.5, 1]), kd: 1, T: 200, steps: 20000, theta0Deg: 40 }),
  /** T4 天体 4 組(〔第347便i〕の 4 組)・候補 2(在位の形の場の (W) = 中心の渦度の半分・(P2) = 2 点の差分の極限) */
  bodies: I.DECL.bodies, cands: Object.freeze(['W', 'P2']),
  /** 頭打ちの物差し(T と 2T の差 ÷ 0 から T の差)・照合の数(第348便h の表 13) */
  flatTol: 1e-3, ref348h: Object.freeze({ inertial: 22.422214981379305, drag: 1.766044443118978 }),
  judge: '丸めの床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
/** 文献の値(固定の比べる列 —— 合わせない) */
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', heat: F.LIT.heat, heatSrc: F.LIT.heatSrc });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };

/* ───────── トルクの大きさ(統括が枝 c と読み比べる純関数)───────── */
/** トルクの大きさ = I × abs(ω_T) × abs(Ω⊥)(I ≥ 0・どれも有限) */
export function torqueMag({ I: Iz, wT, omPerp }) {
  if (!(fin(Iz) && Iz >= 0 && fin(wT) && fin(omPerp))) throw new RangeError('torqueMag: I ≥ 0・wT・omPerp は有限');
  return Iz * Math.abs(wT) * Math.abs(omPerp);
}
/** 供給の率(則 P1・P0): P1 = (1 − f) × トルクの大きさ × abs(Ω⊥)・P0 = 0 */
export function supplyRate({ rule = 'P1', I: Iz = 1, wT, omPerp, f = 0 }) {
  if (!DECL.rules.includes(rule)) throw new RangeError('supplyRate: 則は ' + DECL.rules.join('・'));
  return rule === 'P0' ? 0 : (1 - f) * torqueMag({ I: Iz, wT, omPerp }) * Math.abs(omPerp);
}

/* ───────── 1 本の走り(帳簿つき)───────── */
/**
 * o: { rule, split:[h,a_in,a_dr], col, bal, m, kd, theta0Deg, Om, w0in, T, steps, samples, mut }
 * mut(変異 —— 零試験で落ちることを見る): 'double'(リセットした分を熱と慣性回転の両方へ —— (E3) で熱に入れた δ を慣性回転にも足す)・
 *   'doubleMain'(熱の割合 h の分を慣性回転にも入れる)・'noFieldX'(場との交換を帳簿に入れない)
 */
export function heatRun(o) {
  const { rule = 'P1', split = [0, 1, 0], col = 'E1', bal = 'none', m = 0, kd = DECL.bal.kd, theta0Deg = DECL.base.theta0Deg, Om = DECL.base.Om, w0in = DECL.base.w0in,
    T = DECL.base.T, steps = DECL.base.steps, samples = 0, mut = null } = o;
  if (!DECL.rules.includes(rule)) throw new RangeError('heatRun: 則は ' + DECL.rules.join('・'));
  if (!DECL.cols.includes(col)) throw new RangeError('heatRun: 行き先は ' + DECL.cols.join('・'));
  if (!DECL.bals.includes(bal)) throw new RangeError('heatRun: 釣り合い方は ' + DECL.bals.join('・'));
  if (!(Array.isArray(split) && split.length === 3 && split.every((x) => fin(x) && x >= 0) && Math.abs(split[0] + split[1] + split[2] - 1) < 1e-12)) throw new RangeError('heatRun: 行き先の割合(和 1・どれも ≥ 0)');
  if (!(fin(m) && m >= 0 && m <= 1 && fin(kd) && kd >= 0 && fin(Om) && Om >= 0 && fin(w0in) && w0in !== 0 && fin(T) && T > 0 && Number.isInteger(steps) && steps > 0 && fin(theta0Deg)))
    throw new RangeError('heatRun: m ∈ [0,1]・k_d ≥ 0・Om ≥ 0・w0in ≠ 0・T > 0・steps');
  if (mut !== null && !['double', 'doubleMain', 'noFieldX'].includes(mut)) throw new RangeError('heatRun: 変異の名');
  const [h, aIn, aDr] = split, Iz = 1, dt = T / steps;
  let th = theta0Deg * D2R, wi = w0in;
  const w0 = wi + Om * Math.cos(th), sg = w0 >= 0 ? 1 : -1, aw0 = Math.abs(w0);
  let work = 0, heat = 0, given = 0, fieldX = 0, residAbs = 0, scaleAbs = 0, torque0 = null, torque = 0;
  const E0 = 0.5 * Iz * w0 * w0, tr = [];
  for (let k = 0; k < steps; k++) {
    const wd = Om * Math.cos(th), sp = Om * Math.sin(th), wTot = wi + wd, wT = wTot;      // (S1): 前のステップの合成
    torque = torqueMag({ I: Iz, wT, omPerp: sp }); if (torque0 === null) torque0 = torque;
    const P = supplyRate({ rule, I: Iz, wT, omPerp: sp, f: m }), e = P * dt;
    work += e; let hStep = h * e, gStep = 0;
    const eIn = (mut === 'doubleMain' ? aIn + h : aIn) * e, eDr = aDr * e;
    const s = wTot === 0 ? sg : (wTot > 0 ? 1 : -1);                                          // 逆自転の符号を保つ
    const wTot1 = eIn === 0 ? wTot : s * Math.sqrt(wTot * wTot + 2 * eIn / Iz), wi1 = eIn === 0 ? wi : wTot1 - wd;
    const wTot2 = eDr === 0 ? wTot1 : s * Math.sqrt(wTot1 * wTot1 + 2 * eDr / Iz), delta = wTot2 - wTot1;
    const rate = bal === 'K1' ? m * kd * (Math.abs(wT) / aw0) * sp : bal === 'K2' ? m * kd * (aw0 / Math.max(Math.abs(wT), 1e-300)) * sp : 0;
    const th1 = th - rate * dt;
    // リセット(引きずり回転は新しい軸の Ω∥ に作り直す —— δ の行き先は (E1)(E2)(E3))
    if (col === 'E1') { gStep = eDr; wi = wi1; }
    else if (col === 'E3') { hStep += eDr; wi = mut === 'double' ? wi1 + delta : wi1; }
    else wi = delta === 0 ? wi1 : wi1 + delta;
    const wdNew = Om * Math.cos(th1), fx = 0.5 * Iz * ((wi + wdNew) * (wi + wdNew) - (wi + wd) * (wi + wd));
    const fxBook = mut === 'noFieldX' ? 0 : fx, dEstep = 0.5 * Iz * ((wi + wdNew) * (wi + wdNew) - wTot * wTot);
    heat += hStep; given += gStep; fieldX += fxBook;
    residAbs += Math.abs(e + fxBook - gStep - dEstep - hStep); scaleAbs += Math.abs(e) + Math.abs(fx);
    th = th1;
    if (samples > 0 && (k + 1) % Math.round(steps / samples) === 0) tr.push({ t: (k + 1) * dt, w: wi + Om * Math.cos(th), thDeg: th / D2R, heat });
  }
  const wEnd = wi + Om * Math.cos(th), E1v = 0.5 * Iz * wEnd * wEnd;
  return { rule, split, col, bal, m, T, steps, dt, w0, wEnd, wiEnd: wi, wdEnd: Om * Math.cos(th), wRatio: wEnd / w0in, wTotRatio: wEnd / w0, wiRatio: wi / w0in, thEndDeg: th / D2R,
    work, heat, given, fieldX, dE: E1v - E0, ledgerResid: (E1v - E0 - (work - heat - given + fieldX)) / (Math.abs(work) + Math.abs(fieldX) + E0),   // 分母に始めの回転エネルギーを含める(供給 0 の列で丸めの残りを 1 と書かない)
    stepResid: residAbs / (scaleAbs + E0), torque0, torqueEnd: torque, torqueRatio: torque0 > 0 ? torque / torque0 : null, trace: tr };
}
/** 頭打ちか(〔第348便b〕の plateau と同じ物差し)と時定数(自転の変わりの 1 − 1/e に届く時刻 —— 頭打ちのときだけ) */
export function plateau(o) {
  const a = heatRun(o), b = heatRun({ ...o, T: 2 * (o.T || DECL.base.T), steps: 2 * (o.steps || DECL.base.steps), samples: 4000 }), d1 = a.wEnd - a.w0, d2 = b.wEnd - a.wEnd;
  const judge = Math.abs(d1) < 1e-12 * Math.abs(a.w0) ? 'none' : Math.abs(d2) <= DECL.flatTol * Math.abs(d1) ? 'flat' : 'grow';
  let tau = null;
  if (judge === 'flat') { const wE = b.wEnd, hit = b.trace.find((p) => Math.abs(p.w - a.w0) >= (1 - Math.exp(-1)) * Math.abs(wE - a.w0)); tau = hit ? hit.t : null; }
  return { a, b, judge, tau };
}
/** 連続の極限の閉じた形(θ 固定・(P1)・I = 1): ω(t) = ω_慣性(0) + abs(Ω) cos θ₀ + a_eff (1 − m) abs(Ω)² sin² θ₀ t(a_eff = a_in〔E1・E3〕・a_in + a_dr〔E2〕)・熱 = 仕事 × (h + a_dr〔E3〕) */
export function closedFixed({ split, col, m = 0, theta0Deg = DECL.base.theta0Deg, Om = 1, w0in = 1, t }) {
  const th = theta0Deg * D2R, aEff = col === 'E2' ? split[1] + split[2] : split[1];
  return w0in + Om * Math.cos(th) + aEff * (1 - m) * Om * Om * Math.sin(th) ** 2 * t;
}

/* ───────── T1 供給の則の列 ───────── */
/** 既存の lib の供給の式を、θ 固定・行き先 熱だけ(自転は一定)の走りの仕事 ÷ 時間で読み、(P1) の式と並べる */
export function supplyRows() {
  const th = DECL.base.theta0Deg * D2R, wd0 = Math.cos(th), w = 1 + wd0, sp = Math.sin(th), T = 10, want = supplyRate({ rule: 'P1', wT: w, omPerp: sp });
  const a = I.runCase({ dest: 'D1', split: [1, 0, 0], f: 0, w0in: 1, w0dr: wd0, T, steps: 1000 });
  const b = B.stepRun({ type: 'S1', col: 'E1', split: [1, 0, 0], f: 0, T, steps: 1000 });
  const be = H.bodyEnergy([{ id: 'Earth', src: 'Sun', tag: 'unit', omega: w, I: 1, Wpar: wd0, Wperp: sp }])[0].cols['S1E3|drag'].heatW;
  const mine = heatRun({ rule: 'P1', split: [1, 0, 0], T, steps: 1000 }), zero = heatRun({ rule: 'P0', split: [1, 0, 0], T, steps: 1000 });
  return {
    want, torque: torqueMag({ I: 1, wT: w, omPerp: sp }),
    rows: [
      { rule: 'P1', where: '〔第347便i〕runCase(der の Pw)', formula: 'Pw = (1 − f) I ω_T Ω⊥²', rate: a.work / T },
      { rule: 'P1', where: '〔第348便b〕stepRun(②)', formula: 'P = (1 − f) I ω_T Ω⊥²', rate: b.work / T },
      { rule: 'P1', where: '〔第348便h〕bodyEnergy(heatW)', formula: 'I ω Ω⊥²(f 0)', rate: be },
      { rule: 'P1', where: '本節 heatRun', formula: '(1 − m) × torqueMag × abs(Ω⊥)', rate: mine.work / T },
      { rule: 'P0', where: '本節 heatRun(対照)', formula: '0(理想の直交トルク —— 歳差だけ)', rate: zero.work / T },
    ].map((r) => ({ ...r, ratio: want > 0 ? r.rate / want : null })),
  };
}

/* ───────── T2 行き先の表 ───────── */
export function destRows() {
  const out = [], cases = [];
  for (const h of DECL.hGrid) cases.push({ group: 'main', split: [h, 1 - h, 0], col: 'E1' });
  for (const col of DECL.cols) cases.push({ group: 'drag', split: [0, 0, 1], col });
  for (const rule of DECL.rules) for (const c of cases) {
    const R = plateau({ rule, split: c.split, col: c.col }), A = R.a, cf = rule === 'P1' ? closedFixed({ split: c.split, col: c.col, t: DECL.base.T }) : 1 + Math.cos(DECL.base.theta0Deg * D2R);
    out.push({ rule, group: c.group, h: c.split[0], aIn: c.split[1], aDr: c.split[2], col: c.col, wRatio: A.wRatio, wiRatio: A.wiRatio, wdEnd: A.wdEnd, work: A.work, heat: A.heat, given: A.given,
      dE: A.dE, heatOverWork: A.work > 0 ? A.heat / A.work : null, torqueRatio: A.torqueRatio, judge: R.judge, ledgerResid: A.ledgerResid, stepResid: A.stepResid, closedDiff: Math.abs(A.wEnd - cf) / cf });
  }
  return out;
}

/* ───────── T3 釣り合い方の 2 列 ───────── */
export function balRows() {
  const out = [], D = DECL.bal;
  for (const bal of DECL.bals) for (const m of D.mGrid) for (const h of D.hGrid) {
    const R = plateau({ rule: 'P1', split: [h, 1 - h, 0], col: 'E1', bal, m, kd: D.kd, theta0Deg: D.theta0Deg, T: D.T, steps: D.steps }), A = R.a;
    out.push({ bal, m, h, wRatio: A.wRatio, wTotRatio: A.wTotRatio, thEndDeg: A.thEndDeg, heat: A.heat, work: A.work, torqueRatio: A.torqueRatio, judge: R.judge, tau: R.tau,
      wRatio2T: R.b.wRatio, heat2T: R.b.heat, thEnd2TDeg: R.b.thEndDeg, ledgerResid: A.ledgerResid });
  }
  return out;
}
/** (K1) の連続の極限(行き先は慣性回転と熱 —— I = 1・abs(Ω) = 1・ω_T = 合成の自転 ω): dω/dt = A′ sin² θ − sin θ dθ/dt(供給と場との交換)・dθ/dt = −m k_d (ω/ω₀) sin θ・A′ = (1 − m)(1 − h)
 *  → dω/dθ = −A′ ω₀ sin θ ÷ (m k_d ω) − sin θ を θ₀ から 0 まで RK4(10 万步)で積んだ届く先(閉じた形の照合の対の口 —— 步の形の走りとは別の積み方) */
export function closedK1({ m, h, kd = DECL.bal.kd, theta0Deg = DECL.bal.theta0Deg, w0in = 1 }) {
  const th0 = theta0Deg * D2R, w0 = w0in + Math.cos(th0), A = (1 - m) * (1 - h) / (m * kd), n = 100000, dth = th0 / n;
  const f = (t, ww) => -A * w0 * Math.sin(t) / ww - Math.sin(t);
  let th = th0, w = w0;
  for (let k = 0; k < n; k++) { const k1 = f(th, w), k2 = f(th - dth / 2, w - dth / 2 * k1), k3 = f(th - dth / 2, w - dth / 2 * k2), k4 = f(th - dth, w - dth * k3); w -= dth / 6 * (k1 + 2 * k2 + 2 * k3 + k4); th -= dth; }
  return w;
}

/* ───────── T4 天体 4 組 ───────── */
/** 在位の形の場(〔第348便h〕の主の場の組 (g3-1)・銀河 + 太陽 + 母天体の和)の Ω を受け手の自転軸に分け、行き先の列ごとに熱の率と自転の変化の率 */
export function bodyRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const combo = H.DECL.combos.find((c) => c.id === H.DECL.mainCombo), obs = E.observedRates(), out = [];
  for (const [id, src] of DECL.bodies) {
    const R = H.pairRot3(T1, GEO, id, src, combo), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[id + '|' + src].w), o = obs.find((x) => x.id === id);
    for (const cand of DECL.cands) {
      const v = [R.G[cand], R.S[cand], R.P ? R.P[cand] : null].filter(Boolean).reduce((t, x) => add(t, x), [0, 0, 0]);
      const Wpar = dot(v, wAx), Wperp = nrm(sub(v, scl(wAx, Wpar))), w = Math.abs(r2.omega), Iz = r2.I;
      const tq = torqueMag({ I: Iz, wT: w, omPerp: Wperp }), P1 = supplyRate({ rule: 'P1', I: Iz, wT: w, omPerp: Wperp }), rate = P1 / (Iz * w * w) * YR;
      const cols = {
        heat: { heatW: P1, rateYr: 0 }, inertial: { heatW: 0, rateYr: rate }, half: { heatW: 0.5 * P1, rateYr: 0.5 * rate },
        dragE1: { heatW: 0, rateYr: 0, givenW: P1 }, dragE2: { heatW: 0, rateYr: rate }, dragE3: { heatW: P1, rateYr: 0 }, P0: { heatW: 0, rateYr: 0 },
      };
      out.push({ id, src, cand, omega: w, I: Iz, Wpar, Wperp, thetaDeg: Math.atan2(Wperp, Wpar) / D2R, dragOverW: Wpar / w, torque: tq, supplyW: P1, cols,
        heatRuler: LIT.heat[id] ?? null, obsRateYr: o ? o.rateYr : null });
    }
  }
  return out;
}

/* ───────── 共通の点検の数(統括の数え直し —— 枝どうしで同じ)───────── */
const E3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
/** 直径の 2 点の差分(有限の差): ê × (u(rc + hê) − u(rc − hê)) ÷ (2h) */
export function diamRot(u, rc, e, h) { const p = u(add(rc, scl(e, h))), q = u(sub(rc, scl(e, h))); return crs(e, scl(sub(p, q), 1 / (2 * h))); }
/** 直交 3 直径の 6 点の平均(各直径の 2 点の差分の和の ½) */
export function sixRot(u, rc, h) { return scl(E3.map((e) => diamRot(u, rc, e, h)).reduce(add, [0, 0, 0]), 0.5); }
export function commonChecks() {
  const rc = [4, 0, 0], hh = 0.01, mk = (vs, vr, o = {}) => H.makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: vs, spin: [0, 0, 0] }], recv: { m: 1, R: 1, p: rc, v: vr }, ...o });
  const f = mk([0, 1, 0], [0, 0, 0]), dx = diamRot(f.u, rc, E3[0], hh), six = sixRot(f.u, rc, hh), w = H.rot3('W', f, rc, { Rb: 1 });
  const fr = mk([0, -1, 0], [0, 0, 0]), fc = mk([1, 0, 0], [0, 0, 0]), fs = mk([0, 1, 0], [0, 1, 0]), fz = mk([0, 1, 0], [0, 0, 0], { self: false }), fg = mk([3, -1, 1], [3, -2, 1]);
  const rig = (x) => crs([1, 2, 3], x), shear = (x) => [x[1], x[0], 0];
  return { dxZ: dx[2], sixZ: six[2], wZ: w[2], dx, six, w, rev: diamRot(fr.u, rc, E3[0], hh), center: nrm(diamRot(fc.u, rc, E3[0], hh)) + nrm(sixRot(fc.u, rc, hh)),
    rest: nrm(diamRot(fs.u, rc, E3[0], hh)) + nrm(sixRot(fs.u, rc, hh)), noSelf: nrm(diamRot(fz.u, rc, E3[0], hh)) + nrm(sixRot(fz.u, rc, hh)),
    galil: nrm(sub(diamRot(fg.u, rc, E3[0], hh), dx)) + nrm(sub(sixRot(fg.u, rc, hh), six)),
    rigid6: sixRot(rig, [0.3, -0.2, 0.5], hh), rigidX: diamRot(rig, [0.3, -0.2, 0.5], E3[0], hh), shearX: diamRot(shear, [0.1, 0.2, 0], E3[0], hh), shear6: sixRot(shear, [0.1, 0.2, 0], hh) };
}

/* ───────── T5 零試験・変異 ───────── */
export function pureScenes() {
  const R = (o) => heatRun({ T: 10, steps: 2000, ...o });
  const kinds = [[[0, 1, 0], 'E1'], [[1, 0, 0], 'E1'], [[0.5, 0.5, 0], 'E1'], [[0, 0, 1], 'E1'], [[0, 0, 1], 'E2'], [[0, 0, 1], 'E3']];
  // ① Ω⊥ = 0(θ 0)で熱 0・自転の増し 0(行き先 6 × 釣り合い方 3)
  const z1 = Math.max(...kinds.flatMap(([split, col]) => DECL.bals.map((bal) => { const a = R({ split, col, bal, m: 0.5, theta0Deg: 0 }); return Math.abs(a.wEnd - a.w0) + Math.abs(a.heat) + Math.abs(a.work); })));
  // ② (P0) で熱 0・自転不変(θ 固定)
  const z2 = Math.max(...kinds.map(([split, col]) => { const a = R({ rule: 'P0', split, col }); return Math.abs(a.wEnd - a.w0) + Math.abs(a.heat) + Math.abs(a.work); }));
  // ③ 第348便h の 22.4 倍(慣性回転だけ)・1.77 倍(引きずり回転 + (E1)/(E3))—— 例 fixed の 10000 步
  const g = (split, col) => heatRun({ split, col }).wRatio;
  const r3 = { inertial: g([0, 1, 0], 'E1'), dragE1: g([0, 0, 1], 'E1'), dragE3: g([0, 0, 1], 'E3'), dragE2: g([0, 0, 1], 'E2') };
  // ④ 〔第348便b〕の stepRun((S1))と同じ式の同じ数(θ 固定・軸が起きる型は (Tc) と (K2)〔m 1・k_d〕を同じに置いた組)
  const b4 = Math.max(...kinds.map(([split, col]) => { const a = heatRun({ split, col, T: 10, steps: 2000 }), b = B.stepRun({ type: 'S1', col, split, f: 0, T: 10, steps: 2000 }); return Math.abs(a.wEnd - b.wEnd) / Math.abs(b.wEnd) + Math.abs(a.heat - b.heat) / Math.max(b.work, 1e-300); }));
  // ⑤ 帳簿(全部の行き先 × 釣り合い方)の残差が丸めの床/二重に数える変異 2 つ・場との交換を落とす変異で落ちる
  const led = Math.max(...kinds.flatMap(([split, col]) => DECL.bals.map((bal) => Math.max(Math.abs(R({ split, col, bal, m: 0.5 }).ledgerResid), R({ split, col, bal, m: 0.5 }).stepResid))));
  const mD = R({ split: [0, 0, 1], col: 'E3', mut: 'double' }), mM = R({ split: [0.5, 0.5, 0], col: 'E1', mut: 'doubleMain' }), mF = R({ split: [0, 1, 0], col: 'E1', bal: 'K1', m: 0.5, mut: 'noFieldX' });
  // ⑥ 逆自転の符号: ω_慣性(0) → −1・θ → 180° − θ で結果が鏡映(自転と熱)
  const mir = Math.max(...kinds.map(([split, col]) => { const a = R({ split, col }), b = R({ split, col, w0in: -1, theta0Deg: 180 - DECL.base.theta0Deg }); return Math.abs(a.wEnd + b.wEnd) + Math.abs(a.heat - b.heat); }));
  // ⑦ θ 固定の閉じた形(10 万步)
  const cf = Math.max(...kinds.map(([split, col]) => { const a = heatRun({ split, col, T: 10, steps: 100000 }), c = closedFixed({ split, col, t: 10 }); return Math.abs(a.wEnd - c) / c; }));
  // ⑧ (K1) の閉じた形の対(行き先 慣性回転 h 0・m 0.5 —— 長い時間の届く先)
  const k8 = (() => { const a = heatRun({ split: [0, 1, 0], col: 'E1', bal: 'K1', m: 0.5, T: 60, steps: 600000 }), c = closedK1({ m: 0.5, h: 0 }); return Math.abs(a.wEnd - c) / c; })();
  // ⑨ torqueMag(I 1・ω_T 1・abs(Ω⊥) 1 = 1・符号に依らない)と P1 = トルクの大きさ × abs(Ω⊥)
  const t9 = [torqueMag({ I: 1, wT: 1, omPerp: 1 }), torqueMag({ I: 2, wT: -3, omPerp: 0.5 }), supplyRate({ wT: 2, omPerp: 0.5, f: 0.25 })];
  // ⑩ 共通の点検の数
  const CC = commonChecks();
  // ⑪ 入力の拒否
  const rej = [() => heatRun({ split: [0.5, 0.5, 0.5] }), () => heatRun({ rule: 'P9' }), () => heatRun({ col: 'E9' }), () => heatRun({ bal: 'K9' }), () => heatRun({ m: 2 }), () => heatRun({ w0in: 0 }),
    () => heatRun({ mut: 'x' }), () => torqueMag({ I: -1, wT: 1, omPerp: 1 }), () => torqueMag({ I: 1, wT: NaN, omPerp: 1 })].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { z1, z2, r3, b4, led, mledD: Math.abs(mD.ledgerResid), mledM: Math.abs(mM.ledgerResid), mledF: Math.abs(mF.ledgerResid), mir, cf, k8, t9, cc: CC, rejects: rej };
}
export function pureGates(S) {
  const C = S.cc, near = (a, b, tol) => Math.abs(a - b) <= tol;
  return {
    perpZero: S.z1 < 1e-9,
    p0Zero: S.z2 < 1e-9,
    ref348h: Math.abs(S.r3.inertial - DECL.ref348h.inertial) < 1e-9 && Math.abs(S.r3.dragE1 - DECL.ref348h.drag) < 1e-9 && Math.abs(S.r3.dragE3 - DECL.ref348h.drag) < 1e-9 && Math.abs(S.r3.dragE2 - DECL.ref348h.inertial) < 1e-9,
    vs348b: S.b4 < 1e-9,
    ledger: S.led < 1e-9 && S.mledD > 1e-3 && S.mledM > 1e-3 && S.mledF > 1e-3,
    mirror: S.mir < 1e-9,
    closedFixed: S.cf < 1e-4,
    closedK1: S.k8 < 1e-3,
    torque: S.t9[0] === 1 && near(S.t9[1], 3, 1e-15) && near(S.t9[2], 0.375, 1e-15),
    common: near(C.dxZ, -0.03061311, 5e-9) && near(C.sixZ, -0.01530656, 5e-9) && near(C.wZ, -0.01530612, 5e-9) && near(C.rev[2], -C.dxZ, 1e-12) && C.center < 1e-10 && C.rest < 1e-10 && C.noSelf < 1e-10
      && C.galil < 1e-10 && nrm(sub(C.rigid6, [1, 2, 3])) < 1e-10 && nrm(sub(C.rigidX, [0, 2, 3])) < 1e-10 && near(C.shearX[2], 1, 1e-10) && nrm(C.shear6) < 1e-10,
    rejects: S.rejects.length === 9 && S.rejects.every(Boolean),
  };
}

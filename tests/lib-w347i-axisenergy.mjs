// 第347便i(原仮定者の回答(2026-11-22 —— 第145報の回答 8)・原仮定者の回答(2026-11-22 —— 第145報の回答 9)・統括の検証項目 R408):
//   **軸引きずりのエネルギーの 2 つのケース —— ケース 1(行き先「引きずり回転」—— 行き先 3 列と、引きずり回転に入った分の扱いの型 D1・D2・D3)と
//   ケース 2(「傾きにくくなり釣り合う」—— 傾きにくくなる型と釣り合う型 Ta・Tb・Tc・Td)と、その組合せ・天体の桁・熱の窓の純関数 —— 診断だけ**
//   (器 tests/exp-w347i-axisenergy.mjs と QA behavior.axisenergy347i・docs.axisenergy347i が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第347便h(energyRun —— 表 15 の (R1) の照合・bodyRows —— 天体の Ω・heatWindow —— 熱の窓の物差し・DECL・LIT)・
//   第347便e(t1Table・observedRates)・第344便e(composeBalance —— 120° の例の比 ρ)・第343便e(poles —— 太陽の軸と銀河の向き)・第342便e(bodyRows —— I と ω)・第341便f(熱の物差し)。
//
// ■ 量(無次元の核 —— I = 1・ω₀ = 1・abs(Ω) = 1): 自転 ω = ω_慣性 + ω_引きずり(補足 1 の帳簿)。場の回転 Ω と自転の軸 ŝ の角 θ —— Ω∥ = abs(Ω) cos θ・Ω⊥ = abs(Ω) sin θ。
//   軸が動かなかった分の率 P = (1 − f) I ω_T Ω⊥²(ω_T = トルクの式の「自転速度」—— 型で決まる)。行き先 3 列: 内部熱 h・慣性回転 a_in・引きずり回転 a_dr(h + a_in + a_dr = 1 —— 割合のノブ)。
//   エネルギーの帳簿: E = ½ I ω²・dω_慣性/dt = a_in P ÷ (I ω)・dω_引きずり/dt = a_dr P ÷ (I ω)(− 戻りの項)。熱 + 戻した分 + 回転のエネルギーの増し分 = 仕事 ∫P dt。
// ■ ケース 1 の型(引きずり回転に入った分の扱い):
//   (D1) ω_T = 全自転(慣性 + 引きずり)/(D2) ω_T = 慣性回転だけ(引きずり回転は増えるがトルクは増えない)/
//   (D3) ω_T = 全自転・引きずり回転は時定数 τ で場の値 Ω∥ へ戻る(枝 h の計上の型 L2)—— 戻る分 I ω (ω_引きずり − Ω∥) ÷ τ の行き先は「場へ返す」と「熱」の 2 列。
// ■ ケース 2 の型(「傾きにくくなる」と「釣り合う」):
//   (Ta) 傾く率が角運動量に反比例(駆動のトルクの尺度を固定 —— 〔第347便e〕の (S2) の置き方): 軸の動きの率に ω₀ ÷ ω を掛ける。
//   (Tb) 動いた割合 f が自転に依る: (Tb−) 下がる型 f = f₀ (ω₀/ω)^n/(Tb+) 上がる型 1 − f = (1 − f₀)(ω₀/ω)^n/(Tbc) 上がる型・上限つき 1 − f = (1 − f₀) max(0, (ω_c − ω)/(ω_c − ω₀))(ω_c はノブ)。
//   (Tc) 軸が起きて Ω⊥ が 0 へ(枝 h の (g3) の起こす項 dθ/dt = −k_d abs(Ω) sin θ —— 整列で釣り合う)。(TaTc) 上の 2 つの連立。
//   (Td) 2 つの源(銀河の項と太陽の項 —— 〔第344便e〕の 120° の例の比 ρ): dŝ/dt = 尺度 × Σ_k (k_g Ω⊥k × ŝ + k_d Ω⊥k)。熱と自転へ入る率の読みは 2 列(源ごとの和 Σ abs(Ω⊥k)²・合成の abs(ΣΩ⊥k)²)。
// ■ 言わないこと: 釣り合いの形・自転の由来・歳差・内部熱の答えとは書かない。この型・この例・このノブでは、の表。観測の値(自転の変化の率・地球の歳差の率・熱)は固定の比べる列(合わせない)。
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as C344 from './lib-w344e-spincompose.mjs';
import * as E343 from './lib-w343e-spintransfer.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as F from './lib-w341f-gyroheat.mjs';

export const LIB_VERSION = 'w347i-axisenergy-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = 365.25 * 86400;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  dests: Object.freeze(['D1', 'D2', 'D3']),
  /** 行き先 3 列 [h, a_in, a_dr](和 1) */
  splits: Object.freeze([Object.freeze([0, 1, 0]), Object.freeze([0, 0, 1]), Object.freeze([0, 0.5, 0.5]), Object.freeze([0.5, 0, 0.5]), Object.freeze([0.5, 0.25, 0.25])]),
  fCase1: Object.freeze([0, 0.5]), theta0Deg: 40, T: 50, steps: 10000, tauD3: Object.freeze([0.3, 3]), returns: Object.freeze(['field', 'heat']),
  /** ケース 2 の型と格子 */
  bals: Object.freeze(['none', 'Ta', 'Tbm', 'Tbp', 'Tbc', 'Tc', 'TaTc']),
  kd: 1, kg: 1, nTb: 1, f0: 0.5, omegaC: 3, splitCase2: Object.freeze([0, 1, 0]), splitsCase2: Object.freeze([Object.freeze([0, 1, 0]), Object.freeze([0.5, 0.5, 0])]),
  T2: 200, steps2: 20000, flatTol: 1e-3, kdList: Object.freeze([1, 0.1]),
  /** Td: 〔第344便e〕の 120° の例(三次元・銀河の向ける先 rev)の比 ρ・自転の倍 2 つ */
  tdScales: Object.freeze([1, 10]), tdKg: Object.freeze([0, 1]), tdT: 80, tdSteps: 40000, tdReach: 0.01,
  /** T4 の天体(枝 h の 15 組から 4 組)・D3 の時定数 [年] */
  bodies: Object.freeze([['Earth', 'Sun'], ['Venus', 'Sun'], ['Io', 'Jupiter'], ['Pluto', 'Charon']]), bodyQ: Object.freeze([2, 3]), tauYr: Object.freeze([1, 1e3, 1e6]),
});

/** 文献の値(固定の比べる列 —— 合わせない) */
export const LIT = Object.freeze({ note: '文献の値・未照合(この環境から一次資料に当たっていない)', earthPrecArcsecPerYr: H.LIT.earthPrecArcsecPerYr, earthPrecSrc: H.LIT.earthPrecSrc });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;

/* ───────── 1 本の走り(ケース 1 × ケース 2 の共通の型)───────── */
/**
 * 状態 (ω_慣性, ω_引きずり, θ, φ〔歳差の位相〕, 仕事, 熱, 戻した分) を RK4 で追う。
 * o: { dest: D1|D2|D3, bal: none|Ta|Tbm|Tbp|Tbc|Tc|TaTc, split: [h, a_in, a_dr], f, theta0Deg, Om, w0in, w0dr, tau, ret: field|heat, T, steps, mut }
 * mut(変異 —— 零試験で落ちることを見る): 'D2total'(D2 で全自転を使う)・'TaNoScale'(Ta の ω₀/ω を落とす)・'noReturn'(戻した分を帳簿に入れない)
 */
export function runCase(o) {
  const { dest = 'D1', bal = 'none', split = [0, 1, 0], f = 0, theta0Deg = DECL.theta0Deg, Om = 1, w0in = 1, w0dr = 0, tau = 1, ret = 'field', T = DECL.T, steps = DECL.steps, mut = null,
    kd = DECL.kd, kg = DECL.kg, n = DECL.nTb, omegaC = DECL.omegaC, samples = 0 } = o;
  if (!DECL.dests.includes(dest)) throw new RangeError('runCase: 行き先の型は ' + DECL.dests.join('・'));
  if (!DECL.bals.includes(bal)) throw new RangeError('runCase: 釣り合いの型は ' + DECL.bals.join('・'));
  if (!(Array.isArray(split) && split.length === 3 && split.every((x) => fin(x) && x >= 0) && Math.abs(split[0] + split[1] + split[2] - 1) < 1e-12)) throw new RangeError('runCase: 行き先の割合(h + a_in + a_dr = 1・どれも ≥ 0)');
  if (!(fin(f) && f >= 0 && f <= 1 && fin(Om) && Om >= 0 && fin(tau) && tau > 0 && DECL.returns.includes(ret) && fin(T) && T > 0 && Number.isInteger(steps) && steps > 0)) throw new RangeError('runCase: f・Om・tau・ret・T・steps');
  const [h, aIn, aDr] = split, w0 = w0in + w0dr, I = 1, wRef = w0;
  const fEff = (w) => (bal === 'Tbm' ? DECL.f0 * Math.pow(wRef / w, n) : bal === 'Tbp' ? 1 - (1 - DECL.f0) * Math.pow(wRef / w, n)
    : bal === 'Tbc' ? 1 - (1 - DECL.f0) * Math.max(0, (omegaC - w) / (omegaC - wRef)) : f);
  const scaleTa = (w) => ((bal === 'Ta' || bal === 'TaTc') && mut !== 'TaNoScale' ? wRef / w : 1);
  const der = (y) => {
    const [wi, wd, th] = y, w = wi + wd, wT = dest === 'D2' && mut !== 'D2total' ? wi : w, Sp = Om * Math.sin(th), Spar = Om * Math.cos(th);
    const Pw = (1 - fEff(w)) * I * wT * Sp * Sp, back = dest === 'D3' ? (wd - Spar) / tau : 0, backE = I * w * back;
    const dth = bal === 'Tc' || bal === 'TaTc' ? -kd * Om * Math.sin(th) * scaleTa(w) : 0, dph = bal === 'Ta' ? kg * Om * scaleTa(w) : 0;
    return [aIn * Pw / (I * w), aDr * Pw / (I * w) - back, dth, dph, Pw, h * Pw + (ret === 'heat' ? backE : 0), ret === 'field' && mut !== 'noReturn' ? backE : 0, I * wT * Sp];
  };
  let y = [w0in, w0 - w0in, theta0Deg * D2R, 0, 0, 0, 0, 0]; const dt = T / steps, tr = [], torque0 = I * (dest === 'D2' ? w0in : w0) * Om * Math.sin(theta0Deg * D2R);
  let torqueMax = torque0;
  for (let k = 0; k < steps; k++) {
    const k1 = der(y), y2 = y.map((v, i) => v + dt / 2 * k1[i]), k2 = der(y2), y3 = y.map((v, i) => v + dt / 2 * k2[i]), k3 = der(y3), y4 = y.map((v, i) => v + dt * k3[i]), k4 = der(y4);
    y = y.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    const w = y[0] + y[1], tq = I * (dest === 'D2' ? y[0] : w) * Om * Math.sin(y[2]); if (tq > torqueMax) torqueMax = tq;
    if (samples > 0 && (k + 1) % Math.round(steps / samples) === 0) tr.push({ t: (k + 1) * dt, w, wi: y[0], wd: y[1], thDeg: y[2] / D2R, torque: tq });
  }
  const [wi, wd, th, ph, work, heat, given] = y, w = wi + wd, dE = 0.5 * I * (w * w - w0 * w0), torque = I * (dest === 'D2' ? wi : w) * Om * Math.sin(th);
  return { dest, bal, split, f, tau, ret, T, w0, wEnd: w, wiEnd: wi, wdEnd: wd, wRatio: w / w0, wiRatio: wi / w0in, thEndDeg: th / D2R, phase: ph, work, heat, given, dE,
    ledgerResid: (heat + given + dE - work) / Math.max(Math.abs(work), 1e-300), torque0, torqueEnd: torque, torqueRatio: torque0 > 0 ? torque / torque0 : null, torqueMaxRatio: torque0 > 0 ? torqueMax / torque0 : null, trace: tr };
}
/** 頭打ちか(T と 2T の自転の差 ÷ 0 から T の差)—— 'flat'(頭打ち)・'grow'(増え続ける)・'none'(増えない) */
export function plateau(o, samples = 0) {
  const a = runCase(o), b = runCase({ ...o, T: 2 * (o.T || DECL.T), steps: 2 * (o.steps || DECL.steps), samples }), d1 = a.wEnd - a.w0, d2 = b.wEnd - a.wEnd;
  const tq = a.torqueEnd > 0 ? Math.abs(b.torqueEnd - a.torqueEnd) / a.torqueEnd : 0;
  return { a, b, wJudge: Math.abs(d1) < 1e-12 ? 'none' : Math.abs(d2) <= DECL.flatTol * Math.abs(d1) ? 'flat' : 'grow', torqueFlat: tq <= DECL.flatTol, growLate: d2 / Math.max(Math.abs(d1), 1e-300) };
}

/* ───────── T2 ケース 1 —— 行き先「引きずり回転」───────── */
export function case1Rows() {
  const out = [];
  for (const dest of DECL.dests) for (const split of DECL.splits) for (const f of DECL.fCase1) {
    const taus = dest === 'D3' ? DECL.tauD3 : [null], rets = dest === 'D3' ? DECL.returns : ['field'];
    for (const tau of taus) for (const ret of rets) {
      const o = { dest, split, f, ret, tau: tau === null ? 1 : tau, bal: 'none' }, R = plateau(o), A = R.a;
      out.push({ dest, h: split[0], aIn: split[1], aDr: split[2], f, tau, ret: dest === 'D3' ? ret : null, wRatio: A.wRatio, wiRatio: A.wiRatio, wdEnd: A.wdEnd, torqueRatio: A.torqueRatio,
        heatOverWork: A.work > 0 ? A.heat / A.work : null, givenOverWork: A.work > 0 ? A.given / A.work : null, ledgerResid: A.ledgerResid, wJudge: R.wJudge, torqueFlat: R.torqueFlat, growLate: R.growLate });
    }
  }
  return out;
}
/** 行き先を慣性回転だけにすると枝 h の表 15 の (R1) に戻る(D1・D2・D3 の a_dr = 0 —— 枝 h の lib の energyRun と同じ格子で照合) */
export function case1VsH() {
  const out = [], En = H.DECL.energy;
  for (const f of En.f) for (const h of En.h) {
    const R = H.energyRun({ f, h, eps: 0, read: 'R1' });
    const mine = DECL.dests.map((dest) => runCase({ dest, split: [h, 1 - h, 0], f, theta0Deg: 90, Om: En.Wperp, w0in: En.w0, w0dr: 0, T: En.T, steps: En.steps }));
    out.push({ f, h, hRatio: R.wRatio, diffs: mine.map((m) => Math.abs(m.wRatio - R.wRatio) / R.wRatio) });
  }
  return out;
}

/* ───────── T3 ケース 2 —— 「傾きにくくなり釣り合う」───────── */
/** 傾きにくいか: 同じ θ で、自転を 2 倍にしたときの軸の動きの率(起こす・歳差)と、動いた割合 f の変わり方 */
export function stiffness(bal) {
  const rate = (w) => { const s = (bal === 'Ta' || bal === 'TaTc') ? 1 / w : 1; return (bal === 'Tc' || bal === 'TaTc') ? DECL.kd * s : bal === 'Ta' ? DECL.kg * s : null; };
  const fOf = (w) => (bal === 'Tbm' ? DECL.f0 / w : bal === 'Tbp' ? 1 - (1 - DECL.f0) / w : bal === 'Tbc' ? 1 - (1 - DECL.f0) * Math.max(0, (DECL.omegaC - w) / (DECL.omegaC - 1)) : DECL.f0);
  const r1 = rate(1), r2 = rate(2);
  return { rateRatio: r1 === null ? null : r2 / r1, f1: fOf(1), f2: fOf(2), harder: (r1 !== null && r2 < r1) || fOf(2) < fOf(1) };
}
/** 閉じた形(無次元・I = 1・ω₀ = 1・abs(Ω) = 1・A = (1 − h)(1 − f)) */
export function closedForms({ h = 0, f = DECL.f0, th0 = DECL.theta0Deg * D2R, kd = DECL.kd } = {}) {
  const A = (1 - h) * (1 - f), c = 1 - Math.cos(th0);
  return { Tc: 1 + A * c / kd, TaTc: Math.exp(A * c / kd), Tbc: DECL.omegaC, TbpAt: (t) => Math.sqrt(1 + 2 * (1 - h) * (1 - DECL.f0) * Math.sin(th0) ** 2 * t) };
}
export function case2Rows() {
  const out = [];
  for (const split of DECL.splitsCase2) for (const bal of DECL.bals) for (const kd of (bal === 'Tc' || bal === 'TaTc' ? DECL.kdList : [DECL.kd])) {
    const o = { dest: 'D1', bal, split, f: DECL.f0, kd, T: DECL.T2, steps: DECL.steps2 }, R = plateau(o, 4000), A = R.a, st = stiffness(bal), cf = closedForms({ h: split[0], kd });
    const want = bal === 'Tc' ? cf.Tc : bal === 'TaTc' ? cf.TaTc : bal === 'Tbc' ? cf.Tbc : bal === 'Tbp' ? cf.TbpAt(DECL.T2) : null;
    // 届くまで: 自転の増し分が全体の 99% に届く時刻(頭打ちの型だけ)
    let reach = null;
    if (R.wJudge === 'flat') { const tr = R.b.trace, wEnd = tr[tr.length - 1].w; const hit = tr.find((p) => Math.abs(wEnd - p.w) <= 0.01 * Math.abs(wEnd - A.w0)); reach = hit ? hit.t : null; }
    const phr = {
      spin: A.wRatio > 1 + 1e-9, L: A.wRatio > 1 + 1e-9, torque: A.torqueMaxRatio > 1 + 1e-9, harder: st.harder, balance: R.wJudge === 'flat',
    };
    out.push({ bal, kd, h: split[0], aIn: split[1], wRatio: A.wRatio, wRatio2T: R.b.wRatio, closed: want, closedDiff: want === null ? null : Math.abs(A.wRatio * A.w0 - want) / want,
      thEndDeg: A.thEndDeg, torqueRatio: A.torqueRatio, torqueMaxRatio: A.torqueMaxRatio, rateRatio: st.rateRatio, fAt1: st.f1, fAt2: st.f2, wJudge: R.wJudge, reach, heatOverWork: A.work > 0 ? A.heat / A.work : null,
      ledgerResid: A.ledgerResid, phr, order: Object.values(phr).every(Boolean) ? 'yes' : (bal === 'Tbc' && Object.values(phr).slice(0, 3).every(Boolean) && phr.balance) ? 'knob' : 'no' });
  }
  return out;
}
/** (Td) 2 つの源: 銀河の項 −ρ G と太陽の項 S(〔第344便e〕の 120° の例 —— 三次元・rev の行の ρ)。自転の倍 2 つ × k_g 2 つ × 尺度の型 2 つ(角運動量に比例 L・固定 Ta)× 熱の読み 2 つ */
export function tdRows() {
  const { S, G, E: Ecl } = E343.poles(), CB = C344.composeBalance(), row = CB.rows.find((r) => r.frame === '3d' && r.place === 'rev'), rho = row.rho;
  const srcs = [S, scl(G, -rho)], sum = add(srcs[0], srcs[1]), sEq = unit(sum), out = [];
  for (const kg of DECL.tdKg) for (const sc of ['L', 'Ta']) for (const w0 of DECL.tdScales) for (const rd of ['each', 'sum']) {
    let s = Ecl.slice(), w = w0, work = 0; const dt = DECL.tdT / DECL.tdSteps, ang0 = angDeg(s, sEq); let reach = null;
    const der = (s, w) => {
      const fac = sc === 'Ta' ? 1 / w : 1; let ds = [0, 0, 0], each = 0, perpSum = [0, 0, 0];
      for (const O of srcs) { const pp = sub(O, scl(s, dot(O, s))); ds = add(ds, scl(add(scl(crs(pp, s), kg), scl(pp, DECL.kd)), fac)); each += dot(pp, pp); perpSum = add(perpSum, pp); }
      const X = rd === 'each' ? each : dot(perpSum, perpSum), Pw = (1 - DECL.f0) * w * X;   // I = 1・行き先は慣性回転(h 0)
      return { ds, dw: Pw / w, Pw };
    };
    for (let k = 0; k < DECL.tdSteps; k++) {
      const a1 = der(s, w), s2 = add(s, scl(a1.ds, dt / 2)), a2 = der(s2, w + dt / 2 * a1.dw), s3 = add(s, scl(a2.ds, dt / 2)), a3 = der(s3, w + dt / 2 * a2.dw), s4 = add(s, scl(a3.ds, dt)), a4 = der(s4, w + dt * a3.dw);
      s = unit(add(s, scl(add(add(a1.ds, scl(a2.ds, 2)), add(scl(a3.ds, 2), a4.ds)), dt / 6))); work += dt / 6 * (a1.Pw + 2 * a2.Pw + 2 * a3.Pw + a4.Pw); w += dt / 6 * (a1.dw + 2 * a2.dw + 2 * a3.dw + a4.dw);
      if (reach === null && angDeg(s, sEq) <= DECL.tdReach * ang0) reach = (k + 1) * dt;
    }
    out.push({ kg, scale: sc, w0, read: rd, rho, ang0Deg: ang0, angEndDeg: angDeg(s, sEq), galDegEnd: angDeg(s, G), eqGalDeg: angDeg(sEq, G), reach, wRatio: w / w0,
      ledgerResid: (0.5 * (w * w - w0 * w0) - work) / Math.max(work, 1e-300) });
  }
  return { rho, eqGalDeg: angDeg(sEq, G), eqEclDeg: angDeg(sEq, Ecl), rows: out };
}

/* ───────── T4 組合せと天体 ───────── */
export function comboRows() {
  const out = [];
  for (const dest of DECL.dests) for (const bal of ['none', 'Ta', 'Tbp', 'Tbc', 'Tc', 'TaTc']) {
    const o = { dest, bal, split: [0, 0.5, 0.5], f: DECL.f0, tau: 1, ret: 'field', T: DECL.T2, steps: DECL.steps2 }, R = plateau(o), A = R.a;
    out.push({ dest, bal, wRatio: A.wRatio, wiRatio: A.wiRatio, wdEnd: A.wdEnd, torqueRatio: A.torqueRatio, wJudge: R.wJudge, torqueFlat: R.torqueFlat, ledgerResid: A.ledgerResid });
  }
  return out;
}
/** 天体の桁(枝 h の表 9 の (W) の Ω —— ∥・⊥ は受け手の自転の軸に対して): D1 の自転の増え方・D3 の引きずり回転の上の値・Tc の増えの総量 */
export function bodyRows(HB = H.bodyRows(E.t1Table())) {
  const obs = E.observedRates(), out = [];
  for (const [id, src] of DECL.bodies) for (const q of DECL.bodyQ) {
    const r = HB.find((x) => x.id === id && x.src === src && x.q === q), w = Math.abs(r.omega), Op = r.Wperp, Opar = r.Wpar, Om = nrm(r.Wvec), th0 = Om > 0 ? Math.atan2(Op, Opar) : 0;
    const d1RateYr = Op * Op / w * YR;   // (D1・行き先が慣性回転だけ・h 0・f 0)の dω/dt ÷ ω [1/年]
    const d3 = DECL.tauYr.map((ty) => ({ tauYr: ty, dwOverW: Op * Op * ty * YR / w }));   // (D3・a_dr 1・f 0)の定常の ω_引きずり − Ω∥ = Ω⊥² τ(全自転を ω_T —— 増えの率 Ω⊥²)÷ ω
    const edge = !(Op > 1e-9 * Om);   // 自転の軸と Ω がほぼ平行・反平行(Ω⊥ ≈ 0 —— 軸は動かず、増えの総量は定まらない)
    const tcTotal = edge ? null : Om * (1 - Math.cos(th0)) / (DECL.kd * w);   // (Tc・k_d 1・h 0・f 0)の自転の増えの総量 ÷ ω
    const tatcLn = tcTotal;   // (TaTc)の ln(ω∞/ω₀)= 同じ量(ω₀ を尺度に)—— 小さいので Tc の総量と同じ桁
    const o = obs.find((x) => x.id === id);
    out.push({ id, src, q, omega: w, I: r.I, Wpar: Opar, Wperp: Op, thetaDeg: th0 / D2R, edge, d1RateYr, d3, tcTotal, tatcLn, obsRateYr: o ? o.rateYr : null, precRadYr: Om * YR,
      earthPrecRadYr: id === 'Earth' ? LIT.earthPrecArcsecPerYr / 3600 * D2R : null });
  }
  return out;
}
/** 熱の窓(イオ・木星 —— 枝 h の表 16 と同じ物差し): 行き先の型ごとの熱の割合(長い時間の定常 —— 熱 ÷ 仕事)× 枝 h の熱の上の限り */
export function heatRows(HB = H.bodyRows(E.t1Table())) {
  const HW = H.heatWindow(HB), cases = [['h1', [1, 0, 0], 'D1', 'field'], ['drD1', [0, 0, 1], 'D1', 'field'], ['drD3field', [0, 0, 1], 'D3', 'field'], ['drD3heat', [0, 0, 1], 'D3', 'heat'], ['halfD3heat', [0.5, 0, 0.5], 'D3', 'heat']];
  const frac = {};
  for (const [k, split, dest, ret] of cases) { const A = runCase({ dest, split, f: 0, ret, tau: 1, theta0Deg: 90, T: 200, steps: 40000 }); frac[k] = A.heat / A.work; }
  const out = [];
  for (const r of HW.filter((x) => x.id === 'Io' || x.id === 'Jupiter')) out.push({ id: r.id, q: r.q, upper: r.heatUpper, ruler: r.ruler, cols: Object.fromEntries(Object.entries(frac).map(([k, v]) => [k, { frac: v, ratio: r.ratio * v }])) });
  return { frac, rows: out, both: Object.keys(frac).map((k) => ({ k, n: out.filter((r) => r.id === 'Io' && r.cols[k].ratio <= 1 && out.some((x) => x.id === 'Jupiter' && x.q === r.q && x.cols[k].ratio >= 0.1)).length })) };
}

/* ───────── T5 零試験 ───────── */
export function pureScenes() {
  const R = (o) => runCase({ T: 10, steps: 2000, ...o });
  // ① Ω⊥ = 0(θ = 0)で何も増えない(どの型でも)
  const z1 = Math.max(...DECL.dests.flatMap((dest) => ['none', 'Ta', 'Tc', 'TaTc', 'Tbp'].map((bal) => Math.abs(R({ dest, bal, split: [0, 0.5, 0.5], theta0Deg: 0, w0dr: 1 }).wRatio - 1))));   // ω_引きずり は場の値 Ω∥ = 1 から
  // ② トルクの式の自転速度 0 でトルク 0・何も増えない(D2・慣性回転 0)
  const r2 = R({ dest: 'D2', split: [0, 0.5, 0.5], w0in: 0, w0dr: 1 });
  // ③ (D2) で慣性回転が増えない組(a_in 0)はトルクが一定(頭打ち)—— 自転は √ で増える
  const r3 = R({ dest: 'D2', split: [0, 0, 1] }), m3 = R({ dest: 'D2', split: [0, 0, 1], mut: 'D2total' });
  // ④ D1 の行き先を引きずり回転にしても全自転は同じ(名札だけ)
  const r4a = R({ dest: 'D1', split: [0, 1, 0] }), r4b = R({ dest: 'D1', split: [0, 0, 1] });
  // ⑤ D3 の閉じた形(a_in 0・θ 一定): ω_d(t) = Ω∥ + rτ + (ω_d0 − Ω∥ − rτ) e^(−t/τ)・r = a_dr (1 − f) Ω⊥²
  const th = 40 * D2R, tau = 0.7, f5 = 0.2, r5 = R({ dest: 'D3', split: [0, 0, 1], f: f5, tau, T: 6, steps: 6000 }), rr = (1 - f5) * Math.sin(th) ** 2, Opar = Math.cos(th);
  const want5 = Opar + rr * tau + (0 - Opar - rr * tau) * Math.exp(-6 / tau);
  // ⑥ 閉じた形: Tc・TaTc・Tbc・Tbp
  const cf = closedForms({ h: 0 }), rc = runCase({ bal: 'Tc', f: DECL.f0, T: 60, steps: 12000 }), rac = runCase({ bal: 'TaTc', f: DECL.f0, T: 200, steps: 40000 }), rbc = runCase({ bal: 'Tbc', T: 200, steps: 40000 }), rbp = runCase({ bal: 'Tbp', T: 10, steps: 4000 });
  const mac = runCase({ bal: 'TaTc', f: DECL.f0, T: 200, steps: 40000, mut: 'TaNoScale' });
  // ⑦ 帳簿(D3 の戻りを入れないと残る)
  const r7 = R({ dest: 'D3', split: [0.2, 0.3, 0.5], tau: 0.5, ret: 'field' }), m7 = R({ dest: 'D3', split: [0.2, 0.3, 0.5], tau: 0.5, ret: 'field', mut: 'noReturn' });
  // ⑧ 枝 h の表 15 の (R1) との照合
  const vsH = case1VsH(), hMax = Math.max(...vsH.flatMap((r) => r.diffs));
  // ⑨ Td の釣り合いの向き(合成のベクトルの向き・銀河と 120°)と近づく速さ(L に比例 —— 自転に依らない/Ta —— 自転に反比例)
  const TD = tdRows(), td = (kg, sc, w0, rd) => TD.rows.find((r) => r.kg === kg && r.scale === sc && r.w0 === w0 && r.read === rd);
  const tdL = td(0, 'L', 10, 'sum').reach / td(0, 'L', 1, 'sum').reach, tdTa = td(0, 'Ta', 10, 'sum').reach / td(0, 'Ta', 1, 'sum').reach;
  // ⑩ 入力の拒否
  const rej = [() => runCase({ split: [0.5, 0.5, 0.5] }), () => runCase({ dest: 'D9' }), () => runCase({ bal: 'T9' }), () => runCase({ f: 2 }), () => runCase({ ret: 'x', dest: 'D3' }), () => runCase({ split: [-0.1, 1.1, 0] })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  const want3 = Math.sqrt(1 + 2 * Math.sin(40 * D2R) ** 2 * 10);   // d(½ω²)/dt = a_dr (1 − f) ω_慣性 Ω⊥²(ω_慣性 = 1 のまま)
  return { z1, r2w: Math.abs(r2.wRatio - 1), r2tq: r2.torque0 + r2.torqueEnd, r3tq: Math.abs(r3.torqueRatio - 1), r3w: Math.abs(r3.wRatio - want3) / want3, m3w: Math.abs(m3.wRatio - want3) / want3,
    r4: Math.abs(r4a.wRatio - r4b.wRatio), d5: Math.abs(r5.wdEnd - want5) / want5, dTc: Math.abs(rc.wEnd - cf.Tc) / cf.Tc, dTaTc: Math.abs(rac.wEnd - cf.TaTc) / cf.TaTc, mTaTc: Math.abs(mac.wEnd - cf.TaTc) / cf.TaTc,
    dTbc: Math.abs(rbc.wEnd - cf.Tbc) / cf.Tbc, dTbp: Math.abs(rbp.wEnd - cf.TbpAt(10)) / cf.TbpAt(10), led7: Math.abs(r7.ledgerResid), mled7: Math.abs(m7.ledgerResid), hMax,
    tdEqDiff: Math.max(...TD.rows.map((r) => r.angEndDeg)), tdEqGal: TD.eqGalDeg, tdL, tdTa, rejects: rej };
}
export function pureGates(S) {
  return {
    perpZero: S.z1 === 0,
    zeroTorque: S.r2w === 0 && S.r2tq === 0,
    d2flat: S.r3tq < 1e-12 && S.r3w < 1e-12 && S.m3w > 1e-3,
    d1label: S.r4 < 1e-12,
    d3closed: S.d5 < 1e-9,
    closed: S.dTc < 1e-6 && S.dTaTc < 1e-6 && S.dTbc < 1e-6 && S.dTbp < 1e-9 && S.mTaTc > 1e-3,
    ledger: S.led7 < 1e-9 && S.mled7 > 1e-3,
    vsH: S.hMax < 1e-12,
    td: S.tdEqDiff < 1e-3 && Math.abs(S.tdEqGal - 120) < 1e-9 && Math.abs(S.tdL - 1) < 1e-9 && Math.abs(S.tdTa - 10) < 0.05,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

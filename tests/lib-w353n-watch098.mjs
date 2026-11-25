// 第353便n(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」・統括の検証項目 R478):
//   **注目の列 u = 0.98(背景の向きは太陽系の基準軸の向き (N+)・基準軸 L)で、「見ている時間の間は変わらない」を時間と変化の表に数える純関数 ——
//   円錐の半頂角の変化・歳差の位相の進み・公転の極に対する観測の傾きの揺れ・変化が 0.1°・1° に達する時間・公転の位相ごとの揺れ・
//   重力の側の歳差(比べる列 —— DFM の式ではない)と軸引きずりの歳差の 2 つの軸の合成・応答の側の構造の係数を入れた率 —— 診断だけ**
//   (器 tests/exp-w353n-watch098.mjs と QA behavior.watch098_353n・docs.watch098_353n が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便e(focusState・fMaxAt・DECL)・第353便b(mainState —— 零試験)・第353便c(rateMult・moiOf)・
//   第352便w(phaseRot・wobbleOf・stepPhases・coneRange・fKeep)・第352便l(closedAxis・twoAxisStep・axisCoef)・第352便i(kOf)・第352便c(refAxes —— 零試験)・第352便b(provValue・prov —— 仮の値)・
//   第351便d(vec・angDeg・r3Coeffs)・第347便e(t1Table・geometry)。
//
// ■ 語: ŝ = 自転軸・n̂ = 公転の法線(太陽は基準軸 L)・Ω = 背景 + 局所 (S)(第353便e の focusState —— 注目の列は背景がほぼ全部)・W = abs(Ω)。
//   χ = ŝ と Ω の角(円錐の半頂角)・ε = ŝ と n̂ の角(公転の極に対する観測の傾き)・α = Ω と n̂ の角。f = 第351便d の (N1) の比率(寄る割合 —— k₁ = f ÷ √((1 − f)² + f²))。
//   歳差の向き (g2−) = −Ω × ŝ(主 —— 「こまの式」)・(g2+) = +Ω × ŝ(比べる列)。
// ■ 1 つの軸の時間の発展(一定の Ω): 第352便l の closedAxis —— tan(χ/2) = tan(χ₀/2) e^(−k₁ W t)・方位は ∓k₂ W t。ε(t) は ŝ(t) と n̂ の角(n̂ は慣性の枠に固定 —— 主)。
//   比べる列「公転面も同じ係数で共回り」: n̂ も同じ Ω に k₂ で応える(第352便l の twoAxisStep —— 輪の係数 = 自転の係数で f 0)。
// ■ 変わらないと言える時間の幅: ε(t) − ε(0) の絶対値が物差し(0.1°・1°)に初めて達する t(格子で挟んで二分)。χ の変化は閉じた形 t = ln(tan(χ₀/2) ÷ tan((χ₀ − Δ)/2)) ÷ (k₁ W)。
// ■ 公転の位相ごとの揺れ: 第352便w の phaseRot(太陽由来 (S) を位相ごとに)を wobbleOf に入れ、背景は一定の項として平均にだけ足す(ずれは局所から直接に)。
// ■ 2 つの軸の合成(T3): dŝ/dt = σ_g ω_g (n̂ × ŝ)(重力の側 —— 比べる列・率は仮の値)+ 軸引きずり(Ω = W L̂・(R3) の 2 経路)。n̂ 固定・f 0 なら、
//   2 つの回転の和 Ω_c = σ_g ω_g n̂ + σ_d k₂ W L̂ のまわりの剛体の回転(閉じた形)—— ε の幅は第352便w の coneRange(Ω_c, ŝ, n̂)。
//   f > 0 の長い時間は速い歳差で平均した形: tan(ε/2) = tan(ε₀/2) e^(−k₁ W cos α t)(経路 ① の L̂ への寄りを n̂ のまわりで平均 —— 候補の式・刻みの步で照らす)。
//   刻みの步(照らし): 重力の半步(closedAxis)→ 軸引きずりの 1 步(twoAxisStep —— n̂ は固定か共回り)→ 重力の半步(Strang の分け方)。
// ■ 応答の側の構造の係数(T4): 第353便c の (P-応) の率の倍 m(R_ref 観測 —— 文献の慣性モーメントの係数)を W に掛ける(Ω の向きは変えない)。
// ■ 言わないこと: 安定している・保たれた、と結論を書かない(時間と変化の表)。背景の大きさを 1 つの値に置かない(0.98 は注目の列)。0.98 を (N+) の窓の内と書かない。
//   重力の側の歳差は比べる列(DFM の式ではない)・その率は仮の値(未照合)。
import * as F from './lib-w353e-focus098.mjs';
import * as B from './lib-w353b-maincol.mjs';
import * as C from './lib-w353c-recvradius.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as L from './lib-w352l-suntilt.mjs';
import * as I from './lib-w352i-stableprec.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353n-watch098-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
export const angDeg = R3.angDeg;
export const YR = W.YR;
export const ASYR = W.ASYR;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  omegaG: F.DECL.omegaG, ageYr: F.DECL.ageYr, uFocus: F.DECL.uFocus, dir: 'Np', axis: 'L',
  /** 受け手(8 惑星 + 太陽 —— 第353便e の鍵) */
  keys: F.DECL.keys,
  /** 見ている時間(年): 100 年・1 万年・100 万年・1 億年・太陽系の年齢(第352便y の宣言 45 億年) */
  windowsYr: Object.freeze([100, 1e4, 1e6, 1e8, F.DECL.ageYr]),
  /** 寄る割合 f: 0・傾きを保つ上限の最小(第353便e の fMaxAt の受け手 9 つの最小 —— 数えて置く)・1e-2 */
  fGrid: Object.freeze([0, 'fMin', 1e-2]),
  senses: Object.freeze(['g2m', 'g2p']), mainSense: 'g2m',
  /** 変わらないの物差し(度) */
  thrDeg: Object.freeze([0.1, 1]),
  /** 時間の格子の刻み: 見ている時間の 1/nWin か、歳差の一周の 1/nTurn の小さい方 */
  nWin: 400, nTurn: 400, bisect: 60,
  /** 2 つの軸の合成(T3): 受け手と仮の値の鍵(重力の側の歳差の率 —— 比べる列・未照合)。歳差の向きは公転の極のまわりで逆回り(earth.precSense) */
  gravBodies: Object.freeze([Object.freeze({ id: 'Earth', key: 'Earth|Sun', rateKey: 'earth.psiA.rate' }), Object.freeze({ id: 'Mars', key: 'Mars|Sun', rateKey: 'mars.prec.rate' })]),
  senseKey: 'earth.precSense',
  provKeys: Object.freeze(['earth.psiA.rate', 'earth.precSense', 'mars.prec.rate']),
  nModes: Object.freeze(['fixed', 'co']),
  /** 応答の側の構造の係数(T4): R_ref 観測(主)・規則(比べる列)—— 文献の慣性モーメントの係数(第330便a の値 —— 第353便c の moiOf) */
  refs: Object.freeze(['obs', 'rule']),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const idOf = (key) => key.split('|')[0];

/* ───────── 受け手の状態 ───────── */
/** 注目の列の状態(第353便e の focusState —— (N+)・L・規則の半径・k 1)。mult = 応答の側の率の倍(Ω の大きさに掛ける —— 向きは変えない) */
export function watchState(T1, GEO, key, { u = DECL.uFocus, k = 1, mult = 1 } = {}, cache = null) {
  if (!(fin(mult) && mult > 0)) throw new RangeError('watchState: 率の倍 > 0');
  const st = F.focusState(T1, GEO, key, { dir: DECL.dir, u, axis: DECL.axis, k }, cache);
  const Om = mult === 1 ? st.Om : scl(st.Om, mult);
  return { key, u, k, mult, sHat: st.sHat, nRing: st.nRing, Om, W: nrm(Om), chi0Deg: st.thDeg, eps0Deg: st.oblDeg, alphaDeg: st.alphaDeg, periodYr: 2 * Math.PI / nrm(Om) / YR };
}
/** 係数(第352便l の axisCoef —— (N1)) */
export const coefOf = (f, sense) => L.axisCoef(f, { sense });
/** t 年の後の ŝ(閉じた形) */
export function sAt(st, tYr, { f = 0, sense = DECL.mainSense } = {}) { return L.closedAxis(st.sHat, st.Om, tYr * YR, coefOf(f, sense)); }
/** t 年の後の ε(度)—— n̂ 固定 */
export function epsAt(st, tYr, o = {}) { return angDeg(sAt(st, tYr, o), st.nRing); }
/** t 年の後の χ(度)—— 閉じた形 */
export function chiAt(st, tYr, { f = 0 } = {}) {
  const k1 = I.kOf(f, 'g2m').k1;
  if (k1 === 0) return st.chi0Deg;
  return 2 * Math.atan(Math.tan(st.chi0Deg * D2R / 2) * Math.exp(-k1 * st.W * tYr * YR)) / D2R;
}
/** 時間の格子(0..T —— 刻みは T/nWin と一周/nTurn の小さい方 —— 上限 2e5 点) */
function gridOf(st, Tyr, f) {
  const k2 = I.kOf(f, 'g2m').k2, per = k2 > 0 ? st.periodYr / k2 : Infinity;
  const dt = Math.min(Tyr / DECL.nWin, per / DECL.nTurn), n = Math.min(200000, Math.ceil(Tyr / dt));
  return Array.from({ length: n + 1 }, (_, i) => Tyr * i / n);
}

/**
 * watchRow(key, { u, f, sense, years, mult, T1, GEO, cache }) —— 見ている時間 years の間の変化:
 * 返す { key, u, f, sense, years, mult, chi0Deg, dChiDeg(χ(T) − χ₀), phaseTurns(k₂ W T ÷ 2π), eps0Deg, epsMinDeg, epsMaxDeg, swingDeg(abs(ε(t) − ε₀) の最大),
 *        dEpsEndDeg(ε(T) − ε₀), coneEps(第352便w の coneRange —— 一周の幅), periodYr, coRotDeg(共回りの比べる列 —— abs(γ(T) − γ₀)) }
 */
export function watchRow(key, { u = DECL.uFocus, f = 0, sense = DECL.mainSense, years, mult = 1, T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  if (!(fin(years) && years > 0)) throw new RangeError('watchRow: 見ている時間 > 0');
  if (!DECL.senses.includes(sense)) throw new RangeError('watchRow: 歳差の向きは g2m・g2p');
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('watchRow: 0 ≤ f ≤ 1');
  const st = watchState(T1, GEO, key, { u, mult }, cache), k = I.kOf(f, sense);
  let mn = st.eps0Deg, mx = st.eps0Deg, sw = 0;
  for (const t of gridOf(st, years, f)) { const e = epsAt(st, t, { f, sense }); mn = Math.min(mn, e); mx = Math.max(mx, e); sw = Math.max(sw, Math.abs(e - st.eps0Deg)); }
  const eEnd = epsAt(st, years, { f, sense }), cr = W.coneRange(st.Om, st.sHat, st.nRing);
  const tw = L.twoAxisStep({ n0: st.nRing, s0: st.sHat, om: st.Om, T: years * YR, steps: 1, ring: coefOf(0, sense), spin: coefOf(f, sense) });
  return { key, u, f, sense, years, mult, chi0Deg: st.chi0Deg, dChiDeg: chiAt(st, years, { f }) - st.chi0Deg, phaseTurns: k.k2 * st.W * years * YR / (2 * Math.PI),
    eps0Deg: st.eps0Deg, epsMinDeg: mn, epsMaxDeg: mx, swingDeg: sw, dEpsEndDeg: eEnd - st.eps0Deg,
    coneEps: { minDeg: cr.oblMinDeg, maxDeg: cr.oblMaxDeg, swingDeg: cr.swingDeg }, periodYr: st.periodYr / (k.k2 || NaN), coRotDeg: Math.abs(tw.gammaDeg - st.eps0Deg) };
}

/** ε の変化が thrDeg に初めて達する時間(年)—— tMaxYr の内に達しなければ null */
export function tReach(key, { u = DECL.uFocus, f = 0, sense = DECL.mainSense, thrDeg, mult = 1, tMaxYr = DECL.ageYr, T1 = E.t1Table(), GEO = E.geometry(), cache = null } = {}) {
  if (!(fin(thrDeg) && thrDeg > 0)) throw new RangeError('tReach: 物差し > 0');
  const st = watchState(T1, GEO, key, { u, mult }, cache), g = (t) => Math.abs(epsAt(st, t, { f, sense }) - st.eps0Deg) - thrDeg;
  const grid = gridOf(st, tMaxYr, f);
  for (let i = 1; i < grid.length; i++) {
    if (g(grid[i]) >= 0) {
      let a = grid[i - 1], b = grid[i];
      for (let j = 0; j < DECL.bisect; j++) { const m = 0.5 * (a + b); if (g(m) >= 0) b = m; else a = m; }
      return b;
    }
  }
  return null;
}
/** χ の変化が thrDeg に達する時間(年 —— 閉じた形)。f 0 は null(変わらない) */
export function tChi(st, { f, thrDeg }) {
  const k1 = I.kOf(f, 'g2m').k1;
  if (!(k1 > 0) || !(st.chi0Deg > thrDeg)) return null;
  return Math.log(Math.tan(st.chi0Deg * D2R / 2) / Math.tan((st.chi0Deg - thrDeg) * D2R / 2)) / (k1 * st.W) / YR;
}

/* ───────── 公転の位相ごとの揺れ(第352便w の phaseRot・wobbleOf・stepPhases)───────── */
/** 惑星 id の太陽由来 (S) の位相ごとの揺れ(背景は一定の項)。返す { ampAs(一次の揺れの最大 ″), m2As(1 公転の後の二次の差 ″), varRel, orbitYr, stepDiffRad(位相ごとの步と平均の步の差 —— 1 公転) } */
export function phaseWobble(T1, GEO, id, { u = DECL.uFocus, f = 0, sense = DECL.mainSense } = {}, cache = null) {
  const st = watchState(T1, GEO, id + '|Sun', { u }, cache), ph = W.phaseRot(T1, GEO, id, { tSrc: 0 });
  const bg = sub(st.Om, ph.mean);   // 背景(+ 局所の位相の平均との丸めの差)—— 一定の項
  const w = W.wobbleOf(ph.phases, { sHat: st.sHat, T: ph.T, f, sense, bg });
  const full = ph.phases.map((p) => ({ Om: add(p.Om, bg) }));
  const a = W.stepPhases(full, { s0: st.sHat, T: ph.T, sense, mean: false }), b = W.stepPhases(full, { s0: st.sHat, T: ph.T, sense, mean: true });
  return { id, ampAs: w.ampAs, m2As: w.m2As, varRel: w.varRel, orbitYr: ph.T / YR, stepDiffRad: nrm(sub(a.s, b.s)), turnRad: w.turnRad };
}

/* ───────── 2 つの軸の合成(T3 —— 重力の側は比べる列・率は仮の値)───────── */
/** 重力の側の歳差の率(rad/s の大きさ)と向き(公転の極のまわりの符号)—— 仮の値(未照合) */
export function gravRate(rateKey) {
  const r = Math.abs(PV.provValue(rateKey, 'mid')), sg = PV.provValue(DECL.senseKey, 'mid');
  return { asYr: r, radS: r / ASYR, sign: sg, periodYr: 1296000 / r, provKeys: [rateKey, DECL.senseKey] };
}
/** 2 つの回転の和(n̂ 固定・f 0 —— 閉じた形): Ω_c = σ_g ω_g n̂ + σ_d k₂ W L̂(σ は右ねじの符号 —— g2m は −)。返す { Oc, tiltDeg(Ω_c と n̂), cone(coneRange(Ω_c, ŝ, n̂)), periodYr } */
export function twoAxisClosed(st, { omG, signG = -1, sense = DECL.mainSense }) {
  const sd = sense === 'g2p' ? 1 : -1, Oc = add(scl(unit(st.nRing), signG * omG), scl(st.Om, sd));
  const cr = W.coneRange(Oc, st.sHat, st.nRing);
  return { Oc, tiltDeg: angDeg(Oc, scl(st.nRing, Math.sign(signG))), cone: cr, periodYr: 2 * Math.PI / nrm(Oc) / YR };
}
/** 平均した形の ε(t)(f > 0 —— 候補の式): tan(ε/2) = tan(ε₀/2) e^(−k₁ W cos α t) */
export function epsAvg(st, tYr, { f }) {
  const k1 = I.kOf(f, 'g2m').k1, ca = Math.cos(angDeg(st.Om, st.nRing) * D2R);
  return 2 * Math.atan(Math.tan(st.eps0Deg * D2R / 2) * Math.exp(-k1 * st.W * ca * tYr * YR)) / D2R;
}
/** 刻みの步(Strang): 重力の半步 → 軸引きずり(twoAxisStep —— nMode 'fixed' は n̂ 固定・'co' は n̂ も同じ係数(f 0)で共回り)→ 重力の半步。返す { s, n, epsDeg, epsMinDeg, epsMaxDeg } */
export function twoAxisSteps(st, { omG, signG = -1, f = 0, sense = DECL.mainSense, nMode = 'fixed', Tyr, steps, Om = null }) {
  if (!DECL.nModes.includes(nMode)) throw new RangeError('twoAxisSteps: n̂ の置き方は fixed・co');
  if (!(Number.isInteger(steps) && steps >= 1 && fin(Tyr) && Tyr > 0)) throw new RangeError('twoAxisSteps: 刻み ≥ 1・T > 0');
  const dt = Tyr * YR / steps, gC = { sense: signG < 0 ? 'g2m' : 'g2p', kTilt: 0, kPrec: 1 }, Od = Om || st.Om;
  const ring = nMode === 'co' ? coefOf(0, sense) : { sense, kTilt: 0, kPrec: 0 }, spin = coefOf(f, sense);
  let s = st.sHat, n = st.nRing, mn = Infinity, mx = -Infinity;
  for (let i = 0; i < steps; i++) {
    s = L.closedAxis(s, scl(unit(n), omG), dt / 2, gC);
    const r = L.twoAxisStep({ n0: n, s0: s, om: Od, T: dt, steps: 1, ring, spin }); s = r.s; n = r.n;
    s = L.closedAxis(s, scl(unit(n), omG), dt / 2, gC);
    const e = angDeg(s, n); mn = Math.min(mn, e); mx = Math.max(mx, e);
  }
  return { s, n, epsDeg: angDeg(s, n), epsMinDeg: mn, epsMaxDeg: mx };
}

/* ───────── 応答の側の構造の係数(T4)───────── */
/** 受け手 key の (P-応) の率の倍(第353便c の rateMult —— ref 'obs' 主・'rule' 比べる列・文献の慣性モーメントの係数)。係数が無ければ null */
export function multOf(key, { ref = 'obs', cR = 1 } = {}) { return C.rateMult(idOf(key), { ref, cR }); }

/* ───────── 零試験 ───────── */
/** 統括の数え直し 3 の共通の点検の数(5 桁)と第353便e の数(3 桁) */
export const ANCHOR = Object.freeze({ Lvec: Object.freeze(['0.026257', '0.008317', '0.999621']), eqLDeg: '1.1207', omegaG: '9.09e-16',
  fMinJup: '8.33e-4', periodYr: '2.24e+8', turnsSun: '20.1', chiEarth: '23.009', chiSun: '5.968' });
const e2 = (x) => Number(x).toExponential(2);
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = RC.refAxes(T1, GEO);
  // ① 共通の点検の数: L・eq と L の角・ω_G・f の上限の最小(木星)・一周の年数・太陽の周の数・円錐
  const fm = DECL.keys.map((k) => F.fMaxAt(k, { T1, GEO, cache }).fMax), fMin = Math.min(...fm), jMin = DECL.keys[fm.indexOf(fMin)];
  const sE = watchState(T1, GEO, 'Earth|Sun', {}, cache), sS = watchState(T1, GEO, 'Sun|-', {}, cache);
  // ② focusState の合成 = 第353便b の mainState の合成(地球・金星・太陽 —— 相対 1e-9 の床)・ds の向き(g2m)= ŝ(t) の微分
  let mErr = 0, dsErr = 0;
  for (const id of ['Earth', 'Venus', 'Sun']) {
    const key = id === 'Sun' ? 'Sun|-' : id + '|Sun', a = watchState(T1, GEO, key, {}, cache), b = B.mainState(T1, GEO, id, { u: DECL.uFocus }, cache);
    mErr = Math.max(mErr, nrm(sub(a.Om, b.Om)) / nrm(b.Om), Math.abs(a.chi0Deg - b.coneDeg));
    const h = 10, d = scl(sub(sAt(a, h), a.sHat), 1 / (h * YR)); dsErr = Math.max(dsErr, nrm(sub(d, b.ds)) / Math.max(nrm(b.ds), 1e-300));
  }
  // ③ f 0 では χ は変わらない・ε の一周の幅は coneRange と同じ(格子で数えた幅 —— 一周を超える時間)・(g2−) と (g2+) は同じ幅
  const r0 = watchRow('Earth|Sun', { f: 0, years: 3e8, T1, GEO, cache }), r0p = watchRow('Earth|Sun', { f: 0, sense: 'g2p', years: 3e8, T1, GEO, cache });
  const coneErr = Math.max(Math.abs(r0.epsMaxDeg - r0.coneEps.maxDeg), Math.abs(r0.epsMinDeg - r0.coneEps.minDeg), Math.abs(r0p.epsMaxDeg - r0.coneEps.maxDeg));
  // ④ χ の閉じた形 = ŝ(t) と Ω の角(f 1e-2・45 億年)・tChi で χ が 0.1° 変わる
  const sF = watchState(T1, GEO, 'Earth|Sun', {}, cache), tA = DECL.ageYr, chiErr = Math.abs(angDeg(sAt(sF, tA, { f: 1e-2 }), sF.Om) - chiAt(sF, tA, { f: 1e-2 }));
  const tc = tChi(sF, { f: 1e-2, thrDeg: 0.1 }), tcErr = Math.abs(chiAt(sF, tc, { f: 1e-2 }) - (sF.chi0Deg - 0.1));
  // ⑤ tReach: 達した時間で abs(Δε) が物差し・その前の格子では届かない(地球 0.1°)・太陽(ε = χ)は f 0 で null
  const tr = tReach('Earth|Sun', { thrDeg: 0.1, T1, GEO, cache }), trErr = Math.abs(Math.abs(epsAt(sE, tr) - sE.eps0Deg) - 0.1), trSun = tReach('Sun|-', { thrDeg: 0.1, T1, GEO, cache });
  // ⑥ 位相ごとの步(第352便w): 位相の平均 + 背景 = 合成・1 公転の位相ごとの步と平均の步の差は二次の式の桁
  const pw = phaseWobble(T1, GEO, 'Earth', {}, cache);
  // ⑦ 2 つの軸: 閉じた形(n̂ 固定・f 0)= 刻みの步(誇張した比 W ÷ ω_g = 0.05・5 周)・平均した形(f 0.2 の誇張)= 刻みの步
  const omG = sE.W / 0.05, cl = twoAxisClosed(sE, { omG }), Tg = 5 * 2 * Math.PI / omG / YR;
  const stp = twoAxisSteps(sE, { omG, Tyr: Tg, steps: 4000 });
  const exact = L.closedAxis(sE.sHat, cl.Oc, Tg * YR, { sense: 'g2p', kTilt: 0, kPrec: 1 }), twoErr = nrm(sub(stp.s, exact));
  const omG2 = sE.W / 0.01, Tav = 0.5 / (I.kOf(0.2, 'g2m').k1 * sE.W) / YR, sa = twoAxisSteps(sE, { omG: omG2, f: 0.2, Tyr: Tav, steps: 20000 }), avErr = Math.abs(sa.epsDeg - epsAvg(sE, Tav, { f: 0.2 }));
  const co = twoAxisSteps(sE, { omG, Tyr: Tg, steps: 4000, nMode: 'co' }), coErr = Math.abs(co.epsMaxDeg - co.epsMinDeg);
  // ⑧ 率の倍(第353便c の rateMult)・倍を掛けた一周 = 一周 ÷ 倍
  const mE = multOf('Earth|Sun'), sM = watchState(T1, GEO, 'Earth|Sun', { mult: mE }, cache), multErr = Math.abs(sM.periodYr * mE / sE.periodYr - 1);
  // ⑨ 仮の値(地球の歳差の一周)
  const gE = gravRate('earth.psiA.rate');
  // 拒否
  const rej = [() => watchRow('Earth|Sun', { years: 0 }), () => watchRow('Earth|Sun', { years: 1, sense: 'x' }), () => watchRow('Earth|Sun', { years: 1, f: 2 }), () => watchState(T1, GEO, 'Earth|Sun', { mult: 0 }),
    () => tReach('Earth|Sun', { thrDeg: 0 }), () => twoAxisSteps(sE, { omG: 1, Tyr: 1, steps: 0 }), () => twoAxisSteps(sE, { omG: 1, Tyr: 1, steps: 1, nMode: 'x' })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { L: A.L, eqL: angDeg(A.L, A.eq), omegaG: DECL.omegaG, fMin, jMin, periodYr: sE.periodYr, turnsSun: DECL.ageYr / sS.periodYr, chiE: sE.chi0Deg, chiS: sS.chi0Deg,
    mErr, dsErr, coneErr, chiErr, tcErr, trErr, tr, trSun, pw, twoErr, avErr, coErr, tilt: cl.tiltDeg, multErr, mE, gE, rejects: rej };
}
export function pureGates(S) {
  return {
    anchor: S.L.map((x) => x.toFixed(6)).join(',') === ANCHOR.Lvec.join(',') && S.eqL.toFixed(4) === ANCHOR.eqLDeg && e2(S.omegaG) === '9.09e-16' && S.fMin.toExponential(2) === ANCHOR.fMinJup && S.jMin === 'Jupiter|Sun'
      && S.periodYr.toExponential(2) === ANCHOR.periodYr && S.turnsSun.toFixed(1) === ANCHOR.turnsSun && S.chiE.toFixed(3) === ANCHOR.chiEarth && S.chiS.toFixed(3) === ANCHOR.chiSun,
    sameAsMain: S.mErr < 1e-9 && S.dsErr < 1e-5,
    coneSwing: S.coneErr < 1e-3,
    chiClosed: S.chiErr < 1e-9 && S.tcErr < 1e-9,
    reach: fin(S.tr) && S.trErr < 1e-9 && S.trSun === null,
    phaseStep: S.pw.varRel < 1e-6 && fin(S.pw.ampAs) && S.pw.stepDiffRad < 1e-12,
    twoAxis: S.twoErr < 1e-6 && S.avErr < 0.05 && S.coErr < 1e-9 && S.tilt > 0,
    mult: S.multErr < 1e-12 && S.mE > 1 && S.mE < 2,
    prov: Math.abs(S.gE.periodYr - 1296000 / 50.38481507) < 1e-6 && S.gE.sign === -1,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}

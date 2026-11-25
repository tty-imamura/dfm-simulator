// 第353便x(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」「AN1052: イ」・統括の検証項目 R488):
//   **2 つの軸(重力の側の歳差 —— 比べる列・DFM の式ではない —— と軸引きずりの歳差)の合成を、逆行の金星・横倒しの天王星・火星ほか 9 天体で数え、
//   公転面(輪の法線)が背景に応える係数の比 c_輪 ÷ c を振って、公転の極に対する観測の傾き ε の幅が「固定」から「共回り」へ移る所を数える純関数 —— 診断だけ**
//   (器 tests/exp-w353x-twoaxis.mjs と QA behavior.twoaxis353x・docs.twoaxis353x が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第353便n(watchState・gravRate・twoAxisClosed・twoAxisSteps・epsAvg・epsAt・coefOf)・第353便f(tideRate —— 零試験・DECL.srcSet)・
//   第353便m(earthGrav —— 月の道の 18.6 年の平均の列)・第353便e(fRingAt・fMaxAt・DECL)・第352便u(rateOf —— 天王星・海王星・水星の重力の側の列)・
//   第352便w(coneRange・fRingMin)・第352便l(closedAxis・twoAxisStep・axisCoef)・第352便i(kOf)・第352便c(refAxes —— 零試験)・第352便b(provValue —— 仮の値)・
//   第351便d(vec・angDeg)・第347便e(t1Table・geometry)。
//
// ■ 語: ŝ = 自転軸・n̂ = 公転の法線(輪の法線)・Ω = 背景 + 局所 (S)(第353便n の watchState —— 注目の列 (N+)・L・u 0.98・規則の半径・k 1)・W = abs(Ω)。
//   ε = ŝ と n̂ の角(公転の極に対する観測の傾き)。歳差の向き (g2−) = −Ω × ŝ(主)・(g2+) = +Ω × ŝ(比べる列)。
//   重力の側の歳差: dŝ/dt = σ_g ω_g (n̂ × ŝ)(比べる列 —— 率は 仮の値〔印〕/重力の側の潮汐のトルクの列(第352便u の (T-g) の公転の北極のまわりの方位の率)/地球は月の道の 18.6 年の平均の列(第353便m))。
//   σ_g(公転の北極のまわりの回り): 仮の値は「順行なら逆回り」(earth.precSense)× ŝ·n̂ の符号(金星・天王星は ŝ·n̂ < 0 で替わる)・潮汐の列は方位の率の符号のまま。
// ■ c_輪 ÷ c = 公転面(輪の法線)が背景に応える係数 ÷ 自転軸が応える係数(経路 ② の比 —— 0 = 公転の極を固定(第353便n の主)・1 = 同じ係数で共回り(第353便n の比べる列))。
//   閉じた形(f 0・一定の Ω): Ω の向きのまわりに c_輪 ÷ c k₂ W で回る枠では n̂ が止まり、ŝ は 2 つの回転の和 Ω_c(c_輪 ÷ c) = σ_g ω_g n̂ + σ_d (1 − c_輪 ÷ c) Ω のまわりの剛体の回転
//   (重力の側の項も経路 ② の項も、Ω のまわりの回転について共変 —— 枠の回転で形が替わらない)。ε の幅 = 第352便w の coneRange(Ω_c(c_輪 ÷ c), ŝ, n̂)。
//   軸引きずりだけ(ω_g 0)は Ω_c = σ_d (1 − c_輪 ÷ c) Ω —— 幅は c_輪 ÷ c ≠ 1 なら c_輪 ÷ c に依らず同じで、一周が 1 ÷ abs(1 − c_輪 ÷ c) 倍に延びるだけ。
//   見ている時間 T の内の ε の変化 = 剛体の回転を T まで(一周を越えれば幅の全部)。
// ■ 公転面が寄る(第352便w の fRingMin —— 散らばり 30° → 7° を年齢の内に): 輪の係数が c_輪 ÷ c 倍なら要る k₁_輪 は 1 ÷ c_輪 ÷ c 倍 —— c_輪 ÷ c < k₁(f_輪 1)では寄れない。
//   軸引きずりだけでは、輪の法線と自転軸を一定の Ω のもとで別の係数で閉じた形に進める(第352便l の twoAxisStep の 1 步は一定の Ω で厳密)。
//   2 つの軸では、重力の側の速い歳差の平均で ε は断熱の不変量(n̂ のゆっくりした動きは一次で ε を替えない —— 候補の式・刻みの步で照らす)。
// ■ 言わないこと: 傾きが安定している・保たれた、と結論を書かない(幅の表)。重力の側の列は比べる列(DFM の式ではない)・仮の値は未照合(合否に使わない)。
import * as N from './lib-w353n-watch098.mjs';
import * as Fr from './lib-w353f-ratesum.mjs';
import * as M from './lib-w353m-residsign.mjs';
import * as F from './lib-w353e-focus098.mjs';
import * as U from './lib-w352u-tidaldrag.mjs';
import * as W from './lib-w352w-keepcone.mjs';
import * as L from './lib-w352l-suntilt.mjs';
import * as I from './lib-w352i-stableprec.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353x-twoaxis-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, nrm, scl, add, sub, unit } = R3.vec;
export const angDeg = R3.angDeg;
export const YR = N.YR;
export const ASYR = N.ASYR;

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  omegaG: F.DECL.omegaG, ageYr: F.DECL.ageYr, uFocus: F.DECL.uFocus, dir: 'Np', axis: 'L',
  /** 受け手(8 惑星 + 太陽 —— 第353便e の鍵) */
  keys: F.DECL.keys,
  /** 表 1 の天体(2 つの軸 —— 天体ごと) */
  t1Keys: Object.freeze(['Earth|Sun', 'Mars|Sun', 'Venus|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun']),
  /** 重力の側の率の列: prov = 仮の値(印)・tide = 重力の側の潮汐のトルクの列(比べる列)・moonAvg = 地球の月の道の 18.6 年の平均の列(第353便m) */
  kinds: Object.freeze(['prov', 'tide', 'moonAvg']),
  provKeyOf: Object.freeze({ Earth: 'earth.psiA.rate', Mars: 'mars.prec.rate', Venus: 'venus.prec.rate' }),
  senseKey: 'earth.precSense',
  provKeys: Object.freeze(['earth.psiA.rate', 'earth.precSense', 'mars.prec.rate', 'venus.prec.rate']),
  /** 潮汐の列の源の組(第353便f の DECL.srcSet —— 無い天体は太陽だけ) */
  srcSetOf: (id) => Fr.DECL.srcSet[id] || 'sun',
  senses: Object.freeze(['g2m', 'g2p']), mainSense: 'g2m',
  /** c_輪 ÷ c の格子(主)と、共回りの近くの補い */
  kappas: Object.freeze([0, 0.01, 0.1, 0.5, 1, 2]), kappasNear: Object.freeze([0.9, 0.99, 0.999, 1.001, 1.01]),
  /** 見ている時間(年)と主の物差し(度) */
  windowsYr: Object.freeze([1e4, 1e6, F.DECL.ageYr]), thrDeg: 0.1,
  /** 公転面が寄る: 散らばり 30° → 7°(第353便e の spread) */
  spread: F.DECL.spread,
  /** 窓の内の格子の点の数・二分の回数 */
  nGrid: 4000, bandBisect: 40, bandSpan: 1e3,
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const idOf = (key) => key.split('|')[0];
const ctx = (o = {}) => ({ T1: o.T1 || E.t1Table(), GEO: o.GEO || E.geometry(), cache: o.cache || {} });
const sdOf = (sense) => { if (!DECL.senses.includes(sense)) throw new RangeError('歳差の向きは g2m・g2p'); return sense === 'g2p' ? 1 : -1; };
const ROT = Object.freeze({ sense: 'g2p', kTilt: 0, kPrec: 1 });

/* ───────── 重力の側の率(比べる列 —— DFM の式ではない)───────── */
/**
 * gravOf(key, kind, o) —— 受け手 key の重力の側の歳差の率(公転の北極のまわりの回転): { kind, omG(rad/s), asYr(″/年), signG, periodYr, provisional, provKeys } か null(列が無い)。
 *   prov: 仮の値の大きさ × σ_g(earth.precSense × sign(ŝ·n̂))/tide: 第352便u の rateOf((T-g)・源の組は第353便f の宣言)の公転の北極の方位の率/moonAvg: 第353便m の earthGrav({ moon: 'avg' })(地球だけ)。
 */
export function gravOf(key, kind, o = {}) {
  if (!DECL.kinds.includes(kind)) throw new RangeError('gravOf: 列は prov・tide・moonAvg');
  const id = idOf(key);
  if (id === 'Sun') return null;
  const C = ctx(o), st = N.watchState(C.T1, C.GEO, key, {}, C.cache), sn = Math.sign(dot(st.sHat, st.nRing));
  let az, provKeys = [], provisional = false;
  if (kind === 'prov') {
    const rk = DECL.provKeyOf[id];
    if (!rk) return null;
    az = Math.abs(PV.provValue(rk, 'mid')) * PV.provValue(DECL.senseKey, 'mid') * sn; provKeys = [rk, DECL.senseKey]; provisional = true;
  } else if (kind === 'tide') {
    const ck = 'xTide|' + id; let r = C.cache[ck];
    if (!r) { r = U.rateOf(C.T1, C.GEO, id, DECL.srcSetOf(id), 'Tg', 'nat', {}, C.cache); C.cache[ck] = r; }
    if (r.ds === null) return null;
    az = r.az.orb;
  } else {
    if (id !== 'Earth') return null;
    az = M.earthGrav({ moon: 'avg' }, { T1: C.T1, GEO: C.GEO }).az;
  }
  return { kind, omG: Math.abs(az) / ASYR, asYr: Math.abs(az), signG: Math.sign(az), periodYr: 1296000 / Math.abs(az), provisional, provKeys, comparison: true };
}

/* ───────── 閉じた形 ───────── */
/** Ω_c(c_輪 ÷ c) = σ_g ω_g n̂ + σ_d (1 − c_輪 ÷ c) Ω(f 0 —— Ω のまわりに c_輪 ÷ c k₂ W で回る枠) */
export function ocOf(st, { omG = 0, signG = -1, sense = DECL.mainSense, kRing = 0 }) {
  if (!(fin(omG) && omG >= 0 && fin(kRing))) throw new RangeError('ocOf: ω_g ≥ 0・c_輪 ÷ c は有限の数');
  return add(scl(unit(st.nRing), signG * omG), scl(st.Om, sdOf(sense) * (1 - kRing)));
}
/** 剛体の回転 Ω_c のもとで、T 年の内の abs(ε(t) − ε₀) の最大(一周を越えれば幅の全部 —— 閉じた形)。Ω_c 0 なら 0 */
export function winSwing(Oc, s, n, Tyr, nGrid = DECL.nGrid) {
  const w = nrm(Oc), e0 = angDeg(s, n);
  if (!(w > 0) || Tyr === 0) return 0;
  const cr = W.coneRange(Oc, s, n);
  if (w * Tyr * YR >= 2 * Math.PI) return Math.max(cr.oblMaxDeg - e0, e0 - cr.oblMinDeg);
  let mx = 0;
  for (let i = 1; i <= nGrid; i++) { const t = Tyr * YR * i / nGrid; mx = Math.max(mx, Math.abs(angDeg(L.closedAxis(s, Oc, t, ROT), n) - e0)); }
  return mx;
}

/**
 * twoRow(key, { u, f, sense, signG, rateKey | omG | kind, nMode, kRing, Tyr, T1, GEO, cache }) —— 2 つの軸の 1 行:
 *   rateKey(仮の値の鍵)か omG(rad/s —— signG と組む)か kind('prov'・'tide'・'moonAvg')で重力の側の率を置く(どれも無ければ軸引きずりだけ)。
 *   nMode 'fixed'(c_輪 ÷ c 0)・'co'(c_輪 ÷ c 1)・'kappa'(kRing)。
 * 返す { key, u, f, sense, kRing, grav, ratio(W ÷ ω_g), sameSense(重力の側と軸引きずりの歳差が公転の北極のまわりで同じ回りか), tiltDeg(合成の軸と σ_g n̂ の角), cone{min,max,swing},
 *        periodYr(合成の一周), dragOnly{swing, periodYr}, winDeg(T 年の内の abs(ε − ε₀) の最大), dragWinDeg, avgDEps(平均した形の縮み —— f > 0), eps0Deg, provisional, provKeys }
 */
export function twoRow(key, { u = DECL.uFocus, f = 0, sense = DECL.mainSense, signG = null, rateKey = null, omG = null, kind = null, nMode = 'fixed', kRing = null, Tyr = DECL.ageYr, T1, GEO, cache } = {}) {
  if (!['fixed', 'co', 'kappa'].includes(nMode)) throw new RangeError('twoRow: 公転の極の置き方は fixed・co・kappa');
  if (nMode === 'kappa' && !fin(kRing)) throw new RangeError('twoRow: kappa には c_輪 ÷ c');
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('twoRow: 0 ≤ f ≤ 1');
  if (!(fin(Tyr) && Tyr >= 0)) throw new RangeError('twoRow: 見ている時間 ≥ 0');
  const C = ctx({ T1, GEO, cache }), st = N.watchState(C.T1, C.GEO, key, { u }, C.cache), sd = sdOf(sense);
  const kr = nMode === 'fixed' ? 0 : nMode === 'co' ? 1 : kRing;
  let g = null;
  if (fin(omG)) g = { kind: 'given', omG, asYr: omG * ASYR, signG: signG === null ? -Math.sign(dot(st.sHat, st.nRing)) : signG, periodYr: 2 * Math.PI / omG / YR, provisional: false, provKeys: [] };
  else if (rateKey) {
    const gr = N.gravRate(rateKey), sn = Math.sign(dot(st.sHat, st.nRing));
    g = { kind: 'prov', omG: gr.radS, asYr: gr.asYr, signG: signG === null ? gr.sign * sn : signG, periodYr: gr.periodYr, provisional: true, provKeys: gr.provKeys };
  } else if (kind) { g = gravOf(key, kind, C); if (g && signG !== null) g = { ...g, signG }; }
  const oG = g ? g.omG : 0, sG = g ? g.signG : -1;
  const Oc = ocOf(st, { omG: oG, signG: sG, sense, kRing: kr }), Od = ocOf(st, { omG: 0, sense, kRing: kr });
  const zero = { minDeg: st.eps0Deg, maxDeg: st.eps0Deg, swingDeg: 0 };
  const cr = nrm(Oc) > 0 ? W.coneRange(Oc, st.sHat, st.nRing) : null, dr = nrm(Od) > 0 ? W.coneRange(Od, st.sHat, st.nRing) : null;
  const dragSense = Math.sign(sd * dot(st.Om, st.nRing));
  const avg = f > 0 ? (g ? N.epsAvg(st, Tyr, { f }) : N.epsAt(st, Tyr, { f, sense })) - st.eps0Deg : 0;
  return { key, u, f, sense, kRing: kr, eps0Deg: st.eps0Deg, W: st.W, grav: g, ratio: g ? st.W / g.omG : null,
    sameSense: g ? sG === dragSense : null, dragSense, tiltDeg: g ? angDeg(Oc, scl(st.nRing, sG)) : null,
    cone: cr ? { minDeg: cr.oblMinDeg, maxDeg: cr.oblMaxDeg, swingDeg: cr.swingDeg } : zero, periodYr: nrm(Oc) > 0 ? 2 * Math.PI / nrm(Oc) / YR : null,
    dragOnly: dr ? { swingDeg: dr.swingDeg, periodYr: 2 * Math.PI / nrm(Od) / YR } : { swingDeg: 0, periodYr: null },
    winDeg: winSwing(Oc, st.sHat, st.nRing, Tyr), dragWinDeg: winSwing(Od, st.sHat, st.nRing, Tyr), avgDEps: avg, Tyr,
    provisional: !!(g && g.provisional), provKeys: g ? g.provKeys : [] };
}

/* ───────── 刻みの步(照らし —— c_輪 ÷ c と f_輪 つき)───────── */
/**
 * ringSteps(st, { omG, signG, kRing, fRing, f, sense, Tyr, steps }) —— Strang の分けた步: 重力の半步(n̂ のまわり・閉じた形)→ 軸引きずりの 1 步
 * (第352便l の twoAxisStep —— 輪の係数 = c_輪 ÷ c × (N1)(f_輪)・自転の係数 = (N1)(f))→ 重力の半步。c_輪 ÷ c 0 = 第353便n の twoAxisSteps 'fixed'・c_輪 ÷ c 1 & f_輪 0 = 'co'。
 * 返す { s, n, epsDeg, epsMinDeg, epsMaxDeg, ringMoveDeg(輪の法線と Ω の角の変化) }
 */
export function ringSteps(st, { omG = 0, signG = -1, kRing = 0, fRing = 0, f = 0, sense = DECL.mainSense, Tyr, steps, Om = null }) {
  if (!(Number.isInteger(steps) && steps >= 1 && fin(Tyr) && Tyr > 0)) throw new RangeError('ringSteps: 刻み ≥ 1・T > 0');
  if (!(fin(kRing) && kRing >= 0 && fin(fRing) && fRing >= 0 && fRing <= 1)) throw new RangeError('ringSteps: c_輪 ÷ c ≥ 0・0 ≤ f_輪 ≤ 1');
  const Od = Om || st.Om, dt = Tyr * YR / steps, gC = { sense: signG < 0 ? 'g2m' : 'g2p', kTilt: 0, kPrec: 1 };
  const k = I.kOf(fRing, 'g2m'), ring = { sense, kTilt: kRing * k.k1, kPrec: kRing * k.k2 }, spin = N.coefOf(f, sense);
  let s = st.sHat, n = st.nRing, mn = Infinity, mx = -Infinity;
  const a0 = angDeg(n, Od);
  for (let i = 0; i < steps; i++) {
    if (omG > 0) s = L.closedAxis(s, scl(unit(n), omG), dt / 2, gC);
    const r = L.twoAxisStep({ n0: n, s0: s, om: Od, T: dt, steps: 1, ring, spin }); s = r.s; n = r.n;
    if (omG > 0) s = L.closedAxis(s, scl(unit(n), omG), dt / 2, gC);
    const e = angDeg(s, n); mn = Math.min(mn, e); mx = Math.max(mx, e);
  }
  return { s, n, epsDeg: angDeg(s, n), epsMinDeg: mn, epsMaxDeg: mx, ringMoveDeg: angDeg(n, Od) - a0 };
}
/** 軸引きずりだけ(ω_g 0)で、輪と自転軸を一定の Ω のもとで閉じた形に進めたときの T 年の内の abs(ε − ε₀) の最大と輪の動き(c_輪 ÷ c・f_輪・f) */
export function dragRingWin(st, { kRing, fRing = 0, f = 0, sense = DECL.mainSense, Tyr, nGrid = DECL.nGrid }) {
  const k = I.kOf(fRing, 'g2m'), ring = { sense, kTilt: kRing * k.k1, kPrec: kRing * k.k2 }, spin = N.coefOf(f, sense), e0 = st.eps0Deg;
  let mx = 0, n = st.nRing;
  for (let i = 1; i <= nGrid; i++) {
    const t = Tyr * YR * i / nGrid; n = L.closedAxis(st.nRing, st.Om, t, ring);
    mx = Math.max(mx, Math.abs(angDeg(L.closedAxis(st.sHat, st.Om, t, spin), n) - e0));
  }
  return { winDeg: mx, ringMoveDeg: angDeg(n, st.Om) - angDeg(st.nRing, st.Om) };
}

/* ───────── c_輪 ÷ c の帯 ───────── */
/** 公転面が寄るのに要る c_輪 ÷ c の下限(f_輪 1 で k₁ = 1)と、c_輪 ÷ c での f_輪 の下限(第352便w の fRingMin を Wb c_輪 ÷ c で) */
export function ringNeed(kRing, { u = DECL.uFocus } = {}) {
  const Wb = u * DECL.omegaG, base = W.fRingMin({ th0Deg: DECL.spread[0], th1Deg: DECL.spread[1], Wb });
  if (!(fin(kRing) && kRing > 0)) return { kMin: base.k1, fRing: null, base: base.f };
  return { kMin: base.k1, fRing: W.fRingMin({ th0Deg: DECL.spread[0], th1Deg: DECL.spread[1], Wb: Wb * kRing }).f, base: base.f };
}
/** c_輪 ÷ c の帯: ε の変化(T 年の内)が thr 以下の c_輪 ÷ c の範囲 [lo, hi](1 のまわり —— 二分・下は 0 まで・上は 1 + span まで)。kind null = 軸引きずりだけ。
 *  下の端 0 でも物差しの内なら lo = 0・上の端でも内なら hi = Infinity */
export function kappaBand(key, { kind = null, rateKey = null, sense = DECL.mainSense, Tyr, thrDeg = DECL.thrDeg, span = DECL.bandSpan, T1, GEO, cache } = {}) {
  const sw = (kr) => twoRow(key, { kind, rateKey, sense, nMode: 'kappa', kRing: kr, Tyr, T1, GEO, cache }).winDeg;
  const side = (far, edge) => {
    if (sw(far) <= thrDeg) return edge;
    let a = 1, b = far;
    for (let j = 0; j < DECL.bandBisect; j++) { const m = 0.5 * (a + b); if (sw(m) <= thrDeg) a = m; else b = m; }
    return a;
  };
  return { lo: side(0, 0), hi: side(1 + span, Infinity) };
}

/* ───────── 零試験 ───────── */
/** 統括の数え直し 3 の共通の点検の数(5 桁)と第353便n の表(3〜4 桁) */
export const ANCHOR = Object.freeze({ Lvec: Object.freeze(['0.026257', '0.008317', '0.999621']), eqLDeg: '1.1207', omegaG: '9.09e-16',
  earthDrag: '3.157', earthTwo: '3.63e-4', marsDrag: '3.358', marsTwo: '2.56e-3', fRing: '1.15e-2' });
const e2 = (x) => Number(x).toExponential(2);
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = RC.refAxes(T1, GEO), o = { T1, GEO, cache };
  // ① 第353便n の表(2 つの軸): 地球 3.157° → 3.63e-4°・火星 3.358° → 2.56e-3°(twoRow = 第353便n の twoAxisClosed —— 相対 1e-9 の床)
  const rows = ['Earth', 'Mars'].map((id) => {
    const key = id + '|Sun', rk = DECL.provKeyOf[id], r = twoRow(key, { rateKey: rk, ...o }), st = N.watchState(T1, GEO, key, {}, cache), gr = N.gravRate(rk);
    const cl = N.twoAxisClosed(st, { omG: gr.radS, signG: gr.sign }), dragOnly = W.coneRange(st.Om, st.sHat, st.nRing);
    return { id, r, err: Math.max(rel(r.cone.swingDeg, cl.cone.swingDeg), rel(r.tiltDeg, cl.tiltDeg), rel(r.dragOnly.swingDeg, dragOnly.swingDeg), rel(r.periodYr, cl.periodYr)) };
  });
  // ② c_輪 ÷ c 0・1 の刻みの步 = 第353便n の twoAxisSteps 'fixed'・'co'(誇張した比 W ÷ ω_g = 0.05・5 周)・c_輪 ÷ c 0.5 の閉じた形 = 刻みの步の幅
  const sE = N.watchState(T1, GEO, 'Earth|Sun', {}, cache), omG = sE.W / 0.05, Tg = 5 * 2 * Math.PI / omG / YR;
  const nF = N.twoAxisSteps(sE, { omG, Tyr: Tg, steps: 4000 }), xF = ringSteps(sE, { omG, kRing: 0, Tyr: Tg, steps: 4000 });
  const nC = N.twoAxisSteps(sE, { omG, Tyr: Tg, steps: 4000, nMode: 'co' }), xC = ringSteps(sE, { omG, kRing: 1, Tyr: Tg, steps: 4000 });
  const stepErr = Math.max(nrm(sub(nF.s, xF.s)), nrm(sub(nC.s, xC.s)), nrm(sub(nC.n, xC.n)), Math.abs(nF.epsMaxDeg - xF.epsMaxDeg));
  const h = twoRow('Earth|Sun', { omG, signG: -1, nMode: 'kappa', kRing: 0.5, Tyr: Tg, ...o }), xH = ringSteps(sE, { omG, kRing: 0.5, Tyr: Tg, steps: 8000 });
  const kapErr = Math.abs((xH.epsMaxDeg - xH.epsMinDeg) - h.cone.swingDeg) / h.cone.swingDeg;
  const coSw = twoRow('Earth|Sun', { rateKey: DECL.provKeyOf.Earth, nMode: 'co', ...o }).cone.swingDeg;
  // ③ 軸引きずりだけ: c_輪 ÷ c ≠ 1 で幅は同じ・一周は 1 ÷ abs(1 − c_輪 ÷ c) 倍(閉じた形 = dragRingWin の閉じた形の格子)
  const d0 = twoRow('Earth|Sun', { nMode: 'fixed', ...o }), d5 = twoRow('Earth|Sun', { nMode: 'kappa', kRing: 0.5, ...o });
  const dragErr = Math.max(rel(d5.dragOnly.swingDeg, d0.dragOnly.swingDeg), rel(d5.dragOnly.periodYr, 2 * d0.dragOnly.periodYr));
  const dw = dragRingWin(sE, { kRing: 0.5, Tyr: 1e8, nGrid: 4000 }), dwErr = Math.abs(dw.winDeg - twoRow('Earth|Sun', { nMode: 'kappa', kRing: 0.5, Tyr: 1e8, ...o }).dragWinDeg);
  // ④ 金星: σ_g は ŝ·n̂ < 0 で + (逆行)・潮汐の列の符号と同じ・軸引きずりの歳差とは逆の回り(第353便f の表 3)
  const v = twoRow('Venus|Sun', { rateKey: DECL.provKeyOf.Venus, ...o }), vt = gravOf('Venus|Sun', 'tide', o);
  // ⑤ 潮汐の列 = 第353便f の tideRate(公転の北極 —— 火星・金星・木星・土星)・月の道の平均 = 第353便m の earthGrav
  let tideErr = 0;
  for (const id of ['Mars', 'Venus', 'Jupiter', 'Saturn']) { const a = gravOf(id + '|Sun', 'tide', o), b = Fr.tideRate(id, { pole: 'orb' }, o); tideErr = Math.max(tideErr, rel(a.asYr * a.signG, b.az)); }
  const mAvg = gravOf('Earth|Sun', 'moonAvg', o), mErr = rel(-mAvg.asYr, M.earthGrav({ moon: 'avg' }, o).az);
  // ⑥ 公転面が寄る f_輪 の下限 = 第353便e の fRingAt(0.98)・c_輪 ÷ c 1 で同じ・c_輪 ÷ c が下限より小さいと寄れない
  const rn = ringNeed(1), rnLow = ringNeed(rn.kMin * 0.9), fRingErr = rel(rn.fRing, F.fRingAt(DECL.uFocus));
  // ⑦ 2 つの軸で輪が寄るとき ε は断熱の不変量(誇張: W ÷ ω_g = 0.01・c_輪 ÷ c 1・f_輪 0.2・輪が 1 回 寄る時間)—— ε の変化 ≪ 輪の動き
  const omA = sE.W / 0.01, Tad = 1 / (I.kOf(0.2, 'g2m').k1 * sE.W) / YR, ad = ringSteps(sE, { omG: omA, kRing: 1, fRing: 0.2, Tyr: Tad, steps: 40000 });
  const adRatio = Math.abs(ad.epsDeg - sE.eps0Deg) / Math.abs(ad.ringMoveDeg);
  // 拒否
  const rej = [() => twoRow('Earth|Sun', { nMode: 'x' }), () => twoRow('Earth|Sun', { nMode: 'kappa' }), () => twoRow('Earth|Sun', { f: 2 }), () => gravOf('Earth|Sun', 'x'),
    () => ringSteps(sE, { Tyr: 1, steps: 0 }), () => ringSteps(sE, { Tyr: 1, steps: 1, fRing: 2 }), () => ocOf(sE, { omG: -1 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { L: A.L, eqL: angDeg(A.L, A.eq), omegaG: DECL.omegaG, rows: rows.map((x) => ({ id: x.id, drag: x.r.dragOnly.swingDeg, two: x.r.cone.swingDeg, err: x.err })),
    stepErr, kapErr, coSw, dragErr, dwErr, venusSignG: v.grav.signG, venusTideSign: vt.signG, venusSame: v.sameSense, tideErr, mErr, rn, rnLow, fRingErr, adRatio, adMove: ad.ringMoveDeg, rejects: rej };
}
export function pureGates(S) {
  const [eR, mR] = S.rows;
  return {
    anchor: S.L.map((x) => x.toFixed(6)).join(',') === ANCHOR.Lvec.join(',') && S.eqL.toFixed(4) === ANCHOR.eqLDeg && e2(S.omegaG) === ANCHOR.omegaG,
    table353n: eR.drag.toFixed(3) === ANCHOR.earthDrag && e2(eR.two) === ANCHOR.earthTwo && mR.drag.toFixed(3) === ANCHOR.marsDrag && e2(mR.two) === ANCHOR.marsTwo && eR.err < 1e-9 && mR.err < 1e-9,
    stepsAsN: S.stepErr < 1e-9,
    kappaClosed: S.kapErr < 1e-3 && S.coSw < 1e-9,
    dragOnly: S.dragErr < 1e-9 && S.dwErr < 1e-9,
    venus: S.venusSignG === 1 && S.venusTideSign === 1 && S.venusSame === false,
    sameAsF_M: S.tideErr < 1e-9 && S.mErr < 1e-9,
    ringNeed: S.rn.fRing.toExponential(2) === ANCHOR.fRing && S.fRingErr < 1e-9 && S.rnLow.fRing === null,
    adiabatic: S.adRatio < 0.05 && Math.abs(S.adMove) > 0.1,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}

/* ───────── 表の口 ───────── */
/** 寄る割合 f の上限の最小(第353便e の fMaxAt の受け手 9 つの最小 —— 第353便n の fGridNum の 2 つ目と同じ) */
export function fMinOf(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) { return Math.min(...DECL.keys.map((k) => F.fMaxAt(k, { T1, GEO, cache }).fMax)); }
/** 照らしの步(f 0): 合成の一周の 4 周を 1 周あたり 800 刻み —— 刻みの步の ε の幅 */
function stepSwing(key, r, kRing, T1, GEO, cache) {
  if (!r.grav || !r.periodYr) return null;
  const st = N.watchState(T1, GEO, key, {}, cache), x = ringSteps(st, { omG: r.grav.omG, signG: r.grav.signG, kRing, sense: r.sense, Tyr: 4 * r.periodYr, steps: 3200 });
  return x.epsMaxDeg - x.epsMinDeg;
}
/** 表 1(2 つの軸 —— 天体ごと): 天体 6 × 重力の側の率の列 3(在るものだけ)× 歳差の向き 2。f 0 の閉じた形・照らしの步・f の上限の最小での平均した形の縮み(45 億年) */
export function table1Rows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const fm = fMinOf(T1, GEO, cache), out = [], o = { T1, GEO, cache };
  for (const key of DECL.t1Keys) for (const kind of DECL.kinds) {
    if (!gravOf(key, kind, o)) continue;
    for (const sense of DECL.senses) {
      const r = twoRow(key, { kind, sense, ...o }), a = twoRow(key, { kind, sense, f: fm, ...o }), d = twoRow(key, { sense, f: fm, ...o });
      const sw = stepSwing(key, r, 0, T1, GEO, cache);
      out.push({ key, kind, sense, eps0Deg: r.eps0Deg, gravAsYr: r.grav.asYr, signG: r.grav.signG, gravPeriodYr: r.grav.periodYr, dragSense: r.dragSense, sameSense: r.sameSense,
        ratio: r.ratio, tiltDeg: r.tiltDeg, combPeriodYr: r.periodYr, combSwingDeg: r.cone.swingDeg, combMinDeg: r.cone.minDeg, combMaxDeg: r.cone.maxDeg, dragSwingDeg: r.dragOnly.swingDeg,
        stepSwingDeg: sw, stepErrRel: Math.abs(sw - r.cone.swingDeg) / r.cone.swingDeg, fMin: fm, avgDEpsAge: a.avgDEps, dragDEpsAge: d.avgDEps,
        provisional: r.provisional, provKeys: r.provKeys.slice() });
    }
  }
  return out;
}
/** 表 2(公転面の共回り): 天体 6(潮汐の列)× c_輪 ÷ c(主の格子 + 共回りの近く)。2 つの軸の ε の幅(閉じた形・照らしの步)・軸引きずりだけの幅と一周・年齢の内の変化・公転面が寄る f_輪 の下限と、そのときの軸引きずりだけの変化と輪の動き */
export function table2Rows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [], o = { T1, GEO, cache }, age = DECL.ageYr;
  for (const key of DECL.t1Keys) {
    const st = N.watchState(T1, GEO, key, {}, cache);
    for (const kr of DECL.kappas.concat(DECL.kappasNear)) {
      const main = DECL.kappas.includes(kr), r = twoRow(key, { kind: 'tide', nMode: 'kappa', kRing: kr, Tyr: age, ...o });
      const rn = ringNeed(kr), dr = rn.fRing === null ? null : dragRingWin(st, { kRing: kr, fRing: rn.fRing, Tyr: age });
      out.push({ key, kRing: kr, main, twoSwingDeg: r.cone.swingDeg, twoWinAgeDeg: r.winDeg, stepSwingDeg: main ? stepSwing(key, r, kr, T1, GEO, cache) : null,
        dragSwingDeg: r.dragOnly.swingDeg, dragPeriodYr: r.dragOnly.periodYr, dragWinAgeDeg: r.dragWinDeg, fRing: rn.fRing, ringDragWinDeg: dr ? dr.winDeg : null, ringMoveDeg: dr ? dr.ringMoveDeg : null });
    }
  }
  return out;
}
/** 表 2b(c_輪 ÷ c の帯): 天体 6 × 見ている時間 3 × 列 2(軸引きずりだけ・2 つの軸〔潮汐の列〕)—— ε の変化が 0.1° 以下の c_輪 ÷ c の範囲と、公転面が寄る下限との重なり */
export function table2bRows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [], kMin = ringNeed(1).kMin;
  for (const key of DECL.t1Keys) for (const Tyr of DECL.windowsYr) for (const kind of [null, 'tide']) {
    const b = kappaBand(key, { kind, Tyr, T1, GEO, cache });
    const lo = Math.max(b.lo, kMin), open = !fin(b.hi), both = lo <= b.hi ? { lo, hi: open ? null : b.hi, hiOpen: open } : null;
    out.push({ key, Tyr, kind: kind || 'drag', lo: b.lo, hi: open ? null : b.hi, hiOpen: open, kMin, both });
  }
  return out;
}
/** 表 3(見ている時間): 受け手 9 × 見ている時間 3 —— 軸引きずりだけ/2 つの軸(潮汐の列・地球と火星と金星は仮の値の列も)/共回り(c_輪 ÷ c 1)の ε の変化(f 0・(g2−)) */
export function table3Rows(T1 = E.t1Table(), GEO = E.geometry(), cache = {}) {
  const out = [], o = { T1, GEO, cache };
  for (const key of DECL.keys) for (const Tyr of DECL.windowsYr) {
    const d = twoRow(key, { Tyr, ...o }), hasT = !!gravOf(key, 'tide', o), hasP = !!gravOf(key, 'prov', o);
    const t = hasT ? twoRow(key, { kind: 'tide', Tyr, ...o }) : null, p = hasP ? twoRow(key, { kind: 'prov', Tyr, ...o }) : null;
    const c = twoRow(key, { kind: hasT ? 'tide' : null, nMode: 'co', Tyr, ...o });
    out.push({ key, Tyr, eps0Deg: d.eps0Deg, dragDeg: d.winDeg, twoDeg: t ? t.winDeg : null, twoProvDeg: p ? p.winDeg : null, coDeg: c.winDeg, overThr: d.winDeg >= DECL.thrDeg,
      provisional: !!p, provKeys: p ? p.provKeys.slice() : [] });
  }
  return out;
}

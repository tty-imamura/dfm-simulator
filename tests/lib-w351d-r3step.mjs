// 第351便d(原仮定者の回答(2026-11-24 —— 第147報)「AN1008: R3で進める」・統括の検証項目 R430):
//   **(R3) の 2 経路の步 —— 経路 ①(寄る —— 起こす/倒す: dŝ/dt = (ω_T/ω_L) k₁ Ω⊥)・経路 ②(歳差: dŝ/dt = (ω_T/ω_L) k₂ (Ω × ŝ))・比率のノブ f と置き方 (N1)(N2)(N3)・
//   閉じた形・90° を越えた後の読み (α)(β)(比べる列 (γ))・合成の向き eqAxis —— 診断だけ**
//   (器 tests/exp-w351d-r3step.mjs と QA behavior.r3step351d・docs.r3step351d が読む —— 第 2 段の枝もこの lib を import する。html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   **エネルギー・熱・自転の増し分は持たない**(本便の第 2 段の枝 g)。場の成分((M)(S)(MS))は本便の枝 c。
//   既存の lib は呼ぶだけ(本文は変えない): 第350便c(stepGyro・closedForm・rodrigues・omAt・commonCheck —— f 0 が (g2+) と同じ軌跡になることを零試験で見る)・
//   第350便e(composeBal —— 合成の向きと「向きが決まらない」の閾の照合)。
//
// ■ 語(本便の共通ブリーフの語 —— 第 1 段・第 2 段で同じ):
//   ŝ = 受け手の自転軸の単位ベクトル(逆行の天体は ŝ の向きに入れる —— 符号を 2 度掛けない)。Ω = 符号つきの軸引きずり回転のベクトル。Ω∥ = ŝ·Ω・Ω⊥ = Ω − Ω∥ ŝ。
//   ω_T = トルクの式の自転速度((S1) —— 第350便c)・ω_L = 角運動量の自転速度。ratio = ω_T ÷ ω_L(既定 1)。
//   経路 ①: dŝ/dt = ratio k₁ Ω⊥(符号つきの Ω の向きへ寄る)/経路 ②: dŝ/dt = ratio k₂ (Ω × ŝ)(第350便c の (g2+) の向き)。
//   姿勢の角速度 Θ = ŝ × dŝ/dt = ratio (k₂ Ω⊥ + k₁ ŝ × Ω⊥)(第350便c の (g3) の Θ の k_g = k₂・k_d = k₁ の形 —— 回転〔Rodrigues〕で更新して ŝ の長さを保つ)。
//   比率のノブ f ∈ [0, 1]: (N1) (k₂, k₁) = (1 − f, f) ÷ hypot(1 − f, f)・(N2) (k₂, k₁) = (1 − f, f)・(N3) k₁・k₂ を独立に。**f の既定の値は決めない。**
// ■ 90° を越えた後の読み(θ = ŝ と Ω のなす角・θ_line = min(θ, 180° − θ) = 回転軸の線に対する傾き —— 1 つに決めない):
//   (α) 符号つきの Ω へ寄り続ける(θ > 90° では θ_line は 90° まで増え、その後は減って Ω へそろう)/
//   (β) dθ_line/dt = −σ k₁ abs(Ω⊥)・σ = sign(ŝ·Ω)(回転軸の線に対する傾きだけを見る —— θ_line は 90° を越えない。90° に着いた点で σ = 0 となり率 0 —— そこに留まる)/
//   (γ)(比べる列 —— 原文の「倒す」に当たらない): 符号を掛けたベクトルの形 dŝ/dt = σ k₁ Ω⊥(線の近い方の向きへそろう)。
// ■ 言わないこと: (R3) で釣り合いが導けた・傾きが決まった、とは書かない。f の値を選ばない。90° を越えた後の読みを 1 つに決めない。
import * as GS from './lib-w350c-gyrostep.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';

export const LIB_VERSION = 'w351d-r3step-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  norms: Object.freeze(['N1', 'N2', 'N3']),
  fGrid: Object.freeze([0, 0.25, 0.5, 0.75, 1]),
  /** 表で並べる f(既定は決めない —— 0・0.5・1) */
  fShow: Object.freeze([0, 0.5, 1]),
  reads: Object.freeze(['alpha', 'beta', 'gamma']),
  integ: Object.freeze(['rot', 'mid']),
  /** 無次元の核(第350便c と同じ: abs(Ω) 1・θ₀ 40°・刻み 0.05・t 10) */
  theta0Deg: 40, T: 10, dt0: 0.05, dtFrac: Object.freeze([1, 0.5, 0.25, 0.125]),
  /** 90° を越えた後の読みの初期の角(177° = 金星の型) */
  theta0Over: Object.freeze([30, 89, 91, 150, 177]), Tover: 20,
  /** 2 つの源の釣り合い(無次元): なす角・大きさの比(B ÷ A) */
  pairAngles: Object.freeze([60, 120, 180]), pairRatios: Object.freeze([0.1, 1, 10]),
  /** 合成の向きが決まらない閾(第350便e の composeBal と同じ 1e-6 × Σ abs) */
  degenerate: 1e-6,
  /** ω_T ÷ ω_L の例(第350便c の (S2) の自転速度の目安 √(ω² + abs(Θ)²) ÷ ω) */
  wI0: Object.freeze([1, 10]),
  /** 地球の型の例(自転の角速度 = 恒星日 86164.1 s・軸の動きの大きさ = 本便の統括の数え直しの (MS) の大きさ 5.0576e-2″/年) */
  earthEx: Object.freeze({ siderealDayS: 86164.1, thetaArcsecPerYr: 5.0576e-2 }),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
export const floor0 = (v, s) => (Math.abs(v) <= 1e-12 * s ? 0 : v);
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });

/* ───────── 係数 ───────── */
/** 比率のノブ f と置き方から (k₁, k₂) = { kTilt, kPrec }。(N3) は o.kTilt・o.kPrec を独立に(省けば (N2) と同じ値) */
export function r3Coeffs(f, norm = 'N1', o = {}) {
  if (!DECL.norms.includes(norm)) throw new RangeError('r3Coeffs: 置き方は ' + DECL.norms.join('・'));
  if (norm === 'N3') {
    const kTilt = o.kTilt === undefined ? f : o.kTilt, kPrec = o.kPrec === undefined ? 1 - f : o.kPrec;
    if (!(fin(kTilt) && fin(kPrec))) throw new RangeError('r3Coeffs: (N3) は kTilt・kPrec を有限の数で');
    return { kTilt, kPrec, norm, f: fin(f) ? f : null };
  }
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('r3Coeffs: f は 0 から 1');
  if (norm === 'N2') return { kTilt: f, kPrec: 1 - f, norm, f };
  const h = Math.hypot(1 - f, f);
  return { kTilt: f / h, kPrec: (1 - f) / h, norm, f };
}

/* ───────── 1 点の率 ───────── */
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
/**
 * ŝ と Ω から 2 経路の率。read は 90° を越えた後の読み(alpha・beta・gamma —— 瞬時の値は beta = alpha、gamma だけ θ > 90° で符号が逆)。
 * 返す: perp = Ω⊥・tilt = 経路 ① の dŝ/dt・prec = 経路 ② の dŝ/dt・ds = 和・Th = 姿勢の角速度(ŝ × ds)・cos = ŝ·Ω̂・thetaDeg・
 *   dThetaDt = dθ/dt(Ω 一定 —— θ = ŝ と Ω のなす角)・thetaLineDeg・dThetaLineDt(回転軸の線に対する傾きの率)
 */
export function r3Rate(sHat, Om, { kTilt = 1, kPrec = 0, ratio = 1, read = 'alpha', mut = null } = {}) {
  if (!(isVec(sHat) && nrm(sHat) > 0 && isVec(Om) && fin(kTilt) && fin(kPrec) && fin(ratio))) throw new RangeError('r3Rate: ŝ・Ω・kTilt・kPrec・ratio');
  if (!DECL.reads.includes(read)) throw new RangeError('r3Rate: 読みは ' + DECL.reads.join('・'));
  const s = unit(sHat), par = dot(s, Om), perp = sub(Om, scl(s, par)), om = nrm(Om), sg = sgn(par);
  // 読み: alpha は符号つきの Ω へ(σ を掛けない)・beta は瞬時には alpha と同じ(90° の扱いは r3Step)・gamma は σ を掛ける
  const kT = read === 'gamma' ? kTilt * sg : kTilt;
  const tiltK = ratio * kT * (mut === 'doubleSign' ? sg : 1);
  const tilt = scl(perp, tiltK);
  const prec = mut === 'wrongCross' ? scl(crs(s, Om), ratio * kPrec) : scl(crs(Om, s), ratio * kPrec);
  const ds = add(tilt, prec), Th = add(scl(perp, ratio * kPrec * (mut === 'wrongCross' ? -1 : 1)), scl(crs(s, perp), tiltK));
  const pm = nrm(perp), cos = om > 0 ? par / om : null, thetaDeg = om > 0 ? angDeg(s, Om) : null;
  // dθ/dt = −(ds·Ω̂) ÷ sin θ(Ω 一定)= −tiltK abs(Ω⊥)(経路 ② は θ を保つ)
  const dThetaDt = om > 0 && pm > 0 ? -dot(ds, Om) / om / (pm / om) : 0;
  const thetaLineDeg = thetaDeg === null ? null : Math.min(thetaDeg, 180 - thetaDeg), dThetaLineDt = sg >= 0 ? dThetaDt : -dThetaDt;
  return { perp, tilt, prec, ds, Th, cos, thetaDeg, dThetaDt, thetaLineDeg, dThetaLineDt, par, sigma: sg };
}

/** 場の入力: [3](一定)・関数 t → [3]・第350便c の場の例(omAt) */
export function omOf(om) {
  if (isVec(om)) return () => om.slice();
  if (typeof om === 'function') return om;
  if (om && typeof om === 'object' && om.kind) return (t) => GS.omAt(om, t);
  throw new RangeError('r3Step: om は [3]・関数・場の例');
}

/* ───────── 1 本の走り ───────── */
/**
 * o: { s0, om, T, dt, kTilt, kPrec, ratio = 1, integ: rot|mid, read: alpha|beta|gamma, keep, mut }
 * 姿勢は回転で更新(Rodrigues —— 第350便c の rodrigues)。mid は Θ の向きを半ステップで作り直す(第350便c の中点と同じ形)。
 * (β) は θ_line を状態として見る: θ > 90° から 90° を越える步は 90° に止め(ŝ を Ω に直交する面へ)、そこで σ = 0(経路 ① の率 0)。
 * mut(変異 —— 零試験で落ちることを見る): 'noUnit'(回転でなく足し算)・'wrongCross'(経路 ② を ŝ × Ω に)・'doubleSign'(σ をもう 1 度掛ける)
 */
export function r3Step(o = {}) {
  const { s0 = [Math.sin(DECL.theta0Deg * D2R), 0, Math.cos(DECL.theta0Deg * D2R)], om = [0, 0, 1], T = DECL.T, dt = DECL.dt0, kTilt = 1, kPrec = 0, ratio = 1, integ = 'rot', read = 'alpha', keep = 0, mut = null } = o;
  if (!DECL.integ.includes(integ)) throw new RangeError('r3Step: 積分は rot・mid');
  if (!DECL.reads.includes(read)) throw new RangeError('r3Step: 読みは ' + DECL.reads.join('・'));
  if (!(isVec(s0) && nrm(s0) > 0 && fin(T) && T > 0 && fin(dt) && dt > 0 && fin(kTilt) && fin(kPrec) && fin(ratio))) throw new RangeError('r3Step: s0・T・dt・kTilt・kPrec・ratio');
  const OmF = omOf(om), steps = Math.round(T / dt), opt = { kTilt, kPrec, ratio, read, mut };
  let s = unit(s0), lenErr = 0, stuck = false, crossT = null;
  const Om0 = OmF(0), oh0 = unit(Om0), [px, py] = nrm(Om0) > 0 ? perpPair(oh0) : [[1, 0, 0], [0, 1, 0]];
  let az = Math.atan2(dot(s, py), dot(s, px)), turns = 0, thMaxLine = nrm(Om0) > 0 ? Math.min(angDeg(s, Om0), 180 - angDeg(s, Om0)) : null;
  const th0 = nrm(Om0) > 0 ? angDeg(s, Om0) : null, trace = [];
  const ThOf = (sv, Omv) => {
    if (read === 'beta' && stuck) return scl(sub(Omv, scl(sv, dot(sv, Omv))), ratio * kPrec);   // 90° に留まる: 経路 ② だけ(σ = 0)
    return r3Rate(sv, Omv, opt).Th;
  };
  for (let n = 0; n < steps; n++) {
    const t = n * dt, Om = OmF(t);
    let Th = ThOf(s, Om);
    if (integ === 'mid') { const sm = rodrigues(s, Th, nrm(Th) * dt / 2), Omm = OmF(t + dt / 2); Th = ThOf(sm, Omm); }
    let s1 = mut === 'noUnit' ? add(s, scl(crs(Th, s), dt)) : rodrigues(s, Th, nrm(Th) * dt);
    const Om1 = OmF(t + dt);
    if (read === 'beta' && !stuck && dot(s, Om) < 0 && dot(s1, Om1) >= 0) {   // θ > 90° から 90° を越える步: 90° に止める
      s1 = unit(sub(s1, scl(unit(Om1), dot(s1, unit(Om1))))); stuck = true; crossT = t + dt;
    }
    if (read !== 'beta' && crossT === null && th0 !== null && th0 > 90 && dot(s1, Om1) >= 0) crossT = t + dt;
    s = s1; lenErr = Math.max(lenErr, Math.abs(nrm(s) - 1));
    const a = Math.atan2(dot(s, py), dot(s, px)); let da = a - az; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; turns += da; az = a;
    if (nrm(Om1) > 0) { const th = angDeg(s, Om1); thMaxLine = Math.max(thMaxLine, Math.min(th, 180 - th)); }
    if (keep > 0 && (n + 1) % Math.max(1, Math.round(steps / keep)) === 0) trace.push({ t: t + dt, thDeg: nrm(Om1) > 0 ? angDeg(s, Om1) : null });
  }
  const OmE = OmF(T), thE = nrm(OmE) > 0 ? angDeg(s, OmE) : null;
  return { read, integ, dt, steps, sEnd: s, th0Deg: th0, thEndDeg: thE, thLineEndDeg: thE === null ? null : Math.min(thE, 180 - thE), thLineMaxDeg: thMaxLine,
    precRate: turns / T, turns, lenErr, stuck, crossT, trace };
}
/** Rodrigues の回転(第350便c の lib の関数をそのまま使う) */
export const rodrigues = GS.rodrigues;

/* ───────── 閉じた形 ───────── */
/**
 * 一定の Ω・ratio 一定: 経路 ① は tan(θ/2) = tan(θ₀/2) e^(−k₁ ratio abs(Ω) t)((α) —— 全ての θ₀)・歳差の率 k₂ ratio abs(Ω)(Ω のまわり —— 正 = Ω × ŝ の向き)。
 * (β): θ₀ ≤ 90° は (α) と同じ・θ₀ > 90° は (α) の式で 90° に着く時刻 t* = ln(tan(θ₀/2)) ÷ (k₁ ratio abs(Ω)) の後は 90° に留まる。
 * (γ): θ₀ > 90° は tan((180° − θ)/2) = tan((180° − θ₀)/2) e^(−k₁ ratio abs(Ω) t)(−Ω へ)。θ₀ = 90° はどの読みも留まる。
 */
export function closedR3({ th0Deg = DECL.theta0Deg, Om = 1, t = DECL.T, kTilt = 1, kPrec = 0, ratio = 1, read = 'alpha' } = {}) {
  if (!(fin(th0Deg) && th0Deg > 0 && th0Deg < 180 && fin(Om) && Om >= 0 && fin(t) && t >= 0 && fin(kTilt) && fin(kPrec) && fin(ratio))) throw new RangeError('closedR3: θ₀ は 0 と 180 の間');
  if (!DECL.reads.includes(read)) throw new RangeError('closedR3: 読みは ' + DECL.reads.join('・'));
  const k = kTilt * ratio * Om, th0 = th0Deg * D2R, rate = kPrec * ratio * Om;
  const alpha = (tt) => 2 * Math.atan(Math.tan(th0 / 2) * Math.exp(-k * tt)) / D2R;
  let thDeg, tStar = null;
  if (th0Deg === 90 && read !== 'alpha') thDeg = 90;
  else if (th0Deg <= 90 || read === 'alpha') thDeg = alpha(t);
  else if (read === 'beta') { tStar = k > 0 ? Math.log(Math.tan(th0 / 2)) / k : null; thDeg = tStar !== null && t >= tStar ? 90 : alpha(t); }
  else thDeg = 180 - 2 * Math.atan(Math.tan((Math.PI - th0) / 2) * Math.exp(-k * t)) / D2R;
  return { thDeg, thLineDeg: Math.min(thDeg, 180 - thDeg), rate, periodT: rate !== 0 ? 2 * Math.PI / Math.abs(rate) : null, tStar };
}

/* ───────── 合成の向き ───────── */
/** 項の和の向き(ほぼ 0 —— abs(和) < 1e-6 × Σ abs —— なら null)。第350便e の composeBal と同じ閾 */
export function eqAxis(terms) {
  if (!(Array.isArray(terms) && terms.length >= 1 && terms.every(isVec))) throw new RangeError('eqAxis: 項');
  let v = [0, 0, 0], sAbs = 0;
  for (const t of terms) { v = add(v, t); sAbs += nrm(t); }
  const m = nrm(v);
  return sAbs > 0 && m >= DECL.degenerate * sAbs ? scl(v, 1 / m) : null;
}

/* ───────── 起こす率(本便の共通の定義)───────── */
/** 公転の北極 n を基準に ε = acos(ŝ·n)。起こす率 = −dε/dt = (dŝ/dt · n) ÷ sin ε(正 = 傾きが減る) */
export function raiseRate(sHat, nHat, dsdt) {
  const s = unit(sHat), n = unit(nHat), c = dot(s, n), se = Math.sqrt(Math.max(0, 1 - c * c));
  return se > 0 ? dot(dsdt, n) / se : null;
}

/* ───────── ω_T ÷ ω_L の目安 ───────── */
/** (S2) の自転速度の目安 √(ω² + abs(Θ)²) ÷ ω − 1 を打ち消しなしで(x² ÷ (√(1 + x²) + 1)・x = abs(Θ) ÷ ω) */
export const s2RatioMinus1 = (w, th) => { const x = th / w; return x * x / (Math.sqrt(1 + x * x) + 1); };

/* ───────── 零試験・変異 ───────── */
export function pureScenes() {
  const cc = GS.commonCheck();
  const s40 = [Math.sin(40 * D2R), 0, Math.cos(40 * D2R)], Oz = [0, 0, 1];
  // ① f 0 は第350便c の (g2+) と同じ軌跡(Ω 一定・Ω の向きが回る —— 回転 1 回・中点)
  const f0 = [];
  for (const ex of GS.DECL.examples) for (const integ of DECL.integ) {
    const g = GS.stepGyro({ read: 'g2p', wRead: 'S1', ex, integ, wI0: 10 }), c0 = r3Coeffs(0, 'N1'), m = r3Step({ om: ex, integ, ...c0 });
    f0.push(angDeg(g.sEnd, m.sEnd));
  }
  // ② f 1 は歳差なしで角だけ動く・第350便c の (g3) k_g 0・k_d 1 と同じ軌跡/(N3) (k₁ 0.1・k₂ 1) は (g3) k_g 1・k_d 0.1 と同じ軌跡
  const c1 = r3Coeffs(1, 'N1'), f1 = r3Step({ ...c1, T: 10 }), g3a = GS.stepGyro({ read: 'g3a', wRead: 'S1', integ: 'mid', wI0: 10 }), f1m = r3Step({ ...c1, integ: 'mid' });
  const n3 = r3Coeffs(null, 'N3', { kTilt: 0.1, kPrec: 1 }), g3b = GS.stepGyro({ read: 'g3b', wRead: 'S1', integ: 'mid', wI0: 10 }), n3m = r3Step({ ...n3, integ: 'mid' });
  // f 1 の歳差: 寄る道は Ω を含む面の上(方位が変わらない)
  const f1prec = Math.abs(f1.turns);
  // ③ 閉じた形と刻みの次数((N1) f 0.5)
  const ch = r3Coeffs(0.5, 'N1'), cf = closedR3({ ...ch });
  const errs = DECL.integ.map((integ) => DECL.dtFrac.map((k) => { const R = r3Step({ ...ch, integ, dt: DECL.dt0 * k }); return Math.max(Math.abs(R.thEndDeg - cf.thDeg) * D2R, Math.abs(R.precRate - cf.rate)); }));
  const ords = errs.map((e) => e.slice(1).map((x, j) => Math.log2(e[j] / x)));
  const fine = r3Step({ ...ch, integ: 'mid', dt: 0.005 }), cfErr = Math.abs(fine.thEndDeg - cf.thDeg);
  // ④ ŝ ∥ Ω・反平行で両方の率 0
  const pa = r3Rate(Oz, Oz, { kTilt: 1, kPrec: 1 }), an = r3Rate([0, 0, -1], Oz, { kTilt: 1, kPrec: 1 }), par0 = Math.max(nrm(pa.ds), nrm(an.ds), nrm(pa.Th), nrm(an.Th));
  // ⑤ Ω の反転で「寄る先」が反転(経路 ① の率の向きが反転・行き先が −Ω)
  const rp = r3Rate(s40, Oz, { kTilt: 1, kPrec: 0 }), rm = r3Rate(s40, [0, 0, -1], { kTilt: 1, kPrec: 0 }), flip = nrm(add(rp.tilt, rm.tilt));
  const toNeg = r3Step({ om: [0, 0, -1], kTilt: 1, kPrec: 0, T: 30, integ: 'mid' }).thEndDeg;   // −Ω とのなす角 → 0
  // ⑥ 自転の反転は ŝ の向きに入れる(Ω⊥ は ŝ の向きに依らない・経路 ② は反転)—— 変異「σ をもう 1 度掛ける」で崩れる
  const sr = r3Rate(scl(s40, -1), Oz, { kTilt: 1, kPrec: 1 }), r1 = r3Rate(s40, Oz, { kTilt: 1, kPrec: 1 });
  const spinRev = Math.max(nrm(sub(sr.tilt, r1.tilt)), nrm(add(sr.prec, r1.prec))), dbl = nrm(sub(r3Rate(scl(s40, -1), Oz, { kTilt: 1, kPrec: 1, mut: 'doubleSign' }).tilt, r1.tilt));
  // ⑦ (N1) は直交する 2 成分の合成の大きさが f に依らない(= abs(Ω⊥))・(N2) は f に依る
  const magN1 = DECL.fGrid.map((f) => nrm(r3Rate(s40, Oz, r3Coeffs(f, 'N1')).ds)), magN2 = DECL.fGrid.map((f) => nrm(r3Rate(s40, Oz, r3Coeffs(f, 'N2')).ds));
  const orth = Math.abs(dot(r1.tilt, r1.prec));
  // 読み: (β) は 150° から 90° に留まる・(γ) は −Ω へ・(α) は Ω へ
  const s150 = [Math.sin(150 * D2R), 0, Math.cos(150 * D2R)];
  const ov = DECL.reads.map((read) => r3Step({ s0: s150, read, kTilt: 1, kPrec: 0, T: DECL.Tover, integ: 'mid' }).thEndDeg);
  // 合成の向き: 第350便e の composeBal と同じ向き・同じ閾
  const tA = [[1, 0, 0], [0, 2, 0.5]], tD = [[1, 0, 0], [-1, 1e-7, 0]], bA = BG.composeBal(tA), bD = BG.composeBal(tD), eA = eqAxis(tA), eD = eqAxis(tD);
  const eqOk = eA !== null && nrm(sub(eA, bA.e)) < 1e-15 && eD === null && bD.undetermined === true;
  // 長い走りで ŝ の長さ
  const len = r3Step({ ...r3Coeffs(0.5, 'N1'), T: 100, dt: 0.01, om: GS.DECL.examples[1] }).lenErr;
  // 起こす率の定義(n = ẑ・ε 23.44°・dŝ/dt = Ω⊥ で Ω = n のとき起こす率 = sin ε)
  const eps = 23.44 * D2R, sE = [Math.sin(eps), 0, Math.cos(eps)], rr = raiseRate(sE, Oz, r3Rate(sE, Oz, { kTilt: 1 }).tilt);
  // 変異
  const mU = r3Step({ ...ch, mut: 'noUnit' }).lenErr, gP = GS.stepGyro({ read: 'g2p', wRead: 'S1', integ: 'rot', wI0: 10 }), mX = r3Step({ ...r3Coeffs(0, 'N1'), mut: 'wrongCross' });
  const muts = { noUnit: mU > 1e-6, wrongCross: angDeg(gP.sEnd, mX.sEnd) > 1, doubleSign: dbl > 0.1 };
  // ω_T ÷ ω_L の目安(打ち消しなし)
  const s2m = s2RatioMinus1(10, 1), s2d = Math.hypot(10, 1) / 10 - 1;
  const rej = [() => r3Coeffs(1.5, 'N1'), () => r3Coeffs(0.5, 'N4'), () => r3Rate([0, 0, 0], Oz), () => r3Step({ integ: 'rk' }), () => r3Step({ read: 'delta' }), () => closedR3({ th0Deg: 180 }), () => eqAxis([]), () => omOf('x')]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { cc, f0, f1: { th: f1.thEndDeg, prec: f1prec, vsG3a: angDeg(g3a.sEnd, f1m.sEnd) }, n3: { vsG3b: angDeg(g3b.sEnd, n3m.sEnd) }, ords, cfErr, par0, flip, toNeg, spinRev, magN1, magN2, orth, ov, eqOk, len, rr, rrWant: Math.sin(eps), muts, s2: { m: s2m, d: s2d }, rejects: rej };
}
export function pureGates(S) {
  const W = GS.DECL.check.want, c = S.cc, near = (a, b) => Math.abs(a - b) < 5e-9;
  return {
    commonNums: near(c.diamXz, W.diamX) && near(c.sixZ, W.six) && near(c.curlWz, W.curlW) && Math.abs(c.revXz + c.diamXz) < 1e-12,
    f0isG2p: S.f0.length === 4 && S.f0.every((x) => x < 1e-12),
    f1noPrec: S.f1.prec < 1e-12 && S.f1.th < 0.01 && S.f1.vsG3a < 1e-12 && S.n3.vsG3b < 1e-12,
    closedOrder: S.cfErr < 1e-4 && S.ords[0].every((x) => x > 0.9 && x < 1.1) && S.ords[1].every((x) => x > 1.8 && x < 2.2),
    parallelZero: S.par0 === 0,
    omFlip: S.flip < 1e-15 && S.toNeg < 0.01,
    spinInS: S.spinRev < 1e-15,
    n1Mag: S.magN1.every((x) => Math.abs(x - S.magN1[0]) < 1e-12) && Math.abs(S.magN2[2] / S.magN2[0] - Math.SQRT1_2) < 1e-12 && S.orth < 1e-15,
    overReads: S.ov[0] < 0.01 && Math.abs(S.ov[1] - 90) < 1e-9 && S.ov[2] > 179.99,
    eqAxis: S.eqOk,
    unitLen: S.len < 1e-12 && Math.abs(S.rr - S.rrWant) < 1e-12,
    mutants: S.muts.noUnit && S.muts.wrongCross && S.muts.doubleSign && Math.abs(S.s2.m - S.s2.d) < 1e-12,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}

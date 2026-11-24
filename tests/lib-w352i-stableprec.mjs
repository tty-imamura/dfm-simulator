// 第352便i(原仮定者の回答(2026-11-24 —— 第148報)「AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む」・統括の検証項目 R446):
//   **「安定した歳差運動」の判定の量 —— 半頂角の 1 周あたりの変化・位相の 1 周あたりの進み・乱したときの戻りの率(正 = 戻る・0 = 中立・負 = 離れる)。
//   一定の合成の軸の閉じた形と、合成の軸が軸 n̂ のまわりを率 g・傾き I で一様に回るときの、一緒に回る枠での釣り合いの向き(閉じた形 —— (g2+) と (g2−) で別の式)と戻りの率 —— 診断だけ**
//   (器 tests/exp-w352i-stableprec.mjs と QA behavior.stableprec352i・docs.stableprec352i が読む —— 後のラウンドの枝もこの lib を import してよい。
//   html を読まない・ファイルを読まない・状態を持たない)。アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便d(r3Step・closedR3・r3Coeffs・rodrigues・vec)・第351便g(exactStep —— 閉じた形の步)・
//   第352便d(rowOf・uVenus・precDs・poleRates)・第352便c(refAxes)・第347便e(t1Table・geometry)・第318便d(LIT.sunAge —— 文献の値)。
//
// ■ 語(本便の共通の語): ŝ = 受け手の自転軸・Ω = 合成の軸引きずり回転(rad/s)・W = abs(Ω)・Ω̂ = Ω ÷ W・θ = ŝ と Ω̂ のなす角(半頂角)。
//   流れ: dŝ/dt = k₁ W (Ω̂ − (ŝ·Ω̂) ŝ) + σ k₂ W (Ω̂ × ŝ)(経路 ① + 経路 ② —— σ = +1 が (g2+)・−1 が (g2−)・(k₂, k₁) は第351便d の r3Coeffs の (N1))。
//   **1 周** = 合成の回転の 1 周 T_W = 2π ÷ W(f 1 でも定まる物差し —— 歳差の 1 周は T_W ÷ k₂)。
//   **判定の量**(一定の Ω̂): 半頂角の 1 周あたりの変化 = θ(T_W) − θ(tan(θ(T_W)/2) = tan(θ/2) e^(−2π k₁))・位相の 1 周あたりの進み = 360° σ k₂・
//   **戻りの率** = 半頂角を δ だけ変えた初期値との差 dδ/dt = −k₁ W cos θ δ から λ = k₁ W cos θ(正 = 戻る・0 = 中立・負 = 離れる)・
//   1 周あたりの戻り = −ln(sin θ(T_W) ÷ sin θ)(乱れの比の対数 —— 小さい θ では 2π k₁)。
//   **合成の軸が回るとき**(Ω̂(t) が n̂ のまわりを率 g で回る・Ω̂ と n̂ の角 I): 一緒に回る枠で dŝ/dt|回る = b (Ω̂ − (ŝ·Ω̂) ŝ) + a × ŝ・
//   a = σ k₂ W Ω̂ − g n̂・b = k₁ W。止まる向き(閉じた形): x = λ² が x² + (a² − b²) x − b² (a·Ω̂)² = 0 の正の根・
//   ŝ* = b [λ² Ω̂ + λ (a × Ω̂) + (a·Ω̂) a] ÷ (λ (λ² + a²))・λ = b (ŝ*·Ω̂)(λ > 0 の枝 = 引き込む点・λ < 0 の枝 = 離れる点)。b 0 なら ŝ* = ± â(中立 —— 回り続ける)。
//   (g2+) は a = +k₂ W Ω̂ − g n̂・(g2−) は a = −k₂ W Ω̂ − g n̂(別の式)。止まる点のまわりの戻りの率 = −(線形化の固有値の実部の大きい方)・跡 = −2λ(閉じた形)。
// ■ 言わないこと: 安定した歳差が在る/無い・観測の傾きの答えとは書かない(この流れ・この読み・この引数では、の表)。f の値・読み A・B・C を選ばない。
import * as R3 from './lib-w351d-r3step.mjs';
import * as RG from './lib-w351g-r3energy.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as C from './lib-w352c-refaxis.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as DR from './lib-w318d-dragest.mjs';

export const LIB_VERSION = 'w352i-stableprec-lib-1';
/** 呼ぶ lib の名前空間(器が同じ口を使う) */
export { R3, D };
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const YR = 365.25 * 86400;
export const ASYR = D.ASYR;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  senses: D.DECL.senses,
  fShow: Object.freeze([0, 0.5, 1]),
  norm: 'N1',
  /** 背景の向きの列: (N+) は基準軸 L(角運動量の重み)と eq(等重み)の 2 つ・(G−) は軸に依らない */
  bgCols: Object.freeze([Object.freeze(['Np', 'L']), Object.freeze(['Np', 'eq']), Object.freeze(['Gm', null])]),
  /** 背景の大きさの列: (uV) 金星で (S) と大きさが同じ・(u1) 倍率 1 */
  uCols: Object.freeze(['uV', 'u1']),
  recv: Object.freeze([...D.DECL.planets, 'Sun']),
  /** 比 ρ = g ÷ (k₂ W) の格子(f 1 では k₂ 0 —— ρ = g ÷ W と読む) */
  rhoAbs: Object.freeze([1e-3, 1e-2, 1e-1, 1, 1e1, 1e2, 1e3]),
  IDeg: Object.freeze([1, 5.230, 7.252, 10, 23.4, 45]),
  /** 逆に解く傾き I の格子・ρ の走査(片側 1e-3〜1e3 を 1 桁 40 点) */
  invIDeg: Object.freeze([1, 5.230, 7.252, 10, 30, 60]), invPerDecade: 40,
  /** 逆に解く目標(リポジトリの geometry の自転軸と公転の法線の角 —— 地球・火星) */
  invBodies: Object.freeze(['Earth', 'Mars']),
  /** 候補の表の受け手(順行 2・逆行と 90° を越える 2) */
  candBodies: Object.freeze(['Earth', 'Mars', 'Venus', 'Uranus']),
  candRho: Object.freeze([-1e2, -1, -1e-2, 1e-2, 1, 1e2]),
  /** 太陽系の年齢(第318便d の LIT.sunAge —— 文献の値・未照合) */
  sunAgeYr: DR.LIT.sunAge.value,
  /** 読み C の物差し: 太陽系の年齢の間の半頂角の変化がこの割合より小さい */
  readCFrac: 0.01,
  /** 打ち消しの床: 尺度の 1e-12 倍以下を 0 と書く */
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 係数 ───────── */
/** f と向きの読みから { k1, k2, k2s }(k2s = σ k₂) */
export function kOf(f, sense) {
  if (!DECL.senses.includes(sense)) throw new RangeError('kOf: 向きの読みは g2p・g2m');
  const c = R3.r3Coeffs(f, DECL.norm);
  const k2 = Math.abs(c.kPrec) < 1e-15 ? 0 : c.kPrec, k1 = Math.abs(c.kTilt) < 1e-15 ? 0 : c.kTilt;
  return { k1, k2, k2s: (sense === 'g2p' ? 1 : -1) * k2 };
}

/* ───────── (ii) 一定の Ω の閉じた形と判定の量 ───────── */
/**
 * 一定の Ω̂ のまわりの判定の量(θ = 半頂角 —— 度・W = abs(Ω) rad/s)。
 * 1 周 = T_W = 2π ÷ W。返す: dThPerTurnDeg・phasePerTurnDeg・returnPerTurn(T_W あたりの戻りの e 倍の数)・
 *   dThDt(rad/s)・phaseRate(rad/s)・returnRate(1/s)・tE(半頂角が 1/e になる時間 —— 年・(α) の式)・tStar(θ > 90° の (β) で 90° に着く時間 —— 年)
 */
export function judgeConst({ thDeg, W, f, sense }) {
  if (!(fin(thDeg) && thDeg >= 0 && thDeg <= 180 && fin(W) && W >= 0)) throw new RangeError('judgeConst: θ は 0〜180°・W ≥ 0');
  const { k1, k2s } = kOf(f, sense), th = thDeg * D2R, s = Math.sin(th), c = Math.cos(th);
  // 1 周 T_W の閉じた形: tan(θ₁/2) = tan(θ/2) e^(−2π k₁)・乱れの比 dθ₁/dθ = sin θ₁ ÷ sin θ(戻りの 1 周あたり = −ln(その比))
  const th1 = thDeg === 0 || thDeg === 180 ? th : 2 * Math.atan(Math.tan(th / 2) * Math.exp(-2 * Math.PI * k1));
  const out = { thDeg, W, f, sense, k1, k2s,
    dThPerTurnDeg: th1 / D2R - thDeg, phasePerTurnDeg: 360 * k2s,
    returnPerTurn: thDeg === 0 || thDeg === 180 ? 2 * Math.PI * k1 * c : -Math.log(Math.sin(th1) / s),
    dThDt: -k1 * W * s, phaseRate: k2s * W, returnRate: k1 * W * c, tE: null, tStar: null };
  const kw = k1 * W;
  if (kw > 0 && thDeg > 0 && thDeg < 180) {
    out.tE = Math.log(Math.tan(th / 2) / Math.tan(th / (2 * Math.E))) / kw / YR;
    if (thDeg > 90) out.tStar = Math.log(Math.tan(th / 2)) / kw / YR;
  }
  return out;
}
/** 一定の Ω̂ で t 年の後の半頂角(度 —— (α) の閉じた形 tan(θ/2) = tan(θ₀/2) e^(−k₁ W t))と (β) の値 */
export function thAfter({ thDeg, W, f, sense, tYr }) {
  const { k1 } = kOf(f, sense), x = k1 * W * tYr * YR;
  if (!(fin(x) && x >= 0)) throw new RangeError('thAfter: k₁ W t ≥ 0');
  const a = thDeg === 0 || thDeg === 180 ? thDeg : 2 * Math.atan(Math.tan(thDeg * D2R / 2) * Math.exp(-x)) / D2R;
  const b = thDeg > 90 && a <= 90 ? 90 : a;
  return { alpha: a, beta: b, kwt: x };
}

/* ───────── (iii) 合成の軸が回るとき ───────── */
function checkP(P) {
  const { Om, W, n, g, k1, k2s } = P;
  if (!(isVec(Om) && nrm(Om) > 0 && fin(W) && W >= 0 && isVec(n) && nrm(n) > 0 && fin(g) && fin(k1) && k1 >= 0 && fin(k2s))) throw new RangeError('回る軸: Ω̂・W ≥ 0・n̂・g・k₁ ≥ 0・σk₂');
  return { oh: unit(Om), nh: unit(n), W, g, k1, k2s };
}
/** 一緒に回る枠の a = σ k₂ W Ω̂ − g n̂ と b = k₁ W(mut 'plusG' = 回る枠の項の符号を逆に —— 変異) */
export function aOf(P, { mut = null } = {}) {
  const { oh, nh, W, g, k1, k2s } = checkP(P);
  return { a: sub(scl(oh, k2s * W), scl(nh, (mut === 'plusG' ? -1 : 1) * g)), b: k1 * W, oh, nh };
}
/** 一緒に回る枠の dŝ/dt */
export function flowRot(s, P, o = {}) {
  const { a, b, oh } = aOf(P, o), su = unit(s);
  return add(scl(sub(oh, scl(su, dot(su, oh))), b), crs(a, su));
}
/**
 * 止まる向き(閉じた形)。返す { pts: [{ s, lam, branch }], neutral }。b > 0: λ > 0(引き込む)と λ < 0(離れる)の 2 点。b 0: ± â(中立)。
 * 打ち消しを避けて x を数える(B ≥ 0 は 2C ÷ (B + √(B² + 4C))・B < 0 は (−B + √(B² + 4C)) ÷ 2)。
 */
export function lockPoints(P, o = {}) {
  const { a, b, oh } = aOf(P, o), aa = dot(a, a), ao = dot(a, oh);
  if (b === 0) {
    if (!(aa > 0)) return { pts: [], neutral: true };
    const ah = unit(a), sg = dot(ah, oh) >= 0 ? 1 : -1;
    return { pts: [{ s: scl(ah, sg), lam: 0, branch: 'n+' }, { s: scl(ah, -sg), lam: 0, branch: 'n-' }], neutral: true };
  }
  const B = aa - b * b, Cc = b * b * ao * ao, q = Math.sqrt(B * B + 4 * Cc);
  const x = B >= 0 ? (q + B > 0 ? 2 * Cc / (B + q) : 0) : (-B + q) / 2;
  const pts = [];
  for (const sg of [1, -1]) {
    const lam = sg * Math.sqrt(x);
    if (!(Math.abs(lam) > 0)) continue;
    const v = add(add(scl(oh, lam * lam), scl(crs(a, oh), lam)), scl(a, ao));
    const s = scl(v, b / (lam * (lam * lam + aa)));
    pts.push({ s: unit(s), lam, branch: sg > 0 ? '+' : '-', normErr: Math.abs(nrm(s) - 1) });
  }
  return { pts, neutral: false };
}
/** 接平面の基底 */
function tBasis(s) { const t = Math.abs(s[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e1 = unit(crs(s, t)), e2 = crs(s, e1); return [e1, e2]; }
/** 止まる点のまわりの線形化(接平面の 2 × 2 —— 中心差分)と固有値の実部・跡。戻りの率 = −(実部の大きい方) */
export function linearize(s, P, { h = 1e-6 } = {}) {
  const [e1, e2] = tBasis(unit(s)), sc = Math.max(1e-300, nrm(aOf(P).a) + aOf(P).b), J = [[0, 0], [0, 0]];
  [e1, e2].forEach((e, j) => {
    const fp = flowRot(unit(add(s, scl(e, h))), P), fm = flowRot(unit(sub(s, scl(e, h))), P);
    const d = scl(sub(fp, fm), 1 / (2 * h));
    J[0][j] = dot(d, e1); J[1][j] = dot(d, e2);
  });
  const tr = J[0][0] + J[1][1], det = J[0][0] * J[1][1] - J[0][1] * J[1][0], disc = tr * tr / 4 - det;
  const reMax = disc >= 0 ? tr / 2 + Math.sqrt(disc) : tr / 2, im = disc >= 0 ? 0 : Math.sqrt(-disc);
  const fl = (v) => (Math.abs(v) <= 1e-9 * sc ? 0 : v);
  // b 0(経路 ① なし): 回る枠の流れは a × ŝ の剛体の回転 —— 固有値は ± i abs(a)・実部は閉じた形で 0(差分の丸めを数えない)
  if (aOf(P).b === 0) return { J, trace: 0, det, reMax: 0, im: nrm(aOf(P).a), returnRate: 0, spiral: true };
  return { J, trace: fl(tr), det, reMax: fl(reMax), im: fl(im), returnRate: fl(-reMax), spiral: disc < 0 };
}
/**
 * 無次元の幾何(W 1・n̂ = z・Ω̂ = (sin I, 0, cos I)・g = ρ k₂(k₂ 0 なら g = ρ)): 引き込む点(b > 0)か中立の点(b 0 —— Ω̂ の側)の
 * n̂ との角(引き込む点の半頂角)・Ω̂ との角(遅れ)・Ω̂ と n̂ の面からの角・戻りの率(÷ W)・回る枠の流れの残り。
 */
export function lockGeom({ IDeg, rho, f, sense, mut = null }) {
  if (!(fin(IDeg) && IDeg >= 0 && IDeg <= 180 && fin(rho))) throw new RangeError('lockGeom: I・ρ');
  const { k1, k2, k2s } = kOf(f, sense), I = IDeg * D2R, Om = [Math.sin(I), 0, Math.cos(I)], n = [0, 0, 1];
  const g = rho * (k2 > 0 ? k2 : 1), P = { Om, W: 1, n, g, k1, k2s };
  const L = lockPoints(P, { mut }), p = L.pts[0];
  if (!p) return { IDeg, rho, f, sense, g, ok: false };
  const lin = linearize(p.s, P), res = nrm(flowRot(p.s, P));
  return { IDeg, rho, f, sense, g, ok: true, neutral: L.neutral, s: p.s, lam: p.lam, halfDeg: R3.angDeg(p.s, n), lagDeg: R3.angDeg(p.s, Om),
    outDeg: Math.asin(Math.max(-1, Math.min(1, p.s[1]))) / D2R, returnRate: lin.returnRate, trace: lin.trace, spiral: lin.spiral, resid: res };
}
/** 引き込む点(f > 0)・中立の点(f 0)の半頂角が目標になる ρ を逆に解く(片側の走査と二分 —— 両方の符号) */
export function invertTarget({ targetDeg, IDeg, f, sense, perDecade = DECL.invPerDecade }) {
  const roots = [];
  for (const sg of [1, -1]) {
    const N = 6 * perDecade, xs = Array.from({ length: N + 1 }, (_, i) => -3 + 6 * i / N);
    const F = (lx) => { const r = lockGeom({ IDeg, rho: sg * 10 ** lx, f, sense }); return r.ok ? r.halfDeg - targetDeg : NaN; };
    let fa = F(xs[0]);
    for (let i = 1; i < xs.length; i++) {
      const fb = F(xs[i]);
      if (fin(fa) && fin(fb) && fa * fb < 0) {
        let lo = xs[i - 1], hi = xs[i], flo = fa;
        for (let it = 0; it < 60; it++) { const m = (lo + hi) / 2, fm = F(m); if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
        const rho = sg * 10 ** ((lo + hi) / 2), r = lockGeom({ IDeg, rho, f, sense });
        roots.push({ rho, halfDeg: r.halfDeg, lagDeg: r.lagDeg, returnRate: r.returnRate });
      }
      fa = fb;
    }
  }
  return roots;
}
/** n̂ のまわりの角 φ の回転(Rodrigues) */
export const rotAbout = (v, n, phi) => R3.rodrigues(v, unit(n), phi);
/** 慣性の枠で数値の步: Ω(t) = W R_n(g t) Ω̂₀ を第351便d の r3Step(中点・回転の更新)で回す。kPrec = σ k₂ */
export function stepRotating({ s0, P, T, dt }) {
  const { oh, nh, W, g, k1, k2s } = checkP(P);
  const om = (t) => scl(rotAbout(oh, nh, g * t), W);
  return R3.r3Step({ s0, om, T, dt, kTilt: k1, kPrec: k2s, integ: 'mid' });
}

/* ───────── 天体の行(一定の合成の軸 —— 表 1)───────── */
/** 基準軸(第352便c の refAxes) */
export function axesOf(T1 = E.t1Table(), GEO = E.geometry()) { const A = C.refAxes(T1, GEO); return { L: A.L, eq: A.eq }; }
/** 1 つの受け手・背景の向き・大きさ: 合成の Ω(第352便d の rowOf —— 主の成分 (S)・(C2)・k 1)と ŝ・n̂・θ */
export function bodyState(T1, GEO, id, { bg, axis, u }, cache = null) {
  const R = D.rowOf(T1, GEO, id, { bg, sense: 'g2p', u, part: 'S', axis }, cache);
  const W = nrm(R.Om);
  return { id, sHat: R.sHat, nHat: R.nHat, Om: R.Om, W, thDeg: W > 0 ? R3.angDeg(R.sHat, R.Om) : null, oblDeg: R.nHat ? R3.angDeg(R.sHat, R.nHat) : null,
    locOverW: W > 0 ? nrm(R.local) / W : null };
}

/* ───────── 零試験・変異 ───────── */
export function pureScenes() {
  const sT = (deg) => [Math.sin(deg * D2R), 0, Math.cos(deg * D2R)];
  // ① f 0 → 中立(戻りの率 0 —— 閉じた形・線形化)と、一定の Ω で乱した初期値との差が保たれる(r3Step)
  const n0 = judgeConst({ thDeg: 40, W: 2, f: 0, sense: 'g2p' }), lg0 = lockGeom({ IDeg: 20, rho: 0.3, f: 0, sense: 'g2m' });
  const ra = R3.r3Step({ s0: sT(40), om: [0, 0, 2], T: 5, dt: 0.01, kTilt: 0, kPrec: 1, integ: 'mid' }), rb = R3.r3Step({ s0: sT(41), om: [0, 0, 2], T: 5, dt: 0.01, kTilt: 0, kPrec: 1, integ: 'mid' });
  const neutral = { ret: n0.returnRate, lin: lg0.returnRate, keep: Math.abs((rb.thEndDeg - ra.thEndDeg) - 1) };
  // ② f > 0 で一定の Ω → 合成の向きにそろう(r3Step と exactStep の步が閉じた形と同じ・θ は減る)
  const kk = kOf(0.5, 'g2m'); let s = sT(40);
  for (let i = 0; i < 400; i++) s = RG.exactStep(s, [0, 0, 2], kk.k1, kk.k2s, 0.01).s;
  const thEx = R3.angDeg(s, [0, 0, 1]), thC = thAfter({ thDeg: 40, W: 2, f: 0.5, sense: 'g2m', tYr: 4 / YR }).alpha;
  const rs = R3.r3Step({ s0: sT(40), om: [0, 0, 2], T: 4, dt: 0.002, kTilt: kk.k1, kPrec: kk.k2s, integ: 'mid' });
  const align = { exErr: Math.abs(thEx - thC), stepErr: Math.abs(rs.thEndDeg - thC), dec: thC < 40, precSign: Math.sign(rs.precRate) };
  // ③ g 0 → 一定の Ω に戻る: 止まる点 = Ω̂・戻りの率 = k₁ W(= judgeConst の θ 0)
  const P0 = { Om: [0.3, -0.4, 0.8], W: 1.7, n: [0, 0, 1], g: 0, k1: kk.k1, k2s: kk.k2s }, L0 = lockPoints(P0), l0 = linearize(L0.pts[0].s, P0);
  const g0 = { axErr: nrm(sub(L0.pts[0].s, unit(P0.Om))), ret: Math.abs(l0.returnRate - kk.k1 * 1.7), jc: Math.abs(judgeConst({ thDeg: 0, W: 1.7, f: 0.5, sense: 'g2m' }).returnRate - kk.k1 * 1.7),
    im: Math.abs(l0.im - kk.k2 * 1.7) };
  // ④ 止まる点で回る枠の dŝ/dt = 0(格子: 向きの読み 2 × f 3 × I 3 × ρ 4)・跡 = −2λ・λ = b (ŝ·Ω̂)
  let resid = 0, trErr = 0, lamErr = 0, nPts = 0;
  for (const sense of DECL.senses) for (const f of [0, 0.5, 0.9]) for (const IDeg of [5, 40, 120]) for (const rho of [-3, -0.2, 0.2, 3]) {
    const { k1, k2, k2s } = kOf(f, sense), I = IDeg * D2R, P = { Om: [Math.sin(I), 0, Math.cos(I)], W: 1, n: [0, 0, 1], g: rho * k2, k1, k2s };
    for (const p of lockPoints(P).pts) { nPts++; resid = Math.max(resid, nrm(flowRot(p.s, P))); const lin = linearize(p.s, P);
      trErr = Math.max(trErr, Math.abs(lin.trace + 2 * p.lam)); lamErr = Math.max(lamErr, Math.abs(p.lam - k1 * dot(p.s, P.Om))); }
  }
  // ⑤ 回る軸の数値の步: 止まる点から出ると R_n(gT) ŝ* に留まる・半頂角を乱すと戻りの率で近付く(f 0.5・(g2+) と (g2−))
  const rot = [];
  for (const sense of DECL.senses) {
    const { k1, k2, k2s } = kOf(0.5, sense), I = 20 * D2R, P = { Om: [Math.sin(I), 0, Math.cos(I)], W: 1, n: [0, 0, 1], g: -0.6 * k2, k1, k2s };
    // 戻りの率の数値: 時刻 2 と 8 の差の比(乱れ 1e-3 —— 步の誤差より十分大きい所で読む)
    const p = lockPoints(P).pts[0], lin = linearize(p.s, P), T = 8, dt = 0.001;
    const r0 = stepRotating({ s0: p.s, P, T, dt }), stay = nrm(sub(r0.sEnd, rotAbout(p.s, P.n, P.g * T)));
    const [e1] = tBasis(p.s), sP = unit(add(p.s, scl(e1, 1e-3)));
    const dAt = (t) => nrm(sub(stepRotating({ s0: sP, P, T: t, dt }).sEnd, rotAbout(p.s, P.n, P.g * t)));
    const lamNum = -Math.log(dAt(8) / dAt(2)) / 6;
    rot.push({ sense, stay, lamNum, lamLin: lin.returnRate, relErr: Math.abs(lamNum / lin.returnRate - 1) });
  }
  // ⑥ 回らない Ω̂ のまわりで I が半頂角(g 0 で ŝ* = Ω̂ —— n̂ との角 = I)
  const gI = lockGeom({ IDeg: 23.4, rho: 0, f: 0.5, sense: 'g2p' });
  // ⑦ b 0 の中立の点は ± â・k₁ 0 の回る枠では ŝ* のまわりを回り続ける(差が保たれる)
  const Pn = { Om: [Math.sin(0.4), 0, Math.cos(0.4)], W: 1, n: [0, 0, 1], g: 0.5, k1: 0, k2s: -1 }, Ln = lockPoints(Pn), an = unit(aOf(Pn).a);
  const neutralPt = Ln.neutral && Math.abs(Math.abs(dot(Ln.pts[0].s, an)) - 1) < 1e-15 && linearize(Ln.pts[0].s, Pn).returnRate === 0;
  // ⑧ 逆に解いた ρ の半頂角が目標(f 0.5・I 30・目標 23.4)
  const inv = invertTarget({ targetDeg: 23.4, IDeg: 30, f: 0.5, sense: 'g2p', perDecade: 20 });
  const invErr = inv.length ? Math.max(...inv.map((r) => Math.abs(r.halfDeg - 23.4))) : null;
  // ⑨ 判定の量の閉じた形(θ 60・f 0.5): 1 周の後の半頂角 = 第351便d の closedR3((α))・位相 360 σ k₂・1 周あたりの戻り = 乱れ δ の数値の比・局所の率 −k₁ W sin θ・k₁ W cos θ
  const j = judgeConst({ thDeg: 60, W: 3, f: 0.5, sense: 'g2m' }), k5 = kOf(0.5, 'g2m'), TW = 2 * Math.PI / 3;
  const c1 = R3.closedR3({ th0Deg: 60, Om: 3, t: TW, kTilt: k5.k1, kPrec: 0 }).thDeg, c2 = R3.closedR3({ th0Deg: 60 + 1e-6, Om: 3, t: TW, kTilt: k5.k1, kPrec: 0 }).thDeg;
  const jcErr = Math.abs(j.dThPerTurnDeg - (c1 - 60)) + Math.abs(j.phasePerTurnDeg + 360 * k5.k2) + Math.abs(j.returnPerTurn + Math.log((c2 - c1) / 1e-6)) * 1e-3
    + Math.abs(j.dThDt + k5.k1 * 3 * Math.sin(60 * D2R)) + Math.abs(j.returnRate - k5.k1 * 3 * 0.5);
  // 変異: 回る枠の項の符号を逆にした a で止まる点を作ると、正しい流れで 0 にならない
  const Pm = { Om: [Math.sin(0.5), 0, Math.cos(0.5)], W: 1, n: [0, 0, 1], g: 0.7, k1: kk.k1, k2s: kk.k2s }, pm = lockPoints(Pm, { mut: 'plusG' }).pts[0];
  const muts = { plusG: nrm(flowRot(pm.s, Pm)) > 1e-3, g2mDiff: nrm(sub(lockGeom({ IDeg: 20, rho: 0.5, f: 0.5, sense: 'g2p' }).s, lockGeom({ IDeg: 20, rho: 0.5, f: 0.5, sense: 'g2m' }).s)) > 1e-3 };
  const rej = [() => kOf(0.5, 'g2'), () => kOf(1.5, 'g2p'), () => judgeConst({ thDeg: 200, W: 1, f: 0, sense: 'g2p' }), () => judgeConst({ thDeg: 10, W: -1, f: 0, sense: 'g2p' }),
    () => lockPoints({ Om: [0, 0, 0], W: 1, n: [0, 0, 1], g: 0, k1: 1, k2s: 0 }), () => lockPoints({ Om: [0, 0, 1], W: 1, n: [0, 0, 1], g: 0, k1: -1, k2s: 0 }), () => lockGeom({ IDeg: 10, rho: NaN, f: 0, sense: 'g2p' })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { neutral, align, g0, resid, trErr, lamErr, nPts, rot, gI: { half: gI.halfDeg, lag: gI.lagDeg }, neutralPt, inv, invErr, jcErr, muts, rejects: rej };
}
export function pureGates(S) {
  return {
    neutralF0: S.neutral.ret === 0 && S.neutral.lin === 0 && S.neutral.keep < 1e-4,
    alignConst: S.align.exErr < 1e-9 && S.align.stepErr < 1e-4 && S.align.dec && S.align.precSign === -1,
    g0IsConst: S.g0.axErr < 1e-12 && S.g0.ret < 1e-6 && S.g0.jc < 1e-15 && S.g0.im < 1e-6,
    lockZero: S.nPts === 144 && S.resid < 1e-12 && S.lamErr < 1e-12,
    traceClosed: S.trErr < 1e-6,
    rotStep: S.rot.length === 2 && S.rot.every((r) => r.stay < 1e-6 && r.relErr < 0.02 && r.lamLin > 0),
    gIhalf: Math.abs(S.gI.half - 23.4) < 1e-9 && S.gI.lag < 1e-9,
    neutralPt: S.neutralPt,
    invert: S.inv.length >= 1 && S.invErr < 1e-9,
    judgeClosed: S.jcErr < 1e-8,
    mutants: S.muts.plusG && S.muts.g2mDiff,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}

// 第338便b(原仮定者の回答(2026-11-15 —— 第138報の回答 5)「⑪は２倍角に対する補正だと思われるので、廃止せず経緯を見直し」・
//   原仮定者の指示(2026-11-15 —— 第139報)・原仮定者の指示(2026-10-18 —— 第101報・第103報)
//   「源の軸回転が、軸方向に対する角度差の、２倍の角度差で傾いた軸で作用する」「軸引きずりの強さは、軸方向で弱くなる。理由は、軸引きずりは回転引きずりの差分であり、仰角が上がると回転引きずりが弱くなる為」・
//   原仮定者の指示(2026-10-30 —— 第121報)の合成の規則・統括の検証項目 R350):
//   **軸引きずりの向きの補正のノブ(捩れの型 ⑪ を 2 倍角の則に対する補正として q で振る)・AN747 の 3 列(源の近くの受け手の向き)・合成の規則の一般の比** の純関数。
//   (段 bevelknob-338b —— 器 tests/exp-w338b-bevelknob.mjs・正本 tests/out/bevelknob-338b.json)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない
//   (第337便l の lib は同じ枝の訂正 —— 版 2 —— を呼ぶ)。html を読まない・ネットへ取りに行かない・乱数を使わない。
//
// ■ 記号: 源の自転 s(向き ŝ)・受け手への単位ベクトル r̂・仰角 el(sin el = ŝ·r̂)・s∥ = (s·r̂) r̂(|s∥| = s sin el)・s⊥ = s − s∥(|s⊥| = s cos el)。
// ■ 補正のノブ(⑪ を q で連続に): h_q = −s⊥ + μ cos^q(el) s∥・μ = 2^{q/2}(仰角 45° で向き 90°・強さ 1 を保つ条件)—— q 0 は今の 2 倍角の則(半回転 s∥ − s⊥)・q 1 は第337便l の ⑪。
//   全体に掛ける型(比べる): g_p = cos^p(el) (s∥ − s⊥)(p 0・1・2)。軸の方向(el 90°)では q > 0 と p > 0 の候補の強さは 0 —— 向きは el → 90° の極限(閉じた形)で書く。
// ■ AN747 の 3 列(赤道面の振幅 A(f) —— 太陽の項 = A(f) · s · P〔P は向きの則の軌道の平均の因子〕・A > 0 が逆の側):
//   列 A = f(α_e − 1)(運ばれる線速度 U = f s r の動径の勾配 dU/dr = s f(1 − α(1 − f)) —— f > ½ で順へ反転)/列 B = f(反転しない)/
//   列 B′ = α f(1 − f)(運ばれる角速度 Ω = f s の動径の勾配 r dΩ/dr = −α s f(1 − f) —— 0 < f < 1 の全域で逆・f = ½ で最大 —— 統括の参考の試作)。
// ■ 言わないこと: 補正のノブの値を決めない(候補の表)。どの列を採るかを決めない(原仮定者の指示(2026-11-15 —— 第139報)で AN747 は両方の列を残す)。倍率は「この列でこの f に固定したら要る数」で定数にしない。文献の値は未照合。
import { splitSpin, venusBalance, planetRows, moonRows, galaxyRow, ampOf, DECL as L337, LIT as LIT337, LIB_VERSION as L337_VERSION } from './lib-w337l-bevel.mjs';
import { LIT as LITJ, angleDeg } from './lib-w337j-spinorbit.mjs';
import { profileUW } from './lib-w337i-rotring.mjs';
import { galacticAxes } from './lib-w335b-carryledger.mjs';

export const LIB_VERSION = 'w338b-bevelknob-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const D2R = Math.PI / 180;
/** 丸めの残り: |x| が尺度 × 1e-12 より小さければ 0(正本に丸めの残りを値のまま書かない —— 運用の追記 57 ②) */
export const FLOOR = 1e-12;
export const z12 = (x, scale = 1) => (Math.abs(x) < FLOOR * Math.abs(scale) ? 0 : x);

/** 宣言(走行の前に置く —— 走らせたノブの格子と判定の物差しの記録) */
export const DECL = Object.freeze({
  alpha: 2,
  /** 補正のノブ q(μ = 2^{q/2})と全体に掛ける型の p */
  qGrid: Object.freeze([0, 0.25, 0.5, 0.75, 1]), pGrid: Object.freeze([0, 1, 2]),
  /** 仰角の格子 [°](原文の 3 点 0°・45°・90° と軸の近く 85°・89° を含む) */
  elevDeg: Object.freeze([0, 15, 30, 45, 60, 75, 85, 89, 90]),
  /** 回転引きずりの高さの型(第337便i の profileUW —— 源の中心からの距離 r を固定して仰角で振る): ball・src(r/R_d に依らない)・lor2(r/R_d = 2) */
  profiles: Object.freeze(['ball', 'src', 'lor2']), rOverRd: 2,
  /** AN747 の 3 列と係数(A(f) = c0 + c1 f + c2 f²) */
  cols: Object.freeze(['A', 'B', 'Bp']),
  /** 赤道面の有限差分: 源の取り分 f の点・受け手の半径 R/r */
  fdF: Object.freeze([0.1, 0.3, 0.5, 0.7, 0.9]), fdR: Object.freeze([1e-3, 1e-4, 1e-5]),
  /** 合成の規則の表: 比 B/A と角 [°] */
  ruleRatios: Object.freeze([1, 0.5, 0.1]), ruleAngles: Object.freeze([0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180]), ruleDeg: 120,
  /** 零点合わせの読みのしきい(第337便l 版 2 の ZERO_NODE_RATIO と同じ値)・軌道の平均の点の数 */
  nPhi: 720,
  /** 120° を出す仰角の解の二分の回数 */
  bisect: 200,
});
export const COL_JA = Object.freeze({ A: '列 A 符号つき f(α_e − 1)(線速度 U = f s r の動径の勾配 —— f > ½ で順へ反転)', B: '列 B 取り分 f(反転しない)', Bp: '列 B′ α f(1 − f)(角速度 Ω = f s の動径の勾配 —— 全域で逆・f = ½ で最大)' });
export const colCoef = (col, alpha = DECL.alpha) => {
  if (col === 'A') return [0, alpha - 1, -alpha];
  if (col === 'B') return [0, 1, 0];
  if (col === 'Bp') return [0, alpha, -alpha];
  throw new RangeError('colCoef: ' + col);
};
export const colAmp = (col, f, alpha = DECL.alpha) => { const [a, b, c] = colCoef(col, alpha); return a + b * f + c * f * f; };

/* ───────── T2 補正のノブ ───────── */
export const muOf = (q) => Math.pow(2, q / 2);
/** 補正のノブ h_q = −s⊥ + μ cos^q(el) s∥ */
export function twistAxis(s, rhat, q, mu = muOf(q)) {
  if (!fin(q) || q < 0) throw new RangeError('twistAxis: q ≥ 0');
  const { par, perp } = splitSpin(s, rhat), sm = nrm(s), c = sm > 0 ? nrm(perp) / sm : 0;   // cos el = |s⊥|/|s|(asin を経ない —— 軸の近くでも桁を失わない)
  return add(scl(perp, -1), scl(par, mu * (q === 0 ? 1 : Math.pow(c, q))));
}
/** 全体に掛ける型 g_p = cos^p(el)(s∥ − s⊥) */
export function overallAxis(s, rhat, p) {
  if (!fin(p) || p < 0) throw new RangeError('overallAxis: p ≥ 0');
  const { par, perp } = splitSpin(s, rhat), sm = nrm(s), c = sm > 0 ? nrm(perp) / sm : 0;
  return scl(sub(par, perp), p === 0 ? 1 : Math.pow(c, p));
}
/** 軸の方向の極限の向き(閉じた形): tan(角) = |s⊥| / (μ cos^q |s∥|) = cos^{1 − q} el / (μ sin el) → q < 1 で 0°・q = 1 で arctan(1/μ)・q > 1 で 90° */
export const twistPoleLimitDeg = (q, mu = muOf(q)) => (q < 1 ? 0 : q === 1 ? Math.atan(1 / mu) / D2R : 90);
const at = (elDeg) => (elDeg === 90 ? [0, 0, 1] : elDeg === 0 ? [1, 0, 0] : [Math.cos(elDeg * D2R), 0, Math.sin(elDeg * D2R)]);   // 0° と 90° はちょうどの向き
/** (a) 仰角ごとの向き(源の軸からの角 [°])と強さ(÷ s)—— q の列と p の列 */
export function elevRows() {
  const s = [0, 0, 1];
  return DECL.elevDeg.map((el) => {
    const rh = at(el), row = { elDeg: el, q: {}, p: {} };
    for (const q of DECL.qGrid) { const h = twistAxis(s, rh, q), m = nrm(h), zero = m < FLOOR;
      row.q[q] = { ang: zero ? null : angleDeg(h, s), mag: z12(m), limit: zero ? twistPoleLimitDeg(q) : null, kind: zero ? '強さ 0' : kindOf(angleDeg(h, s)) }; }
    for (const p of DECL.pGrid) { const g = overallAxis(s, rh, p), m = nrm(g), zero = m < FLOOR;
      row.p[p] = { ang: zero ? null : angleDeg(g, s), mag: z12(m), limit: zero ? 0 : null, kind: zero ? '強さ 0' : kindOf(angleDeg(g, s)) }; }
    return row;
  });
}
/** 向きの種類(原文の 3 点の種類で読む —— 角度の数で候補を落とさない): 逆の側(> 90°)・90° 傾いた回転(= 90°)・順の側(< 90°) */
export const kindOf = (ang) => (ang === null ? '—' : Math.abs(ang - 90) <= 1e-9 ? '90° 傾き' : ang > 90 ? '逆の側' : '順の側');

/** (b) 「軸方向で弱くなる」の 2 つの置き方を差分の読みと回転引きずりの高さの型から読む: 仰角ごとの |逆回転の分| と 順回転の分 ÷ sin el */
export function placementRows() {
  const s = [0, 0, 1], RK1 = 1;   // src の型の R_K1 は比で消える(r/R_d を固定)
  const g = (prof, el) => { if (el >= 90) return null; const r = DECL.rOverRd, rho = r * Math.cos(el * D2R), z = r * Math.sin(el * D2R), U = profileUW(prof, rho, z, 1, 1, RK1).U, U0 = profileUW(prof, r, 0, 1, 1, RK1).U; return U / U0; };
  return DECL.elevDeg.map((el) => {
    const rh = at(el), sp = splitSpin(s, rh), c = nrm(sp.perp), sn = nrm(sp.par);
    // 差分の読み(第337便a・l の diffClosed —— α_e 2 の赤道の向き): 線に垂直な分だけ −s⊥(大きさ cos el)・線に沿う分 0
    const diffPerp = nrm(sp.perp), out = { elDeg: el, diffPerp: z12(diffPerp), diffPar: 0, rot: {}, q: {}, p: {} };
    for (const prof of DECL.profiles) out.rot[prof] = g(prof, el);
    for (const q of DECL.qGrid) { const h = twistAxis(s, rh, q), hp = dot(h, rh); out.q[q] = { perp: z12(nrm(sub(h, scl(rh, hp)))), parFactor: sn > 1e-12 ? hp / sn : muOf(q) }; }
    for (const p of DECL.pGrid) { const h = overallAxis(s, rh, p), hp = dot(h, rh); out.p[p] = { perp: z12(nrm(sub(h, scl(rh, hp)))), parFactor: sn > 1e-12 ? hp / sn : 1 }; }
    out.cosEl = z12(c);
    return out;
  });
}
/** (b) の読み: 候補ごとに (i) 逆回転の分が差分の読みの cos el と同じか(最大の差)(ii) 順回転の分の落ち方(÷ 赤道の値)が回転引きずりの高さの型(ball)と同じか(最大の差・el < 90°) */
export function placementJudge(rows) {
  const out = {}, inner = rows.filter((r) => r.elDeg < 90);
  const dev = (sel) => Math.max(...rows.map((r) => Math.abs(sel(r).perp - r.diffPerp)));
  const devPar = (sel, base) => Math.max(...inner.map((r) => Math.abs(sel(r).parFactor / base - r.rot.ball)));
  for (const q of DECL.qGrid) out['q' + q] = { perpDev: z12(dev((r) => r.q[q])), parDevBall: z12(devPar((r) => r.q[q], muOf(q))), mu: muOf(q) };
  for (const p of DECL.pGrid) out['p' + p] = { perpDev: z12(dev((r) => r.p[p])), parDevBall: z12(devPar((r) => r.p[p], 1)), mu: 1 };
  return out;
}

/** 源の赤道面に対する傾き i の円の軌道の上の平均(受け手の位置 r̂(φ)): 軸の関数 fn(s, r̂) の源の軸の向きの成分と軌道の法線の向きの成分 */
export function orbitMeanAxis({ iDeg, fn, nPhi = DECL.nPhi }) {
  const s = [0, 0, 1], nO = [0, -Math.sin(iDeg * D2R), Math.cos(iDeg * D2R)], e1 = [1, 0, 0], e2 = crs(nO, e1);
  let as = 0, an = 0;
  for (let k = 0; k < nPhi; k++) { const ph = 2 * Math.PI * (k + 0.5) / nPhi, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), w = fn(s, rh); as += dot(w, s) / nPhi; an += dot(w, nO) / nPhi; }
  return { alongSpin: as, alongNormal: an };
}
const KNOBS = () => [...DECL.qGrid.map((q) => ({ key: 'q' + q, fn: (s, r) => twistAxis(s, r, q) })), ...DECL.pGrid.map((p) => ({ key: 'p' + p, fn: (s, r) => overallAxis(s, r, p) }))];
/** (c) q を振ったときの: 太陽 → 8 惑星と衛星の軌道の平均の向きの因子・銀河 → 太陽系の向き・120° に要る仰角・金星の釣り合いの根 */
export function knobReadRows() {
  const planets = planetRows(), moons = moonRows().moons, K = KNOBS(), vf = planets.find((p) => p.key === 'venus');
  const pl = planets.map((P) => { const o = { key: P.key, iSunDeg: P.iSunDeg, f: P.f, dir: {} }; for (const k of K) o.dir[k.key] = orbitMeanAxis({ iDeg: P.iSunDeg, fn: k.fn }).alongSpin; return o; });
  const mo = moons.map((M) => { const o = { key: M.key, iDeg: M.iDeg, f: M.f, dir: {} }; for (const k of K) o.dir[k.key] = orbitMeanAxis({ iDeg: M.iDeg, fn: k.fn }).alongSpin; return o; });
  const gal = galaxyRow(), s = [0, 0, 1];
  const galq = DECL.qGrid.map((q) => {
    const angAt = (el) => angleDeg(twistAxis(s, at(el), q), s);
    let a = 0, b = 45; for (let it = 0; it < DECL.bisect; it++) { const m = (a + b) / 2; if (angAt(m) > 120) a = m; else b = m; }
    return { q, angSun: angAt(gal.elDeg), el120: (a + b) / 2 };
  });
  const ven = [];
  for (const k of K) { const P = orbitMeanAxis({ iDeg: vf.iSunDeg, fn: k.fn }).alongSpin;
    for (const amp of ['signed', 'share']) { const v = venusBalance({ P, amp }); ven.push({ knob: k.key, amp, P, nRoots: v.roots.length, roots: v.rows.map((r) => ({ f: r.f, kind: r.kind, W0: r.W0, sumOverScale: r.sumOverScale })) }); } }
  return { planets: pl, moons: mo, galaxy: { elDeg: gal.elDeg, rows: galq }, venus: ven };
}
/** (d) q ごとの判定の数(向き × 強さ): 赤道・45°・軸の方向(極限)の向きの角と種類・強さ・軸の方向の強さ ÷ 赤道の強さ */
export function knobJudge(rows) {
  const r = (el) => rows.find((x) => x.elDeg === el), out = {};
  const one = (cell0, cell45, cell90) => ({ eqAng: cell0.ang, eqKind: cell0.kind, midAng: cell45.ang, midKind: cell45.kind, midMag: cell45.mag, poleAng: cell90.ang === null ? cell90.limit : cell90.ang, poleKind: cell90.ang === null ? kindOf(cell90.limit) : cell90.kind, poleMag: cell90.mag, weakRatio: z12(cell90.mag / cell0.mag), weak: cell90.mag < cell0.mag });
  for (const q of DECL.qGrid) out['q' + q] = one(r(0).q[q], r(45).q[q], r(90).q[q]);
  for (const p of DECL.pGrid) out['p' + p] = one(r(0).p[p], r(45).p[p], r(90).p[p]);
  return out;
}

/** (c) 自転軸の傾いた受け手: 受け手の位置の仰角 el(0°・30°・60°)× 受け手の自転の軸の源の軸からの傾き ε(源の軸と r̂ の面の内で r̂ の側へ)の、h_q の受け手の軸の向きの成分(÷ s)。
 *  仰角 0° では h_q = −s で q に依らない(成分 −cos ε)—— 差が出るのは仰角のある配置 */
export const TILT_EL = Object.freeze([0, 30, 60]), TILT_EPS = Object.freeze([0, 30, 90, 150, 177.36]);
export function tiltRows() {
  const s = [0, 0, 1], out = [];
  for (const el of TILT_EL) for (const eps of TILT_EPS) {
    const rh = at(el), hor = el === 90 ? [1, 0, 0] : [rh[0], rh[1], 0], hu = scl(hor, 1 / nrm(hor)), ax = add(scl(s, Math.cos(eps * D2R)), scl(hu, Math.sin(eps * D2R)));
    const row = { elDeg: el, epsDeg: eps, q: {}, p1: z12(dot(overallAxis(s, rh, 1), ax)) };
    for (const q of DECL.qGrid) row.q[q] = z12(dot(twistAxis(s, rh, q), ax));
    row.spreadQ = z12(Math.max(...DECL.qGrid.map((q) => row.q[q])) - Math.min(...DECL.qGrid.map((q) => row.q[q])));
    out.push(row);
  }
  return out;
}

/* ───────── T3 AN747 の 3 列 ───────── */
/** 太陽 → 8 惑星(太陽の項 [rad/s] = A(f) s☉ P —— P は第337便l の半回転 × cos el の軌道の平均)と衛星(÷ 主星の自転) */
export function an747Bodies() {
  const sun = L337.spins.sun, planets = planetRows().map((p) => { const o = { key: p.key, f: p.f, P: p.dirMean.reflectP1, term: {}, sign: {} };
    for (const c of DECL.cols) { o.term[c] = colAmp(c, p.f) * sun.s * o.P; o.sign[c] = Math.sign(o.term[c]); }
    // 本体の振幅(第337便l の ampOf)と列 A・B が同じ値(照合)
    o.bodyA = z12(Math.abs(o.term.A - p.sunRefSigned), Math.abs(p.sunRefSigned)); o.bodyB = z12(Math.abs(o.term.B - p.sunRefShare), Math.abs(p.sunRefShare));
    return o; });
  const moons = moonRows().moons.map((m) => { const o = { key: m.key, host: m.host, iDeg: m.iDeg, f: m.f, P: m.dirMean, rel: {}, sign: {} };
    for (const c of DECL.cols) { o.rel[c] = colAmp(c, m.f) * m.dirMean; o.sign[c] = Math.sign(o.rel[c]); } return o; });
  return { planets, moons };
}
/** 金星の釣り合いの根(列ごと)と 3 成分の残り: 和のベクトル = A(f) s☉ P ŝ☉ + (1 − f) ω_bg L̂(1 成分の式と同じ置き方)の、黄道の北の成分・金星の自転の軸の成分・軸に垂直な 2 成分の大きさ */
export function an747Venus() {
  const sun = L337.spins.sun, ven = planetRows().find((p) => p.key === 'venus'), P = ven.dirMean.reflectP1, Lh = galacticAxes().Lhat, sV = L337.spins.venus.sHat, nE = [0, 0, 1];
  return DECL.cols.map((c) => {
    const v = venusBalance({ P, amp: colCoef(c) });
    const roots = v.rows.map((r) => {
      const sunV = scl(sun.sHat, colAmp(c, r.f) * sun.s * P), bgV = scl(Lh, (1 - r.f) * L337.wbg), sum = add(sunV, bgV), sc = nrm(sunV) + nrm(bgV);
      const along = dot(sum, sV), perp = nrm(sub(sum, scl(sV, along)));
      // 黄道の北の成分は根では 0 —— 丸めの残りの床は打ち消しの前の尺度(|c1| f + |c2| f²) s☉ |P| + |背景の項| の 1e-12
      const [c0, c1, c2] = colCoef(c), sc0 = (Math.abs(c0) + Math.abs(c1) * r.f + Math.abs(c2) * r.f * r.f) * sun.s * Math.abs(P) + nrm(bgV);
      return { ...r, north: z12(dot(sum, nE), sc0), alongSpinRel: z12(along / sc), perpSpinRel: z12(perp / sc), sunMag: nrm(sunV), bgMag: nrm(bgV) };
    });
    return { col: c, P, nRoots: roots.length, roots, needAtVenus: v.bgFactorAt(ven.f), needAtHalf: v.bgFactorAt(0.5), fVenus: ven.f };
  });
}
/** 赤道面の有限差分(正規化: s = 1・r_½ = 1・f(r) = 1/(1 + r²) —— α 2 を掛け算で): 列 A の dU/dr と列 B′ の r dΩ/dr が R/r → 0 で勾配へ寄るか。誤差 ÷ 尺度 s f(< 1e-12 は 0) */
export function an747Fd() {
  const fOf = (r) => 1 / (1 + r * r), U = (r) => fOf(r) * r, Om = (r) => fOf(r), a = DECL.alpha;
  return DECL.fdF.map((f) => {
    const r = Math.sqrt((1 - f) / f), gA = f * (1 - a * (1 - f)), gB = -a * f * (1 - f), row = { f, gradA: z12(gA, f), gradBp: gB, errA: {}, errBp: {}, signA: Math.sign(z12(gA, f)), signBp: Math.sign(gB) };
    for (const k of DECL.fdR) { const R = k * r, dA = (U(r + R) - U(r - R)) / (2 * R), dB = r * (Om(r + R) - Om(r - R)) / (2 * R);
      row.errA[k] = z12(Math.abs(dA - gA) / f); row.errBp[k] = z12(Math.abs(dB - gB) / f); }
    return row;
  });
}

/* ───────── T4 合成の規則の一般の比 ───────── */
/** 大きさ A = 1 ≥ B と角 θ: (i) 普通のベクトル和 (ii) 今の規則(θ ≤ 120° なら大きい側を下回らない)(iii) 境目を比で動かす型(cos θ ≥ −B/(2A) —— この側ではベクトル和が A 以上なので持ち上げは無い) */
export function ruleRow(B, thDeg, A = 1) {
  if (!(A >= B && B >= 0)) throw new RangeError('ruleRow: A ≥ B ≥ 0');
  const c = Math.cos(thDeg * D2R), vs = Math.sqrt(Math.max(0, A * A + B * B + 2 * A * B * c)), ruleII = thDeg <= DECL.ruleDeg, thB = Math.acos(Math.max(-1, Math.min(1, -B / (2 * A)))) / D2R;
  const ii = ruleII ? Math.max(vs, A) : vs, iii = vs;
  return { B, thDeg, vecSum: vs, ruleII: ii, ruleIII: iii, liftII: z12(ii - vs, A), noDecelII: ruleII, noDecelIII: c >= -B / (2 * A), boundaryIII: thB };
}
export function ruleTable() {
  const rows = []; for (const B of DECL.ruleRatios) for (const t of DECL.ruleAngles) rows.push(ruleRow(B, t));
  // 天体の配置: 太陽の項(第337便l の符号つきの半回転)と背景の項(L̂)—— 比と角は第337便l の T4 の作り方
  const sun = L337.spins.sun.sHat, Lh = galacticAxes().Lhat, bodies = planetRows().filter((p) => ['mercury', 'venus', 'earth'].includes(p.key)).map((p) => {
    const a = scl(sun, p.sunRefSigned), b = scl(Lh, p.bg), A = Math.max(nrm(a), nrm(b)), B = Math.min(nrm(a), nrm(b)), th = angleDeg(a, b), r = ruleRow(B / A, th);
    return { key: p.key, ratio: B / A, thDeg: th, liftII: r.liftII, noDecelII: r.noDecelII, noDecelIII: r.noDecelIII, boundaryIII: r.boundaryIII };
  });
  return { rows, gal120: DECL.ruleRatios.map((B) => ruleRow(B, 120)), bodies };
}

/* ───────── 純関数の場面 ───────── */
export function pureScenes() {
  const S = {}, s = [0, 0, 1];
  // ① q 0 = 2 倍角の則(半回転)・どの q も赤道 180°・45° で 90° と強さ 1(μ = 2^{q/2})
  { let d0 = 0, mid = 0, eq = 0; for (const el of [0, 10, 30, 45, 60, 80]) { const h = twistAxis(s, at(el), 0), R = sub(splitSpin(s, at(el)).par, splitSpin(s, at(el)).perp); d0 = Math.max(d0, nrm(sub(h, R))); }
    for (const q of DECL.qGrid) { const h = twistAxis(s, at(45), q); mid = Math.max(mid, Math.abs(angleDeg(h, s) - 90), Math.abs(nrm(h) - 1)); eq = Math.max(eq, Math.abs(angleDeg(twistAxis(s, at(0), q), s) - 180)); }
    S.knob = { q0: z12(d0), mid: z12(mid, 90), eq: z12(eq, 180) }; }
  // ② 軸の方向の極限: q < 1 で 0°・q 1 で arctan(1/√2) = 35.26°(閉じた形と el = 90° − 1e-6° の数の角)
  { const e = 1e-6 * D2R, h1 = twistAxis(s, [Math.sin(e), 0, Math.cos(e)], 1); S.pole = { q1num: angleDeg(h1, s), q1closed: twistPoleLimitDeg(1), q05: twistPoleLimitDeg(0.5) }; }
  // ③ 3 列の振幅: 列 A = 第337便l の ampOf('signed')・列 B = ampOf('share')・列 B′ は全域で正(逆の側)・f ½ で最大 α/4
  { let dA = 0, dB = 0, bpPos = true; for (const f of [0.05, 0.2, 0.5, 0.8, 0.95]) { dA = Math.max(dA, Math.abs(colAmp('A', f) - ampOf('signed', f, 2 * (1 - f)))); dB = Math.max(dB, Math.abs(colAmp('B', f) - ampOf('share', f, 2 * (1 - f)))); if (!(colAmp('Bp', f) > 0)) bpPos = false; }
    S.cols = { dA: z12(dA), dB: z12(dB), bpPos, bpMax: colAmp('Bp', 0.5) }; }
  // ④ 120° の境目: 等しい大きさでベクトル和 1・比 0.1 でベクトル和 0.9539…(今の規則は 1 へ持ち上げる)
  { const e = ruleRow(1, 120), t = ruleRow(0.1, 120); S.rule = { eq: e.vecSum, tenth: t.vecSum, tenthII: t.ruleII, bnd: ruleRow(1, 0).boundaryIII }; }
  // ⑤ 入力の拒否
  { const tries = [() => twistAxis(s, [1, 0, 0], -1), () => overallAxis(s, [1, 0, 0], NaN), () => colCoef('x'), () => ruleRow(2, 30)];
    S.rejects = tries.map((t) => { try { t(); return false; } catch (e) { return e instanceof RangeError; } }); }
  return S;
}
export function pureGates(S) {
  return {
    knob: S.knob.q0 === 0 && S.knob.mid === 0 && S.knob.eq === 0,
    pole: Math.abs(S.pole.q1num - S.pole.q1closed) <= 1e-5 && Math.abs(S.pole.q1closed - Math.atan(Math.SQRT1_2) / D2R) <= 1e-12 && S.pole.q05 === 0,
    cols: S.cols.dA === 0 && S.cols.dB === 0 && S.cols.bpPos && Math.abs(S.cols.bpMax - 0.5) <= 1e-15,
    rule: Math.abs(S.rule.eq - 1) <= 1e-12 && Math.abs(S.rule.tenth - Math.sqrt(1.01 - 0.1)) <= 1e-12 && S.rule.tenthII === 1 && Math.abs(S.rule.bnd - 120) <= 1e-9,
    rejects: S.rejects.every(Boolean),
  };
}
export { L337_VERSION, LIT337, LITJ };

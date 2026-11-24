// 第352便u(原仮定者の整理(2026-11-11)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R458):
//   **「潮汐力の引きずり版」の項 —— 受け手の位置での並進引きずりの場(在位の geoPN=3 の場)の勾配のテンソルを、反対称の部分(これまでの回転の分)と対称の部分(歪みの率)に分け、
//   扁平な受け手の軸に歪みが掛かる式の候補 (T-a)(T-b) と、比べる列 (T-g)(重力の側の潮汐のトルク —— リポジトリに在る数だけ)を並べる純関数 —— 診断だけ(候補の式・単位の係数の表)**
//   (器 tests/exp-w352u-tidaldrag.mjs と QA behavior.tidaldrag352u・docs.tidaldrag352u が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib と第 1〜第 3 ラウンドの lib は呼ぶだけ(本文は変えない):
//   第348便h(makeField3・rot3・YK —— 場)・第351便c(pairInput・partRot・galWeight —— 組の入力と照合の相手)・第352便q(structOf・refRate・needOf・candOf —— 構造の量と比べる数)・
//   第352便d(poleRates・bgVec —— 方位の率と背景)・第352便b(tagProv・MARK —— 仮の値の印)・第348便c(massOf・radiusOf)・第347便e(t1Table・geometry)・第330便a(precessionSolar・DECL.lit)・第312便a(Kball)。
//
// ■ 語: 勾配のテンソル J[a][b] = ∂u_a ÷ ∂x_b(受け手の中心 —— 自分の重みの勾配は中心で 0)。反対称の部分 Aₙ = (J − Jᵀ) ÷ 2 の軸のベクトル = ½ ∇ × u(= 中心の読み (W))・
//   対称の部分 E = (J + Jᵀ) ÷ 2 = 歪みの率(1/s)。成分 (M)(相対の公転の分)・(S)(源の自転の分)・(MS) は第351便c と同じ切り方(源の自転の倍率・相対の速度の倍率)。
// ■ 式の候補(読みを並べる —— 決めない。ŝ = 受け手の自転軸〔角運動量の向き〕・H = J2 ÷ 慣性モーメントの係数〔リポジトリの数 —— 第330便a の古典の歳差の定数と同じ置き方〕):
//   (T-a) 向きの式: τ = λ (E ŝ − (ŝ·E ŝ) ŝ)・λ = −λ̃ H(扁平で負・λ̃ は形の係数のノブ —— 単位の係数 1)。τ を「軸を傾ける回転」と読み、自転の向きに 90° ずらす:
//         (g2−) dŝ/dt = ŝ × τ(回転の分で Ω⊥ を自転の向きに 90° ずらすと −Ω × ŝ になるのと同じ向き)/(g2+) dŝ/dt = τ × ŝ。
//   (T-b) トルクの式: 受け手の各部位が引きずりの差分 E x へ率 η_d で引かれると読む —— トルク N = η_d ∫ρ x × (E x) dV = −η_d (C − A) ŝ × (E ŝ)(軸対称の慣性のテンソル)・
//         dŝ/dt = N ÷ (C ω) = −η_d (H ÷ ω) ŝ × (E ŝ)(角運動量の式 —— 1 ÷ ω が入る。η_d は引きずりの強さのノブ —— 単位の係数 1 s⁻¹)。比べる向き(反転)の列も置く。
//   (T-g) 比べる列 —— 重力の側の潮汐のトルク: 1 公転の平均の潮汐のテンソル T = (G M ÷ a³)(3 (I − n̂n̂) ÷ 2 − I) を (T-b) と同じトルクの式に入れる(η_d E → T)。
//         = −(3/2)(G M ÷ a³)(H ÷ ω)(n̂·ŝ)(n̂ × ŝ)(第330便a の precessionSolar の e 0 と同じ大きさ)。重力の列は DFM の結果ではない(比べる列)。
// ■ 言わないこと: 歳差の率をこの項で読み切ったとは書かない(候補の式・単位の係数の表)。重力の側の列を DFM の結果と書かない。仮の値との比は「仮・未照合」の印つきで合否にしない。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w352u-tidaldrag-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const G = TL.G_SI;
export const ASYR = D.ASYR;
const D2R = Math.PI / 180;

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });
/** 3 × 3(行の順の 9 個)の道具 */
export const mv = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
export const symOf = (J) => J.map((_, k) => 0.5 * (J[k] + J[3 * (k % 3) + Math.floor(k / 3)]));
export const antiOf = (J) => J.map((_, k) => 0.5 * (J[k] - J[3 * (k % 3) + Math.floor(k / 3)]));
/** 反対称の部分の軸のベクトル = ½ ∇ × u(J[a][b] = ∂u_a/∂x_b) */
export const axialOf = (J) => [0.5 * (J[7] - J[5]), 0.5 * (J[2] - J[6]), 0.5 * (J[3] - J[1])];
export const fro = (M) => Math.sqrt(M.reduce((s, x) => s + x * x, 0));
export const traceOf = (M) => M[0] + M[4] + M[8];
/** 対称 3 × 3 の固有の値と固有のベクトル(Jacobi —— 値の大きさの降順) */
export function eigSym(M) {
  const a = [[M[0], M[1], M[2]], [M[3], M[4], M[5]], [M[6], M[7], M[8]]], V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let it = 0; it < 60; it++) {
    let p = 0, q = 1, mx = Math.abs(a[0][1]);
    if (Math.abs(a[0][2]) > mx) { p = 0; q = 2; mx = Math.abs(a[0][2]); }
    if (Math.abs(a[1][2]) > mx) { p = 1; q = 2; mx = Math.abs(a[1][2]); }
    const sc = Math.abs(a[0][0]) + Math.abs(a[1][1]) + Math.abs(a[2][2]) + mx;
    if (!(mx > 1e-300) || mx < 1e-17 * sc) break;
    const th = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]), c = Math.cos(th), s = Math.sin(th);
    for (let k = 0; k < 3; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
    for (let k = 0; k < 3; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
    for (let k = 0; k < 3; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
  }
  const ev = [0, 1, 2].map((i) => ({ val: a[i][i], vec: [V[0][i], V[1][i], V[2][i]] }));
  ev.sort((x, y) => Math.abs(y.val) - Math.abs(x.val));
  return ev;
}

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  parts: Object.freeze(['M', 'S', 'MS']), nPhase: 72,
  /** 受け手(源) —— 8 惑星は太陽・地球は月も・月は地球と太陽(第351便c の PARENT_ROWS の約束 —— 月の太陽由来の行は Moon|Sun) */
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  pairs: Object.freeze(['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Earth|Moon', 'Mars|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun', 'Moon|EarthHi', 'Moon|Sun']),
  /** 歳差の率の表の受け手と源の組(源の組 'sun' = 太陽だけ・'sunMoon' = 太陽 + 月・'earthSun' = 地球 + 太陽) */
  rateRows: Object.freeze([['Earth', 'sun'], ['Earth', 'sunMoon'], ['Mars', 'sun'], ['Venus', 'sun'], ['Mercury', 'sun'], ['Moon', 'earthSun']]),
  srcSets: Object.freeze({ sun: Object.freeze(['Sun']), sunMoon: Object.freeze(['Sun', 'Moon']), earthSun: Object.freeze(['EarthHi', 'Sun']) }),
  cands: Object.freeze(['Ta', 'Tb', 'Tg']), candLabels: Object.freeze({ Ta: '(T-a) 向きの式', Tb: '(T-b) トルクの式', Tg: '(T-g) 重力の側の潮汐のトルク(比べる列)' }),
  senses: Object.freeze({ Ta: Object.freeze(['g2m', 'g2p']), Tb: Object.freeze(['nat', 'flip']), Tg: Object.freeze(['nat']) }),
  /** 単位の係数: (T-a) λ̃ = 1(λ = −H)・(T-b) η_d = 1 s⁻¹ */
  unit: Object.freeze({ lamT: 1, kappa: 1 }),
  /** 中心差分の歩幅(距離 a に対して)—— 自分の重みは中心の値に固めた場で数える(中心で勾配 0 なので同じ J) */
  cdStep: 1e-4,
  /** 一様な背景(回転だけ)の歪み 0 の試しの角速度 */
  uniformTest: Object.freeze([1e-12, -2e-12, 3e-12]),
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const LITKEY = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Moon: 'moon', Mars: 'mars', Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune' });
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);

/* ───────── 組の入力 ───────── */
/**
 * 組の入力(第351便c の pairInput と同じ約束)。'Earth|Moon'(受け手 = 地球・源 = 月)はこの lib で作る: 距離・相対の速さ・月の公転の北極は Moon|EarthHi の組・
 * 源の自転軸 = 月の自転軸・源の自転の率 = 月の自転の率(Moon|EarthHi の m2 の行)・受け手の自転軸 = 地球(Earth|Sun の w)。
 */
export function pairSpec(T1, GEO, id, src) {
  if (id === 'Earth' && src === 'Moon') {
    const P = SP.pairInput(T1, GEO, 'Moon', 'EarthHi'), r2 = T1.find((r) => r.id === 'Moon' && r.src === 'EarthHi' && r.mag === 'm2');
    return { id, src, m: C.massOf('Earth'), sHat: unit(GEO['Earth|Sun'].w), nHat: P.nHat, Ms: C.massOf('Moon'), sAx: P.sHat, ws: Math.abs(r2.omega), a: P.a, vOrb: P.vOrb, made: 'Moon|EarthHi から(距離・公転の北極・月の自転)' };
  }
  const P = SP.pairInput(T1, GEO, id, src);
  return { id, src, m: P.m, sHat: P.sHat, nHat: P.nHat, Ms: P.Ms, sAx: P.sAx, ws: P.ws, a: P.a, vOrb: P.vOrb, made: P.made };
}
const partScales = (part) => { if (part === 'M') return [1, 0]; if (part === 'S') return [0, 1]; if (part === 'MS') return [1, 1]; throw new RangeError('成分は M・S・MS'); };
/** 位相 ph の場(第351便c の partRot と同じ置き方 —— 受け手は原点・源は −a r̂)。frozen = 自分の重みを中心の値に固めた場(中心差分の口) */
function fieldAt(Pp, ph, { part, extraW = 0, frozen = false, mut = null }) {
  const [vs, ss] = partScales(part), Rr = G3.YK * Pp.m, Rs = G3.YK * Pp.Ms;
  const x0 = crs(Pp.sAx, Pp.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(Pp.nHat)[0], y = crs(Pp.nHat, x);
  const rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(Pp.nHat, rh), A0 = Pp.m * DK.Kball(1, 0, Rr);
  const f = G3.makeField3({ sources: [{ m: Pp.Ms, R: Rs, p: scl(rh, -Pp.a), v: [0, 0, 0], spin: scl(Pp.sAx, Pp.ws * ss) }], recv: { m: Pp.m, R: Rr, p: [0, 0, 0], v: scl(vh, Pp.vOrb * vs) },
    W0: 0, extraW: frozen ? extraW + A0 : extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: !frozen, mut });
  return { f, rh, vh, Rr };
}
/** 中心差分の勾配のテンソル(自分の重みを中心の値に固めた場・歩幅 h) */
export function jacCD(field, h) {
  const J = new Array(9);
  for (let b = 0; b < 3; b++) {
    const e = [0, 0, 0]; e[b] = h;
    const up = field.u(e), um = field.u(scl(e, -1));
    for (let a = 0; a < 3; a++) J[3 * a + b] = (up[a] - um[a]) / (2 * h);
  }
  return J;
}

/* ───────── 歪みの率 ───────── */
/**
 * 組 1 つ・成分 1 つの勾配のテンソル(受け手の中心・位相ごとと 1 公転の平均)。返す: Javg・Eavg(歪み)・Wavg(反対称の軸のベクトル = (W) の読み)・
 * ePhaseRms(位相ごとの abs(E) の 2 乗平均の根 —— 平均で消える分を含む大きさ)・eig(Eavg の主軸)・cd(true なら中心差分の J も平均して返す)・
 * sAx(源の自転軸を置き換える試しの口 —— 既定は組の値)。
 */
export function strainOf(T1, GEO, id, src, { part, extraW = 0, nPhase = DECL.nPhase, cd = false, mut = null, sAx = null } = {}) {
  const P0 = pairSpec(T1, GEO, id, src), Pp = sAx ? { ...P0, sAx: unit(sAx) } : P0;
  let Jm = new Array(9).fill(0), Jc = cd ? new Array(9).fill(0) : null, e2 = 0, w2 = 0;
  for (let k = 0; k < nPhase; k++) {
    const ph = 2 * Math.PI * (k + 0.5) / nPhase, { f } = fieldAt(Pp, ph, { part, extraW, mut }), J = f.J([0, 0, 0]);
    Jm = Jm.map((v, i) => v + J[i] / nPhase);
    const Ek = symOf(J); e2 += fro(Ek) ** 2 / nPhase; w2 += nrm(axialOf(J)) ** 2 / nPhase;
    if (cd) { const fz = fieldAt(Pp, ph, { part, extraW, frozen: true, mut }).f, Jz = jacCD(fz, DECL.cdStep * Pp.a); Jc = Jc.map((v, i) => v + Jz[i] / nPhase); }
  }
  const Eavg = symOf(Jm);
  return { id, src, part, Javg: Jm, Eavg, Wavg: axialOf(Jm), eAvg: fro(Eavg), ePhaseRms: Math.sqrt(e2), wPhaseRms: Math.sqrt(w2), eig: eigSym(Eavg), Jcd: Jc, sHat: Pp.sHat, nHat: Pp.nHat, a: Pp.a, nOrb: Pp.vOrb / Pp.a, Ms: Pp.Ms };
}
/** 源の自転軸と受け手の公転の北極の角の sin(1 公転の平均で残る (S) の歪みの物差し) */
export function srcTiltSin(T1, GEO, id, src) { const P = pairSpec(T1, GEO, id, src); return nrm(crs(unit(P.sAx), unit(P.nHat))); }
/** 対数の最小二乗の傾き(距離のべき) */
export function logSlope(xs, ys) {
  const p = xs.map((x, k) => [Math.log(x), Math.log(ys[k])]).filter(([a, b]) => fin(a) && fin(b)), n = p.length;
  if (n < 2) return null;
  const mx = p.reduce((t, q) => t + q[0], 0) / n, my = p.reduce((t, q) => t + q[1], 0) / n;
  return p.reduce((t, q) => t + (q[0] - mx) * (q[1] - my), 0) / p.reduce((t, q) => t + (q[0] - mx) ** 2, 0);
}
/** 受け手の行の分母の他の重み(第351便c の pairParts の約束 —— 地球の月由来は太陽の重み・月の地球由来は太陽の重み・月の太陽由来は地球の重み・ほかは 0) */
export function extraWOf(T1, GEO, id, src) {
  const wAt = (i, s) => { const P = pairSpec(T1, GEO, i, s); return P.Ms * DK.Kball(1, P.a, G3.YK * P.Ms); };
  if (id === 'Earth' && src === 'Moon') return wAt('Earth', 'Sun');
  if (id === 'Moon' && src === 'EarthHi') return wAt('Moon', 'Sun');
  if (id === 'Moon' && src === 'Sun') return wAt('Moon', 'EarthHi');
  return 0;
}
/** 一様な背景(角速度 Ω の剛体の回転の場 u = Ω × x と一様な並進 u = c)の勾配のテンソル —— 解析の形(歪み 0 の試し) */
export function uniformJ(Om, c = [0, 0, 0]) { void c; return [0, -Om[2], Om[1], Om[2], 0, -Om[0], -Om[1], Om[0], 0]; }

/* ───────── 構造の量 ───────── */
/** H = J2 ÷ 慣性モーメントの係数(リポジトリの数 —— 無い量は null)・自転の率 ω(第352便q の structOf) */
export function shapeOf(T1, GEO, id) {
  const lit = W330.DECL.lit, k = LITKEY[id], J2 = k && fin(lit.J2[k]) ? lit.J2[k] : null, moi = k && fin(lit.moi[k]) ? lit.moi[k] : null, S = Q.structOf(T1, GEO, id);
  return { id, J2, moi, H: J2 !== null && moi !== null ? J2 / moi : null, omega: S.omega, n: S.n };
}

/* ───────── 式の候補 ───────── */
/** (T-a): τ = λ (E ŝ − (ŝ·E ŝ) ŝ)・λ = −λ̃ H。sense 'g2m' → ŝ × τ・'g2p' → τ × ŝ。'tilt' → τ そのもの(90° ずらす前) */
export function tA(sHat, Em, { H, lamT = DECL.unit.lamT, sense }) {
  if (!fin(H)) return null;
  const s = unit(sHat), Es = mv(Em, s), tau = scl(sub(Es, scl(s, dot(s, Es))), -lamT * H);
  if (sense === 'tilt') return tau;
  if (sense === 'g2m') return crs(s, tau);
  if (sense === 'g2p') return crs(tau, s);
  throw new RangeError('tA: sense は g2m・g2p・tilt');
}
/** (T-b): dŝ/dt = −η_d (H ÷ ω) ŝ × (E ŝ)('nat')・反転の列 'flip'。ω は自転の率の大きさ(ŝ は角運動量の向き) */
export function tB(sHat, Em, { H, omega, kappa = DECL.unit.kappa, sense = 'nat' }) {
  if (!fin(H) || !(fin(omega) && omega > 0)) return null;
  const s = unit(sHat), v = scl(crs(s, mv(Em, s)), -kappa * H / omega);
  if (sense === 'nat') return v; if (sense === 'flip') return scl(v, -1);
  throw new RangeError('tB: sense は nat・flip');
}
/** 1 公転の平均の重力の潮汐のテンソル T = (G M ÷ a³)(3 (I − n̂n̂) ÷ 2 − I) */
export function tideAvg(GM, a, nHat) {
  const n = unit(nHat), g = GM / (a * a * a), T = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) T[3 * i + j] = g * (1.5 * ((i === j ? 1 : 0) - n[i] * n[j]) - (i === j ? 1 : 0));
  return T;
}
/** (T-g): (T-b) のトルクの式に η_d E → T(1 公転の平均)を入れた形 */
export function tG(sHat, srcs, { H, omega }) {
  if (!fin(H) || !(fin(omega) && omega > 0)) return null;
  let T = new Array(9).fill(0);
  for (const s of srcs) { const t = tideAvg(s.GM, s.a, s.nHat); T = T.map((v, i) => v + t[i]); }
  return tB(sHat, T, { H, omega, kappa: 1, sense: 'nat' });
}
/** 源の組の重力の入力(G M・距離・公転の北極 —— 第351便c の pairInput の距離の約束: a = G Ms ÷ (β c²)) */
export function gravSrcs(T1, GEO, id, set) {
  return DECL.srcSets[set].map((src) => {
    const key = id === 'Earth' && src === 'Moon' ? ['Earth', 'Moon'] : [id, src], P = pairSpec(T1, GEO, key[0], key[1]);
    return { src, GM: G * P.Ms, a: P.a, nHat: P.nHat };
  });
}
/** 源の組の歪み(成分 part —— 平均の E の和)。地球の月由来は 'Earth|Moon'・月は Moon|EarthHi と Moon|Sun */
export function strainSet(T1, GEO, id, set, part, cache = null) {
  let Em = new Array(9).fill(0);
  for (const src of DECL.srcSets[set]) {
    const ck = 'E|' + id + '|' + src + '|' + part;
    let S = cache && cache[ck];
    if (!S) { S = strainOf(T1, GEO, id, src, { part, extraW: extraWOf(T1, GEO, id, src) }); if (cache) cache[ck] = S; }
    Em = Em.map((v, i) => v + S.Eavg[i]);
  }
  return Em;
}
/** 受け手の自転軸・公転の北極(月は Moon|EarthHi の組) */
export function axesOf(T1, GEO, id) {
  const P = id === 'Moon' ? SP.pairInput(T1, GEO, 'Moon', 'EarthHi') : SP.pairInput(T1, GEO, id, 'Sun');
  return { sHat: unit(P.sHat), nHat: unit(P.nHat) };
}
/** 歳差の率の 1 行(受け手・源の組・候補・向き・成分): dŝ/dt と、公転の北極・黄道の極のまわりの方位の率と傾きの率(″/年 —— 第352便d の poleRates) */
export function rateOf(T1, GEO, id, set, cand, sense, { part = 'S', lamT = DECL.unit.lamT, kappa = DECL.unit.kappa } = {}, cache = null) {
  const sh = shapeOf(T1, GEO, id), ax = axesOf(T1, GEO, id);
  let ds = null;
  if (cand === 'Tg') ds = tG(ax.sHat, gravSrcs(T1, GEO, id, set), sh);
  else {
    const Em = strainSet(T1, GEO, id, set, part, cache);
    ds = cand === 'Ta' ? tA(ax.sHat, Em, { H: sh.H, lamT, sense }) : cand === 'Tb' ? tB(ax.sHat, Em, { H: sh.H, omega: sh.omega, kappa, sense }) : null;
    if (ds === undefined) throw new RangeError('rateOf: 候補は Ta・Tb・Tg');
  }
  if (ds === null) return { id, set, cand, sense, part, ds: null, H: sh.H, omega: sh.omega, mag: null, az: { orb: null, ecl: null }, inc: { orb: null, ecl: null } };
  const az = {}, inc = {};
  for (const [p, v] of [['orb', ax.nHat], ['ecl', [0, 0, 1]]]) { const r = D.poleRates(v, ax.sHat, ds); az[p] = r === null ? null : r.az * ASYR; inc[p] = r === null ? null : r.inc * ASYR; }
  return { id, set, cand, sense, part, ds, H: sh.H, omega: sh.omega, mag: nrm(ds) * ASYR, az, inc };
}
/** 比べる数(第352便q の refRate —— 地球・火星・金星は仮の値・水星と月はリポジトリの値)と、要る係数 = 比べる数 ÷ abs(方位の率)(地球は黄道の極・ほかは公転の北極) */
export function needRow(T1, GEO, id, set, cand, sense, o = {}, cache = null) {
  const R = Q.refRate(id), r = rateOf(T1, GEO, id, set, cand, sense, o, cache), pole = id === 'Earth' ? 'ecl' : 'orb', az = r.az[pole];
  const row = { id, set, cand, sense, part: r.part, ref: R.rate, kind: R.kind, pole, az, need: fin(az) && az !== 0 ? R.rate / Math.abs(az) : null, overRef: fin(az) ? Math.abs(az) / R.rate : null,
    retro: fin(az) ? az < 0 : null };
  return R.kind === 'prov' ? B.tagProv(row, [R.provKey]) : row;
}
/** (ウ′) の物差しを源の組で: X = Σ (G M ÷ a³) × J2 ÷ (ω × 慣性モーメントの係数)(太陽だけなら第352便q の candOf の uJ と同じ) */
export function uJSet(T1, GEO, id, set) {
  const sh = shapeOf(T1, GEO, id);
  if (sh.H === null) return null;
  return gravSrcs(T1, GEO, id, set).reduce((t, s) => t + s.GM / (s.a ** 3), 0) * sh.H / sh.omega;
}
export const spreadOf = Q.spreadOf;

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {};
  // ① 反対称の部分の軸のベクトル(位相の平均)= 第351便c の partRot の中心の読み (W)(地球・火星 × 成分 3)
  let antiW = 0;
  for (const id of ['Earth', 'Mars']) for (const part of DECL.parts) {
    const S = strainOf(T1, GEO, id, 'Sun', { part }), R = SP.partRot(T1, GEO, id, 'Sun', { part, read: 'W' }).Om;
    antiW = Math.max(antiW, nrm(sub(S.Wavg, R)) / nrm(R));
  }
  // ② 1 つの位相で、反対称の部分 = 第348便h の rot3('W')(地球・(MS))
  const Pp = pairSpec(T1, GEO, 'Earth', 'Sun'), fa = fieldAt(Pp, 0.3, { part: 'MS' });
  const rotOne = nrm(sub(axialOf(fa.f.J([0, 0, 0])), G3.rot3('W', fa.f, [0, 0, 0], { Rb: fa.Rr }))) / nrm(G3.rot3('W', fa.f, [0, 0, 0], { Rb: fa.Rr }));
  // ③ 中心差分(自分の重みを中心の値に固めた場)= 解析の J(地球 (M)・(S) —— 位相の平均の J の相対の差)
  const cdM = strainOf(T1, GEO, 'Earth', 'Sun', { part: 'M', cd: true, nPhase: 12 }), cdS = strainOf(T1, GEO, 'Earth', 'Sun', { part: 'S', cd: true, nPhase: 12 });
  const cdErr = Math.max(...[cdM, cdS].map((S) => { let worst = 0; const sc = fro(S.Jcd); for (let i = 0; i < 9; i++) worst = Math.max(worst, Math.abs(S.Jcd[i] - S.Javg[i]) / sc); return worst; }));
  // ④ 一様な並進の場・剛体の回転の場では歪み 0(解析の形と、数値の場 —— 源の重みが一様な極限の代わりに、u = c と u = Ω × x を中心差分で)
  const Ut = DECL.uniformTest, Ju = uniformJ(Ut), eUni = fro(symOf(Ju)) / fro(Ju);
  const rigid = { u: (x) => crs(Ut, x) }, trans = { u: () => [3, -1, 2] };
  const eRigid = fro(symOf(jacCD(rigid, 1e3))) / nrm(Ut), eTrans = fro(jacCD(trans, 1e3));
  const wRigid = nrm(sub(axialOf(jacCD(rigid, 1e3)), Ut)) / nrm(Ut);
  // ⑤ 球(扁平 0 → H 0)では (T-a)(T-b) とも 0・(T-g) も 0
  const Ee = strainSet(T1, GEO, 'Earth', 'sun', 'S', cache), sE = axesOf(T1, GEO, 'Earth').sHat;
  const sphere = [tA(sE, Ee, { H: 0, sense: 'g2m' }), tB(sE, Ee, { H: 0, omega: 7e-5 }), tG(sE, gravSrcs(T1, GEO, 'Earth', 'sun'), { H: 0, omega: 7e-5 })].map(nrm);
  // ⑥ (T-g) の太陽だけ = 第330便a の precessionSolar(e 0・傾き = 公転の北極との角)の大きさ(地球・火星・金星・水星)
  let tgErr = 0;
  for (const id of ['Earth', 'Mars', 'Venus', 'Mercury']) {
    const sh = shapeOf(T1, GEO, id), ax = axesOf(T1, GEO, id), ds = tG(ax.sHat, gravSrcs(T1, GEO, id, 'sun'), sh), sinE = nrm(crs(ax.nHat, ax.sHat));
    const P = gravSrcs(T1, GEO, id, 'sun')[0], nO = Math.sqrt(P.GM / P.a ** 3);
    const ref = W330.precessionSolar({ n: nO, e: 0, s: sh.omega, J2: sh.J2, Cbar: sh.moi, obliqRad: Math.acos(Math.max(-1, Math.min(1, dot(ax.nHat, ax.sHat)))) });
    tgErr = Math.max(tgErr, Math.abs(nrm(ds) / sinE / ref - 1));
  }
  // ⑦ (ウ′) の太陽だけの物差し = 第352便q の candOf の uJ(地球・火星・金星)
  let uJErr = 0;
  for (const id of ['Earth', 'Mars', 'Venus']) uJErr = Math.max(uJErr, Math.abs(uJSet(T1, GEO, id, 'sun') / Q.candOf(T1, GEO, id, { bg: 'Np', axis: 'L', tSrc: 0, u: 1 }).uJ - 1));
  // ⑧ (T-a) の (g2−) と (T-b) は同じ線の上(向きは λ の符号と η_d で決まる —— 大きさの比 = ω ÷ η_d)
  const shE = shapeOf(T1, GEO, 'Earth'), a1 = tA(sE, Ee, { H: shE.H, sense: 'g2m' }), b1 = tB(sE, Ee, { H: shE.H, omega: shE.omega });
  const lineErr = nrm(crs(unit(a1), unit(b1))), magRatio = nrm(a1) / nrm(b1) / shE.omega;
  // ⑨ 入力の拒否
  const rej = [() => strainOf(T1, GEO, 'Earth', 'Sun', { part: 'X' }), () => tA(sE, Ee, { H: 1, sense: 'x' }), () => tB(sE, Ee, { H: 1, omega: 1, sense: 'x' }), () => pairSpec(T1, GEO, 'Earth', 'Jupiter')]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError || e instanceof TypeError; } });
  // ⑩ 固有の分解の自己試験(作った対称のテンソル)
  const Mt = [2, 1, 0, 1, 3, 0.5, 0, 0.5, -1], ev = eigSym(Mt), eigErr = Math.max(...ev.map((e) => nrm(sub(mv(Mt, e.vec), scl(e.vec, e.val))))), trErr = Math.abs(ev.reduce((s, e) => s + e.val, 0) - traceOf(Mt));
  return { antiW, rotOne, cdErr, eUni, eRigid, eTrans, wRigid, sphere, tgErr, uJErr, lineErr, magRatio, rejects: rej, eigErr, trErr };
}
export function pureGates(S) {
  return {
    antiIsW: S.antiW < 1e-9,
    antiIsRot3: S.rotOne < 1e-12,
    cdMatches: S.cdErr < 1e-6,
    uniformZero: S.eUni === 0 && S.eRigid < 1e-12 && S.eTrans === 0 && S.wRigid < 1e-9,
    sphereZero: S.sphere.every((x) => x === 0),
    tgIsSolar: S.tgErr < 1e-12,
    uJIsQ: S.uJErr < 1e-12,
    taTbLine: S.lineErr < 1e-9 && Math.abs(S.magRatio - 1) < 1e-12,
    rejects: S.rejects.length === 4 && S.rejects.every(Boolean),
    eig: S.eigErr < 1e-12 && S.trErr < 1e-12,
  };
}

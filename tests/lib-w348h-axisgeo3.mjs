// 第348便h(原仮定者の指示(2026-11-23 —— 第145報の補足 2)・統括の検証項目 R416):
//   **軸引きずりの候補の回転を geoPN=3(慣性決定力の引きずり)の場で作り直す —— 場の形(重み・分母に自分を含む・背景 W₀・受け手の速度を引く・源の回転の分の落ち方)、
//   候補 (P2)・(W) の閉じた形と〔第347便h〕の場(引きずり近似 = geoPN=2 の形)との対応、天体 15 組の由来ごとの回転と〔第348便c〕の重みの型の合成・δ・歳差の率・係数 c_R の入り方、
//   エネルギーの行き先「慣性回転」と「引きずり回転」の 2 列の比較(〔第348便b〕の步の形の上)の純関数 —— 診断だけ**
//   (器 tests/exp-w348h-axisgeo3.mjs と QA behavior.axisgeo3_348h・docs.axisgeo3_348h が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第347便h(makeField・rotOf・curlOf・bodyRows)・第348便b(stepRun・case1Rows・bodyRows・DECL)・第348便c(composeAll・precess・massOf・radiusOf・
//   galDistM・balanceRows・makeBase・LIT)・第347便i(bodyRows・DECL)・第347便e(DECL.pairs・geometry・t1Table・observedRates)・第312便a(Kball・KballDr・Mball・MballDr・C1_CLOSED)・
//   第342便e(galUnit)・第341便f(熱の物差し)・第337便c(GALAXY・定数)。
//
// ■ geoPN=3 の場(今のアプリの新則 —— 公開の〔第309便a〕〔第310便c〕〔第312便a〕〔第313便a〕の式を、受け手の部位の点 x で書き下した形):
//   u(x) = [Σ_j W_j(x) (V_j − v_i) + Σ_j T_j(x)] ÷ W(x)・W(x) = W₀ + W_ii(x) + Σ_j W_j(x)(分母に自分を含む —— 自分の分子は 0)。
//   重み W_j(x) = m_j K_α(r_j; R_j)(K1: 外部 1/r・内部 (3R² − r²)/(2R³)/K2: 体積平均の 1/r² —— 〔第312便a〕の lib の Kball)・W_ii(x) = m_i K_α(abs(x − p_i); R_i)。
//   源の回転の分 T_j = s_j(r)(Ω_j × ρ)(ρ = x − p_j): (M) アプリの球のモーメント s = m M_α(r) ÷ r(K1 外部 M1 = R²/(5r²) —— 落ち方 (R/r)²/5)/
//   (q) 引きずり近似の形 s = W_j (R/(R + r))^q(q 0 は落ち方なし —— 源の枠の剛体の回転)。
//   受け手の半径 R_i: (rule) R_i = Y_k m_i(〔第313便a〕の規則 —— Y_k = 10 G ÷ (C₁ c²))/(cR) R_i = c_R R_obs/(cap) K2 の R_i = min(R_obs, 6.5e6 m)(〔第309便a〕の既定)。
// ■ 候補の回転(〔第347便h〕の rotOf を呼ぶ): (W) 中心の ½ ∇×u(自分の重みの勾配は中心で 0)/(P2) 2 点の差分 —— 腕 R_b ≪ 距離では ê × (J ê) の極限で、
//   自分の重みだけは腕の点の値 W_ii(R_b)(両側で同じ値)に置く(丸めに負けないため —— 零試験で有限の腕と照合)。
// ■ 自転しない源が相対速度 c = V_j − v_i で動くとき((W)・自分の重みと背景は中心で一定 A): Ω = ½ A ∇W_j × c ÷ (A + W_j)²
//   (円の道では Ω = ½ (A W_j ÷ (A + W_j)²) n_orb ĥ —— 自分の重みが支配するとき ½ β n_orb・β = W_j ÷ A)。
// ■ 言わないこと: geoPN=3 の場の軸引きずり・歳差・行き先・型の答えとは書かない。この場の形・この候補・このノブでは、の表。
//   観測の値は固定の比べる列(合わせない)。文献の値はリポジトリの中の値(文献の値・未照合)。
import * as H from './lib-w347h-axisdiff.mjs';
import * as B from './lib-w348b-spinreset.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as I from './lib-w347i-axisenergy.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as F from './lib-w341f-gyroheat.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w348h-axisgeo3-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI, AS = 180 * 3600 / Math.PI;
/** 引きずり係数 Y_k = 10 G ÷ (C₁ c²)(〔第313便a〕の一次の値 —— 計算式の一覧の EQ-14) */
export const YK = 10 * G / (D.C1_CLOSED * C0 * C0);
export const CAP_M = 6.5e6;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  cands: Object.freeze(['W', 'P2']),
  /** 天体の表の場の組(主 = 在位の K1 + 規則の R_d・源の回転はアプリの球のモーメント) */
  combos: Object.freeze([
    Object.freeze({ id: 'K1rM', al: 1, self: 'rule', rot: 'M', note: '在位の K1 + 規則の半径・源の回転は球のモーメント(アプリの形)' }),
    Object.freeze({ id: 'K1rQ0', al: 1, self: 'rule', rot: 'q0', note: '同じ場・源の回転は落ち方なし(源の枠の剛体の回転)' }),
    Object.freeze({ id: 'K1cM', al: 1, self: 'cR', cR: 1, rot: 'M', note: '引きずられ半径 = 観測半径(c_R 1)' }),
    Object.freeze({ id: 'K2capM', al: 2, self: 'cap', rot: 'M', note: 'K2・既定の半径 min(R_obs, 6.5e6 m)(〔第309便a〕)' }),
  ]),
  mainCombo: 'K1rM',
  /** 背景 W₀ = k × 自分の重みの中心の値(K1 の規則では 3 ÷ (2 Y_k)) */
  w0k: Object.freeze([0, 1]),
  cR: Object.freeze([0.5, 1, 2]), cRbodies: Object.freeze(['Earth', 'Jupiter', 'Moon', 'Io']),
  nPhase: 72, nGal: 8, galDOverR: C.DECL.galDOverR,
  /** T2 無次元の例(〔第347便h〕と同じ: 源 m 1・R 1・受け手 R_b 0.1) */
  dim: Object.freeze({ Rb: 0.1, d: Object.freeze([3, 10, 30]), lat: Object.freeze([0, 30, 60, 90]), selfA: Object.freeze([0, 1, 100]), w0: Object.freeze([0, 1]), v: 0.1, q: Object.freeze([0, 2, 3]) }),
  /** T4 行き先の 2 列(〔第348便b〕の割合 [h, a_in, a_dr])と型 × 行き先 */
  dests: Object.freeze({ inertial: Object.freeze([0, 1, 0]), drag: Object.freeze([0, 0, 1]) }),
  kinds: Object.freeze([['S1', 'E1'], ['S1', 'E2'], ['S1', 'E3'], ['S2p', 'E2']]),
  bodies4: I.DECL.bodies,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
/** 文献の値(固定の比べる列 —— 合わせない) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料に当たっていない)',
  precArcsecPerYr: C.LIT.precArcsecPerYr, precRole: C.LIT.precRole, precSrc: C.LIT.precSrc, galaxy: TL.GALAXY, heat: F.LIT.heat,
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
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
/** 軸との角の丸めの床(1e-9° 以下は 0 —— 平行・反平行の丸めの残りを書かない) */
const snapA = (d) => (d <= 1e-9 ? 0 : d >= 180 - 1e-9 ? 180 : d);

/* ───────── 核 ───────── */
/** 重みの核 K(r)・dK/dr。kernel: {kind:'ball', al:1|2} | {kind:'pt', pw}(点の冪 —— 〔第347便h〕の照合だけ) */
function kerK(kernel, r, R) {
  if (kernel.kind === 'pt') return [Math.pow(r, -kernel.pw), -kernel.pw * Math.pow(r, -kernel.pw - 1)];
  return [D.Kball(kernel.al, r, R), D.KballDr(kernel.al, r, R)];
}

/* ───────── geoPN=3 の場 ───────── */
/**
 * 場を作る。sources: [{m, R, p:[3], v:[3], spin:[3](Ω_j のベクトル), numer?(false で分母だけ)}]・recv: {m, R, p:[3], v:[3]}(self:false なら m は読まない)・
 * W0(背景)・extraW(他の源の重みの定数 —— 分母だけ)・kernel・rot: {form:'M'} | {form:'q', q}・self(自分の重みを分母に)・mut(変異: 'absVel' 受け手の速度を引かない・'rotSign')。
 * 戻り値 { u(x), J(x, o), W(x) } —— J(x, {selfR}) は自分の重みを半径 selfR の値(勾配 0)に置く(P2 の極限の口)。
 */
export function makeField3({ sources = [], recv = null, W0 = 0, extraW = 0, kernel = { kind: 'ball', al: 1 }, rot = { form: 'M' }, self = true, mut = null } = {}) {
  if (!(Array.isArray(sources) && sources.every((s) => fin(s.m) && s.m >= 0 && fin(s.R) && s.R > 0 && isVec(s.p) && isVec(s.v) && isVec(s.spin))))
    throw new RangeError('makeField3: 源(m ≥ 0・R > 0・p・v・spin)');
  if (!(recv && isVec(recv.p) && isVec(recv.v) && (!self || (fin(recv.m) && recv.m > 0 && fin(recv.R) && recv.R > 0)))) throw new RangeError('makeField3: 受け手(p・v・自分の重みには m > 0・R > 0)');
  if (!(fin(W0) && W0 >= 0 && fin(extraW) && extraW >= 0)) throw new RangeError('makeField3: W₀ ≥ 0・extraW ≥ 0');
  if (!(kernel && ((kernel.kind === 'ball' && (kernel.al === 1 || kernel.al === 2)) || (kernel.kind === 'pt' && fin(kernel.pw) && kernel.pw > 0)))) throw new RangeError('makeField3: 核は ball(α 1・2)か pt');
  if (!(rot && (rot.form === 'M' || (rot.form === 'q' && fin(rot.q) && rot.q >= 0)))) throw new RangeError('makeField3: 源の回転の形は M か q(q ≥ 0)');
  if (rot.form === 'M' && kernel.kind !== 'ball') throw new RangeError('makeField3: 球のモーメント M は ball の核だけ');
  if (self && kernel.kind !== 'ball') throw new RangeError('makeField3: 自分の重みは ball の核だけ');
  const vr = mut === 'absVel' ? [0, 0, 0] : recv.v, sg = mut === 'rotSign' ? -1 : 1;
  const term = (s, x) => {
    const rho = sub(x, s.p), r = nrm(rho), n = r > 0 ? scl(rho, 1 / r) : [0, 0, 0], [K, dK] = kerK(kernel, r, s.R), w = s.m * K, gw = scl(n, s.m * dK);
    if (s.numer === false) return { w, gw, P: [0, 0, 0], dP: new Array(9).fill(0) };
    const c = sub(s.v, vr), Om = scl(s.spin, sg), oxr = crs(Om, rho);
    let sv = 0, sd = 0;
    if (nrm(Om) > 0) {
      if (rot.form === 'M') { const M = D.Mball(kernel.al, r, s.R), dM = D.MballDr(kernel.al, r, s.R); sv = s.m * M / r; sd = s.m * (dM / r - M / (r * r)); }
      else { const g = Math.pow(s.R / (s.R + r), rot.q), dg = -rot.q * g / (s.R + r); sv = w * g; sd = s.m * dK * g + w * dg; }
    }
    const P = add(scl(c, w), scl(oxr, sv)), Ex = [0, -Om[2], Om[1], Om[2], 0, -Om[0], -Om[1], Om[0], 0], dP = new Array(9);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) dP[3 * a + b] = c[a] * gw[b] + sd * n[b] * oxr[a] + sv * Ex[3 * a + b];
    return { w, gw, P, dP };
  };
  const selfAt = (x, selfR) => {
    if (!self) return { w: 0, gw: [0, 0, 0] };
    if (fin(selfR)) return { w: recv.m * D.Kball(kernel.al, selfR, recv.R), gw: [0, 0, 0] };
    const rho = sub(x, recv.p), r = nrm(rho), n = r > 0 ? scl(rho, 1 / r) : [0, 0, 0], [K, dK] = kerK(kernel, r, recv.R);
    return { w: recv.m * K, gw: scl(n, recv.m * dK) };
  };
  const eval0 = (x, selfR, grad) => {
    const sf = selfAt(x, selfR); let W = W0 + extraW + sf.w, Pv = [0, 0, 0], dW = sf.gw.slice(); const dP = new Array(9).fill(0);
    for (const s of sources) { const T = term(s, x); W += T.w; Pv = add(Pv, T.P); if (grad) { for (let k = 0; k < 9; k++) dP[k] += T.dP[k]; dW = add(dW, T.gw); } }
    return { W, Pv, dP, dW };
  };
  const u = (x) => { const e = eval0(x, null, false); return e.W > 0 ? scl(e.Pv, 1 / e.W) : [0, 0, 0]; };
  const J = (x, o = {}) => {
    const e = eval0(x, o.selfR, true); if (!(e.W > 0)) return new Array(9).fill(0);
    const uu = scl(e.Pv, 1 / e.W), out = new Array(9);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) out[3 * a + b] = (e.dP[3 * a + b] - uu[a] * e.dW[b]) / e.W;
    return out;
  };
  const Wf = (x) => eval0(x, null, false).W;
  return { u, J, W: Wf };
}
/** (P2) の腕 ≪ 距離の極限: ê × (J ê)・自分の重みは腕の点の値 */
export function p2Lim(field, rc, e, Rb) { const J = field.J(rc, { selfR: Rb }), Je = [J[0] * e[0] + J[1] * e[1] + J[2] * e[2], J[3] * e[0] + J[4] * e[1] + J[5] * e[2], J[6] * e[0] + J[7] * e[1] + J[8] * e[2]]; return crs(e, Je); }
/** 候補の回転(W は〔第347便h〕の rotOf・P2 は lim なら極限・そうでなければ〔第347便h〕の rotOf の有限の腕) */
export function rot3(cand, field, rc, { e, Rb, lim = true } = {}) {
  if (cand === 'W') return H.rotOf('W', field, rc, { Rb }).Om;
  if (cand === 'P2') return lim ? p2Lim(field, rc, unit(e), Rb) : H.rotOf('P2', field, rc, { e, Rb }).Om;
  throw new RangeError('rot3: 候補は W・P2');
}

/* ───────── T2 無次元の例(源 1 つ —— 〔第347便h〕の (i)(ii) の場面を geoPN=3 の場で)───────── */
/**
 * 自分の重み A(中心の値 —— 受け手は R_b の K1 の球・質量 A × 2R_b/3 で中心 A)× 背景 W₀ × 源の回転の形。
 * (i) 自転する源(静止・軸 +z)の赤道 lat 0 と軸 lat 90 の (W)・(P2)/(ii) 自転しない源の通過の中心での (W) の閉じた形の照合は零試験。
 */
export function dimRows() {
  const Dm = DECL.dim, out = [], zh = [0, 0, 1];
  for (const A of Dm.selfA) for (const W0 of Dm.w0) for (const q of [...Dm.q, 'M']) for (const d of Dm.d) for (const lat of [0, 90]) {
    const rh = [Math.cos(lat * D2R), 0, Math.sin(lat * D2R)], rc = scl(rh, d), rot = q === 'M' ? { form: 'M' } : { form: 'q', q };
    const recv = { m: Math.max(A, 1e-300) * 2 * Dm.Rb / 3, R: Dm.Rb, p: rc, v: [0, 0, 0] };
    const fS = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 0, 0], spin: zh }], recv, W0, kernel: { kind: 'ball', al: 1 }, rot, self: A > 0 });
    // 自転しない源が受け手の横を速さ v で動く(受け手は静止 —— 相対速度 c = v ŷ × …: 源の速度 (0, v, 0)・距離 d の赤道/軸)
    const fT = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, Dm.v, 0], spin: [0, 0, 0] }], recv, W0, kernel: { kind: 'ball', al: 1 }, rot, self: A > 0 });
    const W = rot3('W', fS, rc, { Rb: Dm.Rb }), P2 = rot3('P2', fS, rc, { e: rh, Rb: Dm.Rb }), WT = rot3('W', fT, rc, { Rb: Dm.Rb }), P2T = rot3('P2', fT, rc, { e: rh, Rb: Dm.Rb });
    const tiny = (v, s) => (Math.abs(v) <= 1e-12 * s ? 0 : v), sS = 1 / d, sT = Dm.v / d;
    out.push({ selfA: A, W0, q, d, lat, spinW: tiny(dot(W, zh), sS), spinWperp: tiny(nrm(sub(W, scl(zh, dot(W, zh)))), sS), spinP2: tiny(dot(P2, zh), sS), spinP2perp: tiny(nrm(sub(P2, scl(zh, dot(P2, zh)))), sS),
      transW: tiny(nrm(WT), sT), transWz: tiny(WT[2], sT), transP2: tiny(nrm(P2T), sT), beta: 1 / (1 + (W0 + A) * d) });
  }
  return out;
}
/** (W) の閉じた形(自転しない源・相対速度 c・中心で一定の A): Ω = ½ A ∇W_j × c ÷ (A + W_j)² */
export function closedTransW({ A, mj, rho, c, al = 1, R = 1 }) {
  const r = nrm(rho), n = scl(rho, 1 / r), w = mj * D.Kball(al, r, R), gw = scl(n, mj * D.KballDr(al, r, R));
  return scl(crs(gw, c), 0.5 * A / ((A + w) * (A + w)));
}

/* ───────── T3 天体 15 組 ───────── */
function recvOf(id, combo, cRv) {
  const m = C.massOf(id), Ro = C.radiusOf(id), R = combo.self === 'rule' ? YK * m : combo.self === 'cap' ? Math.min(Ro, CAP_M) : (fin(cRv) ? cRv : combo.cR) * Ro;
  return { m, Ro, R };
}
function srcR(sid, combo) { const m = C.massOf(sid), Ro = C.radiusOf(sid); return combo.self === 'cap' ? Math.min(Ro, CAP_M) : combo.rot === 'q0' ? Ro : YK * m; }
const kernelOf = (combo) => ({ kind: 'ball', al: combo.al });
const rotFormOf = (combo) => (combo.rot === 'M' ? { form: 'M' } : { form: 'q', q: 0 });
/** 受け手の中心の重み(自分)・源の中心の重み(円の道の距離 a)—— 分母の定数の素 */
function selfCenterW(rv, combo) { return rv.m * D.Kball(combo.al, 0, rv.R); }
/** 由来 1 つの回転(受け手は原点・源は −a r̂・1 公転の平均)。extraW は他の由来の重みの中心の値(分母だけ) */
export function srcRot3(T1, GEO, id, src, combo, { extraW = 0, w0k = 0, cRv = null, nPhase = DECL.nPhase, mut = null } = {}) {
  const r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), g = GEO[id + '|' + src];
  if (!r2 || !g) throw new RangeError('srcRot3: 組 ' + id + '|' + src);
  const ws = r2.OmegaT, beta = r2.Om1 / ws, sid = srcId(src), Ms = C.massOf(sid), a = G * Ms / (beta * C0 * C0), vOrb = Math.sqrt(beta) * C0;
  const rv = recvOf(id, combo, cRv), Rs = srcR(sid, combo), A0 = selfCenterW(rv, combo), W0 = w0k * A0;
  const s = unit(g.s), n = unit(g.n), x0 = crs(s, n), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(n)[0], y = crs(n, x);
  let mW = [0, 0, 0], mP = [0, 0, 0];
  for (let k = 0; k < nPhase; k++) {
    const ph = 2 * Math.PI * (k + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(n, rh);
    // 受け手を原点に: 源は −a r̂・相対速度 V_s − v_i = −v_orb v̂
    const f = makeField3({ sources: [{ m: Ms, R: Rs, p: scl(rh, -a), v: scl(vh, -vOrb), spin: scl(s, ws) }], recv: { m: rv.m, R: rv.R, p: [0, 0, 0], v: [0, 0, 0] },
      W0, extraW, kernel: kernelOf(combo), rot: rotFormOf(combo), self: true, mut });
    mW = add(mW, scl(rot3('W', f, [0, 0, 0], { Rb: rv.R }), 1 / nPhase)); mP = add(mP, scl(rot3('P2', f, [0, 0, 0], { e: rh, Rb: rv.R }), 1 / nPhase));
  }
  const wS = Ms * D.Kball(combo.al, a, Rs);
  return { W: mW, P2: mP, a, nOrb: vOrb / a, wS, A0, Rs, Ri: rv.R, beta: wS / (A0 + W0 + extraW + wS) };
}
/** 銀河の質量の宣言(円の道 —— 第337便c の GALAXY の 2 値から M_G = β c² d ÷ G・d = c √β ÷ ω) */
export const galMass = () => TL.GALAXY.beta * C0 * C0 * C.galDistM() / G;
/** 銀河由来(受け手は銀河の面の上・銀河の中心は −d r̂・相対速度は銀河の円運動の速さ —— 受け手の公転の分は落とす宣言・8 方位の平均) */
export function galRot3(id, combo, { extraW = 0, w0k = 0, cRv = null, mut = null } = {}) {
  const gU = P.galUnit(), d = C.galDistM(), Mg = galMass(), v = Math.sqrt(TL.GALAXY.beta) * C0, rv = recvOf(id, combo, cRv), A0 = selfCenterW(rv, combo), W0 = w0k * A0;
  const Rg = combo.rot === 'q0' ? d / DECL.galDOverR : combo.self === 'cap' ? CAP_M : YK * Mg, [e1, e2] = perpPair(gU);
  let mW = [0, 0, 0], mP = [0, 0, 0];
  for (let k = 0; k < DECL.nGal; k++) {
    const ph = 2 * Math.PI * k / DECL.nGal, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), vh = crs(gU, rh);
    const f = makeField3({ sources: [{ m: Mg, R: Rg, p: scl(rh, -d), v: scl(vh, -v), spin: scl(gU, TL.GALAXY.omega) }], recv: { m: rv.m, R: rv.R, p: [0, 0, 0], v: [0, 0, 0] },
      W0, extraW, kernel: kernelOf(combo), rot: rotFormOf(combo), self: true, mut });
    mW = add(mW, scl(rot3('W', f, [0, 0, 0], { Rb: rv.R }), 1 / DECL.nGal)); mP = add(mP, scl(rot3('P2', f, [0, 0, 0], { e: rh, Rb: rv.R }), 1 / DECL.nGal));
  }
  const wG = Mg * D.Kball(combo.al, d, Rg);
  return { W: mW, P2: mP, d, wG, beta: wG / (A0 + W0 + extraW + wG), Ri: rv.R };
}
const parentRows = C.DECL.parentRows;
/** 組 (id, src) の 3 つの由来(銀河・太陽・母天体)—— 分母は 3 つの由来の重みの中心の値の和(勾配は自分の由来だけ) */
export function pairRot3(T1, GEO, id, src, combo, o = {}) {
  const sunKey = src === 'Sun' ? id + '|' + src : parentRows[id + '|' + src], [sid, ssrc] = sunKey.split('|');
  const r2 = (i, s) => T1.find((r) => r.id === i && r.src === s && r.mag === 'm2');
  const wAt = (i, s) => { const rr = r2(i, s), Ms = C.massOf(srcId(s)), a = G * Ms / ((rr.Om1 / rr.OmegaT) * C0 * C0); return Ms * D.Kball(combo.al, a, srcR(srcId(s), combo)); };
  const wSun = wAt(sid, ssrc), wPar = src === 'Sun' ? 0 : wAt(id, src), wGal = galMass() * D.Kball(combo.al, C.galDistM(), combo.rot === 'q0' ? C.galDistM() / DECL.galDOverR : combo.self === 'cap' ? CAP_M : YK * galMass());
  const S = srcRot3(T1, GEO, sid, ssrc, combo, { ...o, extraW: wGal + wPar }), Pp = src === 'Sun' ? null : srcRot3(T1, GEO, id, src, combo, { ...o, extraW: wGal + wSun }), Gg = galRot3(id, combo, { ...o, extraW: wSun + wPar });
  return { S, P: Pp, G: Gg, wSun, wPar, wGal };
}
const NAME = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Mars: 'mars', Moon: 'moon' });
const precObs = (id) => { const k = NAME[id]; return k && LIT.precArcsecPerYr[k] !== undefined ? { asYr: LIT.precArcsecPerYr[k], role: LIT.precRole[k] } : null; };
/** 天体の表: 15 組 × 場の組 4 × 候補 2 —— 由来ごとの回転・〔第348便c〕の重みの型の合成・δ・歳差の率 */
export function bodyRows3(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const combo of DECL.combos) for (const [id, src] of E.DECL.pairs) {
    const R = pairRot3(T1, GEO, id, src, combo), key = id + '|' + src, r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), wAx = unit(GEO[key].w), o = precObs(id);
    for (const cand of DECL.cands) {
      const OmG = R.G[cand], OmS = R.S[cand], OmP = R.P ? R.P[cand] : null, CC = C.composeAll(OmG, OmS, OmP);
      const one = (c) => { const p = C.precess(c.e, c.mag, wAx, r2.I, r2.omega); return { magYr: c.mag * YR, deltaDeg: p.deltaDeg, precAsYr: p.precAsYr, torque: p.torque, ratio: o && p.precAsYr > 0 ? p.precAsYr / o.asYr : null }; };
      const sunKey = src === 'Sun' ? key : parentRows[key];   // 太陽由来の項の公転の軸は太陽のまわりの組の軸・母天体由来は自分の組の軸・銀河由来は銀河の回転の向き
      const comp = (v, nAx) => (v ? { magYr: nrm(v) * YR, toSpinDeg: nrm(v) > 0 ? snapA(angDeg(v, wAx)) : null, toOrbNDeg: nrm(v) > 0 ? snapA(angDeg(v, nAx)) : null, par: dot(v, wAx), perp: nrm(sub(v, scl(wAx, dot(v, wAx)))) } : null);
      out.push({ combo: combo.id, id, src, cand, I: r2.I, omega: r2.omega, betaS: R.S.beta, betaG: R.G.beta, betaP: R.P ? R.P.beta : null, nOrbS: R.S.nOrb, Ri: R.S.Ri,
        G: comp(OmG, P.galUnit()), S: comp(OmS, unit(GEO[sunKey].n)), P: comp(OmP, unit(GEO[key].n)), galOverSun: nrm(OmG) / nrm(OmS), W1: one(CC.W1), W2: one(CC.W2), W3: one(CC.W3[1]), W1P: CC.W1P ? one(CC.W1P) : null,
        obsAsYr: o ? o.asYr : null, obsRole: o ? o.role : null, vec: { G: OmG, S: OmS, P: OmP } });
    }
  }
  return out;
}
/** 〔第348便c〕の q 0・2・3 の列(D₀ 0・同じ組・同じ候補)と並べる: W1 の大きさ・δ と、大きさで並べた位置(q 2 と q 3 の間の対数の内挿 —— 等価な q の読み) */
export function vsQRows(R3, CB) {
  const out = [];
  for (const r of R3.filter((x) => x.combo === DECL.mainCombo || x.combo === 'K1rQ0')) {
    const q = (qq) => CB.find((x) => x.id === r.id && x.src === r.src && x.cand === r.cand && x.q === qq && x.d0k === 0);
    const q0 = q(0), q2 = q(2), q3 = q(3), m = r.W1.magYr, l2 = Math.log(q2.W1.magYr), l3 = Math.log(q3.W1.magYr);
    out.push({ combo: r.combo, id: r.id, src: r.src, cand: r.cand, geo3: { magYr: m, deltaDeg: r.W1.deltaDeg }, q0: { magYr: q0.W1.magYr, deltaDeg: q0.W1.deltaDeg }, q2: { magYr: q2.W1.magYr, deltaDeg: q2.W1.deltaDeg },
      q3: { magYr: q3.W1.magYr, deltaDeg: q3.W1.deltaDeg }, qEq: Math.abs(l3 - l2) > 1e-12 ? 2 + (Math.log(m) - l2) / (l3 - l2) : null, below: m < Math.min(q0.W1.magYr, q2.W1.magYr, q3.W1.magYr) });
  }
  return out;
}
/** c_R の入り方(AN976): 引きずられ半径 R_i = c_R R_obs を自分の重みと腕に通した (W)・(P2) の W1 の大きさと局所の冪 d ln abs(Ω) ÷ d ln c_R(0.5 と 2 の間) */
export function cRRows3(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [], combo = DECL.combos.find((c) => c.id === 'K1cM');
  for (const id of DECL.cRbodies) {
    const key = id === 'Moon' ? ['Moon', 'EarthHi'] : id === 'Io' ? ['Io', 'Jupiter'] : [id, 'Sun'], rule = DECL.combos.find((c) => c.id === DECL.mainCombo);
    for (const cand of DECL.cands) {
      const magOf = (cmb, cRv) => { const R = pairRot3(T1, GEO, key[0], key[1], cmb, { cRv }); return nrm(C.composeAll(R.G[cand], R.S[cand], R.P ? R.P[cand] : null).W1.vec) * YR; };
      const sw = Object.fromEntries(DECL.cR.map((c) => [c, magOf(combo, c)])), mr = magOf(rule, null), R0 = pairRot3(T1, GEO, key[0], key[1], combo, { cRv: 1 }), wOth = R0.wSun + R0.wPar + R0.wGal;
      const rr = YK * C.massOf(id) / C.radiusOf(id), kSelf = cand === 'W' ? 1.5 : 1;   // 自分の重みの中心 3m/(2R_i)・腕の点 m/R_i
      out.push({ id, src: key[1], cand, ruleRiOverRobs: rr, ruleMagYr: mr, swept: sw, slope: Math.log(sw[2] / sw[0.5]) / Math.log(4), slopeLo: Math.log(sw[1] / sw[0.5]) / Math.log(2), slopeHi: Math.log(sw[2] / sw[1]) / Math.log(2),
        slopeRule: Math.log(sw[0.5] / mr) / Math.log(0.5 / rr), cRstar: kSelf * C.massOf(id) / (C.radiusOf(id) * wOth) });
    }
  }
  return out;
}
/** 背景 W₀ の効き(主の場の組・地球と木星とイオ —— W₀ = 自分の重みの中心の値の 0・1 倍): W1 の大きさの比と δ の違い */
export function w0Rows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [], combo = DECL.combos.find((c) => c.id === DECL.mainCombo);
  for (const [id, src] of [['Earth', 'Sun'], ['Jupiter', 'Sun'], ['Io', 'Jupiter']]) for (const cand of DECL.cands) {
    const one = (w0k) => { const R = pairRot3(T1, GEO, id, src, combo, { w0k }), c = C.composeAll(R.G[cand], R.S[cand], R.P ? R.P[cand] : null).W1; return { mag: c.mag, e: c.e }; };
    const a = one(0), b = one(1);
    out.push({ id, src, cand, ratio: b.mag / a.mag, dAngDeg: angDeg(a.e, b.e) });
  }
  return out;
}

/* ───────── T4 エネルギーの行き先の 2 列(〔第348便b〕の步の形の上)───────── */
/** 無次元の例: 例 fixed(〔第347便i〕表 4・〔第348便b〕表 4 の組 —— θ₀ 40°・f 0)・例 Tc(〔第348便b〕表 6 の組 —— k_d 1・f 0.5)・例 geo3(θ₀ = 主の場の組の地球の行の角) */
export function destRows(theta3Deg) {
  const out = [], ex = [['fixed', { f: 0 }], ['Tc', { bal: 'Tc', f: B.DECL.f0, kd: 1, T: B.DECL.T2, steps: B.DECL.steps2 }], ['geo3', { f: 0, theta0Deg: theta3Deg }]];
  for (const [exn, o] of ex) for (const [type, col] of DECL.kinds) for (const [dn, split] of Object.entries(DECL.dests)) {
    const R = B.plateau({ type, col, split, ...o }), A = R.a;
    out.push({ ex: exn, type, col, dest: dn, theta0Deg: A.thEndDeg === undefined ? null : (o.theta0Deg ?? B.DECL.theta0Deg), w0: A.w0, wRatio: A.wRatio, wTotRatio: A.wEnd / A.w0, wiRatio: A.wiRatio, wdEnd: A.wdEnd, torqueRatio: A.torqueRatio,
      heatOverWork: A.work > 0 ? A.heat / A.work : null, givenOverWork: A.work > 0 ? A.given / A.work : null, fieldXOverWork: A.work > 0 ? A.fieldX / A.work : null, ledgerResid: A.ledgerResid, wJudge: R.wJudge, torqueFlat: R.torqueFlat });
  }
  return out;
}
/** 天体 4 組の桁(geoPN=3 の場の (W) —— ∥・⊥ は受け手の自転の軸に対して): 行き先 2 列 × 型と行き先の自転の増え方・(Tc) の総量・熱の率・帳簿は閉じた形(f 0) */
export function bodyEnergy(rows) {
  const obs = E.observedRates(), out = [];
  for (const r of rows) {
    const w = Math.abs(r.omega), Op = r.Wperp, Opar = r.Wpar, Om = Math.hypot(Op, Opar), th0 = Om > 0 ? Math.atan2(Op, Opar) : 0, edge = !(Op > 1e-9 * Om), o = obs.find((x) => x.id === r.id);
    const base = Op * Op / w * YR, tcIn = edge ? null : Om * (1 - Math.cos(th0)) / w, cols = {};
    for (const [type, col] of DECL.kinds) for (const dn of Object.keys(DECL.dests)) {
      const aEff = dn === 'inertial' ? 1 : (col === 'E2' ? 1 : 0), field = type === 'S1' ? 1 : 0;
      cols[type + col + '|' + dn] = { rateYr: aEff * base, tcTotal: tcIn === null ? null : (aEff / 1 + field) * tcIn, heatW: dn === 'drag' && col === 'E3' ? r.I * w * Op * Op : 0, givenW: dn === 'drag' && col === 'E1' ? r.I * w * Op * Op : 0 };
    }
    out.push({ id: r.id, src: r.src, tag: r.tag, omega: w, I: r.I, Wpar: Opar, Wperp: Op, thetaDeg: th0 / D2R, edge, dragOverW: Opar / w, cols, obsRateYr: o ? o.rateYr : null, heatRuler: LIT.heat[r.id] ?? null });
  }
  return out;
}
/** geoPN=3 の (W) を〔第348便b〕の天体 4 組の行の形に(主の場の組・銀河 + 太陽 + 母天体の和) */
export function geo3BodyInput(R3, GEO = E.geometry()) {
  return I.DECL.bodies.map(([id, src]) => {
    const r = R3.find((x) => x.combo === DECL.mainCombo && x.id === id && x.src === src && x.cand === 'W'), v = [r.vec.G, r.vec.S, r.vec.P].filter(Boolean).reduce((t, x) => add(t, x), [0, 0, 0]), w = unit(GEO[id + '|' + src].w);
    return { id, src, tag: 'geo3', omega: r.omega, I: r.I, Wpar: dot(v, w), Wperp: nrm(sub(v, scl(w, dot(v, w)))) };
  });
}

/* ───────── T5 零試験・変異・照合 ───────── */
export function pureScenes() {
  const zh = [0, 0, 1], recv0 = (p, v = [0, 0, 0]) => ({ m: 2 * 0.1 / 3, R: 0.1, p, v }), Rb = 0.1;
  // ① 静止・自転しない源(相対速度 0)→ 0(自分の重み・背景の有無によらない)
  const z1 = Math.max(...[[0, false], [1, true], [0, true]].map(([W0, self]) => { const rc = [3, 1, -2], f = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, 0] }], recv: recv0(rc), W0, self });
    return Math.max(nrm(rot3('W', f, rc, { Rb })), nrm(rot3('P2', f, rc, { e: unit(rc), Rb }))); }));
  // ② 源 1 つ・自転しない・背景 0・自分の重み 0 → u は一様(相対速度)→ 0
  const rc2 = [3, 1, -2], f2 = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0.3, -0.2, 0.1], spin: [0, 0, 0] }], recv: recv0(rc2, [0.05, 0, 0]), W0: 0, self: false });
  const z2 = Math.max(nrm(rot3('W', f2, rc2, { Rb })), nrm(rot3('P2', f2, rc2, { e: unit(rc2), Rb, lim: false })));
  // ③ 自分の重み 0・W₀ = D₀・点の冪 p・源の回転 (R/(R+d))^q・受け手の速度 0 で〔第347便h〕の makeField に一致(u・J・候補 W と有限の腕の P2)
  let h3 = 0;
  for (const [p, q, D0] of [[1, 2, 0], [1, 3, 0.1], [2, 2, 0.01], [1, 0, 0.1]]) {
    const srcs = [{ m: 1, R: 1, spin: [0.1, 0.2, 0.9], r: [0, 0, 0], v: [0.1, 0, 0] }, { m: 0.5, R: 0.7, spin: [0, -0.4, 0.3], r: [6, 2, 1], v: [0, 0.05, -0.02] }];
    const fh = H.makeField({ sources: srcs, D0, p, q }), fm = makeField3({ sources: srcs.map((s) => ({ m: s.m, R: s.R, p: s.r, v: s.v, spin: s.spin })), recv: { p: [0, 0, 0], v: [0, 0, 0] }, W0: D0, kernel: { kind: 'pt', pw: p }, rot: { form: 'q', q }, self: false });
    const rc = [2, 3, 1], e = unit([1, 0.5, 0.2]);
    h3 = Math.max(h3, rel(fm.u(rc), fh.u(rc)), Math.max(...fm.J(rc).map((v, k) => Math.abs(v - fh.J(rc)[k]))) / Math.max(...fh.J(rc).map(Math.abs)),
      rel(rot3('W', fm, rc, { Rb }), H.rotOf('W', fh, rc, { Rb }).Om), rel(rot3('P2', fm, rc, { e, Rb, lim: false }), H.rotOf('P2', fh, rc, { e, Rb }).Om));
  }
  // ④ ガリレイの変換: 源と受け手に同じ速度を足しても geoPN=3 の (W) は同じ(相対速度)/〔第347便h〕の場(絶対の速度・D₀ > 0)は変わる/変異(受け手の速度を引かない)は変わる
  const gal = (dv, mut = null) => { const rc = [4, 1, 0.5], f = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: add([0, 0.1, 0], dv), spin: [0, 0, 0.3] }], recv: { ...recv0(rc, dv), m: 2 * 0.1 / 3 * 5 }, W0: 0.2, mut }); return rot3('W', f, rc, { Rb }); };
  const g0 = gal([0, 0, 0]), g1 = gal([0.3, -0.5, 0.2]), gm0 = gal([0, 0, 0], 'absVel'), gm1 = gal([0.3, -0.5, 0.2], 'absVel');
  const hg = (dv) => H.rotOf('W', H.makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 0.3], r: [0, 0, 0], v: add([0, 0.1, 0], dv) }], D0: 0.2, p: 1, q: 2 }), [4, 1, 0.5], { Rb }).Om;
  const galil = { geo3: rel(g1, g0), geo2: rel(hg([0.3, -0.5, 0.2]), hg([0, 0, 0])), mut: rel(gm1, gm0) };
  // ⑤ 自転しない源の (W) の閉じた形(自分の重み A 一定・K1)
  let c5 = 0;
  for (const [A, d] of [[1, 3], [100, 10], [1e-3, 30]]) { const rc = [d * 0.8, d * 0.6, 0], c = [0, 0.1, 0.02], f = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: c, spin: [0, 0, 0] }], recv: { m: A * 2 * Rb / 3, R: Rb, p: rc, v: [0, 0, 0] }, W0: 0, self: true });
    c5 = Math.max(c5, rel(rot3('W', f, rc, { Rb }), closedTransW({ A, mj: 1, rho: rc, c }))); }
  // ⑥ (P2) の極限と有限の腕(腕 ÷ 距離 1e-3・1e-4 —— 自分の重みは腕の点の値)
  const p6 = [1e-3, 1e-4].map((k) => { const d = 10, rc = [d, 0, 0], RbK = k * d, f = makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 0.1, 0], spin: [0, 0, 0.5] }], recv: { m: 3, R: RbK, p: rc, v: [0.01, 0, 0] }, W0: 0.1, self: true });
    return rel(rot3('P2', f, rc, { e: [1, 0, 0], Rb: RbK, lim: true }), rot3('P2', f, rc, { e: [1, 0, 0], Rb: RbK, lim: false })); });
  // ⑦ 核: K1 の内部 (3R² − r²)/(2R³)・外部 1/r(アプリの inertialDragIsqK1 の式)・自分の重みの中心 3m/(2R)・R_d ÷ r_s = 5 ÷ C₁
  const k7 = Math.max(Math.abs(D.Kball(1, 0.3, 1) - (3 - 0.09) / 2), Math.abs(D.Kball(1, 2, 1) - 0.5), Math.abs(D.Kball(1, 0, 2) - 0.75), Math.abs(YK * 1e30 / (2 * G * 1e30 / (C0 * C0)) - 5 / D.C1_CLOSED) / (5 / D.C1_CLOSED));
  // ⑧ 行き先を慣性回転だけにすると〔第348便b〕の表の行に一致(case1Rows の a_in 1 の行)・〔第348便b〕の天体の行(〔第347便h〕の場の入力)を同じ式で作り直して一致
  const B1 = B.case1Rows(), D1 = destRows(B.DECL.theta0Deg);
  let b8 = 0;
  for (const r of D1.filter((x) => x.ex === 'fixed')) { const s = DECL.dests[r.dest], c = B1.find((x) => x.type === r.type && x.col === r.col && x.h === s[0] && x.aIn === s[1] && x.aDr === s[2] && x.f === 0);
    if (c) b8 = Math.max(b8, Math.abs(c.wRatio - r.wRatio) / c.wRatio, Math.abs(c.torqueRatio - r.torqueRatio) / c.torqueRatio); else b8 = Infinity; }
  const BB = B.bodyRows(), mine = bodyEnergy(BB.map((r) => ({ id: r.id, src: r.src, tag: 'q' + r.q, omega: r.omega, I: I.bodyRows().find((x) => x.id === r.id && x.src === r.src && x.q === r.q).I, Wpar: r.Wpar, Wperp: r.Wperp })));
  let b8b = 0;
  BB.forEach((r, k) => { const m = mine[k]; b8b = Math.max(b8b, Math.abs(m.cols['S1E1|inertial'].rateYr - r.s1RateYr) / r.s1RateYr, Math.abs(m.dragOverW - r.dragOverW) / Math.abs(r.dragOverW || 1));
    if (r.tcField !== null) b8b = Math.max(b8b, Math.abs(m.cols['S2pE2|inertial'].tcTotal - r.tcTotal) / r.tcTotal, Math.abs((m.cols['S1E1|inertial'].tcTotal - m.cols['S2pE2|inertial'].tcTotal) - r.tcField) / r.tcField); });
  // ⑨ 変異: 源の回転の符号を逆にすると自転する源の (W) の回転の分が反転(自転しない分は同じ)/自分の重みを分母から落とすと値が変わる
  const rc9 = [5, 0, 1], mk9 = (mut, self = true) => makeField3({ sources: [{ m: 1, R: 1, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, 1] }], recv: recv0(rc9), W0: 0, self, mut, rot: { form: 'q', q: 2 } });
  const w9 = rot3('W', mk9(null), rc9, { Rb }), w9m = rot3('W', mk9('rotSign'), rc9, { Rb }), w9s = rot3('W', mk9(null, false), rc9, { Rb });
  const mut9 = { rotSign: rel(w9m, scl(w9, -1)) < 1e-12 && rel(w9m, w9) > 1, noSelf: rel(w9s, w9) > 1e-3 };
  // ⑩ 拒否
  const rej = [() => makeField3({ sources: [{ m: -1, R: 1, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, 0] }], recv: recv0([1, 0, 0]) }), () => makeField3({ recv: recv0([1, 0, 0]), kernel: { kind: 'ball', al: 3 } }),
    () => makeField3({ recv: recv0([1, 0, 0]), rot: { form: 'x' } }), () => makeField3({ recv: recv0([1, 0, 0]), kernel: { kind: 'pt', pw: 1 }, rot: { form: 'M' }, self: false }),
    () => makeField3({ recv: recv0([1, 0, 0]), W0: -1 }), () => rot3('G', makeField3({ recv: recv0([1, 0, 0]) }), [1, 0, 0], { Rb: 0.1 })].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { z1, z2, h3, galil, c5, p6, k7, b8, b8b, mut9, rejects: rej };
}
export function pureGates(S) {
  return {
    staticZero: S.z1 === 0,
    uniformZero: S.z2 < 1e-15,
    vsH: S.h3 < 1e-12,
    galilei: S.galil.geo3 < 1e-12 && S.galil.geo2 > 1e-3 && S.galil.mut > 1e-3,
    closedTrans: S.c5 < 1e-12,
    p2limit: S.p6[0] < 1e-4 && S.p6[1] < 1e-6 && S.p6[1] < S.p6[0],
    kernel: S.k7 < 1e-12,
    vsB: S.b8 < 1e-9 && S.b8b < 1e-9,   // 同じ式の 2 つの走り(尺度の走り直しでは呼ぶ順で丸めの散りが違う —— 素の走りでは 0 と 1.7e-16)
    mutants: S.mut9.rotSign && S.mut9.noSelf,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

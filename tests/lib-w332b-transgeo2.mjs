// 第332便b(原仮定者の補足(2026-11-10)「座標変換版の「回転引きずり」は、天体の半径を見ないので、「並進引きずり」に統合する。銀河のスケールでの geoPN=2 の近似と比較する」・
//   「R_d は観測半径とは別の値(重力の計算で天体を質点とみなせる事と似ている)」・統括の検証項目 R316):
//   **並進引きずり(座標変換の回転を統合 —— 半径を見ない・重み m/r²)と geoPN = 2 の u の場(E2・E3 —— 重み m/r・源の自転の減衰つきの項・自己を分母から外す)を同じ入力で並べる純関数**
//   (器 tests/exp-w332b-transgeo2.mjs と QA lint.transGeo2332b・behavior.transGeo2332b が読む —— html を読まない・状態を持たない・第331便a の lib〔tests/lib-w331a-coordtwist.mjs〕・
//   第331便b の lib〔tests/lib-w331b-centrifugal.mjs〕・第330便b の lib〔tests/lib-w330b-dragweight.mjs〕は呼ぶだけ・エンジンの式を写さない —— 場の式は宣言として書き、器がエンジンの値と照らす)。
//
// ■ 何をするか(作業仮説の検査の道具 —— エンジン・在位の本・受理器へ足す操作ではない。**実装/診断/宣言(未接続)を分ける** —— 本 lib は全部「診断」)
//   場の式(frameField —— 平面・1 受け手): 源 j の座標の速度 c_j(x) = v_j + Ω_j^eff(d) ẑ × (x − x_j)・重み w_j = m_j (d² + ε²)^{−p/2}・
//     u(x) = Σ_j w_j c_j /(w_self + w_bg + Σ_j w_j)(受け手の自分は源に入れない —— 器が外す)。宣言の 3 つの軸を 1 つずつ入れ替えられる:
//     核 KERNELS: geo2(p = 1・ε = 本の軟化 —— E1′ の決定力 m/√(d²+ε²))/trans(p = 2・ε = 0 —— 並進引きずりの点の重み m/r²)/pullSoft(p = 2・ε = 本の軟化 —— エンジンの frameWeight:"pull" の重み)。
//     源の回転 ROTS: decay(Ω^eff = s_j (R_j/(R_j + d))^q —— E2・源の半径を見る)/coord(Ω^eff = s_j —— 座標変換の回転 Ω_j × (x − x_j)・半径を見ない —— 並進引きずりに統合した型)。
//     分母: 自己の重み w_self(受け手の有限の宣言 —— selfWeightOf)と背景 w_bg(E3 の D₀)。E3 = 自己なし + D₀・場の読み = 自己なし + 背景なし・受け手の読み = 自己あり + 背景なし。
//   解析の勾配: J_ab = ∂u_a/∂x_b = (∂P_a/∂x_b − u_a ∂W/∂x_b)/W(P = Σ w c・W = 分母 —— 自己と背景は位置に依らない)・渦度 ∇×u = J_yx − J_xy。
//   受け手から見た引きずりの速度(dRel): U − v = (P + w_self v)/W − v(第331便a の座標則の d と同じ型 —— 自己は分母と分子の v の項・場の読みでは u − v)。
//   v − u 輸送の定常の読み(transportSteady): ∂u/∂t = 0 と置いた geoPN = 2 の輸送 a = k_F [(u·∇)u + (∇×u) ẑ × (v − k_F u)](EQ-08 の式から粒子を追う u の差分 (v·∇)u を
//     定常の場で読んだ形 —— (v·∇)u − ((v − u)·∇)u = (u·∇)u)。**宣言の読み**(エンジンの時間発展は器が別に走らせる)。
//   円軌道の読み(circularVelocity): 軸対称の場 u = u_φ(R) φ̂ では a_R = −k_F u_φ²/R − k_F ω_z (v − k_F u_φ)(ω_z = u_φ/R + du_φ/dR)。重力 g(内向き)と釣り合う
//     v²/R = g − a_R の順行の根(continuum)と、第331便b の剛体の枠の読み v = √(gR) + u_φ(rigid —— 第331便b の rigidVelocity を呼ぶ)。**k_F = 1 の continuum は第331便b の
//     枠の式 R(Ω − Ω_f)(Ω − ω_f) = g の ω_f = ω_z − Ω_f(= Ω_f + R dΩ_f/dR)の型と同じ式**(場面 ⑦ —— 第331便b の frameDemand を呼んで照らす)。
//   自己の重み(selfWeightOf): 形(point・ballMean・ballHarmonic —— 第330便b の selfWeight)× 半径の規則(kappaM: R_d = Y_k m = 10Gm/(C₁c²) —— K1 の規則・本の G と c /
//     kappaD: κ_D m = 2Gm/c²(原文の字面の比べる列)/ book: 本の宣言の半径(比べる列 —— 主にしない: 原仮定者の補足「R_d は観測半径とは別の値」))。m/0² にしない。
//
// ■ 言わないこと: geoPN = 2 と並進引きずりの関係は、同じ入力の場の表・比・残差(同じとは書かない —— 核・源の回転・分母の 3 つが違う)・輸送の定常の読みと円軌道の読みは宣言の型の値
//   (エンジンの時間発展の値ではない)・引きずりの速度 dRel を力と書かない・平坦な回転の機構の同定に使わない・κ_D と周転円の振動数を同じ量と書かない。
import * as W from './lib-w330b-dragweight.mjs';
import * as CT from './lib-w331a-coordtwist.mjs';
import * as CF from './lib-w331b-centrifugal.mjs';

export const LIB_VERSION = 'w332b-transgeo2-lib-1';
/** 核(p・軟化の扱い)—— geo2 = E1′(p 1・本の ε)・trans = 並進引きずりの点の重み(p 2・ε 0)・pullSoft = エンジンの frameWeight:"pull"(p 2・本の ε) */
export const KERNELS = Object.freeze(['geo2', 'trans', 'pullSoft']);
/** 源の回転 —— decay = E2(源の半径 R_j を見る減衰)・coord = 座標変換の回転(半径を見ない) */
export const ROTS = Object.freeze(['decay', 'coord']);
/** 自己の重みの半径の規則(kappaM = K1 の規則 R_d = Y_k m・kappaD = κ_D m・book = 本の宣言の半径 —— 比べる列) */
export const SELF_RULES = Object.freeze(['kappaM', 'kappaD', 'book']);
export const SELF_SHAPES = W.SELF_TYPES;
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 核の p(geo2 1・trans 2・pullSoft 2)と軟化を本の ε にするか */
  kernelP: Object.freeze({ geo2: 1, trans: 2, pullSoft: 2 }), kernelSoft: Object.freeze({ geo2: true, trans: false, pullSoft: true }),
  /** 解析の勾配と差分の照らしの相対の刻み・許容 */
  fdStep: 1e-6, fdTol: 1e-6,
  /** 恒等式の門の相対の許容 */
  idTol: 1e-12,
});

const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));

/** 核の宣言 { name, p, eps }(eps は本の軟化 —— soft の核だけ使う) */
export function kernelOf(name, epsBook = 0) {
  if (!KERNELS.includes(name)) throw new RangeError('kernelOf: 核は ' + KERNELS.join('・'));
  if (!fin(epsBook) || epsBook < 0) throw new RangeError('kernelOf: 本の軟化 ≥ 0');
  return { name, p: DECL.kernelP[name], eps: DECL.kernelSoft[name] ? epsBook : 0 };
}

/**
 * 場の式(1 受け手 —— 平面)。at:[x, y]・sources:[{ x, y, vx, vy, m ≥ 0, spin, R > 0(decay で spin ≠ 0 のとき)}]・kernel:{ p ∈ {1, 2}, eps ≥ 0 }・rot:{ type ∈ ROTS, q ≥ 0 }・
 * selfW ≥ 0(受け手の自己の重み —— 分母だけ)・bg ≥ 0(背景 —— 速度 0 の項)・v:[vx, vy](受け手の速度 —— dRel を返すときだけ)。
 * 戻り値: u・W・Wsrc・P・J(2×2)・curl・div・shares{ src, self, bg }・dRel(v があるとき)
 */
export function frameField({ at, sources, kernel, rot, selfW = 0, bg = 0, v = null }) {
  if (!Array.isArray(at) || at.length !== 2 || !at.every(fin) || !Array.isArray(sources)) throw new RangeError('frameField: at は有限の 2 成分・sources は配列');
  if (!kernel || ![1, 2].includes(kernel.p) || !fin(kernel.eps) || kernel.eps < 0) throw new RangeError('frameField: 核の p は 1 か 2・ε ≥ 0');
  if (!rot || !ROTS.includes(rot.type) || (rot.type === 'decay' && !(fin(rot.q) && rot.q >= 0))) throw new RangeError('frameField: 源の回転は ' + ROTS.join('・') + '(decay は q ≥ 0)');
  if (!fin(selfW) || selfW < 0 || !fin(bg) || bg < 0) throw new RangeError('frameField: 自己の重み・背景 ≥ 0');
  if (v !== null && !(Array.isArray(v) && v.length === 2 && v.every(fin))) throw new RangeError('frameField: v は有限の 2 成分');
  const p = kernel.p, e2 = kernel.eps * kernel.eps, x = at[0], y = at[1];
  let Px = 0, Py = 0, Ws = 0, dWx = 0, dWy = 0, Pxx = 0, Pxy = 0, Pyx = 0, Pyy = 0;
  for (const s of sources) {
    if (!s || ![s.x, s.y, s.vx, s.vy, s.m, s.spin].every(fin) || s.m < 0) throw new RangeError('frameField: 源は有限の x・y・vx・vy・spin と非負の m');
    const dx = x - s.x, dy = y - s.y, d2 = dx * dx + dy * dy, d = Math.sqrt(d2), q2 = d2 + e2;
    if (!(d > 0)) throw new RangeError('frameField: 受け手と源が一致(受け手の自分は源に入れない —— 器が外す)');
    if (!(q2 > 0)) throw new RangeError('frameField: 値域の外');
    const w = s.m * (p === 1 ? 1 / Math.sqrt(q2) : 1 / q2), gk = p === 1 ? 1 / (q2 * Math.sqrt(q2)) : 2 / (q2 * q2);
    let om = 0, dom = 0;
    if (s.spin !== 0) {
      if (rot.type === 'coord') om = s.spin;
      else { if (!(fin(s.R) && s.R > 0)) throw new RangeError('frameField: decay の源は半径 R > 0'); const tt = s.R / (s.R + d); om = s.spin * Math.pow(tt, rot.q); dom = -rot.q * om / (s.R + d); }
    }
    const cx = s.vx - om * dy, cy = s.vy + om * dx, gwx = -s.m * dx * gk, gwy = -s.m * dy * gk, nx = dx / d, ny = dy / d;
    Px += w * cx; Py += w * cy; Ws += w; dWx += gwx; dWy += gwy;
    Pxx += gwx * cx + w * (-dy * dom * nx); Pxy += gwy * cx + w * (-om - dy * dom * ny);
    Pyx += gwx * cy + w * (om + dx * dom * nx); Pyy += gwy * cy + w * (dx * dom * ny);
  }
  const Wt = selfW + bg + Ws;
  if (!(Wt > 0) || !fin(Wt)) throw new RangeError('frameField: 分母が 0(源・自己・背景のどれも無い)');
  const ux = Px / Wt, uy = Py / Wt;
  const J = [[(Pxx - ux * dWx) / Wt, (Pxy - ux * dWy) / Wt], [(Pyx - uy * dWx) / Wt, (Pyy - uy * dWy) / Wt]];
  const out = { u: [ux, uy], W: Wt, Wsrc: Ws, P: [Px, Py], J, curl: J[1][0] - J[0][1], div: J[0][0] + J[1][1], shares: { src: Ws / Wt, self: selfW / Wt, bg: bg / Wt },
    dP: [[Pxx, Pxy], [Pyx, Pyy]], dW: [dWx, dWy] };
  if (v !== null) out.dRel = [(Px + selfW * v[0]) / Wt - v[0], (Py + selfW * v[1]) / Wt - v[1]];
  return out;
}

/** v − u 輸送の定常の読み: a = k_F [J u + (∇×u) ẑ × (v − k_F u)](ẑ × (w_x, w_y) = (−w_y, w_x)) */
export function transportSteady({ u, J, v, kF = 1 }) {
  if (![u, v].every((a) => Array.isArray(a) && a.length === 2 && a.every(fin)) || !Array.isArray(J) || !fin(kF)) throw new RangeError('transportSteady: 入力');
  const curl = J[1][0] - J[0][1], conv = [J[0][0] * u[0] + J[0][1] * u[1], J[1][0] * u[0] + J[1][1] * u[1]], wx = v[0] - kF * u[0], wy = v[1] - kF * u[1];
  const cor = [-curl * wy, curl * wx];
  return { a: [kF * (conv[0] + cor[0]), kF * (conv[1] + cor[1])], conv, cor, curl };
}

/** 位置 (x, y) での動径・接線の成分(φ̂ = (−y, x)/r —— 反時計回りが正) */
export function polar(at, vec) {
  const r = Math.hypot(at[0], at[1]);
  if (!(r > 0)) throw new RangeError('polar: 原点は動径が決まらない');
  const cr = at[0] / r, sr = at[1] / r;
  return { r, R: vec[0] * cr + vec[1] * sr, phi: -vec[0] * sr + vec[1] * cr };
}

/**
 * 円軌道の読み(軸対称の場 —— 受け手は動径 R・接線の場 uPhi・渦度 omegaZ・内向きの重力 g ≥ 0)。
 * continuum: v²/R = g + k_F[u²/R + ω_z(v − k_F u)] の順行の根(判別式 < 0 は null)・rigid: 第331便b の √(gR) + u_φ・
 * 第331便b の枠の式の型の値(ω_f = ω_z − Ω_f —— k_F = 1 のときだけ —— frameDemand を呼ぶ)
 */
export function circularVelocity({ g, R, uPhi, omegaZ, kF = 1 }) {
  if (![g, R, uPhi, omegaZ, kF].every(fin) || !(R > 0) || g < 0) throw new RangeError('circularVelocity: g ≥ 0・R > 0・有限の数');
  const b = kF * R * omegaZ, c0 = g * R + kF * uPhi * uPhi - kF * kF * R * omegaZ * uPhi, disc = b * b + 4 * c0;
  const vC = disc >= 0 ? 0.5 * (b + Math.sqrt(disc)) : null;
  const vRigid = CF.rigidVelocity({ g, R, OmegaF: uPhi / R });
  let frameCheck = null;
  if (kF === 1 && vC !== null) {
    const fd = CF.frameDemand({ R, Omega: vC / R, OmegaF: uPhi / R, omegaF: omegaZ - uPhi / R });
    frameCheck = g > 0 ? (fd.demand - g) / g : fd.demand;
  }
  return { vContinuum: vC, vRigid, vNewton: Math.sqrt(g * R), frameCheck };
}

/** 自己の重み: 形 shape × 規則 rule(kappaM: 10Gm/(C₁c²)・kappaD: 2Gm/c²・book: Rbook)—— 本の G と c。戻り値 { w, R, rule, shape } */
export function selfWeightOf({ shape, rule, m, G, c, Rbook = null, p = 2 }) {
  if (!SELF_RULES.includes(rule)) throw new RangeError('selfWeightOf: 規則は ' + SELF_RULES.join('・'));
  if (![m, G, c].every(fin) || !(m > 0 && G > 0 && c > 0)) throw new RangeError('selfWeightOf: m・G・c > 0');
  const R = rule === 'kappaM' ? W.kappaMRadius(m, G, c) : rule === 'kappaD' ? 2 * G * m / (c * c) : Rbook;
  if (!fin(R) || !(R > 0)) throw new RangeError('selfWeightOf: 半径 > 0 の有限(m/0² にしない)');
  return { w: W.selfWeight({ type: shape, m, R, p }).w, R, rule, shape };
}

/** 局所のべき d ln|f| / d ln R(不等間隔の中心差分 —— 第331便b の derivNonUniform を ln–ln で呼ぶ)。符号の変わる点・0 は null */
export function localSlopes(R, f) {
  if (!Array.isArray(R) || !Array.isArray(f) || R.length !== f.length || R.length < 3) throw new RangeError('localSlopes: 同じ長さ・3 点以上');
  const ok = f.every((v) => fin(v) && v !== 0) && f.every((v) => Math.sign(v) === Math.sign(f[0]));
  if (!ok) return R.map(() => null);
  return CF.derivNonUniform(R.map(Math.log), f.map((v) => Math.log(Math.abs(v))));
}

/** 比の要約: base と alt の同じ点の比の |ln| の中央値・最大・符号の反転の数(0 と null は除く) */
export function ratioSummary(base, alt) {
  if (!Array.isArray(base) || !Array.isArray(alt) || base.length !== alt.length) throw new RangeError('ratioSummary: 同じ長さ');
  const L = [], flips = [];
  for (let k = 0; k < base.length; k++) {
    const a = base[k], b = alt[k];
    if (!fin(a) || !fin(b) || a === 0 || b === 0) continue;
    if (Math.sign(a) !== Math.sign(b)) flips.push(k);
    L.push(Math.abs(Math.log(Math.abs(b / a))));
  }
  return { n: L.length, medianAbsLn: CF.median(L), maxAbsLn: L.length ? Math.max(...L) : null, signFlips: flips.length };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const K1 = kernelOf('geo2', 0.3), K2 = kernelOf('trans', 0.3), K3 = kernelOf('pullSoft', 0.3), RD = { type: 'decay', q: 2 }, RC = { type: 'coord' };
  const SR = [{ x: -2, y: 3, vx: -1, vy: 2, m: 8, spin: 0.7, R: 0.4 }, { x: 1, y: -3, vx: 5, vy: -3, m: 3, spin: -0.2, R: 0.9 }, { x: 4, y: 1, vx: 0.5, vy: 1.5, m: 5, spin: 1.3, R: 0.6 },
    { x: -3, y: -2, vx: 2, vy: 0, m: 1.5, spin: 0, R: 0.2 }, { x: 0.5, y: 4, vx: -2, vy: -1, m: 2, spin: 0.4, R: 0.3 }];
  const at = [0.7, -0.4], vR = [1.1, -0.6];
  // ① 正規化: 1 つの源・場の読みで u = c(源の座標の速度)・分母の分の和 = 1
  { const s = SR[0], dx = at[0] - s.x, dy = at[1] - s.y, F = frameField({ at, sources: [s], kernel: K2, rot: RC });
    const G = frameField({ at, sources: SR, kernel: K1, rot: RD, selfW: 0.7, bg: 1.5 });
    S.normalize = { uErr: Math.max(Math.abs(F.u[0] - (s.vx - s.spin * dy)), Math.abs(F.u[1] - (s.vy + s.spin * dx))), shareSum: G.shares.src + G.shares.self + G.shares.bg }; }
  // ② 一様の並進 b を全部の源に足すと場の読みの u は b だけずれ・J は同じ(E3 は (1 − 背景の分) b)
  { const b = [7, -9], sh = SR.map((s) => Object.assign({}, s, { vx: s.vx + b[0], vy: s.vy + b[1] }));
    const A = frameField({ at, sources: SR, kernel: K1, rot: RD }), B = frameField({ at, sources: sh, kernel: K1, rot: RD });
    const C = frameField({ at, sources: SR, kernel: K1, rot: RD, bg: 1.5 }), Dd = frameField({ at, sources: sh, kernel: K1, rot: RD, bg: 1.5 });
    S.galilean = { uShift: Math.max(Math.abs(B.u[0] - A.u[0] - b[0]), Math.abs(B.u[1] - A.u[1] - b[1])) / 10, Jsame: Math.max(...[0, 1].flatMap((a) => [0, 1].map((c) => Math.abs(B.J[a][c] - A.J[a][c])))),
      e3Shift: Math.max(Math.abs(Dd.u[0] - C.u[0] - C.shares.src * b[0]), Math.abs(Dd.u[1] - C.u[1] - C.shares.src * b[1])) / 10 }; }
  // ③ 解析の勾配と中心差分(核 3 × 回転 2 × 背景と自己)
  { const rows = [];
    for (const K of [K1, K2, K3]) for (const Rt of [RD, RC]) {
      const F = frameField({ at, sources: SR, kernel: K, rot: Rt, selfW: 0.3, bg: 0.8 }), h = DECL.fdStep;
      let mx = 0, sc = 0;
      for (let bb = 0; bb < 2; bb++) {
        const ap = at.slice(), am = at.slice(); ap[bb] += h; am[bb] -= h;
        const Fp = frameField({ at: ap, sources: SR, kernel: K, rot: Rt, selfW: 0.3, bg: 0.8 }), Fm = frameField({ at: am, sources: SR, kernel: K, rot: Rt, selfW: 0.3, bg: 0.8 });
        for (let a = 0; a < 2; a++) { const fd = (Fp.u[a] - Fm.u[a]) / (2 * h); mx = Math.max(mx, Math.abs(fd - F.J[a][bb])); sc = Math.max(sc, Math.abs(F.J[a][bb])); }
      }
      rows.push({ kernel: K.name, rot: Rt.type, rel: mx / Math.max(sc, 1e-300) });
    }
    S.gradient = { rows, maxRel: Math.max(...rows.map((r) => r.rel)) }; }
  // ④ E2 の q = 0 は座標変換の回転(半径を見ない)と同じ式
  { const A = frameField({ at, sources: SR, kernel: K1, rot: { type: 'decay', q: 0 } }), B = frameField({ at, sources: SR, kernel: K1, rot: RC });
    S.q0IsCoord = { du: Math.max(Math.abs(A.u[0] - B.u[0]), Math.abs(A.u[1] - B.u[1])), dJ: Math.max(...[0, 1].flatMap((a) => [0, 1].map((c) => Math.abs(A.J[a][c] - B.J[a][c])))) }; }
  // ⑤ 第331便a の座標則(呼ぶだけ)と同じ値: trans・coord・自己の重み —— Σβ V = U − αv・d = dRel
  { const selfW = 2.5, F = frameField({ at, sources: SR, kernel: K2, rot: RC, selfW, v: vR });
    const q = CT.coordTwist({ id: 'r', x: [at[0], at[1], 0], v: [vR[0], vR[1], 0], omega: [0, 0, 0], selfW }, SR.map((s, k) => ({ id: 's' + k, x: [s.x, s.y, 0], v: [s.vx, s.vy, 0], omega: [0, 0, s.spin], m: s.m })));
    S.coordTwistLink = { uRel: Math.max(relD(F.u[0], q.U[0] - q.alpha * vR[0]), relD(F.u[1], q.U[1] - q.alpha * vR[1])), dRel: Math.max(relD(F.dRel[0], q.d[0]), relD(F.dRel[1], q.d[1])), alpha: q.alpha, shareSelf: F.shares.self }; }
  // ⑥ 自己の重み(背景なし)は場の読みを Wsrc/(Wsrc + w_self) 倍・dRel = (1 − α)(u_場 − v)
  { const A = frameField({ at, sources: SR, kernel: K2, rot: RC }), B = frameField({ at, sources: SR, kernel: K2, rot: RC, selfW: 4, v: vR }), f = B.Wsrc / (B.Wsrc + 4);
    S.selfFactor = { uRel: Math.max(relD(B.u[0], f * A.u[0]), relD(B.u[1], f * A.u[1])), dRel: Math.max(relD(B.dRel[0], f * (A.u[0] - vR[0])), relD(B.dRel[1], f * (A.u[1] - vR[1]))) }; }
  // ⑦ 定常の輸送と円軌道の読み: u = Ω_f(R) R φ̂ の J を手で置く(受け手 (R, 0))→ a_R = −Ω_f²R − ω_z(v − Ω_f R)・第331便b の枠の式(ω_f = ω_z − Ω_f)と同じ・根は g = Ω²R + a_R・rigid は第331便b
  { const rows = [];
    for (const [Rr, Of, dOf, g] of [[2, 0.3, -0.05, 0.9], [5, 0.11, 0.02, 0.2], [1.3, -0.4, 0.3, 2.5], [3, 0.2, 0, 0.6]]) {
      const uPhi = Of * Rr, J = [[0, -Of], [Of + Rr * dOf, 0]], omegaZ = 2 * Of + Rr * dOf;
      const circ = circularVelocity({ g, R: Rr, uPhi, omegaZ }), Om = circ.vContinuum / Rr;
      const tr = transportSteady({ u: [0, uPhi], J, v: [0, circ.vContinuum] }), aR = tr.a[0];
      const fd = CF.frameDemand({ R: Rr, Omega: Om, OmegaF: Of, omegaF: omegaZ - Of });
      rows.push({ R: Rr, aRvsFormula: relD(aR, -Of * Of * Rr - omegaZ * (circ.vContinuum - uPhi)), aRvsFrame: relD(aR, fd.demand - Om * Om * Rr), balance: relD(g, Om * Om * Rr + aR),
        rigid: relD(circ.vRigid, Math.sqrt(g * Rr) + uPhi), frameCheck: Math.abs(circ.frameCheck), curl: relD(tr.curl, omegaZ) });
    }
    const rg = rows[3]; const rigidRoot = circularVelocity({ g: 0.6, R: 3, uPhi: 0.6, omegaZ: 0.4 });
    S.steadyCircular = { rows, maxRel: Math.max(...rows.flatMap((r) => [r.aRvsFormula, r.aRvsFrame, r.balance, r.rigid, r.frameCheck, r.curl])), rigidFieldContinuumEqRigid: relD(rigidRoot.vContinuum, rigidRoot.vRigid), rgR: rg.R }; }
  // ⑧ 鏡の対称の配置(中心 + 方位 12 点の環 2 本 —— 源は円運動)で受け手 (R, 0) の動径の成分と J_xx・J_yy が 0(x 軸の鏡の対称 —— 離散の環は連続の軸対称ではないので J_xy = −u_φ/R は門にしない)
  { const src = [{ x: 0, y: 0, vx: 0, vy: 0, m: 10, spin: 0.8, R: 0.5 }];
    for (const [Rr, vv] of [[1.5, 2], [3.5, 1.4]]) for (let k = 0; k < 12; k++) { const f = 2 * Math.PI * k / 12; src.push({ x: Rr * Math.cos(f), y: Rr * Math.sin(f), vx: -vv * Math.sin(f), vy: vv * Math.cos(f), m: 0.4, spin: 0, R: 0.1 }); }
    const rows = [];
    for (const K of [K1, K2]) for (const Rt of [RD, RC]) { const F = frameField({ at: [2.4, 0], sources: src, kernel: K, rot: Rt, bg: 0.5 }), sc = Math.max(Math.abs(F.u[1]), 1e-300), sj = Math.max(Math.abs(F.J[1][0]), Math.abs(F.J[0][1]));
      rows.push({ kernel: K.name, rot: Rt.type, uR: Math.abs(F.u[0]) / sc, Jdiag: Math.max(Math.abs(F.J[0][0]), Math.abs(F.J[1][1])) / sj }); }
    S.axisymmetric = { rows, maxRel: Math.max(...rows.flatMap((r) => [r.uR, r.Jdiag])) }; }
  // ⑨ k_F = 0 で輸送 0・k_F の一般(J u の項は k_F 倍・コリオリは w = v − k_F u)
  { const F = frameField({ at, sources: SR, kernel: K1, rot: RD, bg: 1.5 }), t0 = transportSteady({ u: F.u, J: F.J, v: vR, kF: 0 }), t2 = transportSteady({ u: F.u, J: F.J, v: vR, kF: 0.5 });
    const conv = [F.J[0][0] * F.u[0] + F.J[0][1] * F.u[1], F.J[1][0] * F.u[0] + F.J[1][1] * F.u[1]], wx = vR[0] - 0.5 * F.u[0], wy = vR[1] - 0.5 * F.u[1];
    S.kFrame = { zero: Math.max(Math.abs(t0.a[0]), Math.abs(t0.a[1])), half: Math.max(relD(t2.a[0], 0.5 * (conv[0] - F.curl * wy)), relD(t2.a[1], 0.5 * (conv[1] + F.curl * wx))) }; }
  // ⑩ 局所のべき(べき乗の場 —— 不等間隔)と比の要約
  { const R = [1, 1.3, 2, 2.2, 3.5, 5, 8], f = R.map((r) => 3 * Math.pow(r, -0.7)), sl = localSlopes(R, f), rs = ratioSummary([1, 2, -3, 4], [2, 2, 3, 8]);
    S.slopes = { maxErr: Math.max(...sl.map((s) => Math.abs(s + 0.7))), signNull: localSlopes([1, 2, 3], [1, -1, 2]).every((s) => s === null), ratio: rs }; }
  // ⑪ 自己の重みの規則: kappaM = 10Gm/(C₁c²)(第330便b)・kappaD = 2Gm/c² の比 5/C₁・book は宣言の値
  { const a = selfWeightOf({ shape: 'point', rule: 'kappaM', m: 2, G: 0.8, c: 30 }), b = selfWeightOf({ shape: 'point', rule: 'kappaD', m: 2, G: 0.8, c: 30 }), c2 = selfWeightOf({ shape: 'ballMean', rule: 'book', m: 2, G: 0.8, c: 30, Rbook: 0.5 });
    S.selfRules = { ratioRdOverKd: a.R / b.R, wBook: relD(c2.w, (9 / 4) * 2 / 0.25), kappaM: relD(a.R, W.kappaMRadius(2, 0.8, 30)) }; }
  // ⑫ 入力の拒否
  { const bad = [() => kernelOf('xx'), () => kernelOf('geo2', -1), () => frameField({ at: [0, 0], sources: [{ x: 0, y: 0, vx: 0, vy: 0, m: 1, spin: 0, R: 1 }], kernel: K2, rot: RC }),
      () => frameField({ at, sources: [], kernel: K2, rot: RC }), () => frameField({ at, sources: SR, kernel: { p: 3, eps: 0 }, rot: RC }), () => frameField({ at, sources: SR, kernel: K1, rot: { type: 'spin' } }),
      () => frameField({ at, sources: [{ x: 1, y: 1, vx: 0, vy: 0, m: 1, spin: 1, R: 0 }], kernel: K1, rot: RD }), () => frameField({ at, sources: SR, kernel: K1, rot: RD, bg: -1 }),
      () => selfWeightOf({ shape: 'point', rule: 'book', m: 1, G: 1, c: 1 }), () => selfWeightOf({ shape: 'point', rule: 'radius', m: 1, G: 1, c: 1 }), () => circularVelocity({ g: -1, R: 1, uPhi: 0, omegaZ: 0 }),
      () => polar([0, 0], [1, 0])];
    let n = 0; for (const f of bad) { try { f(); } catch (e) { if (e instanceof RangeError) n++; } }
    S.reject = { n, of: bad.length }; }
  return S;
}
export function pureGates(S) {
  const tol = DECL.idTol;
  return {
    normalize: S.normalize.uErr <= tol * 10 && Math.abs(S.normalize.shareSum - 1) <= tol,
    galilean: S.galilean.uShift <= tol * 10 && S.galilean.Jsame <= tol * 10 && S.galilean.e3Shift <= tol * 10,
    gradient: S.gradient.rows.length === 6 && S.gradient.maxRel <= DECL.fdTol,
    q0IsCoord: S.q0IsCoord.du === 0 && S.q0IsCoord.dJ === 0,
    coordTwistLink: S.coordTwistLink.uRel <= tol && S.coordTwistLink.dRel <= tol && Math.abs(S.coordTwistLink.alpha - S.coordTwistLink.shareSelf) <= tol,
    selfFactor: S.selfFactor.uRel <= tol && S.selfFactor.dRel <= tol * 10,
    steadyCircular: S.steadyCircular.maxRel <= tol * 10 && S.steadyCircular.rigidFieldContinuumEqRigid <= tol,
    axisymmetric: S.axisymmetric.rows.length === 4 && S.axisymmetric.maxRel <= 1e-12,
    kFrame: S.kFrame.zero === 0 && S.kFrame.half <= tol,
    slopes: S.slopes.maxErr <= 1e-9 && S.slopes.signNull && S.slopes.ratio.signFlips === 1 && S.slopes.ratio.n === 4,
    selfRules: Math.abs(S.selfRules.ratioRdOverKd - 5 / 0.8431) < 1e-3 && S.selfRules.wBook <= tol && S.selfRules.kappaM <= tol,
    reject: S.reject.n === S.reject.of,
  };
}

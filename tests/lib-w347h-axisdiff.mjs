// 第347便h(原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R407):
//   **軸引きずりの型を候補から探す —— 並進引きずりの枠の速度の場 u(r) の、受け手の部位差分から回転を作る候補 5 つ(2 点の差分・3 軸 6 点の差分・中心の ½ ∇×u・
//   勾配の分け方・球の中の重みつきの平均)と比べる列(2 倍角の則・緯度の引数)、自転 =「慣性回転」+「引きずり回転」の帳簿、ジャイロトルクの式の案の向きの読みの列、
//   エネルギーの行き先の 2 列と最後の文の読み 2 列の純関数 —— 診断だけ**
//   (器 tests/exp-w347h-axisdiff.mjs と QA behavior.axisdiff347h・docs.axisdiff347h が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第347便e(geometry・t1Table・t2Scale・observedRates・judgeSigned —— 3 値は第341便c の型)・第337便l(twoAngleAxis)・
//   第337便c(BODY_SRC)・第341便f(熱の物差し・天体の行)・第342便e(天体の行)。並進引きずりの枠の速度の式は第321便a の lib の frameAtPoint3(アプリの行の写し)と同じ形を
//   本 lib に重みのべき p つきで書き、p = 1(frameWeight "share")で第321便a の lib と照合する(QA behavior.axisdiff347h)。
//
// ■ 枠の速度の場(今のアプリの形 —— 第321便a の lib の写しの式): u(r) = Σ w_j c_j ÷ (D₀ + Σ w_j)・c_j = v_j + ω_j(d) × (r − r_j)・ω_j(d) = s_j (R_j/(R_j + d))^q・
//   w_j = m_j (d² + ε²)^(−p/2)(p = 1 が "share"・p = 2 は比べる列 —— アプリの "pull" の分母〔D0pull〕は本 lib に写していない)。
//   勾配 J_ab = ∂u_a/∂x_b = (∂P_a/∂x_b − u_a ∂W/∂x_b) ÷ W(解析 —— 第321便a の lib と同じ項)。
// ■ 軸引きずりの回転の候補(受け手の半径 R_b・中心 r_c・ê = 源から受け手への向き):
//   (P2) 2 点の差分(原文の案): Ω = ê × (u(r_c + R_b ê) − u(r_c − R_b ê)) ÷ (2 R_b) —— ê のまわりの回転(Ω·ê)はこの型では見えない(剛体の場で Ω₀ − ê(ê·Ω₀))。
//   (P6) 3 軸 6 点の差分: Ω = ½ Σ_k ê_k × (u(r_c + R_b ê_k) − u(r_c − R_b ê_k)) ÷ (2 R_b)(R_b → 0 で (W))。
//   (W) 中心での ½ ∇×u。(G) 勾配の全部を反対称(回転 —— (W) と同じ)と対称(ずれ —— トレースを除いた大きさを別の列)に分ける。
//   (V) 球の中の重みつきの平均: Ω = ∫ρ r′ × u dV ÷ ((2/3) ∫ρ r′² dV)(ρ = (1 − (r′/(λ R_b))²)^n —— 密度の形 n と半径 λ のノブ)。
//   比べる列: 2 倍角の則の作用の軸 â = 2(ŝ·r̂) r̂ − ŝ(緯度の引数 —— 第347便e の主の候補)。
// ■ 自転 = 慣性回転 + 引きずり回転(原文 —— 帳簿): ω_自転 = ω_慣性 + ω_引きずり。平行な成分 Ω∥ = (Ω·ŝ_b) ŝ_b を引きずり回転に計上する型 2 つ:
//   (L1) その時々の値をそのまま持つ(ω_引きずり = Ω∥)/(L2) 時定数 τ のノブで寄る(dω_引きずり/dt = (Ω∥ − ω_引きずり) ÷ τ)。直交する成分 Ω⊥ はジャイロトルクの側。
// ■ ジャイロトルクの向きの読み(大きさは原文の I·ω_自転·Ω⊥ —— 向きは決めない):
//   (g1) 枠に運ばれる(dŝ/dt = Ω × ŝ —— トルク無し)/(g2+) τ = Ω⊥ × L(dŝ/dt = Ω⊥ × ŝ)/(g2−) τ = L × Ω⊥/(g3) τ = I ω (k_g Ω⊥ × ŝ + k_d Ω⊥)
//   (k_d の項が軸を Ω の向きへ起こす —— 第347便e の C2 の k〔ジャイロの項〕と b〔散逸の項〕に当たる 2 つのノブ)。
// ■ エネルギーの行き先: 軸が動かなかった分の率 P = (1 − f) I ω Ω⊥²(f = 動いた割合のノブ)。内部熱へ h・慣性回転へ 1 − h(割合のノブ)。
//   最後の文の読み: (R1) I は固定(角運動量 I ω が増えてトルクが増す)/(R2) I = I₀ (1 + ε (ω/ω₀)²)(扁平 —— ε のノブ)。
// ■ 言わないこと: 軸引きずりの型・向き・歳差・内部熱の答えとは書かない。この候補・この例・このノブでは、の表。観測の値は固定の比べる列(合わせない)。
//   文献の値はリポジトリの中の値(文献の値・未照合)。地球の歳差の率は文献の値・未照合(比べる列 —— 合わせない)。
import * as E from './lib-w347e-spintorque.mjs';
import * as BV from './lib-w337l-bevel.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as F from './lib-w341f-gyroheat.mjs';
import * as P from './lib-w342e-powerball.mjs';

export const LIB_VERSION = 'w347h-axisdiff-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  cands: Object.freeze(['P2', 'P6', 'W', 'G', 'V']),
  /** (i) 自転する源(静止・無次元: m = 1・R_s = 1・s = 1・軸 +z) */
  spin: Object.freeze({ p: Object.freeze([1, 2]), q: Object.freeze([2, 3]), D0: Object.freeze([0, 0.01, 0.1]), d: Object.freeze([3, 10, 30]), lat: Object.freeze([0, 30, 60, 90]), Rb: 0.1, eps: 0 }),
  /** (ii) 自転しない源が横を通り過ぎる(直線・源 (v t, b, 0)・速度 (v, 0, 0)・受け手は原点) */
  fly: Object.freeze({ p: Object.freeze([1, 2]), D0: Object.freeze([0, 0.01, 0.1]), b: Object.freeze([3, 10, 30]), v: Object.freeze([0.01, 0.1]), m: Object.freeze([1, 2]), Rb: 0.1, nT: 96, q: 2 }),
  /** (iii) 自転する源のまわりを公転する受け手(円・半径 a・傾き i・源は重心のまわりを μ の割合で動く) */
  orb: Object.freeze({ a: 10, vRel: 0.1, inc: Object.freeze([0, 30, 60]), D0: Object.freeze([0, 0.1]), q: Object.freeze([2, 3]), mu: Object.freeze([0, 0.1]), p: 1, Rb: 0.1, nPhase: 360 }),
  /** (iv) 天体の表(第347便e の 15 組)—— D₀ = 0・源 1 つ(重みは打ち消し合う)・q 2 つ・1 公転の平均 */
  bodyQ: Object.freeze([2, 3]), bodyPhase: 360,
  /** (V) の密度の形と半径・求積 */
  vN: Object.freeze([0, 1]), vLambda: 1, quad: Object.freeze({ nr: 6, nth: 8, nph: 16 }),
  /** T3 の (L2) の時定数(通過の時間 b/v の倍) */
  tauOverPass: Object.freeze([0.3, 1, 3]),
  /** T4 の (g3) のノブ(第347便e の C2 の (k, b) に当たる)と届くまで(角が 1% まで) */
  g3: Object.freeze([Object.freeze([1, 0]), Object.freeze([0, 1]), Object.freeze([1, 0.1])]), reachFrac: 0.01,
  /** T5 の格子 */
  energy: Object.freeze({ f: Object.freeze([0, 0.5, 0.9]), h: Object.freeze([0, 0.5, 1]), eps: Object.freeze([0, 0.1]), T: 10, steps: 4000, w0: 1, Wperp: 1 }),
  /** 3 値の判定の物差し(第347便e の lib の judgeSigned —— 第341便c の型) */
  judge: 'lib-w347e-spintorque.mjs の judgeSigned(尺度 = 打ち消し得る項の大きさの和 × 2⁻⁵²・係数 4)',
});

/** 文献の値(固定の比べる列 —— 合わせない) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料に当たっていない)',
  earthPrecArcsecPerYr: 50.29, earthPrecSrc: '地球の一般歳差(黄経)の率 —— IAU 2006 の歳差の値の桁(文献の値・未照合)',
  saturnR: 58232000, saturnRsrc: '第341便f の lib の土星の行',
  uranus: E.LIT.uranus, neptune: E.LIT.neptune,
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) / D2R;
/** a に直交する単位ベクトル 2 つ */
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
/** ガウス・ルジャンドルの点と重み([−1, 1]) */
export function gaussLegendre(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), dp = 0;
    for (let it = 0; it < 100; it++) { let p0 = 1, p1 = z; for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      dp = n * (z * p1 - p0) / (z * z - 1); const dz = p1 / dp; z -= dz; if (Math.abs(dz) < 1e-16) break; }
    x.push(z); w.push(2 / ((1 - z * z) * dp * dp));
  }
  return { x, w };
}
const GLQ = Object.freeze({ r: gaussLegendre(DECL.quad.nr), th: gaussLegendre(DECL.quad.nth) });

/* ───────── 枠の速度の場 ───────── */
/**
 * 場を作る。sources: [{m, R, spin:[3](表面の角速度のベクトル s_j â_j), r:[3], v:[3]}]・D0・p(重みのべき)・q(引きずり減衰)・eps(ソフトニング)。
 * rigid: {V:[3], Om:[3]} を渡すと u = V + Ω₀ × r の場(零試験の入力)。戻り値 { u(r), J(r) }。
 */
export function makeField({ sources = [], D0 = 0, p = 1, q = 2, eps = 0, rigid = null } = {}) {
  if (rigid) {
    if (!(isVec(rigid.V) && isVec(rigid.Om))) throw new RangeError('makeField: rigid の V・Om');
    const Om = rigid.Om;
    return { u: (r) => add(rigid.V, crs(Om, r)), J: () => [0, -Om[2], Om[1], Om[2], 0, -Om[0], -Om[1], Om[0], 0] };
  }
  if (!(Array.isArray(sources) && sources.every((s) => fin(s.m) && s.m >= 0 && fin(s.R) && s.R > 0 && isVec(s.spin) && isVec(s.r) && isVec(s.v)) && fin(D0) && D0 >= 0 && fin(p) && p > 0 && fin(q) && fin(eps) && eps >= 0))
    throw new RangeError('makeField: 源の宣言(m ≥ 0・R > 0・spin・r・v)・D0 ≥ 0・p > 0・q・eps');
  const term = (s, r, grad) => {
    const rx = r[0] - s.r[0], ry = r[1] - s.r[1], rz = r[2] - s.r[2], d2 = rx * rx + ry * ry + rz * rz, d = Math.sqrt(d2), dd = d2 + eps * eps;
    const w = s.m * Math.pow(dd, -p / 2), tt = s.R / (s.R + d), g = Math.pow(tt, q), om = scl(s.spin, g), rr = [rx, ry, rz];
    const c = add(s.v, crs(om, rr));
    if (!grad) return { w, c };
    const gw = scl(rr, -p * s.m * Math.pow(dd, -p / 2 - 1)), n = d > 0 ? scl(rr, 1 / d) : [0, 0, 0], omp = scl(om, -q / (s.R + d)), Q = crs(omp, rr);
    const Ex = [0, -om[2], om[1], om[2], 0, -om[0], -om[1], om[0], 0], dP = new Array(9);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) dP[3 * a + b] = gw[b] * c[a] + w * (Ex[3 * a + b] + Q[a] * n[b]);
    return { w, c, dP, dW: gw };
  };
  const u = (r) => { let W = D0, Pv = [0, 0, 0]; for (const s of sources) { const T = term(s, r, false); W += T.w; Pv = add(Pv, scl(T.c, T.w)); } return W > 0 ? scl(Pv, 1 / W) : [0, 0, 0]; };
  const J = (r) => {
    let W = D0, Pv = [0, 0, 0]; const dP = new Array(9).fill(0), dW = [0, 0, 0];
    for (const s of sources) { const T = term(s, r, true); W += T.w; Pv = add(Pv, scl(T.c, T.w)); for (let k = 0; k < 9; k++) dP[k] += T.dP[k]; for (let k = 0; k < 3; k++) dW[k] += T.dW[k]; }
    if (!(W > 0)) return new Array(9).fill(0);
    const uu = scl(Pv, 1 / W), out = new Array(9);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) out[3 * a + b] = (dP[3 * a + b] - uu[a] * dW[b]) / W;
    return out;
  };
  return { u, J };
}
export const curlOf = (J) => [J[7] - J[5], J[2] - J[6], J[3] - J[1]];

/* ───────── 候補 ───────── */
/**
 * 候補 cand の回転(ベクトル)。o = { e(源から受け手への単位), Rb, vN, vLambda, mut }。mut は変異の試験だけ('p2sign'・'p6half'・'wsign'・'vnorm')。
 * 戻り値 { Om:[3], shear?(G だけ —— トレースを除いた対称部の大きさ), div?(G だけ) }
 */
export function rotOf(cand, field, rc, o = {}) {
  const Rb = o.Rb, mut = o.mut || null;
  if (!(isVec(rc) && fin(Rb) && Rb > 0)) throw new RangeError('rotOf: r_c・R_b > 0');
  if (cand === 'P2') {
    if (!isVec(o.e)) throw new RangeError('rotOf: P2 の ê');
    const e = unit(o.e), du = sub(field.u(add(rc, scl(e, Rb))), field.u(sub(rc, scl(e, Rb))));
    return { Om: scl(crs(e, du), (mut === 'p2sign' ? -1 : 1) / (2 * Rb)) };
  }
  if (cand === 'P6') {
    const e1 = o.e && isVec(o.e) ? unit(o.e) : [1, 0, 0], [e2, e3] = perpPair(e1);
    let s = [0, 0, 0];
    for (const ek of [e1, e2, e3]) s = add(s, crs(ek, sub(field.u(add(rc, scl(ek, Rb))), field.u(sub(rc, scl(ek, Rb))))));
    return { Om: scl(s, (mut === 'p6half' ? 1 : 0.5) / (2 * Rb)) };
  }
  if (cand === 'W' || cand === 'G') {
    const J = field.J(rc), c = curlOf(J), Om = scl(c, mut === 'wsign' ? -0.5 : 0.5);
    if (cand === 'W') return { Om };
    const tr = J[0] + J[4] + J[8];
    let s2 = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { const sab = 0.5 * (J[3 * a + b] + J[3 * b + a]) - (a === b ? tr / 3 : 0); s2 += sab * sab; }
    return { Om, shear: Math.sqrt(s2), div: tr };
  }
  if (cand === 'V') {
    const n = fin(o.vN) ? o.vN : DECL.vN[0], lam = fin(o.vLambda) ? o.vLambda : DECL.vLambda, Rv = lam * Rb, { nph } = DECL.quad;
    let num = [0, 0, 0], den = 0;
    for (let i = 0; i < GLQ.r.x.length; i++) {
      const rr = 0.5 * Rv * (GLQ.r.x[i] + 1), wr = 0.5 * Rv * GLQ.r.w[i] * rr * rr * Math.pow(Math.max(0, 1 - (rr / Rv) * (rr / Rv)), n);
      for (let j = 0; j < GLQ.th.x.length; j++) {
        const ct = GLQ.th.x[j], st = Math.sqrt(1 - ct * ct), wt = GLQ.th.w[j];
        for (let k = 0; k < nph; k++) {
          const ph = 2 * Math.PI * (k + 0.5) / nph, rp = [rr * st * Math.cos(ph), rr * st * Math.sin(ph), rr * ct], wgt = wr * wt * (2 * Math.PI / nph);
          num = add(num, scl(crs(rp, field.u(add(rc, rp))), wgt)); den += wgt * rr * rr;
        }
      }
    }
    return { Om: scl(num, 1 / ((mut === 'vnorm' ? 1 : 2 / 3) * den)) };
  }
  throw new RangeError('rotOf: 候補は ' + DECL.cands.join('・'));
}
const allCands = (field, rc, e, Rb, extra = {}) => Object.fromEntries(DECL.cands.map((c) => [c, rotOf(c, field, rc, Object.assign({ e, Rb }, extra))]));

/* ───────── 例 (i) 自転する源(静止)───────── */
const srcSpin = () => [{ m: 1, R: 1, spin: [0, 0, 1], r: [0, 0, 0], v: [0, 0, 0] }];
export function spinRows() {
  const S = DECL.spin, out = [], zh = [0, 0, 1];
  for (const p of S.p) for (const q of S.q) for (const D0 of S.D0) {
    const field = makeField({ sources: srcSpin(), D0, p, q, eps: S.eps });
    for (const d of S.d) for (const lat of S.lat) {
      const rh = [Math.cos(lat * D2R), 0, Math.sin(lat * D2R)], rc = scl(rh, d), C = allCands(field, rc, rh, S.Rb), a2 = BV.twoAngleAxis(zh, rh);
      const row = { p, q, D0, d, lat };
      const tiny = 4 * Math.pow(2, -52) * d / S.Rb, snap = (x) => (Math.abs(x) <= tiny ? 0 : x);   // 丸めの桁(3 値の尺度と同じ物差し)の内は 0 と書く
      for (const c of DECL.cands) { const Om = C[c].Om, par = snap(dot(Om, zh)), perp = snap(nrm(sub(Om, scl(zh, dot(Om, zh))))), mag = Math.hypot(par, perp);
        row[c] = { par, perp, mag, judge: E.judgeSigned(dot(Om, zh), d / S.Rb), vsTwoAngleDeg: mag > 0 ? angDeg(add(scl(zh, par), scl(unit(sub(Om, scl(zh, dot(Om, zh))).map((x, k) => (perp > 0 ? x : [1, 0, 0][k]))), perp)), a2) : null }; }
      row.G.shear = snap(C.G.shear); row.G.div = snap(C.G.div);
      row.twoAngle = { par: dot(a2, zh), perp: nrm(sub(a2, scl(zh, dot(a2, zh)))) };
      out.push(row);
    }
  }
  return out;
}
/** (i) のまとめ: 組(p・q・D₀・d)ごとに、赤道の符号・軸の上の値・赤道 ÷ 軸の大きさ(候補ごと) */
export function spinSummary(rows) {
  const keys = [...new Set(rows.map((r) => [r.p, r.q, r.D0, r.d].join('|')))], out = [];
  for (const k of keys) {
    const R = rows.filter((r) => [r.p, r.q, r.D0, r.d].join('|') === k), eq = R.find((r) => r.lat === 0), ax = R.find((r) => r.lat === 90), o = { p: eq.p, q: eq.q, D0: eq.D0, d: eq.d };
    for (const c of DECL.cands) { const az = ax[c].mag === 0;   // 軸の上で 0(丸めの桁の内 —— 3 値の尺度と同じ物差し)
      o[c] = { eqJudge: eq[c].judge, eqPar: eq[c].par, axisJudge: ax[c].judge, axisZero: az, axisPar: az ? 0 : ax[c].par, eqOverAxis: az ? null : eq[c].mag / ax[c].mag, eqStronger: az ? true : eq[c].mag > ax[c].mag }; }
    out.push(o);
  }
  return out;
}

/* ───────── 例 (ii) 自転しない源が横を通り過ぎる ───────── */
/** 時間の点(t = (b/v) tan θ・θ はガウス・ルジャンドル)での候補の回転の z 成分と、通過の全体での積分(回った角) */
export function flyRow({ p, D0, b, v, m, cands = DECL.cands }) {
  const Fy = DECL.fly, gl = gaussLegendre(Fy.nT), out = { p, D0, b, v, m };
  const acc = Object.fromEntries(cands.map((c) => [c, { intZ: 0, intPerp: 0, peakZ: 0 }])); let scale = 0;   // 3 値の尺度: ∫ abs(u)/R_b dt(打ち消し得る速度の差の大きさ)
  for (let i = 0; i < gl.x.length; i++) {
    const th = 0.5 * Math.PI * gl.x[i], t = (b / v) * Math.tan(th), dtdth = (b / v) / (Math.cos(th) * Math.cos(th)), wq = 0.5 * Math.PI * gl.w[i] * dtdth;
    const rs = [v * t, b, 0], field = makeField({ sources: [{ m, R: 1, spin: [0, 0, 0], r: rs, v: [v, 0, 0] }], D0, p, q: Fy.q }), e = unit(scl(rs, -1));
    scale += wq * nrm(field.u([0, 0, 0])) / Fy.Rb;
    for (const c of cands) { const Om = rotOf(c, field, [0, 0, 0], { e, Rb: Fy.Rb }).Om; acc[c].intZ += wq * Om[2]; acc[c].intPerp += wq * Math.hypot(Om[0], Om[1]); if (Math.abs(Om[2]) > Math.abs(acc[c].peakZ)) acc[c].peakZ = Om[2]; }
  }
  for (const c of cands) { const jz = E.judgeSigned(acc[c].intZ, scale); out[c] = Object.assign(acc[c], { judge: jz, intZshown: jz === 'unresolved' ? 0 : acc[c].intZ }); }
  out.scale = scale;
  // 閉じた形((W)・D₀ > 0): Ω_z = ½ h′(d) b v ÷ d・h = w/(D₀ + w) —— 積分は v に依らない: ∫ ½ h′(d) b/d ds
  return out;
}
export function flyRows() {
  const Fy = DECL.fly, out = [];
  for (const p of Fy.p) for (const D0 of Fy.D0) for (const b of Fy.b) for (const v of Fy.v) for (const m of Fy.m) out.push(flyRow({ p, D0, b, v, m }));
  return out;
}

/* ───────── 例 (iii) 公転する受け手(自転する源 + 源の重心のまわりの動き)———— 1 公転の平均 ───────── */
export function orbRows() {
  const O = DECL.orb, out = [], zh = [0, 0, 1];
  for (const q of O.q) for (const D0 of O.D0) for (const inc of O.inc) for (const mu of O.mu) {
    const n = [Math.sin(inc * D2R), 0, Math.cos(inc * D2R)], x = [0, 1, 0], y = crs(n, x);
    const acc = { spin: [0, 0, 0], trans: [0, 0, 0], both: [0, 0, 0], P2both: [0, 0, 0] };
    for (let k = 0; k < O.nPhase; k++) {
      const ph = 2 * Math.PI * (k + 0.5) / O.nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = add(scl(x, -Math.sin(ph)), scl(y, Math.cos(ph)));
      const rRel = scl(rh, O.a), rs = scl(rRel, -mu), rb = scl(rRel, 1 - mu), vs = scl(vh, -mu * O.vRel);
      const mk = (spin, v) => makeField({ sources: [{ m: 1, R: 1, spin, r: rs, v }], D0, p: O.p, q });
      const Ws = rotOf('W', mk([0, 0, 1], [0, 0, 0]), rb, { Rb: O.Rb }).Om, Wt = rotOf('W', mk([0, 0, 0], vs), rb, { Rb: O.Rb }).Om, f2 = mk([0, 0, 1], vs), Wb = rotOf('W', f2, rb, { Rb: O.Rb }).Om;
      const P2 = rotOf('P2', f2, rb, { e: rh, Rb: O.Rb }).Om;
      acc.spin = add(acc.spin, scl(Ws, 1 / O.nPhase)); acc.trans = add(acc.trans, scl(Wt, 1 / O.nPhase)); acc.both = add(acc.both, scl(Wb, 1 / O.nPhase)); acc.P2both = add(acc.P2both, scl(P2, 1 / O.nPhase));
    }
    const comp = (V) => ({ s: dot(V, zh), n: dot(V, n), mag: nrm(V) });
    out.push({ q, D0, inc, mu, spin: comp(acc.spin), trans: comp(acc.trans), both: comp(acc.both), P2both: comp(acc.P2both), sumDiff: nrm(sub(acc.both, add(acc.spin, acc.trans))) });
  }
  return out;
}

/* ───────── 例 (iv) 天体の表(第347便e の 15 組)───────── */
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);
const radiusOf = (id) => (TL.BODY_SRC[id] && TL.BODY_SRC[id].R ? TL.BODY_SRC[id].R[0] : id === 'Saturn' ? LIT.saturnR : id === 'Uranus' ? LIT.uranus.R : id === 'Neptune' ? LIT.neptune.R : null);
export function bodyRows(T1 = E.t1Table()) {
  const GEO = E.geometry(), out = [];
  for (const [id, src] of E.DECL.pairs) {
    const r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2'), g = GEO[id + '|' + src];
    const ws = r2.OmegaT, beta = r2.Om1 / ws, Ms = TL.BODY_SRC[srcId(src)].M[0], Rs = radiusOf(srcId(src)), Rb = radiusOf(id), a = G * Ms / (beta * C0 * C0);
    const s = unit(g.s), n = unit(g.n), w = unit(g.w), x0 = crs(s, n), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(n)[0], y = crs(n, x);
    for (const q of DECL.bodyQ) {
      const field = makeField({ sources: [{ m: 1, R: Rs, spin: scl(s, ws), r: [0, 0, 0], v: [0, 0, 0] }], D0: 0, p: 1, q });
      let mW = [0, 0, 0], mP = [0, 0, 0];
      for (let k = 0; k < DECL.bodyPhase; k++) {
        const ph = 2 * Math.PI * (k + 0.5) / DECL.bodyPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), rc = scl(rh, a);
        mW = add(mW, scl(rotOf('W', field, rc, { Rb }).Om, 1 / DECL.bodyPhase)); mP = add(mP, scl(rotOf('P2', field, rc, { e: rh, Rb }).Om, 1 / DECL.bodyPhase));
      }
      const parW = dot(mW, w), perpW = nrm(sub(mW, scl(w, parW))), parP = dot(mP, w), perpP = nrm(sub(mP, scl(w, parP)));
      out.push({ id, src, q, a, Rs, Rb, omega: r2.omega, I: r2.I, retro: r2.retro, oblDeg: r2.oblDeg, incDeg: r2.incDeg, Wvec: mW, P2vec: mP, Wpar: parW, Wperp: perpW, P2par: parP, P2perp: perpP,
        WparYr: parW * YR, WperpYr: perpW * YR, WparOverOmega: parW / r2.omega, angSpinOmegaDeg: nrm(mW) > 0 ? angDeg(w, mW) : null, angSrcOmegaDeg: nrm(mW) > 0 ? angDeg(s, mW) : null,
        judgePar: E.judgeSigned(parW, ws) });   // 尺度 = 源の表面の自転の速さ(場の回転の上の限り)
    }
  }
  return out;
}

/* ───────── T3 自転 = 慣性回転 + 引きずり回転(帳簿) ───────── */
/** (L2) の通過の例: (ii) の (W)・p = 1・D₀ = 0.1・b = 10・v = 0.1・m = 1 の Ω_z(t) を、時定数 τ = (b/v) × k で追う(RK4)。∫ ω_引きずり dt = ∫ Ω∥ dt(指数の濾過は積分を保つ)を数える */
export function ledgerFly({ p = 1, D0 = 0.1, b = 10, v = 0.1, m = 1, tauK = DECL.tauOverPass } = {}) {
  const Tp = b / v, tEnd = 60 * Tp, N = 24000, dt = 2 * tEnd / N;
  const Om = (t) => { const rs = [v * t, b, 0], f = makeField({ sources: [{ m, R: 1, spin: [0, 0, 0], r: rs, v: [v, 0, 0] }], D0, p, q: 2 }); return 0.5 * curlOf(f.J([0, 0, 0]))[2]; };
  const rows = [];
  let peakL1 = 0, intL1 = 0;
  for (let k = 0; k <= N; k++) { const t = -tEnd + k * dt, o = Om(t), wgt = k === 0 || k === N ? 0.5 : 1; intL1 += wgt * o * dt; if (Math.abs(o) > Math.abs(peakL1)) peakL1 = o; }
  for (const kk of tauK) {
    const tau = kk * Tp; let wd = 0, peak = 0, intL2 = 0;
    for (let k = 0; k < N; k++) {
      const t = -tEnd + k * dt, f1 = (tt, x) => (Om(tt) - x) / tau;
      const k1 = f1(t, wd), k2 = f1(t + dt / 2, wd + dt / 2 * k1), k3 = f1(t + dt / 2, wd + dt / 2 * k2), k4 = f1(t + dt, wd + dt * k3), w1 = wd + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
      intL2 += 0.5 * (wd + w1) * dt; wd = w1; if (Math.abs(wd) > Math.abs(peak)) peak = wd;
    }
    rows.push({ tauOverPass: kk, peakL2: peak, intL2, endL2: wd, intRel: (intL2 - intL1) / Math.abs(intL1) });
  }
  return { p, D0, b, v, m, passTime: Tp, peakL1, intL1, rows };
}
/** どの項が何を持つか(帳簿の行 —— 表の素) */
export const LEDGER = Object.freeze([
  Object.freeze({ term: '並進引きずり(中心の移送)', field: 'u(r_c)(場の 0 次)', holds: '受け手の中心の位置の移送', note: '今のアプリの並進引きずりの步(中心の 1 点)' }),
  Object.freeze({ term: '源の回転の分(E3 の ω_j)', field: 'ω_j(d) × (r − r_j)(c_j の項)', holds: '源の自転が場 u に入る所', note: '源の側の量 —— 受け手の回転ではない(場を作る側)' }),
  Object.freeze({ term: '軸引きずりの回転 Ω(本枝の候補)', field: 'u の受け手の部位差分(場の 1 次の反対称部)', holds: '受け手の回転', note: '中心の移送(0 次)とは別の次数 —— 同じ量を 2 度数えない形' }),
  Object.freeze({ term: '引きずり回転 ω_引きずり', field: 'Ω∥ = (Ω·ŝ_b) ŝ_b', holds: '自転の速さの、引きずりの分', note: '(L1) その時々の値・(L2) 時定数で寄る' }),
  Object.freeze({ term: 'ジャイロトルク', field: 'Ω⊥ = Ω − Ω∥', holds: '自転の軸の向き(歳差・起こす)', note: '向きの読みは (g1)〜(g3) の列' }),
  Object.freeze({ term: '慣性回転 ω_慣性', field: '—(場から直接は来ない)', holds: '自転の速さの、慣性の分', note: 'エネルギーの行き先の 1 つ(表 15)' }),
  Object.freeze({ term: 'ずれ(対称部)', field: '場の 1 次の対称部(G の列)', holds: 'どの項にも入れていない', note: '形を変える成分 —— 潮汐の型の候補(本枝では数えるだけ)' }),
]);

/* ───────── T4 ジャイロトルクの向きの読み ───────── */
/** ŝ を時間で追う(Ω は一定)。read = g1・g2p・g2m・g3(k_g, k_d)。戻り値: 角(ŝ と Ω)の変化・歳差の率(ŝ の Ω のまわりの方位の進み) */
export function gyroTrack(read, { s0, Om, kg = 1, kd = 0, T = 1, steps = 4000 } = {}) {
  if (!['g1', 'g2p', 'g2m', 'g3'].includes(read)) throw new RangeError('gyroTrack: 読みは g1・g2p・g2m・g3');
  if (!(isVec(s0) && isVec(Om))) throw new RangeError('gyroTrack: s0・Om');
  const f = (s) => {
    const par = scl(s, dot(Om, s)), perp = sub(Om, par);
    if (read === 'g1') return crs(Om, s);
    if (read === 'g2p') return crs(perp, s);
    if (read === 'g2m') return scl(crs(perp, s), -1);
    return add(scl(crs(perp, s), kg), scl(perp, kd));   // τ/L(L = I ω —— ŝ の長さを保つ成分だけ)
  };
  let s = unit(s0); const dt = T / steps, oh = unit(Om), [ex, ey] = perpPair(oh), az0 = Math.atan2(dot(s, ey), dot(s, ex)); let az = az0, turns = 0, prev = az0;
  for (let k = 0; k < steps; k++) {
    const k1 = f(s), k2 = f(add(s, scl(k1, dt / 2))), k3 = f(add(s, scl(k2, dt / 2))), k4 = f(add(s, scl(k3, dt)));
    s = unit(add(s, scl(add(add(k1, scl(k2, 2)), add(scl(k3, 2), k4)), dt / 6)));
    const a = Math.atan2(dot(s, ey), dot(s, ex)); let da = a - prev; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; turns += da; prev = a;
  }
  void az;
  return { ang0: angDeg(s0, Om), ang1: angDeg(s, Om), precRate: turns / T, sEnd: s };
}
/** 原文の 3 つの句がどの列で成り立つか(表の素 —— 走らせた値で埋める) */
export function gyroPhrases() {
  const s0 = unit([Math.sin(40 * D2R), 0, Math.cos(40 * D2R)]), Om = [0, 0, 1], T = 1, out = [];
  for (const [read, kg, kd] of [['g1', 0, 0], ['g2p', 0, 0], ['g2m', 0, 0], ['g3', 0, 1], ['g3', 1, 0.1]]) {
    const R = gyroTrack(read, { s0, Om, kg, kd, T }), par = dot(Om, s0), perp = sub(Om, scl(s0, par));
    // 初めのトルクの向き(L = ŝ として τ = dŝ/dt の初め)と Ω⊥ の角(90° なら「90 度ずれた」)
    const tau0 = read === 'g1' ? [0, 0, 0] : read === 'g2p' ? crs(perp, s0) : read === 'g2m' ? scl(crs(perp, s0), -1) : add(scl(crs(perp, s0), kg), scl(perp, kd));
    const tauAngDeg = nrm(tau0) > 0 ? angDeg(tau0, perp) : null;
    out.push({ read, kg, kd, ang0: R.ang0, ang1: R.ang1, dAng: R.ang1 - R.ang0, precRate: R.precRate, tauMag: nrm(tau0), tauAngDeg,
      ninety: tauAngDeg === null ? 'none' : Math.abs(tauAngDeg - 90) < 1e-9 ? 'yes' : Math.abs(tauAngDeg) < 1e-9 ? 'no' : 'mixed', raise: R.ang1 < R.ang0 - 1e-9, precess: Math.abs(R.precRate) > 1e-9 });
  }
  return out;
}
/** 天体の表での歳差の率と届くまでの時間((iv) の (W)・q ごと)と第347便e の (S1) の届くまでの時間(比べる列) */
export function gyroBodies(BR, T2e) {
  const out = [];
  for (const r of BR) {
    const Om = Math.hypot(r.Wvec[0], r.Wvec[1], r.Wvec[2]), th0 = r.angSpinOmegaDeg, e = T2e.find((x) => x.id === r.id && x.src === r.src);
    const edge = !(r.Wperp > 1e-9 * Om);   // 自転の軸と Ω がほぼ平行・反平行(Ω⊥ ≈ 0 —— 届くまでの時間は定まらない)
    const g3 = DECL.g3.map(([kg, kd]) => ({ kg, kd, reachYr: kd > 0 && !edge ? Math.log(Math.tan(th0 * D2R / 2) / Math.tan(DECL.reachFrac * th0 * D2R / 2)) / (kd * Om) / YR : null,
      precRadYr: kg * Om * YR }));
    out.push({ id: r.id, src: r.src, q: r.q, OmegaYr: Om * YR, perpOverOmega: r.Wperp / r.omega, torqueOverL: r.Wperp, precG1RadYr: Om * YR, angSpinOmegaDeg: th0, g3, reachS1e: e ? e.reachS1 : null });
  }
  return out;
}

/* ───────── T5 エネルギーの行き先 ───────── */
/** 自転の速さ ω(t) を RK4 で追う: 慣性回転へ入る率 (1 − h) P・P = (1 − f) I(ω) ω Ω⊥²。R1: I = I₀・R2: I = I₀ (1 + ε (ω/ω₀)²)。帳簿: 熱 + 回転のエネルギーの増し分 = ∫P dt */
export function energyRun({ f, h, eps, read, T = DECL.energy.T, steps = DECL.energy.steps, w0 = DECL.energy.w0, Wp = DECL.energy.Wperp, I0 = 1 }) {
  if (!['R1', 'R2'].includes(read)) throw new RangeError('energyRun: 読みは R1・R2');
  const Iof = (w) => (read === 'R1' ? I0 : I0 * (1 + eps * (w / w0) * (w / w0))), dIdw = (w) => (read === 'R1' ? 0 : 2 * I0 * eps * w / (w0 * w0));
  const Pof = (w) => (1 - f) * Iof(w) * w * Wp * Wp, Erot = (w) => 0.5 * Iof(w) * w * w;
  const dw = (w) => (1 - h) * Pof(w) / (Iof(w) * w + 0.5 * dIdw(w) * w * w);   // dE_rot/dω = I ω + ½ I′ ω²
  let w = w0, heat = 0, work = 0; const dt = T / steps;
  for (let k = 0; k < steps; k++) {
    const k1 = dw(w), w2 = w + dt / 2 * k1, k2 = dw(w2), w3 = w + dt / 2 * k2, k3 = dw(w3), w4 = w + dt * k3, k4 = dw(w4), w1 = w + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    const dWk = dt / 6 * (Pof(w) + 2 * Pof(w2) + 2 * Pof(w3) + Pof(w4));   // 仕事も同じ RK4 の段で(状態を (ω, 仕事) に広げた形)
    work += dWk; heat += h * dWk; w = w1;
  }
  const dErot = Erot(w) - Erot(w0), closed = read === 'R1' ? w0 + (1 - h) * (1 - f) * Wp * Wp * T : null;
  return { f, h, eps, read, wEnd: w, wRatio: w / w0, torqueRatio: (Iof(w) * w) / (Iof(w0) * w0), heat, dErot, work, ledgerResid: (heat + dErot - work) / Math.max(Math.abs(work), 1e-300),
    closedR1: closed, closedDiff: closed === null ? null : Math.abs(w - closed) / closed };
}
export function energyRows() {
  const En = DECL.energy, out = [];
  for (const f of En.f) for (const h of En.h) { out.push(energyRun({ f, h, eps: 0, read: 'R1' })); for (const eps of En.eps.filter((x) => x > 0)) out.push(energyRun({ f, h, eps, read: 'R2' })); }
  return out;
}
/** 熱の窓(イオ・木星・金星): 熱 = h (1 − f) I ω Ω⊥²(h = 1・f = 0 で上の限り)を、源ごとの (iv) の (W) のベクトルの和で。物差しは第341便f の lib の熱 */
export function heatWindow(BR) {
  const PR = P.bodyRows(), out = [];
  for (const id of ['Io', 'Jupiter', 'Venus']) for (const q of DECL.bodyQ) {
    const rows = BR.filter((r) => r.id === id && r.q === q), b = PR.find((x) => x.id === id), w = Math.abs(b.omega);
    const GEO = E.geometry(), key = rows.length ? rows[0].id + '|' + rows[0].src : null, wv = key ? unit(GEO[key].w) : [0, 0, 1];
    const sum = rows.reduce((t, r) => add(t, r.Wvec), [0, 0, 0]), perp = nrm(sub(sum, scl(wv, dot(sum, wv)))), heat = b.I * w * perp * perp;
    out.push({ id, q, srcs: rows.map((r) => r.src).join('+'), Wperp: perp, heatUpper: heat, ruler: F.LIT.heat[id], ratio: F.LIT.heat[id] ? heat / F.LIT.heat[id] : null });
  }
  return out;
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const Rb = 0.1, rc = [3, 1, -2], e = unit([1, 0.5, 0.2]);
  // ① 静止・無回転の源 → 0
  const fStatic = makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 0], r: [0, 0, 0], v: [0, 0, 0] }], D0: 0.1, p: 1, q: 2 });
  const zStatic = Math.max(...DECL.cands.map((c) => nrm(rotOf(c, fStatic, rc, { e, Rb }).Om)));
  // ② 一様な u(D₀ = 0・源 1 つ・無回転で動く → u = v)→ 0
  const fUni = makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 0], r: [0, 0, 0], v: [0.3, -0.2, 0.1] }], D0: 0, p: 1, q: 2 });
  const zUni = Math.max(...DECL.cands.map((c) => nrm(rotOf(c, fUni, rc, { e, Rb }).Om)));
  // ③ 剛体回転の場 u = V + Ω₀ × r → P6・W・G・V は Ω₀・P2 は Ω₀ − ê(ê·Ω₀)
  const Om0 = [0.2, -0.7, 0.4], fRig = makeField({ rigid: { V: [1, 2, 3], Om: Om0 } }), want2 = sub(Om0, scl(e, dot(e, Om0)));
  const rig = Object.fromEntries(DECL.cands.map((c) => [c, nrm(sub(rotOf(c, fRig, rc, { e, Rb }).Om, c === 'P2' ? want2 : Om0)) / nrm(Om0)]));
  const rigV1 = nrm(sub(rotOf('V', fRig, rc, { e, Rb, vN: 1 }).Om, Om0)) / nrm(Om0);
  // ④ 対称な 2 源(±x に同じ速度・無回転・D₀ > 0)→ 中心で 0
  const fSym = makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 0], r: [5, 0, 0], v: [0, 0.2, 0] }, { m: 1, R: 1, spin: [0, 0, 0], r: [-5, 0, 0], v: [0, 0.2, 0] }], D0: 0.1, p: 1, q: 2 });
  const zSym = Math.max(...DECL.cands.map((c) => nrm(rotOf(c, fSym, [0, 0, 0], { e: [1, 0, 0], Rb }).Om)));
  // ⑤ R_b → 0 で (P6)・(V) → (W)(自転する源・q = 3・D₀ = 0.01)
  const fS = makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 1], r: [0, 0, 0], v: [0, 0, 0] }], D0: 0.01, p: 1, q: 3 }), rc5 = [4, 0, 2], W5 = rotOf('W', fS, rc5, { Rb: 1 }).Om;
  const lim = [1e-1, 1e-2, 1e-3].map((rb) => ({ Rb: rb, P6: nrm(sub(rotOf('P6', fS, rc5, { e: unit(rc5), Rb: rb }).Om, W5)) / nrm(W5), V: nrm(sub(rotOf('V', fS, rc5, { Rb: rb }).Om, W5)) / nrm(W5) }));
  // ⑥ 解析の勾配と数の差分(中心差分 h = 1e-5)の一致(源 2 つ・自転・動く・p = 2・q = 2.5・D₀ = 0.05)
  const fM = makeField({ sources: [{ m: 1, R: 1, spin: [0.1, 0.2, 0.9], r: [0, 0, 0], v: [0.1, 0, 0] }, { m: 0.5, R: 0.7, spin: [0, -0.4, 0.3], r: [6, 2, 1], v: [0, 0.05, -0.02] }], D0: 0.05, p: 2, q: 2.5, eps: 0.01 });
  const rc6 = [2, 3, 1], Ja = fM.J(rc6), hh = 1e-5; let jerr = 0, jscale = 0;
  for (let b = 0; b < 3; b++) { const ep = [0, 0, 0]; ep[b] = hh; const up = fM.u(add(rc6, ep)), um = fM.u(sub(rc6, ep)); for (let a = 0; a < 3; a++) { const nd = (up[a] - um[a]) / (2 * hh); jerr = Math.max(jerr, Math.abs(nd - Ja[3 * a + b])); jscale = Math.max(jscale, Math.abs(Ja[3 * a + b])); } }
  // ⑦ (P2) は ê のまわりの回転を見ない(自転する源の軸の上 → 0)
  const fA = makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 1], r: [0, 0, 0], v: [0, 0, 0] }], D0: 0, p: 1, q: 2 }), P2axis = nrm(rotOf('P2', fA, [0, 0, 5], { e: [0, 0, 1], Rb }).Om), Waxis = nrm(rotOf('W', fA, [0, 0, 5], { Rb }).Om);
  // ⑧ ½∇×(f(d) ŝ × r) = f ŝ + ½ f′ d (ŝ − r̂(r̂·ŝ))(D₀ = 0・源 1 つ —— 閉じた形)
  const r8 = [3, 0, 4], d8 = 5, f8 = Math.pow(1 / (1 + d8), 3), fp8 = -3 * f8 / (1 + d8), rh8 = scl(r8, 1 / d8), zh = [0, 0, 1];
  const want8 = add(scl(zh, f8), scl(sub(zh, scl(rh8, dot(rh8, zh))), 0.5 * fp8 * d8)), got8 = rotOf('W', makeField({ sources: [{ m: 1, R: 1, spin: zh, r: [0, 0, 0], v: [0, 0, 0] }], D0: 0, p: 1, q: 3 }), r8, { Rb }).Om;
  // ⑨ 変異で落ちる(剛体の場で)
  const mutFail = { p2sign: nrm(sub(rotOf('P2', fRig, rc, { e, Rb, mut: 'p2sign' }).Om, want2)) / nrm(Om0) > 0.5, p6half: nrm(sub(rotOf('P6', fRig, rc, { e, Rb, mut: 'p6half' }).Om, Om0)) / nrm(Om0) > 0.5,
    wsign: nrm(sub(rotOf('W', fRig, rc, { Rb, mut: 'wsign' }).Om, Om0)) / nrm(Om0) > 0.5, vnorm: nrm(sub(rotOf('V', fRig, rc, { Rb, mut: 'vnorm' }).Om, Om0)) / nrm(Om0) > 0.2 };
  // ⑩ ジャイロの読み: g1・g2± は角を保つ・g3(k_d)は起こす・g1 と g2+ の歳差の率は abs(Ω)
  const gs = unit([Math.sin(50 * D2R), 0, Math.cos(50 * D2R)]), gO = [0, 0, 2];
  const G1 = gyroTrack('g1', { s0: gs, Om: gO, T: 1 }), G2 = gyroTrack('g2p', { s0: gs, Om: gO, T: 1 }), G2m = gyroTrack('g2m', { s0: gs, Om: gO, T: 1 }), G3 = gyroTrack('g3', { s0: gs, Om: gO, kg: 0, kd: 1, T: 1 });
  const gyro = { keepAngle: Math.abs(G1.ang1 - 50) < 1e-9 && Math.abs(G2.ang1 - 50) < 1e-9 && Math.abs(G2m.ang1 - 50) < 1e-9, raise: G3.ang1 < 50, rateG1: G1.precRate, rateG2m: G2m.precRate };
  // g3(k_d)の閉じた形: dθ/dt = −k_d abs(Ω⊥)… abs(Ω⊥) = abs(Ω) sin θ → tan(θ/2) = tan(θ₀/2) e^(−k_d abs(Ω) t)
  const thClosed = 2 * Math.atan(Math.tan(25 * D2R) * Math.exp(-1 * 2 * 1)) / D2R; gyro.raiseClosedDiff = Math.abs(G3.ang1 - thClosed);
  // ⑪ エネルギーの帳簿が閉じる・R1 の閉じた形
  const en = [energyRun({ f: 0.5, h: 0.5, eps: 0, read: 'R1' }), energyRun({ f: 0.2, h: 0.3, eps: 0.1, read: 'R2' }), energyRun({ f: 0, h: 1, eps: 0, read: 'R1' })];
  // ⑫ 拒否
  const rej = [() => makeField({ sources: [{ m: -1, R: 1, spin: [0, 0, 0], r: [0, 0, 0], v: [0, 0, 0] }] }), () => rotOf('P2', fA, [1, 0, 0], { Rb: 0.1 }), () => rotOf('X', fA, [1, 0, 0], { Rb: 0.1 }),
    () => rotOf('W', fA, [1, 0, 0], { Rb: 0 }), () => gyroTrack('g9', { s0: [0, 0, 1], Om: [0, 0, 1] }), () => energyRun({ f: 0, h: 0, eps: 0, read: 'R9' })].map((fn) => { try { fn(); return false; } catch (err) { return err instanceof RangeError; } });
  return { zStatic, zUni, rig, rigV1, zSym, lim, jerr, jscale, P2axis, Waxis, w8diff: nrm(sub(got8, want8)) / nrm(want8), mutFail, gyro, en: en.map((r) => ({ resid: r.ledgerResid, closedDiff: r.closedDiff })), rejects: rej };
}
export function pureGates(S) {
  return {
    staticZero: S.zStatic === 0,
    uniformZero: S.zUni < 1e-15,
    rigid: Object.values(S.rig).every((x) => x < 1e-9) && S.rigV1 < 1e-9,
    symZero: S.zSym < 1e-15,
    limitW: S.lim[2].P6 < 1e-5 && S.lim[2].V < 1e-5 && S.lim[0].P6 > S.lim[2].P6,
    gradient: S.jerr < 1e-8 * S.jscale,
    p2axis: S.P2axis === 0 && S.Waxis > 0,
    curlClosed: S.w8diff < 1e-12,
    mutants: Object.values(S.mutFail).every(Boolean) && Object.keys(S.mutFail).length === 4,
    gyro: S.gyro.keepAngle && S.gyro.raise && Math.abs(S.gyro.rateG1 - 2) < 1e-6 && Math.abs(S.gyro.rateG2m + 2) < 1e-6 && S.gyro.raiseClosedDiff < 1e-6,
    energy: S.en.every((r) => Math.abs(r.resid) < 1e-9) && S.en[0].closedDiff < 1e-12 && S.en[2].closedDiff === 0,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

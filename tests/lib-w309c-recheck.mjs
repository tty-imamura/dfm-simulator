// 第309便c(原仮定者の裁定(第103報)AN357「正確な引きずりを訂正したので AN356 も踏まえて再確認」・〔正確な引きずり(修正版)〕①〜⑧・(第104報)AN362・AN363・
// (第105報)AN364・決断事項 AN357・AN362・AN363・AN364・統括の検証項目 R220): **修正版の引きずり則の参照の純関数**(器 tests/exp-w309c-recheck.mjs が使う)。
//
// エンジン(beta/index.html)とは独立に書いた参照(エンジンの新則の opt-in は第309便a —— 統合の後に統括が照合する)。単位は SI。
//
// ■ 写した規則(第106報で閉じた DECISIONS v68 §0 の一致点)
//   ① 源は一様球(半径 R_d = dragCore の半径・質量 m)。② 各引きずりの大きさは慣性決定力 m/r²(源の球の体積平均 m·A₂(r, R_d))に比例し、**トータルの慣性決定力**
//   W(x) = W_bg′ + W_self(x) + Σ_j m_j A₂(|x − x_j|, R_d,j) で割る(自己は受け手の球のその点の場 —— 分母だけ。W_bg′ は新しい単位 kg/m²・共通の係数 1)。
//   ③ R_d の既定は AN363: 質量 = 天体の全質量・半径 = min(R, 6.5×10⁶ m)(SI でクランプ —— 表示・慣性モーメント・重力の半径は変えない)。
//   ④ 並進: u_i = Σ_j β_ij (V_j − v_i) + r_i、β_ij = ⟨m_j A₂/W⟩_i(受け手の球の体積で**比の平均** —— ⟨N⟩/⟨W⟩ にしない)。源は全速度 V_j・受け手は慣性速度 v_i
//     (今のエンジンの solve の約束 —— 逆写像 v_i = (V_i − Σ_j β_ij V_j − r_i)/(1 − Σ_j β_ij))。
//   ⑤ 回転: 源の球の自転 Ω_j による近い側と遠い側の移動の差 —— r_i = ⟨Σ_j m_j M₂(|x − x_j|, R_d,j) (Ω_j × ê_j)/W⟩_i(M₂ = ⟨(ρ·ê)/|d − ρ|²⟩・遠方の先頭 2R²/(5r³)
//     —— 旧 M1 の 3R²/(5r⁴) とは別の量)。
//   ⑥⑦⑧ 軸: 鏡映の向き b = 2ê(ê·Ω_j) − Ω_j × sinθ(sinθ = |Ω̂_j × ê| —— 構成則)× 符号つきの近遠の動径差分 amp = −∂g/∂r(g = m_j M₂/W・W の勾配〔自己の場を含む〕を含む)
//     × 係数 A(既定 1)。受け手の各体積点で作ってから平均する(比の平均)。比較の型 "span" は受け手の中心を通る ê の線の上の近い表面と遠い表面の差
//     [g(x_c − R ê) − g(x_c + R ê)]/(2R)。負になる点(体積の重み)を診断に残す。
//   AN355・AN364: Ω_obs,i = Ω_I,i + ω_D,i({Ω_I,j})(全源の慣性自転をベクトルで同時に —— 不動点・非収束は例外)・比較の型 "parallel" は観測の軸に平行な分だけ。
//   AN362: 1 步の型 E_axis^cost = ½I|s â − Ω_c|²(Ω_c = Ω_I + ω_D・s = |Ω_c|・â = Ω̂_I —— 大きさを保つ回転の実際の仕事は 0)・E_speed = I(Ω_I·ω_D + ½|ω_D|²)
//     (符号つき —— 正は熱・負は背景からの供給)・熱 Q = E_axis + max(E_speed, 0)。率は 1 步の型 Q/h と τ_hold の型 Q/τ_hold。背景の口座(合成場の流入と復元の流出を別に)。
// ■ 言わないこと: 「観測の自転に合わせた」「熱を説明した」「法則を導いた」(参照の条件 W_bg′ = 0・ε = 0 の診断 —— W_bg′ の同定は後)。
import { dot, cross, norm, add, sub, scale, unit, glNodes, sphereRule } from './lib-w307a-sphereaxial.mjs';
export { dot, cross, norm, add, sub, scale, unit };
export const LIB_VERSION = 'w309c-recheck-lib-1';
export const DRAG_CORE_CAP_SI = 6.5e6;   // AN363 の半径の上限 [m]
const pos = (x) => Number.isFinite(x) && x > 0;

/* ───────── AN363: dragCore の既定(SI でクランプ) ───────── */
export function defaultDragCoreSI(m, R) {
  if (!pos(m) || !pos(R)) throw new Error('defaultDragCoreSI: 正の質量と半径');
  return { m, Rd: Math.min(R, DRAG_CORE_CAP_SI), clamped: R > DRAG_CORE_CAP_SI };
}

/* ───────── 一様球の逆二乗の体積平均 A₂(r, R) = ⟨1/|x − ρ|²⟩ と導関数 ───────── */
// 殻の平均 (1/(2rs)) ln|(r+s)/(r−s)| を球で積んだ閉じた式: A₂ = (3/(2R²))[1 + (1 − x²)/(2x) L]・x = r/R・L = ln|(1+x)/(1−x)|。
// 中心 3/R²・表面 3/(2R²)・遠方 (1/r²) Σ_k 3(R/r)^{2k}/((2k+1)(2k+3))(x ≥ 2 は級数 —— 桁落ちを避ける)
export function ballA2(r, R) {
  if (!(r >= 0) || !pos(R)) throw new Error('ballA2: 定義域');
  const x = r / R;
  if (x === 0) return 3 / (R * R);
  if (x === 1) return 1.5 / (R * R);
  if (x >= 2) { const q = 1 / (x * x); let s = 0, z = 1; for (let k = 0; k < 60; k++) { const t = 3 * z / ((2 * k + 1) * (2 * k + 3)); s += t; if (t < 1e-18 * s) break; z *= q; } return s / (r * r); }
  if (x < 1e-3) { const x2 = x * x; return (3 / (R * R)) * (1 - x2 / 3 - x2 * x2 / 15); }   // 中心の近くの級数(L の展開)
  const L = Math.log1p(x) - Math.log(Math.abs(1 - x));
  return 1.5 / (R * R) * (1 + (1 - x * x) * L / (2 * x));
}
export function ballA2Dr(r, R) {
  if (!(r >= 0) || !pos(R)) throw new Error('ballA2Dr: 定義域');
  const x = r / R;
  if (x === 0) return 0;
  if (x === 1) return -Infinity;   // 表面で対数的に発散(受け手の求積は端を変数変換で避ける)
  if (x >= 2) { const q = 1 / (x * x); let s = 0, z = 1; for (let k = 0; k < 60; k++) { const t = 3 * (2 + 2 * k) * z / ((2 * k + 1) * (2 * k + 3)); s += t; if (t < 1e-18 * s) break; z *= q; } return -s / (r * r * r); }
  if (x < 1e-3) return (3 / (R * R * R)) * (-2 * x / 3 - 4 * x * x * x / 15);
  const L = Math.log1p(x) - Math.log(Math.abs(1 - x));
  return 1.5 / (R * R * R) * (1 / x - (1 + x * x) * L / (2 * x * x));
}
/* ───────── 回転の近遠差のモーメント M₂(r, R) = ⟨(ρ·ê)/|d − ρ|²⟩(外部 r > R)と導関数 ───────── */
// 閉じた式(殻の平均 −1/(2r) + (r² + s²) L_s/(4r² s) を球で積む): M₂ = 3[−1/(8r) + 3r/(8R²) + L (R² + 3r²)(R² − r²)/(16 r² R³)]。
// 遠方 M₂ = (1/R) Σ_{j≥1} 6j (R/r)^{2j+1}/((2j−1)(2j+1)(2j+3))(先頭 2R²/(5r³))—— r ≥ 2R は級数・その内側は閉じた式。
export function ballM2(r, R) {
  if (!pos(r) || !pos(R) || !(r > R)) throw new Error('ballM2: 外部だけ(r > R)');
  if (r >= 2 * R) { const y = R / r, q = y * y; let M = 0, D = 0, z = y * q; for (let j = 1; j <= 80; j++) { const c = 6 * j / ((2 * j - 1) * (2 * j + 1) * (2 * j + 3)), t = c * z / R; M += t; D -= (2 * j + 1) * t / r; if (Math.abs(t) < 1e-18 * Math.abs(M)) break; z *= q; } return { M, D }; }
  const L = Math.log((r + R) / (r - R)), r2 = r * r, R2 = R * R, R3 = R2 * R;
  const M = 3 * (-1 / (8 * r) + 3 * r / (8 * R2) + L * (R2 + 3 * r2) * (R2 - r2) / (16 * r2 * R3));
  // dL/dr = −2R/(r² − R²)
  const P = (R2 + 3 * r2) * (R2 - r2) / (16 * r2 * R3), dP = (6 * r * (R2 - r2) - 2 * r * (R2 + 3 * r2)) / (16 * r2 * R3) - 2 * (R2 + 3 * r2) * (R2 - r2) / (16 * r2 * r * R3);
  const D = 3 * (1 / (8 * r2) + 3 / (8 * R2) + dP * L + P * (-2 * R / (r2 - R2)));
  return { M, D };
}

/* ───────── 求積(独立の照合用 —— 源の球の直接の数値積分) ───────── */
/** 源の球の上の直接の求積(動径 Gauss–Legendre nr × 方位の μ の Gauss–Legendre nm —— 軸対称なので方位角は解析的に)。A₂ と M₂ を同時に */
export function ballDirect(r, R, nr = 48, nm = 64) {
  const gr = glNodes(nr), gm = glNodes(nm);
  let A = 0, M = 0;
  for (let a = 0; a < nr; a++) {
    const s = 0.5 * R * (gr.x[a] + 1), ws = 0.5 * gr.w[a] * 3 * s * s / (R * R * R) * R;   // 3s² ds/R³
    for (let b = 0; b < nm; b++) {
      const mu = gm.x[b], wm = 0.5 * gm.w[b], d2 = r * r + s * s - 2 * r * s * mu;
      A += ws * wm / d2; M += ws * wm * s * mu / d2;
    }
  }
  return { A, M };
}
/** 受け手の球の動径の求積(t = |ρ|/R_d ∈ (0,1)・重み 3t² dt —— 端 t → 1 の対数〔自己の場の勾配〕を t = 1 − (1 − u)³ で均す・和 1) */
const RR = new Map();
export function recvRadial(nr) {
  if (RR.has(nr)) return RR.get(nr);
  const g = glNodes(nr), out = [];
  for (let k = 0; k < nr; k++) { const u = 0.5 * (g.x[k] + 1), om = 1 - u, t = 1 - om * om * om; out.push({ t, w: 0.5 * g.w[k] * 3 * om * om * 3 * t * t }); }
  RR.set(nr, out);
  return out;
}
export function recvRule(nr, ns) {
  const out = [];
  for (const q of recvRadial(nr)) for (const s of sphereRule(ns)) out.push({ dir: s.s, t: q.t, w: q.w * s.w });
  return out;
}

/* ───────── 場(点 x —— 受け手 i の自己の場を分母に入れる) ───────── */
// B = 天体の列 {m, Rd, x, v, Om(慣性自転のベクトル)}・cfg = {Wbg(kg/m²)}。戻り値 W・∇W・源ごとの {j, r, e, w, M, D}
export function fieldAt(x, i, B, cfg) {
  let W = cfg.Wbg || 0, gW = [0, 0, 0];
  const rows = [];
  for (let k = 0; k < B.length; k++) {
    const b = B[k], d = sub(x, b.x), r = norm(d);
    if (k === i) {   // 自己(受け手の球の内部の点 —— 分母だけ)
      W += b.m * ballA2(r, b.Rd);
      if (r > 0) gW = add(gW, scale(d, b.m * ballA2Dr(r, b.Rd) / r));
      continue;
    }
    if (!(r > b.Rd)) throw new Error('fieldAt: 源の球の内部の点(重なり —— 参照は外部だけ)');
    const e = scale(d, 1 / r), w = b.m * ballA2(r, b.Rd), md = ballM2(r, b.Rd);
    W += w; gW = add(gW, scale(e, b.m * ballA2Dr(r, b.Rd)));
    rows.push({ j: k, r, e, w, M: md.M, D: md.D });
  }
  return { W, gW, rows };
}
/** 受け手 i の体積平均(比の平均): β_ij・回転 r_i(慣性自転 Om から)・軸 ω_i(point 型)と負の点の重み・分母の範囲 */
export function receiverAverages(i, B, cfg, opt = {}) {
  const A = opt.gain === undefined ? 1 : opt.gain, nr = opt.nr || 16, ns = opt.ns || 12;
  const n = B.length, beta = new Array(n).fill(0), a = B[i];
  let rot = [0, 0, 0], om = [0, 0, 0], neg = 0, Wmin = Infinity, Wmax = 0;
  for (const p of recvRule(nr, ns)) {
    const x = add(a.x, scale(p.dir, p.t * a.Rd)), f = fieldAt(x, i, B, cfg);
    if (f.W < Wmin) Wmin = f.W; if (f.W > Wmax) Wmax = f.W;
    for (const q of f.rows) {
      const b = B[q.j];
      beta[q.j] += p.w * q.w / f.W;
      rot = add(rot, scale(cross(b.Om, q.e), p.w * b.m * q.M / f.W));
      const wn = norm(b.Om);
      if (wn > 0) {
        const amp = -b.m * (q.D / f.W - q.M * dot(f.gW, q.e) / (f.W * f.W)), sinT = norm(cross(b.Om, q.e)) / wn;
        if (amp < 0) neg += p.w / f.rows.length;
        om = add(om, scale(sub(scale(q.e, 2 * dot(q.e, b.Om)), b.Om), p.w * A * amp * sinT));
      }
    }
  }
  return { beta, sumBeta: beta.reduce((s, x) => s + x, 0), rot, omega: om, negFrac: neg, Wmin, Wmax };
}
/** 比較の型 "span": 受け手の中心を通る ê_j の線の上の近い表面と遠い表面の g の差/直径(中心の向き・sinθ) */
export function receiverSpan(i, B, cfg, opt = {}) {
  const A = opt.gain === undefined ? 1 : opt.gain, a = B[i];
  let om = [0, 0, 0];
  for (let j = 0; j < B.length; j++) {
    if (j === i) continue;
    const b = B[j], wn = norm(b.Om);
    if (!(wn > 0)) continue;
    const e = unit(sub(a.x, b.x)), g = (x) => { const f = fieldAt(x, i, B, cfg), r = norm(sub(x, b.x)); return b.m * ballM2(r, b.Rd).M / f.W; };
    const amp = (g(sub(a.x, scale(e, a.Rd))) - g(add(a.x, scale(e, a.Rd)))) / (2 * a.Rd), sinT = norm(cross(b.Om, e)) / wn;
    om = add(om, scale(sub(scale(e, 2 * dot(e, b.Om)), b.Om), A * amp * sinT));
  }
  return { omega: om };
}

/* ───────── AN355: 全源の慣性自転をベクトルで同時に ───────── */
// B の各天体に axis(観測の軸・単位)・omega(観測の符号つき自転)。split: "vector"(既定)|"parallel"・kind: "point"|"span"
export function decomposeSpin(B, cfg, o = {}) {
  const split = o.split || 'vector', tol = o.tol || 1e-13, maxIter = o.maxIter || 100, kind = o.kind || 'point';
  const obs = B.map((b) => scale(b.axis, b.omega));
  let OmI = obs.map((v) => v.slice()), wD = null, res = Infinity, it = 0;
  const evalD = (Om) => B.map((b, i) => { const BB = B.map((c, k) => Object.assign({}, c, { Om: Om[k] })); return kind === 'span' ? receiverSpan(i, BB, cfg, o).omega : receiverAverages(i, BB, cfg, o).omega; });
  for (it = 1; it <= maxIter; it++) {
    wD = evalD(OmI);
    res = 0;
    const next = B.map((b, i) => {
      const r = norm(sub(add(OmI[i], wD[i]), obs[i])) / Math.max(Math.abs(b.omega), norm(wD[i]), 1e-300);
      if (r > res) res = r;
      if (split === 'parallel') return scale(b.axis, b.omega - dot(wD[i], b.axis));
      return sub(obs[i], wD[i]);
    });
    if (split === 'parallel') {   // 平行な分だけ: 残りは平行な成分で読む
      res = 0;
      B.forEach((b, i) => { const r = Math.abs(dot(add(OmI[i], wD[i]), b.axis) - b.omega) / Math.max(Math.abs(b.omega), 1e-300); if (r > res) res = r; });
    }
    if (res <= tol) break;
    OmI = next;
  }
  if (!(res <= tol)) throw new Error('decomposeSpin: 収束しない(残り ' + res + ')');
  return { OmI, wD, obs, iterations: it, residual: res };
}
/* ───────── AN364: 移動の逆写像と不動点 ───────── */
export function motionOf(B, cfg, OmI, o = {}) {
  const n = B.length, BB = B.map((c, k) => Object.assign({}, c, { Om: OmI[k] }));
  const av = B.map((b, i) => receiverAverages(i, BB, cfg, o));
  const V = B.map((b) => b.v);
  const v = B.map((b, i) => {
    if (b.fixed) return V[i].slice();
    let q = V[i].slice(); av[i].beta.forEach((be, j) => { if (j !== i) q = sub(q, scale(V[j], be)); });
    q = sub(q, av[i].rot);
    return scale(q, 1 / (1 - av[i].sumBeta));
  });
  const uOf = (vv) => B.map((b, i) => { if (b.fixed) return [0, 0, 0]; let u = av[i].rot.slice(); av[i].beta.forEach((be, j) => { if (j !== i) u = add(u, scale(sub(V[j], vv[i]), be)); }); return u; });
  let w = V.map((x) => x.slice()), it = 0, step = Infinity;
  const Vs = Math.max(...V.map(norm), 1e-300);
  for (it = 1; it <= (o.maxIter || 200); it++) { const u = uOf(w), nw = V.map((x, i) => sub(x, u[i])); step = Math.max(...nw.map((x, i) => norm(sub(x, w[i])) / Vs)); w = nw; if (step <= (o.tol || 1e-15)) break; }
  const Vmax = Math.max(...V.map(norm), 1e-300);   // 規格は配置の最大の速さ(静止した天体の 0 で割らない)
  const uD = uOf(v), fwd = Math.max(...v.map((x, i) => norm(sub(add(x, uD[i]), V[i])) / Vmax));
  const diff = Math.max(...v.map((x, i) => norm(sub(x, w[i])) / Vmax));
  return { v, u: uD, av, iterations: it, iterStep: step, forwardResidual: fwd, diffIterDirect: diff, cond: av.map((a) => 1 / (1 - a.sumBeta)) };
}

/* ───────── AN362: 1 步の熱と背景の口座 ───────── */
// I(慣性モーメント)・Ω_I・ω_D(ベクトル)。軸のコストは横成分と有理化した差で(大きな二乗の差を取らない)
export function restoreBudget(I, OmI, wD) {
  if (!pos(I)) throw new Error('restoreBudget: I');
  const w = norm(OmI);
  if (!(w > 0)) throw new Error('restoreBudget: Ω_I = 0(軸が無い)');
  const a = scale(OmI, 1 / w), p = dot(wD, a), perp = sub(wD, scale(a, p)), t2 = dot(perp, perp), q = w + p, s = Math.sqrt(q * q + t2);
  const bend = q >= 0 ? (s + q > 0 ? t2 / (s + q) : 0) : s - q;   // s − (w + p)(桁落ちしない形)
  const Eaxis = 0.5 * I * (bend * bend + t2);
  const Espeed = I * (dot(OmI, wD) + 0.5 * dot(wD, wD));
  const heat = Eaxis + Math.max(Espeed, 0), supply = Math.max(-Espeed, 0);
  return { Eaxis, Espeed, heat, supply, actualAxisWork: 0,
    L: { field: scale(wD, -I), background: scale(wD, I), state: [0, 0, 0] },
    E: { field: -Espeed, background: -Eaxis - supply, heat, state: 0 },
    closeL: norm(add(scale(wD, -I), scale(wD, I))), closeE: heat - Espeed - Eaxis - supply };
}
/** 率: 1 步の型 Q/h(刻みに反比例)と τ_hold の型 Q/τ */
export const rates = (Q, h, taus) => ({ step: Q / h, halfStep: Q / (h / 2), hold: taus.map((tau) => ({ tau, P: Q / tau })) });

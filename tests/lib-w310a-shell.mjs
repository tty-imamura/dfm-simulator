// 第310便a(原仮定者の裁定(第109報)AN380「dragCore(R_d, m_d)と、外殻(観測半径, 観測質量 − m_d)の引きずりを、それぞれ計算する」・決断事項 AN384・AN385・
// AN386・統括の検証項目 R222): **外殻の源と受け手の参照の純関数**(html を読まない・状態を持たない —— 器 tests/exp-w310a-invsq.mjs が使う)。
//
// ■ 何をするか
//   ・外殻の源の核: 一様の厚い殻(内径 Ri・外径 Ro)の K_s(r) = ⟨1/|d − ρ|²⟩_shell と M_s(r) = ⟨(ρ·d̂)/|d − ρ|²⟩_shell と動径の微分を、
//     (a) 球の差 [Ro³ K2(r;Ro) − Ri³ K2(r;Ri)]/(Ro³ − Ri³)(K2・M2 は第309便a の lib の自前の閉じた式)・
//     (b) 薄い殻の閉じた式 ln|(r+s)/(r−s)|/(2rs)(と M2 の閉じた式)を動径 s ∈ [Ri, Ro] で求積(重み 3s²/(Ro³ − Ri³) —— 1 次元・端の対数は変数変換で除く)・
//     (c) 殻の直接の 3 次元の求積(動径 Gauss–Legendre × 球面の規則)で作り、互いに比べる。薄い殻(半径 a の球面)の閉じた式と級数もこの lib が自前に書く。
//   ・参照の受け手(AN385 の読み): dragCore の球の節点と外殻の節点(径の求積を [R_d, R])でそれぞれ比の平均を取り、質量で重みをつける。
//     各点の分母 W = 自分の dragCore の場 + 自分の外殻の場 + 他の源(dragCore と外殻)。源の側は dragCore と外殻を別々の項として足す(動きは天体と同じ)。
//     薄い殻の受け手は殻の上で自分の場が発散するので殻の分は 0(重み m_d/M は残す)—— エンジンと同じ約束を独立に書く。
//
// ■ しないこと: html を読まない・エンジンの式を写さない(器がエンジンの inertialDragIsqShellK・ShellM・Thin・State と比べる)。
import { K2, K2Dr, M2, M2Dr, receiverRule, glNodes, sphereRule, dot, cross, norm, add, sub, scale, unit, numDr } from './lib-w309a-invsq.mjs';
export { K2, K2Dr, M2, M2Dr, dot, cross, norm, add, sub, scale, unit, numDr };
export const LIB_VERSION = 'w310a-shell-lib-1';

const pos = (x) => Number.isFinite(x) && x > 0;

/* ───────── 薄い殻(半径 a の球面)───────── */
/** K(r; a) = (1/(2ra)) ln|(r+a)/(r−a)|(r ≠ a)。r = 0 は 1/a² */
export function thinK(r, a) {
  if (!(r >= 0) || !pos(a) || r === a) throw new Error('thinK: 定義域');
  if (r === 0) return 1 / (a * a);
  const x = r / a;
  if (x < 0.3) { let s = 1, p = x * x; for (let k = 1; k < 60; k++) { const t = p / (2 * k + 1); s += t; if (t < 1e-18 * s) break; p *= x * x; } return s / (a * a); }
  if (x > 3) { const z = 1 / (x * x); let s = 0, p = 1; for (let k = 0; k < 80; k++) { const t = p / (2 * k + 1); s += t; if (t < 1e-18 * s) break; p *= z; } return s / (r * r); }
  return Math.log(Math.abs((r + a) / (r - a))) / (2 * r * a);
}
export function thinKDr(r, a) {
  if (!(r > 0) || !pos(a) || r === a) throw new Error('thinKDr: 定義域');
  const x = r / a;
  if (x > 3) { const z = 1 / (x * x); let s = 0, p = 1; for (let k = 0; k < 80; k++) { const t = (2 * k + 2) * p / (2 * k + 1); s += t; if (t < 1e-18 * s) break; p *= z; } return -s / (r * r * r); }
  if (x < 0.3) { let s = 0, p = x; for (let k = 1; k < 60; k++) { const t = 2 * k * p / (2 * k + 1); s += t; if (t < 1e-18 * s) break; p *= x * x; } return s / (a * a * a); }
  const L = Math.log(Math.abs((r + a) / (r - a)));
  return -1 / (r * (r * r - a * a)) - L / (2 * a * r * r);
}
/** M2 の薄い殻(外部 r > a): (r² + a²)L/(4ar²) − 1/(2r)・遠方 (1/r) Σ_{k≥1} 2k z^k/((2k−1)(2k+1)) */
export function thinM(r, a) {
  if (!pos(a) || !(r > a)) throw new Error('thinM: 外部だけ');
  const x = r / a;
  if (x > 3) { const z = 1 / (x * x); let s = 0, p = z; for (let k = 1; k < 80; k++) { const t = 2 * k * p / ((2 * k - 1) * (2 * k + 1)); s += t; if (t < 1e-18 * s) break; p *= z; } return s / r; }
  const L = Math.log((r + a) / (r - a));
  return (r * r + a * a) * L / (4 * a * r * r) - 1 / (2 * r);
}
export function thinMDr(r, a) {
  if (!pos(a) || !(r > a)) throw new Error('thinMDr: 外部だけ');
  const x = r / a;
  if (x > 3) { const z = 1 / (x * x); let s = 0, p = z; for (let k = 1; k < 80; k++) { const t = 2 * k * p / (2 * k - 1); s += t; if (t < 1e-18 * s) break; p *= z; } return -s / (r * r); }
  const L = Math.log((r + a) / (r - a));
  return -a * L / (2 * r * r * r) - a * a / (r * r * (r * r - a * a));
}

/* ───────── 一様の厚い殻(球の差)───────── */
const V3 = (R) => R * R * R;
export function shellK(r, Ri, Ro) { return (V3(Ro) * K2(r, Ro) - V3(Ri) * K2(r, Ri)) / (V3(Ro) - V3(Ri)); }
export function shellKDr(r, Ri, Ro) { return (V3(Ro) * K2Dr(r, Ro) - V3(Ri) * K2Dr(r, Ri)) / (V3(Ro) - V3(Ri)); }
export function shellM(r, Ri, Ro) { return (V3(Ro) * M2(r, Ro) - V3(Ri) * M2(r, Ri)) / (V3(Ro) - V3(Ri)); }
export function shellMDr(r, Ri, Ro) { return (V3(Ro) * M2Dr(r, Ro) - V3(Ri) * M2Dr(r, Ri)) / (V3(Ro) - V3(Ri)); }
/** 外殻の源の核(mode = 'uniform' | 'thin')。{K, KDr, M?, MDr?}(M は r > Ro のときだけ) */
export function srcShell(r, Ri, Ro, mode) {
  const thin = mode === 'thin';
  const o = { K: thin ? thinK(r, Ro) : shellK(r, Ri, Ro), KDr: thin ? thinKDr(r, Ro) : shellKDr(r, Ri, Ro) };
  if (r > Ro) { o.M = thin ? thinM(r, Ro) : shellM(r, Ri, Ro); o.MDr = thin ? thinMDr(r, Ro) : shellMDr(r, Ri, Ro); }
  return o;
}

/* ───────── 独立な求積 ───────── */
/** (b) 薄い殻の閉じた式を動径で(s ∈ [Ri, Ro]・重み 3s²/(Ro³ − Ri³) —— s = Ri + Δ(3v² − 2v³) で両端の対数を和らげる)。外部の点 r > Ro・内部の点 r < Ri・殻の中も可 */
export function shellRadialQuad(r, Ri, Ro, n = 96) {
  const g = glNodes(n), dR = Ro - Ri, V = V3(Ro) - V3(Ri);
  const seg = (lo, hi) => { let K = 0, M = 0; const d = hi - lo;
    for (let k = 0; k < n; k++) { const v = 0.5 * (g.x[k] + 1), h = v * v * (3 - 2 * v), s = lo + d * h, w = 0.5 * g.w[k] * 3 * s * s * d * 6 * v * (1 - v) / V;
      K += w * thinK(r, s); if (r > Ro) M += w * thinM(r, s); }
    return { K, M }; };
  if (r > Ri && r < Ro) {   // 殻の中の点: s = r の対数を s = r ∓ h u⁴ で和らげる(被積分 u³ ln u —— Gauss–Legendre の収束 ~ n⁻⁸)
    let K = 0;
    for (const [lo, hi, sg] of [[Ri, r, -1], [r, Ro, 1]]) { const h = hi - lo;
      for (let k = 0; k < n; k++) { const u = 0.5 * (g.x[k] + 1), u4 = u * u * u * u, s = sg < 0 ? r - h * u4 : r + h * u4; if (s === r) continue; K += 0.5 * g.w[k] * 3 * s * s * 4 * h * u * u * u / V * thinK(r, s); } }
    return { K, M: null };
  }
  const q = seg(Ri, Ro);
  return { K: q.K, M: r > Ro ? q.M : null };
}
/** (c) 殻の直接の 3 次元の求積(外部の点 —— 動径 nR〔Gauss–Legendre on [Ri, Ro]・重み 3s²/(Ro³ − Ri³)〕× 球面の規則 nS)。thin は球面だけ */
export function shellQuad3(d, Ri, Ro, mode, nR = 48, nS = 48) {
  const dh = unit(d), g = glNodes(nR), V = V3(Ro) - V3(Ri), rad = [];
  if (mode === 'thin') rad.push({ s: Ro, w: 1 });
  else for (let k = 0; k < nR; k++) { const s = Ri + (Ro - Ri) * 0.5 * (g.x[k] + 1); rad.push({ s, w: 0.5 * g.w[k] * (Ro - Ri) * 3 * s * s / V }); }
  let K = 0, M = 0;
  for (const a of rad) for (const b of sphereRule(nS)) {
    const rho = scale(b.s, a.s), q = sub(d, rho), w = a.w * b.w, i2 = 1 / dot(q, q);
    K += w * i2; M += w * dot(rho, dh) * i2;
  }
  return { K, M };
}

/* ───────── 参照の受け手(外殻つき)───────── */
/**
 * bodies = [{x:[3], m(全質量 M), Rd, md?(dragCore の質量 —— 省略は m), Ro?(外殻の外径 —— md < m かつ Ro > Rd のとき外殻), Om, a}]・
 * o = {order, mode('uniform'|'thin'|null), gain, axial, Wbg2(内部の比較だけ —— 既定 0)}
 * 受け手 i の {beta[j], betaShell[j](源の外殻の分), rot[j], omega, parts:{core[j], shell[j]}(質量の重みつき)}
 */
const mdOf = (b) => (b.md === undefined ? b.m : b.md);
const hasShell = (b, mode) => !!mode && mdOf(b) < b.m && pos(b.Ro) && b.Ro > b.Rd;
function srcTerms(b, r, mode) {
  const md = mdOf(b), o = { N: md * K2(r, b.Rd), NDr: md * K2Dr(r, b.Rd), Ns: 0, NsDr: 0 };
  if (r > b.Rd) { o.G = md * M2(r, b.Rd); o.GDr = md * M2Dr(r, b.Rd); }
  if (hasShell(b, mode)) { const ms = b.m - md, s = srcShell(r, b.Rd, b.Ro, mode); o.Ns = ms * s.K; o.NsDr = ms * s.KDr; if (s.M !== undefined) { o.Gs = ms * s.M; o.GsDr = ms * s.MDr; } }
  return o;
}
export function pointField(bodies, x, o = {}) {
  let W = o.Wbg2 || 0, G = [0, 0, 0];
  for (const b of bodies) {
    const d = sub(x, b.x), r = norm(d), t = srcTerms(b, r, o.mode);
    W += t.N + t.Ns;
    if (r > 0) G = add(G, scale(d, (t.NDr + t.NsDr) / r));
  }
  return { W, G };
}
/** 外殻の受け手の動径の規則(径 [Ri, Ro]・重み 3s²/(Ro³ − Ri³)・s = Ri + Δ(3v² − 2v³))—— 角度はエンジンと同じ型(μ Gauss–Legendre n・方位 2n)を lib が自前に */
export function shellReceiverRule(n, Ri, Ro) {
  const g = glNodes(n), dR = Ro - Ri, V = V3(Ro) - V3(Ri), out = [];
  for (let a = 0; a < n; a++) {
    const v = 0.5 * (g.x[a] + 1), h = v * v * (3 - 2 * v), s = Ri + dR * h, wr = 0.5 * g.w[a] * 3 * s * s * dR * 6 * v * (1 - v) / V;
    for (let b = 0; b < n; b++) {
      const mu = g.x[b], st = Math.sqrt(Math.max(0, 1 - mu * mu)), wm = 0.5 * g.w[b];
      for (let c = 0; c < 2 * n; c++) { const ph = 2 * Math.PI * (c + 0.5) / (2 * n); out.push({ s, dir: [st * Math.cos(ph), st * Math.sin(ph), mu], w: wr * wm / (2 * n) }); }
    }
  }
  return out;
}
export function refReceiverShell(bodies, i, o = {}) {
  const n = o.order || 8, gain = o.gain === undefined ? 1 : o.gain, me = bodies[i], J = bodies.length, mode = o.mode || null;
  const beta = new Array(J).fill(0), betaShell = new Array(J).fill(0), rot = Array.from({ length: J }, () => [0, 0, 0]);
  const parts = { core: new Array(J).fill(0), shell: new Array(J).fill(0) };
  let omega = [0, 0, 0];
  const msh = hasShell(me, mode), M = me.m, md = mdOf(me), fc = msh ? md / M : 1, fs = (msh && mode !== 'thin') ? (M - md) / M : 0;
  const nodes = receiverRule(n).map((q) => ({ x: add(me.x, scale(q.s, me.Rd * q.t)), w: q.w * fc, part: 'core' }));
  if (fs > 0) for (const q of shellReceiverRule(n, me.Rd, me.Ro)) nodes.push({ x: add(me.x, scale(q.dir, q.s)), w: q.w * fs, part: 'shell' });
  for (const q of nodes) {
    const F = pointField(bodies, q.x, o);
    for (let j = 0; j < J; j++) {
      if (j === i) continue;
      const b = bodies[j], d = sub(q.x, b.x), r = norm(d), nh = scale(d, 1 / r), t = srcTerms(b, r, mode);
      const bt = (t.N + t.Ns) / F.W;
      beta[j] += q.w * bt; betaShell[j] += q.w * t.Ns / F.W; parts[q.part][j] += q.w * bt;
      const g = ((t.G || 0) + (t.Gs || 0)) / F.W;
      rot[j] = add(rot[j], scale(nh, q.w * g));
      if (o.axial && b.Om) {
        const gd = dot(F.G, nh), amp = -(((t.GDr || 0) + (t.GsDr || 0)) / F.W - ((t.G || 0) + (t.Gs || 0)) * gd / (F.W * F.W));
        const sn = norm(cross(b.a, nh)), mu = dot(nh, b.a);
        omega = add(omega, scale(sub(scale(nh, 2 * mu), b.a), q.w * gain * amp * sn * b.Om));
      }
    }
  }
  return { beta, betaShell, rot, omega, parts, nodes: nodes.length };
}

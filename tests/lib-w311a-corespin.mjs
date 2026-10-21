// 第311便a(DECISIONS v70 §0c ①・§1 AN397・原仮定者の裁定(第110報)AN387 ④・決断事項 AN384・統括の検証項目 R226):
// **dragCore の自転と軸の参照の受け手**(html を読まない・状態を持たない —— 器 tests/exp-w311a-corespin.mjs がエンジンの inertialDragIsqState と比べる)。
//
// ■ 何をするか
//   ・源 j を dragCore(一様球 m_d・R_d)と外殻(一様の厚い殻 / 薄い殻 —— 第310便a の lib tests/lib-w310a-shell.mjs の srcShell)の 2 つの部分に分け、
//     回転引きずりの係数(⟨(M2/W) n̂⟩)と軸の ω(鏡映 × sinθ × 受け手の近遠の差分)を**部分ごとに別に**積む。核の部分は宣言の Ω_c â_c(Omc・ac)・
//     外殻の部分は天体の Ω â(Om・a)で合成する: u_rot = Ω_c â_c × rot_core + Ω â × rot_shell・ω = ω_core(â_c で評価) + ω_shell(â で評価)。
//     傾きの無い受け手へ渡す符号つきのスカラーは σ(â_c)(ω_core·â_c) + σ(â)(ω_shell·â)(σ は第302便e の正準化 —— lib が自前に書く)。
//   ・受け手の求積(dragCore の球の節点 + 外殻の節点・質量の重み)と各点の分母 W は第310便a の参照(pointField・shellReceiverRule・receiverRule)をそのまま使う
//     (核の自転は W と β を変えない —— 回転と軸だけ)。
//   ・薄い殻の受け手は殻の分 0(重み m_d/M は残す —— 第310便a の約束)。
//
// ■ しないこと: html を読まない・エンジンの式を写さない。核の角運動量を解かない(宣言の一定のベクトル —— 入力のノブ)。
import { K2, K2Dr, M2, M2Dr, receiverRule, dot, cross, norm, add, sub, scale, unit } from './lib-w309a-invsq.mjs';
import { srcShell, shellReceiverRule, pointField } from './lib-w310a-shell.mjs';
export { dot, cross, norm, add, sub, scale, unit };
export const LIB_VERSION = 'w311a-corespin-lib-1';

const pos = (x) => Number.isFinite(x) && x > 0;
/** 傾きの無い受け手へのスカラーの符号の正準化(第302便e): a_z の符号・赤道は a_y・それも 0 なら a_x(全て 0 は +1) */
export function axialSign(a) { return a[2] > 0 ? 1 : a[2] < 0 ? -1 : a[1] > 0 ? 1 : a[1] < 0 ? -1 : a[0] < 0 ? -1 : 1; }
/** 天体の spinAxis と同じ角の定義(傾き tiltDeg は +z から・方位 azimuthDeg は +x から・未宣言 0) */
export function axisOf(tiltDeg, azDeg) { const th = (tiltDeg || 0) * Math.PI / 180, ph = (azDeg || 0) * Math.PI / 180; return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)]; }

const mdOf = (b) => (b.md === undefined ? b.m : b.md);
const hasShell = (b, mode) => !!mode && mdOf(b) < b.m && pos(b.Ro) && b.Ro > b.Rd;
function srcParts(b, r, mode) {
  const md = mdOf(b), o = { G: 0, GDr: 0, Gs: 0, GsDr: 0, sh: hasShell(b, mode) };
  if (r > b.Rd) { o.G = md * M2(r, b.Rd); o.GDr = md * M2Dr(r, b.Rd); }
  if (o.sh) { const s = srcShell(r, b.Rd, b.Ro, mode); if (s.M !== undefined) { o.Gs = (b.m - md) * s.M; o.GsDr = (b.m - md) * s.MDr; } }
  return o;
}

/**
 * bodies = [{x:[3], m(全質量), Rd, md?(dragCore の質量 —— 省略は m), Ro?(外殻の外径), Om, a(天体の自転と軸), Omc?, ac?(核の自転と軸 —— 省略は Om・a)}]・
 * o = {order, mode('uniform'|'thin'|null), gain, axial}
 * 受け手 i の源ごとの {rotCore[j], rotShell[j], uRotCore[j], uRotShell[j], uRot[j], omegaCore[j], omegaShell[j], omega[j], omegaS[j]} と和 omegaSum
 */
export function refReceiverCoreSpin(bodies, i, o = {}) {
  const n = o.order || 8, gain = o.gain === undefined ? 1 : o.gain, me = bodies[i], J = bodies.length, mode = o.mode || null;
  const Z = () => Array.from({ length: J }, () => [0, 0, 0]);
  const rotCore = Z(), rotShell = Z(), omegaCore = Z(), omegaShell = Z();
  const msh = hasShell(me, mode), M = me.m, md = mdOf(me), fc = msh ? md / M : 1, fs = (msh && mode !== 'thin') ? (M - md) / M : 0;
  const nodes = receiverRule(n).map((q) => ({ x: add(me.x, scale(q.s, me.Rd * q.t)), w: q.w * fc }));
  if (fs > 0) for (const q of shellReceiverRule(n, me.Rd, me.Ro)) nodes.push({ x: add(me.x, scale(q.dir, q.s)), w: q.w * fs });
  for (const q of nodes) {
    const F = pointField(bodies, q.x, o);
    for (let j = 0; j < J; j++) {
      if (j === i) continue;
      const b = bodies[j], d = sub(q.x, b.x), r = norm(d), nh = scale(d, 1 / r), t = srcParts(b, r, mode), gd = dot(F.G, nh);
      rotCore[j] = add(rotCore[j], scale(nh, q.w * t.G / F.W));
      rotShell[j] = add(rotShell[j], scale(nh, q.w * t.Gs / F.W));
      if (!o.axial) continue;
      const Omc = b.Omc === undefined ? b.Om : b.Omc, ac = b.ac || b.a;
      const ampC = -(t.GDr / F.W - t.G * gd / (F.W * F.W)), ampS = -(t.GsDr / F.W - t.Gs * gd / (F.W * F.W));
      if (Omc) { const sn = norm(cross(ac, nh)), mu = dot(nh, ac); omegaCore[j] = add(omegaCore[j], scale(sub(scale(nh, 2 * mu), ac), q.w * gain * ampC * sn * Omc)); }
      if (t.sh && b.Om) { const sn = norm(cross(b.a, nh)), mu = dot(nh, b.a); omegaShell[j] = add(omegaShell[j], scale(sub(scale(nh, 2 * mu), b.a), q.w * gain * ampS * sn * b.Om)); }
    }
  }
  const uRotCore = Z(), uRotShell = Z(), uRot = Z(), omega = Z(), omegaS = new Array(J).fill(0);
  let omegaSum = [0, 0, 0];
  for (let j = 0; j < J; j++) {
    if (j === i) continue;
    const b = bodies[j], Omc = b.Omc === undefined ? b.Om : b.Omc, ac = b.ac || b.a;
    uRotCore[j] = cross(scale(ac, Omc), rotCore[j]); uRotShell[j] = hasShell(b, mode) ? cross(scale(b.a, b.Om), rotShell[j]) : [0, 0, 0];
    uRot[j] = add(uRotCore[j], uRotShell[j]); omega[j] = add(omegaCore[j], omegaShell[j]); omegaSum = add(omegaSum, omega[j]);
    omegaS[j] = axialSign(ac) * dot(omegaCore[j], ac) + axialSign(b.a) * dot(omegaShell[j], b.a);
  }
  return { rotCore, rotShell, uRotCore, uRotShell, uRot, omegaCore, omegaShell, omega, omegaS, omegaSum, nodes: nodes.length };
}
/** 確かめの補助: 核の自転を変えたときの線形(u(Ω_c) − u(0) が Ω_c に比例)—— 2 点の比 */
export function linearRatio(u0, u1, u2) { const a = sub(u1, u0), b = sub(u2, u0); return norm(b) / Math.max(norm(a), 1e-300); }
export { K2, K2Dr, M2, M2Dr };

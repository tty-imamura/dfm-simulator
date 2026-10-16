// 第306便d(原仮定者の裁定(第96報)後半「回転引きずりは、移動と回転の両方に効く座標変換である」・決断事項 AN338 ①③④〔DECISIONS v65 §0〕・
// 統括の検証項目 R207): **回転引きずりを座標変換として読むための純関数**(html を読まない・状態を持たない)。
//
// ■ 何をするか(器 tests/exp-w306d-rotframe.mjs が使う)
//   ・Rodrigues の回転(回転ベクトル w = θ n̂ → 3×3 —— 小角は級数で桁落ちを防ぐ)と、行列・ベクトルの小道具。
//   ・中心 c まわりの読み替え x′ = c + R(x − c)・座標速度 W′ = R W + Ṙ(x − c) + ċ − R ċ(中心が動くときの項を含む)。
//   ・座標速度 W = v + u の分け方の定義(下の VELOCITY_DEFS):
//       relabel(読み替え)   v′ = R v・u′ = R u + Ṙ(x − c) + ċ − R ċ   —— W′ = v′ + u′ を保つ(移流は u にだけ入る)
//       kick(新しいキック)  v′ = R v + Ṙ(x − c) + ċ − R ċ・u′ は同じ   —— 移流を速度へもう一度足す(W′ を移流 1 回分こえる)
//       missing(移流なし)   v′ = R v・u′ = R u                          —— 移流がどこにも無い(W′ に移流 1 回分足りない)
//   ・(G) 大域の一つの R(全粒子・源の軸も同じ R)と (L) 受け手ごとの R_i(受け手 i の回転引きずりの角速度 Ω_i から ——
//     源ごとの角速度 ω_ij のベクトル和 Ω_i = Σ_j ω_ij と Chasles の分解〔回転の軸の線 c_i と軸方向の並進 b∥〕)。
//   ・位置・姿勢・速度の変換の選択肢(OPTIONS —— 速度を回す選択肢は「読み替え」と「キック」で名前を分ける)。
//   ・有限回転の合成: ベクトル和の 1 回の螺旋運動(源の並びに依らない)と、源ごとの剛体回転の順序付きの積(前向き・逆向き)。
//   ・姿勢の捩れ(swing–twist —— 軸 â のまわりの捩れの角と、軸が傾く角)。
//
// ■ しないこと: html を読まない・エンジンの式を変えない・力として何も足さない(器の写しの中で使うだけ)。
export const LIB_VERSION = 'w306d-rotframe-lib-1';

/* ───────── 3 ベクトル ───────── */
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];

/* ───────── 回転 ───────── */
/** 回転ベクトル w(角 θ = |w|・軸 n̂ = w/θ)の Rodrigues の行列(行優先の 9 要素)。R = I + A[w]× + B[w]×²・
 *  A = sin θ/θ・B = (1 − cos θ)/θ²(θ < 1e-4 は級数 —— 1 − cos θ の桁落ちを防ぐ)。 */
export function rodrigues(w) {
  const t2 = w[0] * w[0] + w[1] * w[1] + w[2] * w[2], th = Math.sqrt(t2);
  let A, B;
  if (th < 1e-4) { A = 1 - t2 / 6 + t2 * t2 / 120; B = 0.5 - t2 / 24 + t2 * t2 / 720; }
  else { A = Math.sin(th) / th; B = (1 - Math.cos(th)) / t2; }
  const [x, y, z] = w;
  // [w]× = [[0,−z,y],[z,0,−x],[−y,x,0]]・[w]×² = w wᵀ − t2 I
  return [1 + B * (x * x - t2), -A * z + B * x * y, A * y + B * x * z,
    A * z + B * x * y, 1 + B * (y * y - t2), -A * x + B * y * z,
    -A * y + B * x * z, A * x + B * y * z, 1 + B * (z * z - t2)];
}
export const matVec = (R, v) => [R[0] * v[0] + R[1] * v[1] + R[2] * v[2], R[3] * v[0] + R[4] * v[1] + R[5] * v[2], R[6] * v[0] + R[7] * v[1] + R[8] * v[2]];
export const matT = (R) => [R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]];
export function matMul(A, B) {
  const C = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
  return C;
}
export const IDENT = [1, 0, 0, 0, 1, 0, 0, 0, 1];
/** 回転行列の角(trace から —— 小角は反対称部から: 桁落ちを防ぐ) */
export function angleOf(R) {
  const s = 0.5 * Math.sqrt((R[7] - R[5]) ** 2 + (R[2] - R[6]) ** 2 + (R[3] - R[1]) ** 2), c = 0.5 * (R[0] + R[4] + R[8] - 1);
  return Math.atan2(s, c);
}
/** 中心 c まわりの読み替え x′ = c + R(x − c) */
export const rotateAbout = (R, c, x) => add(c, matVec(R, sub(x, c)));
/** 一定の角速度 Ω の枠の Ṙ = [Ω]× R(R = rodrigues(Ω t)) */
export function rdotOf(Om, R) {
  const [x, y, z] = Om, K = [0, -z, y, z, 0, -x, -y, x, 0];
  return matMul(K, R);
}
/** 座標速度の読み替え W′ = R W + Ṙ(x − c) + ċ − R ċ(f = {R, Rdot, c, cdot} —— cdot 省略は 0) */
export function frameVelocity(f, x, W) {
  const cd = f.cdot || [0, 0, 0];
  return add(add(matVec(f.R, W), matVec(f.Rdot, sub(x, f.c))), sub(cd, matVec(f.R, cd)));
}
/** 座標速度 W = v + u の分け方の定義(読み替え・キック・移流なし)—— 速度を回す選択肢の名前を分ける */
export const VELOCITY_DEFS = {
  relabel: { ja: '読み替え(v′ = R v・u′ = R u + Ṙ(x − c) + ċ − R ċ —— 移流は u にだけ)', en: 'relabel (v′ = Rv, u′ = Ru + Ṙ(x−c) + ċ − Rċ)' },
  kick: { ja: '新しいキック(v′ = R v + Ṙ(x − c) + ċ − R ċ —— 移流を速度へもう一度足す)', en: 'new kick (advection added to v again)' },
  missing: { ja: '移流なし(v′ = R v・u′ = R u —— 移流がどこにも無い)', en: 'no advection' },
};
export function splitVelocity(def, f, x, v, u) {
  const cd = f.cdot || [0, 0, 0], adv = add(matVec(f.Rdot, sub(x, f.c)), sub(cd, matVec(f.R, cd)));
  const Rv = matVec(f.R, v), Ru = matVec(f.R, u);
  if (def === 'relabel') return { v: Rv, u: add(Ru, adv) };
  if (def === 'kick') return { v: add(Rv, adv), u: add(Ru, adv) };
  if (def === 'missing') return { v: Rv, u: Ru };
  throw new Error('未知の定義: ' + def);
}

/* ───────── 回転引きずりの螺旋運動(Chasles)───────── */
/** 源ごとの角速度 ω_j(ベクトル)と源の位置 p_j から、受け手の速度場 s(x) = Σ_j ω_j × (x − p_j) を 1 つの螺旋運動
 *  Ω × (x − c) + b∥(Ω = Σ ω_j・b = −Σ ω_j × p_j・c = Ω × b/|Ω|²〔軸の線の上で原点に近い点〕・b∥ = Ω̂(Ω̂·b))に書く。|Ω| = 0 は null。 */
export function chasles(omegas, centers) {
  let O = [0, 0, 0], b = [0, 0, 0];
  for (let k = 0; k < omegas.length; k++) { O = add(O, omegas[k]); b = sub(b, cross(omegas[k], centers[k])); }
  const o2 = dot(O, O);
  if (!(o2 > 0)) return null;
  const c = scale(cross(O, b), 1 / o2), on = Math.sqrt(o2), oh = scale(O, 1 / on), bPar = scale(oh, dot(oh, b));
  return { Om: O, c, bPar, OmAbs: on };
}
/** 螺旋運動の正確な流れ(h だけ): x′ = c + R(hΩ)(x − c) + h b∥(b∥ ∥ Ω なので回転と並進は可換) */
export function screwStep(sc, h, x) {
  return add(rotateAbout(rodrigues(scale(sc.Om, h)), sc.c, x), scale(sc.bPar, h));
}
/** 源ごとの剛体回転の順序付きの積(order = 'fwd' | 'rev')—— x ← p_j + R(h ω_j)(x − p_j) を源の並びで */
export function orderedProduct(omegas, centers, h, x, order) {
  let y = x;
  const K = omegas.length;
  for (let k = 0; k < K; k++) {
    const j = order === 'rev' ? K - 1 - k : k;
    y = rotateAbout(rodrigues(scale(omegas[j], h)), centers[j], y);
  }
  return y;
}

/* ───────── 姿勢 ───────── */
/** 回転ベクトル w(角 θ・軸 n̂)の、軸 â のまわりの捩れの角 2 atan2((n̂·â) sin(θ/2), cos(θ/2)) と、軸が傾く角(â と R â の間) */
export function swingTwist(w, a) {
  const th = norm(w);
  if (!(th > 0)) return { twist: 0, swing: 0 };
  const s2 = Math.sin(th / 2), c2 = Math.cos(th / 2), na = dot(w, a) / th;
  const twist = 2 * Math.atan2(na * s2, c2);
  const Ra = matVec(rodrigues(w), a), cs = Math.max(-1, Math.min(1, dot(Ra, a) / (norm(Ra) * norm(a))));
  return { twist, swing: Math.atan2(norm(cross(Ra, a)), dot(Ra, a)) || Math.acos(cs) };
}

/* ───────── 選択肢(位置・姿勢・速度)───────── */
/** 回転引きずりの変換の選択肢。pos: linear(今の規約の x += u·dt)/rigid(剛体の回転)・att: 姿勢を R で回すか・vel: none/relabel/kick/advectKick。
 *  速度を回す選択肢は「読み替え」(relabel —— 絶対の慣性速度は R⁻¹v′ で不変・状態の v は変えない)と「キック」(kick —— 状態の v を R v に置き換える)で名前を分ける。 */
export const OPTIONS = [
  { key: 'posLinear', pos: 'linear', att: false, vel: 'none', ja: '今の規約(位置だけ・線形の步 x += u·dt)' },
  { key: 'posOnly', pos: 'rigid', att: false, vel: 'none', ja: '位置だけ(剛体の回転 x′ = c + R(x − c))' },
  { key: 'posAtt', pos: 'rigid', att: true, vel: 'none', ja: '位置 + 姿勢(â′ = R â・rotA に捩れ)' },
  { key: 'posAttVRelabel', pos: 'rigid', att: true, vel: 'relabel', ja: '位置 + 姿勢 + v′ = R v の読み替え(u′ = R u + Ṙ(x − c)・絶対の慣性速度は不変)' },
  { key: 'posAttVKick', pos: 'rigid', att: true, vel: 'kick', ja: '位置 + 姿勢 + v ← R v(絶対の慣性速度への新しいキック)' },
  { key: 'advectKick', pos: 'rigid', att: true, vel: 'advectKick', ja: 'v ← R v + Ṙ(x − c)(移流を速度へもう一度足す —— 二重計上のキック)' },
  { key: 'globalRbar', pos: 'rigidGlobal', att: false, vel: 'none', ja: '対照: 全受け手を同じ R̄(源の中心 c₀ —— 一つの座標回転。受け手ごとの角と残りを捨てる)' },
];
export const optionOf = (key) => OPTIONS.find((o) => o.key === key);

/* ───────── 帳簿の小道具 ───────── */
/** 軌道角運動量 Σ m (x − c) × v・自転の角運動量 Σ ½ m R² s â・運動量 Σ m v・Σ ½ m v²(mask の粒子だけ) */
export function ledgerOf(st, c, mask) {
  let L = [0, 0, 0], Ls = [0, 0, 0], P = [0, 0, 0], K = 0;
  for (let i = 0; i < st.n; i++) {
    if (mask && !mask[i]) continue;
    const m = st.m[i], x = [st.x[i] - c[0], st.y[i] - c[1], st.z[i] - c[2]], v = [st.vx[i], st.vy[i], st.vz[i]];
    L = add(L, scale(cross(x, v), m)); P = add(P, scale(v, m)); K += 0.5 * m * dot(v, v);
    if (st.spin && st.R) { const J = 0.5 * m * st.R[i] * st.R[i] * st.spin[i]; Ls = add(Ls, [J * st.sax[i], J * st.say[i], J * st.saz[i]]); }
  }
  return { L, Ls, P, K };
}
/** 粒子間距離の相対の変化(A → B・mask の対)—— 最大・平均・rms */
export function pairStats(A, B, n, mask) {
  let mx = 0, s = 0, s2 = 0, k = 0;
  for (let i = 0; i < n; i++) {
    if (mask && !mask[i]) continue;
    for (let j = i + 1; j < n; j++) {
      if (mask && !mask[j]) continue;
      const d0 = Math.hypot(A.x[j] - A.x[i], A.y[j] - A.y[i], A.z[j] - A.z[i]), d1 = Math.hypot(B.x[j] - B.x[i], B.y[j] - B.y[i], B.z[j] - B.z[i]);
      if (!(d0 > 0)) continue;
      const e = d1 / d0 - 1;
      mx = Math.max(mx, Math.abs(e)); s += e; s2 += e * e; k++;
    }
  }
  return { pairs: k, max: mx, mean: k ? s / k : 0, rms: k ? Math.sqrt(s2 / k) : 0 };
}

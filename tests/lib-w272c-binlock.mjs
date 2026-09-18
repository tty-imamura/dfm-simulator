// 第272便c(第62報「連星と引きずり」)の**純関数**ライブラリ。
//
// ■ ここにあるもの
//   (1) `lockDeclaration(spec)` —— 「互いに潮汐ロックした連星は kFrame≈0 とみなせる」という
//       **原仮定者の仮説(第62報)**を、測る前に 1 つの記録へ落とす宣言器。
//       **2D エンジンでは面外(面内を向く)自転軸を持てない**ことを必ず欄に持たせる:
//       この器の `spin` は面直(z)成分だけで、「自転軸が互いを向く」配位は表現できない。
//       運動学の宣言 ω_i = Ω_AB + σ_i·n(n は面直の単位ベクトル)として記録するだけで、
//       力へは 1 バイトも接続しない。
//   (2) `sigmaTimes(model, obs, sigma)` —— σ 倍(記録用)。σ が無ければ null(0 で割らない)。
//   (3) `restTwoBodyAnalytic(inp)` —— **静止 2 体**の mesh-v2 運動方程式を解析で解く
//       (AA7 の R∥ の導出)。実装 `HP.dfmMeshV2Solve` と突き合わせるための独立計算である。
//   (4) `rParallel(inp)` —— R∥ = −(a₂−a₁)·n̂ / (G(m₁+m₂)/r²) と横成分 R⊥、Σm_i a_i。
//   (5) `meshFlowAt(bodies, x, y, opt)` —— pull 重みのフレーム速度場
//       u(x) = η·Σ_j w_j v_j /(D₀+Σ_j w_j)、w_j = m_j(|x−q_j|²+ε²)^{−p/2}。
//   (6) `meshFlowGrad(bodies, x, y, opt)` —— ∇u を中心差分で作り、
//       **拡縮 H=½tr(∇u)・回転 Ω=½(∂ₓu_y−∂_yu_x)・伸縮テンソル(対称部)の固有値**へ分解する。
//   (7) `apparentCounterSpin(omegaMesh, omegaBody)` —— 「他方が逆方向に自転したのと同じ状態」を
//       **相対座標の記述**として書く欄(物理的自転 J の変化ではない)。
//
// ■ ここに無いもの(意図的に)
//   **観測値が 1 つも無い**(CSV が正本)。**合否の閾値も無い**。**力学も無い**(エンジンに触れない)。
//   `S._core` には 1 命令も足していない。**内蔵プリセットは 1 bit も変えない**。
//
// ■ この器が**言わないこと**
//   「潮汐ロックを証明した」「引きずり式が確定した」「kFrame≈0 を法則として内蔵した」
//   「観測と合った」「共同根を再検証した」。

// ---------------------------------------------------------------- (1) 宣言
export const SPIN_AXIS_NOTE_JA =
  '**2D エンジンでは面外の自転軸を持てない。** この器の spin は面直(z)成分だけで、'
  + '「コンパクト連星の自転軸が互いを向く」(= 面内を向く軸)配位は幾何として表現できない。'
  + 'ここでは運動学の宣言 ω_i = Ω_AB + σ_i·n(n は面直の単位ベクトル)として表に載せるだけで、'
  + '力へは 1 バイトも接続しない。面内軸の帰結(パルス形状・食の幾何・測地線歳差)は**未実装**である。';

export function lockDeclaration(spec) {
  const s = spec || {};
  const sigma = Array.isArray(s.sigma) ? s.sigma.map(Number) : [];
  return {
    hypothesis: '互いに潮汐ロックした天体は kFrame≈0 とみなせる(**原仮定者の仮説(第62報)**)',
    systemKind: String(s.systemKind || 'unknown'),
    id: s.id === undefined ? null : s.id,
    // ω_i = Ω_AB + σ_i n。σ_i=0 が「公転と同じ角速度(同期)」である。
    kinematics: { form: 'omega_i = Omega_AB + sigma_i * n', sigma,
      synchronous: sigma.length > 0 && sigma.every((z) => z === 0) },
    observedSpin: s.observedSpin === undefined ? null : s.observedSpin,
    synchronousObserved: s.synchronousObserved === true,
    dimensionality: '2D',
    spinAxisNote: SPIN_AXIS_NOTE_JA,
    inPlaneAxisRepresentable: false,
    connectedToForce: false,
    independentChecksNotImplemented: Array.isArray(s.independentChecks) ? s.independentChecks.slice() : [],
    note: '**仮説であって既定ではない。** 既定の kFrame=1 と旧共同根は消さずに並べる。',
  };
}

// ---------------------------------------------------------------- (2) σ 倍
// **第264便d(AD)と同じ落とし穴を踏まないこと**: `Number(null)` も `Number("")` も **0** になるので、
// 「外挿が付かなかった量(null)」を `Number` で読むと **模型値 0** として σ 倍が計算されてしまう
// (観測値そのものぶんの σ 倍が出て、未測定が巨大な残差に化ける)。
// **数として宣言されたものだけを受け取る**: `typeof === "number"` かつ有限でなければ null を返す。
export function sigmaTimes(model, obs, sigma) {
  if (typeof model !== 'number' || !Number.isFinite(model)) return null;
  if (typeof obs !== 'number' || !Number.isFinite(obs)) return null;
  if (typeof sigma !== 'number' || !Number.isFinite(sigma) || !(sigma > 0)) return null;
  return (model - obs) / sigma;
}

// ---------------------------------------------------------------- (3) 静止 2 体の解析解
// mesh-v2(第265便b)の則: W_ij = η·w_ij/(D₀+Σ_k w_ik)、w_ij = m_j(d²+ε²)^{−p/2}(j≠i)。
//   2 体では行和 Σ_j W_ij = η·χ_i、χ_i = w_ij/(D₀+w_ij) なので
//   A = I−W = [[1, −c₁],[−c₂, 1]](c_i = η χ_i)・**H = AᵀMA**:
//     H₁₁ = m₁ + m₂c₂²、H₁₂ = −(m₁c₁ + m₂c₂)、H₂₂ = m₁c₁² + m₂
//   ゲージ① inertia: δ = M − Σ m_i(1−c_i)²、H′ = H + δ·m mᵀ/M²
//   静止(v=0)では計量の微分項が消えるので **H′·a = F**(F は重力・F₁=−F₂=G m₁m₂/r²·n̂)。
//   → a を 2×2 の陽解で解き、R∥ = −(a₂−a₁)·n̂ /(G M/r²) を返す。
//   **D₀=0・η=1 の極では H は特異**(行和 1)なので、ゲージ① の δ=M で解く。
//   このとき a₁−a₂ = G m₁m₂/(r²M) となり **R∥ = μ/M = m₁m₂/M²**(≤ 1/4)である。
export function restTwoBodyAnalytic(inp) {
  const o = inp || {};
  const m1 = Number(o.m1), m2 = Number(o.m2), r = Number(o.r);
  const G = (o.G === undefined) ? 1 : Number(o.G);
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  const p = (o.p === undefined) ? 1 : Number(o.p);
  const D0 = (o.D0 === undefined) ? 0 : Number(o.D0);
  const eta = (o.eta === undefined) ? 1 : Number(o.eta);
  const gauge = (o.gauge === 'constraint') ? 'constraint' : 'inertia';
  if (![m1, m2, r, G, eps, p, D0, eta].every(Number.isFinite) || !(m1 > 0) || !(m2 > 0) || !(r > 0)) return null;
  const kern = Math.pow(r * r + eps * eps, -p / 2);
  const w12 = m2 * kern, w21 = m1 * kern;           // 行 i が見る重み(相手だけ)
  const chi1 = (D0 + w12 > 0) ? w12 / (D0 + w12) : 0;
  const chi2 = (D0 + w21 > 0) ? w21 / (D0 + w21) : 0;
  const c1 = eta * chi1, c2 = eta * chi2;
  const M = m1 + m2;
  const H11 = m1 + m2 * c2 * c2, H12 = -(m1 * c1 + m2 * c2), H22 = m1 * c1 * c1 + m2;
  const h11 = m1 * (1 - c1) * (1 - c1) + m2 * (1 - c2) * (1 - c2);
  const delta = M - h11;
  // 重力(mesh-v2 と同じ核: 力 F_i = m_i·G m_j (q_j−q_i)/(r²+ε²)^{3/2})
  const gk = G / Math.pow(r * r + eps * eps, 1.5) * r;   // (q_j−q_i)·n̂ = ±r
  const F1 = m1 * m2 * gk, F2 = -m1 * m2 * gk;           // n̂ は 1→2 向き
  let A11 = H11, A12 = H12, A22 = H22;
  if (gauge === 'inertia' && M > 0 && delta !== 0) {
    A11 += delta * m1 * m1 / (M * M);
    A12 += delta * m1 * m2 / (M * M);
    A22 += delta * m2 * m2 / (M * M);
  }
  const det = A11 * A22 - A12 * A12;
  const structural = (D0 === 0 && eta === 1);
  let a1 = null, a2 = null, stop = null;
  if (gauge === 'constraint' && structural) {
    // ② 零方向(共通並進)を外して Σa_i = 0 のゲージで解く。2 体では H = M·[[1,−1],[−1,1]] なので
    //    非零固有値は 2M(固有ベクトル (1,−1)/√2)。a = ((F₁−F₂)/2)/(2M)·(1,−1)。
    const lam = 2 * M;
    const d = (F1 - F2) / Math.SQRT2;
    a1 = d / lam / Math.SQRT2; a2 = -d / lam / Math.SQRT2;
  } else if (Math.abs(det) > 0) {
    a1 = (A22 * F1 - A12 * F2) / det;
    a2 = (A11 * F2 - A12 * F1) / det;
  } else stop = 'singular';
  // **分母は 2 通りある**。定義(AA7)の分母は **軟化なしの G·M/r²** である。
  // 軟化つきの相対加速度 G·M·r/(r²+ε²)^{3/2} を分母にした列も別名で出す
  // (2 つの比は (1+ε²/r²)^{3/2} だけ違う —— ε の帳簿を数値の性質と混ぜないため)。
  const newtonRelHard = G * M / (r * r);
  const newtonRelSoft = G * M * r / Math.pow(r * r + eps * eps, 1.5);
  const rel = (a1 === null) ? null : a2 - a1;
  return { m1, m2, r, G, eps, p, D0, eta, gauge, chi1, chi2, c1, c2, M,
    H: [H11, H12, H22], Hgauged: [A11, A12, A22], h11, delta, det, structural, stop,
    F: [F1, F2], a1, a2, relAccel: rel,
    newtonRelAccel: -newtonRelHard, newtonRelAccelSoftened: -newtonRelSoft,
    rPar: (rel === null) ? null : -rel / newtonRelHard,
    rParSoftenedDenominator: (rel === null) ? null : -rel / newtonRelSoft,
    softeningDenominatorRatio: Math.pow(1 + eps * eps / (r * r), 1.5),
    muOverM: m1 * m2 / (M * M),
    note: 'これは AA7 の**独立な解析計算**であって、実装の写しではない。'
      + '分母は定義どおり軟化なしの G·M/r²(軟化つきの列は別名)。' };
}

// ---------------------------------------------------------------- (4) R∥
export function rParallel(inp) {
  const o = inp || {};
  const a1 = o.a1, a2 = o.a2, n = o.n;
  const G = Number(o.G), M = Number(o.M), r = Number(o.r);
  const m1 = Number(o.m1), m2 = Number(o.m2);
  if (!Array.isArray(a1) || !Array.isArray(a2) || !Array.isArray(n)) return null;
  if (![G, M, r].every(Number.isFinite) || !(r > 0) || !(M > 0)) return null;
  const nl = Math.hypot(n[0], n[1]);
  if (!(nl > 0)) return null;
  const nx = n[0] / nl, ny = n[1] / nl, tx = -ny, ty = nx;
  const dx = a2[0] - a1[0], dy = a2[1] - a1[1];
  const den = G * M / (r * r);
  const sum = ([m1, m2].every(Number.isFinite))
    ? [m1 * a1[0] + m2 * a2[0], m1 * a1[1] + m2 * a2[1]] : null;
  return { rPar: -(dx * nx + dy * ny) / den, rPerp: -(dx * tx + dy * ty) / den,
    relAccel: [dx, dy], denominator: den, sumMassAccel: sum,
    note: 'R∥=1 が Newton。**「比が 1 になる」と先に結論しない** —— 値は実測して書く。' };
}

// ---------------------------------------------------------------- (5) フレーム速度場
export function meshFlowAt(bodies, x, y, opt) {
  const o = opt || {};
  const eps = (o.eps === undefined) ? 0 : Number(o.eps);
  const p = (o.p === undefined) ? 1 : Number(o.p);
  const D0 = (o.D0 === undefined) ? 0 : Number(o.D0);
  const eta = (o.eta === undefined) ? 1 : Number(o.eta);
  const skip = (o.skip === undefined) ? -1 : Number(o.skip);
  if (!Array.isArray(bodies) || bodies.length === 0) return null;
  let sw = 0, ux = 0, uy = 0;
  for (let j = 0; j < bodies.length; j++) {
    if (j === skip) continue;
    const b = bodies[j];
    const dx = x - Number(b.x), dy = y - Number(b.y);
    const w = Number(b.m) * Math.pow(dx * dx + dy * dy + eps * eps, -p / 2);
    if (!Number.isFinite(w)) return null;
    sw += w; ux += w * Number(b.vx || 0); uy += w * Number(b.vy || 0);
  }
  const den = D0 + sw;
  if (!(den > 0)) return null;
  return { ux: eta * ux / den, uy: eta * uy / den, w: sw, chi: sw / den };
}

// ---------------------------------------------------------------- (6) ∇u の分解
export function decomposeGrad(J) {
  if (!J || ![J.xx, J.xy, J.yx, J.yy].every(Number.isFinite)) return null;
  const H = 0.5 * (J.xx + J.yy);                    // 拡縮(等方部)
  const Om = 0.5 * (J.yx - J.xy);                   // 回転(反対称部)
  const sxx = J.xx - H, syy = J.yy - H, sxy = 0.5 * (J.xy + J.yx);
  const disc = Math.sqrt(sxx * sxx + sxy * sxy);    // 対称トレースレス部の固有値 ±disc
  return { expansion: H, rotation: Om,
    strain: { xx: sxx, xy: sxy, yy: syy, eig: [disc, -disc] },
    divergence: J.xx + J.yy, curl: J.yx - J.xy,
    note: '∇u = H·I + Ω·ε + 伸縮(対称トレースレス)。**回転 Ω は相対座標の量**であって自転 J ではない。' };
}

export function meshFlowGrad(bodies, x, y, opt) {
  const o = opt || {};
  const h = Number.isFinite(o.h) ? Number(o.h) : 1e-4;
  const f = (xx, yy) => meshFlowAt(bodies, xx, yy, o);
  const px = f(x + h, y), mx = f(x - h, y), py = f(x, y + h), my = f(x, y - h);
  if (!px || !mx || !py || !my) return null;
  const J = { xx: (px.ux - mx.ux) / (2 * h), yx: (px.uy - mx.uy) / (2 * h),
    xy: (py.ux - my.ux) / (2 * h), yy: (py.uy - my.uy) / (2 * h) };
  const d = decomposeGrad(J);
  return { J, h, ...d, at: f(x, y) };
}

// ---------------------------------------------------------------- (7) 見かけの逆自転
export function apparentCounterSpin(omegaMesh, omegaBody) {
  const m = Number(omegaMesh), b = Number(omegaBody || 0);
  if (!Number.isFinite(m)) return null;
  return { omegaMesh: m, omegaBody: b, relative: m - b, apparentBodySpinInMeshFrame: b - m,
    note: '**これは相対座標の記述である。** 物理的な自転 J を変えるにはトルクが要る —— '
      + 'メッシュが回ったこと自体は J を変えない(帳簿で分けて示す)。' };
}

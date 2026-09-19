// 第272便c(第62報「連星と引きずり」)の**純関数**ライブラリ。
//
// ■ ここにあるもの
//   (1) `lockDeclaration(spec)` —— 「互いに潮汐ロックした連星は kFrame≈0 とみなせる」という
//       **原仮定者の仮説(第62報)**を、測る前に 1 つの記録へ落とす宣言器。
//       **2D エンジンでは面外(面内を向く)自転軸を持てない**ことを必ず欄に持たせる:
//       この器の `spin` は面直(z)成分だけで、「自転軸が互いを向く」配位は表現できない。
//       運動学の宣言 ω_i = Ω_AB + σ_i·n として記録するだけで、力へは 1 バイトも接続しない。
//       **第273便d(統括の検証項目 R18)の訂正**: この n は**相手へ向かう単位ベクトル**
//       (天体間方向 n̂ = (q_j − q_i)/|q_j − q_i|・**面内**)である。第272便c の
//       「n は面直の単位ベクトル」は**誤りなので撤回する** —— 原仮定者の仮説(第62報)の
//       「コンパクト連星の自転軸は互いを向く」は、まさに**面内で相手を向く軸**のことだからである。
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
  + 'ここでは運動学の宣言 ω_i = Ω_AB + σ_i·n として表に載せるだけで、力へは 1 バイトも接続しない。'
  + '**n は相手へ向かう単位ベクトル(天体間方向・面内)である**(第273便d・R18 の訂正 —— '
  + '第272便c の「n は面直の単位ベクトル」は撤回する)。'
  + '**(σ_i n)×n = 0 の意味は限定される**: 「軸に沿った成分は、この外積で作る項には現れない」'
  + '(= 軸上の相対すべりをこの項が拾わない)というだけであって、'
  + '「面内軸の自転が連星の力学に効かない」という意味ではない。'
  + '面内軸の帰結(パルス形状・食の幾何・測地線歳差・自転–軌道結合)は**未実装**である。';

// ---------------------------------------------------------------- 符号規約(第273便d・AH22)
// **絶対値で同期を判定しない。** 逆行(🌊 のトリトンのような retrograde)を「同期」と読まないために、
// 面直(z)角速度の正方向・視線・座標系を先に固定する。
//   ・座標系: 画面の右手系 (x 右・y 上)。面直(z)は**画面手前向き**を正とする。
//   ・正方向: 反時計回り(x→y の向き)が **+**。Ω_AB = (r×v)_z/r² も spin も同じ規約である。
//   ・視線: 観測者は **+z 側から −z 方向を見下ろす**(画面をそのまま見る)。2D なので傾斜は無い —
//     実在系の軌道傾斜は**転写の段階で向き ±1 に畳まれている**(第188便の 🌊 の i=157.345° → 逆行)。
//   ・同期の判定は **ω_spin/Ω_orb**(符号つき)で行う。**+1 が同期・−1 は「逆行の同期」**であって、
//     |ω|/|Ω| = 1 の 2 つを区別しない読み方は採らない。
export const SIGN_CONVENTION_JA =
  '面直(z)は画面手前向きが正・反時計回り(x→y)が正・視線は +z 側から見下ろす。'
  + 'Ω_AB=(r×v)_z/r² と spin を**同じ符号規約**で比べる。同期比は符号つきの ω_spin/Ω_orb で読み、'
  + '**+1 が同期・−1 は逆行の同期**である(**絶対値では同期と逆行を区別できない**ので絶対値で判定しない)。';

/**
 * 符号つきの同期比。**絶対値を取らない。**
 *   spin・orbit は面直(z)成分の角速度(同じ符号規約)。
 * 返り値: ratio = ω_spin/Ω_orb(符号つき)・sameSense(向きが同じか)・
 *         synchronousProgradeApprox / synchronousRetrogradeApprox(tol 以内か)。
 * **転写行の無い量は null を返す**(0 や 1 で埋めない)。
 */
export function signedSynchrony(spin, orbit, tol) {
  const TOL = (tol === undefined) ? 0.01 : Number(tol);
  if (typeof spin !== 'number' || !Number.isFinite(spin)) return null;
  if (typeof orbit !== 'number' || !Number.isFinite(orbit) || orbit === 0) return null;
  const ratio = spin / orbit;
  return { spin, orbit, ratio, sameSense: (ratio > 0),
    synchronousProgradeApprox: Math.abs(ratio - 1) <= TOL,
    synchronousRetrogradeApprox: Math.abs(ratio + 1) <= TOL,
    absRatio: Math.abs(ratio),
    convention: SIGN_CONVENTION_JA,
    note: '**|ratio|=1 だけでは同期と逆行の同期を区別できない。** 符号を落とさずに読むこと。' };
}

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

// ------------------------------------------------ (8) 正準運動量の検査(第273便d・AH26)
// mesh-v2 の運動方程式は **H′·a = R**(R = 重力 + 計量の微分項)である。ここで比べるのは
// **2 つの別々の量**であって、どちらかが 0 でないことを「保存則違反」とは書かない:
//   ① Σ mᵢ aᵢ …… **通常の重心**(粒子セクタの運動量 Σmᵢvᵢ の変化率)。
//      χ₁≠χ₂ かつ η>0 の静止 2 体では 0 にならない(第272便c の否定結果)。
//   ② 1ᵀH′a …… **正準運動量 p = H′v の微分の第 1 項**。静止(v=0)では計量の微分項が落ちて
//      R = F(重力)になり、対和の重力は 1ᵀF=0 なので **1ᵀH′a は恒等的に 0** である。
//      非静止では d(1ᵀH′v)/dt = 1ᵀH′a + 1ᵀ(dH′/dt)v で、**第 2 項を別に測らないと保存は言えない**。
// 受理条件(どれを見て「この則を採る/採らない」を決めるか)は**未確定**である。候補は
//   (a) 長時間走行での正準運動量 1ᵀH′v のドリフト
//   (b) 角運動量 Σ mᵢ(qᵢ×vᵢ) のドリフト
//   (c) エネルギー(½vᵀH′v + ポテンシャル)のドリフト
//   (d) 背景(メッシュ)との交換を帳簿に持たせたうえでの和
//   (e) 通常の重心 Σmᵢqᵢ/M の直線運動
// の 5 つで、**本便はどれも「採用」していない**(並べただけである)。
export const CANONICAL_ACCEPTANCE_CANDIDATES = [
  { id: 'canonical-drift', what: '長時間走行での正準運動量 1ᵀH′v のドリフト' },
  { id: 'angular-drift', what: '角運動量 Σ mᵢ(qᵢ×vᵢ) のドリフト' },
  { id: 'energy-drift', what: 'エネルギー ½vᵀH′v + ポテンシャル のドリフト' },
  { id: 'background-exchange', what: 'メッシュ(背景)との交換を帳簿に持たせたうえでの和' },
  { id: 'ordinary-com', what: '通常の重心 Σmᵢqᵢ/M の直線運動' },
];

/**
 * 不均衡 2 種を 1 つの記録にする純関数。
 *   inp = { m:[…], accel:{x:[…],y:[…]}, Hg:[…n*n…], n,
 *           vel?:{x:[…],y:[…]}, HgPlus?:[…], HgMinus?:[…], h? }
 * `HgPlus`/`HgMinus` は **q ± h·v** で評価した H′(呼び出し側が実装へ 2 回問い合わせて作る)。
 * 与えられたときだけ Ḣ′ = (H′₊ − H′₋)/(2h) を中心差分で作り、1ᵀ(Ḣ′v) を足した
 * **d(1ᵀH′v)/dt** を出す。無ければ `canonicalTotal` は null(0 で埋めない)。
 */
export function canonicalMomentumCheck(inp) {
  const o = inp || {};
  const n = Number(o.n) || (Array.isArray(o.m) ? o.m.length : 0);
  const m = o.m, a = o.accel;
  if (!(n >= 1) || !Array.isArray(m) || !a || !Array.isArray(a.x) || !Array.isArray(a.y)) return null;
  const Hg = Array.isArray(o.Hg) ? o.Hg : null;
  const axis = (arr) => {
    let s = 0, d = 0;
    for (let i = 0; i < n; i++) { s += m[i] * arr[i]; d += Math.abs(m[i] * arr[i]); }
    return { sum: s, scale: d, rel: (d > 0) ? Math.abs(s) / d : null };
  };
  const rowSums = (Mx, u) => {
    let s = 0, d = 0;
    for (let r = 0; r < n; r++) {
      let t = 0;
      for (let c = 0; c < n; c++) t += Mx[r * n + c] * u[c];
      s += t; d += Math.abs(t);
    }
    return { sum: s, scale: d, rel: (d > 0) ? Math.abs(s) / d : null };
  };
  const sx = axis(a.x), sy = axis(a.y);
  const cx = Hg ? rowSums(Hg, a.x) : null, cy = Hg ? rowSums(Hg, a.y) : null;
  // 非静止項 1ᵀ(Ḣ′v)
  let dotX = null, dotY = null;
  const h = Number(o.h);
  if (Hg && Array.isArray(o.HgPlus) && Array.isArray(o.HgMinus) && Number.isFinite(h) && h !== 0
      && o.vel && Array.isArray(o.vel.x) && Array.isArray(o.vel.y)) {
    const Hdot = new Array(n * n);
    for (let z = 0; z < n * n; z++) Hdot[z] = (o.HgPlus[z] - o.HgMinus[z]) / (2 * h);
    dotX = rowSums(Hdot, o.vel.x); dotY = rowSums(Hdot, o.vel.y);
  }
  return {
    n,
    sumMassAccel: { x: sx.sum, y: sy.sum, scale: [sx.scale, sy.scale], rel: [sx.rel, sy.rel] },
    canonicalAccel: cx ? { x: cx.sum, y: cy.sum, scale: [cx.scale, cy.scale], rel: [cx.rel, cy.rel] } : null,
    hdotTerm: dotX ? { x: dotX.sum, y: dotY.sum } : null,
    canonicalTotal: (dotX && cx) ? { x: cx.sum + dotX.sum, y: cy.sum + dotY.sum } : null,
    hdotAvailable: !!dotX,
    acceptanceCandidates: CANONICAL_ACCEPTANCE_CANDIDATES.map((z) => z.id),
    note: 'Σmᵢaᵢ(通常の重心)と 1ᵀH′a(正準運動量の微分の第 1 項)は**別の量**である。'
      + '**「保存則違反」とは書かない** —— 受理条件は未確定で、候補を並べただけである。',
  };
}

// ------------------------------------------------ (9) 候補式の位置づけ(第273便d・AH21)
// `tests/lib-w272b-pairlock.mjs` の候補 3 本について、第272便b の実測を踏まえた**位置づけ**を
// 1 か所に書く(**採用の宣言ではない**。候補式はどれもエンジンの力学へ接続していない)。
//   (i)   relative-mesh-response …… **主**。同期円軌道で厳密に 0 になり、H_AB(拡縮)と s_i(相対自転)の
//         両方を 1 つの無次元 X に畳む(❄️ で 2×10⁻¹²)。
//   (iii) exp-lock …… **対照**。同じ「同期 → 0」を別の関数形(指数)で表す(❄️ で 1.4×10⁻⁶)。
//         主と同じ結論が関数形に依らないかを見るために置く。
//   (ii)  lock-factor …… **不十分**。k_eff = k_F(1 − α·S_lock·χ_pair) は**完全に同期していても**
//         k_F(1 − χ_pair) が残る。χ が 2 桁小さい ❄️ では k_eff ≈ 0.998·k_F で、「同期 → k≈0」を表せない。
//   C5(第272便b の対照列)は **t=0 の定数評価**であり、**動的な維持の実証ではない**。
export const PAIRLOCK_CANDIDATE_ROLES = {
  version: 'w273d-1',
  roles: {
    candI: { name: 'relative-mesh-response', role: 'primary',
      why: '同期円軌道で厳密に 0・H_AB と s_i を 1 つの無次元 X に畳む(❄️ で 2e-12)' },
    candII: { name: 'lock-factor', role: 'insufficient',
      why: '完全同期でも k_F(1−χ_pair) が残る —— ❄️ では 0.998(「同期 → k≈0」を表せない)' },
    candIII: { name: 'exp-lock', role: 'control',
      why: '同じ「同期 → 0」を別の関数形(指数)で表す対照(❄️ で 1.4e-6)' },
  },
  c5Note: 'C5 は **t=0 の定数評価**であり、**動的維持の実証ではない**。',
  notClaim: ['引きずり式が確定した', '候補を採用した', '潮汐ロックを証明した'],
};

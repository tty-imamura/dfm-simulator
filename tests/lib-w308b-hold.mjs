// 第308便b(原仮定者の裁定(第101報)AN348 → (C)・(第102報)①「引きずりの計算は相互に行われているので、反作用を返すと二重計上にならないかを確認する」・
// 決断事項 AN348・AN349・AN355・統括の検証項目 R215): **元の自転軸を維持するトルクと慣性自転への駆動・源への反作用・供給項・帳簿**の純関数。
//
// エンジン(beta/index.html の inertialDrag3HoldStep・inertialDrag3AxialApply の axisHold の枝)と**同じ式・同じ演算順**の参照(holdStepRef)と、
// 二重計上の比較の型(相互の駆動 D(i←j)・D(j←i) から (a) 反作用なし・(b) 反作用あり・(c) 対ごとに 1 回)・散逸の結合の型(接点 1 つ —— 滑り s = Ω_i − BΩ_j)・
// 軸引きずりの核の遠方の閉じた式(核は引数 —— "mu2"・"sphere"(q 則)・"bevel"(鏡映 × sinθ —— 第308便a の規則の参照の形))。
//
// ■ 言わないこと: 「帳簿が完全に閉じた」「自転が釣り合った」(器が時間発展の表で示した範囲を数で書く)・τ_C の応答則を「導出」と書くこと(候補の応答則)。
export const LIB_VERSION = 'w308b-hold-lib-1';
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const norm = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
export const unit = (a) => scale(a, 1 / norm(a));
const fin3 = (v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);

/* ───────── 軸の維持(垂直な分)と駆動(平行な分) ───────── */
/** ω を軸 â(単位)に平行な成分 p と垂直な成分 ω⊥ に分ける */
export function splitAxis(w, a) { const p = dot(w, a); return { par: p, perp: sub(w, scale(a, p)) }; }
/** 維持のトルク τ_hold = −ω⊥ × J(ジャイロ —— τ_hold·Ω = 0)。エンジンの演算順(−(p_y j_z − p_z j_y) …) */
export function holdTorque(J, wPerp) {
  if (!fin3(J) || !fin3(wPerp)) throw new Error('holdTorque の定義域');
  return [-(wPerp[1] * J[2] - wPerp[2] * J[1]), -(wPerp[2] * J[0] - wPerp[0] * J[2]), -(wPerp[0] * J[1] - wPerp[1] * J[0])];
}
/** 平行な分の駆動(候補の応答則): τ = (I p/τ_C) â */
export const driveTorque = (I, p, tauC, a) => scale(a, I * p / tauC);
/** 有限の力積の厳密な運動エネルギーの増分(軸方向のスカラー J と dJ)= dJ(2J + dJ)/(2I) */
export const exactDK = (J, I, dJ) => dJ * (2 * J + dJ) / (2 * I);
/** ベクトルの厳密な増分 (2J·dJ + |dJ|²)/(2I) */
export const exactDKvec = (J, I, dJ) => (2 * dot(J, dJ) + dot(dJ, dJ)) / (2 * I);
/** 等しく反対のトルクの仕事率 P_pair = τ·(Ω_i − Ω_j) —— 受け手の分 τ·Ω_i と源の分 −τ·Ω_j */
export function pairPower(tau, Oi, Oj) { const recv = dot(tau, Oi), source = -dot(tau, Oj); return { recv, source, P: recv + source }; }

/* ───────── 二重計上の比較(第102報 ①) ───────── */
/**
 * 相互の駆動 Dij = D(i←j)(j の自転の引きずりが i に与える駆動のトルク)と Dji = D(j←i) から 3 つの型。Oi・Oj は慣性自転のベクトル。
 *   (a) 反作用なし: τ_i = Dij・τ_j = Dji —— 自転の全角運動量の率 Dij + Dji(外から)・仕事率 Dij·Oi + Dji·Oj。
 *   (b) 反作用あり(各自の駆動 + 相手の駆動の反作用): τ_i = Dij − Dji・τ_j = Dji − Dij —— 全角運動量は閉じる・仕事率 (Dij − Dji)·(Oi − Oj)。
 *   (c) 対ごとに 1 回: 対の交換の分 A = ½(Dij − Dji) を 1 度だけ(τ_i = A・τ_j = −A)・対称の分 S = ½(Dij + Dji)(自転どうしで交換できない分 —— 2S が受け皿へ)。
 *   恒等式: (b) の交換 = 2 × (c) の交換・(b) は S を落とす・(a) = (c) + 受け皿の S。ρ = Dji·Dij/|Dij|²(−1: 作用・反作用の対 —— (b) は (a) の 2 倍 /
 *   +1: 同じ向きの対 —— (b) は 0)。
 */
export function pairSchemes({ Dij, Dji, Oi, Oj }) {
  const S = scale(add(Dij, Dji), 0.5), A = scale(sub(Dij, Dji), 0.5), dd = dot(Dij, Dij);
  const a = { ti: Dij, tj: Dji, L: add(Dij, Dji), P: dot(Dij, Oi) + dot(Dji, Oj) };
  const b = { ti: sub(Dij, Dji), tj: sub(Dji, Dij), L: add(sub(Dij, Dji), sub(Dji, Dij)), P: dot(sub(Dij, Dji), sub(Oi, Oj)) };
  const c = { ti: A, tj: scale(A, -1), L: [0, 0, 0], receptacle: scale(S, 2), P: dot(A, sub(Oi, Oj)) };
  return { S, A, rho: dd > 0 ? dot(Dji, Dij) / dd : null, a, b, c,
    bOverC: norm(A) > 0 ? norm(b.ti) / norm(c.ti) : null, bOverA: norm(Dij) > 0 ? norm(b.ti) / norm(Dij) : null,
    symFrac: (norm(S) + norm(A)) > 0 ? norm(S) / (norm(S) + norm(A)) : null };
}
/** 鏡映 B = 2 r̂ r̂ᵀ − I(r̂ は単位 —— 対合: B² = I・対称) */
export const reflect = (rh, v) => sub(scale(rh, 2 * dot(rh, v)), v);
/**
 * 散逸の結合(接点 1 つ —— 候補の構成法・導出ではない): 滑り s = Ω_i − B Ω_j・τ_i = −Γ s・τ_j = Bᵀ Γ s(B は写像 v ↦ Bv と転置 v ↦ Bᵀv の組)。
 * 仕事率 τ_i·Ω_i + τ_j·Ω_j = −Γ|s|² ≤ 0。自転の角運動量の和 τ_i + τ_j = −(I − Bᵀ)Γ s(B ≠ I なら受け皿 —— 軌道 —— が要る)。
 */
export function contactPair({ Oi, Oj, B, BT, Gamma }) {
  const s = sub(Oi, B(Oj)), ti = scale(s, -Gamma), tj = BT(scale(s, Gamma));
  return { s, ti, tj, L: add(ti, tj), P: dot(ti, Oi) + dot(tj, Oj), Pdiss: -Gamma * dot(s, s) };
}
/** 同じ接点を両側から(i←j と j←i をそれぞれ反作用つきで)数えたとき: 鏡映(対合)なら j←i の型は i←j の型と同じトルク —— 足すと 2 倍 */
export function contactBothViews({ Oi, Oj, rh, Gamma }) {
  const B = (v) => reflect(rh, v);
  const ij = contactPair({ Oi, Oj, B, BT: B, Gamma }), ji = contactPair({ Oi: Oj, Oj: Oi, B, BT: B, Gamma });
  const sum = { ti: add(ij.ti, ji.tj), tj: add(ij.tj, ji.ti) };
  return { ij, ji, sum, factor: norm(ij.ti) > 0 ? norm(sum.ti) / norm(ij.ti) : null,
    sameTorque: norm(sub(ji.tj, ij.ti)) / Math.max(norm(ij.ti), 1e-300) };
}

/* ───────── 軸引きずりの核の遠方の閉じた式(核を引数で受ける —— 規格化 f は呼ぶ側) ───────── */
/**
 * 源の自転ベクトル Om・源から受け手への r̂・規格化 f(r)(回転引きずりの強さ)から ω_D:
 *   "mu2": f μ² â(今の既定の角度則 —— κ の規格化は呼ぶ側)・"sphere": (f/2)[(2−q)Ω + q r̂(r̂·Ω)](½∇×u・q は分母の距離則)・
 *   "bevel": f sinθ [2 r̂(r̂·Ω) − Ω](鏡映 —— 第101報の規則の参照の形・sinθ は宣言の仮定・第308便a の核の規格化と同じとは限らない)
 */
export function kernelFar(kind, Om, rh, f, q = 3) {
  const w = norm(Om);
  if (w === 0) return [0, 0, 0];
  const a = scale(Om, 1 / w), mu = dot(a, rh);
  if (kind === 'mu2') return scale(Om, f * mu * mu);
  if (kind === 'sphere') return scale(add(scale(Om, 2 - q), scale(rh, q * dot(rh, Om))), f / 2);
  if (kind === 'bevel') return scale(reflect(rh, Om), f * Math.sqrt(Math.max(0, 1 - mu * mu)));
  throw new Error('核の種類: ' + kind);
}

/* ───────── エンジンの步の参照(同じ式・同じ演算順) ───────── */
/**
 * bodies[k] = {m, R, s(自転), a:[3](軸), tilt(saOn), pin, held(sourceHold), rcv(駆動の受け手)}・rec(Float64Array n*n*4 —— エンジンの _rdHoldP)・
 * f(慣性の因子)・tauC・reaction・dt。戻り値は 1 步の力積と帳簿の増分(エンジンの inertialDrag3HoldStep の局所の和と同じ順)と各天体の dJ・Q。
 * (状態の更新 —— J の補償和 —— は呼ぶ側。ここは力積と ΔK の式だけ)
 */
export function holdStepRef({ bodies, rec, f, tauC, reaction, dt }) {
  const n = bodies.length, re = reaction === 'source';
  const DJ = new Float64Array(n), QX = new Float64Array(n), QY = new Float64Array(n), QZ = new Float64Array(n);
  let nP = 0, skip = 0, p1 = 0, dLx = 0, dLy = 0, dLz = 0, rLx = 0, rLy = 0, rLz = 0, oLx = 0, oLy = 0, oLz = 0;
  for (let i = 0; i < n; i++) {
    const B = bodies[i];
    if (B.pin || !B.rcv) continue;
    if (!(B.m > 0) || !Number.isFinite(B.m)) continue;
    const Ii = f * B.m * B.R * B.R, ax = B.a[0], ay = B.a[1], az = B.a[2];
    let none = false;
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const b = (i * n + j) * 4, p = B.tilt ? rec[b] * ax + rec[b + 1] * ay + rec[b + 2] * az : rec[b + 3];
      if (p === 0) continue;
      if (!(Ii > 0)) { none = true; continue; }
      const T = Ii * p / tauC, tx = T * ax, ty = T * ay, tz = T * az;
      nP++;
      dLx += tx * dt; dLy += ty * dt; dLz += tz * dt; p1 += T * B.s;
      if (B.held) { QX[i] += tx * dt; QY[i] += ty * dt; QZ[i] += tz * dt; } else DJ[i] += T * dt;
      if (re) {
        const Bj = bodies[j];
        rLx -= tx * dt; rLy -= ty * dt; rLz -= tz * dt;
        const bx = Bj.a[0], by = Bj.a[1], bz = Bj.a[2], c = -(tx * bx + ty * by + tz * bz);
        p1 += c * Bj.s;
        if (Bj.held) { QX[j] -= tx * dt; QY[j] -= ty * dt; QZ[j] -= tz * dt; }
        else if (Bj.pin || !(Bj.m > 0) || !(Bj.R > 0)) { oLx -= tx * dt; oLy -= ty * dt; oLz -= tz * dt; }
        else { DJ[j] += c * dt; oLx += (-tx - c * bx) * dt; oLy += (-ty - c * by) * dt; oLz += (-tz - c * bz) * dt; }
      }
    }
    if (none) skip++;
  }
  return { DJ, Q: [QX, QY, QZ], nP, skip, p1, driveL: [dLx, dLy, dLz], reactL: [rLx, rLy, rLz], outL: [oLx, oLy, oLz] };
}

/* ───────── 純関数の確かめ(器が正本に記録し、QA が同じ関数で引き直す) ───────── */
export function checksOf() {
  const g = {}, v = {};
  const relv = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
  // ① 維持のトルクは仕事 0(τ_hold·Ω = 0)—— 任意の向きの J・ω⊥(丸め床)・平行な軸では 0
  let wMax = 0;
  for (const [J, w] of [[[2, -1, 4], [0.4, 0.3, -0.1]], [[0.3, 0.2, -5], [-1.2, 0.7, 0.05]], [[1e3, 2e2, -7e2], [3e-6, -1e-6, 2e-6]]]) {
    const a = unit(J), perp = splitAxis(w, a).perp, T = holdTorque(J, perp), Om = scale(a, 0.37);
    wMax = Math.max(wMax, Math.abs(dot(T, Om)) / (norm(T) * norm(Om)));
  }
  v.holdWorkRel = wMax; g.holdNoWork = wMax < 1e-15;
  g.holdParallelZero = norm(holdTorque([0, 0, 2], splitAxis([0, 0, -3], [0, 0, 1]).perp)) === 0;
  // ② 有限の力積の厳密な ΔK(スカラーとベクトル)
  const J0 = 0.7, I = 0.3, dJ = 0.05;
  v.exactDK = exactDK(J0, I, dJ); g.exactDK = Math.abs(v.exactDK - ((J0 + dJ) ** 2 - J0 * J0) / (2 * I)) < 1e-15;
  const Jv = [0.2, -0.4, 0.9], dv = [0.01, 0.03, -0.02];
  g.exactDKvec = Math.abs(exactDKvec(Jv, I, dv) - (dot(add(Jv, dv), add(Jv, dv)) - dot(Jv, Jv)) / (2 * I)) < 1e-15;
  // ③ 等しく反対のトルクは角運動量は閉じてもエネルギーは閉じない(P_pair = τ·(Ω_i − Ω_j))
  const pp = pairPower([0, 0, 2], [0, 0, 60], [0, 0, 1]);
  v.pairPower = pp.P; g.pairPowerNotZero = pp.P === 118;
  // ④ 二重計上の恒等式: (b) の交換 = 2 × (c)・同じ向きの対では (b) = 0・作用・反作用の対では (b) = 2(a)
  const Oi = [0, 0, 0.5], D = [0, 0, -0.01];
  const twin = pairSchemes({ Dij: D, Dji: D, Oi, Oj: Oi }), anti = pairSchemes({ Dij: D, Dji: scale(D, -1), Oi, Oj: scale(Oi, -1) });
  const gen = pairSchemes({ Dij: [0.003, -0.01, 0.02], Dji: [-0.004, 0.002, 0.007], Oi: [0.1, 0.2, 0.5], Oj: [-0.3, 0.1, 0.2] });
  v.twin = { rho: twin.rho, bNorm: norm(twin.b.ti), aL: twin.a.L[2] }; v.anti = { rho: anti.rho, bOverA: anti.bOverA }; v.gen = { bOverC: gen.bOverC, symFrac: gen.symFrac };
  g.twinCancels = twin.rho === 1 && norm(twin.b.ti) === 0;
  g.antiDoubles = anti.rho === -1 && anti.bOverA === 2;
  g.bTwiceC = Math.abs(gen.bOverC - 2) < 1e-15 && relv(add(gen.c.ti, scale(gen.S, 1)), gen.a.ti) < 1e-15 && norm(gen.b.L) === 0;
  // ⑤ 接点 1 つの散逸の結合(鏡映): 両側から数えると 2 倍・仕事は −Γ|s|²・赤道は同じ向きのトルク(受け皿 2τ)・極の逆回転は等しく反対(自転の L が閉じる)
  const z = [0, 0, 1], x = [1, 0, 0], d45 = unit([1, 0, 1]);
  const eqCo = contactBothViews({ Oi: [0, 0, 0.5], Oj: [0, 0, 0.5], rh: x, Gamma: 0.2 });
  const poleAnti = contactBothViews({ Oi: [0, 0, 0.5], Oj: [0, 0, -0.5], rh: z, Gamma: 0.2 });
  const bev = contactBothViews({ Oi: [0, 0, 0.5], Oj: [0, 0, 0.3], rh: d45, Gamma: 0.2 });
  v.contact = { eqFactor: eqCo.factor, eqL: eqCo.ij.L, poleL: poleAnti.ij.L, bevFactor: bev.factor, bevSame: bev.sameTorque, bevP: bev.ij.P, bevPdiss: bev.ij.Pdiss };
  g.contactBoth2x = Math.abs(eqCo.factor - 2) < 1e-14 && Math.abs(poleAnti.factor - 2) < 1e-14 && Math.abs(bev.factor - 2) < 1e-14 && bev.sameTorque < 1e-14;
  g.contactWork = Math.abs(bev.ij.P - bev.ij.Pdiss) < 1e-14 && bev.ij.P <= 0;
  g.contactEquatorSameSign = eqCo.ij.ti[2] === eqCo.ij.tj[2] && eqCo.ij.L[2] !== 0;
  g.contactPoleExchange = norm(poleAnti.ij.L) === 0;
  // ⑥ 核の遠方の形: sphere(q=3)の赤道 −f/2・極 +f・bevel の赤道 −f・45° で源の軸への射影 0(ベクトルは横に残る)・mu2 の赤道 0
  const Om = [0, 0, 1];
  v.kern = { sphEq: kernelFar('sphere', Om, x, 1)[2], sphPole: kernelFar('sphere', Om, z, 1)[2], bevEq: kernelFar('bevel', Om, x, 1)[2],
    bev45: kernelFar('bevel', Om, d45, 1), mu2Eq: kernelFar('mu2', Om, x, 1)[2] };
  g.kernelForms = v.kern.sphEq === -0.5 && v.kern.sphPole === 1 && v.kern.bevEq === -1 && Math.abs(v.kern.bev45[2]) < 1e-15 && Math.abs(norm(v.kern.bev45) - Math.SQRT1_2) < 1e-15 && v.kern.mu2Eq === 0;
  const pass = Object.values(g).every((x2) => x2 === true);
  return { pass, gates: g, values: v, n: Object.keys(g).length };
}

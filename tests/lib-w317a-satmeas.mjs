// 第317便a(原仮定者の裁定(第119報)・決断事項 AN431〔衛星の三体の永年の効きは 6 衛星とも帯の内で決まらない —— 何が必要かの探索〕・統括の検証項目 R250):
// **衛星の三体の測る量と予算の純関数**(html を読まない —— 器 tests/exp-w317a-satmeas.mjs が使う。本の写しと種は第315便d の lib tests/lib-w315d-satk1.mjs のまま)。
//
// ■ 何をするか(物理は変えない —— n=2・K1・第316便d と同じ本・同じ步)
//   ・共通の座標時刻の標本(attachGridSampler): 走行を步の数で止め、t_j = j·Δ(Δ = P_seed/16 —— 720 步/公転を割り切る)で記録する。
//     同じ時刻で要素の定義 3 つを作る:
//       E_I = 慣性速度の接触の離心ベクトル(S.vx/vy/vz の差 —— 第315便d と同じ速度)
//       E_C = 座標速度の接触の離心ベクトル(位置の中心差分 v_c = (r_{k+1} − r_{k−1})/(2 dt) —— 1 步先を読んでから記録)
//       E_X = 位置だけの離心ベクトル(公転ごと: 1/r = A + B cos θ + C sin θ の最小二乗 → (B/A, C/A)・θ は t = 0 の軌道面の基底の角・時刻は公転の標本の時刻の平均)
//     慣性速度で定義した接触要素の率と、座標の軌跡の要素の率の違いとして E_I と E_C の差を記録する(エンジンの誤りとは断定しない)。
//   ・回帰(fitL): tests/lib-w304e-apsis.mjs の apsisRate と同じ列と同じ式(率は apsisRate とビット同一)+ 計画行列の診断
//     (列を単位の長さにした計画行列の片側ヤコビの特異値分解 —— 条件数・実効ランク〔σ > 1e-10 σ_max の数〕・率の形式の標準誤差〔残差の自己相関は考えない〕)。
//   ・差の系列の直接の回帰(diffFit): Δe(t) = e_q11(t) − e_q10(t)(同じ時刻の標本)を、q10 の窓の平均の離心ベクトルの向き ê₀ に平行の成分 Δe∥ と
//     垂直の成分 Δϖ⊥ = (Δe·ê₀⊥)/|e₀| に分け、Δϖ⊥(t) = c₀ + c₁τ + 調和(q10 の位置の角の 1〜3 倍)の c₁。
//     「回帰の差」との一次の関係: ϖ̇₁₁ − ϖ̇₁₀ ≈ c₁ − ϖ̇₁₀·(Δe∥/e) − (ė₁₀/e)·Δϖ⊥(同じ計画行列のとき —— 残りは二次)。基準の向きを q10 の回帰の永年の
//     離心ベクトル ê₁₀(t) に回した c₁rot は一次で ϖ̇₁₁ − ϖ̇₁₀ と同じ量(固定の ê₀ は q10 の歳差 ϖ̇₁₀ × 平行の一定のずれ Δe∥/e を拾う)。線形の恒等式(同じ計画行列・
//     ê₀ を q10 の回帰の (A, C) にとった c₁ = (A ΔD − C ΔB)/e²)は丸めの内で成り立つ(門 diffIdentity)。
//   ・会合周期(synodicOf): 衛星の太陽に対する会合周期 P_syn = 1/|1/P_seed − s/P_母惑星|(s = 衛星の公転の向きと母惑星の公転の向きの符号 —— 逆行は和)。
//
// ■ 言わないこと: 「フィットした」「収束した」(刻みは感度診断・窓は抽出の感度診断)「完全に一致」「法則を確かめた」。近似要素の種を観測レコードと呼ばない。
//   形式の標準誤差は観測の 3σ ではない。慣性速度と座標速度の差を「現エンジンの誤り」と書かない。
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
export const LIB_VERSION = 'w317a-satmeas-lib-1';
/** 共通の座標時刻の標本の数(公転あたり —— 720 步/公転を割り切る) */
export const GRID_S = 16;
/** 位置の角の調和の数(第315便d・第316便d の L と同じ) */
export const K_HARM = 3;
/** 実効ランクの閾値(σ > RANK_TOL × σ_max) */
export const RANK_TOL = 1e-10;
const CENTURY = 36525 * 86400;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
export const perCentury = (rate, Tsec) => AP.toArcsecPerCentury(rate, Tsec);

/* ───────── 会合周期 ───────── */
/** 母惑星の太陽に対する公転周期(凍結の写しの t = 0 の太陽と「母惑星 + 衛星の重心」の相対の状態 —— 二体の活力の式)と、衛星の会合周期 */
export function synodicOf(sd) {
  const P = L.parentOf(sd.parent), r0 = [P.planet.x - P.sun.x, P.planet.y - P.sun.y, P.planet.z - P.sun.z], v0 = [P.planet.vx - P.sun.vx, P.planet.vy - P.sun.vy, P.planet.vz - P.sun.vz];
  const mu = P.physics.G * (P.sun.m + P.planet.m + sd.m), a = 1 / (2 / nrm(r0) - dot(v0, v0) / mu), Pp = 2 * Math.PI * Math.sqrt(a * a * a / mu);
  const rel = L.satRelState(P, sd), sense = Math.sign(dot(rel.normal, P.orbitPole)) || 1;
  const Psyn = 1 / Math.abs(1 / sd.P - sense / Pp);
  return { Pplanet: Pp, sense, Psyn, ratio: Psyn / sd.P };
}

/* ───────── 共通の座標時刻の標本 ───────── */
/**
 * S.step を包む(第315便d の attachSatSampler の外側に重ねる —— 読むだけ)。o = { ci, oi, mu, every(標本の間の步の数), basis: { P, Q }(t = 0 の軌道面の基底) }。
 * 標本 j(步 k = j·every)ごとに: 時刻 t・相対の位置 r・慣性速度の離心ベクトル E_I・座標速度の離心ベクトル E_C(次の步の位置を読んでから)・位置の角 θ(每步で巻き戻す)。
 */
export function attachGridSampler(S, o) {
  const ci = o.ci, oi = o.oi, mu = o.mu, every = o.every, Pb = o.basis.P, Qb = o.basis.Q;
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], S.z[oi] - S.z[ci]];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], S.vz[oi] - S.vz[ci]];
  const T = [], R = [], TH = [], EIP = [], EIQ = [], ECP = [], ECQ = [];
  const r0 = rel(); let thPrev = Math.atan2(dot(r0, Qb), dot(r0, Pb)), thAcc = thPrev, t = 0, k = 0, pend = null, bad = false;
  const inner = S.step;
  S.step = function (dt) {
    const rB = rel();
    const out = inner.apply(this, arguments);
    t += dt; k++;
    const r = rel(), th = Math.atan2(dot(r, Qb), dot(r, Pb));
    let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; thAcc += d; thPrev = th;
    if (pend) {   // 1 步前の標本の座標速度(中心差分)
      const vc = [(r[0] - pend.rB[0]) / (2 * dt), (r[1] - pend.rB[1]) / (2 * dt), (r[2] - pend.rB[2]) / (2 * dt)], e = AP.eccVector(pend.r, vc, mu);
      ECP.push(dot(e, Pb)); ECQ.push(dot(e, Qb)); pend = null;
    }
    if (k % every === 0) {
      const v = relV(), e = AP.eccVector(r, v, mu);
      if (!(Number.isFinite(e[0]) && nrm(e) < 1)) bad = true;
      T.push(t); R.push(nrm(r)); TH.push(thAcc); EIP.push(dot(e, Pb)); EIQ.push(dot(e, Qb));
      pend = { r, rB };
    }
    return out;
  };
  return { samples: () => { const n = ECP.length; return { t: T.slice(0, n), r: R.slice(0, n), th: TH.slice(0, n), eIP: EIP.slice(0, n), eIQ: EIQ.slice(0, n), eCP: ECP.slice(), eCQ: ECQ.slice() }; },
    pending: () => (pend ? 1 : 0), unbound: () => bad, detach: () => { S.step = inner; } };
}
/** 位置だけの離心ベクトル(公転ごと —— 標本 perOrbit 個ずつ: 1/r = A + B cos θ + C sin θ の最小二乗 → (B/A, C/A)・時刻は公転の標本の時刻の平均) */
export function exPerOrbit(g, perOrbit = GRID_S) {
  const out = { t: [], eP: [], eQ: [], th: [], rmsRel: [] }, nO = Math.floor(g.t.length / perOrbit);
  for (let m = 0; m < nO; m++) {
    const X = [], y = []; let tt = 0;
    for (let j = m * perOrbit; j < (m + 1) * perOrbit; j++) { X.push([1, Math.cos(g.th[j]), Math.sin(g.th[j])]); y.push(1 / g.r[j]); tt += g.t[j]; }
    const R = AP.lsqMulti(X, [y]); if (!R) { out.t.push(tt / perOrbit); out.eP.push(NaN); out.eQ.push(NaN); out.th.push(NaN); out.rmsRel.push(NaN); continue; }
    const [A, B, C] = R[0].c;
    out.t.push(tt / perOrbit); out.eP.push(B / A); out.eQ.push(C / A); out.th.push(0); out.rmsRel.push(R[0].rms / A);
  }
  return out;
}

/* ───────── 回帰と計画行列の診断 ───────── */
/** 片側ヤコビの特異値分解(列の配列 —— 列を単位の長さにしてから)。戻り値 { sigma(降順でない —— 列の順), V(p×p), norms } */
export function svdCols(cols0) {
  const p = cols0.length, n = cols0[0].length, norms = cols0.map((c) => { let s = 0; for (let i = 0; i < n; i++) s += c[i] * c[i]; return Math.sqrt(s); });
  const U = cols0.map((c, j) => { const u = new Float64Array(n), f = norms[j] > 0 ? 1 / norms[j] : 0; for (let i = 0; i < n; i++) u[i] = c[i] * f; return u; });
  const V = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (__, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 80; sweep++) {
    let off = 0;
    for (let a = 0; a < p; a++) for (let b = a + 1; b < p; b++) {
      const ua = U[a], ub = U[b]; let al = 0, be = 0, ga = 0;
      for (let i = 0; i < n; i++) { al += ua[i] * ua[i]; be += ub[i] * ub[i]; ga += ua[i] * ub[i]; }
      if (al === 0 || be === 0) continue;
      const c0 = Math.abs(ga) / Math.sqrt(al * be); if (c0 > off) off = c0;
      if (c0 < 1e-15) continue;
      const ze = (be - al) / (2 * ga), tt = Math.sign(ze || 1) / (Math.abs(ze) + Math.sqrt(1 + ze * ze)), c = 1 / Math.sqrt(1 + tt * tt), s = c * tt;
      for (let i = 0; i < n; i++) { const x = ua[i], y = ub[i]; ua[i] = c * x - s * y; ub[i] = s * x + c * y; }
      for (let i = 0; i < p; i++) { const x = V[i][a], y = V[i][b]; V[i][a] = c * x - s * y; V[i][b] = s * x + c * y; }
    }
    if (off < 1e-15) break;
  }
  const sigma = U.map((u) => { let s = 0; for (let i = 0; i < n; i++) s += u[i] * u[i]; return Math.sqrt(s); });
  return { sigma, V, norms };
}
/** 計画行列の診断(rows —— 行の配列)。cond = σ_max/σ_min(列を単位の長さにした)・rank・invTT = (XᵀX)⁻¹ の τ(列 1)の対角 */
export function designDiag(rows) {
  const p = rows[0].length, n = rows.length, cols = Array.from({ length: p }, (_, j) => { const c = new Float64Array(n); for (let i = 0; i < n; i++) c[i] = rows[i][j]; return c; });
  const { sigma, V, norms } = svdCols(cols), smax = Math.max(...sigma), smin = Math.min(...sigma);
  let inv = 0; for (let k = 0; k < p; k++) if (sigma[k] > 0) inv += V[1][k] * V[1][k] / (sigma[k] * sigma[k]);
  return { cond: smin > 0 ? smax / smin : null, rank: sigma.filter((s) => s > RANK_TOL * smax).length, cols: p, invTT: norms[1] > 0 ? inv / (norms[1] * norms[1]) : null, sigmaMin: smin / smax };
}
const rowL = (dt, th, K) => { const row = [1, dt]; for (let k = 1; k <= K; k++) row.push(Math.cos(k * th), Math.sin(k * th)); return row; };
/** 窓の標本の番号(t0 < t ≤ t1) */
export const idxOf = (t, t0, t1) => { const idx = []; for (let i = 0; i < t.length; i++) if (t[i] > t0 && t[i] <= t1) idx.push(i); return idx; };
/**
 * 離心ベクトルの成分の回帰(apsisRate と同じ列・同じ式 —— 率はビット同一)。s = { t, eP, eQ, th }・o = { t0, t1, K, th(位置の角の列の差し替え —— 差の回帰の同じ計画行列用), diag }。
 * 戻り値 { rate, e, varpi, A, B, C, D, n, cols, tm, rms, cond, rank, se(率の形式の標準誤差) }
 */
export function fitL(s, o) {
  const K = o.K === undefined ? K_HARM : o.K, th = o.th || s.th, idx = idxOf(s.t, o.t0, o.t1), cols = 2 + 2 * K;
  if (idx.length < cols + 4) return null;
  const tm = (s.t[idx[0]] + s.t[idx[idx.length - 1]]) / 2, X = idx.map((i) => rowL(s.t[i] - tm, th[i], K));
  const R = AP.lsqMulti(X, [idx.map((i) => s.eP[i]), idx.map((i) => s.eQ[i])]);
  if (!R) return null;
  const [A, B] = R[0].c, [C, D] = R[1].c, e2 = A * A + C * C, out = { rate: (A * D - C * B) / e2, e: Math.sqrt(e2), varpi: Math.atan2(C, A), A, B, C, D, n: idx.length, cols, tm, rms: [R[0].rms, R[1].rms] };
  if (o.diag) {
    const dg = designDiag(X), dof = Math.max(1, idx.length - cols), sP2 = R[0].rms * R[0].rms * idx.length / dof, sQ2 = R[1].rms * R[1].rms * idx.length / dof;
    Object.assign(out, { cond: dg.cond, rank: dg.rank, se: dg.invTT !== null ? Math.sqrt((C * C * sP2 + A * A * sQ2) * dg.invTT) / e2 : null });
  }
  return out;
}
/** 窓の要約(″/世紀へ) */
export const fitSum = (f, Tsec) => (f ? { aps: perCentury(f.rate, Tsec), e: f.e, n: f.n, cond: f.cond === undefined ? null : f.cond, rank: f.rank === undefined ? null : f.rank, se: Number.isFinite(f.se) ? perCentury(f.se, Tsec) : null } : null);

/**
 * 差の系列の直接の回帰(s10・s11 は同じ時刻の標本 —— 每 h)。窓 t0 < t ≤ t1。ê₀ = q10 の窓の平均の離心ベクトルの向き・|e₀| = その大きさ。
 * 戻り値(率は本の時間あたり rad): c1(Δϖ⊥ の傾き)・se1・perp0/par0(窓の中央の Δϖ⊥・Δe∥/e)・parSlope・cond/rank(計画行列 —— q10 の θ)・
 * sameX(同じ計画行列の回帰の差 ϖ̇₁₁ − ϖ̇₁₀)・c1reg(ê₀ を q10 の回帰の (A, C) にとった傾き)・lin(線形の恒等式の相対の差)・
 * corr1 = −ϖ̇₁₀·(Δe∥/e)・corr2 = −(ė₁₀/e)·Δϖ⊥(一次の補正 —— 同じ計画行列の (A, C) で)・resid2 = sameX − (c1reg + corr1 + corr2)(二次の残り)
 */
export function diffFit(s10, s11, o) {
  const K = o.K === undefined ? K_HARM : o.K, idx = idxOf(s10.t, o.t0, o.t1), cols = 2 + 2 * K;
  if (idx.length < cols + 4) return null;
  for (const i of idx) if (!Object.is(s10.t[i], s11.t[i])) return { sameTimes: false };
  let mP = 0, mQ = 0; for (const i of idx) { mP += s10.eP[i]; mQ += s10.eQ[i]; } mP /= idx.length; mQ /= idx.length;
  const e0 = Math.hypot(mP, mQ), u = [mP / e0, mQ / e0];
  const tm = (s10.t[idx[0]] + s10.t[idx[idx.length - 1]]) / 2, X = idx.map((i) => rowL(s10.t[i] - tm, s10.th[i], K));
  const dP = idx.map((i) => s11.eP[i] - s10.eP[i]), dQ = idx.map((i) => s11.eQ[i] - s10.eQ[i]);
  const yPerp = dP.map((x, j) => (-u[1] * x + u[0] * dQ[j]) / e0), yPar = dP.map((x, j) => (u[0] * x + u[1] * dQ[j]) / e0);
  const R = AP.lsqMulti(X, [yPerp, yPar]); if (!R) return null;
  const dg = designDiag(X), dof = Math.max(1, idx.length - cols), s2 = R[0].rms * R[0].rms * idx.length / dof;
  // 同じ計画行列(q10 の θ)の回帰の差と、線形の恒等式・一次の関係
  const f10 = fitL(s10, { t0: o.t0, t1: o.t1, K }), f11x = fitL(s11, { t0: o.t0, t1: o.t1, K, th: s10.th });
  const e2 = f10.A * f10.A + f10.C * f10.C, yReg = dP.map((x, j) => (-f10.C * x + f10.A * dQ[j]) / e2), Rr = AP.lsqMulti(X, [yReg]);
  const dA = f11x.A - f10.A, dB = f11x.B - f10.B, dC = f11x.C - f10.C, dD = f11x.D - f10.D, linComb = (f10.A * dD - f10.C * dB) / e2, c1reg = Rr[0].c[1];
  const parE = (f10.A * dA + f10.C * dC) / e2, perpE = (f10.A * dC - f10.C * dA) / e2, edot = (f10.A * f10.B + f10.C * f10.D) / e2;
  const sameX = f11x.rate - f10.rate, corr1 = -f10.rate * parE, corr2 = -edot * perpE;
  // 回る基準(directRot): ê₀(t) = q10 の回帰の永年の離心ベクトル (A + Bτ, C + Dτ) の向き —— 一次で ϖ̇₁₁ − ϖ̇₁₀ と同じ量(ϖ̇₁₀·Δe∥/e の項が出ない)
  const yRot = idx.map((i, j) => { const tau = s10.t[i] - f10.tm, a = f10.A + f10.B * tau, c = f10.C + f10.D * tau, ee = Math.hypot(a, c); return (-c * dP[j] + a * dQ[j]) / (ee * ee); });
  const Rq = AP.lsqMulti(X, [yRot]), sR2 = Rq[0].rms * Rq[0].rms * idx.length / dof;
  return { sameTimes: true, n: idx.length, e0, c1: R[0].c[1], c0: R[0].c[0], se1: Number.isFinite(dg.invTT) ? Math.sqrt(s2 * dg.invTT) : null, perp0: R[0].c[0], par0: R[1].c[0], parSlope: R[1].c[1],
    c1rot: Rq[0].c[1], seRot: Number.isFinite(dg.invTT) ? Math.sqrt(sR2 * dg.invTT) : null,
    cond: dg.cond, rank: dg.rank, sameX, c1reg, linComb, lin: Math.abs(c1reg - linComb) / Math.max(Math.abs(c1reg), Math.abs(linComb), 1e-300), corr1, corr2, resid2: sameX - (c1reg + corr1 + corr2),
    parE, perpE, edotOverE: edot };
}
/** 公転 m の平均の離心ベクトル(共通の時刻の標本 —— GRID_S 個ずつ) */
export function orbitMean(eP, eQ, m, perOrbit = GRID_S) {
  let p = 0, q = 0; for (let j = m * perOrbit; j < (m + 1) * perOrbit; j++) { p += eP[j]; q += eQ[j]; }
  return [p / perOrbit, q / perOrbit];
}
/** 2 つの離心ベクトル(参照 ref と比べる d —— 差のベクトル)の大きさ・平行・垂直(ref の大きさで割る) */
export function splitVec(ref, dv) {
  const e = Math.hypot(ref[0], ref[1]), u = [ref[0] / e, ref[1] / e];
  return { mag: Math.hypot(dv[0], dv[1]), parOverE: (u[0] * dv[0] + u[1] * dv[1]) / e, perpOverE: (u[0] * dv[1] - u[1] * dv[0]) / e, e };
}

/* ───────── 判定(HARM_RULE の R1・R2 を測る量の格子に当てる —— 純関数)───────── */
/**
 * vals[N][div] = 差(″/世紀)。grid = { divs(粗 → 細の 3 つ), windows(昇順)}。rel = 1e-2(HARM_RULE.rel)。
 * R1: 最長の窓とその前の窓の差 ≤ 両窓の最も細かい 2 刻みの帯の大きい方。R2: 最長の窓の 2 本の帯(粗–中・中–細)≤ rel × abs(最も細かい刻みの差)。
 */
export function ruleOf(vals, grid, rel) {
  const ds = grid.divs, ws = grid.windows, fine = ds[ds.length - 1], fine2 = ds[ds.length - 2], fin = (x) => Number.isFinite(x);
  const v = (N, d) => (vals[N] && fin(vals[N][d]) ? vals[N][d] : null);
  const bandF = (N) => (v(N, fine) !== null && v(N, fine2) !== null ? Math.abs(v(N, fine) - v(N, fine2)) : null);
  const Nl = ws[ws.length - 1], Np = ws[ws.length - 2], vl = v(Nl, fine), vp = v(Np, fine);
  const bands = []; for (let i = 1; i < ds.length; i++) bands.push(v(Nl, ds[i]) !== null && v(Nl, ds[i - 1]) !== null ? Math.abs(v(Nl, ds[i]) - v(Nl, ds[i - 1])) : null);
  const tol = vl !== null && vl !== 0 ? rel * Math.abs(vl) : null, dW = vl !== null && vp !== null ? Math.abs(vl - vp) : null;
  const bW = bandF(Nl) !== null && bandF(Np) !== null ? Math.max(bandF(Nl), bandF(Np)) : null;
  const R1 = dW !== null && bW !== null ? dW <= bW : false, R2 = tol !== null && bands.length >= 2 && bands.every((b) => b !== null) ? bands.every((b) => b <= tol) : false;
  return { v: vl, vPrev: vp, byWin: Object.fromEntries(ws.map((N) => [N, v(N, fine)])), bandFine: Object.fromEntries(ws.map((N) => [N, bandF(N)])), bands, tol, dW, bW,
    r1Ratio: dW !== null && bW > 0 ? dW / bW : null, r2Ratio: tol !== null && bands.every((b) => b !== null) ? Math.max(...bands) / tol : null, R1, R2, determined: R1 && R2 };
}
/**
 * 刻みの見積り(外挿 —— 決まったことにしない): 最長の窓の 2 本の帯 b₁(粗–中)・b₂(中–細)から次数 p = log₂(b₁/b₂) を読み、帯が 2^−p で縮むとして、
 * 2 本の帯がどちらも tol 以下になる最も粗い刻み h/2^k(格子の細い側の 2 本の帯 —— HARM_RULE の R2 の形)。b₂ ≥ b₁ なら縮まない(null)。
 */
export function stepNeed(r, finestDiv) {
  const [b1, b2] = r.bands; if (!(Number.isFinite(b1) && Number.isFinite(b2) && b1 > 0 && b2 > 0 && Number.isFinite(r.tol))) return { p: null, div: null };
  const p = Math.log2(b1 / b2); if (!(p > 0)) return { p, div: null };
  let bPrev = b1, bLast = b2, d = finestDiv;
  for (let k = 0; k < 12; k++) { if (bPrev <= r.tol && bLast <= r.tol) return { p, div: d }; bPrev = bLast; bLast = bLast / Math.pow(2, p); d *= 2; }
  return { p, div: null };
}

// 第319便b(原仮定者の指示(第121報)「引きずり半径について」・決断事項 AN445・AN446・AN449・統括の検証項目 R259):
// **引きずる側の半径 R_src の 3 案・分布した銀河の太陽系近傍・天体別の役割の表の純関数**(html を読まない —— エンジンの値は器 tests/exp-w319b-srcradius.mjs が
// 読み口で取って引数で渡す。器と QA が使う)。
//
// ■ 何をするか(受け手の R_d = Y_k m・規則・在位の本・エンジンの式は変えない —— 引きずる側の半径 R_src は**源の回転と軸のモーメントだけ**に入れる写しの外の式)
//   K1 の受け手の節点の和(第318便d の k1Recv と同じ式・同じ演算の順)の源 j のモーメント M1 = R_d,j²/(5r²) を、源ごとの R_src,j に替える k1RecvSrc。
//   W(分母)・β(並進)・∇W は R_d = Y_k m のまま(受け手の外の源の場 K1(r; R_d) は源の外で 1/r —— R_src の大きさに依らない)。
//   案1 R_src = min(R_obs, 6.5×10⁶ m)(源の側だけの上限 —— 受け手の R_d に上限を戻さない・galaxyAxial の参照半径とは別の量)・
//   案2 R_src = R_obs(K2 の規則の上限なし —— 2a: 源のモーメントだけを K1 の形で R_obs に・2b: 源 K2 + 受け手 K1 の混成 —— 下の mixMoment)・
//   案3 R_src = R_obs √(5f/2)(慣性モーメントの半径 —— 一様な球の J_d = (2/5) m R_src² Ω を源の物理の角運動量 J = f m R_obs² Ω に置く。f は宣言の入力)。
//   加法性(同じ質量を N に分けたときの源のモーメントの和)・120° の合成の一般形(|Ω + ω| < |Ω| ⇔ cos θ < −|ω|/(2|Ω|))・
//   分布した銀河(宣言の密度の模型と宣言の平均の流れ)の太陽の位置の Σβ・共動系の u・勾配(解析の微分)・半渦度(移送場の診断量)。
//
// ■ 言わないこと: 案のどれかを採った規則と書かない(候補の式の比較)。半渦度を軸引きずり ω_G と同じと書かない。中心 1 体の値を「銀河の引きずり」と呼ばない。
//   金星の自転・木星の熱・公転面を引きずりで説明したと書かない(要る大きさとの比を並べるだけ)。τ_hold を合わせた値と書かない(h₀ の規約)。数の桁が近いことを証拠と呼ばない。
//   文献の値は「文献の値(本便は一次資料に当たっていない)」と書き、正本の inputs に出典の名を残す。
import { G0, C0, C1, YK, AU, KPC, PC, MSUN, YEAR, GYR, LU, TU, MU, VU, gRule, radialOf, maintCell, splitOmega, powerOf, BODY16, SAT_PARENT, LIT, DECL as DECL318 } from './lib-w318d-dragest.mjs';
import { galaxyAxis, eclipticOf, GAL } from './lib-w317c-satcut.mjs';
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export { G0, C0, C1, YK, AU, KPC, PC, MSUN, YEAR, GYR, LU, TU, MU, VU, gRule, radialOf, maintCell, splitOmega, powerOf, BODY16, SAT_PARENT };
export const LIB_VERSION = 'w319b-srcradius-lib-1';

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
/** 案1 の源の側の上限 [m](K2 の未宣言の既定 cap6500km と同じ大きさ —— 受け手の R_d には使わない) */
export const CAP_SRC_M = 6.5e6;
/**
 * 案3 の慣性モーメントの係数 f = I/(m R_obs²)(文献の値 —— 本便は一次資料に当たっていない)。名の無い天体は一様な球の 0.4(宣言 —— 文献の値ではない)。
 * 太陽の値は第318便d の LIT.sunMoI と同じ 0.07。
 */
export const MOI = Object.freeze({ 0: 0.07, 1: 0.346, 2: 0.33, 3: 0.3307, 4: 0.3929, 5: 0.3644, 6: 0.254, 11: 0.21 });
export const MOI_UNIFORM = 0.4;
export const LIT319 = Object.freeze({
  moi: Object.freeze({ value: 'Sun 0.07・Mercury 0.346・Venus 0.33・Earth 0.3307・Moon 0.3929・Mars 0.3644・Jupiter 0.254・Saturn 0.21', unit: '-', name: '慣性モーメントの係数 I/(MR²)(太陽は標準の太陽模型の型・惑星と月は重力場と歳差の解析の型 —— 文献の値・他の天体は一様な球の 0.4 の宣言)' }),
  mw: Object.freeze({ value: 'McMillan 2017', unit: '-', name: '天の川銀河の質量の模型の入力(円盤 4 成分〔薄い・厚い円盤の星・HI・H2 のガス〕の中心の面密度・尺度長・尺度高・中心の穴と、バルジの軸対称の打ち切りの冪の密度 —— 文献の値)' }),
  saturnRings: Object.freeze({ value: '7.4658e7・9.2e7・1.36775e8', unit: 'm', name: '土星の環の半径(C 環の内縁・B 環の内縁・A 環の外縁 —— 文献の値)' }) });
/** 天の川銀河の宣言の模型(面密度 [M☉/kpc²]・長さ [kpc]・バルジの密度 [M☉/kpc³] —— 文献の模型の入力の転記) */
export const MW = Object.freeze({
  disks: Object.freeze([
    Object.freeze({ key: 'thin', ja: '薄い円盤(星)', S0: 8.95679e8, Rd: 2.49955, zd: 0.3, Rm: 0, vert: 'exp' }),
    Object.freeze({ key: 'thick', ja: '厚い円盤(星)', S0: 1.83444e8, Rd: 3.02134, zd: 0.9, Rm: 0, vert: 'exp' }),
    Object.freeze({ key: 'HI', ja: 'HI のガス円盤', S0: 5.31319e7, Rd: 7, zd: 0.085, Rm: 4, vert: 'sech2' }),
    Object.freeze({ key: 'H2', ja: 'H2 のガス円盤', S0: 2.17995e9, Rd: 1.5, zd: 0.045, Rm: 12, vert: 'sech2' })]),
  bulge: Object.freeze({ key: 'bulge', ja: 'バルジ(軸対称)', rho0: 9.84e10, r0: 0.075, alpha: 1.8, rcut: 2.1, q: 0.5 }),
  RmaxKpc: 40, bulgeRmaxKpc: 10.5 });
/** 宣言の平均の流れ(円盤の全成分 —— V(R) = V0 tanh(R/R_t)・反時計回り〔+z = ĝ〕)とバルジの平均の流れ 0・太陽の位置と速さ(〔第311便b〕⑥ の V0・R0) */
export const FLOW = Object.freeze({ V0: GAL.V0kms * 1e3, R0kpc: GAL.R0kpc, RtKpc: 1, bulge: 'static' });
/** 格子 3 段(円盤: 動径 Gauss–Legendre × 方位 × 鉛直の分位点・バルジ: r′ = r_max s² の Gauss–Legendre × μ の Gauss–Legendre × 方位) */
export const GRIDS = Object.freeze([
  Object.freeze({ nr: 48, np: 96, nz: 16, br: 24, bm: 12, bp: 24 }),
  Object.freeze({ nr: 96, np: 192, nz: 24, br: 48, bm: 24, bp: 48 }),
  Object.freeze({ nr: 192, np: 384, nz: 32, br: 96, bm: 48, bp: 96 })]);
/** 天体別の役割(第121報 —— 検証の参考の役割の文)と要る大きさの型(第318便d の宣言 —— 公転面 3°/太陽系の年齢・金星の軸を π / 1 Gyr・木星の内部熱の主列) */
export const ROLES = Object.freeze([
  Object.freeze({ i: 1, role: '恒星近傍の特殊軌道', req: 'plane', note: '受け手の並進が変わらないことの確かめ(β と W は R_src に依らない)' }),
  Object.freeze({ i: 2, role: '自転の逆回転、内部熱', req: 'venus', note: '逆回転の符号つきの自転のベクトルで角を取る' }),
  Object.freeze({ i: 3, role: '三体、衛星の潮汐ロック', req: 'plane', note: '月(潮汐ロック)の行と、月 → 地球・地球 → 月の源の行を別に' }),
  Object.freeze({ i: 5, role: '標準固体惑星', req: 'plane', note: '対照' }),
  Object.freeze({ i: 6, role: '気体惑星、内部熱', req: 'jupiter', note: '内部熱の主列 5.444 W/m²(代替の列 7.485 W/m² は別の欄 —— 混ぜない)' }),
  Object.freeze({ i: 11, role: '気体惑星、環', req: 'none', note: '環を別の受け皿(環の半径の回転の移送)' })]);
export const DECL = Object.freeze({ ringRadiiM: Object.freeze([7.4658e7, 9.2e7, 1.36775e8]), additivityN: Object.freeze([4, 8, 16, 32]), additivityROverA: 100, engineRingN: 4,
  planeTiltDeg: DECL318.planeTiltDeg, venusPeriodGyr: DECL318.venusPeriodGyr, inertiaF: 0.5 });

/* ───────── 案(源の側の半径)───────── */
export const PLANS = Object.freeze([
  Object.freeze({ key: 'now', ja: '今(R_src = R_d = Y_k m)' }),
  Object.freeze({ key: 'p1', ja: '案1 R_src = min(R_obs, 6.5×10⁶ m)' }),
  Object.freeze({ key: 'p2a', ja: '案2a R_src = R_obs(源のモーメントだけ —— K1 の形)' }),
  Object.freeze({ key: 'p2b', ja: '案2b 源 K2 + 受け手 K1 の混成(R_src = R_obs —— M2/K2 の比を K1 の β に)' }),
  Object.freeze({ key: 'p3', ja: '案3 R_src = R_obs √(5f/2)(慣性モーメントの半径 —— J_d = J)' })]);
export const PLAN_KEYS = PLANS.map((p) => p.key);
export const moiOf = (i) => (MOI[i] !== undefined ? MOI[i] : MOI_UNIFORM);
/** 源の R_src(SI か本の単位 —— m・R・Rd は同じ単位)。plan: 'now'|'p1'|'p2a'|'p2b'|'p3'。capL は 6.5×10⁶ m をその単位で */
export function rSrcOf(plan, Rd, R, f, capL) {
  if (plan === 'now') return Rd;
  if (!(R > 0)) return Rd;
  if (plan === 'p1') return Math.min(R, capL);
  if (plan === 'p2a' || plan === 'p2b') return R;
  if (plan === 'p3') return R * Math.sqrt(2.5 * f);
  throw new Error('未知の案: ' + plan);
}
/** 遠方(r ≫ R_src)のモーメントの倍率(今の Y_k m に対して)—— 案2b の混成は M2/K2 → (2/5)R²/r の分で 2 倍 */
export const farFactor = (plan, Rd, Rs) => (plan === 'p2b' ? 2 : 1) * (Rs / Rd) * (Rs / Rd);

/* ───────── K2 の核と M2(エンジンの inertialDragIsqK2・inertialDragIsqM2 と同じ式・同じ演算の順 —— 器がビット同一を照合する)───────── */
const NEAR = 0.3, FAR = 3;
/** [K2, dK2/dr](r ≠ R) */
export function k2Of(r, R) {
  const x = r / R, R2 = R * R;
  if (x < NEAR) {
    let s = 0, d = 0, p = x * x, q = x;
    for (let k = 1; k < 64; k++) { const den = (2 * k - 1) * (2 * k + 1), a = p / den, b = 2 * k * q / den; s += a; d += b; if (a <= 1e-18 * s && b <= 1e-18 * d) break; p *= x * x; q *= x * x; }
    return [3 * (1 - s) / R2, -3 * d / (R2 * R)];
  }
  if (x >= FAR) {
    const z = 1 / (x * x);
    let s = 0, d = 0, p = 1;
    for (let k = 0; k < 80; k++) { const den = (2 * k + 1) * (2 * k + 3), a = 3 * p / den; s += a; d += (2 + 2 * k) * a; if (a <= 1e-18 * s) break; p *= z; }
    return [s / (r * r), -d / (r * r * r)];
  }
  const L = Math.log1p(x) - Math.log(Math.abs(1 - x));
  return [1.5 * (1 + (1 - x * x) * L / (2 * x)) / R2, (1.5 / x - 0.75 * (1 + x * x) * L / (x * x)) / (R2 * R)];
}
/** [M2, dM2/dr](外部 r > R だけ) */
export function m2Of(r, R) {
  const x = r / R;
  if (x >= FAR) {
    const z = 1 / (x * x);
    let s = 0, d = 0, p = z;
    for (let k = 1; k < 80; k++) { const a = 6 * k * p / ((2 * k - 1) * (2 * k + 1) * (2 * k + 3)); s += a; d += (2 * k + 1) * a; if (a <= 1e-18 * s) break; p *= z; }
    return [s / r, -d / (r * r)];
  }
  const L = Math.log1p(x) - Math.log(x - 1);
  return [(-3 / (8 * x) + 9 * x / 8 + 3 * L * (1 + 3 * x * x) * (1 - x * x) / (16 * x * x)) / R, (3 / (4 * x * x) + 2.25 - 0.375 * L * (1 + 3 * x * x * x * x) / (x * x * x)) / (R * R)];
}
/**
 * 案2b の混成(源 K2 + 受け手 K1)の回転のモーメント [M, dM/dr]: 受け手の W は K1(次元 質量/長さ)なので、K2 の源の場 m K2(次元 質量/長さ²)を W に足すと比が無次元に
 * ならない(長さの換算 λ が要る —— 遠方で λ K2 → 1/r にするなら λ = r で核にならない)。並進の β と W は K1(R_d)のまま、純粋な K2 の本の「回転の係数と β の比」
 * M2/K2(r; R_src)を K1 の β へ移す: M_mix = K1(r; R_d) · M2(r; R_src)/K2(r; R_src)。遠方 M2/K2 → (2/5)R_src²/r(K1 の M1/K1 = R²/(5r) の 2 倍)。
 * 軸の項は M_mix の微分(積の微分)と ∇W(K1 のまま)。受け手を K2 にする型(受け手の W も K2)は受け手の並進の β を動かすので採らない(器の表に数)。
 */
export function mixMoment(r, Rd, Rs) {
  const k1 = (r >= Rd) ? 1 / r : (3 * Rd * Rd - r * r) / (2 * Rd * Rd * Rd), dk1 = (r >= Rd) ? -1 / (r * r) : -r / (Rd * Rd * Rd);
  const K = k2Of(r, Rs), M = m2Of(r, Rs), ratio = M[0] / K[0], dratio = (M[1] * K[0] - M[0] * K[1]) / (K[0] * K[0]);
  return [k1 * ratio, dk1 * ratio + k1 * dratio];
}

/* ───────── K1 の受け手の節点の和(第318便d の k1Recv と同じ式・同じ演算の順)に源ごとのモーメントの半径 ───────── */
/**
 * P = {n, x, y, z, md, Rd, spin, ax, ay, az}(同じ単位系)。o.Rsrc: 源ごとのモーメントの半径(省略 = P.Rd —— 第318便d の k1Recv・エンジンとビット同一)・
 * o.mix: 源ごとに案2b の混成のモーメント(省略 = なし)。W・β・∇W は P.Rd のまま。戻り値は源ごとの β・回転の係数・軸の ω と、受け手が源の R_src の内に入った源の印。
 */
export function k1RecvSrc(rule, P, i, o = {}) {
  const n = P.n, gain = o.gain === undefined ? 1 : o.gain, NA = rule.NA, RS = o.Rsrc || null, MX = o.mix || null;
  const Ri = P.Rd[i], R2 = Ri * Ri, mdi = P.md[i], xi = P.x[i], yi = P.y[i], zi = P.z[i];
  const BE = new Float64Array(n), RV = new Float64Array(n * 3), OP = new Float64Array(n * 3), IN = new Uint8Array(n);
  const K = new Float64Array(n), rr = new Float64Array(n), nx = new Float64Array(n), ny = new Float64Array(n), nz = new Float64Array(n), ok = new Uint8Array(n);
  let wMin = Infinity, wMax = 0;
  for (let a = 0; a < rule.n; a++) {
    const w1 = mdi * (rule.SK1[a] / Ri), g1 = mdi * (rule.SD1[a] / R2);
    for (let qa = 0; qa < NA; qa++) {
      const q = a * NA + qa, tR = Ri * rule.T[q], ux = rule.SX[q], uy = rule.SY[q], uz = rule.SZ[q], px = xi + tR * ux, py = yi + tR * uy, pz = zi + tR * uz, wq = rule.W[q];
      let W = 0, gx = 0, gy = 0, gz = 0;
      for (let k = 0; k < n; k++) {
        if (k === i) { ok[k] = 0; W += w1; gx += g1 * ux; gy += g1 * uy; gz += g1 * uz; continue; }
        const Rk = P.Rd[k];
        if (!(Rk > 0)) { ok[k] = 0; continue; }
        const dx = px - P.x[k], dy = py - P.y[k], dz = pz - P.z[k], r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        ok[k] = 1; rr[k] = r; nx[k] = (r > 0) ? dx / r : 0; ny[k] = (r > 0) ? dy / r : 0; nz[k] = (r > 0) ? dz / r : 0;
        let b0, b1;
        if (r >= Rk) { b0 = 1 / r; b1 = -1 / (r * r); } else { const R3 = Rk * Rk * Rk; b0 = (3 * Rk * Rk - r * r) / (2 * R3); b1 = -r / R3; }
        const w = P.md[k] * b0, gr = P.md[k] * b1;
        K[k] = b0; W += w; gx += gr * nx[k]; gy += gr * ny[k]; gz += gr * nz[k];
      }
      if (W < wMin) wMin = W; if (W > wMax) wMax = W;
      const iW = 1 / W;
      for (let j = 0; j < n; j++) {
        if (j === i || !ok[j]) continue;
        const md = P.md[j];
        BE[j] += wq * md * K[j] * iW;
        let b2, b3;
        if (MX && MX[j]) { const Rs = RS ? RS[j] : P.Rd[j]; if (!(rr[j] > Rs)) IN[j] = 1; const z = mixMoment(rr[j], P.Rd[j], Rs); b2 = z[0]; b3 = z[1]; }
        else if (RS) { const Rs = RS[j]; if (!(rr[j] > Rs)) IN[j] = 1; const q2 = Rs * Rs / (5 * rr[j] * rr[j]); b2 = q2; b3 = -2 * q2 / rr[j]; }
        else { const q2 = P.Rd[j] * P.Rd[j] / (5 * rr[j] * rr[j]); b2 = q2; b3 = -2 * q2 / rr[j]; }
        const ex0 = nx[j], ey0 = ny[j], ez0 = nz[j], g = md * b2 * iW;
        RV[j * 3] += wq * g * ex0; RV[j * 3 + 1] += wq * g * ey0; RV[j * 3 + 2] += wq * g * ez0;
        const Om = P.spin[j];
        if (Om !== 0 && Number.isFinite(Om)) {
          const amp = -(md * b3 * iW - g * (gx * ex0 + gy * ey0 + gz * ez0) * iW);
          const a0 = P.ax[j], a1 = P.ay[j], a2 = P.az[j], cx = a1 * ez0 - a2 * ey0, cy = a2 * ex0 - a0 * ez0, cz = a0 * ey0 - a1 * ex0, sn = Math.sqrt(cx * cx + cy * cy + cz * cz), mu = ex0 * a0 + ey0 * a1 + ez0 * a2;
          const f = wq * gain * amp * sn * Om;
          OP[j * 3] += f * (2 * mu * ex0 - a0); OP[j * 3 + 1] += f * (2 * mu * ey0 - a1); OP[j * 3 + 2] += f * (2 * mu * ez0 - a2);
        }
      }
    }
  }
  const src = [];
  for (let j = 0; j < n; j++) if (j !== i) src.push({ j, beta: BE[j], rot: [RV[j * 3], RV[j * 3 + 1], RV[j * 3 + 2]], omega: [OP[j * 3], OP[j * 3 + 1], OP[j * 3 + 2]], inside: IN[j] === 1 });
  const om = [0, 0, 0]; for (let j = 0; j < n; j++) { om[0] += OP[j * 3]; om[1] += OP[j * 3 + 1]; om[2] += OP[j * 3 + 2]; }
  return { i, src, beta: Array.from(BE), omega: om, wMin, wMax };
}
/** 案ごとの源のモーメントの半径の並び(P.Rd・観測半径 R・f の並び —— 同じ単位)と混成の印 */
export function planArrays(plan, P, R, capL) {
  const Rsrc = new Float64Array(P.n), mix = new Uint8Array(P.n);
  for (let j = 0; j < P.n; j++) { Rsrc[j] = rSrcOf(plan, P.Rd[j], R[j], moiOf(j), capL); mix[j] = plan === 'p2b' ? 1 : 0; }
  return { Rsrc, mix };
}

/* ───────── ベクトル ───────── */
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scl3 = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const angDeg = (a, b) => Math.atan2(nrm(cross(a, b)), dot(a, b)) * 180 / Math.PI;
export const relDiff = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
export const vecRel = (a, b) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), s = Math.max(nrm(a), nrm(b)); return s > 0 ? d / s : 0; };

/* ───────── 120° の合成(第121報)の一般形 ───────── */
/**
 * 自転のベクトル Ω(符号つき —— spin × â)と軸の ω の合成: 減速 ⇔ |Ω + ω| < |Ω| ⇔ 2Ω·ω + |ω|² < 0 ⇔ cos θ < −|ω|/(2|Ω|)(θ = Ω と ω の角)。
 * 等しい大きさ(|ω| = |Ω|)で境界は 120°(第121報の言い方)・|ω| ≪ |Ω| では境界は 90° のすぐ外(θ_c − 90° = asin(|ω|/(2|Ω|)))。
 * 固定の角 120° の判定(θ > 120° を減速とする)と一般形の判定が違う天体を印にする。dMag = |Ω + ω| − |Ω|(打ち消しの少ない形 (2Ω·ω + |ω|²)/(|Ω + ω| + |Ω|))
 */
export function composeOf(Om, om) {
  const W = nrm(Om), w = nrm(om), s = 2 * dot(Om, om) + w * w, sum = add3(Om, om), dMag = s / (nrm(sum) + W), th = angDeg(Om, om);
  const r = w / (2 * W), thc = r <= 1 ? Math.acos(-r) * 180 / Math.PI : null, thcM90 = r <= 1 ? Math.asin(r) * 180 / Math.PI : null;
  const decel = s < 0, fixed120 = th > 120;
  return { W, w, ratio: w / W, thetaDeg: th, thetaCritDeg: thc, thetaCritMinus90: thcM90, dMag, decel, fixed120, disagree: decel !== fixed120 };
}
/** 等しい大きさの 2 本(|ω| = |Ω|)を角 θ で合成した大きさの比 |Ω + ω|/|Ω| = 2 cos(θ/2)(θ = 120° で 1 —— 第121報の言い方の確かめ) */
export const equalMagRatio = (thDeg) => 2 * Math.cos(thDeg * Math.PI / 360);

/* ───────── 加法性(同じ質量を N に分けたときの源のモーメント)───────── */
/**
 * 一様な球(質量 m・半径 a・自転 Ω の z 軸)を一辺 n の立方格子の球の内のセル(N 個・等質量)に分けた写し。
 * 遠方(赤道面の距離 r)の受け手の並進の移送 u = Σ β_k V_k(弱い場 β_k = 10G_0 m_k/(c_0² d_k)・受け手は静止・要素の速さ V_k = Ω × x_k)の双極子 = (5G_0/c_0²) J × n̂/r²
 * —— J = Σ m_k (x_k × V_k)(離散の J)。案ごとの「1 つの源の回転の項」との比と、要素ごとの自転の回転の項の和(今の規則は 1/N²)。
 */
export function ballCells(n, a) {
  const s = 2 * a / n, out = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { const x = -a + (i + 0.5) * s, y = -a + (j + 0.5) * s, z = -a + (k + 0.5) * s; if (x * x + y * y + z * z <= a * a) out.push([x, y, z]); }
  return out;
}
export function additivityRow(n, m, a, Om, rOverA, Rd1) {
  const cells = ballCells(n, a), N = cells.length, mk = m / N, r = rOverA * a, coef = 10 * G0 / (C0 * C0);
  let J = 0, uy = 0, ux = 0, uz = 0;
  for (const c of cells) { const V = [-Om * c[1], Om * c[0], 0], d = Math.hypot(r - c[0], -c[1], -c[2]), b = coef * mk / d; ux += b * V[0]; uy += b * V[1]; uz += b * V[2]; J += mk * Om * (c[0] * c[0] + c[1] * c[1]); }
  const uDip = 5 * G0 / (C0 * C0) * J / (r * r), Jphys = 0.4 * m * a * a * Om;
  // 1 つの源の回転の項(弱い場 g = C_1): u_rot = C_1 Y_k m R_src² Ω/(5r²) = (5G_0/c_0²) J_d/r²(J_d = (2/5) m R_src² Ω)
  const uRot1 = (Rs) => C1 * YK * m * Rs * Rs * Om / (5 * r * r);
  const uNow1 = uRot1(Rd1), uPieces = N * C1 * YK * mk * (YK * mk) * (YK * mk) * Om / (5 * r * r);
  return { n, N, J, Jphys, JOverJphys: J / Jphys, uTrans: uy, uTransX: ux, uTransZ: uz, uDip, transOverDip: uy / uDip, uNow1, uPiecesNow: uPieces, piecesOverOne: uPieces / uNow1, transOverNow1: uy / uNow1,
    rSrcJ: Math.sqrt(2.5 * J / (m * Om)), uRotJ: uRot1(Math.sqrt(2.5 * J / (m * Om))) };
}
/** 候補ごとの N 等分の指数(源のモーメントの和 Σ m_k R_src,k² Ω の N 依存 —— 解析) */
export const ADDITIVITY = Object.freeze([
  Object.freeze({ key: 'now', ja: '今 R_src = Y_k m', expN: -2, note: '要素の自転の和は 1/N²(要素の公転の分は並進の項が運ぶ —— 分けた写しの遠方の双極子は J へ近づく)' }),
  Object.freeze({ key: 'p1', ja: '案1 min(R_obs, 6.5×10⁶ m)', expN: null, note: '要素の R_obs で決まる(上限に掛かる要素は R_src が一定 —— 1/N・掛からない要素は案2 と同じ)' }),
  Object.freeze({ key: 'p2', ja: '案2 R_obs(要素の密度が一定なら R_obs ∝ m^(1/3))', expN: -2 / 3, note: '一定の密度の要素の和は N^(−2/3)・要素が親の R_obs を持つ宣言なら 1(物理の大きさではない)' }),
  Object.freeze({ key: 'p3', ja: '案3 J_d = J(慣性モーメントの半径)', expN: 0, note: '要素の自転の J と要素の公転の J(並進の項)の和が全体の J —— 分けても遠方の双極子が変わらない' })]);

/* ───────── 分布した銀河(太陽の位置 —— K1 の弱い場の一次)───────── */
/** Gauss–Legendre の節点と重み(区間 [0,1]) */
export function gl01(n) {
  const x = new Float64Array(n), w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), pp = 1;
    for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } pp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) <= 1e-16) break; }
    x[i] = 0.5 * (1 - z); w[i] = 1 / ((1 - z * z) * pp * pp);
  }
  return { x, w };
}
/** 鉛直の分位点(exp: ρ ∝ e^(−|z|/z_d)・sech2: ρ ∝ sech²(z/(2z_d))) */
export const zQuant = (u, zd, vert) => (vert === 'exp' ? Math.sign(u - 0.5) * (-zd * Math.log(1 - Math.abs(2 * u - 1))) : 2 * zd * Math.atanh(2 * u - 1));
/** 宣言の平均の流れの速さ [m/s] */
export const vFlow = (Rkpc) => FLOW.V0 * Math.tanh(Rkpc / FLOW.RtKpc);
/**
 * 太陽の位置(銀河の面の x = R0・y = z = 0 —— +z = ĝ・+y = 太陽の位置の流れの向き)の量の積み上げ。受け手の速さは V0 ŷ(共動系)。
 * acc に成分ごとに: 質量・Σβ・u_GC = Σβ_k V_k・u_co = Σβ_k (V_k − V0 ŷ)・勾配 G[a][b] = ∂u_a/∂x_b(解析の微分 ∂β_k/∂x = −β_k d/|d|²)・J_z = Σ m_k (x_k × V_k)_z
 */
function accum() { return { m: 0, beta: 0, uGC: [0, 0, 0], uCo: [0, 0, 0], GGC: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], GCo: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], Jz: 0 }; }
function addCell(A, mKg, x, y, z, vx, vy, vz, R0m, V0) {
  const coef = 10 * G0 / (C0 * C0), dx = R0m - x, dy = -y, dz = -z, d2 = dx * dx + dy * dy + dz * dz, d = Math.sqrt(d2), b = coef * mKg / d, dv = [dx, dy, dz];
  const vr = [vx, vy - V0, vz], vg = [vx, vy, vz];
  A.m += mKg; A.beta += b; A.Jz += mKg * (x * vy - y * vx);
  for (let a = 0; a < 3; a++) { A.uGC[a] += b * vg[a]; A.uCo[a] += b * vr[a]; for (let c = 0; c < 3; c++) { const gb = -b * dv[c] / d2; A.GGC[a][c] += vg[a] * gb; A.GCo[a][c] += vr[a] * gb; } }
}
/** 円盤の成分の積み上げ(格子 g) */
export function diskAccum(D, g) {
  const A = accum(), R0m = FLOW.R0kpc * KPC, V0 = FLOW.V0, Rmax = MW.RmaxKpc, G = gl01(g.nr), dph = 2 * Math.PI / g.np, Msun = MSUN;
  for (let a = 0; a < g.nr; a++) {
    const Rk = Rmax * G.x[a], wr = Rmax * G.w[a], Sig = D.S0 * Math.exp(-Rk / D.Rd - (D.Rm > 0 ? D.Rm / Rk : 0)), mRing = Sig * Rk * wr * dph / g.nz * Msun, v = vFlow(Rk);
    for (let b = 0; b < g.np; b++) {
      const ph = (b + 0.5) * dph, c = Math.cos(ph), s = Math.sin(ph), x = Rk * c * KPC, y = Rk * s * KPC, vx = -v * s, vy = v * c;
      for (let k = 0; k < g.nz; k++) { const zk = zQuant((k + 0.5) / g.nz, D.zd, D.vert) * KPC; addCell(A, mRing, x, y, zk, vx, vy, 0, R0m, V0); }
    }
  }
  return A;
}
/** バルジ(ρ = ρ0 (1 + r′/r0)^(−α) exp(−(r′/r_cut)²)・r′ = √(R² + (z/q)²) —— 平均の流れ 0 の宣言) */
export function bulgeAccum(g) {
  const B = MW.bulge, A = accum(), R0m = FLOW.R0kpc * KPC, V0 = FLOW.V0, rmax = MW.bulgeRmaxKpc, Gr = gl01(g.br), Gm = gl01(g.bm), dph = 2 * Math.PI / g.bp;
  for (let a = 0; a < g.br; a++) {
    const s = Gr.x[a], rp = rmax * s * s, drp = 2 * rmax * s * Gr.w[a], rho = B.rho0 * Math.pow(1 + rp / B.r0, -B.alpha) * Math.exp(-(rp / B.rcut) * (rp / B.rcut));
    for (let c = 0; c < g.bm; c++) {
      const mu = 2 * Gm.x[c] - 1, wmu = 2 * Gm.w[c], st = Math.sqrt(Math.max(0, 1 - mu * mu)), mCell = rho * B.q * rp * rp * drp * wmu * dph * MSUN;
      for (let b = 0; b < g.bp; b++) { const ph = (b + 0.5) * dph; addCell(A, mCell, rp * st * Math.cos(ph) * KPC, rp * st * Math.sin(ph) * KPC, B.q * rp * mu * KPC, 0, 0, 0, R0m, V0); }
    }
  }
  return A;
}
/** 成分の積み上げから表の量(半渦度のベクトル w = ½ ∇ × u —— 共動系と銀河の中心の系・フロベニウスの大きさ・1 au と 100 au の差の速さ) */
export function fieldOf(A) {
  const hc = (G) => [0.5 * (G[2][1] - G[1][2]), 0.5 * (G[0][2] - G[2][0]), 0.5 * (G[1][0] - G[0][1])];
  let fr = 0; for (let a = 0; a < 3; a++) for (let c = 0; c < 3; c++) fr += A.GCo[a][c] * A.GCo[a][c];
  fr = Math.sqrt(fr);
  return { mKg: A.m, mSun: A.m / MSUN, beta: A.beta, uGC: A.uGC.slice(), uCo: A.uCo.slice(), GCo: A.GCo.map((r) => r.slice()), GGC: A.GGC.map((r) => r.slice()), halfCurlCo: hc(A.GCo), halfCurlGC: hc(A.GGC),
    dUyDx: A.GCo[1][0], dUxDy: A.GCo[0][1], frob: fr, du1au: fr * AU, du100au: fr * 100 * AU, Jz: A.Jz };
}
const sumAcc = (list) => { const S = accum(); for (const A of list) { S.m += A.m; S.beta += A.beta; S.Jz += A.Jz; for (let a = 0; a < 3; a++) { S.uGC[a] += A.uGC[a]; S.uCo[a] += A.uCo[a]; for (let c = 0; c < 3; c++) { S.GGC[a][c] += A.GGC[a][c]; S.GCo[a][c] += A.GCo[a][c]; } } } return S; };
/** 格子 g の分布の銀河(円盤 4 + バルジ)の表の量と成分ごとの量 */
export function mwLocal(g) {
  const parts = MW.disks.map((D) => ({ key: D.key, ja: D.ja, A: diskAccum(D, g) })).concat([{ key: MW.bulge.key, ja: MW.bulge.ja, A: bulgeAccum(g) }]);
  return { grid: { nr: g.nr, np: g.np, nz: g.nz, br: g.br, bm: g.bm, bp: g.bp }, cellsDisk: g.nr * g.np * g.nz, cellsBulge: g.br * g.bm * g.bp, total: fieldOf(sumAcc(parts.map((p) => p.A))), parts: parts.map((p) => Object.assign({ key: p.key, ja: p.ja }, fieldOf(p.A))) };
}
/** 中心 1 体(静止 —— 質量 M [kg] を銀河の中心に)の同じ量(閉じた式: β = 10G_0M/(c_0²R0)・u_co = −β V0 ŷ・∂u_y/∂x = V0 β/R0・半渦度 ½ V0 β/R0) */
export function centralLocal(MKg) {
  const R0m = FLOW.R0kpc * KPC, V0 = FLOW.V0, b = 10 * G0 * MKg / (C0 * C0 * R0m), dUyDx = V0 * b / R0m;
  return { mKg: MKg, mSun: MKg / MSUN, beta: b, uCo: [0, -b * V0, 0], dUyDx, dUxDy: 0, halfCurlCo: [0, 0, 0.5 * dUyDx], frob: Math.abs(dUyDx), du1au: Math.abs(dUyDx) * AU, du100au: Math.abs(dUyDx) * 100 * AU };
}
/** 銀河の面の座標(+x = 銀河の中心から太陽の向き・+z = ĝ・+y = ĝ × x̂ —— 太陽の位置の流れの向き)→ J2000 の黄道 */
export function galFrame() {
  const ga = galaxyAxis(), gc = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg), xh = gc.map((q) => -q), zh = ga.g, yh = cross(zh, xh);
  return { xh, yh, zh, toEcl: (v) => [v[0] * xh[0] + v[1] * yh[0] + v[2] * zh[0], v[0] * xh[1] + v[1] * yh[1] + v[2] * zh[1], v[0] * xh[2] + v[1] * yh[2] + v[2] * zh[2]], orth: Math.abs(dot(xh, zh)) };
}

/**
 * 中心 1 体の銀河の源(質量 M・モーメントの半径 R_src・自転 Ω の軸 â・位置 xG)が受け手(位置 xi)に作る軸の ω の**主項**(弱い場 —— 節点の和の md·dM/dr/W の項):
 *   ω ≈ 2 q2 β Ω sinθ (2μ n̂ − â)(q2 = R_src²/(5r²)・β = C_1 Y_k M/r・n̂ = (xi − xG)/r・μ = n̂·â・sinθ = |â × n̂|)と、受け手の外の場の勾配の項の上限の倍率
 *   1 + (r/2) C_1 Y_k Σ_k m_k/r_k²(gradExt = Σ_k m_k/r_k² —— 受け手の位置の外の源の場の勾配の大きさの和)。受け手の体積の節点の構造の項(主項と同じ桁)は
 *   節点の差 R_d,i/r が倍精度の刻みより小さい受け手では節点の和で決まらない(器が丸めの床を記録する)—— この関数は桁の見積り。
 */
export function galAxialLead(xi, xG, M, Rsrc, Om, a, gradExt) {
  const d = [xi[0] - xG[0], xi[1] - xG[1], xi[2] - xG[2]], r = nrm(d), n = scl3(d, 1 / r), mu = dot(n, a), sn = nrm(cross(a, n)), q2 = Rsrc * Rsrc / (5 * r * r), b = C1 * YK * M / r;
  const amp = 2 * q2 * b * Om * sn, w = [amp * (2 * mu * n[0] - a[0]), amp * (2 * mu * n[1] - a[1]), amp * (2 * mu * n[2] - a[2])], up = 1 + 0.5 * r * C1 * YK * gradExt;
  return { r, beta: b, q2, omega: w, abs: nrm(w), upFactor: up, upper: nrm(w) * up };
}

/* ───────── 要る大きさ(第318便d の宣言の型 —— 同じ式で作り直す)───────── */
export function requiredOf(Rjup) {
  const Tage = LIT.sunAge.value * YEAR;
  return { Tage, plane: DECL.planeTiltDeg * Math.PI / 180 / Tage, venus: Math.PI / (DECL.venusPeriodGyr * GYR), jupiterP: powerOf(LIT.jupiterFlux.value, Rjup), jupiterPAlt: powerOf(LIT.jupiterFluxAlt.value, Rjup) };
}

/* ───────── 書式 ───────── */
export const lab = { ex, fx, fl: (x, floor = 1e-15) => fmtFloor(x, floor, 3), yes: (b) => (b ? '真' : '偽') };

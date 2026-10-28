// 第318便d(原仮定者の指示(第120報)「引きずりについて」・決断事項 AN438・統括の検証項目 R257): **銀河と太陽の引きずりの見積りの純関数**
// (html を読まない —— エンジンの値は器 tests/exp-w318d-dragest.mjs が読み口で取って引数で渡す。器と QA が使う)。
//
// ■ 何をするか(規則・在位の本・エンジンの式は変えない —— 第120報の仮定を仮定として置き、「要る大きさ」と「今の K1 の大きさ」を同じ表に並べる)
//   K1 の規則: R_d = Y_k m・Y_k = 10 G_0/(C_1 c_0²)(C_1 = 6[(√3/2) ln(2 + √3) − 1])。受け手の分母 W = 自己の場 m_i K1(t R_i; R_i) + Σ_k m_k K1(r_k; R_k)。
//   受け手の体積の平均(エンジンの規則の節点 —— 動径 t_a・重み w_a)で
//     β_ij = (R_d,j/r) g(x)・回転の移送 u_rot = Ω_j â_j × n̂ (R_d,j³/(5 r²)) g(x)(遠方 —— M1 = R_d²/(5r²))
//     g(x) = ⟨2/(3 + 2x − t²)⟩(x = Σ_k R_d,k/r_k —— 受け手の外の源の場を Y_k で無次元に)・g(0) = C_1(閉じた式 6[−1 + (s/2) ln((s+1)/(s−1))]・s² = 3 + 2x)。
//   軸の ω(bevel)は ∇W の項と節点の構造の項が効くので、エンジンの節点の和をそのまま写した k1Recv で作る(読み口とビット同一 —— 器が照合する)。
//   A 銀河の並進(規約の大きさ)・B ハロー(NGC 3198 —— 見える質量の薄い円盤・要る移送・回転の項の源の粒度 3 つ・R_d の最小二乗の値・M_drag/M_vis)・
//   C 銀河の軸(南銀極 ĝ と 16 体の符号つきの自転・公転の角運動量の和)・D 太陽の回転(公転面)・E 太陽の軸(金星の逆転・木星の加熱 —— maintain の帳簿の式)・
//   F まとめ(第120報への答えの表と、候補の規則〔R_d,spin = 観測半径・J を別の入力〕で同じ表をもう一度)。
//
// ■ 言わないこと: 「フィットした」(最小二乗の値・最良の値)「較正した」「収束した」「完全に一致」「法則を確かめた」「一致した」(数の桁が近いことを証拠と呼ばない)。
//   ハロー・回転曲線・金星の逆転・木星の熱源を説明したと書かない。銀河の R_d・ω_G・τ_hold を観測から決めたと書かない。合否・観測の 3σ を付けない。
//   文献の値は「文献の値(本便は一次資料に当たっていない)」と書き、正本の inputs に出典の名を残す。
import { galaxyAxis, GAL } from './lib-w317c-satcut.mjs';
import { axisOf } from './lib-w315d-satk1.mjs';
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const LIB_VERSION = 'w318d-dragest-lib-1';

/* ───────── 定数(SI)───────── */
export const G0 = 6.674e-11;            // 本の基準重力 G_0(在位の本と同じ 6.674×10⁻¹¹)
export const C0 = 299792458;            // c_0
/** C_1 = 6[(√3/2) ln(2+√3) − 1](tests/lib-w315d-satk1.mjs の C1 と同じ式・同じ演算の順) */
export const C1 = 6 * ((Math.sqrt(3) / 2) * Math.log(2 + Math.sqrt(3)) - 1);
/** 引きずり係数 Y_k = 10 G_0/(C_1 c_0²) [m/kg](html の invSqKappa0 と同じ演算の順) */
export const YK = (10 * G0) / (C1 * C0 * C0);
export const AU = 1.495978707e11, PC = GAL.pcMeters, KPC = 1e3 * GAL.pcMeters;
export const YEAR = 365.25 * 86400, GYR = 1e9 * YEAR;
/** 太陽質量 [kg] —— NGC 3198 の行(paper/data/cluster-galaxy-observations.csv)の M_HI の kg と Msun の換算と同じ値(10.869e9 Msun = 2.16127e40 kg) */
export const MSUN = 1.98847e30;
/** 本の単位(10⁹ m / 10⁵ s / 10²⁸ kg —— 16 体の入力と同じ) */
export const UNITS = Object.freeze({ L: 9, T: 5, M: 28 });
export const LU = 1e9, TU = 1e5, MU = 1e28, VU = LU / TU;

/**
 * 文献の値(本便は一次資料に当たっていない —— 出典の名を正本の inputs に残す)。値は宣言の仮定の材料で、観測で決めた量として使わない。
 */
export const LIT = Object.freeze({
  sunAge: Object.freeze({ value: 4.567e9, unit: 'yr', name: '太陽系の年齢(隕石の最古の包有物の年代の型 —— 文献の値)' }),
  jupiterFlux: Object.freeze({ value: 5.444, unit: 'W/m^2', name: '木星の内部の熱流(Hanel et al. 1981 —— 文献の値)' }),
  jupiterFluxAlt: Object.freeze({ value: 7.485, unit: 'W/m^2', name: '木星の内部の熱流(Li et al. 2018 —— 文献の値・対照)' }),
  sunMoI: Object.freeze({ value: 0.07, unit: '-', name: '太陽の慣性モーメントの係数 I/(MR²)(標準の太陽模型の型 —— 文献の値)' }) });
/** 宣言の仮の期間・仮定の型(結果を見て変えない) */
export const DECL = Object.freeze({
  venusPeriodGyr: 1,            // E ② 金星の軸を π 回す作用期間(**仮の期間**)
  planeTiltDeg: 3,              // D 公転面の傾斜の復元の仮定の型(太陽系の年齢で数度 —— 3°)
  alignAgeFrac: 1,              // C 逆向きへ寄せる散逸の時間尺度 τ = 太陽系の年齢 × この値
  galaxyMassModel: 'V0²R0/G_0', // A 銀河の質量の宣言(太陽の公転の円運動が要る球対称の内側の質量)
  haloOmegaSrc: 'V_flat/R_s',   // B 源の自転率の宣言(V_flat ÷ 円盤の尺度長)
  rings: Object.freeze({ nr: 8, np: 16 }),                         // B 「N 個の環」(8 環 × 16)
  grids: Object.freeze([Object.freeze({ nr: 16, np: 32 }), Object.freeze({ nr: 32, np: 64 })]),   // B 連続の円盤の数値の和(格子を細かくした列)
  azimuths: 8,                  // B 環の源の受け手の方位の平均(源の間隔の内の等間隔)
  regionInnerKpc: 5, regionOuterKpc: 15,                           // B 残差の形(内側・外側)
  dRuns: Object.freeze({ orbits: 10, stepsPerOrbit: 720, tiltRad: 1e-3 }) });   // D 測る形の試し

/* ───────── K1 の受け手の平均(閉じた式とエンジンの規則)───────── */
/** g(x) = ⟨2/(3 + 2x − t²)⟩(一様球の体積の平均の閉じた式) */
export function gClosed(x) { const s = Math.sqrt(3 + 2 * x); return 6 * (-1 + (s / 2) * Math.log((s + 1) / (s - 1))); }
/** 規則の動径の重み(角度の重みの和)w_a と SK1_a(エンジンの inertialDragIsqRuleK1 の値を受ける —— rule.W・rule.NA・rule.SK1) */
export function radialOf(rule) {
  const w = new Float64Array(rule.n);
  for (let a = 0; a < rule.n; a++) { let s = 0; for (let q = 0; q < rule.NA; q++) s += rule.W[a * rule.NA + q]; w[a] = s; }
  return { w, sk: Float64Array.from(rule.SK1), t: Float64Array.from(rule.TA) };
}
/** g(x) を規則の節点で(β = x·g・回転の係数 = (R_d³/(5r²))·g と同じ和 —— 受け手の自己の場 SK1_a/R_i と外の場 x/R_i の比の平均) */
export function gRule(x, rad) { let s = 0; for (let a = 0; a < rad.w.length; a++) s += rad.w[a] / (rad.sk[a] + x); return s; }

/* ───────── エンジンの節点の和の写し(K1・外殻なし・dragCore の自転の宣言なし —— inertialDragIsqEvalK1 の受け手 1 行)───────── */
/**
 * P = {n, x, y, z, md, Rd, spin, ax, ay, az}(本の単位 —— エンジンの S.x・_rdIsqRd・_rdIsqMd・S.spin・S.sax… の値)。受け手 i の源ごとの
 * β_ij・回転の係数 RV_ij(3)・軸の ω_ij(3 —— bevel・gain)と節点の和の W の最小・最大。エンジンと同じ式・同じ演算の順(読み口とビット同一を器が照合する)。
 */
export function k1Recv(rule, P, i, o = {}) {
  const n = P.n, gain = o.gain === undefined ? 1 : o.gain, NA = rule.NA;
  const Ri = P.Rd[i], R2 = Ri * Ri, mdi = P.md[i], xi = P.x[i], yi = P.y[i], zi = P.z[i];
  const BE = new Float64Array(n), RV = new Float64Array(n * 3), OP = new Float64Array(n * 3);
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
        const q2 = P.Rd[j] * P.Rd[j] / (5 * rr[j] * rr[j]), b2 = q2, b3 = -2 * q2 / rr[j];
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
  for (let j = 0; j < n; j++) if (j !== i) src.push({ j, beta: BE[j], rot: [RV[j * 3], RV[j * 3 + 1], RV[j * 3 + 2]], omega: [OP[j * 3], OP[j * 3 + 1], OP[j * 3 + 2]] });
  const om = [0, 0, 0]; for (let j = 0; j < n; j++) { om[0] += OP[j * 3]; om[1] += OP[j * 3 + 1]; om[2] += OP[j * 3 + 2]; }
  return { i, src, beta: Array.from(BE), omega: om, wMin, wMax };
}
/** 回転の移送 u_rot = Ω_j â_j × RV_ij(エンジンの build と同じ式) */
export function uRotOf(rv, Om, a) { const ax0 = a[0] * Om, ay0 = a[1] * Om, az0 = a[2] * Om; return [ay0 * rv[2] - az0 * rv[1], az0 * rv[0] - ax0 * rv[2], ax0 * rv[1] - ay0 * rv[0]]; }

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const s = nrm(a); return [a[0] / s, a[1] / s, a[2] / s]; };
const angDeg = (a, b) => Math.atan2(nrm(cross(a, b)), dot(a, b)) * 180 / Math.PI;
const relDiff = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
export const vecRel = (a, b) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), s = Math.max(nrm(a), nrm(b)); return s > 0 ? d / s : 0; };

/* ───────── A 銀河の並進(規約の大きさ)───────── */
/** 宣言の銀河(質量 M_G = V0²R0/G_0・距離 R0・速さ V0 —— 〔第311便b〕⑥ の尺度と同じ V0・R0) */
export function galaxyDeclA() {
  const V0 = GAL.V0kms * 1e3, R0 = GAL.R0kpc * KPC, MG = V0 * V0 * R0 / G0;
  return { V0, R0, MG, MGsun: MG / MSUN, RdG: YK * MG, model: DECL.galaxyMassModel };
}
/**
 * A の解析の表。betaG0 = C_1 R_d,G/R0(遠方・受け手の外の場が小さい極限)= 10 V0²/c_0²・r の受け手の向き(銀河の中心へ ±)の差 Δβ ≈ 2 β r/R0・
 * Δu = Δβ V0・惑星の公転の速さ v(r) = √(G M☉/r) との比・受け手の速さに比例する分 β v(全天体に同じ比 β —— 重力の尺度の (1 − β) 倍の型)。
 */
export function partAAnalytic(Msun, radiiAu) {
  const g = galaxyDeclA(), b0 = C1 * g.RdG / g.R0, b10 = 10 * g.V0 * g.V0 / (C0 * C0);
  const rows = radiiAu.map((ra) => {
    const r = ra * AU, bIn = C1 * g.RdG / (g.R0 - r), bOut = C1 * g.RdG / (g.R0 + r), db = bIn - bOut, du = db * g.V0, v = Math.sqrt(G0 * Msun / r);
    return { rAu: ra, betaToward: bIn, betaAway: bOut, dBeta: db, dBetaLin: 2 * b0 * r / g.R0, du, vOrb: v, duOverV: du / v, tidal2: b0 * (r / g.R0) * (r / g.R0), selfPart: b0 * v, selfOverV: b0 };
  });
  return { decl: g, beta0: b0, beta10V2: b10, uniform: b0 * g.V0, rows };
}

/* ───────── B ハロー(NGC 3198)───────── */
/** CSV の 1 行(引用の欄を含む) */
function csvRow(line) { const out = []; let cur = '', q = false; for (let k = 0; k < line.length; k++) { const c = line[k]; if (q) { if (c === '"') { if (line[k + 1] === '"') { cur += '"'; k++; } else q = false; } else cur += c; } else if (c === '"') q = true; else if (c === ',') { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; }
/** NGC 3198 の行(paper/data/cluster-galaxy-observations.csv —— 候補の行 `_candidate` は使わない)。v_rot の誤差は備考の「Vobs = v +/- e km/s」から */
export function ngc3198Of(csvText) {
  const lines = csvText.split(/\r?\n/), head = csvRow(lines[0]), ix = (k) => head.indexOf(k), rows = [];
  for (let k = 1; k < lines.length; k++) { if (!lines[k].startsWith('NGC 3198,')) continue; const c = csvRow(lines[k]); rows.push({ q: c[ix('quantity')], v: c[ix('value')], u: c[ix('unit')], note: c[ix('note')], id: c[ix('record_id')] }); }
  const one = (q) => { const r = rows.find((z) => z.q === q); if (!r) throw new Error('NGC 3198 の行が無い: ' + q); return r; };
  const vrot = [], shi = [];
  for (const r of rows) {
    let m = /^v_rot\(r=([\d.]+) kpc\)$/.exec(r.q);
    if (m) { const e = /Vobs = ([\d.]+) \+\/- ([\d.]+) km\/s/.exec(r.note); if (!e) throw new Error('v_rot の誤差が読めない: ' + r.q); vrot.push({ rKpc: Number(m[1]), V: Number(r.v), eV: Number(e[2]) * 1e3, VNote: Number(e[1]) * 1e3, id: r.id }); continue; }
    m = /^sigma_hi\(r=([\d.]+) kpc\)$/.exec(r.q);
    if (m) shi.push({ rKpc: Number(m[1]), sigma: Number(r.v), id: r.id });
  }
  vrot.sort((a, b) => a.rKpc - b.rKpc); shi.sort((a, b) => a.rKpc - b.rKpc);
  const L36 = Number(one('luminosity_3.6um').v), ups = Number(one('stellar_mass_to_light_3.6um_disk').v), Rs = Number(one('disk_scale_length').v), MHI = Number(one('hi_mass').v), Vflat = Number(one('v_flat').v), RHI = Number(one('hi_radius').v), inc = Number(one('inclination').v), D = Number(one('distance').v);
  const ids = ['luminosity_3.6um', 'stellar_mass_to_light_3.6um_disk', 'disk_scale_length', 'hi_mass', 'v_flat', 'hi_radius', 'inclination', 'distance'].map((q) => one(q).id);
  return { L36, ups, Rs, MHI, Vflat, RHI, incDeg: inc, D, vrot, shi, ids: ids.concat(vrot.map((z) => z.id), shi.map((z) => z.id)), vrotDeprojected: /ALREADY DEPROJECTED/.test(one('inclination').note) };
}
/* 楕円積分(AGM)とベッセル関数(積分表示の台形 —— 指数の速さで決まる)*/
export function ellipKE(k) {
  let a = 1, b = Math.sqrt(1 - k * k), c = k, s = 0.5 * c * c, p = 0.5;
  for (let it = 0; it < 40; it++) { const an = (a + b) / 2, bn = Math.sqrt(a * b); c = (a - b) / 2; a = an; b = bn; p *= 2; s += p * c * c; if (Math.abs(c) < 1e-17 * a) break; }
  const K = Math.PI / (2 * a); return { K, E: K * (1 - s) };
}
function besselI(nu, x) { const N = 256; let s = 0; for (let k = 0; k <= N; k++) { const th = Math.PI * k / N, w = (k === 0 || k === N) ? 0.5 : 1; s += w * Math.exp(x * Math.cos(th)) * Math.cos(nu * th); } return s / N; }
function besselK(nu, x) { const h = 0.02; let s = 0; for (let k = 0; ; k++) { const t = k * h, e = Math.exp(-x * Math.cosh(t)) * Math.cosh(nu * t), w = k === 0 ? 0.5 : 1; s += w * e; if (e < 1e-300 || (k > 10 && e < 1e-18 * s)) break; } return s * h; }
/** 指数の円盤(Σ0 e^(−R/R_s)・薄い)の円運動の速さの二乗(Freeman の閉じた式 —— 数値の和の照合) */
export function freemanV2(R, M, Rs) { const y = R / (2 * Rs), S0 = M / (2 * Math.PI * Rs * Rs); return 4 * Math.PI * G0 * S0 * Rs * y * y * (besselI(0, y) * besselK(0, y) - besselI(1, y) * besselK(1, y)); }
/** Gauss–Legendre(区間 [0,1] —— 外側の区間の求積) */
function glNodes(n) { const x = [], w = []; for (let i = 0; i < n; i++) { let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), pp = 1; for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } pp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) <= 1e-16) break; } x.push(0.5 * (1 - z)); w.push(1 / ((1 - z * z) * pp * pp)); } return { x, w }; }
const GL16 = glNodes(16);
/**
 * 薄い円盤(軸対称・面密度 sigma(a) [kg/m²])の面内の円運動の速さの二乗 V²(R)(環の和 —— 環 a の面内の動径の力は完全楕円積分 K・E:
 *   −R F_R = G dm/(π (a+R)) [K(k) − ((a+R)/(a−R)) E(k)]・k² = 4aR/(a+R)²)。[0, 2R] は R を区間の境に置いた中点の和(1/(a−R) の主値が対で消える —— 対数の特異の誤差 1/M の一次を M と 2M の Richardson で消す)・[2R, aMax] は 16 点の Gauss の区間
 */
export function thinDiskV2(R, sigma, aMax, o = {}) {
  if (!o.M) { const M = o.Mbase || 4000, a = thinDiskV2(R, sigma, aMax, Object.assign({}, o, { M })), b = thinDiskV2(R, sigma, aMax, Object.assign({}, o, { M: 2 * M })); return 2 * b - a; }   // 中点の和の対数の特異の誤差は 1/M の一次 —— M と 2M の Richardson
  const M = o.M, d = R / M; let s = 0;
  const ring = (a, dm) => { const k = 2 * Math.sqrt(a * R) / (a + R), e = ellipKE(Math.min(k, 1 - 1e-16)); return G0 * dm / (Math.PI * (a + R)) * (e.K - ((a + R) / (a - R)) * e.E); };
  for (let q = 0; q < 2 * M; q++) { const a = (q + 0.5) * d; if (a > aMax) break; const sg = sigma(a); if (sg !== 0) s += ring(a, 2 * Math.PI * a * sg * d); }
  if (2 * R < aMax) { const np = o.panels || 200, lo = 2 * R, L = (aMax - lo) / np; for (let p = 0; p < np; p++) for (let q = 0; q < 16; q++) { const a = lo + (p + GL16.x[q]) * L, sg = sigma(a); if (sg !== 0) s += ring(a, 2 * Math.PI * a * sg * GL16.w[q] * L); } }
  return s;
}
/** 見える質量の模型(星 = Υ L_3.6 の指数の円盤・ガス = 1.33 Σ_HI の表〔線形の内挿・最後の行の外は 0〕—— ガスの表の面積分を 1.33 M_HI〔目録〕へ合わせる倍率 fGas を宣言で掛ける) */
export function visibleModel(N, o = {}) {
  const Mst = N.ups * N.L36 * MSUN, Rs = N.Rs, S0 = Mst / (2 * Math.PI * Rs * Rs), sigSt = (a) => S0 * Math.exp(-a / Rs);
  const conv = MSUN / (PC * PC), tab = N.shi.map((z) => ({ r: z.rKpc * KPC, s: 1.33 * z.sigma * conv }));
  const sigRaw = (a) => { if (a < tab[0].r || a > tab[tab.length - 1].r) return 0; for (let k = 1; k < tab.length; k++) if (a <= tab[k].r) { const f = (a - tab[k - 1].r) / (tab[k].r - tab[k - 1].r); return tab[k - 1].s + f * (tab[k].s - tab[k - 1].s); } return 0; };
  let Mraw = 0; for (let k = 1; k < tab.length; k++) { const r0 = tab[k - 1].r, r1 = tab[k].r, s0 = tab[k - 1].s, s1 = tab[k].s; Mraw += 2 * Math.PI * ((s0 * (r1 * r1 - r0 * r0)) / 2 + (s1 - s0) / (r1 - r0) * ((r1 * r1 * r1 - r0 * r0 * r0) / 3 - r0 * (r1 * r1 - r0 * r0) / 2)); }
  const Mgas = 1.33 * N.MHI, fGas = (o.normalizeGas === false) ? 1 : Mgas / Mraw, sigGas = (a) => fGas * sigRaw(a);
  return { Mst, Mgas, Mvis: Mst + Mgas, MgasRaw: Mraw, fGas, sigSt, sigGas, aMaxSt: 40 * Rs, aMaxGas: tab[tab.length - 1].r };
}
/** 要る移送 u_φ,req = V − V_bar²/V(定常・軸対称・純円運動・観測の速さを座標の移送の速さと読む)と誤差の伝播 σ_u = e_V (1 + V_bar²/V²) */
export function requiredU(N, vis, o = {}) {
  return N.vrot.map((p) => {
    const R = p.rKpc * KPC, vs2 = thinDiskV2(R, vis.sigSt, vis.aMaxSt, o), vg2 = thinDiskV2(R, vis.sigGas, vis.aMaxGas, o), fr = freemanV2(R, vis.Mst, N.Rs), vb2 = vs2 + vg2;
    return { rKpc: p.rKpc, R, V: p.V, eV: p.eV, Vst: Math.sign(vs2) * Math.sqrt(Math.abs(vs2)), Vgas: Math.sign(vg2) * Math.sqrt(Math.abs(vg2)), Vbar: Math.sqrt(Math.max(vb2, 0)), freemanRel: relDiff(vs2, fr),
      uReq: p.V - vb2 / p.V, sigU: p.eV * (1 + vb2 / (p.V * p.V)) };
  });
}
/** 源の配置(粒度): 1 = 中心に 1 つ・{nr, np} = 星の指数の円盤の等質量の環(各環の質量の中点の半径)に np 個ずつ(同じ質量の N 等分) */
export function sourcesOf(gran, Rs) {
  if (gran === 1) return { n: 1, nr: 1, np: 1, xs: [0], ys: [0] };
  const { nr, np } = gran, xs = [], ys = [];
  const cum = (a) => 1 - (1 + a / Rs) * Math.exp(-a / Rs), inv = (f) => { let lo = 0, hi = 60 * Rs; for (let it = 0; it < 200; it++) { const mid = (lo + hi) / 2; if (cum(mid) < f) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  for (let k = 0; k < nr; k++) { const a = inv((k + 0.5) / nr), ph0 = (k % 2) * Math.PI / np; for (let q = 0; q < np; q++) { const ph = ph0 + 2 * Math.PI * q / np; xs.push(a * Math.cos(ph)); ys.push(a * Math.sin(ph)); } }
  return { n: nr * np, nr, np, xs, ys };
}
/**
 * 受け手(面内の半径 R・方位の平均)の回転の移送の方位の成分 u_φ と Σβ(源は全部同じ R_d,k = Rtot/n・同じ自転 Ω の z 軸 —— 宣言)。
 * 受け手の W = 自己 + Σ_k の外の場(x = Σ R_d,k/d_k)・g(x) は規則の節点(rad)。内側の点(d ≤ R_d,k —— エンジンの重なりの判定で拒否される域)を数える。
 */
export function uPhiAt(R, src, Rtot, Om, rad, nAz) {
  const Rk = Rtot / src.n, nphi = src.np > 1 ? nAz : 1; let u = 0, b = 0, inside = 0;
  for (let s = 0; s < nphi; s++) {
    const ph = src.np > 1 ? (s + 0.5) * (2 * Math.PI / src.np) / nAz : 0, px = R * Math.cos(ph), py = R * Math.sin(ph); let x = 0, us = 0, bs = 0, ins = false;
    for (let k = 0; k < src.n; k++) { const dx = px - src.xs[k], dy = py - src.ys[k], d = Math.hypot(dx, dy); if (!(d > Rk)) ins = true; x += Rk / d; }
    const g = gRule(x, rad);
    for (let k = 0; k < src.n; k++) { const dx = px - src.xs[k], dy = py - src.ys[k], d = Math.hypot(dx, dy), rhat = (dx * Math.cos(ph) + dy * Math.sin(ph)) / d; us += Om * rhat * Rk * Rk * Rk / (5 * d * d) * g; bs += Rk / d * g; }
    u += us; b += bs; if (ins) inside++;
  }
  return { u: u / nphi, beta: b / nphi, inside: inside > 0 };
}
/** χ²(R_tot) と最小二乗の値(log R_tot の格子 → 黄金分割)。pts は requiredU の行(部分集合でよい) */
export function chi2Of(pts, src, Rtot, Om, rad, nAz) { let c = 0; for (const p of pts) { const z = uPhiAt(p.R, src, Rtot, Om, rad, nAz); c += ((p.uReq - z.u) / p.sigU) ** 2; } return c; }
export function bestRtot(pts, src, Om, rad, nAz, o = {}) {
  const lo = o.lo || 14, hi = o.hi || 24, st = o.step || 0.05; let best = null;
  for (let e = lo; e <= hi + 1e-9; e += st) { const c = chi2Of(pts, src, Math.pow(10, e), Om, rad, nAz); if (!best || c < best.c) best = { e, c }; }
  let a = best.e - st, b = best.e + st; const gr = (Math.sqrt(5) - 1) / 2;
  let x1 = b - gr * (b - a), x2 = a + gr * (b - a), f1 = chi2Of(pts, src, Math.pow(10, x1), Om, rad, nAz), f2 = chi2Of(pts, src, Math.pow(10, x2), Om, rad, nAz);
  for (let it = 0; it < 60; it++) { if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - gr * (b - a); f1 = chi2Of(pts, src, Math.pow(10, x1), Om, rad, nAz); } else { a = x1; x1 = x2; f1 = f2; x2 = a + gr * (b - a); f2 = chi2Of(pts, src, Math.pow(10, x2), Om, rad, nAz); } }
  const e = (a + b) / 2, Rt = Math.pow(10, e);
  return { Rtot: Rt, log10Rtot: e, chi2: chi2Of(pts, src, Rt, Om, rad, nAz), n: pts.length };
}
/** B の粒度ごとの表(全点・内側だけ・外側だけの最小二乗の値・M_drag = R_tot/Y_k・M_vis との比・残差の形・内側の点・Σβ・M_drag を重力の質量と読んだ速さ) */
export function partBModel(req, N, vis, rad, gran, label) {
  const Om = N.Vflat / N.Rs, src = sourcesOf(gran, N.Rs), nAz = DECL.azimuths;
  const inner = req.filter((p) => p.rKpc < DECL.regionInnerKpc), outer = req.filter((p) => p.rKpc > DECL.regionOuterKpc);
  const all = bestRtot(req, src, Om, rad, nAz), bi = bestRtot(inner, src, Om, rad, nAz), bo = bestRtot(outer, src, Om, rad, nAz);
  const rows = req.map((p) => { const z = uPhiAt(p.R, src, all.Rtot, Om, rad, nAz); return { rKpc: p.rKpc, uReq: p.uReq, sigU: p.sigU, u: z.u, res: (p.uReq - z.u) / p.sigU, beta: z.beta, inside: z.inside }; });
  const wm = (rs) => { let s = 0, w = 0; for (const r of rs) { s += r.res; w++; } return w ? s / w : null; };
  const Mdrag = all.Rtot / YK, rFar = req[req.length - 1].R;
  return { key: label, gran: gran === 1 ? 1 : { nr: gran.nr, np: gran.np }, nSrc: src.n, OmSrc: Om, best: all, inner: bi, outer: bo,
    Mdrag, MdragSun: Mdrag / MSUN, ratioVis: Mdrag / vis.Mvis, RdPerSrc: all.Rtot / src.n, RdPerSrcKpc: all.Rtot / src.n / KPC, RtotKpc: all.Rtot / KPC,
    innerOverOuter: bi.Rtot / bo.Rtot, chi2PerPt: all.chi2 / all.n, resInner: wm(rows.filter((r) => r.rKpc < DECL.regionInnerKpc)), resOuter: wm(rows.filter((r) => r.rKpc > DECL.regionOuterKpc)),
    nInside: rows.filter((r) => r.inside).length, betaMax: Math.max(...rows.map((r) => r.beta)), betaFar: rows[rows.length - 1].beta,
    vGravDrag: Math.sqrt(G0 * Mdrag / rFar), vGravDragOverC: Math.sqrt(G0 * Mdrag / rFar) / C0, rows };
}
/** 遠方の回転の項(Σ m R_d² Ω = Ω Y_k² Σ m³)の N 等分の比 1/N²(同じ全質量 —— 粗視化の依存) */
export const farRotScale = (N) => 1 / (N * N);

/* ───────── C 銀河の軸 ───────── */
/** 16 体の名(入力の並び —— tests/data-w318c-solar16-input.json)と衛星の母惑星 */
export const BODY16 = Object.freeze(['太陽', '水星', '金星', '地球', '月', '火星', '木星', 'イオ', 'エウロパ', 'ガニメデ', 'カリスト', '土星', 'タイタン', '天王星', '海王星', 'トリトン']);
export const SAT_PARENT = Object.freeze({ 4: 3, 7: 6, 8: 6, 9: 6, 10: 6, 12: 11, 15: 14 });
/** 符号つきの自転ベクトルの向き(spin の符号 × spinAxis —— 入力の基底 J2000 の黄道)と ĝ(南銀極)の角・16 体の重心系の公転の角運動量の和と ĝ の角 */
export function partCAngles(bodies) {
  const ga = galaxyAxis(), g = ga.g, n = bodies.length;
  let M = 0; const c = [0, 0, 0], p = [0, 0, 0];
  for (const b of bodies) { M += b.m; c[0] += b.m * b.x; c[1] += b.m * b.y; c[2] += b.m * (b.z || 0); p[0] += b.m * b.vx; p[1] += b.m * b.vy; p[2] += b.m * (b.vz || 0); }
  const L = [0, 0, 0];
  const rows = bodies.map((b, i) => {
    const r = [b.x - c[0] / M, b.y - c[1] / M, (b.z || 0) - c[2] / M], v = [b.vx - p[0] / M, b.vy - p[1] / M, (b.vz || 0) - p[2] / M], l = cross(r, v).map((q) => q * b.m);
    L[0] += l[0]; L[1] += l[1]; L[2] += l[2];
    const a = axisOf(b.spinAxis), s = Math.sign(b.spin) || 1, sv = a.map((q) => q * s), ang = angDeg(sv, g);
    return { i, name: BODY16[i] || ('#' + i), sat: SAT_PARENT[i] !== undefined, parent: SAT_PARENT[i] === undefined ? null : SAT_PARENT[i], spinSign: s, angDeg: ang, anti: ang > 90, cosG: Math.cos(ang * Math.PI / 180) };
  });
  const angL = angDeg(L, g), eclN = [0, 0, 1];
  const indep = rows.filter((r) => !r.sat);
  return { g, gEcl: ga.ecl, OmRefSI: ga.OmRefSI, rows, Lsum: L, angLDeg: angL, angEclNorthDeg: angDeg(eclN, g), nAnti: rows.filter((r) => r.anti).length, nAll: rows.length,
    nAntiIndep: indep.filter((r) => r.anti).length, nIndep: indep.length, sats: rows.filter((r) => r.sat).map((r) => r.i) };
}
/**
 * 一様な ω_G の歳差 da/dt = ω_G × a は a·ω̂_G を保つ(d(a·ω̂)/dt = (ω × a)·ω̂ = 0)—— 逆向きを選ぶ働きが無い(式と数: 数値の歳差で a·ĝ の変化 = 丸めの床)。
 * 逆向きへ寄せる散逸の型(宣言 —— 球面の勾配流 da/dt = −(1/τ)[ĝ − (a·ĝ)a])の τ と要る率 1/τ・その率を ω_G に効率 η で結ぶなら |ω_G| = 1/(η τ)。
 */
export function partCPrecession(a0, g, wG, Tspan, nStep) {
  let a = a0.slice(); const dt = Tspan / nStep, w = g.map((q) => q * wG), c0 = dot(a, g);
  for (let k = 0; k < nStep; k++) { const th = wG * dt, cth = Math.cos(th), sth = Math.sin(th), gxa = cross(g, a), ga = dot(g, a); a = [a[0] * cth + gxa[0] * sth + g[0] * ga * (1 - cth), a[1] * cth + gxa[1] * sth + g[1] * ga * (1 - cth), a[2] * cth + gxa[2] * sth + g[2] * ga * (1 - cth)]; }
  return { dotStart: c0, dotEnd: dot(a, g), dDot: dot(a, g) - c0, turnRad: wG * Tspan, wVec: w };
}

/* ───────── D・E の解析 ───────── */
/** maintain の帳簿の 1 回の量(エンジンの inertialDrag3MaintCell と同じ式・同じ演算の順 —— 器が読み口の関数とビット同一を照合する)。戻り値 [E_ax, E_sp, Q] */
export function maintCell(I, s0, ax, ay, az, wp, qx, qy, qz) {
  const sg = (s0 < 0) ? -1 : 1, w = sg * s0, p = sg * wp, q2 = qx * qx + qy * qy + qz * qz;
  const cp = w + p, s = Math.sqrt(cp * cp + q2), dpar = (cp > 0) ? q2 / (s + cp) : s - cp;
  const Eax = 0.5 * I * (dpar * dpar + q2), d2 = p * p + q2, Esp = I * (w * p + 0.5 * d2);
  return [Eax, Esp, Eax + ((Esp > 0) ? Esp : 0)];
}
/** ω(本の 1/時間)を受け手の軸 â へ分ける(wp・q)*/
export function splitOmega(om, a) { const wp = dot(om, a); return { wp, q: [om[0] - wp * a[0], om[1] - wp * a[1], om[2] - wp * a[2]] }; }
/** 軸を π 回すのに要る |ω|(一定の歳差 —— 軸 â0 を −â0 へ: â0 ⊥ ω̂ が要る)と、今の ω の向きでの到達の条件 */
export function venusReq(TGyr) { return { T: TGyr * GYR, omReq: Math.PI / (TGyr * GYR) }; }
/** 木星の内部の熱の電力 P = 熱流 × 4πR² */
export const powerOf = (flux, R) => flux * 4 * Math.PI * R * R;

/* ───────── 書式(PHYSICS の表 —— QA が逐語で照合)───────── */
const fl = (x, floor = 1e-15) => fmtFloor(x, floor, 3);
const yes = (b) => (b ? '真' : '偽');
export const lab = { ex, fx, fl, yes };

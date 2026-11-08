// 第329便b(原仮定者の方針(2026-11-07)「既存の銀河の回転の理論を利用して DFM を融合する」「ダークマターハローを完全に説明するつもりは無い。ただし影響はあるので寄与の度合いを調査する」・
//   原仮定者の回答(2026-11-07 —— AN570 = A の限定 + B の限定)・統括の検証項目 R305): **既存の銀河の回転の理論のラベルと寄与の度合いの純関数**
//   (器 tests/exp-w329b-galrot.mjs と QA lint.galRot329b・behavior.galRot329b が読む —— html を読まない・状態を持たない)。
//
// ■ 何をするか(既存の理論の写像 —— DFM の式から導いた量ではない)
//   ラベル: 回転の速さの表 v_c(R)(誤差つき)から、ほぼ円の軌道・軸対称の既存の対応
//     A_O = ½(v_c/R − v_c′)・B_O = −½(v_c/R + v_c′)・Ω = A_O − B_O・κ_epi² = −4ΩB_O・Ω − κ_epi/2・Ω + κ_epi/2
//     を半径ごとに作る。κ_epi は周転円の振動数(DFM の κ_D とは別の量 —— 同じ記号にまとめない)。A_O・B_O はオールトの量(DFM の滑り A・慣性モーメントとは別)。
//     微分の型を宣言する: centralDiff(不等間隔の 3 点の中心差分 —— 両端は null)・localQuad(重みつきの局所の二次の当てはめ —— 窓 ±DECL.localQuadHalfWidth 点)。
//     誤差の伝播は線形(v と v′ の共分散を微分の重みから —— 点の誤差を独立と置く宣言)。κ_epi² < 0 の行は κ_epi を null(0 で埋めない)。
//   恒等式: v ∝ R^n で A_O = ½(1 − n)Ω・B_O = −½(1 + n)Ω・κ_epi² = 2(1 + n)Ω²(平坦 n = 0: A_O = −B_O = Ω/2・κ_epi = √2Ω・Ω − κ_epi/2 = (1 − 1/√2)v₀/R は 1/R で変わる /
//     剛体 n = 1: A_O = 0・κ_epi = 2Ω / ケプラー n = −½: κ_epi = Ω)。
//   物質線の反例(参考の直し 1): 円軌道の上の微小な動径の物質線の慣性系の向き φ(t) = Ωt + atan2((n − 1)Ωt, 1) —— 初めの回転率は nΩ(瞬間の値)。
//     n = −1 で 1 公転後 約 4.7918 rad(−2π ではない —— 同じ物質線が −Ω で回り続けるのではない・剛体の天体の角速度とも別)。2 点の追跡で照合する。
//   ラベルの口(AN570 の B の限定): 銀河の本に平坦な回転の恒等式(A_O = −B_O = Ω/2・Ω_p = Ω − κ_epi/2 —— m = 2 の内側 Lindblad 共鳴の条件の値で、全半径の同じパターン速度ではない)
//     をラベルとして置く口。**宣言が無いあいだは全部 null**。今の場の API の半渦度は Ω_field に写さない(口が拒否する)。
//   寄与の度合い(第131報): rotmod の写しから v_bar² = V_gas|V_gas| + Υ_disk V_disk|V_disk| + Υ_bul V_bul|V_bul| と足りない分 v_obs² − v_bar²(誤差 2 v_obs e_v)・
//     DFM の OFF/ON の差の加速度の箱ごとの集計(内向き a_in と接線 a_t を分ける・円軌道の釣り合いで読めるときだけ Δv² = R a_in)・
//     η(R) = Δv²_DFM/(v_obs² − v_bar²)(分母が有意に正の箱だけ・負や 1 超を丸めない)・M_eq = R Δv²/G(等価の質量 —— 実質量の同定ではない)。
//
// ■ 言わないこと: κ_epi と κ_D を同じ量と書かない・Ω − κ_epi/2 を半径によらない量と書かない(平坦な回転で 1/R に依る)・Ω_p を全半径のパターン速度と書かない・
//   運動学の腕を長く保つ機構と書かない(自己重力・波の応答が要る)・周転円の逆回りを天体の慣性系の自転と書かない・η は寄与の度合いの診断(ハローの置き換えを主張しない)・
//   M_eq を実在の質量と書かない・p 値を出さない。
export const LIB_VERSION = 'w329b-galrot-lib-1';
export const KPC_M = 3.0856775814913673e19;
/** 1 km s⁻¹ kpc⁻¹ = KMS_KPC_RADS rad/s */
export const KMS_KPC_RADS = 1e3 / KPC_M;
export const G_SI = 6.674e-11;
export const MSUN_KG = 1.98847e30;

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  derivTypes: Object.freeze(['centralDiff', 'localQuad']),
  /** localQuad の窓(±点の数 —— 窓の中が 4 点未満なら null) */
  localQuadHalfWidth: 2,
  /** SPARC の質量模型の規約(Υ_disk = 0.5 —— 3.6 μm)と感度の列 */
  upsilonDisk: 0.5, upsilonBul: 0.7, upsilonSens: Object.freeze([0.3, 0.5, 0.8]),
  /** 有意に正の判定(分母が kSigma σ を超える箱だけ η を作る) */
  kSigma: 2,
  /** 円軌道の釣り合いで読める判定: |⟨a_in⟩| ≥ radialOverTangential × ⟨|a_t|⟩(満たさない箱は Δv² の換算を使わない) */
  radialOverTangential: 2,
  /** 箱の粒子の数の下限(下回る箱は null) */
  minParticles: 3,
});

const isFin = (x) => typeof x === 'number' && Number.isFinite(x);
const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);

/* ───────── ラベル(既存の理論の写像)───────── */
/**
 * 1 点のラベル。R [kpc]・v [km/s]・dv = v′ [km s⁻¹ kpc⁻¹]・cov = [[σ_v², c], [c, σ_v′²]](省略で誤差は null)。戻り値の率は km s⁻¹ kpc⁻¹。
 * κ_epi² < 0 なら kappaEpi・OmMinusHalfK・OmPlusHalfK は null(0 で埋めない)。
 */
export function labelsOf({ R, v, dv, cov }) {
  if (!(isFin(R) && R > 0 && isFin(v) && isFin(dv))) throw new RangeError('labelsOf: R > 0・v・dv は有限の数');
  const Om = v / R, A = 0.5 * (v / R - dv), B = -0.5 * (v / R + dv), k2 = -4 * Om * B, k = k2 >= 0 ? Math.sqrt(k2) : null;
  const out = { R, v, dv, Omega: Om, A_O: A, B_O: B, kappaEpi2: k2, kappaEpi: k, OmMinusHalfK: k === null ? null : Om - 0.5 * k, OmPlusHalfK: k === null ? null : Om + 0.5 * k, sigma: null };
  if (cov) {
    const C = cov, q = (g) => Math.sqrt(Math.max(0, g[0] * g[0] * C[0][0] + 2 * g[0] * g[1] * C[0][1] + g[1] * g[1] * C[1][1]));
    const gk2 = [2 * (2 * v / (R * R) + dv / R), 2 * v / R], gk = k ? [gk2[0] / (2 * k), gk2[1] / (2 * k)] : null;
    out.sigma = { v: Math.sqrt(C[0][0]), dv: Math.sqrt(C[1][1]), Omega: q([1 / R, 0]), A_O: q([0.5 / R, -0.5]), B_O: q([-0.5 / R, -0.5]), kappaEpi: gk ? q(gk) : null,
      OmMinusHalfK: gk ? q([1 / R - 0.5 * gk[0], -0.5 * gk[1]]) : null, OmPlusHalfK: gk ? q([1 / R + 0.5 * gk[0], 0.5 * gk[1]]) : null };
  }
  return out;
}
/** 不等間隔の 3 点の中心差分(両端は null)。戻り値 { v, dv, cov, weights } —— v は測った点の値(共分散は重みの線形の伝播・点の誤差を独立と置く) */
export function derivCentral(rows, i) {
  if (i <= 0 || i >= rows.length - 1) return null;
  const a = rows[i - 1], b = rows[i], c = rows[i + 1], h1 = b.R - a.R, h2 = c.R - b.R;
  if (!(h1 > 0 && h2 > 0)) return null;
  const w = [-h2 / (h1 * (h1 + h2)), (h2 - h1) / (h1 * h2), h1 / (h2 * (h1 + h2))], s = [a.sigma, b.sigma, c.sigma];
  const dv = w[0] * a.v + w[1] * b.v + w[2] * c.v, has = s.every(isFin);
  const cov = has ? [[s[1] * s[1], w[1] * s[1] * s[1]], [w[1] * s[1] * s[1], w.reduce((t, x, k) => t + x * x * s[k] * s[k], 0)]] : null;
  return { v: b.v, dv, cov, weights: w, kind: 'centralDiff' };
}
/** 重みつきの局所の二次の当てはめ(窓 ±hw 点・重み 1/σ²)。v(R_i) と v′(R_i) とその共分散((XᵀWX)⁻¹ の左上 2×2)。窓の中が 4 点未満か σ の欠測は null */
export function derivLocalQuad(rows, i, hw = DECL.localQuadHalfWidth) {
  const lo = Math.max(0, i - hw), hi = Math.min(rows.length - 1, i + hw), pts = rows.slice(lo, hi + 1);
  if (pts.length < 4 || !pts.every((p) => isFin(p.sigma) && p.sigma > 0)) return null;
  const R0 = rows[i].R, M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], y = [0, 0, 0];
  for (const p of pts) { const x = [1, p.R - R0, (p.R - R0) * (p.R - R0)], w = 1 / (p.sigma * p.sigma); for (let a = 0; a < 3; a++) { y[a] += w * x[a] * p.v; for (let b = 0; b < 3; b++) M[a][b] += w * x[a] * x[b]; } }
  const inv = inv3(M); if (!inv) return null;
  const c = [0, 1, 2].map((a) => inv[a][0] * y[0] + inv[a][1] * y[1] + inv[a][2] * y[2]);
  return { v: c[0], dv: c[1], cov: [[inv[0][0], inv[0][1]], [inv[1][0], inv[1][1]]], window: [lo, hi], kind: 'localQuad' };
}
function inv3(m) {
  const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, k] = m[2], A = e * k - f * h, B = -(d * k - f * g), C = d * h - e * g, det = a * A + b * B + c * C;
  if (!(Math.abs(det) > 0) || !Number.isFinite(det)) return null;
  return [[A / det, -(b * k - c * h) / det, (b * f - c * e) / det], [B / det, (a * k - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
}
/** 表(rows: [{ R [kpc], v [km/s], sigma [km/s] }] —— R の昇順)のラベル。微分の型は DECL.derivTypes から。決まらない行は labels: null と理由 */
export function labelsTable(rows, kind) {
  if (!DECL.derivTypes.includes(kind)) throw new RangeError('labelsTable: 微分の型は ' + DECL.derivTypes.join('・'));
  if (!(Array.isArray(rows) && rows.every((r, i) => isFin(r.R) && isFin(r.v) && (i === 0 || r.R > rows[i - 1].R)))) throw new RangeError('labelsTable: R の昇順の有限の表');
  return rows.map((r, i) => {
    const d = kind === 'centralDiff' ? derivCentral(rows, i) : derivLocalQuad(rows, i);
    if (!d) return { R: r.R, labels: null, why: kind === 'centralDiff' ? '端の点(中心差分が無い)' : '窓の点が 4 未満か σ の欠測' };
    return { R: r.R, labels: labelsOf({ R: r.R, v: d.v, dv: d.dv, cov: d.cov }), deriv: kind };
  });
}
/** べき v = v0 (R/R0)^n の解析の微分でラベル(恒等式の試験) */
export function powerLawLabels({ v0, R0, n, R }) { const v = v0 * Math.pow(R / R0, n); return labelsOf({ R, v, dv: n * v / R }); }

/* ───────── 物質線の反例(参考の直し 1)───────── */
/** 円軌道の上の微小な初期の動径の物質線の慣性系の向き φ(t) = Ωt + atan2((n − 1)Ωt, 1)(連続の角 —— atan2 の第 2 引数が正なので枝は跨がない) */
export const materialLineAngle = (n, Omega, t) => Omega * t + Math.atan2((n - 1) * Omega * t, 1);
/** 2 点の追跡(R と R(1 + ε) の円軌道 v ∝ R^n)の結ぶ向きの連続の角 —— 公式と別の経路。steps 刻みで unwrap */
export function materialLineTrack({ n, R = 1, Omega = 1, eps = 1e-7, turns = 1, steps = 4096 }) {
  const Om2 = Omega * Math.pow(1 + eps, n - 1), T = turns * 2 * Math.PI / Omega;
  let prev = 0, acc = 0;
  for (let k = 1; k <= steps; k++) {
    const t = T * k / steps, x1 = R * Math.cos(Omega * t), y1 = R * Math.sin(Omega * t), R2 = R * (1 + eps), x2 = R2 * Math.cos(Om2 * t), y2 = R2 * Math.sin(Om2 * t);
    const a = Math.atan2(y2 - y1, x2 - x1); let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc += d; prev = a;
  }
  return acc;
}

/* ───────── ラベルの口(AN570 の B の限定)───────── */
export const PORT_KEYS = Object.freeze(['mode', 'A_O', 'B_O', 'Omega', 'kappaEpi', 'OmegaP', 'at', 'unit', 'source', 'note']);
const PORT_NULL = () => ({ mode: null, A_O: null, B_O: null, Omega: null, kappaEpi: null, OmegaP: null, at: null, unit: 'km/s/kpc', source: null,
  note: '宣言が無い —— 全部 null(0 で埋めない)。Ω_p は m = 2 の内側 Lindblad 共鳴の条件の値(その半径だけ —— 全半径の同じパターン速度ではない)' });
/**
 * 銀河の本の回転のラベルの口。decl が無ければ全部 null。
 *   { mode: 'flatIdentity', v0, RKpc, source } —— 平坦な回転の恒等式(A_O = −B_O = Ω/2・κ_epi = √2Ω・Ω_p = Ω − κ_epi/2)
 *   { mode: 'oort', A_O, B_O, RKpc, source } —— 宣言した A_O・B_O から Ω = A_O − B_O・κ_epi = √(−4ΩB_O)(κ_epi² < 0 は拒否)
 * source は必須(出典の文字列)。場の API の半渦度(mode 'halfCurl' や source に半渦度を名指すもの)は拒否 —— Ω_field にも Ω にも写さない。
 */
export function galaxyLabelPort(decl) {
  if (decl === undefined || decl === null) return PORT_NULL();
  if (!isObj(decl)) throw new RangeError('galaxyLabelPort: 宣言は object');
  for (const k of Object.keys(decl)) if (!['mode', 'v0', 'RKpc', 'A_O', 'B_O', 'source'].includes(k)) throw new RangeError('galaxyLabelPort: 知らない鍵 ' + k);
  if (!(typeof decl.source === 'string' && decl.source.length > 0)) throw new RangeError('galaxyLabelPort: 値を置くなら出典 source が要る');
  if (/halfCurl|半渦度/.test(decl.source) || decl.mode === 'halfCurl') throw new RangeError('galaxyLabelPort: 場の API の半渦度は回転のラベルに写さない(AN570)');
  if (!(isFin(decl.RKpc) && decl.RKpc > 0)) throw new RangeError('galaxyLabelPort: 半径 RKpc > 0 が要る(ラベルはその半径の値)');
  let A, B;
  if (decl.mode === 'flatIdentity') { if (!(isFin(decl.v0) && decl.v0 > 0)) throw new RangeError('galaxyLabelPort: v0 > 0'); const Om = decl.v0 / decl.RKpc; A = Om / 2; B = -Om / 2; }
  else if (decl.mode === 'oort') { if (!(isFin(decl.A_O) && isFin(decl.B_O))) throw new RangeError('galaxyLabelPort: A_O・B_O は有限の数'); A = decl.A_O; B = decl.B_O; }
  else throw new RangeError('galaxyLabelPort: mode は flatIdentity か oort');
  const Om = A - B, k2 = -4 * Om * B;
  if (!(k2 >= 0)) throw new RangeError('galaxyLabelPort: κ_epi² < 0(ほぼ円の軌道の写像の外)');
  const k = Math.sqrt(k2);
  return { mode: decl.mode, A_O: A, B_O: B, Omega: Om, kappaEpi: k, OmegaP: Om - k / 2, at: { RKpc: decl.RKpc }, unit: 'km/s/kpc', source: decl.source,
    note: 'ラベル(宣言の値 —— 既存の理論の写像)。κ_epi は周転円の振動数で κ_D とは別・Ω_p は m = 2 の内側 Lindblad 共鳴の条件の値(この半径だけ)' };
}
/** g_T と Ω_field のランク(AN570 —— 同じ局所の腕の角速度を受ける天体 i の行 J_i = c_i[Ω_arm − Ω_field, −g_T] は互いに比例 —— ランク 1)。rankOf は第326便d の lib の関数を渡す */
export function rankOneRows({ cs, gT, OmegaArm, OmegaField }, rankOf) {
  const J = cs.map((c) => [c * (OmegaArm - OmegaField), -c * gT]);
  const r = rankOf(J);
  return { rows: J, rank: r.rank, unknowns: 2, sv: r.sv };
}

/* ───────── 寄与の度合い(rotmod の基準列)───────── */
/** v_bar² [km²/s²](V|V| で足す —— 負の寄与の符号を保つ) */
export const vbar2Of = (r, Yd = DECL.upsilonDisk, Yb = DECL.upsilonBul) => r.Vgas * Math.abs(r.Vgas) + Yd * r.Vdisk * Math.abs(r.Vdisk) + Yb * r.Vbul * Math.abs(r.Vbul);
/** 距離の倍率 f = D/D0: 半径 ∝ f・バリオンの速さの二乗 ∝ f(質量 ∝ f²・半径 ∝ f)・観測の速さと誤差は不変(傾斜の補正済み) */
export function scaleDistance(r, f) { const s = Math.sqrt(f); return Object.assign({}, r, { R: r.R * f, Vgas: r.Vgas * s, Vdisk: r.Vdisk * s, Vbul: r.Vbul * s }); }
/** 足りない分 Δ = v_obs² − v_bar² と誤差 2 v_obs e_v(バリオンの分解の誤差は rotmod に無い —— 数えない宣言) */
export function deficitOf(r, Yd, Yb) { const vb2 = vbar2Of(r, Yd, Yb); return { R: r.R, vobs2: r.Vobs * r.Vobs, vbar2: vb2, deficit: r.Vobs * r.Vobs - vb2, sigma: 2 * r.Vobs * r.errV }; }
/** 箱(edges [kpc] —— 左閉じ右開き)ごとの観測の足りない分の平均と誤差(点の誤差を独立と置く宣言 —— e_v は傾斜の系統を含まない・独立の正規の全誤差と見なさない) */
export function binDeficit(rows, edges, { Yd, Yb, f = 1, kSigma = DECL.kSigma } = {}) {
  const D = rows.map((r) => deficitOf(scaleDistance(r, f), Yd, Yb));
  return edges.slice(0, -1).map((lo, b) => {
    const hi = edges[b + 1], s = D.filter((q) => q.R >= lo && q.R < hi);
    if (!s.length) return { lo, hi, n: 0, RMean: null, deficit: null, sigma: null, significant: null, vobs2: null, vbar2: null };
    const m = s.length, mean = (k) => s.reduce((t, q) => t + q[k], 0) / m, sig = Math.sqrt(s.reduce((t, q) => t + q.sigma * q.sigma, 0)) / m, d = mean('deficit');
    return { lo, hi, n: m, RMean: mean('R'), deficit: d, sigma: sig, significant: d > kSigma * sig, vobs2: mean('vobs2'), vbar2: mean('vbar2') };
  });
}
/**
 * DFM の OFF/ON の差の加速度の箱の集計。parts: [{ rKpc, ain, at, m }](ain は内向きを正・at は +ĝ 回りの接線 —— 単位は器が宣言した SI の倍率 accSI [m/s² / 単位])。
 * Δv² = R a_in は箱の粒子の平均(SE は標本の SD/√n)と km²/s² の換算(lenSI [m/単位 kpc を通す])。円軌道の釣り合いで読めない箱(|⟨a_in⟩| < 比 × ⟨|a_t|⟩)は dv2 を null(記録 —— それ自体が結果)。
 */
export function binDfm(parts, edges, { accSI, ratio = DECL.radialOverTangential, minN = DECL.minParticles } = {}) {
  if (!(isFin(accSI) && accSI > 0)) throw new RangeError('binDfm: accSI');
  return edges.slice(0, -1).map((lo, b) => {
    const hi = edges[b + 1], s = parts.filter((q) => q.rKpc >= lo && q.rKpc < hi), n = s.length;
    if (n < minN) return { lo, hi, n, ain: null, at: null, atAbs: null, ratioInT: null, readable: null, dv2: null, dv2SE: null, dv2Raw: null, torque: null, why: '粒子の数が下限 ' + minN + ' 未満' };
    const mean = (f) => s.reduce((t, q) => t + f(q), 0) / n;
    const ain = mean((q) => q.ain), at = mean((q) => q.at), atAbs = mean((q) => Math.abs(q.at));
    const dv = s.map((q) => q.rKpc * KPC_M * q.ain * accSI / 1e6), dm = dv.reduce((t, x) => t + x, 0) / n, sd = n > 1 ? Math.sqrt(dv.reduce((t, x) => t + (x - dm) * (x - dm), 0) / (n - 1)) : null;
    const torque = s.reduce((t, q) => t + q.m * q.rKpc * KPC_M * q.at * accSI, 0);   // Σ m r a_t(器の質量の単位 × m²/s²)
    const ratioInT = atAbs > 0 ? Math.abs(ain) / atAbs : Infinity, readable = ratioInT >= ratio;
    return { lo, hi, n, RMean: mean((q) => q.rKpc), ain, at, atAbs, ratioInT, readable, dv2: readable ? dm : null, dv2SE: readable && sd !== null ? sd / Math.sqrt(n) : null, dv2Raw: dm, torque,
      why: readable ? null : '接線の成分が内向きの 1/' + ratio + ' を超える —— Δv² の換算を使わない' };
  });
}
/** η = Δv²_DFM/Δ_obs(分母が有意に正の箱だけ —— 負や 1 超を丸めない)。Δv² が null(読めない箱)なら η も null と理由 */
export function etaOf(dfmBin, obsBin) {
  if (!obsBin || obsBin.deficit === null) return { eta: null, why: '観測の点が箱に無い' };
  if (!obsBin.significant) return { eta: null, why: '分母が有意に正でない(' + DECL.kSigma + 'σ 以下か負)' };
  if (!dfmBin || dfmBin.dv2 === null) return { eta: null, why: dfmBin && dfmBin.why ? dfmBin.why : 'DFM の箱が空' };
  const e = dfmBin.dv2 / obsBin.deficit, se = dfmBin.dv2SE === null ? null : Math.sqrt(Math.pow(dfmBin.dv2SE / obsBin.deficit, 2) + Math.pow(e * obsBin.sigma / obsBin.deficit, 2));
  return { eta: e, sigma: se, over1: e > 1, negative: e < 0, why: null };
}
/** 等価の質量 M_eq = R Δv²/G [M☉](球の対称の力に換算した量 —— 円盤の中の実質量の同定ではない) */
export const meqOf = (RKpc, dv2Kms2) => (dv2Kms2 === null || !isFin(dv2Kms2) ? null : RKpc * KPC_M * dv2Kms2 * 1e6 / G_SI / MSUN_KG);

/* ───────── 純関数の場面(QA lint.galRot329b と器の P 段)───────── */
export function pureScenes() {
  const S = {}, close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  // ① 恒等式(平坦・剛体・ケプラー)
  { const f = [1, 2, 4].map((R) => powerLawLabels({ v0: 1, R0: 1, n: 0, R })), r = powerLawLabels({ v0: 2, R0: 1, n: 1, R: 3 }), kp = powerLawLabels({ v0: 1, R0: 1, n: -0.5, R: 2 });
    S.flat = { AeqMinusB: f.every((q) => close(q.A_O, -q.B_O) && close(q.A_O, q.Omega / 2)), kappaSqrt2: f.every((q) => close(q.kappaEpi, Math.SQRT2 * q.Omega)),
      omMinus: f.map((q) => q.OmMinusHalfK), omMinusFormula: f.map((q) => (1 - 1 / Math.SQRT2) / q.R), omMinusTimesR: f.map((q) => q.OmMinusHalfK * q.R) };
    S.rigid = { A: r.A_O, B: r.B_O, Om: r.Omega, k: r.kappaEpi, omMinus: r.OmMinusHalfK };
    S.kepler = { kOverOm: kp.kappaEpi / kp.Omega, AoverOm: kp.A_O / kp.Omega, BoverOm: kp.B_O / kp.Omega }; }
  // ② 物質線の反例(n = −1 の 1 公転・初めの回転率・2 点の追跡と照合)と平坦(n = 0)
  { const one = materialLineAngle(-1, 1, 2 * Math.PI), tr = materialLineTrack({ n: -1 }), h = 1e-6, rate0 = (materialLineAngle(-1, 1, h) - materialLineAngle(-1, 1, 0)) / h;
    S.line = { angle: one, minus2pi: -2 * Math.PI, track: tr, trackRel: Math.abs(tr - one) / one, rate0, flatOne: materialLineAngle(0, 1, 2 * Math.PI), rigidOne: materialLineAngle(1, 1, 2 * Math.PI) }; }
  // ③ 微分の型(平坦の表 —— 中心差分は v′ = 0 で厳密・端は null / ケプラーの表 —— 型ごとの打ち切りの誤差を記録)
  { const flatRows = [1, 1.5, 2.5, 3, 4.2].map((R) => ({ R, v: 150, sigma: 2 })), C = labelsTable(flatRows, 'centralDiff'), Q = labelsTable(flatRows, 'localQuad');
    const kr = [1, 1.3, 1.7, 2.2, 2.8, 3.5, 4.4].map((R) => ({ R, v: 100 / Math.sqrt(R), sigma: 1 })), kC = labelsTable(kr, 'centralDiff'), kQ = labelsTable(kr, 'localQuad'), i = 3, ex = powerLawLabels({ v0: 100, R0: 1, n: -0.5, R: kr[i].R });
    S.deriv = { flatEnds: [C[0].labels, C[C.length - 1].labels], flatDv: C.slice(1, -1).map((q) => q.labels.dv), flatAeqMinusB: C.slice(1, -1).every((q) => close(q.labels.A_O, -q.labels.B_O)),
      quadFlatDv: Q.filter((q) => q.labels).map((q) => Math.abs(q.labels.dv)), keplerErrC: Math.abs(kC[i].labels.kappaEpi - ex.kappaEpi) / ex.kappaEpi, keplerErrQ: Math.abs(kQ[i].labels.kappaEpi - ex.kappaEpi) / ex.kappaEpi,
      sigmaFinite: C.slice(1, -1).every((q) => q.labels.sigma && Number.isFinite(q.labels.sigma.kappaEpi)) }; }
  // ④ κ_epi² < 0 は null(v′ < −v/R)
  { const L = labelsOf({ R: 2, v: 100, dv: -80 }); S.negK2 = { k2: L.kappaEpi2, k: L.kappaEpi, om: L.OmMinusHalfK }; }
  // ⑤ ラベルの口(宣言なしは全部 null・平坦の恒等式・オールト・拒否 —— 半渦度・出典なし・知らない鍵・κ_epi² < 0)
  { const P0 = galaxyLabelPort(), P1 = galaxyLabelPort({ mode: 'flatIdentity', v0: 150, RKpc: 20, source: 'test' }), P2 = galaxyLabelPort({ mode: 'oort', A_O: 15, B_O: -12, RKpc: 8, source: 'test' });
    const bad = [{ mode: 'halfCurl', v0: 1, RKpc: 1, source: 'x' }, { mode: 'flatIdentity', v0: 1, RKpc: 1, source: 'API の半渦度' }, { mode: 'flatIdentity', v0: 1, RKpc: 1 }, { mode: 'flatIdentity', v0: 1, RKpc: 1, source: 'x', omega: 1 },
      { mode: 'oort', A_O: 5, B_O: 1, RKpc: 1, source: 'x' }, { mode: 'flatIdentity', v0: 1, source: 'x' }];
    S.port = { nullAll: PORT_KEYS.filter((k) => !['unit', 'note'].includes(k)).every((k) => P0[k] === null), keys: Object.keys(P0), flat: P1, oort: P2,
      reject: bad.map((d) => { try { galaxyLabelPort(d); return false; } catch (e) { return e instanceof RangeError; } }) }; }
  // ⑥ 基準列(V|V| の符号・Υ・距離の倍率)と η・M_eq(負や 1 超を丸めない・分母が有意でない箱は null)
  { const r = { R: 10, Vobs: 150, errV: 2, Vgas: -10, Vdisk: 100, Vbul: 0 }, d = deficitOf(r, 0.5, 0.7), d2 = deficitOf(scaleDistance(r, 2), 0.5, 0.7);
    const obs = [{ lo: 0, hi: 1, n: 1, deficit: 100, sigma: 10, significant: true }, { lo: 1, hi: 2, n: 1, deficit: 15, sigma: 10, significant: false }];
    const e1 = etaOf({ dv2: 150, dv2SE: 0 }, obs[0]), e2 = etaOf({ dv2: -20, dv2SE: 0 }, obs[0]), e3 = etaOf({ dv2: 5, dv2SE: 0 }, obs[1]), e4 = etaOf({ dv2: null, why: 'w' }, obs[0]);
    S.base = { vbar2: d.vbar2, deficit: d.deficit, sigma: d.sigma, scaledVbar2: d2.vbar2, scaledR: scaleDistance(r, 2).R, eta: [e1.eta, e2.eta, e3.eta, e4.eta], over1: e1.over1, neg: e2.negative, meq: meqOf(1, 1) }; }
  // ⑦ 箱の集計(内向きが支配 → Δv² あり / 接線が支配 → null と理由 / 粒子が少ない → null)
  { const mk = (ain, at, n, r0) => Array.from({ length: n }, (_, k) => ({ rKpc: r0 + 0.01 * k, ain, at: k % 2 ? at : -at, m: 1 }));
    const B = binDfm(mk(2, 0.1, 5, 1).concat(mk(1, 3, 5, 3), mk(1, 0, 2, 5)), [0, 2, 4, 6], { accSI: 1e-11 });
    S.bins = { dv2: B.map((q) => q.dv2), readable: B.map((q) => q.readable), n: B.map((q) => q.n), why: B.map((q) => q.why) }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    flatIdentity: S.flat.AeqMinusB && S.flat.kappaSqrt2 && S.flat.omMinus.every((x, i) => close(x, S.flat.omMinusFormula[i])) && close(S.flat.omMinus[0], 0.2928932188134524) && close(S.flat.omMinus[1], 0.1464466094067262)
      && close(S.flat.omMinus[2], 0.0732233047033631) && S.flat.omMinusTimesR.every((x) => close(x, S.flat.omMinusTimesR[0])),
    rigidKepler: close(S.rigid.A, 0, 1e-300) && close(S.rigid.B, -S.rigid.Om) && close(S.rigid.k, 2 * S.rigid.Om) && Math.abs(S.rigid.omMinus) <= 1e-15 && close(S.kepler.kOverOm, 1) && close(S.kepler.AoverOm, 0.75) && close(S.kepler.BoverOm, -0.25),
    materialLine: close(S.line.angle, 2 * Math.PI - Math.atan(4 * Math.PI)) && Math.abs(S.line.angle - 4.791799) <= 1e-6 && Math.abs(S.line.angle - S.line.minus2pi) > 10 && S.line.trackRel <= 1e-5 && Math.abs(S.line.rate0 + 1) <= 1e-5
      && close(S.line.flatOne, 2 * Math.PI - Math.atan(2 * Math.PI)) && close(S.line.rigidOne, 2 * Math.PI),
    derivTypes: S.deriv.flatEnds.every((x) => x === null) && S.deriv.flatDv.every((x) => Math.abs(x) <= 1e-12) && S.deriv.flatAeqMinusB && S.deriv.quadFlatDv.every((x) => x <= 1e-9)
      && S.deriv.keplerErrC < 0.05 && S.deriv.keplerErrQ < 0.1 && S.deriv.sigmaFinite,
    negKappa2Null: S.negK2.k2 < 0 && S.negK2.k === null && S.negK2.om === null,
    labelPort: S.port.nullAll && JSON.stringify(S.port.keys) === JSON.stringify(PORT_KEYS) && close(S.port.flat.A_O, -S.port.flat.B_O) && close(S.port.flat.kappaEpi, Math.SQRT2 * S.port.flat.Omega)
      && close(S.port.flat.OmegaP, (1 - 1 / Math.SQRT2) * 150 / 20) && close(S.port.oort.Omega, 27) && close(S.port.oort.kappaEpi, Math.sqrt(4 * 27 * 12)) && S.port.reject.every((x) => x === true),
    baseline: close(S.base.vbar2, -100 + 5000) && close(S.base.deficit, 22500 - 4900) && close(S.base.sigma, 600) && close(S.base.scaledVbar2, 2 * 4900) && S.base.scaledR === 20
      && close(S.base.eta[0], 1.5) && close(S.base.eta[1], -0.2) && S.base.eta[2] === null && S.base.eta[3] === null && S.base.over1 === true && S.base.neg === true && close(S.base.meq, KPC_M * 1e6 / G_SI / MSUN_KG),
    bins: S.bins.readable[0] === true && S.bins.readable[1] === false && S.bins.readable[2] === null && S.bins.dv2[0] !== null && S.bins.dv2[1] === null && S.bins.dv2[2] === null && S.bins.n.join() === '5,5,2'
      && /接線/.test(S.bins.why[1]) && /下限/.test(S.bins.why[2]),
  };
}

// 第274便e(第64報「実在天体に先立ち安定サンプルを用意する」): **観測写像の準備**(純関数)。
//
// 目的は 1 つだけ —— **3D の密度と速度を、観測が実際に見る量へ写す道具を先に作っておく**こと。
//   3D 密度 ρ(x,y,z) → 視線積分 Σ(X,Y) → 表面輝度 I=Σ/Υ(Υ は**宣言**の質量光度比)
//   3D 速度分布 → **視線速度分散 σ_LOS**(視線方向の 2 次モーメント。流れ v_los を含める)
//
// ■ **AE5 の注意(この lib の存在理由)**
//   シミュレータが出す 2D の「速度分散」(面内の |v| のばらつき)を σ_LOS と**直接比較しない**。
//   等方 3D(各軸 σ₁)では **σ_LOS = σ₁ に対し面内の速さの分散は √2·σ₁** で、比は √2 である。
//   `planarVsLOS()` がこの比を数で返す —— 換算を通さずに並べると系統的に √2 ずれる。
//
// この lib はエンジンに接続していない(beta/index.html は 1 度も読まない)。

/** この lib の版。QA `behavior.armBarPure` がこの文字列を見る。 */
export const OBSMAP_VERSION = 'w274e-1';

/** 3 軸独立の正規分布(「掛け算の密度」)。ρ(x,y,z)=M·g(x;σx)·g(y;σy)·g(z;σz)。 */
export function gaussian3D({ M, sx, sy, sz }) {
  const norm = M / (Math.pow(2 * Math.PI, 1.5) * sx * sy * sz);
  return {
    M, sx, sy, sz,
    rho: (x, y, z) => norm * Math.exp(-0.5 * ((x / sx) ** 2 + (y / sy) ** 2 + (z / sz) ** 2)),
  };
}

/** 視線(z)積分の**解析形**: Σ(X,Y)=M/(2π σx σy)·exp(−X²/2σx²−Y²/2σy²)。 */
export function surfaceDensityAnalytic(model, { X, Y }) {
  return model.M / (2 * Math.PI * model.sx * model.sy)
    * Math.exp(-0.5 * ((X / model.sx) ** 2 + (Y / model.sy) ** 2));
}

/** 視線積分の**数値形**(Simpson・±zMax)。解析形との差が写像の検算になる。 */
export function projectSurfaceDensity(model, { X, Y, zMax, n }) {
  const N = 2 * Math.ceil((n || 2000) / 2);
  const zm = zMax || 12 * model.sz;
  const h = 2 * zm / N;
  let s = 0;
  for (let i = 0; i <= N; i++) {
    const z = -zm + h * i;
    const w = (i === 0 || i === N) ? 1 : (i % 2 ? 4 : 2);
    s += w * model.rho(X, Y, z);
  }
  return s * h / 3;
}

/** 表面輝度 I = Σ/Υ。**Υ(質量光度比)は宣言**であって測定ではない。 */
export function surfaceBrightness(Sigma, { upsilon }) {
  return { I: Sigma / upsilon, upsilon, declared: true };
}

/**
 * **視線速度分散** σ_LOS(X,Y): 視線に沿った質量重みの 2 次モーメント。
 *   ⟨v⟩   = ∫ρ·v_z dz / ∫ρ dz
 *   σ_LOS² = ∫ρ·(σ_z(z)² + v_z(z)²) dz / ∫ρ dz − ⟨v⟩²
 * **流れ(回転)の視線成分を落とさない**(落とすと系統的に小さく出る)。
 */
export function sigmaLOS(model, { X, Y, sigmaZ, vZ, zMax, n }) {
  const N = 2 * Math.ceil((n || 2000) / 2);
  const zm = zMax || 12 * model.sz;
  const h = 2 * zm / N;
  let d = 0, m1 = 0, m2 = 0;
  for (let i = 0; i <= N; i++) {
    const z = -zm + h * i;
    const w = (i === 0 || i === N) ? 1 : (i % 2 ? 4 : 2);
    const r = model.rho(X, Y, z);
    const sz = sigmaZ ? sigmaZ(X, Y, z) : 0;
    const vz = vZ ? vZ(X, Y, z) : 0;
    d += w * r; m1 += w * r * vz; m2 += w * r * (sz * sz + vz * vz);
  }
  const mean = m1 / d;
  const var2 = m2 / d - mean * mean;
  return { sigmaLOS: Math.sqrt(Math.max(0, var2)), mean, variance: var2 };
}

/**
 * **AE5 の換算**: 等方 3D(各軸 σ₁)のとき
 *   σ_LOS = σ₁ / 面内の速さの分散 √⟨v_x²+v_y²⟩ = √2·σ₁ / 3D の速さ √3·σ₁。
 * 数値でも確かめる(等方ガウスから決定的な格子でモーメントを取る)。
 */
export function planarVsLOS({ sigma1, n }) {
  const N = n || 400;
  // 決定的な等方サンプル: 3 軸の Gauss–Hermite 的な格子(重み付き)で 2 次モーメントを取る
  const zm = 8 * sigma1, h = 2 * zm / N;
  let d = 0, sxx = 0, sxy = 0, sxyz = 0;
  for (let i = 0; i <= N; i++) {
    const v = -zm + h * i;
    const w = (i === 0 || i === N) ? 0.5 : 1;
    const g = Math.exp(-0.5 * (v / sigma1) ** 2);
    d += w * g; sxx += w * g * v * v;
  }
  const s1sq = sxx / d;                 // = σ₁²(1 軸)
  sxy = 2 * s1sq; sxyz = 3 * s1sq;      // 独立 2 軸 / 3 軸の速さの 2 乗平均
  return {
    sigmaLOS: Math.sqrt(s1sq),
    planarSpeedRMS: Math.sqrt(sxy),
    spaceSpeedRMS: Math.sqrt(sxyz),
    planarOverLOS: Math.sqrt(sxy / s1sq),      // = √2
    spaceOverLOS: Math.sqrt(sxyz / s1sq),      // = √3
  };
}

/**
 * 扁平(回転で潰れた)正規分布を傾き i で見たときの**見かけの軸比**:
 *   q_app = √(cos²i + q²·sin²i)(i=0 で 1 = 正面・i=90° で q = 真横)。
 * 「楕円銀河=ディスクを安定化・横から見ると空間メッシュの回転で楕円」の写像側。
 */
export function apparentAxisRatio({ q, incDeg }) {
  const i = incDeg * Math.PI / 180;
  return Math.sqrt(Math.cos(i) ** 2 + q * q * Math.sin(i) ** 2);
}

export default {
  OBSMAP_VERSION, gaussian3D, surfaceDensityAnalytic, projectSurfaceDensity,
  surfaceBrightness, sigmaLOS, planarVsLOS, apparentAxisRatio,
};

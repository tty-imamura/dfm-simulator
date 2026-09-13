// 第260便d(第52報 W4)「Float32 の最小刻み(ULP)と質量丸めの感度」の**純関数**ライブラリ。
//
// ■ なぜ別ライブラリにするか
//   〔第259便d〕の Float64 診断は器(`tests/exp-w259d-precision.mjs`)の中に直書きされていて、
//   **ブラウザを立てないと 1 つも確かめられなかった**。ULP と質量丸めの感度は**数だけの話**で、
//   ブラウザも fs も要らない —— 切り出して QA から直接呼べるようにする。
//
// ■ この lib が返すものは「診断」であって「誤差上限」でも「Float64 実走の結果」でもない
//   `massRoundingEstimate` が返す σ は、**固定 a の Kepler 感度**
//   (a を宣言値に固定したまま、保持質量 M_held と宣言質量 M_decl の差だけを周期へ写した量)である:
//       P ∝ a^{3/2} / √(GM) → ΔP/P = |√(M_decl/M_held) − 1|
//   これは次の 3 つの**どれでもない**:
//     (a) 誤差の上限 —— 実際の軌道は a も一緒に決まるので、この写像は成り立たない場合がある。
//     (b) Float64 で実走した結果 —— **走らせていない**(走らせれば別の値になりうる)。
//     (c) 離散化誤差 ε_num —— 出どころが違う(〔第259便d〕で桁が 6 つ違うことを実測した)。
//   だから返り値には `isBound:false` / `isMeasured:false` を**必ず**付ける。
//   **「質量を Float64 にすれば精度が足りる」とは書けない**(〔第259便d〕の Negative Claim 18)。

// Float32 の最小刻み(隣接ビットまでの距離)。**値そのものから求める**(1e−8 から倍々に探す
// ような当て推量ではなく、仮数部の最下位ビットを 1 増やして差を取る)。
//   ・x が Float32 で表せない場合は `Math.fround(x)` の刻みを返す(丸めた先の刻みである)。
//   ・±Infinity / NaN は null。0 は非正規化数の最小刻み(2^−149)。
export function float32Ulp(x) {
  const v = Math.fround(Number(x));
  if (!Number.isFinite(v)) return null;
  const buf = new ArrayBuffer(4);
  const f = new Float32Array(buf), u = new Uint32Array(buf);
  f[0] = Math.abs(v);
  const bits = u[0];
  if (bits === 0x7f7fffff) return null;          // Float32 の最大値の隣は Infinity
  u[0] = bits + 1;                                // 仮数部 +1 ビット(指数の繰り上がりも自然に入る)
  return f[0] - Math.abs(v);
}

// 宣言値と保持値(Float32 に丸めた値)の相対差。保持値を渡さなければ fround(宣言値)を使う。
export function froundRelDiff(declared, held) {
  const d = Number(declared);
  const h = (held === undefined || held === null) ? Math.fround(d) : Number(held);
  if (!Number.isFinite(d) || !Number.isFinite(h) || d === 0) return null;
  return (h - d) / d;
}

// 固定 a の Kepler 感度。**診断であって誤差上限ではない**。
//   declaredMasses: プリセット JSON の m(Float64 のまま)
//   heldMasses:     実行時に保持されている m(既定では fround(宣言値))
//   obsPeriodSec / sigmaSec: 観測の周期と σ(σ が無ければ nSigma は null)
export function massRoundingEstimate(declaredMasses, heldMasses, obsPeriodSec, sigmaSec) {
  const decl = (declaredMasses || []).map(Number);
  const held = (heldMasses && heldMasses.length === decl.length)
    ? heldMasses.map(Number) : decl.map((z) => Math.fround(z));
  if (!decl.length || !decl.every(Number.isFinite) || !held.every(Number.isFinite)) {
    return { ok: false, reason: '質量が数でない', isBound: false, isMeasured: false };
  }
  const Mdecl = decl.reduce((a, b) => a + b, 0);
  const Mheld = held.reduce((a, b) => a + b, 0);
  if (!(Mdecl > 0) || !(Mheld > 0)) return { ok: false, reason: '総質量が正でない', isBound: false, isMeasured: false };
  const relMass = (Mheld - Mdecl) / Mdecl;
  // 固定 a の Kepler 感度(1 次近似の |relMass|/2 ではなく、**厳密な比**で書く)
  const relPeriod = Math.sqrt(Mdecl / Mheld) - 1;
  const dP = Number.isFinite(obsPeriodSec) ? relPeriod * obsPeriodSec : null;
  const nSigma = (dP !== null && Number.isFinite(sigmaSec) && sigmaSec > 0) ? Math.abs(dP) / sigmaSec : null;
  return {
    ok: true,
    massDeclaredSum: Mdecl, massHeldSum: Mheld,
    relMassError: relMass, relPeriodError: relPeriod,
    periodErrorSec: dP, nSigma,
    ulp32: decl.map((z) => float32Ulp(z)),
    ulpRel: decl.map((z) => { const u = float32Ulp(z); return (u !== null && z !== 0) ? u / Math.abs(z) : null; }),
    heldIsFround: decl.every((z, i) => held[i] === Math.fround(z)),
    // ---- 宣言(この 3 行を外して数字だけを引用しない)----
    isBound: false,      // **誤差の上限ではない**(a を固定した写像である)
    isMeasured: false,   // **Float64 で実走した結果ではない**(走らせていない)
    model: 'fixed-a Kepler: ΔP/P = √(M_decl/M_held) − 1',
    note: '**診断である。** 固定 a の Kepler 感度で、(a) 誤差上限でも (b) Float64 実走の結果でも '
      + '(c) 離散化誤差 ε_num でもない。ε_num とは出どころが違う —— 桁を比べるためだけに使う。',
  };
}

// 〔第259便d〕までの器が使っていた「1e−8 から倍々に探す」やり方との突き合わせ(再現の自己点検)。
// 探索版は**開始値しだいで刻みの整数倍を返しうる**ので、ビット版と一致するかを確かめる。
export function ulpSearchLegacy(x) {
  const z = Number(x);
  if (!Number.isFinite(z) || z === 0) return null;
  const f = Math.fround;
  let u = Math.abs(z) * 1e-8;
  let guard = 0;
  while (f(z + u) === f(z) && guard++ < 2000) u *= 2;
  return u;
}

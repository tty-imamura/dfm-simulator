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

// =====================================================================================
// 第261便c(第53報 W3)「近点抽出器の位相制限」—— **純関数**の近点検出器。
//
// ■ なぜ足すか(統括が設定した検証仮説 (C))
//   〔第248便a〕以来の近点抽出は「相対動径速度 ṙ の符号が − → + へ変わった步」を**無条件に**
//   近点として採る。粗い刻みでは ṙ が近点の近傍で数値的に符号を往復するので、**同じ 1 回の近点が
//   複数回検出される**(🩺 psrJ1946DFM・h=0.016 で連続する步に何度も立つ)。
//   検出数が窓を埋めてしまうため、器は `measured:true` のまま**無効な周期**(1 公転に満たない
//   区間の平均)を出す。**これは精度の問題ではなく抽出器の欠陥である。**
//
// ■ 何を変えるか
//   前の**採用**近点からの**累積公転位相**(相対位置ベクトルの方位角の増分の絶対値の和)が
//   `phaseGate`(既定 1.5π)を超えるまで、次の候補を採らない。
//   **観測周期は閾値に入れない**(観測値を抽出器へ入れると、合否が観測に依存してしまう)。
//   1.5π は「1 公転 = 2π の手前」という**幾何の宣言**であって、系ごとに合わせるノブではない。
//
// ■ 何を変えないか
//   採用した近点の**時刻と方位の作り方**(ṙ の線形内挿・方位の内挿)は 1 行も変えていない。
//   `mode:'legacy'` で旧法(無条件採用)へ戻せる —— 旧法と新法の差を**同じ器で**測るためである。
//
// ■ unwrap 失敗は measured:false にする(0 とは書かない・旧器は break して黙って窓を短くした)
//   隣り合う近点方位の差が π/2 を超えたら unwrap 失敗とし、`unwrapFailed:true` ・ `measured:false`
//   を立てる。**「測れなかった」と「測ったら 0 だった」を混ぜない。**
export const PERI_PHASE_GATE_DEFAULT = 1.5 * Math.PI;
export const PERI_METHOD_PHASE = 'radial-crossing/orbit-phase-1.5pi-v1';
export const PERI_METHOD_LEGACY = 'radial-crossing/legacy-v0';
export const PERI_UNWRAP_JUMP = Math.PI / 2;

// 検出器(逐次)。`push` は 1 步ごとに呼ぶ。**この関数の中に観測値は 1 つも無い。**
//   opts = { mode:'phase'|'legacy', phaseGate, maxCount, unwrapJump }
export function createPeriastronDetector(opts) {
  const o = opts || {};
  const mode = (o.mode === 'legacy') ? 'legacy' : 'phase';
  const phaseGate = Number.isFinite(o.phaseGate) ? Number(o.phaseGate) : PERI_PHASE_GATE_DEFAULT;
  const maxCount = Number.isFinite(o.maxCount) ? Number(o.maxCount) : Infinity;
  const unwrapJump = Number.isFinite(o.unwrapJump) ? Number(o.unwrapJump) : PERI_UNWRAP_JUMP;
  const peri = [];            // 採用した近点 {k, ang, r, phaseSincePrev}
  const rejected = [];        // 位相制限で**採らなかった**候補 {k, phaseSincePrev}
  let have = false, rd1 = 0, th1 = 0;
  let phase = 0;              // 前の採用近点からの累積公転位相
  let candidates = 0, unwrapFailed = false;
  const wrap = (z) => { while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; return z; };
  return {
    mode, phaseGate, unwrapJump,
    // k は步番号(または任意の単調な横軸)。rd = ṙ、th = 相対位置の方位角。
    push(k, r, rd, th) {
      if (have) phase += Math.abs(wrap(th - th1));
      let accepted = false;
      if (have && rd1 < 0 && rd >= 0) {
        candidates++;
        const gateOpen = (mode === 'legacy') || (peri.length === 0) || (phase > phaseGate);
        if (gateOpen) {
          const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
          let a1 = th1, a2 = th;
          while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI;
          while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          peri.push({ k: k - 1 + fr, ang: a1 + fr * (a2 - a1), r, phaseSincePrev: phase });
          phase = 0;
          accepted = true;
        } else rejected.push({ k: k - 1, phaseSincePrev: phase });
      }
      rd1 = rd; th1 = th; have = true;
      return { accepted, full: peri.length >= maxCount };
    },
    // 窓(先頭 window 個)の集計。**window を満たしていなければ measured:false** である。
    result(window) {
      const w = Number.isFinite(window) ? Number(window) : peri.length;
      const n = peri.length;
      const ang = []; let jump = 0;
      for (let i = 0; i < n; i++) {
        let a = peri[i].ang;
        if (i) {
          const z = wrap(a - ang[i - 1]);
          if (Math.abs(z) > unwrapJump) { jump++; break; }
          a = ang[i - 1] + z;
        }
        ang.push(a);
      }
      if (jump > 0) unwrapFailed = true;
      const measured = (n >= w) && !unwrapFailed;
      return {
        peri, ang, nPeri: n, window: w, measured,
        unwrapFailed, jump,
        candidates, acceptedCount: n, rejectedCount: rejected.length, rejected,
        mode, phaseGate,
        measurementMethod: (mode === 'legacy') ? PERI_METHOD_LEGACY : PERI_METHOD_PHASE,
        note: (mode === 'legacy')
          ? '**旧法**: ṙ の符号反転を無条件に近点として採る(粗い刻みで同じ近点を複数回拾う)。'
          : '**位相制限**: 前の採用近点からの累積公転位相が ' + phaseGate.toFixed(6)
            + ' rad を超えるまで次の候補を採らない。**観測周期は閾値に入れていない。**',
      };
    },
  };
}

// 逐次でない入口(合成データの単体試験用)。samples = [{k,r,rd,th}]。
export function extractPeriastra(samples, opts) {
  const d = createPeriastronDetector(opts);
  for (const s of (samples || [])) d.push(s.k, s.r, s.rd, s.th);
  return d.result((opts && opts.window) || undefined);
}

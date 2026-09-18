// 第272便b(第62報「カロン」「引きずり」)— **連星の状態 → 引きずり係数の候補 3 本**(純関数)。
//
// ■ 何であって、何でないか
//   ・原仮定者の仮説(第62報)「互いに潮汐ロックしている天体は kFrame≈0 とみなせる」「連星の状態が
//     引きずりに有意に影響する計算式を提案する」を、**測れる形の候補式**として書いたものである。
//   ・**法則ではない**。エンジンの力学へは 1 バイトも接続していない(内蔵プリセットの kFrame は
//     QA `preset.kframe-binary01` で {0,1} に固定されたままで、本便は 1 bit も変えていない)。
//   ・**ロック検出器ではない**。「この系は潮汐ロックしている/していない」を判定する道具として
//     使ってはならない —— 3 本とも、宣言された初期条件から作る**無次元の係数**を返すだけである。
//   ・値が一致しても「合った」とは言わない。次数が立ち・残差が観測 σ の 3 倍に入り・独立な
//     観測量を予測できたときにだけ、結論の語を使う(本便ではどれも満たしていない)。
//
// ■ 運動学(第62報の 2 天体思考実験の分解)
//     r = x_B − x_A ・ v = v_B − v_A ・ n = r/|r|
//     H_AB = (r·v)/r²          … 拡縮(メッシュが伸び縮みする成分)
//     Ω_AB = (r×v)/r²          … 回転(メッシュが相手を中心に回る成分。2D では z 成分のスカラー)
//     ω_dyn² = G(m_A+m_B)/r³   … その分離での力学レート(円軌道では Ω_AB=ω_dyn)
//
// ■ 2D の制約(面外は宣言だけ)
//   第62報の「コンパクト連星の自転軸は互いを向いている」は、2D エンジンでは**幾何として持てない**。
//   運動学の宣言 ω_i = Ω_AB + σ_i n(σ_i は面内 n 方向の成分)として受け、σ_i は
//   (σ_i n)×n = 0 なので s_i には**効かない**。この「効かないこと」自体を機械検査する
//   (`invariance.sigmaOutOfPlane`)。面外の力学は AA10 が開くまで宣言にとどまる。
//
// ■ 3 候補(いずれも k₀∈[0,∞) を上限とする非負・有界な無次元係数)
//   (i)  相対メッシュ運動応答 k_int = k₀·X²/(1+X²)
//          s_i = (ω_i−Ω_AB)×n(2D では |s_i| = |ω_i−Ω_AB|)
//          X² = (H_AB² + ½(|s_A|²+|s_B|²)) / ω_dyn²
//        同期円軌道 → X=0 → k_int=0 / 無自転円軌道 → X²=1 → k_int=k₀/2 / 径方向運動で H が効く。
//   (ii) ロック係数 k_eff = k_Frame·(1 − α·S_lock·χ_pair)
//          η_i = |ω_i − n_orb|/n_orb(n_orb := ω_dyn ——「その分離での力学レート」を正名とする)
//          S_lock = clamp(1−η_A,0,1)·clamp(1−η_B,0,1)
//          χ_pair = (m_A χ_A + m_B χ_B)/(m_A+m_B)(χ は呼び出し側が渡す**無次元の入力**)
//        同期していても χ_pair の分しか下がらない(❄️ のように χ が 2 桁小さい系では k_eff≈k_Frame)。
//   (iii) T_lock = exp(−(|ω_A−Ω_AB|+|ω_B−Ω_AB|)/(2|Ω_AB|))・R = exp(−|H_AB|/ω_dyn)
//          k_eff = k₀·(1 − T_lock·R)
//        同期円軌道 → T_lock=R=1 → k_eff=0 / 無自転円軌道 → k_eff=(1−e⁻¹)k₀ / 径方向運動で R が落ちて k₀ へ戻る。
//
// 使い方: import { pairLockCandidates, pairLockInvariance } from './lib-w272b-pairlock.mjs'
// 版: w272b-1
export const PAIRLOCK_VERSION = 'w272b-1';

const num = (z) => (typeof z === 'number' && Number.isFinite(z)) ? z : NaN;
const clamp01 = (z) => (z < 0 ? 0 : (z > 1 ? 1 : z));

/** 運動学の分解(r・v・n・H_AB・Ω_AB・ω_dyn)。2D 専用。 */
export function pairKinematics(s) {
  const mA = num(s.mA), mB = num(s.mB), G = num(s.G);
  const rx = num(s.xB) - num(s.xA), ry = num(s.yB) - num(s.yA);
  const vx = num(s.vxB) - num(s.vxA), vy = num(s.vyB) - num(s.vyA);
  const r2 = rx * rx + ry * ry, r = Math.sqrt(r2);
  if (!(r > 0) || !(mA > 0) || !(mB > 0) || !(G > 0)) return null;
  const H = (rx * vx + ry * vy) / r2;          // 拡縮 [1/時間]
  const Om = (rx * vy - ry * vx) / r2;         // 回転 [1/時間](2D の z 成分)
  const omDyn2 = G * (mA + mB) / (r2 * r);
  return { rx, ry, r, vx, vy, nx: rx / r, ny: ry / r, H, Omega: Om,
    omegaDyn: Math.sqrt(omDyn2), omegaDyn2: omDyn2, M: mA + mB };
}

/**
 * 3 候補の値。s = {mA,mB,G, xA,yA,vxA,vyA, xB,yB,vxB,vyB, omegaA,omegaB,
 *                 sigmaA?,sigmaB?, k0?, kFrame?, alpha?, chiA?, chiB?}
 * すべて**シミュレータ単位のまま**渡す(返り値は無次元)。
 */
export function pairLockCandidates(s) {
  const kin = pairKinematics(s);
  if (!kin) return null;
  const k0 = (s.k0 === undefined) ? 1 : num(s.k0);
  const kFrame = (s.kFrame === undefined) ? 1 : num(s.kFrame);
  const alpha = (s.alpha === undefined) ? 1 : num(s.alpha);
  const wA = num(s.omegaA), wB = num(s.omegaB);
  if (![k0, kFrame, alpha, wA, wB].every(Number.isFinite) || k0 < 0 || kFrame < 0) return null;

  // 面外の宣言 σ_i n は s_i に効かない((σ n)×n = 0)。ここでは読み取って記録するだけ
  const sigA = (s.sigmaA === undefined) ? 0 : num(s.sigmaA);
  const sigB = (s.sigmaB === undefined) ? 0 : num(s.sigmaB);

  // (i) 相対メッシュ運動応答
  const sAmag = Math.abs(wA - kin.Omega), sBmag = Math.abs(wB - kin.Omega);
  const X2 = (kin.H * kin.H + 0.5 * (sAmag * sAmag + sBmag * sBmag)) / kin.omegaDyn2;
  const kInt = k0 * X2 / (1 + X2);

  // (ii) ロック係数
  const nOrb = kin.omegaDyn;
  const etaA = Math.abs(wA - nOrb) / nOrb, etaB = Math.abs(wB - nOrb) / nOrb;
  const sLock = clamp01(1 - etaA) * clamp01(1 - etaB);
  const chiA = (s.chiA === undefined) ? 0 : clamp01(num(s.chiA));
  const chiB = (s.chiB === undefined) ? 0 : clamp01(num(s.chiB));
  const chiPair = (num(s.mA) * chiA + num(s.mB) * chiB) / kin.M;
  const kLockRaw = kFrame * (1 - alpha * sLock * chiPair);
  const kLock = Math.min(Math.max(kLockRaw, 0), kFrame);

  // (iii) 指数ロック
  const absOm = Math.abs(kin.Omega);
  const tLock = (absOm > 0) ? Math.exp(-(Math.abs(wA - kin.Omega) + Math.abs(wB - kin.Omega)) / (2 * absOm)) : 0;
  const rQuiet = Math.exp(-Math.abs(kin.H) / kin.omegaDyn);
  const kExp = k0 * (1 - tLock * rQuiet);

  return {
    version: PAIRLOCK_VERSION,
    kin: { r: kin.r, H: kin.H, Omega: kin.Omega, omegaDyn: kin.omegaDyn,
      HOverOmega: kin.H / kin.omegaDyn, OmegaOverOmegaDyn: kin.Omega / kin.omegaDyn },
    declaredOutOfPlane: { sigmaA: sigA, sigmaB: sigB,
      note: '2D では (σ n)×n = 0 —— s_i には効かない(宣言だけ)' },
    candI: { name: 'relative-mesh-response', k: kInt, X2, sAmag, sBmag, k0 },
    candII: { name: 'lock-factor', k: kLock, etaA, etaB, sLock, chiPair, alpha, kFrame, kRaw: kLockRaw },
    candIII: { name: 'exp-lock', k: kExp, tLock, rQuiet, k0 }
  };
}

/** 3 候補の不変性・値域の機械検査。すべての残差が tol 以下なら ok。 */
export function pairLockInvariance(s, tol) {
  const TOL = (tol === undefined) ? 1e-12 : tol;
  const base = pairLockCandidates(s);
  if (!base) return { ok: false, reason: 'base-null', checks: [] };
  const ks = (o) => [o.candI.k, o.candII.k, o.candIII.k];
  const k0 = (s.k0 === undefined) ? 1 : s.k0;
  const kF = (s.kFrame === undefined) ? 1 : s.kFrame;
  // 係数は [0,k₀] の無次元量なので、**絶対差を 1 で正規化した尺度**で測る(0 の周りで
  // 相対差を取ると丸めの 1e-17 が「残差 1」に化けるため —— 第272便b の実測で判明)
  const rel = (a, b) => {
    let m = 0;
    for (let i = 0; i < a.length; i++) {
      const d = Math.abs(a[i] - b[i]), sc = Math.max(Math.abs(a[i]), Math.abs(b[i]), 1);
      m = Math.max(m, d / sc);
    }
    return m;
  };
  const checks = [];
  const b = ks(base);

  // ① 値域: 非負・有界(候補 i/iii は k₀ 以下・候補 ii は k_Frame 以下)
  const bounded = base.candI.k >= 0 && base.candI.k <= k0 + TOL
    && base.candII.k >= 0 && base.candII.k <= kF + TOL
    && base.candIII.k >= 0 && base.candIII.k <= k0 + TOL;
  checks.push({ name: 'bounded', resid: bounded ? 0 : 1, ok: bounded });

  // ② 天体交換(A↔B・χ と ω も一緒に入れ替える)
  const sw = { ...s, mA: s.mB, mB: s.mA, xA: s.xB, yA: s.yB, xB: s.xA, yB: s.yA,
    vxA: s.vxB, vyA: s.vyB, vxB: s.vxA, vyB: s.vyA,
    omegaA: s.omegaB, omegaB: s.omegaA, sigmaA: s.sigmaB, sigmaB: s.sigmaA,
    chiA: s.chiB, chiB: s.chiA };
  const rSwap = rel(b, ks(pairLockCandidates(sw)));
  checks.push({ name: 'exchange', resid: rSwap, ok: rSwap <= TOL });

  // ③ 並進(位置に定ベクトル・速度に定ベクトル)
  const dx = 137.25, dy = -42.5, dvx = 0.31, dvy = -0.77;
  const tr = { ...s, xA: s.xA + dx, yA: s.yA + dy, xB: s.xB + dx, yB: s.yB + dy,
    vxA: s.vxA + dvx, vyA: s.vyA + dvy, vxB: s.vxB + dvx, vyB: s.vyB + dvy };
  const rTr = rel(b, ks(pairLockCandidates(tr)));
  checks.push({ name: 'translation', resid: rTr, ok: rTr <= TOL });

  // ④ 回転(座標系を θ 回す — ω は面外スカラーなので不変)
  const th = 0.7391, c = Math.cos(th), sn = Math.sin(th);
  const ro = { ...s,
    xA: c * s.xA - sn * s.yA, yA: sn * s.xA + c * s.yA,
    xB: c * s.xB - sn * s.yB, yB: sn * s.xB + c * s.yB,
    vxA: c * s.vxA - sn * s.vyA, vyA: sn * s.vxA + c * s.vyA,
    vxB: c * s.vxB - sn * s.vyB, vyB: sn * s.vxB + c * s.vyB };
  const rRo = rel(b, ks(pairLockCandidates(ro)));
  checks.push({ name: 'rotation', resid: rRo, ok: rRo <= TOL });

  // ⑤ 単位変更(長さ ×λ・時間 ×τ・質量 ×μ。G は λ³/(τ²μ) 倍 —— χ は無次元なので不変)
  const lam = 3.75, tau = 0.4, mu = 11.5;
  const un = { ...s, G: s.G * lam * lam * lam / (tau * tau * mu), mA: s.mA * mu, mB: s.mB * mu,
    xA: s.xA * lam, yA: s.yA * lam, xB: s.xB * lam, yB: s.yB * lam,
    vxA: s.vxA * lam / tau, vyA: s.vyA * lam / tau, vxB: s.vxB * lam / tau, vyB: s.vyB * lam / tau,
    omegaA: s.omegaA / tau, omegaB: s.omegaB / tau,
    sigmaA: (s.sigmaA || 0) / tau, sigmaB: (s.sigmaB || 0) / tau };
  const rUn = rel(b, ks(pairLockCandidates(un)));
  checks.push({ name: 'units', resid: rUn, ok: rUn <= 1e-9 });   // 単位変更は丸めが入るので 1e-9

  // ⑥ 面外の宣言 σ_i n は s_i に効かない((σ n)×n = 0)
  const sg = { ...s, sigmaA: 12.5, sigmaB: -3.25 };
  const rSg = rel(b, ks(pairLockCandidates(sg)));
  checks.push({ name: 'sigmaOutOfPlane', resid: rSg, ok: rSg <= TOL });

  return { ok: checks.every((c2) => c2.ok), checks, base: b };
}

/** 基準ケース(QA・器の両方が同じ 1 本を読む): 同期円軌道・無自転円軌道・径方向運動 */
export function pairLockReferenceCases() {
  const G = 1, mA = 1, mB = 1, a = 4;
  const n = Math.sqrt(G * (mA + mB) / (a * a * a));   // 円軌道の相対角速度
  const base = { G, mA, mB, xA: 0, yA: 0, vxA: 0, vyA: 0, xB: a, yB: 0, vxB: 0, vyB: n * a,
    k0: 1, kFrame: 1, alpha: 1, chiA: 0.5, chiB: 0.5 };
  return [
    { id: 'synchronousCircular', s: { ...base, omegaA: n, omegaB: n },
      expect: { candI: 0, candIII: 0 } },
    { id: 'nonSpinningCircular', s: { ...base, omegaA: 0, omegaB: 0 },
      expect: { candI: 0.5, candIII: 1 - Math.exp(-1) } },
    { id: 'radialInfall', s: { ...base, vxB: -0.5 * n * a, vyB: n * a, omegaA: n, omegaB: n },
      expect: null }
  ];
}

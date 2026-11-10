// 第333便a(原仮定者の整理(2026-11-10)「回転引きずりは引きずり半径の手前と奥の差分 —— 赤道面からの距離が R_d を超えると急激に減衰する・ただし斜め方向も差分は有るので厳密には 0 ではない」
//   「R_d は観測半径とは別の値(質点の扱いに似る・質量で決まる)—— 引きずり自転は必ずしも観測自転と言えないのでノブになり得る(例: s_d を、角運動量を保存して半径を R_d に縮めた高速回転で
//   計算する方法も係数付きで検証)」「m_d はなるべく使わない」「重みは m/r² が有力だが他の次数でも検証」・統括の検証項目 R317):
//   **回転引きずりの三次元の差分 —— 比べる 3 列(① 切り口・帯の外 0〔第332便a の主の式 —— 凍結の対照〕/② 源の全体の三次元の差分〔対向 2 点・半径 R_d の一様に回る球・球殻の求積 ——
//   重み r^(−α)〕/③ 狭い帯 + 0 でない尾の異方的な応答〔宣言の型 —— 尾の関数と係数は走行の前に DECL_TAIL に置く〕)と引きずり自転 s_d(J を保って R_d に縮めた回転 —— 係数 λ_J)の純関数**
//   (器 tests/exp-w333a-rotdiff.mjs と QA lint.rotDiff333a・behavior.rotDiff333a が読む —— html を読まない・状態を持たない・第332便a の帯の lib と第319便b の源の慣性係数の表は値を写す)。
//
// ■ 区別(各表・各式に付ける): 宣言(未接続)= この lib の 3 列・s_d・応答率の 2 列(今のエンジンに無い)/実装 = 今の beta の html の K1 の核(R_d の球 —— 回転の項は源のモーメント
//   M1 = R²/(5r²)・opt-in の源のモーメントの半径 invSq.sourceMoment —— 〔第320便a〕)/診断 = 器の表(一次の目安・円軌道の平均)。
// ■ 記号: 位置 p・距離 r(r = ‖p − p′‖)・源の自転軸 â(ここでは ẑ)・受け手の円柱座標 (ρ, z)(源の中心から —— 赤道面からの距離 z)・t = |z|/R_d・引きずり半径 R_d = Y_k m(Y_k = 10G₀/(C₁c₀²))・
//   観測自転 s・引きずり自転 s_d(s と自動で同じにしない)・観測半径 R_obs・質量 m(引きずり質量は使わない)。U = 受け手の位置の差分の速度(方位 φ̂ の成分 —— 源の点の速度の
//   源だけで規格化した重み付き平均 —— 受け手の自己の重みは入れない。結合 β と応答率 γ は後で掛ける)。
// ■ 3 列
//   ① 切り口(第332便a の主 —— 受け手の高さの赤道面に平行な切り口の手前と奥の 2 点・K1 の重み 1/距離): U₁ = s_d (R_d² − z²)/ρ(|z| ≤ R_d)・0(帯の外)。第332便a の lib の形 nearfar を呼ぶ。
//   ② 源の全体の三次元の差分(重み r^(−α)・α は DECL.alphas): pair = 赤道面の対向 2 点(半径 R_d・速度 ±s_d R_d)U = s_d R_d tanh((α/4) ln(1 + 4ρR_d/r₋²))(r∓² = (ρ ∓ R_d)² + z²)/
//     ball = 半径 R_d の一様に回る球の体積の点 p′ の速度 s_d â × p′ の重み付き平均/shell = 半径 R_d の球殻の面の点。求積は x′ > 0 の半分と鏡映の点 (−x′, y′, z′) の対で
//     差 w(p′) − w(p″) = r₋^(−α)·(−expm1(−(α/2) ln(1 + 4ρx′/r₋²)))(打ち消しの無い形)。遠方の展開(r ≫ R_d): pair α s_d R_d² ρ/r²・ball α s_d R_d² ρ/(5r²)・shell α s_d R_d² ρ/(3r²)
//     (⟨x′(p̂·p′)⟩ = ρ⟨x′²⟩/r —— 一様な球 ⟨x′²⟩ = R_d²/5・球殻 R_d²/3)。**ρ/r² で減る —— R_d を境にした急減は無い**(ρ = 100R_d・z = 2R_d で赤道面の 0.9996 倍)。
//   ③ 狭い帯 + 0 でない尾(宣言の型 —— DECL_TAIL): sum = U₁ + k U₂(ball・α = 2)/latW = 源の緯度の応答の重み h(Δz/R_d) = 1/(1 + (Δz/(u₀R_d))⁴)(Δz = z − z′ —— 受け手と源の点の高さの差)で
//     源の点を重み付け・規格化は重みだけ ∫w(遠方では ② の遠方の形 × F(z)・F(z) = (15/(16R_d⁵))∫h (R_d² − z′²)² dz′)/lorentz = 切り口の尺度 s_d R_d²/ρ × 1/(1 + t⁸)(切り口の式を滑らかに延ばした型)。
// ■ 引きずり自転 s_d(宣言 —— 係数 λ_J): J_obs = f_obs m R_obs² s を、半径 R_d・慣性係数 f_d の回転 J_d = f_d m R_d² s_d に置く: s_d = λ_J (f_obs/f_d)(R_obs/R_d)² s(λ_J = 1 が J を保つ)。
//   遠方の K1 の回転のモーメント s_d R_d²/5 は、既にある源のモーメントの J 案(R_src = R_obs√(5f_obs/2)・Ω R_src²/5 —— 〔第320便a〕)と比 λ_J (2/5)/f_d —— f_d = 2/5・λ_J = 1 で等価
//   (遠方の回転のモーメントの等価 —— 結合 β・分母・近接場・帯・応答率は別)。s_d R_d/c₀ は物質の表面の速度としては読めない(J を表す等価なパラメータ)。
// ■ 応答率(NF の加速度 a = γ U・γ = β |s_γ|・β = C₁R_d K1(r; R_d)〔第332便a の k1N〕): fixed = γ を観測自転 s から(a ∝ s · s_d)/linked = γ も s_d から(a ∝ s_d |s_d|)。
// ■ 言わないこと: 3 列・s_d・応答率は宣言の型の表の値と残差(公転面の揃い・累積の小ささを決めた仕組みとは書かない)・今のエンジンの K1 は R_d の球で 3 列と形が違う・s_d をサンプルの観測自転へ
//   書き戻さない・`κ_epi` と κ_D は別・文献の値は本便は一次資料に当たっていない。
import { shapeWeight, bandForce, rdOf, couplingOf, sphereRot, orbitRates, glNodes, C1, DECL as DECL332 } from './lib-w332a-eqband.mjs';

export const LIB_VERSION = 'w333a-rotdiff-lib-1';
const isFin = Number.isFinite;
export const KINDS2 = Object.freeze(['pair', 'ball', 'shell']);
export const TAIL_TYPES = Object.freeze(['sum2', 'sum4', 'latW', 'lorentz']);
export const RATES = Object.freeze(['fixed', 'linked']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  G: DECL332.G, c: DECL332.c, yearS: DECL332.yearS, ageYr: DECL332.ageYr,
  /** ② の重みの次数(原仮定者の整理「重みは m/r² が有力だが他の次数でも検証」—— 主は α = 2) */
  alphas: Object.freeze([1, 1.5, 2, 3]), alphaMain: 2,
  /** ② の求積(球: 動径 × 極角 × 方位の Gauss–Legendre の点の数・球殻: 極角 × 方位)と遠方の展開へ切り替える r/R_d */
  quad: Object.freeze({ nr: 24, nth: 48, nph: 48, farSwitch: 1e3 }),
  /** 引きずり自転の宣言: f_d(半径 R_d の回転の慣性係数 —— 一様な球 2/5 の宣言)・λ_J の格子(1 が J を保つ) */
  fD: 0.4, lambdas: Object.freeze([0, 1e-6, 1e-3, 1]),
});
/** ③ の宣言の型(**尾の関数と係数は走行の前にここに置く** —— 観測に合うように後から選ばない) */
export const DECL_TAIL = Object.freeze({
  sum2: Object.freeze({ label: '切り口 + k·② の和(k = 1e-2・② は球・α = 2 —— 尾を ② の遠方の形に繋ぐ型)', k: 1e-2, alpha: 2, kind: 'ball' }),
  sum4: Object.freeze({ label: '切り口 + k·② の和(k = 1e-4・② は球・α = 2)', k: 1e-4, alpha: 2, kind: 'ball' }),
  latW: Object.freeze({ label: '源の緯度の応答の重み h(Δz) = 1/(1 + (Δz/(u₀R_d))ⁿ)(u₀ = 0.5・n = 4・球・α = 2・規格化は重みだけ)', u0: 0.5, n: 4, alpha: 2, kind: 'ball' }),
  lorentz: Object.freeze({ label: '切り口の尺度 × 1/(1 + tⁿ)(n = 8 —— 切り口の式を滑らかに延ばした型)', n: 8 }),
  /** 「R_d を超えると急減」の物差し(走行の前の宣言): ρ = 100R_d で U(z = 2R_d)/U(z = 0) ≤ 1e-2。「斜めに 0 でない」: 表の帯の外の全部の点で U > 0 */
  steepRho: 100, steepZ: 2, steepMax: 1e-2,
});
/** 表の格子(z/R_d × ρ/R_d —— ブリーフの宣言) */
export const GRID = Object.freeze({ z: Object.freeze([0, 0.5, 1, 2, 10, 100, 1e6]), rho: Object.freeze([2, 10, 100, 1e4]) });
/** 一次外挿が壊れる印(走行の前の宣言): 年齢の間の累積の |Δi| が今の角を超える・|Δ ln a| ≥ 0.1 */
export const BREAK = Object.freeze({ fracMax: 1, dLnAMax: 0.1 });
/** 源の慣性係数の表(第319便b の tests/lib-w319b-srcradius.mjs の MOI・MOI_UNIFORM と同じ値の写し —— import すると領域の下限が第319便b の閉包の本へ広がるので写す。QA lint.rotDiff333a が同じ値か照合する) */
export const MOI = Object.freeze({ 0: 0.07, 1: 0.346, 2: 0.33, 3: 0.3307, 4: 0.3929, 5: 0.3644, 6: 0.254, 11: 0.21 });
export const MOI_UNIFORM = 0.4;
/** 源の慣性係数 f_obs(第319便b の MOI —— 名の無い天体は一様な球 0.4 の宣言〔文献の値ではない〕)—— 🗺️ の添字 */
export const fObsOf = (i) => (MOI[i] !== undefined ? MOI[i] : MOI_UNIFORM);
export const fObsIsLit = (i) => MOI[i] !== undefined;
export const F_OBS_SRC = '第319便b の tests/lib-w319b-srcradius.mjs の MOI(太陽 0.07・水星 0.346・金星 0.33・地球 0.3307・月 0.3929・火星 0.3644・木星 0.254・土星 0.21 —— 文献の値・本便は一次資料に当たっていない)・名の無い天体(天王星・海王星など)は一様な球 0.4 の宣言';

function chk(o, need) {
  if (!o || typeof o !== 'object') throw new RangeError('入力が無い');
  for (const k of need) if (!isFin(o[k])) throw new RangeError(k + ' が有限でない');
  if (!(o.Rd > 0)) throw new RangeError('R_d > 0');
  if ('rho' in o && !(o.rho >= 0)) throw new RangeError('ρ ≥ 0');
}
const alphaOk = (a) => { if (!isFin(a) || !(a > 0)) throw new RangeError('α > 0'); return a; };

/* ───────── ① 切り口(第332便a の主 —— 凍結の対照)───────── */
export function sliceVel({ rho, z, Rd, sd }) {
  chk({ rho, z, Rd, sd }, ['rho', 'z', 'Rd', 'sd']);
  if (!(rho > 0)) throw new RangeError('sliceVel: ρ > 0');
  return sd * Rd * Rd * shapeWeight('nearfar', 'none', Math.abs(z) / Rd) / rho;
}

/* ───────── ② 源の全体の三次元の差分 ───────── */
/** 対向 2 点(赤道面・半径 R_d)の重み r^(−α) の平均 */
export function pairVel({ rho, z, Rd, sd, alpha = DECL.alphaMain }) {
  chk({ rho, z, Rd, sd }, ['rho', 'z', 'Rd', 'sd']); alphaOk(alpha);
  const rm2 = (rho - Rd) ** 2 + z * z;
  if (!(rm2 > 0)) throw new RangeError('pairVel: 受け手が源の点の上');
  return sd * Rd * Math.tanh((alpha / 4) * Math.log1p(4 * rho * Rd / rm2));
}
/** 遠方の展開(r ≫ R_d): pair α s_d R_d² ρ/r²・ball /5・shell /3 */
export function farVel({ rho, z, Rd, sd, alpha = DECL.alphaMain, kind = 'ball' }) {
  chk({ rho, z, Rd, sd }, ['rho', 'z', 'Rd', 'sd']); alphaOk(alpha);
  if (!KINDS2.includes(kind)) throw new RangeError('farVel: 種類は ' + KINDS2.join('・'));
  const r2 = rho * rho + z * z, k = kind === 'pair' ? 1 : kind === 'ball' ? 5 : 3;
  if (!(r2 > 0)) throw new RangeError('farVel: r > 0');
  return alpha * sd * Rd * Rd * rho / (k * r2);
}
/** 緯度の応答 h(u) = 1/(1 + (u/u₀)ⁿ)(u = Δz/R_d) */
export const latResp = (u, u0 = DECL_TAIL.latW.u0, n = DECL_TAIL.latW.n) => 1 / (1 + Math.abs(u / u0) ** n);
/**
 * 一様に回る球(ball)・球殻(shell)の点の速度の重み r^(−α) の平均の方位の成分(数値の求積 —— 受け手は源の外 r > R_d)。resp = 'latW' で源の点に緯度の応答 h(Δz/R_d) を掛ける(規格化は重みだけ)。
 * 戻り値は U [m/s](s_d に比例)。
 */
export function bodyVel({ rho, z, Rd, sd, alpha = DECL.alphaMain, kind = 'ball', resp = null, q = DECL.quad }) {
  chk({ rho, z, Rd, sd }, ['rho', 'z', 'Rd', 'sd']); alphaOk(alpha);
  if (!(kind === 'ball' || kind === 'shell')) throw new RangeError('bodyVel: 種類は ball・shell');
  if (!(resp === null || resp === 'latW')) throw new RangeError('bodyVel: 応答は null・latW');
  if (!(Math.hypot(rho, z) > Rd * (1 + 1e-9))) throw new RangeError('bodyVel: 受け手は源の外(r > R_d)');
  const R = Rd, h = resp === 'latW' ? (zp) => latResp((z - zp) / R) : () => 1;
  const TH = glNodes(q.nth), PH = glNodes(q.nph), RR = glNodes(q.nr);
  let num = 0, den = 0;
  const radial = kind === 'ball' ? Array.from(RR.x, (x, k) => ({ r: R * (x + 1) / 2, w: RR.w[k] * R / 2 })) : [{ r: R, w: 1 }];
  for (const { r: rp, w: wr } of radial) {
    const jr = kind === 'ball' ? rp * rp : 1;
    for (let a = 0; a < q.nth; a++) {
      const ct = TH.x[a], st = Math.sqrt(Math.max(0, 1 - ct * ct)), zp = rp * ct, sp = rp * st, wt = TH.w[a];
      const hz = h(zp), dz2 = (z - zp) * (z - zp);
      for (let b = 0; b < q.nph; b++) {
        const ph = (Math.PI / 2) * PH.x[b], wp = PH.w[b] * Math.PI / 2;   // φ′ ∈ (−π/2, π/2) —— x′ > 0 の半分
        const xp = sp * Math.cos(ph), yp = sp * Math.sin(ph);
        const rm2 = (rho - xp) * (rho - xp) + yp * yp + dz2, wm = rm2 ** (-alpha / 2);
        const diff = wm * (-Math.expm1(-(alpha / 2) * Math.log1p(4 * rho * xp / rm2))), wpl = wm - diff;
        const W = wr * jr * wt * wp;
        num += W * xp * diff * hz; den += W * (wm + wpl);
      }
    }
  }
  return sd * num / den;
}
/** 緯度の応答の遠方の因子 F(z) = (15/(16R⁵))∫_{−R}^{R} h((z − z′)/R)(R² − z′²)² dz′(h ≡ 1 で 1) */
export function latFarFactor(z, Rd, n = 96) {
  const { x, w } = glNodes(n); let s = 0;
  for (let k = 0; k < n; k++) { const zp = Rd * x[k], u = (Rd * Rd - zp * zp); s += w[k] * Rd * latResp((z - zp) / Rd) * u * u; }
  return 15 * s / (16 * Rd ** 5);
}
/** ② の値(遠方は展開・近くは求積 —— 切り替えは DECL.quad.farSwitch) */
export function wholeVel({ rho, z, Rd, sd, alpha = DECL.alphaMain, kind = 'ball' }) {
  if (kind === 'pair') return pairVel({ rho, z, Rd, sd, alpha });
  return Math.hypot(rho, z) / Rd >= DECL.quad.farSwitch ? farVel({ rho, z, Rd, sd, alpha, kind }) : bodyVel({ rho, z, Rd, sd, alpha, kind });
}

/* ───────── ③ 狭い帯 + 0 でない尾(宣言の型)───────── */
export function tailVel(type, { rho, z, Rd, sd }) {
  if (!TAIL_TYPES.includes(type)) throw new RangeError('tailVel: 型は ' + TAIL_TYPES.join('・'));
  chk({ rho, z, Rd, sd }, ['rho', 'z', 'Rd', 'sd']);
  if (!(rho > 0)) throw new RangeError('tailVel: ρ > 0');
  const D = DECL_TAIL[type];
  if (type === 'sum2' || type === 'sum4') return sliceVel({ rho, z, Rd, sd }) + D.k * wholeVel({ rho, z, Rd, sd, alpha: D.alpha, kind: D.kind });
  if (type === 'latW') {
    if (Math.hypot(rho, z) / Rd >= DECL.quad.farSwitch) return farVel({ rho, z, Rd, sd, alpha: D.alpha, kind: 'ball' }) * latFarFactor(z, Rd);
    return bodyVel({ rho, z, Rd, sd, alpha: D.alpha, kind: 'ball', resp: 'latW' });
  }
  const t = Math.abs(z) / Rd;
  return sd * Rd * Rd / rho / (1 + t ** D.n);
}
/** 列の名(① slice・② pair/ball/shell・③ sum2/sum4/latW/lorentz)で U を返す */
export const COLUMNS = Object.freeze(['slice', 'pair', 'ball', 'shell', 'sum2', 'sum4', 'latW', 'lorentz']);
export function colVel(col, x, alpha = DECL.alphaMain) {
  if (col === 'slice') return sliceVel(x);
  if (KINDS2.includes(col)) return wholeVel(Object.assign({}, x, { alpha, kind: col }));
  return tailVel(col, x);
}

/* ───────── 引きずり自転 s_d ───────── */
/** s_d = λ_J (f_obs/f_d)(R_obs/R_d)² s と J の照合・s_d R_d/c₀(物質の表面の速度ではない —— J を表す等価なパラメータ) */
export function dragSpin({ m, Robs, s, fObs, fD = DECL.fD, lambdaJ = 1, Rd = null, c = DECL.c }) {
  if (![m, Robs, s, fObs, fD, lambdaJ].every(isFin) || !(m > 0) || !(Robs > 0) || !(fObs > 0) || !(fD > 0) || lambdaJ < 0) throw new RangeError('dragSpin: m・R_obs・f_obs・f_d > 0・λ_J ≥ 0・s 有限');
  const rd = Rd === null ? rdOf(m) : Rd;
  if (!(rd > 0)) throw new RangeError('dragSpin: R_d > 0');
  const ratio = lambdaJ * (fObs / fD) * (Robs / rd) ** 2, sd = ratio * s, Jobs = fObs * m * Robs * Robs * s, Jd = fD * m * rd * rd * sd;
  return { Rd: rd, sd, ratio, Jobs, Jd, jRel: Jobs !== 0 ? Jd / Jobs : null, vdOverC: Math.abs(sd) * rd / c, lambdaJ, fObs, fD };
}
/** 既にある源のモーメントの J 案(R_src² = (5f_obs/2) R_obs²)との遠方の回転のモーメントの比 (s_d R_d²)/(s R_src²) = λ_J (2/5)/f_d */
export function srcMomentRatio({ m, Robs, s, fObs, fD = DECL.fD, lambdaJ = 1 }) {
  const D = dragSpin({ m, Robs, s, fObs, fD, lambdaJ }), Rsrc2 = 2.5 * fObs * Robs * Robs;
  return { Rsrc: Math.sqrt(Rsrc2), momentFactor: Rsrc2 / (D.Rd * D.Rd), sdMoment: D.sd * D.Rd * D.Rd, jMoment: s * Rsrc2, ratio: s !== 0 ? (D.sd * D.Rd * D.Rd) / (s * Rsrc2) : null, expect: lambdaJ * 0.4 / fD };
}

/* ───────── 円軌道の平均(応答率の 2 列・帯の中と外の分け)───────── */
/**
 * 円軌道(半径 a・赤道面に対する傾き i・n・v)で方位の押し a_φ(u) = γ U(ρ = aN, z = a sin u sin i) のガウスの式の 1 周の平均。U は単位の s_d(=1)で作る関数 Uunit(ρ, z)。
 * γ = β |s_γ|(β = C₁R_d K1(a; R_d))・U は s_U 倍(fixed: s_γ = s・s_U = s_d / linked: s_γ = s_U = s_d)。帯の中(t ≤ 1)と外を分けて返す(t = a|sin u sin i|/R_d)。
 */
export function orbitPush({ Uunit, Rd, a, i, n, v, sGamma, sU, tBreaks = [1 / 16, 0.25, 0.5, 1, 2, 4, 8, 16, 64, 256, 1024, 4096, 16384, 65536], gl = 48 }) {
  if (!(a > 0) || !(n > 0) || !(v > 0) || !isFin(i) || i < 0 || i > Math.PI || !(Rd > 0) || !isFin(sGamma) || !isFin(sU)) throw new RangeError('orbitPush: a・n・v・R_d > 0・0 ≤ i ≤ π・s 有限');
  const si = Math.sin(i), ci = Math.cos(i), asi = a * Math.abs(si), beta = couplingOf('k1N', a, Rd), gamma = beta * Math.abs(sGamma), half = Math.PI / 2;
  const Nf = (u) => Math.sqrt(Math.cos(u) ** 2 + Math.sin(u) ** 2 * ci * ci);
  const aPhi = (u) => gamma * sU * Uunit(a * Nf(u), a * Math.sin(u) * si);
  const uOf = (t) => (asi <= 0 || t * Rd >= asi ? half : Math.asin(t * Rd / asi));
  const us = [0]; for (const t of tBreaks) { const u = uOf(t); if (u > us[us.length - 1]) us.push(u); if (u >= half) break; }
  if (us[us.length - 1] < half) us.push(half);
  const { x, w } = glNodes(gl), seg = (f, lo, hi) => { const h = (hi - lo) / 2, mm = (hi + lo) / 2; let s = 0; for (let k = 0; k < gl; k++) s += w[k] * f(mm + h * x[k]); return s * h; };
  const fI = (u) => -aPhi(u) * si * Math.cos(u) ** 2 / (n * a * Nf(u)), fA = (u) => 2 * aPhi(u) * ci / (Nf(u) * n * a);
  const u1 = uOf(1);
  let bandI = 0, bandA = 0, outI = 0, outA = 0;
  for (let k = 0; k + 1 < us.length; k++) {
    const lo = us[k], hi = us[k + 1], dI = seg(fI, lo, hi) * 2 / Math.PI, dA = seg(fA, lo, hi) * 2 / Math.PI;
    if (hi <= u1 + 1e-300) { bandI += dI; bandA += dA; } else { outI += dI; outA += dA; }
  }
  return { beta, gamma, dIdt: bandI + outI, dLnAdt: bandA + outA, band: { dIdt: bandI, dLnAdt: bandA }, out: { dIdt: outI, dLnAdt: outA }, u1, fracIn: u1 >= half ? 1 : 2 * u1 / Math.PI };
}
/** 列ごとの単位の U の関数(遠方 —— 軌道は r/R_d ≥ farSwitch) */
export function unitFn(col, Rd, alpha = DECL.alphaMain) {
  const x = (rho, z) => ({ rho, z, Rd, sd: 1 });
  if (col === 'slice') return (rho, z) => sliceVel(x(rho, z));
  if (col === 'pair') return (rho, z) => pairVel(Object.assign(x(rho, z), { alpha }));
  if (col === 'ball' || col === 'shell') return (rho, z) => farVel(Object.assign(x(rho, z), { alpha, kind: col }));
  return (rho, z) => tailVel(col, x(rho, z));
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, Rd = 1, sd = 2;
  const pts = [[3, 0.4], [10, 0.5], [10, 2], [100, 0.3], [100, 5]];
  // 1 z → −z の対称と s_d の符号(全部の列)
  S.sym = COLUMNS.map((col) => { let even = true, odd = true; for (const [rho, z] of pts) { const p = colVel(col, { rho, z, Rd, sd }), m = colVel(col, { rho, z: -z, Rd, sd }), n = colVel(col, { rho, z, Rd, sd: -sd });
    if (Math.abs(p - m) > 1e-12 * Math.abs(p) + 1e-300) even = false; if (Math.abs(p + n) > 1e-12 * Math.abs(p) + 1e-300) odd = false; } return { col, even, odd }; });
  // 2 対向 2 点の閉じた値(ρ = 3・z = 0・α = 1 → 2/3・z = 2・α = 2 → 12/14)と帯の外で 0 でない(ρ = 100・z = 2 ÷ z = 0)
  S.pair = { a1: pairVel({ rho: 3, z: 0, Rd: 1, sd: 2, alpha: 1 }), a2: pairVel({ rho: 3, z: 2, Rd: 1, sd: 2, alpha: 2 }),
    out: DECL.alphas.map((alpha) => pairVel({ rho: 100, z: 2, Rd, sd, alpha }) / pairVel({ rho: 100, z: 0, Rd, sd, alpha })) };
  // 3 α の依存と遠方の尺度(r ≫ R_d で U r²/(ρ R_d²) → α s_d/k —— 求積と展開の比・r を 10 倍で U は 1/10〔赤道面〕)
  S.far = DECL.alphas.map((alpha) => { const r = 1e3, b = bodyVel({ rho: r, z: 0, Rd, sd, alpha }), sh = bodyVel({ rho: r, z: 0, Rd, sd, alpha, kind: 'shell' }), pr = pairVel({ rho: r, z: 0, Rd, sd, alpha });
    return { alpha, ball: b / farVel({ rho: r, z: 0, Rd, sd, alpha }), shell: sh / farVel({ rho: r, z: 0, Rd, sd, alpha, kind: 'shell' }), pair: pr / farVel({ rho: r, z: 0, Rd, sd, alpha, kind: 'pair' }),
      decade: bodyVel({ rho: 1e2, z: 0, Rd, sd, alpha }) / bodyVel({ rho: 1e3, z: 0, Rd, sd, alpha }), shellOverBall: sh / b }; });
  // 4 求積の収束(点の数を 1.5 倍 —— 近い点 ρ = 2・z = 0 と ρ = 3・z = 1.5・α = 3)
  { const q2 = { nr: 36, nth: 72, nph: 72, farSwitch: 1e3 }, f = (o) => Math.abs(bodyVel(o) / bodyVel(Object.assign({}, o, { q: q2 })) - 1);
    S.conv = { near: f({ rho: 2, z: 0, Rd, sd, alpha: 3 }), oblique: f({ rho: 3, z: 1.5, Rd, sd, alpha: 3 }), shell: f({ rho: 2, z: 0.5, Rd, sd, alpha: 2, kind: 'shell' }), latW: f({ rho: 3, z: 1.2, Rd, sd, alpha: 2, resp: 'latW' }) }; }
  // 5 帯の中で ① と一致する条件: ① = 第332便a の bandForce の S U₀(s_d を Ω に)・lorentz は赤道面で ① と同じ・sum は (U_sum − U₁)/U₁ = k U₂/U₁・帯の外で ① は 0
  { const body = { x: [0, 0, 0], v: [0, 0, 0], m: 1, axis: [0, 0, 1], Omega: sd };
    S.inband = { lorentz0: tailVel('lorentz', { rho: 10, z: 0, Rd, sd }) / sliceVel({ rho: 10, z: 0, Rd, sd }), sum2: (tailVel('sum2', { rho: 100, z: 0, Rd, sd }) - sliceVel({ rho: 100, z: 0, Rd, sd })) / (1e-2 * wholeVel({ rho: 100, z: 0, Rd, sd })),
      outSlice: sliceVel({ rho: 10, z: 1 + 1e-9, Rd, sd }), edge: sliceVel({ rho: 10, z: 1 - 1e-12, Rd, sd }) };
    // 第332便a の lib の帯の力(Ω を s_d に —— R_d は質量の規則・受け手を R_d の単位で置く): S U₀ = ①
    const mm = 1e27, Rm = rdOf(mm), lib = (zz) => { const q = bandForce({ x: [0, 0, 0], m: mm, axis: [0, 0, 1], Omega: sd }, { x: [37 * Rm, 0, zz * Rm] }, { shape: 'nearfar', tail: 'none', dir: 'NF' }); return q.S * q.U0; };
    S.inband.vs332 = Math.max(...[0, 0.3, 0.9].map((zz) => Math.abs(lib(zz) / sliceVel({ rho: 37 * Rm, z: zz * Rm, Rd: Rm, sd }) - 1)));
    void body; }
  // 6 緯度の応答: F(z) の h ≡ 1 は 1(u₀ → ∞ の極限の代わりに求積の恒等式)・遠方の求積 ÷ 展開(ρ = 1e3)・帯の外で単調に減る・0 でない
  { const wide = (() => { const { x, w } = glNodes(96); let s = 0; for (let k = 0; k < 96; k++) { const u = 1 - x[k] * x[k]; s += w[k] * u * u; } return 15 * s / 16; })();
    const rho = 1e3, nf = (z) => bodyVel({ rho, z, Rd, sd, alpha: 2, resp: 'latW' }) / (farVel({ rho, z, Rd, sd, alpha: 2 }) * latFarFactor(z, Rd));
    S.lat = { identity: wide, far0: nf(0), far2: nf(2), F: [0, 0.5, 1, 2, 10, 100].map((z) => latFarFactor(z, Rd)) }; }
  // 7 引きずり自転: λ_J = 1 で J を保つ・λ_J に比例・f_d = 2/5 で源のモーメントの J 案と等価・f_d を 2 倍で比 1/2
  { const o = { m: 2, Robs: 10, s: 3, fObs: 0.4, Rd: 1 }, d1 = dragSpin(o), dh = dragSpin(Object.assign({}, o, { lambdaJ: 0.5 })), d0 = dragSpin(Object.assign({}, o, { lambdaJ: 0 }));
    const sun = { m: 1.9885e30, Robs: 6.957e8, s: 2.865e-6, fObs: 0.07 };
    S.sd = { sd1: d1.sd, j1: d1.jRel, jh: dh.jRel, sd0: d0.sd, eq: srcMomentRatio(sun).ratio, eq2: srcMomentRatio(Object.assign({}, sun, { fD: 0.8 })).ratio, eqL: srcMomentRatio(Object.assign({}, sun, { lambdaJ: 1e-3 })).ratio,
      sunRatio: dragSpin(sun).ratio, sunMoment: srcMomentRatio(sun).momentFactor }; }
  // 8 円軌道の平均: ① の s_d = s は第332便a の orbitRates(主 —— 手前と奥の差分)と同じ・fixed は s_d/s 倍・linked は (s_d/s)² 倍・帯の中と外の和
  { const src = { m: 1.9885e30, Omega: 2.865e-6 }, GM = DECL.G * src.m, a = 1.0e11, n = Math.sqrt(GM / a ** 3), Rm = rdOf(src.m), i = 0.06;
    const o332 = orbitRates({ src, orbit: { a, i, n, v: n * a }, decl: { shape: 'nearfar', tail: 'none', dir: 'NF', strength: 'k1N', rule: 'kappa0' } });
    const base = orbitPush({ Uunit: unitFn('slice', Rm), Rd: Rm, a, i, n, v: n * a, sGamma: src.Omega, sU: src.Omega });
    const k = 7.5, fx = orbitPush({ Uunit: unitFn('slice', Rm), Rd: Rm, a, i, n, v: n * a, sGamma: src.Omega, sU: k * src.Omega }), lk = orbitPush({ Uunit: unitFn('slice', Rm), Rd: Rm, a, i, n, v: n * a, sGamma: k * src.Omega, sU: k * src.Omega });
    const bl = orbitPush({ Uunit: unitFn('ball', Rm), Rd: Rm, a, i, n, v: n * a, sGamma: src.Omega, sU: src.Omega });
    S.orbit = { vs332: base.dIdt / o332.dIdt, vs332A: base.dLnAdt / o332.dAdtOverA, fixed: fx.dIdt / base.dIdt, linked: lk.dIdt / base.dIdt, sliceOut: base.out.dIdt, ballSplit: (bl.band.dIdt + bl.out.dIdt) / bl.dIdt, ballOutShare: bl.out.dIdt / bl.dIdt, aligning: base.dIdt < 0 && bl.dIdt < 0 }; }
  // 9 入力の拒否
  const rej = [() => sliceVel({ rho: 0, z: 0, Rd: 1, sd: 1 }), () => sliceVel({ rho: 1, z: 0, Rd: 0, sd: 1 }), () => pairVel({ rho: 1, z: 0, Rd: 1, sd: 1 }), () => pairVel({ rho: 3, z: 0, Rd: 1, sd: 1, alpha: 0 }),
    () => bodyVel({ rho: 0.5, z: 0, Rd: 1, sd: 1 }), () => bodyVel({ rho: 3, z: 0, Rd: 1, sd: 1, kind: 'cube' }), () => bodyVel({ rho: 3, z: 0, Rd: 1, sd: 1, resp: 'x' }), () => farVel({ rho: 3, z: 0, Rd: 1, sd: 1, kind: 'disk' }),
    () => tailVel('box', { rho: 3, z: 0, Rd: 1, sd: 1 }), () => sliceVel({ rho: NaN, z: 0, Rd: 1, sd: 1 }), () => dragSpin({ m: 1, Robs: 1, s: 1, fObs: 0 }), () => dragSpin({ m: 1, Robs: 1, s: 1, fObs: 0.4, lambdaJ: -1 }),
    () => orbitPush({ Uunit: () => 1, Rd: 1, a: 1, i: 4, n: 1, v: 1, sGamma: 1, sU: 1 })];
  S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    symmetry: S.sym.length === COLUMNS.length && S.sym.every((q) => q.even && q.odd),
    pairClosed: rel(S.pair.a1, 2 / 3) < 1e-12 && rel(S.pair.a2, 12 / 14) < 1e-12 && S.pair.out.every((x) => x > 0.999 && x < 1),
    farScale: S.far.every((q) => Math.abs(q.ball - 1) < 1e-5 && Math.abs(q.shell - 1) < 1e-5 && Math.abs(q.pair - 1) < 1e-5 && Math.abs(q.decade - 10) < 1e-2 && Math.abs(q.shellOverBall - 5 / 3) < 1e-5),
    convergence: Object.values(S.conv).every((x) => x < 1e-6),
    inBand: rel(S.inband.lorentz0, 1) < 1e-15 && rel(S.inband.sum2, 1) < 1e-9 && S.inband.outSlice === 0 && Math.abs(S.inband.edge) < 1e-10 && S.inband.vs332 < 1e-12,
    latitude: rel(S.lat.identity, 1) < 1e-12 && Math.abs(S.lat.far0 - 1) < 1e-5 && Math.abs(S.lat.far2 - 1) < 1e-5 && S.lat.F.every((x, k, a) => x > 0 && (k < 3 || x < a[k - 1])),
    dragSpin: rel(S.sd.sd1, 300) < 1e-12 && rel(S.sd.j1, 1) < 1e-12 && rel(S.sd.jh, 0.5) < 1e-12 && S.sd.sd0 === 0 && rel(S.sd.eq, 1) < 1e-12 && rel(S.sd.eq2, 0.5) < 1e-12 && rel(S.sd.eqL, 1e-3) < 1e-12 && rel(S.sd.sunRatio, S.sd.sunMoment) < 1e-12,
    orbit: rel(S.orbit.vs332, 1) < 1e-6 && rel(S.orbit.vs332A, 1) < 1e-6 && rel(S.orbit.fixed, 7.5) < 1e-12 && rel(S.orbit.linked, 56.25) < 1e-12 && S.orbit.sliceOut === 0 && rel(S.orbit.ballSplit, 1) < 1e-12 && S.orbit.ballOutShare > 0.99 && S.orbit.aligning,
    reject: S.reject.length === 13 && S.reject.every(Boolean),
  };
}
export { C1, sphereRot, rdOf, couplingOf };

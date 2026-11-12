// 第335便c(原仮定者の決断(2026-11-12)「元の意図は、回転の並進引きずりが近点移動に効くのではないか —— 斜め軌道なので、位置で影響が変化する」「回転引きずり有りの組み合わせも検証する」・
//   原仮定者の補足(2026-11-12)「距離の変化による並進引きずりについて、水星での影響を組み合わせとして確認する」・原仮定者の回答(2026-11-12 —— AN655)回転の分の係数は参考の比として残す・
//   原仮定者の回答(2026-11-12 —— AN657)角運動量と離心率のベクトル・面内の近点・二次の結合・原仮定者の回答(2026-11-12 —— AN650)座標変換の基準は観測自転・
//   原仮定者の回答(2026-11-12 —— AN646)T1 = 源と受け手を結ぶ線のまわりの捩れの率 —— s z は参照の腕を置いた速さの指標・統括の検証項目 R330):
//   **水星の組み合わせの純関数 —— 並進の分の動径/接線の分解(距離の変化の分)・回転引きずり有りの組み合わせの列(座標変換の回転の分・旧い回転の差分・切り口・
//   T1 を軌道へ作用させる向きの候補 × 結合の型)・軌道の位置の区間ごとの面内の近点の回転・二次の結合(列どうしの混合の差)**
//   (器 tests/exp-w335c-mercurycombo.mjs と QA lint.mercuryCombo335c・behavior.mercuryCombo335c が読む —— html を読まない・状態を持たない・
//   第333便c・第334便a・第334便c・第332便a の lib は呼ぶだけ・エンジンの式を写さない)。**本枝は T1 を軌道へ作用させる向きの候補と、並進の動径/接線の分解の唯一の持ち主**
//   (自己を運ぶ式・熱の口・供給の帳簿・T1 の部位の則〔線のまわりの回転の部位の速度〕は持たない —— 分解は第333便c の transDragVelocity の型のまま)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html にある型(G_loc の力の型 —— 受け手 n = 2・K1 の並進)/診断 = この lib の一次の率(Gauss の式の区間ごとの積分)と純粋な積分器/
//   宣言(未接続)= 今のエンジンに無い型(統合した並進引きずり〔源の座標の速度 v_j + s_j × (p_i − p_j) の重み付き平均〕の並進の分と回転の分・旧い回転の差分〔対向 2 点・NF〕・
//   切り口の式・**T1 の向きの候補と結合の型**)。
// ■ 距離の変化による並進引きずり(原仮定者の補足(2026-11-12)の用語): 並進引きずりの相対の速度 C − v のうち**動径の成分**(源が静止なら −β ṙ r̂)。今の K1 の並進の分に**含まれている**
//   (別の項として足すと二重 —— 「今の組 + 動径の分」は二重の否定対照)。分解は d = β(r)[s × p − v] を受け手の位置で r̂(動径)・Ŵ × r̂(面内の横 —— 接線)・Ŵ(公転面の法線)に
//   分ける(Ŵ = p × w の単位 —— w は接触の速度)。3 つの和 = 全体(閉じの残差を門に)。
// ■ T1 を軌道へ作用させる向きの候補(宣言 —— 走行の前・採用ではない): 速さの指標 V = s z(z = p·ŝ —— 符号つき・観測自転 s・第334便a の t1Twist の par〔β = 1〕)に向き ê を宣言する:
//   (a) phi = 太陽の自転軸のまわりの方位 ŝ × p の単位 (b) tangent = 軌道の接線 w の単位 (c) normal = 公転面の法線 p × w の単位 (d) radial = p̂。
//   結合の型: vel = 速度の場(座標変換と同じ重み β(r) = w/(W_self + w) で d に足す —— α = 1・ballHarmonic・Y_k m)/velNoSelf = 自己なしの場の読み(β = 1 —— d = V ê)/
//   push = 押し(a = γ(r) V ê・γ = C₁ R_d K1(r; R_d) |s| —— 第332便a の NF の強さ k1N・第333便c の pairAccel と同じ強さ)。
//   線のまわりの回転そのものは受け手の中心で速度 0(T1 の部位の則は持たない)—— 向きは宣言で与える比べる列。**結果を見て向きと結合を選ばない**。
// ■ 軌道の位置の区間(宣言): 真近点角の 36 区間(中心 f = 10k° —— 幅 10°・近日点の区間 k = 0・遠日点 k = 18)。区間ごとに面内の近点の回転 ω_W への寄与(全周の率への寄与 —— 区間の和 = 全周)。
//   印: 太陽の赤道面の昇交点・降交点・|z| の最大(u = ±90°)の区間。打ち消しの度合い = |Σ 寄与| ÷ Σ |寄与|。
// ■ 型の判定(宣言 —— 走行の前): 列が「斜めで離心だから位置で変わり、打ち消し合わずに残る」型を持つ ⇔ (i) 水星の e と傾きで全周の ω_W が近点引数 ω に依る(ω の格子の振れ ÷ 平均の絶対値 > 1e-6)
//   ∧ (ii) ω に依る振幅 A_ω が傾き 0 で消え(≤ 1e-9 × 行の尺度)、傾きとともに増える ∧ (iii) A_ω が e とともに増える(e = 0.1 < 0.2056 < 0.4)。形は ω の 12 点の格子に
//   1・cos ω・sin ω・cos 2ω・sin 2ω を最小二乗で当て、A_ω の e と sin i への比(e・e²・sin i・sin² i で割った値)を並べる。
// ■ 言わないこと: 表は「宣言した型の一次の率」「位置の依存の型の有無」「文献の値(本環境では未照合)との参考の比」と書く。回転引きずりで水星の近点が出たとは書かない・
//   距離の変化の並進で不足が埋まったとは書かない・T1 の向きの候補を採用と書かない。一次の率は無摂動の軌道の平均(写しの時間発展ではない)。
import { stateAt, crossingAnomalies, transDragVelocity, pairAccel, cutAccel, bandWindows, dragSpin, weightOf, velocityToAccel, vec, C1, CENTURY_S, toArcsecCy, DECL as DECL333C } from './lib-w333c-mercury3d.mjs';
import { t1Twist } from './lib-w334a-heightlaw.mjs';
import { vectorRates, effectOf, selfAligned, eOfF, hypoOrbit, integrateFrame, splitAbout, kappaMRadius, LIT as LIT334C, DECL as DECL334C } from './lib-w334c-mercurynode.mjs';
import { k1Core } from './lib-w332a-eqband.mjs';

export const LIB_VERSION = 'w335c-mercurycombo-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
export const asec = (r) => (r === null || r === undefined ? null : toArcsecCy(r));

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  G: DECL333C.G, c: DECL333C.c,
  /** 主の統合した並進(座標変換の重み —— 第334便c の主の列と同じ): α = 1・ballHarmonic・自己の半径 Y_k m */
  mainTrans: Object.freeze({ alpha: 1, shape: 'ballHarmonic', radius: 'kappaM' }),
  /** 基準の列 = G_loc 受け手 n = 2 + 統合した並進の並進の分(K1 の代わり —— 重ねない) */
  baseCols: Object.freeze(['gloc', 'trans']),
  /** 回転引きずり有りの足す列(R1 座標変換の回転の分・R2 旧い回転の差分〔対向 2 点・NF —— α × 振幅〕・R3 切り口〔帯〕・R4 T1 の向き × 結合) */
  pairAlpha: Object.freeze([1, 2]),
  pairAmp: Object.freeze(['observed', 'jEquiv']),
  t1Dirs: Object.freeze(['phi', 'tangent', 'normal', 'radial']),
  t1Couplings: Object.freeze(['vel', 'velNoSelf', 'push']),
  /** J 等価の振幅(第333便c の dragSpin —— λ_J = 1・太陽の慣性モーメントの係数 0.07・f_d 0.4)・応答率は固定(観測自転 s) */
  jEquiv: Object.freeze({ lambdaJ: 1, fObs: 0.07 }),
  /** 分解の格子(第334便c の格子 —— α × 自己の形 × 自己の半径)と部分 */
  decompParts: Object.freeze(['trans', 'rot', 'both']),
  /** 軌道の位置の区間(真近点角の中心 10k°・幅 10°・GL の点)と型の判定の格子 */
  nBins: 36, binGL: 16,
  eGrid: Object.freeze([0, 0.1, 0.2056, 0.4]),
  omegaGridDeg: Object.freeze([0, 45, 90, 109.58, 135]),
  incGridDeg: Object.freeze([0, 3.381, 7]),
  shapeOmegaDeg: Object.freeze([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]),
  shapeHarmonics: Object.freeze(['1', 'cos ω', 'sin ω', 'cos 2ω', 'sin 2ω']),
  omegaDependenceTol: 1e-6, zeroTol: 1e-9, binSumTol: 1e-8, closureTol: 1e-9,
  /** 位置の区間と型の判定に入れる列(切り口〔帯〕は帯の幅が区間の点より細いので入れない —— 水星の表だけ) */
  gridCols: Object.freeze(['gloc', 'trans', 'transRadial', 'transTangent', 'transNormal', 'rot', 'pair2obs', 'pair2jEquiv',
    't1phiVel', 't1tangentVel', 't1normalVel', 't1radialVel', 't1phiVelNoSelf', 't1tangentVelNoSelf', 't1normalVelNoSelf', 't1radialVelNoSelf',
    't1phiPush', 't1tangentPush', 't1normalPush', 't1radialPush']),
  /** 二次の結合(純粋な積分器 —— 単位の軌道・係数を上げた写し・h と h/2・窓の長さ 2 つ・相手の係数を倍にした照合) */
  mix: Object.freeze({ cT: 1e-4, cX: 1e-4, steps: Object.freeze([1000, 2000]), nOrb: Object.freeze([8, 16]), partners: Object.freeze(['rot', 't1phiVel', 't1tangentVel', 't1normalVel', 't1radialVel']), resolveFactor: 10, bilinTol: 0.05 }),
  breakPerOrbit: DECL333C.breakPerOrbit,
});
/** 文献の値(第334便c の LIT —— 第335便c で火星の近点の側を訂正した値を呼ぶ・本環境では未照合)と幅の意味 */
export const LIT = Object.freeze({
  src: '第334便c の lib の LIT(第335便c で火星の近点の側を訂正 —— 出典の表の単位 mas/年 × 0.1 → ″/世紀・外の照合の記録 + 記憶の値・本環境から一次資料は未到達・本環境では未照合)',
  dvarpi: LIT334C.dvarpi, dnode: LIT334C.dnode, widthMeaning: LIT334C.widthMeaning, correction: LIT334C.correction335c,
  ratioNote: '比 = 列の率 ÷ 比べる尺度(|値| + 幅)。係数の比の最小は特定の暦表・量・幅からの参考の係数の比で、厳密な信頼の上限ではない(原仮定者の回答(2026-11-12 —— AN655))',
});

/* ───────── 小さな道具 ───────── */
/** 軌道の単位の基底(受け手の位置 x と接触の速度 w): r̂・Ŵ(p × w の単位)・面内の横 Ŵ × r̂ */
export function frameAt(x, w) {
  const r = nrm(x), rh = scl(x, 1 / r), Wv = crs(x, w), Wn = nrm(Wv);
  if (!(r > 0) || !(Wn > 0)) throw new RangeError('frameAt: r > 0・p × w ≠ 0');
  const W = scl(Wv, 1 / Wn);
  return { rh, W, th: crs(W, rh) };
}
/** 速度の場を成分に分ける(radial・tangent〔面内の横〕・normal〔公転面の法線〕・all) */
export function splitField(dField, comp) {
  if (!['radial', 'tangent', 'normal', 'all'].includes(comp)) throw new RangeError('splitField: 成分');
  if (comp === 'all') return dField;
  return (x, w) => { const d = dField(x, w), F = frameAt(x, w), e = comp === 'radial' ? F.rh : comp === 'tangent' ? F.th : F.W; return scl(e, dot(d, e)); };
}
/** 主の統合した並進の重み β(r) = w/(W_self + w)(源の質量 M・受け手の自己の重み —— 第334便c の selfAligned) */
export function betaOf(sys, spec = DECL.mainTrans) {
  const Rself = spec.radius === 'kappaM' ? kappaMRadius(sys.m) : sys.R, self = selfAligned({ shape: spec.shape, alpha: spec.alpha, m: sys.m, R: Rself });
  if (!self) return null;
  return (r) => { const w = weightOf(sys.M, r, spec.alpha); return w / (self.w + w); };
}
/** T1 の向き ê(位置 x・接触の速度 w・太陽の自転軸 ŝ) */
export function t1Dir(dir, x, w, s) {
  if (dir === 'phi') return unit(crs(s, x));
  if (dir === 'tangent') return unit(w);
  if (dir === 'normal') return unit(crs(x, w));
  if (dir === 'radial') return unit(x);
  throw new RangeError('t1Dir: 向き');
}
/** T1 の速さの指標 V = s z(第334便a の t1Twist の par —— β = 1・z = p·ŝ 符号つき・ρ = 軸からの距離) */
export function t1Speed(x, sHat, s) {
  const z = dot(x, sHat), rho = nrm(sub(x, scl(sHat, z)));
  return t1Twist({ rho, z, sd: s, beta: 1 }).par;
}
/** T1 の列の効果(向き × 結合)。sys = { M, m, R, sunAxis, sSun, Rsun, orb } */
export function t1Effect(sys, dir, coupling) {
  if (!DECL.t1Dirs.includes(dir) || !DECL.t1Couplings.includes(coupling)) throw new RangeError('t1Effect: 宣言');
  const sh = unit(sys.sunAxis), s = sys.sSun;
  if (coupling === 'push') { const Rd = kappaMRadius(sys.M);
    return { kind: 'acc', a: (st) => { const g = C1 * Rd * k1Core(st.r, Rd).K * Math.abs(s); return scl(t1Dir(dir, st.x, st.v, sh), g * t1Speed(st.x, sh, s)); } }; }
  const beta = coupling === 'vel' ? betaOf(sys) : () => 1;
  return { kind: 'vel', d: (x, w) => scl(t1Dir(dir, x, w, sh), beta(nrm(x)) * t1Speed(x, sh, s)) };
}
/** 列の効果(key —— 宣言の名)。null は定義できない */
export function columnEffect(sys, key) {
  const T = DECL.mainTrans, base = { kind: 'trans', alpha: T.alpha, shape: T.shape, radius: T.radius };
  if (key === 'gloc') return effectOf(sys, { kind: 'gloc', pair: 'receiver', n: 2 });
  if (key === 'k1') return effectOf(sys, { kind: 'k1' });
  if (key === 'trans' || key === 'rot' || key === 'both') return effectOf(sys, { ...base, part: key });
  const m1 = /^trans(Radial|Tangent|Normal)$/.exec(key);
  if (m1) { const e = effectOf(sys, { ...base, part: 'trans' }); return { kind: 'vel', d: splitField(e.d, m1[1].toLowerCase()) }; }
  const m2 = /^pair(\d)(observed|jEquiv|obs)$/.exec(key);
  if (m2) { const alpha = Number(m2[1]), Rd = kappaMRadius(sys.M), amp = m2[2] === 'jEquiv' ? 'jEquiv' : 'observed';
    const sd = amp === 'jEquiv' ? dragSpin({ s: sys.sSun, Robs: sys.Rsun, Rd, fObs: DECL.jEquiv.fObs, lambdaJ: DECL.jEquiv.lambdaJ }) : sys.sSun;
    return { kind: 'acc', a: pairAccel({ Rd, axis: sys.sunAxis, sd, sGamma: sys.sSun, alpha }) }; }
  if (key === 'cut') return { kind: 'acc', a: cutAccel({ M: sys.M, axis: sys.sunAxis, Omega: sys.sSun }), band: true };
  const m3 = /^t1(phi|tangent|normal|radial)(VelNoSelf|Vel|Push)$/.exec(key);
  if (m3) return t1Effect(sys, m3[1], m3[2] === 'Vel' ? 'vel' : m3[2] === 'VelNoSelf' ? 'velNoSelf' : 'push');
  throw new RangeError('columnEffect: 名 ' + key);
}
/** 列の一次の率(帯の型は第333便c の bandWindows の区間だけ)—— vectorRates(第334便c)を呼ぶ */
export function columnRates(sys, key, poles) {
  const eff = columnEffect(sys, key);
  if (eff.band) return vectorRates(sys.orb, eff, { windows: bandWindows(sys.orb, sys.sunAxis, kappaMRadius(sys.M)), gl: DECL333C.bandGL, poles });
  return vectorRates(sys.orb, eff, { poles });
}

/* ───────── 軌道の位置の区間 ───────── */
/** 真近点角の区間(中心 10k°)の離心近点角の区間と印(近日点・遠日点・昇交点・降交点・|z| の最大) */
export function anomalyBins(orb, pole, n = DECL.nBins) {
  const w = 2 * Math.PI / n, bins = [];
  for (let k = 0; k < n; k++) { const f0 = k * w - w / 2, f1 = f0 + w; bins.push({ k, fDeg: k * 360 / n, E: [eOfF(f0, orb.e), eOfF(f1, orb.e)] }); }
  const kOf = (f) => ((Math.round(f / w) % n) + n) % n;
  let marks = { peri: 0, apo: kOf(Math.PI), asc: null, desc: null, zMax: null };
  const sinI = nrm(crs(unit(pole), orb.W));
  if (sinI > 1e-12) { const cr = crossingAnomalies(orb, pole); marks = { ...marks, asc: kOf(cr.asc), desc: kOf(cr.desc), zMax: [kOf(cr.asc + Math.PI / 2), kOf(cr.asc - Math.PI / 2)] }; }
  return { bins, marks };
}
/** 区間ごとの面内の近点の回転 ω_W への寄与と L̂ の変化(rad/s —— 全周の率への寄与)。full = 一様な格子の全周 */
export function binRates(orb, eff, pole, { n = DECL.nBins, gl = DECL.binGL } = {}) {
  const B = anomalyBins(orb, pole, n), per = B.bins.map((b) => { const R = vectorRates(orb, eff, { windows: [b.E], gl }); return { k: b.k, apsW: R.apsW, Ldot: R.Ldot, dedt: R.dedt, eOut: R.eOut }; });
  const full = vectorRates(orb, eff, {});
  const sumA = orb.e > 0 ? per.reduce((s, q) => s + q.apsW, 0) : null, gross = orb.e > 0 ? per.reduce((s, q) => s + Math.abs(q.apsW), 0) : null;
  const sumL = per.reduce((s, q) => add(s, q.Ldot), [0, 0, 0]);
  return { marks: B.marks, per, full: { apsW: full.apsW, Ldot: full.Ldot, LdotMag: full.LdotMag, dedt: full.dedt, dlnA: full.dlnA },
    sumApsW: sumA, grossApsW: gross, netOverGross: orb.e > 0 && gross > 0 ? Math.abs(sumA) / gross : null, sumLdot: sumL };
}
/** ω の格子の上の値に 1・cos ω・sin ω・cos 2ω・sin 2ω を最小二乗で当てる(正規方程式 —— 5 × 5 の Gauss の消去)。戻り値 { coef, rms } */
export function harmonicFit(omegaDeg, y) {
  const rows = omegaDeg.map((o) => { const w = o * D2R; return [1, Math.cos(w), Math.sin(w), Math.cos(2 * w), Math.sin(2 * w)]; });
  const m = 5, A = Array.from({ length: m }, () => new Array(m + 1).fill(0));
  rows.forEach((r, i) => { for (let a = 0; a < m; a++) { for (let b = 0; b < m; b++) A[a][b] += r[a] * r[b]; A[a][m] += r[a] * y[i]; } });
  for (let c = 0; c < m; c++) { let p = c; for (let r = c + 1; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]];
    if (!(Math.abs(A[c][c]) > 0)) throw new RangeError('harmonicFit: 退化'); for (let r = 0; r < m; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let b = c; b <= m; b++) A[r][b] -= f * A[c][b]; } }
  const coef = A.map((r, i) => r[m] / r[i]);
  const rms = Math.sqrt(rows.reduce((s, r, i) => s + (r.reduce((t, x, k) => t + x * coef[k], 0) - y[i]) ** 2, 0) / rows.length);
  return { coef, rms };
}

/* ───────── 二次の結合(列どうしの混合の差 —— 第334便c の integrateFrame を呼ぶ)───────── */
/** 単位の軌道(μ = a = 1)の速度の場の写し: trans d = −c w/r・rot d = c (ŝ × p)/r・T1 vel d = c (z/r) ê(β ∝ 1/r の α = 1 の型 —— 本物の係数は c = β(a)・β(a) s/n) */
export function unitField(key, c, sHat) {
  if (key === 'trans') return (x, w) => scl(w, -c / nrm(x));
  if (key === 'rot') return (x) => scl(crs(sHat, x), c / nrm(x));
  const m = /^t1(phi|tangent|normal|radial)Vel$/.exec(key);
  if (m) return (x, w) => scl(t1Dir(m[1], x, w, sHat), c * dot(x, sHat) / nrm(x));
  throw new RangeError('unitField: 名 ' + key);
}
/** 混合の差 M = F(trans + X) − F(trans) − F(X)(rad/公転 —— F は integrateFrame の面内の回転) */
export function mixing({ orb0, sHat, key, cT, cX, stepsPerOrbit, nOrb }) {
  const fT = unitField('trans', cT, sHat), fX = unitField(key, cX, sHat), both = (x, w) => add(fT(x, w), fX(x, w));
  const F = (velX) => integrateFrame({ orb0, velX, stepsPerOrbit, nOrb }).apsW;
  const aB = F(both), aT = F(fT), aX = F(fX);
  return { both: aB, trans: aT, partner: aX, mix: aB - aT - aX };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, sHat = [0, 0, 1];
  const orb = hypoOrbit({ a: 1, mu: 1, e: 0.2, iDeg: 5, nodeDeg: 20, omegaDeg: 70 });
  const sysU = { M: 1, m: 1e-30, R: 1, sunAxis: sHat, sSun: 1e-3, Rsun: 1, orb };
  // ① 分解の閉じ: 動径 + 接線 + 法線 = 全体(任意の場 —— 回転の型と並進の型を混ぜた場)
  { const d = (x, w) => add(scl(w, -1e-6 / nrm(x)), scl(crs([0.1, 0.2, 1], x), 1e-6)), parts = ['radial', 'tangent', 'normal'].map((c) => vectorRates(orb, { kind: 'vel', d: splitField(d, c) }, {})), all = vectorRates(orb, { kind: 'vel', d }, {});
    const sc = Math.max(all.LdotMag, Math.abs(all.apsW));
    S.closure = { apsW: Math.abs(parts.reduce((s, q) => s + q.apsW, 0) - all.apsW) / sc, L: nrm(sub(parts.reduce((s, q) => add(s, q.Ldot), [0, 0, 0]), all.Ldot)) / sc }; }
  // ② 並進の分の動径の成分 = −β ṙ r̂(源が静止 —— 受け手の速度の動径の成分)・回転の分の動径の成分は 0(s × p ⊥ p)
  { const st = stateAt(orb, 0.7), rh = scl(st.x, 1 / st.r), rdot = dot(st.v, rh), beta = 0.3, dT = (x, w) => scl(w, -beta), dR = (x) => scl(crs([0.1, 0.2, 1], x), 0.5);
    S.radial = { trans: nrm(sub(splitField(dT, 'radial')(st.x, st.v), scl(rh, -beta * rdot))), rot: nrm(splitField(dR, 'radial')(st.x, st.v)) }; }
  // ③ T1 の速さの指標 = 第334便a の t1Twist の par(s z)・z の奇・傾き 0 の軌道で T1 の列は 0
  { const x = [0.6, -0.3, 0.25], v = t1Speed(x, sHat, 2), xm = [0.6, -0.3, -0.25], orb0 = hypoOrbit({ a: 1, mu: 1, e: 0.2, iDeg: 0, nodeDeg: 0, omegaDeg: 30 });
    const zeroInc = DECL.t1Dirs.flatMap((dr) => DECL.t1Couplings.map((cp) => { const R = vectorRates(orb0, t1Effect({ ...sysU, orb: orb0 }, dr, cp), {}); return Math.max(Math.abs(R.apsW), R.LdotMag); }));
    S.t1 = { speed: Math.abs(v - 2 * 0.25), odd: Math.abs(v + t1Speed(xm, sHat, 2)), zeroInc: Math.max(...zeroInc) }; }
  // ④ 向きの基底: phi ⊥ ŝ・phi ⊥ p・normal ⊥ p と w・radial ∥ p・単位
  { const st = stateAt(orb, 1.3), e = Object.fromEntries(DECL.t1Dirs.map((d) => [d, t1Dir(d, st.x, st.v, sHat)]));
    S.dirs = Math.max(Math.abs(dot(e.phi, sHat)), Math.abs(dot(e.phi, st.x)), Math.abs(dot(e.normal, st.x)), Math.abs(dot(e.normal, st.v)), nrm(crs(e.radial, st.x)), ...Object.values(e).map((u) => Math.abs(nrm(u) - 1))); }
  // ⑤ 区間の和 = 全周(回転の型と並進の型 —— ω_W と L̂)
  { const eff = { kind: 'vel', d: (x, w) => add(scl(w, -1e-6 / nrm(x)), scl(crs(sHat, x), 1e-6 / nrm(x))) }, B = binRates(orb, eff, sHat), sc = Math.max(B.full.LdotMag, Math.abs(B.full.apsW));
    S.bins = { apsW: Math.abs(B.sumApsW - B.full.apsW) / sc, L: nrm(sub(B.sumLdot, B.full.Ldot)) / sc, marks: B.marks }; }
  // ⑥ 最小二乗の当てはめ: 既知の係数を戻す
  { const om = DECL.shapeOmegaDeg, c0 = [0.3, -0.2, 0.05, 0.7, -0.4], y = om.map((o) => { const w = o * D2R; return c0[0] + c0[1] * Math.cos(w) + c0[2] * Math.sin(w) + c0[3] * Math.cos(2 * w) + c0[4] * Math.sin(2 * w); });
    const F = harmonicFit(om, y); S.fit = Math.max(...F.coef.map((q, i) => Math.abs(q - c0[i])), F.rms); }
  // ⑦ 単位の場の写しと実単位の場の比(T1 vel —— 単位の軌道で c (z/r) ê・α = 1 の β ∝ 1/r)
  { const fx = unitField('t1phiVel', 1e-5, sHat), st = stateAt(orb, 2.1), ref = scl(t1Dir('phi', st.x, st.v, sHat), 1e-5 * st.x[2] / st.r);
    S.unit = nrm(sub(fx(st.x, st.v), ref)) / nrm(ref); }
  // ⑧ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => splitField(() => [0, 0, 0], 'x')), rejects(() => t1Dir('up', [1, 0, 0], [0, 1, 0], sHat)), rejects(() => t1Effect(sysU, 'phi', 'drag')), rejects(() => columnEffect(sysU, 'zzz')),
    rejects(() => frameAt([0, 0, 0], [0, 1, 0])), rejects(() => unitField('cut', 1, sHat))];
  return S;
}
export function pureGates(S) {
  return {
    closure: S.closure.apsW <= 1e-12 && S.closure.L <= 1e-12,
    radial: S.radial.trans <= 1e-15 && S.radial.rot <= 1e-15,
    t1: S.t1.speed <= 1e-15 && S.t1.odd <= 1e-15 && S.t1.zeroInc === 0,
    dirs: S.dirs <= 1e-14,
    bins: S.bins.apsW <= 1e-10 && S.bins.L <= 1e-10 && S.bins.marks.asc !== null && S.bins.marks.zMax.length === 2,
    fit: S.fit <= 1e-12,
    unit: S.unit <= 1e-14,
    rejects: S.rejects.every(Boolean),
  };
}
export { splitAbout, hypoOrbit, kappaMRadius, CENTURY_S, DECL334C, vec };

// 第337便k(原仮定者の回答(2026-11-15 —— 第138報の回答 2)AN729「鉛直の型は有力。方位の型が同時に効いても良い。見て分かる程の扁平率を生む自転の影響と考える」・AN732「回転引きずりは、４天体で合う結果を
//   重視。環の方が近似なので、環をノブで補正する」・原仮定者の指示(2026-11-08 —— 第132報)「ジャイロトルクは、回転体の軸に対して、軸を傾ける回転の力が、直行する軸の回転の力として現れる。
//   この直行を、物理現象と仮定する」・探索の方針(第138報)・統括の検証項目 R347):
//   **4 つの純関数の組** —— T1 剛体の場に対する相対の速度の型(第337便j の `dampRigEffect` を呼ぶ)の強さとノブ(落ち方のべき q・受け手の大きさのべき p・落ち方の基準の半径・速さ・χ)を、
//   観測の公転の変化のある 4 天体(フォボス・月・タイタン・トリトン)だけで決める(対数の最小二乗 —— 環は入れない)/T2 その組のまま土星の環(D・C・B・A・F)へ持ち出し、環の物差しを
//   何倍超えるかと、環の側を直す補正のノブ(受け手の大きさ・集まりの係数・定常のずれと半長軸の率の分け・帯の外の落ち方)を解く/T3 ジャイロの直交 —— 方位の作用の L̂ の率を L̂ のまわりに
//   90° 回して鉛直の作用(傾きの率)に読む(読み替えの列と足す列)/T4 鉛直の作用の強さを源の扁平率 f_flat のべきで読む
//   (器 tests/exp-w337k-gyrodrag.mjs と QA behavior.gyrodrag337k・docs.gyrodrag337k が読む —— html を読まない・状態を持たない・第337便i・第337便j ほかの lib は呼ぶだけ・エンジンの式を写さない)。
//
// ■ 区別: 回転引きずり(源の回転による空間の捩れ —— 源の引きずり半径 R_d が効く・本 lib の T1〜T4)・並進引きずり(本 lib では対照の剛体の場〔R_d が入らない〕としてだけ出る)・
//   軸引きずり(受け手の自転に効く量 —— 本 lib では出さない。T3 (iv) の受け手の自転の軸の 1 行は軸引きずりとは別の量)・潮汐(積まない —— 観測の公転の変化の担い手として文献で通例の量。
//   照らすだけ)。表は「候補」「探索」「未較正」「このノブの組では」。
// ■ 記号: 源の自転軸 k̂・受け手の公転の角運動量の向き L̂(= W)・源の赤道面に対する傾き i・方位の作用が与える L̂ の率 L̂̇_az(交点を回す向き —— k̂ × L̂ に沿う)・
//   **ジャイロの直交の読み**: L̂̇_⊥ = c σ L̂ × L̂̇_az(c = 直交の係数〔ノブ・既定 1〕・σ = 符号の読み〔plus = +1・minus = −1〕)→ L̂̇_az = Ω k̂ × L̂ のとき L̂̇_⊥ = c σ Ω (k̂ − L̂ cos i)・
//   di/dt = −c σ Ω sin i。読み替えの列(replace)は交点の成分を L̂̇_⊥ に置き換える・足す列(add)は交点の成分を残して L̂̇_⊥ を足す。
//   EQ-23(第330便b の `gyroResponse` —— dL/dt = N・歳差 Ω_prec = L × N/|L|²)は実のトルクに 90° 回した別のトルクを足さない —— L̂̇_az のトルクに対する EQ-23 の歳差の軸は
//   Ω (k̂ − L̂ cos i) で、本 lib の直交の読みは L̂ を**その軸の向きへ動かす**読み(EQ-23 では L̂ はその軸のまわりを回る —— 交点の回転そのもの)。
// ■ 言わないこと: 環の傾きがジャイロの直交で出るとは書かない。回転引きずりの強さを決めたとも、フォボスの軌道の縮みが回転引きずりで出るとも書かない(このノブの組で 4 天体が何倍の内か・
//   環の補正のノブの値・直交の係数 1 での桁まで)。扁平率のべきは候補(観測の配置と並べる表まで)。
import { sourceOf as sourceOfJ, recvSys, dampRigEffect, obsDlnA, nOverS, rSyncOf, LIT as LITJ, DECL as DECLJ, ringRow, pointsOf, ringJudge, integrate, rdOf, kappaMRadius, YR, G } from './lib-w337j-spinorbit.mjs';
import { effectOfSpec, controlEffect, heightLawEffect, ringSys, bandShape, sourceOf as sourceOfI } from './lib-w337i-rotring.mjs';
import { ratesOn, anglesRates } from './lib-w337b-mercuryband.mjs';
import { gyroResponse } from './lib-w330b-dragweight.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';
import { fObsOf } from './lib-w333a-rotdiff.mjs';

export const LIB_VERSION = 'w337k-gyrodrag-lib-2';   // 第340便h: orthRow の傾き・δ を atan2 に(lib-1 → lib-2)
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = nrm(a); return n > 0 ? scl(a, 1 / n) : [0, 0, 0]; };

/* ───────── 宣言(走らせた格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const SAT4 = Object.freeze(['phobos', 'moon', 'titan', 'triton']);
export const RINGS = Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']);
export const DECL = Object.freeze({
  /** T1: 型は第337便j の剛体の場に対する相対の速度 a = −λ|s| g S (w − χ s_* k̂ × p)・帯の形は ball(S = ρ²/r² —— slice・lor の帯の形では傾いた衛星が帯の外で 0 になる)・
   *  g = (R_base/ρ)^q × size^p。格子: χ ½・1 × 速さ s・s_d × 落ち方の基準の半径 R_eq(主 —— 扁平の則の赤道の引きずり半径)・R_obs × 受け手の大きさの読み(半径 R [m]・質量 m [kg])。
   *  q と p は 4 天体の対数の最小二乗で解く(連続)+ 離散の格子(q・p)。判定の物差し: 4 天体の 観測 ÷ 計算(第338便c の訂正 —— 式は ln(観測/計算)・ratios も 観測 ÷ 計算)の最大 ÷ 最小 S(λ は対数の中点 —— 各比は [S^−½, S^½] に入る)・
   *  「1 桁の内」= S ≤ 100(全部が 1/10〜10 倍)・「2 倍の内」= S ≤ 4(全部が ½〜2 倍) */
  t1: Object.freeze({ prof: 'ball', chi: Object.freeze([0.5, 1]), speeds: Object.freeze(['obs', 'sd']), bases: Object.freeze(['Req', 'Robs']), sizes: Object.freeze(['R', 'm']),
    qGrid: Object.freeze([0, 1, 2, 3, 4, 6, 8]), pGrid: Object.freeze([-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3]), order1: 100, order2: 4,
    main: Object.freeze({ speed: 'obs', base: 'Req', size: 'R' }),
    /** 4 つ目のノブ(足すノブの候補 —— 源の質量のべき k_m: (m_源/m_地球)^{k_m})で 4 式 4 未知を解く(自由度 0 —— 「合った」とは読まない) */
    hostMassRef: 5.9722e24 }),
  /** T2: 環の物差し(第337便i・第337便j と同じ —— 1e7 年の間 |Δ ln a| ≤ 1e-5)・環の粒子の高さの振れ 10 m・補正のノブの格子(粒子の半径・光学的厚さ) */
  t2: Object.freeze({ tYr: 1e7, drift: 1e-5, kepler: 1e-5, ringZ: 10, particleR: Object.freeze([0.01, 0.1, 1, 10]), heightProf: 'lor4' }),
  /** T3: 直交の係数 c(既定 1)・符号の読み plus・minus・方位の作用の型(第337便i の座標を運ぶ方位の場 3 つ・対照の剛体の場・T1 の組)・強さ(第337便i の主の組の λ)・環の物差し(1e7 年で傾きが e 分の 1) */
  t3: Object.freeze({ c: 1, signs: Object.freeze(['plus', 'minus']), azTypes: Object.freeze(['vel|slice', 'vel|lor4', 'vel|ball', 'rigid', 'dampRigT1']), lambdaMain337i: 6.5606e-7,
    lambdaMainSrc: '第337便i の正本 tests/out/rotring-337i.json の slice・鉛直へ寄せる場・軸比の R_eq・s の要る λ(6.56e-7 の写し —— 第337便j の器の PLAN.lambdaMain337i と同じ値)',
    tThinYr: 1e7, recv: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF', 'phobos', 'moon', 'titan', 'triton']) }),
  /** T4: 源 7・扁平率のべき k 0・1・2(土星で強さが同じになるように (f/f_土星)^k)・赤道面の近くの受け手(半径 2 R_obs・傾き 1e-5 rad —— 直交の読みの列は帯の形 ball〔切り口の帯は火星の R_eq 5.7 mm の内に置けない〕)・強さは土星で 1e7 年になる値 */
  t4: Object.freeze({ sources: Object.freeze(['saturn', 'jupiter', 'uranus', 'neptune', 'mars', 'earth', 'sun']), kPow: Object.freeze([0, 1, 2]), rOverR: 2, iRad: 1e-5, orthProf: 'ball', tRefYr: 1e7, ageYr: 4.5e9 }),
  integ: Object.freeze({ steps: Object.freeze([2000, 4000]), nOrb: 20 }),
});

/* ───────── 文献の値(本環境では未照合 —— 出典の名と確かさ)───────── */
export const LIT = Object.freeze({
  note: '文献の値・未照合(この環境から一次資料のサイトに届かない —— 出典の名と値はリポジトリの中の値〔第337便j の LIT・第334便a の LIT334A〕の写しと記憶の値)',
  /** 受け手の質量 [kg](質量の読みの p 用) */
  mass: Object.freeze({ phobos: 1.0659e16, moon: 7.346e22, titan: 1.3452e23, triton: 2.139e22, ring: 3.77e3 }),
  massSrc: 'フォボスは第337便j の LIT(NASA NSSDC の衛星の表)・月は第334便a の LIT334A・タイタン 1.3452e23・トリトン 2.139e22 は NASA NSSDC の衛星の表の記憶の値・環の粒子は第337便i の宣言(半径 1 m・密度 900 —— 文献の値ではない)—— 文献の値・未照合・確かさ 中',
  /** 環の光学的厚さ τ の代表(集まりの係数の読み用 —— 環ごとの幅のある値の中央の桁) */
  tau: Object.freeze({ ringD: 1e-3, ringC: 0.1, ringB: 2, ringA: 0.5, ringF: 0.5 }),
  tauSrc: 'Cuzzi et al. 2010 Science 327, 1470・Esposito 2002 Rep. Prog. Phys. 65, 1741 の環ごとの光学的厚さの桁(D 環 1e-3 以下・C 環 0.05〜0.2・B 環 1〜5・A 環 0.4〜1・F 環の芯 0.1〜1 の中央の桁)—— 文献の値・未照合・確かさ 低(桁)',
  /** 源の観測の配置(環・主な衛星が赤道面にあるか)—— 一般の記述の写し */
  layout: Object.freeze({
    saturn: Object.freeze({ group: 'with', ring: true, eqSat: true, note: '環あり・主な衛星(タイタン 0.35°)は赤道面' }),
    jupiter: Object.freeze({ group: 'with', ring: true, eqSat: true, note: '環あり・ガリレオ衛星は赤道面(0.05〜0.47°)' }),
    uranus: Object.freeze({ group: 'with', ring: true, eqSat: true, note: '環あり・主な衛星は赤道面(自転の軸が 98° 傾いていても)' }),
    neptune: Object.freeze({ group: 'mixed', ring: true, eqSat: false, note: '環あり(淡い)・主な衛星トリトンは逆行で 157°(混)' }),
    mars: Object.freeze({ group: 'with', ring: false, eqSat: true, note: '環なし・フォボス 1.1°・ダイモス 0.9° は赤道面の近く' }),
    earth: Object.freeze({ group: 'without', ring: false, eqSat: false, note: '環なし・月は赤道面に無い(18〜29°)' }),
    sun: Object.freeze({ group: 'without', ring: false, eqSat: false, note: '環なし・惑星は太陽の赤道面から 3〜7°' }),
  }),
  layoutSrc: 'NASA NSSDC の惑星と衛星の表の一般の記述(環の有無・衛星の赤道面に対する傾き)—— 文献の値・未照合・確かさ 高(有無の分け)',
  /** 太陽系の年齢(T4 の短い/長いの目安) */
  ageSrc: '太陽系の年齢 約 4.5e9 年(隕石の年代の通例の値)—— 文献の値・未照合・確かさ 高',
  /** 第337便i の水星の近点の率(1PN に対する比 —— 絞った 3 組)の写し */
  merc337i: Object.freeze([4.22e-19, 8.98e-11, 1.22e-10]),
  merc337iSrc: '第337便i の正本 tests/out/rotring-337i.json の絞った 3 組の水星の近点の率 ÷ 1PN(4.22e-19・8.98e-11・1.22e-10 の写し)',
});

/* ───────── 源と受け手 ───────── */
/** 源(第337便j の sourceOf に天王星と太陽を足す —— 自転軸 ẑ・速さは |s|) */
export function sourceOf(key) {
  if (['saturn', 'mars', 'jupiter', 'earth', 'neptune'].includes(key)) return sourceOfJ(key);
  if (key === 'uranus') { const B = LIT334A.bodies.find((b) => b.key === 'uranus'); return { key, ja: B.name, m: B.m, Robs: B.R, s: 2 * Math.PI / (Math.abs(B.P) * 3600), fFlat: B.f, fObs: fObsOf(B.moi), axis: [0, 0, 1] }; }
  if (key === 'sun') { const S = sourceOfI('sun'); return Object.assign({}, S, { axis: [0, 0, 1] }); }
  throw new RangeError('sourceOf: 源 ' + key);
}
export const recvOf = (k) => { const r = LITJ.t2Receivers.find((q) => q.key === k); if (!r) throw new RangeError('recvOf: 受け手 ' + k); return r; };
/** 受け手の系(環の粒子は高さの振れ ringZ から傾き) */
export function recvSysOf(key, ringZ = DECL.t2.ringZ) {
  const r = recvOf(key), src = sourceOf(r.host), iDeg = r.iDeg === null ? Math.asin(ringZ / r.a) * 180 / Math.PI : r.iDeg;
  return { r, src, iDeg, sys: recvSys(src, { a: r.a, iDeg }), n: Math.sqrt(G * src.m / r.a ** 3) };
}
/** 受け手の大きさの因子(半径の読み R^p [m]・質量の読み m^p [kg]) */
export function sizeFactor(key, size, p) {
  if (!['R', 'm'].includes(size) || !isFin(p)) throw new RangeError('sizeFactor: 読み R・m');
  const isRing = RINGS.includes(key), x = size === 'R' ? (isRing ? 1 : recvOf(key).R) : (isRing ? LIT.mass.ring : LIT.mass[key]);
  return Math.pow(x, p);
}
/** 落ち方の基準の半径 ÷ R_obs(dampRigEffect は R_obs を基準にする —— R_eq の基準は定数の倍 (R_eq/R_obs)^q) */
export const baseRatio = (src, base) => (base === 'Robs' ? 1 : base === 'Req' ? rdOf(src, 'Req') / src.Robs : (() => { throw new RangeError('baseRatio: 基準 ' + base); })());

/* ───────── T1 4 天体で強さを決める ───────── */
/** 単位の λ・p = 0 の半長軸の率(数 —— 第337便j の dampRigEffect × 第337便i の ringRow)と q を変える読みの変数 x = ln(R_base/a) */
export function unitRate(key, { chi, speed, qFall = 0, base = 'Req' }) {
  const R = recvSysOf(key), eff = dampRigEffect(R.src, { prof: DECL.t1.prof, chi, speed, qFall, lambda: 1 }), row = ringRow(R.sys, eff, pointsOf(R.sys, null));
  const kb = Math.pow(baseRatio(R.src, base), qFall);
  return { key, dlnA: row.dlnA * kb, dlnI: row.dlnI * kb, x: Math.log(baseRatio(R.src, base) * R.src.Robs / R.r.a), n: R.n, nOverS: R.n / R.src.s, pro: R.iDeg < 90 };
}
/** 対数の最小二乗(y = ln λ + q x + p z + k w を 2〜4 未知で): 正規方程式をガウスの消去で */
export function lsq(rows, cols) {
  const A = rows.map((r) => cols.map((c) => (c === 'one' ? 1 : r[c]))), y = rows.map((r) => r.y), n = cols.length;
  const M = Array.from({ length: n }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (j < n ? A.reduce((s, a) => s + a[i] * a[j], 0) : A.reduce((s, a, k) => s + a[i] * y[k], 0))));
  for (let i = 0; i < n; i++) { let piv = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k; [M[i], M[piv]] = [M[piv], M[i]];
    if (!(Math.abs(M[i][i]) > 1e-300)) return null; for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; } }
  const sol = Object.fromEntries(cols.map((c, i) => [c, M[i][n] / M[i][i]]));
  const res = rows.map((r) => r.y - cols.reduce((s, c) => s + sol[c] * (c === 'one' ? 1 : r[c]), 0));
  return { sol, res };
}
/** 比の広がり S = exp(max res − min res)・中点の λ での比 */
export const spreadOf = (logRatios) => { const mx = Math.max(...logRatios), mn = Math.min(...logRatios), mid = 0.5 * (mx + mn); return { S: Math.exp(mx - mn), ratiosAtMid: logRatios.map((v) => Math.exp(v - mid)), mid }; };
/** 1 つの組(χ・速さ・基準・大きさの読み)の 4 天体の表: 符号・q 0 の比の広がり・連続の最小二乗(q・p)・格子の最良・4 つ目のノブで 4 式 */
export function t1Set({ chi, speed, base, size }, { qGrid = DECL.t1.qGrid, pGrid = DECL.t1.pGrid } = {}) {
  const obs = Object.fromEntries(SAT4.map((k) => { const R = recvSysOf(k); return [k, obsDlnA(k, R.r.a, R.n)]; }));
  const u0 = SAT4.map((k) => unitRate(k, { chi, speed, base, qFall: 0 }));
  const signs = u0.map((u) => ({ key: u.key, pred: Math.sign(u.dlnA), obs: Math.sign(obs[u.key]), match: Math.sign(u.dlnA) === Math.sign(obs[u.key]) }));
  const nMatch = signs.filter((s) => s.match).length;
  const out = { spec: { chi, speed, base, size }, signs, nMatch, obs, unit0: u0.map((u) => ({ key: u.key, dlnA: u.dlnA, x: u.x, nOverS: u.nOverS })) };
  if (nMatch < 4) return Object.assign(out, { ok: false, why: '符号が 4 天体で合わない(' + nMatch + '/4)' });
  const rows = u0.map((u) => ({ key: u.key, y: Math.log(obs[u.key] / u.dlnA), x: u.x, z: Math.log(sizeFactor(u.key, size, 1)), w: Math.log(sourceOf(recvOf(u.key).host).m / DECL.t1.hostMassRef) }));
  const s0 = spreadOf(rows.map((r) => r.y));                                         // q = 0・p = 0(λ だけ)
  const fq = lsq(rows, ['one', 'x']), fqp = lsq(rows, ['one', 'x', 'z']), f4 = lsq(rows, ['one', 'x', 'z', 'w']);
  const sp = (f) => (f ? spreadOf(f.res) : null);
  // 離散の格子(q は数で —— 傾いた受け手では (R/ρ)^q は (R/a)^q と少し違う)
  let best = null, bestPos = null;
  const uq = Object.fromEntries(qGrid.map((q) => [q, SAT4.map((k) => unitRate(k, { chi, speed, base, qFall: q }))]));
  for (const q of qGrid) for (const p of pGrid) { const lr = uq[q].map((u) => Math.log(obs[u.key] / (u.dlnA * sizeFactor(u.key, size, p)))), s = spreadOf(lr);
    const cand = { q, p, S: s.S, lambda: Math.exp(s.mid), ratios: Object.fromEntries(SAT4.map((k, i) => [k, s.ratiosAtMid[i]])) };
    if (!best || s.S < best.S) best = cand; if (p >= 0 && (!bestPos || s.S < bestPos.S)) bestPos = cand; }
  // 連続の解を数で照らす(q を連続の値で dampRigEffect に渡し直す)
  const qp = fqp ? fqp.sol : null, chk = qp ? SAT4.map((k) => unitRate(k, { chi, speed, base, qFall: qp.x })) : null;
  const lrChk = chk ? chk.map((u) => Math.log(obs[u.key] / (u.dlnA * sizeFactor(u.key, size, qp.z)))) : null, sChk = lrChk ? spreadOf(lrChk) : null;
  return Object.assign(out, { ok: true,
    q0: { S: s0.S, lambda: Math.exp(s0.mid), ratios: Object.fromEntries(SAT4.map((k, i) => [k, s0.ratiosAtMid[i]])) },
    fitQ: fq ? { q: fq.sol.x, S: sp(fq).S } : null,
    fitQP: qp ? { q: qp.x, p: qp.z, lnLambda: qp.one, Sapprox: sp(fqp).S, S: sChk.S, lambda: Math.exp(sChk.mid), ratios: Object.fromEntries(SAT4.map((k, i) => [k, sChk.ratiosAtMid[i]])), approxGap: Math.abs(Math.log(sChk.S / sp(fqp).S)) } : null,
    grid: best, gridPos: bestPos,
    four: f4 ? { q: f4.sol.x, p: f4.sol.z, km: f4.sol.w, maxRes: Math.max(...f4.res.map(Math.abs)) } : null });
}

/* ───────── T2 環へ持ち出して補正のノブを解く ───────── */
/** 環の粒子(半径 1 m)の単位の行(q・χ・速さ・基準)と、λ・p での物差しの比(半長軸の率 × 1e7 年 ÷ 1e-5)・傾きの e 分の 1 の時間・定常のずれ(動径の力の平均) */
export function ringRows({ chi, speed, base, size, q, p, lambda }) {
  const T = DECL.t2.tYr * YR;
  return RINGS.map((k) => {
    const R = recvSysOf(k), eff = dampRigEffect(R.src, { prof: DECL.t1.prof, chi, speed, qFall: q, lambda: 1 }), pts = pointsOf(R.sys, null), row = ringRow(R.sys, eff, pts), kb = Math.pow(baseRatio(R.src, base), q);
    const g = kb * sizeFactor(k, size, p), dlnA = lambda * g * row.dlnA, dlnI = lambda * g * row.dlnI;
    // 定常のずれ δΩ/Ω = −⟨a·r̂⟩/(2 n² a)(半長軸の率を粒子どうしのやり取りで打ち消した読みで残る分 —— 動径の力の公転の平均)
    let ar = 0, ws = 0; for (const { st, tw } of pts) { const a = eff.a({ x: st.x, v: st.v, r: st.r }); ar += tw * dot(a, unit(st.x)); ws += tw; }
    const dOmSteady = -lambda * g * (ar / ws) / (2 * R.n * R.n * R.r.a);
    return { key: k, a: R.r.a, nOverS: R.n / R.src.s, unitDlnA: row.dlnA * kb, dlnA, ratio: Math.abs(dlnA) * T / DECL.t2.drift, sign: Math.sign(dlnA), tiltEfoldYr: dlnI < 0 ? -1 / (dlnI * YR) : null,
      dOmSteady, steadyRatio: Math.abs(dOmSteady) / DECL.t2.kepler };
  });
}
/** 補正のノブ: (a) 粒子の半径(p > 0 のとき R_need = (1/比)^{1/p} m)(b) 集まりの係数 ε_need = 1/比 と光学的厚さのべき(c) 半長軸の率を打ち消す読みで残る定常のずれ(d) 帯の外の落ち方(lor4 の帯の形)の環と衛星の因子 */
export function corrections(rows, { p, size }, t1spec) {
  const out = {};
  out.size = rows.map((r) => ({ key: r.key, need: p !== 0 ? Math.pow(1 / r.ratio, 1 / p) * (size === 'R' ? 1 : LIT.mass.ring) : null }));
  out.sizeOne = p > 0 ? Math.min(...out.size.map((x) => x.need)) : p < 0 ? Math.max(...out.size.map((x) => x.need)) : null;
  out.coll = rows.map((r) => ({ key: r.key, epsNeed: 1 / r.ratio, tau: LIT.tau[r.key] }));
  out.collOne = Math.min(...out.coll.map((x) => x.epsNeed));
  const lx = (f) => rows.map(f).map(Math.log), slope = (xs, ys) => { const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length; return xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) ** 2, 0); };
  out.collPowTau = slope(lx((r) => LIT.tau[r.key]), lx((r) => 1 / r.ratio));
  out.collPowR = slope(lx((r) => r.a), lx((r) => 1 / r.ratio));
  out.steadyMax = Math.max(...rows.map((r) => r.steadyRatio));
  // (d) 帯の外の落ち方: 同じ組で帯の形を lor4 にした単位の率 ÷ ball の単位の率(環と 4 天体)
  const hp = DECL.t2.heightProf, fac = (k) => { const R = recvSysOf(k), H0 = rdOf(R.src, 'Req'), pts = pointsOf(R.sys, H0);
    const a = ringRow(R.sys, dampRigEffect(R.src, { prof: hp, chi: t1spec.chi, speed: t1spec.speed, qFall: 0, lambda: 1 }), pts).dlnA, b = ringRow(R.sys, dampRigEffect(R.src, { prof: 'ball', chi: t1spec.chi, speed: t1spec.speed, qFall: 0, lambda: 1 }), pts).dlnA;
    return b !== 0 ? a / b : null; };
  out.height = { prof: hp, rings: RINGS.map((k) => ({ key: k, factor: fac(k) })), sats: SAT4.map((k) => ({ key: k, factor: fac(k) })) };
  return out;
}

/* ───────── T3 ジャイロの直交 ───────── */
/** 方位の作用の型 → 効果(第337便i の座標を運ぶ方位の場・対照の剛体の場〔並進引きずりの回転の分 —— R_d が入らない〕・T1 の組の剛体の場に対する相対の速度) */
export function azEffect(src, type, { lambda, t1 } = {}) {
  if (type.startsWith('vel|')) return effectOfSpec(src, { prof: type.slice(4), action: 'vel', reading: 'Req', speed: 'obs', lambda });
  if (type === 'rigid') return controlEffect(null, src, 'rigid', lambda);
  if (type === 'dampRigT1') { if (!t1) throw new RangeError('azEffect: T1 の組が要る'); return dampRigEffect(src, { prof: DECL.t1.prof, chi: t1.chi, speed: t1.speed, qFall: t1.q, lambda: lambda * Math.pow(baseRatio(src, t1.base), t1.q) }); }
  throw new RangeError('azEffect: 型 ' + type);
}
/** 直交の読み: L̂ の率 L̂̇(ratesOn の Ldot)のうち交点を回す成分(k̂ × W の向き)を取り出し、c σ W × (その成分) を作る —— mode replace(交点の成分を置き換え)・add(足す) */
export function orthLdot(Ldot, W, k, { c = DECL.t3.c, sign = 'plus', mode = 'replace' } = {}) {
  if (!['plus', 'minus'].includes(sign) || !['replace', 'add'].includes(mode) || !isFin(c)) throw new RangeError('orthLdot: 宣言');
  const e = unit(crs(k, W)), Nn = scl(e, dot(Ldot, e)), rot = scl(crs(W, Nn), c * (sign === 'plus' ? 1 : -1));
  return mode === 'replace' ? add(sub(Ldot, Nn), rot) : add(Ldot, rot);
}
/** 受け手 1 つの方位の作用の行(単位の λ・源の赤道面を基準): 交点と傾きの率・直交の読みの傾きの率(符号 2 × 列 2)・赤道面から離れる/寄る */
export function orthRow(sys, eff, pts, k, opts = {}) {
  const R = ratesOn(sys.orb, eff, pts), base = anglesRates(sys.orb, R, k), W = sys.orb.W, sinI = nrm(crs(W, k)), cosI = dot(W, k), iRad = Math.atan2(sinI, cosI), del = Math.atan2(sinI, Math.abs(cosI));
  // 第340便h(統括の検証項目 R363): 傾きと赤道面からの角 δ を桁を失わない形で(旧 acos と min(i, π − i) の差は、土星の環〔z/r ≈ 1e-7〕で δ の有効数字を 1〜2 桁に落としていた —— δ は傾きの率の分母)
  const per = {};
  for (const sign of DECL.t3.signs) for (const mode of ['replace', 'add']) {
    const L2 = orthLdot(R.Ldot, W, k, { c: opts.c === undefined ? DECL.t3.c : opts.c, sign, mode }), a = anglesRates(sys.orb, Object.assign({}, R, { Ldot: L2 }), k);
    const dOrth = a.di - base.di, toPlane = iRad < Math.PI / 2 ? -dOrth : dOrth;   // 直交の読みで足された傾きの率・赤道面からの角 δ = min(i, π − i) が減る向きを正(寄る)
    per[sign + '|' + mode] = { di: a.di, dnode: a.dnode, dlnI: a.di / del, dlnIorth: dOrth / del, toPlane: Math.sign(toPlane) };
  }
  return { iDeg: iRad / D2R, di: base.di, dnode: base.dnode, dlnIown: base.di / del, dlnA: R.dlnA, per };
}
/** 直交の読みを速度の場として置く(数の照らし用): d = ω × x・ω = c σ Ω_f (L̂ × k̂)・Ω_f = 方位の場の角速度(剛体の場は λ s) */
export function orthFieldEffect(src, { c = 1, sign = 'plus', Omega }) {
  const k = unit(src.axis), sg = sign === 'plus' ? 1 : -1;
  return { kind: 'vel', d: (x, v) => { const L = unit(crs(x, v)), w = scl(crs(L, k), c * sg * Omega); return crs(w, x); } };
}
/** EQ-23(第330便b の gyroResponse)の歳差の軸と直交の読みの L̂ の率の向き: L̂̇_az = Ω k̂ × L̂ のトルクに対して Ω_prec = Ω (k̂ − L̂ cos i) —— 直交の読み(plus・c 1)は L̂̇ = Ω_prec */
export function eq23Compare(L, k, Omega) {
  const N = scl(crs(k, L), Omega), g = gyroResponse(L, N), orth = orthLdot(scl(crs(k, unit(L)), Omega), unit(L), k, { c: 1, sign: 'plus', mode: 'replace' });
  return { precession: g.precession, orth, rel: nrm(sub(g.precession, orth)) / Math.max(nrm(orth), 1e-300), dLsame: nrm(sub(g.dL, N)) };
}

/* ───────── T4 扁平率との関係 ───────── */
/** 源の行: 扁平率・自転 ÷ 破断の速さ・赤道面の近くの受け手(2 R_obs)の高さ則 T1 の鉛直の率と直交の読み(座標を運ぶ方位の場 ball の交点の率を直交に回した傾きの率)(単位の λ・c 1) */
export function flatRow(key) {
  const src = sourceOf(key), r = DECL.t4.rOverR * src.Robs, sys = ringSys(src, { r, zMax: r * Math.sin(DECL.t4.iRad) }), H0 = rdOf(src, 'Req'), pts = pointsOf(sys, null), k = unit(src.axis);
  const hl = ringRow(sys, heightLawEffect(src, { law: 'T1', reading: 'Req', speed: 'obs', lambda: 1 }), pts);
  const az = orthRow(sys, effectOfSpec(src, { prof: DECL.t4.orthProf, action: 'vel', reading: 'Req', speed: 'obs', lambda: 1 }), pts, k);
  return { key, ja: src.ja, fFlat: src.fFlat, s: Math.abs(src.s), sBreak: Math.sqrt(G * src.m / src.Robs ** 3), spinOverBreak: Math.abs(src.s) / Math.sqrt(G * src.m / src.Robs ** 3), Req: H0,
    hlDlnI: hl.dlnI, orthDlnI: az.per['plus|replace'].dlnIorth, layout: LIT.layout[key] };
}
/** k のべきで並べた e 分の 1 の時間(土星で tRef になる強さ)と「有」と「無」が分かれるか(混の源は両側で読む) */
export function flatSplit(rows, col, kPow) {
  const sat = rows.find((r) => r.key === 'saturn'), T0 = DECL.t4.tRefYr;
  const t = rows.map((r) => ({ key: r.key, group: r.layout.group, tYr: T0 * (sat[col] / r[col]) * Math.pow(sat.fFlat / r.fFlat, kPow) }));
  const W = t.filter((x) => x.group === 'with'), O = t.filter((x) => x.group === 'without'), M = t.filter((x) => x.group === 'mixed');
  const maxW = Math.max(...W.map((x) => x.tYr)), minO = Math.min(...O.map((x) => x.tYr));
  const ageW = W.every((x) => x.tYr < DECL.t4.ageYr), ageO = O.every((x) => x.tYr > DECL.t4.ageYr);
  return { col, k: kPow, times: t, split: maxW < minO, margin: minO / maxW, mixedSideWith: M.every((x) => x.tYr <= maxW), mixedSideWithout: M.every((x) => x.tYr >= minO), ageSplit: ageW && ageO };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // ① 直交の読み: L̂̇_az = Ω k̂ × L̂ → L̂̇_⊥ = Ω (k̂ − L̂ cos i)・di/dt = −Ω sin i・c = 0 で交点の成分を消すだけ(傾きの率 0)・minus は符号が逆・add は交点の成分を残す
  { const k = [0, 0, 1], i = 0.3, W = [Math.sin(i) * 0.6, -Math.sin(i) * 0.8, Math.cos(i)], Om = 2.7, Laz = scl(crs(k, W), Om);
    const rp = orthLdot(Laz, W, k), rm = orthLdot(Laz, W, k, { sign: 'minus' }), r0 = orthLdot(Laz, W, k, { c: 0 }), ra = orthLdot(Laz, W, k, { mode: 'add' });
    const want = scl(sub(k, scl(W, Math.cos(i))), Om);
    S.orth = { plus: nrm(sub(rp, want)) / nrm(want), minus: nrm(add(rm, want)) / nrm(want), zero: nrm(r0), add: nrm(sub(ra, add(Laz, want))) / nrm(want),
      di: Math.abs((-dot(rp, k) / Math.sin(i)) / (-Om * Math.sin(i)) - 1) }; }
  // ② EQ-23 の歳差の軸と直交の読みの向きが同じ・EQ-23 の dL = N(90° 回した別のトルクを足さない)
  { const c = eq23Compare([0.2, -0.5, 2.0], [0, 0, 1], 1.3); S.eq23 = { rel: c.rel, dL: c.dLsame }; }
  // ③ 直交の読みを速度の場で置いた数(剛体の場 Ω = λ s)と、方位の剛体の場の L̂̇ を直交に回した値が同じ(小さい e)・時間積分の傾きの率が一次と同じ
  { const sat = sourceOf('saturn'), sys = ringSys(sat, { r: 1.0e8, zMax: 1e5, e: 1e-5 }), pts = pointsOf(sys, null), k = [0, 0, 1], lam = 1e-9;
    const az = ratesOn(sys.orb, controlEffect(null, sat, 'rigid', lam), pts), want = orthLdot(az.Ldot, sys.orb.W, k), fld = ratesOn(sys.orb, orthFieldEffect(sat, { Omega: lam * sat.s }), pts);
    const lamI = 1e-4 / (20 * 2 * Math.PI / Math.sqrt(G * sat.m / 1e24) * 0.5 * sat.s);   // 20 周で Δ ln i ≈ 1e-4
    const first = anglesRates(sys.orb, ratesOn(sys.orb, orthFieldEffect(sat, { Omega: lamI * sat.s }), pts), k).di / sys.iRad;
    const runs = DECL.integ.steps.map((n) => integrate(sys, orthFieldEffect(sat, { Omega: lamI * sat.s }), { nOrb: DECL.integ.nOrb, steps: n }).dlnI);
    S.field = { ldot: nrm(sub(fld.Ldot, want)) / nrm(want), integ: Math.abs(runs[1] / first - 1), steps: Math.abs(runs[0] / runs[1] - 1), first, runs }; }
  // ④ T1 の型: 単位の率の符号が n/s = χ で変わる(第337便j の境目)・λ = 0 で 0・p と q の因子(R^p・(R_eq/R_obs)^q)が一次で掛かる
  { const a = unitRate('phobos', { chi: 1, speed: 'obs', base: 'Robs' }), b = unitRate('moon', { chi: 1, speed: 'obs', base: 'Robs' });
    const R = recvSysOf('phobos'), zero = ringRow(R.sys, dampRigEffect(R.src, { prof: 'ball', chi: 1, qFall: 0, lambda: 0 }), pointsOf(R.sys, null));
    const q2 = unitRate('phobos', { chi: 1, speed: 'obs', base: 'Req', qFall: 2 }), q2o = unitRate('phobos', { chi: 1, speed: 'obs', base: 'Robs', qFall: 2 });
    S.t1 = { signs: [Math.sign(a.dlnA), Math.sign(b.dlnA)], zero: Math.max(...['dlnA', 'dlnI'].map((x) => Math.abs(zero[x]))), base: Math.abs(q2.dlnA / q2o.dlnA / Math.pow(baseRatio(R.src, 'Req'), 2) - 1),
      size: Math.abs(sizeFactor('phobos', 'R', 1.5) / Math.pow(11.08e3, 1.5) - 1) }; }
  // ⑤ 最小二乗: 4 点を厳密に通る線を作って解くと元の係数・残差 0
  { const rows = [[1, 2, 0.3], [2, -1, 1.1], [0.5, 0.7, -2], [3, 1.5, 0.4]].map(([x, z, w]) => ({ x, z, w, y: 0.7 + 1.9 * x - 0.4 * z + 0.25 * w })), f = lsq(rows, ['one', 'x', 'z', 'w']);
    S.lsq = Math.max(Math.abs(f.sol.one - 0.7), Math.abs(f.sol.x - 1.9), Math.abs(f.sol.z + 0.4), Math.abs(f.sol.w - 0.25), ...f.res.map(Math.abs)); }
  // ⑥ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => sourceOf('venus')), rejects(() => recvOf('io2')), rejects(() => sizeFactor('moon', 'x', 1)), rejects(() => baseRatio(sourceOf('mars'), 'Rx')),
    rejects(() => orthLdot([1, 0, 0], [0, 0, 1], [0, 0, 1], { sign: 'up' })), rejects(() => azEffect(sourceOf('saturn'), 'spin', { lambda: 1 }))];
  return S;
}
export function pureGates(S) {
  return {
    orth: S.orth.plus <= 1e-12 && S.orth.minus <= 1e-12 && S.orth.zero <= 1e-15 && S.orth.add <= 1e-12 && S.orth.di <= 1e-12,
    eq23: S.eq23.rel <= 1e-12 && S.eq23.dL === 0,
    field: S.field.ldot <= 1e-3 && S.field.integ <= 2e-2 && S.field.steps <= 1e-3,
    t1: S.t1.signs[0] === -1 && S.t1.signs[1] === 1 && S.t1.zero === 0 && S.t1.base <= 1e-12 && S.t1.size <= 1e-12,
    lsq: S.lsq <= 1e-9,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}
export { ringRow, pointsOf, ringJudge, rdOf, kappaMRadius, YR, G, nOverS, rSyncOf, bandShape, DECLJ, LITJ };

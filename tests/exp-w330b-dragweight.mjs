// 第330便b(原仮定者の整理(2026-11-08)「引きずり = Σ(相対速度 × 重み)/Σ重み(自分を含む)・重み = 質量/距離²・慣性移動 = 自分自身の引きずり」「中間の天体が引きずられて
//   並進引きずりが連鎖するので、ディスクは平坦回転する」「ジャイロ効果も DFM の範囲」「2 本の腕は密度波・棒は現状は解決案は無い」・原仮定者の回答(2026-11-08 —— AN578・AN580)・
//   統括の検証項目 R308): **第132報の重みの式と今のエンジンの経路の対応・連鎖と平坦な回転の低 N の試し・ジャイロと歳差の窓・密度波のラベルと共鳴の半径・回転する枠の欠測の修正の器**
//   (段 dragweight-330b —— 正本 tests/out/dragweight-w330b.json・lib tests/lib-w330b-dragweight.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第321便c・第327便b・
//   第328便a の lib の本文は変えない(第329便b の契約の lib は欠測の修正だけ —— lib-2)。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d の**写し**〔器の中 —— 本の JSON は 1 bit も変えない〕を受理器と
//   読み口 inertialDragIsqState に通す —— 步は進めない)。1 プロセス。入力は html・NGC 3198 の rotmod の写しの fixture(第329便b —— 第三者の写し)。
//   本の表は 🗺️ を .find で引くだけ(内蔵の全部の本を数えない —— 領域は名指しの 1 本)。回転する枠の欠測の修正(第329便b の契約の lib-2)の照合は QA lint.dragWeight330b が持つ。
//
// ■ 何をするか
//   E 今のエンジンの経路との対応: 受理器の試し(🗺️ の写しで kernel と rdRule の組 —— 拒否の文)・3 体の写し(太陽・地球・月)の β_ij を
//     エンジンの読み口と第132報の点の式(重み m/r^p・自己の重みの型 3 つ)で比べる(K1 の本 = 規則 R_d = Y_k m・K2 の写し = 宣言の半径)
//   E′ 成分ごとの対応(原仮定者の補足(2026-11-08)「回転引きずりは座標変換 —— 角速度は距離で変わらず接線の速度は r に比例・重み 1/r² で 1/r に見える」): 🗺️ の 2 体の写し(太陽・地球 ——
//     回転と軸を宣言)で地球の距離を 1・2・4・8 倍にしたときのエンジンの読み口の並進 β・回転の係数・軸の ω の両対数の傾き(K1 の規則・K2 の宣言の半径)と、lib の componentScaling
//     (並進 m v/r²・回転の座標変換 m Ω r/r²・K1 の並進 m v/r・エンジンの回転と軸の項 —— W を一定と置いた分子)を同じ表に
//   R 回転引きずりの回転の口(原仮定者の補足その2(2026-11-08) —— 順回転・重み m/r²)と潮汐の口の二重計上の照合: 🗺️ の本の宣言(月–地球・イオ–木星)から受け手の自転・源の自転・
//     公転の平均運動 n(潮汐の目標)を作り、回転の口の重み β(点の式・自己 ballHarmonic —— R_d = Y_k m と宣言の半径の 2 つ)と滑りを潮汐の滑りと並べる(本の JSON を読むだけ)
//   GW 銀河の回転引きずりの太陽系の枠への窓の角(第329便b の天の川の Ω —— 回転の口の重みの比 × Ω × 時間の窓)
//   C 連鎖と平坦な回転の低 N の試し(NGC 3198 の恒星の円盤の面密度〔fixture の SBdisk × Υ_disk〕と指数円盤の宣言・中心の有限の球の自転・境界・自己の重みの型と半径・
//     重みの距離の次数・方位の点の数・環の間隔)—— 速度の形 U(R)・外側のべき・分母 W の内訳
//   G ジャイロ: 地球の歳差(太陽と月の軌道の平均のトルク → gyroResponse → 円錐の回転率)と文献の周期の照合(残差)・窓の角
//   W 密度波のラベルと共鳴の半径(第329便b の lib の labelsTable —— 宣言した Ω_p の格子で ILR・CR・OLR)・棒は notClaim
// ■ 言わないこと: 円盤の速度の形・連鎖・今の invSq の式との関係・歳差の窓は、宣言した型の表の値と対応表として書く(説明・提示・同定・判定の語を付けない)・
//   `κ_epi` と κ_D を同じ量と書かない・棒の解を書かない・引きずり d を力と書かない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w330b-dragweight.mjs';
import * as GR from './lib-w329b-galrot.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🗺️ solarSystem16Inertial3d の 1 本〔写しの元 —— .find で引く〕。
//   roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   エンジンを読む(core)。ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄 familyRole は読まない)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w330b-dragweight-1';
export const OUT_MAIN = 'tests/out/dragweight-w330b.json';
export const FIXTURE = 'tests/fixtures/ngc3198-rotmod-w329b.json';
export const BOOK_ID = 'solarSystem16Inertial3d';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
export const NOT_CLAIM = Object.freeze(['円盤の速度の形は宣言した型の表の値(平坦かどうかを主張しない —— 自己の重みの大きさと離散化に強く依る)', '連鎖の存在と平坦な回転は別の事柄(3 点の固定境界の例)',
  '今の invSq と第132報の式の関係は、どの項が同じでどの項が違うかの対応表(式の同定ではない)', '歳差の窓は角の表(無視してよいかの判定ではない)',
  'κ_epi(周転円の振動数)と κ_D は別の量', 'Ω_p = Ω − κ_epi/2 を全半径の規則にしない(平坦な回転で 1/R に依る)', '棒渦巻の棒は未解決(notClaim)',
  'ジャイロ・歳差は熱に数えない(保存の運動)', '引きずり d は速度で、力・加速度ではない']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 3 体の写しの添字(🗺️ の 0 太陽・3 地球・4 月) */
  trio: Object.freeze([0, 3, 4]), trioNames: Object.freeze(['太陽', '地球', '月']),
  /** 受理器の試しの組(kernel・rdRule —— null は鍵を外す) */
  acceptCombos: Object.freeze([['k1', 'kappaM'], ['k2', 'kappaM'], [null, 'kappaM'], ['k2', null], ['k1', null], [null, null]]),
  /** 対応の門(K2 の写し ↔ p = 2・ballHarmonic、K1 の本 ↔ p = 1・ballHarmonic の β の相対の差の上限 —— 受け手の体積の 1/r^p の変化と近い場の補正の分) */
  corrTolRel: 1e-3,
  /** 成分ごとの対応: 2 体の写し(🗺️ の 0 太陽・3 地球)の地球の距離の倍率・回転と軸の宣言・lib の componentScaling の r の格子 */
  duo: Object.freeze([0, 3]), duoFactors: Object.freeze([1, 2, 4, 8]), spinDecl: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' }), scalingRs: Object.freeze([1, 2, 4, 8, 16]),
  /** 傾きの門(エンジンの読み口の傾きと次数の差の上限 —— 受け手の体積と自己の分母の変化の分) */
  slopeTol: 0.05,
  /** 回転の口と潮汐の口の照合の組(🗺️ の添字 —— [受け手, 源]: 月–地球・イオ–木星) */
  tidePairs: Object.freeze([Object.freeze([4, 3]), Object.freeze([7, 6])]), tidePairNames: Object.freeze([['月', '地球'], ['イオ', '木星']].map((x) => Object.freeze(x))),
  /** 銀河の窓: 天の川の Ω(第329便b の表 10 —— Bovy 2017 の A_O − B_O・文献の値)・太陽の銀河中心の距離 R0・太陽の質量・半径(文献の値 —— 本便は一次資料に当たっていない) */
  galOmega: 8.815e-16, galR0Kpc: 8.2, sunMassKg: 1.98847e30, sunRadiusM: 6.957e8, galSource: '天の川の Ω = A_O − B_O(第329便b の表 10 —— Bovy 2017 の Oort の量・文献の値)・R0 8.2 kpc・M_eq = (Ω R0)² R0/G(球の等価の質量 —— 宣言)',
  /** 円盤: Υ_disk(第329便b の宣言 0.5)・環の半径 [kpc](1〜30 kpc・間隔 1)・方位の点 24・中心の球の半径 0.5 kpc・自己の半径の比 f(点の最小の間隔の半分に掛ける) */
  upsDisk: 0.5, ringFromKpc: 1, ringToKpc: 30, ringStepKpc: 1, K: 24, RcKpc: 0.5, fMain: 0.9,
  /** 外側のべきを読む範囲 [kpc] */
  outerFromKpc: 10,
  /** 境界の宣言(背景に対して静止した外の環 —— 半径 45 kpc・質量は円盤の総質量と同じ・方位 48 点) */
  boundaryRKpc: 45, boundaryK: 48,
  /** 表に出す半径 [kpc] */
  pickKpc: Object.freeze([1, 2, 4, 8, 16, 30]),
  /** ジャイロ: 地球の歳差の入力(文献の値 —— 本便は一次資料に当たっていない) */
  earthPrec: Object.freeze({ H: 0.0032737, epsDeg: 23.439, omega: 7.292115e-5, GMsun: 1.32712440018e20, aSun: 1.495978707e11, eSun: 0.0167, GMmoon: 4.9028e12, aMoon: 3.844e8, eMoon: 0.0549,
    literatureYears: 25772, source: '地球の歳差の周期 25 772 年(一般歳差 —— 文献の値)・力学的偏平率 H = (C − A)/C = 0.0032737・黄道傾斜 23.439°・恒星日の角速度 7.292115e-5 rad/s・太陽と月の GM・軌道の長半径と離心率(文献の値 —— 本便は一次資料に当たっていない)' }),
  /** 窓の角の時間 [年] と火星の歳差の文献の周期 */
  windowYears: Object.freeze([1, 100, 1000]), marsPrecYears: 170663, marsSource: '火星の自転軸の歳差の率 約 7.594″/年(周期 約 170 663 年 —— 文献の値・本便は一次資料に当たっていない)',
  /** 密度波: Ω_p の格子 [km s⁻¹ kpc⁻¹](NGC 3198 のパターン速度の文献の値を本便は持たない —— 格子) */
  omegaPGrid: Object.freeze([2, 3, 4, 5, 7.5, 10, 15, 20]),
  yearS: 365.25 * 86400,
});
const KPC = GR.KPC_M, MSUN = GR.MSUN_KG;

/* ───────── E 今のエンジンの経路との対応 ───────── */
function bookOf(HP) { return clone(HP.allPresets().find((p) => p.id === BOOK_ID)); }
function trioCopy(book, kernel, rule) {
  const b = clone(book); b.id = BOOK_ID + '_w330b'; b.description = '器の写し(内蔵ではない —— 第330便b)';
  b.bodies = PLAN.trio.map((i) => clone(book.bodies[i]));
  const q = b.physics.relativeDrag.invSq; if (kernel) q.kernel = kernel; else delete q.kernel; if (rule) q.rdRule = rule; else delete q.rdRule;
  delete b.physics.relativeDrag.initMotion; delete b.orbitObs; delete b.obsCard;
  return b;
}
export function partEngine(HP) {
  const book = bookOf(HP);
  const accept = PLAN.acceptCombos.map(([k, r]) => {
    const b = clone(book); b.id = BOOK_ID + '_w330b'; const q = b.physics.relativeDrag.invSq; if (k) q.kernel = k; else delete q.kernel; if (r) q.rdRule = r; else delete q.rdRule;
    const v = HP.validatePreset(clone(b));
    return { kernel: k, rdRule: r, ok: v.ok === true, errors: v.ok ? [] : v.errors.slice(0, 3), canonical: v.ok ? v.preset.physics.relativeDrag.invSq : null };
  });
  const trio = {};
  for (const [key, kernel, rule, p] of [['k1Rule', 'k1', 'kappaM', 1], ['k2Radius', null, null, 2]]) {
    const v = HP.validatePreset(trioCopy(book, kernel, rule));
    if (!v.ok) { trio[key] = { ok: false, errors: v.errors.slice(0, 3) }; continue; }
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    const st = HP.inertialDragIsqState(S), X = [0, 1, 2].map((i) => [S.x[i], S.y[i], S.z[i]]);
    const md = st.receivers.map((x) => x.md), Rd = st.receivers.map((x) => x.Rd);
    const rows = st.receivers.map((rr) => {
      const i = rr.i, dist = (j) => Math.hypot(X[i][0] - X[j][0], X[i][1] - X[j][1], X[i][2] - X[j][2]);
      const formula = (pp, type) => { const sw = L.selfWeight({ type, m: md[i], R: Rd[i], p: pp }).w, w = [0, 1, 2].map((j) => (j === i ? 0 : L.pointWeight(md[j], dist(j), pp))), W = sw + w.reduce((a, b) => a + b, 0);
        return { beta: w.map((x) => x / W), alpha: sw / W }; };
      const same = Object.fromEntries(L.SELF_TYPES.map((t) => { const f = formula(p, t); return [t, { beta: f.beta, alpha: f.alpha, maxRel: Math.max(...[0, 1, 2].filter((j) => j !== i).map((j) => relD(f.beta[j], rr.beta[j]))) }]; }));
      const cross = formula(p === 1 ? 2 : 1, 'ballHarmonic');
      return { i, name: PLAN.trioNames[i], Rd: rr.Rd, md: rr.md, engineBeta: rr.beta, engineAlpha: 1 - rr.betaSum, same, crossLaw: { p: p === 1 ? 2 : 1, beta: cross.beta, ratioToEngine: [0, 1, 2].map((j) => (j === i ? null : cross.beta[j] / rr.beta[j])) },
        distRdRatioMin: Math.min(...[0, 1, 2].filter((j) => j !== i).map((j) => dist(j) / Math.max(Rd[i], Rd[j]))) };
    });
    trio[key] = { ok: true, law: st.law, kernel: st.kernel || null, decl: st.decl, p, rows, betaMax: Math.max(...rows.map((r) => Math.max(...r.engineBeta))),
      bestType: L.SELF_TYPES.reduce((b, t) => (b === null || Math.max(...rows.map((r) => r.same[t].maxRel)) < Math.max(...rows.map((r) => r.same[b].maxRel)) ? t : b), null),
      maxRelByType: Object.fromEntries(L.SELF_TYPES.map((t) => [t, Math.max(...rows.map((r) => r.same[t].maxRel))])) };
  }
  return { accept, trio, harmonic: { H2: L.harmonicSelf(2), H1: L.harmonicSelf(1), order: L.DECL.harmonicOrder } };
}

/* ───────── E′ 成分ごとの対応(原仮定者の補足(2026-11-08))───────── */
function duoCopy(book, kernel, rule, f) {
  const b = trioCopy(book, kernel, rule);
  b.bodies = PLAN.duo.map((i) => clone(book.bodies[i]));
  const s0 = b.bodies[0], e = b.bodies[1];
  for (const k of ['x', 'y', 'z']) e[k] = s0[k] + f * (e[k] - s0[k]);
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: clone(PLAN.spinDecl) });
  return b;
}
export function partComponents(HP) {
  const book = bookOf(HP), out = {};
  for (const [key, kernel, rule] of [['k1Rule', 'k1', 'kappaM'], ['k2Radius', null, null]]) {
    const rows = [];
    for (const f of PLAN.duoFactors) {
      const v = HP.validatePreset(duoCopy(book, kernel, rule, f));
      if (!v.ok) { rows.push({ f, ok: false, errors: v.errors.slice(0, 3) }); continue; }
      const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
      const st = HP.inertialDragIsqState(S), rr = st.receivers.find((q) => q.i === 1);
      rows.push({ f, ok: true, beta: rr.beta[0], rot: Math.hypot(rr.rot[0], rr.rot[1], rr.rot[2]), omega: rr.omega ? Math.hypot(...rr.omega) : null, alpha: 1 - rr.betaSum, law: st.law });
    }
    const sl = (k) => rows.slice(1).map((q, i) => (q.ok && rows[i].ok && q[k] > 0 && rows[i][k] > 0 ? Math.log(q[k] / rows[i][k]) / Math.log(q.f / rows[i].f) : null));
    out[key] = { rows, slope: { beta: sl('beta'), rot: sl('rot'), omega: sl('omega') } };
  }
  const sc = L.componentScaling({ rs: PLAN.scalingRs.slice() });
  return { engine: out, pure: sc, reading: { translation: -2, rotation: -1, axial: -1, source: '原仮定者の補足(2026-11-08)の読み —— 並進は m/r²(速度は r に依らない)・回転と軸は座標変換で m/r² × Ω r(1/r に見える)' } };
}

/* ───────── R 回転の口と潮汐の口の照合(原仮定者の補足その2(2026-11-08))───────── */
const axisOf = (b) => { const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
export function partTideRot(HP) {
  const book = bookOf(HP), se = book.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M), G = book.physics.G;
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const rows = PLAN.tidePairs.map(([ri, si], k) => {
    const R = book.bodies[ri], Sx = book.bodies[si], aR = axisOf(R), aS = axisOf(Sx);
    const rv = [R.x - Sx.x, R.y - Sx.y, R.z - Sx.z], vv = [R.vx - Sx.vx, R.vy - Sx.vy, R.vz - Sx.vz], r = Math.hypot(...rv), mu = G * (R.m + Sx.m), v2 = dot3(vv, vv);
    const sma = 1 / (2 / r - v2 / mu), nB = Math.sqrt(mu / (sma * sma * sma)), h = cr3(rv, vv), hu = h.map((x) => x / Math.hypot(...h));
    const OmR = R.spin / uT, OmS = (Sx.spin / uT) * dot3(aS, aR), nAl = (nB / uT) * dot3(hu, aR), mR = R.m * uM, mS = Sx.m * uM, rSI = r * uL;
    const wS = L.pointWeight(mS, rSI, 2), beta = (Rself) => { const sw = L.selfWeight({ type: 'ballHarmonic', m: mR, R: Rself, p: 2 }).w; return wS / (sw + wS); };
    const bK1 = beta(L.kappaMRadius(mR)), bRad = beta(R.radius * uL);
    const tK1 = L.spinTarget([0, 0, OmR], L.selfWeight({ type: 'ballHarmonic', m: mR, R: L.kappaMRadius(mR), p: 2 }).w, [{ weight: wS, omega: [0, 0, OmS] }]);
    return { recv: PLAN.tidePairNames[k][0], src: PLAN.tidePairNames[k][1], OmegaRecv: OmR, OmegaSrcAlong: OmS, nAlong: nAl, rM: rSI, betaK1: bK1, betaRadius: bRad,
      slipRotK1: bK1 * (OmS - OmR), slipRotRadius: bRad * (OmS - OmR), slipTide: nAl - OmR, targetRatio: OmS / nAl, spinTargetSlipK1: tK1.slip[2] };
  });
  return { rows, note: '軸の向きは受け手の軸へ射影した大きさ(源の自転と公転の向きを受け手の軸へ)・2 体だけの重み(宣言)・本の JSON を読むだけ(步を進めない)' };
}
/* ───────── GW 銀河の回転引きずりの太陽系の枠への窓の角 ───────── */
export function partGalWindow() {
  const R0 = PLAN.galR0Kpc * KPC, Om = PLAN.galOmega, Meq = (Om * R0) * (Om * R0) * R0 / GR.G_SI, wG = L.pointWeight(Meq, R0, 2);
  const beta = (Rself) => { const sw = L.selfWeight({ type: 'ballHarmonic', m: PLAN.sunMassKg, R: Rself, p: 2 }).w; return wG / (sw + wG); };
  const bK1 = beta(L.kappaMRadius(PLAN.sunMassKg)), bSun = beta(PLAN.sunRadiusM);
  const rows = PLAN.windowYears.map((T) => { const t = T * PLAN.yearS; return { T, upper: L.windowAngle(Om, t), k1: L.windowAngle(bK1 * Om, t), sunRadius: L.windowAngle(bSun * Om, t) }; });
  return { Omega: Om, R0Kpc: PLAN.galR0Kpc, MeqKg: Meq, betaK1: bK1, betaSunRadius: bSun, rows, source: PLAN.galSource };
}

/* ───────── C 連鎖と平坦な回転の低 N の試し ───────── */
export function readFixture(root = ROOT) {
  const J = JSON.parse(fs.readFileSync(path.join(root, FIXTURE), 'utf8'));
  const sha = crypto.createHash('sha256').update(Buffer.from(J.rawText, 'utf8')).digest('hex');
  return { J, rows: J.rows, shaSame: sha === J.provenance.sha256 };
}
function interpRow(rows, R, key) {
  if (R <= rows[0].R) return rows[0][key];
  for (let k = 0; k + 1 < rows.length; k++) if (R <= rows[k + 1].R) { const a = rows[k], b = rows[k + 1], t = (R - a.R) / (b.R - a.R); return a[key] + t * (b[key] - a[key]); }
  return rows[rows.length - 1][key];
}
/** 指数円盤の当てはめ(ln SBdisk と R の最小二乗 —— 1〜30 kpc の SBdisk > 0 の行・宣言) */
export function expDiskFit(rows) {
  const pts = rows.filter((r) => r.R >= PLAN.ringFromKpc && r.R <= PLAN.ringToKpc && r.SBdisk > 0), n = pts.length;
  const mx = pts.reduce((s, r) => s + r.R, 0) / n, my = pts.reduce((s, r) => s + Math.log(r.SBdisk), 0) / n;
  let sxy = 0, sxx = 0; for (const r of pts) { sxy += (r.R - mx) * (Math.log(r.SBdisk) - my); sxx += (r.R - mx) ** 2; }
  const slope = sxy / sxx, h = -1 / slope, SB0 = Math.exp(my - slope * mx);
  return { hKpc: h, SB0, n };
}
export function diskCase(FX, c) {
  const o = Object.assign({ dist: 'fixture', f: PLAN.fMain, selfType: 'ballMean', kappa: false, p: 2, boundary: false, vMode: 'zero', K: PLAN.K, dR: PLAN.ringStepKpc, centerRot: 'moment' }, c);
  const rows = FX.rows, EF = expDiskFit(rows);
  const sigma = (R) => PLAN.upsDisk * (o.dist === 'fixture' ? interpRow(rows, R, 'SBdisk') : EF.SB0 * Math.exp(-R / EF.hKpc));   // M☉/pc²
  const Rs = []; for (let k = 0; ; k++) { const R = PLAN.ringFromKpc + k * o.dR; if (R > PLAN.ringToKpc + 1e-9) break; Rs.push(Math.round(R * 1e6) / 1e6); }
  const rings = Rs.map((R) => ({ R: R * KPC, m: 2 * Math.PI * (R * 1e3) * (o.dR * 1e3) * sigma(R) * MSUN }));
  let Mc = 0; const nn = 200; for (let i = 0; i < nn; i++) { const r = (i + 0.5) * PLAN.RcKpc / nn; Mc += 2 * Math.PI * r * 1e3 * (PLAN.RcKpc / nn * 1e3) * sigma(r); } Mc *= MSUN;
  const Rself = rings.map((r, k) => (o.kappa ? L.kappaMRadius(r.m / o.K) : o.f * Math.min(2 * Rs[k] * Math.sin(Math.PI / o.K), o.dR) / 2 * KPC));
  const vbar = Rs.map((R) => { const g = interpRow(rows, R, 'Vgas'), d = interpRow(rows, R, 'Vdisk'), v2 = g * Math.abs(g) + PLAN.upsDisk * d * Math.abs(d); return Math.sign(v2) * Math.sqrt(Math.abs(v2)) * 1e3; });
  const vobs = Rs.map((R) => interpRow(rows, R, 'Vobs') * 1e3), OmC = interpRow(rows, PLAN.RcKpc, 'Vobs') * 1e3 / (PLAN.RcKpc * KPC);
  const Mdisk = rings.reduce((a, r) => a + r.m, 0);
  const d = L.diskChain({ rings, K: o.K, p: o.p, self: { type: o.selfType, Rs: Rself }, center: { M: Mc, Rc: PLAN.RcKpc * KPC, Omega: OmC }, v: o.vMode === 'zero' ? Rs.map(() => 0) : vbar,
    boundary: o.boundary ? { R: PLAN.boundaryRKpc * KPC, m: Mdisk, K: PLAN.boundaryK } : null, centerRot: o.centerRot });
  const sl = L.slopes(Rs, d.U, PLAN.outerFromKpc), sl0 = L.slopes(Rs, d.noChain, PLAN.outerFromKpc), slB = L.slopes(Rs, vbar, PLAN.outerFromKpc), slO = L.slopes(Rs, vobs, PLAN.outerFromKpc);
  const pick = PLAN.pickKpc.map((R) => Rs.indexOf(R)).filter((k) => k >= 0);
  return { decl: o, nRings: Rs.length, nPoints: Rs.length * o.K, McMsun: Mc / MSUN, MdiskMsun: Mdisk / MSUN, OmegaC: OmC, expDisk: o.dist === 'exp' ? EF : null,
    selfRadiusKpc: { first: Rself[0] / KPC, last: Rself[Rself.length - 1] / KPC },
    slope: { outer: sl.outer, flat: sl.flat, noChainOuter: sl0.outer, vbarOuter: slB.outer, vobsOuter: slO.outer, allPositive: sl.allPositive },
    picks: pick.map((k) => ({ R: Rs[k], U: d.U[k], noChain: d.noChain[k], UoverVobs: d.U[k] / vobs[k], vbar: vbar[k], shares: d.rows[k].shares, rowSumB: d.rows[k].rowSumB, naiveCenterRatio: d.rows[k].naiveCenterRatio })),
    solve: d.solve };
}
export const DISK_CASES = Object.freeze([
  ['main', {}], ['f05', { f: 0.5 }], ['f025', { f: 0.25 }], ['kappaM', { kappa: true }], ['point', { selfType: 'point' }], ['harmonic', { selfType: 'ballHarmonic' }],
  ['p1', { p: 1 }], ['boundary', { boundary: true }], ['K48', { K: 48 }], ['K12', { K: 12 }], ['dR05', { dR: 0.5 }], ['exp', { dist: 'exp' }],
  ['vbar', { vMode: 'bar' }], ['vbarKappaM', { vMode: 'bar', kappa: true }], ['vbarBoundary', { vMode: 'bar', boundary: true }],
  ['frame', { centerRot: 'frame' }], ['frameF05', { centerRot: 'frame', f: 0.5 }], ['frameKappaM', { centerRot: 'frame', kappa: true }], ['frameBoundary', { centerRot: 'frame', boundary: true }],
].map(([k, v]) => Object.freeze([k, Object.freeze(v)])));
export function partChain(FX) {
  const cases = Object.fromEntries(DISK_CASES.map(([k, c]) => [k, diskCase(FX, c)]));
  const zm = Object.values(cases).filter((q) => q.decl.vMode === 'zero' && q.decl.centerRot === 'moment'), zf = Object.values(cases).filter((q) => q.decl.vMode === 'zero' && q.decl.centerRot === 'frame');
  const rng = (a) => [Math.min(...a.map((q) => q.slope.outer)), Math.max(...a.map((q) => q.slope.outer))];
  return { cases, outerRangeZero: rng(zm), nFlatZero: zm.filter((q) => q.slope.flat === true).length, nZero: zm.length,
    frameRangeZero: rng(zf), nFlatFrame: zf.filter((q) => q.slope.flat === true).length, nFrame: zf.length };
}

/* ───────── G ジャイロと歳差の窓 ───────── */
export function partGyro() {
  const E = PLAN.earthPrec, eps = E.epsDeg * Math.PI / 180, s = [Math.sin(eps), 0, Math.cos(eps)], n = [0, 0, 1], C = 1, L0 = s.map((x) => x * C * E.omega);
  const Nsun = L.oblateTorqueAvg({ GM: E.GMsun, a: E.aSun, e: E.eSun, CminusA: E.H * C, s, n }), Nmoon = L.oblateTorqueAvg({ GM: E.GMmoon, a: E.aMoon, e: E.eMoon, CminusA: E.H * C, s, n });
  const N = Nsun.map((x, k) => x + Nmoon[k]), g = L.gyroResponse(L0, N), rate = L.coneRate(L0, N, n), rSun = L.coneRate(L0, Nsun, n), rMoon = L.coneRate(L0, Nmoon, n);
  const periodY = 2 * Math.PI / Math.abs(rate) / PLAN.yearS;
  const win = (pY) => PLAN.windowYears.map((T) => { const a = L.windowAngle(2 * Math.PI / (pY * PLAN.yearS), T * PLAN.yearS); return { T, rad: a, deg: a * 180 / Math.PI }; });
  return { earth: { torqueSun: Nsun, torqueMoon: Nmoon, precession: g.precession, perpTorque: g.perpendicularTorque, dL: g.dL, coneRate: rate, coneRateSun: rSun, coneRateMoon: rMoon, moonOverSun: rMoon / rSun,
      periodYears: periodY, literatureYears: E.literatureYears, ratio: periodY / E.literatureYears, retrograde: rate < 0, heat: 0, source: E.source, C: 'C は消える(L = Cω ŝ・C − A = H C —— 正規化 C = 1)' },
    windows: { earthComputed: win(periodY), earthLiterature: win(E.literatureYears), marsLiterature: win(PLAN.marsPrecYears), marsSource: PLAN.marsSource } };
}

/* ───────── W 密度波のラベルと共鳴の半径 ───────── */
export function partWave(FX) {
  const rows = FX.rows.map((r) => ({ R: r.R, v: r.Vobs, sigma: r.errV }));
  const T = Object.fromEntries(GR.DECL.derivTypes.map((k) => [k, GR.labelsTable(rows, k)]));
  const grid = PLAN.omegaPGrid.map((Op) => ({ OmegaP: Op, OmegaPRadS: Op * GR.KMS_KPC_RADS, localQuad: L.resonanceRadii(T.localQuad, Op), centralDiff: L.resonanceRadii(T.centralDiff, Op) }));
  const ok = T.localQuad.filter((q) => q.labels && q.labels.kappaEpi !== null);
  const maxILR = ok.reduce((b, q) => (b === null || q.labels.OmMinusHalfK > b.v ? { R: q.R, v: q.labels.OmMinusHalfK } : b), null);
  const label = L.densityWaveLabel({ m: 2, OmegaP: 10, source: '器の中の格子の 1 点(NGC 3198 のパターン速度の文献の値を本便は持たない —— 本には置かない)' });
  return { grid, maxOmMinusHalfK: maxILR, label, bar: label.bar, nRows: ok.length };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const E = J.engine, C = J.chain, G = J.gyro, W = J.wave;
  const acc = Object.fromEntries(E.accept.map((a) => [(a.kernel || '-') + '|' + (a.rdRule || '-'), a]));
  const rdMsg = (a) => a.errors.some((x) => /rdRule は kernel:"k1" の本だけ/.test(String(x)));
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    acceptProbe: acc['k1|kappaM'].ok === true && acc['k2|kappaM'].ok === false && rdMsg(acc['k2|kappaM']) && acc['-|kappaM'].ok === false && rdMsg(acc['-|kappaM']) && acc['k2|-'].ok === true && acc['k1|-'].ok === true && acc['-|-'].ok === true,
    engineK2Formula: E.trio.k2Radius.ok === true && E.trio.k2Radius.maxRelByType.ballHarmonic <= PLAN.corrTolRel && E.trio.k2Radius.bestType === 'ballHarmonic',
    engineK1Formula: E.trio.k1Rule.ok === true && E.trio.k1Rule.maxRelByType.ballHarmonic <= PLAN.corrTolRel && E.trio.k1Rule.bestType === 'ballHarmonic',
    k1NotSquareLaw: E.trio.k1Rule.ok === true && E.trio.k1Rule.rows.every((r) => r.crossLaw.ratioToEngine.every((x) => x === null || x < 1e-6)),
    chainSolved: Object.values(C.cases).every((q) => q.solve.converged === true && q.solve.maxDiffRel <= 1e-10 && q.solve.engineFormResidualRel <= 1e-10),
    chainOnceOnly: Object.values(C.cases).filter((q) => !q.decl.kappa).every((q) => q.solve.doubleCountRel > 1e-6),
    centerRotTypesDiffer: Object.values(C.cases).every((q) => q.picks.every((p) => p.naiveCenterRatio > 1)),
    gyroEarth: G.earth.retrograde === true && Number.isFinite(G.earth.periodYears) && G.earth.heat === 0 && G.earth.dL.every((x, k) => x === G.earth.torqueSun[k] + G.earth.torqueMoon[k]),
    componentsEngine: ['k1Rule', 'k2Radius'].every((k) => J.components.engine[k].rows.every((r) => r.ok === true)) && (() => { const e = J.components.engine, ok = (a, want) => a.every((x) => x !== null && Math.abs(x - want) <= PLAN.slopeTol);
      return ok(e.k1Rule.slope.beta, -1) && ok(e.k1Rule.slope.rot, -2) && ok(e.k1Rule.slope.omega, -3) && ok(e.k2Radius.slope.beta, -2) && ok(e.k2Radius.slope.rot, -3) && ok(e.k2Radius.slope.omega, -4); })(),
    tideRotTable: J.tideRot.rows.length === PLAN.tidePairs.length && J.tideRot.rows.every((q) => [q.OmegaRecv, q.OmegaSrcAlong, q.nAlong, q.betaK1, q.betaRadius, q.slipTide].every(Number.isFinite) && q.betaK1 < q.betaRadius && q.betaRadius < 1
      && Math.abs(q.spinTargetSlipK1 - q.slipRotK1) <= 1e-12 * Math.max(Math.abs(q.slipRotK1), 1e-300)),
    galWindowTable: J.galWindow.rows.length === PLAN.windowYears.length && J.galWindow.betaK1 < J.galWindow.betaSunRadius && J.galWindow.betaSunRadius < 1 && J.galWindow.rows.every((q) => q.k1 <= q.sunRadius && q.sunRadius <= q.upper),
    waveRadii: W.grid.length === PLAN.omegaPGrid.length && W.grid.every((g) => Array.isArray(g.localQuad.CR.at) && Array.isArray(g.localQuad.ILR.at) && Array.isArray(g.localQuad.OLR.at)) && W.bar.status === 'notClaim' && W.label.mode === 'densityWave',
  };
}
export function runAll(HP, root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const FX = readFixture(root); mark('inputs');
  const engine = partEngine(HP); mark('engine');
  const components = partComponents(HP); mark('components');
  const tideRot = partTideRot(HP); mark('tideRot');
  const galWindow = partGalWindow(); mark('galWindow');
  const chain = partChain(FX); mark('chain');
  const gyro = partGyro(); mark('gyro');
  const wave = partWave(FX); mark('wave');
  const J = { inputs: { fixtureSha256Same: FX.shaSame, fixtureVersion: FX.J.version, fixtureRows: FX.rows.length }, pure, engine, components, tideRot, galWindow, chain, gyro, wave, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W330B_TARGET || 'beta/index.html';
  const OUT = process.env.W330B_OUT ? (path.isAbsolute(process.env.W330B_OUT) ? process.env.W330B_OUT : path.join(ROOT, process.env.W330B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第330便b dragweight(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w330b-dragweight.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の整理(2026-11-08)「引きずり = Σ(相対速度 × 重み)/Σ重み(自分を含む)・重み = 質量/距離²・慣性移動 = 自分自身の引きずり」「ディスクは平坦回転する」(作業仮説 —— 診断で検査)・「ジャイロ効果も DFM の範囲」・「2 本の腕は密度波・棒は解決案は無い」・原仮定者の補足(2026-11-08)「回転引きずりは座標変換 —— 角速度は距離で変わらず接線の速度は r に比例・重み 1/r² で 1/r に見える」・原仮定者の補足その2(2026-11-08)「回転引きずりは回転にも効く —— 角速度そのままの順回転・重み 1/r²・潮汐との二重計上に注意・軸引きずりは現状どおり」・原仮定者の回答(2026-11-08 —— AN578・AN580)・統括の検証項目 R308',
    decl: L.DECL, plan: PLAN, selfTypes: L.SELF_TYPES, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w330b-dragweight.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs',
    'tests/lib-w329b-galrot.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第330便b', target: TARGET, code: CODE, inputs: [TARGET, FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'dragweight', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ の写しの受理と読み口(步を進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

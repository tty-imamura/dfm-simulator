// 第333便a(原仮定者の整理(2026-11-10)「回転引きずりは引きずり半径の手前と奥の差分 —— 赤道面からの距離が R_d を超えると急激に減衰する・ただし斜め方向も差分は有るので厳密には 0 ではない」
//   「引きずり自転は必ずしも観測自転と言えないのでノブになり得る —— s_d を、角運動量を保存して半径を R_d に縮めた高速回転で計算する方法も係数付きで検証」・統括の検証項目 R317):
//   **回転引きずりの三次元の差分の 3 列(① 切り口・帯の外 0/② 源の全体の三次元の差分/③ 狭い帯 + 0 でない尾)の表・引きずり自転 s_d(λ_J)の表と既にある源のモーメントの J 案との等価・
//   応答率の 2 列(fixed・linked)で公転面の揃いの表の作り直し**(段 rotdiff-333a —— 正本 tests/out/rotdiff-w333a.json・lib tests/lib-w333a-rotdiff.mjs)。**診断だけ** —— エンジン・内蔵の本・
//   受理器・第332便a の lib と器の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d と 💍 saturnRingReal の宣言の値を第332便a の器の readBooks で読む ——
//   本の JSON は 1 bit も変えない・步は進めない)。等価の照合 E だけ 🗺️ の 2 体の**写し**(器の中)に源のモーメントの J 案(invSq.sourceMoment —— 〔第320便a〕)を宣言して受理器と読み口
//   inertialDragIsqState に通す。1 プロセス。
//
// ■ 何をするか
//   P 純関数の場面(lib の pureScenes —— z の上下の対称と s_d の符号・対向 2 点の閉じた値・α の依存と遠方の尺度・求積の収束・帯の中で ① と一致する条件・緯度の応答・s_d と J・円軌道の平均・入力の拒否)
//   A 3 列の表: z/R_d ∈ {0, 0.5, 1, 2, 10, 100, 1e6} × ρ/R_d ∈ {2, 10, 100, 1e4} で ①②③ の U と赤道面との比・「R_d を超えると急減」と「斜めに 0 でない」の判定(DECL_TAIL の物差し —— 走行の前の宣言)/
//     A2 ② の α の依存(α = 1, 1.5, 2, 3 × 対向 2 点・球・球殻)
//   B 引きずり自転: 太陽・8 惑星・月の s_d/s・s_d R_d/c₀・J の照合(λ_J の格子)/B2 既にある源のモーメントの J 案との遠方のモーメントの等価(解析)/B3 写しのエンジンの読み口(J 案 —— 太陽 + 木星・
//     地球 + 月)と、s_d を源の自転にした読みの式の比/B4 等価でない所(結合 β・応答率・分母・近接場・帯)
//   C 応答率の 2 列と公転面の揃いの表の作り直し: 組(太陽–惑星 8・惑星–衛星 7・土星の環の粒子 6)× 列(① 切り口・② 球 α = 2・③ 4 型)× 自転(s・λ_J = 1e-6・1e-3・1)× 応答率(fixed・linked)の
//     符号・年齢の間の累積(今の角との比)・Δ ln a・一次外挿が壊れる印・帯の中と外の寄与
// ■ 言わないこと: 3 列・s_d・応答率は宣言の型の表の値と残差。公転面の揃い・累積の小ささを決めた仕組みとは書かない。今のエンジンの K1 は R_d の球(中心からの距離)で、3 列と形が違う。
//   s_d は J を表す等価なパラメータ(物質の表面の速度ではない —— サンプルの観測自転へ書き戻さない)。文献の値は本便は一次資料に当たっていない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w333a-rotdiff.mjs';
import * as X332 from './exp-w332a-eqband.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🗺️ solarSystem16Inertial3d と 💍 saturnRingReal の 2 本〔宣言の値を読む・
//   🗺️ は照合 E の 2 体の写しの元〕。roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分 —— この器と lib の
//   局所の変数には使わない。エンジンを読む〔core —— 写しの読み口 inertialDragIsqState〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["saturnRingReal","solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w333a-rotdiff-1';
export const OUT_MAIN = 'tests/out/rotdiff-w333a.json';
export const SOLAR_ID = 'solarSystem16Inertial3d';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const { sub, scl, crs, nrm } = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl: (a, s) => [a[0] * s, a[1] * s, a[2] * s], crs: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm: (a) => Math.hypot(a[0], a[1], a[2]) };
const DEG = Math.PI / 180;
export const NOT_CLAIM = Object.freeze(['3 列・s_d・応答率は宣言の型の表の値と残差(原仮定者の整理の作業仮説 —— 今のエンジンに無い・未接続)', '公転面の揃い・累積の小ささを決めた仕組みとは書かない(符号・累積・一次外挿の限界の印の表)',
  '今のエンジンの K1 の核は R_d の球(中心からの距離)で、3 列と形が違う —— 同じとは書かない', 's_d は J を表す等価なパラメータ(物質の表面の速度ではない —— サンプルの観測自転へ書き戻さない)',
  '尾の関数と係数は走行の前に宣言した(観測に合うように後から選ばない)', '揃える率は一次の目安(円軌道・永年の平均 —— 写しの時間発展ではない)', '文献の値は本便は一次資料に当たっていない', 'κ_epi(周転円の振動数)と κ_D は別の量']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 🗺️ の添字(0 太陽・1 水星・2 金星・3 地球・4 月・5 火星・6 木星・… 11 土星・13 天王星・14 海王星) —— 第332便a の器の PLAN と同じ順 */
  sdBodies: Object.freeze([0, 1, 2, 3, 5, 6, 11, 13, 14, 4]), sdNames: Object.freeze(['太陽', '水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星', '月']),
  /** A2 の点(ρ/R_d・z/R_d) */
  alphaPts: Object.freeze([Object.freeze([2, 0]), Object.freeze([100, 0]), Object.freeze([100, 2]), Object.freeze([100, 10]), Object.freeze([10, 100])]),
  /** C の列(① 切り口・② 球 α = 2・③ 4 型)と自転の場合(s = 観測自転を s_d に・λ_J の格子の 0 でない 3 つ)・応答率 */
  alignCols: Object.freeze(['slice', 'ball', 'sum2', 'sum4', 'latW', 'lorentz']), spinCases: Object.freeze(['s', 1e-6, 1e-3, 1]), rates: L.RATES,
  /** 等価の照合 E の写し(🗺️ の添字の組 —— 源 0 番・受け手 1 番)と源の慣性係数 */
  equivPairs: Object.freeze([Object.freeze({ key: 'sunJupiter', name: '太陽 + 木星', idx: Object.freeze([0, 6]) }), Object.freeze({ key: 'earthLuna', name: '地球 + 月', idx: Object.freeze([3, 4]) })]),
  /** 写しに宣言する spinDrag(第332便a の器と同じ宣言 —— 読むのは回転の係数だけ) */
  spinDecl: X332.PLAN.spinDecl,
  /** 読みの式とエンジンの読み口の相対の差の上限(受け手の自己の場の一次と半径の単精度 —— 第332便a と同じ) */
  equivTol: 1e-6,
  G: L.DECL.G, c: L.DECL.c, yearS: L.DECL.yearS, ageYr: L.DECL.ageYr,
});

/* ───────── A 3 列の表 ───────── */
export function partColumns() {
  const Rd = 1, sd = 1, rows = [];
  for (const rho of L.GRID.rho) for (const z of L.GRID.z) {
    const x = { rho: rho * Rd, z: z * Rd, Rd, sd }, row = { rho, z };
    for (const col of L.COLUMNS) row[col] = L.colVel(col, x);
    rows.push(row);
  }
  for (const r of rows) { const r0 = rows.find((q) => q.rho === r.rho && q.z === 0); r.ratio = Object.fromEntries(L.COLUMNS.map((c) => [c, r0[c] !== 0 ? r[c] / r0[c] : null])); }
  const DTL = L.DECL_TAIL, verdict = L.COLUMNS.map((col) => {
    const at = (z) => rows.find((q) => q.rho === DTL.steepRho && q.z === z), steepRatio = at(DTL.steepZ)[col] / at(0)[col];
    const outside = rows.filter((q) => q.z > 1), tailMin = Math.min(...outside.map((q) => q[col])), nonzero = outside.every((q) => q[col] > 0);
    const steep = steepRatio <= DTL.steepMax;
    return { col, steepRatio, steep, nonzero, both: steep && nonzero, tailMin, nOutside: outside.length };
  });
  const alpha = [];
  for (const a of L.DECL.alphas) for (const [rho, z] of PLAN.alphaPts) {
    const x = { rho, z, Rd, sd }, x0 = { rho, z: 0, Rd, sd };
    const row = { alpha: a, rho, z };
    for (const k of L.KINDS2) { row[k] = L.wholeVel(Object.assign({}, x, { alpha: a, kind: k })); row[k + 'Ratio'] = row[k] / L.wholeVel(Object.assign({}, x0, { alpha: a, kind: k })); row[k + 'Far'] = row[k] / L.farVel(Object.assign({}, x, { alpha: a, kind: k })); }
    alpha.push(row);
  }
  return { Rd, sd, grid: L.GRID, rows, verdict, alpha, note: 'U は s_d = 1・R_d = 1 の単位(U ÷ (s_d R_d))—— ② は α = 2(原仮定者の整理「重みは m/r² が有力」)・r/R_d ≥ 1e3 は遠方の展開・① は第332便a の主の式(K1 の重み 1/距離 —— 凍結の対照)' };
}

/* ───────── B 引きずり自転 ───────── */
export function partDragSpin(BK) {
  const B = BK.solar.bodies, rows = [];
  PLAN.sdBodies.forEach((bi, k) => {
    const b = B[bi], fObs = L.fObsOf(bi), s = Math.abs(b.Omega), row = { name: PLAN.sdNames[k], index: bi, m: b.m, Robs: b.R, s, fObs, fObsLit: L.fObsIsLit(bi) };
    const D1 = L.dragSpin({ m: b.m, Robs: b.R, s, fObs, lambdaJ: 1 });
    const DU = L.dragSpin({ m: b.m, Robs: b.R, s, fObs: 0.4, lambdaJ: 1 });
    Object.assign(row, { Rd: D1.Rd, ratio1: D1.ratio, sd1: D1.sd, vdOverC1: D1.vdOverC, vdOverCUniform: DU.vdOverC, Jobs: D1.Jobs, jRel1: D1.jRel, sdOverRobsS: D1.sd * D1.Rd / (s * b.R) });
    row.lambda = L.DECL.lambdas.map((lam) => { const D = L.dragSpin({ m: b.m, Robs: b.R, s, fObs, lambdaJ: lam }); return { lambdaJ: lam, sd: D.sd, ratio: D.ratio, vdOverC: D.vdOverC, jRel: D.jRel }; });
    const E = L.srcMomentRatio({ m: b.m, Robs: b.R, s, fObs });
    Object.assign(row, { Rsrc: E.Rsrc, RsrcOverRobs: E.Rsrc / b.R, momentFactor: E.momentFactor, equivRatio: E.ratio, equivRatioFd: [0.2, 0.4, 2 / 3].map((fD) => L.srcMomentRatio({ m: b.m, Robs: b.R, s, fObs, fD }).ratio) });
    rows.push(row);
  });
  return { rows, fD: L.DECL.fD, lambdas: L.DECL.lambdas, fObsSrc: L.F_OBS_SRC,
    note: 's_d = λ_J (f_obs/f_d)(R_obs/R_d)² s(f_d = 2/5 —— 一様な球の宣言)・s_d R_d/c₀ は物質の表面の速度ではない(J を表す等価なパラメータ)・源のモーメントの J 案は R_src = R_obs√(5f_obs/2)(〔第320便a〕)' };
}
/** 写しを受理して build し、受け手 1 の源 0 の回転の係数 ⟨(m M1/W) n̂⟩ から u_rot = s ŝ × RV(SI)と β・sourceMoment の欄を返す */
function engineRot(HP, book, idx, sourceMoment) {
  const b = clone(book); b.id = SOLAR_ID + '_w333a'; b.description = '器の写し(内蔵ではない —— 第333便a)';
  b.bodies = idx.map((i) => clone(book.bodies[i]));
  delete b.physics.relativeDrag.initMotion; delete b.orbitObs; delete b.obsCard;
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: clone(PLAN.spinDecl) });
  if (sourceMoment) b.physics.relativeDrag.invSq = Object.assign(clone(b.physics.relativeDrag.invSq || {}), { sourceMoment: clone(sourceMoment) });
  const v = HP.validatePreset(b);
  if (!v.ok) return { ok: false, errors: (v.errors || []).slice(0, 3) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const se = v.preset.scaleExp, uL = 10 ** se.L, uT = 10 ** se.T;
  const st = HP.inertialDragIsqState(S, { perSource: true }), rr = st && st.receivers.find((q) => q.i === 1);
  if (!rr || !rr.rot) return { ok: false, errors: ['読み口に受け手 1 の回転の係数が無い'] };
  const RV = [rr.rot[0] * uL, rr.rot[1] * uL, rr.rot[2] * uL], ax = [S.sax[0], S.say[0], S.saz[0]], Om = S.spin[0] / uT, u = scl(crs(ax, RV), Om);
  const sm = st.sourceMoment ? st.sourceMoment.bodies.find((q) => q.i === 0) : null;
  return { ok: true, mag: nrm(u), beta: rr.beta[0], momentFactor: sm ? sm.momentFactor : 1, Rsrc: sm ? sm.Rsrc * uL : null, applied: sm ? sm.applied : false };
}
export function partEquiv(HP, BK) {
  const book = clone(HP.allPresets().find((p) => p.id === SOLAR_ID)), B = BK.solar.bodies;
  const rows = PLAN.equivPairs.map((P) => {
    const [si, ri] = P.idx, src = B[si], rec = B[ri], fObs = L.fObsOf(si), s = Math.abs(src.Omega);
    const Ej = engineRot(HP, book, P.idx, { kind: 'J', f: { 0: fObs } }), E0 = engineRot(HP, book, P.idx, null);
    const D = L.dragSpin({ m: src.m, Robs: src.R, s, fObs, lambdaJ: 1 }), srcB = { x: src.x, m: src.m, axis: src.axis, Omega: Math.sign(src.Omega) * D.sd };
    const sp = L.sphereRot(srcB, { x: rec.x }), sp0 = L.sphereRot({ x: src.x, m: src.m, axis: src.axis, Omega: src.Omega }, { x: rec.x });
    return { key: P.key, name: P.name, fObs, ok: Ej.ok && E0.ok, engineJ: Ej.ok ? Ej.mag : null, engine0: E0.ok ? E0.mag : null, libSd: sp.mag, libS: sp0.mag,
      relJvsSd: Ej.ok ? relD(Ej.mag, sp.mag) : null, rel0vsS: E0.ok ? relD(E0.mag, sp0.mag) : null, engineFactor: Ej.ok ? Ej.mag / E0.mag : null, ratio1: D.ratio, engineMomentFactor: Ej.ok ? Ej.momentFactor : null,
      betaSame: Ej.ok && E0.ok ? Ej.beta === E0.beta : null, beta: Ej.ok ? Ej.beta : null, libBeta: sp.beta, betaRel: Ej.ok ? relD(Ej.beta, sp.beta) : null, Rsrc: Ej.ok ? Ej.Rsrc : null, Rd: D.Rd, applied: Ej.ok ? Ej.applied : null,
      errors: Ej.ok && E0.ok ? null : (Ej.errors || E0.errors) };
  });
  // B4 等価でない所(遠方の回転のモーメントは同じ —— 結合・応答率・分母・近接場・帯は別)
  const sun = B[0], fS = L.fObsOf(0), Ds = L.dragSpin({ m: sun.m, Robs: sun.R, s: Math.abs(sun.Omega), fObs: fS }), Es = L.srcMomentRatio({ m: sun.m, Robs: sun.R, s: Math.abs(sun.Omega), fObs: fS });
  const diff = { sunRd: Ds.Rd, sunRsrc: Es.Rsrc, sunRobs: sun.R, rsrcOverRd: Es.Rsrc / Ds.Rd, gammaRatio: Ds.ratio,
    rows: [['結合 β(並進 —— C₁R_d K1)', '不変(R_src を読まない)', '不変(R_d を読む)'], ['遠方の回転のモーメント', 's R_src²/5', 's_d R_d²/5(λ_J = 1・f_d = 2/5 で同じ)'],
      ['応答率 γ(NF の帯の押し)', '無し(回転の項は s に比例)', 'fixed: β s・linked: β s_d(大きさ —— s_d/s 倍)'], ['分母 W と ∇W', '不変', '不変'],
      ['近接場(源の内の M1)', 'r < R_src で一様な球の内部の M1', 'r < R_d だけ(R_d は R_src の桁で小さい)'], ['帯(赤道面からの距離)', '無し(球の核)', '① ③ は R_d の帯・② は帯なし']] };
  return { rows, diff, note: '写しは 🗺️ の 2 体(源 0 番・受け手 1 番)・J 案は源の f だけを宣言(f_obs —— 第319便b の MOI)・s_d は λ_J = 1・f_d = 2/5・読みの式は第332便a の lib の sphereRot(源の自転を s_d に)' };
}

/* ───────── C 応答率の 2 列と公転面の揃いの表の作り直し ───────── */
function pairsOf(BK) {
  const B = BK.solar.bodies, P332 = X332.PLAN, sun = B[P332.sunIndex], out = [];
  const srcOf = (i) => ({ m: B[i].m, s: Math.abs(B[i].Omega), Robs: B[i].R, fObs: L.fObsOf(i), index: i });
  P332.planets.forEach((pi, k) => out.push({ kind: 'sun-planet', name: '太陽–' + P332.planetNames[k], src: srcOf(P332.sunIndex), orb: X332.orbitOf(sun, B[pi]) }));
  for (const [mi, hi, nm] of P332.moons) out.push({ kind: 'planet-moon', name: P332.planetNames[P332.planets.indexOf(hi)] + '–' + nm, src: srcOf(hi), orb: X332.orbitOf(B[hi], B[mi]) });
  const ring = BK.ring, satSrc = { m: ring.m, s: Math.abs(ring.Omega), Robs: ring.R, fObs: L.fObsOf(11), index: 'ring' };
  for (const p of X332.ringPoints(ring)) { const n = Math.sqrt(PLAN.G * ring.m / p.r ** 3); out.push({ kind: 'ring', name: '土星–' + p.label + 'の粒子', src: satSrc, orb: { a: p.r, ecc: 0, n, v: n * p.r, i: (P332.ringH / 2) / p.r } }); }
  return out;
}
export function partAlign(BK) {
  const pairs = pairsOf(BK), ageS = PLAN.ageYr * PLAN.yearS, base = [], rows = [];
  for (const p of pairs) {
    const Rd = L.rdOf(p.src.m), o = p.orb, ang = Math.min(o.i, Math.PI - o.i);
    for (const col of PLAN.alignCols) {
      const q = L.orbitPush({ Uunit: L.unitFn(col, Rd), Rd, a: o.a, i: o.i, n: o.n, v: o.v, sGamma: p.src.s, sU: p.src.s });
      base.push({ pair: p.name, kind: p.kind, col, a: o.a, planeAngleDeg: ang / DEG, Rd, rOverRd: o.a / Rd, fracIn: q.fracIn, dIdt: q.dIdt, dLnAdt: q.dLnAdt, bandDIdt: q.band.dIdt, outDIdt: q.out.dIdt, beta: q.beta });
    }
  }
  for (const b of base) {
    const p = pairs.find((x) => x.name === b.pair), retro = (p.orb.i > Math.PI / 2);
    for (const sc of PLAN.spinCases) {
      const ratio = sc === 's' ? 1 : L.dragSpin({ m: p.src.m, Robs: p.src.Robs, s: p.src.s, fObs: p.src.fObs, lambdaJ: sc }).ratio;
      for (const rate of PLAN.rates) {
        if (sc === 's' && rate === 'linked') continue;   // s_d = s では fixed と linked が同じ
        const f = rate === 'fixed' ? ratio : ratio * ratio, dIdt = b.dIdt * f, dLnAdt = b.dLnAdt * f, dPlane = retro ? -dIdt : dIdt;
        const dI = dIdt * ageS, frac = Math.abs(dI) / (b.planeAngleDeg * DEG), dLnA = dLnAdt * ageS;
        const tBreak = Math.min(dIdt !== 0 ? (b.planeAngleDeg * DEG * L.BREAK.fracMax) / Math.abs(dIdt) : Infinity, dLnAdt !== 0 ? L.BREAK.dLnAMax / Math.abs(dLnAdt) : Infinity) / PLAN.yearS;
        rows.push({ pair: b.pair, kind: b.kind, col: b.col, spin: sc, rate, factor: f, dIdt, dLnAdt, aligning: dPlane < 0 ? true : dPlane > 0 ? false : null, dIdeg: dI / DEG, frac, dLnA,
          breaks: frac > L.BREAK.fracMax || Math.abs(dLnA) >= L.BREAK.dLnAMax, tBreakYr: Number.isFinite(tBreak) ? tBreak : null, bandShare: b.dIdt !== 0 ? b.bandDIdt / b.dIdt : null });
      }
    }
  }
  const rng = (a) => { const f = a.filter((x) => x !== null && Number.isFinite(x)); return f.length ? [Math.min(...f), Math.max(...f)] : null; };
  const sg = (a) => a.map((r) => (r.aligning === true ? '+' : r.aligning === false ? '−' : '0')).join('');
  const summary = [];
  for (const col of PLAN.alignCols) for (const sc of PLAN.spinCases) for (const rate of PLAN.rates) {
    if (sc === 's' && rate === 'linked') continue;
    const sel = rows.filter((r) => r.col === col && r.spin === sc && r.rate === rate), P = sel.filter((r) => r.kind === 'sun-planet'), M = sel.filter((r) => r.kind === 'planet-moon'), R = sel.filter((r) => r.kind === 'ring');
    summary.push({ col, spin: sc, rate, sign: { planets: sg(P), moons: sg(M), rings: sg(R) }, fracPlanets: rng(P.map((r) => r.frac)), dLnAPlanets: rng(P.map((r) => Math.abs(r.dLnA))), fracMoons: rng(M.map((r) => r.frac)), fracRings: rng(R.map((r) => r.frac)),
      breaks: { planets: P.filter((r) => r.breaks).length, moons: M.filter((r) => r.breaks).length, rings: R.filter((r) => r.breaks).length, n: [P.length, M.length, R.length] }, tBreakPlanetsYr: rng(P.map((r) => r.tBreakYr)) });
  }
  // 斜めの軌道: 帯を横切る所だけの寄与と、全周の尾の寄与(太陽–惑星 —— 列ごとの帯の中の割合)
  const split = pairs.filter((p) => p.kind === 'sun-planet').map((p) => { const row = { pair: p.name };
    for (const col of PLAN.alignCols) { const b = base.find((x) => x.pair === p.name && x.col === col); row[col] = { bandShare: b.dIdt !== 0 ? b.bandDIdt / b.dIdt : null, outShare: b.dIdt !== 0 ? b.outDIdt / b.dIdt : null, fracIn: b.fracIn }; }
    return row; });
  return { base, rows, summary, split, ageYr: PLAN.ageYr, breakDecl: L.BREAK,
    note: '円軌道・ガウスの式の 1 周の平均(一次の目安)・源は静止・s は源の観測自転の大きさ・fixed は γ を s から(a ∝ s s_d)・linked は γ も s_d から(a ∝ s_d²)・λ_J = 0 は全部 0(表に載せない)・環の粒子の傾きは (H/2)/r の宣言' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const A = J.columns, B = J.dragSpin, E = J.equiv, C = J.align;
  const vb = (c) => A.verdict.find((q) => q.col === c);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    columnsTable: A.rows.length === L.GRID.rho.length * L.GRID.z.length && A.rows.every((r) => L.COLUMNS.every((c) => Number.isFinite(r[c])))
      && A.rows.filter((r) => r.z > 1).every((r) => r.slice === 0) && A.alpha.length === L.DECL.alphas.length * PLAN.alphaPts.length,
    verdictShape: vb('slice').steep && !vb('slice').nonzero && !vb('ball').steep && vb('ball').nonzero && !vb('pair').steep && !vb('shell').steep,
    dragSpinTable: B.rows.length === PLAN.sdBodies.length && B.rows.every((r) => Math.abs(r.jRel1 - 1) < 1e-12 && Math.abs(r.equivRatio - 1) < 1e-12 && r.lambda.length === L.DECL.lambdas.length && r.lambda[0].sd === 0),
    equivEngine: E.rows.every((r) => r.ok === true && r.applied === true && r.relJvsSd <= PLAN.equivTol && r.rel0vsS <= PLAN.equivTol && r.betaSame === true && r.betaRel <= PLAN.equivTol && Math.abs(r.engineMomentFactor / r.ratio1 - 1) <= 1e-6),
    alignTable: C.base.length === 21 * PLAN.alignCols.length && C.rows.every((r) => Number.isFinite(r.dIdt) && Number.isFinite(r.dLnAdt))
      && C.base.filter((b) => b.col === 'slice').every((b) => b.outDIdt === 0) && C.summary.length === PLAN.alignCols.length * (1 + (PLAN.spinCases.length - 1) * 2),
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const BK = X332.readBooks(HP); mark('books');
  const columns = partColumns(); mark('columns');
  const dragSpin = partDragSpin(BK); mark('dragSpin');
  const equiv = partEquiv(HP, BK); mark('equiv');
  const align = partAlign(BK); mark('align');
  const J = { books: { saturnRing: { m: BK.ring.m, spinHours: BK.ring.spinHours, R: BK.ring.R }, solarScale: { uL: BK.solar.uL, uT: BK.solar.uT, uM: BK.solar.uM } }, pure, columns, dragSpin, equiv, align, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export const CODE = ['tests/exp-w333a-rotdiff.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/exp-w332a-eqband.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs',
  'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
export async function main() {
  const TARGET = process.env.W333A_TARGET || 'beta/index.html';
  const OUT = process.env.W333A_OUT ? (path.isAbsolute(process.env.W333A_OUT) ? process.env.W333A_OUT : path.join(ROOT, process.env.W333A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第333便a rotdiff(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w333a-rotdiff.mjs', target: TARGET, targetSha256, reuseFrom: null,
    /** 走行の前の宣言(正本の先頭 —— 尾の関数と係数・物差し・格子・一次外挿が壊れる印) */
    declTail: L.DECL_TAIL, decl: L.DECL, grid: L.GRID, breakDecl: L.BREAK, columns: L.COLUMNS, tailTypes: L.TAIL_TYPES, rates: L.RATES,
    ruling: '原仮定者の整理(2026-11-10)「回転引きずりは引きずり半径の手前と奥の差分 —— 赤道面からの距離が R_d を超えると急激に減衰する・ただし斜め方向も差分は有るので厳密には 0 ではない」「R_d は観測半径とは別の値 —— 引きずり自転は必ずしも観測自転と言えないのでノブになり得る(s_d を、角運動量を保存して半径を R_d に縮めた高速回転で計算する方法も係数付きで検証)」「m_d はなるべく使わない」「重みは m/r² が有力だが他の次数でも検証」(作業仮説 —— 診断で検査・未接続)・統括の検証項目 R317',
    plan: PLAN, notClaim: NOT_CLAIM, fObsSrc: L.F_OBS_SRC, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第333便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'rotdiff', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ と 💍 の本の宣言を読む(步を進めない)・🗺️ の 2 体の写しの読み口 inertialDragIsqState(照合 E —— 源のモーメントの J 案)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

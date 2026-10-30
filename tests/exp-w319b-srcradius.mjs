// 第319便b(原仮定者の指示(第121報)「引きずり半径について」・決断事項 AN445・AN446・AN449・統括の検証項目 R259): **引きずる側の半径 R_src の 3 案・
// 分布した銀河の太陽系近傍・天体別の役割の表の器**(段 srcradius-319b —— 正本 tests/out/srcradius-w319b.json)。html・エンジン・在位の本は変えない(器・lib・正本・文書だけ)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build と読み口 inertialDragIsqState・
// 最上位の inertialDragIsqRule・inertialDragIsqRuleK1・inertialDragIsqK2・inertialDragIsqM2・inertialDrag3MaintCell をそのまま呼ぶ)。1 プロセス(子プロセスなし —— 步は進めない)。
//
// ■ 何をするか(受け手の R_d = Y_k m は不変 —— 引きずる側の半径 R_src は源の回転と軸のモーメントだけ)
//   K 核の照合: lib の K2・M2 とエンジンの inertialDragIsqK2・inertialDragIsqM2 のビット同一・lib の k1RecvSrc(省略の形)と読み口のビット同一。
//   S 源の表: 16 体の写し(入力の本 + spinDrag)で案ごとの R_src・遠方のモーメントの倍率・源ごとの最大の軸の ω。器の中の源のモーメントだけを替えた写し
//     (太陽を pinned にして dragCore.radius = R_src —— 案1・案2a・案3)の読み口と lib の照合・受け手の β がビット同一(水星の役割 —— 並進は変わらない)。
//     案2b(源 K2 + 受け手 K1 の混成)は lib の mixMoment(エンジンに無い形 —— 写しの外の計算)。受け手を K2 にする型は受け手の β が動くので採らない(数を記録)。
//   G 分布した銀河: 宣言の密度の模型(円盤 4 + バルジ)と宣言の平均の流れで太陽の位置の Σβ・共動系の u・勾配・半渦度(格子 3 段)・中心 1 体(第318便d の M_G と同じ全質量)
//     との比較・銀河の軸の源の候補(案ごと —— 分布の物質の公転の数え方の宣言)。中心 1 体の軸の ω は 16 体 + 銀河の SI の写し(lib)で各天体へ・写しの単位の照合はエンジンの写しで。
//   A 加法性: 一様な球を N に分けた写しの並進の移送の遠方の双極子と 1 つの源の回転の項(案ごと)・エンジンの写し(32 要素)で照合。
//   R 天体別の役割(水星〜土星 —— 地球は月の行・土星は環の行): 自転・太陽由来の ω_☉(案ごと)・銀河由来の ω_G(中心 1 体と分布)・角・120° の合成の一般形と固定の 120°・
//     要る大きさ(第318便d の宣言の型)との比・木星の熱(maintain の帳簿の式 —— 源ごと/合成・τ_hold = h₀ の規約)。
//   C 120° の合成の表(等しい大きさの 2 本の比・大きさの比ごとの境界の角)。F まとめ(案ごとの比と広がり)。
//
// ■ 試走: W319B_QUICK=1(W319B_OUT が要る —— 正本を書かない・格子を 1 段・加法性の N を 2 つ)。W319B_WORKERS は受けるが使わない(1 プロセス)。
// ■ 言わないこと: 案のどれかを採った規則と書かない・半渦度を軸引きずり ω_G と同じと書かない・中心 1 体の値を「銀河の引きずり」と呼ばない・
//   金星の自転・木星の熱・公転面を引きずりで説明したと書かない・τ_hold を合わせた値と書かない・数の桁が近いことを証拠と呼ばない・合否と観測の 3σ を付けない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w319b-srcradius.mjs';
import { axisOf, axisDecl } from './lib-w315d-satk1.mjs';
import { galaxyAxis, eclipticOf, GAL } from './lib-w317c-satcut.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 器が大域で読む最上位の関数 inertialDragIsqRule・inertialDragIsqRuleK1・inertialDragIsqK2・
//   inertialDragIsqM2・inertialDrag3MaintCell〔glob.名 の読みは deriveScope が数えない —— 広めの宣言は許される〕。presets と roots の短い名は import した lib の綴りが
//   数えられた分 —— 器の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDrag3MaintCell","inertialDragGalaxyAxialState","inertialDragIsqK2","inertialDragIsqM2","inertialDragIsqRule","inertialDragIsqRuleK1","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w319b-srcradius-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['案のどれかを採った規則と書かない(候補の式の比較)', '半渦度を軸引きずり ω_G と同じと書かない(移送場の診断量)', '中心 1 体の値を「銀河の引きずり」と呼ばない',
  '金星の自転・木星の熱・公転面を引きずりで説明したと書かない', 'τ_hold を合わせた値と書かない(h₀ の規約)', '数の桁が近いことを証拠と呼ばない', '格子の差を収束の判定に使わない(感度診断)'];
export const OUT_SRCRADIUS = 'tests/out/srcradius-w319b.json';
export const INPUT16 = 'tests/data-w318c-solar16-input.json';
export const PLAN = Object.freeze({ grids: L.GRIDS, additivityN: L.DECL.additivityN });
export const QUICK = Object.freeze({ grids: Object.freeze([L.GRIDS[0]]), additivityN: Object.freeze([4, 8]) });
const { nrm, dot, cross, add3, scl3, angDeg, relDiff, vecRel } = L;

/* ───────── エンジンの口(器は loadHtmlMain の大域・QA は headless の evalExpr から同じ形で渡す)───────── */
export function portsOf(HP, glob = globalThis) {
  return { HP, rule: (order) => glob.inertialDragIsqRule(order), ruleK1: (order) => glob.inertialDragIsqRuleK1(glob.inertialDragIsqRule(order)), maintCell: glob.inertialDrag3MaintCell,
    k2: glob.inertialDragIsqK2, m2: glob.inertialDragIsqM2 };
}
export function stateOf(E, book) {
  const v = E.HP.validatePreset(clone(book));
  if (!v.ok) return { ok: false, err: JSON.stringify(v.errors).slice(0, 300) };
  const S = E.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { ok: true, S, warnings: (v.warnings || []).length, isq: E.HP.inertialDragIsqState(S) };
}
/** 節点の和の写しに渡す状態(エンジンの位置・R_d・m_d・自転・軸) */
export function pOf(S, isq) {
  const n = S.n, Rd = new Array(n).fill(0), md = new Array(n).fill(0);
  for (const r of isq.receivers) { Rd[r.i] = r.Rd; md[r.i] = r.md; }
  const A = (k) => Array.from(S[k].subarray(0, n));
  return { n, x: A('x'), y: A('y'), z: A('z'), md, Rd, spin: A('spin'), ax: A('sax'), ay: A('say'), az: A('saz') };
}
/** 単位の換算(本の単位 → SI) */
function pScale(P, u) { return { n: P.n, x: P.x.map((q) => q * u.L), y: P.y.map((q) => q * u.L), z: P.z.map((q) => q * u.L), md: P.md.map((q) => q * u.M), Rd: P.Rd.map((q) => q * u.L), spin: P.spin.map((q) => q / u.T), ax: P.ax.slice(), ay: P.ay.slice(), az: P.az.slice() }; }
const U16 = Object.freeze({ L: L.LU, T: L.TU, M: L.MU });
export const UNITS_GAL = Object.freeze({ L: 17, T: 12, M: 38 });
const uOf = (u) => ({ L: Math.pow(10, u.L), T: Math.pow(10, u.T), M: Math.pow(10, u.M) });

/* ───────── 写しの本 ───────── */
const IN16 = () => JSON.parse(fs.readFileSync(path.join(ROOT, INPUT16), 'utf8'));
const K1_ROT = Object.freeze({ law: 'inertial', invSq: Object.freeze({ Wbg2: 0, order: 8, kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions',
  spinDrag: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' }) });
function physicsOf(src, u) {
  const ph = clone(src.physics); delete ph.gLoc; ph.geoPN = 0; ph.relativeDrag = clone(K1_ROT);
  if (u) { const f = uOf(u); ph.cLight = L.C0 * f.T / f.L; ph.massFloor = 1e-9; }
  return ph;
}
const bodyOf = (m, R, pos, vel, spin, axis, extra = {}) => Object.assign({ type: 'single', m, radius: R, x: pos[0], y: pos[1], z: pos[2], vx: vel[0], vy: vel[1], vz: vel[2], spin, pinned: false,
  spinAxis: Object.assign({ enable: true, source: '器の写し(第319便b)' }, axisDecl(axis)) }, extra);
const bookShell = (id, name, physics, bodies, u) => ({ id, name, description: '器の写し(内蔵ではない —— 第319便b)', emoji: '🌀', sampleClass: 'principle', scaleExp: clone(u || { L: 9, T: 5, M: 28 }),
  integrator: 'leapfrog', camera: { scale: 3000 }, world: { boundary: 'none', size: 0 },
  timeRef: { basis: 'orbit', pRef: 1, pair: [0, 1], def: 'revolution', source: '器の写し(走らせない —— t = 0 の読み口だけ)', stepsPerOrbit: 720 }, physics, bodies,
  overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } });
/** 16 体の写し(入力の本の relativeDrag に spinDrag を足す)。o.sunRsrc: 太陽を pinned にして dragCore.radius = R_src(本の単位 —— 源のモーメントだけを替えた写し) */
export function book16(o = {}) {
  const b = IN16(); b.id = 'srcRadius16_w319b'; b.description = '器の写し(内蔵ではない —— 第319便b)';
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } });
  if (o.sunRsrc !== undefined) { b.bodies[0].pinned = true; b.bodies[0].dragCore = { massFrac: 1, radius: o.sunRsrc }; }
  return b;
}
/** 加法性の写し: 太陽の質量・半径の一様な球を一辺 n の立方格子の要素に分け(要素の自転 0・速さ Ω × x)、赤道面の距離 r に受け手(静止) */
export function bookPieces(n, rOverA) {
  const src = IN16(), sun = src.bodies[0], a = sun.radius, m = sun.m, Om = sun.spin, cells = L.ballCells(n, a), N = cells.length, z = [0, 0, 1], rp = 0.2 * a / n;
  const B = cells.map((c) => bodyOf(m / N, rp, c, [-Om * c[1], Om * c[0], 0], 0, z));
  B.push(bodyOf(1e-6, 1e-3, [rOverA * a, 0, 0], [0, 0, 0], 0, z));
  return { book: bookShell('srcRadiusPieces_w319b', '加法性の写し(要素)', physicsOf(src), B), N, a, m, Om, cells };
}
/** 加法性の写し: 1 つの源(太陽の質量・半径・dragCore.radius = R_src・自転 Ω の z 軸・pinned)と受け手 */
export function bookOne(rOverA, RsrcBook) {
  const src = IN16(), sun = src.bodies[0], a = sun.radius, z = [0, 0, 1];
  const B = [bodyOf(sun.m, a, [0, 0, 0], [0, 0, 0], sun.spin, z, { pinned: true, dragCore: { massFrac: 1, radius: RsrcBook } }), bodyOf(1e-6, 1e-3, [rOverA * a, 0, 0], [0, 0, 0], 0, z)];
  return bookShell('srcRadiusOne_w319b', '加法性の写し(1 つの源)', physicsOf(src), B);
}
/** 単位の照合の写し: 太陽(原点・自転 0)+ 1 au の受け手 + 銀河(pinned・M_G = V0²R0/G_0・R0 ĝc・自転 Ω_ref の軸 ĝ)。単位 UNITS_GAL(第318便d の C と同じ型) */
export function bookGal() {
  const src = IN16(), u = uOf(UNITS_GAL), ga = galaxyAxis(), gc = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg), z = [0, 0, 1], sunM = src.bodies[0].m * L.MU / u.M, MG = mG318(), R0 = GAL.R0kpc * L.KPC;
  const B = [bodyOf(sunM, 1e-3, [0, 0, 0], [0, 0, 0], 0, z), bodyOf(1e-9, 1e-3, [L.AU / u.L, 0, 0], [0, 0, 0], 0, z),
    bodyOf(MG / u.M, 10, gc.map((q) => q * R0 / u.L), [0, 0, 0], ga.OmRefSI * u.T, ga.g, { pinned: true })];
  return bookShell('srcRadiusGal_w319b', '単位の照合の写し(銀河を一つの K1 の源)', physicsOf(src, UNITS_GAL), B, UNITS_GAL);
}
/** 第318便d の宣言の銀河の質量 M_G = V0²R0/G_0 [kg] */
export const mG318 = () => { const V0 = GAL.V0kms * 1e3, R0 = GAL.R0kpc * L.KPC; return V0 * V0 * R0 / L.G0; };

/* ───────── K 核の照合 ───────── */
export function partK(E, st16) {
  const xs = [0.1, 0.25, 0.5, 0.9, 1.05, 1.3, 2, 2.9, 3, 3.5, 6, 30, 1e3, 1e6], B = new Float64Array(4), R = 0.7;
  let k2Same = true, m2Same = true, nK = 0, nM = 0;
  for (const x of xs) {
    const r = x * R; E.k2(r, R, B); const k = L.k2Of(r, R); nK++; if (!(Object.is(B[0], k[0]) && Object.is(B[1], k[1]))) k2Same = false;
    if (x > 1) { E.m2(r, R, B); const m = L.m2Of(r, R); nM++; if (!(Object.is(B[2], m[0]) && Object.is(B[3], m[1]))) m2Same = false; }
  }
  const rule = E.ruleK1(st16.isq.decl.order || 8), P = pOf(st16.S, st16.isq); let worst = 0, cells = 0;
  for (const r of st16.isq.receivers) {
    if (r.pinned) continue;
    const q = L.k1RecvSrc(rule, P, r.i, { gain: 1 });
    for (let j = 0; j < P.n; j++) { if (j === r.i) continue; worst = Math.max(worst, relDiff(q.beta[j], r.beta[j])); cells++; }
    for (const s of q.src) worst = Math.max(worst, vecRel(s.rot, r.rot.slice(s.j * 3, s.j * 3 + 3)));
    worst = Math.max(worst, vecRel(q.omega, r.omega));
  }
  // 単位の照合(本の単位と SI へ換算した同じ状態の節点の和 —— 太陽 → 木星の軸の ω〔受け手の R_d/r が最も大きく丸めの床から遠い〕)と、天体ごとの丸めの感度(太陽 → 各天体)
  const PS = pScale(P, U16), sens = []; let siWorst = 0;
  for (let i = 1; i < P.n; i++) {
    const qb = L.k1RecvSrc(rule, P, i, { gain: 1 }), qs = L.k1RecvSrc(rule, PS, i, { gain: 1 }), ob = qb.src.find((z) => z.j === 0).omega.map((z) => z / L.TU), os = qs.src.find((z) => z.j === 0).omega, e = vecRel(ob, os);
    sens.push({ i, name: L.BODY16[i], rel: e, RdOverR: P.Rd[i] / Math.hypot(P.x[i] - P.x[0], P.y[i] - P.y[0], P.z[i] - P.z[0]) });
    if (i === 6) siWorst = Math.max(siWorst, e);
  }
  return { xs, nK, nM, k2Same, m2Same, replica: { worst, cells, receivers: st16.isq.receivers.filter((r) => !r.pinned).length }, siCheck: { worst: siWorst, receivers: ['木星'] }, sens };
}

/* ───────── S 源の表 ───────── */
export function planRecv(rule, P, R, capL) {
  const out = {};
  for (const pk of L.PLAN_KEYS) {
    const a = L.planArrays(pk, P, R, capL), recv = [];
    for (let i = 0; i < P.n; i++) recv.push(L.k1RecvSrc(rule, P, i, { gain: 1, Rsrc: pk === 'now' ? null : a.Rsrc, mix: pk === 'p2b' ? a.mix : null }));
    out[pk] = { Rsrc: Array.from(a.Rsrc), recv };
  }
  return out;
}
export function partS(E, st16, PR) {
  const P = pOf(st16.S, st16.isq), n = P.n, IN = IN16(), R = IN.bodies.map((b) => b.radius), rule = E.ruleK1(st16.isq.decl.order || 8), capL = L.CAP_SRC_M / L.LU;
  let betaSame = true;
  for (const pk of L.PLAN_KEYS) for (let i = 0; i < n; i++) if (!PR[pk].recv[i].beta.every((v, k) => Object.is(v, PR.now.recv[i].beta[k]))) betaSame = false;
  const omIJ = (pk, i, j) => { const s = PR[pk].recv[i].src.find((z) => z.j === j); return s ? nrm(s.omega) / L.TU : 0; };
  const rows = [];
  for (let j = 0; j < n; j++) {
    let main = -1, best = -1; for (let i = 0; i < n; i++) { if (i === j) continue; const w = omIJ('now', i, j); if (w > best) { best = w; main = i; } }
    const Rd = P.Rd[j] * L.LU, Rs = {}, fac = {}, om = {}, num = {}, inside = {};
    for (const pk of L.PLAN_KEYS) {
      Rs[pk] = PR[pk].Rsrc[j] * L.LU; fac[pk] = pk === 'now' ? 1 : L.farFactor(pk, P.Rd[j], PR[pk].Rsrc[j]); om[pk] = main >= 0 ? omIJ(pk, main, j) : null; num[pk] = (om[pk] !== null && om.now > 0) ? om[pk] / om.now : null;
      inside[pk] = PR[pk].recv.some((q, i) => i !== j && q.src.some((s) => s.j === j && s.inside));
    }
    rows.push({ j, name: L.BODY16[j], m: P.md[j] * L.MU, R: R[j] * L.LU, Rd, f: L.moiOf(j), fLit: L.MOI[j] !== undefined, Rsrc: Rs, factor: fac, main, mainName: main >= 0 ? L.BODY16[main] : null, omMain: om, numFactor: num, inside });
  }
  // 器の中の源のモーメントだけを替えた写し(太陽を pinned・dragCore.radius = R_src)—— 案1・案2a・案3
  const eng = {};
  for (const pk of ['p1', 'p2a', 'p3']) {
    const RsSun = PR[pk].Rsrc[0], st = stateOf(E, book16({ sunRsrc: RsSun }));
    if (!st.ok) { eng[pk] = { ok: false, err: st.err }; continue; }
    const RsArr = P.Rd.slice(); RsArr[0] = RsSun;
    let bs = true, worst = 0, nr = 0;
    for (const r of st.isq.receivers) {
      if (r.pinned) continue; nr++;
      const r0 = st16.isq.receivers.find((q) => q.i === r.i);
      if (!r.beta.every((v, k) => Object.is(v, r0.beta[k]))) bs = false;
      const q = L.k1RecvSrc(rule, P, r.i, { gain: 1, Rsrc: RsArr }), s0 = q.src.find((z) => z.j === 0);
      worst = Math.max(worst, vecRel(s0.rot, r.rot.slice(0, 3)), vecRel(q.omega, r.omega));
    }
    const sunRow = st.isq.rdRule && st.isq.rdRule.bodies.find((q) => q.i === 0);
    eng[pk] = { ok: true, RsrcSun: RsSun * L.LU, RdEngine: sunRow ? sunRow.Rd * L.LU : null, betaSame: bs, worst, receivers: nr, warnings: st.warnings };
  }
  // 受け手を K2 にする型(受け手の W も K2 —— 受け手の R_d = Y_k m)の β(☉ → ☿)と K1 の β の比(採らない型の数)
  const base = E.rule(st16.isq.decl.order || 8), rad = L.radialOf(rule), i = 1, d = (k) => Math.hypot(P.x[i] - P.x[k], P.y[i] - P.y[k], P.z[i] - P.z[k]);
  let ext = 0; for (let k = 0; k < n; k++) if (k !== i && P.Rd[k] > 0) ext += P.md[k] / (d(k) * d(k));
  let bK2 = 0; for (let a = 0; a < base.n; a++) bK2 += rad.w[a] * (P.md[0] / (d(0) * d(0))) / (P.md[i] * base.SK[a] / (P.Rd[i] * P.Rd[i]) + ext);
  const bK1 = st16.isq.receivers.find((q) => q.i === i).beta[0];
  return { capM: L.CAP_SRC_M, rows, betaSame, engine: eng, k2Recv: { receiver: L.BODY16[i], betaK2: bK2, betaK1: bK1, ratio: bK2 / bK1 } };
}

/* ───────── G 分布した銀河 ───────── */
export function partG(E, st16, plan) {
  const mw = plan.grids.map((g) => L.mwLocal(g)), fin = mw[mw.length - 1], F = L.galFrame(), ga = galaxyAxis();
  const sp = (f) => { const v = mw.map(f); return v.length > 1 ? (Math.max(...v) - Math.min(...v)) / Math.abs(v[v.length - 1]) : 0; };
  const spread = { beta: sp((m) => m.total.beta), uCoY: sp((m) => m.total.uCo[1]), halfCurlZ: sp((m) => m.total.halfCurlCo[2]), frob: sp((m) => m.total.frob) };
  const MG = mG318(), c1 = L.centralLocal(MG), c2 = L.centralLocal(fin.total.mKg);
  const hcEcl = F.toEcl(fin.total.halfCurlCo), hcAbs = nrm(fin.total.halfCurlCo);
  // 中心 1 体の軸の ω(今・案1)の主項と勾配の項の上限(lib の galAxialLead —— 節点の和は丸めの床: 受け手の節点の差 R_d,i/r が倍精度の刻みより小さい)
  const P16 = pOf(st16.S, st16.isq), PS = pScale(P16, U16), gcv = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg), R0 = GAL.R0kpc * L.KPC, RdG = L.YK * MG, Om = ga.OmRefSI;
  const xG = [PS.x[0] + gcv[0] * R0, PS.y[0] + gcv[1] * R0, PS.z[0] + gcv[2] * R0], perBody = [];
  for (let i = 0; i < P16.n; i++) {
    const xi = [PS.x[i], PS.y[i], PS.z[i]]; let gradExt = 0;
    for (let k = 0; k < P16.n; k++) { if (k === i) continue; const dd = Math.hypot(PS.x[i] - PS.x[k], PS.y[i] - PS.y[k], PS.z[i] - PS.z[k]); gradExt += PS.md[k] / (dd * dd); }
    const z0 = L.galAxialLead(xi, xG, MG, RdG, Om, ga.g, gradExt), z1 = L.galAxialLead(xi, xG, MG, L.CAP_SRC_M, Om, ga.g, gradExt);
    perBody.push({ i, name: L.BODY16[i], RdOverR: PS.Rd[i] / z0.r, omLead: z0.omega, omLeadAbs: z0.abs, upFactor: z0.upFactor, omUpper: z0.upper, omP1Upper: z1.upper, angLeadG: angDeg(z0.omega, ga.g) });
  }
  // 丸めの床の記録(エンジンの写し bookGal の読み口と、同じ状態を SI へ換算した lib の節点の和の差 —— 太陽と 1 au の受け手)
  const rule = E.ruleK1(st16.isq.decl.order || 8), stG = stateOf(E, bookGal()); let floor = { ok: false, err: stG.err || null };
  if (stG.ok) {
    const uG = uOf(UNITS_GAL), PGb = pOf(stG.S, stG.isq), PSI = pScale(PGb, uG), rows = [];
    for (const r of stG.isq.receivers) {
      if (r.pinned) continue; const q = L.k1RecvSrc(rule, PSI, r.i, { gain: 1 }), oe = r.omega.map((z) => z / uG.T), dG = Math.hypot(PSI.x[r.i] - PSI.x[2], PSI.y[r.i] - PSI.y[2], PSI.z[r.i] - PSI.z[2]);
      let gradExt = 0; for (let k = 0; k < 2; k++) { if (k === r.i) continue; const dd = Math.hypot(PSI.x[r.i] - PSI.x[k], PSI.y[r.i] - PSI.y[k], PSI.z[r.i] - PSI.z[k]); gradExt += PSI.md[k] / (dd * dd); }
      const ld = L.galAxialLead([PSI.x[r.i], PSI.y[r.i], PSI.z[r.i]], [PSI.x[2], PSI.y[2], PSI.z[2]], PSI.md[2], PSI.Rd[2], PSI.spin[2], [PSI.ax[2], PSI.ay[2], PSI.az[2]], gradExt);
      rows.push({ i: r.i, name: r.i === 0 ? '太陽' : '1 au の受け手', engine: nrm(oe), si: nrm(q.omega), rel: vecRel(q.omega, oe), RdOverR: PSI.Rd[r.i] / dG, lead: ld.abs, upFactor: ld.upFactor, engineOverLead: nrm(oe) / ld.abs });
    }
    floor = { ok: true, rows, warnings: stG.warnings };
  }
  // 銀河の軸の源の候補(分布の物質の公転の数え方の宣言 —— 案ごと)
  const Mt = fin.total.mKg, Jz = fin.total.Jz, RsrcJ = Math.sqrt(2.5 * Jz / (Mt * Om)), RobsG = L.MW.RmaxKpc * L.KPC, sun = perBody[0];
  const cand = [
    { key: 'cNow', ja: '中心 1 体・今(R_src = R_d = Y_k M_G・自転 Ω_ref ĝ)', count: '銀河の公転を中心の 1 つの源の自転と数える', Rsrc: RdG, inside: false, val: sun.omUpper, dir: '−ĝ(主項の角 ' + sun.angLeadG.toFixed(1) + '°)' },
    { key: 'cP1', ja: '中心 1 体・案1(R_src = 6.5×10⁶ m)', count: '同上(上限の半径)', Rsrc: L.CAP_SRC_M, inside: false, val: sun.omP1Upper, dir: '同上' },
    { key: 'cP2', ja: '中心 1 体・案2(R_src = R_obs,G —— 宣言の模型の外縁 40 kpc)', count: '同上(観測半径)', Rsrc: RobsG, inside: RobsG > R0, val: null, dir: '—' },
    { key: 'cP3', ja: '中心 1 体・案3(J_d = 宣言の模型の円盤の角運動量 J_z)', count: '同上(源の J —— R_src = √(5J/(2MΩ_ref)))', Rsrc: RsrcJ, inside: RsrcJ > R0, val: RsrcJ > R0 ? null : sun.omUpper * Math.pow(RsrcJ / RdG, 2), dir: '—' },
    { key: 'dist', ja: '分布(要素の公転を並進の項で数える —— 案3 の加法性の読み)', count: '要素の公転は並進の項だけ(源の自転に数えない —— 二重に数えない)', Rsrc: null, inside: false, val: hcAbs, dir: '+ĝ(角 ' + angDeg(hcEcl, ga.g).toFixed(1) + '°)—— 移送場の半渦度(診断量)' }];
  return { flow: clone(L.FLOW), mwDecl: clone(L.MW), grids: mw, spread, central318: c1, centralSameMass: c2, MG, MGsun: MG / L.MSUN, frameOrth: F.orth,
    halfCurlEcl: hcEcl, halfCurlAbs: hcAbs, halfCurlAngG: angDeg(hcEcl, ga.g), halfCurlOverOmRef: hcAbs / Om, OmRef: Om, Jz, Mt, RsrcJ, RsrcJkpc: RsrcJ / L.KPC, RdG, RobsG,
    perBody, floor, cand };
}

/* ───────── A 加法性 ───────── */
export function partA(E, plan) {
  const IN = IN16(), sun = IN.bodies[0], m = sun.m * L.MU, a = sun.radius * L.LU, Om = sun.spin / L.TU, Rd1 = L.YK * m, rA = L.DECL.additivityROverA;
  const rows = plan.additivityN.map((n) => L.additivityRow(n, m, a, Om, rA, Rd1));
  // エンジンの写し(n = 4 —— 32 要素 + 受け手)の β × 宣言の速さの和と、1 つの源(dragCore.radius = √(5J/(2mΩ)))の回転の項の読み口
  const pc = bookPieces(L.DECL.engineRingN, rA), sp = stateOf(E, pc.book); let eng = { ok: false, err: sp.err || null };
  if (sp.ok) {
    const rcv = sp.isq.receivers.find((q) => q.i === pc.N); let uy = 0, ux = 0, J = 0;
    for (let k = 0; k < pc.N; k++) { const c = pc.cells[k]; uy += rcv.beta[k] * (pc.Om * c[0]); ux += rcv.beta[k] * (-pc.Om * c[1]); J += (pc.m / pc.N) * pc.Om * (c[0] * c[0] + c[1] * c[1]); }
    const ph = sp.S, Gb = IN.physics.G, cb = IN.physics.cLight, r = rA * pc.a, uDip = 5 * Gb / (cb * cb) * J / (r * r), Rs = Math.sqrt(2.5 * J / (pc.m * pc.Om));
    const so = stateOf(E, bookOne(rA, Rs)); let one = { ok: false, err: so.err || null };
    if (so.ok) { const r1 = so.isq.receivers.find((q) => q.i === 1), uv = uRotOf(r1.rot.slice(0, 3), so.S.spin[0], [so.S.sax[0], so.S.say[0], so.S.saz[0]]); one = { ok: true, uRot: uv[1], rel: relDiff(uv[1], uy), RsrcBook: Rs, warnings: so.warnings }; }
    eng = { ok: true, N: pc.N, uTrans: uy * L.VU, uTransX: ux * L.VU, uDip: uDip * L.VU, transOverDip: uy / uDip, one, JOverJphys: J / (0.4 * pc.m * pc.a * pc.a * pc.Om), warnings: sp.warnings, nBodies: ph.n };
  }
  return { m, a, Om, Rd1, rOverA: rA, rows, analytic: clone(L.ADDITIVITY), engine: eng };
}
function uRotOf(rv, Om, a) { const ax0 = a[0] * Om, ay0 = a[1] * Om, az0 = a[2] * Om; return [ay0 * rv[2] - az0 * rv[1], az0 * rv[0] - ax0 * rv[2], ax0 * rv[1] - ay0 * rv[0]]; }

/* ───────── R 天体別の役割 ───────── */
export function partR(E, st16, PR, G) {
  const S = st16.S, P = pOf(S, st16.isq), IN = IN16(), aSun = [P.ax[0], P.ay[0], P.az[0]], req = L.requiredOf(IN.bodies[6].radius * L.LU), ga = galaxyAxis(), h0 = IN.physics.stepDt * L.TU;
  const omG = G.halfCurlEcl, spinVec = (i) => [P.ax[i], P.ay[i], P.az[i]].map((q) => q * P.spin[i] / L.TU), dvec = (i, j) => [P.x[i] - P.x[j], P.y[i] - P.y[j], P.z[i] - P.z[j]];
  const srcOf = (pk, i, j) => PR[pk].recv[i].src.find((z) => z.j === j);
  const omSrc = (pk, i, j) => srcOf(pk, i, j).omega.map((q) => q / L.TU);
  const wRotOf = (pk, i, j) => { const s = srcOf(pk, i, j), aj = [P.ax[j], P.ay[j], P.az[j]], u = uRotOf(s.rot, P.spin[j], aj).map((q) => q * L.VU), d = dvec(i, j), dm = nrm(d) * L.LU, sn = nrm(cross(aj, d.map((q) => q / nrm(d)))); return { u: nrm(u), w: nrm(u) / (dm * sn), r: dm }; };
  const I = (i) => L.DECL.inertiaF * P.md[i] * L.MU * Math.pow(IN.bodies[i].radius * L.LU, 2);
  const cellOf = (i, om) => {
    const a = [P.ax[i], P.ay[i], P.az[i]], sp = P.spin[i] / L.TU, z = L.splitOmega(om, a), outE = new Float64Array(9);
    E.maintCell(I(i), sp, a[0], a[1], a[2], z.wp, z.q[0], z.q[1], z.q[2], outE, 0); const lib = L.maintCell(I(i), sp, a[0], a[1], a[2], z.wp, z.q[0], z.q[1], z.q[2]);
    return { Eax: outE[0], Esp: outE[1], Q: outE[2], Qabs: outE[0] + Math.abs(outE[1]), same: Object.is(outE[0], lib[0]) && Object.is(outE[1], lib[1]) && Object.is(outE[2], lib[2]) };
  };
  const rows = [];
  let maintSame = true;
  for (const ro of L.ROLES) {
    const i = ro.i, Om = spinVec(i), gc = G.perBody[i], row = { i, name: L.BODY16[i], role: ro.role, req: ro.req, note: ro.note, Om, OmAbs: nrm(Om), spinSign: Math.sign(P.spin[i]) || 1,
      angOmG: angDeg(Om, ga.g), angOmGdist: angDeg(Om, omG), angOmGcen: angDeg(Om, gc.omLead), omGcenUpper: gc.omUpper, omGdist: nrm(omG),
      cGdist: L.composeOf(Om, omG), cGcen: L.composeOf(Om, gc.omLead), plans: {} };
    for (const pk of L.PLAN_KEYS) {
      const om = omSrc(pk, i, 0), wr = wRotOf(pk, i, 0), cS = L.composeOf(Om, om), cSum = L.composeOf(Om, add3(om, omG)), r = { omSun: nrm(om), angOmSun: angDeg(Om, om), angSunGdist: angDeg(om, omG), cSun: cS, cSum, uRot: wr.u, wRot: wr.w, rAu: wr.r / L.AU };
      if (ro.req === 'plane') { r.reqVal = req.plane; r.ratio = wr.w / req.plane; r.arcsecCentury = wr.w * 100 * L.YEAR * 180 / Math.PI * 3600; }
      else if (ro.req === 'venus') { r.reqVal = req.venus; r.ratio = nrm(om) / req.venus; }
      if (ro.req === 'jupiter' || ro.req === 'venus') {
        const cs = cellOf(i, om), cg = cellOf(i, omG), cc = cellOf(i, add3(om, omG)); maintSame = maintSame && cs.same && cg.same && cc.same;
        r.heat = { sun: cs, gal: cg, comp: cc, perSourceQ: cs.Q + cg.Q, perSourceQabs: cs.Qabs + cg.Qabs, Psun: cs.Q / h0, Pper: (cs.Q + cg.Q) / h0, Pcomp: cc.Q / h0, PabsPer: (cs.Qabs + cg.Qabs) / h0, PabsComp: cc.Qabs / h0 };
        if (ro.req === 'jupiter') Object.assign(r.heat, { ratioPer: r.heat.Pper / req.jupiterP, ratioComp: r.heat.Pcomp / req.jupiterP, ratioAbsPer: r.heat.PabsPer / req.jupiterP, ratioAbsComp: r.heat.PabsComp / req.jupiterP,
          ratioPerAlt: r.heat.Pper / req.jupiterPAlt, ratioAbsPerAlt: r.heat.PabsPer / req.jupiterPAlt, tauReqPer: (cs.Q + cg.Q) / req.jupiterP, tauReqAbsPer: (cs.Qabs + cg.Qabs) / req.jupiterP });
        if (ro.req === 'jupiter') { r.reqVal = req.jupiterP; r.ratio = r.heat.ratioAbsPer; }
      }
      row.plans[pk] = r;
    }
    rows.push(row);
  }
  // 地球の行: 月(潮汐ロック)の受け手 —— 地球 → 月・太陽 → 月、地球の受け手 —— 月 → 地球
  const moon = { i: 4, name: L.BODY16[4], Om: spinVec(4), OmAbs: nrm(spinVec(4)), plans: {} };
  { const d = dvec(4, 3), v = [S.vx[4] - S.vx[3], S.vy[4] - S.vy[3], S.vz[4] - S.vz[3]], nOrb = nrm(cross(d, v)) / (nrm(d) * nrm(d)) / L.TU; moon.nOrb = nOrb; moon.spinOverOrb = moon.OmAbs / nOrb; }
  for (const pk of L.PLAN_KEYS) {
    const oE = omSrc(pk, 4, 3), oS = omSrc(pk, 4, 0), oM = omSrc(pk, 3, 4);
    moon.plans[pk] = { omEarth: nrm(oE), omSun: nrm(oS), angOmEarth: angDeg(moon.Om, oE), cEarth: L.composeOf(moon.Om, oE), cSum: L.composeOf(moon.Om, add3(add3(oE, oS), omG)), omMoonOnEarth: nrm(oM), cMoonOnEarth: L.composeOf(spinVec(3), oM), omSunOnEarth: nrm(omSrc(pk, 3, 0)) };
  }
  // 土星の行: 環(別の受け皿)—— 土星の赤道面の環の半径に試験の粒子(太陽 + 土星 + 粒子の SI の写し)
  const ring = [], iS = 11, aS = [P.ax[iS], P.ay[iS], P.az[iS]], ePerp = (() => { const t = cross(aS, [0, 0, 1]); const s = nrm(t); return t.map((q) => q / s); })();
  const PSI = pScale(P, U16), mS = PSI.md[iS], ruleK1 = E.ruleK1(st16.isq.decl.order || 8);
  for (const rr of L.DECL.ringRadiiM) {
    const mt = 1e10, Pr = { n: 3, x: [PSI.x[0], PSI.x[iS], PSI.x[iS] + ePerp[0] * rr], y: [PSI.y[0], PSI.y[iS], PSI.y[iS] + ePerp[1] * rr], z: [PSI.z[0], PSI.z[iS], PSI.z[iS] + ePerp[2] * rr],
      md: [PSI.md[0], mS, mt], Rd: [PSI.Rd[0], PSI.Rd[iS], L.YK * mt], spin: [PSI.spin[0], PSI.spin[iS], 0], ax: [PSI.ax[0], aS[0], 0], ay: [PSI.ay[0], aS[1], 0], az: [PSI.az[0], aS[2], 1] };
    const vK = Math.sqrt(L.G0 * mS / rr), Robs = IN.bodies[iS].radius * L.LU, row = { rM: rr, rOverRobs: rr / Robs, vK, plans: {} };
    for (const pk of L.PLAN_KEYS) {
      const Rs = L.rSrcOf(pk, PSI.Rd[iS], Robs, L.moiOf(iS), L.CAP_SRC_M), RsArr = Pr.Rd.slice(); RsArr[1] = Rs;
      const q = L.k1RecvSrc(ruleK1, Pr, 2, { gain: 1, Rsrc: pk === 'now' ? null : RsArr, mix: pk === 'p2b' ? [0, 1, 0] : null }), s = q.src.find((z) => z.j === 1), u = nrm(uRotOf(s.rot, Pr.spin[1], aS));
      row.plans[pk] = { Rsrc: Rs, u, uOverV: u / vK, inside: s.inside };
    }
    row.p2bOverP2a = row.plans.p2b.u / row.plans.p2a.u;
    ring.push(row);
  }
  return { req, h0, inertiaF: L.DECL.inertiaF, omGdist: omG, rows, moon, ring, maintSame };
}

/* ───────── C 120° の表 ───────── */
export function partC() {
  const eq = [60, 90, 110, 120, 130, 150, 180].map((t) => ({ thetaDeg: t, ratio: L.equalMagRatio(t), decel: L.equalMagRatio(t) < 1 }));
  const thr = [2, 1, 0.5, 0.1, 1e-3, 1e-6, 1e-12].map((r) => ({ wOverW: r, thetaCritDeg: r <= 2 ? Math.acos(-r / 2) * 180 / Math.PI : null, minus90: r <= 2 ? Math.asin(r / 2) * 180 / Math.PI : null }));
  return { equal: eq, threshold: thr };
}

/* ───────── F まとめ ───────── */
export function partF(J) {
  const R = J.R, rowOf = (i) => R.rows.find((r) => r.i === i), keys = L.PLAN_KEYS, me = rowOf(1), ea = rowOf(3), ma = rowOf(5), ve = rowOf(2), ju = rowOf(6);
  const line = (key, ja, f) => { const o = { key, ja }; for (const pk of keys) o[pk] = f(pk); return o; };
  const rows = [
    line('planeMercury', '公転面(水星 —— 回転の率 / 3°/太陽系の年齢)', (pk) => me.plans[pk].ratio),
    line('planeEarth', '公転面(地球)', (pk) => ea.plans[pk].ratio),
    line('planeMars', '公転面(火星 —— 対照)', (pk) => ma.plans[pk].ratio),
    line('venus', '金星の軸を π(仮の期間 1 Gyr)', (pk) => ve.plans[pk].ratio),
    line('jupiterNow', '木星の熱(今の帳簿 —— 源ごと・τ_hold = h₀)', (pk) => ju.plans[pk].heat.ratioPer),
    line('jupiterAbs', '木星の熱(候補 (b) 減速の分も熱 —— 源ごと・τ_hold = h₀)', (pk) => ju.plans[pk].heat.ratioAbsPer)];
  const galaxy = { ja: '銀河の軸(分布の半渦度 / 第318便d の散逸の率 1/τ —— 大きさだけの比)', req: 1 / R.req.Tage, now: J.G.halfCurlAbs, ratio: J.G.halfCurlAbs * R.req.Tage,
    cenUpper: J.G.perBody[0].omUpper, cenUpperRatio: J.G.perBody[0].omUpper * R.req.Tage };
  const spread = {};
  for (const pk of keys) { const v = ['planeMercury', 'venus', 'jupiterAbs'].map((k) => Math.log10(Math.abs(rows.find((r) => r.key === k)[pk]))); spread[pk] = Math.max(...v) - Math.min(...v); }
  const spreadNow = {};
  for (const pk of keys) { const v = ['planeMercury', 'venus', 'jupiterNow'].map((k) => Math.log10(Math.abs(rows.find((r) => r.key === k)[pk]))); spreadNow[pk] = Math.max(...v) - Math.min(...v); }
  return { rows, galaxy, spreadAbs: spread, spreadNow };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {};
  G.kKernel = !!(J.K && J.K.k2Same && J.K.m2Same); G.kReplica = !!(J.K && J.K.replica.worst === 0 && J.K.replica.receivers === 16);
  G.sBetaSame = !!(J.S && J.S.betaSame);
  G.sEngine = !!(J.S && ['p1', 'p2a', 'p3'].every((k) => J.S.engine[k] && J.S.engine[k].ok && J.S.engine[k].betaSame && J.S.engine[k].worst <= 1e-12));
  G.gGrids = !!(J.G && J.G.grids.every((m) => Number.isFinite(m.total.beta) && Number.isFinite(m.total.halfCurlCo[2])) && J.G.spread.beta <= 1e-2);
  G.kSi = !!(J.K && J.K.siCheck.worst <= 1e-6); G.gFloor = !!(J.G && J.G.floor.ok); G.gFrame = !!(J.G && J.G.frameOrth <= 1e-12);
  G.aEngine = !!(J.A && J.A.engine.ok && J.A.engine.one.ok && J.A.engine.one.rel <= 1e-3 && Math.abs(J.A.engine.transOverDip - 1) <= 1e-3);
  G.aDipole = !!(J.A && J.A.rows.every((r) => Math.abs(r.transOverDip - 1) <= 1e-3));
  G.rMaint = !!(J.R && J.R.maintSame);
  return G;
}

/* ───────── 実行 ───────── */
export async function runSrcRadius(E, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'srcradius', quick: !!o.quick, plan: clone(P), rule: '受け手 K1 + rdRule:"kappaM"(R_d = Y_k m・Y_k = 10G_0/(C_1c_0²))は不変 —— 源の回転と軸のモーメントの半径 R_src だけ案ごとに', C1: L.C1, Yk: L.YK,
    decl: clone(L.DECL), plans: clone(L.PLANS), moi: clone(L.MOI), moiUniform: L.MOI_UNIFORM, lit: clone(L.LIT319) };
  const st16 = stateOf(E, book16()); if (!st16.ok) throw new Error('16 体の写しが受理されない: ' + st16.err);
  J.K = partK(E, st16); tick('K');
  const P16 = pOf(st16.S, st16.isq), PR = planRecv(E.ruleK1(st16.isq.decl.order || 8), P16, IN16().bodies.map((b) => b.radius), L.CAP_SRC_M / L.LU);
  J.S = partS(E, st16, PR); tick('S');
  J.G = partG(E, st16, P); tick('G');
  J.A = partA(E, P); tick('A');
  J.R = partR(E, st16, PR, J.G); tick('R');
  J.C = partC(); tick('C');
  J.F = partF(J); tick('F');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W319B_TARGET || 'beta/index.html', quick = process.env.W319B_QUICK === '1';
  const OUT = process.env.W319B_OUT ? (path.isAbsolute(process.env.W319B_OUT) ? process.env.W319B_OUT : path.join(ROOT, process.env.W319B_OUT)) : path.join(ROOT, OUT_SRCRADIUS);
  if (quick && !process.env.W319B_OUT) throw new Error('試走(W319B_QUICK=1)は W319B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html), E = portsOf(HP, globalThis);
  console.log('第319便b srcradius: ' + (quick ? '試走' : '正本') + '・1 プロセス');
  const R = await runSrcRadius(E, { quick, plan: quick ? QUICK : PLAN });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w319b-srcradius.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(第121報)「引きずり半径について」(今の R_d は K1 の引きずられる側で合わせた値 —— 引きずる側の半径を別の値に分ける案を検討する: 案1 上限 6.5e6 m の観測半径・'
      + '案2 K2・上限なし・案3 計算式を探索する/銀河の引きずりは中心天体だけの影響ではない —— 手掛かりとして太陽系近傍の影響を算出する)・「検証時の天体別の役割の参考」(水星〜土星)・'
      + '決断事項 AN445・AN446・AN449・統括の検証項目 R259。受け手の R_d = Y_k m・規則・在位の本・エンジンの式は変えない(器・lib・正本・文書だけ)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w319b-srcradius.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/lib-w318d-dragest.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第319便b', target: TARGET, code: CODE, inputs: [TARGET, INPUT16] }), {
    harnessVersion: HARNESS_VERSION, stage: 'srcradius',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス・步は進めない)',
    literature: Object.values(L.LIT319).map((z) => z.name + ' = ' + z.value + ' ' + z.unit + '(本便は一次資料に当たっていない)'),
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

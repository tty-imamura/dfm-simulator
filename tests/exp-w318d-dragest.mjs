// 第318便d(原仮定者の指示(第120報)「引きずりについて」・決断事項 AN438・統括の検証項目 R257): **銀河と太陽の引きずりの見積りの器**
// (段 dragest-318d —— 正本 tests/out/dragest-w318d.json)。規則・在位の本・エンジンの式は変えない(器・lib・正本・文書だけ —— 新しい法則は足さない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState・inertialDragGalaxyAxialState・最上位の inertialDragIsqRule・inertialDragIsqRuleK1・inertialDrag3MaintCell をそのまま呼ぶ)。1 プロセス(子プロセスなし)。
//
// ■ 何をするか(第120報の仮定を仮定として置き、①要る大きさ ②今の K1 の規則〔R_d = Y_k m・Y_k = 10G_0/(C_1c_0²)〕が作る大きさを同じ表に並べる)
//   A 銀河の並進(規約の大きさ): 太陽 + 試験の惑星(銀河の中心の向きに ±1・30・100 au)+ 銀河(宣言の M_G = V0²R0/G_0・R0 —— pinned の遠い源)の写しの t = 0 の β を読み口で取り、
//     規則の節点の式(β = (R_d/r) g(x))と照合してから、共通の β・向きの差 Δβ・速さの差 Δu = Δβ V0 と公転の速さの比・受け手の速さに比例する分を並べる。
//   B ハロー(NGC 3198): 見える質量(星 Υ L_3.6 の指数の円盤・ガス 1.33 Σ_HI —— 薄い円盤の環の和)・要る移送 u_req = V − V_bar²/V・回転の項の源の粒度 3 つ
//     (1 つの源・8 環 × 16・格子 16×32 と 32×64)で R_tot を自由にした最小二乗の値 → M_drag = R_tot/Y_k と M_vis の比。1 点を読み口(源 + 受け手の写し)で照合。
//   C 銀河の軸: ĝ(南銀極)と 16 体の符号つきの自転・重心系の公転の角運動量の和の角・歳差の形が逆向きを選ばないこと(式と数)・銀河を一つの K1 の源とした軸の ω
//     (読み口 —— 写しの複製で照合)・一様軸 galaxyAxial の受け手の応答(読み口)。
//   D 太陽の回転: 16 体の写しの太陽の自転が惑星に作る回転の移送(読み口)・公転面の傾斜の復元に要る率(宣言の型)・測る形の試し(太陽 + 水星の写し・回転の引きずりの有無 × h・h/2)。
//   E 太陽の軸: 太陽 → 金星・木星の軸の ω(読み口と節点の和の写し)・金星の軸を π 回すのに要る |ω|(仮の期間)・到達の条件・木星の熱の電力と maintain の帳簿の式で要る τ_hold・
//     自転のエネルギーの収支。
//   F まとめ: 仮定ごとの「要る大きさ」「今の K1」「比」と候補の規則(R_d,spin = 観測半径・J を別の入力)で同じ表をもう一度。
//
// ■ 試走: W318D_QUICK=1(W318D_OUT が要る —— 正本を書かない・B の格子を 1 つ・D の走行を 2 公転)。W318D_WORKERS は受けるが使わない(1 プロセス)。
// ■ 言わないこと: 最小二乗の値は見積りの値(合わせた値・較正の値と呼ばない)・ハロー・回転曲線・金星の自転・木星の熱を引きずりで説明したとは書かない・
//   銀河の R_d・ω_G・τ_hold を観測から決めたと書かない・数の桁が近いことを証拠と呼ばない。合否・観測の 3σ は付けない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w318d-dragest.mjs';
import { galaxyAxis, eclipticOf, GAL } from './lib-w317c-satcut.mjs';
import { axisDecl } from './lib-w315d-satk1.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 器が大域で読む最上位の関数 inertialDragIsqRule・inertialDragIsqRuleK1・inertialDrag3MaintCell
//   〔glob.名 の読みは deriveScope が数えない —— 広めの宣言は許される〕。presets と "ab"・"ch"・"ctx"・"cw"・"T"・"$" は import した lib〔tests/lib-w317c-satcut.mjs・
//   tests/lib-w315d-satk1.mjs ほか〕の綴りが数えられた分 —— 器の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDrag3MaintCell","inertialDragGalaxyAxialState","inertialDragIsqRule","inertialDragIsqRuleK1","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w318d-dragest-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['最小二乗の値を合わせた値・較正の値と呼ばない', '刻みの差を収束の判定に使わない(感度診断)', 'ハロー・回転曲線・金星の自転・木星の熱を引きずりで説明したとは書かない', '銀河の R_d・ω_G・τ_hold を観測から決めたと書かない', '数の桁が近いことを証拠と呼ばない', '観測の 3σ の合否を付けない'];
export const OUT_DRAGEST = 'tests/out/dragest-w318d.json';
export const INPUT16 = 'tests/data-w318c-solar16-input.json';
export const CSV_GAL = 'paper/data/cluster-galaxy-observations.csv';
export const PLAN = Object.freeze({ radiiAu: Object.freeze([1, 30, 100]), grids: L.DECL.grids, dOrbits: L.DECL.dRuns.orbits });
export const QUICK = Object.freeze({ radiiAu: PLAN.radiiAu, grids: Object.freeze([L.DECL.grids[0]]), dOrbits: 2 });
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unitV = (a) => { const s = nrm(a); return [a[0] / s, a[1] / s, a[2] / s]; };
const angD = (a, b) => Math.atan2(nrm(cross(a, b)), dot(a, b)) * 180 / Math.PI;
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));

/* ───────── エンジンの口(器は loadHtmlMain の大域・QA は headless の evalExpr から同じ形で渡す)───────── */
export function portsOf(HP, glob = globalThis) {
  return { HP, ruleK1: (order) => glob.inertialDragIsqRuleK1(glob.inertialDragIsqRule(order)), maintCell: glob.inertialDrag3MaintCell,
    galaxyState: HP.inertialDragGalaxyAxialState || glob.inertialDragGalaxyAxialState || null };
}
/** 写しを受理して build(步は進めない)・読み口 */
export function stateOf(E, book) {
  const v = E.HP.validatePreset(clone(book));
  if (!v.ok) return { ok: false, err: JSON.stringify(v.errors).slice(0, 300) };
  const S = E.HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { ok: true, S, warnings: (v.warnings || []).length, isq: E.HP.inertialDragIsqState(S), gal: E.galaxyState ? E.galaxyState(S) : null };
}
/** 節点の和の写し k1Recv に渡す状態(エンジンの位置・R_d・m_d・自転・軸) */
export function pOf(S, isq) {
  const n = S.n, Rd = new Array(n).fill(0), md = new Array(n).fill(0);
  for (const r of isq.receivers) { Rd[r.i] = r.Rd; md[r.i] = r.md; }
  const A = (k) => Array.from(S[k].subarray(0, n));
  return { n, x: A('x'), y: A('y'), z: A('z'), md, Rd, spin: A('spin'), ax: A('sax'), ay: A('say'), az: A('saz') };
}
/** 読み口と節点の和の写しの照合(β・回転の係数・軸の ω —— 相対の差の最大) */
export function replicaCheck(E, st, gain) {
  const rule = E.ruleK1(st.isq.decl.order || 8), P = pOf(st.S, st.isq); let worst = 0, cells = 0;
  for (const r of st.isq.receivers) {
    if (r.pinned) continue;
    const q = L.k1Recv(rule, P, r.i, { gain });
    for (let j = 0; j < P.n; j++) { if (j === r.i) continue; worst = Math.max(worst, relD(q.beta[j], r.beta[j])); cells++; }
    if (r.rot) for (const s of q.src) worst = Math.max(worst, L.vecRel(s.rot, r.rot.slice(s.j * 3, s.j * 3 + 3)));
    if (r.omega) worst = Math.max(worst, L.vecRel(q.omega, r.omega));
  }
  return { worst, cells, receivers: st.isq.receivers.filter((r) => !r.pinned).length };
}

/* ───────── 写しの本 ───────── */
const IN16 = () => JSON.parse(fs.readFileSync(path.join(ROOT, INPUT16), 'utf8'));
const K1_ROT = Object.freeze({ law: 'inertial', invSq: Object.freeze({ Wbg2: 0, order: 8, kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions',
  spinDrag: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' }) });
/**
 * 銀河の尺度の写しの単位(本の受理は質量 ≤ 2×10⁴・位置 ≤ 5×10³ の本の単位へ丸める —— 太陽系の単位 10⁹ m / 10²⁸ kg では銀河を置けない)。
 * G = 6.674 の数のまま SI の G_0 になるよう 3L − M − 2T = −11(c_0 は本の単位へ)。GAL: 10¹⁷ m / 10¹² s / 10³⁸ kg(A・C)・HALO: 10¹⁸ m / 10¹⁰ s / 10⁴⁵ kg(B)
 */
export const UNITS_GAL = Object.freeze({ L: 17, T: 12, M: 38 }), UNITS_HALO = Object.freeze({ L: 18, T: 10, M: 45 });
const uOf = (u) => ({ L: Math.pow(10, u.L), T: Math.pow(10, u.T), M: Math.pow(10, u.M) });
/** 器の写しの physics(16 体の入力の physics から G_loc・PN を外し、relativeDrag を差し替える —— t = 0 の読み口だけ)。u: 単位(省略は 16 体の単位) */
function physicsOf(src, drag, u) {
  const ph = clone(src.physics); delete ph.gLoc; ph.geoPN = 0; ph.relativeDrag = clone(drag);
  if (u) { const f = uOf(u); ph.cLight = L.C0 * f.T / f.L; ph.massFloor = 1e-9; }
  return ph;
}
/** 本の単位の Y_k(本の G と c —— html の invSqKappa0 と同じ演算の順) */
const ykBook = (ph) => (10 * ph.G) / (L.C1 * ph.cLight * ph.cLight);
const bodyOf = (m, R, pos, vel, spin, axis, extra = {}) => Object.assign({ type: 'single', m, radius: R, x: pos[0], y: pos[1], z: pos[2], vx: vel[0], vy: vel[1], vz: vel[2], spin, pinned: false,
  spinAxis: Object.assign({ enable: true, source: '器の写し(第318便d)' }, axisDecl(axis)) }, extra);
const bookShell = (id, name, physics, bodies, u) => ({ id, name, description: '器の写し(内蔵ではない —— 第318便d)', emoji: '🌀', sampleClass: 'principle', scaleExp: clone(u || L.UNITS),
  integrator: 'leapfrog', camera: { scale: 3000 }, world: { boundary: 'none', size: 0 },
  timeRef: { basis: 'orbit', pRef: 1, pair: [0, 1], def: 'revolution', source: '器の写し(走らせない —— t = 0 の読み口だけ)', stepsPerOrbit: 720 }, physics, bodies,
  overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } });
/** A の写し(受け手 1 つずつ): 太陽(原点・自転 0)+ 試験の受け手(本の質量の下限 10⁻⁹ —— 銀河の中心の向き ĝc に sg·r)+ 銀河(pinned・宣言の M_G・R0 ĝc)。単位 UNITS_GAL */
export function bookA(rAu, sg) {
  const src = IN16(), u = uOf(UNITS_GAL), gd = L.galaxyDeclA(), gc = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg), z = [0, 0, 1], sunM = src.bodies[0].m * L.MU / u.M, r = sg * rAu * L.AU / u.L;
  const B = [bodyOf(sunM, 1e-3, [0, 0, 0], [0, 0, 0], 0, z), bodyOf(1e-9, 1e-3, gc.map((q) => q * r), [0, 0, 0], 0, z), bodyOf(gd.MG / u.M, 10, gc.map((q) => q * gd.R0 / u.L), [0, 0, 0], 0, z, { pinned: true })];
  return bookShell('dragEstA_w318d', '銀河の並進の見積りの写し', physicsOf(src, { law: 'inertial', invSq: { Wbg2: 0, order: 8, kernel: 'k1', rdRule: 'kappaM' }, pairs: 'all', history: 'positions' }, UNITS_GAL), B, UNITS_GAL);
}
/** B の照合の写し: 源(原点・m = R_tot/Y_k・半径 R_tot・自転 Ω の z 軸)+ 受け手(面内 r —— 小さい質量) */
export function bookB(RtotM, rM, OmSI) {
  const src = IN16(), u = uOf(UNITS_HALO), ph = physicsOf(src, K1_ROT, UNITS_HALO), Yb = ykBook(ph), Rb = RtotM / u.L;
  const B = [bodyOf(Rb / Yb, Rb, [0, 0, 0], [0, 0, 0], OmSI * u.T, [0, 0, 1], { pinned: true }), bodyOf(1e-6, 1e-3, [rM / u.L, 0, 0], [0, 0, 0], 0, [0, 0, 1])];
  return bookShell('dragEstB_w318d', 'ハローの回転の項の照合の写し', ph, B, UNITS_HALO);
}
/** C の写し: 太陽(原点・自転 0)+ 試験の受け手(1 au・本の質量の下限・自転 0)+ 銀河(pinned・M_G・R0 ĝc・自転 Ω_ref の軸 ĝ)。単位 UNITS_GAL */
export function bookC() {
  const src = IN16(), u = uOf(UNITS_GAL), gd = L.galaxyDeclA(), ga = galaxyAxis(), gc = eclipticOf(GAL.gcRaDeg, GAL.gcDecDeg), z = [0, 0, 1], sunM = src.bodies[0].m * L.MU / u.M;
  const B = [bodyOf(sunM, 1e-3, [0, 0, 0], [0, 0, 0], 0, z), bodyOf(1e-9, 1e-3, [L.AU / u.L, 0, 0], [0, 0, 0], 0, z),
    bodyOf(gd.MG / u.M, 10, gc.map((q) => q * gd.R0 / u.L), [0, 0, 0], ga.OmRefSI * u.T, ga.g, { pinned: true })];
  return bookShell('dragEstC_w318d', '銀河を一つの K1 の源とした軸の写し', physicsOf(src, K1_ROT, UNITS_GAL), B, UNITS_GAL);
}
/** 16 体の写し(入力の本の relativeDrag に spinDrag を足す —— 状態・G_loc・PN はそのまま)。o.galaxy: galaxyAxial の宣言 */
export function book16(o = {}) {
  const b = IN16(); b.id = 'dragEst16_w318d'; b.description = '器の写し(内蔵ではない —— 第318便d)';
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } });
  if (o.galaxy) b.physics.relativeDrag.galaxyAxial = clone(o.galaxy);
  return b;
}
/** D の走行の写し: 16 体の入力の太陽と水星(重心 0・全運動量 0)・水星の公転面を x 軸のまわりに tilt [rad] 傾ける・回転の引きずりの有無 */
export function bookD(rotOn, tilt) {
  const b = IN16(), sun = clone(b.bodies[0]), me = clone(b.bodies[1]), c = Math.cos(tilt), s = Math.sin(tilt);
  const rel = [me.x - sun.x, me.y - sun.y, me.z - sun.z], relv = [me.vx - sun.vx, me.vy - sun.vy, me.vz - sun.vz], rx = (v) => [v[0], c * v[1] - s * v[2], s * v[1] + c * v[2]];
  const r1 = rx(rel), v1 = rx(relv), M = sun.m + me.m;
  Object.assign(sun, { x: -me.m / M * r1[0], y: -me.m / M * r1[1], z: -me.m / M * r1[2], vx: -me.m / M * v1[0], vy: -me.m / M * v1[1], vz: -me.m / M * v1[2] });
  Object.assign(me, { x: sun.m / M * r1[0], y: sun.m / M * r1[1], z: sun.m / M * r1[2], vx: sun.m / M * v1[0], vy: sun.m / M * v1[1], vz: sun.m / M * v1[2] });
  const P = 2 * Math.PI * Math.sqrt(Math.pow(nrm(r1), 3) / (b.physics.G * M));
  b.id = 'dragEstD_w318d'; b.name = '太陽 + 水星(器の写し —— 第318便d)'; b.description = '器の写し(内蔵ではない —— 第318便d)'; b.bodies = [sun, me];
  b.timeRef = { basis: 'orbit', pRef: Number(P.toPrecision(12)), pair: [0, 1], def: 'revolution', source: '水星の太陽に対する接触の周期(16 体の入力の状態から)', stepsPerOrbit: L.DECL.dRuns.stepsPerOrbit };
  b.physics.stepDt = Number((P / L.DECL.dRuns.stepsPerOrbit).toPrecision(12));
  b.physics.relativeDrag = clone(b.physics.relativeDrag);
  if (rotOn) b.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip' };
  return b;
}

/* ───────── A ───────── */
export function partA(E, radiiAu) {
  const an = L.partAAnalytic(IN16().bodies[0].m * L.MU, radiiAu), rows = [], u = uOf(UNITS_GAL);
  let worst = 0, rep = 0, warn = 0, err = null;
  for (const ra of radiiAu) {
    const row = { rAu: ra };
    for (const [key, sg] of [['toward', 1], ['away', -1]]) {
      const st = stateOf(E, bookA(ra, sg)); if (!st.ok) { err = st.err; continue; }
      const rule = E.ruleK1(st.isq.decl.order), rad = L.radialOf(rule), P = pOf(st.S, st.isq), r = st.isq.receivers.find((q) => q.i === 1);
      const d = (j) => Math.hypot(P.x[1] - P.x[j], P.y[1] - P.y[j], P.z[1] - P.z[j]), x = P.Rd[0] / d(0) + P.Rd[2] / d(2), g = L.gRule(x, rad);
      const bG = P.Rd[2] / d(2) * g, bS = P.Rd[0] / d(0) * g;
      worst = Math.max(worst, relD(bG, r.beta[2]), relD(bS, r.beta[0])); rep = Math.max(rep, replicaCheck(E, st, 0).worst); warn += st.warnings;
      row[key] = { betaG: r.beta[2], betaSun: r.beta[0], betaGRule: bG, x, RdG: P.Rd[2] * u.L, RdSun: P.Rd[0] * u.L };
    }
    if (!row.toward || !row.away) { rows.push(row); continue; }
    const a = an.rows[radiiAu.indexOf(ra)];
    row.dBeta = row.toward.betaG - row.away.betaG; row.dBetaLin = a.dBetaLin; row.du = row.dBeta * an.decl.V0; row.vOrb = a.vOrb; row.duOverV = row.du / a.vOrb;
    row.selfPart = row.toward.betaG * a.vOrb; row.tidal2 = a.tidal2; row.betaSunOverG = row.toward.betaSun / row.toward.betaG;
    rows.push(row);
  }
  const ok = !err && rows.every((r) => r.toward && r.away), rad8 = L.radialOf(E.ruleK1(8)), g0 = L.gRule(0, rad8);
  return { ok, err, gRule0: g0, gRule0RelC1: relD(g0, L.C1), decl: an.decl, beta0C1: an.beta0, beta10V2: an.beta10V2, uniform: an.uniform, betaGEngine: ok ? rows[0].toward.betaG : null, rows, ruleCheck: worst, replica: { worst: rep }, warnings: warn, units: clone(UNITS_GAL) };
}

/* ───────── B ───────── */
export function partB(E, csvText, plan) {
  const N = L.ngc3198Of(csvText), vis = L.visibleModel(N), req = L.requiredU(N, vis), rule = E.ruleK1(8), rad = L.radialOf(rule);
  const models = [L.partBModel(req, N, vis, rad, 1, 'one'), L.partBModel(req, N, vis, rad, L.DECL.rings, 'rings')];
  for (const g of plan.grids) models.push(L.partBModel(req, N, vis, rad, g, 'grid' + g.nr + 'x' + g.np));
  // 1 点の照合: 1 つの源の最良の R_tot・受け手を 20 kpc の行へ(読み口の β と回転の係数 → u_φ)
  const m1 = models[0], p = req.find((z) => z.rKpc > 20) || req[req.length - 1], OmSI = N.Vflat / N.Rs, st = stateOf(E, bookB(m1.best.Rtot, p.R, OmSI));
  let check = { ok: false, err: st.err || null };
  if (st.ok) {
    const uh = uOf(UNITS_HALO), r = st.isq.receivers.find((q) => q.i === 1), u = L.uRotOf(r.rot.slice(0, 3), st.S.spin[0], [st.S.sax[0], st.S.say[0], st.S.saz[0]]), uSI = u[1] * uh.L / uh.T;
    const RtotE = st.isq.rdRule.bodies.find((q) => q.i === 0).Rd * uh.L, OmE = st.S.spin[0] / uh.T, zE = L.uPhiAt(p.R, L.sourcesOf(1, N.Rs), RtotE, OmE, rad, 1);   // 自転はエンジンの値(Float32 の丸め)
    check = { ok: true, rKpc: p.rKpc, RtotEngine: RtotE, uEngine: uSI, uLib: zE.u, betaEngine: r.beta[0], betaLib: zE.beta, relU: relD(uSI, zE.u), relBeta: relD(r.beta[0], zE.beta), warnings: st.warnings };
  }
  const rObs = L.KPC * N.vrot[N.vrot.length - 1].rKpc;
  return { decl: { omegaSrc: L.DECL.haloOmegaSrc, OmSrc: OmSI, rings: L.DECL.rings, grids: plan.grids, azimuths: L.DECL.azimuths, innerKpc: L.DECL.regionInnerKpc, outerKpc: L.DECL.regionOuterKpc,
    reading: '定常・軸対称・純円運動・観測の速さを座標の移送の速さと読む(宣言)—— 慣性の速さは V − u・重力は見える質量だけ', vrotDeprojected: N.vrotDeprojected },
    data: { L36: N.L36, ups: N.ups, Rs: N.Rs, MHI: N.MHI, Vflat: N.Vflat, RHI: N.RHI, nV: N.vrot.length, nSigma: N.shi.length, rMaxKpc: rObs / L.KPC },
    visible: { Mst: vis.Mst, Mgas: vis.Mgas, Mvis: vis.Mvis, MvisSun: vis.Mvis / L.MSUN, MgasRaw: vis.MgasRaw, fGas: vis.fGas, freemanRelMax: Math.max(...req.map((z) => z.freemanRel)) },
    req: req.map((z) => ({ rKpc: z.rKpc, V: z.V, eV: z.eV, Vst: z.Vst, Vgas: z.Vgas, Vbar: z.Vbar, uReq: z.uReq, sigU: z.sigU })),
    models, farScale: [1, 128, 512, 2048].map((n) => ({ n, f: L.farRotScale(n), mdragFactor: Math.pow(n, 2 / 3) })), check };
}

/* ───────── C ───────── */
export function partC(E) {
  const src = IN16(), ang = L.partCAngles(src.bodies), ga = galaxyAxis();
  // 歳差の形: 金星以外の代表(地球の軸)を一様な ω_G = Ω_ref ĝ で太陽系の年齢だけ回す(1e5 步)—— a·ĝ の変化は丸めの床
  const a0 = axisOfBody(src.bodies[3]), Tage = L.LIT.sunAge.value * L.YEAR, pr = L.partCPrecession(a0, ga.g, ga.OmRefSI, Tage, 100000);
  const rate = 1 / (Tage * L.DECL.alignAgeFrac);
  // 銀河を一つの K1 の源とした軸の ω(太陽と地球 —— 読み口と写しの照合)
  const st = stateOf(E, bookC()); let gsrc = { ok: false, err: st.err || null };
  if (st.ok) {
    const rs = st.isq.receivers.find((q) => q.i === 0), re = st.isq.receivers.find((q) => q.i === 1), rp = replicaCheck(E, st, 1);
    const uT = uOf(UNITS_GAL).T, omS = rs.omega.map((q) => q / uT), omE = re.omega.map((q) => q / uT);
    gsrc = { ok: true, omSun: nrm(omS), omEarth: nrm(omE), angOmGDeg: angD(omS, ga.g), overOmRef: nrm(omS) / ga.OmRefSI, angleAge: nrm(omS) * Tage, betaSunFromG: rs.beta[2], replica: rp, warnings: st.warnings };
  }
  // 一様軸 galaxyAxial の受け手の応答(16 体の写し・ω_G = Ω_ref ĝ・K1 の型 rdPow 1・massPow −1・m_ref = 太陽のエンジンの質量・R_ref = Y_k m_ref)
  const s0 = stateOf(E, book16()); let resp = { ok: false };
  if (s0.ok) {
    const mRef = s0.S.m[0], Rref = s0.isq.rdRule.bodies.find((q) => q.i === 0).Rd, w = ga.g.map((q) => q * ga.OmRefSI * L.TU);
    const s1 = stateOf(E, book16({ galaxy: { wx: w[0], wy: w[1], wz: w[2], rdPow: 1, refRadius: Rref, massPow: -1, refMass: mRef } }));
    if (s1.ok && s1.gal) { const fs1 = s1.gal.receivers.filter((q) => q.receiver).map((q) => q.responseFactor); resp = { ok: true, n: fs1.length, devMax: Math.max(...fs1.map((f) => Math.abs(f - 1))), sunExact: s1.gal.receivers.find((q) => q.i === 0).responseFactor === 1 }; }
    else resp = { ok: false, err: s1.err || 'galaxyAxial の読み口が無い' };
  }
  return { angles: ang, precession: { axisBody: '地球', T: Tage, OmRef: ga.OmRefSI, dDot: pr.dDot, dotStart: pr.dotStart, turnRad: pr.turnRad }, alignRate: rate, alignRateOverOmRef: rate / ga.OmRefSI,
    galaxySource: gsrc, uniformResponse: resp };
}
function axisOfBody(b) { const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; }

/* ───────── D・E(16 体の写しの読み口と節点の和の写し)───────── */
export function partDE(E, plan) {
  const st = stateOf(E, book16()); if (!st.ok) return { ok: false, err: st.err };
  const S = st.S, rule = E.ruleK1(st.isq.decl.order), rad = L.radialOf(rule), P = pOf(S, st.isq), n = P.n, aSun = [P.ax[0], P.ay[0], P.az[0]], OmSun = P.spin[0] / L.TU;
  const Tage = L.LIT.sunAge.value * L.YEAR, rp = replicaCheck(E, st, 1), planets = [1, 2, 3, 5, 6, 11, 13, 14];
  const rowsD = planets.map((i) => {
    const r = st.isq.receivers.find((q) => q.i === i), u = L.uRotOf(r.rot.slice(0, 3), P.spin[0], aSun).map((q) => q * L.VU), d = [P.x[i] - P.x[0], P.y[i] - P.y[0], P.z[i] - P.z[0]], dm = nrm(d) * L.LU;
    let x = 0; for (let j = 0; j < n; j++) if (j !== i && P.Rd[j] > 0) x += P.Rd[j] / (Math.hypot(P.x[i] - P.x[j], P.y[i] - P.y[j], P.z[i] - P.z[j]));
    const sn = nrm(cross(aSun, unitV(d))), uLib = Math.abs(OmSun) * sn * Math.pow(P.Rd[0] * L.LU, 3) / (5 * dm * dm) * L.gRule(x, rad);
    const vOrb = Math.hypot(S.vx[i] - S.vx[0], S.vy[i] - S.vy[0], S.vz[i] - S.vz[0]) * L.VU, wRot = nrm(u) / (dm * sn);
    return { i, name: L.BODY16[i], rAu: dm / L.AU, uRot: nrm(u), uLib, rel: relD(nrm(u), uLib), vOrb, uOverV: nrm(u) / vOrb, wRot, angleAge: wRot * Tage, betaSun: r.beta[0] };
  });
  const tiltReq = L.DECL.planeTiltDeg * Math.PI / 180 / Tage;
  // E: 太陽 → 金星・木星の軸の ω(源ごと —— 節点の和の写し)・読み口の和
  const ofBody = (i) => {
    const q = L.k1Recv(rule, P, i, { gain: 1 }), s0 = q.src.find((z) => z.j === 0), om = s0.omega.map((z) => z / L.TU), omAll = st.isq.receivers.find((z) => z.i === i).omega.map((z) => z / L.TU);
    const a = [P.ax[i], P.ay[i], P.az[i]], sp = P.spin[i] / L.TU;
    return { i, om, omAbs: nrm(om), omAll: nrm(omAll), sunShare: nrm(om) / nrm(omAll), angOmSunAxisDeg: angD(om, aSun), a, spin: sp, Rm: S.R[i] * L.LU, m: S.m[i] * L.MU };
  };
  const ven = ofBody(2), jup = ofBody(6), vr = L.venusReq(L.DECL.venusPeriodGyr), wh = unitV(ven.om), sNow = ven.a.map((z) => z * Math.sign(ven.spin)), s0 = aSun.map((z) => z * Math.sign(OmSun));
  const venus = { omSun: ven.omAbs, omAll: ven.omAll, sunShare: ven.sunShare, omReq: vr.omReq, T: vr.T, ratio: ven.omAbs / vr.omReq, turnAge: ven.omAbs * Tage,
    angOmSunAxisDeg: ven.angOmSunAxisDeg, dotNow: dot(sNow, wh), dotCommon: dot(s0, wh), spinAxisVsSunDeg: angD(sNow, s0) };
  // 木星: 熱の電力(文献の値の熱流 × 4πR²)・maintain の 1 回の量(エンジンの関数と lib の式)・要る τ_hold(太陽の項・銀河の項)
  const f = 0.5, I = f * jup.m * jup.Rm * jup.Rm, Preq = L.powerOf(L.LIT.jupiterFlux.value, jup.Rm), PreqAlt = L.powerOf(L.LIT.jupiterFluxAlt.value, jup.Rm);
  const cell = (om) => { const z = L.splitOmega(om, jup.a), outE = new Float64Array(9); E.maintCell(I, jup.spin, jup.a[0], jup.a[1], jup.a[2], z.wp, z.q[0], z.q[1], z.q[2], outE, 0); const lib = L.maintCell(I, jup.spin, jup.a[0], jup.a[1], jup.a[2], z.wp, z.q[0], z.q[1], z.q[2]);
    return { Eax: outE[0], Esp: outE[1], Q: outE[2], same: Object.is(outE[0], lib[0]) && Object.is(outE[1], lib[1]) && Object.is(outE[2], lib[2]), wp: z.wp, q: nrm(z.q),
      // 熱の契約の候補 (b)(今の帳簿ではない —— 見積りだけ): 減速の分 abs(E_speed) も熱へ(今の帳簿は負の E_speed を熱にせず背景からの供給の欄へ)
      Qabs: outE[0] + Math.abs(outE[1]) }; };
  const ga = galaxyAxis(), h0s = book16().physics.stepDt * L.TU;
  const cS = cell(jup.om), cG = cell(ga.g.map((z) => z * ga.OmRefSI));
  const tau = (Q) => Q / Preq, inRange = (t) => { const tb = t / L.TU; return tb >= 1e-30 && tb <= 1e30; };
  const Erot = 0.5 * I * jup.spin * jup.spin, fSpin = Math.pow(S.R[0] / P.Rd[0], 2), fJ = fSpin * 2.5 * L.LIT.sunMoI.value;
  const candOf = (k) => { const c = cell(jup.om.map((z) => z * k)); return Object.assign(c, { factor: k, Pnow: c.Q / h0s, ratioNow: c.Q / h0s / Preq, tauReq: tau(c.Q), tauReqInRange: inRange(tau(c.Q)),
    PabsNow: c.Qabs / h0s, ratioAbs: c.Qabs / h0s / Preq, tauReqAbs: tau(c.Qabs) }); };
  const ext = (c, om) => Object.assign(c, { omAbs: om, Pnow: c.Q / h0s, tauReq: tau(c.Q), tauReqInRange: inRange(tau(c.Q)), ratioNow: c.Q / h0s / Preq, PabsNow: c.Qabs / h0s, ratioAbs: c.Qabs / h0s / Preq, tauReqAbs: tau(c.Qabs), tauReqAbsInRange: inRange(tau(c.Qabs)) });
  const jupiter = { R: jup.Rm, m: jup.m, I, f, spin: jup.spin, Preq, PreqAlt, h0: h0s, angOmSpinDeg: angD(jup.om, jup.a.map((z) => z * Math.sign(jup.spin))), sun: ext(cS, jup.omAbs), galaxy: ext(cG, ga.OmRefSI),
    spinBudget: { Erot, tSpin: Erot / Preq, torque: Preq / Math.abs(jup.spin), spinDownRate: Preq / (I * Math.abs(jup.spin)) / Math.abs(jup.spin) }, pureWork: 0,
    cand: { spinR: candOf(fSpin), spinJ: candOf(fJ) } };
  return { ok: true, replica: rp, warnings: st.warnings, sun: { Om: OmSun, Rd: P.Rd[0] * L.LU, R: S.R[0] * L.LU, axis: aSun }, D: { rows: rowsD, tiltReq, tiltDeg: L.DECL.planeTiltDeg, Tage }, venus, jupiter };
}
/** D の測る形の試し(太陽 + 水星・回転の引きずりの有無 × h・h/2 —— 傾斜と交点を太陽の軸に対して) */
export function partDRun(E, orbits) {
  const out = {}, tilt = L.DECL.dRuns.tiltRad, b0 = bookD(false, tilt), pSec = b0.timeRef.pRef * Math.pow(10, b0.scaleExp.T);
  for (const rot of [true, false]) for (const div of [1, 2]) {
    const b = bookD(rot, tilt), v = E.HP.validatePreset(clone(b));
    if (!v.ok) { out[(rot ? 'on' : 'off') + '|' + div] = { ok: false, err: JSON.stringify(v.errors).slice(0, 200) }; continue; }
    const S = E.HP.coord3d.makeSim(); S.build(clone(v.preset));
    const aSun = [S.sax[0], S.say[0], S.saz[0]], dt = b.physics.stepDt / div, N = orbits * b.timeRef.stepsPerOrbit * div, t0 = Date.now();
    for (let k = 0; k < N; k++) { S.step(dt); if (S.hasNaN() || S.coord3dHalt) break; }
    const r = [S.x[1] - S.x[0], S.y[1] - S.y[0], S.z[1] - S.z[0]], vv = [S.vx[1] - S.vx[0], S.vy[1] - S.vy[0], S.vz[1] - S.vz[0]], h = unitV(cross(r, vv));
    const inc = Math.atan2(nrm(cross(h, aSun)), dot(h, aSun)), nd = cross(aSun, h), ref = unitV(cross(aSun, [1, 0, 0])), node = Math.atan2(dot(cross(ref, nd), aSun), dot(ref, nd));
    out[(rot ? 'on' : 'off') + '|' + div] = { ok: true, steps: N, inc, node, state: [S.x[1], S.y[1], S.z[1], S.vx[1], S.vy[1], S.vz[1]], wallSec: (Date.now() - t0) / 1000, nan: S.hasNaN() };
  }
  const g = (k) => out[k] && out[k].ok ? out[k] : null, on1 = g('on|1'), off1 = g('off|1'), on2 = g('on|2'), off2 = g('off|2');
  const same = (a, b) => a && b && a.state.every((x, k) => Object.is(x, b.state[k]));
  return { orbits, tiltRad: tilt, pSec, runs: out, dIncRot: on1 && off1 ? on1.inc - off1.inc : null, dNodeRot: on1 && off1 ? on1.node - off1.node : null,
    dIncStep: off1 && off2 ? off1.inc - off2.inc : null, dNodeStep: off1 && off2 ? off1.node - off2.node : null, bitSameH: !!same(on1, off1), bitSameH2: !!same(on2, off2) };
}

/* ───────── F ───────── */
export function partF(J) {
  const DE = J.DE, B = J.B, A = J.A, C = J.C, Tage = DE.D.Tage, sun = DE.sun, fSpin = Math.pow(sun.R / sun.Rd, 2), kSun = L.LIT.sunMoI.value, fJ = fSpin * 2.5 * kSun;
  const me = DE.D.rows.find((r) => r.i === 1), ea = DE.D.rows.find((r) => r.i === 3);
  // ハロー: 1 つの源 —— 今(源の R_d = Y_k M_vis)・候補 (i) R_d,spin = R_HI・候補 (ii) J = 見える円盤の角運動量(Σ 2π a² Σ_vis V_obs)
  const N = B.data, last = B.req[B.req.length - 1], rL = last.rKpc * L.KPC, Om = B.decl.OmSrc, RdVis = L.YK * B.visible.Mvis, x = RdVis / rL, gx = L.gClosed(x);
  const uNow = Om * RdVis * RdVis * RdVis / (5 * rL * rL) * gx, uI = Om * RdVis * N.RHI * N.RHI / (5 * rL * rL) * gx;
  const Jdisk = diskJ(B), uII = L.YK * gx * Jdisk / (2 * rL * rL);
  const venus = DE.venus, jup = DE.jupiter;
  const rows = [
    { key: 'A', ja: '銀河の並進(規約 —— 織り込み済み)', req: 0, reqText: '0(一様な並進は規約で無視 —— 勾配だけを記録)', now: A.rows[A.rows.length - 1].duOverV, nowText: '向きの差の速さ / 公転の速さ(100 au)', ratio: null, part: '並進の R_d(規約のまま —— 勾配・潮汐の大きさは記録)' },
    { key: 'B', ja: 'ハロー(NGC 3198 の回転の移送 —— 最外の点)', req: last.uReq, now: uNow, ratio: uNow / last.uReq, cand1: uI, cand1Ratio: uI / last.uReq, cand2: uII, cand2Ratio: uII / last.uReq, part: '源の物理の角運動量 J を別の入力・源の粗視化の契約(m³ の和 —— 1/N²)・回転の重みを重力の質量と分ける' },
    { key: 'C', ja: '銀河の軸(逆向きの自転)', req: C.alignRate, now: C.galaxySource.ok ? C.galaxySource.omSun : null, ratio: C.galaxySource.ok ? C.galaxySource.omSun / C.alignRate : null, noSelect: true, part: '復元・散逸の項(歳差の形では大きさに依らず選ばない)' },
    { key: 'D', ja: '太陽の回転(公転面の安定 —— 水星)', req: DE.D.tiltReq, now: me.wRot, ratio: me.wRot / DE.D.tiltReq, cand1: me.wRot * fSpin, cand1Ratio: me.wRot * fSpin / DE.D.tiltReq, cand2: me.wRot * fJ, cand2Ratio: me.wRot * fJ / DE.D.tiltReq, part: '回転の重み R_d,spin・復元の項(今の項は歳差 —— 傾斜を保つ)' },
    { key: 'Dearth', ja: '太陽の回転(公転面の安定 —— 地球)', req: DE.D.tiltReq, now: ea.wRot, ratio: ea.wRot / DE.D.tiltReq, cand1: ea.wRot * fSpin, cand1Ratio: ea.wRot * fSpin / DE.D.tiltReq, cand2: ea.wRot * fJ, cand2Ratio: ea.wRot * fJ / DE.D.tiltReq, part: '同上' },
    { key: 'Ev', ja: '太陽の軸(金星の軸を π —— 仮の期間 ' + L.DECL.venusPeriodGyr + ' Gyr)', req: venus.omReq, now: venus.omSun, ratio: venus.ratio, cand1: venus.omSun * fSpin, cand1Ratio: venus.ratio * fSpin, cand2: venus.omSun * fJ, cand2Ratio: venus.ratio * fJ, part: '軸の重み R_d,spin か J・到達の条件(a·ω̂ が保たれる —— 初期の軸の仮定)' },
    { key: 'Ej', ja: '太陽の軸(木星の加熱 —— 今の帳簿・τ_hold = h₀ の規約)', req: jup.Preq, now: jup.sun.Pnow, ratio: jup.sun.ratioNow, cand1: jup.cand.spinR.Pnow, cand1Ratio: jup.cand.spinR.ratioNow, cand2: jup.cand.spinJ.Pnow, cand2Ratio: jup.cand.spinJ.ratioNow, part: '熱の契約(供給元・反作用先・率・受け皿 —— 純粋な歳差は仕事 0・E_speed が負の向きは熱にしない)' },
    { key: 'Ejb', ja: '太陽の軸(木星の加熱 —— 熱の契約の候補 (b) 減速の分も熱へ・τ_hold = h₀)', req: jup.Preq, now: jup.sun.PabsNow, ratio: jup.sun.ratioAbs, cand1: jup.cand.spinR.PabsNow, cand1Ratio: jup.cand.spinR.ratioAbs, cand2: jup.cand.spinJ.PabsNow, cand2Ratio: jup.cand.spinJ.ratioAbs, part: '熱の契約 (b)(減速の分の行き先を熱に —— 率は τ_hold の規約で決まる)' }];
  const solar = rows.filter((r) => ['D', 'Ev', 'Ejb'].includes(r.key)), withH = solar.concat(rows.filter((r) => r.key === 'B'));
  const spread = (rs, k) => { const v = rs.map((r) => Math.log10(Math.abs(r[k]))); return Math.max(...v) - Math.min(...v); };
  return { rows, factors: { spinR: fSpin, spinJ: fJ, kSun, Jdisk, RHI: N.RHI, RdVis }, spread: { nowSolar: spread(solar, 'ratio'), cand1Solar: spread(solar, 'cand1Ratio'), cand2Solar: spread(solar, 'cand2Ratio'),
    cand1All: spread(withH, 'cand1Ratio'), cand2All: spread(withH, 'cand2Ratio') }, Tage };
}
/** 見える円盤の角運動量 J = ∫ 2π a² Σ_vis(a) V_obs(a) da(V_obs は観測の点の線形の内挿 —— 最外の点の外は最外の値) */
function diskJ(B) {
  const Rs = B.data.Rs, Mst = B.visible.Mst, S0 = Mst / (2 * Math.PI * Rs * Rs), pts = B.req, Vat = (a) => { const r = a / L.KPC; if (r <= pts[0].rKpc) return pts[0].V * r / pts[0].rKpc; for (let k = 1; k < pts.length; k++) if (r <= pts[k].rKpc) { const f = (r - pts[k - 1].rKpc) / (pts[k].rKpc - pts[k - 1].rKpc); return pts[k - 1].V + f * (pts[k].V - pts[k - 1].V); } return pts[pts.length - 1].V; };
  let J = 0; const da = 0.01 * L.KPC; for (let a = da / 2; a < 40 * Rs; a += da) J += 2 * Math.PI * a * a * S0 * Math.exp(-a / Rs) * Vat(a) * da;
  return J * (B.visible.Mvis / Mst);   // ガスは星の円盤と同じ形の重みで見える質量の全体へ(宣言 —— 桁の見積り)
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {};
  G.aAccepted = !!(J.A && J.A.ok); G.aRule = !!(J.A && J.A.ruleCheck <= 1e-12); G.aReplica = !!(J.A && J.A.replica.worst === 0);
  G.bVisible = !!(J.B && J.B.visible.freemanRelMax <= 1e-6); G.bCheck = !!(J.B && J.B.check.ok && J.B.check.relU <= 1e-12 && J.B.check.relBeta <= 1e-12);
  G.bModels = !!(J.B && J.B.models.length >= 3 && J.B.models.every((m) => Number.isFinite(m.best.Rtot) && m.best.Rtot > 0));
  G.cGalaxySource = !!(J.C && J.C.galaxySource.ok && J.C.galaxySource.replica.worst === 0); G.cUniform = !!(J.C && J.C.uniformResponse.ok && J.C.uniformResponse.devMax <= 4 * Number.EPSILON);
  G.cPrecession = !!(J.C && Math.abs(J.C.precession.dDot) <= 1e-9);
  G.deReplica = !!(J.DE && J.DE.ok && J.DE.replica.worst === 0); G.dRule = !!(J.DE && J.DE.D.rows.every((r) => r.rel <= 1e-9));
  G.eMaint = !!(J.DE && J.DE.jupiter.sun.same && J.DE.jupiter.galaxy.same);
  G.dRun = !!(J.Drun && Object.values(J.Drun.runs).every((r) => r.ok && !r.nan));
  return G;
}

/* ───────── 実行 ───────── */
export async function runDragEst(E, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'dragest', quick: !!o.quick, plan: clone(P), rule: 'K1 + rdRule:"kappaM"(R_d = Y_k m・Y_k = 10G_0/(C_1c_0²))', C1: L.C1, Yk: L.YK,
    decl: clone(L.DECL), lit: clone(L.LIT) };
  J.A = partA(E, P.radiiAu); tick('A');
  J.B = partB(E, o.csvText, P); tick('B');
  J.C = partC(E); tick('C');
  J.DE = partDE(E, P); tick('DE');
  J.Drun = partDRun(E, P.dOrbits); tick('Drun');
  J.F = partF(J); tick('F');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W318D_TARGET || 'beta/index.html', quick = process.env.W318D_QUICK === '1';
  const OUT = process.env.W318D_OUT ? (path.isAbsolute(process.env.W318D_OUT) ? process.env.W318D_OUT : path.join(ROOT, process.env.W318D_OUT)) : path.join(ROOT, OUT_DRAGEST);
  if (quick && !process.env.W318D_OUT) throw new Error('試走(W318D_QUICK=1)は W318D_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html), E = portsOf(HP, globalThis);
  console.log('第318便d dragest: ' + (quick ? '試走' : '正本') + '・1 プロセス');
  const R = await runDragEst(E, { quick, plan: quick ? QUICK : PLAN, csvText: fs.readFileSync(path.join(ROOT, CSV_GAL), 'utf8') });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w318d-dragest.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(第120報)「引きずりについて」(銀河の並進は規約で無視・ハローを銀河の回転引きずりで見積もり M_drag と見える質量を比べる・太陽系の逆向きの自転を銀河の軸引きずりの影響と仮定・'
      + '太陽の回転引きずりが公転面を安定させ・太陽の軸引きずりが金星の自転を逆転させ木星を加熱すると仮定)・決断事項 AN438・統括の検証項目 R257。見積りの材料(規則・在位の本・エンジンの式は変えない —— 新しい法則は足さない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w318d-dragest.mjs', 'tests/lib-w318d-dragest.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第318便d', target: TARGET, code: CODE, inputs: [TARGET, INPUT16, CSV_GAL] }), {
    harnessVersion: HARNESS_VERSION, stage: 'dragest',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    literature: Object.values(L.LIT).map((z) => z.name + ' = ' + z.value + ' ' + z.unit + '(本便は一次資料に当たっていない)'),
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

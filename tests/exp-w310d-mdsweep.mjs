// 第310便d(原仮定者の裁定(第109報)AN380「太陽の R_d は cap6500km で固定し、太陽の m_d の適正値を探索する。dragCore(R_d, m_d)と、外殻(観測半径,
// 観測質量 − m_d)の引きずりを、それぞれ計算する」・決断事項 AN384〔外殻の形〕・AN385〔受け手の側〕・AN386〔m_d の値域と探索の型〕・AN336〔標的 1PN + A1〕・
// 統括の検証項目 R225): **太陽の m_d の掃引の器**(探索の材料 —— フィットの値を在位へ入れない・在位の宣言は変えない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、本の入口 validatePreset・coord3d.makeSim・build・step と
// 読み口 inertialDragIsqState をそのまま呼ぶ・1 プロセス)。外殻の参照は tests/lib-w310d-shell.mjs(エンジンの外殻の源〔第310便a〕と独立 ——
// 球の K2・M2 は第309便a の参照の lib tests/lib-w309a-invsq.mjs の閉じた式)。
//
// ■ 写し(器の中で組む —— 在位の本の宣言は変えない)
//   🌡️ mercurySunInertial3d の第306便a の世代: physics・bodies・scaleExp・timeRef は凍結の写し tests/data-w306a-decl305.json・G_loc は在位の gLoc:{law:"kappaC2"}
//   (第306便a の一括の宣言)・GM と初期要素は在位のまま(同時に動かさない —— AN380 ①)。引きずりは**新則に置き換える**: relativeDrag =
//   {law:"inertial", invSq:{}(Wbg2 省略 = 0 —— 第107報・AN378), pairs:"all", history:"positions", dragCoreDefault:"cap6500km", initMotion:"observed",
//   spinDrag:{rot:"surfaceFlip", axial:"on", axialModel:"bevel", initSpin:"observed"}}(firstStep は既定 "drag")—— 旧則の鍵(Wbg・eps・inertialR2)は外す。
//   太陽の m_d < M☉ は bodies[0].dragCore = {massFrac: m_d/M☉, radius: 6.5×10⁶ m(本の単位)} と外殻の鍵(枝 a —— 統合の後に繋ぐ: W310D_SHELL_PATH)。
//   対照: C0 = 引きずり OFF・G_loc なし(重力だけ —— 差 = 写し − C0)・C1 = 引きずり OFF・G_loc あり。
//
// ■ 段(正本 tests/out/mdsweep-w310d.json —— 段 mdsweep-310d)。W310D_PARTS=K,P,E,S,R,Z で選ぶ(正本は全段)・W310D_OUT で出力先・W310D_QUICK=1 で縮める
//   K 外殻の核: 厚い殻・薄い殻の K2・M2・導関数を独立の 3 次元の求積(外部・空洞)・殻の角度の閉じた式の動径の求積(物質の中)・数値の微分と照合。遠方の係数
//     (w r²/m → 1 + ⟨ρ²⟩/(3r²)・M2 → 2⟨ρ²⟩/(3r³) —— 分け方は ⟨ρ²⟩〔慣性モーメント〕だけを通して効く)・m_d = M で外殻の部分を作らない
//   P 近点の一次の式(lib の estimate の注記)の自己試験(平面の二体 + 誇張した係数の RK4 —— 一次の式との相対の差)
//   E エンジンと参照の照合(t = 0 の写し 3 つ: 既定〔R_d = 6.5×10⁶ m・m_d = M☉〕・dragCore の球 R_obs〔m_d → 0⁺ の代理〕・dragCore の核だけ m_d = 10⁻³ M☉〔外殻なし ——
//     今のエンジンの dragCore の意味〕)—— β(水星 ← 太陽)・回転の係数・軸の ω・β(太陽 ← 水星)
//   S m_d の表(対数の格子 × 外殻の形 thick〔AN384 の読み〕/ thin〔比較〕/ none〔比較 —— 外殻の引きずりを入れない: AN380 の読みではない〕): β・b = β r²・
//     回転引きずりの速さ・軸の ω・太陽を受け手にしたときの β(AN385 —— thick だけ: 薄い殻は殻の上で自己の場が発散し受け手にできない)・近点への寄与の見積り
//   R エンジンの近点(8 公転・検出器 B と新しい抽出器 —— 第306便a と同じ抽出器): C0・C1・E1(既定)・E2(dragCore の球 R_obs —— m_d → 0⁺ の代理)× 刻み h/h2(--divs で変える)。
//     --md <列>(m_d/M☉ の列)は外殻の鍵を受理するエンジン(統合の後)で掃引する —— 受理しなければ「外殻の鍵が未接続」と記録して走らせない
//   Z 届くか: 標的 q⋆(tests/lib-w306a-an336.mjs の an336Target)・在位の値(第306便a の正本の h/4 —— 旧則の世代)・E1 の値との差・m_d の寄与の幅(見積りと E2 − E1 の実測)
//
// ■ 言わないこと: 「フィットした」「合わせた」「m_d を決めた」「法則を発見した」「完全に一致」。届かないものは届かないと数で書く(AN386)。
//
// ■ 使い方
//   node tests/exp-w310d-mdsweep.mjs                       → 正本 tests/out/mdsweep-w310d.json(段 mdsweep-310d)
//   W310D_QUICK=1 W310D_OUT=<json> node tests/exp-w310d-mdsweep.mjs   → 試走(3 公転・刻み h だけ・格子 5 点 —— 正本を書かない)
//   node tests/exp-w310d-mdsweep.mjs --md 1,0.1,0.01,0.001,1e-6 [--divs 1,2] [--shell thin] → 統合の後の 2 段目(外殻の鍵を W310D_SHELL_PATH で・既定は一様の厚い殻 ——
//     出力は tests/out/mdsweep-w310d-stage2.json〔W310D_OUT で変える・鎖の正本ではない〕・m_d = 1 は外殻の鍵を足しても既定とビット同一かを 2000 步で確かめる)
//   node tests/exp-w310d-mdsweep.mjs --core 2.5e-5 [--divs 1]   → 比較(AN380 の読みではない —— dragCore の核だけ・外殻の引きずりを入れない)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as D from './lib-w310d-shell.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ab","ch","ctx","cw","fmt","pnSource","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w310d-mdsweep-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const { dot, cross, norm, add, sub, scale, unit } = D;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['フィットした', '合わせた', 'm_d を決めた', '法則を発見した', '完全に一致'];
export const BOOK_ID = 'mercurySunInertial3d';
export const DECL_FILE = 'tests/data-w306a-decl305.json';
export const AN336_OUT = 'tests/out/an336-w306a.json';
export const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
export const GLOC_306A = Object.freeze({ law: 'kappaC2' });   // 第306便a の在位の 7 本の一括の宣言(n = 2)
/** 新則の引きずり(Wbg2 省略 = 0・次数 8 は既定・cap6500km・観測の初期値の分解・最初の步から u(0))—— 旧則の鍵は持たない */
export const NEW_DRAG = Object.freeze({ law: 'inertial', invSq: {}, pairs: 'all', history: 'positions', dragCoreDefault: 'cap6500km', initMotion: 'observed',
  spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' } });
export const OFF_DRAG = Object.freeze({ law: 'inertial', invSq: {}, enabled: false, pairs: 'all', history: 'positions' });
/** m_d/M☉ の対数の格子(AN386: (0, M☉] —— 10⁰ から 10⁻⁶ まで 0.5 桁ごと 13 点)。試走は 5 点 */
export const MD_GRID = Object.freeze(Array.from({ length: 13 }, (_, k) => Number((10 ** (-k / 2)).toPrecision(12))));
export const MD_GRID_QUICK = Object.freeze([1, 0.1, 1e-2, 1e-4, 1e-6]);
export const SHAPES = Object.freeze(['thick', 'thin', 'none']);
export const N_ORB = 8;                     // 窓(🌡️ の fitRecord・第306便a と同じ 8 公転)
export const APSIS_K = 3;                   // 新しい抽出器の調和の数(第304便e の既定)
/** 外殻の鍵の置き場所(枝 a の名前 —— 統合の後に合わせる。点で区切った道・値は "uniform"|"thin") */
export const SHELL_PATH = process.env.W310D_SHELL_PATH || 'physics.relativeDrag.invSq.outerShell';
export const SHELL_VALUE = Object.freeze({ thick: process.env.W310D_SHELL_UNIFORM || 'uniform', thin: process.env.W310D_SHELL_THIN || 'thin' });

/* ───────── 写し ───────── */
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
/** 第306便a の世代の 🌡️ の写し(凍結の写しの physics・bodies・scaleExp・timeRef + 在位の G_loc)。fitRecord・abBody は外す */
export function pinnedBook(HP) {
  const p = findPreset(HP, BOOK_ID); if (!p) throw new Error('本が無い: ' + BOOK_ID);
  const d = PIN.decl[BOOK_ID]; if (!d) throw new Error('凍結の写しが無い: ' + BOOK_ID);
  const q = clone(p); q.physics = clone(d.physics); q.bodies = clone(d.bodies); q.scaleExp = clone(d.scaleExp); q.timeRef = clone(d.timeRef);
  delete q.fitRecord; delete q.abBody; q.physics.gLoc = clone(GLOC_306A);
  return q;
}
const setPath = (o, dotted, v) => { const ks = dotted.split('.'); let c = o; for (let i = 0; i < ks.length - 1; i++) { const k = /^\d+$/.test(ks[i]) ? Number(ks[i]) : ks[i]; if (c[k] === undefined) c[k] = {}; c = c[k]; } c[ks[ks.length - 1]] = v; };
/** 変種の本。kind: C0・C1・E1(既定)・E2(dragCore 球 R_obs)・core(dragCore 核だけ m_d —— 外殻なし)・shell(m_d と外殻の鍵 —— 統合の後) */
export function variantBook(base, kind, o = {}) {
  const q = clone(base);
  if (kind === 'C0') { q.physics.relativeDrag = clone(OFF_DRAG); delete q.physics.gLoc; return q; }
  if (kind === 'C1') { q.physics.relativeDrag = clone(OFF_DRAG); return q; }
  q.physics.relativeDrag = clone(NEW_DRAG);
  const L = Math.pow(10, q.scaleExp.L), RdBook = D.CAP_M / L;
  if (kind === 'E2') q.bodies[0].dragCore = { massFrac: 1, radius: q.bodies[0].radius };
  else if (kind === 'core') q.bodies[0].dragCore = { massFrac: o.f, radius: RdBook };
  else if (kind === 'shell') { if (o.f < 1) q.bodies[0].dragCore = { massFrac: o.f, radius: RdBook }; setPath(q, SHELL_PATH, SHELL_VALUE[o.shape || 'thick']); }
  return q;
}
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset };
}
/** 本の単位 → SI と、エンジンの配列(質量・半径は Float32 の配列 —— 参照もこの値を使う)からの参照の天体 */
function unitsOf(q) { return { Lm: Math.pow(10, q.scaleExp.L), Tm: Math.pow(10, q.scaleExp.T), Mm: Math.pow(10, q.scaleExp.M) }; }
function refBodies(S, U, sunParts) {
  const b = (i) => ({ x: [S.x[i] * U.Lm, S.y[i] * U.Lm, S.z[i] * U.Lm], m: S.m[i] * U.Mm, Om: S.spin[i] / U.Tm, a: [S.sax[i], S.say[i], S.saz[i]] });
  const sun = b(0), mer = b(1);
  sun.parts = sunParts; mer.parts = [{ kind: 'ball', m: mer.m, R: S.radOv[1] * U.Lm, role: 'core' }];
  return [sun, mer];
}

/* ───────── 段 K(外殻の核)───────── */
export function partK(quick) {
  const Ri = 6.5e6 / 6.95e8, Ro = 1, dir = [0.36, 0.48, 0.8], ext = [], inn = [], cav = [], thinIn = [], far = [];
  for (const x of [1.2, 1.5, 2, 3.1, 10, 83, 1e3]) {
    const nS = x < 1.3 ? (quick ? 120 : 200) : (quick ? 48 : 64), nR = quick ? 32 : 48, d = scale(dir, x);
    const q = D.thickQuad(d, Ri, Ro, nR, nS), qt = D.thinQuad(d, Ro, nS), h = Math.min(1e-3 * (x - 1), 0.01 * x);
    ext.push({ x, thickK: r10(rel(D.thickK2(x, Ri, Ro), q.K)), thickM: r10(rel(D.thickM2(x, Ri, Ro), q.M)), thinK: r10(rel(D.thinK2(x, Ro), qt.K)), thinM: r10(rel(D.thinM2(x, Ro), qt.M)),
      dThickK: r10(rel(D.thickK2Dr(x, Ri, Ro), D.numDr((t) => D.thickK2(t, Ri, Ro), x, h))), dThickM: r10(rel(D.thickM2Dr(x, Ri, Ro), D.numDr((t) => D.thickM2(t, Ri, Ro), x, h))),
      dThinK: r10(rel(D.thinK2Dr(x, Ro), D.numDr((t) => D.thinK2(t, Ro), x, h))), dThinM: r10(rel(D.thinM2Dr(x, Ro), D.numDr((t) => D.thinM2(t, Ro), x, h))) });
  }
  for (const x of [0.0095, 0.05, 0.3, 0.7, 0.99]) {
    const h = 1e-4 * Math.min(x - Ri, Ro - x);
    inn.push({ x, radialQuad: r10(rel(D.thickK2(x, Ri, Ro), D.thickK2Radial(x, Ri, Ro, quick ? 80 : 120))),
      dK: r10(rel(D.thickK2Dr(x, Ri, Ro), D.numDr((t) => D.thickK2(t, Ri, Ro), x, h))) });
  }
  for (const x of [0.001, 0.005, 0.009]) {   // 空洞の点(x < R_i): 殻の角度の閉じた式の動径の求積が主・直接の 3 次元の求積は内側の面から遠い 0.001 だけを門に(面に近い点は積の規則が粗い)
    const q = D.thickQuad(scale(dir, x), Ri, Ro, quick ? 32 : 48, quick ? 32 : 48);
    cav.push({ x, quad3d: r10(rel(D.thickK2(x, Ri, Ro), q.K)), radialQuad: r10(rel(D.thickK2(x, Ri, Ro), D.thickK2Radial(x, Ri, Ro, quick ? 80 : 120))),
      dK: r10(rel(D.thickK2Dr(x, Ri, Ro), D.numDr((t) => D.thickK2(t, Ri, Ro), x, 1e-4 * Math.min(x, Ri - x)))) });
  }
  for (const x of [0.1, 0.5, 0.9]) {
    const q = D.thinQuad(scale(dir, x), 1, quick ? 120 : 200);
    thinIn.push({ x, quad: r10(rel(D.thinK2(x, 1), q.K)), dK: r10(rel(D.thinK2Dr(x, 1), D.numDr((t) => D.thinK2(t, 1), x, 1e-4 * Math.min(1 - x, x)))) });
  }
  // 遠方の係数(r = 83 R_o —— 水星の距離の程度): w r²/m − 1 ≈ ⟨ρ²⟩/(3r²)・M2 r³/(2⟨ρ²⟩/3) → 1
  for (const p of [{ kind: 'ball', R: 1 }, { kind: 'ball', R: Ri }, { kind: 'thick', Ri, Ro }, { kind: 'thin', R: 1 }]) {
    const x = 83, rho2 = D.rho2Of(p), k = D.partK2(p, x) * x * x - 1, m = D.partM2(p, x) * x ** 3 / (2 * rho2 / 3);
    far.push({ kind: p.kind, R: p.R || null, rho2, k2Excess: k, k2ExcessOverRho2: r10(k / (rho2 / (3 * x * x))), m2Coef: r10(m) });
  }
  const parts1 = D.sunParts(1.9885e30, 6.95e8, 1.9885e30), partsH = D.sunParts(1.9885e30, 6.95e8, 0.5 * 1.9885e30);
  const mx = (rows, keys) => Math.max(...rows.flatMap((r) => keys.map((k) => r[k])));
  return { Ri, Ro, ext, inn, cav, thinIn, far,
    maxExt: mx(ext, ['thickK', 'thickM', 'thinK', 'thinM']), maxDerivExt: mx(ext, ['dThickK', 'dThickM', 'dThinK', 'dThinM']),
    maxInnRadial: mx(inn, ['radialQuad']), maxInnDeriv: mx(inn, ['dK']), maxCav: mx(cav, ['radialQuad']), maxCav3d: cav[0].quad3d, maxCavDeriv: mx(cav, ['dK']),
    maxThinIn: mx(thinIn, ['quad']), maxThinInDeriv: mx(thinIn, ['dK']),
    farCoefMax: Math.max(...far.map((f) => Math.max(Math.abs(f.k2ExcessOverRho2 - 1), Math.abs(f.m2Coef - 1)))),
    mdEqualsM: { parts: parts1.length, kinds: parts1.map((p) => p.kind) }, mdHalf: { parts: partsH.length, kinds: partsH.map((p) => p.kind), shellMass: partsH[1].m } };
}

/* ───────── 段 P(近点の一次の式の自己試験)───────── */
export function partP(quick) {
  const st = D.precessionSelfTest({ steps: quick ? 4000 : 8000, nOrb: quick ? 4 : 6 });
  return { rows: st.rows.map((r) => ({ e: r.e, key: r.key, pred: r10(r.pred), meas: r10(r.meas), relDiff: r10(r.relDiff) })), maxRel: st.maxRel,
    formula: { trans: 'Δϖ_n = π b_n J_n(e)/p^n(J_2 = 2・J_4 = 4 + 3e²)', rot: 'Δϖ_rot = −3π c/(p² h₀)', note: '一次の摂動の平均(u = 1/r の軌道の式の永年の項)—— 係数の 2 乗の項は落とす' } };
}

/* ───────── 段 E(エンジンと参照 —— t = 0)───────── */
export function partE(HP, base) {
  const U = unitsOf(base), Rd = D.CAP_M, M0 = base.bodies[0].m * U.Mm, Robs = base.bodies[0].radius * U.Lm, rows = [];
  for (const [key, kind, f, parts] of [['default', 'E1', 1, null], ['ballRobs', 'E2', 1, 'robs'], ['core1e-3', 'core', 1e-3, 'core']]) {
    const o = simOf(HP, variantBook(base, kind, { f }));
    if (o.err) { rows.push({ key, err: o.err }); continue; }
    const S = o.S, st = HP.inertialDragIsqState(S), sunM = S.m[0] * U.Mm;
    const sp = parts === 'robs' ? [{ kind: 'ball', m: sunM, R: Robs, role: 'core' }] : [{ kind: 'ball', m: f * sunM, R: Rd, role: 'core' }];
    const B = refBodies(S, U, sp), r1 = D.refReceiver(B, 1, { order: 8 }), r0 = D.refReceiver(B, 0, { order: 8 });
    const e1 = st.receivers.find((z) => z.i === 1), e0 = st.receivers.find((z) => z.i === 0);
    const rotE = e1.rot.slice(0, 3).map((v) => v * U.Lm), omE = e1.omega.map((v) => v / U.Tm), omE0 = e0.omega.map((v) => v / U.Tm);
    rows.push({ key, kind, f, sunRd: st.receivers[0].Rd * U.Lm, sunMd: st.receivers[0].md * U.Mm, betaMS: r10(e1.beta[0]), betaSM: r10(e0.beta[1]),
      dBetaMS: r10(rel(r1.beta[0], e1.beta[0])), dRot: r10(norm(sub(r1.rot[0], rotE)) / norm(rotE)), dOmega: r10(norm(sub(r1.omega, omE)) / norm(omE)),
      dBetaSM: r10(rel(r0.beta[1], e0.beta[1])), dOmegaSun: r10(norm(sub(r0.omega, omE0)) / norm(omE0)), negFrac: st.negFrac, M0, Robs });
  }
  const R = rows.filter((r) => !r.err);
  return { rows, maxBeta: Math.max(...R.map((r) => Math.max(r.dBetaMS, r.dBetaSM))), maxRot: Math.max(...R.map((r) => r.dRot)), maxOmega: Math.max(...R.map((r) => Math.max(r.dOmega, r.dOmegaSun))),
    note: '参照の受け手はエンジンの配列の質量と半径(Float32)と t = 0 の位置・慣性自転(initSpin の後)を使う' };
}

/* ───────── 段 S(m_d の表と近点への寄与の見積り)───────── */
/** 初期の慣性の接触要素(エンジンの分解の後の v —— 慣性速度)と軌道の法線 */
function orbitOf(S, U, G) {
  const r = [(S.x[1] - S.x[0]) * U.Lm, (S.y[1] - S.y[0]) * U.Lm, (S.z[1] - S.z[0]) * U.Lm], v = [(S.vx[1] - S.vx[0]) * U.Lm / U.Tm, (S.vy[1] - S.vy[0]) * U.Lm / U.Tm, (S.vz[1] - S.vz[0]) * U.Lm / U.Tm];
  const mu = G * (S.m[0] + S.m[1]) * U.Mm, rn = norm(r), v2 = dot(v, v), a = 1 / (2 / rn - v2 / mu), Lv = cross(r, v), h0 = norm(Lv), p = h0 * h0 / mu, e = Math.sqrt(Math.max(0, 1 - p / a));
  return { mu, r0: rn, a, e, p, h0, P: 2 * Math.PI * Math.sqrt(a ** 3 / mu), nOrb: unit(Lv), vObsLike: Math.sqrt(v2) };
}
export function partS(HP, base, o = {}) {
  const quick = !!o.quick, grid = quick ? MD_GRID_QUICK : MD_GRID, U = unitsOf(base);
  const ob = simOf(HP, variantBook(base, 'E1')); if (ob.err) throw new Error('段 S: ' + ob.err);
  const S = ob.S, G = base.physics.G * U.Lm ** 3 / (U.Mm * U.Tm * U.Tm), O = orbitOf(S, U, G), M = S.m[0] * U.Mm, Robs = S.radOv[0] * U.Lm, Rd = D.CAP_M;
  const cent = 36525 * 86400, perCent = cent / O.P, AS = 180 / Math.PI * 3600;
  const VmS = norm([(S.vx[1] - S.vx[0]) * U.Lm / U.Tm, (S.vy[1] - S.vy[0]) * U.Lm / U.Tm, (S.vz[1] - S.vz[0]) * U.Lm / U.Tm]);
  const rows = [];
  let ref = null;
  for (const shape of SHAPES) for (const f of grid) {
    const md = f * M, parts = D.sunParts(M, Robs, md, shape, Rd), B = refBodies(S, U, parts);
    const rM = D.refReceiver(B, 1, { order: 8 }), rS = D.refReceiver(B, 0, { order: 8 });   // 薄い殻の太陽は受け手にできない(下で核の体積だけ)
    const sun = B[0], uRot = cross(scale(sun.a, sun.Om), rM.rot[0]);
    const nOrb = O.nOrb, OmPar = sun.Om * dot(sun.a, nOrb), rotLen = norm(rM.rot[0]), wf = OmPar * rotLen / O.r0, c = wf * O.r0 ** 4;
    const mDrag = parts.reduce((s, p) => s + p.m, 0), rho2Drag = parts.reduce((s, p) => s + p.m * D.rho2Of(p), 0) / mDrag;   // 引きずる質量の分布の ⟨ρ²⟩(核だけの比較は核の 3R_d²/5)
    const beta = rM.beta[0], b = beta * O.r0 ** 2, b0 = b / (1 + rho2Drag / (3 * O.r0 ** 2));   // b₀: β r² から K2 の次の項を除いた遠方の係数
    const dMain = D.dPiTrans(b0, 2, O.p, O.e), dRho2 = D.dPiTrans(b0 * rho2Drag / 3, 4, O.p, O.e), dRot = D.dPiRot(c, O.p, O.h0);
    const betaSun = rS.beta === null ? null : rS.beta[1], bS = betaSun === null ? 0 : betaSun * O.r0 ** 2, dSun = D.dPiTrans(bS, 2, O.p, O.e);
    const row = { shape, f, md, betaMS: beta, betaCore: rM.betaPart[0][0], betaShell: rM.betaPart[0].length > 1 ? rM.betaPart[0][1] : 0, bMS: b, b0,
      rho2Drag, uRotMS: norm(uRot), uRotOverV: norm(uRot) / VmS, omegaAxialMS: norm(rM.omega), omegaAxialOverObs: dot(rM.omega, B[1].a) / B[1].Om, negFrac: rM.negFrac,
      betaSM: betaSun, sunReceiver: rS.undefinedReceiver ? 'undefined-thin-shell(殻の上で自己の場が発散 —— 外殻の受け手の寄与 0 の極限: 核の体積だけ)' : 'defined',
      perOrbit: { main: dMain, rho2: dRho2, rot: dRot, sun: dSun }, perCentury: { main: dMain * perCent * AS, rho2: dRho2 * perCent * AS, rot: dRot * perCent * AS, sun: dSun * perCent * AS } };
    row.perCentury.total = row.perCentury.main + row.perCentury.rho2 + row.perCentury.rot + row.perCentury.sun;
    rows.push(row);
    if (shape === 'thick' && f === 1) ref = row;
  }
  // 薄い殻の受け手: 外殻の体積の寄与は 0 の極限(殻の上で W → ∞)—— 核の体積だけで β を作り質量の重み m_d/M を掛ける
  for (const r of rows) if (r.shape === 'thin' && r.f < 1) {
    const parts = D.sunParts(M, Robs, r.md, 'thin', Rd), B = refBodies(S, U, parts);
    const pts = D.receiverPoints({ x: B[0].x, parts: [parts[0]] }, 8);   // 受け手の体積は核だけ(重み 1)—— 分母は核 + 薄い殻 + 水星
    let s = 0; for (const q of pts) { const F = D.fieldAt(B, q.x), rr = norm(sub(q.x, B[1].x)); s += q.w * B[1].parts[0].m * D.partK2(B[1].parts[0], rr) / F.W; }
    r.betaSM = (r.md / M) * s; r.sunReceiver = 'thin: 外殻の体積の寄与 0(殻の上で自己の場が発散)・核の体積の β × m_d/M';
    const bS = r.betaSM * O.r0 ** 2, dSun = D.dPiTrans(bS, 2, O.p, O.e);
    r.perOrbit.sun = dSun; r.perCentury.sun = dSun * perCent * AS; r.perCentury.total = r.perCentury.main + r.perCentury.rho2 + r.perCentury.rot + r.perCentury.sun;
  }
  for (const r of rows) r.deltaFromM = { total: r.perCentury.total - ref.perCentury.total, rho2: r.perCentury.rho2 - ref.perCentury.rho2, rot: r.perCentury.rot - ref.perCentury.rot, sun: r.perCentury.sun - ref.perCentury.sun };
  for (const r of rows) {   // 差を全部作ってから丸める(基準の行を先に丸めない)
    for (const k of Object.keys(r.perCentury)) r.perCentury[k] = r10(r.perCentury[k]);
    for (const k of Object.keys(r.perOrbit)) r.perOrbit[k] = r10(r.perOrbit[k]);
    for (const k of Object.keys(r.deltaFromM)) r.deltaFromM[k] = r10(r.deltaFromM[k]);
    for (const k of ['md', 'betaMS', 'betaCore', 'betaShell', 'bMS', 'b0', 'rho2Drag', 'uRotMS', 'uRotOverV', 'omegaAxialMS', 'omegaAxialOverObs', 'negFrac', 'betaSM']) r[k] = r10(r[k]);
  }
  const thick = rows.filter((r) => r.shape === 'thick'), thin = rows.filter((r) => r.shape === 'thin');
  return { grid, orbit: { mu: O.mu, r0: O.r0, a: O.a, e: O.e, p: O.p, h0: O.h0, P: O.P, perCentury: perCent, vInertial: VmS, nOrb: O.nOrb,
    sunAxisDotNorm: dot([S.sax[0], S.say[0], S.saz[0]], O.nOrb), sunOmega: S.spin[0] / U.Tm, Robs, Rd, M },
    formula: { main: 'π b₀ J₂/p²(b₀ = β r²/(1 + ⟨ρ²⟩_d/(3r²)) —— t = 0 の距離で)', rho2: 'π (b₀⟨ρ²⟩_d/3) J₄(e)/p⁴(K2 の次の項 ⟨ρ²⟩/(3r⁴))',
      rot: '−3π c/(p² h₀)(c = ω_f r⁴・ω_f = Ω_sun (â·n̂_orb) |⟨(Σ m M2/W) n̂⟩|/r)', sun: 'π b_S J₂/p²(b_S = β(太陽 ← 水星) r² —— 相対の速度 (1 − β_MS − β_SM) v)',
      perCentury: '1 周期の値 × (1 世紀 / P_K)(P_K は初期の慣性の接触要素のケプラー周期 —— 引きずりで周期が O(β) 変わる分は入れない)' },
    rows,
    reach: { thickMin: Math.min(...thick.map((r) => r.deltaFromM.total)), thickMax: Math.max(...thick.map((r) => r.deltaFromM.total)),
      thinMin: Math.min(...thin.map((r) => r.deltaFromM.total)), thinMax: Math.max(...thin.map((r) => r.deltaFromM.total)) } };
}

/* ───────── 段 R(エンジンの近点)───────── */
export const STATS = { runs: 0, steps: 0 };
export function measure(HP, q, dt, revMax) {
  const mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m), Tsec = Math.pow(10, q.scaleExp.T), t0 = Date.now();
  let smp = null, S = null;
  const R = AP.captureSim(HP, (s) => { S = s; smp = AP.attachSampler(s, { ci: 0, oi: 1, mu }); }, () => PL.runPl3(HP, q, { dt, revMax }));
  STATS.runs++; STATS.steps += R.steps;
  const w = PL.windowOf(R, revMax, Tsec), rev = R.ev.rev, f = rev.length >= revMax ? AP.apsisRate(smp.samples(), { t0: 0, t1: rev[revMax - 1], K: APSIS_K }) : null;
  const st = S ? HP.inertialDragIsqState(S) : null;
  return { detB: w.apsArcsecPerCentury, apsNew: f ? AP.toArcsecPerCentury(f.rate, Tsec) : null, periodDays: w.periodDays, ecc: w.ecc, nPeri: w.nPeri, complete: w.complete,
    steps: R.steps, nan: R.nan, betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, overlap: st ? st.overlapSteps : null, wallSec: (Date.now() - t0) / 1000 };
}
export function partR(HP, base, o = {}) {
  const quick = !!o.quick, N = quick ? 3 : N_ORB, divs = o.divs || (quick ? [1] : [1, 2]);   // 正本は h と h/2(数値の帯 |h − h/2| —— 届くかの判定〔差は 10⁶ ″/世紀の桁〕には足りる)
  const P3h = P3.stepsOf(base.timeRef.pRef).h;   // 器の刻み h(水星の 0.016 —— 第306便a と同じ)
  const out = { N, divs, h: P3h, rows: {} };
  for (const kind of ['C0', 'C1', 'E1', 'E2']) {
    out.rows[kind] = divs.map((dv) => { const q = variantBook(base, kind); const r = measure(HP, q, P3h / dv, N); return Object.assign({ div: dv }, r); });
  }
  // 差(写し − 重力だけの対照 —— 同じ刻み)と分け前
  const by = (k, i, f) => out.rows[k][i][f];
  out.diff = divs.map((dv, i) => {
    const o2 = { div: dv };
    for (const f of ['detB', 'apsNew']) {
      o2[f] = { gLoc: by('C1', i, f) - by('C0', i, f), E1: by('E1', i, f) - by('C0', i, f), E2: by('E2', i, f) - by('C0', i, f),
        dragE1: by('E1', i, f) - by('C1', i, f), dragE2: by('E2', i, f) - by('C1', i, f), E2minusE1: by('E2', i, f) - by('E1', i, f) };
    }
    return o2;
  });
  // 統合の後の 2 段目: --md の列(外殻の鍵を受理するエンジンだけ)。m_d = M☉ に外殻の鍵を足した本は既定(E1)と 2000 步の全状態がビット同一か(枝 a の契約)
  if (o.md && o.md.length) {
    const sweep = [];
    for (const f of o.md) {
      const q = variantBook(base, 'shell', { f, shape: o.shape || 'thick' });
      const v = HP.validatePreset(clone(q));
      if (!v.ok) { sweep.push({ f, status: 'shell-key-not-connected', shellPath: SHELL_PATH, err: JSON.stringify(v.errors).slice(0, 200) }); continue; }
      const row = { f, status: 'run', shellPath: SHELL_PATH, shape: o.shape || 'thick' };
      if (f === 1) row.bitSameE1 = stateSame(HP, q, variantBook(base, 'E1'), P3h, 2000);
      row.rows = divs.map((dv, i) => { const r = measure(HP, q, P3h / dv, N); return Object.assign({ div: dv, diffDetB: r.detB - by('C0', i, 'detB'), diffApsNew: r.apsNew - by('C0', i, 'apsNew') }, r); });
      sweep.push(row);
    }
    out.sweep = sweep;
  }
  // 比較(AN380 の読みではない): --core の列は dragCore の核だけ(外殻の引きずりを入れない —— 今のエンジンの dragCore {massFrac, radius} の意味)
  if (o.core && o.core.length) {
    out.coreOnly = o.core.map((f) => { const q = variantBook(base, 'core', { f });
      return { f, note: '比較(AN380 の読みではない —— 外殻の引きずりを入れない)', rows: divs.map((dv, i) => { const r = measure(HP, q, P3h / dv, N); return Object.assign({ div: dv, diffDetB: r.detB - by('C0', i, 'detB'), diffApsNew: r.apsNew - by('C0', i, 'apsNew') }, r); }) }; });
  }
  return out;
}

/** 2 つの本を同じ刻みで n 步進め、全状態(位置・速度・自転・軸)がビット同一か */
export function stateSame(HP, qa, qb, dt, n) {
  const a = simOf(HP, qa), b = simOf(HP, qb);
  if (a.err || b.err) return { same: false, err: a.err || b.err };
  for (let k = 0; k < n; k++) { a.S.step(dt); b.S.step(dt); }
  const keys = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz'];
  const diff = keys.filter((k) => a.S[k] && b.S[k] && Array.from(a.S[k]).some((v, i) => !Object.is(v, b.S[k][i])));
  return { same: diff.length === 0, steps: n, diffKeys: diff };
}

/* ───────── 段 Z(届くか)───────── */
export function partZ(HP, base, J) {
  const t = AN.an336Target(ROOT, base);
  let live = null;
  try {
    const A = JSON.parse(fs.readFileSync(path.join(ROOT, AN336_OUT), 'utf8')), r = A.mercury.rows.find((z) => z.key === 'n2');
    live = { file: AN336_OUT, k: r.k, diffNewH4: r.diffNew[2], diffBH4: r.diffB[2], gLocBH4: r.gLocB[2], dragBH4: r.dragB[2], generation: '旧則の世代(第306便a —— λ ∝ m の k・W_bg = W_ext・inertialR2)' };
  } catch (e) { live = { file: AN336_OUT, error: String(e && e.message || e).slice(0, 120) }; }
  const R = J.R, S = J.S, last = R ? R.diff.length - 1 : -1;
  const pick = (f) => (R ? R.diff[last][f] : null);
  const out = { target: { value: t.value, unit: t.unit, formula: t.formula, a1RecordId: t.a1.recordId, sigma: t.sigma, sourceWidth: t.sourceWidth, numericTolerance: t.numericTolerance.value },
    inPosition: live, mainDiv: R ? R.diff[last].div : null };
  if (R) {
    const B = pick('detB'), N = pick('apsNew');
    out.engine = { detB: B, apsNew: N };
    out.gapE1 = { detB: B.E1 - t.value, apsNew: N.E1 - t.value };                               // 在位の他の宣言のまま新則に置き換えた写し(m_d = M☉)と標的の差
    out.needed = { detB: -(B.E1 - t.value), apsNew: -(N.E1 - t.value) };                          // m_d の寄与が埋めるべき量
    out.neededDragShare = { detB: t.value - B.gLoc, apsNew: t.value - N.gLoc };                    // 標的 − G_loc の分(在位の旧則の引きずりが担っていた量)
    out.measuredReachProxy = { detB: B.E2minusE1, apsNew: N.E2minusE1, note: 'E2(dragCore の球 R_obs —— m_d → 0⁺ の代理)− E1(m_d = M☉)' };
  }
  if (S) {
    out.estimatedReach = { thick: [S.reach.thickMin, S.reach.thickMax], thin: [S.reach.thinMin, S.reach.thinMax] };
    const ref = S.rows.find((r) => r.shape === 'thick' && r.f === 1);
    out.estimateE1DragShare = ref.perCentury.total;
    if (R) {
      const need = out.needed.detB, reachLo = Math.min(S.reach.thickMin, S.reach.thinMin, R.diff[last].detB.E2minusE1), reachHi = Math.max(S.reach.thickMax, S.reach.thinMax, 0);
      out.reaches = need >= reachLo && need <= reachHi;
      out.reachRatio = Math.max(Math.abs(reachLo), Math.abs(reachHi)) / Math.abs(need);
      out.estimateVsEngine = { dragE1: { estimate: ref.perCentury.total, detB: R.diff[last].detB.dragE1, apsNew: R.diff[last].apsNew.dragE1 },
        reachProxy: { estimate: S.rows.find((r) => r.shape === 'thick' && r.f === Math.min(...S.grid)).deltaFromM.total, detB: R.diff[last].detB.E2minusE1, apsNew: R.diff[last].apsNew.E2minusE1 } };
      // 比較(AN380 の読みではない): 外殻の引きずりを入れない(核だけ)なら並進の主項は m_d に比例 —— 引きずりの分を標的の分にする m_d/M の一次の見積り
      const core = S.rows.filter((r) => r.shape === 'none');
      if (R.sweep) out.sweepVsEstimate = R.sweep.filter((w) => w.status === 'run').map((w) => { const m = w.rows[w.rows.length - 1], e1 = R.diff[last];
        const est = S.rows.find((r) => r.shape === (w.shape === 'thin' ? 'thin' : 'thick') && Math.abs(r.f - w.f) <= 1e-12 * w.f);
        return { f: w.f, shape: w.shape, div: m.div, measuredDeltaDetB: m.diffDetB - e1.detB.E1, measuredDeltaApsNew: m.diffApsNew - e1.apsNew.E1, estimate: est ? est.deltaFromM.total : null, bitSameE1: w.bitSameE1 || null }; });
      out.coreOnlyComparison = { note: '比較(AN380 の読みではない —— 外殻の引きずりを入れない写し)。並進の主項は m_d に比例するので、一次で m_d/M ≈ (標的 − G_loc の分)/(E1 の引きずりの分)',
        fLinear: (t.value - R.diff[last].detB.gLoc) / R.diff[last].detB.dragE1, rows: core.map((r) => ({ f: r.f, estimate: r.perCentury.total })) };
    }
  }
  return out;
}

/* ───────── 文書の表(PHYSICS〔第310便d〕の表の行は正本からこの関数で作る —— QA docs.mdSweep310 が逐語で照合)───────── */
const e3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (x === 0 ? '0' : Number(x).toExponential(3));
const f1 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(1);
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(3);
const fmd = (f) => (f === 1 ? '1' : Number(f).toExponential(2));
export function physicsTables(J) {
  const out = [];
  if (J.K) {
    out.push('| 外殻の核の照合 | 相対の差の最大 |', '|---|---|');
    out.push(`| 外部の点(r/R_o = 1.2〜1000): 閉じた式 ↔ 直接の 3 次元の求積(厚い殻・薄い殻の K2・M2) | ${e3(J.K.maxExt)} |`);
    out.push(`| 外部の点: 導関数 ↔ 数値の微分 | ${e3(J.K.maxDerivExt)} |`);
    out.push(`| 殻の物質の中: 球の差 ↔ 殻の角度の閉じた式の動径の求積 | ${e3(J.K.maxInnRadial)} |`);
    out.push(`| 空洞の点: 球の差 ↔ 動径の求積 / 直接の 3 次元の求積(r = 0.001 R_o) | ${e3(J.K.maxCav)} / ${e3(J.K.maxCav3d)} |`);
    out.push(`| 遠方の係数(r = 83 R_o): (w r²/m − 1)/(⟨ρ²⟩/(3r²))・M2/(2⟨ρ²⟩/(3r³)) の 1 からの差 | ${e3(J.K.farCoefMax)} |`);
  }
  if (J.E) {
    out.push('', '| エンジン ↔ 参照(t = 0) | β(水星 ← 太陽) | β(太陽 ← 水星) | β の差 | 回転の係数の差 | 軸の ω の差 |', '|---|---|---|---|---|---|');
    const lab = { default: '既定(R_d = 6.5×10⁶ m・m_d = M☉)', ballRobs: 'dragCore の球 R_obs(m_d → 0⁺ の代理)', 'core1e-3': 'dragCore の核だけ m_d = 10⁻³ M☉(外殻なし)' };
    for (const r of J.E.rows) out.push(`| ${lab[r.key] || r.key} | ${e3(r.betaMS)} | ${e3(r.betaSM)} | ${e3(Math.max(r.dBetaMS, r.dBetaSM))} | ${e3(r.dRot)} | ${e3(Math.max(r.dOmega, r.dOmegaSun))} |`);
  }
  if (J.S) {
    for (const shape of ['thick', 'thin']) {
      out.push('', `| m_d/M☉(${shape === 'thick' ? '一様の厚い殻 —— AN384 の読み' : '薄い殻 —— 比較'}) | β(水星 ← 太陽) | 外殻の分 | 回転引きずりの速さ [m/s] | 軸の ω·â/Ω_obs(水星) | β(太陽 ← 水星) | ⟨ρ²⟩ の項 [″/世紀] | 回転 [″/世紀] | m_d = M☉ との差 [″/世紀] |`,
        '|---|---|---|---|---|---|---|---|---|');
      for (const r of J.S.rows.filter((z) => z.shape === shape)) out.push(`| ${fmd(r.f)} | ${e3(r.betaMS)} | ${e3(r.betaShell)} | ${e3(r.uRotMS)} | ${e3(r.omegaAxialOverObs)} | ${e3(r.betaSM)} | ${f3(r.perCentury.rho2)} | ${f3(r.perCentury.rot)} | ${f3(r.deltaFromM.total)} |`);
    }
  }
  if (J.R) {
    out.push('', '| エンジンの近点(8 公転・差 = 写し − 重力だけの対照) | 刻み | 検出器 B [″/世紀] | 新しい抽出器 [″/世紀] |', '|---|---|---|---|');
    for (const d of J.R.diff) {
      out.push(`| G_loc だけ(C1 − C0) | h/${d.div} | ${f3(d.detB.gLoc)} | ${f3(d.apsNew.gLoc)} |`);
      out.push(`| E1(新則・m_d = M☉)− C0 | h/${d.div} | ${f1(d.detB.E1)} | ${f1(d.apsNew.E1)} |`);
      out.push(`| E2(dragCore の球 R_obs)− C0 | h/${d.div} | ${f1(d.detB.E2)} | ${f1(d.apsNew.E2)} |`);
      out.push(`| E2 − E1(m_d → 0⁺ の代理の幅) | h/${d.div} | ${f3(d.detB.E2minusE1)} | ${f3(d.apsNew.E2minusE1)} |`);
    }
  }
  if (J.Z && J.Z.engine) {
    const Z = J.Z;
    out.push('', '| 届くか(刻み h/' + Z.mainDiv + ') | 検出器 B | 新しい抽出器 |', '|---|---|---|');
    out.push(`| 標的 q⋆ = 1PN + A1 [″/世紀] | ${Z.target.value.toFixed(6)} | ${Z.target.value.toFixed(6)} |`);
    out.push(`| E1 − q⋆(新則の写し・m_d = M☉) | ${f1(Z.gapE1.detB)} | ${f1(Z.gapE1.apsNew)} |`);
    out.push(`| m_d の寄与が埋めるべき量 | ${f1(Z.needed.detB)} | ${f1(Z.needed.apsNew)} |`);
    out.push(`| m_d の寄与の幅(実測 E2 − E1) | ${f3(Z.measuredReachProxy.detB)} | ${f3(Z.measuredReachProxy.apsNew)} |`);
    out.push(`| m_d の寄与の幅(見積り 厚い殻 / 薄い殻 —— m_d/M☉ = 10⁻⁶) | ${f3(Z.estimatedReach.thick[0])} / ${f3(Z.estimatedReach.thin[0])} | — |`);
    out.push(`| 幅 / 埋めるべき量(最大) | ${e3(Z.reachRatio)} | — |`);
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const Z = J.Z || {}, out = [];
  if (Z.engine) out.push(f1(Z.gapE1.detB), f3(Z.measuredReachProxy.detB), e3(Z.reachRatio), e3(Z.coreOnlyComparison.fLinear));
  if (J.S) out.push(f3(J.S.reach.thickMin), f3(J.S.reach.thinMin));
  if (J.P) out.push(e3(J.P.maxRel));
  return out;
}

/* ───────── 門 ───────── */
export function liveDeclGate(HP) {
  const p = findPreset(HP, BOOK_ID), d = PIN.decl[BOOK_ID];
  const rd = p.physics.relativeDrag || {}, i2 = rd.inertialR2 || {};
  return { bodiesSame: JSON.stringify(p.bodies) === JSON.stringify(d.bodies), scaleSame: JSON.stringify(p.scaleExp) === JSON.stringify(d.scaleExp),
    timeRefSame: JSON.stringify(p.timeRef) === JSON.stringify(d.timeRef), gLoc: p.physics.gLoc || null, oldRule: rd.law === 'inertial' && typeof rd.Wbg === 'number' && !rd.invSq,
    k: i2.lambdaRs === undefined ? null : i2.lambdaRs, noDragCore: !p.bodies.some((b) => b.dragCore), noInvSq: !rd.invSq };
}
export function gatesOf(J) {
  const g = {};
  if (J.K) {
    g.kernelsExterior = J.K.maxExt <= 1e-12 && J.K.maxDerivExt <= 1e-8;
    g.kernelsInterior = J.K.maxInnRadial <= 1e-7 && J.K.maxInnDeriv <= 1e-6 && J.K.maxCav <= 1e-12 && J.K.maxCav3d <= 1e-7 && J.K.maxCavDeriv <= 1e-6 && J.K.maxThinIn <= 1e-10 && J.K.maxThinInDeriv <= 1e-7;
    g.farCoef = J.K.farCoefMax <= 1e-3;
    g.mdEqualsMNoShell = J.K.mdEqualsM.parts === 1 && J.K.mdHalf.parts === 2;
  }
  if (J.P) g.precessionFormula = J.P.maxRel <= 1e-4;
  if (J.E) g.engineVsRef = J.E.rows.every((r) => !r.err) && J.E.maxBeta <= 1e-12 && J.E.maxRot <= 1e-12 && J.E.maxOmega <= 1e-9;
  if (J.S) g.tableFinite = J.S.rows.every((r) => Number.isFinite(r.betaMS) && Number.isFinite(r.perCentury.total) && (r.betaSM === null || Number.isFinite(r.betaSM)));
  if (J.R) g.runsComplete = Object.values(J.R.rows).every((rs) => rs.every((r) => r.complete && !r.nan && Number.isFinite(r.detB) && Number.isFinite(r.apsNew)));
  if (J.live) g.inPositionUnchanged = J.live.bodiesSame && J.live.scaleSame && J.live.timeRefSame && J.live.oldRule && J.live.noInvSq && J.live.noDragCore && J.live.gLoc && J.live.gLoc.law === 'kappaC2';
  return g;
}

export function runAll(HP, o = {}) {
  const parts = o.parts || ['K', 'P', 'E', 'S', 'R', 'Z'], quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const base = pinnedBook(HP), J = { quick, parts };
  J.live = liveDeclGate(HP);
  J.book = { id: BOOK_ID, newDrag: clone(NEW_DRAG), gLoc: clone(GLOC_306A), declFile: DECL_FILE, shellPath: SHELL_PATH };
  if (parts.includes('K')) { J.K = partK(quick); tick('K'); }
  if (parts.includes('P')) { J.P = partP(quick); tick('P'); }
  if (parts.includes('E')) { J.E = partE(HP, base); tick('E'); }
  if (parts.includes('S')) { J.S = partS(HP, base, { quick }); tick('S'); }
  if (parts.includes('R')) { J.R = partR(HP, base, { quick, md: o.md, core: o.core, divs: o.divs, shape: o.shape }); tick('R'); }
  if (parts.includes('Z')) { J.Z = partZ(HP, base, J); tick('Z'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t; J.stats = Object.assign({}, STATS);
  return J;
}

const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W310D_TARGET || 'beta/index.html';
  const quick = process.env.W310D_QUICK === '1';
  const md = argOf('--md') ? argOf('--md').split(',').map(Number) : null, core = argOf('--core') ? argOf('--core').split(',').map(Number) : null;
  const divs = argOf('--divs') ? argOf('--divs').split(',').map(Number) : null;
  const shape = argOf('--shell') === 'thin' ? 'thin' : 'thick';
  const OUT = process.env.W310D_OUT || path.join(ROOT, 'tests', 'out', ((md || core) ? 'mdsweep-w310d-stage2.json' : 'mdsweep-w310d.json'));   // 2 段目は別名(鎖の正本を書かない)
  if (quick && !process.env.W310D_OUT) throw new Error('試走(W310D_QUICK=1)は W310D_OUT を指定する(正本を書かない)');
  const parts = process.env.W310D_PARTS ? process.env.W310D_PARTS.split(',') : ((md || core) ? ['E', 'S', 'R', 'Z'] : undefined);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  const R = runAll(HP, { quick, md, core, divs, shape, parts });
  const out = { version: HARNESS_VERSION, libVersion: D.LIB_VERSION, an336LibVersion: AN.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, generator: 'tests/exp-w310d-mdsweep.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第109報)AN380: 太陽の R_d は cap6500km で固定し、太陽の m_d の適正値を探索する。dragCore(R_d, m_d)と、外殻(観測半径, 観測質量 − m_d)の引きずりを、それぞれ計算する ' +
      '—— 決断事項 AN384(外殻の形)・AN385(受け手の側)・AN386(m_d の値域)・AN336(標的 1PN + A1)・統括の検証項目 R225。探索の材料(フィットの値を在位へ入れない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w310d-mdsweep.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w306a-an336.mjs',
    'tests/lib-w304e-apsis.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第310便d', target: TARGET, code: CODE,
    inputs: [TARGET, LEGACY7_DATA_FILE, DECL_FILE, AN336_OUT, AN.CANDIDATE_FILE, AN.AUDIT_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

// 第311便a(原仮定者の裁定(第110報)AN387 ④「選択肢として dragCore の自転も軸方向を含めてノブ」・(第113報)・DECISIONS v70 §0c ①・§1 AN397〔推奨の型〕・
// 決断事項 AN384「数値的に解像できない薄さの厚い殻は受理で拒否」・統括の検証項目 R226):
// **dragCore の自転と軸(新則の本だけの opt-in)と極薄の厚い殻の受理の防御の器**。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 validatePreset・inertialDragIsqState・
// inertialDragIsqPointAt・inertialDragIsqEval・inertialDragIsqRule・inertialDragInitObsState・inertialDragInitObsRedo・dragCoreEdit・ckSnapOne・ckRestoreOne と本の入口
// coord3d.makeSim・build・step をそのまま呼ぶ)。参照は tests/lib-w311a-corespin.mjs(源を dragCore と外殻に分けて回転と軸を部分ごとに積む —— エンジンと独立)。
// **在位の本の宣言は変えない**(写しは器の中で組む)。
//
// ■ 段
//   T(極薄の厚い殻 —— AN384): ☿ 3D の写し(fitRecord・abBody を外す)に invSq:{outerShell:"uniform", order:8}・回転と軸(bevel)・水星の dragCore = {massFrac:0.5,
//     radius: R(1 − gap)}(gap = 10⁻²・10⁻⁶・10⁻¹⁰・10⁻¹²・10⁻¹⁴・2⁻⁵²)。**防御の無い写し**(受理した宣言で組んだ sim の dragCore.radius を書き換える —— 受理器を通らない)の
//     読み口の β・回転の係数・軸の ω の有限性と 1 步・3 步の状態の有限性(再現)/受理器の判定(次数 8・2・24)/受理した写しの読み口が防御の無い写しと同じ/節点の余裕/
//     次数 8 と 12 の ω の差。対照: thin と massFrac = 1 は対象外(今のまま受理)。
//   K(鍵の受理 —— AN397): dragCore.spin・spinAxis の受理と拒否の表(値域・型・未知の鍵・旧則の本・引きずりの無い本・殻の形 shellRatio)と正準形。
//   B(ビット同一と分け方): ① 宣言の無い写しは読み口に coreSpin が無く作業 _rdIsqCs を作らない ② 宣言の値 = 天体の自転と軸の写しは未宣言と同じ(外殻の無い源は
//     ビット同一・外殻のある源は相対の差 —— 読み口と 20 步)③ m_d = M(外殻なし)で Ω_c = 0 なら太陽からの u_rot と ω が 0 ④ 外殻ありの源で核の項と外殻の項が線形に
//     分かれる(Ω_c を 2 倍・10 倍 → 核の分だけ比例・外殻の分はビット同一)・核と外殻の係数の和 = 合算の係数・外殻の係数 = 読み口の rotSrcShell。
//   R(参照 —— エンジンと lib): 玩具の配置(外殻 uniform/thin/なし × 核の自転と軸の宣言の組)で、源ごとの u_rot(核・外殻)・ω(核・外殻)・符号つきのスカラーをエンジンと lib で比べる。
//   M(太陽–水星 —— ⑤⑥): 第310便d の写しの作り方(🌡️ の第306便a の世代〔tests/data-w306a-decl305.json〕+ 在位の G_loc kappaC2 の引きずりを新則
//     {invSq:{outerShell:"uniform"}, cap6500km, initMotion:"observed", spinDrag:{rot, axial, bevel, initSpin:"observed"}} に)で太陽 R_d = 6.5×10⁶ m・m_d/M = 1・0.1・10⁻³・
//     太陽の核の自転 = 未宣言・0・観測と同じ・観測の 10 倍・軸を 90° 傾けた(傾き + 90°・方位は同じ)の水星の β・u_rot(核・外殻)・ω と、観測の初期値の分解の残り・前向きの照合。
//   C(状態の契約): チェックポイントの往復・同じ宣言の組み直し・観測の初期値の分解し直し(inertialDragInitObsRedo)・選択粒子の編集(dragCoreEdit)で核の自転の宣言が落ちない。
//   P(速さ —— 揮発): 評価 1 回の壁時計(核の自転の宣言の有無 —— ☿ 3D の写し・外殻 uniform)。
//
// ■ 言わないこと: 「核の運動を解いた」「法則を発見した」「フィットした」「完全に一致」。核の自転は**宣言の一定のベクトル**(入力のノブ —— 状態として進めない・
//   核の角運動量は解かない)。極薄の殻の防御は浮動小数点で表現できるかだけ(km や質量比の閾値ではない)。
//
// ■ 使い方
//   node tests/exp-w311a-corespin.mjs   → 正本 tests/out/corespin-w311a.json(段 corespin-311a)
//   W311A_OUT=<json> で出力先を変える(試走は正本を書かない)・W311A_TARGET=<html>(既定 beta/index.html)・W311A_QUICK=1(步数と表を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as CL from './lib-w311a-corespin.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限)
const REGEN_SCOPE = {"presets":["mercurySunInertial3d"],"roots":[],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w311a-corespin-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const { dot, cross, norm, add, sub, scale, unit } = CL;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const relv = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['核の運動を解いた', '法則を発見した', 'フィットした', '完全に一致', '核の角運動量を解いた'];
const CAP = 6.5e6;
const MER = 'mercurySunInertial3d';
const DECL_FILE = 'tests/data-w306a-decl305.json';
export const GAPS = Object.freeze([1e-2, 1e-6, 1e-10, 1e-12, 1e-14, Number.EPSILON]);
const GAP_NAME = (g) => (g === Number.EPSILON ? '2⁻⁵²' : g.toExponential(0));
const XV = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA'];
const fpS = (S, keys = XV) => { const h = crypto.createHash('sha1'); for (const k of keys) if (S[k]) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); return h.digest('hex'); };
const finArr = (a) => a === null || a === undefined || a.every(Number.isFinite);

function presetOf(HP, id) { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return clone(p); }
function build(H, q) {
  const HP = H.HP, v = HP.validatePreset(clone(q));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors || v.err).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, dt: E(H, 'appStepDt')(S), preset: v.preset, warnings: v.warnings || [] };
}
const errOf = (v) => (v.ok ? null : String((v.errors || [])[0] || ''));

/* ───────── 写し ───────── */
/** 段 T の写し(☿ 3D・fitRecord・abBody を外す・水星の dragCore を R(1 − gap)) */
function thinCopy(HP, gap, o = {}) {
  const q = presetOf(HP, MER); delete q.fitRecord; delete q.abBody;
  q.physics.relativeDrag = { law: 'inertial', invSq: { outerShell: o.shell || 'uniform', order: o.order || 8 }, spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
  const R = q.bodies[1].radius; q.bodies[1].dragCore = { massFrac: o.f === undefined ? 0.5 : o.f, radius: R * (1 - gap) };
  return q;
}
/** 段 K・B・C・P の写し(☿ 3D・新則・cap6500km・回転と軸 —— 第310便a の段 M と同じ)。f = 太陽の massFrac(null は dragCore なし)・cs = 核の自転と軸の鍵 */
export const INVSQ = { invSq: { order: 8 }, dragCoreDefault: 'cap6500km', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
function merCopy(HP, f, shell, cs, extra = {}) {
  const q = presetOf(HP, MER), L0 = q.scaleExp.L; delete q.fitRecord; delete q.abBody;
  q.physics.relativeDrag = { law: 'inertial', ...clone(INVSQ), ...extra };
  if (shell) q.physics.relativeDrag.invSq.outerShell = shell;
  if (f !== null && f !== undefined) q.bodies[0].dragCore = { massFrac: f, radius: CAP / Math.pow(10, L0), ...(cs ? clone(cs) : {}) };
  return q;
}
/** 段 M の写し(第310便d の写しの作り方 —— 🌡️ の第306便a の世代 + 在位の G_loc・新則・外殻 uniform)。cs = 太陽の核の自転と軸 */
const PIN = JSON.parse(fs.readFileSync(path.join(ROOT, DECL_FILE), 'utf8'));
export const NEW_DRAG = Object.freeze({ law: 'inertial', invSq: { outerShell: 'uniform' }, pairs: 'all', history: 'positions', dragCoreDefault: 'cap6500km', initMotion: 'observed',
  spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' } });
function pinnedCopy(HP, f, cs) {
  const p = presetOf(HP, MER), d = PIN.decl[MER];
  const q = clone(p); q.physics = clone(d.physics); q.bodies = clone(d.bodies); q.scaleExp = clone(d.scaleExp); q.timeRef = clone(d.timeRef);
  delete q.fitRecord; delete q.abBody; q.physics.gLoc = { law: 'kappaC2' };
  q.physics.relativeDrag = clone(NEW_DRAG);
  if (f !== null) q.bodies[0].dragCore = { massFrac: f, radius: CAP / Math.pow(10, q.scaleExp.L), ...(cs ? clone(cs) : {}) };
  return q;
}
const sunDecl = (q) => ({ spin: q.bodies[0].spin, tilt: q.bodies[0].spinAxis.tiltDeg, az: q.bodies[0].spinAxis.azimuthDeg });

/* ───────── 段 T(極薄の厚い殻 —— AN384)───────── */
function stateFinite(s) { return s.receivers.every((r) => finArr(r.beta) && finArr(r.rot) && finArr(r.omega)); }
function partT(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), rule = E(H, 'inertialDragIsqRule'), rows = [];
  const R = presetOf(HP, MER).bodies[1].radius;
  for (const g of GAPS) {
    const q = thinCopy(HP, g), v = HP.validatePreset(clone(q)), err = errOf(v), Ri = R * (1 - g);
    // 防御の無い写し(受理した 10⁻² の宣言で組み、dragCore.radius だけを書き換える —— 受理器を通らない)
    const a = build(H, thinCopy(HP, 1e-2)); a.S.dragCoreD[1].radius = Ri;
    const s0 = st(a.S), mer0 = s0.receivers.find((r) => r.i === 1);
    a.S.step(a.dt); const fin1 = XV.every((k) => !a.S[k] || Array.from(a.S[k].subarray(0, a.S.n)).every(Number.isFinite));
    a.S.step(a.dt); a.S.step(a.dt); const fin3 = XV.every((k) => !a.S[k] || Array.from(a.S[k].subarray(0, a.S.n)).every(Number.isFinite));
    // 節点の余裕(次数 8 —— エンジンと同じ演算の順)
    const R8 = rule(8), dR = R - Ri; let mIn = Infinity, collapse = 0;
    for (let k = 0; k < R8.n; k++) { const x = R8.GX[k], h = x * x * (3 - 2 * x), s = Ri + dR * h; if (!(s > Ri && s < R)) collapse++; mIn = Math.min(mIn, Math.min(s - Ri, R - s) / (Number.EPSILON * R)); }
    const row = { gap: GAP_NAME(g), gapValue: g, Ri, accepted: v.ok, err: err === null ? null : err.slice(0, 160),
      errHasCause: err === null ? null : (/求積で解像できない/.test(err) && /order/.test(err) && /内外の境界へ潰れる/.test(err)),
      unguarded: { finite: stateFinite(s0), merBeta: mer0 && finArr(mer0.beta) ? r10(mer0.beta[0]) : null, merOmegaNorm: mer0 && finArr(mer0.omega) ? r10(norm(mer0.omega)) : null, step1Finite: fin1, step3Finite: fin3 },
      nodeMarginUlp: Number.isFinite(mIn) ? r10(mIn) : null, nodesCollapsed: collapse,
      acceptOrder2: HP.validatePreset(clone(thinCopy(HP, g, { order: 2 }))).ok, acceptOrder24: HP.validatePreset(clone(thinCopy(HP, g, { order: 24 }))).ok };
    if (v.ok) {
      const b = build(H, q), s1 = st(b.S), pick = (s) => JSON.stringify(s.receivers.map((r) => [r.beta, r.rot, r.omega]));
      row.guardedFinite = stateFinite(s1); row.guardedSameAsUnguarded = pick(s1) === pick(s0);
      const q12 = thinCopy(HP, g, { order: 12 }), v12 = HP.validatePreset(clone(q12));
      if (v12.ok) { const m12 = st(build(H, q12).S).receivers.find((r) => r.i === 1), m8 = s1.receivers.find((r) => r.i === 1); row.omegaOrder8vs12 = r10(relv(m8.omega, m12.omega)); row.betaOrder8vs12 = r10(rel(m8.beta[0], m12.beta[0])); }
    }
    rows.push(row);
  }
  const base = rows.find((r) => r.gapValue === 1e-2);
  for (const r of rows) r.merOmegaOverGap1e2 = (r.unguarded.merOmegaNorm !== null && base.unguarded.merOmegaNorm) ? r10(r.unguarded.merOmegaNorm / base.unguarded.merOmegaNorm) : null;
  // 対照: thin と massFrac = 1 は対象外(今のまま受理)
  const controls = [['thin・10⁻¹⁴', thinCopy(HP, 1e-14, { shell: 'thin' })], ['massFrac 1・10⁻¹⁴', thinCopy(HP, 1e-14, { f: 1 })], ['外殻なし(outerShell 省略)・10⁻¹⁴', (() => { const q = thinCopy(HP, 1e-14); delete q.physics.relativeDrag.invSq.outerShell; return q; })()]]
    .map(([name, q]) => ({ name, accepted: HP.validatePreset(clone(q)).ok }));
  const expectReject = (g) => g === 1e-14 || g === Number.EPSILON;
  return { R, rows, controls,
    reproOk: rows.every((r) => r.unguarded.finite === !expectReject(r.gapValue)),
    guardOk: rows.every((r) => r.accepted === !expectReject(r.gapValue) && (r.accepted || r.errHasCause === true)),
    acceptedFinite: rows.filter((r) => r.accepted).every((r) => r.guardedFinite === true && r.guardedSameAsUnguarded === true),
    controlsAccepted: controls.every((c) => c.accepted) };
}

/* ───────── 段 K(鍵の受理 —— AN397)───────── */
function partK(H) {
  const HP = H.HP, out = [], q0 = merCopy(HP, 0.1, 'uniform'), sd = sunDecl(q0);
  const one = (name, mut, expectOk, re, canon) => {
    const q = clone(q0); mut(q);
    const v = HP.validatePreset(clone(q)), err = errOf(v);
    const got = v.ok ? v.preset.bodies[0].dragCore : null;
    const pass = v.ok === expectOk && (v.ok ? (canon === undefined || JSON.stringify(got) === JSON.stringify(canon)) : re.test(err));
    out.push({ name, ok: v.ok, expectOk, pass, canonical: got ? JSON.stringify(got) : null, err: err === null ? null : err.slice(0, 110) });
  };
  const dc = (x) => (q) => { q.bodies[0].dragCore = { massFrac: 0.1, radius: CAP / 1e8, ...x }; };
  const C0 = { massFrac: 0.1, radius: CAP / 1e8 };
  one('spin だけ(観測と同じ)', dc({ spin: sd.spin }), true, null, { ...C0, spin: sd.spin });
  one('spinAxis だけ(傾きと方位)', dc({ spinAxis: { tiltDeg: sd.tilt, azimuthDeg: sd.az } }), true, null, { ...C0, spinAxis: { tiltDeg: sd.tilt, azimuthDeg: sd.az } });
  one('spinAxis の方位の省略(既定 0)', dc({ spinAxis: { tiltDeg: 90 } }), true, null, { ...C0, spinAxis: { tiltDeg: 90 } });
  one('両方', dc({ spin: -0.5, spinAxis: { tiltDeg: 120, azimuthDeg: -30 } }), true, null, { ...C0, spin: -0.5, spinAxis: { tiltDeg: 120, azimuthDeg: -30 } });
  one('spin 0', dc({ spin: 0 }), true, null, { ...C0, spin: 0 });
  one('spin の値域の端 ±20', dc({ spin: -20 }), true, null, { ...C0, spin: -20 });
  const rs = /dragCore\.spin(.*)は -20〜20 の有限数/;
  for (const [n, s] of [['NaN', NaN], ['+Infinity', Infinity], ['文字列 "1"', '1'], ['null', null], ['true', true], ['20.5(値域の外)', 20.5], ['−21(値域の外)', -21], ['配列', [1]]]) one('spin ' + n, dc({ spin: s }), false, rs);
  const ra = /dragCore\.spinAxis(.*)は \{tiltDeg/;
  for (const [n, a] of [['配列', [0, 0, 1]], ['null', null], ['数', 3], ['tiltDeg なし', {}], ['tiltDeg 181', { tiltDeg: 181 }], ['tiltDeg NaN', { tiltDeg: NaN }], ['方位 400', { tiltDeg: 10, azimuthDeg: 400 }],
    ['方位 "0"', { tiltDeg: 10, azimuthDeg: '0' }]]) one('spinAxis ' + n, dc({ spinAxis: a }), false, ra);
  for (const k of ['enable', 'precessionRate', 'source']) one('spinAxis の鍵 ' + k + '(一定のベクトル —— 持たない)', dc({ spinAxis: { tiltDeg: 10, [k]: k === 'source' ? 'x' : (k === 'enable' ? true : 0.1) } }), false, /dragCore\.spinAxis に未知の鍵/);
  one('未知の鍵 omega', dc({ omega: 1 }), false, /dragCore に未知の鍵 omega/);
  one('旧則の本(invSq なし・law:"inertial")', (q) => { const p = presetOf(HP, MER); q.physics.relativeDrag = clone(p.physics.relativeDrag); q.bodies[0].dragCore = { ...C0, spin: 0.1 }; }, false, /新しい引きずり則 invSq の本だけ/);
  one('引きずりの無い本(relativeDrag なし)', (q) => { delete q.physics.relativeDrag; q.bodies[0].dragCore = { ...C0, spin: 0.1 }; }, false, /新しい引きずり則 invSq の本だけ/);
  one('殻の形 shellRatio と一緒', (q) => { const p = presetOf(HP, MER); q.physics.relativeDrag = clone(p.physics.relativeDrag); q.bodies[0].dragCore = { shellRatio: 0.5, spin: 0.1 }; }, false, /殻の形 shellRatio と一緒に宣言しない/);
  // 宣言の無い天体の正準形は第310便a と同じ形(鍵が増えない)
  const v0 = HP.validatePreset(clone(merCopy(HP, 0.1, 'uniform'))), canonSame = v0.ok && JSON.stringify(v0.preset.bodies[0].dragCore) === JSON.stringify(C0) && v0.preset.bodies[1].dragCore === undefined;
  return { cases: out, nCases: out.length, nPass: out.filter((r) => r.pass).length, canonicalUndeclaredSame: canonSame, allPass: out.every((r) => r.pass) && canonSame };
}

/* ───────── 段 B(ビット同一と分け方)───────── */
const pickR = (s) => JSON.stringify(s.receivers.map((r) => [r.beta, r.rot, r.omega]));
function uRotOf(S, rv, j) { const Om = S.spin[j], a = [S.sax[j], S.say[j], S.saz[j]]; return cross(scale(a, Om), rv.slice(3 * j, 3 * j + 3)); }
function partB(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), K = quick ? 6 : 20, rows = [];
  const sd = sunDecl(presetOf(HP, MER)), eq = { spin: sd.spin, spinAxis: { tiltDeg: sd.tilt, azimuthDeg: sd.az } };
  // ① 宣言の無い写し
  const u0 = build(H, merCopy(HP, 0.1, 'uniform')); for (let k = 0; k < 3; k++) u0.S.step(u0.dt);
  const undeclared = { stateHasCoreSpin: 'coreSpin' in st(u0.S), workArray: u0.S._rdIsqCs === undefined ? 'undefined' : (u0.S._rdIsqCs === null ? 'null' : 'object'),
    receiverHasCoreSpinSrc: st(u0.S).receivers.some((r) => 'coreSpinSrc' in r) };
  // ② 宣言の値 = 天体の自転と軸
  const CASES = [['f1-none', 1, null], ['f1-uniform', 1, 'uniform'], ['f0.1-uniform', 0.1, 'uniform'], ['f0.001-uniform', 0.001, 'uniform'], ['f0.1-thin', 0.1, 'thin'], ['f0.1-none', 0.1, null]];
  for (const [key, f, sh] of CASES) for (const [dk, cs] of [['両方', eq], ['spin だけ', { spin: sd.spin }], ['spinAxis だけ', { spinAxis: eq.spinAxis }]]) {
    if (dk !== '両方' && key !== 'f0.1-uniform' && key !== 'f1-none') continue;
    const A = build(H, merCopy(HP, f, sh)), B = build(H, merCopy(HP, f, sh, cs)), sa = st(A.S), sb = st(B.S);
    const ea = sa.receivers.find((r) => r.i === 1), eb = sb.receivers.find((r) => r.i === 1), c = eb.coreSpinSrc.find((z) => z.j === 0);
    const uA = uRotOf(A.S, ea.rot, 0);
    for (let k = 0; k < K; k++) { A.S.step(A.dt); B.S.step(B.dt); }
    const shellSun = !!(sb.outerShell && sb.outerShell.Ms && sb.outerShell.Ms[0] > 0);
    rows.push({ key, decl: dk, shellSun, readoutBitSame: pickR(sa) === pickR(sb), omegaRel: r10(relv(eb.omega, ea.omega)), uRotRel: r10(relv(c.uRot, uA)),
      omegaS: r10(c.omegaS), runBitSame: fpS(A.S) === fpS(B.S), steps: K });
  }
  // ③ m_d = M(外殻なし)で Ω_c = 0 → 太陽からの u_rot と ω が 0 / 外殻ありで Ω_c = 0 → 核の分が 0・外殻の分は未宣言の外殻の分とビット同一
  const z1 = st(build(H, merCopy(HP, 1, null, { spin: 0 })).S).receivers.find((r) => r.i === 1), cz1 = z1.coreSpinSrc.find((z) => z.j === 0);
  const zeroNoShell = { uRot: cz1.uRot, omega: cz1.omega, omegaS: cz1.omegaS, merOmegaTotal: z1.omega, allZero: cz1.uRot.every((v) => v === 0) && cz1.omega.every((v) => v === 0) && cz1.omegaS === 0 && z1.omega.every((v) => v === 0) };
  const sU = build(H, merCopy(HP, 0.1, 'uniform')), zS = st(sU.S, {}), zr = zS.receivers.find((r) => r.i === 1);
  const z2 = st(build(H, merCopy(HP, 0.1, 'uniform', { spin: 0 })).S).receivers.find((r) => r.i === 1), cz2 = z2.coreSpinSrc.find((z) => z.j === 0);
  const shellOnlyU = uRotOf(sU.S, zr.rotSrcShell, 0);
  const zeroWithShell = { coreZero: cz2.uRotCore.every((v) => v === 0) && cz2.omegaCore.every((v) => v === 0),
    shellRotSameAsRotSrcShell: JSON.stringify(cz2.rotShell) === JSON.stringify(zr.rotSrcShell.slice(0, 3)), uRotShellVsUndeclaredShellPart: r10(relv(cz2.uRotShell, shellOnlyU)) };
  // ④ 線形(Ω_c を 0・1・2・10 倍 —— 比は読み口の核の s の比〔状態の S.spin と同じ精度で持つ —— この本は Float32〕で取る)
  const lin = (mult) => { const s = st(build(H, merCopy(HP, 0.1, 'uniform', { spin: mult * sd.spin })).S); return Object.assign({ s: s.coreSpin.sources[0].s }, s.receivers.find((r) => r.i === 1).coreSpinSrc.find((z) => z.j === 0)); };
  const L0 = lin(0), L1 = lin(1), L2 = lin(2), L10 = lin(10), k2 = L2.s / L1.s, k10 = L10.s / L1.s;
  const sameShell = [L1, L2, L10].every((c) => JSON.stringify([c.uRotShell, c.omegaShell, c.rotShell]) === JSON.stringify([L0.uRotShell, L0.omegaShell, L0.rotShell]));
  const linear = { k2: r10(k2), k10: r10(k10), uCore2: r10(relv(L2.uRotCore, scale(L1.uRotCore, k2))), uCore10: r10(relv(L10.uRotCore, scale(L1.uRotCore, k10))), omegaCore2: r10(relv(L2.omegaCore, scale(L1.omegaCore, k2))),
    omegaCore10: r10(relv(L10.omegaCore, scale(L1.omegaCore, k10))), totalDiff: r10(relv(sub(L2.uRot, L1.uRot), scale(sub(L1.uRot, L0.uRot), (L2.s - L1.s) / L1.s))), shellBitSame: sameShell,
    rotCorePlusShellVsRot: r10(relv(add(L1.rotCore, L1.rotShell), zr.rot.slice(0, 3))), uCoreOverShell: r10(norm(L1.uRotCore) / norm(L1.uRotShell)) };
  return { undeclared, rows, zeroNoShell, zeroWithShell, linear };
}

/* ───────── 段 R(参照 —— エンジンと lib)───────── */
function engineState(bodies, o = {}) {
  const n = bodies.length, F = (f) => Float64Array.from(bodies.map(f));
  const isq = { Wbg2: 0, order: o.order || 8, ...(o.shell ? { outerShell: o.shell } : {}) };
  return { n, coord3d: true, m: F((b) => b.m), x: F((b) => b.x[0]), y: F((b) => b.x[1]), z: F((b) => b.x[2]), spin: F((b) => b.Om || 0), radOv: F((b) => b.Ro || b.Rd),
    sax: F((b) => b.a[0]), say: F((b) => b.a[1]), saz: F((b) => b.a[2]), pinned: new Uint8Array(n),
    relDrag: { law: 'inertial', invSq: isq, pairs: 'all', history: 'positions', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', axialGain: 1, axialNorm: 'diff' } },
    dragCoreD: bodies.map((b) => (b.md !== undefined || b.cs ? { massFrac: (b.md === undefined ? b.m : b.md) / b.m, radius: b.Rd, R: b.Ro || b.Rd, ...(b.cs || {}) } : null)),
    _rdPairSet: null, _rdPairN: n, _amKind: null, params: { G: 1, cLight: 1 } };
}
export const TOYS = [
  { key: 'S2u', mode: 'uniform', bodies: [{ x: [0, 0, 0], m: 5, md: 1, Rd: 0.3, Ro: 1.2, Om: 0.8, a: unit([0.2, 0.1, 1]), cs: { spin: -1.7, spinAxis: { tiltDeg: 70, azimuthDeg: 20 } } }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }] },
  { key: 'S2t', mode: 'thin', bodies: [{ x: [0, 0, 0], m: 5, md: 1, Rd: 0.3, Ro: 1.2, Om: 0.8, a: unit([0.2, 0.1, 1]), cs: { spin: 2.5 } }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }] },
  { key: 'S3u', mode: 'uniform', bodies: [{ x: [0, 0, 0], m: 5, md: 0.5, Rd: 0.2, Ro: 1.1, Om: 1, a: [0, 0, 1], cs: { spinAxis: { tiltDeg: 90 } } }, { x: [8, 0, 1], m: 1, md: 0.6, Rd: 0.25, Ro: 0.5, Om: 0.5, a: unit([1, 0, 1]), cs: { spin: 0 } },
    { x: [-3, 7, -2], m: 2, Rd: 0.8, Om: -0.2, a: unit([0, 1, 1]), cs: { spin: 0.9, spinAxis: { tiltDeg: 150, azimuthDeg: -100 } } }] },
  { key: 'S2n', mode: null, bodies: [{ x: [0, 0, 0], m: 5, Rd: 0.3, Om: 0.8, a: unit([0.2, 0.1, 1]), cs: { spin: -1.7, spinAxis: { tiltDeg: 120, azimuthDeg: 20 } } }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }] },
  { key: 'S2eq', mode: 'uniform', bodies: [{ x: [0, 0, 0], m: 5, md: 1, Rd: 0.3, Ro: 1.2, Om: 0.8, a: CL.axisOf(10, 30), cs: { spin: 0.8, spinAxis: { tiltDeg: 10, azimuthDeg: 30 } } }, { x: [7, 1.5, -0.8], m: 1, Rd: 0.4, Om: -0.3, a: [0, 0, 1] }] }];
function partR(H, quick) {
  const st = E(H, 'inertialDragIsqState'), rows = [];
  let eu = 0, eo = 0, es = 0, ew = 0;
  for (const T of TOYS) for (const order of (quick ? [6] : [6, 8])) {
    const bodies = T.bodies.map((b) => ({ ...b, Omc: b.cs && b.cs.spin !== undefined ? b.cs.spin : undefined, ac: b.cs && b.cs.spinAxis ? CL.axisOf(b.cs.spinAxis.tiltDeg, b.cs.spinAxis.azimuthDeg) : undefined }));
    const s = st(engineState(T.bodies, { shell: T.mode, order }));
    for (let i = 0; i < bodies.length; i++) {
      const Rf = CL.refReceiverCoreSpin(bodies, i, { order, mode: T.mode, axial: true }), e = s.receivers.find((x) => x.i === i);
      let mu = 0, mo = 0, ms = 0;
      for (const c of e.coreSpinSrc) {
        const j = c.j;
        mu = Math.max(mu, relv(c.uRot, Rf.uRot[j]));
        if (norm(Rf.uRotCore[j]) > 0) mu = Math.max(mu, relv(c.uRotCore, Rf.uRotCore[j]));
        if (norm(Rf.uRotShell[j]) > 0) mu = Math.max(mu, relv(c.uRotShell, Rf.uRotShell[j]));
        if (norm(Rf.omega[j]) > 0) mo = Math.max(mo, relv(c.omega, Rf.omega[j]));
        if (Rf.omegaS[j] !== 0) ms = Math.max(ms, rel(c.omegaS, Rf.omegaS[j]));
      }
      const mw = norm(Rf.omegaSum) > 0 ? relv(e.omega, Rf.omegaSum) : 0;
      eu = Math.max(eu, mu); eo = Math.max(eo, mo); es = Math.max(es, ms); ew = Math.max(ew, mw);
      rows.push({ key: T.key, order, recv: i, srcs: e.coreSpinSrc.map((c) => c.j), engVsLibURot: r10(mu), engVsLibOmega: r10(mo), engVsLibOmegaS: r10(ms), engVsLibOmegaSum: r10(mw) });
    }
  }
  return { rows, maxURot: r10(eu), maxOmega: r10(eo), maxOmegaS: r10(es), maxOmegaSum: r10(ew) };
}

/* ───────── 段 M(太陽–水星 —— ⑤⑥)───────── */
function partM(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), io = E(H, 'inertialDragInitObsState'), rows = [];
  const q0 = pinnedCopy(HP, 1, null), sd = sunDecl(q0), U = { Lm: Math.pow(10, q0.scaleExp.L), Tm: Math.pow(10, q0.scaleExp.T) }, vu = U.Lm / U.Tm;
  const DECLS = [['未宣言', null], ['0', { spin: 0 }], ['観測と同じ', { spin: sd.spin, spinAxis: { tiltDeg: sd.tilt, azimuthDeg: sd.az } }], ['観測の 10 倍', { spin: 10 * sd.spin, spinAxis: { tiltDeg: sd.tilt, azimuthDeg: sd.az } }],
    ['軸を 90° 傾けた', { spin: sd.spin, spinAxis: { tiltDeg: sd.tilt + 90, azimuthDeg: sd.az } }]];
  for (const f of (quick ? [1, 0.1] : [1, 0.1, 1e-3])) for (const [dk, cs] of DECLS) {
    const a = build(H, pinnedCopy(HP, f, cs)), S = a.S, s = st(S), mer = s.receivers.find((r) => r.i === 1), rec = io(S);
    const c = mer.coreSpinSrc ? mer.coreSpinSrc.find((z) => z.j === 0) : null;
    const uTot = c ? c.uRot : uRotOf(S, mer.rot, 0), am = [S.sax[1], S.say[1], S.saz[1]];
    const omSun = c ? c.omega : mer.omega;   // 太陽だけが源(2 体)
    const row = { mdOverM: f, decl: dk, betaMerFromSun: mer.beta[0], uRotCoreMs: c ? r10(norm(c.uRotCore) * vu) : null, uRotShellMs: c ? r10(norm(c.uRotShell) * vu) : null, uRotMs: r10(norm(uTot) * vu),
      omegaNorm: r10(norm(omSun)), omegaAxialOverSpin: r10(dot(omSun, am) / S.spin[1]), sunCoreS: c ? r10(s.coreSpin.sources[0].s) : null, sunShellSpinI: r10(S.spin[0]), merSpinI: r10(S.spin[1]),
      initOk: !!(rec && rec.ok), spinResidual: rec && rec.spin ? r10(rec.spin.residual) : null, spinIterations: rec && rec.spin ? rec.spin.iterations : null,
      motionForward: rec && rec.motion ? r10(rec.motion.forwardResidual) : null, motionIterDiff: rec && rec.motion ? r10(rec.motion.diffIterDirect) : null,
      merU0Ms: rec && rec.motion ? r10(norm(rec.motion.rows[1].u) * vu) : null };
    a.S.step(a.dt); row.step1Finite = XV.every((k) => !S[k] || Array.from(S[k].subarray(0, S.n)).every(Number.isFinite));
    rows.push(row);
  }
  for (const f of new Set(rows.map((r) => r.mdOverM))) {
    const g = rows.filter((r) => r.mdOverM === f), ref = g.find((r) => r.decl === '観測と同じ'), un = g.find((r) => r.decl === '未宣言');
    for (const r of g) { r.betaSameAsUndeclared = r.betaMerFromSun === un.betaMerFromSun; r.uRotOverObs = r10(r.uRotMs / ref.uRotMs); r.omegaOverObs = r10(r.omegaNorm / ref.omegaNorm); }
    for (const r of g) r.betaMerFromSun = r10(r.betaMerFromSun);   // 比べた後に丸める
  }
  return { id: MER, declFile: DECL_FILE, units: { velocityMs: vu }, sun: { spin: sd.spin, tiltDeg: sd.tilt, azimuthDeg: sd.az }, rows,
    allFinite: rows.every((r) => r.step1Finite && [r.uRotMs, r.omegaNorm, r.betaMerFromSun].every(Number.isFinite)), betaUnchanged: rows.every((r) => r.betaSameAsUndeclared), initAllOk: rows.every((r) => r.initOk) };
}

/* ───────── 段 C(状態の契約)───────── */
function partC(H, quick) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), sd = sunDecl(presetOf(HP, MER)), cs = { spin: 10 * sd.spin, spinAxis: { tiltDeg: sd.tilt + 90, azimuthDeg: sd.az } };
  const snap = E(H, 'ckSnapOne'), rest = E(H, 'ckRestoreOne');
  const c = build(H, merCopy(HP, 0.1, 'uniform', cs)), S = c.S;
  for (let k = 0; k < 4; k++) S.step(c.dt);
  const o = snap(S); for (let k = 0; k < 5; k++) S.step(c.dt); const A = fpS(S) + JSON.stringify([S.inertialDragIsqN, S.inertialDragIsqBetaMax, S.inertialDragIsqNeg]);
  rest(S, o); for (let k = 0; k < 5; k++) S.step(c.dt); const B = fpS(S) + JSON.stringify([S.inertialDragIsqN, S.inertialDragIsqBetaMax, S.inertialDragIsqNeg]);
  const checkpointSame = A === B;
  const r1 = build(H, merCopy(HP, 0.1, 'uniform', cs)), r2 = build(H, merCopy(HP, 0.1, 'uniform', cs));
  for (let k = 0; k < 10; k++) { r1.S.step(r1.dt); r2.S.step(r2.dt); }
  const rebuildSame = fpS(r1.S) === fpS(r2.S);
  // 観測の初期値の分解(核の自転は宣言の値 —— 分解しない)と分解し直し
  const p = build(H, pinnedCopy(HP, 0.1, cs)), rec0 = E(H, 'inertialDragInitObsState')(p.S), f0 = fpS(p.S);
  const redo = E(H, 'inertialDragInitObsRedo')(p.S), f1 = fpS(p.S);
  const coreS = st(p.S).coreSpin.sources[0];
  const initRedoSame = !!(rec0 && rec0.ok && redo && redo.ok) && f0 === f1;
  const coreNotDecomposed = coreS.s === Math.fround(cs.spin) || coreS.s === cs.spin;
  // 選択粒子の編集(massFrac を変える)で核の自転と軸の宣言が落ちない
  const e = build(H, merCopy(HP, 0.1, 'uniform', cs)), ed = E(H, 'dragCoreEdit')(e.S, 0, { massFrac: 0.2 }), dd = e.S.dragCoreD[0];
  const editKeeps = !!(ed && ed.ok) && dd.massFrac === 0.2 && dd.spin === cs.spin && JSON.stringify(dd.spinAxis) === JSON.stringify(cs.spinAxis) && st(e.S).coreSpin.sources[0].declaredAxis === true;
  // 宣言の無い本の編集は今と同じ形(鍵を足さない)
  const e2 = build(H, merCopy(HP, 0.1, 'uniform')); E(H, 'dragCoreEdit')(e2.S, 0, { massFrac: 0.2 });
  const editUndeclaredShape = JSON.stringify(Object.keys(e2.S.dragCoreD[0])) === JSON.stringify(['massFrac', 'radius', 'R']);
  return { checkpointSame, rebuildSame, initRedoSame, coreNotDecomposed, editKeeps, editUndeclaredShape, initRecord: rec0 ? { ok: rec0.ok, spinResidual: r10(rec0.spin.residual), forward: r10(rec0.motion.forwardResidual) } : null };
}

/* ───────── 段 P(速さ —— 揮発)───────── */
function partP(H, quick) {
  const HP = H.HP, ev = E(H, 'inertialDragIsqEval'), sd = sunDecl(presetOf(HP, MER)), out = [];
  const K = quick ? 5 : 30;
  for (const [k, cs] of [['未宣言', null], ['宣言', { spin: 10 * sd.spin, spinAxis: { tiltDeg: sd.tilt + 90, azimuthDeg: sd.az } }]]) {
    const S = build(H, merCopy(HP, 0.1, 'uniform', cs)).S, n = S.n, BE = new Float64Array(n * n), RV = new Float64Array(n * n * 3), OP = new Float64Array(n * n * 4);
    const run = () => { const t0 = process.hrtime.bigint(); for (let r = 0; r < K; r++) ev(S, n, S.x, S.y, S.z, BE, RV, OP, true, true, 1); return Number(process.hrtime.bigint() - t0) / 1e9 / K; };
    run(); const T = [run(), run(), run()].sort((a, b) => a - b);
    out.push({ decl: k, evalSec: { wallSec: r10(T[1]) } });
  }
  return { rows: out };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  return {
    thinReproduced: J.T.reproOk,
    thinGuardRejectsOnlyCollapsed: J.T.guardOk,
    thinAcceptedFinite: J.T.acceptedFinite,
    thinControlsAccepted: J.T.controlsAccepted,
    keysAcceptance: J.K.allPass,
    undeclaredNoWork: J.B.undeclared.stateHasCoreSpin === false && J.B.undeclared.receiverHasCoreSpinSrc === false && J.B.undeclared.workArray !== 'object',
    equalNoShellBitSame: J.B.rows.filter((r) => !r.shellSun).every((r) => r.readoutBitSame && r.runBitSame),
    equalShellClose: J.B.rows.filter((r) => r.shellSun).every((r) => r.omegaRel < 1e-12 && r.uRotRel < 1e-12),
    equalRunsBitSame: J.B.rows.every((r) => r.runBitSame),
    zeroCoreNoShell: J.B.zeroNoShell.allZero,
    zeroCoreWithShell: J.B.zeroWithShell.coreZero && J.B.zeroWithShell.shellRotSameAsRotSrcShell && J.B.zeroWithShell.uRotShellVsUndeclaredShellPart < 1e-12,
    coreShellLinear: J.B.linear.shellBitSame && Math.max(J.B.linear.uCore2, J.B.linear.uCore10, J.B.linear.omegaCore2, J.B.linear.omegaCore10) < 1e-12 && J.B.linear.totalDiff < 1e-9 && J.B.linear.rotCorePlusShellVsRot < 1e-12,
    engineVsLib: J.R.maxURot < 1e-12 && J.R.maxOmega < 1e-9 && J.R.maxOmegaS < 1e-9 && J.R.maxOmegaSum < 1e-9,
    mercuryTableFinite: J.M.allFinite,
    mercuryBetaUnchanged: J.M.betaUnchanged,
    mercuryInitOk: J.M.initAllOk,
    contract: J.C.checkpointSame && J.C.rebuildSame && J.C.initRedoSame && J.C.coreNotDecomposed && J.C.editKeeps && J.C.editUndeclaredShape,
  };
}

/* ───────── 文書の表と数(PHYSICS〔第311便a〕—— QA docs.coreSpin311 が正本から作り直して逐語で照合する)───────── */
const e2s = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(2);
const f3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toFixed(3);
const floor12 = (v) => (v === null || v === undefined) ? '—' : (v === 0 ? '0' : (v < 1e-12 ? '< 1e-12' : Number(v).toExponential(2)));
const yn = (b) => (b ? '有限' : '非有限');
export function physicsTables(J) {
  const out = [];
  out.push('| gap(dragCore.radius = R(1 − gap)) | 防御の無い写しの β・回転・ω | 1 步・3 步の状態 | 受理(次数 8) | 次数 2・24 | 節点の余裕 [ulp] | ☿ の ω の大きさ(10⁻² 比) |', '|---|---|---|---|---|---|---|');
  for (const r of J.T.rows) out.push(`| ${r.gap} | ${yn(r.unguarded.finite)} | ${yn(r.unguarded.step1Finite)}・${yn(r.unguarded.step3Finite)} | ${r.accepted ? '受理' : '拒否'} | ${r.acceptOrder2 ? '受理' : '拒否'}・${r.acceptOrder24 ? '受理' : '拒否'} | ${r.nodeMarginUlp === null ? '—' : e2s(r.nodeMarginUlp)} | ${r.merOmegaOverGap1e2 === null ? '—' : e2s(r.merOmegaOverGap1e2)} |`);
  out.push('', '| 照合 | 値 |', '|---|---|');
  out.push(`| 鍵 dragCore.spin・spinAxis の受理と拒否の表 | ${J.K.nPass}/${J.K.nCases} |`);
  const ns = J.B.rows.filter((r) => !r.shellSun), ws = J.B.rows.filter((r) => r.shellSun);
  out.push(`| 宣言の値 = 天体の自転と軸(太陽に外殻なし ${ns.length} 通り)の読み口と ${J.B.rows[0].steps} 步 | ${ns.every((r) => r.readoutBitSame && r.runBitSame) ? 'ビット同一' : '違う'} |`);
  out.push(`| 同じ(太陽に外殻あり ${ws.length} 通り)の ω・u_rot の相対の差の最大 / ${J.B.rows[0].steps} 步 | ${floor12(Math.max(...ws.map((r) => r.omegaRel)))}・${floor12(Math.max(...ws.map((r) => r.uRotRel)))} / ${ws.every((r) => r.runBitSame) ? 'ビット同一' : '違う'} |`);
  out.push(`| m_d = M(外殻なし)・Ω_c = 0 の太陽からの u_rot・ω | ${J.B.zeroNoShell.allZero ? '0(厳密)' : '0 でない'} |`);
  out.push(`| Ω_c を 2 倍・10 倍の核の分の比例(u_rot・ω の相対の差の最大)・外殻の分 | ${floor12(Math.max(J.B.linear.uCore2, J.B.linear.uCore10, J.B.linear.omegaCore2, J.B.linear.omegaCore10))}・${J.B.linear.shellBitSame ? 'ビット同一' : '違う'} |`);
  out.push(`| 玩具の配置のエンジンと lib(u_rot・ω・符号つきのスカラー)の相対の差の最大 | ${floor12(J.R.maxURot)}・${floor12(J.R.maxOmega)}・${floor12(J.R.maxOmegaS)} |`);
  out.push('', '| ☉ の核の自転(☿ ← ☉) | m_d/M | u_rot [m/s] | うち核 | ω の大きさ [rad/本の時間] | u_rot・ω の観測と同じに対する比 | 分解の残り(自転・前向き) |', '|---|---|---|---|---|---|---|');
  for (const r of J.M.rows) out.push(`| ${r.decl} | ${r.mdOverM} | ${e2s(r.uRotMs)} | ${r.uRotCoreMs === null ? '—' : e2s(r.uRotCoreMs)} | ${e2s(r.omegaNorm)} | ${f3(r.uRotOverObs)}・${f3(r.omegaOverObs)} | ${floor12(r.spinResidual)}・${floor12(r.motionForward)} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  const t12 = J.T.rows.find((r) => r.gapValue === 1e-12), m = J.M.rows.find((r) => r.mdOverM === 0.1 && r.decl === '観測の 10 倍');
  return [e2s(t12.merOmegaOverGap1e2), e2s(J.B.linear.uCoreOverShell), m ? f3(m.uRotOverObs) : '—'];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const T = partT(H, quick); tick('T');
  const K = partK(H); tick('K');
  const B = partB(H, quick); tick('B');
  const R = partR(H, quick); tick('R');
  const M = partM(H, quick); tick('M');
  const C = partC(H, quick); tick('C');
  const P = partP(H, quick); tick('P');
  const J = { quick, T, K, B, R, M, C, P };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 受理器(validateDragCoreBody)を読む既存の器・正本の扱い(第311便a の枝で列挙して scratch で走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w310a-invsq.mjs(正本 invsq-w310a.json)', reads: '新則の dragCore(太陽 6.5×10⁶ m・外殻 uniform/thin)', handling: '極薄の判定は太陽の R/R_d ≈ 107 で当たらない —— 正本の値は不変(scratch で照合)' },
  { file: 'tests/exp-w310d-mdsweep.mjs(正本 mdsweep-w310d.json)', reads: '新則の dragCore(太陽 m_d の格子・外殻 thick/thin)', handling: '同上(段の値は鎖が領域で判定)' },
  { file: 'tests/exp-w309a-invsq.mjs・exp-w310b-pairheat.mjs', reads: '新則の dragCore(外殻なし)', handling: '外殻を宣言しないので受理は今と同じ' },
  { file: '旧則の器(exp-w292c〜w306e の dragCore)', reads: '旧則の構造核 {massFrac, radius}', handling: '受理の経路は 1 字も変えない(spin・spinAxis を書かない宣言)' },
];

export async function main() {
  const TARGET = process.env.W311A_TARGET || 'beta/index.html';
  const OUT = process.env.W311A_OUT || path.join(ROOT, 'tests', 'out', 'corespin-w311a.json');
  const quick = process.env.W311A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: CL.LIB_VERSION, generator: 'tests/exp-w311a-corespin.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第110報)AN387 ④ 選択肢として dragCore の自転も軸方向を含めてノブ・(第113報)・DECISIONS v70 §0c ①・§1 AN397(推奨の型 —— 宣言の一定のベクトル)・決断事項 AN384(数値的に解像できない薄さの厚い殻は受理で拒否)・統括の検証項目 R226',
    coreSpinVersion: E(H, 'REL_DRAG_CORE_SPIN_VERSION'), invSqVersion: E(H, 'REL_DRAG_INVSQ_VERSION'), shellVersion: E(H, 'REL_DRAG_INVSQ_SHELL_VERSION'), versionReaders: VERSION_READERS, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w311a-corespin.mjs', 'tests/lib-w311a-corespin.mjs', 'tests/lib-w310a-shell.mjs', 'tests/lib-w309a-invsq.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第311便a', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

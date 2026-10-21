// 第312便a(原仮定者の裁定(第114報)「R_d² が惑星の質量 × 軌道の半直弦に比例すると言う結果は、距離に応じた引きずりの減衰が強すぎる可能性がある。今の引きずりが
// (r⁻³)で有れば(r⁻²)などを調査する。軸引きずりだけ違う場合や、受け側の質量が影響する場合も、可能性に含める」・決断事項 AN398・統括の検証項目 R230):
// **減衰の比較の器** —— 参照の lib で成分を 1 つずつ変えた列の**スクリーニング**(水星・金星・火星の一次の近点の式から要る R_d とその並び・木星/地球/月への外挿)と、
// **一貫した K1 の重みの opt-in のエンジン**(invSq.kernel:"k1")の照合。**スクリーニングであって法則の採用ではない**・探索の値を在位へ入れない・フィットではない。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 validatePreset・inertialDragIsqState・inertialDragIsqPointAt・
// inertialDragIsqK1・inertialDragIsqM1・inertialDragIsqThinK1・inertialDragIsqShellK1・inertialDragIsqShellM1・inertialDragInitObsState と本の入口 coord3d.makeSim・build・step を
// そのまま呼ぶ)。参照は tests/lib-w312a-decay.mjs(K_α・M_α・受け手の体積平均・近点の一次の式 —— エンジンと独立)。**在位の本の宣言は変えない**(写しは器の中で組む)。
//
// ■ 段
//   K(核): K_α・M_α(α = 1, 2 × 一様球・一様の厚い殻・薄い殻 × r/R 1.5〜10³)の閉じた式と源の直接の 3 次元の求積・動径の微分と数値の微分・内部の K1 と殻の角度の閉じた式の
//     動径の求積・エンジンの K1 の族の核の関数と lib・係数 C_α = ⟨1/K_α(t; 1)⟩(次数 8・16・閉じた式/高次)。
//   P(近点の一次の式の自己試験): 並進 β = b/r^n(n = 1, 2)・回転の枠 ω_f = c/r^k(k = 3, 4)の RK4 と一次の式。
//   S(スクリーニング): 🌡️🌋🔴 の第306便a の世代の写し(凍結の写し tests/data-w306a-decl305.json —— 第311便d の作り方・引きずりなしの t = 0 の配置)で、列ごと
//     (基準 K2・(A) 一貫した K1・(B) 回転の係数だけ r⁻³ → r⁻²・(C) 軸だけ・(D) 自己の場の質量の次数 γ = 0)に、参照の受け手の β と回転の係数から一次の式の Δϖ を
//     t_D(第311便d の正本の h/2 の実測 —— q⋆ − ΔqG)の 1 周期の分に合わせる R_d。並び(R_d/R・R_d/m・R_d²/(m p)・R_d²/p・R_d の最大/最小)・cap と観測半径の内か・
//     そろった量の規則で木星(太陽)・地球(太陽・月との対)・月(地球・太陽)への外挿・木星自身の標的(1PN + A1 − 解析の ΔqG)の一次の式が要る R_d との比。
//     一次の式の妥当性: 基準 K2 の列を第311便d の正本(段 S の見積り・水星の実測の区間の割線)と第311便の 2 段目の走行の根と照合。
//   E(エンジンの K1): ① 受理(kernel の値の表・正準形 —— "k2" と省略は同じ正準形)② 玩具の配置(外殻なし・uniform・thin × 核の自転の宣言)のエンジンと lib(β・回転・ω)
//     ③ 遠方の次数(受け手を原点・源の距離 80 → 160: β・回転の係数・軸の ω の比の log₂)④ 受け手の R_d 2 倍・質量 10 倍の β の比 ⑤ 水星の写し(第311便d の作り方 +
//     kernel:"k1")を一次の式の R_d(ミリメートルの程度)の 0.9・1・1.1 倍で: 受理・観測の初期値の分解・60 步が有限・読み口の β と一次の式の β・座標を受け手の中心へ
//     移した写しとの差(節点の位置の丸め —— 自己の場は前計算)⑥ 核の自転 = 天体の自転と軸の宣言(外殻なし)が未宣言とビット同一(読み口と 10 步)⑦ K2 の本の読み口に
//     kernel の欄が無い・"k2" の明示と省略の正準形が同じ。
//
// ■ 言わないこと: 「法則を発見した」「法則を確かめた」「フィットした」「完全に一致」。列は**スクリーニング**(一次の摂動の平均 —— β の 2 乗の項・周期の変化・軌道面の外の
//   成分を落とす)。K1 は**比較の opt-in**(在位は不変)。外挿の R_d は規則を当てた値で、木星や月の R_d を合わせた値ではない(確認の系は統合の後の器で)。
//
// ■ 使い方
//   node tests/exp-w312a-decay.mjs   → 正本 tests/out/decay-w312a.json(段 decay-312a)
//   W312A_OUT=<json> で出力先を変える(試走は正本を書かない)・W312A_TARGET=<html>(既定 beta/index.html)・W312A_QUICK=1(求積と步数を縮める —— 煙試験の窓)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as L from './lib-w312a-decay.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限)
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","saturn","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.validatePreset","REL_DRAG_INVSQ_KERNEL_VERSION","REL_DRAG_INVSQ_LAW_K1","REL_DRAG_INVSQ_VERSION","T","appStepDt","ch","ctx","inertialDragInitObsState","inertialDragIsqK1","inertialDragIsqM1","inertialDragIsqPointAt","inertialDragIsqShellK1","inertialDragIsqShellM1","inertialDragIsqState","inertialDragIsqThinK1"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w312a-decay-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (o) => JSON.parse(JSON.stringify(o));
const E = (H, name) => H.evalExpr(name);
const { dot, cross, norm, add, sub, scale, unit } = L;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const relv = (a, b) => norm(sub(a, b)) / Math.max(norm(b), 1e-300);
const r10 = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(10)) : v;
const NOT_CLAIM = ['法則を発見した', '法則を確かめた', 'フィットした', '完全に一致', '較正した', '収束した'];
export const DECL_FILE = 'tests/data-w306a-decl305.json';
export const PLANET3_OUT = 'tests/out/planet3-w311d.json';
export const AN336_REC = 'tests/data-w306a-decl305.json';
const PIN = JSON.parse(fs.readFileSync(new URL('./data-w306a-decl305.json', import.meta.url), 'utf8'));
/** 第311便の 2 段目の走行(統括 —— 3 惑星の数値の門を通った点と割線)の根 R_d/R(一次の式の照合に使う —— 正本の外の記録) */
export const STAGE2_ROOTS = Object.freeze({ mercury: 4.99079e-3, venus: 1.0797e-2, mars: 1.01108e-2 });
const EMS = 'earthMoonSunInertial3d', JUP = 'jupiterSunInertial3d', MER = 'mercurySunInertial3d';
const GM_C2 = (m) => 6.674e-11 * m / (299792458 ** 2);   // 単位の参考(G m/c² —— 表の読みだけ・計算には使わない)

/* ───────── 写し(t = 0 の配置 —— SI)───────── */
function unitsOf(q) { return { Lm: Math.pow(10, q.scaleExp.L), Tm: Math.pow(10, q.scaleExp.T), Mm: Math.pow(10, q.scaleExp.M) }; }
function simOf(HP, q) {
  const v = HP.validatePreset(clone(q));
  if (!v.ok) return { err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, preset: v.preset, warnings: v.warnings || [] };
}
/** 本の写しの t = 0(引きずりなし —— 宣言の速度)から惑星の受け手の入力(SI) */
function planetInput(HP, id, key, tD) {
  const base = Q.pinnedBook(HP, PIN, id), q = Q.bookOf(base, 'q00'), U = unitsOf(q), z = simOf(HP, q);
  if (z.err) throw new Error(id + ': ' + z.err);
  const S = z.S, G = q.physics.G * U.Lm ** 3 / (U.Mm * U.Tm ** 2);
  const X = (i) => [S.x[i] * U.Lm, S.y[i] * U.Lm, S.z[i] * U.Lm], V = (i) => [S.vx[i] * U.Lm / U.Tm, S.vy[i] * U.Lm / U.Tm, S.vz[i] * U.Lm / U.Tm];
  const r = sub(X(1), X(0)), v = sub(V(1), V(0)), mu = G * (S.m[0] + S.m[1]) * U.Mm, rn = norm(r), a = 1 / (2 / rn - dot(v, v) / mu), Lv = cross(r, v), h0 = norm(Lv), p = h0 * h0 / mu;
  return { key, id, m: S.m[1] * U.Mm, R: q.bodies[1].radius * U.Lm, p, e: Math.sqrt(Math.max(0, 1 - p / a)), a, P: 2 * Math.PI * Math.sqrt(a ** 3 / mu), mu, h0, x: X(1), nOrb: unit(Lv), tD,
    star: { x: X(0), m: S.m[0] * U.Mm, Rd: Q.CAP_M, Om: S.spin[0] / U.Tm, a: [S.sax[0], S.say[0], S.saz[0]] }, base };
}
/** 宣言の 2 体の相対の半直弦(SI)—— 外挿の入力 */
function pOf(b1, b2, G, U) {
  const r = [(b2.x - b1.x) * U.Lm, (b2.y - b1.y) * U.Lm, ((b2.z || 0) - (b1.z || 0)) * U.Lm], v = [(b2.vx - b1.vx) * U.Lm / U.Tm, (b2.vy - b1.vy) * U.Lm / U.Tm, ((b2.vz || 0) - (b1.vz || 0)) * U.Lm / U.Tm];
  const mu = G * U.Lm ** 3 / (U.Mm * U.Tm ** 2) * (b1.m + b2.m) * U.Mm, h = norm(cross(r, v));   // G は本の単位 → SI
  return h * h / mu;
}

/* ───────── 段 K(核)───────── */
export function partK(H, quick) {
  const nQ = quick ? 32 : 64, xs = [1.5, 2, 3, 10, 100, 1000], parts = [{ kind: 'ball', R: 1 }, { kind: 'thick', Ri: 0.4, Ro: 1 }, { kind: 'thin', R: 1 }];
  const quad = { 1: { K: 0, M: 0 }, 2: { K: 0, M: 0 } }, der = { 1: { K: 0, M: 0 }, 2: { K: 0, M: 0 } };
  for (const al of L.ALPHAS) for (const p of parts) for (const x of xs) {
    const Qd = L.sourceQuad(al, [x * 0.6, x * 0.8, 0], p, nQ, nQ);
    quad[al].K = Math.max(quad[al].K, rel(L.partK(al, p, x), Qd.K)); quad[al].M = Math.max(quad[al].M, rel(L.partM(al, p, x), Qd.M));
    const h = 1e-3 * (x - 1) + 1e-4;
    der[al].K = Math.max(der[al].K, rel(L.partKDr(al, p, x), L.numDr((r) => L.partK(al, p, r), x, h)));
    der[al].M = Math.max(der[al].M, rel(L.partMDr(al, p, x), L.numDr((r) => L.partM(al, p, r), x, h)));
  }
  let self1 = 0; for (const r of [0.01, 0.2, 0.5, 0.8, 0.99, 0.9999]) self1 = Math.max(self1, rel(L.Kball(1, r, 1), L.selfK1Quad(r, 1)));
  // エンジンの K1 の族の核と lib(内部・外部・殻の上・空洞)
  const B = new Float64Array(4), C = new Float64Array(4), eK1 = E(H, 'inertialDragIsqK1'), eM1 = E(H, 'inertialDragIsqM1'), eT = E(H, 'inertialDragIsqThinK1'), eSK = E(H, 'inertialDragIsqShellK1'), eSM = E(H, 'inertialDragIsqShellM1');
  let eng = 0, engD = 0, n = 0;
  const cmp = (a, b) => { eng = Math.max(eng, rel(a, b)); n++; }, cmpD = (a, b) => { engD = Math.max(engD, b === 0 ? Math.abs(a) : rel(a, b)); n++; };
  for (const r of [0.05, 0.3, 0.7, 0.999, 1, 1.001, 1.5, 3, 10, 1e3, 1e6]) {
    eK1(r, 1, B); cmp(B[0], L.Kball(1, r, 1)); cmpD(B[1], L.KballDr(1, r, 1));
    eT(r, 1, true, B); cmp(B[0], L.Kthin(1, r, 1)); cmpD(B[1], L.KthinDr(1, r, 1)); if (r > 1) { cmp(B[2], L.Mthin(1, r, 1)); cmpD(B[3], L.MthinDr(1, r, 1)); }
    if (r > 1) { eM1(r, 1, B); cmp(B[2], L.Mball(1, r, 1)); cmpD(B[3], L.MballDr(1, r, 1)); }
    const rs = r * 1.2;   // 厚い殻(R_i 0.4・R_o 1.2)—— 空洞・物質・外部
    eSK(rs, 0.4, 1.2, false, B, C); cmp(B[0], L.Kthick(1, rs, 0.4, 1.2)); cmpD(B[1], L.KthickDr(1, rs, 0.4, 1.2));
    if (rs > 1.2) { eSM(rs, 0.4, 1.2, false, B, C); cmp(B[2], L.Mthick(1, rs, 0.4, 1.2)); cmpD(B[3], L.MthickDr(1, rs, 0.4, 1.2)); }
  }
  const coef = { C1: { o8: L.coefC(1, 8), o16: L.coefC(1, 16), exact: L.coefC(1, 'exact'), closed: L.C1_CLOSED }, C2: { o8: L.coefC(2, 8), o16: L.coefC(2, 16), exact: L.coefC(2, 'exact') } };
  coef.C1.exactVsClosed = rel(coef.C1.exact, coef.C1.closed); coef.C1.o8VsExact = rel(coef.C1.o8, coef.C1.exact); coef.C2.o8VsExact = rel(coef.C2.o8, coef.C2.exact);
  return { quad, der, self1, engine: { maxRel: eng, maxRelDr: engD, n }, coef, nQuad: nQ };
}

/* ───────── 段 P(近点の一次の式の自己試験)───────── */
export function partP(quick) { const s = L.precessionSelfTest({ steps: quick ? 3000 : 8000, nOrb: quick ? 4 : 6 }); return { rows: s.rows, maxRel: s.maxRel }; }

/* ───────── 段 S(スクリーニング)───────── */
export function partS(H) {
  const HP = H.HP, P3 = JSON.parse(fs.readFileSync(path.join(ROOT, PLANET3_OUT), 'utf8'));
  const pls = Q.PLANETS.map((pl) => planetInput(HP, pl.id, pl.key, P3.T.planets[pl.key].tD['2']));
  const est311 = Object.fromEntries(P3.R.align.estimate.rows.map((z) => [z.key, z.rd])), sec311 = Object.fromEntries(P3.R.align.secant.rows.map((z) => [z.key, z.rd]));
  const cols = [];
  for (const col of L.COLUMNS) {
    const rows = pls.map((pl) => {
      const guess = col.alpha === 1 ? 1e-9 * pl.R : (est311[pl.key] || 5e-3) * pl.R;
      const z = L.screenPlanet(pl, col, guess, { order: 8 });
      return Object.assign(z, { ja: Q.planetOf(pl.key).ja, emoji: Q.planetOf(pl.key).emoji, tD: pl.tD, RdOverR: z.Rd / pl.R, gmc2: GM_C2(pl.m) });
    });
    const al = L.alignOf(rows);
    cols.push({ key: col.key, ja: col.ja, change: col.change, alpha: col.alpha, gamma: col.gamma, rotK: col.rotK, axialOnly: !!col.axialOnly, mRef: col.mRef || null, rows, align: al });
  }
  // 一次の式の妥当性(基準 K2 —— 第311便d の正本と 2 段目の根)
  const K2 = cols.find((c) => c.key === 'K2');
  const valid = K2.rows.map((z) => ({ key: z.key, rd: z.RdOverR, est311: est311[z.key] ?? null, secant311: sec311[z.key] ?? null, stage2: STAGE2_ROOTS[z.key],
    vsEst: est311[z.key] ? rel(z.RdOverR, est311[z.key]) : null, vsSecant: sec311[z.key] ? rel(z.RdOverR, sec311[z.key]) : null, vsStage2: rel(z.RdOverR, STAGE2_ROOTS[z.key]) }));
  // 外挿の入力(木星 —— 凍結の写し・地球と月 —— 🌦️ の宣言)
  const jup = planetInput(HP, JUP, 'jupiter', null), jt = AN.targetOfBook(ROOT, Q.pinnedBook(HP, PIN, JUP)), jG = Q.gLocAnalytic(Q.pinnedBook(HP, PIN, JUP), 2);
  jup.tD = jt.value - jG;
  const ems = HP.allPresets().find((q) => q.id === EMS), U = unitsOf(ems), G = ems.physics.G, [bS, bE, bM] = ems.bodies;
  const pES = pOf(bS, bE, G, U), pEM = pOf(bE, bM, G, U), pMS = pOf(bS, bM, G, U);
  const tg = [
    { key: 'jupiter', ja: '木星', around: '太陽', m: jup.m, R: jup.R, p: jup.p },
    { key: 'earth', ja: '地球', around: '太陽', m: bE.m * U.Mm, R: bE.radius * U.Lm, p: pES },
    { key: 'earth-moon', ja: '地球', around: '月(対の相対の軌道)', m: bE.m * U.Mm, R: bE.radius * U.Lm, p: pEM },
    { key: 'moon', ja: '月', around: '地球', m: bM.m * U.Mm, R: bM.radius * U.Lm, p: pEM },
    { key: 'moon-sun', ja: '月', around: '太陽', m: bM.m * U.Mm, R: bM.radius * U.Lm, p: pMS },
  ];
  for (const c of cols) {
    c.extrap = L.extrapolate(c.align, tg);
    c.extrapRdR = L.extrapolate({ ratios: c.align.ratios, best: 'RdR' }, tg);
    const e = c.extrap.find((z) => z.key === 'earth'), em = c.extrap.find((z) => z.key === 'earth-moon'), mo = c.extrap.find((z) => z.key === 'moon'), ms = c.extrap.find((z) => z.key === 'moon-sun');
    c.oneDecl = { earth: em.Rd / e.Rd, moon: ms.Rd / mo.Rd, ok: Math.abs(em.Rd / e.Rd - 1) < 1e-12 && Math.abs(ms.Rd / mo.Rd - 1) < 1e-12 };
    // 木星自身の標的の一次の式が要る R_d と外挿の比(規則を当てた値の一次の残り —— 合わせた値ではない)
    const col = L.COLUMNS.find((k) => k.key === c.key), xj = c.extrap.find((z) => z.key === 'jupiter');
    const zj = L.screenPlanet(jup, col, xj.Rd, { order: 8 });
    const zj1 = L.screenPlanet(Object.assign({}, jup, { tD: jt.pn1.value - jG }), col, xj.Rd, { order: 8 });
    c.jupiter = { RdRule: xj.Rd, RdNeed: zj.Rd, ratio: xj.Rd / zj.Rd, tD: jup.tD, RdNeed1PN: zj1.Rd, ratio1PN: xj.Rd / zj1.Rd };
  }
  return { planets: pls.map((p) => ({ key: p.key, m: p.m, R: p.R, p: p.p, e: p.e, a: p.a, P: p.P, tD: p.tD, sunOm: p.star.Om, sunAxisDotN: dot(p.star.a, p.nOrb), r0: norm(sub(p.x, p.star.x)) })),
    tDsource: PLANET3_OUT + ' の段 T(h/2 の実測 t_D = q⋆ − ΔqG)', columns: cols, valid, targets: tg, jupiterTarget: { value: jt.value, pn1: jt.pn1.value, a1: jt.a1 ? jt.a1.value : null, gLoc: jG, tD: jup.tD, tD1PN: jt.pn1.value - jG, recordId: jt.a1 ? jt.a1.recordId : null } };
}

/* ───────── 段 E(エンジンの K1)───────── */
// 遠方の次数と受け手の尺度の配置: 源の質量を受け手より小さく(受け手の自己の場が分母の大半 —— 源の場が分母に入る分は K1 では m/r で遅く減り、
//   同じ質量の源では距離 80 で次数が 1% の程度ずれる。これは法則の次数ではなく分母の源の項 —— 正本の記録 farSameMass)
export const FAR_SRC_M = 1e-3, SCALE_SRC_M = 1e-2;
function toyState(T, o = {}) {
  const F = (g) => Float64Array.from(T.map(g));
  return { n: T.length, coord3d: true, m: F((b) => b.m), x: F((b) => b.x[0]), y: F((b) => b.x[1]), z: F((b) => b.x[2]), spin: F((b) => b.Om), radOv: F((b) => b.Ro || b.Rd),
    sax: F((b) => b.a[0]), say: F((b) => b.a[1]), saz: F((b) => b.a[2]), pinned: new Uint8Array(T.length),
    relDrag: { law: 'inertial', invSq: { Wbg2: 0, order: o.order || 6, ...(o.shell ? { outerShell: o.shell } : {}), ...(o.kernel ? { kernel: o.kernel } : {}) }, pairs: 'all', history: 'positions',
      spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', axialGain: 1, axialNorm: 'diff' } },
    dragCoreD: T.map((b) => (b.md !== undefined || b.cs ? { massFrac: (b.md === undefined ? b.m : b.md) / b.m, radius: b.Rd, R: b.Ro || b.Rd, ...(b.cs || {}) } : null)), _rdPairSet: null, _rdPairN: T.length, _amKind: null, params: { G: 1, cLight: 1 } };
}
function libBodies(T, shell) {
  return T.map((b) => {
    const md = b.md === undefined ? b.m : b.md, core = { kind: 'ball', m: md, R: b.Rd };
    if (b.cs) { core.Om = b.cs.spin; core.a = b.csAxis; }
    const parts = [core];
    if (md < b.m && shell) parts.push(shell === 'thin' ? { kind: 'thin', m: b.m - md, R: b.Ro } : { kind: 'thick', m: b.m - md, Ri: b.Rd, Ro: b.Ro });
    return { x: b.x, m: b.m, Om: b.Om, a: b.a, parts };
  });
}
export function partE(H, quick, S1) {
  const HP = H.HP, st = E(H, 'inertialDragIsqState'), pAt = E(H, 'inertialDragIsqPointAt'), obs = E(H, 'inertialDragInitObsState'), out = {};
  // ① 受理
  const mer = HP.allPresets().find((q) => q.id === MER);
  const bk = (isq) => { const q = clone(mer); delete q.fitRecord; delete q.abBody; q.physics.relativeDrag = { law: 'inertial', invSq: isq, dragCoreDefault: 'cap6500km', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } }; return q; };
  const acc = [];
  for (const [k, ok, canon] of [[undefined, true, undefined], ['k2', true, undefined], ['k1', true, 'k1'], [null, true, undefined], ['k3', false], ['K1', false], [1, false], ['', false], [true, false], [['k1'], false], [{}, false]]) {
    const isq = { order: 8 }; if (k !== undefined) isq.kernel = k;
    const v = HP.validatePreset(clone(bk(isq))), m = (v.errors || []).join(' ');
    const got = v.ok ? v.preset.physics.relativeDrag.invSq.kernel : undefined;
    const pass = ok ? (v.ok && got === canon && (canon !== undefined || !('kernel' in v.preset.physics.relativeDrag.invSq))) : (!v.ok && /invSq\.kernel は "k2"/.test(m));
    acc.push({ value: k === undefined ? '(省略)' : JSON.stringify(k), accepted: !!v.ok, canonical: got === undefined ? '(鍵なし)' : got, pass });
  }
  out.accept = { rows: acc, allPass: acc.every((r) => r.pass) };
  // ② 玩具の配置のエンジンと lib(K1 と対照の K2)
  const csAx = L.unit([Math.sin(70 * Math.PI / 180) * Math.cos(20 * Math.PI / 180), Math.sin(70 * Math.PI / 180) * Math.sin(20 * Math.PI / 180), Math.cos(70 * Math.PI / 180)]);
  const toyRows = [];
  for (const shell of [null, 'uniform', 'thin']) for (const core of [false, true]) for (const kernel of ['k1', 'k2']) {
    const T = [{ x: [0, 0, 0], m: 2, md: 1.2, Rd: 0.4, Ro: 0.9, Om: 0.7, a: L.unit([0.1, 0.2, 1]) }, { x: [6, 1.5, -0.8], m: 5, md: 4, Rd: 0.5, Ro: 1.1, Om: -0.4, a: L.unit([0.3, -0.1, 1]) },
      { x: [-4, 3, 1], m: 1, Rd: 0.3, Om: 1.1, a: [0, 0, 1] }];
    if (core) { T[1].cs = { spin: -1.7, spinAxis: { tiltDeg: 70, azimuthDeg: 20 } }; T[1].csAxis = csAx; }
    const S = toyState(T, { shell, kernel: kernel === 'k1' ? 'k1' : null }), s = st(S), LB = libBodies(T, shell), al = kernel === 'k1' ? 1 : 2;
    let mb = 0, mu = 0, mo = 0;
    for (const i of [0, 1, 2]) {
      const R = L.refReceiver(LB, i, { alpha: al, order: 6, axial: true }), e = s.receivers.find((r) => r.i === i);
      for (let j = 0; j < 3; j++) if (j !== i) {
        mb = Math.max(mb, rel(e.beta[j], R.beta[j]));
        const ue = (e.coreSpinSrc && e.coreSpinSrc.find((z) => z.j === j)) ? e.coreSpinSrc.find((z) => z.j === j).uRot : cross(scale([S.sax[j], S.say[j], S.saz[j]], S.spin[j]), e.rot.slice(3 * j, 3 * j + 3));
        mu = Math.max(mu, relv(ue, R.uRot[j]));
      }
      mo = Math.max(mo, relv(e.omega, R.omega));
    }
    toyRows.push({ shell: shell || 'なし', coreSpin: core, kernel, law: s.law, kernelReadout: s.kernel ? s.kernel.key : null, beta: mb, uRot: mu, omega: mo });
  }
  out.toy = { rows: toyRows, maxBeta: Math.max(...toyRows.map((r) => r.beta)), maxURot: Math.max(...toyRows.map((r) => r.uRot)), maxOmega: Math.max(...toyRows.map((r) => r.omega)),
    lawOk: toyRows.every((r) => (r.kernel === 'k1') === (r.law === 'inv1-ball-total-ratio') && (r.kernel === 'k1') === (r.kernelReadout === 'k1')) };
  // ③ 遠方の次数(受け手を原点・源の距離 d)
  const far = [];
  for (const kernel of ['k1', 'k2']) {
    const at = (d) => { const T = [{ x: [0, 0, 0], m: 1, Rd: 1, Om: 0, a: [0, 0, 1] }, { x: [d * 0.6, d * 0.8, 0], m: FAR_SRC_M, Rd: 1, Om: 1, a: L.unit([0.3, 0.2, 1]) }];
      const e = st(toyState(T, { kernel: kernel === 'k1' ? 'k1' : null, order: 8 })).receivers.find((r) => r.i === 0); return { beta: e.beta[1], rot: norm(e.rot.slice(3, 6)), omega: norm(e.omega) }; };
    const a = at(80), b = at(160), ex = (k) => Math.log2(b[k] / a[k]);
    const want = kernel === 'k1' ? { beta: -1, rot: -2, omega: -3 } : { beta: -2, rot: -3, omega: -4 };
    far.push({ kernel, beta: ex('beta'), rot: ex('rot'), omega: ex('omega'), want, dev: Math.max(...['beta', 'rot', 'omega'].map((k) => Math.abs(ex(k) - want[k]))) });
  }
  const sameM = (kernel) => { const at = (d) => st(toyState([{ x: [0, 0, 0], m: 1, Rd: 1, Om: 0, a: [0, 0, 1] }, { x: [d * 0.6, d * 0.8, 0], m: 1, Rd: 1, Om: 1, a: L.unit([0.3, 0.2, 1]) }], { kernel: kernel === 'k1' ? 'k1' : null, order: 8 })).receivers.find((r) => r.i === 0).beta[1];
    return Math.log2(at(160) / at(80)); };
  out.far = { rows: far, maxDev: Math.max(...far.map((r) => r.dev)), srcMass: FAR_SRC_M, farSameMass: { k1: sameM('k1'), k2: sameM('k2') } };
  // ④ 受け手の R_d 2 倍・質量 10 倍(源は d = 50)
  const scl = [];
  for (const kernel of ['k1', 'k2']) {
    const b0 = (Rd, m) => st(toyState([{ x: [0, 0, 0], m, Rd, Om: 0, a: [0, 0, 1] }, { x: [30, 40, 0], m: SCALE_SRC_M, Rd: 1, Om: 0, a: [0, 0, 1] }], { kernel: kernel === 'k1' ? 'k1' : null, order: 8 })).receivers.find((r) => r.i === 0).beta[1];
    const B0 = b0(0.01, 1);
    scl.push({ kernel, rd2: b0(0.02, 1) / B0, m10: b0(0.01, 10) / B0, wantRd2: kernel === 'k1' ? 2 : 4, wantM10: 0.1 });
  }
  out.scaling = { rows: scl, maxDev: Math.max(...scl.map((r) => Math.max(rel(r.rd2, r.wantRd2), rel(r.m10, r.wantM10)))) };
  // ⑤ 水星の写し(K1・一次の式の R_d —— ミリメートルの程度)
  const K1col = S1.columns.find((c) => c.key === 'K1'), zMer = K1col.rows.find((z) => z.key === 'mercury');
  const base = Q.pinnedBook(HP, PIN, MER), R = base.bodies[1].radius, U = unitsOf(base), steps = quick ? 12 : 60, mm = [];
  const fp = (S) => { const h = crypto.createHash('sha1'); for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'sax', 'say', 'saz', 'rotA']) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer)); return h.digest('hex'); };
  const shifted = (S) => { const T = Object.create(S), c = [S.x[1], S.y[1], S.z[1]]; T.x = Float64Array.from(S.x, (v) => v - c[0]); T.y = Float64Array.from(S.y, (v) => v - c[1]); T.z = Float64Array.from(S.z, (v) => v - c[2]); return T; };
  for (const [kernel, f] of [['k1', 0.9], ['k1', 1], ['k1', 1.1], ['k2', 1]]) {
    const rdM = kernel === 'k1' ? zMer.Rd * f : S1.columns.find((c) => c.key === 'K2').rows.find((z) => z.key === 'mercury').Rd;
    const q = Q.bookOf(base, 'q01', { rd: rdM / (R * U.Lm) });
    if (kernel === 'k1') q.physics.relativeDrag.invSq.kernel = 'k1';
    const z = simOf(HP, q);
    if (z.err) { mm.push({ kernel, f, RdM: rdM, accepted: false, err: z.err }); continue; }
    const S = z.S, s0 = st(S), e0 = s0.receivers.find((r) => r.i === 1), ob = obs(S);
    const sh = st(shifted(S)).receivers.find((r) => r.i === 1), dr = st(S, { direct: true }).receivers.find((r) => r.i === 1);
    const uA = cross(scale([S.sax[0], S.say[0], S.saz[0]], S.spin[0]), e0.rot.slice(0, 3)), uB = cross(scale([S.sax[0], S.say[0], S.saz[0]], S.spin[0]), sh.rot.slice(0, 3));
    const dt = E(H, 'appStepDt')(S);
    let fin = true; for (let k = 0; k < steps; k++) { S.step(dt); if (![S.x[1], S.vx[1], S.rotA ? S.rotA[1] : 0].every(Number.isFinite)) { fin = false; break; } }
    const s1 = st(S);
    mm.push({ kernel, f, RdM: rdM, RdBook: rdM / U.Lm, accepted: true, law: s0.law, beta: e0.beta[0], betaFirstOrder: kernel === 'k1' ? zMer.beta * f : null,
      betaVsFirstOrder: kernel === 'k1' ? rel(e0.beta[0], zMer.beta * f) : null, initOk: !!(ob && ob.ok === true), initWhy: ob ? (ob.why || null) : 'no-record',
      directBeta: rel(dr.beta[0], e0.beta[0]), shiftBeta: rel(sh.beta[0], e0.beta[0]), shiftURot: relv(uB, uA), shiftOmega: relv(sh.omega, e0.omega), omegaNorm: norm(e0.omega), uRotNorm: norm(uA) * U.Lm / U.Tm,
      steps, finite: fin && s1.receivers.every((r) => r.beta.every(Number.isFinite)), badRows: s1.steps ? (S.inertialDragIsqBadRow || 0) : 0, overlap: s1.overlapSteps });
  }
  out.mercury = { rows: mm, allOk: mm.every((r) => r.accepted && r.finite && r.initOk) };
  // ⑥ 核の自転 = 天体の自転と軸(外殻なし)が未宣言とビット同一(K1)
  const cpq = (cs) => { const q = clone(mer); delete q.fitRecord; delete q.abBody;
    q.physics.relativeDrag = { law: 'inertial', invSq: { order: 8, kernel: 'k1' }, dragCoreDefault: 'cap6500km', spinDrag: { rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' } };
    q.bodies[0].dragCore = { massFrac: 1, radius: 6.5e6 / Math.pow(10, q.scaleExp.L), ...(cs || {}) }; return q; };
  const sb = mer.bodies[0], eq = { spin: sb.spin, spinAxis: { tiltDeg: sb.spinAxis.tiltDeg, azimuthDeg: sb.spinAxis.azimuthDeg } };
  const A1 = simOf(HP, cpq(null)).S, B1 = simOf(HP, cpq(eq)).S, pick = (s) => JSON.stringify(s.receivers.map((r) => [r.beta, r.rot, r.omega]));
  const rbs = pick(st(A1)) === pick(st(B1)), dtc = E(H, 'appStepDt')(A1);
  for (let k = 0; k < 10; k++) { A1.step(dtc); B1.step(dtc); }
  out.coreSpin = { readoutBitSame: rbs, run10BitSame: fp(A1) === fp(B1), hasCoreSpinReadout: !!st(B1).coreSpin };
  // ⑦ K2 の本の読み口と正準形
  const vA = HP.validatePreset(clone(bk({ order: 8 }))), vB = HP.validatePreset(clone(bk({ order: 8, kernel: 'k2' })));
  const sA = simOf(HP, bk({ order: 8 })).S, sK2 = st(sA);
  out.k2 = { canonicalSame: JSON.stringify(vA.preset.physics.relativeDrag) === JSON.stringify(vB.preset.physics.relativeDrag), readoutHasKernel: 'kernel' in sK2, law: sK2.law,
    pointAtHasKernel: 'kernel' in pAt(sA, 1, sA.x[1], sA.y[1], sA.z[1]) };
  const sK1 = simOf(HP, bk({ order: 8, kernel: 'k1' })).S, pk1 = pAt(sK1, 1, sK1.x[1], sK1.y[1], sK1.z[1]);
  out.k1PointAt = { kernel: pk1.kernel || null, K: pk1.terms[0].K, Kexpected: 1 / pk1.terms[0].r, rel: rel(pk1.terms[0].K, 1 / pk1.terms[0].r) };
  return out;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const S = J.S, K2 = S.columns.find((c) => c.key === 'K2'), K1 = S.columns.find((c) => c.key === 'K1'), D = S.columns.find((c) => c.key === 'massD');
  return {
    kernelsVsQuad: Math.max(J.K.quad[1].K, J.K.quad[1].M, J.K.quad[2].K, J.K.quad[2].M) < 1e-11,
    kernelsDerivative: Math.max(J.K.der[1].K, J.K.der[1].M, J.K.der[2].K, J.K.der[2].M) < 1e-8,
    selfK1: J.K.self1 < 1e-13,
    engineKernelsVsLib: J.K.engine.maxRel < 1e-14 && J.K.engine.maxRelDr < 1e-14,
    coefClosed: J.K.coef.C1.exactVsClosed < 1e-13,
    precessionSelfTest: J.P.maxRel < 1e-3,
    screenFixedPoint: S.columns.every((c) => c.rows.every((z) => z.fixRes < 1e-9 && Number.isFinite(z.Rd) && z.Rd > 0)),
    firstOrderVsEngine311: S.valid.every((v) => v.vsStage2 < 1e-3 && (v.vsEst === null || v.vsEst < 1e-4) && (v.vsSecant === null || v.vsSecant < 1e-4)),
    k2AlignsRd2mp: K2.align.best === 'Rd2mp',
    k1AlignsRdm: K1.align.best === 'Rdm',
    massDAlignsRd2p: D.align.best === 'Rd2p',
    acceptance: J.E.accept.allPass,
    engineVsLibToy: J.E.toy.maxBeta < 1e-12 && J.E.toy.maxURot < 1e-12 && J.E.toy.maxOmega < 1e-11 && J.E.toy.lawOk,
    farOrders: J.E.far.maxDev < 1e-2,
    scaling: J.E.scaling.maxDev < 1e-3,
    mercuryK1: J.E.mercury.allOk,
    mercuryK1BetaFirstOrder: J.E.mercury.rows.filter((r) => r.kernel === 'k1').every((r) => r.betaVsFirstOrder < 1e-6),
    mercuryShiftBeta: J.E.mercury.rows.every((r) => r.shiftBeta < 1e-9 && r.shiftURot < 1e-9),
    coreSpinBitSame: J.E.coreSpin.readoutBitSame && J.E.coreSpin.run10BitSame && J.E.coreSpin.hasCoreSpinReadout,
    k2Unchanged: J.E.k2.canonicalSame && !J.E.k2.readoutHasKernel && !J.E.k2.pointAtHasKernel && J.E.k2.law === 'invsq-ball-total-ratio',
    k1PointAt: !!J.E.k1PointAt.kernel && J.E.k1PointAt.rel < 1e-12,
  };
}

/* ───────── 文書の表と数(PHYSICS〔第312便a〕—— QA docs.decay312 が正本から作り直して逐語で照合する)───────── */
const e2 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toExponential(2);
const e3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toExponential(3);
const f3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : Number(v).toFixed(3);
const fl = (v, floor = 1e-12) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : (Math.abs(v) < floor ? '< ' + Number(floor).toExponential(0) : Number(v).toExponential(2)));
const km = (m) => (m >= 1e3 ? (m / 1e3).toPrecision(4) + ' km' : m >= 1 ? m.toPrecision(4) + ' m' : m >= 1e-6 ? (m * 1e3).toPrecision(4) + ' mm' : m.toExponential(2) + ' m');
const RJA = { RdR: 'R_d/R', Rdm: 'R_d/m', Rd2mp: 'R_d²/(m p)', Rd2p: 'R_d²/p', Rd: 'R_d' };
export function physicsTables(J) {
  const out = [], S = J.S;
  out.push('| 照合 | 値 |', '|---|---|');
  out.push(`| K_α・M_α(α = 1・2 × 球・厚い殻・薄い殻 × r/R 1.5〜10³)の閉じた式と源の直接の 3 次元の求積の相対の差の最大(K1・M1 / K2・M2) | ${fl(Math.max(J.K.quad[1].K, J.K.quad[1].M))} / ${fl(Math.max(J.K.quad[2].K, J.K.quad[2].M))} |`);
  out.push(`| 動径の微分と数値の微分の相対の差の最大(K1 の族 / K2 の族) | ${fl(Math.max(J.K.der[1].K, J.K.der[1].M), 1e-10)} / ${fl(Math.max(J.K.der[2].K, J.K.der[2].M), 1e-10)} |`);
  out.push(`| 内部の K1 と殻の角度の閉じた式の動径の求積の相対の差の最大 | ${fl(J.K.self1, 1e-13)} |`);
  out.push(`| エンジンの K1 の族の核(K1・M1・薄い殻・厚い殻)と lib の相対の差の最大(値・動径の微分) | ${fl(J.K.engine.maxRel, 1e-13)}・${fl(J.K.engine.maxRelDr, 1e-13)} |`);
  out.push(`| 係数 C₁ = ⟨1/K1(t; 1)⟩(次数 8・高次)・C₂ = ⟨1/K2(t; 1)⟩(次数 8・高次) | ${J.K.coef.C1.o8.toFixed(6)}・${J.K.coef.C1.exact.toFixed(6)}・${J.K.coef.C2.o8.toFixed(6)}・${J.K.coef.C2.exact.toFixed(6)} |`);
  out.push(`| C₁ の高次の求積と閉じた式 6[−1 + (√3/2) ln(2 + √3)] の相対の差 | ${fl(J.K.coef.C1.exactVsClosed, 1e-13)} |`);
  out.push(`| 近点の一次の式と RK4(並進 n = 1・2・回転の枠 k = 3・4 × e 0.05〜0.4)の相対の差の最大 | ${e2(J.P.maxRel)} |`);
  out.push(`| 受理の表(kernel の値 —— "k2" と省略は同じ正準形・未知の値は拒否) | ${J.E.accept.rows.filter((r) => r.pass).length}/${J.E.accept.rows.length} |`);
  out.push(`| 玩具の配置(外殻なし・uniform・thin × 核の自転 × K1・K2)のエンジンと lib の相対の差の最大(β・u_rot・ω) | ${fl(J.E.toy.maxBeta, 1e-13)}・${fl(J.E.toy.maxURot, 1e-13)}・${fl(J.E.toy.maxOmega, 1e-13)} |`);
  out.push(`| 核の自転 = 天体の自転と軸(外殻なし・K1)の読み口と 10 步 | ${J.E.coreSpin.readoutBitSame && J.E.coreSpin.run10BitSame ? 'ビット同一' : '違う'} |`);
  out.push('', '| 遠方の次数(源の距離 80 → 160 の比の log₂) | β | 回転の係数 | 軸の ω |', '|---|---|---|---|');
  for (const r of J.E.far.rows) out.push(`| ${r.kernel === 'k1' ? 'K1(期待 −1・−2・−3)' : 'K2(期待 −2・−3・−4)'} | ${r.beta.toFixed(4)} | ${r.rot.toFixed(4)} | ${r.omega.toFixed(4)} |`);
  out.push('', '| 受け手を変えた β の比(源の距離 50) | R_d 2 倍 | 質量 10 倍 |', '|---|---|---|');
  for (const r of J.E.scaling.rows) out.push(`| ${r.kernel === 'k1' ? 'K1' : 'K2'} | ${f3(r.rd2)} | ${f3(r.m10)} |`);
  out.push('', '| 列(一度に 1 つだけ変える) | 🌡️ 水星の R_d | 🌋 金星 | 🔴 火星 | そろう量(最大/最小) | R_d/R の最大/最小 | 回転/並進(水星) |', '|---|---|---|---|---|---|---|');
  for (const c of S.columns) {
    const z = (k) => c.rows.find((q) => q.key === k);
    out.push(`| ${c.ja} | ${km(z('mercury').Rd)} | ${km(z('venus').Rd)} | ${km(z('mars').Rd)} | ${RJA[c.align.best]}(${c.align.bestSpread.toFixed(5)}) | ${c.align.ratios.RdR.spread.toFixed(3)} | ${e2(z('mercury').rotOverTrans)} |`);
  }
  out.push('', '| 列 | R_d/R(水星・金星・火星) | R_d/m [m/kg] | R_d²/(m p) [m/kg] | R_d²/p [m] |', '|---|---|---|---|---|');
  for (const c of S.columns) { const r = c.align.ratios; out.push(`| ${c.key} | ${r.RdR.values.map(e3).join('・')} | ${r.Rdm.values.map(e3).join('・')} | ${r.Rd2mp.values.map(e3).join('・')} | ${r.Rd2p.values.map(e3).join('・')} |`); }
  out.push('', '| 一次の式の妥当性(基準 K2 の列の R_d/R) | 一次の式 | 第311便d の見積り | 第311便の 2 段目の根 | 相対の差(見積り・根) |', '|---|---|---|---|---|');
  for (const v of S.valid) out.push(`| ${Q.planetOf(v.key).emoji} ${Q.planetOf(v.key).ja} | ${v.rd.toExponential(5)} | ${v.est311 === null ? '—' : v.est311.toExponential(5)} | ${v.stage2.toExponential(5)} | ${e2(v.vsEst)}・${e2(v.vsStage2)} |`);
  out.push('', '| 外挿(そろった量の規則 —— 3 惑星の幾何平均) | 木星(太陽) | 地球(太陽) | 地球(月との対) | 月(地球) | 月(太陽) | 1 天体 1 宣言 | 木星の規則/要る R_d(1PN + A1・1PN だけ) |', '|---|---|---|---|---|---|---|---|');
  for (const c of S.columns) { const x = (k) => c.extrap.find((z) => z.key === k); out.push(`| ${c.key}(${RJA[c.align.best]}) | ${km(x('jupiter').Rd)} | ${km(x('earth').Rd)} | ${km(x('earth-moon').Rd)} | ${km(x('moon').Rd)} | ${km(x('moon-sun').Rd)} | ${c.oneDecl.ok ? '同じ値' : '対ごとに違う(地球 ' + c.oneDecl.earth.toFixed(4) + '・月 ' + c.oneDecl.moon.toFixed(3) + ' 倍)'} | ${c.jupiter.ratio.toFixed(4)}・${c.jupiter.ratio1PN.toFixed(4)} |`); }
  out.push('', '| ☿ の写し(新則・kernel) | R_d | 受理・分解 | β(☿ ← ☉) | β の一次の式との差 | 受け手の中心へ移した写しとの差(β・u_rot・ω) | 自己の場を節点の座標の差で作る今の経路との β の差 | ' + J.E.mercury.rows[0].steps + ' 步 |', '|---|---|---|---|---|---|---|---|');
  for (const r of J.E.mercury.rows) out.push(`| ${r.kernel === 'k1' ? 'K1 × ' + r.f : 'K2(対照)'} | ${km(r.RdM)} | ${r.accepted ? '受理' : '拒否'}・${r.initOk ? '分解した' : '分解しない'} | ${e3(r.beta)} | ${r.betaVsFirstOrder === null ? '—' : fl(r.betaVsFirstOrder, 1e-12)} | ${fl(r.shiftBeta, 1e-13)}・${fl(r.shiftURot, 1e-13)}・${fl(r.shiftOmega, 1e-13)} | ${fl(r.directBeta, 1e-13)} | ${r.finite ? '有限' : '非有限'} |`);
  return out.join('\n');
}
export function docNumbers(J) {
  const S = J.S, c = (k) => S.columns.find((q) => q.key === k), z = (col, k) => c(col).rows.find((q) => q.key === k);
  return [J.K.coef.C1.o8.toFixed(6), J.K.coef.C2.o8.toFixed(6), km(z('K1', 'mercury').Rd), km(z('K2', 'mercury').Rd), c('K2').align.ratios.Rd2mp.gmean.toExponential(3), c('K1').align.ratios.Rdm.gmean.toExponential(3),
    c('K1').align.bestSpread.toFixed(5), c('K2').align.bestSpread.toFixed(5), c('K2').align.ratios.RdR.spread.toFixed(3), c('K1').align.ratios.RdR.spread.toFixed(3)];
}

export function runAll(H, o = {}) {
  const quick = !!o.quick, t = {};
  let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const K = partK(H, quick); tick('K');
  const P = partP(quick); tick('P');
  const S = partS(H); tick('S');
  const Ev = partE(H, quick, S); tick('E');
  const J = { quick, K, P, S, E: Ev };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}

// 受理器・新則の核を読む既存の器・正本の扱い(第312便a の枝で scratch で走らせた —— 報告に結果)
export const VERSION_READERS = [
  { file: 'tests/exp-w309a-invsq.mjs・exp-w310a-invsq.mjs(正本 invsq-w309a.json・invsq-w310a.json)', reads: 'invSq の受理と K2 の核・読み口', handling: 'kernel を宣言しない —— K2 の経路は 1 字も変えていない(正本の値は不変 —— scratch で照合)' },
  { file: 'tests/exp-w310d-mdsweep.mjs・exp-w311a-corespin.mjs・exp-w311b-galaxial.mjs・exp-w311d-planet3.mjs', reads: '新則の写し(K2)', handling: '同上(段の値は鎖が領域で判定)' },
];

export async function main() {
  const TARGET = process.env.W312A_TARGET || 'beta/index.html';
  const OUT = process.env.W312A_OUT || path.join(ROOT, 'tests', 'out', 'decay-w312a.json');
  const quick = process.env.W312A_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const R = runAll(H, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w312a-decay.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第114報)AN398 —— R_d² が惑星の質量 × 軌道の半直弦に比例する結果は、距離に応じた引きずりの減衰が強すぎる可能性(r⁻³ なら r⁻² などを調査・軸引きずりだけ違う場合・受け側の質量が影響する場合も)・決断事項 AN398・統括の検証項目 R230',
    kernelVersion: E(H, 'REL_DRAG_INVSQ_KERNEL_VERSION'), invSqVersion: E(H, 'REL_DRAG_INVSQ_VERSION'), lawK1: E(H, 'REL_DRAG_INVSQ_LAW_K1'), versionReaders: VERSION_READERS, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w312a-decay.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w306a-an336.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第312便a', target: TARGET, code: CODE, inputs: [TARGET, DECL_FILE, PLANET3_OUT] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

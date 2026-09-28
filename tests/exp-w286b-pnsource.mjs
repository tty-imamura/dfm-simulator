// 第286便b(原仮定者の裁定(第76報)AN54・AN59・統括の検証項目 R104)—— **kF0 較正の正式判定便の器**
//   (伴星の pnSource 宣言・cLight の真値化・☄️ の較正専用 ε の前後を、判定器と同じ抽出で測る。**判定はしない** ——
//    正式判定は鎖の calaudit〔3σ 門〕だけが付ける)。
//
// ■ 何を測るか(Node だけ —— 対象 html と基点 html の inline script を tests/lib-w279b-headless.mjs で読み、物理コードは html の本文そのまま)
//   (P) 伴星の pnSource(AN54): ✴️ alphaCenABDFM・💫 siriusABDFM・✨ alphaCenAB・🌟 siriusAB の近点増分(λ_PN=1 − λ_PN=0・検出器 B・8 周・dt 0.016)
//       を GR の主次数 6πGM/(c²a(1−e²))(同じ走行の c・接触要素)で割った比。kF0(calaudit の `__w249build(id, true)` の規則 ——
//       ✨🌟 は本そのもの)と DFM 版(✴️💫 の本そのもの —— kFrame=1・geoPN=2)の両方。3 本立て:
//         before = 基点 html(伴星は源でない・c=3×10⁴)/ srcOff = 現行 html の伴星だけ pnSource を外した写し(c は真値)/ after = 現行 html。
//       before→srcOff が **cLight の真値化だけ**の差・srcOff→after が **伴星の宣言だけ**の差(要因を分ける)。
//   (Q) 制御二体(R97 の条件: G=1・M=10・a=10・e=0.3・c=100・ε=0.01・dt 0.01・8 周・検出器 B)で、質量比 q=1・✴️ の 0.8428・💫 の 0.4935 を
//       **両方源**と**主星だけ源**で(伴星を源にしないと比が 1 から外れる大きさの照合先 —— 観測値を使わない)。
//   (C) cLight の真値化(AN59): ☄️ mercuryReal の λ=1・λ=0 の近点移動(ε 0.05・dt 0.016・8 周)を基点 html と現行 html で。
//       1PN の増分の比が (30000/29979.2458)² = 1.001385 に一致するか(λ 増分の比 —— 軟化・刻みの逆行は λ=0 の基線に入る)。
//   (E) ☄️ の較正専用 ε(AN59・第285便b の F 表の続き): 現行 html(c 真値)で ε 0.05/0.01 × dt 0.016/0.008 × λ 0/1。
//       要因を分ける: c(ε 0.05・dt 0.016 の基点→現行)/ ε(現行・dt 0.016 の 0.05→0.01)/ dt(現行・ε 0.01 の 0.016→0.008)。
//       観測(正本 calaudit-w249.json の近点移動の obs)との相対残差を**並べるだけ**(判定しない —— 較正行の判定は鎖の calaudit)。
//   (K) cLight の従属値の一覧 `tests/data-w286b-clight.json` と html の照合(c=c_SI·10^(T−L)・κ=G/c² —— 相対 1e−12)・丸めが残る箇所の数。
//   (G) 前後: 内蔵全本を基点 html と現行 html で 1 歩と 32 歩(dt=DT)走らせ、位置・速度・自転をビットで比べる。署名(presetSig)も。
//       違う本 ⊆ 宣言を変えた本(cLight の 51 本 ∪ 伴星の 4 本)であること。Chromium の 600 歩の器 tests/exp-w258c-bitsame.mjs は統合の手順。
//
// ■ 測定演算子: 近点移動は正式の判定器 `tests/exp-w249b-calaudit.mjs` のページ側ヘルパ(近点抽出 A/B・近点位相の直線 fit)を
//   **ソースの文字列のまま**取り出して評価する(`extractCalauditHelpers` —— 写しを持たない)。ヘルパの較正行の窓口
//   (window.__w249calPhys)はこの器では置かない(ε は (E) で明示して振る)。
//
// ■ 言わないこと: 「λ_PN=1 で観測と合った」「f=1 で合った」「較正を完了した」「観測一致を達成した」「判定が増えた」。
//   Δϖ(deg/周)と ω̇(deg/年)を混同しない(この器は deg/周だけ)。λ=1−λ=0 の増分の一致と λ=1 の実軌道の観測一致は別。
//
// 環境変数: `W286B_BASE_REV`(基点の版 —— 既定 7822768)/ `W286B_BASE_HTML`(基点 html を既に持っているときのパス・ROOT 相対)/
//   `QA_TARGET`(対象 html —— 既定 beta/index.html)/ `W286B_OUT`(任意 —— 正本以外へ書く試走)。
//   読む正本: tests/out/calaudit-w249.json(観測の近点移動)・tests/out/pn1-w285b.json(第285便b の (E) の比 —— 記録の照合)。
// 実行: node tests/exp-w286b-pnsource.mjs
// 出力: tests/out/pnsource-w286b.json(来歴 w272e-1・領域 hash つき)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { extractCalauditHelpers } from './lib-w280a-mercury.mjs';
import * as G1 from './lib-w282b-geo1.mjs';
import * as L283 from './lib-w283a-geomode.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の規約: この器が読む html の領域(1 行の JSON —— `lint.regenScope` が機械の下限と照合する)
const REGEN_SCOPE = {"presets":"all","roots":["ASTRO_COMMON","CAL_CONTRACT","DEFAULT_PHYSICS","DT","HP.allPresets","HP.coreState","HP.loadPreset","HP.sim","HP.validatePreset","dfmPN1Delta","dfmPN1EIHKick","geoCoreDispatch","pnSource","presetSig","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = process.env.W286B_OUT ? path.resolve(ROOT, process.env.W286B_OUT) : path.join(ROOT, 'tests', 'out', 'pnsource-w286b.json');
const CALAUDIT = 'tests/exp-w249b-calaudit.mjs';
const CAL_JSON = 'tests/out/calaudit-w249.json';
const PN1_JSON = 'tests/out/pn1-w285b.json';
const CLIGHT_JSON = 'tests/data-w286b-clight.json';
export const HARNESS_VERSION = 'w286b-pnsource-1';
const BASE_REV = process.env.W286B_BASE_REV || '7822768';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
const t0 = Date.now();
const log = (...a) => console.error('[w286b]', ((Date.now() - t0) / 1000).toFixed(0) + 's', ...a);
const J = (o) => JSON.stringify(o);
const DEG = 180 / Math.PI;
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
const C_SI = 299792458;

// ---------------------------------------------------------------- 文脈(現行 HN と基点 HB)
const htmlAbs = path.join(ROOT, TARGET);
let baseAbs, tmpDir = null;
if (process.env.W286B_BASE_HTML) baseAbs = path.join(ROOT, process.env.W286B_BASE_HTML);
else {
  tmpDir = fs.mkdtempSync(path.join(ROOT, 'tests', 'out', '.w286b-pnsource-'));
  baseAbs = path.join(tmpDir, 'base.html');
  fs.writeFileSync(baseAbs, execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':beta/index.html'], { maxBuffer: 64 << 20 }));
}
const baseSha = sha(baseAbs), nowSha = sha(htmlAbs);
const HN = loadHtmlHeadless(htmlAbs);
const HB = loadHtmlHeadless(baseAbs);
if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
if (!HN.HP || !HB.HP) throw new Error('HP が無い');
const DT = HN.evalExpr('DT');
const calSrc = fs.readFileSync(path.join(ROOT, CALAUDIT), 'utf8');
const helperBody = extractCalauditHelpers(calSrc);
const PERI_WINDOW = Number((calSrc.match(/const PERI_WINDOW = (\d+);/) || [])[1]);
const HOOK = `(function(){
  const ORIG = window.__w249build;
  window.__w286bVariants = {};
  window.__w249build = (id, kFrame0) => {
    const V = window.__w286bVariants[id];
    if (!V) return ORIG(id, kFrame0);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(V)));
    if (!v.ok) throw new Error('器の中の宇宙が受理されない: ' + id + ' / ' + JSON.stringify(v.errors || ''));
    HP.sim.build(v.preset);
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset), kFrameApplied: (v.preset.physics || {}).kFrame };
  };
  // 内蔵の写し(kFrame0 が true なら calaudit の kF0 の診断コピーの規則そのもの: kFrame=0・geoPN 2→1)
  window.__w286bCopy = (id, kFrame0) => { const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (kFrame0 === true) { p.physics = p.physics || {}; p.physics.kFrame = 0; if (p.physics.geoPN === 2) p.physics.geoPN = 1; }
    return p; };
})()`;
for (const H of [HN, HB]) { H.evalExpr('(function(PERI_WINDOW){' + helperBody + '})(' + PERI_WINDOW + ')'); H.evalExpr(HOOK); }
const runPeri = (H, p, dt, orbMax) => {
  H.evalExpr(`window.__w286bVariants[${J(p.id)}] = ${J(p)};`);
  const b0 = H.evalExpr(`window.__w249build(${J(p.id)}, false)`);
  const Gv = H.evalExpr('HP.sim.params.G'), c = H.evalExpr('HP.sim.params.cLight'), eps = H.evalExpr('HP.sim.params.softening');
  const nSrc = H.evalExpr('(()=>{ const S=HP.sim; let k=0; for(let i=0;i<S.n;i++) if(pnSource(S,i)) k++; return k; })()');
  const tg = [{ ci: b0.map[0], oi: b0.map[1], label: p.id }];
  const osc0 = H.evalExpr(`window.__w249osc0(${tg[0].ci}, ${tg[0].oi}, ${Gv})`);
  const maxSteps = Math.ceil((orbMax + 1.5) * osc0.P / dt);
  const r = H.evalExpr(`window.__w249run(${J(p.id)}, ${dt}, ${maxSteps}, ${J(tg)}, ${orbMax}, ${Gv}, false)`);
  const t = r.targets[0];
  return { B: t.B.slopeDeg, A: t.A.slopeDeg, nB: t.B.nPeri, nan: r.nan, clamp: r.clamp, steps: r.steps, c, eps, nSrc,
    osc0: { a: osc0.a, e: osc0.e, P: osc0.P, mu: osc0.mu },
    grDeg: DEG * G1.gr1pnAdvanceRad({ GM: osc0.mu, c, a: osc0.a, e: osc0.e }) };
};
const variant = (p, id, o) => { const q = JSON.parse(J(p)); q.id = id; q.physics = Object.assign({}, q.physics, o.physics || {});
  if (o.companionOff) { delete q.bodies[1].pnSource; }
  return q; };
const lamPair = (H, p, tag, dt, orb, extra) => {
  const e = extra || {};
  const r1 = runPeri(H, variant(p, tag + '_l1', { physics: Object.assign({ lambdaPN: 1 }, e.physics || {}), companionOff: e.companionOff }), dt, orb);
  const r0 = runPeri(H, variant(p, tag + '_l0', { physics: Object.assign({ lambdaPN: 0 }, e.physics || {}), companionOff: e.companionOff }), dt, orb);
  return { lam1B: r1.B, lam0B: r0.B, incB: r1.B - r0.B, grDeg: r0.grDeg, ratio: (r1.B - r0.B) / r0.grDeg, c: r0.c, eps: r0.eps,
    nSources: r1.nSrc, e: r0.osc0.e, a: r0.osc0.a, P: r0.osc0.P, nPeri: r1.nB, nan: r1.nan || r0.nan, clamp: r1.clamp + r0.clamp, steps: r1.steps + r0.steps };
};

// ---------------------------------------------------------------- 読む正本
const cal = JSON.parse(fs.readFileSync(path.join(ROOT, CAL_JSON), 'utf8'));
const obsPrec = (id) => { const p = (cal.presets || []).find((z) => z.id === id);
  const q = p && (p.quantities || []).find((z) => z.kind === 'precession' && z.unit === 'deg/orbit' && typeof z.obs === 'number');
  return q ? q.obs : null; };
const pn1 = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, PN1_JSON), 'utf8')); } catch (e) { return null; } })();
const pn1Ratio = (id) => { const r = pn1 && pn1.E && (pn1.E.rows || []).find((z) => z.id === id); return r ? { ratioNow: r.ratioNow, nSources: r.nSources, orbits: r.orbits } : null; };

// ---------------------------------------------------------------- (P) 伴星の pnSource
const P = { cond: { dt: 0.016, orbits: 8, detector: 'B', window: '判定器の近点位相の直線 fit(ページ側ヘルパの文字列のまま)' }, rows: [] };
{
  const LIST = [
    { id: 'alphaCenABDFM', modes: ['kf0', 'dfm'] }, { id: 'siriusABDFM', modes: ['kf0', 'dfm'] },
    { id: 'alphaCenAB', modes: ['kf0'] }, { id: 'siriusAB', modes: ['kf0'] }];
  for (const L of LIST) for (const mode of L.modes) {
    const kf0 = mode === 'kf0';
    const pN = HN.evalExpr(`window.__w286bCopy(${J(L.id)}, ${kf0})`), pB = HB.evalExpr(`window.__w286bCopy(${J(L.id)}, ${kf0})`);
    const tag = 'w286b_' + L.id + '_' + mode;
    const before = lamPair(HB, pB, tag + '_b', P.cond.dt, P.cond.orbits);
    const srcOff = lamPair(HN, pN, tag + '_off', P.cond.dt, P.cond.orbits, { companionOff: true });
    const after = lamPair(HN, pN, tag + '_n', P.cond.dt, P.cond.orbits);
    const decl = { base: pB.bodies.map((b) => b.pnSource === true), now: pN.bodies.map((b) => b.pnSource === true),
      massSame: pB.bodies.every((b, i) => b.m === pN.bodies[i].m), physics: { kFrame: pN.physics.kFrame, geoPN: pN.physics.geoPN } };
    // 分解能の目安: 比は同じ走行の c で割るので、c の真値化(before→srcOff)は比を GM/(ac²) の次数でしか動かさない。
    //   この差が 10⁻² を超える行は、λ 増分が近点移動の値そのもの(DFM 版は引きずりの +0.89°/周 級)に対して抽出の分解能の下にある(比が定まらない)
    const resolution = Math.abs(srcOff.ratio - before.ratio);
    const row = { id: L.id, emoji: pN.emoji, mode, decl, before, srcOff, after,
      effect: { cLight: srcOff.ratio - before.ratio, companion: after.ratio - srcOff.ratio, total: after.ratio - before.ratio },
      resolution, resolved: resolution <= 1e-2, incOverValue: after.incB / Math.abs(after.lam1B),
      pn1Record: kf0 ? pn1Ratio(L.id) : null };
    P.rows.push(row);
    log(`(P) ${row.emoji} ${L.id} ${mode}: 比 ${before.ratio.toFixed(5)}(基点・源 ${before.nSources})→ ${srcOff.ratio.toFixed(5)}(c 真値・伴星外し)→ ${after.ratio.toFixed(5)}(源 ${after.nSources})`
      + `・分解能の目安 ${resolution.toExponential(2)}${row.resolved ? '' : '(比が定まらない)'}・増分/値 ${row.incOverValue.toExponential(2)}`);
  }
}

// ---------------------------------------------------------------- (Q) 制御二体(両方源 / 主星だけ源)
const Q = { cond: { G: 1, M: 10, a: 10, e: 0.3, c: 100, eps: 0.01, dt: 0.01, orbits: 8, detector: 'B' }, rows: [] };
{
  const C = Q.cond;
  for (const [label, q] of [['q=1', 1], ['✴️ の質量比', 18.079442 / 21.451938], ['💫 の質量比', 20.24293 / 41.022755]]) {
    const m1 = C.M / (1 + q), m2 = C.M * q / (1 + q);
    const mk = (both) => { const p = G1.boundBinary({ id: 'w286b_ctl_' + String(q).slice(0, 6).replace('.', 'p') + (both ? '_both' : '_one'), m1, m2, a: C.a, e: C.e, G: C.G, geoPN: 1,
      physics: { cLight: C.c, softening: C.eps, softeningFloor: C.eps } });
      if (!both) delete p.bodies[1].pnSource;
      return p; };
    const both = lamPair(HN, mk(true), 'w286b_ctlb_' + label, C.dt, C.orbits), one = lamPair(HN, mk(false), 'w286b_ctlo_' + label, C.dt, C.orbits);
    const oneBase = lamPair(HB, mk(false), 'w286b_ctlob_' + label, C.dt, C.orbits);
    Q.rows.push({ label, q, nu: m1 * m2 / (C.M * C.M), both: both.ratio, primaryOnly: one.ratio, primaryOnlyBase: oneBase.ratio, nSources: [both.nSources, one.nSources],
      nan: both.nan || one.nan });
    log(`(Q) 制御二体 ${label}(ν=${(m1 * m2 / 100).toFixed(4)}): 両方源 ${both.ratio.toFixed(5)}・主星だけ ${one.ratio.toFixed(5)}(基点 html ${oneBase.ratio.toFixed(5)})`);
  }
}

// ---------------------------------------------------------------- (C)(E) ☄️ の cLight と較正専用 ε
const M = { cond: { orbits: 8, detector: 'B', note: 'mercuryReal(太陽は pinned —— 源 1 つ)。λ 増分は 1PN・λ=0 の基線は軟化と刻み' }, grid: [] };
{
  const pN = HN.evalExpr(`window.__w286bCopy('mercuryReal', false)`), pB = HB.evalExpr(`window.__w286bCopy('mercuryReal', false)`);
  const obs = obsPrec('mercuryReal');
  const cell = (H, p, html, eps, dt) => { const r = lamPair(H, p, `w286b_merc_${html}_${eps}_${dt}`, dt, M.cond.orbits, { physics: { softening: eps } });
    return Object.assign({ html, eps, dt, residLam1: obs ? (r.lam1B - obs) / obs : null }, r); };
  M.grid.push(cell(HB, pB, 'base', 0.05, 0.016));
  for (const eps of [0.05, 0.01]) for (const dt of [0.016, 0.008]) M.grid.push(cell(HN, pN, 'now', eps, dt));
  const at = (html, eps, dt) => M.grid.find((z) => z.html === html && z.eps === eps && z.dt === dt);
  const b = at('base', 0.05, 0.016), n = at('now', 0.05, 0.016), e1 = at('now', 0.01, 0.016), e2 = at('now', 0.01, 0.008);
  const expect = (30000 / 29979.2458) ** 2;
  M.obs = obs; M.obsFrom = obs ? CAL_JSON + ' の mercuryReal 近点移動の obs' : null;
  M.cLight = { cBefore: b.c, cAfter: n.c, incRatio: n.incB / b.incB, expected: expect, relToExpected: n.incB / b.incB / expect - 1,
    lam0Same: b.lam0B === n.lam0B, lam0Rel: n.lam0B / b.lam0B - 1, grRatioBefore: b.ratio, grRatioAfter: n.ratio,
    lam1Before: b.lam1B, lam1After: n.lam1B, residBefore: b.residLam1, residAfter: n.residLam1 };
  M.factors = [
    { key: 'cLight', from: 'base ε0.05 dt0.016', to: 'now ε0.05 dt0.016', dLam1: n.lam1B - b.lam1B, dLam0: n.lam0B - b.lam0B, dInc: n.incB - b.incB },
    { key: 'epsilon', from: 'now ε0.05 dt0.016', to: 'now ε0.01 dt0.016', dLam1: e1.lam1B - n.lam1B, dLam0: e1.lam0B - n.lam0B, dInc: e1.incB - n.incB },
    { key: 'dt', from: 'now ε0.01 dt0.016', to: 'now ε0.01 dt0.008', dLam1: e2.lam1B - e1.lam1B, dLam0: e2.lam0B - e1.lam0B, dInc: e2.incB - e1.incB }];
  M.calibrationRow = { declared: { softening: 0.01 }, where: CALAUDIT + ' の CFG.mercuryReal.calPhysics(判定器の写しにだけ当てる)',
    presetSoftening: pN.physics.softening, presetSoftening0: pB.physics.softening,
    appDefaultSoftening: { now: HN.evalExpr('DEFAULT_PHYSICS.softening'), base: HB.evalExpr('DEFAULT_PHYSICS.softening') },
    lam1AtCalRow: e1.lam1B, residAtCalRow: e1.residLam1, note: '較正行の dt は判定器の段(h・h/2・h/4)が決める —— ここは dt 0.016 の値' };
  for (const z of M.grid) log(`(M) ☄️ ${z.html} ε=${z.eps} dt=${z.dt}: λ=1 ${z.lam1B.toExponential(5)}・λ=0 ${z.lam0B.toExponential(4)}・増分/GR ${z.ratio.toFixed(6)}(c=${z.c})`);
  log(`(C) ☄️ 1PN 増分の比 ${M.cLight.incRatio.toFixed(7)}(期待 ${expect.toFixed(7)}・差 ${M.cLight.relToExpected.toExponential(2)})`);
}

// ---------------------------------------------------------------- (K) cLight の従属値の一覧と html の照合
const K = { file: CLIGHT_JSON, bad: [] };
{
  const D = JSON.parse(fs.readFileSync(path.join(ROOT, CLIGHT_JSON), 'utf8'));
  const rows = HN.evalExpr(`HP.allPresets().filter(p=>p.scaleExp).map(p=>{const ph=p.physics||{}; return {id:p.id, L:p.scaleExp.L, T:p.scaleExp.T, G:ph.G, c:ph.cLight, k:ph.kappaT, retired:p.familyRole==='retired'}})`);
  const tolC = D.tolerance.cRel, tolK = D.tolerance.kappaRel;
  const real = rows.filter((r) => r.G === 6.674);
  const rounded = real.filter((r) => Math.abs(r.c / (C_SI * Math.pow(10, r.T - r.L)) - 1) > tolC);
  const kappaBad = real.filter((r) => Math.abs(r.k / (r.G / (r.c * r.c)) - 1) > tolK);
  K.nReal = real.length; K.nRetired = real.filter((r) => r.retired).length;
  K.roundedLive = rounded.filter((r) => !r.retired).map((r) => r.id); K.roundedRetired = rounded.filter((r) => r.retired).map((r) => r.id);
  K.kappaBad = kappaBad.map((r) => r.id);
  for (const b of D.books) { const r = rows.find((z) => z.id === b.id);
    if (!r) K.bad.push('一覧の本が html に無い: ' + b.id);
    else { if (r.c !== b.cNew) K.bad.push(b.id + ' の cLight ' + r.c + ' ≠ 一覧 ' + b.cNew); if (r.k !== b.kappaNew) K.bad.push(b.id + ' の κ ' + r.k + ' ≠ 一覧 ' + b.kappaNew); } }
  const changedIds = new Set(D.books.map((b) => b.id));
  for (const r of real) if (!r.retired && !changedIds.has(r.id) && !D.exact.some((z) => z.id === r.id)) K.bad.push('一覧の外の実単位の本: ' + r.id);
  const ac = HN.evalExpr('({c:ASTRO_COMMON.cLight, k:ASTRO_COMMON.kappaT})');
  K.astroCommon = ac; if (ac.c !== 29979.2458 || ac.k !== 7.425826474101849e-9) K.bad.push('ASTRO_COMMON が真値でない');
  K.books = D.books.length; K.exact = D.exact.length; K.excluded = D.excluded.map((z) => z.id);
  K.ok = K.bad.length === 0 && K.roundedLive.length === 0 && K.kappaBad.length === 0;
  log(`(K) 実単位の本 ${K.nReal}(退役 ${K.nRetired})・真値化 ${K.books}・以前から真値 ${K.exact}・丸めが残る本(退役を除く)${K.roundedLive.length}・κ 不一致 ${K.kappaBad.length}・不備 ${K.bad.length}`);
}

// ---------------------------------------------------------------- (G) 前後(内蔵全本・1 歩と 32 歩・署名)
const CTX = `globalThis.__w286b = {
  snap(){ const S=HP.sim, n=S.n; const A=(k)=>Array.from(S[k].subarray(0,n));
    return { n, t:S.t, x:A('x'), y:A('y'), vx:A('vx'), vy:A('vy'), spin:A('spin'), nan:S.hasNaN() }; },
  loaded(id, dt, s1, s2){ HP.loadPreset(id, false); const S=HP.sim; for(let k=0;k<s1;k++) S.step(dt); const a=this.snap();
    for(let k=s1;k<s2;k++) S.step(dt); return { one:a, many:this.snap() }; },
  sig(id){ return presetSig(HP.allPresets().find((q)=>q.id===id)); },
};`;
HN.evalExpr(CTX); HB.evalExpr(CTX);
const Gb = { steps: [1, 32], dt: DT, rows: [], diff1: [], diffMany: [], sigDiff: [] };
{
  const D = JSON.parse(fs.readFileSync(path.join(ROOT, CLIGHT_JSON), 'utf8'));
  const declared = new Set(D.books.map((b) => b.id).concat(['alphaCenABDFM', 'siriusABDFM', 'alphaCenAB', 'siriusAB']));
  const ids = HN.evalExpr('HP.allPresets().map((p)=>p.id)'), baseIds = new Set(HB.evalExpr('HP.allPresets().map((p)=>p.id)'));
  for (const id of ids) {
    if (!baseIds.has(id)) continue;
    const a = HN.evalExpr(`__w286b.loaded(${J(id)}, ${DT}, 1, 32)`), b = HB.evalExpr(`__w286b.loaded(${J(id)}, ${DT}, 1, 32)`);
    const c1 = L283.bitCompare(a.one, b.one), c2 = L283.bitCompare(a.many, b.many);
    const sN = HN.evalExpr(`__w286b.sig(${J(id)})`), sB = HB.evalExpr(`__w286b.sig(${J(id)})`);
    Gb.rows.push({ id, declared: declared.has(id), bitSame1: c1.bitSame, bitSameMany: c2.bitSame, maxPosMany: c2.maxPos, sigSame: sN === sB, nan: a.many.nan });
    if (!c1.bitSame) Gb.diff1.push(id);
    if (!c2.bitSame) Gb.diffMany.push(id);
    if (sN !== sB) Gb.sigDiff.push(id);
  }
  Gb.n = Gb.rows.length; Gb.declaredN = declared.size;
  Gb.bitSameMany = Gb.n - Gb.diffMany.length; Gb.sigSame = Gb.n - Gb.sigDiff.length;
  Gb.changedUndeclared = Gb.diffMany.concat(Gb.sigDiff).filter((id) => !declared.has(id));
  Gb.declaredUnchangedBits = [...declared].filter((id) => !Gb.diffMany.includes(id));
  Gb.declaredUnchangedSig = [...declared].filter((id) => !Gb.sigDiff.includes(id));
  log(`(G) 32 歩 ${Gb.bitSameMany}/${Gb.n}(差 ${Gb.diffMany.length})・署名 ${Gb.sigSame}/${Gb.n}(差 ${Gb.sigDiff.length})・宣言の外の差 ${Gb.changedUndeclared.length}・宣言したがビット不変 ${Gb.declaredUnchangedBits.join(',') || 'なし'}`);
}

// ---------------------------------------------------------------- 出力
const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第286便b', target: TARGET, inputs: [TARGET, CALAUDIT, CAL_JSON, PN1_JSON, CLIGHT_JSON],
    code: ['tests/exp-w286b-pnsource.mjs', 'tests/lib-w282b-geo1.mjs', 'tests/lib-w283a-geomode.mjs', 'tests/lib-w280a-mercury.mjs',
      'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'] }),
  harnessVersion: HARNESS_VERSION,
  ruling: '原仮定者の裁定(第76報)AN54: 鎖の calaudit で EIH 後の正式判定を確定した上で、✴️💫✨🌟 の伴星に pnSource を宣言し測り直す / '
    + 'AN59: 較正専用 ε=0.01 を宣言(既定 0.05 は変えない)・cLight は真値 29979.2458(従属定数 κ=G/c² 等も一緒に)',
  base: { rev: BASE_REV, sha256: baseSha, note: '基点 html は git show の一時ファイル(終了後に削除)' }, nowSha256: nowSha,
  note: '判定はしない(正式判定は鎖の calaudit の 3σ 門)。比は λ_PN=1 と 0 の近点増分を GR の主次数(同じ走行の c・接触要素)で割った量 —— '
    + 'λ 増分の一致と λ=1 の実軌道の観測一致は別。Δϖ は deg/周(ω̇ deg/年ではない)。S._core は 1 命令も変えていない。',
  P, Q, M, K, G: Gb,
  doNotWrite: ['λ_PN=1 で観測と合った', 'f=1 で合った', '較正を完了した', '観測一致を達成した', '判定が増えた', 'kF0 版が成立した', '精度を上げれば成立する'],
  headless: { now: { wallSec: HN.ms / 1000, errors: HN.errors.length }, base: { wallSec: HB.ms / 1000, errors: HB.errors.length } }, elapsedS: null,
};
out.elapsedS = (Date.now() - t0) / 1000;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log(`→ ${path.relative(ROOT, OUT)}(${out.elapsedS.toFixed(1)} s)`);

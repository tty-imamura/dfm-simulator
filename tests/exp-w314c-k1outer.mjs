// 第314便c(原仮定者の裁定(第116報)の補足「太陽系の各天体の検証が完了したら、太陽と全惑星とトリトン以上の 7 大衛星を 1 つにまとめた三次元サンプル」・
// 決断事項 AN410〔推奨 —— 外惑星の確認の門: 絶対の ε_fit に加えて相対の門と数値の帯の門〕・AN405〔有限質量比は既知の寄与の列〕・AN401〔比例定数は 1PN だけ〕・
// AN396′〔ε_fit = 1e-3″/世紀・ε_num = 3e-4″/世紀〕・AN336・統括の検証項目 R240):
// **外惑星 3 本(🟡 土星・🔷 天王星・💙 海王星)の K1 の確認(太陽を含む全天体 R_d = κ₀m —— 相対の門)と、🌦️ の h/4・月の 354 公転の正本化**
// (確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の宣言は変えない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState をそのまま呼ぶ)。走行は子プロセス(W314C_WORKERS —— 既定 2)。**既存の器の版は上げない**: 写しは探索の器 v3(tests/exp-w311d-planet3.mjs ——
// 凍結の写し PIN・新しい抽出器の調和の数・ε)と lib(tests/lib-w311d-planet3.mjs の pinnedBook・bookOf・KINDS・gLocAnalytic)・確認の器 v2 の lib(tests/lib-w312d-confirm.mjs
// —— 有限質量比・G の値・分解の行・候補の感度の並び)・🌦️ の走行は K1 の確認の器(tests/exp-w313d-k1confirm.mjs の specOf・runSpec・targetsOf —— 確認の器 v2 の runEM)をそのまま使う。
//
// ■ 段 k1outer-314c(既定 —— 正本 tests/out/k1outer-w314c.json)。W314C_PARTS=P,T,E,K,W,G,D で選ぶ(正本は全段)
//   写し: 🟡 saturnSunInertial3d・🔷 uranusSunInertial3d・💙 neptuneSunInertial3d の第306便a の世代の凍結の写し(tests/data-w306a-decl305.json —— AN336 の在位の写し)
//   + 在位の G_loc {law:"kappaC2"}。引きずりの走行(q11)は新則(〔第311便d〕の NEW_DRAG)+ K1(invSq.kernel:"k1")+ **太陽を含む全天体に写しの明示の dragCore
//   {massFrac: 1, radius: κ₀ × (エンジンが使う質量)}**(κ₀ = (10G)/(C₁c²) —— 本の G・c と C₁ の閉じた式・html の invSqKappa0 と同じ演算の順・エンジンの質量は
//   massPrecision が double でない本は Math.fround(m) —— 枝 a の規則の鍵 rdRule:"kappaM" とビット同一の型〔第313便の統合の継ぎ目〕。段 P がエンジンの R_d・m_d・β を
//   規則の鍵の写しとビットで照合する)。q00・q10 は引きずりなし(q10 は在位の G_loc)。窓は**同じ走行の入れ子**(16 公転の 1 本の走行から最初の 4・8・16 公転 ——
//   新しい抽出器は t ≤ 窓の終わりの標本だけを使うので、窓ごとに別に走らせた値とビット同一)× 刻み h・h/2・h/4(h は器の刻み —— 第306便a と同じ)。
//   P t = 0 の写しの宣言の印字(本の ID・天体ごとの m・エンジンの質量・R・宣言の R_d・エンジンの R_d と m_d・β・R_d/R・規則の鍵の写しとの照合)と κ₀ の閉じた式
//   T 標的の列(q_1PN・A1 の暦表ごとの列〔土星だけ —— 天王星・海王星は行なし〕・η・有限質量比の予測 (4/3)η q_1PN・G の値・第306便a の正本との照合)
//   E 走行(3 惑星 × q00・q10・q11 × h・h/2・h/4 —— 16 公転の入れ子の窓 4・8・16)
//   K 窓 × 刻みごとの残差の表(r_1PN = q11 − q00 − q_1PN・r/q_1PN・D_G・ΔqG・暦表ごとの r_{1PN+A1}・刻みの帯)
//   W 主の窓の選び方(実測 —— 8 公転〔第313便d〕から: 最も細かい 2 刻みの帯が帯の許容の内になる最小の窓・無ければ最長の窓)と窓の感度(r(h/4) の窓どうしの差)
//   G 外惑星の門(決断事項 AN410 —— 器の宣言の定数 OUTER_GATE): **全系に一様**(第315便d —— policy:"all")abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN)・数値の帯
//     (h–h/2 と h/2–h/4 の差 ≤ min(ε_num, 1e-2 q_1PN))。q_1PN が 0 や非有限の系は比を作らず合格にしない・帯が負や非有限は合格にしない。
//     第314便c の型(相対の門と相対の帯は q_1PN < 10 ε_fit の系だけ —— 土星は外れた)は OUTER_GATE_W314C に凍結(PHYSICS〔第314便c〕の表を作り直す文書の lib だけが読む)
//   D 小さい係数の分解の表の延長(外惑星 3 本: r_1PN → 有限質量比の予測を引く → G の値の効き〔感度 —— 引かない〕→ 数値の帯 → 残り・相対の残り)と
//     候補の感度の並び(太陽の構造の型・背景宇宙の型 —— 第313便d の 5 系に外惑星 3 本を足した 8 系の軌道の半直弦の順 —— 並べるだけ・候補を決めない)
//
// ■ 段 k1em-314c(`--stage em` —— 正本 tests/out/k1em-w314c.json)。W314C_PARTS=T,E,K,M,S で選ぶ
//   🌦️ earthMoonSunInertial3d の三体(基点 c98db78 の凍結の写し —— 太陽 pinned)を K1 の確認の器の型(全天体の写しの dragCore 10 G m/(C₁ c²) —— 第313便d の正本と同じ写し)で:
//   (i) q00・q10・q11 × h/4(月 118 公転・地球〔EMB〕の近日点は最初の 8 公転)—— 第313便d の正本の h・h/2 に h/4 を足す(刻みの帯は文書の表で第313便d の正本と並べる ——
//   本段は第313便d の正本を読まない〔鎖の末端の直列を延ばさない〕)。(ii) 月の長い窓 354 公転(刻み h —— q00・q10・q11)の引きずりの有無の差(恒星月・近地点の周期・交点の周期)。
//   (iii) 統括の 2 段目(第313便の統合の後 —— 正本の外)の値と同じ器の関数・同じ html の値を比べる(ビット同一か)。
//   T 標的(EMB の q_1PN・A1 の暦表ごとの列・有限質量比の予測)・E 走行・K h/4 の残差・M 月の診断(118 公転 h/4・354 公転 h)・S 統括の 2 段目との照合・所要
//
// ■ 試走: W314C_QUICK=1(W314C_OUT が要る —— 正本を書かない)。W314C_FROM=<出力>: 同じ html・同じ器の版の走行の行を使い回す(純関数の段だけを作り直す)。
// ■ 門の作り直し(第315便d・決断事項 AN410): `--regate`(段 outer だけ)—— 正本の走行の行(E)と t = 0 の写し(P)をそのまま使い、標的の列・K・W・G・D・門を
//   器の純関数で作り直して同じ正本へ書く(走行の値は変えない —— r_1PN・帯の数は同じ・門の真偽だけ)。正本の領域 hash が今の html と同じとき(か html が同じとき)だけ。
//   作り直しの記録は正本の regate(元の生成時刻・対象の sha・領域 hash・コードの sha)。
// ■ 再開: W314C_CACHE=<dir>(容器の再起動に備える —— 子プロセスの走行 1 本ごとの結果を <dir> に逐次書き、同じ html・同じ器の版・同じ走行の鍵の結果があれば走らせずに読む。
//   読んだ本数を正本の resumed に記録する —— 走行は決定的なので値は走らせ直した値と同じ・所要の wallSec は元の走行の実測)。鎖は使わない(既定なし)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「R_d を決めた」「シュヴァルツシルト半径そのもの」「検証が完了した」。
//   門の内なら「規則で置いた残差が数値の門の内」と書く。数値の門と ε は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断。窓は抽出の感度診断。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as C from './lib-w312d-confirm.mjs';
import * as PL3 from './exp-w311d-planet3.mjs';
import * as CF from './exp-w312d-confirm.mjs';
import * as K13 from './exp-w313d-k1confirm.mjs';
import * as EMX from './exp-w303c-earthmoon.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第281便a の領域 hash の宣言(第313便d の K1 の確認の器の宣言 ∪ 器と lib から deriveScope で引いた下限 —— tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragNormApply","pnSource","relDragCoefficientOf","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w314c-k1outer-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', 'R_d を決めた', 'シュヴァルツシルト半径そのもの', '検証が完了した'];
export const OUT_OUTER = 'tests/out/k1outer-w314c.json';
export const OUT_EM = 'tests/out/k1em-w314c.json';
export const AN336_OUT = 'tests/out/an336-w306a.json';
export const STAGES = Object.freeze(['outer', 'em']);
export const PARTS_OUTER = Object.freeze(['P', 'T', 'E', 'K', 'W', 'G', 'D']);
export const PARTS_EM = Object.freeze(['T', 'E', 'K', 'M', 'S']);
/** 決断事項 AN396′ の ε(探索の器 v3 の宣言をそのまま) */
export const EPS = PL3.ADOPT_EPS;
export const C1_REF = K13.C1_REF;
export const KAPPA0_REF = K13.KAPPA0_REF;
/** 外惑星の門(決断事項 AN410 —— 第315便d で全系に一様へ): abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN)・帯 ≤ min(ε_num, 1e-2 q_1PN)・q_1PN = 0 の系では比を作らない */
export const OUTER_GATE = Object.freeze({ fit: EPS.fit, num: EPS.num, rel: 1e-2, bandRel: 1e-2, policy: 'all', unit: '″/世紀',
  note: '決断事項 AN410(全系に一様の門 —— 第315便d): abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN) と数値の帯の門(h–h/2・h/2–h/4 の差 ≤ min(ε_num, 1e-2 q_1PN))をすべての系に置く。q_1PN が 0 や非有限の系は比を作らず合格にしない・帯が負や非有限は合格にしない。観測の 3σ ではない' });
/** 第314便c の型(凍結 —— PHYSICS〔第314便c〕の表を作り直す文書の lib だけが読む): 相対の門と相対の帯は q_1PN < applyBelow × ε_fit の系だけ */
export const OUTER_GATE_W314C = Object.freeze({ fit: EPS.fit, num: EPS.num, rel: 1e-2, bandRel: 1e-2, applyBelow: 10, policy: 'below', unit: '″/世紀',
  note: '決断事項 AN410 の推奨の型(裁定で変わる): 絶対の門 abs(r_1PN) ≤ ε_fit に加えて、q_1PN < 10 ε_fit の系は相対の門 abs(r_1PN) ≤ 1e-2 q_1PN と数値の帯の門(h–h/2・h/2–h/4 の差 ≤ min(ε_num, 1e-2 q_1PN))。観測の 3σ ではない' });
/** 相対の門と相対の帯を置く系か(一様の門 policy:"all" は全系・第314便c の型は q_1PN < applyBelow × ε_fit) */
export const relAppliesOf = (q1pn, G = OUTER_GATE) => (G.policy === 'all' ? true : q1pn < G.applyBelow * G.fit);
/** 外惑星 3 本(軌道の半直弦の順 —— 絵文字は在位の本) */
export const OUTER = Object.freeze([
  Object.freeze({ key: 'saturn', id: 'saturnSunInertial3d', emoji: '🟡', ja: '土星' }),
  Object.freeze({ key: 'uranus', id: 'uranusSunInertial3d', emoji: '🔷', ja: '天王星' }),
  Object.freeze({ key: 'neptune', id: 'neptuneSunInertial3d', emoji: '💙', ja: '海王星' })]);
export const outerOf = (k) => OUTER.find((s) => s.key === k || s.id === k) || null;
/** A1 の暦表の行の body 名(候補の CSV の名のまま —— 天王星・海王星は行が無い) */
export const A1_BODY_OUTER = Object.freeze({ saturn: Object.freeze({ EPM2011: 'Saturn', INPOP10a: 'Saturn' }), uranus: null, neptune: null });
/** 段 k1outer の計画(正本)。窓は同じ走行の入れ子(runN 公転の 1 本から最初の N 公転) */
export const OUTER_PLAN = Object.freeze({ runN: 16, windows: Object.freeze([4, 8, 16]), startWindow: 8, divs: Object.freeze([1, 2, 4]), kinds: Object.freeze(['q00', 'q10', 'q11']) });
export const OUTER_QUICK = Object.freeze({ runN: 2, windows: Object.freeze([1, 2]), startWindow: 1, divs: Object.freeze([1, 2]), kinds: Object.freeze(['q00', 'q10', 'q11']) });
/** 段 k1em の計画(正本): h/4 は第313便d と同じ窓(月 118 公転・地球 8 公転)・長い窓は 354 公転(刻み h) */
export const EM_PLAN = Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), h4: Object.freeze({ div: 4, nMoon: 118, nEarth: 8 }), long: Object.freeze({ div: 1, nMoon: 354, nEarth: 8 }) });
export const EM_QUICK = Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), h4: Object.freeze({ div: 1, nMoon: 16, nEarth: 1 }), long: Object.freeze({ div: 1, nMoon: 24, nEarth: 1 }) });
/**
 * 統括の 2 段目(第313便の統合の後 —— 正本の外)の値: 🌦️ の h/4(q00・q10・q11 —— 月 118 公転・地球 8 公転)の EMB・地球自身の近日点の率と月の 3 量・步の数と、
 * 月の 354 公転(刻み h)の差(q11 − q10・q10 − q00・q00 − 観測)。本段の同じ器の関数・同じ html の値とビットで比べる(違えば理由を正本に)
 */
export const STAGE2_REF = Object.freeze({
  src: '統括の 2 段目(第313便の統合の後 —— 正本の外・K1 の確認の器の specOf・runSpec で 🌦️ の 1 本ずつ)',
  h4: Object.freeze({
    q00: Object.freeze({ steps: 6963435, emb: 6.518564507704742, earth: 416.1734431016164, sidH: 27.321511475328617, T4p: 8.861411605038624, node: 18.59915041989675 }),
    q10: Object.freeze({ steps: 6963436, emb: 3.9594843129451327, earth: 413.6028343866146, sidH: 27.321513908483904, T4p: 8.861413000625285, node: 18.59915181269498 }),
    q11: Object.freeze({ steps: 6963437, emb: 10.35728714782059, earth: 419.9714647816608, sidH: 27.32151981885007, T4p: 8.861412540241847, node: 18.59916410880571 }) }),
  r1pnH4: -0.000018155964474519948,
  long354: Object.freeze({
    sidH: Object.freeze({ dDG: 0.00000596879844039222, dG: 0.000002434996577704851, q00MinusObs: 8.726344979947953e-7 }),
    T4p: Object.freeze({ dDG: -0.0000013387866264480408, dG: 3.7247187734124054e-7, q00MinusObs: -0.0005576613259581364 }),
    node: Object.freeze({ dDG: 0.000012217782362711205, dG: 0.000001373000493742893, q00MinusObs: 0.002404014825202694 }) }) });

/* ───────── 写し ───────── */
/** κ₀(本の単位 —— html の invSqKappa0 と同じ演算の順 (10·G)/(C₁·c·c)) */
export const kappa0Book = (p) => (10 * p.physics.G) / (Q.C1_CLOSED * p.physics.cLight * p.physics.cLight);
/** エンジンが使う質量(html の invSqEngineMass と同じ規則 —— massPrecision が double の本は宣言の値・それ以外は Math.fround) */
export const engineMassOf = (m, ph) => ((ph && ph.massPrecision === 'double') ? m : Math.fround(m));
export const baseOf = (HP, key) => Q.pinnedBook(HP, PL3.PIN, outerOf(key).id);
const hOf = (base) => P3.stepsOf(base.timeRef.pRef).h;   // 器の刻み h(土星 0.1957・天王星 0.5581・海王星 1.095 —— 第306便a と同じ)
/** 走行の本(q00・q10 は引きずりなし —— lib の bookOf。q11 は K1 + 全天体に {massFrac: 1, radius: κ₀ × エンジンの質量}) */
export function bookOuter(base, kind) {
  if (!Q.KINDS[kind].drag) return Q.bookOf(base, kind);
  const q = Q.bookOf(base, kind, Q.withKernel(Q.thetaOfKf(base, 1), 'k1')), kap = kappa0Book(q);
  for (const b of q.bodies) b.dragCore = { massFrac: 1, radius: kap * engineMassOf(b.m, q.physics) };
  return q;
}
/** 規則の鍵の写し(枝 a の invSq.rdRule:"kappaM" —— 明示の dragCore と dragCoreDefault を外す。段 P の照合だけ) */
export function ruleKeyBook(q) {
  const r = clone(q);
  for (const b of r.bodies) delete b.dragCore;
  delete r.physics.relativeDrag.dragCoreDefault; r.physics.relativeDrag.invSq.rdRule = 'kappaM';
  return r;
}
export const specKey = (s) => s.via === 'outer' ? 'outer:' + s.planet + '|' + s.kind + '|' + (Q.KINDS[s.kind].drag ? 'kappa0E|kernel=k1' : '-') + '|div=' + s.div + '|N=' + s.N : K13.keyOf(s);
/** 入れ子の窓の測り(PL3.measure と同じ式 —— 16 公転の 1 本から最初の N 公転の窓ごとに新しい抽出器と検出器 B) */
export function measureWindows(HP, q, dt, runN, wins) {
  const mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m), Tsec = Math.pow(10, q.scaleExp.T), t0 = Date.now();
  let smp = null, S = null;
  const R = AP.captureSim(HP, (s) => { S = s; smp = AP.attachSampler(s, { ci: 0, oi: 1, mu }); }, () => PL.runPl3(HP, q, { dt, revMax: runN }));
  const rev = R.ev.rev, all = smp.samples(), st = S ? HP.inertialDragIsqState(S) : null, windows = {};
  for (const N of wins) {
    const w = PL.windowOf(R, N, Tsec), f = rev.length >= N ? AP.apsisRate(all, { t0: 0, t1: rev[N - 1], K: PL3.APSIS_K }) : null;
    windows[N] = { apsNew: f ? AP.toArcsecPerCentury(f.rate, Tsec) : null, detB: Number.isFinite(w.apsArcsecPerCentury) ? w.apsArcsecPerCentury : null, nPeri: w.complete ? w.nPeri : null,
      complete: !!w.complete, periodDays: w.complete ? w.periodDays : null, ecc: Number.isFinite(w.ecc) ? w.ecc : null };
  }
  return { windows, steps: R.steps, nan: R.nan, betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: (Date.now() - t0) / 1000 };
}
/** 1 本の走行(outer: {via, planet, kind, div, N, wins} —— confirm: K1 の確認の器の spec) */
export function runSpec(HP, sp) {
  if (sp.via !== 'outer') return K13.runSpec(HP, sp);
  const base = baseOf(HP, sp.planet), q = bookOuter(base, sp.kind), h = hOf(base), v = HP.validatePreset(clone(q)), wantK1 = Q.KINDS[sp.kind].drag;
  if (!v.ok) return { key: specKey(sp), spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  if (wantK1 && !(v.preset.physics.relativeDrag && v.preset.physics.relativeDrag.invSq && v.preset.physics.relativeDrag.invSq.kernel === 'k1'))
    return { key: specKey(sp), spec: sp, status: 'rejected', err: '受理した写しに invSq.kernel:"k1" が無い' };
  const r = measureWindows(HP, q, h / sp.div, sp.N, sp.wins);
  return Object.assign({ key: specKey(sp), spec: sp, status: 'run', h, dt: h / sp.div, warnings: (v.warnings || []).length }, r);
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
/** 再開の写し(W314C_CACHE —— 走行 1 本ごとのファイル。鍵は器の版・対象 html の sha・走行の鍵) */
function cachedRun(run, dir, targetSha256, stat) {
  if (!dir) return run;
  fs.mkdirSync(dir, { recursive: true });
  const fileOf = (sp) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + targetSha256 + '|' + specKey(sp)).digest('hex').slice(0, 32) + '.json');
  return (sp, pri) => {
    const f = fileOf(sp);
    try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.row && c.row.key === specKey(sp)) { stat.resumed++; return Promise.resolve(c.row); } } catch (e) { /* 無い */ }
    return run(sp, pri).then((r) => { const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, row: r })); fs.renameSync(tmp, f); return r; });
  };
}

/* ───────── 段 P(t = 0 の写しの宣言の印字と規則の鍵の写しとの照合)───────── */
const BODY_NAMES = ['太陽', '惑星'];
const bitSame = (a, b) => (Array.isArray(a) && Array.isArray(b)) ? (a.length === b.length && a.every((x, i) => Object.is(x, b[i]))) : Object.is(a, b);
export function probeOf(HP) {
  const out = { C1: Q.C1_CLOSED, C1Ref: C1_REF, systems: {} };
  for (const s of OUTER) {
    const base = baseOf(HP, s.key), q = bookOuter(base, 'q11'), qr = ruleKeyBook(q), v = HP.validatePreset(clone(q)), vr = HP.validatePreset(clone(qr));
    if (!v.ok || !vr.ok) { out.systems[s.key] = { id: s.id, err: JSON.stringify(v.ok ? vr.errors : v.errors).slice(0, 300), ruleKeyAccepted: vr.ok }; continue; }
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset)); const Sr = HP.coord3d.makeSim(); Sr.build(clone(vr.preset));
    const st = HP.inertialDragIsqState(S), sr = HP.inertialDragIsqState(Sr), L = Math.pow(10, q.scaleExp.L), M = Math.pow(10, q.scaleExp.M), kap = kappa0Book(q);
    const bodies = q.bodies.map((b, i) => { const rc = (st.receivers || []).find((z) => z.i === i), rr = (sr.receivers || []).find((z) => z.i === i);
      return { name: BODY_NAMES[i], m: b.m * M, mEngine: engineMassOf(b.m, q.physics) * M, mEngineBook: engineMassOf(b.m, q.physics), sEngineMass: S.m[i], R: b.radius * L, RdDecl: b.dragCore.radius * L,
        RdDeclBook: b.dragCore.radius, RdDeclaredMass: Q.rdBookKappa0(q, b.m) * L, massFrac: b.dragCore.massFrac, pinned: !!b.pinned, receiver: !!rc,
        RdEngine: rc ? rc.Rd * L : null, RdEngineBook: rc ? rc.Rd : null, mdEngine: rc ? rc.md * M : null, beta: rc ? rc.beta.slice() : null, rdOverR: b.dragCore.radius / b.radius,
        rdOverRs: (b.dragCore.radius) / (2 * q.physics.G * engineMassOf(b.m, q.physics) / (q.physics.cLight * q.physics.cLight)),
        ruleKey: rr ? { RdBook: rr.Rd, mdBook: rr.md, beta: rr.beta.slice(), rdSame: Object.is(rr.Rd, rc ? rc.Rd : NaN), mdSame: Object.is(rr.md, rc ? rc.md : NaN), betaSame: rc ? bitSame(rr.beta, rc.beta) : false } : null }; });
    out.systems[s.key] = { id: s.id, scaleExp: clone(q.scaleExp), G: q.physics.G, cLight: q.physics.cLight, kappa0Book: kap, kappa0: Q.kappa0SI(q), kernel: v.preset.physics.relativeDrag.invSq.kernel || null,
      ruleKeyKernel: vr.preset.physics.relativeDrag.invSq.kernel || null, ruleKeyRdRule: vr.preset.physics.relativeDrag.invSq.rdRule || null, massPrecision: q.physics.massPrecision || null,
      bodies, betaMax: st.betaMax, betaMaxRuleKey: sr.betaMax, h: hOf(base) };
  }
  return out;
}

/* ───────── 段 T(標的の列)───────── */
const noteVal = (note, k) => { const m = new RegExp('(?:^|; )' + k + '=([^;]*)').exec(note || ''); return m ? m[1].trim() : null; };
/** 暦表ごとの A1 の行(tests/lib-w312d-confirm.mjs の a1Columns と同じ規則 —— body の名を引数で。行の無い天体は {}) */
export function a1ColumnsOf(recs, bodyMap) {
  const out = {}; if (!bodyMap) return out;
  for (const E of C.EPHEMERIDES) {
    const body = bodyMap[E.key];
    const cs = recs.C.filter((r) => r.body === body && r.quantity === AN.QUANTITY && noteVal(r.note, 'item') === E.item);
    if (cs.length !== 1) { out[E.key] = { value: null, recordId: null, body, why: '候補の行が ' + cs.length + ' 行' }; continue; }
    const c = cs[0], audit = recs.A.filter((r) => r.record_id === c.record_id);
    if (E.key === 'EPM2011') { const a = AN.a1Of(recs, c.record_id, body);
      out[E.key] = { value: a.value, recordId: a.recordId, body, width: a.sourceWidth, widthKind: E.widthKind, audited: true, unit: AN.UNIT }; }
    else { const w = noteVal(c.note, 'interval_halfwidth');
      out[E.key] = { value: Number(c.value), recordId: c.record_id, body, width: w === null ? null : Number(w), widthKind: E.widthKind, audited: audit.length === 1, unit: AN.UNIT }; }
  }
  return out;
}
export function targetsOf(HP) {
  const recs = AN.readRecords(ROOT), out = {};
  let live = null; try { live = JSON.parse(fs.readFileSync(path.join(ROOT, AN336_OUT), 'utf8')).transfer.table; } catch (e) { live = null; }
  for (const s of OUTER) {
    const base = baseOf(HP, s.key), pn = AN.pn1Of(base), U = C.siOf(base), M = U.B[0].m, m = U.B[1].m, q1pn = pn.value, L = live ? live.find((z) => z.id === s.id) : null;
    const P = C.bodyProps('jupiter', base);   // 二体の式(太陽と惑星 —— 🏀 と同じ形)
    out[s.key] = { id: s.id, q1pn, a: pn.a, e: pn.e, p: P.jupiter.p.sun, M, m, eta: C.etaOf(M, m), fm: C.finiteMassPred(q1pn, M, m), a1: a1ColumnsOf(recs, A1_BODY_OUTER[s.key]), G: base.physics.G,
      gLocAnalytic: Q.gLocAnalytic(base, 2), h: hOf(base), relApplies: relAppliesOf(q1pn),
      an336: L ? { value: L.target.value, pn1: L.target.pn1, a1: L.target.a1, recordId: L.target.recordId, h: L.h } : null };
  }
  return out;
}

/* ───────── 段 K・W・G・D(E の行から —— 純関数 —— QA が作り直す)───────── */
const qRow = (J, key, kind, div) => { const r = J.E.rows[specKey({ via: 'outer', planet: key, kind, div, N: J.E.runN })]; return r && r.status === 'run' ? r : null; };
/** 系・刻み・窓の q の組(新しい抽出器 apsNew) */
export function qsOf(J, key, div, N) {
  const g = (kind) => { const r = qRow(J, key, kind, div); return r && r.windows[N] ? r.windows[N].apsNew : undefined; };
  return { q00: g('q00'), q10: g('q10'), q11: g('q11') };
}
const bandsOf = (byDiv, ds) => { const b = {}; for (let i = 1; i < ds.length; i++) b[ds[i - 1] + '-' + ds[i]] = Math.abs(byDiv[ds[i]].r1pn - byDiv[ds[i - 1]].r1pn); return b; };
export function partK(J) {
  const out = { systems: {} };
  for (const s of OUTER) {
    const T = J.T.systems[s.key], o = { byWin: {} };
    for (const N of J.E.windows) {
      const w = { byDiv: {} };
      for (const d of J.E.divs) { const q = qsOf(J, s.key, d, N); if (![q.q00, q.q10, q.q11].every(Number.isFinite)) continue;
        const rc = C.residualCols(q, T.q1pn, T.a1); w.byDiv[d] = Object.assign({ q }, rc, { rOverQ: rc.r1pn / T.q1pn }); }
      const ds = Object.keys(w.byDiv).map(Number).sort((a, b) => a - b);
      w.fine = ds.length ? ds[ds.length - 1] : null; w.bands = bandsOf(w.byDiv, ds);
      if (w.fine !== null) { const b = w.byDiv[w.fine]; w.r1pn = b.r1pn; w.DG = b.DG; w.rOverQ = b.rOverQ; }
      o.byWin[N] = w;
    }
    out.systems[s.key] = o;
  }
  return out;
}
/** 帯の許容(外惑星: min(ε_num, bandRel·q_1PN) —— 相対の門を置かない系は ε_num) */
export const bandTolOf = (q1pn, applies, G = OUTER_GATE) => (applies ? Math.min(G.num, G.bandRel * Math.abs(q1pn)) : G.num);
/** 主の窓(実測): startWindow 以上の窓で、最も細かい 2 刻みの帯 ≤ 帯の許容 になる最小の窓・無ければ最長の窓。窓の感度 = r(最も細かい刻み)の隣り合う窓の差 */
export function partW(J, G = OUTER_GATE) {
  const out = { rule: '主の窓 = 開始の窓(' + J.E.startWindow + ' 公転 —— 第313便d)以上で、最も細かい 2 刻みの帯 ≤ 帯の許容 min(ε_num, 1e-2 q_1PN)' + (G.policy === 'all' ? '(全系 —— 決断事項 AN410 の一様の門)' : '〔相対の門を置かない系は ε_num〕') + 'になる最小の窓・無ければ最長の窓', systems: {} };
  for (const s of OUTER) {
    const T = J.T.systems[s.key], Kk = J.K.systems[s.key], tol = bandTolOf(T.q1pn, relAppliesOf(T.q1pn, G), G), ws = J.E.windows.slice().sort((a, b) => a - b), rows = [];
    for (const N of ws) { const w = Kk.byWin[N], ds = Object.keys(w.byDiv).map(Number).sort((a, b) => a - b), last = ds.length >= 2 ? ds[ds.length - 2] + '-' + ds[ds.length - 1] : null;
      rows.push({ N, fine: w.fine, r1pn: Number.isFinite(w.r1pn) ? w.r1pn : null, bandFine: last ? w.bands[last] : null, bandFineKey: last, inTol: last ? w.bands[last] <= tol : null }); }
    const cand = rows.filter((z) => z.N >= J.E.startWindow && z.inTol === true);
    const main = cand.length ? cand[0].N : ws[ws.length - 1];
    const sens = []; for (let i = 1; i < rows.length; i++) if (Number.isFinite(rows[i].r1pn) && Number.isFinite(rows[i - 1].r1pn)) sens.push({ from: rows[i - 1].N, to: rows[i].N, dr: rows[i].r1pn - rows[i - 1].r1pn });
    out.systems[s.key] = { tol, rows, main, how: cand.length ? '帯の許容の内の最小の窓' : '許容の内の窓なし —— 最長の窓', sens };
  }
  return out;
}
/**
 * 外惑星の門(主の窓・最も細かい刻み)。G.policy === 'all'(決断事項 AN410 —— 第315便d): 全系に abs(r) ≤ min(ε_fit, 1e-2 q_1PN)・帯 ≤ min(ε_num, 1e-2 q_1PN) ——
 * q_1PN が 0 や非有限の系は比を作らず(rOverQ・relTol は null)合格にしない・帯が 2 本未満・負・非有限なら合格にしない。
 * それ以外(第314便c の型 OUTER_GATE_W314C)は第314便c の式のまま(欄と真偽はビット同一 —— 文書の lib が PHYSICS〔第314便c〕の表を作り直す)。
 */
export function gateOuter(r, q1pn, bands, applies, fm, G = OUTER_GATE) {
  const f = Number.isFinite, b = Object.values(bands || {});
  if (G.policy !== 'all') {
    const tol = bandTolOf(q1pn, applies, G);
    const absOk = f(r) ? Math.abs(r) <= G.fit : null, relTol = G.rel * Math.abs(q1pn), relOk = f(r) ? Math.abs(r) <= relTol : null;
    const bandAbsOk = b.length >= 2 ? b.every((x) => x <= G.num) : null, bandRelOk = b.length >= 2 ? b.every((x) => x <= G.bandRel * Math.abs(q1pn)) : null;
    const relFm = (f(r) && f(fm)) ? Math.abs(r - fm) <= relTol : null;
    const pass = absOk === true && bandAbsOk === true && (applies ? (relOk === true && bandRelOk === true) : true);
    return { r, q1pn, rOverQ: f(r) ? r / q1pn : null, absTol: G.fit, absOk, relTol, relOk, relAfterFm: relFm, bands: b, bandTol: tol, bandAbsOk, bandRelOk, applies, pass,
      verdict: pass ? '規則で置いた残差が数値の門の内' : '門の外(数で —— 規則が届かないか帯が広い)' };
  }
  const qOk = f(q1pn) && q1pn !== 0, bandsOk = b.length >= 2 && b.every((x) => f(x) && x >= 0);
  const relTol = qOk ? G.rel * Math.abs(q1pn) : null, gateTol = qOk ? Math.min(G.fit, relTol) : null, bandTol = qOk ? Math.min(G.num, G.bandRel * Math.abs(q1pn)) : null;
  const absOk = f(r) ? Math.abs(r) <= G.fit : null, relOk = (f(r) && qOk) ? Math.abs(r) <= relTol : null;
  const bandAbsOk = bandsOk ? b.every((x) => x <= G.num) : (b.length >= 2 ? false : null), bandRelOk = (bandsOk && qOk) ? b.every((x) => x <= G.bandRel * Math.abs(q1pn)) : (b.length >= 2 ? false : null);
  const relFm = (f(r) && f(fm) && qOk) ? Math.abs(r - fm) <= relTol : null;
  const pass = qOk && bandsOk && absOk === true && relOk === true && bandAbsOk === true && bandRelOk === true;
  return { r, q1pn, rOverQ: (f(r) && qOk) ? r / q1pn : null, qOk, absTol: G.fit, absOk, relTol, relOk, gateTol, relAfterFm: relFm, bands: b, bandsOk, bandTol, bandAbsOk, bandRelOk, applies: true, policy: G.policy, pass,
    verdict: pass ? '規則で置いた残差が数値の門の内' : (qOk ? '門の外(数で —— 規則が届かないか帯が広い)' : '比を作らない(q_1PN が 0 か非有限 —— 合格にしない)') };
}
export function partG(J, G = OUTER_GATE) {
  const out = { rule: G.policy === 'all' ? { fit: G.fit, num: G.num, rel: G.rel, bandRel: G.bandRel, policy: G.policy, unit: G.unit, note: G.note }
    : { fit: G.fit, num: G.num, rel: G.rel, bandRel: G.bandRel, applyBelow: G.applyBelow, unit: G.unit, note: G.note }, systems: {} };
  for (const s of OUTER) {
    const T = J.T.systems[s.key], N = J.W.systems[s.key].main, w = J.K.systems[s.key].byWin[N];
    out.systems[s.key] = Object.assign({ N, fine: w.fine }, gateOuter(w.r1pn, T.q1pn, w.bands, relAppliesOf(T.q1pn, G), T.fm, G),
      G.policy !== 'all' ? { relInfo: gateOuter(w.r1pn, T.q1pn, w.bands, true, T.fm, G) } : {});   // 第314便c の型: 相対の門を置かない系(土星)も相対の列を並べる(参考)
  }
  out.allPass = OUTER.every((s) => out.systems[s.key].pass);
  return out;
}
/** 小さい係数の分解の表の延長(外惑星 3 本 —— 主の窓)と候補の感度の並び(第313便d の 5 系 + 外惑星 3 本の軌道の半直弦 —— 並べるだけ) */
export function partD(J) {
  const rows = [];
  for (const s of OUTER) {
    const T = J.T.systems[s.key], N = J.W.systems[s.key].main, w = J.K.systems[s.key].byWin[N]; if (w.fine === null) continue;
    const r1 = {}; for (const [d, b] of Object.entries(w.byDiv)) r1[d] = b.r1pn;
    const g = C.gColumn(T.G, w.DG), dr = C.decompRow({ r1pnByDiv: r1, DG: w.DG, q1pn: T.q1pn, fm: T.fm, g, divs: Object.keys(w.byDiv).map(Number) });
    const rA1 = {}; for (const [k, v] of Object.entries(w.byDiv[w.fine].rA1)) rA1[k] = Number.isFinite(v) ? v - T.fm : null;
    rows.push(Object.assign({ key: s.key, N, p: T.p, q1pn: T.q1pn, eta: T.eta, g }, dr, { remA1: rA1, remWithinFit: Number.isFinite(dr.rem) ? Math.abs(dr.rem) <= EPS.fit : null,
      remWithinRel: Number.isFinite(dr.rem) ? Math.abs(dr.rem) <= OUTER_GATE.rel * Math.abs(T.q1pn) : null }));
  }
  const pAll = OUTER.map((s) => ({ key: s.key, p: J.T.systems[s.key].p })).concat(Object.entries(J.T.inner).map(([k, v]) => ({ key: k, p: v.p }))).sort((a, b) => a.p - b.p);
  return { rows, shapes: C.candidateShapes(pAll), shapeDefs: C.CANDIDATE_SHAPES.map((c) => Object.assign({}, c)),
    note: '並べるだけ(合わせない・候補を決めない)。第313便d の 5 系の残りは第313便d の正本(本段は読まない —— 文書の表で並べる)。G の値の効きは感度(引かない)' };
}
/** 所要(系・走行・刻みごと —— 揮発の欄は wallSec・rateStepsPerSec だけ) */
export function costOuter(J) {
  const by = {};
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run' || r.reused) continue;
    const k = r.spec.planet + '|' + (Q.KINDS[r.spec.kind].drag ? 'drag' : 'nodrag') + '|h/' + r.spec.div; const w = by[k] || (by[k] = { n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r.steps; w.wallSec += r.wallSec; }
  const dr = Object.values(by).filter((w, i) => Object.keys(by)[i].indexOf('|drag|') >= 0), st = dr.reduce((s, w) => s + w.steps, 0), ws = dr.reduce((s, w) => s + w.wallSec, 0);
  return { rows: by, rate: { rateStepsPerSec: ws > 0 ? st / ws : null } };
}

/* ───────── 段 k1em(🌦️ の h/4 と月の 354 公転)———— 純関数 ───────── */
const emRow = (J, kind, div, N) => { const r = J.E.rows[K13.keyOf(K13.specOf(null, 'earthmoon', kind, div, N, { nEarth: J.E.nEarth }))]; return r && r.status === 'run' ? r : null; };
export function partKem(J) {
  const T = J.T.earthmoon, P = J.E.plan, g = (kind, ex) => { const r = emRow(J, kind, P.h4.div, P.h4.nMoon); return r ? r[ex] : undefined; };
  const q = { q00: g('q00', 'emb'), q10: g('q10', 'emb'), q11: g('q11', 'emb') }, qe = { q00: g('q00', 'earth'), q10: g('q10', 'earth'), q11: g('q11', 'earth') };
  if (![q.q00, q.q10, q.q11].every(Number.isFinite)) return { div: P.h4.div, q, r1pn: null };
  const rc = C.residualCols(q, T.q1pn, T.a1);
  return Object.assign({ div: P.h4.div, nMoon: P.h4.nMoon, nEarth: J.E.nEarth, q }, rc, { rOverQ: rc.r1pn / T.q1pn, withinFit: Math.abs(rc.r1pn) <= EPS.fit, afterFm: rc.r1pn - T.fm,
    earthOwn: { q: qe, DG: qe.q11 - qe.q10, dqG: qe.q10 - qe.q00 } });   // 地球自身(副 —— 月の効きを含む・1PN だけの参照とは比べない)
}
/** 確認の器の月の診断(CF.moonOf)を 1 つの窓・刻みで(行は確認の器の鍵へ) */
export function moonAt(J, div, N) {
  const rows = {};
  for (const r of Object.values(J.E.rows)) if (r.spec.via === 'confirm' && r.spec.N === N && r.spec.div === div) rows[CF.specKey(r.spec)] = Object.assign({}, r, { key: CF.specKey(r.spec) });
  const m = CF.moonOf({ E: { rows, N: { earthmoon: N }, divs: { earthmoon: [div] } } }, 'kappa0', 'k1');
  return Object.assign({ div, N }, m.byDiv[div] || {});
}
export function partMem(J) {
  const P = J.E.plan;
  return { h4: moonAt(J, P.h4.div, P.h4.nMoon), long: moonAt(J, P.long.div, P.long.nMoon), moonPinnedSun: true,
    note: '🌦️ の太陽は pinned(受け手でない —— 源としてだけ効く)。q11 − q10 = 全天体の規則の引きずりの効き・q10 − q00 = G_loc の効き・q00 − 観測 = 在位の写しの基線の差' };
}
/** 統括の 2 段目の値との照合(Object.is —— ビット同一か) */
export function partSem(J) {
  const P = J.E.plan, R = STAGE2_REF, out = { src: R.src, h4: {}, long354: {}, quick: !!J.quick };
  if (!J.quick) {
    for (const kind of ['q00', 'q10', 'q11']) { const r = emRow(J, kind, P.h4.div, P.h4.nMoon), ref = R.h4[kind], row = {};
      for (const k of Object.keys(ref)) { const v = !r ? null : (k === 'steps' || k === 'emb' || k === 'earth' ? r[k] : (r.moon ? r.moon[k] : null)); row[k] = { now: v, ref: ref[k], same: Object.is(v, ref[k]), diff: Number.isFinite(v) ? v - ref[k] : null }; }
      out.h4[kind] = row; }
    const Kk = J.K; out.r1pnH4 = { now: Kk ? Kk.r1pn : null, ref: R.r1pnH4, same: Kk ? Object.is(Kk.r1pn, R.r1pnH4) : false };
    const M = J.M ? J.M.long : null;
    for (const k of Object.keys(R.long354)) { const row = {}; for (const f of Object.keys(R.long354[k])) { const v = M && M[k] ? M[k][f] : null; row[f] = { now: v, ref: R.long354[k][f], same: Object.is(v, R.long354[k][f]), diff: Number.isFinite(v) ? v - R.long354[k][f] : null }; } out.long354[k] = row; }
    const all = [].concat(...Object.values(out.h4).map((z) => Object.values(z)), ...Object.values(out.long354).map((z) => Object.values(z)), [out.r1pnH4]);
    out.nSame = all.filter((z) => z.same).length; out.n = all.length; out.allSame = out.nSame === out.n;
  }
  return out;
}
export function costEm(J) {
  const by = {};
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run' || r.reused) continue;
    const k = (Q.KINDS[r.spec.kind].drag ? 'drag' : 'nodrag') + '|h/' + r.spec.div + '|N=' + r.spec.N; const w = by[k] || (by[k] = { n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r.steps; w.wallSec += r.wallSec; }
  return { rows: by };
}

/* ───────── 門(器の健全さ —— 外惑星の門〔partG〕は結果で、ここに入れない)───────── */
export function liveOuter(HP) {
  return OUTER.map((s) => { const p = HP.allPresets().find((q) => q.id === s.id), d = PL3.PIN.decl[s.id], rd = p.physics.relativeDrag || {};
    return { id: s.id, bodiesSame: JSON.stringify(p.bodies) === JSON.stringify(d.bodies), scaleSame: JSON.stringify(p.scaleExp) === JSON.stringify(d.scaleExp),
      timeRefSame: JSON.stringify(p.timeRef) === JSON.stringify(d.timeRef), gLoc: p.physics.gLoc || null, oldRule: rd.law === 'inertial' && typeof rd.Wbg === 'number' && !rd.invSq,
      noDragCore: !p.bodies.some((b) => b.dragCore), noInvSq: !rd.invSq }; });
}
export function gatesOf(J) {
  const g = {};
  if (J.stage === 'em') {
    if (J.T) g.targetEm = !!(J.T.earthmoon && Number.isFinite(J.T.earthmoon.q1pn) && J.T.earthmoon.a1 && J.T.earthmoon.a1.EPM2011 && J.T.earthmoon.a1.EPM2011.audited === true);
    if (J.E) { const run = Object.values(J.E.rows);
      g.runsComplete = run.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && Number.isFinite(r.emb) && Number.isFinite(r.earth) && r.moon && Number.isFinite(r.moon.sidH) && Number.isFinite(r.moon.T4p) && Number.isFinite(r.moon.node));
      g.noRejected = run.every((r) => r.status === 'run'); }
    if (J.live) g.inPositionUnchanged = J.live.earthmoon === true;
    return g;
  }
  if (J.P) {
    g.kappa0Closed = Math.abs(J.P.C1 - C1_REF) <= 1e-10 && Object.values(J.P.systems).every((s) => Math.abs(s.kappa0 / KAPPA0_REF - 1) <= 1e-8);
    // 宣言の R_d は κ₀ × エンジンの質量そのもの・エンジンの R_d・m_d・β は規則の鍵の写しとビット同一・太陽を含む全天体が受け手と源
    g.ruleAllBodies = Object.values(J.P.systems).every((s) => !s.err && s.kernel === 'k1' && s.ruleKeyKernel === 'k1' && s.ruleKeyRdRule === 'kappaM' && s.bodies.every((b) => b.massFrac === 1 && b.receiver
      && Object.is(b.RdDeclBook, s.kappa0Book * b.mEngineBook) && Object.is(b.sEngineMass, b.mEngineBook) && Object.is(b.RdEngineBook, b.RdDeclBook) && b.ruleKey && b.ruleKey.rdSame && b.ruleKey.mdSame && b.ruleKey.betaSame));
  }
  if (J.T) g.targetsAn336 = OUTER.every((s) => { const t = J.T.systems[s.key]; return t.an336 && Math.abs(t.an336.pn1 - t.q1pn) <= 1e-12 * Math.abs(t.q1pn) && t.an336.h === t.h
      && (s.key === 'saturn' ? (t.a1.EPM2011 && t.a1.EPM2011.recordId === t.an336.recordId && t.a1.EPM2011.value === t.an336.a1) : (t.an336.a1 === null && Object.keys(t.a1).length === 0)); });
  if (J.E) { const run = Object.values(J.E.rows);
    g.runsComplete = run.filter((r) => r.status === 'run').every((r) => !r.nan && J.E.windows.every((N) => r.windows[N] && r.windows[N].complete && Number.isFinite(r.windows[N].apsNew) && (r.windows[N].nPeri < 3 || Number.isFinite(r.windows[N].detB))));
    g.noRejected = run.every((r) => r.status === 'run'); }
  if (J.live) g.inPositionUnchanged = J.live.every((z) => z.bodiesSame && z.scaleSame && z.timeRefSame && z.oldRule && z.noInvSq && z.noDragCore && z.gLoc && z.gLoc.law === 'kappaC2');
  return g;
}

/* ───────── 走行の計画 ───────── */
export async function runOuter(HP, o) {
  const parts = o.parts, P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'outer', quick: !!o.quick, parts, kernel: 'k1', rule: 'kappa0E', plan: clone(P), gate: clone(OUTER_GATE) };
  J.live = liveOuter(HP);
  J.book = { newDrag: clone(Q.NEW_DRAG), offDrag: clone(Q.OFF_DRAG), gLoc: clone(Q.GLOC_FIXED), declFile: PL3.DECL_FILE, extractor: { main: 'apsNew', sub: 'detB', K: PL3.APSIS_K },
    rule: 'kappa0E —— 太陽を含む全天体に dragCore {massFrac: 1, radius: κ₀ × エンジンの質量}(κ₀ = (10G)/(C₁c²) —— 本の単位・K1・規則の鍵 rdRule:"kappaM" とビット同一の型)' };
  if (parts.includes('P')) { J.P = probeOf(HP); tick('P'); }
  J.T = { systems: targetsOf(HP), inner: Object.fromEntries(Object.entries(K13.targetsOf(HP)).map(([k, v]) => [k, { p: v.p }])) }; tick('T');
  if (parts.includes('E')) {
    const rows = {}, specs = [];
    for (const s of OUTER) for (const d of P.divs) for (const kind of P.kinds) specs.push({ via: 'outer', planet: s.key, kind, div: d, N: P.runN, wins: P.windows.slice() });
    const reuse = o.reuse || {}, todo = specs.filter((sp) => { const r = reuse[specKey(sp)]; if (r && r.status === 'run') { rows[specKey(sp)] = r; return false; } return true; });
    await Promise.all(todo.map((sp) => o.run(sp, (Q.KINDS[sp.kind].drag ? 100 : 1) * sp.div).then((r) => { rows[r.key] = r; o.log(r); return r; })));
    J.E = { runN: P.runN, windows: P.windows.slice(), startWindow: P.startWindow, divs: P.divs.slice(), rows };
    tick('E');
  }
  if (J.E && parts.includes('K')) { J.K = partK(J); tick('K'); }
  if (J.K && parts.includes('W')) { J.W = partW(J); tick('W'); }
  if (J.W && parts.includes('G')) { J.G = partG(J); tick('G'); }
  if (J.W && parts.includes('D')) { J.D = partD(J); tick('D'); }
  if (J.E) J.cost = costOuter(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r.status === 'run') : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}
export async function runEm(HP, o) {
  const parts = o.parts, P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'em', quick: !!o.quick, parts, kernel: 'k1', rule: 'kappa0', plan: clone(P) };
  J.live = { earthmoon: CF.liveSame(HP).earthmoon };
  J.book = { pinEM: CF.PIN_EM_BASE, newDrag: clone(Q.NEW_DRAG), gLoc: clone(Q.GLOC_FIXED), extractor: { earth: 'emb(EMB の接触の離心ベクトルの回帰)', moon: EMX.EXTRACTOR_VERSION },
    rule: 'kappa0 —— 太陽を含む全天体に dragCore {massFrac: 1, radius: 10 G m/(C₁ c²)}(本の単位・K1 —— 第313便d の K1 の確認の器の写しのまま)' };
  const T0 = K13.targetsOf(HP).earthmoon, base = CF.baseOf(HP, 'earthmoon');
  J.T = { earthmoon: Object.assign({}, T0, { earthOwnQ1pn: C.targetOf(ROOT, 'earthmoon', base, AN.readRecords(ROOT)).earthOwn.value }) }; tick('T');
  if (parts.includes('E')) {
    const rows = {}, specs = [], nE = P.h4.nEarth;
    for (const kind of P.kinds) specs.push(K13.specOf(HP, 'earthmoon', kind, P.h4.div, P.h4.nMoon, { nEarth: nE }));
    for (const kind of P.kinds) specs.push(K13.specOf(HP, 'earthmoon', kind, P.long.div, P.long.nMoon, { nEarth: P.long.nEarth }));
    const reuse = o.reuse || {}, todo = specs.filter((sp) => { const r = reuse[specKey(sp)]; if (r && r.status === 'run') { rows[specKey(sp)] = r; return false; } return true; });
    await Promise.all(todo.map((sp) => o.run(sp, (Q.KINDS[sp.kind].drag ? 100 : 1) * sp.div * sp.N).then((r) => { rows[r.key] = r; o.log(r); return r; })));
    J.E = { plan: clone(P), nEarth: nE, rows };
    tick('E');
  }
  if (J.E && parts.includes('K')) { J.K = partKem(J); tick('K'); }
  if (J.E && parts.includes('M')) { J.M = partMem(J); tick('M'); }
  if (J.E && parts.includes('S')) { J.S = partSem(J); tick('S'); }
  if (J.E) J.cost = costEm(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r.status === 'run') : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}

/**
 * 門の作り直し(第315便d・決断事項 AN410 —— 段 outer だけ)。P0 = 今の正本。走行の行(E)・t = 0 の写し(P)・計画・本の記録はそのまま、
 * 在位の宣言の照合(live)・標的の列(T)・K・W・G・D・所要・門を器の純関数で作り直す(走行の値は変えない)。scope = {htmlSame, scopeSame}
 */
export const REGATE_VERSION = 'w315d-regate-1';
export function regateOuter(HP, P0, scope) {
  const bad = [];
  if (P0.version !== HARNESS_VERSION) bad.push('器の版が違う ' + P0.version);
  if (P0.stage !== 'outer' || P0.quick === true || !P0.E || !P0.P) bad.push('段 outer の正本(試走でない・E と P がある)でない');
  if (JSON.stringify(P0.parts) !== JSON.stringify(PARTS_OUTER)) bad.push('全段の正本でない');
  if (!(scope.htmlSame || scope.scopeSame)) bad.push('対象 html も領域 hash も正本の刻印と違う(走行の値が変わりうる —— 段を走らせ直す)');
  if (bad.length) throw new Error('--regate: ' + bad.join(' / '));
  const t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'outer', quick: false, parts: P0.parts.slice(), kernel: P0.kernel, rule: P0.rule, plan: clone(P0.plan), gate: clone(OUTER_GATE) };
  J.live = liveOuter(HP); J.book = clone(P0.book); J.P = clone(P0.P);
  J.T = { systems: targetsOf(HP), inner: Object.fromEntries(Object.entries(K13.targetsOf(HP)).map(([k, v]) => [k, { p: v.p }])) }; tick('T');
  J.E = clone(P0.E);
  J.K = partK(J); tick('K'); J.W = partW(J); tick('W'); J.G = partG(J); tick('G'); J.D = partD(J); tick('D');
  J.cost = costOuter(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  J.timing = Object.assign({}, clone(P0.timing || {}), Object.fromEntries(Object.entries(t).map(([k, v]) => ['regate' + k, v])));
  const runs = Object.values(J.E.rows).filter((r) => r.status === 'run');
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  J.regate = { version: REGATE_VERSION, why: '決断事項 AN410(全系に一様の門 —— 第315便d): 門の欄だけを器の純関数で作り直した(走行の行 E と t = 0 の写し P は元の正本のまま —— r_1PN・帯の数は同じ)',
    from: { generatedAt: P0.meta && P0.meta.generatedAt || null, targetSha256: P0.targetSha256, scopeSha256: P0.meta && P0.meta.scopeSha256 || null, codeSha256: P0.meta && P0.meta.codeSha256 || null, elapsedS: P0.elapsedS },
    htmlSame: !!scope.htmlSame, scopeSame: !!scope.scopeSame, kept: ['P', 'E', 'plan', 'book'], rebuilt: ['gate', 'live', 'T', 'K', 'W', 'G', 'D', 'cost', 'gates', 'stats'] };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W314C_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const stage = argOf('--stage') || 'outer';
  if (!STAGES.includes(stage)) throw new Error('--stage は ' + STAGES.join('|'));
  const quick = process.env.W314C_QUICK === '1', OUT_MAIN = stage === 'em' ? OUT_EM : OUT_OUTER;
  const OUT = process.env.W314C_OUT ? (path.isAbsolute(process.env.W314C_OUT) ? process.env.W314C_OUT : path.join(ROOT, process.env.W314C_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W314C_OUT) throw new Error('試走(W314C_QUICK=1)は W314C_OUT を指定する(正本を書かない)');
  const ALL = stage === 'em' ? PARTS_EM : PARTS_OUTER, parts = process.env.W314C_PARTS ? process.env.W314C_PARTS.split(',') : ALL.slice();
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const regate = process.argv.includes('--regate');
  if (regate && (stage !== 'outer' || quick || process.env.W314C_FROM)) throw new Error('--regate は段 outer の正本だけ(試走・W314C_FROM と一緒にしない)');
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  let reuse = null, reuseFrom = null;
  if (process.env.W314C_FROM) {   // 同じ html・同じ器の版・同じ段の走行の行を使い回す(純関数の段だけを作り直す)
    const f = path.isAbsolute(process.env.W314C_FROM) ? process.env.W314C_FROM : path.join(ROOT, process.env.W314C_FROM);
    const P0 = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (P0.targetSha256 === targetSha256 && P0.version === HARNESS_VERSION && P0.stage === stage && P0.E) { reuse = P0.E.rows; reuseFrom = path.relative(ROOT, f); }
    else throw new Error('W314C_FROM: html か器の版か段が違う(' + f + ')');
  }
  const NW = Math.max(1, Number(process.env.W314C_WORKERS) || 2), cstat = { resumed: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W314C_CACHE ? path.resolve(process.env.W314C_CACHE) : null, targetSha256, cstat);
  const log = (r) => console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・' + (r.spec.via === 'outer'
    ? Object.entries(r.windows).map(([N, w]) => 'N' + N + ' ' + Number(w.apsNew).toExponential(9)).join(' ') : 'EMB ' + Number(r.emb).toFixed(9) + '・月 ' + (r.moon ? Number(r.moon.sidH).toFixed(9) + ' d' : '—'))
    + '・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`);
  const plan = stage === 'em' ? (quick ? EM_QUICK : EM_PLAN) : (quick ? OUTER_QUICK : OUTER_PLAN);
  console.log('第314便c k1' + stage + ': ' + (quick ? '試走' : '正本') + '・workers ' + NW + '・段 ' + parts.join(',') + (reuseFrom ? '・行の使い回し ' + reuseFrom : ''));
  let R;
  if (regate) {   // 第315便d(AN410): 門の欄だけを作り直す(走行しない)
    const P0 = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const scope = { htmlSame: P0.targetSha256 === targetSha256, scopeSame: !!(P0.meta && P0.meta.scopeComplete === true && W281A_SCOPE.scopeComplete === true && P0.meta.scopeSha256 === W281A_SCOPE.scopeSha256) };
    R = regateOuter(HP, P0, scope);
    console.log('  --regate: 元の正本 ' + (P0.meta && P0.meta.generatedAt) + '・html ' + (scope.htmlSame ? '同じ' : '違う') + '・領域 hash ' + (scope.scopeSame ? '同じ' : '違う'));
  } else R = await (stage === 'em' ? runEm : runOuter)(HP, { quick, parts, plan, run, log, reuse });
  const out = { version: HARNESS_VERSION, planet3HarnessVersion: PL3.HARNESS_VERSION, planet3LibVersion: Q.LIB_VERSION, confirmHarnessVersion: CF.HARNESS_VERSION, confirmLibVersion: C.LIB_VERSION,
    k1confirmHarnessVersion: K13.HARNESS_VERSION, an336LibVersion: AN.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, emxVersion: EMX.EXTRACTOR_VERSION, generator: 'tests/exp-w314c-k1outer.mjs' + (stage === 'em' ? ' --stage em' : ''),
    target: TARGET, targetSha256, reuseFrom,
    ruling: '原仮定者の裁定(第116報)の補足(太陽系の各天体の検証の後に 16 体の三次元サンプル)・決断事項 AN410(' + (stage === 'em' ? '推奨 —— 外惑星の相対の門と数値の帯の門・裁定で変わる' : '全系に一様の門 abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN)・帯 ≤ min(ε_num, 1e-2 q_1PN) —— 第315便d') + ')・AN405(有限質量比は既知の寄与)・' +
      'AN401(比例定数は 1PN だけ・A1 は暦表ごとの列)・AN396′(ε_fit・ε_num)・AN336・統括の検証項目 R240。κ は一次の値 κ₀ = 10G/(C₁c²) に固定(合わせない)。確認の材料(在位へ入れない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;   // 再開の写しから読んだ走行の本数(読まなければ鍵を作らない)
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w314c-k1outer.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/exp-w313d-k1confirm.mjs', 'tests/exp-w312d-confirm.mjs', 'tests/lib-w312d-confirm.mjs', 'tests/exp-w311d-planet3.mjs', 'tests/lib-w311d-planet3.mjs',
    'tests/exp-w303c-earthmoon.mjs', 'tests/lib-w306a-an336.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第314便c', target: TARGET, code: CODE,
    inputs: [TARGET, LEGACY7_DATA_FILE, PL3.DECL_FILE, AN336_OUT, AN.CANDIDATE_FILE, AN.AUDIT_FILE] }), {
    harnessVersion: HARNESS_VERSION, stage,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W314C_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  if (stage === 'em') console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', 'r_1PN(h/4) ' + (out.K ? out.K.r1pn : null), '2 段目 ' + (out.S ? out.S.nSame + '/' + out.S.n : null));
  else console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', '主の窓 ' + JSON.stringify(out.W ? Object.fromEntries(Object.entries(out.W.systems).map(([k, v]) => [k, v.main])) : null),
    '門 ' + JSON.stringify(out.G ? Object.fromEntries(Object.entries(out.G.systems).map(([k, v]) => [k, v.pass])) : null), 'r_1PN ' + JSON.stringify(out.G ? Object.fromEntries(Object.entries(out.G.systems).map(([k, v]) => [k, v.r])) : null));
}
if (IS_MAIN) await main();

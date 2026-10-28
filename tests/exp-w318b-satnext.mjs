// 第318便b(原仮定者の指示(第120報)・決断事項 AN436・AN437・AN439・AN440・AN442・統括の検証項目 R255):
// **衛星の次の正本の器**(段 satnext-318b —— 正本 tests/out/satnext-w318b.json)。
// 確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の本の宣言は変えない(写しは第315便d の lib の bookOf で組み、q11 の宣言の形と変種は
// tests/lib-w318b-satnext.mjs で写しの外から差し替える —— 既存の lib の関数と版は変えない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState をそのまま呼ぶ)。走行は子プロセス(W318B_WORKERS —— 既定 2)。子は同じ衛星・変種・刻みの q10 と q11 を続けて走らせ、差の直接の回帰まで作る。
//
// ■ 何をするか(n = 2・K1 のまま —— 走行の前に宣言した契約 CONTRACT を正本の contract に同じ文で書く)
//   P t = 0 の読み口: AN439 の確かめ直し(在位の 7 本の relativeDrag = 宣言の形・旧 q11〔外殻 + spinDrag〕と V2 の 1 公転の状態のビット同一 —— 6 衛星 × 二体・三体)・
//     V1a の pair の mask(太陽の能動の対の β = 0・衛星の母惑星からの β は V0 とビット同一 —— 分母 W は太陽の場を残す)・V3 の写し(母惑星が原点・相対の状態が同じ)・
//     母惑星の公転周期 P_母 と衛星の公転の数
//   E 走行: ガニメデ・カリスト・タイタン × V1a・V0 × h・h/2・h/4 —— 1.5 P_母(共通の座標時刻)まで。トリトン × V3V1a・V1a × h・h/2・h/4 —— 128 公転。
//     1 ulp の診断の列(衛星の初期の x を 1 ulp 上げた q10 と q11 —— V1a〔トリトンは V3V1a〕× h —— 主の窓まで)
//   A 判定: 模型 LS(L + λ☉ の 1・2 倍の調和)の M0 型の差を W1・W2 × 刻みで並べ、RULE(R1 ∧ R2 —— HARM_RULE の型・閾値 1e-2)。
//     記録の列: 模型 L・差の直接の回帰(回る ê₁₀ —— 主の判定と同じ規則で並べる・固定の ê₀ は記録)・64 公転の M0(第317便c と同じ窓 —— 連続性)・V0 − V1a・二体との差
//   TRI トリトンの離心率ベクトルの差の表(窓 64・128 公転 —— 慣性速度の接触の離心ベクトル・公転ごとの平均・比較の時刻・刻みの帯・Δe⊥/e の傾き)
//   ULP 1 ulp の診断の列(合否に使わない)
//
// ■ 試走: W318B_QUICK=1(W318B_OUT が要る —— 正本を書かない)。探索: W318B_EXPLORE=1(イオ・エウロパ × h・h/2 —— W318B_OUT が要る)。
//   再開: W318B_CACHE=<dir>(走行 1 本ごとの結果を逐次書き、同じ html・同じ器の版・同じ本・同じ刻みがあれば読む)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」。近似要素の種を観測レコードと呼ばない。
//   数値の帯は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断・窓は抽出の感度診断。決まらない列は「この予算では永年項として決まらない」(法則の否定・効きが無いとは書かない)。
//   V1a は切り口(太陽の引きずりの効きの否定ではない)・V0 − V1a は反実仮想の差(独立な線形の寄与の和ではない)。V3 はガリレイの変換(真の相対の積分ではない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as C from './lib-w317c-satcut.mjs';
import * as M from './lib-w317a-satmeas.mjs';
import * as NX from './lib-w318b-satnext.mjs';
import * as X315 from './exp-w315d-satk1.mjs';
import * as X316 from './exp-w316d-sath.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 在位の本は .find で引く〔jupiterGalilean・saturnRingReal の値・在位の 7 本の relativeDrag の照合〕・
//   "saturn" は母惑星の鍵の文字列が 🪐 の id と同じ綴りで数えられた分・"ab"・"ch"・"ctx"・"cw"・"T"・"$" は import した第315便d・第316便d の器の綴りで数えられた分〔広めの宣言は許される —— 第317便c と同じ宣言〕。
//   読み口 inertialDragGalaxyAxialState は第317便c の lib の名で数えられた分)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w318b-satnext-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', '観測レコード', 'V1a を通常の三体の永年の予測とする', 'V0 − V1a を独立な線形の寄与の和とする', 'V3 を真の相対の積分とする'];
export const OUT_SATNEXT = 'tests/out/satnext-w318b.json';
export const SATCUT_OUT = 'tests/out/satcut-w317c.json';
export const KINDS = Object.freeze(['q10', 'q11']);
/** 判定の規則(lib の RULE —— HARM_RULE〔w316d-harm-rule-1〕の R1 ∧ R2 の型・閾値 1e-2・窓の対を W1・W2 に置いた —— 走行の前に宣言) */
export const RULE = NX.RULE;
export const HARM_RULE = X316.HARM_RULE;
/**
 * 契約(走行の前に宣言 —— 正本の contract に同じ文)。費用(枝の実測 —— 三体の q11 は 1 步 0.47〜0.48 ms・q10 は 0.014 ms〔混まない箱〕)で
 * 2 周期の走行(3 衛星 × 2 変種 × 3 刻みで 2 worker 約 2.1 時間)は予算の外 —— 1.5 周期の走行の W1 = (0, P_母] と W2 = (P_母/2, 3P_母/2] を宣言した(R1 は緩めない)。
 */
export const CONTRACT = Object.freeze({
  version: 'w318b-contract-1',
  declared: '走行の前に宣言(器の定数 CONTRACT —— 結果を見て変えない)',
  model: '模型 LS = L 模型(直線 + 衛星の位置の角 θ の 1〜3 倍の調和 —— apsisRate と同じ列)+ λ☉ の 1 倍・2 倍の調和(cos λ☉・sin λ☉・cos 2λ☉・sin 2λ☉)。λ☉ = 母惑星の太陽のまわりの平均の経度 λ☉,0 + n_母 t(n_母 = 2π/P_母 —— 凍結の写しの t = 0 の太陽と母惑星 + 衛星の重心の二体の活力の式)。調和は cos・sin の対なので λ☉,0 は回帰の値を変えない',
  windows: '窓は母惑星の公転周期 P_母 の整数倍(共通の座標時刻 —— 標本 t_k = k h の t0 < t_k ≤ t1)。主の窓 W1 = (0, P_母]・確かめの窓 W2 = (P_母/2, 3P_母/2](別の開始位相 —— 2 周期の走行は費用で予算の外なので 1.5 周期の走行を宣言)。V1a・V0 に同じ窓',
  measure: 'M0 型(窓の終端を共通の座標時刻で切った q10 と q11 の同じ模型の回帰の近点の率の差 —— 各走行の θ)。差の直接の回帰は回る ê₁₀ を主(同じ規則で判定を並べる)・固定の ê₀ は記録。64 公転の M0(第317便c と同じ窓 8・16・32・64)は連続性の記録',
  rule: NX.RULE.note,
  variants: 'V1a(主の列 —— 太陽の引きずりの対を外す pairs [[1,2]]・重力は残す)・V0(通常の三体 —— 残す)・V0 − V1a(太陽の引きずりの効きの記録 —— 初期の分解と軌道の変化を含む反実仮想の差・独立な線形の寄与の和とは扱わない)。q11 は在位の 7 本と同じ宣言の形(AN439)',
  grid: 'ガニメデ・カリスト・タイタン × h・h/2・h/4(720 步/公転 × 1・2・4)を正本に。イオ・エウロパは h・h/2 から(探索 —— 正本の段の目安 2 worker 60 分を超えるので scratch)',
  triton: 'トリトン: V3V1a(初期の母惑星の位置と速度を全粒子から引くガリレイの変換 + V1a)と V1a(写しの座標のまま —— 対照)× h・h/2・h/4 × 128 公転。表の量は離心率ベクトルの差(公転 64・128 —— 慣性速度の接触の離心ベクトルの公転ごとの平均・q10 の向きに対する平行と垂直・刻みの帯・公転 1..N の Δe⊥/e の傾き)。近点は記録だけ。真の相対の積分(母惑星が常に原点 —— 母惑星の加速度と移送を差し引く式)はエンジンに無く、本便は作らない',
  ulp: '1 ulp の診断の列: 衛星の初期の x を 1 ulp 上げた写し(q10 と q11 の両方)を h で主の窓まで(トリトンは V3V1a・128 公転)—— 基の走行との差を丸めの床の目安として記録(合否に使わない)',
  notDecided: '決まらなければ「この予算では永年項として決まらない」と書く(有限の格子の通過と永年の値の確定を区別 —— 決まった = この格子と窓の規則を通った、の意味)' });
/** 計画(正本) */
export const PLAN = Object.freeze({ sats: Object.freeze(['ganymede', 'callisto', 'titan']), variants: Object.freeze(['V1a', 'V0']), divs: Object.freeze([1, 2, 4]), stepsPerOrbit: 720, span: 1.5, pScale: 1,
  m0Wins: Object.freeze([8, 16, 32, 64, 128, 256]),
  triton: Object.freeze({ sat: 'triton', variants: Object.freeze(['V3V1a', 'V1a']), runN: 128, divs: Object.freeze([1, 2, 4]), m0Wins: Object.freeze([8, 16, 32, 64, 128]), evecN: Object.freeze([64, 128]) }),
  ulp: Object.freeze({ div: 1, span: 1, sats: Object.freeze(['ganymede', 'callisto', 'titan', 'triton']), triVariants: Object.freeze(['V3V1a', 'V1a']) }) });
/** 試走(窓は P_母 の 1/32 —— 器の配管の確かめだけ) */
export const QUICK = Object.freeze({ sats: Object.freeze(['callisto']), variants: PLAN.variants, divs: Object.freeze([1, 2]), stepsPerOrbit: 360, span: 1.5, pScale: 1 / 32, m0Wins: Object.freeze([2, 4, 8]),
  triton: Object.freeze({ sat: 'triton', variants: PLAN.triton.variants, runN: 8, divs: Object.freeze([1, 2]), m0Wins: Object.freeze([2, 4, 8]), evecN: Object.freeze([4, 8]) }),
  ulp: Object.freeze({ div: 1, span: 1, sats: Object.freeze(['callisto', 'triton']), triVariants: Object.freeze(['V3V1a', 'V1a']) }) });
/** 探索(イオ・エウロパ × h・h/2 —— scratch の JSON) */
export const EXPLORE = Object.freeze({ sats: Object.freeze(['io', 'europa']), variants: PLAN.variants, divs: Object.freeze([1, 2]), stepsPerOrbit: 720, span: 1.5, pScale: 1, m0Wins: PLAN.m0Wins, triton: null, ulp: null });
const finiteOr = (x) => (Number.isFinite(x) ? x : null);
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);

/* ───────── 走行の鍵 ───────── */
const bookSha = (b) => crypto.createHash('sha256').update(JSON.stringify(b)).digest('hex');
export const rowKey = (sp) => sp.job + '|' + sp.v + '|' + sp.sat + '|div=' + sp.div + (sp.ulp ? '|ulp' : '');
export function specBooks(HP, sp, sd) {
  const seed = sd || L.seedOf(HP, sp.sat);
  return Object.fromEntries(KINDS.map((k) => [k, NX.variantBook(HP, sp.sat, k, sp.v, { seed, stepsPerOrbit: sp.S, ulp: !!sp.ulp })]));
}
export const runKeyOf = (books, sp) => crypto.createHash('sha256').update(bookSha(books.q10) + '|' + bookSha(books.q11) + '|' + JSON.stringify(sp)).digest('hex').slice(0, 32);
/** 計画 → 走行の仕様(主・トリトン・1 ulp) */
export function specsOf(plan) {
  const out = [];
  for (const sat of plan.sats) for (const v of plan.variants) for (const div of plan.divs)
    out.push({ job: 'main', sat, v, div, S: plan.stepsPerOrbit, span: plan.span, pScale: plan.pScale, m0Wins: plan.m0Wins.slice() });
  const T = plan.triton;
  if (T) for (const v of T.variants) for (const div of T.divs)
    out.push({ job: 'tri', sat: T.sat, v, div, S: plan.stepsPerOrbit, runN: T.runN, m0Wins: T.m0Wins.slice(), evecN: T.evecN.slice() });
  const U = plan.ulp;
  if (U) for (const sat of U.sats) {
    if (T && sat === T.sat) { for (const v of U.triVariants) out.push({ job: 'tri', sat, v, div: U.div, S: plan.stepsPerOrbit, runN: T.runN, m0Wins: T.m0Wins.slice(), evecN: T.evecN.slice(), ulp: true }); }
    else if (plan.sats.includes(sat)) out.push({ job: 'main', sat, v: 'V1a', div: U.div, S: plan.stepsPerOrbit, span: U.span, pScale: plan.pScale, m0Wins: plan.m0Wins.filter((N) => N <= 64), ulp: true });
  }
  return out;
}

/* ───────── 走行(子)───────── */
const perC = (rate, Tsec) => (Number.isFinite(rate) ? AP.toArcsecPerCentury(rate, Tsec) : null);
export function runSpec(HP, sp) {
  const sd = L.seedOf(HP, sp.sat), P = L.parentOf(sd.parent), books = specBooks(HP, sp, sd), t0 = Date.now(), runs = {}, smp = {};
  let pp = null;
  for (const kind of KINDS) {
    const book = books[kind], vr = HP.validatePreset(clone(book));
    if (!vr.ok) return { spec: sp, status: 'rejected', kind, err: JSON.stringify(vr.errors).slice(0, 300) };
    const S = HP.coord3d.makeSim(); S.build(clone(vr.preset));
    if (S.coord3d !== true) return { spec: sp, status: 'rejected', kind, err: '三次元の本ではない' };
    const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]), h = book.physics.stepDt, dt = h / sp.div, tk = Date.now();
    const sm = L.attachSatSampler(S, { ci: ip, oi: is, mu, every: sp.div, pole: P.orbitPole });
    if (!pp) pp = NX.parentPeriodOf(sd, sm.basis);
    const tEnd = sp.job === 'tri' ? sp.runN * book.timeRef.pRef : sp.span * pp.Pparent * sp.pScale;
    const nSamp = Math.max(Math.ceil(tEnd / h) + 1, Math.max(...sp.m0Wins) * book.timeRef.stepsPerOrbit), kEnd = nSamp * sp.div;
    let k = 0, stop = 'done';
    for (; k < kEnd; k++) {   // 第315便d の runBook と同じ回し方(最初の 64 公転は第317便c の走行と同じ步)
      S.step(dt);
      if (S.coord3dHalt) { stop = 'coord3dHalt'; k++; break; }
      if (S.inertialDragHalt === true) { stop = 'solveHalt'; k++; break; }
      if (S.hasNaN()) { stop = 'nan'; k++; break; }
    }
    const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
    smp[kind] = { s: sm.samples(), book, unbound: sm.unbound() }; sm.detach();
    runs[kind] = { steps: k, kEnd, stop, complete: stop === 'done', nan: S.hasNaN(), unbound: smp[kind].unbound, nSamp: smp[kind].s.t.length, tEnd, h, dt, pRef: book.timeRef.pRef,
      warnings: (vr.warnings || []).length, betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: (Date.now() - tk) / 1000 };
  }
  const s10 = smp.q10.s, s11 = smp.q11.s, b10 = smp.q10.book, b11 = smp.q11.book, Tsec = Math.pow(10, b10.scaleExp.T), SO = b10.timeRef.stepsPerOrbit;
  let sameTimes = s10.t.length === s11.t.length; if (sameTimes) for (let i = 0; i < s10.t.length; i++) if (!Object.is(s10.t[i], s11.t[i])) { sameTimes = false; break; }
  const out = { spec: sp, status: 'run', runs, sameTimes, complete: runs.q10.complete && runs.q11.complete && !runs.q10.unbound && !runs.q11.unbound,
    pp: { PparentDays: pp.Pparent * Tsec / 86400, orbitsPerParent: pp.orbitsPerParent, nParent: pp.nParent, lam0: pp.lam0 }, m0: {} };
  for (const N of sp.m0Wins) {
    const a = C.m0Of(s10, b10, N), b = C.m0Of(s11, b11, N);
    out.m0[N] = { q10: a ? a.aps : null, q11: b ? b.aps : null, d: a && b ? b.aps - a.aps : null, nOk: !!(a && b && a.n === N * SO && b.n === N * SO) };
  }
  if (sp.job === 'main') {
    const lam = NX.lamOf(s10.t, pp), Pw = pp.Pparent * sp.pScale;
    out.win = {};
    for (const w of NX.WINDOWS) {
      if (w.to > sp.span + 1e-12) continue;
      const base0 = { t0: w.from * Pw, t1: w.to * Pw }, o = { t0: base0.t0, t1: base0.t1, models: {} };
      for (const md of NX.MODELS) {
        const base = Object.assign({ K: md.K, KL: md.KL }, base0), D10 = NX.designOf(s10, lam, base);
        if (!D10) { o.models[md.key] = null; continue; }
        const dg = M.designDiag(D10.X);
        const f10 = NX.fitLS(s10, lam, Object.assign({ design: D10, diag: true, diagOf: dg }, base)), f11 = NX.fitLS(s11, lam, Object.assign({ diag: false }, base));
        const df = NX.diffFitLS(s10, s11, lam, Object.assign({ design: D10, diagOf: dg }, base));
        const q10 = perC(f10 && f10.rate, Tsec), q11 = perC(f11 && f11.rate, Tsec);
        o.models[md.key] = { q10, q11, d: q10 !== null && q11 !== null ? q11 - q10 : null, rot: df && df.sameTimes ? perC(df.c1rot, Tsec) : null, fix: df && df.sameTimes ? perC(df.c1fix, Tsec) : null,
          seRot: df && df.seRot !== null ? perC(df.seRot, Tsec) : null, harmRot: df ? df.harmRot : null, rmsRot: df ? df.rmsRot : null, se10: f10 && Number.isFinite(f10.se) ? perC(f10.se, Tsec) : null, e10: f10 ? f10.e : null, e11: f11 ? f11.e : null,
          cond: dg.cond, rank: dg.rank, cols: D10.cols, n: D10.idx.length, harmLam10: f10 ? f10.harmLam : null, harmLam11: f11 ? f11.harmLam : null, diffSameTimes: df ? df.sameTimes : null };
        if (md.KL === 0) { const ref = AP.apsisRate(s10, { t0: base.t0, t1: base.t1, K: md.K }); o.apsisSame = !!(ref && f10 && Object.is(ref.rate, f10.rate)); }
        if (!Number.isFinite(o.tFirst)) { o.tFirst = s10.t[D10.idx[0]]; o.tLast = s10.t[D10.idx[D10.idx.length - 1]]; o.nSamples = D10.idx.length; }
      }
      out.win[w.key] = o;
    }
  }
  if (sp.job === 'tri') {
    out.evec = {};
    for (const N of sp.evecN) {
      const r = NX.evecRow(s10, s11, N, SO), sl = NX.perpSlope(s10, s11, N, SO);
      out.evec[N] = r ? Object.assign(r, { tMeanDays: r.tMean * Tsec / 86400, perpSlope: sl ? perC(sl.slope, Tsec) : null, perpSlopeRms: sl ? sl.rms : null }) : null;
    }
  }
  out.wallSec = (Date.now() - t0) / 1000;
  return out;
}

/* ───────── 子プロセスの池と再開の写し(第317便c と同じ型 —— 鍵は本の sha と仕様)───────── */
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const proc = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let sout = '', serr = '';
    proc.stdout.on('data', (d) => { sout += d; }); proc.stderr.on('data', (d) => { serr += d; });
    proc.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(JSON.stringify(sp) + ': ' + serr.slice(0, 600)));
      try { res(JSON.parse(sout.slice(sout.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(JSON.stringify(sp) + ': 出力が JSON でない ' + sout.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, targetSha256, stat) {
  const memo = new Map();
  const fileOf = (key) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + NX.LIB_VERSION + '|' + L.LIB_VERSION + '|' + targetSha256 + '|' + key).digest('hex').slice(0, 32) + '.json');
  if (dir) fs.mkdirSync(dir, { recursive: true });
  return (key, sp, pri) => {
    if (memo.has(key)) { stat.shared++; return memo.get(key); }
    let p = null;
    if (dir) { try { const c = JSON.parse(fs.readFileSync(fileOf(key), 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.key === key && c.row) { stat.resumed++; p = Promise.resolve(c.row); } } catch (e) { /* 無い */ } }
    if (!p) p = run(sp, pri).then((r) => { if (dir) { const f = fileOf(key), tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, key, row: r })); fs.renameSync(tmp, f); } return r; });
    memo.set(key, p); return p;
  };
}

/* ───────── 段 P(t = 0 の読み口と 1 公転の短い格子 —— 親で)───────── */
const sameState = (A, B) => { for (const q of ['x', 'y', 'z', 'vx', 'vy', 'vz']) for (let i = 0; i < A.n; i++) if (!Object.is(A[q][i], B[q][i])) return false; return true; };
function stepped(HP, book, n, dt) { const vr = HP.validatePreset(clone(book)); if (!vr.ok) return null; const S = HP.coord3d.makeSim(); S.build(clone(vr.preset)); for (let k = 0; k < n; k++) S.step(dt); return S; }
/** AN439 の確かめ直し(安い形): 旧 q11(外殻 + spinDrag —— 第315便d の K1_RULE_DRAG)と宣言の形 V2 の 1 公転(720 步 × h —— 試走は stepsPerOrbit 步)の状態のビット同一(6 衛星 × 二体・三体) */
export function v2Probe(HP, S, sats) {
  const out = {};
  for (const sat of sats) {
    const sd = L.seedOf(HP, sat);
    for (const sys of L.SYSTEMS) {
      const a = L.bookOf(HP, sat, sys, 'q11', { seed: sd, stepsPerOrbit: S }), b = NX.v2Book(HP, sat, sys, 'q11', { seed: sd, stepsPerOrbit: S });
      const A = stepped(HP, a, S, a.physics.stepDt), B = stepped(HP, b, S, b.physics.stepDt);
      out[sat + '|' + sys] = { steps: S, accepted: !!(A && B), bitSame: !!(A && B && sameState(A, B)), oldDrag: clone(a.physics.relativeDrag), newDrag: clone(b.physics.relativeDrag) };
    }
  }
  return out;
}
export function partP(HP, plan) {
  const out = { inPos: {}, v2: v2Probe(HP, plan.stepsPerOrbit, L.SAT_SEEDS.map((s) => s.key)), pairs: {}, v3: {}, parents: {} };
  for (const id of C.IN_POS_BOOKS) { const p = HP.allPresets().find((q) => q.id === id); out.inPos[id] = p ? JSON.stringify(p.physics.relativeDrag) === JSON.stringify(NX.Q11_DRAG) : false; }
  const sats = plan.sats.slice().concat(plan.triton ? [plan.triton.sat] : []);
  for (const sat of sats) {
    const sd = L.seedOf(HP, sat), b0 = NX.variantBook(HP, sat, 'q11', 'V0', { seed: sd, stepsPerOrbit: plan.stepsPerOrbit }), b1 = NX.variantBook(HP, sat, 'q11', 'V1a', { seed: sd, stepsPerOrbit: plan.stepsPerOrbit });
    const z0 = C.stateOf(HP, b0), z1 = C.stateOf(HP, b1);
    if (z0.ok && z1.ok) {
      const rv = (z, i) => z.isq.receivers.find((r) => r.i === i);
      out.pairs[sat] = { accepted: true, sunBetaV1a: [1, 2].map((i) => rv(z1, i).beta[0]), sunAsReceiverV1a: rv(z1, 0) ? rv(z1, 0).betaSum : null,
        satFromPlanetSame: Object.is(rv(z0, 2).beta[1], rv(z1, 2).beta[1]), planetFromSatSame: Object.is(rv(z0, 1).beta[2], rv(z1, 1).beta[2]),
        satFromPlanet: rv(z1, 2).beta[1], satFromSunV0: rv(z0, 2).beta[0], planetFromSunV0: rv(z0, 1).beta[0] };
    } else out.pairs[sat] = { accepted: false, err: (z0.err || '') + (z1.err || '') };
    const pr = NX.parentPeriodOf(sd, null);
    out.parents[sat] = { parent: sd.parent, PparentDays: pr.Pparent * Math.pow(10, L.UNITS.T) / 86400, PseedDays: sd.P * Math.pow(10, L.UNITS.T) / 86400, orbitsPerParent: pr.orbitsPerParent };
  }
  if (plan.triton) {
    const sat = plan.triton.sat, sd = L.seedOf(HP, sat);
    for (const kind of KINDS) {
      const b = NX.variantBook(HP, sat, kind, 'V3V1a', { seed: sd, stepsPerOrbit: plan.stepsPerOrbit }), b0 = NX.variantBook(HP, sat, kind, 'V1a', { seed: sd, stepsPerOrbit: plan.stepsPerOrbit }), ip = b.timeRef.pair[0];
      let mx = 0; for (let i = 1; i < b.bodies.length; i++) for (const q of ['x', 'y', 'z', 'vx', 'vy', 'vz']) { const a = b.bodies[i][q] - b.bodies[0][q], z = b0.bodies[i][q] - b0.bodies[0][q]; mx = Math.max(mx, Math.abs(a - z) / Math.max(Math.abs(z), 1e-300)); }
      out.v3[kind] = { planetAtOrigin: ['x', 'y', 'z', 'vx', 'vy', 'vz'].every((q) => b.bodies[ip][q] === 0), relDevMax: mx, sunDist: Math.hypot(b.bodies[0].x, b.bodies[0].y, b.bodies[0].z),
        satDist: Math.hypot(b.bodies[2].x, b.bodies[2].y, b.bodies[2].z), satDistV1a: Math.hypot(b0.bodies[2].x, b0.bodies[2].y, b0.bodies[2].z) };
    }
  }
  return out;
}

/* ───────── 段 A(E の行から純関数 —— QA が作り直す)───────── */
const rowOf = (J, sp) => { const k = J.E.index[rowKey(sp)], r = k ? J.E.runs[k] : null; return r && r.status === 'run' ? r : null; };
/** 模型 × 列(d = 回帰の差・rot = 差の直接の回帰〔回る ê₁₀〕・fix = 固定の ê₀〔記録〕)の W1・W2 × 刻みの値と判定 */
export function partA(J) {
  const ds = J.E.divs.slice().sort((a, b) => a - b), out = { rule: clone(RULE), contract: J.contract.version, cells: {}, answer: {} };
  for (const sat of J.E.sats) for (const v of J.E.variants) {
    const rows = Object.fromEntries(ds.map((d) => [d, rowOf(J, { job: 'main', v, sat, div: d })])), o = { sat, v, models: {}, m0: { byWin: {} } };
    for (const md of NX.MODELS) for (const col of ['d', 'rot', 'fix']) {
      const vals = {};
      for (const w of NX.WINDOWS) { vals[w.key] = {}; for (const d of ds) { const r = rows[d], z = r && r.win && r.win[w.key] && r.win[w.key].models[md.key]; vals[w.key][d] = z && Number.isFinite(z[col]) ? z[col] : null; } }
      o.models[md.key + '|' + col] = { vals, verdict: NX.verdictOf(vals, ds) };
    }
    const r4 = rows[ds[ds.length - 1]];
    o.diag = r4 && r4.win ? Object.fromEntries(Object.entries(r4.win).map(([wk, w]) => [wk, Object.fromEntries(Object.entries(w.models).map(([mk, z]) => [mk, z ? { cond: z.cond, rank: z.rank, cols: z.cols, n: z.n, se10: z.se10, seRot: z.seRot, harmLam10: z.harmLam10, harmLam11: z.harmLam11, harmRot: z.harmRot, rmsRot: z.rmsRot } : null]))])) : null;
    for (const N of J.E.m0Wins) { o.m0.byWin[N] = {}; for (const d of ds) { const r = rows[d]; o.m0.byWin[N][d] = r && r.m0[N] ? r.m0[N].d : null; } }
    // 64 公転の M0 の判定(第317便c と同じ HARM_RULE の型 —— 窓 32 → 64 —— 連続性の記録)
    o.m0.verdict64 = M.ruleOf(Object.fromEntries([32, 64].map((N) => [N, o.m0.byWin[N] || {}])), { divs: ds, windows: [32, 64] }, HARM_RULE.rel);
    out.cells[v + '|' + sat] = o;
  }
  // V0 − V1a(記録の列 —— 主の模型 LS の d・W1・刻みごと)と二体との差
  for (const sat of J.E.sats) {
    const a = out.cells['V0|' + sat], b = out.cells['V1a|' + sat];
    if (a && b) {
      const va = a.models['LS|d'], vb = b.models['LS|d'], byDiv = {};
      for (const w of NX.WINDOWS) { byDiv[w.key] = {}; for (const d of ds) { const x = va.vals[w.key][d], y = vb.vals[w.key][d]; byDiv[w.key][d] = x !== null && y !== null ? x - y : null; } }
      const bm = (z) => (z.verdict.bands.length && z.verdict.bands.every((x) => x !== null) ? Math.max(...z.verdict.bands) : null), bA = bm(va), bB = bm(vb);
      out.cells['V0-V1a|' + sat] = { sat, v: 'V0-V1a', vals: byDiv, verdict: NX.verdictOf(byDiv, ds), bandSum: bA !== null && bB !== null ? bA + bB : null };
    }
    const two = J.ref && J.ref.two ? J.ref.two[sat] : null;
    for (const v of J.E.variants) { const c = out.cells[v + '|' + sat]; if (!c) continue; const x = c.models['LS|d'].verdict.v;
      c.vsTwo = two && Number.isFinite(two.v) && Number.isFinite(x) ? { two: two.v, twoDetermined: two.determined, dv: x - two.v, rel: (x - two.v) / Math.abs(two.v) } : null; }
    out.answer[sat] = Object.fromEntries(J.E.variants.map((v) => { const c = out.cells[v + '|' + sat]; return [v, c ? { LS: c.models['LS|d'].verdict.determined, rot: c.models['LS|rot'].verdict.determined, L: c.models['L|d'].verdict.determined } : null]; }));
  }
  return out;
}
/** トリトンの離心率ベクトルの差の表(V3V1a・V1a × 公転 N × 刻み —— 帯は abs(Δe)・Δe∥・Δe⊥ の刻みの差) */
export function partTri(J) {
  if (!J.E.triton) return null;
  const T = J.E.triton, ds = T.divs.slice().sort((a, b) => a - b), out = { velocity: '慣性速度 S.v(エンジンの力学速度)の母惑星に対する差と相対位置からの接触の離心ベクトル AP.eccVector(r, v, μ = G(m_P + m_s))',
    basis: '衛星の t = 0 の軌道面の基底(P = r̂(0)・Q = Ŵ(0) × P)の成分', time: '公転 N = 共通の座標時刻の標本 (N−1)S ≤ j < N S(t = j h)の平均 —— q10 と q11 で同じ標本の時刻(Δt̄ = 0)', cells: {} };
  for (const v of T.variants) for (const N of T.evecN) {
    const byDiv = {};
    for (const d of ds) { const r = rowOf(J, { job: 'tri', v, sat: T.sat, div: d }); byDiv[d] = r && r.evec ? r.evec[N] : null; }
    const f = byDiv[ds[ds.length - 1]], band = (q) => { const b = []; for (let i = 1; i < ds.length; i++) { const x = byDiv[ds[i]], y = byDiv[ds[i - 1]]; b.push(x && y ? Math.abs(x[q] - y[q]) : null); } return b; };
    out.cells[v + '|' + N] = { v, N, fine: f ? { tMeanDays: f.tMeanDays, dtMean: f.dtMean, e10: f.e10, mag: f.mag, par: f.par, perp: f.perp, perpOverE: f.perpOverE, perpSlope: f.perpSlope } : null,
      bands: { mag: band('mag'), par: band('par'), perp: band('perp'), perpSlope: band('perpSlope') }, byDiv: Object.fromEntries(ds.map((d) => [d, byDiv[d] ? { mag: byDiv[d].mag, par: byDiv[d].par, perp: byDiv[d].perp, perpOverE: byDiv[d].perpOverE, perpSlope: byDiv[d].perpSlope } : null])) };
  }
  out.m0 = {};
  for (const v of T.variants) { out.m0[v] = {}; for (const N of T.m0Wins) { out.m0[v][N] = {}; for (const d of ds) { const r = rowOf(J, { job: 'tri', v, sat: T.sat, div: d }); out.m0[v][N][d] = r && r.m0[N] ? r.m0[N].d : null; } } }
  return out;
}
/** 1 ulp の診断の列(基の走行との差 —— 合否に使わない) */
export function partUlp(J) {
  const out = { note: '衛星の初期の x を 1 ulp 上げた写し(q10 と q11)と基の走行の差 —— 丸めの床の目安(合否に使わない)', cells: {} };
  for (const [rk, key] of Object.entries(J.E.index)) {
    if (!rk.endsWith('|ulp')) continue;
    const u = J.E.runs[key], [job, v, sat, dv] = rk.split('|'), div = Number(dv.slice(4)), b = rowOf(J, { job, v, sat, div });
    if (!u || u.status !== 'run' || !b) { out.cells[rk] = null; continue; }
    const o = { job, v, sat, div, m0: {} };
    for (const N of Object.keys(u.m0)) if (b.m0[N]) o.m0[N] = { d: u.m0[N].d, base: b.m0[N].d, diff: (Number.isFinite(u.m0[N].d) && Number.isFinite(b.m0[N].d)) ? u.m0[N].d - b.m0[N].d : null };
    if (job === 'main' && u.win && b.win) { o.win = {}; for (const wk of Object.keys(u.win)) { o.win[wk] = {}; for (const mk of Object.keys(u.win[wk].models)) { const x = u.win[wk].models[mk], y = b.win[wk] && b.win[wk].models[mk]; o.win[wk][mk] = x && y ? { d: x.d - y.d, rot: x.rot - y.rot } : null; } } }
    if (job === 'tri' && u.evec && b.evec) { o.evec = {}; for (const N of Object.keys(u.evec)) { const x = u.evec[N], y = b.evec[N]; o.evec[N] = x && y ? { mag: x.mag - y.mag, par: x.par - y.par, perp: x.perp - y.perp, perpOverE: x.perpOverE - y.perpOverE } : null; } }
    out.cells[rk] = o;
  }
  return out;
}

/* ───────── 第317便c の正本との照合(64 公転の M0 —— 同じ本・同じ步)と二体の参照 ───────── */
export function prefixOf(J, Jc) {
  const out = { source: SATCUT_OUT, compared: 0, same: 0, diff: [], map: { V0: 'V0', V1a: 'V1a' } };
  if (!Jc || !Jc.A) return Object.assign(out, { note: '第317便c の正本が無い' });
  const pairs = []; for (const sat of J.E.sats) for (const v of J.E.variants) pairs.push({ sat, v });
  if (J.E.triton) pairs.push({ sat: J.E.triton.sat, v: 'V1a', job: 'tri' });
  for (const z of pairs) {
    const c = Jc.A.cells[z.v + '|' + z.sat + '|three']; if (!c) continue;
    for (const d of Jc.E.divs) { const r = rowOf(J, { job: z.job || 'main', v: z.v, sat: z.sat, div: d }); if (!r) continue;
      for (const N of Jc.E.windows) { const x = c.m0.byWin[N] && c.m0.byWin[N].byDiv[d], y = r.m0[N]; if (!x || !y) continue; out.compared++;
        if (Object.is(x.q10, y.q10) && Object.is(x.q11, y.q11)) out.same++; else if (out.diff.length < 8) out.diff.push(z.v + '|' + z.sat + '|div=' + d + '@' + N); } }
  }
  return out;
}
export function refOf(Jc, sats) {
  if (!Jc || !Jc.A) return null;
  const two = {}; for (const sat of sats) { const c = Jc.A.cells['V0|' + sat + '|two']; if (c) two[sat] = { v: c.m0.verdict.v, determined: c.m0.verdict.determined, bandMax: c.m0.verdict.bandMax }; }
  return { source: SATCUT_OUT, note: '二体(第317便c の正本 —— V0・窓 64 公転・h/4・模型 L の M0)', two };
}

/* ───────── 門(器の健全さ —— 判定〔A〕は結果で、ここに入れない)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.T) g.seedsFinite = Object.values(J.T.systems).every((t) => [t.m, t.R, t.a, t.e, t.iEqDeg, t.spin, t.PDays].every(Number.isFinite) && t.e >= 0 && t.e < 1 && t.a > 0);
  if (J.P) {
    g.inPosDecl = Object.values(J.P.inPos).length === C.IN_POS_BOOKS.length && Object.values(J.P.inPos).every(Boolean);
    g.v2Same = Object.values(J.P.v2).length === 2 * L.SAT_SEEDS.length && Object.values(J.P.v2).every((z) => z.accepted && z.bitSame);
    g.pairsMask = Object.values(J.P.pairs).every((z) => z.accepted && z.sunBetaV1a.every((x) => x === 0) && z.satFromPlanetSame && z.planetFromSatSame);
    if (J.P.v3 && Object.keys(J.P.v3).length) g.v3Shift = Object.values(J.P.v3).every((z) => z.planetAtOrigin && z.relDevMax <= 1e-9);
  }
  if (J.E) {
    const runs = Object.values(J.E.runs);
    g.noRejected = runs.every((r) => r.status === 'run');
    g.runsComplete = runs.filter((r) => r.status === 'run').every((r) => r.complete && Object.values(r.m0).every((z) => z.nOk && Number.isFinite(z.d)));
    g.sameTimes = runs.filter((r) => r.status === 'run').every((r) => r.sameTimes && (!r.win || Object.values(r.win).every((w) => Object.values(w.models).every((z) => z && z.diffSameTimes))));
    g.apsisSame = runs.filter((r) => r.status === 'run' && r.win).every((r) => Object.values(r.win).every((w) => w.apsisSame));
    g.windowsFull = runs.filter((r) => r.status === 'run' && r.win).every((r) => Object.values(r.win).every((w) => Number.isFinite(w.nSamples) && Math.abs(w.tLast - w.t1) <= r.runs.q10.h && Math.abs(w.tFirst - w.t0) <= r.runs.q10.h));
    g.allRows = Object.values(J.E.index).every((k) => J.E.runs[k]);
    // q10 は V1a と V0 で同じ本 —— 同じ値(64 公転の M0 の q10)
    g.q10Shared = J.E.sats.every((sat) => J.E.divs.every((d) => { const a = rowOf(J, { job: 'main', v: 'V1a', sat, div: d }), b = rowOf(J, { job: 'main', v: 'V0', sat, div: d }); return !a || !b || Object.keys(a.m0).every((N) => Object.is(a.m0[N].q10, b.m0[N].q10)); }));
    if (J.prefix && !J.quick) g.prefixSame = J.prefix.compared > 0 && J.prefix.same === J.prefix.compared;   // 試走(S 360)は第317便c の行と同じ本でない —— 照合しない
  }
  return g;
}
/** 所要(行ごとの壁時計 —— 段の見積り) */
export function costOf(J) {
  const runs = Object.values(J.E.runs).filter((r) => r.status === 'run'), byJob = {};
  for (const [rk, key] of Object.entries(J.E.index)) { const r = J.E.runs[key]; if (!r) continue; const j = rk.split('|').slice(0, 3).join('|'); byJob[j] = byJob[j] || { rows: 0, wallSec: 0 }; byJob[j].rows++; byJob[j].wallSec += r.wallSec; }
  const steps = runs.reduce((a, r) => a + r.runs.q10.steps + r.runs.q11.steps, 0), q11 = runs.reduce((a, r) => a + r.runs.q11.wallSec, 0), q11Steps = runs.reduce((a, r) => a + r.runs.q11.steps, 0);
  return { runs: runs.length, wallSec: runs.reduce((a, r) => a + r.wallSec, 0), steps, q11MsPerStep: q11Steps ? 1000 * q11 / q11Steps : null, byJob };
}

/* ───────── 走行の計画 ───────── */
export const packJson = X316.packJson;
export async function runSatnext(HP, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'satnext', quick: !!o.quick, explore: !!o.explore, kernel: 'k1', nLoc: 2, rule: 'rdRule:"kappaM"(全天体 R_d = Y_k m —— 鍵の名は r_d・説明は R_d)・G_loc {law:"kappaC2"}(n = 2)・q11 は在位の 7 本と同じ宣言の形(AN439)',
    plan: clone(P), contract: clone(CONTRACT), judge: clone(RULE), harmRule: clone(HARM_RULE), models: clone(NX.MODELS), windows: clone(NX.WINDOWS), variants: clone(NX.VARIANTS) };
  J.book = { units: clone(L.UNITS), softening: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, integrator: L.INTEGRATOR, gLoc: clone(L.GLOC), q11Drag: clone(NX.Q11_DRAG), oldQ11Drag: clone(L.K1_RULE_DRAG),
    declFile: L.DECL_FILE, libFrom: 'tests/lib-w315d-satk1.mjs(bookOf・seedOf・attachSatSampler)+ tests/lib-w317c-satcut.mjs(m0Of)+ tests/lib-w317a-satmeas.mjs(designDiag・synodicOf)+ tests/lib-w318b-satnext.mjs(variantBook・fitLS・diffFitLS・verdictOf)',
    notIncluded: ['母惑星の J₂ と潮汐(在位の本が持たない —— 第315便d と同じ)', '他の衛星と他の惑星(衛星ごとに 1 本 —— 第315便d と同じ)', '真の相対の積分(母惑星が常に原点 —— エンジンに無い・本便は作らない)'] };
  const allSats = P.sats.slice().concat(P.triton ? [P.triton.sat] : []);
  J.T = { systems: X315.targetsOf(HP, allSats) }; tick('T');
  J.P = partP(HP, P); tick('P');
  J.ref = refOf(o.satcut, P.sats);
  const index = {}, runs = {}, jobs = [], seeds = {};
  for (const sp of specsOf(P)) {
    const sd = seeds[sp.sat] || (seeds[sp.sat] = L.seedOf(HP, sp.sat)), key = runKeyOf(specBooks(HP, sp, sd), sp);
    index[rowKey(sp)] = key;
    const orbits = sp.job === 'tri' ? sp.runN : sp.span * J.P.parents[sp.sat].orbitsPerParent * sp.pScale;
    jobs.push(o.run(key, sp, orbits * sp.div).then((r) => { if (!runs[key]) { runs[key] = Object.assign({ key }, r); o.log(key, r); } return r; }));
  }
  await Promise.all(jobs);
  J.E = { sats: P.sats.slice(), variants: P.variants.slice(), divs: P.divs.slice(), stepsPerOrbit: P.stepsPerOrbit, span: P.span, pScale: P.pScale, m0Wins: P.m0Wins.slice(),
    triton: P.triton ? clone(P.triton) : null, index, runs };
  J.prefix = prefixOf(J, o.satcut || null);
  tick('E');
  J.A = partA(J); J.TRI = partTri(J); J.ULP = partUlp(J); tick('A');
  J.cost = costOf(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W318B_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W318B_QUICK === '1', explore = process.env.W318B_EXPLORE === '1';
  const OUT = process.env.W318B_OUT ? (path.isAbsolute(process.env.W318B_OUT) ? process.env.W318B_OUT : path.join(ROOT, process.env.W318B_OUT)) : path.join(ROOT, OUT_SATNEXT);
  if ((quick || explore) && !process.env.W318B_OUT) throw new Error('試走(W318B_QUICK=1)と探索(W318B_EXPLORE=1)は W318B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  let satcut = null; try { satcut = JSON.parse(fs.readFileSync(path.join(ROOT, SATCUT_OUT), 'utf8')); } catch (e) { satcut = null; }
  const NW = Math.max(1, Number(process.env.W318B_WORKERS) || 2), cstat = { resumed: 0, shared: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W318B_CACHE ? path.resolve(process.env.W318B_CACHE) : null, targetSha256, cstat);
  const log = (key, r) => { const sp = r.spec, w = r.win && r.win.W1 && r.win.W1.models.LS;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${rowKey(sp)}: ${r.status}${r.status === 'run' ? '・W1 LS ' + (w && Number.isFinite(w.d) ? w.d.toExponential(6) : '—') + '・q11 ' + r.runs.q11.steps + ' 步 ' + r.runs.q11.wallSec.toFixed(1) + ' s・計 ' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`); };
  const plan = quick ? QUICK : (explore ? EXPLORE : PLAN);
  console.log('第318便b satnext: ' + (quick ? '試走' : (explore ? '探索' : '正本')) + '・workers ' + NW + '・衛星 ' + plan.sats.join(',') + (plan.triton ? '+' + plan.triton.sat : '') + '・変種 ' + plan.variants.join(','));
  const R = await runSatnext(HP, { quick, explore, plan, run, log, satcut });
  const out = { version: HARNESS_VERSION, libVersion: NX.LIB_VERSION, satk1LibVersion: L.LIB_VERSION, satcutLibVersion: C.LIB_VERSION, satmeasLibVersion: M.LIB_VERSION, apsisVersion: AP.APSIS_VERSION,
    generator: 'tests/exp-w318b-satnext.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(第120報)・決断事項 AN436(三体の近点の主の列は V1a・V0 を残す・V0 − V1a は記録)・AN437(母惑星の公転周期の整数倍の窓と λ☉ の 1・2 倍の調和 —— 走行の前に宣言)・'
      + 'AN439(q11 を在位の 7 本と同じ宣言の形へ)・AN440(トリトンは V3 + V1a・表の量は離心率ベクトル —— V3 はガリレイの変換)・AN442(M0・HARM_RULE は緩めない・回る ê₁₀ が主・1 ulp は診断の列)・統括の検証項目 R255。'
      + '確認の材料(在位へ入れない —— 近似要素の種は観測レコードではない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.shared = cstat.shared;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w318b-satnext.mjs', 'tests/lib-w318b-satnext.mjs', 'tests/lib-w317a-satmeas.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/exp-w316d-sath.mjs', 'tests/exp-w315d-satk1.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第318便b', target: TARGET, code: CODE, inputs: [TARGET, L.DECL_FILE, SATCUT_OUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satnext',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W318B_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, packJson(out) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.A.answer));
}
if (IS_MAIN) await main();

// 第297便b(原仮定者の裁定(第87報)「『再現しない』という主張はしない。『再現する努力』を常に優先度の高い目標に掲げる。『再現するために計算を合わせた』と
// 『再現したと主張しない』は両立する」「光学と力学を分ける。geoPN=2・3・4 のサンプルは全て λ_PN=0。修正したサンプルは再フィットする」・統括の検証項目 R162)——
// **フィット生成器(第296便b の tests/exp-w296b-fit.mjs の後継)**。Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// エンジン本体を走らせる。走行は子プロセスで並列)。
//
// ■ 段(正本 tests/out/fit-w297b.json —— 段 fit-297b・inertial3-295c の後。第296便b の段 fit-296b は履歴〔再生成しない〕)
//   段 0〜6 は第296便b を引き継ぐ(規約の固定・速度の規約の対照・dragCore の感度 43 通り・🟤🟣 の探索〔gain の対数格子 → Illinois → 7 桁 → h・h/2〕・
//   派生本の照合・fitRecord の受理・gain の SI 表)。変えたのは次の 4 点:
//   (1) **λ_PN=0**: 親 3 本と派生本の写しに physics.lambdaPN=0 を器の中で当てて走る(原仮定者の裁定(第87報) —— 親の値は html の側〔第297便a〕が持つ)。
//       geoPN=3 の解決(慣性引きずり・測地線 OFF・実効 0)が λ を読まないことを、λ=1 と λ=0 の 2000 步の状態の指紋で確かめる(段 0′)。
//   (2) **fitRecord を w297b-1 へ**: targets[].tol(観測側の許容 —— 出典に σ の無い量は kind:"declared")と cond(条件の署名 —— html の fitCondSig が
//       受理後の派生本と記録から作る 16 桁の hex・抽出器の版)。status:"fitted" の門は |残差| + 数値誤差(h と h/2 の差)≤ 許容。
//   (3) **🌤️ の再現作業(段 7)** —— 月の近点回転 8.85 年(A1・118 公転窓)を、慣性決定力版の宣言の中で再現するための計算と初期配置の見直し:
//       7a 規約の固定(単位・法則・λ=0・速度の意味 v と W・慣性履歴の初期化)/ 7b 初期配置の点検(地球–月の二体の接触要素と、太陽を加えた三体の量 ——
//       重心・速度・太陽の位相・元期・2 次元の射影 —— と観測入力の転写)/ 7c 抽出器 3 方式(lib の emMethods —— 近点の方位〔位置だけ〕・離心ベクトル・
//       位相の回帰)× 窓 8/27/60/118 公転 × 刻み h/h2/h4(+長い窓 236/354)/ 7d 初期配置の見直し(離心率 0.0549 と恒星月 27.321661 日を**走行の平均**で
//       合わせる 2 元の Newton —— 太陽の位相 φ = 0/90/180/270°・離心率の出典の幅 0.0549〜0.0554・地球の公転離心率 0.0167 の対照)/ 7e 器の中だけの
//       3 次元のニュートンの参照積分器(アプリの物理ではない —— 平面で本のエンジンと一致することを確かめてから、月の軌道傾斜 5.145°・5.16° を入れる)/
//       7f 直した初期配置での gain の探索(対数格子+0・h と h/2)/ 7g 速度の規約 v=(I+L)W の対照(既定にしない)/ 7h 記録と派生本 🌥️ の照合。
//       挟めなければ status:"unreachable-in-bounds"(表示は「この探索範囲では未達 —— 次の見直し」)と、試したこと・各方式の値・次に疑う実装/配置を記録する。
//   (4) 派生本の照合は lambdaPN を両側で 0 に揃えて比べる(lambdaPN の字句は第297便a の持ち分)。
//
// ■ しないこと・言わないこと
//   ・親 3 本を書き換えない(初期配置の誤りは派生本で直した形を作る)。刻み依存の誤差を gain で吸収しない。架空の σ を作らない。負の gain・太陽を消した三体を使わない。
//   ・「現実を再現した」「月を再現した」「8.85 年を出した」「較正 合」「gain は普遍定数」「再現しない」「合わせられない」と書かない。
//
// 実行(Node だけ・Chromium 不要・子プロセス 3 本 —— W297B_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w297b-fit.mjs          → 正本 tests/out/fit-w297b.json(W297B_OUT で出力先を変える)
//   W297B_PART=mer|plu|ems                → その段だけ走らせて正本を書かずに終わる(開発用)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as C from './exp-w295c-inertial3.mjs';
import * as L from './lib-w297b-fit.mjs';
import { avgK as libAvgK, gaussLegendre01 as libGL } from './lib-w292c-dragcore.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.DRAG_CORE_NR","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.FIT_RECORD_VERSION","HP.INERTIAL_INVERSE_MAP_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.dragCoreAvgK","HP.dragCoreLookup","HP.dragCoreState","HP.fitCondInputsOf","HP.fitCondSig","HP.fitCondStateOf","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragInverseMap","HP.inertialDragState","HP.presetSig","HP.sim","HP.validateFitRecord","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w297b-fit-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const fnv = (t) => { let a = 0x811c9dc5; for (let i = 0; i < t.length; i++) { a ^= t.charCodeAt(i) & 0xff; a = Math.imul(a, 0x01000193) >>> 0; } return a.toString(16); };
const CSV = 'paper/data/solar-observations.csv';
const LAMBDA_RULE = 0;   // 原仮定者の裁定(第87報): geoPN=2・3・4 は λ_PN=0

/** 🟤🟣 の規約(標的・窓・刻み・格子)は第296便b のまま。SI の格子は 10⁻⁶〜0.0514182 m³/kg(移送値が上端)。🌤️ は段 7。 */
export const SI_RANGE = Object.freeze([1e-6, 0.0514182]);
export const GRID_N = 13;
export const BOOKS = Object.freeze([
  Object.freeze({ key: 'mer', parent: 'mercurySunInertial', fitId: 'mercurySunInertialFit', emoji: '🟫', parentEmoji: '🟤', kind: 'two', dt: 0.016, revMax: 8,
    target: Object.freeze({ q: 'perihelionRateDrag', obs: 43.0, unit: '″/世紀', record: 'SOL-f485f6f8',
      source: '照合規約の値 43.0″/世紀(☄️ mercuryReal の expected —— 観測 42.9799±0.0009″/世紀 は Park 2017 Table 3 の Gravitoelectric の行・1PN の量)',
      window: '8 公転・検出器 B(近点ごとの方位の直線 fit)・gain 0 の対照との差(同じ刻み)' }),
    tol: 1e-5, digits: 5, gain0Base: true, fitNotClaim: Object.freeze(['solar_cal', 'perihelion_43_fit', 'gain_universal_fit', 'single_quantity_fit']),
    extractor: 'tests/exp-w295c-inertial3.mjs runPair(検出器 B —— 近点ごとの方位の直線 fit・gain 0 の対照との差)・' + C.HARNESS_VERSION }),
  Object.freeze({ key: 'plu', parent: 'plutoCharonInertial', fitId: 'plutoCharonInertialFit', emoji: '🟪', parentEmoji: '🟣', kind: 'two', dt: 0.16, revMax: 8,
    target: Object.freeze({ q: 'orbitalPeriodMean', obs: 551856.43872, unit: 's', record: 'SOL-25d4320f',
      source: 'Buie, Tholen & Grundy 2012 AJ 144 15 Table 5 の P = 6.3872273(3) 日(二体ケプラーの恒星周期・1σ 0.02592 s —— 判定行の宣言 judgement-sources.json)',
      window: '8 公転・同方向の周回の通過時刻の平均間隔(8 公転の平均)' }),
    tol: 1e-5, digits: 4, gain0Base: false, priors: L.PLUTO_PRIORS, fitNotClaim: Object.freeze(['solar_cal', 'period_target_fit', 'gain_universal_fit', 'single_quantity_fit']),
    extractor: 'tests/exp-w295c-inertial3.mjs runPair(同方向の周回の通過時刻の平均間隔)・' + C.HARNESS_VERSION }),
  Object.freeze({ key: 'ems', parent: 'earthMoonSunInertial', fitId: 'earthMoonSunInertialFit', emoji: '🌥️', parentEmoji: '🌤️', kind: 'emx', dt: 0.016, revMax: 118,
    target: Object.freeze({ q: 'apsidalPeriod118', obs: 8.85, unit: '年', record: 'SOL-59edf981',
      source: '月の近地点経度の周期 8.85 年(🌛・🔆 の観測欄の値 —— JPL SSD の行 SOL-59edf981 の注記が ~8.85 年の量と記す・σ なし。慣性系の平均の率は Chapront 2002 Table 4 の SOL-c34be08a 40.67616758°/年 = 8.85038 年)',
      window: 'A1(慣性の対は地球と月だけ)・118 公転の窓 [0,118] の近点方位の時刻への直線 fit(検出器 B —— 位置だけ)' }),
    tol: null, digits: 4, gain0Base: false, fitNotClaim: Object.freeze(['solar_cal', 'apsidal_8p85_effort', 'gain_universal_fit']),
    extractor: 'tests/exp-w297b-fit.mjs runEmx(検出器 B の 3 点放物線・位置だけ)→ tests/lib-w297b-fit.mjs emMethods M1・' + L.EM_EXTRACTOR_VERSION }),
]);
const bookOf = (k) => BOOKS.find((b) => b.key === k);
/** 本の単位の gain の格子(SI の格子を各本の単位へ)。🌤️ は 0 も格子に入れる。 */
export function gainGrid(HP, b) {
  const p = find(HP, b.parent), unit = Math.pow(10, 3 * p.scaleExp.L) / Math.pow(10, p.scaleExp.M);
  const lo = Number((SI_RANGE[0] / unit).toPrecision(12)), hi = p.physics.relativeDrag.gain;
  const g = L.logGrid(lo, hi, GRID_N).map((x, i) => (i === 0 || i === GRID_N - 1) ? x : Number(x.toPrecision(6)));
  return b.key === 'ems' ? [0].concat(g) : g;
}

/* ── 写し: 親の写しに λ=0(裁定)・gain・dragCore・初期配置(🌤️)を当てる ── */
export function variantPreset(HP, b, o) {
  const q = clone(find(HP, b.parent));
  q.physics.lambdaPN = (o.lambda === undefined) ? LAMBDA_RULE : o.lambda;
  q.physics.relativeDrag.gain = o.gain;
  if (o.core) {
    for (const [i, c] of Object.entries(o.core)) { if (i === 'tableN') continue; q.bodies[+i].dragCore = { massFrac: c.f, radius: L.coreRadius(c.x, q.bodies[+i].radius) }; }
    if (o.core.tableN) q.physics.relativeDrag.coreTable = { n: o.core.tableN };
  }
  if (o.ic) q.bodies = L.emIcBodies(q.bodies, q.physics.G, o.ic);
  if (o.earthE) {   // 対照: 地球–月の重心を近日点 a(1−e′) に置き、長半径 a(= 親の重心距離)を保ったまま公転の離心率を e′ にする(位置を −a·e′・速度を √((1+e′)/(1−e′)) 倍)
    const Sun = q.bodies[0], E = q.bodies[1], M = q.bodies[2], mt = E.m + M.m;
    const bx = (E.m * E.x + M.m * M.x) / mt, bvy = (E.m * E.vy + M.m * M.vy) / mt, a = bx - Sun.x;
    const dx = -a * o.earthE, dv = bvy * (Math.sqrt((1 + o.earthE) / (1 - o.earthE)) - 1);
    E.x += dx; M.x += dx; E.vy += dv; M.vy += dv;
  }
  return q;
}
function stateFp(S) {
  let h1 = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < S.n; i++) { f[0] = S[k][i]; for (let j = 0; j < 8; j++) h1 = Math.imul(h1 ^ u8[j], 16777619) >>> 0; }
  const A = S._rdA ? Array.from(S._rdA).join(',') : '';
  return h1.toString(16) + ':' + fnv(A);
}
/** 逆写像 v=(I+L)W を写しの初速へ書く(build で位置・速度が宣言のままであることを確かめてから)。門の数も返す。 */
export function inverseMapped(HP, q) {
  const v = HP.validatePreset(clone(q));
  HP.sim.build(v.preset);
  const S = HP.sim, n = S.n;
  const same = q.bodies.every((z, i) => S.x[i] === z.x && S.y[i] === z.y && S.vx[i] === z.vx && S.vy[i] === z.vy);
  const before = stateFp(S);
  const M = HP.inertialDragInverseMap(S);
  const after = stateFp(S);
  let indepRel = null;
  if (!q.bodies.some((z) => z.dragCore)) {
    const rd = S.relDrag, eps = rd.eps !== undefined ? rd.eps : S.params.softening, e2 = eps * eps; indepRel = 0;
    for (let i = 0; i < n; i++) {
      if (S.pinned[i]) continue;
      let vx = S.vx[i], vy = S.vy[i];
      for (let j = 0; j < n; j++) { if (j === i) continue; const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], r2 = dx * dx + dy * dy, r = Math.sqrt(r2), s = r2 + e2, a = rd.gain * S.m[j] * (r / (s * s));
        vx += a * (S.vx[i] - S.vx[j]); vy += a * (S.vy[i] - S.vy[j]); }
      const d = Math.hypot(vx - M.vx[i], vy - M.vy[i]) / Math.hypot(vx, vy); if (d > indepRel) indepRel = d;
    }
  }
  const out = clone(q);
  for (let i = 0; i < n; i++) { out.bodies[i].vx = M.vx[i]; out.bodies[i].vy = M.vy[i]; }
  return { preset: out, gate: { buildSame: same, pure: before === after, indepRel, relMax: M.relMax, degMax: M.degMax, fixed: M.fixed, version: M.version, rule: M.rule } };
}
function hpWith(HP, b, q) { const base = HP.allPresets(); const X = Object.create(HP); X.allPresets = () => base.map((p) => (p.id === b.parent ? q : p)); return X; }

/* ── 🌤️ の走行(段 7): 位置だけの事象列(周回・近点・遠点・接触離心ベクトル)を集め、窓ごとに 3 方式で読む ── */
export function runEmx(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset);
  const S = HP.sim, dt = o.dt, revMax = o.revMax, ci = 1, oi = 2, EV = 64, mu = S.params.G * (S.m[ci] + S.m[oi]);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]];
  const [x0, y0] = rel();
  let angPrev = Math.atan2(y0, x0), angAcc = 0, r1 = Math.hypot(x0, y0), r2 = r1, th1 = angPrev, th2 = angPrev, px = x0, py = y0, ppx = x0, ppy = y0, nan = false, k = 0;
  const ev = { rev: [], peri: [], apo: [], ecc: [] };
  for (; ; k++) {
    S.step(dt);
    const [dx, dy] = rel(), rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
    if (!Number.isFinite(rr)) { nan = true; break; }
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); ev.rev.push((k + fr) * dt); }
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (dd !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * dd) : r1;
      (r1 < r2 ? ev.peri : ev.apo).push({ t: (k + fr) * dt, ang, r: rv });
    }
    if (k >= 1 && (k % EV) === 0) {   // 接触離心ベクトル(位置の中心差分の座標速度 —— 1 步前の点で)
      const wx = (dx - ppx) / (2 * dt), wy = (dy - ppy) / (2 * dt), r = Math.hypot(px, py), h = px * wy - py * wx;
      const exv = (wy * h) / mu - px / r, eyv = (-wx * h) / mu - py / r;
      ev.ecc.push([k * dt, Math.atan2(eyv, exv), Math.hypot(exv, eyv), 1 / (2 / r - (wx * wx + wy * wy) / mu)]);
    }
    ppx = px; ppy = py; px = dx; py = dy; r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if (ev.rev.length >= revMax) { k++; break; }
  }
  const st = HP.inertialDragState(S);
  return { ev, steps: k, nan: nan || S.hasNaN(), warnings: v.warnings || [],
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax } : null };
}

/* ── 子プロセスの仕事 ── */
export function childTask(HP, spec) {
  const t0 = Date.now(), b = bookOf(spec.book);
  if (spec.kind === 'lambda') return lambdaProbe(HP, spec);
  let q = spec.preset ? spec.preset : variantPreset(HP, b, spec), inv = null;
  if (spec.inverse) { const r = inverseMapped(HP, q); q = r.preset; inv = r.gate; }
  if (b.kind === 'emx') {
    const p = find(HP, b.parent), U = C.timeUnits(p.scaleExp);
    const R = runEmx(HP, q, { dt: spec.dt, revMax: spec.revMax });
    const windows = (spec.wins || [8, 27, 60, 118]).map((N) => L.emMethods(R.ev, N, U));
    const w118 = windows.find((w) => w.N === b.revMax) || null;
    return { key: spec.key, book: b.key, gain: spec.gain, dt: spec.dt, ic: spec.ic || null, earthE: spec.earthE || null, revN: R.ev.rev.length, steps: R.steps, nan: R.nan,
      warnings: R.warnings, drag: R.drag, inverse: inv, windows, y: w118 ? w118.T1 : null, wallSec: (Date.now() - t0) / 1000 };
  }
  const X = hpWith(HP, b, q);
  const R = C.childTask(X, { key: spec.key, kind: 'two', book: b.key, gain: 'gain', hk: spec.dt === b.dt ? 'h' : 'h2', dt: spec.dt, revMax: spec.revMax, check: false });
  const p = find(HP, b.parent), U = C.timeUnits(p.scaleExp), n = R.rev.length;
  const periodMean = (R.rev[n - 1] - R.rev[0]) / (n - 1);
  return { key: spec.key, book: b.key, gain: spec.gain, dt: spec.dt, revN: n, steps: R.steps, nan: R.nan, warnings: R.warnings || [], drag: R.drag, inverse: inv,
    periodMeanSec: periodMean * U.sec, period2Sec: (R.rev[1] - R.rev[0]) * U.sec, apsDegPerOrbit: R.B ? R.B.slopeDegPerPeri : null,
    apsArcsecPerCentury: R.B ? R.B.slopeDegPerTime * U.century * 3600 : null, nPeri: R.B ? R.B.nPeri : null, residRmsDeg: R.B ? R.B.residRmsDeg : null,
    eProxy: R.eProxy, rMin: R.rMin, rMax: R.rMax, uRatioMean: R.uRatio ? R.uRatio.mean : null, osc0: R.osc0, wallSec: (Date.now() - t0) / 1000 };
}
/** 段 0′: λ_PN を 1 と 0 にした写しの 2000 步の状態の指紋(親 3 本と派生本 —— geoPN=3 の解決が λ を読まないこと)。 */
export function lambdaProbe(HP, spec) {
  const out = [];
  for (const id of spec.ids) {
    const p = find(HP, id); if (!p) continue;
    const dt = (BOOKS.find((b) => b.parent === id || b.fitId === id) || { dt: 0.016 }).dt;
    const fp = (lam) => { const q = clone(p); q.physics.lambdaPN = lam; const v = HP.validatePreset(q); HP.sim.build(v.preset);
      const law = HP.geoLawOfSim(HP.sim), eff = HP.geoEffectiveMode(HP.sim);
      for (let k = 0; k < spec.steps; k++) HP.sim.step(dt); return { fp: stateFp(HP.sim), law, eff, nan: HP.sim.hasNaN() }; };
    const a = fp(1), z = fp(0);
    out.push({ id, emoji: p.emoji, dt, steps: spec.steps, lambdaDecl: p.physics.lambdaPN, law: a.law, eff: a.eff, same: a.fp === z.fp && a.law === z.law && a.eff === z.eff, nan: a.nan || z.nan, fp1: a.fp, fp0: z.fp });
  }
  return { key: spec.key, book: 'lambda', rows: out, revN: 0, steps: spec.steps, wallSec: 0 };
}

/* ── 段 0: 規約の固定 ─────────────────────────────────────────── */
export function conventions(HP, csvText) {
  return BOOKS.map((b) => {
    const p = find(HP, b.parent), v = HP.validatePreset(clone(p));
    HP.sim.build(v.preset);
    const S = HP.sim, law = HP.geoLawOfSim(S), eff = HP.geoEffectiveMode(S);
    const row = L.csvRecord(csvText, b.target.record);
    return { key: b.key, parent: b.parent, emoji: b.parentEmoji, presetSigFnv: fnv(HP.presetSig(clone(p))), bodiesFnv: fnv(JSON.stringify(p.bodies)),
      law, effectiveMode: eff, geoPN: p.physics.geoPN, kFrame: p.physics.kFrame, lambdaDecl: p.physics.lambdaPN, lambdaRun: LAMBDA_RULE, scaleExp: p.scaleExp, timeUnits: C.timeUnits(p.scaleExp),
      integrator: p.integrator || 'semi', relativeDrag: p.physics.relativeDrag, softening: p.physics.softening, n: S.n, pinned: Array.from(S.pinned).map(Boolean),
      target: b.target, sourceRow: row, dt: b.dt, dtHalf: b.dt / 2, revMax: b.revMax, extractor: b.extractor };
  });
}

/* ── 段 2: 感度(第296便b のまま)── */
export function sensitivity(HP, fitGains) {
  const gl = HP.dfmGaussLegendre01(HP.DRAG_CORE_NR), lgl = libGL(HP.DRAG_CORE_NR);
  const out = [];
  const pairsOf = { ems: [[1, 2], [2, 1]], mer: [[0, 1]], plu: [[0, 1], [1, 0]] };
  const name = { ems: ['太陽', '地球', '月'], mer: ['太陽', '水星'], plu: ['冥王星', 'カロン'] };
  let libMax = 0;
  for (const b of BOOKS) {
    const p = find(HP, b.parent), eps = p.physics.relativeDrag.eps;
    const v = HP.validatePreset(clone(p)); HP.sim.build(v.preset);
    const S = HP.sim;
    for (const [src, rcv] of pairsOf[b.key]) {
      const R = p.bodies[src].radius, r = Math.hypot(S.x[rcv] - S.x[src], S.y[rcv] - S.y[src]);
      const kEps = r / ((r * r + eps * eps) * (r * r + eps * eps));
      const rows = L.CORE_GRID.map((c) => {
        const decl = { massFrac: c.f, radius: L.coreRadius(c.x, R) };
        const k = HP.dragCoreAvgK(r, decl, R, eps, gl), kl = libAvgK(r, decl, R, eps, HP.DRAG_CORE_NR, { gl: lgl });
        const d = Math.abs(k - kl) / Math.abs(k); if (d > libMax) libMax = d;
        return { x: c.x, f: c.f, ratio: k / kEps };
      });
      const ratios = rows.map((z) => z.ratio);
      const fg = fitGains[b.key];
      out.push({ book: b.key, emoji: b.parentEmoji, source: name[b.key][src], receiver: name[b.key][rcv], srcIndex: src, rcvIndex: rcv, R, r, eps,
        ratioMin: Math.min(...ratios), ratioMax: Math.max(...ratios), farBound: L.farBound(R, r), need: (fg && fg.gain !== null) ? fg.gain / p.physics.relativeDrag.gain : null,
        needNote: (fg && fg.gain !== null) ? 'フィットした gain ÷ 移送 gain(移送 gain のまま核で標的に届くのに要る倍率)' : (fg && fg.note) || null, rows });
    }
  }
  const inBand = out.every((s) => s.rows.every((z) => z.ratio >= 1 - 1e-12 && z.ratio <= s.farBound * (1 + 1e-12)));
  return { grid: { x: L.CORE_X, f: L.CORE_F, rule: 'f ≥ (R_c/R)³(コアの密度 ≥ マントルの密度)', n: L.CORE_GRID.length }, kernel: 'K_ε(r)=r/(r²+ε²)²(点源)・⟨K⟩ は dragCoreAvgK(エンジン)',
    libRelMax: libMax, inBand, sources: out };
}

/* ── 子プロセスの池 ─────────────────────────────────────────── */
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(sp.key + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out)); } catch (e) { rej(e); } }); } };
  return (sp) => new Promise((res, rej) => { q.push({ sp, res, rej }); pump(); });
}

/* ── 段 3: 🟤🟣 の探索(第296便b のまま —— 格子 → 挟む → Illinois → 7 桁に丸めた値で h・h/2)── */
const T6 = (x) => Number(x.toPrecision(7));
async function searchBook(HP, b, run, log) {
  const grid = gainGrid(HP, b), core = b.priors || null, runs = {};
  const p = find(HP, b.parent);
  const R = async (tag, gain, dt, extra = {}) => { const sp = Object.assign({ key: `${b.key}-${tag}`, book: b.key, gain, dt, revMax: b.revMax, core }, extra);
    const r = await run(sp); runs[sp.key] = r; log(r); return r; };
  let base = null;
  if (b.gain0Base) { const [h, h2] = await Promise.all([R('g0-h', 0, b.dt), R('g0-h2', 0, b.dt / 2)]); base = { h: h.apsArcsecPerCentury, h2: h2.apsArcsecPerCentury }; }
  const yOf = (r) => b.key === 'mer' ? r.apsArcsecPerCentury - (r.dt === b.dt ? base.h : base.h2) : r.periodMeanSec;
  const tasks = grid.map((g, i) => R(`grid${i}-h`, g, b.dt));
  if (!b.gain0Base) tasks.push(R('g0-h', 0, b.dt), R('g0-h2', 0, b.dt / 2));
  const done = await Promise.all(tasks);
  const rows = grid.map((g, i) => { const r = done[i]; return { g, y: yOf(r), key: r.key }; });
  const br = L.bracketOf(rows, b.target.obs);
  const g0r = runs[`${b.key}-g0-h`];
  const g0 = g0r ? { periodMeanSec: g0r.periodMeanSec, period2Sec: g0r.period2Sec, apsArcsecPerCentury: g0r.apsArcsecPerCentury, eProxy: g0r.eProxy } : null;
  const res = { key: b.key, emoji: b.parentEmoji, fitId: b.fitId, fitEmoji: b.emoji, parent: b.parent, target: b.target, tol: L.TOLS[b.key], grid: { gains: grid, unit: '[L³/M]', rangeSI: SI_RANGE }, rows,
    base, g0, bracketed: !!br, bracket: br ? { lo: br.lo.g, hi: br.hi.g, yLo: br.lo.y, yHi: br.hi.y } : null, digits: b.digits };
  if (!br) {
    const nr = L.nearestOf(rows, b.target.obs);
    Object.assign(res, { final: null, nearest: { g: nr.g, y: nr.y }, modelH: nr.y, modelH2: null, residual: nr.y - b.target.obs, h2: null, iters: [], status: 'unreachable-in-bounds' });
    return { res, runs };
  }
  let st = { a: br.lo.g, fa: br.lo.y - b.target.obs, b: br.hi.g, fb: br.hi.y - b.target.obs, side: 0 };
  const iters = [];
  for (let it = 0; it < 40; it++) {
    const x = L.illinoisNext(st);
    const r = await R(`it${it}-h`, x, b.dt);
    const fxv = yOf(r) - b.target.obs; iters.push({ g: x, y: yOf(r), f: fxv });
    if (Math.abs(fxv) <= b.tol) break;
    st = L.illinoisUpdate(st, x, fxv);
  }
  const g6 = T6(iters[iters.length - 1].g);
  const fin = [R('final-h', g6, b.dt), R('final-h2', g6, b.dt / 2)];
  if (b.key === 'plu') fin.push(R('final-16-h', g6, b.dt, { revMax: 16, key: `${b.key}-final-16-h` }));
  const F = await Promise.all(fin);
  const yH = yOf(F[0]), yH2 = yOf(F[1]);
  Object.assign(res, { iters, final: g6, finalSI: L.gainSI(g6, p.scaleExp), modelH: yH, modelH2: yH2, residual: yH - b.target.obs, h2: Math.abs(yH - yH2),
    rev16: b.key === 'plu' ? { y: F[2].periodMeanSec, diffFromH: F[2].periodMeanSec - yH, revN: F[2].revN } : null,
    finalRun: { h: F[0], h2: F[1] } });
  res.status = L.statusOf297({ bracketed: true, residual: res.residual, h2: res.h2, tol: L.TOLS[b.key].value });
  return { res, runs };
}
async function fScan(HP, b, g, run, log, store) {
  const scans = b.key === 'mer' ? [L.MER_F_SCAN] : L.PLU_F_SCAN, out = [];
  for (const sc of scans) {
    const tasks = sc.f.map((f) => {
      const core = b.key === 'mer' ? { 0: { f, x: sc.x } } : Object.assign(clone(b.priors), { [sc.index]: { f, x: sc.x } });
      const sp = { key: `${b.key}-fscan-${sc.index}-${f}`, book: b.key, gain: g, dt: b.dt, revMax: b.revMax, core };
      return run(sp).then((r) => { log(r); store[r.key] = r; return r; });
    });
    const rs = await Promise.all(tasks);
    out.push({ index: sc.index, x: sc.x, rows: rs.map((r, i) => ({ f: sc.f[i], aps: r.apsArcsecPerCentury, period: r.periodMeanSec, steps: r.steps, key: r.key })) });
  }
  return out;
}

/* ── 派生本の写し(器が作る —— html の派生本と同じであるべき形)── */
export function derivedPreset(HP, b, s) {
  if (b.key === 'ems') return emsDerivedPreset(HP, s.fix);
  return variantPreset(HP, b, { gain: s.final, core: b.priors || null, lambda: LAMBDA_RULE });
}
export function emsDerivedPreset(HP, fix) {
  const b = bookOf('ems');
  return variantPreset(HP, b, { gain: 0, ic: { rp: fix.rp, e0: fix.e0, phi: fix.phi }, lambda: LAMBDA_RULE });
}
/** 条件の署名(html の fitCondSig —— 受理後の派生本と記録から)。 */
export function condOf(HP, b, s, rec) {
  const v = HP.validatePreset(clone(derivedPreset(HP, b, s)));
  return { version: HP.FIT_COND_VERSION, sig: HP.fitCondSig(v.preset, rec), extractor: b.extractor };
}

/* ── fitRecord(w297b-1 —— 正準の並び)── */
export function fitRecordOf(HP, s, scans) {
  const b = bookOf(s.key), p = find(HP, b.parent);
  const tol = L.TOLS[b.key];
  const target = { q: b.target.q, obs: b.target.obs, unit: b.target.unit, source: b.target.source, window: b.target.window, tol: { value: tol.value, kind: tol.kind, note: tol.note } };
  const lam = 'λ_PN=0(原仮定者の裁定(第87報) —— geoPN=3 の解決〔慣性引きずり・測地線 OFF・実効 0〕は λ を読まない: λ=1 と λ=0 の 2000 步の状態の指紋が同じ)';
  let rec;
  if (b.key === 'ems') rec = emsRecordOf(HP, s, target, lam);
  else {
    const gainRange = [s.grid.gains.find((g) => g > 0), s.grid.gains[s.grid.gains.length - 1]];
    const knobs = [{ key: 'physics.relativeDrag.gain', range: gainRange, final: s.final }];
    const fixed = ['bodies・初期状態・元期・配置は親 ' + b.parentEmoji + ' ' + b.parent + ' の写し(1 字も変えない)', 'geoPN=3・kFrame=0・積分器・重力の軟化・核の ε=' + p.physics.relativeDrag.eps + '・pairs ' + JSON.stringify(p.physics.relativeDrag.pairs) + '(親のまま)',
      lam, '合成則 solve(velocity)(既定)・親の vx/vy を力学速度 v に与える(速度の規約 v=W —— 逆写像 v=(I+L)W は対照だけ)'];
    const notIdent = [];
    let span = null;
    if (b.key === 'mer') {
      fixed.push('太陽と水星は点源(dragCore を宣言しない —— 太陽の f を R_c/R=0.3 で振った近点率の差は下の notIdentifiable)');
      span = scans ? Math.max(...scans[0].rows.map((z) => z.aps)) - Math.min(...scans[0].rows.map((z) => z.aps)) : null;
      notIdent.push('dragCore(太陽の f を R_c/R=0.3 で 0.1〜1.0 に振った近点率の幅 ' + L.ex(span, 2) + '″/世紀 —— 数値誤差の帯 ' + L.ex(s.h2, 2) + '″/世紀' + (span !== null && s.h2 !== null && span <= s.h2 ? ' 以下' : ' を超えるが gain と縮退') + '。1 量では gain と分けられない)');
    }
    if (b.key === 'plu') {
      fixed.push('構造核の事前値: 冥王星 dragCore{f 0.5, R_c/R 0.3}・カロン dragCore{f 0.5, R_c/R 0.5}・表 coreTable.n 4096(固定 —— フィットしない)');
      span = scans ? Math.max(...scans.flatMap((z) => z.rows.map((w) => w.period))) - Math.min(...scans.flatMap((z) => z.rows.map((w) => w.period))) : null;
      notIdent.push('dragCore(固定 gain で冥王星/カロンの f を振った周期の幅 ' + L.ex(span, 2) + ' s —— 観測の 1σ 0.02592 s より小さく、1 量では gain と縮退する)');
    }
    const notFitted = b.key === 'mer' ? ['公転周期(8 公転の平均 —— gain 0 の対照との差と JPL/NSSDC の値との差を記録するだけ)', '離心率', '近日点移動の全量(重力の軟化の逆行を含む —— 合わせたのは gain 0 の対照との差)']
      : ['軌道の形(離心率の代理)', '第 2 周の周期(記録だけ)', '自転・潮汐'];
    rec = { version: L.FIT_RECORD_VERSION, parent: b.parent, law: 'inertial-drag', targets: [target], knobs, fixed,
      procedure: 'gain の対数格子(SI で ' + SI_RANGE[0] + '〜' + SI_RANGE[1] + ' m³/kg・' + GRID_N + ' 点)で根を挟む → Illinois で詰める → 7 桁に丸めた値を h と h/2 で測り直す(|残差| + 数値誤差の帯 |q_h − q_h/2| ≤ 許容なら fitted) → 固定した gain で dragCore の f を振る(同定の可否)',
      dt: b.dt, steps: s.finalRun ? s.finalRun.h.steps : 0,
      residual: { value: s.residual, unit: b.target.unit, model: s.modelH, rel: s.residual / b.target.obs },
      numerics: { h2: s.h2, dtHalf: b.dt / 2 }, status: s.status, notFitted };
    if (s.status === 'fitted' && notIdent.length) rec.notIdentifiable = notIdent;
    s.fSpan = span;
  }
  rec.cond = { version: HP.FIT_COND_VERSION, sig: '0000000000000000', extractor: b.extractor };
  rec.cond = condOf(HP, b, s, rec);
  return { rec, fSpan: s.fSpan === undefined ? null : s.fSpan };
}

/* ── 段 4: 派生本の照合(lambdaPN は両側を 0 に揃えて比べる —— 字句は第297便a の持ち分)── */
export function derivedCheck(HP, s, rec) {
  const b = bookOf(s.key), d = find(HP, b.fitId), par = find(HP, b.parent);
  if (!d) return { id: b.fitId, present: false, ok: false, bad: ['html に無い'] };
  const bad = [];
  const q = derivedPreset(HP, b, s);
  const lam0 = (ph) => Object.assign(clone(ph), { lambdaPN: 0 });
  if (JSON.stringify(d.bodies) !== JSON.stringify(q.bodies)) bad.push('bodies が親の写し+ノブ(初期配置)でない');
  if (JSON.stringify(lam0(d.physics)) !== JSON.stringify(lam0(q.physics))) bad.push('physics が親の写し+ノブでない');
  if (b.key === 'ems' && d.physics.lambdaPN !== 0) bad.push('新しい派生本の λ_PN が 0 でない');
  for (const k of ['scaleExp', 'integrator', 'orbitObs', 'group', 'familyId', 'scaleTier', 'fidelity']) if (JSON.stringify(d[k]) !== JSON.stringify(par[k])) bad.push(k + ' が親と違う');
  if (!(d.familyRole === 'variant' && d.sampleClass === 'principle' && d.referenceKind === 'observation-fit')) bad.push('分類(variant・principle・observation-fit)');
  if (JSON.stringify(d.notClaim) !== JSON.stringify(b.fitNotClaim)) bad.push('notClaim がフィット版の鍵の並びでない');
  if (!par.notClaim.includes('solar_cal') || !d.notClaim.includes('solar_cal')) bad.push('solar_cal が親と派生本の両方に無い');
  if (JSON.stringify(d.activeParams) !== JSON.stringify(['geoPN', 'dispMag'])) bad.push('activeParams');
  if (d.emoji !== b.emoji) bad.push('絵文字');
  const others = HP.allPresets().filter((z) => z.id !== d.id && z.emoji === d.emoji).map((z) => z.id);
  if (others.length) bad.push('絵文字が他の本にある: ' + others.join(','));
  if (JSON.stringify(d.fitRecord) !== JSON.stringify(rec)) bad.push('fitRecord が正本と違う');
  const v = HP.validatePreset(clone(d));
  if (!(v.ok && (v.warnings || []).length === 0)) bad.push('受理の警告: ' + JSON.stringify(v.warnings || v.errors).slice(0, 160));
  else if (JSON.stringify(v.preset.fitRecord) !== JSON.stringify(rec)) bad.push('受理後の fitRecord が正本と違う');
  let condState = null;
  if (v.ok) { HP.sim.build(v.preset); condState = HP.fitCondStateOf(HP.fitCondInputsOf(v.preset, HP.sim.params), v.preset.fitRecord).state; if (condState !== 'match') bad.push('条件の署名が今の実行入力と ' + condState); }
  const ab = d.abBody && d.abBody.physicsPatch && d.abBody.physicsPatch.relativeDrag;
  const wantAb = b.key === 'ems' ? par.physics.relativeDrag.gain : 0;
  if (!(ab && ab.gain === wantAb)) bad.push('ワンタップの対照(gain ' + wantAb + ')');
  return { id: d.id, present: true, emoji: d.emoji, ok: bad.length === 0, bad, condState, sigFnv: fnv(HP.presetSig(clone(d))) };
}

/* ── 段 6: gain の妥当性の表 ─────────────────────────────────── */
export function gainTable(HP, search, ems) {
  const cv = C.conversion(HP), rows = [{ emoji: '🌛', label: '起点(🌛 earthMoonInertial の 8.85 年への 1 次元フィット —— L6/M25)', gain: cv.source.gain, gainSI: cv.cdSI, ratio: 1, target: '8.85 年(🌛 の二体)', status: '移送の起点' }];
  for (const r of cv.rows) rows.push({ emoji: r.emoji, label: '移送(' + r.id + ' —— 単位換算だけ)', gain: r.gainDeclared, gainSI: L.gainSI(r.gainDeclared, r.scaleExp), ratio: L.gainSI(r.gainDeclared, r.scaleExp) / cv.cdSI, target: '—', status: 'coefficient-transfer' });
  for (const s of search) {
    const p = find(HP, s.parent), g = s.final, gs = g === null ? null : L.gainSI(g, p.scaleExp);
    rows.push({ emoji: s.fitEmoji, label: 'フィット(' + s.fitId + ' —— ' + s.target.q + ')', gain: g, gainSI: gs, ratio: gs === null ? null : gs / cv.cdSI, target: s.target.obs + ' ' + s.target.unit, status: s.status });
  }
  if (ems) rows.push({ emoji: '🌥️', label: '再現作業(earthMoonSunInertialFit —— 平均要素の初期配置・apsidalPeriod118 は探索範囲で未達 —— 標的に最も近い点は境界 0)', gain: 0, gainSI: 0, ratio: 0,
    target: '8.85 年', status: ems.status });
  const fitted = rows.filter((r) => r.status === 'fitted');
  const spread = fitted.length >= 2 ? Math.max(...fitted.map((r) => r.gainSI)) / Math.min(...fitted.map((r) => r.gainSI)) : null;
  return { cdSI: cv.cdSI, rows, fittedSpread: spread,
    reading: '系ごとの経験係数としては使える(宣言した 1 量に合わせた値)。共通係数は見つかっていない —— フィット値どうしの比 ' + (spread === null ? '—' : L.ex(spread, 2))
      + '・移送値との比は表のとおり(複数系の同時フィットと独立の検証が要る)',
    notClaim: ['gain は普遍定数', '共通係数が決まった'] };
}

/* ── 段 7: 🌤️ の再現作業 ───────────────────────────────────── */
export const EMS = Object.freeze({
  wins: [8, 27, 60, 118], longWins: [118, 236, 354],
  eMean: Object.freeze({ value: 0.0549, record: 'SOL-47b082ec', alt: 0.0554, altRecord: 'SOL-f810f204', note: '平均要素(NASA NSSDC 0.0549・JPL SSD 0.0554 —— 出典の幅 0.0005・σ なし)' }),
  sid: Object.freeze({ valueSec: 2360591.558227737, record: 'SOL-432f643e', note: 'Chapront 2002 Table 4(慣性系の平均の恒星月 27.321661 日)' }),
  earthE: Object.freeze({ value: 0.01671123, record: 'SOL-488eaddb', note: 'JPL SSD(地球–月の重心の平均の離心率)' }),
  incl: Object.freeze([{ deg: 5.145, src: 'NASA NSSDC Moon Fact Sheet の軌道傾斜(黄道に対して)' }, { deg: 5.16, src: 'JPL SSD の平均要素の軌道傾斜(黄道)' }]),
  phis: [0, 90, 180, 270], solveTol: 2e-5, solveIter: 8,
});
async function emsWork(HP, run, log) {
  const b = bookOf('ems'), p = find(HP, b.parent), U = C.timeUnits(p.scaleExp), G = p.physics.G;
  const sidDay = EMS.sid.valueSec / 86400;
  const R = async (tag, o) => { const sp = Object.assign({ key: `ems-${tag}`, book: 'ems', gain: 0, dt: b.dt, revMax: 118, wins: EMS.wins }, o); const r = await run(sp); log(r); return r; };
  const transfer = p.physics.relativeDrag.gain;
  // 7c 抽出器 3 方式 × 窓 × 刻み(親の初期配置 —— gain 0 と移送 gain)と長い窓
  const exSpecs = [];
  for (const [gl, g] of [['g0', 0], ['gT', transfer]]) for (const [dl, dt] of [['h', b.dt], ['h2', b.dt / 2], ['h4', b.dt / 4]]) exSpecs.push({ tag: `ex-${gl}-${dl}`, gl, dl, o: { gain: g, dt } });
  const longP = R('long-g0', { gain: 0, revMax: 354, wins: EMS.longWins });
  const exRuns = await Promise.all(exSpecs.map((z) => R(z.tag, z.o)));
  // 7a: 抽出器の一致(M1 の 118 公転窓 = 第296便b の器〔第293便d の childTask〕の値 —— 同じ検出器・同じ窓)
  const swing = C.childTask(hpWith(HP, b, variantPreset(HP, b, { gain: 0 })), { key: 'ems-swing-g0', kind: 'em', cond: 'A1', dt: b.dt, revMax: 118, spans: [[0, 118]] });
  const exRows = exSpecs.map((z, i) => ({ label: (z.gl === 'g0' ? '親の初期配置・gain 0' : '親の初期配置・移送 gain ' + transfer), dtLabel: z.dl, gain: z.o.gain, dt: z.o.dt, windows: exRuns[i].windows, steps: exRuns[i].steps }));
  // 7b 初期配置の点検
  const audit0 = L.emIcAudit(p.bodies, G);
  const pw = exRuns[0].windows.find((w) => w.N === 118);
  // 7d 初期配置の見直し: (rp, e0) を走行の平均(118 公転・h・gain 0)で 離心率 eT と 恒星月に合わせる 2 元の Newton
  const solve = async (phi, eT, tagp) => {
    let x = [phi % 180 === 0 ? 3.5733 : 3.7063, phi % 180 === 0 ? 0.0749 : 0.0264];
    const hist = [];
    for (let it = 0; it < EMS.solveIter; it++) {
      const dr = 0.002, de = 0.002;
      const [o, a, c] = await Promise.all([R(`${tagp}-it${it}`, { ic: { rp: x[0], e0: x[1], phi } }), R(`${tagp}-it${it}-dr`, { ic: { rp: x[0] + dr, e0: x[1], phi } }), R(`${tagp}-it${it}-de`, { ic: { rp: x[0], e0: x[1] + de, phi } })]);
      const W = (r) => r.windows.find((w) => w.N === 118);
      const wo = W(o), wa = W(a), wc = W(c);
      const F = [wo.eOsc - eT, wo.sid - sidDay];
      hist.push({ it, rp: x[0], e0: x[1], eOsc: wo.eOsc, sid: wo.sid, T1: wo.T1 });
      if (Math.abs(F[0]) < EMS.solveTol && Math.abs(F[1]) < EMS.solveTol) return { phi, eT, rp: x[0], e0: x[1], w118: wo, hist, converged: true };
      const J = [[(wa.eOsc - wo.eOsc) / dr, (wc.eOsc - wo.eOsc) / de], [(wa.sid - wo.sid) / dr, (wc.sid - wo.sid) / de]];
      const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
      x = [x[0] - (F[0] * J[1][1] - F[1] * J[0][1]) / det, x[1] - (J[0][0] * F[1] - J[1][0] * F[0]) / det];
      x = [Number(x[0].toPrecision(8)), Number(x[1].toPrecision(6))];
    }
    const wl = await R(`${tagp}-last`, { ic: { rp: x[0], e0: x[1], phi } });
    return { phi, eT, rp: x[0], e0: x[1], w118: wl.windows.find((w) => w.N === 118), hist, converged: false };
  };
  const sols = await Promise.all(EMS.phis.map((phi) => solve(phi, EMS.eMean.value, `ic-phi${phi}`)));
  const solAlt = await solve(0, EMS.eMean.alt, 'ic-alt');
  const fix = sols.find((z) => z.phi === 0);
  // 直した初期配置(φ=0)の窓・刻み・長い窓と、地球の公転離心率の対照
  const fixIc = { rp: fix.rp, e0: fix.e0, phi: 0 };
  const [fh, fh2, fh4, flong, fE] = await Promise.all([R('fix-h', { ic: fixIc }), R('fix-h2', { ic: fixIc, dt: b.dt / 2 }), R('fix-h4', { ic: fixIc, dt: b.dt / 4 }),
    R('fix-long', { ic: fixIc, revMax: 354, wins: EMS.longWins }), R('fix-earthE', { ic: fixIc, earthE: EMS.earthE.value })]);
  for (const [lab, dl, r] of [['直した初期配置(φ=0)・gain 0', 'h', fh], ['直した初期配置(φ=0)・gain 0', 'h2', fh2], ['直した初期配置(φ=0)・gain 0', 'h4', fh4]])
    exRows.push({ label: lab, dtLabel: dl, gain: 0, dt: r.dt, windows: r.windows, steps: r.steps });
  const long = await longP;
  // 7e 器の中だけの 3 次元の参照積分器(アプリの物理ではない)
  const r3 = await Promise.all([{ inc: 0 }, ...EMS.incl.map((z) => ({ inc: z.deg }))].map((z) => run({ key: `ems-ref3d-${z.inc}`, book: 'ref3d', rp: fix.rp, e0: fix.e0, incDeg: z.inc, revMax: 354, dt: b.dt })
    .then((r) => { log(r); return r; })));
  const flatEngine = flong.windows.find((w) => w.N === 354);
  const ref3d = { note: '器の中だけの 3 次元ニュートンの参照積分器(太陽固定・地球と月・Plummer の軟化 ε=0.01・速度 Verlet・dt 0.016 —— アプリの物理ではない。月の軌道傾斜は観測表 paper/data に行が無いので本の宣言に入れない)',
    rows: r3.map((r, i) => ({ label: i === 0 ? '平面(傾斜 0)' : '傾斜 ' + r.incDeg + '°(' + EMS.incl[i - 1].src + ')', incDeg: r.incDeg, T2: r.T2, sid: r.sid, eMean: r.eMean, revN: r.revN, wallSec: r.wallSec })),
    flat: r3[0], incl: r3[1], engineFlatT2: flatEngine.T2, flatRel: (r3[0].T2 - flatEngine.T2) / flatEngine.T2, inclEffect: (r3[1].T2 - r3[0].T2) / r3[0].T2 };
  // 7f 直した初期配置での gain の探索(対数格子+0・h と h/2)
  const grid = gainGrid(HP, b);
  const gRuns = await Promise.all(grid.flatMap((g, i) => [R(`grid${i}-h`, { gain: g, ic: fixIc, wins: [118] }), R(`grid${i}-h2`, { gain: g, ic: fixIc, wins: [118], dt: b.dt / 2 })]));
  const rows = grid.map((g, i) => ({ g, y: gRuns[2 * i].y, key: gRuns[2 * i].key })), rowsH2 = grid.map((g, i) => ({ g, y: gRuns[2 * i + 1].y }));
  const br = L.bracketOf(rows, b.target.obs), brH2 = L.bracketOf(rowsH2, b.target.obs), nr = L.nearestOf(rows, b.target.obs);
  const search = { grid: { gains: grid, unit: '[L³/M]', rangeSI: SI_RANGE }, rows, rowsH2, bracketed: !!br, bracketedH2: !!brH2, nearest: nr,
    modelH: nr.y, modelH2: rowsH2.find((z) => z.g === nr.g).y, residual: nr.y - b.target.obs, h2: Math.abs(nr.y - rowsH2.find((z) => z.g === nr.g).y),
    monotone: rows.every((z, i) => i === 0 || z.y <= rows[i - 1].y), status: br ? 'bracketed' : 'unreachable-in-bounds' };
  // 7g 速度の規約 v=(I+L)W の対照(直した初期配置・移送 gain —— 既定にしない)
  const icPreset = variantPreset(HP, b, { gain: transfer, ic: fixIc });
  const [invW, invV] = await Promise.all([R('inv-W', { gain: transfer, ic: fixIc }), R('inv-V', { gain: transfer, ic: fixIc, inverse: true })]);
  // 初期配置の点検の表(親・直した写し 4 位相・出典の幅)
  const icRow = (label, ic, w) => ({ label, rp: ic ? ic.rp : audit0.rp, eOsc0: ic ? ic.e0 : audit0.eOsc, phiDeg: ic ? ic.phi : audit0.phiDeg, eMean: w.eOsc, sid: w.sid, T1: w.T1, T2: w.T2, T3: w.T3 });
  const icAudit = { audit0, fixAudit: L.emIcAudit(icPreset.bodies, G),
    rows: [icRow('親 🌤️(🔆 の写し —— e 0.0549 を t=0 の接触要素に置いた)', null, pw)].concat(sols.map((z) => icRow('直した写し φ=' + z.phi + '°(e 0.0549・恒星月を走行の平均で)', { rp: z.rp, e0: z.e0, phi: z.phi }, z.w118)),
      [icRow('直した写し φ=0°(e 0.0554 —— JPL SSD の値)', { rp: solAlt.rp, e0: solAlt.e0, phi: 0 }, solAlt.w118)]),
    displacements: [
      { input: '月の近地点距離 rp [L]', obs: '恒星月 ' + sidDay.toFixed(6) + ' 日(' + EMS.sid.record + ')と平均離心率 ' + EMS.eMean.value + '(' + EMS.eMean.record + ')から走行の平均で逆算', source: EMS.sid.note + '・' + EMS.eMean.note,
        uncertainty: '恒星月は 10⁻⁶ 日より細かい・離心率は出典の幅 0.0005(σ なし)', from: audit0.rp, to: fix.rp, reason: '親は e 0.0549 を t=0 の接触要素(近地点・太陽の反対方向)に置き、走行の平均離心率が ' + pw.eOsc.toFixed(4) + ' になっていた(平均要素の転写の取り違え)' },
      { input: '月の t=0 の接触離心率 e0', obs: '平均離心率 0.0549 を走行の時間平均の接触離心率で満たす値', source: EMS.eMean.note, uncertainty: '出典の幅 0.0005', from: audit0.eOsc, to: fix.e0,
        reason: '同上(t=0 の接触値と平均要素は太陽摂動〔出差〕の分だけ違う)' },
      { input: '太陽の位相 φ(近地点の向き)', obs: '元期を宣言していない(親も)', source: '—', uncertainty: '0〜360°', from: 0, to: 0, reason: 'φ = 0/90/180/270° で同じ平均要素に合わせ直し、118 公転窓の近点周期の幅を記録(元期の選択に依る量)' },
      { input: '地球の公転離心率 e′', obs: EMS.earthE.value + '(' + EMS.earthE.record + ')', source: EMS.earthE.note, uncertainty: '—', from: 0, to: 0, reason: '親は円軌道 —— 対照として近日点から e′ で走らせた値だけを記録(本の宣言は円のまま)' }] };
  const emsOut = { parentAudit: audit0, parentW118: pw, swingSame: swing.windows[0].apsPeriodYr === pw.T1, swingY: swing.windows[0].apsPeriodYr,
    extractor: { methods: { M1: '近点の方位(検出器 B の 3 点放物線 —— 位置だけ)の時刻への直線 fit', M2: '接触離心ベクトル(位置の中心差分の座標速度・64 步ごと)の方位の時刻への直線 fit',
      M3: '位相の回帰(近点の時刻の番号への傾き = 近点月、周回の時刻の傾き = 恒星月 → 1/(1/恒星月 − 1/近点月))' }, rows: exRows, long: long.windows, fixLong: flong.windows },
    icAudit, solutions: sols.map((z) => ({ phi: z.phi, eT: z.eT, rp: z.rp, e0: z.e0, converged: z.converged, w118: z.w118, iters: z.hist.length })), solAlt: { rp: solAlt.rp, e0: solAlt.e0, converged: solAlt.converged, w118: solAlt.w118 },
    fix: { rp: fix.rp, e0: fix.e0, phi: 0, w118: fh.windows.find((w) => w.N === 118), h2: fh2.windows.find((w) => w.N === 118), h4: fh4.windows.find((w) => w.N === 118), earthE: fE.windows.find((w) => w.N === 118), steps: fh.steps },
    ref3d, search, velocityConvention: { rule: 'v=(I+L)W(inertialDragInverseMap)—— 直した初期配置・移送 gain の対照(既定にしない)', W: invW.windows.find((w) => w.N === 118), V: invV.windows.find((w) => w.N === 118), gate: invV.inverse },
    status: br ? 'bracketed' : 'unreachable-in-bounds' };
  const runs = Object.fromEntries([...exRuns, fh, fh2, fh4, flong, fE, long, invW, invV, ...gRuns].map((r) => [r.key, r]));
  return { ems: emsOut, runs };
}
/** 🌥️ の記録(w297b-1)。 */
function emsRecordOf(HP, s, target, lam) {
  const b = bookOf('ems'), E = s.ems, p = find(HP, b.parent), f = E.fix, sr = E.search, r3 = E.ref3d;
  const T = (x) => L.fx(x, 4);
  return { version: L.FIT_RECORD_VERSION, parent: b.parent, law: 'inertial-drag', targets: [target],
    knobs: [{ key: 'physics.relativeDrag.gain', range: [0, p.physics.relativeDrag.gain], final: 0 },
      { key: 'initial.moonPerigeeDistance', range: [3.4, 3.8], final: f.rp }, { key: 'initial.moonOscEccentricity0', range: [0.02, 0.12], final: f.e0 }],
    fixed: ['太陽・地球–月の重心(位置・速度)・質量・半径・自転・地球の構造核は親 🌤️ の写し(重心は保つ —— 丸めの差は速度で 1 ulp〔4.4e-16〕・地球→月の相対ベクトルだけを置き直した)',
      'geoPN=3・kFrame=0・積分器 semi・重力の軟化 0.01・核の ε 0.01・pairs [[1,2]](親のまま)', lam,
      '初期配置は平均要素に合わせた: 月の離心率 ' + EMS.eMean.value + '(' + EMS.eMean.record + ')と恒星月 ' + (EMS.sid.valueSec / 86400).toFixed(6) + ' 日(' + EMS.sid.record + ')を 118 公転・h・gain 0 の走行の平均で満たす (近地点距離, t=0 の接触離心率) —— 太陽の位相 φ=0(近地点を太陽の反対方向に置く親の向き)',
      '最終値は根ではない: gain の探索範囲 [0, ' + p.physics.relativeDrag.gain + '] で標的に最も近い点(境界 0)を本の宣言にした —— 移送 gain は A/B のワンタップ'],
    procedure: '7b 初期配置の点検(親の走行の平均離心率 ' + L.fx(E.parentW118.eOsc, 4) + ' —— 0.0549 は平均要素) → 7d (近地点距離, e0) の 2 元 Newton(φ=0/90/180/270°・e 0.0549/0.0554) → 7c 抽出器 3 方式 × 窓 8/27/60/118 × h/h2/h4 → '
      + '7f gain の対数格子(SI で ' + SI_RANGE[0] + '〜' + SI_RANGE[1] + ' m³/kg・' + GRID_N + ' 点+0)× h/h2 で根を挟む → 7e 器の中だけの 3 次元の参照積分器で傾斜の効果を測る',
    dt: b.dt, steps: f.steps,
    residual: { value: sr.residual, unit: '年', model: sr.modelH, rel: sr.residual / b.target.obs },
    numerics: { h2: sr.h2, dtHalf: b.dt / 2 }, status: 'unreachable-in-bounds',
    notFitted: ['この探索範囲では未達 —— 次の見直しへ: 直した初期配置で gain 0 の 118 公転窓 ' + T(sr.rows[0].y) + ' 年(gain を上げると短くなる —— 格子の全点で標的の片側)',
      '次に疑う実装: 2 次元の射影(月の軌道傾斜なし)—— 器の中だけの 3 次元の参照積分器で、平面 ' + L.fx(r3.flat.T2, 3) + ' 年(本のエンジンとの差 ' + L.ex(r3.flatRel, 1) + ')・傾斜 ' + r3.incl.incDeg + '° で ' + L.fx(r3.incl.T2, 3) + ' 年(+' + L.fx(100 * r3.inclEffect, 2) + '%)',
      '次に疑う配置: 太陽の位相 φ(元期の宣言なし —— φ=0/90/180/270° で 118 公転窓 ' + E.solutions.map((z) => T(z.w118.T1)).join('/') + ' 年)・地球の公転離心率(親は円 —— e′ ' + EMS.earthE.value + ' の対照で ' + T(f.earthE.T1) + ' 年)',
      '抽出器と窓: 3 方式の 118 公転窓 ' + T(f.w118.T1) + '/' + T(f.w118.T2) + '/' + T(f.w118.T3) + ' 年・354 公転窓 ' + E.extractor.fixLong.filter((w) => w.N === 354).map((w) => T(w.T1) + '/' + T(w.T2) + '/' + T(w.T3)).join('') + ' 年',
      '恒星月と離心率は初期配置の入力として平均に合わせた(法則の予言として数えない)']};
}

export function gates(o) {
  const all = Object.values(o.runs);
  const g = {
    runsOk: all.every((r) => !r.nan && (!r.drag || (r.drag.boundOver === 0 && r.drag.reject === 0))),
    warnFree: all.every((r) => !r.warnings || r.warnings.length === 0),
    complete: all.every((r) => r.book === 'lambda' || r.book === 'ref3d' || r.revN >= (r.key.indexOf('-16-') >= 0 ? 16 : (r.book === 'ems' ? 118 : bookOf(r.book).revMax))),
    parentsFrozen: o.conv.every((c) => c.law === 'inertial-drag' && c.effectiveMode === 0 && c.geoPN === 3),
    lambdaInert: o.lambda.rows.length >= 5 && o.lambda.rows.every((z) => z.same && !z.nan),
    sensLib: o.sens.libRelMax <= 1e-12, sensBand: o.sens.inBand, sensGrid: o.sens.grid.n === 43,
    inverse: o.inverse.every((z) => !z.gate || (z.gate.buildSame && z.gate.pure && (z.gate.indepRel === null || z.gate.indepRel <= 1e-14))),
    records: o.records.every((z) => z.accepted && z.canonSame),
    derived: o.derived.every((z) => z.ok),
    emsExtractor: !o.ems || o.ems.swingSame === true,
    emsSolved: !o.ems || o.ems.solutions.every((z) => z.converged),
    ref3dFlat: !o.ems || Math.abs(o.ems.ref3d.flatRel) <= 1e-4,
  };
  g.ok = Object.values(g).every((x) => x === true);
  return g;
}

/* ── 器の中だけの 3 次元の参照積分器(アプリの物理ではない —— 段 7e)── */
export function ref3dRun(o) {
  const t0 = Date.now();
  const G = 6.674, Ms = 1988.5, Me = 0.0059724, Mm = 0.00007346, eps = 0.01, YEAR = 3155.76, DAY = 8.64;
  const { rp, e0, incDeg = 0, revMax = 354, dt = 0.016, R = 1495.98 } = o;
  const mu = G * (Me + Mm), fM = Mm / (Me + Mm), Vb = Math.sqrt(G * Ms / R), vp = Math.sqrt(mu * (1 + e0) / rp);
  const ci = Math.cos(incDeg * Math.PI / 180), si = Math.sin(incDeg * Math.PI / 180);
  const rel = [rp, 0, 0], vrel = [0, vp * ci, vp * si];
  const x = [[R - fM * rel[0], 0, 0], [R + (1 - fM) * rel[0], 0, 0]];
  const v = [[-fM * vrel[0], Vb - fM * vrel[1], -fM * vrel[2]], [(1 - fM) * vrel[0], Vb + (1 - fM) * vrel[1], (1 - fM) * vrel[2]]];
  const m = [Me, Mm], e2 = eps * eps;
  const acc = () => { const a = [[0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 2; i++) { const r2 = x[i][0] ** 2 + x[i][1] ** 2 + x[i][2] ** 2 + e2, f = -G * Ms / (r2 * Math.sqrt(r2)); for (let k = 0; k < 3; k++) a[i][k] += f * x[i][k]; }
    const d = [x[1][0] - x[0][0], x[1][1] - x[0][1], x[1][2] - x[0][2]], r2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2 + e2, f = G / (r2 * Math.sqrt(r2));
    for (let k = 0; k < 3; k++) { a[0][k] += f * m[1] * d[k]; a[1][k] -= f * m[0] * d[k]; } return a; };
  let a = acc(), angPrev = 0, angAcc = 0; const rev = [], W = [], E = [];
  for (let k = 1; ; k++) {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) { v[i][j] += 0.5 * dt * a[i][j]; x[i][j] += dt * v[i][j]; }
    a = acc();
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) v[i][j] += 0.5 * dt * a[i][j];
    const t = k * dt, r = [0, 1, 2].map((j) => x[1][j] - x[0][j]), w = [0, 1, 2].map((j) => v[1][j] - v[0][j]);
    const th = Math.atan2(r[1], r[0]); let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const pa = angAcc; angAcc += d; angPrev = th;
    if (Math.floor(angAcc / (2 * Math.PI)) > Math.floor(pa / (2 * Math.PI))) rev.push(t);
    if (k % 64 === 0) {
      const rn = Math.hypot(...r), h = [r[1] * w[2] - r[2] * w[1], r[2] * w[0] - r[0] * w[2], r[0] * w[1] - r[1] * w[0]];
      const vxh = [w[1] * h[2] - w[2] * h[1], w[2] * h[0] - w[0] * h[2], w[0] * h[1] - w[1] * h[0]];
      const ev = [0, 1, 2].map((j) => vxh[j] / mu - r[j] / rn), hn = Math.hypot(...h), hu = h.map((z) => z / hn);
      const n = [-h[1], h[0], 0], nn = Math.hypot(n[0], n[1]);
      let varpi;
      if (nn < 1e-12 * hn) varpi = Math.atan2(ev[1], ev[0]);
      else { const Om = Math.atan2(n[1], n[0]), nu = n.map((z) => z / nn), nxe = [nu[1] * ev[2] - nu[2] * ev[1], nu[2] * ev[0] - nu[0] * ev[2], nu[0] * ev[1] - nu[1] * ev[0]];
        varpi = Om + Math.atan2(nxe[0] * hu[0] + nxe[1] * hu[1] + nxe[2] * hu[2], nu[0] * ev[0] + nu[1] * ev[1] + nu[2] * ev[2]); }
      W.push([t, varpi]); E.push(Math.hypot(...ev));
    }
    if (rev.length >= revMax) break;
  }
  const un = L.unwrap(W.map((z) => z[1])), fit = L.linfit(W.map((z) => z[0]), un);
  return { key: o.key, book: 'ref3d', incDeg, T2: 2 * Math.PI / fit.slope / YEAR, sid: (rev[rev.length - 1] - rev[0]) / (rev.length - 1) / DAY, eMean: E.reduce((s, z) => s + z, 0) / E.length,
    revN: rev.length, wallSec: (Date.now() - t0) / 1000 };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  if (spec.book === 'ref3d') process.stdout.write(JSON.stringify(ref3dRun(spec)));
  else {
    const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
    const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
    process.stdout.write(JSON.stringify(childTask(HP, spec)));
  }
} else if (IS_MAIN) {
  const OUT_PATH = process.env.W297B_OUT || path.join(ROOT, 'tests', 'out', 'fit-w297b.json');
  const PART = process.env.W297B_PART ? process.env.W297B_PART.split(',') : null;
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const csvText = fs.readFileSync(path.join(ROOT, CSV), 'utf8');
  const conv = conventions(HP, csvText);
  for (const c of conv) console.log(`段0 ${c.emoji} ${c.parent}: 署名 ${c.presetSigFnv}・law ${c.law}・実効 ${c.effectiveMode}・λ 宣言 ${c.lambdaDecl} → 走行 ${c.lambdaRun}・標的 ${c.target.obs} ${c.target.unit}(${c.sourceRow ? c.sourceRow.record_id : '行なし'})`);
  const NW = Math.max(1, Number(process.env.W297B_WORKERS) || 3);
  const run = makePool(NW, fileURLToPath(import.meta.url));
  const fmtR = (r) => r.windows ? `T118 ${L.fx(r.y, 4)} 年・e ${L.fx((r.windows.find((w) => w.N === 118) || r.windows[0]).eOsc, 4)}・恒星月 ${L.fx((r.windows.find((w) => w.N === 118) || r.windows[0]).sid, 4)} 日`
    : r.book === 'ref3d' ? `3 次元 傾斜 ${r.incDeg}°: T ${L.fx(r.T2, 4)} 年` : r.book === 'lambda' ? `λ 1/0: ${r.rows.map((z) => z.emoji + (z.same ? '同' : '違')).join('')}`
    : `周期 ${L.fx(r.periodMeanSec, 4)} s・近点 ${L.fx(r.apsArcsecPerCentury, 4)}″/世紀・eProxy ${L.ex(r.eProxy, 3)}`;
  const log = (r) => console.log(`  ${r.key}: gain ${r.gain}・dt ${r.dt}・${r.revN} 公転・${fmtR(r)}(${(r.wallSec || 0).toFixed(0)} s)`);
  const runsAll = {};
  // 段 0′: λ の不活性
  const lamIds = BOOKS.flatMap((b) => [b.parent, b.fitId]).filter((id) => find(HP, id));
  const lambda = await run({ key: 'lambda-probe', kind: 'lambda', book: 'mer', ids: lamIds, steps: 2000 });
  log(lambda);
  const twoBooks = BOOKS.filter((b) => b.kind === 'two' && (!PART || PART.includes(b.key)));
  const [searched, emsR] = await Promise.all([
    Promise.all(twoBooks.map(async (b) => {
      const { res, runs } = await searchBook(HP, b, run, log);
      Object.assign(runsAll, runs);
      let scans = null;
      if (res.final !== null) scans = await fScan(HP, b, res.final, run, log, runsAll);
      console.log(`段3 ${b.parentEmoji} ${b.key}: 挟めた ${res.bracketed}・最終 ${res.final}・模型 ${res.modelH}・残差 ${L.ex(res.residual, 3)}・h/2 ${L.ex(res.h2, 3)}・${res.status}`);
      return { res, scans };
    })),
    (!PART || PART.includes('ems')) ? emsWork(HP, run, log) : Promise.resolve(null)]);
  if (emsR) Object.assign(runsAll, emsR.runs);
  // 段 1: 速度の規約(🟣 の移送 gain と フィット gain で W と逆写像 v=(I+L)W)
  const inverse = [];
  const plu = searched.find((z) => z.res.key === 'plu');
  if (plu) {
    const b = bookOf('plu'), p = find(HP, b.parent), specs = [
      { key: 'plu-inv-transfer-W', book: 'plu', gain: p.physics.relativeDrag.gain, dt: b.dt, revMax: b.revMax, core: null },
      { key: 'plu-inv-transfer-V', book: 'plu', gain: p.physics.relativeDrag.gain, dt: b.dt, revMax: b.revMax, core: null, inverse: true }];
    if (plu.res.final !== null) specs.push({ key: 'plu-inv-fit-V', book: 'plu', gain: plu.res.final, dt: b.dt, revMax: b.revMax, core: b.priors, inverse: true });
    const rs = await Promise.all(specs.map((sp) => run(sp).then((r) => { log(r); runsAll[r.key] = r; return r; })));
    for (const r of rs) inverse.push({ key: r.key, gain: r.gain, inverse: !!r.inverse, gate: r.inverse, periodMeanSec: r.periodMeanSec, period2Sec: r.period2Sec, eProxy: r.eProxy,
      apsDegPerOrbit: r.apsDegPerOrbit, uRatioMean: r.uRatioMean, rMin: r.rMin, rMax: r.rMax });
    if (plu.res.finalRun) { const f = plu.res.finalRun.h; inverse.push({ key: 'plu-final-h(W —— 派生本の宣言)', gain: f.gain, inverse: false, gate: null, periodMeanSec: f.periodMeanSec, period2Sec: f.period2Sec, eProxy: f.eProxy,
      apsDegPerOrbit: f.apsDegPerOrbit, uRatioMean: f.uRatioMean, rMin: f.rMin, rMax: f.rMax }); }
  }
  if (emsR) inverse.push({ key: 'ems-inv(直した初期配置・移送 gain)', gain: find(HP, 'earthMoonSunInertial').physics.relativeDrag.gain, inverse: true, gate: emsR.ems.velocityConvention.gate,
    W118: emsR.ems.velocityConvention.W, V118: emsR.ems.velocityConvention.V });
  // 段 5: 記録と受理
  const records = [], derived = [];
  const allS = searched.map((z) => z.res).concat(emsR ? [{ key: 'ems', fitId: 'earthMoonSunInertialFit', ems: emsR.ems, fix: emsR.ems.fix, search: emsR.ems.search }] : []);
  for (const s of allS) {
    const z = searched.find((q) => q.res === s);
    const { rec, fSpan } = fitRecordOf(HP, s.key === 'ems' ? s : s, z ? z.scans : null);
    if (s.key !== 'ems') s.fSpan = fSpan;
    const v = HP.validateFitRecord(clone(rec));
    records.push({ key: s.key, fitId: s.fitId, rec, accepted: !!v.ok, err: v.ok ? null : v.err, canonSame: !!v.ok && JSON.stringify(v.fitRecord) === JSON.stringify(rec) });
    derived.push(derivedCheck(HP, s, rec));
  }
  const fitGains = Object.fromEntries(searched.map((z) => [z.res.key, { gain: z.res.final, note: null }]));
  fitGains.ems = { gain: null, note: '直した初期配置でも挟めない(gain を上げると近点周期は短くなる —— gain 0 で標的の片側)' };
  const sens = sensitivity(HP, fitGains);
  for (const s of sens.sources) console.log(`段2 ${s.emoji} ${s.source}→${s.receiver}: R/r ${L.ex(s.R / s.r, 3)}・⟨K⟩/K_ε ${L.fx(s.ratioMin, 8)}〜${L.fx(s.ratioMax, 8)}・上限 ${L.fx(s.farBound, 8)}・要る倍率 ${L.ex(s.need, 3)}`);
  if (emsR) { const E = emsR.ems; console.log(`段7 🌤️: 親の平均 e ${L.fx(E.parentW118.eOsc, 5)}・直した (rp ${E.fix.rp}, e0 ${E.fix.e0}) → T118 ${L.fx(E.fix.w118.T1, 4)}/${L.fx(E.fix.w118.T2, 4)}/${L.fx(E.fix.w118.T3, 4)}・3 次元 平面 ${L.fx(E.ref3d.flat.T2, 4)}(エンジン ${L.fx(E.ref3d.engineFlatT2, 4)})・傾斜 ${L.fx(E.ref3d.incl.T2, 4)}・探索 ${E.search.status}`); }
  if (PART) { console.log('W297B_PART —— 正本は書かない'); console.log(JSON.stringify({ records: records.map((r) => ({ fitId: r.fitId, accepted: r.accepted, err: r.err, status: r.rec.status })), derived }, null, 1)); process.exit(0); }
  const search = searched.map((z) => { const r = Object.assign({}, z.res); if (r.finalRun) r.finalRun = { h: { steps: r.finalRun.h.steps, revN: r.finalRun.h.revN, periodMeanSec: r.finalRun.h.periodMeanSec, period2Sec: r.finalRun.h.period2Sec,
    apsArcsecPerCentury: r.finalRun.h.apsArcsecPerCentury, eProxy: r.finalRun.h.eProxy, uRatioMean: r.finalRun.h.uRatioMean },
    h2: { steps: r.finalRun.h2.steps, revN: r.finalRun.h2.revN, periodMeanSec: r.finalRun.h2.periodMeanSec, apsArcsecPerCentury: r.finalRun.h2.apsArcsecPerCentury, eProxy: r.finalRun.h2.eProxy } };
    return Object.assign(r, { fScan: z.scans }); });
  const GT = gainTable(HP, search, emsR ? { status: emsR.ems.status === 'bracketed' ? 'bracketed' : 'unreachable-in-bounds' } : null);
  const runsForGate = Object.fromEntries(Object.entries(runsAll).filter(([, r]) => r && r.key));
  const G = gates({ runs: runsForGate, conv, sens, inverse, records, derived, lambda, ems: emsR ? emsR.ems : null });
  const timing = Object.fromEntries(Object.entries(runsForGate).map(([k, r]) => [k, { wallSec: r.wallSec }]));
  const out = { meta: null, conventions: conv, lambda: { rule: '原仮定者の裁定(第87報): geoPN=2・3・4 は λ_PN=0', rows: lambda.rows },
    velocityConvention: { rule: 'solve(velocity): (I+L)u = −Lv・W = v+u ⇒ v = (I+L)W(inertialDragInverseMap)', rows: inverse,
      note: '本の既定は親の vx/vy を v に与える(v=W)まま。逆写像は対照として走らせて記録するだけ(既定にするかは決断事項)' },
    sensitivity: sens, search, ems: emsR ? emsR.ems : null, fitRecords: records, derived, gainTable: GT, gates: G, ok: G.ok, timing,
    run: { books: BOOKS, siRange: SI_RANGE, gridN: GRID_N, workers: NW, ems: EMS },
    notClaim: ['現実を再現した', '月を再現した', '8.85 年を出した', '43″ を再現した', '較正 合', 'gain は普遍定数', '全系の保存則が閉じた'] };
  const CODE = ['tests/exp-w297b-fit.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/exp-w295c-inertial3.mjs', 'tests/exp-w293d-swing.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w292c-dragcore.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第297便b', target: TARGET, code: CODE, inputs: [TARGET, CSV] }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.FIT_LIB_VERSION, fitRecordVersion: L.FIT_RECORD_VERSION, condVersion: HP.FIT_COND_VERSION, engineVersion: HP.REL_DRAG_INERTIAL_VERSION, coreVersion: HP.DRAG_CORE_VERSION,
    inverseMapVersion: HP.INERTIAL_INVERSE_MAP_VERSION || null, emExtractorVersion: L.EM_EXTRACTOR_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第87報)「『再現しない』という主張はしない。『再現する努力』を常に優先度の高い目標に掲げる」「geoPN=2・3・4 のサンプルは全て λ_PN=0。修正したサンプルは再フィットする」',
    reading: '統括の検証項目 R162(主張文・フィット記録の条件結合・🌤️ の再現作業・🟫🟪 の再フィット)',
    composeDefault: [HP.REL_DRAG_COMPOSE_DEFAULT, HP.REL_DRAG_SOLVE_FROM_DEFAULT],
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセスで並列)' });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  for (const r of records) console.log(`記録 ${r.fitId}: 受理 ${r.accepted}・正準 ${r.canonSame}${r.err ? ' —— ' + r.err : ''}・sig ${r.rec.cond.sig}`);
  for (const d of derived) console.log(`派生本 ${d.id}: ${d.present ? 'あり' : 'なし'}・ok ${d.ok}${d.bad && d.bad.length ? ' —— ' + d.bad.join(' , ') : ''}`);
  for (const r of GT.rows) console.log(`gain ${r.emoji} ${r.label}: ${r.gain}・SI ${L.ex(r.gainSI, 6)}・比 ${L.ex(r.ratio, 4)}・${r.status}`);
  console.log(`門: ${JSON.stringify(G)}`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}

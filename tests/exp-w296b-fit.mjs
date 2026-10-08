// 第296便b(原仮定者の裁定(第86報)「1PN 準拠の geoPN=1 以外は、サンプル生成時に調整可能なパラメータをフィットさせる」
// 「geoPN=3 のサンプルは、観測値に合うように dragCore をフィットさせる。gain の妥当性も確認する」・統括の検証項目 R158)——
// **geoPN=3 のフィット生成器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。
// 走行は子プロセスで並列)。係数移送の 3 本(🌤️ earthMoonSunInertial・🟤 mercurySunInertial・🟣 plutoCharonInertial)は**対照として凍結**したまま
// (1 字も変えない)、宣言した 1 つの観測量へ調整可能なノブ(gain と構造核 dragCore の f・R_c)を合わせた**派生本**の値と記録 fitRecord を作る。
//
// ■ 段(正本 tests/out/fit-w296b.json —— 段 fit-296b・inertial3-295c の後)
//   段 0 規約の固定: 親の署名(presetSig の FNV)・法則(geoLawOfSim)・単位(scaleExp と時間の単位)・初期状態の指紋・観測量の出典
//        (paper/data/solar-observations.csv の record_id の行)・定義・窓・刻み(h と h/2)。抽出器は tests/exp-w295c-inertial3.mjs の
//        childTask(🟤🟣 = runPair〔検出器 B・周期・eProxy〕/ 🌤️ = 第293便d の childTask の 118 公転)を**そのまま呼ぶ**(新しい物理ステップは足さない ——
//        器の中の HP の写しの allPresets が親の写し〔gain・dragCore・初速だけ変えた〕を親の名前で返す)。
//   段 1 速度の規約: 合成則 solve(velocity) では (I+L)W = v(W = v+u は座標速度)。観測の座標速度を W と読むなら v = (I+L)W ——
//        html の純関数 `inertialDragInverseMap`(状態を動かさない・履歴を読まない)で 🟣 の「v を W から逆写像した写し」を対照として走らせ、
//        円に戻るか(eProxy)・周期差が残るかを記録する(本の既定にはしない —— 決断事項)。
//   段 2 感度: 各親の源の dragCore 43 通り(lib の CORE_GRID —— f ≥ (R_c/R)³)の ⟨K⟩/K_ε(受け手の距離)と遠方の上限 1/[1−(R/r)²]。
//        移送 gain のまま標的に届くのに要る核の倍率(= フィットした gain ÷ 移送 gain)と並べ、**実半径内の核では届かない**ことを数で示す。
//   段 3 探索: 🟤 近日点移動(gain 0 の対照との差・照合規約 43.0″/世紀 —— 1PN の量)/ 🟣 公転周期(8 公転の平均・Buie 2012 の 6.3872273 日)/
//        🌤️ 近点周期(A1・118 公転窓・8.85 年)。gain の対数格子(SI で 10⁻⁶〜0.0514182 m³/kg —— 🌤️ は 0 も)で根を挟み、挟めたら Illinois で詰め、
//        7 桁に丸めた値を h・h/2 で測り直して残差を数値誤差(|q_h − q_h/2|)と比べる。🟤 は太陽の f(R_c/R=0.3)を、🟣 は事前値の核を固定した gain で
//        f を振り、**同定できない**ことを記録する。挟めない本は status:"unreachable-in-bounds"(成果として記録 —— 初期条件・元期・配置は変えない)。
//   段 4 派生本の照合: html に派生本(mercurySunInertialFit・plutoCharonInertialFit・挟めたときだけ earthMoonSunInertialFit)があれば、
//        親との差がノブだけ・宣言の値と fitRecord が正本と同じ・絵文字が他の本(在位・退役)に無い・受理の警告 0。
//   段 5 受理: html の `validateFitRecord` が器の作った記録を受理し、正準形が同じ。
//   段 6 gain の妥当性: 移送値(0.0514182 m³/kg)と各フィット値の SI 換算・比・標的・status の表。
//
// ■ しないこと・言わないこと
//   ・親 3 本を書き換えない。半径を天体の外へ広げない。刻み依存の誤差までフィットしない(h/2 を見ずに桁を主張しない)。架空の σ を作らない。
//   ・「現実を再現した」「43″ を再現した」「較正 合」「gain は普遍定数」と書かない。較正母集団に入れない(派生本は sampleClass:"principle")。
//
// 実行(Node だけ・Chromium 不要・子プロセス 3 本 —— W296B_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w296b-fit.mjs          → 正本 tests/out/fit-w296b.json(W296B_OUT で出力先を変える)
//   W296B_PART=mer|plu|ems                → その本だけ探索して正本を書かずに終わる(開発用)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as C from './exp-w295c-inertial3.mjs';
import * as SW from './exp-w293d-swing.mjs';
import * as L from './lib-w296b-fit.mjs';
import { avgK as libAvgK, gaussLegendre01 as libGL } from './lib-w292c-dragcore.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.DRAG_CORE_NR","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_RECORD_VERSION","HP.INERTIAL_INVERSE_MAP_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.dragCoreAvgK","HP.dragCoreLookup","HP.dragCoreState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragInverseMap","HP.inertialDragState","HP.presetSig","HP.sim","HP.validateFitRecord","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w296b-fit-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const fnv = (t) => { let a = 0x811c9dc5; for (let i = 0; i < t.length; i++) { a ^= t.charCodeAt(i) & 0xff; a = Math.imul(a, 0x01000193) >>> 0; } return a.toString(16); };
const CSV = 'paper/data/solar-observations.csv';

/** 3 本の規約(標的・窓・刻み・格子)。SI の格子は 10⁻⁶〜0.0514182 m³/kg(移送値が上端)。 */
export const SI_RANGE = Object.freeze([1e-6, 0.0514182]);
export const GRID_N = 13;
export const BOOKS = Object.freeze([
  Object.freeze({ key: 'mer', parent: 'mercurySunInertial', fitId: 'mercurySunInertialFit', emoji: '🟫', parentEmoji: '🟤', kind: 'two', dt: 0.016, revMax: 8,
    target: Object.freeze({ q: 'perihelionRateDrag', obs: 43.0, unit: '″/世紀', record: 'SOL-f485f6f8',
      source: '照合規約の値 43.0″/世紀(☄️ mercuryReal の expected —— 観測 42.9799±0.0009″/世紀 は Park 2017 Table 3 の Gravitoelectric の行・1PN の量)',
      window: '8 公転・検出器 B(近点ごとの方位の直線 fit)・gain 0 の対照との差(同じ刻み)' }),
    tol: 1e-5, digits: 5, gain0Base: true, fitNotClaim: Object.freeze(['solar_cal', 'perihelion_43_fit', 'gain_universal_fit', 'single_quantity_fit']) }),
  Object.freeze({ key: 'plu', parent: 'plutoCharonInertial', fitId: 'plutoCharonInertialFit', emoji: '🟪', parentEmoji: '🟣', kind: 'two', dt: 0.16, revMax: 8,
    target: Object.freeze({ q: 'orbitalPeriodMean', obs: 551856.43872, unit: 's', record: 'SOL-25d4320f',
      source: 'Buie, Tholen & Grundy 2012 AJ 144 15 Table 5 の P = 6.3872273(3) 日(二体ケプラーの恒星周期・1σ 0.02592 s —— 判定行の宣言 judgement-sources.json)',
      window: '8 公転・同方向の周回の通過時刻の平均間隔(8 公転の平均)' }),
    tol: 1e-5, digits: 4, gain0Base: false, priors: L.PLUTO_PRIORS, fitNotClaim: Object.freeze(['solar_cal', 'period_target_fit', 'gain_universal_fit', 'single_quantity_fit']) }),
  Object.freeze({ key: 'ems', parent: 'earthMoonSunInertial', fitId: 'earthMoonSunInertialFit', emoji: '🌥️', parentEmoji: '🌤️', kind: 'em', dt: 0.016, revMax: 118,
    target: Object.freeze({ q: 'apsidalPeriod118', obs: 8.85, unit: '年', record: 'SOL-59edf981',
      source: '月の近地点経度の周期 8.85 年(🌛・🔆 の観測欄の値 —— JPL SSD の行 SOL-59edf981 の注記が ~8.85 年の量と記す・σ なし)',
      window: 'A1(本の宣言のまま)・118 公転の窓 [0,118] の近点方位の直線 fit' }),
    tol: null, digits: 4, gain0Base: false, fitNotClaim: Object.freeze(['solar_cal', 'apsidal_8p85_fit', 'gain_universal_fit', 'single_quantity_fit']) }),
]);
const bookOf = (k) => BOOKS.find((b) => b.key === k);
/** 本の単位の gain の格子(SI の格子を各本の単位へ)。🌤️ は 0 も格子に入れる。 */
export function gainGrid(HP, b) {
  const p = find(HP, b.parent), unit = Math.pow(10, 3 * p.scaleExp.L) / Math.pow(10, p.scaleExp.M);
  const lo = Number((SI_RANGE[0] / unit).toPrecision(12)), hi = p.physics.relativeDrag.gain;
  const g = L.logGrid(lo, hi, GRID_N).map((x, i) => (i === 0 || i === GRID_N - 1) ? x : Number(x.toPrecision(6)));
  return b.key === 'ems' ? [0].concat(g) : g;
}

/* ── 子プロセスの仕事: 親の写し(gain・dragCore・初速だけ変える)を親の名前で返す HP の写しを作り、第295便c の childTask をそのまま呼ぶ ── */
export function variantPreset(HP, b, o) {
  const q = clone(find(HP, b.parent));
  q.physics.relativeDrag.gain = o.gain;
  if (o.core) {
    for (const [i, c] of Object.entries(o.core)) { if (i === 'tableN') continue; q.bodies[+i].dragCore = { massFrac: c.f, radius: L.coreRadius(c.x, q.bodies[+i].radius) }; }
    if (o.core.tableN) q.physics.relativeDrag.coreTable = { n: o.core.tableN };
  }
  return q;
}
function stateFp(S) {
  let h1 = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < S.n; i++) { f[0] = S[k][i]; for (let j = 0; j < 8; j++) h1 = Math.imul(h1 ^ u8[j], 16777619) >>> 0; }
  const A = S._rdA ? Array.from(S._rdA).join(',') : '';
  return h1.toString(16) + ':' + fnv(A);
}
/** 逆写像 v=(I+L)W を親の写しの初速へ書く(build で位置・速度が宣言のままであることを確かめてから)。門の数も返す。 */
export function inverseMapped(HP, q) {
  const v = HP.validatePreset(clone(q));
  HP.sim.build(v.preset);
  const S = HP.sim, n = S.n;
  const same = q.bodies.every((z, i) => S.x[i] === z.x && S.y[i] === z.y && S.vx[i] === z.vx && S.vy[i] === z.vy);
  const before = stateFp(S);
  const M = HP.inertialDragInverseMap(S);
  const after = stateFp(S);
  // 独立の式(点源の核 —— 宣言に dragCore の無い写しだけ): v_i = W_i + Σ_j a_ij (W_i − W_j)・a_ij = C m_j r/(r²+ε²)²
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
export function childTask(HP, spec) {
  const t0 = Date.now(), b = bookOf(spec.book);
  let q = variantPreset(HP, b, spec), inv = null;
  if (spec.inverse) { const r = inverseMapped(HP, q); q = r.preset; inv = r.gate; }
  const X = hpWith(HP, b, q);
  if (b.kind === 'em') {
    const R = C.childTask(X, { key: spec.key, kind: 'em', cond: 'A1', dt: spec.dt, revMax: spec.revMax, spans: SW.BASE_SPANS });
    const w = R.windows, iL = SW.BASE_SPANS.findIndex(([a, z]) => a === 0 && z === spec.revMax);
    return { key: spec.key, book: b.key, gain: spec.gain, dt: spec.dt, revN: R.revN, steps: R.steps, nan: R.nan, warnings: R.warnings || [], drag: R.drag,
      windows: w.map((z) => ({ from: z.from, to: z.to, complete: z.complete, apsPeriodYr: z.apsPeriodYr, siderealDays: z.siderealDays, eMean: z.eMean, residRmsDeg: z.residRmsDeg })),
      y: w[iL].apsPeriodYr, wallSec: (Date.now() - t0) / 1000 };
  }
  const R = C.childTask(X, { key: spec.key, kind: 'two', book: b.key, gain: 'gain', hk: spec.dt === b.dt ? 'h' : 'h2', dt: spec.dt, revMax: spec.revMax, check: false });
  const p = find(HP, b.parent), U = C.timeUnits(p.scaleExp), n = R.rev.length;
  const periodMean = (R.rev[n - 1] - R.rev[0]) / (n - 1);
  return { key: spec.key, book: b.key, gain: spec.gain, dt: spec.dt, revN: n, steps: R.steps, nan: R.nan, warnings: R.warnings || [], drag: R.drag, inverse: inv,
    periodMeanSec: periodMean * U.sec, period2Sec: (R.rev[1] - R.rev[0]) * U.sec, apsDegPerOrbit: R.B ? R.B.slopeDegPerPeri : null,
    apsArcsecPerCentury: R.B ? R.B.slopeDegPerTime * U.century * 3600 : null, nPeri: R.B ? R.B.nPeri : null, residRmsDeg: R.B ? R.B.residRmsDeg : null,
    eProxy: R.eProxy, rMin: R.rMin, rMax: R.rMax, uRatioMean: R.uRatio ? R.uRatio.mean : null, osc0: R.osc0, wallSec: (Date.now() - t0) / 1000 };
}

/* ── 段 0: 規約の固定 ─────────────────────────────────────────── */
export function conventions(HP, csvText) {
  return BOOKS.map((b) => {
    const p = find(HP, b.parent), v = HP.validatePreset(clone(p));
    HP.sim.build(v.preset);
    const S = HP.sim, law = HP.geoLawOfSim(S), eff = HP.geoEffectiveMode(S);
    const row = L.csvRecord(csvText, b.target.record);
    return { key: b.key, parent: b.parent, emoji: b.parentEmoji, presetSigFnv: fnv(HP.presetSig(clone(p))), bodiesFnv: fnv(JSON.stringify(p.bodies)),
      law, effectiveMode: eff, geoPN: p.physics.geoPN, kFrame: p.physics.kFrame, scaleExp: p.scaleExp, timeUnits: C.timeUnits(p.scaleExp), integrator: p.integrator || 'semi',
      relativeDrag: p.physics.relativeDrag, softening: p.physics.softening, n: S.n, pinned: Array.from(S.pinned).map(Boolean),
      target: b.target, sourceRow: row, dt: b.dt, dtHalf: b.dt / 2, revMax: b.revMax,
      extractor: b.kind === 'em' ? 'tests/exp-w295c-inertial3.mjs childTask(kind:"em"・cond A1)→ tests/exp-w293d-swing.mjs childTask(kind:"cond"・118 公転・窓 BASE_SPANS)'
        : 'tests/exp-w295c-inertial3.mjs childTask(kind:"two")→ runPair(検出器 B・周回の通過時刻・距離の極値)' };
  });
}

/* ── 段 2: 感度(エンジンの dragCoreAvgK と lib-w292c の avgK —— 同じ式)── */
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
  // 遠方近似の窓の外(🌤️ 地球→月 の r/R ≈ 57)でも ratio ∈ [1, farBound] に入るか(全行)
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

/* ── 段 3: 探索(本ごと —— 格子 → 挟む → Illinois → 7 桁に丸めた値で h・h/2)── */
const T6 = (x) => Number(x.toPrecision(7));   // 7 桁(丸めの残差 ≪ h/2 の帯)
async function searchBook(HP, b, run, log) {
  const p = find(HP, b.parent), grid = gainGrid(HP, b), core = b.priors || null, runs = {};
  const R = async (tag, gain, dt, extra = {}) => { const sp = Object.assign({ key: `${b.key}-${tag}`, book: b.key, gain, dt, revMax: b.revMax, core }, extra);
    const r = await run(sp); runs[sp.key] = r; log(r); return r; };
  // 量 y(標的と比べる量)
  let base = null;
  if (b.gain0Base) { const [h, h2] = await Promise.all([R('g0-h', 0, b.dt), R('g0-h2', 0, b.dt / 2)]); base = { h: h.apsArcsecPerCentury, h2: h2.apsArcsecPerCentury }; }
  const yOf = (r) => b.key === 'mer' ? r.apsArcsecPerCentury - (r.dt === b.dt ? base.h : base.h2) : (b.key === 'plu' ? r.periodMeanSec : r.y);
  const tasks = grid.map((g, i) => R(`grid${i}-h`, g, b.dt));
  if (b.key === 'ems') grid.forEach((g, i) => tasks.push(R(`grid${i}-h2`, g, b.dt / 2)));
  else if (!b.gain0Base) tasks.push(R('g0-h', 0, b.dt), R('g0-h2', 0, b.dt / 2));
  const done = await Promise.all(tasks);
  const rows = grid.map((g, i) => { const r = done[i]; return { g, y: yOf(r), key: r.key }; });
  const rowsH2 = b.key === 'ems' ? grid.map((g, i) => ({ g, y: yOf(runs[`${b.key}-grid${i}-h2`]) })) : null;
  const br = L.bracketOf(rows, b.target.obs), brH2 = rowsH2 ? L.bracketOf(rowsH2, b.target.obs) : null;
  const g0r = runs[`${b.key}-g0-h`] || runs[`${b.key}-grid0-h`];
  const g0 = g0r && g0r.gain === 0 ? (b.kind === 'em' ? { y: g0r.y } : { periodMeanSec: g0r.periodMeanSec, period2Sec: g0r.period2Sec, apsArcsecPerCentury: g0r.apsArcsecPerCentury, eProxy: g0r.eProxy }) : null;
  const res = { key: b.key, emoji: b.parentEmoji, fitId: b.fitId, fitEmoji: b.emoji, parent: b.parent, target: b.target, grid: { gains: grid, unit: '[L³/M]', rangeSI: SI_RANGE }, rows, rowsH2,
    base, g0, bracketed: !!br, bracket: br ? { lo: br.lo.g, hi: br.hi.g, yLo: br.lo.y, yHi: br.hi.y } : null, digits: b.digits };
  if (!br) {
    const nr = L.nearestOf(rows, b.target.obs), nrH2 = rowsH2 ? rowsH2.find((z) => z.g === nr.g) : null;
    Object.assign(res, { final: null, nearest: { g: nr.g, y: nr.y, yH2: nrH2 ? nrH2.y : null }, modelH: nr.y, modelH2: nrH2 ? nrH2.y : null,
      residual: nr.y - b.target.obs, h2: nrH2 ? Math.abs(nr.y - nrH2.y) : null, bracketedH2: !!brH2, iters: [], status: 'unreachable-in-bounds',
      monotone: rows.every((z, i) => i === 0 || z.y <= rows[i - 1].y), yMax: Math.max(...rows.map((z) => z.y)), yMaxH2: rowsH2 ? Math.max(...rowsH2.map((z) => z.y)) : null });
    return { res, runs };
  }
  // Illinois(g について —— y はほぼ g の 1 次)
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
  // 7 桁に丸めた最終値: h・h/2(🟣 は 16 公転も)
  const fin = [R('final-h', g6, b.dt), R('final-h2', g6, b.dt / 2)];
  if (b.key === 'plu') fin.push(R('final-16-h', g6, b.dt, { revMax: 16, key: `${b.key}-final-16-h` }));
  const F = await Promise.all(fin);
  const yH = yOf(F[0]), yH2 = yOf(F[1]);
  Object.assign(res, { iters, final: g6, finalSI: L.gainSI(g6, p.scaleExp), modelH: yH, modelH2: yH2, residual: yH - b.target.obs, h2: Math.abs(yH - yH2),
    rev16: b.key === 'plu' ? { y: F[2].periodMeanSec, diffFromH: F[2].periodMeanSec - yH, revN: F[2].revN } : null,
    finalRun: { h: F[0], h2: F[1] } });
  res.status = L.statusOf({ bracketed: true, residual: res.residual, h2: res.h2 });
  return { res, runs };
}
/** 固定した gain で f を振る(🟤 太陽 R_c/R=0.3・🟣 冥王星/カロン)—— 同定できないことの記録。 */
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

/* ── fitRecord(common296 の 4 の形 —— 正準の並び)── */
export function fitRecordOf(HP, s, scans, conv) {
  const b = bookOf(s.key), p = find(HP, b.parent), c = conv.find((z) => z.key === b.key);
  const gainRange = [s.grid.gains.find((g) => g > 0), s.grid.gains[s.grid.gains.length - 1]];
  const knobs = [{ key: 'physics.relativeDrag.gain', range: gainRange, final: s.final }];
  const fixed = ['bodies・初期状態・元期・配置は親 ' + b.parentEmoji + ' ' + b.parent + ' の写し(1 字も変えない)', 'geoPN=3・kFrame=0・積分器・重力の軟化・核の ε=' + p.physics.relativeDrag.eps + '・pairs ' + JSON.stringify(p.physics.relativeDrag.pairs) + '(親のまま)',
    '合成則 solve(velocity)(既定)・親の vx/vy を力学速度 v に与える(速度の規約 v=W —— 逆写像 v=(I+L)W は対照だけ)'];
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
    : b.key === 'plu' ? ['軌道の形(離心率の代理)', '第 2 周の周期(記録だけ)', '自転・潮汐'] : ['恒星月', '離心率', '27 公転窓の近点周期'];
  const steps = s.finalRun ? s.finalRun.h.steps : null;
  const rec = { version: L.FIT_RECORD_VERSION, parent: b.parent, law: c.law,
    targets: [{ q: b.target.q, obs: b.target.obs, unit: b.target.unit, source: b.target.source, window: b.target.window }],
    knobs, fixed,
    procedure: 'gain の対数格子(SI で ' + SI_RANGE[0] + '〜' + SI_RANGE[1] + ' m³/kg・' + GRID_N + ' 点' + (b.key === 'ems' ? '+0' : '') + ')で根を挟む → Illinois で詰める → 7 桁に丸めた値を h と h/2 で測り直す(残差 ≤ 数値誤差の帯 |q_h − q_h/2| なら fitted)'
      + (b.key === 'ems' ? '' : ' → 固定した gain で dragCore の f を振る(同定の可否)'),
    dt: b.dt, steps: steps === null ? 0 : steps,
    residual: { value: s.residual, unit: b.target.unit, model: s.modelH, rel: s.residual / b.target.obs },
    numerics: { h2: s.h2, dtHalf: b.dt / 2 },
    status: s.status, notFitted };
  if (s.status === 'fitted' && notIdent.length) rec.notIdentifiable = notIdent;
  if (s.status === 'unreachable-in-bounds') rec.notFitted = ['gain の範囲 [0, ' + p.physics.relativeDrag.gain + '] で根を挟めない(格子の全点で ' + b.target.unit + ' の値が標的の片側)—— 初期条件・元期・配置は変えない(決断事項)'].concat(notFitted);
  return { rec, fSpan: span };
}

/* ── 段 4: 派生本の照合 ─────────────────────────────────────── */
export function derivedCheck(HP, s, rec) {
  const b = bookOf(s.key), d = find(HP, b.fitId), par = find(HP, b.parent);
  if (!d) return { id: b.fitId, present: false, ok: s.status !== 'fitted' };
  const bad = [];
  const q = variantPreset(HP, b, { gain: s.final, core: b.priors || null });
  if (JSON.stringify(d.bodies) !== JSON.stringify(q.bodies)) bad.push('bodies が親の写し+ノブでない');
  if (JSON.stringify(d.physics) !== JSON.stringify(q.physics)) bad.push('physics が親の写し+ノブでない');
  for (const k of ['scaleExp', 'integrator', 'orbitObs', 'group', 'familyId', 'scaleTier', 'fidelity']) if (JSON.stringify(d[k]) !== JSON.stringify(par[k])) bad.push(k + ' が親と違う');
  if (!(d.familyRole === 'variant' && d.sampleClass === 'principle' && d.referenceKind === 'observation-fit')) bad.push('分類(variant・principle・observation-fit)');
  // 親の注記のうちフィットと食い違う鍵(🟤 perihelion_43・🟣 period_fit・gain_universal)はフィット版の鍵へ置き換え、single_quantity_fit を足す(solar_cal は親のまま)
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
  const ab = d.abBody && d.abBody.physicsPatch && d.abBody.physicsPatch.relativeDrag;
  if (!(ab && ab.gain === 0)) bad.push('ワンタップの対照(gain 0)');
  return { id: d.id, present: true, emoji: d.emoji, ok: bad.length === 0, bad, sigFnv: fnv(HP.presetSig(clone(d))) };
}

/* ── 段 6: gain の妥当性の表 ─────────────────────────────────── */
export function gainTable(HP, conv, search) {
  const cv = C.conversion(HP), rows = [{ emoji: '🌛', label: '起点(🌛 earthMoonInertial の 8.85 年への 1 次元フィット —— L6/M25)', gain: cv.source.gain, gainSI: cv.cdSI, ratio: 1, target: '8.85 年(🌛 の二体)', status: '移送の起点' }];
  for (const r of cv.rows) rows.push({ emoji: r.emoji, label: '移送(' + r.id + ' —— 単位換算だけ)', gain: r.gainDeclared, gainSI: L.gainSI(r.gainDeclared, r.scaleExp), ratio: L.gainSI(r.gainDeclared, r.scaleExp) / cv.cdSI, target: '—', status: 'coefficient-transfer' });
  for (const s of search) {
    const p = find(HP, s.parent);
    const g = s.final, gs = g === null ? null : L.gainSI(g, p.scaleExp);
    rows.push({ emoji: s.fitEmoji, label: (s.status === 'unreachable-in-bounds' ? '探索だけ(派生本は作らない —— ' + s.target.q + ' を挟めない)' : 'フィット(' + s.fitId + ' —— ' + s.target.q + ')'), gain: g, gainSI: gs, ratio: gs === null ? null : gs / cv.cdSI,
      target: s.target.obs + ' ' + s.target.unit, status: s.status });
  }
  const fitted = rows.filter((r) => r.status === 'fitted');
  const spread = fitted.length >= 2 ? Math.max(...fitted.map((r) => r.gainSI)) / Math.min(...fitted.map((r) => r.gainSI)) : null;
  return { cdSI: cv.cdSI, rows, fittedSpread: spread,
    reading: '系ごとの経験係数としては使える(宣言した 1 量に合わせた値)。共通係数は見つかっていない —— フィット値どうしの比 ' + (spread === null ? '—' : L.ex(spread, 2))
      + '・移送値との比は表のとおり(複数系の同時フィットと独立の検証が要る)',
    notClaim: ['gain は普遍定数', '共通係数が決まった'] };
}

export function gates(o) {
  const all = Object.values(o.runs);
  const g = {
    runsOk: all.every((r) => !r.nan && (!r.drag || (r.drag.boundOver === 0 && r.drag.reject === 0))),
    warnFree: all.every((r) => !r.warnings || r.warnings.length === 0),
    complete: all.every((r) => r.revN >= (r.key.indexOf('-16-') >= 0 ? 16 : bookOf(r.book).revMax)),
    parentsFrozen: o.conv.every((c) => c.law === 'inertial-drag' && c.effectiveMode === 0 && c.geoPN === 3),
    sensLib: o.sens.libRelMax <= 1e-12, sensBand: o.sens.inBand, sensGrid: o.sens.grid.n === 43,
    inverse: o.inverse.every((z) => !z.gate || (z.gate.buildSame && z.gate.pure && (z.gate.indepRel === null || z.gate.indepRel <= 1e-14))),
    records: o.records.every((z) => z.accepted && z.canonSame),
    derived: o.derived.every((z) => z.ok),
  };
  g.ok = Object.values(g).every((x) => x === true);
  return g;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN) {
  const OUT_PATH = process.env.W296B_OUT || path.join(ROOT, 'tests', 'out', 'fit-w296b.json');
  const PART = process.env.W296B_PART ? process.env.W296B_PART.split(',') : null;
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const csvText = fs.readFileSync(path.join(ROOT, CSV), 'utf8');
  const conv = conventions(HP, csvText);
  for (const c of conv) console.log(`段0 ${c.emoji} ${c.parent}: 署名 ${c.presetSigFnv}・law ${c.law}・実効 ${c.effectiveMode}・標的 ${c.target.obs} ${c.target.unit}(${c.sourceRow ? c.sourceRow.record_id : '行なし'})`);
  const NW = Math.max(1, Number(process.env.W296B_WORKERS) || 3);
  const run = makePool(NW, fileURLToPath(import.meta.url));
  const fmtR = (r) => r.y !== undefined ? `P118 ${L.fx(r.y, 4)} 年` : `周期 ${L.fx(r.periodMeanSec, 4)} s・近点 ${L.fx(r.apsArcsecPerCentury, 4)}″/世紀・eProxy ${L.ex(r.eProxy, 3)}`;
  const log = (r) => console.log(`  ${r.key}: gain ${r.gain}・dt ${r.dt}・${r.revN} 公転・${fmtR(r)}(${r.wallSec.toFixed(0)} s)`);
  const runsAll = {};
  const books = BOOKS.filter((b) => !PART || PART.includes(b.key));
  const searched = await Promise.all(books.map(async (b) => {
    const { res, runs } = await searchBook(HP, b, run, log);
    Object.assign(runsAll, runs);
    let scans = null;
    if (res.final !== null) scans = await fScan(HP, b, res.final, run, log, runsAll);
    console.log(`段3 ${b.parentEmoji} ${b.key}: 挟めた ${res.bracketed}・最終 ${res.final}・模型 ${res.modelH}・残差 ${L.ex(res.residual, 3)}・h/2 ${L.ex(res.h2, 3)}・${res.status}`);
    return { res, scans };
  }));
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
  // 段 5: 記録と受理
  const records = [], derived = [];
  for (const z of searched) {
    const { rec, fSpan } = fitRecordOf(HP, z.res, z.scans, conv);
    z.res.fSpan = fSpan;
    const v = HP.validateFitRecord ? HP.validateFitRecord(clone(rec)) : { ok: false, err: 'html に validateFitRecord が無い' };
    records.push({ key: z.res.key, fitId: z.res.fitId, rec, accepted: !!v.ok, err: v.ok ? null : v.err, canonSame: !!v.ok && JSON.stringify(v.fitRecord) === JSON.stringify(rec) });
    derived.push(derivedCheck(HP, z.res, rec));
  }
  const fitGains = Object.fromEntries(searched.map((z) => [z.res.key, { gain: z.res.final, note: z.res.final === null ? '挟めない(gain を下げても標的の片側 —— 核の倍率 ≥ 1 でも届かない)' : null }]));
  const sens = sensitivity(HP, fitGains);
  for (const s of sens.sources) console.log(`段2 ${s.emoji} ${s.source}→${s.receiver}: R/r ${L.ex(s.R / s.r, 3)}・⟨K⟩/K_ε ${L.fx(s.ratioMin, 8)}〜${L.fx(s.ratioMax, 8)}・上限 ${L.fx(s.farBound, 8)}・要る倍率 ${L.ex(s.need, 3)}`);
  if (PART) { console.log('W296B_PART —— 正本は書かない'); console.log(JSON.stringify(records.map((r) => r.rec), null, 1)); process.exit(0); }
  const search = searched.map((z) => { const r = Object.assign({}, z.res); if (r.finalRun) r.finalRun = { h: { steps: r.finalRun.h.steps, revN: r.finalRun.h.revN, periodMeanSec: r.finalRun.h.periodMeanSec, period2Sec: r.finalRun.h.period2Sec,
    apsArcsecPerCentury: r.finalRun.h.apsArcsecPerCentury, eProxy: r.finalRun.h.eProxy, uRatioMean: r.finalRun.h.uRatioMean },
    h2: { steps: r.finalRun.h2.steps, revN: r.finalRun.h2.revN, periodMeanSec: r.finalRun.h2.periodMeanSec, apsArcsecPerCentury: r.finalRun.h2.apsArcsecPerCentury, eProxy: r.finalRun.h2.eProxy } };
    return Object.assign(r, { fScan: z.scans }); });
  const GT = gainTable(HP, conv, search);
  const runsForGate = Object.fromEntries(Object.entries(runsAll).filter(([, r]) => r && r.key));
  const G = gates({ runs: runsForGate, conv, sens, inverse, records, derived });
  const timing = Object.fromEntries(Object.entries(runsForGate).map(([k, r]) => [k, { wallSec: r.wallSec }]));
  const out = { meta: null, conventions: conv, velocityConvention: { rule: 'solve(velocity): (I+L)u = −Lv・W = v+u ⇒ v = (I+L)W(inertialDragInverseMap)', rows: inverse,
    note: '本の既定は親の vx/vy を v に与える(v=W)まま。逆写像は対照として走らせて記録するだけ(既定にするかは決断事項)' },
    sensitivity: sens, search, fitRecords: records, derived, gainTable: GT, gates: G, ok: G.ok, timing,
    run: { books: BOOKS, siRange: SI_RANGE, gridN: GRID_N, workers: NW },
    notClaim: ['現実を再現した', '43″ を再現した', '較正 合', 'gain は普遍定数', '全系の保存則が閉じた'] };
  const CODE = ['tests/exp-w296b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/exp-w295c-inertial3.mjs', 'tests/exp-w293d-swing.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w292c-dragcore.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第296便b', target: TARGET, code: CODE, inputs: [TARGET, CSV] }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.FIT_LIB_VERSION, fitRecordVersion: L.FIT_RECORD_VERSION, engineVersion: HP.REL_DRAG_INERTIAL_VERSION, coreVersion: HP.DRAG_CORE_VERSION,
    inverseMapVersion: HP.INERTIAL_INVERSE_MAP_VERSION || null, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第86報)「geoPN=3 のサンプルは、観測値に合うように dragCore をフィットさせる。gain の妥当性も確認する」',
    reading: '統括の検証項目 R158(宣言した 1 つの観測量へノブを合わせた派生本・親 3 本は凍結・挟めなければ unreachable-in-bounds・h/2 の数値誤差と比べる・gain の SI 表)',
    composeDefault: [HP.REL_DRAG_COMPOSE_DEFAULT, HP.REL_DRAG_SOLVE_FROM_DEFAULT],
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセスで並列)' });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  for (const r of records) console.log(`記録 ${r.fitId}: 受理 ${r.accepted}・正準 ${r.canonSame}${r.err ? ' —— ' + r.err : ''}`);
  for (const d of derived) console.log(`派生本 ${d.id}: ${d.present ? 'あり' : 'なし'}・ok ${d.ok}${d.bad && d.bad.length ? ' —— ' + d.bad.join(' , ') : ''}`);
  for (const r of GT.rows) console.log(`gain ${r.emoji} ${r.label}: ${r.gain}・SI ${L.ex(r.gainSI, 6)}・比 ${L.ex(r.ratio, 4)}・${r.status}`);
  console.log(`門: ${JSON.stringify(G)}`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}

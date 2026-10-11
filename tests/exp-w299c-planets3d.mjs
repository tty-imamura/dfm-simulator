// 第299便c(原仮定者の裁定(第89報)②「太陽系の各惑星の geoPN=3 版を、それぞれ三次元で用意する」・統括の検証項目 R171)——
// **惑星の geoPN=3 三次元の本 7 本(太陽+水星〜海王星の二体)の測定とフィットの器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步〔dfmStep3・dfmInertialDragStep3〕を走らせる。走行は子プロセスで並列)。
// 宣言(physics・bodies・timeRef)は tests/lib-w299c-planets3d.mjs の planetDecl3 が作る(html の内蔵はその写し —— QA preset.planets3d299 が照合)。
//
// ■ 段(正本 tests/out/planets3d-w299c.json —— 段 planets3d-299c)
//   0 初期状態: 各惑星の近似要素(JPL SSD Table 1・T=0)から相対の位置・速度(μ = G(M☉+m))→ 重心系(重心 0・全運動量 0)。
//     太陽と惑星の自転軸(IAU WGCCRE 2009 の極 → J2000 の黄道)。宣言のケプラー周期と観測の恒星周期の差を記録。
//   1 測定(全 7 本・gain 0 —— 重力だけの二体の三次元の基準): 刻み h(水星の 0.016 と同じ 1 公転の步数 ≈ 47500)と h/2 で 64 公転。
//     窓 8 公転と 64 公転で 恒星周期(初期の軌道面の中の方位の周回の平均間隔)・近日点の向き(検出器 B —— 距離の極小の 3 点放物線・
//     瞬間の軌道面の中の近点経度 ϖ = Ω + u・時刻への直線 fit → ″/世紀)・離心率(近日点と遠日点の距離)・軌道面の法線のずれ。
//   2 標的のある本(水星だけ —— 観測の行を持つのは 43.0″/世紀〔☄️ の照合規約の値・Park 2017 Table 3 の 1PN の行〕): gain の対数格子
//     (SI で 10⁻⁶〜0.0514182 m³/kg・13 点)を h で走り gain 0 の対照との近点率の差(8 公転)で 43.0″/世紀を挟み、Illinois で詰め、
//     7 桁に丸めて h・h/2・64 公転で測り直す。fitRecord(w298b-1 —— 近点率の差・恒星周期の 2 標的・門 = 全標的で |残差|+h/2 差 ≤ 照合許容の宣言)。
//   3 移送の診断(本には宣言しない): 水星の三次元のフィット値の gain を他の 6 本に置いたときの近点率の差(8 公転・h と h/2)と
//     1PN の式の値(参考 —— 観測ではない)の比。標的の無い本は gain を合わせない(gain 0 の基準の本)。
//
// ■ しないこと・言わないこと
//   ・二次元の 🟫 の値(43″・gain 0.004522415)を写して fitted と呼ばない(三次元で測り直す)。刻み依存の誤差を gain で吸収しない。架空の σ を作らない。
//   ・「現実を再現した」「43″ を再現した」「gain は普遍定数」と書かない。標的の観測行が無い本は「標的の観測行なし —— 次の見直し」。
//
// 実行(Node だけ・子プロセス 2 本 —— W299C_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w299c-planets3d.mjs          → 正本 tests/out/planets3d-w299c.json(W299C_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import { inPlaneLongitude } from './exp-w298c-moon3d.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.FIT_COND_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.allPresets","HP.coord3d","HP.fitCondSig","HP.inertialDragState","HP.validateFitRecord","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w299c-planets3d-1';
export const EXTRACTOR_VERSION = 'w299c-plx3-1';
const clone = (x) => JSON.parse(JSON.stringify(x));
const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const WINS = Object.freeze([8, 64]);
export const REV_MAX = 64;
export const SI_RANGE = Object.freeze([1e-6, 0.0514182]);
export const GRID_N = 13;
/** 標的(観測の行を持つ本だけ)。水星: 近点率の差 43.0″/世紀(☄️ の照合規約の値)と恒星周期(観測の正本の行)。 */
export const TARGETS = Object.freeze({
  mercury: Object.freeze({
    aps: Object.freeze({ obs: 43.0, unit: '″/世紀', record: 'SOL-f485f6f8',
      source: '照合規約の値 43.0″/世紀(☄️ mercuryReal の expected —— 観測 42.9799±0.0009″/世紀 は Park 2017 Table 3 の Gravitoelectric の行・1PN の量)',
      tol: Object.freeze({ value: 0.0009, kind: 'declared', note: '照合許容の宣言 0.0009″/世紀 —— 標的 43.0″/世紀は照合規約の値で出典の σ を持たない。幅は Park 2017 Table 3 の Gravitoelectric の行(42.9799″/世紀)の 1σ と同じにした(🟫 と同じ)' }) }),
    sid: Object.freeze({ unit: 'd',
      tol: Object.freeze({ value: 0.0005, kind: 'declared', note: '照合許容の宣言 0.0005 日 —— 恒星周期 87.969 日(NASA NSSDC Mercury Fact Sheet —— 観測の正本 OBS_COMPARE_ROWS の行)は表記の末位まで・σ なし。初期状態は近似要素の種(合わせた量ではない)' }) }),
  }),
});
/** 標的の無い本の扱い(報告と notClaim/説明の語)。 */
export const NO_TARGET = Object.freeze({
  venus: '金星の近日点の相対論的な部分(1PN の式で約 8.6″/世紀)は、暦表の解析からの推定値の出典と不確かさを本便では一次資料で確かめられなかった(ネットワーク不通)—— 標的の観測行なし・次の見直し',
  mars: '火星の近日点の相対論的な部分(1PN の式で約 1.35″/世紀)は、暦表の解析からの推定値の出典と不確かさを本便では一次資料で確かめられなかった(ネットワーク不通)—— 標的の観測行なし・次の見直し',
  jupiter: '外惑星の近日点の相対論的な部分は 1PN の式で 1 世紀に 0.06″ 以下 —— 観測の行が無く、数値の分解能(h と h/2 の差)と比べる量 —— 標的の観測行なし・次の見直し',
  saturn: '外惑星の近日点の相対論的な部分は 1PN の式で 1 世紀に 0.06″ 以下 —— 観測の行が無く、数値の分解能(h と h/2 の差)と比べる量 —— 標的の観測行なし・次の見直し',
  uranus: '外惑星の近日点の相対論的な部分は 1PN の式で 1 世紀に 0.06″ 以下 —— 観測の行が無く、数値の分解能(h と h/2 の差)と比べる量 —— 標的の観測行なし・次の見直し',
  neptune: '外惑星の近日点の相対論的な部分は 1PN の式で 1 世紀に 0.06″ 以下 —— 観測の行が無く、数値の分解能(h と h/2 の差)と比べる量 —— 標的の観測行なし・次の見直し',
});

/* ── 宣言から本(検証前の生の形)を作る —— html の内蔵の本の physics・bodies・timeRef はこの写し ── */
export function presetOf(HP, key, gain) {
  const d = P3.planetDecl3(HP, key, { gain });
  return { id: d.pl.id, name: d.pl.ja, description: d.pl.ja + '(器の写し)', scaleExp: clone(d.scaleExp), sampleClass: 'principle', timeRef: d.timeRef, camera: d.camera, world: { boundary: 'none', size: 0 },
    physics: d.physics, bodies: d.bodies, overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } };
}

/* ── 走行(アプリの三次元の步)と事象列 ── */
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const n = Math.hypot(a[0], a[1], a[2]); return [a[0] / n, a[1] / n, a[2] / n]; };
export function runPl3(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const dt = o.dt, revMax = o.revMax, ci = 0, oi = 1;
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], S.z[oi] - S.z[ci]];
  const relV = () => [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], S.vz[oi] - S.vz[ci]];
  const p0 = rel(), w0 = relV(), W0 = unit(cross(p0, w0)), Pu = unit(p0), Qu = cross(W0, Pu);
  const angOf = (d) => Math.atan2(dot(d, Qu), dot(d, Pu));
  let angPrev = angOf(p0), angAcc = 0, r1 = Math.hypot(...p0), r2 = r1, P1 = p0, P2 = p0, nan = false, k = 0, hPrev = null, wMax = 0;
  const ev = { rev: [], peri: [], apo: [] };
  for (; ; k++) {
    S.step(dt);
    const d = rel(), rr = Math.hypot(...d);
    if (!Number.isFinite(rr)) { nan = true; break; }
    const th = angOf(d);
    let dd = th - angPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += dd; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); ev.rev.push((k + fr) * dt); }
    const h = cross(P1, d);
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const den = (r2 - 2 * r1 + rr), fr = (den !== 0) ? 0.5 * (r2 - rr) / den : 0, hh = hPrev || h;
      let a1 = inPlaneLongitude(P2, hh), a2 = inPlaneLongitude(P1, hh), a3 = inPlaneLongitude(d, hh);
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (den !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * den) : r1;
      (r1 < r2 ? ev.peri : ev.apo).push({ t: (k + fr) * dt, ang, r: rv });
      const wn = unit(hh), dw = Math.acos(Math.max(-1, Math.min(1, dot(wn, W0)))) * 180 / Math.PI; if (dw > wMax) wMax = dw;
    }
    P2 = P1; P1 = d; r2 = r1; r1 = rr; hPrev = h;
    if (ev.rev.length >= revMax) { k++; break; }
  }
  const st = HP.inertialDragState(S);
  return { ev, steps: k, nan: nan || S.hasNaN(), coord3d: S.coord3d === true, warnings: v.warnings || [], planeDriftDegMax: wMax,
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax } : null };
}
/** 窓 N 公転の量(周期 —— 周回の平均間隔・近点率 —— 検出器 B の時刻への直線 fit・離心率)。U: 本の時間単位の秒。 */
export function windowOf(R, N, Tsec) {
  const rev = R.ev.rev;
  if (rev.length < N) return { N, complete: false };
  const tEnd = rev[N - 1], pe = R.ev.peri.filter((z) => z.t <= tEnd), ap = R.ev.apo.filter((z) => z.t <= tEnd);
  const per = N >= 2 ? (rev[N - 1] - rev[0]) / (N - 1) : rev[0];
  const out = { N, complete: true, periodUnits: per, periodDays: per * Tsec / P3.DAY_S, nPeri: pe.length };
  if (pe.length >= 3) {
    const un = L.unwrap(pe.map((z) => z.ang)), fit = L.linfit(pe.map((z) => z.t), un), cent = 36525 * P3.DAY_S / Tsec;
    out.apsArcsecPerCentury = fit.slope * cent * 180 / Math.PI * 3600;
    out.apsDegPerOrbit = fit.slope * per * 180 / Math.PI;
    out.residRmsArcsec = fit.rms * 180 / Math.PI * 3600;
  } else { out.apsArcsecPerCentury = null; out.apsDegPerOrbit = null; }
  if (pe.length && ap.length) { const rp = pe.reduce((s, z) => s + z.r, 0) / pe.length, ra = ap.reduce((s, z) => s + z.r, 0) / ap.length; out.ecc = (ra - rp) / (ra + rp); out.aMean = (ra + rp) / 2; }
  return out;
}

/* ── 子プロセスの仕事 ── */
export function childTask(HP, spec) {
  const t0 = Date.now();
  const q = presetOf(HP, spec.planet, spec.gain);
  const R = runPl3(HP, q, { dt: spec.dt, revMax: spec.revMax });
  const Tsec = Math.pow(10, q.scaleExp.T);
  const windows = (spec.wins || WINS).map((N) => windowOf(R, N, Tsec));
  const w8 = windows.find((w) => w.N === 8) || null;
  return { key: spec.key, planet: spec.planet, gain: spec.gain, dt: spec.dt, revN: R.ev.rev.length, steps: R.steps, nan: R.nan, coord3d: R.coord3d, warnings: R.warnings,
    drag: R.drag, planeDriftDegMax: R.planeDriftDegMax, windows, y: w8 ? w8.apsArcsecPerCentury : null, wallSec: (Date.now() - t0) / 1000 };
}
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
export const gainUnit = (X = P3.SCALE_EXP) => Math.pow(10, 3 * X.L) / Math.pow(10, X.M);
export function gainGrid() {
  const u = gainUnit(P3.SCALE_EXP), lo = Number((SI_RANGE[0] / u).toPrecision(12)), hi = Number((SI_RANGE[1] / u).toPrecision(12));
  return L.logGrid(lo, hi, GRID_N).map((x, i) => (i === 0 || i === GRID_N - 1) ? x : Number(x.toPrecision(6)));
}
const T7 = (x) => Number(x.toPrecision(7));

/** fitRecord(w298b-1 —— 近点率の差・恒星周期)。 */
export function fitRecordOf(HP, J) {
  const m = J.books.find((b) => b.key === 'mercury'), f = m.fit, TG = TARGETS.mercury;
  const ex = 'tests/exp-w299c-planets3d.mjs runPl3(' + EXTRACTOR_VERSION + ')';
  const obsD = P3.planetOf('mercury').period.s / P3.DAY_S;
  const targets = [
    { q: '近点率の差(gain 0 の対照との差・8 公転・検出器 B —— 瞬間の軌道面の中の近点経度 ϖ=Ω+u の時刻への直線 fit・同じ刻み)', obs: TG.aps.obs, unit: TG.aps.unit, source: TG.aps.source,
      window: '8 公転・検出器 B・gain 0 の対照との差(同じ刻み)', tol: clone(TG.aps.tol), extractor: ex + ' —— 距離の極小の 3 点放物線・瞬間の軌道面(位置の外積)で ϖ',
      model: f.h.diff, residual: f.h.diff - TG.aps.obs, rel: (f.h.diff - TG.aps.obs) / TG.aps.obs, numerics: { h2: Math.abs(f.h2.diff - f.h.diff), dtHalf: m.h / 2 } },
    { q: '恒星周期(初期の軌道面の中の方位の周回の平均間隔・8 公転)', obs: obsD, unit: TG.sid.unit, source: P3.planetOf('mercury').period.source,
      window: '8 公転', tol: clone(TG.sid.tol), extractor: ex + ' —— 初期の軌道面(位置と速度の外積)の中の方位の通過',
      model: f.h.w8.periodDays, residual: f.h.w8.periodDays - obsD, rel: (f.h.w8.periodDays - obsD) / obsD, numerics: { h2: Math.abs(f.h2.w8.periodDays - f.h.w8.periodDays), dtHalf: m.h / 2 } }];
  const gateOk = targets.every((t) => Math.abs(t.residual) + t.numerics.h2 <= t.tol.value);
  const status = !m.search.bracketed ? 'unreachable-in-bounds' : (gateOk ? 'fitted' : 'not-identifiable');
  return { version: 'w298b-1', parent: 'mercurySunInertialFit', law: 'inertial-drag(三次元 —— physics.coord:"3d"・並進だけ・回転引きずりと軸引きずりは宣言しない)・λ_PN=0',
    targets, knobs: [{ key: 'physics.relativeDrag.gain', range: [m.search.grid[0], m.search.grid[m.search.grid.length - 1]], final: f.gain }],
    fixed: ['初期状態は JPL SSD の近似要素(Table 1・T=0)の種から作った太陽と水星の二体(重心 0・全運動量 0・太陽も free)—— 精密な接触状態ではない・惑星どうしの摂動なし',
      '質量・半径・自転は ☄️ mercuryReal の写し(同じ単位)・自転軸は IAU WGCCRE 2009 の極(一定の近似)を有効化(回転引きずり・軸引きずりの宣言なし —— 軸は力に入らない)',
      'geoPN=3・kFrame=0・λ_PN=0・積分器 semi・重力の軟化 0.05・核の ε 0.05・pairs "all"・stateCarry "double"(🟫 と同じ)'],
    procedure: 'gain の対数格子(SI 10⁻⁶〜0.0514182 m³/kg・13 点)を h で走り gain 0 の対照との近点率の差(8 公転)で 43.0″/世紀を挟む → Illinois → 7 桁に丸めて h と h/2(と 64 公転の窓)で測り直した(器 tests/exp-w299c-planets3d.mjs)。二次元の 🟫 の値は写していない',
    dt: m.h, steps: f.h.steps, status,
    notFitted: ['恒星周期は合わせていない(近似要素の種の周期 —— 照合だけ)', '離心率・軌道傾斜は近似要素の種のまま(合わせていない)', '機構(1PN の近日点前進の機構の同定ではない)'],
    cond: { version: HP.FIT_COND_VERSION, sig: '', extractor: ex } };
}

export async function main() {
  const OUT_PATH = process.env.W299C_OUT || path.join(ROOT, 'tests', 'out', 'planets3d-w299c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const NW = Math.max(1, Number(process.env.W299C_WORKERS) || 2);
  const run = makePool(NW, fileURLToPath(import.meta.url));
  const runs = {};
  const fmt = (x, d) => (x === null || x === undefined) ? '—' : Number(x).toFixed(d);
  const log = (r) => { runs[r.key] = r; const w = r.windows.find((z) => z.N === 8);
    console.log(`  ${r.key}: gain ${r.gain}・dt ${r.dt}・${r.revN} 公転・周期 ${fmt(w && w.periodDays, 5)} 日・近点 ${fmt(w && w.apsArcsecPerCentury, 5)}″/世紀(${(r.wallSec || 0).toFixed(0)} s)`); return r; };
  const R = (sp) => run(Object.assign({ revMax: 8, wins: [8], gain: 0 }, sp)).then(log);
  // 段 0・1: 初期状態と gain 0 の測定(h・h/2・64 公転)
  const books = P3.PLANETS.map((pl) => {
    const d = P3.planetDecl3(HP, pl.key, { gain: 0 }), { h } = P3.stepsOf(d.timeRef.pRef), Tsec = Math.pow(10, d.scaleExp.T);
    const G = d.physics.G, sun = d.bodies[0], pla = d.bodies[1];
    const pn1 = P3.pn1RateArcsecPerCentury(G, sun.m + pla.m, d.physics.cLight, d.kepler.aLen, pl.el.e, d.kepler.P, d.scaleExp);
    return { key: pl.key, id: pl.id, emoji: pl.emoji, ja: pl.ja, scaleExp: d.scaleExp, gainUnitSI: gainUnit(d.scaleExp), h, pRef: d.timeRef.pRef, el: pl.el, pole: pl.pole, axes: { sun: d.bodies[0].spinAxis, planet: d.bodies[1].spinAxis },
      masses: { sun: sun.m, planet: pla.m }, radius: pla.radius, spin: pla.spin, keplerPeriodDays: d.kepler.P * Tsec / P3.DAY_S, obsPeriodDays: pl.period.s / P3.DAY_S,
      periodSource: pl.period.source, periodBuiltIn: pl.period.builtIn, M0deg: d.kepler.M0deg, pn1Ref: pn1, target: TARGETS[pl.key] ? 'fit' : 'none', noTarget: NO_TARGET[pl.key] || null };
  });
  const base = await Promise.all(books.flatMap((b) => [R({ key: b.key + '-g0-h', planet: b.key, dt: b.h, revMax: REV_MAX, wins: WINS }), R({ key: b.key + '-g0-h2', planet: b.key, dt: b.h / 2, revMax: REV_MAX, wins: WINS })]));
  books.forEach((b, i) => { const a = base[2 * i], c = base[2 * i + 1];
    b.g0 = { h: { w8: a.windows[0], w64: a.windows[1], steps: a.steps, planeDriftDegMax: a.planeDriftDegMax }, h2: { w8: c.windows[0], w64: c.windows[1], steps: c.steps, planeDriftDegMax: c.planeDriftDegMax } };
    b.g0.apsRes8 = Math.abs(b.g0.h.w8.apsArcsecPerCentury - b.g0.h2.w8.apsArcsecPerCentury);
    b.g0.apsRes64 = Math.abs(b.g0.h.w64.apsArcsecPerCentury - b.g0.h2.w64.apsArcsecPerCentury);
    b.periodResidDays = b.g0.h.w8.periodDays - b.obsPeriodDays; });
  // 段 2: 水星の gain の探索
  const mer = books.find((b) => b.key === 'mercury'), TG = TARGETS.mercury;
  const grid = gainGrid();
  const gRuns = await Promise.all(grid.map((g, i) => R({ key: `mer-grid${i}`, planet: 'mercury', gain: g, dt: mer.h })));
  const y0 = mer.g0.h.w8.apsArcsecPerCentury;
  const rows = grid.map((g, i) => ({ g, y: gRuns[i].y - y0 }));
  const br = L.bracketOf(rows, TG.aps.obs), nr = L.nearestOf(rows, TG.aps.obs);
  mer.search = { grid, rows, bracketed: !!br, bracket: br ? { lo: br.lo.g, hi: br.hi.g, yLo: br.lo.y, yHi: br.hi.y } : null, nearest: nr, iters: [] };
  console.log(`段2 格子: ${rows.map((z) => L.ex(z.g, 3) + '→' + fmt(z.y, 3)).join(' ')}・挟めた ${mer.search.bracketed}`);
  let gFit = nr.g;
  if (br) {
    let st = { a: br.lo.g, fa: br.lo.y - TG.aps.obs, b: br.hi.g, fb: br.hi.y - TG.aps.obs, side: 0 };
    for (let it = 0; it < 40; it++) {
      const xg = L.illinoisNext(st), r = await R({ key: `mer-it${it}`, planet: 'mercury', gain: xg, dt: mer.h });
      const fv = (r.y - y0) - TG.aps.obs; mer.search.iters.push({ g: xg, y: r.y - y0, f: fv });
      if (Math.abs(fv) <= 2e-6) break;
      st = L.illinoisUpdate(st, xg, fv);
    }
    gFit = T7(mer.search.iters[mer.search.iters.length - 1].g);
  }
  const [fh, fh2] = await Promise.all([R({ key: 'mer-fit-h', planet: 'mercury', gain: gFit, dt: mer.h, revMax: REV_MAX, wins: WINS }), R({ key: 'mer-fit-h2', planet: 'mercury', gain: gFit, dt: mer.h / 2, revMax: REV_MAX, wins: WINS })]);
  const fitOf = (r, g0) => ({ w8: r.windows[0], w64: r.windows[1], steps: r.steps, diff: r.windows[0].apsArcsecPerCentury - g0.w8.apsArcsecPerCentury, diff64: r.windows[1].apsArcsecPerCentury - g0.w64.apsArcsecPerCentury,
    periodShiftSec: (r.windows[0].periodDays - g0.w8.periodDays) * P3.DAY_S });
  mer.fit = { gain: gFit, gainSI: gFit * gainUnit(), h: fitOf(fh, mer.g0.h), h2: fitOf(fh2, mer.g0.h2) };
  console.log(`段2 最終: gain ${gFit}・差 ${fmt(mer.fit.h.diff, 6)}(h/2 ${fmt(mer.fit.h2.diff, 6)})・64 公転 ${fmt(mer.fit.h.diff64, 6)}″/世紀`);
  // 段 3: 移送の診断(水星の三次元のフィット値を他の本へ —— 宣言しない)
  const others = books.filter((b) => b.key !== 'mercury');
  const gOf = (b) => Number((gFit * gainUnit(P3.SCALE_EXP) / b.gainUnitSI).toPrecision(12));   // 同じ SI の値を本の単位へ
  const tr = await Promise.all(others.flatMap((b) => [R({ key: b.key + '-tr-h', planet: b.key, gain: gOf(b), dt: b.h }), R({ key: b.key + '-tr-h2', planet: b.key, gain: gOf(b), dt: b.h / 2 })]));
  others.forEach((b, i) => { const a = tr[2 * i], c = tr[2 * i + 1];
    b.transfer = { gain: gOf(b), gainSI: gFit * gainUnit(P3.SCALE_EXP), h: a.windows[0].apsArcsecPerCentury - b.g0.h.w8.apsArcsecPerCentury, h2: c.windows[0].apsArcsecPerCentury - b.g0.h2.w8.apsArcsecPerCentury,
      periodShiftSec: (a.windows[0].periodDays - b.g0.h.w8.periodDays) * P3.DAY_S };
    b.transfer.res = Math.abs(b.transfer.h - b.transfer.h2); b.transfer.ratioPn1 = b.transfer.h / b.pn1Ref; });
  mer.transfer = { gain: gFit, h: mer.fit.h.diff, h2: mer.fit.h2.diff, res: Math.abs(mer.fit.h.diff - mer.fit.h2.diff), ratioPn1: mer.fit.h.diff / mer.pn1Ref, periodShiftSec: mer.fit.h.periodShiftSec };
  const J = { meta: null, lib: P3.LIB_VERSION, sources: { elements: P3.ELEM_SOURCE, poles: P3.POLE_SOURCE, network: P3.NETWORK_NOTE, obliquityArcsec: P3.OBLIQUITY_ARCSEC, auM: P3.AU_M },
    wins: WINS, books };
  const rec = fitRecordOf(HP, J);
  const dp = presetOf(HP, 'mercury', gFit); dp.fitRecord = rec;
  const v = HP.validatePreset(clone(dp));
  rec.cond.sig = v.ok ? HP.fitCondSig(v.preset, rec) : '';
  const vr = HP.validateFitRecord(clone(rec));
  mer.fitRecord = rec; mer.recordAccepted = !!vr.ok; mer.recordErr = vr.ok ? null : vr.err; mer.status = rec.status;
  books.forEach((b) => { b.gainDeclared = b.key === 'mercury' ? gFit : 0; b.status = b.key === 'mercury' ? rec.status : 'no-target'; });
  const all = Object.values(runs);
  J.gates = { runsOk: all.every((r) => !r.nan && (!r.drag || (r.drag.boundOver === 0 && r.drag.reject === 0))), complete: all.every((r) => r.revN >= 8),
    coord3d: all.every((r) => r.coord3d === true), noWarn: all.every((r) => (r.warnings || []).length === 0), record: mer.recordAccepted,
    planeKept: books.every((b) => b.g0.h.planeDriftDegMax < 1e-4) };
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = Object.fromEntries(Object.entries(runs).map(([k, r]) => [k, { wallSec: Number(r.wallSec) || 0 }]));
  J.notClaim = ['「現実を再現した」', '「43″ を再現した」', '「gain は普遍定数」', '「二次元の値を写して fitted」'];
  const CODE = ['tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/exp-w298c-moon3d.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w296b-fit.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第299便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, extractorVersion: EXTRACTOR_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第89報)②「太陽系の各惑星の geoPN=3 版を、それぞれ三次元で用意する」', reading: '統括の検証項目 R171(惑星の geoPN=3 三次元の新本・初期状態の生成器・測定と標的のある惑星のフィット)' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(J, null, 1) + '\n');
  for (const b of books) console.log(`${b.emoji} ${b.ja}: 周期 ${fmt(b.g0.h.w8.periodDays, 4)} 日(観測 ${fmt(b.obsPeriodDays, 4)}・差 ${fmt(b.periodResidDays, 4)})・gain 0 の近点 ${fmt(b.g0.h.w8.apsArcsecPerCentury, 5)}(h/2 ${fmt(b.g0.h2.w8.apsArcsecPerCentury, 5)})″/世紀・移送 ${b.transfer ? fmt(b.transfer.h, 5) + '(1PN の式 ' + fmt(b.pn1Ref, 5) + ')' : '—'}`);
  console.log(`門: ${JSON.stringify(J.gates)}・status ${rec.status} → ${path.relative(ROOT, OUT_PATH)}(${J.elapsedS.toFixed(0)} s)`);
}

/* ── 本の文面(観測カード・説明・監査)と宣言の写し —— `--emit <path>` で html に入れる 7 本の JS を書く(QA は obsNumbers で数の転記を照合) ── */
const SRC_EMOJI = Object.freeze({ mercuryReal: '☄️', venusReal: '🌇', marsMoonsReal: '🥔', jupiterGalilean: '🟠', saturnRingReal: '💍', uranusReal: '💠', neptuneReal: '🌊' });
export const nf = (x, d) => Number(x).toFixed(d);
export const ne = (x, d) => Number(x).toExponential(d);
/** 本 b の観測カードに入っているべき数の文字列(ja・en とも —— QA preset.planets3d299 が照合する)。 */
export function obsNumbers(J, key) {
  const b = J.books.find((z) => z.key === key), g = b.g0, out = [nf(g.h.w8.periodDays, 4), nf(g.h2.w8.periodDays, 4), nf(b.obsPeriodDays, 3), nf(g.h.w8.apsArcsecPerCentury, 5), nf(g.h2.w8.apsArcsecPerCentury, 5),
    nf(b.axes.planet.tiltDeg, 2), nf(b.axes.sun.tiltDeg, 2)];
  if (key === 'mercury') { const f = b.fit; out.push(String(f.gain), nf(f.h.diff, 5), nf(f.h2.diff, 5), nf(f.h.diff64, 5)); }
  else out.push(nf(b.transfer.h, b.transfer.h >= 0.01 ? 5 : 8), ne(b.transfer.ratioPn1, 2), nf(g.h.w64.apsArcsecPerCentury, 5));
  return out;
}
function jsLit(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return '[' + v.map(jsLit).join(', ') + ']';
  if (typeof v === 'object') return '{' + Object.keys(v).map((k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ':' + jsLit(v[k])).join(', ') + '}';
  return JSON.stringify(v);
}
export function emitBooks(HP, J) {
  const out = [];
  const pT = (x) => nf(x, 4);
  for (const b of J.books) {
    const pl = P3.planetOf(b.key), d = P3.planetDecl3(HP, b.key, { gain: b.gainDeclared }), g = b.g0, mer = b.key === 'mercury', X = d.scaleExp;
    const se = SRC_EMOJI[pl.src], el = pl.el, retro = pl.pole.wSign < 0;
    const axJ = `太陽 傾き ${nf(b.axes.sun.tiltDeg, 2)}°・方位 ${nf(b.axes.sun.azimuthDeg, 2)}° / ${pl.ja} 傾き ${nf(b.axes.planet.tiltDeg, 2)}°・方位 ${nf(b.axes.planet.azimuthDeg, 2)}°(黄道の北から・軸は一定${retro ? '・逆行で spin 負' : ''})`;
    const axE = `Sun tilt ${nf(b.axes.sun.tiltDeg, 2)}, az ${nf(b.axes.sun.azimuthDeg, 2)} deg / ${pl.en} tilt ${nf(b.axes.planet.tiltDeg, 2)}, az ${nf(b.axes.planet.azimuthDeg, 2)} deg (fixed${retro ? '; retrograde, spin < 0' : ''})`;
    const elJ = `a ${el.a} au・e ${el.e}・I ${el.I}°・Ω ${el.Om}°・ϖ ${el.varpi}°・L ${el.L}°(T=0)`;
    const elE = `a ${el.a} au, e ${el.e}, I ${el.I}, Omega ${el.Om}, varpi ${el.varpi}, L ${el.L} deg (T=0)`;
    const perJ = `${pT(g.h.w8.periodDays)} 日(h/2 ${pT(g.h2.w8.periodDays)}・64 公転 ${pT(g.h.w64.periodDays)})・観測との差 ${nf(b.periodResidDays, 4)} 日(種の周期 —— 合わせていない)`;
    const perE = `${pT(g.h.w8.periodDays)} d (h/2 ${pT(g.h2.w8.periodDays)}, 64 orbits ${pT(g.h.w64.periodDays)}); ${nf(b.periodResidDays, 4)} d from observed (seed, not matched)`;
    const obsPJ = `${nf(b.obsPeriodDays, 3)} 日(${pl.period.builtIn ? '観測の正本の行' : 'NASA NSSDC —— 原表は未取得の転記'})`;
    const obsPE = `${nf(b.obsPeriodDays, 3)} d (${pl.period.builtIn ? 'built-in observation row' : 'NASA NSSDC - transcribed, not fetched'})`;
    const apsJ = `8 公転 ${nf(g.h.w8.apsArcsecPerCentury, 5)}″/世紀(h/2 ${nf(g.h2.w8.apsArcsecPerCentury, 5)})・64 公転 ${nf(g.h.w64.apsArcsecPerCentury, 5)} —— h/2 との差 ${ne(b.g0.apsRes8, 2)} が数値の分解能`;
    const apsE = `8 orbits ${nf(g.h.w8.apsArcsecPerCentury, 5)}"/cy (h/2 ${nf(g.h2.w8.apsArcsecPerCentury, 5)}), 64 orbits ${nf(g.h.w64.apsArcsecPerCentury, 5)}; the h/2 gap ${ne(b.g0.apsRes8, 2)} = resolution`;
    const pnJ = `参考: 1PN の式 ${nf(b.pn1Ref, b.pn1Ref >= 0.1 ? 3 : 5)}″/世紀(観測ではない)`, pnE = `reference: 1PN formula ${nf(b.pn1Ref, b.pn1Ref >= 0.1 ? 3 : 5)}"/cy (not observed)`;
    const setJ = `太陽と${pl.ja}の二体(三次元・重心 0・太陽も free)。geoPN=3・λ_PN=0・${mer ? '慣性引きずり gain ' + b.gainDeclared : 'gain 0(重力だけの基準)'}・自転軸を有効化`;
    const setE = `Sun and ${pl.en}, 3D two-body (barycentre 0, Sun free); geoPN=3, lambda_PN=0, ${mer ? 'drag gain ' + b.gainDeclared : 'gain 0 (gravity only)'}; spin axes on`;
    let rowsJ, rowsE, summaryJ, summaryE, controlJ, controlE, ab, fittedJ, fittedE, notClaim, name, nameE;
    const head = `(第299便c・原仮定者の裁定〔第89報〕②「太陽系の各惑星の geoPN=3 版を、それぞれ三次元で用意する」・統括の検証項目 R171)`;
    const headE = ` (wave 299c; the originator's ruling in report 89 (2): prepare a geoPN=3 version of each solar-system planet, each in 3D; the coordinator's check item R171)`;
    const icJ = `初期状態は JPL SSD の近似要素(Table 1・T=0)の種から作った(μ=G(M☉+m)・重心 0・全運動量 0・太陽も free —— **近似要素であって精密な接触状態ではなく、惑星どうしの摂動は入っていない**)。質量・半径・自転は ${se} と ☄️ の太陽の写し(単位を換算)、太陽と${pl.ja}の自転軸は IAU WGCCRE 2009 の極を J2000 の黄道へ回して有効化した(軸は一定の近似 —— 回転引きずり・軸引きずりは宣言しないので軸は力に入らない)。`;
    const icE = `The initial state is built from the JPL SSD approximate elements (Table 1, T=0) as a seed (mu=G(M_sun+m), barycentre 0, total momentum 0, the Sun free - APPROXIMATE ELEMENTS, NOT A PRECISE OSCULATING STATE, AND NO PLANET-PLANET PERTURBATIONS). Masses, radii and spins are copied from ${se} and the Sun of ☄️ (units converted); the spin axes of the Sun and ${pl.en} are the IAU WGCCRE 2009 poles rotated to the J2000 ecliptic and enabled (held fixed - no rotational or axial drag is declared, so the axes enter no force). `;
    if (mer) {
      const f = b.fit, rec = b.fitRecord, t0 = rec.targets[0], t1 = rec.targets[1];
      name = '太陽と水星(慣性決定力版・三次元)— 近点率に合わせた gain'; nameE = 'Sun & Mercury (inertial determinacy, 3D) — the gain matched to the apsidal rate';
      rowsJ = [['何を置いたか', setJ, '—(原理サンプル —— 較正母集団の外)'], ['初期状態(入力)', elJ, 'JPL SSD 近似要素 Table 1(種 —— 精密な状態ではない)'], ['自転軸(入力)', axJ, 'IAU WGCCRE 2009 の極'],
        ['gain(フィット)', `${f.gain} [L³/M] = ${ne(f.gainSI, 6)} m³/kg(三次元で探索した根 —— 二次元の 🟫 の値は写していない)`, '—'],
        ['模型・残差・数値誤差', `gain 0 との近点率の差 ${nf(f.h.diff, 5)}″/世紀(h/2 ${nf(f.h2.diff, 5)}・64 公転 ${nf(f.h.diff64, 5)})・残差 ${ne(t0.residual, 2)}・h/2 差 ${ne(t0.numerics.h2, 2)}`, '43.0″/世紀(照合規約の値 —— 1PN の量)'],
        ['恒星周期(照合・8 公転)', `${pT(g.h.w8.periodDays)} 日(h/2 ${pT(g.h2.w8.periodDays)})・観測との差 ${nf(b.periodResidDays, 4)} 日(門 ≤ 0.0005 日・合わせていない)`, obsPJ],
        ['近点率(実測・gain 0 の対照)', apsJ, pnJ],
        ['言わないこと', `43″/世紀を DFM から導いたとは言わない。合わせたのは 1 量だけ・gain は系ごとの経験係数・status ${rec.status}`, '—']];
      rowsE = [['What is placed', setE, '- (a principle sample, outside the calibration population)'], ['Initial state (inputs)', elE, 'JPL SSD approximate elements Table 1 (a seed, not a precise state)'], ['Spin axes (inputs)', axE, 'IAU WGCCRE 2009 poles'],
        ['gain (fitted)', `${f.gain} [L^3/M] = ${ne(f.gainSI, 6)} m^3/kg (root searched in 3D; the 2D 🟫 value is not copied)`, '-'],
        ['Model, residual, numerics', `difference from gain 0 ${nf(f.h.diff, 5)}"/cy (h/2 ${nf(f.h2.diff, 5)}, 64 orbits ${nf(f.h.diff64, 5)}); residual ${ne(t0.residual, 2)}; h/2 gap ${ne(t0.numerics.h2, 2)}`, '43.0"/cy (comparison convention, 1PN)'],
        ['Sidereal period (compared)', `${pT(g.h.w8.periodDays)} d (h/2 ${pT(g.h2.w8.periodDays)}); ${nf(b.periodResidDays, 4)} d from observed (gate <= 0.0005 d; not matched)`, obsPE],
        ['Apsidal rate (gain-0 control)', apsE, pnE],
        ['Not claimed', `43"/cy is not derived from DFM; one quantity matched; the gain is per system; status ${rec.status}`, '-']];
      summaryJ = `**慣性決定力版の太陽と水星の三次元 —— 近点率に gain を合わせた本**${head}。太陽と水星の二体を physics.coord:"3d" で置き、重力(E4)と慣性引きずり(既定の合成則 solve(velocity)・並進だけ)で回す。${icJ}gain は器 tests/exp-w299c-planets3d.mjs が**三次元で測り直して**合わせた: gain 0 の対照との近点率の差(8 公転・検出器 B —— 瞬間の軌道面の中の近点経度 ϖ=Ω+u の時刻への直線 fit・同じ刻み)を照合規約の値 43.0″/世紀(☄️ の expected・1PN の量)に合わせる。対数格子(SI 10⁻⁶〜0.0514182 m³/kg・13 点)で挟み、Illinois で詰め、7 桁に丸めた **gain ${f.gain} [L³/M](${ne(f.gainSI, 5)} m³/kg)**を h=${b.h} と h/2 で測り直した —— 差 ${nf(f.h.diff, 5)}″/世紀(h/2 ${nf(f.h2.diff, 5)}・64 公転 ${nf(f.h.diff64, 5)})。恒星周期 ${pT(g.h.w8.periodDays)} 日は観測 87.969 日と ${nf(b.periodResidDays, 4)} 日の差で照合の門の内(合わせていない)。記録は fitRecord(w298b-1 の 2 標的 —— 近点率の差・恒星周期・status ${rec.status})。二次元の 🟫(gain 0.004522415)は二次元のフィットとして残す。`;
      summaryE = `THE INERTIAL-DETERMINACY SUN AND MERCURY IN 3D WITH THE GAIN MATCHED TO THE APSIDAL RATE${headE}. The Sun and Mercury are placed as a two-body system with physics.coord 3d and run under gravity (E4) and the inertial drag (the default composition rule solve(velocity), translation only). ${icE}The harness tests/exp-w299c-planets3d.mjs RE-MEASURED THE GAIN IN 3D: the apsidal-rate difference from the gain-0 control (8 orbits, detector B - a straight-line fit in time of the longitude of perihelion in the instantaneous orbital plane, varpi = Omega + u, at the same step) is matched to the comparison value 43.0 arcsec/century (☄️'s expected value, a 1PN quantity). The root was bracketed on a log grid (1e-6 to 0.0514182 m^3/kg in SI, 13 points), refined by Illinois, and the 7-digit GAIN ${f.gain} [L^3/M] (${ne(f.gainSI, 5)} m^3/kg) re-measured at h=${b.h} and h/2 - difference ${nf(f.h.diff, 5)} arcsec/century (h/2 ${nf(f.h2.diff, 5)}, 64 orbits ${nf(f.h.diff64, 5)}). The sidereal period ${pT(g.h.w8.periodDays)} d is ${nf(b.periodResidDays, 4)} d from the observed 87.969 d, inside the comparison gate (not matched). The record is fitRecord (version w298b-1 with two targets - the apsidal-rate difference and the sidereal period; status ${rec.status}). The 2D 🟫 (gain 0.004522415) stays as the 2D fit.`;
      controlJ = 'ワンタップの対照は gain 0(慣性引きずりを切る —— 重力だけの二体の三次元)。比べる相手は 🟫(二次元のフィット)と ☄️(1PN の近日点前進・二次元)。';
      controlE = 'The one-tap control is gain 0 (the inertial drag off - the gravity-only two-body system in 3D). Compare with 🟫 (the 2D fit) and ☄️ (the 1PN perihelion advance, 2D).';
      ab = { label: { ja: '慣性引きずりを切る(gain 0 —— 重力だけの二体の三次元)', en: 'switch the inertial drag off (gain 0 - the gravity-only two-body system in 3D)' },
        physicsPatch: { relativeDrag: { law: 'inertial', gain: 0, eps: 0.05, history: 'positions', pairs: 'all' } } };
      fittedJ = [`gain(relativeDrag.gain)= ${f.gain} [L³/M] —— gain 0 の対照との近点率の差を 43.0″/世紀に合わせた 1 次元フィット(三次元・対数格子で挟む → Illinois → 7 桁・残差 ${ne(t0.residual, 2)}″/世紀・h/2 の差 ${ne(t0.numerics.h2, 2)})。記録は fitRecord`];
      fittedE = [`gain (relativeDrag.gain) = ${f.gain} [L^3/M] - a one-dimensional fit (in 3D) of the apsidal-rate difference from the gain-0 control to 43.0 arcsec/century (log-grid bracket, Illinois, 7 digits; residual ${ne(t0.residual, 2)}, h/2 gap ${ne(t0.numerics.h2, 2)}). The record is fitRecord`];
      notClaim = ['perihelion_43_fit', 'gain_universal_fit', 'planet3d_seed'];
    } else {
      const t = b.transfer, nt = NO_TARGET[b.key];
      name = `太陽と${pl.ja}(慣性決定力版・三次元)— gain 0 の基準`; nameE = `Sun & ${pl.en} (inertial determinacy, 3D) — the gain-0 baseline`;
      const td = t.h >= 0.01 ? 5 : 8;
      const trJ = `水星の三次元のフィット値(同じ SI)で gain 0 との差 ${nf(t.h, td)}″/世紀(h/2 ${nf(t.h2, td)})—— 1PN の式の ${ne(t.ratioPn1, 2)} 倍`;
      const trE = `Mercury's 3D fit (same SI): ${nf(t.h, td)}"/cy from gain 0 (h/2 ${nf(t.h2, td)}) - ${ne(t.ratioPn1, 2)} x the 1PN formula`;
      rowsJ = [['何を置いたか', setJ, '—(原理サンプル —— 較正母集団の外)'], ['初期状態(入力)', elJ, 'JPL SSD 近似要素 Table 1(種 —— 精密な状態ではない)'], ['自転軸(入力)', axJ, 'IAU WGCCRE 2009 の極'],
        ['恒星周期(実測・8 公転)', perJ, obsPJ], ['近点率(実測・gain 0)', apsJ, pnJ], ['移送の診断(実測・本には宣言しない)', trJ, '—'],
        ['標的', '観測の行なし —— gain は合わせていない(次の見直し)', '—'],
        ['言わないこと', '惑星どうしの摂動・暦表の状態ベクトルは入っていない。移送の値は本に宣言しない', '—']];
      rowsE = [['What is placed', setE, '- (a principle sample, outside the calibration population)'], ['Initial state (inputs)', elE, 'JPL SSD approximate elements Table 1 (a seed, not a precise state)'], ['Spin axes (inputs)', axE, 'IAU WGCCRE 2009 poles'],
        ['Sidereal period (8 orbits)', perE, obsPE], ['Apsidal rate (gain 0)', apsE, pnE], ['Transfer diagnostic (not declared)', trE, '-'],
        ['Target', 'no observational row - the gain is not matched (next review)', '-'],
        ['Not claimed', 'no planet-planet perturbations and no ephemeris state vector; the transfer value is not declared', '-']];
      summaryJ = `**慣性決定力版の太陽と${pl.ja}の三次元の基準 —— gain 0**${head}。太陽と${pl.ja}の二体を physics.coord:"3d" で置き、重力(E4)と慣性引きずり(既定の合成則 solve(velocity)・並進だけ)で回す。${icJ}**gain は合わせていない(0 —— 重力だけの二体の三次元の基準)**: ${nt}。器 tests/exp-w299c-planets3d.mjs の実測: 8 公転の恒星周期 ${pT(g.h.w8.periodDays)} 日(観測 ${nf(b.obsPeriodDays, 3)} 日・差 ${nf(b.periodResidDays, 4)} 日 —— 近似要素の種の周期)・gain 0 の近点率 ${nf(g.h.w8.apsArcsecPerCentury, 5)}″/世紀(h/2 ${nf(g.h2.w8.apsArcsecPerCentury, 5)} —— この差が数値の分解能)。水星の三次元のフィット値を同じ SI で移送すると差は ${nf(t.h, t.h >= 0.01 ? 5 : 8)}″/世紀(1PN の式 ${nf(b.pn1Ref, b.pn1Ref >= 0.1 ? 3 : 5)}″/世紀の ${ne(t.ratioPn1, 2)} 倍 —— 本には宣言しない診断)。`;
      summaryE = `THE INERTIAL-DETERMINACY SUN AND ${pl.en.toUpperCase()} IN 3D - THE GAIN-0 BASELINE${headE}. The Sun and ${pl.en} are placed as a two-body system with physics.coord 3d and run under gravity (E4) and the inertial drag (the default composition rule solve(velocity), translation only). ${icE}THE GAIN IS NOT MATCHED (0 - the gravity-only 3D two-body baseline): no observational target row with a source and an uncertainty could be confirmed for this planet in this wave - next review. Measured by the harness tests/exp-w299c-planets3d.mjs: the 8-orbit sidereal period ${pT(g.h.w8.periodDays)} d (observed ${nf(b.obsPeriodDays, 3)} d; ${nf(b.periodResidDays, 4)} d apart - the period of the element seed); the gain-0 apsidal rate ${nf(g.h.w8.apsArcsecPerCentury, 5)} arcsec/century (h/2 ${nf(g.h2.w8.apsArcsecPerCentury, 5)} - the gap is the numerical resolution). Carrying Mercury's 3D fitted value in SI gives a difference of ${nf(t.h, t.h >= 0.01 ? 5 : 8)} arcsec/century (${ne(t.ratioPn1, 2)} times the 1PN formula ${nf(b.pn1Ref, b.pn1Ref >= 0.1 ? 3 : 5)} arcsec/century - a diagnostic not declared in the sample).`;
      controlJ = `ワンタップの対照は水星の三次元のフィット値の移送(同じ SI の gain ${t.gain} —— 合わせていない診断)。比べる相手は ${se}(二次元・geoPN=1)と 🌡️(三次元・水星のフィット)。`;
      controlE = `The one-tap control carries Mercury's 3D fitted value (the same SI gain, ${t.gain} here - a diagnostic, not a fit). Compare with ${se} (2D, geoPN=1) and 🌡️ (3D, Mercury's fit).`;
      ab = { label: { ja: `水星の三次元のフィット値を移送(gain ${t.gain} —— 同じ SI・合わせていない)`, en: `carry Mercury's 3D fitted value (gain ${t.gain} - the same SI, not a fit)` },
        physicsPatch: { relativeDrag: { law: 'inertial', gain: t.gain, eps: 0.05, history: 'positions', pairs: 'all' } } };
      fittedJ = ['**無し** —— 標的の観測行なし(gain 0・次の見直し)']; fittedE = ['NOTHING - no observational target row (gain 0; next review)'];
      notClaim = ['planet3d_no_target', 'gain_universal_fit', 'planet3d_seed'];
    }
    const observeJ = `トレイルで${pl.ja}の楕円が閉じるのを見る。視点のスライダーで横から見ると、軌道面が黄道(xy 面)に対して ${el.I}° 傾いているのが見える。数は説明タブの観測カード${mer ? 'と「フィットの記録」' : ''}。`;
    const observeE = `Use the trail to watch ${pl.en}'s ellipse close. Turn the view slider to look side-on and the orbital plane is seen tilted ${el.I} deg to the ecliptic (the xy plane). The numbers are in the observation card${mer ? ' and the fit record' : ''} of the explanation tab.`;
    const lenM = Math.pow(10, X.L - 2) * 5;
    const audit = (lang) => {
      const J0 = lang === 'ja';
      return { observedInputs: J0 ? ['実 G=6.674', '実 c₀=29979.2458', `太陽・${pl.ja}の実質量・実半径・実自転(☄️ の太陽と ${se} の写し —— 単位を換算)`, '近似要素 a・e・I・Ω・ϖ・L(JPL SSD Table 1・T=0 —— 種)', '自転軸の極(IAU WGCCRE 2009 —— 一定の近似)', `恒星周期 ${nf(b.obsPeriodDays, 3)} 日(照合だけ)`]
        : ['real G=6.674', 'real c0=29979.2458', `the real masses, radii and spins of the Sun and ${pl.en} (copied from ☄️'s Sun and ${se}, units converted)`, 'approximate elements a, e, I, Omega, varpi, L (JPL SSD Table 1, T=0 - a seed)', 'spin-axis poles (IAU WGCCRE 2009 - held fixed)', `sidereal period ${nf(b.obsPeriodDays, 3)} d (compared only)`],
        fixedConventions: J0 ? [`サンプル別スケール指数(1単位=10^${X.L}m/10^${X.T}s/10^${X.M}kg)`, 'physics.coord:"3d"(右手系・黄道は xy 面・+x は J2000 の春分点)', 'geoPN=3・kFrame=0・λ_PN=0', `慣性引きずり relativeDrag:{law:"inertial", gain:${b.gainDeclared}, eps:0.05, history:"positions", pairs:"all"}(並進だけ・compose は書かない = 既定 solve(velocity))`, '点源(dragCore を宣言しない)・kRep=muF=γN=κ_S=0', 'stateCarry:"double"・massFloor=1e-6', '太陽も free(重心 0・全運動量 0)']
          : [`per-sample scale exponents (1 unit = 10^${X.L} m / 10^${X.T} s / 10^${X.M} kg)`, 'physics.coord 3d (right-handed; the ecliptic is the xy plane; +x is the J2000 equinox)', 'geoPN=3, kFrame=0, lambda_PN=0', `inertial drag relativeDrag:{law:"inertial", gain:${b.gainDeclared}, eps:0.05, history:"positions", pairs:"all"} (translation only; compose not declared = the default solve(velocity))`, 'point sources (no dragCore), kRep=muF=gammaN=kappaS=0', 'stateCarry "double", massFloor=1e-6', 'the Sun free (barycentre 0, total momentum 0)'],
        fitted: J0 ? fittedJ : fittedE,
        derived: J0 ? ['κ=G/c₀²=7.4258×10⁻⁹', `μ=G(M☉+m)・近似要素の a のケプラー周期 ${pT(b.keplerPeriodDays)} 日`] : ['kappa=G/c0^2=7.4258e-9', `mu=G(M_sun+m); the Kepler period of the element a ${pT(b.keplerPeriodDays)} d`],
        numerical: J0 ? [`ソフトニング ε=0.05 = ${ne(lenM, 0)}m(重力と引きずりの核)`, `時間倍率 timeScale=1・画面の刻み stepDt=pRef/360・器の刻み h=${b.h}`, '粒子表示倍率 dispMag=10(表示専用)']
          : [`softening eps=0.05 = ${ne(lenM, 0)} m (gravity and the drag kernel)`, `time multiplier timeScale=1, screen step stepDt=pRef/360, harness step h=${b.h}`, 'display magnification dispMag=10 (display only)'] };
    };
    const card = (rows) => rows.map(([q, model, obs]) => { for (const x of [q, model, obs]) if (x.length > 120) throw new Error(pl.key + ' の観測カードの欄が 120 字を超える(' + x.length + '): ' + x); return { q, model, obs }; });
    const P = { id: pl.id, name, emoji: pl.emoji, group: '現実較正', familyId: pl.family, familyRole: 'variant', scaleTier: 'planetary', scaleExp: X, sampleClass: 'principle' };
    if (mer) P.referenceKind = 'observation-fit';
    Object.assign(P, { fidelity: 'real', notClaim, orbitObs: { center: 0, orbiter: 1, ghostAmp: 20 }, abBody: ab, obsCard: card(rowsJ),
      descStruct: { summary: summaryJ, observe: observeJ, control: controlJ },
      en: { name: nameE, obsCard: card(rowsE), descStruct: { summary: summaryE, observe: observeE, control: controlE }, parameterAudit: audit('en') }, parameterAudit: audit('ja') });
    const lines = [];
    lines.push(`// ===== 第299便c(原仮定者の裁定(第89報)②・統括の検証項目 R171): ${pl.emoji} ${pl.id} —— 太陽と${pl.ja}の geoPN=3 三次元(${mer ? '近点率に合わせた gain —— 三次元で測り直し' : 'gain 0 の基準 —— 標的の観測行なし'})=====`);
    lines.push(`// physics・bodies・timeRef・camera は生成器 tests/lib-w299c-planets3d.mjs の planetDecl3 の写し(QA preset.planets3d299 が照合)。数は正本 tests/out/planets3d-w299c.json の実測。`);
    const body = Object.keys(P).map((k) => `  ${k}:${jsLit(P[k])}`);
    let txt = '{ ' + body.join(',\n').replace(/^  /, '') + ',\n';
    if (mer) txt += '  fitRecord:' + JSON.stringify(b.fitRecord) + ',\n';
    txt += '  activeParams:["geoPN","dispMag"],\n';
    txt += `  camera:${jsLit(d.camera)}, world:{boundary:"none",size:0},\n`;
    txt += `  timeRef:${jsLit(d.timeRef)},\n`;
    txt += `  physics:${jsLit(d.physics)},\n`;
    txt += `  bodies:[   // 0=太陽(free・自転軸を有効化), 1=${pl.ja}\n` + d.bodies.map((z) => '    ' + jsLit(z)).join(',\n') + '\n  ],\n';
    txt += '  overlays:{rotationCurve:false,tempHistogram:false,field:false,trail:true} },';
    out.push(lines.join('\n') + '\n' + txt);
  }
  return out.join('\n') + '\n';
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN && process.argv.includes('--emit')) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const J = JSON.parse(fs.readFileSync(process.env.W299C_OUT || path.join(ROOT, 'tests', 'out', 'planets3d-w299c.json'), 'utf8'));
  fs.writeFileSync(process.argv[process.argv.indexOf('--emit') + 1], emitBooks(HP, J));
} else if (IS_MAIN && process.argv.includes('--probe')) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const key = process.argv[process.argv.indexOf('--probe') + 1] || 'mercury';
  const d = P3.planetDecl3(HP, key, { gain: 0 });
  console.log(JSON.stringify({ kepler: d.kepler, poles: d.poles, bodies: d.bodies, timeRef: d.timeRef, camera: d.camera }, null, 1));
  const v = HP.validatePreset(clone(presetOf(HP, key, 0)));
  console.log('ok', v.ok, 'warnings', JSON.stringify(v.warnings), 'errors', JSON.stringify(v.errors));
  const { h } = P3.stepsOf(d.timeRef.pRef);
  const t1 = Date.now(), r = childTask(HP, { key: 'probe', planet: key, gain: Number(process.argv[process.argv.indexOf('--probe') + 2] || 0), dt: h, revMax: 8, wins: [8] });
  console.log(JSON.stringify(r).slice(0, 1500), (Date.now() - t1) / 1000, 's');
} else if (IS_MAIN) await main();

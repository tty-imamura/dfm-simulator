// 第318便c(原仮定者の指示(第120報)「支障がなければ、太陽系の１６体サンプルを作成する」・統括の検証項目 R256)——
// **太陽系 16 体の内蔵の本 🗺️ solarSystem16Inertial3d の器**(段 solar16-318c → 正本 tests/out/solar16-w318c.json)。
//
// ■ 何をするか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)
//   ① 入力の検査(tests/lib-w318c-solar16.mjs の inputCheck —— 意味の検査の目安。暦表の精度の判定ではない)と、宣言の形の照合(入力の長い形と内蔵の短い形 ——
//      受理後の宣言が同じ JSON・60 步の状態がビット同一)・内蔵の本(html)の宣言が lib の builtinDecl の写しか。
//   ② 刻みの検査: K1 の本と 1PN の対照の写し(geoPN 1・λ_PN 1・gLoc と relativeDrag なし —— 器の写し・内蔵にしない)を、イオの 1 公転(入力の timeRef.pRef)ぶん
//      刻み P/360・P/720・P/1440・P/2880・P/5760(入力の stepDt の 4・2・1・1/2・1/4 倍 —— 2 進で厳密な倍)で走らせ、h・h/2・h/4 の終わりの位置の差(S = 360 と 1440)・
//      NaN・停止・クランプの数。
//   ③ K1 − 1PN の差(同じ刻み・同じ時刻 —— **暦表との比較ではない**): イオ 1 公転(5 つの刻み)と、地球の 1 年の窓(365.26 日 —— 刻み P/1440 と P/360・8 等分の点)。
//   ④ 衛星の丸めの床(SSB の座標の 1 ulp と衛星の軌道の比 —— 記録だけ)・視点の投影(camera.scale の上限 3000 で縦長・横長・正方形 × 視点の傾き)。
//
// ■ 使い方: node tests/exp-w318c-solar16.mjs(正本)・W318C_OUT=<scratch>/x.json W318C_QUICK=1(試走 —— 年の窓を 1/32 に)・W318C_WORKERS(既定 2)。
// ■ 言わないこと: 暦表への長期の一致・永年の率・観測の較正・衛星の三体の永年の効きの決定。K1 − 1PN の差を観測や暦表との差と呼ばない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w318c-solar16.mjs';

export const HARNESS_VERSION = 'w318c-solar16-1';
const REGEN_SCOPE = {"presets":["earthMoonSunInertial3d","jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ctx","cw","pnSource"],"core":true,"consts":[],"complete":true};
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT_FILE = 'tests/out/solar16-w318c.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
/** 内蔵の本の刻み(イオの接触の周期あたりの步数)—— 刻みの検査の表で決めた値(入力の 1440 のまま —— 理由は正本の choice と PHYSICS〔第318便c〕) */
export const CHOSEN_SPO = 1440;
/** 刻みの列(イオ 1 公転の步数 —— 入力の stepDt の 4・2・1・1/2・1/4 倍) */
export const IO_STEPS = Object.freeze([360, 720, 1440, 2880, 5760]);
/** 地球の 1 年の窓: 刻み P/360 で 74232 步(= 8 × 9279)= P/1440 で 296928 步 —— 365.26 日。8 等分の点で比べる(試走は 2320 步 = 8 × 290 —— 11.4 日) */
export const YEAR = Object.freeze({ n360: 74232, quick360: 2320, parts: 8 });
/** 二次の積分器の比 (h − h/4)/(h/2 − h/4) の目安(4 + 1 = 5)の幅 */
export const ORDER_BAND = Object.freeze([4.5, 5.5]);
/** K1 − 1PN の差のイオの相対の位置の、刻みの列の広がりの目安(刻みの感度診断 —— 平均に対する相対) */
export const DIFF_SPREAD = 0.05;
const NOT_CLAIM = ['暦表への長期の一致', '永年の率', '観測の較正', '衛星の三体の永年の効きの決定', '🌦️ の K1 への移行(この本は独立の診断の本)', '銀河や太陽の自転由来の追加の引きずり(入れていない)'];

/* ───────── 子プロセス(1 本の走行)───────── */
function jobKey(j) { return j.kind + '-' + j.phys + '-' + j.n; }
function runJob(HP, inp, j) {
  const p = L.presetOf(inp, { stepsPerOrbit: L.STEP_CANDIDATES[0] }), q = j.phys === 'k1' ? p : L.controlOf(p);
  const dt = L.stepDtOf(inp, j.n);
  if (j.kind === 'io') {
    const r = L.runOf(HP, q, j.n, dt);
    return Object.assign({ key: jobKey(j) }, r);
  }
  const every = j.steps / YEAR.parts, snaps = [];
  const r = L.runOf(HP, q, j.steps, dt, { snap: (k, Sm) => { if (k % every === 0) { const st = []; for (let i = 0; i < Sm.n; i++) st.push([Sm.x[i], Sm.y[i], Sm.z[i], Sm.vx[i], Sm.vy[i], Sm.vz[i]]); snaps.push({ k, t: k * dt, state: st }); } } });
  return Object.assign({ key: jobKey(j), snaps }, r);
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { job, res, rej } = q.shift(); active++;
    const proc = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(job)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    proc.stdout.on('data', (d) => { out += d; }); proc.stderr.on('data', (d) => { err += d; });
    proc.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(jobKey(job) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(jobKey(job) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (job, pri = 0) => new Promise((res, rej) => { q.push({ job, res, rej, pri }); pump(); });
}

/* ───────── 表 ───────── */
const r6 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? x : Number(x.toPrecision(6));
function stepTable(R) {
  const rows = [];
  for (const phys of ['k1', 'ctrl']) for (const S of [360, 1440]) {
    const a = R['io-' + phys + '-' + S], b = R['io-' + phys + '-' + 2 * S], c = R['io-' + phys + '-' + 4 * S];
    const d1 = L.stateDiff(a.state, c.state), d2 = L.stateDiff(b.state, c.state), io = L.MEMBERS.findIndex((m) => m.key === 'io');
    rows.push({ phys, spo: S, dt: a.dt, maxKm: { h_h4: d1.maxKm, h2_h4: d2.maxKm }, ioRelKm: { h_h4: d1.rows[io].relKm, h2_h4: d2.rows[io].relKm }, order: d1.rows[io].relKm / d2.rows[io].relKm,
      perBody: d1.rows.map((r, i) => ({ key: r.key, h_h4Km: r.posKm, h2_h4Km: d2.rows[i].posKm, relH_h4Km: r.relKm, relH2_h4Km: d2.rows[i].relKm })) });
  }
  return rows;
}
function diffIo(R) {
  const rows = IO_STEPS.map((n) => { const d = L.stateDiff(R['io-k1-' + n].state, R['io-ctrl-' + n].state); return { n, dt: R['io-k1-' + n].dt, maxKm: d.maxKm, maxRelKm: d.maxRelKm, perBody: d.rows }; });
  const io = L.MEMBERS.findIndex((m) => m.key === 'io'), v = rows.map((r) => r.perBody[io].relKm), mean = v.reduce((s, x) => s + x, 0) / v.length;
  return { rows, ioRel: { values: v, mean, spread: (Math.max(...v) - Math.min(...v)) / mean } };
}
function diffYear(R, inp) {
  const out = {};
  for (const S of [1440, 360]) {
    const a = R['yr-k1-' + S], b = R['yr-ctrl-' + S];
    if (!a || !b) continue;
    out[S] = { steps: a.steps, dt: a.dt, days: a.steps * a.dt * 1e5 / 86400, points: a.snaps.map((s, k) => { const d = L.stateDiff(s.state, b.snaps[k].state);
      return { k: s.k, days: s.t * 1e5 / 86400, maxKm: d.maxKm, maxRelKm: d.maxRelKm, perBody: d.rows }; }) };
  }
  // 刻みの感度診断: 同じ時刻(8 等分の点)で P/1440 と P/360 の K1 − 1PN の差を比べる
  if (out[1440] && out[360]) out.h = out[1440].points.map((p, k) => { const q = out[360].points[k];
    return { days: p.days, perBody: p.perBody.map((r, i) => ({ key: r.key, d1440: r.posKm, d360: q.perBody[i].posKm, rel1440: r.relKm, rel360: q.perBody[i].relKm })) }; });
  return out;
}

export async function main() {
  const quick = process.env.W318C_QUICK === '1';
  const OUT = process.env.W318C_OUT ? (path.isAbsolute(process.env.W318C_OUT) ? process.env.W318C_OUT : path.join(ROOT, process.env.W318C_OUT)) : path.join(ROOT, OUT_FILE);
  if (quick && !process.env.W318C_OUT) throw new Error('試走(W318C_QUICK=1)は W318C_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const inp = L.loadInput(), inputSha256 = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, L.INPUT_FILE))).digest('hex');
  const NW = Math.max(1, Number(process.env.W318C_WORKERS) || 2), run = makePool(NW, fileURLToPath(import.meta.url));
  const timing = {};
  // ① 入力の検査・宣言の形
  let ts = Date.now();
  const check = L.inputCheck(HP, inp);
  const pLong = L.presetOf(inp, { stepsPerOrbit: CHOSEN_SPO, form: 'input' }), pShort = L.presetOf(inp, { stepsPerOrbit: CHOSEN_SPO });
  const vL = HP.validatePreset(clone(pLong)), vS = HP.validatePreset(clone(pShort));
  const FORM_STEPS = 60, rL = L.runOf(HP, pLong, FORM_STEPS, pLong.physics.stepDt), rS = L.runOf(HP, pShort, FORM_STEPS, pShort.physics.stepDt);
  const form = { normSame: vL.ok && vS.ok && JSON.stringify(vL.preset) === JSON.stringify(vS.preset), steps: FORM_STEPS,
    runSame: rL.ok && rS.ok && rL.state.every((row, i) => row.every((x, k) => Object.is(x, rS.state[i][k]))),
    stepDtSame: pShort.physics.stepDt === inp.physics.stepDt, shortForm: { relativeDrag: L.K1_DRAG, gLoc: L.GLOC }, inputForm: { relativeDrag: inp.physics.relativeDrag, gLoc: inp.physics.gLoc },
    normalized: vS.ok ? { relativeDrag: vS.preset.physics.relativeDrag, gLoc: vS.preset.physics.gLoc } : null, warnings: (vS.warnings || []).length, deny: vS.ok ? HP.coord3d.denyOf(vS.preset).length : null };
  const blt = HP.allPresets().find((q) => q.id === L.ID) || null;
  const d0 = L.builtinDecl(inp, { stepsPerOrbit: CHOSEN_SPO });
  const builtin = blt ? { present: true, emoji: blt.emoji, declSame: ['scaleExp', 'integrator', 'timeRef', 'camera', 'world', 'physics', 'bodies'].every((k) => JSON.stringify(blt[k]) === JSON.stringify(d0[k])) }
    : { present: false };
  timing.check = { wallSec: (Date.now() - ts) / 1000 };
  // ②③ 走行(子プロセス)
  ts = Date.now();
  const n360 = quick ? YEAR.quick360 : YEAR.n360;   // 8 等分の点が整数の步になる数
  const jobs = [];
  jobs.push({ job: { kind: 'yr', phys: 'k1', n: 1440, steps: n360 * 4 }, pri: 10 });
  jobs.push({ job: { kind: 'yr', phys: 'k1', n: 360, steps: n360 }, pri: 9 });
  for (const n of IO_STEPS.slice().reverse()) jobs.push({ job: { kind: 'io', phys: 'k1', n }, pri: 5 });
  for (const n of IO_STEPS) jobs.push({ job: { kind: 'io', phys: 'ctrl', n }, pri: 1 });
  jobs.push({ job: { kind: 'yr', phys: 'ctrl', n: 1440, steps: n360 * 4 }, pri: 1 });
  jobs.push({ job: { kind: 'yr', phys: 'ctrl', n: 360, steps: n360 }, pri: 1 });
  const R = {};
  await Promise.all(jobs.map(({ job, pri }) => run(job, pri).then((r) => { R[jobKey(job)] = r;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${jobKey(job)}: ${r.steps} 步・${r.wallSec.toFixed(1)} s・${r.nan ? 'NaN あり' : 'NaN なし'}・クランプ ${r.clampSum}・停止 ${r.stops.length}`); })));
  timing.runs = { wallSec: (Date.now() - ts) / 1000 };
  const runs = Object.values(R).map((r) => ({ key: r.key, steps: r.steps, dt: r.dt, nan: r.nan, finite: r.finite, stop: r.stop, stops: r.stops, clamps: r.clamps, clampSum: r.clampSum, isq: r.isq,
    warnings: r.warnings, deny: r.deny, wallSec: r.wallSec })).sort((a, b) => (a.key < b.key ? -1 : 1));
  const step = stepTable(R), dIo = diffIo(R), dYr = diffYear(R, inp);
  // 刻みの選択(表示の速さと誤差 —— 公称 SUBSTEPS 2 × 60 fps = 120 步/秒・倍率 1 の目安)
  const ioK1 = runs.filter((r) => /^io-k1-/.test(r.key)), ioC = runs.filter((r) => /^io-ctrl-/.test(r.key));
  const cost = { rate: { k1: { rateStepsPerSec: ioK1.reduce((s, r) => s + r.steps, 0) / ioK1.reduce((s, r) => s + r.wallSec, 0) },
    ctrl: { rateStepsPerSec: ioC.reduce((s, r) => s + r.steps, 0) / Math.max(1e-3, ioC.reduce((s, r) => s + r.wallSec, 0)) } } };
  const pIoD = inp.timeRef.pRef * 1e5 / 86400, yrSteps = (S) => Math.round(365.25 / pIoD * S);
  const choice = { chosen: CHOSEN_SPO, inputSpo: inp.timeRef.stepsPerOrbit, nominalStepsPerSec: 120,
    rows: [360, 1440].map((S) => { const k = step.find((z) => z.phys === 'k1' && z.spo === S);
      return { spo: S, dt: L.stepDtOf(inp, S), ioRelKm: k.ioRelKm.h_h4, ioRelOverA: k.ioRelKm.h_h4 / check.tables.elements.find((z) => z.key === 'io').aKm, stepsPerIo: S, stepsPerYear: yrSteps(S),
        secPerIoNominal: S / 120, minPerYearNominal: yrSteps(S) / 120 / 60 }; }),
    why: '入力の値のまま 1440(入力の stepDt を使う —— 数を作り直さない)。360 はイオの 1 公転の h と h/4 の終わりの相対の位置の差がイオの長半径の 6e-4 の桁で、1 年で位相が数度ずれる型 —— 1440 は 16 倍小さい。表示は 1440 で 4 倍遅い(公称 120 步/秒でイオ 1 公転 12 s・地球 1 年 41 分)' };
  // ④ 丸めの床・視点
  const floor = L.roundingFloor(inp, L.stepDtOf(inp, CHOSEN_SPO));
  const view = L.viewFit(inp);
  const gates = {
    input: check.ok,
    form: form.normSame && form.runSame && form.stepDtSame && form.warnings === 0 && form.deny === 0,
    builtin: builtin.present === true && builtin.declSame === true,
    finite: runs.every((r) => r.finite && !r.nan && r.stop === null),
    noClampStop: runs.every((r) => r.clampSum === 0 && r.stops.length === 0 && r.warnings === 0 && r.deny === 0),
    order2: step.every((z) => z.order >= ORDER_BAND[0] && z.order <= ORDER_BAND[1]),
    chosen: CHOSEN_SPO === inp.timeRef.stepsPerOrbit && L.stepDtOf(inp, CHOSEN_SPO) === inp.physics.stepDt,
    diffSpread: dIo.ioRel.spread <= DIFF_SPREAD,
    viewPortrait: view.find((z) => z.view === 'portrait').inAt.indexOf(-90) >= 0,
    viewTilt: view.filter((z) => z.view !== 'portrait').every((z) => z.inAt.indexOf(-45) >= 0) };
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w318c-solar16.mjs', target: TARGET, targetSha256, quick,
    ruling: '原仮定者の指示(第120報)「支障がなければ、太陽系の１６体サンプルを作成する」・統括の検証項目 R256 —— 内蔵の本 ' + L.ID + '(診断の本 —— 較正の母集団に入れない・観測の 3σ を付けない)。'
      + '入力は原仮定者から受け取った 16 体の本(第120報)の geoPN=3・K1 の側をそのまま(本便は一次資料に当たっていない —— 暦表との照合はしていない)',
    input: { file: L.INPUT_FILE, sha256: inputSha256, id: inp.id, name: inp.name, description: inp.description, timeRef: inp.timeRef, stepDt: inp.physics.stepDt, members: L.MEMBERS.map((m) => m.key) },
    check, form, builtin, step, choice, diff: { io: dIo, year: dYr }, floor, view, runs, cost, gates, ok: Object.values(gates).every(Boolean), notClaim: NOT_CLAIM, timing };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w318c-solar16.mjs', 'tests/lib-w318c-solar16.mjs', 'tests/lib-w300c-solar16.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w302a-wbg.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第318便c', target: TARGET, code: CODE, inputs: [TARGET, L.INPUT_FILE, 'tests/data-w306a-decl305.json', 'tests/data-w300c-solar16-schema.json'] }), {
    harnessVersion: HARNESS_VERSION, stage: 'solar16',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W318C_WORKERS)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(gates), out.elapsedS + ' s');
}
if (IS_MAIN && process.argv[2] === '--child') {
  const job = JSON.parse(process.argv[3]);
  const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
  const r = runJob(HP, L.loadInput(), job);
  process.stdout.write('\n' + JSON.stringify(r) + '\n');
} else if (IS_MAIN) await main();

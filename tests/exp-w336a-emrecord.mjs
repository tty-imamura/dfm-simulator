// 第336便a(原仮定者の指示(2026-11-12 —— 第137報)「『太陽無しでは徐々に減衰』は、地球と月の 2 体だけでも、引きずりがあれば月の近点移動周期を 8.85 年にフィット出来る。
//   ただし恒久ではない」「geoPN=2 の earthMoonRealKF1 を残した意図は、その記録を残す事 ——『初速を観測の値に戻し』が余計なので記録に戻す」・統括の検証項目 R335):
//   **🌘 earthMoonRealKF1 の記録の測り直しと窓の表の器**(段 emrecord-336a —— 正本 tests/out/emrecord-w336a.json・lib tests/lib-w336a-emrecord.mjs)。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で主コンテキストに読み、本の宣言〔physics・bodies〕を .find で引いて写しを走らせる ——
//   本の JSON は 1 bit も変えない・説明文の欄は値として読まない・本の fitRecord は値として読まない〔器が作った記録の写しと突き合わせるのは QA〕)。他の正本は読まない。
//
// ■ 何をするか(宣言 DECL は走行の前に置く —— 結果を見て変えない)
//   rec   本の宣言(第297便a の記録へ戻した値 —— D0pull 3.14447e-5・初速の係数 0.998777511 を焼き込んだ速度・λ_PN=0)を、第297便a の器と同じ抽出器
//         (runRow —— 同方向 1〜9 周の通過の 8 間隔の平均〔恒星月〕・最初の 8 公転の検出器 B の直線 fit〔近点回転の周期〕)で h = 0.016・h/2 = 0.008 の 2 本。
//         記録の値(27.32163005605137 日・8.850019234257942 年 —— 正本 refit-w297a.json の段 emfit の採用値)との差と、第297便a の門(相対 2×10⁻⁵)
//   table 窓の表(8・20・27・40・118 公転 —— 最初の W 公転): 近点回転の周期と公転ごとの離心率の代理の最小〜最大。刻み 0.4・0.2(第135便の実測では 8 公転窓は刻みに 4 桁依らない)
//         と kFrame=0 の写し(引きずりを切った閉じた楕円 —— 刻み 0.4)。定常の物差し: 窓の周期と 8 公転窓の相対差が帯 1% を超えれば「定常ではない」
//   fitRecord 版 w298b-1(標的ごとの残差)の記録 —— 標的 2 件(恒星月〔orbitalPeriodMean・秒〕と近点回転の周期〔apsidalPeriod118 の推定器 —— 窓は 8 公転〕)。
//         説明タブのアプリ内実測が同じ推定器で測れる形(窓の文の最初の「N 公転」= 通過の数)
// ■ 所要: 5 本の走行(h の 9 周 ≈ 40 s・h/2 ≈ 85 s・表 0.4 ≈ 22 s・表 0.2 ≈ 44 s・kFrame=0 ≈ 22 s)を子プロセス最大 3 本で並走(W336A_WORKERS —— 1 なら直列)
//         → 壁時計 ≈ 90 s(60 s の目安を超える理由: 記録の刻み 0.016 と h/2 の 0.008 は記録と同じ抽出器・同じ刻みで測るため間引かない)
// ■ 言わないこと: 8.85 年を「月の近点移動の機構が分かった」「観測と一致した」と言わない —— 二体 + 引きずりのフィットの記録(較正の窓に固有・恒久ではない・実際の主因は太陽の摂動)
//
// 使い方: node tests/exp-w336a-emrecord.mjs   W336A_OUT=<json>(試走)・W336A_TARGET=<html>(既定 beta/index.html)・W336A_WORKERS=<n>(既定 3)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain, runRow } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w336a-emrecord.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🌘 の 1 本〔.find —— physics と bodies を読む〕・
//   エンジンを走らせる〔core:true〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["earthMoonRealKF1"],"roots":["HP.FIT_COND_VERSION","HP.FIT_RECORD_VERSION_MT","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ch","ctx","cw","isNum","sim"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w336a-emrecord-1';
export const OUT_MAIN = 'tests/out/emrecord-w336a.json';
const SELF = fileURLToPath(import.meta.url);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === SELF;
const clone = (x) => JSON.parse(JSON.stringify(x));
const argOf = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const EM_ID = 'earthMoonRealKF1';

export const NOT_CLAIM = Object.freeze([
  '8.85 年を月の近点移動の機構が分かったとは言わない —— 二体(太陽なし)+ 引きずりのフィットの記録(較正の 8 公転窓に固有)',
  '観測と一致したとは言わない —— 実際の主因は太陽の摂動(三体の本 🔆・🌦️ は窓に依らない定常の率)',
  '恒久ではない —— 窓を延ばすと近点回転の周期は定常ではない(窓の表)',
  '再フィットしていない —— 第297便a の記録の値を置き、今のエンジンで測り直しただけ',
  '窓・刻み・判定の物差しは走行の前に宣言した(結果を見て変えない)']);

/** 器の宣言(走行の前 —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 戻す記録(第297便a —— 正本 tests/out/refit-w297a.json の段 emfit の adopted・コミット 581ad5d の html の本) */
  record: Object.freeze({ wave: '第297便a', version: 'w296b-1', D0pull: 0.0000314447, f: 0.998777511,
    bodiesVy: Object.freeze([-0.0013130046017774757, 0.10674855666868635]),
    sidMeanDays: 27.32163005605137, apsPeriodYr: 8.850019234257942, half: Object.freeze({ dt: 0.008, sidMeanDays: 27.32162583193032, apsPeriodYr: 8.849542818677518 }),
    gateRel: 0.00002, gateNote: '第297便a の止める条件 —— 2 つの標的の相対残差の最大 ≤ 2×10⁻⁵(h の値で)' }),
  /** 観測の値(本の parameterAudit の観測の行 —— 第297便a の記録の標的と同じ) */
  obs: Object.freeze({ siderealMonthDays: 27.3217, apsidalPeriodYr: 8.85 }),
  /** 測り直しの刻み(記録の刻み h と h/2) */
  dtRecord: Object.freeze({ h: 0.016, half: 0.008 }),
  /** 窓の表(最初の W 公転)・刻み 2 水準・対照 */
  windows: Object.freeze([8, 20, 27, 40, 118]),
  dtTable: Object.freeze({ h: 0.4, half: 0.2 }),
  control: Object.freeze({ kFrame: 0, dt: 0.4, note: '引きずりを切った写し(kFrame=0 —— 同じ初期状態・閉じた楕円の対照)' }),
  /** 定常の物差し: |P_W / P_8 − 1| > band なら「定常ではない」(e の幅は並べるだけ) */
  steadyBand: 0.01,
  /** fitRecord の許容(宣言 —— 観測の σ ではない) */
  tol: Object.freeze({
    month: Object.freeze({ value: 47.21, kind: 'declared', note: '照合許容の宣言 47.21 秒(0.000546 日)—— 第297便a の記録の止める条件(相対 2×10⁻⁵ —— 27.3217 日の 2×10⁻⁵)を許容として宣言した。第298便b の宣言 0.00005 日(表記の末位の半分)では門の外(残差 −0.000070 日)・σ なし' }),
    aps: Object.freeze({ value: 0.005, kind: 'declared', note: '照合許容の宣言 0.005 年 —— 8.85 年は表記の末位まで(σ なし・第298便b の宣言と同じ)。第297便a の止める条件(相対 2×10⁻⁵ = 0.00018 年)は h と h/2 の差 0.00048 年より小さく、今の門(残差 + h/2 差 ≤ 許容)では刻みの差だけで外に出るので使わない' }) }),
  extractor: 'tests/lib-w280b-emgrid.mjs runRow(w280b-emgrid-1)',
  extractorMonth: 'tests/lib-w280b-emgrid.mjs runRow(w280b-emgrid-1) —— 相対角の連続化で同方向 1 周の通過時刻・最初と最後の通過の間の平均(9 周 → 8 間隔)・秒(日 × 86400)',
  extractorAps: 'tests/lib-w280b-emgrid.mjs runRow(w280b-emgrid-1) —— 検出器 B(相対距離の極小・3 点の放物線の頂点)・近点方位の時刻に対する直線 fit → 360°/ϖ̇(ユリウス年)',
  jobs: Object.freeze(['rec-half', 'rec-h', 'tab-half', 'tab-h', 'tab-k0']),
});

/* ───────── 入力(本の宣言)───────── */
export function readBook(HP) {
  const p = HP.allPresets().find((q) => q.id === 'earthMoonRealKF1');
  if (!p) throw new Error('readBook: 🌘 が無い');
  const b = clone(p);
  const R = DECL.record;
  const book = { D0pull: b.physics.D0pull, lambdaPN: b.physics.lambdaPN, geoPN: b.physics.geoPN, kFrame: b.physics.kFrame, D0: b.physics.D0, q: b.physics.q, qLock: !!b.qLock,
    frameWeight: b.physics.frameWeight === undefined ? null : b.physics.frameWeight, bodiesVy: b.bodies.map((z) => z.vy), bodiesVx: b.bodies.map((z) => z.vx),
    periodBasis: (b.approximation || {}).periodBasis || null };
  book.equalsRecord = book.D0pull === R.D0pull && book.bodiesVy.every((v, i) => v === R.bodiesVy[i]) && book.bodiesVx.every((v) => v === 0) && book.lambdaPN === 0;
  delete b.fitRecord;   // 器は本の記録を値として読まない(写しの走行に効かない —— presetSig の外)
  return { preset: b, book };
}

/* ───────── 1 本の走行(子プロセスでも主でも同じ関数)───────── */
export function runJob(HP, name) {
  const { preset } = readBook(HP);
  const t = Date.now();
  let r;
  if (name === 'rec-h' || name === 'rec-half') {
    const dt = name === 'rec-h' ? DECL.dtRecord.h : DECL.dtRecord.half;
    const x = runRow(HP, preset, { ci: 0, oi: 1, dt, revMax: 9, windows: [8], maxSteps: 4e7 });
    const w = x.windows[0];
    r = { dt, steps: x.steps, sidMeanDays: x.sidMeanDays, apsPeriodYr: w.B ? w.B.apsPeriodYr : null, slopeDegPerPeri: w.B ? w.B.slopeDegPerPeri : null,
      nPeri: w.B ? w.B.nPeri : null, eProxy8: w.eProxy, nan: !!x.nan };
  } else {
    const q = clone(preset);
    let dt = DECL.dtTable.h;
    if (name === 'tab-half') dt = DECL.dtTable.half;
    if (name === 'tab-k0') { q.physics.kFrame = DECL.control.kFrame; dt = DECL.control.dt; }
    const x = L.runWindows(HP, q, { ci: 0, oi: 1, dt, windows: DECL.windows.slice() });
    if (!x.ok) throw new Error(name + ': ' + x.err);
    r = { dt, steps: x.steps, revN: x.revN, nan: x.nan, rows: x.rows, perOrbitE: x.perOrbitE.map((e) => +e.toFixed(7)) };
  }
  r.wallSec = (Date.now() - t) / 1000;
  return r;
}

function runChild(target, name, outFile) {
  return new Promise((resolve, reject) => {
    const ch = spawn(process.execPath, [SELF, '--job', name, '--job-out', outFile], { env: Object.assign({}, process.env, { W336A_TARGET: target }), stdio: ['ignore', 'inherit', 'inherit'] });
    ch.on('exit', (code) => (code === 0 ? resolve(JSON.parse(fs.readFileSync(outFile, 'utf8'))) : reject(new Error('job ' + name + ' exit ' + code))));
  });
}
async function runJobs(target, HP, workers) {
  const res = {};
  if (workers <= 1) { for (const j of DECL.jobs) res[j] = runJob(HP, j); return res; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w336a-'));
  try {
    const queue = DECL.jobs.slice();
    const lane = async () => { while (queue.length) { const j = queue.shift(); res[j] = await runChild(target, j, path.join(dir, j + '.json')); } };
    await Promise.all(Array.from({ length: Math.min(workers, DECL.jobs.length) }, lane));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  return res;
}

/* ───────── 記録(fitRecord w298b-1)───────── */
export function makeFitRecord(HP, preset, recH, recHalf, table) {
  const D = DECL, O = D.obs;
  const tgt = (q, obs, unit, source, window, tol, extractor, model, half) => {
    const residual = model - obs;
    return { q, obs, unit, source, window, tol: clone(tol), extractor, model, residual, rel: residual / obs, numerics: { h2: Math.abs(half - model), dtHalf: D.dtRecord.half }, role: 'numerical-fit' };
  };
  const sec = (d) => d * 86400;
  const st = table.steady, row = (W) => table.h.rows.find((z) => z.orbits === W) || {};
  const f4 = (x) => (Number.isFinite(x) ? x.toFixed(4) : '—');
  const winTxt = D.windows.filter((W) => W !== 8).map((W) => W + ' 公転 ' + f4(row(W).apsPeriodYr) + ' 年').join('・');
  const targets = [
    tgt('orbitalPeriodMean', sec(O.siderealMonthDays), 's', '恒星月 27.3217 日 = 2360594.88 秒(本の parameterAudit の観測値 —— 第297便a の記録の標的と同じ)',
      '9 公転・同方向 1〜9 周の通過の 8 間隔の平均(8 公転窓 —— 第297便a の記録と同じ窓と抽出器)', D.tol.month, D.extractorMonth, sec(recH.sidMeanDays), sec(recHalf.sidMeanDays)),
    tgt('apsidalPeriod118', O.apsidalPeriodYr, '年', '月の近点回転 8.85 年(本の parameterAudit の観測値 —— 第297便a の記録の標的と同じ)',
      '8 公転・最初の 8 公転の近点方位の時刻への直線 fit(検出器 B —— 位置だけ・第280便b の emgrid と同じ窓と抽出器)', D.tol.aps, D.extractorAps, recH.apsPeriodYr, recHalf.apsPeriodYr)];
  const gate = targets.map((t) => ({ q: t.q, pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value, residual: t.residual, h2: t.numerics.h2, tol: t.tol.value }));
  const fr = {
    version: HP.FIT_RECORD_VERSION_MT, parent: EM_ID,
    law: 'geoPN=2(レガシー・近似)・kFrame=1・λ_PN=0・qLock・frameWeight:"pull"・初速の係数 f=0.998777511(第297便a の記録)',
    targets,
    knobs: [{ key: 'physics.D0pull', range: [0.00001, 0.0001], final: D.record.D0pull },
      { key: 'bodies[*].v(初速の係数 f —— 地球と月の速度に同じ倍率)', range: [0.998, 1], final: D.record.f }],
    fixed: ['G・質量・半径・自転・離角(🌙 と同じ観測入力)', 'D0=0.006(E1′)', 'q=8.2358(qLock の厳密一致式)', 'kFrame=1・geoPN=2・λ_PN=0', 'frameWeight:"pull"', 'softening 0.1・stateCarry:"double"',
      '太陽を置かない二体(太陽の方向を固定した近似 —— 公転周期は恒星月で読む)'],
    procedure: '第297便a の記録(2×2 Newton —— 差分のヤコビアン → Broyden 更新・止める条件は 2 つの相対残差の最大 ≤ 2×10⁻⁵・器 tests/exp-w297a-refit.mjs の段 emfit)を第336便a で戻した(原仮定者の指示(2026-11-12 —— 第137報))。'
      + '再フィットはしていない —— 今のエンジンで記録と同じ抽出器・同じ窓で h と h/2 を測り直した(器 tests/exp-w336a-emrecord.mjs)',
    dt: D.dtRecord.h, steps: recH.steps, status: gate.every((g) => g.pass) ? 'fitted' : 'unreachable-in-bounds',
    notFitted: [
      '恒久ではない —— 窓を延ばすと近点回転の周期は定常ではない(最初の W 公転の窓: 8 公転 ' + f4(row(8).apsPeriodYr) + ' 年・' + winTxt + '・公転ごとの離心率の代理 '
        + f4(row(8).eMin) + '〜' + f4(row(118).eMax) + ' —— 刻み 0.4・段 emrecord-336a)',
      '機構(実際の主因は太陽の摂動 —— 三体の本 🔆・🌦️ は窓に依らない定常の率。二体 + 引きずりのフィットの記録であって機構の同定ではない)',
      '近点間の周期(近点間は観測の恒星月に対応しない)',
      '朔望月(太陽を置かない二体 —— 公転周期は恒星月で読む)'] };
  const vp = HP.validatePreset(clone(preset));
  if (!vp.ok) throw new Error('validatePreset: ' + JSON.stringify(vp.errors).slice(0, 200));
  fr.cond = { version: HP.FIT_COND_VERSION, sig: '', extractor: D.extractor };
  fr.cond.sig = HP.fitCondSig(vp.preset, fr);
  const vr = HP.validateFitRecord(clone(fr));
  return { gate, fitRecord: vr.ok ? vr.fitRecord : fr, accepted: vr.ok, err: vr.ok ? null : vr.err };
}

export function gatesOf(J) {
  const rH = J.remeasure.h, rHalf = J.remeasure.half;
  return {
    book: J.book.equalsRecord === true,
    finite: [rH.sidMeanDays, rH.apsPeriodYr, rHalf.sidMeanDays, rHalf.apsPeriodYr].every(Number.isFinite) && !rH.nan && !rHalf.nan,
    table: ['h', 'half', 'k0'].every((k) => J.table[k].rows.length === DECL.windows.length && J.table[k].rows.every((z) => z.complete)),
    judge: J.table.steady.ok === true,
    record: J.fitRecord.accepted === true,
    self: J.selfTest.ok === true,
  };
}

export async function main() {
  const TARGET = process.env.W336A_TARGET || 'beta/index.html';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const job = argOf('--job');
  if (job) {
    const { HP } = loadHtmlMain(html);
    fs.writeFileSync(argOf('--job-out'), JSON.stringify(runJob(HP, job)));
    console.log('job', job, 'done');
    return;
  }
  const OUT = process.env.W336A_OUT ? (path.isAbsolute(process.env.W336A_OUT) ? process.env.W336A_OUT : path.join(ROOT, process.env.W336A_OUT)) : path.join(ROOT, OUT_MAIN);
  const workers = Math.max(1, Number(process.env.W336A_WORKERS || 3) || 3);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  console.log('第336便a emrecord(版 ' + HARNESS_VERSION + ')・workers ' + workers);
  const { preset, book } = readBook(HP);
  const R = await runJobs(TARGET, HP, workers);
  const recH = R['rec-h'], recHalf = R['rec-half'];
  const rec = DECL.record, O = DECL.obs;
  const diffOf = (x) => ({ sidMeanDays: x.sidMeanDays - rec.sidMeanDays, apsPeriodYr: x.apsPeriodYr - rec.apsPeriodYr,
    sameBits: x.sidMeanDays === rec.sidMeanDays && x.apsPeriodYr === rec.apsPeriodYr });
  const relH = [recH.sidMeanDays / O.siderealMonthDays - 1, recH.apsPeriodYr / O.apsidalPeriodYr - 1];
  const remeasure = { h: recH, half: recHalf,
    vsRecord: { h: diffOf(recH), half: { sidMeanDays: recHalf.sidMeanDays - rec.half.sidMeanDays, apsPeriodYr: recHalf.apsPeriodYr - rec.half.apsPeriodYr,
      sameBits: recHalf.sidMeanDays === rec.half.sidMeanDays && recHalf.apsPeriodYr === rec.half.apsPeriodYr } },
    h2: { sidMeanDays: recHalf.sidMeanDays - recH.sidMeanDays, apsPeriodYr: recHalf.apsPeriodYr - recH.apsPeriodYr },
    relToObs: relH, recordGate: { rel: DECL.record.gateRel, pass: relH.every((x) => Math.abs(x) <= DECL.record.gateRel), note: DECL.record.gateNote } };
  const table = { h: R['tab-h'], half: R['tab-half'], k0: R['tab-k0'] };
  table.steady = L.steadyJudge(table.h.rows, DECL.steadyBand);
  table.steadyHalf = L.steadyJudge(table.half.rows, DECL.steadyBand);
  table.dtDependence = L.dtDependence(table.h.rows, table.half.rows);
  table.vsRecordDt = { orbits: 8, tableH: (table.h.rows[0] || {}).apsPeriodYr, recordH: recH.apsPeriodYr, rel: (table.h.rows[0] || {}).apsPeriodYr / recH.apsPeriodYr - 1 };
  const FR = makeFitRecord(HP, preset, recH, recHalf, table);
  const J = { book, remeasure, table, fitRecord: FR, selfTest: L.selfTest(),
    timing: Object.fromEntries(DECL.jobs.map((j) => [j, { wallSec: R[j].wallSec }])) };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w336a-emrecord.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の指示(2026-11-12 —— 第137報)「地球と月の 2 体だけでも、引きずりがあれば月の近点移動周期を 8.85 年にフィット出来る。ただし恒久ではない」「『初速を観測の値に戻し』が余計なので記録に戻す」「朔望月の換算は分かりにくかったので無くす」・統括の検証項目 R335',
    decl: DECL, notClaim: NOT_CLAIM, workers, ...J };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w336a-emrecord.mjs', 'tests/lib-w336a-emrecord.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第336便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'emrecord', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセス最大 3 本)・🌘 の宣言(physics・bodies)の写しを走らせる', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

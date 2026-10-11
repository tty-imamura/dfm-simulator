// 第298便b(原仮定者の裁定(第88報)「geoPN=2 はレガシー(廃止の復活なし)・earthMoonRealKF1 は f=1 で可能な範囲でフィット」・統括の検証項目 R166)
// —— **🌘 earthMoonRealKF1 の f=1 再フィット**の器(純 Node・ブラウザ不要 —— html の inline script を主コンテキストで読む
// `tests/lib-w280b-emgrid.mjs` の `loadHtmlMain`/`runRow`。第297便a の器 tests/exp-w297a-refit.mjs の段 emfit の後継)。
//
// ■ 何をするか
//   f は**初速の倍率**(質量ではない)。f=1 = 初速を観測の値へ戻す(地球と月の速度を 🌙 earthMoonReal の宣言そのものにする —— 位置・質量・半径・自転は
//   🌘 と 🌙 で同じ値であることを器が確かめる)。ノブは**既存の physics.D0pull だけ**(新しいノブを足さない)。q は qLock の厳密一致式のまま
//   (段 qprobe が qLock を外して q を振っても標的が動かないことを測る —— q はこの 2 量のノブにならない)。
//   恒星月(同方向 1 周の平均・8 公転窓)と近点回転の周期(検出器 B・最初の 8 公転)を**同時に**測る(第297便a の段 emfit と同じ抽出器・同じ窓)。
//   両方が許容の門(|残差| + 数値誤差 ≤ 許容)に入れば fitted、片方だけなら残差を書いて fitted にしない(この探索範囲では未達 —— 次の見直し)。
// 第298便e(原仮定者の追加指示(第88報の追補)「earthMoonRealKF1 は、公転周期を優先して合わせる」・統括の検証項目 R166′): **周期優先**へ版上げ(w298b-refit-2)。
//   第一の標的 = 恒星月(同じ出典・同じ抽出器・同じ窓)。近点回転は第二の量(合わせない —— 記録して 8.85 年との残差を照合するだけ・門に入れない)。
//   D0pull の探索範囲を上へ広げ(段 scanwide —— 1e-4〜1e-3 の格子)、恒星月の根を挟めれば Illinois、挟めなければ範囲の端(恒星月の残差が最小の点)を
//   h と h/2 で測り直して記録する(段 fitmonth)。段 limit は探索範囲の外の参照(D0pull 1e-2・1e-1 と、D0pull→∞ の極限〔引きずりの係数 χ→0〕に当たる kFrame=0 の写し)。
//   第298便b の近点回転優先の段 fit は段 fitaps(履歴 —— 手続きと値は同じ)へ名前を変えた。
//
// ■ 段(part)
//   scan    f=1 で D0pull の格子(探索範囲 [1e-5, 1e-4] の 6 点 —— 第297便a の採用値 3.14447e-5 を含む)の恒星月と近点回転(h)
//   fit     近点回転の周期 8.85 年へ D0pull の 1 次元の根(区間 [2e-5, 3.14447e-5] を挟んで Illinois)→ 6 桁に丸めた値を h と h/2 で測り直す →
//           記録 fitRecord(版 w298b-1 —— 標的ごとの model・residual・数値誤差・許容・抽出器・窓)
//   qprobe  qLock を外して q を 5・12 に置いた写し(D0pull は第297便a の値)の恒星月と近点回転(q の感度)
//   ---- 第298便e(周期優先 —— 版 w298b-refit-2)
//   scanwide f=1 で D0pull の格子を上へ(探索範囲 [1e-4, 1e-3] の 5 点)の恒星月と近点回転(h)
//   limit    探索範囲の外の参照: D0pull 1e-2・1e-1(h)と kFrame=0 の写し(h と h/2 —— D0pull→∞ の極限)。恒星月の下限(残差の床)を測る
//   fitmonth 恒星月 27.3217 日へ D0pull の 1 次元の根(段 scan と scanwide の格子で符号が変われば Illinois)→ 挟めなければ探索範囲の中で恒星月の残差が最小の点を採る →
//            h と h/2 で測り直す → 記録 fitRecord(版 w298b-1 —— 標的は恒星月だけ・近点回転は notFitted に照合の値と残差)
//   fitaps   第298便b の段 fit(近点回転の周期 8.85 年へ D0pull の根 —— 履歴・手続きは同じ)
//
// ■ 使い方
//   node tests/exp-w298b-refit.mjs [--part scan,scanwide,limit,fitmonth,fitaps,qprobe]   → 正本 tests/out/refit-w298b.json(段 refit-298b)
//   W298B_OUT=<json> で出力先を変える(器の試走は正本を書かない)。W298B_PART=<part,...> で段を絞る(既存の正本の他の段を残して上書き)。
//   W298B_TARGET=<html>(既定 beta/index.html)
//   並走: 段ごとに W298B_OUT=<写し> node tests/exp-w298b-refit.mjs --part <段> を別の process で走らせ、node tests/exp-w298b-refit.mjs --merge <写し,…> で正本にまとめる
//   (写しの targetSha256 がいまの html と違えば止める)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain, runRow, EMGRID_LIB_VERSION } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言(再生成の鎖が「この器の正本を走らせ直すか」を引く)—— 読む本は 🌘 と 🌙(id で引く)
const REGEN_SCOPE = {"presets":["earthMoonRealKF1","earthMoonReal"],"roots":["HP.FIT_COND_VERSION","HP.FIT_RECORD_VERSION_MT","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.validateFitRecord","HP.validatePreset","HP.sim","isNum","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.W298B_TARGET || 'beta/index.html';
const OUT = process.env.W298B_OUT || path.join(ROOT, 'tests', 'out', 'refit-w298b.json');
const argOf = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const PARTS = String(argOf('--part') || process.env.W298B_PART || 'scan,scanwide,limit,fitmonth,fitaps,qprobe').split(',').filter(Boolean);
export const REFIT_W298B_VERSION = 'w298b-refit-2';   // 第298便e: 周期優先(w298b-refit-1 = 第298便b の近点回転優先 —— 段 fit → fitaps)

const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
const { HP } = loadHtmlMain(html);
const BUILTIN = vm.runInThisContext('BUILTIN_PRESETS');
const clone = (o) => JSON.parse(JSON.stringify(o));
const presetOf = (id) => { const p = BUILTIN.find((q) => q.id === id); if (!p) throw new Error('no preset ' + id); return clone(p); };
const t0All = Date.now();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---------------------------------------------------------------------------------------------------------------
// 🌘(1 単位 = 10⁶ m / 10² s / 10²⁵ kg)。恒星月 = 同方向 1 周の平均(8 公転窓)・近点回転 = 検出器 B の 8 公転窓の直線 fit
const EM_ID = 'earthMoonRealKF1', OBS_ID = 'earthMoonReal';
const EM_TARGET = { siderealMonthDays: 27.3217, apsidalPeriodYr: 8.85 };
const EM_RANGE = [1e-5, 1e-4];               // D0pull の探索範囲(第297便a と同じ)
const EM_BRACKET = [2e-5, 3.14447e-5];       // 近点回転の根を挟む区間(段 scan の格子の隣り合う 2 点 —— 器の試走で 5.88 年 / 9.07 年)
const EM_GRID = [1e-5, 2e-5, 3.14447e-5, 4.5e-5, 6e-5, 1e-4];
const EM_STOP = 2e-5;
// 第298便e(周期優先): 探索範囲を上へ(段 scanwide)・範囲の外の参照(段 limit)
const EM_RANGE_WIDE = [1e-4, 1e-3];
const EM_GRID_WIDE = [1e-4, 2e-4, 3.5e-4, 6e-4, 1e-3];
const EM_RANGE_MONTH = [EM_RANGE[0], EM_RANGE_WIDE[1]];   // 周期優先の記録の knobs.range(段 scan と scanwide の格子を合わせた探索範囲)
const EM_LIMIT = [1e-2, 1e-1];                            // 探索範囲の外の参照(D0pull を上げると引きずりの係数 χ=w/(D0pull+w) が 0 へ)
const EM_STOP_MONTH = 2e-7;                               // 恒星月の相対残差の止める条件(許容 0.00005 日 / 27.3217 日 = 1.8e-6 の 1/9)                        // 近点回転の相対残差の止める条件(第297便a の EM_TOL と同じ —— 検出器 B の 8 近点の直線 fit の揺れの桁)
const EM_W297A = { D0pull: 3.14447e-5, f: 0.998777511, note: '第297便a の再フィット(λ_PN=0・D0pull と初速の係数 f の 2×2 Newton —— 記録 w296b-1・第297便a の正本の段 emfit)' };
// 許容(照合許容の宣言 —— 出典に σ の無い量は kind:"declared"。表記の末位まで)
const TOL = {
  month: { value: 0.00005, kind: 'declared', note: '照合許容の宣言 0.00005 日 —— 恒星月 27.3217 日は表記の末位(0.0001 日)まで・σ なし' },
  aps: { value: 0.005, kind: 'declared', note: '照合許容の宣言 0.005 年 —— 8.85 年は表記の末位まで(σ なし)。慣性系の平均の近地点経度の率(Chapront 2002 Table 4・40.67616758°/年 → 8.85038 年)はこの幅の中' } };
const EXTRACTOR = 'tests/lib-w280b-emgrid.mjs runRow(' + EMGRID_LIB_VERSION + ')';
const EX_MONTH = EXTRACTOR + ' —— 相対角の連続化で同方向 1 周の通過時刻・最初と最後の通過の間の平均(9 周 → 8 間隔)';
const EX_APS = EXTRACTOR + ' —— 検出器 B(相対距離の極小・3 点の放物線の頂点)・近点方位の時刻に対する直線 fit → 360°/ϖ̇(ユリウス年)';

// f=1 の本: 🌘 の宣言に 🌙 の初速(観測の値)を置く。位置・質量・半径・自転・粒子の数が 🌘 と 🌙 で同じであることを確かめる(違えば止める)
function f1Base() {
  const p = presetOf(EM_ID), o = presetOf(OBS_ID);
  if (p.bodies.length !== o.bodies.length) throw new Error('🌘 と 🌙 の粒子の数が違う');
  const same = [];
  p.bodies.forEach((b, i) => { for (const k of ['m', 'radius', 'x', 'y', 'spin']) if (b[k] !== o.bodies[i][k]) throw new Error(`bodies[${i}].${k} が 🌘 と 🌙 で違う`);
    same.push(i); b.vx = o.bodies[i].vx; b.vy = o.bodies[i].vy; });
  return { p, obsBodies: o.bodies.map((b) => ({ vx: b.vx, vy: b.vy })) };
}
const at = (base, d0pull, patch) => { const q = clone(base); q.physics.D0pull = d0pull; if (patch) patch(q); return q; };
function emRun(p, dt) {
  const t = Date.now();
  const r = runRow(HP, p, { ci: 0, oi: 1, dt, revMax: 9, windows: [8], maxSteps: 4e7 });
  const w = r.windows[0];
  const o = { dt, steps: r.steps, sidMeanDays: r.sidMeanDays, apsPeriodYr: w && w.B ? w.B.apsPeriodYr : null,
    slopeDegPerPeri: w && w.B ? w.B.slopeDegPerPeri : null, nPeri: w && w.B ? w.B.nPeri : null, nan: !!r.nan, wallSec: (Date.now() - t) / 1000 };
  o.rel = [o.sidMeanDays / EM_TARGET.siderealMonthDays - 1, o.apsPeriodYr / EM_TARGET.apsidalPeriodYr - 1];
  return o;
}

async function partScan() {
  const { p, obsBodies } = f1Base();
  const rows = [];
  for (const d of EM_GRID) { const r = Object.assign({ D0pull: d }, emRun(at(p, d), 0.016)); rows.push(r); log('scan', JSON.stringify(r)); }
  const monthMin = rows.reduce((a, r) => (Math.abs(r.sidMeanDays - EM_TARGET.siderealMonthDays) < Math.abs(a.sidMeanDays - EM_TARGET.siderealMonthDays) ? r : a), rows[0]);
  return { id: EM_ID, f: 1, obsBodies, range: EM_RANGE, grid: EM_GRID, rows,
    monotone: { sidMeanDays: rows.every((r, i) => i === 0 || r.sidMeanDays < rows[i - 1].sidMeanDays), apsPeriodYr: rows.every((r, i) => i === 0 || r.apsPeriodYr > rows[i - 1].apsPeriodYr) },
    monthClosest: { D0pull: monthMin.D0pull, sidMeanDays: monthMin.sidMeanDays, residualDays: monthMin.sidMeanDays - EM_TARGET.siderealMonthDays } };
}

async function partQprobe() {
  const { p } = f1Base();
  const rows = [];
  rows.push(Object.assign({ q: 'qLock', D0pull: EM_W297A.D0pull }, emRun(at(p, EM_W297A.D0pull), 0.016)));
  for (const q of [5, 12]) rows.push(Object.assign({ q, D0pull: EM_W297A.D0pull },
    emRun(at(p, EM_W297A.D0pull, (z) => { z.qLock = false; z.physics.q = q; }), 0.016)));
  rows.forEach((r) => log('qprobe', JSON.stringify(r)));
  const span = (k) => Math.max(...rows.map((r) => r[k])) - Math.min(...rows.map((r) => r[k]));
  return { id: EM_ID, f: 1, rows, spanSidMeanDays: span('sidMeanDays'), spanApsPeriodYr: span('apsPeriodYr') };
}

const round = (x, sig) => Number(x.toPrecision(sig));
// 第298便b の近点回転優先(段 fit → 第298便e で段 fitaps へ名前を変えた —— 履歴・手続きと値は同じ)
async function partFitAps() {
  const { p } = f1Base();
  const evals = [];
  const F = (d, dt = 0.016) => { const e = Object.assign({ D0pull: d }, emRun(at(p, d), dt)); evals.push(e); log('fit', JSON.stringify(e)); return e; };
  // Illinois(正則化ファルシ)で近点回転の相対残差の根を挟む
  let a = EM_BRACKET[0], b = EM_BRACKET[1];
  let fa = F(a).rel[1], fb = F(b).rel[1];
  if (!(fa < 0 && fb > 0)) throw new Error('近点回転の根を挟めない: ' + fa + ' / ' + fb);
  let side = 0, x = b, fx = fb, it = 0;
  while (it < 12 && Math.abs(fx) > EM_STOP) {
    x = (a * fb - b * fa) / (fb - fa);
    fx = F(x).rel[1]; it++;
    if (fx * fb > 0) { b = x; fb = fx; if (side === -1) fa /= 2; side = -1; }
    else { a = x; fa = fx; if (side === 1) fb /= 2; side = 1; }
  }
  const adopted = round(x, 6);
  const eh = F(adopted, 0.016), eh2 = F(adopted, 0.008);
  const T = EM_TARGET;
  const tgt = (q, obs, unit, source, window, tol, extractor, model, half) => {
    const residual = model - obs;
    return { q, obs, unit, source, window, tol, extractor, model, residual, rel: residual / obs, numerics: { h2: Math.abs(half - model), dtHalf: 0.008 } };
  };
  const targets = [
    tgt('恒星月(同方向 1 周の平均)', T.siderealMonthDays, 'd', '恒星月 27.3217 日(本の parameterAudit の観測値)', '同方向 1〜9 周(8 公転窓)', TOL.month, EX_MONTH, eh.sidMeanDays, eh2.sidMeanDays),
    tgt('近点回転の周期(検出器 B・近点方位の時刻に対する直線 fit)', T.apsidalPeriodYr, 'yr', '月の近点回転 8.85 年(本の parameterAudit の観測値)', '最初の 8 公転(第280便b の emgrid と同じ窓と抽出器)', TOL.aps, EX_APS, eh.apsPeriodYr, eh2.apsPeriodYr)];
  const gate = targets.map((t) => ({ q: t.q, pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value, residual: t.residual, h2: t.numerics.h2, tol: t.tol.value }));
  const status = gate.every((g) => g.pass) ? 'fitted' : 'unreachable-in-bounds';
  const fitRecord = {
    version: HP.FIT_RECORD_VERSION_MT, parent: EM_ID,
    law: 'geoPN=2(レガシー)・kFrame=1・λ_PN=0・qLock・frameWeight:"pull"・初速の係数 f=1(観測の初速)',
    targets,
    knobs: [{ key: 'physics.D0pull', range: EM_RANGE.slice(), final: adopted }],
    fixed: ['初速の係数 f=1(地球と月の速度は 🌙 earthMoonReal の宣言そのもの —— 第297便a の f=0.998777511 は履歴)', 'G・質量・半径・自転・離角(🌙 と同じ観測入力)',
      'D0=0.006(E1′)', 'q=8.2358(qLock の厳密一致式 —— qLock を外して q を 5・12 にしても 2 量は動かない: 段 qprobe)', 'kFrame=1・geoPN=2・λ_PN=0', 'frameWeight:"pull"', 'softening 0.1・stateCarry:"double"'],
    procedure: 'f=1 に固定し、ノブ D0pull だけで近点回転の周期の根を区間 [' + EM_BRACKET.join(', ') + '] で挟んで Illinois(止める条件は近点回転の相対残差 ≤ ' + EM_STOP
      + ')。採用値は 6 桁に丸めて h と h/2 で 2 量を測り直した。恒星月は探索範囲 [' + EM_RANGE.join(', ') + '] の格子(段 scan)で D0pull に単調 —— 範囲の中に根が無い(器 tests/exp-w298b-refit.mjs)',
    dt: 0.016, steps: eh.steps, status,
    notFitted: ['恒星月(f=1・D0pull だけでは探索範囲の中で 27.3217 日に届かない —— この探索範囲では未達・次の見直し〔初期配置・q の範囲〕)',
      '27 公転窓の近点回転(窓を延ばすと定常ではない —— 第135便・第280便b)', '近点間の周期(近点間は観測の恒星月に対応しない)', '機構(実際の主因は太陽摂動 —— 機構の同定ではない)'] };
  const vp = HP.validatePreset(clone(at(p, adopted)));
  if (!vp.ok) throw new Error('validatePreset: ' + JSON.stringify(vp.errors).slice(0, 200));
  // 署名は cond.extractor を読む —— 先に cond(sig 空)を置いてから作る(記録と同じ入力で作り直す受理器・表示と同じ値になる)
  fitRecord.cond = { version: HP.FIT_COND_VERSION, sig: '', extractor: EXTRACTOR };
  fitRecord.cond.sig = HP.fitCondSig(vp.preset, fitRecord);
  const vr = HP.validateFitRecord(clone(fitRecord));
  return { id: EM_ID, f: 1, target: T, range: EM_RANGE, bracket: EM_BRACKET, stop: EM_STOP, w297a: EM_W297A, iterations: it, evals,
    adopted: { D0pull: adopted, bodies: at(p, adopted).bodies.map((z) => ({ vx: z.vx, vy: z.vy })), h: { sidMeanDays: eh.sidMeanDays, apsPeriodYr: eh.apsPeriodYr, steps: eh.steps },
      half: { dt: 0.008, sidMeanDays: eh2.sidMeanDays, apsPeriodYr: eh2.apsPeriodYr, steps: eh2.steps } },
    gate, status, fitRecord: vr.ok ? vr.fitRecord : fitRecord, fitRecordAccepted: vr.ok, fitRecordErr: vr.ok ? null : vr.err };
}

// ---------------------------------------------------------------------------------------------------------------
// 第298便e(原仮定者の追加指示(第88報の追補)「earthMoonRealKF1 は、公転周期を優先して合わせる」・統括の検証項目 R166′): 周期優先
async function partScanWide() {
  const { p } = f1Base();
  const rows = [];
  for (const d of EM_GRID_WIDE) { const r = Object.assign({ D0pull: d }, emRun(at(p, d), 0.016)); rows.push(r); log('scanwide', JSON.stringify(r)); }
  const monthMin = rows.reduce((a, r) => (Math.abs(r.sidMeanDays - EM_TARGET.siderealMonthDays) < Math.abs(a.sidMeanDays - EM_TARGET.siderealMonthDays) ? r : a), rows[0]);
  return { id: EM_ID, f: 1, range: EM_RANGE_WIDE, grid: EM_GRID_WIDE, rows,
    monotone: { sidMeanDays: rows.every((r, i) => i === 0 || r.sidMeanDays < rows[i - 1].sidMeanDays), apsPeriodYr: rows.every((r, i) => i === 0 || r.apsPeriodYr > rows[i - 1].apsPeriodYr) },
    allAbove: rows.every((r) => r.sidMeanDays > EM_TARGET.siderealMonthDays),
    monthClosest: { D0pull: monthMin.D0pull, sidMeanDays: monthMin.sidMeanDays, residualDays: monthMin.sidMeanDays - EM_TARGET.siderealMonthDays } };
}

// 探索範囲の外の参照(フィットには使わない): D0pull を上げた点と、kFrame=0 の写し(引きずりなし —— D0pull→∞ の極限に当たる)
async function partLimit() {
  const { p } = f1Base();
  const rows = [];
  for (const d of EM_LIMIT) { const r = Object.assign({ D0pull: d, kFrame: 1 }, emRun(at(p, d), 0.016)); rows.push(r); log('limit', JSON.stringify(r)); }
  const k0 = (dt) => Object.assign({ D0pull: EM_RANGE_MONTH[1], kFrame: 0 }, emRun(at(p, EM_RANGE_MONTH[1], (z) => { z.physics.kFrame = 0; }), dt));
  const kh = k0(0.016), kh2 = k0(0.008);
  log('limit', JSON.stringify(kh)); log('limit', JSON.stringify(kh2));
  const floor = { sidMeanDays: kh.sidMeanDays, residualDays: kh.sidMeanDays - EM_TARGET.siderealMonthDays, h2: Math.abs(kh2.sidMeanDays - kh.sidMeanDays),
    tol: TOL.month.value };
  floor.gatePass = Math.abs(floor.residualDays) + floor.h2 <= floor.tol;
  return { id: EM_ID, f: 1, note: '探索範囲の外の参照(記録の knobs.range の外 —— フィットには使わない)。kFrame=0 の写しは引きずりを切った同じ初期状態(D0pull を上げると χ=w/(D0pull+w)→0 の極限に当たる)',
    rows, kFrame0: { h: kh, half: kh2 }, floor };
}

async function partFitMonth() {
  const { p } = f1Base();
  const T = EM_TARGET, evals = [];
  const F = (d, dt = 0.016) => { const e = Object.assign({ D0pull: d }, emRun(at(p, d), dt)); evals.push(e); log('fitmonth', JSON.stringify(e)); return e; };
  // 恒星月の相対残差の根を探索範囲の両端で挟めるか(段 scan・scanwide の格子で恒星月は D0pull に単調)
  let a = EM_RANGE_MONTH[0], b = EM_RANGE_MONTH[1];
  const ea = F(a), eb = F(b);
  let fa = ea.rel[0], fb = eb.rel[0];
  let bracketed = (fa > 0) !== (fb > 0), it = 0, x, ex;
  if (bracketed) {
    let side = 0, fx;
    x = b; fx = fb;
    while (it < 16 && Math.abs(fx) > EM_STOP_MONTH) {
      x = (a * fb - b * fa) / (fb - fa);
      fx = F(x).rel[0]; it++;
      if (fx * fb > 0) { b = x; fb = fx; if (side === -1) fa /= 2; side = -1; }
      else { a = x; fa = fx; if (side === 1) fb /= 2; side = 1; }
    }
    x = round(x, 6);
    ex = F(x);
  } else {
    // 挟めない: 探索範囲の中で恒星月の残差が最小の端を採る(根ではない)
    const pick = Math.abs(ea.rel[0]) <= Math.abs(eb.rel[0]) ? ea : eb;
    x = pick.D0pull; ex = pick;
  }
  const eh = ex, eh2 = F(x, 0.008);
  const residual = eh.sidMeanDays - T.siderealMonthDays;
  const target = { q: '恒星月(同方向 1 周の平均)', obs: T.siderealMonthDays, unit: 'd', source: '恒星月 27.3217 日(本の parameterAudit の観測値)',
    window: '同方向 1〜9 周(8 公転窓)', tol: TOL.month, extractor: EX_MONTH, model: eh.sidMeanDays, residual, rel: residual / T.siderealMonthDays,
    numerics: { h2: Math.abs(eh2.sidMeanDays - eh.sidMeanDays), dtHalf: 0.008 } };
  const gate = [{ q: target.q, pass: Math.abs(target.residual) + target.numerics.h2 <= target.tol.value, residual: target.residual, h2: target.numerics.h2, tol: target.tol.value }];
  const status = gate[0].pass ? 'fitted' : 'unreachable-in-bounds';
  // 近点回転は照合だけ(門に入れない —— 記録して 8.85 年との残差)
  const aps = { q: '近点回転の周期(検出器 B・近点方位の時刻に対する直線 fit)', obs: T.apsidalPeriodYr, unit: 'yr', window: '最初の 8 公転', extractor: EX_APS,
    model: eh.apsPeriodYr, residual: eh.apsPeriodYr - T.apsidalPeriodYr, rel: eh.apsPeriodYr / T.apsidalPeriodYr - 1, h2: Math.abs(eh2.apsPeriodYr - eh.apsPeriodYr),
    slopeDegPerPeri: eh.slopeDegPerPeri, gated: false };
  const rangeTxt = '[' + EM_RANGE_MONTH.join(', ') + ']';
  const fitRecord = {
    version: HP.FIT_RECORD_VERSION_MT, parent: EM_ID,
    law: 'geoPN=2(レガシー)・kFrame=1・λ_PN=0・qLock・frameWeight:"pull"・初速の係数 f=1(観測の初速)',
    targets: [target],
    knobs: [{ key: 'physics.D0pull', range: EM_RANGE_MONTH.slice(), final: x }],
    fixed: ['初速の係数 f=1(地球と月の速度は 🌙 earthMoonReal の宣言そのもの —— 第297便a の f=0.998777511 は履歴)', 'G・質量・半径・自転・離角(🌙 と同じ観測入力)',
      'D0=0.006(E1′)', 'q=8.2358(qLock の厳密一致式 —— qLock を外して q を 5・12 にしても 2 量は動かない: 段 qprobe)', 'kFrame=1・geoPN=2・λ_PN=0',
      'frameWeight:"pull"', 'softening 0.1・stateCarry:"double"'],
    procedure: '周期優先(第298便e): f=1 に固定し、ノブ D0pull だけで恒星月 27.3217 日の根を探索範囲 ' + rangeTxt + ' で探した(恒星月は段 scan・scanwide の格子で D0pull に単調に減る)。'
      + (bracketed ? '両端で符号が変わるので Illinois(止める条件は恒星月の相対残差 ≤ ' + EM_STOP_MONTH + ')・6 桁に丸めた値を'
        : '両端とも恒星月が標的より長く根を挟めないので、恒星月の残差が最小の範囲の端 D0pull=' + x + ' を採り(根ではない)')
      + ' h と h/2 で測り直した。近点回転は照合だけ(門に入れない)。範囲の外の参照は段 limit(器 tests/exp-w298b-refit.mjs)',
    dt: 0.016, steps: eh.steps, status,
    notFitted: [
      '近点回転の周期(照合だけ —— 門に入れない): 8 公転窓 ' + aps.model.toPrecision(6) + ' 年・8.85 年との残差 ' + (aps.residual >= 0 ? '+' : '') + aps.residual.toPrecision(6) + ' 年・h/2 差 ' + aps.h2.toExponential(2)
        + ' 年(第298便b の近点回転優先 D0pull 3.06883e-5・8.84995 年は履歴)',
      '恒星月(探索範囲の端でも門の外 —— この探索範囲では未達・次の見直し〔初期配置を平均要素から接触要素へ —— 🌥️ と同じ型〕。範囲の外の参照は段 limit)',
      '27 公転窓の近点回転(窓を延ばすと定常ではない —— 第135便・第280便b)', '近点間の周期(近点間は観測の恒星月に対応しない)',
      '機構(実際の主因は太陽摂動 —— 機構の同定ではない)'] };
  const vp = HP.validatePreset(clone(at(p, x)));
  if (!vp.ok) throw new Error('validatePreset: ' + JSON.stringify(vp.errors).slice(0, 200));
  fitRecord.cond = { version: HP.FIT_COND_VERSION, sig: '', extractor: EXTRACTOR };
  fitRecord.cond.sig = HP.fitCondSig(vp.preset, fitRecord);
  const vr = HP.validateFitRecord(clone(fitRecord));
  return { id: EM_ID, f: 1, priority: 'month', target: T, range: EM_RANGE_MONTH, stop: EM_STOP_MONTH, bracketed, iterations: it, evals,
    ends: [{ D0pull: ea.D0pull, sidMeanDays: ea.sidMeanDays, rel: ea.rel[0] }, { D0pull: eb.D0pull, sidMeanDays: eb.sidMeanDays, rel: eb.rel[0] }],
    adopted: { D0pull: x, bodies: at(p, x).bodies.map((z) => ({ vx: z.vx, vy: z.vy })),
      h: { sidMeanDays: eh.sidMeanDays, apsPeriodYr: eh.apsPeriodYr, slopeDegPerPeri: eh.slopeDegPerPeri, steps: eh.steps },
      half: { dt: 0.008, sidMeanDays: eh2.sidMeanDays, apsPeriodYr: eh2.apsPeriodYr, slopeDegPerPeri: eh2.slopeDegPerPeri, steps: eh2.steps } },
    gate, status, check: aps, fitRecord: vr.ok ? vr.fitRecord : fitRecord, fitRecordAccepted: vr.ok, fitRecordErr: vr.ok ? null : vr.err };
}

// ---------------------------------------------------------------------------------------------------------------
const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
out.version = REFIT_W298B_VERSION;
out.generator = 'tests/exp-w298b-refit.mjs';
out.ruling = '原仮定者の裁定(第88報)・同(第88報の追補)・統括の検証項目 R166・R166′';
out.target = TARGET; out.targetSha256 = targetSha256;
out.parts = out.parts || {};
const MERGE = argOf('--merge');
if (MERGE) for (const f of MERGE.split(',').filter(Boolean)) { const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (j.targetSha256 && j.targetSha256 !== targetSha256) throw new Error('--merge: 写し ' + f + ' の targetSha256 がいまの html と違う(同じ html で走らせ直すこと)');
  Object.assign(out.parts, j.parts || {}); }
const RUN = { scan: partScan, scanwide: partScanWide, limit: partLimit, fitmonth: partFitMonth, fitaps: partFitAps, qprobe: partQprobe };
for (const k of Object.keys(out.parts)) if (!RUN[k]) delete out.parts[k];   // 第298便e: 版 w298b-refit-1 の段 fit は fitaps へ(名前の残りを消す)
for (const k of (MERGE ? [] : PARTS)) {
  if (!RUN[k]) continue;
  const t = Date.now();
  out.parts[k] = await RUN[k]();
  out.parts[k].wallSec = (Date.now() - t) / 1000;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  log('part', k, 'done', out.parts[k].wallSec + 's');
}
out.timing = MERGE ? { wallSec: Object.values(out.parts).reduce((a, p) => a + (Number(p.wallSec) || 0), 0), mode: 'merge(段ごとの壁時計の和 —— 段は別の process で並走)' }
  : { wallSec: (Date.now() - t0All) / 1000 };
const CODE = ['tests/exp-w298b-refit.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第298便b・第298便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
  harnessVersion: REFIT_W298B_VERSION, parts: Object.keys(out.parts),
  ruling: '原仮定者の裁定(第88報)(geoPN=2 はレガシー〔廃止の復活なし〕・earthMoonRealKF1 は f=1 で可能な範囲でフィット)',
  reading: '統括の検証項目 R166(f=1 に固定・ノブは既存の D0pull だけ・恒星月と近点回転を同時に測る・h と h/2・両方が門に入れば fitted —— 片方だけなら残差を書いて fitted にしない)'
    + '・R166′(第298便e —— 原仮定者の追加指示(第88報の追補)「公転周期を優先して合わせる」: 第一の標的は恒星月・近点回転は照合だけ・D0pull の探索範囲を上へ広げ、根を挟めなければ範囲の端の値と残差を記録)',
  engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
  notClaim: ['月の近点回転を再現した', '較正 合', 'gain は普遍定数', '1PN を DFM から導出した'] });
out.elapsedS = out.timing.wallSec;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log('→', path.relative(ROOT, OUT), out.elapsedS + ' s');

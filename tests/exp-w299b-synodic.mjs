// 第299便b(原仮定者の裁定(第89報)①「geoPN=2 は近似であり、近似として扱いやすい基準を探す。earthMoonRealKF1 で合わせる『公転周期』は、
// 『恒星月』の代わりに『朔望月』を検証する」・統括の検証項目 R170)—— **🌘 earthMoonRealKF1 の朔望月**の器(純 Node・ブラウザ不要 ——
// html の inline script を主コンテキストで読む `tests/lib-w280b-emgrid.mjs` の `loadHtmlMain`/`runRow`)。
//
// ■ 何をするか
//   🌘 は太陽の無い二体。朔望月(太陽・地球・月の合の周期)は二体の走行から直接は出ないので、**抽出器(html の朔望月の時計 HP.synodic —— 版つき・
//   アプリ内実測と同じ関数)**で 3 通りに数える:
//   (A) 仮想の太陽の時計: λ☉(t)=λ☉0+2πt/T_year(T_year = 恒星年 365.256363004 日 —— IERS の有用定数・Simon et al. 1994)。地心の離角
//       Δλ=unwrap(λ_M−λ☉) が 2πk を下から越える時刻(幾何学的な合)を数え、窓 W の平均間隔を出す。初期位相 λ☉0 の格子(N=36 点 —— 10° 刻み)と
//       始点の格子(捨てる初期間隔 s)で、位相と始点への依存の大きさを測る。窓 8・118・354。
//   (B) 一様換算: 1/P_syn = 1/P_sid − 1/T_year(P_sid = 恒星月の抽出器〔runRow・同方向 1〜9 周の 8 間隔〕と同じ値)。窓 8・118・354。
//   (C) 実際の太陽がある本(🌦️ earthMoonSunInertial3d —— 三次元・太陽 pinned): 地心から太陽への方位で合を数える(黄道〔xy〕への射影)。
//   時刻は sim の座標時 t=k·dt(🌘 は 1 単位 = 10² s → 1 日 = 864 単位・🌦️ は 10⁴ s → 8.64 単位)。合は t>0 で下から越えた時刻(t=0 の合は数えない)。
//   観測の平均朔望月 29.530588858 日 = IERS の Delaunay 引数 D(平均離角)の率 1602961601.2090″/ユリウス世紀(Simon et al. 1994・J2000.0)から
//   1296000″×36525 日/率(個々の朔望月は約 29.26〜29.80 日 —— 月と地球の軌道の離心で揺れる。比べるのは平均)。
//
// ■ 段(part)
//   scan   D0pull の格子(1e-5〜1e-2)と kFrame=0 の写し(床)で、(A) 8 間隔(36 位相)と (B) 8 公転窓の換算(h)
//   long   採用値の長い走行(h: 370 朔望月 —— 窓 8・118・354 と位相・始点の格子・窓と位相の依存の表)
//   longh2 採用値の h/2(130 朔望月 —— 窓 8・118)と床(kFrame=0・h・130 朔望月)
//   sun3d  🌦️ の実際の太陽の方向での合(窓 8・118・354)・同じ走行の仮想の太陽(36 位相)と一様換算・模型の 1 年(地心から見た太陽の方位の 1 周)
//   fit    標的(B 一様換算・8 公転窓)へ D0pull の根を探索範囲 [1e-5, 1e-3] で挟めるか → 挟めれば Illinois・挟めなければ残差が最小の範囲の端 →
//          h と h/2 で測り直す → fitRecord(版 w298b-1・標的 1 件)。A(仮想の太陽・36 位相の平均・8 間隔)は同じ D0pull の h と h/2 で照合だけ
//   aps    近点回転優先の D0pull(第298便b の 3.06883e-5 —— 8 公転窓で 8.84995 年)が朔望月の門に入るか(h と h/2)
//
// ■ 使い方
//   node tests/exp-w299b-synodic.mjs [--part scan,long,longh2,sun3d,fit,aps]  → 正本 tests/out/synodic-w299b.json(段 synodic-299b)
//   W299B_OUT=<json> で出力先を変える(器の試走は正本を書かない)。W299B_PART=<part,...> で段を絞る(既存の正本の他の段を残して上書き)。
//   W299B_TARGET=<html>(既定 beta/index.html)。並走: 段ごとに W299B_OUT=<写し> node tests/exp-w299b-synodic.mjs --part <段> を別の process で走らせ、
//   node tests/exp-w299b-synodic.mjs --merge <写し,…> で正本にまとめる(写しの targetSha256 がいまの html と違えば止める)
//
// ■ 言わないこと: 「朔望月を再現した」「現実を再現した」「再現しない」「合わせられない」。届かない量は「この探索範囲では未達 —— 次の見直し」。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain, runRow, EMGRID_LIB_VERSION } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { pinDecl302, DECL302_DATA_FILE } from './lib-w303a-pre.mjs';   // 第303便a: 第302便の本の宣言の写し(この正本は第302便の宣言で測った歴史の記録 —— 器の中だけ・html と署名は変えない)
import { pinDecl303, DECL303_DATA_FILE } from './lib-w304c-pre.mjs';   // 第304便c: 第303便の 🌦️🌔 の宣言の写し(pinDecl302 の前に —— 軟化・初期配置・引きずりの宣言を第303便へ戻してから第302便の欄を戻す・歴史の値を保つ)
// 第281便a の領域 hash の宣言(再生成の鎖が「この器の正本を走らせ直すか」を引く)—— 読む本は 🌘・🌙・🌦️(id で引く)
const REGEN_SCOPE = {"presets":["earthMoonRealKF1","earthMoonReal","earthMoonSunInertial3d"],"roots":["HP.FIT_COND_VERSION","HP.FIT_RECORD_VERSION_MT","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.validateFitRecord","HP.validatePreset","HP.sim","HP.synodic","isNum","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.W299B_TARGET || 'beta/index.html';
const OUT = process.env.W299B_OUT || path.join(ROOT, 'tests', 'out', 'synodic-w299b.json');
const argOf = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const PARTS = String(argOf('--part') || process.env.W299B_PART || 'scan,long,longh2,sun3d,fit,aps').split(',').filter(Boolean);
export const SYNODIC_W299B_VERSION = 'w299b-synodic-1';

const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
const { HP } = loadHtmlMain(html);
pinDecl303(null, ['earthMoonSunInertial3d']);   // 第304便c: 🌦️🌔 を第303便の宣言へ(軟化 0.01・初期配置・W_bg —— 続く pinDecl302 が第302便の欄を戻す)
pinDecl302(null, ['earthMoonSunInertial3d']);   // 第303便a: 🌦️ の W_bg・初期配置・記録を第302便の宣言に戻して測る(歴史の値を保つ —— 写すのは再生成範囲の宣言の本だけ)
const SYN = HP.synodic;
if (!SYN || !SYN.version) throw new Error('HP.synodic が無い(朔望月の時計は第299便b の html から)');
const BUILTIN = vm.runInThisContext('BUILTIN_PRESETS');
const clone = (o) => JSON.parse(JSON.stringify(o));
const presetOf = (id) => { const p = BUILTIN.find((q) => q.id === id); if (!p) throw new Error('no preset ' + id); return clone(p); };
const t0All = Date.now();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---------------------------------------------------------------------------------------------------------------
const EM_ID = 'earthMoonRealKF1', OBS_ID = 'earthMoonReal', SUN_ID = 'earthMoonSunInertial3d';
const DAY_EM = 864;                                    // 🌘(10² s)の 1 日
const D_RATE_ARCSEC_PER_CY = 1602961601.2090;          // IERS の Delaunay 引数 D(平均離角)の率(Simon et al. 1994)
export const SYN_OBS_DAYS = 1296000 * 36525 / D_RATE_ARCSEC_PER_CY;   // 29.530588858 日(J2000.0 の平均朔望月)
const SID_OBS_DAYS = 27.3217;                          // 恒星月(本の parameterAudit の観測値 —— 第298便e の標的・履歴)
const PHASES = 36;                                     // 仮想の太陽の初期位相の格子(10° 刻み)
const W_FIT = 8;                                       // 第一・第二の標的の窓(8 間隔 —— 恒星月と同じ 8)
const WINS = [8, 118, 354];
const DT = 0.016, DT2 = 0.008;
const RANGE = [1e-5, 1e-3];                            // D0pull の探索範囲(第298便e と同じ —— 記録の knobs.range)
const GRID = [1e-5, 2e-5, 3.06883e-5, 1e-4, 3.5e-4, 6e-4, 1e-3, 1e-2];   // 段 scan(1e-2 は範囲の外の参照)
const D_APS = 3.06883e-5;                              // 第298便b の近点回転優先の採用値(8 公転窓 8.84995 年)
const STOP = 2e-7;                                     // 第一の標的の相対残差の止める条件
// 照合許容の宣言(近似の基準 —— 出典の表示桁に合わせた declared。観測の σ ではない・恒星月の 0.00005 日は流用しない)
export const TOL_SYN = { value: 0.005, kind: 'declared',
  note: '照合許容の宣言 0.005 日 —— 近似の基準(geoPN=2・太陽の無い二体)として朔望月を表示桁 29.53 日(NASA NSSDC Moon Fact Sheet の表記)の末位の半分まで読む。観測の σ ではない(平均朔望月 29.530588858 日〔IERS の D の率〕は桁がもっと多い —— 桁で読む宣言)' };
const SRC_SYN = '平均朔望月 29.530588858 日(IERS の Delaunay 引数 D の率 1602961601.2090″/世紀 —— Simon et al. 1994 A&A 282 663・J2000.0)';
const CLOCK_DECL = (wins) => ({ version: SYN.version, yearDays: SYN.yearDays, yearSource: '恒星年 365.256363004 日(IERS の有用定数 —— Simon et al. 1994・観測 CSV の SOL-b851fd96)',
  timeScale: 'sim の座標時 t=k·dt(🌘 1 日 = 864 単位)', phases: PHASES, phaseRefDeg: '初期位相 λ☉0 は sim の x 軸から反時計回り(月の t=0 の方位 0° —— 近地点)',
  conj: '地心の離角 unwrap(λ_M−λ☉) が 2πk を下から越えた時刻(段の線形補間・t=0 の合は数えない)', skip: 0, windows: wins, maxStepRad: SYN.maxStep });
export const EX_UNIFORM = 'tests/lib-w280b-emgrid.mjs runRow(' + EMGRID_LIB_VERSION + ') の恒星月(同方向 1〜9 周の 8 間隔の平均)を一様換算 1/P_syn=1/P_sid−1/T_year(T_year = 恒星年 365.256363004 日・時計 ' + SYN.version + ')';
export const EX_VIRTUAL = 'html の朔望月の時計 HP.synodic(' + SYN.version + ')—— 仮想の太陽 λ☉=λ☉0+2πt/T_year(恒星年 365.256363004 日)・地心の離角が 2πk を下から越えた合・初期位相 36 点(10° 刻み)の平均・各位相の最初の合から 8 間隔';

function f1Base() {
  const p = presetOf(EM_ID), o = presetOf(OBS_ID);
  p.bodies.forEach((b, i) => { for (const k of ['m', 'radius', 'x', 'y', 'spin', 'vx', 'vy']) if (b[k] !== o.bodies[i][k]) throw new Error(`bodies[${i}].${k} が 🌘 と 🌙 で違う(f=1 の前提)`); });
  return p;
}
const at = (base, d0pull, patch) => { const q = clone(base); q.physics.D0pull = d0pull; if (patch) patch(q); return q; };

// 朔望月の時計の走行(🌘 —— 二体・平面)。所定の朔望月の数(全位相)と同方向の周回(runRow と同じ式の通過時刻)を積む
function clockRun(preset, dt, nSyn, o = {}) {
  const t = Date.now();
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 200));
  HP.sim.build(v.preset);
  const S = HP.sim, ci = 0, oi = 1;
  const toSec = Math.pow(10, preset.scaleExp.T), dayU = 86400 / toSec, tYear = SYN.yearUnits(toSec);
  const C = SYN.clockNew({ phases: PHASES, tYear });
  const rel = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci]; return Math.atan2(dy, dx); };
  let th = rel(); SYN.feed(C, 0, th, null);
  let angPrev = th, angAcc = 0; const rev = [];
  let k = 0; const maxSteps = o.maxSteps || 2e9;
  for (; k < maxSteps; k++) {
    S.step(dt);
    th = rel();
    if (!Number.isFinite(th)) break;
    const err = SYN.feed(C, (k + 1) * dt, th, null);
    if (err) break;
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k - 1 + fr + 1) * dt); }
    if ((k & 0xFFF) === 0 && SYN.windowDone(C, nSyn, 0)) { k++; break; }
    if (o.onProgress && (k & 0x3FFFFF) === 0) o.onProgress(k, C.conj[0].length);
  }
  return { C, rev, steps: k, dt, dayU, tYear, err: C.err, wallSec: (Date.now() - t) / 1000 };
}
const sidMean = (rev, W, dayU, s = 0) => (rev.length > s + W ? (rev[s + W] - rev[s]) / W / dayU : null);
// 窓 W の要約: 位相の統計(始点 0)・始点の格子(位相平均の範囲と位相 0 の範囲)・一様換算
function summarize(R, wins, startStride) {
  const { C, rev, dayU, tYear } = R, out = {};
  for (const W of wins) {
    const ps = SYN.phaseStats(C, W, 0);
    if (!ps) { out[W] = { complete: false }; continue; }
    const o = { complete: true, phaseMean: ps.mean / dayU, phaseMin: ps.min / dayU, phaseMax: ps.max / dayU, phaseSd: ps.sd / dayU, phaseSpan: (ps.max - ps.min) / dayU,
      phase0: ps.values[0] / dayU, phase180: ps.values[PHASES / 2] / dayU, phase90: ps.values[PHASES / 4] / dayU, phase270: ps.values[3 * PHASES / 4] / dayU };
    if (W === W_FIT) o.phaseValues = ps.values.map((x) => x / dayU);
    // 始点の格子(s = 0, stride, 2·stride, … 全位相が足りる範囲)
    const st = [];
    for (let s = 0; ; s += startStride) { const q = SYN.phaseStats(C, W, s); if (!q) break; st.push({ s, mean: q.mean / dayU, p0: q.values[0] / dayU }); }
    if (st.length > 1) {
      const ms = st.map((z) => z.mean), p0 = st.map((z) => z.p0);
      o.starts = { n: st.length, stride: startStride, meanMin: Math.min(...ms), meanMax: Math.max(...ms), p0Min: Math.min(...p0), p0Max: Math.max(...p0) };
    }
    const ps0 = sidMean(rev, W, dayU);
    o.sidMean = ps0; o.uniform = ps0 === null ? null : SYN.uniform(ps0 * dayU, tYear) / dayU;
    out[W] = o;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
async function partScan() {
  const p = f1Base(), rows = [];
  const cfg = GRID.map((d) => ({ D0pull: d, kFrame: 1, q: at(p, d) })).concat([{ D0pull: RANGE[1], kFrame: 0, q: at(p, RANGE[1], (z) => { z.physics.kFrame = 0; }) }]);
  for (const c of cfg) {
    const R = clockRun(c.q, DT, W_FIT + 1);
    const s = summarize(R, [W_FIT], 1)[W_FIT];
    const r = { D0pull: c.D0pull, kFrame: c.kFrame, dt: DT, steps: R.steps, err: R.err, sidMeanDays: s.sidMean, uniformDays: s.uniform,
      uniformResidual: s.uniform - SYN_OBS_DAYS, virtualMeanDays: s.phaseMean, virtualResidual: s.phaseMean - SYN_OBS_DAYS, phaseMin: s.phaseMin, phaseMax: s.phaseMax,
      phaseSd: s.phaseSd, phase0: s.phase0, phase180: s.phase180, virtualMinusUniform: s.phaseMean - s.uniform, wallSec: R.wallSec };
    rows.push(r); log('scan', JSON.stringify(r));
  }
  const inR = rows.filter((r) => r.kFrame === 1 && r.D0pull >= RANGE[0] && r.D0pull <= RANGE[1]);
  return { id: EM_ID, f: 1, window: W_FIT, phases: PHASES, grid: GRID, range: RANGE, rows,
    monotone: { uniformDays: inR.every((r, i) => i === 0 || r.uniformDays < inR[i - 1].uniformDays) },
    allAbove: rows.every((r) => r.uniformDays > SYN_OBS_DAYS), floor: rows.find((r) => r.kFrame === 0) };
}

function longRuns(runs) {
  const out = {};
  for (const r of runs) {
    const R = clockRun(r.q, r.dt, r.n, { onProgress: (k, n) => log('long', r.key, k, n) });
    out[r.key] = { D0pull: r.q.physics.D0pull, kFrame: r.q.physics.kFrame, dt: r.dt, nSyn: r.n, steps: R.steps, err: R.err, wallSec: R.wallSec,
      revN: R.rev.length, conjN: R.C.conj[0].length, windows: summarize(R, r.wins, r.stride) };
    log('long', r.key, JSON.stringify(out[r.key]).slice(0, 600));
  }
  return out;
}
async function partLong() {
  const p = f1Base();
  const out = longRuns([{ key: 'adoptedH', q: at(p, RANGE[1]), dt: DT, n: 370, wins: WINS, stride: 4 }]);
  // 窓・位相の依存の大きさ(採用値・h)
  const W = out.adoptedH.windows;
  out.dependence = WINS.map((w) => ({ W: w, phaseSpan: W[w].phaseSpan, phaseSd: W[w].phaseSd, startMeanSpan: W[w].starts ? W[w].starts.meanMax - W[w].starts.meanMin : null,
    startP0Span: W[w].starts ? W[w].starts.p0Max - W[w].starts.p0Min : null, virtualMinusUniform: W[w].phaseMean - W[w].uniform, uniform: W[w].uniform }));
  return out;
}
// 採用値の h/2(窓 8・118)と床(kFrame=0・h・窓 8・118)—— 段 long と別の process で並走できるように分けた
async function partLongH2() {
  const p = f1Base();
  return longRuns([{ key: 'adoptedH2', q: at(p, RANGE[1]), dt: DT2, n: 130, wins: [8, 118], stride: 4 },
    { key: 'floorH', q: at(p, RANGE[1], (z) => { z.physics.kFrame = 0; }), dt: DT, n: 130, wins: [8, 118], stride: 4 }]);
}

// 🌦️(三次元・太陽 pinned): 実際の太陽の方向の合・同じ走行の仮想の太陽(36 位相)・一様換算・模型の 1 年
async function partSun3d() {
  const t = Date.now();
  const p = presetOf(SUN_ID);
  const v = HP.validatePreset(clone(p));
  if (!v.ok) throw new Error('validatePreset 🌦️: ' + JSON.stringify(v.errors).slice(0, 200));
  HP.sim.build(v.preset);
  const S = HP.sim, si = 0, ci = 1, oi = 2;
  if (S.coord3d !== true) throw new Error('🌦️ が三次元で組まれない');
  const toSec = Math.pow(10, p.scaleExp.T), dayU = 86400 / toSec, tYear = SYN.yearUnits(toSec);
  const lamM = () => Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]), lamS = () => Math.atan2(S.y[si] - S.y[ci], S.x[si] - S.x[ci]);
  const CR = SYN.clockNew({ phases: 1, real: true }), CV = SYN.clockNew({ phases: PHASES, tYear });
  SYN.feed(CR, 0, lamM(), lamS()); SYN.feed(CV, 0, lamM(), null);
  let angPrev = lamM(), angAcc = 0, sPrev = lamS(), sAcc = 0; const rev = [], yr = [];
  const N = 370; let k = 0;
  for (; k < 4e8; k++) {
    S.step(DT);
    const tt = (k + 1) * DT, m = lamM(), s = lamS();
    if (SYN.feed(CR, tt, m, s) || SYN.feed(CV, tt, m, null)) break;
    let d = m - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = m;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k - 1 + fr + 1) * DT); }
    let e = s - sPrev; while (e > Math.PI) e -= 2 * Math.PI; while (e < -Math.PI) e += 2 * Math.PI;
    const pa = sAcc; sAcc += e; sPrev = s;
    if (Math.floor(Math.abs(sAcc) / (2 * Math.PI)) > Math.floor(Math.abs(pa) / (2 * Math.PI))) { const tg = Math.sign(sAcc) * Math.floor(Math.abs(sAcc) / (2 * Math.PI)) * 2 * Math.PI; yr.push(k * DT + (tg - pa) / (sAcc - pa) * DT); }
    if ((k & 0xFFF) === 0 && SYN.windowDone(CR, N, 0) && SYN.windowDone(CV, N, 0)) { k++; break; }
  }
  const real = {}, wins = {};
  for (const W of WINS) {
    const m = SYN.mean(CR, 0, W, 0);
    const st = []; for (let s = 0; ; s += 4) { const q = SYN.mean(CR, 0, W, s); if (q === null) break; st.push(q / dayU); }
    real[W] = { mean: m === null ? null : m / dayU, residual: m === null ? null : m / dayU - SYN_OBS_DAYS, startMin: st.length ? Math.min(...st) : null, startMax: st.length ? Math.max(...st) : null, nStarts: st.length };
  }
  Object.assign(wins, summarize({ C: CV, rev, dayU, tYear }, WINS, 4));
  const yearModel = yr.length >= 2 ? (yr[yr.length - 1] - yr[0]) / (yr.length - 1) / dayU : null;
  const sid8 = sidMean(rev, 8, dayU);
  return { id: SUN_ID, coord: '3d', dt: DT, steps: k, err: CR.err || CV.err, nSyn: N, real, virtual: wins,
    yearModelDays: yearModel, yearN: yr.length, yearNote: '地心から見た太陽の黄道経度の同方向 1 周の平均(模型の 1 年 —— 太陽 pinned・地球の公転)',
    uniformWithModelYear: (sid8 && yearModel) ? SYN.uniform(sid8 * dayU, yearModel * dayU) / dayU : null, wallSec: (Date.now() - t) / 1000 };
}

// 第一の標的(B 一様換算・8 公転窓)と第二の標的(A 仮想の太陽・36 位相の平均・8 間隔)を同じ D0pull の h と h/2 で測る
function measure(p, d, dt) {
  const r = runRow(HP, at(p, d), { ci: 0, oi: 1, dt, revMax: 9, windows: [8], maxSteps: 4e7 });
  const w = r.windows[0];
  const R = clockRun(at(p, d), dt, W_FIT + 1);
  const s = summarize(R, [W_FIT], 1)[W_FIT];
  if (Math.abs(s.sidMean - r.sidMeanDays) > 0) throw new Error('時計の走行の恒星月が runRow と違う: ' + s.sidMean + ' / ' + r.sidMeanDays);
  return { D0pull: d, dt, steps: r.steps, sidMeanDays: r.sidMeanDays, uniformDays: SYN.uniform(r.sidMeanDays * DAY_EM, SYN.yearUnits(100)) / DAY_EM,
    virtualMeanDays: s.phaseMean, phaseMin: s.phaseMin, phaseMax: s.phaseMax, phaseSd: s.phaseSd, clockSteps: R.steps,
    apsPeriodYr: w && w.B ? w.B.apsPeriodYr : null, slopeDegPerPeri: w && w.B ? w.B.slopeDegPerPeri : null };
}
const round = (x, sig) => Number(x.toPrecision(sig));
function targetsAt(eh, eh2) {
  const tg = (q, model, half, extractor, window, source) => {
    const residual = model - SYN_OBS_DAYS;
    return { q, obs: SYN_OBS_DAYS, unit: 'd', source, window, tol: TOL_SYN, extractor, model, residual, rel: residual / SYN_OBS_DAYS, numerics: { h2: Math.abs(half - model), dtHalf: DT2 } };
  };
  return [tg('synodicMonthUniform', eh.uniformDays, eh2.uniformDays, EX_UNIFORM, '8 公転窓(同方向 1〜9 周の通過 —— 恒星月と同じ窓)を恒星年で一様換算', SRC_SYN)];
}
// 仮想の太陽の時計(A)は照合(門に入れない —— 8 間隔の位相平均は離心の 2 次の偏りで観測の平均より長い: 段 scan・long)
function virtualCheck(eh, eh2) {
  return { q: 'synodicMonthVirtualSun', extractor: EX_VIRTUAL, window: '8 朔望月(仮想の太陽の初期位相 36 点の平均・各位相の最初の合から 8 間隔)', obs: SYN_OBS_DAYS,
    model: eh.virtualMeanDays, residual: eh.virtualMeanDays - SYN_OBS_DAYS, h2: Math.abs(eh2.virtualMeanDays - eh.virtualMeanDays), phaseMin: eh.phaseMin, phaseMax: eh.phaseMax, phaseSd: eh.phaseSd,
    minusUniform: eh.virtualMeanDays - eh.uniformDays, gated: false };
}
async function partFit() {
  const p = f1Base(), evals = [];
  const F = (d, dt = DT) => { const e = measure(p, d, dt); evals.push(e); log('fit', JSON.stringify(e)); return e; };
  const rel = (e) => e.uniformDays / SYN_OBS_DAYS - 1;
  let a = RANGE[0], b = RANGE[1];
  const ea = F(a), eb = F(b);
  let fa = rel(ea), fb = rel(eb);
  const bracketed = (fa > 0) !== (fb > 0);
  let it = 0, x, ex;
  if (bracketed) {
    let side = 0, fx = fb; x = b;
    while (it < 16 && Math.abs(fx) > STOP) {
      x = (a * fb - b * fa) / (fb - fa); fx = rel(F(x)); it++;
      if (fx * fb > 0) { b = x; fb = fx; if (side === -1) fa /= 2; side = -1; } else { a = x; fa = fx; if (side === 1) fb /= 2; side = 1; }
    }
    x = round(x, 6); ex = F(x);
  } else {
    const pick = Math.abs(rel(ea)) <= Math.abs(rel(eb)) ? ea : eb; x = pick.D0pull; ex = pick;
  }
  const eh = ex, eh2 = F(x, DT2);
  const targets = targetsAt(eh, eh2);
  const gate = targets.map((t) => ({ q: t.q, pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value, residual: t.residual, h2: t.numerics.h2, tol: t.tol.value }));
  const status = gate.every((g) => g.pass) ? 'fitted' : 'unreachable-in-bounds';
  const virt = virtualCheck(eh, eh2);
  const check = { virtual: virt, sidereal: { obs: SID_OBS_DAYS, model: eh.sidMeanDays, residual: eh.sidMeanDays - SID_OBS_DAYS, h2: Math.abs(eh2.sidMeanDays - eh.sidMeanDays) },
    apsidal: { obs: 8.85, model: eh.apsPeriodYr, residual: eh.apsPeriodYr - 8.85, h2: Math.abs(eh2.apsPeriodYr - eh.apsPeriodYr), slopeDegPerPeri: eh.slopeDegPerPeri } };
  const rangeTxt = '[' + RANGE.join(', ') + ']';
  const fitRecord = {
    version: HP.FIT_RECORD_VERSION_MT, parent: EM_ID,
    law: 'geoPN=2(レガシー・近似)・kFrame=1・λ_PN=0・qLock・frameWeight:"pull"・初速の係数 f=1(観測の初速)',
    targets,
    knobs: [{ key: 'physics.D0pull', range: RANGE.slice(), final: x }],
    fixed: ['初速の係数 f=1(地球と月の速度は 🌙 earthMoonReal の宣言そのもの)', 'G・質量・半径・自転・離角(🌙 と同じ観測入力)', 'D0=0.006(E1′)',
      'q=8.2358(qLock の厳密一致式)', 'kFrame=1・geoPN=2・λ_PN=0', 'frameWeight:"pull"', 'softening 0.1・stateCarry:"double"',
      '朔望月の時計 ' + SYN.version + ': 恒星年 365.256363004 日(IERS —— Simon et al. 1994)・時刻は sim の座標時・初期位相 36 点・捨てる初期間隔 0'],
    procedure: '朔望月(第299便b —— 原仮定者の裁定(第89報)①): f=1 に固定し、ノブ D0pull だけで標的(恒星月の 8 公転窓を恒星年で一様換算した朔望月)の根を探索範囲 ' + rangeTxt + ' で探した。'
      + (bracketed ? '両端で符号が変わるので Illinois(止める条件は相対残差 ≤ ' + STOP + ')・6 桁に丸めた値を'
        : '両端とも換算の朔望月が観測の平均より長く根を挟めない(引きずりを切った kFrame=0 の写しでも長い —— 段 scan の床)ので、残差が最小の範囲の端 D0pull=' + x + ' を採り(根ではない)')
      + ' h と h/2 で測り直した。許容は近似の基準の宣言 0.005 日。仮想の太陽の時計で数えた合・恒星月・近点回転は照合だけ(器 tests/exp-w299b-synodic.mjs)',
    dt: DT, steps: eh.steps, status,
    notFitted: [
      '仮想の太陽の時計の朔望月(照合だけ): 初期位相 36 点の平均・8 間隔 ' + virt.model.toPrecision(8) + ' 日(残差 +' + virt.residual.toPrecision(3) + ' 日 —— 8 間隔の位相平均は離心の偏りで長い。位相ごとは ' + virt.phaseMin.toFixed(3) + '〜' + virt.phaseMax.toFixed(3) + ' 日・長い窓は段 long)',
      '恒星月(照合 —— 第298便e の第一の標的・履歴): 8 公転窓 ' + eh.sidMeanDays.toPrecision(8) + ' 日・27.3217 日との残差 +' + check.sidereal.residual.toPrecision(4) + ' 日(恒星月の許容 0.00005 日の門の外 —— 第298便e)',
      '近点回転の周期(照合だけ): 8 公転窓 ' + eh.apsPeriodYr.toPrecision(6) + ' 年・8.85 年との残差 +' + check.apsidal.residual.toPrecision(6) + ' 年(第298便b の近点回転優先 D0pull 3.06883e-5 は朔望月の門の外 —— 段 aps)',
      '実際の太陽による朔望月の揺れ(🌘 は太陽の無い二体 —— 時計は仮想。太陽のある本の値は段 sun3d)', '機構(実際の主因は太陽摂動 —— 機構の同定ではない)'] };
  const vp = HP.validatePreset(clone(at(p, x)));
  if (!vp.ok) throw new Error('validatePreset: ' + JSON.stringify(vp.errors).slice(0, 200));
  fitRecord.cond = { version: HP.FIT_COND_VERSION, sig: '', extractor: 'tests/lib-w280b-emgrid.mjs runRow(' + EMGRID_LIB_VERSION + ')・朔望月の時計 ' + SYN.version + '(一様換算)' };
  fitRecord.cond.sig = HP.fitCondSig(vp.preset, fitRecord);
  const vr = HP.validateFitRecord(clone(fitRecord));
  return { id: EM_ID, f: 1, obs: { synodicDays: SYN_OBS_DAYS, source: SRC_SYN, dRateArcsecPerCy: D_RATE_ARCSEC_PER_CY, siderealDays: SID_OBS_DAYS },
    clock: CLOCK_DECL([W_FIT]), range: RANGE, stop: STOP, bracketed, iterations: it, evals,
    ends: [{ D0pull: ea.D0pull, uniformDays: ea.uniformDays, rel: rel(ea) }, { D0pull: eb.D0pull, uniformDays: eb.uniformDays, rel: rel(eb) }],
    adopted: { D0pull: x, h: eh, half: eh2 }, gate, status, check, fitRecord: vr.ok ? vr.fitRecord : fitRecord, fitRecordAccepted: vr.ok, fitRecordErr: vr.ok ? null : vr.err };
}

async function partAps() {
  const p = f1Base();
  const eh = measure(p, D_APS, DT), eh2 = measure(p, D_APS, DT2);
  log('aps', JSON.stringify(eh)); log('aps', JSON.stringify(eh2));
  const targets = targetsAt(eh, eh2);
  return { id: EM_ID, D0pull: D_APS, note: '第298便b の近点回転優先の採用値(8 公転窓 8.84995 年)—— 朔望月の門に入るか', h: eh, half: eh2,
    gate: targets.map((t) => ({ q: t.q, model: t.model, residual: t.residual, h2: t.numerics.h2, tol: t.tol.value, pass: Math.abs(t.residual) + t.numerics.h2 <= t.tol.value })),
    virtual: virtualCheck(eh, eh2) };
}

// ---------------------------------------------------------------------------------------------------------------
const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
out.version = SYNODIC_W299B_VERSION;
out.generator = 'tests/exp-w299b-synodic.mjs';
out.ruling = '原仮定者の裁定(第89報)①・統括の検証項目 R170';
out.target = TARGET; out.targetSha256 = targetSha256;
out.clockVersion = SYN.version;
out.obs = { synodicDays: SYN_OBS_DAYS, source: SRC_SYN, siderealYearDays: SYN.yearDays, tol: TOL_SYN };
out.parts = out.parts || {};
const MERGE = argOf('--merge');
if (MERGE) for (const f of MERGE.split(',').filter(Boolean)) { const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (j.targetSha256 && j.targetSha256 !== targetSha256) throw new Error('--merge: 写し ' + f + ' の targetSha256 がいまの html と違う(同じ html で走らせ直すこと)');
  Object.assign(out.parts, j.parts || {}); }
const RUN = { scan: partScan, long: partLong, longh2: partLongH2, sun3d: partSun3d, fit: partFit, aps: partAps };
for (const k of Object.keys(out.parts)) if (!RUN[k]) delete out.parts[k];
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
const CODE = ['tests/exp-w299b-synodic.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w303a-pre.mjs', 'tests/lib-w304c-pre.mjs'];
out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第299便b', target: TARGET, code: CODE, inputs: [TARGET, DECL302_DATA_FILE, DECL303_DATA_FILE] }), {
  harnessVersion: SYNODIC_W299B_VERSION, clockVersion: SYN.version, parts: Object.keys(out.parts),
  ruling: '原仮定者の裁定(第89報)①(geoPN=2 は近似 —— 近似として扱いやすい基準を探す・earthMoonRealKF1 の公転周期は恒星月の代わりに朔望月を検証する)',
  reading: '統括の検証項目 R170(仮想の太陽の時計・一様換算・太陽のある本の実際の方向の 3 通りで測り、窓・位相・始点の依存と床を並べて基準を選ぶ・ノブは D0pull だけ・h と h/2)',
  engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
  notClaim: ['朔望月を再現した', '現実を再現した', '月の近点回転を再現した', 'gain は普遍定数'] });
out.elapsedS = out.timing.wallSec;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log('→', path.relative(ROOT, OUT), out.elapsedS + ' s');

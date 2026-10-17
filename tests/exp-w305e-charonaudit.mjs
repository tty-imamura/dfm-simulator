// 第305便e(決断事項 AN318「🟪 の基線の監査」・AN333「観測の時間標準の記録」・統括の検証項目 R203)——
// **🟪 plutoCharonInertialFit の基線の監査の器**(第304便c の 🌦️ の監査と同じ型 —— Node だけ。対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの步〔sim.build・sim.step〕を走らせる。走行は 1 プロセスで順に)。
//
// ■ 何を分けるか(引きずり OFF —— 本の abBody と同じ形 relativeDrag:{Wbg:null, enabled:false})
//   🟪 は引きずり OFF で標的(Buie, Tholen & Grundy 2012 Table 5 の P = 551856.43872 ± 0.02592 s —— SOL-25d4320f)より +7.221 s 長い(第303便b・第304便b)。
//   本の W_bg(第303便a の 0.0001486103)はこの差を埋めるフィットである。その差の内訳を次に分ける:
//     closed  閉じた式(二体ケプラー —— 本の質量 × G と初期の距離)と標的の差、その分解(PLU060 の平均の要素の定義〔SOL-5e03d54e の a と SOL-703bb236 の P〕・
//             解の違い〔SOL-703bb236 と SOL-25d4320f〕)、GM の不確かさ(SOL-2ed99d44 —— 公表 0.2・formal 0.09 km³/s²)に換算した大きさ。
//     soft    軟化 ε(本の 0.01 = 1 km と 0.005・0.0025 —— softeningFloor の写し・ε² で 0 へ外挿)。
//     window  周期の抽出器と窓(M1 = 同方向の周回の通過時刻の平均間隔〔フィットの器と同じ —— 8 公転〕・第 2 周・16 公転・[8,16] の後半・
//             M4 = 相対の偏角の調和の回帰〔直線 + 公転の 2 倍までの調和〕の傾き)。
//     band    数値の帯(h = 0.16・h/2・h/4 —— 同じ M1)。
//     mass    質量の作り方(GM = G·m —— G を 6.67430 にして m を GM/G で作り直した写しとの差・GM を標的に合う値へ動かした写し)。
//     tide    二次元の近似(三次元の写し〔coord:"3d"・frameReaction を外す〕との差・太陽の潮汐と同じ強さ GM☉/D³ の遠い質点〔軌道面の内・
//             三次元で法線の向き〕を足した写し —— D☉ = 30 au と 50 au の桁。座標の値域 ±5000 単位の内に置くので、質量は GM☉(D/D☉)³ にした等価の点)。
//     clock   観察者の時計への換算(**記録だけ** —— 判定には使わない): α = c_loc/c₀ = e^(−2ψ)(第95報・AN332)の 2ψ を太陽だけ(1 au)と
//             太陽 + 地表(1 au・地球の半径)で P に掛けた量。原資料の時間標準は CSV の注記(SOL-25d4320f の "time system TT/TDB of JDT")の写し。
//     fix     宣言を直す案の確かめ(引きずり OFF の写しで、(A) a を二体ケプラーの a〔本の GM と標的の P から〕へ・(B) GM を標的に合う値へ —— 残差 + h/2 差 が σ の内か)。
//   **宣言は変えない**(監査の記録 —— 直す案は報告と PHYSICS〔第305便e〕の読みに)。
//
// ■ 正本 tests/out/charonaudit-w305e.json(段 charonaudit-305e)。W305E_PARTS=closed,soft,window,band,mass,tide,clock,fix(既定は全部)・
//   W305E_OUT で出力先を変える(試走は正本を書かない)。走行は決定的(同じ html・同じ Node で同じ数 —— 壁時計の欄は volatilePaths)。
//
// ■ 言わないこと: 「カロンの周期が観測どおりになった」「引きずりが要らないことを示した」「観測と一致した」「時計の換算で合った」。
//   届かない量は「この探索範囲では未達 —— 次の見直し」と書く。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { pinDecl305, DECL305_DATA_FILE } from './lib-w306e-pre.mjs';   // 第306便e(AN339 の案 (A)・R208): 🟪 の宣言を直した世代では、この器は第305便の宣言の写しで測る(基線の監査の記録 —— 歴史の値を保つ)
const REGEN_SCOPE = {"presets":["plutoCharonInertialFit"],"roots":["$","DT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","auditRows","ch","cw","fmt"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w305e-charonaudit-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
export const PLU_ID = 'plutoCharonInertialFit';
export const CSV_FILE = 'paper/data/solar-observations.csv';
/** 照合に使う CSV の行(record_id —— 値は CSV から読む。ここで数値を作らない) */
export const REC = Object.freeze({ target: 'SOL-25d4320f', aMean: 'SOL-5e03d54e', pMean: 'SOL-703bb236', gmSys: 'SOL-2ed99d44', gmP: 'SOL-89b3bd11', gmC: 'SOL-3e64c063', aBuie: 'SOL-f67ddda4' });
export const DT = 0.16, REV = 8;
/** 単位(本の scaleExp —— 1 単位 = 10⁵ m・10 s・10²⁴ kg) */
export const UNIT = Object.freeze({ L: 1e5, T: 10, M: 1e24 });
/** 物理定数(換算と潮汐の桁だけに使う —— 走行の宣言には入れない) */
export const CONST = Object.freeze({ GMsun: 1.32712440018e20, au: 1.495978707e11, GMearth: 3.986004418e14, Rearth: 6.3781e6, c: 299792458, G2018: 6.67430,
  note: 'GM☉・GM⊕ は IAU 2015 の公称値(R1・B3)・au は IAU 2012(B2)・地球の半径は赤道の公称値 6378.1 km・c は定義値・G2018 は CODATA 2018(内蔵の G 6.674 との比較だけ)' });
/** 潮汐の等価の質点(D は本の単位・D☉ は au) */
export const TIDE = Object.freeze({ D: 4000, Dalt: 4800, DsunAu: Object.freeze([30, 50]), mFloor: 1e-9 });
export const EPS = Object.freeze([0.01, 0.005, 0.0025]);
export const PARTS_ALL = Object.freeze(['closed', 'soft', 'window', 'band', 'mass', 'tide', 'clock', 'fix']);

/* ── CSV(引用符つきの欄を読む最小の読み手) ── */
export function csvRows(text) {
  const out = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; continue; }
    if (ch === '"') q = true; else if (ch === ',') { row.push(f); f = ''; } else if (ch === '\n') { row.push(f); out.push(row); row = []; f = ''; } else if (ch !== '\r') f += ch;
  }
  if (f.length || row.length) { row.push(f); out.push(row); }
  const head = out.shift();
  return out.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] === undefined ? '' : r[i]])));
}
export function recordsOf(root = ROOT) {
  const rows = csvRows(fs.readFileSync(path.join(root, CSV_FILE), 'utf8')), by = {};
  for (const [k, id] of Object.entries(REC)) {
    const hit = rows.filter((r) => r.record_id === id);
    if (hit.length !== 1) throw new Error(`CSV の ${id} が 1 行に定まらない(${hit.length})`);
    const r = hit[0]; by[k] = { recordId: id, body: r.body, quantity: r.quantity, value: Number(r.value), unit: r.unit, sigma: r.sigma === '' ? null : Number(r.sigma), source: r.source, note: r.note };
  }
  const fm = /formal_1sigma=([0-9.eE+-]+)/.exec(by.gmSys.note);
  by.gmSys.formal = fm ? Number(fm[1]) : null;
  const ts = /time system ([^;]+)/.exec(by.target.note);
  by.target.timeSystem = ts ? ts[1].trim() : null;
  return by;
}

/* ── 本の写し ── */
export const findPreset = (HP, id) => HP.allPresets().find((q) => q.id === id);
/** 引きずり OFF の写し(本の abBody と同じ形)。o.eps で重力の軟化(0.01 未満は softeningFloor の宣言)・o.three で三次元・o.extra で質点を足す */
export function offCopy(HP, o = {}) {
  const q = clone(findPreset(HP, PLU_ID)); delete q.fitRecord; delete q.abBody;
  const rd = q.physics.relativeDrag;
  q.physics.relativeDrag = { law: 'inertial', Wbg: null, enabled: false, eps: rd.eps, history: rd.history, pairs: rd.pairs, coreTable: clone(rd.coreTable) };
  if (o.eps !== undefined) { q.physics.softening = o.eps; if (o.eps < 0.01) q.physics.softeningFloor = o.eps; }
  if (o.three) { delete q.physics.frameReaction; q.physics.coord = '3d'; q.bodies.forEach((b) => { b.z = 0; b.vz = 0; }); }
  if (o.extra) { if (o.extra.m < 1e-6) q.physics.massFloor = TIDE.mFloor; q.bodies.push(o.extra.body); }
  return q;
}
/** 本の宣言そのもの(引きずり ON —— 対照の 1 行) */
export function onCopy(HP) { const q = clone(findPreset(HP, PLU_ID)); delete q.fitRecord; delete q.abBody; return q; }

/* ── 走行: 相対の偏角の周回(フィットの器 runPair と同じ通過の定義)と M4 の回帰 ── */
/** o = {dt, revMax, m4Every, three} → rev(通過の時刻 [本の時間])・M4 の傾き・離心率の代理 */
export function runRevs(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 240));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const three = S.coord3d === true, dt = o.dt, revMax = o.revMax, every = o.m4Every || 64;
  const rel = () => { const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], dz = three ? S.z[1] - S.z[0] : 0; return [Math.hypot(dx, dy, dz), Math.atan2(dy, dx)]; };
  let [r0, th0] = rel();
  const mu = S.params.G * (S.m[0] + S.m[1]);
  const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0], dvz = three ? S.vz[1] - S.vz[0] : 0, v2 = dvx * dvx + dvy * dvy + dvz * dvz;
  const a0 = 1 / (2 / r0 - v2 / mu), P0 = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu);
  let angPrev = th0, angAcc = 0, rMin = Infinity, rMax = -Infinity, nan = false, k = 0;
  const rev = [], samp = [];
  for (; ; k++) {
    S.step(dt);
    const [rr, th] = rel();
    if (!Number.isFinite(rr)) { nan = true; break; }
    if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    if (((k + 1) % every) === 0) samp.push([(k + 1) * dt, angAcc]);
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI, fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k + fr) * dt); }
    if (rev.length >= revMax) { k++; break; }
  }
  return { dt, steps: k, revN: rev.length, nan: nan || (S.hasNaN ? S.hasNaN() : false), three, osc0: { r: r0, a: a0, P: P0, mu }, rev, samp, eProxy: (rMax - rMin) / (rMax + rMin), n: S.n };
}
/** M1(通過の平均間隔 —— 窓 [i0, i1] の周回の番号)[本の時間] */
export const m1Of = (rev, i0 = 0, i1 = rev.length - 1) => (rev[i1] - rev[i0]) / (i1 - i0);
/** M4: 偏角 θ(t) を 1・t・cos(j n₀ t)・sin(j n₀ t)(j = 1, 2)で最小二乗(時刻は中心化・尺度化)—— 傾きから P = 2π/n。窓は t ≤ tEnd の標本 */
export function m4Of(samp, P0, tEnd) {
  const s = samp.filter((z) => z[0] <= tEnd), N = s.length;
  if (N < 16) return null;
  const tm = s.reduce((a, z) => a + z[0], 0) / N, ts = (s[N - 1][0] - s[0][0]) / 2, n0 = 2 * Math.PI / P0;
  const basis = (t) => { const u = (t - tm) / ts; return [1, u, Math.cos(n0 * t), Math.sin(n0 * t), Math.cos(2 * n0 * t), Math.sin(2 * n0 * t)]; };
  const K = 6, A = Array.from({ length: K }, () => new Float64Array(K)), b = new Float64Array(K);
  for (const [t, y] of s) { const f = basis(t); for (let i = 0; i < K; i++) { b[i] += f[i] * y; for (let j = 0; j < K; j++) A[i][j] += f[i] * f[j]; } }
  for (let c = 0; c < K; c++) {   // ガウスの消去(部分ピボット)
    let p = c; for (let r = c + 1; r < K; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < K; r++) { const f = A[r][c] / A[c][c]; for (let j = c; j < K; j++) A[r][j] -= f * A[c][j]; b[r] -= f * b[c]; }
  }
  const x = new Float64Array(K); for (let i = K - 1; i >= 0; i--) { let z = b[i]; for (let j = i + 1; j < K; j++) z -= A[i][j] * x[j]; x[i] = z / A[i][i]; }
  const n = x[1] / ts;
  return { P: 2 * Math.PI / Math.abs(n), harm1: Math.hypot(x[2], x[3]), harm2: Math.hypot(x[4], x[5]), N };
}
/** 1 走行の読み(秒) */
export function readRun(R, obs) {
  const sec = UNIT.T, n = R.rev.length;
  const M1 = m1Of(R.rev) * sec, rev2 = (R.rev[1] - R.rev[0]) * sec;
  const M4 = m4Of(R.samp, m1Of(R.rev), R.rev[n - 1]);
  const out = { dt: R.dt, steps: R.steps, revN: n, nan: R.nan, three: R.three, n: R.n, M1, d: M1 - obs, rev2, M4: M4 ? M4.P * sec : null, m4Harm: M4 ? [M4.harm1, M4.harm2] : null,
    eProxy: R.eProxy, osc0: { aUnits: R.osc0.a, rUnits: R.osc0.r, PK: R.osc0.P * sec } };
  if (n >= 16) { out.M1_16 = m1Of(R.rev, 0, 15) * sec; out.M1_8to16 = m1Of(R.rev, 8, 15) * sec; }
  return out;
}

/* ── 段 ── */
export function stageClosed(HP, rec) {
  const p = findPreset(HP, PLU_ID), b = p.bodies, G = p.physics.G, obs = rec.target.value, sig = rec.target.sigma;
  const r0 = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y), vrel = Math.hypot(b[1].vx - b[0].vx, b[1].vy - b[0].vy), mu = G * (b[0].m + b[1].m);
  const a0 = 1 / (2 / r0 - vrel * vrel / mu), PK = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu) * UNIT.T;
  const muSI = mu * UNIT.L ** 3 / UNIT.T ** 2, gmKm = muSI / 1e9, aKm = a0 * UNIT.L / 1000;
  const gmP = G * b[0].m * UNIT.L ** 3 / UNIT.T ** 2 / 1e9, gmC = G * b[1].m * UNIT.L ** 3 / UNIT.T ** 2 / 1e9;
  const dK = PK - obs, gmNeed = gmKm * (PK / obs) ** 2, aNeedKm = aKm * (obs / PK) ** (2 / 3);
  const sGm = rec.gmSys.sigma / 1e9, sGmF = rec.gmSys.formal / 1e9, dPdGM = -PK / (2 * gmKm);
  const aMeanKm = rec.aMean.value / 1000, pMean = rec.pMean.value;
  // 同じ GM で PLU060 の平均の要素の a から作るケプラーの P(本の閉じた式と同じ —— 転写の確かめ)と、PLU060 の平均の P との差
  const PKmean = 2 * Math.PI * Math.sqrt((rec.aMean.value) ** 3 / (rec.gmSys.value));
  const aBuie = rec.aBuie.value, gmBuie = 4 * Math.PI * Math.PI * aBuie ** 3 / (obs * obs) / 1e9;
  return { r0Units: r0, a0Units: a0, vrelUnits: vrel, mu, gmKm, gmPKm: gmP, gmCKm: gmC, aKm, PK, dK, dKSigma: dK / sig,
    rows: { gmSys: rec.gmSys.value / 1e9, gmP: rec.gmP.value / 1e9, gmC: rec.gmC.value / 1e9, aMeanKm, pMean, aBuieKm: aBuie / 1000 },
    transcribe: { gmSame: Math.abs(gmKm - rec.gmSys.value / 1e9) < 5e-9, gmPSame: Math.abs(gmP - rec.gmP.value / 1e9) < 5e-9, gmCSame: Math.abs(gmC - rec.gmC.value / 1e9) < 5e-9, aSame: Math.abs(aKm - aMeanKm) < 5e-9 },
    split: { PKmean, defMix: PKmean - pMean, solDiff: pMean - obs, solDiffSigma: (pMean - obs) / sig, sum: (PKmean - pMean) + (pMean - obs) },
    gm: { need: gmNeed, dNeed: gmNeed - gmKm, sigmaPub: sGm, sigmaFormal: sGmF, dNeedPerPub: (gmNeed - gmKm) / sGm, dNeedPerFormal: (gmNeed - gmKm) / sGmF,
      dPdGM, pPerSigmaPub: dPdGM * sGm, pPerSigmaFormal: dPdGM * sGmF },
    a: { needKm: aNeedKm, dNeedKm: aNeedKm - aKm, dPdaKm: 1.5 * PK / aKm, buieGmImplied: gmBuie, buieGmMinusSys: gmBuie - rec.gmSys.value / 1e9, buieGmMinusSysPerPub: (gmBuie - rec.gmSys.value / 1e9) / sGm } };
}
export function stageSoft(HP, rec, log) {
  const obs = rec.target.value, rows = EPS.map((e) => { const t = Date.now(), R = readRun(runRevs(HP, offCopy(HP, { eps: e }), { dt: DT, revMax: REV }), obs);
    log(`soft ε ${e}: M1 ${R.M1}(差 ${R.d})`); return Object.assign({ eps: e, wallSec: (Date.now() - t) / 1000 }, R); });
  // P(ε) = P₀ + c ε²(同じ刻み h —— 数値の誤差は差で消える)。(ε₁, ε₂) と (ε₂, ε₃) の 2 組で外挿
  const [a, b, c] = rows, p0 = (x, y) => { const k = (x.M1 - y.M1) / (x.eps * x.eps - y.eps * y.eps); return x.M1 - k * x.eps * x.eps; };
  const ext = p0(a, b), ext2 = p0(b, c);
  return { rows, extrapolated: ext, extrapolated2: ext2, softEffect: a.M1 - ext, softEffect2: a.M1 - ext2, scaling: (a.M1 - b.M1) / (b.M1 - c.M1),
    analytic: { formula: '0.75(ε/a)²P(円軌道の軟化した重力の率 —— 桁の目安)', value: 0.75 * (EPS[0] / rows[0].osc0.aUnits) ** 2 * rows[0].osc0.PK } };
}
export function stageWindow(HP, rec, log) {
  const obs = rec.target.value, t = Date.now(), R0 = runRevs(HP, offCopy(HP), { dt: DT, revMax: 16 }), sec = UNIT.T;
  // 同じ走行の前半 8 公転(フィットの器と同じ窓 —— 走行は決定的なので 8 公転で止めた走行と同じ通過の時刻)と 16 公転・後半 [8,16]
  const M1 = m1Of(R0.rev, 0, REV - 1) * sec, M4 = m4Of(R0.samp, m1Of(R0.rev, 0, REV - 1), R0.rev[REV - 1]), M4_16 = m4Of(R0.samp, m1Of(R0.rev), R0.rev[15]);
  const run8 = { dt: DT, revN: REV, nan: R0.nan, M1, d: M1 - obs, rev2: (R0.rev[1] - R0.rev[0]) * sec, M4: M4 ? M4.P * sec : null, m4Harm: M4 ? [M4.harm1, M4.harm2] : null, eProxy: R0.eProxy };
  const run16 = { dt: DT, steps: R0.steps, revN: R0.rev.length, nan: R0.nan, M1: m1Of(R0.rev) * sec, late: m1Of(R0.rev, REV, 15) * sec, M4: M4_16 ? M4_16.P * sec : null, wallSec: (Date.now() - t) / 1000 };
  log(`window: M1(8)${run8.M1}・第 2 周 ${run8.rev2}・M4(8)${run8.M4}・M1(16)${run16.M1}・[8,16] ${run16.late}・M4(16)${run16.M4}`);
  return { run8, run16, diffs: { rev2MinusM1: run8.rev2 - M1, m4MinusM1: run8.M4 - M1, m1_16MinusM1: run16.M1 - M1, lateMinusM1: run16.late - M1, m4_16MinusM1: run16.M4 - M1 } };
}
export function stageBand(HP, rec, log) {
  const obs = rec.target.value, rows = [DT, DT / 2, DT / 4].map((dt) => { const t = Date.now(), R = readRun(runRevs(HP, offCopy(HP), { dt, revMax: REV }), obs);
    log(`band h ${dt}: M1 ${R.M1}`); return Object.assign({ wallSec: (Date.now() - t) / 1000 }, R); });
  return { rows, hh2: rows[0].M1 - rows[1].M1, h2h4: rows[1].M1 - rows[2].M1, ratio: (rows[0].M1 - rows[1].M1) / (rows[1].M1 - rows[2].M1) };
}
export function stageMass(HP, rec, cl, log) {
  const obs = rec.target.value, base = readRun(runRevs(HP, offCopy(HP), { dt: DT, revMax: REV }), obs);
  const gq = offCopy(HP); const g0 = gq.physics.G; gq.physics.G = CONST.G2018; gq.physics.kappaT = CONST.G2018 / (gq.physics.cLight ** 2);
  gq.bodies.forEach((b) => { b.m = b.m * g0 / CONST.G2018; });
  const Rg = readRun(runRevs(HP, gq, { dt: DT, revMax: REV }), obs);
  // GM を標的に合う値へ(質量を s 倍・速度を √s 倍 —— 同じ位置で新しい GM の円の速度。速度を変えないと離心が入り P は −2δP 動く)
  const sq = offCopy(HP), s = cl.gm.need / cl.gmKm; sq.bodies.forEach((b) => { b.m *= s; b.vx *= Math.sqrt(s); b.vy *= Math.sqrt(s); });
  const Rs = readRun(runRevs(HP, sq, { dt: DT, revMax: REV }), obs);
  log(`mass: G 6.67430 の写し ${Rg.M1}(差 ${Rg.M1 - base.M1})・GM ×${s} の写し ${Rs.M1}`);
  return { base: base.M1, g2018: { G: CONST.G2018, M1: Rg.M1, diff: Rg.M1 - base.M1 }, gmScaled: { scale: s, gmKm: cl.gmKm * s, M1: Rs.M1, d: Rs.M1 - obs } };
}
export function stageTide(HP, rec, log) {
  const obs = rec.target.value, base2 = readRun(runRevs(HP, offCopy(HP), { dt: DT, revMax: REV }), obs);
  const base3 = readRun(runRevs(HP, offCopy(HP, { three: true }), { dt: DT, revMax: REV }), obs);
  const Dsun = TIDE.DsunAu[0] * CONST.au / UNIT.L, mSun = CONST.GMsun / findPreset(HP, PLU_ID).physics.G / (UNIT.L ** 3 / UNIT.T ** 2);   // GM☉ を本の G で割った質量 [本の質量]
  const mEq = (D) => mSun * (D / Dsun) ** 3;
  const pert = (D, where, three) => { const m = mEq(D), pos = (where === 'normal') ? { x: 0, y: 0, z: D } : { x: D, y: 0 };
    const body = Object.assign({ type: 'single', m, radius: 0.5, vx: 0, vy: 0, spin: 0, pinned: true }, pos, three ? { z: pos.z || 0, vz: 0 } : {});
    const R = readRun(runRevs(HP, offCopy(HP, { three, extra: { m, body } }), { dt: DT, revMax: REV }), obs);
    log(`tide ${where} D ${D}(m ${m.toExponential(3)}): M1 ${R.M1}`); return { D, where, three, m, M1: R.M1, n: R.n }; };
  const inP = pert(TIDE.D, 'plane', false), inP2 = pert(TIDE.Dalt, 'plane', false), nrm = pert(TIDE.D, 'normal', true);
  const dIn = inP.M1 - base2.M1, dIn2 = inP2.M1 - base2.M1, dN = nrm.M1 - base3.M1;
  const scale50 = (TIDE.DsunAu[0] / TIDE.DsunAu[1]) ** 3;
  return { dsunUnits: Dsun, mSun, three: { M1: base3.M1, diff: base3.M1 - base2.M1 }, plane: inP, planeAlt: inP2, normal: nrm,
    effect: { plane30: dIn, normal30: dN, plane50: dIn * scale50, normal50: dN * scale50, planeAltD: dIn2, distanceCheck: dIn2 / dIn },
    note: '等価の質点(質量 GM☉(D/D☉)³ —— GM/D³ が D☉ の太陽と同じ)・pinned・初速 0(系は質点へ自由落下 —— 潮汐だけが相対軌道に効く)・D☉ = 30 au で作り 50 au は D⁻³ で換算' };
}
export function stageClock(rec) {
  const P = rec.target.value, c2 = CONST.c * CONST.c;
  const psiSun = CONST.GMsun / (c2 * CONST.au), psiE = CONST.GMearth / (c2 * CONST.Rearth);
  const sunOnly = 2 * psiSun * P, sunEarth = 2 * (psiSun + psiE) * P;
  return { timeSystem: rec.target.timeSystem, recordId: rec.target.recordId, psiSun, psiEarth: psiE,
    shiftSunOnly: sunOnly, shiftSunEarth: sunEarth, perSigmaSunOnly: sunOnly / rec.target.sigma, perSigmaSunEarth: sunEarth / rec.target.sigma,
    use: 'record-only', note: 'T_obs = α T_abs・α = e^(−2ψ)(第95報・AN332)なら絶対時間の P は観測の P より 2ψP 長い。AN333: 既定で全観測値へ適用しない —— 判定に使わない記録' };
}
export function stageFix(HP, rec, cl, log) {
  const obs = rec.target.value, sig = rec.target.sigma;
  const aK = Math.cbrt(cl.mu * (obs / UNIT.T / (2 * Math.PI)) ** 2);   // 本の GM と標的の P からの二体ケプラーの a [本の長さ]
  const mk = (kind) => { const q = offCopy(HP), b = q.bodies;
    if (kind === 'A') { const s = aK / cl.r0Units, m0 = b[0].m, m1 = b[1].m, M = m0 + m1, vc = Math.sqrt(cl.mu / aK);
      b[0].x = -aK * m1 / M; b[1].x = aK * m0 / M; b[0].vy = -vc * m1 / M; b[1].vy = vc * m0 / M; void s; }
    if (kind === 'B') { const s = cl.gm.need / cl.gmKm; b.forEach((z) => { z.m *= s; z.vx *= Math.sqrt(s); z.vy *= Math.sqrt(s); }); }
    return q; };
  const out = {};
  for (const k of ['A', 'B']) {
    const h = readRun(runRevs(HP, mk(k), { dt: DT, revMax: REV }), obs), h2 = readRun(runRevs(HP, mk(k), { dt: DT / 2, revMax: REV }), obs);
    out[k] = { M1: h.M1, M1h2: h2.M1, residual: h.M1 - obs, h2gap: Math.abs(h.M1 - h2.M1), withinSigma: Math.abs(h.M1 - obs) + Math.abs(h.M1 - h2.M1) <= sig };
    log(`fix ${k}: M1 ${h.M1}(残差 ${h.M1 - obs}・h/2 差 ${Math.abs(h.M1 - h2.M1)})`);
  }
  out.A.aKm = aK * UNIT.L / 1000; out.A.daKm = out.A.aKm - cl.aKm; out.B.gmKm = cl.gm.need; out.B.dGm = cl.gm.dNeed;
  return out;
}
export function stageOn(HP, rec, log) {
  const obs = rec.target.value, R = readRun(runRevs(HP, onCopy(HP), { dt: DT, revMax: REV }), obs);
  log(`on(本の W_bg): M1 ${R.M1}`); return { Wbg: findPreset(HP, PLU_ID).physics.relativeDrag.Wbg, M1: R.M1, d: R.d };
}

/* ── 内訳の表と門 ── */
/** 走行の差(h・8 公転の M1)= 閉じた式 + 軟化(ε² の外挿)+ 数値(h → 0 —— Richardson (M1(h) − M1(h/2))·4/3)+ 残り */
export function breakdownOf(J) {
  const C = J.closed, S = J.soft, B = J.band, W = J.window, sig = J.obs.sigma;
  const run = W ? W.run8.M1 : null, gap = run !== null ? run - J.obs.value : null, num = B ? B.hh2 * 4 / 3 : null;
  const sum = (C && S && B) ? C.dK + S.softEffect + num : null;
  return { gapRun: gap, closed: C ? C.dK : null, soft: S ? S.softEffect : null, numerical: num, sum, rest: (gap !== null && sum !== null) ? gap - sum : null, sigma: sig };
}
export function gatesOf(J) {
  const g = {};
  if (J.closed) { const t = J.closed.transcribe; g.transcribe = t.gmSame && t.gmPSame && t.gmCSame && t.aSame; g.splitSum = Math.abs(J.closed.split.sum - J.closed.dK) < 1e-6 + 1e-9 * J.obs.value; }
  if (J.soft) g.softScaling = J.soft.rows.every((r) => !r.nan && r.revN === REV) && J.soft.scaling > 3 && J.soft.scaling < 5;
  if (J.band) g.bandShrinks = Math.abs(J.band.h2h4) <= Math.abs(J.band.hh2) + 1e-6;
  if (J.window) g.windowRuns = !J.window.run16.nan && J.window.run16.revN === 16 && J.window.run8.M4 !== null;
  if (J.closed && J.soft && J.band && J.window) g.breakdownCloses = Math.abs(J.breakdown.rest) <= 1e-3;
  if (J.mass) g.gIndependent = Math.abs(J.mass.g2018.diff) <= 1e-4;
  if (J.tide) g.tideBelowSigma = Math.max(Math.abs(J.tide.effect.plane30), Math.abs(J.tide.effect.normal30)) < J.obs.sigma && Math.abs(J.tide.three.diff) <= 1e-4;
  if (J.clock) g.clockRecordOnly = J.clock.use === 'record-only' && typeof J.clock.timeSystem === 'string';
  if (J.fix) g.fixRuns = Number.isFinite(J.fix.A.M1) && Number.isFinite(J.fix.B.M1);
  return g;
}
/* ── 表の行(PHYSICS〔第305便e〕—— QA docs.charonAudit305 が正本から作り直して逐語で照合する)── */
const F = (x, d) => Number(x).toFixed(d), EXP = (x, d = 1) => Number(x).toExponential(d), SG = (x, d) => (x >= 0 ? '+' : '−') + F(Math.abs(x), d), SE = (x, d = 1) => (x >= 0 ? '+' : '−') + EXP(Math.abs(x), d);
const PS = (x, sig) => { const z = x / sig; return Math.abs(z) < 0.005 ? '< 0.01' : SG(z, 2); };
/** 表 1: 引きずり OFF の差の内訳(秒・σ の倍) */
export function breakdownRows(J) {
  const C = J.closed, B = J.breakdown, W = J.window, sig = J.obs.sigma, r = (label, x, fmt) => `| ${label} | ${fmt(x)} | ${PS(x, sig)} |`;
  return [
    r(`走行の差(引きずり OFF・h ${J.book.dt}・8 公転の M1 ${F(W.run8.M1, 5)} s − 標的 ${J.obs.value} s)`, B.gapRun, (x) => SG(x, 5)),
    r(`閉じた式(二体ケプラー: GM ${F(C.gmKm, 2)} km³/s²・a ${F(C.aKm, 3)} km → ${F(C.PK, 5)} s)− 標的`, C.dK, (x) => SG(x, 5)),
    r(`　うち PLU060 の平均の要素の定義(平均の a からのケプラーの P − PLU060 の平均の P ${C.rows.pMean} s)`, C.split.defMix, (x) => SG(x, 5)),
    r('　うち 解の違い(PLU060 の平均の P − 標的〔Buie 2012 の二体の P〕)', C.split.solDiff, (x) => SG(x, 5)),
    r(`軟化 ε ${J.soft.rows[0].eps}(= 1 km —— ε 0.01/0.005/0.0025 の ε² の外挿)`, B.soft, (x) => SG(x, 5)),
    r('数値の帯(h → 0 —— (M1(h) − M1(h/2))·4/3)', B.numerical, (x) => SE(x, 2)),
    r('残り(走行の差 − 上の 3 つ)', B.rest, (x) => SE(x, 1))];
}
/** 表 2: 監査の他の項目(秒・σ の倍) */
export function auditRows(J) {
  const sig = J.obs.sigma, W = J.window.diffs, M = J.mass, T = J.tide, K = J.clock, C = J.closed, band = J.band;
  const r = (label, x, fmt) => `| ${label} | ${fmt(x)} | ${PS(x, sig)} |`;
  return [
    r('抽出器: 第 2 周 − M1(8 公転)', W.rev2MinusM1, (x) => SE(x, 1)),
    r('抽出器: M4(偏角の調和の回帰)− M1(8 公転)', W.m4MinusM1, (x) => SE(x, 1)),
    r('窓: M1(16 公転)− M1(8 公転)', W.m1_16MinusM1, (x) => SE(x, 1)),
    r('窓: 後半 [8,16] − 前半(8 公転)', W.lateMinusM1, (x) => SE(x, 1)),
    r(`数値の帯: M1(h)− M1(h/2)・M1(h/2)− M1(h/4)(比 ${F(band.ratio, 2)})`, band.hh2, (x) => SE(x, 2) + '・' + SE(band.h2h4, 2)),
    r('質量の作り方: G 6.67430(m = GM/G で作り直し)− G 6.674', M.g2018.diff, (x) => SE(x, 1)),
    r(`質量の作り方: GM の公表の幅 ${F(C.gm.sigmaPub, 2)} km³/s² に当たる P(formal ${F(C.gm.sigmaFormal, 2)} では ${SG(C.gm.pPerSigmaFormal, 2)} s)`, C.gm.pPerSigmaPub, (x) => SG(x, 2)),
    r(`質量の作り方: 走行の差を埋める GM の差 ${SG(C.gm.dNeed, 5)} km³/s²(公表の幅の ${F(C.gm.dNeedPerPub, 3)} 倍・formal の ${F(C.gm.dNeedPerFormal, 3)} 倍)に当たる P`, -C.dK, (x) => SG(x, 5)),
    r('二次元の近似: 三次元の写し(z = 0)− 二次元', T.three.diff, (x) => SE(x, 1)),
    r(`太陽の潮汐の桁(等価の質点 —— ${J.tideDecl.DsunAu[0]} au・面の内 / 法線の向き)`, T.effect.plane30, (x) => SE(x, 2) + ' / ' + SE(T.effect.normal30, 2)),
    r(`太陽の潮汐の桁(${J.tideDecl.DsunAu[1]} au —— D⁻³ で換算・面の内 / 法線の向き)`, T.effect.plane50, (x) => SE(x, 2) + ' / ' + SE(T.effect.normal50, 2)),
    r(`観察者の時計(記録だけ): 2ψ☉P(太陽だけ・1 au)/ 太陽 + 地表(時刻系 ${K.timeSystem})`, K.shiftSunOnly, (x) => SG(x, 5) + ' / ' + SG(K.shiftSunEarth, 5)),
    r(`引きずり ON(本の W_bg ${J.on.Wbg})− 標的`, J.on.d, (x) => SE(x, 2))];
}
/** 表 3: 宣言を直す案の確かめ(引きずり OFF の写し) */
export function fixRows(J) {
  const A = J.fix.A, B = J.fix.B, sig = J.obs.sigma;
  const r = (label, z) => `| ${label} | ${F(z.M1, 5)} | ${SG(z.residual, 5)} | ${SE(z.h2gap, 2)} | ${F((Math.abs(z.residual) + z.h2gap) / sig, 2)} | ${z.withinSigma ? '内' : '外'} |`;
  return [r(`(A) a を二体ケプラーの a ${F(A.aKm, 3)} km(${SG(A.daKm, 3)} km —— 本の GM と標的の P から)`, A),
    r(`(B) GM を ${F(B.gmKm, 4)} km³/s²(${SG(B.dGm, 4)} —— 質量と速度を合わせて —— a はそのまま)`, B)];
}
export async function main() {
  const OUT = process.env.W305E_OUT || path.join(ROOT, 'tests', 'out', 'charonaudit-w305e.json');
  const PARTS = String(process.env.W305E_PARTS || PARTS_ALL.join(',')).split(',').filter((x) => PARTS_ALL.includes(x));
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const PIN305 = pinDecl305(null, [PLU_ID]);   // 第306便e: 第305便の宣言(引きずり ON・初期の距離 19595.764 km)へ器の中だけで戻す(第305便の html では no-op)
  const prev = (PARTS.length < PARTS_ALL.length && fs.existsSync(OUT)) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const log = (s) => console.log('  ' + s);
  const rec = recordsOf(ROOT), p = findPreset(HP, PLU_ID);
  const J = { meta: null, version: HARNESS_VERSION, obs: { value: rec.target.value, sigma: rec.target.sigma, recordId: rec.target.recordId, source: rec.target.source },
    book: { id: PLU_ID, emoji: p.emoji, Wbg: p.physics.relativeDrag.Wbg, softening: p.physics.softening, dt: DT, revMax: REV, scaleExp: p.scaleExp },
    records: Object.fromEntries(Object.entries(rec).map(([k, r]) => [k, { recordId: r.recordId, body: r.body, quantity: r.quantity, value: r.value, unit: r.unit, sigma: r.sigma }])),
    const: CONST, tideDecl: TIDE };
  const closed = (PARTS.includes('closed') || PARTS.includes('mass') || PARTS.includes('fix')) ? stageClosed(HP, rec) : prev.closed;
  const stages = { closed: () => closed, soft: () => stageSoft(HP, rec, log), window: () => stageWindow(HP, rec, log), band: () => stageBand(HP, rec, log),
    mass: () => stageMass(HP, rec, closed, log), tide: () => stageTide(HP, rec, log), clock: () => stageClock(rec), fix: () => stageFix(HP, rec, closed, log) };
  if (PIN305.pinned) J.decl305Pin = { changed: PIN305.changed, note: '第306便e: 🟪 の宣言(案 (A) —— 初期の距離・引きずり OFF)が第305便から動いた世代 —— この器は第305便の宣言の写し(tests/lib-w306e-pre.mjs の pin305)で測った' };
  J.partsRun = [];
  for (const k of PARTS_ALL) {
    if (PARTS.includes(k)) { console.log(`段 ${k}`); const t = Date.now(); J[k] = await stages[k](); J.partsRun.push(k); console.log(`  (${((Date.now() - t) / 1000).toFixed(1)} s)`); }
    else if (prev[k]) J[k] = prev[k];
  }
  J.on = PARTS.includes('window') ? stageOn(HP, rec, log) : prev.on;
  J.breakdown = breakdownOf(J);
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean) && PARTS_ALL.every((k) => !!J[k]);
  J.notClaim = ['「カロンの周期が観測どおりになった」', '「引きずりが要らないことを示した」', '「観測と一致した」', '「時計の換算で合った」'];
  const CODE = ['tests/exp-w305e-charonaudit.mjs', 'tests/lib-w306e-pre.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  J.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第305便e', target: TARGET, code: CODE, inputs: [TARGET, CSV_FILE, DECL305_DATA_FILE] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '決断事項 AN318(🟪 の基線の監査)・AN333(観測の時間標準の記録)—— 第95報・AN332 の裁定(α = c_loc/c₀)', reading: '統括の検証項目 R203' });
  J.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(J.meta, W281A_SCOPE, w281aStableInputs(ROOT, J.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(J, null, 1) + '\n');
  console.log(`門: ${JSON.stringify(J.gates)} → ${path.relative(ROOT, OUT)}(${J.elapsedS.toFixed(0)} s)`);
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

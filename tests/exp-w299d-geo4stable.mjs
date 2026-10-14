// 第299便d(原仮定者の裁定(第89報)③「geoPN=4 の検証が安定したら、physics.spaceMesh サンプルの移行を進める。現状の chainDiskToy 系は、初期配置が集まりすぎている」・
// DECISIONS v58 の AN278・AN285・統括の検証項目 R173)—— **geoPN=4 の安定の条件の器**(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// エンジン本体を走らせる。1 プロセス)。
//
// ■ 何をするか(条件は先に宣言して測る —— STABLE_CONDITIONS。閾値は器の定数で、測った後に動かさない)
//   ① 配置: 🔗🔩🪛 の配置(中心 1+円盤 80 —— 乱数種 20261008)の統計と、広げた配置(tests/lib-w299d-spread.mjs —— 面積一様の環 18〜72 に黄金角)の統計。
//      html の新本 🍥 chainSpreadToy3d の bodies が生成器の出力と一致すること。
//   ② 安定の条件(本 A = 近似初速の種 "radial"・対照 B = 零初速 —— 本の A/B の B 側と同じ):
//      layout(重なり・最短距離・内縁)/ solver(残差・未収束・NaN・履歴)/ resume(チェックポイント・複製・A/B の appStepFn)/ budget(角運動量と移送の帳簿・
//      運動量)/ step(h と h/2)/ count(n=40/80/160 —— 円盤の総質量を保つ)/ seed(散布の種 0〜3)/ display(受動プローブの非干渉)。
//   ③ 帯(内 18–36・中 36–54・外 54–72)の診断(🔗 と同じ流儀): t=0 直後(履歴のある最初の步)の接線 u(連鎖の解)と直接の項 s/(1+deg)・2000 步の Δθ
//      (全体と移送の分 Δθ_u = Σ u_t dt / r)・Δr・面外の |z|・受動プローブの循環(面 Z=0 の円 r=27/45/63)。
//   ④ 移行(②の条件を全部満たしたときだけ): 旧 physics.spaceMesh の 🔁 mercuryGeoToy3(☄️ の写しに vMinusU の一様な u=V —— 座標の変更の零試験)を、
//      別 id の写し 🔂 mercuryMeshMigrate3d(三次元・geoPN=4・慣性決定力 —— 🟫 mercurySunInertialFit の宣言 gain を移した値・軌道面を 30° 傾けた三次元)へ。
//      旧本は 1 字も変えない(互換のまま・退役にしない)。何を変えたら何が動いたかを段ごとに: 旧法則の零試験 → 源集合(天体)・有限核(ε)・連立解の
//      三次元の慣性決定力(平面 = 二次元の 🟫 とビット同一)→ 軌道面の傾き(座標の回転)→ 一様な速度(中心を固定しない写しで V=(2.3,0,0))。
//
// ■ しないこと・言わないこと
//   ・🔗🔩🪛 を書き換えない(零試験がその配置に結びついている)。gain を渦を見せるために補償しない(宣言値 8 のまま)。
//   ・自己重力を含まない初速を平衡と呼ばない —— "radial" は t=0 の動径力の釣り合いの近似の種で、接線の力の残りは打ち消していない(平衡とは呼ばない)。
//   ・円盤・銀河の形成・平坦な回転曲線とは書かない。移行した本で 43″/世紀 を導いたとは書かない(gain は 🟫 のフィット値を移した宣言値)。
//
// 実行: node tests/exp-w299d-geo4stable.mjs → 正本 tests/out/geo4stable-w299d.json(W299D_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fitPeri } from './lib-w280b-emgrid.mjs';
import * as SP from './lib-w299d-spread.mjs';
import * as SPA from './lib-w301b-approxmany.mjs';   // 第301便b: 近似多粒子の天体型(html の受理器が physics.approxMany を持つ世代だけ —— 旧世代は従来の形)
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
const REGEN_SCOPE = {"presets":["chainDiskToy3d","chainSpreadToy3d","mercuryGeoToy3","mercuryMeshMigrate3d","mercurySunInertialFit"],"roots":["DT","HP.REL_DRAG_SOLVER_TOL_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragProbeAt","HP.inertialDragProbeReady","HP.inertialDragProbeSample","HP.inertialDragProbeStreamlines","HP.inertialDragState","HP.loadPreset","HP.presetSig","HP.sim","HP.stepCarryFrame","HP.validateApproxMany","HP.validatePreset","T","ab","abStart","abStop","appStepFn","ch","ckRestoreOne","ckSnapOne","cloneSimState","ctx","currentPreset","cw","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w299d-geo4stable-1';
export const BOOK_BASE = 'chainDiskToy3d';          // 🔩(粒子数・質量・半径・G・gain・ε・solver の出どころ)
export const BOOK_SPREAD = 'chainSpreadToy3d';      // 🍥(新本)
export const BOOK_LEGACY = 'mercuryGeoToy3';        // 🔁(旧 physics.spaceMesh —— 1 字も変えない)
export const BOOK_GAIN = 'mercurySunInertialFit';   // 🟫(gain の出どころ・二次元)
export const BOOK_MIG = 'mercuryMeshMigrate3d';     // 🔂(移行の写しの候補の id —— 安定の条件を全部満たしたときだけ html に足す)
export const SRC_AXIS = '宣言(第299便d の原理の本 —— 観測ではない)';
export const SPREAD_TILT = Object.freeze({ tiltDeg: 30, azimuthDeg: 0 });
export const MIG_TILT_DEG = 30;                     // 🔂 の軌道面の傾き(x 軸まわりの回転 —— 太陽の軸も同じ回転で傾ける)
export const MIG_BOOST = Object.freeze([2.3, 0, 0]);  // 🔁 の一様な u=V と同じ値(診断値)
export const DT = 0.016, STEPS = 2000;
export const BANDS = Object.freeze([[18, 36], [36, 54], [54, 72.5]]);
export const CIRC_R = Object.freeze([27, 45, 63]);
export const SEED_PROBE_EPS = 6;   // 種の依存の探索の記録だけ(本の ε=1 は変えない)
// ── 安定の条件(宣言 —— 測る前に決めた閾値。器の版を上げずに動かさない)──
export const STABLE_CONDITIONS = Object.freeze([
  { key: 'layout', ja: '配置: 宣言半径の重なり 0(粒子どうし・中心と粒子)・最短の粒子間距離 ≥ 4 R_p・内縁 ≥ 3 R_C', thr: { dMinOverRp: 4, rInOverRC: 3 } },
  { key: 'solver', ja: '連鎖解: 2000 步で元の式の相対残差の最大 ≤ 解法の門・未収束 0・NaN 0・履歴なしの步 ≤ 1・一致点の拒否 0(本 A と対照 B)', thr: { res: 1e-10 } },
  { key: 'resume', ja: '停止と再開: チェックポイント(1000 步で保存 → 100 步 → 復帰 → 1000 步)と複製(cloneSimState)が通しの 2000 步とビット同一・A/B(appStepFn と stepCarryFrame)で両側 2000 步・停止 0・各側が単独の走行とビット同一', thr: {} },
  { key: 'budget', ja: '三次元の収支: |ΔL − 移送の帳簿 dL3| / |L₀| ≤ 1e-10(本・中心は固定)・|ΔP| / Σ|m v| ≤ 1e-12(中心を固定しない写し)', thr: { L: 1e-10, P: 1e-12 } },
  { key: 'step', ja: '刻みの依存: h と h/2(同じ時刻 32)で帯ごとの平均 Δθ と Δθ_u の差 ≤ 1%(帯の最大の大きさで割る)', thr: { rel: 0.01 } },
  { key: 'count', ja: '粒子数の依存: 円盤の総質量 400 を保って n=40/80/160 —— 帯ごとの平均 Δθ_u の n=160 と n=80 の差 ≤ 20%(帯の最大の大きさで割る)', thr: { rel: 0.2 } },
  { key: 'seed', ja: '配置の依存: 散布の種 0〜3(n=80・各種の配置も layout の条件を満たす)の帯ごとの平均 Δθ_u の幅(最大−最小)≤ 20%(帯の最大の大きさで割る)', thr: { rel: 0.2 } },
  { key: 'display', ja: '表示の非干渉: 10 步ごとに受動プローブ(格子・流線・点)を引いても 600 步の状態の指紋が引かない走行と同じ', thr: {} },
]);
export const MIG_CONDITIONS = Object.freeze([
  { key: 'planar', ja: '平面の三次元の写し(傾き 0)の近点率 = 二次元の 🟫(gain 同じ)とビット同一(gain 0 の対照も)', thr: {} },
  { key: 'tilt', ja: '軌道面を 30° 傾けた写しと平面の写しの近点率の差(gain 0 との差)≤ 🟫 の照合許容 0.0009″/世紀', thr: { arcsec: 0.0009 } },
  { key: 'boost', ja: '一様な速度 V=(2.3,0,0)(中心を固定しない写し)で近点率の差(gain 0 との差)の変化 ≤ 0.0009″/世紀', thr: { arcsec: 0.0009 } },
  { key: 'rate', ja: '本(三次元・傾き 30°)の gain 0 との差の |値 − 43| + |h − h/2| ≤ 0.0009″/世紀(🟫 の門と同じ形 —— 合わせ直さない)', thr: { arcsec: 0.0009, obs: 43 } },
]);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const sci = (v) => (Number.isFinite(v) ? Number(v.toPrecision(6)) : v);
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);

/* ── 状態の指紋(数値・真偽値の欄と型付き配列の全部・表示のキャッシュ _sm・_sl・_sg・_gal で始まる鍵は除く —— 第298便c の器と同じ流儀)── */
export function fingerprint(S) {
  let h1 = 0x811c9dc5, h2 = 0x01000193; const f64 = new Float64Array(1), u8 = new Uint8Array(f64.buffer);
  const mix = (b) => { h1 = Math.imul(h1 ^ b, 16777619) >>> 0; h2 = Math.imul(h2 ^ b, 2246822519) >>> 0; };
  const num = (v) => { f64[0] = v; for (let k = 0; k < 8; k++) mix(u8[k]); };
  const str = (s) => { for (let k = 0; k < s.length; k++) mix(s.charCodeAt(k) & 255); };
  let nKeys = 0;
  for (const k of Object.keys(S).sort()) {
    if (/^_s[mlg]|^_gal/.test(k)) continue;
    const v = S[k];
    if (typeof v === 'number') { str(k); num(v); nKeys++; }
    else if (typeof v === 'boolean') { str(k); mix(v ? 1 : 0); nKeys++; }
    else if (ArrayBuffer.isView(v) && !(v instanceof DataView)) { str(k); for (let i = 0; i < v.length; i++) num(Number(v[i])); nKeys++; }
  }
  str(JSON.stringify(S.params));
  return h1.toString(16) + h2.toString(16) + ':' + nKeys;
}
/** 位置・速度・自転・姿勢・時刻だけの指紋(複製・チェックポイントの照合 —— 作業配列の確保の差を見ない) */
export function stateFp(S) {
  let h = 0x811c9dc5; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA', 'sax', 'say', 'saz']) { const A = S[k]; if (!A) continue; for (let i = 0; i < S.n; i++) { f[0] = A[i]; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0; } }
  f[0] = S.t; for (let j = 0; j < 8; j++) h = Math.imul(h ^ u8[j], 16777619) >>> 0;
  return h.toString(16);
}

/* ── 🍥 の宣言(🔩 の写し + 広げた配置 + 中心の軸 30°)—— html の本と同じであるべき形(QA preset.chainSpread299 が照合する)── */
export function spreadPreset(HP, o = {}) {
  const q = clone(find(HP, BOOK_BASE));
  for (const k of ['id', 'emoji', 'abBody']) delete q[k];
  const vel = o.vel || 'radial', sp = Object.assign({}, o.spread || {});
  const axis = o.axis === undefined ? { enable: true, tiltDeg: SPREAD_TILT.tiltDeg, azimuthDeg: SPREAD_TILT.azimuthDeg, source: SRC_AXIS } : o.axis;
  q.bodies = SP.spreadBodies(sp, vel, axis ? { spinAxis: axis } : {});
  // 第301便b(原仮定者の裁定(第91報)③・R180): 近似多粒子の天体型(粒子に自転のトイの宣言値・軸 +z・明示半径 √m —— 天体だけの宣言は接触を切るだけで、
  //   本の contactMode:"none" と合わせて力学は宣言の鍵の有無に依らない)。中心を固定しない写し(unpin —— 収支の運動量の検査)は governor の pinned:true の
  //   契約を満たさないので approxMany の鍵だけを外す(粒子の自転・軸・半径は残す —— 同じ力学)
  if (SPA.approxOn(HP, o)) { SPA.spreadApprox(q, { kind: o.kind }); if (o.unpin) delete q.physics.approxMany; }
  if (o.unpin) q.bodies[0].pinned = false;
  if (o.spin0) q.bodies[0].spin = 0;
  return q;
}
/** 本の A/B の B 側(零初速 —— abBody の targets 1..n・patch {vx:0, vy:0})と同じ形 */
export const spreadAbBody = (n) => ({ label: { ja: '零初速の対照(円盤の初速を 0 —— 近似初速の種を外す)', en: 'zero-velocity control (disc velocities set to 0 - the approximate-velocity seed removed)' },
  targets: Array.from({ length: n }, (_, k) => k + 1), patch: { vx: 0, vy: 0 } });
function simOf(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}

/* ───────── ① 配置 ───────── */
function partLayout(HP) {
  const base = simOf(HP, (() => { const p = clone(find(HP, BOOK_BASE)); delete p.id; return p; })());
  const R = base.R, n = base.n;
  let dmin = Infinity, ov = 0, ovC = 0; const rc = [];
  for (let i = 1; i < n; i++) { const d0 = Math.hypot(base.x[i] - base.x[0], base.y[i] - base.y[0]); rc.push(d0); if (d0 < R[0] + R[i]) ovC++;
    for (let j = i + 1; j < n; j++) { const d = Math.hypot(base.x[i] - base.x[j], base.y[i] - base.y[j], base.z[i] - base.z[j]); dmin = Math.min(dmin, d); if (d < R[i] + R[j]) ov++; } }
  rc.sort((a, b) => a - b);
  const pts = SP.spreadXY(SP.SPREAD_DEFAULT), st = SP.layoutStats(pts), vr = SP.spreadVel(pts, 'radial');
  const S = simOf(HP, spreadPreset(HP));
  // build の後の宣言半径(アプリの R)で数え直す
  let dmin2 = Infinity, ov2 = 0, ovC2 = 0;
  for (let i = 1; i < S.n; i++) { if (Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0], S.z[i] - S.z[0]) < S.R[0] + S.R[i]) ovC2++;
    for (let j = i + 1; j < S.n; j++) { const d = Math.hypot(S.x[i] - S.x[j], S.y[i] - S.y[j], S.z[i] - S.z[j]); dmin2 = Math.min(dmin2, d); if (d < S.R[i] + S.R[j]) ov2++; } }
  // 円盤の総質量・中心との比・中心の位置(build で動かない)
  let mDisk = 0; for (let i = 1; i < S.n; i++) mDisk += S.m[i];
  const book = find(HP, BOOK_SPREAD);
  const gen = spreadPreset(HP);
  const htmlSame = !!book && JSON.stringify(book.bodies) === JSON.stringify(gen.bodies) && JSON.stringify(book.physics) === JSON.stringify(gen.physics);
  return {
    chainDisk: { n: n - 1, rcMin: sci(rc[0]), rcMed: sci(rc[(rc.length - 1) >> 1]), rcMax: sci(rc[rc.length - 1]), dMin: sci(dmin), overlapPairs: ov, overlapCentre: ovC, Rp: sci(R[1]), RC: R[0] },
    spread: { version: SP.SPREAD_VERSION, rIn: SP.SPREAD_DEFAULT.rIn, rOut: SP.SPREAD_DEFAULT.rOut, n: st.n, rcMin: sci(st.rcMin), rcMed: sci(st.rcMed), rcMax: sci(st.rcMax),
      dMin: sci(dmin2), overlapPairs: ov2, overlapCentre: ovC2, Rp: sci(S.R[1]), RC: S.R[0], mDisk, mCentre: S.m[0], centreAt: [S.x[0], S.y[0], S.z[0]],
      seedRadialNonPos: vr.nNonPos, seedTanOverRadialMax: sci(vr.tanRatioMax) },
    htmlBook: !!book, htmlSame,
    ...(gen.physics.approxMany ? { approxMany: gen.physics.approxMany, bodySpin: gen.bodies[1].spin, bodyRadius: gen.bodies[1].radius } : null),   // 第301便b: 測った宣言の近似多粒子の契約(宣言した世代だけ)
  };
}

/* ── 走行と帯の診断 ── */
function bandIndex(r) { return BANDS.findIndex((b) => r >= b[0] && r < b[1]); }
export function runBands(HP, preset, o = {}) {
  const dt = o.dt || DT, steps = o.steps || STEPS;
  const S = simOf(HP, preset), n = S.n;
  const r0 = [], th = [], acc = new Float64Array(n), accU = new Float64Array(n), band = [];
  for (let i = 0; i < n; i++) { r0.push(Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0])); th.push(Math.atan2(S.y[i] - S.y[0], S.x[i] - S.x[0])); band.push(i === 0 ? -1 : bandIndex(r0[i])); }
  let early = null;
  const t0 = Date.now();
  for (let k = 1; k <= steps; k++) {
    S.step(dt);
    for (let i = 1; i < n; i++) {
      const dx = S.x[i] - S.x[0], dy = S.y[i] - S.y[0], t = Math.atan2(dy, dx); let d = t - th[i]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc[i] += d; th[i] = t;
      const r2 = dx * dx + dy * dy; if (S._rdUX) accU[i] += (-S._rdUX[i] * dy + S._rdUY[i] * dx) / r2 * dt;
    }
    if (k === 2 && S._rdUX && S._rdSX) {   // 履歴のある最初の步: 接線 u(連鎖の解)と直接の項 s/(1+deg)
      early = BANDS.map(() => ({ n: 0, ut: 0, direct: 0 }));
      for (let i = 1; i < n; i++) { const b = band[i]; if (b < 0) continue; const dx = S.x[i] - S.x[0], dy = S.y[i] - S.y[0], r = Math.hypot(dx, dy), tx = -dy / r, ty = dx / r;
        early[b].n++; early[b].ut += S._rdUX[i] * tx + S._rdUY[i] * ty; early[b].direct += (S._rdSX[i] * tx + S._rdSY[i] * ty) / (1 + S._rdDeg[i]); }
      early = early.map((e) => ({ n: e.n, uT: sci(e.ut / e.n), directT: sci(e.direct / e.n), ratio: sci(e.ut / e.direct) }));
    }
    if (o.onStep) o.onStep(S, k);
  }
  const bands = BANDS.map((b) => ({ band: b, n: 0, dth: 0, dthU: 0, dr: 0 }));
  let zMax = 0;
  for (let i = 1; i < n; i++) { const b = band[i]; zMax = Math.max(zMax, Math.abs(S.z[i])); if (b < 0) continue;
    bands[b].n++; bands[b].dth += acc[i]; bands[b].dthU += accU[i]; bands[b].dr += Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]) - r0[i]; }
  for (const b of bands) { b.dth = b.dth / b.n; b.dthU = b.dthU / b.n; b.dr = b.dr / b.n; }
  const st = HP.inertialDragState(S), ch = (st && st.compose && st.compose.chain) || {};
  return { S, wallSec: (Date.now() - t0) / 1000, steps, dt, bands, early, zMax,
    solver: { method: st.compose.method, itersMax: ch.itersMax === undefined ? null : ch.itersMax, resMax: st.compose.resMax, fail: ch.fail || 0, restarts: ch.restarts || 0,
      noHistory: st.noHistory, reject: st.reject, nan: S.hasNaN(), spinTerms: st.spin3 ? st.spin3.rot.terms : null, rotMax: st.spin3 ? st.spin3.rot.max : null } };
}
const bandsOut = (r) => r.bands.map((b) => ({ band: b.band, n: b.n, dth: sci(b.dth), dthU: sci(b.dthU), dr: sci(b.dr) }));
function relBand(a, b, key) {   // 帯ごとの差 / 帯の最大の大きさ(参照 a)
  const sc = Math.max(...a.map((z) => Math.abs(z[key])));
  return Math.max(...a.map((z, k) => Math.abs(z[key] - b[k][key]))) / sc;
}
function circ(HP, S, r) {
  let G = 0; const N = 256;
  for (let k = 0; k < N; k++) { const t = 2 * Math.PI * (k + 0.5) / N, x = S.x[0] + r * Math.cos(t), y = S.y[0] + r * Math.sin(t);
    const u = HP.inertialDragProbeAt(S, x, y, 0, { frame: 'coordinate' }).u; G += (u[0] * -Math.sin(t) + u[1] * Math.cos(t)) * (2 * Math.PI * r / N); }
  return G;
}

/* ───────── ② 安定の条件・③ 帯の診断 ───────── */
function partStable(HP, E) {
  const out = { conditions: {} }, C = out.conditions;
  const thr = Object.fromEntries(STABLE_CONDITIONS.map((c) => [c.key, c.thr]));
  const solverTol = HP.REL_DRAG_SOLVER_TOL_DEFAULT;
  // A(近似初速の種)と B(零初速)の 2000 步
  const A = runBands(HP, spreadPreset(HP, { vel: 'radial' })), B = runBands(HP, spreadPreset(HP, { vel: 'zero' }));
  out.runs = {};
  for (const [k, r] of [['A', A], ['B', B]]) out.runs[k] = { wallSec: r.wallSec, bands: bandsOut(r), early: r.early, zMax: sci(r.zMax),
    solver: Object.assign({}, r.solver, { resMax: sci(r.solver.resMax), rotMax: sci(r.solver.rotMax) }),
    circulation: CIRC_R.map((rr) => ({ r: rr, G: sci(circ(HP, r.S, rr)) })) };
  // 自転 0 の対照(B の写しで中心の spin 0)の 2 步後の循環
  { const S0 = simOf(HP, spreadPreset(HP, { vel: 'zero', spin0: true })), S1 = simOf(HP, spreadPreset(HP, { vel: 'zero' }));
    S0.step(DT); S0.step(DT); S1.step(DT); S1.step(DT);
    out.circulationEarly = CIRC_R.map((rr) => ({ r: rr, withSpin: sci(circ(HP, S1, rr)), spin0: sci(circ(HP, S0, rr)) })); }
  // layout
  const L = partLayout(HP), sp = L.spread;
  C.layout = { pass: sp.overlapPairs === 0 && sp.overlapCentre === 0 && sp.dMin >= thr.layout.dMinOverRp * sp.Rp && sp.rIn >= thr.layout.rInOverRC * sp.RC,
    value: { overlapPairs: sp.overlapPairs, overlapCentre: sp.overlapCentre, dMinOverRp: sci(sp.dMin / sp.Rp), rInOverRC: sci(sp.rIn / sp.RC) } };
  // solver
  const solv = (r) => r.solver.resMax <= solverTol && r.solver.fail === 0 && !r.solver.nan && r.solver.noHistory <= 1 && r.solver.reject === 0;
  C.solver = { pass: solv(A) && solv(B) && solverTol === thr.solver.res,
    value: { tol: solverTol, A: { resMax: sci(A.solver.resMax), itersMax: A.solver.itersMax, fail: A.solver.fail, noHistory: A.solver.noHistory }, B: { resMax: sci(B.solver.resMax), itersMax: B.solver.itersMax, fail: B.solver.fail, noHistory: B.solver.noHistory } } };
  // resume: チェックポイント・複製・A/B
  {
    const pA = spreadPreset(HP, { vel: 'radial' }), v = HP.validatePreset(clone(pA));
    const ref = simOf(HP, pA); for (let k = 0; k < STEPS; k++) ref.step(DT);
    const fpRef = stateFp(ref);
    // チェックポイント(新しく組んだ sim)
    const ck = E('ckSnapOne'), rs = E('ckRestoreOne');
    const S = simOf(HP, pA); for (let k = 0; k < 1000; k++) S.step(DT);
    const o = ck(S); const fpSave = stateFp(S);
    for (let k = 0; k < 100; k++) S.step(DT);
    const moved = stateFp(S) !== fpSave; rs(S, o); const back = stateFp(S) === fpSave;
    for (let k = 0; k < 1000; k++) S.step(DT);
    const ckSame = stateFp(S) === fpRef;
    // 複製(アプリの cloneSimState —— 内蔵の sim に宣言を読ませて)
    E('globalThis.__w299dP=' + JSON.stringify(v.preset) + '; currentPreset=JSON.parse(JSON.stringify(__w299dP)); sim.build(JSON.parse(JSON.stringify(__w299dP)));');
    const G = E('sim'); for (let k = 0; k < 1000; k++) G.step(DT);
    const Cl = E('cloneSimState')();
    for (let k = 0; k < 1000; k++) { G.step(DT); Cl.step(DT); }
    const clSame = stateFp(G) === fpRef && stateFp(Cl) === fpRef;
    // A/B(appStepFn + stepCarryFrame —— 1 フレーム 5 步 × 400)
    const pB = clone(pA); pB.bodies.forEach((b, i) => { if (i > 0) { b.vx = 0; b.vy = 0; } });
    const refB = simOf(HP, pB); for (let k = 0; k < STEPS; k++) refB.step(DT);
    const SA = simOf(HP, pA), SB = simOf(HP, pB), SF = E('appStepFn'), CF = HP.stepCarryFrame;
    let t = 0; const clk = () => (t += 0.001); let kRun = 0, halts = 0;
    for (let f = 0; f < STEPS / 5; f++) { const fr = CF(5, 0, true, 1, Infinity, clk, SF(SA, SB, DT, false)); kRun += fr.kRun; if (fr.halt) halts++; }
    const abSame = SA.t === SB.t && stateFp(SA) === fpRef && stateFp(SB) === stateFp(refB);
    // アプリの A/B(内蔵の本があるとき): B 側の初期状態が零初速の写しと同じ
    let appAb = null;
    if (find(HP, BOOK_SPREAD)) {
      HP.loadPreset(BOOK_SPREAD, false);
      E('abStart(undefined, undefined, {targets:currentPreset.abBody.targets, patch:currentPreset.abBody.patch, physicsPatch:currentPreset.abBody.physicsPatch||null})');   // ワンタップ対照のボタンと同じ呼び方
      const sb = E('ab && ab.simB'), b0 = simOf(HP, pB);
      const same0 = !!sb && stateFp(sb) === stateFp(b0);
      if (sb) for (let k = 0; k < 200; k++) { sb.step(DT); b0.step(DT); }
      appAb = { ready: !!sb, same: same0, same200: !!sb && stateFp(sb) === stateFp(b0) };
      E("typeof abStop==='function' && abStop()");
    }
    C.resume = { pass: moved && back && ckSame && clSame && kRun === STEPS && halts === 0 && abSame && (appAb === null || (appAb.same && appAb.same200)),
      value: { checkpoint: { moved, restored: back, same2000: ckSame }, clone: clSame, ab: { kRun, halts, tEqual: SA.t === SB.t, sideSame: abSame }, appAb } };
  }
  // budget: 角運動量(本・中心は固定 —— 中心のまわり)と運動量(中心を固定しない写し)
  {
    const Lof = (S) => { const c = [S.x[0], S.y[0], S.z[0]]; let Lx = 0, Ly = 0, Lz = 0;
      for (let i = 0; i < S.n; i++) { const x = S.x[i] - c[0], y = S.y[i] - c[1], z = S.z[i] - c[2], m = S.m[i];
        Lx += m * (y * S.vz[i] - z * S.vy[i]); Ly += m * (z * S.vx[i] - x * S.vz[i]); Lz += m * (x * S.vy[i] - y * S.vx[i]);
        const Js = 0.5 * m * S.R[i] * S.R[i] * S.spin[i]; Lx += Js * S.sax[i]; Ly += Js * S.say[i]; Lz += Js * S.saz[i]; }
      return [Lx, Ly, Lz]; };
    const S = simOf(HP, spreadPreset(HP, { vel: 'radial' })), L0 = Lof(S), Ls = Math.hypot(...L0);
    let maxL = 0;
    for (let k = 1; k <= STEPS; k++) { S.step(DT); if (k % 50) continue;
      const st = HP.inertialDragState(S).spin3, Lk = Lof(S); const led = [0, 1, 2].map((q) => st.dL3[q] + st.axial.dLspin[q]);
      maxL = Math.max(maxL, Math.hypot(...[0, 1, 2].map((q) => Lk[q] - L0[q] - led[q]))); }
    const dL3 = HP.inertialDragState(S).spin3.dL3;
    const U = simOf(HP, spreadPreset(HP, { vel: 'radial', unpin: true }));
    const T0 = HP.coord3d.totals(U), P0 = T0.P;
    let Ps = 0; for (let i = 0; i < U.n; i++) Ps += U.m[i] * Math.hypot(U.vx[i], U.vy[i], U.vz[i]);
    let maxP = 0, E0 = T0.E;
    for (let k = 1; k <= STEPS; k++) { U.step(DT); if (k % 50) continue; const T = HP.coord3d.totals(U); maxP = Math.max(maxP, Math.hypot(T.P[0] - P0[0], T.P[1] - P0[1], T.P[2] - P0[2]) / Ps); }
    const TE = HP.coord3d.totals(U), work = HP.inertialDragState(U).work;
    C.budget = { pass: maxL / Ls <= thr.budget.L && maxP <= thr.budget.P,
      value: { relLresid: sci(maxL / Ls), Lscale: sci(Ls), dL3: dL3.map(sci), relP: sci(maxP), Pscale: sci(Ps), energy: { dE: sci(TE.E - E0), work: sci(work), resid: sci(TE.E - E0 - work), relResid: sci((TE.E - E0 - work) / Math.abs(T0.U)) } } };
  }
  // step: h と h/2
  {
    const A2 = runBands(HP, spreadPreset(HP, { vel: 'radial' }), { dt: DT / 2, steps: 2 * STEPS }), B2 = runBands(HP, spreadPreset(HP, { vel: 'zero' }), { dt: DT / 2, steps: 2 * STEPS });
    const rA = Math.max(relBand(A.bands, A2.bands, 'dth'), relBand(A.bands, A2.bands, 'dthU')), rB = Math.max(relBand(B.bands, B2.bands, 'dth'), relBand(B.bands, B2.bands, 'dthU'));
    C.step = { pass: rA <= thr.step.rel && rB <= thr.step.rel, value: { relA: sci(rA), relB: sci(rB), A_h2: bandsOut(A2), B_h2: bandsOut(B2), solverH2: { A: sci(A2.solver.resMax), B: sci(B2.solver.resMax), failA: A2.solver.fail, failB: B2.solver.fail } } };
  }
  // count: n=40/80/160(円盤の総質量 400)
  {
    const rows = {};
    for (const nn of [40, 80, 160]) { const m = 400 / nn;
      const a = nn === 80 ? A : runBands(HP, spreadPreset(HP, { vel: 'radial', spread: { n: nn, m } })), b = nn === 80 ? B : runBands(HP, spreadPreset(HP, { vel: 'zero', spread: { n: nn, m } }));
      rows[nn] = { m, A: bandsOut(a), B: bandsOut(b), A_early: a.early, B_early: b.early, itersMax: [a.solver.itersMax, b.solver.itersMax], resMax: [sci(a.solver.resMax), sci(b.solver.resMax)], fail: [a.solver.fail, b.solver.fail], timing: { A: { wallSec: a.wallSec }, B: { wallSec: b.wallSec } } }; }
    const rA = relBand(rows[80].A, rows[160].A, 'dthU'), rB = relBand(rows[80].B, rows[160].B, 'dthU');
    const rA40 = relBand(rows[80].A, rows[40].A, 'dthU'), rB40 = relBand(rows[80].B, rows[40].B, 'dthU');
    C.count = { pass: rA <= thr.count.rel && rB <= thr.count.rel, value: { rel160A: sci(rA), rel160B: sci(rB), rel40A: sci(rA40), rel40B: sci(rB40), rows } };
  }
  // seed: 種 0〜3
  {
    const rows = { 0: { A: bandsOut(A), B: bandsOut(B) } };
    let seedLayoutOk = true;
    for (const s of [1, 2, 3]) { const a = runBands(HP, spreadPreset(HP, { vel: 'radial', spread: { seed: s } })), b = runBands(HP, spreadPreset(HP, { vel: 'zero', spread: { seed: s } }));
      const st = SP.layoutStats(SP.spreadXY({ seed: s }));
      if (!(st.overlapPairs === 0 && st.dMin >= thr.layout.dMinOverRp * st.Rp)) seedLayoutOk = false;
      rows[s] = { A: bandsOut(a), B: bandsOut(b), dMin: sci(st.dMin), overlapPairs: st.overlapPairs, fail: [a.solver.fail, b.solver.fail] }; }
    // 記録(生成器 -1 の揺らぎ —— 最短距離の床を見ない。最初の測定はこれで、種の配置が layout の条件を割っていた)
    const v1 = {};
    for (const s of [1, 2, 3]) { const st = SP.layoutStats(SP.spreadXY({ seed: s, strict: false })); v1[s] = { dMin: sci(st.dMin), overlapPairs: st.overlapPairs, A: bandsOut(runBands(HP, spreadPreset(HP, { vel: 'radial', spread: { seed: s, strict: false } }))) }; }
    const spread = (key) => { const sc = Math.max(...rows[0][key].map((z) => Math.abs(z.dthU)));
      return Math.max(...BANDS.map((_, k) => { const v = [0, 1, 2, 3].map((s) => rows[s][key][k].dthU); return Math.max(...v) - Math.min(...v); })) / sc; };
    const rA = spread('A'), rB = spread('B');
    // 探索の記録(条件の判定には入れない —— 次の見直しのため): 核の軟化 ε を平均の間隔の半分 6 にした写しで A の種の幅
    const epsRows = {};
    for (const s of [0, 1, 2, 3]) { const q = spreadPreset(HP, { vel: 'radial', spread: { seed: s } }); q.physics.relativeDrag.eps = SEED_PROBE_EPS; epsRows[s] = bandsOut(runBands(HP, q)); }
    const epsSc = Math.max(...epsRows[0].map((z) => Math.abs(z.dthU)));
    const epsSpread = Math.max(...BANDS.map((_, k) => { const v = [0, 1, 2, 3].map((s) => epsRows[s][k].dthU); return Math.max(...v) - Math.min(...v); })) / epsSc;
    const v1Sc = Math.max(...rows[0].A.map((z) => Math.abs(z.dthU)));
    const v1Rel = Math.max(...BANDS.map((_, k) => { const v = [rows[0].A[k].dthU].concat([1, 2, 3].map((s) => v1[s].A[k].dthU)); return Math.max(...v) - Math.min(...v); })) / v1Sc;
    C.seed = { pass: seedLayoutOk && rA <= thr.seed.rel && rB <= thr.seed.rel, value: { relA: sci(rA), relB: sci(rB), seedLayoutOk, rows, generatorV1: { note: '生成器 w299d-spread-1(床なし)の種 1〜3 —— 配置が layout の条件を割る(重なり・最短距離)。最初の測定の記録で判定には入れない', relA: sci(v1Rel), rows: v1 }, probeEps: { eps: SEED_PROBE_EPS, relA: sci(epsSpread), rows: epsRows, note: '探索の記録 —— 条件の判定に入れない・本の ε は 1 のまま' } } };
  }
  // display: 受動プローブの非干渉(600 步)
  {
    const view = { mode: 'drag', cx: 0, cy: 0, hx: 80, hy: 80, res: 16, frame: 'centroid' };
    const P = spreadPreset(HP, { vel: 'radial' }), X = simOf(HP, P), Y = simOf(HP, P);
    let calls = 0, drawn = 0;
    for (let k = 1; k <= 600; k++) { X.step(DT); Y.step(DT);
      if (k % 10 === 0) { const D = HP.inertialDragProbeSample(Y, view); calls++; if (D && D.ux) { drawn++; HP.inertialDragProbeStreamlines(D, 12, 48); HP.inertialDragProbeAt(Y, 30, 20, 0.5, { frame: 'coordinate' }); } } }
    const ready = HP.inertialDragProbeReady(Y);
    C.display = { pass: fingerprint(X) === fingerprint(Y) && drawn > 0, value: { steps: 600, calls, drawn, same: fingerprint(X) === fingerprint(Y), probeReady: ready.ready, probeRel: sci(ready.relMax) } };
  }
  out.layout = L;
  out.allPass = STABLE_CONDITIONS.every((c) => C[c.key] && C[c.key].pass === true);
  out.table = STABLE_CONDITIONS.map((c) => ({ key: c.key, ja: c.ja, pass: C[c.key].pass }));
  return out;
}

/* ───────── ④ 移行(🔁 → 🔂)───────── */
/** 🔂 の宣言: 🟫 の physics・bodies の写し + coord 3d・geoPN 4 + 軌道面を x 軸まわりに 30° 傾ける(太陽の軸も同じ回転)。html の本と同じであるべき形 */
export function migPreset(HP, o = {}) {
  const q = clone(find(HP, BOOK_GAIN));
  for (const k of ['id', 'emoji', 'abBody', 'fitRecord', 'familyId', 'familyRole']) delete q[k];
  q.physics = Object.assign({ coord: '3d' }, q.physics, { geoPN: 4 });
  q.physics.relativeDrag = Object.assign({}, q.physics.relativeDrag, { solver: 'network-pcg-v1' });   // geoPN=4 の連鎖の解法の宣言(n=2 は直接法の展開形 —— 宣言は走る式を変えない)
  const tilt = o.tilt === undefined ? MIG_TILT_DEG : o.tilt, i = tilt * Math.PI / 180, ci = Math.cos(i), si = Math.sin(i);
  const rot = (x, y, z) => [x, y * ci - z * si, y * si + z * ci];
  q.bodies = q.bodies.map((b, k) => {
    const nb = Object.assign({}, b), r = rot(b.x, b.y, b.z || 0), v = rot(b.vx, b.vy, b.vz || 0);
    nb.x = r[0]; nb.y = r[1]; nb.vx = v[0]; nb.vy = v[1];
    if (r[2] !== 0) nb.z = r[2];
    if (v[2] !== 0) nb.vz = v[2];
    if (k === 0 && o.axis !== false) nb.spinAxis = { enable: true, tiltDeg: tilt, azimuthDeg: -90, source: SRC_AXIS };
    return nb;
  });
  if (o.gain !== undefined) W302A.rdSetGain(q.physics.relativeDrag, o.gain);
  if (o.unpin) q.bodies[0].pinned = false;
  if (o.boost) q.bodies.forEach((b) => { b.vx += o.boost[0]; b.vy += o.boost[1]; b.vz = (b.vz || 0) + o.boost[2]; });
  if (o.eps !== undefined) q.physics.relativeDrag.eps = o.eps;
  if (o.pairs) q.physics.relativeDrag.pairs = o.pairs;
  if (o.coord2d) { delete q.physics.coord; q.bodies.forEach((b) => { delete b.z; delete b.vz; delete b.spinAxis; }); }
  return q;
}
/** 近点の検出器 B(tests/exp-w295c-inertial3.mjs の runPair と同じ流儀)を三次元の軌道面(初期の r と v から ê₁・ê₂)で。平面では runPair と同じ角になる */
export function runPair3(HP, preset, o) {
  const { ci = 0, oi = 1, dt, revMax } = o;
  const S = simOf(HP, preset), zz = (A, i) => (A ? A[i] : 0);
  const R = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], zz(S.z, oi) - zz(S.z, ci)];
  const r0 = R(), v0 = [S.vx[oi] - S.vx[ci], S.vy[oi] - S.vy[ci], zz(S.vz, oi) - zz(S.vz, ci)], rn = Math.hypot(...r0), e1 = r0.map((q) => q / rn);
  const nn = [r0[1] * v0[2] - r0[2] * v0[1], r0[2] * v0[0] - r0[0] * v0[2], r0[0] * v0[1] - r0[1] * v0[0]], nl = Math.hypot(...nn), nh = nn.map((q) => q / nl);
  const e2 = [nh[1] * e1[2] - nh[2] * e1[1], nh[2] * e1[0] - nh[0] * e1[2], nh[0] * e1[1] - nh[1] * e1[0]];
  const ang = () => { const r = R(); return [Math.hypot(...r), Math.atan2(r[0] * e2[0] + r[1] * e2[1] + r[2] * e2[2], r[0] * e1[0] + r[1] * e1[1] + r[2] * e1[2])]; };
  const mu = S.params.G * (S.m[ci] + S.m[oi]), v2 = v0[0] ** 2 + v0[1] ** 2 + v0[2] ** 2, a0 = 1 / (2 / rn - v2 / mu), P0 = 2 * Math.PI * Math.sqrt(a0 ** 3 / mu);
  let th0 = ang()[1], angPrev = th0, angAcc = 0, r1 = rn, r2 = rn, th1 = th0, th2 = th0, rMin = Infinity, rMax = -Infinity, k = 0, zOff = 0;
  const B = [], rev = [];
  for (; ; k++) {
    S.step(dt);
    const [rr, th] = ang();
    if (!Number.isFinite(rr)) break;
    if (rev.length < revMax) { rMin = Math.min(rMin, rr); rMax = Math.max(rMax, rr); }
    const r = R(); zOff = Math.max(zOff, Math.abs(r[0] * nh[0] + r[1] * nh[1] + r[2] * nh[2]));
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const pa = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(pa) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI, fr = (tg - pa) / (angAcc - pa); rev.push((k - 1 + fr + 1) * dt); }
    if (k >= 2 && r1 < r2 && r1 < rr) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k + fr, r: r1 });
    }
    r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if (rev.length >= revMax) { k++; break; }
  }
  const fb = fitPeri(B.filter((p) => p.k * dt <= rev[revMax - 1]), rMin, rMax, P0, dt);
  return { steps: k, revN: rev.length, nan: S.hasNaN(), degPerOrbit: fb.slopeDegPerPeri, degPerTime: fb.slopeDegPerTime, nPeri: fb.nPeri, outOfPlane: zOff, fp: stateFp(S), S };
}
function partMigrate(HP) {
  const U = (() => { const p = find(HP, BOOK_GAIN); const T = Math.pow(10, p.scaleExp.T); return { century: 36525 * 86400 / T }; })();
  const arc = (r) => r.degPerTime * U.century * 3600;
  const W = { dt: DT, revMax: 8 };
  const run = (p, o = {}) => runPair3(HP, p, Object.assign({}, W, o));
  const out = { window: '8 公転・検出器 B(近点ごとの方位の直線 fit)を初期の軌道面の基底で・dt 0.016 と 0.008', conditions: {} };
  // 旧法則(🔁 そのまま)と B 側(geoPN=2・λ_PN=0 —— 旧メッシュの宣言を外したニュートンの二体)
  const leg = clone(find(HP, BOOK_LEGACY)); delete leg.id;
  const legB = clone(leg); legB.physics.geoPN = 2; legB.physics.lambdaPN = 0; for (const k of ['spaceMesh', 'meshVelocity', 'backgroundComplex']) delete legB.physics[k];
  const l1 = run(leg), l0 = run(legB), l1h = run(leg, { dt: DT / 2 }), l0h = run(legB, { dt: DT / 2 });
  out.legacy = { law: 'legacy-spaceMesh:vMinusU(一様な u=V・mutual 0・pn off)', dDegPerOrbit: sci(l1.degPerOrbit - l0.degPerOrbit), dDegPerOrbitH2: sci(l1h.degPerOrbit - l0h.degPerOrbit),
    dArcsecCentury: sci(arc(l1) - arc(l0)), newtonDegPerOrbit: sci(l0.degPerOrbit), steps: l1.steps };
  // 二次元の 🟫(geoPN 3)・平面の三次元の写し(傾き 0)・本(傾き 30°)—— gain と gain 0
  const g2 = clone(find(HP, BOOK_GAIN)); delete g2.id; delete g2.fitRecord; const g2z = clone(g2); W302A.rdSetGain(g2z.physics.relativeDrag, 0);
  const r2 = run(g2), r2z = run(g2z);
  const p0 = run(migPreset(HP, { tilt: 0 })), p0z = run(migPreset(HP, { tilt: 0, gain: 0 }));
  const t1 = run(migPreset(HP)), t1z = run(migPreset(HP, { gain: 0 })), t1h = run(migPreset(HP), { dt: DT / 2 }), t1hz = run(migPreset(HP, { gain: 0 }), { dt: DT / 2 });
  const noAx = run(migPreset(HP, { axis: false }));
  const u1 = run(migPreset(HP, { unpin: true })), u1z = run(migPreset(HP, { unpin: true, gain: 0 }));
  const b1 = run(migPreset(HP, { unpin: true, boost: MIG_BOOST })), b1z = run(migPreset(HP, { unpin: true, boost: MIG_BOOST, gain: 0 }));
  // 分けた記録: 有限核(ε)・源集合(太陽だけを源にする —— 中心を固定しない写し)・連立解(二次元で compose sum —— 三次元は solve だけを受理)
  const e1 = run(migPreset(HP, { eps: 0.025 })), e2 = run(migPreset(HP, { eps: 0.1 }));
  const s1 = run(migPreset(HP, { unpin: true, pairs: [[1, 0]] }));
  const gs = clone(g2); W302A.rdPatch(gs.physics.relativeDrag, { compose: 'sum' }); const rs = run(gs);
  const D = (a, b) => arc(a) - arc(b);
  // 近点率(″/世紀)は 43 の近くで桁を落とさないよう丸めずに書く
  out.rows = {
    twoD: { arcsec: (D(r2, r2z)), degPerOrbit: sci(r2.degPerOrbit - r2z.degPerOrbit) },
    planar3d: { arcsec: (D(p0, p0z)), sameAs2d: Object.is(p0.degPerOrbit, r2.degPerOrbit) && Object.is(p0z.degPerOrbit, r2z.degPerOrbit) && Object.is(p0.degPerTime, r2.degPerTime) },
    book: { arcsec: (D(t1, t1z)), arcsecH2: (D(t1h, t1hz)), degPerOrbit: sci(t1.degPerOrbit - t1z.degPerOrbit), outOfPlane: sci(t1.outOfPlane), steps: t1.steps, nPeri: t1.nPeri },
    axisOff: { sameRate: Object.is(noAx.degPerOrbit, t1.degPerOrbit), sameState: noAx.fp === t1.fp },
    tiltEffect: { arcsec: (D(t1, t1z) - D(p0, p0z)) },
    unpinned: { arcsec: (D(u1, u1z)) },
    boost: { arcsec: (D(b1, b1z)), effect: (D(b1, b1z) - D(u1, u1z)), newtonEffectDegPerOrbit: sci(b1z.degPerOrbit - u1z.degPerOrbit), dragEffectDegPerOrbit: sci((b1.degPerOrbit - b1z.degPerOrbit) - (u1.degPerOrbit - u1z.degPerOrbit)) },
    kernelEps: { eps0p025: (D(e1, t1z)), eps0p1: (D(e2, t1z)), eps0p05: (D(t1, t1z)) },
    sourceSet: { sunOnly: (D(s1, u1z)), all: (D(u1, u1z)) },
    solve: { solve2d: (D(r2, r2z)), sum2d: (D(rs, r2z)), diff: (D(rs, r2)) },
  };
  const R = out.rows, th = Object.fromEntries(MIG_CONDITIONS.map((c) => [c.key, c.thr]));
  out.conditions.planar = { pass: R.planar3d.sameAs2d === true, value: R.planar3d };
  out.conditions.tilt = { pass: Math.abs(R.tiltEffect.arcsec) <= th.tilt.arcsec, value: R.tiltEffect };
  out.conditions.boost = { pass: Math.abs(R.boost.effect) <= th.boost.arcsec, value: { effect: R.boost.effect } };
  out.conditions.rate = { pass: Math.abs(D(t1, t1z) - th.rate.obs) + Math.abs(D(t1, t1z) - D(t1h, t1hz)) <= th.rate.arcsec, value: { arcsec: R.book.arcsec, h2: R.book.arcsecH2, gate: sci(Math.abs(D(t1, t1z) - th.rate.obs) + Math.abs(D(t1, t1z) - D(t1h, t1hz))) } };
  out.allPass = MIG_CONDITIONS.every((c) => out.conditions[c.key].pass === true);
  // html の本(在るとき): 宣言が migPreset と同じ・旧本の宣言の指紋
  const bk = find(HP, BOOK_MIG), gen = migPreset(HP);
  out.htmlBook = !!bk;
  out.htmlSame = !!bk && JSON.stringify(bk.physics) === JSON.stringify(gen.physics) && JSON.stringify(bk.bodies) === JSON.stringify(gen.bodies);
  const lg = find(HP, BOOK_LEGACY);
  out.legacyDecl = { familyRole: lg.familyRole, lawVersion: lg.physics.spaceMesh.lawVersion, sig: HP.presetSig ? HP.presetSig(lg) : null };
  return out;
}

export function runAll(HP, E) {
  const stable = partStable(HP, E);
  const migrate = partMigrate(HP);
  return { stable, migrate, migrated: stable.allPass === true && migrate.allPass === true && migrate.htmlBook === true,
    gate: { stableAll: stable.allPass, migrateAll: migrate.allPass, layoutHtml: stable.layout.htmlSame, migHtml: migrate.htmlSame } };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const OUT_PATH = process.env.W299D_OUT || path.join(ROOT, 'tests', 'out', 'geo4stable-w299d.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const M = loadHtmlMain(path.join(ROOT, TARGET));   // 本文の文脈(runInThisContext)で走らせる —— 内部関数は大域の間接 eval で引く
  const out = Object.assign({ version: HARNESS_VERSION, conditionsDeclared: STABLE_CONDITIONS, migConditionsDeclared: MIG_CONDITIONS, spreadDefault: SP.SPREAD_DEFAULT, bands: BANDS, dt: DT, steps: STEPS }, runAll(M.HP, (code) => (0, eval)(code)));
  const CODE = ['tests/exp-w299d-geo4stable.mjs', 'tests/lib-w299d-spread.mjs', 'tests/lib-w301b-approxmany.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第299便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, spreadVersion: SP.SPREAD_VERSION, loadErrors: M.errors.length,
    ruling: '原仮定者の裁定(第89報)③「geoPN=4 の検証が安定したら、physics.spaceMesh サンプルの移行を進める。現状の chainDiskToy 系は、初期配置が集まりすぎている」',
    reading: '統括の検証項目 R173・DECISIONS v58 の AN278・AN285' });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify(out.stable.table.map((z) => z.key + ':' + z.pass)) + ' / mig ' + JSON.stringify(Object.fromEntries(Object.entries(out.migrate.conditions).map(([k, v]) => [k, v.pass]))));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・migrated ' + out.migrated);
}

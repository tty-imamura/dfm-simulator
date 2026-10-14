// 第300便b(原仮定者の裁定(第90報)③「🌦️ earthMoonSunInertial3d を地球の三次元版として採用。🌦️ の値で地球と月だけの対照を用意」・
// 統括の検証項目 R176)—— **🌔 earthMoonOnly3d(地球と月だけの三次元の対照)の器**(Node だけ —— 対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步〔HP.coord3d.makeSim の step〕を走らせる)。
//
// ■ 何をするか
//   ① 写しの規則 emOnlyBodies: 🌦️ の bodies(0=太陽・1=地球・2=月)から地球→月の**相対**位置と相対速度を取り、質量比で分けて
//      地球–月の重心を原点・重心速度 0 に置いた 2 体(0=地球・1=月)を作る。質量・半径・自転・pnSource・構造核は 🌦️ のまま。太陽は外す。
//      physics は 🌦️ の写しで relativeDrag.pairs を [[0,1]] に付け替えるだけ(gain は**移送** —— この本で合わせない・fitRecord なし)。
//      本(html の earthMoonOnly3d)がこの写しと一致するかを段 decl で照合する(QA preset.earthReorg300 も同じ関数で照合)。
//   ② 測定(段 run): 対照(宣言の gain・h=0.016 と h/2)・対照の gain 0(慣性引きずりを切った二体)・🌦️(太陽あり・同じ抽出器・h)の
//      118 公転窓(対照は 354 公転窓も)で、恒星月(黄道経度〔xy の方位〕の通過の平均間隔)・朔望月の一様換算(1/P_syn=1/P_sid−1/T_year ——
//      html の朔望月の時計 HP.synodic.uniform・恒星年 365.256363004 日)・近点回転の周期(軌道面の中の近点経度 ϖ=Ω+u・検出器 B の
//      時刻への直線 fit —— 第298便c の器 tests/exp-w298c-moon3d.mjs の runEmx3 と同じ式を中心と周回の番号つきで書いた写し)・
//      平均離心率・平均傾斜(xy 面に対する)・重心の位置と全運動量の最大(対照)を記録する。太陽の有無の差 = 🌦️ − 対照。
//   ③ 照合(段 run の check): 🌦️ の 118 公転窓の近点周期が第298便c の正本 tests/out/moon3d-w298c.json の final.h.w118.T1 と同じか
//      (写した抽出器が同じ数を出すか)。🌦️ の実際の太陽の方向で数えた朔望月は第299便b の正本 tests/out/synodic-w299b.json の段 sun3d を参照値として写す。
//
// ■ 言わないこと: 「現実を再現した」「8.85 年を再現した」「gain は普遍定数」「再現しない」「合わせられない」。この本の gain を fitted と呼ばない。
//
// ■ 使い方
//   node tests/exp-w300b-emonly.mjs [--part decl,run]   → 正本 tests/out/emonly-w300b.json(段 emonly-300b)
//   W300B_OUT=<json> で出力先を変える(試走は正本を書かない)。W300B_TARGET=<html>(既定 beta/index.html)。W300B_REV=<公転数> で短い試走。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w297b-fit.mjs';
import * as W302A from './lib-w302a-wbg.mjs';   // 第302便a: gain ⇔ W_bg の読み書き(器の側)
// 第281便a の領域 hash の宣言(再生成の鎖が「この器の正本を走らせ直すか」を引く)—— 読む本は 🌔・🌦️(id で引く)
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.relDragStepOrderOf","HP.sim","HP.synodic","HP.validatePreset","T","ctx","cw","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w300b-emonly-1';
export const EXTRACTOR_VERSION = 'w300b-em3-1';      // 第298便c の runEmx3(w298c-emx3-1)と同じ式 —— 中心と周回の番号を引数にした写し
export const SRC_ID = 'earthMoonSunInertial3d';      // 🌦️(太陽・地球・月の三次元 —— 写しの元)
export const CTRL_ID = 'earthMoonOnly3d';            // 🌔(地球と月だけの対照)
export const DT = 0.016, DT2 = 0.008;
export const YEAR = 3155.76, DAY = 8.64;              // 本の時間単位(10⁴ s)で 1 ユリウス年・1 日
export const WINS = Object.freeze([118, 354]);
const clone = (x) => JSON.parse(JSON.stringify(x));
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

/* ── ① 写しの規則 ── */
/** 🌦️ の bodies(0=太陽・1=地球・2=月)→ 地球–月の重心系の 2 体(0=地球・1=月)。相対ベクトルは 🌦️ の差のまま(丸めない)。 */
export function emOnlyBodies(srcBodies) {
  const B = clone(srcBodies), E = B[1], M = B[2];
  const mt = E.m + M.m, fE = E.m / mt, fM = M.m / mt;
  const r = ['x', 'y', 'z'].map((k) => (M[k] || 0) - (E[k] || 0)), w = ['vx', 'vy', 'vz'].map((k) => (M[k] || 0) - (E[k] || 0));
  ['x', 'y', 'z'].forEach((k, i) => { E[k] = -fM * r[i]; M[k] = fE * r[i]; });
  ['vx', 'vy', 'vz'].forEach((k, i) => { E[k] = -fM * w[i]; M[k] = fE * w[i]; });
  return [E, M];
}
/** 🌦️ の宣言 → 対照の physics(relativeDrag.pairs を [[0,1]] へ —— gain・eps・history はそのまま)。 */
export function emOnlyPhysics(srcPhysics) {
  const ph = clone(srcPhysics);
  if (ph.relativeDrag && typeof ph.relativeDrag === 'object') ph.relativeDrag.pairs = [[0, 1]];
  return ph;
}
/** 重心と全運動量(三次元)。 */
export function comOf(bodies) {
  let m = 0; const X = [0, 0, 0], P = [0, 0, 0];
  for (const b of bodies) { m += b.m; ['x', 'y', 'z'].forEach((k, i) => { X[i] += b.m * (b[k] || 0); }); ['vx', 'vy', 'vz'].forEach((k, i) => { P[i] += b.m * (b[k] || 0); }); }
  return { m, X: X.map((v) => v / m), P };
}
/** 本(html の対照)と写しの規則の照合 —— QA preset.earthReorg300 と同じ判定(physics・bodies は JSON で同値・relativeDrag の宣言・重心と運動量)。 */
export function declCheck(src, ctrl) {
  const bad = [];
  const wantB = emOnlyBodies(src.bodies), wantP = emOnlyPhysics(src.physics);
  if (JSON.stringify(ctrl.bodies) !== JSON.stringify(wantB)) bad.push('bodies が写しの規則と違う');
  if (JSON.stringify(ctrl.physics) !== JSON.stringify(wantP)) bad.push('physics が写しの規則と違う');
  const c = comOf(ctrl.bodies), sc = Math.hypot(ctrl.bodies[1].x - ctrl.bodies[0].x, ctrl.bodies[1].y - ctrl.bodies[0].y, (ctrl.bodies[1].z || 0) - (ctrl.bodies[0].z || 0));
  const pScale = ctrl.bodies.reduce((a, b) => a + b.m * Math.hypot(b.vx || 0, b.vy || 0, b.vz || 0), 0);
  const xRel = Math.hypot(...c.X) / sc, pRel = Math.hypot(...c.P) / pScale;
  if (!(xRel <= 1e-15)) bad.push('重心が原点でない(' + xRel + ')');
  if (!(pRel <= 1e-15)) bad.push('全運動量が 0 でない(' + pRel + ')');
  if (ctrl.bodies.some((b) => b.pinned)) bad.push('pinned の体がある');
  const relS = ['x', 'y', 'z'].map((k) => (src.bodies[2][k] || 0) - (src.bodies[1][k] || 0)), relC = ['x', 'y', 'z'].map((k) => (ctrl.bodies[1][k] || 0) - (ctrl.bodies[0][k] || 0));
  const vS = ['vx', 'vy', 'vz'].map((k) => (src.bodies[2][k] || 0) - (src.bodies[1][k] || 0)), vC = ['vx', 'vy', 'vz'].map((k) => (ctrl.bodies[1][k] || 0) - (ctrl.bodies[0][k] || 0));
  const dr = Math.hypot(...relS.map((v, i) => v - relC[i])) / Math.hypot(...relS), dv = Math.hypot(...vS.map((v, i) => v - vC[i])) / Math.hypot(...vS);
  if (!(dr <= 1e-15 && dv <= 1e-15)) bad.push('相対ベクトルが 🌦️ と違う(位置 ' + dr + '・速度 ' + dv + ')');
  return { ok: bad.length === 0, bad, comRel: xRel, momRel: pRel, relPosRel: dr, relVelRel: dv };
}

/* ── ② 走行と事象列(第298便c の runEmx3 と同じ式 —— 中心 ci と周回 oi を引数にした) ── */
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export function inPlaneLongitude(v, h) {
  const hn = Math.hypot(h[0], h[1], h[2]), nx = -h[1], ny = h[0], nn = Math.hypot(nx, ny);
  if (!(hn > 0)) return Math.atan2(v[1], v[0]);
  if (nn < 1e-12 * hn) return Math.atan2(v[1], v[0]);
  const Om = Math.atan2(ny, nx), nu = [nx / nn, ny / nn, 0], hu = [h[0] / hn, h[1] / hn, h[2] / hn];
  return Om + Math.atan2(dot(cross(nu, v), hu), dot(nu, v));
}
export const EM3_STEP_FACTOR = 3;
function maxStepsOf(S, ci, oi, dt, revMax) {
  const mu = S.params.G * (S.m[ci] + S.m[oi]);
  const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci], dz = S.z[oi] - S.z[ci], dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci], dvz = S.vz[oi] - S.vz[ci];
  const inv = 2 / Math.hypot(dx, dy, dz) - (dvx * dvx + dvy * dvy + dvz * dvz) / mu;
  if (!(inv > 0) || !Number.isFinite(inv)) return 0;
  return Math.ceil(EM3_STEP_FACTOR * revMax * 2 * Math.PI * Math.sqrt(1 / (inv * inv * inv) / mu) / dt);
}
export function runEm3(HP, preset, o) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) throw new Error('三次元の本ではない');
  const { dt, revMax, ci, oi } = o, EV = 64, mu = S.params.G * (S.m[ci] + S.m[oi]);
  const maxSteps = maxStepsOf(S, ci, oi, dt, revMax);
  const rel = () => [S.x[oi] - S.x[ci], S.y[oi] - S.y[ci], S.z[oi] - S.z[ci]];
  let p0 = rel(), stop = maxSteps > 0 ? null : 'unbound';
  let angPrev = Math.atan2(p0[1], p0[0]), angAcc = 0, r1 = Math.hypot(...p0), r2 = r1, P1 = p0, P2 = p0, PP = p0, nan = false, k = 0;
  let hPrev = null;
  const ev = { rev: [], peri: [], apo: [], ecc: [] };
  // 重心と全運動量の監視(o.com のとき —— 太陽の無い対照だけ。EV 步ごと)
  const com = o.com ? { xMax: 0, pMax: 0, mt: 0 } : null;
  if (com) for (let i = 0; i < S.n; i++) com.mt += S.m[i];
  const comSample = () => {
    let X = [0, 0, 0], P = [0, 0, 0];
    for (let i = 0; i < S.n; i++) { X[0] += S.m[i] * S.x[i]; X[1] += S.m[i] * S.y[i]; X[2] += S.m[i] * S.z[i]; P[0] += S.m[i] * S.vx[i]; P[1] += S.m[i] * S.vy[i]; P[2] += S.m[i] * S.vz[i]; }
    com.xMax = Math.max(com.xMax, Math.hypot(...X) / com.mt); com.pMax = Math.max(com.pMax, Math.hypot(...P));
  };
  if (com) comSample();
  for (; stop === null; k++) {
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    const t0 = S.t;
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (!(S.t > t0)) { stop = 'coord3dHalt'; break; }
    const d = rel(), rr = Math.hypot(...d), th = Math.atan2(d[1], d[0]);
    if (!Number.isFinite(rr)) { nan = true; stop = 'nan'; break; }
    let dd = th - angPrev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += dd; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); ev.rev.push((k + fr) * dt); }
    const h = cross(P1, d);
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const den = (r2 - 2 * r1 + rr), fr = (den !== 0) ? 0.5 * (r2 - rr) / den : 0;
      const hh = hPrev || h;
      let a1 = inPlaneLongitude(P2, hh), a2 = inPlaneLongitude(P1, hh), a3 = inPlaneLongitude(d, hh);
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (den !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * den) : r1;
      (r1 < r2 ? ev.peri : ev.apo).push({ t: (k + fr) * dt, ang, r: rv });
    }
    if (k >= 1 && (k % EV) === 0) {
      const w = [(d[0] - PP[0]) / (2 * dt), (d[1] - PP[1]) / (2 * dt), (d[2] - PP[2]) / (2 * dt)], r = Math.hypot(...P1), hv = cross(P1, w);
      const vxh = cross(w, hv), e = [vxh[0] / mu - P1[0] / r, vxh[1] / mu - P1[1] / r, vxh[2] / mu - P1[2] / r];
      ev.ecc.push([k * dt, inPlaneLongitude(e, hv), Math.hypot(...e), 1 / (2 / r - dot(w, w) / mu), Math.acos(Math.max(-1, Math.min(1, hv[2] / Math.hypot(...hv)))) * 180 / Math.PI]);
      if (com) comSample();
    }
    PP = P1; P2 = P1; P1 = d; r2 = r1; r1 = rr; hPrev = h;
    if (ev.rev.length >= revMax) { k++; stop = 'revMax'; break; }
  }
  return { ev, steps: k, stop, maxSteps, complete: stop === 'revMax' && ev.rev.length >= revMax, nan: nan || S.hasNaN(), warnings: v.warnings || [], com };
}
export function windowsOf(R, wins, HP) {
  const U = { year: YEAR, day: DAY }, tYearDays = HP.synodic.yearDays;
  return wins.map((N) => {
    const w = L.emMethods(R.ev, N, U);
    if (w.complete) {
      const tB = R.ev.rev[N - 1], E = R.ev.ecc.filter((z) => z[0] <= tB && z[4] !== undefined);
      w.incMean = E.length ? E.reduce((s, z) => s + z[4], 0) / E.length : null;
      w.synUniform = HP.synodic.uniform(w.sid, tYearDays);   // 日 —— 1/P_syn=1/P_sid−1/T_year(恒星年 365.256363004 日)
    }
    return w;
  });
}

/* ── 正本 ── */
const find = (BUILTIN, id) => { const p = BUILTIN.find((q) => q.id === id); if (!p) throw new Error('no preset ' + id); return clone(p); };
export async function main() {
  const TARGET = process.env.W300B_TARGET || 'beta/index.html';
  const OUT = process.env.W300B_OUT || path.join(ROOT, 'tests', 'out', 'emonly-w300b.json');
  const argOf = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
  const PARTS = String(argOf('--part') || process.env.W300B_PART || 'decl,run').split(',').filter(Boolean);
  const REV = Number(process.env.W300B_REV) || 0;   // 試走の公転数(0 = 既定の窓)
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const t0All = Date.now();
  const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const BUILTIN = vm.runInThisContext('BUILTIN_PRESETS');
  const src = find(BUILTIN, SRC_ID), ctrl = find(BUILTIN, CTRL_ID);
  const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  out.version = HARNESS_VERSION; out.extractorVersion = EXTRACTOR_VERSION;
  out.generator = 'tests/exp-w300b-emonly.mjs';
  out.ruling = '原仮定者の裁定(第90報)③・統括の検証項目 R176';
  out.target = TARGET; out.targetSha256 = targetSha256;
  out.parts = out.parts || {};
  const W = (R, N) => R.windows.find((z) => z.N === N) || (REV ? R.windows[0] : null);   // 試走(W300B_REV)は短い窓の先頭
  const RUN = {
    decl: () => {
      const c = declCheck(src, ctrl);
      log('decl', JSON.stringify(c));
      if (!c.ok) throw new Error('対照の宣言が写しの規則と違う: ' + c.bad.join(' / '));
      return Object.assign({ rule: '🌦️ の地球→月の相対位置・相対速度を質量比で分け、地球–月の重心を原点・重心速度 0 に置いた(太陽を外す)・physics は 🌦️ の写しで relativeDrag.pairs を [[0,1]] へ',
        srcBodies: src.bodies, bodies: emOnlyBodies(src.bodies), relativeDrag: emOnlyPhysics(src.physics).relativeDrag }, c);
    },
    run: () => {
      const rv = (n) => REV || n;
      const go = (key, preset, o) => {
        const t = Date.now();
        const R = runEm3(HP, preset, o);
        if (!R.complete || R.nan) throw new Error(`走行が窓を満たさない(${key}: stop=${R.stop}・公転 ${R.ev.rev.length}/${o.revMax})`);
        const windows = windowsOf(R, o.wins.map((N) => Math.min(N, o.revMax)), HP);
        const r = { key, dt: o.dt, revN: R.ev.rev.length, steps: R.steps, nan: R.nan, warnings: R.warnings, com: R.com, windows, wallSec: (Date.now() - t) / 1000 };
        const w = windows[0];
        log(key, `T118 ${L.fx(w.T1, 5)} 年・恒星月 ${L.fx(w.sid, 6)} 日・朔望月(一様) ${L.fx(w.synUniform, 6)} 日・e ${L.fx(w.eOsc, 6)}・傾斜 ${L.fx(w.incMean, 4)}°・${r.wallSec}s`);
        return r;
      };
      const g0 = clone(ctrl); W302A.rdSetGain(g0.physics.relativeDrag, 0);
      const ctrlH = go('ctrl-h', ctrl, { dt: DT, revMax: rv(354), wins: [118, 354], ci: 0, oi: 1, com: true });
      const ctrlH2 = go('ctrl-h2', ctrl, { dt: DT2, revMax: rv(118), wins: [118], ci: 0, oi: 1, com: true });
      const ctrlG0 = go('ctrl-gain0', g0, { dt: DT, revMax: rv(118), wins: [118], ci: 0, oi: 1, com: true });
      const sunH = go('sun3d-h', src, { dt: DT, revMax: rv(118), wins: [118], ci: 1, oi: 2, com: false });
      // 第302便h(R188 の続き): 本体の既定が semic の世代では、第298便c の正本(🌦️ のフィットの記録)は分割の步の値(器 tests/exp-w298c-moon3d.mjs が分割に固定)。
      //   照合は同じ 🌦️ に stepOrder:"split" を明示した写しの走りで行う(sunH は今の既定〔semic〕の値 —— 観測カードと太陽の有無の差はこちら)
      const gen302 = typeof globalThis.relDragStepOrderOf === 'function';
      const srcSplit = clone(src); if (gen302) srcSplit.physics.relativeDrag.stepOrder = 'split';
      const sunHsplit = gen302 ? go('sun3d-h-split', srcSplit, { dt: DT, revMax: rv(118), wins: [118], ci: 1, oi: 2, com: false }) : null;
      // 照合: 🌦️ の 118 窓の近点周期 = 第298便c の正本(写した抽出器が同じ数を出すか)。🌦️ の実際の太陽の方向の朔望月は第299便b の正本の段 sun3d を参照値として写す
      let m3 = null, syn = null;
      try { m3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'moon3d-w298c.json'), 'utf8')); } catch (e) { /* 無い世代 */ }
      try { syn = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'synodic-w299b.json'), 'utf8')); } catch (e) { /* 無い世代 */ }
      const ref298 = m3 && m3.final && m3.final.h && m3.final.h.w118 ? m3.final.h.w118 : null;
      const wS = sunHsplit ? W(sunHsplit, 118) : null;
      const check = { moon3dT1: ref298 ? ref298.T1 : null, sunT1: W(sunH, 118) ? W(sunH, 118).T1 : null,
        sameAsMoon3d: !REV && !!ref298 && (gen302 ? (!!wS && wS.T1 === ref298.T1 && wS.sid === ref298.sid) : (!!W(sunH, 118) && W(sunH, 118).T1 === ref298.T1)),
        moon3dSid: ref298 ? ref298.sid : null, sunSid: W(sunH, 118) ? W(sunH, 118).sid : null,
        ...(gen302 ? { stepOrder302: '第302便h: 第298便c の正本は分割の步の記録 —— 照合は 🌦️ に stepOrder:"split" を明示した写し(sun3d-h-split)の 118 公転窓で行った',
          splitT1: wS ? wS.T1 : null, splitSid: wS ? wS.sid : null } : {}) };
      const sun3dSyn = syn && syn.parts && syn.parts.sun3d ? syn.parts.sun3d : null;
      const realSun = sun3dSyn ? { source: 'tests/out/synodic-w299b.json の段 sun3d(第299便b —— 地心から太陽への方位で数えた合)', windows: sun3dSyn.real || sun3dSyn.windows || null } : null;
      const c118 = W(ctrlH, 118), s118 = W(sunH, 118);
      const diff = (k) => (c118 && s118 && Number.isFinite(c118[k]) && Number.isFinite(s118[k])) ? s118[k] - c118[k] : null;
      return { short: !!REV, runs: Object.assign({ ctrlH, ctrlH2, ctrlG0, sunH }, sunHsplit ? { sunHsplit } : {}), check, realSunSynodic: realSun,
        sunEffect: { note: '太陽の有無の差 = 🌦️(太陽あり)− 対照(太陽なし)—— 同じ抽出器・h・118 公転窓', T1: diff('T1'), sid: diff('sid'), synUniform: diff('synUniform'), eOsc: diff('eOsc'), incMean: diff('incMean') },
        h2: { note: '対照の h/2 差(118 公転窓)', T1: Math.abs(W(ctrlH2, 118).T1 - c118.T1), sid: Math.abs(W(ctrlH2, 118).sid - c118.sid), synUniform: Math.abs(W(ctrlH2, 118).synUniform - c118.synUniform) } };
    },
  };
  for (const k of Object.keys(out.parts)) if (!RUN[k]) delete out.parts[k];
  for (const k of PARTS) {
    if (!RUN[k]) continue;
    const t = Date.now();
    out.parts[k] = RUN[k]();
    out.parts[k].wallSec = (Date.now() - t) / 1000;
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
    log('part', k, 'done', out.parts[k].wallSec + 's');
  }
  out.timing = { wallSec: (Date.now() - t0All) / 1000 };
  const CODE = ['tests/exp-w300b-emonly.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w297b-fit.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const INPUTS = [TARGET, 'tests/out/moon3d-w298c.json', 'tests/out/synodic-w299b.json'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第300便b', target: TARGET, code: CODE, inputs: INPUTS }), {
    harnessVersion: HARNESS_VERSION, extractorVersion: EXTRACTOR_VERSION, parts: Object.keys(out.parts),
    ruling: '原仮定者の裁定(第90報)③(🌦️ を地球の三次元版として採用・🌦️ の値で地球と月だけの対照を用意)',
    reading: '統括の検証項目 R176(🌦️ の地球・月の相対位置と速度・質量・半径・gain・刻み・倍精度・λ=0・geoPN 3・coord 3d を写し、太陽を外して重心 0・重心速度 0。gain は移送 —— fitted と呼ばない。恒星月・朔望月〔一様換算〕・近点回転〔118 窓〕を記録)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス・HP.coord3d.makeSim)',
    notClaim: ['現実を再現した', '8.85 年を再現した', 'gain は普遍定数', 'この本の gain はフィット'] });
  out.elapsedS = out.timing.wallSec;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  log('→', path.relative(ROOT, OUT), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

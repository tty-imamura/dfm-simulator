// 第317便c(原仮定者の裁定(第119報)・同 補足 1・原仮定者の裁定(第119報 補足)AN435〔(b) を主に〕・決断事項 AN431・統括の検証項目 R252):
// **衛星の三体の切る変種の器**(段 satcut-317c —— 正本 tests/out/satcut-w317c.json)。
// 確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の本の宣言は変えない(写しは第315便d の lib の bookOf で組み、変種は tests/lib-w317c-satcut.mjs で写しの外から足す)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState・inertialDragGalaxyAxialState をそのまま呼ぶ)。走行は子プロセス(W317C_WORKERS —— 既定 2)。
//
// ■ 何をするか(n = 2・K1 のまま —— 物理の軸 n・核は枝 b・步と長い窓は枝 a)
//   D 軸の分解の値: 太陽 + 母惑星の二体(衛星なし)の写しの母惑星の軸の ω(源 = 太陽)ω☉,P を読み口で測り、変種 V6b(axialGain f・銀河由来 (1 − f) ω☉,P)と
//     V6a(銀河由来 r abs(ω☉,P) ĝ を足す)の宣言を作る。和が保たれること(同じ写しを V6b の値で組んで母惑星の f ω☉,P + ω_G)を門で確かめる。
//   P t = 0 の写しの読み口(変種の q11 の本ごと —— 受理・銀河の分の係数 responseFactor・観測の初期自転の分解〔initSpin〕の銀河の分の効き・V2 の宣言が在位の 7 本と同じか・
//     V3 の母惑星中心の写しの相対の状態)
//   E 走行(変種 × 衛星 × 系 × q10・q11 × h・h/2・h/4 —— runN·S·div 步〔共通の座標時刻の終端〕かつ runN 回目の通過まで。q10 は V3 を除き V0 と同じ本 —— 同じ走行を共有)
//   A 測る量 M0(窓の終端 t₁ = N·P_seed の近点の率の差 q11 − q10 —— L 模型)と通過の窓の差(第316便d と同じ式)を窓 8・16・32・64 × 刻みで並べ、
//     判定 HARM_RULE の R1(32 → 64 の差 ≤ 両窓の h/2–h/4 の帯の大きい方)・R2(窓 64 の h–h/2・h/2–h/4 ≤ 1e-2 × abs(差))—— 決まった = R1 ∧ R2(L 模型)。
//     変種と V0 の差(窓 64・h/4)と帯・二体と三体の差・恒星周期の差(q11 − q10 —— 通過の窓)を並べる。
//
// ■ 試走: W317C_QUICK=1(W317C_OUT が要る —— 正本を書かない)。再開: W317C_CACHE=<dir>(走行 1 本ごとの結果を逐次書き、同じ html・同じ器の版・同じ本・同じ刻みがあれば読む)。
//   探索: W317C_EXPLORE=1(EXPLORE の被覆 —— W317C_OUT が要る・正本を書かない)。衛星 W317C_SATS(正本は 6 本)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」「シュヴァルツシルト半径そのもの」。近似要素の種を観測レコードと呼ばない。
//   銀河の軸引きずりの大きさを決めたと書かない。数値の帯は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断・窓は抽出の感度診断。決まらない変種は
//   「この予算では永年項として決まらない」(法則の否定・効きが無いとは書かない)。エンジンの誤りと断定しない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as C from './lib-w317c-satcut.mjs';
import * as X315 from './exp-w315d-satk1.mjs';
import * as X316 from './exp-w316d-sath.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 在位の本は .find で引く〔jupiterGalilean・saturnRingReal の値・在位の 7 本の relativeDrag の照合〕・
//   "saturn" は母惑星の鍵の文字列が 🪐 の id と同じ綴りで数えられた分・"ab"・"cv" は器の変数名が最上位名と同じ綴りで数えられた分〔広めの宣言は許される〕。
//   読み口 inertialDragGalaxyAxialState は HP に無いので最上位の名で読む)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cv","cw","inertialDragGalaxyAxialState","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w317c-satcut-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', 'シュヴァルツシルト半径そのもの', '観測レコード', '銀河の軸引きずりの大きさを決めた', 'エンジンの誤り(断定)'];
export const OUT_SATCUT = 'tests/out/satcut-w317c.json';
export const SATH_OUT = X316.OUT_SATH;
export const SATS = X315.SATS;
export const KINDS = Object.freeze(['q10', 'q11']);
/** 判定の規則(第316便d の HARM_RULE —— 版 w316d-harm-rule-1・L 模型だけを当てる —— 決まった = R1 ∧ R2。走行の前に宣言・閾値は変えない) */
export const HARM_RULE = X316.HARM_RULE;
const ALL = Object.freeze(['two', 'three']), THREE = Object.freeze(['three']);
/**
 * 計画(正本)。cover = 変種ごとの系と衛星(変種の宣言 VARIANTS の被覆の部分集合 —— 走行の前に宣言)。正本の段は 2 worker で 60 分の目安
 * (原仮定者の裁定(第119報 補足)AN435: (b) を主に —— 優先の順 V2 → V6b → V1a。V6b は端の f = 0 を二体と三体・V2 は三体だけ)。
 * 残り(f = 0.5・V2 と f = 0.5 の二体・V6a・V3・V1b)は探索(EXPLORE —— scratch。4 枝の並走の容器で三体の q11 の h/4 が 1 本 190 s 前後 —— 全部を正本にすると 60 分を越える)。
 */
export const PLAN = Object.freeze({ runN: 64, windows: Object.freeze([8, 16, 32, 64]), divs: Object.freeze([1, 2, 4]), stepsPerOrbit: 720,
  cover: Object.freeze({ V0: Object.freeze({ systems: ALL }), V2: Object.freeze({ systems: THREE }), V6b_f0: Object.freeze({ systems: ALL }), V1a: Object.freeze({ systems: THREE }) }) });
export const QUICK = Object.freeze({ runN: 8, windows: Object.freeze([2, 4, 8]), divs: Object.freeze([1, 2]), stepsPerOrbit: 360, cover: PLAN.cover });
/**
 * 探索(scratch の JSON —— 正本の段の外): 正本の被覆に加えて V6b f = 0.5(三体)・V6a(AN435 で対照 —— イオの三体・r = 1・10 の 2 点)・V3(イオ・トリトン)・
 * V1b(三体の差の大きいイオ・ガニメデ・カリスト)。4 枝の並走の容器(負荷平均 8〜10)で三体の q11 の 1 セルが 380 s 前後 —— 時間の予算で点を減らした(走行の前に宣言)
 */
export const EXPLORE = Object.freeze({ runN: 64, windows: PLAN.windows, divs: PLAN.divs, stepsPerOrbit: 720,
  cover: Object.freeze({ V0: Object.freeze({ systems: ALL }), V2: Object.freeze({ systems: THREE }), V6b_f05: Object.freeze({ systems: THREE }), V6b_f0: Object.freeze({ systems: ALL }), V1a: Object.freeze({ systems: THREE }),
    V6a_r1: Object.freeze({ systems: THREE, sats: Object.freeze(['io']) }), V6a_r10: Object.freeze({ systems: THREE, sats: Object.freeze(['io']) }),
    V3: Object.freeze({ systems: THREE }), V1b: Object.freeze({ systems: THREE, sats: Object.freeze(['io', 'ganymede', 'callisto']) }) }) });
const CENTURY = 36525 * 86400, RAD2AS = 180 / Math.PI * 3600;
const finiteOr = (x) => (Number.isFinite(x) ? x : null);
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);

/* ───────── 走行の鍵 ───────── */
/** 計画の被覆を展開(変種 × 衛星 × 系 —— 変種の宣言の被覆と計画の cover の交わり) */
export function cellsOf(plan, sats) {
  const out = [];
  for (const v of C.VARIANTS) { const cv = plan.cover[v.key]; if (!cv) continue;
    for (const sat of sats) for (const sys of cv.systems) { if (!C.variantCovers(v, sat, sys)) continue; if (cv.sats && !cv.sats.includes(sat)) continue; out.push({ v: v.key, sat, sys }); } }
  return out;
}
export const rowKey = (c, kind, div) => c.v + '|' + c.sat + '|' + c.sys + '|' + kind + '|div=' + div;
const bookSha = (b) => crypto.createHash('sha256').update(JSON.stringify(b)).digest('hex');
export const runKeyOf = (b, sp) => crypto.createHash('sha256').update(bookSha(b) + '|div=' + sp.div + '|N=' + sp.N + '|wins=' + JSON.stringify(sp.wins)).digest('hex').slice(0, 32);
const needsDecomp = (vk) => { const v = C.variantOf(vk); return v.group === 'V6a' || v.group === 'V6b'; };
/** 本(子と親で同じ純関数) */
export function specBook(HP, sp, cache = {}) {
  const sd = cache.seed || L.seedOf(HP, sp.sat), D = needsDecomp(sp.v) && sp.kind === 'q11' ? (cache.decomp || C.decompOf(HP, sd.parent)) : null;
  return C.variantBook(HP, sp.sat, sp.sys, sp.kind, sp.v, { seed: sd, stepsPerOrbit: sp.S, decomp: D });
}

/* ───────── 走行(子)───────── */
const PASS_FIELDS = Object.freeze(['sidDays', 'aps', 'node', 'axSat', 'axPar', 'eMean', 'incMeanDeg', 't1']);
export function runSpecC(HP, sp) {
  const sd = L.seedOf(HP, sp.sat), P = L.parentOf(sd.parent), book = specBook(HP, sp, { seed: sd });
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) return { spec: sp, status: 'rejected', err: '三次元の本ではない' };
  const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]);
  const dt = book.physics.stepDt / sp.div, Tsec = Math.pow(10, book.scaleExp.T), t0 = Date.now();
  const smp = L.attachSatSampler(S, { ci: ip, oi: is, mu, every: sp.div, pole: P.orbitPole });
  const kMin = sp.N * book.timeRef.stepsPerOrbit * sp.div, maxSteps = Math.ceil(1.5 * kMin);
  let k = 0, stop = null;
  for (; ; k++) {   // 第315便d の runBook と同じ回し方(步の頭の判定)—— 終端は步の数(共通の座標時刻)と runN 回目の通過の遅い方
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (S.hasNaN()) { stop = 'nan'; break; }
    if (k + 1 >= kMin && smp.rev.length >= sp.N) { k++; stop = 'done'; break; }
  }
  const s = smp.samples(), R = { rev: smp.rev.slice(), s }, m0 = {}, pass = {};
  for (const N of sp.wins) {
    const f = C.m0Of(s, book, N); m0[N] = f ? Object.assign(f, { nOk: f.n === N * book.timeRef.stepsPerOrbit, tLast: s.t[N * book.timeRef.stepsPerOrbit - 1], tCut: N * book.timeRef.pRef }) : null;
    const w = L.windowOf(R, N, Tsec); pass[N] = { complete: w.complete }; if (w.complete) for (const q of PASS_FIELDS) pass[N][q] = w[q];
  }
  const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
  smp.detach();
  return { spec: sp, h: book.physics.stepDt, pRef: book.timeRef.pRef, status: 'run', steps: k, kMin, stop, complete: stop === 'done', nan: S.hasNaN(), unbound: smp.unbound(), dt,
    warnings: (v.warnings || []).length, revs: R.rev.length, m0, pass, betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── 子プロセスの池と再開の写し(第316便d と同じ型 —— 鍵は本の sha と刻み)───────── */
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(JSON.stringify(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(JSON.stringify(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, targetSha256, stat) {
  const memo = new Map();
  const fileOf = (key) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + C.LIB_VERSION + '|' + L.LIB_VERSION + '|' + targetSha256 + '|' + key).digest('hex').slice(0, 32) + '.json');
  if (dir) fs.mkdirSync(dir, { recursive: true });
  return (key, sp, pri) => {
    if (memo.has(key)) { stat.shared++; return memo.get(key); }
    let p = null;
    if (dir) { try { const c = JSON.parse(fs.readFileSync(fileOf(key), 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.key === key && c.row) { stat.resumed++; p = Promise.resolve(c.row); } } catch (e) { /* 無い */ } }
    if (!p) p = run(sp, pri).then((r) => { if (dir) { const f = fileOf(key), tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, key, row: r })); fs.renameSync(tmp, f); } return r; });
    memo.set(key, p); return p;
  };
}

/* ───────── 段 D・P(t = 0 の読み口 —— 親で)───────── */
export function partD(HP, sats) {
  const parents = [...new Set(sats.map((k) => L.satOf(k).parent))], out = { galaxy: C.galaxyAxis(), parents: {} };
  for (const pk of parents) {
    const D = C.decompOf(HP, pk), chk = {};
    for (const [vk, z] of Object.entries(D.v6b)) {
      const st = C.stateOf(HP, C.sunPlanetBook(pk, { gain: z.gain, galaxy: z.galaxy }));
      if (!st.ok) { chk[vk] = { ok: false, err: st.err }; continue; }
      const r = st.isq.receivers.find((q) => q.i === 1), g = st.gal.receivers.find((q) => q.i === 1), tot = r.omega.map((q, i) => q + g.omegaG[i]);
      chk[vk] = { ok: true, sunPart: r.omega, galaxyPart: g.omegaG, total: tot, relErr: Math.hypot(...tot.map((q, i) => q - D.omSunP[i])) / D.omSunPAbs };
    }
    out.parents[pk] = Object.assign(D, { sumCheck: chk });
  }
  return out;
}
const ULP4 = 4 * Number.EPSILON;
export function partP(HP, sats, cells, S) {
  const out = { inPos: {}, cells: {} };
  for (const id of C.IN_POS_BOOKS) { const p = HP.allPresets().find((q) => q.id === id); out.inPos[id] = p ? JSON.stringify(p.physics.relativeDrag) === JSON.stringify(C.IN_POS_K1_DRAG) : false; }
  const dec = {};
  for (const c of cells) {
    const sd = L.seedOf(HP, c.sat), pk = sd.parent; if (!dec[pk] && needsDecomp(c.v)) dec[pk] = C.decompOf(HP, pk);
    const b = C.variantBook(HP, c.sat, c.sys, 'q11', c.v, { seed: sd, stepsPerOrbit: S, decomp: dec[pk] }), st = C.stateOf(HP, b);
    const o = { accepted: st.ok, warnings: st.ok ? st.warnings : null, err: st.ok ? null : st.err, drag: clone(b.physics.relativeDrag) };
    if (st.ok) {
      const Sm = st.S, b0 = C.variantBook(HP, c.sat, c.sys, 'q11', 'V0', { seed: sd, stepsPerOrbit: S }), s0 = C.stateOf(HP, b0).S;
      // 観測の初期自転の分解(initSpin)の効き —— 慣性自転の大きさと軸の V0 との差(天体ごと)
      o.spin = Array.from({ length: Sm.n }, (_, i) => ({ dSpinRel: (Sm.spin[i] - s0.spin[i]) / Math.abs(s0.spin[i]), axAngle: Math.atan2(nrm([Sm.say[i] * s0.saz[i] - Sm.saz[i] * s0.say[i], Sm.saz[i] * s0.sax[i] - Sm.sax[i] * s0.saz[i], Sm.sax[i] * s0.say[i] - Sm.say[i] * s0.sax[i]]),
        Sm.sax[i] * s0.sax[i] + Sm.say[i] * s0.say[i] + Sm.saz[i] * s0.saz[i]), dvx: Sm.vx[i] - s0.vx[i], dvy: Sm.vy[i] - s0.vy[i], dvz: Sm.vz[i] - s0.vz[i] }));
      if (st.gal && st.gal.active) {
        const f = st.gal.receivers.filter((r) => r.receiver).map((r) => r.responseFactor), ip = b.timeRef.pair[0];
        o.galaxy = { active: true, denominator: st.gal.denominator, factors: f, maxDev: Math.max(...f.map((x) => Math.abs(x - 1))), planetFactor: st.gal.receivers.find((r) => r.i === ip).responseFactor,
          omegaG: st.gal.receivers.map((r) => r.omegaG) };
      }
      o.omega = st.isq.receivers.map((r) => ({ i: r.i, omega: r.omega, betaSum: r.betaSum }));
      // 軸と回転の経路の大きさ(t = 0 —— inertialDragIsqBuild と同じ式: 回転の右辺 u_rot,i = Σ_j (Ω_j â_j) × RV_ij・並進の右辺 u_tr,i = Σ_j β_ij (v_j − v_i))を、
      //   衛星の母惑星に対する速さで割った比(倍精度の速度の最下位の桁は相対 2⁻⁵² ≈ 2.2e-16)
      const ip = b.timeRef.pair[0], is = b.timeRef.pair[1], vRel = Math.hypot(Sm.vx[is] - Sm.vx[ip], Sm.vy[is] - Sm.vy[ip], Sm.vz[is] - Sm.vz[ip]);
      o.path = st.isq.receivers.map((r) => { const n = Sm.n; let ux = 0, uy = 0, uz = 0, tx = 0, ty = 0, tz = 0;
        for (let j = 0; j < n; j++) { const bj = r.beta[j]; if (bj) { tx += bj * (Sm.vx[j] - Sm.vx[r.i]); ty += bj * (Sm.vy[j] - Sm.vy[r.i]); tz += bj * (Sm.vz[j] - Sm.vz[r.i]); }
          if (r.rot) { const c = j * 3, Om = Sm.spin[j], a0 = Sm.sax[j] * Om, a1 = Sm.say[j] * Om, a2 = Sm.saz[j] * Om; ux += a1 * r.rot[c + 2] - a2 * r.rot[c + 1]; uy += a2 * r.rot[c] - a0 * r.rot[c + 2]; uz += a0 * r.rot[c + 1] - a1 * r.rot[c]; } }
        return { i: r.i, uRotOverV: Math.hypot(ux, uy, uz) / vRel, uTrOverV: Math.hypot(tx, ty, tz) / vRel, omegaT64: r.omega ? Math.hypot(r.omega[0], r.omega[1], r.omega[2]) * 64 * b.timeRef.pRef : null }; });
      if (C.variantOf(c.v).group === 'V3') {   // 相対の状態が V0 と同じか(天体どうしの差)
        let mx = 0; for (let i = 1; i < b.bodies.length; i++) for (const q of ['x', 'y', 'z', 'vx', 'vy', 'vz']) { const a = b.bodies[i][q] - b.bodies[0][q], z = b0.bodies[i][q] - b0.bodies[0][q]; mx = Math.max(mx, Math.abs(a - z) / Math.max(Math.abs(z), 1e-300)); }
        const ip = b.timeRef.pair[0]; o.v3 = { relDevMax: mx, planetAtOrigin: ['x', 'y', 'z', 'vx', 'vy', 'vz'].every((q) => b.bodies[ip][q] === 0), sunDist: Math.hypot(b.bodies[0].x, b.bodies[0].y, b.bodies[0].z) };
      }
    }
    out.cells[c.v + '|' + c.sat + '|' + c.sys] = o;
  }
  return out;
}

/* ───────── 段 A(M0 と通過の窓の差・判定 —— E の行から純関数 —— QA が作り直す)───────── */
const rowOf = (J, c, kind, div) => { const k = J.E.index[rowKey(c, kind, div)], r = k ? J.E.runs[k] : null; return r && r.status === 'run' ? r : null; };
const bandsOf = (byDiv, ds) => { const b = {}; for (let i = 1; i < ds.length; i++) { const x = byDiv[ds[i]], y = byDiv[ds[i - 1]]; b[ds[i - 1] + '-' + ds[i]] = (x && y && Number.isFinite(x.d) && Number.isFinite(y.d)) ? Math.abs(x.d - y.d) : null; } return b; };
/** 判定(HARM_RULE の L 模型 —— 決まった = R1 ∧ R2) */
export function verdictOf(byWin, ws, ds) {
  const fine = ds[ds.length - 1], fine2 = ds[ds.length - 2], last = ws[ws.length - 1], prev = ws[ws.length - 2];
  const v = (N) => (byWin[N] && byWin[N].byDiv[fine] ? byWin[N].byDiv[fine].d : null), bf = (N) => (byWin[N] ? byWin[N].bands[fine2 + '-' + fine] : null);
  const dWin = (Number.isFinite(v(last)) && Number.isFinite(v(prev))) ? Math.abs(v(last) - v(prev)) : null, band = (Number.isFinite(bf(last)) && Number.isFinite(bf(prev))) ? Math.max(bf(last), bf(prev)) : null;
  const bandsL = byWin[last] ? Object.values(byWin[last].bands) : [], tol = Number.isFinite(v(last)) && v(last) !== 0 ? HARM_RULE.rel * Math.abs(v(last)) : null;
  const R1 = Number.isFinite(dWin) && Number.isFinite(band) ? dWin <= band : false;
  const R2 = (bandsL.length >= 2 && bandsL.every((x) => Number.isFinite(x)) && tol !== null) ? bandsL.every((x) => x <= tol) : false;
  const bandMax = bandsL.length && bandsL.every((x) => Number.isFinite(x)) ? Math.max(...bandsL) : null;
  return { v: finiteOr(v(last)), vPrev: finiteOr(v(prev)), dWin, band, overBand: (Number.isFinite(dWin) && band > 0) ? dWin / band : null, bandMax, tol, bandOverTol: (bandMax !== null && tol) ? bandMax / tol : null, R1, R2, determined: R1 && R2 };
}
export function partA(J) {
  const ws = J.E.windows.slice().sort((a, b) => a - b), ds = J.E.divs.slice().sort((a, b) => a - b), fine = ds[ds.length - 1], out = { rule: clone(HARM_RULE), measure: 'M0', cells: {} };
  for (const c of J.E.cells) {
    const id = c.v + '|' + c.sat + '|' + c.sys, o = { v: c.v, sat: c.sat, sys: c.sys, m0: { byWin: {} }, pass: { byWin: {} }, sid: {} };
    for (const N of ws) {
      const zm = { byDiv: {} }, zp = { byDiv: {} };
      for (const d of ds) { const a = rowOf(J, c, 'q10', d), b = rowOf(J, c, 'q11', d); if (!a || !b) continue;
        const ma = a.m0[N], mb = b.m0[N]; if (ma && mb) zm.byDiv[d] = { q10: finiteOr(ma.aps), q11: finiteOr(mb.aps), d: (Number.isFinite(ma.aps) && Number.isFinite(mb.aps)) ? mb.aps - ma.aps : null };
        const pa = a.pass[N], pb = b.pass[N]; if (pa && pb && pa.complete && pb.complete) zp.byDiv[d] = { q10: finiteOr(pa.aps), q11: finiteOr(pb.aps), d: (Number.isFinite(pa.aps) && Number.isFinite(pb.aps)) ? pb.aps - pa.aps : null,
          dSidS: (Number.isFinite(pa.sidDays) && Number.isFinite(pb.sidDays)) ? (pb.sidDays - pa.sidDays) * 86400 : null }; }
      zm.bands = bandsOf(zm.byDiv, ds); zp.bands = bandsOf(zp.byDiv, ds);
      o.m0.byWin[N] = zm; o.pass.byWin[N] = zp;
    }
    o.m0.verdict = verdictOf(o.m0.byWin, ws, ds); o.pass.verdict = verdictOf(o.pass.byWin, ws, ds);
    const zl = o.pass.byWin[ws[ws.length - 1]].byDiv[fine]; o.sid = { dSidS: zl ? finiteOr(zl.dSidS) : null };
    out.cells[id] = o;
  }
  // 変種と V0 の差(窓 64・最も細かい刻み)・ビット同一(M0 の q11 の率が全窓 × 全刻みで V0 と同じ)・二体と三体の差
  for (const o of Object.values(out.cells)) {
    const b = out.cells['V0|' + o.sat + '|' + o.sys];
    if (o.v !== 'V0' && b) {
      const dv = (Number.isFinite(o.m0.verdict.v) && Number.isFinite(b.m0.verdict.v)) ? o.m0.verdict.v - b.m0.verdict.v : null, bm = (o.m0.verdict.bandMax !== null && b.m0.verdict.bandMax !== null) ? Math.max(o.m0.verdict.bandMax, b.m0.verdict.bandMax) : null;
      let same = true; for (const N of ws) for (const d of ds) { const x = o.m0.byWin[N].byDiv[d], y = b.m0.byWin[N].byDiv[d]; if (!(x && y && Object.is(x.q11, y.q11) && Object.is(x.q10, y.q10))) same = false; }
      o.vsV0 = { dv, bandMax: bm, within: (dv !== null && bm !== null) ? Math.abs(dv) <= bm : null, overBand: (dv !== null && bm > 0) ? Math.abs(dv) / bm : null, bitSame: same, dSidS: (Number.isFinite(o.sid.dSidS) && Number.isFinite(b.sid.dSidS)) ? o.sid.dSidS - b.sid.dSidS : null };
    }
    if (o.sys === 'three') { const t = out.cells[o.v + '|' + o.sat + '|two'] || null, t0 = out.cells['V0|' + o.sat + '|two'] || null, tw = t || t0;
      o.vsTwo = tw && Number.isFinite(o.m0.verdict.v) && Number.isFinite(tw.m0.verdict.v) ? { twoFrom: t ? o.v : 'V0', dv: o.m0.verdict.v - tw.m0.verdict.v, rel: (o.m0.verdict.v - tw.m0.verdict.v) / Math.abs(tw.m0.verdict.v) } : null; }
  }
  // 衛星ごとの答え(三体 —— どの変種で決まったか)
  out.answer = {};
  for (const sat of J.E.sats) {
    const vs = J.E.cells.filter((c) => c.sat === sat && c.sys === 'three').map((c) => c.v);
    out.answer[sat] = { determinedBy: vs.filter((v) => out.cells[v + '|' + sat + '|three'].m0.verdict.determined), tried: vs,
      twoDetermined: out.cells['V0|' + sat + '|two'] ? out.cells['V0|' + sat + '|two'].m0.verdict.determined : null };
  }
  return out;
}

/* ───────── 門(器の健全さ —— 判定〔A〕は結果で、ここに入れない)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.T) g.seedsFinite = Object.values(J.T.systems).every((t) => [t.m, t.R, t.a, t.e, t.iEqDeg, t.spin, t.PDays].every(Number.isFinite) && t.e >= 0 && t.e < 1 && t.a > 0);
  if (J.D) {
    g.decompSum = Object.values(J.D.parents).every((p) => p.omSunPAbs > 0 && Object.values(p.sumCheck).every((z) => z.ok && z.relErr <= 1e-12));
    g.galaxyAxis = Math.abs(J.D.galaxy.dotNgp + 1) <= 1e-12;
  }
  if (J.P) {
    g.inPosDecl = Object.values(J.P.inPos).length === C.IN_POS_BOOKS.length && Object.values(J.P.inPos).every(Boolean);
    const cs = Object.entries(J.P.cells);
    g.probeAccepted = cs.every(([, o]) => o.accepted);
    g.v2Decl = cs.filter(([k]) => k.startsWith('V2|')).every(([, o]) => JSON.stringify(o.drag) === JSON.stringify(C.IN_POS_K1_DRAG));
    g.galaxyFactor = cs.filter(([k]) => k.startsWith('V6')).every(([, o]) => o.galaxy && o.galaxy.active && o.galaxy.denominator === 'none' && o.galaxy.planetFactor === 1 && o.galaxy.maxDev <= ULP4);
    const v3 = cs.filter(([k]) => k.startsWith('V3|')); if (v3.length) g.v3Shift = v3.every(([, o]) => o.v3 && o.v3.planetAtOrigin && o.v3.relDevMax <= 1e-9);
  }
  if (J.E) {
    const runs = Object.values(J.E.runs);
    g.noRejected = runs.every((r) => r.status === 'run');
    g.runsComplete = runs.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && !r.unbound && J.E.windows.every((N) => r.m0[N] && r.m0[N].nOk && Number.isFinite(r.m0[N].aps) && r.pass[N] && r.pass[N].complete && Number.isFinite(r.pass[N].aps)));
    g.allRows = Object.keys(J.E.index).length === J.E.cells.length * KINDS.length * J.E.divs.length && Object.values(J.E.index).every((k) => J.E.runs[k]);
    // q10 は V3 を除き V0 と同じ本 —— 同じ走行(本の sha の鍵が同じ)
    g.q10Shared = J.E.cells.filter((c) => !C.changesQ10(C.variantOf(c.v))).every((c) => J.E.divs.every((d) => { const z = { v: 'V0', sat: c.sat, sys: c.sys }; const a = J.E.index[rowKey(c, 'q10', d)], b = J.E.index[rowKey(z, 'q10', d)]; return !b || a === b; }));
    if (J.prefix && !J.quick) g.prefix316 = J.prefix.compared > 0 && J.prefix.same === J.prefix.compared;   // 試走(S 360・8 公転)は第316便d の行と同じ本でない —— 照合しない
  }
  return g;
}

/* ───────── 第316便d の走行との照合(V0 の通過の窓 —— 同じ本・同じ步)───────── */
export function prefixOf(J, Js) {
  const out = { source: SATH_OUT, compared: 0, same: 0, diff: [] };
  if (!Js || !Js.E) return Object.assign(out, { note: '第316便d の正本が無い' });
  for (const c of J.E.cells) { if (c.v !== 'V0') continue;
    for (const kind of KINDS) for (const d of J.E.divs) {
      const r = rowOf(J, c, kind, d), k = X315.specKey({ sat: c.sat, sys: c.sys, kind, S: J.E.stepsPerOrbit, div: d, N: Js.E.runN }), o = Js.E.rows[k];
      if (!r || !o || o.status !== 'run') continue;
      for (const N of Js.E.windows) { if (!r.pass[N] || !o.windows[N]) continue; out.compared++;
        const same = ['sidDays', 'aps', 'node', 'axSat', 'axPar', 'eMean', 'incMeanDeg'].every((f) => Object.is(r.pass[N][f], o.windows[N][f]));
        if (same) out.same++; else if (out.diff.length < 8) out.diff.push(k + '@' + N); } } }
  return out;
}
/** 所要(行ごとの壁時計 —— 段の見積り) */
export function costOf(J) {
  const runs = Object.values(J.E.runs).filter((r) => r.status === 'run'), byVar = {};
  for (const [rk, key] of Object.entries(J.E.index)) { const r = J.E.runs[key]; if (!r) continue; const v = rk.split('|')[0]; byVar[v] = byVar[v] || { rows: 0 }; byVar[v].rows++; }
  return { runs: runs.length, rowsIndexed: Object.keys(J.E.index).length, wallSec: runs.reduce((a, r) => a + r.wallSec, 0), steps: runs.reduce((a, r) => a + r.steps, 0), byVariant: byVar };
}

/* ───────── 走行の計画 ───────── */
export const packJson = X316.packJson;
export async function runSatcut(HP, o) {
  const P = o.plan, sats = o.sats, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const cells = cellsOf(P, sats);
  const J = { stage: 'satcut', quick: !!o.quick, explore: !!o.explore, sats: sats.slice(), kernel: 'k1', nLoc: 2, rule: 'rdRule:"kappaM"(全天体 R_d = Y_k m —— 鍵の名は r_d・説明は R_d)・G_loc {law:"kappaC2"}(n = 2)',
    plan: clone(P), harmRule: clone(HARM_RULE), measure: { key: 'M0', note: 'L 模型(apsisRate —— 慣性速度の接触の離心ベクトルの成分の回帰・位置の角の 1〜3 倍の調和)を窓の終端 t₁ = N·P_seed(P_seed = timeRef.pRef —— 切りは t_k ≤ N·P_seed + h/2)で q10 と q11 に当てた差。走行は runN·S·div 步(共通の座標時刻)かつ runN 回目の通過まで' },
    variants: C.VARIANTS.map((v) => ({ key: v.key, group: v.group, ja: v.ja, systems: v.systems.slice(), sats: v.sats ? v.sats.slice() : null, f: v.f === undefined ? null : v.f, r: v.r === undefined ? null : v.r, pairs: v.pairs ? clone(v.pairs) : null })) };
  J.book = { units: clone(L.UNITS), softening: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, integrator: L.INTEGRATOR, gLoc: clone(L.GLOC), k1Drag: clone(L.K1_RULE_DRAG), inPosDrag: clone(C.IN_POS_K1_DRAG),
    declFile: L.DECL_FILE, libFrom: 'tests/lib-w315d-satk1.mjs(bookOf・seedOf・attachSatSampler・windowOf)+ tests/lib-w317c-satcut.mjs(variantBook・decompOf・m0Of)',
    notIncluded: ['母惑星の J₂ と潮汐(在位の本が持たない —— 第315便d と同じ)', '他の衛星と他の惑星(衛星ごとに 1 本 —— 第315便d と同じ)'] };
  J.T = { systems: X315.targetsOf(HP, sats) }; tick('T');
  J.D = partD(HP, sats); tick('D');
  J.P = partP(HP, sats, cells, P.stepsPerOrbit); tick('P');
  const index = {}, runs = {}, jobs = [], seeds = {}, decs = {};
  for (const c of cells) {
    const sd = seeds[c.sat] || (seeds[c.sat] = L.seedOf(HP, c.sat));
    for (const kind of KINDS) for (const d of P.divs) {
      const sp = { v: c.v, sat: c.sat, sys: c.sys, kind, S: P.stepsPerOrbit, div: d, N: P.runN, wins: P.windows.slice() };
      const dec = needsDecomp(c.v) && kind === 'q11' ? (decs[sd.parent] || (decs[sd.parent] = C.decompOf(HP, sd.parent))) : null;
      const b = specBook(HP, sp, { seed: sd, decomp: dec }), key = runKeyOf(b, sp);
      index[rowKey(c, kind, d)] = key;
      jobs.push(o.run(key, sp, (kind === 'q11' ? 100 : 1) * d * (c.sys === 'three' ? 2 : 1)).then((r) => { if (!runs[key]) { runs[key] = Object.assign({ key }, r); o.log(key, r); } return r; }));
    }
  }
  await Promise.all(jobs);
  J.E = { sats: sats.slice(), cells, runN: P.runN, windows: P.windows.slice(), divs: P.divs.slice(), stepsPerOrbit: P.stepsPerOrbit, index, runs };
  J.prefix = prefixOf(J, o.sath || null);
  tick('E');
  J.A = partA(J); tick('A');
  J.cost = costOf(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W317C_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpecC(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W317C_QUICK === '1', explore = process.env.W317C_EXPLORE === '1';
  const OUT = process.env.W317C_OUT ? (path.isAbsolute(process.env.W317C_OUT) ? process.env.W317C_OUT : path.join(ROOT, process.env.W317C_OUT)) : path.join(ROOT, OUT_SATCUT);
  if ((quick || explore) && !process.env.W317C_OUT) throw new Error('試走(W317C_QUICK=1)と探索(W317C_EXPLORE=1)は W317C_OUT を指定する(正本を書かない)');
  const sats = process.env.W317C_SATS ? process.env.W317C_SATS.split(',') : SATS.slice();
  if (sats.some((k) => !L.satOf(k))) throw new Error('W317C_SATS は ' + SATS.join(',') + ' から');
  if (!process.env.W317C_OUT && sats.length !== SATS.length) throw new Error('正本は 6 衛星(一部は W317C_OUT へ)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  let sath = null; try { sath = JSON.parse(fs.readFileSync(path.join(ROOT, SATH_OUT), 'utf8')); } catch (e) { sath = null; }
  const NW = Math.max(1, Number(process.env.W317C_WORKERS) || 2), cstat = { resumed: 0, shared: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W317C_CACHE ? path.resolve(process.env.W317C_CACHE) : null, targetSha256, cstat);
  const log = (key, r) => { const sp = r.spec, m = r.m0 ? r.m0[sp.N] : null;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${sp.v}|${sp.sat}|${sp.sys}|${sp.kind}|div=${sp.div}: ${r.status}${r.status === 'run' ? '・M0 ' + (m ? m.aps.toExponential(9) : '—') + '・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`); };
  const plan = quick ? QUICK : (explore ? EXPLORE : PLAN);
  console.log('第317便c satcut: ' + (quick ? '試走' : (explore ? '探索' : '正本')) + '・workers ' + NW + '・衛星 ' + sats.join(',') + '・変種 ' + Object.keys(plan.cover).join(','));
  const R = await runSatcut(HP, { quick, explore, plan, sats, run, log, sath });
  const out = { version: HARNESS_VERSION, libVersion: C.LIB_VERSION, satk1LibVersion: L.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, sathVersion: X316.HARNESS_VERSION, generator: 'tests/exp-w317c-satcut.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の裁定(第119報)「AN431: 衛星の三体の永年の効きが 6 衛星とも帯の内で決まらないについて、何が必要かを探索する」・同 補足 1(軸引きずりを太陽由来と銀河由来に分解する)・'
      + '原仮定者の裁定(第119報 補足)AN435: (b) を主に(太陽と母惑星の二体の母惑星の軸の ω の和を保つ分解 —— (a) 足すは対照)・統括の検証項目 R252。確認の材料(在位へ入れない —— 近似要素の種は観測レコードではない・ω_G は変種の値で銀河の模型からの数ではない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.shared = cstat.shared;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w317c-satcut.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/exp-w316d-sath.mjs', 'tests/exp-w315d-satk1.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第317便c', target: TARGET, code: CODE, inputs: [TARGET, L.DECL_FILE, SATH_OUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satcut',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W317C_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, packJson(out) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(Object.fromEntries(Object.entries(out.A.answer).map(([k, v]) => [k, v.determinedBy.join('・') || '—']))));
}
if (IS_MAIN) await main();

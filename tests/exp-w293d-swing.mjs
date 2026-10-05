// 第293便d(原仮定者の裁定(第83報)「ブランコ … 摂動が消えてもしばらく継続する物理法則が必要」・統括の検証項目 R144)——
// **月の 8.85 年の摂動停止診断**の器(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// エンジン本体を走らせる。走行は子プロセスで並列)。**診断だけ** —— 新しい力・新しい法則は足さない・C_d は再フィットしない。
//
// ■ 何を測るか(「原因」と「継続」を現行エンジンで切り分ける)
//   一時プリセット(器の中だけ —— 内蔵にしない): 🔆 emAuditSolar の bodies(太陽 pinned・地球・月 —— 1 字も変えない)に、🌛 earthMoonInertial の
//   physics(geoPN 0・kFrame 0・relativeDrag:{law:"inertial", gain 514182, eps 0.1, history:"positions"}・地球の dragCore{0.325, 3.48})を重ねる。
//   🔆 は 1 単位 = 10⁸ m / 10⁴ s / 10²⁷ kg、🌛 は 10⁶ m / 10² s / 10²⁵ kg —— 長さ・時間・質量の単位がそろって 100 倍なので
//   速度・G・c・κ は同じ数で、次元のある量だけを換算する(**物理量としては同じ宣言**):
//     gain [L³/M] 514182 → 51.4182 ・ eps [L] 0.1 → 0.001 ・ dragCore.radius [L] 3.48 → 0.0348 ・ massFloor [M] 1e-6 → 1e-8。
//     重力の軟化 softening [L] は 0.1 → 0.001 が受理の値域 [0.01, 20] の外なので、🔆 の宣言 0.01(= 1000 km —— 🔆 と同じ)を使う。
//     構造核の表の r_max は「初期配置で源から最も遠い粒子までの距離 × 4」が既定 —— 太陽まで張ると表が粗くなるので、
//     🌛 と同じ規則を地球–月の初期距離に当てた値を `coreTable.rMax` に宣言する(太陽は表の外 = 点源核・pinned なので受け手にならない)。
//   換算の橋: 🌛 そのものをこの換算で 🔆 の単位へ写した行(bridge)を dt 0.016・0.008・0.0016 で走らせ、正本 dragcore-w292c.json の
//   27 公転窓 8.850 年と比べる(差は重力の軟化の下限 0.01 が主 —— 再フィットはしない)。
//
//   条件(各 118 公転・dt 0.016 と 0.008):
//     A1 太陽あり・慣性あり —— 太陽は**重力の第三体だけ**(relativeDrag.pairs=[[地球,月]])
//     A2 太陽あり・慣性あり —— 太陽を**重力と慣性の対和の両方**に入れる(pairs 宣言なし = 全対)
//     B  太陽なし・慣性あり(太陽の質量を t=0 で 0 —— 🌛 相当。地球–月の初期状態は 🔆 のまま)
//     C  太陽あり・慣性なし(gain 0)
//     D  太陽なし・慣性なし(gain 0)
//     Bdrop 太陽を bodies から外した B(m=0 の扱いが「対から外す」と同じかの対照)・S 🔆 そのまま(内蔵の宣言のまま —— 参照)
//   停止の枝(法則 3 通り {A1, A2, C} × 停止 {瞬時, 3 公転で滑らかに} × 位相 {近点, 遠点} × dt {0.016, 0.008} = 24 走行):
//     太陽ありで 27 公転走ったあと、次の近点(遠点)を検出した步の終わりで (a) 太陽の質量を瞬時に 0 /(b) 余弦の傾斜で 3 恒星月かけて 0。
//     太陽が消えた後の最初の公転の境から 27 公転 × 2 窓で近点率・離心率・恒星月・近点月を記録する。
//     各枝は「太陽が消えた瞬間の状態から作り直した対照」(再起動 —— 位置と速度だけを運び、引きずりの座標の履歴〔1 步〕は捨てる)と比べる。
//   評価量: 近点の平均回転率(検出器 B —— 位置だけ・lib-w280b-emgrid の fitPeri)と公転ごとの増分の散らばり(周期変動)・
//     離心率ベクトル(近点ごとの向き ϖ_k と大きさ e_k =(r_遠−r_近)/(r_遠+r_近)—— 頂点は 3 点の放物線)・恒星月/近点月・
//     u(慣性引きずりの移送速度 —— 相対の |u_月−u_地球|/|v_相対|)・帳簿(相対軌道の E と h・引きずりの仕事 work と角運動量 dL)。
//
// ■ しないこと・言わないこと
//   ・新しい力・新しい法則を足さない。C_d・f・R_c を再フィットしない(🌛 の 514182 を換算して使うだけ)。
//   ・太陽の引きずりと地球の引きずりを別々に作って足さない(実装の u は同一座標・同一步の対について相対速度に線形 —— 合成則は第293便e)。
//   ・「月を再現した」「摂動の記憶を示した」「原因を同定した」「GR の何 PN と同定」と書かない。
//
// 実行(Node だけ・Chromium 不要・子プロセス 3 本 —— W293D_WORKERS で変える。結果は並列数に依らない):
//   node tests/exp-w293d-swing.mjs            → 正本 tests/out/swing-w293d.json(W293D_OUT で出力先を変える)
// 読む正本: tests/out/dragcore-w292c.json(🌛 の 27 公転窓の近点周期と gain —— 橋の比較だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { fitPeri } from './lib-w280b-emgrid.mjs';
const REGEN_SCOPE = {"presets":["earthMoonInertial","emAuditSolar"],"roots":["HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.inertialDragState","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w293d-swing-1';
export const SOLAR_ID = 'emAuditSolar';
export const BOOK_ID = 'earthMoonInertial';
export const TMP_ID = 'w293dSwingTmp';            // 一時プリセットの id(内蔵にしない —— allPresets に無いこと)
export const UNIT_RATIO = 100;                     // 🌛 → 🔆: 長さ・時間・質量とも 1/100(速度・G・c・κ は同じ数)
export const YEAR_U = 365.25 * 86400 / 1e4;        // 🔆 系のユリウス年(1 単位 = 10⁴ s)= 3155.76
export const DAY_U = 86400 / 1e4;                  // 8.64
export const DRAG_CORE_DECL = Object.freeze({ massFrac: 0.325, radius: 3.48 });   // 🌛 の宣言(🌛 単位)
export const RUN = Object.freeze({ dt: 0.016, dtHalf: 0.008, dtFine: 0.0016, prefix: 27, ramp: 3, post: 27, longOrbits: 118, bridgeOrbits: 27 });
export const BASE_SPANS = Object.freeze([[0, 27], [27, 54], [54, 81], [81, 108], [0, 118]]);
export const LAWS = Object.freeze({
  sunGrav: Object.freeze({ label: '太陽=重力の第三体だけ(引きずりの対は地球–月)', gain: 'book', sunInDrag: false }),
  sunBoth: Object.freeze({ label: '太陽=重力と慣性の対和の両方', gain: 'book', sunInDrag: true }),
  gain0: Object.freeze({ label: '慣性引きずりなし(gain 0)', gain: 0, sunInDrag: true }),
});
export const CONDITIONS = Object.freeze([
  { key: 'A1', law: 'sunGrav', sun: 'on', label: '太陽あり・慣性あり(太陽=重力だけ)' },
  { key: 'A2', law: 'sunBoth', sun: 'on', label: '太陽あり・慣性あり(太陽=重力と対和)' },
  { key: 'B', law: 'sunBoth', sun: 'off', label: '太陽なし・慣性あり(🌛 相当)' },
  { key: 'C', law: 'gain0', sun: 'on', label: '太陽あり・慣性なし' },
  { key: 'D', law: 'gain0', sun: 'off', label: '太陽なし・慣性なし' },
  { key: 'Bdrop', law: 'sunBoth', sun: 'drop', label: '太陽を bodies から外した B(対照)' },
  { key: 'S', law: null, sun: 'asIs', label: '🔆 そのまま(内蔵の宣言)' },
]);
// 太陽ありの続き(停止しなかった場合)を、枝の停止後の 2 窓と同じ公転の番号で読むための窓の起点(停止後の最初の公転の境 = 28〜34)
export const CONT_FROM = Object.freeze([28, 29, 30, 31, 32, 33, 34]);
export const BRANCH_LAWS = Object.freeze([['A1', 'sunGrav'], ['A2', 'sunBoth'], ['C', 'gain0']]);
export const STOP_MODES = Object.freeze(['instant', 'smooth']);
export const STOP_PHASES = Object.freeze(['peri', 'apo']);
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);

/* ── 一時プリセット ─────────────────────────────────────────── */
/** 🌛 の physics を 🔆 の単位へ(次元のある量だけ)。重力の軟化は受理の値域の下限 = 🔆 の宣言 0.01。 */
export function swingPhysics(HP) {
  const book = find(HP, BOOK_ID), sol = find(HP, SOLAR_ID);
  const ph = clone(book.physics), L = UNIT_RATIO, M = UNIT_RATIO;
  const out = clone(ph);
  out.softening = sol.physics.softening;                         // 0.1/100 = 0.001 は受理の値域 [0.01, 20] の外 → 🔆 と同じ 0.01
  out.massFloor = ph.massFloor / M;
  out.relativeDrag = Object.assign({}, ph.relativeDrag, { gain: ph.relativeDrag.gain / (L * L * L / M), eps: ph.relativeDrag.eps / L });
  return out;
}
export function conversionTable(HP) {
  const book = find(HP, BOOK_ID), sol = find(HP, SOLAR_ID), ph = swingPhysics(HP);
  return {
    units: { book: '1 単位 = 10⁶ m / 10² s / 10²⁵ kg(🌛)', solar: '1 単位 = 10⁸ m / 10⁴ s / 10²⁷ kg(🔆)', ratio: UNIT_RATIO, same: ['G', 'cLight', 'kappaT', '速度'] },
    rows: [
      { key: 'relativeDrag.gain', dim: 'L³/M', book: book.physics.relativeDrag.gain, solar: ph.relativeDrag.gain },
      { key: 'relativeDrag.eps', dim: 'L', book: book.physics.relativeDrag.eps, solar: ph.relativeDrag.eps },
      { key: 'dragCore.radius', dim: 'L', book: DRAG_CORE_DECL.radius, solar: DRAG_CORE_DECL.radius / UNIT_RATIO },
      { key: 'massFloor', dim: 'M', book: book.physics.massFloor, solar: ph.massFloor },
      { key: 'softening', dim: 'L', book: book.physics.softening, solar: ph.softening, note: '換算値 0.001 は受理の値域 [0.01, 20] の外 —— 🔆 の宣言 0.01 を使う(換算どおりではない唯一の量)' },
    ],
    earthRadius: { book: book.bodies[0].radius, solar: sol.bodies[1].radius, note: '地球の半径は 🔆 の宣言(0.06371 = 6371 km)のまま —— 🌛 は 6.38(= 6380 km)' },
  };
}
/** law: 'sunGrav' | 'sunBoth' | 'gain0'。opts.drop: 太陽を bodies から外す。opts.state: [{x,y,vx,vy}…](再起動の対照)。 */
export function swingPreset(HP, law, opts = {}) {
  const sol = clone(find(HP, SOLAR_ID));
  const L = LAWS[law];
  const p = { id: TMP_ID, name: '第293便d の一時プリセット(🔆 の bodies + 🌛 の physics)', emoji: '🎠', description: '第293便d の器の中だけの一時プリセット(内蔵にしない)', group: sol.group, scaleTier: sol.scaleTier, scaleExp: clone(sol.scaleExp),
    camera: clone(sol.camera), world: clone(sol.world), overlays: clone(sol.overlays) };
  p.physics = swingPhysics(HP);
  const bodies = clone(sol.bodies);
  bodies[1].dragCore = { massFrac: DRAG_CORE_DECL.massFrac, radius: DRAG_CORE_DECL.radius / UNIT_RATIO };
  const rEM = Math.hypot(bodies[2].x - bodies[1].x, bodies[2].y - bodies[1].y);
  p.physics.relativeDrag.coreTable = { rMax: HP.DRAG_CORE_RMAX_FACTOR * rEM };   // 🌛 と同じ規則を地球–月の初期距離に当てた値(太陽までは張らない)
  if (L.gain === 0) p.physics.relativeDrag.gain = 0;
  if (!L.sunInDrag) p.physics.relativeDrag.pairs = [[1, 2]];
  if (opts.state) opts.state.forEach((s, i) => { Object.assign(bodies[i], { x: s.x, y: s.y, vx: s.vx, vy: s.vy }); });
  p.bodies = opts.drop ? bodies.slice(1) : bodies;
  if (opts.drop && p.physics.relativeDrag.pairs) delete p.physics.relativeDrag.pairs;
  return p;
}
/** 🌛 そのものを 🔆 の単位へ写した写し(換算の橋)。 */
export function bridgePreset(HP) {
  const book = clone(find(HP, BOOK_ID));
  const p = { id: TMP_ID + 'Bridge', name: '第293便d の換算の橋(🌛 を 🔆 の単位へ)', emoji: '🎠', description: '第293便d の器の中だけの換算の橋(内蔵にしない)', group: book.group, camera: clone(book.camera), world: clone(book.world) };
  p.physics = swingPhysics(HP);
  p.bodies = book.bodies.map((b) => { const c = clone(b); c.m /= UNIT_RATIO; c.radius /= UNIT_RATIO; c.x /= UNIT_RATIO; c.y /= UNIT_RATIO; c.spin *= UNIT_RATIO;
    if (c.dragCore) c.dragCore = { massFrac: c.dragCore.massFrac, radius: c.dragCore.radius / UNIT_RATIO }; return c; });
  return p;
}
function buildFor(HP, spec) {
  let p, ci = 1, oi = 2;
  if (spec.sun === 'asIs') p = clone(find(HP, SOLAR_ID));
  else if (spec.kind === 'bridge') { p = bridgePreset(HP); ci = 0; oi = 1; }
  else p = swingPreset(HP, spec.law, { drop: spec.sun === 'drop', state: spec.state || null });
  if (spec.sun === 'drop') { ci = 0; oi = 1; }
  const v = HP.validatePreset(clone(p));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset);
  const S = HP.sim;
  if (spec.sun === 'off') sunOff(S);
  return { S, ci, oi, warnings: v.warnings || [], preset: v.preset };
}
/** 太陽(粒子 0)の質量を 0 にする(m と、重力が読む mEff の両方 —— 太陽は明示半径なので updateRadii は走らず床は掛からない)。 */
export function sunOff(S) { S.m[0] = 0; S.mEff[0] = 0; }
function stateHash(S) {
  let h1 = 0x811c9dc5, h2 = 0x01000193; const f = new Float64Array(1), u8 = new Uint8Array(f.buffer);
  const num = (v) => { f[0] = v; for (let k = 0; k < 8; k++) { h1 = Math.imul(h1 ^ u8[k], 16777619) >>> 0; h2 = Math.imul(h2 ^ u8[k], 2246822519) >>> 0; } };
  for (const k of ['x', 'y', 'vx', 'vy', 'm', 'mEff', 'carVx', 'carVy', 'rdPrevX', 'rdPrevY', 'rdPrevT']) { const a = S[k]; if (a) for (let i = 0; i < S.n; i++) num(a[i]); }
  num(S.t);
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}
function snapState(S) { const o = {}; for (const k of ['x', 'y', 'vx', 'vy']) o[k] = Array.from(S[k].subarray(0, S.n)); return o; }
function maxJump(a, b) { let m = 0; for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < a[k].length; i++) m = Math.max(m, Math.abs(a[k][i] - b[k][i])); return m; }
/** 相対軌道の帳簿(E は軟化つき E4 の核 −μ/√(r²+ε²)・h = r×v・離心率は速度 v〔慣性速度〕で作った接触値 —— 引きずりのある行では ẋ=v+u と違う)。 */
function ledgerAt(HP, S, ci, oi, t) {
  const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci], dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
  const r = Math.hypot(dx, dy), eps = S.params.softening || 0, mu = S.params.G * (S.m[ci] + S.m[oi]);
  const v2 = dvx * dvx + dvy * dvy, E = 0.5 * v2 - mu / Math.sqrt(r * r + eps * eps), h = dx * dvy - dy * dvx;
  const ex = (dvy * h) / mu - dx / r, ey = (-dvx * h) / mu - dy / r;
  const st = HP.inertialDragState(S);
  return { t, E, h, eOsc: Math.hypot(ex, ey), varpiOsc: Math.atan2(ey, ex), sunMass: ci === 1 ? S.m[0] : null,
    drag: st ? { work: st.work, dL: st.dL, uMax: st.uMax, boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, sumMu: st.sumMu, sumMxU: st.sumMxU } : null };
}

/* ── 走行 ────────────────────────────────────────────────── */
/**
 * spec: { key, kind:'cond'|'branch'|'bridge', law, sun:'on'|'off'|'drop'|'asIs', dt, revMax?, spans?,
 *         stop?:{mode:'instant'|'smooth', phase:'peri'|'apo', after, ramp, post}, keepSeries?, restart?:true }
 * 検出器 B(相対距離の極小 —— 3 点の放物線の頂点・位置だけ)は lib-w280b-emgrid の runRow と同じ式・同じ順序。遠点は極大を同じ放物線で取る。
 */
export function runSwing(HP, spec, cont = null) {
  const t0w = Date.now();
  const { S, ci, oi, warnings } = buildFor(HP, spec);
  if (cont) sunOff(S);
  const dt = spec.dt, tOff = cont ? cont.t : 0;
  const rel = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci]; return [Math.hypot(dx, dy), Math.atan2(dy, dx)]; };
  let [r0, th0] = rel();
  const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
  const mu0 = S.params.G * (S.m[ci] + S.m[oi]), a0 = 1 / (2 / r0 - (dvx0 * dvx0 + dvy0 * dvy0) / mu0), P0 = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu0);
  let angPrev = th0, angAcc = cont ? cont.angAcc : 0, r1 = r0, r2 = r0, th1 = th0, th2 = th0;
  const rev = cont ? new Array(cont.revN).fill(null) : [], rMinRev = cont ? new Array(cont.revN).fill(null) : [], rMaxRev = cont ? new Array(cont.revN).fill(null) : [];
  const B = [], A = [];
  const ledger = [ledgerAt(HP, S, ci, oi, tOff)];
  const m0 = S.m[0];
  const stop = spec.stop || null;
  let stopInfo = null, rampT0 = null, rampT = null, gone = cont ? { t: tOff, revN: cont.revN, step: 0 } : (spec.sun === 'on' || spec.sun === 'asIs' ? null : { t: 0, revN: 0, step: 0 });
  let revMax = spec.revMax || Infinity, nan = false, k = 0;
  const uAcc = { withSun: { n: 0, sum: 0, max: 0 }, free: { n: 0, sum: 0, max: 0 } };
  for (; ; k++) {
    // 滑らかな停止: 步の前に太陽の質量を傾斜(余弦)で下げる
    if (rampT0 !== null && !gone) {
      const tNow = tOff + k * dt, s = (tNow - rampT0) / rampT;
      if (s >= 1) { sunOff(S); gone = { t: tNow, revN: rev.length, step: k, state: snapState(S), hash: stateHash(S), angAcc, ledger: ledgerAt(HP, S, ci, oi, tNow) }; revMax = rev.length + 1 + 2 * stop.post; }
      else { const w = 0.5 * (1 + Math.cos(Math.PI * Math.max(0, s))); S.m[0] = m0 * w; S.mEff[0] = S.m[0]; }
    }
    S.step(dt);
    const t = tOff + (k + 1) * dt;
    const [rr, th] = rel();
    if (!Number.isFinite(rr)) { nan = true; break; }
    const ri = rev.length;
    if (rMinRev.length <= ri) { rMinRev.push(Infinity); rMaxRev.push(-Infinity); }
    if (rr < rMinRev[ri]) rMinRev[ri] = rr; if (rr > rMaxRev[ri]) rMaxRev[ri] = rr;
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push(tOff + (k + fr) * dt); }
    let newPeri = false, newApo = false;
    if (k >= 2 && ((r1 < r2 && r1 < rr) || (r1 > r2 && r1 > rr))) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      const ang = a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), rv = (dd !== 0) ? r1 - (r2 - rr) * (r2 - rr) / (8 * dd) : r1;
      if (r1 < r2) { B.push({ ang, t: tOff + (k + fr) * dt, r: r1, rv }); newPeri = true; } else { A.push({ ang, t: tOff + (k + fr) * dt, r: r1, rv }); newApo = true; }
    }
    r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if ((k & 255) === 0 && S._rdUX) {
      const ux = S._rdUX[oi] - S._rdUX[ci], uy = S._rdUY[oi] - S._rdUY[ci], vx = S.vx[oi] - S.vx[ci], vy = S.vy[oi] - S.vy[ci];
      const q = Math.hypot(ux, uy) / Math.hypot(vx, vy), U = gone ? uAcc.free : uAcc.withSun;
      U.n++; U.sum += q; if (q > U.max) U.max = q;
    }
    // 停止の引き金: prefix 公転の後の最初の近点/遠点(検出した步の終わり)
    if (stop && !stopInfo && rev.length >= stop.after && ((stop.phase === 'peri' && newPeri) || (stop.phase === 'apo' && newApo))) {
      const before = snapState(S), hash = stateHash(S);
      stopInfo = { t, step: k + 1, revN: rev.length, hash, ledger: ledgerAt(HP, S, ci, oi, t) };
      if (stop.mode === 'instant') {
        sunOff(S);
        const after = snapState(S);
        stopInfo.jump = maxJump(before, after);
        gone = { t, revN: rev.length, step: k + 1, state: after, hash: stateHash(S), angAcc, ledger: ledgerAt(HP, S, ci, oi, t) };
        revMax = rev.length + 1 + 2 * stop.post;
      } else {
        const n = rev.length; rampT = stop.ramp * (rev[n - 1] - rev[0]) / (n - 1); rampT0 = t; stopInfo.jump = 0; stopInfo.rampT = rampT;
      }
    }
    if (rev.length >= revMax) { k++; break; }
  }
  const raw = { dt, rev, B, A, rMinRev, rMaxRev, osc0: { r: r0, a: a0, P: P0 }, t0: tOff };
  ledger.push(ledgerAt(HP, S, ci, oi, tOff + k * dt));
  const st = HP.inertialDragState(S);
  return { raw, gone, stopInfo, ledger, uAcc, nan: nan || S.hasNaN(), steps: k, wallSec: (Date.now() - t0w) / 1000, warnings,
    drag: st ? { boundMax: st.boundMax, boundOver: st.boundOver, reject: st.reject, noHistory: st.noHistory, uMax: st.uMax, work: st.work, dL: st.dL, sumMu: st.sumMu, sumMxU: st.sumMxU } : null,
    core: HP.dragCoreState(S) };
}

/* ── 窓の集計 ──────────────────────────────────────────────── */
/** 近点ごとの離心率ベクトル(向き ϖ_k は検出器 B の方位・大きさ e_k は直後の遠点との (r_遠−r_近)/(r_遠+r_近) —— 3 点の放物線の頂点)。 */
export function eSeries(raw) {
  const out = []; let j = 0;
  for (const p of raw.B) { while (j < raw.A.length && raw.A[j].t <= p.t) j++; if (j >= raw.A.length) break; const ra = raw.A[j].rv, rp = p.rv; out.push({ t: p.t, ang: p.ang, e: (ra - rp) / (ra + rp) }); }
  return out;
}
/** 区間 [a,b) 公転の fit(fitPeri —— 近点側だけ・重複除去・unwrap)と公転ごとの増分の散らばり・離心率・恒星月・近点月。 */
export function windowFitU(raw, a, b) {
  const { rev, B, dt } = raw;
  if (rev.length < b || (a > 0 && rev[a - 1] === null)) return { from: a, to: b, complete: false };
  const tA = a > 0 ? rev[a - 1] : raw.t0, tB = rev[b - 1];
  let rMin = Infinity, rMax = -Infinity;
  for (let i = a; i < b; i++) { if (raw.rMinRev[i] < rMin) rMin = raw.rMinRev[i]; if (raw.rMaxRev[i] > rMax) rMax = raw.rMaxRev[i]; }
  const sel = B.filter((p) => p.t > tA && p.t <= tB).map((p) => ({ ang: p.ang, k: p.t / dt, r: p.r }));
  const f = fitPeri(sel, rMin, rMax, raw.osc0.P, dt);
  // fitPeri と同じ選別(近点側・重複除去・unwrap)で公転ごとの増分
  const mid = 0.5 * (rMin + rMax), keep = [];
  for (const p of sel.filter((q) => q.r <= mid)) { if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * raw.osc0.P) continue; keep.push(p); }
  const ang = []; for (let i = 0; i < keep.length; i++) { let x = keep[i].ang; if (i) { let z = x - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; x = ang[i - 1] + z; } ang.push(x); }
  const inc = []; for (let i = 1; i < ang.length; i++) inc.push(ang[i] - ang[i - 1]);
  const im = inc.reduce((s, x) => s + x, 0) / Math.max(1, inc.length), isd = Math.sqrt(inc.reduce((s, x) => s + (x - im) * (x - im), 0) / Math.max(1, inc.length - 1));
  const es = eSeries(raw).filter((z) => z.t > tA && z.t <= tB).map((z) => z.e);
  const eMean = es.length ? es.reduce((s, x) => s + x, 0) / es.length : null;
  const apsYr = f.slopeDegPerTime ? 360 / f.slopeDegPerTime / YEAR_U : null;
  const sidDays = a > 0 ? (rev[b - 1] - rev[a - 1]) / (b - a) / DAY_U : (rev[b - 1] - rev[0]) / (b - 1) / DAY_U;
  return { from: a, to: b, complete: true, nPeri: f.nPeri, eProxy: (rMax - rMin) / (rMax + rMin), eMean, eMin: es.length ? Math.min(...es) : null, eMax: es.length ? Math.max(...es) : null,
    dwRadPerPeri: f.slopeDegPerPeri === null ? null : f.slopeDegPerPeri * Math.PI / 180, apsPeriodYr: apsYr, residRmsDeg: f.residRmsDeg,
    incMeanRad: inc.length ? im : null, incSdRad: inc.length > 1 ? isd : null, incMinRad: inc.length ? Math.min(...inc) : null, incMaxRad: inc.length ? Math.max(...inc) : null,
    siderealDays: sidDays, anomDays: f.periMean ? f.periMean / DAY_U : null };
}
function compactSeries(raw) { return eSeries(raw).map((z) => [z.t, z.ang, z.e]); }

/* ── 子プロセスの仕事 ─────────────────────────────────────────── */
export function childTask(HP, spec) {
  if (spec.kind === 'cond' || spec.kind === 'bridge') {
    const R = runSwing(HP, spec);
    return { key: spec.key, kind: spec.kind, dt: spec.dt, steps: R.steps, wallSec: R.wallSec, nan: R.nan, warnings: R.warnings, osc0: R.raw.osc0, revN: R.raw.rev.length,
      windows: spec.spans.map(([a, b]) => windowFitU(R.raw, a, b)), cont: (spec.contFrom || []).map((a) => [windowFitU(R.raw, a, a + RUN.post), windowFitU(R.raw, a + RUN.post, a + 2 * RUN.post)]), ledger: R.ledger, drag: R.drag, core: R.core, uAcc: R.uAcc, series: spec.keepSeries ? compactSeries(R.raw) : null };
  }
  // 枝: 停止 → 後の 2 窓 → 太陽が消えた瞬間の状態からの再起動の対照
  const R = runSwing(HP, spec);
  const g = R.gone, P = spec.stop.post, a = g.revN + 1;
  const post = [[a, a + P], [a + P, a + 2 * P]];
  const pre = [[spec.stop.after - RUN.prefix, spec.stop.after]];
  const win = (raw, s) => s.map(([x, y]) => windowFitU(raw, x, y));
  // 公転ごとの増分(停止の前 3 本〜後 6 本)—— 減衰の尾の有無
  const es = eSeries(R.raw), iStop = es.findIndex((z) => z.t > R.stopInfo.t);
  const local = [];
  for (let i = Math.max(1, iStop - 3); i < Math.min(es.length, iStop + 7); i++) { let z = es[i].ang - es[i - 1].ang; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; local.push({ n: i - iStop, t: es[i].t, inc: z, e: es[i].e }); }
  const ctl = runSwing(HP, { key: spec.key + '-restart', kind: 'cond', law: spec.law, sun: 'on', dt: spec.dt, revMax: a + 2 * P, state: [0, 1, 2].map((i) => ({ x: g.state.x[i], y: g.state.y[i], vx: g.state.vx[i], vy: g.state.vy[i] })) },
    { t: g.t, angAcc: g.angAcc, revN: g.revN });
  return { key: spec.key, kind: 'branch', law: spec.law, mode: spec.stop.mode, phase: spec.stop.phase, dt: spec.dt, steps: R.steps, wallSec: R.wallSec + ctl.wallSec, nan: R.nan || ctl.nan,
    stop: { t: R.stopInfo.t, revN: R.stopInfo.revN, hash: R.stopInfo.hash, jump: R.stopInfo.jump, rampT: R.stopInfo.rampT || null, ledger: R.stopInfo.ledger },
    gone: { t: g.t, revN: g.revN, hash: g.hash, ledger: g.ledger }, pre: win(R.raw, pre), post: win(R.raw, post), local, end: R.ledger[R.ledger.length - 1], drag: R.drag, uAcc: R.uAcc,
    restart: { post: win(ctl.raw, post), end: ctl.ledger[ctl.ledger.length - 1], drag: ctl.drag, nan: ctl.nan, steps: ctl.steps },
    series: spec.keepSeries ? compactSeries(R.raw) : null };
}

/* ── 仕事の一覧 ─────────────────────────────────────────────── */
export function taskSpecs() {
  const out = [];
  for (const dt of [RUN.dt, RUN.dtHalf]) {
    for (const c of CONDITIONS) out.push({ key: `cond-${c.key}-${dt}`, kind: 'cond', law: c.law, sun: c.sun, dt, revMax: RUN.longOrbits, spans: BASE_SPANS, keepSeries: dt === RUN.dt, cond: c.key,
      contFrom: (c.sun === 'on') ? CONT_FROM : [] });
    for (const [lk, law] of BRANCH_LAWS) for (const mode of STOP_MODES) for (const phase of STOP_PHASES)
      out.push({ key: `br-${lk}-${mode}-${phase}-${dt}`, kind: 'branch', law, sun: 'on', dt, stop: { mode, phase, after: RUN.prefix, ramp: RUN.ramp, post: RUN.post }, keepSeries: dt === RUN.dt, lk });
  }
  for (const dt of [RUN.dt, RUN.dtHalf, RUN.dtFine]) out.push({ key: `bridge-${dt}`, kind: 'bridge', law: null, sun: 'book', dt, revMax: RUN.bridgeOrbits, spans: [[0, 8], [0, 27]] });
  return out;
}

/* ── 集計(親)── */
const rel = (a, b) => (a === null || b === null || a === undefined || b === undefined) ? null : (b - a) / a;
export function assemble(HP, res, J292) {
  const C = {}, Bt = {}, br = {};
  for (const c of CONDITIONS) C[c.key] = { label: c.label, law: c.law, sun: c.sun, h: res[`cond-${c.key}-${RUN.dt}`], h2: res[`cond-${c.key}-${RUN.dtHalf}`] };
  for (const c of Object.values(C)) {
    c.hh = c.h.windows.map((w, i) => ({ from: w.from, to: w.to, relP: rel(w.apsPeriodYr, c.h2.windows[i].apsPeriodYr), relSid: rel(w.siderealDays, c.h2.windows[i].siderealDays), relE: rel(w.eMean, c.h2.windows[i].eMean) }));
  }
  for (const [lk, law] of BRANCH_LAWS) for (const mode of STOP_MODES) for (const phase of STOP_PHASES) {
    const key = `${lk}-${mode}-${phase}`, h = res[`br-${key}-${RUN.dt}`], h2 = res[`br-${key}-${RUN.dtHalf}`];
    const restartDiff = (x) => x.post.map((w, i) => ({ relP: rel(w.apsPeriodYr, x.restart.post[i].apsPeriodYr), dDw: (w.dwRadPerPeri !== null && x.restart.post[i].dwRadPerPeri !== null) ? x.restart.post[i].dwRadPerPeri - w.dwRadPerPeri : null,
      relE: rel(w.eMean, x.restart.post[i].eMean), relSid: rel(w.siderealDays, x.restart.post[i].siderealDays) }));
    br[key] = { lk, law, mode, phase, h, h2, restartH: restartDiff(h), restartH2: restartDiff(h2),
      hh: h.post.map((w, i) => ({ dDw: (w.dwRadPerPeri !== null && h2.post[i].dwRadPerPeri !== null) ? h2.post[i].dwRadPerPeri - w.dwRadPerPeri : null, relE: rel(w.eMean, h2.post[i].eMean), relSid: rel(w.siderealDays, h2.post[i].siderealDays) })) };
  }
  for (const dt of [RUN.dt, RUN.dtHalf, RUN.dtFine]) Bt[dt] = res[`bridge-${dt}`];
  // ---- 門
  const all = Object.values(res);
  const runsOk = all.every((r) => !r.nan && (!r.drag || (r.drag.boundOver === 0 && r.drag.reject === 0)) && (!r.restart || !r.restart.nan));
  const warnFree = all.every((r) => !r.warnings || r.warnings.length === 0 || r.key.startsWith('cond-S'));
  const jumps = Object.values(br).flatMap((b) => [b.h.stop.jump, b.h2.stop.jump]);
  const sameState = [];
  for (const [lk] of BRANCH_LAWS) for (const phase of STOP_PHASES) for (const dt of [RUN.dt, RUN.dtHalf]) {
    const a = res[`br-${lk}-instant-${phase}-${dt}`], b = res[`br-${lk}-smooth-${phase}-${dt}`];
    sameState.push({ lk, phase, dt, same: a.stop.hash === b.stop.hash && a.stop.t === b.stop.t, t: a.stop.t, hash: a.stop.hash });
  }
  const dropW = C.Bdrop.h.windows, offW = C.B.h.windows;
  const drop = { relP: offW.map((w, i) => rel(w.apsPeriodYr, dropW[i].apsPeriodYr)), relSid: offW.map((w, i) => rel(w.siderealDays, dropW[i].siderealDays)), relE: offW.map((w, i) => rel(w.eMean, dropW[i].eMean)) };
  drop.maxAbs = Math.max(...drop.relP.concat(drop.relSid, drop.relE).map((x) => Math.abs(x)));
  const hhMax = (arr, k) => Math.max(...arr.map((z) => Math.abs(z[k] === null ? 0 : z[k])));
  const condHH = Object.fromEntries(Object.entries(C).map(([k, c]) => [k, { relP: hhMax(c.hh, 'relP'), relSid: hhMax(c.hh, 'relSid'), relE: hhMax(c.hh, 'relE') }]));
  const brHH = Object.fromEntries(Object.entries(br).map(([k, b]) => [k, { dDw: hhMax(b.hh, 'dDw'), relE: hhMax(b.hh, 'relE'), relSid: hhMax(b.hh, 'relSid') }]));
  const gates = { runsOk, warnFree, jumpsZero: jumps.every((x) => x === 0), nJumps: jumps.length, sameState, sameStateOk: sameState.every((z) => z.same), drop, dropOk: drop.maxAbs <= 1e-6,
    conditionsPresent: ['A1', 'A2', 'B', 'C', 'D'].every((k) => C[k].h && C[k].h.windows.every((w) => w.complete)), branchesPresent: Object.keys(br).length === BRANCH_LAWS.length * STOP_MODES.length * STOP_PHASES.length,
    postComplete: Object.values(br).every((b) => b.h.post.concat(b.h2.post, b.h.restart.post, b.h2.restart.post).every((w) => w.complete)), hh: { conditions: condHH, branches: brHH } };
  gates.ok = gates.runsOk && gates.warnFree && gates.jumpsZero && gates.sameStateOk && gates.dropOk && gates.conditionsPresent && gates.branchesPresent && gates.postComplete;
  // ---- 読み(正本の数から)
  const W = (k, i) => C[k].h.windows[i];
  const iLong = BASE_SPANS.findIndex(([a, b]) => a === 0 && b === RUN.longOrbits);
  const sol = find(HP, SOLAR_ID), ocm = /([\d.]+) 年/.exec((sol.obsCard || [])[0] ? sol.obsCard[0].model : '');
  const cause = { solarDeclaredYr: ocm ? Number(ocm[1]) : null, solarDeclaredWhere: '🔆 の観測結果カード 1 行目(118 公転窓・較正ゼロ —— 第135便)',
    S118: W('S', iLong).apsPeriodYr, C118: W('C', iLong).apsPeriodYr, C27: W('C', 0).apsPeriodYr, D118: W('D', iLong).apsPeriodYr, D118dw: W('D', iLong).dwRadPerPeri };
  const P = (k) => W(k, iLong).apsPeriodYr;
  const nonAdd = { A1: P('A1'), A2: P('A2'), B: P('B'), C: P('C'), harmonicSum: 1 / (1 / P('B') + 1 / P('C')), observed: 8.85 };
  nonAdd.A1OverHarmonic = nonAdd.A1 / nonAdd.harmonicSum - 1;
  const sunInDrag = { windows: BASE_SPANS.map(([a, b], i) => ({ from: a, to: b, A1: W('A1', i).apsPeriodYr, A2: W('A2', i).apsPeriodYr, rel: rel(W('A1', i).apsPeriodYr, W('A2', i).apsPeriodYr) })),
    sumMu: { A1: C.A1.h.drag.sumMu, A2: C.A2.h.drag.sumMu }, sumMxU: { A1: C.A1.h.drag.sumMxU, A2: C.A2.h.drag.sumMxU } };
  // 継続: 停止後の率と、太陽なしの同じ法則(B/D)・再起動の対照・太陽ありの続き(同じ公転の窓)との比較
  const persistence = Object.entries(br).map(([key, b]) => {
    const w1 = b.h.post[0], w2 = b.h.post[1], ic = CONT_FROM.indexOf(w1.from), cs = ic >= 0 ? C[b.lk].h.cont[ic] : null;
    // 減衰の尾: 太陽が消えた後の 2 本目の近点の増分(1 本目は太陽のいた区間を含みうる)と停止後の窓の平均の差
    const lp = b.h.local.filter((z) => z.t > b.h.gone.t), tailInc = lp.length >= 2 ? lp[1].inc : null;
    return { key, lk: b.lk, mode: b.mode, phase: b.phase, stopT: b.h.stop.t, stopRev: b.h.stop.revN, goneRev: b.h.gone.revN,
      preDw: b.h.pre[0].dwRadPerPeri, preYr: b.h.pre[0].apsPeriodYr, preE: b.h.pre[0].eMean,
      post1Dw: w1.dwRadPerPeri, post2Dw: w2.dwRadPerPeri, post1Yr: w1.apsPeriodYr, post2Yr: w2.apsPeriodYr, post1E: w1.eMean, post2E: w2.eMean, postESpread: (Math.max(w1.eMax, w2.eMax) - Math.min(w1.eMin, w2.eMin)) / ((w1.eMean + w2.eMean) / 2),
      postIncSd: Math.max(w1.incSdRad, w2.incSdRad), postSid: w2.siderealDays, postAnom: w2.anomDays,
      freeRefDw: (b.lk === 'C' ? C.D : C.B).h.windows[0].dwRadPerPeri, restartMaxRelP: Math.max(...b.restartH.map((z) => Math.abs(z.relP === null ? 0 : z.relP))),
      restartMaxDDw: Math.max(...b.restartH.map((z) => Math.abs(z.dDw === null ? 0 : z.dDw))), restartMaxRelE: Math.max(...b.restartH.map((z) => Math.abs(z.relE))),
      contSunDw: cs ? [cs[0].dwRadPerPeri, cs[1].dwRadPerPeri] : null, contSunE: cs ? [cs[0].eMean, cs[1].eMean] : null,
      tailInc, tail: tailInc === null ? null : tailInc - w1.dwRadPerPeri, tailRel: tailInc === null ? null : (tailInc - w1.dwRadPerPeri) / (b.h.pre[0].dwRadPerPeri - w1.dwRadPerPeri) };
  });
  // 二体 1PN の桁(式だけ —— 走らせない): Δϖ = 6πGM/(c²a(1−e²))
  const Dw = C.D.h, phS = swingPhysics(HP), solB = find(HP, SOLAR_ID).bodies;
  const Mem = solB[1].m + solB[2].m, aEM = Dw.osc0.a, eEM = Dw.windows[0].eMean;
  const pn1Rad = 6 * Math.PI * phS.G * Mem / (phS.cLight * phS.cLight * aEM * (1 - eEM * eEM));
  const orbitsPerCentury = 36525 / Dw.windows[0].siderealDays;
  const pn1 = { radPerOrbit: pn1Rad, arcsecPerCentury: pn1Rad * orbitsPerCentury * 180 / Math.PI * 3600, signalRadPerOrbit: W('C', iLong).dwRadPerPeri, ratio: pn1Rad / W('C', iLong).dwRadPerPeri,
    formula: '6πG(m_地球+m_月)/(c²a(1−e²))・a は D の初期の接触軌道・e は D の 0〜27 公転の平均' };
  // 橋(🌛 の換算)
  const ref = J292 ? { P27: J292.fit.center.w27.apsPeriodYr, dw27: J292.fit.center.w27.dwRadPerPeri, sid27: J292.fit.center.w27.siderealDays, gain: J292.fit.declaredGain, source: 'tests/out/dragcore-w292c.json(fit.center.w27)' } : null;
  const bridge = { ref, rows: [RUN.dt, RUN.dtHalf, RUN.dtFine].map((dt) => ({ dt, P27: Bt[dt].windows[1].apsPeriodYr, dw27: Bt[dt].windows[1].dwRadPerPeri, sid27: Bt[dt].windows[1].siderealDays, e27: Bt[dt].windows[1].eMean,
    relToRef: ref ? rel(ref.P27, Bt[dt].windows[1].apsPeriodYr) : null, core: Bt[dt].core ? Bt[dt].core.sources[0] : null })) };
  // 共鳴の読み(原仮定者の裁定(第83報 追記)—— 慣性引きずりの二体が持つ固有の近点モード〔B〕に太陽の摂動〔C〕が近い率で働く)の実測の量:
  //   固有の率と太陽の率・その差の周期(うなりなら現れる周期)・両方の率(A1)と窓ごとの動き・離心率の応答・停止後に残る固有成分
  const yr = (k, i) => W(k, i).apsPeriodYr, nW = BASE_SPANS.length - 1;
  const freeAfter = persistence.filter((p) => p.lk !== 'C').map((p) => p.post1Dw), zeroAfter = persistence.filter((p) => p.lk === 'C').map((p) => p.post1Dw);
  const resonance = { freeModeYr: P('B'), solarYr: P('C'), combinedYr: P('A1'), harmonicSum: nonAdd.harmonicSum, combinedOverHarmonic: nonAdd.A1OverHarmonic,
    detuneYr: 1 / Math.abs(1 / P('C') - 1 / P('B')), longWindowYr: (C.A1.h.windows[iLong].siderealDays * RUN.longOrbits) / 365.25,
    combinedWindowsYr: BASE_SPANS.slice(0, nW).map((_, i) => yr('A1', i)), solarWindowsYr: BASE_SPANS.slice(0, nW).map((_, i) => yr('C', i)), freeWindowsYr: BASE_SPANS.slice(0, nW).map((_, i) => yr('B', i)),
    eSolar: W('C', iLong).eMean, eCombined: W('A1', iLong).eMean, eFree: W('B', iLong).eMean,
    afterStopFreeDw: [Math.min(...freeAfter), Math.max(...freeAfter)], afterStopZeroDw: [Math.min(...zeroAfter), Math.max(...zeroAfter)], freeModeDw: W('B', iLong).dwRadPerPeri,
    note: '同期 = 両方の率が固有か太陽のどちらかの率へ寄る・うなり = 差の周期 detuneYr で率が揺れる(窓 longWindowYr より長ければこの窓では判別できない)' };
  return { conditions: C, branches: br, bridge, gates, readings: { cause, nonAdd, sunInDrag, persistence, pn1, resonance } };
}

/* ── PHYSICS〔第293便d〕の表の行(QA docs.swingContract が照合する)── */
const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
const f5 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(5);
const f6 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(6);
const e2 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
export function docRows(J) {
  const out = { cond: [], branch: [], bridge: [], hh: [], summary: [] };
  const C = J.conditions, iLong = BASE_SPANS.findIndex(([a, b]) => a === 0 && b === RUN.longOrbits);
  for (const k of ['A1', 'A2', 'B', 'C', 'D', 'S']) {
    const c = C[k], w = c.h.windows, L = w[iLong], u = c.h.uAcc.withSun.n ? c.h.uAcc.withSun : c.h.uAcc.free;
    out.cond.push(`| ${k} | ${c.label} | ${w.slice(0, 4).map((z) => f4(z.apsPeriodYr)).join(' / ')} | ${f4(L.apsPeriodYr)} | ${f6(L.dwRadPerPeri)} | ${f4(L.incSdRad === null ? null : L.incSdRad * 180 / Math.PI)} | ${f5(L.eMean)}(${f5(L.eMin)}〜${f5(L.eMax)}) | ${f4(L.siderealDays)} | ${f4(L.anomDays)} | ${u.n ? e2(u.sum / u.n) : '—'} |`);
  }
  for (const r of J.readings.persistence) {
    const b = J.branches[r.key];
    out.branch.push(`| ${r.lk} | ${r.mode === 'instant' ? '瞬時' : '3 公転'} | ${r.phase === 'peri' ? '近点' : '遠点'} | ${r.stopRev}・${f4(r.stopT / DAY_U)} 日 | ${b.h.stop.jump} | ${f6(r.preDw)} | ${r.contSunDw ? r.contSunDw.map(f6).join(' / ') : '—'} | ${f6(r.post1Dw)} / ${f6(r.post2Dw)} | ${f6(r.freeRefDw)} | ${f5(r.preE)} → ${f5(r.post1E)} | ${e2(r.postESpread)} | ${f4(r.postSid)} | ${e2(r.tail)} | ${e2(r.restartMaxDDw)} | ${e2(b.hh.reduce((m, z) => Math.max(m, Math.abs(z.dDw || 0)), 0))} |`);
  }
  for (const r of J.bridge.rows) out.bridge.push(`| ${r.dt} | ${f6(r.P27)} | ${f6(r.dw27)} | ${f5(r.sid27)} | ${e2(r.relToRef)} |`);
  for (const [k, z] of Object.entries(J.gates.hh.conditions)) out.hh.push(`| ${k} | ${e2(z.relP)} | ${e2(z.relSid)} | ${e2(z.relE)} |`);
  const rd = J.readings, sd = rd.sunInDrag.windows.find((w) => w.from === 0 && w.to === RUN.longOrbits);
  out.summary.push(`| 太陽の第三体の重力だけ(C・0〜118 公転) | ${f4(rd.cause.C118)} 年(🔆 そのまま S ${f4(rd.cause.S118)} 年・🔆 の宣言 ${rd.cause.solarDeclaredYr} 年) |`);
  out.summary.push(`| 太陽なし・慣性引きずり(B・0〜118 公転) | ${f4(rd.nonAdd.B)} 年(🌛 の正本 ${J.bridge.ref ? f4(J.bridge.ref.P27) : '—'} 年 —— 初期状態は 🔆 のまま) |`);
  out.summary.push(`| 太陽あり・慣性引きずり(A1 / A2・0〜118 公転) | ${f4(rd.nonAdd.A1)} / ${f4(rd.nonAdd.A2)} 年(A2/A1−1 = ${e2(sd.rel)}) |`);
  out.summary.push(`| 率の和 1/(1/B+1/C) と A1 | ${f4(rd.nonAdd.harmonicSum)} 年(A1 はその ${e2(rd.nonAdd.A1OverHarmonic)}) |`);
  out.summary.push(`| 太陽なし・慣性なし(D・0〜118 公転)| ${e2(rd.cause.D118dw)} rad/公転(重力の軟化 0.01 の逆行の床) |`);
  out.summary.push(`| 二体 1PN(式)| ${e2(rd.pn1.radPerOrbit)} rad/公転 = ${f4(rd.pn1.arcsecPerCentury)} 秒角/世紀(C の率の ${e2(rd.pn1.ratio)}) |`);
  const rs = rd.resonance;
  out.summary.push(`| 共鳴の読み: 固有の率(B)と太陽の率(C)の差の周期 | ${f4(rs.detuneYr)} 年(118 公転の窓は ${f4(rs.longWindowYr)} 年) |`);
  out.summary.push(`| 共鳴の読み: 両方(A1)の 27 公転窓ごとの近点周期 | ${rs.combinedWindowsYr.map(f4).join(' / ')} 年(太陽だけ ${rs.solarWindowsYr.map(f4).join(' / ')}) |`);
  out.summary.push(`| 共鳴の読み: 離心率の応答(0〜118 公転の平均) | 太陽だけ ${f5(rs.eSolar)}・両方 ${f5(rs.eCombined)}・固有だけ ${f5(rs.eFree)} |`);
  out.summary.push(`| 共鳴の読み: 太陽を止めたあとの近点率 | 慣性あり ${f6(rs.afterStopFreeDw[0])}〜${f6(rs.afterStopFreeDw[1])} rad/公転(固有の B ${f6(rs.freeModeDw)})・慣性なし ${f6(rs.afterStopZeroDw[0])}〜${f6(rs.afterStopZeroDw[1])} |`);
  out.summary.push(`| Σ m u(引きずりの運動量の診断欄・118 公転の終わり) | A1 ${e2(Math.hypot(...rd.sunInDrag.sumMu.A1))}・A2 ${e2(Math.hypot(...rd.sunInDrag.sumMu.A2))} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN && process.argv.includes('--child')) {
  const spec = JSON.parse(process.argv[process.argv.indexOf('--child') + 1]);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  process.stdout.write(JSON.stringify(childTask(HP, spec)));
} else if (IS_MAIN) {
  const OUT_PATH = process.env.W293D_OUT || path.join(ROOT, 'tests', 'out', 'swing-w293d.json');
  const IN292 = 'tests/out/dragcore-w292c.json';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const J292 = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, IN292), 'utf8')); } catch (e) { return null; } })();
  // 一時プリセットの宣言(受理・内蔵に無いこと)
  const tmpV = Object.fromEntries(Object.keys(LAWS).map((law) => { const v = HP.validatePreset(swingPreset(HP, law)); return [law, { ok: v.ok, warnings: v.warnings || [], physics: v.ok ? v.preset.physics : null }]; }));
  const decl = { tmpId: TMP_ID, inBuiltins: !!(find(HP, TMP_ID) || find(HP, TMP_ID + 'Bridge')), laws: LAWS, conditions: CONDITIONS, run: RUN, baseSpans: BASE_SPANS,
    conversion: conversionTable(HP), bodies: find(HP, SOLAR_ID).bodies, dragCore: { massFrac: DRAG_CORE_DECL.massFrac, radius: DRAG_CORE_DECL.radius / UNIT_RATIO }, accepted: tmpV,
    coreTableRMax: swingPreset(HP, 'sunGrav').physics.relativeDrag.coreTable.rMax, stopRule: '27 公転の後に最初に検出した近点(遠点)の步の終わり —— 瞬時は質量を 0・滑らかは 0.5(1+cos(πs))・s=(t−t_停止)/(3 × 停止までの平均恒星月)' };
  console.log(`一時プリセット: 受理 ${Object.values(tmpV).map((z) => z.ok + '/' + z.warnings.length).join(',')}・内蔵に無い ${!decl.inBuiltins}・gain ${tmpV.sunGrav.physics.relativeDrag.gain}・eps ${tmpV.sunGrav.physics.relativeDrag.eps}・r_max ${f4(decl.coreTableRMax)}`);
  const ONLY = process.env.W293D_ONLY ? process.env.W293D_ONLY.split(',') : null;   // 開発用(指定したら正本を書かずに終わる)
  const specs = taskSpecs().filter((z) => !ONLY || ONLY.some((o) => z.key.startsWith(o)));
  const NW = Math.max(1, Number(process.env.W293D_WORKERS) || 3);
  const results = {};
  const self = fileURLToPath(import.meta.url);
  const runChild = (sp) => new Promise((res, rej) => {
    const ch = spawn(process.execPath, [self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { if (code !== 0) return rej(new Error(sp.key + ': ' + err.slice(0, 600)));
      try { results[sp.key] = JSON.parse(out); } catch (e) { return rej(e); }
      const r = results[sp.key];
      if (r.kind === 'branch') console.log(`  ${sp.key}: 停止 t=${r.stop.t.toFixed(2)}(${r.stop.revN} 公転・跳び ${r.stop.jump})・前 Δϖ ${f6(r.pre[0].dwRadPerPeri)}・後 ${r.post.map((w) => f6(w.dwRadPerPeri) + '/e ' + f5(w.eMean)).join(' | ')}・再起動 ${r.restart.post.map((w) => f6(w.dwRadPerPeri)).join('/')}(${r.wallSec.toFixed(0)} s)`);
      else console.log(`  ${sp.key}: ${r.windows.map((w) => `[${w.from},${w.to}) ${f4(w.apsPeriodYr)} 年・e ${f5(w.eMean)}`).join(' | ')}(${r.wallSec.toFixed(0)} s)`);
      res(); });
  });
  const order = specs.slice().sort((a, b) => (b.kind === 'branch') - (a.kind === 'branch') || (a.dt - b.dt));
  let next = 0;
  const lane = async () => { while (next < order.length) { const sp = order[next++]; await runChild(sp); } };
  await Promise.all(Array.from({ length: Math.min(NW, order.length) }, lane));
  if (ONLY) { console.log('W293D_ONLY —— 正本は書かない'); process.exit(0); }
  const R = assemble(HP, results, J292);
  const timing = Object.fromEntries(Object.entries(results).map(([k, r]) => [k, { wallSec: r.wallSec }]));
  for (const r of Object.values(results)) delete r.wallSec;
  const out = { meta: null, decl, ...R, ok: null, timing };
  out.ok = R.gates.ok && !decl.inBuiltins && Object.values(tmpV).every((z) => z.ok && z.warnings.length === 0) && !!J292;
  const CODE = ['tests/exp-w293d-swing.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第293便d', target: TARGET, code: CODE, inputs: [TARGET, IN292] }), {
    harnessVersion: HARNESS_VERSION, engineVersion: HP.REL_DRAG_INERTIAL_VERSION, coreVersion: HP.DRAG_CORE_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第83報)ブランコ —— 押し(外部の摂動)と、摂動が消えてもしばらく継続する側の物理法則',
    reading: '統括の検証項目 R144(診断だけ・新しい力は足さない・C_d は再フィットしない・原因〔太陽〕と継続〔止めたあとの自由成分〕を別々に測る)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセスで並列)',
    gateA: '一時プリセットは器の中だけ(内蔵の 152 本に足さない)—— 既存の本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す',
    notClaim: ['月を再現した', '摂動の記憶を示した', '原因を同定した', '較正 合', 'C_d は普遍定数', 'GR の何 PN と同定', '全系の保存則が閉じた'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  const rd = R.readings;
  console.log(`原因: C(太陽+gain0)118 公転 ${f4(rd.cause.C118)} 年(🔆 そのまま ${f4(rd.cause.S118)}・宣言 ${rd.cause.solarDeclaredYr})・D ${f6(rd.cause.D118dw)} rad/公転(軟化の床)`);
  console.log(`非加算: A1 ${f4(rd.nonAdd.A1)}・A2 ${f4(rd.nonAdd.A2)}・B ${f4(rd.nonAdd.B)}・C ${f4(rd.nonAdd.C)}・調和和 ${f4(rd.nonAdd.harmonicSum)}(A1 との差 ${e2(rd.nonAdd.A1OverHarmonic)})`);
  for (const p of rd.persistence) console.log(`継続 ${p.key}: 前 ${f6(p.preDw)} → 後 ${f6(p.post1Dw)}/${f6(p.post2Dw)}(自由参照 ${f6(p.freeRefDw)})・e ${f5(p.preE)} → ${f5(p.post1E)}・再起動との差 ${e2(p.restartMaxDDw)}`);
  console.log(`1PN: ${e2(rd.pn1.radPerOrbit)} rad/公転 = ${f4(rd.pn1.arcsecPerCentury)} 秒角/世紀(信号の ${e2(rd.pn1.ratio)})・橋 ${R.bridge.rows.map((r) => f6(r.P27) + '(' + e2(r.relToRef) + ')').join(' / ')}`);
  console.log(`門: ${JSON.stringify({ runsOk: R.gates.runsOk, warnFree: R.gates.warnFree, jumps: R.gates.jumpsZero, same: R.gates.sameStateOk, drop: e2(R.gates.drop.maxAbs), cond: R.gates.conditionsPresent, br: R.gates.branchesPresent, post: R.gates.postComplete })}`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}

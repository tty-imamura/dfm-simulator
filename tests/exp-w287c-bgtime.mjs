// 第287便c(原仮定者の裁定(第77報)⑤・第77報で閉じた AN64/AN73・統括の検証項目 R109)—— **背景場の時間発展の契約**の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 反例の再現: 🌒 charonGeoToy3 を build し、状態を固定して評価時刻だけ 1 sim 進める。
//       旧い契約(第286便まで —— 背景の値は W₀+∇W·dx・A₀+∇A·dx で時刻を読まない)は、エンジンの同じ関数
//       `dfmMeshVelocityFieldAt` を**時間の契約を外した実行形**(S.meshVel.bg.time を外す —— 基点 f94ca580 と同じ式の枝)で呼んで再現する:
//       u(t₀)=u(t₀+1) なのに返却 ∂ₜu≠0。新しい契約(宣言した timeContract)では (u(t₀+1)−u(t₀))/1 と返却 ∂ₜu が一致する。
//   (B) 時間差分と返却 ∂ₜu の照合: (u(τ+h)−u(τ−h))/2h を h・h/2・h/4 の 3 段で。事例は 🌒(taylor・∂ₜW=0 —— u は τ の一次なので
//       差は丸めの床だけ)・taylor の非線形(∂ₜW≠0 —— 主次数 2)・sources(源の台帳を X+Vτ+½aτ² で動かす本命 —— 主次数 2)・
//       distantSource(遠方 1 源)・taylor の範囲外(台帳あり → 源から再展開 = sources の値とビット一致/台帳なし → 一次のまま・範囲外を数える)。
//       RHS の coordAccel が同じ ∂ₜu を使うこと(coordAccel − (J u + J v − Jᵀ v) = ∂ₜu)。**丸め床は器が宣言する**(FLOOR_ULPS)。
//       🔁 mercuryGeoToy3(一様・時間微分 0)は宣言なしで値が時間で動かず ∂ₜu=[0,0](ビット)。
//   (C) 🌒 の前後: 周期(同方向 1 周・2 周目 —— 相対角の連続化と 2π 交差の線形内挿)を dt・dt/2 で、kF0 の診断コピー
//       (❄️ plutoCharonReal を kFrame=0・geoPN=1 に —— 正式の判定器の kF0 と同じ写し方)と並べる。前(基点 f94ca580)は枝の実測を宣言値で持つ。
//       η_bg=|a_bg|/|a_grav|(a_bg=coordAccel−a_space —— 背景が座標加速度へ入れる分・a_grav=相手の重力)の診断行(両天体に共通の分と相対の分)。
//   (D) share-p1 の基準コピー: 🪁 galaxyMeshSpiralGeoToy の写しに**明示した静止背景**(share-p1・W=旧 W_bg=D₀=1.5・A=0・微分 0・
//       単位表・有限領域・真空規約・基準系)を置き、写しを持たない 🪁 と 600 步の状態をビットで比べる(**内蔵にはしない —— 器の中だけ**)。
//   (E) timeContract の受理器の事例(受理/拒否・冪等)と経路の相互検査(時間微分のある背景で宣言なしは拒否)。
//   (F) 棚卸し: 内蔵で timeContract を宣言する本・時間微分のある背景を読む本(宣言の欠けは 0)。
//
// ■ しないこと・言わないこと
//   ・v へ ∂ₜu をそのまま足す修正は採らない(ẋ=v+u の u の時間変化と重複)。complex-p2 を既定にしない・🌚💮 に接続しない。
//   ・「背景法則版を内蔵に接続した」「安定化した」「合った」と書かない(🌒 の周期は照合先で判定しない)。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w287c-bgtime.mjs
// 読む正本: なし(html だけ)。正本: tests/out/bgtime-w287c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.BGC_LAW_UNITS","HP.BGC_TIME_VERSION","HP.allPresets","HP.bgTimeCrossCheck","HP.bgTimeMomentsAt","HP.bgTimeNeeded","HP.bgTimePrepare","HP.bgcTimeCheck","HP.bgcWireState","HP.dfmMeshVelocityFieldAt","HP.dfmMeshVelocityRHS","HP.sim","HP.validateBackgroundComplex","HP.validatePreset","bgLawCrossCheck","bgLawPrepare","dfmGeoToyBgLawStep","dfmMeshVelocityStep","meshVelocityCrossCheck","meshVelocityPrepare"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w287c-bgtime-1';
export const DT = 0.016;
/** 丸め床: 中心差分の丸め誤差 ≈ FLOOR_ULPS·2⁻⁵²·|u|/h(相対は |∂ₜu| で割る)。この下の段は次数に数えない(u が τ の一次なら全段が床の下)。 */
export const FLOOR_ULPS = 64;
/** 収束次数の許容(中心差分の主次数 2)。 */
export const ORDER_WINDOW = [1.8, 2.2];
/** 🌒 の前(基点 f94ca580 の html・同じ器の同じ測り方 —— 枝の実測。基点 html は CI に無いので宣言値で持つ)。 */
export const BEFORE_F94 = { rev: 'f94ca580', how: '枝の実測(同じ器の periodRun・counterexample を基点の beta/index.html で走らせた値 —— 基点 html は CI に無いので宣言値で持つ)',
  period2S: { dt: 551864.0619125834, dtHalf: 551864.06180665 }, kf0Period2S: { dt: 551864.0613498713, dtHalf: 551864.0612526848 },
  counterexample: { uMovedBy1: [[0, 0], [0, 0]], dUdt: [[3.804168967988123e-8, 0], [3.804194210580302e-8, 0]] } };
const EPS = Math.pow(2, -52);
const clone = (x) => JSON.parse(JSON.stringify(x));
const T_UNIT_S = (P) => Math.pow(10, P.scaleExp.T);

function build(HP, p) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) return { ok: false, err: String(JSON.stringify(v.errors || v.err)).slice(0, 300) };
  HP.sim.build(v.preset);
  return { ok: true, S: HP.sim };
}
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function fieldAt(HP, S, i, t) { const t0 = S.t; S.t = t; const f = HP.dfmMeshVelocityFieldAt(S, i); S.t = t0; return f; }
const nrm = (a) => Math.hypot(a[0], a[1]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];

// ---- (A) 反例の再現
export function counterexample(HP) {
  const P = find(HP, 'charonGeoToy3'), b = build(HP, P);
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S, bg = S.meshVel.bg, t0 = S.t, rows = [];
  const tm = bg.time;
  for (let i = 0; i < S.n; i++) {
    bg.time = null;   // 旧い契約(時間の契約を外した実行形 —— 基点と同じ式の枝)
    const o0 = fieldAt(HP, S, i, t0), o1 = fieldAt(HP, S, i, t0 + 1);
    bg.time = tm;
    const n0 = fieldAt(HP, S, i, t0), n1 = fieldAt(HP, S, i, t0 + 1);
    const oldDiff = sub(o1.u, o0.u), newDiff = sub(n1.u, n0.u);
    rows.push({ body: i, old: { u0: o0.u, u1: o1.u, timeDiff: oldDiff, dUdt: o0.dUdt, uMoved: !(oldDiff[0] === 0 && oldDiff[1] === 0) },
      now: { u0: n0.u, u1: n1.u, timeDiff: newDiff, dUdt: n0.dUdt, dUdt1: n1.dUdt,
        rel: nrm(sub(newDiff, n0.dUdt)) / Math.max(nrm(n0.dUdt), 1e-300),
        floor: FLOOR_ULPS * EPS * nrm(n0.u) / Math.max(nrm(n0.dUdt), 1e-300) } });   // h=1 の前進差分の丸め床(u は τ の一次 —— 差は床だけ)
  }
  const ok = rows.every((r) => !r.old.uMoved && nrm(r.old.dUdt) > 0 && r.now.rel <= r.now.floor);
  return { preset: 'charonGeoToy3', t0, h: 1, contract: tm ? { mode: tm.mode, t0: tm.t0, widthT: tm.widthT, radiusR: tm.radiusR } : null, rows, ok };
}

// ---- (B) 時間差分と返却 ∂ₜu
const FR = { origin: 'barycenter', epoch: 't0(第287便c の器)', rotation: 'none', translation: 'comoving' };
function mercCopy(HP, bgc) { const P = clone(find(HP, 'mercuryGeoToy3')); P.physics.backgroundComplex = bgc; P.id = 'w287cDiagTime'; return P; }
export function fdCases(HP) {
  const M = find(HP, 'mercuryGeoToy3').physics.backgroundComplex;
  const src = [{ id: 's1', kind: 'field', excludedExplicit: true }, { id: 's2', kind: 'field', excludedExplicit: true }];
  const ledger = [{ id: 's1', m: 5e3, x: -2000, y: 800, vx: 1.5, vy: -0.3, ax: 0.002, ay: 0.001 },
    { id: 's2', m: 3e3, x: 1500, y: -1200, vx: -0.7, vy: 0.9, ax: -0.001, ay: 0.003 }];
  const nonlin = { background: 'declared', note: '第287便c 時間の契約(taylor・∂ₜW≠0)', W0: 1, A0: [2.3, 0], gradW: [0.002, -0.001], gradA: [0.001, 0.0005, -0.0004, 0.002],
    dWdt: -0.004, dAdt: [0.01, -0.006], sources: M.sources, frame: clone(M.frame), timeContract: { mode: 'taylor', t0: 0, derivFrame: 'frame', radiusR: 1e4, widthT: 1e4 } };
  const srcs = { background: 'declared', note: '第287便c 時間の契約(sources —— 源 2 個の台帳)', bgModel: 'sources', ledger, refPos: [0, 0], eps: 0,
    sources: src, frame: clone(M.frame), timeContract: { mode: 'sources', t0: 0, derivFrame: 'frame', widthT: 1e5 } };
  const dist = { background: 'declared', note: '第287便c 時間の契約(遠方 1 源)', bgModel: 'distantSource', W0: 1, Rbg: 1e4, thetaBg: 0.3, Vext: [2.3, 0.4], aExt: [0, 0.01],
    sources: M.sources, frame: clone(M.frame), timeContract: { mode: 'sources', t0: 0, derivFrame: 'frame', widthT: 1e5 } };
  return [
    { key: 'charon', label: '🌒 charonGeoToy3(sources —— 太陽 1 源の台帳・u は源の速度 V+aτ で τ の一次)', preset: find(HP, 'charonGeoToy3'), taus: [0, 1e4], H: 64, linear: true },
    { key: 'taylorNonlin', label: 'taylor・∂ₜW≠0(🔁 の写し・手入力の 6 成分)', preset: mercCopy(HP, nonlin), taus: [5], H: 0.8, linear: false },
    { key: 'sources', label: 'sources(源 2 個の台帳を X+Vτ+½aτ² で動かす —— 本命)', preset: mercCopy(HP, srcs), taus: [10], H: 4, linear: false },
    { key: 'distant', label: 'sources(bgModel distantSource —— 遠方 1 源・u は源の速度 V+aτ で τ の一次)', preset: mercCopy(HP, dist), taus: [10], H: 4, linear: true }];
}
export function fdCheck(HP, c) {
  const b = build(HP, c.preset);
  if (!b.ok) return { key: c.key, ok: false, err: b.err };
  const S = b.S, rows = [];
  for (const tau of c.taus) for (let i = 0; i < S.n; i++) {
    if (S.pinned[i] && !(S.meshVel && S.meshVel.geo3)) continue;
    const t = S.meshVel.bg.time.t0 + tau;
    const F = fieldAt(HP, S, i, t);
    if (!F || !F.ok || F.defined !== true) { rows.push({ body: i, tau, ok: false, err: 'field' }); continue; }
    const du = F.dUdt, un = nrm(F.u), dn = nrm(du), steps = [];
    for (const k of [1, 2, 4]) {
      const h = c.H / k;
      const f1 = fieldAt(HP, S, i, t + h), f0 = fieldAt(HP, S, i, t - h);
      const fd = [(f1.u[0] - f0.u[0]) / (2 * h), (f1.u[1] - f0.u[1]) / (2 * h)];
      const err = nrm(sub(fd, du)) / Math.max(dn, 1e-300);
      const floor = FLOOR_ULPS * EPS * un / (h * Math.max(dn, 1e-300));
      steps.push({ h, err, floor, belowFloor: err <= floor });
    }
    // 丸め床に入った段は次数に数えない(null —— 床の下の誤差は丸めの揺れで、V8 の版で動く)
    const order = [0, 1].map((q) => (steps[q].err > 0 && steps[q + 1].err > 0 && !steps[q + 1].belowFloor) ? Math.log2(steps[q].err / steps[q + 1].err) : null);
    // RHS の coordAccel が同じ ∂ₜu を使う: coordAccel − (J u + J v − Jᵀ v) = ∂ₜu(a_space=0)
    const v = [S.vx[i], S.vy[i]], r = HP.dfmMeshVelocityRHS(F, v, [0, 0]), J = F.gradU, u = F.u;
    const Ju = [J[0] * u[0] + J[1] * u[1], J[2] * u[0] + J[3] * u[1]], Jv = [J[0] * v[0] + J[1] * v[1], J[2] * v[0] + J[3] * v[1]], JTv = [J[0] * v[0] + J[2] * v[1], J[1] * v[0] + J[3] * v[1]];
    const back = [r.coordAccel[0] - (Ju[0] + Jv[0] - JTv[0]), r.coordAccel[1] - (Ju[1] + Jv[1] - JTv[1])];
    const scale = Math.max(nrm(r.coordAccel), nrm(Ju), nrm(Jv), nrm(JTv), dn, 1e-300);
    const rhsRel = nrm(sub(back, du)) / scale;
    const rowOk = (c.linear ? steps.every((s) => s.belowFloor)
      : (steps[2].err <= 1e-4 && order.every((o, q) => o === null || steps[q + 1].belowFloor || (o >= ORDER_WINDOW[0] && o <= ORDER_WINDOW[1]))))
      && rhsRel <= 1e-12;
    rows.push({ body: i, tau, u: F.u, dUdt: du, steps, order, rhsRel, ok: rowOk });
  }
  return { key: c.key, label: c.label, linear: c.linear, H: c.H, rows, ok: rows.length > 0 && rows.every((r) => r.ok) };
}
/** 範囲の外: 台帳あり(taylor + bgModel sources)→ 源から再展開(sources の値とビット一致)・台帳なし → 一次のまま(消さない)・範囲外を数える。 */
export function rangeCheck(HP) {
  const ledger = [{ id: 's1', m: 5e3, x: -2000, y: 800, vx: 1.5, vy: -0.3, ax: 0.002, ay: 0.001 }];
  const Tsrc = { mode: 'sources', t0: 0, derivFrame: 'frame', widthT: 1e9, version: null };
  const vb = HP.validateBackgroundComplex({ background: 'declared', note: '第287便c 範囲の外', bgModel: 'sources', ledger, refPos: [0, 0], eps: 0,
    sources: [{ id: 's1', kind: 'field', excludedExplicit: true }], frame: clone(FR), timeContract: { mode: 'taylor', t0: 0, derivFrame: 'frame', radiusR: 50, widthT: 20 } });
  if (!vb.ok) return { ok: false, err: vb.err };
  const B = vb.backgroundComplex, T = HP.bgTimePrepare(B), Ts = Object.assign({}, T, Tsrc);
  const inside = HP.bgTimeMomentsAt(B, T, 3, -4, 5), outT = HP.bgTimeMomentsAt(B, T, 3, -4, 25), outR = HP.bgTimeMomentsAt(B, T, 60, 0, 5);
  const exT = HP.bgTimeMomentsAt(B, Ts, 3, -4, 25), exR = HP.bgTimeMomentsAt(B, Ts, 60, 0, 5);
  const flat = (m) => [m.W].concat(m.A, m.gradW, m.gradA, [m.dWdt], m.dAdt);
  const same = (a, b) => flat(a).every((v, i) => Object.is(v, flat(b)[i]));
  const lin = (tau, dx, dy) => ({ W: B.W0 + B.gradW[0] * dx + B.gradW[1] * dy + B.dWdt * tau });
  // 台帳なし(手入力の taylor)
  const vh = HP.validateBackgroundComplex({ background: 'declared', note: '第287便c 範囲の外(台帳なし)', W0: 1, A0: [2.3, 0], gradW: [0.002, -0.001], gradA: [0.001, 0.0005, -0.0004, 0.002],
    dWdt: -0.004, dAdt: [0.01, -0.006], sources: [{ id: 'f', kind: 'field', excludedExplicit: true }], frame: clone(FR),
    timeContract: { mode: 'taylor', t0: 0, derivFrame: 'frame', radiusR: 50, widthT: 20 } });
  const Bh = vh.backgroundComplex, Th = HP.bgTimePrepare(Bh), hOut = HP.bgTimeMomentsAt(Bh, Th, 3, -4, 25);
  const hLinW = Bh.W0 + Bh.gradW[0] * 3 + Bh.gradW[1] * -4 + Bh.dWdt * 25;
  const out = {
    ledger: { insideOut: inside.out, insideReexp: inside.reexp, insideLinear: Object.is(inside.bg.W, lin(5, 3, -4).W),
      timeReexp: outT.reexp, timeSameAsSources: same(outT.bg, exT.bg), spaceReexp: outR.reexp, spaceSameAsSources: same(outR.bg, exR.bg) },
    noLedger: { out: hOut.out, reexp: hOut.reexp, keptLinear: Object.is(hOut.bg.W, hLinW), W: hOut.bg.W } };
  out.ok = !inside.out && !inside.reexp && out.ledger.insideLinear && outT.reexp && out.ledger.timeSameAsSources && outR.reexp && out.ledger.spaceSameAsSources
    && hOut.out === true && hOut.reexp === false && out.noLedger.keptLinear && hOut.bg.W > 0;
  return out;
}
/** 🔁: 時間微分 0 の背景は宣言なしで値が時間で動かない(∂ₜu=[0,0]・ビット)。 */
export function mercuryStatic(HP) {
  const P = find(HP, 'mercuryGeoToy3'), b = build(HP, P);
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S, rows = [];
  for (let i = 0; i < S.n; i++) {
    const f0 = fieldAt(HP, S, i, S.t), f1 = fieldAt(HP, S, i, S.t + 1e4);
    rows.push({ body: i, u: f0.u, dUdt: f0.dUdt, same: f0.u.every((v, k) => Object.is(v, f1.u[k])) && f0.dUdt.every((v) => v === 0) });
  }
  const bgc = P.physics.backgroundComplex;
  return { declaresTime: bgc.timeContract !== undefined, needsTime: HP.bgTimeNeeded(bgc), hasTime: !!(S.meshVel && S.meshVel.bg && S.meshVel.bg.time), rows,
    ok: bgc.timeContract === undefined && !HP.bgTimeNeeded(bgc) && rows.every((r) => r.same) };
}

// ---- (C) 🌒 の前後(周期)と η_bg
export function kf0Copy(HP) {
  const P = clone(find(HP, 'plutoCharonReal'));
  P.physics.kFrame = 0; if (P.physics.geoPN === 2) P.physics.geoPN = 1;   // 正式の判定器(__w249build)の kF0 の写し方
  P.id = 'w287cKf0Copy';
  return P;
}
/** 相対角(天体 1 − 天体 0)を連続化し、|累積角| が 2π・4π を越える時刻を線形内挿で取る。2 周目 = t(4π)−t(2π)。 */
export function periodRun(HP, P, dt) {
  const b = build(HP, P);
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S, ang = () => Math.atan2(S.y[1] - S.y[0], S.x[1] - S.x[0]);
  let prev = ang(), cum = 0, tPrev = S.t, k = 0;
  const cross = [];
  const maxSteps = Math.ceil(3 * 5600 / dt);
  for (let s = 0; s < maxSteps && cross.length < 2; s++) {
    S.step(dt);
    const a = ang(); let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const c0 = Math.abs(cum), c1 = Math.abs(cum + d), goal = 2 * Math.PI * (cross.length + 1);
    if (c1 >= goal && c0 < goal) cross.push(tPrev + (S.t - tPrev) * (goal - c0) / (c1 - c0));
    cum += d; prev = a; tPrev = S.t; k = s + 1;
  }
  const T = T_UNIT_S(P);
  return { ok: cross.length === 2, steps: k, dt, tEnd: S.t, cross, period2S: cross.length === 2 ? (cross[1] - cross[0]) * T : null,
    meshVel: S.hasMeshVelocity ? { n: S.meshVelN, undef: S.meshVelUndef, bad: S.meshVelBad, timeOut: S.meshVelTimeOut || 0, timeReexp: S.meshVelTimeReexp || 0 } : null,
    state: [S.x[0], S.y[0], S.x[1], S.y[1], S.vx[0], S.vy[0], S.vx[1], S.vy[1]] };
}
/** η_bg=|a_bg|/|a_grav|(a_bg=coordAccel−a_space: 背景が座標加速度へ入れる分)。共通分(両天体の平均)と相対分(差)を分ける。 */
export function etaBg(HP, S) {
  const G = S.params.G, e2 = S.params.softening * S.params.softening, aBg = [], aG = [];
  for (let i = 0; i < 2; i++) {
    const F = HP.dfmMeshVelocityFieldAt(S, i), r = HP.dfmMeshVelocityRHS(F, [S.vx[i], S.vy[i]], [0, 0]);
    aBg.push(r.coordAccel);
    const j = 1 - i, dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], q = dx * dx + dy * dy + e2, iq3 = 1 / (q * Math.sqrt(q));
    aG.push([G * S.m[j] * dx * iq3, G * S.m[j] * dy * iq3]);
  }
  const rel = sub(aBg[1], aBg[0]), relG = sub(aG[1], aG[0]);
  return { t: S.t, aBg, aGrav: aG, eta: [nrm(aBg[0]) / nrm(aG[0]), nrm(aBg[1]) / nrm(aG[1])], etaRel: nrm(rel) / nrm(relG) };
}
/** 第297便a(原仮定者の裁定(第87報)「geoPN=2・3・4 のサンプルは全て λ_PN=0」・R161): 🌒 は第297便a で旧メッシュの力学の 1PN を外した
 *  (spaceMesh.pn "reference-1PN" → "off"・pnVelocity を外す・λ_PN 1 → 0)。基点 f94ca580 との前後は**第296便までの宣言へ戻した写し**で照合する
 *  (器の中だけ —— 本の宣言は今のまま。今の 🌒 の周期は rows と beforeAfterNow に記録する)。 */
export const CHARON_DECL_W296 = { lambdaPN: 1, spaceMesh: { pn: 'reference-1PN', pnVelocity: 'v' } };
export function charonHistCopy(P) {
  const ph = P.physics || {}, sm = ph.spaceMesh || {};
  if (!(sm.pn === 'off' && ph.lambdaPN === 0)) return null;   // 第297便a の前の宣言(戻す必要がない)
  const Q = clone(P);
  Q.physics.lambdaPN = CHARON_DECL_W296.lambdaPN;
  Q.physics.spaceMesh = Object.assign({}, Q.physics.spaceMesh, CHARON_DECL_W296.spaceMesh);
  Q.id = 'w287cCharonDeclW296';
  return Q;
}
export function charonRuns(HP) {
  const P = find(HP, 'charonGeoToy3'), K = kf0Copy(HP), out = { steps: {}, rows: {} };
  for (const [key, dt] of [['dt', DT], ['dtHalf', DT / 2]]) {
    const a = periodRun(HP, P, dt);
    const eEnd = a.ok ? etaBg(HP, HP.sim) : null;
    const k = periodRun(HP, K, dt);
    out.rows[key] = { charon: a, kf0: k, diffS: (a.ok && k.ok) ? a.period2S - k.period2S : null, etaEnd: eEnd };
  }
  // 採らない形の診断: 同じ 6 成分を taylor(一次・勾配を凍結)で動かす写し —— 見かけのせん断 −τ ∂ₜu⊗∇W/W の大きさを周期で見る
  const Tv = clone(P), tb = Tv.physics.backgroundComplex;
  for (const k of ['bgModel', 'ledger', 'refPos', 'eps']) delete tb[k];
  tb.timeContract = { mode: 'taylor', t0: 0, derivFrame: 'frame', radiusR: 100, widthT: 340000 };
  Tv.id = 'w287cCharonTaylor';
  { const a = periodRun(HP, Tv, DT); out.taylorVariant = { contract: tb.timeContract, charon: a, diffS: (a.ok && out.rows.dt.kf0.ok) ? a.period2S - out.rows.dt.kf0.period2S : null,
    vsSourcesS: (a.ok && out.rows.dt.charon.ok) ? a.period2S - out.rows.dt.charon.period2S : null }; }
  const b = build(HP, P); out.eta0 = b.ok ? etaBg(HP, b.S) : null;
  out.before = BEFORE_F94;
  // 第297便a: 前後の照合は第296便までの宣言へ戻した写し(H)で —— 戻す必要がない世代は今の 🌒 そのもの
  const H = charonHistCopy(P);
  const hist = H ? { dt: periodRun(HP, H, DT), dtHalf: periodRun(HP, H, DT / 2) } : { dt: out.rows.dt.charon, dtHalf: out.rows.dtHalf.charon };
  if (H) out.histDecl = { id: H.id, restored: CHARON_DECL_W296, dt: hist.dt, dtHalf: hist.dtHalf,
    note: '第297便a で 🌒 の宣言が変わった(pn:"off"・λ_PN=0)—— 基点 f94ca580 との前後は第296便までの宣言へ戻した写しで照合する(器の中だけ)' };
  out.beforeAfter = { dtS: hist.dt.ok ? hist.dt.period2S - BEFORE_F94.period2S.dt : null,
    dtHalfS: hist.dtHalf.ok ? hist.dtHalf.period2S - BEFORE_F94.period2S.dtHalf : null,
    kf0SameAsBefore: out.rows.dt.kf0.period2S === BEFORE_F94.kf0Period2S.dt && out.rows.dtHalf.kf0.period2S === BEFORE_F94.kf0Period2S.dtHalf,
    declHist: !!H };
  // 今の宣言の 🌒 と基点の差(記録 —— 第297便a の力学の 1PN を外した分。門ではない)
  if (H) out.beforeAfterNow = { dtS: out.rows.dt.charon.ok ? out.rows.dt.charon.period2S - BEFORE_F94.period2S.dt : null,
    dtHalfS: out.rows.dtHalf.charon.ok ? out.rows.dtHalf.charon.period2S - BEFORE_F94.period2S.dtHalf : null };
  const rr = out.rows;
  out.ok = rr.dt.charon.ok && rr.dt.kf0.ok && rr.dtHalf.charon.ok && rr.dtHalf.kf0.ok && rr.dt.charon.meshVel.bad === 0 && rr.dt.charon.meshVel.timeOut === 0;
  return out;
}

// ---- (D) share-p1 の基準コピー(🪁 の写しに明示した静止背景 —— 器の中だけ)
export const P1_STEPS = 600;
export function p1Copy(HP) {
  const P = clone(find(HP, 'galaxyMeshSpiralGeoToy'));
  P.physics.backgroundComplex = { background: 'declared', note: '第287便c share-p1 の基準コピー: 静止一様背景 W_bg=旧 W_bg(D₀=1.5)・A=0・微分 0',
    W0: P.physics.D0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0],
    sources: [{ id: 'bg:uniform-static', kind: 'field', excludedExplicit: true }], frame: clone(FR),
    lawVersion: 'share-p1', lawUnits: clone(HP.BGC_LAW_UNITS['share-p1']), lawDomainR: 1e5, lawWZero: 'vacuum' };
  P.id = 'w287cP1Ref';
  return P;
}
function runState(HP, P, N) {
  const b = build(HP, P);
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S;
  for (let k = 0; k < N; k++) S.step(DT);
  const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
  return { ok: true, n: S.n, st, stop: S.geoToyStop || null, law: S.bgLaw ? (S.bgLaw.law || null) : null, deny: S.bgLaw ? (S.bgLaw.deny || null) : null,
    bgLawSteps: S.bgLawSteps || 0, wire: HP.bgcWireState ? HP.bgcWireState(S) : null };
}
export function p1Reference(HP) {
  const base = runState(HP, find(HP, 'galaxyMeshSpiralGeoToy'), P1_STEPS), cp = runState(HP, p1Copy(HP), P1_STEPS);
  const same = base.ok && cp.ok && base.st.length === cp.st.length && base.st.every((v, i) => Object.is(v, cp.st[i]));
  let maxAbs = null; if (base.ok && cp.ok) { maxAbs = 0; for (let i = 0; i < base.st.length; i++) maxAbs = Math.max(maxAbs, Math.abs(base.st[i] - cp.st[i])); }
  return { steps: P1_STEPS, dt: DT, n: base.n, W0: find(HP, 'galaxyMeshSpiralGeoToy').physics.D0, copy: { ok: cp.ok, err: cp.err || null, law: cp.law, deny: cp.deny, stop: cp.stop, bgLawSteps: cp.bgLawSteps,
    wire: cp.wire }, baseStop: base.stop, bitSame: same, maxAbsDiff: maxAbs, ok: same && cp.law === 'share-p1' && cp.bgLawSteps === P1_STEPS && !cp.stop };
}

// ---- (E) 受理器と相互検査の事例
export function validatorCases(HP) {
  const base = { background: 'declared', note: '第287便c 時間の契約の受理器', W0: 1, A0: [2.3, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0.01, 0],
    sources: [{ id: 'f', kind: 'field', excludedExplicit: true }], frame: clone(FR) };
  const tc = (o) => Object.assign(clone(base), { timeContract: Object.assign({ mode: 'taylor', t0: 0, derivFrame: 'frame', radiusR: 100, widthT: 1e4 }, o) });
  const drop = (o, k) => { const q = clone(o); delete q.timeContract[k]; return q; };
  const led = { bgModel: 'sources', ledger: [{ id: 'f', m: 2, x: -50, y: 0, vx: 0, vy: 1, ax: 0.01, ay: 0 }], refPos: [0, 0], eps: 0 };
  const srcBase = () => { const q = clone(base); for (const k of ['W0', 'A0', 'gradW', 'gradA', 'dWdt', 'dAdt']) delete q[k]; return Object.assign(q, clone(led)); };
  const C = [
    ['taylor(t0・derivFrame・radiusR・widthT)', tc({}), true],
    ['sources と bgModel "sources"', Object.assign(srcBase(), { timeContract: { mode: 'sources', t0: 0, derivFrame: 'frame', widthT: 1e4 } }), true],
    ['taylor と bgModel "sources"(範囲の外は源から再展開)', Object.assign(srcBase(), { timeContract: { mode: 'taylor', t0: 0, derivFrame: 'frame', radiusR: 10, widthT: 5 } }), true],
    ['timeContract:null(未宣言)', Object.assign(clone(base), { timeContract: null }), true],
    ['未知の mode', tc({ mode: 'linear' }), false],
    ['t0 なし', drop(tc({}), 't0'), false],
    ['derivFrame なし(固定座標か移動座標かが決まらない)', drop(tc({}), 'derivFrame'), false],
    ['derivFrame "inertial"', tc({ derivFrame: 'inertial' }), false],
    ['widthT なし(時間有効幅の宣言なし)', drop(tc({}), 'widthT'), false],
    ['widthT=0', tc({ widthT: 0 }), false],
    ['taylor で radiusR なし', drop(tc({}), 'radiusR'), false],
    ['sources で radiusR を書く', Object.assign(srcBase(), { timeContract: { mode: 'sources', t0: 0, derivFrame: 'frame', widthT: 1e4, radiusR: 5 } }), false],
    ['sources で台帳なし(手入力)', tc({ mode: 'sources', radiusR: undefined }), false],
    ['知らない鍵', tc({ dUdt: [0, 0] }), false],
    ['配列', Object.assign(clone(base), { timeContract: [1] }), false]];
  const rows = C.map(([label, decl, want]) => {
    const v = HP.validateBackgroundComplex(clone(decl));
    let idem = null;
    if (v.ok) { const v2 = HP.validateBackgroundComplex(clone(v.backgroundComplex)); idem = v2.ok && JSON.stringify(v2.backgroundComplex) === JSON.stringify(v.backgroundComplex); }
    return { label, want, got: v.ok, idempotent: idem, ok: v.ok === want && idem !== false, err: v.ok ? null : v.err };
  });
  // 経路の相互検査(validatePreset): 時間微分のある背景で宣言なしは拒否・宣言ありは受理・時間微分 0 は宣言なしで受理
  const P = find(HP, 'charonGeoToy3');
  const strip = clone(P); delete strip.physics.backgroundComplex.timeContract;
  const vp = (p) => { const r = HP.validatePreset(clone(p)); return { ok: r.ok, err: r.ok ? null : String(JSON.stringify(r.errors || r.err)).slice(0, 200) }; };
  const cross = { charon: vp(P), charonNoContract: vp(strip), mercury: vp(find(HP, 'mercuryGeoToy3')) };
  const crossOk = cross.charon.ok && !cross.charonNoContract.ok && /timeContract/.test(cross.charonNoContract.err || '') && cross.mercury.ok;
  return { rows, cross, ok: rows.every((r) => r.ok) && crossOk };
}

// ---- (F) 棚卸し
export function census(HP) {
  const all = HP.allPresets();
  const declared = all.filter((p) => p.physics && p.physics.backgroundComplex && p.physics.backgroundComplex.timeContract !== undefined).map((p) => p.id);
  const needs = all.filter((p) => { const b = p.physics && p.physics.backgroundComplex; if (!b) return false; const v = HP.validateBackgroundComplex(clone(b)); return v.ok && HP.bgTimeNeeded(v.backgroundComplex); }).map((p) => p.id);
  const missing = needs.filter((id) => declared.indexOf(id) < 0);
  const lawDeclared = all.filter((p) => p.physics && p.physics.backgroundComplex && p.physics.backgroundComplex.lawVersion !== undefined).map((p) => p.id);
  return { nPresets: all.length, timeContract: declared, needsTime: needs, missing, lawVersionDeclared: lawDeclared, version: HP.BGC_TIME_VERSION,
    ok: missing.length === 0 && lawDeclared.length === 0 };
}

const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(2);
/** PHYSICS〔第287便c〕の表の行(QA docs が照合する)。 */
export function docRows(J) {
  const out = { cx: [], fd: [], law: [] };
  for (const r of J.counterexample.rows) out.cx.push(`| 天体 ${r.body} | ${f3(r.old.timeDiff[0])} | ${f3(r.old.dUdt[0])} | ${f3(r.now.timeDiff[0])} | ${f3(r.now.dUdt[0])} | ${f3(r.now.rel)} |`);
  for (const c of J.fd) for (const r of c.rows) out.fd.push(`| ${c.key} | ${r.body} | ${r.tau} | ${r.steps.map((s) => f3(s.err)).join(' / ')} | ${r.order.map(f2).join(' / ')} | ${r.steps[2].belowFloor ? '床の下' : '床の上'} | ${f3(r.rhsRel)} |`);
  for (const r of J.validator.rows) out.law.push(`| ${r.label} | ${r.want ? '受理' : '拒否'} | ${r.got ? '受理' : '拒否'} |`);
  return out;
}

export function computeAll(HP) {
  return { counterexample: counterexample(HP), fd: fdCases(HP).map((c) => fdCheck(HP, c)), range: rangeCheck(HP), mercury: mercuryStatic(HP),
    validator: validatorCases(HP), census: census(HP), htmlVersion: HP.BGC_TIME_VERSION };
}
export function computeRuns(HP) { return { charon: charonRuns(HP), p1: p1Reference(HP) }; }

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W287C_OUT || path.join(ROOT, 'tests', 'out', 'bgtime-w287c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  for (const r of R.counterexample.rows) console.log(`(A) 天体 ${r.body}: 旧 u(t0+1)−u(t0)=${JSON.stringify(r.old.timeDiff)} 返却 ∂ₜu=${JSON.stringify(r.old.dUdt)} / 新 差=${JSON.stringify(r.now.timeDiff)} ∂ₜu=${JSON.stringify(r.now.dUdt)} rel ${r.now.rel}`);
  for (const c of R.fd) console.log(`(B) ${c.key} ok ${c.ok} ` + c.rows.map((r) => `[${r.body}@${r.tau}] err ${r.steps.map((s) => s.err.toExponential(2)).join('/')} floor ${r.steps.map((s) => s.floor.toExponential(1)).join('/')} ord ${r.order.map(f2).join('/')} rhs ${r.rhsRel.toExponential(1)}`).join(' '));
  console.log(`(B) 範囲の外 ${JSON.stringify(R.range)}`);
  console.log(`(B) 🔁 ${JSON.stringify(R.mercury)}`);
  console.log(`(E) 受理器 ${R.validator.rows.filter((z) => z.ok).length}/${R.validator.rows.length} 相互検査 ${JSON.stringify(R.validator.cross)} ok ${R.validator.ok}`);
  console.log(`(F) ${JSON.stringify(R.census)}`);
  const Q = computeRuns(HP);
  for (const k of ['dt', 'dtHalf']) { const r = Q.charon.rows[k]; console.log(`(C) ${k}: 🌒 P2=${r.charon.period2S} kF0 P2=${r.kf0.period2S} 差 ${r.diffS} s・步 ${r.charon.steps}・meshVel ${JSON.stringify(r.charon.meshVel)}・η_end ${JSON.stringify(r.etaEnd && { eta: r.etaEnd.eta, etaRel: r.etaEnd.etaRel })}`); }
  console.log(`(C) η0 ${JSON.stringify(Q.charon.eta0 && { eta: Q.charon.eta0.eta, etaRel: Q.charon.eta0.etaRel })}`);
  console.log(`(D) p1 ${JSON.stringify(Q.p1)}`);
  const CODE = ['tests/exp-w287c-bgtime.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第287便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第77報)⑤と第77報で閉じた AN64(complex-p2 を既定にしない・昇格条件)/AN73(🌒 の扱い)・統括の検証項目 R109(背景場の時間発展の契約)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    notClaim: ['背景法則版を内蔵に接続した', '安定化した', '観測と合った', '新発見'] });
  const out = { meta, ...R, ...Q, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)');
}

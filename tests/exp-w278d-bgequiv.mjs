// 第278便d(統括の読み R56)— **明示天体 ↔ 局所背景展開の一致試験**の器(純関数の 2 体 + 外部源 1 つ・**エンジンではない**)。
//
// ■ 何を測るか
//   R56 ①「同じ外部源を『明示天体』と『局所背景展開』に分け直したときの一致」。
//   ❄️(冥王星–カロン + 太陽)・🌘(地球–月 + 太陽)・📻(PSR J0737−3039A/B + 銀河の点質量)で、
//   外部源を**明示天体**として置いた走行(EXP)と、**背景展開**として置いた走行(BG のはしご)の
//   **ON/OFF 差**(周期差・位相差・位置差 —— 1 公転・RK4)を比べ、食い違いを**項ごと**に切り分ける。
//   併せて ③ 潮汐テンソル T の純関数側の検算、④ 移流項 (V·∇) の数値検証、② の W_eff(明示天体との
//   一致から逆算した実効の重み —— **診断値**)を出す。
//
// ■ 宣言(**測る前に書く**)
//   (E1) 外部源の質量・距離は第276便a の事前予測表(`tests/out/bgpredict-w276a.json` の predictedSI.M・r)。
//        外部源は重心から −x̂ 方向・対の重心は +ŷ と逆向き(−ŷ)に円軌道速度 v=√(G M/r)(G はサンプル自身の値)。
//        対の初期状態はサンプルの宣言そのもの(値は 1 つも変えない)。
//   (E2) 結合は第277便d と同じ差分形 a_i = g_i + k·(a_coord^ON − a_coord^OFF)・k=1・p=2・ε はサンプルの値。
//        源の加速度はニュートンの加速度だけ。OFF は同じ重力模型で場の結合を切った走行。
//   (E3) 一致の門(**測る前に宣言** —— 採否ではなく「一致したか」の物差し):
//        G_rel: |Δt_phase(EXP) − Δt_phase(BG)| ≤ 1e−3·|Δt_phase(EXP)|(背景展開が明示天体の効果を 0.1% で再現)
//        かつ食い違いそのものが刻み収束している(|d2| ≤ 0.1·|食い違い| または |d2| ≤ 1e−9 s)。
//        G_abs(**参考 —— 閾値は採用しない**): |食い違い| ≤ 1e−3·σ_Buie = 25.92 μs なら「その閾値なら一致」。
//        ON 走行の軌道が 1 公転で壊れる行(e≥1)は**差として読まない**。
//   (E4) 刻み: N・2N・4N(dt 半減 2 段)。報告値は 4N、収束幅は |Q(2N)−Q(4N)|。
//
// ■ しないこと
//   ・エンジンに接続しない・内蔵の値を 1 つも変えない(ページは宣言を読むだけ)。
//   ・閾値 1e−3σ_Buie を採用しない・「無視できる」は一致試験を通った規格化についてだけ書く。
//   ・D₀ を読まない(D₀ を希釈項として戻す案は採らない —— R56)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w278d-bgequiv.mjs
// 出力: tests/out/bgequiv-w278d.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import {
  BGEQUIV_VERSION, decompositionIdentity, runEquiv, runDiff, diffMismatch, convergence,
  pointMassTidal, pointMassTidal3, tidalCheck, normalizeTidal, advectionIdentity, advectionFDCheck,
  sourceContribution,
} from './lib-w278d-bgequiv.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["earthMoonRealKF1","plutoCharonReal","psrDoubleAB"],"roots":["$","HP.BG_TIDAL_DIMS","HP.BG_TIDAL_NESTED","HP.BG_TIDAL_REQUIRED","HP.BG_TIDAL_UNIT","HP.allPresets","HP.sim","HP.validateBackgroundTidal","HP.validatePreset","T","applyQLock","ch","ctx","dfmField","dfmGeoToyStep","dfmLocalMeshField","isNum","validateBackgroundTidal","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const OUT = path.join(ROOT, 'tests', 'out', 'bgequiv-w278d.json');
const HARNESS_VERSION = 'w278d-bgequiv-1';
const SIGMA_BUIE = 0.02592;
const N0 = Number(process.env.W278D_STEPS || 20000);
const NS = [N0, 2 * N0, 4 * N0];

const SAMPLES = [
  { id: 'plutoCharonReal', emoji: '❄️', label: '冥王星–カロン', ext: '太陽' },
  { id: 'earthMoonRealKF1', emoji: '🌘', label: '地球–月(kFrame=1)', ext: '太陽' },
  { id: 'psrDoubleAB', emoji: '📻', label: 'PSR J0737−3039A/B', ext: '銀河(点質量)' },
];

/* ── ① ページから宣言を読む(値は 1 つも変えない)+ 潮汐鍵の受理契約をページと純関数で突き合わせる ── */
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);
const declared = await page.evaluate((ids) => {
  const out = {};
  for (const id of ids) {
    const s = HP.allPresets().find((q) => q.id === id);
    if (!s) { out[id] = { missing: true }; continue; }
    const v = HP.validatePreset(JSON.parse(JSON.stringify(s)));
    if (!v.ok) { out[id] = { error: v.errors }; continue; }
    const ph = v.preset.physics;
    out[id] = { emoji: s.emoji, scaleExp: s.scaleExp || null, G: ph.G, softening: ph.softening,
      bodies: v.preset.bodies.map((b) => ({ m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy })) };
  }
  return out;
}, SAMPLES.map((s) => s.id));
// 受理契約の突合(アプリの validateBackgroundTidal と純関数 normalizeTidal)
const TIDAL_CASES = {
  ok2: { T: [[1e-18, 2e-19], [2e-19, -5e-19]], unit: '1/s^2', frame: 'sample-xy', epoch: 'JD 2452600.5', source: '太陽の点質量 GM/r³' },
  ok3: { T: [[1, 0, 0], [0, 1, 0], [0, 0, -2]], unit: '1/s^2', frame: 'icrs', epoch: 'J2000', source: 'test', note: '3×3' },
  zero: { T: [[0, 0], [0, 0]], unit: '1/s^2', frame: 'sample-xy', epoch: 'J2000', source: '0 と宣言' },
  asym: { T: [[1, 2], [2.0000001, 1]], unit: '1/s^2', frame: 'f', epoch: 'e', source: 's' },
  nonFinite: { T: [[1, NaN], [NaN, 1]], unit: '1/s^2', frame: 'f', epoch: 'e', source: 's' },
  dim4: { T: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], unit: '1/s^2', frame: 'f', epoch: 'e', source: 's' },
  ragged: { T: [[1, 0], [0]], unit: '1/s^2', frame: 'f', epoch: 'e', source: 's' },
  unitJ: { T: [[1, 0], [0, 1]], unit: '1/s', frame: 'f', epoch: 'e', source: 's' },
  noUnit: { T: [[1, 0], [0, 1]], frame: 'f', epoch: 'e', source: 's' },
  noFrame: { T: [[1, 0], [0, 1]], unit: '1/s^2', epoch: 'e', source: 's' },
  noEpoch: { T: [[1, 0], [0, 1]], unit: '1/s^2', frame: 'f', source: 's' },
  noSource: { T: [[1, 0], [0, 1]], unit: '1/s^2', frame: 'f', epoch: 'e' },
  emptySource: { T: [[1, 0], [0, 1]], unit: '1/s^2', frame: 'f', epoch: 'e', source: '' },
  extraW0: { T: [[1, 0], [0, 1]], unit: '1/s^2', frame: 'f', epoch: 'e', source: 's', W0: 1 },
  flat: { T: [1, 0, 0, 1], unit: '1/s^2', frame: 'f', epoch: 'e', source: 's' },
  array: [[1, 0], [0, 1]],
  none: null,
};
const tidalPage = await page.evaluate((cases) => {
  const out = {};
  for (const [k, v] of Object.entries(cases)) {
    const c = JSON.parse(JSON.stringify(v, (kk, vv) => (typeof vv === 'number' && !Number.isFinite(vv)) ? '__NaN__' : vv),
      (kk, vv) => vv === '__NaN__' ? NaN : vv);
    const r = HP.validateBackgroundTidal(c);
    out[k] = { ok: r.ok, value: r.ok ? r.backgroundTidal : null, err: r.ok ? null : String(r.err).slice(0, 120) };
  }
  return { cases: out, unit: HP.BG_TIDAL_UNIT, dims: HP.BG_TIDAL_DIMS, required: HP.BG_TIDAL_REQUIRED,
    nested: HP.BG_TIDAL_NESTED };
}, TIDAL_CASES);
await browser.close();
const tidalContract = Object.keys(TIDAL_CASES).map((k) => {
  const lib = normalizeTidal(TIDAL_CASES[k]);
  const pg = tidalPage.cases[k];
  return { case: k, page: pg.ok, lib: lib.ok, agree: pg.ok === lib.ok
    && (!pg.ok || JSON.stringify(pg.value) === JSON.stringify(lib.value)), pageErr: pg.err, libWhy: lib.why || null };
});

/* ── ② 入力(事前予測表の外部源の質量・距離)── */
const PRED = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'bgpredict-w276a.json'), 'utf8'));
const predOf = (id) => { const r = (PRED.rows || []).find((q) => q.id === id); return r && r.predictedSI ? r.predictedSI : null; };

const toSI = (d) => {
  const L = Math.pow(10, d.scaleExp.L), T = Math.pow(10, d.scaleExp.T), Mu = Math.pow(10, d.scaleExp.M);
  const V = L / T;
  const G = d.G * Math.pow(10, 3 * d.scaleExp.L - d.scaleExp.M - 2 * d.scaleExp.T);
  return { G, eps: d.softening * L,
    bodies: d.bodies.map((b) => ({ m: b.m * Mu, x: b.x * L, y: b.y * L, vx: b.vx * V, vy: b.vy * V })) };
};

/* ── ③ 模型の並び(はしご)── */
const ON_MODELS = [
  { key: 'L0ff', label: 'L0ff 凍結・自由落下系(第277便d の置き方)', model: { field: 'L0ff', gravity: 'none' }, off: 'none' },
  { key: 'L0ffW', label: 'L0ff 重みだけ', model: { field: 'L0ff', gravity: 'none', weightOnly: true }, off: 'none' },
  { key: 'L0', label: 'L0 凍結・慣性系', model: { field: 'L0', gravity: 'uniform' }, off: 'uniform' },
  { key: 'L0W', label: 'L0 重みだけ', model: { field: 'L0', gravity: 'uniform', weightOnly: true }, off: 'uniform' },
  { key: 'L1', label: 'L1 重心で毎回評価', model: { field: 'L1', gravity: 'uniform' }, off: 'uniform' },
  { key: 'L2', label: 'L2 + 値の位置一次補正', model: { field: 'L2', gravity: 'uniform' }, off: 'uniform' },
  { key: 'L3', label: 'L3 各天体の位置で厳密', model: { field: 'bgExact', gravity: 'uniform' }, off: 'uniform' },
  { key: 'L3T', label: 'L3 + 線形潮汐 T', model: { field: 'bgExact', gravity: 'tidal' }, off: 'tidal' },
  { key: 'L3F', label: 'L3 + 厳密な外部重力', model: { field: 'bgExact', gravity: 'full' }, off: 'full' },
  { key: 'EXP', label: 'EXP 明示天体(外部源は静止)', model: { field: 'exact', gravity: 'full' }, off: 'full' },
  { key: 'EXPR1', label: 'EXP + 反作用(ニュートン)', model: { field: 'exact', gravity: 'full', reaction: 'newton' }, off: 'fullN' },
  { key: 'EXPR2', label: 'EXP + 反作用(ニュートン+座標変換項)', model: { field: 'exact', gravity: 'full', reaction: 'newton+dfm' }, off: 'fullN' },
];
const OFF_MODELS = {
  none: { field: 'none', gravity: 'none' }, uniform: { field: 'none', gravity: 'uniform' },
  tidal: { field: 'none', gravity: 'tidal' }, full: { field: 'none', gravity: 'full' },
  fullN: { field: 'none', gravity: 'full', reaction: 'newton' },
};
const ITEMS = [
  { key: 'frameOfFreeze', label: '凍結する参照系(自由落下系 → 慣性系)', from: 'L0ff', to: 'L0' },
  { key: 'timeFreeze', label: '時間凍結(t=0 の値 → 重心で毎回評価)', from: 'L0', to: 'L1' },
  { key: 'valueShift1', label: '値の位置一次補正(W,A を各天体へ 1 次で移す)', from: 'L1', to: 'L2' },
  { key: 'higherOrder', label: '二次以上の場の項(各天体の位置で厳密)', from: 'L2', to: 'L3' },
  { key: 'tidalLinear', label: 'ニュートンの線形潮汐 T', from: 'L3', to: 'L3T' },
  { key: 'tidalNonlinear', label: 'ニュートン潮汐の非線形分', from: 'L3T', to: 'L3F' },
  { key: 'decomposition', label: '分解恒等式(背景として厳密 ↔ 明示天体)', from: 'L3F', to: 'EXP' },
  { key: 'reactionNewton', label: '反作用(外部源がニュートンで動く)', from: 'EXP', to: 'EXPR1' },
  { key: 'reactionDFM', label: '反作用(外部源も座標変換項を受ける)', from: 'EXPR1', to: 'EXPR2' },
];
const GATE = { name: 'bgEquivalence', declaredBeforeMeasuring: true,
  rel: '|Δt_phase(EXP) − Δt_phase(BG)| ≤ 1e−3·|Δt_phase(EXP)| かつ食い違いが刻み収束(|d2| ≤ 0.1·|食い違い| または ≤ 1e−9 s)',
  abs: '(参考・未採用)|食い違い| ≤ 1e−3·σ_Buie = 25.92 μs', relTol: 1e-3, absTolS: 1e-3 * SIGMA_BUIE,
  convAbsS: 1e-9, unreadable: 'ON 走行の軌道が 1 公転で壊れる行(e≥1)は差として読まない' };

/* ── ④ 走行 ── */
const samples = [];
const t0 = Date.now();
for (const S of SAMPLES) {
  const d = declared[S.id], pred = predOf(S.id);
  if (!d || d.missing || d.error || !pred) { samples.push({ id: S.id, emoji: S.emoji, skipped: true }); continue; }
  const si = toSI(d);
  const b0 = si.bodies[0], b1 = si.bodies[1];
  const m = [b0.m, b1.m], G = si.G, eps = si.eps, M = pred.M, rExt = pred.r;
  const r0 = [b0.x - b1.x, b0.y - b1.y], vr0 = [b0.vx - b1.vx, b0.vy - b1.vy];
  const mu = G * (m[0] + m[1]);
  const rr = Math.hypot(r0[0], r0[1]), v2 = vr0[0] ** 2 + vr0[1] ** 2;
  const aRel = 1 / (2 / rr - v2 / mu);
  const T0 = 2 * Math.PI * Math.sqrt(aRel ** 3 / mu);
  const vExt = Math.sqrt(G * M / rExt);
  const base = { G, m, M, eps, p: 2, k: 1, T0, R0: [rExt, 0], VR0: [0, -vExt], r0, vr0, vS0: [0, 0] };
  // 場の 1 点での分解恒等式(t=0・両天体)
  const mt = m[0] + m[1];
  const x0 = [m[1] / mt * r0[0], m[1] / mt * r0[1]], x1 = [-m[0] / mt * r0[0], -m[0] / mt * r0[1]];
  const vC = [0, -vExt];
  const pv0 = [vC[0] + m[1] / mt * vr0[0], vC[1] + m[1] / mt * vr0[1]];
  const pv1 = [vC[0] - m[0] / mt * vr0[0], vC[1] - m[0] / mt * vr0[1]];
  const sun = { m: M, x: -rExt, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 };
  const idPoint = [
    decompositionIdentity([{ m: m[1], x: x1[0], y: x1[1], vx: pv1[0], vy: pv1[1] }], [sun], x0[0], x0[1], { p: 2, eps }),
    decompositionIdentity([{ m: m[0], x: x0[0], y: x0[1], vx: pv0[0], vy: pv0[1] }], [sun], x1[0], x1[1], { p: 2, eps }),
  ];
  const bgAtCom = sourceContribution(sun, 0, 0, { p: 2, eps });
  const chiBg = [bgAtCom.W0 / (bgAtCom.W0 + m[1] / (rr * rr + eps * eps)), bgAtCom.W0 / (bgAtCom.W0 + m[0] / (rr * rr + eps * eps))];
  // 走行
  const runs = {};
  for (const N of NS) {
    runs[N] = { on: {}, off: {} };
    for (const [key, mdl] of Object.entries(OFF_MODELS))
      runs[N].off[key] = runEquiv(Object.assign({}, base, { steps: N, model: mdl }));
    for (const om of ON_MODELS)
      runs[N].on[om.key] = runEquiv(Object.assign({}, base, { steps: N, model: om.model }));
  }
  const diffs = {};        // diffs[key][N] = ON − OFF
  for (const om of ON_MODELS) {
    diffs[om.key] = {};
    for (const N of NS) diffs[om.key][N] = runDiff(runs[N].on[om.key], runs[N].off[om.off], T0);
  }
  const conv = (fn) => convergence(NS.map((N) => { const v = fn(N); return (v === null || v === undefined) ? null : v; }));
  const ladder = ON_MODELS.map((om) => {
    const D = diffs[om.key], on4 = runs[NS[2]].on[om.key];
    return { key: om.key, label: om.label, model: om.model, off: om.off,
      onBound: on4 && !on4.failed ? on4.bound : false, onEcc: on4 ? on4.eT : null,
      onPeriod: on4 ? on4.period : null,
      dP: conv((N) => D[N] ? D[N].dP : null), dPhaseTimeS: conv((N) => D[N] ? D[N].dPhaseTimeS : null),
      dPos: conv((N) => D[N] ? D[N].dPos : null),
      value: D[NS[2]] };
  });
  const items = ITEMS.map((it) => {
    const mm = (N) => diffMismatch(diffs[it.to][N], diffs[it.from][N]);
    const readable = ladder.find((z) => z.key === it.from).onBound && ladder.find((z) => z.key === it.to).onBound;
    return { key: it.key, label: it.label, from: it.from, to: it.to, readable,
      dP: conv((N) => { const z = mm(N); return z ? z.dP : null; }),
      dPhaseTimeS: conv((N) => { const z = mm(N); return z ? z.dPhaseTimeS : null; }),
      dPos: conv((N) => { const z = mm(N); return z ? z.dPos : null; }) };
  });
  // 総食い違い(EXP − 各 BG)と門
  const verdictOf = (bgKey) => {
    const mm = (N) => diffMismatch(diffs.EXP[N], diffs[bgKey][N]);
    const c = conv((N) => { const z = mm(N); return z ? z.dPhaseTimeS : null; });
    const cP = conv((N) => { const z = mm(N); return z ? z.dP : null; });
    const cX = conv((N) => { const z = mm(N); return z ? z.dPos : null; });
    const exp = ladder.find((z) => z.key === 'EXP'), bgl = ladder.find((z) => z.key === bgKey);
    const readable = exp.onBound && bgl.onBound;
    const effect = exp.dPhaseTimeS ? exp.dPhaseTimeS.values[2] : null;
    const mis = c ? c.values[2] : null;
    const converged = c ? (c.width <= 0.1 * Math.abs(mis) || c.width <= GATE.convAbsS) : false;
    const relOk = (readable && effect !== null && mis !== null) ? Math.abs(mis) <= GATE.relTol * Math.abs(effect) : null;
    const absOk = (readable && mis !== null) ? Math.abs(mis) <= GATE.absTolS : null;
    return { bg: bgKey, readable, effectS: effect, mismatchS: mis, mismatchRel: (effect ? mis / effect : null),
      convWidthS: c ? c.width : null, converged, mismatchPeriodS: cP ? cP.values[2] : null,
      mismatchPosM: cX ? cX.values[2] : null,
      gateRel: relOk === null ? null : (relOk && converged), gateAbsReference: absOk };
  };
  const verdicts = ['L0ff', 'L0', 'L1', 'L2', 'L3', 'L3T', 'L3F'].map(verdictOf);
  // OFF 同士(ニュートン潮汐が相対軌道へ与える差 —— 場とは無関係)
  const offTide = [['tidal', 'uniform', '線形潮汐 T(一様重力との差)'], ['full', 'tidal', '非線形分(厳密 − 線形)'],
    ['full', 'uniform', '外部重力の差動全体']].map(([a, b, label]) => ({ label, from: b, to: a,
    dP: conv((N) => { const z = runDiff(runs[N].off[a], runs[N].off[b], T0); return z ? z.dP : null; }),
    dPhaseTimeS: conv((N) => { const z = runDiff(runs[N].off[a], runs[N].off[b], T0); return z ? z.dPhaseTimeS : null; }),
    dPos: conv((N) => { const z = runDiff(runs[N].off[a], runs[N].off[b], T0); return z ? z.dPos : null; }) }));
  // W_eff(明示天体との一致から逆算した実効の重み —— **診断値**)
  const solveF = (bgKey, gravity, N) => {
    const target = diffs.EXP[N] ? diffs.EXP[N].dPhaseTimeS : null;
    const expOk = ladder.find((z) => z.key === 'EXP').onBound;
    if (target === null || !expOk) return { f: null, why: 'EXP の ON 走行が 1 公転で壊れる —— 逆算しない' };
    const offRun = runs[N].off[gravity === 'none' ? 'none' : 'uniform'];
    const g = (f) => {
      const on = runEquiv(Object.assign({}, base, { steps: N, model: { field: bgKey, gravity, fScale: f } }));
      const z = runDiff(on, offRun, T0);
      return (z && on.bound) ? z.dPhaseTimeS - target : NaN;
    };
    // **分解能**: EXP の効果そのものの刻み収束幅を f へ直した値(δf ≈ 幅/|Δt|)。
    //   f=1 での食い違いがこの幅以下なら「f_eff = 1(分解能内)」とし、割線法で雑音を追わない。
    const expC = ladder.find((z) => z.key === 'EXP').dPhaseTimeS;
    const width = expC ? Math.max(expC.width, Math.abs(target) * 4 * Number.EPSILON) : null;
    let f0 = 1, g0 = g(f0);
    if (width !== null && Number.isFinite(g0) && Math.abs(g0) <= width)
      return { f: 1, withinResolution: true, residualS: g0, resolutionF: width / Math.abs(target), steps: N };
    let f1 = 1.01, g1 = g(f1), it = 0;
    for (; it < 30; it++) {
      if (!Number.isFinite(g0) || !Number.isFinite(g1) || g1 === g0) break;
      const f2 = f1 - g1 * (f1 - f0) / (g1 - g0);
      f0 = f1; g0 = g1; f1 = f2; g1 = g(f2);
      if (Math.abs(f1 - f0) <= 1e-12 * Math.abs(f1)) break;
    }
    return Number.isFinite(g1) ? { f: f1, withinResolution: false, residualS: g1, iterations: it + 2, steps: N,
      resolutionF: width !== null ? width / Math.abs(target) : null } : { f: null, why: '収束しない' };
  };
  const wEff = {
    L0ff: [solveF('L0ff', 'none', NS[0]), solveF('L0ff', 'none', NS[1])],
    L0: [solveF('L0', 'uniform', NS[0]), solveF('L0', 'uniform', NS[1])],
  };
  // 潮汐テンソル(太陽/銀河の点質量を重心で)
  const T2 = pointMassTidal(G * M, [rExt, 0], eps), T3 = pointMassTidal3(G * M, [rExt, 0], eps);
  const tidal = { T2, T3, check2: tidalCheck(T2), check3: tidalCheck(T3),
    relAccelAtSep: Math.abs(T2[0][0]) * rr / (mu / (rr * rr)),
    note: '面内 2×2 はトレース GM/r³(= −T_zz)・3×3 は真空でトレース 0(丸めの範囲)' };
  samples.push({ id: S.id, emoji: S.emoji, label: S.label, ext: S.ext, G, eps, massesSI: m, extMassKg: M,
    extDistanceM: rExt, extSpeedMS: vExt, pairSepM: rr, aRelM: aRel, T0S: T0, steps: NS,
    W0AtCom: bgAtCom.W0, chiBg, identityPoint: idPoint, ladder, items, verdicts, offTide, wEff, tidal });
  console.log(`   ${S.emoji} ${S.id} 完了(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}

/* ── ⑤ 移流項の数値検証(④ 規約の一貫性)── */
const advection = [];
{
  const toyBg = { W0: 1, A0: [0.3, 0.1], gradW: [-0.2, 0.05], gradA: [0.1, -0.05, 0.02, 0.07], dWdt: 0.03, dAdt: [0.01, -0.02] };
  const toySrc = [{ m: 0.5, x: 1.2, y: -0.4, vx: 0.2, vy: 0.5, ax: -0.1, ay: 0.05 }];
  const V = [0.7, -0.4];
  const u = [0.6, 0.2];
  // 点源形: 速度 u_bg=(0,0.8) で動く点源の線形化(A=W u_bg・∇A=u_bg⊗∇W・∂ₜW=−∇W·u_bg・∂ₜA=u_bg ∂ₜW)
  const pointBg = { W0: 1, A0: [0, 0.8], gradW: [-0.2, 0.05], gradA: [0, 0, -0.16, 0.04], dWdt: -0.04, dAdt: [0, -0.032] };
  for (const [name, src, bg] of [['toy: 背景+局所源', toySrc, toyBg], ['toy: 背景のみ(一般の線形背景)', [], toyBg],
    ['toy: 背景のみ(点源形 ∇A=u_bg⊗∇W)', [], pointBg]]) {
    const r = advectionFDCheck(src, bg, [0, 0], V, { p: 2, eps: 0.1, h: 1e-3, dl: 1e-3, vParticle: u, Lref: 1 });
    advection.push(Object.assign({ config: name, algebraic: advectionIdentity(bg, V) }, r));
  }
  // ❄️: 冥王星(評価点)・カロン(局所源)・太陽(背景 —— 冥王星の位置で評価した点源の寄与を線形場として置く)
  const d = declared.plutoCharonReal, pred = predOf('plutoCharonReal');
  if (d && !d.missing && pred) {
    const si = toSI(d);
    const b0 = si.bodies[0], b1 = si.bodies[1];
    const G = si.G, eps = si.eps;
    const vExt = Math.sqrt(G * pred.M / pred.r);
    const dx = b0.x - b1.x, dy = b0.y - b1.y, q = dx * dx + dy * dy + eps * eps, iq3 = 1 / (q * Math.sqrt(q));
    const aC = [G * b0.m * dx * iq3, G * b0.m * dy * iq3];
    const src = [{ m: b1.m, x: b1.x, y: b1.y, vx: b1.vx, vy: b1.vy, ax: aC[0], ay: aC[1] }];
    const sun = { m: pred.M, x: b0.x - pred.r, y: b0.y, vx: 0, vy: vExt, ax: G * pred.M / (pred.r * pred.r), ay: 0 };
    const bg = sourceContribution(sun, b0.x, b0.y, { p: 2, eps });
    const V = [vExt / Math.SQRT2, vExt / Math.SQRT2];
    const r = advectionFDCheck(src, bg, [b0.x, b0.y], V, { p: 2, eps, h: 50, dl: 1e3, vParticle: [b0.vx, b0.vy],
      Lref: Math.hypot(dx, dy) });
    advection.push(Object.assign({ config: '❄️ 冥王星(評価点)+カロン(局所源)+太陽(背景・V は 45° 傾け)',
      algebraic: advectionIdentity(bg, V) }, r));
  }
}

/* ── ⑥ 書き出し ── */
const CODE = ['tests/exp-w278d-bgequiv.mjs', 'tests/lib-w278d-bgequiv.mjs', 'tests/lib-w275b-meshfield.mjs',
  'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第278便d', target: TARGET, code: CODE,
    inputs: [TARGET, 'tests/out/bgpredict-w276a.json'] }), {
    harnessVersion: HARNESS_VERSION, libVersion: BGEQUIV_VERSION, steps: NS, integrator: 'RK4(固定刻み・1 公転)+ 交差時刻の割線法',
    declarations: {
      E1: '外部源の質量・距離は事前予測表(bgpredict-w276a)・外部源は −x̂・重心は −ŷ に円軌道速度 √(GM/r)(G はサンプルの値)',
      E2: 'a_i = g_i + k·(a_coord^ON − a_coord^OFF)・k=1・p=2・源の加速度はニュートンだけ・OFF は同じ重力模型',
      E3: GATE.rel + ' / ' + GATE.abs,
      E4: 'N・2N・4N の 3 段(報告値は 4N・収束幅は |Q(2N)−Q(4N)|)' },
    doNotWrite: ['背景を無視してよいことを証明した', '背景を較正した', '閾値を採用した', '新発見', 'v1.45.0 RC を切った',
      '観測と合った'],
  }),
  gate: GATE, sigmaBuieS: SIGMA_BUIE, items: ITEMS, onModels: ON_MODELS.map((z) => ({ key: z.key, label: z.label, model: z.model, off: z.off })),
  samples, advection, tidalContract: { rows: tidalContract, allAgree: tidalContract.every((z) => z.agree),
    page: { unit: tidalPage.unit, dims: tidalPage.dims, required: tidalPage.required, nested: tidalPage.nested } },
  pageErrors, elapsedS: (Date.now() - t0) / 1000,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

/* ── 画面出力 ── */
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(4));
for (const s of samples) {
  if (s.skipped) { console.log(`${s.emoji} ${s.id} SKIP`); continue; }
  console.log(`■ ${s.emoji} ${s.label}(外部源 ${s.ext}・T0=${e(s.T0S)} s・χ_bg=${s.chiBg.map(e).join('/')})`);
  console.log(`   分解恒等式(1 点): u ${e(s.identityPoint[0].uRel)} / ∇u ${e(s.identityPoint[0].gradURel)} / ∂ₜu ${e(s.identityPoint[0].dUdtRel)}`);
  for (const L of s.ladder)
    console.log(`   ${L.key.padEnd(6)} ON−OFF Δt=${e(L.dPhaseTimeS && L.dPhaseTimeS.values[2])} s(幅 ${e(L.dPhaseTimeS && L.dPhaseTimeS.width)})`
      + ` ΔP=${e(L.dP && L.dP.values[2])} Δx=${e(L.dPos && L.dPos.values[2])} m bound=${L.onBound}`);
  for (const it of s.items)
    console.log(`   項 ${it.key.padEnd(15)} Δt=${e(it.dPhaseTimeS && it.dPhaseTimeS.values[2])} s(幅 ${e(it.dPhaseTimeS && it.dPhaseTimeS.width)})`
      + ` ΔP=${e(it.dP && it.dP.values[2])} Δx=${e(it.dPos && it.dPos.values[2])} m readable=${it.readable}`);
  for (const v of s.verdicts)
    console.log(`   門 EXP vs ${v.bg.padEnd(4)}: 食い違い ${e(v.mismatchS)} s(相対 ${e(v.mismatchRel)}・幅 ${e(v.convWidthS)})`
      + ` rel=${v.gateRel} abs(参考)=${v.gateAbsReference}`);
  console.log(`   W_eff: L0ff f=${s.wEff.L0ff.map((z) => z.f).join(' / ')} ・ L0 f=${s.wEff.L0.map((z) => z.f).join(' / ')}`);
  for (const o of s.offTide) console.log(`   OFF ${o.label}: Δt=${e(o.dPhaseTimeS && o.dPhaseTimeS.values[2])} s`);
}
for (const a of advection)
  console.log(`■ 移流 ${a.config}: FD 恒等式 ${e(a.identityFD)} / |V·∇u|/参照率 ${e(a.VgradUOverRateRef)}(見分けられる=${a.distinguishable}) / `
    + Object.entries(a.conventions).map(([k, v]) => `${k} 残差 ${e(v && v.residVsMovingFD)} a 不変 ${e(v && v.accelRel)}`).join(' / ')
    + ` / 代数 ${e(a.algebraic.maxRel)}`);
console.log(`■ 潮汐鍵の受理契約(ページ vs 純関数): ${tidalContract.filter((z) => z.agree).length}/${tidalContract.length} 一致`);
console.log(`→ ${path.relative(ROOT, OUT)}(ページエラー ${pageErrors.length}・${out.elapsedS.toFixed(1)} s)`);

// 第169便 exp-kf1sens.mjs — kf1 系3主張の dt 収束・窓感度の実測(error budget v2 の成分供給元)
// ============================================================================================
// 位置づけ: 第166便 tools/gen-error-budget.mjs が形式化した誤差予算台帳は、🪨 水星・🌘 地球月・
//   💿 土星環の3行について dtConvergence(dt 収束)と windowSensitivity(測定窓感度)を
//   **"not-instrumented"(概念はあるが計装していない)** のセンチネルで正直に埋めていた。
//   台帳側の「測っていない」宣言はそのままでは減らせない — 減らすには**実測するしかない**。
//   本便はその2成分だけを実測して埋める。物理も窓も較正値も一切変えない(fit=[])。
//
// 対象3主張(error budget の行 ID との対応):
//   ① ☄️🪨 水星近点   … error-budget claims[0] "mercury-perihelion"
//        引きずり歳差 Δϖ_drag = Δϖ(kF1,q) − Δϖ(kF0)。アームは kf1d §A の窓判定アーム q=q*
//        (= tests/out/kf1d-results.json tests.qcalc)と、台帳の window.windowArm が機械同定して
//        いる kf1c §D1 の q=5 アームの両方を測る(kF0 基線は両アームで共有)。
//   ② 🌙🌘 地球月2量 … error-budget claims[1] "earth-moon-two-observables"
//        近点回転比 Δϖ/0.05311 と 平均周期 Tavg。アームは kf1c §C/§D2 の主アーム q=5
//        (台帳の value.primaryArm が機械同定しているアームと同一)。
//   ③ 💿🛰️ 土星環     … error-budget claims[2] "saturn-ring-apsidal"
//        環偏心テスト粒子の近点ドリフト Δϖ(kF1,q*) − Δϖ(kF0)。kf1d §B の4プローブ
//        (a=80/105/130/1221.9)を測り、主観測量は a=80(claims 窓の適用先)とする。
//
// 走行構成は tests/exp-qexact.mjs(第164便)の流儀をそのまま踏襲する:
//   - 測定器は kf1c/kf1d の runRL / 環系 run() の**逐語転記**(dt と公転数だけを引数化した)。
//   - 対象 HTML の既定は index.html。既存 JSON(kf1c/kf1d)を出した対象「beta/index.html @ fbaef3a4」
//     の実体は現 HEAD の root index.html と**バイト同一**(SHA-256 efda285a…)なので、基線再測の
//     ビット一致照合が「転記が正しいこと」の機械証拠として機能する。対象 SHA の異同は
//     out.targetConsistency に機械記録する。
//   - 既存プリセット・既存結果 JSON・既存ハーネスは1 bit も変更しない(新規ファイルだけで完結)。
//
// 実行: node tests/exp-kf1sens.mjs(playwright 必須・約2分)→ tests/out/kf1sens-results.json
//   KFS_OUT=/path/x.json node tests/exp-kf1sens.mjs        … 出力先の変更(決定性の2回実行に使う)
//   KFS_DET_REF=/path/run1.json node tests/exp-kf1sens.mjs … 2回目実行で1回目の JSON と SHA 照合
//   KFS_SKIP_DTX2=1                                        … dt×2 アームを省く(時間が無いときのみ)
// ============================================================================================
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.KFS_OUT ? path.resolve(process.env.KFS_OUT)
  : path.join(OUT_DIR, 'kf1sens-results.json');
const SKIP_DTX2 = process.env.KFS_SKIP_DTX2 === '1';

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
// 正準化(決定性ハッシュ — tests/exp-coreshell5.mjs / exp-qexact.mjs と同一方式)
const canonize = (o) => {
  if (Array.isArray(o)) return o.map(canonize);
  if (o && typeof o === 'object') {
    const r = {};
    for (const k of Object.keys(o).sort()) r[k] = canonize(o[k]);
    return r;
  }
  return o;
};

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ==================== 事前登録(統括が実測前に固定 — 実測後に動かさない)====================
// 出典: ハンドオフ 2026-08-22b §3b(実測前固定)。PASS/FAIL とも収載する。
const PRE_REGISTERED = {
  fixedBy: '統括(ハンドオフ 2026-08-22b §3b)', fixedBefore: '実測',
  designPrinciples: {
    twoKnobsOnly: '動かすのは **dt と測定窓の2軸だけ**。物理キー・較正値(D₀=0.006・f=0.9968)・' +
      'ソフトニング・seed・体の初期条件・判定窓の数値はいずれも不変で、再フィットはゼロである。',
    windowsUnchanged: '既存の判定窓・較正値は一切変更しない。本便は窓を新設も再設定もしない。',
    noExistingFileTouched: '既存プリセット・既存結果 JSON・既存ハーネスは一切変更しない。' +
      '本便は新規ファイル(tests/exp-kf1sens.mjs → tests/out/kf1sens-results.json)だけで完結する。',
    failIsData: 'PASS/FAIL とも実測値をそのまま収載する(FAIL でも書き換えない)。',
  },
  KW1: {
    role: '窓(転記照合)',
    verbatim: 'KW1(転記照合): 基線再測(dt・窓とも正本設定)が kf1c/kf1d の対応値と**ビット一致**。',
    canonicalSettings: {
      mercury: 'dt=0.016・8 公転(出典: tests/exp-kf1c.mjs runRL の dt と mkMerc の orbits:8 / ' +
        'tests/exp-kf1d.mjs §A も同一)',
      earthMoon: 'dt=0.016・8 公転(出典: tests/exp-kf1c.mjs runRL の dt と mkEM の orbits:8)',
      saturnRing: 'dt=0.016・6 × T(a=80)(出典: tests/exp-kf1d.mjs §B の run())',
    },
    comparisonRule: 'Object.is による厳密一致(±0 の別も区別する)。対象は両者に共通して存在する' +
      '数値フィールドのみ(本便が追加した床の記録フィールドは照合対象外)。',
  },
  KW2: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'KW2(記述 — 窓なし): 3主張 × {dt/2(実行時間が許せば dt×2 も)・測定窓 ×0.5/×2' +
      '(各ハーネスの窓定義に即して適用 — 適用不能な軸は not-applicable と宣言)} の観測量を収載し、' +
      '基線との相対差を dtConvergence / windowSensitivity 成分として宣言(数値床併記)。',
    window: 'なし(記述のみ — 合否は付けない)',
    axisApplication: {
      dt: '各ハーネスの dt(正本 0.016)へ係数を掛ける。步数は steps=ceil(公転数·T/dt) の定義式' +
        'どおり自動で増減する(定義式は転記元のまま)。',
      window: '各ハーネスの窓定義そのものへ係数を掛ける — 🪨🌘 は「公転数」(正本 8)、' +
        '💿 は「内縁 a=80 の公転数」(正本 6)。窓を変えると LSQ 標本の間引き幅 ' +
        'SAMPLE=max(1,floor(steps/4000)) も定義式どおり変わる(転記元の定義をそのまま使う)。',
    },
    floorRule: '相対差の読み方を支えるため、測れる床は機械計算して併記し、測っていない床は ' +
      'not-instrumented と明示する。周期の分解能床は dt/(t_last−t_first)(公転通過時刻を補間せず' +
      '步境界で拾う定義から出る量子化幅)。近点回転(RL 角の全步 LSQ)については、1步あたりの' +
      '引きずり増分と速度 1 ulp の比を本ハーネス族は記録していない(kf1c/kf1d の health 宣言と同じ)。',
  },
  KW3: {
    role: '窓(決定性)',
    verbatim: 'KW3(決定性): 別プロセス2回実行の正規化 JSON SHA-256 一致(coreshell5 方式)。',
    canonicalization: '対象は out.systems(実測部)のみ。日時・環境・経過時間などの揮発キーは' +
      'meta / manifest 側にしか置かないので、対象内に除外すべき揮発値は存在しない',
  },
  invariants: {
    verbatim: '既存プリセット・既存結果 JSON は不変(新規ファイルのみ)。基線再測が既存 JSON の' +
      '対応値とビット一致するかも照合して収載(転記の機械証拠)。',
  },
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'kf1c', file: 'kf1c-results.json',
    role: '第122便の実測正本(🪨 q スキャン §A・🌘 較正保存 §C・統合判定 §D の窓の出典)' },
  { key: 'kf1d', file: 'kf1d-results.json',
    role: '第123便の実測正本(qLock 則 q* の算出値・🪨🌘 の q* 走行 §A・💿 環系 §B の基線)' },
];
const inputs = {};
const provenanceInputs = [];
for (const spec of INPUT_SPECS) {
  const p = path.join(OUT_DIR, spec.file);
  const bytes = fs.readFileSync(p);
  const j = JSON.parse(bytes.toString('utf8'));
  inputs[spec.key] = j;
  provenanceInputs.push({
    path: `tests/out/${spec.file}`, sha256: sha256(bytes), bytes: bytes.length,
    wave: j.wave === undefined ? null : j.wave,
    targetPath: j.manifest ? j.manifest.provenance.target.path : null,
    targetSha256: j.manifest ? j.manifest.provenance.target.sha256 : null,
    appVersion: j.manifest ? j.manifest.provenance.target.appVersion : null,
    gitCommit: j.manifest ? j.manifest.provenance.git.commit : null,
    role: spec.role, mutated: false,
  });
}
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  inputs: provenanceInputs.map((e) => ({ path: e.path, targetPath: e.targetPath,
    targetSha256: e.targetSha256, sameAsNow: e.targetSha256 === TARGET_SHA_NOW })),
  allSame: provenanceInputs.every((e) => e.targetSha256 === TARGET_SHA_NOW),
  note: '入力 JSON の実測を出した対象 HTML の SHA-256 が、本便が実測する対象と同一実体かの照合。' +
    '一致していれば「基線再測が既存 JSON とビット一致するか」が転記の正しさの証拠として機能する',
};

// ==================== qLock 則(tests/exp-kf1d.mjs の qCalc を逐語転記)====================
const qCalc = (c, R, G, M, a) => 3 + Math.log(1.25 * c * c * R / (G * M)) / Math.log((R + a) / R);

// ==================== 感度軸(実測前に固定した掃引点)====================
// 正本 = 係数 1。dt 軸は dt へ、窓軸は「公転数」へ係数を掛ける(KW2.axisApplication のとおり)。
const AXES = [
  { tag: 'baseline', axis: 'baseline', dtFactor: 1, winFactor: 1, isBaseline: true },
  { tag: 'dt/2', axis: 'dt', dtFactor: 0.5, winFactor: 1 },
  { tag: 'dt×2', axis: 'dt', dtFactor: 2, winFactor: 1, optional: true },
  { tag: '窓×0.5', axis: 'window', dtFactor: 1, winFactor: 0.5 },
  { tag: '窓×2', axis: 'window', dtFactor: 1, winFactor: 2 },
].filter((a) => !(a.optional && SKIP_DTX2));

const DT0 = 0.016;   // 正本 dt(出典: tests/exp-kf1c.mjs runRL / tests/exp-kf1d.mjs runRL・§B run())

// 相対差(基準が 0 のときは相対値を作らない — 0 除算で無限大を台帳へ載せない)
const relDiff = (a, b) => (typeof a === 'number' && typeof b === 'number' && Number.isFinite(a)
  && Number.isFinite(b) && b !== 0) ? (a - b) / Math.abs(b) : null;
const maxAbsOf = (xs) => { const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x)).map(Math.abs);
  return v.length ? Math.max(...v) : null; };

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, wave: 169,
  title: 'kf1 系3主張(🪨 水星近点・🌘 地球月2量・💿 土星環近点ドリフト)の dt 収束・測定窓感度の実測',
  preRegistered: PRE_REGISTERED, targetConsistency, provenanceInputs,
  axes: AXES, systems: {}, meta: {} };

// ---- 対象 HTML から claims の事前登録窓を機械読み取り(手書き転記をしない)------------------
// 本便は窓判定をしない(KW2 は窓なし)が、感度の大きさを窓幅と対比して読めるよう機械記録する。
const claimWindows = await page.evaluate(() => {
  const pick = (pid, cid) => {
    const p = HP.allPresets().find((q) => q.id === pid);
    if (!p || !Array.isArray(p.claims)) return null;
    const c = p.claims.find((q) => q.id === cid);
    if (!c) return null;
    return { presetId: pid, claimId: cid, metric: c.metric, expected: c.expected,
      presetQ: p.physics ? p.physics.q : null, presetD0: p.physics ? p.physics.D0 : null,
      qLock: p.qLock === true };
  };
  return {
    mercuryDrag: pick('mercuryRealKF1', 'mercuryRealKF1.drag-precession'),
    ringApsidal: pick('saturnRingRealKF1', 'saturnRingRealKF1.ring-apsidal-drift'),
  };
});
out.claimWindows = claimWindows;

// ============ 測定器①: 二体 RL 歳差(tests/exp-kf1c.mjs の runRL を逐語転記)==================
// 転記元との差分は **dt を c.dt から取る1点だけ**(c.dt を省くと 0.016 = 転記元と同一挙動)。
// 併せて、周期の分解能床を算出するための公転通過時刻の端点(t2piFirst/t2piLast/nRev)と
// LSQ 標本数(nSamples)・間引き幅(sampleStride)を返す — いずれも**測定後の記録**であって
// 積分・測定ロジックには一切関与しない(既存フィールドの値は転記元とビット一致する)。
const runRL = (cfg) => page.evaluate(async (c) => {
  const P = c.phys, M = c.M, m2 = c.m2;
  const mu = c.pin ? M : M + m2;
  const GM = P.G * mu;
  const e = c.e || 0, a = c.a, rp = a * (1 - e);
  const vp = Math.sqrt(GM * (1 + e) / rp) * (c.f || 1);
  const fm = c.pin ? 0 : m2 / (M + m2);
  const S = HP.sim;
  S.build({ id: 'kf1c', name: 'kf1c-' + c.id, emoji: '🧪', seed: 1,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
    bodies: [
      { type: 'single', m: M, radius: c.rM || undefined, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
        spin: c.spinM || 0, pinned: !!c.pin, pnSource: true },
      { type: 'single', m: m2, radius: c.r2 || undefined, x: rp * (1 - fm), y: 0, vx: 0,
        vy: vp * (1 - fm), spin: c.spin2 || 0, pinned: false },
    ] });
  const qEff = S.physics ? S.physics.q : null;   // クランプ確認(q>4 拡張の検証)
  const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const dt = c.dt, steps = Math.ceil((c.orbits || 5) * TK / dt);
  const SAMPLE = Math.max(1, Math.floor(steps / 4000));
  let pomPrev = null, pomUnw = 0;
  let sT = 0, sP = 0, sTT = 0, sTP = 0, nS = 0;
  let e0 = null, eLast = 0, rmin = Infinity, rmax = 0;
  let ang = 0, px = 0, py = 0, t2pi = [], collapsed = null;
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
    const vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
    const rr = Math.hypot(dx, dy);
    if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr;
    if (k === 0) { px = dx; py = dy; }
    else { ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
      if (Math.abs(ang) >= 2 * Math.PI * (t2pi.length + 1)) t2pi.push((k + 1) * dt); }
    if (rr > 3 * a || rr < a / 4 || S.hasNaN()) { collapsed = (k + 1) * dt / TK; break; }
    if (k % SAMPLE === 0) {
      const h = dx * vy - dy * vx;
      const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
      const ecc = Math.hypot(ex, ey), pom = Math.atan2(ey, ex);
      if (e0 === null) e0 = ecc;
      eLast = ecc;
      if (pomPrev !== null) {
        let d = pom - pomPrev;
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        pomUnw += d;
      }
      pomPrev = pom;
      const t = (k + 1) * dt;
      sT += t; sP += pomUnw; sTT += t * t; sTP += t * pomUnw; nS++;
    }
  }
  let Tavg = null; if (t2pi.length >= 2) { let acc = 0;
    for (let i = 1; i < t2pi.length; i++) acc += t2pi[i] - t2pi[i - 1]; Tavg = acc / (t2pi.length - 1); }
  const slope = (nS > 2) ? (nS * sTP - sT * sP) / (nS * sTT - sT * sT) : NaN;
  return { dPomPerOrbit: slope * TK, TK, Tavg, e0, eDrift: eLast - e0,
    amp: (rmax - rmin) / ((rmax + rmin) / 2), collapsed, nan: S.hasNaN(), qEff,
    // ---- 以下は本便が足した「床」の記録専用フィールド(測定ロジックには関与しない)----
    floorAux: { dt, steps, sampleStride: SAMPLE, nSamples: nS, nRev: t2pi.length,
      t2piFirst: t2pi.length ? t2pi[0] : null, t2piLast: t2pi.length ? t2pi[t2pi.length - 1] : null } };
}, cfg);

// ============ 測定器②: 💿 環系(tests/exp-kf1d.mjs §B の run を逐語転記)======================
// 転記元との差分は **dt と公転数係数を引数から取る2点だけ**(dt=0.016・orbits=6 で転記元と同一)。
const runRing = (kF, q, PROF, dt, orbits) => page.evaluate(async ({ kF, q, PROF, dt, orbits }) => {
  const P = Object.assign({}, PROF, { kFrame: kF, q, softening: 0.05 });
  const M = 56.834, GM = P.G * M;
  // 偏心テスト粒子: C/B/A環相当+タイタン相当(e=0.1・近点から発進)
  const radii = [80, 105, 130, 1221.9], bodies = [{ type: 'single', m: M, radius: 60.3,
    x: 0, y: 0, vx: 0, vy: 0, spin: 0.016528, pinned: true, pnSource: true }];
  for (const a of radii) { const e = 0.1, rp = a * (1 - e), vp = Math.sqrt(GM * (1 + e) / rp);
    bodies.push({ type: 'single', m: 1e-5, radius: 0.05, x: rp, y: 0, vx: 0, vy: vp, spin: 0, pinned: false }); }
  const S = HP.sim;
  S.build({ id: 'kf1dB', name: 'ring', emoji: '🧪', seed: 1, camera: { scale: 1300 },
    world: { boundary: 'none', size: 0 }, physics: P, bodies });
  const TK1 = 2 * Math.PI * Math.sqrt(Math.pow(80, 3) / GM);
  const steps = Math.ceil(orbits * TK1 / dt);
  const n = radii.length;
  const pomU = new Float64Array(n), pomP = new Float64Array(n).fill(NaN);
  for (let k = 0; k < steps; k++) { S.step(dt);
    for (let i = 0; i < n; i++) { const j = i + 1;
      const dx = S.x[j], dy = S.y[j], vx = S.vx[j], vy = S.vy[j], rr = Math.hypot(dx, dy);
      const h = dx * vy - dy * vx;
      const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
      const pom = Math.atan2(ey, ex);
      if (!Number.isNaN(pomP[i])) { let d = pom - pomP[i];
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; pomU[i] += d; }
      pomP[i] = pom; } }
  const res = [];
  for (let i = 0; i < n; i++) { const a = radii[i];
    const Ti = 2 * Math.PI * Math.sqrt(a * a * a / GM);
    res.push({ a, dPomPerOrbit: pomU[i] / (steps * dt) * Ti }); }
  return { res, nan: S.hasNaN(),
    floorAux: { dt, steps, tTotal: steps * dt, TK1 } };
}, { kF, q, PROF, dt, orbits });

// ---- 共通の後処理: 軸ごとの観測量を基線と突き合わせて相対差にする ----------------------------
// obs は { キー: 数値|null } の平坦な辞書。全系で同じ形にしておき、台帳側が汎用に読めるようにする。
function buildAxisBlocks(variants, observableKeys) {
  const base = variants.find((v) => v.isBaseline);
  const withRel = variants.map((v) => ({
    tag: v.tag, axis: v.axis, isBaseline: v.isBaseline === true,
    dt: v.dt, dtFactor: v.dtFactor, window: v.window, windowFactor: v.winFactor,
    steps: v.steps, observables: v.observables,
    relToBaseline: Object.fromEntries(observableKeys.map((k) =>
      [k, v.isBaseline ? 0 : relDiff(v.observables[k], base.observables[k])])),
    floors: v.floors,
  }));
  const mk = (axisName) => {
    const rows = withRel.filter((v) => v.axis === axisName);
    return {
      applicable: true,
      baseline: { tag: base.tag, dt: base.dt, window: base.window, observables: base.observables },
      variants: rows,
      maxAbsRelDiff: Object.fromEntries(observableKeys.map((k) =>
        [k, maxAbsOf(rows.map((r) => r.relToBaseline[k]))])),
      maxAbsRelDiffOverall: maxAbsOf(rows.flatMap((r) => observableKeys.map((k) => r.relToBaseline[k]))),
    };
  };
  return { all: withRel, dt: mk('dt'), window: mk('window') };
}

// ============================ ☄️🪨 水星 =====================================================
// 構成は tests/exp-kf1c.mjs mkMerc()(= tests/exp-kf1d.mjs §A の 🪨 構成と同一)の逐語転記。
{
  const MERC = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const ORBITS0 = 8;   // 正本の測定窓(出典: tests/exp-kf1c.mjs mkMerc の orbits:8)
  const mkMerc = (id, over, dt, orbits) => ({ id, M: 1988.5, m2: 0.00033011, a: 579.09,
    e: 0.20563, rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true,
    orbits, dt, phys: Object.assign({}, MERC, over) });
  // 窓判定アームの q: kf1d §A の算出値 q*(近日点基準)と、kf1c §D1 の窓判定アーム q=5
  const qStar = qCalc(30000, 6.95, 6.674, 1988.5, 460.012);
  const Q5 = 5;
  console.log('== ☄️🪨 水星(正本 dt=0.016・8公転・pinned 太陽・D₀=0.006 不変)==');
  const OBS = ['dragQStar', 'dragQ5', 'dPomKF0', 'dPomQStar', 'dPomQ5', 'TavgQStar', 'TavgKF0'];
  const variants = [];
  for (const ax of AXES) {
    const dt = DT0 * ax.dtFactor, orbits = ORBITS0 * ax.winFactor;
    const kF0 = await runRL(mkMerc('mK0', { kFrame: 0 }, dt, orbits));
    const rStar = await runRL(mkMerc('mQ*', { q: qStar }, dt, orbits));
    const r5 = await runRL(mkMerc('mQ5', { q: Q5 }, dt, orbits));
    const observables = {
      dragQStar: rStar.dPomPerOrbit - kF0.dPomPerOrbit,
      dragQ5: r5.dPomPerOrbit - kF0.dPomPerOrbit,
      dPomKF0: kF0.dPomPerOrbit, dPomQStar: rStar.dPomPerOrbit, dPomQ5: r5.dPomPerOrbit,
      TavgQStar: rStar.Tavg, TavgKF0: kF0.Tavg,
    };
    const spanOf = (r) => (r.floorAux.t2piLast !== null && r.floorAux.t2piFirst !== null
      && r.floorAux.nRev >= 2) ? r.floorAux.t2piLast - r.floorAux.t2piFirst : null;
    variants.push({ tag: ax.tag, axis: ax.axis, isBaseline: ax.isBaseline, dt, dtFactor: ax.dtFactor,
      window: { orbits, unit: '公転' }, winFactor: ax.winFactor, steps: rStar.floorAux.steps,
      runs: { kF0, qStar: rStar, q5: r5 }, observables,
      floors: {
        periodResolutionFloorRel: {
          status: 'instrumented',
          value: spanOf(rStar) ? dt / spanOf(rStar) : null,
          definition: 'dt/(t_last−t_first) — 公転通過時刻を補間せず步境界で拾う定義から出る量子化幅' +
            '(第162便 exp-jupseeds.mjs の分解能床と同じ定義)',
          nRev: rStar.floorAux.nRev, span: spanOf(rStar),
        },
        apsidalLsq: {
          status: 'instrumented',
          nSamples: rStar.floorAux.nSamples, sampleStrideSteps: rStar.floorAux.sampleStride,
          sampleDt: rStar.floorAux.sampleStride * dt,
          note: 'RL 角の全步 LSQ は SAMPLE=max(1,floor(steps/4000)) で間引いた標本で組む' +
            '(転記元の定義そのまま)。窓・dt を変えると標本数と間引き幅もこの定義式どおり動く',
        },
        apsidalUlpFloor: {
          status: NOT_INSTRUMENTED,
          note: '1步あたりの引きずり増分と速度 1 ulp の比(丸め床)は本ハーネス族が記録していない' +
            '(tests/exp-kf1c.mjs・exp-kf1d.mjs の manifest.health の宣言と同じ)。' +
            '記録しているのは e ドリフト・振幅・NaN フラグである',
          eDrift: rStar.eDrift, amp: rStar.amp, nan: rStar.nan, collapsed: rStar.collapsed,
        },
      },
    });
    console.log(`  [${ax.tag.padEnd(9)}] dt=${dt} 公転=${orbits} 步=${rStar.floorAux.steps}` +
      ` drag(q*)=${observables.dragQStar.toExponential(6)} drag(q=5)=${observables.dragQ5.toExponential(6)}`);
  }
  const base = variants.find((v) => v.isBaseline);
  // ---- KW1: 基線再測のビット照合(kf1c §A / kf1d §A)----
  const refC = inputs.kf1c.tests.mercuryQscan, refD = inputs.kf1d.tests.qcalc;
  const bitFields = (mine, ref, keys) => keys.map((k) => ({ field: k, mine: mine[k], reference: ref[k],
    identical: Object.is(mine[k], ref[k]), relDiff: relDiff(mine[k], ref[k]) }));
  const bitRows = [
    { pair: 'kf1c tests.mercuryQscan.kF0 vs 基線 kF0',
      rows: bitFields(base.runs.kF0, refC.kF0, ['dPomPerOrbit', 'TK', 'Tavg', 'e0', 'eDrift', 'amp']) },
    { pair: "kf1c tests.mercuryQscan.scan['5'] vs 基線 q=5",
      rows: bitFields(base.runs.q5, refC.scan['5'], ['dPomPerOrbit', 'TK', 'Tavg', 'e0', 'eDrift', 'amp']) },
    { pair: 'kf1d tests.qcalc.mercKF0 vs 基線 kF0',
      rows: bitFields(base.runs.kF0, refD.mercKF0, ['dPomPerOrbit', 'Tavg']) },
    { pair: 'kf1d tests.qcalc.mercQstar vs 基線 q=q*',
      rows: bitFields(base.runs.qStar, refD.mercQstar, ['dPomPerOrbit', 'Tavg']) },
  ];
  const derivedChecks = [
    { name: 'kf1d tests.qcalc.qMerc = 本便の q*(算出式の一致)',
      mine: qStar, reference: refD.qMerc, identical: Object.is(qStar, refD.qMerc) },
    { name: 'kf1d tests.qcalc.dragMerc = 基線 drag(q*)',
      mine: base.observables.dragQStar, reference: refD.dragMerc,
      identical: Object.is(base.observables.dragQStar, refD.dragMerc) },
    { name: 'kf1c tests.joint.dragQ5 = 基線 drag(q=5)',
      mine: base.observables.dragQ5, reference: inputs.kf1c.tests.joint.dragQ5,
      identical: Object.is(base.observables.dragQ5, inputs.kf1c.tests.joint.dragQ5) },
  ];
  out.systems.mercury = {
    emoji: '☄️🪨', label: '水星(実単位・kFrame=1)mercuryRealKF1 系',
    errorBudgetClaimId: 'mercury-perihelion',
    harness: 'tests/exp-kf1c.mjs §A の runRL/mkMerc(= tests/exp-kf1d.mjs §A の 🪨 構成)を逐語転記' +
      '(dt を引数化した1点だけが差分)',
    config: { physics: MERC, M: 1988.5, m2: 0.00033011, a: 579.09, e: 0.20563, rM: 6.95, r2: 0.0244,
      spinM: 0.029031, spin2: 0.0124, pin: true, orbitsCanonical: ORBITS0, dtCanonical: DT0, seed: 1,
      qStar, qStarSource: 'tests/exp-kf1d.mjs §A qCalc(30000, 6.95, 6.674, 1988.5, 460.012)',
      q5: Q5, q5Source: 'tests/exp-kf1c.mjs §D1 の窓判定アーム(q=5)' },
    primaryObservable: '引きずり歳差 Δϖ_drag = Δϖ(kF1,q) − Δϖ(kF0) [rad/公転]',
    primaryObservableKey: 'dragQStar',
    observableKeys: OBS,
    observableUnits: { dragQStar: 'rad/公転', dragQ5: 'rad/公転', dPomKF0: 'rad/公転',
      dPomQStar: 'rad/公転', dPomQ5: 'rad/公転', TavgQStar: '時間単位(内部)', TavgKF0: '時間単位(内部)' },
    claimWindowForScale: { source: 'プリセット claims mercuryRealKF1.drag-precession(対象 HTML から機械読み取り)',
      expected: claimWindows.mercuryDrag ? claimWindows.mercuryDrag.expected : null,
      note: '本便は窓判定をしない(KW2 は窓なし)。感度の大きさを窓幅と対比して読むための機械記録である' },
    KW1: { rule: PRE_REGISTERED.KW1.verbatim, pairs: bitRows, derivedChecks,
      allIdentical: bitRows.every((p) => p.rows.every((r) => r.identical))
        && derivedChecks.every((d) => d.identical) },
    KW2: buildAxisBlocks(variants, OBS),
  };
  console.log(`  KW1 ビット一致=${out.systems.mercury.KW1.allIdentical}` +
    ` / dt 軸 最大相対差=${out.systems.mercury.KW2.dt.maxAbsRelDiff.dragQStar}` +
    ` / 窓軸 最大相対差=${out.systems.mercury.KW2.window.maxAbsRelDiff.dragQStar}`);
}

// ============================ 🌙🌘 地球月 ===================================================
// 構成は tests/exp-kf1c.mjs mkEM()(§C/§D2 の主アーム q=5)の逐語転記。
{
  const EM = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1,
    timeScale: 1, stateCarry: 'double' };
  const ORBITS0 = 8;              // 正本の測定窓(出典: tests/exp-kf1c.mjs mkEM の orbits:8)
  const TARGET_DPOM = 0.05311;    // 出典: tests/exp-kf1c.mjs §C/§D2「🌘 の近点回転 0.05311 rad/公転」
  const SIDEREAL_OBS = 27.3217;   // 出典: tests/exp-kf1c.mjs §C(恒星月・日)
  const TU_SEC = 100;             // 🌘 は 1 t.u. = 10² s(出典: tests/exp-kf1c.mjs §C の日換算式)
  const mkEM = (id, over, dt, orbits) => ({ id, M: 0.59724, m2: 0.007346, a: 384.748,
    e: 0.0549, rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, f: 0.9968,
    orbits, dt, phys: Object.assign({}, EM, over) });
  const Q5 = 5;
  console.log('== 🌙🌘 地球月(正本 dt=0.016・8公転・自由二体・f=0.9968・D₀=0.006 不変)==');
  const OBS = ['dPomPerOrbit', 'ratioToObserved', 'Tavg', 'periodDays', 'periodRelDevFromKepler'];
  const variants = [];
  for (const ax of AXES) {
    const dt = DT0 * ax.dtFactor, orbits = ORBITS0 * ax.winFactor;
    const r = await runRL(mkEM('eQ5', { q: Q5 }, dt, orbits));
    const observables = {
      dPomPerOrbit: r.dPomPerOrbit,
      ratioToObserved: r.dPomPerOrbit / TARGET_DPOM,
      Tavg: r.Tavg,
      periodDays: r.Tavg === null ? null : r.Tavg * TU_SEC / 86400,
      periodRelDevFromKepler: relDiff(r.Tavg, r.TK),
    };
    const span = (r.floorAux.nRev >= 2) ? r.floorAux.t2piLast - r.floorAux.t2piFirst : null;
    variants.push({ tag: ax.tag, axis: ax.axis, isBaseline: ax.isBaseline, dt, dtFactor: ax.dtFactor,
      window: { orbits, unit: '公転' }, winFactor: ax.winFactor, steps: r.floorAux.steps,
      runs: { q5: r }, observables,
      floors: {
        periodResolutionFloorRel: { status: 'instrumented',
          value: span ? dt / span : null,
          definition: 'dt/(t_last−t_first) — 公転通過時刻を補間せず步境界で拾う定義から出る量子化幅',
          nRev: r.floorAux.nRev, span },
        apsidalLsq: { status: 'instrumented',
          nSamples: r.floorAux.nSamples, sampleStrideSteps: r.floorAux.sampleStride,
          sampleDt: r.floorAux.sampleStride * dt,
          note: 'RL 角の全步 LSQ は SAMPLE=max(1,floor(steps/4000)) で間引いた標本で組む(転記元の定義)' },
        apsidalUlpFloor: { status: NOT_INSTRUMENTED,
          note: '1步あたりの引きずり増分と速度 1 ulp の比(丸め床)は本ハーネス族が記録していない' +
            '(tests/exp-kf1c.mjs の manifest.health の宣言と同じ)',
          eDrift: r.eDrift, amp: r.amp, nan: r.nan, collapsed: r.collapsed },
      },
    });
    console.log(`  [${ax.tag.padEnd(9)}] dt=${dt} 公転=${orbits} 步=${r.floorAux.steps}` +
      ` Δϖ比=${observables.ratioToObserved.toFixed(8)} 周期=${observables.periodDays === null ? '—' : observables.periodDays.toFixed(6)}日`);
  }
  const base = variants.find((v) => v.isBaseline);
  const refQ5 = inputs.kf1c.tests.earthMoonCal.q5;
  const bitFields = (mine, ref, keys) => keys.map((k) => ({ field: k, mine: mine[k], reference: ref[k],
    identical: Object.is(mine[k], ref[k]), relDiff: relDiff(mine[k], ref[k]) }));
  const bitRows = [
    { pair: 'kf1c tests.earthMoonCal.q5 vs 基線 q=5',
      rows: bitFields(base.runs.q5, refQ5, ['dPomPerOrbit', 'TK', 'Tavg', 'e0', 'eDrift', 'amp']) },
  ];
  const derivedChecks = [
    { name: 'kf1c tests.joint.ratio = 基線 Δϖ比',
      mine: base.observables.ratioToObserved, reference: inputs.kf1c.tests.joint.ratio,
      identical: Object.is(base.observables.ratioToObserved, inputs.kf1c.tests.joint.ratio) },
  ];
  out.systems.earthMoon = {
    emoji: '🌙🌘', label: '地球と月(実単位・kFrame=1)earthMoonRealKF1 系',
    errorBudgetClaimId: 'earth-moon-two-observables',
    harness: 'tests/exp-kf1c.mjs §C の runRL/mkEM(§D2 の主アーム q=5)を逐語転記(dt を引数化した1点だけが差分)',
    config: { physics: EM, M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549, rM: 6.38, r2: 1.74,
      spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbitsCanonical: ORBITS0, dtCanonical: DT0,
      seed: 1, q: Q5, qSource: 'tests/exp-kf1c.mjs §C/§D2 の主アーム(q=5)' },
    primaryObservable: '2量 — ① 近点回転比 Δϖ/0.05311(目標 1.0)② 平均周期 Tavg(恒星月)',
    primaryObservableKey: 'ratioToObserved',
    observableKeys: OBS,
    observableUnits: { dPomPerOrbit: 'rad/公転', ratioToObserved: '無次元(測定/観測)',
      Tavg: '時間単位(内部)', periodDays: '日', periodRelDevFromKepler: '無次元(相対)' },
    externalReference: { dPomPerOrbit: TARGET_DPOM, siderealMonthDaysObserved: SIDEREAL_OBS,
      note: '出典は tests/exp-kf1c.mjs §C/§D2(🌘 の近点回転 0.05311 rad/公転(8.85 年)・恒星月 27.3217 日)' },
    claimWindowForScale: { source: 'tests/exp-kf1c.mjs §D2(Δϖ比 0.85〜1.15)',
      expected: { min: 0.85, max: 1.15 },
      note: '本便は窓判定をしない(KW2 は窓なし)。感度の大きさを窓幅と対比して読むための転記である' },
    KW1: { rule: PRE_REGISTERED.KW1.verbatim, pairs: bitRows, derivedChecks,
      allIdentical: bitRows.every((p) => p.rows.every((r) => r.identical))
        && derivedChecks.every((d) => d.identical) },
    KW2: buildAxisBlocks(variants, OBS),
  };
  console.log(`  KW1 ビット一致=${out.systems.earthMoon.KW1.allIdentical}` +
    ` / dt 軸 最大相対差(Δϖ比)=${out.systems.earthMoon.KW2.dt.maxAbsRelDiff.ratioToObserved}` +
    ` / 窓軸 最大相対差(Δϖ比)=${out.systems.earthMoon.KW2.window.maxAbsRelDiff.ratioToObserved}`);
}

// ============================ 💿🛰️ 土星環 ====================================================
// 構成は tests/exp-kf1d.mjs §B の run()(PROF・プローブ半径・e=0.1・6×T(a=80) 窓)の逐語転記。
{
  const PROF = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const ORBITS0 = 6;        // 正本の測定窓(出典: tests/exp-kf1d.mjs §B の 6 × T(a=80))
  const PRIMARY_A = 80;     // 窓の適用先プローブ(第164便 exp-qexact.mjs が claims 説明文から同定済み)
  const qStar = qCalc(30000, 60.3, 6.674, 56.834, 105);   // 出典: tests/exp-kf1d.mjs §B(参照=環中央値)
  console.log('== 💿🛰️ 土星環(正本 dt=0.016・6×T(a=80) 窓・pinned 土星・D₀=0.006 不変)==');
  const RADII = [80, 105, 130, 1221.9];
  const key = (a) => `drift_a${a}`;
  const OBS = RADII.map(key).concat(RADII.map((a) => `dPomQStar_a${a}`), RADII.map((a) => `dPomKF0_a${a}`));
  const variants = [];
  for (const ax of AXES) {
    const dt = DT0 * ax.dtFactor, orbits = ORBITS0 * ax.winFactor;
    const kF0 = await runRing(0, 3, PROF, dt, orbits);   // 転記元と同じく kF0 側は q=3(kFrame=0 で q は無関与)
    const rStar = await runRing(1, qStar, PROF, dt, orbits);
    const observables = {};
    RADII.forEach((a, i) => {
      observables[key(a)] = rStar.res[i].dPomPerOrbit - kF0.res[i].dPomPerOrbit;
      observables[`dPomQStar_a${a}`] = rStar.res[i].dPomPerOrbit;
      observables[`dPomKF0_a${a}`] = kF0.res[i].dPomPerOrbit;
    });
    variants.push({ tag: ax.tag, axis: ax.axis, isBaseline: ax.isBaseline, dt, dtFactor: ax.dtFactor,
      window: { orbitsOfInnerProbe: orbits, unit: '× T(a=80)' }, winFactor: ax.winFactor,
      steps: rStar.floorAux.steps, runs: { kF0, qStar: rStar }, observables,
      floors: {
        periodResolutionFloorRel: { status: NOT_APPLICABLE,
          note: '環系ハーネスは公転通過時刻を拾わない(観測量は近点移動だけで、周期は測定していない)。' +
            '周期の分解能床という概念自体が本ハーネスに存在しない' },
        apsidalIntegrationSpan: { status: 'instrumented',
          steps: rStar.floorAux.steps, tTotal: rStar.floorAux.tTotal, TK1: rStar.floorAux.TK1,
          note: '近点移動は Δϖ_unwrapped/(steps·dt)×T_i の全步平均で、標本の間引きはしていない' +
            '(転記元の定義そのまま)。窓・dt を変えると steps がこの定義式どおり動く' },
        apsidalUlpFloor: { status: NOT_INSTRUMENTED,
          note: '1步あたりの引きずり増分と速度 1 ulp の比(丸め床)は本ハーネスが記録していない' +
            '(tests/exp-kf1d.mjs の manifest.health の宣言と同じ)。記録しているのは NaN フラグである',
          nanKF0: kF0.nan, nanQStar: rStar.nan },
      },
    });
    console.log(`  [${ax.tag.padEnd(9)}] dt=${dt} 窓=${orbits}×T(a=80) 步=${rStar.floorAux.steps}` +
      ` drift(a=80)=${observables[key(PRIMARY_A)].toExponential(6)}`);
  }
  const base = variants.find((v) => v.isBaseline);
  const refRing = inputs.kf1d.tests.ring;
  const perProbeBit = (mineRes, refRes, label) => ({ pair: label,
    rows: mineRes.map((r, i) => ({ field: `a=${r.a} dPomPerOrbit`, mine: r.dPomPerOrbit,
      reference: refRes[i].dPomPerOrbit, identical: Object.is(r.dPomPerOrbit, refRes[i].dPomPerOrbit),
      relDiff: relDiff(r.dPomPerOrbit, refRes[i].dPomPerOrbit) })) });
  const bitRows = [
    perProbeBit(base.runs.kF0.res, refRing.kF0.res, 'kf1d tests.ring.kF0 vs 基線 kF0'),
    perProbeBit(base.runs.qStar.res, refRing.qStarRun.res, 'kf1d tests.ring.qStarRun vs 基線 q=q*'),
  ];
  const derivedChecks = [
    { name: 'kf1d tests.ring.qStar = 本便の q*(算出式の一致)',
      mine: qStar, reference: refRing.qStar, identical: Object.is(qStar, refRing.qStar) },
  ];
  out.systems.saturnRing = {
    emoji: '💿🛰️', label: '土星の環(実単位・kFrame=1)saturnRingRealKF1 系',
    errorBudgetClaimId: 'saturn-ring-apsidal',
    harness: 'tests/exp-kf1d.mjs §B の run()(プローブ a=80/105/130/1221.9・e=0.1・6×T(a=80))を逐語転記' +
      '(dt と公転数係数を引数化した2点だけが差分)',
    config: { physics: PROF, M: 56.834, radius: 60.3, spin: 0.016528, probeRadii: RADII,
      probeMass: 1e-5, e: 0.1, orbitsCanonical: ORBITS0, orbitsUnit: '× T(a=80)', dtCanonical: DT0,
      seed: 1, softening: 0.05, qStar,
      qStarSource: 'tests/exp-kf1d.mjs §B qCalc(30000, 60.3, 6.674, 56.834, 105)' },
    primaryObservable: `環偏心テスト粒子(a=${PRIMARY_A}・C環相当)の近点ドリフト Δϖ(kF1,q*) − Δϖ(kF0) [rad/公転]`,
    primaryObservableKey: key(PRIMARY_A),
    primaryProbeA: PRIMARY_A,
    primaryProbeEvidence: '第164便 exp-qexact.mjs systems.saturnRing.window.referentEvidence が' +
      'claims 説明文の「q=3 で 0.23 rad/公転」と一致するプローブとして a=80 を機械同定している',
    observableKeys: OBS,
    observableUnits: Object.fromEntries(OBS.map((k) => [k, 'rad/公転'])),
    claimWindowForScale: { source: 'プリセット claims saturnRingRealKF1.ring-apsidal-drift(対象 HTML から機械読み取り)',
      expected: claimWindows.ringApsidal ? claimWindows.ringApsidal.expected : null,
      note: '本便は窓判定をしない(KW2 は窓なし)。感度の大きさを窓幅と対比して読むための機械記録である' },
    KW1: { rule: PRE_REGISTERED.KW1.verbatim, pairs: bitRows, derivedChecks,
      allIdentical: bitRows.every((p) => p.rows.every((r) => r.identical))
        && derivedChecks.every((d) => d.identical) },
    KW2: buildAxisBlocks(variants, OBS),
  };
  console.log(`  KW1 ビット一致=${out.systems.saturnRing.KW1.allIdentical}` +
    ` / dt 軸 最大相対差(a=80)=${out.systems.saturnRing.KW2.dt.maxAbsRelDiff[key(PRIMARY_A)]}` +
    ` / 窓軸 最大相対差(a=80)=${out.systems.saturnRing.KW2.window.maxAbsRelDiff[key(PRIMARY_A)]}`);
}

// ============================ KW1 / KW2 総括 =================================================
out.kw1Summary = {
  rule: PRE_REGISTERED.KW1,
  targetAllSame: targetConsistency.allSame,
  perSystem: Object.fromEntries(Object.entries(out.systems).map(([k, v]) =>
    [k, { allIdentical: v.KW1.allIdentical,
      nFieldsCompared: v.KW1.pairs.reduce((a, p) => a + p.rows.length, 0) + v.KW1.derivedChecks.length }])),
  allIdentical: Object.values(out.systems).every((v) => v.KW1.allIdentical === true),
  result: Object.values(out.systems).every((v) => v.KW1.allIdentical === true) ? 'PASS' : 'FAIL',
};
out.kw2Summary = {
  rule: PRE_REGISTERED.KW2,
  note: '窓なしの記述である(合否は付けない)。台帳(tools/gen-error-budget.mjs)の dtConvergence / ' +
    'windowSensitivity 成分は、ここの systems.*.KW2.dt / systems.*.KW2.window を機械読取する',
  perSystem: Object.fromEntries(Object.entries(out.systems).map(([k, v]) => [k, {
    primaryObservableKey: v.primaryObservableKey,
    dtAxisMaxAbsRelDiffPrimary: v.KW2.dt.maxAbsRelDiff[v.primaryObservableKey],
    windowAxisMaxAbsRelDiffPrimary: v.KW2.window.maxAbsRelDiff[v.primaryObservableKey],
    dtAxisMaxAbsRelDiffOverall: v.KW2.dt.maxAbsRelDiffOverall,
    windowAxisMaxAbsRelDiffOverall: v.KW2.window.maxAbsRelDiffOverall,
    dtVariantTags: v.KW2.dt.variants.map((r) => r.tag),
    windowVariantTags: v.KW2.window.variants.map((r) => r.tag),
  }])),
  axesApplied: AXES.map((a) => a.tag),
  axesSkipped: SKIP_DTX2 ? ['dt×2(KFS_SKIP_DTX2=1 で省略)'] : [],
  notApplicableAxes: [
    { system: 'saturnRing', axis: 'period(周期の観測量そのもの)', status: NOT_APPLICABLE,
      note: '環系ハーネスは周期を測定していないため、周期に対する dt/窓感度という概念が無い' },
  ],
};

// ============================ KW3: 決定性(2回実行 SHA 一致)==================================
{
  const target = { systems: out.systems };
  const mine = JSON.stringify(canonize(target));
  const rec = { rule: PRE_REGISTERED.KW3,
    canonicalization: 'out.systems(実測部)のみを対象に、キーを再帰整列した JSON の SHA-256。' +
      '日時・経過時間・環境などの揮発キーは meta / manifest 側にしか置いていないので、' +
      '対象内に除外すべき揮発値は存在しない',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.KFS_DET_REF;
  if (refPath && fs.existsSync(refPath)) {
    try {
      const other = JSON.parse(fs.readFileSync(refPath, 'utf8'));
      const otherJ = JSON.stringify(canonize({ systems: other.systems || {} }));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
      rec.identical = (mine === otherJ);
      rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一 seed・同一窓)';
    } catch (e) { rec.error = String(e && e.message || e); }
  } else if (refPath) {
    rec.reference = path.basename(refPath); rec.note = '参照 JSON を読めなかった';
  }
  out.determinism = rec;
  out.kw3 = { rule: PRE_REGISTERED.KW3, sha256: rec.sha256, reference: rec.reference,
    identical: rec.identical,
    result: rec.identical === null ? 'PENDING(参照なし)' : (rec.identical ? 'PASS' : 'FAIL') };
}

out.meta.stage = 'complete';
out.meta.elapsedSec = (Date.now() - T_START) / 1000;
out.meta.generatedAt = new Date().toISOString();

// ---- 第145便: 実験マニフェスト -------------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'kf1sens', wave: 169,
    title: 'kf1 系3主張の dt 収束・測定窓感度の実測(error budget の dtConvergence / windowSensitivity 成分の供給)',
    command: 'node tests/exp-kf1sens.mjs(KFS_OUT / KFS_DET_REF で決定性の2回実行)' },
  presets: { mode: 'mixed', ids: ['mercuryRealKF1', 'saturnRingRealKF1', 'earthMoonRealKF1'],
    declaredIn: '🪨🌘 = exp-kf1c mkMerc/mkEM の逐語転記 / 💿 = exp-kf1d §B の逐語転記',
    declaration: '走行構成はすべて動的構成(内蔵プリセットを読まず、既存ハーネスの宣言値を逐語転記して build する)。' +
      '内蔵プリセットは**claims 窓の機械読み取り**(感度の大きさを対比して読むための記録)にだけ使い、走行には使わない',
    modifiedAtRuntime: 'なし(プリセットは読み取り専用)',
    configs: {
      mercury: out.systems.mercury.config, earthMoon: out.systems.earthMoon.config,
      saturnRing: out.systems.saturnRing.config, axes: AXES, dtCanonical: DT0 },
    note: 'Kt=134851663.17051244 は c₀²/G(physLock 条件)の値である。dt と公転数以外のキーは' +
      '既存ハーネスと 1 つも違わない(その2つも正本値のとき転記元と同一挙動になる)' },
  numerics: {
    seed: 1,
    dt: { canonical: DT0, sweptFactors: AXES.map((a) => a.dtFactor),
      note: '正本 dt=0.016 に係数を掛けて掃引する(掃引点は実測前に固定した AXES)' },
    timeScale: 1, substeps: NOT_APPLICABLE,
    steps: { mercuryEarthMoon: 'ceil(公転数·T_K/dt)(転記元の定義式そのまま)',
      ring: 'ceil(公転数·T(a=80)/dt)(同上)' },
    window: { mercury: '正本 8 公転 × {0.5, 1, 2}', earthMoon: '正本 8 公転 × {0.5, 1, 2}',
      ring: '正本 6 × T(a=80) × {0.5, 1, 2}',
      note: '窓係数の掃引点は実測前に固定した AXES(preRegistered.KW2.axisApplication)' },
    warmup: NOT_APPLICABLE,
    lsqSampling: '🪨🌘 は ≤4000 標本(SAMPLE=max(1,floor(steps/4000))— 転記元と同一定義)。' +
      '💿 は間引きなしの全步平均(同上)。標本数・間引き幅は systems.*.KW2.all[].floors に収載',
    precision: 'stateCarry:"double"(全系 — 転記元と同一)',
  },
  classification: {
    input: ['🪨🌘💿 の実単位の質量・半径・自転・軌道要素(観測由来の外部入力 — 転記元と同一)',
      'D₀=0.006(既存の共有較正値をそのまま使用 — 本便での再フィットはゼロ)',
      '初速較正係数 f=0.9968(🌘 の既存値をそのまま使用)',
      'seed=1・体の初期条件(いずれも転記元と同一)',
      '正本 dt=0.016 と各系の正本測定窓(8 公転 / 6×T(a=80))',
      '感度軸の掃引係数 dt×{0.5,1,2}・窓×{0.5,1,2}(実測前に固定)'],
    fit: [],
    derived: ['q* = 3 + ln(1.25·c₀²R/(GM))/ln((R+a)/R)(既知量だけから計算 — 🪨💿)',
      '引きずり歳差 Δϖ(kF1)−Δϖ(kF0)(🪨💿)', '近点回転比 Δϖ/0.05311(🌘)',
      '平均周期 Tavg とその日換算(🌘)',
      '基線との相対差(dt 軸・窓軸 — KW2)',
      '周期の分解能床 dt/(t_last−t_first)(🪨🌘)'],
    holdOut: [],
    note: '**本便は較正を一切行わない**(fit=[])。動かすノブは dt と測定窓の2つだけで、' +
      'どちらも物理ではなく測定器側の設定である。判定窓の新設・再設定も行っていない',
  },
  judgement: {
    pointers: ['preRegistered.KW1', 'preRegistered.KW2', 'preRegistered.KW3',
      'kw1Summary', 'kw2Summary', 'kw3', 'determinism',
      'systems.mercury.KW1', 'systems.earthMoon.KW1', 'systems.saturnRing.KW1',
      'systems.mercury.KW2', 'systems.earthMoon.KW2', 'systems.saturnRing.KW2',
      'claimWindows', 'targetConsistency'],
    note: '窓は実測前に固定してあり実測後に動かしていない(preRegistered)。KW1 は転記照合の窓' +
      '(基線再測が kf1c/kf1d とビット一致するか)、KW2 は**窓なしの記述**、KW3 は決定性の窓である。' +
      '既存の判定窓・較正値には一切触れていない(claimWindowForScale は対比のための機械記録であって' +
      '判定には使っていない)',
    externalReferences: ['🪨 水星の 1PN 解析値 5.02e-7 rad/公転(kf1c §D1 の窓の分母)',
      '🌘 の近点回転 0.05311 rad/公転(8.85 年)・恒星月 27.3217 日',
      'プリセット claims の事前登録窓(🪨 drag-precession・💿 ring-apsidal-drift — 対象 HTML から機械読み取り)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネス族は保存量残差を記録していない(記録しているのは e ドリフト・振幅・NaN フラグ・' +
        '崩壊フラグという軌道要素側の健全性である — 転記元 kf1c/kf1d の宣言と同じ)' },
    numericalFloor: { status: 'instrumented',
      note: '周期の分解能床 dt/(t_last−t_first) は機械算出して systems.*.KW2.all[].floors に収載。' +
        '近点回転側の 1 ulp 丸め床は未計装(同ブロック内で not-instrumented と明示)' },
  },
  regenerationNote: 'meta(日時・経過時間)は非測定メタなので照合対象外。決定性の照合対象は out.systems のみ',
  excludeKeys: ['meta'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(`\nKW1 転記照合: ${out.kw1Summary.result}(${JSON.stringify(out.kw1Summary.perSystem)})`);
console.log(`KW2 記述: ${JSON.stringify(Object.fromEntries(Object.entries(out.kw2Summary.perSystem).map(([k, v]) =>
  [k, { dt: v.dtAxisMaxAbsRelDiffPrimary, win: v.windowAxisMaxAbsRelDiffPrimary }])))}`);
console.log(`KW3 決定性: ${out.kw3.result}(SHA ${out.kw3.sha256.slice(0, 16)}…)`);
console.log(`所要 ${out.meta.elapsedSec.toFixed(1)} 秒 / saved: ${path.relative(ROOT, OUT_PATH)}`);
await browser.close();

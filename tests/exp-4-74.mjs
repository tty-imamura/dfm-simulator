// 第39便 39A フェーズ1(台帳4-74): 新サンプル「収縮とスピン加速」(id: spinup)の内蔵化前実測。
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-74.json に計測値を保存する。
// - **対象実装ファイル(beta/index.html)は一切変更しない**(39C が並行編集中)。プリセットの
//   追加もしない — 内蔵化する予定のプリセット JSON をスクリプト内に持ち、
//   HP.validatePreset() → HP.sim.build() のカスタム注入経路(tests/qa.mjs:1146-1148 / 596 / 634 と
//   同じ HP API)で走らせる。起動直後に一度だけ HP.loadPreset('pressure', false) を通す
//   (正規経路で currentPreset を同期。🎈pressure は thermal:"tint" の内蔵サンプル)。
// - 対象HTMLは起動時に一時ディレクトリへスナップショットしてから開く(SHA-256 を記録)。
//
// 既定構成 = 第38便 38C の E2 相当(§4.1 + kRep=0)。統括採択:
//   disk n=240・radius150・m=1(均一)・rMul3・tInt2・vMode:"rigid"・vScale=ω0=0.00675・direction1
//   physics: G4・D0 2・kFrame0・q2・**kRep0**・muF0.5・gammaN0.4・kappaS0.05・Kt60・cLight60・
//            **etaRad3e-3**・pRad2・cHeat0.2・softening3・radiusScale1
//   thermal:"tint"・箱なし・ピンなし・一様重力なし = 外部駆動ゼロの完全閉鎖系
//   seed 20260728(38C の E2 と同じ参照 seed)
//
// 測定:
//   S1 既定構成の 24000步(500步ごとに計測): R_core 収縮率・ω_core 倍率・予測(R₀/R)² とのずれ・
//      帳簿[0,0,0]・|ΔL|/L_scale・NaN・底に達する步数・全体 ω_eff(防御線の数値)
//   S2 おすすめA/B候補の対照: kRep 0→1 / etaRad 3e-3→0(いずれも既定からの1変更)
//      + 参考として 38C の E1(kRep1・etaRad0)
//   S3 seed 頑健性(既定構成を 3 seed) — QA 閾値の余裕を決める根拠
//   S4 内蔵化同等性: localStorage 経由でカスタムプリセットとして登録 → HP.loadPreset() で読む
//      (= 内蔵プリセットと同じ読込経路)と、validatePreset→build の注入経路が
//      **ビット同一の初期状態**を作ることの確認
//   S5 展示調整(camera.scale の候補比較スクリーンショット。物理には触れない)
//
// 実行: node tests/exp-4-74.mjs(playwright 必須。既定 4 並列・約4分)
//   QA_TARGET=beta/index.html node tests/exp-4-74.mjs  … 既定(thermal:"tint" が要るので beta 専用)
//   EXP474_NW=2 node tests/exp-4-74.mjs                … 並列ワーカー数(既定4)
//   EXP474_SHOTS=0 node tests/exp-4-74.mjs             … S5 のスクリーンショットを省略
//
// 転記元(いずれも変更していない):
//   測定量の定義(COM系・R_core・ω_eff)... tests/exp-4-68c.mjs:110-149(38C 実験2)
//   保存則の尺度 pS/lS と相対ずれ ......... tests/qa.mjs:1211-1220 + 1170-1173
//     = beta/index.html:5866-5867(HP.verify.v1)と同形
//   U_rep ................................. beta/index.html の HP.urepEnergy(公開フック)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const TARGET_ABS = TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const SHOT_DIR = process.env.EXP474_SHOTDIR
  || path.join(os.tmpdir(), 'claude-0', '-home-user-dfm-simulator', 'shots-4-74');

const TARGET_SRC = fs.readFileSync(TARGET_ABS);
const TARGET_SHA = crypto.createHash('sha256').update(TARGET_SRC).digest('hex');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'exp474-'));
const SNAP = path.join(TMP_DIR, 'target.html');
fs.writeFileSync(SNAP, TARGET_SRC);
const INDEX = 'file://' + SNAP;

const DT = 0.016;
const STEPS = 24000;
const CK_EVERY = 500;
const REF_SEED = 20260728;
const SEEDS = [REF_SEED, 20260729, 20260730];
const NW = Math.max(1, Number(process.env.EXP474_NW || 4));
const DO_SHOTS = process.env.EXP474_SHOTS !== '0';
const SHOT_SCALES = [150, 200, 300];
const SHOT_STEPS = [0, 2000, 6000, 24000];

// ---- 内蔵化する予定のプリセット JSON(フェーズ2で BUILTIN_PRESETS へ入れる形)----
// description は フェーズ2 で実測値入りに書く。ここでは実験用の最小文言を置く。
const PRESET = {
  id: 'spinup', name: '収縮とスピン加速', emoji: '🌪️', group: '天体の物語',
  description: '(フェーズ1実験用のプレースホルダ — 内蔵時に実測値入りの説明へ差し替える)',
  en: { name: 'Contraction and Spin-Up', description: '(placeholder for the phase-1 experiment)' },
  activeParams: ['kRep', 'etaRad', 'G'],
  thermal: 'tint',
  camera: { scale: 200 }, world: { boundary: 'none', size: 0 }, seed: REF_SEED,
  physics: { G: 4, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0.5, gammaN: 0.4, kappaS: 0.05, Kt: 60,
    cLight: 60, bM: 1, etaRad: 0.003, pRad: 2, cHeat: 0.2, gravityX: 0, gravityY: 0,
    geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 2 },
  bodies: [
    { type: 'disk', rMul: 3, n: 240, cx: 0, cy: 0, radius: 150, mMin: 1, mMax: 1,
      spinMin: 0, spinMax: 0, tInt: 2, vMode: 'rigid', aroundMass: 0, vScale: 0.00675, direction: 1 },
  ],
  overlays: { rotationCurve: false, tempHistogram: false, field: false, monitor: true },
};

const SERIES = [
  { id: 'default', role: '既定(= 38C E2 相当: kRep0・etaRad3e-3)', over: {}, seeds: [REF_SEED] },
  { id: 'ab-kRep1', role: 'A/B候補1: kRep 0→1(圧力が収縮を支える)', over: { kRep: 1 }, seeds: [REF_SEED] },
  { id: 'ab-etaRad0', role: 'A/B候補2: etaRad 3e-3→0(冷却を切る・kRep0のまま)', over: { etaRad: 0 }, seeds: [REF_SEED] },
  { id: 'ref-E1', role: '参考: 38C E1(kRep1・etaRad0)', over: { kRep: 1, etaRad: 0 }, seeds: [REF_SEED] },
  { id: 'seed', role: 'seed 頑健性(既定構成)', over: {}, seeds: SEEDS.slice(1) },
];

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

function pageSetup() {
  HP.loadPreset('pressure', false);   // 正規経路で1回読む(currentPreset 同期)

  const mkPreset = (P, over, seed) => {
    const p = JSON.parse(JSON.stringify(P));
    if (over) Object.assign(p.physics, over);
    if (seed !== undefined) p.seed = seed;
    return p;
  };

  // 保存則の尺度: tests/qa.mjs:1211-1220(freebox scales)を転記
  const scales = (s) => {
    let pS = 0, lS = 0;
    for (let i = 0; i < s.n; i++) {
      pS += s.m[i] * Math.hypot(s.vx[i], s.vy[i]);
      lS += Math.abs(s.m[i] * s.x[i] * s.vy[i]) + Math.abs(s.m[i] * s.y[i] * s.vx[i])
          + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]);
    }
    return { pS, lS };
  };

  // 収縮・スピンの指標はすべて重心系(COM)。tests/exp-4-68c.mjs:114-149 を転記
  const measure = (s) => {
    let M = 0, cx = 0, cy = 0, pvx = 0, pvy = 0;
    for (let i = 0; i < s.n; i++) { M += s.m[i]; cx += s.m[i] * s.x[i]; cy += s.m[i] * s.y[i];
      pvx += s.m[i] * s.vx[i]; pvy += s.m[i] * s.vy[i]; }
    cx /= M; cy /= M; pvx /= M; pvy /= M;
    let I = 0, Lorb = 0, Lspin = 0, KE = 0, Tsum = 0, Tmax = 0;
    const rs = [];
    for (let i = 0; i < s.n; i++) {
      const dx = s.x[i] - cx, dy = s.y[i] - cy, ux = s.vx[i] - pvx, uy = s.vy[i] - pvy;
      const d2 = dx * dx + dy * dy;
      I += s.m[i] * d2;
      Lorb += s.m[i] * (dx * uy - dy * ux);
      Lspin += 0.5 * s.m[i] * s.R[i] * s.R[i] * s.spin[i];
      KE += 0.5 * s.m[i] * (ux * ux + uy * uy);
      const T = s.Tint ? s.Tint[i] : 0;
      Tsum += T; if (T > Tmax) Tmax = T;
      rs.push({ r: Math.sqrt(d2), m: s.m[i], i });
    }
    rs.sort((a, b) => a.r - b.r);
    let acc = 0, Rhalf = rs[rs.length - 1].r;
    for (const q of rs) { acc += q.m; if (acc >= M / 2) { Rhalf = q.r; break; } }
    let Ic = 0, Lc = 0, Mc = 0, nc = 0;
    for (const q of rs) {
      if (q.r > Rhalf) break;
      const i = q.i, dx = s.x[i] - cx, dy = s.y[i] - cy, ux = s.vx[i] - pvx, uy = s.vy[i] - pvy;
      Ic += s.m[i] * (dx * dx + dy * dy); Lc += s.m[i] * (dx * uy - dy * ux); Mc += s.m[i]; nc++;
    }
    let keep400 = 0, keep3h = 0, keepR0 = 0;
    for (const q of rs) { if (q.r < 400) keep400++; if (q.r < 3 * Rhalf) keep3h++; if (q.r < 150) keepR0++; }
    return { M, com: [cx, cy], comV: [pvx, pvy],
      Rrms: Math.sqrt(I / M), Rhalf, r90: rs[Math.floor(rs.length * 0.9)].r, rMax: rs[rs.length - 1].r,
      I, Lorb, Lspin, omEff: Lorb / I,
      Ic, Lc, Mc, nc, Rc: Math.sqrt(Ic / Mc), omC: Lc / Ic,
      KE, Tmean: Tsum / s.n, Tmax, Urep: HP.urepEnergy(s), radE: s.radE,
      keep400, keep3h, keepR0, n: s.n };
  };

  const runOne = (o, cfg) => {
    const v = HP.validatePreset(mkPreset(o.P, o.over, o.seed));
    if (!v.ok) throw new Error('validatePreset NG: ' + v.errors.join(' / '));
    HP.sim.build(v.preset);
    const s = HP.sim;
    if (s.thermal !== 'tint') throw new Error('thermal:"tint" が有効になっていない(対象が未対応)');
    const t0 = s.totals(), sc0 = scales(s);
    const cks = [];
    const snap = (step) => {
      const m = measure(s), t1 = s.totals(), sc1 = scales(s);
      cks.push({ step, tSim: +(step * 0.016).toFixed(3), ...m,
        Lz: t1.L, P: [t1.px, t1.py],
        ledger: [s.resPx, s.resPy, s.resL, s.radE, s.radL],
        relP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / sc1.pS,
        relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / sc1.lS,
        dLrel0: Math.abs(t1.L + s.resL + s.radL - t0.L) / Math.max(Math.abs(t0.L), 1e-9),
        idOm: Math.abs(m.omEff * m.I - m.Lorb) / Math.max(Math.abs(m.Lorb), 1e-9),
        nan: s.hasNaN() });
    };
    snap(0);
    let nanAt = null;
    for (let blk = 0; blk < cfg.STEPS / cfg.CK_EVERY; blk++) {
      for (let k = 0; k < cfg.CK_EVERY; k++) s.step(0.016);
      snap((blk + 1) * cfg.CK_EVERY);
      if (s.hasNaN()) { nanAt = (blk + 1) * cfg.CK_EVERY; break; }
    }
    return { warnings: v.warnings, n: s.n, nanAt,
      init: { Lz: t0.L, P: [t0.px, t0.py], pScale: sc0.pS, lScale: sc0.lS }, cks };
  };

  // ---- S4: 内蔵化同等性(localStorage 経由の loadPreset = 内蔵プリセットと同じ読込経路)----
  const equivCheck = (P) => {
    const snapshot = () => { const s = HP.sim;
      return { n: s.n, x: Array.from(s.x), y: Array.from(s.y), vx: Array.from(s.vx),
        vy: Array.from(s.vy), spin: Array.from(s.spin), m: Array.from(s.m), R: Array.from(s.R),
        T: s.Tint ? Array.from(s.Tint) : [], params: Object.assign({}, s.params), thermal: s.thermal }; };
    const v = HP.validatePreset(JSON.parse(JSON.stringify(P)));
    HP.sim.build(v.preset);
    const a = snapshot();
    const old = localStorage.getItem('hp_custom_presets');
    localStorage.setItem('hp_custom_presets', JSON.stringify([P]));
    const found = HP.allPresets().some(q => q.id === P.id);
    HP.loadPreset(P.id, false);          // 内蔵プリセットと同じ読込経路
    const b = snapshot();
    if (old === null) localStorage.removeItem('hp_custom_presets');
    else localStorage.setItem('hp_custom_presets', old);
    let maxd = 0, keys = ['x', 'y', 'vx', 'vy', 'spin', 'm', 'R', 'T'];
    if (a.n !== b.n) return { ok: false, reason: `n が違う ${a.n} vs ${b.n}`, found };
    for (const k of keys) for (let i = 0; i < a[k].length; i++)
      maxd = Math.max(maxd, Math.abs(a[k][i] - b[k][i]));
    const pd = [];
    for (const k of Object.keys(a.params))
      if (a.params[k] !== b.params[k]) pd.push(`${k}: ${a.params[k]} vs ${b.params[k]}`);
    return { ok: maxd === 0 && pd.length === 0, maxd, paramDiff: pd, found,
      thermal: [a.thermal, b.thermal], validateOk: v.ok, warnings: v.warnings, errors: v.errors };
  };

  // ---- S5: 展示プレビュー(localStorage 経由で読み、指定步数だけ進めて描画のみ)----
  const preview = (P, scale, steps) => {
    const p = JSON.parse(JSON.stringify(P));
    p.camera = { scale };
    localStorage.setItem('hp_custom_presets', JSON.stringify([p]));
    HP.loadPreset(p.id, false);
    const s = HP.sim;
    for (let k = 0; k < steps; k++) s.step(0.016);
    HP.tick(0);   // 步進なしで再描画(HP.tick は timeScale を使うので步数制御は step() 側で行う)
    const m = measure(s);
    return { Rc: m.Rc, Rhalf: m.Rhalf, r90: m.r90, rMax: m.rMax, keepR0: m.keepR0 };
  };

  window.__E474 = { mkPreset, runOne, measure, scales, equivCheck, preview };
}

async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  await page.evaluate(pageSetup);
  return page;
}

async function checkApplicable(page) {
  return page.evaluate(() => {
    if (!(window.HP && HP.validatePreset && HP.sim)) return { ok: false, reason: 'HP API なし' };
    if (typeof HP.urepEnergy !== 'function') return { ok: false, reason: '対象に HP.urepEnergy なし' };
    if (HP.allPresets().some(p => p.id === 'spinup'))
      return { ok: false, reason: '対象に既に spinup がある(内蔵済み — フェーズ1は内蔵前が前提)' };
    const v = HP.validatePreset({ name: 't', description: 't', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, thermal: 'tint', physics: {},
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false, tInt: 1 }] });
    if (!v.ok || v.preset.thermal !== 'tint') return { ok: false, reason: '対象が thermal:"tint" 未対応' };
    return { ok: true, reason: '', ids: HP.allPresets().map(p => p.id),
      emojis: HP.allPresets().map(p => p.emoji) };
  });
}

async function runJobs(jobs, worker) {
  const queue = jobs.slice();
  const results = new Array(jobs.length);
  await Promise.all(Array.from({ length: Math.min(NW, jobs.length) }, async () => {
    const browser = await launch();
    const page = await newPage(browser);
    while (queue.length) {
      const job = queue.shift();
      const i = jobs.indexOf(job);
      const t1 = Date.now();
      try { results[i] = await worker(page, job); }
      catch (e) { results[i] = { error: String((e && e.message) || e) }; }
      results[i].elapsedSec = +((Date.now() - t1) / 1000).toFixed(1);
      results[i].job = job;
    }
    await browser.close();
  }));
  return results;
}

const fmt = (v, d = 2) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : v.toFixed(d);

// ================================ 実行 ================================
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`第39便 39A フェーズ1(台帳4-74)対象: ${TARGET}  sha256=${TARGET_SHA.slice(0, 12)}  commit=${commit.slice(0, 7)}  並列=${NW}`);

let APPLIC, EQUIV;
{
  const b = await launch(); const pg = await newPage(b);
  APPLIC = await checkApplicable(pg);
  if (!APPLIC.ok) { await b.close(); console.error(`中止: ${APPLIC.reason}`); process.exit(1); }
  const idHit = APPLIC.ids.includes('spinup');
  const emHit = APPLIC.emojis.filter(e => e === PRESET.emoji);
  console.log(`  前提OK: thermal:"tint" + HP.urepEnergy が使える対象。`
    + `id "spinup" の衝突=${idHit} / emoji ${PRESET.emoji} の衝突=${emHit.length}件`);
  // ---- S4: 内蔵化同等性 ----
  EQUIV = await pg.evaluate((P) => window.__E474.equivCheck(P), PRESET);
  console.log(`S4: 内蔵化同等性(validatePreset→build vs localStorage+loadPreset): `
    + `一致=${EQUIV.ok} maxΔ=${EQUIV.maxd} params差=${EQUIV.paramDiff.length ? EQUIV.paramDiff.join(', ') : 'なし'} `
    + `validate ok=${EQUIV.validateOk} 警告=${(EQUIV.warnings || []).length}件 thermal=${(EQUIV.thermal || []).join('/')}`);
  await b.close();
}

// ---- S1〜S3: 本走行 ----
const JOBS = [];
for (const s of SERIES) for (const seed of s.seeds)
  JOBS.push({ tag: `${s.id}/s${seed}`, series: s.id, role: s.role, seed, over: s.over });
console.log(`S1-S3: 本走行 ${JOBS.length}本(${STEPS}步・${CK_EVERY}步ごとに計測)...`);
const runs = await runJobs(JOBS, (page, job) => page.evaluate(
  ({ o, cfg }) => window.__E474.runOne(o, cfg),
  { o: { P: PRESET, over: job.over, seed: job.seed }, cfg: { STEPS, CK_EVERY } }));

for (const r of runs) {
  if (r.error) { console.log(`  ${r.job.tag}: エラー=${r.error}`); continue; }
  const c0 = r.cks[0], cL = r.cks[r.cks.length - 1];
  console.log(`  ${r.job.tag}: R_half ${fmt(c0.Rhalf, 1)}→${fmt(cL.Rhalf, 1)}  R_core ${fmt(c0.Rc, 2)}→${fmt(cL.Rc, 2)}`
    + `(収縮 ×${fmt(c0.Rc / cL.Rc, 3)})  ω_core ${c0.omC.toExponential(3)}→${cL.omC.toExponential(3)}`
    + `(×${fmt(cL.omC / c0.omC, 3)})  予測(R₀/R)²=×${fmt((c0.Rc / cL.Rc) ** 2, 3)}`
    + `  一致=${fmt(100 * (cL.omC / c0.omC) / ((c0.Rc / cL.Rc) ** 2), 1)}%  T ${fmt(c0.Tmean, 2)}→${fmt(cL.Tmean, 2)}`
    + `  ω_eff全体 ×${fmt(cL.omEff / c0.omEff, 3)}  |ΔL|/L_scale=${cL.relL.toExponential(2)}`
    + `  帳簿=[${cL.ledger.slice(0, 3).join(',')}] radL=${cL.ledger[4]}  NaN=${r.nanAt === null ? 'なし' : 't=' + r.nanAt} [${r.elapsedSec}s]`);
}

// ---- 「底」に達する步数(R_core の最小点と、その後の平坦さ)----
const bottoms = runs.filter(r => !r.error).map(r => {
  let bi = 0;
  for (let i = 1; i < r.cks.length; i++) if (r.cks[i].Rc < r.cks[bi].Rc) bi = i;
  const after = r.cks.filter(c => c.step >= 6000);
  const rcs = after.map(c => c.Rc);
  // 6000步以降の R_core の変動幅(平坦さの機械的な尺度)
  return { tag: r.job.tag, minStep: r.cks[bi].step, minRc: r.cks[bi].Rc,
    rc6000: (r.cks.find(c => c.step === 6000) || {}).Rc,
    rc24000: r.cks[r.cks.length - 1].Rc,
    flatMin: rcs.length ? Math.min(...rcs) : null, flatMax: rcs.length ? Math.max(...rcs) : null,
    // 初期値の 1.05 倍以内に初めて入る步数(収縮が実質終わる時刻)
    settleStep: (() => { const target = r.cks[bi].Rc * 1.05;
      for (const c of r.cks) if (c.Rc <= target) return c.step; return null; })() };
});
console.log('');
console.log('==== 収縮の「底」====');
for (const b of bottoms) console.log(`  ${b.tag}: 最小 R_core=${fmt(b.minRc, 2)}(t=${b.minStep}步) `
  + `底の1.05倍以内に入る步数=${b.settleStep}  R_core(6000)=${fmt(b.rc6000, 2)} R_core(24000)=${fmt(b.rc24000, 2)} `
  + `6000步以降の変動 ${fmt(b.flatMin, 2)}〜${fmt(b.flatMax, 2)}`);

// ---- スピン加速の数表 ----
const spinupTable = runs.filter(r => !r.error).map(r => ({
  tag: r.job.tag, series: r.job.series, seed: r.job.seed,
  rows: r.cks.filter(c => c.step % 2000 === 0).map(c => {
    const c0 = r.cks[0];
    const predC = (c0.Rc / c.Rc) ** 2, obsC = c.omC / c0.omC;
    const predA = (c0.Rrms / c.Rrms) ** 2, obsA = c.omEff / c0.omEff;
    return { step: c.step, Rc: +c.Rc.toFixed(3), Rhalf: +c.Rhalf.toFixed(3), Rrms: +c.Rrms.toFixed(3),
      omC: c.omC, omEff: c.omEff,
      predCore: +predC.toFixed(4), obsCore: +obsC.toFixed(4), devCore: +(obsC / predC - 1).toFixed(4),
      predAll: +predA.toFixed(4), obsAll: +obsA.toFixed(4), devAll: +(obsA / predA - 1).toFixed(4),
      LorbRatio: +(c.Lorb / c0.Lorb).toFixed(6), LcRatio: +(c.Lc / c0.Lc).toFixed(6), idOm: c.idOm };
  }),
}));

const consSummary = runs.filter(r => !r.error).map(r => {
  const cL = r.cks[r.cks.length - 1];
  return { tag: r.job.tag,
    ledgerAllZero: cL.ledger[0] === 0 && cL.ledger[1] === 0 && cL.ledger[2] === 0 && cL.ledger[4] === 0,
    ledger: cL.ledger, Lz0: r.init.Lz, LzEnd: cL.Lz,
    relP: cL.relP, relL: cL.relL, dLrel0: cL.dLrel0, idOmMax: Math.max(...r.cks.map(c => c.idOm)),
    nan: r.nanAt !== null };
});
console.log('');
console.log('==== 保存則(L_z+帳簿)====');
for (const c of consSummary) console.log(`  ${c.tag}: 帳簿P/L=[${c.ledger.slice(0, 3).join(',')}] 放射L=${c.ledger[4]} `
  + `(全0=${c.ledgerAllZero}) L_z ${c.Lz0.toFixed(4)}→${c.LzEnd.toFixed(4)} `
  + `|ΔP|/pScale=${c.relP.toExponential(2)} |ΔL|/L_scale=${c.relL.toExponential(2)} `
  + `|ΔL|/|L₀|=${c.dLrel0.toExponential(2)} |ω·I−L_orb|/|L_orb|max=${c.idOmMax.toExponential(2)} NaN=${c.nan}`);

// ---- S5: 展示プレビュー(camera.scale 候補)----
let shots = [];
if (DO_SHOTS) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const browser = await launch();
  const page = await newPage(browser);
  for (const scale of SHOT_SCALES) for (const st of SHOT_STEPS) {
    const info = await page.evaluate(({ P, scale, steps }) => window.__E474.preview(P, scale, steps),
      { P: PRESET, scale, steps: st });
    const file = path.join(SHOT_DIR, `spinup-scale${scale}-t${st}.png`);
    await page.screenshot({ path: file });
    shots.push({ scale, step: st, file, ...info });
  }
  await browser.close();
  console.log('');
  console.log(`==== 展示プレビュー(${SHOT_DIR})====`);
  for (const s of shots) console.log(`  scale=${s.scale} t=${s.step}步: R_core=${fmt(s.Rc, 1)} `
    + `R_half=${fmt(s.Rhalf, 1)} r90=${fmt(s.r90, 1)} rMax=${fmt(s.rMax, 1)} r<150 の粒子=${s.keepR0}/240 → ${path.basename(s.file)}`);
}

// ---- 保存 ----
const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET, targetSha256: TARGET_SHA,
  note: '第39便 39A フェーズ1(台帳4-74「収縮とスピン加速」サンプル化)。QA ではない(合否判定なし)。'
    + 'beta/index.html は読み取りのみ — プリセットの追加・改変はしていない。内蔵化予定の JSON を '
    + 'validatePreset→sim.build で注入して測定している。',
  meta: {
    dt: DT, steps: STEPS, ckEvery: CK_EVERY, refSeed: REF_SEED, seeds: SEEDS, workers: NW,
    node: process.version, platform: `${os.platform()} ${os.release()}`, cpus: os.cpus().length,
    preset: PRESET,
    series: SERIES.map(s => ({ id: s.id, role: s.role, over: s.over, seeds: s.seeds })),
    applicability: { idCollision: APPLIC.ids.includes('spinup'),
      emojiCollision: APPLIC.emojis.filter(e => e === PRESET.emoji).length,
      allEmojis: APPLIC.emojis },
    equivalence: EQUIV,
    definitions: {
      frame: '全指標は重心系(COM)。R_rms=√(Σm r²/Σm)・R_half=半質量半径・core=内側半質量(r≤R_half)',
      omega: 'ω_eff = L_orb/I。ω_eff·I ≡ L_orb は定義上の恒等式(idOm に丸め残差)。非自明なのは '
        + '「ω が (R₀/R)² 倍まで上がるか」= その領域の L_orb が保たれるか',
      conservation: 'L_z(原点まわり・totals().L)+ 帳簿 resL + 放射 radL が一定。尺度 lS は '
        + 'tests/qa.mjs:1211-1220(freebox scales)と同式',
      timeScale: 'timeScale は sim.step() では使われない(描画ループ beta/index.html:4421 と HP.tick のみ)。'
        + 'よって展示速度の調整であって、步数基準の実測値には一切影響しない',
    },
    sources: {
      measure: 'tests/exp-4-68c.mjs:114-149(38C 実験2の測定量定義)',
      conservation: 'tests/qa.mjs:1211-1220 + 1170-1173 = beta/index.html:5866-5867(HP.verify.v1)と同形',
      presetInjection: 'tests/qa.mjs:1146-1148 / 596 / 634',
      design: '第38便 38C レポート §4.1(構成)/ §4.3-4.5(E2 の実測)',
    },
  },
  bottoms, spinupTable, consSummary, shots,
  runs: runs.map(r => ({ job: r.job, elapsedSec: r.elapsedSec, error: r.error || null,
    warnings: r.warnings, n: r.n, nanAt: r.nanAt, init: r.init, cks: r.cks })),
};
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-74.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/exp-4-74.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch (_) {}

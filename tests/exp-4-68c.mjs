// 第38便 38C 実験2(台帳4-68c): 自己重力 vs 圧力(E5′)による半径の収縮と、
// 収縮によるスピン加速(角運動量保存)の検証(原仮定者指示)。
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-68c.json に計測値を保存する。
// - 対象実装ファイルは一切変更しない。プリセットの改変・追加もしない —
//   構成は「オブジェクトを組み立てて HP.validatePreset() に通し HP.sim.build() する」
//   カスタムプリセット注入経路(tests/qa.mjs:1146-1148 / 596 / 634 と同じ HP API)だけで作る。
//   起動直後に一度だけ HP.loadPreset('pressure', false) を通す(= 正規経路でページ内グローバル
//   currentPreset を同期させる。tests/exp-factors.mjs:13-16 の A/B複製破損バグの教訓。
//   🎈pressure は thermal:"tint" の内蔵サンプルで、本実験と同じ温度意味論を使う)。
// - 温度は内部状態変数 T_int(thermal:"tint" — 第36便D/第37便C2)。圧力は E5′
//   F = kRep·μ·√(T_iT_j)·(g_i²+g_j²)·(r_i−r_j)、冷却は E11 Λ = η_rad·T^p(radE 帳簿へ)。
//   kFrame=0・箱なし・ピンなし・一様重力なし = 外部駆動ゼロの完全閉鎖系なので、
//   リザーバ帳簿(resPx/resPy/resL)は全て 0 のままで L_z が保存するはず — これを機械証明する。
//
// 系列(統括の実験設計。1系列=1変更):
//   E0 主系列: etaRad=3e-3(冷却あり)— 収縮とスピン加速の本命(3seed)
//   E1 対照  : etaRad=0        — 圧力が縮みを支える(固定seed)
//   E2 対照  : kRep=0(冷却あり)— 圧力なしの自由落下的収縮(固定seed)
//   E0b 追加 : etaRad=1e-2     — 冷却率の用量反応(固定seed。統括設計の必須項目ではない補助点)
//
// 実行: node tests/exp-4-68c.mjs(playwright 必須。既定 4 並列・約5分)
//   QA_TARGET=beta/index.html node tests/exp-4-68c.mjs  … 既定。ルート index.html(v1.32)には
//     thermal:"tint" が無いため本実験は beta 専用(未対応の対象では前提チェックで中止する)。
//     対象ファイルは起動時に一時ディレクトリへスナップショットしてから開く(他便が同ファイルを
//     並行編集していても1回の実験中は不変 — SHA-256 を記録)。
//   EXP468C_NW=2 node tests/exp-4-68c.mjs               … 並列ワーカー数(既定4)
//
// 転記元:
//   保存則の尺度 pS/lS と相対ずれ  tests/qa.mjs:1211-1220(freebox scales)+ 1170-1173
//     = beta/index.html:5866-5867(HP.verify.v1 の恒等式 P+帳簿P / L+帳簿L+放射L)と同形
//   U_rep                          beta/index.html:2250-2268(HP.urepEnergy — 公開フックをそのまま使う)
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

const TARGET_SRC = fs.readFileSync(TARGET_ABS);
const TARGET_SHA = crypto.createHash('sha256').update(TARGET_SRC).digest('hex');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'exp468c-'));
const SNAP = path.join(TMP_DIR, 'target.html');
fs.writeFileSync(SNAP, TARGET_SRC);
const INDEX = 'file://' + SNAP;

const DT = 0.016;
const STEPS = 24000;
const CK_EVERY = 2000;                 // チェックポイント刻み(t=0 と 2000 步ごと = 13点)
const NW = Math.max(1, Number(process.env.EXP468C_NW || 4));
const REF_SEED = 20260728;
const SEEDS = [REF_SEED, 20260729, 20260730];

// ---- 構成(短縮走行の実測から決めた値。決定の根拠はレポート「C2 設計の較正」節)----
//   n=240・m=1(均一)・初期半径150 の一様円盤・rMul=3(R_i = radiusScale·rMul·√m = 3)
//   弱いコヒーレント回転は disk の vMode:"rigid"(v = vScale·r = ω0·r)で与える
//   = 「vx=-ω0·y, vy=ω0·x を初速に加算」と同一の剛体回転(現行の配置生成ロジックをそのまま流用)
const BASE = {
  n: 240, radius: 150, m: 1, rMul: 3, T0: 2, w0: 0.00675,
  G: 4, D0: 2, kRep: 1, muF: 0.5, gammaN: 0.4, kappaS: 0.05, etaRad: 3e-3, pRad: 2,
  cHeat: 0.2, softening: 3,
};
const SERIES = [
  { id: 'E0', role: '主系列(冷却あり)', over: {}, seeds: SEEDS },
  { id: 'E1', role: '対照(etaRad=0 — 圧力が支える)', over: { etaRad: 0 }, seeds: [REF_SEED] },
  { id: 'E2', role: '対照(kRep=0 — 圧力なしの自由落下的収縮)', over: { kRep: 0 }, seeds: [REF_SEED] },
  { id: 'E0b', role: '追加(冷却率の用量反応 etaRad=1e-2)', over: { etaRad: 1e-2 }, seeds: [REF_SEED] },
];

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

function pageSetup() {
  // 正規経路でプリセットを1回読む(currentPreset 同期)。🎈pressure は thermal:"tint" の内蔵サンプル
  HP.loadPreset('pressure', false);

  const mkPreset = (c) => ({
    name: 'exp-4-68c', description: '自己重力と圧力による収縮+スピン加速(第38便38C・台帳4-68c)',
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: c.seed,
    thermal: 'tint',
    physics: { G: c.G, D0: c.D0, kFrame: 0, q: 2, kRep: c.kRep, muF: c.muF, gammaN: c.gammaN,
      kappaS: c.kappaS, Kt: 60, cLight: 60, bM: 1, etaRad: c.etaRad, pRad: c.pRad, cHeat: c.cHeat,
      gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
      radiusScale: 1, softening: c.softening, timeScale: 1 },
    bodies: [{ type: 'disk', rMul: c.rMul, n: c.n, cx: 0, cy: 0, radius: c.radius,
      mMin: c.m, mMax: c.m, spinMin: 0, spinMax: 0, tInt: c.T0,
      vMode: 'rigid', aroundMass: 0, vScale: c.w0, direction: 1 }],
    overlays: {} });

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

  // 収縮・スピンの指標はすべて重心系(COM)で測る。系全体の並進は L_z(原点まわり)には
  // 効くが「クラスタが縮んで速く回る」現象とは無関係なため。
  //   R_rms = √(Σm r²/Σm)・R_half = 半質量半径・core = 内側半質量(r ≤ R_half)
  //   ω_eff = L_orb / I(I = Σ m r²。定義上 ω_eff·I ≡ L_orb — 恒等式として毎点で検算する)
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

  const runOne = (c, cfg) => {
    const v = HP.validatePreset(mkPreset(c));
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
        // 恒等式の検算: ω_eff·I − L_orb は厳密に 0 のはず(浮動小数の丸めのみ)
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

  window.__E468C = { mkPreset, runOne, measure, scales };
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
    if (typeof HP.urepEnergy !== 'function') return { ok: false, reason: '対象に HP.urepEnergy なし(第37便C2 前の版)' };
    const v = HP.validatePreset({ name: 't', description: 't', camera: { scale: 200 },
      world: { boundary: 'none', size: 0 }, thermal: 'tint', physics: {},
      bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false, tInt: 1 }] });
    if (!v.ok || v.preset.thermal !== 'tint') return { ok: false, reason: '対象が thermal:"tint" 未対応(ルート v1.32 等)' };
    HP.sim.build(v.preset);
    if (HP.sim.thermal !== 'tint') return { ok: false, reason: 'build が tint モードにならない' };
    return { ok: true, reason: '' };
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

// ================================ 実行 ================================
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`第38便 38C 実験2(台帳4-68c)対象: ${TARGET}  sha256=${TARGET_SHA.slice(0, 12)}  commit=${commit.slice(0, 7)}  並列=${NW}`);
{
  const b = await launch(); const pg = await newPage(b);
  const ap = await checkApplicable(pg);
  await b.close();
  if (!ap.ok) { console.error(`中止: ${ap.reason}`); process.exit(1); }
  console.log('  前提OK: thermal:"tint" + HP.urepEnergy が使える対象');
}

const JOBS = [];
for (const s of SERIES) for (const seed of s.seeds) {
  JOBS.push({ tag: `${s.id}/s${seed}`, series: s.id, role: s.role, seed,
    cfg: Object.assign({}, BASE, s.over, { seed }) });
}
console.log(`本走行 ${JOBS.length}本(${STEPS}步・${CK_EVERY}步ごとに計測)...`);
const runs = await runJobs(JOBS, (page, job) => page.evaluate(
  ({ c, cfg }) => window.__E468C.runOne(c, cfg), { c: job.cfg, cfg: { STEPS, CK_EVERY } }));

const fmt = (v, d = 2) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : v.toFixed(d);
for (const r of runs) {
  if (r.error) { console.log(`  ${r.job.tag}: エラー=${r.error}`); continue; }
  const c0 = r.cks[0], cL = r.cks[r.cks.length - 1];
  console.log(`  ${r.job.tag}: R_half ${fmt(c0.Rhalf, 1)}→${fmt(cL.Rhalf, 1)}  R_core ${fmt(c0.Rc, 1)}→${fmt(cL.Rc, 1)}  `
    + `ω_core ${c0.omC.toExponential(3)}→${cL.omC.toExponential(3)}(×${fmt(cL.omC / c0.omC, 2)})  `
    + `予測(R0/R)²=×${fmt((c0.Rc / cL.Rc) ** 2, 2)}  T ${fmt(c0.Tmean, 2)}→${fmt(cL.Tmean, 2)}  `
    + `|ΔL|/L_scale=${cL.relL.toExponential(2)}  帳簿=[${cL.ledger.slice(0, 3).join(',')}]  `
    + `NaN=${r.nanAt === null ? 'なし' : 't=' + r.nanAt} [${r.elapsedSec}s]`);
}

// ---- スピン加速の数表(命題 ii): ω_core/ω_core(0) と (R_core(0)/R_core)² の比較 ----
const spinupTable = runs.filter(r => !r.error).map(r => ({
  tag: r.job.tag, series: r.job.series, seed: r.job.seed,
  rows: r.cks.map(c => {
    const c0 = r.cks[0];
    const predC = (c0.Rc / c.Rc) ** 2, obsC = c.omC / c0.omC;
    const predA = (c0.Rrms / c.Rrms) ** 2, obsA = c.omEff / c0.omEff;
    return { step: c.step,
      Rc: +c.Rc.toFixed(3), Rhalf: +c.Rhalf.toFixed(3), Rrms: +c.Rrms.toFixed(3),
      omC: c.omC, omEff: c.omEff,
      predCore: +predC.toFixed(4), obsCore: +obsC.toFixed(4), devCore: +(obsC / predC - 1).toFixed(4),
      predAll: +predA.toFixed(4), obsAll: +obsA.toFixed(4), devAll: +(obsA / predA - 1).toFixed(4),
      LorbRatio: +(c.Lorb / c0.Lorb).toFixed(6), LcRatio: +(c.Lc / c0.Lc).toFixed(6),
      idOm: c.idOm };
  }),
}));

// ---- 保存則の機械証明の要約 ----
const consSummary = runs.filter(r => !r.error).map(r => {
  const cL = r.cks[r.cks.length - 1];
  return { tag: r.job.tag,
    ledgerAllZero: cL.ledger[0] === 0 && cL.ledger[1] === 0 && cL.ledger[2] === 0 && cL.ledger[4] === 0,
    ledger: cL.ledger, Lz0: r.init.Lz, LzEnd: cL.Lz,
    relP: cL.relP, relL: cL.relL, dLrel0: cL.dLrel0, idOmMax: Math.max(...r.cks.map(c => c.idOm)),
    nan: r.nanAt !== null };
});
console.log('');
console.log('==== 保存則(L_z+帳簿)の機械証明 ====');
for (const c of consSummary) console.log(`  ${c.tag}: 帳簿P/L=[${c.ledger.slice(0, 3).join(',')}] 放射L=${c.ledger[4]} `
  + `(全0=${c.ledgerAllZero}) L_z ${c.Lz0.toFixed(3)}→${c.LzEnd.toFixed(3)} `
  + `|ΔL|/L_scale=${c.relL.toExponential(2)} |ΔL|/|L₀|=${c.dLrel0.toExponential(2)} `
  + `|ω_eff·I−L_orb|/|L_orb|max=${c.idOmMax.toExponential(2)} NaN=${c.nan}`);

const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET, targetSha256: TARGET_SHA,
  note: '第38便 38C 実験2(台帳4-68c「自己重力と圧力による半径の縮み+縮みによるスピン加速」)。'
    + 'QA ではない(合否判定なし)。内蔵プリセットは一切変更していない — 構成は validatePreset→sim.build の'
    + 'カスタムプリセット注入経路だけで作っている。',
  meta: {
    dt: DT, steps: STEPS, ckEvery: CK_EVERY, base: BASE,
    series: SERIES.map(s => ({ id: s.id, role: s.role, over: s.over, seeds: s.seeds })),
    refSeed: REF_SEED, workers: NW,
    node: process.version, platform: `${os.platform()} ${os.release()}`, cpus: os.cpus().length,
    definitions: {
      frame: '全指標は重心系(COM)。R_rms=√(Σm r²/Σm)・R_half=半質量半径・core=内側半質量(r≤R_half)',
      omega: 'ω_eff = L_orb/I(I=Σ m r²)。ω_eff·I ≡ L_orb は定義上の恒等式で、idOm に丸め残差を記録する。'
        + '非自明なのは「ω が (R₀/R)² 倍まで上がるか」= L_orb が保たれるか(devAll)と、'
        + 'コアが自己相似に縮むか(devCore)',
      conservation: 'L_z(原点まわり・totals().L = 軌道 + ½mR²s のスピン項)+ 帳簿 resL + 放射 radL が一定。'
        + '尺度 lS は tests/qa.mjs:1211-1220(freebox scales)と同式',
    },
    sources: {
      conservation: 'tests/qa.mjs:1211-1220 + 1170-1173 = beta/index.html:5866-5867(HP.verify.v1)と同形',
      urep: 'beta/index.html:2250-2268(HP.urepEnergy 公開フック)',
      presetInjection: 'tests/qa.mjs:1146-1148 / 596 / 634(オブジェクト→validatePreset→sim.build)',
    },
  },
  spinupTable, consSummary,
  runs: runs.map(r => ({ job: r.job, elapsedSec: r.elapsedSec, error: r.error || null,
    warnings: r.warnings, n: r.n, nanAt: r.nanAt, init: r.init, cks: r.cks })),
};
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-68c.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/exp-4-68c.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch (_) {}

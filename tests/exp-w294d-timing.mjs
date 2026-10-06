// 第294便d(原仮定者の裁定(第84報)「較正走行と QA で時間が掛かっているサンプルについて、改善を行う」・統括の検証項目 R151)
// —— **時間の内訳の器**(較正走行・保存 QA・再生成の鎖の段を 1 か所に集める)。**判定の欄は持たない**(時間だけ —— 合否・区分・判定語を書かない)。
//
// ■ 何を集めるか(読むだけ)
//   (A) 較正走行(正本 tests/out/calaudit-w249.json の run): 本ごとの粒子数・步数・壁時計・步/秒・dt/2 と dt/4 の転記(元の走行の壁時計)。
//       上位 5 本(壁時計の大きい順)は **step / 抽出 / 前置の步/秒の測定** に分ける —— step は (L1) の実測の μs/步 × 走った步数、
//       抽出(步ごとの検出器と停止の検査)は「壁時計 − step」、前置の測定は calaudit が段ごとに走らせる 5000+20000 步(`__w249rate` —— 壁時計の外)。
//       🌞 は対象ごとの必要窓(20 近点 × t=0 の 1 公転の步数)を並べる(同じ軌道から周期・離心率・近点を読むので、窓は最も遅い対象が決める)。
//   (B) 保存 QA(tests/out/qa-results-full-beta.json —— QA の記録。**来歴の inputs に入れない**(QA が走るたびに変わる記録なので、sha を sources に写すだけ)):
//       項目ごとの ms・W5 の単位ごとの runMs・前置(② 前回 FAIL の先行・③ 変更依存の先行)の ms・syntax に請求されていた時間。
//   (C) 再生成の鎖(tests/lib-w281a-regentable.mjs の表): 段ごとの実測秒・常時群・`presets:"all"` の段・履歴の段の除外。
//       全本段は「段の中で内蔵を 1 本ずつ回すか(本ごとの走行)」を器の本文の印で分け、退役 33 本の時間の上限を (L4) の実測で添える。
// ■ その場で測るもの(live —— 時間の欄だけ。**入力・窓・刻み・粒は変えない**。器の中の写しはどこにも書かない)
//   (L1) 上位 5 本の step だけの μs/步(Chromium —— 較正走行と同じ実行系・validatePreset → build・暖機のあと K 步 × 3 回の中央値)
//   (L2) 💍💠🌞 の試験粒子(ring の testParticle)を外した写しの μs/步と、主張が読む天体(single)の Kc 步後の状態の全粒との最大相対差
//        (部分集合を採るかの**材料** —— 本便は採らない。1e-12 より大きく動けば部分集合は採れない)
//   (L3) 依存閉包: 高速化した `closureOf` と参照実装 `closureOfRef294`(第293便までの本文)の所要と、全 scope × 3 版の全欄の一致数
//   (L4) 内蔵の build だけ・loadPreset+32 步の所要の、在位/退役の和(全本段の本ごとの走行の上限の目安)
//   (L5) 🌛 earthMoonInertial・🐌 inertialDragPair の μs/步(n=2 の展開形の後)
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w294d-timing.mjs
//       → 正本 tests/out/timing-w294d.json(W294D_OUT で出力先を変える)。`--no-live` は (L1)〜(L5) を省く(集計だけ)。
// 読む正本: tests/out/calaudit-w249.json(安定 hash —— 壁時計は除外 Pointer なので、壁時計だけが変わった calaudit の再走では本器は再利用になる。
//   正本は生成した時点の記録で、どの calaudit を読んだかは sources.calaudit.generatedAt に残る —— 段は常時群にしない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs, closureSame294, declaredOuts, readDeclaredScope } from './lib-w281a-scope.mjs';
import { REGEN_STEPS, volatileDeclared } from './lib-w281a-regentable.mjs';
// 第281便a(AN16・R71): この器が読む html の領域(live の (L4) が内蔵の全本を build する —— 全本・退役の表・受理と構築の閉包)
const REGEN_SCOPE = {"presets":"all","roots":["HP.allPresets","HP.loadPreset","HP.sim","HP.validatePreset","RETIRED_PRESETS"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w294d-timing-1';
export const TARGET = 'beta/index.html';
export const OUT_DEFAULT = 'tests/out/timing-w294d.json';
export const CALAUDIT = 'tests/out/calaudit-w249.json';
export const QA_RESULTS = 'tests/out/qa-results-full-beta.json';
/** 較正走行が段ごとに走らせる步/秒の測定の步数(tests/exp-w249b-calaudit.mjs `__w249rate` —— 暖機 5000 + 計時 20000)。 */
export const RATE_PROBE_STEPS = 25000;
/** 重い QA 単位(ブリーフ 4 の 5 本)。 */
export const HEAVY_QA_UNITS = ['W5b:phaseMultiseed', 'W5b:phasechangeSchema', 'W5b:galaxyGeo2', 'W5b:roundtripBuiltins', 'W5c:galaxyAB'];
/** 環(試験粒子)を持つ較正の本 —— (L2) で試験粒子を外した写しの μs/步と主張が読む天体の差を測る(写しは器の中だけ)。 */
export const TP_SUBSET_IDS = ['saturnRingReal', 'uranusReal', 'solarInner'];
/** 二体の本(n=2 の展開形の対象)。 */
export const TWO_BODY_IDS = ['earthMoonInertial', 'inertialDragPair'];
/** 判定の欄を持たないことの印(QA docs.timingContract294 が全鍵を走査して照合する)。 */
export const FORBIDDEN_KEYS = ['pass', 'ok', 'verdict', 'verdict4', 'judgement', 'gate', 'fourValues', 'tally'];

/**
 * 全本段の本ごとの走行の印(器の本文に現れる書き方 —— 段の中で内蔵を 1 本ずつ build/走らせる)。
 * 印が無い全本段は「領域の宣言が全本(どの本の宣言が変わっても走り直す)なだけで、走るのは決まった本」。
 */
export const PER_PRESET_LOOP_MARKS = [
  { re: /for \(const id of ids\) \{[\s\S]{0,400}?\.loaded\(/, what: '全本(または部分集合)を loadPreset して数步 —— 基点 html と今の html の 2 回' },
  { re: /export function raySurvey\(H0, H1\)/, what: '全本を validatePreset → build して重い天体と光線の扇(基点と今の 2 回)' },
  { re: /'--hashes'/, what: '全本を validatePreset → build して数步の状態 hash(子プロセス —— 基点と今の 2 回)' },
  { re: /for\(const p of HP\.allPresets\(\)\)\{\s*let row=/, what: '全本を loadPreset して数步の状態指紋(基点 html と今の html の 2 回)' },
];

const med = (a) => { const b = a.filter(Number.isFinite).slice().sort((x, y) => x - y); return b.length ? b[(b.length - 1) >> 1] : null; };
const r3 = (x) => (Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null);
const rd = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');

// ---------------------------------------------------------------- (A) 較正走行
export function calTable(C) {
  const rows = C.presets.map((p) => {
    const r = p.run || {};
    const half = r.dtHalf || null, quarter = r.dtQuarter || null;
    const tb = Array.isArray(r.timeBudget) ? r.timeBudget : [];
    return { id: p.id, emoji: p.emoji, n: r.n, dt: r.dt, steps: r.steps, wallSec: r.wallSec,
      rateStepsPerSec: (tb.find((z) => z.tag === 'dt') || {}).rateStepsPerSec ?? null,
      targets: (r.orbits || []).map((o) => o.label),
      dtHalf: half ? { steps: half.steps, wallSec: half.wallSec ?? null, skippedBy: half.skippedBy || null,
        reusedFromWallSec: half.reusedFrom ? half.reusedFrom.wallSec : null } : null,
      dtQuarter: quarter ? { steps: quarter.steps, wallSec: quarter.wallSec ?? null, skippedBy: quarter.skippedBy || null,
        reusedFromWallSec: (tb.find((z) => z.tag === 'dt/4') || {}).wallSec ?? null } : null };
  });
  rows.sort((a, b) => (b.wallSec || 0) - (a.wallSec || 0));
  const sum = (f) => rows.reduce((s, z) => s + (f(z) || 0), 0);
  return { n: rows.length, rows, top5: rows.slice(0, 5).map((z) => z.id),
    wallSecDt: r3(sum((z) => z.wallSec)), wallSecRun: r3(sum((z) => z.wallSec) + sum((z) => (z.dtHalf && !z.dtHalf.skippedBy ? z.dtHalf.wallSec : 0))),
    transcribedSec: { dtHalf: r3(sum((z) => (z.dtHalf && z.dtHalf.skippedBy ? z.dtHalf.reusedFromWallSec : 0))),
      dtQuarter: r3(sum((z) => (z.dtQuarter && z.dtQuarter.skippedBy ? z.dtQuarter.reusedFromWallSec : 0))) } };
}
/** 🌞 等の必要窓: 20 近点窓に要る步数(needPeriastra × t=0 の 1 公転の步数)を対象ごとに。 */
export function windowNeed(C, id) {
  const p = C.presets.find((z) => z.id === id);
  const sr = p && p.run && p.run.stopRule;
  if (!sr) return null;
  const spo = sr.stepsPerOrbit0 || [];
  const lab = (p.run.orbits || []).map((o) => o.label);
  const rows = spo.map((s, k) => ({ label: lab[k] || null, stepsPerOrbit0: s, periFoundA: (sr.periFoundA || [])[k] ?? null,
    stepsForWindow: Number.isFinite(s) ? s * sr.needPeriastra : null,
    windowOverRun: Number.isFinite(s) ? r3(s * sr.needPeriastra / sr.stepsRun) : null }));
  const dict = rows.reduce((a, z) => (z.stepsForWindow > (a ? a.stepsForWindow : -1) ? z : a), null);
  return { id, needPeriastra: sr.needPeriastra, stepsRun: sr.stepsRun, maxSteps: sr.maxSteps, boundBy: sr.boundBy, rows,
    dictatedBy: dict ? dict.label : null,
    note: '同じ走行から全対象の周期・離心率・近点を読むので、窓の步数は最も遅い対象が決める(対象ごとに別の走行にしても、遅い対象の步数は減らない)' };
}

// ---------------------------------------------------------------- (B) 保存 QA
export function qaTable(Q) {
  const res = Array.isArray(Q.results) ? Q.results : [];
  const top = res.slice().sort((a, b) => (b.ms || 0) - (a.ms || 0)).slice(0, 15).map((z) => ({ id: z.id, ms: z.ms }));
  const ut = Object.entries(Q.unitTimings || {}).map(([k, v]) => ({ unit: k, where: v.where, runMs: v.runMs ?? null }))
    .sort((a, b) => (b.runMs || 0) - (a.runMs || 0));
  const syntax = res.find((z) => z.id === 'syntax');
  return { total: Q.total ?? res.length, durationMs: Q.durationMs ?? null, wallDurationMs: Q.wallDurationMs ?? null, tier: Q.tier || null,
    prefixMs: { replay: Q.replay ? Q.replay.ms : null, changed: Q.changed ? Q.changed.ms : null },
    syntaxMs: syntax ? syntax.ms : null,
    syntaxNote: '第294便d より前の qa.mjs は前置(② 前回 FAIL の先行・③ 変更依存の先行)の時間を syntax に請求していた(lastAddAt の起点)。第294便d 以降の記録では syntax は node --check だけ',
    top15: top, units: ut.slice(0, 20), heavy: HEAVY_QA_UNITS.map((u) => ut.find((z) => z.unit === u) || { unit: u, where: null, runMs: null }),
    w5: Q.w5 || null };
}

// ---------------------------------------------------------------- (C) 鎖の段
export function chainTable(root) {
  const cur = REGEN_STEPS.filter((z) => z.role !== 'history');
  const rows = cur.map((st) => {
    const m = st.cmd.match(/tests\/exp-[\w-]+\.mjs/);
    const file = m ? path.join(root, m[0]) : null;
    const text = file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const decl = text ? readDeclaredScope(text) : null;
    const all = !!(decl && decl.presets === 'all');
    const loops = all ? PER_PRESET_LOOP_MARKS.filter((z) => z.re.test(text)).map((z) => z.what) : [];
    return { key: st.key, sec: st.sec, secSource: st.secSource, alwaysRun: !!st.alwaysRun, presetsAll: all,
      perPresetLoops: loops, harness: m ? m[0] : null };
  });
  const sum = (f) => r3(rows.filter(f).reduce((s, z) => s + (z.sec || 0), 0));
  const allRows = rows.filter((z) => z.presetsAll).sort((a, b) => b.sec - a.sec);
  return { nCurrent: rows.length, secCurrent: sum(() => true), nAlways: rows.filter((z) => z.alwaysRun).length, secAlways: sum((z) => z.alwaysRun),
    presetsAll: allRows, secPresetsAll: sum((z) => z.presetsAll),
    rows: rows.slice().sort((a, b) => b.sec - a.sec).slice(0, 20) };
}

// ---------------------------------------------------------------- live(Chromium)
async function getBrowser() {
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) { const { createRequire } = await import('node:module'); const { chromium } = createRequire(path.join(dir, 'noop.js'))('playwright-core');
    return chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
  throw new Error('playwright が見つからない(PLAYWRIGHT_CORE_DIR を指定)');
}
const PAGE_HELPERS = () => {
  window.__w294dBuild = (id, strip) => {
    const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (strip) p.bodies = p.bodies.filter((b) => !(b.testParticle === true));   // 写しだけ(本体は 1 bit も書き換えない)
    const v = HP.validatePreset(p); HP.sim.build(v.preset); return HP.sim.n;
  };
  window.__w294dRate = (id, dt, warm, K, strip) => {
    window.__w294dBuild(id, strip); const S = HP.sim;
    for (let i = 0; i < warm; i++) S.step(dt);
    const t0 = performance.now(); for (let i = 0; i < K; i++) S.step(dt); const ms = performance.now() - t0;
    return { n: S.n, us: ms * 1000 / K };
  };
  // 抽出の**代理**(較正走行の検出器の本文そのものではない —— 1 步ごとに対象ごとの距離・角・ṙ・角の連続化・極値と、全粒の NaN 検査を読む形と量を写した計時用の読み出し)。
  //   step だけの走行と**同じページで交互に**測り、比(抽出の割合)だけを使う(負荷の揺れは両方に掛かる)
  window.__w294dProxy = (id, dt, warm, K, nT) => {
    window.__w294dBuild(id, false); const S = HP.sim;
    for (let i = 0; i < warm; i++) S.step(dt);
    const T = []; for (let k = 1; k <= nT && k < S.n; k++) T.push({ oi: k, ap: Math.atan2(S.y[k] - S.y[0], S.x[k] - S.x[0]), acc: 0, rMin: Infinity, rMax: -Infinity, rd1: 0, n: 0 });
    const t0 = performance.now();
    for (let i = 0; i < K; i++) {
      S.step(dt);
      for (const t of T) {
        const dx = S.x[t.oi] - S.x[0], dy = S.y[t.oi] - S.y[0], rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[t.oi] - S.vx[0], dvy = S.vy[t.oi] - S.vy[0], rd = rr > 0 ? (dx * dvx + dy * dvy) / rr : 0;
        if (rr < t.rMin) t.rMin = rr; if (rr > t.rMax) t.rMax = rr;
        let d = th - t.ap; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; t.acc += d; t.ap = th;
        if (t.rd1 < 0 && rd >= 0) t.n++; t.rd1 = rd;
      }
      if (T.every((t) => t.n > 1e15)) break;
      if (S.hasNaN()) break;
    }
    return { us: (performance.now() - t0) * 1000 / K };
  };
  window.__w294dSingles = (id, dt, K) => {
    const pick = (S, idx) => idx.map((i) => [S.x[i], S.y[i], S.vx[i], S.vy[i]]);
    const p = HP.allPresets().find((q) => q.id === id);
    const nSingle = p.bodies.filter((b) => !b.type || b.type === 'single').length;
    const idx = Array.from({ length: nSingle }, (_, i) => i);
    window.__w294dBuild(id, false); for (let k = 0; k < K; k++) HP.sim.step(dt); const a = pick(HP.sim, idx);
    window.__w294dBuild(id, true); for (let k = 0; k < K; k++) HP.sim.step(dt); const b = pick(HP.sim, idx);
    let maxRel = 0, bitSame = true;
    a.forEach((row, i) => row.forEach((v, j) => { const w = b[i][j]; if (!Object.is(v, w)) bitSame = false;
      const d = Math.abs(v - w) / Math.max(1e-300, Math.abs(v)); if (d > maxRel) maxRel = d; }));
    return { nSingle, steps: K, bitSame, maxRel };
  };
  window.__w294dCost = () => {
    const R = (typeof RETIRED_PRESETS === 'object' && RETIRED_PRESETS) ? new Set(Object.keys(RETIRED_PRESETS)) : new Set();
    const o = { build: { live: 0, retired: 0 }, load32: { live: 0, retired: 0 }, nRetired: 0, nLive: 0 };
    for (const p of HP.allPresets()) {
      const k = R.has(p.id) ? 'retired' : 'live'; if (k === 'retired') o.nRetired++; else o.nLive++;
      const t0 = performance.now(); const v = HP.validatePreset(JSON.parse(JSON.stringify(p))); HP.sim.build(v.preset);
      const t1 = performance.now(); HP.loadPreset(p.id, false); for (let s = 0; s < 32; s++) HP.sim.step(0.016); const t2 = performance.now();
      o.build[k] += t1 - t0; o.load32[k] += t2 - t1;
    }
    return o;
  };
};
async function live(cal, reps) {
  const browser = await getBrowser();
  const pg = await browser.newPage();
  await pg.goto('file://' + path.join(ROOT, TARGET));
  await pg.waitForFunction(() => window.HP && HP.sim);
  await pg.evaluate(PAGE_HELPERS);
  const out = { reps, rates: [], subset: [], twoBody: [], cost: null };
  for (const id of cal.top5) {
    const row = cal.rows.find((z) => z.id === id);
    const K = Math.max(20000, Math.min(2000000, Math.round((row.rateStepsPerSec || 20000) * 1.0)));
    const nT = (row.targets || []).length || 1;
    const us = [], px = [];
    let n = null;
    for (let i = 0; i < reps; i++) {
      const r = await pg.evaluate(({ id, dt, K }) => window.__w294dRate(id, dt, 5000, K, false), { id, dt: row.dt, K }); us.push(r.us); n = r.n;
      const q = await pg.evaluate(({ id, dt, K, nT }) => window.__w294dProxy(id, dt, 5000, K, nT), { id, dt: row.dt, K, nT }); px.push(q.us);
    }
    out.rates.push({ id, n, K, nTargets: nT, usPerStep: us.map(r3), usMedian: r3(med(us)), usProxy: px.map(r3), usProxyMedian: r3(med(px)),
      extractShare: r3(Math.max(0, 1 - med(us) / med(px))) });
  }
  for (const id of TP_SUBSET_IDS) {
    const row = cal.rows.find((z) => z.id === id);
    if (!row) continue;
    const K = Math.max(20000, Math.round((row.rateStepsPerSec || 20000) * 0.5));
    const usFull = [], usStrip = [];
    let nFull = null, nStrip = null;
    for (let i = 0; i < reps; i++) {
      const a = await pg.evaluate(({ id, dt, K }) => window.__w294dRate(id, dt, 2000, K, false), { id, dt: row.dt, K }); usFull.push(a.us); nFull = a.n;
      const b = await pg.evaluate(({ id, dt, K }) => window.__w294dRate(id, dt, 2000, K * 10, true), { id, dt: row.dt, K }); usStrip.push(b.us); nStrip = b.n;
    }
    const s = await pg.evaluate(({ id, dt }) => window.__w294dSingles(id, dt, 2000), { id, dt: row.dt });
    out.subset.push({ id, nFull, nStrip, usFullMedian: r3(med(usFull)), usStripMedian: r3(med(usStrip)),
      speedup: r3(med(usFull) / med(usStrip)), singlesAfter: s,
      note: '試験粒子(ring の testParticle)を外した写し —— **測るだけ**(本便は較正走行の入力を変えない)。主張が読む single の状態が全粒の走行とビット同一でなければ(1e-12 より大きく動けば)部分集合は採れない' });
  }
  for (const id of TWO_BODY_IDS) {
    const us = [];
    for (let i = 0; i < reps; i++) { const r = await pg.evaluate(({ id }) => window.__w294dRate(id, 0.016, 5000, 400000, false), { id }); us.push(r.us); }
    out.twoBody.push({ id, K: 400000, usPerStep: us.map(r3), usMedian: r3(med(us)) });
  }
  out.cost = await pg.evaluate(() => window.__w294dCost());
  for (const k of ['build', 'load32']) for (const g of ['live', 'retired']) out.cost[k][g] = r3(out.cost[k][g]);
  await browser.close();
  return out;
}

// ---------------------------------------------------------------- 本体
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const LIVE = !process.argv.includes('--no-live');
  const REPS = Math.max(3, Number(process.env.W294D_REPS) || 3);
  const OUT = process.env.W294D_OUT ? path.resolve(process.env.W294D_OUT) : path.join(ROOT, OUT_DEFAULT);
  const C = rd(CALAUDIT);
  const cal = calTable(C);
  let Q = null; try { Q = rd(QA_RESULTS); } catch { Q = null; }
  const qa = Q ? qaTable(Q) : null;
  const chain = chainTable(ROOT);
  let L = null, closure = null;
  if (LIVE) {
    L = await live(cal, REPS);
    const rows = await declaredOuts(ROOT);
    closure = closureSame294({ html: path.join(ROOT, TARGET), rows, reps: 1 });
  }
  // 上位 5 本の分解(step = live の μs/步 × 走った步数・抽出 = 壁時計 − step・前置の步/秒の測定 = 25000 步)
  const top5 = cal.top5.map((id) => {
    const row = cal.rows.find((z) => z.id === id);
    const lr = L ? L.rates.find((z) => z.id === id) : null;
    const us = lr ? lr.usMedian : null;
    const rate = row.rateStepsPerSec;
    // 記録の分解: step = 走った步数 / 走行の直前に同じ負荷で測った步/秒(calaudit の記録)。n=2 は 20000 步の測定が短すぎて
    //   step が壁時計を超える(記録からは分けられない)ので、live の比(同じページで交互に測った step だけ と 抽出の代理)で分ける
    const stepRec = Number.isFinite(rate) && rate > 0 ? r3(row.steps / rate) : null;
    const share = lr ? lr.extractShare : null;
    const useLive = !(Number.isFinite(stepRec) && stepRec <= row.wallSec);
    const stepSec = useLive ? (Number.isFinite(share) ? r3(row.wallSec * (1 - share)) : null) : stepRec;
    return { id, emoji: row.emoji, n: row.n, steps: row.steps, wallSec: row.wallSec, rateStepsPerSec: rate, usPerStepLive: us,
      stepSecRecord: stepRec, extractShareLive: share, splitFrom: useLive ? 'live-ratio' : 'record-rate',
      stepSec, extractSec: Number.isFinite(stepSec) ? r3(row.wallSec - stepSec) : null,
      rateProbeSec: Number.isFinite(rate) && rate > 0 ? r3(RATE_PROBE_STEPS / rate) : null,
      dtHalf: row.dtHalf, dtQuarter: row.dtQuarter };
  });
  const retiredBound = L && L.cost ? chain.presetsAll.filter((z) => z.perPresetLoops.length).map((z) => ({ key: z.key, sec: z.sec, loops: z.perPresetLoops,
    retiredSecUpperPerHtml: r3((L.cost.build.retired + L.cost.load32.retired) / 1000) })) : null;
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第294便d', target: TARGET, inputs: [CALAUDIT],
    code: ['tests/exp-w294d-timing.mjs', 'tests/lib-w281a-scope.mjs', 'tests/lib-w281a-regentable.mjs', 'tests/lib-w272e-provenance.mjs'] }), {
    harnessVersion: HARNESS_VERSION,
    ruling: '原仮定者の裁定(第84報): 較正走行と QA で時間が掛かっているサンプルについて、改善を行う',
    reading: '統括の検証項目 R151: 先に内訳を測り、物理・入力・窓・抽出器・判定を変えずに時間を減らす(速さと判定は別の文)',
    notClaim: ['判定が動いた', '較正 合', '合に近づいた', '速くなったので判定が動いた'] });
  Object.assign(meta, w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE), w281aStableInputs(ROOT, meta.inputs.filter((z) => volatileDeclared(z.file))));
  const out = {
    meta,
    what: '時間の内訳(較正走行・保存 QA・再生成の鎖)。判定の欄は持たない —— 合否・区分・判定語は calaudit・QA の正本にあり、ここには写さない',
    sources: { calaudit: { file: CALAUDIT, generatedAt: (C.meta && (C.meta.generatedAt || C.meta.when)) || null },
      qa: Q ? { file: QA_RESULTS, sha256: sha(path.join(ROOT, QA_RESULTS)), commit: Q.commit || null, date: Q.date || null, targetSha256: Q.targetSha256 || null,
        note: 'QA の記録(QA が走るたびに変わる)—— 来歴の inputs に入れず、読んだ版の sha をここに写す' } : null,
      chain: 'tests/lib-w281a-regentable.mjs の REGEN_STEPS(sec —— 段の実測秒の記録)' },
    calibration: { table: cal, top5, solarInnerWindow: windowNeed(C, 'solarInner'), rateProbeSteps: RATE_PROBE_STEPS,
      split: 'step = 走った步数 / calaudit が走行の直前に同じ負荷で測った步/秒(record-rate)。それが壁時計を超える本(n=2 —— 20000 步の測定が短すぎる)は、'
        + 'live で同じページに交互に測った「step だけ」と「step + 抽出の代理」の比で壁時計を分ける(live-ratio)/ 抽出 = 壁時計 − step(步ごとの検出器・停止の検査)/ '
        + '前置の步/秒の測定 = 25000 步 ÷ 步/秒(壁時計の外 —— 走らせる段ごと)。live の μs/步 は別の時刻・別の負荷の値で、比だけを使う' },
    qa,
    chain: Object.assign(chain, { retiredBound,
      retiredNote: '全本段のうち本ごとの走行の印がある段だけ、退役 33 本の build と loadPreset+32 步の和(1 html あたり)を上限の目安として添える。'
        + '印の無い全本段(clusterStable・compose293・clusterAnalogy の門の走行等)は、領域の宣言が全本なだけで走るのは決まった本 —— 退役を外しても時間は減らない' }),
    live: L ? { rates: L.rates, subset: L.subset, twoBody: L.twoBody, cost: L.cost, closure } : null,
    elapsedS: null,
  };
  out.elapsedS = (Date.now() - t0) / 1000;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(`[w294d-timing] 較正 ${cal.n} 本(上位 5: ${top5.map((z) => z.emoji + ' ' + z.wallSec + ' s').join('・')})・QA ${qa ? qa.total + ' 件' : 'なし'}・`
    + `鎖 ${chain.nCurrent} 段(全本段 ${chain.presetsAll.length})${closure ? `・閉包 ${closure.same}/${closure.closures} 同一(${closure.msRefMedian}→${closure.msNewMedian} ms)` : ''} → ${path.relative(ROOT, OUT)}(${out.elapsedS.toFixed(1)} s)`);
}

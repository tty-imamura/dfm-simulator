// 第258便e: S._core の JIT 崖のマイクロベンチ(ステップ処理速度 ms/步)。
//
// 背景: 第258便 統合ツリーで beta フルゲートを回すと、シミュレーション本体を長く走らせる
// テストだけが一様に 15〜20 倍遅くなった(claim.galaxygeo2-outerboost 152→3013 s ・
// claim.bhcore-selfdrive 80→1339 s ・behavior.templates229 12→213 s 等)。軽いテストと
// QA_FAST(短い走行)は前便並みである。第239便 §4.5 で確立した「新しい経路は S._core の外に
// 真偽値 1 つで素通り・S._core を大きくしない」規約の **JIT 崖**(V8 が巨大な単一関数の
// 最適化を諦め、インタプリタ実行のまま走る)が疑われる。
//
// **崖は「1 度目の最適化」では出ない。** 素の 1 プリセット走行(loadPreset 1 回)では
// 1.5 倍程度にしかならず、**A/B(2 個目の sim を作って両方を進める)や build の 2 度目**の
// ように S の形が変わって **_core が一度 deopt した後**にはじめて 15〜20 倍になる
// (再最適化が通らずインタプリタへ落ちたまま固定される)。本器は QA の重いテストと同じ
// **A/B ワークロード**(loadPreset → abStart('kFrame',0) → 両 sim を進める)で測る。
//
// 使い方:
//   node tests/exp-w258e-jitprobe.mjs beta/_w258e_base.html beta/index.html [...]
//     (引数 1 が比の基準。ms/步 は **1 sim・1 步あたり**へ正規化して表にする)
// 環境変数:
//   W258E_PRESETS(既定 galaxyGeo2,bhCore,galaxyMeshSpiral,gw150914DFM)/ W258E_MODE(ab|plain)
//   W258E_WARM(既定 100 步)/ W258E_MIN_STEPS(既定 400)/ W258E_MAX_STEPS(既定 2000)
//   W258E_MIN_MS(既定 3000)/ W258E_BUDGET_MS(既定 90000 — 1 セルの打ち切り)
//   W258E_MIN_MS_FLOOR(既定 1000 — **小 n の床**)/ W258E_OUT(既定 tests/out/w258e-jitprobe.json)
//
// ■ 第271便e(AA15): **小 n のプリセットで比が揺らぐ**問題への 4 点の手当て(門 1.5× は変えない)
//   ① **計測時間の床**: n が小さいと `W258E_MAX_STEPS` に先に当たって 10〜数十 ms しか測れず、
//      タイマ分解能と 1 回の GC が比をそのまま動かす。**先に短い試走(probe)で ms/步 を見積もり**、
//      `W258E_MIN_MS`(既定 3 s)に必要な步数を出し、`maxSteps` で切った結果が
//      `W258E_MIN_MS_FLOOR`(既定 1 s)に届かないときは **`maxSteps` を超えて步数を増やす**。
//      **probe の見積もりは当てにならない**(小 n では probe の時点でまだ最適化が乗っておらず、
//      本測定の 10 倍遅く見える)ので、**測った ms が床に届かなければ、測った ms/步 で步数を
//      取り直して測り直す**(既定 3 回まで・`W258E_TRIES`)。本測定は**チャンク数を固定**
//      (`W258E_CHUNKS`・既定 8)して回すので、小 n でも `performance.now()` の呼び出し回数が
//      増えず、タイマ経費が測定値に混ざらない。
//   ② **A/B は同じ步数**: 引数 1 の html(比の基準)で決まった步数を、以降の html が**そのまま使う**
//      (自動調整のままだと、比べている 2 セルの步数・チャンク数が違い JIT の状態も揃わない)。
//      1 セルの中でも sim A と sim B は同じ回数だけ進める(従来どおり)。
//   ③ **warm-up と本測定を分ける**: warm-up の所要 ms を別に記録し、本測定の ms には混ぜない。
//   ④ **出力チェックサム**: 本測定の終端で全 sim の (x, y, vx, vy) を FNV-1a で畳んだ値を出し、
//      步数が同じセルどうしで比べる。**違えば速さの比は比べる意味が無い**(同じ計算をしていない)。
//   本器は**時間を測るだけ**で、合否も「速くなった/遅くなった」も宣言しない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2);
if (!TARGETS.length) { console.error('usage: node tests/exp-w258e-jitprobe.mjs <html> [<html>...]'); process.exit(2); }
const PRESETS = (process.env.W258E_PRESETS || 'galaxyGeo2,bhCore,galaxyMeshSpiral,gw150914DFM').split(',').filter(Boolean);
const MODE = process.env.W258E_MODE || 'ab';
const WARM = Number(process.env.W258E_WARM || 100);
const MIN_STEPS = Number(process.env.W258E_MIN_STEPS || 400);
const MAX_STEPS = Number(process.env.W258E_MAX_STEPS || 2000);
const MIN_MS = Number(process.env.W258E_MIN_MS || 3000);
const BUDGET_MS = Number(process.env.W258E_BUDGET_MS || 90000);
// 第271便e(AA15)①: 小 n の床。maxSteps に当たっても、この ms に届くまでは步数を増やす
const MIN_MS_FLOOR = Number(process.env.W258E_MIN_MS_FLOOR || 1000);
// 第271便e(AA15)①: 本測定のチャンク数(固定)・步数を見積もる試走の步数・測り直しの上限
const NCHUNKS = Number(process.env.W258E_CHUNKS || 8);
const PROBE_STEPS = Number(process.env.W258E_PROBE || 200);
const TRIES = Number(process.env.W258E_TRIES || 3);
const OUT = process.env.W258E_OUT || path.join(ROOT, 'tests', 'out', 'w258e-jitprobe.json');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

// plan: **基準 html で決まった進め方**(第271便e②)—— { pre, steps }。null なら probe から決める。
// 1 セルは必ず「前置き(pre 步)→ 本測定(steps 步)」の 2 段で進む。pre は warm-up + 試走 +
// 捨てた測り直しの合計で、**pre と steps が同じなら終端状態も同じ**になる(④ の照合が効く)。
async function cell(target, pid, plan) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const r = await page.evaluate((a) => {
    const [pid, mode, warm, minSteps, maxSteps, minMs, budget, msFloor, nChunks, probeSteps,
      tries, fixedPre, fixedSteps] = a;
    if (!HP.allPresets().some((p) => p.id === pid)) return { missing: true };
    HP.loadPreset(pid, false);
    const sA = HP.sim;
    let sB = null;
    if (mode === 'ab') { HP.abStart('kFrame', 0); sB = HP.ab().simB; }
    const sims = sB ? [sA, sB] : [sA];
    // 1 セルの中では sim A と sim B を**同じ回数**進める(第271便e②)
    const one = () => { for (const s of sims) s.step(0.016); };
    const advance = (k) => { for (let i = 0; i < k; i++) one(); };
    // ④ 出力チェックサム: 倍精度のビット列をそのまま畳む(丸めない)
    const digest = () => {
      let h = 0x811c9dc5;
      const f = new Float64Array(1), u = new Uint8Array(f.buffer);
      const push = (v) => { f[0] = v;
        for (let b = 0; b < 8; b++) { h ^= u[b]; h = Math.imul(h, 0x01000193) >>> 0; } };
      for (const s of sims) for (let i = 0; i < s.n; i++) { push(s.x[i]); push(s.y[i]); push(s.vx[i]); push(s.vy[i]); }
      return h.toString(16);
    };
    // ① 見積もった ms/步 から本測定の步数を決める(チャンク数で割り切れる形にする)
    const planSteps = (perStep) => {
      let k = (perStep > 0) ? Math.ceil(minMs / perStep) : maxSteps;
      let how = 'min-ms';
      if (k > maxSteps) { k = maxSteps; how = 'max-steps'; }
      if (k < minSteps) k = minSteps;
      if (perStep > 0 && k * perStep < msFloor) { k = Math.ceil(msFloor / perStep); how = 'ms-floor(>maxSteps)'; }
      if (perStep > 0 && k * perStep > budget) { k = Math.max(Math.floor(budget / perStep), minSteps); how = 'budget'; }
      k = Math.max(nChunks, Math.ceil(k / nChunks) * nChunks);
      return { k, how };
    };
    // 本測定 1 回(チャンク数は固定 —— 小 n でも performance.now() の回数が増えない)
    const measure = (k) => {
      const CH = Math.max(1, Math.round(k / nChunks));
      let ms = 0; const chunks = [];
      for (let c = 0; c < nChunks; c++) {
        const t0 = performance.now();
        for (let i = 0; i < CH; i++) one();
        const d = performance.now() - t0;
        ms += d; chunks.push(+d.toFixed(2));
      }
      return { steps: CH * nChunks, chunkSteps: CH, ms, chunks };
    };
    let pre = 0, warmMs = 0, probeMs = null, perStep = null, how, m, attempts = [];
    if (fixedPre || fixedSteps) {
      // ② 基準 html と**同じ進め方**をそのまま再現する(步数を測り直さない)
      const tw = performance.now(); advance(fixedPre); warmMs = performance.now() - tw;
      pre = fixedPre; how = 'fixed(基準 html)';
      m = measure(fixedSteps);
    } else {
      // ③ warm-up(本測定の ms には混ぜない)
      const tw = performance.now(); advance(warm); warmMs = performance.now() - tw; pre += warm;
      // ① 試走で ms/步 を見積もる(本測定の ms には混ぜない)
      const tp = performance.now(); advance(probeSteps); probeMs = performance.now() - tp; pre += probeSteps;
      perStep = probeMs / probeSteps;
      let pl = planSteps(perStep); how = pl.how;
      for (let t = 0; t < Math.max(1, tries); t++) {
        m = measure(pl.k);
        attempts.push({ steps: m.steps, ms: +m.ms.toFixed(2), how });
        // ① 床に届いたか。届かなければ**測った ms/步**で步数を取り直して測り直す
        if (m.ms >= msFloor || t === Math.max(1, tries) - 1) break;
        pre += m.steps;                 // 捨てた測定も「前置き」として步数に数える
        pl = planSteps(m.ms / m.steps); how = pl.how + '(測り直し ' + (t + 1) + ')';
      }
    }
    return { n: sA.n, sims: sims.length, pre, steps: m.steps, chunkSteps: m.chunkSteps,
      nChunks, ms: m.ms, chunks: m.chunks, attempts,
      warmMs: +warmMs.toFixed(1), warmSteps: warm,
      probeMs: (probeMs === null) ? null : +probeMs.toFixed(2), probeSteps,
      probeMsPerStep: perStep, how,
      fixedSteps: fixedSteps || null, overMaxSteps: m.steps > maxSteps,
      checksum: digest(), msPerStep: m.ms / (m.steps * sims.length), nan: sA.hasNaN() };
  }, [pid, MODE, WARM, MIN_STEPS, MAX_STEPS, MIN_MS, BUDGET_MS, MIN_MS_FLOOR,
    NCHUNKS, PROBE_STEPS, TRIES, (plan && plan.pre) || 0, (plan && plan.steps) || 0]);
  await page.close();
  if (errs.length) r.pageErrors = errs.slice(0, 2);
  return r;
}

const rows = {};
const fixed = {};     // 第271便e②: 基準 html(引数 1)で決まった preset ごとの進め方 {pre, steps}
for (const t of TARGETS) {
  rows[t] = {};
  for (const pid of PRESETS) {
    const r = await cell(t, pid, fixed[pid] || null);
    rows[t][pid] = r;
    if (!r.missing && !fixed[pid]) fixed[pid] = { pre: r.pre, steps: r.steps };
    console.log(`${t}  ${pid}  ` + (r.missing ? 'MISSING'
      : `n=${r.n} sims=${r.sims} pre=${r.pre} steps=${r.steps}${r.fixedSteps ? '(=基準)' : ''}×${r.nChunks}分割 `
        + `${r.msPerStep.toFixed(5)} ms/步 (本測定 ${(r.ms / 1000).toFixed(2)} s・warm `
        + `${(r.warmMs / 1000).toFixed(2)} s・${r.how}) ck=${r.checksum} chunks=${JSON.stringify(r.chunks)}`));
  }
}
await browser.close();
// ②④ 步数・チェックサムの照合(基準 html に対して)。**違えば比は比べる意味が無い**
const consistency = {};
for (const pid of PRESETS) {
  const b = rows[TARGETS[0]][pid];
  consistency[pid] = TARGETS.slice(1).map((t) => {
    const r = rows[t][pid];
    if (!b || b.missing || !r || r.missing) return { target: t, comparable: false, why: 'MISSING' };
    return { target: t,
      comparable: (r.pre === b.pre && r.steps === b.steps && r.checksum === b.checksum),
      pre: r.pre, basePre: b.pre, steps: r.steps, baseSteps: b.steps,
      ms: +r.ms.toFixed(2), baseMs: +b.ms.toFixed(2),
      ratio: r.msPerStep / b.msPerStep,
      checksum: r.checksum, baseChecksum: b.checksum };
  });
  for (const c of consistency[pid]) if (!c.comparable)
    console.log(`  ! ${pid} ${c.target}: 步数 ${c.steps}/${c.baseSteps}・ck ${c.checksum}/${c.baseChecksum}`
      + ' —— **步数かチェックサムが基準と違う**(比は比較にならない)');
}

const base = TARGETS[0];
const W = 24;
const lines = [];
lines.push('mode=' + MODE + ' (ms/步 は 1 sim・1 步あたり / 括弧内は ' + base.replace(/^beta\//, '') + ' 比)');
lines.push('preset         ' + TARGETS.map((t) => t.replace(/^beta\//, '').replace(/\.html$/, '').padEnd(W)).join(''));
for (const pid of PRESETS) {
  const cells = TARGETS.map((t) => {
    const r = rows[t][pid];
    if (!r || r.missing) return 'MISSING'.padEnd(W);
    const b = rows[base][pid];
    const ratio = (b && !b.missing) ? (r.msPerStep / b.msPerStep) : NaN;
    return (r.msPerStep.toFixed(3) + ' (×' + ratio.toFixed(2) + ')').padEnd(W);
  });
  lines.push(pid.padEnd(15) + cells.join(''));
}
const table = lines.join('\n');
console.log('\n' + table);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ targets: TARGETS, presets: PRESETS, mode: MODE,
  warm: WARM, minSteps: MIN_STEPS, maxSteps: MAX_STEPS, minMs: MIN_MS, minMsFloor: MIN_MS_FLOOR,
  nChunks: NCHUNKS, probeSteps: PROBE_STEPS, tries: TRIES,
  budgetMs: BUDGET_MS, fixedSteps: fixed, consistency, rows, table }, null, 1));
console.log('\n-> ' + OUT);

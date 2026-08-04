// 動的性能回帰ゲート(第29便 — 第25次レビュー P0-3 / 第62便 — Release前レビュー P0-1 で
// 交互ペア測定方式へ改修)。実行: node tests/perf.mjs
// - 同一Chromiumプロセス内に root(index.html)と beta(beta/index.html)の**2ページを常駐**させ、
//   代表サンプルごとに「1フレーム相当の物理ステップ × FRAMES」の所要時間を root/beta
//   **交互のペア**で SETS 回計測し、**ペアごとの比の中央値**で判定する。
//   stepsPerFrame = round(SUBSTEPS × timeScale) を使うため、timeScale 由来の計算量増
//   (第25次レビュー原因1)もこのゲートで検出できる。
// - 第62便の改修理由(Release前レビュー P0-1): 旧方式は「全rootサンプル→全betaサンプル」の
//   固定順で、計測が数分離れるため共有ランナーの負荷変動・JIT状態の偏りが片側だけに乗り、
//   公式CIで galaxy 1.153 FAIL(手元 0.961)という偽陽性が出た。ペアは数秒以内に隣接して
//   走るので同一負荷条件になり、開始側もペアごとに交互(root先/beta先)にして順序効果を相殺する。
//   単純な「root中央値とbeta中央値の比」ではなく**ペア比の中央値**を採用(同レビュー推奨5)。
//   全反復値・環境メタデータ(CPU/Chromium/測定順)を JSON へ記録する(P1-3)。
// - 第39便 39B(台帳4-76): SAMPLES の並びは**変えない**。この順序自体が計測条件の一部である
//   (♨️convection を通した後の JIT 型フィードバック退化を実使用の模擬として維持)。
//   第62便でも各ページ内のサンプル走査順は不変 — 変えたのは root/beta の時間軸上の並びだけ。
// - 変更を意図しないサンプルは beta/root ≤ THRESH(既定1.10)。意図的に増やす場合は
//   ALLOW に {id: 上限} を追記して理由をコメントで残す(明示的な許可リスト)。
// - 結果は tests/out/perf-results.json に保存。1件でも超過なら exit code 1。
// - 描画側(FPS/renderMs)のゲートはヘッドレスCIでは実機代表性が低いため対象外
//   (第25次裁定: CPUゲートのみ採用。描画は実機確認手順に委ねる)。
// - beta 専用サンプル(root 未実装)は従来どおり informational(絶対 ms と ms/frame を記録)。
//   絶対時間の合否ゲートは共有ランナーの絶対値変動(実測 ±25%)で偽陽性になるため設けない
//   (Release前レビュー P1-1 は「記録の充実」で対応 — 実機 FPS は実機確認手順に委ねる)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
const SAMPLES = ['galaxy', 'darkrotor', 'merger', 'convection', 'counterring', 'saturnLayered'];
// 第36便 Wave A(P2-2・ChatGPT差分検証レビュー): echo/freebox(第35便で追加)をベンチ対象へ。
// root(旧版)にはまだ存在しないため feature-detect し、片側にしかプリセットが無い場合は
// 「beta 単独の実測 ms を informational として記録する(pass判定なし・SAMPLES の 6/6 ゲート数
// には含めない)」。root へ第35便が昇格し両側に揃った時点で自動的に比較ゲートへ昇格する。
const EXTRA_SAMPLES = ['echo', 'freebox',
  // 第60便: E14″ 創発一本化 — 旧サンプル(melt/freeze/meltcycle/boil/chain/lattice)は廃止。
  // root には未昇格のため informational 計測(昇格時に自動で比較ゲートへ)
  'emergent', 'emergent2', 'chain2',
  // 第73便(v1.36.0 昇格): v1.36 線の新サンプル — 昇格により root にも揃い自動で比較ゲート化
  'galaxyStd', 'galaxyGeo2', 'chaincycle',
  // 第74便: v1.37 線の新サンプル(ディスク/バルジ381体・ローター星雲98体)— root 未昇格の間は
  // informational 計測(昇格時に自動で比較ゲートへ)
  'galaxyDB', 'nebulaRotor'];
const THRESH = +(process.env.PERF_THRESH || 1.10);
// 例: { convection: 1.60 } — 意図的な負荷増を許可する場合のみ
// 第53便 53D の echo ALLOW 1.45 は第63便(v1.35.0 昇格)で撤去した — 53D の記録どおり、
// root 昇格で echo は byte 同一比較に戻るため(交互ペア測定〔第62便〕でジッタ耐性も向上)。
// 経緯の詳細は git 履歴(第62便以前の本ファイル)を参照
const ALLOW = {};
// 第63便追補(CI 実測 9aae146: PR run で perf.echo 1.608 FAIL/10-11 — ペア比[1.682 1.608
// 1.013]。同一コードの main run は PASS = フレーク): echo は 31粒・60frames=8〜13ms の
// マイクロベンチで、**byte 同一昇格後もページ別 JIT 状態・タイマ分解能のノイズが支配する**
// (53D の「昇格で比≈1へ戻る」仮定は CI で不成立と実測)。ALLOW の復活(1.7 相当が必要 =
// ゲート無意味化)ではなく**計測時間をノイズフロアから引き上げる**: echo だけ FRAMES を
// 60→720(≈100ms/rep)にする。判定条件・ペア比中央値の式は不変。ms 表示・msPerFrame は
// 実フレーム数で正規化される
const FRAMES_OVERRIDE = { echo: 720 };
// 過去の ALLOW 撤去履歴(darkrotor/convection/saturnLayered)と 40C の粒子数削減の実測記録は
// git 履歴(第61便以前の本ファイル冒頭コメント)を参照。
const REPS = 2, FRAMES = 60, WARMUP_FRAMES = 20, SETS = 3;

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  const dir = process.env.PLAYWRIGHT_CORE_DIR;
  if (dir) {
    const { createRequire } = await import('node:module');
    const { chromium } = createRequire(path.join(dir, 'noop.js'))('playwright-core');
    return chromium.launch({ executablePath: exe });
  }
  throw new Error('playwright が見つかりません。`npm install` を実行するか PLAYWRIGHT_CORE_DIR を指定してください');
}

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

// 1側1セットの計測: プリセット読込→ウォームアップ→REPS 回の反復時間(生値)を返す
async function measureSet(page, id, reps, frames, warm) {
  return page.evaluate(([pid, reps, frames, warm]) => {
    HP.loadPreset(pid, false);
    const S = HP.sim;
    // メインループと同じ steps/frame(SUBSTEPS=2・速度×1。上限24も同じ)
    const spf = Math.max(1, Math.min(24, Math.round(2 * (S.params.timeScale || 1))));
    for (let k = 0; k < spf * warm; k++) S.step(0.016);
    const times = [];
    for (let r = 0; r < reps; r++) {
      const t0 = performance.now();
      for (let f = 0; f < frames; f++) for (let s = 0; s < spf; s++) S.step(0.016);
      times.push(performance.now() - t0);
    }
    return { times, stepsPerFrame: spf, n: S.n, nan: S.hasNaN() };
  }, [id, reps, frames, warm]);
}

// 交互ペア測定: SETS ペアを実行し、ペアごとに (root中央値, beta中央値, 比) を取る。
// 開始側はペアごとに交互(root先→beta先→root先…)にして順序効果を相殺する。
async function measurePaired(rootPage, betaPage, id) {
  const frames = FRAMES_OVERRIDE[id] || FRAMES;
  const pairs = [];
  const rawRoot = [], rawBeta = [];
  let meta = null;
  for (let k = 0; k < SETS; k++) {
    const rootFirst = k % 2 === 0;
    let r, b;
    if (rootFirst) {
      r = await measureSet(rootPage, id, REPS, frames, WARMUP_FRAMES);
      b = await measureSet(betaPage, id, REPS, frames, WARMUP_FRAMES);
    } else {
      b = await measureSet(betaPage, id, REPS, frames, WARMUP_FRAMES);
      r = await measureSet(rootPage, id, REPS, frames, WARMUP_FRAMES);
    }
    const rMed = median(r.times), bMed = median(b.times);
    pairs.push({ order: rootFirst ? 'root→beta' : 'beta→root',
      rootMs: +rMed.toFixed(1), betaMs: +bMed.toFixed(1), ratio: +(bMed / rMed).toFixed(3) });
    rawRoot.push(...r.times.map((t) => +t.toFixed(1)));
    rawBeta.push(...b.times.map((t) => +t.toFixed(1)));
    meta = { stepsPerFrameRoot: r.stepsPerFrame, stepsPerFrameBeta: b.stepsPerFrame,
      nRoot: r.n, nBeta: b.n, nan: r.nan || b.nan };
  }
  return {
    ratio: median(pairs.map((p) => p.ratio)),
    rootMs: median(rawRoot), betaMs: median(rawBeta),
    pairs, rawRoot, rawBeta, ...meta,
  };
}

// 片側のみ(informational): SETS セットの中央値
async function measureSingle(page, id) {
  const frames = FRAMES_OVERRIDE[id] || FRAMES;
  const raw = [];
  let meta = null;
  for (let k = 0; k < SETS; k++) {
    const r = await measureSet(page, id, REPS, frames, WARMUP_FRAMES);
    raw.push(...r.times.map((t) => +t.toFixed(1)));
    meta = { stepsPerFrame: r.stepsPerFrame, n: r.n, nan: r.nan };
  }
  return { ms: median(raw), raw, ...meta };
}

const browser = await getBrowser();
const openPage = async (target) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file://' + path.join(ROOT, target));
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
};
console.log('perf gate: root/beta の2ページを常駐させ交互ペア測定(第62便方式)…');
const rootPage = await openPage('index.html');
const betaPage = await openPage(path.join('beta', 'index.html'));
const rootIds = await rootPage.evaluate(() => HP.allPresets().map((p) => String(p.id)));
const betaIds = await betaPage.evaluate(() => HP.allPresets().map((p) => String(p.id)));
const env = {
  node: process.version,
  chromium: browser.version(),
  platform: `${os.platform()}/${os.arch()}`,
  cpu: os.cpus()[0]?.model || 'unknown', cores: os.cpus().length,
  method: `paired-alternating(SETS=${SETS} REPS=${REPS} FRAMES=${FRAMES} WARMUP=${WARMUP_FRAMES})`,
  startedAt: new Date().toISOString(),
};
// Release 監査用の証跡結び付け(Release前レビュー P0-4): ローカル HEAD と CI の Run 情報を記録
try { env.commit = execSync('git rev-parse HEAD', { cwd: ROOT, stdio: 'pipe' }).toString().trim(); } catch { env.commit = 'unknown'; }
env.run = { githubRunId: process.env.GITHUB_RUN_ID || null, sha: process.env.GITHUB_SHA || null,
  attempt: process.env.GITHUB_RUN_ATTEMPT || null };

let fail = 0;
const rows = [];
const informational = [];
// 比較ゲート対象: SAMPLES + 両側に揃った EXTRA(EXTRA は昇格時に自動で比較ゲートへ)
for (const id of [...SAMPLES, ...EXTRA_SAMPLES]) {
  const inRoot = rootIds.includes(id), inBeta = betaIds.includes(id);
  const isExtra = EXTRA_SAMPLES.includes(id);
  if (inRoot && inBeta) {
    const m = await measurePaired(rootPage, betaPage, id);
    const limit = ALLOW[id] || THRESH;
    const pass = m.ratio <= limit && !m.nan;
    if (!pass) fail++;
    rows.push({ id, rootMs: +m.rootMs.toFixed(1), betaMs: +m.betaMs.toFixed(1),
      ratio: +m.ratio.toFixed(3), limit, frames: FRAMES_OVERRIDE[id] || FRAMES,
      stepsPerFrameRoot: m.stepsPerFrameRoot, stepsPerFrameBeta: m.stepsPerFrameBeta,
      nRoot: m.nRoot, nBeta: m.nBeta, pass,
      pairs: m.pairs, rawRootMs: m.rawRoot, rawBetaMs: m.rawBeta });
    console.log(`${pass ? 'PASS' : 'FAIL'} perf.${id}  beta/root=${m.ratio.toFixed(3)} (≤${limit}・ペア比[${m.pairs.map((p) => p.ratio.toFixed(3)).join(' ')}]の中央値)  root=${m.rootMs.toFixed(1)}ms beta=${m.betaMs.toFixed(1)}ms${FRAMES_OVERRIDE[id] ? `(${FRAMES_OVERRIDE[id]}frames)` : ''}`);
  } else if (isExtra && (inRoot || inBeta)) {
    const side = inBeta ? 'beta' : 'root';
    const one = await measureSingle(inBeta ? betaPage : rootPage, id);
    informational.push({ id, side, ms: +one.ms.toFixed(1),
      msPerFrame: +(one.ms / (FRAMES_OVERRIDE[id] || FRAMES)).toFixed(2), stepsPerFrame: one.stepsPerFrame, n: one.n,
      raw: one.raw,
      note: `${side === 'beta' ? 'root' : 'beta'}未実装のため${side}単独実測(pass判定なし・ゲート数に含めない)` });
    console.log(`INFO perf.${id}  ${side}=${one.ms.toFixed(1)}ms(${(one.ms / (FRAMES_OVERRIDE[id] || FRAMES)).toFixed(2)}ms/frame・${side === 'beta' ? 'root' : 'beta'}未実装 — 昇格後に比較ゲート化)`);
  } else if (isExtra) {
    console.log(`SKIP perf.${id}(root/betaとも未実装)`);
  } else {
    console.log(`FAIL perf.${id}(比較ゲート対象サンプルが片側にありません — root=${inRoot} beta=${inBeta})`);
    fail++;
  }
}
// ---- 第72便(原仮定者裁定「geoPN=2 性能試験: 進める」/ChatGPT Release レビュー §4.5・P0-2) ----
// geoPN=2 の追加コスト(∇u 解析勾配の O(N²) 集積+w 置換 1PN+輸送3項)の機械ゲート。
// ①💫galaxyGeo2(geoPN=2)⇔🎡galaxyStd(geoPN=0)は**厳密同一の初期配置**なので、同一 beta
//   ページでの交互ペア比 = 統一則のオーバーヘッドそのもの(root 比較ではない — 新モードの絶対増)。
// ②合成円盤の N 掃引(100/200/381/600)で geoPN 0⇔2 の比のスケーリングを informational 記録。
// ゲート: ペア比中央値 ≤ GEO2_THRESH=1.65(較正実測 2026-08-04: **1.475**〔ペア比 1.430〜1.485〕・
// N 掃引 100/200/381/600 でも 1.42〜1.55 で平坦 = 追加コストは同じ O(N²) の定数倍 ≈1.5
// 〔∇u 勾配集積 ~40flops/対〕。マージン ×1.12 は既存 THRESH=1.10 と同水準。超過は geo2 経路の
// 性能回帰とみなす)
const GEO2_THRESH = +(process.env.GEO2_THRESH || 1.65);
let geo2Gate = null;
const geo2Sweep = [];
if (betaIds.includes('galaxyGeo2') && betaIds.includes('galaxyStd')) {
  const pairs2 = [];
  for (let k = 0; k < SETS; k++) {
    const stdFirst = k % 2 === 0;
    let a, b;
    if (stdFirst) { a = await measureSet(betaPage, 'galaxyStd', REPS, FRAMES, WARMUP_FRAMES);
      b = await measureSet(betaPage, 'galaxyGeo2', REPS, FRAMES, WARMUP_FRAMES); }
    else { b = await measureSet(betaPage, 'galaxyGeo2', REPS, FRAMES, WARMUP_FRAMES);
      a = await measureSet(betaPage, 'galaxyStd', REPS, FRAMES, WARMUP_FRAMES); }
    pairs2.push({ order: stdFirst ? 'std→geo2' : 'geo2→std',
      stdMs: +median(a.times).toFixed(1), geo2Ms: +median(b.times).toFixed(1),
      ratio: +(median(b.times) / median(a.times)).toFixed(3) });
  }
  const ratio2 = median(pairs2.map((p) => p.ratio));
  const pass2 = ratio2 <= GEO2_THRESH;
  if (!pass2) fail++;
  geo2Gate = { id: 'geo2-overhead', ratio: +ratio2.toFixed(3), limit: GEO2_THRESH, pairs: pairs2, pass: pass2 };
  console.log(`${pass2 ? 'PASS' : 'FAIL'} perf.geo2-overhead  geo2/std=${ratio2.toFixed(3)} (≤${GEO2_THRESH}・ペア比[${pairs2.map((p) => p.ratio.toFixed(3)).join(' ')}]の中央値・同一初期配置 🎡⇔💫)`);
  // N 掃引(informational — 合成円盤・galaxyStd と同物理)
  const measureCfg = async (geoPN, n) => page_measureCfg(betaPage, geoPN, n);
  const page_measureCfg = (page, geoPN, n) => page.evaluate(([geoPN, n, frames, warm, reps]) => {
    HP.sim.build({ id: 'perfg2', name: 'p', description: 'd', camera: { scale: 400 },
      world: { boundary: 'none', size: 0 }, seed: 20260727,
      physics: { G: 0.8, D0: 1.5, kFrame: 1, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, Kt: 50,
        cLight: 60, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0, geoPN, lambdaPN: 1,
        pnAlpha: 1.5, radiusScale: 1, softening: 3, timeScale: 3 },
      bodies: [
        { type: 'single', rMul: 1.2, m: 2500, x: 0, y: 0, vx: 0, vy: 0, spin: 1.2, pinned: true, radius: 15 },
        { type: 'disk', rMul: 1.2, n, cx: 0, cy: 0, radius: 260, mMin: 0.16, mMax: 0.5,
          spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 2500, vScale: 1.05, direction: 1,
          bulkVx: 0, bulkVy: 0 }] });
    const S = HP.sim;
    const spf = Math.max(1, Math.min(24, Math.round(2 * (S.params.timeScale || 1))));
    for (let k = 0; k < spf * warm; k++) S.step(0.016);
    const times = [];
    for (let r = 0; r < reps; r++) {
      const t0 = performance.now();
      for (let f = 0; f < frames; f++) for (let s = 0; s < spf; s++) S.step(0.016);
      times.push(performance.now() - t0);
    }
    return { ms: times.sort((x, y) => x - y)[Math.floor(times.length / 2)], nan: S.hasNaN() };
  }, [geoPN, n, FRAMES, WARMUP_FRAMES, REPS]);
  for (const n of [100, 200, 381, 600]) {
    const g0 = await measureCfg(0, n), g2 = await measureCfg(2, n);
    geo2Sweep.push({ n, geo0Ms: +g0.ms.toFixed(1), geo2Ms: +g2.ms.toFixed(1),
      ratio: +(g2.ms / g0.ms).toFixed(3), nan: g0.nan || g2.nan });
    console.log(`INFO perf.geo2-sweep N=${n}  geo0=${g0.ms.toFixed(1)}ms geo2=${g2.ms.toFixed(1)}ms 比=${(g2.ms / g0.ms).toFixed(3)}`);
  }
} else {
  console.log('SKIP perf.geo2-overhead(galaxyGeo2/galaxyStd が beta に揃っていない)');
}
await browser.close();

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'perf-results.json'), JSON.stringify({
  when: new Date().toISOString(), threshold: THRESH,
  reps: REPS, frames: FRAMES, sets: SETS, env,
  // results: 比較ゲート対象(pass/fail 判定あり。ratio はペア比の中央値。
  //          pairs に各ペアの順序・両側 ms・比、rawRoot/BetaMs に全反復生値を記録)
  // informational: 片側にしかプリセットが無いための参考計測(pass判定なし。ゲート対象外)
  // geo2: 第72便 — geoPN=2 のオーバーヘッドゲート(🎡⇔💫 同一初期配置ペア比)と N 掃引
  results: rows, informational, geo2: { gate: geo2Gate, sweep: geo2Sweep },
}, null, 2));
console.log(`perf gate: ${rows.length - fail}/${rows.length} PASS → tests/out/perf-results.json`
  + (informational.length ? ` (+${informational.length} informational)` : ''));
process.exit(fail ? 1 : 0);

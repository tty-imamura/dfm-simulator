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
// - 第99便: 第97便の相似変換(k=30/旧c₀)で「変換維持」サンプルは timeScale が ÷k され、
//   beta の steps/frame が root の 1/k 倍(galaxy/galaxyGeo2/bhCore ×2、nebula系/starSeed ×4/3)。
//   1フレームの物理仕事が意図的に増えたため、壁時計比が k⁻¹ 倍に膨らみ CI で 8/20 FAIL した
//   (run 31466921121 — 1步あたりコストは不変)。対処: **世代差があるサンプルのみ** ペア比を
//   steps/frame 比で正規化する(= 1步あたりコスト比で判定)。世代差の検出は qa.mjs と同じ
//   「beta 宣言 cLight===30 かつ root 宣言 cLight≠30」。root へ v1.39 が昇格して両側の宣言が
//   揃えば正規化は自動で無効化され、従来の厳密壁時計比ゲートへ戻る(ALLOW の恒久緩和はしない)。
//   同世代内の timeScale 由来の計算量増(第25次レビュー原因1)は引き続き生の比で検出される。
// - 第160便: **再トス機構**(下部 RETOSS 節を参照)。FAIL したサンプルだけ fresh pages で1回だけ
//   再測定し、その結果で判定を置き換える。**閾値 1.10・ペア比中央値の判定式・FRAMES_OVERRIDE・
//   測定手順は一切変更しない**(緩和ではない — 同一状態で2回連続 FAIL が必要になるだけ)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
// 第251便b(第43報 原仮定者指示「🌠merger は廃止」): merger を **SAMPLES(比較ゲート)から
// EXTRA_SAMPLES へ移した**。beta から消えた一方で root(v1.43)はまだ持つので、交互ペア測定が
// 組めない。EXTRA の「片側にしかプリセットが無い場合は informational(pass 判定なし・ゲート数に
// 含めない)」という既存の流儀にそのまま乗せる — 昇格で root からも消えれば自動で SKIP になる
// (EXTRA の逆向き〔beta 先行 → 昇格でゲート化〕と同じ仕組みを、廃止方向にそのまま使う)。
// 走査順は不変(merger は SAMPLES の 3 番目にあったが、SAMPLES→EXTRA の連結順で走るため
// 位置が変わる。第39便 39B の「♨️convection を通した後」の並びは SAMPLES 内で保たれる)。
const SAMPLES = ['galaxy', 'darkrotor', 'convection', 'counterring', 'saturnLayered'];
// 第36便 Wave A(P2-2・ChatGPT差分検証レビュー): echo/freebox(第35便で追加)をベンチ対象へ。
// root(旧版)にはまだ存在しないため feature-detect し、片側にしかプリセットが無い場合は
// 「beta 単独の実測 ms を informational として記録する(pass判定なし・SAMPLES の 6/6 ゲート数
// には含めない)」。root へ第35便が昇格し両側に揃った時点で自動的に比較ゲートへ昇格する。
const EXTRA_SAMPLES = ['merger',   // 第251便b: beta で廃止 — root にある間は informational(上記)
  'echo', 'freebox',
  // 第60便: E14″ 創発一本化 — 旧サンプル(melt/freeze/meltcycle/boil/chain/lattice)は廃止。
  // root には未昇格のため informational 計測(昇格時に自動で比較ゲートへ)
  'emergent', 'emergent2', 'chain2',
  // 第73便(v1.36.0 昇格): v1.36 線の新サンプル — 昇格により root にも揃い自動で比較ゲート化
  'galaxyStd', 'galaxyGeo2', 'chaincycle',
  // 第74〜78便: v1.37 線の新サンプル(ディスク/バルジ381体・ローター星雲98体・重殻98体・
  // 双極83体・星の種3体・DFM版BH 321体)— **第79便 v1.37.0 昇格により root にも揃い、
  // ここから自動で比較ゲートへ昇格する**
  'galaxyDB', 'nebulaRotor',
  'nebulaShell', 'nebulaBipolar',
  // 第77便: 星の種ローター3体(コアv2 — 軽量だが v2 パスの常時計測として)
  'starSeed',
  // 第86便(v1.38.0 昇格): 上記 v1.37 線の追加分はすでに両側に揃っている。本便の昇格でも
  // 仕組みは同じ — root←beta が byte 同一になるため、EXTRA の片側計測(informational)は
  // 昇格の瞬間に自動でペア比較ゲートへ変わる(新規に足した id は次の beta サイクルで
  // informational から始まり、次の昇格でゲート化される)

  // 第78便: DFM版BH 5層321体(コアv2+降着円盤+恒星ディスク)
  'bhCore',
  // 第100便C: molecular/beaker 拡充 — 🛷摩擦熱(201体)・☕冷めるお茶(220体・伝熱壁)。
  // root 未昇格のため informational から開始(昇格で自動比較ゲート化)
  'frictionHeat', 'cooling'];
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
// 第79便(v1.37.0 昇格): starSeed も同じ扱いにする。3体しかないため既定 60frames の計測は
// **240步 ≈ 0.5ms** = タイマのノイズフロア以下で、しかも JIT が温まりきる前に測り終わる
// (実測: 温まった定常は約 2.2µs/步 なのに、60frames 計測では 0.6ms〔root〕/4.0ms〔beta〕と
// 桁で暴れ、byte 同一のはずのペア比が 2.600 になった)。30000frames ≈ 120000步 ≈ 260ms まで
// 引き上げてノイズフロアから出す。発散しないことは tests/probe-perf-floor.mjs で確認済み
// (60000frames でも NaN なし・コアΩは 8.3e3 で頭打ち)。
// 第77便まで informational だったので顕在化せず、昇格で比較ゲート化して初めて露見した
// 第101便(CI 実測 41c7a3f: perf.merger 1.106 FAIL — ペア比[1.169 1.106 1.003]。同一コードの
// 直前 run は PASS = フレーク): merger は 182粒・60frames ≈ 190ms(CI ランナー)の短時間計測で、
// ページ別 JIT・共有ランナー負荷のジッタが閾値 1.10 に対し大きい(手元でも 0.971〜1.057 と振れる)。
// echo/starSeed と同じ対処 — 計測時間をノイズフロアから引き上げる(60→240frames ≈ 0.75〜1.7s/rep)。
// 判定条件・ペア比中央値の式は不変
// 第129便(CI 実測 d63913e: perf.freebox 1.190 FAIL — ペア比[1.267 1.190 0.997]で散乱・
// 絶対値は beta 34.3ms < root 40.9ms と逆転・手元2回も[0.999 1.134 1.002]/[1.036 0.917 0.952]と
// 振れつつ PASS = 回帰なしの純ノイズ): freebox は 51粒・60frames ≈ 35〜60ms のマイクロベンチで
// echo(第63便)・merger(第101便)と同じノイズフロア帯。同系の対処 — 計測時間を引き上げる
// (60→480frames ≈ 280〜330ms/rep)。判定条件・ペア比中央値の式は不変
// 第144便(v1.41.0 昇格に同梱): 2コア CI×小サンプル(60フレーム・180ms/60ms 級)のノイズフロアが
// ~1.13 署名(frictionHeat・第135便以降3回)と散在ペア(nebulaRotor)を作るため、計測時間を引き上げる。
// 判定条件・閾値 1.10・走査順は不変
const FRAMES_OVERRIDE = { echo: 720, starSeed: 30000, merger: 240, freebox: 480,
  frictionHeat: 480, nebulaRotor: 480 };
// 過去の ALLOW 撤去履歴(darkrotor/convection/saturnLayered)と 40C の粒子数削減の実測記録は
// git 履歴(第61便以前の本ファイル冒頭コメント)を参照。
const REPS = 2, FRAMES = 60, WARMUP_FRAMES = 20, SETS = 3;

// ---- RETOSS(第160便: 再トス機構) ----
// 経緯: perf.frictionHeat だけが「セッション単位の二値状態」(beta/root ≈1.13〜1.14 で3ペアとも
// 揃い、その run 全体で一貫する)を第129/144/149/155便に反復して示した。第144便の FRAMES 引き上げで
// ペア内のばらつきは収束済みで、残るのは**セッション(ページ)ごとの当たり外れ**である。第155便で
// 「同一 sha の並行 run では perf が一発 green」を実測し、原因が 2コア CI ランナーの JIT/接触状態
// (= セッションを引き直せば消える環境要因)であることが直接裏付けられた。手動 rerun はワークフロー
// 全体の再実行になり高コスト。
// 機構: **FAIL したサンプルのみ**、fresh pages(root/beta のページを新規に開き直す = セッション状態の
// 引き直し)で **1回だけ** 再測定し、その結果で当該サンプルの判定を置き換える(サンプルあたり最大1回・
// 再測定も FAIL ならそのまま FAIL 確定)。**閾値・判定式・FRAMES_OVERRIDE・測定手順・サンプル走査順は
// 不変**。コード起因の恒常的劣化は fresh pages でも再現するため検出力は保たれる。
// 常駐ペア(rootPage/betaPage)は閉じずにそのまま残す — 再トスは専用の一時ページ対で行うので、
// 後続サンプルの計測条件(2ページ常駐・走査順による JIT 型フィードバック〔第39便 39B〕)は不変。
// 開発用強制フック: env PERF_FORCE_RETOSS=<サンプル名>(カンマ区切り可)で当該サンプルの初回測定を
// 人工的に FAIL 扱いにし、再トス経路を必ず1回踏ませる(経路検証専用 — 判定式・実測値には一切影響
// しない。JSON に forcedRetoss:true を記録)。CI では未設定。
const FORCE_RETOSS = new Set(String(process.env.PERF_FORCE_RETOSS || '')
  .split(',').map((s) => s.trim()).filter(Boolean));
// 第259便d: 開発用フック PERF_ABJIT_ONLY=1 —— **末尾の A/B JIT probe だけ**を回す
// (比較ゲート本体と geo2 ゲートを飛ばす)。4 コア機で 4 つの worktree が同時に走る状況では
// perf の通しを回せないので、新項目だけを単体で確かめるための口である。CI では未設定。
// **判定式・閾値・測定手順は 1 bit も変えない**。結果は別ファイル(perf-abjit-only.json)へ書き、
// コミット対象の perf-results.json を**上書きしない**。
const ABJIT_ONLY = process.env.PERF_ABJIT_ONLY === '1';

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
// 第129便(CI 実測 8f3165b: perf.frictionHeat 1.139/1.147 FAIL ×2 — ペア比が3本とも
// 1.13〜1.15 で揃う一方、手元は 0.996、cooling は逆に beta が 9% 速いという非対称):
// 原因はアプリの**起動既定サンプルの変更**(🪐 saturn → 💿 saturnRingRealKF1)。newPage() は
// ページごとに独立コンテキストなので、root は 🪐(Float32・241体)で、beta は 💿
// (stateCarry:"double" の Float64 経路・qLock・127体)で起動し、常駐ページの JIT 型
// フィードバックが**ページ間で非対称**になる。本ゲートの「ページ常駐+サンプル走査順を
// 計測条件として固定する」哲学(第39便 39B)の暗黙の前提「両ページは同じサンプルで起動する」が
// 崩れ、接触多発の frictionHeat だけが CI の 2コア環境で ~14% 劣化した(コードの step 経路は
// 第129便で無変更 — 偽の回帰シグナル)。対処: **起動プリセットを両ページとも 'saturn' へ明示固定**
// (hp_last_preset を事前注入)。これは従来までの計測条件(両側 🪐 起動)をアプリの UX 既定から
// 独立に**保存**する測定環境修正であり、判定条件・閾値・サンプル走査順は不変(第62便 交互ペア化・
// 第63便 echo FRAMES・第101便 merger FRAMES と同系の「計測の公平性を直す」対処。ALLOW 緩和はしない)
const BOOT_PRESET = 'saturn';
const openPage = async (target) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript((pid) => { try { localStorage.setItem('hp_last_preset', pid); } catch (_) {} }, BOOT_PRESET);
  await page.goto('file://' + path.join(ROOT, target));
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
};
// 第160便: 再トス1回分の測定 — root/beta を新しいページで開き直し(= セッション状態の引き直し)、
// 同じ交互ペア測定(第62便方式・同じ FRAMES/REPS/SETS)を1回だけ行って一時ページを閉じる。
const measurePairedFresh = async (id) => {
  const freshRoot = await openPage('index.html');
  const freshBeta = await openPage(path.join('beta', 'index.html'));
  try { return await measurePaired(freshRoot, freshBeta, id); }
  finally { await freshRoot.close(); await freshBeta.close(); }
};
console.log('perf gate: root/beta の2ページを常駐させ交互ペア測定(第62便方式)…');
const rootPage = await openPage('index.html');
const betaPage = await openPage(path.join('beta', 'index.html'));
const rootIds = await rootPage.evaluate(() => HP.allPresets().map((p) => String(p.id)));
const betaIds = await betaPage.evaluate(() => HP.allPresets().map((p) => String(p.id)));
// 第99便: プリセット宣言値(cLight/timeScale)を両側から取得 — 世代差検出用(qa.mjs と同方式)
const getDecl = (page, id) => page.evaluate((pid) => {
  const p = HP.allPresets().find((q) => String(q.id) === pid);
  return p ? { cLight: p.physics?.cLight ?? null, timeScale: p.physics?.timeScale ?? 1 } : null;
}, id);
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
for (const id of (ABJIT_ONLY ? [] : [...SAMPLES, ...EXTRA_SAMPLES])) {
  const inRoot = rootIds.includes(id), inBeta = betaIds.includes(id);
  const isExtra = EXTRA_SAMPLES.includes(id);
  if (inRoot && inBeta) {
    // 第99便: 世代差(beta=第96便B変換後 c₀=30・root=旧c)があり steps/frame が乖離した
    // サンプルは、1步あたりコスト比で判定する(冒頭コメント参照)。同世代なら tsNorm=1。
    const declR = await getDecl(rootPage, id), declB = await getDecl(betaPage, id);
    const genGap = declB?.cLight === 30 && declR?.cLight !== 30;
    const limit = ALLOW[id] || THRESH;
    // 判定式は第99便のまま — 初回測定にも再トス後の再測定にも同一の式・同一の閾値を適用する
    const judge = (m) => {
      const tsNorm = (genGap && m.stepsPerFrameRoot !== m.stepsPerFrameBeta)
        ? m.stepsPerFrameBeta / m.stepsPerFrameRoot : 1;
      const normRatio = +(m.ratio / tsNorm).toFixed(3);
      return { tsNorm, normRatio, pass: normRatio <= limit && !m.nan };
    };
    // PASS/FAIL 行の様式(第62便以来の形式。tag は再トス時のみ「(初回)」「(再トス後・最終)」)
    const logRow = (m, v, verdict, tag) => console.log(`${verdict ? 'PASS' : 'FAIL'} perf.${id}${tag}  beta/root=${v.normRatio.toFixed(3)} (≤${limit}${v.tsNorm !== 1 ? `・生比${m.ratio.toFixed(3)}を steps/frame 比${m.stepsPerFrameBeta}/${m.stepsPerFrameRoot} で正規化〔世代差〕` : ''}・ペア比[${m.pairs.map((p) => p.ratio.toFixed(3)).join(' ')}]の中央値)  root=${m.rootMs.toFixed(1)}ms beta=${m.betaMs.toFixed(1)}ms${FRAMES_OVERRIDE[id] ? `(${FRAMES_OVERRIDE[id]}frames)` : ''}`);
    let m = await measurePaired(rootPage, betaPage, id);
    let v = judge(m);
    // 第160便: FAIL したサンプルのみ fresh pages で1回だけ再トス(RETOSS 節参照)。
    // PASS のサンプルはここを素通りするので、green パスの挙動・所要時間は従来と同一。
    const forced = FORCE_RETOSS.has(id);
    let retossRec = null;
    if (!v.pass || forced) {
      const m0 = m, v0 = v;
      logRow(m0, v0, false, forced && v0.pass
        ? '(初回・人工FAIL扱い〔PERF_FORCE_RETOSS〕・実測判定=PASS)' : '(初回)');
      console.log(`RETOSS perf.${id}  → fresh pages(root/beta を開き直し)で1回だけ再測定します`
        + `(サンプルあたり最大1回・閾値/判定式/測定手順は不変)`);
      m = await measurePairedFresh(id);
      v = judge(m);
      logRow(m, v, v.pass, '(再トス後・最終)');
      retossRec = { retossed: true, ...(forced ? { forcedRetoss: true } : {}),
        firstRatio: +m0.ratio.toFixed(3), firstNormRatio: v0.normRatio, firstPass: v0.pass,
        firstRootMs: +m0.rootMs.toFixed(1), firstBetaMs: +m0.betaMs.toFixed(1),
        firstPairs: m0.pairs, firstRawRootMs: m0.rawRoot, firstRawBetaMs: m0.rawBeta,
        finalRatio: v.normRatio, finalPass: v.pass,
        retossNote: `初回 FAIL${forced && v0.pass ? '(PERF_FORCE_RETOSS による人工FAIL扱い — 実測は PASS)' : ''}のため、`
          + 'fresh pages で1回だけ再測定し、その結果で判定を置き換えた(第160便・閾値/判定式は不変)' };
    } else {
      logRow(m, v, true, '');
    }
    if (!v.pass) fail++;
    const row = { id, rootMs: +m.rootMs.toFixed(1), betaMs: +m.betaMs.toFixed(1),
      ratio: +m.ratio.toFixed(3), tsNorm: +v.tsNorm.toFixed(3), normRatio: v.normRatio, genGap,
      limit, frames: FRAMES_OVERRIDE[id] || FRAMES,
      stepsPerFrameRoot: m.stepsPerFrameRoot, stepsPerFrameBeta: m.stepsPerFrameBeta,
      nRoot: m.nRoot, nBeta: m.nBeta, pass: v.pass,
      pairs: m.pairs, rawRootMs: m.rawRoot, rawBetaMs: m.rawBeta };
    if (retossRec) Object.assign(row, retossRec);
    rows.push(row);
  } else if (isExtra && (inRoot || inBeta)) {
    const side = inBeta ? 'beta' : 'root';
    const one = await measureSingle(inBeta ? betaPage : rootPage, id);
    informational.push({ id, side, ms: +one.ms.toFixed(1),
      msPerFrame: +(one.ms / (FRAMES_OVERRIDE[id] || FRAMES)).toFixed(2), stepsPerFrame: one.stepsPerFrame, n: one.n,
      raw: one.raw,
      // 第251便b: 片側計測の理由は 2 方向ある — beta 先行(昇格待ち)と、beta で廃止(root 昇格待ち)。
      note: `${side === 'beta' ? 'root に無い(beta 先行 — 昇格で比較ゲート化)' : 'beta に無い(beta で廃止 — root 昇格で SKIP になる)'}ため ${side} 単独実測(pass判定なし・ゲート数に含めない)` });
    console.log(`INFO perf.${id}  ${side}=${one.ms.toFixed(1)}ms(${(one.ms / (FRAMES_OVERRIDE[id] || FRAMES)).toFixed(2)}ms/frame・${side === 'beta' ? 'root に無い — 昇格後に比較ゲート化' : 'beta で廃止 — root 昇格で SKIP'})`);
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
// 第99便: 第97便で 🎡galaxyStd は変換巻き戻し(ts=3)・💫galaxyGeo2 は変換維持(ts=6)となり、
// 両者の steps/frame が 6⇔12 に乖離した(壁時計比が geo2 コスト×2 に膨張 → CI 2.783 FAIL)。
// 本ゲートの目的は「geoPN=2 経路の 1步あたり追加コスト」なので、ペア比を各側の steps/frame で
// 正規化して判定する(恒久形 — 較正値 1.475 は ts が揃っていた時期の実測なのでそのまま比較可能)。
// 第160便: **geo2 系には再トスを適用しない**。理由は2つ — ①perf.geo2-overhead は 🎡galaxyStd ⇔
// 💫galaxyGeo2 を**同一 beta ページ内**で交互ペア測定する自己比較なので、再トスが対象とする不安定要因
// (root ページと beta ページで JIT 型フィードバック・接触状態が非対称になる「セッション単位の当たり
// 外れ」— 第129/144/149/155便)は構造上発生しない(両側が同一セッションを共有する)。実際 FAIL 履歴も
// 世代差起因(第99便・steps/frame 正規化で恒久解決)であってセッション起因のフレークではない。
// ②geo2-sweep は informational(pass 判定なし)なので再測定の対象になる判定自体が無い。
const GEO2_THRESH = +(process.env.GEO2_THRESH || 1.65);
let geo2Gate = null;
const geo2Sweep = [];
if (!ABJIT_ONLY && betaIds.includes('galaxyGeo2') && betaIds.includes('galaxyStd')) {
  const pairs2 = [];
  for (let k = 0; k < SETS; k++) {
    const stdFirst = k % 2 === 0;
    let a, b;
    if (stdFirst) { a = await measureSet(betaPage, 'galaxyStd', REPS, FRAMES, WARMUP_FRAMES);
      b = await measureSet(betaPage, 'galaxyGeo2', REPS, FRAMES, WARMUP_FRAMES); }
    else { b = await measureSet(betaPage, 'galaxyGeo2', REPS, FRAMES, WARMUP_FRAMES);
      a = await measureSet(betaPage, 'galaxyStd', REPS, FRAMES, WARMUP_FRAMES); }
    // 第99便: 1步あたりコスト比で記録(steps/frame 正規化 — 上の恒久形コメント参照)
    pairs2.push({ order: stdFirst ? 'std→geo2' : 'geo2→std',
      stdMs: +median(a.times).toFixed(1), geo2Ms: +median(b.times).toFixed(1),
      spfStd: a.stepsPerFrame, spfGeo2: b.stepsPerFrame,
      rawRatio: +(median(b.times) / median(a.times)).toFixed(3),
      ratio: +((median(b.times) / b.stepsPerFrame) / (median(a.times) / a.stepsPerFrame)).toFixed(3) });
  }
  const ratio2 = median(pairs2.map((p) => p.ratio));
  const pass2 = ratio2 <= GEO2_THRESH;
  if (!pass2) fail++;
  geo2Gate = { id: 'geo2-overhead', ratio: +ratio2.toFixed(3), limit: GEO2_THRESH, pairs: pairs2, pass: pass2,
    note: '比は steps/frame 正規化済み(1步あたりコスト比 — 第99便)' };
  console.log(`${pass2 ? 'PASS' : 'FAIL'} perf.geo2-overhead  geo2/std=${ratio2.toFixed(3)} (≤${GEO2_THRESH}・1步あたりコスト比〔spf ${pairs2[0].spfGeo2}/${pairs2[0].spfStd} 正規化〕・ペア比[${pairs2.map((p) => p.ratio.toFixed(3)).join(' ')}]の中央値・同一初期配置 🎡⇔💫)`);
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
  console.log(ABJIT_ONLY ? 'SKIP perf.geo2-overhead(PERF_ABJIT_ONLY=1 — A/B JIT probe だけを回す)'
    : 'SKIP perf.geo2-overhead(galaxyGeo2/galaxyStd が beta に揃っていない)');
}
// ---- 第259便d(第51報 W4)→ **第260便d(第52報 W4)で 2 系統へ**: A/B JIT probe(**informational**) ----
// 〔第258便e〕の JIT 崖を **本ゲートの本体は検出できない**。理由は構造的で、上の測定は
// 「1 ページ・1 プリセット・素の連続走行」なので、`S._core` が一度 deopt する経路
// (A/B で 2 個目の sim を作る)を通らない —— 素の走行では ×1.5 にしかならず、
// A/B 経路でだけ 15〜20 倍になった(〔第258便e〕の実測)。
// ワークロードは器 `tests/exp-w258e-jitprobe.mjs` と**同じ**である
// (`loadPreset` → `abStart('kFrame',0)` → 2 つの sim を交互に進める)。
//
// **第260便d: 系統を 2 つにした**(〔第259便d〕が残した決断事項「FAIL へ上げる基準値の決め方」への処置)。
//
//  (a) **自己対照(同一 html の 2 ページ)** —— `arm:"self-control"`
//      同じ html を**新しいページ 2 枚**で開き、片方で**素の走行**(1 sim・deopt を通さない)、
//      もう片方で **A/B 走行**(2 sim・deopt を通す)を測り、比 = A/B ÷ 素 を出す。
//      **期待は 1 付近**である(崖が無ければ 1 步のコストは経路で変わらない)。
//      崖があると素は ×1.5・A/B は ×15〜20 なので、**比は 10 倍級へ跳ねる**(〔第258便e〕の表から)。
//      **基準値が要らない**のがこの系統の要点である —— 同じ html・同じ機器・同じ run の中で閉じるので、
//      機種依存も世代差も入らず、**CI でそのまま再現できる**。
//      ページは**プリセットごとに開き直す**(同じページで 2 本目を測ると、2 度目の build が
//      deopt を通してしまい「素の走行」でなくなる)。
//
//  (b) **凍結基準 html 対 候補** —— `arm:"cross-html"`
//      両ページに共通して効く遅化(A/B でも素でも同じだけ遅くなる変更)は (a) では見えない。
//      そこで**別の html を基準**にして候補 beta の A/B ms/步 を割る。基準の置き方は 2 つあり、
//      **CI で再現できるのは後者である**:
//        ・**凍結 html ファイル**(`PERF_ABJIT_BASELINE` か `tests/perf-baseline/index.html`)…
//          `git show <SHA>:beta/index.html` で作れるが、**CI では再現できない**。
//          CI の checkout は shallow(fetch-depth 1)で、この履歴は 423 MB あるため
//          `fetch-depth: 0` を perf ジョブに入れるのは割に合わない。3.7 MB の html を便ごとに
//          コミットして凍結基準にするのも採らない(リポジトリが便ごとに 3.7 MB 増える)。
//          → **手元・調査用の opt-in** とする(あれば使う)。
//        ・**root(`index.html`)へのフォールバック**… root は**昇格したときしか動かない凍結内容**で、
//          チェックアウトに必ず在る。**CI の既定はこちら**である。
//          root は別世代なので比は 1.00 ではない —— 見るのは絶対値ではなく**比の急変**である。
//      どちらを使ったかは `baselineKind` に必ず書く(`frozen-file` / `root-fallback`)。
//
// **第262便d(第54報 W4)で FAIL 化した**(統括が設定した検証仮説 (8)・〔第261便d〕が宣言した基準の適用):
//   ・(a) 自己対照 **>4 = FAIL**(基準値が要らないので機種に依らない。WARN は 3)。
//   ・(b) 凍結基準 html 対 候補 **>1.5 = FAIL**、ただし **`frozen-file` を取得できたときだけ**。
//   ・**`root-fallback` は凍結扱いしない**(root は昇格したときしか動かないので「凍結基準」ではない)
//     —— root-fallback の (b) は **informational のまま**で、WARN は出すが fail を増やさない。
//     **取得失敗を root-fallback の合格に置き換えない**(取れなかったことは「通った」ではない)。
// 判定の別は各行の `judgement`(`gate` / `informational`)に必ず書く。
// (QA `lint.perfAbJit` が基準値と「gate の行だけが fail を増やすこと」を機械で確かめる)。
// 所要は 2 プリセット × 4 ページ ≈ 40 秒(崖が無いとき)。崖があるときのために 1 セル 30 秒で打ち切る。
const ABJIT_PRESETS = String(process.env.PERF_ABJIT_PRESETS || 'galaxyGeo2,bhCore').split(',').map((s) => s.trim()).filter(Boolean);
const ABJIT_WARN = +(process.env.PERF_ABJIT_WARN || 1.5);
// (a) 自己対照の WARN。期待 1 付近・崖なら 10 倍級なので、その間に置く。
const ABJIT_SELF_WARN = +(process.env.PERF_ABJIT_SELF_WARN || 3);
// 第262便d: **FAIL 化のしきい値**(〔第261便d〕が QA に宣言した値をそのまま適用する)。
//   自己対照 4 は観測帯(第260便d 0.72/0.81・第261便d 0.75/0.86)の 5 倍近く上・
//   雑音床(同じファイルどうしで ±5%)の遥か上にある。**帯そのものは合格条件にしない**。
const ABJIT_SELF_FAIL = +(process.env.PERF_ABJIT_SELF_FAIL || 4);
const ABJIT_CROSS_FAIL = +(process.env.PERF_ABJIT_CROSS_FAIL || 1.5);
// **root-fallback は凍結扱いしない** —— (b) が FAIL を出せるのは frozen-file を取得できたときだけ。
const ABJIT_ROOT_FALLBACK_IS_FROZEN = false;
const ABJIT = { warm: 100, chunk: 100, reps: 3, budgetMs: 30000 };
// 前回値(記録だけ — 判定には使わない)。この時点ではまだ上書きしていない
let abJitPrev = null;
try {
  const prevJson = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'perf-results.json'), 'utf8'));
  abJitPrev = (prevJson && prevJson.abJit && Array.isArray(prevJson.abJit.rows)) ? prevJson.abJit.rows : null;
} catch { abJitPrev = null; }
// 1 セル = 1 ページ・1 プリセット。mode:"ab" は 2 個目の sim を作る(deopt を通す)・"plain" は作らない。
const abJitCell = (page, pid, mode) => page.evaluate(([pid, mode, warm, chunk, reps, budget]) => {
  if (!HP.allPresets().some((p) => p.id === pid)) return { missing: true };
  HP.loadPreset(pid, false);
  const sA = HP.sim;
  let sB = null;
  if (mode === 'ab') { HP.abStart('kFrame', 0); sB = HP.ab().simB; }   // ← 2 個目の sim(deopt 経路)
  const sims = sB ? [sA, sB] : [sA];
  const one = () => { for (const s of sims) s.step(0.016); };
  for (let i = 0; i < warm; i++) one();
  const per = [];
  const t00 = performance.now();
  for (let r = 0; r < reps && (performance.now() - t00) < budget; r++) {
    const t0 = performance.now();
    for (let i = 0; i < chunk; i++) one();
    per.push((performance.now() - t0) / (chunk * sims.length));
  }
  const sorted = per.slice().sort((a, b) => a - b);
  const nan = sA.hasNaN() || (sB ? sB.hasNaN() : false);
  if (sB) HP.abStop();
  return { n: sA.n, sims: sims.length, reps: per.length, per: per.map((v) => +v.toFixed(4)),
    msPerStep: sorted.length ? sorted[Math.floor(sorted.length / 2)] : null, nan, mode };
}, [pid, mode, ABJIT.warm, ABJIT.chunk, ABJIT.reps, ABJIT.budgetMs]);
// **プリセットごとに新しいページで測る**(同じページで 2 本目を測ると 2 度目の build が
// deopt を通すので「素の走行」ではなくなる)。
const abJitFreshCell = async (target, pid, mode) => {
  const page = await openPage(target);
  try { return await abJitCell(page, pid, mode); }
  finally { await page.close(); }
};
// (b) の基準 html を決める(**決め方そのものを JSON に残す**)
const abJitBaseline = (() => {
  const envPath = process.env.PERF_ABJIT_BASELINE || '';
  const cand = envPath ? [envPath] : [path.join('tests', 'perf-baseline', 'index.html')];
  for (const c of cand) {
    const abs = path.isAbsolute(c) ? c : path.join(ROOT, c);
    if (fs.existsSync(abs)) return { target: path.relative(ROOT, abs), kind: 'frozen-file',
      note: '凍結 html(固定 SHA の beta/index.html を取り出したもの)。**CI では再現できない**ので opt-in である。' };
  }
  return { target: 'index.html', kind: 'root-fallback',
    note: 'root(`index.html`)は昇格したときしか動かない凍結内容で、チェックアウトに必ず在る。'
      + '**CI の既定はこちら**。root は別世代なので比は 1.00 ではない —— 見るのは比の急変である。' };
})();
const abJitRows = [];
for (const pid of ABJIT_PRESETS) {
  // (a) 自己対照: 同一 html(beta)の 2 ページ —— 素 と A/B
  const plain = await abJitFreshCell(path.join('beta', 'index.html'), pid, 'plain');
  const ab = await abJitFreshCell(path.join('beta', 'index.html'), pid, 'ab');
  if (plain.missing || ab.missing || !plain.msPerStep || !ab.msPerStep) {
    console.log(`SKIP perf.abJit.self.${pid}(beta に無い、または測れなかった)`);
  } else {
    const ratio = ab.msPerStep / plain.msPerStep;
    const warn = ratio > ABJIT_SELF_WARN;
    // 第262便d: **(a) は基準値が要らないので常に gate である**(>4 で FAIL)
    const failed = ratio > ABJIT_SELF_FAIL;
    if (failed) fail++;
    const prev = (abJitPrev || []).find((z) => z.id === pid && z.arm === 'self-control') || null;
    abJitRows.push({ id: pid, arm: 'self-control', msPerStep: +ab.msPerStep.toFixed(4),
      baseRef: +plain.msPerStep.toFixed(4), ratio: +ratio.toFixed(3), warn, warnRatio: ABJIT_SELF_WARN,
      failed, failRatio: ABJIT_SELF_FAIL,
      baselineKind: 'same-html-2pages', baseRefKind: 'same-html-plain-run',
      expectedRatio: 1, cliffRatioRef: '10 倍級(〔第258便e〕: 素 ×1.5 対 A/B ×15〜20)',
      nBeta: ab.n, sims: ab.sims, reps: ab.reps, perAb: ab.per, perPlain: plain.per,
      nan: ab.nan || plain.nan, prev: prev ? { ratio: prev.ratio } : null,
      judgement: 'gate' });
    console.log(`${failed ? 'FAIL' : warn ? 'WARN' : 'INFO'} perf.abJit.self.${pid}  A/B=${ab.msPerStep.toFixed(3)}ms/步`
      + ` 素=${plain.msPerStep.toFixed(3)}ms/步 比=${ratio.toFixed(3)}`
      + `(同一 html の 2 ページ自己対照・期待 1 付近・崖なら 10 倍級)`
      + (prev ? ` 前回 比=${prev.ratio}` : '')
      + (failed ? `  ← **${ABJIT_SELF_FAIL}× 超 = FAIL**(第262便d で FAIL 化): S._core の JIT 崖(〔第258便e〕)`
        : warn ? `  ← **${ABJIT_SELF_WARN}× 超**: S._core の JIT 崖(〔第258便e〕)を疑う` : ''));
  }
  // (b) 凍結基準 html 対 候補(両方とも A/B 走行で測る)
  const cand = await abJitFreshCell(path.join('beta', 'index.html'), pid, 'ab');
  const base = await abJitFreshCell(abJitBaseline.target, pid, 'ab');
  if (cand.missing || base.missing || !cand.msPerStep || !base.msPerStep) {
    console.log(`SKIP perf.abJit.cross.${pid}(基準 ${abJitBaseline.target} と beta のどちらかに無い、または測れなかった)`);
    continue;
  }
  const ratio = cand.msPerStep / base.msPerStep;
  const prev = (abJitPrev || []).find((z) => z.id === pid && z.arm === 'cross-html') || null;
  const warn = ratio > ABJIT_WARN;
  // 第262便d: **frozen-file のときだけ gate**。root-fallback は凍結扱いしない(informational)。
  const crossIsGate = (abJitBaseline.kind === 'frozen-file')
    || (abJitBaseline.kind === 'root-fallback' && ABJIT_ROOT_FALLBACK_IS_FROZEN);
  const failed = crossIsGate && ratio > ABJIT_CROSS_FAIL;
  if (failed) fail++;
  abJitRows.push({ id: pid, arm: 'cross-html', msPerStep: +cand.msPerStep.toFixed(4),
    baseRef: +base.msPerStep.toFixed(4), ratio: +ratio.toFixed(3), warn, warnRatio: ABJIT_WARN,
    failed, failRatio: crossIsGate ? ABJIT_CROSS_FAIL : null,
    rootFallbackIsFrozen: ABJIT_ROOT_FALLBACK_IS_FROZEN,
    baselineKind: abJitBaseline.kind, baselineTarget: abJitBaseline.target,
    baseRefKind: abJitBaseline.kind === 'frozen-file' ? 'frozen-html' : 'same-run-root',
    nBeta: cand.n, nBase: base.n, sims: cand.sims, reps: cand.reps,
    perBeta: cand.per, perBase: base.per, nan: cand.nan || base.nan,
    prev: prev ? { msPerStep: prev.msPerStep, baseRef: prev.baseRef, ratio: prev.ratio } : null,
    judgement: crossIsGate ? 'gate' : 'informational' });
  console.log(`${failed ? 'FAIL' : warn ? 'WARN' : 'INFO'} perf.abJit.cross.${pid}  beta=${cand.msPerStep.toFixed(3)}ms/步`
    + ` 基準(${abJitBaseline.kind})=${base.msPerStep.toFixed(3)}ms/步 比=${ratio.toFixed(3)}`
    + `(A/B 2 sim・warm ${ABJIT.warm} 步・${cand.reps} 反復の中央値)`
    + (prev ? ` 前回 比=${prev.ratio}` : '')
    + (warn ? `  ← **${ABJIT_WARN}× 超**: 両ページ共通の遅化を疑う。`
      + '器 tests/exp-w258e-jitprobe.mjs を基点 html と並べて回すこと'
      + (crossIsGate ? '(**frozen-file 基準なので FAIL**)'
        : '(root-fallback は**凍結扱いしない**ので informational —— 取得失敗を合格に置き換えない)') : ''));
}

await browser.close();

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, ABJIT_ONLY ? 'perf-abjit-only.json' : 'perf-results.json'), JSON.stringify({
  when: new Date().toISOString(), threshold: THRESH,
  reps: REPS, frames: FRAMES, sets: SETS, env,
  // results: 比較ゲート対象(pass/fail 判定あり。ratio はペア比の中央値。
  //          pairs に各ペアの順序・両側 ms・比、rawRoot/BetaMs に全反復生値を記録)
  //          第160便: 再トスが走ったサンプルにのみ retossed:true と first*/final*(初回測定の
  //          比・ペア・生値と最終判定)を追加する。上位キー(ratio/normRatio/pairs/raw*Ms/pass)は
  //          **再トス後の最終測定**の値。再トス無しのサンプルには一切追加されない(既存様式のまま)
  // informational: 片側にしかプリセットが無いための参考計測(pass判定なし。ゲート対象外 —
  //          判定が無いので再トスの対象にもならない)
  // geo2: 第72便 — geoPN=2 のオーバーヘッドゲート(🎡⇔💫 同一初期配置ペア比)と N 掃引
  // abJit: 第259便d → **第260便d で 2 系統**の **informational** な A/B JIT probe
  //   (〔第258便e〕の崖を perf からも見る)。rows[].arm = "self-control"(同一 html の 2 ページ:
  //   A/B ÷ 素・期待 1・崖なら 10 倍級)/ "cross-html"(凍結基準 html 対 候補・どちらも A/B)。
  //   rows[].msPerStep = beta の ms/步(1 sim 1 步あたり)・baseRef = 同一 run の root の ms/步・
  //   ratio = msPerStep / baseRef。**判定は informational**(warn を立てるだけで fail を増やさない)。
  //   prev は前回の走行の記録で、**判定には使わない**(tests/out は追跡外なので CI では空から始まる)。
  results: rows, informational, geo2: { gate: geo2Gate, sweep: geo2Sweep },
  abJit: { rows: abJitRows, warnRatio: ABJIT_WARN, selfWarnRatio: ABJIT_SELF_WARN,
    presets: ABJIT_PRESETS,
    method: `ab(2 sim)・warm ${ABJIT.warm} 步・${ABJIT.reps} 反復 × ${ABJIT.chunk} 步の中央値・ms/步`
      + '(**プリセットごとに新しいページ** — 同じページで 2 本目を測ると 2 度目の build が deopt を通す)',
    // 第260便d: **2 系統**。どちらも informational(WARN を出すだけで fail を増やさない)。
    arms: [
      { arm: 'self-control', baselineKind: 'same-html-2pages', expectedRatio: 1,
        warnRatio: ABJIT_SELF_WARN, judgement: 'informational',
        note: '**同一 html の 2 ページ自己対照**(素の走行 対 A/B 走行)。基準値が要らないので'
          + '機種依存も世代差も入らず、**CI でそのまま再現できる**。期待は 1 付近で、'
          + '崖があると 10 倍級へ跳ねる(〔第258便e〕: 素 ×1.5 対 A/B ×15〜20)。'
          + '**両ページに共通して効く遅化は、この系統では見えない**(そのための (b) である)。' },
      { arm: 'cross-html', baselineKind: abJitBaseline.kind, baselineTarget: abJitBaseline.target,
        warnRatio: ABJIT_WARN, judgement: 'informational',
        note: '**凍結基準 html 対 候補**(どちらも A/B 走行)。' + abJitBaseline.note
          + ' 固定値は採らない(絶対 ms/步 は機種依存)。前回値も判定には使わない'
          + '(tests/out は追跡外・毎回自分を基準にし直すと緩やかな劣化を見逃す) —— `prev` に記録だけする。' },
    ],
    baseRefKind: 'same-run-root', judgement: 'informational',
    note: '**2 系統とも informational である。** (a) 自己対照は基準値が要らず CI で再現でき、'
      + '(b) 凍結基準は両ページ共通の遅化を捕まえる。**FAIL 化は 2 便続けて安定させてから**'
      + '決める(決断事項 — 〔第260便d〕に案を書いた)。'
      + 'root は別世代なので (b) の比は 1.00 ではない —— 見るのは**比の急変**である(崖なら 15〜20 倍)。' },
}, null, 2));
const retossed = rows.filter((r) => r.retossed);
console.log(`perf gate: ${rows.length - fail}/${rows.length} PASS → tests/out/${ABJIT_ONLY ? 'perf-abjit-only.json' : 'perf-results.json'}`
  + (abJitRows.length ? ` [abJit(informational・2 系統): ${abJitRows.map((r) => `${r.arm === 'self-control' ? '自己' : '対html'}/${r.id} ×${r.ratio}${r.warn ? ' WARN' : ''}`).join(' / ')}]` : '')
  + (informational.length ? ` (+${informational.length} informational)` : '')
  // 第160便: 再トスが走ったサンプルは要約行にも残す(再トス無しの run では何も出ない)
  + (retossed.length ? ` [再トス ${retossed.length}件: ${retossed.map((r) => `${r.id} ${r.firstNormRatio}→${r.finalRatio}${r.finalPass ? '' : '(FAIL確定)'}`).join(' / ')}]` : ''));
process.exit(fail ? 1 : 0);

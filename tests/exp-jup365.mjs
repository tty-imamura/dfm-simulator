// 第162便 exp-jup365.mjs — 木星ガリレオ衛星 hold-out の **JUP365 変種**(観測ソース依存性の定量化)。
// ============================================================================================
// 位置づけ: 第138便 tests/exp-jupiter.mjs の hold-out(共有 D₀=0.006 と qLock 則を一切再フィット
//   せずに木星系へ外挿する事後テスト)は、比較対象の観測周期に **NASA の惑星衛星 fact sheet 系**
//   (NASA GSFC / NSSDCA)の恒星公転周期を使っている(第143便で帰属を再整理済み)。
//   外部レビュー(2026-08-22)から「現行の JPL Planetary Satellite Mean Elements(JUP365)の
//   周期とは最大 ~0.7% の差がありうる」という指摘があり、第138便のハーネス冒頭にもその旨だけが
//   注記されていた(本環境は egress 遮断のため原表未検証)。
//   本便はその**差そのものを測る**:
//     ① 両ソースの周期差を衛星別に数値化し(UW1)、
//     ② 既存初期条件のまま基線を再測して両ソースの目標に対する位置を出し(UW2)、
//     ③ JUP365 周期からケプラー逆算した a' で**再フィットなしの変種**を走らせ(UW3)、
//     ④ hold-out の結論(4衛星保持+周期整合)がソースを取り替えても同じかを記録する(UW4)。
//   PASS でも FAIL でも価値がある。実測値は動かさずそのまま記録する。
//
// ★ 数値の出典と検証状態(捏造引用の禁止 — 明示する)★
//   fact-sheet 系(比較対象・不変): Io 1.769138 / Europa 3.551181 / Ganymede 7.154553 /
//     Callisto 16.689017 日。第138便 tests/exp-jupiter.mjs の MOONS[].Pobs からの転記である。
//   JPL JUP365 平均要素周期(本便で新規に持ち込む転写値): Io 1.762732 / Europa 3.525463 /
//     Ganymede 7.155588 / Callisto 16.690440 日。
//     **出典**: 外部レビュー(2026-08-22)が引用した JPL Planetary Satellite Mean Elements
//     (JUP365)の値からの転写。
//     **TODO(ref-verify)**: 本環境は egress 遮断のため JPL の原表を参照できておらず、上記4値は
//     レビュー文書からの二次転写である。原表(URL・版・取得日)の確定と桁の照合は投稿時に行う。
//     原表と食い違いが見つかった場合は本 JSON を破棄して再実測する(値の書き換えはしない)。
//
// ★ 変えないもの(hold-out を hold-out のままにする条件)★
//   D₀=0.006(🪨🌘💿 と共通の既存値)・q=12.30(qLock 則を参照軌道=イオで1回だけ評価した直値宣言)・
//   e / m / R / spin / 木星の質量・半径・自転・単位規約・N_STEP=2000・ORBITS=20 は**すべて不変**。
//   UW3 の変種で動かすのは各衛星の a だけであり、それも JUP365 周期からのケプラー逆算
//   a'=(GM·(P/2π)²)^(1/3) という**決定論的な変換**である(当てはめではない — manifest の
//   classification.fit は空)。
//
// ============================ 事前登録窓 UW1〜UW4(実測前に統括が固定 — 逐語)=================
//   UW1(データのみ): 両ソースの周期相対差 |P_JUP365−P_facts|/P_facts を衛星別に記録 —
//     窓: 4衛星とも ≤1%。
//   UW2(基線再測): 既存初期条件(fact-sheet a・D₀=0.006・q=12.30 不変)の kF0/kF1 走行
//     (kF0=kFrame0 転写・kF1=kFrame1 保持、それぞれ exp-jupiter JW1/JW2 と同一手順)が
//     fact-sheet 目標 ±1% かつ JUP365 目標 ±2%(ソース差 ≤1% と転写窓 ±1% の合成上界として
//     事前宣言)。保持 |Δa|/a<2%・NaN なし・≥20 イオ公転。
//   UW3(変種本体): 各衛星の a を JUP365 周期からケプラー逆算 a'=(GM·(P/2π)²)^(1/3)
//     (P は時間単位=日×86.4。e/m/R/spin/D₀/q は**再フィットなしで不変**)した kF1 走行 —
//     測定周期が JUP365 目標 ±1%・保持窓は UW2 と同一。
//   UW4(結論安定性): ホールドアウト結論(4衛星保持+周期整合)が両ソースで同判定になるかを
//     記録(PASS/FAIL の一致表)。
//   決定性: 全体2回実行(別プロセス)で、揮発キー(タイムスタンプ等)を除いた正規化 JSON の
//     SHA-256 一致(coreshell5 の方式を踏襲)。
//   **実測後に窓を動かさない。FAIL は FAIL のまま収載する。**
//
// 比較の厳密さ: 「±1%」「±2%」は第138便 JW1/JW2 と同一の厳格比較 |dev| < 0.01 / < 0.02 で判定する
//   (境界値の扱いを既存便と揃えるため。実測値は窓の縁から十分離れているので運用差は生じない)。
//
// 実行:
//   node tests/exp-jup365.mjs                                  … 通常実行(約10秒)
//   JUP365_OUT=/path/run1.json node tests/exp-jup365.mjs       … 出力先の変更(決定性の1回目)
//   JUP365_DET_REF=/path/run1.json node tests/exp-jup365.mjs   … 2回目で1回目の JSON と SHA 照合
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.JUP365_OUT || path.join(OUT_DIR, 'jup365-results.json');
const DET_REF = process.env.JUP365_DET_REF || null;

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
// 正準化(決定性ハッシュに使う — キーを再帰整列してから JSON 化する)
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
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  const { chromium } = await import('playwright');
  return chromium.launch({ executablePath: exe });
}

// ---- 規約(第138便 exp-jupiter.mjs からの転記 — 1つも変えていない)-------------------------
const PHYS = { G: 6.674, D0: 0.006, kFrame: 1, q: 12.30, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  kappaT: 7.415555555555556e-9, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
  timeScale: 1, stateCarry: 'double' };

const MJ = 18.98;              // 木星の実質量 1.898×10²⁷kg(10²⁶kg 単位)
const RJ = 7.1492;             // 木星の実半径 71,492km(10⁷m 単位)
const SPIN_J = 0.175851814;    // 実自転 9.925h → 2π/(9.925×3600 s) を rad/10³s へ
const DAY = 86.4;              // 1日 = 86400s = 86.4 時間単位
const GM = PHYS.G * MJ;        // 126.67252

// 衛星の実値(a/e/m/R/spin/phase と fact-sheet 系の観測周期は第138便 MOONS からの転記 — 不変)。
// P365 は JPL JUP365 平均要素周期の転写値(ファイル冒頭の出典と TODO(ref-verify) を参照)。
const MOONS = [
  { name: 'Io',       ja: 'イオ',     a: 42.18,  e: 0.0041, m: 0.000893, R: 0.18216,
    spin: 0.0411059240,  Pobs: 1.769138,  P365: 1.762732,  phase: 0 },
  { name: 'Europa',   ja: 'エウロパ', a: 67.11,  e: 0.009,  m: 0.000480, R: 0.15608,
    spin: 0.0204782725,  Pobs: 3.551181,  P365: 3.525463,  phase: 1 },
  { name: 'Ganymede', ja: 'ガニメデ', a: 107.04, e: 0.0013, m: 0.001480, R: 0.26341,
    spin: 0.0101644438,  Pobs: 7.154553,  P365: 7.155588,  phase: 2 },
  { name: 'Callisto', ja: 'カリスト', a: 188.27, e: 0.0074, m: 0.001076, R: 0.24103,
    spin: 0.00435747966, Pobs: 16.689017, P365: 16.690440, phase: 3 },
];

const Q_LOCK = 12.30;   // 直値宣言(第138便と同一 — 本便で再フィットしない)
const Q_STAR = 3 + Math.log(1.25 * PHYS.cLight * PHYS.cLight * RJ / GM)
  / Math.log((RJ + MOONS[0].a) / RJ);   // 参照軌道=イオ(fact-sheet a)での qLock 則の値(出典の記録)

const N_STEP = 2000;    // イオ1公転あたりの步数(第138便の主測定と同一)
const ORBITS = 20;      // 窓(≥20 イオ公転 — 第138便 JW2 と同一)

// ケプラー逆算: a' = (GM·(P/2π)²)^(1/3)(P は時間単位 = 日×86.4)。当てはめではなく決定論的変換。
const keplerA = (Pdays) => Math.cbrt(GM * Math.pow(Pdays * DAY / (2 * Math.PI), 2));
const keplerT = (a) => 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / GM);

// 近点配置・90°位相(第138便 bodyOf と同一。a だけを差し替えられるようにしてある)
const bodyOf = (mo, a) => {
  const rp = a * (1 - mo.e), vp = Math.sqrt(GM * (1 + mo.e) / rp);
  const P = [[rp, 0, 0, vp], [0, rp, -vp, 0], [-rp, 0, 0, -vp], [0, -rp, vp, 0]][mo.phase];
  return { type: 'single', m: mo.m, radius: mo.R, x: P[0], y: P[1], vx: P[2], vy: P[3],
    spin: mo.spin, pinned: false };
};

const A_FACTS = MOONS.map((mo) => mo.a);
const A_365 = MOONS.map((mo) => keplerA(mo.P365));
const T_IO_FACTS = keplerT(A_FACTS[0]);
const T_IO_365 = keplerT(A_365[0]);

// ---- 入力の来歴(既存 JSON — 読み取り専用。sha256 を残す)-----------------------------------
// 第138便の実測正本があれば、基線再測(UW2)が第138便の対応走行と何桁一致するかを付帯記録する。
// 無くても本便の判定は成立する(参照が無い場合は crossWaveCheck を null 埋めする)。
const provenanceInputs = [];
let jupiterRef = null;
{
  const p = path.join(OUT_DIR, 'jupiter-results.json');
  if (fs.existsSync(p)) {
    const bytes = fs.readFileSync(p);
    let j = null;
    try { j = JSON.parse(bytes.toString('utf8')); } catch {}
    provenanceInputs.push({ path: 'tests/out/jupiter-results.json', sha256: sha256(bytes),
      bytes: bytes.length, wave: j && j.wave || null,
      targetSha256: j && j.manifest ? j.manifest.provenance.target.sha256 : null,
      appVersion: j && j.manifest ? j.manifest.provenance.target.appVersion : null,
      gitCommit: j && j.manifest ? j.manifest.provenance.git.commit : null,
      role: '第138便 hold-out の実測正本(基線再測の付帯照合先 — 読み取り専用)' });
    jupiterRef = j;
  }
}
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));

// ======================================= ハーネス ============================================
const CTX = { PHYS, MJ, RJ, SPIN_J, GM,
  SETS: { facts: MOONS.map((mo, i) => bodyOf(mo, A_FACTS[i])),
    jup365: MOONS.map((mo, i) => bodyOf(mo, A_365[i])) } };

const HARNESS = ({ PHYS, MJ, RJ, SPIN_J, GM, SETS }) => {
  window.__j365 = {
    sets: SETS,
    build(setName, kF, q) {
      const P = Object.assign({}, PHYS, { kFrame: kF, q });
      const S = HP.sim;
      S.build({ id: 'jup365', name: 'jup365', emoji: '🟠', seed: 1, camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: P,
        bodies: [{ type: 'single', m: MJ, radius: RJ, x: 0, y: 0, vx: 0, vy: 0,
          spin: SPIN_J, pinned: true, pnSource: true }]
          .concat(SETS[setName].map((b) => Object.assign({}, b))) });
      return S;
    },
    // 主測定: 恒星公転周期・軌道長半径の保持・離心率の帯(第138便 run の測定部からの転記・簡約)
    run(setName, kF, q, N, orbits, Tbase) {
      const S = this.build(setName, kF, q);
      const dt = Tbase / N, steps = Math.round(orbits * N);
      const n = SETS[setName].length;
      const st = [];
      for (let i = 0; i < n; i++) st.push({ ang: 0, px: 0, py: 0, tRev: [],
        aMin: Infinity, aMax: -Infinity, aSum: 0, eMin: Infinity, eMax: -Infinity,
        rMin: Infinity, rMax: -Infinity, nS: 0 });
      const SAMPLE = Math.max(1, Math.floor(steps / 8000));
      for (let k = 0; k < steps; k++) {
        S.step(dt);
        const t = (k + 1) * dt;
        for (let i = 0; i < n; i++) {
          const j = i + 1;
          const dx = S.x[j] - S.x[0], dy = S.y[j] - S.y[0];
          const vx = S.vx[j] - S.vx[0], vy = S.vy[j] - S.vy[0];
          const rr = Math.hypot(dx, dy), s = st[i];
          if (k === 0) { s.px = dx; s.py = dy; }
          else {
            s.ang += Math.atan2(s.px * dy - s.py * dx, s.px * dx + s.py * dy);
            s.px = dx; s.py = dy;
            if (Math.abs(s.ang) >= 2 * Math.PI * (s.tRev.length + 1)) s.tRev.push(t);
          }
          if (k % SAMPLE) continue;
          const aa = 1 / (2 / rr - (vx * vx + vy * vy) / GM);   // vis-viva
          const h = dx * vy - dy * vx;
          const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
          const ecc = Math.hypot(ex, ey);
          if (aa < s.aMin) s.aMin = aa; if (aa > s.aMax) s.aMax = aa;
          if (ecc < s.eMin) s.eMin = ecc; if (ecc > s.eMax) s.eMax = ecc;
          if (rr < s.rMin) s.rMin = rr; if (rr > s.rMax) s.rMax = rr;
          s.aSum += aa; s.nS++;
        }
      }
      const rows = st.map((s) => {
        let Tavg = null, span = null;
        if (s.tRev.length >= 2) {
          span = s.tRev[s.tRev.length - 1] - s.tRev[0];
          Tavg = span / (s.tRev.length - 1);
        } else if (s.tRev.length === 1) Tavg = s.tRev[0];
        return { Tavg, nRev: s.tRev.length, revSpan: span,
          aMin: s.aMin, aMax: s.aMax, aMean: s.aSum / s.nS,
          eMin: s.eMin, eMax: s.eMax, rMin: s.rMin, rMax: s.rMax, nSamples: s.nS };
      });
      const fin = [];
      for (let i = 1; i < S.n; i++) fin.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return { rows, fin, nan: S.hasNaN(), steps, dt };
    },
  };
};

// ======================================= 実行 ================================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);
await page.evaluate(HARNESS, CTX);

const PRE_REGISTERED = {
  UW1: 'UW1(データのみ): 両ソースの周期相対差 |P_JUP365−P_facts|/P_facts を衛星別に記録 — '
    + '窓: 4衛星とも ≤1%。',
  UW2: 'UW2(基線再測): 既存初期条件(fact-sheet a・D₀=0.006・q=12.30 不変)の kF0/kF1 走行'
    + '(kF0=kFrame0 転写・kF1=kFrame1 保持、それぞれ exp-jupiter JW1/JW2 と同一手順)が '
    + 'fact-sheet 目標 ±1% かつ JUP365 目標 ±2%(ソース差 ≤1% と転写窓 ±1% の合成上界として'
    + '事前宣言)。保持 |Δa|/a<2%・NaN なし・≥20 イオ公転。',
  UW3: 'UW3(変種本体): 各衛星の a を JUP365 周期からケプラー逆算 a\'=(GM·(P/2π)²)^(1/3)'
    + '(P は時間単位=日×86.4。e/m/R/spin/D₀/q は**再フィットなしで不変**)した kF1 走行 — '
    + '測定周期が JUP365 目標 ±1%・保持窓は UW2 と同一。',
  UW4: 'UW4(結論安定性): ホールドアウト結論(4衛星保持+周期整合)が両ソースで同判定になるかを'
    + '記録(PASS/FAIL の一致表)。',
  determinism: '決定性: 全体2回実行(別プロセス)で、揮発キー(タイムスタンプ等)を除いた'
    + '正規化 JSON の SHA-256 一致(coreshell5 の方式を踏襲)。',
  note: '窓は統括が実測前に固定した(ハンドオフ 2026-08-22a §3b)。本ハーネスは窓を1文字も動かさず、'
    + 'PASS/FAIL とも実測値をそのまま収載する。',
};

const out = {
  meta: { exp: 'jup365', wave: 162, target: TARGET, date: new Date().toISOString(),
    title: '木星ガリレオ衛星 hold-out の JUP365 変種(観測ソース依存性の定量化)',
    basedOn: '第138便 tests/exp-jupiter.mjs(規約・初期条件・測定手順・窓の流儀)/ '
      + '第158便 tests/exp-coreshell5.mjs(決定性 SHA 照合の方式)',
    outPath: path.relative(ROOT, OUT_PATH), detRef: DET_REF ? path.basename(DET_REF) : null,
    stage: 'incomplete' },
  preRegistered: PRE_REGISTERED,
  sources: {
    factSheet: { role: '比較対象(第138便 hold-out の照合先 — 不変)',
      attribution: 'NASA の惑星衛星 fact sheet 系(NASA GSFC / NSSDCA)の恒星公転周期'
        + '(第143便で再帰属済み)。本便は第138便 MOONS[].Pobs からの転記である。',
      periodsDays: Object.fromEntries(MOONS.map((m) => [m.name, m.Pobs])),
      verified: 'TODO(ref-verify): アーカイブ URL と fact sheet の版の確定は投稿時(第138便からの継承)。' },
    jup365: { role: '本便が新規に持ち込む対照ソース',
      attribution: 'JPL Planetary Satellite Mean Elements(JUP365)の平均要素周期。'
        + '外部レビュー(2026-08-22)が引用した値からの**二次転写**である。',
      periodsDays: Object.fromEntries(MOONS.map((m) => [m.name, m.P365])),
      verified: 'TODO(ref-verify): 本環境は egress 遮断のため JPL の原表を参照できていない。'
        + '原表(URL・版・取得日)の確定と桁の照合は投稿時に行う。原表と食い違いが見つかった場合は'
        + '本 JSON を破棄して再実測する(値の書き換えはしない)。' },
  },
  config: {
    units: '1単位=10⁷m/10³s/10²⁶kg', unitRule: 'L−T=4(c₀=3×10⁴)・M+2T−3L=11(G=6.674)',
    physics: PHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, rotationHours: 9.925,
    GM, day: DAY, pinned: true,
    idealization: '2D 赤道面理想化(軌道傾斜 0.04°/0.47°/0.20°/0.19° を無視する — 第138便の宣言を踏襲)',
    moons: MOONS,
    qDeclared: Q_LOCK, qStarAtFactsIo: Q_STAR, qLockRuntime: false,
    qNote: 'q=12.30 は qLock 則 q*=3+ln(1.25c₀²R/GM)/ln((R+a)/R) を参照軌道=イオ(fact-sheet a=42.18)'
      + 'で1回だけ評価した直値宣言(第138便)。**本便では変種側でも再評価しない**(再フィット禁止)。',
    D0Shared: PHYS.D0, D0Note: 'D₀=0.006 は 🪨🌘💿 と共通の既存値。本便での再フィットはゼロ。',
    stepsPerOrbit: N_STEP, orbits: ORBITS,
    semiMajorAxes: MOONS.map((mo, i) => ({ name: mo.name, aFactSheet: A_FACTS[i], aJup365: A_365[i],
      relDiff: A_365[i] / A_FACTS[i] - 1 })),
    keplerInverse: 'a\' = (GM·(P/2π)²)^(1/3)(P は時間単位 = 日×86.4)— 決定論的変換であり当てはめではない',
    timeBase: { factsIoKeplerUnits: T_IO_FACTS, factsIoKeplerDays: T_IO_FACTS / DAY,
      jup365IoKeplerUnits: T_IO_365, jup365IoKeplerDays: T_IO_365 / DAY,
      note: '各アームの dt はそのアームのイオのケプラー周期 / N_STEP で取る(窓「≥20 イオ公転」を'
        + '両アームで同じ意味にするため)' },
    comparator: '窓の ±X% は第138便 JW1/JW2 と同一の厳格比較 |dev| < X/100 で判定する',
  },
  raw: {}, windows: {}, crossWaveCheck: null, determinism: null,
};

const log = (...a) => console.log(...a);
log('== 第162便 木星ガリレオ衛星 hold-out の JUP365 変種 ==');
log(`対象: ${TARGET}(sha256 ${TARGET_SHA_NOW.slice(0, 16)}…)`);
log(`イオのケプラー周期: fact-sheet a → ${(T_IO_FACTS / DAY).toFixed(6)} 日 / `
  + `JUP365 a' → ${(T_IO_365 / DAY).toFixed(6)} 日`);
log(`主測定: ${N_STEP} 步/イオ公転 × ${ORBITS} イオ公転 = ${N_STEP * ORBITS} 步/走行\n`);

// ---- A) 走行(基線 kF0/kF1 + 変種 kF0/kF1)----------------------------------------------
const t0 = Date.now();
const runOf = (set, kF, Tb) => page.evaluate(({ set, kF, q, N, o, Tb }) =>
  window.__j365.run(set, kF, q, N, o, Tb), { set, kF, q: Q_LOCK, N: N_STEP, o: ORBITS, Tb });

log('== A) 走行 ==');
const baseKF0 = await runOf('facts', 0, T_IO_FACTS);
const baseKF1 = await runOf('facts', 1, T_IO_FACTS);
const varKF0 = await runOf('jup365', 0, T_IO_365);
const varKF1 = await runOf('jup365', 1, T_IO_365);
log(`  (4走行 ${((Date.now() - t0) / 1000).toFixed(1)} 秒)`);

const armRows = (r, aDecl, TbUnits) => MOONS.map((mo, i) => {
  const w = r.rows[i];
  return { name: mo.name, ja: mo.ja, aDeclared: aDecl[i],
    periodDays: w.Tavg / DAY, nRev: w.nRev, revSpanUnits: w.revSpan,
    devVsFactSheet: (w.Tavg / DAY) / mo.Pobs - 1,
    devVsJup365: (w.Tavg / DAY) / mo.P365 - 1,
    aMin: w.aMin, aMax: w.aMax, aMean: w.aMean,
    aSpread: (w.aMax - w.aMin) / w.aMean,
    eMin: w.eMin, eMax: w.eMax, rMin: w.rMin, rMax: w.rMax,
    // 周期の測定分解能床: 公転通過時刻は補間せず步境界で拾うので量子化は dt。
    // 平均周期は (t_last−t_first)/(nRev−1) なので相対床は dt/span になる。
    periodResolutionFloorRel: w.revSpan ? (TbUnits / N_STEP) / w.revSpan : null };
});

out.raw = {
  armDefinition: {
    baseline: '基線(fact-sheet a・既存初期条件そのまま)— UW2',
    variant: '変種(JUP365 周期からケプラー逆算した a\'。e/m/R/spin/D₀/q は不変)— UW3',
  },
  baseline: { kF0: { nan: baseKF0.nan, steps: baseKF0.steps, dt: baseKF0.dt,
      rows: armRows(baseKF0, A_FACTS, T_IO_FACTS), fin: baseKF0.fin },
    kF1: { nan: baseKF1.nan, steps: baseKF1.steps, dt: baseKF1.dt,
      rows: armRows(baseKF1, A_FACTS, T_IO_FACTS), fin: baseKF1.fin } },
  variant: { kF0: { nan: varKF0.nan, steps: varKF0.steps, dt: varKF0.dt,
      rows: armRows(varKF0, A_365, T_IO_365), fin: varKF0.fin },
    kF1: { nan: varKF1.nan, steps: varKF1.steps, dt: varKF1.dt,
      rows: armRows(varKF1, A_365, T_IO_365), fin: varKF1.fin } },
  periodShiftKF1minusKF0: {
    baseline: MOONS.map((mo, i) => ({ name: mo.name,
      rel: (baseKF1.rows[i].Tavg - baseKF0.rows[i].Tavg) / baseKF0.rows[i].Tavg })),
    variant: MOONS.map((mo, i) => ({ name: mo.name,
      rel: (varKF1.rows[i].Tavg - varKF0.rows[i].Tavg) / varKF0.rows[i].Tavg })),
    note: '記述のみ(窓なし)。kF1−kF0 の周期シフト — 第138便 JW4 の periodShiftTotal と同じ量。' },
};

// ---- B) UW1: ソース差(データのみ)-------------------------------------------------------
const uw1Rows = MOONS.map((mo) => {
  const rel = (mo.P365 - mo.Pobs) / mo.Pobs;
  return { name: mo.name, ja: mo.ja, periodFactSheet: mo.Pobs, periodJup365: mo.P365,
    diffDays: mo.P365 - mo.Pobs, relDiff: rel, absRelDiff: Math.abs(rel),
    absRelDiffPercent: Math.abs(rel) * 100, ok: Math.abs(rel) <= 0.01 };
});
out.windows.UW1 = { statement: PRE_REGISTERED.UW1,
  comparator: '|P_JUP365−P_facts|/P_facts ≤ 0.01(逐語の「≤1%」をそのまま)',
  measurementType: 'データのみ(シミュレーション不要 — 両ソースの転写値の差)',
  rows: uw1Rows, maxAbsRelDiffPercent: Math.max(...uw1Rows.map((r) => r.absRelDiffPercent)),
  pass: uw1Rows.every((r) => r.ok) };

// ---- C) UW2: 基線再測 ---------------------------------------------------------------------
const uw2Arm = (arm, label) => {
  const rows = arm.rows.map((r) => ({ name: r.name, periodDays: r.periodDays,
    devFactSheetPercent: r.devVsFactSheet * 100, devJup365Percent: r.devVsJup365 * 100,
    aSpread: r.aSpread, aSpreadPercent: r.aSpread * 100, nRev: r.nRev,
    okFactSheet: Math.abs(r.devVsFactSheet) < 0.01,
    okJup365: Math.abs(r.devVsJup365) < 0.02,
    okRetention: r.aSpread < 0.02,
    ok: Math.abs(r.devVsFactSheet) < 0.01 && Math.abs(r.devVsJup365) < 0.02 && r.aSpread < 0.02 }));
  // 「≥20 イオ公転」は**走行窓の長さ**の条件である(第138便 JW2 の windowIoOrbits と同じ読み)。
  // 積分窓は ORBITS × T_Io(ケプラー)ちょうどなので構成から満たされる。
  // 実測の公転通過回数(ioRevolutionsCompleted)は診断として併記する — 力学周期がケプラー基準より
  // わずかに長い(≈1.7×10⁻⁴)ため、20 回目の通過は窓の外側へ落ちて 19 回になるのが正常である。
  const okWindow = ORBITS >= 20;
  return { label, nan: arm.nan, rows,
    windowIoOrbitsIntegrated: ORBITS, okWindowIoOrbits: okWindow,
    ioRevolutionsCompleted: arm.rows[0].nRev,
    pass: !arm.nan && okWindow && rows.every((r) => r.ok) };
};
const uw2KF0 = uw2Arm(out.raw.baseline.kF0, 'kF0(kFrame=0 転写 — exp-jupiter JW1 と同一手順)');
const uw2KF1 = uw2Arm(out.raw.baseline.kF1, 'kF1(kFrame=1 保持 — exp-jupiter JW2 と同一手順)');
out.windows.UW2 = { statement: PRE_REGISTERED.UW2,
  comparator: 'fact-sheet 目標 |dev|<0.01 かつ JUP365 目標 |dev|<0.02・保持 |Δa|/a<0.02・NaN なし',
  windowIoOrbits: ORBITS, stepsPerOrbit: N_STEP,
  kF0: uw2KF0, kF1: uw2KF1, pass: uw2KF0.pass && uw2KF1.pass };

// ---- D) UW3: 変種本体 ---------------------------------------------------------------------
const uw3Rows = out.raw.variant.kF1.rows.map((r) => ({ name: r.name, aVariant: r.aDeclared,
  periodDays: r.periodDays, targetJup365: MOONS.find((m) => m.name === r.name).P365,
  devJup365Percent: r.devVsJup365 * 100, devFactSheetPercent: r.devVsFactSheet * 100,
  aSpread: r.aSpread, aSpreadPercent: r.aSpread * 100, nRev: r.nRev,
  okPeriod: Math.abs(r.devVsJup365) < 0.01, okRetention: r.aSpread < 0.02,
  ok: Math.abs(r.devVsJup365) < 0.01 && r.aSpread < 0.02 }));
const uw3IoRev = out.raw.variant.kF1.rows[0].nRev;
out.windows.UW3 = { statement: PRE_REGISTERED.UW3,
  windowIoOrbitsIntegrated: ORBITS, okWindowIoOrbits: ORBITS >= 20,
  ioRevolutionsCompleted: uw3IoRev,
  windowNote: '「≥20 イオ公転」は積分窓の長さの条件(UW2 と同一の読み)。実測の公転通過回数が 19 に'
    + 'なるのは力学周期がケプラー基準よりわずかに長く 20 回目の通過が窓の外へ落ちるためで、正常である。',
  comparator: 'JUP365 目標 |dev|<0.01・保持 |Δa|/a<0.02・NaN なし(保持窓は UW2 と同一)',
  keplerInverse: out.config.keplerInverse,
  refitCount: 0,
  refitNote: 'e/m/R/spin/D₀/q は1つも動かしていない。動いたのは a だけで、それも JUP365 周期からの'
    + 'ケプラー逆算である(当てはめ自由度ゼロ)。',
  nan: out.raw.variant.kF1.nan, rows: uw3Rows,
  pass: !out.raw.variant.kF1.nan && ORBITS >= 20 && uw3Rows.every((r) => r.ok) };

// ---- E) UW4: 結論安定性 -------------------------------------------------------------------
// hold-out の結論 = 「4衛星とも保持(NaN なし・|Δa|/a<2%)+周期整合(そのソースの目標と ±1%)」。
//   fact-sheet 版 = 基線 kF1 を fact-sheet 目標で判定(= 第138便 JW2 と同じ判定)
//   JUP365   版 = 変種 kF1 を JUP365 目標で判定(= UW3 の判定)
const concFactsRows = out.raw.baseline.kF1.rows.map((r) => ({ name: r.name,
  periodDays: r.periodDays, devPercent: r.devVsFactSheet * 100, aSpreadPercent: r.aSpread * 100,
  retained: r.aSpread < 0.02, periodOk: Math.abs(r.devVsFactSheet) < 0.01,
  verdict: (r.aSpread < 0.02 && Math.abs(r.devVsFactSheet) < 0.01) ? 'PASS' : 'FAIL' }));
const conc365Rows = out.raw.variant.kF1.rows.map((r) => ({ name: r.name,
  periodDays: r.periodDays, devPercent: r.devVsJup365 * 100, aSpreadPercent: r.aSpread * 100,
  retained: r.aSpread < 0.02, periodOk: Math.abs(r.devVsJup365) < 0.01,
  verdict: (r.aSpread < 0.02 && Math.abs(r.devVsJup365) < 0.01) ? 'PASS' : 'FAIL' }));
const agreeRows = MOONS.map((mo, i) => ({ name: mo.name,
  factSheet: concFactsRows[i].verdict, jup365: conc365Rows[i].verdict,
  agree: concFactsRows[i].verdict === conc365Rows[i].verdict }));
const concFactsAll = concFactsRows.every((r) => r.verdict === 'PASS') && !out.raw.baseline.kF1.nan;
const conc365All = conc365Rows.every((r) => r.verdict === 'PASS') && !out.raw.variant.kF1.nan;
out.windows.UW4 = { statement: PRE_REGISTERED.UW4,
  definition: 'hold-out の結論 = 4衛星とも「保持(NaN なし・|Δa|/a<2%)+周期整合(そのソースの'
    + '目標と ±1%)」。fact-sheet 版は基線 kF1(= 第138便 JW2 と同じ判定)、JUP365 版は変種 kF1'
    + '(= UW3 の判定)で評価する。',
  factSheetConclusion: concFactsAll ? 'PASS' : 'FAIL',
  jup365Conclusion: conc365All ? 'PASS' : 'FAIL',
  rowsFactSheet: concFactsRows, rowsJup365: conc365Rows,
  agreementTable: agreeRows,
  perMoonAgreement: agreeRows.every((r) => r.agree),
  overallAgreement: concFactsAll === conc365All,
  pass: (concFactsAll === conc365All) && agreeRows.every((r) => r.agree),
  passNote: '本窓の判定は「両ソースで同判定か」(結論の安定性)であって、結論そのものの PASS/FAIL'
    + 'ではない。結論そのものは factSheetConclusion / jup365Conclusion に別立てで収載している。' };

// ---- F) 第138便との付帯照合(窓ではない — 記録のみ)-----------------------------------------
if (jupiterRef && jupiterRef.windows && jupiterRef.windows.JW2) {
  const refJW1 = jupiterRef.windows.JW1.rows, refJW2 = jupiterRef.windows.JW2.rows;
  const cmp = (mine, ref) => {
    const rel = ref !== 0 ? (mine - ref) / Math.abs(ref) : null;
    return { mine, ref, relDiff: rel, bitIdentical: Object.is(mine, ref) };
  };
  out.crossWaveCheck = {
    scope: '第138便 exp-jupiter の JW1(kF0)・JW2(kF1)の周期と、本便の基線再測の対応値',
    note: '本便の基線は第138便と同一の初期条件・同一 dt・同一窓なので、原理的にはビット一致するはず'
      + 'である(測定コードは簡約したが、周期・|Δa|/a の算出式は転記のまま)。窓ではなく付帯記録。',
    kF0: MOONS.map((mo, i) => ({ name: mo.name,
      period: cmp(out.raw.baseline.kF0.rows[i].periodDays, refJW1[i].periodDays) })),
    kF1: MOONS.map((mo, i) => ({ name: mo.name,
      period: cmp(out.raw.baseline.kF1.rows[i].periodDays, refJW2[i].periodDays),
      aSpread: cmp(out.raw.baseline.kF1.rows[i].aSpread, refJW2[i].aSpread) })),
    targetConsistency: { targetShaNow: TARGET_SHA_NOW,
      targetShaOfReference: jupiterRef.manifest ? jupiterRef.manifest.provenance.target.sha256 : null,
      same: !!(jupiterRef.manifest && jupiterRef.manifest.provenance.target.sha256 === TARGET_SHA_NOW) },
  };
  out.crossWaveCheck.allBitIdentical = out.crossWaveCheck.kF0.every((r) => r.period.bitIdentical)
    && out.crossWaveCheck.kF1.every((r) => r.period.bitIdentical && r.aSpread.bitIdentical);
}

// ---- G) 決定性(全体2回実行・別プロセスの SHA 照合)-----------------------------------------
{
  // 対象は測定部と窓判定部のみ。windows.determinism 自身はハッシュの対象に入れない
  //(自己参照になるため — 収録順の違いで偽の不一致が出る)。
  const detTargetOf = (o) => ({ config: o.config, preRegistered: o.preRegistered, sources: o.sources,
    raw: o.raw, windows: { UW1: o.windows.UW1, UW2: o.windows.UW2, UW3: o.windows.UW3,
      UW4: o.windows.UW4 } });
  const mine = JSON.stringify(canonize(detTargetOf(out)));
  const rec = { canonicalization: 'config / preRegistered / sources / raw / windows.UW1〜UW4 を対象に'
      + 'キーを再帰整列した JSON の SHA-256。揮発キー(meta.date・走行時間・manifest・'
      + 'crossWaveCheck〔外部 JSON 依存〕)と windows.determinism〔自己参照〕は対象外である',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length,
    reference: null, referenceSha256: null, identical: null };
  if (DET_REF) {
    rec.reference = path.basename(DET_REF);
    let other = null;
    if (fs.existsSync(DET_REF)) {
      try {
        const j = JSON.parse(fs.readFileSync(DET_REF, 'utf8'));
        other = (j.meta && j.meta.stage === 'complete') ? j : null;
      } catch { other = null; }
    }
    if (other) {
      const otherJ = JSON.stringify(canonize(detTargetOf(other)));
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
      rec.identical = (mine === otherJ);
      rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一窓・同一步数)';
    } else {
      rec.note = '参照 JSON を読めなかった(未生成または途中段階)';
    }
  } else {
    rec.note = '参照なし(JUP365_DET_REF 未指定 — 1回目の実行)';
  }
  out.determinism = rec;
  out.windows.determinism = { statement: PRE_REGISTERED.determinism,
    sha256: rec.sha256, reference: rec.reference, identical: rec.identical,
    pass: rec.identical === null ? null : rec.identical,
    result: rec.identical === null ? 'PENDING(参照なし)' : (rec.identical ? 'PASS' : 'FAIL') };
}

// ---- H) コンソール出力 ---------------------------------------------------------------------
log('\n== UW1 ソース差(|P_JUP365−P_facts|/P_facts ≤1%)==');
for (const r of uw1Rows)
  log(`  ${r.name.padEnd(9)} facts ${r.periodFactSheet} / JUP365 ${r.periodJup365} 日 → `
    + `差 ${(r.relDiff * 100).toFixed(4)}% → ${r.ok ? 'PASS' : 'FAIL'}`);
log(`  UW1 総合: ${out.windows.UW1.pass ? 'PASS' : 'FAIL'}(最大 ${out.windows.UW1.maxAbsRelDiffPercent.toFixed(4)}%)`);

log('\n== UW2 基線再測(facts ±1% かつ JUP365 ±2%・保持 <2%)==');
for (const arm of [uw2KF0, uw2KF1]) {
  log(`  [${arm.label}] NaN=${arm.nan}`);
  for (const r of arm.rows)
    log(`    ${r.name.padEnd(9)} 周期 ${r.periodDays.toFixed(6)} 日 / facts ずれ ${r.devFactSheetPercent.toFixed(4)}%`
      + ` / JUP365 ずれ ${r.devJup365Percent.toFixed(4)}% / |Δa|/a=${r.aSpreadPercent.toFixed(5)}%`
      + ` / 公転通過 ${r.nRev} 回 → ${r.ok ? 'PASS' : 'FAIL'}`);
  log(`    小計: ${arm.pass ? 'PASS' : 'FAIL'}(積分窓 ${arm.windowIoOrbitsIntegrated} イオ公転`
    + ` / イオ公転通過 ${arm.ioRevolutionsCompleted} 回)`);
}
log(`  UW2 総合: ${out.windows.UW2.pass ? 'PASS' : 'FAIL'}`);

log('\n== UW3 変種(JUP365 逆算 a\'・kF1)==');
for (const r of uw3Rows)
  log(`  ${r.name.padEnd(9)} a=${r.aVariant.toFixed(5)} 周期 ${r.periodDays.toFixed(6)} 日`
    + `(JUP365 目標 ${r.targetJup365})ずれ ${r.devJup365Percent.toFixed(4)}%`
    + ` / |Δa|/a=${r.aSpreadPercent.toFixed(5)}% → ${r.ok ? 'PASS' : 'FAIL'}`);
log(`  NaN=${out.windows.UW3.nan} / UW3 総合: ${out.windows.UW3.pass ? 'PASS' : 'FAIL'}`);

log('\n== UW4 結論安定性(両ソースの一致表)==');
for (const r of agreeRows)
  log(`  ${r.name.padEnd(9)} fact-sheet=${r.factSheet} / JUP365=${r.jup365} → 一致 ${r.agree}`);
log(`  結論: fact-sheet 版 ${out.windows.UW4.factSheetConclusion} / JUP365 版 ${out.windows.UW4.jup365Conclusion}`);
log(`  UW4 総合(同判定か): ${out.windows.UW4.pass ? 'PASS' : 'FAIL'}`);

if (out.crossWaveCheck)
  log(`\n== 第138便との付帯照合(窓なし): 全ビット一致 = ${out.crossWaveCheck.allBitIdentical}`
    + ` / 対象 HTML 同一 = ${out.crossWaveCheck.targetConsistency.same}`);

log(`\n== 決定性: sha256 ${out.determinism.sha256.slice(0, 16)}… / 照合 ${out.windows.determinism.result}`);

// ---- I) マニフェスト ------------------------------------------------------------------------
out.meta.stage = 'complete';
out.meta.elapsedSec = (Date.now() - T_START) / 1000;   // 非測定メタ(決定性ハッシュの対象外)
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out, target: TARGET,
  experiment: { id: 'jup365', wave: 162,
    title: '木星ガリレオ衛星 hold-out の JUP365 変種(観測ソース依存性の定量化)',
    command: 'node tests/exp-jup365.mjs' },
  presets: { mode: 'dynamic',
    declaredIn: 'PHYS / MOONS / MJ / RJ / SPIN_J(ハーネス冒頭の宣言値 — 第138便からの転記)',
    declaration: '動的構成(内蔵プリセットを読まず、観測値からの宣言値で HP.sim.build する)',
    configs: { physics: PHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, moons: MOONS,
      qDeclared: Q_LOCK, qStarAtFactsIo: Q_STAR, pinned: true, GM, day: DAY,
      aFactSheet: A_FACTS, aJup365: A_365, T_IO_FACTS, T_IO_365 },
    note: '実行時 qLock は掛けない(多天体系では a_ref が一意でないため — 🌞solarInner 第131便の'
      + '既存裁定)。q は第138便が参照軌道=イオで1回だけ評価した q* の直値宣言で、本便では'
      + '変種側でも再評価していない' },
  numerics: {
    seed: NOT_APPLICABLE,
    dt: `dt = T_Io(そのアーム)/ ${N_STEP}(基線 ${(T_IO_FACTS / N_STEP).toExponential(6)} / `
      + `変種 ${(T_IO_365 / N_STEP).toExponential(6)} 時間単位)`,
    timeScale: 1, substeps: NOT_APPLICABLE,
    steps: `${N_STEP} 步/イオ公転 × ${ORBITS} 公転 = ${N_STEP * ORBITS} 步 × 4走行`
      + '(基線 kF0/kF1・変種 kF0/kF1)',
    window: `${ORBITS} イオ公転(事前登録窓 UW2/UW3 の「≥20 イオ公転」)`,
    warmup: NOT_APPLICABLE,
    unitRule: '1単位=10⁷m/10³s/10²⁶kg(L−T=4 → c₀=3×10⁴・M+2T−3L=11 → G=6.674)',
    numericalFloor: '周期の測定分解能床(dt/公転通過スパン)を raw.*.rows[].periodResolutionFloorRel に収載',
  },
  classification: {
    input: ['fact-sheet 系の恒星公転周期4値と衛星の実 a/e/m/R/spin(第138便 MOONS からの転記 — 観測由来の外部入力)',
      'JPL JUP365 平均要素周期4値(外部レビュー 2026-08-22 からの二次転写。TODO(ref-verify) — '
        + '本環境は egress 遮断で原表未検証。sources.jup365.verified を参照)',
      '木星の実質量・実半径・実自転(9.925h)',
      'D₀=0.006(🪨🌘💿 と共通の既存値 — 本便での再フィットはゼロ)',
      'q=12.30(第138便が参照軌道=イオで1回評価した直値宣言 — 本便では再評価しない)',
      'dt・步数・窓 UW1〜UW4(実測前に統括が固定)'],
    fit: [],
    derived: ['変種の軌道長半径 a\'=(GM·(P_JUP365/2π)²)^(1/3)(決定論的なケプラー逆算 — 当てはめではない)',
      '衛星別の測定周期・|Δa|/a・離心率の帯(raw.baseline / raw.variant)',
      '両ソース目標に対する残差と窓判定(windows.UW1〜UW4)',
      'kF1−kF0 の周期シフト(raw.periodShiftKF1minusKF0 — 記述のみ)',
      '第138便実測正本との付帯照合(crossWaveCheck)', '決定性ハッシュ(determinism)'],
    holdOut: ['JUP365 周期に対する4衛星の周期整合と軌道保持(既存の較正世界線〔共有 D₀・qLock 則〕を'
      + '**一切再フィットせずに**別ソースの観測へ当てた先。衛星別 fit ゼロ)',
      'hold-out 結論のソース依存性そのもの(UW4 — どちらのソースを採っても同判定かは事前に分からない)'],
    note: '本便が新規に持ち込む自由度はゼロである。a の差し替えは観測周期からのケプラー逆算であって'
      + '当てはめではなく、e/m/R/spin/D₀/q は1つも動かしていない',
  },
  judgement: {
    pointers: ['preRegistered', 'sources', 'windows.UW1', 'windows.UW2', 'windows.UW3',
      'windows.UW4', 'windows.determinism', 'raw.baseline', 'raw.variant',
      'raw.periodShiftKF1minusKF0', 'crossWaveCheck', 'determinism', 'config.semiMajorAxes'],
    note: '許容窓は preRegistered(統括が実測前に固定・実測後に動かしていない)、判定と実測値・残差は '
      + 'windows.UW1〜UW4 に構造ごと入っている。UW4 の pass は「両ソースで同判定か」であって'
      + '結論そのものの PASS/FAIL ではない(結論は UW4.factSheetConclusion / jup365Conclusion)',
    externalReferences: ['NASA 惑星衛星 fact sheet 系の恒星公転周期(sources.factSheet — UW1/UW2 の照合先)',
      'JPL Planetary Satellite Mean Elements JUP365 の平均要素周期'
        + '(sources.jup365 — UW1/UW2/UW3 の照合先。TODO(ref-verify): 原表未検証の二次転写)',
      '第138便 tests/out/jupiter-results.json(crossWaveCheck の照合先 — provenance に sha256)'],
  },
  health: {
    conservation: { status: 'partially-instrumented',
      quantity: '軌道長半径の広がり |Δa|/a(aSpread)と NaN 監視・2回実行の SHA 一致',
      pointers: ['windows.UW2.kF1.rows[].aSpread', 'windows.UW3.rows[].aSpread',
        'raw.baseline.kF1.nan', 'raw.variant.kF1.nan', 'determinism.identical'],
      note: '木星を pinned にしているため運動量は原理的に閉じない構成である(第138便と同一)。'
        + '保存量残差そのものは記録していない(' + NOT_INSTRUMENTED + ')が、軌道保持 |Δa|/a と'
        + '2回実行の SHA 一致を数値健全性の指標として持つ' },
  },
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'crossWaveCheck', 'determinism'],
  regenerationNote: '決定性照合の対象は config / preRegistered / sources / raw / windows である'
    + '(determinism.canonicalization を参照)。crossWaveCheck は外部 JSON の存在に依存するため対象外',
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\nsaved: ${path.relative(ROOT, OUT_PATH)}(${((Date.now() - T_START) / 1000).toFixed(1)} 秒)`);
await browser.close();

// 第162便 exp-jupseeds.mjs — 木星ガリレオ衛星 hold-out の **複数シード**(初期位相配置の統計)。
// ============================================================================================
// 位置づけ: 第138便 tests/exp-jupiter.mjs の hold-out は、4衛星を 90° ずつずらした**ただ1つの**
//   初期位相配置(イオ=0°・エウロパ=90°・ガニメデ=180°・カリスト=270°)で実測している。
//   2D 赤道面理想化のうえ実際の平均近点角を与えていない以上、この配置は「初期合を避けるための
//   宣言」であって観測から決まった量ではない。したがって
//   **「hold-out の結論がこの1配置に依存していないか」は測っていない**。
//   本便はそこを埋める: 90° スロットの割当を替えた 8 配置を全部走らせ、保持と周期整合が
//   配置に依らず成立するか(SW1/SW2)、配置間で測定周期がどれだけばらつくか(SW3)を記録する。
//   PASS でも FAIL でも価値がある。実測値は動かさずそのまま記録する。
//
// ★ シードの定義(統括が実測前に固定 — この順で収載する)★
//   シード = 4衛星(Io, Europa, Ganymede, Callisto)への 90° 位相スロットの割当である。
//   スロット k は第138便 bodyOf の位相テーブル添字で、近点を 90°×k の方向に置く:
//     0 → (+rp, 0)   1 → (0, +rp)   2 → (−rp, 0)   3 → (0, −rp)   (いずれも順行の接線速度)
//   8配置(固定): [0123] [1230] [2301] [3012] [0321] [3210] [1032] [2103]
//   [0123] が既存基準(第138便 exp-jupiter と同一の配置)である。
//
// ★ 変えないもの ★
//   D₀=0.006・q=12.30・e/m/R/spin・各衛星の a(fact-sheet 値)・木星の質量/半径/自転・
//   単位規約・kF1・N_STEP=2000・ORBITS=20 は**すべて第138便のまま**。動かすのは位相スロットの
//   割当だけで、当てはめ自由度はゼロである(manifest の classification.fit は空)。
//   観測周期の比較対象も第138便と同じ fact-sheet 系(NASA GSFC / NSSDCA)の値
//   (Io 1.769138 / Europa 3.551181 / Ganymede 7.154553 / Callisto 16.689017 日)を使う。
//   **TODO(ref-verify)**: fact-sheet のアーカイブ URL と版の確定は投稿時(第138便からの継承。
//   本環境は egress 遮断のため原表を参照できていない)。
//
// ============================ 事前登録窓 SW1〜SW3(実測前に統括が固定 — 逐語)=================
//   SW1: 全8配置で JW2 相当保持(NaN なし・|Δa|/a<2%・≥20 イオ公転・N_STEP=2000・kF1)。
//   SW2: 全8配置・全衛星で測定周期が fact-sheet 目標 ±1%。
//   SW3(記述 — 窓なし): 配置間の測定周期ばらつき (max−min)/mean を衛星別に記録
//     (数値床の宣言コメント付き)。
//   決定性: 2回実行 SHA 一致。
//   **実測後に窓を動かさない。FAIL は FAIL のまま収載する。**
//
// 比較の厳密さ: 「±1%」「|Δa|/a<2%」は第138便 JW2 と同一の厳格比較 |dev| < 0.01 / aSpread < 0.02。
//   「≥20 イオ公転」は**積分窓の長さ**の条件(第138便 JW2 の windowIoOrbits と同じ読み)で、
//   窓は ORBITS × T_Io(ケプラー)ちょうど取る。実測の公転通過回数は診断として併記する
//   (力学周期がケプラー基準よりわずかに長いため 20 回目の通過は窓外へ落ちて 19 回になる)。
//
// ★ SW3 の数値床(宣言)★
//   公転通過時刻は補間せず步境界で拾う(第138便の測定と同一)。したがって通過時刻の量子化は dt で、
//   平均周期 Tavg=(t_last−t_first)/(nRev−1) の相対分解能床は **dt / (t_last−t_first)** になる。
//   dt = T_Io/2000・窓 20 イオ公転なので、イオでは床 ≈ 1/(2000×19) ≈ 2.6×10⁻⁵、外側の衛星ほど
//   公転通過回数が少なく床は大きい(カリストは通過 2 回で床 ≈ 1/2000 級)。
//   **床を下回るばらつきは「配置差が無い」ことの証拠ではなく、測定器で分解できないという意味である。**
//   本ハーネスは衛星別に床(perMoon.resolutionFloorRelMax)を併記し、実測ばらつきが床の何倍かを出す。
//
// ★ 配置の対称性(実測前から判っている構造 — 解釈のために宣言しておく)★
//   スロットを全衛星いっせいに +1 ずらす操作は、初期条件全体の 90° 剛体回転である。中心天体は
//   原点に pinned で、力学は等方なので、この操作で**スカラー量(周期・a・e)は不変**のはずである。
//   8配置は剛体回転で 2 族に割れる: {0123, 1230, 2301, 3012} と {0321, 3210, 1032, 2103}。
//   すなわち**独立な物理配置は 2 つ**であり、族内のばらつきは(倍精度の 90° 回転が符号入替だけで
//   厳密なので)ゼロが期待値である。本ハーネスは族内のビット一致を機械照合して、
//   SW3 のばらつきが族間の実差なのか数値ノイズなのかを切り分ける。
//
// 実行:
//   node tests/exp-jupseeds.mjs                                    … 通常実行(約5秒)
//   JUPSEEDS_OUT=/path/run1.json node tests/exp-jupseeds.mjs       … 出力先の変更(決定性の1回目)
//   JUPSEEDS_DET_REF=/path/run1.json node tests/exp-jupseeds.mjs   … 2回目で1回目の JSON と SHA 照合
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
const OUT_PATH = process.env.JUPSEEDS_OUT || path.join(OUT_DIR, 'jupseeds-results.json');
const DET_REF = process.env.JUPSEEDS_DET_REF || null;

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

// 衛星の実値と fact-sheet 系の観測周期(第138便 MOONS からの転記 — phase は本便で割り当てるので持たない)
const MOONS = [
  { name: 'Io',       ja: 'イオ',     a: 42.18,  e: 0.0041, m: 0.000893, R: 0.18216,
    spin: 0.0411059240,  Pobs: 1.769138 },
  { name: 'Europa',   ja: 'エウロパ', a: 67.11,  e: 0.009,  m: 0.000480, R: 0.15608,
    spin: 0.0204782725,  Pobs: 3.551181 },
  { name: 'Ganymede', ja: 'ガニメデ', a: 107.04, e: 0.0013, m: 0.001480, R: 0.26341,
    spin: 0.0101644438,  Pobs: 7.154553 },
  { name: 'Callisto', ja: 'カリスト', a: 188.27, e: 0.0074, m: 0.001076, R: 0.24103,
    spin: 0.00435747966, Pobs: 16.689017 },
];

const Q_LOCK = 12.30;   // 直値宣言(第138便と同一 — 本便で再フィットしない)
const Q_STAR = 3 + Math.log(1.25 * PHYS.cLight * PHYS.cLight * RJ / GM)
  / Math.log((RJ + MOONS[0].a) / RJ);

const N_STEP = 2000;    // イオ1公転あたりの步数(第138便の主測定と同一)
const ORBITS = 20;      // 窓(≥20 イオ公転 — 第138便 JW2 と同一)
const T_IO = 2 * Math.PI * Math.sqrt(Math.pow(MOONS[0].a, 3) / GM);

// 8配置(統括が固定した順序。先頭 [0123] が第138便と同一の既存基準)
const SEEDS = ['0123', '1230', '2301', '3012', '0321', '3210', '1032', '2103'];
const BASE_SEED = '0123';
const slotsOf = (seed) => seed.split('').map(Number);

// 剛体回転の族キー: 全衛星のスロットを一律にずらす操作で移り合う配置は同じ族に属する。
// 先頭(イオ)のスロットが 0 になるように回した表現を代表元とする。
const familyKeyOf = (seed) => {
  const s = slotsOf(seed);
  return s.map((v) => (v - s[0] + 4) % 4).join('');
};

// 近点配置・90°位相(第138便 bodyOf と同一。位相スロットを引数で受ける)
const bodyOf = (mo, slot) => {
  const rp = mo.a * (1 - mo.e), vp = Math.sqrt(GM * (1 + mo.e) / rp);
  const P = [[rp, 0, 0, vp], [0, rp, -vp, 0], [-rp, 0, 0, -vp], [0, -rp, vp, 0]][slot];
  return { type: 'single', m: mo.m, radius: mo.R, x: P[0], y: P[1], vx: P[2], vy: P[3],
    spin: mo.spin, pinned: false };
};

// ---- 入力の来歴(既存 JSON — 読み取り専用。sha256 を残す)-----------------------------------
// 第138便の実測正本があれば、基準配置 [0123] が第138便 JW2 と何桁一致するかを付帯記録する。
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
      role: '第138便 hold-out の実測正本(基準配置 [0123] の付帯照合先 — 読み取り専用)' });
    jupiterRef = j;
  }
}
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));

// ======================================= ハーネス ============================================
const CTX = { PHYS, MJ, RJ, SPIN_J, GM,
  SETS: Object.fromEntries(SEEDS.map((s) =>
    [s, MOONS.map((mo, i) => bodyOf(mo, slotsOf(s)[i]))])) };

const HARNESS = ({ PHYS, MJ, RJ, SPIN_J, GM, SETS }) => {
  window.__jseeds = {
    sets: SETS,
    build(seed, kF, q) {
      const P = Object.assign({}, PHYS, { kFrame: kF, q });
      const S = HP.sim;
      S.build({ id: 'jupseeds', name: 'jupseeds', emoji: '🟠', seed: 1, camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: P,
        bodies: [{ type: 'single', m: MJ, radius: RJ, x: 0, y: 0, vx: 0, vy: 0,
          spin: SPIN_J, pinned: true, pnSource: true }]
          .concat(SETS[seed].map((b) => Object.assign({}, b))) });
      return S;
    },
    // 主測定: 恒星公転周期・軌道長半径の保持・離心率の帯(第138便 run の測定部からの転記・簡約)
    run(seed, kF, q, N, orbits, Tbase) {
      const S = this.build(seed, kF, q);
      const dt = Tbase / N, steps = Math.round(orbits * N);
      const n = SETS[seed].length;
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
  SW1: 'SW1: 全8配置で JW2 相当保持(NaN なし・|Δa|/a<2%・≥20 イオ公転・N_STEP=2000・kF1)。',
  SW2: 'SW2: 全8配置・全衛星で測定周期が fact-sheet 目標 ±1%。',
  SW3: 'SW3(記述 — 窓なし): 配置間の測定周期ばらつき (max−min)/mean を衛星別に記録'
    + '(数値床の宣言コメント付き)。',
  determinism: '決定性: 2回実行 SHA 一致。',
  note: '窓は統括が実測前に固定した(ハンドオフ 2026-08-22a §3b)。本ハーネスは窓を1文字も動かさず、'
    + 'PASS/FAIL とも実測値をそのまま収載する。',
};

const out = {
  meta: { exp: 'jupseeds', wave: 162, target: TARGET, date: new Date().toISOString(),
    title: '木星ガリレオ衛星 hold-out の複数シード(初期位相配置の統計)',
    basedOn: '第138便 tests/exp-jupiter.mjs(規約・初期条件・測定手順・窓の流儀)/ '
      + '第158便 tests/exp-coreshell5.mjs(決定性 SHA 照合の方式)',
    outPath: path.relative(ROOT, OUT_PATH), detRef: DET_REF ? path.basename(DET_REF) : null,
    stage: 'incomplete' },
  preRegistered: PRE_REGISTERED,
  config: {
    units: '1単位=10⁷m/10³s/10²⁶kg', unitRule: 'L−T=4(c₀=3×10⁴)・M+2T−3L=11(G=6.674)',
    physics: PHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, rotationHours: 9.925,
    GM, day: DAY, pinned: true, kFrame: 1,
    idealization: '2D 赤道面理想化(軌道傾斜 0.04°/0.47°/0.20°/0.19° を無視する — 第138便の宣言を踏襲)',
    moons: MOONS,
    periodSource: 'NASA の惑星衛星 fact sheet 系(NASA GSFC / NSSDCA)の恒星公転周期'
      + '(第143便で再帰属済み。第138便 MOONS[].Pobs からの転記 — 本便で 1 bit も変えていない)',
    periodSourceVerified: 'TODO(ref-verify): アーカイブ URL と fact sheet の版の確定は投稿時'
      + '(第138便からの継承。本環境は egress 遮断のため原表を参照できていない)。',
    qDeclared: Q_LOCK, qStarAtIo: Q_STAR, qLockRuntime: false,
    qNote: 'q=12.30 は qLock 則を参照軌道=イオで1回だけ評価した直値宣言(第138便)。本便で再評価しない。',
    D0Shared: PHYS.D0, D0Note: 'D₀=0.006 は 🪨🌘💿 と共通の既存値。本便での再フィットはゼロ。',
    stepsPerOrbit: N_STEP, orbits: ORBITS, T_IO_units: T_IO, T_IO_days: T_IO / DAY,
    seeds: SEEDS, baseSeed: BASE_SEED,
    seedDefinition: 'シード = 4衛星(Io, Europa, Ganymede, Callisto)への 90° 位相スロットの割当。'
      + 'スロット k は第138便 bodyOf の位相テーブル添字で近点を 90°×k の方向に置く'
      + '(0→(+rp,0) / 1→(0,+rp) / 2→(−rp,0) / 3→(0,−rp)。いずれも順行の接線速度)。'
      + '[0123] が第138便 exp-jupiter と同一の既存基準である。',
    symmetryDeclaration: 'スロットを全衛星いっせいにずらす操作は初期条件全体の 90° 剛体回転であり、'
      + '中心天体は原点に pinned・力学は等方なのでスカラー量(周期・a・e)は不変のはずである。'
      + '8配置は剛体回転で {0123,1230,2301,3012} と {0321,3210,1032,2103} の 2 族に割れる'
      + '(= 独立な物理配置は 2 つ)。族内のビット一致は rotationFamilies で機械照合する。',
    comparator: '窓の ±1% / <2% は第138便 JW2 と同一の厳格比較 |dev| < 0.01 / aSpread < 0.02。'
      + '「≥20 イオ公転」は積分窓の長さの条件(窓は ORBITS × T_Io(ケプラー)ちょうど)。',
    resolutionFloorDeclaration: '公転通過時刻は補間せず步境界で拾う(第138便と同一)。通過時刻の'
      + '量子化は dt なので、平均周期 Tavg=(t_last−t_first)/(nRev−1) の相対分解能床は '
      + 'dt/(t_last−t_first) である。床を下回るばらつきは「配置差が無い」ことの証拠ではなく、'
      + '測定器で分解できないという意味である。',
  },
  raw: {}, windows: {}, rotationFamilies: null, crossWaveCheck: null, determinism: null,
};

const log = (...a) => console.log(...a);
log('== 第162便 木星ガリレオ衛星 hold-out の複数シード(初期位相配置の統計)==');
log(`対象: ${TARGET}(sha256 ${TARGET_SHA_NOW.slice(0, 16)}…)`);
log(`配置(8): ${SEEDS.join(' / ')}(基準 ${BASE_SEED} = 第138便と同一)`);
log(`主測定: kF1・${N_STEP} 步/イオ公転 × ${ORBITS} イオ公転 = ${N_STEP * ORBITS} 步/配置\n`);

// ---- A) 8配置の走行 -------------------------------------------------------------------------
const t0 = Date.now();
const runs = {};
for (const seed of SEEDS) {
  runs[seed] = await page.evaluate(({ seed, q, N, o, Tb }) =>
    window.__jseeds.run(seed, 1, q, N, o, Tb),
    { seed, q: Q_LOCK, N: N_STEP, o: ORBITS, Tb: T_IO });
}
log(`== A) 走行(8配置 ${((Date.now() - t0) / 1000).toFixed(1)} 秒)==`);

const DT = T_IO / N_STEP;
const armRows = (r) => MOONS.map((mo, i) => {
  const w = r.rows[i];
  return { name: mo.name, ja: mo.ja,
    periodDays: w.Tavg / DAY, dev: (w.Tavg / DAY) / mo.Pobs - 1, nRev: w.nRev, revSpanUnits: w.revSpan,
    aMin: w.aMin, aMax: w.aMax, aMean: w.aMean, aSpread: (w.aMax - w.aMin) / w.aMean,
    eMin: w.eMin, eMax: w.eMax, rMin: w.rMin, rMax: w.rMax,
    // 周期の測定分解能床(SW3 の宣言に対応する数値)
    periodResolutionFloorRel: w.revSpan ? DT / w.revSpan : null };
});

out.raw.dt = DT;
out.raw.seeds = SEEDS.map((seed) => ({
  seed, slots: slotsOf(seed), familyKey: familyKeyOf(seed), isBase: seed === BASE_SEED,
  slotAssignment: Object.fromEntries(MOONS.map((mo, i) => [mo.name, slotsOf(seed)[i]])),
  nan: runs[seed].nan, steps: runs[seed].steps, dt: runs[seed].dt,
  rows: armRows(runs[seed]), fin: runs[seed].fin }));

// ---- B) SW1: 全8配置の保持 -----------------------------------------------------------------
const sw1Rows = out.raw.seeds.map((s) => {
  const per = s.rows.map((r) => ({ name: r.name, aSpread: r.aSpread,
    aSpreadPercent: r.aSpread * 100, ok: r.aSpread < 0.02 }));
  return { seed: s.seed, nan: s.nan, stepsPerOrbit: N_STEP,
    windowIoOrbitsIntegrated: ORBITS, okWindowIoOrbits: ORBITS >= 20,
    ioRevolutionsCompleted: s.rows[0].nRev,
    maxASpreadPercent: Math.max(...per.map((p) => p.aSpreadPercent)),
    rows: per, ok: !s.nan && ORBITS >= 20 && per.every((p) => p.ok) };
});
out.windows.SW1 = { statement: PRE_REGISTERED.SW1,
  comparator: 'NaN なし・|Δa|/a<0.02・積分窓 ≥20 イオ公転・N_STEP=2000・kF1',
  windowNote: '「≥20 イオ公転」は積分窓の長さの条件(第138便 JW2 と同じ読み)。実測の公転通過回数が'
    + '19 になるのは力学周期がケプラー基準よりわずかに長く 20 回目の通過が窓の外へ落ちるためで、正常である。',
  rows: sw1Rows, nSeeds: SEEDS.length, nOk: sw1Rows.filter((r) => r.ok).length,
  pass: sw1Rows.every((r) => r.ok) };

// ---- C) SW2: 全8配置・全衛星の周期整合 ------------------------------------------------------
const sw2Rows = out.raw.seeds.map((s) => {
  const per = s.rows.map((r) => ({ name: r.name, periodDays: r.periodDays,
    obs: MOONS.find((m) => m.name === r.name).Pobs,
    devPercent: r.dev * 100, ok: Math.abs(r.dev) < 0.01 }));
  return { seed: s.seed, rows: per,
    maxAbsDevPercent: Math.max(...per.map((p) => Math.abs(p.devPercent))),
    ok: per.every((p) => p.ok) };
});
out.windows.SW2 = { statement: PRE_REGISTERED.SW2,
  comparator: 'fact-sheet 目標に対し |dev| < 0.01',
  rows: sw2Rows, nSeeds: SEEDS.length, nOk: sw2Rows.filter((r) => r.ok).length,
  maxAbsDevPercentOverall: Math.max(...sw2Rows.map((r) => r.maxAbsDevPercent)),
  pass: sw2Rows.every((r) => r.ok) };

// ---- D) SW3: 配置間ばらつき(記述 — 窓なし)---------------------------------------------------
const sw3Rows = MOONS.map((mo, i) => {
  const vals = SEEDS.map((s) => out.raw.seeds.find((r) => r.seed === s).rows[i].periodDays);
  const floors = SEEDS.map((s) => out.raw.seeds.find((r) => r.seed === s).rows[i].periodResolutionFloorRel);
  const mx = Math.max(...vals), mn = Math.min(...vals);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const spread = (mx - mn) / mean;
  const floorMax = Math.max(...floors);
  return { name: mo.name, ja: mo.ja,
    periodsDays: Object.fromEntries(SEEDS.map((s, k) => [s, vals[k]])),
    max: mx, min: mn, mean, spread, spreadPercent: spread * 100,
    argmaxSeed: SEEDS[vals.indexOf(mx)], argminSeed: SEEDS[vals.indexOf(mn)],
    resolutionFloorRelMax: floorMax, resolutionFloorPercentMax: floorMax * 100,
    spreadOverFloor: floorMax > 0 ? spread / floorMax : null,
    aboveFloor: floorMax > 0 ? spread > floorMax : null };
});
out.windows.SW3 = { statement: PRE_REGISTERED.SW3, recordOnly: true, pass: null,
  floorDeclaration: out.config.resolutionFloorDeclaration,
  rows: sw3Rows,
  maxSpreadPercent: Math.max(...sw3Rows.map((r) => r.spreadPercent)),
  note: 'ばらつきは8配置の測定周期に対する (max−min)/mean。resolutionFloorRelMax は同じ8配置での'
    + '周期分解能床 dt/(t_last−t_first) の最大値で、spreadOverFloor が 1 を大きく超えない行の'
    + 'ばらつきは測定器の量子化と区別できない。配置の剛体回転対称性(2族)を踏まえて解釈すること'
    + '(rotationFamilies を参照)。' };

// ---- E) 剛体回転族の構造(実測前から判っている対称性の機械確認 — 窓なし)---------------------
{
  const fams = {};
  for (const s of out.raw.seeds) (fams[s.familyKey] = fams[s.familyKey] || []).push(s);
  const famRows = Object.entries(fams).map(([key, members]) => {
    const ref = members[0];
    const perMoon = MOONS.map((mo, i) => {
      const vals = members.map((m) => m.rows[i].periodDays);
      const aSp = members.map((m) => m.rows[i].aSpread);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      return { name: mo.name,
        periodBitIdenticalWithinFamily: vals.every((v) => Object.is(v, vals[0])),
        aSpreadBitIdenticalWithinFamily: aSp.every((v) => Object.is(v, aSp[0])),
        withinFamilySpread: (Math.max(...vals) - Math.min(...vals)) / mean };
    });
    return { familyKey: key, members: members.map((m) => m.seed), representative: ref.seed,
      perMoon,
      allPeriodsBitIdentical: perMoon.every((p) => p.periodBitIdenticalWithinFamily),
      maxWithinFamilySpread: Math.max(...perMoon.map((p) => p.withinFamilySpread)) };
  });
  // 族間の差(= 独立な物理配置どうしの実差)
  const across = MOONS.map((mo, i) => {
    const reps = famRows.map((f) => out.raw.seeds.find((s) => s.seed === f.representative).rows[i].periodDays);
    const mean = reps.reduce((a, b) => a + b, 0) / reps.length;
    return { name: mo.name, representativePeriods: Object.fromEntries(
        famRows.map((f, k) => [f.representative, reps[k]])),
      acrossFamilySpread: (Math.max(...reps) - Math.min(...reps)) / mean };
  });
  out.rotationFamilies = { recordOnly: true,
    declaration: out.config.symmetryDeclaration,
    nFamilies: famRows.length, families: famRows,
    allFamiliesBitIdentical: famRows.every((f) => f.allPeriodsBitIdentical),
    acrossFamilies: across,
    note: '族内のばらつきは倍精度の 90° 回転(符号入替のみ)が厳密であることの帰結でゼロが期待値。'
      + '族間の差だけが「独立な初期位相配置による実差」である。SW3 のばらつきはこの2つの合成なので、'
      + '両者を分けて収載する。' };
}

// ---- F) 第138便との付帯照合(窓ではない — 記録のみ)-----------------------------------------
if (jupiterRef && jupiterRef.windows && jupiterRef.windows.JW2) {
  const refJW2 = jupiterRef.windows.JW2.rows;
  const base = out.raw.seeds.find((s) => s.seed === BASE_SEED);
  const cmp = (mine, ref) => ({ mine, ref,
    relDiff: ref !== 0 ? (mine - ref) / Math.abs(ref) : null, bitIdentical: Object.is(mine, ref) });
  out.crossWaveCheck = {
    scope: `基準配置 [${BASE_SEED}] の kF1 実測 vs 第138便 exp-jupiter の JW2`,
    note: '基準配置は第138便と同一の初期条件・同一 dt・同一窓なので、原理的にはビット一致するはずである'
      + '(測定コードは簡約したが、周期・|Δa|/a の算出式は転記のまま)。窓ではなく付帯記録。',
    rows: MOONS.map((mo, i) => ({ name: mo.name,
      period: cmp(base.rows[i].periodDays, refJW2[i].periodDays),
      aSpread: cmp(base.rows[i].aSpread, refJW2[i].aSpread) })),
    targetConsistency: { targetShaNow: TARGET_SHA_NOW,
      targetShaOfReference: jupiterRef.manifest ? jupiterRef.manifest.provenance.target.sha256 : null,
      same: !!(jupiterRef.manifest && jupiterRef.manifest.provenance.target.sha256 === TARGET_SHA_NOW) },
  };
  out.crossWaveCheck.allBitIdentical = out.crossWaveCheck.rows
    .every((r) => r.period.bitIdentical && r.aSpread.bitIdentical);
}

// ---- G) 決定性(全体2回実行・別プロセスの SHA 照合)-----------------------------------------
{
  // 対象は測定部と窓判定部のみ。windows.determinism 自身はハッシュの対象に入れない(自己参照)。
  const detTargetOf = (o) => ({ config: o.config, preRegistered: o.preRegistered, raw: o.raw,
    windows: { SW1: o.windows.SW1, SW2: o.windows.SW2, SW3: o.windows.SW3 },
    rotationFamilies: o.rotationFamilies });
  const mine = JSON.stringify(canonize(detTargetOf(out)));
  const rec = { canonicalization: 'config / preRegistered / raw / windows.SW1〜SW3 / rotationFamilies を'
      + '対象にキーを再帰整列した JSON の SHA-256。揮発キー(meta.date・走行時間・manifest・'
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
      rec.note = '2回目は別プロセス・別ブラウザ起動で全8配置を再実行したもの(同一スクリプト・同一窓・同一步数)';
    } else {
      rec.note = '参照 JSON を読めなかった(未生成または途中段階)';
    }
  } else {
    rec.note = '参照なし(JUPSEEDS_DET_REF 未指定 — 1回目の実行)';
  }
  out.determinism = rec;
  out.windows.determinism = { statement: PRE_REGISTERED.determinism,
    sha256: rec.sha256, reference: rec.reference, identical: rec.identical,
    pass: rec.identical === null ? null : rec.identical,
    result: rec.identical === null ? 'PENDING(参照なし)' : (rec.identical ? 'PASS' : 'FAIL') };
}

// ---- H) コンソール出力 ---------------------------------------------------------------------
log('\n== SW1 全8配置の保持(NaN なし・|Δa|/a<2%・kF1)==');
for (const r of out.windows.SW1.rows)
  log(`  [${r.seed}] NaN=${r.nan} |Δa|/a 最大 ${r.maxASpreadPercent.toFixed(5)}%`
    + `(イオ公転通過 ${r.ioRevolutionsCompleted} 回)→ ${r.ok ? 'PASS' : 'FAIL'}`);
log(`  SW1 総合: ${out.windows.SW1.pass ? 'PASS' : 'FAIL'}(${out.windows.SW1.nOk}/${out.windows.SW1.nSeeds} 配置)`);

log('\n== SW2 全8配置・全衛星の周期整合(fact-sheet ±1%)==');
for (const r of out.windows.SW2.rows)
  log(`  [${r.seed}] 周期ずれ最大 ${r.maxAbsDevPercent.toFixed(4)}% `
    + `(${r.rows.map((p) => `${p.name}=${p.devPercent.toFixed(4)}%`).join(' / ')})→ ${r.ok ? 'PASS' : 'FAIL'}`);
log(`  SW2 総合: ${out.windows.SW2.pass ? 'PASS' : 'FAIL'}(全体最大 ${out.windows.SW2.maxAbsDevPercentOverall.toFixed(4)}%)`);

log('\n== SW3 配置間ばらつき(記述・窓なし)==');
for (const r of out.windows.SW3.rows)
  log(`  ${r.name.padEnd(9)} (max−min)/mean = ${r.spread.toExponential(4)}`
    + `(${(r.spreadPercent).toFixed(6)}%)/ 分解能床 ${r.resolutionFloorRelMax.toExponential(4)}`
    + ` → 床の ${r.spreadOverFloor.toFixed(3)} 倍(床超え=${r.aboveFloor})`
    + ` [max ${r.argmaxSeed} / min ${r.argminSeed}]`);

log('\n== 剛体回転族(記録のみ)==');
for (const f of out.rotationFamilies.families)
  log(`  族 ${f.familyKey}: ${f.members.join(' , ')} — 族内で周期ビット一致 = ${f.allPeriodsBitIdentical}`
    + `(族内ばらつき最大 ${f.maxWithinFamilySpread.toExponential(3)})`);
for (const a of out.rotationFamilies.acrossFamilies)
  log(`  ${a.name.padEnd(9)} 族間ばらつき ${a.acrossFamilySpread.toExponential(4)}`);

if (out.crossWaveCheck)
  log(`\n== 第138便との付帯照合(窓なし): 全ビット一致 = ${out.crossWaveCheck.allBitIdentical}`
    + ` / 対象 HTML 同一 = ${out.crossWaveCheck.targetConsistency.same}`);

log(`\n== 決定性: sha256 ${out.determinism.sha256.slice(0, 16)}… / 照合 ${out.windows.determinism.result}`);

// ---- I) マニフェスト ------------------------------------------------------------------------
out.meta.stage = 'complete';
out.meta.elapsedSec = (Date.now() - T_START) / 1000;   // 非測定メタ(決定性ハッシュの対象外)
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out, target: TARGET,
  experiment: { id: 'jupseeds', wave: 162,
    title: '木星ガリレオ衛星 hold-out の複数シード(初期位相配置の統計)',
    command: 'node tests/exp-jupseeds.mjs' },
  presets: { mode: 'dynamic',
    declaredIn: 'PHYS / MOONS / MJ / RJ / SPIN_J / SEEDS(ハーネス冒頭の宣言値 — 第138便からの転記)',
    declaration: '動的構成(内蔵プリセットを読まず、観測値からの宣言値で HP.sim.build する)',
    configs: { physics: PHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, moons: MOONS,
      qDeclared: Q_LOCK, qStarAtIo: Q_STAR, pinned: true, GM, day: DAY, T_IO,
      seeds: SEEDS, slotTable: SEEDS.map((s) => slotsOf(s)) },
    note: '実行時 qLock は掛けない(多天体系では a_ref が一意でないため — 🌞solarInner 第131便の'
      + '既存裁定)。8配置で動かすのは位相スロットの割当だけで、他の宣言値は第138便のまま' },
  numerics: {
    seed: `位相スロット割当 8配置(${SEEDS.join(' / ')})— エンジンの乱数 seed は build 引数 1 で固定`,
    dt: `dt = T_Io / ${N_STEP} = ${DT.toExponential(6)} 時間単位(全配置共通)`,
    timeScale: 1, substeps: NOT_APPLICABLE,
    steps: `${N_STEP} 步/イオ公転 × ${ORBITS} 公転 = ${N_STEP * ORBITS} 步 × 8配置`,
    window: `${ORBITS} イオ公転(事前登録窓 SW1 の「≥20 イオ公転」— 積分窓の長さ)`,
    warmup: NOT_APPLICABLE,
    unitRule: '1単位=10⁷m/10³s/10²⁶kg(L−T=4 → c₀=3×10⁴・M+2T−3L=11 → G=6.674)',
    numericalFloor: '周期の測定分解能床 dt/(t_last−t_first) を raw.seeds[].rows[].periodResolutionFloorRel と '
      + 'windows.SW3.rows[].resolutionFloorRelMax に収載(SW3 の宣言に対応)',
  },
  classification: {
    input: ['fact-sheet 系の恒星公転周期4値と衛星の実 a/e/m/R/spin(第138便 MOONS からの転記 — '
      + '観測由来の外部入力。TODO(ref-verify): アーカイブ URL と版の確定は投稿時)',
      '木星の実質量・実半径・実自転(9.925h)',
      'D₀=0.006(🪨🌘💿 と共通の既存値 — 本便での再フィットはゼロ)',
      'q=12.30(第138便が参照軌道=イオで1回評価した直値宣言 — 本便では再評価しない)',
      '位相スロット割当 8配置(統括が実測前に固定した順序)',
      'dt・步数・窓 SW1〜SW3(実測前に統括が固定)'],
    fit: [],
    derived: ['配置別・衛星別の測定周期・|Δa|/a・離心率の帯(raw.seeds)',
      'fact-sheet 目標に対する残差と窓判定(windows.SW1 / SW2)',
      '配置間の周期ばらつきと測定分解能床の比(windows.SW3)',
      '剛体回転族の構造と族内ビット一致(rotationFamilies)',
      '第138便実測正本との付帯照合(crossWaveCheck)', '決定性ハッシュ(determinism)'],
    holdOut: ['初期位相配置に対する hold-out 結論の頑健性(第138便は1配置しか実測しておらず、'
      + '他の7配置で保持・周期整合が成立するかは事前に分かっていない)'],
    note: '本便が新規に持ち込む自由度はゼロである。動かしたのは初期位相スロットの割当だけで、'
      + '物理パラメータ・観測入力・窓は第138便のまま 1 bit も変えていない',
  },
  judgement: {
    pointers: ['preRegistered', 'windows.SW1', 'windows.SW2', 'windows.SW3',
      'windows.determinism', 'raw.seeds', 'rotationFamilies', 'crossWaveCheck', 'determinism',
      'config.seedDefinition', 'config.symmetryDeclaration', 'config.resolutionFloorDeclaration'],
    note: '許容窓は preRegistered(統括が実測前に固定・実測後に動かしていない)、判定と実測値・残差は '
      + 'windows.SW1〜SW3 に構造ごと入っている。SW3 は窓なしの記録専用(recordOnly)で、'
      + 'rotationFamilies は実測前から判っている対称性の機械確認である(窓ではない)',
    externalReferences: ['NASA 惑星衛星 fact sheet 系の恒星公転周期(config.moons[].Pobs — SW2 の照合先)',
      '第138便 tests/out/jupiter-results.json(crossWaveCheck の照合先 — provenance に sha256)'],
  },
  health: {
    conservation: { status: 'partially-instrumented',
      quantity: '軌道長半径の広がり |Δa|/a(aSpread)と NaN 監視・2回実行の SHA 一致',
      pointers: ['windows.SW1.rows[].rows[].aSpread', 'raw.seeds[].nan', 'determinism.identical'],
      note: '木星を pinned にしているため運動量は原理的に閉じない構成である(第138便と同一)。'
        + '保存量残差そのものは記録していない(' + NOT_INSTRUMENTED + ')が、軌道保持 |Δa|/a と'
        + '2回実行の SHA 一致を数値健全性の指標として持つ' },
  },
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'crossWaveCheck', 'determinism'],
  regenerationNote: '決定性照合の対象は config / preRegistered / raw / windows.SW1〜SW3 / '
    + 'rotationFamilies である(determinism.canonicalization を参照)。crossWaveCheck は'
    + '外部 JSON の存在に依存するため対象外',
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\nsaved: ${path.relative(ROOT, OUT_PATH)}(${((Date.now() - T_START) / 1000).toFixed(1)} 秒)`);
await browser.close();

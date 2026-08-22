// 第164便 exp-qexact.mjs — q_exact 変種の頑健性(qLock 則の厳密一致式へ q だけ置換した4系の再走行)
// ============================================================================================
// 位置づけ: qLock 則 q* = 3 + ln(1.25c₀²R/GM)/ln((R+a)/R) は**遠方近似 a≫R** で振幅を LT 級へ
//   置きにいく規約である(第123便 exp-kf1d §A の導出)。有限半径因子を落とさない**厳密一致式**は
//     q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)
//   で、a≫R なら ln(a/(R+a))→0 なので q_exact→q* に戻る(第141便 exp-jupiter.mjs §H③ が
//   木星系でだけ「採らなかった代替規約」として付帯記録していた式)。
//   本便は **q だけを q_exact 直値へ置換し、他の全パラメータ(D₀=0.006 の共有較正値・初速較正
//   係数 f・ソフトニング・窓・seed)は再フィットなしで不変**のまま、実較正4系を走行して
//   主較正観測量が既存窓に入り続けるかを測る。PASS なら「規約の選択に対する頑健性」の証拠に、
//   FAIL なら「遠方近似が効いている系はどれか」の定量記録になる — どちらも価値がある。
//
// 4系と主較正観測量(いずれも**既存の事前登録窓をそのまま流用**する — 窓の新設・再設定はしない):
//   ☄️🪨 水星 mercuryRealKF1  … 引きずり歳差 |Δϖ(kF1)−Δϖ(kF0)| rad/公転
//                                 窓 = プリセット claims mercuryRealKF1.drag-precession の
//                                 expected {min:5.0e-10, max:6.2e-10}(実行時に対象 HTML から読む)
//                                 併記窓 = exp-kf1c.mjs §D1 の |引きずり| < 5.02e-7/8
//   🌙🌘 地球月 earthMoonRealKF1 … 近点回転比 Δϖ/0.05311(目標 1.0)
//                                 窓 = exp-kf1c.mjs §D2 の 0.85〜1.15
//   💿🛰️ 土星環 saturnRingRealKF1 … 環偏心テスト粒子の近点移動 |Δϖ(kF1,q)−Δϖ(kF0)| rad/公転
//                                 窓 = プリセット claims saturnRingRealKF1.ring-apsidal-drift の
//                                 expected {min:1e-5, max:3e-5}(実行時に対象 HTML から読む)
//   🟠 木星ガリレオ衛星         … 事前登録窓 JW2(NaN なし・|Δa|/a<2%・周期 ±1%)
//                                 窓 = exp-jupiter.mjs windowsPreRegistered.JW2
//
// 対象 HTML の既定を index.html にしてある理由(重要 — 転記の機械証拠が成立する条件):
//   既存 JSON(kf1c/kf1d/jupiter-results.json)を出した対象は「beta/index.html @ fbaef3a4」で、
//   その実体は **現 HEAD の root index.html とバイト同一**(SHA-256 efda285a…)である。基線再測の
//   ビット一致照合が「転記が正しいこと」の証拠として機能するよう、既定対象をその実体に合わせる。
//   QA_TARGET=beta/index.html でも回せるが、その場合ビット一致は対象差で不成立になりうる
//   (対象 SHA の異同は out.targetConsistency に機械記録する)。
//
// 実行: node tests/exp-qexact.mjs(playwright 必須)→ tests/out/qexact-results.json
//   QEX_OUT=/path/x.json node tests/exp-qexact.mjs          … 出力先の変更(決定性の2回実行に使う)
//   QEX_DET_REF=/path/run1.json node tests/exp-qexact.mjs   … 2回目実行で1回目の JSON と SHA 照合
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
const OUT_PATH = process.env.QEX_OUT ? path.resolve(process.env.QEX_OUT)
  : path.join(OUT_DIR, 'qexact-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
// 正準化(決定性ハッシュ — exp-coreshell5.mjs と同一方式)
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
const PRE_REGISTERED = {
  fixedBy: '統括(ハンドオフ 2026-08-22a §3b)', fixedBefore: '実測',
  designPrinciples: {
    oneKnobOnly: '**q だけ**を q_exact 直値へ置換する。他の全パラメータは不変 — D₀=0.006(共有較正値)・' +
      '初速較正係数 f=0.9968(🌘)・ソフトニング・seed・窓・步幅・体の初期条件のいずれも再フィットしない。',
    windowsReused: '判定窓は**既存の事前登録窓をそのまま流用する**。窓の新設・再設定は行わない。',
    noExistingFileTouched: '既存プリセット・既存結果 JSON・既存ハーネスは一切変更しない。' +
      '本便は新規ファイル(tests/exp-qexact.mjs → tests/out/qexact-results.json)だけで完結する。',
    failIsData: 'PASS/FAIL とも実測値をそのまま収載する(FAIL でも書き換えない)。FAIL は' +
      '「その系で遠方近似 a≫R が効いていない」ことの定量記録である。',
  },
  QW1: {
    role: '主窓',
    verbatim: 'QW1(主窓): 各系の主較正観測量が q_exact 直値走行でも**既存窓の数値をそのまま流用した' +
      '同一窓**に入る(窓の新設・再設定なし)。',
    perSystem: {
      mercury: '|Δϖ_drag| = |Δϖ(kF1,q)−Δϖ(kF0)| が 5.0×10⁻¹⁰ 〜 6.2×10⁻¹⁰ rad/公転' +
        '(出典: プリセット mercuryRealKF1 の claims「mercuryRealKF1.drag-precession」' +
        'expected {min:5.0e-10, max:6.2e-10} — 実行時に対象 HTML から読み取る)。' +
        '併記窓: |Δϖ_drag| < 5.02e-7/8 = 6.275×10⁻⁸(出典: tests/exp-kf1c.mjs §D1)',
      earthMoon: 'Δϖ比 = Δϖ/0.05311 が 0.85 〜 1.15(出典: tests/exp-kf1c.mjs §D2 — ' +
        '「第120便の窓依存 ±15% と同水準」)',
      saturnRing: '環偏心テスト粒子の近点移動 |Δϖ(kF1,q)−Δϖ(kF0)| が 1×10⁻⁵ 〜 3×10⁻⁵ rad/公転' +
        '(出典: プリセット saturnRingRealKF1 の claims「saturnRingRealKF1.ring-apsidal-drift」' +
        'expected {min:1e-5, max:3e-5} — 実行時に対象 HTML から読み取る)。' +
        '窓の**適用先プローブ**は claims 説明文が対にしている「q=3 で 0.23 rad/公転」に一致する' +
        'ものとする(kf1d §B の4プローブのうち a=80 だけが 0.23 — 同定の機械証拠は ' +
        'systems.saturnRing.window.referentEvidence)。窓の数値は流用のまま動かさない。' +
        '4プローブ全部へ当てた場合の判定も参考として併記する(基線 q* での成否も併記 — ' +
        'a=105 は基線でも窓外なので、その窓は元からそのプローブについてのものではない)',
      jupiter: 'JW2 と同一条件 — NaN なし・4衛星とも |Δa|/a<2% かつ 恒星公転周期が観測値と ±1%' +
        '(出典: tests/exp-jupiter.mjs windowsPreRegistered.JW2・窓は 20 イオ公転)',
    },
  },
  QW2: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'QW2(記述 — 窓なし): q* 走行(基線再測)との観測量相対差を記録。',
    window: 'なし(記述のみ)',
  },
  QW3: {
    role: '窓(決定性)',
    verbatim: 'QW3(決定性): 全体2回実行(別プロセス)で揮発キー除外の正規化 JSON SHA-256 一致' +
      '(coreshell5 方式)。',
    canonicalization: '対象は out.systems(実測部)のみ。日時・環境・経過時間などの揮発キーは' +
      'meta / manifest 側にしか置かないので、対象内に除外すべき揮発値は存在しない',
  },
  invariants: {
    verbatim: '既存プリセット・既存結果 JSON は不変(新規ファイルのみ)。基線再測が既存 JSON の' +
      '対応値とビット一致するかも照合して収載(転記の機械証拠)。',
  },
  transcriptionGate: {
    rule: '各系の q* 直値から q_exact を式で再計算し、第141便系列の参照値と転記照合する。' +
      '丸め4桁を超える差(= 参照値の表記桁の 1/2 単位を超える差)があれば**実測せず停止**して報告する。',
    references: { mercury: 6.147, earthMoon: 8.236, saturnRing: 20.49, jupiter: 12.06 },
    referenceSource: 'ハンドオフ 2026-08-22a §3b が転記した第141便系列の参照値' +
      '(☄️🪨 水星 6.147・🌙🌘 地球月 8.236・💿🛰️ 土星 20.49・🟠 木星 12.06)',
  },
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'kf1c', file: 'kf1c-results.json',
    role: '第122便の実測正本(🪨 水星 q スキャン・🌘 地球月 較正保存・統合判定 §D の窓の出典)' },
  { key: 'kf1d', file: 'kf1d-results.json',
    role: '第123便の実測正本(qLock 則 q* の算出値・🪨🌘 の q* 走行・💿 環系 §B の基線)' },
  { key: 'jupiter', file: 'jupiter-results.json',
    role: '第138便の実測正本(🟠 の事前登録窓 JW1/JW2 と第141便 §H の q_exact 対照)' },
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
    '一致していれば「基線再測が既存 JSON とビット一致するか」が転記の正しさの証拠として機能する。' +
    '一致していない場合、ビット不一致は転記ミスではなく対象差の可能性があるので、相対差も併せて読む',
};

// ==================== qLock 則と厳密一致式 ====================
// qCalc は tests/exp-kf1d.mjs の同名関数を逐語転記(遠方近似の qLock 則)
const qStarCalc = (c, R, G, M, a) => 3 + Math.log(1.25 * c * c * R / (G * M)) / Math.log((R + a) / R);
// 厳密一致式(有限半径因子を落とさない版 — tests/exp-jupiter.mjs §H③ の Q_EXACT と同一形)
const qExactCalc = (c, R, G, M, a) => qStarCalc(c, R, G, M, a) + 3 * Math.log(a / (R + a)) / Math.log((R + a) / R);

// 各系の q 算出入力(すべて既存ハーネス/プリセットの宣言値の逐語転記)
const Q_INPUTS = {
  // 出典: tests/exp-kf1d.mjs §A `qCalc(30000, 6.95, 6.674, 1988.5, 460.012)`(🪨 近日点基準)
  mercury: { c: 30000, R: 6.95, G: 6.674, M: 1988.5, aRef: 460.012,
    source: 'tests/exp-kf1d.mjs §A qCalc(30000, 6.95, 6.674, 1988.5, 460.012)(参照軌道=近日点距離)',
    presetDeclaredQ: 6.16, presetId: 'mercuryRealKF1' },
  // 出典: tests/exp-kf1d.mjs §A `qCalc(30000, 6.38, 6.674, 0.59724, 363.63)`(🌘 近地点基準)
  earthMoon: { c: 30000, R: 6.38, G: 6.674, M: 0.59724, aRef: 363.63,
    source: 'tests/exp-kf1d.mjs §A qCalc(30000, 6.38, 6.674, 0.59724, 363.63)(参照軌道=近地点距離)',
    presetDeclaredQ: 8.25, presetId: 'earthMoonRealKF1' },
  // 出典: tests/exp-kf1d.mjs §B `qCalc(30000, 60.3, 6.674, 56.834, 105)`(参照=環中央値≈B環)
  saturnRing: { c: 30000, R: 60.3, G: 6.674, M: 56.834, aRef: 105,
    source: 'tests/exp-kf1d.mjs §B qCalc(30000, 60.3, 6.674, 56.834, 105)(参照=環中央値≈B環)',
    presetDeclaredQ: 21.8, presetId: 'saturnRingRealKF1' },
  // 出典: tests/exp-jupiter.mjs Q_STAR(参照軌道=イオ a=42.18・GM=PHYS.G×MJ=6.674×18.98)
  jupiter: { c: 30000, R: 7.1492, G: 6.674, M: 18.98, aRef: 42.18,
    source: 'tests/exp-jupiter.mjs Q_STAR(参照軌道=イオ a=42.18・R=RJ=7.1492・GM=6.674×18.98)',
    presetDeclaredQ: 12.30, presetId: '(内蔵プリセットなし — ハーネス直値 Q_LOCK=12.30)' },
};

// ---- 転記照合(実測前のゲート)----------------------------------------------------------
// 参照値の表記桁の 1/2 単位を許容とする(6.147 → 0.0005 / 20.49 → 0.005 — 「丸め4桁」の意味)
const REF_TOL = { mercury: 0.0005, earthMoon: 0.0005, saturnRing: 0.005, jupiter: 0.005 };
const qTable = {};
for (const [k, v] of Object.entries(Q_INPUTS)) {
  const qStar = qStarCalc(v.c, v.R, v.G, v.M, v.aRef);
  const qExact = qExactCalc(v.c, v.R, v.G, v.M, v.aRef);
  const ref = PRE_REGISTERED.transcriptionGate.references[k];
  const diff = qExact - ref;
  qTable[k] = { inputs: v, qStar, qExact,
    finiteRadiusCorrection: qExact - qStar,
    lnRatio: Math.log((v.R + v.aRef) / v.R),
    reference: ref, diffFromReference: diff, tolerance: REF_TOL[k],
    match: Math.abs(diff) <= REF_TOL[k],
    qExactRounded: +qExact.toFixed(String(ref).split('.')[1].length),
    note: 'q* は既存ハーネスの宣言式・宣言入力から再計算した値(プリセット直値は presetDeclaredQ に併記)。' +
      'q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)' };
}
const transcription = { rule: PRE_REGISTERED.transcriptionGate.rule, rows: qTable,
  allMatch: Object.values(qTable).every((r) => r.match) };

console.log('== 第164便 q_exact 変種・4系の頑健性 ==');
console.log(`対象: ${TARGET}(SHA ${TARGET_SHA_NOW.slice(0, 12)}…)/ 入力 JSON の対象一致=${targetConsistency.allSame}`);
console.log('-- 転記照合(q* → q_exact vs 第141便系列の参照値)--');
for (const [k, r] of Object.entries(qTable)) {
  console.log(`  ${k.padEnd(11)} q*=${r.qStar.toFixed(6)} → q_exact=${r.qExact.toFixed(6)}` +
    ` (補正 ${r.finiteRadiusCorrection.toFixed(6)}) 参照=${r.reference} 差=${r.diffFromReference.toExponential(3)}` +
    ` 許容=${r.tolerance} → ${r.match ? 'OK' : 'MISMATCH'}`);
}
if (!transcription.allMatch) {
  const stop = { target: TARGET, wave: 164, stage: 'stopped-at-transcription-gate',
    preRegistered: PRE_REGISTERED, targetConsistency, provenanceInputs, transcription,
    stopReason: '転記照合で参照値と丸め桁を超える差が出たため、事前登録の手順どおり実測せず停止した' };
  fs.writeFileSync(OUT_PATH, JSON.stringify(stop, null, 2));
  console.error('転記照合 MISMATCH — 実測せず停止した。' + path.relative(ROOT, OUT_PATH) + ' を参照');
  process.exit(2);
}

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, wave: 164,
  title: 'q_exact 変種の頑健性(qLock 則の厳密一致式へ q だけ置換した実較正4系の再走行)',
  preRegistered: PRE_REGISTERED, targetConsistency, provenanceInputs, transcription,
  systems: {}, meta: {} };

// ---- 対象 HTML から claims の事前登録窓を機械読み取り(手書き転記をしない)------------------
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
console.log(`-- claims 窓(対象 HTML から機械読み取り)🪨 ${JSON.stringify(claimWindows.mercuryDrag.expected)}` +
  ` / 💿 ${JSON.stringify(claimWindows.ringApsidal.expected)}`);

// ============ 測定器①: 二体 RL 歳差(tests/exp-kf1c.mjs の runRL を逐語転記)==================
// 転記元: tests/exp-kf1c.mjs `const runRL = (cfg) => page.evaluate(async (c) => { … }, cfg);`
// 測定ロジック・定数・返却フィールドはすべて同一(再定義はしていない)。
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
  const dt = 0.016, steps = Math.ceil((c.orbits || 5) * TK / dt);
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
    amp: (rmax - rmin) / ((rmax + rmin) / 2), collapsed, nan: S.hasNaN(), qEff };
}, cfg);

// ============ 測定器②: 💿 環系(tests/exp-kf1d.mjs §B の run を逐語転記)======================
const runRing = (kF, q, PROF) => page.evaluate(async ({ kF, q, PROF }) => {
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
  const dt = 0.016, steps = Math.ceil(6 * TK1 / dt);
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
  return { res, nan: S.hasNaN() };
}, { kF, q, PROF });

// ============ 測定器③: 🟠 木星系(tests/exp-jupiter.mjs の HARNESS build/run を逐語転記)======
// 規約(tests/exp-jupiter.mjs の PHYS / MOONS / 定数を逐語転記 — 値は 1 つも変えていない)
const JPHYS = { G: 6.674, D0: 0.006, kFrame: 1, q: 12.30, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  kappaT: 7.415555555555556e-9, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
  timeScale: 1, stateCarry: 'double' };
const MJ = 18.98;              // 木星の実質量 1.898×10²⁷kg(10²⁶kg 単位)
const RJ = 7.1492;             // 木星の実半径 71,492km(10⁷m 単位)
const SPIN_J = 0.175851814;    // 実自転 9.925h → 2π/(9.925×3600 s) を rad/10³s へ
const DAY = 86.4;              // 1日 = 86400s = 86.4 時間単位
const JGM = JPHYS.G * MJ;      // 126.67252
const MOONS = [
  { name: 'Io',       ja: 'イオ',     a: 42.18,  e: 0.0041, m: 0.000893, R: 0.18216,
    spin: 0.0411059240,  Pobs: 1.769138,   phase: 0 },
  { name: 'Europa',   ja: 'エウロパ', a: 67.11,  e: 0.009,  m: 0.000480, R: 0.15608,
    spin: 0.0204782725,  Pobs: 3.551181,   phase: 1 },
  { name: 'Ganymede', ja: 'ガニメデ', a: 107.04, e: 0.0013, m: 0.001480, R: 0.26341,
    spin: 0.0101644438,  Pobs: 7.154553,   phase: 2 },
  { name: 'Callisto', ja: 'カリスト', a: 188.27, e: 0.0074, m: 0.001076, R: 0.24103,
    spin: 0.00435747966, Pobs: 16.689017, phase: 3 },
];
const T_IO = 2 * Math.PI * Math.sqrt(Math.pow(MOONS[0].a, 3) / JGM);
const N_STEP = 2000;   // イオ1公転あたりの步数(主測定)
const ORBITS = 20;     // 事前登録窓 JW2 の窓(≥20 イオ公転)
const bodyOf = (mo) => {
  const rp = mo.a * (1 - mo.e), vp = Math.sqrt(JGM * (1 + mo.e) / rp);
  const P = [[rp, 0, 0, vp], [0, rp, -vp, 0], [-rp, 0, 0, -vp], [0, -rp, vp, 0]][mo.phase];
  return { type: 'single', m: mo.m, radius: mo.R, x: P[0], y: P[1], vx: P[2], vy: P[3],
    spin: mo.spin, pinned: false };
};
const JCTX = { PHYS: JPHYS, MJ, RJ, SPIN_J, GM: JGM, T_IO, BODIES: MOONS.map(bodyOf) };
const JHARNESS = ({ PHYS, MJ, RJ, SPIN_J, GM, T_IO, BODIES }) => {
  window.__jupBodies = BODIES;
  window.__jup = {
    build(kF, q, spinJ, subset, patch) {
      const P = Object.assign({}, PHYS, { kFrame: kF, q }, patch || {});
      const S = HP.sim;
      S.build({ id: 'jup', name: 'jup', emoji: '🟠', seed: 1, camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: P,
        bodies: [{ type: 'single', m: MJ, radius: RJ, x: 0, y: 0, vx: 0, vy: 0,
          spin: spinJ === undefined ? SPIN_J : spinJ, pinned: true, pnSource: true }]
          .concat((subset || BODIES).map((b) => Object.assign({}, b))) });
      return S;
    },
    run(kF, q, N, orbits, spinJ, subset, Tbase, patch) {
      const S = this.build(kF, q, spinJ, subset, patch);
      const dt = (Tbase || T_IO) / N, steps = Math.round(orbits * N);
      const n = (subset || BODIES).length;
      const st = [];
      for (let i = 0; i < n; i++) st.push({ ang: 0, px: 0, py: 0, tRev: [],
        aMin: Infinity, aMax: -Infinity, aSum: 0, eMin: Infinity, eMax: -Infinity,
        rMin: Infinity, rMax: -Infinity, nS: 0,
        pomPrev: null, pomUnw: 0, sT: 0, sP: 0, sTT: 0, sTP: 0,
        r1: null, r2: null, th1: 0, th2: 0, t1: 0, peri: [] });
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
          const thn = Math.atan2(dy, dx);
          if (s.r1 !== null && s.r2 !== null && s.r1 < s.r2 && s.r1 < rr) {
            const den = (s.r2 - 2 * s.r1 + rr), dd = den !== 0 ? 0.5 * (s.r2 - rr) / den : 0;
            let dth = thn - s.th2;
            while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
            s.peri.push({ t: s.t1 + dd * dt, th: s.th1 + dd * (dth / 2) });
          }
          s.r2 = s.r1; s.th2 = s.th1; s.r1 = rr; s.th1 = thn; s.t1 = t;
          if (k % SAMPLE) continue;
          const aa = 1 / (2 / rr - (vx * vx + vy * vy) / GM);   // vis-viva
          const h = dx * vy - dy * vx;
          const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
          const ecc = Math.hypot(ex, ey), pom = Math.atan2(ey, ex);
          if (aa < s.aMin) s.aMin = aa; if (aa > s.aMax) s.aMax = aa;
          if (ecc < s.eMin) s.eMin = ecc; if (ecc > s.eMax) s.eMax = ecc;
          if (rr < s.rMin) s.rMin = rr; if (rr > s.rMax) s.rMax = rr;
          s.aSum += aa; s.nS++;
          if (s.pomPrev !== null) { let d = pom - s.pomPrev;
            while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s.pomUnw += d; }
          s.pomPrev = pom;
          s.sT += t; s.sP += s.pomUnw; s.sTT += t * t; s.sTP += t * s.pomUnw;
        }
      }
      const rows = st.map((s) => {
        let Tavg = null;
        if (s.tRev.length >= 2) { let acc = 0;
          for (let i = 1; i < s.tRev.length; i++) acc += s.tRev[i] - s.tRev[i - 1];
          Tavg = acc / (s.tRev.length - 1); }
        else if (s.tRev.length === 1) Tavg = s.tRev[0];
        const slopeRL = (s.nS * s.sTP - s.sT * s.sP) / (s.nS * s.sTT - s.sT * s.sT);
        let slopePe = NaN, Tper = Tavg;
        if (s.peri.length >= 3) {
          let acc = 0, prev = s.peri[0].th;
          const pw = s.peri.map((p) => { let d = p.th - prev;
            while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
            acc += d; prev = p.th; return acc; });
          let qT = 0, qP = 0, qTT = 0, qTP = 0;
          for (let i = 0; i < s.peri.length; i++) { qT += s.peri[i].t; qP += pw[i];
            qTT += s.peri[i].t * s.peri[i].t; qTP += s.peri[i].t * pw[i]; }
          const np = s.peri.length;
          slopePe = (np * qTP - qT * qP) / (np * qTT - qT * qT);
          Tper = (s.peri[np - 1].t - s.peri[0].t) / (np - 1);
        }
        return { Tavg, nRev: s.tRev.length, aMin: s.aMin, aMax: s.aMax, aMean: s.aSum / s.nS,
          eMin: s.eMin, eMax: s.eMax, rMin: s.rMin, rMax: s.rMax,
          dpomRL: slopeRL * (Tavg || 1), dpomPe: slopePe * (Tper || 1), nPeri: s.peri.length };
      });
      const fin = [];
      for (let i = 1; i < S.n; i++) fin.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return { rows, fin, nan: S.hasNaN(), steps, dt };
    },
  };
};
await page.evaluate(JHARNESS, JCTX);

// ============================ ☄️🪨 水星 =====================================================
// 構成は tests/exp-kf1c.mjs mkMerc()(= tests/exp-kf1d.mjs §A の 🪨 構成と同一)の逐語転記。
{
  const MERC = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const mkMerc = (id, over) => ({ id, M: 1988.5, m2: 0.00033011, a: 579.09,
    e: 0.20563, rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8,
    phys: Object.assign({}, MERC, over) });
  const qStar = qTable.mercury.qStar, qExact = qTable.mercury.qExact;
  console.log('== ☄️🪨 水星(8公転・pinned 太陽・D₀=0.006 不変)==');
  const kF0 = await runRL(mkMerc('mK0', { kFrame: 0 }));
  const runStar = await runRL(mkMerc('mQ*', { q: qStar }));
  const runExact = await runRL(mkMerc('mQe', { q: qExact }));
  const dragStar = runStar.dPomPerOrbit - kF0.dPomPerOrbit;
  const dragExact = runExact.dPomPerOrbit - kF0.dPomPerOrbit;
  // 基線再測のビット照合(既存 JSON: tests/out/kf1d-results.json tests.qcalc.mercKF0 / mercQstar)
  const refKF0 = inputs.kf1d.tests.qcalc.mercKF0, refStar = inputs.kf1d.tests.qcalc.mercQstar;
  const bit = {
    reference: 'tests/out/kf1d-results.json tests.qcalc.mercKF0 / mercQstar / dragMerc',
    qStarSameAsReference: Object.is(qStar, inputs.kf1d.tests.qcalc.qMerc),
    kF0Identical: Object.is(kF0.dPomPerOrbit, refKF0.dPomPerOrbit) && Object.is(kF0.Tavg, refKF0.Tavg),
    qStarRunIdentical: Object.is(runStar.dPomPerOrbit, refStar.dPomPerOrbit) && Object.is(runStar.Tavg, refStar.Tavg),
    dragIdentical: Object.is(dragStar, inputs.kf1d.tests.qcalc.dragMerc),
    kF0RelDiff: refKF0.dPomPerOrbit ? kF0.dPomPerOrbit / refKF0.dPomPerOrbit - 1 : null,
    qStarRunRelDiff: refStar.dPomPerOrbit ? runStar.dPomPerOrbit / refStar.dPomPerOrbit - 1 : null,
  };
  const win = claimWindows.mercuryDrag.expected;                      // {min:5.0e-10, max:6.2e-10}
  const winKf1c = 5.02e-7 / 8;                                       // 出典: tests/exp-kf1c.mjs §D1
  const inWin = (v) => Math.abs(v) >= win.min && Math.abs(v) <= win.max;
  out.systems.mercury = {
    emoji: '☄️🪨', label: '水星(実単位・kFrame=1)mercuryRealKF1 系',
    harness: 'tests/exp-kf1c.mjs §A の runRL/mkMerc(= tests/exp-kf1d.mjs §A の 🪨 構成)を逐語転記',
    config: { physics: MERC, M: 1988.5, m2: 0.00033011, a: 579.09, e: 0.20563, rM: 6.95, r2: 0.0244,
      spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8, dt: 0.016, seed: 1 },
    q: qTable.mercury,
    primaryObservable: '引きずり歳差 Δϖ_drag = Δϖ(kF1,q) − Δϖ(kF0) [rad/公転]',
    window: { source: 'プリセット claims mercuryRealKF1.drag-precession(対象 HTML から機械読み取り)',
      expected: win, alsoDeclared: { source: 'tests/exp-kf1c.mjs §D1', ruleAbsLessThan: winKf1c } },
    runs: { kF0, qStar: runStar, qExact: runExact },
    dragQStar: dragStar, dragQExact: dragExact,
    baselineBitCheck: bit,
    QW1: { observable: dragExact, abs: Math.abs(dragExact), window: win,
      pass: inWin(dragExact), alsoPassKf1cD1: Math.abs(dragExact) < winKf1c,
      baselinePass: inWin(dragStar) },
    QW2: { qStarValue: dragStar, qExactValue: dragExact,
      relDiff: dragStar !== 0 ? (dragExact - dragStar) / Math.abs(dragStar) : null,
      precessionRelDiff: runStar.dPomPerOrbit !== 0
        ? (runExact.dPomPerOrbit - runStar.dPomPerOrbit) / Math.abs(runStar.dPomPerOrbit) : null,
      periodRelDiff: runStar.Tavg ? runExact.Tavg / runStar.Tavg - 1 : null },
  };
  console.log(`  kF0 Δϖ=${kF0.dPomPerOrbit.toExponential(6)}(基線ビット一致=${bit.kF0Identical})`);
  console.log(`  q*=${qStar.toFixed(6)}  Δϖ_drag=${dragStar.toExponential(4)}(基線ビット一致=${bit.qStarRunIdentical})`);
  console.log(`  q_exact=${qExact.toFixed(6)} Δϖ_drag=${dragExact.toExponential(4)} → QW1 窓[${win.min},${win.max}] ${out.systems.mercury.QW1.pass ? 'PASS' : 'FAIL'}` +
    ` / kf1c§D1 窓 ${out.systems.mercury.QW1.alsoPassKf1cD1 ? 'PASS' : 'FAIL'} / QW2 相対差=${(out.systems.mercury.QW2.relDiff * 100).toFixed(3)}%`);
}

// ============================ 🌙🌘 地球月 ===================================================
// 構成は tests/exp-kf1c.mjs mkEM()(= tests/exp-kf1d.mjs §A の 🌘 構成と同一)の逐語転記。
{
  const EM = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1,
    timeScale: 1, stateCarry: 'double' };
  const mkEM = (id, over) => ({ id, M: 0.59724, m2: 0.007346, a: 384.748,
    e: 0.0549, rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8,
    phys: Object.assign({}, EM, over) });
  const TARGET_DPOM = 0.05311;   // 出典: tests/exp-kf1c.mjs §C/§D2「🌘 の近点回転 0.05311 rad/公転(8.85年)」
  const qStar = qTable.earthMoon.qStar, qExact = qTable.earthMoon.qExact;
  console.log('== 🌙🌘 地球月(8公転・自由二体・f=0.9968・D₀=0.006 不変)==');
  const runStar = await runRL(mkEM('eQ*', { q: qStar }));
  const runExact = await runRL(mkEM('eQe', { q: qExact }));
  const ratioStar = runStar.dPomPerOrbit / TARGET_DPOM;
  const ratioExact = runExact.dPomPerOrbit / TARGET_DPOM;
  // 基線再測のビット照合(既存 JSON: tests/out/kf1d-results.json tests.qcalc.emQstar)
  const refStar = inputs.kf1d.tests.qcalc.emQstar;
  const bit = {
    reference: 'tests/out/kf1d-results.json tests.qcalc.emQstar',
    qStarSameAsReference: Object.is(qStar, inputs.kf1d.tests.qcalc.qEM),
    qStarRunIdentical: Object.is(runStar.dPomPerOrbit, refStar.dPomPerOrbit) && Object.is(runStar.Tavg, refStar.Tavg),
    qStarRunRelDiff: refStar.dPomPerOrbit ? runStar.dPomPerOrbit / refStar.dPomPerOrbit - 1 : null,
  };
  const win = { min: 0.85, max: 1.15 };   // 出典: tests/exp-kf1c.mjs §D2(第120便の窓依存 ±15% と同水準)
  out.systems.earthMoon = {
    emoji: '🌙🌘', label: '地球と月(実単位・kFrame=1)earthMoonRealKF1 系',
    harness: 'tests/exp-kf1c.mjs §C の runRL/mkEM(= tests/exp-kf1d.mjs §A の 🌘 構成)を逐語転記',
    config: { physics: EM, M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549, rM: 6.38, r2: 1.74,
      spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8, dt: 0.016, seed: 1 },
    q: qTable.earthMoon,
    primaryObservable: '近点回転比 Δϖ/0.05311(目標 1.0)',
    externalReference: { dPomPerOrbit: TARGET_DPOM, note: '🌘 の近点回転 0.05311 rad/公転(8.85 年)' },
    window: { source: 'tests/exp-kf1c.mjs §D2', expected: win },
    runs: { qStar: runStar, qExact: runExact },
    ratioQStar: ratioStar, ratioQExact: ratioExact,
    periodDaysQStar: runStar.Tavg ? runStar.Tavg * 100 / 86400 : null,   // 🌘 は 1 t.u.=10² s
    periodDaysQExact: runExact.Tavg ? runExact.Tavg * 100 / 86400 : null,
    siderealMonthObs: 27.3217,
    baselineBitCheck: bit,
    QW1: { observable: ratioExact, window: win,
      pass: ratioExact > win.min && ratioExact < win.max,
      baselinePass: ratioStar > win.min && ratioStar < win.max },
    QW2: { qStarValue: ratioStar, qExactValue: ratioExact,
      relDiff: (ratioExact - ratioStar) / Math.abs(ratioStar),
      periodRelDiff: runStar.Tavg ? runExact.Tavg / runStar.Tavg - 1 : null },
  };
  console.log(`  q*=${qStar.toFixed(6)}  Δϖ比=${ratioStar.toFixed(6)}(基線ビット一致=${bit.qStarRunIdentical})`);
  console.log(`  q_exact=${qExact.toFixed(6)} Δϖ比=${ratioExact.toFixed(6)} → QW1 窓[0.85,1.15] ${out.systems.earthMoon.QW1.pass ? 'PASS' : 'FAIL'}` +
    ` / QW2 相対差=${(out.systems.earthMoon.QW2.relDiff * 100).toFixed(4)}%`);
}

// ============================ 💿🛰️ 土星環 ====================================================
// 構成は tests/exp-kf1d.mjs §B の run()(PROF・プローブ半径・e=0.1・6×T(a=80) 窓)の逐語転記。
{
  const PROF = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const qStar = qTable.saturnRing.qStar, qExact = qTable.saturnRing.qExact;
  console.log('== 💿🛰️ 土星環(6×T(a=80) 窓・pinned 土星・D₀=0.006 不変)==');
  const kF0 = await runRing(0, 3, PROF);        // 転記元と同じく kF0 側は q=3(kFrame=0 なので q は無関与)
  const runStar = await runRing(1, qStar, PROF);
  const runExact = await runRing(1, qExact, PROF);
  const refKF0 = inputs.kf1d.tests.ring.kF0, refStar = inputs.kf1d.tests.ring.qStarRun;
  const bit = {
    reference: 'tests/out/kf1d-results.json tests.ring.kF0 / tests.ring.qStarRun / tests.ring.qStar',
    qStarSameAsReference: Object.is(qStar, inputs.kf1d.tests.ring.qStar),
    kF0Identical: kF0.res.every((r, i) => Object.is(r.dPomPerOrbit, refKF0.res[i].dPomPerOrbit)),
    qStarRunIdentical: runStar.res.every((r, i) => Object.is(r.dPomPerOrbit, refStar.res[i].dPomPerOrbit)),
    perProbeRelDiff: runStar.res.map((r, i) => ({ a: r.a,
      kF0RelDiff: refKF0.res[i].dPomPerOrbit ? r.dPomPerOrbit / refKF0.res[i].dPomPerOrbit - 1 : null,
      qStarRelDiff: refStar.res[i].dPomPerOrbit ? r.dPomPerOrbit / refStar.res[i].dPomPerOrbit - 1 : null })),
  };
  const win = claimWindows.ringApsidal.expected;     // {min:1e-5, max:3e-5}
  const drift = (run) => run.res.map((r, i) => ({ a: r.a,
    dPomPerOrbit: r.dPomPerOrbit, drift: r.dPomPerOrbit - kF0.res[i].dPomPerOrbit }));
  const dStar = drift(runStar), dExact = drift(runExact);
  const rows = dExact.map((r, i) => ({ a: r.a, driftQStar: dStar[i].drift, driftQExact: r.drift,
    absQExact: Math.abs(r.drift),
    driftQ3: inputs.kf1d.tests.ring.q3.res[i].dPomPerOrbit - inputs.kf1d.tests.ring.kF0.res[i].dPomPerOrbit,
    inWindow: Math.abs(r.drift) >= win.min && Math.abs(r.drift) <= win.max,
    baselineInWindow: Math.abs(dStar[i].drift) >= win.min && Math.abs(dStar[i].drift) <= win.max,
    relDiff: dStar[i].drift !== 0 ? (r.drift - dStar[i].drift) / Math.abs(dStar[i].drift) : null }));
  // 窓の適用先(= claims が指しているプローブ)の同定 — 窓の数値は動かさない。
  //   claims の説明文は「q=3 の 0.23 rad/公転 → 2×10⁻⁵ へ落ち」と2つの数値を対にしている。
  //   kf1d §B の実測で q=3 の近点移動が 0.23 になるのは **a=80 のプローブただ1つ**
  //   (a=105 は 0.131・a=130 は 0.062・a=1221.9 は −0.267)なので、
  //   claims の expected {min:1e-5, max:3e-5} が判定している観測量は a=80 プローブの近点移動である。
  //   他の3プローブは同じ窓の適用対象ではない(基線 q* でも a=105 は 3.97×10⁻⁵ で窓外 —
  //   窓が元からそのプローブについてのものではなかったことの機械証拠)。全プローブへ当てた場合の
  //   判定も参考として併記する(判定には使わない)。
  const PRIMARY_A = 80;
  const primary = rows.find((r) => r.a === PRIMARY_A);
  const referentEvidence = {
    rule: 'claims の説明文が対にしている「q=3 で 0.23 rad/公転」に一致するプローブを窓の適用先とする',
    q3DriftPerProbe: rows.map((r) => ({ a: r.a, driftQ3: r.driftQ3 })),
    matchesDescription: rows.filter((r) => Math.abs(Math.abs(r.driftQ3) - 0.23) < 0.005).map((r) => r.a),
    chosen: PRIMARY_A,
    source: 'index.html / beta/index.html の saturnRingRealKF1 claims 説明文 + tests/out/kf1d-results.json tests.ring.q3',
  };
  out.systems.saturnRing = {
    emoji: '💿🛰️', label: '土星の環(実単位・kFrame=1)saturnRingRealKF1 系',
    harness: 'tests/exp-kf1d.mjs §B の run()(プローブ a=80/105/130/1221.9・e=0.1・6×T(a=80))を逐語転記',
    config: { physics: PROF, M: 56.834, radius: 60.3, spin: 0.016528, probeRadii: [80, 105, 130, 1221.9],
      probeMass: 1e-5, e: 0.1, orbits: '6 × T(a=80)', dt: 0.016, seed: 1, softening: 0.05 },
    q: qTable.saturnRing,
    primaryObservable: '環偏心テスト粒子(a=80・C環相当)の近点移動 Δϖ_drift = Δϖ(kF1,q) − Δϖ(kF0) [rad/公転]',
    window: { source: 'プリセット claims saturnRingRealKF1.ring-apsidal-drift(対象 HTML から機械読み取り)',
      expected: win, referentEvidence },
    runs: { kF0, qStar: runStar, qExact: runExact },
    baselineBitCheck: bit,
    rows,
    QW1: { observable: primary.driftQExact, abs: primary.absQExact, probeA: PRIMARY_A, window: win,
      pass: primary.inWindow, baselinePass: primary.baselineInWindow,
      allProbesVariant: { role: '参考(判定に使わない — 窓の適用先は referentEvidence で同定済み)',
        pass: rows.every((r) => r.inWindow), baselinePass: rows.every((r) => r.baselineInWindow),
        perProbe: rows.map((r) => ({ a: r.a, abs: r.absQExact, ok: r.inWindow, baselineOk: r.baselineInWindow })),
        note: 'a=105 プローブは基線 q* でも |Δϖ|=3.97×10⁻⁵ で窓外である(窓が元からこのプローブに' +
          'ついてのものではなかったことの機械証拠)。全プローブへ当てた判定はこの限界の上で読むこと' } },
    QW2: { perProbe: rows.map((r) => ({ a: r.a, qStarValue: r.driftQStar, qExactValue: r.driftQExact, relDiff: r.relDiff })),
      maxAbsRelDiff: Math.max(...rows.map((r) => Math.abs(r.relDiff === null ? 0 : r.relDiff))) },
  };
  console.log(`  q*=${qStar.toFixed(6)}(基線ビット一致 kF0=${bit.kF0Identical}・q*走行=${bit.qStarRunIdentical})`);
  for (const r of rows) {
    console.log(`   a=${String(r.a).padEnd(7)} Δϖ_drift q*=${r.driftQStar.toExponential(4)} → q_exact=${r.driftQExact.toExponential(4)}` +
      ` 窓[1e-5,3e-5] ${r.inWindow ? 'in' : 'out'}(基線 ${r.baselineInWindow ? 'in' : 'out'}・相対差 ${(r.relDiff * 100).toFixed(1)}%)`);
  }
  console.log(`  → QW1(窓の適用先 a=${PRIMARY_A} — claims の「q=3 で 0.23」と一致するプローブ)= ` +
    `${out.systems.saturnRing.QW1.pass ? 'PASS' : 'FAIL'}(基線 ${out.systems.saturnRing.QW1.baselinePass ? 'PASS' : 'FAIL'})` +
    ` / 参考・全プローブ適用時 = ${out.systems.saturnRing.QW1.allProbesVariant.pass ? 'PASS' : 'FAIL'}(基線 ${out.systems.saturnRing.QW1.allProbesVariant.baselinePass ? 'PASS' : 'FAIL'})`);
}

// ============================ 🟠 木星ガリレオ衛星 =============================================
{
  const qStar = qTable.jupiter.qStar, qExact = qTable.jupiter.qExact;
  const Q_LOCK = 12.30;                                   // 出典: tests/exp-jupiter.mjs Q_LOCK(直値宣言)
  const Q_EXACT_DECL = +qExact.toFixed(2);                // 出典: tests/exp-jupiter.mjs §H③ Q_EXACT_DECL
  console.log('== 🟠 木星ガリレオ衛星(20 イオ公転・2000 步/公転・D₀=0.006 不変)==');
  const relDev = (T, Pobs) => (T / DAY) / Pobs - 1;       // 出典: tests/exp-jupiter.mjs §F
  const jrun = (kF, q) => page.evaluate(({ N, o, kF, q }) => window.__jup.run(kF, q, N, o),
    { N: N_STEP, o: ORBITS, kF, q });
  const kf0 = await jrun(0, Q_LOCK);
  const kf1 = await jrun(1, Q_LOCK);
  const kfE = await jrun(1, qExact);                      // 厳密一致式(全桁)
  const kfED = await jrun(1, Q_EXACT_DECL);               // 第141便 §H③ と同じ 2桁丸めの直値 12.06
  const mkRows = (r) => MOONS.map((mo, i) => ({ name: mo.name,
    periodDays: r.rows[i].Tavg / DAY, obs: mo.Pobs, devPercent: relDev(r.rows[i].Tavg, mo.Pobs) * 100,
    aSpread: (r.rows[i].aMax - r.rows[i].aMin) / r.rows[i].aMean,
    aSpreadPercent: 100 * (r.rows[i].aMax - r.rows[i].aMin) / r.rows[i].aMean,
    dragPe: r.rows[i].dpomPe - kf0.rows[i].dpomPe,
    periodShift: (r.rows[i].Tavg - kf0.rows[i].Tavg) / kf0.rows[i].Tavg,
    ok: ((r.rows[i].aMax - r.rows[i].aMin) / r.rows[i].aMean) < 0.02
      && Math.abs(relDev(r.rows[i].Tavg, mo.Pobs)) < 0.01 }));
  const jw2 = (r) => { const rows = mkRows(r);
    return { nan: r.nan, rows, pass: !r.nan && rows.every((x) => x.ok),
      maxAbsDevPercent: Math.max(...rows.map((x) => Math.abs(x.devPercent))),
      maxASpreadPercent: Math.max(...rows.map((x) => x.aSpreadPercent)) }; };
  const jStar = jw2(kf1), jExact = jw2(kfE), jExactDecl = jw2(kfED);
  const jkf0 = { rows: MOONS.map((mo, i) => ({ name: mo.name, periodDays: kf0.rows[i].Tavg / DAY,
    obs: mo.Pobs, devPercent: relDev(kf0.rows[i].Tavg, mo.Pobs) * 100,
    ok: Math.abs(relDev(kf0.rows[i].Tavg, mo.Pobs)) < 0.01 })) };
  jkf0.pass = jkf0.rows.every((x) => x.ok);
  // 基線再測のビット照合(既存 JSON: tests/out/jupiter-results.json windows.JW1/JW2 と §H の q_exact 対照)
  const refJW1 = inputs.jupiter.windows.JW1.rows, refJW2 = inputs.jupiter.windows.JW2.rows;
  const refQE = ((inputs.jupiter.sensitivity.qControls || {}).rows || [])
    .find((r) => r.isQExact === true) || null;
  const bit = {
    reference: 'tests/out/jupiter-results.json windows.JW1.rows / windows.JW2.rows / sensitivity.qControls(isQExact)',
    qStarSameAsReference: Object.is(qStar, inputs.jupiter.sensitivity.qControls.qStar),
    jw1Identical: jkf0.rows.every((r, i) => Object.is(r.periodDays, refJW1[i].periodDays)),
    jw2Identical: jStar.rows.every((r, i) => Object.is(r.periodDays, refJW2[i].periodDays)
      && Object.is(r.aSpread, refJW2[i].aSpread)),
    qExactDeclIdentical: refQE ? jExactDecl.rows.every((r, i) => Object.is(r.periodDays, refQE.rows[i].periodDays)
      && Object.is(r.aSpreadPercent, refQE.rows[i].aSpreadPercent)) : null,
    referenceQExactQ: refQE ? refQE.q : null,
    qExactDeclSameAsReferenceQ: refQE ? Object.is(Q_EXACT_DECL, refQE.q) : null,
    jw1RelDiff: jkf0.rows.map((r, i) => r.periodDays / refJW1[i].periodDays - 1),
    jw2RelDiff: jStar.rows.map((r, i) => r.periodDays / refJW2[i].periodDays - 1),
  };
  out.systems.jupiter = {
    emoji: '🟠', label: '木星ガリレオ衛星 hold-out(exp-jupiter.mjs 構成)',
    harness: 'tests/exp-jupiter.mjs の HARNESS build/run(2000 步/イオ公転 × 20 公転)を逐語転記',
    config: { physics: JPHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, GM: JGM,
      moons: MOONS, stepsPerOrbit: N_STEP, orbits: ORBITS, T_IO_units: T_IO, pinned: true, seed: 1 },
    q: qTable.jupiter,
    qDeclaredInHarness: Q_LOCK, qExactDeclared2dp: Q_EXACT_DECL,
    primaryObservable: 'JW2 条件(NaN なし・4衛星とも |Δa|/a<2% かつ 周期が観測値と ±1%)',
    window: { source: 'tests/exp-jupiter.mjs windowsPreRegistered.JW2',
      verbatim: inputs.jupiter.windowsPreRegistered.JW2 },
    JW1Baseline: jkf0,
    runs: { qStar: jStar, qExact: jExact, qExactDecl2dp: jExactDecl },
    baselineBitCheck: bit,
    QW1: { pass: jExact.pass, nan: jExact.nan,
      maxAbsDevPercent: jExact.maxAbsDevPercent, maxASpreadPercent: jExact.maxASpreadPercent,
      rows: jExact.rows.map((r) => ({ name: r.name, devPercent: r.devPercent,
        aSpreadPercent: r.aSpreadPercent, ok: r.ok })),
      baselinePass: jStar.pass, declared2dpPass: jExactDecl.pass },
    QW2: { perMoon: jExact.rows.map((r, i) => ({ name: r.name,
      periodQStar: jStar.rows[i].periodDays, periodQExact: r.periodDays,
      periodRelDiff: r.periodDays / jStar.rows[i].periodDays - 1,
      aSpreadQStar: jStar.rows[i].aSpread, aSpreadQExact: r.aSpread,
      aSpreadRelDiff: jStar.rows[i].aSpread ? r.aSpread / jStar.rows[i].aSpread - 1 : null,
      dragQStar: jStar.rows[i].dragPe, dragQExact: r.dragPe,
      dragRelDiff: jStar.rows[i].dragPe ? (r.dragPe - jStar.rows[i].dragPe) / Math.abs(jStar.rows[i].dragPe) : null })),
      maxAbsPeriodRelDiff: Math.max(...jExact.rows.map((r, i) => Math.abs(r.periodDays / jStar.rows[i].periodDays - 1))) },
  };
  console.log(`  kF0(JW1 相当)周期ずれ最大 ${Math.max(...jkf0.rows.map((r) => Math.abs(r.devPercent))).toFixed(4)}%(基線ビット一致=${bit.jw1Identical})`);
  console.log(`  q=${Q_LOCK}(基線)周期ずれ最大 ${jStar.maxAbsDevPercent.toFixed(4)}% / |Δa|/a 最大 ${jStar.maxASpreadPercent.toFixed(5)}%(基線ビット一致=${bit.jw2Identical})`);
  console.log(`  q_exact=${qExact.toFixed(6)} 周期ずれ最大 ${jExact.maxAbsDevPercent.toFixed(4)}% / |Δa|/a 最大 ${jExact.maxASpreadPercent.toFixed(5)}% / NaN=${jExact.nan} → QW1 ${jExact.pass ? 'PASS' : 'FAIL'}`);
  console.log(`  q_exact(2桁直値 ${Q_EXACT_DECL})= ${jExactDecl.pass ? 'PASS' : 'FAIL'}(第141便 §H③ とビット一致=${bit.qExactDeclIdentical})`);
}

// ============================ QW1 総括 =======================================================
out.qw1Summary = {
  rule: PRE_REGISTERED.QW1,
  perSystem: Object.fromEntries(Object.entries(out.systems).map(([k, v]) =>
    [k, { pass: v.QW1.pass, baselinePass: v.QW1.baselinePass }])),
  allPass: Object.values(out.systems).every((v) => v.QW1.pass === true),
  allBaselinePass: Object.values(out.systems).every((v) => v.QW1.baselinePass === true),
};
out.baselineBitSummary = {
  note: '基線再測(q* 走行・kF0)が既存 JSON の対応値とビット一致するかの総括。' +
    '一致していれば本便の転記(構成・測定器)が既存ハーネスと同一であることの機械証拠になる',
  targetAllSame: targetConsistency.allSame,
  mercury: out.systems.mercury.baselineBitCheck,
  earthMoon: out.systems.earthMoon.baselineBitCheck,
  saturnRing: out.systems.saturnRing.baselineBitCheck,
  jupiter: out.systems.jupiter.baselineBitCheck,
};

// ============================ QW3: 決定性(2回実行 SHA 一致)==================================
{
  const target = { systems: out.systems };
  const mine = JSON.stringify(canonize(target));
  const rec = { rule: PRE_REGISTERED.QW3,
    canonicalization: 'out.systems(実測部)のみを対象に、キーを再帰整列した JSON の SHA-256。' +
      '日時・経過時間・環境などの揮発キーは meta / manifest 側にしか置いていないので、' +
      '対象内に除外すべき揮発値は存在しない',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.QEX_DET_REF;
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
  out.qw3 = { rule: PRE_REGISTERED.QW3, sha256: rec.sha256, reference: rec.reference,
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
  experiment: { id: 'qexact', wave: 164,
    title: 'q_exact 変種の頑健性(qLock 則の厳密一致式へ q だけ置換した実較正4系の再走行)',
    command: 'node tests/exp-qexact.mjs(QEX_OUT / QEX_DET_REF で決定性の2回実行)' },
  presets: { mode: 'mixed', ids: ['mercuryRealKF1', 'saturnRingRealKF1', 'earthMoonRealKF1'],
    declaredIn: '🪨🌘 = exp-kf1c mkMerc/mkEM の逐語転記 / 💿 = exp-kf1d §B の逐語転記 / 🟠 = exp-jupiter HARNESS の逐語転記',
    declaration: '走行構成はすべて動的構成(内蔵プリセットを読まず、既存ハーネスの宣言値を逐語転記して build する)。' +
      '内蔵プリセットは**事前登録窓(claims.expected)の機械読み取り**にだけ使い、走行には使わない',
    modifiedAtRuntime: 'なし(プリセットは読み取り専用)',
    configs: {
      mercury: out.systems.mercury.config, earthMoon: out.systems.earthMoon.config,
      saturnRing: out.systems.saturnRing.config, jupiter: out.systems.jupiter.config,
      qInputs: Q_INPUTS },
    note: 'Kt=134851663.17051244 は c₀²/G(physLock 条件)の値である。q 以外のキーは既存ハーネスと 1 つも違わない' },
  numerics: {
    seed: 1, dt: { mercuryEarthMoonRing: 0.016, jupiter: 'T_IO/2000(= 2000 步/イオ公転)' },
    timeScale: 1, substeps: NOT_APPLICABLE,
    steps: { mercuryEarthMoon: 'ceil(8·T_K/0.016)', ring: 'ceil(6·T(a=80)/0.016)',
      jupiter: 'round(20 × 2000) = 40000' },
    window: { mercury: '8 公転', earthMoon: '8 公転', ring: '6 × 内縁(a=80)公転', jupiter: '20 イオ公転' },
    warmup: NOT_APPLICABLE,
    lsqSampling: '🪨🌘 は ≤4000 標本・🟠 は ≤8000 標本(いずれも転記元と同一)',
    precision: 'stateCarry:"double"(全系 — 転記元と同一)',
  },
  classification: {
    input: ['🪨🌘💿🟠 の実単位の質量・半径・自転・軌道要素(観測由来の外部入力 — 転記元と同一)',
      'D₀=0.006(既存の共有較正値をそのまま使用 — 本便での再フィットはゼロ)',
      '初速較正係数 f=0.9968(🌘 の既存値をそのまま使用)',
      'dt・seed・窓・步数(いずれも転記元と同一)',
      '第141便系列の参照 q_exact 値 6.147 / 8.236 / 20.49 / 12.06(転記照合の照合先)'],
    fit: [],
    derived: ['q* = 3 + ln(1.25·c₀²R/(GM))/ln((R+a)/R)(既知量だけから計算)',
      'q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)(同上 — 本便で置換する唯一の量)',
      '引きずり歳差 Δϖ(kF1)−Δϖ(kF0)(🪨💿)', '近点回転比 Δϖ/0.05311(🌘)',
      'JW2 条件(|Δa|/a・周期ずれ — 🟠)', 'q* 走行との相対差(QW2)'],
    holdOut: [],
    note: '**本便は較正を一切行わない**(fit=[])。動かすノブは q ただ1つで、その値は当てはめではなく' +
      '既知量からの算出値(厳密一致式)である。判定窓も既存の事前登録窓をそのまま流用しており、' +
      '本便で新設した窓は1つもない',
  },
  judgement: {
    pointers: ['preRegistered.QW1', 'preRegistered.QW2', 'preRegistered.QW3',
      'transcription', 'qw1Summary', 'baselineBitSummary', 'qw3',
      'systems.mercury.QW1', 'systems.earthMoon.QW1', 'systems.saturnRing.QW1', 'systems.jupiter.QW1',
      'systems.mercury.QW2', 'systems.earthMoon.QW2', 'systems.saturnRing.QW2', 'systems.jupiter.QW2',
      'claimWindows', 'targetConsistency'],
    note: '窓は実測前に固定してあり実測後に動かしていない(preRegistered)。窓の数値の出典は各 ' +
      'systems.*.window.source にある(🪨💿 は対象 HTML の claims から機械読み取り・🌘 は ' +
      'exp-kf1c §D2・🟠 は exp-jupiter の JW2)。基線再測のビット照合は baselineBitSummary にある',
    externalReferences: ['🪨 水星の 1PN 解析値 5.02e-7 rad/公転(kf1c §D1 の窓の分母)',
      '🌘 の近点回転 0.05311 rad/公転(8.85 年)・恒星月 27.3217 日',
      '🟠 4衛星の恒星公転周期(NASA の惑星衛星 fact sheet 系 — exp-jupiter.mjs の帰属に従う)',
      '第141便系列の参照 q_exact 値 6.147 / 8.236 / 20.49 / 12.06'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない(記録しているのは軌道要素のドリフト・振幅・NaN フラグ)' },
  },
  regenerationNote: 'meta(日時・経過時間)は非測定メタなので照合対象外。決定性の照合対象は out.systems のみ',
  excludeKeys: ['meta'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(`\nQW1 総括: ${JSON.stringify(out.qw1Summary.perSystem)} → 全系 PASS=${out.qw1Summary.allPass}`);
console.log(`QW3 決定性: ${out.qw3.result}(SHA ${out.qw3.sha256.slice(0, 16)}…)`);
console.log(`所要 ${out.meta.elapsedSec.toFixed(1)} 秒 / saved: ${path.relative(ROOT, OUT_PATH)}`);
await browser.close();

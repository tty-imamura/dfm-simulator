// 第180便 exp-qexact-regime.mjs — q_exact 世代「採用直値」regime の実測正本
// ============================================================================================
// 位置づけ: 第164便 tests/exp-qexact.mjs は厳密一致式
//     q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R),  q* = 3 + ln(1.25·c₀²R/(GM))/ln((R+a)/R)
//   の **全桁値**(6.147101550842838 / 8.235802785842496 / 20.493156316241464 / 12.058551153315456)
//   で4系を再走行し、既存窓に入り続けることを示した。第172便はその結論を受けて運用規約を
//   q_exact へ切り替えたが、**プリセット・ハーネスへ実際に載せたのは4桁丸めの直値**
//   6.1471 / 8.2358 / 20.4932 / 12.0586 である(全桁の無理数を literal で持てないため)。
//
//   本便が測るのはその「採用直値 regime」— **アプリが本当に走る q** での4系の主較正観測量である。
//   全桁 q_exact と採用直値のあいだには 4桁丸めぶんの系統誤差があり、それは
//   「規約の選択」(第164便 QW2)とは別の、「規約の**実装**」に由来する誤差成分である。
//   誤差予算 v3(tools/gen-error-budget.mjs)の regime 層 qExact 世代は本 JSON から機械読取する。
//
// 4系と主較正観測量(いずれも**既存の事前登録窓をそのまま流用**する — 窓の新設・再設定はしない):
//   ☄️🪨 水星 mercuryRealKF1     … 引きずり歳差 |Δϖ(kF1)−Δϖ(kF0)| rad/公転
//                                   窓 = claims mercuryRealKF1.drag-precession(実行時に対象から読む)
//   🌙🌘 地球月 earthMoonRealKF1  … 近点回転比 Δϖ/0.05311(窓 = exp-kf1c.mjs §D2 の 0.85〜1.15)
//   💿🛰️ 土星環 saturnRingRealKF1 … 環偏心テスト粒子(a=80)の近点移動 |Δϖ(kF1,q)−Δϖ(kF0)|
//                                   窓 = claims saturnRingRealKF1.ring-apsidal-drift(同上)
//   🟠 木星 jupiterGalilean       … 事前登録窓 JW2(NaN なし・|Δa|/a<2%・周期 ±1%)
//
// 既定対象を beta/index.html にしてある理由(重要):
//   採用直値 6.1471 / 8.2358 / 20.4932 / 12.0586 を**宣言している**のは第172便以降の
//   beta/index.html である。本便の起草時点(第180便)の root index.html は凍結された q* 世代
//   (6.16 / 8.25 / 21.8 / 12.30)だったが、v1.42.0 Release 昇格(第182〜183便)で root も
//   採用直値世代になった(第183便申し送りの記述更新 — 判定・数値は不変)。既定対象は従来どおり
//   beta のまま: 実測正本は開発線 beta で更新し、root は Release 昇格でのみ変わる。
//   本便は「採用直値を手で打たない」ため、走らせる q を **対象 HTML のプリセット宣言から機械読取**
//   した値と ROUND4(q_exact) の**両方に対して**厳密一致照合してから走らせる(RW2)。
//   なお基線再測(kF0・q* 走行)は既存実測正本 kf1c/kf1d/jupiter とビット一致することを RW3 で
//   自己検証する(既存正本の対象は root index.html なので、対象 SHA の異同は targetConsistency に
//   機械記録する。ビット一致が成立していれば測定器の転記が同一実体であることの証拠になる)。
//
// 実行: node tests/exp-qexact-regime.mjs(playwright 必須)→ tests/out/qexact-regime-results.json
//   QA_TARGET=index.html node tests/exp-qexact-regime.mjs   … 対象の変更(q* 世代では RW2 が停止)
//   QXR_OUT=/path/x.json node tests/exp-qexact-regime.mjs   … 出力先の変更(決定性の2回実行に使う)
//   QXR_DET_REF=/path/run1.json node tests/exp-qexact-regime.mjs … 2回目実行で1回目と SHA 照合
// ============================================================================================
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
const OUT_PATH = process.env.QXR_OUT ? path.resolve(process.env.QXR_OUT)
  : path.join(OUT_DIR, 'qexact-regime-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
// 正準化(決定性ハッシュ — exp-qexact.mjs / exp-coreshell5.mjs と同一方式)
const canonize = (o) => {
  if (Array.isArray(o)) return o.map(canonize);
  if (o && typeof o === 'object') {
    const r = {};
    for (const k of Object.keys(o).sort()) r[k] = canonize(o[k]);
    return r;
  }
  return o;
};
const relTo = (v, base) => (typeof v === 'number' && typeof base === 'number' && base !== 0)
  ? (v - base) / Math.abs(base) : null;

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// ==================== 事前登録(実測前に固定 — 実測後に動かさない)====================
const NC_FACTOR = 1.01;   // 否定対照の摂動(採用直値 ×1.01 = +1%)
const ROUND_DIGITS = 4;   // 採用直値の丸め桁(プリセット literal の桁数 — 実測値ではなくメタ定数)
const PRE_REGISTERED = {
  fixedBy: '第180便(統括裁定 — 誤差予算 v3 の regime 層の供給元として新設)',
  fixedBefore: '実測',
  designPrinciples: {
    oneKnobOnly: '**q だけ**を採用直値へ置換する。他の全パラメータは不変 — D₀=0.006(共有較正値)・' +
      '初速較正係数 f=0.9968(🌘)・ソフトニング・seed・窓・步幅・体の初期条件のいずれも再フィットしない。',
    windowsReused: '判定窓は**既存の事前登録窓をそのまま流用する**。窓の新設・再設定は行わない。',
    noHandTypedNumbers: '走らせる q は手で打たない。ROUND' + ROUND_DIGITS +
      '(q_exact)(既存ハーネスの宣言式・宣言入力からの再計算)と、対象 HTML のプリセット宣言値の' +
      '**両方**から取り、両者が厳密一致することを走行前に照合する(RW2)。',
    noExistingFileTouched: '既存プリセット・既存結果 JSON・既存ハーネスは一切変更しない。' +
      '本便は新規ファイル(tests/exp-qexact-regime.mjs → tests/out/qexact-regime-results.json)で完結する。',
    failIsData: 'PASS/FAIL とも実測値をそのまま収載する(FAIL でも書き換えない)。',
  },
  RW1: {
    role: '主窓',
    verbatim: 'RW1(主窓): 各系の主較正観測量が**採用直値 q**(プリセットが宣言している4桁丸め値)での' +
      '走行でも、既存窓の数値をそのまま流用した同一窓に入る(窓の新設・再設定なし)。',
    perSystem: {
      mercury: '|Δϖ_drag| が claims mercuryRealKF1.drag-precession の expected 内(実行時に対象から読む)',
      earthMoon: 'Δϖ比 = Δϖ/0.05311 が 0.85 〜 1.15(出典: tests/exp-kf1c.mjs §D2)',
      saturnRing: 'a=80 プローブの |Δϖ_drift| が claims saturnRingRealKF1.ring-apsidal-drift の expected 内' +
        '(窓の適用先プローブの同定は第164便 exp-qexact.mjs の referentEvidence と同一規則)',
      jupiter: 'JW2 と同一条件 — NaN なし・4衛星とも |Δa|/a<2% かつ 恒星公転周期が観測値と ±1%',
    },
  },
  RW2: {
    role: '窓(採用直値の同定 — 走行前ゲート)',
    verbatim: 'RW2(直値同定): 本便が走らせる q が、(a) ROUND' + ROUND_DIGITS + '(q_exact) と厳密一致し、' +
      'かつ (b) 対象 HTML のプリセットが宣言している q とビット一致する。' +
      '不一致なら**実測せず停止**して報告する(手打ち転記・対象世代の取り違えを塞ぐ)。',
  },
  RW3: {
    role: '窓(基線 bit 照合)',
    verbatim: 'RW3(基線 bit 照合): 同条件の基準走行(kF0 基線・q* 走行・全桁 q_exact 走行)の結果が、' +
      '既存の実測正本(kf1c/kf1d/jupiter-results.json)および第164便 qexact-results.json の対応値と' +
      '**ビット一致**する。測定器の転記が既存ハーネスと同一実体であることの機械証拠である。',
  },
  RW4: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'RW4(記述 — 窓なし): 採用直値走行と全桁 q_exact 走行の観測量相対差を記録する。' +
      'これは「規約の**実装**(4桁丸め)」に由来する系統誤差であり、第164便 QW2 の' +
      '「規約の**選択**(q* → q_exact)」とは別成分である。',
  },
  RW5: {
    role: '窓(否定対照)',
    verbatim: 'RW5(否定対照): 採用直値を +' + ((NC_FACTOR - 1) * 100).toFixed(0) + '% ずらした対照走行では、' +
      '(a) RW2 の直値同定が必ず FAIL し、(b) 全系で主較正観測量が基準走行から動く(相対差 ≠ 0)。' +
      '対照で RW1 主窓を外れる系の件数も併記する(0 件なら「その窓は q の 1% 摂動を分解できない」' +
      'という所見そのものとして収載する — 記述であって合否には使わない)。',
  },
  RW6: {
    role: '窓(決定性)',
    verbatim: 'RW6(決定性): 全体2回実行(別プロセス)で揮発キー除外の正規化 JSON SHA-256 一致。',
    canonicalization: '対象は out.systems(実測部)のみ。日時・環境・経過時間などの揮発キーは' +
      'meta / manifest 側にしか置かないので、対象内に除外すべき揮発値は存在しない',
  },
  invariants: {
    verbatim: '既存プリセット・既存結果 JSON は不変(新規ファイルのみ)。実測値の手打ち転記はゼロで、' +
      'q は算出値と対象 HTML の宣言値の照合を経たものだけを使う。',
  },
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'kf1c', file: 'kf1c-results.json',
    role: '第122便の実測正本(🪨 水星 q スキャン・🌘 地球月 較正保存・§D の窓の出典)' },
  { key: 'kf1d', file: 'kf1d-results.json',
    role: '第123便の実測正本(qLock 則 q* の算出値・🪨🌘 の q* 走行・💿 環系 §B の基線)' },
  { key: 'jupiter', file: 'jupiter-results.json',
    role: '第138便の実測正本(🟠 の事前登録窓 JW1/JW2)' },
  { key: 'qexact', file: 'qexact-results.json',
    role: '第164便の実測正本(全桁 q_exact 走行 — 本便の採用直値走行の比較基準)' },
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
  note: '入力 JSON の実測を出した対象 HTML の SHA-256 と、本便が実測する対象の照合。' +
    '本便の既定対象は beta/index.html なので、既存正本(当時の root — 起草時点は q* 世代。' +
    'v1.42.0 以降は root も採用直値世代)とは対象 SHA が一致しない(allSame=false が既定)。' +
    'それでも RW3 のビット一致が成立していれば、測定器の転記と物理カーネルが同一実体であることの証拠になる',
};

// ==================== qLock 則と厳密一致式(exp-qexact.mjs から逐語転記)====================
const qStarCalc = (c, R, G, M, a) => 3 + Math.log(1.25 * c * c * R / (G * M)) / Math.log((R + a) / R);
const qExactCalc = (c, R, G, M, a) => qStarCalc(c, R, G, M, a) + 3 * Math.log(a / (R + a)) / Math.log((R + a) / R);

// 各系の q 算出入力(すべて既存ハーネス/プリセットの宣言値の逐語転記 — exp-qexact.mjs Q_INPUTS と同一)
const Q_INPUTS = {
  mercury: { c: 30000, R: 6.95, G: 6.674, M: 1988.5, aRef: 460.012,
    source: 'tests/exp-kf1d.mjs §A qCalc(30000, 6.95, 6.674, 1988.5, 460.012)(参照軌道=近日点距離)',
    presetId: 'mercuryRealKF1' },
  earthMoon: { c: 30000, R: 6.38, G: 6.674, M: 0.59724, aRef: 363.63,
    source: 'tests/exp-kf1d.mjs §A qCalc(30000, 6.38, 6.674, 0.59724, 363.63)(参照軌道=近地点距離)',
    presetId: 'earthMoonRealKF1' },
  saturnRing: { c: 30000, R: 60.3, G: 6.674, M: 56.834, aRef: 105,
    source: 'tests/exp-kf1d.mjs §B qCalc(30000, 60.3, 6.674, 56.834, 105)(参照=環中央値≈B環)',
    presetId: 'saturnRingRealKF1' },
  jupiter: { c: 30000, R: 7.1492, G: 6.674, M: 18.98, aRef: 42.18,
    source: 'tests/exp-jupiter.mjs Q_STAR(参照軌道=イオ a=42.18・R=RJ=7.1492・GM=6.674×18.98)',
    presetId: 'jupiterGalilean' },
};

// ---- 採用直値の機械算出(手打ちしない): ROUND4(q_exact)------------------------------------
const qTable = {};
for (const [k, v] of Object.entries(Q_INPUTS)) {
  const qStar = qStarCalc(v.c, v.R, v.G, v.M, v.aRef);
  const qExact = qExactCalc(v.c, v.R, v.G, v.M, v.aRef);
  const qAdopted = +qExact.toFixed(ROUND_DIGITS);
  qTable[k] = {
    inputs: v, qStar, qExact, qAdopted,
    roundingDigits: ROUND_DIGITS,
    roundingDelta: qAdopted - qExact,
    relRoundingDelta: qExact === 0 ? null : (qAdopted - qExact) / Math.abs(qExact),
    finiteRadiusCorrection: qExact - qStar,
    lnRatio: Math.log((v.R + v.aRef) / v.R),
    qNegativeControl: qAdopted * NC_FACTOR,
    note: 'q* は既存ハーネスの宣言式・宣言入力からの再計算。q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)。' +
      '採用直値 qAdopted = ROUND' + ROUND_DIGITS + '(q_exact)(プリセット literal の桁に合わせた丸め)',
  };
}

console.log('== 第180便 q_exact 世代「採用直値」regime の実測 ==');
console.log(`対象: ${TARGET}(SHA ${TARGET_SHA_NOW.slice(0, 12)}…)/ 入力 JSON の対象一致=${targetConsistency.allSame}`);

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, wave: 180,
  title: 'q_exact 世代「採用直値」regime の実測(プリセットが宣言する4桁丸め直値での実較正4系の走行)',
  preRegistered: PRE_REGISTERED, targetConsistency, provenanceInputs, qTable,
  systems: {}, meta: {} };

// ---- 対象 HTML から claims 窓とプリセット宣言 q を機械読み取り(手書き転記をしない)----------
const declared = await page.evaluate((ids) => {
  const P = HP.allPresets();
  const preset = (pid) => {
    const p = P.find((q) => q.id === pid);
    if (!p) return null;
    return { presetId: pid, q: p.physics ? p.physics.q : null, D0: p.physics ? p.physics.D0 : null,
      kFrame: p.physics ? p.physics.kFrame : null, qLock: p.qLock === true };
  };
  const claim = (pid, cid) => {
    const p = P.find((q) => q.id === pid);
    if (!p || !Array.isArray(p.claims)) return null;
    const c = p.claims.find((q) => q.id === cid);
    if (!c) return null;
    return { presetId: pid, claimId: cid, metric: c.metric, expected: c.expected };
  };
  return {
    presets: Object.fromEntries(Object.entries(ids).map(([k, pid]) => [k, preset(pid)])),
    claimWindows: {
      mercuryDrag: claim('mercuryRealKF1', 'mercuryRealKF1.drag-precession'),
      ringApsidal: claim('saturnRingRealKF1', 'saturnRingRealKF1.ring-apsidal-drift'),
    },
  };
}, Object.fromEntries(Object.entries(Q_INPUTS).map(([k, v]) => [k, v.presetId])));
out.declared = declared;

// ---- RW2: 採用直値の同定(走行前ゲート)------------------------------------------------------
const rw2Rows = Object.fromEntries(Object.entries(qTable).map(([k, r]) => {
  const d = declared.presets[k];
  const declaredQ = d ? d.q : null;
  return [k, {
    presetId: Q_INPUTS[k].presetId,
    qAdoptedFromFormula: r.qAdopted,
    qDeclaredInTarget: declaredQ,
    matchesRound: true,                                   // qAdopted は定義上 ROUND4(qExact)
    matchesDeclared: Object.is(r.qAdopted, declaredQ),
    diffFromDeclared: typeof declaredQ === 'number' ? r.qAdopted - declaredQ : null,
    ok: Object.is(r.qAdopted, declaredQ),
  }];
}));
const rw2 = { rule: PRE_REGISTERED.RW2, rows: rw2Rows,
  allMatch: Object.values(rw2Rows).every((r) => r.ok) };
out.adoptedLiteralIdentification = rw2;
console.log('-- RW2 直値同定(ROUND4(q_exact) vs 対象 HTML のプリセット宣言値)--');
for (const [k, r] of Object.entries(rw2Rows)) {
  console.log(`  ${k.padEnd(11)} 算出 ${r.qAdoptedFromFormula} / 宣言 ${r.qDeclaredInTarget}` +
    ` (${r.presetId}) → ${r.ok ? 'OK' : 'MISMATCH'}`);
}
if (!rw2.allMatch) {
  const stop = { target: TARGET, wave: 180, stage: 'stopped-at-adopted-literal-gate',
    preRegistered: PRE_REGISTERED, targetConsistency, provenanceInputs, qTable, declared,
    adoptedLiteralIdentification: rw2,
    stopReason: 'RW2 直値同定で ROUND4(q_exact) と対象 HTML のプリセット宣言値が一致しなかったため、' +
      '事前登録の手順どおり実測せず停止した(q* 世代の対象を指しているか、採用直値が動いている)' };
  fs.writeFileSync(OUT_PATH, JSON.stringify(stop, null, 2));
  console.error('RW2 直値同定 MISMATCH — 実測せず停止した。' + path.relative(ROOT, OUT_PATH) + ' を参照');
  await browser.close();
  process.exit(2);
}

// ============ 測定器①: 二体 RL 歳差(tests/exp-kf1c.mjs の runRL を逐語転記)==================
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
  const qEff = S.physics ? S.physics.q : null;
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
const JPHYS = { G: 6.674, D0: 0.006, kFrame: 1, q: 12.30, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  kappaT: 7.415555555555556e-9, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
  timeScale: 1, stateCarry: 'double' };
const MJ = 18.98;
const RJ = 7.1492;
const SPIN_J = 0.175851814;
const DAY = 86.4;
const JGM = JPHYS.G * MJ;
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
const N_STEP = 2000;
const ORBITS = 20;
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
          const aa = 1 / (2 / rr - (vx * vx + vy * vy) / GM);
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
{
  const MERC = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const mkMerc = (id, over) => ({ id, M: 1988.5, m2: 0.00033011, a: 579.09,
    e: 0.20563, rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8,
    phys: Object.assign({}, MERC, over) });
  const T = qTable.mercury;
  console.log('== ☄️🪨 水星(8公転・pinned 太陽・D₀=0.006 不変)==');
  const kF0 = await runRL(mkMerc('mK0', { kFrame: 0 }));
  const runStar = await runRL(mkMerc('mQ*', { q: T.qStar }));
  const runExact = await runRL(mkMerc('mQe', { q: T.qExact }));
  const runAdopt = await runRL(mkMerc('mQa', { q: T.qAdopted }));
  const runNC = await runRL(mkMerc('mQn', { q: T.qNegativeControl }));
  const drag = (r) => r.dPomPerOrbit - kF0.dPomPerOrbit;
  const dStar = drag(runStar), dExact = drag(runExact), dAdopt = drag(runAdopt), dNC = drag(runNC);
  const refKF0 = inputs.kf1d.tests.qcalc.mercKF0, refStar = inputs.kf1d.tests.qcalc.mercQstar;
  const refQx = inputs.qexact.systems.mercury;
  const bit = {
    reference: 'tests/out/kf1d-results.json tests.qcalc.mercKF0 / mercQstar / dragMerc ' +
      '+ tests/out/qexact-results.json systems.mercury.runs.qExact / dragQExact',
    qStarSameAsReference: Object.is(T.qStar, inputs.kf1d.tests.qcalc.qMerc),
    qExactSameAsReference: Object.is(T.qExact, refQx.q.qExact),
    kF0Identical: Object.is(kF0.dPomPerOrbit, refKF0.dPomPerOrbit) && Object.is(kF0.Tavg, refKF0.Tavg),
    qStarRunIdentical: Object.is(runStar.dPomPerOrbit, refStar.dPomPerOrbit) && Object.is(runStar.Tavg, refStar.Tavg),
    dragIdentical: Object.is(dStar, inputs.kf1d.tests.qcalc.dragMerc),
    qExactRunIdentical: Object.is(runExact.dPomPerOrbit, refQx.runs.qExact.dPomPerOrbit)
      && Object.is(runExact.Tavg, refQx.runs.qExact.Tavg),
    qExactDragIdentical: Object.is(dExact, refQx.dragQExact),
    kF0RelDiff: relTo(kF0.dPomPerOrbit, refKF0.dPomPerOrbit),
    qStarRunRelDiff: relTo(runStar.dPomPerOrbit, refStar.dPomPerOrbit),
    qExactRunRelDiff: relTo(runExact.dPomPerOrbit, refQx.runs.qExact.dPomPerOrbit),
  };
  bit.allIdentical = bit.kF0Identical && bit.qStarRunIdentical && bit.dragIdentical
    && bit.qExactRunIdentical && bit.qExactDragIdentical;
  const win = declared.claimWindows.mercuryDrag.expected;
  const winKf1c = 5.02e-7 / 8;                    // 出典: tests/exp-kf1c.mjs §D1
  const inWin = (v) => Math.abs(v) >= win.min && Math.abs(v) <= win.max;
  out.systems.mercury = {
    emoji: '☄️🪨', label: '水星(実単位・kFrame=1)mercuryRealKF1 系',
    harness: 'tests/exp-kf1c.mjs §A の runRL/mkMerc(= tests/exp-qexact.mjs と同一)を逐語転記',
    config: { physics: MERC, M: 1988.5, m2: 0.00033011, a: 579.09, e: 0.20563, rM: 6.95, r2: 0.0244,
      spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8, dt: 0.016, seed: 1 },
    q: T,
    primaryObservable: '引きずり歳差 Δϖ_drag = Δϖ(kF1,q) − Δϖ(kF0) [rad/公転]',
    window: { source: 'プリセット claims mercuryRealKF1.drag-precession(対象 HTML から機械読み取り)',
      expected: win, alsoDeclared: { source: 'tests/exp-kf1c.mjs §D1', ruleAbsLessThan: winKf1c } },
    runs: { kF0, qStar: runStar, qExact: runExact, qAdopted: runAdopt, qNegativeControl: runNC },
    dragQStar: dStar, dragQExact: dExact, dragQAdopted: dAdopt, dragQNegativeControl: dNC,
    baselineBitCheck: bit,
    RW1: { observable: dAdopt, abs: Math.abs(dAdopt), window: win,
      pass: inWin(dAdopt), alsoPassKf1cD1: Math.abs(dAdopt) < winKf1c,
      qExactPass: inWin(dExact), qStarPass: inWin(dStar) },
    RW4: { qExactValue: dExact, qAdoptedValue: dAdopt,
      relDiffToQExact: relTo(dAdopt, dExact),
      relDiffToQStar: relTo(dAdopt, dStar),
      precessionRelDiffToQExact: relTo(runAdopt.dPomPerOrbit, runExact.dPomPerOrbit),
      periodRelDiffToQExact: runExact.Tavg ? runAdopt.Tavg / runExact.Tavg - 1 : null },
    RW5: { qNegativeControl: T.qNegativeControl, observable: dNC, abs: Math.abs(dNC),
      relDiffToAdopted: relTo(dNC, dAdopt), moved: !Object.is(dNC, dAdopt),
      inWindow: inWin(dNC) },
  };
  console.log(`  kF0 Δϖ=${kF0.dPomPerOrbit.toExponential(6)}(基線ビット一致=${bit.kF0Identical})`);
  console.log(`  q*=${T.qStar.toFixed(6)} → q_exact=${T.qExact.toFixed(6)}(全桁走行ビット一致=${bit.qExactRunIdentical})`);
  console.log(`  採用直値 q=${T.qAdopted} Δϖ_drag=${dAdopt.toExponential(4)} → RW1 窓[${win.min},${win.max}] ` +
    `${out.systems.mercury.RW1.pass ? 'PASS' : 'FAIL'} / RW4 全桁比 ${(out.systems.mercury.RW4.relDiffToQExact * 100).toExponential(3)}%`);
  console.log(`  否定対照 q=${T.qNegativeControl.toFixed(6)} Δϖ_drag=${dNC.toExponential(4)} → 窓 ${out.systems.mercury.RW5.inWindow ? 'in' : 'OUT'}`);
}

// ============================ 🌙🌘 地球月 ===================================================
{
  const EM = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1,
    timeScale: 1, stateCarry: 'double' };
  const mkEM = (id, over) => ({ id, M: 0.59724, m2: 0.007346, a: 384.748,
    e: 0.0549, rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8,
    phys: Object.assign({}, EM, over) });
  const TARGET_DPOM = 0.05311;   // 出典: tests/exp-kf1c.mjs §C/§D2
  const T = qTable.earthMoon;
  console.log('== 🌙🌘 地球月(8公転・自由二体・f=0.9968・D₀=0.006 不変)==');
  const runStar = await runRL(mkEM('eQ*', { q: T.qStar }));
  const runExact = await runRL(mkEM('eQe', { q: T.qExact }));
  const runAdopt = await runRL(mkEM('eQa', { q: T.qAdopted }));
  const runNC = await runRL(mkEM('eQn', { q: T.qNegativeControl }));
  const ratio = (r) => r.dPomPerOrbit / TARGET_DPOM;
  const rStar = ratio(runStar), rExact = ratio(runExact), rAdopt = ratio(runAdopt), rNC = ratio(runNC);
  const refStar = inputs.kf1d.tests.qcalc.emQstar;
  const refQx = inputs.qexact.systems.earthMoon;
  const bit = {
    reference: 'tests/out/kf1d-results.json tests.qcalc.emQstar + tests/out/qexact-results.json systems.earthMoon',
    qStarSameAsReference: Object.is(T.qStar, inputs.kf1d.tests.qcalc.qEM),
    qExactSameAsReference: Object.is(T.qExact, refQx.q.qExact),
    qStarRunIdentical: Object.is(runStar.dPomPerOrbit, refStar.dPomPerOrbit) && Object.is(runStar.Tavg, refStar.Tavg),
    qExactRunIdentical: Object.is(runExact.dPomPerOrbit, refQx.runs.qExact.dPomPerOrbit)
      && Object.is(runExact.Tavg, refQx.runs.qExact.Tavg),
    qExactRatioIdentical: Object.is(rExact, refQx.ratioQExact),
    qStarRunRelDiff: relTo(runStar.dPomPerOrbit, refStar.dPomPerOrbit),
    qExactRunRelDiff: relTo(runExact.dPomPerOrbit, refQx.runs.qExact.dPomPerOrbit),
  };
  bit.allIdentical = bit.qStarRunIdentical && bit.qExactRunIdentical && bit.qExactRatioIdentical;
  const win = { min: 0.85, max: 1.15 };   // 出典: tests/exp-kf1c.mjs §D2
  const inWin = (v) => v > win.min && v < win.max;
  out.systems.earthMoon = {
    emoji: '🌙🌘', label: '地球と月(実単位・kFrame=1)earthMoonRealKF1 系',
    harness: 'tests/exp-kf1c.mjs §C の runRL/mkEM(= tests/exp-qexact.mjs と同一)を逐語転記',
    config: { physics: EM, M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549, rM: 6.38, r2: 1.74,
      spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8, dt: 0.016, seed: 1 },
    q: T,
    primaryObservable: '近点回転比 Δϖ/0.05311(目標 1.0)',
    externalReference: { dPomPerOrbit: TARGET_DPOM, note: '🌘 の近点回転 0.05311 rad/公転(8.85 年)' },
    window: { source: 'tests/exp-kf1c.mjs §D2', expected: win },
    runs: { qStar: runStar, qExact: runExact, qAdopted: runAdopt, qNegativeControl: runNC },
    ratioQStar: rStar, ratioQExact: rExact, ratioQAdopted: rAdopt, ratioQNegativeControl: rNC,
    periodDaysQAdopted: runAdopt.Tavg ? runAdopt.Tavg * 100 / 86400 : null,   // 🌘 は 1 t.u.=10² s
    siderealMonthObs: 27.3217,
    baselineBitCheck: bit,
    RW1: { observable: rAdopt, window: win, pass: inWin(rAdopt),
      qExactPass: inWin(rExact), qStarPass: inWin(rStar) },
    RW4: { qExactValue: rExact, qAdoptedValue: rAdopt,
      relDiffToQExact: relTo(rAdopt, rExact), relDiffToQStar: relTo(rAdopt, rStar),
      periodRelDiffToQExact: runExact.Tavg ? runAdopt.Tavg / runExact.Tavg - 1 : null },
    RW5: { qNegativeControl: T.qNegativeControl, observable: rNC,
      relDiffToAdopted: relTo(rNC, rAdopt), moved: !Object.is(rNC, rAdopt), inWindow: inWin(rNC) },
  };
  console.log(`  q*=${T.qStar.toFixed(6)} Δϖ比=${rStar.toFixed(6)}(基線ビット一致=${bit.qStarRunIdentical})`);
  console.log(`  採用直値 q=${T.qAdopted} Δϖ比=${rAdopt.toFixed(6)} → RW1 窓[0.85,1.15] ` +
    `${out.systems.earthMoon.RW1.pass ? 'PASS' : 'FAIL'} / RW4 全桁比 ${(out.systems.earthMoon.RW4.relDiffToQExact * 100).toExponential(3)}%`);
  console.log(`  否定対照 q=${T.qNegativeControl.toFixed(6)} Δϖ比=${rNC.toFixed(6)} → 窓 ${out.systems.earthMoon.RW5.inWindow ? 'in' : 'OUT'}`);
}

// ============================ 💿🛰️ 土星環 ====================================================
{
  const PROF = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
    timeScale: 1, stateCarry: 'double' };
  const T = qTable.saturnRing;
  console.log('== 💿🛰️ 土星環(6×T(a=80) 窓・pinned 土星・D₀=0.006 不変)==');
  const kF0 = await runRing(0, 3, PROF);
  const runStar = await runRing(1, T.qStar, PROF);
  const runExact = await runRing(1, T.qExact, PROF);
  const runAdopt = await runRing(1, T.qAdopted, PROF);
  const runNC = await runRing(1, T.qNegativeControl, PROF);
  const refKF0 = inputs.kf1d.tests.ring.kF0, refStar = inputs.kf1d.tests.ring.qStarRun;
  const refQx = inputs.qexact.systems.saturnRing;
  const bit = {
    reference: 'tests/out/kf1d-results.json tests.ring.kF0 / qStarRun / qStar ' +
      '+ tests/out/qexact-results.json systems.saturnRing.runs.qExact',
    qStarSameAsReference: Object.is(T.qStar, inputs.kf1d.tests.ring.qStar),
    qExactSameAsReference: Object.is(T.qExact, refQx.q.qExact),
    kF0Identical: kF0.res.every((r, i) => Object.is(r.dPomPerOrbit, refKF0.res[i].dPomPerOrbit)),
    qStarRunIdentical: runStar.res.every((r, i) => Object.is(r.dPomPerOrbit, refStar.res[i].dPomPerOrbit)),
    qExactRunIdentical: runExact.res.every((r, i) => Object.is(r.dPomPerOrbit, refQx.runs.qExact.res[i].dPomPerOrbit)),
    perProbeRelDiff: runStar.res.map((r, i) => ({ a: r.a,
      kF0RelDiff: relTo(r.dPomPerOrbit, refKF0.res[i].dPomPerOrbit),
      qStarRelDiff: relTo(r.dPomPerOrbit, refStar.res[i].dPomPerOrbit) })),
  };
  bit.allIdentical = bit.kF0Identical && bit.qStarRunIdentical && bit.qExactRunIdentical;
  const win = declared.claimWindows.ringApsidal.expected;
  const drift = (run) => run.res.map((r, i) => r.dPomPerOrbit - kF0.res[i].dPomPerOrbit);
  const dStar = drift(runStar), dExact = drift(runExact), dAdopt = drift(runAdopt), dNC = drift(runNC);
  const q3 = inputs.kf1d.tests.ring.q3.res.map((r, i) => r.dPomPerOrbit - inputs.kf1d.tests.ring.kF0.res[i].dPomPerOrbit);
  const inWin = (v) => Math.abs(v) >= win.min && Math.abs(v) <= win.max;
  const rows = runAdopt.res.map((r, i) => ({ a: r.a,
    driftQStar: dStar[i], driftQExact: dExact[i], driftQAdopted: dAdopt[i], driftQ3: q3[i],
    absQAdopted: Math.abs(dAdopt[i]),
    inWindow: inWin(dAdopt[i]), qExactInWindow: inWin(dExact[i]), baselineInWindow: inWin(dStar[i]),
    relDiffToQExact: relTo(dAdopt[i], dExact[i]),
    driftQNegativeControl: dNC[i], ncInWindow: inWin(dNC[i]), ncRelDiff: relTo(dNC[i], dAdopt[i]) }));
  // 窓の適用先(= claims が指しているプローブ)の同定 — 第164便 exp-qexact.mjs と同一規則
  const PRIMARY_A = 80;
  const primary = rows.find((r) => r.a === PRIMARY_A);
  const referentEvidence = {
    rule: 'claims の説明文が対にしている「q=3 で 0.23 rad/公転」に一致するプローブを窓の適用先とする' +
      '(第164便 exp-qexact.mjs systems.saturnRing.window.referentEvidence と同一規則)',
    q3DriftPerProbe: rows.map((r) => ({ a: r.a, driftQ3: r.driftQ3 })),
    matchesDescription: rows.filter((r) => Math.abs(Math.abs(r.driftQ3) - 0.23) < 0.005).map((r) => r.a),
    chosen: PRIMARY_A,
    source: 'beta/index.html の saturnRingRealKF1 claims 説明文 + tests/out/kf1d-results.json tests.ring.q3',
  };
  out.systems.saturnRing = {
    emoji: '💿🛰️', label: '土星の環(実単位・kFrame=1)saturnRingRealKF1 系',
    harness: 'tests/exp-kf1d.mjs §B の run()(プローブ a=80/105/130/1221.9・e=0.1・6×T(a=80))を逐語転記',
    config: { physics: PROF, M: 56.834, radius: 60.3, spin: 0.016528, probeRadii: [80, 105, 130, 1221.9],
      probeMass: 1e-5, e: 0.1, orbits: '6 × T(a=80)', dt: 0.016, seed: 1, softening: 0.05 },
    q: T,
    primaryObservable: '環偏心テスト粒子(a=80・C環相当)の近点移動 Δϖ_drift = Δϖ(kF1,q) − Δϖ(kF0) [rad/公転]',
    window: { source: 'プリセット claims saturnRingRealKF1.ring-apsidal-drift(対象 HTML から機械読み取り)',
      expected: win, referentEvidence },
    runs: { kF0, qStar: runStar, qExact: runExact, qAdopted: runAdopt, qNegativeControl: runNC },
    baselineBitCheck: bit,
    rows,
    RW1: { observable: primary.driftQAdopted, abs: primary.absQAdopted, probeA: PRIMARY_A, window: win,
      pass: primary.inWindow, qExactPass: primary.qExactInWindow, qStarPass: primary.baselineInWindow,
      allProbesVariant: { role: '参考(判定に使わない — 窓の適用先は referentEvidence で同定済み)',
        pass: rows.every((r) => r.inWindow),
        perProbe: rows.map((r) => ({ a: r.a, abs: r.absQAdopted, ok: r.inWindow })) } },
    RW4: { qExactValue: primary.driftQExact, qAdoptedValue: primary.driftQAdopted,
      relDiffToQExact: primary.relDiffToQExact,
      relDiffToQStar: relTo(primary.driftQAdopted, primary.driftQStar),
      perProbe: rows.map((r) => ({ a: r.a, qExactValue: r.driftQExact, qAdoptedValue: r.driftQAdopted,
        relDiffToQExact: r.relDiffToQExact })),
      maxAbsRelDiffToQExact: Math.max(...rows.map((r) => Math.abs(r.relDiffToQExact === null ? 0 : r.relDiffToQExact))) },
    RW5: { qNegativeControl: T.qNegativeControl, observable: primary.driftQNegativeControl,
      relDiffToAdopted: primary.ncRelDiff, moved: !Object.is(primary.driftQNegativeControl, primary.driftQAdopted),
      inWindow: primary.ncInWindow,
      perProbe: rows.map((r) => ({ a: r.a, value: r.driftQNegativeControl, inWindow: r.ncInWindow, relDiff: r.ncRelDiff })) },
  };
  console.log(`  q*=${T.qStar.toFixed(6)}(基線ビット一致 kF0=${bit.kF0Identical}・q*走行=${bit.qStarRunIdentical}・全桁 q_exact 走行=${bit.qExactRunIdentical})`);
  for (const r of rows) {
    console.log(`   a=${String(r.a).padEnd(7)} Δϖ_drift q_exact=${r.driftQExact.toExponential(4)}` +
      ` → 採用直値=${r.driftQAdopted.toExponential(4)} 窓[${win.min},${win.max}] ${r.inWindow ? 'in' : 'out'}` +
      `(全桁比 ${(r.relDiffToQExact * 100).toExponential(3)}%・対照 ${r.driftQNegativeControl.toExponential(4)} ${r.ncInWindow ? 'in' : 'OUT'})`);
  }
  console.log(`  → RW1(窓の適用先 a=${PRIMARY_A})= ${out.systems.saturnRing.RW1.pass ? 'PASS' : 'FAIL'}`);
}

// ============================ 🟠 木星ガリレオ衛星 =============================================
{
  const T = qTable.jupiter;
  const Q_LOCK = 12.30;                                   // 出典: tests/exp-jupiter.mjs Q_LOCK(直値宣言)
  console.log('== 🟠 木星ガリレオ衛星(20 イオ公転・2000 步/公転・D₀=0.006 不変)==');
  const relDev = (Tv, Pobs) => (Tv / DAY) / Pobs - 1;     // 出典: tests/exp-jupiter.mjs §F
  const jrun = (kF, q) => page.evaluate(({ N, o, kF, q }) => window.__jup.run(kF, q, N, o),
    { N: N_STEP, o: ORBITS, kF, q });
  const kf0 = await jrun(0, Q_LOCK);
  const kf1 = await jrun(1, Q_LOCK);
  const kfE = await jrun(1, T.qExact);
  const kfA = await jrun(1, T.qAdopted);
  const kfN = await jrun(1, T.qNegativeControl);
  const mkRows = (r) => MOONS.map((mo, i) => ({ name: mo.name,
    periodDays: r.rows[i].Tavg / DAY, obs: mo.Pobs, devPercent: relDev(r.rows[i].Tavg, mo.Pobs) * 100,
    aSpread: (r.rows[i].aMax - r.rows[i].aMin) / r.rows[i].aMean,
    aSpreadPercent: 100 * (r.rows[i].aMax - r.rows[i].aMin) / r.rows[i].aMean,
    dragPe: r.rows[i].dpomPe - kf0.rows[i].dpomPe,
    ok: ((r.rows[i].aMax - r.rows[i].aMin) / r.rows[i].aMean) < 0.02
      && Math.abs(relDev(r.rows[i].Tavg, mo.Pobs)) < 0.01 }));
  const jw2 = (r) => { const rows = mkRows(r);
    return { nan: r.nan, rows, pass: !r.nan && rows.every((x) => x.ok),
      maxAbsDevPercent: Math.max(...rows.map((x) => Math.abs(x.devPercent))),
      maxASpreadPercent: Math.max(...rows.map((x) => x.aSpreadPercent)) }; };
  const jStar = jw2(kf1), jExact = jw2(kfE), jAdopt = jw2(kfA), jNC = jw2(kfN);
  const jkf0 = { rows: MOONS.map((mo, i) => ({ name: mo.name, periodDays: kf0.rows[i].Tavg / DAY,
    obs: mo.Pobs, devPercent: relDev(kf0.rows[i].Tavg, mo.Pobs) * 100,
    ok: Math.abs(relDev(kf0.rows[i].Tavg, mo.Pobs)) < 0.01 })) };
  jkf0.pass = jkf0.rows.every((x) => x.ok);
  const refJW1 = inputs.jupiter.windows.JW1.rows, refJW2 = inputs.jupiter.windows.JW2.rows;
  const refQx = inputs.qexact.systems.jupiter;
  const bit = {
    reference: 'tests/out/jupiter-results.json windows.JW1.rows / windows.JW2.rows ' +
      '+ tests/out/qexact-results.json systems.jupiter.runs.qExact',
    qStarSameAsReference: Object.is(T.qStar, inputs.jupiter.sensitivity.qControls.qStar),
    qExactSameAsReference: Object.is(T.qExact, refQx.q.qExact),
    jw1Identical: jkf0.rows.every((r, i) => Object.is(r.periodDays, refJW1[i].periodDays)),
    jw2Identical: jStar.rows.every((r, i) => Object.is(r.periodDays, refJW2[i].periodDays)
      && Object.is(r.aSpread, refJW2[i].aSpread)),
    qExactRunIdentical: jExact.rows.every((r, i) => Object.is(r.periodDays, refQx.runs.qExact.rows[i].periodDays)
      && Object.is(r.aSpread, refQx.runs.qExact.rows[i].aSpread)),
    jw1RelDiff: jkf0.rows.map((r, i) => relTo(r.periodDays, refJW1[i].periodDays)),
    jw2RelDiff: jStar.rows.map((r, i) => relTo(r.periodDays, refJW2[i].periodDays)),
  };
  bit.allIdentical = bit.jw1Identical && bit.jw2Identical && bit.qExactRunIdentical;
  out.systems.jupiter = {
    emoji: '🟠', label: '木星ガリレオ衛星 hold-out(exp-jupiter.mjs 構成)',
    harness: 'tests/exp-jupiter.mjs の HARNESS build/run(2000 步/イオ公転 × 20 公転)を逐語転記',
    config: { physics: JPHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, GM: JGM,
      moons: MOONS, stepsPerOrbit: N_STEP, orbits: ORBITS, T_IO_units: T_IO, pinned: true, seed: 1 },
    q: T,
    qDeclaredInHarness: Q_LOCK,
    primaryObservable: 'JW2 条件(NaN なし・4衛星とも |Δa|/a<2% かつ 周期が観測値と ±1%)',
    window: { source: 'tests/exp-jupiter.mjs windowsPreRegistered.JW2',
      verbatim: inputs.jupiter.windowsPreRegistered.JW2 },
    JW1Baseline: jkf0,
    runs: { qStar: jStar, qExact: jExact, qAdopted: jAdopt, qNegativeControl: jNC },
    baselineBitCheck: bit,
    RW1: { pass: jAdopt.pass, nan: jAdopt.nan,
      maxAbsDevPercent: jAdopt.maxAbsDevPercent, maxASpreadPercent: jAdopt.maxASpreadPercent,
      rows: jAdopt.rows.map((r) => ({ name: r.name, devPercent: r.devPercent,
        aSpreadPercent: r.aSpreadPercent, ok: r.ok })),
      qExactPass: jExact.pass, qStarPass: jStar.pass },
    RW4: { perMoon: jAdopt.rows.map((r, i) => ({ name: r.name,
      periodQExact: jExact.rows[i].periodDays, periodQAdopted: r.periodDays,
      periodRelDiffToQExact: relTo(r.periodDays, jExact.rows[i].periodDays),
      aSpreadQExact: jExact.rows[i].aSpread, aSpreadQAdopted: r.aSpread,
      aSpreadRelDiffToQExact: relTo(r.aSpread, jExact.rows[i].aSpread),
      dragQExact: jExact.rows[i].dragPe, dragQAdopted: r.dragPe,
      dragRelDiffToQExact: relTo(r.dragPe, jExact.rows[i].dragPe) })),
      maxAbsPeriodRelDiffToQExact: Math.max(...jAdopt.rows.map((r, i) =>
        Math.abs(relTo(r.periodDays, jExact.rows[i].periodDays) || 0))),
      relDiffToQExact: relTo(jAdopt.maxAbsDevPercent, jExact.maxAbsDevPercent) },
    RW5: { qNegativeControl: T.qNegativeControl, pass: jNC.pass,
      maxAbsDevPercent: jNC.maxAbsDevPercent, maxASpreadPercent: jNC.maxASpreadPercent,
      relDiffToAdopted: relTo(jNC.maxAbsDevPercent, jAdopt.maxAbsDevPercent),
      moved: jNC.rows.some((r, i) => !Object.is(r.periodDays, jAdopt.rows[i].periodDays)
        || !Object.is(r.dragPe, jAdopt.rows[i].dragPe)),
      inWindow: jNC.pass,
      perMoon: jNC.rows.map((r, i) => ({ name: r.name, devPercent: r.devPercent,
        aSpreadPercent: r.aSpreadPercent, dragQNegativeControl: r.dragPe,
        dragRelDiffToAdopted: relTo(r.dragPe, jAdopt.rows[i].dragPe), ok: r.ok })) },
  };
  console.log(`  kF0(JW1 相当)基線ビット一致=${bit.jw1Identical} / q=${Q_LOCK} 基線ビット一致=${bit.jw2Identical}` +
    ` / 全桁 q_exact 走行ビット一致=${bit.qExactRunIdentical}`);
  console.log(`  採用直値 q=${T.qAdopted} 周期ずれ最大 ${jAdopt.maxAbsDevPercent.toFixed(4)}% / |Δa|/a 最大 ` +
    `${jAdopt.maxASpreadPercent.toFixed(5)}% / NaN=${jAdopt.nan} → RW1 ${jAdopt.pass ? 'PASS' : 'FAIL'}`);
  console.log(`  否定対照 q=${T.qNegativeControl.toFixed(6)} 周期ずれ最大 ${jNC.maxAbsDevPercent.toFixed(4)}%` +
    ` → JW2 ${jNC.pass ? 'in' : 'OUT'}`);
}

// ============================ 総括 ==========================================================
out.rw1Summary = {
  rule: PRE_REGISTERED.RW1,
  perSystem: Object.fromEntries(Object.entries(out.systems).map(([k, v]) =>
    [k, { pass: v.RW1.pass, qExactPass: v.RW1.qExactPass, qStarPass: v.RW1.qStarPass }])),
  allPass: Object.values(out.systems).every((v) => v.RW1.pass === true),
};
out.rw3Summary = {
  rule: PRE_REGISTERED.RW3,
  note: '基線再測(kF0・q* 走行・全桁 q_exact 走行)が既存実測正本とビット一致するかの総括。' +
    '一致していれば本便の転記(構成・測定器)が既存ハーネスと同一実体であることの機械証拠になる',
  targetAllSame: targetConsistency.allSame,
  perSystem: Object.fromEntries(Object.entries(out.systems).map(([k, v]) =>
    [k, { allIdentical: v.baselineBitCheck.allIdentical, detail: v.baselineBitCheck }])),
  allIdentical: Object.values(out.systems).every((v) => v.baselineBitCheck.allIdentical === true),
};
out.rw4Summary = {
  rule: PRE_REGISTERED.RW4,
  note: '「規約の実装(4桁丸め)」に由来する系統誤差。第164便 QW2 の「規約の選択(q*→q_exact)」とは別成分',
  perSystem: Object.fromEntries(Object.entries(out.systems).map(([k, v]) =>
    [k, { qAdopted: v.q.qAdopted, qExact: v.q.qExact, relRoundingDeltaQ: v.q.relRoundingDelta,
      relDiffToQExact: v.RW4.relDiffToQExact }])),
  maxAbsRelDiffToQExact: Math.max(...Object.values(out.systems)
    .map((v) => Math.abs(v.RW4.relDiffToQExact === null ? 0 : v.RW4.relDiffToQExact))),
};
{
  const rows = Object.entries(out.systems).map(([k, v]) => ({ system: k,
    qAdopted: v.q.qAdopted, qNegativeControl: v.q.qNegativeControl,
    identityWouldMatch: Object.is(v.q.qNegativeControl, v.q.qAdopted),
    moved: v.RW5.moved, relDiffToAdopted: v.RW5.relDiffToAdopted, inWindow: v.RW5.inWindow }));
  out.rw5Summary = {
    rule: PRE_REGISTERED.RW5,
    factor: NC_FACTOR, rows,
    identityAllFail: rows.every((r) => r.identityWouldMatch === false),
    allMoved: rows.every((r) => r.moved === true),
    windowFailCount: rows.filter((r) => r.inWindow === false).length,
    windowFailSystems: rows.filter((r) => r.inWindow === false).map((r) => r.system),
    pass: rows.every((r) => r.identityWouldMatch === false) && rows.every((r) => r.moved === true),
    note: '否定対照 = 採用直値を +' + ((NC_FACTOR - 1) * 100).toFixed(0) + '% ずらした走行。' +
      '合否は (a) 直値同定が全系で不一致になること・(b) 全系で主観測量が動くこと の2条件で、' +
      'RW1 主窓を外れる系の件数(windowFailCount)は記述として併記する',
  };
}

// ============================ RW6: 決定性(2回実行 SHA 一致)==================================
{
  const target = { systems: out.systems };
  const mine = JSON.stringify(canonize(target));
  const rec = { rule: PRE_REGISTERED.RW6,
    canonicalization: 'out.systems(実測部)のみを対象に、キーを再帰整列した JSON の SHA-256。' +
      '日時・経過時間・環境などの揮発キーは meta / manifest 側にしか置いていないので、' +
      '対象内に除外すべき揮発値は存在しない',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.QXR_DET_REF;
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
  out.rw6 = { rule: PRE_REGISTERED.RW6, sha256: rec.sha256, reference: rec.reference,
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
  experiment: { id: 'qexact-regime', wave: 180,
    title: 'q_exact 世代「採用直値」regime の実測(プリセットが宣言する4桁丸め直値での実較正4系の走行)',
    command: 'node tests/exp-qexact-regime.mjs(QXR_OUT / QXR_DET_REF で決定性の2回実行)' },
  presets: { mode: 'mixed',
    ids: ['mercuryRealKF1', 'earthMoonRealKF1', 'saturnRingRealKF1', 'jupiterGalilean'],
    declaredIn: '🪨🌘 = exp-kf1c mkMerc/mkEM の逐語転記 / 💿 = exp-kf1d §B の逐語転記 / 🟠 = exp-jupiter HARNESS の逐語転記',
    declaration: '走行構成はすべて動的構成(内蔵プリセットを読まず、既存ハーネスの宣言値を逐語転記して build する)。' +
      '内蔵プリセットは**事前登録窓(claims.expected)の機械読み取り**と**採用直値 q の同定照合(RW2)**' +
      'にだけ使い、走行そのものには使わない',
    modifiedAtRuntime: 'なし(プリセットは読み取り専用)',
    configs: {
      mercury: out.systems.mercury.config, earthMoon: out.systems.earthMoon.config,
      saturnRing: out.systems.saturnRing.config, jupiter: out.systems.jupiter.config,
      qInputs: Q_INPUTS, qTable },
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
      '既存の事前登録窓(claims の expected・exp-kf1c §D2・exp-jupiter JW2 — 実行時に機械読み取り)'],
    fit: [],
    derived: ['q* = 3 + ln(1.25·c₀²R/(GM))/ln((R+a)/R)(既知量だけから計算)',
      'q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)(同上)',
      '採用直値 q = ROUND' + ROUND_DIGITS + '(q_exact)(本便が走らせる唯一の量 — 対象 HTML の宣言値と RW2 で照合)',
      '否定対照 q = 採用直値 × ' + NC_FACTOR,
      '引きずり歳差 Δϖ(kF1)−Δϖ(kF0)(🪨💿)', '近点回転比 Δϖ/0.05311(🌘)',
      'JW2 条件(|Δa|/a・周期ずれ — 🟠)', '全桁 q_exact 走行との相対差(RW4)'],
    holdOut: [],
    note: '**本便は較正を一切行わない**(fit=[])。動かすノブは q ただ1つで、その値は当てはめではなく' +
      '算出値の4桁丸め(=プリセットが実際に宣言している直値)である。判定窓も既存の事前登録窓を' +
      'そのまま流用しており、本便で新設した窓は1つもない',
  },
  judgement: {
    pointers: ['preRegistered.RW1', 'preRegistered.RW2', 'preRegistered.RW3', 'preRegistered.RW4',
      'preRegistered.RW5', 'preRegistered.RW6',
      'adoptedLiteralIdentification', 'rw1Summary', 'rw3Summary', 'rw4Summary', 'rw5Summary', 'rw6',
      'systems.mercury.RW1', 'systems.earthMoon.RW1', 'systems.saturnRing.RW1', 'systems.jupiter.RW1',
      'systems.mercury.RW4', 'systems.earthMoon.RW4', 'systems.saturnRing.RW4', 'systems.jupiter.RW4',
      'systems.mercury.RW5', 'systems.earthMoon.RW5', 'systems.saturnRing.RW5', 'systems.jupiter.RW5',
      'declared.claimWindows', 'declared.presets', 'targetConsistency', 'qTable'],
    note: '窓は実測前に固定してあり実測後に動かしていない(preRegistered)。窓の数値の出典は各 ' +
      'systems.*.window.source にある(🪨💿 は対象 HTML の claims から機械読み取り・🌘 は ' +
      'exp-kf1c §D2・🟠 は exp-jupiter の JW2)。基線再測のビット照合は rw3Summary にある',
    externalReferences: ['🪨 水星の 1PN 解析値 5.02e-7 rad/公転(kf1c §D1 の窓の分母)',
      '🌘 の近点回転 0.05311 rad/公転(8.85 年)・恒星月 27.3217 日',
      '🟠 4衛星の恒星公転周期(NASA の惑星衛星 fact sheet 系 — exp-jupiter.mjs の帰属に従う)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない(記録しているのは軌道要素のドリフト・振幅・NaN フラグ)' },
  },
  regenerationNote: 'meta(日時・経過時間)は非測定メタなので照合対象外。決定性の照合対象は out.systems のみ',
  excludeKeys: ['meta'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
console.log(`\nRW1 総括: ${JSON.stringify(out.rw1Summary.perSystem)} → 全系 PASS=${out.rw1Summary.allPass}`);
console.log(`RW3 基線 bit 照合: 全系一致=${out.rw3Summary.allIdentical}`);
console.log(`RW4 4桁丸めの系統誤差(最大 |相対差|)= ${out.rw4Summary.maxAbsRelDiffToQExact.toExponential(3)}`);
console.log(`RW5 否定対照(×${NC_FACTOR}): 直値同定 全系 FAIL=${out.rw5Summary.identityAllFail}` +
  ` / 全系で観測量が動いた=${out.rw5Summary.allMoved} / 主窓を外れた系=${out.rw5Summary.windowFailCount}件` +
  `[${out.rw5Summary.windowFailSystems.join(' ')}] → ${out.rw5Summary.pass ? 'PASS' : 'FAIL'}`);
console.log(`RW6 決定性: ${out.rw6.result}(SHA ${out.rw6.sha256.slice(0, 16)}…)`);
console.log(`所要 ${out.meta.elapsedSec.toFixed(1)} 秒 / saved: ${path.relative(ROOT, OUT_PATH)}`);
await browser.close();

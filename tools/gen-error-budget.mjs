// 第166便 error budget(誤差予算)の形式化 — 既存の結果 JSON からの機械集計
// 第169便 v2 拡張(schemaVersion 1.0 → 1.1・**後方互換の追加のみ**)
// 第180便 v3 拡張(schemaVersion 1.1 → 1.2・**後方互換の追加のみ**)
// ============================================================================================
// v3(第180便)で足したもの — 行構成(5主張)・既存キー・既存の判定窓は一切変えていない:
//   ① 各主張へ追加成分 `regimeLayer` を新設した。**q の世代(regime)ごとに主観測量と窓判定を
//      層別する**台帳の層である:
//        ・qStar 世代 … 第123便 qLock 則の遠方近似形 q*(既存成分。台帳の value / window /
//          components.qFormSensitivity がこの世代の記録なので、regimeLayer は値の再掲ではなく
//          **既存キーへのポインタ**と q* での窓判定だけを持つ)
//        ・qExact 世代 … 第172便で採用した厳密一致式 q_exact。運用上プリセット・ハーネスへ
//          載っているのはその **4桁丸め直値**(6.1471 / 8.2358 / 20.4932 / 12.0586)なので、
//          全桁 q_exact と採用直値の**両方**を層に持ち、丸めに由来する系統誤差を機械計算する。
//      数値はすべて第180便 tests/exp-qexact-regime.mjs の出力
//      tests/out/qexact-regime-results.json から機械読取する(本ファイルに実測値の literal は無い)。
//   ② 台帳ルートへ `regimes` ブロック(世代の定義・世代別の窓判定タリー・否定対照の総括)を新設した。
//   ③ 否定対照を2件、明示的に台帳へ載せた:
//        ・ハーネス側 … 採用直値を +1% ずらした対照走行(RW5)。直値同定が全系で外れ、全系で
//          主観測量が動くことをハーネスが自己確認している。台帳はその結論を機械読取する。
//        ・生成器側 … 出典 JSON が欠落・構造不正なら**明示エラーで停止**する(センチネルで
//          誤魔化さない)。regime 層の入力が無いまま台帳が「それらしく」生成されることを塞ぐ。
//   ④ 主成分5件・既存の追加成分・既存の判定窓・較正値は 1 つも動かしていない。
// ============================================================================================
// v2(第169便)で足したもの — 行構成(5主張)・既存キー・既存の判定窓は一切変えていない:
//   ① 🪨 水星 / 🌘 地球月 / 💿 土星環 の主成分 dtConvergence・windowSensitivity を、
//      第169便 tests/exp-kf1sens.mjs の実測(dt×{0.5,2}・測定窓×{0.5,2})で**実データ化**した。
//      v1 ではこの6マスが "not-instrumented"(単一 dt・単一窓でしか走っていない)だった。
//      → 主成分の計装は 8/25 から 14/25 へ増える(数え上げは summary が機械集計する)。
//   ② 4主張(🪨🌘💿🟠)へ追加成分 `qFormSensitivity` を新設した。第164便 tests/exp-qexact.mjs の
//      「qLock 則 q* を厳密一致式 q_exact へ置換した再走行」から、観測量の相対差を機械読取する。
//      🪨 と 💿(a=80)の行にはさらに **q_exact 走行値の現行 claims 窓に対する余裕(margin)** を
//      機械計算して収載し、結論フィールド `qExactStillWithinWindow` を持たせる。
//      窓の数値は claims(対象 HTML から機械読み取りした qexact JSON の claimWindows)から読む —
//      本ファイルにはハードコードしない。
//   ③ qLock 径方向監査の行は v1 のまま(変更なし)。
// ============================================================================================
// 目的: 外部レビュー(2026-08-22 Grok「a more formal error budget would strengthen the claims」)
//   への恒久対応。較正・ホールドアウト主張ごとに「主観測量はいくつで、その不確かさは
//   どの成分から来ていて、どの成分は**まだ測っていない**のか」を1枚の機械可読な台帳にする。
//
// 設計の原則(第140便 tools/gen-figures3.mjs・第145便 tests/manifest.mjs の流儀を踏襲):
//   ① **新規シミュレーションは走らせない**。数値はすべて **コミット済みの結果 JSON**
//      (tests/out/*.json のうち .gitignore で白リスト済みのもの)から機械読取・機械集計する。
//      本ファイルに実測値の数値リテラルは1つも書かない(丸め桁数・単位換算などのメタ定数のみ)。
//   ② 取得できない成分は捏造せず、tests/manifest.mjs の固定語彙で正直に書く:
//      "not-instrumented"(概念はあるが計装していない)/ "not-applicable"(その概念が無い)。
//      **空欄・null を残さない**。「測っていない」ことも誤差予算の1行である。
//   ③ 生成は決定的。実行のたびに変わる値(日時・Node 版・git commit・生成器の SHA)は
//      `generated` ブロックへ隔離し、照合時はこのブロックを除外する。
//   ④ 出典は file+SHA-256 で固定する。出典 JSON が1 bit でも動けば照合ゲートが落ちる。
//
// 検査: tests/qa.mjs の `errorbudget.presence`(存在+スキーマ+5主張の全行)と
//   `errorbudget.consistency`(本モジュールを import して再集計し、コミット済み JSON と一致・
//   出典 SHA-256 も現ファイルと一致)が機械照合する。DOM 不要なので QA_FAST でも判定する。
//
// 実行: `node tools/gen-error-budget.mjs` → tests/out/error-budget.json + コンソールに表形式サマリ
// ============================================================================================
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCHEMA = 'dfm-error-budget';
export const SCHEMA_VERSION = '1.2';
// スキーマの版歴(後方互換の追加のみ — 行構成・既存キー・既存の判定窓は不変)
export const SCHEMA_HISTORY = [
  { version: '1.0', wave: 166, change: '初版 — 5主張 × 主成分5件の台帳を新設' },
  { version: '1.1', wave: 169,
    change: '🪨🌘💿 の dtConvergence / windowSensitivity を第169便 exp-kf1sens の実測で実データ化' +
      '(センチネル → instrumented)。🪨🌘💿🟠 へ追加成分 qFormSensitivity を新設し、' +
      '🪨 と 💿(a=80)には q_exact 走行値の現行 claims 窓に対する余裕と結論 ' +
      'qExactStillWithinWindow を機械計算で収載。行構成・既存キー・窓の数値は不変' },
  { version: '1.2', wave: 180,
    change: '全主張へ追加成分 regimeLayer(q の世代 qStar / qExact の層別)を新設し、qExact 世代は' +
      '第180便 exp-qexact-regime の実測(採用直値=4桁丸め直値での走行・全桁 q_exact との相対差・' +
      '基線 bit 照合・否定対照)から機械読取。台帳ルートへ regimes ブロックを新設。' +
      '出典 JSON の欠落・構造不正は明示エラーで停止する(生成器側の否定対照)。' +
      '行構成・既存キー・既存の判定窓・較正値は不変' },
];

// 明示値のセンチネル(tests/manifest.mjs の語彙をそのまま踏襲 — 語彙外の逃げ口上を作らない)
export const NOT_APPLICABLE = 'not-applicable';
export const NOT_INSTRUMENTED = 'not-instrumented';
export const UNAVAILABLE = 'unavailable';
export const SENTINELS = [NOT_APPLICABLE, NOT_INSTRUMENTED, UNAVAILABLE];
export const INSTRUMENTED = 'instrumented';

// 誤差予算の成分は**この5つを必ず全主張に置く**(データが無ければセンチネルで明示する)。
// 追加成分は各主張の固有事情に応じて後ろへ足す(順序は固定 = 決定的出力のため)。
export const COMPONENT_KEYS = ['numericalFloor', 'dtConvergence', 'windowSensitivity', 'sourceSpread', 'seedSpread'];
// 各主張行の必須フィールド(qa.mjs の presence ゲートが同じ配列を見る)
export const REQUIRED_CLAIM_FIELDS = ['id', 'claim', 'sourceJsons', 'value', 'window', 'components', 'verdictPointer'];
// 初版の対象主張(ハンドオフ 2026-08-22a §3b で統括が固定した5行)
export const CLAIM_IDS = [
  'mercury-perihelion',
  'earth-moon-two-observables',
  'saturn-ring-apsidal',
  'jupiter-holdout',
  'qlock-radial-audit',
];

// 出典 JSON(すべて .gitignore で白リスト済みのコミット対象)
const SRC_FILES = {
  kf1c: 'tests/out/kf1c-results.json',
  kf1d: 'tests/out/kf1d-results.json',
  jupiter: 'tests/out/jupiter-results.json',
  jup365: 'tests/out/jup365-results.json',
  jupseeds: 'tests/out/jupseeds-results.json',
  qlockradial: 'tests/out/qlockradial-results.json',
  // v2(第169便)で追加した出典 — いずれも既存の実測正本(本台帳は1 bit も書き換えない)
  qexact: 'tests/out/qexact-results.json',
  kf1sens: 'tests/out/kf1sens-results.json',
  // v3(第180便)で追加した出典 — regime 層(qExact 世代 = 採用直値)の供給元
  qexactRegime: 'tests/out/qexact-regime-results.json',
};
// 出典が欠けているときのエラー文へ入れる再生成コマンド(メタ情報 — 実測値ではない)
const SRC_HARNESS = {
  kf1c: 'node tests/exp-kf1c.mjs', kf1d: 'node tests/exp-kf1d.mjs',
  jupiter: 'node tests/exp-jupiter.mjs', jup365: 'node tests/exp-jup365.mjs',
  jupseeds: 'node tests/exp-jupseeds.mjs', qlockradial: 'node tests/exp-qlockradial.mjs',
  qexact: 'node tests/exp-qexact.mjs', kf1sens: 'node tests/exp-kf1sens.mjs',
  qexactRegime: 'node tests/exp-qexact-regime.mjs',
};

const OUT_REL = 'tests/out/error-budget.json';
const PCT = 100;   // メタ定数: 比 → % の単位換算のみに使う(実測値ではない)

// ---- v3: regime(q の世代)層の定義 ----------------------------------------------------------
// 世代 ID(順序固定 = 決定的出力のため)
export const REGIME_IDS = ['qStar', 'qExact'];
// 主張 → exp-qexact-regime.mjs の系キー。useAbs は「窓が絶対値に対する帯かどうか」の構造情報で、
// 実測値ではない(第164便 exp-qexact.mjs の窓の当て方と同一)。
export const REGIME_SYSTEMS = {
  'mercury-perihelion': { key: 'mercury', useAbs: true },
  'earth-moon-two-observables': { key: 'earthMoon', useAbs: false },
  'saturn-ring-apsidal': { key: 'saturnRing', useAbs: true },
  'jupiter-holdout': { key: 'jupiter', useAbs: NOT_APPLICABLE },
};

// ---- 小道具 ---------------------------------------------------------------------------------
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const ptr = (key, dotted) => `${SRC_FILES[key]}#${dotted}`;
const finite = (xs) => xs.filter((x) => typeof x === 'number' && Number.isFinite(x));
// 実測値の散らばりの機械集計(丸めない — 生の倍精度をそのまま台帳へ載せる)
const spreadOf = (xs) => {
  const v = finite(xs);
  if (!v.length) return { n: 0, min: UNAVAILABLE, max: UNAVAILABLE, mean: UNAVAILABLE, absSpread: UNAVAILABLE, relSpread: UNAVAILABLE };
  const min = Math.min(...v), max = Math.max(...v);
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  return { n: v.length, min, max, mean, absSpread: max - min, relSpread: mean === 0 ? UNAVAILABLE : Math.abs((max - min) / mean) };
};
const maxAbs = (xs) => { const v = finite(xs).map(Math.abs); return v.length ? Math.max(...v) : UNAVAILABLE; };
const minOf = (xs) => { const v = finite(xs); return v.length ? Math.min(...v) : UNAVAILABLE; };
// 相対差(基準が 0 のときは相対値を作らない — 0 除算で無限大を台帳へ載せない)
const relDiff = (a, b) => (typeof a === 'number' && typeof b === 'number' && b !== 0) ? (a - b) / Math.abs(b) : UNAVAILABLE;

const instrumented = (obj) => ({ status: INSTRUMENTED, ...obj });
const notInstrumented = (note, evidence) => ({ status: NOT_INSTRUMENTED, note, ...(evidence === undefined ? {} : { evidence }) });
const notApplicable = (note, evidence) => ({ status: NOT_APPLICABLE, note, ...(evidence === undefined ? {} : { evidence }) });
// 5成分を固定順で置き、追加成分を後ろへ連結する(キー順まで決定的にする)
const components = (five, extras) => {
  const out = {};
  for (const k of COMPONENT_KEYS) out[k] = five[k];
  for (const k of Object.keys(extras || {})) out[k] = extras[k];
  return out;
};

// ---- v3 否定対照(生成器側): 出典が欠けている・構造が違うなら**明示エラーで停止**する ----------
// センチネルで誤魔化して「それらしい台帳」を吐かせない。台帳は数値を捏造しないという原則の機械化。
export class ErrorBudgetSourceError extends Error {
  constructor(msg) { super(msg); this.name = 'ErrorBudgetSourceError'; }
}
const srcMissing = (key, rel) => new ErrorBudgetSourceError(
  `error-budget v${SCHEMA_VERSION}: 出典 JSON ${rel} が無い(key=${key})。` +
  `台帳は数値を捏造しないので生成を中止する — \`${SRC_HARNESS[key] || '(対応ハーネス不明)'}\` を実行して` +
  '実測正本を作り直すこと');
// regime 層の入力は構造まで検査する(キーが欠けたまま「層はあるが中身は空」を作らせない)
const REGIME_REQUIRED_BLOCKS = ['systems', 'qTable', 'rw1Summary', 'rw3Summary', 'rw4Summary', 'rw5Summary', 'rw6'];
function assertRegimeShape(json, rel) {
  const missing = REGIME_REQUIRED_BLOCKS.filter((k) => json[k] === undefined || json[k] === null);
  if (missing.length) {
    throw new ErrorBudgetSourceError(
      `error-budget v${SCHEMA_VERSION}: ${rel} に必須ブロックが無い [${missing.join(' ')}]。` +
      'regime 層の入力として使えないので生成を中止する(停止した実行 = stage:"stopped-at-…" の JSON も同じく弾く)');
  }
  const need = Object.values(REGIME_SYSTEMS).map((v) => v.key);
  const absent = need.filter((k) => !json.systems[k]);
  if (absent.length) {
    throw new ErrorBudgetSourceError(
      `error-budget v${SCHEMA_VERSION}: ${rel} に regime 層の対象系が無い [${absent.join(' ')}]` +
      `(期待=[${need.join(' ')}])。生成を中止する`);
  }
}

// ---- 出典の読み込み(file + SHA-256 + bytes で実体を固定)--------------------------------------
function readSources(root) {
  const src = {};
  for (const [key, rel] of Object.entries(SRC_FILES)) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) throw srcMissing(key, rel);
    const bytes = fs.readFileSync(abs);
    let json;
    try { json = JSON.parse(bytes.toString('utf8')); }
    catch (e) {
      throw new ErrorBudgetSourceError(
        `error-budget v${SCHEMA_VERSION}: 出典 JSON ${rel} を解析できない(${String(e && e.message || e)})。生成を中止する`);
    }
    if (key === 'qexactRegime') assertRegimeShape(json, rel);
    const m = json.manifest || {};
    src[key] = {
      key, file: rel, sha256: sha256(bytes), bytes: bytes.length, json,
      experimentId: (m.experiment && m.experiment.id) || UNAVAILABLE,
      wave: (m.experiment && m.experiment.wave) !== undefined ? m.experiment.wave : UNAVAILABLE,
    };
  }
  return src;
}
// 主張行に載せる出典参照(json 本体は載せない — 台帳は出典のコピーを持たない)
const srcRef = (src, keys) => keys.map((k) => ({
  file: src[k].file, sha256: src[k].sha256, bytes: src[k].bytes,
  experimentId: src[k].experimentId, wave: src[k].wave,
}));

// =============================================================================================
// v2(第169便)の共通部品 — 第169便 exp-kf1sens / 第164便 exp-qexact からの機械読取
// =============================================================================================

// ---- 感度軸(dt / 窓)の成分を kf1sens-results.json から組み立てる --------------------------
// 数値は 1 つも書かない。系キー・軸キーだけを渡し、行も床も出典 JSON の構造をそのまま畳む。
const AXIS_LABEL = { dt: '步幅 dt', window: '測定窓' };
function sensComponent(src, sysKey, axisKey) {
  const ks = src.kf1sens.json;
  const s = (ks.systems || {})[sysKey];
  if (!s || !s.KW2 || !s.KW2[axisKey]) {
    return notInstrumented(
      `第169便 exp-kf1sens の出力に systems.${sysKey}.KW2.${axisKey} が無い(出典 JSON の構造が想定と違う)`,
      { pointer: ptr('kf1sens', `systems.${sysKey}.KW2.${axisKey}`) });
  }
  const ax = s.KW2[axisKey];
  const pk = s.primaryObservableKey;
  // 床の要約(「数値床併記」— 測れた床は値を、測っていない床は固定語彙のステータスを載せる)
  const floorRow = (v) => {
    const f = v.floors || {};
    const pick = (k) => {
      const b = f[k];
      if (!b) return UNAVAILABLE;
      return b.status === INSTRUMENTED
        ? (b.value === undefined ? INSTRUMENTED : b.value)
        : b.status;
    };
    return { tag: v.tag, periodResolutionFloorRel: pick('periodResolutionFloorRel'),
      apsidalUlpFloor: pick('apsidalUlpFloor'),
      lsqSampleCount: (f.apsidalLsq && f.apsidalLsq.nSamples) !== undefined
        ? f.apsidalLsq.nSamples : NOT_APPLICABLE,
      integrationSteps: v.steps };
  };
  return instrumented({
    note: `${AXIS_LABEL[axisKey]}を正本設定から振り直して同一構成を測り直したときの観測量の動き` +
      '(第169便 exp-kf1sens.mjs — 物理キー・較正値・判定窓はすべて不変で、動かしたのは測定器側の設定だけ)',
    pointer: ptr('kf1sens', `systems.${sysKey}.KW2.${axisKey}`),
    preRegisteredRule: ks.preRegistered.KW2.verbatim,
    axisApplication: ks.preRegistered.KW2.axisApplication[axisKey],
    observableKeys: s.observableKeys,
    primaryObservableKey: pk,
    observableUnits: s.observableUnits,
    baseline: ax.baseline,
    rows: ax.variants.map((v) => ({ tag: v.tag, dt: v.dt, dtFactor: v.dtFactor,
      window: v.window, windowFactor: v.windowFactor, steps: v.steps,
      observables: v.observables, relToBaseline: v.relToBaseline })),
    maxAbsRelDiff: ax.maxAbsRelDiff,
    maxAbsRelDiffPrimary: ax.maxAbsRelDiff[pk],
    maxAbsRelDiffOverall: ax.maxAbsRelDiffOverall,
    numericalFloors: { rule: ks.preRegistered.KW2.floorRule, rows: ax.variants.map(floorRow) },
    baselineTranscription: {
      note: '正本設定での基線再測が kf1c/kf1d の対応値とビット一致するか(KW1 — 感度の基準点が' +
        '既存の実測正本と同一実体であることの機械証拠)',
      rule: ks.preRegistered.KW1.verbatim,
      allIdentical: s.KW1.allIdentical,
      nFieldsCompared: s.KW1.pairs.reduce((a, p) => a + p.rows.length, 0) + s.KW1.derivedChecks.length,
      pointer: ptr('kf1sens', `systems.${sysKey}.KW1`),
      targetAllSame: ks.kw1Summary.targetAllSame,
    },
    determinism: { result: ks.kw3.result, identical: ks.kw3.identical, sha256: ks.kw3.sha256,
      pointer: ptr('kf1sens', 'kw3') },
  });
}

// ---- 窓に対する余裕(margin)の機械計算 ------------------------------------------------------
// 窓 {min,max} と実測値から、余裕・窓内かどうかを機械で出す。窓の数値は呼び出し側が
// 出典 JSON(claims の機械読み取り)から渡す — 本ファイルには窓の数値リテラルを置かない。
function marginAgainstWindow(value, win, useAbs) {
  if (typeof value !== 'number' || !Number.isFinite(value) || !win
    || typeof win.min !== 'number' || typeof win.max !== 'number') {
    return { status: UNAVAILABLE, note: '値または窓が数値として取得できない', value, window: win || UNAVAILABLE };
  }
  const v = useAbs ? Math.abs(value) : value;
  const width = win.max - win.min;
  const toMin = v - win.min, toMax = win.max - v;
  return {
    status: INSTRUMENTED,
    comparedValue: v, rawValue: value, usedAbsoluteValue: useAbs === true, window: win,
    within: v >= win.min && v <= win.max,
    distanceToMin: toMin, distanceToMax: toMax,
    relMarginToMin: win.min === 0 ? UNAVAILABLE : toMin / Math.abs(win.min),
    relMarginToMax: win.max === 0 ? UNAVAILABLE : toMax / Math.abs(win.max),
    nearestEdge: Math.abs(toMin) <= Math.abs(toMax) ? 'min' : 'max',
    distanceToNearestEdge: Math.min(Math.abs(toMin), Math.abs(toMax)),
    fractionOfWindowWidth: width === 0 ? UNAVAILABLE : toMin / width,
    marginInWindowWidths: width === 0 ? UNAVAILABLE : Math.min(Math.abs(toMin), Math.abs(toMax)) / width,
  };
}

// ---- q 規約の感度成分(q* → q_exact 置換)を qexact-results.json から組み立てる ---------------
// margin: { window, valueQExact, valueQStar, useAbs, label } を渡した行だけ窓余裕を機械計算する。
function qFormComponent(src, sysKey, extra) {
  const qx = src.qexact.json;
  const s = (qx.systems || {})[sysKey];
  if (!s) {
    return notInstrumented(
      `第164便 exp-qexact の出力に systems.${sysKey} が無い(出典 JSON の構造が想定と違う)`,
      { pointer: ptr('qexact', `systems.${sysKey}`) });
  }
  return instrumented({
    note: 'qLock 則 q*(遠方近似)を厳密一致式 q_exact へ**q だけ**置換して同一構成を再走行した' +
      'ときの観測量の動き(第164便 exp-qexact.mjs — 他のパラメータ・判定窓はすべて不変・再フィットなし)。' +
      '「規約の選択」という系統誤差の成分である',
    pointer: ptr('qexact', `systems.${sysKey}`),
    preRegisteredRule: qx.preRegistered.QW2.verbatim,
    qForms: { qStar: s.q.qStar, qExact: s.q.qExact,
      finiteRadiusCorrection: s.q.finiteRadiusCorrection,
      formula: s.q.note, pointer: ptr('qexact', `systems.${sysKey}.q`) },
    relDiffToQStar: s.QW2,
    windowVerdictUnderQExact: { pass: s.QW1.pass, baselinePass: s.QW1.baselinePass,
      windowSource: s.window.source, pointer: ptr('qexact', `systems.${sysKey}.QW1`) },
    baselineTranscription: { note: '基線(q*)再測が kf1c/kf1d/jupiter の対応値とビット一致するか',
      bitCheck: s.baselineBitCheck, targetAllSame: qx.targetConsistency.allSame },
    determinism: { result: qx.qw3.result, identical: qx.qw3.identical, sha256: qx.qw3.sha256,
      pointer: ptr('qexact', 'qw3') },
    ...(extra || {}),
  });
}

// ---- v3: regime(q の世代)層を qexact-regime-results.json から組み立てる ----------------------
// 系ごとに形の違う「主観測量のスカラ要約」を1か所で吸収する(数値は 1 つも書かない — キー選択だけ)。
function regimeObservables(s, sysKey) {
  if (sysKey === 'mercury') {
    return { unit: 'rad/公転', quantity: s.primaryObservable,
      qStar: s.dragQStar, qExactFull: s.dragQExact, qAdopted: s.dragQAdopted, negativeControl: s.dragQNegativeControl };
  }
  if (sysKey === 'earthMoon') {
    return { unit: '比(目標 1.0)', quantity: s.primaryObservable,
      qStar: s.ratioQStar, qExactFull: s.ratioQExact, qAdopted: s.ratioQAdopted, negativeControl: s.ratioQNegativeControl };
  }
  if (sysKey === 'saturnRing') {
    const r = (s.rows || []).find((x) => x.a === s.RW1.probeA) || null;
    return { unit: 'rad/公転', quantity: s.primaryObservable, probeA: s.RW1.probeA,
      qStar: r === null ? UNAVAILABLE : r.driftQStar,
      qExactFull: r === null ? UNAVAILABLE : r.driftQExact,
      qAdopted: r === null ? UNAVAILABLE : r.driftQAdopted,
      negativeControl: r === null ? UNAVAILABLE : r.driftQNegativeControl };
  }
  // 🟠 は帯ではなく条件窓(JW2)なので、条件の各項の最大値をスカラ要約として層に載せる
  return { unit: '%(周期の観測偏差の最大 |値|)', quantity: '4衛星の恒星公転周期の観測偏差の最大絶対値(JW2 条件の主項)',
    qStar: s.runs.qStar.maxAbsDevPercent, qExactFull: s.runs.qExact.maxAbsDevPercent,
    qAdopted: s.runs.qAdopted.maxAbsDevPercent, negativeControl: s.runs.qNegativeControl.maxAbsDevPercent };
}

function regimeComponent(src, claimId) {
  const conf = REGIME_SYSTEMS[claimId];
  if (!conf) {
    return notApplicable(
      'この主張は q の世代(qStar / qExact)で層別できる単一系の較正主張ではないため、regime 層を持たない' +
      '(qLock 径方向監査は q* 則そのものを半径方向に試験した監査で、採用直値の走行という概念が無い)',
      { regimeIds: REGIME_IDS, claimsWithRegime: Object.keys(REGIME_SYSTEMS) });
  }
  const rg = src.qexactRegime.json;
  const key = conf.key;
  const s = rg.systems[key];
  const q = s.q;
  const obs = regimeObservables(s, key);
  const win = (s.window && s.window.expected !== undefined) ? s.window.expected : null;
  const useAbs = conf.useAbs === true;
  const bandAvailable = win !== null && typeof win.min === 'number' && typeof win.max === 'number';

  return instrumented({
    note: 'q の世代(regime)で層別した誤差予算の層。qStar 世代は第123便 qLock 則の遠方近似形、' +
      'qExact 世代は第172便で採用した厳密一致式 — ただし**運用上プリセット・ハーネスへ載っているのは' +
      'その4桁丸め直値**なので、全桁 q_exact と採用直値の両方を層に持ち、丸めに由来する系統誤差を' +
      '機械計算する(第180便 exp-qexact-regime.mjs の実測)',
    pointer: ptr('qexactRegime', `systems.${key}`),
    systemKey: key,
    regimeIds: REGIME_IDS,
    preRegisteredRules: { RW1: rg.preRegistered.RW1.verbatim, RW2: rg.preRegistered.RW2.verbatim,
      RW3: rg.preRegistered.RW3.verbatim, RW4: rg.preRegistered.RW4.verbatim,
      RW5: rg.preRegistered.RW5.verbatim, RW6: rg.preRegistered.RW6.verbatim },
    observable: { quantity: obs.quantity, unit: obs.unit,
      ...(obs.probeA === undefined ? {} : { probeA: obs.probeA }) },
    generations: {
      qStar: {
        id: REGIME_IDS[0],
        note: '第123便 qLock 則の遠方近似形 q*。第172便以降は運用規約としては N/A だが、台帳の既存行' +
          '(value / window / components.qFormSensitivity)はこの世代の記録なので、ここでは値の再掲では' +
          'なく既存キーへのポインタと q* での窓判定だけを持つ',
        q: q.qStar,
        qPointer: ptr('qexactRegime', `systems.${key}.q.qStar`),
        value: obs.qStar,
        windowVerdict: s.RW1.qStarPass,
        ledgerPointers: { value: `claims[id=${claimId}].value`, window: `claims[id=${claimId}].window`,
          component: `claims[id=${claimId}].components.qFormSensitivity` },
      },
      qExact: {
        id: REGIME_IDS[1],
        note: '第172便で採用した厳密一致式 q_exact。全桁値は literal で持てないため、プリセット・' +
          'ハーネスへ載るのは4桁丸めの**採用直値**である。採用直値は exp-qexact-regime が ' +
          'ROUND(q_exact) と対象 HTML のプリセット宣言値の両方に照合してから走らせている(RW2)',
        qFullPrecision: q.qExact,
        qAdoptedLiteral: q.qAdopted,
        roundingDigits: q.roundingDigits,
        roundingDeltaQ: q.roundingDelta,
        relRoundingDeltaQ: q.relRoundingDelta,
        adoptedLiteralIdentification: rg.adoptedLiteralIdentification.rows[key],
        valueAtFullPrecision: obs.qExactFull,
        valueAtAdoptedLiteral: obs.qAdopted,
        relDiffAdoptedToFullPrecision: s.RW4.relDiffToQExact,
        // 🟠 の RW4 は条件窓なので q* 比を持たない → スカラ要約から機械計算する(手打ちはしない)
        relDiffAdoptedToQStar: typeof s.RW4.relDiffToQStar === 'number'
          ? s.RW4.relDiffToQStar : relDiff(obs.qAdopted, obs.qStar),
        windowVerdict: { atAdoptedLiteral: s.RW1.pass, atFullPrecision: s.RW1.qExactPass,
          windowSource: s.window.source,
          window: bandAvailable ? win
            : notApplicable('この系の事前登録窓は {min,max} の帯ではなく条件(JW2)である',
              { verbatim: s.window.verbatim }) },
        margin: bandAvailable
          ? marginAgainstWindow(obs.qAdopted, win, useAbs)
          : notApplicable('帯ではなく条件窓なので min/max に対する余裕が定義できない',
            { windowSource: s.window.source,
              conditionMaxima: { maxAbsPeriodDevPercent: s.RW1.maxAbsDevPercent,
                maxASpreadPercent: s.RW1.maxASpreadPercent, nan: s.RW1.nan } }),
        pointer: ptr('qexactRegime', `systems.${key}.RW1`),
      },
    },
    roundingSystematic: {
      note: '「規約の**実装**(4桁丸め)」に由来する系統誤差。第164便 QW2 が測った「規約の**選択**' +
        '(q* → q_exact)」とは別成分であり、components.qFormSensitivity と重複しない',
      relDiffToFullPrecision: s.RW4.relDiffToQExact,
      detail: s.RW4,
      pointer: ptr('qexactRegime', `systems.${key}.RW4`),
    },
    baselineTranscription: {
      note: '基線再測(kF0・q* 走行・全桁 q_exact 走行)が kf1c/kf1d/jupiter/qexact の実測正本と' +
        'ビット一致するか(RW3 — regime 層の測定器が既存ハーネスと同一実体であることの機械証拠)',
      rule: rg.preRegistered.RW3.verbatim,
      allIdentical: s.baselineBitCheck.allIdentical,
      detail: s.baselineBitCheck,
      targetAllSame: rg.targetConsistency.allSame,
      targetNote: rg.targetConsistency.note,
      pointer: ptr('qexactRegime', `systems.${key}.baselineBitCheck`),
    },
    negativeControl: {
      note: '否定対照 — 採用直値を意図的にずらした走行では直値同定が外れ、主観測量も動く' +
        '(ずらしても何も変わらないなら、この層は何も測っていないことになる)',
      rule: rg.preRegistered.RW5.verbatim,
      factor: rg.rw5Summary.factor,
      qNegativeControl: q.qNegativeControl,
      value: obs.negativeControl,
      detail: s.RW5,
      pointer: ptr('qexactRegime', `systems.${key}.RW5`),
    },
    determinism: { result: rg.rw6.result, identical: rg.rw6.identical, sha256: rg.rw6.sha256,
      pointer: ptr('qexactRegime', 'rw6') },
  });
}

// =============================================================================================
// 主張1: ☄️🪨 水星近点 — 引きずり歳差の較正値と事前登録窓
// =============================================================================================
function claimMercury(src) {
  const kf1c = src.kf1c.json, kf1d = src.kf1d.json;
  const mq = kf1c.tests.mercuryQscan, joint = kf1c.tests.joint, qc = kf1d.tests.qcalc;

  // q 掃引アーム(キーは q の値そのものなので数値順に整列 — 数値リテラルの転記ではない)
  const qKeys = Object.keys(mq.scan).sort((a, b) => Number(a) - Number(b));
  const arms = qKeys.map((k) => ({
    arm: k, q: Number(k),
    dPomPerOrbit: mq.scan[k].dPomPerOrbit,
    drag: mq.scan[k].dPomPerOrbit - mq.kF0.dPomPerOrbit,   // 引きずり歳差 = kF1(q) − kF0
    periodRelDev: relDiff(mq.scan[k].Tavg, mq.scan[k].TK),
    nan: mq.scan[k].nan,
  }));
  // 事前登録窓の判定に使われたアームを**機械同定**する: joint.dragQ5 と厳密一致する drag を持つ q
  const winArm = arms.find((a) => a.drag === joint.dragQ5) || null;
  // 窓のしきい値も JSON から機械読取(derivation.eps = 1PN 解析値の 1/8 — 第121便の採用水準)
  const eps = mq.derivation.eps;

  // spin2(自転用量)対照: アーム名の接頭辞で族に分ける(q3_* / q5_*)
  const spinKeys = Object.keys(kf1c.tests.mercurySpin2);
  const spinFamilies = [...new Set(spinKeys.map((k) => k.split('_')[0]))].map((fam) => {
    const rows = spinKeys.filter((k) => k.startsWith(fam + '_'))
      .map((k) => ({ arm: k, dPomPerOrbit: kf1c.tests.mercurySpin2[k].dPomPerOrbit }));
    return { family: fam, rows, ...spreadOf(rows.map((r) => r.dPomPerOrbit)) };
  });

  // 便をまたいだ再現性: kf1c と kf1d は同一構成の kF0 基線を別スクリプトで測っている
  const crossPairs = [
    { label: 'kF0 基線 Δϖ/公転', a: mq.kF0.dPomPerOrbit, b: qc.mercKF0.dPomPerOrbit },
    { label: 'kF0 基線 平均周期 Tavg', a: mq.kF0.Tavg, b: qc.mercKF0.Tavg },
  ].map((p) => ({ ...p, absDiff: p.a - p.b, bitIdentical: p.a === p.b }));

  return {
    id: CLAIM_IDS[0],
    claim: {
      ja: '☄️🪨 水星: 共通補正(D₀ 共有・幾何抑制指数 q)を掛けた近点移動の引きずり成分が、1PN 解析値の 1/8 という事前登録の上限を下回る。',
      en: 'Mercury perihelion: the frame-dragging component of the apsidal advance under the shared correction stays below the pre-registered ceiling of one eighth of the 1PN value.',
    },
    sourceJsons: srcRef(src, ['kf1c', 'kf1d']),
    value: {
      quantity: '引きずり歳差 Δϖ_drag = Δϖ(kF1) − Δϖ(kF0)',
      unit: 'rad/公転',
      primary: qc.dragMerc,
      primaryPointer: ptr('kf1d', 'tests.qcalc.dragMerc'),
      atQ: qc.qMerc,
      atQPointer: ptr('kf1d', 'tests.qcalc.qMerc'),
      windowArm: winArm === null
        ? { status: UNAVAILABLE, note: 'joint.dragQ5 と厳密一致する q 掃引アームが見つからない(出典 JSON の内部整合が崩れている)' }
        : instrumented({ arm: winArm.arm, q: winArm.q, drag: winArm.drag, pointer: ptr('kf1c', 'tests.joint.dragQ5') }),
      comparators: {
        ltPerOrbit: qc.ltPerOrbit,
        ltPointer: ptr('kf1d', 'tests.qcalc.ltPerOrbit'),
        dragOverLT: qc.ltPerOrbit === 0 ? UNAVAILABLE : qc.dragMerc / qc.ltPerOrbit,
        externalReferences: kf1d.manifest.judgement.externalReferences,
      },
    },
    window: {
      registered: kf1c.manifest.judgement.note,
      registeredPointer: ptr('kf1c', 'manifest.judgement.note'),
      thresholdAbs: eps,
      thresholdPointer: ptr('kf1c', 'tests.mercuryQscan.derivation.eps'),
      thresholdNote: '窓のしきい値は出典 JSON 内の derivation.eps(1PN 解析値の 1/8)をそのまま読んだ値である',
      measuredAbs: winArm === null ? UNAVAILABLE : Math.abs(winArm.drag),
      marginOfThreshold: winArm === null ? UNAVAILABLE : Math.abs(winArm.drag) / eps,
      marginOfThresholdAtQStar: Math.abs(qc.dragMerc) / eps,
      verdict: { ok: joint.ok1, jointPass: joint.pass },
    },
    components: components({
      numericalFloor: notInstrumented(
        '本ハーネスは1步あたりの引きずり増分と速度 1 ulp の比(数値床)を記録していない。' +
        '記録しているのは軌道要素のドリフト(eDrift・amp)と NaN フラグだけである',
        { nanFlags: arms.map((a) => ({ arm: a.arm, nan: a.nan })), healthPointer: ptr('kf1c', 'manifest.health') }),
      dtConvergence: sensComponent(src, 'mercury', 'dt'),
      windowSensitivity: sensComponent(src, 'mercury', 'window'),
      sourceSpread: notInstrumented(
        '比較先は 1PN 解析値の単一ソースで、複数の観測ソースを突き合わせていない(ソース差は未計装)',
        { externalReferences: kf1c.manifest.judgement.externalReferences }),
      seedSpread: notInstrumented(
        '単一 seed の1走行で、初期位相を振った統計を取っていない(シード散らばりは未計装)',
        { seed: kf1c.manifest.numerics.seed, seedPointer: ptr('kf1c', 'manifest.numerics.seed') }),
    }, {
      qArmSpread: instrumented({
        note: '幾何抑制指数 q を掃引したときの引きずり歳差の動き(q は当てはめではなく算出値なので、これは感度記録であって自由度ではない)',
        pointer: ptr('kf1c', 'tests.mercuryQscan.scan'),
        arms,
        dragSpread: spreadOf(arms.map((a) => a.drag)),
        periodRelDevSpread: spreadOf(arms.map((a) => a.periodRelDev)),
        derivedQStar: mq.derivation.qStar,
      }),
      spinDoseSensitivity: instrumented({
        note: '自転角速度を 0 / 実値 / ×100 / ×10⁴ と振ったときの Δϖ の動き(族ごとに集計)',
        pointer: ptr('kf1c', 'tests.mercurySpin2'),
        doses: (kf1c.manifest.numerics.sweeps || {}).spin2Mercury,
        families: spinFamilies,
        maxRelSpread: maxAbs(spinFamilies.map((f) => (f.relSpread === UNAVAILABLE ? null : f.relSpread))),
      }),
      crossHarnessAgreement: instrumented({
        note: '第122便 kf1c と第123便 kf1d が別スクリプトで測った同一構成 kF0 基線の一致(便をまたいだ再現性)',
        pairs: crossPairs,
        allBitIdentical: crossPairs.every((p) => p.bitIdentical),
      }),
      internalConsistency: instrumented({
        note: '台帳が使う「引きずり = kF1 − kF0」の定義が、出典 JSON が自分で収載している差分値と厳密一致するかの機械照合',
        checks: [
          { name: 'kf1c: joint.dragQ5 = scan[q] − kF0', ok: winArm !== null },
          { name: 'kf1d: qcalc.dragMerc = mercQstar − mercKF0', ok: (qc.mercQstar.dPomPerOrbit - qc.mercKF0.dPomPerOrbit) === qc.dragMerc },
          { name: 'kf1c: derivation.A3 = 最小 q アームの drag', ok: mq.derivation.A3 === arms[0].drag },
        ],
      }),
      qFormSensitivity: (() => {
        const qx = src.qexact.json;
        const s = qx.systems.mercury;
        // 窓の数値は claims の機械読み取り(qexact が実行時に対象 HTML から読んだもの)から取る。
        const claimWin = qx.claimWindows.mercuryDrag;
        const win = claimWin ? claimWin.expected : null;
        const mQExact = marginAgainstWindow(s.QW1.observable, win, true);
        const mQStar = marginAgainstWindow(s.dragQStar, win, true);
        return qFormComponent(src, 'mercury', {
          windowReconfirmation: {
            note: 'q_exact 走行値の**現行 claims 窓に対する余裕**の機械計算(窓の数値は動かしていない —' +
              'qexact が実行時に対象 HTML の claims から読み取った expected をそのまま使う)',
            windowSource: claimWin === null ? UNAVAILABLE : {
              presetId: claimWin.presetId, claimId: claimWin.claimId, metric: claimWin.metric,
              expected: claimWin.expected, pointer: ptr('qexact', 'claimWindows.mercuryDrag.expected'),
            },
            windowMatchesSystemBlock: claimWin !== null && s.window.expected
              && s.window.expected.min === claimWin.expected.min
              && s.window.expected.max === claimWin.expected.max,
            atQExact: mQExact,
            atQStarBaseline: mQStar,
            qExactStillWithinWindow: mQExact.status === INSTRUMENTED ? mQExact.within : UNAVAILABLE,
            alsoPassKf1cD1AtQExact: s.QW1.alsoPassKf1cD1,
          },
        });
      })(),
      regimeLayer: regimeComponent(src, CLAIM_IDS[0]),   // v3(第180便)
    }),
    verdictPointer: ptr('kf1c', 'tests.joint'),
  };
}

// =============================================================================================
// 主張2: 🌙🌘 地球月2量 — 恒星月(周期)と近点回転(Δϖ)を同時に満たす
// =============================================================================================
function claimEarthMoon(src) {
  const kf1c = src.kf1c.json, kf1d = src.kf1d.json;
  const em = kf1c.tests.earthMoonCal, joint = kf1c.tests.joint, qc = kf1d.tests.qcalc;

  // 主アームの機械同定: spin 対照アーム名(q5spin_*)の接頭辞になっている基本アームが主アーム
  const keys = Object.keys(em);
  const spinArms = keys.filter((k) => /spin/.test(k));
  const baseArms = keys.filter((k) => !/spin/.test(k));
  const primary = baseArms.find((b) => spinArms.length > 0 && spinArms.every((s) => s.startsWith(b))) || null;
  const P = primary === null ? null : em[primary];

  const arms = baseArms.map((k) => ({
    arm: k, q: Number(k.replace(/^q/, '')),
    dPomPerOrbit: em[k].dPomPerOrbit,
    Tavg: em[k].Tavg, TK: em[k].TK,
    periodRelDev: relDiff(em[k].Tavg, em[k].TK),
    nan: em[k].nan,
  })).sort((a, b) => a.q - b.q);
  const spinRows = spinArms.map((k) => ({
    arm: k, dPomPerOrbit: em[k].dPomPerOrbit,
    relToPrimary: P === null ? UNAVAILABLE : relDiff(em[k].dPomPerOrbit, P.dPomPerOrbit),
  }));

  // 窓判定に使われた観測アンカーを機械的に逆算(比 = 測定/観測 なので 測定/比 = 観測)
  const impliedAnchor = P === null ? UNAVAILABLE : P.dPomPerOrbit / joint.ratio;

  return {
    id: CLAIM_IDS[1],
    claim: {
      ja: '🌙🌘 地球月: 同一の共通補正のまま、恒星月(平均周期)と近点回転(Δϖ/公転)の2量を同時に満たす。',
      en: 'Earth-Moon: with the same shared correction, both the sidereal month and the apsidal advance per orbit are matched simultaneously.',
    },
    sourceJsons: srcRef(src, ['kf1c', 'kf1d']),
    value: {
      quantity: '2量同時 — ① 近点回転 Δϖ/公転(観測比)② 平均周期 Tavg のケプラー基準からの相対偏差',
      primaryArm: primary === null ? UNAVAILABLE : primary,
      apsidal: {
        unit: 'rad/公転',
        measured: P === null ? UNAVAILABLE : P.dPomPerOrbit,
        ratioToObserved: joint.ratio,
        ratioPointer: ptr('kf1c', 'tests.joint.ratio'),
        impliedObservedAnchor: impliedAnchor,
        impliedObservedAnchorNote: '観測アンカーは JSON に直接の数値キーが無いため、測定値 ÷ 収載比 で逆算した含意値である(手打ちの転記ではない)',
      },
      siderealMonth: {
        unit: '時間単位(内部)',
        Tavg: P === null ? UNAVAILABLE : P.Tavg,
        TKepler: P === null ? UNAVAILABLE : P.TK,
        relDev: P === null ? UNAVAILABLE : relDiff(P.Tavg, P.TK),
        relDevPercent: P === null ? UNAVAILABLE : relDiff(P.Tavg, P.TK) * PCT,
        pointer: ptr('kf1c', 'tests.earthMoonCal'),
      },
      externalReferences: kf1c.manifest.judgement.externalReferences,
    },
    window: {
      registered: kf1c.manifest.judgement.note,
      registeredPointer: ptr('kf1c', 'manifest.judgement.note'),
      thresholdNote: '窓は「Δϖ 比が 1 の周りの帯に入ること」で、帯幅の数値は上の registered 本文にある(JSON に独立した数値キーとして存在しないため台帳へは転記しない)',
      measuredRatio: joint.ratio,
      deviationFromUnity: Math.abs(joint.ratio - 1),
      verdict: { ok: joint.ok2, jointPass: joint.pass },
    },
    components: components({
      numericalFloor: notInstrumented(
        '周期・Δϖ の分解能床(通過時刻の量子化・1 ulp 比)を記録していない',
        { nanFlags: arms.map((a) => ({ arm: a.arm, nan: a.nan })), healthPointer: ptr('kf1c', 'manifest.health') }),
      dtConvergence: sensComponent(src, 'earthMoon', 'dt'),
      windowSensitivity: sensComponent(src, 'earthMoon', 'window'),
      sourceSpread: notInstrumented(
        '恒星月・近点回転とも単一の観測アンカーで、複数ソースの突き合わせをしていない',
        { externalReferences: kf1c.manifest.judgement.externalReferences }),
      seedSpread: notInstrumented(
        '単一 seed の1走行で、初期位相を振った統計を取っていない',
        { seed: kf1c.manifest.numerics.seed, seedPointer: ptr('kf1c', 'manifest.numerics.seed') }),
    }, {
      qArmSpread: instrumented({
        note: '幾何抑制指数 q を振ったときの2量の動き(q は算出値であり当てはめ自由度ではない)',
        pointer: ptr('kf1c', 'tests.earthMoonCal'),
        arms,
        apsidalSpread: spreadOf(arms.map((a) => a.dPomPerOrbit)),
        periodRelDevSpread: spreadOf(arms.map((a) => a.periodRelDev)),
      }),
      spinDoseSensitivity: instrumented({
        note: '自転角速度 0 / ×100 の対照を主アームと比べたときの Δϖ の動き',
        pointer: ptr('kf1c', 'tests.earthMoonCal'),
        doses: (kf1c.manifest.numerics.sweeps || {}).spin2Moon,
        rows: spinRows,
        maxRelToPrimary: maxAbs(spinRows.map((r) => (r.relToPrimary === UNAVAILABLE ? null : r.relToPrimary))),
      }),
      qStarArmComparison: instrumented({
        note: '第123便 kf1d が q を算出則で決め直した走行(q*)と、第122便 kf1c の主アームとの差' +
          '(同一系・別スクリプト・別 q — q の決め方を変えても観測量がどれだけ動かないかの記録)',
        qStar: qc.qEM,
        qStarPointer: ptr('kf1d', 'tests.qcalc.qEM'),
        apsidal: { kf1c: P === null ? UNAVAILABLE : P.dPomPerOrbit, kf1d: qc.emQstar.dPomPerOrbit,
          relDiff: P === null ? UNAVAILABLE : relDiff(qc.emQstar.dPomPerOrbit, P.dPomPerOrbit) },
        period: { kf1c: P === null ? UNAVAILABLE : P.Tavg, kf1d: qc.emQstar.Tavg,
          relDiff: P === null ? UNAVAILABLE : relDiff(qc.emQstar.Tavg, P.Tavg) },
      }),
      qFormSensitivity: (() => {
        const s = src.qexact.json.systems.earthMoon;
        const win = s.window ? s.window.expected : null;   // 出典: exp-kf1c §D2(qexact JSON が転記)
        const mQExact = marginAgainstWindow(s.ratioQExact, win, false);
        const mQStar = marginAgainstWindow(s.ratioQStar, win, false);
        return qFormComponent(src, 'earthMoon', {
          windowReconfirmation: {
            note: '🌘 の窓は claims ではなく tests/exp-kf1c.mjs §D2 の Δϖ比 帯である' +
              '(qexact JSON の systems.earthMoon.window.expected を機械読取 — 窓は動かしていない)',
            windowSource: s.window ? { source: s.window.source, expected: s.window.expected,
              pointer: ptr('qexact', 'systems.earthMoon.window.expected') } : UNAVAILABLE,
            atQExact: mQExact, atQStarBaseline: mQStar,
            qExactStillWithinWindow: mQExact.status === INSTRUMENTED ? mQExact.within : UNAVAILABLE,
          },
        });
      })(),
      regimeLayer: regimeComponent(src, CLAIM_IDS[1]),   // v3(第180便)
    }),
    verdictPointer: ptr('kf1c', 'tests.joint'),
  };
}

// =============================================================================================
// 主張3: 💿🛰️ 土星環 — 環プローブの近点ドリフト(q* の事後外挿先)
// =============================================================================================
function claimSaturnRing(src) {
  const kf1d = src.kf1d.json;
  const ring = kf1d.tests.ring;
  const rows = ring.kF0.res.map((r, i) => {
    const kF0 = r.dPomPerOrbit, qs = ring.qStarRun.res[i].dPomPerOrbit, q3 = ring.q3.res[i].dPomPerOrbit;
    return {
      a: r.a, kF0, qStarRun: qs, q3,
      dragQStar: qs - kF0, dragQ3: q3 - kF0,
      suppression: (q3 - kF0) === 0 ? UNAVAILABLE : Math.abs((qs - kF0) / (q3 - kF0)),
    };
  });
  // ω_drag/ω_LT が 1 を下回る最初の高度(1 は交差の定義であって実測値の転記ではない)
  const prof = ring.profile;
  const crossIdx = prof.findIndex((p) => p.ratio < 1);
  const crossing = crossIdx <= 0
    ? notInstrumented('収載プロファイルの範囲内で ω_drag/ω_LT の 1 交差が挟めない')
    : instrumented({ bracketLow: prof[crossIdx - 1].hSurf, bracketHigh: prof[crossIdx].hSurf,
        ratioLow: prof[crossIdx - 1].ratio, ratioHigh: prof[crossIdx].ratio });

  return {
    id: CLAIM_IDS[2],
    claim: {
      ja: '💿🛰️ 土星環: 🪨🌘 から導いた q* 算出則を再フィットなしで環系へ当てると、環プローブの近点ドリフトが kF0 基線並みに小さく留まる(q=3 対照では桁違いに大きい)。',
      en: 'Saturn ring: applying the q* rule derived from Mercury/Moon without any refit keeps the ring probes\' apsidal drift at baseline level, whereas the q=3 control is orders of magnitude larger.',
    },
    sourceJsons: srcRef(src, ['kf1d']),
    value: {
      quantity: '環プローブの引きずり歳差 Δϖ_drag = Δϖ(kF1, q*) − Δϖ(kF0)',
      unit: 'rad/公転',
      qStar: ring.qStar,
      qStarPointer: ptr('kf1d', 'tests.ring.qStar'),
      rows,
      rowsPointer: ptr('kf1d', 'tests.ring'),
      maxAbsDragQStar: maxAbs(rows.map((r) => r.dragQStar)),
      maxAbsDragQ3Control: maxAbs(rows.map((r) => r.dragQ3)),
      maxSuppression: maxAbs(rows.map((r) => (r.suppression === UNAVAILABLE ? null : r.suppression))),
      nan: { kF0: ring.kF0.nan, q3: ring.q3.nan, qStarRun: ring.qStarRun.nan },
    },
    window: notApplicable(
      '本ハーネスは合否窓を持たない検証ハーネスである(出典 JSON の manifest が自らそう宣言している)。' +
      '事前登録窓が無いこと自体を誤差予算の1行として明示する',
      { declaration: kf1d.manifest.judgement.note, declarationPointer: ptr('kf1d', 'manifest.judgement.note'),
        holdOut: kf1d.manifest.classification.holdOut, fitCount: kf1d.manifest.classification.fit.length }),
    components: components({
      numericalFloor: notInstrumented(
        '環プローブの1步あたり引きずり増分と 1 ulp の比を記録していない(NaN フラグのみ)',
        { nan: { kF0: ring.kF0.nan, q3: ring.q3.nan, qStarRun: ring.qStarRun.nan } }),
      dtConvergence: sensComponent(src, 'saturnRing', 'dt'),
      windowSensitivity: sensComponent(src, 'saturnRing', 'window'),
      sourceSpread: notInstrumented(
        '環の軌道要素は内蔵プリセット由来の単一ソースで、別ソースとの突き合わせをしていない'),
      seedSpread: notInstrumented(
        '初期位相を振った統計を取っていない',
        { seed: kf1d.manifest.numerics.seed, seedPointer: ptr('kf1d', 'manifest.numerics.seed') }),
    }, {
      qArmSpread: instrumented({
        note: '同一半径での q* アームと q=3 対照アームの比較(抑制比 = |drag(q*)| / |drag(q=3)|)',
        pointer: ptr('kf1d', 'tests.ring'),
        rows: rows.map((r) => ({ a: r.a, dragQStar: r.dragQStar, dragQ3: r.dragQ3, suppression: r.suppression })),
        dragQStarSpread: spreadOf(rows.map((r) => r.dragQStar)),
      }),
      radialProfile: instrumented({
        note: '随伴プロファイル ω_drag/ω_LT の高度依存(記述のみ — 窓なし)',
        pointer: ptr('kf1d', 'tests.ring.profile'),
        rows: prof,
        ratioSpread: spreadOf(prof.map((p) => p.ratio)),
        unityCrossing: crossing,
      }),
      holdOutHonesty: instrumented({
        note: '環系は q* 算出則の事後外挿先であり、この系のデータへ当てはめた自由度はゼロである',
        fit: kf1d.manifest.classification.fit,
        fitCount: kf1d.manifest.classification.fit.length,
        holdOut: kf1d.manifest.classification.holdOut,
        pointer: ptr('kf1d', 'manifest.classification'),
      }),
      qFormSensitivity: (() => {
        const qx = src.qexact.json;
        const s = qx.systems.saturnRing;
        const claimWin = qx.claimWindows.ringApsidal;
        const win = claimWin ? claimWin.expected : null;
        const primaryA = s.QW1.probeA;
        const primaryRow = (s.rows || []).find((r) => r.a === primaryA) || null;
        const mQExact = marginAgainstWindow(s.QW1.observable, win, true);
        const mQStar = marginAgainstWindow(primaryRow === null ? null : primaryRow.driftQStar, win, true);
        return qFormComponent(src, 'saturnRing', {
          windowReconfirmation: {
            note: 'q_exact 走行値の**現行 claims 窓に対する余裕**の機械計算(窓の数値は動かしていない —' +
              'qexact が実行時に対象 HTML の claims から読み取った expected をそのまま使う)。' +
              '窓の適用先プローブは qexact の referentEvidence が機械同定したもの',
            primaryProbeA: primaryA,
            primaryProbeEvidence: s.window.referentEvidence,
            windowSource: claimWin === null ? UNAVAILABLE : {
              presetId: claimWin.presetId, claimId: claimWin.claimId, metric: claimWin.metric,
              expected: claimWin.expected, pointer: ptr('qexact', 'claimWindows.ringApsidal.expected'),
            },
            windowMatchesSystemBlock: claimWin !== null && s.window.expected
              && s.window.expected.min === claimWin.expected.min
              && s.window.expected.max === claimWin.expected.max,
            atQExact: mQExact,
            atQStarBaseline: mQStar,
            qExactStillWithinWindow: mQExact.status === INSTRUMENTED ? mQExact.within : UNAVAILABLE,
            allProbesUnderQExact: (s.rows || []).map((r) => ({ a: r.a, absQExact: r.absQExact,
              inWindow: r.inWindow, baselineInWindow: r.baselineInWindow, relDiff: r.relDiff })),
          },
        });
      })(),
      regimeLayer: regimeComponent(src, CLAIM_IDS[2]),   // v3(第180便)
    }),
    verdictPointer: ptr('kf1d', 'tests.ring'),
  };
}

// =============================================================================================
// 主張4: 🟠 木星ガリレオ衛星ホールドアウト(JW 窓 + ソース差 UW + シード散らばり SW + 第141便感度)
// =============================================================================================
function claimJupiter(src) {
  const jup = src.jupiter.json, j365 = src.jup365.json, jseeds = src.jupseeds.json;
  const W = jup.windows, SEN = jup.sensitivity || {};

  const jw2 = W.JW2.rows, jw1 = W.JW1.rows;
  const winIds = Object.keys(W);
  const verdicts = winIds.map((k) => ({ id: k, pass: W[k].pass, recordOnly: W[k].recordOnly === true }));

  // 数値床(ハーネスが衛星ごとに収載している 1 ulp 比)
  const floorRows = jup.moons.map((m) => ({
    name: m.name, dvPerStep: m.numericalFloor.dvPerStep, dvOverUlp: m.numericalFloor.dvOverUlp,
    resolved: m.numericalFloor.resolved,
    spinChannelDvOverUlp: m.numericalFloor.spinChannelDvOverUlp, spinChannelResolved: m.numericalFloor.spinChannelResolved,
  }));
  // dt 収束(步幅を半分にした1点)
  const convRows = jup.convergence.rows.map((r) => ({
    name: r.name, periodRelDiff: r.periodRelDiff, dragRelDiff: r.dragRelDiff,
    aSpreadMain: r.aSpreadMain, aSpreadFine: r.aSpreadFine,
  }));
  // 窓感度(主窓 20 公転 vs 長窓 60 公転 — 公転数も JSON の config から読む)
  const winRows = jup.moons.map((m) => ({
    name: m.name,
    mainDevPercent: m.kF1.dev * PCT, longDevPercent: m.long.kF1Dev * PCT,
    devDeltaPP: (m.long.kF1Dev - m.kF1.dev) * PCT,
    mainASpreadPercent: (m.kF1.aSpread / m.kF1.aMean) * PCT,
    longASpread: m.long.kF1aSpread, mainASpread: m.kF1.aSpread,
    longNRev: m.long.nRev, mainNRev: m.kF1.nRev,
  }));
  // ソース差(第162便 JUP365 変種)
  const uw1 = j365.windows.UW1, uw2 = j365.windows.UW2, uw3 = j365.windows.UW3, uw4 = j365.windows.UW4;
  // シード散らばり(第162便 複数シード)
  const sw3 = jseeds.windows.SW3;

  const aRef = SEN.aRefSensitivity || null, d0 = SEN.d0Sensitivity || null, qc = SEN.qControls || null;
  const flatDev = (block) => block === null ? [] : block.rows.flatMap((r) => r.rows.map((x) => x.devPercent));
  const qExactRow = qc === null ? null : (qc.rows.find((r) => r.isQExact) || null);

  return {
    id: CLAIM_IDS[3],
    claim: {
      ja: '🟠 木星ガリレオ衛星: 既存の共有ノブだけで(衛星別の当てはめゼロで)4衛星の恒星公転周期が観測と ±1% 以内に収まり、軌道も保持される事後外挿テスト。',
      en: 'Jupiter Galilean hold-out: with no per-moon fitting, all four sidereal periods land within 1% of the observed values and the orbits are retained.',
    },
    sourceJsons: srcRef(src, ['jupiter', 'jup365', 'jupseeds']),
    value: {
      quantity: '4衛星の恒星公転周期の観測偏差と軌道保持(kF1 主測定)',
      unit: '%',
      maxAbsPeriodDevPercentKF1: maxAbs(jw2.map((r) => r.devPercent)),
      maxAbsPeriodDevPercentKF0: maxAbs(jw1.map((r) => r.devPercent)),
      maxASpreadPercentKF1: maxAbs(jw2.map((r) => r.aSpreadPercent)),
      rows: jw2.map((r) => ({ name: r.name, periodDays: r.periodDays, devPercent: r.devPercent, aSpreadPercent: r.aSpreadPercent, ok: r.ok })),
      rowsPointer: ptr('jupiter', 'windows.JW2.rows'),
      holdOutHonesty: { perMoonFits: W.JW3.perMoonFits, velocityCalibFactor: W.JW3.velocityCalibFactor,
        sharedFits: W.JW3.sharedFits, sharedFitCount: W.JW3.sharedFits.length, derived: W.JW3.derived },
      nan: W.JW2.nan,
    },
    window: {
      registered: jup.windowsPreRegistered,
      registeredPointer: ptr('jupiter', 'windowsPreRegistered'),
      verdicts,
      passCount: verdicts.filter((v) => v.pass === true).length,
      failCount: verdicts.filter((v) => v.pass === false).length,
      recordOnlyCount: verdicts.filter((v) => v.recordOnly).length,
      variantWindows: {
        jup365: Object.keys(j365.windows).map((k) => ({ id: k, pass: j365.windows[k].pass, statement: j365.windows[k].statement })),
        jupseeds: Object.keys(jseeds.windows).map((k) => ({ id: k, pass: jseeds.windows[k].pass, statement: jseeds.windows[k].statement })),
      },
    },
    components: components({
      numericalFloor: instrumented({
        note: jup.floor.note,
        pointer: ptr('jupiter', 'moons[].numericalFloor'),
        rows: floorRows,
        minDvOverUlp: minOf(floorRows.map((r) => r.dvOverUlp)),
        minSpinChannelDvOverUlp: minOf(floorRows.map((r) => r.spinChannelDvOverUlp)),
        allResolved: floorRows.every((r) => r.resolved === true),
        allSpinChannelResolved: floorRows.every((r) => r.spinChannelResolved === true),
      }),
      dtConvergence: instrumented({
        note: jup.convergence.statement,
        pointer: ptr('jupiter', 'convergence.rows'),
        rows: convRows,
        periodConverged: jup.convergence.periodConverged,
        maxAbsPeriodRelDiff: maxAbs(convRows.map((r) => r.periodRelDiff)),
        maxAbsDragRelDiff: maxAbs(convRows.map((r) => r.dragRelDiff)),
      }),
      windowSensitivity: instrumented({
        note: '主測定窓と長窓で同一構成を測り直したときの周期偏差・軌道保持の動き',
        pointer: ptr('jupiter', 'moons[].long'),
        mainOrbits: jup.config.orbits, longOrbits: jup.config.orbitsLong,
        rows: winRows,
        maxAbsMainDevPercent: maxAbs(winRows.map((r) => r.mainDevPercent)),
        maxAbsLongDevPercent: maxAbs(winRows.map((r) => r.longDevPercent)),
        maxAbsDevDeltaPP: maxAbs(winRows.map((r) => r.devDeltaPP)),
      }),
      sourceSpread: instrumented({
        note: '観測ソース依存性(fact sheet 系 vs JPL JUP365)— 第162便 exp-jup365 の事前登録窓 UW1〜UW4',
        pointer: ptr('jup365', 'windows'),
        attribution: { factSheet: j365.sources.factSheet.attribution, jup365: j365.sources.jup365.attribution,
          factSheetVerified: j365.sources.factSheet.verified, jup365Verified: j365.sources.jup365.verified },
        periodDiff: { rows: uw1.rows.map((r) => ({ name: r.name, periodFactSheet: r.periodFactSheet, periodJup365: r.periodJup365, absRelDiffPercent: r.absRelDiffPercent, ok: r.ok })),
          maxAbsRelDiffPercent: uw1.maxAbsRelDiffPercent, pass: uw1.pass },
        baselineRemeasure: { pass: uw2.pass, kF0Pass: uw2.kF0.pass, kF1Pass: uw2.kF1.pass,
          maxAbsDevFactSheetPercent: maxAbs(uw2.kF1.rows.map((r) => r.devFactSheetPercent)),
          maxAbsDevJup365Percent: maxAbs(uw2.kF1.rows.map((r) => r.devJup365Percent)) },
        variant: { pass: uw3.pass, refitCount: uw3.refitCount,
          maxAbsDevJup365Percent: maxAbs(uw3.rows.map((r) => r.devJup365Percent)),
          maxAbsDevFactSheetPercent: maxAbs(uw3.rows.map((r) => r.devFactSheetPercent)),
          maxASpreadPercent: maxAbs(uw3.rows.map((r) => r.aSpreadPercent)) },
        conclusionStability: { factSheetConclusion: uw4.factSheetConclusion, jup365Conclusion: uw4.jup365Conclusion,
          overallAgreement: uw4.overallAgreement, pass: uw4.pass },
        crossWaveBitIdentical: j365.crossWaveCheck.allBitIdentical,
      }),
      seedSpread: instrumented({
        note: sw3.statement,
        pointer: ptr('jupseeds', 'windows.SW3'),
        floorDeclaration: sw3.floorDeclaration,
        nSeeds: jseeds.config.seeds.length, seeds: jseeds.config.seeds,
        rows: sw3.rows.map((r) => ({ name: r.name, spreadPercent: r.spreadPercent,
          resolutionFloorPercentMax: r.resolutionFloorPercentMax, spreadOverFloor: r.spreadOverFloor, aboveFloor: r.aboveFloor })),
        maxSpreadPercent: sw3.maxSpreadPercent,
        anyAboveFloor: sw3.rows.some((r) => r.aboveFloor === true),
        retentionPass: jseeds.windows.SW1.pass, periodPass: jseeds.windows.SW2.pass,
        maxAbsDevPercentOverall: jseeds.windows.SW2.maxAbsDevPercentOverall,
        rotationFamilies: { nFamilies: jseeds.rotationFamilies.nFamilies,
          allFamiliesBitIdentical: jseeds.rotationFamilies.allFamiliesBitIdentical },
        crossWaveBitIdentical: jseeds.crossWaveCheck.allBitIdentical,
      }),
    }, {
      parameterSensitivity: SEN.aRefSensitivity === undefined ? notInstrumented('本 JSON に第141便の感度記録ブロックが無い') : instrumented({
        note: SEN.statement,
        pointer: ptr('jupiter', 'sensitivity'),
        aRef: aRef === null ? UNAVAILABLE : {
          statement: aRef.statement, factors: aRef.rows.map((r) => r.f),
          maxAbsDqStar: maxAbs(aRef.rows.map((r) => r.dqStar)),
          maxAbsDevPercent: maxAbs(flatDev(aRef)),
          allSameCondition: aRef.rows.every((r) => r.sameAsJW2Condition === true), anyNaN: aRef.rows.some((r) => r.nan === true),
        },
        d0: d0 === null ? UNAVAILABLE : {
          statement: d0.statement, factors: d0.rows.map((r) => r.factor),
          maxAbsDevPercent: maxAbs(flatDev(d0)),
          allSameCondition: d0.rows.every((r) => r.sameAsJW2Condition === true), anyNaN: d0.rows.some((r) => r.nan === true),
        },
        qControls: qc === null ? UNAVAILABLE : {
          statement: qc.statement, qs: qc.rows.map((r) => r.q), qDeclared: qc.qDeclared, qStar: qc.qStar,
          qExact: qExactRow === null ? UNAVAILABLE : qExactRow.q,
          qExactMaxAbsDevPercent: qExactRow === null ? UNAVAILABLE : maxAbs(qExactRow.rows.map((x) => x.devPercent)),
          maxAbsDevPercent: maxAbs(flatDev(qc)),
          allSameCondition: qc.rows.every((r) => r.sameAsJW2Condition === true), anyNaN: qc.rows.some((r) => r.nan === true),
        },
      }),
      determinism: instrumented({
        note: '同一構成の再実行が bit 一致するか(3つの出典 JSON がそれぞれ自前で収載している決定性記録)',
        jupiter: { bitIdentical: jup.determinism.bitIdentical, maxAbsDiff: jup.determinism.maxAbsDiff, nFin: jup.determinism.nFin },
        jup365: { identical: j365.determinism.identical, sha256: j365.determinism.sha256 },
        jupseeds: { identical: jseeds.determinism.identical, sha256: jseeds.determinism.sha256 },
        sensitivity: SEN.determinism === undefined ? UNAVAILABLE
          : { bitIdentical: SEN.determinism.bitIdentical, maxAbsDiff: SEN.determinism.maxAbsDiff },
      }),
      qFormSensitivity: (() => {
        const s = src.qexact.json.systems.jupiter;
        return qFormComponent(src, 'jupiter', {
          windowReconfirmation: {
            note: '🟠 の事前登録窓 JW2 は {min,max} の帯ではなく条件(NaN なし・|Δa|/a<2%・周期 ±1%)' +
              'なので、帯に対する余裕という量が定義できない。条件に対する合否と、条件の各項の余裕に' +
              '当たる最大値をそのまま収載する',
            windowMargin: notApplicable(
              'JW2 は帯ではなく条件なので min/max に対する余裕が定義できない',
              { window: s.window.source }),
            qExactStillWithinWindow: s.QW1.pass,
            maxAbsPeriodDevPercentAtQExact: s.QW1.maxAbsDevPercent,
            maxASpreadPercentAtQExact: s.QW1.maxASpreadPercent,
            nanAtQExact: s.QW1.nan,
            baselinePass: s.QW1.baselinePass,
            declared2dpPass: s.QW1.declared2dpPass,
            perMoon: s.QW1.rows,
          },
        });
      })(),
      regimeLayer: regimeComponent(src, CLAIM_IDS[3]),   // v3(第180便)
    }),
    verdictPointer: ptr('jupiter', 'windows'),
  };
}

// =============================================================================================
// 主張5: qLock 径方向監査(W1〜W5 の 2 PASS / 3 FAIL をそのまま収載する)
// =============================================================================================
function claimQlockRadial(src) {
  const qr = src.qlockradial.json;
  const W = qr.windows, conv = qr.convergence;
  const ids = Object.keys(W);
  const verdicts = ids.map((k) => ({ id: k, pass: W[k].pass, statement: qr.windowsPreRegistered[k] }));

  const convRows = conv.map((c) => ({
    r: c.r, resolved: c.resolved, duPerStepOverUlp: c.duPerStepOverUlp,
    dragMain: c.dragMain, dragFine: c.dragFine, dragLong: c.dragLong,
    dtRelDiff: relDiff(c.dragFine, c.dragMain),
    windowRelDiff: relDiff(c.dragLong, c.dragMain),
    spread: c.spread,
  }));
  const res = convRows.filter((r) => r.resolved === true);
  const num = (xs) => xs.filter((x) => typeof x === 'number');

  return {
    id: CLAIM_IDS[4],
    claim: {
      ja: 'qLock 径方向監査: 事前登録窓 W1〜W5 を半径方向に振って qLock 則を試験した監査。合格した窓と落ちた窓の**両方**を収載する(落ちた窓は論文3 の stress test 記述の定量的裏付け)。',
      en: 'qLock radial audit: a pre-registered five-window stress test across radii; both the windows that pass and those that fail are reported.',
    },
    sourceJsons: srcRef(src, ['qlockradial']),
    value: {
      quantity: '事前登録窓 W1〜W5 の合否タリーと参照軌道の近点回転周期',
      verdicts,
      passCount: verdicts.filter((v) => v.pass === true).length,
      failCount: verdicts.filter((v) => v.pass === false).length,
      total: verdicts.length,
      referenceApsidal: {
        unit: '年',
        apsidalYears: W.W2.apsidalYears, targetYears: W.W2.target, tol: W.W2.tol,
        dragAtRef: W.W2.dragAtRef, resolvedAtRef: W.W2.resolved,
        apsidalYearsQ3Control: W.W2.apsidalYearsQ3, dragAtRefQ3Control: W.W2.dragAtRefQ3,
        pointer: ptr('qlockradial', 'windows.W2'),
      },
      radialFalloff: {
        note: qr.slopes.note,
        pointer: ptr('qlockradial', 'slopes'),
        omegaQLockOuter: qr.slopes.omegaQLockOuter, omegaQ3Outer: qr.slopes.omegaQ3Outer,
        dpomQLockOuter: qr.slopes.dpomQLockOuter, dpomQ3Outer: qr.slopes.dpomQ3Outer,
        omegaLTReference: qr.slopes.omegaLTReference, dpomLTReference: qr.slopes.dpomLTReference,
        w5DiffByDpomOuter: W.W5.byDpomOuter.diff, w5DiffByOmegaOuter: W.W5.byOmegaOuter.diff,
        w5DiffByAsymptoticBand: W.W5.byDpomAsymptoticBand.diff,
        passByOmega: W.W5.passByOmega, passByAsymptotic: W.W5.passByAsymptotic,
      },
    },
    window: {
      registered: qr.windowsPreRegistered,
      registeredPointer: ptr('qlockradial', 'windowsPreRegistered'),
      verdicts,
      failedWindows: verdicts.filter((v) => v.pass === false).map((v) => v.id),
      failNote: '落ちた窓は隠さずそのまま収載する。W2/W3/W5 の FAIL は「qLock 則が径方向に外挿できていない」' +
        'ことの定量記録であって、較正済み主張(W1/W4)の反証ではない',
    },
    components: components({
      numericalFloor: instrumented({
        note: '各半径での1步あたり引きずり増分と 1 ulp の比(resolved=false の半径では引きずりが測定器で分解できていない)',
        pointer: ptr('qlockradial', 'convergence'),
        rows: convRows.map((r) => ({ r: r.r, duPerStepOverUlp: r.duPerStepOverUlp, resolved: r.resolved })),
        resolvedCount: res.length, total: convRows.length,
        minDuPerStepOverUlp: minOf(convRows.map((r) => r.duPerStepOverUlp)),
        resolvedAtReference: W.W2.resolved, resolvedAtOuter: W.W4.resolvedOuter,
        w5OuterResolvedQLock: W.W5.outerResolvedQLock,
      }),
      dtConvergence: instrumented({
        note: '步幅を細かくした走行(fine)と主走行(main)の引きずり歳差の相対差',
        pointer: ptr('qlockradial', 'convergence'),
        rows: convRows.map((r) => ({ r: r.r, dragMain: r.dragMain, dragFine: r.dragFine, dtRelDiff: r.dtRelDiff, resolved: r.resolved })),
        maxAbsRelDiffAll: maxAbs(num(convRows.map((r) => r.dtRelDiff))),
        maxAbsRelDiffResolved: maxAbs(num(res.map((r) => r.dtRelDiff))),
        note2: '分解できていない半径(resolved=false)を含む全半径の最大値と、分解済み半径だけの最大値を分けて載せる',
      }),
      windowSensitivity: instrumented({
        note: '主測定窓と長窓で同一半径を測り直したときの引きずり歳差の相対差',
        pointer: ptr('qlockradial', 'convergence'),
        mainOrbits: qr.config.orbits, longOrbits: qr.config.orbitsLong,
        rows: convRows.map((r) => ({ r: r.r, dragMain: r.dragMain, dragLong: r.dragLong, windowRelDiff: r.windowRelDiff, spread: r.spread, resolved: r.resolved })),
        maxAbsRelDiffAll: maxAbs(num(convRows.map((r) => r.windowRelDiff))),
        maxAbsRelDiffResolved: maxAbs(num(res.map((r) => r.windowRelDiff))),
        maxSpreadResolved: maxAbs(num(res.map((r) => r.spread))),
      }),
      sourceSpread: notInstrumented(
        '比較先は LT 解析値とソフトニング解析値で、複数の観測ソースを突き合わせる構造ではない(ソース差は未計装)',
        { externalReferences: qr.manifest.judgement.externalReferences }),
      seedSpread: notInstrumented(
        '各半径 1 プローブの決定論的走行で、初期位相を振った統計を取っていない',
        { seed: qr.manifest.numerics.seed, seedPointer: ptr('qlockradial', 'manifest.numerics.seed') }),
    }, {
      q3Control: instrumented({
        note: 'q=3(抑制なし)対照との比較 — 同じ半径で引きずり歳差が何桁違うか',
        pointer: ptr('qlockradial', 'convergence'),
        rows: conv.map((c) => ({ r: c.r, dragQLockMain: c.dragMain, dragQ3Main: c.dragQ3Main,
          ratio: c.dragQ3Main === 0 ? UNAVAILABLE : Math.abs(c.dragMain / c.dragQ3Main) })),
        kF0RatioCoarseWorst: maxAbs(conv.map((c) => c.kF0RatioCoarse)),
      }),
      innerSaturation: instrumented({
        note: qr.innerSaturation.note,
        pointer: ptr('qlockradial', 'innerSaturation'),
        chiInnermost: qr.innerSaturation.chiInnermost, chiOutermost: qr.innerSaturation.chiOutermost,
        ratioInnermost: qr.innerSaturation.ratioInnermost, ratioRef: qr.innerSaturation.ratioRef,
        ratioOutermost: qr.innerSaturation.ratioOutermost, crossingRadius: qr.innerSaturation.crossingRadius,
      }),
      regimeLayer: regimeComponent(src, CLAIM_IDS[4]),   // v3(第180便 — 本行は該当なしを明示する)
    }),
    verdictPointer: ptr('qlockradial', 'windows'),
  };
}

// =============================================================================================
// 台帳の組み立て(決定的 — 揮発値は一切入らない)
// =============================================================================================
// v3(第180便): 「空欄を残さない」原則の機械強制 — undefined と非有限数(NaN/±Infinity)は
// JSON 化で null に化けて**再集計との照合をすり抜ける**ので、組み立て段階で明示エラーにする。
// null は許す(relTo/relDiff が「相対値を作れない」ことを表す明示値として既存キーに存在する)。
function assertNoHoles(doc) {
  const holes = [];
  const walk = (o, p) => {
    if (Array.isArray(o)) { o.forEach((v, i) => walk(v, `${p}[${i}]`)); return; }
    if (o && typeof o === 'object') { for (const k of Object.keys(o)) walk(o[k], p ? `${p}.${k}` : k); return; }
    if (o === undefined) holes.push(`${p} = undefined`);
    else if (typeof o === 'number' && !Number.isFinite(o)) holes.push(`${p} = ${o}`);
  };
  walk(doc, '');
  if (holes.length) {
    throw new ErrorBudgetSourceError(
      `error-budget v${SCHEMA_VERSION}: 台帳に空欄(undefined)または非有限数が ${holes.length} 件ある ` +
      `[${holes.slice(0, 6).join(' | ')}]。JSON 化で null に化けて照合をすり抜けるので生成を中止する` +
      '(出典 JSON のキー名が想定と違うか、その系にその量が存在しない — センチネルで明示すること)');
  }
  return doc;
}

export function buildErrorBudget(root) {
  const src = readSources(root);
  const rg = src.qexactRegime.json;   // v3(第180便): regime 層の出典
  const claims = [claimMercury(src), claimEarthMoon(src), claimSaturnRing(src), claimJupiter(src), claimQlockRadial(src)];

  // 成分の充足状況の機械集計(「測っていない」件数もそのまま数える)
  const tally = claims.map((c) => {
    const core = COMPONENT_KEYS.map((k) => ({ k, status: c.components[k].status }));
    const extras = Object.keys(c.components).filter((k) => !COMPONENT_KEYS.includes(k));
    return {
      id: c.id,
      coreInstrumented: core.filter((x) => x.status === INSTRUMENTED).length,
      coreTotal: COMPONENT_KEYS.length,
      coreSentinels: core.filter((x) => SENTINELS.includes(x.status)).map((x) => `${x.k}=${x.status}`),
      extraComponents: extras,
    };
  });

  return assertNoHoles({
    schema: SCHEMA,
    schemaVersion: SCHEMA_VERSION,
    title: '較正・ホールドアウト主張の誤差予算(error budget)',
    purpose: '外部レビュー指摘「a more formal error budget would strengthen the claims」への恒久対応。' +
      '主張ごとに主観測量・事前登録窓・不確かさ成分を1枚の機械可読な台帳へ集約する',
    provenance: {
      rule: '数値はすべてコミット済みの結果 JSON からの機械読取・機械集計であり、本台帳の生成器に実測値の数値リテラルは無い',
      newSimulations: 0,
      sentinelVocabulary: SENTINELS,
      sentinelNote: '取得できない成分は捏造せず tests/manifest.mjs の固定語彙で書く。' +
        '"not-instrumented" は概念はあるが計装していない、"not-applicable" はその概念が当該主張に無い、の意である',
      componentKeys: COMPONENT_KEYS,
      requiredClaimFields: REQUIRED_CLAIM_FIELDS,
      schemaHistory: SCHEMA_HISTORY,
      extensionRule: '版を上げる拡張は**後方互換の追加のみ**とする(主張の行構成・既存キー・' +
        '既存の判定窓・較正値は動かさない)。成分は主成分5件を固定順で置いたうえで追加成分を後ろへ連結する',
      sources: Object.keys(SRC_FILES).map((k) => ({
        key: k, file: src[k].file, sha256: src[k].sha256, bytes: src[k].bytes,
        experimentId: src[k].experimentId, wave: src[k].wave,
      })),
      // v3(第180便): 否定対照 — 「この台帳は本当に何かを縛っているのか」を機械で示す2件
      negativeControls: [
        {
          id: 'harness-perturbed-adopted-literal',
          where: 'ハーネス側(tests/exp-qexact-regime.mjs RW5)',
          statement: rg.preRegistered.RW5.verbatim,
          factor: rg.rw5Summary.factor,
          identityAllFail: rg.rw5Summary.identityAllFail,
          allObservablesMoved: rg.rw5Summary.allMoved,
          windowFailCount: rg.rw5Summary.windowFailCount,
          windowFailSystems: rg.rw5Summary.windowFailSystems,
          pass: rg.rw5Summary.pass,
          rows: rg.rw5Summary.rows,
          pointer: ptr('qexactRegime', 'rw5Summary'),
        },
        {
          id: 'generator-missing-or-malformed-source',
          where: '生成器側(tools/gen-error-budget.mjs readSources / assertRegimeShape)',
          statement: '出典 JSON が欠落・解析不能・regime 層の必須ブロック欠落のいずれかなら、' +
            'センチネルで誤魔化さず ErrorBudgetSourceError を投げて生成を中止する。' +
            '「入力が無いのに台帳だけが出来ている」状態を作らせない',
          errorType: 'ErrorBudgetSourceError',
          requiredRegimeBlocks: REGIME_REQUIRED_BLOCKS,
          requiredRegimeSystems: Object.values(REGIME_SYSTEMS).map((v) => v.key),
          verification: '出典を退避して `node tools/gen-error-budget.mjs` を実行すると、' +
            '当該ファイル名と再生成コマンドを名指しした ErrorBudgetSourceError で停止する',
        },
      ],
    },
    regimes: {
      note: 'q の世代(regime)の定義と世代別の窓判定タリー。各主張行の components.regimeLayer が実体で、' +
        'ここはその横断要約である(数値はすべて出典 JSON からの機械読取)',
      ids: REGIME_IDS,
      definitions: {
        qStar: { label: 'qLock 則の遠方近似形 q*(第123便)',
          formula: 'q* = 3 + ln(1.25·c₀²R/(GM))/ln((R+a)/R)',
          operatingStatus: '第172便以降 運用規約としては N/A(台帳の既存行はこの世代の記録)' },
        qExact: { label: '厳密一致式 q_exact(第172便で採用)— 運用上は4桁丸めの採用直値',
          formula: 'q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)',
          operatingStatus: '現行の運用規約。プリセット・ハーネスには ROUND(q_exact) の直値が載る',
          adoptedLiteralRule: rg.preRegistered.RW2.verbatim },
      },
      claimsWithRegime: Object.keys(REGIME_SYSTEMS),
      claimsWithoutRegime: CLAIM_IDS.filter((id) => !REGIME_SYSTEMS[id]),
      perClaim: CLAIM_IDS.filter((id) => REGIME_SYSTEMS[id]).map((id) => {
        const key = REGIME_SYSTEMS[id].key, s = rg.systems[key];
        return { id, systemKey: key,
          qStar: s.q.qStar, qExactFullPrecision: s.q.qExact, qAdoptedLiteral: s.q.qAdopted,
          relRoundingDeltaQ: s.q.relRoundingDelta,
          adoptedLiteralMatchesTarget: rg.adoptedLiteralIdentification.rows[key].ok,
          windowPassAtQStar: s.RW1.qStarPass,
          windowPassAtQExactFullPrecision: s.RW1.qExactPass,
          windowPassAtAdoptedLiteral: s.RW1.pass,
          relDiffAdoptedToFullPrecision: s.RW4.relDiffToQExact,
          baselineBitIdentical: s.baselineBitCheck.allIdentical };
      }),
      adoptedLiteralIdentification: { allMatch: rg.adoptedLiteralIdentification.allMatch,
        rule: rg.adoptedLiteralIdentification.rule.verbatim,
        pointer: ptr('qexactRegime', 'adoptedLiteralIdentification') },
      windowVerdicts: { allPassAtAdoptedLiteral: rg.rw1Summary.allPass,
        perSystem: rg.rw1Summary.perSystem, pointer: ptr('qexactRegime', 'rw1Summary') },
      roundingSystematic: { note: rg.rw4Summary.note,
        maxAbsRelDiffToFullPrecision: rg.rw4Summary.maxAbsRelDiffToQExact,
        perSystem: rg.rw4Summary.perSystem, pointer: ptr('qexactRegime', 'rw4Summary') },
      baselineTranscription: { allIdentical: rg.rw3Summary.allIdentical,
        targetAllSame: rg.rw3Summary.targetAllSame, pointer: ptr('qexactRegime', 'rw3Summary') },
      determinism: { result: rg.rw6.result, identical: rg.rw6.identical, sha256: rg.rw6.sha256,
        pointer: ptr('qexactRegime', 'rw6') },
    },
    claims,
    summary: {
      claimCount: claims.length,
      claimIds: claims.map((c) => c.id),
      coreComponentsInstrumented: tally.reduce((a, t) => a + t.coreInstrumented, 0),
      coreComponentsTotal: tally.reduce((a, t) => a + t.coreTotal, 0),
      perClaim: tally,
      // v3(第180便): regime 層の充足状況(既存キーは1つも変えていない — 追加のみ)
      regimeLayer: {
        generations: REGIME_IDS,
        instrumented: claims.filter((c) => c.components.regimeLayer.status === INSTRUMENTED).length,
        notApplicable: claims.filter((c) => c.components.regimeLayer.status === NOT_APPLICABLE).length,
        total: claims.length,
        adoptedLiteralAllMatchTarget: rg.adoptedLiteralIdentification.allMatch,
        allWindowsPassAtAdoptedLiteral: rg.rw1Summary.allPass,
        baselineBitAllIdentical: rg.rw3Summary.allIdentical,
        maxAbsRoundingRelDiff: rg.rw4Summary.maxAbsRelDiffToQExact,
        negativeControlPass: rg.rw5Summary.pass,
        determinism: rg.rw6.result,
      },
    },
  });
}

// ---- 揮発ブロック(照合時は除外する)----------------------------------------------------------
export const VOLATILE_KEY = 'generated';
export function volatileBlock(root) {
  let commit = UNAVAILABLE;
  try { commit = execSync('git rev-parse HEAD', { cwd: root, stdio: 'pipe' }).toString().trim(); } catch { /* git 外での実行 */ }
  const self = fileURLToPath(import.meta.url);
  const rec = { at: new Date().toISOString(), node: process.version, platform: `${process.platform}/${process.arch}`,
    commit, command: 'node tools/gen-error-budget.mjs',
    generator: { path: path.relative(root, self), sha256: UNAVAILABLE, bytes: UNAVAILABLE } };
  try { const b = fs.readFileSync(self); rec.generator.sha256 = sha256(b); rec.generator.bytes = b.length; }
  catch { /* 読めない環境では明示値のまま残す */ }
  rec.note = '本ブロックは実行のたびに変わる非測定メタである。errorbudget.consistency ゲートは ' +
    `\`${VOLATILE_KEY}\` キーを除外して照合する`;
  return rec;
}

// ---- コンソール表(人が読む用 — JSON には入らない)--------------------------------------------
const SIG = 4;   // メタ定数: 表示桁数(台帳 JSON には生の倍精度をそのまま入れる)
const fmt = (v) => (typeof v === 'number' && Number.isFinite(v)) ? Number(v.toPrecision(SIG)).toString() : String(v);
export function renderTable(budget) {
  const headline = {
    [CLAIM_IDS[0]]: (c) => `Δϖ_drag=${fmt(c.value.primary)} rad/公転(窓の ${fmt(c.window.marginOfThresholdAtQStar)} 倍)`,
    [CLAIM_IDS[1]]: (c) => `Δϖ比=${fmt(c.value.apsidal.ratioToObserved)} / 周期偏差=${fmt(c.value.siderealMonth.relDevPercent)}%`,
    [CLAIM_IDS[2]]: (c) => `|Δϖ_drag|max=${fmt(c.value.maxAbsDragQStar)}(q=3 対照 ${fmt(c.value.maxAbsDragQ3Control)})`,
    [CLAIM_IDS[3]]: (c) => `周期偏差max=${fmt(c.value.maxAbsPeriodDevPercentKF1)}% / |Δa|/a max=${fmt(c.value.maxASpreadPercentKF1)}%`,
    [CLAIM_IDS[4]]: (c) => `窓 ${c.value.passCount} PASS / ${c.value.failCount} FAIL(計 ${c.value.total})`,
  };
  const rows = budget.claims.map((c, i) => {
    const t = budget.summary.perClaim[i];
    return [String(i + 1), c.id, headline[c.id] ? headline[c.id](c) : '', `${t.coreInstrumented}/${t.coreTotal}`,
      `+${t.extraComponents.length}`, t.coreSentinels.map((s) => s.split('=')[0]).join(',') || '—'];
  });
  const head = ['#', '主張', '主観測量', '主成分', '追加', '未計装の主成分'];
  const width = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(width[i])).join('  ');
  const out = [line(head), width.map((w) => '-'.repeat(w)).join('  '), ...rows.map(line)];
  out.push('');
  out.push(`主張=${budget.summary.claimCount}行 / 主成分の計装=${budget.summary.coreComponentsInstrumented}/${budget.summary.coreComponentsTotal}` +
    `(未計装は "${NOT_INSTRUMENTED}" / 該当なしは "${NOT_APPLICABLE}" として台帳に明示)`);
  out.push(`出典=${budget.provenance.sources.length}件(すべて SHA-256 で固定・新規シミュレーション ${budget.provenance.newSimulations} 件)`);
  const rl = budget.summary.regimeLayer;
  const nc = budget.provenance.negativeControls[0];
  out.push(`regime 層(v3)= 世代 [${rl.generations.join(' / ')}]・計装 ${rl.instrumented}/${rl.total} 主張` +
    `(該当なし ${rl.notApplicable} 主張)/ 採用直値が対象 HTML の宣言と一致=${rl.adoptedLiteralAllMatchTarget}` +
    ` / 採用直値での主窓 全系 PASS=${rl.allWindowsPassAtAdoptedLiteral} / 基線 bit 一致=${rl.baselineBitAllIdentical}`);
  out.push(`  4桁丸めの系統誤差(最大 |相対差|)= ${fmt(rl.maxAbsRoundingRelDiff)}` +
    ` / 否定対照 ${rl.negativeControlPass ? 'PASS' : 'FAIL'}` +
    `(×${nc.factor} 摂動で主窓を外れた系 ${nc.windowFailCount}件[${nc.windowFailSystems.join(' ')}])` +
    ` / 決定性 ${rl.determinism}`);
  return out.join('\n');
}

// ---- 直接実行時のみ書き出す(qa.mjs は buildErrorBudget() を import して再集計する)------------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const budget = buildErrorBudget(ROOT);
  const doc = { ...budget, [VOLATILE_KEY]: volatileBlock(ROOT) };
  const outPath = path.join(ROOT, OUT_REL);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(doc, null, 1) + '\n');
  console.log(renderTable(budget));
  console.log(`\n→ ${OUT_REL}`);
}

export default buildErrorBudget;

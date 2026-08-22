// 第166便 error budget(誤差予算)の形式化 — 既存の結果 JSON からの機械集計
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
export const SCHEMA_VERSION = '1.0';

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
};

const OUT_REL = 'tests/out/error-budget.json';
const PCT = 100;   // メタ定数: 比 → % の単位換算のみに使う(実測値ではない)

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

// ---- 出典の読み込み(file + SHA-256 + bytes で実体を固定)--------------------------------------
function readSources(root) {
  const src = {};
  for (const [key, rel] of Object.entries(SRC_FILES)) {
    const abs = path.join(root, rel);
    const bytes = fs.readFileSync(abs);
    const json = JSON.parse(bytes.toString('utf8'));
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
      dtConvergence: notInstrumented(
        '両ハーネスとも単一の dt で走っており、dt を半分にした収束点を持たない(dt 掃引は未計装)',
        { dtKf1c: kf1c.manifest.numerics.dt, dtKf1d: kf1d.manifest.numerics.dt, distinctDtValues: new Set([kf1c.manifest.numerics.dt, kf1d.manifest.numerics.dt]).size }),
      windowSensitivity: notInstrumented(
        '測定窓は1種類だけで、長窓との比較を取っていない(窓を変えたときの感度は未計装)',
        { window: kf1c.manifest.numerics.window, windowPointer: ptr('kf1c', 'manifest.numerics.window') }),
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
      dtConvergence: notInstrumented(
        '単一 dt の走行で、dt 掃引の収束点を持たない',
        { dtKf1c: kf1c.manifest.numerics.dt, dtKf1d: kf1d.manifest.numerics.dt, distinctDtValues: new Set([kf1c.manifest.numerics.dt, kf1d.manifest.numerics.dt]).size }),
      windowSensitivity: notInstrumented(
        '測定窓は1種類だけで、長窓との比較を取っていない',
        { window: kf1c.manifest.numerics.window, windowPointer: ptr('kf1c', 'manifest.numerics.window') }),
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
      dtConvergence: notInstrumented(
        '単一 dt の走行で、dt 掃引の収束点を持たない',
        { dt: kf1d.manifest.numerics.dt, distinctDtValues: new Set([kf1d.manifest.numerics.dt]).size }),
      windowSensitivity: notInstrumented(
        '測定窓は1種類だけで、長窓との比較を取っていない',
        { window: kf1d.manifest.numerics.window, windowPointer: ptr('kf1d', 'manifest.numerics.window') }),
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
    }),
    verdictPointer: ptr('qlockradial', 'windows'),
  };
}

// =============================================================================================
// 台帳の組み立て(決定的 — 揮発値は一切入らない)
// =============================================================================================
export function buildErrorBudget(root) {
  const src = readSources(root);
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

  return {
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
      sources: Object.keys(SRC_FILES).map((k) => ({
        key: k, file: src[k].file, sha256: src[k].sha256, bytes: src[k].bytes,
        experimentId: src[k].experimentId, wave: src[k].wave,
      })),
    },
    claims,
    summary: {
      claimCount: claims.length,
      claimIds: claims.map((c) => c.id),
      coreComponentsInstrumented: tally.reduce((a, t) => a + t.coreInstrumented, 0),
      coreComponentsTotal: tally.reduce((a, t) => a + t.coreTotal, 0),
      perClaim: tally,
    },
  };
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

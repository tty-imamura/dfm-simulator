// 第262便d(第54報 W4・統括の読み (A)・統括が設定した検証仮説 (10)):
//   **太陽系 16 本の σ 接続**。第54報「太陽系、恒星連星、中性子星連星の現実較正を完了する」に対して、
//   太陽系が「保留」である理由は `docs/CALIBRATION_VERDICT_v1.44.md` §2.3 に **16 本とも「σ 未接続」**と
//   書かれているだけで、**どこで切れているのかが書かれていなかった**。本器はその切断点を 3 つに分けて
//   数え、**繋いだうえで** 16 本 × 量の 3σ 判定を出す。
//
// ■ 切断点は 3 つある(**どれか 1 つでも欠けたら σ は門に届かない**)
//   (C) **対応表**: `tests/exp-w249b-calaudit.mjs` の `SIGMA_BODY`(preset → CSV の body 名)に
//       太陽系の行が **1 本も無かった**。→ 本便で `SIGMA_TARGET_BODY`(target ごとの宣言表)を足した。
//   (B) **CSV の sigma 列**: `paper/data/solar-observations.csv` の sigma 列は
//       **太陽系の行では全部空欄**である(21 個ある σ は恒星連星と NS 連星の行だけ)。
//   (A) **CSV の行そのもの**: 月・水星・木星ガリレオ衛星・土星環/D68 は **body の行が無い**。
//
// ■ 本器がしないこと(**測定値を作らない**)
//   ・エンジンを走らせない。測定値は `tests/out/calaudit-w249.json`(第249便b の走行)をそのまま読む。
//   ・**観測値も σ も 1 つも手で打たない**(CSV と calaudit JSON だけが入力である)。
//   ・**σ の無い量に σ を代入しない**(±1% の目安を σ に昇格させない)。
//   ・**署名・力学・プリセットには 1 バイトも触らない**。
//
// 実行: node tests/exp-w262d-solarsigma.mjs [--json <calaudit の出力>]
// 出力: tests/out/solarsigma-w262d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 第264便d(第56報 W4・統括の裁定 X6): `sigma_primary` の印は **3 器共通の厳密読み**を使う
// (語境界 + 第251便c の凡例文を除外 + 先頭一致)。読み方を器ごとに変えないための 1 本である。
import { isSigmaPrimaryVerified, legacyIsSigmaPrimaryVerified,
  readSigmaKind } from './lib-w264d-sigmamark.mjs';
// 第268便a(第58報 W1・統括の読み (A)(B)(D)): **必須ガード**(定義宣言・観測量対応・数値収束)・
// **単位換算**(deg/orbit → deg/yr を**同じ近点窓の近点間周期**で)・**採用観測解の明示宣言**。
// **既定の 4 値は動かさない** —— 換算後と宣言後は**別の欄**に置く。
import { requiredGuards, precessionDegPerYear, degPerYearToPerOrbit, YEAR_SEC,
  loadJudgementSources, pickDeclaredRow } from './lib-w268a-judgement.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const CAL = (() => { const i = argv.indexOf('--json'); return (i >= 0 && argv[i + 1]) ? argv[i + 1]
  : path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'); })();
const OUT = path.join(ROOT, 'tests', 'out', 'solarsigma-w262d.json');

// ---------------------------------------------------------------- CSV(**正本**)
function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur);
  return cols;
}
function loadCsv() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const rows = new Map();   // "body|quantity" → row(**最初の行**を採る — calaudit と同じ規約)
  const all = [];           // 第268便a: 宣言表は候補行(別の鍵・2 行目以降)を指すので全行も持つ
  const bodies = new Set();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    bodies.add(c[0]);
    const key = c[0] + '|' + c[1];
    const sg = (c[8] !== undefined && c[8].trim() !== '') ? Number(c[8]) : null;
    const kind = readSigmaKind(c[7] || '');
    const rec = { body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: c[4],
      valueRaw: (c[2] !== undefined && String(c[2]).trim() !== '') ? Number(c[2]) : null,
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      // 第264便d(X6): 厳密読み。旧読み(部分一致)との差は `markAudit` に数で残す。
      primaryVerified: isSigmaPrimaryVerified(c[7] || ''),
      primaryVerifiedLegacy: legacyIsSigmaPrimaryVerified(c[7] || ''),
      sigmaKind: kind.kind, infoScale: kind.scale, infoScaleKind: kind.scaleKind,
      intake2026_09_15: /intake_row=2026-09-15/.test(c[7] || '') };
    all.push(rec);
    if (rows.has(key)) continue;
    rows.set(key, rec);
  }
  return { rows, bodies, all };
}

// ---------------------------------------------------------------- 宣言表(自動判定ではない)
// 太陽系 16 本(`docs/CALIBRATION_VERDICT_v1.44.md` §2.3 の並びのまま)
const SOLAR = [
  ['earthMoonReal', '🌙'], ['earthMoonRealKF1', '🌘'], ['emAuditDFM', '🧲'], ['emAuditSolar', '🔆'],
  ['mercuryReal', '☄️'], ['mercuryRealKF1', '🪨'], ['solarInner', '🌞'], ['jupiterGalilean', '🟠'],
  ['venusReal', '🌇'], ['marsMoonsReal', '🥔'], ['plutoCharonReal', '❄️'], ['uranusReal', '💠'],
  ['neptuneReal', '🌊'], ['saturnZonalD68', '📡'], ['saturnRingReal', '💍'], ['saturnRingRealKF1', '💿'],
];
// **target ラベル → CSV の body 名**。宣言であって推測ではない(CSV に無い対象は null を明示する)。
// null は「CSV にその天体の行が無い」= 切断点 (A) である。
// 第264便d(第56報 W4): **2026-09-15 intake で CSV に行が入った**ので、null だった 11 対象を
// 宣言した(月・地球・水星・ガリレオ 4 衛星・D68・C 環内縁・ミマス・タイタン)。
// **これは「較正が進んだ」ことではない** —— 切断点が (A) 行が無い から (B) sigma 列が空 へ
// 移るだけで、**4 値は 1 本も動かない**(入った行の sigma 列は全部空欄である)。
const TARGET_BODY = {
  月: 'Moon', 地球: 'Earth',
  水星: 'Mercury',
  金星: 'Venus', 火星: 'Mars',
  フォボス: 'Phobos', ダイモス: 'Deimos',
  カロン: 'Charon',
  ミランダ: 'Miranda', アリエル: 'Ariel', ウンブリエル: 'Umbriel', チタニア: 'Titania', オベロン: 'Oberon',
  トリトン: 'Triton',
  イオ: 'Io', エウロパ: 'Europa', ガニメデ: 'Ganymede', カリスト: 'Callisto',
  D68: 'Saturn ring feature D68', C環内縁: 'Saturn ring C inner edge',
  ミマス: 'Mimas', タイタン: 'Titan',
};
const KIND_QUANT = { period: 'orbital_period', ecc: 'eccentricity', precession: 'periastron_advance',
  spin: 'rotation_period' };
// 判定量の単位 → CSV の単位(換算しないで済む組み合わせだけを通す。換算は**宣言**である)
const UNIT_OK = { period: (u) => u === 's', ecc: (u) => u === '1', spin: (u) => u === 's',
  precession: (u) => u === 'deg/yr' };

// 第266便a: obsCard の単位と CSV の単位が**同じ**であることを見る(換算はしない)。
// 無次元の書き方は 3 通りあるので、その集合だけを**宣言**として等価にする。
const DIMLESS = new Set(['', '1', '-', 'dimensionless']);
const normUnit = (u) => String(u === null || u === undefined ? '' : u).trim().toLowerCase();
function obsUnitMatches(obsUnit, csvUnit) {
  const a = normUnit(obsUnit), b = normUnit(csvUnit);
  if (DIMLESS.has(a) && DIMLESS.has(b)) return true;
  return a === b;
}

const GATE = { nSigma: 3, numBudget: 0.3 };   // 3σ の門(第249便b と同じ宣言)

// ---------------------------------------------------------------- 第268便a(第58報 W1)
// **既定の 4 値は据え置く**。本便で足すのは**横に並べる 2 列**である:
//   ・`unitConvertedFirst` … 統括の読み (A)。切断点 `unit-not-converted` の行を、**同じ近点窓の
//     近点間周期 `pPeriSec`** で deg/orbit → deg/yr に換算したら残差が σ の何倍になるか。
//     **対照として、周期行(`periodDef=revolution`)と丸めた観測周期でも換算する**(符号が変わる)。
//   ・`declaredFirst` … 統括の読み (D)。`paper/data/judgement-sources.json` の宣言行で読んだときの
//     値差・σ 倍。**宣言前の判定行は 1 行も差し替えていない**(既定の列は不変である)。
// どちらも**正式判定ではない** —— 3 段の収束(`convergence.ok`)が揃うまでは「数値未解決」である。
const JS = loadJudgementSources(path.join(ROOT, 'paper', 'data', 'judgement-sources.json'));
// 第269便a(統括の読み (F)): **不正スキーマ・重複宣言は入力エラーとして器を止める**(黙って続けない)。
if (!JS.ok) {
  throw new Error('[w262d] judgement-sources.json が不正: ' + (JS.error || '(理由なし)'));
}

// ---------------------------------------------------------------- 本体
const csv = loadCsv();
const cal = JSON.parse(fs.readFileSync(CAL, 'utf8'));
const byId = new Map(cal.presets.map((p) => [p.id, p]));

const rows = [];
const presets = [];
for (const [id, emoji] of SOLAR) {
  const p = byId.get(id);
  if (!p) { presets.push({ id, emoji, missing: true }); continue; }
  const qrows = [];
  for (const q of (p.quantities || [])) {
    const kind = q.kind || 'other';
    const target = q.target;
    const declared = Object.prototype.hasOwnProperty.call(TARGET_BODY, target);
    const body = declared ? TARGET_BODY[target] : null;
    const quant = KIND_QUANT[kind] || null;
    // ---------------------------------------------------------------- 第270便a(第60報 W1・AD5)
    // **宣言が正式経路に入った**ので、切断点と σ の分類も**宣言行**で行う(門の器と同じ行を見る)。
    // 宣言の無い body|quantity は従来どおり**ファイル順の最初の行**である(後方互換)。
    // 宣言が CSV の 1 行に解決できないときは**器を止める**(旧行へ黙って戻さない — 第269便a)。
    const csvRowLegacy = (body && quant) ? (csv.rows.get(body + '|' + quant) || null) : null;
    const declHere = (body && quant) ? (JS.byKey.get(body + '|' + quant) || null) : null;
    const pickHere = declHere ? pickDeclaredRow(declHere, csv.all) : { row: null, reason: null };
    if (declHere && !pickHere.row) {
      throw new Error('[w262d] 宣言 ' + body + '|' + quant + ' が CSV の 1 行に解決できない('
        + pickHere.reason + ')—— **旧行へ黙って戻さない**');
    }
    const declaredApplied = !!(declHere && pickHere.row);
    const csvRow = declaredApplied ? pickHere.row : csvRowLegacy;
    const condMismatch = !!(q.gate && q.gate.status === 'condition-mismatch');
    // 切断点の分類(**どこで切れているか**を 1 つだけ返す — 上から順に見る)
    let cut = null;
    if (kind === 'other' || !quant) cut = 'kind-not-gated';           // 門に入らない欄(来歴の記録)
    else if (!declared) cut = 'target-not-declared';                  // (C) 対応表に target の宣言が無い
    else if (body === null) cut = 'csv-body-missing';                 // (A) CSV にその天体の行が無い
    else if (!csvRow) cut = 'csv-quantity-missing';                   // (A') 天体はあるが量の行が無い
    else if (csvRow.sigma === null) cut = 'csv-sigma-empty';          // (B) 行はあるが sigma 列が空
    else if (!UNIT_OK[kind] || !UNIT_OK[kind](csvRow.unit)) cut = 'unit-not-convertible';
    // 第266便a(第57報 追加): **obsCard 側の単位も見る**。ここまでは CSV の単位だけを見ていたので、
    // `obs`/`meas` が deg/orbit・CSV の σ が deg/yr という宛先へ、σ を**換算せずそのまま**当てていた。
    // σ が 1 つも `verified` でなかった間はこの穴は判定に出なかったが、第266便a で近点移動の σ が
    // verified になった瞬間に **📡 D68 が見かけの「合(3σ)」になる**(残差 0.0247 deg/orbit に対して
    // σ=2.922 deg/yr をそのまま当てるため)。**実測して見つけた**(本便の前後で数を残す)。
    // 換算そのもの(deg/orbit ↔ deg/yr)は `tests/lib-w258d-evidence.mjs` の `degPerYear` にあるが、
    // **この器は換算しない** —— 換算を入れると判定が動くので、切断点を 1 つ足して止める。
    else if (!obsUnitMatches(q.unit, csvRow.unit)) cut = 'unit-not-converted';
    // 第263便c(第55報 W3): **σ はあるが一次表の照合が済んでいない**(note の `sigma_primary=unverified`)。
    // 配線は繋がっていて値も換算できるが、門(calaudit の sourceVerified)はこの σ を通さない。
    // **この状態は「σ 未登録」とは別である** —— `sigma_primary=verified` に変わった時点で、
    // ここは自動で `connected` になり判定へ入る(器の側は 1 行も変えなくてよい)。
    else if (!csvRow.primaryVerified) cut = 'csv-sigma-unverified';
    else cut = null;                                                  // σ が門へ届く
    // σ 以前に**観測参照 obs が無い**量(σ を繋いでも比べる相手がいない)
    const obsMissing = !(typeof q.obs === 'number' && Number.isFinite(q.obs));
    const measMissing = !(typeof q.meas === 'number' && Number.isFinite(q.meas));
    // 第263便c: `csv-sigma-unverified` の行は **σ を数として持つ**(接続数に数える)。
    // 判定へは入れない —— 状態名は「保留(σ 未確認)」で、`保留(σ 未登録)` とは別に数える。
    const sigma = (cut === null || cut === 'csv-sigma-unverified') ? csvRow.sigma : null;
    let verdict = null, resid = null, nSig = null, numOk = null, guards = null;
    if (condMismatch) verdict = '条件不一致(対照の走行が別)';
    else if (cut === 'csv-sigma-unverified') verdict = '保留(σ 未確認)';
    // 第266便a: **σ は登録も確認も済んでいるが、obsCard の単位と CSV の単位が違う**宛先。
    // 「σ 未登録」ではない —— 換算器をこの器に入れるかどうかは統括の裁定である。
    else if (cut === 'unit-not-converted') verdict = '保留(σ の単位が obsCard と違う・未換算)';
    else if (cut !== null) verdict = (cut === 'kind-not-gated') ? '門外(来歴の欄)' : '保留(σ 未登録)';
    else if (obsMissing || measMissing) verdict = '保留(観測参照または実測が無い)';
    else {
      resid = Math.abs(q.meas - q.obs);
      nSig = resid / sigma;
      const numBound = (q.gate && Number.isFinite(q.gate.numBound)) ? q.gate.numBound : null;
      numOk = (numBound === null) ? null : (numBound <= GATE.numBudget * sigma);
      // 第268便a(統括の読み (B)): **必須ガード**。σ が門へ届いても、判定量の定義が宣言されて
      // いない/観測量対応が確定していない/数値収束が確認されていない量は**判定しない**。
      // (第266便a まで、この器が見ていたのは `numBound<=0.3σ` だけだった —— 正本の 3 欄を見ていない。)
      guards = requiredGuards(q.gate);
      verdict = (!guards.ok) ? guards.verdict
        : (numOk !== true) ? '保留(数値精度 ε_num > 0.3σ)'
        : (resid <= GATE.nSigma * sigma + numBound) ? '合(3σ)' : '否(3σ)';
    }
    // ---- 第268便a(統括の読み (A)・AB1): **換算後の欄**(既定の欄は上のまま動かさない)----
    // 切断点 `unit-not-converted`(obsCard が deg/orbit・CSV が deg/yr)の行を、**分子の Δϖ と
    // 同じ近点窓の近点間周期**で deg/yr へ写す。**周期行と丸めた観測周期は対照として並べる**。
    let converted = null;
    if (cut === 'unit-not-converted' && kind === 'precession' && csvRow && csvRow.sigma !== null
      && typeof q.meas === 'number' && Number.isFinite(q.meas)) {
      const det = q.detail || {};
      const obsV = csvRow.value, obsS = csvRow.sigma;
      const mk = (label, P, periodDef) => {
        const v = precessionDegPerYear({ degPerOrbit: q.meas, pPeriSec: P });
        return { label, periodSec: P, periodDef,
          simDegPerYear: v, residual: (v === null) ? null : v - obsV,
          nSigma: (v === null) ? null : (v - obsV) / obsS };
      };
      // 第269便a(統括の読み (E)): **分子と同じ近点集合**の周期(`pPeriSameWindowSec`)で換算する。
      // 第268便a はここに `pPeriSec`(第252便b の 20 近点固定窓)を入れていた —— 傾きは 58 近点、
      // 周期は 20 近点で、**同じ窓ではなかった**。旧契約の値は下の controls / previous に残す。
      // **代替(silent fallback)はしない**: 同じ窓の周期が無ければ「換算不能」と書く。
      const primary = mk('近点間周期(**傾きと同じ ' + (det.pPeriSameWindowN || '—') + ' 近点('
        + ((det.pPeriSameWindowN || 1) - 1) + ' 区間)**の平均 — 第269便a の新契約)',
      det.pPeriSameWindowSec || null, 'periastron-same-window');
      const legacyWin = mk('近点間周期(**旧契約: 最初の ' + (det.pPeriWindow || 20)
        + ' 近点の固定窓** — 傾きと同じ近点集合ではない)', det.pPeriSec || null, 'periastron-20window');
      const controls = [legacyWin,
        mk('同方向 1 周の周期行(**使わない** — 定義が違う)', det.pRevSec || null, 'revolution')];
      // 丸めた観測周期の対照(obsCard が持っているときだけ — 手で数字を打たない)
      const pObs = (() => {
        const pq = (byId.get(id).quantities || []).find((z) => z.kind === 'period' && z.target === target
          && typeof z.obs === 'number' && Number.isFinite(z.obs));
        return pq ? pq.obs : null;
      })();
      if (pObs !== null) controls.push(mk('丸めた観測周期(**使わない** — 観測の丸め幅が入る)', pObs, 'observed-rounded'));
      const g2 = requiredGuards(q.gate);
      converted = { from: q.unit, to: csvRow.unit, yearSec: YEAR_SEC,
        obsValue: obsV, obsSigma: obsS,
        primary, controls,
        // **旧契約(第268便a)の記録**。対照であって新値ではない —— **旧値を新値として写さない**。
        previous: { contract: '20-periastron period window(第268便a)',
          periodSec: legacyWin.periodSec, simDegPerYear: legacyWin.simDegPerYear,
          residual: legacyWin.residual, nSigma: legacyWin.nSigma,
          why: '傾きは ' + (det.pPeriSameWindowN || '—') + ' 近点・周期は '
            + (det.pPeriWindow || 20) + ' 近点で、**同じ近点集合ではなかった**(換算契約の未達)' },
        // 観測側を deg/orbit へ写しても**同じ σ 倍**になる(同じ正の係数で両辺を割るだけ)
        inverseCheck: (() => {
          const P = det.pPeriSameWindowSec || null;   // 第269便a: 逆向きも**同じ窓**の周期で写す
          const o = degPerYearToPerOrbit({ degPerYear: obsV, pPeriSec: P });
          const os = degPerYearToPerOrbit({ degPerYear: obsS, pPeriSec: P });
          return (o === null || os === null || !(os > 0)) ? null
            : { obsDegPerOrbit: o, sigmaDegPerOrbit: os, nSigma: (q.meas - o) / os };
        })(),
        guards: g2,
        verdict: (primary.simDegPerYear === null)
          ? '換算不能(**傾きと同じ窓の近点間周期が未測定** — 短い窓へ置換しない)'
          : (!g2.ok ? g2.verdict : '換算後も判定せず(3 段の収束を先に見る)'),
        note: '**正式判定は「数値未解決」**(3 段の収束の前に否とも合とも言わない)。'
          + '既定の 4 値と切断点 `unit-not-converted` は**据え置き**である。' };
    }
    // ---- 第268便a(統括の読み (D)・AB2): **宣言後の初判定**の欄(既定の行選択は差し替えない)----
    let declaredFirst = null;
    if (body && quant) {
      const decl = declHere;
      if (decl) {
        const pick = pickHere;
        const dRow = pick.row;
        const dSigma = (dRow && dRow.sigma !== null) ? dRow.sigma : null;
        const measOk = (typeof q.meas === 'number' && Number.isFinite(q.meas));
        const g3 = requiredGuards(q.gate);
        const resid2 = (dRow && measOk && dRow.valueRaw !== null) ? Math.abs(q.meas - dRow.valueRaw) : null;
        declaredFirst = { key: body + '|' + quant, declaredSource: String(decl.source).slice(0, 90),
          declaredValue: decl.value, declaredSigma: decl.sigma === undefined ? null : decl.sigma,
          applied: !!dRow, fallbackReason: dRow ? null : pick.reason,
          // 第270便a(AD5): **`previousRow` は AD5 前の正式行(ファイル順の最初)**である。
          // 現在の正式行は `declaredValue`/`declaredSigma` の側であり、この欄は**履歴**である。
          appliedToJudgement: true, appliedSince: '第270便a(AD5)',
          previousRow: csvRowLegacy ? { value: csvRowLegacy.value, sigma: csvRowLegacy.sigma,
            unit: csvRowLegacy.unit, source: String(csvRowLegacy.source).slice(0, 60),
            primaryVerified: csvRowLegacy.primaryVerified } : null,
          valueDelta: (dRow && csvRowLegacy && dRow.valueRaw !== null && Number.isFinite(csvRowLegacy.value))
            ? dRow.valueRaw - csvRowLegacy.value : null,
          residual: resid2, nSigma: (resid2 !== null && dSigma) ? resid2 / dSigma : null,
          primaryVerified: dRow ? dRow.primaryVerified : null,
          guards: g3,
          verdict: !dRow ? '宣言が CSV の行に当たらない(' + pick.reason + ')'
            : (dSigma === null) ? '保留(σ 未登録 — 宣言行にも 1σ が印字されていない)'
            : (!g3.ok ? g3.verdict : '宣言後も判定せず(3 段の収束を先に見る)'),
          note: '**第270便a(AD5)で宣言は正式経路に入った** —— 左の既定欄(cut / verdict)も'
            + 'この宣言行で分類している。**旧行での分類は `previousRow` と履歴に残す**。'
            + '「宣言したので判定が増えた」とは書かない(動いた行は旧値と並べて理由を書く)。' };
      }
    }
    qrows.push({ id, emoji, name: q.name, kind, target, unit: q.unit,
      obs: (typeof q.obs === 'number') ? q.obs : null, meas: q.meas, sigmaCard: q.obsErr || null,
      csvBody: body, csvQuantity: quant,
      csvRow: csvRow ? { value: csvRow.value, unit: csvRow.unit, sigma: csvRow.sigma,
        primaryVerified: csvRow.primaryVerified } : null,
      // 第270便a(AD5/AD8): どの行で分類したか・判定量が換算後かどうかを行に残す
      declaredApplied,
      csvRowLegacy: (declaredApplied && csvRowLegacy) ? { value: csvRowLegacy.value,
        unit: csvRowLegacy.unit, sigma: csvRowLegacy.sigma,
        primaryVerified: csvRowLegacy.primaryVerified,
        source: String(csvRowLegacy.source).slice(0, 60) } : null,
      ad8Converted: !!(q.ad8 && q.ad8.converted),
      previousUnit: q.previousUnit || null,
      cut, condMismatch, sigma, residual: resid, nSigma: nSig, numOk,
      gateStatusBefore: q.gate ? q.gate.status : null, verdict,
      // 第268便a: 既定の欄(上)を動かさず、横に 3 つ足す
      guards, unitConvertedFirst: converted, declaredFirst });
  }
  rows.push(...qrows);
  // 系の 4 値(§1 の定義そのまま — σ を持つ判定量が 1 つも無ければ「保留」)
  const judged = qrows.filter((r) => r.sigma !== null && (r.verdict === '合(3σ)' || r.verdict === '否(3σ)'));
  const pass = judged.filter((r) => r.verdict === '合(3σ)').length;
  const fail = judged.filter((r) => r.verdict === '否(3σ)').length;
  const four = (judged.length === 0) ? '保留'
    : (fail > 0) ? '否' : (pass === qrows.filter((r) => r.cut === null && !r.condMismatch).length) ? '合' : '量限定合';
  presets.push({ id, emoji, nQuantities: qrows.length,
    nGatable: qrows.filter((r) => r.cut !== 'kind-not-gated').length,
    nCondMismatch: qrows.filter((r) => r.condMismatch).length,
    nSigmaConnected: qrows.filter((r) => r.sigma !== null).length,
    cuts: qrows.reduce((m, r) => { m[r.cut || 'connected'] = (m[r.cut || 'connected'] || 0) + 1; return m; }, {}),
    four });
}

// ---------------------------------------------------------------- 第263便c(第55報 W3)
// **判定に足りないものの一覧**(天体 × 量)。2026-09-14 の観測レコード intake は太陽系にも
// σ を 19 行入れたが、**入ったのは半径・GM・候補行**であって、門が読む量(公転周期・離心率・
// 近点移動・自転)の σ は 1 件も無い。ここで出すのは「**何が来れば判定が増えるか**」の表である
// (推測で埋めない —— 器は CSV に無いものを無いと書くだけである)。
const missingForJudgement = (() => {
  const m = new Map();
  for (const r of rows) {
    if (!['csv-body-missing', 'csv-quantity-missing', 'csv-sigma-empty'].includes(r.cut)) continue;
    const key = (r.csvBody || r.target) + '|' + (r.csvQuantity || r.kind);
    const e = m.get(key) || { body: r.csvBody, target: r.target, quantity: r.csvQuantity, kind: r.kind,
      cut: r.cut, presets: [], nQuantities: 0, obsPresent: 0 };
    if (!e.presets.includes(r.emoji)) e.presets.push(r.emoji);
    e.nQuantities++;
    if (r.obs !== null) e.obsPresent++;
    m.set(key, e);
  }
  return [...m.entries()].map(([key, e]) => Object.assign({ key }, e))
    .sort((a, b) => (a.cut === b.cut ? b.nQuantities - a.nQuantities : a.cut.localeCompare(b.cut)));
})();
const cutTally = rows.reduce((m, r) => { m[r.cut || 'connected'] = (m[r.cut || 'connected'] || 0) + 1; return m; }, {});
const fourTally = presets.reduce((m, p) => { if (p.four) m[p.four] = (m[p.four] || 0) + 1; return m; }, {});
// σ を持つ CSV 行の全数(**太陽系には 1 行も無い**ことを数で残す)
const sigmaRows = [...csv.rows.values()].filter((r) => r.sigma !== null);
const solarBodiesUsed = [...new Set(Object.values(TARGET_BODY).filter(Boolean))];
const solarSigmaRows = sigmaRows.filter((r) => solarBodiesUsed.includes(r.body));

const out = {
  when: new Date().toISOString(),
  wave: '第262便d(第54報 W4)→ 第263便c(第55報 W3)で σ 未確認の状態名と不足一覧を足した',
  inputs: { calaudit: path.relative(ROOT, CAL), csv: 'paper/data/solar-observations.csv',
    calauditWhen: (cal.meta && cal.meta.when) || null },
  gate: GATE,
  declaration: { targetBody: TARGET_BODY, kindQuantity: KIND_QUANT,
    note: '**宣言表であって自動判定ではない**。CSV に行が無い対象は null を明示する(推測で当てない)' },
  csvSummary: { rows: csv.rows.size, bodies: csv.bodies.size,
    rowsWithSigma: sigmaRows.length,
    sigmaBodies: [...new Set(sigmaRows.map((r) => r.body))],
    solarRowsWithSigma: solarSigmaRows.length,
    // 第263便c: 太陽系の σ 行を**量ごと**に割る(門が読む量に入っているかどうかが本質だから)
    solarSigmaQuantities: solarSigmaRows.reduce((m, r) => { m[r.quantity] = (m[r.quantity] || 0) + 1; return m; }, {}),
    solarSigmaGated: solarSigmaRows.filter((r) => Object.values(KIND_QUANT).includes(r.quantity)).length,
    finding: solarSigmaRows.length === 0
      ? '**太陽系の body には σ が 1 行も入っていない**(21 個の σ は恒星連星と NS 連星の行だけ)'
      : '太陽系の body にも σ の行が入った(2026-09-14 の観測レコード intake)。**ただし門が読む量'
        + '(公転周期・離心率・近点移動・自転)の σ は '
        + solarSigmaRows.filter((r) => Object.values(KIND_QUANT).includes(r.quantity)).length
        + ' 件である** —— 入ったのは半径・GM・候補行の σ で、判定量の σ ではない' },
  // ---- 第268便a(第58報 W1): **据え置き欄の横に並べる 2 列**(4 値は 1 本も動かさない)----
  guardsRule: requiredGuards({}).rule,
  unitConvertedFirst: {
    what: '切断点 `unit-not-converted` の行を、**分子の Δϖ と同じ近点窓の近点間周期**で '
      + 'deg/orbit → deg/yr に換算したときの残差 σ 倍。**対照**として周期行(revolution)と'
      + '丸めた観測周期でも換算し、**どの P を使うかで符号まで変わる**ことを数で置く。',
    yearSec: YEAR_SEC,
    contract: ['**第269便a**: 分子の Δϖ と**同じ近点集合**(傾き fit と同じ最初の nFit 近点)の'
      + '平均間隔 `pPeriSameWindowSec` を使う —— `pPeriSec`(第252便b の 20 近点固定窓)は**同じ窓ではない**',
      '観測値と観測 σ は同じ係数で同じ単位へ写す(逆向きに写しても σ 倍は同じ)',
      '換算係数の数値誤差は σ に混ぜない —— 換算後の量そのものを h/h2/h4 で検査する',
      'obsCard の表示単位と内部判定単位は分けてよい'],
    rows: rows.filter((r) => r.unitConvertedFirst).map((r) => ({ id: r.id, emoji: r.emoji,
      target: r.target, measDegPerOrbit: r.meas,
      obs: r.unitConvertedFirst.obsValue, sigma: r.unitConvertedFirst.obsSigma,
      primary: r.unitConvertedFirst.primary, controls: r.unitConvertedFirst.controls,
      inverseCheck: r.unitConvertedFirst.inverseCheck,
      // 第269便a: **旧契約(20 近点窓)の記録**を行にも載せる(**新値として写さない**ための対照)
      previous: r.unitConvertedFirst.previous, verdict: r.unitConvertedFirst.verdict })),
    cutPreserved: (cutTally['unit-not-converted'] || 0),
    // 第270便a(AD8): **📡 はこの欄から抜けた**(判定量を deg/yr へ写して正式判定へ繋いだため)。
    // 残っている行は**換算していない水星の 3 行**で、切断点 `unit-not-converted` の**対照**である。
    movedToOfficial: rows.filter((r) => r.ad8Converted).map((r) => ({ id: r.id, emoji: r.emoji,
      target: r.target, unit: r.unit, meas: r.meas, obs: r.obs, sigma: r.sigma,
      nSigma: r.nSigma, verdict: r.verdict, previousUnit: r.previousUnit })),
    note: '**第270便a(AD8)で 📡 D68 はこの欄から正式判定へ移った**(`movedToOfficial`)。'
      + 'ここに残るのは**換算していない行の対照**である —— 切断点 `unit-not-converted` は'
      + '**消していない**(状態の名前として残り、水星の 3 行がそれを使っている)。'
      + '**旧値(基点の切断点 4 件・4 値 保留 16)は `history` に残す**。',
    doNotWrite: ['換算したら D68 が合(3σ) になった', '換算で判定が増えた', '太陽系の σ が揃った',
      '切断点が無くなった'],
  },
  declaredFirst: {
    what: '**採用観測解の明示宣言**(`paper/data/judgement-sources.json`)で判定行を読んだときの'
      + '値差と σ 倍。**宣言前の判定行は 1 行も差し替えていない**(既定の列は不変)。',
    file: 'paper/data/judgement-sources.json', ok: JS.ok,
    declared: JS.declarations.map((d) => d.body + '|' + d.quantity),
    notDeclared: (JS.notDeclared || []).map((d) => d.body + '|' + d.quantity + '(' + d.why + ')'),
    rows: rows.filter((r) => r.declaredFirst).map((r) => Object.assign({ id: r.id, emoji: r.emoji,
      target: r.target, kind: r.kind, meas: r.meas }, r.declaredFirst)),
    note: '**「宣言後の初判定」は 4 値の横に置く**(上書きしない)。σ の無い宣言は行選択を決めるだけで、'
      + '門へは 1 bit も入らない。',
  },
  cutTally, fourTally, presets, rows, missingForJudgement,
  // ---------------------------------------------------------------- 第270便a(第60報 W1・署名便)
  // **旧値を履歴として残す**(新値は再集計して測った値である)。「1 回」は訂正禁止の意味ではない。
  history: [{
    wave: '第269便(第59報・PR #271)', commit: 'f6c19b4',
    fourTally: { '保留': 16 },
    cutTally: { 'csv-sigma-empty': 109, 'kind-not-gated': 26, 'unit-not-converted': 4 },
    csvSha: 'e426aa7d8a6751068699933074c7885ee66234936e11aafd319bc091a670afd4',
    judgementMode: 'diagnostic-only-until-AD5',
    reason: '**基点**。宣言は診断欄のみ(切断点も旧行=ファイル順の最初で分類)・📡 は換算前(°/周)'
      + 'なので切断点 `unit-not-converted` に留まっていた。',
  }],
  moved: {
    what: ['AD5: 宣言 2 件(カロン P・金星 e)を正式経路へ —— **切断点の分類も宣言行で行う**',
      'AD8: 📡 D68 の判定量を ϖ̇ [deg/yr] へ写した —— 切断点 `unit-not-converted` から外れる'],
    cutPreservedNote: '**切断点 `unit-not-converted` は消していない** —— 換算していない水星の 3 行'
      + '(☄️🪨🌞)が**対照として残る**。この区分は「σ の単位が obsCard と違う」状態の名前であって、'
      + '📡 を換算したから不要になったのではない。',
    doNotWrite: ['換算で判定が増えた', '太陽系の σ が揃った', 'D68 が合(3σ)', '較正を完了した'],
  },
  conclusion: {
    connected: cutTally.connected || 0,
    unverified: cutTally['csv-sigma-unverified'] || 0,
    missingForJudgement: missingForJudgement.length,
    note: (cutTally.connected || 0) === 0
      ? '**対応表を繋いでも 3σ の判定は 1 件も出ない** —— 切断点は対応表ではなく **CSV の sigma 列と行そのもの**である。'
        + 'したがって太陽系 16 本は「保留(σ 未登録)」のままである(**否定ではない**)。'
        + '2026-09-14 の観測レコード intake でも**この数は動かない**: 入った σ は半径・GM・候補行のもので、'
        + '門が読む量(公転周期・離心率・近点移動・自転)の σ ではない。'
      : '**接続後に判定が出た量がある**(表を読むこと)。第270便a(AD5/AD8)で σ が門へ届いた行は '
        + (cutTally.connected || 0) + ' 件で、そのうち 3σ の合否が出たのは '
        + rows.filter((r) => r.verdict === '合(3σ)' || r.verdict === '否(3σ)').length + ' 件である。'
        + '**残りは「保留」である**(数値収束・写像・σ 未登録)—— 保留は否定ではない。'
        + '**合否が出たことは較正が進んだことではない** —— 出た合否の中身は 4 値の表を読むこと。',
    doNotWrite: ['太陽系の現実較正を完了した', 'σ を繋いだので合格した', '保留は否定である',
      '±1% の目安を σ として読んだ', '観測レコードが入ったので判定が出た(σ は unverified のままである)',
      '判定が増えた', '較正を完了した'] },
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));
console.log('[w262d] 太陽系 16 本の σ 接続 —— 切断点の分解');
console.log('  CSV: ' + csv.rows.size + ' 行 / σ を持つ行 ' + sigmaRows.length
  + ' 行(天体: ' + [...new Set(sigmaRows.map((r) => r.body))].join(', ') + ')');
console.log('  → 太陽系の body で σ を持つ行: ' + solarSigmaRows.length + ' 行');
console.log('  切断点の内訳: ' + JSON.stringify(cutTally));
console.log('  判定に足りないもの(天体×量): ' + missingForJudgement.length + ' 組 —— '
  + missingForJudgement.slice(0, 8).map((e) => e.key + '(' + e.cut + ')').join(' , ')
  + (missingForJudgement.length > 8 ? ' …' : ''));
console.log('  4 値の内訳: ' + JSON.stringify(fourTally) + ' / **基点 f6c19b4 は '
  + JSON.stringify(out.history[0].fourTally) + '・切断点 ' + JSON.stringify(out.history[0].cutTally)
  + '**(第270便a の AD5/AD8 で動いた —— 旧値は history に残す)');
// ---- 第268便a: 横に並べた 2 列(判定ではない)----
for (const r of out.unitConvertedFirst.rows) {
  const c = r.primary;
  console.log('  換算後 ' + r.emoji + ' ' + pad(r.id, 20) + ' ' + pad(r.target, 6)
    + ' Δϖ=' + r.measDegPerOrbit.toPrecision(10) + ' deg/周 → '
    + (c.simDegPerYear === null ? '換算不能(近点間周期が未測定)'
      : c.simDegPerYear.toPrecision(10) + ' deg/yr(' + c.nSigma.toFixed(4) + 'σ)')
    + r.controls.map((z) => ' / 対照 ' + z.periodDef + ' '
      + (z.nSigma === null ? '—' : z.nSigma.toFixed(4) + 'σ')).join(''));
}
for (const r of out.declaredFirst.rows) {
  console.log('  宣言後 ' + r.emoji + ' ' + pad(r.id, 20) + ' ' + pad(r.key, 26)
    + ' 値差 ' + (r.valueDelta === null ? '—' : String(r.valueDelta))
    + ' / σ 倍 ' + (r.nSigma === null ? '—' : r.nSigma.toPrecision(8))
    + ' / ' + r.verdict);
}
for (const p of presets) {
  if (p.missing) { console.log('  ' + pad(p.id, 20) + ' (calaudit JSON に無い)'); continue; }
  console.log('  ' + p.emoji + ' ' + pad(p.id, 20) + ' 量 ' + pad(p.nQuantities, 3)
    + ' 門に入りうる ' + pad(p.nGatable, 3) + ' 条件不一致 ' + pad(p.nCondMismatch, 2)
    + ' σ 接続 ' + pad(p.nSigmaConnected, 2) + ' 4 値=' + p.four
    + '  ' + JSON.stringify(p.cuts));
}
console.log('→ ' + path.relative(ROOT, OUT));

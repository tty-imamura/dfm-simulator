// 第283便c(原仮定者の裁定(第73報)⑤「正本再生成と QA が非常に長い → 改善。dt/8 は無くす方向。dt/4 は前回の結果を
// 利用して dt と dt/2 が一致したら省略を検討。dt だけで重いサンプルを調査して改善」・統括の検証項目 R86)。
// **較正走行(calaudit)の段の純関数**。器 tests/exp-w249b-calaudit.mjs・生成器 tests/exp-w279a-samplestatus.mjs・
// QA `behavior.calauditStages` が**同じ 1 本**を読む(読み方が器ごとに違わないようにする)。
//
// ■ 何を持つか
//   ① `calStagesOf(run)` …… 1 本の較正走行の**段別の壁時計**。`timeBudget[]` に dt/8 がある走行では
//      `dtEighth.wallSec` を**足さない**(第282便の所要時間の節は両方を足していた —— ❄️ 716 s → 正しくは 467 s)。
//      旧形式(timeBudget に dt/8 が無く dtEighth だけがある記録)は dtEighth を読む。再利用した段(`reused`)は
//      **この走行で掛かった時間に数えない**(元の走行の秒は `reusedSec` に別に出す)。
//   ② dt/4 の**再利用規則**(`H4_REUSE_RULE`)—— 前回の正本の同じ本の h4 を、(a) 契約(presetHash〔受理後のプリセット JSON〕・法則の指紋・
//      窓・抽出器・停止規則・刻み)が同じ (b) NaN/クランプ/資源打切りが無い とき**転記**する(`skippedBy:"reuse"`)。
//      否・保留の本で写像の宣言が動いたときは再利用しない。
//   ③ dt と dt/2 の**閾値規則**(`dtDt2Skip` —— 既定 off のオプション)。**DFM 概略整合(調整中)の本だけ**に許す
//      (kF0 の正式判定には使わない)。**dt と dt/2 の一致は収束の証明ではない**(`counterExample`)。
//
// ■ しないこと: 走らせない・判定しない(段の記録を読む純関数だけ)。
export const H4_REUSE_VERSION = 'w283c-h4reuse-1';

// 契約の鍵(1 つでも違えば再利用しない)。`presetHash` は受理後のプリセット JSON(presetSig の上位集合 —— 宣言の全欄)の FNV-1a、
// `lawsSha` は理論用語集 LAWS の JSON の SHA-256。`engineSha` は `S._core`・`S.step`・対カーネル・試験粒子の外部ステップの
// ソース文字列の SHA-256(**それ以外の補助関数は指紋に入らない** —— 法則を変える便は `--no-h4-reuse` を付ける)。
export const H4_CONTRACT_KEYS = ['version', 'key', 'presetHash', 'engineSha', 'lawsSha',
  'dt', 'orbMax', 'maxSteps', 'stepsPerOrbit0', 'periWindow', 'extractorSha', 'stopRuleVersion', 'kf0'];

export const H4_REUSE_RULE = {
  version: H4_REUSE_VERSION, since: '第283便c(原仮定者の裁定(第73報)⑤・統括の検証項目 R86 (iii))',
  contract: 'presetHash(受理後のプリセット JSON —— presetSig の上位集合)・法則の指紋(engineSha・lawsSha)・刻み・窓・抽出器・停止規則の版・kF0 の別',
  what: '前回の正本(tests/out/calaudit-w249.json と対の tests/out/calaudit-w249-diag.json の `h4Store`)に同じ本・同じ契約の'
    + ' h4(dt/4)の生の走行があれば、走らせずに**転記**する。転記した段には `skippedBy:"reuse"` と元の走行の'
    + '`reusedFrom:{generatedAt, targetSha256}` を刻む(dtQuarter・timeBudget・stopRuleStages の同じ段)。',
  contractKeys: H4_CONTRACT_KEYS,
  health: '元の走行に NaN が無い・安全クランプ 0・壁時計の資源上限で打ち切られていない(resource-limit / deadlineHit でない)',
  mapping: '元の走行の本の 4 値が「否」か「保留」で、写像の宣言(CFG・行ごとの測定定義・離心タイミング連星・換算・従属量・'
    + '理論対照・D68 の周期定義)の指紋が動いていたら再利用しない',
  processing: '転記するのは**生の走行**(page 側の抽出結果)で、判定・写像・門は**この走行の器で掛け直す**',
  optOut: '`--no-h4-reuse` で再利用を切る(法則を変える便・抽出器の外で数値が動く変更の便)',
  doNotWrite: ['再利用したので収束した', 'dt/4 を省いても判定は同じ', '試験が短くなった=数値が収束した'],
};

export const DT_DT2_REL = 3e-4;
export const DT_DT2_SIGMA = 0.3;
export const DT_DT2_RULE = {
  since: '第283便c(R86 (iii))', option: '--h4-skip-dt2(既定 off)',
  scope: '**DFM 概略整合(調整中)の本だけ**(tests/out/calcontract-w282a.json の system が "dfm" の本)。'
    + '**kF0 の正式判定・kF0 診断コピーには使わない**',
  rule: '|q(dt) − q(dt/2)| < ' + DT_DT2_SIGMA + 'σ(σ の無い量は相対 ' + DT_DT2_REL + ')の量**だけ**が並ぶとき dt/4 を省く'
    + '(`skippedBy:"dt-dt2"`)。本版の器は生の抽出量(近点間周期・同方向周期・近点移動・接触要素周期・離心率 proxy)に'
    + '**相対 ' + DT_DT2_REL + ' だけ**を当てる(σ の宛先は判定の段で決まるので、走行の段では読めない —— 0.3σ 規則は宣言にとどめる)',
  caution: '**dt と dt/2 の一致は収束の証明ではない**。誤差 e(h)=c·h²(h−h₀)(h−h₀/2) は h₀ と h₀/2 で 0 だが h₀/4 で '
    + 'c·3h₀⁴/256 ≠ 0(`counterExample`)。省いた本の判定は 2 段の感度診断のままで、観測次数は出ない',
};

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** 1 本の較正走行の段別の壁時計(第283便c: 二重加算の修正・再利用の段は数えない)。 */
export function calStagesOf(run) {
  const stages = [];
  if (!run) return { stages, wallSec: 0, reusedSec: 0, dt8InTimeBudget: false, legacyDt8: false };
  const tb = Array.isArray(run.timeBudget) ? run.timeBudget : [];
  let dt8InTimeBudget = false;
  for (const z of tb) {
    if (!z || !isNum(z.wallSec)) continue;
    if (z.tag === 'dt/8') dt8InTimeBudget = true;
    const reused = (z.reused === true) || (z.skippedBy === 'reuse');
    stages.push({ tag: z.tag, wallSec: z.wallSec, reused });
  }
  let legacyDt8 = false;
  if (!dt8InTimeBudget && run.dtEighth && isNum(run.dtEighth.wallSec)) {   // 旧形式(dtEighth だけの記録)
    stages.push({ tag: 'dt/8', wallSec: run.dtEighth.wallSec, reused: false });
    legacyDt8 = true;
  }
  const wallSec = stages.filter((z) => !z.reused).reduce((a, z) => a + z.wallSec, 0);
  const reusedSec = stages.filter((z) => z.reused).reduce((a, z) => a + z.wallSec, 0);
  return { stages, wallSec, reusedSec, dt8InTimeBudget, legacyDt8 };
}

/** 第282便の旧式(timeBudget の和 + dtEighth.wallSec —— dt/8 を 2 回数える)。回帰試験の対照にだけ使う。 */
export function calStagesLegacyW282(run) {
  if (!run) return 0;
  let s = 0;
  for (const z of (run.timeBudget || [])) if (z && isNum(z.wallSec)) s += z.wallSec;
  if (run.dtEighth && isNum(run.dtEighth.wallSec)) s += run.dtEighth.wallSec;
  return s;
}

/** 契約の突き合わせ(鍵ごとに JSON で比べる —— 配列 stepsPerOrbit0 も含む)。 */
export function h4ContractDiff(a, b) {
  const diff = [];
  if (!a || !b) return ['(契約が無い)'];
  for (const k of H4_CONTRACT_KEYS) if (JSON.stringify(a[k] === undefined ? null : a[k]) !== JSON.stringify(b[k] === undefined ? null : b[k])) diff.push(k);
  return diff;
}

/** 生の走行の健全性(NaN・クランプ・資源打切り)。 */
export function h4RunHealthy(r) {
  if (!r) return { ok: false, why: '走行が無い' };
  if (r.nan) return { ok: false, why: 'NaN' };
  if (isNum(r.clamp) && r.clamp !== 0) return { ok: false, why: '安全クランプ ' + r.clamp };
  if (r.deadlineHit === true) return { ok: false, why: '壁時計の資源上限で打ち切った(deadlineHit)' };
  if (r.stopRule && (r.stopRule.resourceExceeded === true || r.stopRule.unmeasuredReason === 'resource-limit')) return { ok: false, why: 'resource-limit' };
  return { ok: true, why: null };
}

/**
 * 再利用の可否。entry = 前回の正本の `h4Store.entries[key]`({contract, run, verdict4, mappingSig, generatedAt, targetSha256})。
 * @returns {{reuse:boolean, reason:string|null, diff:string[]}}
 */
export function h4ReuseDecision({ entry, contract, mappingSig }) {
  if (!entry || !entry.run) return { reuse: false, reason: 'no-entry', diff: [] };
  const diff = h4ContractDiff(entry.contract, contract);
  if (diff.length) return { reuse: false, reason: 'contract', diff };
  const h = h4RunHealthy(entry.run);
  if (!h.ok) return { reuse: false, reason: 'health: ' + h.why, diff: [] };
  if ((entry.verdict4 === '否' || entry.verdict4 === '保留') && entry.mappingSig !== mappingSig) {
    return { reuse: false, reason: 'mapping-moved(' + entry.verdict4 + ')', diff: ['mappingSig'] };
  }
  return { reuse: true, reason: null, diff: [] };
}

/** 転記した段の生の走行(元の記録は書き換えない —— 深い写しに刻印を足す)。 */
export function reusedRun(entry) {
  const r = JSON.parse(JSON.stringify(entry.run));
  const from = { generatedAt: entry.generatedAt || null, targetSha256: entry.targetSha256 || null };
  r.skippedBy = 'reuse'; r.reusedFrom = from;
  if (r.timeBudget) Object.assign(r.timeBudget, { reused: true, skippedBy: 'reuse', reusedFrom: from });
  if (r.stopRule) Object.assign(r.stopRule, { skippedBy: 'reuse', reusedFrom: from });
  return r;
}

// 生の抽出量(dt と dt/2 の閾値規則が比べる候補)。σ の宛先は判定の段で決まるので、ここは相対規則だけ
const RAW_KEYS = [['A', 'perMean'], ['B', 'perMean'], ['A', 'slopeDeg'], ['B', 'slopeDeg']];
/** dt と dt/2 の生の抽出量が相対 DT_DT2_REL の中に並ぶか(既定 off のオプション —— DFM 概略整合の本だけ)。 */
export function dtDt2Skip(rowH, rowH2) {
  const rows = [];
  if (!rowH || !rowH2 || !Array.isArray(rowH.targets) || !Array.isArray(rowH2.targets)) return { skip: false, rows, why: '走行が無い' };
  rowH.targets.forEach((t, i) => {
    const u = rowH2.targets[i]; if (!u) return;
    const cand = RAW_KEYS.map(([d, k]) => ({ q: d + '.' + k, a: t[d] ? t[d][k] : null, b: u[d] ? u[d][k] : null }))
      .concat([{ q: 'oscP', a: t.oscP, b: u.oscP }, { q: 'revPMean', a: t.revPMean, b: u.revPMean }, { q: 'eProxy', a: t.eProxy, b: u.eProxy }]);
    for (const c of cand) {
      if (!isNum(c.a) || !isNum(c.b)) continue;
      const den = Math.max(Math.abs(c.a), Math.abs(c.b));
      const rel = den > 0 ? Math.abs(c.a - c.b) / den : 0;
      rows.push({ target: t.label, q: c.q, dt: c.a, dtHalf: c.b, rel, ok: rel < DT_DT2_REL });
    }
  });
  const skip = rows.length > 0 && rows.every((z) => z.ok);
  return { skip, rows, why: rows.length ? (skip ? null : '相対 ' + DT_DT2_REL + ' を超える量がある') : '比べる量が無い' };
}

/** 反例: 誤差 e(h)=c·h²(h−h₀)(h−h₀/2) は h₀・h₀/2 で 0 なのに h₀/4 で 0 でない(dt と dt/2 の一致は収束の証明ではない)。 */
export function counterExample(h0 = 0.016, c = 1) {
  const e = (h) => c * h * h * (h - h0) * (h - h0 / 2);
  return { h0, c, eH: e(h0), eH2: e(h0 / 2), eH4: e(h0 / 4), eH4Formula: 3 * c * h0 ** 4 / 256,
    reads: 'Q(h₀)=Q(h₀/2)=Q★ でも Q(h₀/4)=Q★+c·3h₀⁴/256 —— 2 段の一致だけでは漸近域に居るかが分からない' };
}

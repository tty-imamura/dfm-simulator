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
//
// ■ 第284便c(原仮定者の裁定(第74報)⑥「dt/4 は一部のサンプルだけなので必須な理由が無ければ無くす・dt/2 は前回と dt が一致したら
//   省略を検討(特に同一便の再走行時)」・AN33・統括の検証項目 R93)
//   ④ **dt/4 を常時の鎖から外す**。常時に残すのは**例外の登録簿**(`H4_EXCEPTIONS` —— kF0 の正式判定〔kFrame=0 の行〕で
//      h/4 が門の判定〔合(3σ)/否(3σ)〕に残っている量だけ)。登録の外の 3 段は明示診断(`--dt4-registry` 単独)の入口だけ。
//   ⑤ **h4 契約の穴を塞ぐ**(版 w284c-h4reuse-2 —— 初回は旧キャッシュを読まない = 再取得): 空契約 `{}` どうし・必須鍵の欠落・
//      未知の版・不完全窓(`stopRule.complete` でない)を拒否。`engineSha` は**閉包**(`tests/lib-w281a-scope.mjs` の停止集合つき
//      依存閉包 —— 説明文字列は領域の版 3 で除かれる)で作る(第283便c の「名指しの 9 関数のソース」は補助関数を取りこぼした)。
//   ⑥ **dt/2 の再利用**(`H2_REUSE_RULE` —— 同一便の再走): 前回の h と今回の h が同じ契約で、生の走行が**ビット一致**し
//      (決定的走行)、前回の h/2 が完了(非有限・クランプ・資源打切りなし)なら h/2 を転記する(`skippedBy:"reuse-dt2"`)。
//   ⑦ `dtDt2Skip`(閾値規則・既定 off)は**対象 ID と量の集合の完全一致**を必須にした。
import crypto from 'node:crypto';
// 第285便f(統括の検証項目〔較正走行の窓〕): 契約に**窓の定義**(`window` —— 目標物理時間 T の規則の版・T〔dt₀ での步数〕・dt₀・
//   軌道窓の出所〔t=0 の接触要素 / 宣言した軌道長〕・必要近点数)を足して版を上げた(w284c-h4reuse-2 → w285f-h4reuse-3。旧版は「未知の版」で拒否 = 初回は再取得)
export const H4_REUSE_VERSION = 'w285f-h4reuse-3';
/** 受理する契約の版(これ以外の版の契約は「未知の版」で拒否する —— 旧版 w283c-h4reuse-1 も拒否 = 初回は再取得)。 */
export const H4_REUSE_VERSIONS_KNOWN = [H4_REUSE_VERSION];

// 契約の鍵(1 つでも違えば再利用しない)。`presetHash` は受理後のプリセット JSON(presetSig の上位集合 —— 宣言の全欄)の FNV-1a、
// `lawsSha` は理論用語集 LAWS の JSON の SHA-256。`engineSha` は第284便c から**閉包の hash**(`makeSim`・`validatePreset`・
// 対カーネル・試験粒子の外部ステップを roots にした停止集合つき依存閉包 + `S._core` の本文 —— 閉包が不完全なら null = 再利用しない)。
// `units` は {G, c, toSec}(第284便c で追加 —— 単位の契約)。
export const H4_CONTRACT_KEYS = ['version', 'key', 'presetHash', 'engineSha', 'lawsSha',
  'dt', 'orbMax', 'maxSteps', 'stepsPerOrbit0', 'periWindow', 'extractorSha', 'stopRuleVersion', 'kf0', 'units', 'window'];
/** 必須鍵(null・undefined・空配列を欠落とみなす —— 空契約 `{}` どうしを一致にしない)。`kf0` は真偽値(false は欠落でない)。 */
export const H4_REQUIRED_KEYS = H4_CONTRACT_KEYS.slice();

export const H4_REUSE_RULE = {
  version: H4_REUSE_VERSION, since: '第283便c(原仮定者の裁定(第73報)⑤・統括の検証項目 R86 (iii))',
  contract: 'presetHash(受理後のプリセット JSON —— presetSig の上位集合)・法則の指紋(engineSha〔第284便c: 停止集合つき依存閉包の hash〕・lawsSha)・'
    + '刻み・窓・抽出器・停止規則の版・kF0 の別・単位(G・c・toSec)。**必須鍵が 1 つでも欠けた契約・未知の版の契約は拒否**(第284便c)',
  what: '前回の正本(tests/out/calaudit-w249.json と対の tests/out/calaudit-w249-diag.json の `h4Store`)に同じ本・同じ契約の'
    + ' h4(dt/4)の生の走行があれば、走らせずに**転記**する。転記した段には `skippedBy:"reuse"` と元の走行の'
    + '`reusedFrom:{generatedAt, targetSha256}` を刻む(dtQuarter・timeBudget・stopRuleStages の同じ段)。',
  contractKeys: H4_CONTRACT_KEYS,
  health: '元の走行に NaN が無い・安全クランプ 0・壁時計の資源上限で打ち切られていない(resource-limit / deadlineHit でない)・'
    + '**窓が完了している(`stopRule.complete===true` —— 第284便c)**',
  mapping: '元の走行の本の 4 値が「否」か「保留」で、写像の宣言(CFG・行ごとの測定定義・離心タイミング連星・換算・従属量・'
    + '理論対照・D68 の周期定義)の指紋が動いていたら再利用しない',
  processing: '転記するのは**生の走行**(page 側の抽出結果)で、判定・写像・門は**この走行の器で掛け直す**',
  optOut: '`--no-h4-reuse` で再利用を切る(法則を変える便・抽出器の外で数値が動く変更の便)',
  chainPolicy: '第284便c(AN33): **常時の鎖では h/4 を走らせない**(例外の登録簿 `H4_EXCEPTIONS` の本だけ)。再利用は明示診断(`--dt4-registry`)と'
    + '例外の走行で効く(走っていない段を走ったと刻まない —— 鎖の正本の登録外の本は dtQuarter=null・判定段は h/h2)',
  doNotWrite: ['再利用したので収束した', 'dt/4 を省いても判定は同じ', '試験が短くなった=数値が収束した'],
};

export const DT_DT2_REL = 3e-4;
export const DT_DT2_SIGMA = 0.3;
export const DT_DT2_RULE = {
  since: '第283便c(R86 (iii))', option: '--h4-skip-dt2(既定 off)',
  scope: '**DFM 概略整合(調整中)の本だけ**(tests/out/calcontract-w282a.json の system が "dfm" の本)。'
    + '**kF0 の正式判定・kF0 診断コピーには使わない**。第284便c: **対象 ID と量の集合の完全一致**が必須(`rawQuantitySet`)',
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
    // 第284便c: 転記は h4(skippedBy:"reuse")と h2(skippedBy:"reuse-dt2")の 2 種 —— どちらもこの走行の時間に数えない
    const reused = (z.reused === true) || (z.skippedBy === 'reuse') || (z.skippedBy === 'reuse-dt2');
    stages.push({ tag: z.tag, wallSec: z.wallSec, reused, reusedBy: reused ? (z.skippedBy || 'reuse') : null });
  }
  let legacyDt8 = false;
  if (!dt8InTimeBudget && run.dtEighth && isNum(run.dtEighth.wallSec)) {   // 旧形式(dtEighth だけの記録)
    stages.push({ tag: 'dt/8', wallSec: run.dtEighth.wallSec, reused: false });
    legacyDt8 = true;
  }
  const wallSec = stages.filter((z) => !z.reused).reduce((a, z) => a + z.wallSec, 0);
  const reusedSec = stages.filter((z) => z.reused).reduce((a, z) => a + z.wallSec, 0);
  // 第284便c: 転記の内訳(元の走行の秒 —— h2 と h4)
  const reusedH2Sec = stages.filter((z) => z.reused && z.reusedBy === 'reuse-dt2').reduce((a, z) => a + z.wallSec, 0);
  const reusedH4Sec = reusedSec - reusedH2Sec;
  return { stages, wallSec, reusedSec, reusedH2Sec, reusedH4Sec, dt8InTimeBudget, legacyDt8 };
}

/** 第282便の旧式(timeBudget の和 + dtEighth.wallSec —— dt/8 を 2 回数える)。回帰試験の対照にだけ使う。 */
export function calStagesLegacyW282(run) {
  if (!run) return 0;
  let s = 0;
  for (const z of (run.timeBudget || [])) if (z && isNum(z.wallSec)) s += z.wallSec;
  if (run.dtEighth && isNum(run.dtEighth.wallSec)) s += run.dtEighth.wallSec;
  return s;
}

const missingVal = (v) => v === undefined || v === null || (Array.isArray(v) && v.length === 0) || (typeof v === 'string' && v === '');
/** 必須鍵の欠落(第284便c —— 空契約 `{}` を「全部 null で一致」にしない)。 */
export function contractMissing(c, keys) {
  if (!c || typeof c !== 'object') return (keys || H4_REQUIRED_KEYS).slice();
  return (keys || H4_REQUIRED_KEYS).filter((k) => missingVal(c[k]));
}

/**
 * 契約の突き合わせ(鍵ごとに JSON で比べる —— 配列 stepsPerOrbit0 も含む)。
 * 第284便c: どちらかの契約に**必須鍵の欠落**があるか、**未知の版**なら、それ自体を差として返す(空契約どうしは一致しない)。
 * @param {object} a @param {object} b
 * @param {{keys?:string[], required?:string[], versions?:string[]}} [o] 既定は h4 の鍵・必須鍵・版(h2 は H2_* を渡す)
 */
export function h4ContractDiff(a, b, o) {
  const opt = o || {};
  const keys = opt.keys || H4_CONTRACT_KEYS, req = opt.required || H4_REQUIRED_KEYS, vers = opt.versions || H4_REUSE_VERSIONS_KNOWN;
  const diff = [];
  if (!a || !b) return ['(契約が無い)'];
  const ma = contractMissing(a, req), mb = contractMissing(b, req);
  if (ma.length) diff.push('(前回の契約に必須鍵の欠落: ' + ma.join(',') + ')');
  if (mb.length) diff.push('(今回の契約に必須鍵の欠落: ' + mb.join(',') + ')');
  if (!vers.includes(a.version)) diff.push('(前回の契約が未知の版: ' + String(a.version) + ')');
  if (!vers.includes(b.version)) diff.push('(今回の契約が未知の版: ' + String(b.version) + ')');
  for (const k of keys) if (JSON.stringify(a[k] === undefined ? null : a[k]) !== JSON.stringify(b[k] === undefined ? null : b[k])) diff.push(k);
  return diff;
}

/**
 * 生の走行の完了(NaN・クランプ・資源打切り)。第284便c: `opt.requireWindow`(h4 の既定)では**窓の完了**
 * (`stopRule.complete===true`)も要る —— 不完全窓の h4 は転記しない。h2 の転記は「完了 = 非有限・クランプ・資源打切りなし」
 * (宣言の步数上限で近点窓が埋まらない h/2 は決定的な契約の結果なので転記してよい —— `H2_REUSE_RULE`)。
 */
export function h4RunHealthy(r, o) {
  const requireWindow = !(o && o.requireWindow === false);
  if (!r) return { ok: false, why: '走行が無い' };
  if (r.nan) return { ok: false, why: 'NaN' };
  if (isNum(r.clamp) && r.clamp !== 0) return { ok: false, why: '安全クランプ ' + r.clamp };
  if (r.deadlineHit === true) return { ok: false, why: '壁時計の資源上限で打ち切った(deadlineHit)' };
  if (r.stopRule && (r.stopRule.resourceExceeded === true || r.stopRule.unmeasuredReason === 'resource-limit')) return { ok: false, why: 'resource-limit' };
  if (!r.stopRule) return { ok: false, why: '停止条件の記録が無い' };
  if (requireWindow && r.stopRule.complete !== true) return { ok: false, why: '不完全窓(stopRule.complete でない)' };
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
  const h = h4RunHealthy(entry.run, { requireWindow: true });
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
const candOf = (t) => RAW_KEYS.map(([d, k]) => ({ q: d + '.' + k, v: t && t[d] ? t[d][k] : null }))
  .concat([{ q: 'oscP', v: t ? t.oscP : null }, { q: 'revPMean', v: t ? t.revPMean : null }, { q: 'eProxy', v: t ? t.eProxy : null }]);
/** 1 段の生の走行の「対象 ID と量の集合」(有限の値を持つ (対象, 量) の並び —— 第284便c)。 */
export function rawQuantitySet(row) {
  if (!row || !Array.isArray(row.targets)) return null;
  return row.targets.map((t) => ({ target: t.label, qs: candOf(t).filter((c) => isNum(c.v)).map((c) => c.q) }));
}
/**
 * dt と dt/2 の生の抽出量が相対 DT_DT2_REL の中に並ぶか(既定 off のオプション —— DFM 概略整合の本だけ)。
 * 第284便c(R93): **対象 ID と量の集合の完全一致**を必須にした(片方だけに有限の値がある量・対象の並びの違い・非有限は省略の根拠にしない)。
 */
export function dtDt2Skip(rowH, rowH2) {
  const rows = [];
  if (!rowH || !rowH2 || !Array.isArray(rowH.targets) || !Array.isArray(rowH2.targets)) return { skip: false, rows, why: '走行が無い' };
  const sa = rawQuantitySet(rowH), sb = rawQuantitySet(rowH2);
  if (JSON.stringify(sa) !== JSON.stringify(sb)) return { skip: false, rows, why: '対象 ID と量の集合が一致しない(' + JSON.stringify(sa).slice(0, 80) + ' ≠ ' + JSON.stringify(sb).slice(0, 80) + ')', setMismatch: true };
  rowH.targets.forEach((t, i) => {
    const u = rowH2.targets[i]; if (!u) return;
    const A = candOf(t), B = candOf(u);
    for (let k = 0; k < A.length; k++) {
      const a = A[k].v, b = B[k].v;
      if (!isNum(a) || !isNum(b)) continue;
      const den = Math.max(Math.abs(a), Math.abs(b));
      const rel = den > 0 ? Math.abs(a - b) / den : 0;
      rows.push({ target: t.label, q: A[k].q, dt: a, dtHalf: b, rel, ok: rel < DT_DT2_REL });
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

// =====================================================================================================================
// 第284便c(原仮定者の裁定(第74報)⑥・AN33・統括の検証項目 R93)
// =====================================================================================================================

/**
 * **h/4 の例外の登録簿**(AN33: 「dt/4 は常時から外し、kF0 で h4 が門に残っている量だけ例外の登録簿」)。
 * 規則(**測る前に書く** —— 結果を見て選ばない): 基点 2a4af53 の正本 tests/out/calaudit-w249.json で、要求条件が kFrame=0
 * (`requiredContext.kFrame===0` —— kF0 の正式判定の行)で、判定段が h4 かつ門が 3σ の判定(合(3σ)/否(3σ))に達した量。
 * 2a4af53 の正本の判定段 h4 の 53 量のうち、この規則に当たるのは 4 量(門の 3σ 判定 4 件のすべて)。残り 49 量は門が
 * 数値未解決・mapping-unresolved・未判定で、h/4 が門の判定に効いていない(`H4_POLICY` の読み —— 2 段へ戻して前後を器で測る:
 * 器の `h4Policy.moves`。2 段の判定段は h —— ε=|Q_h−Q_{h/2}| の感度診断)。
 * 例外の本は**本全体を 3 段で走らせる**(量は同じ走行から抽出するので、登録の外の量も同じ本なら h4 の段を持つ)。
 * `path`: 'main' = 既定経路の 3 段(`--h4-exceptions`)/ 'kf0' = kFrame=0 の診断コピーの 3 段(`--kf0-h4-exceptions`)。
 * **登録は合格の宣言ではない**(否(3σ) も載る)。
 */
export const H4_EXCEPTIONS_VERSION = 'w284c-h4exc-1';
const EXC_CONTRACT = 'h4 契約(`H4_CONTRACT_KEYS`・版 ' + H4_REUSE_VERSION + ')—— 既定経路と同じ停止条件・近点窓 20・抽出器・σ の宛先。同一契約の h4 は転記(`H4_REUSE_RULE`)';
const EXC_EXPIRY = '次のどれかで登録を外す(外すのは統括の裁定 —— 器は外さない): (a) 門の収束規約(AD4)が 2 段で判定できる形に改まった '
  + '(b) この量の σ の宛先・採用観測解が変わり、h/4 の有無で門の状態が変わらないと器が示した(前後の実測) (c) 本の退役 '
  + '(d) kF0 の正式判定から外れた(要求条件が kFrame=0 でなくなった)';
// h/4 を外したときの門(第284便c の枝の一時走行 —— 同じ html・同じ器で 2 段だけにした走行の実測。4 量とも 3σ 判定 → 数値未解決)
const EXC_WITHOUT_H4 = { gate: '数値未解決', stage: 'h', source: '第284便c の枝の一時走行(登録表 16 本 + kF0 の 5 本 —— h/4 を走らせない ① と kF0 の段)' };
export const H4_EXCEPTIONS = [
  { preset: 'alphaCenAB', path: 'main', gateKey: 'alphaCenAB|B|period', name: '公転周期(kFrame=0 採用側)',
    reason: 'kF0 の正式判定の行で、門の 3σ 判定〔合(3σ)〕が 3 段(h, h/2, h/4)の収束規約(AD4: 3 段・次数>0・|p−2|≤0.5・窓充足・抽出健全・ε̂ と 2 段差 ≤0.3σ)に拠る',
    contract: EXC_CONTRACT, evidence: { source: 'tests/out/calaudit-w249.json @ 2a4af53', assessedStage: 'h4', gate: '合(3σ)', convergenceOk: true, requiredKFrame: 0, withoutH4: EXC_WITHOUT_H4 },
    expiryCondition: EXC_EXPIRY },
  { preset: 'siriusAB', path: 'main', gateKey: 'siriusAB|B|period', name: '公転周期(kFrame=0 採用側)',
    reason: 'kF0 の正式判定の行で、門の 3σ 判定〔合(3σ)〕が 3 段の収束規約(AD4)に拠る',
    contract: EXC_CONTRACT, evidence: { source: 'tests/out/calaudit-w249.json @ 2a4af53', assessedStage: 'h4', gate: '合(3σ)', convergenceOk: true, requiredKFrame: 0, withoutH4: EXC_WITHOUT_H4 },
    expiryCondition: EXC_EXPIRY },
  { preset: 'saturnZonalD68', path: 'main', gateKey: 'saturnZonalD68|D68|precession', name: 'D68 リングレットの近点移動(推定器つき宣言 — 第250便d)',
    reason: 'kF0 の正式判定の行(換算後 ϖ̇ [deg/yr] の正式判定 —— AD8)で、門の 3σ 判定〔否(3σ)〕が 3 段の収束規約(AD4)に拠る',
    contract: EXC_CONTRACT, evidence: { source: 'tests/out/calaudit-w249.json @ 2a4af53', assessedStage: 'h4', gate: '否(3σ)', convergenceOk: true, requiredKFrame: 0, withoutH4: EXC_WITHOUT_H4 },
    expiryCondition: EXC_EXPIRY },
  { preset: 'plutoCharonReal', path: 'kf0', gateKey: 'plutoCharonReal|カロン|period', name: '公転周期(kFrame=0 対照・同方向1周)',
    reason: 'kFrame=0 の対照走行(診断コピー)を配った行で、門の 3σ 判定〔否(3σ)〕が 3 段の収束規約(AD4)に拠る',
    contract: EXC_CONTRACT, evidence: { source: 'tests/out/calaudit-w249.json @ 2a4af53', assessedStage: 'h4', gate: '否(3σ)', convergenceOk: true, requiredKFrame: 0, withoutH4: EXC_WITHOUT_H4 },
    expiryCondition: EXC_EXPIRY },
];
/** 例外の本(経路ごと)。 */
export function h4ExceptionIds(pathName) { return [...new Set(H4_EXCEPTIONS.filter((z) => z.path === pathName).map((z) => z.preset))]; }
/** 量が例外の登録簿に載っているか(本・経路・門の鍵・名前の 4 つが一致)。 */
export function isH4Exception(presetId, pathName, gateKey, name) {
  return H4_EXCEPTIONS.some((z) => z.preset === presetId && z.path === pathName && z.gateKey === gateKey && z.name === name);
}

export const H4_POLICY = {
  version: H4_EXCEPTIONS_VERSION, since: '第284便c(原仮定者の裁定(第74報)⑥・AN33・統括の検証項目 R93)',
  chain: '常時の鎖の 3 段の段は `--h4-exceptions --merge`(例外の登録簿の main の本だけ)・kF0 の段は `--kf0-h4-exceptions`(登録簿の kf0 の本だけ h/4)',
  explicit: '明示診断の入口: `--dt4-registry`(3 段の恒久登録表 THREE_STAGE_REGISTRY の全本 —— 旧 `--dt3-registry` と同じ走行。単独で走らせる)・'
    + '`--dt3 --only …`・`--kf0-dt3`(kF0 の 5 本すべてに h/4)',
  notRun: '**走っていない段を走ったと刻まない**: 鎖の正本で登録外の本は dtQuarter=null・timeBudget/stopRuleStages に dt/4 が無い・判定段は h か h2',
  reuse: '同一契約の h4 の転記(`H4_REUSE_RULE`)は明示診断と例外の走行で効く(残す)',
  doNotWrite: ['dt/4 を省いても判定は同じ', 'h と h/2 が一致したので収束した', '試験が短くなった=数値が収束した', '判定が増えた'],
  caution: '**h と h/2 の一致は収束の証明ではない**(`counterExample`)。h/4 を外した量は「2 段の感度診断」のままで、観測次数は出ない',
};

// ---------------------------------------------------------------------------------------------------------------------
// ⑥ dt/2 の再利用(同一便の再走)
// ---------------------------------------------------------------------------------------------------------------------
// 第285便f: 契約に**窓の定義**(`window` —— h4 と同じ形)を足して版を上げた(w284c-h2reuse-1 → w285f-h2reuse-2)
export const H2_REUSE_VERSION = 'w285f-h2reuse-2';
/** h2 の契約の鍵(h の段の契約 + h/2 の段の刻み・步数上限 + 第285便f の窓の定義)。 */
export const H2_CONTRACT_KEYS = ['version', 'key', 'presetHash', 'engineSha', 'lawsSha',
  'dt', 'dtH', 'orbMax', 'maxStepsH', 'maxSteps', 'stepsPerOrbit0', 'periWindow', 'extractorSha', 'stopRuleVersion', 'kf0', 'units', 'window'];
/**
 * 第285便f: **窓の定義**(h2・h4 の契約の `window` 欄)。停止規則の記録(`stopRuleFor` の `targetTime`・`orbitWindow`・必要近点数)から作る。
 * 段が違っても同じ値になる(T は dt₀ での步数で持つ)—— h と h/2・h/4 が**同じ物理時間 T の窓**であることの契約。
 */
export const WINDOW_CONTRACT_VERSION = 'w285f-window-1';
export function windowContract(stopRule) {
  if (!stopRule || !stopRule.targetTime) return null;
  const t = stopRule.targetTime;
  return { version: WINDOW_CONTRACT_VERSION, rule: t.rule, dtBase: t.dtBase, tBaseSteps: t.tBaseSteps,
    capBaseSteps: t.capBaseSteps, orbitBaseSteps: t.orbitBaseSteps, window: t.window,
    orbitWindow: stopRule.orbitWindow ? { orbits: stopRule.orbitWindow.orbits, orbitStepsBase: stopRule.orbitWindow.orbitStepsBase } : null,
    needPeriastra: stopRule.needPeriastra };
}
export const H2_REQUIRED_KEYS = H2_CONTRACT_KEYS.slice();
/** 非決定的な走行の許容幅(**未宣言** —— 較正走行は決定的とみなし、h の生の走行がビット一致しなければ h/2 を走らせる)。 */
export const H2_NONDET_TOL = null;
/** 生の走行の「中身」の鍵(壁時計・步/秒・資源の記録を除く —— h の一致はこの鍵の正準 JSON の SHA-256 で見る)。 */
export const RAW_RUN_KEYS = ['tag', 'dt', 'steps', 'tEnd', 'n', 'targets', 'spinDrift', 'coreDrift', 'nan', 'clamp', 'warnings',
  'framePrec', 'kFrameApplied', 'geoPNApplied', 'tp', 'stepsPerOrbit0'];
const canon = (v) => {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  if (typeof v === 'number' && !Number.isFinite(v)) return JSON.stringify(String(v));   // NaN・±Infinity を null に潰さない
  return JSON.stringify(v === undefined ? null : v);
};
/** 生の走行の署名(`RAW_RUN_KEYS` だけの正準 JSON の SHA-256 —— 決定的走行のビット一致の判定)。 */
export function rawRunSig(run) {
  if (!run) return null;
  const o = {};
  for (const k of RAW_RUN_KEYS) o[k] = run[k] === undefined ? null : run[k];
  return crypto.createHash('sha256').update(canon(o)).digest('hex');
}
/** 生の走行に非有限の量があるか(`RAW_KEYS` 等の抽出量 —— null は「未測定」なので非有限に数えない)。 */
export function rawNonFinite(run) {
  if (!run || !Array.isArray(run.targets)) return ['走行が無い'];
  const bad = [];
  for (const t of run.targets) for (const c of candOf(t)) if (typeof c.v === 'number' && !Number.isFinite(c.v)) bad.push(t.label + '.' + c.q);
  return bad;
}
export const H2_REUSE_RULE = {
  version: H2_REUSE_VERSION, since: '第284便c(原仮定者の裁定(第74報)⑥「dt/2 は前回と dt が一致したら省略を検討(特に同一便の再走行時)」)',
  contract: '受理後 preset(presetHash —— seed を含む宣言の全欄)・法則の指紋(engineSha〔閉包〕・lawsSha)・h と h/2・窓・停止則(版・步数上限)・'
    + '**窓の定義 window**(第285便f —— 目標物理時間 T の規則の版・T〔dt₀ での步数〕・軌道窓の出所・必要近点数)・'
    + '抽出器・単位(G・c・toSec)・kF0 の別。**必須鍵が 1 つでも欠けた契約・未知の版は拒否**',
  what: '前回の正本(診断の別ファイル tests/out/calaudit-w249-diag.json の `h2Store`)に同じ本・同じ契約の h と h/2 の組があり、'
    + '(a) **今回の h の生の走行が前回の h とビット一致**(`rawRunSig` —— 対象 ID と量の集合と値が同じ・有限。決定的走行の条件。'
    + '非決定的な走行の許容幅は未宣言 `H2_NONDET_TOL=null` —— 一致しなければ走らせる)'
    + '(b) 前回の h/2 が完了(非有限・NaN・安全クランプ・資源打切りなし)'
    + '(c) **同一便**(前回の走行と今回の対象 html の SHA-256 が同じ —— 便をまたぐ再利用は既定で行わない・`--h2-reuse-cross` で許す)'
    + 'なら h/2 を走らせずに**転記**する(`skippedBy:"reuse-dt2"`・元の走行 `reusedFrom:{generatedAt, targetSha256, contractSha, wallSec}`)。',
  firstRun: '**初回の正式較正では走らせる**(置き場が無い・版が違う・契約が違う・便が違う —— どれでも走らせる)。`--no-h2-reuse` で常に走らせる',
  processing: '転記するのは**生の走行**(page 側の抽出結果)で、判定幅・合否・門は**この走行の判定器で付け直す**',
  window: 'h/2 の窓が宣言の步数上限で埋まらない(`stopRule.complete` が false)ことは決定的な契約の結果なので転記を妨げない(h4 の転記は窓の完了を要る)',
  doNotWrite: ['h と h/2 が一致したので収束した', '再利用したので収束した', '試験が短くなった=数値が収束した'],
};
/**
 * dt/2 の再利用の可否。entry = 前回の `h2Store.entries[key]`({contract, hSig, run, generatedAt, targetSha256, wallSec})。
 * @param {{entry:object, contract:object, hRun:object, targetSha256:string, crossFlight?:boolean}} o
 * @returns {{reuse:boolean, reason:string|null, diff:string[]}}
 */
export function h2ReuseDecision(o) {
  const { entry, contract, hRun, targetSha256 } = o || {};
  if (!entry || !entry.run) return { reuse: false, reason: 'no-entry', diff: [] };
  const diff = h4ContractDiff(entry.contract, contract, { keys: H2_CONTRACT_KEYS, required: H2_REQUIRED_KEYS, versions: [H2_REUSE_VERSION] });
  if (diff.length) return { reuse: false, reason: 'contract', diff };
  if (!(o && o.crossFlight) && (!targetSha256 || entry.targetSha256 !== targetSha256)) return { reuse: false, reason: 'other-flight', diff: ['targetSha256'] };
  if (!hRun || hRun.nan) return { reuse: false, reason: 'h: NaN / 走行が無い', diff: [] };
  const nf = rawNonFinite(hRun);
  if (nf.length) return { reuse: false, reason: 'h: 非有限 ' + nf.slice(0, 3).join(','), diff: [] };
  const qs = rawQuantitySet(hRun);
  if (!qs || !qs.some((z) => z.qs.length)) return { reuse: false, reason: 'h: 有限の量が無い', diff: [] };
  const sig = rawRunSig(hRun);
  if (!entry.hSig || sig !== entry.hSig) return { reuse: false, reason: 'h-moved(生の走行がビット一致しない)', diff: ['hSig'] };
  const h = h4RunHealthy(entry.run, { requireWindow: false });
  if (!h.ok) return { reuse: false, reason: 'health: ' + h.why, diff: [] };
  const nf2 = rawNonFinite(entry.run);
  if (nf2.length) return { reuse: false, reason: 'health: 非有限 ' + nf2.slice(0, 3).join(','), diff: [] };
  return { reuse: true, reason: null, diff: [] };
}
/** 契約の hash(刻印用 —— 鍵の正準 JSON の SHA-256)。 */
export function contractSha(c) { return c ? crypto.createHash('sha256').update(canon(c)).digest('hex') : null; }
/** 転記した h/2 の生の走行(元の記録は書き換えない —— 深い写しに刻印を足す)。 */
export function reusedRunDt2(entry) {
  const r = JSON.parse(JSON.stringify(entry.run));
  const from = { generatedAt: entry.generatedAt || null, targetSha256: entry.targetSha256 || null,
    contractSha: contractSha(entry.contract), wallSec: isNum(entry.run.wallSec) ? entry.run.wallSec : null };
  r.skippedBy = 'reuse-dt2'; r.reusedFrom = from;
  if (r.timeBudget) Object.assign(r.timeBudget, { reused: true, skippedBy: 'reuse-dt2', reusedFrom: from });
  if (r.stopRule) Object.assign(r.stopRule, { skippedBy: 'reuse-dt2', reusedFrom: from });
  return r;
}

// 第323便d(決断事項 AN428 ①・統括の検証項目 R278): **較正の行の安定した id**(読込の互換)。
//
// ■ 何のためか
//   較正の判定器(tests/exp-w249b-calaudit.mjs)は、本の観測結果カード obsCard の行名 `q` を**量の名**としてそのまま使い、
//   器と lib と QA と html の表(観測の比較の行・ライブ比較の鍵)が**その文字列で**行を引いている。行名の一部には開発の回の語
//   (「第250便d」「AN51」「2026-08-25 裁定」など —— 以下「来歴の語」)が入っていて、画面では出す側(provTextClean)で外している。
//   来歴の語をデータから外す(AN428 ③)と、名前で引く読み手が全部切れる。そこで段階で移す:
//     ① 読込の互換(本 lib・本便): 読み手が「旧い名」と「新しい鍵(行の id)」の**両方**を読む。新しい鍵はまだデータに無いので、
//        旧い名から id を導く(下の表と関数)。判定器の正本の量の行には導いた id を `rowId` として書き足す(値は同じ)。
//     ② 検定器と QA を新しい鍵へ切り替える(html の表・受理器・QA の名前の照合)。
//     ③ データ(obsCard の行名)から来歴の語を外す —— 旧い名はこの表に別名として残す(過去の正本と凍結の写しは書き換えない)。
//   本 lib は**判定を持たない**(門・5 区分・4 値の台帳・残差に触れない)。
//
// ■ id の作り方(版 ROW_ID_VERSION)
//   (a) 行が新しい鍵 `rowId` を持てばそれ(source "key" —— ② / ③ の後のデータ)。
//   (b) 来歴の語を含む行名(在位と退役の較正の本の obsCard の q —— 第323便d の一覧の全部)は**下の表 LEGACY_ROW_IDS** の
//       読める id(source "legacy" —— 「本の id/英小文字の語」)。表は旧い名を別名として全部持つ(過去の改名〔第289便b の
//       宣言し直し〕の前の名も)。
//   (c) それ以外の行は、本の id と行名(改名の表で今の名へ寄せた後)の SHA-256 の先頭 12 桁から導く(source "derived" ——
//       「本の id/q-<12 桁>」)。来歴の語の無い名は ③ で変わらないので、この id も変わらない。後から入る本・行でも落ちない。
//   同じ本の中で id が重なれば(今は 0 —— QA lint.provenanceIds323)後ろの行に「~2」…を付ける(黙って同じ id にしない)。
import crypto from 'node:crypto';

export const ROW_ID_VERSION = 'w323d-rowids-1';
export const ROW_ID_FIELD = 'rowId';
export const ROW_ID_RULE = '(a) 行の鍵 rowId があればそれ(key)/(b) 来歴の語を含む行名は表 LEGACY_ROW_IDS の読める id(legacy —— 旧い名は別名として全部持つ)/'
  + '(c) それ以外は本の id と行名(改名の表で今の名へ寄せた後)の SHA-256 の先頭 12 桁(derived)。判定(門・5 区分・4 値)は読まない・変えない';

// 来歴の語を含む行名 → 安定した id。`ja` は判定器が量の名として読む文字列(行名そのまま —— 1 字も変えない)、
// `en` は表示の英語の行名(判定器は読まない —— 一覧の被覆のために持つ)。順は html の本の並びと行の順。
// `retired:true` は退役の本(判定器の母集団の外 —— 過去の正本と凍結の写しを読むために持つ)。
export const LEGACY_ROW_IDS = Object.freeze([
  { preset: 'emAuditDFM', retired: true, rowId: 'emAuditDFM/sidereal-month-periapsis', ja: ['恒星月・近点間(第250便d — 定義併記)'], en: ['Sidereal month — periapsis to periapsis (wave 250d)'] },
  { preset: 'emAuditDFM', retired: true, rowId: 'emAuditDFM/window-extension', ja: ['窓を延ばすと(第135便 実測)'], en: ['Stretching the window (wave-135 measurement)'] },
  { preset: 'emAuditDFM', retired: true, rowId: 'emAuditDFM/eccentricity-window', ja: ['離心率(第135便 実測)'], en: ['Eccentricity (wave-135 measurement)'] },
  { preset: 'mercuryReal', rowId: 'mercuryReal/perihelion-advance', ja: ['近日点前進(推定器つき宣言 — 第250便d)'], en: ['Perihelion advance (declared with its estimator — wave 250d)'] },
  { preset: 'mercuryRealKF1', retired: true, rowId: 'mercuryRealKF1/q3-control', ja: ['q=3 対照(第120便版)'], en: ['q=3 contrast (wave-120 version)'] },
  { preset: 'jupiterGalilean', rowId: 'jupiterGalilean/spin-dipole-q', ja: ['スピン双極子モーメント Q(第246便d)'], en: ['Spin-dipole moment Q (wave 246d)'] },
  { preset: 'plutoCharonReal', retired: true, rowId: 'plutoCharonReal/period-periapsis',
    ja: ['公転周期 近点間(第250便d)〔一本化後の宣言で再測・model 欄は旧宣言の記録〕', '公転周期(kFrame=1)近点間(第250便d)'],
    en: ['Orbital period — periapsis to periapsis (wave 250d) [re-measured as unified; model = old record]'] },
  { preset: 'plutoCharonDiagInput', rowId: 'plutoCharonDiagInput/pn1-source-set', ja: ['1PN の源集合の是正(第291便b)'], en: [] },
  { preset: 'uranusReal', rowId: 'uranusReal/uranus-spin', ja: ['天王星の自転(第196便: 面内符号+)'], en: [] },
  { preset: 'uranusReal', rowId: 'uranusReal/ring-mass', ja: ['環の質量(第192便)'], en: [] },
  { preset: 'neptuneReal', rowId: 'neptuneReal/orbit-direction', ja: ['公転の向き(第188便)'], en: [] },
  { preset: 'alphaCenAB', rowId: 'alphaCenAB/obs-stability-rule', ja: ['観測安定則(2026-08-25 裁定・適用第1号)'], en: [] },
  { preset: 'alphaCenAB', rowId: 'alphaCenAB/ab-measurement-side', ja: ['A/B 測定側(kFrame=1・第242便 pull 重み)'], en: [] },
  { preset: 'alphaCenAB', rowId: 'alphaCenAB/initial-phase', ja: ['初期位相(第211便 — 遠点整列)'], en: [] },
  { preset: 'siriusAB', rowId: 'siriusAB/two-body-closure', ja: ['二体クロージャ確認(第214便 新設)'], en: [] },
  { preset: 'siriusAB', rowId: 'siriusAB/ab-measurement-side', ja: ['A/B 測定側(kFrame=1・第242便 pull 重み)'], en: [] },
  { preset: 'siriusAB', rowId: 'siriusAB/initial-phase', ja: ['初期位相(第211便 — 遠点整列)'], en: [] },
  { preset: 'psrDoubleAB', rowId: 'psrDoubleAB/unit-family', ja: ['単位族(第220便 新設 → 第222便 経路拡張)'], en: [] },
  { preset: 'psrDoubleAB', rowId: 'psrDoubleAB/spin-1pn-couple', ja: ['スピンと 1PN 偶力(第223便 — 記帳化)'], en: [] },
  { preset: 'psrDoubleABDFM', retired: true, rowId: 'psrDoubleABDFM/drag-independent', ja: ['**引きずり非依存**(AN51)'], en: [] },
  { preset: 'psrJ1757DFM', rowId: 'psrJ1757DFM/dfm-mass', ja: ['DFM 質量(第285便f — f=1: 観測質量そのもの)'], en: [] },
  { preset: 'psrJ1757DFM', rowId: 'psrJ1757DFM/couple-sink', ja: ['偶力の受け皿(第285便f — 補正コアを外した)'], en: [] },
  { preset: 'psrJ1757DFM', rowId: 'psrJ1757DFM/drag-independent', ja: ['**引きずり非依存**(AN51)'], en: [] },
  { preset: 'psrJ1757DFM', rowId: 'psrJ1757DFM/legacy-ledger', ja: ['旧台帳の記録(第248〜284便 — **履歴**)'], en: [] },
  { preset: 'psrJ1946DFM', rowId: 'psrJ1946DFM/dfm-mass', ja: ['DFM 質量(第286便f — f=1: 観測質量そのもの)'], en: [] },
  { preset: 'psrJ1946DFM', rowId: 'psrJ1946DFM/couple-sink', ja: ['偶力の受け皿(第286便f — 補正コアを外した)'], en: [] },
  { preset: 'psrJ1946DFM', rowId: 'psrJ1946DFM/drag-independent', ja: ['**引きずり非依存**(AN51・AN57)'], en: [] },
  { preset: 'psrJ1946DFM', rowId: 'psrJ1946DFM/legacy-ledger', ja: ['旧台帳の記録(第248〜285便 — **履歴**)'], en: [] },
  { preset: 'gw150914', rowId: 'gw150914/unit-family', ja: ['単位族(第223便 新設 — 3例目)'], en: [] },
  { preset: 'gw150914', rowId: 'gw150914/conversion-rule', ja: ['換算整合則(geoPN=0 採用 — 第223便)'], en: [] },
  { preset: 'saturnZonalD68', rowId: 'saturnZonalD68/periapsis-precession', ja: ['D68 リングレットの近点移動(推定器つき宣言 — 第250便d)'], en: [] },
  { preset: 'saturnZonalD68', rowId: 'saturnZonalD68/period-periapsis', ja: ['D68 の公転周期・近点間(第250便d)'], en: [] },
  { preset: 'saturnZonalD68', rowId: 'saturnZonalD68/fail-cause', ja: ['否の要因(第280便e の診断・履歴)'], en: [] },
].map((z) => Object.freeze(Object.assign({}, z, { ja: Object.freeze(z.ja.slice()), en: Object.freeze(z.en.slice()) }))));

const LEGACY_BY_NAME = new Map();
for (const z of LEGACY_ROW_IDS) for (const n of z.ja) LEGACY_BY_NAME.set(z.preset + '\u0000' + n, z.rowId);
const LEGACY_BY_ID = new Map(LEGACY_ROW_IDS.map((z) => [z.rowId, z]));

/** 来歴の語を含む旧い行名(ja)から表の id を引く(無ければ null)。 */
export function legacyRowIdOf(presetId, name) {
  return LEGACY_BY_NAME.get(String(presetId) + '\u0000' + String(name)) || null;
}
/** 表の行(id から)。 */
export function legacyEntryOf(rowId) { return LEGACY_BY_ID.get(rowId) || null; }

/**
 * 改名の表(過去の宣言し直し —— tests/data-w289b-condrows.json の nameBefore → nameAfter と qBefore → qAfter)を
 * 「本の id + 旧い名 → 今の名」の写像にする。表を渡さなければ空(寄せない)。
 */
export function renameMapOf(condrows) {
  const m = new Map();
  const put = (id, a, b) => { if (id && a && b && a !== b) m.set(String(id) + '\u0000' + a, b); };
  for (const r of ((condrows && condrows.rows) || [])) put(r.id, r.qBefore, r.qAfter);
  for (const r of ((condrows && condrows.quantities) || [])) put(r.id, r.nameBefore, r.nameAfter);
  return m;
}

/** 来歴の語の無い行の id(本の id と、今の名へ寄せた行名から)。 */
export function derivedRowIdOf(presetId, name, renames) {
  let n = String(name == null ? '' : name);
  const to = renames && renames.get(String(presetId) + '\u0000' + n);
  if (to) n = to;
  return String(presetId) + '/q-' + crypto.createHash('sha256').update(String(presetId) + '\u0000' + n).digest('hex').slice(0, 12);
}

/**
 * 行の安定した id を導く(読込の互換 —— 新しい鍵と旧い名の両方を読む)。
 * @param {string} presetId
 * @param {object|string} row  量の行(`rowId`・`name`)・obsCard の行(`rowId`・`q`)・または行名の文字列
 * @param {{renames?: Map}} [opt]
 * @returns {{id: string, source: 'key'|'legacy'|'derived', name: string}}
 */
export function rowIdOf(presetId, row, opt) {
  const o = opt || {};
  if (row && typeof row === 'object' && typeof row[ROW_ID_FIELD] === 'string' && row[ROW_ID_FIELD]) {
    return { id: row[ROW_ID_FIELD], source: 'key', name: String(row.name != null ? row.name : (row.q != null ? row.q : '')) };
  }
  const name = typeof row === 'string' ? row : String((row && (row.name != null ? row.name : row.q)) || '');
  const renamed = (o.renames && o.renames.get(String(presetId) + '\u0000' + name)) || name;
  const lg = legacyRowIdOf(presetId, name) || legacyRowIdOf(presetId, renamed);
  if (lg) return { id: lg, source: 'legacy', name };
  return { id: derivedRowIdOf(presetId, renamed), source: 'derived', name };
}

/**
 * 判定器の行の測定定義の表(tests/exp-w249b-calaudit.mjs の ROW_MEASUREMENT_DEF —— 本の id + 行名の部分一致 `match`)の行の id。
 * 宣言の object には足さない(宣言は写像の指紋と正本の periodContract に入る —— 足すと h/4 の転記の契約が動く)ので、ここに別に持つ。
 * 🌘 earthMoonRealKF1 の宣言(match「近点間(第250便d — 定義併記)」)は今の行名に当たらない(第316便b で表示の文から来歴の語が外れた —— 原理の本で
 * 母集団の外)ので id を持たない(挙動を変えない)。
 */
export const ROW_DEF_ROW_IDS = Object.freeze([
  Object.freeze({ preset: 'plutoCharonReal', match: '近点間(第250便d)', rowId: 'plutoCharonReal/period-periapsis' }),
  Object.freeze({ preset: 'saturnZonalD68', match: '近点間(第250便d)', rowId: 'saturnZonalD68/period-periapsis' }),
  Object.freeze({ preset: 'emAuditDFM', match: '近点間(第250便d — 定義併記)', rowId: 'emAuditDFM/sidereal-month-periapsis' }),
]);
export function rowDefRowIdOf(presetId, match) {
  const z = ROW_DEF_ROW_IDS.find((e) => e.preset === presetId && e.match === match);
  return z ? z.rowId : null;
}

/**
 * 読み手の照合(互換): 宣言 `want` が `rowId` を持てば id で、`match`(部分一致)/`name`(完全一致)を持てば名前で。
 * どちらかが合えば真(① では両方が同じ行を指す —— QA lint.provenanceIds323 が器の宣言で確かめる)。
 */
export function rowMatches(presetId, row, want, opt) {
  if (!want) return false;
  const name = typeof row === 'string' ? row : String((row && (row.name != null ? row.name : row.q)) || '');
  if (want.rowId && rowIdOf(presetId, row, opt).id === want.rowId) return true;
  if (typeof want.match === 'string' && want.match && name.indexOf(want.match) >= 0) return true;
  if (typeof want.name === 'string' && want.name && name === want.name) return true;
  return false;
}

/**
 * 判定器の正本(または過去の正本の形)の全ての量の行に `rowId` を書き足す(値は同じ —— 行の他の欄は読まない・変えない)。
 * 出どころの数(bySource)は**行名から導いた id**で数える(--merge で持ち越した行は前の走行が付けた `rowId` を持つ —— 名から導いた id と
 * 同じなら名の出どころ〔legacy/derived〕に数え、違えば key〔② / ③ の後の新しい鍵〕に数えて鍵のほうを残す)。鎖の 3 段(① 通常・dt3・kf0 の --merge)で
 * 同じ要約になる。同じ本の中で重なれば「~2」…を付けて重なりの一覧に残す。
 * @returns {{version, n, bySource:{key,legacy,derived}, legacy: Array<{preset,rowId,name}>, duplicates: Array<{preset,rowId}>}}
 */
export function attachRowIds(out, opt) {
  const sum = { version: ROW_ID_VERSION, n: 0, bySource: { key: 0, legacy: 0, derived: 0 }, legacy: [], duplicates: [] };
  for (const p of ((out && out.presets) || [])) {
    const seen = new Map();
    for (const q of (p.quantities || [])) {
      const had = (typeof q[ROW_ID_FIELD] === 'string' && q[ROW_ID_FIELD]) ? q[ROW_ID_FIELD].replace(/~\d+$/, '') : null;
      const byName = rowIdOf(p.id, Object.assign({}, q, { [ROW_ID_FIELD]: undefined }), opt);
      const r = (had && had !== byName.id) ? { id: had, source: 'key', name: byName.name } : byName;
      let id = r.id;
      if (seen.has(id)) { const k = seen.get(id) + 1; seen.set(id, k); sum.duplicates.push({ preset: p.id, rowId: id }); id = id + '~' + k; }
      else seen.set(id, 1);
      q[ROW_ID_FIELD] = id;
      sum.n++; sum.bySource[r.source]++;
      if (r.source === 'legacy') sum.legacy.push({ preset: p.id, rowId: id, name: r.name });
    }
  }
  return sum;
}

/** 正本の量の行から `rowId` を外した写し(前後の照合用 —— 足した欄の外が同じかを見る)。 */
export function withoutRowIds(out) {
  const c = JSON.parse(JSON.stringify(out));
  for (const p of (c.presets || [])) for (const q of (p.quantities || [])) delete q[ROW_ID_FIELD];
  delete c.rowIds;
  return c;
}

/**
 * h/4 の例外の登録簿(tests/lib-w283c-calstages.mjs の H4_EXCEPTIONS)の照合の互換: `isH4Exception` と同じ 4 つ(本・経路・門の鍵・名前)の一致に、
 * 名前の代わりに行の id の一致も認める(登録簿の行が `rowId` を持てばそれ、無ければ登録簿の名前から導く)。
 * 登録簿の lib は再生成の表が import する(変えると鎖の多くの段の閉包が動く)ので、互換はこの lib の側に置く。
 */
export function h4ExceptionCompat(exceptions, presetId, pathName, gateKey, name, opt) {
  const want = rowIdOf(presetId, name, opt).id;
  return (exceptions || []).some((z) => z.preset === presetId && z.path === pathName && z.gateKey === gateKey
    && (z.name === name || rowIdOf(z.preset, z.rowId ? z : z.name, opt).id === want));
}

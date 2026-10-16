// 第306便a(原仮定者の裁定〔第97報〕AN336「水星の標的を 1PN + A1 に替える」・統括の検証項目 R204)——
// **派生した参照値の生成器と契約**(純関数 + 観測の記録 CSV の読み取り —— html は読まない・エンジンは走らせない)。
//
// ■ 何を作るか
//   q⋆ = q_1PN(本の初期の接触要素 a₀・e₀・ケプラー周期 P_K から作る二体の 1PN の近点の式 6πG(M+m)/(c₀²a(1−e²)) —— tests/exp-w303b-inertialr2.mjs の pn1Formula と同じ式)
//      + A1(EPM2011 の近日点の追加の歳差 —— 候補の行 paper/data/pn1-ephemeris-candidates.csv の記録 ID で引き、照合の記録 paper/data/pn1-primary-audit-20261015.csv と突き合わせる)。
//   水星は記録 OBS-30d6c60e(−0.002″/世紀)で q⋆ = 42.98051038206748 − 0.002 = 42.978510382067476″/世紀。
//   **派生した参照値**(独立に観測された総量ではない): sigma は null・原資料の幅 sourceWidth(68% の 1σ の定義は未確認 —— sigma68Verified false)・
//   数値フィットの停止許容 numericTolerance 0.0009(kind declared —— 旧い宣言の許容を数値の許容として継承。A1 の幅でも和の統計誤差でもない)・
//   照合規約 43.0 は履歴の列 legacyComparison として残す・calibrationEligible false(観測の較正の合格とは別)。
//   6 本(金星・火星・木星・土星は A1 の行を記録 ID で引く・天王星/海王星は A1 の行が無いので 1PN の式だけ —— 幅なし)も同じ形で作る(移送の比較の標的)。
//
// ■ 契約(変わったら止まる —— 例外を投げる)
//   ・候補の行の列(11 列)と照合の記録の列(16 列)が今の形・記録 ID の行が両方の CSV にちょうど 1 行ずつ(重複・欠落は止まる)
//   ・候補の行: body・quantity(*_candidate)・unit(arcsec/cy)・値が空でない有限数・sigma 欄は空(無断の記入は止まる)・注記の item=A1-EPM2011・sigma_primary=unverified・sigma_source
//   ・照合の記録: candidate_file・body・quantity・unit・candidate_value(文字列で同じ)・candidate_sigma_source(注記の sigma_source と同じ)・
//     primary_numeric_verified=true・sigma68_verified=false(旗が変わったら止まる)
//   ・水星は値・幅・旗を固定の契約 MERCURY_CONTRACT とも照合する
//
// ■ 言わないこと
//   ・「観測の 1σ で較正済み」「43″ が出た」—— 参照値は派生した値で、σ を作らない。幅の比を「σ」と呼ばない(「原資料の幅の倍」)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const LIB_VERSION = 'w306a-an336-1';
export const CANDIDATE_FILE = 'paper/data/pn1-ephemeris-candidates.csv';
export const AUDIT_FILE = 'paper/data/pn1-primary-audit-20261015.csv';
export const CANDIDATE_COLS = Object.freeze(['body', 'quantity', 'value', 'unit', 'source', 'url', 'retrieved', 'note', 'sigma', 'record_id', 'solution_id']);
export const AUDIT_COLS = Object.freeze(['record_id', 'candidate_file', 'body', 'quantity', 'candidate_value', 'candidate_sigma_source', 'unit', 'primary_source', 'primary_locator',
  'primary_printed', 'conversion', 'primary_numeric_verified', 'sigma68_verified', 'audit_origin', 'audit_date', 'note']);
export const QUANTITY = 'perihelion_precession_extra_candidate';
export const UNIT_CSV = 'arcsec/cy';
export const UNIT = '″/世紀';
/** 惑星 → A1 の記録 ID(EPM2011 —— 照合の記録の 6 行のうち地球を除く 4 本 + 水星)。天王星・海王星は行が無い(1PN の式だけ)。 */
export const A1_RECORD_IDS = Object.freeze({ mercury: 'OBS-30d6c60e', venus: 'OBS-ffbb5e08', mars: 'OBS-865bce87', jupiter: 'OBS-7f3c18db', saturn: 'OBS-b28b0f6e', uranus: null, neptune: null });
export const BODY_EN = Object.freeze({ mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune' });
/** 水星の固定の契約(第97報の裁定の定義 —— 値・幅・旗が CSV から変わったら止まる)。 */
export const MERCURY_CONTRACT = Object.freeze({ recordId: 'OBS-30d6c60e', body: 'Mercury', value: -0.002, sourceWidth: 0.003, primaryNumericVerified: true, sigma68Verified: false,
  expected: 42.978510382067476, expectedTol: 1e-12 });
/** 数値フィットの停止許容(宣言 —— 旧い宣言の許容 0.0009 を数値の許容として継承)。 */
export const NUMERIC_TOL = Object.freeze({ value: 0.0009, kind: 'declared',
  note: '数値フィットの停止許容(宣言)—— 旧い宣言の照合許容 0.0009″/世紀を数値の許容として継承した。A1 の幅でも和の統計誤差でもない' });
export const LEGACY_COMPARISON = 43;
export const FORMULA = 'q⋆ = q_1PN(初期の接触要素 a₀・e₀・ケプラー周期 P_K —— 6πG(M+m)/(c₀²a(1−e²)) を ″/世紀へ)+ A1(EPM2011 の近日点の追加の歳差 —— 記録 ID で引く)';
export const PN1_FORMULA_VERSION = 'w303b-pn1Formula(二体・初期の接触要素・ケプラー周期で ″/世紀へ換算)';
const ARCSEC = 180 * 3600 / Math.PI;

/** CSV の 1 行(二重引用の欄を許す —— lib-w270b-obscsv の parseCsvLine と同じ規則)。 */
export function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur); return cols;
}
function parseCsv(txt, cols, file) {
  const ls = txt.split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim());
  if (!ls.length) throw new Error('AN336 契約: ' + file + ' が空');
  const h = parseCsvLine(ls[0]).map((x) => x.trim());
  if (JSON.stringify(h) !== JSON.stringify(cols)) throw new Error('AN336 契約: ' + file + ' の列が変わった(' + h.join(',') + ')');
  return ls.slice(1).map((l, i) => { const c = parseCsvLine(l); if (c.length !== cols.length) throw new Error('AN336 契約: ' + file + ' の ' + (i + 2) + ' 行目の列の数 ' + c.length);
    const o = {}; cols.forEach((k, j) => { o[k] = c[j]; }); return o; });
}
const noteKey = (note, k) => { const m = new RegExp('(?:^|; )' + k + '=([^;]*)').exec(note || ''); return m ? m[1].trim() : null; };
export const sha256Of = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
/** 2 つの CSV を読む(root はリポジトリの根 —— 契約の器は一時の写しの根を渡す)。 */
export function readRecords(root) {
  const cf = path.join(root, CANDIDATE_FILE), af = path.join(root, AUDIT_FILE);
  const C = parseCsv(fs.readFileSync(cf, 'utf8'), CANDIDATE_COLS, CANDIDATE_FILE), A = parseCsv(fs.readFileSync(af, 'utf8'), AUDIT_COLS, AUDIT_FILE);
  return { C, A, inputs: [{ file: CANDIDATE_FILE, sha256: sha256Of(cf) }, { file: AUDIT_FILE, sha256: sha256Of(af) }] };
}
/** 記録 ID の A1 の行を両方の CSV から一意に引いて照合する(契約に合わなければ投げる)。 */
export function a1Of(recs, recordId, bodyEn) {
  const cs = recs.C.filter((r) => r.record_id === recordId), as = recs.A.filter((r) => r.record_id === recordId);
  if (cs.length !== 1) throw new Error('AN336 契約: 候補の行に記録 ' + recordId + ' が ' + cs.length + ' 行(ちょうど 1 行が要る)');
  if (as.length !== 1) throw new Error('AN336 契約: 照合の記録に記録 ' + recordId + ' が ' + as.length + ' 行(ちょうど 1 行が要る)');
  const c = cs[0], a = as[0], tag = recordId + '(' + bodyEn + ')';
  if (c.body !== bodyEn || a.body !== bodyEn) throw new Error('AN336 契約: ' + tag + ' の body が ' + c.body + '/' + a.body);
  if (c.quantity !== QUANTITY || a.quantity !== QUANTITY) throw new Error('AN336 契約: ' + tag + ' の quantity が ' + c.quantity + '/' + a.quantity);
  if (c.unit !== UNIT_CSV || a.unit !== UNIT_CSV) throw new Error('AN336 契約: ' + tag + ' の単位が ' + c.unit + '/' + a.unit + '(' + UNIT_CSV + ' が要る)');
  if (String(c.value).trim() === '' || !Number.isFinite(Number(c.value))) throw new Error('AN336 契約: ' + tag + ' の値が空か数でない');
  if (String(c.sigma || '').trim() !== '') throw new Error('AN336 契約: ' + tag + ' の候補の行の sigma 欄に記入がある(候補の行は空のまま —— 幅は注記の sigma_source)');
  if (noteKey(c.note, 'item') !== 'A1-EPM2011') throw new Error('AN336 契約: ' + tag + ' の注記の item が A1-EPM2011 でない');
  if (noteKey(c.note, 'sigma_primary') !== 'unverified') throw new Error('AN336 契約: ' + tag + ' の注記の sigma_primary が unverified でない');
  const sw = noteKey(c.note, 'sigma_source');
  if (sw === null || !Number.isFinite(Number(sw)) || !(Number(sw) > 0)) throw new Error('AN336 契約: ' + tag + ' の注記の sigma_source が正の数でない');
  if (a.candidate_file !== CANDIDATE_FILE) throw new Error('AN336 契約: ' + tag + ' の照合の記録の candidate_file が ' + a.candidate_file);
  if (a.candidate_value !== c.value) throw new Error('AN336 契約: ' + tag + ' の照合の記録の値 ' + a.candidate_value + ' が候補の行の値 ' + c.value + ' と違う');
  if (a.candidate_sigma_source !== sw) throw new Error('AN336 契約: ' + tag + ' の照合の記録の幅 ' + a.candidate_sigma_source + ' が候補の行の sigma_source ' + sw + ' と違う');
  if (a.primary_numeric_verified !== 'true') throw new Error('AN336 契約: ' + tag + ' の primary_numeric_verified が true でない(' + a.primary_numeric_verified + ')');
  if (a.sigma68_verified !== 'false') throw new Error('AN336 契約: ' + tag + ' の sigma68_verified が false でない(' + a.sigma68_verified + ' —— 旗が変わった: 契約を見直すまで止める)');
  return { recordId, value: Number(c.value), sourceWidth: Number(sw), primaryNumericVerified: true, sigma68Verified: false, source: c.source, locator: a.primary_locator,
    primarySource: a.primary_source, printed: a.primary_printed, conversion: a.conversion, auditDate: a.audit_date };
}
/** 本の初期の接触要素からの二体の 1PN の近点の式(″/世紀)—— exp-w303b-inertialr2 の pn1Formula と同じ式(器から import しない —— この lib は純関数で html を読まない)。 */
export function pn1Of(p) {
  const B = p.bodies, G = p.physics.G, c = p.physics.cLight, mu = G * (B[0].m + B[1].m);
  const rv = [B[1].x - B[0].x, B[1].y - B[0].y, (B[1].z || 0) - (B[0].z || 0)], vv = [B[1].vx - B[0].vx, B[1].vy - B[0].vy, (B[1].vz || 0) - (B[0].vz || 0)];
  const r = Math.hypot(...rv), v2 = vv[0] ** 2 + vv[1] ** 2 + vv[2] ** 2, a = 1 / (2 / r - v2 / mu);
  const L = [rv[1] * vv[2] - rv[2] * vv[1], rv[2] * vv[0] - rv[0] * vv[2], rv[0] * vv[1] - rv[1] * vv[0]], h2 = L[0] ** 2 + L[1] ** 2 + L[2] ** 2;
  const e = Math.sqrt(Math.max(0, 1 - h2 / (mu * a))), P = 2 * Math.PI * Math.sqrt(a ** 3 / mu);
  const T = Math.pow(10, p.scaleExp.T), century = 36525 * 86400 / T;
  const value = 6 * Math.PI * mu / (c * c * a * (1 - e * e)) * century / P * ARCSEC;
  return { value, a, e, P, G, c0: c, masses: [B[0].m, B[1].m], scaleExp: Object.assign({}, p.scaleExp), formulaVersion: PN1_FORMULA_VERSION };
}
/** 惑星の鍵(本の ID から —— lib-w299c-planets3d の PLANETS と同じ並び)。 */
export const KEY_OF = Object.freeze({ mercurySunInertial3d: 'mercury', venusSunInertial3d: 'venus', marsSunInertial3d: 'mars', jupiterSunInertial3d: 'jupiter',
  saturnSunInertial3d: 'saturn', uranusSunInertial3d: 'uranus', neptuneSunInertial3d: 'neptune' });
/** 1 本の派生した参照値(p は本の宣言 —— 初期状態を固定した写しを渡す)。recs を渡さなければ root から読む。 */
export function targetOfBook(root, p, recs) {
  const R = recs || readRecords(root), key = KEY_OF[p.id];
  if (!key) throw new Error('AN336: 惑星の本でない ' + p.id);
  const id = A1_RECORD_IDS[key], pn1 = pn1Of(p), a1 = id ? a1Of(R, id, BODY_EN[key]) : null;
  return { kind: 'derived-reference', id: p.id, key, value: pn1.value + (a1 ? a1.value : 0), unit: UNIT, formula: a1 ? FORMULA : 'q⋆ = q_1PN(初期の接触要素 —— A1 の行なし: 1PN の式だけ・幅なし)',
    pn1, a1, inputs: R.inputs, sigma: null, sourceWidth: a1 ? a1.sourceWidth : null, calibrationEligible: false, numericTolerance: Object.assign({}, NUMERIC_TOL),
    legacyComparison: key === 'mercury' ? LEGACY_COMPARISON : null, libVersion: LIB_VERSION };
}
/** 水星の標的(第97報の定義 —— 固定の契約 MERCURY_CONTRACT とも照合する)。p は 🌡️ の宣言(初期状態の写し)。 */
export function an336Target(root, p, recs) {
  if (p.id !== 'mercurySunInertial3d') throw new Error('AN336: 水星の本でない ' + p.id);
  const t = targetOfBook(root, p, recs), M = MERCURY_CONTRACT;
  if (t.a1.recordId !== M.recordId || t.a1.value !== M.value || t.a1.sourceWidth !== M.sourceWidth || t.a1.primaryNumericVerified !== M.primaryNumericVerified || t.a1.sigma68Verified !== M.sigma68Verified)
    throw new Error('AN336 契約: 水星の A1 が裁定の定義(' + M.recordId + '・' + M.value + '・幅 ' + M.sourceWidth + ')と違う');
  if (!(Math.abs(t.value - M.expected) <= M.expectedTol)) throw new Error('AN336 契約: 水星の q⋆ ' + t.value + ' が ' + M.expected + ' と 1e-12 で合わない(初期状態か式が変わった)');
  return t;
}
/** 7 本の参照値(ps は本の宣言の配列 —— 水星を先頭に)。 */
export function an336Targets(root, ps) {
  const R = readRecords(root);
  return ps.map((p) => (p.id === 'mercurySunInertial3d' ? an336Target(root, p, R) : targetOfBook(root, p, R)));
}

/* ── 第306便a の世代の生成器(在位の惑星 7 本の宣言 —— tests/lib-w299c-planets3d.mjs の planetDecl3 の写しに AN336 の引きずりと G_loc を当てる) ──
 * planetDecl3 の本体(第299便c の世代 —— 歴史の器が読む)は変えない(その lib を meta.code に持つ器の領域を動かさない)。
 * 宣言: physics.relativeDrag = {law:"inertial", Wbg:W_ext, eps, history:"positions", pairs, inertialR2:{lambdaRs:k, sources:"all", denom:"pair"}}・physics.gLoc = {law:"kappaC2"}
 * (自己の項・dragCore・shellSelf は入れない)。k と W_ext は正本 tests/out/an336-w306a.json の declaration から渡す。 */
export async function planetDecl306(HP, key, o) {
  const P3 = await import('./lib-w299c-planets3d.mjs');
  if (!o || !(typeof o.k === 'number' && o.k > 0) || !(typeof o.Wbg === 'number' && o.Wbg > 0)) throw new Error('planetDecl306: {k, Wbg} が要る');
  const d = P3.planetDecl3(HP, key, { gain: 0 }), rd0 = d.physics.relativeDrag;
  d.physics.relativeDrag = { law: 'inertial', Wbg: o.Wbg, eps: rd0.eps, history: 'positions', pairs: rd0.pairs, inertialR2: { lambdaRs: o.k, sources: 'all', denom: 'pair' } };
  d.physics.gLoc = { law: 'kappaC2' };
  d.gen = 'w306a';
  return d;
}

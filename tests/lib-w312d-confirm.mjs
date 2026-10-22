// 第312便d(原仮定者の裁定(第114報)「水星、金星、火星で絞り込んだ候補を、木星、『太陽と地球と月』で確認する」・決断事項 AN398〔軌道に依る R_d を天体の性質として採らない〕・
// AN396〔数値の門と採用の欄〕・AN336〔標的 1PN + A1〕・統括の検証項目 R233):
// **確認の器の純関数**(html を読まない —— 本の写しは HP を引数で受ける)。器は tests/exp-w312d-confirm.mjs。
//
// ■ 何をするか
//   ・候補の**規則**: 3 惑星(水星・金星・火星)の探索の値(tests/out/planet3-w311d.json —— 区間の割線があればそれ・無ければ段 S の一次の見積り)から比を作り、
//     木星・地球・月へ**同じ式で** R_d を置く。型は rdOverR(R_d/R が一定)・rdOverM(R_d/m が一定 [m/kg])・rd2OverMp(R_d²/(m p) が一定 [m/kg] —— p は軌道の半直弦)・
//     explicit(天体ごとの R_d [m] —— 比較の口)。**1 つの天体に 1 つの宣言**(相手ごとに R_d を変えない)。**確認の系では合わせない**(規則で置いて残差を測るだけ)。
//   ・受理の目安: 0 < R_d ≤ min(観測半径, 6.5×10⁶ m)(cap6500km —— AN363)。超える R_d は「拒否」と記録して走らせない。
//   ・p の定まり方: 木星・地球は太陽のまわりの接触の半直弦(地球は地球–月の重心の公転)。**月は 2 つの p**(地球のまわり・太陽のまわり〔地球–月の重心の公転〕)
//     を持ち、軌道に依る規則(rd2OverMp)は 1 つの天体に 1 つの宣言の規則では定まらない —— moonP で選ぶ(既定なし —— 規則に書く)。
//   ・標的: 🏀 木星は AN336 の 1PN + A1(tests/lib-w306a-an336.mjs の targetOfBook —— 外部の数を写さない)。地球は AN336 に行が無い(A1 の記録 ID が無い)ので、
//     **同じ生成器の 1PN の式の値だけ**を「1PN だけの数値の参照」とする(地球–月の重心の初期の接触要素 —— 二体の式)。
//
// ■ v2(第313便d —— 原仮定者の裁定(第115報)AN399・AN402・決断事項 AN401・AN405・統括の検証項目 R237)
//   ・全天体の規則 {type:"kappa0"}(K1 の写しだけ): 太陽を含む全天体に R_d = κ₀m(κ₀ = 10G/(C₁c²) —— 本の G・c と C₁ の閉じた式で固定・合わせない)。
//   ・受理の目安から cap を外す(0 < R_d ≤ 観測半径だけ —— K1 は cap を見ない・宣言した K2 は超えてよい)。第312便の世代の判定は capM を渡したときだけ(QA の世代切替)。
//   ・標的の列: q_1PN・A1 の暦表ごとの列(EPM2011 は照合の記録つき・INPOP10a は候補の行 —— 符号を反転しない・幅の種類を 1σ に統合しない)・
//     有限質量比の予測 (4/3)η q_1PN(既知の寄与 —— AN405)・G の値の列(本の G と CODATA 6.67430 の相対差 —— 感度)。小さい係数の分解の表の純関数。
//
// ■ しないこと: エンジンの式を写さない・合わせない(規則の k を確認の系で動かさない)・探索の値を在位へ入れない・「確認した」は規則で置いた残差が数値の門の内のときだけ。
import * as AN from './lib-w306a-an336.mjs';
import * as Q from './lib-w311d-planet3.mjs';
export const LIB_VERSION = 'w313d-confirm-lib-2';
export const CAP_M = Q.CAP_M;
/** 確認の系(器の --system の鍵) */
export const SYSTEMS = Object.freeze([
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '木星', bodies: Object.freeze(['sun', 'jupiter']) }),
  Object.freeze({ key: 'earthmoon', id: 'earthMoonSunInertial3d', emoji: '🌦️', ja: '太陽と地球と月', bodies: Object.freeze(['sun', 'earth', 'moon']) }),
]);
export const systemOf = (k) => SYSTEMS.find((s) => s.key === k || s.id === k) || null;
export const RULE_TYPES = Object.freeze(['rdOverR', 'rdOverM', 'rd2OverMp', 'explicit', 'kappa0']);
export const MOON_P = Object.freeze(['earth', 'sun']);
/** 規則の受理(k は正の有限数・rd2OverMp は月の p の選び方 moonP を書く・explicit は天体ごとの R_d [m]) */
export function checkRule(r) {
  if (!r || typeof r !== 'object' || Array.isArray(r)) return '--rule は {type, k?, moonP?, Rd?}';
  if (!RULE_TYPES.includes(r.type)) return '--rule の type は ' + RULE_TYPES.join('|');
  if (r.type === 'kappa0') { for (const k of Object.keys(r)) if (k !== 'type') return '--rule kappa0 は鍵 type だけ(κ₀ は閉じた式で固定 —— 上書きしない)'; return null; }
  for (const k of Object.keys(r)) if (!['type', 'k', 'moonP', 'Rd', 'src'].includes(k)) return '--rule に未知の鍵 ' + k;
  if (r.type === 'explicit') {
    if (!r.Rd || typeof r.Rd !== 'object') return 'explicit は Rd:{jupiter?, earth?, moon?}(m)';
    for (const [b, v] of Object.entries(r.Rd)) if (!['jupiter', 'earth', 'moon'].includes(b) || !(Number.isFinite(v) && v > 0)) return 'explicit の Rd.' + b + ' は正の有限数(m)';
    return null;
  }
  if (r.k !== undefined && !(Number.isFinite(r.k) && r.k > 0)) return '--rule の k は正の有限数(省略は 3 惑星の平均)';
  if (r.moonP !== undefined && !MOON_P.includes(r.moonP)) return '--rule の moonP は ' + MOON_P.join('|');
  return null;
}
/** k を省いた規則に 3 惑星の平均を入れる(table = ruleTable の出力 —— 6 桁) */
export const fillRule = (r, table) => (r.type === 'explicit' || r.type === 'kappa0' || Number.isFinite(r.k)) ? r : Object.assign({}, r, { k: Number(table[r.type].mean.toPrecision(6)) });
export const ruleKey = (r) => r.type === 'kappa0' ? 'kappa0' : (r.type === 'explicit' ? 'explicit:' + JSON.stringify(r.Rd) : r.type + ':' + Number(r.k).toPrecision(6) + (r.moonP ? ':moonP=' + r.moonP : ''));

/* ───────── 軌道の半直弦(接触の要素 —— 位置・速度は SI)───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export function oscOf(r, v, mu) {
  const rn = Math.hypot(...r), v2 = dot(v, v), a = 1 / (2 / rn - v2 / mu), h = cross(r, v), h2 = dot(h, h), p = h2 / mu, e = Math.sqrt(Math.max(0, 1 - p / a));
  return { a, e, p, r: rn };
}
/** 本の天体(本の単位)→ SI の位置・速度・質量 */
export function siOf(p) {
  const L = Math.pow(10, p.scaleExp.L), T = Math.pow(10, p.scaleExp.T), M = Math.pow(10, p.scaleExp.M), G = p.physics.G * L ** 3 / (M * T * T);
  const B = p.bodies.map((b) => ({ x: [b.x * L, b.y * L, (b.z || 0) * L], v: [b.vx * L / T, b.vy * L / T, (b.vz || 0) * L / T], m: b.m * M, R: b.radius * L }));
  return { L, T, M, G, B };
}
/** 地球–月の重心(EMB)の二体の見方(AN336 の生成器 pn1Of に渡す —— 太陽と EMB の 2 体の本) */
export function embView(p) {
  const [S, E, Mo] = p.bodies, mt = E.m + Mo.m, f = (k) => (E.m * (E[k] || 0) + Mo.m * (Mo[k] || 0)) / mt;
  return { id: p.id + '#emb', physics: p.physics, scaleExp: p.scaleExp, bodies: [S, { m: mt, x: f('x'), y: f('y'), z: f('z'), vx: f('vx'), vy: f('vy'), vz: f('vz') }] };
}
/** 天体の性質(質量・観測半径・p の候補)—— sys の写し p から */
export function bodyProps(sysKey, p) {
  const U = siOf(p), B = U.B;
  const k0 = Q.kappa0SI(p);   // v2: κ₀ [m/kg](本の G・c —— 全天体の規則)
  if (sysKey === 'jupiter') {
    const r = B[1].x.map((x, i) => x - B[0].x[i]), v = B[1].v.map((x, i) => x - B[0].v[i]), o = oscOf(r, v, U.G * (B[0].m + B[1].m));
    return { jupiter: { m: B[1].m, R: B[1].R, p: { sun: o.p }, orbit: { sun: o }, kappa0: k0 }, sun: { m: B[0].m, R: B[0].R, p: {}, kappa0: k0, pinned: !!p.bodies[0].pinned } };
  }
  const [S, E, Mo] = B, mt = E.m + Mo.m, emb = (k) => E[k].map((x, i) => (E.m * x + Mo.m * Mo[k][i]) / mt);
  const oE = oscOf(emb('x').map((x, i) => x - S.x[i]), emb('v').map((x, i) => x - S.v[i]), U.G * (S.m + mt));
  const oEo = oscOf(E.x.map((x, i) => x - S.x[i]), E.v.map((x, i) => x - S.v[i]), U.G * (S.m + E.m));
  const oM = oscOf(Mo.x.map((x, i) => x - E.x[i]), Mo.v.map((x, i) => x - E.v[i]), U.G * mt);
  const oMs = oscOf(Mo.x.map((x, i) => x - S.x[i]), Mo.v.map((x, i) => x - S.v[i]), U.G * (S.m + Mo.m));
  return { earth: { m: E.m, R: E.R, p: { sun: oE.p }, orbit: { sun: oE, earthOwn: oEo }, kappa0: k0 },
    moon: { m: Mo.m, R: Mo.R, p: { earth: oM.p, sun: oE.p }, orbit: { earth: oM, sun: oE, moonOwn: oMs }, kappa0: k0 },
    sun: { m: S.m, R: S.R, p: {}, kappa0: k0, pinned: !!p.bodies[0].pinned } };
}

/* ───────── 3 惑星の値から規則の比 ───────── */
/** planet3 の正本(J)と各惑星の写し(books —— Q.pinnedBook)から、R_d/R の値(区間の割線 → 無ければ段 S の一次の見積り)と m・R・p */
export function planetRows(J, books) {
  return Q.PLANETS.map((pl, i) => {
    const R0 = J.R && J.R.planets[pl.key], S = J.S && J.S.planets[pl.key], sec = R0 && R0.bracket && R0.bracket.kind === 'one' && Number.isFinite(R0.secantX) ? R0.secantX : null;
    // 段 S の一次の見積りは K2 の式 —— K1 の出力(J.kernel = "k1")では使わない(区間の割線が無い惑星は値なし)
    const est = (J.kernel || 'k2') === 'k2' && S ? S.rdEst : null;
    const rd = sec !== null ? sec : est, src = sec !== null ? '区間の割線(エンジン)' : (est !== null ? '段 S の一次の見積り' : '値なし(K1 の区間が無い)');
    const U = siOf(books[i]), B = U.B, r = B[1].x.map((x, j) => x - B[0].x[j]), v = B[1].v.map((x, j) => x - B[0].v[j]), o = oscOf(r, v, U.G * (B[0].m + B[1].m));
    const Rd = Number.isFinite(rd) ? rd * B[1].R : null;
    return { key: pl.key, emoji: pl.emoji, ja: pl.ja, rd, src, Rd, m: B[1].m, R: B[1].R, p: o.p, rdOverR: Number.isFinite(rd) ? rd : null, rdOverM: Number.isFinite(Rd) ? Rd / B[1].m : null, rd2OverMp: Number.isFinite(Rd) ? Rd * Rd / (B[1].m * o.p) : null };
  });
}
/** 規則の比の表(3 惑星の平均と最大/最小 —— そろうかの表。どれを採るかは決めない) */
export function ruleTable(rows) {
  const out = {};
  for (const t of ['rdOverR', 'rdOverM', 'rd2OverMp']) {
    const v = rows.map((r) => r[t]).filter(Number.isFinite);
    out[t] = { values: rows.map((r) => ({ key: r.key, v: r[t] })), mean: v.reduce((s, x) => s + x, 0) / v.length, spread: Math.max(...v) / Math.min(...v), n: v.length };
  }
  return out;
}
/** 規則で R_d [m] を置く(1 つの天体に 1 つ —— 月の rd2OverMp は moonP の p。moonP が無ければ null〔定まらない〕) */
export function rdOfRule(rule, bodyKey, b) {
  if (rule.type === 'kappa0') return Number.isFinite(b.kappa0) ? b.kappa0 * b.m : null;   // v2: 全天体(太陽も)R_d = κ₀m
  if (rule.type === 'explicit') return rule.Rd[bodyKey] === undefined ? null : rule.Rd[bodyKey];
  if (rule.type === 'rdOverR') return rule.k * b.R;
  if (rule.type === 'rdOverM') return rule.k * b.m;
  const pk = bodyKey === 'moon' ? rule.moonP : 'sun';
  if (!pk || !Number.isFinite(b.p[pk])) return null;
  return Math.sqrt(rule.k * b.m * b.p[pk]);
}
/**
 * 受理の目安(v2: 0 < R_d ≤ 観測半径だけ —— 原仮定者の裁定(第115報)「6.5e6 m は K2 で未宣言のときの上限・宣言すれば超えてよい・K1 は無視」)—— 超えれば理由。
 * o.capM(数)を渡したときだけ第312便の世代の判定(0 < R_d ≤ min(R, cap))—— QA の世代切替が v1 の正本を作り直すときだけ使う
 */
export function admissibleOf(Rd, R, o = {}) {
  if (!(Number.isFinite(Rd) && Rd > 0)) return { ok: false, why: 'R_d が定まらない' };
  const over = [];
  if (Rd > R) over.push('観測半径 ' + (R / 1e3).toFixed(1) + ' km');
  if (Number.isFinite(o.capM) && Rd > o.capM) over.push('cap 6500 km');
  return over.length ? { ok: false, why: 'R_d ' + (Rd / 1e3).toPrecision(4) + ' km が ' + over.join('・') + ' を超える(拒否 —— 走らせない)' } : { ok: true, why: null };
}

/* ───────── 標的 ───────── */
/** 🏀 の標的(AN336 の 1PN + A1)・🌦️ の地球の 1PN だけの数値の参照(EMB と地球自身の 2 つ —— 主は EMB) */
export function targetOf(root, sysKey, p, recs) {
  if (sysKey === 'jupiter') {
    const t = AN.targetOfBook(root, p, recs);
    return { kind: 'an336', value: t.value, pn1: t.pn1.value, a1: t.a1 ? t.a1.value : null, recordId: t.a1 ? t.a1.recordId : null, sourceWidth: t.sourceWidth, sigma: t.sigma,
      calibrationEligible: t.calibrationEligible, formula: t.formula, pn1a: t.pn1.a, pn1e: t.pn1.e };
  }
  const v = AN.pn1Of(embView(p)), vE = AN.pn1Of({ physics: p.physics, scaleExp: p.scaleExp, bodies: [p.bodies[0], p.bodies[1]] });
  return { kind: 'pn1only', value: v.value, pn1: v.value, a1: null, recordId: null, sourceWidth: null, sigma: null, calibrationEligible: false,
    formula: 'q⋆ = q_1PN だけ(地球–月の重心〔EMB〕の初期の接触要素・二体の式 6πG(M+m)/(c₀²a(1−e²)) —— AN336 の生成器に地球の行〔A1 の記録 ID〕が無い)',
    pn1a: v.a, pn1e: v.e, earthOwn: { value: vE.value, a: vE.a, e: vE.e } };
}
/** G_loc の解析の一次(lib-w311d-planet3 の gLocAnalytic と同じ式 —— 🌦️ は EMB の二体の見方) */
export function gLocAnalyticOf(sysKey, p) { return Q.gLocAnalytic(sysKey === 'jupiter' ? p : embView(p), 2); }

/* ───────── 残差 ───────── */
/** q = {q00, q10, q01?, q11?} の同じ抽出器・同じ刻み。qStar = 標的 */
export const residualOf = Q.residualOf;


/* ───────── v2(第313便d): 標的の列・有限質量比・G の値・小さい係数の分解(純関数 —— QA docs.k1confirm313 が作り直す)───────── */
/** CODATA 2018 の G(×10⁻¹¹ m³ kg⁻¹ s⁻²)—— 本の G(6.674)との相対差の列だけに使う(本の単位の換算には使わない) */
export const G_CODATA = 6.67430;
/** A1 の暦表(列の順 —— 符号を反転しない・幅の種類を 1σ に統合しない —— AN401) */
export const EPHEMERIDES = Object.freeze([
  Object.freeze({ key: 'EPM2011', item: 'A1-EPM2011', widthKind: 'source-sigma(68% は未確認)', note: 'Pitjeva & Pitjev 2013(照合の記録 CSV に行がある)' }),
  Object.freeze({ key: 'INPOP10a', item: 'A1-INPOP10a', widthKind: 'interval-halfwidth(postfit 残差の変化が 5% 未満の区間 —— 1σ ではない)', note: 'Fienga et al. 2011 Table 5(候補の行)' })]);
/** 系の A1 の行の body 名(地球は EPM2011 が Earth・INPOP10a が Earth-Moon barycenter —— 候補の CSV の名のまま) */
export const A1_BODY = Object.freeze({ mercury: { EPM2011: 'Mercury', INPOP10a: 'Mercury' }, venus: { EPM2011: 'Venus', INPOP10a: 'Venus' }, mars: { EPM2011: 'Mars', INPOP10a: 'Mars' },
  jupiter: { EPM2011: 'Jupiter', INPOP10a: 'Jupiter' }, earthmoon: { EPM2011: 'Earth', INPOP10a: 'Earth-Moon barycenter' } });
const noteVal = (note, k) => { const m = new RegExp('(?:^|; )' + k + '=([^;]*)').exec(note || ''); return m ? m[1].trim() : null; };
/** 暦表ごとの A1 の行(recs = AN.readRecords)。EPM2011 は照合の記録と突き合わせる(AN.a1Of —— 記録 ID が要る)・INPOP10a は候補の行を item と body で一意に引く */
export function a1Columns(recs, sysKey) {
  const out = {};
  for (const E of EPHEMERIDES) {
    const body = A1_BODY[sysKey] && A1_BODY[sysKey][E.key];
    const cs = recs.C.filter((r) => r.body === body && r.quantity === AN.QUANTITY && noteVal(r.note, 'item') === E.item);
    if (cs.length !== 1) { out[E.key] = { value: null, recordId: null, body, why: '候補の行が ' + cs.length + ' 行' }; continue; }
    const c = cs[0], audit = recs.A.filter((r) => r.record_id === c.record_id);
    if (E.key === 'EPM2011') { const a = AN.a1Of(recs, c.record_id, body);
      out[E.key] = { value: a.value, recordId: a.recordId, body, width: a.sourceWidth, widthKind: E.widthKind, audited: true, unit: AN.UNIT }; }
    else { const w = noteVal(c.note, 'interval_halfwidth');
      out[E.key] = { value: Number(c.value), recordId: c.record_id, body, width: w === null ? null : Number(w), widthKind: E.widthKind, audited: audit.length === 1, unit: AN.UNIT }; }
  }
  return out;
}
/** 質量比 η = Mm/(M+m)²(SI の質量 —— 🌦️ は太陽と EMB) */
export const etaOf = (M, m) => M * m / ((M + m) * (M + m));
/** 有限質量比の予測 δϖ = (4/3)η q_1PN(在位の G_loc の一次の式と K1 の κ(M+m) の組の既知の寄与 —— 決断事項 AN405) */
export const finiteMassPred = (q1pn, M, m) => (4 / 3) * etaOf(M, m) * q1pn;
/** G の値の列(本の G の相対差)と、κ₀ を CODATA の G・本の質量で作ったときの残差の感度 δr ≈ (G_C/G_book − 1) D_G(足し引きしない —— 本の G と質量は同じ GM を与える) */
export const gColumn = (Gbook, DG) => ({ Gbook, Gcodata: G_CODATA, rel: (Gbook - G_CODATA) / G_CODATA, sensKappa: G_CODATA / Gbook - 1, dr: Number.isFinite(DG) ? (G_CODATA / Gbook - 1) * DG : null });
/** 残差の列(q = {q00, q10, q01?, q11} の同じ刻み): r_1PN = q11 − q00 − q_1PN・暦表ごとの r_{1PN+A1} = r_1PN − A1・D_G = q11 − q10・交差 I */
export function residualCols(q, q1pn, a1) {
  const out = { DG: q.q11 - q.q10, dqG: q.q10 - q.q00, r1pn: q.q11 - q.q00 - q1pn, rA1: {} };
  for (const [k, v] of Object.entries(a1 || {})) out.rA1[k] = Number.isFinite(v && v.value) ? out.r1pn - v.value : null;
  if (Number.isFinite(q.q01)) { out.D01 = q.q01 - q.q00; out.I = q.q11 - q.q10 - q.q01 + q.q00; }
  return out;
}
/**
 * 小さい係数の分解の 1 行(系ごと —— 最も細かい刻み f の値): r_1PN(κ₀)→ 有限質量比の予測を引く → G の値の効き(感度 —— 引かない)→ 数値の帯 → 残り。
 * c = {r1pnByDiv:{div: r}, DG, q1pn, fm, g:gColumn, divs}。帯は最も細かい 2 刻みの差(無ければ null)
 */
export function decompRow(c) {
  const ds = (c.divs || []).filter((d) => Number.isFinite(c.r1pnByDiv[d])).sort((a, b) => a - b), f = ds.length ? ds[ds.length - 1] : null;
  const r = f !== null ? c.r1pnByDiv[f] : null, band = ds.length >= 2 ? Math.abs(c.r1pnByDiv[ds[ds.length - 1]] - c.r1pnByDiv[ds[ds.length - 2]]) : null;
  const rem = Number.isFinite(r) ? r - c.fm : null;
  return { fine: f, r1pn: r, fm: c.fm, afterFm: rem, gDr: c.g ? c.g.dr : null, band, rem, remOverQ: Number.isFinite(rem) ? rem / c.q1pn : null, remOverDG: Number.isFinite(rem) && Number.isFinite(c.DG) ? rem / c.DG : null,
    withinBand: (Number.isFinite(rem) && Number.isFinite(band)) ? Math.abs(rem) <= Math.max(3 * band, 0) : null };
}
/** 候補の感度の並び(軌道の半直弦 p の冪 —— 水星を 1 に)。太陽の構造の型は内側ほど強い(R☉/p)^n・背景宇宙の型は外側ほど強い(p/p☿)^n。並べるだけ(合わせない) */
export const CANDIDATE_SHAPES = Object.freeze([
  Object.freeze({ key: 'sun2', kind: '太陽の構造の型', label: '(R☉/p)²', pow: -2 }), Object.freeze({ key: 'sun3', kind: '太陽の構造の型', label: '(R☉/p)³', pow: -3 }),
  Object.freeze({ key: 'bg2', kind: '背景宇宙の型', label: '(p/p☿)²', pow: 2 }), Object.freeze({ key: 'bg3', kind: '背景宇宙の型', label: '(p/p☿)³', pow: 3 })]);
export function candidateShapes(rows) {
  const ref = rows.find((z) => z.key === 'mercury') || rows[0];
  return rows.map((z) => Object.assign({ key: z.key }, Object.fromEntries(CANDIDATE_SHAPES.map((c) => [c.key, Math.pow(z.p / ref.p, c.pow)]))));
}
/** 根の κ_i/κ₀ の最大/最小(値の列 —— 有限のものだけ) */
export const spreadOf = (v) => { const x = v.filter(Number.isFinite); return x.length >= 2 ? Math.max(...x) / Math.min(...x) : null; };

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
// ■ しないこと: エンジンの式を写さない・合わせない(規則の k を確認の系で動かさない)・探索の値を在位へ入れない・「確認した」は規則で置いた残差が数値の門の内のときだけ。
import * as AN from './lib-w306a-an336.mjs';
import * as Q from './lib-w311d-planet3.mjs';
export const LIB_VERSION = 'w312d-confirm-lib-1';
export const CAP_M = Q.CAP_M;
/** 確認の系(器の --system の鍵) */
export const SYSTEMS = Object.freeze([
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '木星', bodies: Object.freeze(['sun', 'jupiter']) }),
  Object.freeze({ key: 'earthmoon', id: 'earthMoonSunInertial3d', emoji: '🌦️', ja: '太陽と地球と月', bodies: Object.freeze(['sun', 'earth', 'moon']) }),
]);
export const systemOf = (k) => SYSTEMS.find((s) => s.key === k || s.id === k) || null;
export const RULE_TYPES = Object.freeze(['rdOverR', 'rdOverM', 'rd2OverMp', 'explicit']);
export const MOON_P = Object.freeze(['earth', 'sun']);
/** 規則の受理(k は正の有限数・rd2OverMp は月の p の選び方 moonP を書く・explicit は天体ごとの R_d [m]) */
export function checkRule(r) {
  if (!r || typeof r !== 'object' || Array.isArray(r)) return '--rule は {type, k?, moonP?, Rd?}';
  if (!RULE_TYPES.includes(r.type)) return '--rule の type は ' + RULE_TYPES.join('|');
  for (const k of Object.keys(r)) if (!['type', 'k', 'moonP', 'Rd', 'src'].includes(k)) return '--rule に未知の鍵 ' + k;
  if (r.type === 'explicit') {
    if (!r.Rd || typeof r.Rd !== 'object') return 'explicit は Rd:{jupiter?, earth?, moon?}(m)';
    for (const [b, v] of Object.entries(r.Rd)) if (!['jupiter', 'earth', 'moon'].includes(b) || !(Number.isFinite(v) && v > 0)) return 'explicit の Rd.' + b + ' は正の有限数(m)';
    return null;
  }
  if (!(Number.isFinite(r.k) && r.k > 0)) return '--rule の k は正の有限数';
  if (r.moonP !== undefined && !MOON_P.includes(r.moonP)) return '--rule の moonP は ' + MOON_P.join('|');
  return null;
}
export const ruleKey = (r) => r.type === 'explicit' ? 'explicit:' + JSON.stringify(r.Rd) : r.type + ':' + Number(r.k).toPrecision(6) + (r.moonP ? ':moonP=' + r.moonP : '');

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
  if (sysKey === 'jupiter') {
    const r = B[1].x.map((x, i) => x - B[0].x[i]), v = B[1].v.map((x, i) => x - B[0].v[i]), o = oscOf(r, v, U.G * (B[0].m + B[1].m));
    return { jupiter: { m: B[1].m, R: B[1].R, p: { sun: o.p }, orbit: { sun: o } } };
  }
  const [S, E, Mo] = B, mt = E.m + Mo.m, emb = (k) => E[k].map((x, i) => (E.m * x + Mo.m * Mo[k][i]) / mt);
  const oE = oscOf(emb('x').map((x, i) => x - S.x[i]), emb('v').map((x, i) => x - S.v[i]), U.G * (S.m + mt));
  const oEo = oscOf(E.x.map((x, i) => x - S.x[i]), E.v.map((x, i) => x - S.v[i]), U.G * (S.m + E.m));
  const oM = oscOf(Mo.x.map((x, i) => x - E.x[i]), Mo.v.map((x, i) => x - E.v[i]), U.G * mt);
  const oMs = oscOf(Mo.x.map((x, i) => x - S.x[i]), Mo.v.map((x, i) => x - S.v[i]), U.G * (S.m + Mo.m));
  return { earth: { m: E.m, R: E.R, p: { sun: oE.p }, orbit: { sun: oE, earthOwn: oEo } },
    moon: { m: Mo.m, R: Mo.R, p: { earth: oM.p, sun: oE.p }, orbit: { earth: oM, sun: oE, moonOwn: oMs } } };
}

/* ───────── 3 惑星の値から規則の比 ───────── */
/** planet3 の正本(J)と各惑星の写し(books —— Q.pinnedBook)から、R_d/R の値(区間の割線 → 無ければ段 S の一次の見積り)と m・R・p */
export function planetRows(J, books) {
  return Q.PLANETS.map((pl, i) => {
    const R0 = J.R && J.R.planets[pl.key], S = J.S && J.S.planets[pl.key], sec = R0 && R0.bracket && R0.bracket.kind === 'one' && Number.isFinite(R0.secantX) ? R0.secantX : null;
    const rd = sec !== null ? sec : (S ? S.rdEst : null), src = sec !== null ? '区間の割線(エンジン)' : '段 S の一次の見積り';
    const U = siOf(books[i]), B = U.B, r = B[1].x.map((x, j) => x - B[0].x[j]), v = B[1].v.map((x, j) => x - B[0].v[j]), o = oscOf(r, v, U.G * (B[0].m + B[1].m));
    const Rd = rd * B[1].R;
    return { key: pl.key, emoji: pl.emoji, ja: pl.ja, rd, src, Rd, m: B[1].m, R: B[1].R, p: o.p, rdOverR: rd, rdOverM: Rd / B[1].m, rd2OverMp: Rd * Rd / (B[1].m * o.p) };
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
  if (rule.type === 'explicit') return rule.Rd[bodyKey] === undefined ? null : rule.Rd[bodyKey];
  if (rule.type === 'rdOverR') return rule.k * b.R;
  if (rule.type === 'rdOverM') return rule.k * b.m;
  const pk = bodyKey === 'moon' ? rule.moonP : 'sun';
  if (!pk || !Number.isFinite(b.p[pk])) return null;
  return Math.sqrt(rule.k * b.m * b.p[pk]);
}
/** 受理の目安(0 < R_d ≤ min(R, cap))—— 超えれば理由 */
export function admissibleOf(Rd, R) {
  if (!(Number.isFinite(Rd) && Rd > 0)) return { ok: false, why: 'R_d が定まらない' };
  const over = [];
  if (Rd > R) over.push('観測半径 ' + (R / 1e3).toFixed(1) + ' km');
  if (Rd > CAP_M) over.push('cap 6500 km');
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

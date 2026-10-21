// 第311便d(原仮定者の裁定(第110報)AN387・(第111報)AN391・決断事項 AN392・AN386・AN396・AN336・統括の検証項目 R229):
// **太陽–水星・太陽–金星・太陽–火星の 3 本の近点で各惑星の dragCore を探索する器の純関数**(html を読まない —— 本の写しは HP を引数で受ける)。
//
// ■ 何をするか(器 tests/exp-w311d-planet3.mjs が使う)
//   ・標的の表: 各惑星の AN336 の q⋆ = 1PN + A1(tests/lib-w306a-an336.mjs の targetOfBook / an336Target —— リポジトリの派生の参照値・sigma null・
//     calibrationEligible false)。**数値の標的への到達と観測の 3σ の較正は別**。
//   ・4 つの走行(同じ窓・同じ抽出器・同じ初期要素・同じ刻み): q00 = G_loc なし・引きずりなし / q10 = 在位の G_loc の固定の宣言・引きずりなし /
//     q01(θ) = G_loc なし・候補 θ の引きずり / q11(θ) = 両方。ΔqG = q10 − q00・引きずりの標的 t_D = q⋆ − ΔqG・残差 r(θ) = q11(θ) − q00 − q⋆
//     (= D_G(θ) − t_D・D_G = q11 − q10)・交差 I(θ) = q11 − q10 − q01 + q00(代表の点だけ)。**水星の G_loc の分を金星・火星へ流用しない**(各惑星で測る)。
//   ・候補 θ = {rd: 惑星の R_d/R(0 < rd ≤ 1), md: 惑星の m_d/M(0 < md ≤ 1), sunMd: 太陽の m_d/M☉(0 < sunMd ≤ 1)}。太陽の R_d は cap6500km に固定。
//     θ₀ = {1, 1, 1}(惑星は R < 6.5×10⁶ m なので既定で R_d = R・m_d = M —— θ₀ は惑星に dragCore を宣言しない〔既定の読み〕)。
//   ・数値の門(AN396 の推奨): abs(r) ≤ max(3 × 帯, 0.01″/世紀)・帯 = abs(r_h − r_h/2)。**観測の 3σ ではない**(「数値の門」と書く)。
//   ・根の区間: R_d の格子の行の r の符号の変わる隣り合う 2 点。細分は x = (R_d/R)² の割線(並進の主項は β ∝ R_d² —— 根の近くでほぼ直線)を区間の中へ
//     (外へ出たら ln R_d の二分)。根の発見・一意性・数値の採用・観測の同定を別に記録する(AN386)。
//   ・一次の見積り: β(惑星 ← 太陽) ≈ C₂ (M☉/m)(R_d/r)²・C₂ ≈ 0.45838(受け手の一様球の自己の場の比の体積平均 —— 中心だけの値 1/3 ではない。
//     器が t = 0 の写しのエンジンの β から測る〔段 S の c2〕)。惑星の自己の場が分母の大半なので D_G ∝ R_d² —— rd_est = √(t_D/D_G(θ₀))。
//     比 g(rd) = β(rd)/β(1) は器が t = 0 の写しで測り、rd² からのずれを表に出す。
//   ・第312便d(v2 —— 決断事項 AN396 の最終の採用の欄・統括の検証項目 R233): adoptOf が候補の点そのものの 4 つの欄 rootBracketed・numericResolved・targetReached・
//     declAdmissible を作る(ε は器の宣言の定数を引数で受ける —— 今の粗い門〔gateOf〕は残す)。R_d の口の換算(R_d/R・R_d/m・絶対の m)と K1 の比較の鍵(kernel)。
//
// ■ しないこと: html を読まない・エンジンの式を写さない・**フィットしない**(探索の材料 —— 探索の値を在位へ入れない)。全ノブが決まったとは書かない(AN392)。
import * as AN from './lib-w306a-an336.mjs';
export const LIB_VERSION = 'w312d-planet3-lib-2';
/** 一次の見積りの係数の注記(受け手の一様球の自己の場の比の体積平均 —— 器は段 S でエンジンの β から測って c2 に書く。この数は注記で、計算には使わない) */
export const C2_NOTE = Object.freeze({ value: 0.45838, note: 'β ≈ C₂(M☉/m)(R_d/r)²・C₂ ≈ 0.45838(受け手の一様球の自己の場の比の体積平均 —— 中心の自己の場 3m/R_d² だけなら 1/3)' });
/** K1 の比較の鍵(枝 a の invSq.kernel —— 省略 = 今〔k2〕。受理しない html では器が「未接続」と記録する) */
export const KERNELS = Object.freeze(['k2', 'k1']);
export const CAP_M = 6.5e6;   // AN363 の dragCore の既定の半径の上限(m)
/** 3 惑星(器の --planet の鍵 —— 本の ID・絵文字は在位の本) */
export const PLANETS = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', ja: '水星' }),
  Object.freeze({ key: 'venus', id: 'venusSunInertial3d', emoji: '🌋', ja: '金星' }),
  Object.freeze({ key: 'mars', id: 'marsSunInertial3d', emoji: '🔴', ja: '火星' }),
]);
export const planetOf = (k) => PLANETS.find((p) => p.key === k || p.id === k) || null;
/** 在位の G_loc の固定の宣言(第306便a の 7 本の一括 —— k・n・λ・GM は掃引しない) */
export const GLOC_FIXED = Object.freeze({ law: 'kappaC2' });
/** 新則の引きずり(外殻 uniform を宣言 —— m_d = M の天体は外殻の質量 0 で外殻を作らない)。旧則の鍵(Wbg・eps・inertialR2)は持たない */
export const NEW_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ outerShell: 'uniform' }), pairs: 'all', history: 'positions', dragCoreDefault: 'cap6500km', initMotion: 'observed',
  spinDrag: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' }) });
/** 引きずりなし(第310便d の対照と同じ形) */
export const OFF_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({}), enabled: false, pairs: 'all', history: 'positions' });
/** 4 つの走行の定義 */
export const KINDS = Object.freeze({ q00: Object.freeze({ gLoc: false, drag: false }), q10: Object.freeze({ gLoc: true, drag: false }),
  q01: Object.freeze({ gLoc: false, drag: true }), q11: Object.freeze({ gLoc: true, drag: true }) });
export const THETA0 = Object.freeze({ rd: 1, md: 1, sunMd: 1 });
/** 数値の門(AN396 の推奨 —— 器は門の数をここから読む) */
export const GATE = Object.freeze({ bandFactor: 3, floor: 0.01, unit: '″/世紀', kind: 'numeric',
  note: '数値の門(観測の 3σ ではない —— 決断事項 AN396 の推奨): 3 対それぞれで abs(r) ≤ max(3 × 数値の帯 abs(r_h − r_h/2), 0.01″/世紀) を同時に' });
/** 惑星の R_d/R の対数の格子(AN386・AN392 ② —— 一次の見積りの近くに 2 点を足す) */
export const RD_GRID = Object.freeze([1, 1e-1, 3e-2, 1e-2, 5e-3, 3e-3, 1e-3]);
/** 惑星の m_d/M の点(AN392 ④ —— 根の近くで外殻 M − m_d を残す。見積りの床の表) */
export const MD_POINTS = Object.freeze([1, 1 - 1e-6, 1 - 1e-5, 1 - 1e-4, 1 - 1e-3, 0.99, 0.5]);
/** 太陽の m_d/M☉ の点(AN392 ⑤ —— 3 対で共通) */
export const SUN_MD_POINTS = Object.freeze([1, 1e-1, 1e-3, 1e-6]);

const clone = (x) => JSON.parse(JSON.stringify(x));
const pos = (x) => Number.isFinite(x) && x > 0;
export const r3 = (x) => Number(Number(x).toPrecision(3));
export const thetaOf = (o = {}) => ({ rd: o.rd === undefined ? 1 : o.rd, md: o.md === undefined ? 1 : o.md, sunMd: o.sunMd === undefined ? 1 : o.sunMd });
export const kernelOf = (t) => (t && t.kernel === 'k1') ? 'k1' : 'k2';
export const thetaKey = (t) => { const q = thetaOf(t); return 'rd=' + q.rd + '|md=' + q.md + '|sun=' + q.sunMd + (t && t.coreSpin ? '|spin=' + JSON.stringify(t.coreSpin) : '') + (kernelOf(t) === 'k1' ? '|kernel=k1' : ''); };
export const isTheta0 = (t) => { const q = thetaOf(t); return q.rd === 1 && q.md === 1 && q.sunMd === 1 && !(t && t.coreSpin); };
/** θ に K1 の鍵を載せる(k2 は省略 —— 今の動作の行と同じ鍵) */
export const withKernel = (t, kernel) => (kernel === 'k1' ? Object.assign({}, t, { kernel: 'k1' }) : t);
/* R_d の口(v2): 絶対の R_d [m]・R_d/m [m/kg] を惑星の R_d/R へ(6 桁 —— 行の鍵に使う)。K1 の根は R_d がミリメートルの程度の見込み(R_d/R は 1e-9 の程度) */
export const rdFromAbs = (RdM, Rm) => Number((RdM / Rm).toPrecision(6));
export const rdFromRdm = (k, mKg, Rm) => Number((k * mKg / Rm).toPrecision(6));
export function checkTheta(t) {
  const q = thetaOf(t);
  if (!(pos(q.rd) && q.rd <= 1)) return 'R_d/R は 0 < rd ≤ 1(cap を超えない —— AN386)';
  if (!(pos(q.md) && q.md <= 1)) return 'm_d/M は 0 < md ≤ 1(AN386)';
  if (!(pos(q.sunMd) && q.sunMd <= 1)) return '太陽の m_d/M☉ は 0 < sunMd ≤ 1(AN386)';
  if (q.rd === 1 && q.md < 1) return 'R_d = R で m_d < M は外殻の体積が 0(エンジンの受理と同じ —— rd < 1 が要る)';
  return null;
}

/* ───────── 写し ───────── */
/**
 * 第306便a の世代の写し(凍結の写し tests/data-w306a-decl305.json の physics・bodies・scaleExp・timeRef + 在位の G_loc —— 第310便d の作り方を 3 惑星へ)。
 * fitRecord・abBody は外す。引きずりは bookOf が置き換える。
 */
export function pinnedBook(HP, PIN, id) {
  const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id);
  const d = PIN.decl[id]; if (!d) throw new Error('凍結の写しが無い: ' + id);
  const q = clone(p); q.physics = clone(d.physics); q.bodies = clone(d.bodies); q.scaleExp = clone(d.scaleExp); q.timeRef = clone(d.timeRef);
  delete q.fitRecord; delete q.abBody; q.physics.gLoc = clone(GLOC_FIXED);
  return q;
}
const setPath = (o, dotted, v) => { const ks = dotted.split('.'); let c = o; for (let i = 0; i < ks.length - 1; i++) { const k = /^\d+$/.test(ks[i]) ? Number(ks[i]) : ks[i]; if (c[k] === undefined) c[k] = {}; c = c[k]; } c[ks[ks.length - 1]] = v; };
/**
 * 走行の本。kind ∈ q00/q10/q01/q11・th = 候補 θ。引きずりの無い走行(q00・q10)は θ を持たない。
 * 惑星 rd < 1 か md < 1 → bodies[1].dragCore = {massFrac: md, radius: rd·R}・太陽 sunMd < 1 → bodies[0].dragCore = {massFrac: sunMd, radius: 6.5×10⁶ m(本の単位)}。
 * th.coreSpin = {body, spin?, spinAxis?:{tiltDeg, azimuthDeg?}}(dragCore の自転と軸の口 —— 第311便a の鍵 dragCore.spin・spinAxis。受理しなければ器が拒否と記録する)。
 * th.kernel = "k1"(v2 —— 枝 a の invSq.kernel。k2 は省略)。
 */
export function bookOf(base, kind, th = THETA0) {
  const k = KINDS[kind]; if (!k) throw new Error('走行の種類 ' + kind);
  const q = clone(base);
  if (k.gLoc) q.physics.gLoc = clone(GLOC_FIXED); else delete q.physics.gLoc;
  if (!k.drag) { q.physics.relativeDrag = clone(OFF_DRAG); return q; }
  const t = thetaOf(th), err = checkTheta(t); if (err) throw new Error('θ: ' + err);
  q.physics.relativeDrag = clone(NEW_DRAG);
  if (kernelOf(th) === 'k1') q.physics.relativeDrag.invSq.kernel = 'k1';   // v2: 枝 a の鍵(受理しない html は validatePreset が拒否 —— 器が「未接続」と記録)
  const L = Math.pow(10, q.scaleExp.L), R = q.bodies[1].radius;
  if (t.rd < 1 || t.md < 1) q.bodies[1].dragCore = { massFrac: t.md, radius: t.rd * R };
  if (t.sunMd < 1) q.bodies[0].dragCore = { massFrac: t.sunMd, radius: CAP_M / L };
  if (th && th.coreSpin) {
    const cs = th.coreSpin, b = cs.body === 0 ? 0 : 1, B = q.bodies[b];
    if (!B.dragCore) B.dragCore = b === 0 ? { massFrac: 1, radius: CAP_M / L } : { massFrac: 1, radius: B.radius };
    for (const kk of Object.keys(cs)) if (kk !== 'body') setPath(B.dragCore, kk, cs[kk]);
  }
  return q;
}

/* ───────── 標的 ───────── */
/** 3 本の標的(AN336 の生成器 —— 水星は固定の契約とも照合)。books = pinnedBook の写し(初期状態を固定)の配列 */
export function targetsOf(root, books) {
  const recs = AN.readRecords(root);
  return books.map((p) => {
    const t = p.id === 'mercurySunInertial3d' ? AN.an336Target(root, p, recs) : AN.targetOfBook(root, p, recs);
    return { id: p.id, key: t.key, value: t.value, pn1: t.pn1.value, a1: t.a1 ? t.a1.value : null, recordId: t.a1 ? t.a1.recordId : null, sourceWidth: t.sourceWidth,
      sigma: t.sigma, calibrationEligible: t.calibrationEligible, unit: t.unit, formula: t.formula, pn1a: t.pn1.a, pn1e: t.pn1.e };
  });
}
/** G_loc の解析の一次(html の gLocPeriAdvance と同じ式 —— receiver の μ_eff = G(m₁² + m₂²)/(m₁ + m₂))を ″/世紀へ。p は本・n は測地線の n(kappaC2 = 2) */
export function gLocAnalytic(p, n = 2) {
  const t = AN.pn1Of(p), B = p.bodies, G = p.physics.G, m1 = B[0].m, m2 = B[1].m, muEff = G * (m1 * m1 + m2 * m2) / (m1 + m2), c = p.physics.cLight;
  const perOrbit = -2 * n * Math.PI * muEff / (c * c * t.a * (1 - t.e * t.e)), T = Math.pow(10, p.scaleExp.T), century = 36525 * 86400 / T;
  return perOrbit * (century / t.P) * 180 / Math.PI * 3600;
}

/* ───────── 残差・交差・門 ───────── */
/** q = {q00, q10, q01?, q11?}(同じ刻み・同じ抽出器)。qStar = 標的 */
export function residualOf(q, qStar) {
  const out = { dqG: q.q10 - q.q00 };
  out.tD = qStar - out.dqG;
  if (Number.isFinite(q.q11)) { out.DG = q.q11 - q.q10; out.r = q.q11 - q.q00 - qStar; }
  if (Number.isFinite(q.q01)) out.D01 = q.q01 - q.q00;
  if (Number.isFinite(q.q11) && Number.isFinite(q.q01)) out.I = q.q11 - q.q10 - q.q01 + q.q00;
  return out;
}
export const bandOf = (a, b) => (Number.isFinite(a) && Number.isFinite(b)) ? Math.abs(a - b) : null;
/** 数値の門 1 本(r = 細かい刻みの値・band = 帯)。帯が無ければ判定しない(null) */
export function gateOf(r, band, G = GATE) {
  if (!Number.isFinite(r) || !Number.isFinite(band)) return { r: Number.isFinite(r) ? r : null, band: Number.isFinite(band) ? band : null, tol: null, pass: null };
  const tol = Math.max(G.bandFactor * band, G.floor);
  return { r, band, tol, pass: Math.abs(r) <= tol };
}

/**
 * 決断事項 AN396 の最終の採用の欄(v2 —— 今の粗い門 gateOf は残す)。**候補の点そのもの**の値で:
 *   rootBracketed   区間が 1 つ ∧ 候補が区間の内(両端を含む)
 *   numericResolved 候補の点で abs(r_h − r_h/2) ≤ ε_num ∧ abs(r_h/2 − r_h/4) ≤ ε_num(h/4 が無ければ null —— 採らない)
 *   targetReached   候補の点の h/4 の残差 abs(r_h/4) ≤ ε_fit(h/4 が無ければ null)
 *   declAdmissible  宣言として受理できる(受理した走行・質量 > 0・0 < R_d ≤ min(R, cap)・0 < m_d ≤ M・分母が正〔β の最大 < 1〕・有限)
 * c = {theta, rByDiv:{1,2,4}, R(惑星の半径 m), runs:[{status, nan, betaMax}]}・br = {kind, lo, hi}・eps = {fit, num}
 */
export function adoptOf(c, br, eps) {
  if (!c) return { candidate: null, rootBracketed: false, numericResolved: null, targetReached: null, declAdmissible: false, adopted: false };
  const r = c.rByDiv || {}, f = (x) => Number.isFinite(x), t = thetaOf(c.theta);
  const rootBracketed = !!(br && br.kind === 'one' && f(br.lo) && f(br.hi) && t.rd >= br.lo && t.rd <= br.hi);
  const d12 = f(r[1]) && f(r[2]) ? Math.abs(r[1] - r[2]) : null, d24 = f(r[2]) && f(r[4]) ? Math.abs(r[2] - r[4]) : null;
  const numericResolved = (d12 === null || d24 === null) ? null : (d12 <= eps.num && d24 <= eps.num);
  const targetReached = f(r[4]) ? Math.abs(r[4]) <= eps.fit : null;
  const RdM = t.rd * c.R, runs = c.runs || [];
  const declAdmissible = runs.length > 0 && runs.every((z) => z.status === 'run' && z.nan === false && f(z.betaMax) && z.betaMax >= 0 && z.betaMax < 1)
    && f(c.R) && c.R > 0 && RdM > 0 && t.rd <= 1 && RdM <= CAP_M && t.md > 0 && t.md <= 1 && t.sunMd > 0 && t.sunMd <= 1;
  return { candidate: { theta: t, RdM, rByDiv: r }, d12, d24, rootBracketed, numericResolved, targetReached, declAdmissible,
    adopted: rootBracketed && numericResolved === true && targetReached === true && declAdmissible };
}

/* ───────── 根の区間と細分 ───────── */
/** rows = [{rd, r}](同じ md・sunMd)→ rd の降順に並べ、符号の変わる隣り合う 2 点の列 */
export function bracketsOf(rows) {
  const R = rows.filter((z) => Number.isFinite(z.r) && pos(z.rd)).slice().sort((a, b) => b.rd - a.rd), out = [];
  for (let i = 0; i + 1 < R.length; i++) {
    const a = R[i], b = R[i + 1];
    if (a.r === 0) out.push({ lo: a, hi: a, exact: true });
    else if (Math.sign(a.r) !== Math.sign(b.r) && b.r !== 0) out.push({ lo: b, hi: a });   // lo = 小さい rd
  }
  if (R.length && R[R.length - 1].r === 0) out.push({ lo: R[R.length - 1], hi: R[R.length - 1], exact: true });
  const monotone = R.length < 2 ? null : R.every((z, i) => i === 0 || Math.sign(z.r - R[i - 1].r) === Math.sign(R[1].r - R[0].r));
  return { n: out.length, brackets: out, kind: out.length === 0 ? 'none' : (out.length === 1 ? 'one' : 'many'), monotone, rows: R };
}
/** x = rd² の割線(区間の中) */
export function secantX(lo, hi) {
  const xl = lo.rd * lo.rd, xh = hi.rd * hi.rd;
  if (hi.r === lo.r) return null;
  const x = xl - lo.r * (xh - xl) / (hi.r - lo.r);
  return x > 0 ? Math.sqrt(x) : null;
}
/** ln rd の割線(比較) */
export function secantLn(lo, hi) {
  const a = Math.log(lo.rd), b = Math.log(hi.rd);
  if (hi.r === lo.r) return null;
  return Math.exp(a - lo.r * (b - a) / (hi.r - lo.r));
}
/** 次の点: 区間があれば x の割線(区間の外なら ln の二分)・無ければ null */
export function nextRd(rows) {
  const B = bracketsOf(rows);
  if (B.kind !== 'one') return { rd: null, why: B.kind === 'none' ? '区間なし' : '区間が複数' };
  const { lo, hi } = B.brackets[0];
  if (lo === hi) return { rd: lo.rd, why: '格子の点が根' };
  let rd = secantX(lo, hi), how = 'x = (R_d/R)² の割線';
  if (!(rd > lo.rd && rd < hi.rd)) { rd = Math.sqrt(lo.rd * hi.rd); how = 'ln R_d の二分(割線が区間の外)'; }
  return { rd, why: how, lo: lo.rd, hi: hi.rd };
}
/** 根の感度 ∂r/∂ln R_d(区間の両端の差) */
export function sensLn(lo, hi) { return (hi.r - lo.r) / (Math.log(hi.rd) - Math.log(lo.rd)); }

/* ───────── 一次の見積り ───────── */
/** β ∝ R_d² の閉じた見積り: D_G(rd) ≈ D_G(1)·rd² → rd_est = √(t_D/D_G(1))(D_G(1) と t_D が同符号のときだけ) */
export function rdEstSquare(D1, tD) { return (D1 > 0 && tD > 0) || (D1 < 0 && tD < 0) ? Math.sqrt(tD / D1) : null; }
/** 表 [{rd, D}](D = 見積りの D_G)で D = t_D の rd を x = rd² の直線で補間(区間が無ければ null) */
export function rdEstTable(rows, tD) {
  const R = rows.filter((z) => Number.isFinite(z.D)).slice().sort((a, b) => b.rd - a.rd);
  for (let i = 0; i + 1 < R.length; i++) {
    const a = R[i], b = R[i + 1], fa = a.D - tD, fb = b.D - tD;
    if (fa === 0) return a.rd;
    if (Math.sign(fa) !== Math.sign(fb)) { const xa = a.rd * a.rd, xb = b.rd * b.rd, x = xa - fa * (xb - xa) / (fb - fa); return Math.sqrt(x); }
  }
  return null;
}
/** 初期の格子(RD_GRID + 見積りの √2 倍と 1/√2 倍 —— 3 桁)・降順・重複なし */
export function gridAround(rdEst, base = RD_GRID) {
  const s = new Set(base.map(Number));
  if (pos(rdEst)) for (const f of [Math.SQRT2, 1 / Math.SQRT2]) { const v = r3(rdEst * f); if (v > 0 && v <= 1) s.add(v); }
  return [...s].sort((a, b) => b - a);
}

/* ───────── 表の書式(丸めの床 —— 逐語照合する表に丸めの程度の数を書かない)───────── */
/** |x| < floor なら「< floor」(floor は 1e-12 などの文字列の指数)・それ以外は指数 d 桁 */
export function fmtFloor(x, floor = 1e-12, d = 3) {
  if (x === null || x === undefined || !Number.isFinite(x)) return '—';
  if (Math.abs(x) < floor) return '< ' + Number(floor).toExponential(0);
  return Number(x).toExponential(d);
}
/** 小数 d 桁(大きな数の差は使わない —— 器は |x| と有効桁から d を選ぶ) */
export const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
export const ex = (x, d = 3) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (x === 0 ? '0' : Number(x).toExponential(d));

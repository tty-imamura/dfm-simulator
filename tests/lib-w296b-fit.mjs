// 第296便b(原仮定者の裁定(第86報)「1PN 準拠の geoPN=1 以外は、サンプル生成時に調整可能なパラメータをフィットさせる」
// 「geoPN=3 のサンプルは、観測値に合うように dragCore をフィットさせる。gain の妥当性も確認する」・統括の検証項目 R158)——
// **geoPN=3 のフィット生成器の純関数**(Node だけ・html を読まない・エンジンを走らせない —— 器 tests/exp-w296b-fit.mjs が使う)。
//
// ■ 何を持つか
//   ・フィット記録 `fitRecord` の版・鍵の正準の並び・status の語彙(html の `validateFitRecord` と同じ —— 器の門と QA が照合する)。
//   ・構造核 dragCore の感度の格子 `CORE_GRID`(R_c/R ∈ {0.1,…,0.9} × f ∈ {0.1,0.3,0.5,0.7,0.9,1.0}・コアがマントルより高密度 f ≥ (R_c/R)³ —— 43 通り)。
//   ・gain の対数格子 `logGrid`・根を挟む `bracketOf`・挟んだ根の 1 次元の詰め `illinoisNext`(はさみうち法の Illinois 変形)。
//   ・遠方の上限 1/[1−(R/r)²](核 s⁻³ の球殻平均の最大 —— 全質量が表面にあるとき)・gain の SI 換算・status の決め方。
//   ・観測表(paper/data/*.csv)の行の読み取り(引用符つき CSV)と PHYSICS〔第296便b〕の表の行(QA docs.fitContract296 が正本から作り直して照合する)。
//
// ■ 言わないこと
//   ・「現実を再現した」「43″ を再現した」「較正 合」「gain は普遍定数」。合わせたのは**宣言した 1 つの観測量**だけで、他の量(周期・離心率)は合わせていない。
//   ・数値誤差(h と h/2 の差)を見ずに桁を主張しない。合わせられなかった本は `unreachable-in-bounds` を成果として記録する(成功を捏造しない)。
export const FIT_LIB_VERSION = 'w296b-fit-lib-1';
export const FIT_RECORD_VERSION = 'w296b-1';
/** fitRecord の鍵の正準の並び(notIdentifiable だけ省略可)。 */
export const FIT_RECORD_KEYS = Object.freeze(['version', 'parent', 'law', 'targets', 'knobs', 'fixed', 'procedure', 'dt', 'steps', 'residual', 'numerics', 'status', 'notFitted', 'notIdentifiable']);
export const FIT_TARGET_KEYS = Object.freeze(['q', 'obs', 'unit', 'source', 'window']);
export const FIT_KNOB_KEYS = Object.freeze(['key', 'range', 'final']);
export const FIT_RESIDUAL_KEYS = Object.freeze(['value', 'unit', 'model', 'rel']);
export const FIT_NUMERICS_KEYS = Object.freeze(['h2', 'dtHalf']);
export const FIT_STATUSES = Object.freeze(['fitted', 'unreachable-in-bounds', 'not-identifiable']);

/** 構造核の感度の格子(43 通り)。x = R_c/R・f = コアの質量の割合。f ≥ x³(コアの密度 ≥ マントルの密度)だけを採る。 */
export const CORE_X = Object.freeze([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
export const CORE_F = Object.freeze([0.1, 0.3, 0.5, 0.7, 0.9, 1.0]);
export const CORE_GRID = Object.freeze((() => { const out = []; for (const x of CORE_X) for (const f of CORE_F) if (f >= x * x * x) out.push(Object.freeze({ x, f })); return out; })());
/** 冥王星とカロンの構造核の事前値(探索では固定 —— 同定できないことを記録する)。 */
export const PLUTO_PRIORS = Object.freeze({ 0: Object.freeze({ f: 0.5, x: 0.3 }), 1: Object.freeze({ f: 0.5, x: 0.5 }), tableN: 4096 });
/** 🟤 の f の掃引(太陽の R_c/R = 0.3 固定)と 🟣 の f の掃引(冥王星 x 0.3・カロン x 0.5 —— 格子の f のうち f ≥ x³)。 */
export const MER_F_SCAN = Object.freeze({ index: 0, x: 0.3, f: CORE_F.filter((f) => f >= 0.027) });
export const PLU_F_SCAN = Object.freeze([Object.freeze({ index: 0, x: 0.3, f: CORE_F.filter((f) => f >= 0.027) }), Object.freeze({ index: 1, x: 0.5, f: CORE_F.filter((f) => f >= 0.125) })]);

/** 両端を含む対数格子(n 点)。 */
export function logGrid(lo, hi, n) {
  const a = Math.log(lo), b = Math.log(hi), out = [];
  for (let k = 0; k < n; k++) out.push(k === 0 ? lo : (k === n - 1 ? hi : Math.exp(a + (b - a) * k / (n - 1))));
  return out;
}
/** 宣言の半径 R に対する R_c = x·R(12 桁で丸めて浮動小数の端数を落とす —— 本の宣言と器で同じ数)。 */
export function coreRadius(x, R) { return Number((x * R).toPrecision(12)); }
/** 格子の行 [{g, y}](g 昇順)から y − target の符号が変わる最初の隣り合う対。無ければ null。 */
export function bracketOf(rows, target) {
  for (let i = 0; i + 1 < rows.length; i++) {
    const a = rows[i].y - target, b = rows[i + 1].y - target;
    if (a === 0) return { lo: rows[i], hi: rows[i], exact: true };
    if (a * b < 0) return { lo: rows[i], hi: rows[i + 1], exact: false };
  }
  const L = rows[rows.length - 1];
  if (L && L.y - target === 0) return { lo: L, hi: L, exact: true };
  return null;
}
/** 最も標的に近い行(挟めなかったときの記録)。 */
export function nearestOf(rows, target) {
  let best = null;
  for (const r of rows) if (best === null || Math.abs(r.y - target) < Math.abs(best.y - target)) best = r;
  return best;
}
/**
 * Illinois 変形のはさみうち法の 1 歩(純関数)。st = {a, fa, b, fb, side}(fa·fb<0)。次に評価する x を返す。
 * 評価の後は `illinoisUpdate(st, x, fx)` で区間を更新する(同じ側が 2 度続いたら残った端の f を半分にする)。
 */
export function illinoisNext(st) { return (st.a * st.fb - st.b * st.fa) / (st.fb - st.fa); }
export function illinoisUpdate(st, x, fx) {
  const s = Object.assign({}, st);
  if (fx * s.fb < 0) { s.a = s.b; s.fa = s.fb; s.b = x; s.fb = fx; s.side = 0; }
  else { s.b = x; s.fb = fx; if (s.side === -1) s.fa /= 2; s.side = -1; }
  return s;
}
/** 核 s⁻³ の球殻平均の遠方の上限(全質量が半径 R の表面にあるとき)1/[1−(R/r)²]。r ≤ R は Infinity。 */
export function farBound(R, r) { const q = R / r; return q < 1 ? 1 / (1 - q * q) : Infinity; }
/** 単位 1 = 10^L m・10^M kg の gain [L³/M] の SI 換算 [m³/kg]。 */
export function gainSI(gain, scaleExp) { return gain * Math.pow(10, 3 * scaleExp.L) / Math.pow(10, scaleExp.M); }
/** status: 根を挟み、残差が数値誤差の帯(|q_h − q_h/2|)以下なら fitted。挟めなければ unreachable-in-bounds。 */
export function statusOf(o) {
  if (!o.bracketed) return 'unreachable-in-bounds';
  if (!(Number.isFinite(o.residual) && Number.isFinite(o.h2))) return 'not-identifiable';
  return Math.abs(o.residual) <= o.h2 ? 'fitted' : 'not-identifiable';
}

/** 引用符つき CSV の 1 行を欄に分ける(RFC 4180 の "" のエスケープ)。 */
export function csvSplit(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
/** CSV の本文から record_id の行を {body, quantity, value, unit, source, sigma, record_id} で返す(無ければ null)。 */
export function csvRecord(text, recordId) {
  const lines = text.split(/\r?\n/), head = csvSplit(lines[0]);
  const ix = (k) => head.indexOf(k);
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const f = csvSplit(lines[i]);
    if (f[ix('record_id')] !== recordId) continue;
    return { body: f[ix('body')], quantity: f[ix('quantity')], value: Number(f[ix('value')]), unit: f[ix('unit')], source: f[ix('source')],
      sigma: f[ix('sigma')] === '' ? null : Number(f[ix('sigma')]), record_id: recordId };
  }
  return null;
}

/* ── 表示用の数(PHYSICS〔第296便b〕・本の obsCard —— QA docs.fitContract296 が正本から作り直して照合する)── */
export const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
export const ex = (x, d = 2) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : (x === 0 ? '0' : Number(x).toExponential(d));
/** 感度の表の行(源ごと —— 43 通りの比の最小・最大と遠方の上限)。 */
export function sensRows(J) {
  return J.sensitivity.sources.map((s) => `| ${s.emoji} | ${s.source}→${s.receiver} | ${fx(s.R, 4)} | ${fx(s.r, 3)} | ${ex(s.R / s.r, 3)} | ${fx(s.ratioMin, 8)} | ${fx(s.ratioMax, 8)} | ${fx(s.farBound, 8)} | ${s.need === null ? '—' : ex(s.need, 3)} |`);
}
/** gain の妥当性の表の行(移送値と各フィット値の SI 換算・比)。 */
export function gainRows(J) {
  return J.gainTable.rows.map((r) => `| ${r.emoji} | ${r.label} | ${r.gain === null ? '—' : ex(r.gain, 6)} | ${r.gainSI === null ? '—' : ex(r.gainSI, 6)} | ${r.ratio === null ? '—' : ex(r.ratio, 4)} | ${r.target} | ${r.status} |`);
}
/** 探索の結果の表の行(本ごと —— 標的・最終値・残差・h/2・status)。 */
export function searchRows(J) {
  return J.search.map((s) => `| ${s.emoji} | ${s.target.q} | ${s.target.obs} ${s.target.unit} | ${s.bracketed ? '挟めた' : '挟めない'} | ${s.final === null ? '—' : ex(s.final, 6)} | ${s.modelH === null ? '—' : fx(s.modelH, s.digits)} | ${s.residual === null ? '—' : ex(s.residual, 3)} | ${s.h2 === null ? '—' : ex(s.h2, 3)} | ${s.status} |`);
}
/** 派生本の obsCard(ja/en の model・obs 欄)に入っているべき数の文字列(本ごと —— QA docs.fitContract296 が照合する)。 */
export function obsNumbers(J) {
  const S = (k) => J.search.find((s) => s.key === k), out = {}, cd = J.gainTable.cdSI;
  const m = S('mer');
  if (m && m.status === 'fitted') out[m.fitId] = [String(m.final), ex(m.finalSI, 5), ex(m.finalSI / cd, 3), fx(m.modelH, 5), ex(m.residual, 2), ex(m.h2, 2),
    fx(m.finalRun.h.periodMeanSec / 86400, 5), fx(m.finalRun.h.periodMeanSec - m.g0.periodMeanSec, 2), fx(m.finalRun.h.apsArcsecPerCentury, 2), ex(m.fSpan, 2)];
  const p = S('plu');
  if (p && p.status === 'fitted') {
    const V = J.velocityConvention.rows, tW = V.find((z) => z.key === 'plu-inv-transfer-W'), tV = V.find((z) => z.key === 'plu-inv-transfer-V');
    out[p.fitId] = [String(p.final), ex(p.finalSI, 5), ex(p.finalSI / cd, 3), fx(p.modelH, 4), ex(p.residual, 2), ex(p.h2, 2), fx(p.rev16.y, 4),
      fx(p.finalRun.h.period2Sec, 4), ex(p.finalRun.h.eProxy, 2), ex(p.fSpan, 2), ex(tV.eProxy, 2), ex(tW.eProxy, 2), fx(tV.periodMeanSec, 1)];
  }
  return out;
}

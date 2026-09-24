// 第280便a(原仮定者の裁定(第70報)「mercuryReal: 観測値版で問題が出ている理由を調査する/
//   mercuryRealKF1: mercuryReal の精度を目標にする・引きずりは座標変換であり遠心力に関わらない」・
//   統括の検証項目 R66): 水星の近点移動の**不足の分解**に使う純関数(副作用なし・ファイルを書かない)。
//
// ■ 何を持つか
//   ① 正式の測定演算子の取り出し —— 判定器 `tests/exp-w249b-calaudit.mjs` がページへ渡している
//      ヘルパ(近点抽出 A/B・近点位相の直線 fit・周期の窓)の**ソース文字列そのもの**を切り出す。
//      写しを持たないので、判定器の抽出器が変われば本器の抽出器も同じだけ変わる(sha256 を記録する)。
//   ② 外挿: 刻み dt の Richardson(次数 p は 3 段から実測)と、軟化長 ε の ε² 外挿。
//   ③ 解析値: 1PN の 6πGM/(c²a(1−e²))・Plummer 軟化の逆行 −3πε²/(a²(1−e²)²)(どちらも rad/公転 → deg/周)。
//   ④ 換算: ″/世紀 ⇄ deg/周(周期 P[日]・ユリウス世紀 36525 日)。
//   ⑤ 不足の分解: 観測換算値 − 正式値 = 入力・換算 + 模型残差 + 軟化 + 刻み。
//
// ■ しないこと
//   値を決めない・判定に触らない・q を動かさない。「精度を上げれば成立」とは書かない
//   (ε→0・dt→0 の外挿値は**外挿**であって、そこで走らせた値ではない)。
export const MERCURY_W280A_VERSION = 'w280a-mercury-1';
export const JULIAN_CENTURY_DAYS = 36525;
export const DEG = 180 / Math.PI;

// ---------------------------------------------------------------- ① 正式の測定演算子
// 判定器のページ側ヘルパ(`await pg.evaluate((PERI_WINDOW) => { … }, PERI_WINDOW);`)の本文を切り出す。
export const CALAUDIT_HELPER_OPEN = 'await pg.evaluate((PERI_WINDOW) => {';
export const CALAUDIT_HELPER_CLOSE = '}, PERI_WINDOW);';
export function extractCalauditHelpers(src) {
  const s = String(src);
  const i = s.indexOf(CALAUDIT_HELPER_OPEN);
  if (i < 0) throw new Error('[w280a] 判定器のページ側ヘルパの開始が見つからない');
  const j = s.indexOf(CALAUDIT_HELPER_CLOSE, i);
  if (j < 0) throw new Error('[w280a] 判定器のページ側ヘルパの終わりが見つからない');
  const body = s.slice(i + CALAUDIT_HELPER_OPEN.length, j);
  // 本器が使う 4 つの窓口が揃っていること(名前が変わったら止める)
  for (const k of ['window.__w249map', 'window.__w249build', 'window.__w249osc0', 'window.__w249run'])
    if (!body.includes(k)) throw new Error('[w280a] 判定器のヘルパに ' + k + ' が無い');
  return body;
}

// ---------------------------------------------------------------- ② 外挿
// 刻み h, h/2, h/4 の 3 値から観測次数 p と外挿値 Q*(h→0)。
export function richardson3(q1, q2, q3) {
  const d12 = q1 - q2, d23 = q2 - q3;
  if (!(Number.isFinite(d12) && Number.isFinite(d23)) || d23 === 0 || d12 === 0 || Math.sign(d12) !== Math.sign(d23))
    return { p: null, qStar: null, d12, d23, ok: false, why: '差の符号が揃わない/0(単調に収束していない)' };
  const ratio = d12 / d23, p = Math.log2(ratio);
  const qStar = q3 - d23 / (ratio - 1);          // = q3 + (q3−q2)/(2^p−1)
  return { p, ratio, qStar, d12, d23, ok: true };
}
// ε の 2 値(小さい方 2 つ)から Q = Q0 + k ε²。3 値があれば Q0 + kε² + jε⁴ も解く。
export function epsExtrap(eps, Q) {
  const n = Math.min(eps.length, Q.length);
  if (n < 2) return null;
  const idx = [...Array(n).keys()].sort((a, b) => eps[a] - eps[b]);
  const [a, b] = idx;                              // 最小 2 つ
  const ea = eps[a] * eps[a], eb = eps[b] * eps[b];
  const k = (Q[b] - Q[a]) / (eb - ea), Q0 = Q[a] - k * ea;
  const out = { Q0, k, from: [eps[a], eps[b]] };
  if (n >= 3) {
    const c = idx[2], ec = eps[c] * eps[c];
    out.predictLargest = Q0 + k * ec;
    out.residLargest = Q[c] - out.predictLargest;  // ε⁴ 以上の寄与(2 点 fit の外)
    // 3 点で Q0 + kε² + jε⁴ を厳密に解く
    const x = [ea, eb, ec], y = [Q[a], Q[b], Q[c]];
    const det = (x[1] - x[0]) * (x[2] - x[0]) * (x[2] - x[1]);
    // ラグランジュで 2 次(x=ε²)の係数
    const L = (i, j, k2) => y[i] / ((x[i] - x[j]) * (x[i] - x[k2]));
    const jj = L(0, 1, 2) + L(1, 0, 2) + L(2, 0, 1);
    const kk = -(L(0, 1, 2) * (x[1] + x[2]) + L(1, 0, 2) * (x[0] + x[2]) + L(2, 0, 1) * (x[0] + x[1]));
    const q0 = L(0, 1, 2) * x[1] * x[2] + L(1, 0, 2) * x[0] * x[2] + L(2, 0, 1) * x[0] * x[1];
    out.quad = { Q0: q0, k: kk, j: jj, det };
  }
  return out;
}

// ---------------------------------------------------------------- ③ 解析値(deg/周)
export function pn1AnalyticDeg({ GM, c, a, e }) {
  return 6 * Math.PI * GM / (c * c * a * (1 - e * e)) * DEG;
}
// Plummer 軟化 Φ=−GM/√(r²+ε²) の逆行: δϖ_ε ≈ −3πε²/(a²(1−e²)²)(rad/公転)
export function softeningAnalyticDeg({ eps, a, e }) {
  const s = 1 - e * e;
  return -3 * Math.PI * eps * eps / (a * a * s * s) * DEG;
}
export function softeningCoefDeg({ a, e }) {       // δϖ_ε = coef · ε²
  const s = 1 - e * e;
  return -3 * Math.PI / (a * a * s * s) * DEG;
}

// ---------------------------------------------------------------- ④ 換算
export function arcsecPerCenturyToDegPerOrbit(x, pDays) { return x / 3600 * pDays / JULIAN_CENTURY_DAYS; }
export function degPerOrbitToArcsecPerCentury(y, pDays) { return y * 3600 * JULIAN_CENTURY_DAYS / pDays; }

// ---------------------------------------------------------------- ⑤ 不足の分解
//   obs − qFormal = (obs − pnAn) [入力・換算] + (pnAn − q00) [模型残差 = 1PN 実装 − 解析値(外挿の極限で)]
//                 + (q00 − qStarEps) [軟化 —— 正式 ε の dt 外挿値から ε→0 へ] + (qStarEps − qFormal) [刻み]
export function decompose({ obs, qFormal, qStarEps, q00, pnAn }) {
  const deficit = obs - qFormal;
  const parts = {
    step: qStarEps - qFormal,
    softening: q00 - qStarEps,
    modelResidual: pnAn - q00,
    inputConversion: obs - pnAn,
  };
  const sum = parts.step + parts.softening + parts.modelResidual + parts.inputConversion;
  const share = {};
  for (const k of Object.keys(parts)) share[k] = parts[k] / deficit;
  return { deficit, parts, share, closure: sum - deficit };
}

// ---------------------------------------------------------------- ⑥ 文書の数(§5.32・〔第280便a〕)
// 仮数 d 桁の「m.mmm×10⁻ⁿ」(負号は U+2212)。文書と QA `docs.mercuryDecomp` が同じ関数で作る。
const SUPD = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export function fmtSci(x, digits = 5) {
  if (x === 0) return '0';
  if (!Number.isFinite(x)) return String(x);
  const [m, e] = Math.abs(x).toExponential(digits - 1).split('e');
  return (x < 0 ? '−' : '') + m + '×10' + String(Number(e)).split('').map((c) => SUPD[c] || c).join('');
}
export function fmtFix(x, n) { return (x < 0 ? '−' : '') + Math.abs(x).toFixed(n); }
// 正本 JSON から「§5.32 に必ず載る数」を作る(QA が md に文字列として含まれるかを見る)
export function keyNumbers(J) {
  const g = (lam, eps, dt) => J.grid.find((z) => z.lambdaPN === lam && z.eps === eps && z.dt === dt).slopeDegA;
  const D = J.decomposition.coarse.obsKF0;
  const R = J.richardson['lam1_eps0.05'].coarse;
  const EF = J.epsExtrap.lam1_coarse;
  const TD = J.table.diff;
  const out = [];
  const add = (key, value, text) => out.push({ key, value, text });
  add('formal', J.reproduction.kF0.formal, fmtSci(J.reproduction.kF0.formal, 8));
  add('obsKF0', J.observed.kF0Row.value, fmtSci(J.observed.kF0Row.value, 6));
  add('obsKF1', J.observed.kF1Row.value, fmtSci(J.observed.kF1Row.value, 6));
  for (const eps of [0.05, 0.02, 0.01]) for (const dt of [0.032, 0.016, 0.008, 0.004])
    add(`grid_${eps}_${dt}`, g(1, eps, dt), fmtSci(g(1, eps, dt), 6));
  add('richP', R.p, fmtFix(R.p, 4));
  add('richQ', R.qStar, fmtSci(R.qStar, 6));
  add('epsQ0', EF.Q0, fmtSci(EF.Q0, 6));
  add('epsK', EF.k, fmtSci(EF.k, 5));
  add('softCoef', J.analytic.softeningCoef, fmtSci(J.analytic.softeningCoef, 5));
  add('pn1', J.analytic.pn1, fmtSci(J.analytic.pn1, 6));
  add('step', D.parts.step, fmtSci(D.parts.step, 4));
  add('softening', D.parts.softening, fmtSci(D.parts.softening, 4));
  add('input', D.parts.inputConversion, fmtSci(D.parts.inputConversion, 4));
  add('deficit', D.deficit, fmtSci(D.deficit, 4));
  add('shareStep', D.share.step, fmtFix(D.share.step * 100, 1) + '%');
  add('shareSoft', D.share.softening, fmtFix(D.share.softening * 100, 1) + '%');
  add('shareInput', D.share.inputConversion, fmtFix(D.share.inputConversion * 100, 2) + '%');
  add('smallest', J.atSmallest.value, fmtSci(J.atSmallest.value, 6));
  add('smallestDef', J.atSmallest.deficitToObsKF0, fmtSci(J.atSmallest.deficitToObsKF0, 4));
  add('kf1minuskf0_016', TD[0].kF1_minus_kF0, fmtSci(TD[0].kF1_minus_kF0, 4));
  add('kf1minuskf0_008', TD[1].kF1_minus_kF0, fmtSci(TD[1].kF1_minus_kF0, 4));
  add('kf1minuskf0_004', TD[2].kF1_minus_kF0, fmtSci(TD[2].kF1_minus_kF0, 4));
  add('lam0_016', g(0, 0.05, 0.016), fmtSci(g(0, 0.05, 0.016), 6));
  add('cTrueDelta', J.inputBreak.cTrueDelta, fmtSci(J.inputBreak.cTrueDelta, 4));
  add('dragCy', J.aim.dragArcsecPerCentury, fmtFix(J.aim.dragArcsecPerCentury, 4));
  return out;
}

// 第328便b(原仮定者の回答(2026-11-05 —— AN559「p は場の API から別に決める —— 受け手の演算を先に定義・金星の熱で決めない」・AN561「源の自転を外部の口座に固定した比べる列」・
//   AN562・AN563・AN550・AN566)・統括の検証項目 R302): **受け手の応答の演算 F(R_d, m; 契約, 位置, 軸)の純関数と、一定の指数の門・源の自転を外部の口座に固定した列**
//   (器 tests/exp-w328b-response.mjs と QA lint.response328b が読む —— html を読まない・状態を持たない・エンジンの式を写さない。銀河と K1 の口の系は第327便a の lib の
//   solve・evaluate をそのまま呼ぶ)。
//
// ■ 契約(第328便の共通の形 —— ただの JSON の値・関数を含めない・欠測は null で 0 で埋めない): version 'w328a-fieldcontract-1'・frame{id, origin, axis, velocityRef, timeUnit,
//   lengthUnit, omegaFrame}・omegaField{mode:'constant', value, at, ref, unit, source}・convergence{uConverged, curlConverged, method, gridSigns}・sources[{sourceId, owns, coef}]・
//   transfer{id, version, form:'directSlip', gT}・ledgerRefs{supply, reaction, heat}。直接の滑りの目標 ν_slip = g_T(Ω_frame − Ω_field) â_frame(AN551 —— 構成則の宣言)。
// ■ 受け手の演算の型(宣言 —— 走行の前に置く。今の DFM の式から導いた法則ではない。受け手 = {R_d, m, I}〔I は天体の慣性 —— R_d・m と独立の量〕・env = {slip, W_bg, ref})
//   ballMean(主): 受け手の R_d の球で場の回転を平均する(定数の Ω_field の場は球の平均が中心の値 —— 一次の場でも中心の値。二次の項は (R_d²/10)∇² —— 純関数の場面 ②)
//   inertiaShare(主): 直接の滑りを受け手の慣性で配る(R_d の球の慣性 I_c = (2/5) m R_d² と天体の慣性 I の比 —— ν = ν_slip I_c/(I_c + I))
//   k1Ratio(検査): K1 の比の型(受け手の自己の場の球の平均 W_self = 1.2 m/R_d と背景の場 W_bg〔場の API の β から W_bg = β/(10G_0/c_0²)〕—— ν = ν_slip (W_bg + W_ref)/(W_bg + W_self))
//   engineDefault(既定の列): q = 1・質量の因子 m_ref/m(今のエンジンの galaxyAxial の rdPow 1・massPow −1 の型 —— ν = ν_slip (R_d/R_ref)(m_ref/m))
//   nullP0(否定対照): p = 0(受け手に依らない —— ν = ν_slip)
//   受け手の演算の大きさ(基準の天体〔太陽〕の値)は太陽の式の A に吸収される —— 診断に効くのは比 f_i = F_i/F_☉ だけ。
// ■ 指数の門(宣言): 固定の位置で R_d・m・I を**独立に**振る(各 ±1 桁・9 点)。log の傾きの局所の値の幅 ≤ tolSlope・直線からの残差 ≤ tolRes・応答の符号が変わらない・
//   応答がほぼ 0(係数 < nearZeroAbs)でない —— 全部を満たすときだけ「一定の指数」。K1 の規則の線(R_d = Y_k m)の上の p は a + b(I が効かない型)。
//   本の天体(R_d = Y_k m・慣性は文献の値)の f_i を ln f = p ln(R_d/R_d,☉) で読み、残差が tolRes の内のときだけ **p の候補**(型ごと)を返す。成り立たなければ応答の表を返す(p を出さない)。
//   p が「1 つ」は、主の型の全部が候補を返し、候補が agreeTol の内で同じとき(走行の前の宣言)。
// ■ AN561: 源の自転を外部の口座に固定した列 —— 源の K1 の口の反作用を幻の天体(源と同じ自転・口なし)へ回し、源の式から反作用を外す(主列の反作用は消さない —— 2 列を並べる)。
//   外部の口座のトルク = −反作用(源を固定に保つ)・供給の仕事 = −反作用 × s_src = K1 の口の供給(二重に数えない)。
// ■ 言わないこと: p は場の API だけでは決まらない(受け手の演算の型の宣言で決まる)・一定の指数が成り立たない型に p を書かない・金星の熱の振幅に合わせて p を選ばない・
//   内部熱・金星の逆回転の説明ではない・銀河場の同定と数えない・負の係数は不採用(0 に丸めない)・変化の時間 I|Ω|/|N| はその列の瞬間のトルクの局所の尺度(履歴の積分ではない)。
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
export const LIB_VERSION = 'w328b-response-lib-1';
export const CONTRACT_VERSION = 'w328a-fieldcontract-1';
const { dot, scale, norm, relD } = E;
const vec3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  forms: Object.freeze([
    Object.freeze({ key: 'ballMean', role: 'main', reads: Object.freeze(['Rd']), ja: '受け手の R_d の球で場の回転を平均する型(契約の直接の滑り —— 定数の Ω_field の場は球の平均が中心の値)' }),
    Object.freeze({ key: 'inertiaShare', role: 'main', reads: Object.freeze(['Rd', 'm', 'I']), ja: '直接の滑りを受け手の慣性で配る型(R_d の球の慣性 (2/5) m R_d² と天体の慣性 I の比)' }),
    Object.freeze({ key: 'k1Ratio', role: 'check', reads: Object.freeze(['Rd', 'm', 'Wbg']), ja: 'K1 の比の型(受け手の自己の場 1.2 m/R_d と背景の場 W_bg〔場の API の β〕の比)' }),
    Object.freeze({ key: 'engineDefault', role: 'default', reads: Object.freeze(['Rd', 'm']), ja: '既定の列(q = 1・質量の因子 m_ref/m —— 今のエンジンの galaxyAxial の rdPow 1・massPow −1 の型)' }),
    Object.freeze({ key: 'nullP0', role: 'negative', reads: Object.freeze([]), ja: '否定対照(p = 0 —— 受け手に依らない応答)' }),
  ]),
  mainForms: Object.freeze(['ballMean', 'inertiaShare']),
  ballSelfMean: 1.2,   // K1 の自己の場の形 (3 − t²)/2 の単位球の体積平均 = 6/5
  ballInertia: 0.4,    // 一様な球の慣性 (2/5) m R²
  ballRule: Object.freeze({ radial: 4 }),   // 球の平均の求積(動径 Gauss–Legendre〔重み 3r²〕× 正八面体の 6 方向 —— 3 次の多項式まで厳密)
  // 振る範囲(受け手の基準の値の 10^±1 倍・9 点 —— 各軸を独立に)と、広い範囲の応答の表(R_d/R_d,基準 = 10^−2〜10^12 の半桁ごと —— 門を当てない)
  scan: Object.freeze({ decades: 1, points: 9 }),
  wide: Object.freeze({ log10From: -2, log10To: 12, step: 0.5 }),
  // 門(走行の前の宣言): 本の天体の R_d の幅は約 17 自然対数(イオ/太陽 4.5e-8)—— 傾きの幅 1e-4 で f の差は 0.2% の内
  gate: Object.freeze({ tolSlope: 1e-4, tolRes: 1e-4, nearZeroAbs: 1e-12, agreeTol: 1e-4 }),
  uniqueRule: '主の型(ballMean・inertiaShare)の全部が p の候補を返し、候補が agreeTol の内で同じとき「p が 1 つ」',
  // AN561: 源(太陽)の自転を外部の口座に固定する幻の天体の鍵
  fixedSource: Object.freeze({ src: 'sun', ext: 'sunExt' }),
  // AN562(暫定の基準列)・AN563(τ_0 は格子)—— 金星の振幅の記録し直しの型(第327便f の lib の口をそのまま呼ぶ)
  venus: Object.freeze({ solidMain: 'constLag', thermalMain: 'constPhase', solidForms: Object.freeze(['constLag', 'constQ']) }),
  notes: Object.freeze({
    n0: 'N_0 は観測の自転から解いた量(トルクの釣り合いが観測の自転で成り立つ振幅 —— 自転の独立の予言ではない)',
    tau0: 'τ_0 は格子(年齢の点も格子の 1 点 —— 応答の時間を年齢に等置しない)',
    local: '変化の時間 I|Ω|/|N| はその列の瞬間のトルクの局所の尺度(履歴の積分ではない)',
  }),
});
const FORM_KEYS = DECL.forms.map((f) => f.key);

/* ───────── 契約(形の確かめと直接の滑り)───────── */
const SHAPE = Object.freeze({
  frame: ['id', 'origin', 'axis', 'velocityRef', 'timeUnit', 'lengthUnit', 'omegaFrame'],
  omegaField: ['mode', 'value', 'at', 'ref', 'unit', 'source'],
  convergence: ['uConverged', 'curlConverged', 'method', 'gridSigns'],
  transfer: ['id', 'version', 'form', 'gT'],
  ledgerRefs: ['supply', 'reaction', 'heat'],
});
const hasFn = (v) => typeof v === 'function' || (v && typeof v === 'object' && Object.values(v).some(hasFn));
/** 契約の形の確かめ(鍵の有無・null の場所・版・軸の単位・関数を含まない・定数の型・直接の滑りの型) */
export function checkContract(c) {
  const missing = [], nulls = [], errors = [];
  if (!c || typeof c !== 'object') return { ok: false, missing: ['(契約)'], nulls, errors: ['契約が無い'] };
  if (hasFn(c)) errors.push('契約に関数を含めない(ただの JSON の値)');
  if (c.version !== CONTRACT_VERSION) errors.push('版 ' + c.version + '(' + CONTRACT_VERSION + ' を受ける)');
  for (const [blk, keys] of Object.entries(SHAPE)) {
    if (!c[blk] || typeof c[blk] !== 'object') { missing.push(blk); continue; }
    for (const k of keys) { if (!(k in c[blk])) missing.push(blk + '.' + k); else if (c[blk][k] === null) nulls.push(blk + '.' + k); }
  }
  if (!Array.isArray(c.sources)) missing.push('sources');
  else c.sources.forEach((s, i) => { for (const k of ['sourceId', 'owns', 'coef']) if (!(k in s)) missing.push('sources[' + i + '].' + k); });
  if (c.frame && c.frame.axis !== null && c.frame.axis !== undefined && !(vec3(c.frame.axis) && Math.abs(norm(c.frame.axis) - 1) <= 1e-12)) errors.push('frame.axis は単位ベクトル');
  if (c.omegaField && c.omegaField.mode !== 'constant') errors.push('omegaField.mode は constant だけを受ける(AN552)');
  if (c.transfer && c.transfer.form !== 'directSlip') errors.push('transfer.form は directSlip(AN551)');
  return { ok: missing.length === 0 && errors.length === 0, missing, nulls, errors };
}
/** 直接の滑り ν_slip = g_T(Ω_frame − Ω_field) â(欠測が 1 つでもあれば null —— 0 で埋めない) */
export function slipOf(c) {
  const ck = checkContract(c);
  if (!ck.ok) return { ok: false, why: ck.errors.concat(ck.missing.map((m) => '欠け ' + m)).join('・'), vec: null };
  const need = { 'frame.omegaFrame': c.frame.omegaFrame, 'omegaField.value': c.omegaField.value, 'transfer.gT': c.transfer.gT, 'frame.axis': c.frame.axis };
  const miss = Object.entries(need).filter(([, v]) => v === null || v === undefined).map(([k]) => k);
  if (miss.length) return { ok: false, why: '欠測(null)' + miss.join('・') + ' —— 0 で埋めない', missing: miss, vec: null };
  const mag = c.transfer.gT * (c.frame.omegaFrame - c.omegaField.value);
  return { ok: true, mag, axis: c.frame.axis.slice(), vec: scale(c.frame.axis, mag), relFrame: c.frame.omegaFrame - c.omegaField.value };
}

/* ───────── 球の平均(受け手の R_d の球)———————— */
// 動径の Gauss–Legendre(区間 [0, 1]・重み 3r² —— n 点)
function glUnit(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } pp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-16) break; }
    x.push(0.5 * (1 + z)); w.push(1 / ((1 - z * z) * pp * pp));
  }
  return { x, w };
}
const OCTA = Object.freeze([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]);
/** 場 fieldAt(offset[m]) → 3 成分の、半径 R の球の体積平均(動径 × 6 方向 —— 3 次の多項式の場まで厳密) */
export function ballMeanOf(fieldAt, R, rule = DECL.ballRule) {
  if (!(R > 0) || !Number.isFinite(R)) throw new RangeError('ballMeanOf: 半径は正の有限の数');
  const g = glUnit(rule.radial), z = [0, 0, 0];
  let wsum = 0;
  for (let k = 0; k < g.x.length; k++) {
    const r = g.x[k], wr = 3 * r * r * g.w[k];
    for (const d of OCTA) { const v = fieldAt([d[0] * r * R, d[1] * r * R, d[2] * r * R]); if (!vec3(v)) throw new RangeError('ballMeanOf: 場は有限の 3 成分'); for (let c = 0; c < 3; c++) z[c] += wr * v[c] / 6; }
    wsum += wr;
  }
  return scale(z, 1 / wsum);
}

/* ───────── 受け手の演算 ───────── */
const posFin = (x) => Number.isFinite(x) && x > 0;
/** 受け手の演算 F(型・受け手 {Rd, m, I}・env {slip:[3], Wbg, ref:{Rd, m}, fieldAt?})→ {nu:[3], fac}(fac は ν_slip に対する符号つきの係数)。読む量の欠測は fac:null(0 で埋めない) */
export function responseOf(form, recv, env) {
  if (!FORM_KEYS.includes(form)) throw new RangeError('responseOf: 型 ' + form);
  if (!recv || !posFin(recv.Rd) || !posFin(recv.m)) throw new RangeError('responseOf: 受け手の R_d・m は正の有限の数');
  if (!env || !vec3(env.slip)) return { form, fac: null, nu: null, why: '直接の滑りが欠測(null)' };
  const sl = env.slip, s2 = dot(sl, sl);
  let fac;
  if (form === 'ballMean') {
    const fld = env.fieldAt || (() => sl);   // 契約の定数の場(位置に依らない)
    const nu = ballMeanOf(fld, recv.Rd);
    return { form, fac: s2 > 0 ? dot(nu, sl) / s2 : null, nu };
  }
  if (form === 'inertiaShare') {
    if (!posFin(recv.I)) return { form, fac: null, nu: null, why: '天体の慣性 I が欠測' };
    const Ic = DECL.ballInertia * recv.m * recv.Rd * recv.Rd; fac = Ic / (Ic + recv.I);
  } else if (form === 'k1Ratio') {
    if (!(Number.isFinite(env.Wbg) && env.Wbg >= 0) || !env.ref || !posFin(env.ref.Rd) || !posFin(env.ref.m)) return { form, fac: null, nu: null, why: '背景の場 W_bg か基準の天体が欠測' };
    const Ws = DECL.ballSelfMean * recv.m / recv.Rd, Wr = DECL.ballSelfMean * env.ref.m / env.ref.Rd; fac = (env.Wbg + Wr) / (env.Wbg + Ws);
  } else if (form === 'engineDefault') {
    if (!env.ref || !posFin(env.ref.Rd) || !posFin(env.ref.m)) return { form, fac: null, nu: null, why: '基準の R_ref・m_ref が欠測' };
    fac = (recv.Rd / env.ref.Rd) * (env.ref.m / recv.m);
  } else fac = 1;   // nullP0
  return { form, fac, nu: scale(sl, fac) };
}

/* ───────── 指数の測り方と門 ───────── */
/** x0 の 10^±d を n 点(対数で等間隔) */
export function logGrid(x0, d, n) { return Array.from({ length: n }, (_, k) => x0 * Math.pow(10, -d + 2 * d * k / (n - 1))); }
/** 点列 (x, y) の log–log の傾き: 局所の傾き・最小二乗の傾き・直線からの最大の残差(ln)・符号・ほぼ 0 */
export function slopeStats(xs, ys, gate = DECL.gate) {
  const n = xs.length;
  if (ys.some((y) => y === null || !Number.isFinite(y))) return { ok: false, why: '欠測か非有限', n };
  const sg = ys.map(Math.sign), signOk = sg.every((s) => s === sg[0] && s !== 0), nearZero = ys.some((y) => Math.abs(y) < gate.nearZeroAbs);
  if (!signOk) return { ok: false, why: '符号が変わるか 0(log のべきを当てない)', n, signOk, nearZero };
  if (nearZero) return { ok: false, why: 'ほぼ 0 の応答(係数 < ' + gate.nearZeroAbs + ' —— log のべきを当てない)', n, signOk, nearZero };
  const lx = xs.map(Math.log), ly = ys.map((y) => Math.log(Math.abs(y))), loc = [];
  for (let k = 0; k + 1 < n; k++) loc.push((ly[k + 1] - ly[k]) / (lx[k + 1] - lx[k]));
  const mx = lx.reduce((a, b) => a + b, 0) / n, my = ly.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let k = 0; k < n; k++) { sxy += (lx[k] - mx) * (ly[k] - my); sxx += (lx[k] - mx) ** 2; }
  const slope = sxy / sxx, icpt = my - slope * mx, maxRes = Math.max(...lx.map((x, k) => Math.abs(ly[k] - (icpt + slope * x))));
  const lmin = Math.min(...loc), lmax = Math.max(...loc);
  return { ok: true, n, slope, localMin: lmin, localMax: lmax, spread: lmax - lmin, maxRes, signOk, nearZero, sign: sg[0] };
}
/** 一定の指数の門(傾きの幅と残差) */
export function constantOf(st, gate = DECL.gate) { return !!st && st.ok === true && st.spread <= gate.tolSlope && st.maxRes <= gate.tolRes; }
/** 1 つの型を固定の位置で測る(base = 受け手 {Rd, m, I} —— 各軸を独立に・K1 の線〔R_d と m を同じ倍率〕・広い範囲の R_d の表) */
export function measureForm(form, base, env, D = DECL) {
  const fac = (r) => responseOf(form, r, env).fac, sc = D.scan;
  const axis = (key) => { const xs = logGrid(base[key], sc.decades, sc.points), ys = xs.map((x) => fac(Object.assign({}, base, { [key]: x }))); return Object.assign(slopeStats(xs, ys), { xs, ys }); };
  const reads = DECL.forms.find((f) => f.key === form).reads;
  const a = axis('Rd'), b = axis('m'), c = posFin(base.I) ? axis('I') : null;
  const jx = logGrid(1, sc.decades, sc.points), jy = jx.map((x) => fac(Object.assign({}, base, { Rd: base.Rd * x, m: base.m * x }))), joint = Object.assign(slopeStats(jx.map((x) => base.Rd * x), jy), { xs: jx.map((x) => base.Rd * x), ys: jy });
  const wx = [];
  for (let e = D.wide.log10From; e <= D.wide.log10To + 1e-9; e += D.wide.step) wx.push(base.Rd * Math.pow(10, e));
  const wy = wx.map((x) => fac(Object.assign({}, base, { Rd: x }))), wide = wx.map((x, k) => ({ RdOverBase: x / base.Rd, fac: wy[k], localSlope: k > 0 && wy[k] > 0 && wy[k - 1] > 0 ? Math.log(wy[k] / wy[k - 1]) / Math.log(wx[k] / wx[k - 1]) : null }));
  return { form, reads, base, a, b, c, joint, wide };
}
/** 本の天体の f_i = F_i/F_ref と ln f = p ln(R_d/R_d,ref) の原点を通る直線の p・残差 */
export function bodyFit(form, bodies, env, refKey, gate = DECL.gate) {
  const ref = bodies.find((q) => q.key === refKey), F0 = responseOf(form, ref, env).fac;
  const rows = bodies.map((q) => { const F = responseOf(form, q, env).fac; return { key: q.key, Rd: q.Rd, m: q.m, I: q.I, fac: F, f: F !== null && F0 ? F / F0 : null, x: Math.log(q.Rd / ref.Rd) }; });
  if (rows.some((r) => !(r.f > 0))) return { ok: false, why: '符号が変わるか欠測', rows, constant: false, p: null };
  let sxy = 0, sxx = 0;
  for (const r of rows) { const y = Math.log(r.f); sxy += r.x * y; sxx += r.x * r.x; }
  const p = sxy / sxx, maxRes = Math.max(...rows.map((r) => Math.abs(Math.log(r.f) - p * r.x))), nz = rows.filter((r) => Math.abs(r.fac) < gate.nearZeroAbs).map((r) => r.key);
  // ほぼ 0 の応答(係数 < nearZeroAbs)を含む線は門の外(log のべきを当てない —— 直線の p と残差は参考の記録)
  if (nz.length) return { ok: false, why: 'ほぼ 0 の応答(係数 < ' + gate.nearZeroAbs + ' —— log のべきを当てない)', rows, constant: false, p, maxRes, nearZero: nz };
  return { ok: true, rows, p, maxRes, constant: maxRes <= gate.tolRes, nearZero: nz };
}
/** 型の判定: 一定の指数(R_d・m・I を独立に)と本の天体の線の p。候補は両方を満たすときだけ(成り立たなければ応答の表 —— p:null) */
export function verdictOf(meas, fit, gate = DECL.gate) {
  const cA = constantOf(meas.a, gate), cB = constantOf(meas.b, gate), cC = meas.c === null ? true : constantOf(meas.c, gate), cJ = constantOf(meas.joint, gate);
  const constantExponent = cA && cB && cC;
  const sl = (s) => (s && s.ok ? s.slope : null);
  const aS = sl(meas.a), bS = sl(meas.b), cS = meas.c ? sl(meas.c) : 0;
  const dependsOnOther = meas.c !== null && cS !== null && Math.abs(cS) > gate.tolSlope;
  const candidate = constantExponent && fit.ok && fit.constant;
  const sameAsNegative = candidate && fit.rows.every((r) => r.f === 1) && Math.abs(aS) <= gate.tolSlope && Math.abs(bS) <= gate.tolSlope;
  const cancellation = candidate && aS !== null && bS !== null && Math.abs(aS) > gate.tolSlope && Math.abs(aS + bS) <= gate.tolSlope;
  return { form: meas.form, constantRd: cA, constantM: cB, constantI: cC, constantJoint: cJ, constantExponent, slopeRd: aS, slopeM: bS, slopeI: meas.c ? cS : null, slopeJoint: sl(meas.joint),
    k1Line: aS !== null && bS !== null ? aS + bS : null, dependsOnOther, bodyFitOk: fit.ok && fit.constant, bodyP: fit.p === undefined ? null : fit.p, bodyMaxRes: fit.maxRes === undefined ? null : fit.maxRes, bodyNearZero: fit.nearZero || [],
    p: candidate ? fit.p : null, consistent: candidate ? Math.abs(fit.p - (aS + bS)) <= gate.tolSlope : null, sameAsNegative, cancellation,
    verdict: candidate ? (sameAsNegative ? 'candidate-sameAsNegativeControl' : (cancellation ? 'candidate-cancellation' : 'candidate')) : 'table' };
}
/** p が 1 つか(宣言の規則 —— 主の型の全部が候補・agreeTol の内で同じ) */
export function uniquenessOf(verdicts, mainForms = DECL.mainForms, gate = DECL.gate) {
  const main = mainForms.map((k) => verdicts.find((v) => v.form === k));
  const allMain = main.every((v) => v && v.p !== null), ps = main.filter((v) => v && v.p !== null).map((v) => v.p);
  const agree = ps.length > 0 && Math.max(...ps) - Math.min(...ps) <= gate.agreeTol;
  const cands = verdicts.filter((v) => v.p !== null && DECL.forms.find((f) => f.key === v.form).role !== 'default' && DECL.forms.find((f) => f.key === v.form).role !== 'negative');
  return { unique: allMain && agree, allMainCandidates: allMain, agree, p: allMain && agree ? ps[0] : null, candidates: cands.map((v) => ({ form: v.form, p: v.p, verdict: v.verdict })),
    tables: main.filter((v) => v && v.p === null).map((v) => v.form), rule: DECL.uniqueRule };
}

/* ───────── AN561 源の自転を外部の口座に固定した列 ───────── */
/** 系(第327便a の形)の源 src の K1 の口を幻の天体 ext(源と同じ自転と軸・口なし)へ回した写し */
export function fixSource(sys, src = DECL.fixedSource.src, ext = DECL.fixedSource.ext) {
  const s0 = sys.find((b) => b.key === src);
  if (!s0) throw new RangeError('fixSource: 源 ' + src + ' が系に無い');
  const out = sys.map((b) => Object.assign({}, b, { ports: b.ports.map((q) => (q.kind === 'k1' && q.src === src ? Object.assign({}, q, { src: ext }) : q)) }));
  out.push({ key: ext, s: s0.s, a: s0.a.slice(), f: 1, Rd: s0.Rd, ports: [], external: true });
  return out;
}
/** 外部の口座(幻の天体の行): 源を固定に保つトルク(軸の向き)と供給の仕事(= K1 の口の供給 —— 移し替えの照合) */
export function externalAccount(ev, sys2, ext = DECL.fixedSource.ext) {
  const i = sys2.findIndex((b) => b.key === ext), react = ev.react[i], s = sys2[i].s;
  return { torqueAlong: -react, work: -react * s, k1Draw: ev.ledger.k1Draw, workVsDrawRel: relD(-react * s, ev.ledger.k1Draw) };
}
/** 固定の列を解く(第327便a の solve —— 幻の天体の行は採否から外す:口が無いので残差は外部の口座のトルク) */
export function solveFixed(sys, prm, src = DECL.fixedSource.src, ext = DECL.fixedSource.ext) {
  const sys2 = fixSource(sys, src, ext), r = LS.solve(sys2, prm, src), real = r.rows.filter((q) => q.key !== ext);
  const iE = sys2.findIndex((b) => b.key === ext), alongReal = Math.max(...r.ev.rows.filter((_, k) => k !== iE).map((q) => q.alongRel));
  const acc = externalAccount(r.ev, sys2, ext), L0 = r.ev.ledger;
  const spinReal = r.ev.rows.reduce((a, q, k) => (k === iE ? a : a + q.alongResidual * q.s), 0);
  const res = L0.galaxySupply + L0.orbitWork + acc.work - L0.heat - spinReal;
  return Object.assign(r, { sys2, accepted: real.every((q) => q.rejected !== true), alongMaxRel: alongReal, external: acc,
    ledgerFixed: { galaxySupply: L0.galaxySupply, orbitWork: L0.orbitWork, externalWork: acc.work, heat: L0.heat, spinReal, residualRel: Math.abs(res) / Math.max(Math.abs(L0.galaxySupply), Math.abs(L0.orbitWork), Math.abs(acc.work), Math.abs(L0.heat), 1e-300),
      LTotalRel: L0.L.totalRel } });
}

/* ───────── AN566 局所の尺度 ───────── */
export function localScale({ I, s, N }) {
  if (!(I > 0) || !Number.isFinite(s) || !Number.isFinite(N)) throw new RangeError('localScale: 入力');
  return { tChange: N === 0 ? Infinity : I * Math.abs(s) / Math.abs(N), kind: 'local-instantaneous', note: DECL.notes.local };
}

/* ───────── 純関数の場面(QA lint.response328b と器の P 段)———————— */
export function toyContract(o = {}) {
  return { version: CONTRACT_VERSION, frame: { id: 'toy', origin: 'toy-origin', axis: [0, 0, 1], velocityRef: 'toy', timeUnit: 's', lengthUnit: 'm', omegaFrame: 'omegaFrame' in o ? o.omegaFrame : 1e-15 },
    omegaField: { mode: o.mode || 'constant', value: 'value' in o ? o.value : 2e-6, at: { R_kpc: 8, z_kpc: 0 }, ref: 'toy', unit: 'rad/s', source: 'declared' },
    convergence: { uConverged: null, curlConverged: null, method: 'toy', gridSigns: null }, sources: [{ sourceId: 'toy:all', owns: ['all'], coef: 1 }],
    transfer: { id: 'directSlip', version: 'toy-1', form: 'directSlip', gT: 'gT' in o ? o.gT : 1 }, ledgerRefs: { supply: 'galaxySupply', reaction: 'k1Transfer.sourceReactionWork', heat: 'heat' } };
}
export function pureScenes() {
  const S = {};
  // ① 契約: 形・直接の滑り・欠測は null(0 で埋めない)・版の違い・軸が単位でない・関数・定数でない型の拒否
  { const c = toyContract(), sl = slipOf(c), cn = slipOf(toyContract({ omegaFrame: null })), cg = slipOf(toyContract({ gT: null }));
    const bad = [Object.assign(toyContract(), { version: 'other' }), Object.assign(toyContract(), { frame: Object.assign(toyContract().frame, { axis: [0, 0, 2] }) }),
      Object.assign(toyContract(), { transfer: Object.assign(toyContract().transfer, { gT: () => 1 }) }), toyContract({ mode: 'field' })].map((x) => checkContract(x).ok);
    S.contract = { ok: checkContract(c).ok, nulls: checkContract(c).nulls, mag: sl.mag, expect: 1 * (1e-15 - 2e-6), nullFrame: cn.ok === false && cn.vec === null && /null/.test(cn.why), nullGain: cg.ok === false && cg.vec === null, badAllRejected: bad.every((x) => x === false) }; }
  // ② 球の平均: 一次の場は中心の値・二次の場は中心 + (R²/10)∇²・定数の契約の場は R_d に依らない(同じビット)
  { const c0 = [1, -2, 3], G = [[0.3, 0.1, -0.2], [0.05, -0.4, 0.2], [0.1, 0.2, 0.7]], lin = (x) => [c0[0] + G[0][0] * x[0] + G[0][1] * x[1] + G[0][2] * x[2], c0[1] + G[1][0] * x[0] + G[1][1] * x[1] + G[1][2] * x[2], c0[2] + G[2][0] * x[0] + G[2][1] * x[1] + G[2][2] * x[2]];
    const Hq = [0.5, -0.25, 0.75], quad = (x) => [c0[0] + Hq[0] * (x[0] * x[0] + 2 * x[1] * x[1]), c0[1] + Hq[1] * x[2] * x[2], c0[2] + Hq[2] * (x[0] * x[1] + x[2] * x[2])], R = 0.7;
    const mL = ballMeanOf(lin, R), mQ = ballMeanOf(quad, R), lap = [Hq[0] * (2 + 4), Hq[1] * 2, Hq[2] * 2], expQ = [c0[0] + R * R / 10 * lap[0], c0[1] + R * R / 10 * lap[1], c0[2] + R * R / 10 * lap[2]];
    const env = { slip: [0, 0, -7e-6] }, facs = [1e-3, 1, 1e4, 1e9].map((Rd) => responseOf('ballMean', { Rd, m: 1, I: 1 }, env).fac);
    S.ball = { linRel: Math.max(...[0, 1, 2].map((k) => relD(mL[k], c0[k]))), quadRel: Math.max(...[0, 1, 2].map((k) => relD(mQ[k], expQ[k]))), constSame: facs.every((f) => f === facs[0]), constFac: facs[0] }; }
  // ③ 既定の列と否定対照: 既定は R_d の指数 1・m の指数 −1(厳密)・K1 の線で 0(相殺)。否定対照は 0・0。K1 の線だけを振る読みは両方 0(見分けない)—— 独立に振ると見分ける
  { const env = { slip: [0, 0, 1], ref: { Rd: 2, m: 3 } }, base = { Rd: 2e-3, m: 3e-3, I: 5 }, dm = measureForm('engineDefault', base, env), nm = measureForm('nullP0', base, env);
    S.defaultNeg = { dRd: dm.a.slope, dM: dm.b.slope, dJoint: dm.joint.slope, dSpread: Math.max(dm.a.spread, dm.b.spread), nRd: nm.a.slope, nM: nm.b.slope, nJoint: nm.joint.slope,
      jointBlind: Math.abs(dm.joint.slope) <= 1e-12 && Math.abs(nm.joint.slope) <= 1e-12, independentSees: Math.abs(dm.a.slope - nm.a.slope) > 0.5 }; }
  // ④ 正の対照(玩具の型 fac = (R_d/R_0)^1.7 (m/m_0)^−0.3 —— 測り方を確かめるため lib の外の関数で): 指数 1.7・−0.3・K1 の線 1.4・本の天体の線(R_d ∝ m)の p 1.4
  { const toy = (r) => Math.pow(r.Rd / 1e-2, 1.7) * Math.pow(r.m / 4, -0.3), xs = logGrid(1e-2, 1, 9);
    const sa = slopeStats(xs, xs.map((x) => toy({ Rd: x, m: 4 }))), sb = slopeStats(logGrid(4, 1, 9), logGrid(4, 1, 9).map((m) => toy({ Rd: 1e-2, m })));
    const bodies = [1, 1e-3, 3e-5, 2e-7].map((k, i) => ({ key: 'b' + i, Rd: 1e-2 * k, m: 4 * k })), f = bodies.map((q) => toy(q) / toy(bodies[0])), xb = bodies.map((q) => Math.log(q.Rd / bodies[0].Rd));
    const pb = xb.reduce((s, x, i) => s + x * Math.log(f[i]), 0) / xb.reduce((s, x) => s + x * x, 0);
    S.positive = { a: sa.slope, b: sb.slope, aConst: constantOf(sa), bConst: constantOf(sb), pBody: pb }; }
  // ⑤ 一定の指数が成り立たない例: K1 の比の型で背景の場が範囲の中で効く(傾き 1 → 0 —— 門を落とす)・符号が変わる応答・ほぼ 0 の応答
  { const env = { slip: [0, 0, 1], Wbg: 1.2 * 1 / 1e-3, ref: { Rd: 1e-3, m: 1 } }, mk = measureForm('k1Ratio', { Rd: 1e-3, m: 1, I: 1 }, env);
    const xs = logGrid(1, 1, 9), sgn = slopeStats(xs, xs.map((x) => Math.log(x))), nz = slopeStats(xs, xs.map((x) => 1e-14 * x));
    S.notConstant = { k1Spread: mk.a.spread, k1Const: constantOf(mk.a), signRejected: sgn.ok === false && sgn.signOk === false, nearZeroRejected: nz.ok === false && nz.nearZero === true }; }
  // ⑥ 慣性で配る型: I_c ≪ I で R_d の指数 2・m の指数 1・I の指数 −1・本の天体の慣性が R_d に比例しなければ本の線に p が無い(応答の表)
  { const env = { slip: [0, 0, 1] }, base = { Rd: 1e-3, m: 1, I: 10 }, mi = measureForm('inertiaShare', base, env);
    const bodies = [{ key: 'ref', Rd: 1e-3, m: 1, I: 10 }, { key: 'x', Rd: 1e-5, m: 1e-2, I: 3e-1 }, { key: 'y', Rd: 1e-6, m: 1e-3, I: 5e-5 }, { key: 'z', Rd: 3e-8, m: 3e-5, I: 2e-6 }];
    const fit = bodyFit('inertiaShare', bodies, env, 'ref'), v = verdictOf(mi, fit);
    S.inertia = { a: mi.a.slope, b: mi.b.slope, c: mi.c.slope, constant: v.constantExponent, bodyConstant: fit.constant, verdict: v.verdict, p: v.p }; }
  // ⑦ AN561: 太陽(源)の自転を外部の口座に固定 —— A は太陽だけの式の値・外部の仕事 = K1 の口の供給・帳簿と L が閉じる(主列 —— 反作用あり —— も同じ帳簿で閉じる)
  { const a = [0, 0, 1], aP = [Math.sin(0.1), 0, Math.cos(0.1)], g = [0.4, 0, -0.9165151389911680];
    const sys = [{ key: 'sun', s: 2, a, f: 1, Rd: 1, ports: [{ kind: 'gal' }] }, { key: 'P', s: -0.5, a: aP, f: 3, Rd: 1e-3, ports: [{ kind: 'gal' }, { kind: 'k1', src: 'sun', t: [0.05, 0, -0.2] }, { kind: 'tide', src: 'sun', n: [0, 0.01, 0.4], y: 1 }] }];
    const prm = { family: 'E', g, gamma0: { sun: 4, P: 0.3 }, beta: {}, alloc: LS.DECL.allocations.equal };
    const cpl = LS.solve(sys, prm), fx = solveFixed(sys, prm), Aexp = 2 / (1 * dot(g, a));
    S.fixed = { Acpl: cpl.A, Afix: fx.A, AfixRel: relD(fx.A, Aexp), AmovedRel: relD(cpl.A, fx.A), betaCpl: cpl.beta.P, betaFix: fx.beta.P, accepted: fx.accepted, along: fx.alongMaxRel, ledgerRel: fx.ledgerFixed.residualRel,
      LRel: fx.ledgerFixed.LTotalRel, workVsDraw: fx.external.workVsDrawRel, extTorque: fx.external.torqueAlong, cplLedgerRel: cpl.ev.ledger.residualRel, cplLRel: cpl.ev.ledger.L.totalRel }; }
  // ⑧ 入力の拒否と欠測(負の R_d・未知の型・k1Ratio の W_bg の欠測は null —— 0 で埋めない)・局所の尺度
  { const rej = [() => responseOf('ballMean', { Rd: -1, m: 1 }, { slip: [0, 0, 1] }), () => responseOf('other', { Rd: 1, m: 1 }, { slip: [0, 0, 1] }), () => localScale({ I: -1, s: 1, N: 1 })].every((f) => { try { f(); return false; } catch (e) { return true; } });
    const miss = responseOf('k1Ratio', { Rd: 1, m: 1 }, { slip: [0, 0, 1], Wbg: null, ref: { Rd: 1, m: 1 } }), missI = responseOf('inertiaShare', { Rd: 1, m: 1 }, { slip: [0, 0, 1] }), ls = localScale({ I: 2, s: -3, N: 0.5 });
    S.reject = { rejected: rej, wbgNull: miss.fac === null && miss.nu === null, inertiaNull: missI.fac === null, local: ls.tChange, localKind: ls.kind }; }
  return S;
}
export function pureGates(S) {
  const close = (x, y, t = 1e-12) => Math.abs(x - y) <= t * Math.max(1, Math.abs(x), Math.abs(y));
  return {
    contractShape: S.contract.ok && close(S.contract.mag, S.contract.expect) && S.contract.nullFrame && S.contract.nullGain && S.contract.badAllRejected && S.contract.nulls.includes('convergence.uConverged'),
    ballMean: S.ball.linRel <= 1e-14 && S.ball.quadRel <= 1e-12 && S.ball.constSame === true && close(S.ball.constFac, 1, 1e-15),
    defaultAndNegative: close(S.defaultNeg.dRd, 1) && close(S.defaultNeg.dM, -1) && S.defaultNeg.dSpread <= 1e-12 && S.defaultNeg.nRd === 0 && S.defaultNeg.nM === 0 && S.defaultNeg.jointBlind && S.defaultNeg.independentSees,
    positiveControl: close(S.positive.a, 1.7) && close(S.positive.b, -0.3) && S.positive.aConst && S.positive.bConst && close(S.positive.pBody, 1.4),
    notConstantRejected: S.notConstant.k1Const === false && S.notConstant.k1Spread > 0.1 && S.notConstant.signRejected && S.notConstant.nearZeroRejected,
    inertiaTable: Math.abs(S.inertia.a - 2) <= 1e-6 && Math.abs(S.inertia.b - 1) <= 1e-6 && Math.abs(S.inertia.c + 1) <= 1e-6 && S.inertia.constant === true && S.inertia.bodyConstant === false && S.inertia.verdict === 'table' && S.inertia.p === null,
    fixedSource: S.fixed.AfixRel <= 1e-12 && S.fixed.AmovedRel > 1e-6 && S.fixed.along <= 1e-12 && S.fixed.ledgerRel <= 1e-12 && S.fixed.LRel <= 1e-12 && S.fixed.workVsDraw <= 1e-12 && S.fixed.cplLedgerRel <= 1e-12 && S.fixed.cplLRel <= 1e-12,
    rejectAndNull: S.reject.rejected && S.reject.wbgNull && S.reject.inertiaNull && close(S.reject.local, 12) && S.reject.localKind === 'local-instantaneous',
  };
}

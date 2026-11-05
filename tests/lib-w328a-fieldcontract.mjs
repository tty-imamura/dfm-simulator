// 第328便a(原仮定者の回答(2026-11-05 —— AN551・AN552・AN553)・統括の検証項目 R301): **場の API の opt-in の契約と直接の滑りの宣言の型の純関数**
//   (器 tests/exp-w328a-fieldcontract.mjs と QA lint.fieldContract328a・behavior.fieldContract328a が読む —— html を読まない・状態を持たない・
//   第321便c の場の API〔tests/lib-w321c-galfield.mjs の sample〕の本文は変えない —— 包むだけ)。
//
// ■ 何をするか(宣言 —— 探索の候補。今の DFM の式から導いた法則ではない)
//   契約(版 CONTRACT_VERSION): 第321便c の場の API の出力に、枠・場の角速度 Ω_field の宣言・収束の印(u と curl を別に)・由来 ID と所有の範囲・伝達の版と係数・
//     帳簿の口座への参照(第326便d の lib の口座の名前 —— 参照だけ)を**ただの JSON の値**で添える(AN553 = B —— 帳簿の計算は第326便d の lib に残す)。
//     **opt-in**: sampleWithContract(位置, 時刻, 源の宣言, opts) は opts.contract が無ければ第321便c の sample の戻り値そのもの(同じ関数・同じ引数 —— ビット同一)。
//     opts.contract があれば sample の戻り値に鍵 fieldContract を 1 つ足すだけ(sample の他の鍵は変えない —— 既存の鍵 contract〔第321便c の記述〕とは別の名)。
//     **欠測は null**(0 で埋めない —— 宣言の無い Ω_field・g_T・収束の印は null)。
//   直接の滑り(AN551 = A —— 本の宣言の型): ν_G = g_T (Ω_arm − Ω_field) ĝ(g_T ≥ 0・Ω_field > 0 は場の軸を反転しない宣言・Ω_arm は受け手の側〔腕の枠〕の入力 —— 契約の外)。
//     剛体の読み・半渦度・シア・K1 の源の幾何は**対照の列**(第327便b の lib の候補 —— 本 lib は持たない)。
//   双対(反作用と仕事を同じ係数で): 直接の滑りを伝達のベクトル t_arm = g_T ĝ(腕の口座 —— ν の Ω_arm の分)と t_field = −g_T ĝ(場の口座 —— Ω_field の分)の和と読み、
//     反作用は第326便d の k1 の口と同じ型 τ = −t·N(腕 −g_T(N·ĝ)・場 +g_T(N·ĝ) —— 同じ係数・和は 0)・引き落とす仕事は −τ Ω(和 = N·ν —— 一度だけ数える)・
//     角運動量の残り −N は銀河の中心の口座(第326便d の L.galaxyCenter —— 仕事 0 の分を含めて同じ口座)。
//   場の角速度の宣言(AN552 = A): 定数の Ω_field(太陽系近傍の局所 —— 位置・基準・単位を添える)。太陽の式は検査(g_T と Ω_field は太陽の 1 式で縮退 —— ランク 1・解かない)。
//   収束の印: 点のセルの和の格子の列と主の経路(環の積分)から u と curl を別に判定(u が近いことを curl の収束とみなさない —— 第327便b の格子の符号の交互)。
// ■ 言わないこと: Ω_field の値は宣言の候補(同定の値ではない)・銀河場の同定と数えない・腕より速い場は観測の量ではない・符号だけからトルクの向きを導いたと書かない
//   (直接の滑りは構成則の採用)・座標の枠を変える操作と新しい場を足す操作を混ぜない(Ω_field を宣言しても u は変えない)・回転曲線の予言ではない。
import * as F from './lib-w321c-galfield.mjs';
import * as L6 from './lib-w326d-axialheat.mjs';

export const LIB_VERSION = 'w328a-fieldcontract-lib-1';
/** 契約の版(形を変えたら上げる —— 第328便の共通の形) */
export const CONTRACT_VERSION = 'w328a-fieldcontract-1';
/** 伝達の型の名と版(直接の滑り —— AN551 = A) */
export const TRANSFER_ID = 'directSlip';
export const TRANSFER_VERSION = 'w328a-directslip-1';
/** 包む場の API の版(第321便c の lib —— 本 lib はこの版の sample の戻り値に契約を添える) */
export const BASE_FIELD_VERSION = 'w321c-galfield-2';
export const BASE_LIB_VERSION = 'w321c-galfield-lib-2';
/** 契約の鍵(順も固定 —— 共通ブリーフの形) */
export const CONTRACT_KEYS = Object.freeze(['version', 'frame', 'omegaField', 'convergence', 'sources', 'transfer', 'ledgerRefs']);
export const SUB_KEYS = Object.freeze({
  frame: Object.freeze(['id', 'origin', 'axis', 'velocityRef', 'timeUnit', 'lengthUnit', 'omegaFrame']),
  omegaField: Object.freeze(['mode', 'value', 'at', 'ref', 'unit', 'source']),
  convergence: Object.freeze(['uConverged', 'curlConverged', 'method', 'gridSigns']),
  source: Object.freeze(['sourceId', 'owns', 'coef']),
  transfer: Object.freeze(['id', 'version', 'form', 'gT']),
  ledgerRefs: Object.freeze(['supply', 'reaction', 'heat']),
});
/** 帳簿の口座への参照(第326便d の lib の evaluate の ledger の鍵 —— 名前だけ・版つき) */
export const LEDGER_REFS = Object.freeze({ supply: L6.LIB_VERSION + '#ledger.galaxySupply', reaction: L6.LIB_VERSION + '#ledger.L.galaxyCenter', heat: L6.LIB_VERSION + '#ledger.heat' });

/** 帳簿の参照を第326便d の evaluate の ledger の上で引く(版が違えば null —— 参照だけ・計算はしない) */
export function resolveLedgerRef(ref, ledger) {
  const m = /^([^#]+)#ledger\.(.+)$/.exec(String(ref));
  if (!m || m[1] !== L6.LIB_VERSION || !isObj(ledger)) return null;
  const v = m[2].split('.').reduce((x, k) => (x !== null && typeof x === 'object' && k in x ? x[k] : undefined), ledger);
  return v === undefined ? null : v;
}

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  // 枠(場の API の座標 —— 第321便c の sample の記述: +z = ĝ・+x = 銀河の中心 → 太陽・速度の基準は源の流れの銀河中心系)
  frameOrigin: '銀河の中心(場の API の銀河中心系の原点)',
  axis: Object.freeze([0, 0, 1]),
  timeUnit: 's',
  // 回転する枠の入力は版 1 の外(源の速さから Ω_frame ĝ × x′ を引く積分が要る —— 場の API の次の版)。版 1 の枠は場の API の回転しない銀河中心系だけ(0 は宣言の値 —— 欠測ではない)
  omegaFrame: 0,
  // 場の角速度の宣言の型(AN552 = A —— 定数だけ)と既定の基準
  omegaFieldModes: Object.freeze(['constant']),
  omegaFieldRef: '遠方の枠(回転しない銀河中心系)での ĝ の向きの成分',
  // 収束の印の判定(走行の前に置く): u —— 最後の格子の主の経路に対する相対の差 ≤ uTolRel かつ最後の 2 つで縮む / curl —— 符号が全部同じかつ最後の相対の差 ≤ curlTolRel
  uTolRel: 1e-3, curlTolRel: 1e-2,
  convergenceMethod: '点のセルの和の格子の列(粗 → 細)と主の経路(環の積分)の比べ —— u は最後の格子の相対の差 ≤ 1e-3 で縮む・curl(半渦度の ĝ の成分)は符号が全部同じで最後の相対の差 ≤ 1e-2(環の積分と中心差分の照合の差とは別の経路)',
});

const vec3 = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const sgnOf = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const onlyKeys = (o, allowed, what) => { for (const k of Object.keys(o)) if (!allowed.includes(k)) throw new RangeError(what + ': 知らない鍵 ' + k); };

/* ───────── 契約の部品 ───────── */
/** 枠(版 1 は場の API の回転しない銀河中心系だけ —— omegaFrame が 0 以外なら拒否: 座標の枠を変える操作は新しい場を足す操作と別・版 1 は枠を変えない) */
export function frameOf(sampleOut, declFrame) {
  const d = declFrame === undefined || declFrame === null ? {} : declFrame;
  if (!isObj(d)) throw new RangeError('frame の宣言は object');
  onlyKeys(d, ['omegaFrame'], 'frame');
  if (!(d.omegaFrame === undefined || d.omegaFrame === null || d.omegaFrame === 0)) throw new RangeError('frame.omegaFrame: 回転する枠は版 1 の外(座標の枠を変える操作 —— 源の速さから Ω_frame ĝ × x′ を引く積分が要る)');
  const c = sampleOut.contract || {};
  return { id: typeof c.frame === 'string' ? c.frame : null, origin: DECL.frameOrigin, axis: DECL.axis.slice(), velocityRef: typeof c.velocityRef === 'string' ? c.velocityRef : null,
    timeUnit: DECL.timeUnit, lengthUnit: c.units && typeof c.units.position === 'string' ? c.units.position : null, omegaFrame: DECL.omegaFrame };
}
/** 場の角速度の宣言(定数だけ —— 値は正の有限の数か null。0 以下は場の軸の反転か無い場 —— 拒否。値があれば位置 at と基準 ref が要る) */
export function omegaFieldOf(declOF) {
  const nul = { mode: 'constant', value: null, at: null, ref: null, unit: 'rad/s', source: null };
  if (declOF === undefined || declOF === null) return nul;
  if (!isObj(declOF)) throw new RangeError('omegaField の宣言は object');
  onlyKeys(declOF, ['mode', 'value', 'at', 'ref', 'unit', 'source'], 'omegaField');
  const mode = declOF.mode === undefined ? 'constant' : declOF.mode;
  if (!DECL.omegaFieldModes.includes(mode)) throw new RangeError('omegaField.mode は constant だけ(AN552 = A —— 動径の形は版 1 の外)');
  if (!(declOF.unit === undefined || declOF.unit === 'rad/s')) throw new RangeError('omegaField.unit は rad/s');
  if (!(declOF.source === undefined || declOF.source === 'declared')) throw new RangeError('omegaField.source は declared だけ(観測・推定の値を入れない)');
  const v = declOF.value === undefined ? null : declOF.value;
  if (v === null) return Object.assign(nul, { mode });
  if (!Number.isFinite(v) || !(v > 0)) throw new RangeError('omegaField.value は正の有限の数(0 以下は場の軸の反転か無い場 —— 拒否)か null');
  const at = declOF.at;
  if (!(isObj(at) && Number.isFinite(at.R_kpc) && at.R_kpc > 0 && Number.isFinite(at.z_kpc))) throw new RangeError('omegaField.at は { R_kpc > 0, z_kpc }(宣言の位置)');
  return { mode, value: v, at: { R_kpc: at.R_kpc, z_kpc: at.z_kpc }, ref: typeof declOF.ref === 'string' && declOF.ref ? declOF.ref : DECL.omegaFieldRef, unit: 'rad/s', source: 'declared' };
}
/** 収束の印(judgeConvergence の結果をそのまま —— 無ければ全部 null) */
export function convergenceOf(declConv) {
  if (declConv === undefined || declConv === null) return { uConverged: null, curlConverged: null, method: null, gridSigns: null };
  if (!isObj(declConv)) throw new RangeError('convergence の宣言は object');
  onlyKeys(declConv, SUB_KEYS.convergence, 'convergence');
  const b = (x) => (x === true || x === false ? x : null);
  const gs = Array.isArray(declConv.gridSigns) && declConv.gridSigns.every((s) => s === 1 || s === -1 || s === 0) ? declConv.gridSigns.slice() : null;
  return { uConverged: b(declConv.uConverged), curlConverged: b(declConv.curlConverged), method: typeof declConv.method === 'string' ? declConv.method : null, gridSigns: gs };
}
/** 由来(sample の source.terms —— sourceId = 模型の名:項の key・owns は所有の範囲の文字列・coef は宣言の係数)。有効域の外の出力は source が無い —— null */
export function sourcesOf(sampleOut) {
  const s = sampleOut.source;
  if (!(s && Array.isArray(s.terms))) return null;
  return s.terms.map((t) => ({ sourceId: String(s.model) + ':' + String(t.key), owns: Array.isArray(t.owns) ? t.owns.map(String) : null, coef: Number.isFinite(t.coef) ? t.coef : null }));
}
/** 伝達の宣言(直接の滑り —— g_T は 0 以上の有限の数か null) */
export function transferDeclOf(declT) {
  const base = { id: TRANSFER_ID, version: TRANSFER_VERSION, form: 'directSlip', gT: null };
  if (declT === undefined || declT === null) return base;
  if (!isObj(declT)) throw new RangeError('transfer の宣言は object');
  onlyKeys(declT, ['form', 'gT'], 'transfer');
  if (!(declT.form === undefined || declT.form === 'directSlip')) throw new RangeError('transfer.form は directSlip だけ(剛体・半渦度・シア・K1 の幾何は対照の列 —— 契約の伝達ではない)');
  const g = declT.gT === undefined ? null : declT.gT;
  if (!(g === null || (Number.isFinite(g) && g >= 0))) throw new RangeError('transfer.gT は 0 以上の有限の数か null(負の利得は場に対する向きを二重に反転する —— 拒否)');
  return Object.assign(base, { gT: g });
}

/**
 * **契約の作り手** buildFieldContract(sampleOut, decl) —— sampleOut は第321便c の sample の戻り値(版 BASE_FIELD_VERSION)、decl は { frame?, omegaField?, convergence?, transfer? }。
 * 戻り値はただの JSON の値(関数・undefined・非有限の数を含まない)。sampleOut は読むだけ(書き換えない)。
 */
export function buildFieldContract(sampleOut, decl) {
  if (!(isObj(sampleOut) && sampleOut.version === BASE_FIELD_VERSION && isObj(sampleOut.contract))) throw new RangeError('buildFieldContract: sampleOut は第321便c の sample の戻り値(版 ' + BASE_FIELD_VERSION + ')');
  const d = decl === undefined || decl === null ? {} : decl;
  if (!isObj(d)) throw new RangeError('buildFieldContract: decl は object');
  onlyKeys(d, ['frame', 'omegaField', 'convergence', 'transfer'], 'decl');
  return { version: CONTRACT_VERSION, frame: frameOf(sampleOut, d.frame), omegaField: omegaFieldOf(d.omegaField), convergence: convergenceOf(d.convergence),
    sources: sourcesOf(sampleOut), transfer: transferDeclOf(d.transfer), ledgerRefs: Object.assign({}, LEDGER_REFS) };
}
/**
 * **opt-in の口** —— sampleWithContract(positionKpc, time, sourceState, opts)。opts.contract が無ければ(鍵が無い・undefined・null)第321便c の sample(positionKpc, time, sourceState, opts)をそのまま返す
 * (同じ関数・同じ引数 —— 古い呼び出しの結果はビット同一)。opts.contract(object)があれば contract の鍵を除いた opts で sample を呼び、戻り値に鍵 fieldContract を足す。
 */
export function sampleWithContract(positionKpc, time, sourceState, opts) {
  if (!(isObj(opts) && opts.contract !== undefined && opts.contract !== null)) return F.sample(positionKpc, time, sourceState, opts);   // 求めない(鍵が無い・undefined・null)—— 同じ関数・同じ引数
  const { contract: req, ...rest } = opts;
  if (!isObj(req)) throw new RangeError('opts.contract は object(契約を求めないなら鍵を置かない)');
  const out = F.sample(positionKpc, time, sourceState, rest);
  out.fieldContract = buildFieldContract(out, req);
  return out;
}

/* ───────── ただの JSON の値か ───────── */
export function isPlainJson(x) {
  const walk = (v) => {
    if (v === null || typeof v === 'string' || typeof v === 'boolean') return true;
    if (typeof v === 'number') return Number.isFinite(v);
    if (Array.isArray(v)) return v.every(walk);
    if (isObj(v)) return Object.getPrototypeOf(v) === Object.prototype && Object.values(v).every((q) => q !== undefined && walk(q));
    return false;
  };
  return walk(x) && JSON.stringify(JSON.parse(JSON.stringify(x))) === JSON.stringify(x);
}
/** 契約の形(鍵の名と順)が共通の形と同じか */
export function contractShapeOk(c) {
  if (!(isObj(c) && JSON.stringify(Object.keys(c)) === JSON.stringify(CONTRACT_KEYS) && c.version === CONTRACT_VERSION)) return false;
  for (const k of ['frame', 'omegaField', 'convergence', 'transfer', 'ledgerRefs']) if (!(isObj(c[k]) && JSON.stringify(Object.keys(c[k])) === JSON.stringify(SUB_KEYS[k]))) return false;
  if (!(c.sources === null || (Array.isArray(c.sources) && c.sources.every((s) => isObj(s) && JSON.stringify(Object.keys(s)) === JSON.stringify(SUB_KEYS.source))))) return false;
  return isPlainJson(c);
}

/* ───────── 直接の滑り(AN551 = A —— 本の宣言の型)───────── */
/** ν_G = g_T (Ω_arm − Ω_field) ĝ。premise は AN536 の前提 Ω_field > Ω_arm > 0(記録 —— 前提の外は拒否しない・場の軸の反転〔Ω_field ≤ 0〕と負の利得は拒否) */
export function directSlip({ gT, OmegaArm, OmegaField, axis }) {
  if (!(Number.isFinite(gT) && gT >= 0)) throw new RangeError('directSlip: g_T は 0 以上の有限の数');
  if (!(Number.isFinite(OmegaArm) && Number.isFinite(OmegaField) && OmegaField > 0)) throw new RangeError('directSlip: Ω_arm は有限・Ω_field は正の有限(場の軸を反転しない)');
  if (!(vec3(axis) && Math.abs(Math.hypot(axis[0], axis[1], axis[2]) - 1) <= 1e-12)) throw new RangeError('directSlip: 軸は単位ベクトル');
  const slipArm = OmegaArm - OmegaField, nuAlong = gT * slipArm;
  return { nu: scl(axis, nuAlong), nuAlong, slipArm, premise: OmegaField > OmegaArm && OmegaArm > 0 };
}
/** 契約から直接の滑り(g_T・Ω_field が null なら ν も null —— 0 で埋めない)。Ω_arm は受け手の側の入力(腕の枠 —— 契約の外) */
export function directSlipOf(contract, OmegaArm, axis) {
  const gT = contract && contract.transfer ? contract.transfer.gT : null, Of = contract && contract.omegaField ? contract.omegaField.value : null;
  if (gT === null || Of === null || OmegaArm === null || OmegaArm === undefined) return { ok: false, nu: null, nuAlong: null, slipArm: null, premise: null, why: '契約の g_T・Ω_field か受け手の Ω_arm が null(欠測 —— 0 で埋めない)' };
  return Object.assign({ ok: true }, directSlip({ gT, OmegaArm, OmegaField: Of, axis: axis || contract.frame.axis }));
}
/** 場の相対(腕に対する Ω_arm − Ω_field と物質に対する Ω_mat − Ω_field を別の鍵に —— 混ぜない) */
export function relOfField({ OmegaField, OmegaArm, OmegaMat }) {
  if (![OmegaField, OmegaArm, OmegaMat].every(Number.isFinite)) throw new RangeError('relOfField: 入力');
  return { toArm: OmegaArm - OmegaField, toMatter: OmegaMat - OmegaField };
}
/** 座標の枠を Ω_c ĝ で回す操作(角速度の宣言の全部から Ω_c を引く —— 滑り〔差〕は変わらない)。新しい場を足す操作(Ω_field を変える)とは別 */
export function frameShiftScalars({ OmegaArm, OmegaField, OmegaMat }, Oc) {
  if (![OmegaArm, OmegaField, OmegaMat, Oc].every(Number.isFinite)) throw new RangeError('frameShiftScalars: 入力');
  return { OmegaArm: OmegaArm - Oc, OmegaField: OmegaField - Oc, OmegaMat: OmegaMat - Oc };
}

/* ───────── 双対(反作用と仕事を同じ係数で)───────── */
/**
 * 口のトルク N(受け手が受ける —— ベクトル)と直接の滑りの宣言から、腕と場の口座の反作用(軸 ĝ の向きのスカラー)・引き落とす仕事・角運動量の残りを作る。
 *   t_arm = g_T ĝ・t_field = −g_T ĝ(ν = Ω_arm t_arm + Ω_field t_field)・反作用 τ = −t·N(第326便d の k1 の口の型)・仕事 = −τ Ω。
 *   coefReaction(既定は g_T)を変えると「違う係数」の否定対照(供給の和が N·ν と違う)。戻り値の supplyRel が 1e-12 の内なら二重に数えていない(一度だけ N·ν)
 */
export function dualOf({ N, gT, OmegaArm, OmegaField, axis, coefReaction }) {
  if (!vec3(N)) throw new RangeError('dualOf: N は有限の 3 成分');
  const s = directSlip({ gT, OmegaArm, OmegaField, axis }), cr = coefReaction === undefined ? gT : coefReaction;
  if (!Number.isFinite(cr)) throw new RangeError('dualOf: 反作用の係数');
  const Ng = dot(N, axis), tauArm = -gT * Ng, tauField = cr * Ng;   // −t_arm·N・−t_field·N(t_field = −cr ĝ)
  const workArm = -tauArm * OmegaArm, workField = -tauField * OmegaField, supplyNu = dot(N, s.nu), supplySum = workArm + workField;
  const sc = Math.max(Math.abs(workArm), Math.abs(workField), Math.abs(supplyNu), 1e-300);
  return { nuAlong: s.nuAlong, Ng, reactionArm: tauArm, reactionField: tauField, reactionSum: tauArm + tauField, workArm, workField, supplySum, supplyNu,
    supplyRel: Math.abs(supplySum - supplyNu) / sc, remainderToCenter: scl(N, -1), coefSame: cr === gT };
}

/* ───────── 太陽の式の検査と縮退(ランク 1)───────── */
/** 太陽の式の残差 g_T (Ω_arm − Ω_field) − A(相対は |A| に対して) */
export function sunCheck({ A, gT, OmegaArm, OmegaField }) {
  if (![A, gT, OmegaArm, OmegaField].every(Number.isFinite)) throw new RangeError('sunCheck: 入力');
  const res = gT * (OmegaArm - OmegaField) - A;
  return { residual: res, rel: Math.abs(res) / Math.max(Math.abs(A), 1e-300) };
}
/** 宣言の g_T で太陽の式を閉じる Ω_field = Ω_arm − A/g_T(g_T ≤ 0 は null —— 決まらない・前提の外は consistent: false) */
export function requiredOmegaField({ A, gT, OmegaArm }) {
  if (![A, gT, OmegaArm].every(Number.isFinite)) throw new RangeError('requiredOmegaField: 入力');
  if (!(gT > 0)) return { OmegaField: null, consistent: false, why: 'g_T が 0 以下 —— 太陽の式から Ω_field は決まらない' };
  const Of = OmegaArm - A / gT;
  return { OmegaField: Of, consistent: Of > OmegaArm && OmegaArm > 0 };
}
/**
 * 縮退(太陽の 1 式で未知 g_T・Ω_field の 2 つ): 宣言の g_T の列ごとに Ω_field を閉じ、積 g_T (Ω_arm − Ω_field) が全部 A と同じ・
 * 1 式の Jacobian [∂/∂g_T, ∂/∂Ω_field] = [Ω_arm − Ω_field, −g_T] のランク 1(未知 2 —— 解かない)
 */
export function degeneracyOf({ A, OmegaArm, gTs }) {
  const rows = gTs.map((g) => { const r = requiredOmegaField({ A, gT: g, OmegaArm }); return { gT: g, OmegaField: r.OmegaField, consistent: r.consistent,
    productRel: r.OmegaField === null ? null : sunCheck({ A, gT: g, OmegaArm, OmegaField: r.OmegaField }).rel }; });
  const ok = rows.filter((q) => q.OmegaField !== null), J = ok.map((q) => [OmegaArm - q.OmegaField, -q.gT]);
  const one = ok.length ? L6.rankOf([J[0]]) : null;
  return { rows, rankOne: one ? one.rank : null, unknowns: 2, distinctPairs: new Set(ok.map((q) => q.gT + ':' + q.OmegaField)).size };
}

/* ───────── 収束の印(u と curl を別に)───────── */
/**
 * ring: { u, curl }(主の経路の値)・rows: [{ nr, u, curl }](点のセルの和 —— 粗 → 細)。
 *   uConverged: 最後の行の |u − ring.u|/|ring.u| ≤ uTolRel かつ最後の 2 行でその差が縮む / curlConverged: curl の符号が全部同じかつ最後の行の相対の差 ≤ curlTolRel。
 *   行が 2 つ未満なら null(判定できない —— 0 で埋めない)
 */
export function judgeConvergence({ ring, rows, uTolRel = DECL.uTolRel, curlTolRel = DECL.curlTolRel, method = DECL.convergenceMethod }) {
  if (!(isObj(ring) && Array.isArray(rows))) throw new RangeError('judgeConvergence: 入力');
  if (rows.length < 2 || !rows.every((q) => Number.isFinite(q.u) && Number.isFinite(q.curl)) || !Number.isFinite(ring.u) || !Number.isFinite(ring.curl))
    return { uConverged: null, curlConverged: null, method, gridSigns: null };
  const ur = rows.map((q) => Math.abs(q.u - ring.u) / Math.abs(ring.u)), cr = rows.map((q) => Math.abs(q.curl - ring.curl) / Math.abs(ring.curl)), n = rows.length;
  const signs = rows.map((q) => sgnOf(q.curl)), same = signs.every((s) => s === signs[0] && s !== 0);
  return { uConverged: ur[n - 1] <= uTolRel && ur[n - 1] < ur[n - 2], curlConverged: same && cr[n - 1] <= curlTolRel, method, gridSigns: signs };
}

/* ───────── 純関数の場面(QA lint.fieldContract328a と器の P 段)───────── */
export function pureScenes() {
  const S = {}, pos = [F.FLOW.R0kpc, 0, 0];
  // ① 古い呼び出しのビット同一(契約を求めない口 = 第321便c の sample —— 有効域の内・外・中心と残余・代理)
  { const cases = [[pos, F.fullState(), {}], [[50, 0, 0], F.fullState(), {}], [[6, 2, 0.1], F.splitState(4), {}],
      [pos, { model: F.MODEL_ID, stationary: true, terms: [{ key: 'proxy', coef: 1, owns: [{ comp: 'galaxy:proxy' }], proxy: { J: 1e67 } }] }, {}]];
    S.bitSame = cases.map(([p, st, o]) => JSON.stringify(sampleWithContract(p, 0, st, o)) === JSON.stringify(F.sample(p, 0, st, o)));
    // opts を渡さない呼び出し・鍵 contract が undefined / null の呼び出しも求めない口(sample と同じ)
    S.bitSameNoOpt = JSON.stringify(sampleWithContract([50, 0, 0], 0, F.fullState())) === JSON.stringify(F.sample([50, 0, 0], 0, F.fullState()))
      && [undefined, null].every((v) => { const w = sampleWithContract(pos, 0, F.fullState(), { contract: v }); return !('fieldContract' in w) && JSON.stringify(w) === JSON.stringify(F.sample(pos, 0, F.fullState(), { contract: v })); });
    const w = sampleWithContract(pos, 0, F.fullState(), { contract: {} }), { fieldContract: fc, ...rest } = w;
    S.optInRest = JSON.stringify(rest) === JSON.stringify(F.sample(pos, 0, F.fullState(), {})) && Object.keys(w).pop() === 'fieldContract' && isObj(fc); }
  // ② 形と ③ 欠測は null
  { const o = F.sample(pos, 0, F.fullState(), {}), c0 = buildFieldContract(o, {}), c1 = buildFieldContract(o, { omegaField: { value: 3e-6, at: { R_kpc: 8.2, z_kpc: 0 } }, transfer: { gT: 1 },
      convergence: { uConverged: true, curlConverged: false, method: 'm', gridSigns: [1, -1] } });
    S.shape = { c0: contractShapeOk(c0), c1: contractShapeOk(c1), keys: Object.keys(c1) };
    S.nulls = { value: c0.omegaField.value, at: c0.omegaField.at, ref: c0.omegaField.ref, src: c0.omegaField.source, gT: c0.transfer.gT, u: c0.convergence.uConverged, curl: c0.convergence.curlConverged,
      grid: c0.convergence.gridSigns, method: c0.convergence.method, omegaFrame: c0.frame.omegaFrame, slip: directSlipOf(c0, 1e-16).nu };
    S.declared = { value: c1.omegaField.value, src: c1.omegaField.source, ref: c1.omegaField.ref, gT: c1.transfer.gT, curl: c1.convergence.curlConverged };
    const out = F.sample([50, 0, 0], 0, F.fullState(), {}), c2 = buildFieldContract(out, {});
    S.outside = { sources: c2.sources, shape: contractShapeOk(c2) }; }
  // ④ 拒否(枠の回転・Ω_field の型と値・g_T・知らない鍵・場の API の戻り値でない)
  { const o = F.sample(pos, 0, F.fullState(), {}), at = { R_kpc: 8.2, z_kpc: 0 };
    const bad = [{ frame: { omegaFrame: 1e-6 } }, { omegaField: { mode: 'radial', value: 1, at } }, { omegaField: { value: -1e-6, at } }, { omegaField: { value: 0, at } }, { omegaField: { value: NaN, at } },
      { omegaField: { value: 1e-6 } }, { omegaField: { value: 1e-6, at, source: 'observed' } }, { transfer: { gT: -1 } }, { transfer: { gT: Infinity } }, { transfer: { form: 'halfCurl' } }, { omega: 1 }];
    S.reject = bad.map((d) => { try { buildFieldContract(o, d); return false; } catch (e) { return e instanceof RangeError; } });
    S.rejectNotApi = [null, {}, { version: 'x', contract: {} }].map((x) => { try { buildFieldContract(x, {}); return false; } catch (e) { return e instanceof RangeError; } });
    S.rejectOpt = (() => { try { sampleWithContract(pos, 0, F.fullState(), { contract: true }); return false; } catch (e) { return e instanceof RangeError; } })(); }
  // ⑤ 契約を作っても sample の出力は変わらない(Ω_field を宣言しても u に Ω_field ĝ × x を重ねない)
  { const o = F.sample(pos, 0, F.fullState(), {}), before = JSON.stringify(o);
    buildFieldContract(o, { omegaField: { value: 7e-6, at: { R_kpc: 8.2, z_kpc: 0 } }, transfer: { gT: 1 } });
    const w = sampleWithContract(pos, 0, F.fullState(), { contract: { omegaField: { value: 7e-6, at: { R_kpc: 8.2, z_kpc: 0 } }, transfer: { gT: 1 } } });
    S.noMutate = { same: JSON.stringify(o) === before, uSame: JSON.stringify(w.u) === JSON.stringify(o.u) && JSON.stringify(w.gradU) === JSON.stringify(o.gradU) }; }
  // ⑥ 直接の滑り(g_T 2・Ω_arm 1・Ω_field 3 → ν·ĝ = −4・前提 真 / Ω_field 0.5 → ν·ĝ = +1・前提 偽〔記録 —— 拒否しない〕/ 軸は ĝ のまま)
  { const a = directSlip({ gT: 2, OmegaArm: 1, OmegaField: 3, axis: [0, 0, 1] }), b = directSlip({ gT: 2, OmegaArm: 1, OmegaField: 0.5, axis: [0, 0, 1] });
    S.slip = { nu: a.nuAlong, premise: a.premise, nuB: b.nuAlong, premiseB: b.premise, vec: a.nu }; }
  // ⑦ 双対(N = (0.3, −0.2, 1.5)・g_T 2・Ω_arm 1・Ω_field 3): 供給の和 = N·ν・反作用の和 0・違う係数(2.5)は和が N·ν と違う
  { const N = [0.3, -0.2, 1.5], d = dualOf({ N, gT: 2, OmegaArm: 1, OmegaField: 3, axis: [0, 0, 1] }), m = dualOf({ N, gT: 2, OmegaArm: 1, OmegaField: 3, axis: [0, 0, 1], coefReaction: 2.5 });
    S.dual = { supplySum: d.supplySum, supplyNu: d.supplyNu, rel: d.supplyRel, reactionSum: d.reactionSum, workArm: d.workArm, workField: d.workField, mismatchRel: m.supplyRel, mismatchSame: m.coefSame }; }
  // ⑧ 二重に数えない(第326便d の帳簿: 銀河の口 1 つの系 —— 供給は galaxySupply に一度だけ。腕と場の分を重ねると閉じない)
  { const A = 2 * (1 - 3), bodies = [{ key: 'S', s: 0.5, a: [0, Math.sin(0.4), Math.cos(0.4)], Rd: 1, ports: [{ kind: 'gal' }] }];
    const prm = { ref: 'S', p: 0, g: [0, 0, 1], gamma0: { S: 1.7 }, cGalaxy: 1, cK1: 1, k: {}, A };
    const ev = L6.evaluate(bodies, prm), pr = ev.rows[0].ports[0], d = dualOf({ N: pr.torque, gT: 2, OmegaArm: 1, OmegaField: 3, axis: [0, 0, 1] }), lg = ev.ledger;
    S.noDouble = { supplyVsLedger: relD(d.supplySum, lg.galaxySupply), closes: lg.residualRel, doubledRel: Math.abs(lg.galaxySupply + d.supplySum - lg.heat - lg.spinPower) / Math.abs(lg.galaxySupply),
      remainder: relD(d.remainderToCenter[2], lg.L.galaxyCenter[2]) + relD(d.remainderToCenter[1], lg.L.galaxyCenter[1]) }; }
  // ⑨ 縮退(A = −2・Ω_arm = 1・g_T 0.5/1/2/4 → Ω_field 5/3/2/1.5 —— 積は全部 A・Jacobian のランク 1)
  { const D = degeneracyOf({ A: -2, OmegaArm: 1, gTs: [0.5, 1, 2, 4] }); S.degeneracy = { of: D.rows.map((q) => q.OmegaField), prodMax: Math.max(...D.rows.map((q) => q.productRel)), rank: D.rankOne, pairs: D.distinctPairs, zeroGain: requiredOmegaField({ A: -2, gT: 0, OmegaArm: 1 }).OmegaField }; }
  // ⑩ 腕に対する相対と物質に対する相対は別(Ω_arm 1・Ω_mat 1.2・Ω_field 3)
  S.rel = relOfField({ OmegaField: 3, OmegaArm: 1, OmegaMat: 1.2 });
  // ⑪ 座標の枠を回す操作は滑りを変えない・新しい場を足す操作(Ω_field を変える)は変える
  { const a = { OmegaArm: 1, OmegaField: 3, OmegaMat: 1.2 }, b = frameShiftScalars(a, 0.7), sl = (q) => directSlip({ gT: 2, OmegaArm: q.OmegaArm, OmegaField: q.OmegaField, axis: [0, 0, 1] }).nuAlong;
    S.frameVsField = { shifted: sl(b), base: sl(a), addField: sl(Object.assign({}, a, { OmegaField: 3.5 })) }; }
  // ⑫ 収束の印(u は縮む・curl の符号が交互 → curl だけ偽 / 全部同じで小さい差 → 両方真 / 行が 1 つ → null)
  { const ring = { u: 1, curl: -0.1 };
    S.conv = { alt: judgeConvergence({ ring, rows: [{ u: 1.005, curl: 0.17 }, { u: 0.997, curl: -0.26 }, { u: 1.001, curl: 0.02 }, { u: 1.0004, curl: -0.15 }] }),
      same: judgeConvergence({ ring, rows: [{ u: 1.01, curl: -0.12 }, { u: 1.0005, curl: -0.1005 }] }),
      one: judgeConvergence({ ring, rows: [{ u: 1, curl: -0.1 }] }) }; }
  // ⑬ 由来(中心と残余の重ならない 2 項 —— sourceId は重ならず sample の source.terms と同じ数・同じ所有の範囲)
  { const o = F.sample(pos, 0, F.splitState(4), {}), c = buildFieldContract(o, {});
    S.sources = { ids: c.sources.map((q) => q.sourceId), n: o.source.terms.length, owns: c.sources.map((q) => q.owns.length), ownsSame: JSON.stringify(c.sources.map((q) => q.owns)) === JSON.stringify(o.source.terms.map((t) => t.owns)) }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    oldCallBitSame: S.bitSame.length === 4 && S.bitSame.every((x) => x === true) && S.bitSameNoOpt === true && S.optInRest === true,
    contractShape: S.shape.c0 === true && S.shape.c1 === true && JSON.stringify(S.shape.keys) === JSON.stringify(CONTRACT_KEYS) && S.outside.shape === true,
    missingIsNull: S.nulls.value === null && S.nulls.at === null && S.nulls.ref === null && S.nulls.src === null && S.nulls.gT === null && S.nulls.u === null && S.nulls.curl === null
      && S.nulls.grid === null && S.nulls.method === null && S.nulls.slip === null && S.nulls.omegaFrame === 0 && S.outside.sources === null
      && S.declared.value === 3e-6 && S.declared.src === 'declared' && S.declared.ref === DECL.omegaFieldRef && S.declared.gT === 1 && S.declared.curl === false,
    rejectBadDecl: S.reject.every((x) => x === true) && S.rejectNotApi.every((x) => x === true) && S.rejectOpt === true,
    fieldNotAddedToU: S.noMutate.same === true && S.noMutate.uSame === true,
    directSlip: S.slip.nu === -4 && S.slip.premise === true && S.slip.nuB === 1 && S.slip.premiseB === false && S.slip.vec[0] === 0 && S.slip.vec[1] === 0 && S.slip.vec[2] === -4,
    dualSameCoef: close(S.dual.supplySum, S.dual.supplyNu) && S.dual.rel <= 1e-12 && S.dual.reactionSum === 0 && close(S.dual.workArm, 3) && close(S.dual.workField, -9)
      && S.dual.mismatchRel > 1e-3 && S.dual.mismatchSame === false,
    noDoubleCount: S.noDouble.supplyVsLedger <= 1e-12 && S.noDouble.closes <= 1e-12 && S.noDouble.doubledRel > 0.5 && S.noDouble.remainder <= 1e-12,
    degeneracyRankOne: JSON.stringify(S.degeneracy.of) === JSON.stringify([5, 3, 2, 1.5]) && S.degeneracy.prodMax <= 1e-12 && S.degeneracy.rank === 1 && S.degeneracy.pairs === 4 && S.degeneracy.zeroGain === null,
    armVsMatter: S.rel.toArm === -2 && close(S.rel.toMatter, -1.8) && S.rel.toArm !== S.rel.toMatter,
    frameShiftKeepsSlip: close(S.frameVsField.shifted, S.frameVsField.base) && S.frameVsField.base === -4 && S.frameVsField.addField === -5,
    convergenceSeparate: S.conv.alt.uConverged === true && S.conv.alt.curlConverged === false && JSON.stringify(S.conv.alt.gridSigns) === JSON.stringify([1, -1, 1, -1])
      && S.conv.same.uConverged === true && S.conv.same.curlConverged === true && S.conv.one.uConverged === null && S.conv.one.curlConverged === null && S.conv.one.gridSigns === null,
    sourcesDisjoint: S.sources.n === 2 && new Set(S.sources.ids).size === 2 && S.sources.ownsSame === true,
  };
}

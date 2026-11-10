// 第331便a(原仮定者の決断(2026-11-09 —— AN586)「並進引きずりと回転引きずりは一緒に処理しても構わない座標変換であり、m/r² の重み付けをする。先に検証を行う」・
//   原仮定者の決断(2026-11-09 —— AN587)「慣性由来の引きずりは重力由来の潮汐力と別ルート —— 二重にならない想定」・原仮定者の整理(2026-11-09)「引きずりは相対的な移動と回転に m/r² の重み」・
//   統括の検証項目 R310): **座標変換の引きずり(並進 + 回転を 1 つ —— 重み m/r²)・回転の自転の口と潮汐の口の登録(channel と interactionId)・近点の一次の目安・通約の値・内部熱の 3 欄の純関数**
//   (器 tests/exp-w331a-coordtwist.mjs と QA lint.coordTwist331a・behavior.coordTwist331a が読む —— html を読まない・状態を持たない・第330便b の lib〔tests/lib-w330b-dragweight.mjs〕と
//   第326便d の lib〔tests/lib-w326d-axialheat.mjs の port〕は呼ぶだけ・エンジンの式を写さない)。出どころの型は統括の参考の試作(今のコードを読んで書き直した)。
//
// ■ 何をするか(作業仮説の検査の道具 —— エンジン・在位の本・受理器へ足す操作ではない。**実装/診断/宣言(未接続)を分ける** —— 本 lib は全部「診断」)
//   座標則(coordTwist —— 1 受け手): 源 j の座標の速度 V_{j→i} = v_j + Ω_j × (x_i − x_j)(源の並進と回転を 1 つの座標変換として受け手の位置で読む)・重み w_ij = m_j/r_ij²(第330便b の pointWeight)・
//     d_i = Σ_j w_ij (V_{j→i} − v_i)/W_i(W_i = w_ii + Σ_j w_ij —— 第330便b の weightedMotion に V を渡す)・U_i = v_i + d_i・自転の目標 ν_i = Ω_i + Σ_j w_ij(Ω_j − Ω_i)/W_i
//     (第330便b の spinTarget —— 源の Ω そのもの・順回転)。d は**速度**で力・加速度ではない。d = d_並進(Σβ(v_j − v_i))+ d_回転(Σβ Ω_j × (x_i − x_j))の 2 つに分けて返す。
//     自己の重み w_ii は **m/0² にしない** —— 有限の宣言(selfDecl: 形〔point・ballMean・ballHarmonic —— 第330便b の selfWeight〕× 半径の規則〔kappaM: R = Y_k m(K1 の規則)・radius: 観測の半径〕)。
//     宣言した核の半径(Rcore)を持つ天体どうし(受け手と源・源どうし)が重なる(距離 ≤ 半径の和)入力は拒否(エンジンの invSqOverlap と同じ向き —— 接する距離も重なり)。
//   性質(場面): α + Σβ = 1・**瞬間の共変性**(全部の速度から共通の並進 b と枠の回転 ω_f × x を引き・角速度から ω_f を引くと d と自転の滑りは不変・U は b + ω_f × x_i・目標は ω_f だけずれる)・
//     剛体の共動で d = 0・滑り 0・単独で U = v・目標 = Ω・順回転・分子の距離の次数(並進 −2・回転の接線 −1・自転 −2)・向きの違う源はベクトルで足す(大きさの和にも 1 軸の符号つきの和にもしない)。
//   回転の自転の口と潮汐の口(AN587 —— registerPorts・evaluatePorts・fourConditions): 口は { interactionId, channel, recv, src, nu, Gamma }。channel は CHANNELS の 4 つ
//     (inertialRotation = 慣性由来の回転の自転の口・axial = 軸引きずり・gravTide = 重力の潮汐・thermalTide = 熱潮汐)。**同じ interactionId と channel の二度の登録を拒否**(同じ仕事を 2 つの熱の槽へ
//     入れない)・同じ interactionId の別の channel は受ける(別ルート)・知らない channel(例 ジャイロの直交成分)は拒否。口ごとに第326便d の port(Ω, ν, Γ)(トルク Γ(ν − Ω)・熱 Γ|ν − Ω|²・
//     供給 N·ν・受け手の仕事 N·Ω)。4 条件(回転の口だけ・潮汐だけ・両方・両方 0)で合トルクの加算・由来別の熱・帳簿を突き合わせる(口を 1 つに寄せると熱が変わる —— 寄せない)。
//     **回転の口の目標 ν をそのまま角加速度やジュールに読まない** —— 応答 Γ_rot(宣言の型 —— 器が Γ = f I/τ_0 で置く)が要る。
//   近点の一次の目安(apsidalFirstOrder): 受け手の位置の速さに足す項 u(並進 u = −β(r) w・回転 u = ε(r) n̂ × x)を時間で微分した摂動の加速度 F = du/dt を Gauss の式で 1 周に積む
//     (β = b r^−k・ε = c r^−k —— 一次・軌道の平均)。並進 k = 1 で π b/p・k = 2 で 2π b/p²・回転 k = 0 で π c a^{3/2}/√GM(場面)。**写しの時間発展ではない**(目安 —— 器は在位の正本の値と比べる)。
//   通約(lockCommensurability): 恒星の自転(符号つき —— 負は逆行)と公転から太陽日・会合周期・比・内合ごとの面のずれ。内部熱の 3 欄(heatThreeColumns): 帳簿が閉じた/定常(合トルクの相対)/
//     観測の熱流との比(分母は入力値)を別の欄に(第330便a の heatLedger の行を包む —— 本文を変えない)。
//
// ■ 言わないこと: 座標則と今のエンジンの関係は成分ごとの対応表と残差(同じとは書かない)・二重計上の有無は帳簿の表の値・ロックは宣言と通約の値(機構を実装したとは書かない)・
//   引きずり d を力と書かない・近点の目安を写しの値と書かない。
import * as L from './lib-w330b-dragweight.mjs';
import * as E from './lib-w326d-axialheat.mjs';

export const LIB_VERSION = 'w331a-coordtwist-lib-1';
/** 自己の重みの半径の規則(kappaM: R_d = Y_k m —— K1 の規則・radius: 観測の半径)と形(第330便b の型) */
export const SELF_RULES = Object.freeze(['kappaM', 'radius']);
export const SELF_SHAPES = L.SELF_TYPES;
/** 口の channel(AN587) */
export const CHANNELS = Object.freeze(['inertialRotation', 'axial', 'gravTide', 'thermalTide']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  /** 座標則の重みの距離の次数(原仮定者の決断(2026-11-09 —— AN586)の m/r²) */
  p: 2,
  /** 共変性・共動の門の相対の許容 */
  covTol: 1e-12,
  /** 近点の一次の目安の求積の点(周期の滑らかな被積分 —— 中点則) */
  apsisNodes: 4096,
  /** 4 条件の名(回転の口だけ・潮汐だけ・両方・両方 0) */
  conditions: Object.freeze(['rotOnly', 'tideOnly', 'both', 'bothZero']),
  /** 内部熱の 3 欄の定常の宣言(合トルクの相対 ≤ steadyTol —— 第330便a の帳簿の門と同じ値) */
  steadyTol: 1e-12,
});

const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const maxAbs = (a) => Math.max(...a.map(Math.abs));

/* ───────── 自己の重み(有限の宣言)───────── */
/** 自己の重みの宣言: 形 shape(point・ballMean・ballHarmonic)× 規則 rule(kappaM: R = Y_k m・radius: R = Robs)。戻り値 { w, R, shape, rule, coef }(w = coef m/R²) */
export function selfDecl({ shape, rule, m, Robs = null }) {
  if (!SELF_RULES.includes(rule)) throw new RangeError('selfDecl: 規則は ' + SELF_RULES.join('・'));
  if (!fin(m) || !(m > 0)) throw new RangeError('selfDecl: m > 0');
  const R = rule === 'kappaM' ? L.kappaMRadius(m) : Robs;
  if (!fin(R) || !(R > 0)) throw new RangeError('selfDecl: 半径 > 0 の有限(自己の重みは m/0² にできない)');
  const s = L.selfWeight({ type: shape, m, R, p: DECL.p });
  return { w: s.w, R, shape, rule, coef: s.coef };
}

/* ───────── 座標則(1 受け手)───────── */
/**
 * receiver = { id, x:[3], v:[3], omega:[3], selfW > 0, Rcore? }・sources = [{ id, x, v, omega, m ≥ 0, Rcore? }](同じ基底・同じ単位)。
 * 戻り値: W・alpha・ports(源ごとの weight・beta・r・trans = v_j − v_i・rot = Ω_j × (x_i − x_j)・vrel = trans + rot・omegaRel)・d・dTrans・dRot・U・spin { target, slip }・residual(第330便b の会計の残差)
 */
export function coordTwist(receiver, sources, opt = {}) {
  if (!receiver || typeof receiver.id !== 'string' || !v3(receiver.x) || !v3(receiver.v) || !v3(receiver.omega) || !fin(receiver.selfW) || !(receiver.selfW > 0) || !Array.isArray(sources))
    throw new RangeError('coordTwist: 受け手は id・有限の 3 成分の x・v・omega と正の自己の重み(自己の重みは有限の宣言 —— m/0² にしない)');
  const ids = new Set([receiver.id]), cores = [];
  if (receiver.Rcore !== undefined && receiver.Rcore !== null) { if (!fin(receiver.Rcore) || !(receiver.Rcore > 0)) throw new RangeError('coordTwist: 受け手の Rcore は正の有限'); cores.push({ id: receiver.id, x: receiver.x, R: receiver.Rcore }); }
  for (const s of sources) {
    if (!s || typeof s.id !== 'string' || ids.has(s.id)) throw new RangeError('coordTwist: 源の id は文字列で重複しない(受け手の id とも違う)');
    if (!v3(s.x) || !v3(s.v) || !v3(s.omega) || !fin(s.m) || s.m < 0) throw new RangeError('coordTwist: 源 ' + s.id + ' は有限の 3 成分の x・v・omega と非負の質量');
    ids.add(s.id);
    if (s.Rcore !== undefined && s.Rcore !== null) { if (!fin(s.Rcore) || !(s.Rcore > 0)) throw new RangeError('coordTwist: 源 ' + s.id + ' の Rcore は正の有限'); cores.push({ id: s.id, x: s.x, R: s.Rcore }); }
  }
  for (let a = 0; a < cores.length; a++) for (let b = a + 1; b < cores.length; b++)
    if (!(nrm(sub(cores[a].x, cores[b].x)) > cores[a].R + cores[b].R)) throw new RangeError('coordTwist: 核の重なり ' + cores[a].id + '・' + cores[b].id + '(距離 ≤ 半径の和 —— 接する距離も重なり)');
  const rows = sources.map((s) => {
    const dx = sub(receiver.x, s.x), r = nrm(dx);
    if (!(r > 0) || !fin(r)) throw new RangeError('coordTwist: 一致点 ' + s.id + '(r = 0 は別の有限の核の模型 —— 拒否)');
    const weight = L.pointWeight(s.m, r, DECL.p), trans = sub(s.v, receiver.v), rot = crs(s.omega, dx), vrel = add(trans, rot);
    if (![...trans, ...rot].every(fin)) throw new RangeError('coordTwist: 値域の外');
    return { id: s.id, r, weight, trans, rot, vrel, V: add(s.v, rot), omegaRel: sub(s.omega, receiver.omega) };
  });
  const wm = L.weightedMotion(receiver.v, receiver.selfW, rows.map((q) => ({ weight: q.weight, velocity: q.V })));
  const st = L.spinTarget(receiver.omega, receiver.selfW, rows.map((q) => ({ weight: q.weight, omega: add(receiver.omega, q.omegaRel) })));
  const ports = rows.map((q, j) => Object.assign(q, { beta: wm.beta[j] }));
  const dTrans = ports.reduce((a, q) => add(a, scl(q.trans, q.beta)), [0, 0, 0]), dRot = ports.reduce((a, q) => add(a, scl(q.rot, q.beta)), [0, 0, 0]);
  return { W: wm.W, alpha: wm.alpha, selfW: receiver.selfW, ports, d: wm.d, dTrans, dRot, U: wm.U, residual: wm.residual, spin: { target: st.target, slip: st.slip } };
}

/* ───────── 回転の自転の口と潮汐の口(AN587)───────── */
/** 口の登録: entries = [{ interactionId, channel, recv, src, nu:[3], Gamma ≥ 0 }]。同じ interactionId と channel の二度の登録・知らない channel・負の Γ を拒否 */
export function registerPorts(entries) {
  if (!Array.isArray(entries)) throw new RangeError('registerPorts: 配列');
  const seen = new Set(), ports = [];
  for (const q of entries) {
    if (!q || typeof q.interactionId !== 'string' || !q.interactionId || typeof q.recv !== 'string' || typeof q.src !== 'string') throw new RangeError('registerPorts: interactionId・recv・src は文字列');
    if (!CHANNELS.includes(q.channel)) throw new RangeError('registerPorts: channel は ' + CHANNELS.join('・') + '(' + String(q.channel) + ' は口にしない —— ジャイロの直交成分などを別の散逸口として足さない)');
    if (!v3(q.nu) || !fin(q.Gamma) || q.Gamma < 0) throw new RangeError('registerPorts: ν は有限の 3 成分・Γ ≥ 0(負の Γ は使わない)');
    const key = q.interactionId + '|' + q.channel;
    if (seen.has(key)) throw new RangeError('registerPorts: 同じ口の二度の登録 ' + key + '(同じ仕事を 2 つの熱の槽へ入れない)');
    seen.add(key); ports.push({ interactionId: q.interactionId, channel: q.channel, recv: q.recv, src: q.src, nu: q.nu.slice(), Gamma: q.Gamma });
  }
  return { ports, keys: [...seen] };
}
/** 登録した口の評価(受け手の自転 Omega:[3] —— 口ごとに第326便d の port)。合トルク・channel ごとの熱・供給・受け手の仕事・帳簿の残差 */
export function evaluatePorts(reg, Omega) {
  if (!reg || !Array.isArray(reg.ports) || !v3(Omega)) throw new RangeError('evaluatePorts: 入力');
  const per = reg.ports.map((q) => Object.assign({ interactionId: q.interactionId, channel: q.channel }, E.port(Omega, q.nu, q.Gamma)));
  const torque = per.reduce((a, q) => add(a, q.torque), [0, 0, 0]), heat = per.reduce((s, q) => s + q.heat, 0), supply = per.reduce((s, q) => s + q.supply, 0), recvWork = per.reduce((s, q) => s + q.recvWork, 0);
  const heatBy = Object.fromEntries(CHANNELS.map((c) => [c, per.filter((q) => q.channel === c).reduce((s, q) => s + q.heat, 0)]));
  const sc = Math.max(1e-300, ...per.map((q) => Math.max(Math.abs(q.supply), Math.abs(q.recvWork), q.heat)));
  return { per, torque, heat, heatBy, supply, recvWork, residual: supply - recvWork - heat, residualRel: Math.abs(supply - recvWork - heat) / sc };
}
/**
 * 4 条件(回転の口だけ・潮汐だけ・両方・両方 0)。rot・tide = { interactionId, channel, recv, src, nu, Gamma }(rot の channel は inertialRotation・tide は gravTide か thermalTide)・Omega:[3]。
 * 戻り値: 条件ごとの評価と照合(両方の合トルク = 各口の和・両方の熱 = 各口の熱の和〔由来ごと〕・帳簿・両方 0 は全部 0)と、口を 1 つに寄せた否定対照(Γ = Γ_r + Γ_t・ν = Γ の重みの平均)の熱
 */
export function fourConditions({ rot, tide, Omega }) {
  if (!rot || rot.channel !== 'inertialRotation' || !tide || !['gravTide', 'thermalTide'].includes(tide.channel)) throw new RangeError('fourConditions: 回転の口(inertialRotation)と潮汐の口(gravTide・thermalTide)');
  const zero = (q) => Object.assign({}, q, { Gamma: 0 });
  const ev = { rotOnly: evaluatePorts(registerPorts([rot]), Omega), tideOnly: evaluatePorts(registerPorts([tide]), Omega), both: evaluatePorts(registerPorts([rot, tide]), Omega), bothZero: evaluatePorts(registerPorts([zero(rot), zero(tide)]), Omega) };
  const tScale = Math.max(1e-300, nrm(ev.rotOnly.torque), nrm(ev.tideOnly.torque)), hScale = Math.max(1e-300, ev.rotOnly.heat, ev.tideOnly.heat);
  const torqueAddRel = nrm(sub(ev.both.torque, add(ev.rotOnly.torque, ev.tideOnly.torque))) / tScale, heatAddRel = Math.abs(ev.both.heat - ev.rotOnly.heat - ev.tideOnly.heat) / hScale;
  const Gs = rot.Gamma + tide.Gamma, merged = Gs > 0 ? E.port(Omega, scl(add(scl(rot.nu, rot.Gamma), scl(tide.nu, tide.Gamma)), 1 / Gs), Gs) : null;
  return { conditions: ev, torqueAddRel, heatAddRel, ledgerMaxRel: Math.max(...DECL.conditions.map((k) => ev[k].residualRel)),
    zeroAll: nrm(ev.bothZero.torque) === 0 && ev.bothZero.heat === 0 && ev.bothZero.supply === 0,
    mergedHeat: merged ? merged.heat : 0, mergedOverSeparate: merged && ev.both.heat > 0 ? merged.heat / ev.both.heat : null };
}

/* ───────── 近点の一次の目安 ───────── */
/**
 * 1 周の近点の移動 [rad](一次・軌道の平均)。kind: 'translation'(u = −β(r) w・β = b r^−k)/'rotation'(u = ε(r) n̂ × x・ε = c r^−k —— 公転と同じ向きが正)。
 * 摂動の加速度 F = du/dt(一次 —— w は Kepler の速度)を Gauss の式 dϖ/dt = (√(p/GM)/e)[−F_R cos f + F_T(1 + r/p) sin f] で 1 周に積む(dt = r²/h df・中点則)
 */
export function apsidalFirstOrder({ GM, a, e, kind, coef, k, nodes = DECL.apsisNodes }) {
  if (![GM, a, e, coef, k].every(fin) || !(GM > 0 && a > 0 && e > 0 && e < 1) || !['translation', 'rotation'].includes(kind) || !(Number.isInteger(nodes) && nodes >= 16)) throw new RangeError('apsidalFirstOrder: 定義域(0 < e < 1・kind は translation か rotation)');
  const p = a * (1 - e * e), h = Math.sqrt(GM * p);
  let s = 0;
  for (let j = 0; j < nodes; j++) {
    const f = 2 * Math.PI * (j + 0.5) / nodes, r = p / (1 + e * Math.cos(f)), rdot = Math.sqrt(GM / p) * e * Math.sin(f), thdot = h / (r * r);
    let FR, FT;
    if (kind === 'translation') { const be = coef * Math.pow(r, -k), bp = -k * be / r; FR = be * GM / (r * r) - bp * rdot * rdot; FT = -bp * rdot * r * thdot; }
    else { const ep = coef * Math.pow(r, -k); FR = -ep * r * thdot; FT = (1 - k) * ep * rdot; }
    s += (Math.sqrt(p / GM) / e) * (-FR * Math.cos(f) + FT * (1 + r / p) * Math.sin(f)) * (r * r / h);
  }
  return s * 2 * Math.PI / nodes;
}

/* ───────── 通約(ロックの宣言の値)───────── */
/** 恒星の自転 P_spin(符号つき [日] —— 負は逆行)・公転 P_orb [日]・比べる外の公転 P_ref [日](無ければ null)から太陽日・会合周期・比・内合ごとの面のずれ [deg] */
export function lockCommensurability({ spinDays, orbitDays, refOrbitDays = null, pq = null }) {
  if (!fin(spinDays) || spinDays === 0 || !fin(orbitDays) || !(orbitDays > 0)) throw new RangeError('lockCommensurability: 自転は 0 でない有限・公転は正');
  const spinOrbit = orbitDays / spinDays, solarDay = spinOrbit === 1 ? null : 1 / (1 / orbitDays - 1 / spinDays);   // 同期(1 : 1)の太陽日は無限 —— null
  const out = { spinDays, orbitDays, solarDayDays: solarDay, spinOverOrbitRate: spinOrbit };
  if (pq) { if (!(Array.isArray(pq) && pq.length === 2 && pq.every((x) => Number.isInteger(x) && x !== 0))) throw new RangeError('lockCommensurability: pq は 0 でない整数 2 つ'); out.pq = pq.slice(); out.pqRatio = pq[0] / pq[1]; out.pqDev = spinOrbit / (pq[0] / pq[1]) - 1; }
  if (refOrbitDays !== null) {
    if (!fin(refOrbitDays) || !(refOrbitDays > orbitDays)) throw new RangeError('lockCommensurability: 外の公転は内の公転より長い');
    if (solarDay === null) throw new RangeError('lockCommensurability: 同期の天体に外の公転の会合の比は作らない');
    const syn = 1 / (1 / orbitDays - 1 / refOrbitDays), ratio = syn / Math.abs(solarDay), nInt = Math.round(ratio);
    Object.assign(out, { synodicDays: syn, synodicOverSolarDay: ratio, nearestInteger: nInt, faceDriftDegPerConjunction: (ratio - nInt) * 360, conjunctionsPerTurn: ratio !== nInt ? Math.abs(1 / (ratio - nInt)) : null });
  }
  return out;
}

/* ───────── 内部熱の 3 欄(第330便a の帳簿の行を包む)───────── */
/** rows = 第330便a の heatLedger の行(closed・recvResidualRel・systemResidualRel・alongRel・obsRatio・heatObs)。欄: closed(帳簿が閉じた)/steady(合トルクの相対 ≤ 宣言)/obs(観測の熱流との比 —— 分母は入力値) */
export function heatThreeColumns(rows, tol = DECL.steadyTol) {
  if (!Array.isArray(rows) || rows.some((q) => !q || typeof q.closed !== 'boolean' || !fin(q.alongRel))) throw new RangeError('heatThreeColumns: 第330便a の帳簿の行');
  const cols = rows.map((q) => ({ key: q.key, form: q.form, tau: q.tau, variant: q.variant, Q: q.Q,
    closed: q.closed, closedResidual: Math.max(fin(q.recvResidualRel) ? q.recvResidualRel : 0, fin(q.systemResidualRel) ? q.systemResidualRel : 0),
    steady: q.alongRel <= tol, alongRel: q.alongRel, obsRatio: fin(q.obsRatio) ? q.obsRatio : null, heatObs: fin(q.heatObs) ? q.heatObs : null, obsDeclared: q.heatObsDeclared || null }));
  return { rows: cols, n: cols.length, nClosed: cols.filter((q) => q.closed).length, nSteady: cols.filter((q) => q.steady).length, nObs: cols.filter((q) => q.obsRatio !== null).length,
    nClosedNotSteady: cols.filter((q) => q.closed && !q.steady).length };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const R0 = { id: 'r', x: [2, -1, 3], v: [3, 4, 5], omega: [0.2, -0.3, 0.4], selfW: 2 };
  const SR = [{ id: 'a', x: [-2, 3, 1], v: [-1, 2, 4], omega: [-0.5, 0.1, 0.7], m: 8 }, { id: 'b', x: [1, 0, -3], v: [5, -3, 2], omega: [0.1, -0.7, 0.2], m: 3 }];
  const q = coordTwist(R0, SR);
  // ① 正規化(α + Σβ = 1)・U = αv + Σβ V(第330便b の会計の残差)・d = d_並進 + d_回転
  S.normalize = { sum1: q.alpha + q.ports.reduce((s, p) => s + p.beta, 0), residual: q.residual, split: maxAbs(sub(q.d, add(q.dTrans, q.dRot))) };
  // ② 瞬間の共変性(共通の並進 b と枠の回転 ω_f —— 原点の回り)
  { const b = [7, -9, 3], om = [0.11, 0.27, -0.13], tf = (o) => Object.assign({}, o, { v: sub(sub(o.v, b), crs(om, o.x)), omega: sub(o.omega, om) });
    const t = coordTwist(tf(R0), SR.map(tf)), sc = Math.max(1, nrm(q.d), nrm(q.spin.slip));
    S.covariance = { dDiff: nrm(sub(t.d, q.d)) / sc, slipDiff: nrm(sub(t.spin.slip, q.spin.slip)) / sc, Ushift: nrm(sub(t.U, sub(sub(q.U, b), crs(om, R0.x)))) / Math.max(1, nrm(q.U)),
      targetShift: nrm(sub(t.spin.target, sub(q.spin.target, om))) / Math.max(1, nrm(q.spin.target)) }; }
  // ③ 剛体の共動(全部が v = b + ω_f × x・Ω = ω_f)で d = 0・滑り 0
  { const b = [7, -9, 3], om = [0.11, 0.27, -0.13], rg = (o) => Object.assign({}, o, { v: add(b, crs(om, o.x)), omega: om.slice() }), t = coordTwist(rg(R0), SR.map(rg));
    S.rigid = { d: nrm(t.d) / nrm(add(b, crs(om, R0.x))), slip: nrm(t.spin.slip) / nrm(om) }; }
  // ④ 単独(源なし)で U = v・目標 = Ω
  { const t = coordTwist(R0, []); S.alone = { U: maxAbs(sub(t.U, R0.v)), target: maxAbs(sub(t.spin.target, R0.omega)), alpha: t.alpha }; }
  // ⑤ 順回転: 静止した受け手(1, 0, 0)・自己 1・源(原点・質量 1・Ω = (0, 0, 2))→ β = 1/2・d = (0, 1, 0)・目標 (0, 0, 1)
  { const t = coordTwist({ id: 'r', x: [1, 0, 0], v: [0, 0, 0], omega: [0, 0, 0], selfW: 1 }, [{ id: 's', x: [0, 0, 0], v: [0, 0, 0], omega: [0, 0, 2], m: 1 }]);
    S.prograde = { d: t.d, target: t.spin.target, beta: t.ports[0].beta, dTrans: t.dTrans }; }
  // ⑥ 分子の距離の次数(w × 量 —— 並進 m Δv/r²・回転の接線 m |Ω × r|/r²・自転 m |ΔΩ|/r²)と第330便b の frameRotationTerm の寄与との一致
  { const one = (r) => { const t = coordTwist({ id: 'r', x: [r, 0, 0], v: [0, 0, 0], omega: [0, 0, 0], selfW: 1e6 }, [{ id: 's', x: [0, 0, 0], v: [0, 1, 0], omega: [0, 0, 2], m: 1 }]), p0 = t.ports[0];
      return { tr: p0.weight * nrm(p0.trans), rot: p0.weight * nrm(p0.rot), spin: p0.weight * nrm(p0.omegaRel), frt: nrm(L.frameRotationTerm({ m: 1, Omega: 2, axis: [0, 0, 1], src: [0, 0, 0], recv: [r, 0, 0], p: 2 }).contribution) }; };
    const rs = [1, 2, 4, 8], vals = rs.map(one), sl = (k) => rs.slice(1).map((r, i) => Math.log(vals[i + 1][k] / vals[i][k]) / Math.log(r / rs[i]));
    S.slopes = { trans: sl('tr'), rot: sl('rot'), spin: sl('spin'), frameRotationTermRel: Math.max(...vals.map((x) => Math.abs(x.frt - x.rot) / x.rot)) }; }
  // ⑦ 向きの違う源のベクトル合成: 受け手(1, 0, 0)・自己 1・源 2 つ(0, 0, 0)と(2, 0, 0)・同じ質量・Ω の大きさ 2・向き 120° → |目標| = 2/3(大きさの和 4/3・z の符号つきの和 1/3 にしない)
  { const t = coordTwist({ id: 'r', x: [1, 0, 0], v: [0, 0, 0], omega: [0, 0, 0], selfW: 1 }, [{ id: 'p', x: [0, 0, 0], v: [0, 0, 0], omega: [0, 0, 2], m: 1 }, { id: 'q', x: [2, 0, 0], v: [0, 0, 0], omega: [Math.sqrt(3), 0, -1], m: 1 }]);
    S.vectorSum = { targetNorm: nrm(t.spin.target), magnitudeSum: t.ports.reduce((s, p) => s + p.beta * nrm(p.omegaRel), 0), zSigned: t.spin.target[2], angleDeg: Math.acos(dot([0, 0, 2], [Math.sqrt(3), 0, -1]) / 4) * 180 / Math.PI }; }
  // ⑧ 拒否(重複の id・受け手と同じ id・一致点・次元・自己 ≤ 0・非有限・負の質量・源どうしの核の重なり・受け手と源の核の接する距離)
  { const r = { id: 'r', x: [1, 0, 0], v: [0, 0, 0], omega: [0, 0, 0], selfW: 1 }, s = { id: 's', x: [0, 0, 0], v: [0, 0, 0], omega: [0, 0, 2], m: 1 };
    const rej = [() => coordTwist(r, [s, Object.assign({}, s)]), () => coordTwist(r, [Object.assign({}, s, { id: 'r' })]), () => coordTwist(r, [Object.assign({}, s, { x: [1, 0, 0] })]),
      () => coordTwist(Object.assign({}, r, { omega: [0, 0] }), [s]), () => coordTwist(Object.assign({}, r, { selfW: 0 }), [s]), () => coordTwist(Object.assign({}, r, { selfW: NaN }), [s]),
      () => coordTwist(r, [Object.assign({}, s, { m: -1 })]), () => coordTwist(r, [Object.assign({}, s, { Rcore: 0.6 }), Object.assign({}, s, { id: 't', x: [-1, 0, 0], Rcore: 0.5 })]),
      () => coordTwist(Object.assign({}, r, { Rcore: 0.5 }), [Object.assign({}, s, { Rcore: 0.5 })])];
    S.reject = rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }); }
  // ⑨ 自己の重みの宣言: 形 3 × 規則 2 が有限・kappaM は w ∝ 1/m(m を 2 倍で 1/2)・radius は w = coef m/R²・拒否(知らない規則・半径 0・m 0)
  { const g = SELF_SHAPES.flatMap((sh) => SELF_RULES.map((ru) => selfDecl({ shape: sh, rule: ru, m: 1e24, Robs: 1e6 })));
    const k1 = selfDecl({ shape: 'ballHarmonic', rule: 'kappaM', m: 1e24 }), k2 = selfDecl({ shape: 'ballHarmonic', rule: 'kappaM', m: 2e24 });
    const rr = selfDecl({ shape: 'point', rule: 'radius', m: 3, Robs: 2 });
    const rej = [() => selfDecl({ shape: 'point', rule: 'mOverZero', m: 1, Robs: 1 }), () => selfDecl({ shape: 'point', rule: 'radius', m: 1, Robs: 0 }), () => selfDecl({ shape: 'point', rule: 'kappaM', m: 0 })];
    S.selfDecl = { n: g.length, allFinite: g.every((x) => fin(x.w) && x.w > 0), kappaHalf: k2.w / k1.w, radiusPoint: rr.w, reject: rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }) }; }
  // ⑩ 呼ぶだけ: d・目標が第330便b の weightedMotion・spinTarget の直接の呼び出しと同じ
  { const wm = L.weightedMotion(R0.v, R0.selfW, q.ports.map((p) => ({ weight: p.weight, velocity: p.V }))), st = L.spinTarget(R0.omega, R0.selfW, SR.map((s, j) => ({ weight: q.ports[j].weight, omega: s.omega })));
    S.calls = { d: maxAbs(sub(wm.d, q.d)), target: maxAbs(sub(st.target, q.spin.target)) }; }
  // ⑪ 口の登録(AN587): 同じ interactionId と channel の二度の登録を拒否・同じ interactionId の別の channel は受ける・知らない channel と負の Γ は拒否
  { const p = { interactionId: 'm|e', recv: 'm', src: 'e', nu: [0, 0, 1], Gamma: 1 };
    const ok = registerPorts([Object.assign({ channel: 'inertialRotation' }, p), Object.assign({ channel: 'gravTide' }, p)]);
    const rej = [() => registerPorts([Object.assign({ channel: 'gravTide' }, p), Object.assign({ channel: 'gravTide' }, p)]), () => registerPorts([Object.assign({ channel: 'gyroPerp' }, p)]),
      () => registerPorts([Object.assign({ channel: 'axial' }, p, { Gamma: -1 })]), () => registerPorts([Object.assign({ channel: 'axial' }, p, { interactionId: '' })])];
    S.registry = { accepted: ok.ports.length, keys: ok.keys, reject: rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }) }; }
  // ⑫ 4 条件(Ω = (0, 0, 1)・回転の口 ν = 3・Γ = 2・潮汐の口 ν = 0.5・Γ = 4): 合トルク 4・−2・2・0・熱 8・1・9・0・寄せた口の熱 2/3
  { const fc = fourConditions({ rot: { interactionId: 'm|e', channel: 'inertialRotation', recv: 'm', src: 'e', nu: [0, 0, 3], Gamma: 2 }, tide: { interactionId: 'm|e', channel: 'gravTide', recv: 'm', src: 'e', nu: [0, 0, 0.5], Gamma: 4 }, Omega: [0, 0, 1] });
    S.four = { torque: DECL.conditions.map((k) => fc.conditions[k].torque[2]), heat: DECL.conditions.map((k) => fc.conditions[k].heat), heatBy: fc.conditions.both.heatBy, torqueAddRel: fc.torqueAddRel, heatAddRel: fc.heatAddRel,
      ledger: fc.ledgerMaxRel, zeroAll: fc.zeroAll, merged: fc.mergedHeat }; }
  // ⑬ 近点の一次の目安の解析の値: 並進 k = 1 で π b/p・k = 2 で 2π b/p²・回転 k = 0 で π c a^{3/2}/√GM(GM = 1・a = 1・e = 0.3)
  { const a = 1, e = 0.3, p = a * (1 - e * e);
    S.apsis = { t1: apsidalFirstOrder({ GM: 1, a, e, kind: 'translation', coef: 1e-4, k: 1 }), t1w: Math.PI * 1e-4 / p, t2: apsidalFirstOrder({ GM: 1, a, e, kind: 'translation', coef: 1e-4, k: 2 }), t2w: 2 * Math.PI * 1e-4 / (p * p),
      r0: apsidalFirstOrder({ GM: 1, a, e, kind: 'rotation', coef: 1e-4, k: 0 }), r0w: Math.PI * 1e-4, r2: apsidalFirstOrder({ GM: 1, a, e, kind: 'rotation', coef: 1e-4, k: 2 }) }; }
  // ⑭ 通約: 金星(自転 −243.025 日・公転 224.701 日・地球 365.256 日)の太陽日 116.75 日・会合周期 583.92 日・比 ≈ 5・水星(58.6462・87.969)の 3:2
  { const v = lockCommensurability({ spinDays: -243.025, orbitDays: 224.701, refOrbitDays: 365.256 }), m = lockCommensurability({ spinDays: 58.6462, orbitDays: 87.969, pq: [3, 2] });
    S.comm = { solarDay: v.solarDayDays, synodic: v.synodicDays, ratio: v.synodicOverSolarDay, nInt: v.nearestInteger, mercRatio: m.spinOverOrbitRate, mercDev: m.pqDev,
      reject: [() => lockCommensurability({ spinDays: 0, orbitDays: 1 }), () => lockCommensurability({ spinDays: 1, orbitDays: 2, refOrbitDays: 1 })].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }) }; }
  // ⑮ 内部熱の 3 欄(閉じた・定常・観測の比を別の欄に —— 閉じて定常でない行を数える)
  { const t = heatThreeColumns([{ key: 'x', closed: true, alongRel: 0.5, obsRatio: 0.2, heatObs: 1, recvResidualRel: 0, systemResidualRel: 1e-16 }, { key: 'y', closed: true, alongRel: 0, obsRatio: null, heatObs: null }]);
    S.heat3 = { nClosed: t.nClosed, nSteady: t.nSteady, nObs: t.nObs, nClosedNotSteady: t.nClosedNotSteady }; }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  return {
    normalize: close(S.normalize.sum1, 1) && S.normalize.residual <= 1e-12 && S.normalize.split <= 1e-12,
    covariance: S.covariance.dDiff <= DECL.covTol && S.covariance.slipDiff <= DECL.covTol && S.covariance.Ushift <= DECL.covTol && S.covariance.targetShift <= DECL.covTol,
    rigidZero: S.rigid.d <= DECL.covTol && S.rigid.slip <= DECL.covTol,
    aloneIdentity: S.alone.U === 0 && S.alone.target === 0 && S.alone.alpha === 1,
    prograde: close(S.prograde.beta, 0.5) && S.prograde.d[0] === 0 && close(S.prograde.d[1], 1) && S.prograde.d[2] === 0 && close(S.prograde.target[2], 1) && S.prograde.target[0] === 0 && S.prograde.target[1] === 0 && maxAbs(S.prograde.dTrans) === 0,
    slopes: S.slopes.trans.every((x) => close(x, -2, 1e-12)) && S.slopes.rot.every((x) => close(x, -1, 1e-12)) && S.slopes.spin.every((x) => close(x, -2, 1e-12)) && S.slopes.frameRotationTermRel <= 1e-12,
    vectorSum: close(S.vectorSum.targetNorm, 2 / 3) && close(S.vectorSum.magnitudeSum, 4 / 3) && close(S.vectorSum.zSigned, 1 / 3) && close(S.vectorSum.angleDeg, 120, 1e-9),
    rejectInputs: S.reject.length === 9 && S.reject.every((x) => x === true),
    selfDecl: S.selfDecl.n === 6 && S.selfDecl.allFinite && close(S.selfDecl.kappaHalf, 0.5) && close(S.selfDecl.radiusPoint, 0.75) && S.selfDecl.reject.every((x) => x === true),
    callsW330b: S.calls.d === 0 && S.calls.target === 0,
    registry: S.registry.accepted === 2 && S.registry.keys.join() === 'm|e|inertialRotation,m|e|gravTide' && S.registry.reject.every((x) => x === true),
    fourConditions: S.four.torque.join() === '4,-2,2,0' && S.four.heat.join() === '8,1,9,0' && S.four.heatBy.inertialRotation === 8 && S.four.heatBy.gravTide === 1 && S.four.torqueAddRel === 0 && S.four.heatAddRel === 0
      && S.four.ledger <= 1e-15 && S.four.zeroAll === true && close(S.four.merged, 2 / 3, 1e-12),
    apsisAnalytic: close(S.apsis.t1, S.apsis.t1w, 1e-10) && close(S.apsis.t2, S.apsis.t2w, 1e-10) && close(S.apsis.r0, S.apsis.r0w, 1e-10) && S.apsis.r2 < 0,
    commensurability: Math.abs(S.comm.solarDay - 116.75) < 0.01 && Math.abs(S.comm.synodic - 583.92) < 0.01 && S.comm.nInt === 5 && Math.abs(S.comm.ratio - 5) < 0.01 && Math.abs(S.comm.mercDev) < 1e-3 && S.comm.reject.every((x) => x === true),
    heatThreeColumns: S.heat3.nClosed === 2 && S.heat3.nSteady === 1 && S.heat3.nObs === 1 && S.heat3.nClosedNotSteady === 1,
  };
}

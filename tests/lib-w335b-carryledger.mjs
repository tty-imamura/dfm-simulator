// 第335便b(原仮定者の決断(2026-11-12)「自分自身は分母に入る。分子にも入れた場合と、v として別途加算した場合が、同じになる想定。v を分けた方がシンプル」(AN654)・
//   「引きずりの運動は相殺するが、エネルギーは相殺しない」(AN653)・「座標変換の基準なので観測値」(AN650)・原仮定者の補足(2026-11-12)「太陽や惑星の自転は、銀河の軸引きずりから供給される。
//   供給が無いと減衰するのは想定内」・原仮定者の回答(2026-11-12 —— AN646 = A・AN651 = A・AN652)・統括の検証項目 R329):
//   **定義を揃える純関数 —— 自己を運ぶ式(v を分けた形)・熱の口(物理の源ごと)・供給のある開いた帳簿(銀河の軸引きずり)・T1 の部位の速度の則**
//   (器 tests/exp-w335b-carryledger.mjs と QA lint.carryLedger335b・behavior.carryLedger335b・docs.carryLedger335b が読む —— html を読まない・状態を持たない。
//   第333便b・第334便b・第334便a・第333便a の lib は呼ぶだけ・エンジンの式を写さない)。**全部「診断」**(エンジン・在位の本・受理器へ足す操作ではない)。出発点の形は統括の参考の試作。
//
// ■ 記号: 位置 p・距離 r・質量 m・速度 v・観測自転 s(ベクトル)・慣性決定力 W(w_ij・自己 w_ii・背景 W₀ —— 主列は W₀ = 0)・引きずり係数 Y_k(R_d = Y_k m)・応答 Γ ≥ 0・τ = I/Γ。
//
// ■ 宣言(走行の前 —— DECL と DECL_TEXT に置く。結果を見て変えない)
//   ① 自己を運ぶ式(v を分けた形): U_i = v_i + d_i・d_i = Σ_{j≠i} w_ij (C_{j→i} − v_i)/W_i・W_i = w_ii + W₀ + Σ_{j≠i} w_ij・C_{j→i} = v_j + s_j × (p_i − p_j)(s は観測自転 —— J 案の s_d を入れない)。
//     背景 W₀ ≠ 0 の対照は同じ規則で (W₀/W_i)(v_bg − v_i) を d に足す。**数値は d を相対の差から直に**(U − v の引き算をしない)・源の割合は Σ_j w_ij/W_i で持つ(1 − f_self と書かない —— 桁落ち)。
//     分子に自己を入れた平均 (w_ii v_i + W₀ v_bg + Σ w_ij C_{j→i})/W_i と恒等(機械の精度)。単独の天体では d = 0・U = v(慣性の移動は消えない)。
//     軸の差分への拡張(ω′ = ½∇×U′ —— 自己の局所の場に自転を入れる C_i(p) = v_i + s_i × (p − p_i))は第334便b の carryAt を呼ぶ(写さない)。第333便b の静止の自己の項は比べる列。
//   ② 熱の口(物理の源ごと): 受動の応答 N = Γ(ω − s_i)。口の割り振りは第334便b の pathPorts(Γ_k = Γ|ω_k|/Σ|ω_l|・ν_k = ω_k Σ|ω_l|/|ω_k|)を呼ぶ。
//     (主) 物理の源ごとにまとめた口(同じ源の自転の直接・モーメントの勾配・並進の通過を源ごとに足してから 1 つの口)/(比) 数式の分解ごとの口(第334便b の型)/(否定対照) 全部を相殺した 1 つの口。
//     合トルクは 3 列で同じ(向き付きで足す)・熱は (比) ≥ (主) ≥ (否定対照)(三角不等式)。**帳簿の恒等式はどの列でも閉じる —— 閉じるだけでは熱は一意にならない**。
//     源ごとの部は**受け手の静止系**で作る(並進の通過の部 = (v_j − v_i) ⊗ ∇(w_j/W) —— 割り振りがガリレイ変換で変わらない形)。重心系の割り振り(第333便b・第334便b の型)は比べる列。
//   ③ 供給のある開いた帳簿(口 = 銀河の軸引きずり → 受け手 = 太陽・惑星の自転): 受動の型 N = Γ(ω_gal − s)(Γ ≥ 0 —— 熱は非負)。
//     Δ(E_spin + E_orb + E_internal) = ∫P_gal dt − ∫L_rad dt・dL_spin/dt = N_gal − N_loss(銀河の側の流出 −N_gal は補助の帳簿)。定常では P_in = s·N_loss + Q。
//     能動の駆動の型は置かない(置くなら仕事を別の欄に)。要る Γ は「要る値」(診断 —— 採用ではない・観測に合わせて選ばない)。供給なしの列は対照(減衰の時間 J/|N_loss|)。
//   ④ T1 の部位の速度の則: 捩れの率 s·r̂(第334便a の t1Twist を呼ぶ —— s z/r)・軸 r̂・Ω∥ = (s·r̂) r̂・部位の横のずれ b⊥ での速度 Ω∥ × b⊥(受け手の中心で 0)。
//     s z は参照の腕 r を置いた速さの指標(受け手の中心の並進の速度と呼ばない)。軌道や熱へ作用させる向きは本枝では決めない。
//
// ■ 言わないこと: 自己を運ぶ式は定義の恒等式(慣性の導出ではない)・熱の比は文献の値との比(機構の同定ではない)・要る Γ は要る値(同定ではない)・供給で熱が合ったと書かない・
//   ω は回転率(トルクでも熱でもない —— Γ を介す)・文献の値は一次資料に当たっていない。
import * as B333 from './lib-w333b-axialfield.mjs';
import * as L334 from './lib-w334b-ledger.mjs';
import * as A334 from './lib-w334a-heightlaw.mjs';
import * as A333 from './lib-w333a-rotdiff.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w335b-carryledger-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const v3 = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const n = nrm(a); return n > 0 ? scl(a, 1 / n) : [0, 0, 0]; };
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const DEG = Math.PI / 180, DAY = 86400, KPC = 3.0856775814913673e19;
/** 銀河の源の物理の源の名(口の鍵 —— 本の id と同じ綴りにしない) */
export const GAL_KEY = 'milkyWaySrc';

/** 一覧 */
export const SELF_RULES = B333.SELF_RULES;
export const HEAT_COLS = Object.freeze(['bySource', 'byPart', 'merged']);
export const FRAMES = Object.freeze(['rest', 'bary']);
export const GAL_READINGS = Object.freeze(['rotation', 'fieldPort', 'carryPort', 'jEquiv', 'jEquivPort']);
export const GAL_SOURCES = Object.freeze(['center', 'inner']);
/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  G: 6.674e-11, c: 299792458, AU: 1.495978707e11, yearS: 365.25 * DAY,
  /** 重みの次数・r_ref(単位を揃える宣言の長さ)・W₀ = 0(主列)—— 第334便b と同じ */
  alpha: 2, rRef: 1.495978707e11, W0: 0,
  /** 熱の口の列(主・比・否定対照)・源ごとの部を作る系(主は受け手の静止系)・τ の格子(公転の周期の倍数)と文書の τ */
  heatMain: 'bySource', heatCompare: 'byPart', heatNegative: 'merged', frameMain: 'rest', tauOrbits: Object.freeze([1, 1e3, 1e6]), tauDoc: 1e3,
  /**
   * 銀河の源(2 つの読み): center = 中心の点(内側の質量 M = v₀²R₀/G を中心に置く・自転は観測の回転の角速度 Ω_gal = v₀/R₀ —— 回転の向きは銀河の北極の反対)/
   *   inner = 半径の内の和(同じ M を R < R₀ の円盤の環 NR 本 × 方位 K 点に等しい質量で置く —— 平らな回転曲線の Σ ∝ 1/R・各点は円軌道の速さ v₀・自転 0)。
   *   J 等価の読み(比べる列 —— 回答 AN650 で座標変換の基準からは外した)は中心の点の自転を s_d(第333便a の dragSpin —— λ_J = 1・f_d = 2/5・慣性係数は平らな回転曲線の円盤 f = 1/2 の宣言)。
   *   離散化の照らしは NR・K を 2 倍(inner の読みの変わり方を記録 —— 宣言の物差し)。
   */
  galaxy: Object.freeze({ v0: A334.LIT334A.galaxy.v, R0kpc: A334.LIT334A.galaxy.RKpc, fObsDisk: 0.5, NR: 16, K: 64, NRalt: 32, Kalt: 128 }),
  /** 天の向き(J2000 の赤道座標の銀河の北極と銀河の中心・黄道傾斜 —— 本の座標は黄道 J2000〔太陽の自転軸の向きで照合する〕) */
  sky: Object.freeze({ ngpRaDeg: 192.85948, ngpDecDeg: 27.12825, gcRaDeg: 266.405, gcDecDeg: -28.93617, oblDeg: 23.4392911 }),
  /** 恒等式の門の相対の許容・carryAt と中心差分の照らしの許容 */
  idTol: 1e-12, fdTol: 1e-6,
});
/** 帳簿の宣言の文(正本の先頭に置く —— 走行の前) */
export const DECL_TEXT = Object.freeze({
  carry: 'U_i = v_i + d_i・d_i = Σ_{j≠i} w_ij (C_{j→i} − v_i)/(w_ii + Σ_{j≠i} w_ij)・C_{j→i} = v_j + s_j × (p_i − p_j)(s は観測自転)・W₀ ≠ 0 の対照は (W₀/W)(v_bg − v_i) を足す・d は相対の差から直に・源の割合は Σ_j w_ij/W',
  carryAxial: 'ω′ = ½∇×U′(自己の局所の場 C_i(p) = v_i + s_i × (p − p_i) —— 第334便b の carryAt を呼ぶ)・静止の自己の項(第333便b)は比べる列',
  heat: '(主) 物理の源ごとにまとめた口/(比) 数式の分解ごとの口/(否定対照) 全部を相殺した 1 つの口 —— 合トルクは同じ・熱は 比 ≥ 主 ≥ 否定対照・源ごとの部は受け手の静止系で作る',
  supply: 'Δ(E_spin + E_orb + E_internal) = ∫P_gal dt − ∫L_rad dt・dL_spin/dt = N_gal − N_loss・受動の型 N_gal = Γ(ω_gal − s)・定常 P_in = s·N_loss + Q・能動の駆動の型は置かない・供給なしの列は対照',
  t1: '捩れの率 s·r̂ = s z/r・Ω∥ = (s·r̂) r̂・部位の速度 Ω∥ × b⊥(中心で 0)・s z は参照の腕を置いた速さの指標・軌道や熱へ作用させる向きは決めない',
});
/**
 * 文献の値(SI —— 本便は一次資料に当たっていない〔この箱から外のサイトに届かない〕—— 文献の値・未照合)。
 * 太陽の光度は IAU 2015 の決議 B3 の名目の値 3.828e26 W。観測の熱流は第330便a の lib の値(地球・木星・イオ・土星)と月(Apollo 15・17 の 2 点の熱流 21・14 mW/m² —— Langseth, Keihm & Peters 1976 ——
 * 平均 0.018 W/m² を全球へ外挿した桁の目安)。水星・金星・トリトンは観測の熱流が無い(null —— 模型の推定は載せない)。
 */
export const LIT = Object.freeze({
  note: '文献の値・未照合(太陽の光度は IAU 2015 の決議 B3 の名目の値・月の熱流は Apollo 15・17 の 2 点の平均の全球への外挿〔Langseth, Keihm & Peters 1976〕・他は第330便a の lib の値)',
  lumSun: 3.828e26,
  heatFlowW: Object.freeze(Object.assign({}, S330.DECL.lit.heatFlowW, { moon: 0.018 * 4 * Math.PI * 1.7374e6 * 1.7374e6, mercury: null, triton: null })),
});

/* ───────── ① 自己を運ぶ式 ───────── */
/** 源の座標の速度 C_{j→i} = v_j + s_j × (p_i − p_j) */
export function coordVelocity(src, p) {
  if (!src || !v3(src.p) || !v3(src.v) || !v3(src.s) || !v3(p)) throw new RangeError('coordVelocity: p・v・s は有限の 3 成分');
  return add(src.v, crs(src.s, sub(p, src.p)));
}
/**
 * 自己を運ぶ式(v を分けた形)。v:[3]・selfW ≥ 0・W0 ≥ 0・vBg:[3](W0 > 0 のとき)・sources:[{ w ≥ 0, C:[3] }]。
 * 戻り値: W・d(相対の差から直に)・U = v + d・direct(分子に自己を入れた平均)・srcShare = Σw/W・fSelf = w_ii/W・bgShare
 */
export function carriedVelocity({ v, selfW, W0 = 0, vBg = null, sources }) {
  if (!v3(v) || !fin(selfW) || selfW < 0 || !fin(W0) || W0 < 0 || !Array.isArray(sources)) throw new RangeError('carriedVelocity: v は有限の 3 成分・自己と背景の重み ≥ 0・源は配列');
  if (W0 > 0 && !v3(vBg)) throw new RangeError('carriedVelocity: W₀ > 0 なら背景の速度 v_bg が要る');
  let Ws = 0;
  for (const q of sources) { if (!q || !fin(q.w) || q.w < 0 || !v3(q.C)) throw new RangeError('carriedVelocity: 源は { w ≥ 0, C:[3] }'); Ws += q.w; }
  const W = selfW + W0 + Ws;
  if (!(W > 0) || !fin(W)) throw new RangeError('carriedVelocity: 分母が 0 か有限でない');
  let d = [0, 0, 0], direct = scl(v, selfW / W);
  for (const q of sources) { d = add(d, scl(sub(q.C, v), q.w / W)); direct = add(direct, scl(q.C, q.w / W)); }
  if (W0 > 0) { d = add(d, scl(sub(vBg, v), W0 / W)); direct = add(direct, scl(vBg, W0 / W)); }
  return { W, d, U: add(v, d), direct, srcShare: Ws / W, fSelf: selfW / W, bgShare: W0 / W };
}
/**
 * 受け手 1 つの自己を運ぶ式の行(at・v・s・m・R —— 受け手・sources:[{ key, p, v, s, m }]・selfRule)。
 * 戻り値: d・|d|・源の割合・max|C − v|・不等式 |d| ≤ (Σw/W) max|C − v|・静止の自己の場 U_static との恒等 U = U_static + f_self v・ω′(第334便b の carryAt)・静止の自己の項の ω(第333便b)
 */
export function carryRow({ at, v, s, m, R, sources, selfRule, alpha = DECL.alpha, rRef = DECL.rRef }) {
  const sw = B333.selfWeightOf({ rule: selfRule, m, Robs: R, alpha, rRef, G: DECL.G, c: DECL.c });
  const srcs = sources.map((q) => ({ w: B333.weightOf(q.m, nrm(sub(at, q.p)), alpha, rRef), C: coordVelocity(q, at) }));
  const cvr = carriedVelocity({ v, selfW: sw.w, sources: srcs });
  const F = B333.integratedField({ at, sources: sources.map((q) => ({ p: q.p, v: q.v, s: q.s, m: q.m })), alpha, rRef, selfW: sw.w });
  const Ust = add(F.U, scl(v, cvr.fSelf)), idRel = nrm(sub(cvr.U, Ust)) / Math.max(nrm(cvr.U), 1e-300), dirRel = nrm(sub(cvr.U, cvr.direct)) / Math.max(nrm(cvr.U), 1e-300);
  const cMax = Math.max(...srcs.map((q) => nrm(sub(q.C, v)))), dn = nrm(cvr.d);
  const ca = L334.carryAt({ at, sources, selfRule, m, R, v, s });
  return { d: cvr.d, dNorm: dn, srcShare: cvr.srcShare, fSelf: cvr.fSelf, cMax, bound: cvr.srcShare * cMax, boundOk: dn <= cvr.srcShare * cMax * (1 + 1e-12), idStaticRel: idRel, idDirectRel: dirRel,
    omegaCarry: ca.omegaEff, omegaStatic: F.omega, oneMinusCarry: ca.oneMinus };
}

/* ───────── ② 熱の口 ───────── */
/** 同じ物理の源の部(鍵 '源|部')を源ごとに足す(鍵の '|' の前が源の名 —— 別の源は分けたまま) */
export function groupBySource(parts) {
  if (!Array.isArray(parts)) throw new RangeError('groupBySource: 部は配列');
  const g = new Map();
  for (const q of parts) {
    if (!q || typeof q.key !== 'string' || !v3(q.omega)) throw new RangeError('groupBySource: 部は { key, omega:[3] }');
    const k = q.key.split('|')[0];
    if (!k) throw new RangeError('groupBySource: 物理の源の名が無い');
    g.set(k, add(g.get(k) || [0, 0, 0], q.omega));
  }
  return [...g].map(([key, omega]) => ({ key, omega }));
}
/** 熱の口の 3 列(主 bySource・比 byPart・否定対照 merged)—— 第334便b の axialLedger を呼ぶ(byPart の列の merged が否定対照) */
export function heatColumns({ parts: parts0, s, Gamma }) {
  // 同じ鍵の部(1 つの物理の源を多数の点で置いた源 —— 例 銀河の円盤の点)は鍵ごとに先に足す(分解ごとの列は「源 × 部」の口)
  const mm = new Map(); for (const q of parts0) { if (!q || typeof q.key !== 'string' || !v3(q.omega)) throw new RangeError('heatColumns: 部は { key, omega:[3] }'); mm.set(q.key, add(mm.get(q.key) || [0, 0, 0], q.omega)); }
  const parts = [...mm].map(([key, omega]) => ({ key, omega }));
  const P = L334.axialLedger({ parts, s, Gamma }), S = L334.axialLedger({ parts: groupBySource(parts), s, Gamma });
  const t0 = P.merged.torque, tq = (t) => nrm(sub(t, t0)) / Math.max(nrm(t0), 1e-300);
  return { omega: P.omega, bySource: { heat: S.heat, torque: S.torque, nPorts: S.nPorts, identityRel: S.identityRel }, byPart: { heat: P.heat, torque: P.torque, nPorts: P.nPorts, identityRel: P.identityRel },
    merged: { heat: P.merged.heat, torque: P.merged.torque }, torqueSameRel: Math.max(tq(S.torque), tq(P.torque)), order: P.heat >= S.heat * (1 - 1e-12) && S.heat >= P.merged.heat * (1 - 1e-12) };
}
/** 受け手の位置の源ごとの部(frame: rest = 受け手の静止系〔源の速度から v_i を引く〕・bary = 与えた系)—— 第334便b の fieldAt を呼ぶ */
export function partsAt({ at, vRecv, sources, selfRule, m, R, frame = DECL.frameMain }) {
  if (!FRAMES.includes(frame)) throw new RangeError('partsAt: 系は ' + FRAMES.join('・'));
  const src = frame === 'rest' ? sources.map((q) => Object.assign({}, q, { v: sub(q.v, vRecv) })) : sources;
  return L334.fieldAt({ at, sources: src, selfRule, m, R });
}
/** 自己を運ぶ読みの部(受け手の静止系では自己の勾配の項 ½ g × v_i が 0 —— 自己は口にしない)—— 第334便b の carryAt を呼ぶ */
export function carryPartsAt({ at, vRecv, sRecv, sources, selfRule, m, R, frame = DECL.frameMain }) {
  const rest = frame === 'rest', src = rest ? sources.map((q) => Object.assign({}, q, { v: sub(q.v, vRecv) })) : sources;
  return L334.carryAt({ at, sources: src, selfRule, m, R, v: rest ? [0, 0, 0] : vRecv, s: sRecv });
}

/* ───────── ③ 銀河の源と供給の帳簿 ───────── */
const raDec = (ra, dec) => [Math.cos(dec * DEG) * Math.cos(ra * DEG), Math.cos(dec * DEG) * Math.sin(ra * DEG), Math.sin(dec * DEG)];
const eqToEcl = (u, e) => [u[0], u[1] * Math.cos(e) + u[2] * Math.sin(e), -u[1] * Math.sin(e) + u[2] * Math.cos(e)];
/** 銀河の座標軸(本の座標 = 黄道 J2000): x̂ 銀河の中心へ・ẑ 銀河の北極・ŷ = ẑ × x̂(太陽の回転の向き)・銀河の角運動量の向き L̂ = −ẑ */
export function galacticAxes(sky = DECL.sky) {
  const e = sky.oblDeg * DEG, zg = unit(eqToEcl(raDec(sky.ngpRaDeg, sky.ngpDecDeg), e)), gc = eqToEcl(raDec(sky.gcRaDeg, sky.gcDecDeg), e);
  const xg = unit(sub(gc, scl(zg, dot(gc, zg)))), yg = crs(zg, xg);
  return { xg, yg, zg, Lhat: scl(zg, -1), gcRaw: gc, orthoDeg: Math.asin(Math.min(1, Math.abs(dot(gc, zg)))) / DEG };
}
/** 銀河の量: M = v₀²R₀/G・Ω_gal = v₀/R₀・J 等価の s_d(第333便a の dragSpin) */
export function galaxyOf(g = DECL.galaxy) {
  const R0 = g.R0kpc * KPC, M = g.v0 * g.v0 * R0 / DECL.G, Om = g.v0 / R0;
  const D = A333.dragSpin({ m: M, Robs: R0, s: Om, fObs: g.fObsDisk, fD: A333.DECL.fD, lambdaJ: 1 });
  return { R0, M, Omega: Om, sd: D.sd, Rd: D.Rd, sdOverOmega: D.ratio, J: g.fObsDisk * M * R0 * R0 * Om };
}
/**
 * 銀河の源(本の座標・太陽系の重心の系の速度): variant center/inner・spin obs(Ω_gal)/jd(s_d —— 中心の点だけ)・NR・K。
 * 太陽系の重心を原点に置き、銀河の中心は R₀ x̂ の向き・重心の銀河に対する速度は v₀ ŷ(源の速度は銀河の系の速度 − v₀ ŷ)。鍵は全部 GAL_KEY(1 つの物理の源)。
 */
export function galaxySources({ variant, spin = 'obs', NR = DECL.galaxy.NR, K = DECL.galaxy.K, axes = galacticAxes(), gal = galaxyOf() }) {
  if (!GAL_SOURCES.includes(variant) || !['obs', 'jd'].includes(spin)) throw new RangeError('galaxySources: 読みは ' + GAL_SOURCES.join('・') + '・自転は obs・jd');
  const { xg, yg, Lhat } = axes, R0 = gal.R0, v0 = DECL.galaxy.v0, pc = scl(xg, R0), vOff = scl(yg, -v0);
  if (variant === 'center') return [{ key: GAL_KEY, p: pc, v: vOff, s: scl(Lhat, spin === 'jd' ? gal.sd : gal.Omega), m: gal.M }];
  if (spin !== 'obs') throw new RangeError('galaxySources: J 等価の読みは中心の点だけ');
  if (!(Number.isInteger(NR) && NR > 0 && Number.isInteger(K) && K > 0)) throw new RangeError('galaxySources: NR・K は正の整数');
  const u = scl(xg, -1), out = [], mq = gal.M / (NR * K);
  for (let k = 0; k < NR; k++) {
    const R = (k + 0.5) * R0 / NR;
    for (let l = 0; l < K; l++) {
      const ph = 2 * Math.PI * (l + 0.5) / K, cp = Math.cos(ph), sp = Math.sin(ph);
      out.push({ key: GAL_KEY, p: add(pc, add(scl(u, R * cp), scl(yg, R * sp))), v: add(scl(add(scl(u, -sp), scl(yg, cp)), v0), vOff), s: [0, 0, 0], m: mq });
    }
  }
  return out;
}
/**
 * 銀河の口(受け手の静止系・物理の源ごとにまとめた口の銀河の口): 太陽系の源 + 銀河の源 → 銀河の部の ω_gal・口の目標 ν_gal = ω_gal Σ_g|ω_g|/|ω_gal|・口の割合 |ω_gal|/Σ_g|ω_g|。
 * carry: 自己を運ぶ読み(selfRule の自己 —— 部は (1 − f_self) で割る)
 */
export function galaxyPortAt({ at, vRecv, sRecv, m, R, sources, selfRule = 'none', carry = false }) {
  const fa = carry ? carryPartsAt({ at, vRecv, sRecv, sources, selfRule, m, R }) : partsAt({ at, vRecv, sources, selfRule, m, R });
  const g = groupBySource(fa.parts), gal = g.find((q) => q.key === GAL_KEY), sumAbs = g.reduce((t, q) => t + nrm(q.omega), 0);
  if (!gal) throw new RangeError('galaxyPortAt: 銀河の源が無い');
  const w = nrm(gal.omega), nu = w > 0 ? scl(gal.omega, sumAbs / w) : [0, 0, 0];
  return { omegaGal: gal.omega, nu, share: sumAbs > 0 ? w / sumAbs : 0, sumAbs, omegaTotal: g.reduce((a, q) => add(a, q.omega), [0, 0, 0]), nGroups: g.length, parts: fa.parts };
}
/**
 * 供給の帳簿の 1 行(受動の型): 受け手の自転 sVec・損失のトルク N_loss(ŝ の向きの大きさ —— 正は自転を減らす)・口の目標 T:[3]・J。
 * (T − s)·ŝ > 0 なら要る Γ = N_loss/((T − s)·ŝ)・N = Γ(T − s)・熱 Q = Γ|T − s|²・供給 P_in = N·T・受け手の仕事 N·s(恒等式 P_in − N·s − Q = 0)。≤ 0 なら受動では供給できない(能動の駆動は置かない)。
 * 整列の仮定(比べる列): T′ = |T| ŝ で同じ式。供給なしの列: 減衰の時間 J/|N_loss|。
 */
export function supplyRow({ sVec, Nloss, T, J, heatObs = null }) {
  if (!v3(sVec) || !(nrm(sVec) > 0) || !fin(Nloss) || !v3(T) || !fin(J)) throw new RangeError('supplyRow: s ≠ 0・N_loss・T・J は有限');
  const sh = unit(sVec), s = nrm(sVec);
  const one = (Tv) => {
    const gap = dot(sub(Tv, sVec), sh);
    if (!(gap > 0) || !(Nloss > 0)) return { feasible: false, gapOverS: gap / s };
    const Gam = Nloss / gap, N = scl(sub(Tv, sVec), Gam), Q = Gam * dot(sub(Tv, sVec), sub(Tv, sVec)), Pin = dot(N, Tv), rw = dot(N, sVec);
    return { feasible: true, gapOverS: gap / s, Gamma: Gam, Q, Pin, recvWork: rw, identityRel: Math.abs(Pin - rw - Q) / Math.max(Math.abs(Pin), Math.abs(rw), Q, 1e-300), Qneg: Q < 0,
      perpTorque: nrm(sub(N, scl(sh, dot(N, sh)))), obsRatio: fin(heatObs) && heatObs > 0 ? Q / heatObs : null, tauYr: (J / s) / Gam / DECL.yearS };
  };
  return { targetParOverS: dot(T, sh) / s, targetMagOverS: nrm(T) / s, passive: one(T), aligned: one(scl(sh, nrm(T))), noSupplyYr: Nloss > 0 ? J / Nloss / DECL.yearS : null, lossWork: s * Nloss };
}

/* ───────── ④ T1 の部位の速度の則 ───────── */
/** 線のまわりの捩れの部位の速度(源の自転 s:[3]・源 → 受け手の中心 r:[3]・軸からのずれ b:[3]): 率 s·r̂(第334便a の t1Twist —— s z/r)・Ω∥ × b⊥(中心で 0) */
export function lineTwistAtOffset({ s, r, b }) {
  if (!v3(s) || !v3(r) || !v3(b) || !(nrm(r) > 0)) throw new RangeError('lineTwistAtOffset: s・r・b は有限の 3 成分・r ≠ 0');
  const rh = unit(r), sa = nrm(s), sh = sa > 0 ? scl(s, 1 / sa) : [0, 0, 1], z = dot(r, sh), rho = Math.hypot(...sub(r, scl(sh, z)));
  const tw = A334.t1Twist({ rho, z, sd: sa });
  const Op = scl(rh, tw.rate), bPerp = sub(b, scl(rh, dot(b, rh)));
  return { rate: tw.rate, rateDirect: dot(s, rh), proxy: tw.par, axis: rh, OmegaPar: Op, u: crs(Op, b), uPerp: crs(Op, bPerp), speed: Math.abs(tw.rate) * nrm(bPerp), center: nrm(crs(Op, [0, 0, 0])) };
}
/** T1 の受け手の行(源の自転 s・源 → 受け手 r・受け手の半径 R・受け手の自転 sRecv・受け手の位置の ω_field): 率・表面の速さの最大 |s·r̂| R・指標 s z・受け手の自転の r̂ 成分・ω_field の r̂ 成分 */
export function t1Row({ s, r, R, sRecv = null, omegaField = null }) {
  const L = lineTwistAtOffset({ s, r, b: [0, 0, 0] }), rh = L.axis, side = unit(crs(rh, Math.abs(rh[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), Lb = lineTwistAtOffset({ s, r, b: scl(side, R) });
  return { rate: L.rate, rateOverS: L.rate / nrm(s), rateDirectRel: relD(L.rate, L.rateDirect), rateDirectOverS: Math.abs(L.rate - L.rateDirect) / nrm(s), proxy: L.proxy, surfaceMax: Math.abs(L.rate) * R, surfaceAt: nrm(Lb.u), center: L.center,
    recvPar: sRecv ? dot(sRecv, rh) : null, fieldPar: omegaField ? dot(omegaField, rh) : null };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  // 1 自己を運ぶ式: 分子に自己を入れた平均と恒等(自己 0・1・1e6)・単独の天体で d = 0・U = v・背景 W₀ ≠ 0 の対照・ガリレイ変換で d が変わらない・源の割合を Σw/W で持つ
  { const v = [2, 3, -1], src = [{ w: 1, C: [1, 0, 2] }, { w: 2, C: [-4, 4, 0] }];
    const rows = [0, 1, 1e6].map((sw) => carriedVelocity({ v, selfW: sw, sources: src })), one = carriedVelocity({ v, selfW: 1, sources: [] });
    const bg = carriedVelocity({ v, selfW: 1, W0: 2, vBg: [0, 0, 5], sources: src }), u = [1e5, -2e5, 3e5], bst = carriedVelocity({ v: add(v, u), selfW: 1, sources: src.map((q) => ({ w: q.w, C: add(q.C, u) })) });
    const big = carriedVelocity({ v, selfW: 1e30, sources: src });
    S.carry = { id: Math.max(...rows.map((r) => nrm(sub(r.U, r.direct)) / nrm(r.U)), nrm(sub(bg.U, bg.direct)) / nrm(bg.U)), single: nrm(one.d) === 0 && nrm(sub(one.U, v)) === 0,
      bgTerm: nrm(sub(bg.d, add(scl(sub([1, 0, 2], v), 1 / 6), add(scl(sub([-4, 4, 0], v), 2 / 6), scl(sub([0, 0, 5], v), 2 / 6))))) / nrm(bg.d),
      galilean: nrm(sub(bst.d, rows[1].d)) / nrm(rows[1].d), share: big.srcShare > 0 && relD(big.srcShare, 3 / (1e30 + 3)) <= 1e-15, d1e6: nrm(rows[2].d) }; }
  // 2 静止の自己の場との恒等 U = U_static + f_self v と carryAt の ω′ と中心差分(冥王星–カロンの配置・自己 観測半径)
  { const pc = L334.pcSystem(), b0 = pc.bodies[0], src = [Object.assign({ key: 'charon' }, pc.bodies[1])], R0 = carryRow({ at: b0.p, v: b0.v, s: b0.s, m: b0.m, R: b0.R, sources: src, selfRule: 'robs' });
    const fd = L334.carryFd({ at: b0.p, sources: src, selfRule: 'robs', m: b0.m, R: b0.R, v: b0.v, s: b0.s }), Rn = carryRow({ at: b0.p, v: b0.v, s: b0.s, m: b0.m, R: b0.R, sources: src, selfRule: 'none' });
    S.carryField = { idStatic: R0.idStaticRel, fd: nrm(sub(R0.omegaCarry, fd)) / nrm(fd), sync: nrm(sub(R0.omegaCarry, b0.s)) / nrm(b0.s), bound: R0.boundOk && Rn.boundOk, dSync: Rn.dNorm / nrm(b0.v) }; }
  // 3 熱の口の反例: 同じ源を +2 と −1 に分ける(Γ = 1・s = 0)→ 源ごと 1・分解ごと 9・相殺 1/別の源なら源ごとも 9/合トルクは同じ
  { const same = heatColumns({ parts: [{ key: 'a|spinDirect', omega: [0, 0, 2] }, { key: 'a|trans', omega: [0, 0, -1] }], s: [0, 0, 0], Gamma: 1 });
    const diff = heatColumns({ parts: [{ key: 'a|spinDirect', omega: [0, 0, 2] }, { key: 'b|trans', omega: [0, 0, -1] }], s: [0, 0, 0], Gamma: 1 });
    S.heat = { sameSource: same.bySource.heat, samePart: same.byPart.heat, sameMerged: same.merged.heat, diffSource: diff.bySource.heat, diffPart: diff.byPart.heat, torque: Math.max(same.torqueSameRel, diff.torqueSameRel),
      order: same.order && diff.order, identity: Math.max(same.bySource.identityRel, same.byPart.identityRel, diff.bySource.identityRel) }; }
  // 4 受け手の静止系と重心系: 自己なしの合計の ω は同じ・自己を運ぶ読みの ω′ は同じ・静止系では自己の勾配の口が無い(地球–月)
  { const em = L334.emSystem(), mo = em.bodies[1], src = [Object.assign({ key: 'earth' }, em.bodies[0])];
    const r = partsAt({ at: mo.p, vRecv: mo.v, sources: src, selfRule: 'none', m: mo.m, R: mo.R, frame: 'rest' }), b = partsAt({ at: mo.p, vRecv: mo.v, sources: src, selfRule: 'none', m: mo.m, R: mo.R, frame: 'bary' });
    const cr = carryPartsAt({ at: mo.p, vRecv: mo.v, sRecv: mo.s, sources: src, selfRule: 'robs', m: mo.m, R: mo.R, frame: 'rest' }), cb = carryPartsAt({ at: mo.p, vRecv: mo.v, sRecv: mo.s, sources: src, selfRule: 'robs', m: mo.m, R: mo.R, frame: 'bary' });
    S.frame = { none: nrm(sub(r.F.omega, b.F.omega)) / nrm(b.F.omega), carry: nrm(sub(cr.omegaEff, cb.omegaEff)) / nrm(cb.omegaEff), restSelfPort: nrm(cr.extra), barySelfPort: nrm(cb.extra) > 0 }; }
  // 5 T1: 中心で 0・横のずれで率 × |b⊥|・t1Twist の率 = s·r̂・b が軸に沿うと 0・proxy = s z
  { const s = [0, 0, 2], r = [3, 0, 4], L0 = lineTwistAtOffset({ s, r, b: [0, 0, 0] }), L1 = lineTwistAtOffset({ s, r, b: [0, 1, 0] }), L2 = lineTwistAtOffset({ s, r, b: [0.6, 0, 0.8] });
    S.t1 = { rate: L0.rate, rateDirect: relD(L0.rate, L0.rateDirect), center: nrm(L0.u), off: nrm(L1.u), offExpect: 1.6, along: nrm(L2.u), proxy: L0.proxy, uPerp: nrm(sub(L1.u, L1.uPerp)) }; }
  // 6 供給の帳簿: 目標が自転より小さい → 受動では供給できない/大きい → Γ > 0・熱 ≥ 0・恒等式・整列の列
  { const lo = supplyRow({ sVec: [0, 0, 1], Nloss: 2, T: [0, 0.5, 0.3], J: 10 }), hi = supplyRow({ sVec: [0, 0, 1], Nloss: 2, T: [0, 1, 3], J: 10 });
    S.supply = { loFeasible: lo.passive.feasible, hiFeasible: hi.passive.feasible, Gamma: hi.passive.Gamma, Q: hi.passive.Q, Qexp: 1 * (1 + 4), id: hi.passive.identityRel, alignedLo: lo.aligned.feasible, noSupply: lo.noSupplyYr * DECL.yearS }; }
  // 7 銀河の座標軸: 正規直交・本の座標(黄道)で太陽の自転軸と銀河の北極の角・銀河の中心の向きの直交からのずれ
  { const A = galacticAxes(), g = galaxyOf();
    S.galaxy = { ortho: Math.max(Math.abs(dot(A.xg, A.yg)), Math.abs(dot(A.xg, A.zg)), Math.abs(dot(A.yg, A.zg)), Math.abs(nrm(A.xg) - 1), Math.abs(nrm(A.yg) - 1)), gcOffDeg: A.orthoDeg, Omega: g.Omega, sdOverOmega: g.sdOverOmega,
      centerSync: (() => { const q = galaxySources({ variant: 'center' })[0], C = coordVelocity(q, [0, 0, 0]); return nrm(C) / DECL.galaxy.v0; })(), innerMass: relD(galaxySources({ variant: 'inner', NR: 4, K: 8 }).reduce((t, q) => t + q.m, 0), g.M) }; }
  // 8 入力の拒否
  const rej = [() => carriedVelocity({ v: [1, 2], selfW: 0, sources: [] }), () => carriedVelocity({ v: [1, 2, 3], selfW: -1, sources: [] }), () => carriedVelocity({ v: [1, 2, 3], selfW: 0, sources: [] }),
    () => carriedVelocity({ v: [1, 2, 3], selfW: 0, W0: 1, sources: [] }), () => groupBySource([{ key: '|x', omega: [0, 0, 1] }]), () => groupBySource([{ key: 'a', omega: [1] }]), () => lineTwistAtOffset({ s: [0, 0, 1], r: [0, 0, 0], b: [0, 0, 0] }),
    () => supplyRow({ sVec: [0, 0, 0], Nloss: 1, T: [0, 0, 1], J: 1 }), () => galaxySources({ variant: 'disk' }), () => galaxySources({ variant: 'inner', spin: 'jd' }), () => partsAt({ at: [1, 0, 0], vRecv: [0, 0, 0], sources: [], selfRule: 'none', m: 1, R: 1, frame: 'cm' })];
  S.reject = { n: rej.map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } }).filter(Boolean).length, of: rej.length };
  return S;
}
export function pureGates(S) {
  const t = DECL.idTol;
  return {
    carry: S.carry.id <= 1e-15 && S.carry.single && S.carry.bgTerm <= 1e-15 && S.carry.galilean <= 1e-9 && S.carry.share && S.carry.d1e6 > 0,
    carryField: S.carryField.idStatic <= t && S.carryField.fd <= DECL.fdTol && S.carryField.sync <= 1e-9 && S.carryField.bound && S.carryField.dSync <= 1e-12,
    heat: S.heat.sameSource === 1 && S.heat.samePart === 9 && S.heat.sameMerged === 1 && S.heat.diffSource === 9 && S.heat.diffPart === 9 && S.heat.torque <= t && S.heat.order && S.heat.identity <= t,
    frame: S.frame.none <= 1e-9 && S.frame.carry <= 1e-9 && S.frame.restSelfPort === 0 && S.frame.barySelfPort,
    t1: Math.abs(S.t1.rate - 1.6) <= 1e-15 && S.t1.rateDirect <= 1e-15 && S.t1.center === 0 && Math.abs(S.t1.off - S.t1.offExpect) <= 1e-15 && S.t1.along <= 1e-15 && Math.abs(S.t1.proxy - 8) <= 1e-15 && S.t1.uPerp <= 1e-15,
    supply: S.supply.loFeasible === false && S.supply.hiFeasible === true && Math.abs(S.supply.Gamma - 1) <= 1e-15 && Math.abs(S.supply.Q - S.supply.Qexp) <= 1e-12 && S.supply.id <= t && S.supply.alignedLo === false && Math.abs(S.supply.noSupply - 5) <= 1e-12,
    galaxy: S.galaxy.ortho <= 1e-12 && S.galaxy.centerSync <= 1e-12 && S.galaxy.innerMass <= 1e-12 && S.galaxy.sdOverOmega > 1,
    reject: S.reject.n === S.reject.of,
  };
}
export { KPC };

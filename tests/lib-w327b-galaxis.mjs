// 第327便b(原仮定者の回答(2026-11-05 —— AN536)「銀河の局所場の大きさは、太陽の自転と、APIの模型の、両方を検証する。「銀河の回転と逆向き」の解釈については、
//   銀河は腕を引きずって回転しているが、腕が引きずられるという事はその腕より慣性決定力場の方が早く回転しており、見た目は順回転だが場に対して逆回転になる」・
//   統括の検証項目 R296): **銀河の局所場の大きさの 2 つの経路と「場に対して逆回転」の読みの純関数**
//   (器 tests/exp-w327b-galaxis.mjs と QA lint.galaxis327b が読む —— html を読まない・状態を持たない・場の API〔第321便c の lib〕の式を写さない)。
//
// ■ 何をするか(宣言 —— 探索の候補。今の DFM の式から導いた法則ではない)
//   経路 1(太陽の自転): 第326便d の太陽の式の A(器が第326便d の器の関数を呼んで作る —— 本 lib は口が 1 つの和の式 s/(ĝ·â) だけを持つ)。
//   経路 2(場の API の模型): 第321便c の lib の sample の出力(u[3]・∇u〔∂u_a/∂x_b〕・位置)から、伝達の候補 T_G ごとに銀河の口の目標 ν_G を作る:
//     halfCurl(半渦度 ½∇×u をそのまま)/rigid(剛体の読みの角速度 (u_φ/R)ĝ)/shear(シア (∂_R u_φ − u_φ/R)ĝ = R∂_R(u_φ/R) ĝ)/
//     k1Mirror(K1 の源の幾何 —— 銀河を 1 つの源と見て、剛体の読みの角速度を受け手への向き n̂ について鏡映した (2n̂n̂ᵀ − I)(u_φ/R)ĝ —— 第308便a の鏡映の核の向き)。
//     どれも宣言の候補(同じ量ではない —— 半渦度と u_φ/R が同じになるのは剛体回転だけ)。二つの経路は**平均しない**(別の列)。
//   AN536 の読み: 相対の角速度 Ω_rel = Ω_body − Ω_frame(ベクトルで引いて軸へ射影)。場の角速度 Ω_field ĝ は**腕と同じ向き**(仮定 Ω_field > Ω_arm > 0 —— 腕は場に引きずられる)。
//     見た目(遠方の枠)の符号と場に対する符号を表にし、銀河の口の目標を ν_G = g_T (Ω_frame − Ω_field) ĝ(g_T ≥ 0 なら場より遅い枠は逆向きの目標)と置いたときに
//     A を生むのに要る相対の角速度 Ω_rel,req = A/g_T を伝達の候補ごとに出す。**場の軸を反転しない**(Ω_field ĝ の Ω_field は常に正 —— 反転の入力は拒否)。
// ■ 言わないこと: 銀河場の同定と数えない・腕より速い場は観測の量ではない(Ω_field は仮定)・A は「太陽の口が銀河だけという接続の帰結」(同定の値ではない)・
//   半渦度を今の軸引きずりと同じ量と書かない・点のセルの和の半渦度の符号は格子で交互に変わる(u が近いことを curl の収束とみなさない)・回転曲線の予言ではない。
export const LIB_VERSION = 'w327b-galaxis-lib-1';
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const norm = (a) => Math.hypot(a[0], a[1], a[2]);
export const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
export const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const vec = (a) => Array.isArray(a) && a.length === 3 && a.every(Number.isFinite);
/** 1 kpc [m](第319便b の lib の KPC と同じ定義 —— 1 pc = 3.0856775814913673e16 m) */
export const KPC_M = 3.0856775814913673e19;
/** 角速度の単位 1 km s⁻¹ kpc⁻¹ を rad/s へ(文献の値の換算だけ —— 文書には rad/s で書く) */
export const KMS_PER_KPC = 1e3 / KPC_M;

/** 宣言(走行の前に置く —— 結果を見て変えない) */
export const DECL = Object.freeze({
  // 伝達の候補(順は表の順 —— どれも宣言の候補)
  candidates: Object.freeze(['halfCurl', 'rigid', 'shear', 'k1Mirror']),
  // 太陽の位置(銀河中心系 —— +x = 銀河の中心 → 太陽・+z = ĝ)。主は面上(第321便c の表と同じ点)・面からの高さの感度は ±0.02 kpc
  //   (太陽は面の北に約 0.02 kpc —— 文献の値・本便は一次資料に当たっていない。ĝ は南の銀極の向きなので北は z < 0)
  zSensKpc: Object.freeze([-0.02, 0.02]),
  // 中心と残余の分割の R_cut [kpc](第321便c の表の主の値)
  rCutKpc: 4,
  // 点のセルの和の格子(第319便b の GRIDS の動径の数 + 384 —— 器が lib の GRIDS から組む)
  cellNr: Object.freeze([48, 96, 192, 384]),
  // 渦状腕のパターンの角速度の文献の範囲(km s⁻¹ kpc⁻¹ の数 —— 棒は含めない・本便は一次資料に当たっていない)。文書は rad/s で書く
  OmegaPatternKmsKpc: Object.freeze([17, 30]),
  // AN536 の読みの伝達の利得の単位(同じ形の仮定: 場に対する源の流れが見た目の流れと同じ形で Ω_rel/Ω_mat 倍 —— 剛体の差の場は今の API に無い)
  gainUnit: 'Ω_mat = V(R_0)/R_0(宣言の模型の流れの太陽の位置の角速度)',
  // 経路 1 の K1 の 2 列(第326便d の器の partK の variant)
  k1Variants: Object.freeze(['now', 'J']),
});

/* ───────── 円筒の基底と場の読み ───────── */
/** 位置 [kpc](銀河中心系)の円筒の基底 R̂・φ̂・ẑ(= ĝ)と、銀河の中心から受け手への単位ベクトル n̂ */
export function cylFrame(posKpc) {
  if (!vec(posKpc)) throw new RangeError('cylFrame: 位置は有限の 3 成分');
  const R = Math.hypot(posKpc[0], posKpc[1]);
  if (!(R > 0)) throw new RangeError('cylFrame: 軸の上は φ̂ が定まらない');
  const c = posKpc[0] / R, s = posKpc[1] / R, r = norm(posKpc);
  return { RKpc: R, Rm: R * KPC_M, Rhat: [c, s, 0], phiHat: [-s, c, 0], zHat: [0, 0, 1], nHat: scale(posKpc, 1 / r) };
}
const asG = (g) => (Array.isArray(g[0]) ? g : [[g[0], g[1], g[2]], [g[3], g[4], g[5]], [g[6], g[7], g[8]]]);
/** aᵀ G b(G[i][j] = ∂u_i/∂x_j —— (b·∇)u の a の成分) */
const bil = (a, G, b) => { let s = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += a[i] * G[i][j] * b[j]; return s; };
/**
 * 場の読み(f = { posKpc, u[3] m/s, G: ∂u_a/∂x_b の 3×3 か 9 の行優先 1/s })。
 *   u_φ = φ̂·u・剛体の読み u_φ/R(u から)・∂_R u_φ = φ̂ᵀ G R̂・勾配の u_φ/R = −R̂ᵀ G φ̂(軸対称・純方位の場で u から作る値と同じ)・
 *   半渦度の z = ½(φ̂ᵀGR̂ − R̂ᵀGφ̂)(= ½(∂_R u_φ + u_φ/R))・シア = φ̂ᵀGR̂ + R̂ᵀGφ̂(= ∂_R u_φ − u_φ/R)・半渦度のベクトル ½∇×u
 */
export function readingsOf(f) {
  if (!f || !vec(f.u)) throw new RangeError('readingsOf: u は有限の 3 成分');
  const C = cylFrame(f.posKpc), G = asG(f.G);
  const uPhi = dot(C.phiHat, f.u), dRu = bil(C.phiHat, G, C.Rhat), uOverRG = -bil(C.Rhat, G, C.phiHat);
  const hc = [0.5 * (G[2][1] - G[1][2]), 0.5 * (G[0][2] - G[2][0]), 0.5 * (G[1][0] - G[0][1])];
  return { RKpc: C.RKpc, Rm: C.Rm, uPhi, rigid: uPhi / C.Rm, dRuPhi: dRu, uOverRFromG: uOverRG, halfCurlZ: 0.5 * (dRu + uOverRG), shear: dRu - uOverRG, halfCurl: hc, nHat: C.nHat };
}
/**
 * 伝達の候補 T_G の目標 ν_G [rad/s](銀河中心系のベクトル)。key: halfCurl・rigid・shear・k1Mirror。
 *   k1Mirror: (2n̂n̂ᵀ − I)(Ω_rig ĝ) = Ω_rig(2(n̂·ĝ)n̂ − ĝ)(n̂ ⟂ ĝ の面上では −Ω_rig ĝ —— 源の赤道の受け手は逆向き・仰角 45° で ĝ に垂直・軸の上で同じ向き)
 */
export function transferOf(key, f) {
  const r = readingsOf(f), g = [0, 0, 1];
  if (key === 'halfCurl') return r.halfCurl.slice();
  if (key === 'rigid') return scale(g, r.rigid);
  if (key === 'shear') return scale(g, r.shear);
  if (key === 'k1Mirror') { const nz = dot(r.nHat, g); return sub(scale(r.nHat, 2 * nz * r.rigid), scale(g, r.rigid)); }
  throw new RangeError('transferOf: 伝達の候補 ' + key);
}
/** 候補の表の 1 行(ν_G・ĝ の向きの成分・剛体の読みとの比) */
export function candidatesOf(f) {
  const r = readingsOf(f);
  return DECL.candidates.map((key) => { const nu = transferOf(key, f); return { key, nu, alongG: nu[2], norm: norm(nu), overRigid: r.rigid !== 0 ? nu[2] / r.rigid : null }; });
}

/* ───────── 経路 1 の和の式(口が 1 つ)───────── */
/** 太陽の口が銀河だけのときの和の式(軸へ射影 —— Ω·â = Σ ν·â = A ĝ·â)の A = s/(ĝ·â)。ベクトルの和 Ω = ν は ĝ ∦ â なので成り立たない(軸に垂直な分は固定軸の支え) */
export function onePortA({ s, a, g }) {
  if (!Number.isFinite(s) || !vec(a) || !vec(g)) throw new RangeError('onePortA: 入力');
  const ga = dot(g, a);
  if (ga === 0) throw new RangeError('onePortA: ĝ·â = 0 では A が決まらない');
  return s / ga;
}

/* ───────── 二つの経路の表(平均しない)───────── */
/**
 * 伝達の候補ごとの行: 経路 1 の A(符号つき)と経路 2 の ν_G·ĝ を**別の列**に置き、要る倍率 A/(ν·ĝ)(符号つき —— 負なら向きが逆)と abs の比を出す。
 *   平均・重み付きの合成の列は作らない(QA が鍵を照合する)
 */
export function twoPathRows({ A, rows }) {
  if (!Number.isFinite(A)) throw new RangeError('twoPathRows: A');
  return rows.map((q) => ({ key: q.key, path1A: A, path2AlongG: q.alongG, signAgree: sgn(A) === sgn(q.alongG), needFactor: q.alongG !== 0 ? A / q.alongG : null, absRatio: q.alongG !== 0 ? Math.abs(A) / Math.abs(q.alongG) : null }));
}

/* ───────── AN536: 相対の角速度と符号の表 ───────── */
/** Ω_rel = Ω_body − Ω_frame(ベクトル)と軸 axis への射影 */
export function relOmega(OmBody, OmFrame, axis) {
  if (!vec(OmBody) || !vec(OmFrame) || !vec(axis)) throw new RangeError('relOmega: 入力');
  const d = sub(OmBody, OmFrame); return { vec: d, along: dot(d, axis) };
}
/** 場の枠(Ω_field ĝ)。**場の軸を反転しない**: Ω_field は腕のパターンの角速度より大きい正の数(前提 —— 違えば拒否) */
export function fieldFrame(OmegaField, OmegaPattern, g) {
  if (!vec(g) || !Number.isFinite(OmegaField) || !Number.isFinite(OmegaPattern) || !(OmegaPattern > 0)) throw new RangeError('fieldFrame: 入力');
  if (!(OmegaField > OmegaPattern)) throw new RangeError('fieldFrame: 前提 Ω_field > Ω_arm > 0(腕は場に引きずられる)の外 —— 場の軸の反転や遅い場は AN536 の読みに入れない');
  return scale(g, OmegaField);
}
/**
 * 符号の表(AN536)。Ω_field は未知 —— 前提 Ω_field > Ω_p(腕のパターンの角速度 —— 文献の範囲 [lo, hi] のどこか)だけを使う。
 *   行 = { key, ja, w(体の角速度の ĝ の向きの成分か、体の軸の射影の自転), c(場の枠の射影 ĝ·axis), arm(腕そのもの) }
 *   見た目(遠方の枠)の符号 = sgn(w)。場に対して = sgn(w − Ω_field c):
 *     c > 0: w ≤ Ω_p,lo c なら前提の全域で負(**逆回転**)/w > Ω_p,lo c なら Ω_field > w/c で負・その下で正(条件つき —— 閾値 w/c)/腕そのものは前提から負
 *     c < 0: w ≥ 0 なら前提の全域で正/w < 0 なら Ω_field < w/c で負(条件つき)
 */
export function signTable({ OmegaPattern, rows }) {
  if (!(Array.isArray(OmegaPattern) && OmegaPattern.length === 2 && OmegaPattern[0] > 0 && OmegaPattern[1] >= OmegaPattern[0])) throw new RangeError('signTable: Ω_p の範囲');
  const lo = OmegaPattern[0];
  return rows.map((q) => {
    const { w, c } = q, out = { key: q.key, ja: q.ja, axis: q.axis, w, c, apparentSign: sgn(w), relSign: null, threshold: null, relKind: null };
    if (q.arm) { out.relSign = -1; out.relKind = 'premise'; return out; }   // 腕そのもの: Ω_p − Ω_field < 0(前提)
    if (c > 0) {
      if (w <= lo * c) { out.relSign = -1; out.relKind = 'always'; }
      else { out.relSign = 0; out.relKind = 'conditional'; out.threshold = w / c; }   // Ω_field > 閾値で負
    } else if (c < 0) {
      if (w >= 0) { out.relSign = 1; out.relKind = 'always'; }
      else { out.relSign = 0; out.relKind = 'conditional'; out.threshold = w / c; }   // Ω_field < 閾値で負
    } else { out.relSign = sgn(w); out.relKind = 'always'; }
    return out;
  });
}
/**
 * A を生むのに要る相対の角速度(AN536 の口: ν_G = g_T (Ω_frame − Ω_field) ĝ —— g_T は伝達の候補の利得〔単位の角速度あたり〕)。
 *   Ω_rel,req = A/g_T。前提(場が枠より速い —— Ω_rel < 0)と両立するのは Ω_rel,req < 0 のとき(A < 0 なら g_T > 0)。g_T < 0 の候補は前提の下で A と逆向き
 *   (源の流れの読みで A と同じ符号でも、場に対する読みに重ねると向きが二重に反転する —— 混ぜない)
 */
export function requiredRel({ A, gain }) {
  if (!Number.isFinite(A) || !Number.isFinite(gain)) throw new RangeError('requiredRel: 入力');
  if (gain === 0) return { gain, OmRelReq: null, consistent: false, why: '利得 0' };
  const OmRelReq = A / gain;
  return { gain, OmRelReq, consistent: OmRelReq < 0 };
}

/* ───────── 格子の収束の注意 ───────── */
/** 格子の列の値(粗 → 細)の符号の列・交互か・全部同じ符号か・最後の 2 つの相対の差 */
export function gridSigns(vals) {
  if (!Array.isArray(vals) || vals.length < 2 || !vals.every(Number.isFinite)) throw new RangeError('gridSigns: 2 つ以上の有限の値');
  const s = vals.map(sgn), alt = s.every((v, i) => i === 0 || v === -s[i - 1]), same = s.every((v) => v === s[0]);
  return { signs: s, alternates: alt, sameSign: same, lastRel: relD(vals[vals.length - 1], vals[vals.length - 2]) };
}

/* ───────── geoPN=4 の場の API への引き継ぎの形 ───────── */
/** 成分の一覧(have は今の sample の出力から器が数える —— 鍵の有無)。need は本便の伝達と帳簿が要るか */
export const HANDOFF = Object.freeze([
  Object.freeze({ key: 'u', ja: 'u[3](m/s —— 銀河中心系)', path: ['u'], need: '全部の候補(rigid・k1Mirror は u だけ)' }),
  Object.freeze({ key: 'gradU', ja: '∇u[9](∂u_a/∂x_b —— 1/s)', path: ['gradU'], need: 'halfCurl・shear(勾配の候補)' }),
  Object.freeze({ key: 'dUdt', ja: '∂_t u と定常の宣言(定常なら 0・定常でなければ null —— 0 で埋めない)', path: ['dUdt'], need: '仕事の帳簿(場の時間変化の仕事)' }),
  Object.freeze({ key: 'sourceId', ja: '由来 ID(成分の持ち主の宣言 —— 項ごとの key・coef・owns)', path: ['source', 'terms'], need: '口ごとの熱を由来ごとに分ける' }),
  Object.freeze({ key: 'parts', ja: '項ごとの u・∇u(中心と残余の重ならない分割)', path: ['parts'], need: '由来ごとの ν_G' }),
  Object.freeze({ key: 'velocityRef', ja: '速度の基準(今は源の流れの銀河中心系に固定の文字列)', path: ['contract', 'velocityRef'], need: 'AN536 の場の枠(回転する枠 Ω_frame の入力)' }),
  Object.freeze({ key: 'frameInput', ja: '回転する枠の入力(Ω_frame —— 源の速さから Ω_frame ĝ × x′ を引いた場)', path: ['frame'], need: 'AN536 の Ω_rel を場の API の中で作る(同じ形の仮定を外す)' }),
  Object.freeze({ key: 'fieldOmega', ja: '場の角速度の宣言 Ω_field(腕より速い場 —— 仮定の入力)', path: ['omegaField'], need: 'AN536 の前提を宣言として持つ' }),
  Object.freeze({ key: 'torqueWork', ja: '仕事とトルクの帳簿(受け手ごとの N・供給 N·ν・熱 —— 由来 ID つき)', path: ['ledger'], need: '銀河の中心の供給 = 熱 = 放射(第326便d の帳簿へ渡す)' }),
  Object.freeze({ key: 'curlResolved', ja: '半渦度の収束の印(格子の和の符号の安定 —— 環の積分の経路の誤差とは別)', path: ['curlResolved'], need: '低い N の本で curl を使う前の門' }),
  Object.freeze({ key: 'routeError', ja: '照合の別経路の差(中心差分)', path: ['error', 'route'], need: '勾配の候補の誤差の見積り' }),
  Object.freeze({ key: 'normalization', ja: '正規化の量(β・∇β・Z = 1 + β の項)', path: ['normalization'], need: 'u/β の読み(重みの平均の源の速さ)' }),
]);
/** sample の出力 o(normalization・check つき)で HANDOFF の成分の有無を数える */
export function handoffOf(o) {
  const at = (p) => p.reduce((x, k) => (x && typeof x === 'object' && k in x ? x[k] : undefined), o);
  return HANDOFF.map((h) => { const v = at(h.path); return { key: h.key, ja: h.ja, need: h.need, have: v !== undefined && v !== null }; });
}

/* ───────── 純関数の場面(QA lint.galaxis327b と器の P 段)───────── */
/** 軸対称・純方位の流れ u_φ(R) の場(φ の位置・高さ 0)—— u と解析の勾配(円筒の Gc[0][1] = −u_φ/R・Gc[1][0] = ∂_R u_φ を直交の基底へ) */
export function azimuthalField(RKpc, phi, uPhi, dRu) {
  const c = Math.cos(phi), s = Math.sin(phi), Rm = RKpc * KPC_M, B = [[c, -s, 0], [s, c, 0], [0, 0, 1]], Gc = [[0, -uPhi / Rm, 0], [dRu, 0, 0], [0, 0, 0]], G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let t = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) t += B[i][a] * Gc[a][b] * B[j][b]; G[i][j] = t; }
  return { posKpc: [RKpc * c, RKpc * s, 0], u: [-s * uPhi, c * uPhi, 0], G };
}
export function pureScenes() {
  const S = {}, R = 8, Rm = R * KPC_M, V = 2e5, Om = V / Rm;
  const vals = (f) => Object.fromEntries(candidatesOf(f).map((q) => [q.key, q.alongG]));
  // ① 剛体回転 u_φ = ΩR: 半渦度 = 剛体の読み = Ω・シア 0・鏡映は −Ω(面上)
  S.rigid = vals(azimuthalField(R, 0, V, Om));
  // ② 平らな曲線 u_φ = V: 半渦度 V/(2R)・シア −V/R
  S.flat = vals(azimuthalField(R, 0, V, 0));
  // ③ ケプラー u_φ ∝ R^(−1/2): 半渦度 V/(4R)・シア −(3/2)V/R
  S.kepler = vals(azimuthalField(R, 0, V, -V / (2 * Rm)));
  // ④ 急に下がる u_φ ∝ R^(−2): 半渦度 −V/(2R) < 0(剛体の読みは正 —— 半渦度の符号は回転の向きと別)
  S.steep = vals(azimuthalField(R, 0, V, -2 * V / Rm));
  // ⑤ 方位の回転の共変(φ = 1.1 rad で同じ値)
  { const a = vals(azimuthalField(R, 0, V, -V / (2 * Rm))), b = vals(azimuthalField(R, 1.1, V, -V / (2 * Rm)));
    S.rotate = Math.max(...DECL.candidates.map((k) => relD(a[k], b[k]))); }
  // ⑥ 線形(流れを k 倍すると ν も k 倍 —— 同じ形の仮定の利得の基礎)
  { const k = -3.5, a = vals(azimuthalField(R, 0, V, -V / (2 * Rm))), b = vals(azimuthalField(R, 0, k * V, k * -V / (2 * Rm)));
    S.linear = Math.max(...DECL.candidates.map((q) => relD(b[q], k * a[q]))); }
  // ⑦ 鏡映の核の向き(第308便a の性質): 軸の上で同じ向き・仰角 45° で ĝ に垂直・面上で逆
  { const f = (el) => { const pos = [R * Math.cos(el), 0, R * Math.sin(el)], b = azimuthalField(R * Math.cos(el), 0, V, 0); return transferOf('k1Mirror', { posKpc: pos, u: b.u, G: b.G }); };
    const m0 = f(0), m45 = f(Math.PI / 4), m89 = f(Math.PI / 2 - 1e-6), w0 = V / Rm;
    S.mirror = { plane: m0[2] / w0, deg45: m45[2] / (V / (R * Math.cos(Math.PI / 4) * KPC_M)), nearAxis: m89[2] / (V / (R * Math.cos(Math.PI / 2 - 1e-6) * KPC_M)) }; }
  // ⑧ AN536 の符号の表(合成の場面): Ω_p ∈ [2, 3]・物質 2.5・遅い場の読み 1e-3・傾いた体の軸(ĝ·â = −0.4・s = 1)
  { const T = signTable({ OmegaPattern: [2, 3], rows: [{ key: 'arm', w: 2.5, c: 1, arm: true }, { key: 'mat', w: 2.5, c: 1 }, { key: 'slow', w: 1e-3, c: 1 }, { key: 'bodyG', w: -0.4, c: 1 }, { key: 'bodyOwn', w: 1, c: -0.4 }] });
    S.sign = Object.fromEntries(T.map((q) => [q.key, { app: q.apparentSign, rel: q.relSign, kind: q.relKind, th: q.threshold }]));
    // 具体の Ω_field での射影(前提の内 —— Ω_field = 4)と、場の軸の反転・遅い場の拒否
    const g = [0, 0, 1], a = [Math.sqrt(1 - 0.16), 0, -0.4], Ff = fieldFrame(4, 3, g);
    S.signAt4 = { arm: relOmega(scale(g, 2.5), Ff, g).along, bodyOwn: relOmega(scale(a, 1), Ff, a).along, bodyOwnExpect: 1 + 0.4 * 4 };
    S.rejectFlip = [[-4, 3], [2, 3], [3, 3], [4, 0]].every(([w, p]) => { try { fieldFrame(w, p, g); return false; } catch (e) { return true; } }); }
  // ⑨ 要る相対の角速度: A = −2・利得 +0.5 → −4(前提と両立)・利得 −0.5 → +4(両立しない)
  S.req = { pos: requiredRel({ A: -2, gain: 0.5 }), neg: requiredRel({ A: -2, gain: -0.5 }) };
  // ⑩ 二つの経路の表は平均の列を持たない
  { const T = twoPathRows({ A: -2, rows: [{ key: 'x', alongG: 0.5 }, { key: 'y', alongG: -1e-3 }] });
    S.twoPath = { keys: Object.keys(T[0]), needX: T[0].needFactor, agreeY: T[1].signAgree, absY: T[1].absRatio }; }
  // ⑪ 格子の符号の列
  S.grid = { alt: gridSigns([1, -2, 0.5, -0.1]), same: gridSigns([-1, -1.2, -1.1, -1.15]) };
  // ⑫ 口が 1 つの和の式: A = s/(ĝ·â)(ĝ·â = 0 は拒否)
  { const a = [Math.sin(1), 0, Math.cos(1)]; S.onePort = { A: onePortA({ s: 2, a, g: [0, 0, 1] }), expect: 2 / Math.cos(1) };
    try { onePortA({ s: 1, a: [1, 0, 0], g: [0, 0, 1] }); S.onePort.rejectPerp = false; } catch (e) { S.onePort.rejectPerp = true; } }
  return S;
}
export function pureGates(S) {
  const close = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(Math.abs(a), Math.abs(b), 1e-300);
  const R = 8 * KPC_M, w = 2e5 / R;
  return {
    rigidField: close(S.rigid.halfCurl, w) && close(S.rigid.rigid, w) && Math.abs(S.rigid.shear) <= 1e-12 * w && close(S.rigid.k1Mirror, -w),
    flatCurve: close(S.flat.halfCurl, w / 2) && close(S.flat.shear, -w) && close(S.flat.rigid, w),
    keplerCurve: close(S.kepler.halfCurl, w / 4) && close(S.kepler.shear, -1.5 * w),
    halfCurlSignNotRotation: S.steep.halfCurl < 0 && S.steep.rigid > 0 && close(S.steep.halfCurl, -w / 2),
    rotationCovariant: S.rotate <= 1e-12,
    linearInFlow: S.linear <= 1e-12,
    mirrorGeometry: close(S.mirror.plane, -1) && Math.abs(S.mirror.deg45) <= 1e-12 && S.mirror.nearAxis > 0.999999,
    signTablePremise: S.sign.arm.app === 1 && S.sign.arm.rel === -1 && S.sign.arm.kind === 'premise' && S.sign.mat.kind === 'conditional' && S.sign.mat.th === 2.5
      && S.sign.slow.rel === -1 && S.sign.slow.kind === 'always' && S.sign.bodyG.app === -1 && S.sign.bodyG.rel === -1 && S.sign.bodyOwn.app === 1 && S.sign.bodyOwn.rel === 1,
    relativeProjection: close(S.signAt4.arm, -1.5) && close(S.signAt4.bodyOwn, S.signAt4.bodyOwnExpect),
    fieldAxisNotFlipped: S.rejectFlip === true,
    requiredRel: S.req.pos.OmRelReq === -4 && S.req.pos.consistent === true && S.req.neg.OmRelReq === 4 && S.req.neg.consistent === false,
    twoPathNoAverage: !S.twoPath.keys.some((k) => /mean|avg|average|blend|combined/i.test(k)) && S.twoPath.needX === -4 && S.twoPath.agreeY === true && S.twoPath.absY === 2000,
    gridSigns: S.grid.alt.alternates === true && S.grid.alt.sameSign === false && S.grid.same.sameSign === true && S.grid.same.alternates === false,
    onePort: close(S.onePort.A, S.onePort.expect) && S.onePort.rejectPerp === true,
  };
}

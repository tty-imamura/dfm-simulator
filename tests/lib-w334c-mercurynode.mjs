// 第334便c(原仮定者の整理(2026-11-11)「水星の近点移動について: 斜め軌道の交点での並進の回転が有望」「引き続き、様々な組み合わせを調べる」・
//   原仮定者の回答(2026-11-11 —— AN633)交点・傾き・ベクトルの変化を比べる量に・原仮定者の回答(2026-11-11 —— AN634)今の受け手 n = 2 + K1 は凍結の基準・対称 n = 4 + K1 と受け手 n = −3・対称 n = −6 は比べる列・
//   原仮定者の回答(2026-11-11 —— AN635)統合した並進の回転の分を先に(引きずり自転 s_d の格子を水星の最初のノブにしない)・原仮定者の回答(2026-11-11 —— AN636)自己の半径は Y_k m を基準・次数と自己の形を揃えた格子・
//   統括の検証項目 R324): **斜め軌道の交点の窓の積分の純関数 —— 交点の前後・交点から離れた部分・全周を同じ量で(角運動量の単位ベクトル L̂ の変化・離心率ベクトル e の変化〔面内の回転 = 近点・面外〕・
//   交点・傾き・近点引数・近点経度 —— 太陽の赤道面と黄道)・自己の形を揃えた重みの格子・交点の非対称の仮説の検査・文献の値の物差し(太陽の J₂・Lense–Thirring)**
//   (器 tests/exp-w334c-mercurynode.mjs と QA lint.mercuryNode334c・behavior.mercuryNode334c が読む —— html を読まない・状態を持たない・
//   第333便c・第330便b・第332便a・第309便a・第312便a の lib は呼ぶだけ・エンジンの式を写さない)。**本枝は交点の窓の積分の唯一の持ち主**(高さ則・扁平の式・同期の零試験・帳簿は持たない)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html にある型(G_loc の力の型 —— 受け手 n = 2・K1 の並進)/診断 = この lib の一次の率(Gauss の式の窓ごとの積分)と純粋な積分器/
//   宣言(未接続)= 今のエンジンに無い型(統合した並進引きずり〔源の座標の速度 v_j + s_j × (p_i − p_j) の重み付き平均〕の並進の分・回転の分・両方・対称の G_loc・引きずり自転 s_d の J 案)。
// ■ 比べる量(宣言 —— 走行の前): 基準面に依らない量を主に
//   L̂ の変化 dL̂/dt(ベクトル —— 大きさ |dL̂/dt| と、太陽の自転軸 ŝ のまわりの歳差の成分〔= sin i dΩ_node〕と ŝ へ倒れる成分〔= −di/dt〕)/
//   e の変化(面内の回転 ω_W = (L̂ × ê)·ė/e —— 軌道面の中の近点の回り・面外 L̂·ė/e・大きさ ê·ė)/基準面ごとの交点 Ω_node・傾き i・近点引数 ω・近点経度 ϖ = Ω_node + ω(太陽の赤道面と黄道)。
//   一次の率は h = p × w(w は接触の速度)と e = w × h/μ − p̂ の Gauss の変化(dh/dt = p × F・de/dt = (F × h + w × (p × F))/μ)を、無摂動の軌道に沿って時間で積分して周期で割る。
// ■ 窓(宣言 —— 走行の前・位相の原点は太陽の赤道面の昇交点 u = 0。黄道の交点の窓は対照): 真近点角で交点 ±δ(δ = 5°・15°・45°)の昇交点の窓・降交点の窓と、その間の 2 つの「離れた部分」/
//   赤道面からの高さ |z| ≤ h の帯(h = R_d,☉ の 1・100 倍と太陽の半径の 1・3 倍 —— z = p·ŝ)/全周(離心近点角の一様な格子)。窓の和 = 全周を門にする。
//   **速度の型の窓の値は読みに依る**: F = Dd/Dt の読み(接触の速度 w = 位置の速さ)の窓の値と、引きずりを除いた速度の読み(v = w − d)の窓の値は、窓の端の境界の項 [p × d]・[(d × h + w × (p × d))/μ] だけ違う
//   (全周では消える)—— 窓の表に境界の項 ÷ 窓の値を載せる。
// ■ 交点の非対称の仮説(検査する —— 採用ではない): 「昇交点と降交点で太陽からの距離が違う(r_asc ≠ r_desc)ので交点の寄与が打ち消し合わず、e が面内で回る」。
//   一次の Gauss の式では公転面に垂直な力 F_W は ė を L̂ の向きにしか動かさない(F × h = 0・w × (p × F_W Ŵ) ∥ Ŵ)—— 面内の回転 ω_W への寄与は点ごとに 0(式の帰結 —— 数値で 0 を出す)。
//   統合した並進の回転の分の面内の成分は β(r) cos i r θ̂(i は ŝ に対する傾き —— 軌道の上で一定)で、ω に依らない。予言(走行の前に書く): ω_W は ω に依らず・F_W からの ω_W は 0・
//   ω に依るか否かの物差しは「ω の格子の上の ω_W の振れ ÷ 平均の絶対値 > 1e-6」。二次の結合は純粋な積分器(係数 c と 2c —— 面内の回転の c² の項)で大きさを出す。
// ■ 自己の形を揃えた格子(AN636): 全部 point(W_self = m/R^α)・全部 ballHarmonic(W_self = m/(R^α H_α)・H_α = 単位の一様球の自己の場の調和平均 —— α = 1・2 は第330便b の harmonicSelf と同じ値・
//   α = 1.5 は同じ定義を殻の平均の閉じた式で積分・**α = 3 は自己の場が対数で発散して定義できない**〔null〕)。第333便c の格子(α = 1・2 は ballHarmonic・1.5・3 は point)は混ぜた形 —— 比べる列。
//   G_loc の次数 n と引きずりの距離の次数 α は別のノブ(列の名に両方を書く)。**既存の K1 の並進と統合した並進を重ねて足さない**(統合した並進は K1 の代わり)。
// ■ 言わないこと: 表は「宣言した型の一次の率」「文献の値(未照合)との比」「係数に付く上限」と書く。交点の並進の回転で水星の近点の値を出したとは書かない・観測の余りに合った/合わなかったので
//   棄却とは書かない。一次の率は無摂動の軌道の平均(写しの時間発展ではない)。**文献の値はこの箱から一次資料に当たれない —— 記憶の値は確かさの程度を書く**。
import { secularRates, velocityToAccel, stateAt, anglesOn, crossingAnomalies, bandWindows, transDragVelocity, gLocAccel, k1Velocity, weightOf, dragSpin, integrate3d,
  frameOfElements, orbitOfState, toArcsecCy, CENTURY_S, GEOM as GEOM333C, DECL as DECL333C, vec, C1, gLocShare, q1PNPerOrbit } from './lib-w333c-mercury3d.mjs';
import { harmonicSelf, kappaMRadius } from './lib-w330b-dragweight.mjs';
import { glNodes } from './lib-w332a-eqband.mjs';
import { receiverRule } from './lib-w309a-invsq.mjs';
import { Kball } from './lib-w312a-decay.mjs';

export const LIB_VERSION = 'w334c-mercurynode-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));
export const asec = (r) => (r === null || r === undefined ? null : toArcsecCy(r));

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  G: DECL333C.G, c: DECL333C.c,
  /** 交点の窓の半幅(真近点角 —— 度)と帯の高さ(R_d,☉ の倍数・太陽の半径の倍数)・位相の原点 */
  nodeHalfDeg: Object.freeze([5, 15, 45]),
  heightRd: Object.freeze([1, 100]),
  heightRsun: Object.freeze([1, 3]),
  phaseOrigin: '太陽の赤道面の昇交点(u = 0 —— 公転面と太陽の赤道面の交わりの昇る側)。黄道の昇交点の窓は対照',
  /** 窓の Gauss–Legendre の点(照合の倍)・全周の一様な格子(第333便c の値) */
  glWin: 64, glWinFine: 128, nodes: DECL333C.nodes, nodesFine: DECL333C.nodesFine,
  /** 窓の和 = 全周の門(行の尺度に対する相対) */
  sumTol: 1e-9,
  /** 組み合わせの格子 */
  gLocTypes: Object.freeze([Object.freeze({ pair: 'receiver', n: 2 }), Object.freeze({ pair: 'receiver', n: -3 }), Object.freeze({ pair: 'symmetric', n: 4 }), Object.freeze({ pair: 'symmetric', n: -6 })]),
  alphaGrid: Object.freeze([1, 1.5, 2, 3]),
  shapes: Object.freeze(['point', 'ballHarmonic']),
  radii: Object.freeze(['kappaM', 'radius']),
  parts: Object.freeze(['trans', 'rot', 'both']),
  /** 回転の分の源の自転: 観測自転 s と J 案 s_d(λ_J —— 連動させない・固定の倍率) */
  lambdaJ: Object.freeze([1e-9, 1e-6, 1e-3, 1]),
  fDrag: DECL333C.fDrag,
  /** 交点の非対称の仮説の格子(e と太陽の赤道面の上の近点引数 ω —— 水星の a・太陽の赤道面に対する傾きを据える)・重みの次数・物差し */
  eGrid: Object.freeze([0, 0.1, 0.2056, 0.4]),
  omegaGridDeg: Object.freeze([0, 45, 90, 109.58, 135, 180, 270]),
  hypoAlpha: Object.freeze([1, 2]),
  hypoHalfDeg: 15,
  omegaDependenceTol: 1e-6,
  /** 純粋な積分器(単位の軌道 μ = a = 1 —— 係数を一次の線形の範囲へ上げた写し・h と h/2・窓の長さ 2 つ)と二次の結合の係数 c と 2c */
  integ: Object.freeze({ steps: Object.freeze([2000, 4000]), nOrb: Object.freeze([12, 24]), cRot: 1e-5, cTrans: 1e-6, secondC: Object.freeze([1e-3, 2e-3]), secondSteps: 4000, secondNOrb: 16 }),
  breakPerOrbit: DECL333C.breakPerOrbit,
});
/** 文献の値と出典(**この箱から一次資料に当たれない —— 記憶の値・未照合**。確かさの程度を書く) */
export const LIT = Object.freeze({
  note: '文献の値・未照合 —— この箱から論文と暦表のサイトに届かない。値は記憶の値(確かさ: 桁〔mas/世紀〕は中程度・個々の値と誤差は低い)。物差しには |値| + 誤差を使う',
  /** 暦表の追加の近点の歳差 Δϖ(″/世紀)—— Pitjeva, E. V. & Pitjev, N. P. 2013, MNRAS 432, 3431(EPM2011)の表の型 */
  dvarpi: Object.freeze({ src: 'Pitjeva & Pitjev 2013(MNRAS 432, 3431 —— EPM2011)の追加の近点の歳差(記憶の値・未照合)',
    merc: Object.freeze([-0.0020, 0.0030]), venus: Object.freeze([0.0026, 0.0016]), earth: Object.freeze([0.00019, 0.00019]), mars: Object.freeze([-0.00020, 0.00037]) }),
  /** 暦表の追加の交点の歳差 ΔΩ(″/世紀・黄道)—— Fienga, A. et al. 2011, Celest. Mech. Dyn. Astr. 111, 363(INPOP10a)の表の型 */
  dnode: Object.freeze({ src: 'Fienga et al. 2011(Celest. Mech. Dyn. Astr. 111, 363 —— INPOP10a)の追加の交点の歳差(記憶の値・未照合 —— 確かさは近点より低い)',
    merc: Object.freeze([0.0014, 0.0018]), venus: Object.freeze([0.0002, 0.0015]), earth: null, mars: Object.freeze([-0.00005, 0.00013]) }),
  /** 太陽の J₂(日震学 —— Pijpers, F. P. 1998, MNRAS 297, L76 の型 2.18e-7・記憶の値・確かさ: 中程度)と太陽の角運動量(同 1.9e41 kg m²/s —— 本便は 0.07 M R² s〔本の自転〕で作る) */
  sunJ2: Object.freeze({ value: 2.2e-7, src: 'Pijpers 1998(MNRAS 297, L76)の日震学の J₂ ≈ 2.18e-7(記憶の値・未照合・確かさ中程度)' }),
  sunJlit: Object.freeze({ value: 1.9e41, src: 'Pijpers 1998 の太陽の角運動量 ≈ 1.9e41 kg m²/s(記憶の値・未照合 —— 本便は 0.07 M R² s で作り、比べる値)' }),
  /** 文献の式(物差し): J₂ の交点 dΩ/dt = −(3/2) n J₂ (R/p)² cos i・近点引数 dω/dt = (3/4) n J₂ (R/p)²(5cos²i − 1)/Lense–Thirring dΩ/dt = 2GJ/[c²a³(1−e²)^{3/2}]・dω/dt = −6GJ cos i/[c²a³(1−e²)^{3/2}] */
  formulaSrc: '太陽の J₂ の永年の率(Murray, C. D. & Dermott, S. F. 1999, Solar System Dynamics の型)・Lense, J. & Thirring, H. 1918(Physikalische Zeitschrift 19, 156)の交点と近点引数の率(いずれも太陽の赤道面の要素 —— 記憶の式を純関数の場面で Gauss の平均と照らす)',
});

/* ───────── 小さな道具 ───────── */
/** 真近点角 f → 離心近点角 E(連続 —— f の巻き数を保つ) */
export function eOfF(f, e) {
  const k = Math.round(f / (2 * Math.PI)), f0 = f - 2 * Math.PI * k;
  return 2 * Math.atan2(Math.sqrt(1 - e) * Math.sin(f0 / 2), Math.sqrt(1 + e) * Math.cos(f0 / 2)) + 2 * Math.PI * k;
}
/** 速度の型 → 加速度の型(第333便c の velocityToAccel を呼ぶ)・加速度の型はそのまま */
const accelOf = (orb, eff) => (eff.kind === 'vel' ? velocityToAccel(orb, eff.d) : eff.a);

/* ───────── 自己の形を揃えた重み(AN636)───────── */
/** 単位の一様球(質量 1)の自己の場 K̂_p(t) = ⟨|x − x'|^{−p}⟩_ball(殻の平均の閉じた式を半径で積分 —— a = t で区間を分け u² の置換)。p < 3 */
export function ballField(p, t, ngl = 48) {
  if (!(p > 0 && p < 3) || !(t >= 0 && t <= 1)) throw new RangeError('ballField: 0 < p < 3・0 ≤ t ≤ 1');
  const shell = (a) => { if (t === 0) return Math.pow(a, -p); const d = Math.abs(t - a);
    return p === 2 ? Math.log((t + a) / d) / (2 * a * t) : (Math.pow(t + a, 2 - p) - Math.pow(d, 2 - p)) / (2 * a * t * (2 - p)); };
  const { x, w } = glNodes(ngl);
  let s = 0;
  const seg = (lo, hi, fromHi) => { if (!(hi > lo)) return; const L0 = hi - lo;
    for (let k = 0; k < ngl; k++) { const u = 0.5 * (x[k] + 1), a = fromHi ? hi - L0 * u * u : lo + L0 * u * u, da = 2 * L0 * u * 0.5 * w[k]; if (a > 0) s += 3 * a * a * shell(a) * da; } };
  seg(0, t, true); seg(t, 1, false);
  return s;
}
/** H_p = ⟨1/K̂_p(t)⟩(第309便a の受け手の求積の規則 —— 第330便b の harmonicSelf と同じ定義)。p ≥ 3 は null(自己の場が発散) */
export function harmonicSelfGeneral(p, order = 8) {
  if (!(p > 0)) throw new RangeError('harmonicSelfGeneral: p > 0');
  if (p >= 3) return null;
  let s = 0, wsum = 0;
  for (const q of receiverRule(order)) { s += q.w / ballField(p, q.t); wsum += q.w; }
  return s / wsum;
}
/** 自己の重み(揃えた形): point = m/R^α・ballHarmonic = m/(R^α H_α)。定義できない(α = 3 の ballHarmonic)は null */
export function selfAligned({ shape, alpha, m, R }) {
  if (!DECL.shapes.includes(shape) || !DECL.alphaGrid.includes(alpha) || !(m > 0) || !(R > 0)) throw new RangeError('selfAligned: 宣言');
  if (shape === 'point') return { shape, alpha, w: m / Math.pow(R, alpha), coef: 1, R };
  const H = (alpha === 1 || alpha === 2) ? harmonicSelf(alpha) : harmonicSelfGeneral(alpha);
  if (H === null) return null;
  return { shape, alpha, w: m / (Math.pow(R, alpha) * H), coef: 1 / H, R };
}

/* ───────── 効果の型(源は原点に静止 —— 太陽の反動は持たない宣言)───────── */
/** sys = { M, m, R, sunAxis, sSun, Rsun, orb }。spec: { kind:'gloc', pair, n } | { kind:'k1' } | { kind:'trans', alpha, shape, radius, part, spinFactor } | { kind:'j2', J2 } | { kind:'lt', J } */
export function effectOf(sys, spec) {
  const G = DECL.G, c = DECL.c, mu = sys.orb.mu;
  if (spec.kind === 'gloc') { const eta = sys.M * sys.m / ((sys.M + sys.m) ** 2), fac = spec.pair === 'receiver' ? 1 - 2 * eta : 0.5;
    return { kind: 'acc', a: gLocAccel({ mu, n: spec.n, muEff: mu * fac }) }; }
  if (spec.kind === 'k1') return { kind: 'vel', d: k1Velocity(10 * G * (sys.M + sys.m) / (c * c)) };
  if (spec.kind === 'trans') {
    const Rself = spec.radius === 'kappaM' ? kappaMRadius(sys.m) : sys.R, self = selfAligned({ shape: spec.shape, alpha: spec.alpha, m: sys.m, R: Rself });
    if (!self) return null;
    const spin = scl(sys.sunAxis, sys.sSun * (spec.spinFactor === undefined ? 1 : spec.spinFactor));
    return { kind: 'vel', d: transDragVelocity({ Msrc: sys.M, selfW: self.w, alpha: spec.alpha, spinVec: spin, part: spec.part }), self, Rself };
  }
  if (spec.kind === 'j2') { const k = unit(sys.sunAxis), J2R2 = spec.J2 * sys.Rsun * sys.Rsun;
    return { kind: 'acc', a: (st) => { const x = st.x, r = st.r, z = dot(x, k), r2 = r * r, c0 = -1.5 * mu * J2R2 / (r2 * r2 * r); return add(scl(x, c0 * (1 - 5 * z * z / r2)), scl(k, c0 * 2 * z)); } }; }
  if (spec.kind === 'lt') { const Jv = scl(unit(sys.sunAxis), spec.J);
    // 重力磁気の加速度(試験粒子・一次): a = (2G/(c² r³))[3(J·p̂)(p̂ × w) + w × J]
    return { kind: 'acc', a: (st) => { const x = st.x, r = st.r, xh = scl(x, 1 / r), k0 = 2 * G / (c * c * r * r * r); return scl(add(scl(crs(xh, st.v), 3 * dot(Jv, xh)), crs(st.v, Jv)), k0); } }; }
  throw new RangeError('effectOf: 型');
}

/* ───────── 窓の一次の率(ベクトルとスカラー)───────── */
/** 区間 [E0, E1] の Gauss–Legendre の点の和(重み × r/a/(2π) で時間の平均への寄与)。全周は windows = null(一様な格子) */
function eachPoint(orb, windows, gl, nodes, fn) {
  const { a, e } = orb;
  if (windows) { const { x: gx, w: gw } = glNodes(gl);
    for (const [E0, E1] of windows) { const hh = (E1 - E0) / 2, mm = (E0 + E1) / 2; for (let k = 0; k < gl; k++) { const E = mm + hh * gx[k]; fn(E, gw[k] * hh * (1 - e * Math.cos(E)) / (2 * Math.PI)); } } }
  else { const dE = 2 * Math.PI / nodes; for (let k = 0; k < nodes; k++) { const E = (k + 0.5) * dE - Math.PI; fn(E, dE * (1 - e * Math.cos(E)) / (2 * Math.PI)); } }
  void a;
}
/**
 * ベクトルの一次の率: dh(p × F の平均 —— 比の角運動量の変化)・de((F × h + w × (p × F))/μ)と、面内の力(R・S)と面に垂直な力(W)の分け。
 * 戻り値(rad/s・1/s): dh・de・Ldot(dL̂/dt)・apsW・eOut・dedt・apsW_fromW・LdotFromRS・dlnA・per[pole](secularRates —— 同じ窓)
 */
export function vectorRates(orb, eff, { windows = null, gl = DECL.glWin, nodes = DECL.nodes, poles = null } = {}) {
  const acc = accelOf(orb, eff), mu = orb.mu, W = orb.W, P = orb.P, h0 = Math.sqrt(mu * orb.a * (1 - orb.e * orb.e)), hv = scl(W, h0);
  let dh = [0, 0, 0], de = [0, 0, 0], dhW = [0, 0, 0], deW = [0, 0, 0], dEn = 0;
  eachPoint(orb, windows, gl, nodes, (E, tw) => {
    const st = stateAt(orb, E - orb.e * Math.sin(E)), F = acc(st);
    if (!F.every(isFin)) throw new RangeError('vectorRates: 非有限の力');
    const FW = scl(W, dot(F, W)), g = (Fv) => add(crs(Fv, hv), crs(st.v, crs(st.x, Fv)));
    dh = add(dh, scl(crs(st.x, F), tw)); de = add(de, scl(g(F), tw / mu)); dhW = add(dhW, scl(crs(st.x, FW), tw)); deW = add(deW, scl(g(FW), tw / mu)); dEn += tw * dot(st.v, F);
  });
  const Lperp = (d) => scl(sub(d, scl(W, dot(W, d))), 1 / h0), e = orb.e, Qd = crs(W, P);
  const out = { dh, de, Ldot: Lperp(dh), LdotFromW: Lperp(dhW), apsW: e > 0 ? dot(Qd, de) / e : null, apsW_fromW: e > 0 ? dot(Qd, deW) / e : null, eOut: e > 0 ? dot(W, de) / e : null,
    dedt: dot(P, de), dlnA: 2 * orb.a * dEn / mu };
  out.LdotMag = nrm(out.Ldot);
  if (poles) {
    const R = secularRates(orb, acc, { poles, windows, gl, nodes });
    out.per = R.per; out.apsIn = R.apsIn; out.period = R.period; out.dlnA333c = R.dadtOverA;
  }
  return out;
}
/** L̂ の変化の ŝ に対する分け: 歳差の成分(ŝ × L̂ の向き —— sin i dΩ_node)と ŝ へ倒れる成分(−di/dt) */
export function splitAbout(Ldot, W, s) {
  const k = unit(s), ax = crs(k, W), sn = nrm(ax);
  if (!(sn > 1e-14)) return { prec: null, toward: null };
  const pv = scl(ax, 1 / sn), tv = unit(sub(k, scl(W, dot(k, W))));
  return { prec: dot(Ldot, pv), toward: dot(Ldot, tv) };
}
/** 基準面の (di, dΩ) から dL̂/dt を作り直す(dL̂ = dΩ (k × Ŵ) + di (N̂ × Ŵ) —— 面を変えても同じベクトルの照合) */
export function ldotFromAngles(orb, pole, per) {
  const g = anglesOn(orb, pole); if (g.degenerate || !per || per.degenerate) return null;
  return add(scl(crs(unit(pole), orb.W), per.dnode), scl(crs(g.N, orb.W), per.di));
}
/** 速度の型の窓の境界の項(引きずりを除いた速度の読み v = w − d との差 —— 窓の値 B = 窓の値 A − 境界の項): [p × d]/P と [(d × h + w × (p × d))/μ]/P */
export function boundaryTerm(orb, eff, E0, E1) {
  if (eff.kind !== 'vel') return { dh: [0, 0, 0], de: [0, 0, 0], Ldot: [0, 0, 0], apsW: 0 };
  const mu = orb.mu, Pd = 2 * Math.PI / Math.sqrt(mu / orb.a ** 3), h0 = Math.sqrt(mu * orb.a * (1 - orb.e * orb.e)), hv = scl(orb.W, h0);
  const at = (E) => { const st = stateAt(orb, E - orb.e * Math.sin(E)), d = eff.d(st.x, st.v); return { dh: crs(st.x, d), de: scl(add(crs(d, hv), crs(st.v, crs(st.x, d))), 1 / mu) }; };
  const A = at(E0), B = at(E1), dh = scl(sub(B.dh, A.dh), 1 / Pd), de = scl(sub(B.de, A.de), 1 / Pd);
  const Ld = scl(sub(dh, scl(orb.W, dot(orb.W, dh))), 1 / h0);
  return { dh, de, Ldot: Ld, apsW: orb.e > 0 ? dot(crs(orb.W, orb.P), de) / orb.e : null };
}

/* ───────── 窓の組 ───────── */
/** 交点の窓(真近点角 ±δ —— 昇交点・降交点・離れた部分 2 つ)の離心近点角の区間。pole の交点(太陽の赤道面か黄道) */
export function nodeWindows(orb, pole, halfDeg) {
  const cr = crossingAnomalies(orb, pole), d = halfDeg * D2R, fa = cr.asc, E = (f) => eOfF(f, orb.e);
  return { asc: [[E(fa - d), E(fa + d)]], desc: [[E(fa + Math.PI - d), E(fa + Math.PI + d)]], away: [[E(fa + d), E(fa + Math.PI - d)], [E(fa + Math.PI + d), E(fa + 2 * Math.PI - d)]],
    fAsc: fa, fDesc: wrapPi(fa + Math.PI), rAsc: orb.a * (1 - orb.e ** 2) / (1 + orb.e * Math.cos(fa)), rDesc: orb.a * (1 - orb.e ** 2) / (1 - orb.e * Math.cos(fa)) };
}
/** 高さの帯 |p·ŝ| ≤ h の区間(交点から前後へ刻みを倍にして帯の端を挟み、二分法 —— 昇交点の近くと降交点の近く)と帯の外。帯の外の中点で |z| > h を確かめる */
export function heightWindows(orb, pole, h) {
  const s = unit(pole), cr = crossingAnomalies(orb, s), g = (E) => Math.abs(dot(stateAt(orb, E - orb.e * Math.sin(E)).x, s)) - h;
  const edge = (Ec, sgn) => { const dz = Math.abs(dot(stateAt(orb, Ec + 1e-6 - orb.e * Math.sin(Ec + 1e-6)).x, s) - dot(stateAt(orb, Ec - 1e-6 - orb.e * Math.sin(Ec - 1e-6)).x, s)) / 2e-6;
    let lo = Ec, step = 0.5 * h / Math.max(dz, 1e-300), hi = Ec + sgn * step;
    while (g(hi) < 0) { lo = hi; step *= 2; hi = Ec + sgn * step; if (step > Math.PI / 2) throw new RangeError('heightWindows: 帯の端が交点から π/2 の内に無い(h が軌道の最大の高さを超える)'); }
    for (let it = 0; it < 200; it++) { const mid = (lo + hi) / 2; if (g(mid) < 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2; };
  const Ea = eOfF(cr.asc, orb.e), Ed0 = eOfF(cr.desc, orb.e), Ed = Ed0 < Ea ? Ed0 + 2 * Math.PI : Ed0;
  const a0 = edge(Ea, -1), a1 = edge(Ea, 1), d0 = edge(Ed, -1), d1 = edge(Ed, 1);
  const away = [[a1, d0], [d1, a0 + 2 * Math.PI]];
  if (!away.every(([u, v]) => v > u && g((u + v) / 2) > 0)) throw new RangeError('heightWindows: 帯が分かれる(帯の外の中点が帯の中)');
  return { asc: [[a0, a1]], desc: [[d0, d1]], away, h };
}

/* ───────── 交点の非対称の仮説の軌道(太陽の赤道面の要素から —— ŝ を z 軸に)───────── */
export function hypoOrbit({ a, mu, e, iDeg, nodeDeg, omegaDeg }) {
  const fr = frameOfElements({ I: iDeg, Om: nodeDeg, varpi: nodeDeg + omegaDeg });
  return { a, e, mu, P: fr.P, Q: fr.Q, W: fr.W };
}

/* ───────── 純粋な積分器(ベクトルの面内の回転 —— 二次の結合の大きさ)───────── */
/**
 * x′ = v + d・v′ = −x/r³(μ = a = 1)。公転ごとに接触の要素の枠(P = ê・W = ĥ)を標本し、前の枠に対する回転(面内 = W のまわり・面外 = P・Q のまわり)を足し合わせ、
 * 無摂動の同じ刻みの走行を引いて最小二乗の傾き(rad/公転)。戻り値 { apsW, tilt(面外の回転の大きさ) }
 */
export function integrateFrame({ orb0, velX, stepsPerOrbit, nOrb }) {
  const run = (on) => {
    const st0 = stateAt(orb0, 0), f = (s) => { const x = [s[0], s[1], s[2]], v = [s[3], s[4], s[5]], r = nrm(x), r3 = r * r * r, u = on ? add(v, velX(x, v)) : v; return [...u, ...scl(x, -1 / r3)]; };
    const rk = (s, h) => { const k1 = f(s), s2 = s.map((q, i) => q + 0.5 * h * k1[i]), k2 = f(s2), s3 = s.map((q, i) => q + 0.5 * h * k2[i]), k3 = f(s3), s4 = s.map((q, i) => q + h * k3[i]), k4 = f(s4);
      return s.map((q, i) => q + h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6); };
    let s = [...st0.x, ...st0.v]; if (on) s = [...st0.x, ...sub(st0.v, velX(st0.x, st0.v))];
    const frame = (s1) => { const x = [s1[0], s1[1], s1[2]], v = [s1[3], s1[4], s1[5]], w = on ? add(v, velX(x, v)) : v, o = orbitOfState(x, w, 1); return { P: o.P, Q: o.Q, W: o.W }; };
    const h = 2 * Math.PI / stepsPerOrbit, cum = [0]; let Fp = frame(s), tilt = 0;
    for (let k = 1; k <= nOrb * stepsPerOrbit; k++) { s = rk(s, h); if (k % stepsPerOrbit === 0) { const F = frame(s);
      cum.push(cum[cum.length - 1] + Math.atan2(dot(Fp.Q, F.P) - dot(Fp.P, F.Q), dot(Fp.P, F.P) + dot(Fp.Q, F.Q)));
      tilt += Math.hypot(dot(Fp.W, F.Q) - dot(Fp.Q, F.W), dot(Fp.P, F.W) - dot(Fp.W, F.P)) / 2; Fp = F; } }
    return { cum, tilt: tilt / nOrb };
  };
  const on = run(true), off = run(false), y = on.cum.map((q, j) => q - off.cum[j]), N = y.length, mx = (N - 1) / 2, my = y.reduce((s1, q) => s1 + q, 0) / N;
  let sxy = 0, sxx = 0; for (let j = 0; j < N; j++) { sxy += (j - mx) * (y[j] - my); sxx += (j - mx) * (j - mx); }
  return { apsW: sxy / sxx, tilt: on.tilt - off.tilt };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {};
  const el = { I: 0.4 / D2R, Om: 30, varpi: 100 }, fr = frameOfElements(el), orb = { a: 1, e: 0.2, mu: 1, P: fr.P, Q: fr.Q, W: fr.W }, p = 1 - 0.04, Pd = 2 * Math.PI, pole = [0, 0, 1];
  const sysU = { M: 1, m: 1e-30, R: 1, sunAxis: pole, sSun: 1, Rsun: 1, orb };
  // ① 窓の和 = 全周(回転の分の型 —— 交点の窓 ±15° と帯 h = 0.05)
  { const eff = { kind: 'vel', d: (x) => scl(crs(pole, x), 1e-6 / nrm(x)) }, full = vectorRates(orb, eff, { poles: { p: pole } }), nw = nodeWindows(orb, pole, 15), hw = heightWindows(orb, pole, 0.05);
    const sumOf = (ws) => { const parts = ['asc', 'desc', 'away'].map((k) => vectorRates(orb, eff, { windows: ws[k], poles: { p: pole } })); return { Ldot: parts.reduce((s1, q) => add(s1, q.Ldot), [0, 0, 0]), apsW: parts.reduce((s1, q) => s1 + q.apsW, 0), dnode: parts.reduce((s1, q) => s1 + q.per.p.dnode, 0) }; };
    const A = sumOf(nw), B = sumOf(hw), sc = full.LdotMag;
    S.sum = { node: nrm(sub(A.Ldot, full.Ldot)) / sc, height: nrm(sub(B.Ldot, full.Ldot)) / sc, nodeRate: Math.abs(A.dnode - full.per.p.dnode) / Math.abs(full.per.p.dnode), apsW: Math.abs(A.apsW - full.apsW) / sc }; }
  // ② 面を変えても L̂ のベクトルの変化は同じ(J₂ の型・2 つの基準面で作り直す)と ω_W = 第333便c の軌道面の中の近点
  { const eff = effectOf({ ...sysU, sunAxis: [0.1, 0.2, 1] }, { kind: 'j2', J2: 1e-6 }), R = vectorRates(orb, eff, { poles: { ecl: pole, sun: [0.1, 0.2, 1] } });
    const La = ldotFromAngles(orb, pole, R.per.ecl), Lb = ldotFromAngles(orb, [0.1, 0.2, 1], R.per.sun);
    S.frames = { ecl: nrm(sub(La, R.Ldot)) / R.LdotMag, sun: nrm(sub(Lb, R.Ldot)) / R.LdotMag, aps: Math.abs(R.apsW - R.apsIn) / Math.abs(R.apsIn) }; }
  // ③ 面に垂直な力は面内の回転 ω_W を動かさない(点ごとに 0 —— 任意の F_W)
  { const eff = { kind: 'acc', a: (st) => scl(orb.W, 1e-6 * (1 + st.x[0] + 0.3 * st.x[1] * st.x[1])) }, R = vectorRates(orb, eff, {});
    S.fw = { apsW: Math.abs(R.apsW) / R.LdotMag, fromW: Math.abs(R.apsW_fromW) / R.LdotMag }; }
  // ④ 統合した並進の並進の分(α = 1・ballHarmonic・R = Y_k m)= K1 の並進の係数(H₁ = C₁)・point は 1/C₁ 倍
  { const sysM = { M: 1.98847e30, m: 3.3011e23, R: 2.4397e6, sunAxis: pole, sSun: 2.9e-6, Rsun: 6.957e8, orb: { a: 5.79e10, e: 0.2056, mu: DECL.G * (1.98847e30 + 3.3011e23), P: fr.P, Q: fr.Q, W: fr.W } };
    const k1 = vectorRates(sysM.orb, effectOf(sysM, { kind: 'k1' }), {}), bh = vectorRates(sysM.orb, effectOf(sysM, { kind: 'trans', alpha: 1, shape: 'ballHarmonic', radius: 'kappaM', part: 'trans' }), {});
    const pt = vectorRates(sysM.orb, effectOf(sysM, { kind: 'trans', alpha: 1, shape: 'point', radius: 'kappaM', part: 'trans' }), {});
    S.k1 = { bh: bh.apsW / k1.apsW, pt: pt.apsW / k1.apsW, C1 }; }
  // ⑤ 揃えた自己の形: 一般の p の自己の場が p = 1 の閉じた式・p = 1・2 の第330便b の harmonicSelf と同じ・p = 3 は定義できない
  S.self = { k1: Math.max(...[0, 0.3, 0.7, 1].map((t) => Math.abs(ballField(1, t) - Kball(1, t, 1)) / Kball(1, t, 1))), h1: Math.abs(harmonicSelfGeneral(1) / harmonicSelf(1) - 1), h2: Math.abs(harmonicSelfGeneral(2) / harmonicSelf(2) - 1),
    h15: harmonicSelfGeneral(1.5), h3: harmonicSelfGeneral(3), h1v: harmonicSelf(1), h2v: harmonicSelf(2) };
  // ⑥ 文献の式の照合: J₂ と Lense–Thirring(太陽の赤道面の要素 —— 交点と近点引数)
  { const iq = 0.4, k = pole, sys = { ...sysU, sunAxis: k }, R2 = vectorRates(orb, effectOf(sys, { kind: 'j2', J2: 1e-6 }), { poles: { s: k } }), ci = Math.cos(iq);
    const eps = 1e-8, sysL = { ...sys, Rsun: 1 }, Jv = 1e-6, cc = 1 / Math.sqrt(eps);
    const ltA = (st) => { const x = st.x, r = st.r, xh = scl(x, 1 / r), k0 = 2 / (cc * cc * r * r * r); return scl(add(scl(crs(xh, st.v), 3 * dot(scl(k, Jv), xh)), crs(st.v, scl(k, Jv))), k0); };
    const RL = vectorRates(orb, { kind: 'acc', a: ltA }, { poles: { s: k } }), base = 2 * Jv / (cc * cc * Math.pow(1 - 0.04, 1.5));
    S.lit = { j2node: R2.per.s.dnode / (-1.5 * 1e-6 / (p * p) * ci), j2omega: R2.per.s.domega / (0.75 * 1e-6 / (p * p) * (5 * ci * ci - 1)), ltNode: RL.per.s.dnode / base, ltOmega: RL.per.s.domega / (-3 * base * ci) };
    void sysL; }
  // ⑦ 回転の分の面内の回転は ω に依らない(単位の軌道 —— α = 2 と 3〔α = 1 は面内の分が逆二乗の動径の力で一次の ω_W が 0〕)
  { const ws = [0, 60, 150, 250].map((om) => { const o = hypoOrbit({ a: 1, mu: 1, e: 0.3, iDeg: 5, nodeDeg: 40, omegaDeg: om });
      return [2, 3].map((al) => vectorRates(o, { kind: 'vel', d: (x) => scl(crs(pole, x), 1e-6 / Math.pow(nrm(x), al)) }, {}).apsW); });
    const sp = (j) => { const v = ws.map((q) => q[j]), m = v.reduce((s1, q) => s1 + q, 0) / v.length; return Math.max(...v.map((q) => Math.abs(q - m))) / Math.abs(m); };
    S.omegaFree = { a2: sp(0), a3: sp(1) }; }
  // ⑧ 帯の区間: h = R_d の小さな帯で第333便c の bandWindows と同じ区間
  { const o = hypoOrbit({ a: 5.79e10, mu: 1.327e20, e: 0.2056, iDeg: 3.381, nodeDeg: 10, omegaDeg: 109.58 }), Rd = kappaMRadius(1.98847e30), A = heightWindows(o, pole, Rd), B = bandWindows(o, pole, Rd);
    S.band = { asc: Math.max(Math.abs(wrapPi(A.asc[0][0] - B[0][0])), Math.abs(wrapPi(A.asc[0][1] - B[0][1]))), desc: Math.max(Math.abs(wrapPi(A.desc[0][0] - B[1][0])), Math.abs(wrapPi(A.desc[0][1] - B[1][1]))), width: B[0][1] - B[0][0] }; }
  // ⑨ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => selfAligned({ shape: 'ballMean', alpha: 1, m: 1, R: 1 })), rejects(() => selfAligned({ shape: 'point', alpha: 4, m: 1, R: 1 })), rejects(() => ballField(3, 0.5)),
    rejects(() => heightWindows(orb, pole, 10)), rejects(() => effectOf(sysU, { kind: 'x' }))];
  S.nullBH3 = selfAligned({ shape: 'ballHarmonic', alpha: 3, m: 1, R: 1 }) === null;
  void Pd;
  return S;
}
export function pureGates(S) {
  return {
    sum: S.sum.node <= 1e-10 && S.sum.height <= 1e-10 && S.sum.nodeRate <= 1e-10 && S.sum.apsW <= 1e-10,
    frames: S.frames.ecl <= 1e-10 && S.frames.sun <= 1e-10 && S.frames.aps <= 1e-10,
    fw: S.fw.apsW <= 1e-12 && S.fw.fromW <= 1e-12,
    k1: Math.abs(S.k1.bh - 1) <= 1e-5 && Math.abs(S.k1.pt * S.k1.C1 - 1) <= 1e-5,
    self: S.self.k1 <= 1e-10 && S.self.h1 <= 1e-8 && S.self.h2 <= 1e-4 && S.self.h15 > S.self.h2v && S.self.h15 < S.self.h1v && S.self.h3 === null,
    lit: [S.lit.j2node, S.lit.j2omega, S.lit.ltNode, S.lit.ltOmega].every((x) => Math.abs(x - 1) <= 1e-6),
    omegaFree: S.omegaFree.a2 <= 1e-9 && S.omegaFree.a3 <= 1e-9,
    band: S.band.asc <= 1e-9 * Math.max(1, S.band.width) + 1e-12 && S.band.desc <= 1e-9 * Math.max(1, S.band.width) + 1e-12,
    rejects: S.rejects.every(Boolean) && S.nullBH3 === true,
  };
}
export { C1, gLocShare, q1PNPerOrbit, dragSpin, weightOf, integrate3d, CENTURY_S, GEOM333C, kappaMRadius, splitAbout as splitL };

// 第321便c(原仮定者の予定(第123報)「geoPN=4の予定: 処理を一新する。銀河の軸引きずりの知見から、銀河の回転引きずりを推定して、銀河のサンプルを作成する」・
// 原仮定者の回答(2026-10-31 —— AN489)・決断事項 AN486・AN487・AN488・AN496・統括の検証項目 R268):
// **銀河の中の任意の 3D 位置の源の流れの場の純関数**(html を読まない・状態を持たない —— 器 tests/exp-w321c-galfield.mjs と QA が使う)。
//
// ■ 何をするか(エンジン・在位の本・受け手の R_d = Y_k m・規則は変えない —— 第319便b の宣言の模型〔円盤 4 + 静止のバルジ・平均の流れ V(R) = V0 tanh(R/R_t)〕の写しの外の計算)
//   源の流れ(銀河中心系 —— 受け手の動きの項 −½∇β × V_ref は数えない: AN489)の弱い場の一次 u(x) = (10G_0/c_0²) ∫ ρ v/|x − x′| dV′ を、銀河中心系の任意の位置
//   x = (R cos φ, R sin φ, z) で返す。源の流れは方位の向きの軸対称なので u = u_φ(R, z) φ̂(u_R = u_z = 0 —— 対称性)。
//   ・u_φ は方位の積分を閉じた式にした環の核 Q(第320便c の ringQ)と動径・鉛直の適応の Gauss–Kronrod(第320便c の integrate)。
//   ・半渦度 ω½ = ½∇ × u の 2 成分は部分積分の形(主の経路 —— 差分の幅を持たない):
//       ω½_z = ½(1/R)∂_R(R u_φ) = ½(10G_0/c_0²) ∫ ζ_z/|x − x′| dV′(ζ_z = (1/a)∂_a(a Σ v) h(z′) —— 動径の部分積分・打ち切りの縁 a = R_max と内側の縁の面の項を含む)
//       ω½_R = −½∂_z u_φ = −½(10G_0/c_0²) ∫ Σ v h′(z′) cos(φ − φ′)/|x − x′| dV′(鉛直の部分積分 —— 境界の項は e^(−40) の内)
//     勾配 ∇u[9](∂u_a/∂x_b —— 行が成分・列が微分の向き)は u_φ と 2 成分から組む(∂_R u_φ = 2ω½_z − u_φ/R・∂_z u_φ = −2ω½_R・発散は恒等 0)。
//   ・照合の別経路(o.check): u_φ の 4 次の中心差分(∂_R・∂_z)—— 2 経路の差を誤差の見積りに。
//   ・中心と残余の重ならない分割(AN486): 成分の持ち主の宣言(sourceState.terms —— 第320便c の combineDisjoint で重なり・代理 + 成分を拒否)ごとに同じ演算で場を作り、
//     和を返す(演算 B —— 中心も残余も同じ「源の流れの場とその半渦度」で数える: 座標〔銀河中心系〕・速度の基準〔源の流れの銀河中心系〕・対応係数〔λ_c・κ_v は宣言・既定 1〕を
//     1 つの契約に —— AN487)。R_cut を動かしても和は全場(面の項は内側と残余で打ち消す)。
//   ・正規化の情報(o.normalization): β = (10G_0/c_0²) ∫ ρ/|x − x′| dV′(バルジを含む)と ∇β(4 次の中心差分)・宣言の型 Z = 1 + β で u = A/Z とするときの
//     ½∇ × (A/Z) = (½∇ × A)/Z − (∇Z × A)/(2Z²) の第 2 項の大きさ(AN487 の G4 の材料)。
//   ・点のセルの和(AN488 —— 格子の感度): 第319便b の格子の型(円盤: 動径 Gauss–Legendre × 方位 × 鉛直の分位点)を任意の位置へ・軟化の幅 ε。
//   ・境界つきの u_φ の復元(対照だけ): u_φ(R) = [2∫_{R_in}^R s ω½_z(s) ds + R_in u_φ(R_in)]/R(軸対称・純方位の宣言の下 —— 原点を含む正則な場は R_in = 0・u_φ(0) = 0)。
//
// ■ 言わないこと: 半渦度を今の軸引きずり ω_G と同じ量と書かない(移送場の診断量)・半渦度だけから u は一意に決まらない(勾配を足しても curl は同じ・環状の領域は循環 C/R の自由度)・
//   u_φ = Rω は剛体回転だけ(一般の差動回転に使わない)・中心 1 体の値を「銀河の引きずり」と呼ばない・M_G を実在の中心単体と書かない・格子の差は「格子の感度」・
//   観測の流れを入力して同じ回転曲線を得ることを予言と呼ばない(本 lib の流れは宣言の入力)・文献の値は「本便は一次資料に当たっていない」。
import { COEF, KDIP, integrate, ringP, ringQ, sigOf, hOf, vOf, gOf, rhoBulge, ALL_COMPS, combineDisjoint, diskJ } from './lib-w320c-nbcompose.mjs';
import { MW, FLOW, KPC, MSUN, AU, gl01, zQuant, nrm, dot, cross, add3, scl3, relDiff } from './lib-w319b-srcradius.mjs';
export { COEF, KDIP, MW, FLOW, KPC, MSUN, AU, nrm, dot, cross, add3, scl3, relDiff, ALL_COMPS };
export const LIB_VERSION = 'w321c-galfield-lib-1';
/** 場の API の契約の版(sample の戻り値の形・単位・座標・演算の宣言 —— 形を変えたら上げる) */
export const FIELD_VERSION = 'w321c-galfield-1';
/** 宣言の模型の名(第319便b の MW・FLOW の写し —— 値は lib-w319b-srcradius.mjs の凍結の定数) */
export const MODEL_ID = 'mw319b-tanh';

/* ───────── 宣言(走行の前に置く —— 結果を見て変えない)───────── */
export const DECL = Object.freeze({
  /** 鉛直の打ち切り(z_d の倍数 —— e^(−40) の内) */
  zTop: 40,
  /** 求積の許容(相対 —— 表) */
  quadRel: 1e-10,
  /** 照合の別経路の中心差分の幅 [kpc](動径・鉛直 —— 鉛直は |z| の 1/4 と fdZmaxKpc を上限に: 面の対称の点を跨がない・最も薄い H2 の層 z_d = 0.045 kpc を刻む) */
  fdKpc: 0.02, fdZmaxKpc: 0.01,
  /** 有効域(銀河中心系の円筒座標 —— 軸の近くは φ̂ が定まらない・R_max の外は宣言の模型の打ち切りの外) */
  domain: Object.freeze({ RminKpc: 1e-3, RmaxKpc: 40, zAbsMaxKpc: 5 }),
});
const TERM_KEYS = Object.freeze({ 'disk:thin': 'thin', 'disk:thick': 'thick', 'disk:HI': 'HI', 'disk:H2': 'H2' });
const diskOf = (comp) => MW.disks.find((d) => d.key === TERM_KEYS[comp]);

/* ───────── 鉛直の形の微分(h′ —— exp: −sgn(z) h/z_d・sech2: −tanh(z/(2z_d)) h/z_d)───────── */
export const dhOf = (D, z) => (D.vert === 'exp' ? -Math.sign(z) * hOf(D, z) / D.zd : -Math.tanh(z / (2 * D.zd)) * hOf(D, z) / D.zd);

/* ───────── 環の積分の二重の積分(動径 a × 鉛直 z′ —— 場の点 (R, z))───────── */
function zBreaks(D, z, lo, hi) {
  const zd = D.zd, b = [-5 * zd, -zd, -0.1 * zd, -0.01 * zd, 0, 0.01 * zd, 0.1 * zd, zd, 5 * zd];
  if (z !== 0) b.push(z - zd, z - 0.1 * zd, z - 0.01 * zd, z, z + 0.01 * zd, z + 0.1 * zd, z + zd);
  return b.filter((x) => x > lo && x < hi);
}
/**
 * ∫ wz(z′) [∫_{aLo}^{aHi} wa(a) kern(a, R, (z − z′)² + ε²) da] dz′(z′ ∈ [−zTop z_d, zTop z_d] —— z = 0 で wz が偶なら半分 × 2)。
 * 戻り値 { v, err }(err は外の積分の誤差の見積り —— 内の積分の許容は外の 1/10)
 */
function dbl(D, R, z, aLo, aHi, wa, kern, wz, eps2, rel, even) {
  const zmax = DECL.zTop * D.zd, sym = z === 0 && even;
  const inner = (zp) => {
    const dz = z - zp, s2 = dz * dz + eps2, w = Math.max(Math.abs(dz), 1e-6);
    return wz(zp) * integrate((a) => wa(a) * kern(a, R, s2), aLo, aHi, { brk: [R - 10 * w, R - w, R, R + w, R + 10 * w], rel: rel * 0.1 }).v;
  };
  if (sym) { const r = integrate(inner, 0, zmax, { brk: zBreaks(D, 0, 0, zmax), rel }); return { v: 2 * r.v, err: 2 * r.err, ok: r.ok }; }
  return integrate(inner, -zmax, zmax, { brk: zBreaks(D, z, -zmax, zmax), rel });
}
const clipA = (lo, hi) => [Math.max(0, lo), Math.min(MW.RmaxKpc, hi)];

/** 円盤 D の a ∈ [aLo, aHi) の u_φ(R, z)[m/s](環の核 Q) */
export function diskUphiAt(D, aLo, aHi, R, z, o = {}) {
  const [lo, hi] = clipA(aLo, aHi); if (!(hi > lo)) return { v: 0, err: 0 };
  const r = dbl(D, R, z, lo, hi, (a) => a * sigOf(D, a) * vOf(a), ringQ, (zp) => hOf(D, zp), (o.epsKpc || 0) ** 2, o.rel || DECL.quadRel, true);
  const k = COEF * MSUN / KPC; return { v: k * r.v, err: k * r.err };
}
/** 円盤 D の a ∈ [aLo, aHi) の ω½_z(R, z)[1/s](動径の部分積分 —— 質量流の渦度 ζ_z の環の積分 + 縁の面の項) */
export function diskHalfCurlZAt(D, aLo, aHi, R, z, o = {}) {
  const [lo, hi] = clipA(aLo, aHi); if (!(hi > lo)) return { v: 0, err: 0, sheetHi: 0, body: 0 };
  const eps2 = (o.epsKpc || 0) ** 2, rel = o.rel || DECL.quadRel, zmax = DECL.zTop * D.zd;
  const body = dbl(D, R, z, lo, hi, (a) => gOf(D, a), ringP, (zp) => hOf(D, zp), eps2, rel, true);
  const sheet = (a0) => { const f = (zp) => { const dz = z - zp; return hOf(D, zp) * ringP(a0, R, dz * dz + eps2); };
    return z === 0 ? 2 * integrate(f, 0, zmax, { brk: zBreaks(D, 0, 0, zmax), rel }).v : integrate(f, -zmax, zmax, { brk: zBreaks(D, z, -zmax, zmax), rel }).v; };
  const sLo = lo > 0 ? lo * sigOf(D, lo) * vOf(lo) * sheet(lo) : 0, sHi = hi * sigOf(D, hi) * vOf(hi) * sheet(hi);
  const k = 0.5 * COEF * MSUN / (KPC * KPC);
  return { v: k * (body.v + sLo - sHi), err: k * body.err, sheetHi: k * sHi, sheetLo: k * sLo, body: k * body.v };
}
/** 円盤 D の a ∈ [aLo, aHi) の ω½_R(R, z)[1/s](鉛直の部分積分 —— h′ の環の積分。z = 0 は鏡の対称で 0) */
export function diskHalfCurlRAt(D, aLo, aHi, R, z, o = {}) {
  const [lo, hi] = clipA(aLo, aHi); if (!(hi > lo) || z === 0) return { v: 0, err: 0 };
  const r = dbl(D, R, z, lo, hi, (a) => a * sigOf(D, a) * vOf(a), ringQ, (zp) => dhOf(D, zp), (o.epsKpc || 0) ** 2, o.rel || DECL.quadRel, false);
  const k = -0.5 * COEF * MSUN / (KPC * KPC); return { v: k * r.v, err: Math.abs(k) * r.err };
}
/** 円盤 D の a ∈ [aLo, aHi) の β(R, z)(無次元 —— 質量の密度の環の核 P) */
export function diskBetaAt(D, aLo, aHi, R, z, o = {}) {
  const [lo, hi] = clipA(aLo, aHi); if (!(hi > lo)) return 0;
  return COEF * MSUN / KPC * dbl(D, R, z, lo, hi, (a) => a * sigOf(D, a), ringP, (zp) => hOf(D, zp), (o.epsKpc || 0) ** 2, o.rel || DECL.quadRel, true).v;
}
/** バルジの β(R, z)(静止の宣言 —— 流れの項は 0。r′ = √(R′² + (z′/q)²)・dV = q r′² dr′ dμ dφ) */
export function bulgeBetaAt(R, z, o = {}) {
  const B = MW.bulge, rmax = MW.bulgeRmaxKpc, eps2 = (o.epsKpc || 0) ** 2, rel = o.rel || DECL.quadRel;
  const inner = (rp) => integrate((mu) => { const st = Math.sqrt(Math.max(0, 1 - mu * mu)), dz = z - B.q * rp * mu; return ringP(rp * st, R, dz * dz + eps2); }, -1, 1,
    { brk: [0].concat(rp > 0 && Math.abs(z) < B.q * rp ? [z / (B.q * rp)] : []), rel: rel * 0.1 }).v * rhoBulge(rp) * B.q * rp * rp;
  return COEF * MSUN / KPC * integrate(inner, 0, rmax, { brk: [B.r0, B.rcut, 2 * B.rcut], rel }).v;
}
/** 4 次の中心差分 */
export const d4 = (f, x, h) => (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);

/* ───────── 円筒の成分 → デカルト(銀河中心系)───────── */
/** 円筒の基底 (R̂, φ̂, ẑ) の行列 B(列が基底 —— デカルトの成分) */
export function cylBasis(phi) { const c = Math.cos(phi), s = Math.sin(phi); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; }
/** 軸対称・純方位の場の勾配(円筒の基底 G[a][b] = ê_a·(ê_b·∇)u)をデカルトへ(G_cart = B G Bᵀ) */
export function gradCartOf(phi, uPhi, R, dRu, dZu) {
  const Gc = [[0, -uPhi / R, 0], [dRu, 0, dZu], [0, 0, 0]], B = cylBasis(phi), out = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s += B[i][a] * Gc[a][b] * B[j][b]; out[i][j] = s; }
  return out;
}
/** 勾配の行列から半渦度 ½∇ × u(G[a][c] = ∂u_a/∂x_c) */
export const halfCurlOfG = (G) => [0.5 * (G[2][1] - G[1][2]), 0.5 * (G[0][2] - G[2][0]), 0.5 * (G[1][0] - G[0][1])];
const flat9 = (G) => [G[0][0], G[0][1], G[0][2], G[1][0], G[1][1], G[1][2], G[2][0], G[2][1], G[2][2]];

/* ───────── J 双極子(代理・中心の遠方の近似)───────── */
/** u = K (J × x)/r³ と勾配(K = 5G_0/c_0²・x [m]・J [kg m²/s] のベクトル) */
export function dipoleField(Jv, x) {
  const r2 = dot(x, x), r = Math.sqrt(r2), r3 = r2 * r, r5 = r3 * r2, jx = cross(Jv, x), u = scl3(jx, KDIP / r3), G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const eps = (i, j, k) => ((i === j || j === k || i === k) ? 0 : ((i + 1) % 3 === j ? 1 : -1));
  for (let i = 0; i < 3; i++) for (let c = 0; c < 3; c++) { let s = 0; for (let j = 0; j < 3; j++) s += eps(i, j, c) * Jv[j]; G[i][c] = KDIP * (s / r3 - 3 * jx[i] * x[c] / r5); }
  return { u, G, halfCurl: halfCurlOfG(G) };
}

/* ───────── 源の宣言(sourceState)───────── */
/** 既定の源: 宣言の模型の全成分を 1 つの項(全場) */
export function fullState() { return { model: MODEL_ID, stationary: true, terms: [{ key: 'full', coef: 1, owns: ALL_COMPS.map((c) => ({ comp: c, lo: 0, hi: Infinity })) }] }; }
/** 中心(バルジ + R < R_cut の円盤)と残余(R ≥ R_cut の円盤)の重ならない 2 項(λ_c・κ_v は宣言の係数 —— 既定 1) */
export function splitState(rCutKpc, o = {}) {
  const disks = ALL_COMPS.filter((c) => c !== 'bulge');
  return { model: MODEL_ID, stationary: true, rCutKpc,
    terms: [{ key: 'center', coef: o.lambdaC === undefined ? 1 : o.lambdaC, owns: [{ comp: 'bulge', lo: 0, hi: Infinity }].concat(disks.map((c) => ({ comp: c, lo: 0, hi: rCutKpc }))) },
      { key: 'residual', coef: o.kappaV === undefined ? 1 : o.kappaV, owns: disks.map((c) => ({ comp: c, lo: rCutKpc, hi: Infinity })) }] };
}
/** 源の宣言の検査(重なる区間・代理 + 成分・未知の成分・模型の名 —— RangeError)。戻り値は正準の項の列 */
export function checkState(st) {
  if (!st || typeof st !== 'object' || !Array.isArray(st.terms) || !st.terms.length) throw new RangeError('sourceState.terms が無い');
  if (st.model !== MODEL_ID) throw new RangeError('sourceState.model は ' + MODEL_ID + ' だけ');
  combineDisjoint(st.terms.map((t) => ({ key: t.key, omega: [0, 0, 0], owns: t.owns })));   // 第320便c の重ならない成分の検査(重なり・代理 + 成分・未知の成分を拒否)
  for (const t of st.terms) {
    if (!(t.coef === undefined || Number.isFinite(t.coef))) throw new RangeError('項の係数 coef が有限でない: ' + t.key);
    const px = t.owns.some((o) => o.comp === 'galaxy:proxy');
    if (px && !(t.proxy && Number.isFinite(t.proxy.J))) throw new RangeError('代理の項は proxy.J(ĝ の向きの角運動量 [kg m²/s])を宣言する');
  }
  return st.terms.map((t) => ({ key: t.key, coef: t.coef === undefined ? 1 : t.coef, owns: t.owns.map((o) => ({ comp: o.comp, lo: o.lo === undefined ? 0 : o.lo, hi: o.hi === undefined ? Infinity : o.hi })), proxy: t.proxy || null }));
}

/* ───────── 項の場(円筒の 3 量 + 照合の別経路 + 正規化の量)───────── */
function termCyl(t, R, z, o) {
  let u = 0, wz = 0, wr = 0, eU = 0, eZ = 0, eR = 0, sheetHi = 0, beta = 0;
  for (const ow of t.owns) {
    if (ow.comp === 'bulge') { if (o.normalization) beta += bulgeBetaAt(R, z, o); continue; }   // 静止の宣言 —— u = 0
    const D = diskOf(ow.comp), q = diskUphiAt(D, ow.lo, ow.hi, R, z, o), w = diskHalfCurlZAt(D, ow.lo, ow.hi, R, z, o), r = diskHalfCurlRAt(D, ow.lo, ow.hi, R, z, o);
    u += q.v; wz += w.v; wr += r.v; eU += q.err; eZ += w.err; eR += r.err; sheetHi += (ow.hi >= MW.RmaxKpc ? w.sheetHi : 0);
    if (o.normalization) beta += diskBetaAt(D, ow.lo, ow.hi, R, z, o);
  }
  return { u, wz, wr, eU, eZ, eR, sheetHi, beta };
}
function termUphiOnly(t, R, z, o) { let u = 0; for (const ow of t.owns) if (ow.comp !== 'bulge') u += diskUphiAt(diskOf(ow.comp), ow.lo, ow.hi, R, z, o).v; return u; }
function termBetaOnly(t, R, z, o) { let b = 0; for (const ow of t.owns) b += ow.comp === 'bulge' ? bulgeBetaAt(R, z, o) : diskBetaAt(diskOf(ow.comp), ow.lo, ow.hi, R, z, o); return b; }

/**
 * **場の API の案(契約 FIELD_VERSION)** —— sample(positionKpc, time, sourceState, opts)
 *   positionKpc: 銀河中心系の [x, y, z] [kpc](+z = ĝ —— 円盤の流れの角運動量の向き・+x = 銀河の中心から太陽の向き・+y = ĝ × x̂)
 *   time: 記録だけ(宣言の模型は定常 —— dUdt は定常の宣言から導いた 0。sourceState.stationary が偽なら dUdt は null〔0 で埋めない〕)
 *   sourceState: { model: MODEL_ID, stationary, terms: [{ key, coef, owns: [{ comp, lo, hi }], proxy? }] }(fullState()・splitState(R_cut))
 *   opts: { rel, epsKpc(軟化の幅 —— 既定 0), check(照合の別経路 —— 中心差分), normalization(β・∇β と Z = 1 + β の正規化の項), fdKpc }
 * 戻り値: { ok, version, u[3] m/s, gradU[9] 1/s(行優先 ∂u_a/∂x_b), dUdt[3] | null, halfCurl[3] 1/s, divU, source, contract, validDomain, error, parts[], normalization? }
 */
export function sample(positionKpc, time, sourceState, opts = {}) {
  const o = Object.assign({ rel: DECL.quadRel, epsKpc: 0, fdKpc: DECL.fdKpc }, opts), st = sourceState || fullState();
  const terms = checkState(st), [x, y, z] = positionKpc, R = Math.hypot(x, y), phi = Math.atan2(y, x), dom = DECL.domain;
  const inside = R >= dom.RminKpc && R <= dom.RmaxKpc && Math.abs(z) <= dom.zAbsMaxKpc;
  const base = { version: FIELD_VERSION, libVersion: LIB_VERSION, positionKpc: [x, y, z], cyl: { RKpc: R, phi, zKpc: z }, time: time === undefined ? null : time,
    contract: { frame: 'galactocentric', axes: '+z = ĝ・+x = 銀河の中心 → 太陽・+y = ĝ × x̂', velocityRef: 'source-flow-GC(源の流れの銀河中心系 —— 受け手の動きの項を数えない)', operator: 'B(中心・残余とも源の流れの場とその半渦度 —— 同じ演算の線形の和)',
      coef: terms.map((t) => ({ key: t.key, coef: t.coef })), units: { position: 'kpc', u: 'm/s', gradU: '1/s', halfCurl: '1/s', dUdt: 'm/s²' }, model: MODEL_ID },
    validDomain: { RminKpc: dom.RminKpc, RmaxKpc: dom.RmaxKpc, zAbsMaxKpc: dom.zAbsMaxKpc, inside } };
  if (!inside) return Object.assign(base, { ok: false, reason: '有効域の外(R ∈ [' + dom.RminKpc + ', ' + dom.RmaxKpc + '] kpc・|z| ≤ ' + dom.zAbsMaxKpc + ' kpc)' });
  const parts = [], tot = { u: [0, 0, 0], G: [[0, 0, 0], [0, 0, 0], [0, 0, 0]] };
  let eU = 0, eZ = 0, eR = 0, sheetHi = 0, wzAll = 0, routeZ = 0, routeR = 0, betaAll = 0, uPhiAll = 0, wrAll = 0;
  const xm = [x * KPC, y * KPC, z * KPC];
  for (const t of terms) {
    if (t.proxy) {   // 代理(全体の有効中心質量の J 双極子 —— 他の成分と同時に持たない)
      const d = dipoleField([0, 0, t.proxy.J], xm), G = d.G.map((r) => r.map((v) => v * t.coef)), u = scl3(d.u, t.coef);
      parts.push({ key: t.key, coef: t.coef, kind: 'proxy', u, gradU: flat9(G), halfCurl: halfCurlOfG(G) });
      for (let i = 0; i < 3; i++) { tot.u[i] += u[i]; for (let j = 0; j < 3; j++) tot.G[i][j] += G[i][j]; }
      continue;
    }
    const c = termCyl(t, R, z, o), dRu = 2 * c.wz - c.u / (R * KPC), dZu = -2 * c.wr, Gc = gradCartOf(phi, c.u, R * KPC, dRu, dZu), B = cylBasis(phi);
    const u = [c.u * B[0][1], c.u * B[1][1], 0], k = t.coef, G = Gc.map((r) => r.map((v) => v * k)), uk = scl3(u, k);
    const p = { key: t.key, coef: k, kind: 'model', uPhi: c.u * k, halfCurlCyl: { R: c.wr * k, phi: 0, z: c.wz * k }, u: uk, gradU: flat9(G), halfCurl: halfCurlOfG(G), quadErr: { u: c.eU * Math.abs(k), z: c.eZ * Math.abs(k), R: c.eR * Math.abs(k) } };
    if (o.check) {   // 照合の別経路: u_φ の 4 次の中心差分
      const hR = o.fdKpc, hZ = z === 0 ? o.fdKpc : Math.min(o.fdKpc, Math.abs(z) / 4, DECL.fdZmaxKpc);
      const fR = (r) => termUphiOnly(t, r, z, o) * r, dRuFD = d4(fR, R, hR) / (R * KPC);   // ∂_R(R u_φ)/R
      const dZuFD = z === 0 ? 0 : d4((zz) => termUphiOnly(t, R, zz, o), z, hZ) / KPC;
      p.check = { wzFD: 0.5 * dRuFD * k, wrFD: -0.5 * dZuFD * k, routeZ: Math.abs(0.5 * dRuFD - c.wz) * Math.abs(k), routeR: Math.abs(-0.5 * dZuFD - c.wr) * Math.abs(k), hR, hZ };
      routeZ += p.check.routeZ; routeR += p.check.routeR;
    }
    if (o.normalization) { p.beta = c.beta * k; betaAll += c.beta * k; }
    parts.push(p);
    for (let i = 0; i < 3; i++) { tot.u[i] += uk[i]; for (let j = 0; j < 3; j++) tot.G[i][j] += G[i][j]; }
    eU += p.quadErr.u; eZ += p.quadErr.z; eR += p.quadErr.R; sheetHi += c.sheetHi * k; wzAll += c.wz * k; uPhiAll += c.u * k; wrAll += c.wr * k;
  }
  const hc = halfCurlOfG(tot.G), divU = tot.G[0][0] + tot.G[1][1] + tot.G[2][2];
  const out = Object.assign(base, { ok: true, u: tot.u, gradU: flat9(tot.G), halfCurl: hc, divU, uPhi: uPhiAll, halfCurlCyl: { R: wrAll, phi: 0, z: wzAll },
    dUdt: st.stationary === false ? null : [0, 0, 0], timeDerivativeComplete: st.stationary !== false,
    dUdtNote: st.stationary === false ? '源の時間変化は宣言の模型の外 —— 未導出(0 で埋めない)' : '定常の宣言(∂_t ρ = 0・∂_t v = 0)から導いた 0',
    source: { model: MODEL_ID, terms: terms.map((t) => ({ key: t.key, coef: t.coef, owns: t.owns.map((q) => q.comp + '[' + q.lo + ',' + (q.hi === Infinity ? '∞' : q.hi) + ')') })), rCutKpc: st.rCutKpc === undefined ? null : st.rCutKpc, epsKpc: o.epsKpc },
    error: { quadAbs: { u: eU, halfCurlZ: eZ, halfCurlR: eR }, route: o.check ? { halfCurlZ: routeZ, halfCurlR: routeR } : null,
      edgeShare: wzAll !== 0 ? Math.abs(sheetHi) / Math.abs(wzAll) : 0, vertical: Math.exp(-DECL.zTop),
      note: '求積の誤差の見積り(外の積分)・照合の別経路(4 次の中心差分)との差・打ち切りの縁 R_max の面の項の割合(外縁)・鉛直の打ち切り e^(−40)' },
    parts });
  if (o.normalization) {   // 宣言の型 Z = 1 + β(弱場の一次の分子 A = u を Z で割る場合の半渦度の第 2 項)
    const tB = (xx, zz) => terms.reduce((s, t) => s + (t.proxy ? 0 : t.coef * termBetaOnly(t, xx, zz, o)), 0), h = o.fdKpc;
    const dRb = d4((r) => tB(r, z), R, h) / KPC, dZb = d4((zz) => tB(R, zz), z, z === 0 ? h : Math.min(h, Math.abs(z) / 4)) / KPC, B = cylBasis(phi);
    const gB = [dRb * B[0][0] + 0, dRb * B[1][0], dZb], Z = 1 + betaAll, corr = scl3(cross(gB, tot.u), -0.5 / (Z * Z)), main = scl3(hc, 1 / Z);
    out.normalization = { kind: 'weak-field-numerator', note: 'u は弱場の一次の分子 A(Z で割らない)。宣言の型 Z = 1 + β で u/Z とするなら ½∇×(A/Z) = (½∇×A)/Z − (∇Z×A)/(2Z²)',
      beta: betaAll, gradBeta: gB, Z, uOverZ: scl3(tot.u, 1 / Z), halfCurlOverZ: main, corrTerm: corr, corrShare: nrm(main) > 0 ? nrm(corr) / nrm(main) : null };
  }
  return out;
}
/** 銀河中心系 → J2000 の黄道(第319便b の galFrame の基底 —— 引数で受ける)とその逆 */
export const toFrame = (F, v) => F.toEcl(v);
export const fromEcl = (F, v) => [dot(v, F.xh), dot(v, F.yh), dot(v, F.zh)];

/* ───────── 点のセルの和(任意の位置 —— 格子の感度)───────── */
/**
 * 円盤 D の格子 g の点のセルの和(第319便b の diskAccum と同じ点・位置 xKpc・軟化 ε [kpc])の u[3]・勾配(解析の微分)・半渦度・β。
 * 第320便c の diskCells の太陽の位置(R0, 0, 0)・ε = 0 と同じ点(演算の順は違う —— 相対 1e-12 の内で照合)
 */
export function diskCellsAt(D, g, xKpc, o = {}) {
  const Rmax = MW.RmaxKpc, Q = gl01(g.nr), dph = 2 * Math.PI / g.np, e2 = Math.pow((o.epsKpc || 0) * KPC, 2), X = xKpc[0] * KPC, Y = xKpc[1] * KPC, Zp = xKpc[2] * KPC;
  const u = [0, 0, 0], G = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; let beta = 0, m = 0;
  const zk = new Float64Array(g.nz); for (let k = 0; k < g.nz; k++) zk[k] = zQuant((k + 0.5) / g.nz, D.zd, D.vert) * KPC;
  for (let a = 0; a < g.nr; a++) {
    const Rk = Rmax * Q.x[a], wr = Rmax * Q.w[a], mRing = sigOf(D, Rk) * Rk * wr * dph / g.nz * MSUN, v = vOf(Rk);
    for (let b = 0; b < g.np; b++) {
      const ph = (b + 0.5) * dph, c = Math.cos(ph), sn = Math.sin(ph), xs = Rk * c * KPC, ys = Rk * sn * KPC, vx = -v * sn, vy = v * c, dx = X - xs, dy = Y - ys;
      for (let k = 0; k < g.nz; k++) {
        const dz = Zp - zk[k], d2 = dx * dx + dy * dy + dz * dz + e2, bb = COEF * mRing / Math.sqrt(d2), q = -bb / d2;
        beta += bb; m += mRing; u[0] += bb * vx; u[1] += bb * vy;
        G[0][0] += vx * q * dx; G[0][1] += vx * q * dy; G[0][2] += vx * q * dz; G[1][0] += vy * q * dx; G[1][1] += vy * q * dy; G[1][2] += vy * q * dz;
      }
    }
  }
  return { u, G, halfCurl: halfCurlOfG(G), beta, mKg: m };
}

/* ───────── 境界つきの u_φ の復元(対照だけ —— 軸対称・純方位の宣言)───────── */
/**
 * u_φ(R) = [2∫_{R_in}^R s ω½_z(s) ds + R_in u_φ(R_in)]/R。omegaOf(s [kpc]) → ω½_z [1/s]。区間 [R_in, R] を brk で区切り、各区間を n 点の Gauss–Legendre。
 * 原点を含む(R_in = 0)ときは u_in = 0 だけ(正則な原点 —— 他は RangeError)・R = 0 は R_in = 0 でだけ 0。戻り値 [m/s]
 */
export function uphiFromHalfCurl({ RKpc, RinKpc, uIn, omegaOf, n = 8, brk = [] }) {
  if (![RKpc, RinKpc, uIn].every(Number.isFinite) || RKpc < 0 || RinKpc < 0 || typeof omegaOf !== 'function' || !Number.isSafeInteger(n) || n < 1) throw new RangeError('有限の境界・区間の点の数・ω½_z の関数が要る');
  if (RinKpc === 0 && uIn !== 0) throw new RangeError('原点を含む正則な場の境界は u_φ(0) = 0');
  if (RKpc === 0) { if (RinKpc !== 0) throw new RangeError('環状の境界から原点の正則性は決まらない'); return 0; }
  if (RKpc === RinKpc) return uIn;
  const lo = Math.min(RKpc, RinKpc), hi = Math.max(RKpc, RinKpc), sg = RKpc > RinKpc ? 1 : -1, pts = [lo].concat(brk.filter((b) => b > lo && b < hi).sort((p, q) => p - q), [hi]), Q = gl01(n);
  let s = 0;
  for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1]; for (let k = 0; k < n; k++) { const r = a + (b - a) * Q.x[k], w = omegaOf(r); if (!Number.isFinite(w)) throw new RangeError('ω½_z が有限でない'); s += (b - a) * Q.w[k] * r * w; } }
  // d(R u_φ)/dR = 2R ω½_z(長さは kpc → m を 1 回)
  return (RinKpc * uIn + sg * 2 * s * KPC) / RKpc;
}

/* ───────── 6 天体の拮抗(読み (b) —— 源ごとの熱と合成の熱の符号つきの差)───────── */
/**
 * 受け手の I・符号つきの自転 s0・軸 â と源の ω の列(SI)から、エンジンの純関数 cell(inertialDrag3MaintCell —— 口で受ける)で源ごとの (b) の熱 E_axis + abs(E_speed) と
 * 合成(ω の和)の熱を作る。戻り値 { perSource[], source, composite, diff(符号つき —— 非負へ切らない), espSigned, eaxSum }
 */
export function antagOf(cell, I, s0, a, omegas) {
  const C = new Float64Array(9), hb = (w) => { const wp = dot(w, a); cell(I, s0, a[0], a[1], a[2], wp, w[0] - wp * a[0], w[1] - wp * a[1], w[2] - wp * a[2], C, 0); return { ax: C[0], sp: C[1], hb: C[0] + Math.abs(C[1]), h319: C[2] }; };
  const per = omegas.map((w) => (nrm(w) === 0 ? { ax: 0, sp: 0, hb: 0, h319: 0 } : hb(w)));
  const sum = omegas.reduce((s, w) => add3(s, w), [0, 0, 0]), comp = nrm(sum) === 0 ? { ax: 0, sp: 0, hb: 0, h319: 0 } : hb(sum), src = per.reduce((s, q) => s + q.hb, 0);
  return { perSource: per, source: src, composite: comp.hb, diff: src - comp.hb, compositeSp: comp.sp, compositeAx: comp.ax, sumOmega: sum };
}

/* ───────── 表の書式(文書の lib が使う)───────── */
export const sgnOf = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
export const jOfDisks = (aLo, aHi) => MW.disks.reduce((s, D) => s + diskJ(D, Math.max(0, aLo), Math.min(MW.RmaxKpc, aHi)).J, 0);

// 第352便f(原仮定者の回答(2026-11-24 —— 第148報)AN1015・原仮定者の整理(2026-11-24 —— 第148報)「銀河由来の軸引きずりについて」・統括の検証項目 R443):
//   **銀河の円盤の中の回転の差分 —— 軸対称の円運動の速度の場 v_φ(R) = v₀ (R ÷ R₀)^p の「速さの差分」と「向きの変化の分」(表 1)・在位の形の場に輪の上の点の源を並べた小さな対照の模型で
//   R₀ に置いた受け手の回転を読みごとに数える(表 2)・一様な背景との比(表 3)・上下の運動と傾きの式の整理(表 4 —— 重心のまわりのトルクの零試験だけ)の純関数 —— 診断だけ**
//   (器 tests/exp-w352f-galdisk.mjs と QA behavior.galdisk352f・docs.galdisk352f が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   **銀河の回転から背景軸引きずりを作らない**(原文の段階の指示 —— 模型は予想の文を数えられる形に直すための対照だけ。背景の大きさを本 lib の数で置かない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712)。
//   既存の lib は呼ぶだけ(本文と版は変えない): 第348便h(makeField3・rot3・YK・CAP_M・galMass)・第350便b(c2Quad・c2Ball)・第350便e(commonChecks・COMMON_WANT)・
//   第348便c(galDistM・massOf)・第312便a(Kball)・第347便h(gaussLegendre)・第337便c(GALAXY)。
//
// ■ 表 1(物質の速度の場の運動学 —— DFM の場ではない): 点 R₀ で 速さの差分 dv/dR = p v₀/R₀・向きの変化の分 v/R = v₀/R₀ = Ω₀・
//   局所の回転(渦度の半分)= ½ (dv/dR + v/R) = ½ (1 + p) Ω₀・ずれ(Oort の A の形)= ½ (v/R − dv/dR) = ½ (1 − p) Ω₀。平坦(p 0)では速さの差分 0・向きの変化の分 Ω₀ が残る。
// ■ 表 2(DFM の場に写す小さな対照の模型): 円盤 = 輪 n_R 本 × 点 N_φ(質量は面密度 Σ(R) から —— 合計 1・速さ v_φ(R_i)・自転 0・半径 = 輪の間隔 × soft)。受け手は (R₀, 0, 0)・速度 v₀ ŷ。
//   読み: (M 型) 受け手の速度を引く(在位の形)/(源の運動だけ) 引かない(第350便の比べる列 mut 'absVel')/(S 型-点) 源の点の自転だけ(相対の速度 0 —— 自転 0 なので 0)/
//   (S 型-体) 円盤全体を 1 つの回転する源と読む(質量 1・半径 = 外縁・原点・自転 Ω_s ẑ・源の回転の形 q 0〔源の枠の剛体の回転〕—— 受け手は球の内側なので球のモーメント M は使えない)。
//   回転の読み: (W) 中心の渦度の半分(rot3('W'))/(C2) 受け手の球の半径の平均(第350便b の c2Ball —— 自分の重みを半径 ρ の値に置く一次の展開)。
//   自分の重み: off(分母に入れない —— 重みつきの平均の速度の場そのもの)/rule(受け手 = 太陽: K1 は規則の半径 Y_k m・K2 は既定の半径 min(R_obs, 6.5e6 m) —— 単位は質量 M_gal・長さ R₀)。
// ■ 言わないこと: 銀河由来の軸引きずりの強弱・背景の大きさの値・予想の文の成否を結果として書かない。この模型・この読み・このノブでは、の数の表。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as DK from './lib-w312a-decay.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w352f-galdisk-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 速度の場の冪 p(1 剛体・0 平坦・−½ 点の源のまわり) */
  ps: Object.freeze([1, 0, -0.5]),
  /** 表 1 の数値の照合: 有限の差の腕 h・(C2) の求積の球の半径 a(R₀ の倍)・一様な並進の場 */
  kin: Object.freeze({ h: 1e-4, a: 0.02, shift: Object.freeze([3, -2, 1]) }),
  /** 円盤の模型(単位: 長さ R₀・速さ v₀・質量 = 円盤の合計 —— Ω₀ = v₀/R₀ = 1)。基準の組と振るノブ */
  disk: Object.freeze({
    base: Object.freeze({ sigma: 'exp', edge: 2, perUnit: 16, nPhi: 128, al: 1 }),
    sigmas: Object.freeze(['exp', 'mestel']), sigmaNames: Object.freeze({ exp: '指数 Σ ∝ e^(−R/R_d)', mestel: 'Σ ∝ 1/R' }), Rd: 0.35,
    edges: Object.freeze([2, 3]), perUnits: Object.freeze([8, 16]), als: Object.freeze([1, 2]), nPhi: 128, soft: 1,
  }),
  selfs: Object.freeze(['off', 'rule']), modes: Object.freeze(['M', 'src']), reads: Object.freeze(['W', 'C2']),
  /** (S 型-体): 自転の置き方(R₀ の角速度 Ω₀/円盤の模型の角運動量 ÷ 慣性モーメント)・源の回転の形 q 0 */
  body: Object.freeze({ spins: Object.freeze(['atR0', 'LoverI']), q: 0 }),
  /** (C2) の求積の照合(第350便b の c2Quad —— 自分の重み off・受け手の球の半径 a) */
  c2check: Object.freeze({ a: 0.02 }),
  /** 一様な背景(第350便e・第351便e の倍率 1 = 銀河の公転の角速度 ω_G)と (uV) の倍率(金星で (S) と大きさが同じ —— 共通ブリーフ 352) */
  gal: Object.freeze({ omegaG: TL.GALAXY.omega, uV: 1.19282e-12 }),
  /** 表 4: 球の受け手の点の雲(半径 1・GL 8 × 8 × 方位 16)・扁平の比 0.9 */
  tq: Object.freeze({ nr: 8, nth: 8, nph: 16, flat: 0.9, a0: 1, g: 0.3, h: 0.2 }),
  floor: 1e-12,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 表 1: 速度の場の運動学 ───────── */
/** 軸対称の円運動の速度の場(柱座標 —— z に依らない)。shift は一様な並進を足す */
export function vField(p, { v0 = 1, R0 = 1, shift = [0, 0, 0] } = {}) {
  if (!(fin(p) && fin(v0) && fin(R0) && R0 > 0 && isVec(shift))) throw new RangeError('vField: p・v₀・R₀ > 0・shift');
  return { u: (x) => { const R = Math.hypot(x[0], x[1]); if (!(R > 0)) return shift.slice(); const v = v0 * Math.pow(R / R0, p) / R; return [-x[1] * v + shift[0], x[0] * v + shift[1], shift[2]]; } };
}
/** 一様な並進だけの場 */
export const uniformField = (V) => ({ u: () => V.slice() });
/** 閉じた形(Ω₀ の倍): 速さの差分・向きの変化の分・局所の回転・ずれ */
export function kinClosed(p) {
  if (!fin(p)) throw new RangeError('kinClosed: p');
  return { dvdR: p, vOverR: 1, omega: 0.5 * (1 + p), shearA: 0.5 * (1 - p) };
}
/** 数値(有限の差と第350便b の c2Quad —— 点 (R₀, 0, 0)) */
export function kinNum(p, { h = DECL.kin.h, a = DECL.kin.a } = {}) {
  const f = vField(p), P = [1, 0, 0], vy = (R) => f.u([R, 0, 0])[1];
  const dvdR = (vy(1 + h) - vy(1 - h)) / (2 * h), vOverR = vy(1) / 1;
  const dvy = f.u([1, h, 0])[0] - f.u([1, -h, 0])[0];   // ∂u_x/∂y = −v/R(向きの変化)
  const curlZ = dvdR - dvy / (2 * h);
  return { dvdR, vOverR, omegaFD: 0.5 * curlZ, omegaC2: SC.c2Quad(f, P, a)[2], c2xy: Math.hypot(...SC.c2Quad(f, P, a).slice(0, 2)) };
}
export function kinRows() {
  return DECL.ps.map((p) => { const c = kinClosed(p), n = kinNum(p);
    return { p, ...c, num: n, relFD: Math.abs(n.omegaFD - c.omega) / c.omega, relC2: Math.abs(n.omegaC2 - c.omega) / c.omega, absDv: Math.abs(n.dvdR - c.dvdR) }; });
}

/* ───────── 表 2: 円盤の模型 ───────── */
/** 面密度(規格化前) */
function sigmaOf(kind, R) { if (kind === 'exp') return Math.exp(-R / DECL.disk.Rd); if (kind === 'mestel') return 1 / R; throw new RangeError('sigmaOf: 面密度の形は exp・mestel'); }
/** 円盤の点の源(輪の境界が R₀ = 1 に来る格子 —— 受け手は輪と輪の間)。cfg: { p, sigma, edge, perUnit, nPhi, al } */
export function diskSources(cfg) {
  const { p, sigma, edge, perUnit, nPhi } = cfg;
  if (!(fin(p) && fin(edge) && edge > 1 && Number.isInteger(perUnit) && perUnit >= 2 && Number.isInteger(nPhi) && nPhi >= 8 && Number.isInteger(edge * perUnit))) throw new RangeError('diskSources: p・外縁 > 1・輪の密さ(整数)・N_φ ≥ 8');
  const nR = edge * perUnit, dR = 1 / perUnit, rings = [];
  let tot = 0;
  for (let i = 0; i < nR; i++) { const R = (i + 0.5) * dR, w = sigmaOf(sigma, R) * 2 * Math.PI * R * dR; rings.push({ R, w }); tot += w; }
  const out = [];
  for (const g of rings) {
    const m = g.w / tot / nPhi, v = Math.pow(g.R, p);
    for (let k = 0; k < nPhi; k++) { const ph = 2 * Math.PI * (k + 0.5) / nPhi, c = Math.cos(ph), s = Math.sin(ph);
      out.push({ m, R: dR * DECL.disk.soft, p: [g.R * c, g.R * s, 0], v: [-s * v, c * v, 0], spin: [0, 0, 0] }); }
  }
  return out;
}
/** 円盤の模型の角運動量 ÷ 慣性モーメント(Σ m R v ÷ Σ m R²) */
export function diskLoverI(src) { let L = 0, I = 0; for (const s of src) { const R = Math.hypot(s.p[0], s.p[1]); L += s.m * (s.p[0] * s.v[1] - s.p[1] * s.v[0]); I += s.m * R * R; } return L / I; }
/** 受け手(太陽 —— 単位は質量 M_gal・長さ R₀)。K1 は規則の半径 Y_k m・K2 は既定の半径 min(R_obs, 6.5e6 m)(第348便h の組 K1rM・K2capM と同じ置き方) */
export function sunRecv(al) {
  const Mg = G3.galMass(), R0 = C.galDistM(), mS = C.massOf('Sun');
  const Rm = al === 1 ? G3.YK * mS : Math.min(C.radiusOf ? C.radiusOf('Sun') : G3.CAP_M, G3.CAP_M);
  return { m: mS / Mg, R: Rm / R0, Rm, A: (mS / Mg) * DK.Kball(al, 0, Rm / R0) };
}
const P0 = [1, 0, 0], V0 = [0, 1, 0];
/** 円盤の場(在位の形の makeField3 —— mode 'M' 受け手の速度を引く・'src' 引かない) */
export function diskField(src, { al = 1, self = 'off', mode = 'M', rot = { form: 'M' } } = {}) {
  if (!DECL.selfs.includes(self) || !DECL.modes.includes(mode)) throw new RangeError('diskField: 自分の重み off・rule/読み M・src');
  const sr = sunRecv(al), recv = self === 'rule' ? { m: sr.m, R: sr.R, p: P0.slice(), v: V0.slice() } : { p: P0.slice(), v: V0.slice() };
  return G3.makeField3({ sources: src, recv, kernel: { kind: 'ball', al }, rot, self: self === 'rule', mut: mode === 'src' ? 'absVel' : null });
}
/** 受け手の回転の z 成分と面内の成分の大きさ(読み W・C2) */
export function recvRot(field, self, al) {
  const sr = sunRecv(al), Rb = self === 'rule' ? sr.R : 1e-3;
  const W = G3.rot3('W', field, P0, { Rb }), C2 = self === 'rule' ? SC.c2Ball(field, P0, sr.R) : W;
  return { W: W[2], C2: C2[2], Wxy: Math.hypot(W[0], W[1]), C2xy: Math.hypot(C2[0], C2[1]) };
}
/** 円盤の重みの合計の受け手の位置の値(分母の円盤の分)と自分の重みとの比 */
export function weightRatio(src, al) { let w = 0; for (const s of src) w += s.m * DK.Kball(al, nrm(sub(P0, s.p)), s.R); const sr = sunRecv(al); return { Wdisk: w, A: sr.A, beta: sr.A / w }; }
/** 1 つの組の全部の読み */
export function diskCase(cfg) {
  const src = diskSources(cfg), out = { ...cfg, nSrc: src.length, LoverI: diskLoverI(src) };
  for (const self of DECL.selfs) {
    const M = recvRot(diskField(src, { al: cfg.al, self, mode: 'M' }), self, cfg.al), S = recvRot(diskField(src, { al: cfg.al, self, mode: 'src' }), self, cfg.al);
    out[self] = { M, src: S };
  }
  out.wr = weightRatio(src, cfg.al);
  return out;
}
/** (S 型-点): 源の点の自転だけ(相対の速度 0 —— 源の速度 = 受け手の速度 0・自転 0) */
export function sPointCase(cfg) {
  const src = diskSources(cfg).map((s) => ({ ...s, v: [0, 0, 0] })), sr = sunRecv(cfg.al);
  const f = G3.makeField3({ sources: src, recv: { m: sr.m, R: sr.R, p: P0.slice(), v: [0, 0, 0] }, kernel: { kind: 'ball', al: cfg.al }, self: true });
  return nrm(G3.rot3('W', f, P0, { Rb: sr.R }));
}
/** (S 型-体): 円盤全体を 1 つの回転する源と読む(質量 1・半径 = 外縁・原点・自転 Ω_s ẑ・源の回転の形 q 0) */
export function bodyCase(cfg, spin) {
  const src = [{ m: 1, R: cfg.edge, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, spin] }], out = { spin };
  for (const self of DECL.selfs) {
    const M = recvRot(diskField(src, { al: cfg.al, self, mode: 'M', rot: { form: 'q', q: DECL.body.q } }), self, cfg.al);
    const S = recvRot(diskField(src, { al: cfg.al, self, mode: 'src', rot: { form: 'q', q: DECL.body.q } }), self, cfg.al);
    out[self] = { M, src: S };
  }
  return out;
}
/** 格子(p × 面密度 × 外縁 × 輪の密さ × 核) */
export function gridCfgs() {
  const D = DECL.disk, out = [];
  for (const p of DECL.ps) for (const sigma of D.sigmas) for (const edge of D.edges) for (const perUnit of D.perUnits) for (const al of D.als) out.push({ p, sigma, edge, perUnit, nPhi: D.nPhi, al });
  return out;
}
export function diskRows() {
  return gridCfgs().map((cfg) => { const r = diskCase(cfg);
    r.body = DECL.body.spins.map((k) => bodyCase(cfg, k === 'atR0' ? 1 : r.LoverI)).map((b, j) => ({ kind: DECL.body.spins[j], ...b }));
    return r; });
}
/** (C2) の求積の照合(自分の重み off・基準の組・p 3 つ): c2Quad(半径 a)と中心の (W) */
/** 点の数への依存(基準の組・p 0・N_φ 64・128・256 —— 自分の重み rule の M 型の (W)) */
export function convRows() {
  const B = DECL.disk.base;
  return [64, 128, 256].map((nPhi) => { const src = diskSources({ ...B, p: 0, nPhi }); return { nPhi, W: recvRot(diskField(src, { al: B.al, self: 'rule', mode: 'M' }), 'rule', B.al).W, Woff: recvRot(diskField(src, { al: B.al, self: 'off', mode: 'M' }), 'off', B.al).W }; });
}
export function c2CheckRows() {
  const B = DECL.disk.base;
  return DECL.ps.map((p) => { const src = diskSources({ ...B, p }), f = diskField(src, { al: B.al, self: 'off', mode: 'M' }), q = SC.c2Quad(f, P0, DECL.c2check.a), w = G3.rot3('W', f, P0, { Rb: 1e-3 });
    return { p, c2Quad: q[2], W: w[2], rel: Math.abs(q[2] - w[2]) / Math.abs(w[2]) }; });
}

/* ───────── 表 3: 一様な背景との比 ───────── */
/** Ω₀ の倍の数 x を rad/s に(Ω₀ = ω_G —— 模型の R₀・v₀ は第348便c の galDistM と GALAXY.beta の組で Ω₀ = ω_G)と、(uV) との桁の差 log10(abs(x) ÷ uV) */
export function bgRatio(x) { const g = DECL.gal; return { radS: x * g.omegaG, overU1: x, log10OverUV: x === 0 ? null : Math.log10(Math.abs(x) / g.uV) }; }

/** (uV) の数え直し(第351便e の localOf・bgTerm・uEqMag を呼ぶだけ —— 金星・太陽由来 (S)・(C2)・分母 out・k 1)と宣言の値の相対の差 */
export function uvCheck(T1 = E.t1Table(), GEO = E.geometry()) {
  const V = BB.localOf(T1, GEO, 'Venus', 'Sun', { k: 1 }), b1 = BB.bgTerm('Venus', { u: 1 }).vec, uS = BB.uEqMag(V.sun.S, b1), uMS = BB.uEqMag(V.sun.MS, b1);
  return { uS, uMS, relDecl: Math.abs(uS / DECL.gal.uV - 1), b1Mag: nrm(b1), b1OverOmegaG: nrm(b1) / DECL.gal.omegaG };
}

/* ───────── 表 4: 上下の運動と傾き(重心のまわりのトルク)───────── */
const GLT = Object.freeze({ r: H.gaussLegendre(DECL.tq.nr), th: H.gaussLegendre(DECL.tq.nth) });
/** 一様な球(半径 1・質量 1)の点の雲 —— 扁平の比 fz で z を縮める */
export function cloud(fz = 1) {
  const pts = [], { nph } = DECL.tq; let msum = 0;
  for (let i = 0; i < GLT.r.x.length; i++) { const r = 0.5 * (GLT.r.x[i] + 1), wr = 0.5 * GLT.r.w[i] * r * r;
    for (let j = 0; j < GLT.th.x.length; j++) { const ct = GLT.th.x[j], st = Math.sqrt(1 - ct * ct);
      for (let k = 0; k < nph; k++) { const ph = 2 * Math.PI * (k + 0.5) / nph, w = wr * GLT.th.w[j] * 2 * Math.PI / nph; pts.push({ x: [r * st * Math.cos(ph), r * st * Math.sin(ph), fz * r * ct], w }); msum += w; } } }
  for (const q of pts) q.w /= msum;
  return pts;
}
/** 重心のまわりのトルク Σ m r × a(r)(重心は原点) */
export function torque(pts, acc) { let t = [0, 0, 0]; for (const q of pts) t = add(t, scl(crs(q.x, acc(q.x)), q.w)); return t; }
/** 2 次のモーメント M_jl = Σ m x_j x_l */
export function second(pts) { const M = new Array(9).fill(0); for (const q of pts) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) M[3 * a + b] += q.w * q.x[a] * q.x[b]; return M; }
export function torqueRows() {
  const T = DECL.tq, sph = cloud(1), obl = cloud(T.flat), Ms = second(sph), Mo = second(obl);
  const fields = [
    ['uniform', '一様な上下の加速度 a₀ ẑ', (x) => [0, 0, T.a0]],
    ['height', '高さの 1 次 (a₀ + g z) ẑ', (x) => [0, 0, T.a0 + T.g * x[2]]],
    ['tideXZ', '潮汐の型(対称の勾配 H_xz = H_zx = h)', (x) => [T.h * x[2], 0, T.h * x[0]]],
    ['curlXZ', '回転を持つ差(a_z = g x —— 勾配でない場)', (x) => [0, 0, T.g * x[0]]],
  ];
  return fields.map(([id, name, f]) => { const ts = torque(sph, f), to = torque(obl, f);
    const closedY = id === 'tideXZ' ? [T.h * (Ms[8] - Ms[0]), T.h * (Mo[8] - Mo[0])] : id === 'curlXZ' ? [-T.g * Ms[0], -T.g * Mo[0]] : [0, 0];
    const fl = (v) => (Math.abs(v) <= DECL.floor ? 0 : v);
    return { id, name, sphere: ts.map(fl), oblate: to.map(fl), closedY: closedY.map(fl), Mzz_Mxx: [Ms[8] - Ms[0], Mo[8] - Mo[0]].map(fl) }; });
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const K = kinRows(), by = Object.fromEntries(K.map((r) => [String(r.p), r]));
  const uni = uniformField(DECL.kin.shift.slice()), uC2 = SC.c2Quad(uni, P0, DECL.kin.a), sh = vField(0, { shift: DECL.kin.shift.slice() }), shC2 = SC.c2Quad(sh, P0, DECL.kin.a)[2];
  const cc = BG.commonChecks();
  // 円盤の小さな組(N_φ 32・輪 8/R₀・外縁 2・指数): 自分の重み off の M と src は同じ(一定の速度を引いても重みつきの平均の回転は変わらない)・自転 0 の (S 型-点) は 0・
  // (S 型-体) q 0・自分の重み off は剛体の回転 Ω_s そのもの・源の速度の向きを反転すると M の回転が反転(受け手の速度も反転)
  const cfg = { p: 0, sigma: 'exp', edge: 2, perUnit: 8, nPhi: 32, al: 1 }, src = diskSources(cfg);
  const mOff = recvRot(diskField(src, { self: 'off', mode: 'M' }), 'off', 1).W, sOff = recvRot(diskField(src, { self: 'off', mode: 'src' }), 'off', 1).W;
  const sPt = sPointCase(cfg), bd = bodyCase(cfg, 0.7);
  const srcR = src.map((s) => ({ ...s, v: scl(s.v, -1) }));
  const fR = G3.makeField3({ sources: srcR, recv: { m: sunRecv(1).m, R: sunRecv(1).R, p: P0.slice(), v: [0, -1, 0] }, kernel: { kind: 'ball', al: 1 }, self: true });
  const fF = diskField(src, { self: 'rule', mode: 'M' });
  const rev = G3.rot3('W', fR, P0, { Rb: sunRecv(1).R })[2], fwd = G3.rot3('W', fF, P0, { Rb: sunRecv(1).R })[2];
  // ガリレイ: 源と受け手に同じ速度を足しても M 型は不変
  const dv = DECL.kin.shift, srcG = src.map((s) => ({ ...s, v: add(s.v, dv) }));
  const fG = G3.makeField3({ sources: srcG, recv: { m: sunRecv(1).m, R: sunRecv(1).R, p: P0.slice(), v: add(V0, dv) }, kernel: { kind: 'ball', al: 1 }, self: true });
  const gal = Math.abs(G3.rot3('W', fG, P0, { Rb: sunRecv(1).R })[2] / fwd - 1);
  // 拒否
  const rj = (fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } };
  const rejects = [rj(() => vField(NaN)), rj(() => diskSources({ ...cfg, edge: 1 })), rj(() => diskSources({ ...cfg, perUnit: 1 })), rj(() => diskSources({ ...cfg, sigma: 'x' })),
    rj(() => diskField(src, { self: 'x' })), rj(() => diskField(src, { mode: 'x' })), rj(() => kinClosed('a'))];
  // 変異: 向きの変化の分を落とした回転(½ dv/dR だけ)は平坦で 0 —— 閉じた形の ½ と違う
  const mutFlat = 0.5 * kinNum(0).dvdR;
  const T4 = torqueRows();
  return { kin: K.map((r) => ({ p: r.p, omega: r.omega, omegaFD: r.num.omegaFD, omegaC2: r.num.omegaC2, dvdR: r.num.dvdR, vOverR: r.num.vOverR, relFD: r.relFD, relC2: r.relC2 })),
    p1: by['1'].num.omegaC2, p0: by['0'].num.omegaC2, pm: by['-0.5'].num.omegaC2, flatDv: by['0'].num.dvdR, flatVR: by['0'].num.vOverR,
    uniform: nrm(uC2), shiftFlat: shC2, common: { diaXz: cc.diaXz, sixZ: cc.sixZ, rotWz: cc.rotWz },
    disk: { mOff, sOff, offSame: Math.abs(mOff - sOff) / Math.abs(mOff), sPoint: sPt, bodyOff: bd.off.M.W, bodyOffSrc: bd.off.src.W, reverse: Math.abs(rev / fwd + 1), galilei: gal },
    mutFlat, rejects, torque: { uniform: T4[0].sphere, height: T4[1].sphere, tideSphere: T4[2].sphere, tideOblate: T4[2].oblate, tideClosed: T4[2].closedY[1] } };
}
export function pureGates(S) {
  const W = BG.COMMON_WANT, t = S.torque;
  return {
    closed: Math.abs(S.p1 - 1) < 1e-9 && Math.abs(S.p0 - 0.5) < 1e-4 && Math.abs(S.pm - 0.25) < 1e-4 && S.kin.every((r) => r.relFD < 1e-6 && r.relC2 < 2e-4),
    flat: Math.abs(S.flatDv) < 1e-10 && Math.abs(S.flatVR - 1) < 1e-12,
    uniform: S.uniform < 1e-12 && Math.abs(S.shiftFlat - S.p0) < 1e-12,
    common: Math.abs(S.common.diaXz - W.diaXz) < W.tol && Math.abs(S.common.sixZ - W.sixZ) < W.tol && Math.abs(S.common.rotWz - W.rotWz) < W.tol,
    diskOff: S.disk.offSame < 1e-12 && S.disk.sPoint === 0 && Math.abs(S.disk.bodyOff - 0.7) < 1e-12 && Math.abs(S.disk.bodyOffSrc - 0.7) < 1e-12,
    diskSym: S.disk.reverse < 1e-9 && S.disk.galilei < 1e-9,
    mutant: Math.abs(S.mutFlat) < 1e-10 && Math.abs(S.p0 - S.mutFlat) > 0.4,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
    torque: nrm(t.uniform) === 0 && nrm(t.height) === 0 && nrm(t.tideSphere) === 0 && Math.abs(t.tideOblate[1] / t.tideClosed - 1) < 1e-9 && Math.abs(t.tideClosed) > 1e-3,
  };
}

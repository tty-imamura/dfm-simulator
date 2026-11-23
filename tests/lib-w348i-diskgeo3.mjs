// 第348便i(原仮定者の指示(2026-11-23 —— 第145報の補足 2)「引きずり近似のkFrameとqは、geoPN=2が対象。検証を進めている軸引きずりや円盤引きずりは、geoPN=3が対象」・
//   原仮定者の指示(2026-11-22 —— 第145報の補足 1)・統括の検証項目 R417):
//   **円盤引きずりの側の量(〔第348便d〕の輪の寄せる向き・90° の成分・経路の比・土星の環の物差し・通過の輪の傾き)を、geoPN=3(慣性決定力の引きずり)の形の場で数え直す純関数 —— 診断だけ**
//   (器 tests/exp-w348i-diskgeo3.mjs と QA behavior.diskgeo3_348i・docs.diskgeo3_348i が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない・版を上げない): 第347便h(rotOf —— 候補の回転・makeField は照合だけ)・第348便d(candField・curField・pullSummary・satRow・saturnUnits・
//   flyRing —— 〔第348便d〕の列と照合の相手)・第340便d(gyroRow・spheroidParts・angleAtan2)・第338便d(土星の区分の中心)・第309便a(K2・M2 —— アプリの invSq の閉じた式の参照)。
//
// ■ geoPN=3 の形の場(アプリの慣性決定力の引きずりの行を、受け手 1 つ・源は与えた動きのまま〔源の側の連立は解かない〕の点の式に書き下したもの —— 公開の〔第301便a〕〔第302便a〕〔第303便b〕〔第309便a〕〔第330便b〕):
//   u(x) = [ Σ_j W_j(x) (v_j − v_r) + Σ_j N_j(x) ] ÷ ( W₀ + W_ii + Σ_j W_j(x) )
//   —— 引きずり = Σ(相対速度 × 重み)÷ Σ重み(自分を含む・背景を含む)。v_r は受け手の慣性速度(相対速度は自分基準 —— アプリの solve の右辺 Σβ(V_j − v_i)の型)。
//   W₀ = 背景慣性決定力(コードの名 `W_bg`)・W_ii = 受け手自身の重み(分母にだけ入れる —— 自己の並進を分子へ重ねない)。単一の受け手では W₀ と W_ii は和だけが効く(零試験 ③)。
//   源の回転の分 N_j(2 つの読み —— 型を決めない):
//     (Rcv) 座標変換の型: W_j = m_j ÷ d^p(p = 2 —— 重み = 質量 ÷ 距離²)・N_j = W_j (Ω_j × (x − r_j))(原仮定者の補足(2026-11-08)の「座標変換」の読み —— 〔第330便b〕の座標変換の型)。
//     (Rm2) アプリの invSq の型: W_j = m_j K2(d; R_j)(源の一様球の逆二乗の体積平均 —— 遠方 m/d²)・N_j = m_j M2(d; R_j) (Ω_j × n̂)(源の球の回転の近遠差のモーメント —— 遠方 2R²/(5d³))
//       ——〔第309便a〕の点の式(受け手の体積の比の平均は取らない —— 点で読む宣言)。
//   〔第348便d〕の場(geoPN=2 の形 —— 第347便h の makeField): u = Σ w_j (v_j + s_j (R_j/(R_j + d))^q â_j × (x − r_j)) ÷ (D₀ + Σ w_j)・w_j = m_j/d^(p_w)・p_w 1。
//   (Rcv)・p 1・W₀ + W_ii = D₀・v_r 無しは、その場の q = 0 とちょうど同じ(零試験 ④)。
// ■ 候補の回転: 〔第347便h〕の (P2)(2 点の差分 —— 原文の案)と (W)(中心の ½∇×u)を rotOf でそのまま呼ぶ(勾配 J は 5 点の差分 —— 刻み 1e-3 × 源までの距離)。
// ■ 量(T2〜T4 —— 〔第348便d〕と同じ器・同じ格子): (A) 輪の受け手の寄せる向き(corV・corS・drag90)と向きが変わる高さ・(B) 経路の比(扁平 ÷ 球 —— (Rcv) だけ)・
//   (C) 土星の環(点の受け手・corV・区分の中心 5 —— 輪の受け手の corS・drag90)・(D) 自転しない源の通過での輪の傾き。ノブ: 源の回転の分 2 × W₀ と W_ii × 受け手の慣性速度(引く/引かない)。
// ■ 言わないこと: 環の厚み・帯・円盤引きずりの式・型の答えとは書かない(この場の形・この器・この候補・このノブでは、の表)。
//   観測の数はリポジトリに既に在る数だけを固定の比べる列に置く(文献の値・未照合 —— 合わせない・新しい数を足さない)。
import * as H from './lib-w347h-axisdiff.mjs';
import * as D from './lib-w348d-diskaxis.mjs';
import * as GP from './lib-w340d-gyropath.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as IQ from './lib-w309a-invsq.mjs';

export const LIB_VERSION = 'w348i-diskgeo3-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => scl(a, 1 / nrm(a));
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
/** K1(r; R) —— 一様球の 1/r の体積平均(外部 1/r・内部 (3R² − r²)/(2R³) —— アプリの inertialDragIsqK1 の値の式) */
export const K1 = (r, R) => (r >= R ? 1 / r : (3 * R * R - r * r) / (2 * R * R * R));

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  cands: Object.freeze(['P2', 'W']),
  /** 源の回転の分の読み 2 つ(型を決めない) */
  rots: Object.freeze(['cv', 'm2', 'k1']),
  /** (Rk1) 在位の本が宣言している形(invSq の kernel:"k1"・rdRule:"kappaM")の列: W₀ 0 が主・> 0 は比べる列。受け手の自分の重みは中心の値 W_ii の K1 の球(半径 R_self = R_b —— 輪の粒子の置き方の宣言)。
   *  通過は自分の重みを定数(輪の粒子がそれぞれ持つ)に置く */
  k1: Object.freeze({ den: Object.freeze([Object.freeze([0, 0]), Object.freeze([0, 0.1]), Object.freeze([0, 10]), Object.freeze([0.1, 0.1])]), Rself: D.DECL.Rb,
    denD: Object.freeze([Object.freeze([0, 0]), Object.freeze([0, 0.01]), Object.freeze([0, 0.1]), Object.freeze([0.1, 0.1])]) }),
  /** 重みのべき(Rcv —— 重み = 質量 ÷ 距離²)・源の半径(Rm2 の球)・候補の受け手の半径 R_b(〔第348便d〕と同じ) */
  p: 2, Rs: 1, Rb: D.DECL.Rb,
  /** 分母の自分の側: [W₀, W_ii](無次元 —— 源の質量 1・長さ 1 の単位。和だけが効くことを並べて見せる) */
  den: Object.freeze([Object.freeze([0, 0]), Object.freeze([0.1, 0]), Object.freeze([0, 0.1]), Object.freeze([0.1, 0.1])]),
  /** 受け手の慣性速度 v_r を引く(on —— 受け手の中心の公転の速度 (0, √(1/d), 0))/引かない(off) */
  vRec: Object.freeze(['off', 'on']),
  /** 勾配の差分(5 点・刻み = 係数 × 源までの距離) */
  jStep: 1e-3,
  /** (A) 〔第348便d〕の (A) と同じ距離・作用・高さ。比べる列 = 〔第348便d〕の場の (P2)・(W) × q 0・2・3 × D₀ 0・0.1(lib を呼んで作る) */
  A: Object.freeze({ d: D.DECL.A.d, actions: D.DECL.A.actions, z: D.DECL.A.z, zRef: D.DECL.A.zRef }),
  /** (B) 経路の比 —— (Rcv) だけ(部位 960 点・部位の速度 ẑ × y_j・自転 ẑ)。(Rm2) は部位の球が重なる(M2 は外部だけ)ので数えない */
  B: Object.freeze({ f: Object.freeze([0.098, 0.3]), fPath: Object.freeze([0.098]), rOverReq: Object.freeze([1.5, 2, 5]), z: Object.freeze([0.01, 0.1]),
    den: Object.freeze([Object.freeze([0, 0]), Object.freeze([0.1, 0]), Object.freeze([0.1, 0.1])]), recvCubeK: D.DECL.B.recvCubeK, cancel: D.DECL.B.cancel }),
  /** (C) 土星の環(〔第348便d〕の (C) と同じ区分・同じ高さの格子 —— 単位は土星の半径と √(R³/GM)・源の質量 1・半径 1) */
  C: Object.freeze({ centers: D.DECL.C.centers, ringActions: D.DECL.C.ringActions, ringZ: D.DECL.C.ringZ }),
  /** (D) 通過(〔第348便d〕の (D) と同じ道と輪 —— 源 (v t, b, 0)・速度 (v, 0, 0)・自転 0・質量 1・受け手は静止) */
  D: Object.freeze({ den: Object.freeze([Object.freeze([0, 0]), Object.freeze([0.01, 0]), Object.freeze([0, 0.01]), Object.freeze([0.1, 0]), Object.freeze([0, 0.1]), Object.freeze([0.1, 0.1])]),
    Rr: D.DECL.D.Rr, inc: D.DECL.D.inc, ref348dD0: Object.freeze([0, 0.01, 0.1, 0.2]) }),
  floor: 1e-12,
});

/** 固定の比べる列(リポジトリの中の数 —— 〔第348便d〕の lib の LIT をそのまま読む・合わせない・新しい数を足さない) */
export const LIT = D.LIT;

/* ───────── geoPN=3 の形の場 ───────── */
/**
 * 場を作る。sources: [{m, R, spin:[3](Ω_j —— 表面の角速度のベクトル), r:[3], v:[3]}]・rot('cv'|'m2')・p・Wbg(W₀)・Wself(W_ii)・vRec([3] —— 受け手の慣性速度)。
 * mut は変異の試験だけ('noSelfDen' —— W_ii を分母から落とす・'vRecSign' —— 受け手の速度を足す)。戻り値 { u(x), J(x), W(x) }(J は 5 点の差分)
 */
export function geo3Field({ sources, rot, p = DECL.p, Wbg = 0, Wself = 0, vRec = [0, 0, 0], selfBall = null, mut = null } = {}) {
  if (!DECL.rots.includes(rot)) throw new RangeError('geo3Field: 源の回転の分は ' + DECL.rots.join('・'));
  if (!(Array.isArray(sources) && sources.length > 0 && sources.every((s) => fin(s.m) && s.m >= 0 && fin(s.R) && s.R > 0 && isVec(s.spin) && isVec(s.r) && isVec(s.v))))
    throw new RangeError('geo3Field: 源の宣言(m ≥ 0・R > 0・spin・r・v)');
  if (!(fin(p) && p > 0 && fin(Wbg) && Wbg >= 0 && fin(Wself) && Wself >= 0 && isVec(vRec))) throw new RangeError('geo3Field: p > 0・W₀ ≥ 0・W_ii ≥ 0・v_r');
  if (selfBall !== null && !(isVec(selfBall.p) && fin(selfBall.R) && selfBall.R > 0)) throw new RangeError('geo3Field: selfBall {p, R > 0}');
  const vr = mut === 'vRecSign' ? scl(vRec, -1) : vRec, self = mut === 'noSelfDen' ? 0 : Wself;
  // 自分の重み: 定数 W_ii か、中心の値 W_ii の K1 の球(W_ii(x) = W_ii (2R/3) K1(abs(x − p); R) —— 中心 W_ii・表面 (2/3) W_ii)
  const selfAt = (x) => (selfBall === null ? self : self * (2 * selfBall.R / 3) * K1(nrm(sub(x, selfBall.p)), selfBall.R));
  const at = (x) => {
    let Wsum = Wbg + selfAt(x), P = [0, 0, 0];
    for (const s of sources) {
      const dx = sub(x, s.r), d = nrm(dx);
      if (!(d > 0)) throw new RangeError('geo3Field: 源の中心');
      if (rot === 'cv') { const w = s.m * Math.pow(d, -p); Wsum += w; P = add(P, scl(add(sub(s.v, vr), crs(s.spin, dx)), w)); }
      else if (rot === 'k1') { const w = s.m * K1(d, s.R); Wsum += w; P = add(P, scl(sub(s.v, vr), w));
        if (nrm(s.spin) > 0) { if (!(d > s.R)) throw new RangeError('geo3Field: (Rk1) の源の回転の分は源の球の外だけ(M1 = R²/(5d²) は外部)'); P = add(P, scl(crs(s.spin, scl(dx, 1 / d)), s.m * s.R * s.R / (5 * d * d))); } }
      else { if (!(d > s.R)) throw new RangeError('geo3Field: (Rm2) は源の球の外だけ(M2 は外部)');
        const w = s.m * IQ.K2(d, s.R), mm = s.m * IQ.M2(d, s.R); Wsum += w; P = add(P, add(scl(sub(s.v, vr), w), scl(crs(s.spin, scl(dx, 1 / d)), mm))); }
    }
    return { u: Wsum > 0 ? scl(P, 1 / Wsum) : [0, 0, 0], W: Wsum };
  };
  const u = (x) => at(x).u;
  const J = (x) => {
    let dmin = Infinity; for (const s of sources) dmin = Math.min(dmin, nrm(sub(x, s.r)));
    const h = DECL.jStep * dmin, out = new Array(9);
    for (let b = 0; b < 3; b++) {
      const e = [0, 0, 0]; e[b] = h; const e2 = scl(e, 2);
      const up = u(add(x, e)), um = u(sub(x, e)), up2 = u(add(x, e2)), um2 = u(sub(x, e2));
      for (let a = 0; a < 3; a++) out[3 * a + b] = (8 * (up[a] - um[a]) - (up2[a] - um2[a])) / (12 * h);
    }
    return out;
  };
  return { u, J, W: (x) => at(x).W };
}
const memo = (f) => { const M = new Map(); return (x) => { const k = x[0] + ',' + x[1] + ',' + x[2]; let v = M.get(k); if (!v) { v = f(x); M.set(k, v); } return v; }; };
/** 源 1 つ(静止・質量 1・半径 Rs・自転 s ẑ)の geoPN=3 の場から候補の回転の場 x ↦ Ω(〔第348便d〕の candField と同じ口 —— ê = x̂・R_b) */
export function geo3OmegaField(cand, { rot, Wbg = 0, Wself = 0, vRec = [0, 0, 0], s = 1, p = DECL.p, Rs = DECL.Rs, Rb = DECL.Rb, mut = null, rotMut = null } = {}) {
  if (!DECL.cands.includes(cand)) throw new RangeError('geo3OmegaField: 候補は ' + DECL.cands.join('・'));
  if (!(fin(Rb) && Rb > 0 && fin(s))) throw new RangeError('geo3OmegaField: R_b > 0・s');
  const src = [{ m: 1, R: Rs, spin: [0, 0, s], r: [0, 0, 0], v: [0, 0, 0] }];
  if (rot === 'k1') return memo((x) => H.rotOf(cand, geo3Field({ sources: src, rot, Wbg, Wself, vRec, selfBall: { p: x, R: DECL.k1.Rself }, mut }), x, { e: unit(x), Rb, mut: rotMut }).Om);   // 自分の重みの球の中心 = 受け手の中心
  const F = geo3Field({ sources: src, rot, p, Wbg, Wself, vRec, mut });
  return memo((x) => H.rotOf(cand, F, x, { e: unit(x), Rb, mut: rotMut }).Om);
}
/** 受け手の中心の公転の速度(第340便d の recvOf の V —— G m 1 の単位で (0, √(1/d), 0)) */
export const vOrbit = (d) => [0, Math.pow(d, -0.5), 0];
const denKey = (dn) => dn[0] + '|' + dn[1];
/** 源の回転の分ごとの (W₀, W_ii) の格子((Rk1) は W₀ 0 が主) */
export const denOf = (rot) => (rot === 'k1' ? DECL.k1.den : DECL.den);

/* ───────── (A) 輪の受け手の寄せる向き ───────── */
export function tableA() {
  const A = DECL.A, rows = [], ref = [];
  const h1 = {}; for (const d of A.d) for (const action of A.actions) h1[d + '|' + action] = D.pullSummary(D.curField('h1'), { action, d, zs: A.z });
  const vs = (P, d, action) => { const b = h1[d + '|' + action]; return b.shapeRef && P.shapeRef !== null ? P.shapeRef / b.shapeRef : null; };
  // 〔第348便d〕の場(geoPN=2 の形)の (P2)・(W) × q × D₀ —— 第348便d の lib を呼んで作る(比べる列)
  for (const cand of DECL.cands) for (const q of D.DECL.q) for (const D0 of D.DECL.D0) { const f = D.candField(cand, { q, D0 });
    for (const d of A.d) for (const action of A.actions) { const P = D.pullSummary(f, { action, d, zs: A.z }); ref.push({ cand, q, D0, d, action, dir: P.dir, vsH1: vs(P, d, action), zStarPos: P.zStarPos }); } }
  for (const rot of DECL.rots) for (const dn of denOf(rot)) for (const vr of DECL.vRec) for (const cand of DECL.cands) for (const d of A.d) {
    const f = geo3OmegaField(cand, { rot, Wbg: dn[0], Wself: dn[1], vRec: vr === 'on' ? vOrbit(d) : [0, 0, 0] });
    for (const action of A.actions) {
      const P = D.pullSummary(f, { action, d, zs: A.z }), v = vs(P, d, action);
      // 〔第348便d〕の列のうち、向きが同じで比(vsH1)の対数の差が一番小さい列(どこに来るか)
      let near = null, best = Infinity;
      for (const r of ref) if (r.cand === cand && r.d === d && r.action === action && r.dir === P.dir && v !== null && r.vsH1 !== null && v !== 0 && r.vsH1 !== 0 && sgn(v) === sgn(r.vsH1)) {
        const g = Math.abs(Math.log(Math.abs(v / r.vsH1))); if (g < best) { best = g; near = { q: r.q, D0: r.D0, vsH1: r.vsH1, logGap: g }; } }
      rows.push({ rot, Wbg: dn[0], Wself: dn[1], vRec: vr, cand, d, action, dir: P.dir, zPow: P.zPow, zStarPos: P.zStarPos, zStarNeg: P.zStarNeg, pullRef: P.pullRef, omRef: P.omRef, shapeRef: P.shapeRef,
        vsH1: v, near348d: near, sameDirAs348d: ref.filter((r) => r.cand === cand && r.d === d && r.action === action && r.dir === P.dir).map((r) => 'q' + r.q + '|' + r.D0) });
    }
  }
  return { rows, ref348d: ref };
}

/* ───────── (B) 経路の比(扁平の源 ÷ 同じ物理の位置の球の源 —— (Rcv) だけ)───────── */
export function partsField(src, { Wbg, Wself }) {
  const F = geo3Field({ sources: src.parts.map((pt) => ({ m: pt.m, R: 1, spin: [0, 0, 1], r: pt.y, v: crs([0, 0, 1], pt.y) })), rot: 'cv', Wbg, Wself });
  return F;
}
export function tableB() {
  const B = DECL.B, out = [], s0 = GP.spheroidParts(0), srcs = { 0: s0 };
  for (const f of B.f) srcs[f] = GP.spheroidParts(f);
  const tilt = (om) => GP.angleAtan2(om, [0, 0, 1]);   // 場の回転の向きの、源の軸(+ẑ)からの傾き
  const pos = (src, rr, z) => { const r = rr * src.Req, ce = Math.sqrt(1 - z * z); return { r, x: [r * ce, 0, r * z] }; };
  for (const dn of B.den) {
    const Fs = {}; for (const f of [0, ...B.f]) Fs[f] = partsField(srcs[f], { Wbg: dn[0], Wself: dn[1] });
    for (const cand of DECL.cands) {
      const om = {}; for (const f of [0, ...B.f]) om[f] = memo((x) => H.rotOf(cand, Fs[f], x, { e: unit(x), Rb: DECL.Rb }).Om);
      for (const f of B.f) for (const rr of B.rOverReq) for (const z of B.z) {
        const { r, x } = pos(srcs[f], rr, z), a = om[f](x), b = om[0](x), ta = tilt(a), tb = tilt(b);
        const row = { Wbg: dn[0], Wself: dn[1], cand, f, rOverReq: rr, zOverR: z, axisTilt: ta, axisTiltSphere: tb, axisTiltRatio: tb > 1e-9 ? ta / tb : null, magRatio: nrm(b) > 0 ? nrm(a) / nrm(b) : null, path: null };
        if (B.fPath.includes(f)) { row.path = {};
          for (const ac of D.DECL.B.actions) { const g = (fld) => GP.gyroRow({ action: ac, q: 1, p: 2, body: 'sphere', zOverR: z, r, field: fld, cubeK: B.recvCubeK });
            const ga = g(om[f]), gb = g(om[0]), pa = ga.pull, pb = gb.pull, thin = Math.abs(pa) <= B.cancel * ga.Fscale || Math.abs(pb) <= B.cancel * gb.Fscale;
            row.path[ac] = { pull: pa, pullSphere: pb, ratio: thin ? null : pb ? pa / pb : null, thin }; } }
        out.push(row);
      }
    }
  }
  return out;
}

/* ───────── (C) 土星の環の物差し ───────── */
export function tableC() {
  const U = D.saturnUnits(), C = DECL.C, rows = [], ring = [];
  for (const rot of DECL.rots) for (const dn of denOf(rot)) for (const vr of DECL.vRec) for (const cand of DECL.cands) for (const key of C.centers) {
    const r = RB.centerKm(key) * 1e3 / U.R, f = geo3OmegaField(cand, { rot, Wbg: dn[0], Wself: dn[1], vRec: vr === 'on' ? vOrbit(r) : [0, 0, 0], s: U.sDim });
    rows.push(Object.assign({ rot, Wbg: dn[0], Wself: dn[1], vRec: vr, cand }, D.satRow(f, key, U)));
    for (const action of C.ringActions) { const P = D.pullSummary(f, { action, d: r, zs: C.ringZ, zRef: -1 }), b = P.zStarPos;
      ring.push({ rot, Wbg: dn[0], Wself: dn[1], vRec: vr, cand, key, action, dir: P.dir, zStarPos: b, zStarNeg: P.zStarNeg, HstarM: b ? [2 * b[0] * r * U.R, 2 * b[1] * r * U.R] : null }); }
  }
  return { units: U, rows, ring };
}

/* ───────── (D) 自転しない源の通過と、環の粒子の輪 ───────── */
/** 輪の点が枠に運ばれる量(法線の向き)を方位で分ける(〔第348便d〕の flyRing と同じ道・同じ時間の点・同じ分け方 —— 場だけ geoPN=3 の形) */
export function flyRing3({ Wbg, Wself, Rr, inc, p = DECL.p, rot = 'cv', cands = DECL.cands }) {
  const Dd = D.DECL.D, gl = H.gaussLegendre(Dd.nT), L = [Math.sin(inc * D2R), 0, Math.cos(inc * D2R)], e1 = [0, 1, 0], e2 = crs(L, e1);
  const pts = Array.from({ length: Dd.nK }, (_, k) => { const ph = 2 * Math.PI * k / Dd.nK; return { ph, xi: add(scl(e1, Rr * Math.cos(ph)), scl(e2, Rr * Math.sin(ph))) }; });
  const del = new Array(Dd.nK).fill(0), tan = new Array(Dd.nK).fill(0), intOm = Object.fromEntries(cands.map((c) => [c, [0, 0, 0]])); let scale = 0;
  for (let i = 0; i < gl.x.length; i++) {
    const th = 0.5 * Math.PI * gl.x[i], t = (Dd.b / Dd.v) * Math.tan(th), wq = 0.5 * Math.PI * gl.w[i] * (Dd.b / Dd.v) / (Math.cos(th) * Math.cos(th));
    const rs = [Dd.v * t, Dd.b, 0], F = geo3Field({ sources: [{ m: 1, R: 1, spin: [0, 0, 0], r: rs, v: [Dd.v, 0, 0] }], rot, p, Wbg, Wself }), u0 = F.u([0, 0, 0]);
    scale += wq * nrm(u0);
    for (let k = 0; k < Dd.nK; k++) { const du = sub(F.u(pts[k].xi), u0), tk = crs(L, unit(pts[k].xi)); del[k] += wq * dot(du, L); tan[k] += wq * dot(du, tk); }
    const e = unit(scl(rs, -1));
    for (const c of cands) intOm[c] = add(intOm[c], scl(H.rotOf(c, F, [0, 0, 0], { e, Rb: Rr }).Om, wq));
  }
  const N = Dd.nK, a0 = del.reduce((s, x) => s + x, 0) / N, a1 = 2 * del.reduce((s, x, k) => s + x * Math.cos(pts[k].ph), 0) / N, b1 = 2 * del.reduce((s, x, k) => s + x * Math.sin(pts[k].ph), 0) / N;
  const rest = Math.sqrt(del.reduce((s, x, k) => { const y = x - a0 - a1 * Math.cos(pts[k].ph) - b1 * Math.sin(pts[k].ph); return s + y * y; }, 0) / N);
  const rotIn = tan.reduce((s, x) => s + x, 0) / N, tiltVec = add(scl(e1, a1 / Rr), scl(e2, b1 / Rr));
  const fl = DECL.floor * scale, fa = fl / Rr, sv = (x, t) => (Math.abs(x) <= t ? 0 : x), svv = (v, t) => (nrm(v) <= t ? [0, 0, 0] : v), tiltS = svv(tiltVec, fa);
  const C = {}; for (const c of cands) { const W = svv(intOm[c], fa), pred = crs(L, W);
    C[c] = { tilt: sv(nrm(pred), fa), inPlane: sv(dot(W, L), fa), vsRing: nrm(tiltS) > 0 ? sv(nrm(pred), fa) / nrm(tiltS) : null }; }
  return { rot, Wbg, Wself, Rr, inc, p, mean: sv(a0, fl), tilt: nrm(tiltS), rest: sv(rest, fl), restOverRr: sv(rest, fl) / Rr, inPlane: sv(rotIn / Rr, fa), cand: C, scale };
}
export function tableD() {
  const Dd = DECL.D, rows = [], ref = [];
  for (const dn of Dd.den) for (const Rr of Dd.Rr) for (const inc of Dd.inc) rows.push(flyRing3({ Wbg: dn[0], Wself: dn[1], Rr, inc }));
  for (const dn of DECL.k1.denD) for (const Rr of Dd.Rr) for (const inc of Dd.inc) rows.push(flyRing3({ Wbg: dn[0], Wself: dn[1], Rr, inc, rot: 'k1' }));
  // 〔第348便d〕の通過(geoPN=2 の形 —— p_w 1)の輪の傾き(D₀ = 0・0.01・0.1・0.2 —— W₀ + W_ii の和の値に合わせて並べる)
  for (const D0 of Dd.ref348dD0) for (const Rr of Dd.Rr) for (const inc of Dd.inc) { const r = D.flyRing({ D0, Rr, inc, cands: ['P2', 'W'] });
    ref.push({ D0, Rr, inc, tilt: r.tilt, inPlane: r.inPlane, P2: r.cand.P2.vsRing, W: r.cand.W.vsRing }); }
  for (const r of rows) { const S = r.Wbg + r.Wself, b = ref.find((x) => x.D0 === S && x.Rr === r.Rr && x.inc === r.inc); r.ref348d = b ? { D0: S, tilt: b.tilt, ratio: b.tilt > 0 ? r.tilt / b.tilt : null } : null; }
  return { rows, ref348d: ref };
}

/* ───────── 零試験(T5)───────── */
export function pureScenes() {
  const S = {}, pts = [[3, 0, 0.03], [10, 0, -1], [0.6, 2, 0.5]], zh = [0, 0, 1];
  // ① 源の回転 0 かつ W₀ = W_ii = 0 で 0(受け手の速度を引いても —— 一様の u)/対照: W₀ > 0 で受け手の速度を引くと 0 でない
  { let m = 0, ctl = 0;
    for (const rot of DECL.rots) for (const cand of DECL.cands) for (const vr of [[0, 0, 0], [0, 0.4, 0.1]]) { const f = geo3OmegaField(cand, { rot, s: 0, vRec: vr }); for (const x of pts) m = Math.max(m, nrm(f(x))); }
    for (const cand of DECL.cands) { const f = geo3OmegaField(cand, { rot: 'cv', s: 0, Wbg: 0.1, vRec: [0, 0.4, 0.1] }); for (const x of pts) ctl = Math.max(ctl, nrm(f(x))); }
    S.zeroRot = m; S.zeroRotCtl = ctl; }
  // ② (Rcv)・W₀ = W_ii = 0 は剛体の回転 u = Ω × x(W は ẑ・P2 は ẑ − ê(ê·ẑ))・一様の Ω の輪の corS・drag90 は 0(丸めの床の内)
  { let w = 0, p2 = 0, pull = 0;
    for (const x of pts) { const e = unit(x); w = Math.max(w, nrm(sub(geo3OmegaField('W', { rot: 'cv' })(x), zh))); p2 = Math.max(p2, nrm(sub(geo3OmegaField('P2', { rot: 'cv' })(x), sub(zh, scl(e, e[2]))))); }
    for (const action of ['corS', 'drag90']) for (const z of [0.01, -0.03]) { const g = GP.gyroRow({ action, q: 1, p: 2, body: 'ring', zOverR: z, r: 3, field: geo3OmegaField('W', { rot: 'cv' }) }); pull = Math.max(pull, Math.abs(g.pull) / g.Fscale); }
    S.rigidW = w; S.rigidP2 = p2; S.rigidPull = pull; }
  // ③ 単一の受け手では W₀ と W_ii は和だけが効く((0.1, 0) と (0, 0.1) の相対の差 —— 同じ実行系では同じビット・丸めの揺らしの内)/変異(W_ii を分母から落とす)は離れる
  { let same = 0, mut = 0;
    for (const rot of ['cv', 'm2']) for (const cand of DECL.cands) { const a = geo3OmegaField(cand, { rot, Wbg: 0.1, vRec: [0, 0.3, 0] }), b = geo3OmegaField(cand, { rot, Wself: 0.1, vRec: [0, 0.3, 0] }), c = geo3OmegaField(cand, { rot, Wself: 0.1, vRec: [0, 0.3, 0], mut: 'noSelfDen' });
      for (const x of pts) { const A = a(x), B = b(x), Cc = c(x); same = Math.max(same, nrm(sub(A, B)) / nrm(B)); mut = Math.max(mut, nrm(sub(Cc, B)) / nrm(B)); } }
    S.sumOnly = same; S.sumOnlyMut = mut; }
  // ④ 〔第348便d〕の場への極限: (Rcv)・p 1・W₀ = D₀・W_ii 0・v_r 無し = 〔第348便d〕の candField(q 0・D₀)(P2 は u だけ —— 丸めの内・W は差分の勾配 —— 1e-8 の内)
  { let mP = 0, mW = 0;
    for (const D0 of [0, 0.1]) for (const x of pts) { const a = geo3OmegaField('P2', { rot: 'cv', p: 1, Wbg: D0 })(x), b = D.candField('P2', { q: 0, D0 })(x), c = geo3OmegaField('W', { rot: 'cv', p: 1, Wbg: D0 })(x), d = D.candField('W', { q: 0, D0 })(x);
      mP = Math.max(mP, nrm(sub(a, b)) / nrm(b)); mW = Math.max(mW, nrm(sub(c, d)) / nrm(d)); }
    S.lim348dP2 = mP; S.lim348dW = mW; }
  // ⑤ 通過の極限: p 1・W₀ = D₀ の輪の傾き = 〔第348便d〕の flyRing(D₀)/W₀ = W_ii = 0 は輪の相対の量 0・自分の重みだけ(W_ii 0.01)で 0 でない
  { const r1 = flyRing3({ Wbg: 0.1, Wself: 0, Rr: 1, inc: 30, p: 1, cands: ['W'] }), d1 = D.flyRing({ D0: 0.1, Rr: 1, inc: 30, cands: ['W'] });
    const r0 = flyRing3({ Wbg: 0, Wself: 0, Rr: 1, inc: 30, cands: ['P2', 'W'] }), rs = flyRing3({ Wbg: 0, Wself: 0.01, Rr: 1, inc: 30, cands: ['W'] });
    S.flyLim = Math.abs(r1.tilt / d1.tilt - 1); S.flyLimW = Math.abs(r1.cand.W.vsRing - d1.cand.W.vsRing);
    S.flyZero = (Math.abs(r0.mean) + r0.tilt + r0.rest + r0.cand.P2.tilt + r0.cand.W.tilt) / (r0.scale + 1e-300); S.flySelf = rs.tilt; }
  // ⑥ (Rm2) の場は第309便a の閉じた式の M2・K2 の点の式どおり(u = M2 s (ẑ × n̂) ÷ (W₀ + W_ii + K2))/遠方で (M2 ÷ K2) d ÷ R² → 2/5
  { const x = [2.5, 0.4, 0.9], d = nrm(x), n = scl(x, 1 / d), F = geo3Field({ sources: [{ m: 1, R: 1, spin: [0, 0, 0.7], r: [0, 0, 0], v: [0, 0, 0] }], rot: 'm2', Wbg: 0.03, Wself: 0.02 });
    const want = scl(crs([0, 0, 0.7], n), IQ.M2(d, 1) / (0.05 + IQ.K2(d, 1))); S.m2Point = nrm(sub(F.u(x), want)) / nrm(want);
    S.m2Far = Math.abs(IQ.M2(1000, 1) / IQ.K2(1000, 1) * 1000 - 0.4); }
  // ⑥′ (Rk1) の場の点の式(重み K1・源の回転の分 M1 = R²/(5d²)・自分の重みの K1 の球)/K1 の内外の値(中心 3/(2R)・表面 1/R・遠方 1/d)/通過は〔第348便d〕の通過(D₀ = W₀ + W_ii)と同じ式
  { const x = [2.5, 0.4, 0.9], d = nrm(x), n = scl(x, 1 / d), c = [2.45, 0.38, 0.93], F = geo3Field({ sources: [{ m: 1, R: 1, spin: [0, 0, 0.7], r: [0, 0, 0], v: [0, 0, 0] }], rot: 'k1', Wbg: 0.03, Wself: 0.02, vRec: [0, 0.2, 0], selfBall: { p: c, R: 0.1 } });
    const ws = 0.02 * (2 * 0.1 / 3) * (3 * 0.01 - dot(sub(x, c), sub(x, c))) / (2 * 0.001), Wt = 0.03 + ws + 1 / d, want = scl(add(scl([0, -0.2, 0], 1 / d), scl(crs([0, 0, 0.7], n), 1 / (5 * d * d))), 1 / Wt);
    S.k1Point = nrm(sub(F.u(x), want)) / nrm(want); S.k1Vals = Math.abs(K1(0, 2) - 0.75) + Math.abs(K1(2, 2) - 0.5) + Math.abs(K1(8, 2) - 0.125);
    const a = flyRing3({ Wbg: 0, Wself: 0.1, Rr: 1, inc: 30, rot: 'k1', cands: ['W'] }), b = D.flyRing({ D0: 0.1, Rr: 1, inc: 30, cands: ['W'] }); S.k1Fly = Math.abs(a.tilt / b.tilt - 1); }
  // ⑦ 変異: 受け手の速度の符号を変えると離れる(W₀ > 0)/(W) の符号の変異で corV の寄せる力の符号が反転
  { const a = geo3OmegaField('W', { rot: 'cv', Wbg: 0.1, vRec: vOrbit(3) }), b = geo3OmegaField('W', { rot: 'cv', Wbg: 0.1, vRec: vOrbit(3), mut: 'vRecSign' });
    S.vRecMut = nrm(sub(a(pts[0]), b(pts[0]))) / nrm(a(pts[0]));
    const fw = geo3OmegaField('W', { rot: 'm2', Wbg: 0.1 }), fm = geo3OmegaField('W', { rot: 'm2', Wbg: 0.1, rotMut: 'wsign' });
    const pa = GP.gyroRow({ action: 'corV', q: 1, p: 2, body: 'ring', zOverR: 0.01, r: 3, field: fw }).pull, pb = GP.gyroRow({ action: 'corV', q: 1, p: 2, body: 'ring', zOverR: 0.01, r: 3, field: fm }).pull;
    S.wsign = { a: pa, b: pb, flipDiff: Math.abs(pa + pb) / Math.abs(pa) }; }
  // ⑧ 差分の勾配と第347便h の解析の勾配(同じ場 —— (Rcv)・p 1・D₀ 0.1 = 第347便h の makeField の q 0)の一致
  { const F3 = geo3Field({ sources: [{ m: 1, R: 1, spin: [0, 0, 1], r: [0, 0, 0], v: [0, 0, 0] }], rot: 'cv', p: 1, Wbg: 0.1 }), FH = H.makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 1], r: [0, 0, 0], v: [0, 0, 0] }], D0: 0.1, p: 1, q: 0 });
    let m = 0, sc = 0; for (const x of pts) { const a = F3.J(x), b = FH.J(x); for (let k = 0; k < 9; k++) { m = Math.max(m, Math.abs(a[k] - b[k])); sc = Math.max(sc, Math.abs(b[k])); } } S.jDiff = m / sc; }
  // ⑨ 入力の拒否
  const rej = [() => geo3OmegaField('X', { rot: 'cv' }), () => geo3OmegaField('W', { rot: 'zz' }), () => geo3OmegaField('W', { rot: 'cv', Wbg: -0.1 }), () => geo3OmegaField('W', { rot: 'cv', Wself: -1 }),
    () => geo3OmegaField('W', { rot: 'm2' })([0.5, 0, 0]), () => geo3OmegaField('W', { rot: 'cv', Rb: 0 })].map((fn) => { try { fn(); return false; } catch (err) { return err instanceof RangeError; } });
  S.rejects = rej;
  return S;
}
export function pureGates(S) {
  return {
    zeroRot: S.zeroRot < 1e-13 && S.zeroRotCtl > 1e-6,
    rigid: S.rigidW < 1e-9 && S.rigidP2 < 1e-12 && S.rigidPull < 1e-9,
    sumOnly: S.sumOnly < 1e-9 && S.sumOnlyMut > 1e-3,
    lim348d: S.lim348dP2 < 1e-12 && S.lim348dW < 1e-8,
    fly: S.flyLim < 1e-12 && S.flyLimW < 1e-9 && S.flyZero < 1e-12 && S.flySelf > 0,
    m2: S.m2Point < 1e-12 && S.m2Far < 1e-5,
    k1: S.k1Point < 1e-12 && S.k1Vals < 1e-15 && S.k1Fly < 1e-12,
    mutants: S.vRecMut > 1e-3 && S.wsign.a !== 0 && S.wsign.flipDiff < 1e-9,
    jacobian: S.jDiff < 1e-8,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

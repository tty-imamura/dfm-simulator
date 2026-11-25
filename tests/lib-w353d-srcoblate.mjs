// 第353便d(原仮定者の回答(2026-11-25 —— 第151報)AN1045「規則の半径」・統括の検証項目 R468):
//   **源(引きずる側)の扁平率を (S)(源の自転の分)に入れる式の候補 (O0)〜(O3) を、第352便k の spinRot と同じ作り(受け手を原点・源は −a r̂ に静止・位相 72・
//   読み (C2) は球の半径の平均)で数える口 —— 診断だけ**(器 tests/exp-w353d-srcoblate.mjs と QA behavior.srcoblate353d・docs.srcoblate353d が読む ——
//   html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot・srcRadius・recvRadius・DECL —— 扁平率 0 で同じ数になることを零試験で見る)・第352便s(ringRot・satParts・cancelRow・uVt・saturnSpin)・
//   第352便c(refAxis)・第352便d(bgVec)・第351便c(pairInput・PARENT_ROWS)・第348便h(rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・第348便c(massOf・radiusOf)・
//   第312便a(Kball・KballDr・Mball・MballDr)・第334便a(LIT334A —— 天体の扁平率 f と赤道半径・衛星の軌道の半径〔文献の値・未照合〕)・第330便a(DECL.lit.J2・J2Ref〔文献の値・未照合〕)・
//   第338便d(centerKm —— 土星の環の区分の中心)・第348便d(DECL.C.centers)・第347便e(t1Table・geometry)。
//
// ■ 場(第348便h の makeField3 と同じ式 —— 源の項だけに扁平の因子を足す。因子が 1・勾配が 0 なら同じ数): 源の項 T_j = s_j(r)(Ω_j × ρ)・重み w_j = m_j K(r)。
//   Q_w = 1 − ε_w (R_q ÷ r)² P2(μ)・Q_s = 1 − ε_s (R_q ÷ r)² P2(μ)(μ = ρ̂·ê_源〔源の自転軸〕・P2 = (3μ² − 1) ÷ 2 —— 外部だけ)。
//   重み w_j → Q_w w_j(分母と相対の速度の項)・回転の分子 s_j → σ Q_s s_j(σ = 回転の分子の倍)。勾配は ∇Q = −ε R_q² r⁻³ [−2 P2 n̂ + 3μ (ê − μ n̂)] を解析で入れる。
// ■ 候補(**どれも「候補」 —— DFM の式として採ったとは書かない**):
//   (O0) 球(対照 = 今の形 —— ε 0・σ 1)/
//   (O1) 源の重みに四重極の項(ε_w = ε_s = J2 —— 係数は J2〔リポジトリの値〕か、扁平率 f から一様な回転楕円体の幾何の J2 = (2f − f²) ÷ 5・σ 1)/
//   (O2) 規則の半径を扁平に(極の半径 = 赤道の半径 × (1 − f) の回転楕円体の (S): 遠い場では幾何の J2 = (2f − f²) ÷ 5 の四重極 + 回転の分子の倍 σ ——
//        (O2a) 赤道の半径 = 規則の半径(σ 1)/(O2b) 体積を保つ(赤道の半径 = 規則の半径 × (1 − f)^(−1/3)・σ = (1 − f)^(−2/3)・R_q = 赤道の半径))/
//   (O3) 源の自転の分の分布を赤道に寄せる形(重みはそのまま・回転の分子だけ —— 寄せの割合 η: 球〔η 0〕と赤道の輪〔η 1 —— 輪の四重極の係数 ½・モーメントの比 5/2〕の混ぜ: ε_s = η ÷ 2・σ = 1 + 1.5 η)。
// ■ 四重極の半径 R_q: 'rule' = 源のモーメントの半径(srcRadius(src, tSrc) —— tSrc 0 なら規則の半径 Y_k M)/'obs' = 観測の赤道半径(LIT334A の R)。
// ■ 言わないこと: 扁平率の効き方が決まったとは書かない。受け手の側の J2 ÷ 慣性モーメントの係数(重力の側の潮汐の列の量)と、源の幾何の扁平率を混ぜない。
//   扁平率・J2 はリポジトリに在る数だけ(文献の値・未照合)—— 無い源(太陽の J2)は「ノブ(値は未照合)」の格子。この場・この候補・この半径では、の表。
import * as K from './lib-w352k-spinform.mjs';
import * as S from './lib-w352s-satring.mjs';
import * as CR from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as DA from './lib-w348d-diskaxis.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';

export const LIB_VERSION = 'w353d-srcoblate-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = K.vec;
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
export const ASYR = K.AS_YR;
const GL = H.gaussLegendre(K.DECL.ballN);

/* ───────── 宣言 ───────── */
const SRC_KEY = Object.freeze({ Sun: 'sun', Mercury: 'mercury', Venus: 'venus', Earth: 'earth', EarthHi: 'earth', EarthLo: 'earth', Mars: 'mars', Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune', Moon: 'moon' });
const J2KEY = Object.freeze({ Mercury: 'mercury', Venus: 'venus', Earth: 'earth', EarthHi: 'earth', EarthLo: 'earth', Mars: 'mars', Jupiter: 'jupiter', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune' });
export const DECL = Object.freeze({
  models: Object.freeze(['O0', 'O1', 'O2a', 'O2b', 'O3']), mainControl: 'O0',
  modelNames: Object.freeze({ O0: '(O0) 球(対照 = 今の形)', O1: '(O1) 源の重みに四重極の項', O2a: '(O2a) 規則の半径を扁平に(赤道の半径 = 規則の半径)', O2b: '(O2b) 規則の半径を扁平に(体積を保つ)', O3: '(O3) 源の自転の分を赤道に寄せる' }),
  /** ノブ(値は未照合)の格子 —— 扁平率 f・J2・寄せの割合 η に同じ格子 */
  knobGrid: Object.freeze([0, 1e-3, 1e-2, 0.1]),
  etaGrid: Object.freeze([0, 0.1, 0.5, 1]),
  rqs: Object.freeze(['rule', 'obs']), rqNames: Object.freeze({ rule: '規則の半径(モーメントの半径と同じ)', obs: '観測の赤道半径' }),
  planets: K.DECL.planets,
  /** 近い場: 実在の組(第351便c の PAIRS16)と、母天体の赤道の円の道に置いた受け手(LIT334A の衛星 —— 公転面 = 母天体の赤道面と置く) */
  nearPairs: Object.freeze(['Io|Jupiter', 'Moon|EarthHi']),
  circMoons: Object.freeze(['io', 'europa', 'ganymede', 'callisto', 'titan']),
  rings: DA.DECL.C.centers,
  /** 点検の数(共通ブリーフ 353 の統括の数え直し 3・第352便s の DECL.anchor) */
  anchor: Object.freeze({ uV: 1.19282e-12, venusPhiRuleDeg: '0.7606', venusResRule: '0.013274', venusPhiCR1Deg: '52.06', venusResCR1: '0.87772', ioNpRes: 0.120, ioEqOverUV: '0.894' }),
  litSrc: '扁平率 f と赤道半径 = 第334便a の lib の LIT334A(文献の値・未照合)・J2 と参照の半径 = 第330便a の lib の DECL.lit(文献の値・未照合)',
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・扁平の項 ÷ 球の項は直接に数える(大きい数の差で作らない)',
});
export const ringR = (key) => RB.centerKm(key) * 1e3;

/* ───────── リポジトリの数(文献の値・未照合)───────── */
/** 源の扁平率 f と観測の赤道半径(LIT334A —— 無い源は null) */
export function litOf(src) {
  const k = SRC_KEY[src], b = k ? LIT334A.bodies.find((x) => x.key === k) : null;
  const jk = J2KEY[src], lit = W330.DECL.lit;
  return { src, f: b ? b.f : null, Req: b ? b.R : null, J2: jk && fin(lit.J2[jk]) ? lit.J2[jk] : null, J2Ref: jk && fin(lit.J2Ref[jk]) ? lit.J2Ref[jk] : null };
}
/** 一様な回転楕円体の幾何の J2(極の半径 = 赤道の半径 × (1 − f))= (a² − c²) ÷ (5 a²) */
export const j2Geo = (f) => (2 * f - f * f) / 5;

/**
 * 候補の仕様(源 1 つ): { model, f, J2, eta, Rq } → { epsW, epsS, sigma, Rq, axisScale }。
 * O1 は J2 を与えればそれを・無ければ f から幾何の J2。O2a・O2b は f から。O3 は η から。
 */
export function obSpec({ model = 'O0', f = 0, J2 = null, eta = 0, Rq = 1 } = {}) {
  if (!DECL.models.includes(model)) throw new RangeError('obSpec: 候補は ' + DECL.models.join('・'));
  if (!(fin(f) && f >= 0 && f < 1)) throw new RangeError('obSpec: 扁平率 0 ≤ f < 1');
  if (!(J2 === null || (fin(J2) && J2 >= 0 && J2 < 1))) throw new RangeError('obSpec: J2 は null か 0〜1');
  if (!(fin(eta) && eta >= 0 && eta <= 1)) throw new RangeError('obSpec: 寄せの割合 0 ≤ η ≤ 1');
  if (!(fin(Rq) && Rq > 0)) throw new RangeError('obSpec: R_q > 0');
  if (model === 'O0') return { model, epsW: 0, epsS: 0, sigma: 1, Rq };
  if (model === 'O1') { const e = J2 === null ? j2Geo(f) : J2; return { model, epsW: e, epsS: e, sigma: 1, Rq }; }
  if (model === 'O2a') { const e = j2Geo(f); return { model, epsW: e, epsS: e, sigma: 1, Rq }; }
  if (model === 'O2b') { const e = j2Geo(f), s = Math.pow(1 - f, -1 / 3); return { model, epsW: e, epsS: e, sigma: s * s, Rq: Rq * s }; }
  return { model, epsW: 0, epsS: eta / 2, sigma: 1 + 1.5 * eta, Rq };
}
/** 四重極の因子 Q = 1 − ε (R_q/r)² P2(μ) と勾配(ρ = 点 − 源・ê = 源の自転軸の単位) */
export function quadQ(eps, Rq, rho, e) {
  if (eps === 0) return { Q: 1, g: [0, 0, 0] };
  const r = nrm(rho), n = scl(rho, 1 / r), mu = dot(n, e), P2 = 0.5 * (3 * mu * mu - 1), a2 = (Rq / r) * (Rq / r);
  const Q = 1 - eps * a2 * P2, c = -eps * a2 / r;
  return { Q, g: scl(add(scl(n, -2 * P2), scl(sub(e, scl(n, mu)), 3 * mu)), c) };
}

/* ───────── 場(第348便h の makeField3 と同じ式 + 源の扁平の因子)───────── */
/**
 * sources: [{ m, R, p, v, spin, ob? }](ob = obSpec の戻り値 —— 省けば球)・recv: { m, R, p, v }・W0・extraW・kernel { kind:'ball', al }・rot { form:'M' } | { form:'q', q }・self。
 * 扁平の因子(ε ≠ 0 か σ ≠ 1)は核 K1(al 1)の外部だけ。戻り値 { u, J, W }(G3.rot3 に渡せる)。
 */
export function makeFieldOb({ sources = [], recv = null, W0 = 0, extraW = 0, kernel = { kind: 'ball', al: 1 }, rot = { form: 'M' }, self = true } = {}) {
  if (!(kernel && kernel.kind === 'ball' && (kernel.al === 1 || kernel.al === 2))) throw new RangeError('makeFieldOb: 核は ball(α 1・2)');
  if (!(rot && (rot.form === 'M' || (rot.form === 'q' && fin(rot.q) && rot.q >= 0)))) throw new RangeError('makeFieldOb: 源の回転の形は M か q');
  for (const s of sources) {
    if (!(fin(s.m) && s.m >= 0 && fin(s.R) && s.R > 0)) throw new RangeError('makeFieldOb: 源(m ≥ 0・R > 0)');
    if (s.ob && (s.ob.epsW !== 0 || s.ob.epsS !== 0 || s.ob.sigma !== 1) && kernel.al !== 1) throw new RangeError('makeFieldOb: 扁平の因子は核 K1 だけ');
  }
  const vr = recv.v;
  const term = (s, x) => {
    const rho = sub(x, s.p), r = nrm(rho), n = r > 0 ? scl(rho, 1 / r) : [0, 0, 0], K0 = D.Kball(kernel.al, r, s.R), dK0 = D.KballDr(kernel.al, r, s.R);
    const ob = s.ob || null, ax = nrm(s.spin) > 0 ? unit(s.spin) : [0, 0, 1];
    if (ob && (ob.epsW !== 0 || ob.epsS !== 0) && !(r > ob.Rq)) throw new RangeError('makeFieldOb: 四重極の因子は R_q の外だけ');
    const qw = ob ? quadQ(ob.epsW, ob.Rq, rho, ax) : { Q: 1, g: [0, 0, 0] }, qs = ob ? quadQ(ob.epsS, ob.Rq, rho, ax) : { Q: 1, g: [0, 0, 0] }, sg = ob ? ob.sigma : 1;
    const w0 = s.m * K0, w = qw.Q * w0, gw = add(scl(n, qw.Q * s.m * dK0), scl(qw.g, w0));
    const c = sub(s.v, vr), Om = s.spin, oxr = crs(Om, rho);
    let sv = 0, gsv = [0, 0, 0];
    if (nrm(Om) > 0) {
      let sv0, sd0;
      if (rot.form === 'M') { const M = D.Mball(kernel.al, r, s.R), dM = D.MballDr(kernel.al, r, s.R); sv0 = s.m * M / r; sd0 = s.m * (dM / r - M / (r * r)); }
      else { const g = Math.pow(s.R / (s.R + r), rot.q), dg = -rot.q * g / (s.R + r); sv0 = w0 * g; sd0 = s.m * dK0 * g + w0 * dg; }
      sv = sg * qs.Q * sv0; gsv = scl(add(scl(n, qs.Q * sd0), scl(qs.g, sv0)), sg);
    }
    const P = add(scl(c, w), scl(oxr, sv)), Ex = [0, -Om[2], Om[1], Om[2], 0, -Om[0], -Om[1], Om[0], 0], dP = new Array(9);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) dP[3 * a + b] = c[a] * gw[b] + gsv[b] * oxr[a] + sv * Ex[3 * a + b];
    return { w, gw, P, dP };
  };
  const selfAt = (x, selfR) => {
    if (!self) return { w: 0, gw: [0, 0, 0] };
    if (fin(selfR)) return { w: recv.m * D.Kball(kernel.al, selfR, recv.R), gw: [0, 0, 0] };
    const rho = sub(x, recv.p), r = nrm(rho), n = r > 0 ? scl(rho, 1 / r) : [0, 0, 0];
    return { w: recv.m * D.Kball(kernel.al, r, recv.R), gw: scl(n, recv.m * D.KballDr(kernel.al, r, recv.R)) };
  };
  const eval0 = (x, selfR, grad) => {
    const sf = selfAt(x, selfR); let W = W0 + extraW + sf.w, Pv = [0, 0, 0], dW = sf.gw.slice(); const dP = new Array(9).fill(0);
    for (const s of sources) { const T = term(s, x); W += T.w; Pv = add(Pv, T.P); if (grad) { for (let k = 0; k < 9; k++) dP[k] += T.dP[k]; dW = add(dW, T.gw); } }
    return { W, Pv, dP, dW };
  };
  const u = (x) => { const e = eval0(x, null, false); return e.W > 0 ? scl(e.Pv, 1 / e.W) : [0, 0, 0]; };
  const J = (x, o = {}) => {
    const e = eval0(x, o.selfR, true); if (!(e.W > 0)) return new Array(9).fill(0);
    const uu = scl(e.Pv, 1 / e.W), out = new Array(9);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) out[3 * a + b] = (e.dP[3 * a + b] - uu[a] * e.dW[b]) / e.W;
    return out;
  };
  return { u, J, W: (x) => eval0(x, null, false).W };
}

/* ───────── 約束の口 ───────── */
/** 源の扁平の仕様を、源の名と候補から作る(f・J2 の 'lit' はリポジトリの数 —— 無ければ RangeError)。rq: 'rule'(モーメントの半径)/'obs'(観測の赤道半径) */
export function specFor(src, { model = 'O0', f = 0, J2 = null, eta = 0, rq = 'rule', tSrc = 0 } = {}) {
  if (!DECL.rqs.includes(rq)) throw new RangeError('specFor: R_q は rule・obs');
  const L = litOf(src);
  const fv = f === 'lit' ? L.f : f, jv = J2 === 'lit' ? L.J2 : J2;
  if (f === 'lit' && fv === null) throw new RangeError('specFor: リポジトリに扁平率の無い源 ' + src);
  if (J2 === 'lit' && jv === null) throw new RangeError('specFor: リポジトリに J2 の無い源 ' + src);
  const Rq = rq === 'rule' ? K.srcRadius(src, tSrc) : (L.Req !== null ? L.Req : C.radiusOf(src === 'EarthHi' || src === 'EarthLo' ? 'Earth' : src));
  return obSpec({ model, f: fv, J2: jv, eta, Rq });
}
/**
 * 由来 1 つの成分の回転(1 公転の平均・rad/s)—— 第352便k の spinRot と同じ作り・同じ引数 + ob(specFor の戻り値か、その引数のオブジェクト)。
 * ob 省略・(O0)・扁平率 0 では spinRot と同じ数(零試験 —— 相対 1e-12)。戻り値は spinRot と同じ形 + spec。
 */
export function obRot(T1, GEO, id, src, { part = 'S', form = 'M1', tSrc = 0, cR = null, read = 'C2', extraW = 0, k = 1, nPhase = K.DECL.nPhase, ob = null } = {}) {
  const sc = part === 'M' ? [1, 0] : part === 'S' ? [0, 1] : part === 'MS' ? [1, 1] : null;
  if (!sc) throw new RangeError('obRot: 成分は M・S・MS');
  const F = typeof form === 'string' ? K.formOf(form) : form;
  if (!K.DECL.reads.includes(read)) throw new RangeError('obRot: 読みは C2・W');
  if (!(fin(k) && k >= 0)) throw new RangeError('obRot: 換算の係数 k ≥ 0');
  const spec = ob === null ? null : ('epsW' in ob ? ob : specFor(src, { tSrc, ...ob }));
  const P = SP.pairInput(T1, GEO, id, src), Rr = K.recvRadius(id, cR), Rs = K.srcRadius(src, tSrc);
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(P.nHat, Math.abs(P.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(P.nHat, x);
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * sc[1]), kernel = { kind: 'ball', al: F.al }, rot = F.form === 'M' ? { form: 'M' } : { form: 'q', q: F.q };
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = makeFieldOb({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin, ob: spec }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * sc[0]) }, W0: 0, extraW, kernel, rot, self: true });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om: k === 1 ? Om : scl(Om, k), a: P.a, Rs, Rr, A0: P.m * D.Kball(F.al, 0, Rr), wS: P.Ms * D.Kball(F.al, P.a, Rs), sAx: P.sAx, ws: P.ws, sHat: P.sHat, nHat: P.nHat, spec };
}
/**
 * 円の道の受け手の平均(第352便s の ringRot と同じ作り —— 受け手の速度 0 の (S)・受け手の半径は規則の半径 Y_k m)+ 源の扁平の仕様 ob(obSpec の戻り値)。
 * o: { Ms, Rs, spinVec, L(道の法線), r, N, read, extraW, m, ob }。ob null では ringRot(part 'S')と同じ数(零試験)。
 */
export function circRot({ Ms, Rs, spinVec, L, r, N = S.DECL.ringN, read = 'C2', extraW = 0, m = 1e3, ob = null }) {
  if (!(fin(r) && r > 0 && fin(Ms) && Ms > 0 && fin(Rs) && Rs > 0)) throw new RangeError('circRot: r・M・R > 0');
  const l = unit(L), [x, y] = RJ.ringBasis(l), Rr = G3.YK * m; // 第352便s の ringRot と同じ基底(第351便j の ringBasis)
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < N; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph)));
      const f = makeFieldOb({ sources: [{ m: Ms, R: Rs, p: scl(rh, -r), v: [0, 0, 0], spin: spinVec, ob }], recv: { m, R: Ri, p: [0, 0, 0], v: [0, 0, 0] }, W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / N));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om, A0: m * D.Kball(1, 0, Rr), wS: Ms * D.Kball(1, r, Rs) };
}

/**
 * 衛星の組 key の由来(第352便s の satParts と同じ作り)+ 母天体の扁平 obPar・太陽の扁平 obSun(specFor の引数か戻り値・null は球)。
 * 返す { sun, parent, sHat, nHat }(rad/s)。両方 null で satParts と同じ数(零試験)。
 */
export function obSatParts(T1, GEO, key, { tSrc = 0, part = 'S', read = 'C2', obPar = null, obSun = null } = {}) {
  const [id, src] = key.split('|'), sunKey = SP.PARENT_ROWS[key];
  if (!sunKey) throw new RangeError('obSatParts: 衛星の組 ' + key);
  const [sid, ssrc] = sunKey.split('|');
  const wSun = K.spinRot(T1, GEO, sid, ssrc, { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS, wPar = K.spinRot(T1, GEO, id, src, { part: 'M', read: 'W', tSrc, nPhase: 1 }).wS;
  const sun = obRot(T1, GEO, sid, ssrc, { part, tSrc, read, extraW: wPar, ob: obSun }).Om, par = obRot(T1, GEO, id, src, { part, tSrc, read, extraW: wSun, ob: obPar });
  return { key, sun, parent: par.Om, sHat: unit(par.sHat), nHat: unit(par.nHat) };
}
/**
 * 打ち消し(第352便s の cancelRow と同じ式 —— 局所の (S) と背景)+ 扁平。key 'Venus|Sun' は太陽由来だけ(ob = obSun)。
 * 返す { uV, uEq, eqOverUV, resEq(大きさが同じ倍率での残り), resMin, resAtUV(倍率 = 球の (uV) での残り —— 共通ブリーフ 353 のイオの「残り 0.120」), cosLocBg, phiDeg(−局所と背景の向きの角)}。uV は球の (uV)(t・c_R —— 金星の球の (S) と大きさが同じ倍率)を使う(扁平で物差しを動かさない)。
 */
export function obCancel(T1, GEO, key, { tSrc = 0, bg = 'Np', axis = 'L', part = 'S', cR = null, obPar = null, obSun = null } = {}) {
  let loc;
  if (key.endsWith('|Sun')) { const [id] = key.split('|'); loc = obRot(T1, GEO, id, 'Sun', { part, tSrc, cR, ob: obSun }).Om; }
  else { const P = obSatParts(T1, GEO, key, { tSrc, part, obPar, obSun }); loc = add(P.sun, P.parent); }
  const b1 = S.bgOf(T1, GEO, bg, axis, 1), uV = cR === null ? S.uVt(T1, GEO, tSrc) : nrm(K.spinRot(T1, GEO, 'Venus', 'Sun', { part: 'S', tSrc, cR }).Om) / nrm(PS.bgVec('Gm', { u: 1 })), uEq = nrm(loc) / nrm(b1), uMin = S.uForMin(b1, loc);
  const resEq = nrm(add(scl(b1, uEq), loc)) / (uEq * nrm(b1)), resMin = nrm(add(scl(b1, uMin), loc)) / nrm(loc), cosLB = dot(unit(loc), unit(b1));
  const phiDeg = Math.atan2(nrm(crs(scl(loc, -1), b1)), dot(scl(loc, -1), b1)) / D2R, resAtUV = nrm(add(scl(b1, uV), loc)) / (uV * nrm(b1));
  return { key, tSrc, bg, axis, uV, uEq, eqOverUV: uEq / uV, resEq, resMin, resAtUV, cosLocBg: cosLB, phiDeg, loc };
}
/** 扁平の項 ÷ 球の項(直接に数える: abs(Ω_扁平 − Ω_球) ÷ abs(Ω_球))と向きの変化(°) */
export function obRatio(Om1, Om0) { return { ratio: rel(Om1, Om0), dirDeg: Math.atan2(nrm(crs(Om1, Om0)), dot(Om1, Om0)) / D2R }; }

/* ───────── 表(T2〜T4)───────── */
/** 一次の係数: 四重極の項 ÷ 球の項 = c_lin × ε × (R_q ÷ a)²・向きの変化(°)= d_lin × ε × (R_q ÷ a)²。ε (R_q/a)² = AMP で数えて割る(差の丸めを避ける —— 一次の比例は零試験 ⑦)。 */
export const AMP = 1e-6;
const ampSpec = (model, a) => { const Rq = 0.1 * a, e = AMP / 0.01; return model === 'O3' ? { model: 'O3x', epsW: 0, epsS: e, sigma: 1, Rq } : { model: 'O1x', epsW: e, epsS: e, sigma: 1, Rq }; };
/** 受け手の行の素: 実在の組(obRot)か円の道(circRot)。fn(ob) → Om */
function linOf(fn, a, model = 'O1') { const O0 = fn(null), r = obRatio(fn(ampSpec(model, a)), O0); return { cLin: r.ratio / AMP, dLin: r.dirDeg / AMP, O0 }; }
/** 源の数: 規則の半径・観測の赤道半径・扁平率 f・J2(リポジトリの数 —— 無ければ null) */
export function srcRow(src) { const L = litOf(src); return { src, Rrule: K.srcRadius(src, 0), Req: L.Req, ruleOverObs: K.srcRadius(src, 0) / L.Req, f: L.f, J2: L.J2, j2Geo: L.f === null ? null : j2Geo(L.f) }; }
/**
 * 受け手の 1 行(源 src・距離 a・fn): c_lin(重みと回転の分子の四重極 —— (O1) の形)・c_lin3(回転の分子だけ —— (O3) の形)・(R_q/a)²(規則・観測)・
 * 四重極の項 ÷ 球の項(O1 の J2 = リポジトリの J2/幾何の J2〔f〕/ノブ 0.1 × 規則・観測)・(O2b) の σ − 1(f)・向きの変化。
 */
function recvRow(base, src, a, fn) {
  const sr = srcRow(src), l1 = linOf(fn, a, 'O1'), l3 = linOf(fn, a, 'O3'), x2 = { rule: (sr.Rrule / a) ** 2, obs: (sr.Req / a) ** 2 };
  const q = (eps, rq) => (eps === null ? null : l1.cLin * eps * x2[rq]);
  const sig = (f) => (f === null ? null : Math.pow(1 - f, -2 / 3) - 1);
  return { ...base, src, a, cLin: l1.cLin, dLin: l1.dLin, cLin3: l3.cLin, x2rule: x2.rule, x2obs: x2.obs,
    quad: { J2obs: q(sr.J2, 'obs'), J2rule: q(sr.J2, 'rule'), geoObs: q(sr.j2Geo, 'obs'), geoRule: q(sr.j2Geo, 'rule'), k01obs: q(0.1, 'obs'), k01rule: q(0.1, 'rule') },
    dirDeg: { J2obs: sr.J2 === null ? null : l1.dLin * sr.J2 * x2.obs, geoObs: sr.j2Geo === null ? null : l1.dLin * sr.j2Geo * x2.obs, k01obs: l1.dLin * 0.1 * x2.obs },
    sigma: { lit: sig(sr.f), k01: sig(0.1) }, magAsYr: nrm(l1.O0) * ASYR };
}
/** 表 1(遠い場 —— 太陽 → 8 惑星)。太陽の J2 はリポジトリに無い —— ノブ 0.1 と幾何の J2(f 9e-6)の列 */
export function farRows(T1 = E.t1Table(), GEO = E.geometry()) {
  return DECL.planets.map((id) => { const a = SP.pairInput(T1, GEO, id, 'Sun').a; return recvRow({ id, kind: 'pair' }, 'Sun', a, (ob) => obRot(T1, GEO, id, 'Sun', { ob }).Om); });
}
/** 表 2(近い場): 実在の組(イオ ← 木星・月 ← 地球)と円の道(ガリレオ衛星 4・タイタン —— LIT334A の軌道の半径・公転面 = 母天体の赤道面)と土星の環 5 区分 */
export function nearRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const key of DECL.nearPairs) { const [id, src] = key.split('|'), a = SP.pairInput(T1, GEO, id, src).a; out.push(recvRow({ id: key, kind: 'pair' }, src, a, (ob) => obRot(T1, GEO, id, src, { ob }).Om)); }
  const host = { jupiter: 'Jupiter', saturn: 'Saturn' }, spinOf = (src) => { const r2 = T1.find((r) => r.id === src && r.src === 'Sun' && r.mag === 'm2'), ax = unit(GEO[src + '|Sun'].w); return { ax, vec: scl(ax, Math.abs(r2.omega)) }; };
  const wSunOf = (src) => K.spinRot(T1, GEO, src, 'Sun', { part: 'M', read: 'W', nPhase: 1 }).wS;
  for (const mk of DECL.circMoons) {
    const M = LIT334A.moons.find((x) => x.key === mk), src = host[M.host], sp = spinOf(src), Ms = C.massOf(src), Rs = K.srcRadius(src, 0), ex = wSunOf(src);
    out.push(recvRow({ id: mk, kind: 'circ', name: M.name }, src, M.a, (ob) => circRot({ Ms, Rs, spinVec: sp.vec, L: sp.ax, r: M.a, m: M.m, extraW: ex, ob }).Om));
  }
  { const src = 'Saturn', sp = spinOf(src), Ms = C.massOf(src), Rs = K.srcRadius(src, 0), ex = wSunOf(src);
    for (const rk of DECL.rings) { const r = ringR(rk); out.push(recvRow({ id: rk, kind: 'ring' }, src, r, (ob) => circRot({ Ms, Rs, spinVec: sp.vec, L: sp.ax, r, extraW: ex, ob }).Om)); } }
  return out;
}
/** 打ち消しの候補の列(源ごとの扁平の仕様 —— obSun・obPar の引数) */
export const CANCEL_COLS = Object.freeze([
  Object.freeze({ id: 'O0', label: '(O0) 球(対照)', sun: null, par: null }),
  Object.freeze({ id: 'O1litObs', label: '(O1) J2 = リポジトリの値・観測の赤道半径', sun: null, par: { model: 'O1', J2: 'lit', rq: 'obs' } }),
  Object.freeze({ id: 'O1k01Obs', label: '(O1) J2 = 0.1(ノブ)・観測の赤道半径', sun: { model: 'O1', J2: 0.1, rq: 'obs' }, par: { model: 'O1', J2: 0.1, rq: 'obs' } }),
  Object.freeze({ id: 'O1k01Rule', label: '(O1) J2 = 0.1(ノブ)・規則の半径', sun: { model: 'O1', J2: 0.1, rq: 'rule' }, par: { model: 'O1', J2: 0.1, rq: 'rule' } }),
  Object.freeze({ id: 'O2bLitRule', label: '(O2b) f = リポジトリの値(太陽 9e-6・木星 0.0649)・規則の半径', sun: { model: 'O2b', f: 'lit', rq: 'rule' }, par: { model: 'O2b', f: 'lit', rq: 'rule' } }),
  Object.freeze({ id: 'O2bLitObs', label: '(O2b) f = リポジトリの値・観測の赤道半径', sun: { model: 'O2b', f: 'lit', rq: 'obs' }, par: { model: 'O2b', f: 'lit', rq: 'obs' } }),
  Object.freeze({ id: 'O2bK01Par', label: '(O2b) f = 0.1(ノブ)を母天体だけ・規則の半径', sun: null, par: { model: 'O2b', f: 0.1, rq: 'rule' } }),
  Object.freeze({ id: 'O3e01Par', label: '(O3) η = 0.1(ノブ)を母天体だけ・規則の半径', sun: null, par: { model: 'O3', eta: 0.1, rq: 'rule' } }),
  Object.freeze({ id: 'O3e1Both', label: '(O3) η = 1(ノブ)を全部の源に・規則の半径', sun: { model: 'O3', eta: 1, rq: 'rule' }, par: { model: 'O3', eta: 1, rq: 'rule' } }),
]);
/**
 * 表 3(金星とイオの打ち消し —— (N+)・基準軸 L): 列ごとに、金星(太陽の扁平 = sun)の φ・等大の残り・(uV) での残り と、
 * イオ(母天体の扁平 = par・太陽の扁平 = sun)の x = 等大の倍率 ÷ 金星の条件の倍率(金星の側も同じ太陽の扁平で数え直す)・等大の残り・金星の条件での残り。
 */
export function cancelRows(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L' } = {}) {
  return CANCEL_COLS.map((c) => {
    const v = obCancel(T1, GEO, 'Venus|Sun', { axis, obSun: c.sun }), io = obCancel(T1, GEO, 'Io|Jupiter', { axis, obSun: c.sun, obPar: c.par });
    const b1 = nrm(S.bgOf(T1, GEO, 'Np', axis, 1)), uVob = nrm(v.loc) / b1, resIoAtV = nrm(add(scl(unit(S.bgOf(T1, GEO, 'Np', axis, 1)), uVob * b1), io.loc)) / (uVob * b1);
    return { id: c.id, label: c.label, venus: { phiDeg: v.phiDeg, resEq: v.resEq, resAtUV: v.resAtUV, overUV: v.eqOverUV }, io: { phiDeg: io.phiDeg, xSph: io.eqOverUV, x: io.uEq / uVob, resEq: io.resEq, resAtVenus: resIoAtV } };
  });
}
/**
 * 表 3b(範囲): イオの母天体由来 (S) だけを倍 m(σ の形 —— 向きは変えない)にしたとき、金星の条件(球)での残りが球の値以下に留まる m の範囲と、残りが最小の m。
 * その m を (O2b) の f(σ = (1 − f)^(−2/3))・(O3) の η(σ = 1 + 1.5 η —— 四重極の分を除く)に読み替える。
 */
export function ioRange(T1 = E.t1Table(), GEO = E.geometry(), { axis = 'L', lo = 0.5, hi = 2, n = 301 } = {}) {
  const base = obCancel(T1, GEO, 'Io|Jupiter', { axis }), res0 = base.resAtUV, pts = [];
  for (let i = 0; i < n; i++) { const m = lo + (hi - lo) * i / (n - 1), c = obCancel(T1, GEO, 'Io|Jupiter', { axis, obPar: { model: 'O1x', epsW: 0, epsS: 0, sigma: m, Rq: 1 } }); pts.push({ m, res: c.resAtUV }); }
  const inside = pts.filter((p) => p.res <= res0 * (1 + 1e-12)), best = pts.reduce((b, p) => (p.res < b.res ? p : b), pts[0]);
  const fOf = (m) => (m >= 1 ? 1 - Math.pow(m, -1.5) : null), etaOf = (m) => (m >= 1 ? (m - 1) / 1.5 : null);
  const mLo = Math.min(...inside.map((p) => p.m)), mHi = Math.max(...inside.map((p) => p.m));
  return { res0, mLo, mHi, mBest: best.m, resBest: best.res, mPred: 1 / base.eqOverUV, f: { lo: fOf(Math.max(1, mLo)), hi: fOf(mHi), best: fOf(best.m) }, eta: { lo: etaOf(Math.max(1, mLo)), hi: etaOf(mHi), best: etaOf(best.m) },
    jupF: litOf('Jupiter').f, jupSigma: Math.pow(1 - litOf('Jupiter').f, -2 / 3), quadIoJ2: null, step: (hi - lo) / (n - 1), n };
}
/** 表 4(四重極の項の半径): 源 4 つの規則の半径と観測の赤道半径・その比、代表の受け手での (R_q/a)² と項(J2 = リポジトリの値か幾何の J2) */
export const T4_ROWS = Object.freeze([['Sun', 'Venus'], ['Sun', 'Earth'], ['Jupiter', 'Io|Jupiter'], ['Earth', 'Moon|EarthHi'], ['Saturn', 'ringB']]);
export function radiusRows(far, near) {
  return T4_ROWS.map(([src, at]) => { const r = far.find((x) => x.id === at) || near.find((x) => x.id === at), sr = srcRow(src), eps = sr.J2 !== null ? sr.J2 : sr.j2Geo;
    return { src, at, Rrule: sr.Rrule, Req: sr.Req, ruleOverObs: sr.ruleOverObs, eps, epsKind: sr.J2 !== null ? 'J2' : 'j2Geo', x2rule: r.x2rule, x2obs: r.x2obs, termRule: r.cLin * eps * r.x2rule, termObs: r.cLin * eps * r.x2obs, cLin: r.cLin }; });
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  // ① ob なし・(O0)・扁平率 0 の (O1)(O2a)(O2b)・η 0 の (O3) で spinRot と同じ(8 惑星 + 衛星 2 組・(C2)(W)・成分 3 つ)
  let vsSpin = 0, zeroOb = 0;
  const pairs = [...DECL.planets.map((p) => [p, 'Sun']), ['Moon', 'EarthHi'], ['Io', 'Jupiter']];
  for (const [id, src] of pairs) for (const read of ['C2', 'W']) for (const part of ['S', 'M', 'MS']) {
    const b = K.spinRot(T1, GEO, id, src, { part, read }).Om;
    vsSpin = Math.max(vsSpin, rel(obRot(T1, GEO, id, src, { part, read }).Om, b), rel(obRot(T1, GEO, id, src, { part, read, ob: { model: 'O0' } }).Om, b));
    if (read === 'C2' && part === 'S') for (const model of ['O1', 'O2a', 'O2b', 'O3']) for (const rq of DECL.rqs) zeroOb = Math.max(zeroOb, rel(obRot(T1, GEO, id, src, { part, read, ob: { model, f: 0, eta: 0, rq } }).Om, b));
  }
  // ② 観測の半径の置き方・受け手の半径 c_R でも (O0) = spinRot
  const vsT = Math.max(rel(obRot(T1, GEO, 'Venus', 'Sun', { tSrc: 1, ob: { model: 'O0' } }).Om, K.spinRot(T1, GEO, 'Venus', 'Sun', { tSrc: 1 }).Om),
    rel(obRot(T1, GEO, 'Venus', 'Sun', { cR: 1 }).Om, K.spinRot(T1, GEO, 'Venus', 'Sun', { cR: 1 }).Om));
  // ③ 円の道の受け手: ob null で第352便s の ringRot と同じ(土星の環 B・木星の赤道の円)
  const sp = S.saturnSpin(T1, GEO), Ms = C.massOf('Saturn'), Rs = K.srcRadius('Saturn', 0), rB = ringR('ringB');
  const vsRing = rel(circRot({ Ms, Rs, spinVec: sp.vec, L: sp.ax, r: rB }).Om, S.ringRot({ Ms, Rs, spinVec: sp.vec, L: sp.ax, r: rB, part: 'S' }).Om);
  // ④ 衛星の組と打ち消し: 扁平なしで第352便s の satParts・cancelRow と同じ
  const p0 = obSatParts(T1, GEO, 'Io|Jupiter'), s0 = S.satParts(T1, GEO, 'Io|Jupiter', {});
  const vsSat = Math.max(rel(p0.sun, s0.sun), rel(p0.parent, s0.parent));
  const c0 = obCancel(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'L' }), cs = S.cancelRow(T1, GEO, 'Io|Jupiter', { bg: 'Np', axis: 'L' });
  const vsCancel = Math.max(Math.abs(c0.resEq / cs.resEq - 1), Math.abs(c0.eqOverUV / cs.eqOverUV - 1), Math.abs(c0.resMin / cs.resMin - 1), Math.abs(c0.resAtUV / cs.resAtUV - 1));
  // ⑤ 統括の数え直し 3: 金星(規則の半径・c_R null と 1)の φ と等大の残り・(uV)
  const vR = obCancel(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'L' }), v1 = obCancel(T1, GEO, 'Venus|Sun', { bg: 'Np', axis: 'L', cR: 1 });
  const uV = nrm(obRot(T1, GEO, 'Venus', 'Sun', {}).Om) / K.DECL.omegaG;
  // ⑥ 解析の勾配と差分の照合(強い扁平 ε 0.1・R_q/r 0.5 —— 中心差分の u の回転)
  const ob = obSpec({ model: 'O1', J2: 0.1, Rq: 1 }), fld = makeFieldOb({ sources: [{ m: 1, R: 0.3, p: [-1.6, 0.4, 0.7], v: [0.1, 0, 0], spin: [0.2, 0.3, 1], ob }], recv: { m: 3, R: 0.2, p: [0, 0, 0], v: [0, 0.05, 0] }, W0: 0.5, self: false });
  const Wa = G3.rot3('W', fld, [0.05, -0.02, 0.01], { Rb: 0.1 }), h = 1e-5, xc = [0.05, -0.02, 0.01];
  const du = (i) => { const e = [0, 0, 0]; e[i] = h; return scl(sub(fld.u(add(xc, e)), fld.u(sub(xc, e))), 1 / (2 * h)); };
  const Jn = [du(0), du(1), du(2)], Wn = [0.5 * (Jn[1][2] - Jn[2][1]), 0.5 * (Jn[2][0] - Jn[0][2]), 0.5 * (Jn[0][1] - Jn[1][0])];
  const fd = rel(Wa, Wn);
  // ⑦ 一次の比例: 扁平の項は ε に比例(ε を 2 倍 → 差が 2 倍 —— 相対 1e-6)・(R_q ÷ r)² に比例(R_q を 2 倍 → 4 倍)
  const base = obRot(T1, GEO, 'Earth', 'Sun', { tSrc: 1 }).Om;
  const dOf = (o) => nrm(sub(obRot(T1, GEO, 'Earth', 'Sun', { tSrc: 1, ob: o }).Om, base));
  const Rsun = litOf('Sun').Req;
  const d1 = dOf(obSpec({ model: 'O1', J2: 1e-3, Rq: Rsun })), d2 = dOf(obSpec({ model: 'O1', J2: 2e-3, Rq: Rsun })), d4 = dOf(obSpec({ model: 'O1', J2: 1e-3, Rq: 2 * Rsun }));
  const lin = { eps: Math.abs(d2 / d1 / 2 - 1), rq: Math.abs(d4 / d1 / 4 - 1) };
  // ⑧ 候補の恒等: (O2a)(f)= (O1)(J2 = 幾何の J2)・(O2b) の σ = (1 − f)^(−2/3)・(O3)(η 1)の ε_s = ½・σ = 5/2
  const f = 0.05, a = obSpec({ model: 'O2a', f, Rq: 2 }), b1 = obSpec({ model: 'O1', J2: j2Geo(f), Rq: 2 }), b = obSpec({ model: 'O2b', f, Rq: 2 }), o3 = obSpec({ model: 'O3', eta: 1, Rq: 2 });
  const ident = a.epsW === b1.epsW && a.epsS === b1.epsS && a.sigma === 1 && Math.abs(b.sigma / Math.pow(1 - f, -2 / 3) - 1) < 1e-15 && o3.epsS === 0.5 && o3.sigma === 2.5 && o3.epsW === 0;
  // ⑨ リポジトリの数: LIT334A と第330便a の値と同じ・太陽の J2 は無い(null)
  const lit = { sunF: litOf('Sun').f === 9e-6, jupF: litOf('Jupiter').f === 0.06487, jupJ2: litOf('Jupiter').J2 === W330.DECL.lit.J2.jupiter, sunJ2: litOf('Sun').J2 === null, earthHi: litOf('EarthHi').f === litOf('Earth').f };
  // ⑩ 一次の係数の照合: イオの実在の組(obRot)と赤道の円の道(circRot)で c_lin が同じ(相対 1e-4)・赤道の円の道の c_lin が 1.5(相対 1e-5)・
  //    一次の予測(c_lin × J2 × (R_eq/a)²)と、扁平の項を直接に数えた値(イオ・木星の J2・観測の赤道半径)が相対 1e-2 で同じ(二次の分は J2 (R/a)² の桁)
  const aIo = SP.pairInput(T1, GEO, 'Io', 'Jupiter').a, spJ = (() => { const r2 = T1.find((r) => r.id === 'Jupiter' && r.src === 'Sun' && r.mag === 'm2'), ax = unit(GEO['Jupiter|Sun'].w); return { ax, vec: scl(ax, Math.abs(r2.omega)) }; })();
  const fPair = (o) => obRot(T1, GEO, 'Io', 'Jupiter', { ob: o }).Om, fCirc = (o) => circRot({ Ms: C.massOf('Jupiter'), Rs: K.srcRadius('Jupiter', 0), spinVec: spJ.vec, L: spJ.ax, r: aIo, m: C.massOf('Io'), ob: o }).Om;
  const lp = linOf(fPair, aIo), lc = linOf(fCirc, aIo), spIo = specFor('Jupiter', { model: 'O1', J2: 'lit', rq: 'obs' }), direct = obRatio(fPair(spIo), fPair(null)).ratio, pred = lp.cLin * spIo.epsW * (spIo.Rq / aIo) ** 2;
  const linChk = { circVsPair: Math.abs(lc.cLin / lp.cLin - 1), eq15: Math.abs(lc.cLin / 1.5 - 1), direct: Math.abs(direct / pred - 1) };
  // ⑪ 拒否
  const rejects = [() => obSpec({ model: 'O9' }), () => obSpec({ f: 1 }), () => obSpec({ eta: 2 }), () => obSpec({ J2: -1 }), () => specFor('Sun', { J2: 'lit' }), () => specFor('Sun', { rq: 'x' }),
    () => obRot(T1, GEO, 'Earth', 'Sun', { part: 'X' }), () => makeFieldOb({ sources: [{ m: 1, R: 1, p: [2, 0, 0], v: [0, 0, 0], spin: [0, 0, 1], ob: obSpec({ model: 'O1', J2: 0.1 }) }], recv: { m: 1, R: 1, p: [0, 0, 0], v: [0, 0, 0] }, kernel: { kind: 'ball', al: 2 } })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsSpin, zeroOb, vsT, vsRing, vsSat, vsCancel, venus: { phiRule: vR.phiDeg, resRule: vR.resEq, phiCR1: v1.phiDeg, resCR1: v1.resEq, ioRes: c0.resAtUV, ioEq: c0.eqOverUV }, uV, fd, lin, ident, lit, linChk, rejects };
}
export function pureGates(Sx) {
  const A = DECL.anchor;
  return {
    vsSpinRot: Sx.vsSpin < 1e-12 && Sx.zeroOb < 1e-12 && Sx.vsT < 1e-12,
    vsRingSat: Sx.vsRing < 1e-12 && Sx.vsSat < 1e-12 && Sx.vsCancel < 1e-12,
    anchor3: Sx.venus.phiRule.toFixed(4) === A.venusPhiRuleDeg && Sx.venus.resRule.toFixed(6) === A.venusResRule && Sx.venus.phiCR1.toFixed(2) === A.venusPhiCR1Deg
      && Sx.venus.resCR1.toFixed(5) === A.venusResCR1 && Sx.venus.ioRes.toFixed(3) === A.ioNpRes.toFixed(3) && Sx.venus.ioEq.toFixed(3) === A.ioEqOverUV && Math.abs(Sx.uV / A.uV - 1) < 5e-6,
    gradFD: Sx.fd < 1e-6,
    linear: Sx.lin.eps < 1e-4 && Sx.lin.rq < 1e-4,
    identities: Sx.ident === true,
    litValues: Object.values(Sx.lit).every(Boolean),
    linCoeff: Sx.linChk.circVsPair < 1e-4 && Sx.linChk.eq15 < 1e-5 && Sx.linChk.direct < 1e-2,
    rejects: Sx.rejects.length === 8 && Sx.rejects.every(Boolean),
  };
}

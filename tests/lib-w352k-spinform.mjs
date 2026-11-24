// 第352便k(原仮定者の回答(2026-11-24 —— 第148報)AN1015・AN1019・原仮定者の回答(2026-11-24 —— 第147報)AN1000・統括の検証項目 R448):
//   **太陽の自転の分 (S) を、源の回転の形のノブ(第348便h の makeField3 の rot の形 —— 球のモーメント M〔核 K1・K2〕と落ち方 q の全部)と、源の半径の置き方
//   (規則の半径 Y_k M_源/観測の半径/その間の幾何の倍)と、受け手の半径の置き方(規則の半径/観測の半径 × c_R)で数える口 —— 診断だけ**
//   (器 tests/exp-w352k-spinform.mjs と QA behavior.spinform352k・docs.spinform352k が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・第348便c(massOf・radiusOf)・第347便e(t1Table・geometry)・
//   第312便a(Kball・Mball)・第337便c(定数)・第350便e(UDECL の銀河の公転の角速度)・第351便c(pairInput・partRot・closedSEq —— 既定の引数で一致することを零試験で見る)。
//
// ■ 口 spinRot(T1, GEO, id, src, { part, form, q, al, tSrc, cR, read, extraW, k }) —— 第351便c の partRot と同じ作り(受け手を原点・源は −a r̂ に静止・受け手が +v_orb v̂ で動く・位相 72・
//   読み (C2) は球の半径の平均〔GL 8 点・equivR〕/(W) は中心の渦度の半分)。**既定の引数(part 'S'・form 'M'・al 1・tSrc 0・cR null)では partRot(..., { part: 'S' }) と同じ(相対の差 < 1e-12 —— 同じ式の順)。**
//   - form 'M' = 球のモーメント(在位の形 —— 源の外で R² ÷ (5 r²)〔K1〕)/form 'q' = 落ち方 (R ÷ (R + r))^q(q 0 = 源の枠の剛体の回転 —— 落ちない形)。al = 重みの核(1 在位・2 比べる列)。
//   - tSrc = 源の半径の置き方: R_源 = R_規則^(1 − t) × R_観測^t(t 0 = 規則の半径 Y_k M_源 —— 在位/t 1 = 観測の半径/その間は幾何の倍)。
//   - cR = 受け手の半径の置き方: null = 規則の半径 Y_k m(在位)/数 = c_R × 受け手の観測の半径(第348便h の K1cM・第350便f の (ii) と同じ入り方 —— 自分の重みの球の半径と (C2) の平均の半径)。
// ■ 閉じた形(源の赤道面・静止の源・(W)・自分と他の重み A が中心で一定): Ω = [f + r f′ ÷ 2] Ω_源・f = s(r) ÷ W(r)・s = 源の回転の分子の係数・W = A + m K(r)。
//   A ≫ m K のとき、落ち方のべきを s ∝ r^−(1+q) と書けば [f + r f′/2] = f (1 − q) ÷ 2 —— q > 1 で源の自転と逆・q < 1 で順・q 1 で一次が消える(球のモーメント M は q 2 と同じ落ち方)。
// ■ 言わないこと: (S) の強さ・係数・源の半径の置き方を決めない。観測の数に届くとは書かない。在位の形(form 'M'・al 1・規則の半径)の列を必ず残す。この場・この形・この半径では、の表。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';

export const LIB_VERSION = 'w352k-spinform-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = TL.YR, AS = 180 * 3600 / Math.PI;
export const AS_YR = YR * AS;

/* ───────── 宣言 ───────── */
/** 源の回転の形(id → makeField3 の rot と核)。M1 が在位の形 */
export const FORMS = Object.freeze([
  Object.freeze({ id: 'M1', form: 'M', al: 1, label: '球のモーメント・K1(在位の形)' }),
  Object.freeze({ id: 'M2', form: 'M', al: 2, label: '球のモーメント・K2(比べる列)' }),
  Object.freeze({ id: 'q0', form: 'q', q: 0, al: 1, label: '落ち方 q 0(源の枠の剛体の回転 —— 落ちない形)' }),
  Object.freeze({ id: 'q0.5', form: 'q', q: 0.5, al: 1, label: '落ち方 q 0.5' }),
  Object.freeze({ id: 'q1', form: 'q', q: 1, al: 1, label: '落ち方 q 1' }),
  Object.freeze({ id: 'q1.2', form: 'q', q: 1.2, al: 1, label: '落ち方 q 1.2' }),
  Object.freeze({ id: 'q1.5', form: 'q', q: 1.5, al: 1, label: '落ち方 q 1.5' }),
  Object.freeze({ id: 'q2', form: 'q', q: 2, al: 1, label: '落ち方 q 2' }),
  Object.freeze({ id: 'q3', form: 'q', q: 3, al: 1, label: '落ち方 q 3' }),
]);
export const formOf = (id) => { const f = FORMS.find((x) => x.id === id); if (!f) throw new RangeError('formOf: 形の名 ' + id); return f; };
export const DECL = Object.freeze({
  parts: SP.DECL.parts, reads: SP.DECL.reads, mainRead: 'C2', nPhase: SP.DECL.nPhase, ballN: SP.DECL.ballN,
  forms: Object.freeze(FORMS.map((f) => f.id)), mainForm: 'M1',
  /** 源の半径の置き方 t(0 規則・1 観測・その間は幾何の倍) */
  tSrcs: Object.freeze([0, 0.25, 0.5, 0.75, 1]), mainTSrc: 0,
  tNames: Object.freeze({ 0: '規則の半径(在位)', 0.25: '幾何の倍 ¼', 0.5: '幾何の倍 ½', 0.75: '幾何の倍 ¾', 1: '観測の半径' }),
  /** 受け手の半径の置き方 c_R(× 受け手の観測の半径)—— null は規則の半径 */
  cRs: Object.freeze([null, 1e-6, 1e-4, 1e-2, 1]),
  /** 「逆向きで大きい」形の探し方: q を 0.8〜3 の 0.05 刻み(地球・太陽由来・(C2))—— 太陽の自転軸に沿った逆向きの成分 −(S·ŝ_太陽) ÷ abs(M) の最大 */
  qScan: Object.freeze({ lo: 0.8, hi: 3, step: 0.05 }),
  /** 背景の向き(表 2・表 3): (N+) は基準軸 L(角運動量の重み)と eq(等しい重み)の 2 つ・(G−) は銀河の回転と逆向き */
  bgCols: Object.freeze(['NpL', 'NpEq', 'Gm']),
  bgColNames: Object.freeze({ NpL: '(N+)・基準軸 L', NpEq: '(N+)・基準軸 eq', Gm: '(G−)' }),
  /** 表 3 の受け手(太陽は背景だけに応答する行 —— 惑星由来の局所の項は入れない) */
  t3Bodies: Object.freeze(['Earth', 'Mars', 'Sun']),
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  omegaG: BG.UDECL.omegaGalRadS,
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
export const vec = Object.freeze({ dot, crs, nrm, scl, add, sub, unit });
const GL = H.gaussLegendre(DECL.ballN);
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);
const partScales = (part) => {
  if (part === 'M') return [1, 0]; if (part === 'S') return [0, 1]; if (part === 'MS') return [1, 1];
  throw new RangeError('spinRot: 成分は M・S・MS');
};
const rotOf = (f) => (f.form === 'M' ? { form: 'M' } : { form: 'q', q: f.q });

/** 源の半径(t 0 = 規則の半径 Y_k M・t 1 = 観測の半径・その間は幾何の倍) */
export function srcRadius(src, tSrc = 0) {
  if (!(fin(tSrc) && tSrc >= 0 && tSrc <= 1)) throw new RangeError('srcRadius: t は 0〜1');
  const sid = srcId(src), Rrule = G3.YK * C.massOf(sid), Robs = C.radiusOf(sid);
  return tSrc === 0 ? Rrule : tSrc === 1 ? Robs : Math.pow(Rrule, 1 - tSrc) * Math.pow(Robs, tSrc);
}
/** 受け手の半径(cR null = 規則の半径 Y_k m・数 = c_R × 観測の半径) */
export function recvRadius(id, cR = null) {
  if (cR === null) return G3.YK * C.massOf(id);
  if (!(fin(cR) && cR > 0)) throw new RangeError('recvRadius: c_R > 0 か null');
  return cR * C.radiusOf(id);
}

/* ───────── 約束の口 ───────── */
/**
 * 由来 1 つの成分の回転(1 公転の平均・rad/s)。既定の引数では第351便c の partRot(..., { part: 'S' }) と同じ(相対の差 < 1e-12)。
 * 戻り値 { Om:[3], a, nOrb, Rs, Rr, A0(自分の重みの中心の値), wS(源の重みの中心の値), sAx(源の自転軸), ws(源の自転の率), sHat, nHat }
 */
export function spinRot(T1, GEO, id, src, { part = 'S', form = 'M1', tSrc = 0, cR = null, read = 'C2', extraW = 0, k = 1, nPhase = DECL.nPhase, spinScale = null } = {}) {
  const [v0, s0] = partScales(part), F = typeof form === 'string' ? formOf(form) : form;
  if (!(F && (F.form === 'M' || (F.form === 'q' && fin(F.q) && F.q >= 0)) && (F.al === 1 || F.al === 2))) throw new RangeError('spinRot: 形は M か q(q ≥ 0)・核 1・2');
  if (!DECL.reads.includes(read)) throw new RangeError('spinRot: 読みは C2・W');
  if (!(fin(k) && k >= 0)) throw new RangeError('spinRot: 換算の係数 k ≥ 0');
  if (!(fin(extraW) && extraW >= 0)) throw new RangeError('spinRot: extraW ≥ 0');
  const ss = spinScale === null ? s0 : spinScale;
  const P = SP.pairInput(T1, GEO, id, src), Rr = recvRadius(id, cR), Rs = srcRadius(src, tSrc);
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(P.nHat)[0], y = crs(P.nHat, x);
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * ss), kernel = { kind: 'ball', al: F.al }, rot = rotOf(F);
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * v0) },
        W0: 0, extraW, kernel, rot, self: true, mut: null });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om: k === 1 ? Om : scl(Om, k), a: P.a, nOrb: P.vOrb / P.a, Rs, Rr, A0: P.m * D.Kball(F.al, 0, Rr), wS: P.Ms * D.Kball(F.al, P.a, Rs), sAx: P.sAx, ws: P.ws, sHat: P.sHat, nHat: P.nHat };
}
/**
 * 閉じた形(源の赤道面・静止の源・(W)・A が中心で一定): [f + r f′/2](Ω_源 の倍)。形 M は第351便c の closedSEq と同じ式・形 q は s = m K(r) (R/(R + r))^q。
 */
export function closedS({ A, mj, Rj, r, form = 'M1' }) {
  const F = typeof form === 'string' ? formOf(form) : form, al = F.al;
  let s, ds;
  if (F.form === 'M') { const M = D.Mball(al, r, Rj), dM = D.MballDr(al, r, Rj); s = mj * M / r; ds = mj * (dM / r - M / (r * r)); }
  else { const K = D.Kball(al, r, Rj), dK = D.KballDr(al, r, Rj), g = Math.pow(Rj / (Rj + r), F.q), dg = -F.q * g / (Rj + r); s = mj * K * g; ds = mj * dK * g + mj * K * dg; }
  const W = A + mj * D.Kball(al, r, Rj), dW = mj * D.KballDr(al, r, Rj), f = s / W, df = ds / W - s * dW / (W * W);
  return f + 0.5 * r * df;
}
/** 一次の符号の目安(A ≫ m K・r ≫ R): 形 M → q 2・形 q → q。[f + r f′/2] ÷ f = (1 − q_eff) ÷ 2 */
export const leadFactor = (form) => { const F = typeof form === 'string' ? formOf(form) : form; const q = F.form === 'M' ? 2 : F.q; return (1 - q) / 2; };

/* ───────── 行を作る ───────── */
/** 太陽の自転との向き: 源の自転軸 sAx と Ω の内積の符号(−1 逆 = 「赤道面では源の回転と逆回転」に当たる・+1 順)と cos */
export function senseToSrc(sAx, Om) { const m = nrm(Om); if (!(m > 0)) return { sense: 0, cos: null }; const c = dot(unit(sAx), Om) / m; return { sense: c > 0 ? 1 : c < 0 ? -1 : 0, cos: c }; }
/** 最小二乗の傾き(ln y を ln x に) */
export function logSlope(xs, ys) {
  const lx = xs.map(Math.log), ly = ys.map((v) => Math.log(Math.abs(v))), n = lx.length, mx = lx.reduce((s, v) => s + v, 0) / n, my = ly.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (lx[i] - mx) * (ly[i] - my); sxx += (lx[i] - mx) ** 2; }
  return sxy / sxx;
}
/** (M) を形の核ごとに(源の自転 0 なので、源の回転の形と源の半径に依らない —— 零試験で見る) */
export function mOf(T1, GEO, id, { al = 1, cR = null, read = 'C2' } = {}) { return spinRot(T1, GEO, id, 'Sun', { part: 'M', form: al === 1 ? 'M1' : 'M2', cR, read }).Om; }

/** 表 1: 8 惑星 × 形 × 源の半径の置き方 —— (S) の大きさ(rad/s)・(S) ÷ (M)・太陽の自転との向き・自転軸 ŝ との cos */
export function table1(T1 = E.t1Table(), GEO = E.geometry(), { read = DECL.mainRead } = {}) {
  const Mc = {}, rows = [];
  for (const id of DECL.planets) for (const al of [1, 2]) Mc[id + al] = mOf(T1, GEO, id, { al, read });
  for (const fm of FORMS) for (const t of DECL.tSrcs) for (const id of DECL.planets) {
    const R = spinRot(T1, GEO, id, 'Sun', { part: 'S', form: fm.id, tSrc: t, read }), M = Mc[id + fm.al], sn = senseToSrc(R.sAx, R.Om), mag = nrm(R.Om);
    rows.push({ id, form: fm.id, tSrc: t, Rs: R.Rs, a: R.a, S: R.Om, magRadS: mag, magAsYr: mag * AS_YR, overM: mag / nrm(M), sense: sn.sense, cosSrc: sn.cos, cosSpin: mag > 0 ? dot(R.sHat, R.Om) / mag : null });
  }
  return rows;
}
/** 距離のべき: 8 惑星の ln abs(S) を ln a に当てた傾き(形 × 置き方)。閉じた形の目安 −(1 + q_eff) と並べる */
export function slopeRows(t1) {
  const out = [];
  for (const fm of FORMS) for (const t of DECL.tSrcs) {
    const rs = t1.filter((r) => r.form === fm.id && r.tSrc === t);
    out.push({ form: fm.id, tSrc: t, slope: logSlope(rs.map((r) => r.a), rs.map((r) => r.magRadS)), lead: fm.form === 'M' ? -3 : -(1 + fm.q) });
  }
  return out;
}
/** 「逆向きで大きい」形を探す: 地球・太陽由来・(C2) で q を走らせ、逆向き(太陽の自転と逆)の中で abs(S) ÷ abs(M) が最大の q(置き方ごと) */
export function qScanRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const { lo, hi, step } = DECL.qScan, n = Math.round((hi - lo) / step), M = nrm(mOf(T1, GEO, 'Earth')), out = [];
  for (const t of DECL.tSrcs) {
    let best = null, cross = null;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const q = Math.round((lo + i * step) * 100) / 100, R = spinRot(T1, GEO, 'Earth', 'Sun', { form: { id: 'scan', form: 'q', q, al: 1 }, tSrc: t }), sn = senseToSrc(R.sAx, R.Om);
      const opp = -dot(unit(R.sAx), R.Om) / M;
      pts.push({ q, overM: nrm(R.Om) / M, opp, cosSrc: sn.cos });
      if (opp > 0 && (best === null || opp > best.opp)) best = { q, opp, overM: nrm(R.Om) / M, cosSrc: sn.cos, magAsYr: nrm(R.Om) * AS_YR };
      if (cross === null && i > 0 && pts[i - 1].opp <= 0 && opp > 0) cross = q;
    }
    out.push({ tSrc: t, best, cross, nOpp: pts.filter((p) => p.opp > 0).length, nPts: pts.length, pts });
  }
  return out;
}
/** 表 4 の素: 受け手の半径の置き方 c_R × 源の半径の置き方(地球・太陽由来・形 M1 と q0)—— (S)・(M)・(S) ÷ (M)・A ÷ (A + w_源) */
export function cRRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const form of ['M1', 'q0']) for (const t of [0, 1]) for (const cR of DECL.cRs) {
    const S = spinRot(T1, GEO, 'Earth', 'Sun', { part: 'S', form, tSrc: t, cR }), M = spinRot(T1, GEO, 'Earth', 'Sun', { part: 'M', form, tSrc: t, cR }), sn = senseToSrc(S.sAx, S.Om);
    out.push({ form, tSrc: t, cR, Rr: S.Rr, A0: S.A0, wS: S.wS, selfShare: S.A0 / (S.A0 + S.wS), S: nrm(S.Om) * AS_YR, M: nrm(M.Om) * AS_YR, overM: nrm(S.Om) / nrm(M.Om), sense: sn.sense });
  }
  return out;
}

/** 背景の向きの単位ベクトル(基準軸は第352便c の refAxis・(G−) は第352便d の bgDir) */
export function bgUnit(col, T1 = E.t1Table(), GEO = E.geometry()) {
  if (col === 'NpL') return unit(RA.refAxis('L', T1, GEO));
  if (col === 'NpEq') return unit(RA.refAxis('eq', T1, GEO));
  if (col === 'Gm') return PS.bgDir('Gm');
  throw new RangeError('bgUnit: 背景の向きは ' + DECL.bgCols.join('・'));
}
/**
 * 表 2(金星の条件が決める数): 形 × 源の半径の置き方ごとに、金星で (S) と背景の大きさが同じになる倍率 ÷ k(uk = abs(S_金星) ÷ ω_G —— k 1 のときの倍率)・倍率 1 のときに要る k(= 1 ÷ uk)・
 * 背景の向きごとの金星の残り abs(S_金星 + 背景) ÷ abs(背景)(大きさは同じ —— 0 に近いほど打ち消す)。t1 は table1 の行。
 */
export function venusRows(t1, T1 = E.t1Table(), GEO = E.geometry()) {
  const U = Object.fromEntries(DECL.bgCols.map((c) => [c, bgUnit(c, T1, GEO)])), out = [];
  for (const fm of FORMS) for (const t of DECL.tSrcs) {
    const v = t1.find((r) => r.id === 'Venus' && r.form === fm.id && r.tSrc === t), m = v.magRadS, uk = m / DECL.omegaG;
    const resid = Object.fromEntries(DECL.bgCols.map((c) => [c, nrm(add(v.S, scl(U[c], m))) / m]));
    out.push({ form: fm.id, tSrc: t, uk, kAtU1: 1 / uk, resid, sense: v.sense });
  }
  return out;
}
/**
 * 表 3(そのときの率と時間 —— 単位の応答 = 経路 ② の率を abs(Ω) と読む): 形 × 置き方 × 背景の向きごとに、背景の倍率を (uV)(その置き方の uk・k 1)に置いたときの
 * 地球・火星の合成 abs(S + 背景)(″/年)と一周の年数、太陽(背景だけ)の率と一周の年数。
 */
export function rateRows(t1, vr, T1 = E.t1Table(), GEO = E.geometry()) {
  const U = Object.fromEntries(DECL.bgCols.map((c) => [c, bgUnit(c, T1, GEO)])), out = [];
  for (const v of vr) for (const c of DECL.bgCols) {
    const bg = scl(U[c], v.uk * DECL.omegaG), row = { form: v.form, tSrc: v.tSrc, bg: c, rates: {} };
    for (const id of DECL.t3Bodies) {
      const tot = id === 'Sun' ? bg : add(t1.find((r) => r.id === id && r.form === v.form && r.tSrc === v.tSrc).S, bg), asYr = nrm(tot) * AS_YR;
      row.rates[id] = { asYr, periodYr: asYr > 0 ? 1296000 / asYr : null };
    }
    out.push(row);
  }
  return out;
}

/* ───────── 零試験 ───────── */
/** 統括の数え直し 2 の数(第351便 —— 地球・太陽由来・(W)・分母は自分と太陽だけ・位相 72) */
export const ANCHOR = Object.freeze({ ratioEarthRule: '3.973e-14', obsOrderLo: -5, obsOrderHi: -3, q0EarthOverM: 15, q0Sense: 1, ruleSense: -1, uV: 1.19282e-12 });
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
  // ① 既定の引数で第351便c の partRot と同じ(8 惑星 + 衛星 2 組・(C2) と (W)・成分 3 つ —— 相対の差)
  let vsPart = 0;
  for (const [id, src] of [...DECL.planets.map((p) => [p, 'Sun']), ['Moon', 'EarthHi'], ['Io', 'Jupiter']]) for (const read of ['C2', 'W']) for (const part of ['S', 'M', 'MS']) {
    const a = spinRot(T1, GEO, id, src, { part, read }).Om, b = SP.partRot(T1, GEO, id, src, { part, read }).Om;
    vsPart = Math.max(vsPart, rel(a, b));
  }
  // ② 源の半径の 2 乗に比例(形 M1・地球・(C2) —— A ≫ w_源 の範囲)・形 q0 は源の半径に依らない・(M) は源の回転の形と源の半径に依らない
  const Wr = (o) => spinRot(T1, GEO, 'Earth', 'Sun', o);
  const s0 = Wr({ tSrc: 0 }), r2 = DECL.tSrcs.slice(1).map((t) => { const s = Wr({ tSrc: t }); return Math.abs(nrm(s.Om) / nrm(s0.Om) / ((s.Rs / s0.Rs) ** 2) - 1); });
  const q0a = Wr({ form: 'q0', tSrc: 0 }).Om, q0b = Wr({ form: 'q0', tSrc: 1 }).Om, mInv = Math.max(rel(Wr({ part: 'M', form: 'q1.5', tSrc: 1 }).Om, Wr({ part: 'M' }).Om), rel(Wr({ part: 'M', form: 'q0', tSrc: 0.5 }).Om, Wr({ part: 'M' }).Om));
  // ③ 統括の数え直し 2(地球・(W)): 在位 3.973e-14・観測の半径で 1e-4 の桁・落ちない形 q0 で (M) の 15 倍の桁で向きが順
  const W = (o) => spinRot(T1, GEO, 'Earth', 'Sun', { read: 'W', ...o }), mW = nrm(W({ part: 'M' }).Om);
  const sRule = W({}), sObs = W({ tSrc: 1 }), sQ0 = W({ form: 'q0', tSrc: 1 });
  const anchor2 = { rule: nrm(sRule.Om) / mW, obs: nrm(sObs.Om) / mW, q0: nrm(sQ0.Om) / mW, senseRule: senseToSrc(sRule.sAx, sRule.Om).sense, senseObs: senseToSrc(sObs.sAx, sObs.Om).sense, senseQ0: senseToSrc(sQ0.sAx, sQ0.Om).sense };
  // ④ 閉じた形: 源の赤道面・静止の源・(W)・自分の重み一定 —— makeField3 を直接に呼んだ値と closedS(形 6 つ)・形 M は第351便c の closedSEq と同じ
  const A = 3, mj = 1, Rj = 0.05, r = 2, rc = [r, 0, 0];
  let closed = 0;
  for (const fid of ['M1', 'M2', 'q0', 'q0.5', 'q1.5', 'q3']) {
    const F = formOf(fid), fld = G3.makeField3({ sources: [{ m: mj, R: Rj, p: [0, 0, 0], v: [0, 0, 0], spin: [0, 0, 1] }], recv: { m: 1, R: 1, p: rc, v: [0, 0, 0] }, W0: A, extraW: 0,
      kernel: { kind: 'ball', al: F.al }, rot: rotOf(F), self: false });
    const w = G3.rot3('W', fld, rc, { Rb: 1 })[2], c = closedS({ A, mj, Rj, r, form: fid });
    closed = Math.max(closed, Math.abs(w / c - 1));
  }
  const vsClosedSEq = Math.abs(closedS({ A, mj, Rj, r, form: 'M1' }) / SP.closedSEq({ A, mj, Rj, r }) - 1);
  // ⑤ 符号の一次の目安: A ≫ m K・r ≫ R で closedS ÷ f の符号 = (1 − q_eff) の符号(q 0・0.5 順・1.5・2・3・M 逆)
  const lead = ['q0', 'q0.5', 'q1.5', 'q2', 'q3', 'M1'].map((fid) => { const c = closedS({ A: 1e6, mj: 1, Rj: 1e-3, r: 10, form: fid }); return Math.sign(c) === Math.sign(leadFactor(fid)); });
  // ⑥ 源の自転を反転 → (S) の符号が反転(形 q1.5・観測の半径)・k 2 は同じビットの 2 倍・k 0 は 0
  const sq = Wr({ form: 'q1.5', tSrc: 1 }).Om, flip = rel(Wr({ form: 'q1.5', tSrc: 1, spinScale: -1 }).Om, scl(sq, -1)), k2 = rel(Wr({ k: 2 }).Om, scl(s0.Om, 2)), k0 = nrm(Wr({ k: 0 }).Om);
  // ⑦ (uV): 金星で (S) と背景の大きさが同じになる倍率 ÷ k(在位)= 1.19282e-12
  const uV = nrm(spinRot(T1, GEO, 'Venus', 'Sun', {}).Om) / DECL.omegaG;
  // ⑧ 受け手の半径の置き方: c_R null と規則の半径の数を直接に渡した値が同じ・半径の関数
  const rr = { rule: recvRadius('Earth') === G3.YK * C.massOf('Earth'), cR1: recvRadius('Earth', 1) === C.radiusOf('Earth'), t1: srcRadius('Sun', 1) === C.radiusOf('Sun'), t0: srcRadius('Sun', 0) === G3.YK * C.massOf('Sun') };
  // ⑨ 拒否
  const rejects = [() => spinRot(T1, GEO, 'Earth', 'Sun', { part: 'X' }), () => spinRot(T1, GEO, 'Earth', 'Sun', { form: 'q9' }), () => spinRot(T1, GEO, 'Earth', 'Sun', { tSrc: 1.5 }),
    () => spinRot(T1, GEO, 'Earth', 'Sun', { cR: -1 }), () => spinRot(T1, GEO, 'Earth', 'Sun', { read: 'P2' }), () => spinRot(T1, GEO, 'Earth', 'Sun', { k: -1 }),
    () => spinRot(T1, GEO, 'Earth', 'Sun', { form: { form: 'q', q: -1, al: 1 } })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsPart, r2: Math.max(...r2), q0Rs: rel(q0b, q0a), mInv, anchor2, closed, vsClosedSEq, lead, flip, k2, k0, uV, rr, rejects };
}
export function pureGates(S) {
  const A = ANCHOR, lg = Math.log10(S.anchor2.obs);
  return {
    vsPartRot: S.vsPart < 1e-12,
    radiusSq: S.r2 < 1e-9,
    invariants: S.q0Rs < 1e-12 && S.mInv < 1e-12,
    anchor2: S.anchor2.rule.toExponential(3) === A.ratioEarthRule && lg >= A.obsOrderLo && lg < A.obsOrderHi && Math.round(S.anchor2.q0) === A.q0EarthOverM
      && S.anchor2.senseQ0 === A.q0Sense && S.anchor2.senseRule === A.ruleSense && S.anchor2.senseObs === A.ruleSense,
    closed: S.closed < 1e-9 && S.vsClosedSEq < 1e-12,
    leadSign: S.lead.length === 6 && S.lead.every(Boolean),
    flipK: S.flip < 1e-12 && S.k2 < 1e-12 && S.k0 === 0,
    uV: Math.abs(S.uV / A.uV - 1) < 5e-6,
    radii: Object.values(S.rr).every(Boolean),
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean),
  };
}

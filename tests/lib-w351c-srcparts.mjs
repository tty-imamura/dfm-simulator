// 第351便c(原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R429):
//   **源の由来の軸引きずりの回転を、源の入力だけを切り替えて 3 つの成分に分ける —— (M) 相対の公転の分(源の自転 0・相対の速度だけ)・(S) 源の自転の分(相対の速度 0・源の自転だけ)・
//   (MS) 両方(第348便h の srcRot3 そのもの)。読み (C2) 球の半径の平均(第350便b の equivR と同じ求積)と (W) 中心の渦度の半分・分母の列 in/out・換算の係数 k(局所の項だけ)・
//   自転軸との cos・公転の北極を基準の「起こす率」の純関数 —— 診断だけ**
//   (器 tests/exp-w351c-srcparts.mjs と QA behavior.srcparts351c・docs.srcparts351c が読む —— html を読まない・ファイルを読まない・状態を持たない。第 2 段の枝もこの口を import する)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない): 第348便h(makeField3・rot3・srcRot3・pairRot3・galMass・YK・DECL.combos)・第350便b(equivR)・第350便e(termsOf・uVec・UDECL・commonChecks・COMMON_WANT)・
//   第347便h(gaussLegendre)・第348便c(massOf・galDistM・DECL.parentRows)・第347便e(DECL.pairs・t1Table・geometry)・第312便a(Kball)・第337便c(定数)。
//
// ■ 場(共通): 在位の geoPN=3 の本が宣言している形 = 第348便h の makeField3 の既定(K1 の核・源の回転は球のモーメント・背景 W₀ 0・自分の重みを分母に・受け手の速度を引く)。
//   源の半径・受け手の半径は規則の半径 Y_k m(第348便h の主の組 K1rM と同じ)。道・位相(72)・分母・半径は 3 つの成分で同じ —— 源の入力(相対の速度・源の自転)だけを切り替える。
// ■ 座標: 受け手を原点に置き、源は −a r̂(静止)・受け手が +v_orb v̂ で動く(相対の速度 V_s − v_i は第348便h の srcRot3 と同じビット —— 受け手の速度を引かない変異 'absVel' で (M) が消えるように、
//   受け手の側に速度を持たせる)。(S) は直接に数える(相対の速度を 0 に置いた場から —— (MS) − (M) の差で作らない: (S) は (M) の 1e-13 倍の桁で、差では丸めに埋もれる)。
// ■ 読み: (C2)(主)= 球全体の剛体回転への平均 —— 天体の表では、自分の重みを半径 ρ の値に置いた中心の ½∇×u の、重み 5ρ⁴ ÷ R⁵ の半径の平均(GL 8 点・受け手の半径を equivR(R, ρ) に置く —— 第350便b の bodyRowsC の C2ball と同じ作り)。
//   (W) = 中心の渦度の半分(第348便h の rot3('W'))。
// ■ 冥王星–カロンの逆の組 Charon|Pluto(第347便e の 15 組に無い —— Pluto|Charon の組から作る): 距離 a は Pluto|Charon の β から(a = G M_カロン ÷ (β c²))・源は冥王星(質量 M_冥王星・
//   自転は冥王星の自転の率・軸は冥王星の自転軸)・受け手はカロン(自転軸 = 公転の法線 = 冥王星の自転軸 —— 互いに同期の宣言)・相対の速さは srcRot3 と同じ約束 √(G M_源 ÷ a)。
//   カロンの太陽由来の行 Charon|Sun は Pluto|Sun の道(太陽のまわりの道は冥王星の道 —— 宣言)に受け手の質量だけカロンを置く。
// ■ 起こす率(本便で共通の定義): 公転の北極 n̂ を基準に傾き ε = acos(ŝ·n̂)。起こす率 = −dε/dt = (dŝ/dt · n̂) ÷ sin ε(正 = 傾きが減る)。sin ε が 1e-9 未満(同期・軸 = 法線)は null。
// ■ 言わないこと: 太陽由来の軸引きずりの符号・第147報の予想の成否とは書かない。(M) を軸引きずりに数えるか並進引きずりの回転成分に数えるかは決めない。この場・この成分・この読みでは、の表。
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

export const LIB_VERSION = 'w351c-srcparts-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI, AS = 180 * 3600 / Math.PI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  parts: Object.freeze(['M', 'S', 'MS']),
  partNames: Object.freeze({ M: '(M) 相対の公転の分(源の自転 0)', S: '(S) 源の自転の分(相対の速度 0)', MS: '(MS) 両方(第348便h の srcRot3)' }),
  reads: Object.freeze(['C2', 'W']), mainRead: 'C2',
  readNames: Object.freeze({ C2: '(C2) 球の半径の平均(主)', W: '(W) 中心の渦度の半分' }),
  dens: Object.freeze(['in', 'out']), mainDen: 'out',
  denNames: Object.freeze({ out: '局所の分母に銀河の重みを入れない(自分 + 太陽 + 母天体)', in: '入れる(第348便h の pairRot3 の形)' }),
  /** 一様な背景(第350便e の uVec —— rdPow 0・銀河の公転の角速度 × 倍率)。向き −1(銀河の回転と逆向き)が主・+1 は比べる列 */
  bgSigns: Object.freeze([-1, 1]), mainSign: -1, bgMult: 1,
  nPhase: G3.DECL.nPhase, ballN: 8, combo: G3.DECL.mainCombo,
  sinFloor: 1e-9,
  judge: '丸めの桁の床: 逐語の表は有効数字 3〜4 桁・打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
/** 第347便e の 15 組 + 冥王星–カロンの逆の組 */
export const PAIRS16 = Object.freeze([...E.DECL.pairs, Object.freeze(['Charon', 'Pluto'])]);
/** 衛星の行(源が母天体)→ その天体の太陽由来の行(第348便c の parentRows + Charon|Pluto → Charon|Sun) */
export const PARENT_ROWS = Object.freeze({ ...C.DECL.parentRows, 'Charon|Pluto': 'Charon|Sun' });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);
const GL = H.gaussLegendre(DECL.ballN);

/* ───────── 組の入力 ───────── */
/**
 * 組 (id, src) の入力: 受け手の質量 m・自転軸 sHat(第347便e の geometry の w —— 逆行は向きに入れてある)・公転の北極 nHat・源の質量 Ms・源の自転軸 sAx・源の自転の率 ws・
 * 距離 a(= G Ms ÷ (β c²))・相対の速さ vOrb(= √β c —— 第348便h の srcRot3 と同じ約束)。Charon|Pluto・Charon|Sun は上の宣言で作る。
 */
export function pairInput(T1, GEO, id, src) {
  const row = (i, s) => T1.find((r) => r.id === i && r.src === s && r.mag === 'm2');
  if (id === 'Charon' && src === 'Pluto') {
    const r2 = row('Pluto', 'Charon'), g = GEO['Pluto|Charon'], bPC = r2.Om1 / r2.OmegaT, a = G * C.massOf('Charon') / (bPC * C0 * C0), Ms = C.massOf('Pluto'), beta = G * Ms / (a * C0 * C0);
    return { id, src, m: C.massOf('Charon'), sHat: unit(g.s), nHat: unit(g.n), Ms, sAx: unit(g.w), ws: r2.omega, a, vOrb: Math.sqrt(beta) * C0, beta, made: 'Pluto|Charon から(距離・冥王星の自転)' };
  }
  if (id === 'Charon' && src === 'Sun') {
    const b = pairInput(T1, GEO, 'Pluto', 'Sun');
    return { ...b, id, m: C.massOf('Charon'), sHat: unit(GEO['Pluto|Charon'].s), made: 'Pluto|Sun の道・受け手の質量と自転軸はカロン' };
  }
  const r2 = row(id, src), g = GEO[id + '|' + src];
  if (!r2 || !g) throw new RangeError('pairInput: 組 ' + id + '|' + src);
  const ws = r2.OmegaT, beta = r2.Om1 / ws, Ms = C.massOf(srcId(src)), a = G * Ms / (beta * C0 * C0);
  return { id, src, m: C.massOf(id), sHat: unit(g.w), nHat: unit(g.n), Ms, sAx: unit(g.s), ws, a, vOrb: Math.sqrt(beta) * C0, beta, made: '第347便e の t1Table と geometry' };
}
const partScales = (part) => {
  if (part === 'M') return [1, 0]; if (part === 'S') return [0, 1]; if (part === 'MS') return [1, 1];
  throw new RangeError('partRot: 成分は M・S・MS');
};

/* ───────── 成分の回転 ───────── */
/**
 * 由来 1 つの成分の回転(1 公転の平均・rad/s)。part 'M'・'S'・'MS'/read 'C2'(球の半径の平均)・'W'(中心)/extraW = 他の由来の重みの中心の値(分母だけ)/
 * k = 換算の係数(局所の項に掛ける —— 宣言した背景には掛けない)/mut = makeField3 の変異('absVel' ほか)/velScale・spinScale = 相対の速度・源の自転の倍率(零試験の口 —— 既定は part から)。
 * 戻り値 { Om:[3], a, nOrb, wS(源の重みの中心の値), A0(自分の重みの中心の値 —— 規則の半径), sHat, nHat }
 */
export function partRot(T1, GEO, id, src, { part, read = 'C2', extraW = 0, k = 1, mut = null, velScale = null, spinScale = null, nPhase = DECL.nPhase } = {}) {
  const [v0, s0] = partScales(part);
  if (!DECL.reads.includes(read)) throw new RangeError('partRot: 読みは C2・W');
  if (!(fin(k) && k >= 0)) throw new RangeError('partRot: 換算の係数 k ≥ 0');
  if (!(fin(extraW) && extraW >= 0)) throw new RangeError('partRot: extraW ≥ 0');
  const vs = velScale === null ? v0 : velScale, ss = spinScale === null ? s0 : spinScale;
  const P = pairInput(T1, GEO, id, src), Rr = G3.YK * P.m, Rs = G3.YK * P.Ms;
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(P.nHat)[0], y = crs(P.nHat, x);
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * ss);
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * vs) },
        W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om: k === 1 ? Om : scl(Om, k), a: P.a, nOrb: P.vOrb / P.a, wS: P.Ms * D.Kball(1, P.a, Rs), A0: P.m * D.Kball(1, 0, Rr), sHat: P.sHat, nHat: P.nHat };
}
/** 銀河の重みの中心の値(第348便h の pairRot3 と同じ式) */
export const galWeight = () => G3.galMass() * D.Kball(1, C.galDistM(), G3.YK * G3.galMass());
const wAt = (T1, GEO, key) => { const [i, s] = key.split('|'), P = pairInput(T1, GEO, i, s); return P.Ms * D.Kball(1, P.a, G3.YK * P.Ms); };
/**
 * 組 (id, src) の太陽由来と母天体由来の 3 成分。den 'out' = 局所の分母に銀河の重みを入れない(自分 + 太陽 + 母天体)/'in' = 入れる(第348便h の pairRot3 の形)。k は局所の項に掛ける。
 * 衛星の太陽由来の行は、その天体の太陽のまわりの道(第348便c の parentRows —— 第348便h の pairRot3 と同じ)。
 */
export function pairParts(T1, GEO, id, src, { read = 'C2', den = 'out', k = 1 } = {}) {
  if (!DECL.dens.includes(den)) throw new RangeError('pairParts: 分母の列は in・out');
  const key = id + '|' + src, sunKey = src === 'Sun' ? key : PARENT_ROWS[key];
  if (!sunKey) throw new RangeError('pairParts: 組 ' + key);
  const [sid, ssrc] = sunKey.split('|'), wSun = wAt(T1, GEO, sunKey), wPar = src === 'Sun' ? 0 : wAt(T1, GEO, key), wGal = galWeight(), gIn = den === 'in' ? wGal : 0;
  const three = (i, s, extraW) => Object.fromEntries(DECL.parts.map((p) => [p, partRot(T1, GEO, i, s, { part: p, read, extraW, k }).Om]));
  return { sun: three(sid, ssrc, wPar + gIn), parent: src === 'Sun' ? null : three(id, src, wSun + gIn), wSun, wPar, wGal };
}
/** 一様な背景のベクトル(第350便e の uVec —— rdPow 0・ω_G × 倍率・向き ±1) */
export const bgOm = (id, { mult = DECL.bgMult, sign = DECL.mainSign } = {}) => BG.uVec(BG.UDECL.omegaGalRadS * mult, 'rd0', C.massOf(id === 'Charon' ? 'Charon' : id), sign);

/* ───────── 向きと率 ───────── */
/** 自転軸 ŝ と Ω のなす向き(cos)—— Ω が 0 なら null */
export function cosTo(sHat, Om) {
  if (!(isVec(sHat) && isVec(Om))) throw new RangeError('cosTo: ベクトル');
  const a = nrm(sHat), b = nrm(Om); return a > 0 && b > 0 ? dot(sHat, Om) / (a * b) : null;
}
/** 直交成分 Ω⊥ = Ω − (ŝ·Ω) ŝ */
export function perpOf(sHat, Om) { const s = unit(sHat); return sub(Om, scl(s, dot(Om, s))); }
/** 起こす率 −dε/dt = (dŝ/dt · n̂) ÷ sin ε(ε = acos(ŝ·n̂)・正 = 傾きが減る)—— sin ε が床より小さいと null。単位は dŝ/dt と同じ */
export function raiseRate(sHat, nHat, dsdt) {
  if (!(isVec(sHat) && isVec(nHat) && isVec(dsdt))) throw new RangeError('raiseRate: ベクトル');
  const s = unit(sHat), n = unit(nHat), c = Math.max(-1, Math.min(1, dot(s, n))), sinE = Math.sqrt(Math.max(0, 1 - c * c));
  return sinE < DECL.sinFloor ? null : dot(dsdt, n) / sinE;
}
/** 回転軸へ寄る率(経路 ① だけ・係数 1 —— dŝ/dt = Ω⊥): θ = ŝ と符号つきの Ω のなす角 → −dθ/dt = abs(Ω⊥)(恒等的に ≥ 0)・ψ = ŝ と Ω の線のなす角(≤ 90°)→ −dψ/dt = sign(ŝ·Ω) abs(Ω⊥) */
export function towardRates(sHat, Om) { const p = nrm(perpOf(sHat, Om)), c = cosTo(sHat, Om); return { toOm: p, toLine: c === null ? 0 : (c > 0 ? p : c < 0 ? -p : 0) }; }

/* ───────── 閉じた形(T2・T6)───────── */
/** (M) の閉じた形((W)・円の道の 1 公転の平均・自分と他の由来の重み A が中心で一定): Ω = ½ A W_j n_orb ÷ (A + W_j)² × n̂ */
export function closedM({ A, wS, nOrb }) { return 0.5 * A * wS * nOrb / ((A + wS) * (A + wS)); }
/** (S) の閉じた形((W)・源の赤道面・静止の源・K1 の外部・球のモーメント M1 = R²/(5r²)): Ω = [f + r f′/2] Ω_src・f = s(r) ÷ W(r)・s = m M(r) ÷ r・W = A + m K(r) */
export function closedSEq({ A, mj, Rj, r, al = 1 }) {
  const M = D.Mball(al, r, Rj), dM = D.MballDr(al, r, Rj), s = mj * M / r, ds = mj * (dM / r - M / (r * r)), W = A + mj * D.Kball(al, r, Rj), dW = mj * D.KballDr(al, r, Rj);
  const f = s / W, df = ds / W - s * dW / (W * W);
  return f + 0.5 * r * df;
}

/* ───────── 零試験・共通の点検の数 ───────── */
/** 統括の数え直しの数(共通ブリーフ —— 在位の形・(W)・分母は自分と太陽だけ・位相 72・係数 1) */
export const ANCHOR = Object.freeze({
  cos: Object.freeze({ Earth: Object.freeze(['-0.922', '0.917', '0.456']), Mars: Object.freeze(['-0.883', '0.905', '0.057']), Venus: Object.freeze(['1.000', '-0.999', '-0.481']),
    Mercury: Object.freeze(['-1.000', '1.000', '0.414']), Jupiter: Object.freeze(['-0.998', '0.999', '0.509']), Saturn: Object.freeze(['-0.901', '0.893', '0.364']),
    Uranus: Object.freeze(['0.133', '-0.135', '-0.251']), Neptune: Object.freeze(['-0.853', '0.880', '0.126']) }),
  ratioEarth: '3.973e-14', ratioMercury: '6.416e-14', ratioNeptune: '7.255e-15', msEarthAsYr: '5.0576e-2',
  raise: Object.freeze({ Earth: Object.freeze(['-7.690e-16', '2.0118e-2', '1.1720e-3']), Mars: Object.freeze(['-2.676e-16', '7.5124e-3', '5.8943e-3']) }),
  ballOverW: '1.32335',
});
const PLANETS = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);
const fx = (v) => { const s = v.toFixed(3); return s === '-0.000' ? '0.000' : s; };
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const combo = G3.DECL.combos.find((c) => c.id === DECL.combo);
  const Wr = (id, src, part, o = {}) => partRot(T1, GEO, id, src, { part, read: 'W', ...o }), W = (id, src, part, o = {}) => Wr(id, src, part, o).Om;
  // ① (MS) は第348便h の srcRot3(...).W と同じ(15 組)・② (M) + (S) と (MS) の差(分子が線形)
  let vsSrc = 0, lin = 0;
  const anchor = {};
  for (const [id, src] of E.DECL.pairs) {
    const ms = W(id, src, 'MS'), m = W(id, src, 'M'), s = W(id, src, 'S'), ref = G3.srcRot3(T1, GEO, id, src, combo, {}).W;
    vsSrc = Math.max(vsSrc, rel(ms, ref)); lin = Math.max(lin, nrm(sub(add(m, s), ms)) / nrm(m));
    if (src === 'Sun' && PLANETS.includes(id)) {
      const P = pairInput(T1, GEO, id, src), bg = bgOm(id), dS = perpOf(P.sHat, s), dMS = perpOf(P.sHat, ms), dB = perpOf(P.sHat, bg);
      anchor[id] = { cos: [cosTo(P.sHat, s), cosTo(P.sHat, ms), cosTo(P.sHat, bg)], ratio: nrm(s) / nrm(m), msAsYr: nrm(ms) * YR * AS,
        raise: [raiseRate(P.sHat, P.nHat, dS) * YR * AS, raiseRate(P.sHat, P.nHat, dMS) * YR * AS, raiseRate(P.sHat, P.nHat, dB) * YR * AS] };
    }
  }
  // ③ (S) は直接に数える: 相対の速度 0 の場から(入力の速度の倍率が 0)—— 地球の (S) ÷ (M) の桁
  const sDirect = { velScaleOfS: partScales('S')[0], ratioEarth: anchor.Earth.ratio };
  // ⑤ 通過の向きを反転 → (M) の符号が反転・源の自転を反転 → (S) の符号が反転・互いに静止で自転 0 → 0
  const mE = W('Earth', 'Sun', 'M'), sE = W('Earth', 'Sun', 'S');
  const flip = { m: rel(W('Earth', 'Sun', 'M', { velScale: -1 }), scl(mE, -1)), s: rel(W('Earth', 'Sun', 'S', { spinScale: -1 }), scl(sE, -1)), rest: nrm(W('Earth', 'Sun', 'MS', { velScale: 0, spinScale: 0 })),
    io: rel(W('Io', 'Jupiter', 'M', { velScale: -1 }), scl(W('Io', 'Jupiter', 'M'), -1)) };
  // ⑥ 分母の列: in の (MS)・(W) = 第348便h の pairRot3 の S.W・P.W/out = 第350便e の termsOf('out')/in と out の差は小さいが 0 でない
  const den = { in: 0, out: 0, diffE: 0 };
  for (const [id, src] of [['Earth', 'Sun'], ['Moon', 'EarthHi'], ['Io', 'Jupiter'], ['Pluto', 'Charon']]) {
    const pi = pairParts(T1, GEO, id, src, { read: 'W', den: 'in' }), po = pairParts(T1, GEO, id, src, { read: 'W', den: 'out' }), R = G3.pairRot3(T1, GEO, id, src, combo), To = BG.termsOf(T1, GEO, id, src, 'out');
    den.in = Math.max(den.in, rel(pi.sun.MS, R.S.W), pi.parent ? rel(pi.parent.MS, R.P.W) : 0);
    den.out = Math.max(den.out, rel(po.sun.MS, To.S.W), po.parent ? rel(po.parent.MS, To.P.W) : 0);
    if (id === 'Earth') den.diffE = nrm(pi.sun.MS) / nrm(po.sun.MS) - 1;
  }
  // ⑦ 受け手の速度を引かない変異 'absVel' では (M) が 0(在位の形の「受け手の速度を引く」から出る分)・(S) は変わらない
  const absVel = { m: nrm(W('Earth', 'Sun', 'M', { mut: 'absVel' })), s: rel(W('Earth', 'Sun', 'S', { mut: 'absVel' }), sE) };
  // ⑧ (M) の閉じた形 ½ A W_j n_orb ÷ (A + W_j)²(8 惑星・(W)・分母は自分と太陽)と向き(公転の北極)
  let closed = 0, dirN = 0;
  for (const id of PLANETS) { const r = Wr(id, 'Sun', 'M'), c = closedM({ A: r.A0, wS: r.wS, nOrb: r.nOrb }); closed = Math.max(closed, Math.abs(nrm(r.Om) / c - 1)); dirN = Math.max(dirN, 1 - cosTo(r.nHat, r.Om)); }
  // ⑨ 換算の係数 k: 局所の項だけが k 倍(同じビットの倍)・k 0 は 0
  const k2 = pairParts(T1, GEO, 'Earth', 'Sun', { read: 'W', k: 2 }), k1 = pairParts(T1, GEO, 'Earth', 'Sun', { read: 'W' }), kk = { two: Math.max(...DECL.parts.map((p) => rel(k2.sun[p], scl(k1.sun[p], 2)))), zero: nrm(partRot(T1, GEO, 'Earth', 'Sun', { part: 'MS', read: 'W', k: 0 }).Om) };
  // ⑩ (C2) 球の半径の平均 ÷ (W)(地球・太陽由来・(MS)・分母 in —— 第350便b の ballOverC2S と同じ作り)
  const pb = pairParts(T1, GEO, 'Earth', 'Sun', { read: 'C2', den: 'in' }), ballOverW = nrm(pb.sun.MS) / nrm(pairParts(T1, GEO, 'Earth', 'Sun', { read: 'W', den: 'in' }).sun.MS);
  // ⑪ Charon|Pluto の作り: 距離は Pluto|Charon と同じ・源と受け手の質量の入れ替え・軸は同期の宣言
  const pc = pairInput(T1, GEO, 'Pluto', 'Charon'), cp = pairInput(T1, GEO, 'Charon', 'Pluto');
  const charon = { a: Math.abs(cp.a / pc.a - 1), masses: cp.Ms === pc.m && cp.m === pc.Ms, axis: 1 - dot(cp.sHat, cp.nHat), pairs: PAIRS16.length };
  // ⑫ 第350便までの共通の点検の数(自転しない源の通過 —— 第350便e の lib の commonChecks)
  const common = BG.commonChecks();
  // ⑬ 拒否
  const rej = [() => partRot(T1, GEO, 'Earth', 'Sun', { part: 'X' }), () => partRot(T1, GEO, 'Earth', 'Sun', { part: 'M', read: 'P2' }), () => partRot(T1, GEO, 'Earth', 'Sun', { part: 'M', k: -1 }),
    () => pairParts(T1, GEO, 'Earth', 'Sun', { den: 'x' }), () => pairInput(T1, GEO, 'Earth', 'Mars'), () => cosTo([1, 0], [1, 0, 0]), () => raiseRate([0, 0, 1], [0, 0, 1], [1, 0])]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  const nullRaise = raiseRate([0, 0, 1], [0, 0, 1], [1, 0, 0]) === null && cosTo([0, 0, 1], [0, 0, 0]) === null;
  return { vsSrc, lin, anchor, sDirect, flip, den, absVel, closed, dirN, kk, ballOverW, charon, common, rejects: rej, nullRaise };
}
export function pureGates(S) {
  const A = ANCHOR, cw = BG.COMMON_WANT, c = S.common;
  const cosOk = Object.entries(A.cos).every(([id, w]) => S.anchor[id] && S.anchor[id].cos.map(fx).join() === w.join());
  const ex = (v, d) => v.toExponential(d);
  return {
    vsSrcRot3: S.vsSrc < 1e-12,
    linear: S.lin < 1e-12,
    sDirect: S.sDirect.velScaleOfS === 0 && ex(S.sDirect.ratioEarth, 3) === A.ratioEarth && ex(S.anchor.Mercury.ratio, 3) === A.ratioMercury && ex(S.anchor.Neptune.ratio, 3) === A.ratioNeptune,
    anchorCos: cosOk && ex(S.anchor.Earth.msAsYr, 4) === A.msEarthAsYr,
    anchorRaise: Object.entries(A.raise).every(([id, w]) => [ex(S.anchor[id].raise[0], 3), ex(S.anchor[id].raise[1], 4), ex(S.anchor[id].raise[2], 4)].join() === w.join()),
    flips: S.flip.m < 1e-12 && S.flip.s < 1e-12 && S.flip.rest === 0 && S.flip.io < 1e-12,
    denCols: S.den.in < 1e-12 && S.den.out < 1e-12 && Math.abs(S.den.diffE) > 0 && Math.abs(S.den.diffE) < 1e-3,
    absVelM: S.absVel.m === 0 && S.absVel.s < 1e-12,
    closedM: S.closed < 1e-9 && S.dirN < 1e-12,
    kLocal: S.kk.two < 1e-15 && S.kk.zero === 0,
    ballOverW: S.ballOverW.toFixed(5) === A.ballOverW,
    charonPair: S.charon.a < 1e-12 && S.charon.masses && S.charon.axis < 1e-12 && S.charon.pairs === 16,
    common350: Math.abs(c.diaXz - cw.diaXz) < cw.tol && Math.abs(c.sixZ - cw.sixZ) < cw.tol && Math.abs(c.rotWz - cw.rotWz) < cw.tol,
    rejects: S.rejects.length === 7 && S.rejects.every(Boolean) && S.nullRaise,
  };
}

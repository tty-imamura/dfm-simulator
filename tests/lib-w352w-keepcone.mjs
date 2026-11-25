// 第352便w(原仮定者の回答(2026-11-24 —— 第148報)「AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む」・
//   原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R460):
//   **「初めの角が保たれている」の読みの制約 —— 傾きを保つ比率 f の上限(閉じた形)・公転面(輪の法線)の側の比率 f_輪 の下限・
//   円錐を 1 周する間の観測の傾きの揺れ・局所の (S) を公転の位相で平均しない步(位相ごとの步)・金星の公転面が回るときの行き先 —— 診断だけ**
//   (器 tests/exp-w352w-keepcone.mjs と QA behavior.keepcone352w・docs.keepcone352w が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。
//   既存の lib は呼ぶだけ(本文は変えない): 第352便p(fMax・fRingFor・fOfK1・stateOf)・第352便o(localS・uVenusO)・第352便k(srcRadius・spinRot)・第352便n(turnRow・finalOf・uVOf)・
//   第352便i(kOf・thAfter)・第352便d(bgVec・uVenus・r3Ds・rowOf)・第352便c(refAxes)・第351便c(pairInput・partRot)・第351便d(r3Coeffs・vec・angDeg)・
//   第352便b(provValue —— 仮の値)・第348便h(makeField3・rot3・YK)・第350便b(equivR)・第347便h(gaussLegendre)・第347便e(t1Table・geometry)・第337便c(BODY_SRC・GALAXY・YR)。
//
// ■ 語: ŝ = 自転軸・n̂ = 公転の法線(輪の法線)・Ω = 受け手の合成(背景 Ω_bg + 局所の (S))・W = abs(Ω)・W_b = abs(Ω_bg)。θ = ŝ と Ω のなす角(円錐の半頂角)・ε = ŝ と n̂ の角(観測の傾き)。
//   比率 f は第351便d の (N1)(k₁ = f ÷ √((1 − f)² + f²)・k₂ = (1 − f) ÷ 同)。歳差の向き (g2+)・(g2−) は第352便d の r3Ds。
// ■ T1 の 1(傾きを保つ f の上限): 一定の合成のもとで経路 ① は tan(θ/2) = tan(θ₀/2) e^(−k₁ W t) で円錐を縮める。年齢 t の間に変化が X 以内:
//   X = 割合 q: x = ln(tan(θ/2) ÷ tan((1 − q) θ/2))/X = 角 Δ: x = ln(tan(θ/2) ÷ tan((θ − Δ)/2))(θ ≤ Δ なら上限なし)。k₁ の上限 = x ÷ (W t)・f の上限 = (N1) を逆に(k₁ ≥ 1 なら上限なし)。
// ■ T1 の 2(公転面の側の f_輪 の下限): 輪の法線は一様な背景だけに応える(第352便p の置き方)—— 散らばり θ₀ → θ₁ に寄る k₁ = ln(tan(θ₀/2) ÷ tan(θ₁/2)) ÷ (W_b t)(k₁ > 1 なら届かない)。
//   f が小さい所では k₁ ≈ f なので f_輪 ÷ f ≈ (x_輪 ÷ x)(W ÷ W_b)—— 背景が局所より十分大きい列では背景の大きさに依らない。
// ■ T1 の 3(位相ごとの步): 局所の (S) を、第352便k の spinRot と同じ場・同じ半径の平均で、公転の位相ごとに返す(位相の平均 = spinRot・partRot)。
//   離心率 e の列: 平均近点離角を等しい刻みに取り(時間の刻みが等しい)・距離 r = a(1 − e cos E)・真近点離角 ν の向きに源を置く(近点の向き = 源の自転軸 × 公転の法線 —— 宣言)。
//   (S) は相対の速度 0 の成分なので、位置だけが位相で変わる。
//   揺れ(章動に当たる): 位相の平均からのずれの積分 D(t) = ∫₀ᵗ (Ω(t′) − Ω̄) dt′ を、ずれから直接に積む(大きい数の差で作らない)。
//   ŝ のずれ δŝ = σ k₂ (D × ŝ) + k₁ (D − (D·ŝ) ŝ)(一次)。1 公転の後の、位相ごとの步と平均の步の差は二次(Magnus の第 2 項 M₂ = ½ ∫ (∫ Ω) × Ω —— ずれだけで書く)。
// ■ T3(円錐を 1 周する間の観測の傾き): 円錐の軸 â(合成の向き Ω̂/読み A の局所の (S) の向き)・半頂角 χ = ŝ と â の角・α = â と n̂ の角 →
//   ε の範囲 [abs(χ − α), min(χ + α, 360° − χ − α)]・周期 2π ÷ (k₂ × 率)(Ω̂: W・読み A: abs(局所))。
// ■ T5(金星の公転面が回るとき): 第352便n の turnRow の ψ の格子(公転の法線を基準軸のまわりに回す)から合成 Ω(ψ)(背景の大きさの単位)を作り、
//   輪が背景の軸のまわりを率 ρ W_b で回る間に、自転軸を (R3) の 2 経路で進める(無次元の時間 τ = W_b t・4 次の Runge–Kutta・Ω(ψ) は格子の三角関数の補間)。
// ■ 言わないこと: 傾きの由来・公転面の由来の答えとは書かない(上限と下限の表)。背景の向き・歳差の向き・基準軸・源の半径のどれも選ばない。この場・この読み・このノブでは、の表。
import * as P from './lib-w352p-coprec.mjs';
import * as O from './lib-w352o-obsradius.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as N from './lib-w352n-venuslong.mjs';
import * as I from './lib-w352i-stableprec.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import * as PV from './lib-w352b-provisional.mjs';

export const LIB_VERSION = 'w352w-keepcone-lib-1';
export { P, O, N };
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const angDeg = R3.angDeg;
export const YR = TL.YR;
export const ASYR = D.ASYR;
const rot = (v, n, phi) => I.rotAbout(v, n, phi);

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 表 1・2 の受け手: 8 惑星 + 太陽 + 月(傾き最大の位相)+ イオ(第352便o の localS の鍵) */
  keys: Object.freeze(['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Mars|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun', 'Sun|-', 'Moon|EarthHi', 'Io|Jupiter']),
  dirs: Object.freeze(['Np', 'Gm']), axes: Object.freeze(['L', 'eq']), tSrcs: Object.freeze([0, 1]),
  /** 背景の大きさ: (uV) 金星で (S) と大きさが同じ(源の半径の列ごと —— 第352便o の uVenusO)・倍率 1・(仮) 地球の歳差の率に k₂ 1 で届く倍率(仮・未照合) */
  mags: Object.freeze(['uV', 'u1', 'uP']),
  senses: D.DECL.senses, norm: 'N1',
  omegaG: P.DECL.omegaG, ageYr: P.DECL.ageYr,
  /** 傾きの変化の物差し: 割合 10%・角 1° */
  crits: Object.freeze([Object.freeze({ id: 'q10', kind: 'frac', X: 0.1 }), Object.freeze({ id: 'd1', kind: 'deg', X: 1 })]),
  /** 公転面の散らばり: 30° → 7°(第352便p と同じ)・比べる列 30° → 3° */
  spreads: Object.freeze([Object.freeze([30, 7]), Object.freeze([30, 3])]),
  /** 表 3 の円錐の軸: 合成の向き(慣性の枠)・読み A の局所の (S) の向き(同じ係数で輪と共回りする枠) */
  cones: Object.freeze(['om', 'locA']),
  /** 表 3(位相ごとの步): 受け手・離心率の格子(水星の行は BODY_SRC の値も)・位相の刻み */
  phaseBodies: Object.freeze(['Earth', 'Mars', 'Venus', 'Mercury']), eGrid: Object.freeze([0, 0.1]), nPhase: 72, phaseF: Object.freeze([0, 0.5]),
  eMercury: TL.BODY_SRC.Mercury.e[0],
  /** 表 4(金星の公転面が回る): ψ の格子の数・輪の回る率 ρ(W_b の単位)・f・無次元の時間の上限(k₁ τ)・刻み */
  nPsi: 36, rhos: Object.freeze([0, 1e-3, 1e-2, 1e-1, 1]), turnF: 0.5, k1tauMax: 12, dtau: 0.05, settleDeg: 1, nearDeg: 5,
  /** 仮の値の鍵(第352便b の器 —— 表に入れる数はこれだけ) */
  provKeys: Object.freeze(['earth.psiA.rate']),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── T1 の 1: 傾きを保つ f の上限 ───────── */
/** 縮みの対数 x(物差し crit: { kind: 'frac'|'deg', X })—— 上限なしなら Infinity */
export function shrinkLog(thDeg, crit) {
  if (!(fin(thDeg) && thDeg > 0 && thDeg < 180)) throw new RangeError('shrinkLog: 0 < θ < 180');
  if (!crit || !['frac', 'deg'].includes(crit.kind) || !(fin(crit.X) && crit.X > 0)) throw new RangeError('shrinkLog: 物差しは frac・deg(X > 0)');
  const th = thDeg * D2R;
  if (crit.kind === 'frac') { if (!(crit.X < 1)) throw new RangeError('shrinkLog: 割合は 0〜1'); return Math.log(Math.tan(th / 2) / Math.tan((1 - crit.X) * th / 2)); }
  if (thDeg <= crit.X) return Infinity;
  return Math.log(Math.tan(th / 2) / Math.tan((thDeg - crit.X) * D2R / 2));
}
/** f の上限(W rad/s・年齢 ageYr): { x, k1Max, fMax(上限なしは 1), noLimit } */
export function fKeep({ thDeg, W, crit, ageYr = DECL.ageYr }) {
  if (!(fin(W) && W > 0)) throw new RangeError('fKeep: W > 0');
  const x = shrinkLog(thDeg, crit), k1 = x / (W * ageYr * YR);
  if (!(k1 < 1)) return { x, k1Max: k1, fMax: 1, noLimit: true };
  return { x, k1Max: k1, fMax: P.fOfK1(k1), noLimit: false };
}

/* ───────── T1 の 2: 公転面の側の f_輪 の下限 ───────── */
/** 散らばり θ₀ → θ₁ に年齢の間に寄る f_輪 の下限(輪は背景 W_b だけに応える): { x, k1, f(届かなければ null), uMin(k₁ 1 で届く最小の倍率 —— ω_G の倍) } */
export function fRingMin({ th0Deg, th1Deg, Wb, ageYr = DECL.ageYr }) {
  if (!(fin(th0Deg) && fin(th1Deg) && th1Deg > 0 && th1Deg < th0Deg && th0Deg < 180 && fin(Wb) && Wb > 0)) throw new RangeError('fRingMin: 0 < θ₁ < θ₀ < 180・W_b > 0');
  const x = Math.log(Math.tan(th0Deg * D2R / 2) / Math.tan(th1Deg * D2R / 2)), k1 = x / (Wb * ageYr * YR);
  return { x, k1, f: k1 >= 1 ? null : P.fOfK1(k1), uMin: x / (DECL.omegaG * ageYr * YR) };
}

/* ───────── 受け手の状態(源の半径の列つき)───────── */
/** 倍率(mag 'uV' は源の半径の列ごとの金星の条件 —— 第352便o の uVenusO・'u1'・'uP' は仮の値の率 ÷ ω_G) */
export function uOf(mag, T1, GEO, { tSrc = 0 } = {}, cache = null, provRate = null) {
  if (mag === 'uV') return O.uVenusO(T1, GEO, { tSrc }, cache);
  if (mag === 'u1') return 1;
  if (mag === 'uP') { if (!(fin(provRate) && provRate > 0)) throw new RangeError('uOf uP: 仮の値の率(″/年 > 0)'); return provRate / ASYR / DECL.omegaG; }
  throw new RangeError('uOf: 大きさは uV・u1・uP');
}
/**
 * 受け手 key の状態: 背景 dir(Np・Gm)× 基準軸 axis(L・eq)× 倍率 u × 源の半径 tSrc(0 規則・1 観測)。局所 = 第352便o の localS の (S)(衛星は母天体由来 + 太陽由来)。
 * 輪の法線: 惑星・衛星 = 自分の公転の法線・太陽 = 基準軸。
 */
export function stateW(T1, GEO, key, { dir, axis, u, tSrc = 0 }, cache = null) {
  if (!DECL.dirs.includes(dir)) throw new RangeError('stateW: 背景の向きは Np・Gm');
  const A = (cache && cache.__ax) || RC.refAxes(T1, GEO); if (cache) cache.__ax = A;
  const ax = A[axis];
  if (!ax) throw new RangeError('stateW: 基準軸は L・eq');
  if (!(fin(u) && u >= 0)) throw new RangeError('stateW: 倍率 u ≥ 0');
  const L = O.localS(T1, GEO, key, { tSrc }, cache), loc = L.parent ? add(L.sun.S, L.parent.S) : L.sun.S.slice();
  const bg = D.bgVec(dir, { u, axis: ax }), Om = add(bg, loc), nRing = L.nHat ? unit(L.nHat) : unit(ax), s = unit(L.sHat);
  return { key, dir, axis, u, tSrc, sHat: s, nRing, bg, local: loc, Om, W: nrm(Om), Wb: nrm(bg), locOverBg: nrm(loc) / Math.max(nrm(bg), 1e-300),
    thDeg: angDeg(s, Om), oblDeg: angDeg(s, nRing), alphaDeg: angDeg(Om, nRing), ringBgDeg: angDeg(nRing, bg) };
}

/* ───────── T3: 円錐を 1 周する間の観測の傾き ───────── */
/** 円錐の軸 a・自転軸 s・法線 n から ε の範囲(閉じた形) */
export function coneRange(a, s, n) {
  if (!(isVec(a) && nrm(a) > 0 && isVec(s) && nrm(s) > 0 && isVec(n) && nrm(n) > 0)) throw new RangeError('coneRange: 軸・ŝ・n̂');
  const chi = angDeg(s, a), al = angDeg(a, n);
  return { chiDeg: chi, alphaDeg: al, oblMinDeg: Math.abs(chi - al), oblMaxDeg: Math.min(chi + al, 360 - chi - al), swingDeg: Math.min(chi + al, 360 - chi - al) - Math.abs(chi - al) };
}
/** 同じ範囲を ŝ を軸のまわりに N 点回して数える(零試験の照合) */
export function coneSweep(a, s, n, Nn = 720) {
  let mn = Infinity, mx = -Infinity;
  for (let j = 0; j < Nn; j++) { const e = angDeg(rot(unit(s), unit(a), 2 * Math.PI * j / Nn), n); mn = Math.min(mn, e); mx = Math.max(mx, e); }
  return { oblMinDeg: mn, oblMaxDeg: mx };
}
/** 状態 st の円錐の行(cone 'om' = Ω̂・率 W/'locA' = 局所の向き・率 abs(局所))—— f 0(k₂ 1)の周期(年) */
export function coneRow(st, cone, { f = 0 } = {}) {
  if (!DECL.cones.includes(cone)) throw new RangeError('coneRow: 円錐の軸は om・locA');
  const ax = cone === 'om' ? st.Om : st.local, rate = nrm(ax);
  if (!(rate > 0)) return { cone, ok: false };
  const k2 = R3.r3Coeffs(f, DECL.norm).kPrec, R = coneRange(ax, st.sHat, st.nRing);
  return { cone, ok: true, ...R, rateAsYr: rate * ASYR, periodYr: k2 > 0 ? 2 * Math.PI / (k2 * rate) / YR : null };
}

/* ───────── T1 の 3: 位相ごとの (S) ───────── */
const GL = H.gaussLegendre(8);
/** 平均近点離角 M から離心近点離角 E(Newton) */
export function keplerE(M, e) {
  if (!(fin(M) && fin(e) && e >= 0 && e < 1)) throw new RangeError('keplerE: 0 ≤ e < 1');
  let x = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 60; i++) { const d = (x - e * Math.sin(x) - M) / (1 - e * Math.cos(x)); x -= d; if (Math.abs(d) < 1e-15) break; }
  return x;
}
/**
 * 受け手 id(太陽のまわりの惑星)の太陽由来 (S) を公転の位相ごとに(rad/s)。tSrc = 源(太陽)の半径の置き方・e = 離心率(宣言の格子)・nPhase = 位相の数(時間の刻みが等しい)。
 * 返す { phases: [{ M, nu, r, Om }], mean, T(公転の周期 s), a, sHat, nHat }。e 0 の位相の平均は第352便k の spinRot(part 'S')と同じ。
 */
export function phaseRot(T1, GEO, id, { tSrc = 0, e = 0, nPhase = DECL.nPhase } = {}) {
  if (!(Number.isInteger(nPhase) && nPhase >= 4)) throw new RangeError('phaseRot: 位相の数 ≥ 4');
  if (!(fin(e) && e >= 0 && e < 1)) throw new RangeError('phaseRot: 0 ≤ e < 1');
  const Pq = SP.pairInput(T1, GEO, id, 'Sun'), Rr = G3.YK * Pq.m, Rs = K.srcRadius('Sun', tSrc);
  const x0 = crs(Pq.sAx, Pq.nHat), xh = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(Pq.nHat, Math.abs(Pq.nHat[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), yh = crs(Pq.nHat, xh);
  const radii = GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(Pq.sAx, Pq.ws), phases = [];
  let mean = [0, 0, 0];
  for (let j = 0; j < nPhase; j++) {
    const M = 2 * Math.PI * (j + 0.5) / nPhase, Ek = e === 0 ? M : keplerE(M, e);
    const nu = e === 0 ? M : 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(Ek / 2), Math.sqrt(1 - e) * Math.cos(Ek / 2)), r = Pq.a * (1 - e * Math.cos(Ek));
    const rh = add(scl(xh, Math.cos(nu)), scl(yh, Math.sin(nu)));
    let Om = [0, 0, 0];
    for (const [Ri, wt] of radii) {
      const f = G3.makeField3({ sources: [{ m: Pq.Ms, R: Rs, p: scl(rh, -r), v: [0, 0, 0], spin }], recv: { m: Pq.m, R: Ri, p: [0, 0, 0], v: [0, 0, 0] },
        W0: 0, extraW: 0, kernel: { kind: 'ball', al: 1 }, rot: { form: 'M' }, self: true, mut: null });
      Om = add(Om, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), wt));
    }
    phases.push({ M, nu, r, Om }); mean = add(mean, scl(Om, 1 / nPhase));
  }
  return { phases, mean, T: 2 * Math.PI * Pq.a / Pq.vOrb, a: Pq.a, sHat: unit(Pq.sHat), nHat: unit(Pq.nHat), Rs };
}
/**
 * 位相ごとの (S) の揺れ: phases(局所の Om の列 —— 等しい時間の刻み)・ŝ・周期 T・比率 f・向き sense・一定の背景 bg(平均にだけ入る)。ずれ δ_j = Ω_j − Ω̄ から直接に:
 *   D の頂点(区切りごとの積分)・ŝ のずれの最大(一次 —— rad)・1 公転の後の二次の差 abs(M₂) × k₂²(rad)。
 * 返す { varRel(abs(δ) の最大 ÷ abs(Ω̄)), ampRad, ampAs, perpAmpRad(D の ŝ に直交する成分の最大), parAmpRad, m2Rad, m2As, netRad(D(T) —— 床) }
 */
export function wobbleOf(phases, { sHat, T, f = 0, sense = 'g2p', bg = [0, 0, 0] }) {
  if (!(Array.isArray(phases) && phases.length >= 4 && isVec(sHat) && fin(T) && T > 0 && isVec(bg))) throw new RangeError('wobbleOf: 位相・ŝ・T > 0・背景');
  const Nn = phases.length, dt = T / Nn, s = unit(sHat), k = I.kOf(f, sense);
  // ずれは局所の位相の値から作る(背景は一定 —— 平均にだけ足す。背景を足した後の差でずれを作らない)
  const locMean = phases.reduce((t, p) => add(t, scl(p.Om, 1 / Nn)), [0, 0, 0]), del = phases.map((p) => sub(p.Om, locMean)), mean = add(locMean, bg);
  // 平均を差し引いたずれの和が 0 になるよう、平均の丸めの分を割り振る(ずれの和の残りは床)
  const rest = scl(del.reduce((t, d) => add(t, d), [0, 0, 0]), 1 / Nn), dd = del.map((d) => sub(d, rest));
  let Dv = [0, 0, 0], amp = 0, pa = 0, pp = 0, m2 = [0, 0, 0], Dsum = [0, 0, 0], vmax = 0;
  for (let j = 0; j < Nn; j++) {
    // M₂ = ½ Σ_j (Σ_{i<j} Ω_i dt) × Ω_j dt を、Ω_i = Ω̄ + δ_i で書いて δ だけの項に: j Ω̄ × δ_j + Δ_j × Ω̄ + Δ_j × δ_j(Δ_j = Σ_{i<j} δ_i)
    m2 = add(m2, scl(add(add(scl(crs(mean, dd[j]), j), crs(Dsum, mean)), crs(Dsum, dd[j])), 0.5 * dt * dt));
    Dsum = add(Dsum, dd[j]);
    Dv = scl(Dsum, dt);
    const par = dot(Dv, s), perp = sub(Dv, scl(s, par)), ds = add(scl(crs(Dv, s), k.k2s), scl(perp, k.k1));
    amp = Math.max(amp, nrm(ds)); pa = Math.max(pa, Math.abs(par)); pp = Math.max(pp, nrm(perp)); vmax = Math.max(vmax, nrm(dd[j]));
  }
  const m2r = nrm(crs(m2, s)) * k.k2 * k.k2;
  return { varRel: vmax / Math.max(nrm(mean), 1e-300), ampRad: amp, ampAs: amp * 180 * 3600 / Math.PI, perpAmpRad: pp, parAmpRad: pa, m2Rad: m2r, m2As: m2r * 180 * 3600 / Math.PI,
    netRad: nrm(Dv), meanRateAsYr: nrm(mean) * ASYR, turnRad: nrm(mean) * T };
}
/** 位相ごとに ŝ を進める步(f 0 は各位相の回転を閉じた形で —— Ω_j のまわりに σ k₂ abs(Ω_j) dt)と平均の步(Ω̄ のまわり)。零試験と誇張した場の確かめに使う */
export function stepPhases(phases, { s0, T, sense = 'g2p', mean = true }) {
  const Nn = phases.length, dt = T / Nn, sg = sense === 'g2p' ? 1 : -1;
  const Om = mean ? [phases.reduce((t, p) => add(t, scl(p.Om, 1 / Nn)), [0, 0, 0])] : phases.map((p) => p.Om);
  let s = unit(s0); const track = [];
  for (let j = 0; j < Nn; j++) { const w = Om[mean ? 0 : j]; s = rot(s, unit(w), sg * nrm(w) * dt); track.push(s); }
  return { s, track };
}

/* ───────── T5: 金星の公転面が回るとき ───────── */
/** ψ の格子の合成(背景の大きさの単位): 第352便n の turnRow(ref = 基準軸・b̂ = 背景の向き)—— 返す { psis, Om: [[3]…], res: [...] } */
export function turnGrid(T1, GEO, { axis, nPsi = DECL.nPsi }, cache = null) {
  const A = RC.refAxes(T1, GEO), ref = A[axis], G = GEO['Venus|Sun'], b1 = N.b1(), uV = N.uVOf(T1, GEO, cache);
  const nHat0 = unit(G.n), sHat0 = unit(G.w), psis = [], Om = [], res = [];
  for (let j = 0; j < nPsi; j++) { const psi = 360 * j / nPsi, r = N.turnRow(T1, GEO, { psiDeg: psi, ref, bHat: ref, uV, b1, nHat0, sHat0 }); psis.push(psi); Om.push(r.Om); res.push(r.res); }
  return { axis, ref, psis, Om, res, nHat0, sHat0 };
}
/** ψ(度)での合成を格子の三角関数の補間で(格子の点では格子の値そのもの) */
export function omAtPsi(Gd, psiDeg) {
  const Nn = Gd.Om.length, x = (((psiDeg % 360) + 360) % 360) / 360 * Nn, out = [0, 0, 0];
  for (let j = 0; j < Nn; j++) {
    const u = x - j; let w;
    if (Math.abs(u) < 1e-12) w = 1; else { const a = Math.PI * u / Nn; w = Math.sin(Nn * a) / (Nn * Math.tan(a)); }   // 偶数点の周期の sinc(Dirichlet の核)
    for (let c = 0; c < 3; c++) out[c] += w * Gd.Om[j][c];
  }
  return out;
}
/** ψ の格子の平均の合成(ベクトルの平均)と残りの平均(大きさの平均) */
export function turnMean(Gd) {
  const Nn = Gd.Om.length, m = Gd.Om.reduce((t, v) => add(t, scl(v, 1 / Nn)), [0, 0, 0]);
  return { vecMean: m, vecMeanMag: nrm(m), resMean: Gd.res.reduce((t, x) => t + x / Nn, 0), resMin: Math.min(...Gd.res), resMax: Math.max(...Gd.res), angRefDeg: angDeg(m, Gd.ref) };
}
/**
 * 公転面と自転軸を同時に進める(無次元 τ = W_b t): 輪の法線 n̂ は基準軸(= (N+) の背景の向き)のまわりを率 ρ で回る(ψ = ψ₀ + ρ τ ×(180/π)・傾きは保つ)・
 * 自転軸は Ω(ψ) で第352便d の r3Ds((N1) の f・向き sense)。4 次の Runge–Kutta + 単位への正規化。
 * 返す { tauEnd, sEnd, oblEndDeg(終わりの ε)・oblLastMin/Max(最後の 1 割の ε の範囲)・angRefEndDeg・tauSettle(最後の向きから settleDeg 以内に入った τ —— 入らなければ null)}
 */
export function turnStep(Gd, { rho, f = DECL.turnF, sense, k1tauMax = DECL.k1tauMax, dtau = DECL.dtau, s0 = null, keepTrack = false }) {
  if (!(fin(rho) && fin(dtau) && dtau > 0)) throw new RangeError('turnStep: ρ・dτ > 0');
  const c = R3.r3Coeffs(f, DECL.norm), kk = { sense, kTilt: c.kTilt, kPrec: c.kPrec };
  const res0 = Gd.res[0], k1 = Math.max(c.kTilt, 1e-12), tauEnd = k1tauMax / (k1 * Math.max(res0, 1e-6));   // 長さは今の公転面の残り(ψ 0)で揃える
  const nStep = Math.ceil(tauEnd / dtau), h = tauEnd / nStep;
  const F = (s, tau) => D.r3Ds(s, omAtPsi(Gd, rho * tau / D2R), kk);
  let s = unit(s0 || Gd.sHat0), tau = 0; const tr = [];
  for (let i = 0; i < nStep; i++) {
    const a1 = F(s, tau), a2 = F(unit(add(s, scl(a1, h / 2))), tau + h / 2), a3 = F(unit(add(s, scl(a2, h / 2))), tau + h / 2), a4 = F(unit(add(s, scl(a3, h))), tau + h);
    s = unit(add(s, scl(add(add(a1, scl(a2, 2)), add(scl(a3, 2), a4)), h / 6))); tau += h;
    const n = rot(Gd.nHat0, Gd.ref, rho * tau);
    tr.push({ tau, s, obl: angDeg(s, n) });
  }
  const sEnd = s, last = tr.slice(Math.floor(tr.length * 0.9));
  // 落ち着き: ρ 0 は終わりの向きから settleDeg 以内に留まり始めた τ/ρ > 0 は ψ の平均の合成の軸(turnMean の vecMean)から nearDeg 以内に留まり始めた τ(入らなければ null)
  const tgt = rho === 0 ? sEnd : turnMean(Gd).vecMean, thr = rho === 0 ? DECL.settleDeg : DECL.nearDeg;
  let tauSettle = null;
  for (let i = tr.length - 1; i >= 0; i--) { if (angDeg(tr[i].s, tgt) > thr) { tauSettle = i === tr.length - 1 ? null : tr[i + 1].tau; break; } if (i === 0) tauSettle = 0; }
  const out = { rho, f, sense, tauEnd, nStep, sEnd, oblEndDeg: tr[tr.length - 1].obl, oblLastMinDeg: Math.min(...last.map((x) => x.obl)), oblLastMaxDeg: Math.max(...last.map((x) => x.obl)),
    angRefEndDeg: angDeg(sEnd, Gd.ref), angMeanEndDeg: angDeg(sEnd, turnMean(Gd).vecMean), angMeanLastMaxDeg: Math.max(...last.map((x) => angDeg(x.s, turnMean(Gd).vecMean))), tauSettle };
  if (keepTrack) out.track = tr;
  return out;
}

/* ───────── 零試験 ───────── */
/** 第352便p の正本の数(地球 (N+) L の f の上限 —— 倍率 1・仮・公転面の 30° → 7° の f_輪 —— 倍率 1) */
export const ANCHOR = Object.freeze({ pEarthU1: '8.4e-4', pEarthUP: '9.8e-8', pRingU1: '1.1e-2' });
const e2 = (x) => Number(x).toExponential(1);
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const cache = {}, A = RC.refAxes(T1, GEO);
  // ① 第352便p の表の数を本 lib の式で作り直す(地球 (N+) L・割合 10%・倍率 1 と仮・f_輪 30° → 7°・倍率 1)
  const provRate = Math.abs(PV.provValue(DECL.provKeys[0]));   // 第352便b の台帳の数(仮・未照合)
  const st1 = stateW(T1, GEO, 'Earth|Sun', { dir: 'Np', axis: 'L', u: 1 }, cache), uP = uOf('uP', T1, GEO, {}, cache, provRate), stP = stateW(T1, GEO, 'Earth|Sun', { dir: 'Np', axis: 'L', u: uP }, cache);
  const k10 = DECL.crits[0], fp1 = fKeep({ thDeg: st1.thDeg, W: st1.W, crit: k10 }), fpP = fKeep({ thDeg: stP.thDeg, W: stP.W, crit: k10 });
  const fr = fRingMin({ th0Deg: 30, th1Deg: 7, Wb: st1.Wb });
  const pRef = { u1: P.fMax({ thDeg: st1.thDeg, W: st1.W }).fMax, ring: P.fRingFor({ targetDeg: 7, W: DECL.omegaG * 1 }).f };
  // ② stateW(規則の半径)は第352便p の stateOf と同じ合成・ŝ・輪の法線(地球・火星・太陽を除く —— 太陽は局所を入れる)
  let stErr = 0;
  for (const id of ['Earth', 'Mars', 'Venus']) for (const dir of ['Np', 'Gm']) for (const axis of ['L', 'eq']) {
    const a = stateW(T1, GEO, id + '|Sun', { dir, axis, u: 1 }, cache), b = P.stateOf(T1, GEO, id, { dir, axis, u: 1 }, cache);
    stErr = Math.max(stErr, nrm(sub(a.Om, b.Om)) / nrm(b.Om), nrm(sub(a.sHat, b.sHat)), nrm(sub(a.nRing, b.nRing))); }
  // ③ 1° の物差し: θ ≤ 1° は上限なし・θ が大きいと割合の物差しに近い式(x = ln(tan(θ/2) ÷ tan((θ − 1°)/2)))・thAfter で年齢の後に 1° 縮む
  const d1 = DECL.crits[1], fd = fKeep({ thDeg: 23.44, W: 1e-12, crit: d1 }), ta = I.thAfter({ thDeg: 23.44, W: 1e-12, f: fd.fMax, sense: 'g2p', tYr: DECL.ageYr });
  const small = fKeep({ thDeg: 0.8, W: 1e-12, crit: d1 });
  // ④ f_輪 の下限で年齢の後に目標の角(第352便i の thAfter)・uMin で k₁ = 1
  const fr2 = fRingMin({ th0Deg: 30, th1Deg: 7, Wb: 1e-14 }), tr2 = I.thAfter({ thDeg: 30, W: 1e-14, f: fr2.f, sense: 'g2p', tYr: DECL.ageYr });
  const umErr = Math.abs(fRingMin({ th0Deg: 30, th1Deg: 7, Wb: DECL.omegaG * fr2.uMin }).k1 - 1);
  // ⑤ 円錐の範囲: 閉じた形 = 回して数えた範囲(3 つの向き)
  let cErr = 0;
  for (const [a, s, n] of [[[0.1, 0.2, 0.97], [0.5, -0.1, 0.86], [0, 0, 1]], [[0, 0, 1], [0.9, 0, -0.43], [0.2, 0.1, 0.97]], [[0.3, 0.9, 0.1], [0, 0.2, 0.98], [-0.6, 0, 0.8]]]) {
    const c = coneRange(a, s, n), w = coneSweep(a, s, n, 3600); cErr = Math.max(cErr, Math.abs(c.oblMinDeg - w.oblMinDeg), Math.abs(c.oblMaxDeg - w.oblMaxDeg)); }
  // ⑥ 位相の平均 = 第352便k の spinRot・第351便c の partRot(e 0・規則の半径)・第352便o の localS(観測の半径)
  const ph0 = phaseRot(T1, GEO, 'Earth', { tSrc: 0 }), ph1 = phaseRot(T1, GEO, 'Earth', { tSrc: 1 });
  const kS = K.spinRot(T1, GEO, 'Earth', 'Sun', { part: 'S' }).Om, pS = SP.partRot(T1, GEO, 'Earth', 'Sun', { part: 'S' }).Om, oS = O.localS(T1, GEO, 'Earth|Sun', { tSrc: 1 }, cache).sun.S;
  const meanErr = Math.max(nrm(sub(ph0.mean, kS)) / nrm(kS), nrm(sub(ph0.mean, pS)) / nrm(pS), nrm(sub(ph1.mean, oS)) / nrm(oS));
  // ⑦ 誇張した場で、位相ごとの步と平均の步: 途中のずれの最大が一次の式(wobbleOf の ampRad)と同じ・1 公転の後の差が二次の式(m2Rad)と同じ(f 0・向き 2)
  const big = ph0.phases.map((p) => ({ Om: scl(p.Om, 1 / nrm(ph0.mean)) })), Tb = 2e-3, sb = unit([0.3, 0.2, 0.93]);
  const ex = D.DECL.senses.map((sense) => {
    const w = wobbleOf(big, { sHat: sb, T: Tb, f: 0, sense }), a = stepPhases(big, { s0: sb, T: Tb, sense, mean: false }), b = stepPhases(big, { s0: sb, T: Tb, sense, mean: true });
    const mid = Math.max(...a.track.map((x, j) => nrm(sub(x, b.track[j])))), end = nrm(sub(a.s, b.s));
    return { ampRel: Math.abs(mid / w.ampRad - 1), endRel: Math.abs(end / w.m2Rad - 1), amp: w.ampRad, end }; });
  // ⑧ 離心率: e 0 で keplerE は M・r = a(位相が spinRot と同じ)・e 0.2 の Kepler の方程式の残り
  const kp = Math.abs(keplerE(1.3, 0.2) - 0.2 * Math.sin(keplerE(1.3, 0.2)) - 1.3), ke0 = Math.abs(keplerE(0.7, 0) - 0.7);
  // ⑨ 金星の ψ の格子: ψ 0 は第352便n の turnRow の今の向き・補間は格子の点で格子の値・ρ 0 の步の行き先は第352便n の finalOf の点(読み α)
  const Gd = turnGrid(T1, GEO, { axis: 'eq', nPsi: 12 }, cache), it = Math.max(...Gd.psis.map((p, j) => nrm(sub(omAtPsi(Gd, p), Gd.Om[j])))), mid15 = omAtPsi(Gd, 15);
  const n0 = N.stateOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', u: N.uVOf(T1, GEO, cache) }, cache), resErr = Math.abs(Gd.res[0] - n0.resOverBg) / n0.resOverBg;
  const fo = N.finalOf({ s0: Gd.sHat0, oh: Gd.Om[0], nHat: Gd.nHat0, f: 0.5, sense: 'g2p', read: 'alpha' });
  const st0 = turnStep(Gd, { rho: 0, f: 0.5, sense: 'g2p', k1tauMax: 14, dtau: 0.5 }), finErr = Math.abs(st0.oblEndDeg - fo.epsDeg);
  // 拒否
  const rej = [() => shrinkLog(0, d1), () => shrinkLog(10, { kind: 'x', X: 1 }), () => fKeep({ thDeg: 10, W: 0, crit: k10 }), () => fRingMin({ th0Deg: 7, th1Deg: 30, Wb: 1 }),
    () => stateW(T1, GEO, 'Earth|Sun', { dir: 'Gp', axis: 'L', u: 1 }), () => uOf('uX', T1, GEO), () => coneRow(st1, 'x'), () => phaseRot(T1, GEO, 'Earth', { e: 1 }), () => keplerE(1, -0.1)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { p: { u1: fp1.fMax, uP: fpP.fMax, ring: fr.f, refU1: pRef.u1, refRing: pRef.ring }, stErr, d1: { drop: ta.dropDeg, noLim: small.noLimit }, ring: { th: tr2.alpha, umErr }, cErr, meanErr,
    ex, kepler: { kp, ke0 }, turn: { it, resErr, finErr, midFinite: mid15.every(fin), fo: fo.epsDeg, st0: st0.oblEndDeg }, rejects: rej };
}
export function pureGates(S) {
  return {
    pTable: e2(S.p.u1) === ANCHOR.pEarthU1 && e2(S.p.uP) === ANCHOR.pEarthUP && e2(S.p.ring) === ANCHOR.pRingU1 && Math.abs(S.p.u1 / S.p.refU1 - 1) < 1e-12 && Math.abs(S.p.ring / S.p.refRing - 1) < 1e-9,
    sameState: S.stErr < 1e-12,
    critDeg: Math.abs(S.d1.drop - 1) < 1e-9 && S.d1.noLim === true,
    ringMin: Math.abs(S.ring.th - 7) < 1e-9 && S.ring.umErr < 1e-12,
    coneClosed: S.cErr < 1e-3,
    phaseMean: S.meanErr < 1e-12,
    wobbleOrder: S.ex.length === 2 && S.ex.every((x) => x.ampRel < 5e-3 && x.endRel < 5e-2),
    kepler: S.kepler.kp < 1e-14 && S.kepler.ke0 === 0,
    turnGrid: S.turn.it < 1e-12 && S.turn.resErr < 1e-9 && S.turn.midFinite && S.turn.finErr < 1e-3,
    rejects: S.rejects.length === 9 && S.rejects.every(Boolean),
  };
}

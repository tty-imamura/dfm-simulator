// 第337便b(原仮定者の指示(2026-11-14 —— 第138報)「太陽の自転方向に対して、水星の公転は順回転。北側からと南側からの２回、赤道面を横切る。赤道面に近付くにつれて、引きずりで回転量が順方向に増す。
//   太陽を焦点のひとつとする楕円軌道なので、赤道面を横切るタイミングは近点に近い。赤道面からの距離も、近点は遠点より近い」「並進引きずりと、回転引きずりの、それぞれの近点移動への影響を精査する」・
//   探索の方針(第138報 —— 式の形を走行の前に決め打ちしない・1 つのノブで同時に満たせないならノブを足す)・統括の検証項目 R338):
//   **水星の赤道帯の純関数 —— 赤道面を横切る幾何の表(交点の真近点角・距離・近点からの時間・高さの比と平均)・寄与の分解(並進引きずりの動径/接線・並進の座標変換に入る源の回転・G_loc の次数・
//   第335便c の回転の列)の一次の率を同じ行に・真近点角の区間ごとの効き・赤道帯の回転の候補(ノブ: 強さ λ_B・帯の厚み H・落ち方 q・距離のべき p・速さの列・作用の型・作用の向き)・
//   部分積分の読みの一次の率(速度の型を微分なしで —— 細い帯でも積分できる)・単位の軌道への写し(純粋な積分器と二次の結合)**
//   (器 tests/exp-w337b-mercuryband.mjs と QA behavior.mercuryband337b・docs.mercuryband337b が読む —— html を読まない・状態を持たない・
//   第332便a・第333便c・第334便c・第335便c の lib は呼ぶだけ・エンジンの式を写さない)。**本枝は赤道帯の回転の候補と水星の分解の唯一の持ち主**(供給と減衰・場の読み・ロックの条件・
//   加減速の損失・流体の自己の重みは持たない)。
//
// ■ 区別(各表・各式に付ける —— 作業仮説と今のコードの実装を混ぜない)
//   実装 = 今の beta の html にある型(G_loc の力の型 —— 受け手 n = 2・K1 の並進)/診断 = この lib の一次の率(Gauss の式の軌道の平均)と純粋な積分器/
//   宣言(未接続)= 今のエンジンに無い型(統合した並進引きずりの分解・第335便c の回転の列・**赤道帯の回転の候補**)。赤道帯の候補は新しい場の仮定(座標系の変更と同じ扱いにしない)。
// ■ 赤道帯の回転の候補(探索 —— 型はここから足してよい・採用ではない): 源の自転の向きの速度の場を、赤道面からの高さで重み付ける
//   δC = λ_B · B(z) · (r_* / r)^p · s_* · (ŝ × p)・B(z) = 1/(1 + (|z|/H)^q)(z = p·ŝ —— 符号つき・赤道面で B = 1・高さとともに落ちる)。
//   ノブ: 強さ λ_B(無次元 —— 一次の率は λ_B に比例するので、λ_B の範囲は 1 回の走行の係数から読む)・帯の厚み H(太陽の半径の倍・R_d = Y_k m_☉ の倍・距離に比例〔開き角 θ: H = r tan θ〕)・
//   落ち方 q・距離のべき p(速度の場は r^{1−p} —— p = 0 は剛体の回転)・参照の長さ r_* = 1 au(天体を替えても同じ λ_B が同じ場)・速さの列 s_*(観測自転 s/J 等価 s_d —— 一次では λ_B の尺度を
//   s/s_d 倍〔押しは (s/s_d)² 倍〕に移すだけ)・作用の型(vel = 速度の場〔座標を運ぶ —— 位置の速さに足す〕/push = 押し a = λ_B B (r_* / r)^p s_*² (ŝ × p))・
//   作用の向き(phi = ŝ × p そのもの/inPlane = 受け手の公転面へ射影 —— 走行の後に足したノブ: phi の型は L̂ を大きく回すので、面を動かさない型を比べる)。
//   **ノブ 0(λ_B = 0)で今の組と同じ**(門)。
// ■ 部分積分の読み(速度の型の一次の率 —— 微分を使わない): F = Dd/Dt を無摂動の軌道に沿って一周で平均すると、境界の項が消えて
//   ⟨dh/dt⟩ = −⟨v × d⟩・⟨de/dt⟩ = −⟨a × (p × d) + v × (v × d)⟩/μ・⟨v·F⟩ = −⟨a·d⟩(a = −μ p/r³)。第333便c の velocityToAccel(中心差分)の読みと全周で同じ値(門)で、
//   帯が細くても(H = R_d —— 横切る時間は数秒)積分の点を交点の近くへ寄せれば積める。積分の点: 2 つの交点の間の弧を半分に分け、交点からの高さ H·2^k(k = −8 …)で区切った小区間 + 一様な区切り
//   (π/16 以下)に Gauss–Legendre 24 点。
// ■ 言わないこと: 表は「候補」「探索」「未較正」「このノブの組では」。赤道帯の回転で水星の近点が出たとは書かない。暦表の追加の歳差の幅は参考の尺度(観測の 1σ ではない —— 本環境では未照合)。
//   一次の率は無摂動の軌道の平均(写しの時間発展ではない)。
import { stateAt, frameOfElements, anglesOn, poleToEcliptic, velocityToAccel, toArcsecCy, CENTURY_S, GEOM, DECL as DECL333C, vec, q1PNPerOrbit, dragSpin } from './lib-w333c-mercury3d.mjs';
import { vectorRates, effectOf, eOfF, splitAbout, kappaMRadius, LIT as LIT334C, integrateFrame } from './lib-w334c-mercurynode.mjs';
import { columnEffect, splitField, unitField } from './lib-w335c-mercurycombo.mjs';
import { glNodes } from './lib-w332a-eqband.mjs';

export const LIB_VERSION = 'w337b-mercuryband-lib-1';
const isFin = Number.isFinite;
const D2R = Math.PI / 180;
const { add, sub, scl, dot, crs, nrm, unit } = vec;
const wrapPi = (x) => Math.atan2(Math.sin(x), Math.cos(x));
export const asec = (r) => (r === null || r === undefined ? null : toArcsecCy(r));

/* ───────── 宣言(走らせた格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  G: DECL333C.G, c: DECL333C.c,
  planets: Object.freeze(['merc', 'venus', 'earth', 'mars']),
  /** 赤道帯の候補のノブの格子 */
  band: Object.freeze({
    types: Object.freeze(['vel', 'push', 'rel']),
    H: Object.freeze([Object.freeze({ kind: 'Rsun', mult: 1 }), Object.freeze({ kind: 'Rsun', mult: 3 }), Object.freeze({ kind: 'Rsun', mult: 10 }),
      Object.freeze({ kind: 'Rd', mult: 1 }), Object.freeze({ kind: 'Rd', mult: 1e4 }), Object.freeze({ kind: 'angle', mult: 1 }), Object.freeze({ kind: 'angle', mult: 5 })]),
    q: Object.freeze([1, 2, 4, 8]),
    p: Object.freeze([0, 1, 2, 3]),
    dirs: Object.freeze(['phi', 'inPlane']),
    speeds: Object.freeze(['obs', 'jEquiv']),
    rRefAU: 1,
  }),
  /** J 等価の速さ(第333便c の dragSpin —— λ_J = 1・太陽の慣性モーメントの係数 0.07・f_d 0.4・R_d = Y_k m_☉) */
  jEquiv: Object.freeze({ lambdaJ: 1, fObs: 0.07 }),
  /** 部分積分の読みの積分の点(GL の点・区切りの最小の段 k・一様な区切りの最大の幅) */
  quad: Object.freeze({ gl: 24, kMin: -8, maxSeg: Math.PI / 16 }),
  /** 区間(真近点角の 36 区間 —— 中心 f = 10k°・幅 10°)の GL の点 */
  nBins: 36, binGL: 24,
  /** 幾何の表の時間の平均の格子(平均近点角の一様な点) */
  geomNodes: 4096,
  /** 置き換えの組(今の組の一部を候補で置き換えて 1PN の面内の近点の回転に入るか —— 候補が担う ω_W = q_1PN − 残す列の和) */
  replace: Object.freeze([
    Object.freeze({ key: 'tangent', label: '接線の分を候補で(G_loc n = 2 + 動径の分 + 候補)', keep: Object.freeze(['gloc2', 'transRadial']) }),
    Object.freeze({ key: 'k1', label: 'K1 を候補で(G_loc n = 2 + 候補)', keep: Object.freeze(['gloc2']) }),
    Object.freeze({ key: 'gloc', label: 'G_loc を候補で(K1 + 候補)', keep: Object.freeze(['k1']) }),
    Object.freeze({ key: 'gloc1', label: 'G_loc を n = 1 に(G_loc n = 1 + K1 + 候補)', keep: Object.freeze(['gloc1', 'k1']) }),
    Object.freeze({ key: 'all', label: '全部を候補で(候補だけ)', keep: Object.freeze([]) }),
  ]),
  /** 判定の物差し(何と比べて「合う」と言うか) */
  yardstick: Object.freeze({
    varpi: '暦表の追加の近点の歳差 Δϖ(第334便c の LIT —— 第335便c の訂正の後・本環境では未照合)の [値 − 幅, 値 + 幅] に候補の黄道の ϖ の率が入る',
    node: '暦表の追加の交点の歳差 ΔΩ(第334便c の LIT —— 幅は残差の変化 5% の区間で 1σ ではない)の [値 − 幅, 値 + 幅] に候補の黄道の Ω_node の率が入る(地球は文献の値が無い —— 太陽の赤道面の交点を ϖ の尺度で読む宣言の物差し)',
    period: '宣言の物差し(文献の幅ではない): 平均運動の永年の変化が 1 世紀で平均経度に積む角 |½ ṅ T²|(T = 1 世紀)が ϖ の比べる尺度(|値| + 幅)の内',
    ecc: '宣言の物差し(文献の幅ではない): 1 世紀の離心率ベクトルの変化 |ė| T が e × ϖ の比べる尺度(rad)の内',
    lambdaSign: 'λ_B > 0 が源の自転と同じ向き(順方向 —— 第138報のイメージ)。λ_B < 0 が要る組は「逆向きが要る」と書く',
  }),
  /** 純粋な積分器(T4 —— 単位の軌道 μ = a = 1・刻み 2 つ・窓)と二次の結合(並進 × 赤道帯) */
  integ: Object.freeze({ steps: Object.freeze([2000, 4000]), nOrb: 12, maxReps: 3 }),
  mix: Object.freeze({ cT: 1e-4, xPerOrbit: 1e-4, steps: Object.freeze([2000, 4000]), nOrb: Object.freeze([8, 16]), resolveFactor: 10, bilinTol: 0.05 }),
  breakPerOrbit: DECL333C.breakPerOrbit,
});
/** 文献の値(第334便c の LIT を呼ぶ —— 本環境では未照合)と幅の意味 */
export const LIT = Object.freeze({
  src: '第334便c の lib の LIT(第335便c で火星の近点の側を訂正 —— 外の照合の記録 + 記憶の値・本環境から一次資料は未到達・本環境では未照合)',
  dvarpi: LIT334C.dvarpi, dnode: LIT334C.dnode, widthMeaning: LIT334C.widthMeaning,
  sunEquatorRef: Object.freeze({ incDeg: 3.381, omegaDeg: 109.58, src: '統括の参考の試作の太陽の赤道面に対する水星の傾きと近点引数(照合の相手 —— 本枝は GEOM の要素と太陽の極から積む)' }),
});

/* ───────── 系(GEOM の要素と太陽の極から —— html を読まない)───────── */
export function systemOfLit(key) {
  const P = GEOM.planets[key];
  if (!P) throw new RangeError('systemOfLit: 天体 ' + key);
  const M = GEOM.sun.m, AU = GEOM.AU, fr = frameOfElements({ I: P.I, Om: P.Om, varpi: P.varpi });
  const orb = { a: P.a * AU, e: P.e, mu: DECL.G * (M + P.m), P: fr.P, Q: fr.Q, W: fr.W };
  const pole = poleToEcliptic(GEOM.sunPole.ra, GEOM.sunPole.dec).u;
  return { key, ja: P.ja, M, m: P.m, R: P.R, sunAxis: pole, sSun: 2 * Math.PI / (GEOM.sunSpinPeriodDays.value * 86400), Rsun: GEOM.sun.R, orb };
}
const nOf = (orb) => Math.sqrt(orb.mu / orb.a ** 3);
const periodOf = (orb) => 2 * Math.PI / nOf(orb);
const rOfF = (orb, f) => orb.a * (1 - orb.e * orb.e) / (1 + orb.e * Math.cos(f));
const mOfF = (orb, f) => { const E = eOfF(f, orb.e); return wrapPi(E - orb.e * Math.sin(E)); };

/* ───────── T1 幾何の表 ───────── */
/** 太陽の赤道面に対する交点・距離・近点からの時間・高さ(第138報の文を 1 つずつ数に) */
export function geometryOf(sys, { nodes = DECL.geomNodes, bandH = null } = {}) {
  const { orb } = sys, s = unit(sys.sunAxis), g = anglesOn(orb, s), e = orb.e, a = orb.a, Pd = periodOf(orb);
  const cosI = dot(orb.W, s), sinI = Math.sin(g.i), om = g.omega;
  const fa = wrapPi(-om), fd = wrapPi(Math.PI - om);
  const at = (f) => { const M = mOfF(orb, f); return { fDeg: f / D2R, rOverA: rOfF(orb, f) / a, Mdeg: M / D2R, tFromPeriDays: M / nOf(orb) / 86400, fracPeriod: M / (2 * Math.PI), periSideF: Math.abs(f) < Math.PI / 2, periSideM: Math.abs(M) < Math.PI / 2 }; };
  const zOf = (f) => rOfF(orb, f) * sinI * Math.sin(om + f);
  const zP = zOf(0), zA = zOf(Math.PI);
  // 時間の平均(平均近点角の一様な点)
  let sAll = 0, sPeri = 0, sApo = 0, nP = 0, nA = 0, latAll = 0, inBand = { peri: 0, apo: 0 }, zMaxAbs = 0;
  for (let k = 0; k < nodes; k++) {
    const M = (k + 0.5) * 2 * Math.PI / nodes - Math.PI, st = stateAt(orb, M), z = Math.abs(dot(st.x, s));
    sAll += z; latAll += z / st.r; zMaxAbs = Math.max(zMaxAbs, z);
    if (Math.abs(M) < Math.PI / 2) { sPeri += z; nP++; if (bandH && z <= bandH) inBand.peri++; } else { sApo += z; nA++; if (bandH && z <= bandH) inBand.apo++; }
  }
  const out = {
    key: sys.key, ja: sys.ja, a, e, periodDays: Pd / 86400, iSunDeg: g.i / D2R, omegaSunDeg: om / D2R, prograde: cosI > 0, LdotS: cosI,
    asc: at(fa), desc: at(fd),
    zPeri: zP, zApo: zA, heightRatio: Math.abs(zP) / Math.abs(zA), heightRatioExpect: (1 - e) / (1 + e),
    zMax: zMaxAbs, zMaxOverRsun: zMaxAbs / sys.Rsun,
    meanAbsZ: sAll / nodes, meanAbsZPeriHalf: sPeri / nP, meanAbsZApoHalf: sApo / nA, meanLatRad: latAll / nodes,
    periHalfOverApoHalf: (sPeri / nP) / (sApo / nA),
  };
  if (bandH) out.bandTime = { H: bandH, periHalf: inBand.peri / nP, apoHalf: inBand.apo / nA };
  // 読み: (a) 交点の 2 点が近点の側の半周(真近点角 |f| < 90°)に入るか (b) 近点を中心にした半周期(|M| < 90°)に入るか (c) 高さの比(恒等式 —— sin ω ≠ 0 なら ω に依らない)
  out.readings = { bothPeriSideF: out.asc.periSideF && out.desc.periSideF, bothPeriSideM: out.asc.periSideM && out.desc.periSideM, onePeriSideF: out.asc.periSideF !== out.desc.periSideF,
    periNearerHeight: Math.abs(zP) < Math.abs(zA), meanZPeriLess: out.meanAbsZPeriHalf < out.meanAbsZApoHalf };
  return out;
}

/* ───────── 赤道帯の候補の場 ───────── */
/** 速さ s_*(観測自転 s・J 等価 s_d) */
export function bandSpeed(sys, speed) {
  if (speed === 'obs') return sys.sSun;
  if (speed === 'jEquiv') return dragSpin({ s: sys.sSun, Robs: sys.Rsun, Rd: kappaMRadius(sys.M), fObs: DECL.jEquiv.fObs, lambdaJ: DECL.jEquiv.lambdaJ });
  throw new RangeError('bandSpeed: 速さの列 ' + speed);
}
/** 帯の厚み H の関数(位置の距離 r → H) */
export function bandH(sys, H) {
  if (!H || !(H.mult > 0)) throw new RangeError('bandH: 宣言');
  if (H.kind === 'Rsun') { const v = H.mult * sys.Rsun; return () => v; }
  if (H.kind === 'Rd') { const v = H.mult * kappaMRadius(sys.M); return () => v; }
  if (H.kind === 'angle') { const t = Math.tan(H.mult * D2R); return (r) => r * t; }
  throw new RangeError('bandH: 種類 ' + H.kind);
}
export const bandWeight = (z, H, q) => 1 / (1 + Math.pow(Math.abs(z) / H, q));
/**
 * 赤道帯の候補の効果。spec = { type, H, q, p, speed, dir, lambda }。戻り値 { kind:'vel', d(x, w) } か { kind:'acc', a(st) }。
 * vel: d = λ B (r_* / r)^p s_* (ŝ × p)(inPlane は受け手の公転面〔p × w の法線〕へ射影)/push: a = λ B (r_* / r)^p s_*² (ŝ × p)。
 */
export function bandEffect(sys, spec) {
  const { type, H, q, p, speed, dir = 'phi', lambda = 1 } = spec;
  if (!DECL.band.types.includes(type) || !(q > 0) || !isFin(p) || !isFin(lambda) || !DECL.band.dirs.includes(dir)) throw new RangeError('bandEffect: 宣言');
  const sh = unit(sys.sunAxis), sp = bandSpeed(sys, speed), Hf = bandH(sys, H), rRef = DECL.band.rRefAU * GEOM.AU, amp = lambda * (type === 'push' ? sp * sp : sp);
  const field = (x, w) => { const r = nrm(x), z = dot(x, sh), B = bandWeight(z, Hf(r), q), g = B * Math.pow(rRef / r, p); let d = scl(crs(sh, x), amp * g);
    if (type === 'rel') d = sub(d, scl(w, lambda * g));
    if (dir === 'inPlane') { const Wn = unit(crs(x, w)); d = sub(d, scl(Wn, dot(d, Wn))); } return d; };
  if (type === 'vel' || type === 'rel') return { kind: 'vel', d: field, band: { Hf, sh } };
  return { kind: 'acc', a: (st) => field(st.x, st.v), band: { Hf, sh } };
}

/* ───────── 部分積分の読みの一次の率(微分なし)───────── */
/** 積分の点(交点の近くへ寄せる): H0 = 交点での帯の厚み(null なら一様な区切りだけ)。戻り値 [[E0, E1], …] */
export function quadSegments(sys, H0 = null, { kMin = DECL.quad.kMin, maxSeg = DECL.quad.maxSeg } = {}) {
  const { orb } = sys, s = unit(sys.sunAxis), g = anglesOn(orb, s), om = g.omega;
  const Ea = eOfF(wrapPi(-om), orb.e), Ed0 = eOfF(wrapPi(Math.PI - om), orb.e), Ed = Ed0 < Ea ? Ed0 + 2 * Math.PI : Ed0;
  const zE = (E) => dot(stateAt(orb, E - orb.e * Math.sin(E)).x, s), slope = (E) => Math.abs(zE(E + 1e-7) - zE(E - 1e-7)) / 2e-7;
  const segs = [];
  const half = (Ec, Eo) => {   // 交点 Ec から弧の中点 Eo まで
    const L = Math.abs(Eo - Ec), sg = Math.sign(Eo - Ec), cuts = new Set([0, L]);
    if (H0) { const sl = slope(Ec); for (let k = kMin; ; k++) { const d = H0 * Math.pow(2, k) / sl; if (!(d < L)) break; cuts.add(d); } }
    const arr = [...cuts].sort((x, y) => x - y), fine = [];
    for (let j = 0; j + 1 < arr.length; j++) { const n = Math.max(1, Math.ceil((arr[j + 1] - arr[j]) / maxSeg)); for (let t = 0; t < n; t++) fine.push([arr[j] + (arr[j + 1] - arr[j]) * t / n, arr[j] + (arr[j + 1] - arr[j]) * (t + 1) / n]); }
    for (const [u, v] of fine) segs.push(sg > 0 ? [Ec + u, Ec + v] : [Ec - v, Ec - u]);
  };
  const m1 = (Ea + Ed) / 2, m2 = (Ed + Ea + 2 * Math.PI) / 2;
  half(Ea, m1); half(Ed, m1); half(Ed, m2); half(Ea + 2 * Math.PI, m2);
  return segs;
}
/** 点の一覧(状態と時間の重み)—— 同じ区切りの候補で使い回す */
export function quadPoints(sys, segs, gl = DECL.quad.gl) {
  const { orb } = sys, { x: gx, w: gw } = glNodes(gl), pts = [];
  for (const [E0, E1] of segs) { const hh = (E1 - E0) / 2, mm = (E0 + E1) / 2;
    for (let k = 0; k < gl; k++) { const E = mm + hh * gx[k], st = stateAt(orb, E - orb.e * Math.sin(E)); pts.push({ st, tw: gw[k] * hh * (1 - orb.e * Math.cos(E)) / (2 * Math.PI) }); } }
  return pts;
}
/** 一次のベクトルの率(vel は部分積分の読み・acc は Gauss の式)—— 点の一覧 pts の上で。戻り値は第334便c の vectorRates と同じ名(dh・de・Ldot・apsW・eOut・dedt・dlnA・LdotMag) */
export function ratesOn(orb, eff, pts) {
  const mu = orb.mu, W = orb.W, P = orb.P, h0 = Math.sqrt(mu * orb.a * (1 - orb.e * orb.e)), hv = scl(W, h0);
  let dh = [0, 0, 0], de = [0, 0, 0], dEn = 0;
  for (const { st, tw } of pts) {
    if (eff.kind === 'vel') {
      const d = eff.d(st.x, st.v), r3 = st.r ** 3, acc = scl(st.x, -mu / r3);
      dh = add(dh, scl(crs(st.v, d), -tw));
      de = add(de, scl(add(crs(acc, crs(st.x, d)), crs(st.v, crs(st.v, d))), -tw / mu));
      dEn += -tw * dot(acc, d);
    } else {
      const F = eff.a(st);
      dh = add(dh, scl(crs(st.x, F), tw)); de = add(de, scl(add(crs(F, hv), crs(st.v, crs(st.x, F))), tw / mu)); dEn += tw * dot(st.v, F);
    }
  }
  const Lperp = (d) => scl(sub(d, scl(W, dot(W, d))), 1 / h0), e = orb.e, Qd = crs(W, P);
  const out = { dh, de, Ldot: Lperp(dh), apsW: e > 0 ? dot(Qd, de) / e : null, eOut: e > 0 ? dot(W, de) / e : null, dedt: dot(P, de), dlnA: 2 * orb.a * dEn / mu };
  out.LdotMag = nrm(out.Ldot);
  return out;
}
/** 基準面(法線 pole)の交点・傾き・近点引数・近点経度の率を L̂ の変化と面内の回転から(第333便c の secularRates と同じ関係: dω = apsW − cos i dΩ・dϖ = dω + dΩ) */
export function anglesRates(orb, R, pole) {
  const g = anglesOn(orb, pole);
  if (g.degenerate || R.apsW === null) return { di: null, dnode: null, domega: null, dvarpi: null, degenerate: true };
  const dn = dot(R.Ldot, g.N) / g.sinI, di = dot(R.Ldot, crs(g.N, orb.W)), dom = R.apsW - Math.cos(g.i) * dn;
  return { di, dnode: dn, domega: dom, dvarpi: dom + dn, degenerate: false };
}
/** 行(″/世紀・1/世紀)—— 第335便c の行の型 + 周期の率と宣言の物差しの量 */
export function rowOf(sys, R) {
  const orb = sys.orb, Pd = periodOf(orb), n = nOf(orb), sp = splitAbout(R.Ldot, orb.W, sys.sunAxis);
  const pk = (pole) => { const q = anglesRates(orb, R, pole); return q.degenerate ? null : { di: asec(q.di), dnode: asec(q.dnode), dvarpi: asec(q.dvarpi) }; };
  const ndot = -1.5 * n * R.dlnA, T = CENTURY_S;
  const rates = [R.LdotMag, R.apsW === null ? 0 : Math.abs(R.apsW), Math.abs(R.dlnA), Math.abs(R.eOut || 0)];
  return { apsW: asec(R.apsW), Lmag: asec(R.LdotMag), Lvec: R.Ldot.map(asec), prec: asec(sp.prec), toward: asec(sp.toward), eOut: asec(R.eOut), decy: R.dedt * T, deMagCy: nrm(R.de) * T,
    dlnAcy: R.dlnA * T, dlnPcy: 1.5 * R.dlnA * T, lonDriftArcsec: Math.abs(0.5 * ndot * T * T) * 180 / Math.PI * 3600,
    ecl: pk([0, 0, 1]), sun: pk(sys.sunAxis), breaks: Math.max(...rates) * Pd > DECL.breakPerOrbit };
}

/* ───────── T2 寄与の分解(第333〜335便の列を呼ぶ)───────── */
/** 列の効果(名): gloc0・gloc1・gloc2・k1・trans・transRadial・transTangent・transNormal・rot と第335便c の列(pair2jEquiv・cut・t1… —— columnEffect) */
export function contribEffect(sys, key) {
  const m = /^gloc(\d)$/.exec(key);
  if (m) { const n = Number(m[1]); return n === 0 ? { kind: 'acc', a: () => [0, 0, 0] } : effectOf(sys, { kind: 'gloc', pair: 'receiver', n }); }
  return columnEffect(sys, key);
}
/** 列の一次の率(全周 —— 一様な区切りの部分積分の読み) */
export function contribRates(sys, eff, pts = null) {
  const P = pts || quadPoints(sys, quadSegments(sys, null));
  return ratesOn(sys.orb, eff, P);
}

/* ───────── 区間(真近点角)ごとの効き ───────── */
/** 区間ごとの ω_W への寄与(部分積分の読み —— 区間の和 = 全周)と印 */
export function binTable(sys, eff, { n = DECL.nBins, gl = DECL.binGL } = {}) {
  const { orb } = sys, w = 2 * Math.PI / n, s = unit(sys.sunAxis), g = anglesOn(orb, s), kOf = (f) => ((Math.round(f / w) % n) + n) % n;
  const per = [];
  for (let k = 0; k < n; k++) { const f0 = k * w - w / 2, f1 = f0 + w, pts = quadPoints(sys, [[eOfF(f0, orb.e), eOfF(f1, orb.e)]], gl), R = ratesOn(orb, eff, pts); per.push({ k, apsW: R.apsW, Lmag: R.LdotMag }); }
  const sum = per.reduce((t, q) => t + q.apsW, 0), gross = per.reduce((t, q) => t + Math.abs(q.apsW), 0);
  const fa = wrapPi(-g.omega), marks = { peri: 0, apo: kOf(Math.PI), asc: kOf(fa), desc: kOf(fa + Math.PI) };
  return { per, sum, gross, netOverGross: gross > 0 ? Math.abs(sum) / gross : null, marks };
}

/* ───────── 単位の軌道への写し(T4 の純粋な積分器・二次の結合)───────── */
/** 実の場 → 単位の軌道(μ = a = 1)の場: x_u = x/a・時間の単位 1/n。vel: d_u = d/(a n)・acc: a_u = a/(a n²) */
export function unitBand(sys, spec, amp = 1) {
  const eff = bandEffect(sys, { ...spec, lambda: (spec.lambda === undefined ? 1 : spec.lambda) * amp }), a = sys.orb.a, n = nOf(sys.orb);
  if (eff.kind === 'vel') return { velX: (x, v) => scl(eff.d(scl(x, a), scl(v, a * n)), 1 / (a * n)), accelX: null };
  return { velX: null, accelX: (x, v) => scl(eff.a({ x: scl(x, a), v: scl(v, a * n), r: nrm(x) * a }), 1 / (a * n * n)) };
}
/** 混合の差 M = F(並進 + 帯) − F(並進) − F(帯)(rad/公転 —— 第334便c の integrateFrame の面内の回転。帯は速度の型だけ) */
export function mixingBand({ orb0, sHat, cT, bandVelX, stepsPerOrbit, nOrb }) {
  const fT = unitField('trans', cT, sHat), both = (x, w) => add(fT(x, w), bandVelX(x, w));
  const F = (velX) => integrateFrame({ orb0, velX, stepsPerOrbit, nOrb }).apsW;
  const aB = F(both), aT = F(fT), aX = F(bandVelX);
  return { both: aB, trans: aT, partner: aX, mix: aB - aT - aX };
}

/* ───────── 純関数の場面と門 ───────── */
export function pureScenes() {
  const S = {}, merc = systemOfLit('merc');
  // ① 部分積分の読み = 第334便c の vectorRates(中心差分の読み)—— 滑らかな速度の場(広い帯 H = 3 R_☉・q = 2・p = 1)と並進の分
  { const effB = bandEffect(merc, { type: 'vel', H: { kind: 'Rsun', mult: 3 }, q: 2, p: 1, speed: 'obs', dir: 'phi', lambda: 1e-6 });
    const A = contribRates(merc, effB), B = vectorRates(merc.orb, effB, {}), sc = Math.max(Math.abs(B.apsW), B.LdotMag);
    const effT = contribEffect(merc, 'trans'), At = contribRates(merc, effT), Bt = vectorRates(merc.orb, effT, {}), sct = Math.abs(Bt.apsW);
    S.ibp = { band: Math.max(Math.abs(A.apsW - B.apsW), nrm(sub(A.Ldot, B.Ldot))) / sc, trans: Math.abs(At.apsW - Bt.apsW) / sct, dlnA: Math.abs(A.dlnA - B.dlnA) / Math.max(Math.abs(B.dlnA), 1e-30 + 1e-9 * sc) }; }
  // ② 細い帯(H = R_d)の積分の点の倍で同じ値(GL 24 と 48)
  { const effN = bandEffect(merc, { type: 'vel', H: { kind: 'Rd', mult: 1 }, q: 2, p: 1, speed: 'obs', dir: 'phi', lambda: 1 }), segs = quadSegments(merc, kappaMRadius(merc.M));
    const A = ratesOn(merc.orb, effN, quadPoints(merc, segs, 24)), B = ratesOn(merc.orb, effN, quadPoints(merc, segs, 48));
    S.narrow = { dev: Math.max(Math.abs(A.apsW - B.apsW), nrm(sub(A.Ldot, B.Ldot))) / Math.max(Math.abs(B.apsW), B.LdotMag), segs: segs.length }; }
  // ③ λ_B = 0 で 0(ノブ 0 で今の組と同じ)・λ に比例(一次)
  { const sp = { type: 'vel', H: { kind: 'Rsun', mult: 1 }, q: 4, p: 2, speed: 'obs', dir: 'phi' };
    const R0 = contribRates(merc, bandEffect(merc, { ...sp, lambda: 0 })), R1 = contribRates(merc, bandEffect(merc, { ...sp, lambda: 1 })), R2 = contribRates(merc, bandEffect(merc, { ...sp, lambda: 2 }));
    S.zero = { zero: Math.max(Math.abs(R0.apsW), R0.LdotMag, Math.abs(R0.dlnA)), lin: Math.abs(R2.apsW - 2 * R1.apsW) / Math.abs(R1.apsW) }; }
  // ④ 速度の型の帯(ŝ × p ⊥ p)は半長軸を動かさない(⟨a·d⟩ = 0)・inPlane は L̂ を動かさない
  { const effV = bandEffect(merc, { type: 'vel', H: { kind: 'Rsun', mult: 1 }, q: 2, p: 0, speed: 'obs', dir: 'phi', lambda: 1e-6 }), effI = bandEffect(merc, { type: 'vel', H: { kind: 'Rsun', mult: 1 }, q: 2, p: 0, speed: 'obs', dir: 'inPlane', lambda: 1e-6 });
    const RV = contribRates(merc, effV), RI = contribRates(merc, effI);
    S.vel = { dlnA: Math.abs(RV.dlnA) / Math.max(Math.abs(RV.apsW), RV.LdotMag), planeIn: RI.LdotMag / Math.abs(RI.apsW) }; }
  // ⑤ 幾何の恒等式: 高さの比 = (1 − e)/(1 + e)・交点の真近点角の差 = π
  { const G = geometryOf(merc); S.geom = { ratio: Math.abs(G.heightRatio - G.heightRatioExpect), nodeGap: Math.abs(Math.abs(wrapPi((G.desc.fDeg - G.asc.fDeg) * D2R)) - Math.PI) }; }
  // ⑥ 区間の和 = 全周(部分積分の読み)
  { const eff = bandEffect(merc, { type: 'vel', H: { kind: 'Rsun', mult: 3 }, q: 2, p: 1, speed: 'obs', dir: 'phi', lambda: 1e-6 }), B = binTable(merc, eff), F = contribRates(merc, eff);
    S.bins = { dev: Math.abs(B.sum - F.apsW) / B.gross }; }
  // ⑦ 単位の軌道への写し: 単位の場 × (a n) = 実の場
  { const sp = { type: 'vel', H: { kind: 'Rsun', mult: 2 }, q: 2, p: 1, speed: 'obs', dir: 'phi', lambda: 1e-6 }, U = unitBand(merc, sp), st = stateAt(merc.orb, 0.8), a = merc.orb.a, n = nOf(merc.orb);
    const du = U.velX(scl(st.x, 1 / a), scl(st.v, 1 / (a * n))), dr = bandEffect(merc, sp).d(st.x, st.v); S.unit = nrm(sub(scl(du, a * n), dr)) / nrm(dr); }
  // ⑧ 入力の拒否
  const rejects = (f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
  S.rejects = [rejects(() => bandEffect(merc, { type: 'drag', H: { kind: 'Rsun', mult: 1 }, q: 2, p: 1, speed: 'obs' })), rejects(() => bandH(merc, { kind: 'x', mult: 1 })), rejects(() => bandSpeed(merc, 'fast')),
    rejects(() => systemOfLit('pluto')), rejects(() => bandEffect(merc, { type: 'vel', H: { kind: 'Rsun', mult: 1 }, q: 0, p: 1, speed: 'obs' }))];
  return S;
}
export function pureGates(S) {
  return {
    ibp: S.ibp.band <= 1e-6 && S.ibp.trans <= 1e-6,
    narrow: S.narrow.dev <= 1e-6,
    zero: S.zero.zero === 0 && S.zero.lin <= 1e-12,
    vel: S.vel.dlnA <= 1e-9 && S.vel.planeIn <= 1e-9,
    geom: S.geom.ratio <= 1e-12 && S.geom.nodeGap <= 1e-12,
    bins: S.bins.dev <= 1e-8,
    unit: S.unit <= 1e-12,
    rejects: S.rejects.every(Boolean),
  };
}
export { kappaMRadius, periodOf, nOf, q1PNPerOrbit, splitField, CENTURY_S, GEOM, vec };

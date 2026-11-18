// 第341便g(原仮定者の補足(2026-11-18 —— 第141報)「冥王星は、太陽から遠く、斜め軌道で赤道面から離れる期間が長く、カロンと互いに潮汐ロックしている。
//   冥王星とカロンは、引きずりの影響が少ない、理想的な連星」・原仮定者の指示(2026-11-11 —— 第135報)「冥王星とカロンが、連星のヒントになると想定」・統括の検証項目 R370):
//   **冥王星とカロンを、候補の型の対照の表にする lib**(診断だけ —— エンジン・内蔵の本・受理器・第340便までの lib の本文は変えない)。
//
// T1 「引きずりの影響が少ない」を項ごとの数に: 同じ式で数えた 7 系(冥王星–カロン・地球–月・木星–イオ・土星–タイタン・太陽–水星・太陽–金星・PSR J0737−3039)の
//    (i) 外からの並進引きずり(源の取り分 f と、連星の 2 体の間の差 —— 潮汐の型の差分)(ii) 相互の軸引きずり(部位差分 —— 第340便b の col4At を呼ぶ)
//    (iii) 外の源の軸引きずり(部位差分 —— 同じ col4At)(v) G_loc の型の残差(第334便d の (4/3)η —— 第331便c・第334便d の firstShare を呼ぶ)の指数(÷ 公転の角速度 n)。
// T2 「斜め軌道で赤道面から離れる期間が長い」を数に: 太陽の赤道面・不変面に対する 9 天体の軌道の傾きと、|z| が帯の半幅より大きい時間の割合・
//    回転引きずりの鉛直の型(探索用の型 —— 第339便a の 🛟 の型・第337便i の effectOfSpec を呼ぶ)が掛かる時間の割合と大きさ。
// T3 対照の段(1)〜(4): 理想の円・観測の入力・太陽の場・銀河の背景 —— 段ごとの候補の型の大きさと入力の不確かさ(定義の差)の大小。二体の数値の積分は刻みの収束を 1 表。
// T4 天体の特性の係数(第341便b のノブ —— 本便では b の新しい列を呼ばない)の入口: 第340便b の部位差分の大きさの 2 つの置き方 (a)(b) に係数 1・0.5 を掛けた 4 点だけ。
//
// **html を読まない**・ネットへ取りに行かない・乱数を使わない。薄い角は Math.atan2(|外積|, 内積)(第340便h の thinAngle)。符号・有無の 3 値の判定は使わない(尺度の無い量を判定に入れない)。
// 言わないこと: 冥王星とカロンが合った・引きずりが無いと確かめられた・理想的な連星であることが導けた —— 器が出すのは「この型・このノブの組では各項がこの大きさ」の表。
// 入力の定義の差(+7.216805 s・周期 +0.00131%)を引きずりの係数・ノブに吸収しない(AN807)。
import { col4At, rOfF } from './lib-w340b-axialsplit.mjs';
import { syncCase, firstShare } from './lib-w334d-binarylaw.mjs';
import { etaOf } from './lib-w331c-k1scale.mjs';
import { selfWeight } from './lib-w340e-lightweight.mjs';
import { thinAngle } from './lib-w340h-thin.mjs';
import { DECL as L337L } from './lib-w337l-bevel.mjs';
import { orbitNormal, eclOfRaDec, LIT as LIT337J } from './lib-w337j-spinorbit.mjs';
import { BODY_SRC } from './lib-w337c-tidelock.mjs';
import * as RR from './lib-w337i-rotring.mjs';

export const LIB_VERSION = 'w341g-plutocontrol-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const D2R = Math.PI / 180, DAY = 86400, YR = 365.25 * DAY, AU = 1.495978707e11, G = 6.6743e-11, C0 = 299792458, MSUN = 1.98847e30;
/** 丸めの残り: |x| が尺度 × 1e-12 より小さければ 0(第337便の教訓 2 —— 丸めの残りを値のまま書かない) */
export const FLOOR = 1e-12;
const z12 = (x, scale = 1) => (Math.abs(x) < FLOOR * Math.abs(scale) ? 0 : x);

/* ───────── 宣言(走行の前 —— 走らせたノブの格子と判定の物差しの記録)───────── */
export const DECL = Object.freeze({
  /** 部位差分の重みのべき(重み = m/r^α —— 原仮定者の指示(2026-11-08 —— 第132報)「重み=質量/距離^2」) */
  alpha: 2,
  /** 相互の軸引きずりを読む公転の位相(真近点角 [deg] —— 近点・90°・遠点) */
  phasesDeg: Object.freeze([0, 90, 180]),
  /** 球の表面の点の数(第340便b の col4At —— 400 = 第340便b の既定) */
  nPts: 400,
  /** 背景慣性決定力 W₀(第337便a の解の写し —— 第337便l の DECL.W0 を呼ぶ)・背景軸引きずり ω_bg(同じ)。単位 kg/m²(重み m/r² と同じ) */
  w0Src: '第337便l の DECL.W0・DECL.wbg(第337便a の正本 supply-337a.json の読み i〔背景が静止〕の解の写し)',
  /** 「少ない」の指数の分母: 公転の角速度 n(角速度の項)・公転の速さ n a(速度の項) */
  indexRef: '÷ n(角速度)・÷ n a(速度)',
  /** T2: 帯の半幅の 3 列(🛟 の型の R_eq〔太陽 —— 第337便i の rdOf(sun, 'Req')〕・太陽の半径・0.1 AU〔比べる列〕)・時間の標本(平均近点角の等分) */
  t2Bands: Object.freeze(['Req', 'Rsun', 'au01']), t2N: 7200,
  /** T2: 🛟 の型の強さ(第337便i の代表の組 —— 第339便a の候補の λ・**本の中の倍率 1e5 は掛けない**) */
  t2Lambda: 6.560e-7, t2LambdaSrc: '第337便i の代表の組の λ(PHYSICS〔第339便a〕・題の追記の 6.560e-7 の写し)—— 本の倍率 1e5・2e6 は掛けない',
  /** T3: 二体の数値の積分の刻み(1 公転あたりの步 —— RK4)と公転の数 */
  t3Steps: Object.freeze([360, 720, 1440, 2880]), t3Orbits: 1,
  /** T3: 入力の不確かさの物差し(🥶 の記帳 —— 定義の差 +7.216805 s・σ 0.02592 s・Buie の周期 551856.43872 s) */
  defDiffS: 7.216805050382391, sigmaS: 0.02592, pBuieS: 551856.43872,
  /** T4: 係数の点(第341便b のノブ —— 本便では 1・0.5 の 2 点だけ) */
  t4Coef: Object.freeze([1, 0.5]),
});

/* ───────── 文献の値(リポジトリの中の値を先に —— 無いものは「文献の値・未照合」)───────── */
const bs = (id, k) => BODY_SRC[id][k][0];
export const LIT = Object.freeze({
  note: 'リポジトリの中の値(第337便c の BODY_SRC = paper/data/solar-observations.csv と jovian-satellites.csv の写し・paper/data の行)を先に使う。無いものは文献の値・未照合(この環境から一次資料に届かない)',
  plutoCharonGM: Object.freeze({ plu060: 975.4e9, buie: 972.0300630283296e9, aPlu060Mean: 19595.764e3, aBuie: 19573e3,
    src: 'tests/out/charoninput-w280d.json の sameDef(GM = Brozović & Jacobson 2024 Table 8 の冥王星 + カロン・a = 同 Table 10 の 400 年平均/Buie 2012 の二体解 a 19573 km と含意の GM)の写し' }),
  saturn: Object.freeze({ M: 5.6834e26, R: 6.0268e7, spin: 38362, aHel: 1.4335e12, src: 'NASA NSSDC の Saturn Fact Sheet(質量・赤道半径・自転 10.656 h・半長軸)—— 文献の値・未照合・確かさ 高' }),
  titan: Object.freeze({ M: 1.3452e23, R: 2.5747e6, a: 1.22187e9, porb: 1377686.7072, e: 0.029, src: '周期と離心率は paper/data/solar-observations.csv(SOL-6041b21e・SOL-7665efd8 —— Jacobson 2022)・質量・半径・半長軸は NASA NSSDC の土星の衛星の表 —— 文献の値・未照合・確かさ 高' }),
  j0737: Object.freeze({ MA: 2.660982861e30, MB: 2.483370041e30, R: 1.175e4, a: 8.788366e8, porb: 8834.534723278, e: 0.087777036, PA: 0.02269937898645, PB: 2.77346074724,
    src: 'paper/data/solar-observations.csv の PSR J0737-3039 A/B の行(SOL-7ba92aa0・SOL-3b7d7d41・SOL-8c6303f4・SOL-6674817e・SOL-cf1e8fbf・SOL-40d95cf1・SOL-91ac7b68・SOL-649c64b4)' }),
  moonE: Object.freeze({ e: 0.0549, src: '月の離心率 0.0549(NASA NSSDC の Moon Fact Sheet)—— 文献の値・未照合・確かさ 高' }),
  ioE: Object.freeze({ e: 0.0041, src: 'イオの離心率 0.0041(NASA NSSDC の木星の衛星の表)—— 文献の値・未照合・確かさ 高' }),
  charonE: Object.freeze({ e: 2e-4, src: '第334便d の DECL.sync.ecc の 2e-4(冥王星–カロンの離心率の桁 —— 文献の値・未照合)。paper/data/solar-observations.csv の SOL-5f236ce9 は 0.0(表の丸め)' }),
  venusE: 0.007, mercuryE: 0.20563593,
  /** T2: 太陽のまわりの軌道の要素(黄道 J2000 —— a [AU]・e・i [deg]・Ω [deg]・ϖ [deg]) */
  helio: Object.freeze({
    mercury: Object.freeze([0.38710, 0.20563, 7.005, 48.331, 77.456]), venus: Object.freeze([0.72333, 0.00677, 3.3946, 76.680, 131.53]),
    earth: Object.freeze([1.00000, 0.01671, 0.00005, -11.26, 102.947]), mars: Object.freeze([1.52366, 0.09340, 1.850, 49.558, 336.04]),
    jupiter: Object.freeze([5.20336, 0.04839, 1.303, 100.464, 14.331]), saturn: Object.freeze([9.53707, 0.05415, 2.485, 113.666, 92.599]),
    uranus: Object.freeze([19.1913, 0.04717, 0.773, 74.006, 170.954]), neptune: Object.freeze([30.0690, 0.00859, 1.770, 131.784, 44.965]),
    pluto: Object.freeze([39.4817, 0.24883, 17.16, 110.30, 224.07]),
  }),
  helioSrc: 'a・i・Ω は第337便j の LIT(NASA NSSDC —— 水星と金星は同じ表)・e と近日点の経度 ϖ は JPL の惑星の近似の要素(J2000)—— 文献の値・未照合・確かさ 高(冥王星の ϖ は確かさ 中)',
  invariable: Object.freeze({ iDeg: 1.578694, nodeDeg: 107.582222, src: '不変面(Souami & Souchay 2012 A&A 543 A133 の黄道 J2000 に対する傾きと昇交点)—— 文献の値・未照合・確かさ 中' }),
  plutoHelioP: 247.94 * YR, plutoHelioPSrc: '冥王星の公転周期 247.94 年(NASA NSSDC の Pluto Fact Sheet)—— 文献の値・未照合・確かさ 高',
});

/* ───────── 7 系の表(同じ式で数える)───────── */
/** 1 つの天体: m・R・自転の角速度(符号つき —— 公転の向きを正)・ロックか */
const body = (name, m, R, spin, locked) => Object.freeze({ name, m, R, spin, locked });
const nOfP = (P) => 2 * Math.PI / P;
export function systemsOf() {
  const Pc = bs('Charon', 'porb'), nPC = nOfP(Pc);
  const sunSpin = nOfP(bs('Sun', 'spin'));
  const S = [];
  S.push({ key: 'plutoCharon', ja: '冥王星–カロン', mutualLock: true, a: bs('Charon', 'a'), e: LIT.charonE.e, P: Pc,
    host: body('冥王星', bs('Pluto', 'M'), bs('Pluto', 'R'), nPC, true), comp: body('カロン', bs('Charon', 'M'), bs('Charon', 'R'), nPC, true),
    ext: { kind: 'sun', D: bs('Pluto', 'aHel'), m: MSUN, spin: sunSpin, vOrb: Math.sqrt(G * MSUN / bs('Pluto', 'aHel')) } });
  const Pm = bs('Moon', 'porb'), nM = nOfP(Pm);
  S.push({ key: 'earthMoon', ja: '地球–月', mutualLock: false, a: bs('Moon', 'a'), e: LIT.moonE.e, P: Pm,
    host: body('地球', bs('Earth', 'M'), bs('Earth', 'R'), nOfP(bs('Earth', 'spin')), false), comp: body('月', bs('Moon', 'M'), bs('Moon', 'R'), nM, true),
    ext: { kind: 'sun', D: bs('Earth', 'aHel'), m: MSUN, spin: sunSpin, vOrb: Math.sqrt(G * MSUN / bs('Earth', 'aHel')) } });
  const Pi = bs('Io', 'porb'), nI = nOfP(Pi);
  S.push({ key: 'jupiterIo', ja: '木星–イオ', mutualLock: false, a: bs('Io', 'a'), e: LIT.ioE.e, P: Pi,
    host: body('木星', bs('Jupiter', 'M'), bs('Jupiter', 'R'), nOfP(bs('Jupiter', 'spin')), false), comp: body('イオ', bs('Io', 'M'), bs('Io', 'R'), nI, true),
    ext: { kind: 'sun', D: bs('Jupiter', 'aHel'), m: MSUN, spin: sunSpin, vOrb: Math.sqrt(G * MSUN / bs('Jupiter', 'aHel')) } });
  const T = LIT.titan, Sa = LIT.saturn, nT = nOfP(T.porb);
  S.push({ key: 'saturnTitan', ja: '土星–タイタン', mutualLock: false, a: T.a, e: T.e, P: T.porb,
    host: body('土星', Sa.M, Sa.R, nOfP(Sa.spin), false), comp: body('タイタン', T.M, T.R, nT, true),
    ext: { kind: 'sun', D: Sa.aHel, m: MSUN, spin: sunSpin, vOrb: Math.sqrt(G * MSUN / Sa.aHel) } });
  const Pme = bs('Mercury', 'porb');
  S.push({ key: 'sunMercury', ja: '太陽–水星', mutualLock: false, a: bs('Mercury', 'aHel'), e: LIT.mercuryE, P: Pme,
    host: body('太陽', MSUN, bs('Sun', 'R'), sunSpin, false), comp: body('水星', bs('Mercury', 'M'), bs('Mercury', 'R'), nOfP(bs('Mercury', 'spin')), false),
    ext: { kind: 'background' } });
  const Pv = bs('Venus', 'porb');
  S.push({ key: 'sunVenus', ja: '太陽–金星', mutualLock: false, a: bs('Venus', 'aHel'), e: LIT.venusE, P: Pv,
    host: body('太陽', MSUN, bs('Sun', 'R'), sunSpin, false), comp: body('金星', bs('Venus', 'M'), bs('Venus', 'R'), -nOfP(Math.abs(bs('Venus', 'spin'))), false),
    ext: { kind: 'background' } });
  const J = LIT.j0737;
  S.push({ key: 'j0737', ja: 'PSR J0737−3039', mutualLock: false, a: J.a, e: J.e, P: J.porb,
    host: body('A', J.MA, J.R, nOfP(J.PA), false), comp: body('B', J.MB, J.R, nOfP(J.PB), false), ext: { kind: 'background' } });
  return S.map((s) => Object.freeze(Object.assign(s, { n: nOfP(s.P) })));
}

/* ───────── T1 (ii)(iii): 部位差分(第340便b の col4At —— 源は原点・受け手は x 軸の上・背景の重み 0〔φ = 0 —— 並進の式の分母に背景を入れない: 第107・110報〕)───────── */
/**
 * 実の配置を col4At の正規化へ写す: 取り分 f = w_src/(w_src + W_self)(W_self = 受け手の m/R² —— 第340便e の selfWeight)→ 正規化の距離 r = rOfF(f)・長さの尺度 L = d/r。
 * v は受け手 − 源の速度(実の単位)を L で割る・時間の単位は秒のまま(角速度は rad/s)。戻り値 |ω|(rad/s)と閉じた形。
 */
export function partDiff({ mSrc, sSrc, d, mRecv, RRecv, sRecv, vRel, N = DECL.nPts }) {
  if (!(mSrc > 0) || !(d > 0) || !(mRecv > 0) || !(RRecv > 0) || !fin(sSrc) || !fin(sRecv) || !Array.isArray(vRel)) throw new RangeError('partDiff: 質量・距離・半径 > 0・自転は有限');
  const wS = mSrc / (d * d), wSelf = selfWeight(mRecv, RRecv), f = wS / (wS + wSelf), r = rOfF(f, DECL.alpha), L = d / r;
  const vN = scl(vRel, 1 / L), c = col4At(0, f, RRecv / d, { phi: 0, v: vN, sr: [0, 0, sRecv], s: sSrc, alpha: DECL.alpha, N });
  // col4At の数値の床(速さ (|s| r + |v|) ÷ R × 1e-1 × 1e-12 —— これより小さい ω は 0 と書かれる)
  const floor = (Math.abs(sSrc) * r + nrm(vN)) / (RRecv / d * r) * 1e-1 * FLOOR;
  return { f, om: c.mag, omClosed: c.magClosed, errRel: c.errRel, floor };
}
/** 真近点角 ν での相対の距離と速度(受け手 − 源 —— 受け手は源から見て +x の向き: 動径 ṙ・接線 r ḟ) */
export function kepRel(a, e, n, nuDeg) {
  const nu = nuDeg * D2R, p = a * (1 - e * e), r = p / (1 + e * Math.cos(nu)), h = n * a * a * Math.sqrt(1 - e * e);
  return { r, v: [h / p * e * Math.sin(nu), h / r, 0] };
}
/** 相互の部位差分(受け手 = 伴〔comp〕と主〔host〕)の位相ごとの |ω|/n と、受け手の中心の座標変換の d(第334便d の syncCase —— 同期の型の対照) */
export function mutualRow(S, eOverride = null) {
  const e = eOverride === null ? S.e : eOverride, out = { e, recv: {} };
  for (const [rk, R, Src] of [['comp', S.comp, S.host], ['host', S.host, S.comp]]) {
    const rows = DECL.phasesDeg.map((ph) => { const k = kepRel(S.a, e, S.n, ph);
      const q = partDiff({ mSrc: Src.m, sSrc: Src.spin, d: k.r, mRecv: R.m, RRecv: R.R, sRecv: R.spin, vRel: k.v });
      // 並進の回転成分と受け手の自転の差(f s_src + (1 − f) s_recv − s_recv = f (s_src − s_recv) —— 座標の回転の側〔第140報 回答 1 の経緯〕)
      // 主の値は閉じた形(R → 0 —— 第340便b の col4At の closed)・数値(有限の R の最小二乗)は床より上のときだけ比べる列
      return { phaseDeg: ph, f: q.f, omClosedOverN: q.omClosed / S.n, omNumOverN: q.om / S.n, floorOverN: q.floor / S.n, numAboveFloor: q.om > 0, errRel: q.om > 0 ? q.errRel : null,
        rotMismatchOverN: q.f * Math.abs(Src.spin - R.spin) / S.n }; });
    out.recv[rk] = { rows, maxOmOverN: Math.max(...rows.map((x) => x.omClosedOverN)), maxNumOverN: Math.max(...rows.map((x) => x.omNumOverN)), maxRotMismatchOverN: Math.max(...rows.map((x) => x.rotMismatchOverN)) };
  }
  out.maxOmOverN = Math.max(out.recv.comp.maxOmOverN, out.recv.host.maxOmOverN);
  out.maxNumOverN = Math.max(out.recv.comp.maxNumOverN, out.recv.host.maxNumOverN);
  out.maxRotMismatchOverN = Math.max(out.recv.comp.maxRotMismatchOverN, out.recv.host.maxRotMismatchOverN);
  return out;
}
/** 第334便d の同期の零試験の量(座標変換の d ÷ n a —— 同じ量かを並べる)。q = m_comp/m_host・e は系の値と 0 */
export function syncRow(S) {
  const q = S.comp.m / S.host.m, rows = [0, S.e].map((e) => { const ds = DECL.phasesDeg.map((ph) => syncCase({ q, phase: ph * D2R, recv: 0, selfRatio: 1, op: e > 0 ? { e } : {} }).dNorm); return { e, maxD: z12(Math.max(...ds)) }; });
  return { q, circ: rows[0].maxD, ecc: rows[1].maxD };
}

/* ───────── T1 (i): 外からの並進引きずり(源の取り分と 2 体の間の差)───────── */
/**
 * 受け手(伴)の重みの和 = 自己(m/R²)+ 相互(主の m/a²)+ 外(太陽 m/D² と背景 W₀)。取り分 f_x = w_x / 和(自分を分母に含む —— 原仮定者の指示(2026-11-08 —— 第132報)・AN654)。
 * 2 体の間の差(速度 ÷ n a): 外の源の座標の速度 C = v_S + s_S × (p − p_S)(太陽 —— 回転の分 f_S s_S a と取り分の勾配の分 α f_S(1 − f_S)(a/D) V_rel)・背景は静止(座標の速度 0)で回転 ω_bg の分 f_bg |ω_bg| a だけ。
 *   V_rel = |v_orb − s_S D|(連星の重心の速さと、太陽の座標が D で運ぶ速さの差 —— 同じ平面に置いた大きさの目安)。
 */
export function externalRow(S) {
  const W0 = L337L.W0, wbg = Math.abs(L337L.wbg), R = S.comp, wSelf = selfWeight(R.m, R.R), wMut = S.host.m / (S.a * S.a);
  const wSun = S.ext.kind === 'sun' ? S.ext.m / (S.ext.D * S.ext.D) : 0, tot = wSelf + wMut + wSun + W0;
  const fSun = wSun / tot, fBg = W0 / tot, fMut = wMut / tot, fSelf = wSelf / tot;
  let dRot = 0, dGrad = 0, vRel = null;
  if (S.ext.kind === 'sun') { vRel = Math.abs(S.ext.vOrb - S.ext.spin * S.ext.D); dRot = fSun * S.ext.spin * S.a; dGrad = DECL.alpha * fSun * (1 - fSun) * (S.a / S.ext.D) * vRel; }
  const dBg = fBg * wbg * S.a, na = S.n * S.a;
  // 外の源の部位差分(iii): 太陽(源)→ 伴(受け手)を同じ col4At で(受け手の公転の速さは太陽の座標に対する V_rel の接線・受け手の自転は系の値)
  const ax = S.ext.kind === 'sun' ? partDiff({ mSrc: S.ext.m, sSrc: S.ext.spin, d: S.ext.D, mRecv: R.m, RRecv: R.R, sRecv: R.spin, vRel: [0, S.ext.vOrb, 0] }) : null;
  // (打ち消しの残りではない量 —— 丸めの床を当てない)
  return { fSelf, fMut, fSun, fBg, dRotOverNa: dRot / na, dGradOverNa: dGrad / na, dBgOverNa: dBg / na, dSumOverNa: (dRot + dGrad + dBg) / na, vRelOverC: vRel === null ? null : vRel / C0,
    extAxialOverN: ax ? ax.omClosed / S.n : null, bgAxialOverN: fBg * wbg / S.n };
}

/* ───────── T1 (v): G_loc の型の残差(第334便d の (4/3)η —— 近点の率の 1 次の取り分 −1)───────── */
/** ρ₁ = firstShare(受け手 n = 2, K1 あり, η) − 1(= (4/3)η —— 入れた式)。近点の率 ÷ n に直した大きさ = ρ₁ · 3ε/(1 − e²)(ε = G M/(a c₀²) —— 1PN の近点の率 ÷ n) */
export function glocRow(S) {
  const eta = etaOf(S.host.m, S.comp.m), rho1 = firstShare({ n: 2, pair: 'receiver' }, true, eta) - 1, eps = G * (S.host.m + S.comp.m) / (S.a * C0 * C0);
  return { eta, rho1, eps, rateOverN: Math.abs(rho1) * 3 * eps / (1 - S.e * S.e) };
}

/* ───────── T1 の表と順位 ───────── */
export const T1_COLS = Object.freeze(['fExt', 'dExt', 'mutAxCirc', 'mutAxObs', 'extAx', 'gloc']);
export function t1Table() {
  const rows = systemsOf().map((S) => {
    const ex = externalRow(S), mc = mutualRow(S, 0), mo = mutualRow(S), sy = syncRow(S), gl = glocRow(S);
    return { key: S.key, ja: S.ja, mutualLock: S.mutualLock, n: S.n, a: S.a, e: S.e, ext: S.ext.kind, ex, mutCirc: { maxOmOverN: mc.maxOmOverN, maxRotMismatchOverN: mc.maxRotMismatchOverN }, mutObs: mo, sync: sy, gloc: gl,
      idx: { fExt: ex.fSun + ex.fBg, dExt: ex.dSumOverNa, mutAxCirc: mc.maxOmOverN, mutAxObs: mo.maxOmOverN, extAx: ex.extAxialOverN === null ? ex.bgAxialOverN : ex.extAxialOverN, gloc: gl.rateOverN } };
  });
  // 順位(小さい方から 1 —— 同じ値は同じ順位)
  const rank = {};
  for (const c of T1_COLS) { const vs = rows.map((r) => r.idx[c]); rank[c] = Object.fromEntries(rows.map((r) => [r.key, 1 + vs.filter((v) => v < r.idx[c]).length])); }
  const pc = rows.find((r) => r.key === 'plutoCharon');
  return { rows, rank, plutoRank: Object.fromEntries(T1_COLS.map((c) => [c, rank[c].plutoCharon])), plutoMutCirc: pc.mutCirc.maxOmOverN, plutoSyncCirc: pc.sync.circ };
}

/* ───────── T2: 斜め軌道で赤道面から離れる期間 ───────── */
/** ケプラーの方程式(ニュートン法 —— 決まった反復) */
export function eccAnom(M, e) { let E = e < 0.8 ? M : Math.PI; for (let k = 0; k < 50; k++) { const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= dE; if (Math.abs(dE) < 1e-15) break; } return E; }
/** 黄道 J2000 の太陽中心の位置(a [m]・e・i・Ω・ϖ [deg]・平均近点角 M) */
export function helioPos([aAU, e, iDeg, nodeDeg, varpiDeg], M) {
  const a = aAU * AU, E = eccAnom(M, e), xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const O = nodeDeg * D2R, w = (varpiDeg - nodeDeg) * D2R, i = iDeg * D2R, cO = Math.cos(O), sO = Math.sin(O), cw = Math.cos(w), sw = Math.sin(w), ci = Math.cos(i), si = Math.sin(i);
  return [(cO * cw - sO * sw * ci) * xp + (-cO * sw - sO * cw * ci) * yp, (sO * cw + cO * sw * ci) * xp + (-sO * sw + cO * cw * ci) * yp, (sw * si) * xp + (cw * si) * yp];
}
/** 太陽の源(第337便i の sourceOf('sun') の質量・自転・扁平率 —— 軸だけ黄道 J2000 の太陽の極〔第337便l の DECL.spins.sun.sHat〕に置く) */
export function sunEcl() { const s = RR.sourceOf('sun'); return Object.assign({}, s, { axis: L337L.spins.sun.sHat.slice() }); }
export function t2Table({ N = DECL.t2N } = {}) {
  const sun = sunEcl(), kS = sun.axis, kInv = orbitNormal(LIT.invariable.iDeg, LIT.invariable.nodeDeg), Req = RR.rdOf(sun, 'Req'), Rsun = sun.Robs;
  const eff = RR.effectOfSpec(sun, { prof: 'slice', action: 'focus', reading: 'Req', speed: 'obs', lambda: DECL.t2Lambda });
  const H = { Req, Rsun, au01: 0.1 * AU };
  const rows = Object.entries(LIT.helio).map(([key, el]) => {
    const nO = orbitNormal(el[2], el[3]), incSun = thinAngle(nO, kS) / D2R, incInv = thinAngle(nO, kInv) / D2R;
    let zr = 0, fieldN = 0, fieldMax = 0, fieldMean = 0, zMax = 0; const inside = { Req: 0, Rsun: 0, au01: 0 };
    for (let k = 0; k < N; k++) {
      const M = 2 * Math.PI * (k + 0.5) / N, p = helioPos(el, M), r = nrm(p), z = Math.abs(dot(p, kS));
      zr += z / r / N; if (z > zMax) zMax = z;
      for (const b of DECL.t2Bands) if (z <= H[b]) inside[b] += 1;
      const d = nrm(eff.d(p)); if (d > 0) { fieldN += 1; fieldMean += d / N; if (d > fieldMax) fieldMax = d; }
    }
    const n = 2 * Math.PI / (Math.sqrt(Math.pow(el[0] * AU, 3) / (G * MSUN)));
    return { key, aAU: el[0], e: el[1], iEclDeg: el[2], incSunDeg: incSun, incInvDeg: incInv, meanZoverR: zr, zMaxAU: zMax / AU,
      outside: Object.fromEntries(DECL.t2Bands.map((b) => [b, (N - inside[b]) / N])), inside: Object.fromEntries(DECL.t2Bands.map((b) => [b, inside[b] / N])),
      // 帯の内の時間の割合の解析の目安(円・帯の半幅 H ≪ a sin i: (2/π) H/(a sin i) —— 標本で 0 になる細い帯の桁)
      insideGuide: Object.fromEntries(DECL.t2Bands.map((b) => [b, H[b] < el[0] * AU * Math.sin(incSun * D2R) ? (2 / Math.PI) * Math.asin(H[b] / (el[0] * AU * Math.sin(incSun * D2R))) : 1])),
      fieldTimeFrac: fieldN / N, fieldMaxOverNa: fieldMax / (n * el[0] * AU), fieldMeanOverNa: fieldMean / (n * el[0] * AU) };
  });
  const pl = rows.find((r) => r.key === 'pluto'), others = rows.filter((r) => r.key !== 'pluto');
  return { ReqSun: Req, Rsun, lambda: DECL.t2Lambda, rows, plutoIncSunRank: 1 + others.filter((r) => r.incSunDeg > pl.incSunDeg).length,
    plutoMeanZRank: 1 + others.filter((r) => r.meanZoverR > pl.meanZoverR).length, anyFieldTime: rows.some((r) => r.fieldTimeFrac > 0) };
}

/* ───────── T3: 対照の段 ───────── */
/** 閉じた式の周期 P = 2π √(a³/GM) */
export const periodOf = (a, GM) => 2 * Math.PI * Math.sqrt(a * a * a / GM);
/** 二体の相対の軌道を RK4 で積分し、1 公転(近点から近点 —— 位置角の 2π の通過を線形の補間で)の時間を返す */
export function integratePeriod({ a, e, GM, steps }) {
  const P0 = periodOf(a, GM), h = P0 / steps, rp = a * (1 - e), vp = Math.sqrt(GM * (1 + e) / (a * (1 - e)));
  let x = [rp, 0], v = [0, vp], t = 0, th = 0;
  const acc = (q) => { const r = Math.hypot(q[0], q[1]), k = -GM / (r * r * r); return [k * q[0], k * q[1]]; };
  for (let s = 0; s < steps * 2; s++) {
    const a1 = acc(x), k1x = v, k1v = a1;
    const x2 = [x[0] + k1x[0] * h / 2, x[1] + k1x[1] * h / 2], v2 = [v[0] + k1v[0] * h / 2, v[1] + k1v[1] * h / 2], k2v = acc(x2);
    const x3 = [x[0] + v2[0] * h / 2, x[1] + v2[1] * h / 2], v3 = [v[0] + k2v[0] * h / 2, v[1] + k2v[1] * h / 2], k3v = acc(x3);
    const x4 = [x[0] + v3[0] * h, x[1] + v3[1] * h], v4 = [v[0] + k3v[0] * h, v[1] + k3v[1] * h], k4v = acc(x4);
    const xn = [x[0] + h / 6 * (v[0] + 2 * v2[0] + 2 * v3[0] + v4[0]), x[1] + h / 6 * (v[1] + 2 * v2[1] + 2 * v3[1] + v4[1])];
    const vn = [v[0] + h / 6 * (k1v[0] + 2 * k2v[0] + 2 * k3v[0] + k4v[0]), v[1] + h / 6 * (k1v[1] + 2 * k2v[1] + 2 * k3v[1] + k4v[1])];
    const thn = th + Math.atan2(x[0] * xn[1] - x[1] * xn[0], x[0] * xn[0] + x[1] * xn[1]);
    if (th < 2 * Math.PI && thn >= 2 * Math.PI) { const u = (2 * Math.PI - th) / (thn - th); return { P: t + u * h, P0 }; }
    x = xn; v = vn; t += h; th = thn;
  }
  throw new RangeError('integratePeriod: 1 公転を通過しない');
}
export function t3Table() {
  const SYS = systemsOf(), S = SYS.find((x) => x.key === 'plutoCharon'), GMr = LIT.plutoCharonGM;
  const pBuie = DECL.pBuieS, rel = (dP) => dP / pBuie;
  // (1) 理想の円・相互ロック・外部の場なし
  const P1 = periodOf(GMr.aPlu060Mean, GMr.plu060), mc = mutualRow(S, 0), sy0 = syncCase({ q: S.comp.m / S.host.m, phase: 0.7, recv: 0, selfRatio: 1 }).dNorm;
  const conv = DECL.t3Steps.map((steps) => { const r = integratePeriod({ a: GMr.aPlu060Mean, e: 0, GM: GMr.plu060, steps }); return { steps, dP: z12(r.P - r.P0, r.P0), relErr: z12((r.P - r.P0) / r.P0) }; });
  const convE = DECL.t3Steps.map((steps) => { const r = integratePeriod({ a: GMr.aPlu060Mean, e: LIT.charonE.e, GM: GMr.plu060, steps }); return { steps, dP: z12(r.P - r.P0, r.P0), relErr: z12((r.P - r.P0) / r.P0) }; });
  const st1 = { P: P1, minusBuie: P1 - pBuie, mutAxOverN: z12(mc.maxOmOverN), mutAxNumOverN: mc.maxNumOverN, rotMismatchOverN: mc.maxRotMismatchOverN, syncD: z12(sy0), conv };
  // (2) 観測の入力(離心率 e の桁・自転軸は公転の軸に揃う —— 傾きのノブ 0)・外部の場なし: 残る差分と定義の差の内訳
  const mo = mutualRow(S), syE = syncRow(S).ecc;
  const PaOnly = periodOf(GMr.aPlu060Mean, GMr.buie), Pbuie2 = periodOf(GMr.aBuie, GMr.buie);
  const st2 = { e: S.e, mutAxOverN: mo.maxOmOverN, syncD: syE, conv: convE,
    split: { closedBuie: Pbuie2, closedBuieMinusObs: Pbuie2 - pBuie, aPart: PaOnly - Pbuie2, gmPart: P1 - PaOnly, total: P1 - pBuie, aGapKm: (GMr.aPlu060Mean - GMr.aBuie) / 1e3, gmGapKm3s2: (GMr.plu060 - GMr.buie) / 1e9 },
    relDef: rel(DECL.defDiffS), relSigma: rel(DECL.sigmaS) };
  // (3) 太陽の場: 近日点・遠日点で外の取り分と 2 体の間の差・外の部位差分・重力の潮汐(候補の型の外 —— 対照の物差し)
  const el = LIT.helio.pluto, Dq = el[0] * AU * (1 - el[1]), DQ = el[0] * AU * (1 + el[1]), mPC = S.host.m + S.comp.m;
  const phaseRow = (lab, D) => { const S2 = Object.assign({}, S, { ext: Object.assign({}, S.ext, { D, vOrb: Math.sqrt(G * MSUN * (2 / D - 1 / (el[0] * AU))) }) }), ex = externalRow(S2);
    return { at: lab, DAU: D / AU, fSun: ex.fSun, dExtOverNa: ex.dSumOverNa, extAxOverN: ex.extAxialOverN, tideOverMutual: 2 * MSUN * Math.pow(S.a / D, 3) / mPC }; };
  const nOut = 2 * Math.PI / LIT.plutoHelioP;
  const pole = eclOfRaDec(LIT337J.pluto.poleRA, LIT337J.pluto.poleDec), nHel = orbitNormal(el[2], el[3]), mutInc = thinAngle(pole, nHel) / D2R;
  const nodeRateOverN = 0.75 * Math.pow(nOut / S.n, 2) * Math.abs(Math.cos(mutInc * D2R)) / Math.pow(1 - el[1] * el[1], 1.5);
  const t2 = t2Table({ N: 720 }), plT2 = t2.rows.find((r) => r.key === 'pluto');
  const st3 = { rows: [phaseRow('近日点', Dq), phaseRow('平均の距離', el[0] * AU), phaseRow('遠日点', DQ)], mutIncDeg: mutInc, nodeRateOverN, nodePeriodYr: 2 * Math.PI / (nodeRateOverN * S.n) / YR, rotVertTimeFrac: plT2.fieldTimeFrac };
  // (4) 銀河の背景(背景が静止 —— 恒久): 2 体に共通の座標変換(背景の回転 ω_bg を両方に同じ取り分で)と、取り分の差(観測できる応答の候補)
  const W0 = L337L.W0, wbg = Math.abs(L337L.wbg), wSun = MSUN / Math.pow(el[0] * AU, 2);
  const fbgOf = (R, Mo) => W0 / (selfWeight(R.m, R.R) + Mo.m / (S.a * S.a) + wSun + W0);
  const fP = fbgOf(S.host, S.comp), fC = fbgOf(S.comp, S.host);
  const st4 = { fBgPluto: fP, fBgCharon: fC, commonRotOverN: Math.min(fP, fC) * wbg / S.n, diffRotOverN: Math.abs(fP - fC) * wbg / S.n, commonDetect: 0 };
  // 対照として使える量: 段ごとの候補の型の大きさ(÷ n)と入力の相対の差(定義の差・σ)の大小
  const cand = [
    { key: 'mutAxObs', ja: '(2) 相互の部位差分(離心率の桁)', v: st2.mutAxOverN },
    { key: 'dExtPeri', ja: '(3) 太陽の並進引きずりの 2 体の間の差(近日点)', v: st3.rows[0].dExtOverNa },
    { key: 'extAxPeri', ja: '(3) 太陽の部位差分(近日点)', v: st3.rows[0].extAxOverN },
    { key: 'tidePeri', ja: '(3) 太陽の重力の潮汐 ÷ 相互の重力(近日点 —— 候補の型の外・対照の物差し)', v: st3.rows[0].tideOverMutual },
    { key: 'nodeRate', ja: '(3) 太陽の重力の潮汐による交点の回りの率 ÷ n(候補の型の外・対照の物差し)', v: nodeRateOverN },
    { key: 'bgDiff', ja: '(4) 背景軸引きずりの取り分の差の分', v: st4.diffRotOverN },
    { key: 'gloc', ja: '(v) G_loc の型の残差の近点の率 ÷ n', v: glocRow(S).rateOverN },
  ].map((c) => Object.assign(c, { overDef: c.v > st2.relDef, overSigma: c.v > st2.relSigma }));
  return { st1, st2, st3, st4, cand, nOverDef: cand.filter((c) => c.overDef).length, nOverSigma: cand.filter((c) => c.overSigma).length };
}

/* ───────── T4: 天体の特性の係数の入口(第340便b の (a) 回転率・(b) ずれの率 = 2 × (a) —— 係数 1・0.5 の 4 点だけ)───────── */
export function t4Table(t1) {
  const pc = t1.rows.find((r) => r.key === 'plutoCharon'), em = t1.rows.find((r) => r.key === 'earthMoon');
  const base = (r) => r.mutObs.maxOmOverN;   // col4At は最小二乗の回転(第340便b: 有限の受け手の最小二乗の回転は (a) に寄る)
  const pts = [];
  for (const sys of [pc, em]) for (const put of ['a', 'b']) for (const c of DECL.t4Coef) pts.push({ key: sys.key, put, coef: c, omOverN: base(sys) * (put === 'b' ? 2 : 1) * c });
  return { pts, note: '係数を自分の式として持たない —— 第341便b の列(天体の特性の係数)に次の便で当てる' };
}

/* ───────── 純関数の場面(門)───────── */
export function pureScenes() {
  const S = systemsOf(), pc = S.find((x) => x.key === 'plutoCharon');
  // ① 理想の円・相互ロックで相互の部位差分が 0(座標変換で消える)
  const lockZero = mutualRow(pc, 0).maxOmOverN;
  // ② 同じ配置で非同期(受け手の自転 1.1 n): 部位差分の閉じた形は 0 のまま・並進の回転成分と受け手の自転の差 f |Δs| が 0 でない(非同期は座標の回転の側に出る —— 反例)
  const k = kepRel(pc.a, 0, pc.n, 0), qa = partDiff({ mSrc: pc.host.m, sSrc: pc.n, d: k.r, mRecv: pc.comp.m, RRecv: pc.comp.R, sRecv: 1.1 * pc.n, vRel: k.v });
  const async = { closed: qa.omClosed / pc.n, rotMismatch: qa.f * 0.1 };
  // ③ 離心率で部位差分が増える(e の 1 次 —— 2e-4 と 2e-3 の比が 10 の ±5% の内)
  const r1 = mutualRow(pc, 2e-4).maxOmOverN, r2 = mutualRow(pc, 2e-3).maxOmOverN, ratio = r2 / r1;
  // ④ 第334便d の同期の零試験(円・同期で d ≤ 1.2e-16)
  const syncZ = syncRow(pc).circ;
  // ⑤ 閉じた式の周期と数値の積分(2880 步)の差が 1e-9 の内
  const ip = integratePeriod({ a: 1.9595764e7, e: 0, GM: 975.4e9, steps: 2880 }), intRel = Math.abs(ip.P - ip.P0) / ip.P0;
  // ⑥ 定義の差の内訳の和が +7.216805 s(閉じた式 —— 1e-6 s の内)
  const G2 = LIT.plutoCharonGM, split = periodOf(G2.aPlu060Mean, G2.plu060) - DECL.pBuieS;
  // ⑦ T2 の幾何: 黄道に対する傾き(冥王星 17.16°)を軌道の法線と黄道の極の薄い角で読み戻す
  const back = thinAngle(orbitNormal(17.16, 110.30), [0, 0, 1]) / D2R;
  // ⑧ 入力の拒否
  let rej = 0; const tries = [() => partDiff({ mSrc: 0, sSrc: 1, d: 1, mRecv: 1, RRecv: 1, sRecv: 1, vRel: [0, 0, 0] }), () => partDiff({ mSrc: 1, sSrc: NaN, d: 1, mRecv: 1, RRecv: 1, sRecv: 1, vRel: [0, 0, 0] }),
    () => partDiff({ mSrc: 1, sSrc: 1, d: -1, mRecv: 1, RRecv: 1, sRecv: 1, vRel: [0, 0, 0] }), () => partDiff({ mSrc: 1, sSrc: 1, d: 1, mRecv: 1, RRecv: 0, sRecv: 1, vRel: [0, 0, 0] })];
  for (const t of tries) { try { t(); } catch (e) { rej++; } }
  return { lockZero, async, ratio, syncZ, intRel, split, back, reject: { n: rej, of: tries.length } };
}
export function pureGates(P) {
  return { lockZero: P.lockZero === 0, async: P.async.closed === 0 && P.async.rotMismatch > 1e-6, ratio: Math.abs(P.ratio - 10) <= 0.5, syncZ: P.syncZ <= 1.2e-16, intRel: P.intRel <= 1e-9,
    split: Math.abs(P.split - DECL.defDiffS) <= 1e-6, back: Math.abs(P.back - 17.16) <= 1e-9, reject: P.reject.n === P.reject.of };
}

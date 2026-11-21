// 第347便e(原仮定者の回答(2026-11-21 —— 第145報)「AN910: 推奨で進める」「AN911: 推奨で進める」・推奨で進める項 AN912・AN913・統括の検証項目 R404):
//   **「今の自転に合成する」の続き —— 続けて足すトルク(C2)を主の候補に、2 倍角の則の角の引数を「受け手の位置の緯度(源の軸方向に対する角)」を主の候補・
//   「軸どうしの角」を比べる列にした天体の表・C2 の尺度の置き方の 2 列(軸引きずりの率に結ぶ列・トルクを固定して尺度を天体の性質のノブにする列)と今の置き方・
//   C2 の散逸の項の熱の窓・120° の三次元の残りの候補 2 つ(第 3 の項・写像の外の位相)を黄道の極を先に**
//   (器 tests/exp-w347e-spintorque.mjs と QA behavior.spintorque347e・docs.spintorque347e が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   **全部「診断」**(エンジン・内蔵の本・受理器・`S._core` へ足す操作ではない —— AN712)。アプリのジャイロの步・自転の式は変えない。
//   既存の lib(第344便e・第343便e・第342便e・第341便f・第340便h・第337便j・第337便l・第337便c・第332便a・第330便a・第299便c)は呼ぶだけ(本文は変えない)。
//
// ■ 2 倍角の則の向き(AN346「源の軸回転が、軸方向に対する角度差の 2 倍の角度差で傾いた軸で作用」)の角の引数 2 つ:
//   (lat —— 主の候補・AN911) 受け手の位置 r̂ の、源の軸 ŝ に対する角 ψ を 2ψ に写す: â = 2(ŝ·r̂) r̂ − ŝ(第337便l の lib の `twoAngleAxis` —— 赤道面で逆回転・軸方向で順回転)。
//     受け手は公転するので r̂ は動く。源の赤道面に対する公転面の傾き i のとき、1 公転の平均は閉じた形で ⟨â⟩ = −cos i n̂(n̂ = 公転面の法線)。
//     → 平均の作用の軸は自分の公転面の法線の逆向き(大きさ cos i)—— 受け手の自転との角は 180° − 傾き(公転面に対する)。公転の位相での向きの変わり(符号の反転の有無)は別の欄。
//   (ax —— 比べる列) 源の軸と今の自転の軸の角 θ を 2θ に写す(第344便e の (C3) と同じ —— â = cos 2θ ω̂ + sin 2θ ê・ê は ŝ の ω̂ に垂直な成分の向き)。
// ■ 合成の型: (C2) 続けて足すトルク(主の候補 —— 第344便e の型をそのまま): 受け手に T = c (k ẑ × D + b D)・源に −T・D = 源の側の回転 − 受け手の回転・ẑ = 受け手 × 源 の向きの単位。
//   源の側を目標(今の自転 + ΔΩ)に置く(源の慣性モーメント ∞)—— b > 0 では D → 0 で、定常の自転と傾きは (C1)(一度だけ足すベクトル —— 合成した先の目安)と同じ。
//   ΔΩ = Ω_T â(大きさの読みは第343便e の (m1) 軸引きずりの率・(m2) 源の自転の速さ)。
// ■ 尺度の置き方(AN913): (S0) 今(第344便e): c = a_j ÷ abs(ΔΩ)(a_j = 第342便e の向ける力の前の係数)/(S1) 軸引きずりの率に結ぶ: c = I Ω_m1(Ω_m1 = C_b β abs(1 − α) abs(ω_src) [1/s] —— 届くまでの時間 = ln 100 ÷ (b Ω_m1))/
//   (S2) トルクを固定して尺度を天体の性質のノブに: c = C_s a_j ÷ abs(ω)(相対の回転が今の自転と同じ大きさのときのトルクを a_j に固定・C_s は天体ごとのノブ —— 既定 1)。
// ■ 3 値の判定(増す・減る・未解決): 第341便c の型 —— 第340便h の lib の judge3(値・尺度・係数 4。入力が有限でない・尺度が負なら「未解決」)。尺度 = 打ち消し得る項の大きさの和 × 2⁻⁵²
//   (浮動小数点の丸めの桁 —— 物理の量が 0 だという主張ではない)。第344便e の自前の 3 値(composeOnce の judge —— 床 1e-12)は比べる欄。
// ■ 言わないこと: 合成の型・引数・尺度の答え、金星の逆行の由来、120° の由来、内部熱の答え、とは書かない。この型・この引数・この尺度では、の表。観測の自転の数は固定の比べる列(合わせない)。
//   文献の値はリポジトリの中の値(文献の値・未照合)。積分の時間は絶対時間(現行の近似 —— 当事者時間の換算は当てていない)。
import * as L344 from './lib-w344e-spincompose.mjs';
import * as E343 from './lib-w343e-spintransfer.mjs';
import * as P from './lib-w342e-powerball.mjs';
import * as F from './lib-w341f-gyroheat.mjs';
import * as THIN from './lib-w340h-thin.mjs';
import * as J337 from './lib-w337j-spinorbit.mjs';
import * as BV from './lib-w337l-bevel.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import { LIT as LIT332A } from './lib-w332a-eqband.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';
import { PLANETS as PL299 } from './lib-w299c-planets3d.mjs';

export const LIB_VERSION = 'w347e-spintorque-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180, YR = TL.YR, G = TL.G_SI, C0 = TL.C_SI, AU = 1.495978707e11, EPS = Math.pow(2, -52);

/* ───────── 宣言(走らせるノブの格子と判定の物差し)───────── */
export const DECL = Object.freeze({
  /** 受け手と源(水星〜海王星は太陽の項・月は地球〔交点の位相 2 つ〕と太陽・イオは木星と太陽・冥王星はカロンと太陽) */
  pairs: Object.freeze([['Mercury', 'Sun'], ['Venus', 'Sun'], ['Earth', 'Sun'], ['Mars', 'Sun'], ['Jupiter', 'Sun'], ['Saturn', 'Sun'], ['Uranus', 'Sun'], ['Neptune', 'Sun'],
    ['Moon', 'EarthHi'], ['Moon', 'EarthLo'], ['Moon', 'Sun'], ['Io', 'Jupiter'], ['Io', 'Sun'], ['Pluto', 'Charon'], ['Pluto', 'Sun']]),
  args: Object.freeze(['lat', 'ax']),
  magReadings: Object.freeze(['m1', 'm2']),
  scales: Object.freeze(['S0', 'S1', 'S2']),
  alpha: 2, cb: 1, cs: 1,
  /** C2 の (k, b) の組(第344便e と同じ 4 組) */
  kb: Object.freeze([Object.freeze([1, 0]), Object.freeze([-1, 0]), Object.freeze([-1, 0.1]), Object.freeze([0, 0.1])]),
  bMain: 0.1, reachFrac: 0.01,
  judgeFactor: THIN.DECL.JUDGE_FACTOR, judgeUlp: EPS,
  /** 公転の位相の点の数(1 公転の平均と符号の反転の有無) */
  nPhase: 720,
  /** 窓(第344便e と同じ物差し): イオの熱 ≤ 観測・木星の熱 ≥ 物差しの 0.1 倍 */
  highFrac: 0.1, ageYr: 4.57e9,
  /** 月の公転面(黄道に対する 5.145°・月の自転の軸と黄道の極 1.54° —— 第332便a・第341便f の lib の値)。交点の位相 2 つ(地球の赤道面に対する傾きの最大と最小) */
  moonIncEclDeg: LIT332A.moons.rows.find((r) => r.name === '月').i, moonSpinEclDeg: F.LIT.obl.MoonSun,
  /** イオの公転面と木星の赤道面の傾き(第332便a の lib の値 —— 方位は黄道の極の側に置く宣言) */
  ioIncDeg: LIT332A.moons.rows.find((r) => r.name === 'イオ').i,
  /** T4 の極と銀河の向ける先 */
  poles: Object.freeze(['ecl', 'inv']), galDirs: Object.freeze(['rev', 'ident']),
  sunReadings: Object.freeze(['ax', 'latNode', 'latMax', 'latMean']),
});

/** 文献の値(リポジトリの中の値の写し —— 文献の値・未照合) */
export const LIT = Object.freeze({
  note: '文献の値・未照合(リポジトリの中の値を呼ぶか写す —— この環境から一次資料に当たっていない)',
  /** 天王星・海王星の質量と半径(paper/data/solar-observations.csv の行の写し —— QA が CSV と照合する)・慣性係数と自転の周期は第330便a の lib・半長軸は第337便j の lib */
  uranus: Object.freeze({ M: 8.6811e25, R: 25559000 }), neptune: Object.freeze({ M: 1.02409e26, R: 24764000 }),
  csvRows: Object.freeze({ uranus: Object.freeze(['Uranus,mass,8.6811e25', 'Uranus,radius,25559000']), neptune: Object.freeze(['Neptune,mass,1.02409e26', 'Neptune,radius,24764000']) }),
  /** 観測の自転の変化の率(第337便j の lib —— 固定の比べる列・合わせない) */
  spinRates: J337.LIT.spinRates,
  src: '極の向きと公転の要素は第299便c の lib(IAU の極・JPL の近似要素)と第337便j の lib(冥王星)・太陽の極は第342便e の lib・公転面と太陽の赤道面の傾きの表は第332便a の lib(比べる欄)',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => scl(a, 1 / nrm(a));
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const angDeg = (a, b) => E343.angleOf(a, b) / D2R;   // atan2(abs(外積), 内積)
/** a を b の側へ角 deg 回す(a と b の面の内 —— a は単位) */
const tiltToward = (a, b, deg) => { const v = sub(b, scl(a, dot(a, b))), m = nrm(v); const u = m > 0 ? scl(v, 1 / m) : unit(crs(a, [1, 0, 0])); return add(scl(a, Math.cos(deg * D2R)), scl(u, Math.sin(deg * D2R))); };

/** 3 値(第341便c の型 —— 第340便h の lib の judge3。尺度 = 打ち消し得る項の大きさの和 × 2⁻⁵²): 'up'・'down'・'unresolved' */
export function judgeSigned(v, termsAbsSum) {
  const r = THIN.judge3(v, termsAbsSum * DECL.judgeUlp, DECL.judgeFactor);
  return r === THIN.DECL.POS ? 'up' : r === THIN.DECL.NEG ? 'down' : 'unresolved';
}

/* ───────── 2 倍角の則の向き(引数 2 つ)───────── */
/** 公転の位相 u の受け手の位置(源の赤道面との交点の線 x̂・公転面の内の直交 ŷ′) */
function orbitFrame(s, n) {
  const x0 = crs(s, n), x = nrm(x0) > 1e-12 ? unit(x0) : unit(crs(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), y = crs(n, x);
  return { x, y };
}
/** (lat) 1 公転の平均(閉じた形 −cos i n̂)と、位相の点での数の平均・受け手の自転との内積の最小と最大(符号の反転の有無) */
export function latAxis(s, n, w, nPts = DECL.nPhase) {
  if (!(isVec(s) && isVec(n) && isVec(w))) throw new RangeError('latAxis: ベクトル');
  const su = unit(s), nu = unit(n), wu = unit(w), { x, y } = orbitFrame(su, nu), ci = dot(su, nu);
  let mean = [0, 0, 0], lo = Infinity, hi = -Infinity;
  for (let k = 0; k < nPts; k++) {
    const u = 2 * Math.PI * (k + 0.5) / nPts, r = add(scl(x, Math.cos(u)), scl(y, Math.sin(u))), a = BV.twoAngleAxis(su, r);
    mean = add(mean, scl(a, 1 / nPts)); const p = dot(a, wu); lo = Math.min(lo, p); hi = Math.max(hi, p);
  }
  const closed = scl(nu, -ci);
  return { closed, mean, meanDiff: nrm(sub(mean, closed)), projMin: lo, projMax: hi, phaseFlip: lo < 0 && hi > 0, cosI: ci };
}
/** (ax) 軸どうしの角 θ を 2θ に(第344便e の (C3) の向き —— 3 次元で) */
export function axAxis(s, w) {
  if (!(isVec(s) && isVec(w))) throw new RangeError('axAxis: ベクトル');
  const wu = unit(w), su = unit(s), th = E343.angleOf(wu, su), v = sub(su, scl(wu, dot(su, wu))), m = nrm(v);
  const e = m > 0 ? scl(v, 1 / m) : [0, 0, 0];
  return add(scl(wu, Math.cos(2 * th)), scl(e, Math.sin(2 * th)));
}

/* ───────── 天体(受け手)と源 ───────── */
function bodies() {
  const PR = P.bodyRows(), FR = F.bodyRows(), BS = TL.BODY_SRC, wSun = 2 * Math.PI / BS.Sun.spin[0], MS = BS.Sun.M[0];
  const pick = (rows, id) => rows.find((r) => r.id === id);
  const built = (id, M, R, C, spinS, a) => ({ id, I: C * M * R * R, omega: 2 * Math.PI / Math.abs(spinS), retro: false, tilt: [{ src: 'Sun', beta: G * MS / (a * C0 * C0), w: wSun }] });
  const S = S330.DECL.lit, DAY = 86400, k = (o) => Object.keys(o)[0], MER = k({ mercury: 1 });
  const out = {};
  for (const id of ['Venus', 'Earth', 'Mars', 'Jupiter', 'Io', 'Pluto']) { const r = pick(PR, id); out[id] = { id, I: r.I, omega: Math.abs(r.omega), retro: r.omega < 0, tilt: r.tilt }; }
  for (const id of ['Saturn', 'Moon']) { const r = pick(FR, id); out[id] = { id, I: r.I, omega: Math.abs(r.omega), retro: r.omega < 0, tilt: r.tilt }; }
  out.Mercury = built('Mercury', BS.Mercury.M[0], BS.Mercury.R[0], BS.Mercury.C[0], BS.Mercury.spin[0], BS.Mercury.aHel[0]);
  out.Uranus = Object.assign(built('Uranus', LIT.uranus.M, LIT.uranus.R, S.moi.uranus, S.spinDays.uranus * DAY, J337.LIT.aAU.uranus * AU), { retro: S.spinDays.uranus < 0 });
  out.Neptune = built('Neptune', LIT.neptune.M, LIT.neptune.R, S.moi.neptune, S.spinDays.neptune * DAY, J337.LIT.aAU.neptune * AU);
  void MER;
  return out;
}
/** 向き(黄道 J2000): 源の軸 ŝ・公転面の法線 n̂・受け手の自転 ω̂。decl = 'vec'(極と要素から)/'declared'(宣言の面) */
export function geometry() {
  const S = P.spinUnit('Sun'), E = [0, 0, 1], pl = (key) => PL299.find((p) => p.key === key);
  const wOf = (key) => { const p = pl(key).pole; return scl(P.eclUnit(p.ra, p.dec), p.wSign); }, nOf = (key) => { const e = pl(key).el; return J337.orbitNormal(e.I, e.Om); };
  const wE = P.eclUnit(0, 90), wJ = wOf('jupiter'), nJ = nOf('jupiter');
  const wP = P.eclUnit(J337.LIT.pluto.poleRA, J337.LIT.pluto.poleDec), nP = J337.orbitNormal(J337.LIT.pluto.iDeg, J337.LIT.pluto.nodeDeg);
  const G = {};
  for (const key of ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']) { const id = key[0].toUpperCase() + key.slice(1); G[id + '|Sun'] = { s: S, n: nOf(key), w: wOf(key), decl: 'vec' }; }
  G['Earth|Sun'] = { s: S, n: E, w: wE, decl: 'vec' };
  // 月: 黄道の極 E・地球の軸・月の公転面の法線・月の自転の軸を同じ面に(カッシーニの状態 —— 法線と自転の軸は E を挟んで反対の側)。交点の位相 2 つ(地球の軸から遠い側 = 傾きの最大・近い側 = 最小)
  const iM = DECL.moonIncEclDeg, eM = DECL.moonSpinEclDeg, away = sub(E, sub(wE, scl(E, dot(wE, E)))), toward = add(E, sub(wE, scl(E, dot(wE, E))));
  const nHi = tiltToward(E, away, iM), wHi = tiltToward(E, toward, eM), nLo = tiltToward(E, toward, iM), wLo = tiltToward(E, away, eM);
  G['Moon|EarthHi'] = { s: wE, n: nHi, w: wHi, decl: 'declared' }; G['Moon|EarthLo'] = { s: wE, n: nLo, w: wLo, decl: 'declared' };
  G['Moon|Sun'] = { s: S, n: E, w: wHi, decl: 'declared' };   // 太陽のまわりの道は地球の公転面(宣言)
  const nIo = tiltToward(wJ, E, DECL.ioIncDeg);
  G['Io|Jupiter'] = { s: wJ, n: nIo, w: nIo, decl: 'declared' }; G['Io|Sun'] = { s: S, n: nJ, w: nIo, decl: 'declared' };   // イオは同期(自転の軸 = 公転面の法線)・太陽のまわりの道は木星の公転面(宣言)
  G['Pluto|Charon'] = { s: wP, n: wP, w: wP, decl: 'declared' };   // 互いに同期(カロンの自転の軸 = 公転面の法線 = 冥王星の自転の軸)
  G['Pluto|Sun'] = { s: S, n: nP, w: wP, decl: 'vec' };
  return G;
}
const srcKey = (src) => (src === 'EarthHi' || src === 'EarthLo' ? 'Earth' : src);

/* ───────── T1 C2 を主にした表 ───────── */
export const makeCtx = () => L344.makeCtx();
const scaleC = (sc, { a, dAbs, I, Om1, w }) => (sc === 'S0' ? (dAbs > 0 ? a / dAbs : 0) : sc === 'S1' ? I * Om1 : sc === 'S2' ? DECL.cs * a / w : (() => { throw new RangeError('scaleC: 尺度は ' + DECL.scales.join('・')); })());
/** C2 の初めのトルクの、受け手の自転の向きの成分(項ごとの大きさの和も返す —— 3 値の尺度) */
export function c2Initial(Or, dO, c, k, b) {
  if (!(isVec(Or) && isVec(dO) && fin(c) && c >= 0 && fin(k) && fin(b) && b >= 0)) throw new RangeError('c2Initial: 入力');
  const x = crs(Or, dO), z = nrm(x) > 0 ? unit(x) : [0, 0, 0], wu = unit(Or), g = scl(crs(z, dO), c * k), d = scl(dO, c * b);
  return { par: dot(g, wu) + dot(d, wu), terms: c * (Math.abs(k) + b) * nrm(dO), heat: c * b * dot(dO, dO) };
}
export function t1Table(ctx = makeCtx()) {
  const B = bodies(), GEO = geometry(), s0 = E343.baseScale(ctx), out = [];
  const old = L344.t2Table(ctx);
  for (const [id, src] of DECL.pairs) {
    const b = B[id], q = b.tilt.find((t) => t.src === srcKey(src)), g = GEO[id + '|' + src];
    const w = b.omega, Or = scl(unit(g.w), w), Om1 = DECL.cb * q.beta * Math.abs(1 - DECL.alpha) * Math.abs(q.w), a = s0 * b.I * q.beta * Math.abs(1 - DECL.alpha) * Math.abs(q.w);
    const LA = latAxis(g.s, g.n, g.w), dirs = { lat: LA.closed, ax: axAxis(g.s, g.w) };
    const geo = { thetaAxDeg: angDeg(g.w, g.s), incDeg: angDeg(g.n, g.s), oblDeg: angDeg(g.w, g.n), cosI: LA.cosI, phaseFlip: LA.phaseFlip, latProjMin: LA.projMin, latProjMax: LA.projMax,
      latMeanDiff: LA.meanDiff, latProjJ337: J337.twoAngleMean({ sSrc: g.s, wOrb: g.n, sRecv: g.w }).proj, decl: g.decl };
    for (const m of DECL.magReadings) {
      const OT = m === 'm1' ? Om1 : Math.abs(q.w), per = {};
      for (const arg of DECL.args) {
        const dO = scl(dirs[arg], OT), dAbs = nrm(dO), dSq = 2 * dot(Or, dO) + dot(dO, dO), scale = 2 * w * dAbs + dot(dO, dO);
        const On = add(Or, dO), c1 = L344.composeOnce(Or, dO), proj = dot(unit(dirs[arg]), unit(g.w));
        const scales = {};
        for (const sc of DECL.scales) {
          const c = scaleC(sc, { a, dAbs, I: b.I, Om1, w }), rates = [], judges = [];
          for (const [k, bb] of DECL.kb) { const R = c2Initial(Or, dO, c, k, bb); rates.push(R.par / (b.I * w) * YR); judges.push(judgeSigned(R.par, R.terms)); }
          const heatW = c * DECL.bMain * dAbs * dAbs;
          scales[sc] = { c, rates, judges, reachYr: c > 0 ? Math.log(1 / DECL.reachFrac) * b.I / (DECL.bMain * c) / YR : null, periodYr: c > 0 ? 2 * Math.PI * b.I / c / YR : null, heatW,
            heatOverRuler: F.LIT.heat[id] ? heatW / F.LIT.heat[id] : null };
        }
        per[arg] = { proj, dOverOmega: dAbs / w, steadyIncr: c1.incr, judge: judgeSigned(dSq, scale), judge344: c1.judge,
          steadyOblDeg: angDeg(On, g.n), dOblDeg: angDeg(On, g.n) - geo.oblDeg, steadyTurnDeg: angDeg(On, Or), scales };
      }
      const o = old.find((x) => x.id === id && x.src === srcKey(src) && x.mag === m);
      out.push({ id, src, mag: m, retro: b.retro, ...geo, OmegaT: OT, I: b.I, omega: w, a, Om1, lat: per.lat, ax: per.ax, swap: per.lat.judge !== per.ax.judge,
        c2swap: DECL.kb.map((_, j) => per.lat.scales.S0.judges[j] !== per.ax.scales.S0.judges[j]),
        old344: o ? { c1: o.c1.judge, c3: o.c3.judge } : null });
    }
  }
  return out;
}

/* ───────── T2 尺度の置き方(届くまでの時間の桁)と観測の自転の変化の率(固定の比べる列)───────── */
export function t2Scale(T1) {
  const out = [];
  for (const r of T1) {
    if (r.mag !== 'm1') continue;
    const L = r.lat.scales, X = r.ax.scales;
    out.push({ id: r.id, src: r.src, reachS0: L.S0.reachYr, reachS1: L.S1.reachYr, reachS2: L.S2.reachYr, reachS0ax: X.S0.reachYr,
      reachS0OverAge: L.S0.reachYr / DECL.ageYr, reachS1OverAge: L.S1.reachYr / DECL.ageYr, reachS2OverAge: L.S2.reachYr / DECL.ageYr,
      rateS0: L.S0.rates[3], rateS1: L.S1.rates[3], rateS2: L.S2.rates[3] });
  }
  return out;
}
/** 観測の自転の変化の率 [1/年](第337便j の lib の式と値 —— 地球の一日の長さの伸び・火星の角の加速) */
export function observedRates() {
  const B = bodies(), R = LIT.spinRates;
  const e = J337.sdotOverS.lod(R.earth.lodMsPerCy, 2 * Math.PI / B.Earth.omega) * YR, m = J337.sdotOverS.mas(R.mars.masPerYr2, B.Mars.omega) * YR;
  return [{ id: 'Earth', rateYr: e, relUnc: R.earth.relUnc }, { id: 'Mars', rateYr: m, relUnc: R.mars.relUnc }];
}

/* ───────── T3 散逸の項の熱の窓(尺度 3 × 引数 2)───────── */
export function windowTable(ctx = makeCtx()) {
  const T343 = E343.t1Table(ctx), PR = P.bodyRows(), GEO = geometry(), B = bodies(), out = [];
  const cosOf = (id, src) => (src === 'galaxy' ? 1 : latAxis(GEO[id + '|' + src].s, GEO[id + '|' + src].n, GEO[id + '|' + src].w).cosI);   // 銀河の中の位置の緯度 0 の宣言(リポジトリに値が無い)
  for (const m of DECL.magReadings) for (const sc of DECL.scales) for (const arg of DECL.args) {
    const uOf = (id) => {
      const r = PR.find((x) => x.id === id), w = Math.abs(r.omega), tide = F.tideHeat(r, F.LIT.k2q[id]).heat;
      const u = T343.filter((x) => x.id === id && x.sign === 'rev' && x.mag === m).reduce((t, x) => {
        const q = r.tilt.find((y) => y.src === x.src), Om1 = DECL.cb * q.beta * Math.abs(1 - DECL.alpha) * Math.abs(q.w), d = arg === 'lat' ? x.OmegaT * cosOf(id, x.src) : x.OmegaT;
        return t + scaleC(sc, { a: x.a, dAbs: d, I: r.I, Om1, w }) * d * d;
      }, 0);
      return { tide, u };
    };
    const io = uOf('Io'), ju = uOf('Jupiter'), ve = uOf('Venus');
    const cap = (F.LIT.heat.Io - io.tide) / io.u, need = (DECL.highFrac * F.LIT.heat.Jupiter - ju.tide) / ju.u;
    out.push({ mag: m, scale: sc, arg, ioU: io.u, juU: ju.u, venusU: ve.u, capX: cap, needX: need, needOverCap: cap > 0 ? need / cap : null, open: need <= cap });
  }
  void B;
  return out;
}

/* ───────── T4 120° の三次元の残り(候補 2 つ —— 黄道の極を先に)───────── */
const tanv = (v, Pp) => sub(v, scl(Pp, dot(v, Pp)));
/** 太陽の項の向きの読み: ax = 太陽の軸のまま(第344便e の恒等)・latNode = 交点(緯度 0 —— −S)・latMax = 緯度の最大(2 sin i ŷ′ − S)・latMean = 1 公転の平均(−cos i P) */
export function sunDir(reading, S, Pp) {
  const ci = dot(S, Pp), si = nrm(crs(S, Pp)), y = si > 0 ? unit(tanv(S, Pp)) : [0, 0, 0];
  if (reading === 'ax') return S.slice();
  if (reading === 'latNode') return scl(S, -1);
  if (reading === 'latMax') return sub(scl(y, 2 * si), S);
  if (reading === 'latMean') return scl(Pp, -ci);
  throw new RangeError('sunDir: 読みは ' + DECL.sunReadings.join('・'));
}
export function t4Table() {
  const { S, G, E, Inv } = E343.poles(), out = [];
  for (const [pn, Pp] of [['ecl', E], ['inv', Inv]]) for (const gd of DECL.galDirs) for (const rd of DECL.sunReadings) {
    const dg = gd === 'rev' ? scl(G, -1) : G.slice(), ds = sunDir(rd, S, Pp), tg = tanv(dg, Pp), ts = tanv(ds, Pp), ms = nrm(ts), mg = nrm(tg);
    const tsZero = ms <= 1e-12 * nrm(ds);
    const sep = tsZero ? null : angDeg(tg, ts);
    out.push({ pole: pn, gal: gd, sun: rd, sunPoleDeg: angDeg(Pp, S), sunTanFrac: tsZero ? 0 : ms / nrm(ds), galTanFrac: mg / nrm(dg), sepDeg: sep, phaseNeedDeg: sep === null ? null : Math.min(sep, 180 - sep),
      thirdOverSunTan: sep === null ? null : Math.abs(Math.sin(sep * D2R)), thirdOverSun: sep === null ? 0 : (ms / nrm(ds)) * Math.abs(Math.sin(sep * D2R)), sunTanZero: tsZero });
  }
  return out;
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  // ① 1 公転の平均の閉じた形(i = 0・30°・90°・150°)と第337便j の lib の平均の内積
  const lat = [0, 30, 90, 150].map((iDeg) => { const s = [0, 0, 1], n = [Math.sin(iDeg * D2R), 0, Math.cos(iDeg * D2R)], w = [0.3, -0.4, Math.sqrt(1 - 0.25)], A = latAxis(s, n, w);
    return { iDeg, meanDiff: A.meanDiff, cosI: A.cosI, projJ337Diff: Math.abs(J337.twoAngleMean({ sSrc: s, wOrb: n, sRecv: w }).proj - dot(A.closed, w)) }; });
  // ② 2 倍角の則の 3 点(赤道で逆・45° で 90° 傾いた・軸方向で順)
  const s = [0, 0, 1], three = [[1, 0, 0], [Math.SQRT1_2, 0, Math.SQRT1_2], [0, 0, 1]].map((r) => angDeg(BV.twoAngleAxis(s, r), s));
  // ③ ax の向き: θ = 0 は順・θ = 90° は逆(第344便e の dirDbl と同じ角)
  const ax0 = angDeg(axAxis([0, 0, 1], [0, 0, 1]), [0, 0, 1]), ax90 = angDeg(axAxis([1, 0, 0], [0, 0, 1]), [0, 0, 1]), ax30 = angDeg(axAxis([Math.sin(30 * D2R), 0, Math.cos(30 * D2R)], [0, 0, 1]), [0, 0, 1]);
  // ④ C2 の初めのトルク: ジャイロの項の自転の向きの成分は −k c abs(ΔΩ) sin φ・散逸の項は b c abs(ΔΩ) cos φ
  const Or = [0, 0, 2], ph = 70 * D2R, dO = [0.3 * Math.sin(ph), 0, 0.3 * Math.cos(ph)];
  const g1 = c2Initial(Or, dO, 1.5, 1, 0).par, d1 = c2Initial(Or, dO, 1.5, 0, 0.1).par;
  const c2ok = Math.abs(g1 - (-1.5 * 0.3 * Math.sin(ph))) < 1e-15 && Math.abs(d1 - 1.5 * 0.1 * 0.3 * Math.cos(ph)) < 1e-15;
  // ⑤ 3 値の境(尺度 0・有限でない入力は「未解決」)
  const j3 = [judgeSigned(1, 1), judgeSigned(-1, 1), judgeSigned(1e-17, 1), judgeSigned(NaN, 1), judgeSigned(1, Infinity)];
  // ⑥ T4: 緯度の最大と交点で接線の向きが反転し、1 公転の平均で接線の成分 0
  const { S, E } = E343.poles(), tN = tanv(sunDir('latNode', S, E), E), tM = tanv(sunDir('latMax', S, E), E), tA = tanv(sunDir('latMean', S, E), E);
  const t4ok = Math.abs(nrm(add(tN, tM))) < 1e-15 && nrm(tA) < 1e-15;
  const rej = [() => latAxis([0, 0], [0, 0, 1], [0, 0, 1]), () => axAxis([0, 0, 1], [NaN, 0, 1]), () => c2Initial([0, 0, 1], [1, 0, 0], -1, 1, 0), () => c2Initial([0, 0, 1], [1, 0, 0], 1, 1, -0.1),
    () => sunDir('mid', [0, 0, 1], [0, 0, 1]), () => scaleC('S9', {})].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { lat, three, ax: [ax0, ax30, ax90], c2ok, j3, t4ok, rejects: rej };
}
export function pureGates(S) {
  return {
    latClosed: S.lat.every((r) => r.meanDiff < 1e-12 && r.projJ337Diff < 1e-9),
    rule3: Math.abs(S.three[0] - 180) < 1e-9 && Math.abs(S.three[1] - 90) < 1e-9 && Math.abs(S.three[2]) < 1e-9,
    axAngles: Math.abs(S.ax[0]) < 1e-9 && Math.abs(S.ax[1] - 60) < 1e-9 && Math.abs(S.ax[2] - 180) < 1e-9,
    c2Terms: S.c2ok === true,
    judge3: S.j3.join(',') === 'up,down,unresolved,unresolved,unresolved',
    t4Flip: S.t4ok === true,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

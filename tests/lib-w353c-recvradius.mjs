// 第353便c(原仮定者の回答(2026-11-25 —— 第151報)AN1045「引きずられる側は「観測半径と、構造の係数のノブ」」・向きと幾何の採用・統括の検証項目 R467):
//   **受け手(引きずられる側)の半径 = 観測半径 × 構造の係数 —— その入れ方の候補 3 つ((P-場)・(P-応)・(P-平))と、金星・イオの打ち消し(主の列 (S)・(N+)・基準軸 L)を数える口 —— 診断だけ**
//   (器 tests/exp-w353c-recvradius.mjs と QA behavior.recvradius353c・docs.recvradius353c が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第352便k(spinRot・recvRadius・srcRadius —— (S) と受け手の半径の口 cR)・第351便k(partRotQ —— 自分の重みの球の半径 Rd と平均の球の半径 a を別に渡す (C2))・
//   第352便c(refAxis —— 基準軸 L・eq)・第352便d(bgDir —— (G−) の向き)・第348便h(YK)・第348便c(massOf・radiusOf)・第347便e(t1Table・geometry)・第312便a(Kball)・
//   第330便a(DECL.lit.moi —— 慣性モーメントの係数〔文献の値〕)。仮の値の lib(第352便b)には届かない(import の閉包に入れない)。
//
// ■ 入れ方(place):
//   'rule' = 規則の半径(第352便までの主の形 —— 比べる列)。
//   'field' = (P-場) 場の式の自分の重み(と (C2) の平均の球)の半径を c_R × 観測半径に(第352便k の spinRot の cR の口そのまま)。
//   'resp'  = (P-応) 場の式は規則の半径のまま・応答の側(慣性モーメント I = c × M × 観測半径²)だけに入れる —— 向き(φ)と打ち消しは規則の半径と同じ・率だけが倍 rateMult に。
//            トルク → 軸の率の換算: 単位の応答(経路 ② の率 = abs(Ω))を、慣性モーメント I_ref = c_ref × M × R_ref² の物差しの天体の率と置き、率 = abs(Ω) × I_ref ÷ I(ノブ: c_ref 0.4・R_ref は規則の半径か観測半径)。
//            背景にも局所にも同じ倍が掛かる(どちらも場の回転 —— 打ち消しの条件は倍に依らない)。
//   'avg'   = (P-平) (C2) の平均の球の半径だけ c_R × 観測半径・自分の重みの球の半径は規則の半径(第351便k の partRotQ の Rd = 規則・a = c_R × 観測半径)。
//   **(C2) の平均の層の半径は、自分の重みの球の半径に入る形でしか場に入らない(中心の渦度の読み)—— 自分の重みを規則に固定して平均の球だけを置き換える読み方は、partRotQ の等価の半径 equivR2 を通る (P-平) だけ。**
// ■ 量: φ = (−S) と背景の向きのなす角・等大の残り ÷ 背景 = 2 sin(φ/2)・係数 k を自由に振った下限 = sin φ(φ ≤ 90°・φ > 90° は 1)・等大の倍率 ÷ k = abs(S) ÷ ω_G・
//   自分の重み A0 = m K1(0, R_受け手)・源の重み wS = M_源 K1(a, R_源)。cR★ = A0 が wS と同じになる c_R(P-場)。
// ■ 言わないこと: 構造の係数・受け手の半径の入れ方を決めない。金星の構造が測れた・打ち消しが保たれると決まった、と書かない。この場・この入れ方・この係数では、の表。
import * as K from './lib-w352k-spinform.mjs';
import * as KR from './lib-w351k-knobrank.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';

export const LIB_VERSION = 'w353c-recvradius-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, nrm, scl, add, sub, unit } = K.vec;
const D2R = Math.PI / 180;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  places: Object.freeze(['rule', 'field', 'resp', 'avg']),
  placeNames: Object.freeze({ rule: '規則の半径(比べる列)', field: '(P-場) 自分の重みと平均の球', resp: '(P-応) 応答の側だけ', avg: '(P-平) 平均の球だけ' }),
  /** 主の列: (S)・源は規則の半径(tSrc 0)・読み (C2)・背景 (N+)・基準軸 L */
  main: Object.freeze({ part: 'S', tSrc: 0, read: 'C2', dir: 'Np', axis: 'L' }),
  dirs: Object.freeze(['Np', 'Gm']), dirNames: Object.freeze({ Np: '(N+) 太陽系の基準軸の向き', Gm: '(G−) 銀河の回転と逆向き(比べる列)' }),
  axes: Object.freeze(['L', 'eq']),
  /** 表 1 の c_R の格子(1e-6〜1) */
  cRGrid: Object.freeze([1e-6, 1e-5, 1e-4, 1e-3, 3e-3, 1e-2, 2e-2, 3e-2, 5e-2, 0.1, 0.2, 0.3, 0.5, 1]),
  /** 表 3 の c_R(P-場) */
  cRMain: Object.freeze([0.01, 0.1, 1]),
  planets: Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']),
  /** 表 2 の組(第352便v の 17 組から): 8 惑星 ← 太陽・小さい天体 ← 太陽・衛星 ← 母天体・冥王星 ⇄ カロン */
  pairs: Object.freeze(['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Mars|Sun', 'Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun',
    'Moon|Sun', 'Io|Sun', 'Pluto|Sun', 'Moon|EarthHi', 'Io|Jupiter', 'Pluto|Charon', 'Charon|Pluto']),
  /** 残りの帯(表 1) */
  bands: Object.freeze([0.02, 0.05]),
  /** 背景の倍率 u(表 3 —— (N+) の窓の下端・上端・注目の列 0.98) */
  uCols: Object.freeze([0.0487, 0.835, 0.98]),
  /** (P-応) の物差し: c_ref(一様な球の慣性モーメントの係数 —— ノブ)・R_ref の 2 通り */
  cRef: 0.4, refRadii: Object.freeze(['rule', 'obs']),
  /** 表 4 の慣性モーメントの係数の格子(リポジトリに無い天体はこの格子で振る) */
  cGrid: Object.freeze([0.33, 0.4]),
  omegaG: K.DECL.omegaG,
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
const MOIKEY = Object.freeze({ Sun: 'sun', Mercury: 'mercury', Venus: 'venus', Earth: 'earth', Moon: 'moon', Mars: 'mars', Jupiter: 'jupiter', Io: 'io', Saturn: 'saturn', Uranus: 'uranus', Neptune: 'neptune' });
/** 慣性モーメントの係数(第330便a の文献の値 —— 無い天体は null = ノブ) */
export const moiOf = (id) => { const k = MOIKEY[id], m = W330.DECL.lit.moi; return k && fin(m[k]) ? m[k] : null; };
const srcBody = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);

/* ───────── 小さな道具 ───────── */
/** 2 本のなす角(°)—— atan2(abs(a × b), a·b)(同じ向きの近くでも丸めの桁が立たない形・同じベクトルは 0) */
export const angDeg = (a, b) => { const ua = unit(a), ub = unit(b), c = [ua[1] * ub[2] - ua[2] * ub[1], ua[2] * ub[0] - ua[0] * ub[2], ua[0] * ub[1] - ua[1] * ub[0]]; return Math.atan2(nrm(c), dot(ua, ub)) / D2R; };
/** 背景の向きの単位ベクトル: 'Np' = 基準軸(L・eq)・'Gm' = 銀河の回転と逆向き */
export function bgUnit(dir, axis, T1 = E.t1Table(), GEO = E.geometry()) {
  if (dir === 'Np') { if (!DECL.axes.includes(axis)) throw new RangeError('bgUnit: 基準軸は L・eq'); return unit(RA.refAxis(axis, T1, GEO)); }
  if (dir === 'Gm') return PS.bgDir('Gm');
  throw new RangeError('bgUnit: 背景の向きは Np・Gm');
}
/** 規則の半径 ÷ 観測半径(受け手) */
export const ruleOverObs = (id) => G3.YK * C.massOf(id) / C.radiusOf(id);

/* ───────── 約束の口 ───────── */
/**
 * 受け手の (S)(1 公転の平均・rad/s)を入れ方ごとに。戻り値 { Om, Rr(場に入る自分の重みの球の半径), Ra(平均の球の半径), A0, wS }。
 * 'resp' の Om は規則の半径の場(率の倍は rateMult が別に持つ)。
 */
export function sOf(T1, GEO, id, src, { place = 'field', cR = 1, tSrc = 0, read = 'C2' } = {}) {
  if (!DECL.places.includes(place)) throw new RangeError('sOf: 入れ方は ' + DECL.places.join('・'));
  if (place !== 'rule' && place !== 'resp' && !(fin(cR) && cR > 0)) throw new RangeError('sOf: c_R > 0');
  if (place === 'avg') {
    if (!(tSrc === 0 && read === 'C2')) throw new RangeError('sOf: (P-平) は源の規則の半径・(C2) だけ(第351便k の partRotQ の作り)');
    const P = K.spinRot(T1, GEO, id, src, { part: 'S', tSrc: 0, cR: null, read: 'C2' }), Rd = K.recvRadius(id), a = cR * C.radiusOf(id);
    return { Om: KR.partRotQ(T1, GEO, id, src, { part: 'S', Rd, a }), Rr: Rd, Ra: a, A0: P.A0, wS: P.wS };
  }
  const R = K.spinRot(T1, GEO, id, src, { part: 'S', tSrc, cR: place === 'field' ? cR : null, read });
  return { Om: R.Om, Rr: R.Rr, Ra: R.Rr, A0: R.A0, wS: R.wS };
}
/**
 * (P-応) の率の倍: I_ref ÷ I = (c_ref ÷ c) × (R_ref ÷ (c_R × R_観測))²。ref 'rule' = R_ref は規則の半径(単位の応答を規則の半径の球の率と読む)・'obs' = 観測半径(同じ大きさの球の率と読む)。
 * c = 慣性モーメントの係数(null なら文献の値 —— 無ければ null を返す)。
 */
export function rateMult(id, { c = null, cR = 1, cRef = DECL.cRef, ref = 'rule' } = {}) {
  const cc = c === null ? moiOf(id) : c;
  if (cc === null) return null;
  if (!(fin(cc) && cc > 0 && fin(cR) && cR > 0 && fin(cRef) && cRef > 0)) throw new RangeError('rateMult: c > 0・c_R > 0・c_ref > 0');
  if (!DECL.refRadii.includes(ref)) throw new RangeError('rateMult: ref は rule・obs');
  const Rref = ref === 'rule' ? K.recvRadius(id) : C.radiusOf(id), R = cR * C.radiusOf(id);
  return (cRef / cc) * (Rref / R) * (Rref / R);
}
/**
 * 打ち消しの量。戻り値 { phiDeg, residEqual(2 sin φ/2), residMin(sin φ・φ > 90° は 1), uEqualOverK(abs(S) ÷ ω_G), A0, wS, Rr, Ra, S(rad/s の大きさ), rateMult('resp' のとき) }。
 */
export function cancelOf(T1, GEO, id, src, { place = 'field', cR = 1, dir = 'Np', axis = 'L', tSrc = 0, read = 'C2', c = null, ref = 'rule' } = {}) {
  const s = sOf(T1, GEO, id, src, { place, cR, tSrc, read }), b = bgUnit(dir, axis, T1, GEO), m = nrm(s.Om);
  const phiDeg = angDeg(scl(s.Om, -1), b), ph = phiDeg * D2R;
  return { phiDeg, residEqual: 2 * Math.sin(ph / 2), residMin: phiDeg >= 90 ? 1 : Math.sin(ph), uEqualOverK: m / DECL.omegaG, A0: s.A0, wS: s.wS, Rr: s.Rr, Ra: s.Ra, S: m,
    rateMult: place === 'resp' ? rateMult(id, { c, cR, ref }) : null };
}
/** cR★: (P-場) で A0(c_R) = wS になる c_R(K1 の中心の値は半径の逆数 —— 二分で解いて閉じた形 A0(1) ÷ wS と照合) */
export function cRStar(id, src, T1 = E.t1Table(), GEO = E.geometry()) {
  const R = K.spinRot(T1, GEO, id, src, { part: 'S', tSrc: 0, cR: 1, read: 'C2' }), m = C.massOf(id), Ro = C.radiusOf(id), wS = R.wS;
  const f = (lc) => Math.log(m * D.Kball(1, 0, Math.pow(10, lc) * Ro) / wS);
  let lo = -30, hi = 10;
  if (!(f(lo) > 0 && f(hi) < 0)) return { cR: null, closed: R.A0 / wS, wS };
  for (let i = 0; i < 200; i++) { const mid = 0.5 * (lo + hi); if (f(mid) > 0) lo = mid; else hi = mid; }
  return { cR: Math.pow(10, 0.5 * (lo + hi)), closed: R.A0 / wS, wS };
}
/** 合成の向き(表 3): 背景 u × ω_G を dir に・局所 (S) を入れ方ごとに足し、合成と L の角・合成と自転軸 ŝ の角(円錐)・cos(ŝ, 合成)の符号(回る向きの目安 —— (g2−) では合成の軸のまわりで自転と逆回り) */
export function totalOf(T1, GEO, id, src, { place = 'field', cR = 1, u, dir = 'Np', axis = 'L' } = {}) {
  if (!(fin(u) && u >= 0)) throw new RangeError('totalOf: u ≥ 0');
  const s = sOf(T1, GEO, id, src, { place, cR }), b = bgUnit(dir, axis, T1, GEO), Lx = bgUnit('Np', 'L', T1, GEO), tot = add(scl(b, u * DECL.omegaG), s.Om);
  const sHat = K.spinRot(T1, GEO, id, src, { part: 'S' }).sHat, cs = dot(unit(tot), sHat);
  return { tot, toLDeg: angDeg(tot, Lx), coneDeg: angDeg(tot, sHat), cosSpin: cs, sense: cs > 0 ? 1 : cs < 0 ? -1 : 0, localOverBg: nrm(s.Om) / (u * DECL.omegaG) };
}

/* ───────── 表を作る(器が呼ぶ)───────── */
/** 帯の端: 入れ方 place で残り(等大)が band を越える最初の c_R(log10 の 0.01 刻みで挟み・二分で 40 回)。越えなければ null */
export function bandEdge(T1, GEO, id, src, { place, band, dir = 'Np', axis = 'L', lo = -6, hi = 0 }) {
  const f = (lc) => cancelOf(T1, GEO, id, src, { place, cR: Math.pow(10, lc), dir, axis }).residEqual - band;
  let prev = lo;
  if (f(lo) > 0) return { cR: null, below: true };
  for (let lc = lo + 0.01; lc <= hi + 1e-9; lc += 0.01) {
    if (f(lc) > 0) { let a = prev, b = lc; for (let i = 0; i < 40; i++) { const m = 0.5 * (a + b); if (f(m) > 0) b = m; else a = m; } return { cR: Math.pow(10, 0.5 * (a + b)), below: false }; }
    prev = lc;
  }
  return { cR: null, below: false };
}
/** 表 1(金星): 入れ方 3 つ × c_R の格子 —— φ・等大の残り・下限・等大の倍率 ÷ k・A0・平均の球の半径。比べる列: (N+) eq・(G−) の等大の残り */
export function t1Rows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const place of ['field', 'avg', 'resp']) for (const cR of DECL.cRGrid) {
    const r = cancelOf(T1, GEO, 'Venus', 'Sun', { place, cR }), q = cancelOf(T1, GEO, 'Venus', 'Sun', { place, cR, axis: 'eq' }), g = cancelOf(T1, GEO, 'Venus', 'Sun', { place, cR, dir: 'Gm' });
    out.push({ place, cR, phiDeg: r.phiDeg, residEqual: r.residEqual, residMin: r.residMin, uEqualOverK: r.uEqualOverK, A0: r.A0, wS: r.wS, A0overWS: r.A0 / r.wS, Ra: r.Ra, residEq: q.residEqual, residGm: g.residEqual });
  }
  return out;
}
/** 表 1 の帯: 入れ方 × 基準軸 × 帯(2%・5%)の c_R の上端・規則の半径の行・規則の半径を c_R に直した数 */
export function t1Bands(T1 = E.t1Table(), GEO = E.geometry()) {
  const rule = cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'rule' }), rule2 = cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'rule', axis: 'eq' }), out = [];
  for (const place of ['field', 'avg', 'resp']) for (const axis of DECL.axes) for (const band of DECL.bands) out.push({ place, axis, band, ...bandEdge(T1, GEO, 'Venus', 'Sun', { place, band, axis }) });
  return { rows: out, rule: { phiDeg: rule.phiDeg, residEqual: rule.residEqual, residEq: rule2.residEqual, uEqualOverK: rule.uEqualOverK }, ruleAsCR: ruleOverObs('Venus'), cRStar: cRStar('Venus', 'Sun', T1, GEO).cR };
}
/** 表 2(全部の受け手): 組ごとに cR★・規則の半径 ÷ 観測半径・自分の重み ÷ 源の重み(規則・c_R 1)・φ と等大の残り(規則・(P-場) c_R 1・(P-平) c_R 1)・(S) の大きさの比(c_R 1 ÷ 規則) */
export function t2Rows(T1 = E.t1Table(), GEO = E.geometry()) {
  return DECL.pairs.map((pr) => {
    const [id, src] = pr.split('|'), a = cancelOf(T1, GEO, id, src, { place: 'rule' }), b = cancelOf(T1, GEO, id, src, { place: 'field', cR: 1 }), v = cancelOf(T1, GEO, id, src, { place: 'avg', cR: 1 });
    return { pair: pr, id, src, cRStar: cRStar(id, src, T1, GEO).cR, ruleOverObs: ruleOverObs(id), selfOverSrcRule: a.A0 / a.wS, selfOverSrc1: b.A0 / b.wS,
      phiRule: a.phiDeg, phiField1: b.phiDeg, phiAvg1: v.phiDeg, resRule: a.residEqual, resField1: b.residEqual, resAvg1: v.residEqual, sRatio: b.S / a.S, uRule: a.uEqualOverK, uField1: b.uEqualOverK };
  });
}
/** 表 2 のイオ: 打ち消しの倍率の比 x = abs(S_イオ←木星) ÷ abs(S_金星←太陽)(同じ c_R を両方に)と、イオの φ・等大の残り((P-場)・(P-平)) */
export function ioRows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [], r0i = cancelOf(T1, GEO, 'Io', 'Jupiter', { place: 'rule' }), r0v = cancelOf(T1, GEO, 'Venus', 'Sun', { place: 'rule' });
  out.push({ place: 'rule', cR: null, x: r0i.S / r0v.S, phiDeg: r0i.phiDeg, residEqual: r0i.residEqual });
  for (const place of ['field', 'avg']) for (const cR of DECL.cRGrid) {
    const i = cancelOf(T1, GEO, 'Io', 'Jupiter', { place, cR }), v = cancelOf(T1, GEO, 'Venus', 'Sun', { place, cR });
    out.push({ place, cR, x: i.S / v.S, phiDeg: i.phiDeg, residEqual: i.residEqual });
  }
  return out;
}
/** 表 3(主の表への影響): 8 惑星 × 入れ方の列 × 背景の倍率 u —— 合成と L の角・円錐・回る向きの目安と、規則の半径の列からの動き */
export const T3COLS = Object.freeze([Object.freeze({ id: 'rule', place: 'rule', cR: 1 }), Object.freeze({ id: 'f0.01', place: 'field', cR: 0.01 }), Object.freeze({ id: 'f0.1', place: 'field', cR: 0.1 }),
  Object.freeze({ id: 'f1', place: 'field', cR: 1 }), Object.freeze({ id: 'resp', place: 'resp', cR: 1 })]);
export function t3Rows(T1 = E.t1Table(), GEO = E.geometry()) {
  const out = [];
  for (const id of DECL.planets) for (const u of DECL.uCols) {
    const base = totalOf(T1, GEO, id, 'Sun', { place: 'rule', u });
    for (const c of T3COLS) {
      const t = totalOf(T1, GEO, id, 'Sun', { place: c.place, cR: c.cR, u });
      out.push({ id, u, col: c.id, toLDeg: t.toLDeg, coneDeg: t.coneDeg, sense: t.sense, localOverBg: t.localOverBg, dToL: t.toLDeg - base.toLDeg, dCone: t.coneDeg - base.coneDeg, dTot: angDeg(t.tot, base.tot) });
    }
  }
  return out;
}
/** 表 3 の境: 合成の向きが規則の半径の列から 0.1° 以上動く背景の倍率 u の上端(u の格子 10^(−12〜0)・0.25 刻み —— 上から下ろして初めて越える u)。越えなければ null */
export function uMoveRows(T1 = E.t1Table(), GEO = E.geometry(), { tolDeg = 0.1 } = {}) {
  const us = []; for (let k = 0; k <= 48; k++) us.push(Math.pow(10, -k * 0.25));
  const out = [];
  for (const id of DECL.planets) for (const c of T3COLS.filter((x) => x.place === 'field')) {
    let hit = null;
    for (const u of us) { const t = totalOf(T1, GEO, id, 'Sun', { place: c.place, cR: c.cR, u }), b = totalOf(T1, GEO, id, 'Sun', { place: 'rule', u }); if (angDeg(t.tot, b.tot) >= tolDeg) { hit = u; break; } }
    out.push({ id, col: c.id, uMove: hit, localOverBgAtU1: totalOf(T1, GEO, id, 'Sun', { place: c.place, cR: c.cR, u: 1 }).localOverBg });
  }
  return out;
}
/** 表 4((P-応) の率の倍): 天体ごとに慣性モーメントの係数(文献の値か null)・倍(R_ref 規則・観測 × c 文献・格子)・地球を 1 にした比 */
export function t4Rows() {
  const ids = [...DECL.planets, 'Moon', 'Io', 'Pluto'], mE = { rule: rateMult('Earth', { ref: 'rule' }), obs: rateMult('Earth', { ref: 'obs' }) };
  return ids.map((id) => {
    const c = moiOf(id), r = { id, moi: c, ruleOverObs: ruleOverObs(id), multRule: rateMult(id, { ref: 'rule' }), multObs: rateMult(id, { ref: 'obs' }) };
    r.relRule = r.multRule === null ? null : r.multRule / mE.rule; r.relObs = r.multObs === null ? null : r.multObs / mE.obs;
    r.grid = DECL.cGrid.map((cc) => ({ c: cc, multRule: rateMult(id, { c: cc, ref: 'rule' }), multObs: rateMult(id, { c: cc, ref: 'obs' }) }));
    return r;
  });
}

/* ───────── 零試験 ───────── */
/** 統括の数え直し 3(2026-11-25)の金星の表 6 行・8 惑星の φ・基準軸 L */
export const ANCHOR = Object.freeze({
  L: Object.freeze([0.026257, 0.008317, 0.999621]), LeqDeg: '1.121', omegaG: '9.09e-16',
  venus: Object.freeze([
    Object.freeze({ cR: null, uEq: '1.19282e-12', phi: '0.7606', res: '0.013274', A0: '1.703e+26' }),
    Object.freeze({ cR: 1e-3, uEq: '1.61699e-7', phi: '0.7509', res: '0.013106', A0: '1.207e+21' }),
    Object.freeze({ cR: 1e-2, uEq: '1.16430e-6', phi: '0.9910', res: '0.017295', A0: '1.207e+20' }),
    Object.freeze({ cR: 0.1, uEq: '1.87673e-6', phi: '7.580', res: '0.13219', A0: '1.207e+19' }),
    Object.freeze({ cR: 0.3, uEq: '1.11483e-6', phi: '21.65', res: '0.37565', A0: '4.023e+18' }),
    Object.freeze({ cR: 1, uEq: '6.45938e-7', phi: '52.06', res: '0.87772', A0: '1.207e+18', min: '0.78868' }),
  ]),
  wS: '1.838e+19',
  phi8: Object.freeze({ Mercury: ['7.1492', '88.038'], Venus: ['0.76057', '52.062'], Earth: ['5.0506', '60.041'], Mars: ['3.2250', '76.029'], Jupiter: ['3.1983', '3.7170'], Saturn: ['2.4993', '3.1621'], Uranus: ['3.9162', '5.0663'], Neptune: ['3.7517', '4.3570'] }),   // 統括の脚本の有効数字 5 桁
});
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
  const L = bgUnit('Np', 'L', T1, GEO), EQ = bgUnit('Np', 'eq', T1, GEO);
  // ① 統括の数え直し 3 の金星の 6 行(cR null = 規則・数 = (P-場))
  const venus = ANCHOR.venus.map((a) => { const r = cancelOf(T1, GEO, 'Venus', 'Sun', { place: a.cR === null ? 'rule' : 'field', cR: a.cR === null ? 1 : a.cR }); return { cR: a.cR, uEq: r.uEqualOverK, phi: r.phiDeg, res: r.residEqual, min: r.residMin, A0: r.A0, wS: r.wS }; });
  // ② 8 惑星の φ(規則 → (P-場) c_R 1)
  const phi8 = Object.fromEntries(DECL.planets.map((p) => [p, [cancelOf(T1, GEO, p, 'Sun', { place: 'rule' }).phiDeg, cancelOf(T1, GEO, p, 'Sun', { place: 'field', cR: 1 }).phiDeg]]));
  // ③ (P-場) は spinRot の cR の口そのまま・(P-応) の Om は規則の半径と同じ(向き・打ち消しが同じ)・(P-平) で a = 規則の半径は規則の半径と同じ(partRotQ の照合)
  const vsK = rel(sOf(T1, GEO, 'Earth', 'Sun', { place: 'field', cR: 0.03 }).Om, K.spinRot(T1, GEO, 'Earth', 'Sun', { part: 'S', cR: 0.03 }).Om);
  const rule = sOf(T1, GEO, 'Venus', 'Sun', { place: 'rule' }).Om, resp = sOf(T1, GEO, 'Venus', 'Sun', { place: 'resp', cR: 0.5 }).Om;
  const avgRule = KR.partRotQ(T1, GEO, 'Venus', 'Sun', { part: 'S', Rd: K.recvRadius('Venus') });
  const vsResp = rel(resp, rule), vsAvg = rel(avgRule, rule);
  // ④ cR★: A0(cR★) = wS(閉じた形 A0(1) ÷ wS と同じ)・金星は 0.07 の桁
  const cs = cRStar('Venus', 'Sun', T1, GEO), A0s = C.massOf('Venus') * D.Kball(1, 0, cs.cR * C.radiusOf('Venus'));
  // ⑤ (P-応) の倍: c_ref = c・ref 'obs'・c_R 1 で 1・ref 'rule' で (規則 ÷ 観測)²・文献の値の無い天体は null
  const m1 = rateMult('Venus', { c: 0.4, ref: 'obs' }), m2 = rateMult('Venus', { c: 0.4, ref: 'rule' }), rr = ruleOverObs('Venus'), mNull = rateMult('Pluto');
  // ⑥ 等大の残り・下限の式: φ 60° で 1・sin 60°
  const r60 = { e: 2 * Math.sin(30 * D2R), m: Math.sin(60 * D2R) };
  // ⑦ 拒否
  const rejects = [() => sOf(T1, GEO, 'Venus', 'Sun', { place: 'X' }), () => sOf(T1, GEO, 'Venus', 'Sun', { place: 'field', cR: 0 }), () => sOf(T1, GEO, 'Venus', 'Sun', { place: 'avg', tSrc: 1 }),
    () => bgUnit('Gp'), () => bgUnit('Np', 'ecl'), () => rateMult('Venus', { c: -1 }), () => rateMult('Venus', { ref: 'x' }), () => totalOf(T1, GEO, 'Venus', 'Sun', { u: -1 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { L, LeqDeg: angDeg(L, EQ), omegaG: DECL.omegaG, venus, phi8, vsK, vsResp, vsAvg, cs, A0s, m1, m2, rr, mNull, r60, rejects };
}
export function pureGates(S) {
  const A = ANCHOR, p = (x, n) => Number(x).toPrecision(n), ex = (x, n) => Number(x).toExponential(n);
  return {
    refAxisL: S.L.every((x, i) => x.toFixed(6) === A.L[i].toFixed(6)) && p(S.LeqDeg, 4) === A.LeqDeg && ex(S.omegaG, 2) === A.omegaG,
    venus6: S.venus.length === 6 && S.venus.every((r, i) => { const a = A.venus[i]; return p(r.uEq, 6) === Number(a.uEq).toPrecision(6) && p(r.phi, 4) === a.phi && p(r.res, 5) === a.res && ex(r.A0, 3) === a.A0 && ex(r.wS, 3) === A.wS && (a.min === undefined || p(r.min, 5) === a.min); }),
    phi8: Object.entries(A.phi8).every(([id, [a, b]]) => p(S.phi8[id][0], 5) === a && p(S.phi8[id][1], 5) === b),
    places: S.vsK < 1e-12 && S.vsResp < 1e-12 && S.vsAvg < 1e-9,   // 尺度の走り直し(ulp をずらす)でも通る床
    cRStar: Math.abs(S.A0s / S.cs.wS - 1) < 1e-9 && Math.abs(S.cs.cR / S.cs.closed - 1) < 1e-9 && S.cs.cR > 0.05 && S.cs.cR < 0.09,
    rateMult: Math.abs(S.m1 - 1) < 1e-12 && Math.abs(S.m2 / (S.rr * S.rr) - 1) < 1e-12 && S.mNull === null,
    residForms: Math.abs(S.r60.e - 1) < 1e-12 && Math.abs(S.r60.m - Math.sqrt(3) / 2) < 1e-12,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}

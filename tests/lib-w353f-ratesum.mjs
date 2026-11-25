// 第353便f(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R470):
//   **歳差の率を、符号つきの極の速度として足す —— 重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)と、主の列の軸引きずり((g2−)・(N+)・基準軸 L・(S) 規則の半径)を、
//   同じ極のまわりの方位の率(右ねじで正・″/年)に直して足し、仮の値(印つき)との残りに軸引きずりが入る余地を符号つきで数える純関数 —— 診断だけ**
//   (器 tests/exp-w353f-ratesum.mjs と QA behavior.ratesum353f・docs.ratesum353f が読む —— html を読まない・ファイルを読まない・状態を持たない。後のラウンドの枝もこの口を import してよい)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第352便u(rateOf・axesOf・shapeOf・gravSrcs・tG —— 重力の側の列)・第352便y(residualOf —— 残りの照合の相手)・第352便q(refRate・localS・unitRate —— 比べる数と単位の応答の照合の相手)・
//   第352便d(poleRates・precDs・r3Ds・bgVec・spinSense・relSense —— 方位の率と背景)・第352便c(refAxis —— 基準軸)・第352便k(spinRot —— (S) の局所)・
//   第352便b(prov・toRH・tagProv —— 仮の値)・第351便d(r3Coeffs)・第347便e(t1Table・geometry)。
//
// ■ 語: 方位の率 az = 極 p のまわりを右ねじで正の、自転軸 ŝ の方位の速さ(第352便d の poleRates —— ″/年)。傾きの率 inc は同じ口の値(極に対する傾きが増える向きを正)。
//   **重力の列** = 第352便u の (T-g)(1 公転の平均の潮汐のテンソルを、軸対称の慣性のトルクの式に入れた形 —— 地球は太陽 + 月・火星と金星は太陽)の dŝ/dt を極 p に投影。
//   **軸引きずりの列** = c × 経路 ② の dŝ/dt(主 (g2−) = −Ω × ŝ・比べる列 (g2+) = +Ω × ŝ)・Ω = 背景(向き dir・基準軸 axis・倍率 u —— ω_G の倍)+ k × 局所の (S)(源 = 太陽・源の半径 tSrc)。
//   c = 単位の応答の係数(既定 1 —— 構造の係数を入れない)。f > 0 なら第351便d の (N1) の経路 ① を足す(既定 f 0 = 歳差だけ)。
//   **仮の値の符号**: 地球 = ψ_A の率を右ねじに直した値(第352便b の toRH —— 黄道の極のまわり)・火星 = 公転の北極のまわりの値・金星 = 大きさだけ(向きは仮の値に無い)
//   → 金星は「重力の列と同じ回り」(venusSense 'tide' —— 既定)と「逆の回り」('anti')の 2 列で持つ(どちらにも寄せない)。
//   **残り** = 仮の値(符号つき)− 重力の列(符号つき)。第352便y の残り(大きさの差 abs(仮) − abs(重力))との関係: 仮の値が重力の列と同じ回りなら、符号つきの残り = sign(重力の列) × 第352便y の残り(地球・火星・金星 'tide')。
// ■ 言わないこと: 歳差の率が説明できた・重力の側の列が DFM の結果、と書かない。仮の値を合否に使わない(印つきの行は較正・サンプルの状況・ノブの採否に入れない)。
import * as U from './lib-w352u-tidaldrag.mjs';
import * as Y from './lib-w352y-bgwindow.mjs';
import * as Q from './lib-w352q-response.mjs';
import * as D from './lib-w352d-precsense.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as B from './lib-w352b-provisional.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w353f-ratesum-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const { dot, crs, nrm, scl, add, sub, unit } = U.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
export const ASYR = D.ASYR;
export const vec = U.vec;
const D2R = Math.PI / 180;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 仮の値の在る受け手・重力の列の源の組・既定の極(第352便u・y の比べる列の約束) */
  provBodies: Object.freeze(['Earth', 'Mars', 'Venus']),
  srcSet: Object.freeze({ Earth: 'sunMoon', Mars: 'sun', Venus: 'sun', Mercury: 'sun', Jupiter: 'sun', Saturn: 'sun' }),
  homePole: Object.freeze({ Earth: 'ecl', Mars: 'orb', Venus: 'orb', Mercury: 'orb', Jupiter: 'orb', Saturn: 'orb' }),
  /** 予告の表の受け手(仮の値の無い天体 —— 比べる数なし) */
  previewBodies: Object.freeze(['Mercury', 'Jupiter', 'Saturn']),
  provKeys: Object.freeze({ Earth: 'earth.psiA.rate', Mars: 'mars.prec.rate', Venus: 'venus.prec.rate' }),
  /** 極の名: 黄道の極・自分の公転の北極・基準軸 L・基準軸 eq・合成の軸(軸引きずりの主の列の Ω の向き) */
  poles: Object.freeze(['ecl', 'orb', 'L', 'eq', 'om']),
  poleLabels: Object.freeze({ ecl: '黄道の極', orb: '自分の公転の北極', L: '基準軸 L', eq: '基準軸 eq', om: '合成の軸(軸引きずりの Ω)' }),
  /** 主の列(第151報の回答 —— 共通ブリーフ 353 の「主の列」)と比べる列 */
  main: Object.freeze({ dir: 'Np', axis: 'L', sense: 'g2m', part: 'S', tSrc: 0, k: 1, c: 1, f: 0 }),
  senses: Object.freeze(['g2m', 'g2p']), dirs: Object.freeze(['Np', 'Gm']), axes: Object.freeze(['L', 'eq']),
  /** 背景の大きさの点(窓の下端・窓の上端・注目の列 —— どれも (N+) の窓の記録。0.98 は窓の上端より上) */
  uGrid: Object.freeze([0.0487, 0.835, 0.98]),
  venusSenses: Object.freeze(['tide', 'anti']),
  /** 統括の数え直し 3 の点検の数(基準軸 L・ω_G・金星の φ 規則の半径) */
  anchor: Object.freeze({ L: Object.freeze([0.026257, 0.008317, 0.999621]), Ltol: 5e-7, omegaG: 9.09e-16, phiVenusDeg: 0.7606,
    gravAbs: Object.freeze({ Earth: '55.88', Mars: '7.463', Venus: '46.12' }), resid: Object.freeze({ Earth: '-5.50', Mars: '0.142', Venus: '-1.54' }),   // 第352便y の残り(大きさの差)= sign(重力の列) × 符号つきの残り
  }),
  floor: 1e-12, judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 入力と極 ───────── */
let CTX = null;
/** 既定の入力(第347便e の t1Table・geometry —— 1 度だけ作る)。o.T1・o.GEO・o.cache を渡せばそれを使う */
export function ctxOf(o = {}) {
  if (o.T1 && o.GEO) return { T1: o.T1, GEO: o.GEO, cache: o.cache || {} };
  if (!CTX) CTX = { T1: E.t1Table(), GEO: E.geometry(), cache: {} };
  return { T1: CTX.T1, GEO: CTX.GEO, cache: o.cache || CTX.cache };
}
const checkId = (id) => { if (!Object.prototype.hasOwnProperty.call(DECL.srcSet, id)) throw new RangeError('受け手は ' + Object.keys(DECL.srcSet).join('・')); };
/** 受け手の自転軸 ŝ と公転の北極 n̂(第352便u の axesOf —— 重力の列と軸引きずりの列で同じ ŝ を使う) */
export function axesOf(id, o = {}) { checkId(id); const C = ctxOf(o); return U.axesOf(C.T1, C.GEO, id); }
/** 背景のベクトル(rad/s —— 第352便d の bgVec・(N±) の軸は第352便c の refAxis) */
export function bgOf({ u, dir = DECL.main.dir, axis = DECL.main.axis }, o = {}) {
  if (!DECL.axes.includes(axis)) throw new RangeError('bgOf: 基準軸は L・eq');
  if (!(fin(u) && u >= 0)) throw new RangeError('bgOf: 倍率 u ≥ 0');
  const C = ctxOf(o); return D.bgVec(dir, { u, axis: RC.refAxis(axis, C.T1, C.GEO) });
}
/** 局所の (S)(源 = 太陽・源の半径 tSrc・換算の係数 k —— 第352便k の spinRot。k 1 は第352便q の localS と同じ) */
export function localOf(id, { tSrc = DECL.main.tSrc, k = DECL.main.k, part = DECL.main.part } = {}, o = {}) {
  checkId(id); const C = ctxOf(o), ck = 'loc|' + id + '|' + tSrc + '|' + k + '|' + part;
  if (C.cache[ck]) return C.cache[ck];
  const v = K.spinRot(C.T1, C.GEO, id, 'Sun', { part, tSrc, k }).Om; C.cache[ck] = v; return v;
}
/** 軸引きずりの Ω(背景 + 局所 —— rad/s) */
export function omOf(id, { u, dir = DECL.main.dir, axis = DECL.main.axis, tSrc = DECL.main.tSrc, k = DECL.main.k, part = DECL.main.part, local = true } = {}, o = {}) {
  return add(bgOf({ u, dir, axis }, o), local ? localOf(id, { tSrc, k, part }, o) : [0, 0, 0]);
}
/**
 * 極のベクトル: 'ecl' 黄道の極・'orb' 自分の公転の北極・'L'・'eq' 基準軸・'om' 合成の軸(引数 om〔Ω〕の向き —— 省けば主の列の Ω〔u は引数 u・既定 0.98〕)。
 * [3] を渡せばその向き。
 */
export function poleVec(id, pole, { om = null, u = 0.98 } = {}, o = {}) {
  if (isVec(pole)) return unit(pole);
  const C = ctxOf(o);
  if (pole === 'ecl') return [0, 0, 1];
  if (pole === 'orb') return axesOf(id, o).nHat;
  if (pole === 'L' || pole === 'eq') return RC.refAxis(pole, C.T1, C.GEO);
  if (pole === 'om') { const w = om || omOf(id, { u }, o); return nrm(w) > 0 ? unit(w) : null; }
  throw new RangeError('poleVec: 極は ' + DECL.poles.join('・') + ' か [3]');
}
/** dŝ/dt(rad/s)を極 p に投影した方位の率と傾きの率(″/年)。ŝ ∥ p なら null */
export function project(pv, sHat, ds) {
  if (pv === null) return { az: null, inc: null };
  const r = D.poleRates(pv, sHat, ds);
  return r === null ? { az: null, inc: null } : { az: r.az * ASYR, inc: r.inc * ASYR };
}

/* ───────── 約束の口 ───────── */
/**
 * 重力の側の列(比べる列 —— DFM の式ではない): 第352便u の (T-g) の dŝ/dt を、極 pole(既定は受け手の家の極 —— 地球 黄道の極・ほか公転の北極)に投影した符号つきの方位の率。
 * 返す { id, set, pole, ds(rad/s), az(″/年 —— 右ねじで正), inc(″/年), mag(abs(dŝ/dt) ″/年) }。J2・慣性モーメントの係数が無い天体は ds null。
 */
export function tideRate(id, { pole = null, set = null, om = null, u = 0.98 } = {}, o = {}) {
  checkId(id); const C = ctxOf(o), st = set || DECL.srcSet[id], p = pole || DECL.homePole[id];
  const ck = 'tide|' + id + '|' + st;
  let g = C.cache[ck];
  if (!g) { g = U.rateOf(C.T1, C.GEO, id, st, 'Tg', 'nat', {}, C.cache); C.cache[ck] = g; }
  if (g.ds === null) return { id, set: st, pole: p, ds: null, az: null, inc: null, mag: null, comparison: true };
  const ax = axesOf(id, o), pr = project(poleVec(id, p, { om, u }, o), ax.sHat, g.ds);
  return { id, set: st, pole: p, ds: g.ds, az: pr.az, inc: pr.inc, mag: nrm(g.ds) * ASYR, comparison: true };
}
/**
 * 軸引きずりの列: c × (経路 ② の向き sense —— 主 'g2m' = −Ω × ŝ・比べる列 'g2p')+ f > 0 なら (N1) の経路 ①。Ω = 背景(dir・axis・u)+ k × 局所の (S)(tSrc)。
 * 返す { id, u, dir, axis, sense, c, f, pole, Om, ds(rad/s), az・inc(″/年), omAsYr(abs(Ω) ″/年), spin(ŝ·Ω の符号), rel(合成の軸のまわりの相対の回り), cosSOm }。
 */
export function dragRate(id, { u, dir = DECL.main.dir, axis = DECL.main.axis, sense = DECL.main.sense, c = DECL.main.c, f = DECL.main.f, tSrc = DECL.main.tSrc, k = DECL.main.k, part = DECL.main.part, pole = null, local = true } = {}, o = {}) {
  checkId(id);
  if (!DECL.senses.includes(sense)) throw new RangeError('dragRate: 向きは g2m・g2p');
  if (!fin(c)) throw new RangeError('dragRate: 応答の係数 c は有限の数');
  if (!(fin(f) && f >= 0 && f <= 1)) throw new RangeError('dragRate: 比率 f は 0〜1');
  const ax = axesOf(id, o), s = ax.sHat, Om = omOf(id, { u, dir, axis, tSrc, k, part, local }, o), cf = R3.r3Coeffs(f, 'N1');
  const ds = scl(D.r3Ds(s, Om, { sense, kTilt: cf.kTilt, kPrec: cf.kPrec }), c), p = pole || DECL.homePole[id], pr = project(poleVec(id, p, { om: Om }, o), s, ds);
  return { id, u, dir, axis, sense, c, f, tSrc, k, pole: p, Om, ds, az: pr.az, inc: pr.inc, omAsYr: nrm(Om) * ASYR, spin: D.spinSense(s, Om), rel: D.relSense(s, Om, ds), cosSOm: nrm(Om) > 0 ? dot(s, unit(Om)) : null };
}
/**
 * 仮の値の符号つきの率(″/年 —— 家の極のまわりを右ねじで正)。金星は向きが無いので venusSense 'tide'(重力の列と同じ回り)・'anti'(逆)で符号を置く。印つき。
 * 仮の値の無い天体は null。
 */
export function provRate(id, { venusSense = 'tide' } = {}, o = {}) {
  checkId(id);
  if (!DECL.provBodies.includes(id)) return null;
  const key = DECL.provKeys[id];
  let v;
  if (id === 'Venus') {
    if (!DECL.venusSenses.includes(venusSense)) throw new RangeError('provRate: 金星の向きの置き方は tide・anti');
    const g = tideRate(id, {}, o).az, mag = Math.abs(B.prov(key).value);
    v = (venusSense === 'tide' ? 1 : -1) * Math.sign(g) * mag;
  } else v = B.toRH(key);
  return B.tagProv({ id, pole: DECL.homePole[id], value: v, abs: Math.abs(v), sensed: id !== 'Venus', venusSense: id === 'Venus' ? venusSense : null }, [key]);
}
/**
 * 1 行の和: 重力の列 + 軸引きずりの列(同じ極に投影して足す)。仮の値の在る天体は、残り(仮 − 重力)・足した後の差(仮 − 重力 − 軸引きずり)・広がるか縮むか・
 * 残りを埋める応答の係数 cNeed(符号つき —— 正なら c > 0 の軸引きずりで埋まる向き)・cMax = abs(残り) ÷ abs(c 1 の軸引きずり)を返す(印つき)。
 * o2: dragRate の引数(u・dir・axis・sense・c・f・tSrc・k)+ pole + venusSense。
 */
export function sumRow(id, o2 = {}, o = {}) {
  checkId(id);
  const { venusSense = 'tide', pole = null, c = DECL.main.c, ...dr } = o2, p = pole || DECL.homePole[id];
  const g = tideRate(id, { pole: p, om: omOf(id, { u: dr.u, dir: dr.dir, axis: dr.axis, tSrc: dr.tSrc, k: dr.k }, o) }, o);
  const d = dragRate(id, { ...dr, c, pole: p }, o), d1 = dragRate(id, { ...dr, c: 1, pole: p }, o);
  const row = { id, pole: p, u: d.u, dir: d.dir, axis: d.axis, sense: d.sense, c, f: d.f, tide: g.az, drag: d.az, drag1: d1.az, sum: fin(g.az) && fin(d.az) ? g.az + d.az : null,
    dragOverTide: fin(g.az) && fin(d.az) && g.az !== 0 ? d.az / g.az : null, sameAsTide: fin(g.az) && fin(d.az) ? Math.sign(g.az) === Math.sign(d.az) : null, spin: d.spin, rel: d.rel };
  const P = provRate(id, { venusSense }, o);
  if (P === null) return row;
  const resid = fin(g.az) ? P.value - g.az : null, after = fin(row.sum) ? P.value - row.sum : null;
  Object.assign(row, { prov: P.value, venusSense: P.venusSense, resid, after, widens: fin(resid) && fin(after) ? Math.abs(after) > Math.abs(resid) : null,
    cNeed: fin(resid) && fin(d1.az) && d1.az !== 0 ? resid / d1.az : null, cMax: fin(resid) && fin(d1.az) && d1.az !== 0 ? Math.abs(resid) / Math.abs(d1.az) : null,
    fillSense: fin(resid) && fin(d1.az) && d1.az !== 0 ? Math.sign(resid) === Math.sign(d1.az) : null });
  return B.tagProv(row, P.provKeys);
}
/** 応答の係数の上限: abs(軸引きずりの方位の率) ≤ abs(残り) + 幅 になる c の上限(幅 width ″/年 —— 第352便y の入力の桁の幅など)。残りの大きさと幅を引数で */
export function cUpper(dragAz1, residAbs, width = 0) {
  if (!(fin(dragAz1) && fin(residAbs) && residAbs >= 0 && fin(width) && width >= 0)) throw new RangeError('cUpper: 有限の数(残りと幅は 0 以上)');
  return dragAz1 === 0 ? Infinity : (residAbs + width) / Math.abs(dragAz1);
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO, cache: {} }, cq = {};
  // ① 重力の列の大きさ(家の極)= 第352便u の rateOf(…, 'Tg').az(地球〔太陽 + 月〕黄道の極・火星と金星 公転の北極)
  const grav = {}, gravErr = {};
  for (const id of DECL.provBodies) { const a = tideRate(id, {}, o).az, b = U.rateOf(T1, GEO, id, DECL.srcSet[id], 'Tg', 'nat').az[DECL.homePole[id]]; grav[id] = a; gravErr[id] = Math.abs(a / b - 1); }
  // ② 残り(金星 'tide')= sign(重力の列) × 第352便y の residualOf の res(大きさの差 —— 仮の値が重力の列と同じ回り)
  const resid = {}, residErr = {};
  for (const id of DECL.provBodies) { const r = sumRow(id, { u: 0, local: false }, o).resid, y = Math.sign(grav[id]) * Y.residualOf(T1, GEO, id, cq).res; resid[id] = r; residErr[id] = Math.abs(r - y) / Math.abs(y); }
  // ③ 軸引きずり (g2+)・c 1・(N+) L・規則の半径・u 1 の方位の率(公転の北極・黄道の極)= 第352便q の unitRate の az(地球・火星・金星)
  let unitErr = 0;
  for (const id of DECL.provBodies) { const R = Q.unitRate(T1, GEO, id, { bg: 'Np', axis: 'L', tSrc: 0, u: 1 }, cq);
    for (const p of ['orb', 'ecl']) { const a = dragRate(id, { u: 1, sense: 'g2p', pole: p }, o).az / ASYR; unitErr = Math.max(unitErr, Math.abs(a - R.az[p]) / Math.abs(R.az[p])); } }
  // ④ 局所の (S)(k 1)= 第352便q の localS
  let locErr = 0;
  for (const id of DECL.provBodies) { const a = localOf(id, {}, o), b = Q.localS(T1, GEO, id, 0, cq); locErr = Math.max(locErr, nrm(sub(a, b)) / nrm(b)); }
  // ⑤ 合成の軸のまわりの閉じた形: az = ∓ c abs(Ω)((g2−) で −・(g2+) で +)・相対の回り (g2−) = −1(地球・u 0.98)
  const dm = dragRate('Earth', { u: 0.98, pole: 'om' }, o), dp = dragRate('Earth', { u: 0.98, sense: 'g2p', pole: 'om' }, o);
  const closed = [Math.abs(dm.az / -dm.omAsYr - 1), Math.abs(dp.az / dp.omAsYr - 1)], relM = dm.rel, relP = dp.rel;
  // ⑥ (g2−) = −(g2+)(各極)・c に比例(c 3)・u に比例(局所を外した列 —— u 0.0487 と 0.98)
  let flipErr = 0, cLin = 0;
  for (const p of DECL.poles) { const a = dragRate('Mars', { u: 0.835, pole: p }, o), b = dragRate('Mars', { u: 0.835, sense: 'g2p', pole: p }, o), c3 = dragRate('Mars', { u: 0.835, c: 3, pole: p }, o);
    flipErr = Math.max(flipErr, Math.abs(a.az + b.az) / Math.abs(a.az)); cLin = Math.max(cLin, Math.abs(c3.az / a.az / 3 - 1)); }
  const uL = dragRate('Venus', { u: 0.98, local: false }, o).az / dragRate('Venus', { u: 0.0487, local: false }, o).az, uLin = Math.abs(uL / (0.98 / 0.0487) - 1);
  // ⑦ 統括の数え直し 3: 基準軸 L・ω_G(背景の単位)・金星の φ(−S と L の角 —— 規則の半径)
  const L = RC.refAxis('L', T1, GEO), Lerr = Math.max(...L.map((x, i) => Math.abs(x - DECL.anchor.L[i]))), omegaG = nrm(bgOf({ u: 1 }, o));
  const phiV = Math.acos(Math.max(-1, Math.min(1, dot(scl(unit(localOf('Venus', {}, o)), -1), L)))) / D2R;
  // ⑧ 和の算術: sum = tide + drag・after = prov − sum・cNeed × drag1 = resid
  const sr = sumRow('Earth', { u: 0.98, c: 2e5 }, o), sumErr = Math.abs(sr.sum - sr.tide - sr.drag) / Math.abs(sr.sum), afterErr = Math.abs(sr.after - (sr.prov - sr.sum)), needErr = Math.abs(sr.cNeed * sr.drag1 / sr.resid - 1);
  // ⑨ 仮の値の符号: 地球は −ψ_A の率(右ねじ)・火星 −7.605・金星 tide と anti は符号が逆
  const pE = provRate('Earth', {}, o).value, pM = provRate('Mars', {}, o).value, pVt = provRate('Venus', {}, o).value, pVa = provRate('Venus', { venusSense: 'anti' }, o).value;
  // ⑩ cUpper の算術
  const cu = [cUpper(2, 4), cUpper(-2, 4, 2), cUpper(0, 1)];
  // ⑪ 拒否
  const rej = [() => tideRate('Pluto'), () => dragRate('Earth', { u: 1, sense: 'x' }), () => dragRate('Earth', { u: -1 }), () => dragRate('Earth', { u: 1, f: 2 }), () => bgOf({ u: 1, axis: 'ecl' }),
    () => poleVec('Earth', 'x'), () => provRate('Venus', { venusSense: 'x' }), () => cUpper(1, -1)]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { grav, gravErr, resid, residErr, unitErr, locErr, closed, relM, relP, flipErr, cLin, uLin, Lerr, omegaG, phiV, sumErr, afterErr, needErr,
    provSign: [pE, pM, pVt, pVa], venusTideAz: grav.Venus, cu, rejects: rej };
}
export function pureGates(S) {
  const p4 = (x) => Number(Math.abs(x)).toPrecision(4), p3 = (x) => Number(x).toPrecision(3);
  return {
    gravIsU: Object.values(S.gravErr).every((e) => e < 1e-12) && Object.entries(DECL.anchor.gravAbs).every(([k, v]) => p4(S.grav[k]) === v),
    residIsY: Object.values(S.residErr).every((e) => e < 1e-12) && Object.entries(DECL.anchor.resid).every(([k, v]) => p3(Math.sign(S.grav[k]) * S.resid[k]) === v),
    unitIsQ: S.unitErr < 1e-12,
    localIsQ: S.locErr < 1e-12,
    closedForm: S.closed.every((e) => e < 1e-9) && S.relM === -1 && S.relP === 1,
    flipLinear: S.flipErr < 1e-12 && S.cLin < 1e-12 && S.uLin < 1e-12,
    anchor3: S.Lerr < DECL.anchor.Ltol && Math.abs(S.omegaG / DECL.anchor.omegaG - 1) < 1e-12 && Number(S.phiV).toFixed(4) === DECL.anchor.phiVenusDeg.toFixed(4),
    sumArith: S.sumErr < 1e-12 && S.afterErr < 1e-9 && S.needErr < 1e-12,
    provSign: S.provSign[0] === -50.38481507 && S.provSign[1] === -7.605 && S.provSign[2] === -S.provSign[3] && Math.sign(S.provSign[2]) === Math.sign(S.venusTideAz),
    cUpper: S.cu[0] === 2 && S.cu[1] === 3 && S.cu[2] === Infinity,
    rejects: S.rejects.length === 8 && S.rejects.every(Boolean),
  };
}

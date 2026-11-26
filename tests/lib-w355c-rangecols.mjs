// 第355便c(原仮定者の回答(2026-11-25)「推奨。ただし、必ず0.98 倍である必要は無い」・原仮定者の指示(2026-11-25)「この結果を尊重する」・統括の検証項目 R506):
//   **第353便zf の 35 の題を、主の作り(換算の係数 = 金星で等大になる値 —— 〔第353便zf〕の列 (イ) の作り)で、背景の大きさ u の範囲の内の代表の値ごとに並べ直す純関数**
//   (器 tests/exp-w355c-rangecols.mjs と QA behavior.rangecols355c・docs.rangecols355c が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない。既存の lib は呼ぶだけ(本文は変えない):
//   第353便zf(localSumAt・bgUnit・colState・topicRow・dirRank・ioX・ringGain・gainLam・table1)・第353便zg(aStar・structRows)・第353便u(obsRow)・第353便za(kWatch・fWindow・kState)・第347便e(t1Table・geometry)。
//   **範囲そのものは数えない** —— 範囲の端は引数 ends = { lo, hi } で受ける(既定は前倒しの数の主の行を仮に置いたノブ —— 仮・未照合)。
//   **第353便zf・u・za は仮の値の lib(第352便b)が閉包に入る —— この lib を呼ぶ段の正本は最上位に provisional: true と使った鍵の一覧を持つ。**
//
// ■ 語: u = 背景の大きさ ÷ 銀河の公転の角速度(向きは (N+) —— 基準軸 L)。λ(u) = u で金星の局所の項が背景と同じ大きさになる規則の係数の倍(〔第353便zf〕の列 (イ) の作り —— u 0.98 で 9.374e3)。
//   列 = u の代表の値(範囲の下端・0.41・0.84・0.98・3.2・範囲の上端 —— 範囲の外の中の点は落とす)。行 = 〔第353便zf〕の表 1 の 35 の題(題の名は zf の語のまま)。
// ■ 口: DECL・uList(ends)・lamAt(u)・colAt(u)・ROWS・rowAt(id, col)・table(ends)・shapeOf(row, us)・switchOf(rowId, uA, uB)・summary(T)・compareCols()。
// ■ 言わないこと: 範囲の内のどこかの u を選んだ・題が満たされた、と書かない(代表の値ごとの表 —— 判定はしない)。物差しは文献の値・未照合・歳差の率の残りと回る向きは仮の値。
//   重力の側の潮汐のトルクの列は「比べる列(DFM の式ではない)」。
import * as ZF from './lib-w353zf-threecols.mjs';
import * as ZG from './lib-w353zg-equalradius.mjs';
import * as U from './lib-w353u-nearrecv.mjs';
import * as ZA from './lib-w353za-ktilt.mjs';
import * as E from './lib-w347e-spintorque.mjs';

export const LIB_VERSION = 'w355c-rangecols-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const nrm = (v) => Math.hypot(v[0], v[1], v[2]);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

/* ───────── 宣言(走らせたノブの格子と物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  /** 範囲の端のノブ(既定 —— 前倒しの数の主の行: 受け手の半径は観測の半径・観測の自転・共通 k₂/Q 1e-2。仮・未照合。範囲を数える枝の正本が載った後に置き直せる) */
  ends: Object.freeze({ lo: 0.0023, hi: 40.5, src: '前倒しの数の主の行(観測の自転・共通 k₂/Q 1e-2)—— 仮・未照合のノブ' }),
  /** 範囲の内の代表の値(端の間に在るものだけ使う) */
  mids: Object.freeze([0.41, 0.84, 0.98, 3.2]),
  uFocus: 0.98,
  /** λ の二分の区間(太陽の観測の半径 ÷ 規則の半径 3.97e4 の内)と回数 */
  lamLo: 1e2, lamHi: 3.9e4, lamIter: 80,
  /** 形の判定の床: u に依らない = 範囲の内の最大 ÷ 最小 − 1 が 1% 未満/冪 = 隣どうしの指数がそろう(差 0.02 未満)/切り替わりの u の二分の床(相対 1e-3) */
  tolFlat: 1e-2, tolPow: 0.02, tolSwitch: 1e-3, switchIter: 40,
  band: ZF.DECL.band,
  judge: '丸めの桁の床: 逐語の表は有効数字 3 桁・零試験は相対 1e-9 の床(〔第353便zf〕の列 (イ) と同じ数)',
});
const CACHE = { lam: new Map(), T1: null, GEO: null };
const ctx = (o = {}) => ({ T1: o.T1 || (CACHE.T1 || (CACHE.T1 = E.t1Table())), GEO: o.GEO || (CACHE.GEO || (CACHE.GEO = E.geometry())) });

/** 列の u の並び(下端・中の点のうち端の間のもの・上端 —— 昇順) */
export function uList(ends = DECL.ends) {
  const lo = ends.lo, hi = ends.hi;
  if (!(fin(lo) && fin(hi) && lo > 0 && hi > lo)) throw new RangeError('uList: 0 < lo < hi');
  return [lo, ...DECL.mids.filter((m) => m > lo && m < hi), hi];
}
/** u で金星の局所の項が背景と同じ大きさになる λ(二分 —— 〔第353便zf〕の lamVenus と同じ作り・区間だけ広い) */
export function lamAt(u, o = {}) {
  if (!(fin(u) && u > 0)) throw new RangeError('lamAt: u > 0');
  if (CACHE.lam.has(u)) return CACHE.lam.get(u);
  const nb = nrm(ZF.bgUnit(o)), f = (lam) => nrm(ZF.localSumAt('Venus', lam, o)) / nb;
  let lo = DECL.lamLo, hi = DECL.lamHi;
  if (!(f(lo) < u && f(hi) > u)) throw new RangeError('lamAt: u が λ の区間の外(' + u + ')');
  for (let i = 0; i < DECL.lamIter; i++) { const m = Math.sqrt(lo * hi); if (f(m) < u) lo = m; else hi = m; }
  const lam = Math.sqrt(lo * hi); CACHE.lam.set(u, lam); return lam;
}
/** 列の口(〔第353便zf〕の topicRow・colState が受ける形 —— 列 (イ) の作りで u と λ を数で渡す) */
export function colAt(u, o = {}) { return Object.freeze({ id: 'I', label: 'u ' + u, lam: lamAt(u, o), u }); }

/* ───────── 行(〔第353便zf〕の表 1 の 35 の題 —— 同じ並び・同じ id・同じ数え方)───────── */
const COMBO_MAIN = 'rule';   // 〔第353便zf〕の列 (イ) と同じ(見ている時間・回る向き・寄る割合の題は換算の係数の組で数える)
const N3 = [0, 2, 5], NLAB = ['倍なし', '', 'n 2', '', '', 'n 5'];
const aStarS = {}, aStarJ = {};
function aStars(o) { if (aStarS[0] === undefined) { const { T1, GEO } = ctx(o); for (const n of N3) { aStarS[n] = ZG.aStar(T1, GEO, 'Saturn', { n }); aStarJ[n] = ZG.aStar(T1, GEO, 'Jupiter', { n }); } } return { aS: aStarS, aJ: aStarJ }; }
const tr = (t) => (cs, o) => { const r = ZF.topicRow(t, cs.col, o); return { v: r.v, vComp: r.vComp, band: r.band, vK: r.vK, cNeed: r.cNeed === undefined ? null : r.cNeed, fMax: r.fMax === undefined ? null : r.fMax }; };
const vRes = (cs, o) => { const b1 = ZF.bgUnit(o), v = ZF.localSumAt('Venus', cs.lam, o); return nrm(add(scl(b1, cs.u), v)) / (cs.u * nrm(b1)); };
const aMul = (cs, which, o) => Math.cbrt((which === 'S' ? ZF.ringGain(cs.lam, o) : ZF.gainLam('Io', cs.lam, o)) / ZF.gainLam('Venus', cs.lam, o));
const R0 = [];
const def = (g, id, label, ruler, f, kind = 'num') => R0.push(Object.freeze({ g, id, label, ruler, f, kind }));
def(1, 'venusResid', '金星の合成 ÷ 背景(等大の残り)', null, (cs, o) => ({ v: vRes(cs, o) }));
def(1, 'venusRank', '向きの一致 2 sin(φ/2) の金星の順位(受け手 10)', null, (cs, o) => { const d = ZF.dirRank(cs.lam, o); return { v: d.venusRank, res: d.rows.find((r) => r.id === 'Venus').res, second: d.second }; }, 'rank');
for (const n of N3) def(2, 'ioX' + n, 'イオの x(' + (n === 0 ? '扁平率なし' : n === 2 ? '体積を保つ扁平 (1 − f)^(−2/3)' : '赤道の球 (1 − f)^(−5/3)') + ')', null, (cs, o) => ({ v: ZF.ioX(n, cs.lam, o) }));
for (const n of N3) def(3, 'cassini' + n, 'カッシーニの間隙 ÷ 土星の a★(' + NLAB[n] + ')', null, (cs, o) => { const { aS } = aStars(o), r = ZG.structRows('Saturn').find((s) => s.key === 'satCD').r, a = aS[n] * aMul(cs, 'S', o); return { v: r / a, aStar: a }; });
for (const n of N3) def(3, 'ioOrb' + n, 'イオの道 ÷ 木星の a★(' + NLAB[n] + ')', null, (cs, o) => { const { aJ } = aStars(o), r = ZG.structRows('Jupiter').find((s) => s.key === 'io').r, a = aJ[n] * aMul(cs, 'J', o); return { v: r / a, aStar: a }; });
def(4, 'ringAx', '土星の環 (F1) の率 ÷ 物差し(B 環)', '環の物差しの率', tr('ringAx'));
def(4, 'ringDisk', '土星の環 (F2) の率 ÷ 物差し(B 環)', '環の物差しの率', tr('ringDisk'));
def(5, 'plane', '公転面の集まり ÷ 物差し', '30° → 7° の 23°', tr('plane'));
def(6, 'mercury', '水星の局所 ÷ 背景', '背景の大きさ', tr('mercury'));
for (const id of ['Earth', 'Mars']) def(6, 'side' + id, (id === 'Earth' ? '地球' : '火星') + 'の局所 ÷ 背景', null, (cs, o) => ({ v: nrm(ZF.localSumAt(id, cs.lam, o)) / (cs.u * nrm(ZF.bgUnit(o))) }));
def(6, 'moon', '月の局所 ÷ 背景', '背景の大きさ', tr('moon'));
def(6, 'io', 'イオの局所 ÷ 背景', '背景の大きさ', tr('io'));
for (const id of ['Earth', 'Mars']) def(6, 'sense' + id, (id === 'Earth' ? '地球' : '火星') + 'の歳差の回る向きが仮の値と同じか(1 = 同じ —— 仮・未照合)', null, (cs) => { const r = U.obsRow(id, COMBO_MAIN, { u: cs.u }); return { v: r.provSame ? 1 : 0, drag: r.drag, provisional: true }; }, 'flag');
def(7, 'tilt', '地球の傾き(局所だけで年齢の間に動き得る角 ÷ いまの傾き)', 'いまの傾き', tr('tilt'));
for (const y of [1e4, 1e6, 4.5e9]) def(7, 'watch' + y, '地球の傾きの変化 °(公転の極を固定・' + (y === 1e4 ? '1 万年' : y === 1e6 ? '100 万年' : '45 億年') + ')', null, (cs) => { const w = ZA.kWatch('Earth', COMBO_MAIN, { years: y, mode: 'fixed', u: cs.u }); return { v: w.winDeg, provisional: true }; });
def(7, 'watchTurn', '地球の傾きの一周の揺れの幅 °', null, (cs) => { const w = ZA.kWatch('Earth', COMBO_MAIN, { years: 1e4, mode: 'fixed', u: cs.u }); return { v: w.swingDeg, periodYr: w.periodYr }; });
def(8, 'fMax', '傾きを保つ寄る割合の上限(地球)', null, (cs) => { const w = ZA.fWindow('Earth', COMBO_MAIN, { u: cs.u }); return { v: w.fMax, noLimit: w.noLimit }; });
def(8, 'fRing', '公転面が寄る割合の下限(地球の道の輪)', null, (cs) => { const w = ZA.fWindow('Earth', COMBO_MAIN, { u: cs.u }); return { v: w.fRingW, gap: w.gapW }; });
for (const k of ['Sun', 'Earth']) def(9, 'period' + k, (k === 'Sun' ? '太陽' : '地球') + 'の歳差の 1 周(年)', null, (cs) => ({ v: ZA.kState(k, COMBO_MAIN, { u: cs.u }).periodYr }));
def(9, 'turnsSun', '太陽の円錐の年齢の内の周の数', null, (cs) => ({ v: ZF.DECL.ageYr / ZA.kState('Sun', COMBO_MAIN, { u: cs.u }).periodYr }));
def(10, 'precEarth', '地球の歳差の率の残りの埋まる割合(1 ÷ 要る応答の係数 —— 仮・未照合)', '残り(仮の値 − 重力の側の列)', tr('precEarth'));
def(10, 'precMars', '火星の歳差の率の残りの埋まる割合(同上)', '残り(同上)', tr('precMars'));
def(11, 'ioHeat', 'イオの内部熱 ÷ 物差し', '熱の物差し', tr('ioHeat'));
def(11, 'ioLock', '潮汐ロック(直交成分のトルク ÷ 潮汐のトルク)', '潮汐のトルク(比べる列(DFM の式ではない))', tr('ioLock'));
export const ROWS = Object.freeze(R0);
export const ROW_IDS = Object.freeze(ROWS.map((r) => r.id));

/** 1 つの題 × 1 つの列(列は colAt(u) の形) */
export function rowAt(id, col, o = {}) {
  const R = ROWS.find((r) => r.id === id); if (!R) throw new RangeError('rowAt: 題は ' + ROW_IDS.length + ' 個の id');
  const cs = { col, lam: col.lam, u: col.u };
  return { u: col.u, lam: col.lam, ...R.f(cs, o) };
}
/** 題の状態の印(切り替わりの判定に使う —— 物差しの在る題は帯・順位の題は順位・印の題は 0/1・上限なしの印・符号) */
export function stateOf(R, cell) {
  if (cell.v === null || cell.v === undefined) return 'none';
  if (R.ruler !== null) return 'band:' + cell.band;
  if (R.kind === 'rank' || R.kind === 'flag') return R.kind + ':' + cell.v;
  if (R.id === 'fMax' && cell.noLimit) return 'noLimit';
  return 'sign:' + (cell.v > 0 ? '+' : cell.v < 0 ? '−' : '0');
}

/* ───────── 表 ───────── */
/** 表 1: 題 35 × 列(u の代表の値) */
export function table(ends = DECL.ends, o = {}) {
  const us = uList(ends), cols = us.map((u) => colAt(u, o));
  const rows = ROWS.map((R) => ({ g: R.g, id: R.id, label: R.label, ruler: R.ruler, kind: R.kind, cells: cols.map((c) => rowAt(R.id, c, o)) }));
  return { ends: { lo: ends.lo, hi: ends.hi }, us, cols: cols.map((c) => ({ u: c.u, lam: c.lam, gainVenus: ZF.gainLam('Venus', c.lam, o) })), rows };
}
/** 「ほぼ等しい数どうしの差」の葉(spread = 最大 ÷ 最小 − 1・pDev = 指数の散り)を小数 9 桁で持つ。
 *  元の数(値・指数 p)は相対 1e-9 で照らすので、その差は絶対 1e-9 までしか意味を持たない。丸めずに持つと、Node の版による元の数の末尾の違い(1e-12 の桁)が
 *  差の葉では相対 1e-9 を越えて見える(第338便c の尺度〔Math の関数の戻り値をずらした走り直し〕では、この葉の尺度は 0〜4e-16 で、版の違いより小さく出る)。形の判定(tolFlat・tolPow)は丸める前の数で行う。 */
const q9 = (x) => Number(x.toFixed(9));
/** 形: u に依らない(flat)・u の冪(power —— 指数 p)・なだらかに曲がる(bend)・値が数でない(discrete) */
export function shapeOf(row, us) {
  const v = row.cells.map((c) => c.v);
  if (row.kind !== 'num' || !v.every(fin)) return { kind: 'discrete' };
  const sign = v.every((x) => x > 0) ? 1 : v.every((x) => x < 0) ? -1 : 0;
  const av = v.map(Math.abs), mx = Math.max(...av), mn = Math.min(...av), hiLo = v[v.length - 1] / v[0];
  if (sign !== 0 && mx / mn - 1 < DECL.tolFlat) return { kind: 'flat', hiLo, spread: q9(mx / mn - 1) };
  if (sign === 0) return { kind: 'bend', hiLo, signChange: true };
  const p = us.slice(1).map((u, j) => Math.log(av[j + 1] / av[j]) / Math.log(u / us[j]));
  const pm = p.reduce((s, x) => s + x, 0) / p.length, pDev = Math.max(...p.map((x) => Math.abs(x - pm)));
  return pDev < DECL.tolPow ? { kind: 'power', p: pm, pDev: q9(pDev), hiLo } : { kind: 'bend', p, hiLo };
}
/** 切り替わりの u(二分 —— 状態の印が uA と uB で違うとき、相対 tolSwitch まで) */
export function switchOf(id, uA, uB, o = {}) {
  const R = ROWS.find((r) => r.id === id), st = (u) => stateOf(R, rowAt(id, colAt(u, o), o));
  const sA = st(uA), sB = st(uB); if (sA === sB) return null;
  let lo = uA, hi = uB;
  for (let i = 0; i < DECL.switchIter && hi / lo - 1 > DECL.tolSwitch; i++) { const m = Math.sqrt(lo * hi); if (st(m) === sA) lo = m; else hi = m; }
  return { from: sA, to: sB, uSwitch: Math.sqrt(lo * hi), lo, hi };
}
/** 表 2: 題ごとの形・下端と上端の比・切り替わり(印が隣の列で替わる所を二分で) */
export function summary(T, o = {}) {
  const rows = T.rows.map((r) => {
    const sh = shapeOf(r, T.us), states = r.cells.map((c) => stateOf(r, c)), sw = [];
    for (let j = 0; j + 1 < states.length; j++) if (states[j] !== states[j + 1]) sw.push(switchOf(r.id, T.us[j], T.us[j + 1], o));
    return { id: r.id, label: r.label, ruler: r.ruler, ...sh, states, switches: sw, switched: sw.length > 0 };
  });
  const ids = (f) => rows.filter(f).map((r) => r.id);
  const count = { flat: ids((r) => r.kind === 'flat'), power: ids((r) => r.kind === 'power'), prop1: ids((r) => r.kind === 'power' && Math.abs(r.p - 1) < DECL.tolPow), inv1: ids((r) => r.kind === 'power' && Math.abs(r.p + 1) < DECL.tolPow),
    bend: ids((r) => r.kind === 'bend'), discrete: ids((r) => r.kind === 'discrete'), switched: ids((r) => r.switched), steady: ids((r) => !r.switched),
    /** u に依らない題 = 範囲の内で 1% の内(flat)+ 値が数でなく、どの列でも同じ印(順位・印) */
    indep: ids((r) => r.kind === 'flat' || (r.kind === 'discrete' && !r.switched)) };
  return { rows, count };
}
/** 比べる列: 〔第353便zf〕の列 (ウ)(換算の係数 1・背景 = 金星の条件)と (ア)(換算の係数 1・0.98)と、主の作りの 0.98 の列の照合の元の (イ) */
export function compareCols(o = {}) {
  const T = ZF.table1(o), pick = (k) => T.rows.map((r) => ({ id: r.id, v: r.cells[k].v, band: r.cells[k].band === undefined ? null : r.cells[k].band, noLimit: r.cells[k].noLimit === true }));
  return { U: { u: T.cols[2].u, lam: T.cols[2].lam, rows: pick(2) }, A: { u: T.cols[0].u, lam: T.cols[0].lam, rows: pick(0) }, I: { u: T.cols[1].u, lam: T.cols[1].lam, rows: T.rows.map((r) => ({ id: r.id, cell: r.cells[1] })) } };
}

/* ───────── 零試験 ───────── */
const numLeaves = (a, b, path = '', out = []) => {
  if (fin(a) || fin(b)) { if (!(fin(a) && fin(b) && rel(a, b) <= 1e-9)) out.push(path + ' ' + a + ' / ' + b); return out; }
  if (a && typeof a === 'object' && b && typeof b === 'object') { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if (k !== 'col' && k !== 'u' && k !== 'lam') numLeaves(a[k], b[k], path + '/' + k, out); return out; }
  if (a !== b) out.push(path + ' ' + a + ' / ' + b);
  return out;
};
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  const o = { T1, GEO }, zf = ZF.table1(o), c98 = colAt(0.98, o);
  const mine = ROWS.map((R) => rowAt(R.id, c98, o)), diffs = [];
  zf.rows.forEach((r, k) => { if (r.id !== ROWS[k].id) diffs.push('id ' + r.id); numLeaves(mine[k], r.cells[1], r.id, diffs); });
  const lamRel = rel(c98.lam, ZF.lamVenus({ u: 0.98 }, o));
  const nb = nrm(ZF.bgUnit(o)), resLo = nrm(ZF.localSumAt('Venus', lamAt(DECL.ends.lo, o), o)) / nb / DECL.ends.lo, resHi = nrm(ZF.localSumAt('Venus', lamAt(DECL.ends.hi, o), o)) / nb / DECL.ends.hi;
  const rejects = [() => lamAt(0), () => lamAt(1e9), () => uList({ lo: 2, hi: 1 }), () => rowAt('nope', c98, o), () => uList({ lo: NaN, hi: 1 })].map((f) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } });
  return { nRows: zf.rows.length, idsSame: zf.rows.every((r, k) => r.id === ROWS[k].id), diffs: diffs.slice(0, 5), nDiff: diffs.length, lamRel, lam98: c98.lam, equalLo: resLo, equalHi: resHi,
    us: uList(), rejects };
}
export function pureGates(S) {
  return {
    zf098: S.nRows === 35 && S.idsSame && S.nDiff === 0,
    lam098: S.lamRel < 1e-9 && Number(S.lam98).toExponential(4) === '9.3743e+3',
    equalEnds: Math.abs(S.equalLo - 1) < 1e-9 && Math.abs(S.equalHi - 1) < 1e-9,
    uList: JSON.stringify(S.us) === JSON.stringify([0.0023, 0.41, 0.84, 0.98, 3.2, 40.5]),
    rejects: S.rejects.every(Boolean),
  };
}

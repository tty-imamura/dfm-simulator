// 第342便d(原仮定者の回答(2026-11-18 —— 第142報)AN827「B。中身を足してから進める」・統括の検証項目 R375):
//   **第340便d の器の訂正 —— 扁平の経路の比(扁平の源 ÷ 球の源)を、同じ物理の位置の球と比べる**の純関数。
//   第340便d の lib `tests/lib-w340d-gyropath.mjs` の `oblateRows` は、lib-1 では球の源の分母の覚え方の鍵に「距離 ÷ 赤道半径」を使い、扁平率 0 でない行で
//   別の物理の距離(r = 比 × 1 —— 扁平の源の点は r = 比 × R_eq)で作った球の分母を当てていた(土星の扁平率 0.098 で R_eq = 1.035)。lib-2 で鍵を物理の距離に直した。
//   本 lib は (1) lib-1 の分母を作り直す関数(訂正の表の旧い値 —— 写しの tests/data-w342d-gyropathold.json と数で照合する)(2) 同じ物理の位置の球を、覚え方を通さず
//   直に作り直した分母(独立の照合)(3) 旧い比 → 新しい比の訂正の表(分子と分母の生の値つき)と要約、を出す。
// ■ 直すのは比べる位置だけ —— 源の区切りの点の数(960 点)・格子(扁平率 6 × 距離 5 × 高さ 4)・場の列は変えない。位置を直しても 960 点の格子の粗さは残る
//   (直した比を「強さの正本」にしない —— 細かい表は第341便d の正本 tests/out/oblatering-341d.json)。
// ■ 言わないこと: 比の符号が変わった行を「物理の向きが変わった」とは書かない(分母が小さい行では比が大きく動く —— 分子と分母の生の値を並べる)。
//   「扁平で寄せる力が強くなると分かった」「向きが逆だったと分かった」とは書かない(位置を直した 960 点の表ではこうなる、まで)。アプリの 🛟(帯を入力として与えた型)には関係しない。
// html を読まない・ネットへ取りに行かない・乱数を使わない。第340便d の lib は呼ぶだけ。
import { DECL, gyroRow, spheroidField, spheroidParts, oblateRows, oblatePow, LIB_VERSION as LIB340D } from './lib-w340d-gyropath.mjs';

export const LIB_VERSION = 'w342d-gyropathfix-lib-1';
export const DATA_OLD = 'tests/data-w342d-gyropathold.json';
/** 宣言: 代表の 10 行(扁平率 0.098・高さ 0.01 の距離 1.1・1.5・2 の 3 経路 = PHYSICS〔第340便d〕⑥′ の表の列 + 符号が変わった例 1 つ)・変わった大きさの区分(新しい比 ÷ 旧い比) */
export const DECL342D = Object.freeze({
  rep: Object.freeze([[0.098, 1.1, 0.01, 'h1|corV'], [0.098, 1.1, 0.01, 'h1|corS'], [0.098, 1.1, 0.01, 'h1|drag90'], [0.098, 1.5, 0.01, 'h1|corV'], [0.098, 1.5, 0.01, 'h1|corS'],
    [0.098, 1.5, 0.01, 'h1|drag90'], [0.098, 2, 0.01, 'h1|corV'], [0.098, 2, 0.01, 'h1|corS'], [0.098, 2, 0.01, 'h1|drag90'], [0.05, 1.5, 0.01, 'h1|corS']]),
  bins: Object.freeze([0.5, 0.9, 0.99, 1.01, 1.1, 2]),
  /** 「変わった」の物差し: 分母の相対の差が 1e-9 を超える(同じ位置なら同じ計算 —— Node 22 で差 0・Node 24 で Math の関数の末尾の bit の分 1.8e-12 まで。
   *  位置が変わった 300 個の差は最小 9.3e-5 —— 物差しの両側に 4 桁以上の開き) */
  changedTol: 1e-9,
  /** 旧い値の照合の物差し(Node の版で Math の関数の末尾の bit が違う分 —— 相対 1e-9) */
  oldTol: 1e-9,
});
const rel = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const sphereSet = () => { const src0 = spheroidParts(0); return { src0, F0: Object.fromEntries(DECL.t4.kinds.map((k) => [k, spheroidField(src0, k, { Iref: src0.I })])) }; };
const denAt = (F0, k, a, zr, r) => gyroRow({ action: a, q: 1, p: DECL.t1.pMain, body: 'sphere', zOverR: zr, r, field: F0[k], cubeK: DECL.t4.recvCubeK }).pull;

/** lib-1 の分母の作り直し: 球の源の点 r = 距離 ÷ 赤道半径 × 球の R_eq(= 1)—— 扁平率に依らず同じ値(lib-1 の覚え方が当てた値)。鍵 'k|a|rOverReq|zOverR' */
export function lib1Den() {
  const { src0, F0 } = sphereSet(), D = DECL.t4, out = {};
  for (const rr of D.rOverReq) for (const zr of D.zOverR) for (const k of D.pathKinds) for (const a of D.pathActions) out[[k, a, rr, zr].join('|')] = denAt(F0, k, a, zr, rr * src0.Req);
  return out;
}
/** 独立の照合: 行ごとに、同じ物理の位置 r = 距離 ÷ 赤道半径 × その行の R_eq の球の源の分母を、覚え方を通さず直に作る(行 × 経路) */
export function directDen(rows) {
  const { F0 } = sphereSet(), out = [];
  for (const row of rows) { const r = row.rOverReq * row.Req;
    for (const k of DECL.t4.pathKinds) for (const a of DECL.t4.pathActions) out.push({ f: row.f, rOverReq: row.rOverReq, zOverR: row.zOverR, key: k + '|' + a, den: denAt(F0, k, a, row.zOverR, r), lib: row.path[k + '|' + a].pullSphere }); }
  return out;
}
/** 訂正の表: rows = lib-2 の oblateRows()・old = 写しの rows([f, rOverReq, zOverR, key, pull, pullSphere, ratio])—— 360 個 */
export function fixTable(rows, old) {
  const O = new Map(old.map((o) => [[o[0], o[1], o[2], o[3]].join('|'), o])), out = [];
  for (const row of rows) for (const k of DECL.t4.pathKinds) for (const a of DECL.t4.pathActions) {
    const key = k + '|' + a, p = row.path[key], o = O.get([row.f, row.rOverReq, row.zOverR, key].join('|'));
    if (!o) throw new RangeError('fixTable: 旧い値が無い ' + [row.f, row.rOverReq, row.zOverR, key].join('|'));
    const ratioOld = o[6], ratioNew = p.ratio;
    out.push({ f: row.f, rOverReq: row.rOverReq, zOverR: row.zOverR, key, pull: p.pull, pullOld: o[4], denOld: o[5], denNew: p.pullSphere, ratioOld, ratioNew,
      changed: rel(o[5], p.pullSphere) > DECL342D.changedTol, flip: ratioOld !== null && ratioNew !== null && Math.sign(ratioOld) !== Math.sign(ratioNew),
      q: ratioOld !== null && ratioNew !== null && ratioOld !== 0 ? ratioNew / ratioOld : null });
  }
  return out;
}
/** 要約: 数・変わった数・符号が変わった数・扁平率ごと・大きさの区分(符号が同じで変わった行の 新 ÷ 旧)・分母の比(新 ÷ 旧)の幅 */
export function fixSummary(T) {
  const ch = T.filter((t) => t.changed), same = ch.filter((t) => !t.flip && t.q !== null), b = DECL342D.bins;
  const bins = b.map((x, i) => ({ lo: i === 0 ? 0 : b[i - 1], hi: x, n: same.filter((t) => Math.abs(t.q) >= (i === 0 ? 0 : b[i - 1]) && Math.abs(t.q) < x).length }));
  bins.push({ lo: b[b.length - 1], hi: null, n: same.filter((t) => Math.abs(t.q) >= b[b.length - 1]).length });
  const byF = [...new Set(T.map((t) => t.f))].map((f) => ({ f, n: T.filter((t) => t.f === f).length, changed: T.filter((t) => t.f === f && t.changed).length, flip: T.filter((t) => t.f === f && t.flip).length }));
  const dq = ch.map((t) => t.denNew / t.denOld);
  return { n: T.length, changed: ch.length, flip: T.filter((t) => t.flip).length, unchangedSphere: T.filter((t) => t.f === 0 && !t.changed).length, byF, bins,
    denRatio: { min: Math.min(...dq), max: Math.max(...dq), negative: dq.filter((x) => x < 0).length } };
}
/** 代表の 10 行(分子と分母の生の値つき) */
export function repRows(T) {
  return DECL342D.rep.map(([f, rr, zr, key]) => { const t = T.find((x) => x.f === f && x.rOverReq === rr && x.zOverR === zr && x.key === key);
    return { f, rOverReq: rr, zOverR: zr, key, pull: t.pull, denOld: t.denOld, denNew: t.denNew, ratioOld: t.ratioOld, ratioNew: t.ratioNew, flip: t.flip }; });
}
/** まとめて: lib-2 の行・lib-1 の分母の作り直し・独立の照合・訂正の表・要約・代表の行・べき(新しい値) */
export function fixAll(old) {
  const rows = oblateRows(), L1 = lib1Den(), DD = directDen(rows), T = fixTable(rows, old.rows);
  // lib-1 の作り直しの照合: 旧い分母・旧い比・分子(分子は lib-1 と lib-2 で同じ計算)が写しと相対 oldTol の内
  const oldCheck = old.rows.map((o) => { const d1 = L1[[o[3].split('|')[0], o[3].split('|')[1], o[1], o[2]].join('|')], t = T.find((x) => x.f === o[0] && x.rOverReq === o[1] && x.zOverR === o[2] && x.key === o[3]);
    const r1 = d1 ? t.pull / d1 : null;
    return { den: rel(d1, o[5]), ratio: r1 === null || o[6] === null ? (r1 === o[6] ? 0 : 1) : rel(r1, o[6]), pull: rel(t.pull, o[4]), exact: d1 === o[5] && t.pull === o[4] }; });
  return { lib340d: LIB340D, rows, table: T, summary: fixSummary(T), rep: repRows(T), pow: oblatePow(rows),
    direct: { n: DD.length, equal: DD.filter((d) => d.den === d.lib).length, worst: Math.max(...DD.map((d) => rel(d.den, d.lib))) },
    oldCheck: { n: oldCheck.length, within: oldCheck.filter((c) => c.den <= DECL342D.oldTol && c.ratio <= DECL342D.oldTol && c.pull <= DECL342D.oldTol).length, exact: oldCheck.filter((c) => c.exact).length,
      worst: Math.max(...oldCheck.map((c) => Math.max(c.den, c.ratio, c.pull))) } };
}

// 第348便d(原仮定者の指示(2026-11-22 —— 第145報の補足 1)「軸引きずりは、円盤引きずりにも影響するので、様々な可能性から最適を探す」・
//   原仮定者の回答(2026-11-23 —— 第145報の回答 10)AN977・統括の検証項目 R412):
//   **軸引きずりの回転の候補(〔第347便h〕の (P2)・(P6)・(W)・(G)・(V))を、円盤引きずりの既存の器のうち「軸引きずりの回転」が入口になっているものに入れて、
//   円盤引きずりの側の量がどう変わるかを数える純関数 —— 診断だけ**
//   (器 tests/exp-w348d-diskaxis.mjs と QA behavior.diskaxis348d・docs.diskaxis348d が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文は変えない・版を上げない): 第347便h(makeField・rotOf —— 候補の回転)・第340便d(gyroRow —— 部位の力・fieldOmega —— 今の式〔2 倍角の則の型 h_q〕・
//   spheroidParts・spheroidField・angleAtan2)・第338便d(土星の源・環の区分・固定の比べる列)。
//
// ■ 入口(T1 の棚卸しの結果 —— 軸引きずりの回転 Ω(x) を場として受け取る器): 第340便d の gyroRow は `field`(x ↦ Ω)を受け取る口を持つ —— 今の式は
//   Ω(x) = A abs(x)^(−p) h_q(s ŝ, x̂)(第338便b の twistAxis —— 主の列 h₁〔軸の方向で 0〕・比べる列 h₀〔2 倍角の則そのまま〕・A 1・p 2 の宣言)。
//   本 lib は同じ口に候補の場 Ω_c(x) = rotOf(c, u, x, {ê = x̂, R_b})(u は〔第347便h〕の今のアプリの形の並進引きずりの枠の速度の場 —— 重みのべき p_w 1・引きずり減衰 q・D₀)を入れる。
// ■ 量(候補 × q 0・2・3 × D₀ 0・0.1 —— 今の式の列を基準に):
//   (A) 環の粒子の、赤道面へ寄せる向き(第340便d の T1 —— 輪の受け手・作用 corV・corS・drag90・距離 d・高さ z/r の格子)と、向きが変わる高さ(釣り合いの高さの候補 z*)。
//   (B) 経路の比(第340便d の T4・第342便d —— 扁平の源 ÷ 同じ物理の位置の球の源: 場の向きの軸の傾きの比・寄せる力の比)。源は部位の和(第340便d の spheroidParts 960 点)。
//       候補の場の部位: 質量 m_j・速度 ŝ × y_j(剛体の自転)・自転 ŝ・引きずり半径 R_j = 1(宣言 —— 源の R_d)。
//   (C) 土星の環の物差し(点の受け手・corV・環の区分の中心 5 —— 長さは土星の半径・時間は √(R³/GM)・源の自転 s = 観測の自転 × √(R³/GM)):
//       向き・大きさの桁(K = 寄せる力 ÷ (z n²))・向きが変わる高さ(二分で細かく)と、その 2 倍の厚み H* —— 固定の比べる列(リポジトリの中の数 —— 合わせない)。
//   (D) 「源が無回転で横を通り過ぎても発生する」の円盤の側: 自転しない源の通過(〔第347便h〕の例 (ii) と同じ道)で、環の粒子の輪の各点が枠に運ばれる量
//       δ_k = ∫ (u(x_k, t) − u(中心, t))·L̂ dt を、平均・傾き(方位の 1 次)・残り(2 次より上 —— 厚みの候補)に分け、候補の回転の ∫Ω dt が言う傾きと並べる。
// ■ 言わないこと: 環の厚み・帯・軸引きずりの型・円盤引きずりの式の答えとは書かない(この器・この候補・このノブでは、の表)。
//   観測の数はリポジトリの中の数だけを固定の比べる列に置く(文献の値・未照合 —— 合わせない)。
import * as H from './lib-w347h-axisdiff.mjs';
import * as GP from './lib-w340d-gyropath.mjs';
import * as RB from './lib-w338d-ringbook.mjs';

export const LIB_VERSION = 'w348d-diskaxis-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => scl(a, 1 / nrm(a));

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  cands: Object.freeze(['P2', 'P6', 'W', 'G', 'V']),
  /** 今の式の列(第340便d の fieldOmega —— h₁ = twistAxis の q 1〔主の列〕・h₀ = q 0〔2 倍角の則そのまま〕・A 1・場のべき 2) */
  cur: Object.freeze(['h1', 'h0']), curP: 2,
  /** 候補の場のノブ(引きずり減衰 q —— 0 は定義どおり〔落ちない〕・D₀・重みのべき p_w・候補の受け手の半径 R_b) */
  q: Object.freeze([0, 2, 3]), D0: Object.freeze([0, 0.1]), pw: 1, Rb: 0.1,
  /** (A) 環の粒子(第340便d の輪の受け手 64 点・R/r 0.01・自転 ω_s 10・L̂ = ŝ)—— (V) は d 10 と高さの粗い格子だけ(求積 768 点 × 64 点で重い) */
  A: Object.freeze({ d: Object.freeze([3, 10]), actions: Object.freeze(['corV', 'corS', 'drag90']), z: Object.freeze([0.001, 0.003, 0.01, 0.03, 0.1, 0.3]),
    vD: Object.freeze([10]), vZ: Object.freeze([0.001, 0.01, 0.1, 0.3]), zRef: 0.01 }),
  /** (B) 経路の比(第340便d の T4 の格子の一部 —— 部位 960 点・受け手の立方の格子 k 2)。寄せる力の比は (P2)・(W) だけ・軸の傾きは (P2)・(P6)・(W)・(G)・(V 1 行) */
  B: Object.freeze({ f: Object.freeze([0.098, 0.3]), fPath: Object.freeze([0.098]), rOverReq: Object.freeze([1.5, 2, 5]), z: Object.freeze([0.01, 0.1]),
    actions: Object.freeze(['corV', 'corS', 'drag90']), pathCands: Object.freeze(['P2', 'W']), tiltCands: Object.freeze(['P2', 'P6', 'W', 'G']), partR: 1, recvCubeK: 2,
    vRow: Object.freeze({ f: 0.098, rOverReq: 2, z: 0.1, q: 2, D0: 0.1 }) }),
  /** (C) 土星の環(点の受け手・corV・区分の中心 5・高さ z/r = 10^(−8)〜10^(−0.5) の 16 点・向きが変わる高さは log z の二分 40 回) */
  C: Object.freeze({ centers: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']), zExp: Object.freeze([-8, -7.5, -7, -6.5, -6, -5.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5]),
    zK: 1e-6, bisect: 40,
    /** 輪の受け手(第340便d の 64 点・R/r 0.01 —— 作用 corS・drag90)の向きと向きが変わる高さの括り(高さの粗い格子)。(G) は (W) と同じ・(V) は (W) との差が (R_b/d)² の桁なので数えない */
    ringActions: Object.freeze(['corS', 'drag90']), ringCands: Object.freeze(['P2', 'P6', 'W']), ringZ: Object.freeze([1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 0.03, 0.1, 0.3]) }),
  /** (D) 通過(源 (v t, b, 0)・速度 (v, 0, 0)・自転 0・質量 1・半径 1・p_w 1)と輪(半径 R_r・点 32・法線 L̂ = (sin i, 0, cos i) —— 源の進む向きへ倒す) */
  D: Object.freeze({ v: 0.1, b: 10, D0: Object.freeze([0, 0.01, 0.1]), Rr: Object.freeze([0.1, 1]), inc: Object.freeze([0, 30, 90]), nK: 32, nT: 96 }),
  /** 丸めの床(同じ行の尺度 × 1e-12 —— 第340便d の DECL.floor と同じ) */
  floor: 1e-12,
});

/** 固定の比べる列(リポジトリの中の数 —— 合わせない。第338便d の宣言と LIT の写しではなく、その lib から読む) */
export const LIT = Object.freeze({
  note: '固定の比べる列(リポジトリの中の数 —— 文献の値・未照合・合わせない)',
  thick10m: RB.DECL.t1.ref10m, thickSrc: '第338便d の宣言の典型の厚み 10 m(文献の値・未照合 —— 同じ桁 = ⅓〜3 倍)',
  sameOrder: RB.DECL.t1.sameOrder, uniformPow: RB.DECL.t1.uniformPow, uniformSrc: '第338便d の一様の物差し(局所のべき abs(d ln H/d ln r) ≤ 0.1)',
  tYardYr: RB.DECL.t1.tYardYr, regionsSrc: '第338便d の LIT.regions(環の区分の縁 —— 文献の値・未照合)',
});

/* ───────── 場 ───────── */
const memo = (f) => { const M = new Map(); return (x) => { const k = x[0] + ',' + x[1] + ',' + x[2]; let v = M.get(k); if (!v) { v = f(x); M.set(k, v); } return v; }; };
/** 今の式の場(第340便d の fieldOmega —— A 1・場のべき 2) */
export function curField(kind, { mut = null } = {}) {
  if (!DECL.cur.includes(kind)) throw new RangeError('curField: 今の式は ' + DECL.cur.join('・'));
  const q = (kind === 'h1') !== (mut === 'curSwap') ? 1 : 0;
  return memo((x) => GP.fieldOmega(x, { q, p: DECL.curP }));
}
/** 候補の場(源 1 つ —— 静止・質量 1・半径 1・自転 s ẑ) */
export function candField(cand, { q, D0, s = 1, pw = DECL.pw, Rb = DECL.Rb, mut = null } = {}) {
  if (!DECL.cands.includes(cand)) throw new RangeError('candField: 候補は ' + DECL.cands.join('・'));
  if (!(fin(q) && q >= 0 && fin(D0) && D0 >= 0 && fin(s) && fin(Rb) && Rb > 0)) throw new RangeError('candField: q ≥ 0・D₀ ≥ 0・s・R_b > 0');
  const F = H.makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, s], r: [0, 0, 0], v: [0, 0, 0] }], D0, p: pw, q });
  return memo((x) => H.rotOf(cand, F, x, { e: unit(x), Rb, mut }).Om);
}
/** 候補の場(部位の和 —— 第340便d の spheroidParts。部位 j: 質量 m_j・位置 y_j・速度 ẑ × y_j・自転 ẑ・引きずり半径 partR) */
export function candFieldParts(cand, src, { q, D0, pw = DECL.pw, Rb = DECL.Rb, partR = DECL.B.partR } = {}) {
  if (!DECL.cands.includes(cand)) throw new RangeError('candFieldParts: 候補');
  const F = H.makeField({ sources: src.parts.map((pt) => ({ m: pt.m, R: partR, spin: [0, 0, 1], r: pt.y, v: crs([0, 0, 1], pt.y) })), D0, p: pw, q });
  return memo((x) => H.rotOf(cand, F, x, { e: unit(x), Rb }).Om);
}
export const zeroField = () => [0, 0, 0];

/* ───────── (A) 環の粒子の、赤道面へ寄せる向き ───────── */
/** 1 つの高さの寄せる力(正 = 赤道面へ —— 第340便d の pull)と中心の場の大きさ */
export function ringPull(field, { action, d, zOverR, body = 'ring', cubeK } = {}) {
  const g = GP.gyroRow({ action, q: 1, p: DECL.curP, body, zOverR, r: d, field, ...(cubeK ? { cubeK } : {}) });
  return { pull: g.pull, Fel: g.Fel, Fscale: g.Fscale, omC: nrm(field(g.rc.X)), farOverNear: nrm(g.Fnear) > 0 ? nrm(g.Ffar) / nrm(g.Fnear) : null };
}
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
/** 高さの格子 ±z の寄せる力から: 向き(両側とも寄せる/離す/混ざる/0)・z のべき(最初の 2 点)・向きが変わる高さの括り(正の側・負の側)・基準の高さの値 */
export function pullSummary(field, { action, d, zs, zRef = DECL.A.zRef }) {
  const pos = zs.map((z) => ringPull(field, { action, d, zOverR: z })), neg = zs.map((z) => ringPull(field, { action, d, zOverR: -z }));
  const all = pos.concat(neg).map((r) => r.pull), sg = all.map(sgn);
  const dir = sg.every((x) => x === 0) ? 'none' : sg.every((x) => x > 0) ? 'toward' : sg.every((x) => x < 0) ? 'away' : 'mixed';
  const bracket = (rows) => { for (let k = 1; k < rows.length; k++) { const a = sgn(rows[k - 1].pull), b = sgn(rows[k].pull); if (a !== 0 && b !== 0 && a !== b) return [zs[k - 1], zs[k]]; } return null; };
  const zPow = pos[0].pull !== 0 && pos[1].pull !== 0 ? Math.log(Math.abs(pos[1].pull / pos[0].pull)) / Math.log(zs[1] / zs[0]) : null;
  const kr = zs.indexOf(zRef), ref = kr >= 0 ? pos[kr] : null;
  return { action, d, dir, zPow, zStarPos: bracket(pos), zStarNeg: bracket(neg), pullRef: ref ? ref.pull : null, omRef: ref ? ref.omC : null,
    shapeRef: ref && ref.omC > 0 ? ref.pull / ref.omC : null, farOverNearRef: ref ? ref.farOverNear : null, pulls: pos.map((r) => r.pull), pullsNeg: neg.map((r) => r.pull) };
}
export function tableA() {
  const A = DECL.A, out = [];
  for (const kind of DECL.cur) { const field = curField(kind);
    for (const d of A.d) for (const action of A.actions) out.push(Object.assign({ col: kind, q: null, D0: null }, pullSummary(field, { action, d, zs: A.z }))); }
  for (const cand of DECL.cands) for (const q of DECL.q) for (const D0 of DECL.D0) {
    const field = candField(cand, { q, D0 }), ds = cand === 'V' ? A.vD : A.d, zs = cand === 'V' ? A.vZ : A.z;
    for (const d of ds) for (const action of A.actions) out.push(Object.assign({ col: cand, q, D0 }, pullSummary(field, { action, d, zs }))); }
  // 今の式の列(h₁)を基準にした比(同じ d・同じ作用・基準の高さ z/r 0.01 の 寄せる力 ÷ abs(Ω(中心)))
  for (const r of out) { const b = out.find((x) => x.col === 'h1' && x.d === r.d && x.action === r.action); r.vsH1 = b && b.shapeRef ? (r.shapeRef === null ? null : r.shapeRef / b.shapeRef) : null; }
  return out;
}

/* ───────── (B) 経路の比(扁平の源 ÷ 同じ物理の位置の球の源)───────── */
export function tableB() {
  const B = DECL.B, out = [], s0 = GP.spheroidParts(0), srcs = { 0: s0 };
  for (const f of B.f) srcs[f] = GP.spheroidParts(f);
  const tilt = (om) => GP.angleAtan2(om, [0, 0, -1]);
  const pos = (src, rr, z) => { const r = rr * src.Req, ce = Math.sqrt(1 - z * z); return { r, x: [r * ce, 0, r * z] }; };
  const pathOf = (field, r, z, action) => GP.gyroRow({ action, q: 1, p: DECL.curP, body: 'sphere', zOverR: z, r, field, cubeK: B.recvCubeK }).pull;
  const one = (col, q, D0, mk) => {
    const F = {}; for (const f of [0, ...B.f]) F[f] = mk(srcs[f]);
    for (const f of B.f) for (const rr of B.rOverReq) for (const z of B.z) {
      const { r, x } = pos(srcs[f], rr, z), a = F[f](x), b = F[0](x), ta = tilt(a), tb = tilt(b);
      const row = { col, q, D0, f, rOverReq: rr, zOverR: z, axisTilt: ta, axisTiltSphere: tb, axisTiltRatio: tb > 0 ? ta / tb : null, magRatio: nrm(b) > 0 ? nrm(a) / nrm(b) : null, path: null };
      if ((DECL.cur.includes(col) || B.pathCands.includes(col)) && B.fPath.includes(f)) { row.path = {};
        for (const ac of B.actions) { const pa = pathOf(F[f], r, z, ac), pb = pathOf(F[0], r, z, ac); row.path[ac] = { pull: pa, pullSphere: pb, ratio: pb ? pa / pb : null }; } }
      out.push(row);
    }
  };
  for (const kind of DECL.cur) one(kind, null, null, (src) => GP.spheroidField(src, kind, { p: DECL.curP }));
  for (const cand of B.tiltCands) for (const q of DECL.q) for (const D0 of DECL.D0) one(cand, q, D0, (src) => candFieldParts(cand, src, { q, D0 }));
  // (V) は 1 行だけ(求積 768 点 × 部位 960 点 —— 軸の傾きの比だけ)
  { const v = B.vRow, a = candFieldParts('V', srcs[v.f], { q: v.q, D0: v.D0 }), b = candFieldParts('V', s0, { q: v.q, D0: v.D0 }), { x } = pos(srcs[v.f], v.rOverReq, v.z), ta = tilt(a(x)), tb = tilt(b(x));
    out.push({ col: 'V', q: v.q, D0: v.D0, f: v.f, rOverReq: v.rOverReq, zOverR: v.z, axisTilt: ta, axisTiltSphere: tb, axisTiltRatio: tb > 0 ? ta / tb : null, magRatio: nrm(a(x)) / nrm(b(x)), path: null }); }
  return out;
}

/* ───────── (C) 土星の環の物差し ───────── */
export function saturnUnits() {
  const S = RB.srcOf('saturn'), tU = Math.sqrt(S.Robs * S.Robs * S.Robs / (RB.G * S.m));
  return { R: S.Robs, tU, sDim: S.s * tU, hBandM: RB.hBand(S) };
}
/** 点の受け手・corV の寄せる力(正 = 赤道面へ)を z/r の関数として */
const satPull = (field, r, zr) => GP.gyroRow({ action: 'corV', q: 1, p: DECL.curP, body: 'point', zOverR: zr, r, field }).pull;
export function satRow(field, key, U, { absK = true } = {}) {
  const C = DECL.C, rKm = RB.centerKm(key), r = rKm * 1e3 / U.R, n = Math.pow(r, -1.5), zs = C.zExp.map((e) => Math.pow(10, e));
  const pos = zs.map((z) => satPull(field, r, z)), neg = zs.map((z) => satPull(field, r, -z)), sg = pos.concat(neg).map(sgn);
  const dir = sg.every((x) => x === 0) ? 'none' : sg.every((x) => x > 0) ? 'toward' : sg.every((x) => x < 0) ? 'away' : 'mixed';
  let zStar = null;
  for (let k = 1; k < zs.length && zStar === null; k++) if (sgn(pos[k - 1]) !== 0 && sgn(pos[k]) !== 0 && sgn(pos[k - 1]) !== sgn(pos[k])) {
    let lo = Math.log(zs[k - 1]), hi = Math.log(zs[k]); const s0 = sgn(pos[k - 1]);
    for (let it = 0; it < C.bisect; it++) { const mid = 0.5 * (lo + hi); if (sgn(satPull(field, r, Math.exp(mid))) === s0) lo = mid; else hi = mid; }
    zStar = Math.exp(0.5 * (lo + hi));
  }
  const zk = C.zK, pk = satPull(field, r, zk), K = absK ? pk / (zk * r * n * n) : null;
  return { key, rKm, r, dir, K, zStar, Hstar: zStar === null ? null : 2 * zStar * r * U.R, HstarOver10m: zStar === null ? null : 2 * zStar * r * U.R / LIT.thick10m };
}
export function tableC() {
  const U = saturnUnits(), out = [];
  for (const kind of DECL.cur) { const field = curField(kind); for (const key of DECL.C.centers) out.push(Object.assign({ col: kind, q: null, D0: null }, satRow(field, key, U, { absK: false }))); }
  for (const cand of DECL.cands) for (const q of DECL.q) for (const D0 of DECL.D0) { const field = candField(cand, { q, D0, s: U.sDim });
    for (const key of DECL.C.centers) out.push(Object.assign({ col: cand, q, D0 }, satRow(field, key, U))); }
  // 輪の受け手(corS・drag90)—— 向きと括り(大きさは比べない)
  const ring = [], C = DECL.C, ringOf = (field, col, q, D0) => { for (const key of C.centers) { const r = RB.centerKm(key) * 1e3 / U.R;
    for (const action of C.ringActions) { const P = pullSummary(field, { action, d: r, zs: C.ringZ, zRef: -1 }), br = P.zStarPos;
      ring.push({ col, q, D0, key, action, dir: P.dir, zStarPos: br, zStarNeg: P.zStarNeg, HstarM: br ? [2 * br[0] * r * U.R, 2 * br[1] * r * U.R] : null }); } } };
  for (const kind of DECL.cur) ringOf(curField(kind), kind, null, null);
  for (const cand of C.ringCands) for (const q of DECL.q) for (const D0 of DECL.D0) ringOf(candField(cand, { q, D0, s: U.sDim }), cand, q, D0);
  return { units: U, rows: out, uniform: uniformOf(out), ring };
}
/** 帯が出た列の、隣の区分の中心どうしの局所のべき abs(d ln H* ÷ d ln r) の最大(第338便d の一様の物差し 0.1 と並べる) */
export function uniformOf(rows) {
  const keys = [...new Set(rows.map((r) => [r.col, r.q, r.D0].join('|')))], out = [];
  for (const k of keys) { const R = rows.filter((r) => [r.col, r.q, r.D0].join('|') === k && r.key !== 'ringF'); let m = null, nb = R.filter((r) => r.Hstar !== null).length;
    for (let i = 1; i < R.length; i++) if (R[i].Hstar !== null && R[i - 1].Hstar !== null) { const p = Math.abs(Math.log(R[i].Hstar / R[i - 1].Hstar) / Math.log(R[i].r / R[i - 1].r)); m = m === null ? p : Math.max(m, p); }
    out.push({ col: R[0].col, q: R[0].q, D0: R[0].D0, nBand: nb, nCenters: R.length, maxPow: m }); }
  return out;
}

/* ───────── (D) 自転しない源の通過と、環の粒子の輪 ───────── */
/** 輪の点が枠に運ばれる量(法線の向き)を方位で分ける。mut 'jNoT' は一次の項を Jᵀ でなく J で作る変異(零試験の対照) */
export function flyRing({ D0, Rr, inc, cands = DECL.cands, mut = null }) {
  const Dd = DECL.D, gl = H.gaussLegendre(Dd.nT), L = [Math.sin(inc * D2R), 0, Math.cos(inc * D2R)], e1 = [0, 1, 0], e2 = crs(L, e1);
  const pts = Array.from({ length: Dd.nK }, (_, k) => { const ph = 2 * Math.PI * k / Dd.nK; return { ph, xi: add(scl(e1, Rr * Math.cos(ph)), scl(e2, Rr * Math.sin(ph))) }; });
  const del = new Array(Dd.nK).fill(0), tan = new Array(Dd.nK).fill(0), intOm = Object.fromEntries(cands.map((c) => [c, [0, 0, 0]])); let intJL = [0, 0, 0], scale = 0;
  for (let i = 0; i < gl.x.length; i++) {
    const th = 0.5 * Math.PI * gl.x[i], t = (Dd.b / Dd.v) * Math.tan(th), wq = 0.5 * Math.PI * gl.w[i] * (Dd.b / Dd.v) / (Math.cos(th) * Math.cos(th));
    const rs = [Dd.v * t, Dd.b, 0], F = H.makeField({ sources: [{ m: 1, R: 1, spin: [0, 0, 0], r: rs, v: [Dd.v, 0, 0] }], D0, p: DECL.pw, q: 2 }), u0 = F.u([0, 0, 0]);
    scale += wq * nrm(u0);
    for (let k = 0; k < Dd.nK; k++) { const du = sub(F.u(pts[k].xi), u0), tk = crs(L, unit(pts[k].xi)); del[k] += wq * dot(du, L); tan[k] += wq * dot(du, tk); }
    const J = F.J([0, 0, 0]), JL = mut === 'jNoT' ? [J[0] * L[0] + J[1] * L[1] + J[2] * L[2], J[3] * L[0] + J[4] * L[1] + J[5] * L[2], J[6] * L[0] + J[7] * L[1] + J[8] * L[2]]
      : [J[0] * L[0] + J[3] * L[1] + J[6] * L[2], J[1] * L[0] + J[4] * L[1] + J[7] * L[2], J[2] * L[0] + J[5] * L[1] + J[8] * L[2]];   // (Jᵀ L̂)_b = Σ_a L_a ∂u_a/∂x_b
    intJL = add(intJL, scl(JL, wq));
    const e = unit(scl(rs, -1));
    for (const c of cands) intOm[c] = add(intOm[c], scl(H.rotOf(c, F, [0, 0, 0], { e, Rb: Rr }).Om, wq));
  }
  // 方位の分け: δ_k = a₀ + a₁ cos φ + b₁ sin φ + 残り
  const N = Dd.nK, a0 = del.reduce((s, x) => s + x, 0) / N, a1 = 2 * del.reduce((s, x, k) => s + x * Math.cos(pts[k].ph), 0) / N, b1 = 2 * del.reduce((s, x, k) => s + x * Math.sin(pts[k].ph), 0) / N;
  const rest = Math.sqrt(del.reduce((s, x, k) => { const y = x - a0 - a1 * Math.cos(pts[k].ph) - b1 * Math.sin(pts[k].ph); return s + y * y; }, 0) / N);
  const rot = tan.reduce((s, x) => s + x, 0) / N;   // 面の内の回り(接線の向きの平均)
  const tiltVec = add(scl(e1, a1 / Rr), scl(e2, b1 / Rr));   // 輪の面の傾き(δ = tiltVec · ξ)
  const JLp = sub(intJL, scl(L, dot(intJL, L)));   // 一次の項の傾き(Jᵀ L̂ の面の内の成分)
  // 丸めの床(輪の運ばれる量の尺度 ∫abs(u(中心)) dt × 1e-12 —— 長さ。傾きと角はそれを R_r で割った床)を 0 と書く(D₀ = 0 の一様の場の打ち消しの残り)
  const fl = DECL.floor * scale, fa = fl / Rr, sv = (x, t) => (Math.abs(x) <= t ? 0 : x), svv = (v, t) => (nrm(v) <= t ? [0, 0, 0] : v);
  const tiltS = svv(tiltVec, fa), JLs = svv(JLp, fa);
  const C = {}; for (const c of cands) { const W = svv(intOm[c], fa), pred = crs(L, W);   // 剛体の回転 ∫Ω dt が言う傾き: δ = L̂·(Ω × ξ) = (L̂ × Ω)·ξ
    C[c] = { tilt: sv(nrm(pred), fa), inPlane: sv(dot(W, L), fa), vsRing: nrm(tiltS) > 0 ? sv(nrm(pred), fa) / nrm(tiltS) : null, angDeg: nrm(tiltS) > 0 && nrm(pred) > fa ? GP.angleAtan2(pred, tiltS) / D2R : null }; }
  return { D0, Rr, inc, mean: sv(a0, fl), tilt: nrm(tiltS), tiltVec: tiltS, rest: sv(rest, fl), restOverRr: sv(rest, fl) / Rr, inPlane: sv(rot / Rr, fa), firstOrderTilt: nrm(JLs), firstOrderDiff: nrm(sub(tiltS, JLs)), cand: C, scale, floorLen: fl };
}
export function tableD() {
  const Dd = DECL.D, out = [];
  for (const D0 of Dd.D0) for (const Rr of Dd.Rr) for (const inc of Dd.inc) out.push(flyRing({ D0, Rr, inc }));
  return out;
}

/* ───────── 零試験(T5)───────── */
export function pureScenes() {
  const S = {}, A = DECL.A;
  // ① 今の式の列は第340便d の summaryRow(輪・h₁・p 2・r 1)と同じ数(同じ関数の同じ呼び方 —— 正本 tests/out/gyropath-340d.json との照合は QA)
  { const f = curField('h1'), fm = curField('h1', { mut: 'curSwap' }); let m = 0, mm = 0;
    for (const action of A.actions) { const ref = GP.summaryRow({ action, q: 1, p: DECL.curP, body: 'ring' });
      for (const z of ref.zs) { if (z.zOverR === 0) continue; const a = ringPull(f, { action, d: 1, zOverR: z.zOverR }).pull, b = ringPull(fm, { action, d: 1, zOverR: z.zOverR }).pull;
        m = Math.max(m, Math.abs(a - z.pull)); mm = Math.max(mm, Math.abs(b - z.pull)); } }
    S.curMatch = m; S.curSwapDiff = mm; }
  // ② 候補の回転 0 で円盤の側の変化 0(寄せる力・経路・土星の点)/変異: 一様の ẑ を入れると corV が 0 でない
  { let m = 0; for (const action of A.actions) for (const z of [0.01, -0.1]) m = Math.max(m, Math.abs(ringPull(zeroField, { action, d: 3, zOverR: z }).pull));
    const pathZ = Math.abs(GP.gyroRow({ action: 'corS', q: 1, p: DECL.curP, body: 'sphere', zOverR: 0.1, r: 2, field: zeroField, cubeK: 2 }).pull);
    S.zeroRot = m + pathZ; S.zeroRotMut = Math.abs(ringPull(() => [0, 0, 1], { action: 'corV', d: 3, zOverR: 0.01 }).pull); }
  // ③ q 0・D₀ 0 の組の極限: 場は剛体の回転(u = ẑ × r)→ (W)・(G)・(P6)・(V) の Ω = ẑ・(P2) = ẑ − ê(ê·ẑ)。一様の Ω では輪の corS・drag90 の寄せる力は 0
  { let m = 0, p2 = 0, rest = 0; const x = [3 * Math.cos(0.3), 0, 3 * Math.sin(0.3)], e = unit(x);
    for (const c of ['W', 'G', 'P6', 'V']) m = Math.max(m, nrm(sub(candField(c, { q: 0, D0: 0 })(x), [0, 0, 1])));
    p2 = nrm(sub(candField('P2', { q: 0, D0: 0 })(x), sub([0, 0, 1], scl(e, e[2]))));
    for (const c of ['W', 'G', 'P6']) for (const action of ['corS', 'drag90']) for (const z of [0.01, -0.03]) rest = Math.max(rest, Math.abs(ringPull(candField(c, { q: 0, D0: 0 }), { action, d: 3, zOverR: z }).pull));
    S.rigidOm = m; S.rigidP2 = p2; S.rigidPull = rest; }
  // ④ 経路の比: q 0・D₀ 0 では扁平でも場は同じ(剛体の回転)→ 軸の傾きの比 1
  { const s0 = GP.spheroidParts(0), s1 = GP.spheroidParts(0.3), x = [2 * s1.Req * Math.cos(0.1), 0, 2 * s1.Req * Math.sin(0.1)];
    const a = candFieldParts('W', s1, { q: 0, D0: 0 })(x), b = candFieldParts('W', s0, { q: 0, D0: 0 })(x); S.oblateRigid = nrm(sub(a, b)) / nrm(b); }
  // ⑤ (G) の回転は (W) と同じ(〔第347便h〕の rotOf の定義)
  { const fw = candField('W', { q: 2, D0: 0.1 }), fg = candField('G', { q: 2, D0: 0.1 }); let m = 0;
    for (const z of [0.01, -0.1]) for (const action of A.actions) m = Math.max(m, Math.abs(ringPull(fw, { action, d: 3, zOverR: z }).pull - ringPull(fg, { action, d: 3, zOverR: z }).pull)); S.gEqW = m; }
  // ⑥ 変異 (W) の符号: corV は Ω に線形 → 寄せる力の符号が反転
  { const fw = candField('W', { q: 2, D0: 0.1 }), fm = candField('W', { q: 2, D0: 0.1, mut: 'wsign' }), a = ringPull(fw, { action: 'corV', d: 3, zOverR: 0.01 }).pull, b = ringPull(fm, { action: 'corV', d: 3, zOverR: 0.01 }).pull;
    S.wsign = { a, b, flipDiff: Math.abs(a + b) / Math.abs(a) }; }
  // ⑦ 通過: D₀ = 0 では輪のどの点も同じだけ運ばれる(相対の量 0 —— 〔第347便h〕の「D₀ = 0 では 0」の円盤の側)/対照の D₀ 0.01 は 0 でない
  { const r0 = flyRing({ D0: 0, Rr: 1, inc: 30, cands: ['W'] }), rc = flyRing({ D0: 0.01, Rr: 1, inc: 30, cands: ['W'] }), sc = r0.scale + 1e-300;
    S.flyZero = (Math.abs(r0.mean) + r0.tilt + r0.rest) / sc; S.flyZeroW = (r0.cand.W.tilt + Math.abs(r0.cand.W.inPlane)) / sc; S.flyCtl = rc.tilt; }
  // ⑧ 通過・小さな輪(R_r 0.1): 傾き = ∫(Jᵀ L̂)_面 dt(一次の項 —— 差は R_r² の桁)/変異(J で作る)は離れる
  { const r = flyRing({ D0: 0.1, Rr: 0.1, inc: 30, cands: ['W'] }), rm = flyRing({ D0: 0.1, Rr: 0.1, inc: 30, cands: ['W'], mut: 'jNoT' });
    S.flyFirst = r.firstOrderDiff / r.firstOrderTilt; S.flyFirstMut = rm.firstOrderDiff / r.firstOrderTilt; }
  // ⑨ 入力の拒否
  const rej = [() => candField('X', { q: 2, D0: 0 }), () => candField('W', { q: -1, D0: 0 }), () => candField('W', { q: 2, D0: -0.1 }), () => curField('h2'),
    () => candFieldParts('Q', GP.spheroidParts(0), { q: 2, D0: 0 }), () => candField('W', { q: 2, D0: 0, Rb: 0 })].map((fn) => { try { fn(); return false; } catch (err) { return err instanceof RangeError; } });
  S.rejects = rej;
  return S;
}
export function pureGates(S) {
  return {
    curMatch: S.curMatch <= 1e-12 * S.curSwapDiff && S.curSwapDiff > 0,   // 同じ関数の同じ呼び方(丸めの床の内 —— 第338便c の ulp の揺らしでも閉じる物差し)
    zeroRot: S.zeroRot === 0 && S.zeroRotMut > 0,
    rigid: S.rigidOm < 1e-12 && S.rigidP2 < 1e-12 && S.rigidPull === 0,
    oblateRigid: S.oblateRigid < 1e-12,
    gEqW: S.gEqW <= 1e-12 * Math.abs(S.wsign.a),
    wsign: S.wsign.a !== 0 && S.wsign.flipDiff < 1e-12,
    flyZero: S.flyZero < 1e-12 && S.flyZeroW < 1e-12 && S.flyCtl > 0,
    flyFirst: S.flyFirst < 2e-2 && S.flyFirstMut > 0.1,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

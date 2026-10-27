// 第317便d(原仮定者の裁定(第119報)・決断事項 AN431〔G_loc の n = 2・1・0 × K1・K2〕・AN432〔トリトンの表の量〕・統括の検証項目 R253):
// **二体の解析の一次の率と、トリトンの離心率ベクトルの表の量の純関数**(html を読まない・走行しない —— 器 tests/exp-w317d-satan.mjs が既存の正本を読んで呼ぶ)。
//
// ■ 何をするか
//   ・二体の解析の一次の率(弱場の一次 —— 摂動の平均・1 公転あたりの近点の前進を ″/世紀へ): 種(第316便d の正本の T —— 近似要素の種・観測レコードではない)と
//     母惑星の凍結の写し tests/data-w306a-decl305.json の本の G_0・c_0 から、2 つの型で:
//       fc = 固定中心・試験粒子(母惑星は動かない・衛星の質量は衛星の R_d にだけ入る)
//       tb = 二体の質量の因子(両方が動き両方が受け手 —— 走行の器の q00・q10・q11 と同じ型の対照)
//     G_loc(n = 2 は law:"kappaC2"・n = 1 は law:"cRatio"・n = 0 は law:"cLocPow" の n:0 —— G_loc = G_0 e^(−2nψ)・ψ = G_0 m_j/(c_0² r) は相手だけ):
//       fc −2nπ G_0 M/(c_0² p)・tb −2nπ G_0 (M² + m²)/((M + m) c_0² p)(〔第305便b〕の analyticOf と同じ式)
//     K1(全天体 R_d = Y_k m —— 受け手の自己の場が分母の大半: β_ij = C_1 (m_j/m_i)(R_d,i/r) = C_1 Y_k m_j/r):
//       合成則は相対(s_i = Σ_j β_ij (v_j − v_i))なので相対運動は ẋ = (1 − β_s − β_p) v。並進 β = b/r の 1 公転の前進 πb/p(〔第312便a〕③ —— J_1 = 1)
//       fc π C_1 Y_k M/p・tb π C_1 Y_k (M + m)/p
//     K2(同じ半径 R_d = Y_k m —— 〔第312便a〕の K_α の族の α = 2: β_ij = C_2 (m_j/m_i)(R_d,i/r)² = C_2 Y_k² m_i m_j/r²・J_2 = 2):
//       fc 2π C_2 Y_k² M m/p²・tb 4π C_2 Y_k² M m/p²
//     1PN の式 q_1PN: fc 6π G_0 M/(c_0² p)・tb 6π G_0 (M + m)/(c_0² p)(〔第315便d〕refsOf と同じ式)
//   ・候補 Y_k(n) = (6 + 2n) G_0/(C_1 c_0²) の検算: fc では K1 の引きずり (6 + 2n)π G_0 M/(c_0² p) が G_loc の −2nπ G_0 M/(c_0² p) を足し戻し、
//     q11 − q00 = 6π G_0 M/(c_0² p) = q_1PN が n に依らない(**そろうのは q11 − q00 の一次の和** —— q11 − q10 と q10 − q00 は n で違う)。
//     tb では G_loc の質量の因子 (M² + m²)/(M + m) と引きずりの (M + m) が違うので、残り r = q11 − q00 − q_1PN = (2n/3)·Mm/(M + m)²·q_1PN(n = 0 だけ 0)。
//     K2 は R_d = Y m の形の係数では q_1PN の型(M/p)にならない(率 ∝ Y² M m/p² —— 要る R_d² = (3 + n) G_0 m p/(C_2 c_0²) が軌道の p と衛星の m に依る)。
//     **候補の検算であって普遍則として採らない**(法則の採用ではない —— 一次の式の代数)。
//   ・トリトンの表の量(AN432): 第316便d の正本の走行の行(公転ごとの平均の離心率ベクトル —— 慣性速度 S.v の接触の離心ベクトル AP.eccVector(r, v, μ = G(m_P + m_s))の、
//     衛星の t = 0 の軌道面の基底 P・Q の成分)から、差 q11 − q10 の大きさ・平行の成分(e の変化)・垂直の成分(と /e —— 近点の角の変化の参考)・
//     刻みの帯 h–h/2・h/2–h/4(ベクトルと成分)・比較の時刻(q10 の N 回目の公転の平均の時刻と、q11 − q10 の同じ窓の時刻の差)・種の離心率。
//     **近点を確定したことにしない**(近点の率は判定から外したまま —— 表の量を並べるだけ)。平行の成分の t = 0 の目安 β_rel(1 + e)(β_rel = 相対運動の並進の引きずりの係数の
//     t = 0 の値 —— 第315便d の正本の段 P の読み口 β)も並べる(観測の運動の分解〔initMotion:"observed"〕の後の同じ座標の状態から、慣性速度の接触の離心率がずれる量の目安)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」。近似要素の種を観測レコードと呼ばない。数値の帯は観測の 3σ ではない。
//   一次の式は摂動の平均(β の 2 乗・周期の項・太陽を落とす)。Y_k(n) は候補の検算(普遍則として採らない)。
import * as L from './lib-w315d-satk1.mjs';
import * as D from './lib-w312a-decay.mjs';
export const LIB_VERSION = 'w317d-satan-lib-1';
export const N_LIST = Object.freeze([2, 1, 0]);
export const KERNELS = Object.freeze(['K1', 'K2']);
export const MODES = Object.freeze(['fc', 'tb']);
/** G_loc の n と在位の鍵(既存の law —— 新しい law は足さない) */
export const GLOC_OF_N = Object.freeze({ 2: Object.freeze({ law: 'kappaC2' }), 1: Object.freeze({ law: 'cRatio' }), 0: Object.freeze({ law: 'cLocPow', n: 0 }) });
export const MODE_JA = Object.freeze({ fc: '固定中心・試験粒子', tb: '二体の質量の因子' });
export const CENTURY = 36525 * 86400, RAD2AS = 180 / Math.PI * 3600;
/** 定数: C_1 は閉じた式(本の Y_k と同じ —— lib-w315d-satk1 の C1)・C_2 は単位の球の受け手の体積平均の求積(lib-w312a-decay の coefC(2, 'exact'))・J_1 = 1・J_2 = 2(e に依らない) */
export function constsOf() {
  return { C1: L.C1, C1Closed: D.C1_CLOSED, C2: D.coefC(2, 'exact'), C2o8: D.coefC(2), J1: 1, J2: 2 };
}
/** Y_k(n) = (6 + 2n) G_0/(C_1 c_0²)(本の単位 —— n = 2 は本の Y_k = 10 G_0/(C_1 c_0²) と同じ演算の順) */
export const ykOfN = (n, G, c) => ((6 + 2 * n) * G) / (L.C1 * c * c);

/**
 * 種(本の単位)。T = 第316便d の正本の T.systems[k](SI)・P = 母惑星の凍結の写し(parentOf)。
 * M は凍結の写しの母惑星の質量(本の単位のまま)・m・a は SI から本の単位へ・周期は種の恒星周期。per = 1 公転あたりの rad を ″/世紀へ。
 */
export function seedOfT(T) {
  const P = L.parentOf(T.parent), G = P.physics.G, c = P.physics.cLight, Lm = Math.pow(10, L.UNITS.L), Mk = Math.pow(10, L.UNITS.M), Ts = Math.pow(10, L.UNITS.T);
  const M = P.planet.m, m = T.m / Mk, a = T.a / Lm, e = T.e, p = a * (1 - e * e), Pb = T.PDays * 86400 / Ts, per = CENTURY / Ts / Pb * RAD2AS;
  return { key: T.key, parent: T.parent, G, c, M, m, a, e, p, Pb, per, Lm, Mk, Ts, MSI: M * Mk, mSI: T.m, mOverM: m / M };
}
/** 1PN の式(fc・tb) */
export const q1pnOf = (s, mode) => 6 * Math.PI * s.G * (mode === 'fc' ? s.M : s.M + s.m) / (s.c * s.c * s.p) * s.per;
/** G_loc の一次(n) */
export const gLocOf = (n, s, mode) => -2 * n * Math.PI * s.G * (mode === 'fc' ? s.M : (s.M * s.M + s.m * s.m) / (s.M + s.m)) / (s.c * s.c * s.p) * s.per;
/** K1 の並進の引きずりの一次(全天体 R_d = Y m) */
export const k1Of = (Y, s, mode) => Math.PI * L.C1 * Y * (mode === 'fc' ? s.M : s.M + s.m) / s.p * s.per;
/** K2 の並進の引きずりの一次(同じ半径 R_d = Y m) */
export const k2Of = (Y, s, mode, C2) => (mode === 'fc' ? 2 : 4) * Math.PI * C2 * Y * Y * s.M * s.m / (s.p * s.p) * s.per;
/** 引きずりの一次(核の名で) */
export const dragOf = (kernel, Y, s, mode, C2) => (kernel === 'K1' ? k1Of(Y, s, mode) : k2Of(Y, s, mode, C2));
/** K2 で K1 の Y_k(n) と同じ引きずりの率(fc)を出すのに要る衛星の R_d(本の単位): R_d² = (3 + n) G_0 m p/(C_2 c_0²) */
export const rdK2NeededOf = (n, s, C2) => Math.sqrt((3 + n) * s.G * s.m * s.p / (C2 * s.c * s.c));

/**
 * 段 R(解析の一次の率の表 —— 引きずり係数は規則の Y_k = 10 G_0/(C_1 c_0²) のまま): 衛星 × n × 核 × 型(fc・tb)の
 * q10 − q00(G_loc)・q11 − q10(引きずり)・q11 − q00(和)・和/q_1PN。
 */
export function partR(Tsys, sats) {
  const C = constsOf(), out = { yk: '規則の Y_k = 10 G_0/(C_1 c_0²)(在位の K1 の rdRule:"kappaM" —— n に依らず固定)', systems: {} };
  for (const k of sats) {
    const s = seedOfT(Tsys[k]), Y = L.YkBook({ physics: { G: s.G, cLight: s.c } }), row = { seed: seedRow(s), YkSI: Y * s.Lm / s.Mk, q1pn: {}, byN: {} };
    for (const mode of MODES) row.q1pn[mode] = q1pnOf(s, mode);
    row.unitFc = row.q1pn.fc / 6;   // π G_0 M/(c_0² p) [″/世紀]
    for (const n of N_LIST) { row.byN[n] = {};
      for (const kern of KERNELS) { row.byN[n][kern] = {};
        for (const mode of MODES) { const g = gLocOf(n, s, mode), d = dragOf(kern, Y, s, mode, C.C2), q = row.q1pn[mode];
          row.byN[n][kern][mode] = { gLoc: g, drag: d, sum: g + d, sumOverQ1: (g + d) / q }; } } }
    out.systems[k] = row;
  }
  return out;
}
const seedRow = (s) => ({ parent: s.parent, M: s.MSI, m: s.mSI, mOverM: s.mOverM, a: s.a * s.Lm, e: s.e, p: s.p * s.Lm, PDays: s.Pb * s.Ts / 86400, G0: s.G, c0: s.c });

/**
 * 段 Y(候補 Y_k(n) = (6 + 2n) G_0/(C_1 c_0²) の検算): 衛星 × n で、K1 の引きずり(fc・tb)・和・q_1PN からの残り・tb の残りの閉じた式 (2n/3)·Mm/(M + m)²・
 * K2 で同じ率に要る R_d(fc)と規則の R_d = Y_k(n) m との比・R_d/m(衛星で違う —— 共通の係数にならない)。spread = n による違い(衛星ごと —— そろうか)。
 */
export function partY(Tsys, sats) {
  const C = constsOf(), out = { candidate: 'Y_k(n) = (6 + 2n) G_0/(C_1 c_0²)(n = 2 は規則の Y_k と同じ —— 候補の検算・普遍則として採らない)', systems: {} };
  for (const k of sats) {
    const s = seedOfT(Tsys[k]), q = { fc: q1pnOf(s, 'fc'), tb: q1pnOf(s, 'tb') }, Y2 = L.YkBook({ physics: { G: s.G, cLight: s.c } }), row = { byN: {}, spread: {} };
    for (const n of N_LIST) {
      const Y = ykOfN(n, s.G, s.c), z = { factor: (6 + 2 * n) / 10, YkSI: Y * s.Lm / s.Mk, sameAsRule: n === 2 ? Object.is(Y, Y2) : null };
      for (const mode of MODES) { const g = gLocOf(n, s, mode), d = k1Of(Y, s, mode), sum = g + d;
        z[mode] = { gLoc: g, drag: d, sum, r: sum - q[mode], rOverQ: (sum - q[mode]) / q[mode] }; }
      z.tb.rPred = (2 * n / 3) * s.M * s.m / ((s.M + s.m) * (s.M + s.m));
      const rd = rdK2NeededOf(n, s, C.C2);
      z.k2 = { RdNeeded: rd * s.Lm, RdRule: Y * s.m * s.Lm, ratio: rd / (Y * s.m), RdOverM: rd * s.Lm / (s.m * s.Mk) };
      row.byN[n] = z;
    }
    const span = (f) => { const xs = N_LIST.map((n) => f(row.byN[n])); const mx = Math.max(...xs), mn = Math.min(...xs); return { min: mn, max: mx, relSpread: (mx - mn) / Math.max(Math.abs(mx), Math.abs(mn)) }; };
    row.spread = { sumFc: span((z) => z.fc.sum), dragFc: span((z) => z.fc.drag), gLocFc: span((z) => z.fc.gLoc), sumTb: span((z) => z.tb.sum), rOverQTb: span((z) => z.tb.rOverQ) };
    row.q1pn = q;
    out.systems[k] = row;
  }
  // 衛星をまたいだ K2 の R_d/m の広がり(共通の係数にならないこと)
  out.k2RdOverM = Object.fromEntries(N_LIST.map((n) => { const xs = sats.map((k) => out.systems[k].byN[n].k2.RdOverM); return [n, { min: Math.min(...xs), max: Math.max(...xs), ratio: Math.max(...xs) / Math.min(...xs) }]; }));
  return out;
}

/**
 * 段 M(走行の二体との対照 —— n = 2・K1 だけが第316便d の正本にある): 窓 64 公転・模型 L・最も細かい刻みの q10 − q00・q11 − q10・q11 − q00 と、
 * 解析の一次(tb・規則の Y_k)の差・刻みの帯(h–h/2・h/2–h/4)・第315便d の参照の列(q_1PN − G_loc の解析)との差。差が帯の内かを並べる(判定ではない —— 対照)。
 */
export function partM(J316, Rpart, o = {}) {
  const N = o.N || Math.max(...J316.E.windows), M = o.model || 'L', ds = J316.E.divs.slice().sort((a, b) => a - b), f = ds[ds.length - 1], f2 = ds[ds.length - 2], f1 = ds[ds.length - 3];
  const out = { window: N, model: M, divs: ds.slice(), source: 'tests/out/sath-w316d.json の段 A(二体・模型 L)', systems: {} };
  for (const k of J316.E.sats) {
    const A = J316.A.systems[k + '|two'], z = A.models[M].byWin[N], a = Rpart.systems[k].byN[2].K1.tb, T = J316.T.systems[k];
    const pick = (key) => { const x = z.byDiv[f][key], x2 = z.byDiv[f2][key], x1 = f1 !== undefined ? z.byDiv[f1][key] : null;
      return { v: x, bands: [x1 !== null ? Math.abs(x2 - x1) : null, Math.abs(x - x2)] }; };
    const dG = pick('dG'), dDG = pick('dDG'), sum = { v: dG.v + dDG.v, bands: [0, 1].map((i) => (Number.isFinite(dG.bands[i]) && Number.isFinite(dDG.bands[i]) ? dG.bands[i] + dDG.bands[i] : null)) };
    const cmp = (meas, an) => { const d = meas.v - an, bm = Math.max(...meas.bands.filter(Number.isFinite)); return { meas: meas.v, an, diff: d, rel: d / Math.abs(an), bands: meas.bands, inBand: Math.abs(d) <= bm }; };
    out.systems[k] = { verdict316: A.verdict, determinedBy316: A.determinedBy.slice(), gLoc: cmp(dG, a.gLoc), drag: cmp(dDG, a.drag), sum: cmp(sum, a.sum),
      ref315: { dDGRef: T.dDGRef, diff: dDG.v - T.dDGRef, rel: (dDG.v - T.dDGRef) / Math.abs(a.drag) },
      r1pn: { meas: (sum.v - Rpart.systems[k].q1pn.tb) / Rpart.systems[k].q1pn.tb, an: a.sumOverQ1 - 1 } };
  }
  return out;
}

/**
 * 段 B(刻みの帯の次数の観察 —— 第316便d の正本の段 A〔模型 L〕の読み): 衛星 × 二体・三体 × 窓 N の近点 q11 − q10 の h・h/2・h/4 の値と
 * 帯の比 (h–h/2)/(h/2–h/4)(二次の積分器の漸近の領域なら ≈ 4)・同じ走行の q00 の近点の率(積分器の数値の歳差)の同じ比。判定ではない(観察)。
 */
export function partB(J316) {
  const ds = J316.E.divs.slice().sort((a, b) => a - b), out = { model: 'L', divs: ds.slice(), systems: {} };
  if (ds.length < 3) return out;
  const [d1, d2, d4] = ds.slice(-3), k12 = d1 + '-' + d2, k24 = d2 + '-' + d4;
  for (const k of J316.E.sats) for (const sys of J316.E.systems) {
    const o = J316.A.systems[k + '|' + sys]; if (!o) continue; const m = o.models.L, rows = [];
    for (const N of J316.E.windows) { const z = m.byWin[N]; if (!z) continue;
      const q00 = [d1, d2, d4].map((d) => z.byDiv[d].q00);
      rows.push({ N, dDG: [d1, d2, d4].map((d) => z.byDiv[d].dDG), band12: z.bands[k12], band24: z.bands[k24], ratio: z.bands[k12] / z.bands[k24],
        q00: q00, q00Ratio: (q00[0] - q00[1]) / (q00[1] - q00[2]) }); }
    out.systems[k + '|' + sys] = { rows, verdict316: o.verdict };
  }
  return out;
}

/* ───────── トリトンの表の量(AN432)───────── */
const rowOf = (J, specKey, sat, sys, kind, div) => { const r = J.E.rows[specKey({ sat, sys, kind, S: J.E.stepsPerOrbit, div, N: J.E.runN })]; return r && r.status === 'run' ? r : null; };
/** 1 つの刻みの N 回目の公転の差(q11 − q10): ベクトル・平行・垂直(q10 の平均のベクトルの向きで分ける) */
function diffAt(a, b, j) {
  const e10 = [a.evec.P[j], a.evec.Q[j]], e11 = [b.evec.P[j], b.evec.Q[j]], dE = [e11[0] - e10[0], e11[1] - e10[1]], en = Math.hypot(e10[0], e10[1]), u = [e10[0] / en, e10[1] / en];
  return { e10: en, e11: Math.hypot(e11[0], e11[1]), dE, mag: Math.hypot(dE[0], dE[1]), par: dE[0] * u[0] + dE[1] * u[1], perp: u[0] * dE[1] - u[1] * dE[0], tA: a.evec.t[j], tB: b.evec.t[j],
    phi10: Math.atan2(e10[1], e10[0]) };
}
/**
 * 段 V(AN432 の表の量 —— 衛星 sat〔既定トリトン〕の二体・三体 × 窓 N):
 *   e_seed・abs(ē_q10)・abs(Δe)・Δe∥・Δe⊥・Δe⊥/e・刻みの帯(ベクトル・平行・垂直の h–h/2・h/2–h/4)・比較の時刻(q10 の N 回目の公転の平均の時刻 [d]・q11 − q10 の同じ窓の
 *   時刻の差 [s])・解析の一次の Δe⊥/e の目安(tb・規則の Y_k の K1 の率 × 時刻)・平行の成分の t = 0 の目安 β_rel(1 + e_seed)。
 * Psys = 第315便d の正本の段 P(t = 0 の読み口の β —— 並び: 二体 [母惑星, 衛星]・三体 [太陽, 母惑星, 衛星])。
 */
export function tableQty(J316, Psys, Rpart, specKey, sat = 'triton') {
  const ds = J316.E.divs.slice().sort((a, b) => a - b), Ts = Math.pow(10, L.UNITS.T), T = J316.T.systems[sat], out = { sat, eSeed: T.e, systems: {} };
  for (const sys of J316.E.systems) {
    const rows = [], beta = betaRelOf(Psys[sat][sys], sys), rate = Rpart.systems[sat].byN[2].K1.tb.drag;
    for (const N of J316.E.windows) { const j = N - 1, z = {};
      for (const d of ds) { const a = rowOf(J316, specKey, sat, sys, 'q10', d), b = rowOf(J316, specKey, sat, sys, 'q11', d); if (a && b && a.evec && b.evec && a.evec.P.length > j && b.evec.P.length > j) z[d] = diffAt(a, b, j); }
      const f = ds[ds.length - 1], x = z[f]; if (!x) continue;
      const bandOf = (g) => { const b = []; for (let i = 1; i < ds.length; i++) { const p = z[ds[i - 1]], q = z[ds[i]]; b.push(p && q ? g(q, p) : null); } return b; };
      const bV = bandOf((q, p) => Math.hypot(q.dE[0] - p.dE[0], q.dE[1] - p.dE[1])), bPar = bandOf((q, p) => Math.abs(q.par - p.par)), bPerp = bandOf((q, p) => Math.abs(q.perp - p.perp));
      const dPhi = bandOf((q, p) => { let d = q.phi10 - p.phi10; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return Math.abs(d); });   // q10 の平均のベクトルの向きの刻みの差 [rad]
      const mx = (b) => Math.max(...b.filter(Number.isFinite)), tCy = x.tA * Ts / CENTURY;
      rows.push({ N, tDays: x.tA * Ts / 86400, dtSec: (x.tB - x.tA) * Ts, e10: x.e10, e11: x.e11, dE: x.mag, par: x.par, perp: x.perp, perpOverE: x.perp / x.e10, parOverE: x.par / x.e10,
        bandV: bV, bandPar: bPar, bandPerp: bPerp, dPhi10: dPhi, e10ByDiv: ds.map((d) => (z[d] ? z[d].e10 : null)), parByDiv: ds.map((d) => (z[d] ? z[d].par : null)), perpByDiv: ds.map((d) => (z[d] ? z[d].perp : null)), magOverBand: x.mag / mx(bV), parOverBand: Math.abs(x.par) / mx(bPar), perpOverBand: Math.abs(x.perp) / mx(bPerp),
        refPerpOverE: rate * tCy / RAD2AS, refPerp: rate * tCy / RAD2AS * x.e10, parRef: beta.rel * (1 + T.e) });
    }
    out.systems[sys] = { betaRel: beta, rows };
  }
  return out;
}
/** 相対運動の並進の引きずりの係数の t = 0 の値(読み口 β): 二体 β_s←p + β_p←s・三体はそれに β_s←☉ を足す(母惑星も太陽から同じ程度の β を受けるので相対の分は β_s←☉) */
export function betaRelOf(P, sys) {
  const b = P.bodies;
  if (sys === 'two') { const sp = b[1].beta[0], ps = b[0].beta[1]; return { sp, ps, sun: null, rel: sp + ps }; }
  const sp = b[2].beta[1], ps = b[1].beta[2], ssun = b[2].beta[0], psun = b[1].beta[0];
  return { sp, ps, sun: ssun, parentSun: psun, rel: sp + ps + ssun };
}
/** 6 衛星の二体の平行の成分と t = 0 の目安 β_rel(1 + e_seed)(窓 N・最も細かい刻み —— 第316便d の段 V の行) */
export function parOffsetAll(J316, Psys, N) {
  const out = { N, systems: {} };
  for (const k of J316.E.sats) for (const sys of J316.E.systems) {
    const v = J316.V.systems[k + '|' + sys]; if (!v) continue; const r = v.rows.find((z) => z.N === N); if (!r) continue;
    const b = betaRelOf(Psys[k][sys], sys), par = r.parOverE * r.e10, ref = b.rel * (1 + v.eSeed);
    out.systems[k + '|' + sys] = { e10: r.e10, par, band: r.band, betaRel: b.rel, ref, ratio: par / ref, diffOverBand: Math.abs(par - ref) / r.band };
  }
  return out;
}

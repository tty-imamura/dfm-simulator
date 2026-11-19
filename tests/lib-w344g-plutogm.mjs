// 第344便g(原仮定者の指示(2026-11-19 —— 第144報)「AN891: 中身を足して進める」・決断事項 AN807・AN822・AN885・統括の検証項目 R391):
//   **冥王星–カロン: 重力定数の出どころの追加の列(個別の重力定数の和・系の全体の値)を足し、接触の要素・平均の周期との並び・第341便g の 4 量・質量の比を 4 列で読む lib**
//   (診断だけ —— エンジン・内蔵の本・受理器・第343便g と第341便g の lib の本文は変えない。〔第343便g〕の表の数は変えず、列を足して並べる)。
//
// 重力定数の出どころ(4 列 —— km³/s²):
//   (1) repo        = リポジトリの値 975.4(〔第343便g〕の主の列 —— 丸め 0.1)
//   (2) csvDerived  = 状態の表の要素の行から逆に読んだ値(〔第343便g〕の比べる列 —— 元期ごと)
//   (3) kernelSum   = 個別の重力定数の和(冥王星 + カロン —— 2 体に使う和)
//   (4) kernelSystem = 系の全体の値(小さい衛星を含む —— 対照)
//   (3)(4) の数は「JPL/NAIF の衛星の暦 PLU060 のカーネルの注釈に印字されている定数」と伝えられた値 —— **文献の値・未照合**(この環境では一次資料と照合していない・
//   データの表 paper/data/ には足さない —— 宣言の入力〔ノブの列〕として使う)。印字の桁は精度ではない。
//
// T1 元期 2 × 4 列の接触の要素(〔第343便g〕の elementsOf を呼ぶ)。(3) の列を統括の参考の試作の表の数(a・e・周期 —— 印字の桁)と並べる。
// T2 接触の周期(その瞬間の要素から)と、平均の経度の進みから読む平均の周期(元期 A → B)は別の量 —— 差を並べる(「合った」と書かない)。2 つの元期の接触の周期の差。
// T3 e と近点の引数の 4 列(2 元期)。2 つの元期の e のそろい方。近点の引数の元期の差を年で割って歳差にしない(入力に無い量 —— AN885)。
// T4 〔第341便g〕の 4 量を 4 列で(〔第343便g〕の sysWith・fourOf を呼ぶ)。定義の差(+7.216805 s)の内訳を (3) の a と重力定数で作り直す(吸収しない)。
// T5 質量の比 q = カロン ÷ 冥王星(個別の重力定数から)と、〔第343便g〕の q(重心からの距離の比)。2 体のケプラーで元期 A → B の位置の差を 4 列で。
//
// **html を読まない**・ネットへ取りに行かない・乱数を使わない。3 値の判定は使わない(尺度の無い量を判定に入れない)。桁の幅を σ と書かない。
// 言わないこと: 重力定数が決まった・周期が合った・離心率が決まった。この解・この元期・この出どころの列では、の表。
import * as S343 from './lib-w343g-plutostate.mjs';
import * as P341 from './lib-w341g-plutocontrol.mjs';

export const LIB_VERSION = 'w344g-plutogm-lib-1';
const D2R = Math.PI / 180, DAY = 86400;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const wrap = (x) => { const t = x % (2 * Math.PI); return t < 0 ? t + 2 * Math.PI : t; };
const wrapPi = (x) => { const t = wrap(x); return t > Math.PI ? t - 2 * Math.PI : t; };

/* ───────── 宣言(走行の前 —— 走らせた列と判定の物差しの記録)───────── */
export const DECL = Object.freeze({
  csv: S343.DECL.csv,
  /** 重力定数の出どころの 4 列(ノブ「重力定数の出どころの追加の列(第344便g)」—— 状態は対照) */
  gmKeys: Object.freeze(['repo', 'csvDerived', 'kernelSum', 'kernelSystem']),
  gmKeys343: Object.freeze(['repo', 'csvDerived']),
  /** 文献の値・未照合(km³/s² —— 印字のまま。印字の桁は精度ではない) */
  gmPluto: 8.693261226311508e2, gmCharon: 1.061011388236118e2, gmSystem: 9.754308664317557e2,
  gmSrc: 'JPL/NAIF の衛星の暦 PLU060 のカーネルの注釈に印字されている定数、と伝えられた値 —— 文献の値・未照合(この環境では一次資料と照合していない・paper/data/ には足さない)',
  /** 同じ解の推定の値として伝えられた値(未照合 —— 共分散が無いので和の 1σ は空欄) */
  gmEst: Object.freeze({ pluto: 869.3, plutoPm: 0.4, charon: 106.1, charonPm: 0.3 }),
  /** 統括の参考の試作の表(個別の重力定数の和で作った接触の要素 —— 印字の桁。この器は自分のコードで作り直して並べる) */
  refTrial: Object.freeze([
    Object.freeze({ epoch: 'JD 2452600.5 TDB', aKm: 19595.761, e: 0.000161478, P: 551855.815 }),
    Object.freeze({ epoch: 'JD 2457217.5 TDB', aKm: 19595.764, e: 0.000160646, P: 551855.927 }),
  ]),
  refTrialDigits: Object.freeze({ aKm: 3, e: 9, P: 3 }),
  /** 判定の物差し(往復・〔第343便g〕の列への戻り) */
  roundTripTol: 1e-12, same343Tol: 1e-9,
});
export const gmSumOf = () => DECL.gmPluto + DECL.gmCharon;
export const qOfGM = () => DECL.gmCharon / DECL.gmPluto;

/** 元期ごとの 4 列の重力定数(〔第343便g〕の gmOf を呼ぶ) */
export function gmCols(LD, epoch) {
  const g = S343.gmOf(LD, epoch);
  return { repo: g.repo, csvDerived: g.csvDerived, kernelSum: gmSumOf(), kernelSystem: DECL.gmSystem };
}
const lamOf = (E) => wrap(E.node + E.peri + E.M);

/* ───────── T1: 元期 2 × 4 列の接触の要素 ───────── */
export function t1Table(LD) {
  const epochs = S343.DECL.epochs.map((ep) => {
    const rs = S343.relState(LD, ep), gm = gmCols(LD, ep), byGM = {};
    for (const k of DECL.gmKeys) {
      const E = S343.elementsOf(rs.r, rs.v, gm[k]), back = S343.stateOfElements(E, gm[k]);
      byGM[k] = { GM: gm[k], aKm: E.a, e: E.e, incDeg: E.inc / D2R, nodeDeg: E.node / D2R, periDeg: E.peri / D2R, MDeg: E.M / D2R, lamDeg: lamOf(E) / D2R, nDegDay: E.n / D2R * DAY, P: E.P,
        roundTrip: Math.max(nrm(sub(back.r, rs.r)) / nrm(rs.r), nrm(sub(back.v, rs.v)) / nrm(rs.v)) };
    }
    return { epoch: ep, relR: rs.r, relV: rs.v, byGM };
  });
  // (3) の列と統括の参考の試作の表(印字の桁で丸めた差 —— 印字の最後の桁の半分の内か)
  const ref = DECL.refTrial.map((t, i) => {
    const b = epochs[i].byGM.kernelSum, D = DECL.refTrialDigits, half = (d) => 0.5 * Math.pow(10, -d);
    return { epoch: t.epoch, aKm: b.aKm, aRef: t.aKm, aDiff: b.aKm - t.aKm, e: b.e, eRef: t.e, eDiff: b.e - t.e, P: b.P, PRef: t.P, PDiff: b.P - t.P,
      within: Math.abs(b.aKm - t.aKm) <= half(D.aKm) && Math.abs(b.e - t.e) <= half(D.e) && Math.abs(b.P - t.P) <= half(D.P) };
  });
  return { epochs, ref };
}

/* ───────── T2: 接触の周期と平均の周期(別の量)───────── */
export function t2Table(t1) {
  const [A, B] = t1.epochs, dt = (2457217.5 - 2452600.5) * DAY, rows = [];
  for (const k of DECL.gmKeys) {
    const a = A.byGM[k], b = B.byGM[k], nA = a.nDegDay * D2R / DAY, dLam = wrap((b.lamDeg - a.lamDeg) * D2R), N = Math.round((nA * dt - dLam) / (2 * Math.PI)), nBar = (dLam + 2 * Math.PI * N) / dt, PBar = 2 * Math.PI / nBar;
    rows.push({ key: k, PA: a.P, PB: b.P, PBar, nCycles: N, PAminusPBar: a.P - PBar, PBminusPBar: b.P - PBar, PBminusPA: b.P - a.P, relAminusBar: (a.P - PBar) / PBar });
  }
  const bars = rows.map((r) => r.PBar), spread = Math.max(...bars) - Math.min(...bars);
  return { dtDay: dt / DAY, rows, PBarSpread: spread, note: '接触の周期はその瞬間の要素の量・平均の周期は平均の経度の進みの量 —— 定義が違う(差を並べる・合ったとは言わない)' };
}

/* ───────── T3: e と近点の引数の 4 列 ───────── */
export function t3Table(t1) {
  const [A, B] = t1.epochs;
  const rows = DECL.gmKeys.map((k) => {
    const a = A.byGM[k], b = B.byGM[k];
    return { key: k, eA: a.e, eB: b.e, dE: b.e - a.e, dERel: (b.e - a.e) / a.e, periA: a.periDeg, periB: b.periDeg, dPeriDeg: wrapPi((b.periDeg - a.periDeg) * D2R) / D2R };
  });
  // GM に対する e の感度(元期 A の (3) の列のまわり —— 数値の差分。ほぼ円の軌道では v² r ÷ GM − 1 が e に入る)
  const rs = { r: A.relR, v: A.relV }, g0 = gmSumOf(), h = g0 * 1e-6;
  const de = (S343.elementsOf(rs.r, rs.v, g0 + h).e - S343.elementsOf(rs.r, rs.v, g0 - h).e) / (2 * h);
  return { rows, dEdGM_A: de, note: '近点の引数の元期の差は年で割らない(歳差として読まない —— 入力に無い量・AN885)' };
}

/* ───────── T4: 〔第341便g〕の 4 量を 4 列で・定義の差の作り直し ───────── */
export function t4Table(t1) {
  const cols = [{ key: 'w341g', inp: null }];
  for (const r of t1.epochs) for (const k of DECL.gmKeys) { const b = r.byGM[k]; cols.push({ key: r.epoch.replace(/^JD (\d+)\.5 TDB$/, 'ep$1') + '_' + k, inp: { aKm: b.aKm, e: b.e, P: b.P } }); }
  const rows = cols.map((c) => Object.assign({ key: c.key }, S343.fourOf(S343.sysWith(c.inp))));
  const G2 = P341.LIT.plutoCharonGM, pB = P341.DECL.pBuieS, per = (aKm, GMkm) => P341.periodOf(aKm * 1e3, GMkm * 1e9), gB = G2.buie / 1e9, aB = G2.aBuie / 1e3;
  const split = [{ key: 'w341g', aKm: G2.aPlu060Mean / 1e3, GM: G2.plu060 / 1e9 }]
    .concat(t1.epochs.flatMap((r) => DECL.gmKeys.map((k) => ({ key: r.epoch.replace(/^JD (\d+)\.5 TDB$/, 'ep$1') + '_' + k, aKm: r.byGM[k].aKm, GM: r.byGM[k].GM }))))
    .map((s) => ({ key: s.key, aKm: s.aKm, GM: s.GM, P: per(s.aKm, s.GM), total: per(s.aKm, s.GM) - pB, aPart: per(s.aKm, gB) - per(aB, gB), gmPart: per(s.aKm, s.GM) - per(s.aKm, gB) }));
  return { rows, split, pBuie: pB, defDiffS: P341.DECL.defDiffS };
}

/* ───────── T5: 質量の比と 2 体のケプラーの差 ───────── */
export function t5Table(LD, t1) {
  const q = S343.DECL.epochs.map((ep) => { const rs = S343.relState(LD, ep); return { epoch: ep, qPos: rs.qPos, qVel: rs.qVel, qGM: qOfGM(), dPos: rs.qPos - qOfGM(), dVel: rs.qVel - qOfGM() }; });
  const est = DECL.gmEst, qEst = est.charon / est.pluto;
  const [A, B] = t1.epochs, dt = (2457217.5 - 2452600.5) * DAY, kep = {};
  for (const k of DECL.gmKeys) {
    const GM = A.byGM[k].GM, E = S343.elementsOf(A.relR, A.relV, GM), s = S343.stateOfElements(Object.assign({}, E, { M: wrap(E.M + E.n * dt) }), GM);
    const d = sub(s.r, B.relR), rB = nrm(B.relR), hB = S343.elementsOf(B.relR, B.relV, GM).h, along = crs(hB, scl(B.relR, 1 / rB));
    kep[k] = { posDiffKm: nrm(d), radialKm: dot(d, scl(B.relR, 1 / rB)), alongKm: dot(d, along), normalKm: dot(d, hB), nOrbits: E.n * dt / (2 * Math.PI) };
  }
  return { qGM: qOfGM(), qEst, q, kep, note: '2 体のケプラー(小さい衛星・太陽の摂動・歳差を入れない)—— 差の内訳はこの入力からは分けない' };
}

/* ───────── 純関数の場面(門)───────── */
export function pureScenes() {
  // ① 和: 冥王星 + カロン = 975.4272614547626(浮動小数の和 —— 印字の和との差)
  const sum = gmSumOf(), sumDiff = Math.abs(sum - 975.4272614547626);
  // ② 系の全体 − 和 > 0(小さい衛星の分 —— 文献の値の差)
  const extra = DECL.gmSystem - sum;
  // ③ 往復: (3) の重力定数で要素 → 状態 → 要素
  const E0 = { a: 19595.76, e: 1.6e-4, inc: 96.2 * D2R, node: 223 * D2R, peri: 155 * D2R, M: 1 }, s0 = S343.stateOfElements(E0, sum), E1 = S343.elementsOf(s0.r, s0.v, sum);
  const rt = Math.max(Math.abs(E1.a / E0.a - 1), Math.abs(E1.e - E0.e) / E0.e, Math.abs(wrapPi(E1.node - E0.node)), Math.abs(wrapPi(E1.peri + E1.M - E0.peri - E0.M)));
  // ④ 重力定数を大きくすると同じ状態の a は小さく、周期は短くなる(向き)
  const Eh = S343.elementsOf(s0.r, s0.v, sum * (1 + 1e-5)), dir = Eh.a < E1.a && Eh.P < E1.P;
  // ⑤ q は和の分け方: q / (1 + q) × 和 = カロン
  const qSplit = Math.abs(qOfGM() / (1 + qOfGM()) * sum - DECL.gmCharon) / DECL.gmCharon;
  // ⑥ 入力の拒否(重力定数 0 は a か e が非有限)
  let rej = 0; const tries = [() => { const q = S343.elementsOf([1, 0, 0], [0, 1, 0], 0); if (!Number.isFinite(q.a) || !Number.isFinite(q.e)) throw new RangeError('GM'); },
    () => { const q = S343.elementsOf([1, 0, 0], [0, 1, 0], -1); if (!(q.a > 0) || !Number.isFinite(q.n)) throw new RangeError('GM<0'); }];
  for (const t of tries) { try { t(); } catch (e) { rej++; } }
  return { sumDiff, extra, roundTrip: rt, dir, qSplit, reject: { n: rej, of: tries.length } };
}
export function pureGates(P) {
  return { sum: P.sumDiff <= 1e-12, extra: P.extra > 0, roundTrip: P.roundTrip <= 1e-10, dir: P.dir === true, qSplit: P.qSplit <= 1e-14, reject: P.reject.n === P.reject.of };
}
export { S343 };

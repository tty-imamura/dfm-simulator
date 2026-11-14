// 第337便b(原仮定者の指示(2026-11-14 —— 第138報)「太陽の自転方向に対して、水星の公転は順回転。北側からと南側からの２回、赤道面を横切る。赤道面に近付くにつれて、引きずりで回転量が順方向に増す」
//   「並進引きずりと、回転引きずりの、それぞれの近点移動への影響を精査する」・探索の方針(第138報)・統括の検証項目 R338):
//   **水星の赤道帯の器 —— T1 赤道面を横切る幾何の表(水星・金星・地球・火星)/T2 寄与の分解(並進引きずりの動径・接線・和 = K1・並進の座標変換に入る源の回転・G_loc の次数 0・1・2・
//   第335便c の回転の列・赤道帯の候補)の一次の率を同じ行に・真近点角の 36 区間の効き/T3 赤道帯の回転の候補のノブの格子(作用の型 × 向き × H × q × p × 速さ)と判定の物差し 3 つ・
//   金星・地球・火星への持ち出し/T4 代表の候補の純粋な積分器(刻み 2 つ)と並進 × 帯の二次の結合**
//   (段 mercuryband-337b —— 正本 tests/out/mercuryband-337b.json・lib tests/lib-w337b-mercuryband.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib と器の本文は変えない。
//   **html を読まない**(来歴の対象は純関数 tests/lib-w337b-mercuryband.mjs —— 第335便f の型・入力のファイルは無い)。要素は第333便c の GEOM(JPL の近似要素・太陽の極 —— 文献の値)から積む。
// ■ 言わないこと: 表は候補・探索・未較正・このノブの組では。赤道帯の回転で水星の近点が出たとは書かない。暦表の幅は参考の尺度(観測の 1σ ではない・本環境では未照合)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { integrate3d, stateAt } from './lib-w333c-mercury3d.mjs';
import * as L from './lib-w337b-mercuryband.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337b-mercuryband-1';
export const OUT_MAIN = 'tests/out/mercuryband-337b.json';
export const TARGET = 'tests/lib-w337b-mercuryband.mjs';   // html を読まない器の来歴の対象(純関数)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { add, sub, scl, nrm, unit, dot } = L.vec;
const asec = L.asec;
const DEG = Math.PI / 180;
export const NOT_CLAIM = Object.freeze(['表は候補の一次の率と判定の物差しとの比(赤道帯の回転で水星の近点が出たとは書かない)',
  '赤道帯の候補は新しい場の仮定(宣言・未接続 —— 今のエンジンに無い)・採用ではない・未較正', '暦表の追加の歳差の幅は参考の尺度(観測の 1σ ではない —— 本環境では未照合)',
  '周期と離心率の物差しは宣言の物差し(文献の幅ではない)', '一次の率は無摂動の軌道の平均(写しの時間発展ではない)', '今の組(G_loc 受け手 n = 2 + K1)は凍結の基準・距離の変化の分は K1 に含まれている(別に足すと二重)',
  '測った数と対照(ノブ 0・引きずり OFF)は消さない —— 合わない列も残す']);
/** 器の宣言(走らせたもの —— 走行の後に足したものは AMEND に) */
export const PLAN = Object.freeze({
  decompKeys: Object.freeze(['transRadial', 'transTangent', 'transNormal', 'trans', 'k1', 'rot', 'gloc0', 'gloc1', 'gloc2', 'pair2jEquiv', 'cut', 't1phiVel', 't1tangentVel', 't1normalVel', 't1radialVel', 't1phiPush']),
  binKeys: Object.freeze(['transRadial', 'transTangent', 'trans', 'rot', 'gloc2', 't1phiVel']),
  /** 速さの列を両方走らせる型(rel は −w の項が s_* に比例しない —— 速さで形が変わる)。vel・push は観測自転だけ(J 等価は λ_B の尺度の換算) */
  speedRuns: Object.freeze({ vel: Object.freeze(['obs']), push: Object.freeze(['obs']), rel: Object.freeze(['obs', 'jEquiv']) }),
  /** 代表の候補の選び方(走行の後に足した規則 —— 結果を見て選ぶ): 置き換えの組「G_loc を候補で」(合う行がある組)と「接線の分を候補で」× 型ごとに、λ* で (iii) の比(ϖ・交点・周期・離心率)の最大が最小の行。
   *  積分器(T4)はそのうち 3 組(integOrder)・持ち出しは 6 組 */
  repRule: Object.freeze({ scenarios: Object.freeze(['gloc', 'tangent']), perType: true, by: 'max(ϖ・交点・周期・離心率の比)の最小 —— 符号は問わず記録', integOrder: Object.freeze(['gloc|vel', 'gloc|rel', 'tangent|vel', 'tangent|rel']),
    integSkip: 'H = R_d の帯(横切る時間は数秒)は刻み 2π/4000(約 1900 s)の RK4 で踏めない —— 積分器の列から外し、理由を正本に書く' }),
  controls: Object.freeze(['venus', 'earth', 'mars']),
});
/** 版の履歴(走行の後に足したもの —— 理由つき) */
export const AMEND = Object.freeze([
  '試走の後に足した型 rel(相対の速度 —— 帯の内で座標の速度 s_* ŝ × p へ寄せる: d = λ_B B (r_* / r)^p (s_* ŝ × p − w)): 速度の場 vel(順方向)の全部の組で水星の ω_W が負(近点を戻す)だったので、'
  + '並進引きずりの −w の項(K1 の型 —— 近点を進める)を帯で重み付けた型を比べる',
  '試走の後に足した向き inPlane(受け手の公転面へ射影): phi の型は L̂ を太陽の自転軸のまわりに大きく回し(交点の率が ϖ の率の 1/10 の桁)、交点の物差しを千倍の桁で外したので、面を動かさない型を比べる',
  '離心率の物差しの量を、離心率ベクトルの率の大きさ(面内の回転を含む)から離心率の率 de/dt に直した(初走は近点の回転の分を数えて全部の行で外していた)',
  '代表の候補の選び方を、置き換えの組「接線の分」だけから「G_loc」と「接線の分」の 2 組 × 型へ広げた(合う組のある組を積分器と持ち出しに入れる)',
  'H = R_d の帯の代表を積分器の列から外した(横切る時間は数秒で、刻み 2π/4000 の RK4 で踏めない —— 理由を正本の integ.skipped に)',
]);

/* ───────── 行と比 ───────── */
const ratesFull = (S, eff, segsH = null) => L.ratesOn(S.orb, eff, L.quadPoints(S, L.quadSegments(S, segsH)));
const rowFor = (S, key) => { const eff = L.contribEffect(S, key); return L.rowOf(S, ratesFull(S, eff, key === 'cut' ? L.kappaMRadius(S.M) : null)); };
const q1cyOf = (S) => asec(L.q1PNPerOrbit(S.orb.mu, S.orb.a, S.orb.e) / L.periodOf(S.orb));
const scaleOf = (key) => { const v = L.LIT.dvarpi[key], n = L.LIT.dnode[key]; return { varpi: v ? { v: v[0], w: v[1], scale: Math.abs(v[0]) + v[1] } : null, node: n ? { v: n[0], w: n[1], scale: Math.abs(n[0]) + n[1] } : null }; };
/** (iii) の比(1 以下が物差しの内)—— 候補の行 r(λ を掛けた値)と天体 S */
function ratiosOf(S, r, { varpiDev = null } = {}) {
  const sc = scaleOf(S.key), e = S.orb.e, radScale = sc.varpi.scale / 206264.80624709636;
  const vp = varpiDev !== null ? varpiDev : (r.ecl ? r.ecl.dvarpi : r.apsW);
  const node = r.ecl && sc.node ? Math.abs(r.ecl.dnode - sc.node.v) / sc.node.w : (r.sun ? Math.abs(r.sun.dnode) / sc.varpi.scale : null);
  return { varpi: Math.abs(vp - sc.varpi.v) / sc.varpi.w, node, period: r.lonDriftArcsec / sc.varpi.scale, ecc: Math.abs(r.decy) / (e * radScale) };
}
const scaleRow = (r, k) => ({ apsW: r.apsW * k, Lmag: Math.abs(k) * r.Lmag, decy: r.decy * k, deMagCy: Math.abs(k) * r.deMagCy, dlnAcy: r.dlnAcy * k, dlnPcy: r.dlnPcy * k, lonDriftArcsec: Math.abs(k) * r.lonDriftArcsec,
  ecl: r.ecl ? { di: r.ecl.di * k, dnode: r.ecl.dnode * k, dvarpi: r.ecl.dvarpi * k } : null, sun: r.sun ? { di: r.sun.di * k, dnode: r.sun.dnode * k, dvarpi: r.sun.dvarpi * k } : null, prec: r.prec * k, toward: r.toward * k });
const maxOf = (o) => Math.max(...Object.values(o).filter((x) => x !== null && Number.isFinite(x)));

/* ───────── T1 幾何 ───────── */
export function partGeometry() { return L.DECL.planets.map((k) => { const S = L.systemOfLit(k); return L.geometryOf(S, { bandH: S.Rsun }); }); }

/* ───────── T2 寄与の分解 ───────── */
export function partDecomp(S) {
  const rows = Object.fromEntries(PLAN.decompKeys.map((k) => [k, rowFor(S, k)])), q1 = q1cyOf(S);
  const clos = Math.abs(rows.transRadial.apsW + rows.transTangent.apsW + rows.transNormal.apsW - rows.trans.apsW) / Math.abs(rows.trans.apsW);
  const sums = [
    { key: 'now', label: '今の組: G_loc n = 2 + K1(凍結の基準)', cols: ['gloc2', 'k1'] },
    { key: 'nowSplit', label: 'G_loc n = 2 + 動径の分 + 接線の分(K1 を分けて —— 同じ値)', cols: ['gloc2', 'transRadial', 'transTangent'] },
    { key: 'double', label: '否定対照(二重): 今の組 + 動径の分', cols: ['gloc2', 'k1', 'transRadial'], negative: true },
    { key: 'gloc1k1', label: 'G_loc n = 1 + K1', cols: ['gloc1', 'k1'] },
    { key: 'gloc0k1', label: 'G_loc n = 0 + K1(= K1 だけ)', cols: ['gloc0', 'k1'] },
    { key: 'nowRot', label: '今の組 + 並進の座標変換に入る源の回転', cols: ['gloc2', 'k1', 'rot'] },
  ].map((c) => { const a = c.cols.reduce((t, k) => t + rows[k].apsW, 0); return { ...c, apsW: a, overQ: a / q1 }; });
  return { q1cy: q1, rows, closure: clos, transOverK1: rows.trans.apsW / rows.k1.apsW, sums };
}
/* ───────── 区間 ───────── */
export function partBins(S, extra = []) {
  const one = (key, eff) => { const B = L.binTable(S, eff), near = (k0) => [k0 - 1, k0, k0 + 1].map((x) => (x + L.DECL.nBins) % L.DECL.nBins), share = (ks) => [...new Set(ks)].reduce((t, k) => t + Math.abs(B.per[k].apsW), 0) / B.gross;
    return { key, perBin: B.per.map((q) => asec(q.apsW)), sum: asec(B.sum), gross: asec(B.gross), netOverGross: B.netOverGross, marks: B.marks,
      shares: { peri: share(near(B.marks.peri)), apo: share(near(B.marks.apo)), nodes: share([...near(B.marks.asc), ...near(B.marks.desc)]) } }; };
  return PLAN.binKeys.map((k) => one(k, L.contribEffect(S, k))).concat(extra.map((x) => one(x.key, x.eff)));
}

/* ───────── T3 赤道帯の候補の格子 ───────── */
function specList() {
  const B = L.DECL.band, out = [];
  for (const type of B.types) for (const speed of PLAN.speedRuns[type]) for (const dir of B.dirs) for (const H of B.H) for (const q of B.q) for (const p of B.p) out.push({ type, speed, dir, H, q, p });
  return out;
}
export const specKey = (s) => `${s.type}|${s.speed}|${s.dir}|${s.H.kind}${s.H.mult}|q${s.q}|p${s.p}`;
/** 1 行(λ_B = 1 の係数)—— 点の一覧は H ごとに使い回す */
function scanRow(S, spec, ptsCache) {
  const Hf = L.bandH(S, spec.H), hk = spec.H.kind + spec.H.mult;
  if (!ptsCache.has(hk)) ptsCache.set(hk, L.quadPoints(S, L.quadSegments(S, Hf(S.orb.a))));
  return L.rowOf(S, L.ratesOn(S.orb, L.bandEffect(S, { ...spec, lambda: 1 }), ptsCache.get(hk)));
}
export function partScan(S, D) {
  const sc = scaleOf(S.key), q1 = D.q1cy, list = specList(), cache = new Map(), R = D.rows;
  const keepSum = (keep) => keep.reduce((t, k) => t + R[k].apsW, 0);
  const sJ = L.bandSpeed(S, 'jEquiv') / S.sSun;
  const rows = list.map((spec) => {
    const u = scanRow(S, spec, cache), kv = u.ecl.dvarpi, kn = u.ecl.dnode;
    // (i) 今の組 + 候補の黄道の ϖ が [値 ± 幅] に入る λ の範囲(と交点も同時)
    const rng = (k, lo, hi) => (k === 0 ? null : [Math.min(lo / k, hi / k), Math.max(lo / k, hi / k)]);
    const rV = rng(kv, sc.varpi.v - sc.varpi.w, sc.varpi.v + sc.varpi.w), rN = rng(kn, sc.node.v - sc.node.w, sc.node.v + sc.node.w);
    const both = rV && rN ? [Math.max(rV[0], rN[0]), Math.min(rV[1], rN[1])] : null;
    // (ii)(iii) 置き換えの組
    const rep = L.DECL.replace.map((c) => { const need = q1 - keepSum(c.keep), lam = need / u.apsW, r = scaleRow(u, lam), dev = r.ecl.dvarpi - r.apsW;
      const ra = ratiosOf(S, r, { varpiDev: dev }); return { lambda: lam, prograde: lam > 0, ratios: ra, max: maxOf(ra), match: lam > 0 && maxOf(ra) <= 1 }; });
    return { key: specKey(spec), spec, unit: { apsW: u.apsW, eclVarpi: kv, eclNode: kn, sunNode: u.sun.dnode, Lmag: u.Lmag, decy: u.decy, deMagCy: u.deMagCy, dlnAcy: u.dlnAcy, lonDriftArcsec: u.lonDriftArcsec, breaks: u.breaks },
      lamVarpi: rV, lamVarpiNode: both && both[0] <= both[1] ? both : null, replace: rep };
  });
  const lambdaScaleJ = { vel: 1 / sJ, push: 1 / (sJ * sJ), rel: null };
  // 集計: 置き換えの組ごとに λ > 0 の行の数・(iii) を全部満たす行の数・量ごとに満たす行の数
  const summary = L.DECL.replace.map((c, i) => { const rs = rows.map((r) => r.replace[i]);
    const cnt = (f) => rs.filter(f).length;
    return { key: c.key, label: c.label, need: q1 - keepSum(c.keep), rows: rs.length, prograde: cnt((q) => q.prograde), match: cnt((q) => q.match),
      pass: { varpi: cnt((q) => q.ratios.varpi <= 1), node: cnt((q) => q.ratios.node <= 1), period: cnt((q) => q.ratios.period <= 1), ecc: cnt((q) => q.ratios.ecc <= 1) },
      passNodePeriod: cnt((q) => q.ratios.node <= 1 && q.ratios.period <= 1 && q.ratios.varpi <= 1), progradeNodePeriod: cnt((q) => q.prograde && q.ratios.node <= 1 && q.ratios.period <= 1 && q.ratios.varpi <= 1),
      minEccRatioPassOthers: Math.min(...rs.filter((q) => q.ratios.node <= 1 && q.ratios.period <= 1 && q.ratios.varpi <= 1).map((q) => q.ratios.ecc), 1e300),
      minEccRatioProgradePassOthers: Math.min(...rs.filter((q) => q.prograde && q.ratios.node <= 1 && q.ratios.period <= 1 && q.ratios.varpi <= 1).map((q) => q.ratios.ecc), 1e300) }; });
  // 型ごとの符号(順方向の λ で ω_W > 0 の行の数)
  const signs = L.DECL.band.types.map((t) => { const rs = rows.filter((r) => r.spec.type === t); return { type: t, rows: rs.length, positive: rs.filter((r) => r.unit.apsW > 0).length }; });
  return { q1cy: q1, scale: sc, speedRatioJ: sJ, lambdaScaleJ, rows, summary, signs };
}
/** 代表の候補(PLAN.repRule —— 置き換えの組 × 型ごとに (iii) の比の最大が最小の行。符号は問わず記録) */
export function pickReps(scan) {
  const out = [];
  for (const sc of PLAN.repRule.scenarios) { const i = L.DECL.replace.findIndex((c) => c.key === sc), keep = L.DECL.replace[i].keep;
    for (const t of L.DECL.band.types) { const rs = scan.rows.filter((r) => r.spec.type === t);
      const best = rs.reduce((b, r) => (r.replace[i].max < b.replace[i].max ? r : b), rs[0]);
      out.push({ scenario: sc, keep, type: t, key: best.key, spec: best.spec, lambda: best.replace[i].lambda, prograde: best.replace[i].prograde, ratios: best.replace[i].ratios, max: best.replace[i].max, match: best.replace[i].match }); } }
  return out;
}
/** 順方向(λ > 0)の中で同じ規則の最良の行(型ごと —— 記録だけ・積分しない) */
export function pickPrograde(scan) {
  return L.DECL.replace.map((c, i) => ({ scenario: c.key, perType: L.DECL.band.types.map((t) => { const rs = scan.rows.filter((r) => r.spec.type === t && r.replace[i].prograde);
    if (!rs.length) return { type: t, key: null };
    const b = rs.reduce((x, r) => (r.replace[i].max < x.replace[i].max ? r : x), rs[0]); return { type: t, key: b.key, lambda: b.replace[i].lambda, ratios: b.replace[i].ratios, max: b.replace[i].max }; }) }));
}
/** 置き換えの組で合う行(全部)—— 型・向き・H・q・p の分布 */
export function matchList(scan) {
  return L.DECL.replace.map((c, i) => ({ scenario: c.key, rows: scan.rows.filter((r) => r.replace[i].match).map((r) => ({ key: r.key, lambda: r.replace[i].lambda, ratios: r.replace[i].ratios })) }));
}
/* ───────── 持ち出し(金星・地球・火星 —— 同じノブ・同じ λ_B・同じ置き換えの組)───────── */
export function partCarry(reps) {
  return PLAN.controls.map((k) => { const S = L.systemOfLit(k), q1 = q1cyOf(S), cache = {}, keepRow = (c) => (cache[c] = cache[c] || rowFor(S, c));
    return { key: k, ja: S.ja, q1cy: q1, scale: scaleOf(k), reps: reps.map((rp) => { const r = scaleRow(L.rowOf(S, ratesFull(S, L.bandEffect(S, { ...rp.spec, lambda: 1 }), L.bandH(S, rp.spec.H)(S.orb.a))), rp.lambda);
      const keepSum = rp.keep.reduce((t, c) => t + keepRow(c).apsW, 0), total = keepSum + r.apsW, dev = total - q1 + (r.ecl ? r.ecl.dvarpi - r.apsW : 0);
      const ra = ratiosOf(S, r, { varpiDev: dev });
      return { scenario: rp.scenario, key: rp.key, type: rp.type, bandApsW: r.apsW, keepApsW: keepSum, totalOverQ: total / q1, varpiDev: dev, eclNode: r.ecl ? r.ecl.dnode : null, sunNode: r.sun.dnode, decy: r.decy, lonDriftArcsec: r.lonDriftArcsec, ratios: ra, max: maxOf(ra) }; }) }; });
}
/* ───────── T4 純粋な積分器 ───────── */
export function partInteg(S, reps) {
  const orb0 = { a: 1, e: S.orb.e, mu: 1, P: S.orb.P, Q: S.orb.Q, W: S.orb.W }, Pd = L.periodOf(S.orb), IG = L.DECL.integ;
  const cand = PLAN.repRule.integOrder.map((k) => reps.find((r) => r.scenario + '|' + r.type === k)).filter(Boolean), pick = cand.filter((r) => r.spec.H.kind !== 'Rd').slice(0, IG.maxReps);
  const skipped = cand.filter((r) => r.spec.H.kind === 'Rd').map((r) => ({ scenario: r.scenario, key: r.key, why: PLAN.repRule.integSkip }));
  return { skipped, rows: pick.map((rp) => {
    const first = L.rowOf(S, ratesFull(S, L.bandEffect(S, { ...rp.spec, lambda: rp.lambda }), L.bandH(S, rp.spec.H)(S.orb.a)));
    const U = L.unitBand(S, { ...rp.spec, lambda: rp.lambda });
    const runs = IG.steps.map((st) => { const t0 = Date.now(), R = integrate3d({ orb0, velX: U.velX, accelX: U.accelX, pole: S.sunAxis, stepsPerOrbit: st, nOrb: IG.nOrb });
      return { steps: st, apsCy: asec(R.aps / Pd), dlnAcy: R.dlnA / Pd * L.CENTURY_S, wallSec: (Date.now() - t0) / 1000 }; });
    const ref = runs[runs.length - 1];
    return { scenario: rp.scenario, key: rp.key, type: rp.type, lambda: rp.lambda, firstApsW: first.apsW, firstDlnAcy: first.dlnAcy, runs, relDiff: Math.abs(ref.apsCy - first.apsW) / Math.abs(first.apsW), stepSpread: Math.abs(runs[0].apsCy - ref.apsCy) / Math.abs(first.apsW) };
  }) };
}
/* ───────── 二次の結合(並進 × 帯 —— 速度の型の代表)───────── */
export function partMix(S, reps) {
  const rp = reps.find((r) => r.scenario + '|' + r.type === PLAN.repRule.integOrder[0]); if (!rp) return null;
  const MX = L.DECL.mix, n = L.nOf(S.orb), Pd = L.periodOf(S.orb), orb0 = { a: 1, e: S.orb.e, mu: 1, P: S.orb.P, Q: S.orb.Q, W: S.orb.W };
  const first = L.ratesOn(S.orb, L.bandEffect(S, { ...rp.spec, lambda: rp.lambda }), L.quadPoints(S, L.quadSegments(S, L.bandH(S, rp.spec.H)(S.orb.a))));
  const perOrbitReal = Math.abs(first.apsW) * Pd, amp = MX.xPerOrbit / perOrbitReal;
  const betaA = (() => { const e = L.contribEffect(S, 'trans'), st = stateAt(S.orb, 0); return nrm(e.d(st.x, st.v)) / nrm(st.v) * nrm(st.x) / S.orb.a; })();
  const runs = [];
  for (const st of MX.steps) for (const no of MX.nOrb) { const U = L.unitBand(S, { ...rp.spec, lambda: rp.lambda }, amp); runs.push({ steps: st, nOrb: no, ...L.mixingBand({ orb0, sHat: S.sunAxis, cT: MX.cT, bandVelX: U.velX, stepsPerOrbit: st, nOrb: no }) }); }
  const ref = runs.find((q) => q.steps === MX.steps[1] && q.nOrb === MX.nOrb[1]), spread = Math.max(...runs.map((q) => Math.abs(q.mix - ref.mix)));
  const dbl = L.mixingBand({ orb0, sHat: S.sunAxis, cT: MX.cT, bandVelX: L.unitBand(S, { ...rp.spec, lambda: rp.lambda }, 2 * amp).velX, stepsPerOrbit: MX.steps[1], nOrb: MX.nOrb[1] });
  const resolved = Math.abs(ref.mix) > MX.resolveFactor * spread, bilin = dbl.mix / ref.mix, real = ref.mix / (MX.cT * amp) * betaA;
  return { scenario: rp.scenario, key: rp.key, amp, cT: MX.cT, betaA, runs: runs.map((q) => ({ steps: q.steps, nOrb: q.nOrb, mix: q.mix, partner: q.partner, trans: q.trans })), mixRef: ref.mix, numSpread: spread, resolved, bilinRatio: bilin,
    bilinOk: resolved ? Math.abs(bilin - 2) <= 2 * MX.bilinTol : null, realArcsecCy: resolved ? asec(real / Pd) : null, firstArcsecCy: asec(first.apsW), n };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = J.mercury.decomp, G = J.geometry, sc = J.mercury.scan;
  const now = D.sums.find((q) => q.key === 'now'), split = D.sums.find((q) => q.key === 'nowSplit'), dbl = D.sums.find((q) => q.key === 'double');
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    heightRatio: G.every((g) => Math.abs(g.heightRatio - g.heightRatioExpect) <= 1e-12 * g.heightRatioExpect),
    transIsK1: Math.abs(D.transOverK1 - 1) <= 1e-5 && D.closure <= 1e-9 && Math.abs(split.overQ - now.overQ) <= 1e-5,
    nowIs1PN: Math.abs(now.overQ - 1) <= 1e-3,
    doubleFlagged: dbl.negative === true && Math.abs(dbl.overQ - now.overQ) > 0.5,
    glocZero: D.rows.gloc0.apsW === 0 && D.rows.gloc0.Lmag === 0,
    scanGrid: sc.rows.length === L.DECL.band.dirs.length * L.DECL.band.H.length * L.DECL.band.q.length * L.DECL.band.p.length * Object.values(PLAN.speedRuns).reduce((t, a) => t + a.length, 0),
    binSum: J.mercury.bins.every((b) => Math.abs(b.sum - (b.key in D.rows ? D.rows[b.key].apsW : b.sum)) <= 1e-8 * Math.max(Math.abs(b.gross), 1e-30)),
    integ: J.mercury.integ.rows.length >= 1 && J.mercury.integ.rows.every((q) => q.relDiff <= 0.05 && q.stepSpread <= 1e-6),
    mix: J.mercury.mix === null || J.mercury.mix.bilinOk !== false,
    carry: J.carry.length === PLAN.controls.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const geometry = partGeometry(); mark('geometry');
  const S = L.systemOfLit('merc');
  const decomp = partDecomp(S); mark('decomp');
  const scan = partScan(S, decomp); mark('scan');
  const reps = pickReps(scan), prograde = pickPrograde(scan), matches = matchList(scan);
  const repRows = reps.map((rp) => ({ scenario: rp.scenario, key: rp.key, type: rp.type, lambda: rp.lambda, row: L.rowOf(S, ratesFull(S, L.bandEffect(S, { ...rp.spec, lambda: rp.lambda }), L.bandH(S, rp.spec.H)(S.orb.a))) }));
  const bins = partBins(S, reps.filter((rp) => rp.spec.H.kind !== 'Rd' && rp.type !== 'push').map((rp) => ({ key: 'band:' + rp.scenario + ':' + rp.key, eff: L.bandEffect(S, { ...rp.spec, lambda: rp.lambda }) }))); mark('bins');
  const carry = partCarry(reps); mark('carry');
  const integ = partInteg(S, reps); mark('integ');
  const mix = partMix(S, reps); mark('mix');
  const geom = { a: S.orb.a, e: S.orb.e, sSun: S.sSun, sJ: L.bandSpeed(S, 'jEquiv'), Rsun: S.Rsun, Rd: L.kappaMRadius(S.M), period: L.periodOf(S.orb) };
  const J = { geom, pure, geometry, mercury: { decomp, scan, reps, prograde, matches, repRows, bins, integ, mix }, carry, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337B_OUT ? (path.isAbsolute(process.env.W337B_OUT) ? process.env.W337B_OUT : path.join(ROOT, process.env.W337B_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便b mercuryband(版 ' + HARNESS_VERSION + ')');
  // 走らせたノブの格子と判定の物差しを正本の先頭に(式の形の宣言ではなく、何を測ったかの記録)
  const head = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337b-mercuryband.mjs', target: TARGET,
    ruling: '原仮定者の指示(2026-11-14 —— 第138報)「赤道面に近付くにつれて、引きずりで回転量が順方向に増す」「並進引きずりと、回転引きずりの、それぞれの近点移動への影響を精査する」・探索の方針(第138報)・統括の検証項目 R338',
    yardstick: L.DECL.yardstick, decl: L.DECL, plan: PLAN, amend: AMEND, literature: L.LIT, notClaim: NOT_CLAIM };
  const R = runAll();
  const out = { ...head, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w337b-mercuryband.mjs', 'tests/lib-w337b-mercuryband.mjs', 'tests/lib-w335c-mercurycombo.mjs', 'tests/lib-w334c-mercurynode.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w332a-eqband.mjs',
    'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便b', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'mercuryband', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 一次の率と自前の RK4)', notClaim: NOT_CLAIM });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

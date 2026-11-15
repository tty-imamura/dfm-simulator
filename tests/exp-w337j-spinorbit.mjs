// 第337便j(原仮定者の補足(2026-11-15 —— 第138報の補足 5)・統括の検証項目 R346):
//   **T1 軸引きずりの 2 つの読みを主星にロックしていない天体(地球・火星・冥王星・コンパクト天体 + 比べる行の木星・土星・天王星・海王星・銀河の中の太陽)で比べる・
//   T2 回転引きずりの方位の作用の型の公転の速さと半長軸の率を n/s の関数で読み、源の自転の半分より速く公転するもの/遅いものの観測の公転の変化と符号を照らす(強さ λ の 3 つの読み)・
//   T3 一様厚みの型の候補(統括の参考の試作の型を 1 表に —— 帯の幅を厚みと読む型・源の取り分で重みを付けた T1・場と重力の鉛直の速さが等しい高さ)**
//   (段 spinorbit-337j —— 正本 tests/out/spinorbit-337j.json・lib tests/lib-w337j-spinorbit.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第337便i までの lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337j-spinorbit.mjs —— 領域の宣言なし)。入力の正本は第337便a の tests/out/supply-337a.json の 1 本
//   (天体の観測の自転と向き・銀河の角運動量の向き L̂・背景軸引きずり ω_bg・金星で釣り合う背景慣性決定力 W₀ の読みごとの解)。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 読み 2(背景が静止・今の並進の式の形)× 背景軸引きずりの置き方 2(第337便a の主の共有/今の形の読みでは銀河 → 太陽の位置の項も今の形 —— 金星の釣り合いを解き直す)×
//     互いにロックした対の相互の項(主 0・比べる列は閉じた式)。物差し: 向き(和の自転の向きへの成分の符号が 2 つの読みで違う)と率(受動の応答 ∝ (ω_ax − s) の 2 つの読みの相対の差
//     ÷ 観測の率の相対の不確かさ —— 観測の率を全部この応答に当てた読み)。
//   T2: 作用の型 vel・push・damp(第337便i)× 高さの型 slice・lor4・ball(R_eq・s)と dampRig(本枝 —— 帯の形 ball・slice × 場の角速度の比 χ ½・1 × 源の外の落ち方のべき q 0・2・3)×
//     受け手の大きさのべき p 0・0.5・1・1.5。強さ λ: (i) 環で要る値(第337便i の判定 —— 傾きを減らさない型は第337便i の主の組の値)・(ii) フォボスの公転の変化を全部担う値・
//     (iii) 環の物差し(1e7 年で |Δ ln a| ≤ 1e-5・|δΩ/Ω| ≤ 1e-5)の上限。物差し: 衛星は |予測 ÷ 観測| ≤ 1。
//   T3: 帯の幅 H = 2 R_d(R_d の読み 5)を文献の厚みと並べる・源の取り分 β で重みを付けた T1 の率の半径の依存と β = ½ の半径・環の物差しと水星の尺度・T3 の場の鉛直の速さ = ν_z z の高さ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w337j-spinorbit.mjs';
import { staticRate, selfRate, fShare, weight337 } from './lib-w337a-supply.mjs';
import { LIT334A } from './lib-w334a-heightlaw.mjs';
import { fObsOf } from './lib-w333a-rotdiff.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337j-spinorbit-2';
export const AMEND = Object.freeze([
  '第338便c(統括の検証項目 R351 —— 原仮定者の指示(2026-11-15 —— 第139報)): 正本へ書く出力を量ごとの数値の尺度で整える(tests/lib-w338c-recheck.mjs の settleRun —— Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉〔丸めの残り —— 有効数字が 1 桁に満たない〕を 0 と書く・meta.recheck に係数と 0 と書いた葉の数)。式・格子・判定は不変',
]);
export const OUT_MAIN = 'tests/out/spinorbit-337j.json';
export const INPUT = 'tests/out/supply-337a.json';
export const TARGET = 'tests/lib-w337j-spinorbit.mjs';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const AU = L.AU, G = L.G, DAY = L.DAY;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const NOT_CLAIM = Object.freeze(['2 つの読みのどちらが正しいかは決めない(向きと率の差を見分けるのに要る精度の桁まで)', '受動の応答の係数 Γ は置かない(ω_ax の向きと大きさ・s との比まで)',
  '回転引きずりの型は候補(潮汐は積まない —— 観測の公転の変化と符号を照らすだけ)', '一様厚みの型は候補(厚みが決まったとは書かない)', '文献の値は未照合(出典と確かさを書く)',
  '背景慣性決定力 W₀ を太陽系の外にも同じ値で置くのはノブ(コンパクト天体の行)']);
/** 器の宣言 */
export const PLAN = Object.freeze({
  t1Compare: Object.freeze(['earth', 'mars', 'pluto']), t1Rows: Object.freeze(['jupiter', 'saturn', 'uranus', 'neptune']),
  t1Weak: Object.freeze([
    Object.freeze({ key: 'moon', host: 'earth', why: '地球に潮汐ロック(自転 = 公転 —— 軸引きずりの向きと比べても同期の条件が勝つ)' }),
    Object.freeze({ key: 'io', host: 'jupiter', why: '木星に潮汐ロック' }), Object.freeze({ key: 'titan', host: 'saturn', why: '土星に潮汐ロック' }),
    Object.freeze({ key: 'triton', host: 'neptune', why: '海王星に潮汐ロック(逆行の軌道)' }), Object.freeze({ key: 'phobos', host: 'mars', why: '火星に潮汐ロック' }),
    Object.freeze({ key: 'mercury', host: 'sun', why: '太陽と 3:2 の自転と公転の共鳴(潮汐の型の固定)' }),
    Object.freeze({ key: 'venus', host: 'sun', why: '金星の釣り合いは W₀ を決める条件そのもの(比べると循環)・金星の逆行の自転は大気の熱潮汐の影響と地球との共鳴の読みを採用済み(原仮定者の指示(2026-11-05))—— 地球の影響を重力の潮汐だけで読まない' })]),
  /** 第337便i の主の組(slice|focus|Req|obs)の環で要る λ の写し(傾きを減らさない方位の型の λ (i) に使う —— 第337便i の正本 tests/out/rotring-337i.json の値) */
  lambdaMain337i: 6.5606e-7, lambdaMainSrc: '第337便i の正本 tests/out/rotring-337i.json の slice・鉛直へ寄せる場・軸比の R_eq・s の要る λ(6.56e-7 の写し)',
  t2Base: Object.freeze(['vel', 'push', 'damp']),
  t2Rings: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']),
  t2Sat: Object.freeze(['phobos', 'moon', 'titan', 'triton']),
  integ: L.DECL.integ, integSpec: Object.freeze({ action: 'dampRig', prof: 'ball', chi: 1, qFall: 0, pSize: 0, recv: 'phobos', dlnTarget: 1e-4 }),
  t3Hosts: Object.freeze(['saturn', 'jupiter', 'uranus']), t3Rings: Object.freeze(['ringD', 'ringC', 'ringB', 'ringA', 'ringF']),
  t3Extra: Object.freeze([Object.freeze({ key: 'jupMain', host: 'jupiter', r: 126000e3, name: '木星 主環' }), Object.freeze({ key: 'uraEps', host: 'uranus', r: 51149e3, name: '天王星 ε 環' })]),
});
const byKey = (B, k) => B.find((b) => b.key === k);
const srcOf = (key) => { if (key === 'uranus') { const B = LIT334A.bodies.find((b) => b.key === 'uranus'); return { key, ja: B.name, m: B.m, Robs: B.R, s: 2 * Math.PI / (Math.abs(B.P) * 3600), fFlat: B.f, fObs: fObsOf(B.moi), axis: [0, 0, 1] }; } return L.sourceOf(key); };

/* ───────── T1 ───────── */
export function partT1(A) {
  const B = A.bodies, Lhat = A.t1.Lhat, nE = [0, 0, 1], sun = byKey(B, 'sun'), al = L.DECL.alpha, bg = A.background, main = bg.galRows.find((g) => g.rHalfKpc === bg.mainKpc);
  const galN = dot(Lhat, nE), sunN = dot(sun.sHat, nE), mS = sun.m;
  const balA = Object.fromEntries(bg.balance.map((b) => [b.reading === 'i' ? 'st' : 'se', b]));
  // ① 対照: 第337便a の数と同じ(W₀ と f を解き直す・惑星ごとの太陽の項)
  const wV = weight337(mS, 1, al, AU), rV = Math.sqrt(mS / (balA.st.W0 * balA.st.f / (1 - balA.st.f)));   // 金星の距離(第337便a の根と W₀ から逆に)
  const nV = L.nVenusFromRoot({ f: balA.se.f, wbg: bg.wbg, galN, sunN, sSun: sun.s });
  const P0 = { wbg: bg.wbg, galN, sunN, sSun: sun.s, nV, mSun: mS, rV };
  const solved = { st: L.solveVenus({ ...P0, reading: 'st' }), se: L.solveVenus({ ...P0, reading: 'se' }) };
  const ctlPer = balA.st.per.map((q) => ({ key: q.key, sunN: q.sunN, again: staticRate({ s: sun.s, f: q.f, alpha: al }) * sunN }));
  const control = { W0: { st: balA.st.W0, se: balA.se.W0 }, W0again: { st: solved.st.W0, se: solved.se.W0 }, f: { st: balA.st.f, se: balA.se.f }, rVAU: rV / AU, nV,
    relW0: Math.max(Math.abs(solved.st.W0 / balA.st.W0 - 1), Math.abs(solved.se.W0 / balA.se.W0 - 1)), relPer: Math.max(...ctlPer.map((q) => Math.abs(q.again / q.sunN - 1))) };
  // ② 背景軸引きずりの置き方のノブ: 今の形の読みでは銀河 → 太陽の位置の項も今の形(centerSelf)—— 金星の釣り合いを解き直す
  const consistent = L.solveVenus({ ...P0, wbg: main.centerSelf, reading: 'se' });
  const modes = { shared: { W0: { st: balA.st.W0, se: balA.se.W0 }, wbg: { st: bg.wbg, se: bg.wbg } }, consistent: { W0: { st: balA.st.W0, se: consistent.W0 }, wbg: { st: bg.wbg, se: main.centerSelf }, root: consistent } };
  // ③ 天体
  const LS = L.LIT, mm = LS.moonsEarthMars, nKep = (M, a) => Math.sqrt(G * M / a ** 3);
  const sunSrc = (aAU) => ({ key: 'sun', m: mS, r: aAU * AU, s: sun.s, sHat: sun.sHat, n: nKep(mS, aAU * AU) });
  const moon = byKey(B, 'moon'), mars = byKey(B, 'mars');
  const plutoPole = L.eclOfRaDec(LS.pluto.poleRA, LS.pluto.poleDec), plutoS = 2 * Math.PI / Math.abs(LS.pluto.P);
  const bodies = {
    earth: { ja: '地球', s: byKey(B, 'earth').s, sHat: byKey(B, 'earth').sHat, srcs: [sunSrc(LS.aAU.earth), { key: 'moon', m: moon.m, r: mm.moon.a, s: moon.s, sHat: moon.sHat, n: nKep(byKey(B, 'earth').m + moon.m, mm.moon.a) }] },
    mars: { ja: '火星', s: mars.s, sHat: mars.sHat, srcs: [sunSrc(LS.aAU.mars), ...['phobos', 'deimos'].map((k) => { const n = nKep(mars.m, mm[k].a); return { key: k, m: mm[k].m, r: mm[k].a, s: n, sHat: mars.sHat, n }; })] },
    pluto: { ja: '冥王星', s: plutoS, sHat: plutoPole, srcs: [sunSrc(LS.aAU.pluto), { key: 'charon', m: LS.charon.m, r: LS.charon.a, s: plutoS, sHat: plutoPole, n: plutoS, locked: true }] },
  };
  for (const k of PLAN.t1Rows) { const b = byKey(B, k); bodies[k] = { ja: { jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星' }[k], s: b.s, sHat: b.sHat, srcs: [sunSrc(LS.aAU[k])] }; }
  const rows = {};
  for (const [k, b] of Object.entries(bodies)) {
    rows[k] = { ja: b.ja, s: b.s, modes: {} };
    for (const [mk, M] of Object.entries(modes)) {
      const st = L.bodyAxial({ srcs: b.srcs, W0: M.W0.st, wbg: { st: M.wbg.st, se: M.wbg.st }, Lhat, sObs: b.s, sHatObs: b.sHat });
      const se = L.bodyAxial({ srcs: b.srcs, W0: M.W0.se, wbg: { st: M.wbg.se, se: M.wbg.se }, Lhat, sObs: b.s, sHatObs: b.sHat });
      // 読みごとに W₀ が違う —— 背景が静止の値は st の行から・今の形の値は se の行から
      const d = st.projSt - se.projSe;
      rows[k].modes[mk] = { totSt: st.totSt, totSe: se.totSe, per: st.per.map((q, j) => ({ key: q.key, fSt: q.f, fSe: se.per[j].f, st: q.st, se: se.per[j].se, stNaive: q.stNaive, seNaive: se.per[j].seNaive, locked: q.locked })),
        fBgSt: st.fBg, fBgSe: se.fBg, bgSt: st.bgSt, bgSe: se.bgSe, projSt: st.projSt, projSe: se.projSe, magSt: st.magSt, magSe: se.magSe, agreeSt: st.agreeSt, agreeSe: se.agreeSe,
        ratioSt: st.ratioSt, ratioSe: se.ratioSe, diffProj: d, dirDistinct: Math.sign(st.projSt) * Math.sign(se.projSe) < 0, rateRelDiff: Math.abs(d) / Math.abs(st.projSt - b.s),
        pushSt: Math.sign(st.projSt - b.s), pushSe: Math.sign(se.projSe - b.s) };
    }
  }
  // 2 倍角の則の向き(源 = 太陽・円の軌道で平均)と第121報の角(和と自転の軸)
  for (const [k, b] of Object.entries(bodies)) { const el = LS.orbitEl[k], w = L.orbitNormal(el[0], el[1]), ta = L.twoAngleMean({ sSrc: sun.sHat, wOrb: w, sRecv: b.sHat });
    rows[k].twoAngle = { elevMaxDeg: ta.elevMaxDeg, proj: ta.proj, axisComp: ta.axisComp, eqProj: -dot(sun.sHat, b.sHat), sameAsEq: Math.sign(ta.proj) === Math.sign(-dot(sun.sHat, b.sHat)) };
    for (const M of Object.values(rows[k].modes)) { M.angSt = L.angleDeg(M.totSt, b.sHat); M.angSe = L.angleDeg(M.totSe, b.sHat); delete M.totSt; delete M.totSe; } }
  // 冥王星の自転の軸と軌道の法線の角(逆行の確かめ)
  const plutoObliq = Math.acos(dot(plutoPole, L.orbitNormal(LS.pluto.iDeg, LS.pluto.nodeDeg))) * 180 / Math.PI;
  // ④ 観測の自転の変化の率
  const obs = { earth: { sdotOverS: L.sdotOverS.lod(LS.spinRates.earth.lodMsPerCy, 2 * Math.PI / bodies.earth.s), relUnc: LS.spinRates.earth.relUnc }, mars: { sdotOverS: L.sdotOverS.mas(LS.spinRates.mars.masPerYr2, bodies.mars.s), relUnc: LS.spinRates.mars.relUnc }, pluto: null };
  for (const k of ['earth', 'mars']) for (const M of Object.values(rows[k].modes)) { const o = obs[k]; M.obsSign = Math.sign(o.sdotOverS); M.pushAgreeSt = M.pushSt === M.obsSign; M.pushAgreeSe = M.pushSe === M.obsSign; M.rateDistinct = M.rateRelDiff > o.relUnc; }
  // ⑤ 銀河の中の太陽(第337便a の galRows の主 —— 中心の点・R_½ 4 kpc)
  const sL = dot(sun.sHat, Lhat);
  const sunGal = { f: main.f, st: main.center, se: main.centerSelf, projSt: main.center * sL, projSe: main.centerSelf * sL, sDotL: sL, ratioSt: main.center * sL / sun.s, ratioSe: main.centerSelf * sL / sun.s,
    dirDistinct: Math.sign(main.center * sL) * Math.sign(main.centerSelf * sL) < 0, diffClosed: -al * main.f * (1 - main.f) * A.t1.gal.Omega, diff: main.center - main.centerSelf };
  // ⑥ コンパクト天体(源 = 伴星 —— 軌道の法線 ẑ の座標・背景の項は向き未知のまま大きさだけ)
  const compact = LS.compact.map((c) => {
    const s = 2 * Math.PI / c.P, sd = L.sdotOverS.pdot(c.Pdot, c.P);
    if (!c.comp) { const wbgAbs = Math.abs(bg.wbg); return { key: c.key, name: c.name, s, sdotOverS: sd, fComp: 0, fBg: 1, magSt: wbgAbs, magSe: wbgAbs, ratioSt: wbgAbs / s, ratioSe: wbgAbs / s, dirDistinct: null, agreeSt: null, agreeSe: null, pushSign: -1, obsSign: Math.sign(sd), note: '源は背景だけ(銀河に対する軸の向きは未知 —— 大きさだけ)' }; }
    const cc = LS.compact.find((q) => q.key === c.comp) || Object.assign({ key: c.comp, P: Infinity }, LS.compactPartner[c.comp]);
    const mComp = cc.m, sComp = cc.P && isFinite(cc.P) ? 2 * Math.PI / cc.P : 0, a = L.aKepler(c.m + mComp, c.Pb), n = 2 * Math.PI / c.Pb;
    const tiltC = cc.tiltDeg === null || cc.tiltDeg === undefined ? 0 : cc.tiltDeg, sHatC = [Math.sin(tiltC * Math.PI / 180), 0, Math.cos(tiltC * Math.PI / 180)];
    const tilts = [c.tiltDeg].concat(c.tiltAlt ? [c.tiltAlt] : []);
    const out = tilts.map((t) => { const sHat = [0, Math.sin(t * Math.PI / 180), Math.cos(t * Math.PI / 180)];
      const R = (W0) => L.bodyAxial({ srcs: [{ key: c.comp, m: mComp, r: a, s: sComp, sHat: sHatC, n }], W0, wbg: { st: 0, se: 0 }, Lhat: [0, 0, 1], sObs: s, sHatObs: sHat });
      const st = R(modes.shared.W0.st), se = R(modes.shared.W0.se);
      return { tiltDeg: t, projSt: st.projSt, projSe: se.projSe, ratioSt: st.ratioSt, ratioSe: se.ratioSe, agreeSt: st.agreeSt, agreeSe: se.agreeSe, dirDistinct: Math.sign(st.projSt) * Math.sign(se.projSe) < 0,
        twoAngle: (() => { const ta = L.twoAngleMean({ sSrc: sHatC, wOrb: [0, 0, 1], sRecv: sHat }); return { elevMaxDeg: ta.elevMaxDeg, proj: ta.proj, axisComp: ta.axisComp }; })(),
        diffProj: st.projSt - se.projSe, rateRelDiff: Math.abs(st.projSt - se.projSe) / Math.abs(st.projSt - s), pushSt: Math.sign(st.projSt - s), pushSe: Math.sign(se.projSe - s), fComp: st.per[0].f, fBg: st.fBg }; });
    return { key: c.key, name: c.name, s, sComp, a, n, sdotOverS: sd, obsSign: Math.sign(sd), mComp, tiltComp: tiltC, rows: out, bgMag: out[0].fBg * Math.abs(bg.wbg) };
  });
  // ⑦ 比べる意味が薄い相手(1 行ずつ —— 主星の取り分だけ並べる)
  const weak = PLAN.t1Weak.map((w) => { const b = byKey(B, w.key === 'mercury' ? 'mercury' : w.key), h = w.host === 'sun' ? sun : byKey(B, w.host);
    const r = w.key === 'moon' ? mm.moon.a : w.key === 'phobos' ? mm.phobos.a : w.host === 'sun' ? (w.key === 'mercury' ? 0.387098 : 0.723332) * AU : null;
    return { key: w.key, host: w.host, why: w.why, s: b ? b.s : null, fHost: r ? fShare(weight337(h.m, r, al, AU), balA.st.W0) : null }; });
  return { galN, sunN, control, modes: { shared: { W0: modes.shared.W0, wbg: modes.shared.wbg }, consistent: { W0: modes.consistent.W0, wbg: modes.consistent.wbg, f: consistent.f, rHalfAU: consistent.rHalfAU } },
    rows, plutoObliq, obs, sunGal, compact, weak };
}

/* ───────── T2 ───────── */
const recvOf = (k) => L.LIT.t2Receivers.find((r) => r.key === k);
function t2Specs() {
  const out = [];
  for (const prof of L.DECL.t2.profiles) for (const action of PLAN.t2Base) out.push({ key: `${action}|${prof}`, action, prof });
  for (const prof of ['ball', 'slice']) for (const chi of L.DECL.t2.chi) for (const qFall of L.DECL.t2.qFall) out.push({ key: `dampRig|${prof}|chi${chi}|q${qFall}`, action: 'dampRig', prof, chi, qFall });
  return out;
}
export function partT2() {
  const srcs = {}, getSrc = (k) => (srcs[k] = srcs[k] || L.sourceOf(k));
  const tol = L.DECL.t2.ringTol, T = tol.tYr * L.YR;
  const recvs = L.LIT.t2Receivers.map((r) => { const src = getSrc(r.host), iDeg = r.iDeg === null ? Math.asin(L.DECL.t2.ringZ / r.a) * 180 / Math.PI : r.iDeg, sys = L.recvSys(src, { a: r.a, iDeg }), n = Math.sqrt(G * src.m / r.a ** 3);
    const pro = iDeg < 90, obs = L.obsDlnA(r.key, r.a, n);
    return { key: r.key, name: r.name, host: r.host, a: r.a, iDeg, R: r.R, n, s: src.s, nOverS: n / src.s, pro, aOverSync: r.a / L.rSyncOf(src), obsDlnA: obs, obsSign: obs === null ? null : Math.sign(obs), sys };
  });
  const ptsCache = new Map(), ptsOf = (rc, H0) => { const k = rc.key + '|' + H0; if (!ptsCache.has(k)) ptsCache.set(k, L.pointsOf(rc.sys, H0)); return ptsCache.get(k); };
  const sets = t2Specs().map((spec) => {
    const rows = recvs.map((rc) => { const src = getSrc(rc.host), eff = L.t2Effect(src, { ...spec, lambda: 1, reading: L.DECL.t2.reading, speed: L.DECL.t2.speed }), H0 = spec.prof === 'ball' ? null : eff.meta.Rd;
      const R = L.ringRow(rc.sys, eff, ptsOf(rc, H0)), C = L.t2Closed(src, { ...spec, reading: L.DECL.t2.reading, speed: L.DECL.t2.speed }, rc.a);
      return { key: rc.key, dlnA: R.dlnA, dOm: R.dOmOverOm, dlnI: R.dlnI, tiltSignif: R.tiltSignif, closedDlnA: C.dlnA, closedDOm: C.dOm, signA: Math.abs(R.dlnA) <= 1e-12 * Math.abs(R.dOmOverOm) * rc.n ? 0 : Math.sign(R.dlnA), signOm: Math.sign(R.dOmOverOm) }; });
    const bound = L.signBoundary(getSrc('saturn'), { ...spec, reading: L.DECL.t2.reading, speed: L.DECL.t2.speed }), boundMars = L.signBoundary(getSrc('mars'), { ...spec, reading: L.DECL.t2.reading, speed: L.DECL.t2.speed });
    // 受け手の大きさのべき p(dampRig だけ —— 率は R^p に比例)
    const ps = spec.action === 'dampRig' ? L.DECL.t2.pSize : [0];
    const lam = ps.map((p) => {
      const sc = (q) => Math.pow(recvs.find((r) => r.key === q.key).R, p), rr = rows.map((q) => ({ ...q, dlnA: q.dlnA * sc(q), dOm: q.dOm * sc(q), dlnI: q.dlnI * sc(q) }));
      const ringRows = rr.filter((q) => PLAN.t2Rings.includes(q.key)), J = L.ringJudge(ringRows.map((q) => ({ dlnI: q.dlnI, dlnA: q.dlnA, dOmOverOm: q.dOm, dlnE: 0, tiltSignif: q.tiltSignif })));
      const lamI = J.thin ? J.lambdaNeed : PLAN.lambdaMain337i, lamIfrom = J.thin ? 'ring' : 'main337i';
      const ph = rr.find((q) => q.key === 'phobos'), phObs = recvs.find((r) => r.key === 'phobos').obsDlnA;
      const lamII = ph.dlnA !== 0 && Math.sign(ph.dlnA) === Math.sign(phObs) ? phObs / ph.dlnA : null;
      const lim = ringRows.map((q) => Math.min(q.dOm !== 0 ? tol.kepler / Math.abs(q.dOm) : Infinity, q.dlnA !== 0 ? tol.drift / (Math.abs(q.dlnA) * T) : Infinity)), lamIII = Math.min(...lim);
      const at = (lmb) => { if (lmb === null || !fin(lmb)) return null;
        const ring = { kepler: Math.max(...ringRows.map((q) => Math.abs(lmb * q.dOm))), drift: Math.max(...ringRows.map((q) => Math.abs(lmb * q.dlnA) * T)) }; ring.ok = ring.kepler <= tol.kepler * (1 + 1e-9) && ring.drift <= tol.drift * (1 + 1e-9);
        const sat = Object.fromEntries(PLAN.t2Sat.map((k) => { const q = rr.find((x) => x.key === k), o = recvs.find((r) => r.key === k).obsDlnA; return [k, { pred: lmb * q.dlnA, ratio: lmb * q.dlnA / o }]; }));
        const satOk = Object.values(sat).every((v) => Math.abs(v.ratio) <= L.DECL.t2.satTol);
        return { lambda: lmb, ring, sat, satOk, all: ring.ok && satOk }; };
      return { p, lamI, lamIfrom, lamII, lamIII: fin(lamIII) ? lamIII : null, atI: at(lamI), atII: at(lamII), atIII: at(fin(lamIII) ? lamIII : null), iiOverIII: lamII !== null && fin(lamIII) ? lamII / lamIII : null };
    });
    const signs = rows.map((q) => { const rc = recvs.find((r) => r.key === q.key); return { key: q.key, obs: rc.obsSign, pred: q.signA, match: rc.obsSign === null ? null : rc.obsSign === q.signA }; });
    return { key: spec.key, spec, rows, boundSat: bound, boundMars, lam, signs, nMatch: signs.filter((x) => x.match === true).length, nObs: signs.filter((x) => x.match !== null).length };
  });
  // 遠心力の読み(原仮定者の指示(2026-11-09 —— 第133報の追記)・(2026-11-10 —— 第134報)): 源の回転で空間を引きずると、順行の公転では遠心力を下げ・逆行では上げる ——
  //   円の軌道の釣り合いで公転の角速度の定常のずれ δΩ/Ω = ±Ω_f/n(順行 +・逆行 −)。Ω_f = 座標を運ぶ方位の場の場の角速度(第337便i の型の数)と剛体の場 χ s(閉じた式 ±λ χ s/n)
  const velBall = sets.find((s) => s.key === 'vel|ball'), rigOne = sets.find((s) => s.key === 'dampRig|ball|chi1|q0');
  const centrifugal = recvs.map((rc) => { const q = velBall.rows.find((x) => x.key === rc.key), r1 = rigOne.rows.find((x) => x.key === rc.key);
    return { key: rc.key, pro: rc.pro, nOverS: rc.nOverS, velBallDOm: q.dOm, signOm: Math.sign(q.dOm), signAbsOm: Math.sign(q.dOm) * (rc.pro ? 1 : -1), rigidChi1: (rc.pro ? 1 : -1) / rc.nOverS, rigidChiHalf: (rc.pro ? 0.5 : -0.5) / rc.nOverS, dampRigSignA: r1.signA }; });
  // 同時に置ける組(λ を (ii) フォボスを全部担う値にして環と月とタイタンとトリトンが物差しの内)
  const simul = []; for (const s of sets) for (const l of s.lam) { if (l.atII && l.atII.all) simul.push(s.key + '|p' + l.p); }
  const simulIII = []; for (const s of sets) for (const l of s.lam) { if (l.atIII && l.atIII.satOk) simulIII.push(s.key + '|p' + l.p); }
  return { recvs: recvs.map(({ sys, ...r }) => r), sets, centrifugal, simul, simulIII, tol: { ...tol, T } };
}
/** 代表の時間積分(フォボスの型の受け手・dampRig) */
export function partInteg() {
  const c = PLAN.integSpec, rc = L.LIT.t2Receivers.find((r) => r.key === c.recv), src = L.sourceOf(rc.host), sys = L.recvSys(src, { a: rc.a, iDeg: rc.iDeg, e: 0.0151 });
  const u = L.ringRow(sys, L.dampRigEffect(src, { ...c, lambda: 1 }), L.pointsOf(sys, null)), Tt = PLAN.integ.nOrb * L.periodOf(sys.orb), lam = c.dlnTarget / (Math.abs(u.dlnA) * Tt);
  const runs = PLAN.integ.steps.map((n) => Object.assign({ steps: n }, L.integrate(sys, L.dampRigEffect(src, { ...c, lambda: lam }), { nOrb: PLAN.integ.nOrb, steps: n })));
  const first = u.dlnA * lam;
  return { spec: c, lambda: lam, first, runs: runs.map((r) => ({ steps: r.steps, dlnA: r.dlnA, apsW: r.apsW, dlnE: r.dlnE })), relDiff: Math.abs(runs[1].dlnA / first - 1), stepSpread: Math.abs(runs[0].dlnA / runs[1].dlnA - 1) };
}

/* ───────── T3 ───────── */
export function partT3(A, T1) {
  const bg = A.background, sun = byKey(A.bodies, 'sun');
  // ① 帯の幅を厚みと読む
  const width = PLAN.t3Hosts.map((h) => { const src = srcOf(h), lit = L.LIT.ringThickness.find((q) => q.host === h);
    return { host: h, ja: src.ja, fFlat: src.fFlat, lit: lit.H, litKind: lit.kind, H: Object.fromEntries(L.DECL.t3.widthReadings.map((rk) => { const H = L.bandWidthH(src, rk); return [rk, { H, overLit: H === null ? null : H / lit.H }]; })) }; });
  // ② 源の取り分で重みを付けた T1(土星の環 —— 太陽を他の源に・W₀ の読み 2)
  const sat = L.sourceOf('saturn'), wSun = weight337(sun.m, L.LIT.aAU.saturn * AU, L.DECL.alpha, AU);
  const ringR = PLAN.t3Rings.map((k) => recvOf(k));
  const W0s = { st: T1.modes.shared.W0.st, se: T1.modes.shared.W0.se };
  const dom = Object.entries(W0s).map(([rk, W0]) => {
    const pts = ringR.map((r) => { const b = L.domBeta({ mSrc: sat.m, r: r.a, W0, wOther: wSun }), sys = L.recvSys(sat, { a: r.a, iDeg: Math.asin(L.DECL.t3.zRef / r.a) * 180 / Math.PI }), eff = L.domT1Effect(sat, { W0, wOther: wSun, lambda: 1 });
      const row = L.ringRow(sys, eff, L.pointsOf(sys, null)); return { key: r.key, r: r.a, beta: b, rate: sat.s * b, dlnI: row.dlnI, tiltSignif: row.tiltSignif, dlnA: row.dlnA, dOm: row.dOmOverOm }; });
    const pw = Math.log(Math.abs(pts[pts.length - 1].dlnI / pts[0].dlnI)) / Math.log(pts[pts.length - 1].r / pts[0].r), mean = pts.reduce((a, q) => a + q.dlnI, 0) / pts.length;
    const J = L.ringJudge(pts.map((q) => ({ dlnI: q.dlnI, dlnA: q.dlnA, dOmOverOm: q.dOm, dlnE: 0, tiltSignif: q.tiltSignif })));
    // 水星(源 = 太陽・他の源なし)を同じ λ で
    return { reading: rk, W0, pts, powRate: pw, flatRate: Math.max(...pts.map((q) => Math.abs(q.dlnI / mean - 1))), rHalf: L.domHalfRadius({ mSrc: sat.m, W0, wOther: wSun }), rHalfOverSurface: L.domHalfRadius({ mSrc: sat.m, W0, wOther: wSun }) / sat.Robs, judge: J };
  });
  // 水星(太陽 —— β は f☉ と同じ形・W₀ の読みごと)
  const merc = L.planetSys('merc'), sunS = { key: 'sun', m: merc.M, Robs: merc.Rsun, s: merc.sSun, fFlat: 9e-6, fObs: 0.07, axis: merc.sunAxis };
  for (const d of dom) { const eff = L.domT1Effect(sunS, { W0: d.W0, lambda: 1 }), u = L.planetRow(merc, eff, L.pointsOf(merc, null), L.rdOf(sunS, 'Req'));
    const lam = d.judge.thin ? d.judge.lambdaNeed : null, r = lam === null ? null : { dvarpi: u.ecl.dvarpi * lam, dnode: u.ecl.dnode * lam };
    d.merc = { betaMerc: L.domBeta({ mSrc: sunS.m, r: merc.orb.a, W0: d.W0 }), unitVarpi: u.ecl.dvarpi, unitNode: u.ecl.dnode, at: r, scaleMax: lam === null ? null : Math.max(...Object.values(L.planetScaleRatios(merc, { ecl: { dvarpi: u.ecl.dvarpi * lam, dnode: u.ecl.dnode * lam }, sun: { dnode: u.sun.dnode * lam }, lonDriftArcsec: Math.abs(lam) * u.lonDriftArcsec, decy: u.decy * lam }))) }; }
  // ③ 場と重力の鉛直の速さが等しい高さ(T3 の型 —— 土星の環 D〜F・木星の主環・天王星の ε 環・速さ s と s_d)
  const zEq = [...ringR.map((r) => ({ key: r.key, name: r.name, host: 'saturn', r: r.a })), ...PLAN.t3Extra].map((q) => { const src = srcOf(q.host), lit = L.LIT.ringThickness.find((x) => x.host === q.host);
    const o = L.zEqualHeight(src, { r: q.r, speed: 'obs' }), d = L.zEqualHeight(src, { r: q.r, speed: 'sd' });
    return { key: q.key, name: q.name, host: q.host, r: q.r, nOverS: L.nOverS(src, q.r), Rd: o.Rd, obs: { ratio: o.ratio, zStar: o.zStar, numeric: o.numeric, twoZOverLit: o.zStar === null ? null : 2 * o.zStar / lit.H }, sd: { ratio: d.ratio, zStar: d.zStar, twoZOverLit: d.zStar === null ? null : 2 * d.zStar / lit.H }, lit: lit.H, litKind: lit.kind }; });
  return { proposals: L.LIT.proposals, width, dom, zEq };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    control337a: t1.control.relW0 <= 1e-9 && t1.control.relPer <= 1e-9,
    t1Complete: PLAN.t1Compare.concat(PLAN.t1Rows).every((k) => t1.rows[k] && Object.keys(t1.rows[k].modes).length === 2) && t1.compact.length === L.LIT.compact.length && t1.weak.length === PLAN.t1Weak.length,
    t1Diff: Object.values(t1.rows).every((r) => r.modes.shared.per.every((q) => fin(q.st) && fin(q.se))) && Math.abs(t1.sunGal.diff / t1.sunGal.diffClosed - 1) <= 1e-6,
    plutoRetro: t1.plutoObliq > 90,
    t2Complete: t2.sets.length === PLAN.t2Base.length * L.DECL.t2.profiles.length + 4 * L.DECL.t2.chi.length * L.DECL.t2.qFall.length / 2 && t2.sets.every((s) => s.rows.length === L.LIT.t2Receivers.length && s.rows.every((q) => fin(q.dlnA) && fin(q.dOm))),
    t2Closed: t2.sets.filter((s) => s.spec.prof === 'ball').every((s) => s.rows.filter((q) => ['ringD', 'ringC', 'ringB', 'ringA', 'ringF'].includes(q.key)).every((q) => s.spec.action === 'vel' ? Math.abs(q.dOm / q.closedDOm - 1) <= 1e-6 || (q.dOm === 0 && q.closedDOm === 0) : (q.closedDlnA === 0 ? Math.abs(q.dlnA) <= 1e-30 : Math.abs(q.dlnA / q.closedDlnA - 1) <= 1e-4))),
    t2Bound: t2.sets.filter((s) => s.spec.action === 'dampRig').every((s) => Math.abs(s.boundSat - s.spec.chi) <= 1e-12),
    integ: J.integ.relDiff <= 2e-2 && J.integ.stepSpread <= 1e-3,
    t3: J.t3.width.length === PLAN.t3Hosts.length && J.t3.dom.length === 2 && J.t3.zEq.every((q) => q.obs.zStar === null || (q.obs.numeric !== null && Math.abs(q.obs.numeric / q.obs.zStar - 1) <= 1e-9)),
  };
}
export function runFrom(A) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(A); mark('t1');
  const t2 = partT2(); mark('t2');
  const integ = partInteg(); mark('integ');
  const t3 = partT3(A, t1); mark('t3');
  const J = { inputs: { file: INPUT, version: A.version, libVersion: A.libVersion }, pure, t1, t2, integ, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export const readInput = (root = ROOT) => JSON.parse(fs.readFileSync(path.join(root, INPUT), 'utf8'));
export const runAll = () => runFrom(readInput());
/** 第338便c: 正本へ書く形 —— 生の runFrom を元のまま 1 回と、Math の関数を ±1〜2 ulp ずらして 2 回走らせ、葉ごとの尺度 σ の 4 倍の内の葉(丸めの残り —— 有効数字が 1 桁に満たない)を 0 と書く(壁時計は元のままの走行の値)。戻り値 { J, recheck } */
export function runSettled(A = readInput()) {
  const txt = JSON.stringify(A); let tm = null;
  const S = settleRun(() => { const R = runFrom(JSON.parse(txt)); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w337j-spinorbit.mjs', 'tests/lib-w337j-spinorbit.mjs', 'tests/lib-w337i-rotring.mjs', 'tests/lib-w337a-supply.mjs', 'tests/lib-w337b-mercuryband.mjs', 'tests/lib-w335c-mercurycombo.mjs',
  'tests/lib-w334c-mercurynode.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w332a-eqband.mjs',
  'tests/lib-w331c-k1scale.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w312a-decay.mjs',
  'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337J_OUT ? (path.isAbsolute(process.env.W337J_OUT) ? process.env.W337J_OUT : path.join(ROOT, process.env.W337J_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便j spinorbit(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337j-spinorbit.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-15 —— 第138報の補足 5)「主星にロックしていない観測値が有る固体天体は、地球、火星、冥王星、コンパクト天体など」「『源の自転の半分より速く公転するもの』に注目したのは、公転の速さに回転引きずりが影響していると見える為」「一様厚みについては、以前の …… 提案も参考にする」・統括の検証項目 R346',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便j', target: TARGET, code: CODE, inputs: [INPUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spinorbit', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積と RK4)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

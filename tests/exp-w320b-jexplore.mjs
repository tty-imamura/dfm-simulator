// 第320便b(原仮定者の裁定(第122報)・決断事項 AN471「案3(J)を確かめる。案2bは次点。様々な可能性を探索する」・統括の検証項目 R263):
// **源の角運動量 J の確かめ・案2b の混成の導き直し・候補を並べて数える探索の器**(段 jexplore-320b —— 正本 tests/out/jexplore-w320b.json)。
// html・エンジン・在位の本は変えない(器・lib・正本・文書だけ)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build と読み口 inertialDragIsqState・
// 最上位の inertialDragIsqRule・inertialDragIsqRuleK1・inertialDragIsqK2・inertialDragIsqM2・inertialDrag3MaintCell をそのまま呼ぶ —— 口と写しの本は第319便b の器のものを使う)。
// 1 プロセス(子プロセスなし —— 步は進めない)。
//
// ■ 何をするか(受け手の R_d = Y_k m・並進は不変 —— 源の回転と軸のモーメントだけを写しの外で替える)
//   E エンジンとの照合: K2・M2 と lib のビット同一・lib の節点の和の写しと 16 体の読み口(第319便b の partK)・器の中の源のモーメントだけを J の半径に替えた写し
//     (太陽を pinned・dragCore.radius = R_src,J)の読み口と lib・1 つの源の写しの回転の項と有限の一様球の外側の J の場・maintain の帳簿の式のビット同一。
//   J 有限の一様な剛体回転球の内外(解析の式・独立な体積の求積 2 つ・有限差分の curl・赤道面の半渦度の符号の変わる r/R・境界の連続)。
//   P 分割の加法性(立方体のセルの写し —— 公転の J・固有の J・遠方の和・固有の自転だけの和・粗視化の恒等式・差動回転の流れの体積の求積)と、同じ運動を二度足す例
//     (木星の公転の角運動量を源の J に足すと並進の項と重なる)。
//   D 太陽の J の体積積分(宣言の密度の模型の重み —— Lane–Emden n = 3 —— と文献の値の型の回転の分布・中心の核の倍率)。
//   B 案2b の混成の導き直し(遠方の級数・天体ごとの旧の近似との差・有効な J・分割の規則)。
//   S 源の表(源の f・R_src,J・遠方の倍率・受け手の f)。T 6 天体の表(候補ごとの比・広がり・自由な係数と新しい仮定の数・加法性)。Q 候補の数として挙がった値の真偽。
//
// ■ 試走: W320B_QUICK=1(W320B_OUT が要る —— 正本を書かない・求積の格子を 2 段・分割の n を 3 つ)。W320B_WORKERS は受けるが使わない(1 プロセス)。
// ■ 言わないこと: 候補のどれかを採った規則と書かない・一つの候補でそろうと書かない・自由な係数を選んだ値を導いた値と書かない・半渦度を軸引きずり ω と同じと書かない・
//   金星の自転・木星の熱・公転面を引きずりで説明したと書かない・τ_hold を物理の値と書かない・数の桁が近いことを証拠と呼ばない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w320b-jexplore.mjs';
import * as X319 from './exp-w319b-srcradius.mjs';
// 第281便a の領域 hash の宣言(器と lib と import した第319便b の器から deriveScope で引いた下限 —— 第319便b の器の宣言と同じ集合になった。器が大域で読む最上位の関数
//   inertialDragIsqRule・inertialDragIsqRuleK1・inertialDragIsqK2・inertialDragIsqM2・inertialDrag3MaintCell は下限に入っている。presets と roots の短い名は import した lib の綴りが
//   数えられた分 —— 器の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDrag3MaintCell","inertialDragGalaxyAxialState","inertialDragIsqK2","inertialDragIsqM2","inertialDragIsqRule","inertialDragIsqRuleK1","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w320b-jexplore-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['候補のどれかを採った規則と書かない(候補の比較)', '一つの候補で公転面・金星・木星がそろうと書かない(そろわない)', '自由な係数を選んだ値を導いた値と書かない',
  '半渦度を軸引きずり ω と同じと書かない(移送場の診断量)', '金星の自転・木星の熱・公転面を引きずりで説明したと書かない', 'τ_hold を物理の値と書かない(h₀ の規約)',
  '数の桁が近いことを証拠と呼ばない', '格子の差と刻みの差を収束の判定に使わない(感度の診断)', '有限球の J の場は今の bevel の軸引きずりの導出でも置換でもない(正規化の分母と solve の前の弱い場の対照)'];
export const OUT_JEXPLORE = 'tests/out/jexplore-w320b.json';
export const INPUT16 = X319.INPUT16;
export const PLAN = Object.freeze({ grids: L.QGRIDS, partN: L.DECL.partN, fdH: L.FD_H });
export const QUICK = Object.freeze({ grids: Object.freeze([L.QGRIDS[0], L.QGRIDS[1]]), partN: Object.freeze([2, 4, 8]), fdH: L.FD_H });
const { nrm, dot, cross, add3, scl3, relDiff, vecRel } = L;
const IN16 = () => JSON.parse(fs.readFileSync(path.join(ROOT, INPUT16), 'utf8'));
const uRotOf = (rv, Om, a) => cross(scl3(a, Om), rv);
const ROLE = Object.freeze({ me: 1, ve: 2, ea: 3, mo: 4, ma: 5, ju: 6, sa: 11 });

/* ───────── E エンジンとの照合 ───────── */
export function partE(E, st16) {
  const K = X319.partK(E, st16), IN = IN16(), sun = IN.bodies[0], fS = L.moiOf(0), RsJ = sun.radius * Math.sqrt(2.5 * fS);
  // 器の中の源のモーメントだけを J の半径に替えた写し(太陽を pinned・dragCore.radius = R_src,J)
  const P = X319.pOf(st16.S, st16.isq), rule = E.ruleK1(st16.isq.decl.order || 8), st = X319.stateOf(E, X319.book16({ sunRsrc: RsJ }));
  let eng = { ok: false, err: st.err || null };
  if (st.ok) {
    const RsArr = P.Rd.slice(); RsArr[0] = RsJ; let bs = true, worst = 0, nr = 0;
    for (const r of st.isq.receivers) {
      if (r.pinned) continue; nr++;
      const r0 = st16.isq.receivers.find((q) => q.i === r.i); if (!r.beta.every((v, k) => Object.is(v, r0.beta[k]))) bs = false;
      const q = L.k1RecvSrc(rule, P, r.i, { gain: 1, Rsrc: RsArr }), s0 = q.src.find((z) => z.j === 0);
      worst = Math.max(worst, vecRel(s0.rot, r.rot.slice(0, 3)), vecRel(q.omega, r.omega));
    }
    eng = { ok: true, RsrcSunM: RsJ * L.LU, betaSame: bs, worst, receivers: nr, warnings: st.warnings };
  }
  // 1 つの源の写し(太陽の質量・dragCore.radius = R_src,J・赤道面の 100 R☉ の受け手)の回転の項と、有限の一様球の外側の J の場 u = (5G_0/c_0²) J × r/r³
  const rA = 100, so = X319.stateOf(E, X319.bookOne(rA, RsJ)); let one = { ok: false, err: so.err || null };
  if (so.ok) {
    const r1 = so.isq.receivers.find((q) => q.i === 1), uv = uRotOf(r1.rot.slice(0, 3), so.S.spin[0], [so.S.sax[0], so.S.say[0], so.S.saz[0]]);
    const Gb = IN.physics.G, cb = IN.physics.cLight, Jb = 0.4 * sun.m * RsJ * RsJ * sun.spin, r = rA * sun.radius, uA = 5 * Gb / (cb * cb) * Jb / (r * r);
    one = { ok: true, uEngine: nrm(uv) * L.VU, uJ: uA * L.VU, ratio: nrm(uv) / uA, JSI: Jb * L.MU * L.LU * L.LU / L.TU, warnings: so.warnings };
  }
  return { K: { k2Same: K.k2Same, m2Same: K.m2Same, nK: K.nK, nM: K.nM, replicaWorst: K.replica.worst, replicaReceivers: K.replica.receivers, replicaCells: K.replica.cells }, engJ: eng, one };
}

/* ───────── J 有限球 ───────── */
export function partJ(plan) {
  const rows = L.JPOINTS.map((P) => L.jPointRow(P, plan.grids, plan.fdH));
  const gF = plan.grids[plan.grids.length - 1], root = L.signRootFD(1, 1, gF, plan.fdH / 2);
  const cont = L.jContinuity(), center = L.jFieldAnalytic([0, 0, 0], [0, 0, 0.4], 1);
  const ffi = [0.3, 0.5, 0.7, 0.9, 0.99].map((x) => ({ x, ratio: L.farFormInsideRatio(x) }));
  return { grids: clone(plan.grids), fdH: plan.fdH, rows, root, cont, centerW: center.w[2] / 0.4, farFormInside: ffi };
}

/* ───────── P 分割の加法性 ───────── */
export function partP(st16, plan) {
  const D = L.DECL.partD, rigid = plan.partN.map((n) => L.partitionRow(n, 0, D)), diff = plan.partN.map((n) => L.partitionRow(n, L.DECL.diffAlpha, D));
  const konig = [L.konigCheck(L.DECL.konigN, 0), L.konigCheck(L.DECL.konigN, L.DECL.diffAlpha)];
  const gF = plan.grids[plan.grids.length - 1], quad = [L.farQuadDiff(0, D, gF), L.farQuadDiff(L.DECL.diffAlpha, D, gF)];
  // 同じ運動を二度足す例: 木星の重心の系の公転の角運動量と太陽の自転の J(源の f)の比
  const S = st16.S, n = S.n; let M = 0, xc = [0, 0, 0], vc = [0, 0, 0];
  for (let i = 0; i < n; i++) { M += S.m[i]; xc = add3(xc, scl3([S.x[i], S.y[i], S.z[i]], S.m[i])); vc = add3(vc, scl3([S.vx[i], S.vy[i], S.vz[i]], S.m[i])); }
  xc = scl3(xc, 1 / M); vc = scl3(vc, 1 / M);
  const Lof = (i) => nrm(cross([S.x[i] - xc[0], S.y[i] - xc[1], S.z[i] - xc[2]], scl3([S.vx[i] - vc[0], S.vy[i] - vc[1], S.vz[i] - vc[2]], S.m[i]))) * L.MU * L.LU * L.LU / L.TU;
  const IN = IN16(), sun = IN.bodies[0], Jsun = L.moiOf(0) * sun.m * L.MU * Math.pow(sun.radius * L.LU, 2) * Math.abs(sun.spin) / L.TU;
  const dbl = { Ljup: Lof(6), Lsat: Lof(11), Jsun, ratioJup: Lof(6) / Jsun, ratioSat: Lof(11) / Jsun };
  return { D, alpha: L.DECL.diffAlpha, rigid, diff, konig, quad, double: dbl };
}

/* ───────── D 太陽の J の体積積分 ───────── */
export function partD() {
  const IN = IN16(), sun = IN.bodies[0], OmRef = sun.spin / L.TU, LE = L.laneEmden(L.DECL.sun.polyN, L.DECL.sun.xiStep);
  const prof = L.DECL.sun.coreK.map((k) => L.sunJProfile(LE, OmRef, k));
  const Jref = L.moiOf(0) * sun.m * L.MU * Math.pow(sun.radius * L.LU, 2) * OmRef;
  return { polyN: LE.n, xi1: LE.xi1, fPoly: LE.f, steps: LE.steps, IfracCore: LE.Ifrac(L.DECL.sun.rCore), IfracTach: LE.Ifrac(L.DECL.sun.rTach), OmRef, OmRefNHz: OmRef / (2 * Math.PI) * 1e9,
    Jref, JrefOverLit: Jref / 1.9e41, prof: prof.map((p) => ({ k: p.k, JOverRigid: p.JOverRigid, OradNHz: p.Orad / (2 * Math.PI) * 1e9, OczNHz: p.OczMean / (2 * Math.PI) * 1e9, AeqNHz: p.Aeq / (2 * Math.PI) * 1e9 })) };
}

/* ───────── B 案2b の導き直し ───────── */
export function partB(st16, P16, plan) {
  const series = [3, 10, 30, 100, 1000].map((x) => L.mixSeriesRow(x)), IN = IN16(), R = IN.bodies.map((b) => b.radius), dist = (i, j) => Math.hypot(P16.x[i] - P16.x[j], P16.y[i] - P16.y[j], P16.z[i] - P16.z[j]);
  const per = [];
  const pair = (j, i, label) => { const Rs = R[j], r = dist(i, j), z = L.mixMoment(r, P16.Rd[j], Rs), old = [0.4 * Rs * Rs / (r * r), -0.8 * Rs * Rs / (r * r * r)];
    per.push({ src: L.BODY16[j], recv: label || L.BODY16[i], rOverRobs: r / Rs, rotRel: z[0] / old[0] - 1, axRel: z[1] / old[1] - 1, rotSeries: L.MIX_ROT_COEF * (Rs / r) * (Rs / r), axSeries: L.MIX_AX_COEF * (Rs / r) * (Rs / r) }); };
  for (const i of [1, 2, 3, 5, 6, 11]) pair(0, i);
  pair(3, 4);
  const RsS = R[11];
  for (const rr of L.DECL.ringRadiiM) { const r = rr / L.LU, z = L.mixMoment(r, P16.Rd[11], RsS), old = [0.4 * RsS * RsS / (r * r), -0.8 * RsS * RsS / (r * r * r)]; per.push({ src: L.BODY16[11], recv: '環 ' + L.ex(rr, 3) + ' m', rOverRobs: r / RsS, rotRel: z[0] / old[0] - 1, axRel: z[1] / old[1] - 1, rotSeries: L.MIX_ROT_COEF * (RsS / r) * (RsS / r), axSeries: L.MIX_AX_COEF * (RsS / r) * (RsS / r) }); }
  const effJ = [0, 1, 2, 3, 4, 5, 6, 11].map((j) => Object.assign({ j, name: L.BODY16[j], f: L.moiOf(j), fLit: L.MOI[j] !== undefined }, L.effJOf(L.moiOf(j), P16.Rd[j], R[j])));
  // 分割の規則(単位の球 —— 1 つの球〔分けない〕の行は解析: 案2a 1・案2b 2・今 ≈ 0)
  const split = [{ n: 1, N: 1, nowOverJ: 0, p2aOverJ: 1, p2bOverJ: 2, p3OverJ: 1, note: '1 つの一様な球(分けない —— 解析)' }].concat(plan.partN.map((n) => { const r = L.partitionRow(n, 0, L.DECL.partD); return { n, N: r.N, nowOverJ: r.nowOverJ, p2aOverJ: r.p2aOverJ, p2bOverJ: r.p2bOverJ, p3OverJ: 1, note: '立方体のセル(要素の R_obs は等しい体積の球の半径 —— 宣言)' }; }));
  return { series, rotCoef: L.MIX_ROT_COEF, axCoef: L.MIX_AX_COEF, per, effJ, split };
}

/* ───────── S 源の表 ───────── */
export function partS(P16) {
  const IN = IN16();
  return [0, 1, 2, 3, 4, 5, 6, 11].map((j) => { const b = IN.bodies[j], f = L.moiOf(j), RsJ = b.radius * Math.sqrt(2.5 * f), Rd = P16.Rd[j];
    return { j, name: L.BODY16[j], m: b.m * L.MU, Robs: b.radius * L.LU, Rd: Rd * L.LU, fSrc: f, fLit: L.MOI[j] !== undefined, RsrcJ: RsJ * L.LU, factorJ: (RsJ / Rd) * (RsJ / Rd), factor2a: (b.radius / Rd) * (b.radius / Rd), factor2b: 2 * (b.radius / Rd) * (b.radius / Rd),
      JSI: f * b.m * L.MU * Math.pow(b.radius * L.LU, 2) * Math.abs(b.spin) / L.TU, fRecvDecl: L.DECL.inertiaF, fRecvLit: f }; });
}

/* ───────── T 6 天体の表の基の行(節点の和)───────── */
/** 受け手 i の源 j の結果(P の写し・源ごとの R_src の並び・混成の印) */
function recvOf(rule, P, i, Rsrc, mix) { return L.k1RecvSrc(rule, P, i, { gain: 1, Rsrc, mix }); }
export function baseRows(E, st16) {
  const S = st16.S, P = X319.pOf(S, st16.isq), IN = IN16(), R = IN.bodies.map((b) => b.radius), rule = E.ruleK1(st16.isq.decl.order || 8), h0 = IN.physics.stepDt * L.TU;
  const Tage = L.LIT318.sunAge.value * L.YEAR, reqPlane = L.DECL.planeTiltDeg * Math.PI / 180 / Tage, reqVenus = Math.PI / (L.DECL.venusPeriodGyr * L.GYR);
  const Rj = R[6] * L.LU, Rv = R[2] * L.LU, PJ = L.powerOf(L.LIT318.jupiterFlux.value, Rj), PJalt = L.powerOf(L.LIT318.jupiterFluxAlt.value, Rj);
  const VH = L.DECL.venusHeat, fluxMid = Math.sqrt(VH.fluxLow * VH.fluxHigh), PV = L.powerOf(fluxMid, Rv), PVlo = L.powerOf(VH.fluxLow, Rv), PVhi = L.powerOf(VH.fluxHigh, Rv);
  const sunRsJ = R[0] * Math.sqrt(2.5 * L.moiOf(0)), RsJof = (j) => R[j] * Math.sqrt(2.5 * L.moiOf(j));
  const arr = (f) => { const a = new Float64Array(P.n); for (let j = 0; j < P.n; j++) a[j] = f(j); return a; };
  const D = L.DECL, LE = L.laneEmden(D.sun.polyN, D.sun.xiStep), j3b = L.sunJProfile(LE, IN.bodies[0].spin / L.TU, 10).JOverRigid, RA = D.alfven.rARsun[0] * R[0];
  // 変種(源ごとの R_src の並び・混成)—— 太陽だけを替える変種は他の源を案3 の J の半径に
  const V = {
    now: { Rsrc: null, mix: null }, p1: { Rsrc: arr((j) => (R[j] > 0 ? Math.min(R[j], L.CAP_SRC_M / L.LU) : P.Rd[j])), mix: null }, p2a: { Rsrc: arr((j) => R[j]), mix: null },
    p2b: { Rsrc: arr((j) => R[j]), mix: arr(() => 1) }, p3: { Rsrc: arr(RsJof), mix: null }, mixJ: { Rsrc: arr(RsJof), mix: arr(() => 1) },
    c3b: { Rsrc: arr((j) => (j === 0 ? sunRsJ * Math.sqrt(j3b) : RsJof(j))), mix: null }, c3fii: { Rsrc: arr((j) => (j === 0 ? RA : RsJof(j))), mix: null } };
  const spinVec = (i) => [P.ax[i], P.ay[i], P.az[i]].map((q) => q * P.spin[i] / L.TU), dvec = (i, j) => [P.x[i] - P.x[j], P.y[i] - P.y[j], P.z[i] - P.z[j]];
  const heat = (i, om, f) => { const a = [P.ax[i], P.ay[i], P.az[i]], sp = P.spin[i] / L.TU, z = L.splitOmega(om, a), I = f * P.md[i] * L.MU * Math.pow(R[i] * L.LU, 2), c = L.maintCell(I, sp, a[0], a[1], a[2], z.wp, z.q[0], z.q[1], z.q[2]); return { Eax: c[0], Esp: c[1], Qabs: c[0] + Math.abs(c[1]) }; };
  const planeOf = (q, i, j, PP) => { const s = q.src.find((z) => z.j === j), aj = [PP.ax[j], PP.ay[j], PP.az[j]], u = uRotOf(s.rot, PP.spin[j], aj).map((v) => v * L.VU), d = dvec(i, j), dm = nrm(d) * L.LU, sn = nrm(cross(aj, scl3(d, 1 / nrm(d)))); return nrm(u) / (dm * sn); };
  const omOf = (q, j) => q.src.find((z) => z.j === j).omega.map((v) => v / L.TU);
  // 環(土星の赤道面の C 環の内縁に試験の粒子 —— 太陽 + 土星 + 粒子の SI の写し・第319便b の型)
  const ringOf = (vk) => {
    const PS = { n: P.n, x: P.x.map((v) => v * L.LU), y: P.y.map((v) => v * L.LU), z: P.z.map((v) => v * L.LU), md: P.md.map((v) => v * L.MU), Rd: P.Rd.map((v) => v * L.LU), spin: P.spin.map((v) => v / L.TU), ax: P.ax, ay: P.ay, az: P.az };
    const iS = 11, aS = [P.ax[iS], P.ay[iS], P.az[iS]], t = cross(aS, [0, 0, 1]), eP = scl3(t, 1 / nrm(t)), rr = 7.4658e7, mt = 1e10, mS = PS.md[iS];
    const Pr = { n: 3, x: [PS.x[0], PS.x[iS], PS.x[iS] + eP[0] * rr], y: [PS.y[0], PS.y[iS], PS.y[iS] + eP[1] * rr], z: [PS.z[0], PS.z[iS], PS.z[iS] + eP[2] * rr], md: [PS.md[0], mS, mt], Rd: [PS.Rd[0], PS.Rd[iS], L.YK * mt], spin: [PS.spin[0], PS.spin[iS], 0], ax: [PS.ax[0], aS[0], 0], ay: [PS.ay[0], aS[1], 0], az: [PS.az[0], aS[2], 1] };
    const v = V[vk] || V.p3, RsS = v.Rsrc ? v.Rsrc[iS] * L.LU : null, RsArr = Pr.Rd.slice(); if (RsS !== null) RsArr[1] = RsS;
    const q = L.k1RecvSrc(rule, Pr, 2, { gain: 1, Rsrc: RsS === null ? null : RsArr, mix: v.mix ? [0, 1, 0] : null }), s = q.src.find((z) => z.j === 1), u = nrm(uRotOf(s.rot, Pr.spin[1], aS));
    return u / Math.sqrt(L.G0 * mS / rr);
  };
  const base = {}, detail = {};
  const one = (vk, Pv, recvSet) => {
    const v = V[vk], q = {}; for (const i of recvSet) q[i] = recvOf(rule, Pv, i, v.Rsrc, v.mix);
    const oV = omOf(q[2], 0), oJ = omOf(q[6], 0), hV = heat(2, oV, D.inertiaF), hVF = heat(2, oV, L.moiOf(2)), hJ = heat(6, oJ, D.inertiaF), hJF = heat(6, oJ, L.moiOf(6));
    return { me: planeOf(q[1], 1, 0, Pv) / reqPlane, ve: nrm(oV) / reqVenus, veHeat: hV.Qabs / h0 / PV, veHeatF: hVF.Qabs / h0 / PV, veHeatLo: hV.Qabs / h0 / PVlo, veHeatHi: hV.Qabs / h0 / PVhi,
      ea: planeOf(q[3], 3, 0, Pv) / reqPlane, ma: planeOf(q[5], 5, 0, Pv) / reqPlane, ju: hJ.Qabs / h0 / PJ, juAlt: hJ.Qabs / h0 / PJalt, juF: hJF.Qabs / h0 / PJ,
      emOm: nrm(omOf(q[4], 3)), omVenus: nrm(oV), omJup: nrm(oJ), PJ: hJ.Qabs / h0, PV: hV.Qabs / h0, EaxJ: hJ.Eax, EspJ: hJ.Esp, ring: ringOf(vk) };
  };
  for (const vk of Object.keys(V)) base[vk] = one(vk, P, [1, 2, 3, 4, 5, 6]);
  // 3g: 受け手ごとに太陽の自転のベクトルを Ω☉ − n_i ĥ_i に替えた写し(源の J の数え方の宣言 —— 太陽の R_src は案3)
  {
    const v = V.p3, sv = spinVec(0), out = {}, rel = {};
    for (const i of [1, 2, 3, 4, 5, 6]) {
      const d = dvec(i, 0), vv = [S.vx[i] - S.vx[0], S.vy[i] - S.vy[0], S.vz[i] - S.vz[0]], nh = scl3(cross(d, vv), 1 / (dot(d, d) * L.TU)), Or = [sv[0] - nh[0], sv[1] - nh[1], sv[2] - nh[2]], Om = nrm(Or);
      const Pv = Object.assign({}, P, { spin: P.spin.slice(), ax: P.ax.slice(), ay: P.ay.slice(), az: P.az.slice() }); Pv.spin[0] = Om * L.TU; Pv.ax[0] = Or[0] / Om; Pv.ay[0] = Or[1] / Om; Pv.az[0] = Or[2] / Om;
      out[i] = { q: recvOf(rule, Pv, i, v.Rsrc, v.mix), Pv }; rel[i] = Om / nrm(sv);
    }
    const oV = omOf(out[2].q, 0), oJ = omOf(out[6].q, 0), hV = heat(2, oV, D.inertiaF), hVF = heat(2, oV, L.moiOf(2)), hJ = heat(6, oJ, D.inertiaF), hJF = heat(6, oJ, L.moiOf(6));
    base.c3g = { me: planeOf(out[1].q, 1, 0, out[1].Pv) / reqPlane, ve: nrm(oV) / reqVenus, veHeat: hV.Qabs / h0 / PV, veHeatF: hVF.Qabs / h0 / PV, veHeatLo: hV.Qabs / h0 / PVlo, veHeatHi: hV.Qabs / h0 / PVhi,
      ea: planeOf(out[3].q, 3, 0, out[3].Pv) / reqPlane, ma: planeOf(out[5].q, 5, 0, out[5].Pv) / reqPlane, ju: hJ.Qabs / h0 / PJ, juAlt: hJ.Qabs / h0 / PJalt, juF: hJF.Qabs / h0 / PJ,
      emOm: base.p3.emOm, omVenus: nrm(oV), omJup: nrm(oJ), PJ: hJ.Qabs / h0, PV: hV.Qabs / h0, EaxJ: hJ.Eax, EspJ: hJ.Esp, ring: base.p3.ring };
    detail.c3gOmRel = Object.fromEntries(Object.entries(rel).map(([k, v]) => [L.BODY16[k], v]));
  }
  // maintain の帳簿の式(lib)とエンジンのビット同一(案3 の木星・金星の太陽の項)
  let maintSame = true;
  for (const [i, om] of [[6, omOf(recvOf(rule, P, 6, V.p3.Rsrc, null), 0)], [2, omOf(recvOf(rule, P, 2, V.p3.Rsrc, null), 0)]]) {
    const a = [P.ax[i], P.ay[i], P.az[i]], sp = P.spin[i] / L.TU, z = L.splitOmega(om, a), I = D.inertiaF * P.md[i] * L.MU * Math.pow(R[i] * L.LU, 2), outE = new Float64Array(9);
    E.maintCell(I, sp, a[0], a[1], a[2], z.wp, z.q[0], z.q[1], z.q[2], outE, 0); const lb = L.maintCell(I, sp, a[0], a[1], a[2], z.wp, z.q[0], z.q[1], z.q[2]);
    maintSame = maintSame && Object.is(outE[0], lb[0]) && Object.is(outE[1], lb[1]) && Object.is(outE[2], lb[2]);
  }
  // 補助の量(受け手の半径・自転の周期・h₀・時間平均の倍率・アルヴェーンの物質の J の比)
  const Prot = (i) => 2 * Math.PI / Math.abs(P.spin[i] / L.TU), tNow = L.LIT318.sunAge.value / 1e9, sd = L.DECL.spinDown;
  const spin = { age: L.spinAvg(0.1, 0, tNow, tNow), venus: L.spinAvg(0.1, tNow - sd.venusWindowGyr, tNow, tNow), sweep: sd.tSatGyr.map((t) => ({ tSat: t, age: L.spinAvg(t, 0, tNow, tNow), venus: L.spinAvg(t, tNow - sd.venusWindowGyr, tNow, tNow) })) };
  const al = L.DECL.alfven, mdot = al.mdotMsunYr * L.MSUN / L.YEAR, Jsun = L.moiOf(0) * P.md[0] * L.MU * Math.pow(R[0] * L.LU, 2) * Math.abs(P.spin[0] / L.TU);
  const corona = al.rARsun.map((q) => { const RAm = q * R[0] * L.LU, Mc = mdot * RAm / al.vWind, Jc = Mc * RAm * RAm * Math.abs(P.spin[0] / L.TU), Jdot = (2 / 3) * mdot * Math.abs(P.spin[0] / L.TU) * RAm * RAm;
    return { rARsun: q, massKg: Mc, Jc, JcOverJ: Jc / Jsun, Jdot, spinDownGyr: Jsun / Jdot / L.GYR, fac2: (0.4 / L.moiOf(0)) * q * q }; });
  const lod = L.DECL.earthLod, lodNow = 2 * Math.PI / Math.abs(P.spin[3] / L.TU), dLod = lod.msPerCentury * 1e-3 * (lod.windowGyr * 1e9 / 100), lodPast = lodNow - dLod;
  const earthAvg = (Math.log(lodNow / lodPast) / (lodNow - lodPast)) * lodNow;   // ⟨Ω⟩/Ω_now(1 日の長さが窓で一次に増える —— ⟨1/LOD⟩ × LOD_now)
  const aux = { h0, R: { me: R[1] * L.LU, ve: R[2] * L.LU, ea: R[3] * L.LU, ma: R[5] * L.LU, ju: R[6] * L.LU }, Prot: { ve: Prot(2), ju: Prot(6), me: Prot(1) }, spin, coronaJFrac: corona[1].JcOverJ, corona,
    earthLod: { lodNowS: lodNow, lodPastS: lodPast, avgFactor: earthAvg }, j3b, req: { plane: reqPlane, venus: reqVenus, PJ, PJalt, PV, PVlo, PVhi, fluxMid } };
  return { base, aux, detail, maintSame, sunRsJM: sunRsJ * L.LU, RAM: RA * L.LU };
}

/* ───────── T・Q 6 天体の表と候補の数の真偽 ───────── */
export function partT(BR) {
  const tab = L.sixTable(BR.base, BR.aux), b = BR.base.p3, R = BR.aux.R;
  const q1 = L.bestQ(b, R, false), q2 = L.bestQ(b, R, true);
  const extra = { factorJSun: BR.factorJSun, factor2bSun: BR.factor2bSun, c3bFac10: BR.aux.j3b * BR.factorJSun, c3fiiFac3: BR.aux.corona[0].fac2 * BR.factorJSun };
  const Q = L.claimsOf(tab, BR.aux, extra);
  return { rows: tab, bestQ: { axialOnly: q1, withPlane: q2 }, claims: Q, extra };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {};
  G.eKernel = !!(J.E && J.E.K.k2Same && J.E.K.m2Same && J.E.K.replicaWorst === 0 && J.E.K.replicaReceivers === 16);
  G.eJ = !!(J.E && J.E.engJ.ok && J.E.engJ.betaSame && J.E.engJ.worst <= 1e-12);
  G.eOne = !!(J.E && J.E.one.ok && Math.abs(J.E.one.ratio - 1) <= 1e-5);
  G.jRay = !!(J.J && J.J.rows.every((r) => r.q2[r.q2.length - 1] <= 1e-12));
  G.jSrcFar = !!(J.J && J.J.rows.filter((r) => r.d >= 3 || r.uAbs === 0).every((r) => r.q1[r.q1.length - 1] <= 1e-12));
  G.jFD = !!(J.J && J.J.rows.every((r) => r.fdH2 <= 1e-5 && (r.fdH < 1e-10 || (r.fdH / r.fdH2 > 3 && r.fdH / r.fdH2 < 5))));
  G.jRoot = !!(J.J && J.J.root.ok && J.J.root.rel <= 1e-5);
  G.jCont = !!(J.J && J.J.cont.every((c) => c.uRel <= 1e-10 && c.wRel <= 1e-10) && Math.abs(J.J.centerW - 2.5) <= 1e-15);
  G.pFar = !!(J.P && J.P.rigid.concat(J.P.diff).every((r) => Math.abs(r.farOverDip - 1) <= 1e-3 && Math.abs(r.spinOnlyOverDip - r.fracInt) <= 1e-3));
  G.pKonig = !!(J.P && J.P.konig.every((k) => k.rel <= 1e-12));
  G.pQuad = !!(J.P && J.P.quad.every((q) => q.Jrel <= 1e-12 && Math.abs(q.farOverDip - 1) <= 1e-4));
  G.bSeries = !!(J.B && Math.abs(J.B.series[J.B.series.length - 1].rotCoef / J.B.rotCoef - 1) <= 1e-3 && Math.abs(J.B.series[J.B.series.length - 1].axCoef / J.B.axCoef - 1) <= 1e-3);
  G.tMaint = !!(J.T && J.T.maintSame);
  G.tShape = !!(J.T && (() => { const p3 = J.T.rows.find((r) => r.key === 'p3'), c = J.T.rows.find((r) => r.key === 'c3c'); return ['me', 've', 'ju'].every((k) => Math.abs(c[k] / p3[k] - 1) <= 1e-3); })());
  return G;
}

/* ───────── 実行 ───────── */
export async function runJExplore(E, o) {
  const P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'jexplore', quick: !!o.quick, plan: clone(P), rule: '受け手 K1 + rdRule:"kappaM"(R_d = Y_k m・Y_k = 10G_0/(C_1c_0²))と並進は不変 —— 源の回転と軸のモーメントだけを写しの外で替える',
    C1: L.C1, Yk: L.YK, decl: clone(L.DECL), cands: clone(L.CANDS), moi: clone(L.MOI), moiUniform: L.MOI_UNIFORM, lit: clone(L.LIT320) };
  const st16 = X319.stateOf(E, X319.book16()); if (!st16.ok) throw new Error('16 体の写しが受理されない: ' + st16.err);
  const P16 = X319.pOf(st16.S, st16.isq);
  J.E = partE(E, st16); tick('E');
  J.J = partJ(P); tick('J');
  J.P = partP(st16, P); tick('P');
  J.D = partD(); tick('D');
  J.B = partB(st16, P16, P); tick('B');
  J.S = partS(P16); tick('S');
  const BR = baseRows(E, st16); BR.factorJSun = J.S[0].factorJ; BR.factor2bSun = J.S[0].factor2b;
  J.T = Object.assign({ base: BR.base, aux: BR.aux, detail: BR.detail, maintSame: BR.maintSame, sunRsJM: BR.sunRsJM, RAM: BR.RAM, factorJSun: BR.factorJSun, factor2bSun: BR.factor2bSun }, partT(BR)); tick('T');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W320B_TARGET || 'beta/index.html', quick = process.env.W320B_QUICK === '1';
  const OUT = process.env.W320B_OUT ? (path.isAbsolute(process.env.W320B_OUT) ? process.env.W320B_OUT : path.join(ROOT, process.env.W320B_OUT)) : path.join(ROOT, OUT_JEXPLORE);
  if (quick && !process.env.W320B_OUT) throw new Error('試走(W320B_QUICK=1)は W320B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html), E = X319.portsOf(HP, globalThis);
  console.log('第320便b jexplore: ' + (quick ? '試走' : '正本') + '・1 プロセス');
  const R = await runJExplore(E, { quick, plan: quick ? QUICK : PLAN });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w320b-jexplore.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の裁定(第122報)「案3(J)を確かめる。案2bは次点。様々な可能性を探索する」(決断事項 AN471)・統括の検証項目 R263。受け手の R_d = Y_k m・並進・規則・在位の本・エンジンの式は変えない(器・lib・正本・文書だけ)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w320b-jexplore.mjs', 'tests/lib-w320b-jexplore.mjs', 'tests/exp-w319b-srcradius.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/lib-w318d-dragest.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第320便b', target: TARGET, code: CODE, inputs: [TARGET, INPUT16] }), {
    harnessVersion: HARNESS_VERSION, stage: 'jexplore',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス・步は進めない)',
    literature: Object.values(L.LIT320).map((z) => z.name + ' = ' + z.value + ' ' + z.unit + '(本便は一次資料に当たっていない)')
      .concat(Object.values(L.LIT318).map((z) => z.name + ' = ' + z.value + ' ' + z.unit + '(本便は一次資料に当たっていない)')),
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第320便c(原仮定者の指示(第122報)・決断事項 AN472「中心１体の影響が大きいが、銀河の渦の中では半渦度は無視出来ない。太陽系近傍においては合成された影響になる」・
// AN473・統括の検証項目 R264): **太陽系近傍の銀河の軸の源の合成の器**(段 nbcompose-320c —— 正本 tests/out/nbcompose-w320c.json)。html・エンジン・在位の本は変えない
// (器・lib・正本・文書だけ)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第319便b の器の 16 体の写し〔book16・stateOf・pOf〕と最上位の
// inertialDragIsqRule・inertialDragIsqRuleK1 をそのまま呼ぶ —— 6 天体の自転と太陽の項の軸の ω だけを読む)。1 プロセス(子プロセスなし —— 步は進めない)。
//
// ■ 何をするか(第319便b の宣言の模型〔円盤 4 + バルジ・平均の流れ V(R) = V0 tanh(R/R_t)・バルジは静止〕の写しの外の計算)
//   F 座標の補正: 格子 3 段(第319便b の mwLocal)の勾配の行列から ∇β を取り出し(G_GC − G_Co = V_ref ⊗ ∇β の階数 1)、ω_GC = ω_Co + ½ ∇β × V_ref で戻ることの確かめ・
//     共動系の半渦度を受け手の動きの項(−½ ∇β × V_ref)と源の流れの項(ω_GC)に分けた表(格子 3 段と環の積分の連続の値・成分ごと)。
//   N 近傍のセルの積分: 環の積分(方位を閉じた式・動径と鉛直は適応の求積 —— 部分積分の形と u_φ の差分の 2 経路)・求積の許容と差分の幅の感度・
//     点のセルの和の格子の感度(格子 48/96/192/384 × 軟化の幅 ε)・近傍のセルの局所の分割(D_loc 1 kpc × s 2/4/8)。
//   P 中心と残余の重ならない分割: R_cut 0.5〜7 kpc の内側(+ バルジ)と外側 —— 解像した内側・残余・和(= 全場)・中心の J と J 双極子・双極子近似の誤差・bevel の主項・
//     受け手の動きの項の分け方・中心の強さの倍率 λ_c の掃引(どの条件で中心が優勢か・向きが反転する λ_c)。
//   Shape 有限の分布の型(同じ総 J): 一様な剛体の球・中心に集中した球(剛体・殻ごとの差動回転)・円盤の成分ごと・宣言の模型。
//   D 「中心」の宣言の型(代理 M_G = V0²R0/G_0 —— 全体の有効中心質量/実在の中心成分 —— バルジ + R < R_cut の円盤)と重ならない成分の和の受理・拒否。
//   B 演算の比べ(今の bevel の軸の主項と J 場の半渦度 —— 同じベクトル演算ではない)・つなぐ対応の候補。
//   R 6 天体(水星〜土星): 自転・太陽の項(第319便b の案3 J の軸の ω と今の値)と銀河の項の候補の角・120° の合成の一般形の減速・拮抗(合成の後の向きで)。
//
// ■ 試走: W320C_QUICK=1(W320C_OUT が要る —— 正本を書かない・格子と掃引を縮める)。W320C_WORKERS は受けるが使わない(1 プロセス)。
// ■ 言わないこと: 半渦度を今の軸引きずり ω_G と同じ量と書かない・半渦度を受け手の軸へ直結する項をエンジンに足さない・中心 1 体の値を「銀河の引きずり」と呼ばない・
//   M_G を実在の中心単体と書かない・格子の差を収束の判定に使わない(格子の感度)・合わせた・説明したと書かない・合否と観測の 3σ を付けない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as C from './lib-w320c-nbcompose.mjs';
import * as L from './lib-w319b-srcradius.mjs';
import { portsOf, stateOf, book16, pOf, INPUT16, mG318 } from './exp-w319b-srcradius.mjs';
import { galaxyAxis } from './lib-w317c-satcut.mjs';
// 第281便a の領域 hash の宣言(器・lib と import した第319便b の器から deriveScope で引いた下限 —— 第319便b の器の宣言と同じ集合〔presets と roots の短い名は import した
//   lib・器の綴りが数えられた分 —— この器の局所の変数には使わない〕。器が大域で読む最上位の inertialDragIsqRule・inertialDragIsqRuleK1 は下限に入っている)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ab","ch","ctx","cw","inertialDrag3MaintCell","inertialDragGalaxyAxialState","inertialDragIsqK2","inertialDragIsqM2","inertialDragIsqRule","inertialDragIsqRuleK1","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w320c-nbcompose-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['半渦度を今の軸引きずり ω_G と同じ量と書かない(移送場の診断量)', '半渦度を受け手の軸へ直結する項をエンジンに足さない(新しい法則になる —— 表がそろってから裁定)',
  '中心 1 体の値を「銀河の引きずり」と呼ばない', 'M_G = V0²R0/G_0 は全体の有効中心質量(実在の中心単体ではない)', 'κ_v は宣言する対応(導いた法則ではない)',
  '格子の差を収束の判定に使わない(格子の感度・刻みの感度診断)', '金星の自転・木星の熱・公転面を引きずりで説明したと書かない', '数の桁が近いことを証拠と呼ばない'];
export const OUT_NBCOMPOSE = 'tests/out/nbcompose-w320c.json';
const G384 = Object.freeze({ nr: 384, np: 768, nz: 48, br: 96, bm: 48, bp: 96 });
export const PLAN = Object.freeze({ gridsF: L.GRIDS, gridsN: Object.freeze([...L.GRIDS, G384]), gridsSplit: L.GRIDS, eps: C.DECL.epsKpc, splitS: C.DECL.splitS, rCut: C.DECL.rCutKpc,
  lambdaC: C.DECL.lambdaC, kappaV: C.DECL.kappaV, fd: Object.freeze([0.01, 0.02, 0.04]), quadRel: Object.freeze([1e-8, 1e-10, 1e-12]) });
export const QUICK = Object.freeze({ gridsF: Object.freeze([L.GRIDS[0]]), gridsN: Object.freeze([L.GRIDS[0], L.GRIDS[1]]), gridsSplit: Object.freeze([L.GRIDS[0]]), eps: Object.freeze([0, 0.3]),
  splitS: Object.freeze([1, 4]), rCut: Object.freeze([1, 4, 6]), lambdaC: Object.freeze([0, 1, 10]), kappaV: C.DECL.kappaV, fd: Object.freeze([0.02]), quadRel: Object.freeze([1e-10]) });
const { nrm, dot, add3, scl3, angDeg, relDiff } = C;
const RMAX = L.MW.RmaxKpc, V0 = L.FLOW.V0, VREF = [0, V0, 0], R0M = L.FLOW.R0kpc * L.KPC;
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

/* ───────── F 座標の補正 ───────── */
export function partF(plan) {
  const grids = [];
  for (const g of plan.gridsF) {
    const mw = L.mwLocal(g), t = mw.total, gb = C.gradBetaOf(t.GGC, t.GCo, VREF), back = C.sourceCurlOf(t.halfCurlCo, gb.gradBeta, VREF), obs = C.observerCurlOf(gb.gradBeta, VREF);
    const parts = mw.parts.map((p) => { const q = C.gradBetaOf(p.GGC, p.GCo, VREF); return { key: p.key, co: p.halfCurlCo[2], gc: p.halfCurlGC[2], obs: C.observerCurlOf(q.gradBeta, VREF)[2], beta: p.beta, dBetaDx: q.gradBeta[0] }; });
    grids.push({ grid: mw.grid, beta: t.beta, gradBeta: gb.gradBeta, rank1Rel: gb.rank1Rel, co: t.halfCurlCo.slice(), gc: t.halfCurlGC.slice(), back, backRel: C.vecRelOf(back, t.halfCurlGC, t.halfCurlCo),
      obs: obs[2], obsShare: obs[2] / t.halfCurlCo[2], srcShare: t.halfCurlGC[2] / t.halfCurlCo[2], parts });
  }
  // 環の積分の連続の値(成分ごと —— 円盤 4 は部分積分の形と u_φ の差分の 2 経路・バルジは静止で β だけ)
  const fd0 = C.DECL.fdKpc, ring = [];
  for (const D of L.MW.disks) {
    const w = C.ringCurlZ(D, 0, RMAX), wA = C.ringCurlZviaA(D, 0, RMAX, { rel: 1e-10 }), b = C.ringBetaDisk(D, 0, RMAX, L.FLOW.R0kpc), gx = C.ringGradBetaDisk(D, 0, RMAX);
    ring.push({ key: D.key, gc: w.omegaZ, gcViaA: wA, routeRel: relDiff(w.omegaZ, wA), beta: b, dBetaDx: gx, obs: -0.5 * V0 * gx, sheetHiRel: w.sheetHi / Math.abs(w.body), quadOk: w.quadOk });
  }
  { const b = C.ringBetaBulge(L.FLOW.R0kpc), gx = C.ringGradBetaBulge(); ring.push({ key: 'bulge', gc: 0, gcViaA: 0, routeRel: 0, beta: b, dBetaDx: gx, obs: -0.5 * V0 * gx, sheetHiRel: 0, quadOk: true }); }
  const sum = (k) => ring.reduce((s, r) => s + r[k], 0);
  const cont = { gc: sum('gc'), gcViaA: sum('gcViaA'), obs: sum('obs'), beta: sum('beta'), dBetaDx: sum('dBetaDx') };
  cont.co = cont.gc + cont.obs; cont.obsShare = cont.obs / cont.co; cont.srcShare = cont.gc / cont.co; cont.routeRel = relDiff(cont.gc, cont.gcViaA);
  cont.grid192RelCo = grids.length ? relDiff(grids[grids.length - 1].co[2], cont.co) : null;
  // 差分の幅と求積の許容の感度
  const fdRows = plan.fd.map((dl) => { let gx = 0; for (const D of L.MW.disks) gx += C.ringGradBetaDisk(D, 0, RMAX, { fdKpc: dl }); gx += C.ringGradBetaBulge({ fdKpc: dl }); return { fdKpc: dl, obs: -0.5 * V0 * gx }; });
  const quadRows = plan.quadRel.map((rel) => ({ rel, gc: L.MW.disks.reduce((s, D) => s + C.ringCurlZ(D, 0, RMAX, { rel }).omegaZ, 0) }));
  const spread = (rows, k) => { const v = rows.map((r) => r[k]); return v.length > 1 ? (Math.max(...v) - Math.min(...v)) / Math.abs(v[v.length - 1]) : 0; };
  return { vref: VREF, grids, ring, cont, fd0, fdRows, fdSpread: spread(fdRows, 'obs'), quadRows, quadSpread: spread(quadRows, 'gc') };
}

/* ───────── N 近傍のセルの積分(格子の感度)───────── */
export function partN(plan, F) {
  const diskW = (g, o) => { let w = 0, ns = 0; for (const D of L.MW.disks) { const r = C.diskCells(D, g, o); w += r.wgc; ns += r.nSplit; } return { w, ns }; };
  const ringSoft = (e) => L.MW.disks.reduce((s, D) => s + C.ringCurlZ(D, 0, RMAX, { epsKpc: e }).omegaZ, 0);
  const rows = [];
  for (const e of plan.eps) {
    const cont = e === 0 ? F.cont.gc : ringSoft(e), cells = plan.gridsN.map((g) => ({ nr: g.nr, w: diskW(g, { epsKpc: e }).w }));
    const fin = cells.slice(-2);
    rows.push({ epsKpc: e, cont, cells, finestRel: fin.map((c) => (c.w - cont) / Math.abs(cont)), signs: cells.map((c) => sgn(c.w)), signCont: sgn(cont),
      resolved: fin.length === 2 && fin.every((c) => Math.abs(c.w - cont) <= 0.05 * Math.abs(cont)) });
  }
  const split = [];
  for (const s of plan.splitS) {
    if (s === 1) continue;
    const cells = plan.gridsSplit.map((g) => { const r = diskW(g, { s, dlocKpc: C.DECL.splitDlocKpc }); return { nr: g.nr, w: r.w, nSplit: r.ns }; });
    split.push({ s, dlocKpc: C.DECL.splitDlocKpc, cells, rel: cells.map((c) => (c.w - F.cont.gc) / Math.abs(F.cont.gc)), signs: cells.map((c) => sgn(c.w)) });
  }
  // 第319便b の格子(ε = 0・分割なし)の再現: lib の点のセルの和(円盤 4)と mwLocal の ω_GC(バルジは静止で 0)
  const repro = F.grids.map((g, k) => { const c = rows.find((r) => r.epsKpc === 0); const w = c ? c.cells[k].w : diskW(plan.gridsF[k], {}).w; return { nr: g.grid.nr, lib: w, w319b: g.gc[2], rel: relDiff(w, g.gc[2]) }; });
  const raw = rows.find((r) => r.epsKpc === 0);
  return { rows, split, repro, rawSigns: raw ? raw.signs : null, signCont: sgn(F.cont.gc), rawSignDetermined: raw ? raw.signs.every((q) => q === raw.signs[0]) : null,
    softResolved: rows.filter((r) => r.resolved).map((r) => r.epsKpc), softSignsAgree: rows.filter((r) => r.resolved).every((r) => r.signs.slice(-2).every((q) => q === r.signCont)) };
}

/* ───────── P 中心と残余の重ならない分割 ───────── */
export function partP(plan, F) {
  const full = F.cont.gc, gB = C.ringGradBetaBulge(), Mb = C.bulgeMass(), rows = [];
  let Jt = 0, Mt = 0; for (const D of L.MW.disks) { const j = C.diskJ(D, 0, RMAX); Jt += j.J; Mt += j.M; }
  for (const rc of plan.rCut) {
    let inn = 0, res = 0, J = 0, M = 0, I = 0, gIn = gB, gRes = 0;
    for (const D of L.MW.disks) {
      inn += C.ringCurlZ(D, 0, rc).omegaZ; res += C.ringCurlZ(D, rc, RMAX).omegaZ;
      const j = C.diskJ(D, 0, rc); J += j.J; M += j.M; I += j.I; gIn += C.ringGradBetaDisk(D, 0, rc); gRes += C.ringGradBetaDisk(D, rc, RMAX);
    }
    const dip = C.dipoleHalfCurl([0, 0, J], [R0M, 0, 0])[2], bev = C.bevelLead(J, [0, 0, 1], [R0M, 0, 0])[2], RsrcKpc = Math.sqrt(2.5 * I / M) / L.KPC;
    const obsIn = -0.5 * V0 * gIn, obsRes = -0.5 * V0 * gRes;
    const row = { rCutKpc: rc, inner: inn, residual: res, sum: inn + res, addRel: (inn + res - full) / Math.abs(full), Jc: J, JcShare: J / Jt, Mc: M, McDiskPlusBulge: M + Mb, Ic: I, OmC: J / I,
      RsrcKpc, RsrcInside: RsrcKpc >= L.FLOW.R0kpc, dipole: dip, dipoleErr: (dip - inn) / Math.abs(inn), bevel: bev, bevelOverDipole: bev / dip, obsInner: obsIn, obsResidual: obsRes,
      coInner: inn + obsIn, coResidual: res + obsRes, innerOverResidual: inn / res,
      flipLambda: { A: res !== 0 ? -res / bev : null, B: res !== 0 ? -res / inn : null, Bco: -(res + obsRes) / (inn + obsIn) } };
    // 中心が優勢(|λ_c ω_cen| > |κ_v ω_res| —— κ_v = 1・λ_c = 1)
    row.dominant = { A: Math.abs(bev) > Math.abs(res), B: Math.abs(inn) > Math.abs(res), Bco: Math.abs(inn + obsIn) > Math.abs(res + obsRes) };
    rows.push(row);
  }
  // λ_c × κ_v の掃引(演算 A: 中心の bevel + 残余の半渦度〔銀河中心系〕・B: 両方とも半渦度〔銀河中心系〕・Bco: B の共動系〔受け手の動きの項を中心と残余に分けて含む〕)
  const sweep = [];
  for (const r of rows) for (const op of ['A', 'B', 'Bco']) for (const kv of plan.kappaV) for (const lc of plan.lambdaC) {
    const cen = op === 'A' ? r.bevel : op === 'B' ? r.inner : r.coInner, rs = op === 'Bco' ? r.coResidual : r.residual, w = lc * cen + kv * rs;
    sweep.push({ rCutKpc: r.rCutKpc, op, kappaV: kv, lambdaC: lc, cen: lc * cen, res: kv * rs, w, sign: sgn(w), ratioCenRes: rs !== 0 && kv !== 0 ? Math.abs(lc * cen) / Math.abs(kv * rs) : null, cenDominant: Math.abs(lc * cen) > Math.abs(kv * rs) });
  }
  return { full, Jt, Mt, Mbulge: Mb, rows, sweep, addMaxRel: Math.max(...rows.map((r) => Math.abs(r.addRel))) };
}

/* ───────── Shape 有限の分布の型(同じ総 J)───────── */
export function partShape(P, F) {
  const J = P.Jt, r0 = R0M, rMax = RMAX * L.KPC, rows = [];
  rows.push({ key: 'point', ja: '点の J 双極子(R ≤ R0 の一様な球と同じ)', RKpc: 0, wz: C.dipoleHalfCurl([0, 0, J], [r0, 0, 0])[2] });
  for (const R of C.DECL.sphereRKpc) { const Rm = R * L.KPC; rows.push({ key: 'uniform', ja: '一様な剛体の球', RKpc: R, rOverR: L.FLOW.R0kpc / R, inside: L.FLOW.R0kpc < R, wz: C.uniformSphereCurl(J, Rm, r0) }); }
  // 一様な球の殻の式の照合(閉じた式と殻の積分 —— 半径 11.2159 kpc)
  { const Rm = 11.2159 * L.KPC, rho = (q) => (q <= Rm ? 1 : 0), Om0 = 1, s = C.shellCurl(rho, () => Om0, r0, Rm), k = J / s.J; rows.push({ key: 'uniformShellCheck', ja: '一様な剛体の球(殻の積分 —— 閉じた式の照合)', RKpc: 11.2159, wz: s.wz * k, closed: C.uniformSphereCurl(J, Rm, r0) }); }
  for (const rs of C.DECL.concScaleKpc) {
    const rsm = rs * L.KPC, rho = (q) => Math.exp(-q / rsm);
    const s1 = C.shellCurl(rho, () => 1, r0, rMax), k1 = J / s1.J;
    rows.push({ key: 'concRigid', ja: '中心に集中した球(ρ ∝ e^(−r/r_s)・剛体の回転・r ≤ 40 kpc)', scaleKpc: rs, wz: s1.wz * k1, inner: s1.inner * k1, outer: s1.outer * k1 });
    const s2 = C.shellCurl(rho, (q) => C.vOf(q / L.KPC) / q, r0, rMax), k2 = J / s2.J;
    rows.push({ key: 'concDiff', ja: '中心に集中した球(殻ごとの差動回転 Ω(r) = V(r)/r)', scaleKpc: rs, wz: s2.wz * k2, inner: s2.inner * k2, outer: s2.outer * k2 });
  }
  for (const D of L.MW.disks) { const j = C.diskJ(D, 0, RMAX), w = F.ring.find((r) => r.key === D.key).gc; rows.push({ key: 'diskComp', ja: '円盤の成分(同じ総 J に規格化)', comp: D.key, Jcomp: j.J, wz: w * J / j.J, wzRaw: w }); }
  rows.push({ key: 'model', ja: '宣言の模型(円盤 4 + 静止のバルジ —— 環の積分)', wz: F.cont.gc });
  const signs = rows.filter((r) => r.key !== 'uniformShellCheck').map((r) => sgn(r.wz));
  return { J, rows, nPos: signs.filter((q) => q > 0).length, nNeg: signs.filter((q) => q < 0).length, zeroRatio: Math.sqrt(5 / 6), shellCheckRel: relDiff(rows.find((r) => r.key === 'uniformShellCheck').wz, rows.find((r) => r.key === 'uniformShellCheck').closed) };
}

/* ───────── D 「中心」の宣言の型 ───────── */
export function partD(P) {
  const ga = galaxyAxis(), Om = ga.OmRefSI, MG = mG318(), RdG = L.YK * MG, Jt = P.Jt, x = [R0M, 0, 0];
  const Jnow = 0.4 * MG * RdG * RdG * Om, rSrc = (M) => Math.sqrt(2.5 * Jt / (M * Om));
  const proxy = [
    { key: 'pxNow', ja: '代理・今(R_src = R_d = Y_k M_G・自転 Ω_ref ĝ)', M: MG, RsrcM: RdG, J: Jnow, inside: false, bevel: C.bevelLead(Jnow, [0, 0, 1], x)[2], halfCurl: C.dipoleHalfCurl([0, 0, Jnow], x)[2] },
    { key: 'pxJg', ja: '代理・J(J = 模型の円盤の J・質量 M_G —— 等価の一様な球)', M: MG, RsrcM: rSrc(MG), J: Jt },
    { key: 'pxJt', ja: '代理・J(J = 模型の円盤の J・質量 = 模型の円盤 + バルジ —— 第319便b の cP3 と同じ型)', M: P.Mt + P.Mbulge, RsrcM: rSrc(P.Mt + P.Mbulge), J: Jt }];
  for (const p of proxy.slice(1)) { p.inside = p.RsrcM > R0M; p.bevel = p.inside ? null : C.bevelLead(Jt, [0, 0, 1], x)[2]; p.halfCurl = C.uniformSphereCurl(Jt, p.RsrcM, R0M); }
  for (const p of proxy) p.RsrcKpc = p.RsrcM / L.KPC;
  // 重ならない成分の和の受理・拒否(実在: 中心 = バルジ + R < R_cut の円盤・残余 = R ≥ R_cut の円盤 /代理: 全成分を持つ)
  const disks = ['disk:thin', 'disk:thick', 'disk:HI', 'disk:H2'], cases = [];
  const tryC = (key, ja, terms, expect) => { let ok = true, err = null; try { C.combineDisjoint(terms); } catch (e) { ok = false; err = String(e.message || e); } cases.push({ key, ja, accepted: ok, expect, err, same: ok === expect }); };
  const cen = (rc) => ({ key: 'center', omega: [0, 0, 1], owns: [{ comp: 'bulge' }].concat(disks.map((c) => ({ comp: c, lo: 0, hi: rc }))) });
  const res = (rc) => ({ key: 'residual', omega: [0, 0, 1], owns: disks.map((c) => ({ comp: c, lo: rc, hi: Infinity })) });
  tryC('real4', '実在の中心(バルジ + R < 4 kpc)+ 残余(R ≥ 4 kpc)', [cen(4), res(4)], true);
  tryC('realOverlap', '実在の中心(R < 5 kpc)+ 残余(R ≥ 4 kpc)—— 4〜5 kpc が重なる', [cen(5), res(4)], false);
  tryC('proxyPlusRes', '代理(全成分)+ 残余(R ≥ 4 kpc)—— 同じ円盤の流れを二度', [{ key: 'proxy', omega: [0, 0, 1], owns: [{ comp: 'galaxy:proxy' }] }, res(4)], false);
  tryC('proxyAlone', '代理だけ(κ_v = 0 の型)', [{ key: 'proxy', omega: [0, 0, 1], owns: [{ comp: 'galaxy:proxy' }] }], true);
  tryC('bulgeTwice', 'バルジを中心と残余の両方に', [cen(4), { key: 'residual', omega: [0, 0, 1], owns: [{ comp: 'bulge' }] }], false);
  return { MG, MGsun: MG / L.MSUN, OmRef: Om, RdG, proxy, cases, allSame: cases.every((c) => c.same) };
}

/* ───────── B 演算の比べ ───────── */
export function partB(P) {
  const J = P.Jt, rows = [];
  for (const th of [0, 30, 54.7356103172, 60, 90]) {
    const t = th * Math.PI / 180, x = [R0M * Math.sin(t), 0, R0M * Math.cos(t)], b = C.bevelLead(J, [0, 0, 1], x), h = C.dipoleHalfCurl([0, 0, J], x);
    rows.push({ thetaDeg: th, bevel: b, halfCurl: h, bevelAbs: nrm(b), halfCurlAbs: nrm(h), ratio: nrm(h) > 0 ? nrm(b) / nrm(h) : null, angDeg: nrm(b) > 0 && nrm(h) > 0 ? angDeg(b, h) : null });
  }
  const candidates = [
    { key: 'A', ja: '混成: ω_nb = λ_c ω_center^bevel + κ_v ω_res^½curl(銀河中心系)', sameOp: false, partitionFree: false, free: ['κ_v', 'λ_c', 'R_cut'], newAssump: ['半渦度を軸の ω へつなぐ対応(κ_v)', '中心と残余に別の演算'] },
    { key: 'B', ja: '半渦度でそろえる: ω_nb = λ_c ω_center^½curl + κ_v ω_res^½curl(銀河中心系)', sameOp: true, partitionFree: true, free: ['κ_v'], newAssump: ['半渦度を軸の ω へつなぐ対応(κ_v —— 中心にも)'] },
    { key: 'B4', ja: 'B に面内の J 双極子の bevel/半渦度の比 4 を掛ける: ω_nb = 4κ_v ω^½curl', sameOp: true, partitionFree: true, free: ['κ_v'], newAssump: ['比 4 は面内の双極子の場でだけ(面の外・近傍の流れでは同じでない)'] },
    { key: 'Bco', ja: 'B の共動系(受け手の動きの項 −½∇β × V_ref を含む)', sameOp: true, partitionFree: true, free: ['κ_v', 'V_ref'], newAssump: ['受け手の公転の動きが軸へ入る(今のエンジンの bevel の主項に対応する項が無い)'] },
    { key: 'P', ja: '代理だけ: ω_nb = ω_proxy(全体の有効中心質量 —— 残余を足さない)', sameOp: true, partitionFree: true, free: ['R_src の型'], newAssump: ['銀河の全体を中心の 1 つの源に数える'] }];
  return { J, rows, inPlaneRatio: rows.find((r) => r.thetaDeg === 90).ratio, onAxisBevel: rows.find((r) => r.thetaDeg === 0).bevelAbs, onAxisHalfCurl: rows.find((r) => r.thetaDeg === 0).halfCurlAbs, candidates };
}

/* ───────── R 6 天体 ───────── */
export function bodiesOf(E) {
  const st = stateOf(E, book16()); if (!st.ok) throw new Error('16 体の写しが受理されない: ' + st.err);
  const P = pOf(st.S, st.isq), IN = JSON.parse(fs.readFileSync(path.join(ROOT, INPUT16), 'utf8')), R = IN.bodies.map((b) => b.radius), rule = E.ruleK1(st.isq.decl.order || 8), capL = L.CAP_SRC_M / L.LU;
  const a3 = L.planArrays('p3', P, R, capL), out = [];
  for (const ro of L.ROLES) {
    const i = ro.i, q3 = L.k1RecvSrc(rule, P, i, { gain: 1, Rsrc: a3.Rsrc }), q0 = L.k1RecvSrc(rule, P, i, { gain: 1 });
    const w3 = q3.src.find((z) => z.j === 0).omega.map((v) => v / L.TU), w0 = q0.src.find((z) => z.j === 0).omega.map((v) => v / L.TU), Om = [P.ax[i], P.ay[i], P.az[i]].map((v) => v * P.spin[i] / L.TU);
    out.push({ i, name: L.BODY16[i], role: ro.role, Om, wSunP3: w3, wSunNow: w0 });
  }
  return { bodies: out, warnings: st.warnings };
}
export function partR(BD, P, D, F) {
  const ga = galaxyAxis(), g = ga.g, r4 = P.rows.find((r) => r.rCutKpc === 4) || P.rows[Math.floor(P.rows.length / 2)], r5 = P.rows.find((r) => r.rCutKpc === 5) || P.rows[P.rows.length - 1];
  const pxJt = D.proxy.find((p) => p.key === 'pxJt'), pxNow = D.proxy.find((p) => p.key === 'pxNow');
  const cands = [
    { key: 'pxNow', ja: '代理・今(bevel の主項)', w: pxNow.bevel },
    { key: 'pxJt', ja: '代理・J(等価の一様な球の内側の半渦度 —— 第319便b の cP3 の型)', w: pxJt.halfCurl },
    { key: 'cenA', ja: '実在・中心だけ(κ_v = 0・bevel・R_cut ' + r4.rCutKpc + ' kpc)', w: r4.bevel },
    { key: 'cenB', ja: '実在・中心だけ(κ_v = 0・半渦度・R_cut ' + r4.rCutKpc + ' kpc)', w: r4.inner },
    { key: 'A1', ja: '実在・κ_v = 1・A(R_cut ' + r4.rCutKpc + ' kpc)', w: r4.bevel + r4.residual },
    { key: 'B1', ja: '実在・κ_v = 1・B(= 全場の源の半渦度 —— R_cut に依らない)', w: F.cont.gc },
    { key: 'B4', ja: '実在・κ_v = 1・B4(4 × 全場の源の半渦度)', w: 4 * F.cont.gc },
    { key: 'Bco', ja: '実在・κ_v = 1・B の共動系(受け手の動きの項を含む)', w: F.cont.co },
    { key: 'resOnly', ja: '残余だけ(λ_c = 0・κ_v = 1・R_cut ' + r5.rCutKpc + ' kpc —— 比べの列)', w: r5.residual },
    { key: 'B1lc10', ja: '実在・κ_v = 1・B・λ_c = 10(R_cut ' + r4.rCutKpc + ' kpc)', w: 10 * r4.inner + r4.residual }];
  for (const c of cands) c.vec = scl3(g, c.w);
  const rows = BD.bodies.map((b) => {
    const OmAbs = nrm(b.Om), cs3 = C.composeOf(b.Om, b.wSunP3), j = {};
    for (const c of cands) { const q3 = C.judgeOf(b.Om, b.wSunP3, c.vec), q0 = C.judgeOf(b.Om, b.wSunNow, c.vec); j[c.key] = { galDecel: q3.galDecel, antag: q3.antag, sumDecel: q3.sumDecel, flipBySum: q3.flipBySum, galOverSun: q3.galOverSun, angOmGal: q3.angOmGal, angSunGal: angDeg(b.wSunP3, c.vec), sumDecelNow: q0.sumDecel, galOverSunNow: q0.galOverSun }; }
    return { i: b.i, name: b.name, role: b.role, Om: b.Om, OmAbs, OmDotG: dot(b.Om, g) / OmAbs, angOmG: angDeg(b.Om, g), wSunP3: b.wSunP3, wSunP3Abs: nrm(b.wSunP3), angOmSunP3: cs3.thetaDeg, sunDecelP3: cs3.decel,
      wSunNowAbs: nrm(b.wSunNow), sunDecelNow: C.composeOf(b.Om, b.wSunNow).decel, judge: j };
  });
  // 掃引の全候補(P.sweep)の向きごとの拮抗の印(6 天体 —— 太陽の項は案3 J)
  const bits = (w) => BD.bodies.map((b) => { const q = C.judgeOf(b.Om, b.wSunP3, scl3(g, w)); return q.antag === null ? '-' : q.antag ? '1' : '0'; }).join('');
  const sweepBits = P.sweep.map((s) => ({ rCutKpc: s.rCutKpc, op: s.op, kappaV: s.kappaV, lambdaC: s.lambdaC, sign: s.sign, antag: s.w !== 0 ? bits(s.w) : '------' }));
  const bitsPlus = bits(1e-22), bitsMinus = bits(-1e-22);
  const tally = { plus: sweepBits.filter((s) => s.sign > 0).length, minus: sweepBits.filter((s) => s.sign < 0).length, zero: sweepBits.filter((s) => s.sign === 0).length };
  return { g, cands: cands.map((c) => ({ key: c.key, ja: c.ja, w: c.w, sign: sgn(c.w) })), rows, sweepBits, bitsPlus, bitsMinus, tally, order: BD.bodies.map((b) => b.name) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {};
  G.fBack = !!(J.F && J.F.grids.every((g) => g.backRel <= 1e-9 && g.rank1Rel <= 1e-9));
  G.fRoutes = !!(J.F && J.F.ring.every((r) => r.routeRel <= 1e-7) && J.F.cont.routeRel <= 1e-7);
  G.fQuad = !!(J.F && J.F.quadSpread <= 1e-9 && J.F.fdSpread <= 1e-6);
  G.nRepro = !!(J.N && J.N.repro.every((r) => r.rel <= 1e-10));
  G.pAdd = !!(J.P && J.P.addMaxRel <= 1e-10);
  G.tShell = !!(J.Shape && J.Shape.shellCheckRel <= 1e-8);
  G.dCases = !!(J.D && J.D.allSame);
  G.rBodies = !!(J.R && J.R.rows.length === 6);
  return G;
}

/* ───────── 実行 ───────── */
export async function runNbCompose(E, o) {
  const P0 = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'nbcompose', quick: !!o.quick, plan: clone(P0), coef: C.COEF, kDip: C.KDIP, decl: clone(C.DECL), flow: clone(L.FLOW), mwDecl: clone(L.MW) };
  J.F = partF(P0); tick('F');
  J.N = partN(P0, J.F); tick('N');
  J.P = partP(P0, J.F); tick('P');
  J.Shape = partShape(J.P, J.F); tick('Shape');
  J.D = partD(J.P); tick('D');
  J.B = partB(J.P); tick('B');
  const BD = bodiesOf(E); tick('Rload');
  J.R = partR(BD, J.P, J.D, J.F); J.R.warnings = BD.warnings; tick('R');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  return J;
}
export async function main() {
  const TARGET = process.env.W320C_TARGET || 'beta/index.html', quick = process.env.W320C_QUICK === '1';
  const OUT = process.env.W320C_OUT ? (path.isAbsolute(process.env.W320C_OUT) ? process.env.W320C_OUT : path.join(ROOT, process.env.W320C_OUT)) : path.join(ROOT, OUT_NBCOMPOSE);
  if (quick && !process.env.W320C_OUT) throw new Error('試走(W320C_QUICK=1)は W320C_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html), E = portsOf(HP, globalThis);
  console.log('第320便c nbcompose: ' + (quick ? '試走' : '正本') + '・1 プロセス');
  const R = await runNbCompose(E, { quick, plan: quick ? QUICK : PLAN });
  const out = { version: HARNESS_VERSION, libVersion: C.LIB_VERSION, generator: 'tests/exp-w320c-nbcompose.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(第122報)・決断事項 AN472「中心１体の影響が大きいが、銀河の渦の中では半渦度は無視出来ない。太陽系近傍においては合成された影響になる」・AN473・'
      + '統括の検証項目 R264。エンジン・在位の本・受け手の R_d = Y_k m・規則は変えない(器・lib・正本・文書だけ)。半渦度を受け手の軸へ直結する項はエンジンに足さない',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w320c-nbcompose.mjs', 'tests/lib-w320c-nbcompose.mjs', 'tests/exp-w319b-srcradius.mjs', 'tests/lib-w319b-srcradius.mjs', 'tests/lib-w318d-dragest.mjs', 'tests/lib-w317c-satcut.mjs',
    'tests/lib-w315d-satk1.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第320便c', target: TARGET, code: CODE, inputs: [TARGET, INPUT16] }), {
    harnessVersion: HARNESS_VERSION, stage: 'nbcompose',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス・步は進めない)',
    literature: ['天の川銀河の質量の模型の入力(第319便b の MW —— 文献の模型の入力の転記・本便は一次資料に当たっていない)'],
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

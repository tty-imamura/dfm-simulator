// 第327便a(原仮定者の回答(2026-11-05 —— AN534・AN535・AN537)・統括の検証項目 R295): **軸引きずりの「角速度の和」の族 S(主)と否定対照の族 E・金星の引きずり半径の格子と根・
//   天体ごとに自由な潮汐と法則の探索・予言の段・帳簿の器**(段 axialsum-327a —— 正本 tests/out/axialsum-w327a.json・lib tests/lib-w327a-axialsum.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・beta/index.html は変えない(🗺️ の写しにだけ宣言を足す —— 金星の dragCore を写しで振るのは受理器を回り込まない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第326便d の器の写しと読み口〔partI・partK・copyBook・stateOf〕をそのまま使う ——
//   K1 の核の式を写さない)。入力は html だけ(他の正本・データは読まない)。1 プロセス(子プロセスなし)。t = 0 の読み口と純関数だけ(步を進めない)。
//
// ■ 何をするか(入力は在位の 🗺️ solarSystem16Inertial3d の J2000 の転記 —— 新たに一次資料を取らない)
//   S(AN534)族 S(和 —— 配分は均等が主・銀河に 0.9/0.1 は感度)と族 E(平均 —— 否定対照)を p の格子で解く(太陽の式の A・天体ごとの潮汐の係数 β・採否・族 S の p の端)・
//     族 E は第326便d の lib の解と同じ数(照合)
//   V(AN535)太陽と木星の核は K1 に固定・受け手の金星の R_d だけを格子で振る(源 2 列 × 銀河の応答の規約 6 列 × 族 2)。各点で K1 の核・自己の規格化をエンジンが作り直す。
//     4 天体の潮汐の係数が全部非負の R_d の区間(境界は k_V = 0 の根 —— 格子の隣り合う点の符号の変化を二分法で)・重なりは評価域の外(境界を二分法で)・求積の次数の感度・
//     K1 の規則の R_d・観測半径・密度と比べる表・固体の R_d の規則を地球に当てた検査(合わせない —— イオは参考の列)
//   T(AN537)天体ごとに自由な非負の潮汐の係数(負は不採用で 0 に丸めない)・法則を探す表(距離・質量・半径・密度・固体と気体・古典の尺度・文献の k2/Q は比べる列)・
//     金星・木星・イオで決めた則を固定して地球・土星へ当てる予言の段(合う・合わないを記録 —— 合わせない)
//   H 帳簿(候補ごとに由来別の Q・P・供給・軌道の仕事・放射・閉じ)・配分と尺度の感度
//   P 純関数の場面(lib の pureScenes —— QA lint.axialSum327a と同じ)
// ■ 言わないこと: 金星の逆回転・内部熱の説明ではない・銀河場の同定と数えない・格子で見つけた R_d を在位の本へ入れない(根が無くても「解なし」を全部の模型の否定に広げない)・
//   負の係数を 0 へ丸めない・地球と土星で合わせない・応答の尺度 Γ は宣言のノブ(内部熱を観測の熱流に合わせていない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as X from './exp-w326d-axialheat.mjs';
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— roots は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs と第326便d の器の綴りが数えられた分。
//   presets は器が .find で引く在位の本 1 本だけ)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","ctx","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w327a-axialsum-1';
export const OUT_MAIN = 'tests/out/axialsum-w327a.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違える)
export const NOT_CLAIM = Object.freeze(['金星の逆回転の説明ではない(条件と残差つきの記録)', '内部熱の説明ではない(応答の尺度 Γ は宣言のノブ —— 観測の熱流に合わせていない)',
  '銀河場の同定と数えない(A は「太陽の口が銀河だけ」という接続の帰結)', '格子の R_d は採らない(在位の本へ入れない —— 根が無いことを全部の模型の否定に広げない)',
  '負の係数を要する解は不採用(0 へ丸めない)', '地球と土星は検査と予言だけ(合わせていない)', '配分 w は宣言の構成則(観測で決まった値ではない)', '族 E の「要る大きさ」の記録は族 E・今の R_d・K1 固定の条件つき']);
const SOLVE = E.DECL.solveBodies, CHECK = E.DECL.checkBodies;

/* ───────── 入力の補い(潮汐の対の距離と軌道長半径・密度・古典の尺度)───────── */
/** 二体の接触の軌道長半径と距離(SI —— 第326便d の orbitOmega と同じ式の μ) */
function orbitGeom(book, ci, oi, uL) {
  const a = book.bodies[ci], b = book.bodies[oi], r = [b.x - a.x, b.y - a.y, b.z - a.z], v = [b.vx - a.vx, b.vy - a.vy, b.vz - a.vz];
  const mu = book.physics.G * (a.m + b.m), sma = 1 / (2 / E.norm(r) - E.dot(v, v) / mu);
  return { sma: sma * uL, dist: E.norm(r) * uL };
}
const TIDE_PAIR = (recv, raiser) => ({ 'venus:sun': ['sun', 'venus'], 'jupiter:sun': ['sun', 'jupiter'], 'jupiter:io': ['jupiter', 'io'], 'io:jupiter': ['jupiter', 'io'],
  'earth:sun': ['sun', 'earth'], 'earth:moon': ['earth', 'moon'], [SAT + ':sun']: ['sun', SAT], [SAT + ':titan']: [SAT, 'titan'] })[recv + ':' + raiser];
const G_SI = 6.6743e-11;   // 古典の潮汐の尺度の G(SI —— 法則の候補の重みの単位をそろえるだけ。比の門は G に依らない)
export function featuresOf(I) {
  const book = I.st.preset, uL = I.units.lenSI, out = {};
  for (const key of SOLVE.concat(CHECK)) {
    const b = I.bodies[key], P = E.DECL.ports[key], tides = [];
    for (const raiser of P.tide) {
      const [c, o] = TIDE_PAIR(key, raiser), gm = orbitGeom(book, X.IDX[c], X.IDX[o], uL), Mj = I.bodies[raiser].m;
      const Xc = b.I ? G_SI * Mj * Mj * Math.pow(b.R, 5) / (Math.pow(gm.sma, 6) * b.I) : null;
      tides.push({ raiser, Mraiser: Mj, sma: gm.sma, dist: gm.dist, nAlong: E.dot(I.tides[key + ':' + raiser], b.a), X: Xc });
    }
    const dom = tides.slice().sort((p, q) => q.X - p.X)[0] || null;
    out[key] = { key, phase: LS.DECL.phase[key], m: b.m, R: b.R, rho: b.m / (4 / 3 * Math.PI * Math.pow(b.R, 3)), s: b.s, I: b.I, Rd: b.Rd, tides, dominant: dom ? dom.raiser : null,
      aDominant: dom ? dom.sma : null, Xsum: tides.reduce((s, t) => s + t.X, 0), k2Q: LS.DECL.k2Q[key] === undefined ? null : LS.DECL.k2Q[key], k2: LS.DECL.k2[key] === undefined ? null : LS.DECL.k2[key] };
  }
  out.sun = { key: 'sun', phase: LS.DECL.phase.sun, m: I.bodies.sun.m, R: I.bodies.sun.R, rho: I.bodies.sun.m / (4 / 3 * Math.PI * Math.pow(I.bodies.sun.R, 3)), Rd: I.bodies.sun.Rd };
  return out;
}

/* ───────── 系(lib-w327a の形)───────── */
/** 銀河の応答 f_i = (R_d,i^規則/R_d,☉)^p × (R_d,i/R_d,i^規則)^q(規則の天体では第326便d の (R_d,i/R_d,☉)^p と同じビット) */
export function responseF(I, key, p, q, RdNow) {
  const Rr = I.bodies[key].Rd, base = Math.pow(Rr / I.bodies.sun.Rd, p);
  return RdNow === undefined || RdNow === Rr ? base : base * Math.pow(RdNow / Rr, q);
}
/** 系を組む: keys の天体・p・q・tOver(伝達の差し替え {'recv:src': t})・RdOver({key: R_d})・tideW(法則の重み {'recv:raiser': y}) */
export function systemOf(I, K, keys, p, o = {}) {
  const q = o.q === undefined ? 0 : o.q;
  return keys.map((key) => {
    const b = I.bodies[key], P = E.DECL.ports[key], Rd = o.RdOver && o.RdOver[key] !== undefined ? o.RdOver[key] : b.Rd, ports = [{ kind: 'gal' }];
    for (const src of P.k1) ports.push({ kind: 'k1', src, t: (o.tOver && o.tOver[key + ':' + src]) || K.t[key + ':' + src] });
    for (const raiser of P.tide) ports.push({ kind: 'tide', src: raiser, n: I.tides[key + ':' + raiser], y: o.tideW ? o.tideW[key + ':' + raiser] : 1 });
    return { key, s: b.s, a: b.a, f: key === 'sun' ? 1 : responseF(I, key, p, q, Rd), Rd, ports };
  });
}
export function paramsOf(I, family, alloc = 'equal', lam = 1) {
  const gamma0 = Object.fromEntries(Object.values(I.bodies).filter((b) => b.I).map((b) => [b.key, b.I * lam]));
  return { family, g: I.g, gamma0, beta: {}, alloc: LS.DECL.allocations[alloc] };
}
export function solveAt(I, K, keys, p, family, o = {}) {
  const sys = systemOf(I, K, keys, p, o), prm = paramsOf(I, family, o.alloc || 'equal', o.lam || 1);
  return Object.assign(LS.solve(sys, prm), { sys, prm });
}
const pick = (r, keys) => Object.fromEntries(keys.filter((k) => k !== 'sun').map((k) => [k, r.beta[k]]));
const rejOf = (r) => r.rows.filter((q) => q.rejected === true).map((q) => q.key);

/* ───────── S(AN534)族 S と族 E ───────── */
/** 族 S の p の端(Γ にも配分にも依らない —— T(p) = A f(p) ĝ·â + K と潮汐の目標の凸包)。K = 潮汐でない口の K1 の寄与と反作用/Γ⁰ */
export function edgeS(I, K, key, p0 = 0) {
  const r = solveAt(I, K, SOLVE.includes(key) ? SOLVE : ['sun', key], p0, 'S'), row = r.rows.find((q) => q.key === key), lin = r.lin.find((q) => q.key === key), b = I.bodies[key];
  const g0 = b.I, Kc = lin.c0 / g0 + b.s, gA = E.dot(I.g, b.a), Ag = r.A * gA, x = b.Rd / I.bodies.sun.Rd, tt = E.DECL.ports[key].tide.map((z) => E.dot(I.tides[key + ':' + z], b.a));
  const allBelow = tt.every((v) => v < b.s), allAbove = tt.every((v) => v > b.s);
  if (!allBelow && !allAbove) return { kind: 'all', p: null, why: '潮汐の目標が s を挟む' };
  const need = allBelow ? 'T>=s' : 'T<=s', arg = (b.s - Kc) / Ag;
  if (!(arg > 0)) return { kind: 'none', p: null, need, K: Kc, Ag, why: '銀河の寄与の符号が要る向きと逆(どの p でも入らない)' };
  const ps = Math.log(arg) / Math.log(x), le = (need === 'T>=s') === (Ag > 0) === (x < 1);
  return { kind: le ? 'le' : 'ge', p: ps, need, K: Kc, Ag, x, rowNonTideAtP0: row.nonTide };
}
export function partS(I, Know, KJ) {
  const fam = {};
  for (const [kv, K] of [['now', Know], ['J', KJ]]) {
    fam[kv] = {};
    for (const [nm, family, alloc] of [['S', 'S', 'equal'], ['S_galHeavy', 'S', 'galHeavy'], ['S_k1Heavy', 'S', 'k1Heavy'], ['E', 'E', 'equal']]) {
      fam[kv][nm] = LS.DECL.pGrid.map((p) => {
        const r = solveAt(I, K, SOLVE, p, family, { alloc });
        const chk = Object.fromEntries(CHECK.map((key) => { const c = solveAt(I, K, ['sun', key], p, family, { alloc }); return [key, { beta: c.beta[key], rejected: c.rows.find((q) => q.key === key).rejected }]; }));
        return { p, A: r.A, beta: pick(r, SOLVE), rejected: rejOf(r), accepted: r.accepted, alongMaxRel: r.alongMaxRel, checks: chk, heat: r.ev.ledger.heat };
      });
    }
  }
  // 族 E の対照は第326便d の lib の解と同じ数(同じ p の格子・同じ口)
  const old = X.partS(I, Know), oldJ = X.partS(I, KJ);
  const sameE = (cur, ref) => Math.max(...cur.map((q, k) => Math.max(E.relD(q.A, ref.grid[k].A), ...Object.keys(q.beta).map((z) => E.relD(q.beta[z], ref.grid[k].k[z])))));
  const edges = {};
  for (const key of SOLVE.concat(CHECK).filter((k) => k !== 'sun')) edges[key] = { S: edgeS(I, Know, key), E: old.edges[key] ? old.edges[key].familyE : null, hull: old.edges[key] ? old.edges[key].hull : null };
  for (const key of CHECK) { const h = X.hullAt(I, Know, key, old.sunExact.A, 0); edges[key].hull = h.bound; }
  // 配分の感度(族 S の定常は配分に依らない —— 反作用の分を除く)と熱の比
  const allocSens = LS.DECL.pGrid.map((p, k) => ({ p, betaRelGal: Math.max(...SOLVE.filter((z) => z !== 'sun').map((z) => E.relD(fam.now.S_galHeavy[k].beta[z], fam.now.S[k].beta[z]))),
    betaRelK1: Math.max(...SOLVE.filter((z) => z !== 'sun').map((z) => E.relD(fam.now.S_k1Heavy[k].beta[z], fam.now.S[k].beta[z]))),
    heatRatioGal: fam.now.S_galHeavy[k].heat / fam.now.S[k].heat, heatRatioK1: fam.now.S_k1Heavy[k].heat / fam.now.S[k].heat }));
  return { families: fam, edges, sameAsW326d: { now: sameE(fam.now.E, old), J: sameE(fam.J.E, oldJ) }, sunA: { S: fam.now.S[0].A, E: fam.now.E[0].A, w326d: old.sunExact.A }, allocSens };
}

/* ───────── V(AN535)金星の受け手の R_d ───────── */
export function buildAt(HP, I, src, o) {
  const opt = {};
  if (src === 'J') opt.sm = { kind: 'J', f: X.SRC_F };
  if (o.dragCore) opt.dragCore = Object.fromEntries(Object.entries(o.dragCore).map(([i, R]) => [i, { massFrac: 1, radius: R / I.units.lenSI }]));
  const book = X.copyBook(HP, opt);
  if (o.order !== undefined) book.physics.relativeDrag.invSq.order = o.order;
  const st = X.stateOf(HP, book);
  if (!st.ok) return { ok: false, err: st.err };
  if (st.isq.overlap || st.isq.noR || !st.isq.receivers.length) return { ok: false, outside: true, overlap: st.isq.overlap, noR: st.isq.noR };
  const t = {}, uT = I.units.timeSI;
  for (const [recv, P] of Object.entries(E.DECL.ports)) for (const s of P.k1) {
    const r = st.isq.receivers.find((q) => q.i === X.IDX[recv]);
    if (!r) continue;
    t[recv + ':' + s] = r.omegaSrc.slice(X.IDX[s] * 4, X.IDX[s] * 4 + 3).map((z) => z / st.S.spin[X.IDX[s]]);
  }
  const RdOf = (i) => { const r = st.isq.receivers.find((q) => q.i === i); return r ? r.Rd * I.units.lenSI : null; };
  return { ok: true, t, RdOf, uT };
}
const sameVec = (a, b) => E.norm(E.sub(a, b)) <= 1e-12 * Math.max(E.norm(a), E.norm(b), 1e-300);
export function venusGrid(I) {
  const D = LS.DECL.venusRd, R0 = I.bodies.venus.Rd, set = new Set();
  for (const m of D.k1Mult) set.add(R0 * m);
  for (const e of D.absLog10) set.add(Math.pow(10, e));
  set.add(I.bodies.venus.R);
  return [...set].sort((a, b) => a - b);
}
/** 一点の解(規約 c・族 F): 金星の潮汐の係数・4 天体の採否・決め手の量(族 S は T_V − s_V・族 E は口の目標の和 − 2 s_V)と K1 の項に要る倍率 */
export function venusPoint(I, K0, tV, RdV, conv, family) {
  const o = { q: conv.q, RdOver: { venus: RdV }, tOver: { 'venus:sun': tV } }, r = solveAt(I, K0, SOLVE, conv.p, family, o), b = I.bodies.venus;
  const row = r.rows.find((q) => q.key === 'venus'), sys = r.sys.find((q) => q.key === 'venus'), vSun = I.bodies.sun.s * E.dot(tV, b.a), vGal = r.A * sys.f * E.dot(I.g, b.a);
  const lam = family === 'S' ? (b.s - vGal) / vSun : (2 * b.s - vGal) / vSun;   // A を固定・金星は源でない(反作用なし)—— k_V = 0 の倍率(採らない)
  return { beta: row.beta, rejected: row.rejected, nonTide: row.nonTide, accepted: r.accepted, rejectedKeys: rejOf(r), fV: sys.f, vGal, vSun, lambdaNeed: lam, alongMaxRel: r.alongMaxRel,
    betaJ: r.beta.jupiter, betaIo: r.beta.io };
}
export function partV(HP, I, Know, KJ) {
  const grid = venusGrid(I), D = LS.DECL.venusRd, out = { grid, sources: {} };
  for (const src of LS.DECL.sources) {
    const K0 = src === 'J' ? KJ : Know, pts = [];
    for (const R of grid.concat(D.overlapProbe)) {
      const z = buildAt(HP, I, src, { dragCore: { 2: R } });
      if (!z.ok) { pts.push({ Rd: R, ok: false, outside: !!z.outside, overlap: z.overlap || null, err: z.err || null }); continue; }
      const others = ['jupiter:sun', 'io:sun', 'io:jupiter'].every((k) => sameVec(z.t[k], K0.t[k]));
      const row = { Rd: R, ok: true, RdApplied: z.RdOf(2), RdAppliedRel: E.relD(z.RdOf(2), R), othersSame: others, tV: z.t['venus:sun'], vSunAlong: I.bodies.sun.s * E.dot(z.t['venus:sun'], I.bodies.venus.a), cols: {} };
      for (const c of LS.DECL.conventions) for (const F of ['S', 'E']) row.cols[c.key + ':' + F] = venusPoint(I, K0, z.t['venus:sun'], R, c, F);
      pts.push(row);
    }
    const okp = pts.filter((q) => q.ok);
    // 重なりの境界(最後の評価域の点と最初の外の点の間を二分法 —— 対数の軸)
    const lastIn = okp[okp.length - 1], firstOut = pts.find((q) => !q.ok && q.outside && q.Rd > lastIn.Rd);
    let overlapEdge = null;
    if (lastIn && firstOut) {
      let lo = lastIn.Rd, hi = firstOut.Rd;
      for (let k = 0; k < D.bisectIter; k++) { const m = Math.sqrt(lo * hi), z = buildAt(HP, I, src, { dragCore: { 2: m } }); if (z.ok) lo = m; else hi = m; }
      overlapEdge = { lo, hi, rel: hi / lo - 1, overlapPair: firstOut.overlap };
    }
    // 根(β_V = 0)—— 規約と族ごとに格子の隣り合う点の符号の変化 → 二分法(各点でエンジンが核を作り直す)
    const roots = {};
    for (const c of LS.DECL.conventions) for (const F of ['S', 'E']) {
      const key = c.key + ':' + F, vals = okp.map((q) => q.cols[key].beta), flips = LS.signChanges(vals), found = [];
      for (const k of flips) {
        const fn = (R) => { const z = buildAt(HP, I, src, { dragCore: { 2: R } }); return z.ok ? venusPoint(I, K0, z.t['venus:sun'], R, c, F).beta : NaN; };
        const r = LS.bisectLog(fn, okp[k].Rd, okp[k + 1].Rd, D.rootIter);
        if (r) found.push({ Rd: r.x, lo: r.lo, hi: r.hi, betaLo: r.fLo, betaHi: r.fHi });
      }
      const lams = okp.map((q) => q.cols[key].lambdaNeed), iMin = lams.reduce((m, v, k) => (Math.abs(v) < Math.abs(lams[m]) ? k : m), 0);
      roots[key] = { signChanges: flips.length, roots: found, venusAcceptedPoints: okp.filter((q) => q.cols[key].rejected === false).length, points: okp.length,
        allFourPoints: okp.filter((q) => q.cols[key].accepted).length, jupiterAccepted: okp.every((q) => q.cols[key].betaJ >= 0), ioAccepted: okp.every((q) => q.cols[key].betaIo >= 0),
        lambdaNeedMin: lams[iMin], lambdaNeedMinRd: okp[iMin].Rd, betaVAtK1: okp.find((q) => q.Rd === I.bodies.venus.Rd).cols[key].beta, betaVAtRobs: okp.find((q) => q.Rd === I.bodies.venus.R).cols[key].beta };
    }
    // 頭打ち: K1 の太陽の項の最大(格子)と比の型の見積り s_☉ R_src²/(5 d²)・自己の場と源の場の交わる R_d* = 1.2 d m_V/m_☉(一様な球の自己の K1 の平均 6/(5R))
    const absV = okp.map((q) => Math.abs(q.vSunAlong)), iMax = absV.indexOf(Math.max(...absV));
    const book = I.st.preset, dV = orbitGeom(book, X.IDX.sun, X.IDX.venus, I.units.lenSI).dist, Rsrc = src === 'J' ? I.bodies.sun.R * Math.sqrt(5 * X.SRC_F[0] / 2) : I.bodies.sun.Rd;
    out.sources[src] = { points: pts, overlapEdge, roots, maxAbsVSun: absV[iMax], maxAtRd: okp[iMax].Rd, dSunVenus: dV, Rsrc, satEstimate: I.bodies.sun.s * Rsrc * Rsrc / (5 * dV * dV),
      RdCross: 1.2 * dV * I.bodies.venus.m / I.bodies.sun.m, needAbsS: Math.abs(I.bodies.venus.s), shortfallNoGalaxy: Math.abs(I.bodies.venus.s) / absV[iMax],
      othersSameAll: okp.every((q) => q.othersSame), RdAppliedMaxRel: Math.max(...okp.map((q) => q.RdAppliedRel)), outsideCount: pts.filter((q) => !q.ok).length };
  }
  // 求積の次数の感度(R_obs・1e10・格子の最大の評価域の点 × 源 × 次数)
  const rIn = Math.max(...out.sources.J.points.filter((q) => q.ok).map((q) => q.Rd)), radii = [I.bodies.venus.R, 1e10, rIn];
  out.orders = [];
  for (const src of LS.DECL.sources) for (const R of radii) {
    const vals = LS.DECL.orders.map((od) => { const z = buildAt(HP, I, src, { dragCore: { 2: R }, order: od }); return z.ok ? I.bodies.sun.s * E.dot(z.t['venus:sun'], I.bodies.venus.a) : null; });
    out.orders.push({ src, Rd: R, orders: LS.DECL.orders, vSunAlong: vals, spreadRel: Math.max(...vals.map((v) => E.relD(v, vals[vals.length - 1]))) });
  }
  return out;
}
/** 固体の R_d の規則(走行の前の宣言 —— K1 の規則のまま/観測半径)を地球(検査)とイオ(参考)に当てる —— 合わせない */
export function partSolid(HP, I, Know, KJ) {
  const rows = [];
  for (const src of LS.DECL.sources) {
    const K0 = src === 'J' ? KJ : Know;
    for (const rule of LS.DECL.solidRules) for (const key of ['earth', 'io', 'venus']) {
      const R = rule === 'k1' ? I.bodies[key].Rd : I.bodies[key].R, z = rule === 'k1' ? { ok: true, t: K0.t } : buildAt(HP, I, src, { dragCore: { [X.IDX[key]]: R } });
      if (!z.ok) { rows.push({ src, rule, key, ok: false }); continue; }
      const tOver = {}; for (const s of E.DECL.ports[key].k1) tOver[key + ':' + s] = z.t[key + ':' + s];
      const keys = key === 'earth' ? ['sun', 'earth'] : SOLVE, cols = {};
      for (const c of LS.DECL.conventions) for (const F of ['S', 'E']) {
        const r = solveAt(I, K0, keys, c.p, F, { q: c.q, RdOver: { [key]: R }, tOver }), row = r.rows.find((q) => q.key === key);
        cols[c.key + ':' + F] = { beta: row.beta, rejected: row.rejected, accepted: r.accepted, alongMaxRel: r.alongMaxRel };
      }
      rows.push({ src, rule, key, ok: true, Rd: R, role: key === 'earth' ? '検査' : (key === 'io' ? '参考' : '金星'), vSunAlong: I.bodies.sun.s * E.dot(z.t[key + ':sun'], I.bodies[key].a), cols });
    }
  }
  return rows;
}

/* ───────── T(AN537)潮汐の自由な係数・法則・予言 ───────── */
export function partT(I, Know, F) {
  const free = {};
  for (const family of ['S', 'E']) free[family] = LS.DECL.pGrid.map((p) => {
    const r = solveAt(I, Know, SOLVE, p, family), out = { p, beta: pick(r, SOLVE), rejected: rejOf(r) };
    for (const key of CHECK) { const c = solveAt(I, Know, ['sun', key], p, family); out.beta[key] = c.beta[key]; if (c.rows.find((q) => q.key === key).rejected) out.rejected.push(key); }
    return out;
  });
  // 法則の段(p ごと —— 学ぶ天体は金星・木星・イオのうち振幅が非負の天体)
  const lawAt = (p, family) => {
    const r4 = solveAt(I, Know, SOLVE, p, family), rowsOf = (key) => {
      const r = SOLVE.includes(key) ? r4 : solveAt(I, Know, ['sun', key], p, family), row = r.rows.find((q) => q.key === key), b = I.bodies[key];
      const nNT = 1 + E.DECL.ports[key].k1.length;
      return { key, s: b.s, gamma0: b.I, nonTide: row.nonTide, tides: F[key].tides.map((t) => ({ raiser: t.raiser, X: t.X, nAlong: t.nAlong })), nNonTide: nNT,
        nonTideAtS0: row.nonTide + b.I * (family === 'S' ? 1 : nNT) * b.s };
    };
    const train = LS.DECL.trainBodies.map(rowsOf), pred = LS.DECL.predictBodies.map(rowsOf), laws = {};
    for (const lw of LS.DECL.laws) {
      const amps = train.map((t) => ({ key: t.key, C: LS.amplitudeOf(Object.assign({}, t, { law: lw.key, alpha: 1 })).C }));
      const use = train.filter((t, k) => lw.key === 'classicalPow' ? true : amps[k].C > 0);
      const trainUse = lw.key === 'classicalPow' ? train.filter((t) => t.key !== 'venus') : use;   // 2 母数は金星を除いた 2 天体(金星はどの α でも負 —— 下で確かめる)
      const venusNegAllAlpha = [-2, -1, 0, 0.5, 1, 2].every((al) => !(LS.amplitudeOf(Object.assign({}, train[0], { law: lw.key === 'classicalPow' ? 'classicalPow' : lw.key, alpha: al })).C > 0));
      const fit = LS.fitLaw(lw.key, trainUse);
      const preds = fit.ok ? pred.map((t) => {
        const sp = LS.predictSpin({ family, nonTideAtS0: t.nonTideAtS0, nNonTide: t.nNonTide, gamma0: t.gamma0, tides: t.tides, law: lw.key, C: fit.C, alpha: fit.alpha });
        const need = LS.amplitudeOf(Object.assign({}, t, { law: lw.key, alpha: fit.alpha })).C;
        return { key: t.key, sObs: t.s, sPred: sp, ratio: sp / t.s, Cneed: need, CneedOverLaw: need / fit.C };
      }) : [];
      laws[lw.key] = { amplitudes: amps, trainKeys: trainUse.map((t) => t.key), excluded: train.filter((t) => !trainUse.includes(t)).map((t) => ({ key: t.key, why: '振幅が負(負の散逸 —— 0 に丸めない)' })), venusNegAllAlpha, fit, predictions: preds };
    }
    // 文献の k2/Q と比べる(古典の尺度の振幅を k2/Q で割った比 —— 同じ則なら天体に依らない。固定しない)
    const cmp = train.concat(pred).map((t) => { const C = LS.amplitudeOf(Object.assign({}, t, { law: 'classical', alpha: 1 })).C, k = LS.DECL.k2Q[t.key]; return { key: t.key, Cclassical: C, k2Q: k === undefined ? null : k, CoverK2Q: (k && C !== null) ? C / k : null }; });
    return { p, family, laws, k2Qcompare: cmp };
  };
  const law = {};
  for (const family of ['S', 'E']) law[family] = [LS.DECL.pMain, -1].map((p) => lawAt(p, family));
  // 古典の尺度(α = 1)の 1 つの C が木星とイオで同じになる p(p も法則の母数に数える —— 2 母数を 2 天体で決める: 残差は検査にならない)と、その p での地球・土星の予言
  const pStar = {};
  for (const family of ['S', 'E']) {
    const gap = (p) => { const a = lawAt(p, family).laws.classical.amplitudes; const cj = a.find((z) => z.key === 'jupiter').C, ci = a.find((z) => z.key === 'io').C; return cj > 0 && ci > 0 ? Math.log10(cj / ci) : NaN; };
    let lo = -3, hi = LS.DECL.pMain, glo = gap(lo), ghi = gap(hi), res = null;
    if (Number.isFinite(glo) && Number.isFinite(ghi) && Math.sign(glo) !== Math.sign(ghi)) {
      for (let k = 0; k < 60; k++) { const m = 0.5 * (lo + hi), gm = gap(m); if (Math.sign(gm) === Math.sign(glo)) { lo = m; glo = gm; } else { hi = m; ghi = gm; } }
      const pm = 0.5 * (lo + hi), x = lawAt(pm, family).laws.classical;
      res = { p: pm, C: x.fit.C, spreadLog10: x.fit.spreadLog10, predictions: x.predictions, venusAmplitude: x.amplitudes.find((z) => z.key === 'venus').C, gapAtMain: gap(LS.DECL.pMain), gapAtMinus1: gap(-1) };
    }
    pStar[family] = res || { p: null, why: 'p の区間 [−3, ' + LS.DECL.pMain + '] に木星とイオの古典の振幅の等しい点が無い' };
  }
  return { free, law, pStar };
}

/* ───────── H 帳簿 ───────── */
function portTable(ev) {
  return ev.rows.map((R) => ({ key: R.key, s: R.s, heat: R.heat, alongRel: R.alongRel, reaction: R.reaction, holdWork: R.holdWork,
    ports: R.ports.map((q) => ({ kind: q.kind, src: q.src, w: q.w, vAlong: q.vAlong, nuAlong: q.nuAlong, Gamma: q.Gamma, torqueAlong: q.torqueAlong, heat: q.heat, supply: q.supply, negative: q.negative })) }));
}
function ledgerOf(ev) {
  const ld = ev.ledger;
  return { galaxySupply: ld.galaxySupply, orbitWork: ld.orbitWork, k1Draw: ld.k1Draw, heat: ld.heat, radiation: ld.radiation, spinPower: ld.spinPower, residualRel: ld.residualRel,
    k1TransferRel: E.relD(ld.k1Transfer.draw, ld.k1Transfer.sourceReactionWork), portCloseMaxRel: ld.portCloseMaxRel, LTotalRel: ld.L.totalRel,
    holdWorkMaxRel: Math.max(...ev.rows.map((q) => Math.abs(q.holdWork) / Math.max(q.ports.reduce((a, z) => a + Math.abs(z.heat), 0), 1e-300))) };   // 尺度は口の熱の abs の和(不採用の写しの負の Γ でも読める)
}
export function partH(I, Know) {
  const p = LS.DECL.pMain, sets = { sji: ['sun', 'jupiter', 'io'], five: ['sun', 'jupiter', 'io', 'earth', SAT], venus: ['sun', 'venus'] }, cands = [];
  for (const [nm, keys] of Object.entries(sets)) for (const [family, alloc] of [['S', 'equal'], ['S', 'galHeavy'], ['S', 'k1Heavy'], ['E', 'equal']]) {
    const r = solveAt(I, Know, keys, p, family, { alloc }), r2 = solveAt(I, Know, keys, p, family, { alloc, lam: LS.DECL.scaleLambda });
    cands.push({ set: nm, keys, family, alloc, p, A: r.A, beta: pick(r, keys), accepted: r.accepted, rejected: rejOf(r), alongMaxRel: r.alongMaxRel, ledger: ledgerOf(r.ev),
      perBodyHeat: Object.fromEntries(r.ev.rows.map((q) => [q.key, q.heat])), table: (alloc === 'equal' && nm !== 'five') ? portTable(r.ev) : null,
      scale: { lambda: LS.DECL.scaleLambda, ARel: E.relD(r2.A, r.A), betaRelMax: Math.max(0, ...keys.filter((k) => k !== 'sun').map((k) => E.relD(r2.beta[k], r.beta[k]))), heatRatio: r2.ev.ledger.heat / r.ev.ledger.heat } });
  }
  return { p, candidates: cands };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const I = X.partI(HP), Know = X.partK(HP, I, 'now'), KJ = X.partK(HP, I, 'J'), F = featuresOf(I); mark('I');
  const S = partS(I, Know, KJ); mark('S');
  const V = partV(HP, I, Know, KJ); mark('V');
  const SO = partSolid(HP, I, Know, KJ); mark('solid');
  const TT = partT(I, Know, F); mark('tidal');
  const H = partH(I, Know); mark('H');
  const P = LS.pureScenes(), PG = LS.pureGates(P);
  const J = { inputs: { units: I.units, g: I.g, features: F, venusK1Rd: I.bodies.venus.Rd, venusRobs: I.bodies.venus.R }, sum: S, venusRd: V, solidRule: SO, tide: TT, ledger: H, pure: { scenes: P, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const S = J.sum, V = J.venusRd, H = J.ledger, TT = J.tide;
  const allPts = Object.values(V.sources).flatMap((s) => s.points.filter((q) => q.ok));
  const famRows = Object.values(S.families).flatMap((f) => Object.values(f).flat());
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    familyEsameAsW326d: S.sameAsW326d.now <= 1e-15 && S.sameAsW326d.J <= 1e-15,
    sunASameBothFamilies: E.relD(S.sunA.S, S.sunA.E) <= 1e-12 && E.relD(S.sunA.S, S.sunA.w326d) <= 1e-12,
    alongBalanced: famRows.every((q) => q.alongMaxRel <= 1e-12) && allPts.every((q) => Object.values(q.cols).every((c) => c.alongMaxRel <= 1e-12)),
    sumEdgesAreHull: ['jupiter', 'io'].every((k) => S.edges[k].S.kind === 'le' && S.edges[k].hull.kind === 'le' && Math.abs(S.edges[k].S.p - S.edges[k].hull.p) <= 1e-9) && S.edges.venus.S.kind === 'none',
    allocationSteady: S.allocSens.every((q) => q.betaRelGal <= 1e-9 && q.betaRelK1 <= 1e-9) && S.allocSens.some((q) => Math.abs(q.heatRatioGal - 1) > 1e-3),
    venusScanApplied: Object.values(V.sources).every((s) => s.othersSameAll && s.RdAppliedMaxRel <= 1e-12 && s.overlapEdge && s.overlapEdge.rel <= 1e-6 && s.outsideCount >= LS.DECL.venusRd.overlapProbe.length),
    venusScanRecorded: Object.values(V.sources).every((s) => Object.values(s.roots).every((r) => r.points === V.grid.length && r.roots.length === r.signChanges)),
    venusSignByBound: allPts.every((q) => Object.entries(q.cols).every(([k, c]) => (c.rejected === true) === (k.endsWith(':S') ? (c.vGal + q.vSunAlong > J.inputs.features.venus.s) : (c.vGal + q.vSunAlong > 2 * J.inputs.features.venus.s)))),
    saturationEstimate: Object.values(V.sources).every((s) => s.maxAbsVSun / s.satEstimate > 0.5 && s.maxAbsVSun / s.satEstimate < 2),
    quadratureRecorded: V.orders.every((q) => q.vSunAlong.every(Number.isFinite)),
    solidRuleRecorded: J.solidRule.every((q) => q.ok && Object.values(q.cols).every((c) => c.alongMaxRel <= 1e-12)),
    negativeNotClipped: famRows.every((q) => Object.entries(q.beta).every(([k, v]) => (q.rejected.includes(k) ? v < 0 : v >= 0))),
    lawStage: ['S', 'E'].every((f) => TT.law[f].every((x) => Object.values(x.laws).every((l) => !l.fit.ok || l.predictions.length === LS.DECL.predictBodies.length && l.predictions.every((q) => Number.isFinite(q.sPred))))
      && TT.pStar[f].p !== null && TT.pStar[f].spreadLog10 <= 1e-9 && TT.pStar[f].venusAmplitude < 0),
    ledgerCandidates: H.candidates.every((c) => c.ledger.residualRel <= 1e-12 && c.ledger.LTotalRel <= 1e-12 && c.ledger.k1TransferRel <= 1e-12 && c.ledger.portCloseMaxRel <= 1e-12 && c.ledger.holdWorkMaxRel <= 1e-12),
    scaleNotIdentified: H.candidates.every((c) => c.scale.ARel <= 1e-12 && c.scale.betaRelMax <= 1e-12 && E.relD(c.scale.heatRatio, c.scale.lambda) <= 1e-12),
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W327A_TARGET || 'beta/index.html';
  const OUT = process.env.W327A_OUT ? (path.isAbsolute(process.env.W327A_OUT) ? process.env.W327A_OUT : path.join(ROOT, process.env.W327A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第327便a axialsum(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: LS.LIB_VERSION, w326dLibVersion: E.LIB_VERSION, generator: 'tests/exp-w327a-axialsum.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の回答(2026-11-05 —— AN534「金星の逆回転と内部熱がまだ解決していないので、金星に影響する項目は検証対象。「角速度の和」は依頼したイメージ」・AN535「両方K1が成立する太陽と木星は、密度が低い恒星と気体惑星である。金星は固体惑星なので、金星の引きずり半径でのフィットを検証する」・AN537「潮汐の応答は、天体ごとに自由。法則を探す検証は行う」)・統括の検証項目 R295',
    decl: LS.DECL, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w327a-axialsum.mjs', 'tests/lib-w327a-axialsum.mjs', 'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第327便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axialsum', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

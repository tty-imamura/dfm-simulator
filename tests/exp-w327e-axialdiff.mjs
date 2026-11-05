// 第327便e(原仮定者の指示(2026-11-05)「軸引きずりについて」4 項・統括の検証項目 R299): **軸引きずりを「近い位置と遠い位置の差分」として読む器 —— 核の 2 つの型
//   (勾配と有限の半径の差分)・第327便a の頭打ちの出どころ・金星で銀河は K1・太陽は別の半径の根(族 S 主・族 E 否定対照)・規則を固定した 太陽–火星 → 太陽–地球–月 の 3 体の帳簿**
//   (段 axialdiff-327e —— 正本 tests/out/axialdiff-w327e.json・lib tests/lib-w327e-axialdiff.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・beta/index.html は変えない。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第326便d の器の写しと読み口〔copyBook・stateOf・partI〕・第327便a の器の
//   buildAt〔受け手の dragCore を写しで振る —— 勾配の型の参照の点〕・エンジンの点の読み口 inertialDragIsqPointAt〔回転引きずりの場 g = rotC と中心の amp〕をそのまま使う ——
//   K1 の核の式を写さない)。入力は html だけ(他の正本・データは読まない)。1 プロセス(子プロセスなし)。t = 0 の読み口と純関数だけ(步を進めない)。
//
// ■ 何をするか(入力は在位の 🗺️ solarSystem16Inertial3d の J2000 の転記 —— 新たに一次資料を取らない)
//   K 核の 2 つの型: 太陽 → 金星の線の上で、勾配の型(エンジンの K1 —— 受け手の R_d の球の体積平均)・中心の点の amp・有限の半径の差分(diffStencil・diffK1)と
//     比の型の頭打ちの見積り s_☉ R_src²/(5(d² − R²))(源 2 列 —— 今 R_src = R_d・J〔太陽 0.07・木星 0.254〕)
//   V 金星(太陽–金星): 銀河は K1 のまま(f = (R_d^K1/R_d,☉)^p)・太陽の口だけ別の半径 R_alt の差分の型。族 S(主)・族 E(否定対照)× p の格子 × 源 2 × 型 2 の根・残差・条件・上界
//   M 太陽–火星: 金星の根で固定した規則(観測半径との比・K1 の R_d との比・同じ長さ)を当てる(合う・合わないを記録 —— 合わせない)・火星自身の根(比べる列)
//   L 太陽–地球–月(3 体の帳簿): 地球への太陽と月の寄与・月への太陽と地球の寄与(月 ↔ 地球の口は勾配〔K1 のまま〕と同じ規則の別の半径の 2 列)・月の同期の行
//   H 帳簿(候補ごとに由来別の Q・P・供給・軌道の仕事・放射・閉じ —— 第327便a の口座)
//   P 純関数の場面(lib の pureScenes —— QA lint.axialDiff327e と同じ)
// ■ 言わないこと: 金星の逆回転・内部熱の説明ではない・解いた半径は「この型・この規則の下で」の条件と残差つきの記録(在位の本へ入れない —— 採らない)・
//   負の係数を 0 へ丸めない・火星と地球–月で合わせない・応答の尺度 Γ は宣言のノブ(内部熱を観測の熱流に合わせていない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as X from './exp-w326d-axialheat.mjs';
import * as XA from './exp-w327a-axialsum.mjs';
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
import * as LD from './lib-w327e-axialdiff.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 版 8 の宣言: ワンタップ対照の A/B を走らせない〔abBody:false〕・説明文の欄を読まない〔keepProse なし〕。
//   presets は器が .find で引く在位の本 1 本だけ)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqPointAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w327e-axialdiff-1';
export const OUT_MAIN = 'tests/out/axialdiff-w327e.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['金星の逆回転の説明ではない(この型・この規則の下での根と残差の記録)', '内部熱の説明ではない(応答の尺度 Γ は宣言のノブ —— 観測の熱流に合わせていない)',
  '解いた別の半径は採らない(在位の本へ入れない —— 根の有無を全部の模型の否定・肯定に広げない)', '火星と地球–月は規則を固定して当てただけ(合わせていない)',
  '負の係数を要する解は不採用(0 へ丸めない)', 'A は「太陽の口が銀河だけ」という接続の帰結(銀河場の同定と数えない)']);
/** 天体の鍵 → 🗺️ の添字(第326便d の IDX に火星) */
export const IDX = Object.freeze(Object.assign({}, X.IDX, { mars: 5 }));
const NAME_JA = Object.freeze({ sun: '太陽', venus: '金星', mars: '火星', earth: '地球', moon: '月' });
const KEYS = Object.freeze(['sun', 'venus', 'mars', 'earth', 'moon']);
/** 潮汐の目標の公転の対(受け手 → [中心, 回る天体]) */
const ORBIT_PAIR = Object.freeze({ 'venus:sun': ['sun', 'venus'], 'mars:sun': ['sun', 'mars'], 'earth:sun': ['sun', 'earth'], 'earth:moon': ['earth', 'moon'], 'moon:earth': ['earth', 'moon'] });
const SYS = Object.freeze({ venus: ['sun', 'venus'], mars: ['sun', 'mars'], triEM: ['sun', 'earth', 'moon'] });
const TABLE_P = -0.5;   // 口ごとの表を残す p(族 S・源 J —— p = 0 と、火星と地球–月の採否が規則で分かれる p)

/* ───────── I 入力 ───────── */
const axisOfDecl = (b) => { const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
/** 二体の接触の公転の角速度ベクトルと距離(第326便d の orbitOmega と同じ式の μ —— SI) */
function orbitOf(book, ci, oi, uL, uT) {
  const a = book.bodies[ci], b = book.bodies[oi], r = [b.x - a.x, b.y - a.y, b.z - a.z], v = [b.vx - a.vx, b.vy - a.vy, b.vz - a.vz];
  const h = E.cross(r, v), mu = book.physics.G * (a.m + b.m), sma = 1 / (2 / E.norm(r) - E.dot(v, v) / mu), n = Math.sqrt(mu / (sma * sma * sma)) / uT;
  return { n: E.scale(h, n / E.norm(h)), dist: E.norm(r) * uL, sma: sma * uL };
}
export function partI(HP) {
  const st = X.stateOf(HP, X.copyBook(HP)), book = st.preset, se = book.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M);
  const rdB = st.isq.rdRule.bodies, bodies = {}, moi = Object.assign({}, E.MOI, LD.MOI_ADD);
  for (const key of KEYS) {
    const i = IDX[key], b = book.bodies[i], a = axisOfDecl(b), aE = [st.S.sax[i], st.S.say[i], st.S.saz[i]], Rd = rdB.find((q) => q.i === i).Rd * uL, m = b.m * uM, R = b.radius * uL;
    bodies[key] = { key, i, name: NAME_JA[key], m, R, s: b.spin / uT, a, axisEngineAngDeg: E.angDeg(a, aE), Rd, moi: moi[key], I: moi[key] * m * R * R, rho: m / (4 / 3 * Math.PI * R * R * R) };
  }
  const tides = {};
  for (const [k, [c, o]] of Object.entries(ORBIT_PAIR)) { const q = orbitOf(book, IDX[c], IDX[o], uL, uT); tides[k] = { n: q.n, along: E.dot(q.n, bodies[k.split(':')[0]].a), dist: q.dist, sma: q.sma }; }
  const ref = X.partI(HP);   // 第326便d の入力(銀河の軸 ĝ と基準の角速度 —— 同じ値を使う)
  bodies.g = ref.g;
  return { units: { lenSI: uL, timeSI: uT, massSI: uM }, bodies, tides, g: ref.g, OmRefSI: ref.OmRefSI, gain: book.physics.relativeDrag.spinDrag.axialGain, st };
}

/* ───────── K 核の 2 つの型(エンジンの読み口から)───────── */
export function stateFor(HP, src) { return src === 'J' ? X.stateOf(HP, X.copyBook(HP, { sm: { kind: 'J', f: X.SRC_F } })) : X.stateOf(HP, X.copyBook(HP)); }
/** 勾配の型(エンジンの K1 の体積平均)の伝達 t_ij(源の単位の自転あたり —— 無次元) */
export function gradT(st, i, j) { const r = st.isq.receivers.find((q) => q.i === i); return r.omegaSrc.slice(j * 4, j * 4 + 3).map((z) => z / st.S.spin[j]); }
/** 有限の半径の差分(受け手 i・源 j・別の半径 R [m]): 近い位置と遠い位置の g(エンジンの rotC)・中心の g と amp・2 つの差分・伝達 */
export function stencilAt(HP, I, st, i, j, Rsi) {
  const S = st.S, uL = I.units.lenSI, dv = [S.x[i] - S.x[j], S.y[i] - S.y[j], S.z[i] - S.z[j]], dn = E.norm(dv), n = E.scale(dv, 1 / dn), R = Rsi / uL;
  const term = (s) => { const q = HP.inertialDragIsqPointAt(S, i, S.x[i] + s * R * n[0], S.y[i] + s * R * n[1], S.z[i] + s * R * n[2]); const o = q ? q.terms.find((z) => z.j === j) : null; return o || null; };
  const tn = term(-1), tf = term(1), tc = term(0), RdK1 = st.isq.receivers.find((q) => q.i === i).Rd;
  if (!(tn && tf && tc && Number.isFinite(tn.rotC) && Number.isFinite(tf.rotC))) return { ok: false, R: Rsi };
  const sd = LD.stencilDiff({ gNear: tn.rotC, gFar: tf.rotC, R, Rd: RdK1 }), geo = LD.geomFactor(n, [S.sax[j], S.say[j], S.saz[j]]);
  return { ok: true, R: Rsi, d: dn * uL, n, gNear: tn.rotC * uL, gFar: tf.rotC * uL, gCenter: tc.rotC * uL, ampCenter: tc.amp, D: sd.D, DK1: sd.DK1, sinTheta: geo.sinTheta,
    t: { diffStencil: LD.transferOf(sd.D, geo, I.gain), diffK1: LD.transferOf(sd.DK1, geo, I.gain) }, tCenter: LD.transferOf(tc.amp, geo, I.gain) };
}
/** 比の型の頭打ちの見積り(源の場が勝つ所 —— g → R_src²/(5r) の差分: R_src²/(5(d² − R²)))*/
const satOf = (Rsrc, d, R) => Rsrc * Rsrc / (5 * (d * d - R * R));
export function partK(HP, I, ST) {
  const iV = IDX.venus, iS = IDX.sun, b = I.bodies.venus, out = {};
  for (const src of LD.DECL.sources) {
    const st = ST[src], tG = gradT(st, iV, iS), s0 = stencilAt(HP, I, st, iV, iS, 1e4), smB = st.isq.sourceMoment ? st.isq.sourceMoment.bodies.find((q) => q.i === iS) : null;
    const Rsrc = smB ? smB.Rsrc * I.units.lenSI : I.bodies.sun.Rd, d = s0.d, RdCross = d * b.m / I.bodies.sun.m;
    // 勾配の型の参照の点(受け手の R_d を写しで振る —— 第327便a の buildAt)と同じ R の差分の型・見積り
    const pts = [b.Rd, 1e3, 1e4, 1e5, RdCross, 1e6, b.R, 1e8, 1e9, 1e10].map((R) => {
      const z = XA.buildAt(HP, I, src, { dragCore: { [iV]: R } }), sc = R >= 1e3 ? stencilAt(HP, I, st, iV, iS, R) : null;
      const gAlong = z.ok ? I.bodies.sun.s * E.dot(z.t['venus:sun'], b.a) : null;
      return { R, gradAlong: gAlong, stencilAlong: sc ? I.bodies.sun.s * E.dot(sc.t.diffStencil, b.a) : null, diffK1Along: sc ? I.bodies.sun.s * E.dot(sc.t.diffK1, b.a) : null,
        D: sc ? sc.D : null, DK1: sc ? sc.DK1 : null, satD: satOf(Rsrc, d, R), DoverSat: sc ? sc.D / satOf(Rsrc, d, R) : null, gradOverSatAlong: gAlong !== null ? gAlong / (I.bodies.sun.s * satOf(Rsrc, d, R) * E.dot(LD.geomFactor(s0.n, [st.S.sax[iS], st.S.say[iS], st.S.saz[iS]]).vec, b.a) * I.gain) : null };
    });
    // 中心の点の amp(R → 0 の差分の極限)とエンジンの体積平均(R_d^K1 の球)の比・向き
    const centerAlong = I.bodies.sun.s * E.dot(s0.tCenter, b.a), gradAlong = I.bodies.sun.s * E.dot(tG, b.a);
    out[src] = { Rsrc, d, RdCross, RdCrossBall: 1.2 * RdCross, gradAlongK1: gradAlong, centerAlong, gradOverCenter: gradAlong / centerAlong, angleGradStencilDeg: E.angDeg(tG, s0.t.diffStencil),
      satAlong: I.bodies.sun.s * satOf(Rsrc, d, 0), points: pts };
  }
  return out;
}

/* ───────── V 金星(太陽–金星)───────── */
const tidesOf = (I) => (recv, raiser) => I.tides[recv + ':' + raiser].n;
/** 系を解く(keys の天体・p・族・口の伝達の写像 tMap {'recv:src': t})*/
export function solveSys(I, keys, p, family, tMap, lam = 1) {
  const sys = LD.systemOf(I.bodies, keys, p, (r, s) => tMap[r + ':' + s], tidesOf(I)), prm = LD.paramsOf(I.bodies, family, lam);
  return Object.assign(LS.solve(sys, prm), { sys, prm });
}
export function partV(HP, I, ST, KK) {
  const b = I.bodies.venus, G = LD.DECL.venusGrid, out = { sources: {} };
  for (const src of LD.DECL.sources) {
    const st = ST[src], d = KK[src].d, grid = LD.radiusGrid(G, { d, Rd: b.Rd, R: b.R, RdSun: I.bodies.sun.Rd }).filter((R) => R >= 1e3 || R === b.Rd);
    const tG = gradT(st, IDX.venus, IDX.sun), cache = new Map();
    const tAt = (R, form) => { if (R === b.Rd && form === 'grad') return tG; let c = cache.get(R); if (!c) { c = stencilAt(HP, I, st, IDX.venus, IDX.sun, R); cache.set(R, c); } return c.ok ? c.t[form] : null; };
    const pts = grid.filter((R) => R !== b.Rd).map((R) => { const c = stencilAt(HP, I, st, IDX.venus, IDX.sun, R); cache.set(R, c); return { R, ok: c.ok, stencilAlong: c.ok ? I.bodies.sun.s * E.dot(c.t.diffStencil, b.a) : null, diffK1Along: c.ok ? I.bodies.sun.s * E.dot(c.t.diffK1, b.a) : null }; });
    const okR = pts.filter((q) => q.ok).map((q) => q.R), cols = {};
    for (const form of ['diffStencil', 'diffK1']) for (const family of LD.DECL.families) for (const p of LD.DECL.pGrid) {
      const fn = (R) => { const t = tAt(R, form); return t ? solveSys(I, SYS.venus, p, family, { 'venus:sun': t }).beta.venus : NaN; };
      const rg = LD.rootsOnGrid(fn, okR, G.rootIter), base = solveSys(I, SYS.venus, p, family, { 'venus:sun': tG }), vG = base.A * Math.pow(b.Rd / I.bodies.sun.Rd, p) * E.dot(I.g, b.a);
      const need = family === 'S' ? b.s - vG : 2 * b.s - vG, along = pts.filter((q) => q.ok).map((q) => (form === 'diffStencil' ? q.stencilAlong : q.diffK1Along));
      const iMax = along.reduce((m, v, k) => (Math.abs(v) > Math.abs(along[m]) ? k : m), 0);
      const roots = rg.roots.map((r) => { const t = tAt(r.x, form), sol = solveSys(I, SYS.venus, p, family, { 'venus:sun': t });
        return { R: r.x, kind: r.kind, lo: r.lo, hi: r.hi, betaLo: r.fLo, betaHi: r.fHi, betaAt: sol.beta.venus, bracketScale: r.v0, ROverRobs: r.x / b.R, ROverRdK1: r.x / b.Rd, ROverD: r.x / d,
          nearDist: d - r.x, nearInsideSun: d - r.x < I.bodies.sun.R, sunAlong: I.bodies.sun.s * E.dot(t, b.a), A: sol.A, ARatio: sol.A / base.A, alongMaxRel: sol.alongMaxRel }; });
      // 太陽の口の寄与が要る大きさに初めて届く格子の点(K1 の A で見積もった要る大きさ)と、そこでの A の比(源の反作用が太陽の式の A を動かす —— 根が消える理由の読み)
      const kc = along.findIndex((v) => Math.sign(v) === Math.sign(need) && Math.abs(v) >= Math.abs(need)), atCross = kc >= 0 ? solveSys(I, SYS.venus, p, family, { 'venus:sun': tAt(okR[kc], form) }) : null;
      cols[form + ':' + family + ':' + p] = { form, family, p, vGalaxy: vG, needSunAlong: need, AK1: base.A, betaK1: base.beta.venus, acceptedK1: base.accepted, signChanges: rg.flips.length, roots,
        zeros: roots.filter((r) => r.kind === 'zero').length, acceptedPoints: rg.vals.filter((v) => v >= 0).length, points: okR.length, maxAbsSunAlong: Math.abs(along[iMax]), maxAtR: okR[iMax], shortfall: Math.abs(need) / Math.abs(along[iMax]),
        crossR: kc >= 0 ? okR[kc] : null, ARatioAtCross: atCross ? atCross.A / base.A : null, betaAtCross: atCross ? atCross.beta.venus : null };
    }
    out.sources[src] = { d, grid: okR, points: pts, cols, outside: pts.filter((q) => !q.ok).map((q) => q.R) };
  }
  // 規則の固定(宣言: 型 diffK1・p ごと・族ごと・源ごとに金星の最も小さい零点 —— 根の無い列は当てない。表の主は族 S・源 J)
  const D = LD.DECL, frozen = {};
  for (const src of D.sources) for (const p of D.pGrid) for (const family of D.families) {
    const c = out.sources[src].cols[D.formMain + ':' + family + ':' + p], z = c ? c.roots.filter((r) => r.kind === 'zero').sort((x, y) => x.R - y.R) : [], r = z[0] || null;
    frozen[src + ':' + family + ':' + p] = r ? { src, family, p, form: D.formMain, Ralt: r.R, nearInsideSun: r.nearInsideSun, rules: Object.fromEntries(D.rules.map((q) => [q.key, LD.freezeRule(q.key, r.R, b)])) }
      : { src, family, p, form: D.formMain, Ralt: null };
  }
  out.frozen = frozen;
  return out;
}

/* ───────── M・L 規則を固定して当てる ───────── */
function applyCase(HP, I, ST, sysKey, fr, family, moonPort) {
  const st = ST[fr.src], keys = SYS[sysKey], tMap = {}, radii = {};
  for (const key of keys.filter((k) => k !== 'sun')) {
    radii[key] = LD.applyRule(fr, I.bodies[key]);
    for (const src of LD.DECL.ports[key].k1) {
      const alt = src === 'sun' || moonPort === 'alt';
      if (!alt) { tMap[key + ':' + src] = gradT(st, IDX[key], IDX[src]); continue; }
      const c = stencilAt(HP, I, st, IDX[key], IDX[src], radii[key]);
      if (!c.ok) return { ok: false, why: '評価域の外(' + key + ' ← ' + src + ' の近い位置が源の R_d の内・R_alt ' + radii[key] + ' m)', radii };
      tMap[key + ':' + src] = c.t[fr.form];
    }
  }
  const r = solveSys(I, keys, fr.p, family, tMap), r2 = solveSys(I, keys, fr.p, family, tMap, LD.DECL.scaleLambda);
  const along = Object.fromEntries(Object.keys(tMap).map((k) => { const [rc, sc] = k.split(':'); return [k, I.bodies[sc].s * E.dot(tMap[k], I.bodies[rc].a)]; }));
  return { ok: true, radii, A: r.A, beta: Object.fromEntries(keys.filter((k) => k !== 'sun').map((k) => [k, r.beta[k]])), rejected: r.rows.filter((q) => q.rejected === true).map((q) => q.key), accepted: r.accepted,
    alongMaxRel: r.alongMaxRel, k1Along: along, ledger: LD.ledgerOf(r.ev), table: (fr.src === LD.DECL.sourceMain && family === LD.DECL.familyMain && (fr.p === LD.DECL.pAlso || fr.p === TABLE_P)) ? LD.portTable(r.ev) : null,
    scale: { ARel: E.relD(r2.A, r.A), betaRelMax: Math.max(0, ...keys.filter((k) => k !== 'sun').map((k) => E.relD(r2.beta[k], r.beta[k]))), heatRatio: r2.ev.ledger.heat / r.ev.ledger.heat } };
}
/** 受け手の自身の根(比べる列 —— 規則で決めない・格子は金星と同じ宣言) */
function ownRoot(HP, I, ST, key, src, family, p, form) {
  const st = ST[src], b = I.bodies[key], c0 = stencilAt(HP, I, st, IDX[key], IDX.sun, 1e4), grid = LD.radiusGrid(LD.DECL.venusGrid, { d: c0.d, Rd: b.Rd, R: b.R, RdSun: I.bodies.sun.Rd }).filter((R) => R >= 1e3);
  const keys = key === 'earth' ? SYS.triEM : SYS[key === 'mars' ? 'mars' : 'venus'];   // 地球は 3 体(月の口は勾配の型のまま —— 太陽の口だけを振る)
  const fn = (R) => { const c = stencilAt(HP, I, st, IDX[key], IDX.sun, R); if (!c.ok) return NaN; const tMap = { [key + ':sun']: c.t[form] };
    if (key === 'earth') for (const k of ['earth:moon', 'moon:sun', 'moon:earth']) tMap[k] = gradT(st, IDX[k.split(':')[0]], IDX[k.split(':')[1]]);
    return solveSys(I, keys, p, family, tMap).beta[key]; };
  const rg = LD.rootsOnGrid(fn, grid, LD.DECL.venusGrid.rootIter);
  return { key, src, family, p, form, d: c0.d, roots: rg.roots.map((r) => ({ R: r.x, kind: r.kind, ROverRobs: r.x / b.R, ROverRdK1: r.x / b.Rd, nearDist: c0.d - r.x, nearInsideSun: c0.d - r.x < I.bodies.sun.R, betaLo: r.fLo, betaHi: r.fHi })),
    acceptedPoints: rg.vals.filter((v) => v >= 0).length, points: grid.length,
    acceptedAtSmallest: rg.vals[0] >= 0, acceptedAtLargest: rg.vals[rg.vals.length - 1] >= 0 };
}
export function partML(HP, I, ST, V) {
  const D = LD.DECL, mars = [], triEM = [], own = [], base = [];
  for (const [fk, F] of Object.entries(V.frozen)) {
    if (F.Ralt === null) continue;
    for (const rule of D.rules) {
      const fr = Object.assign({ src: F.src, p: F.p, form: F.form }, F.rules[rule.key]);
      for (const family of [F.family]) {   // 規則は固定した族のまま当てる(族 S の根の規則は族 S・族 E の根の規則は族 E)
        mars.push(Object.assign({ frozen: fk, p: F.p, src: F.src, rule: rule.key, family, venusRoot: F.Ralt, venusNearInsideSun: F.nearInsideSun }, applyCase(HP, I, ST, 'mars', fr, family, 'grad')));
        for (const mp of D.moonPorts) triEM.push(Object.assign({ frozen: fk, p: F.p, src: F.src, rule: rule.key, family, moonPort: mp, venusRoot: F.Ralt, venusNearInsideSun: F.nearInsideSun }, applyCase(HP, I, ST, 'triEM', fr, family, mp)));
      }
    }
  }
  // 比べる行: 全部の口を勾配の型(今の K1)のまま(別の半径を当てない)
  for (const src of D.sources) for (const p of D.pGrid) for (const family of D.families) for (const sk of ['venus', 'mars', 'triEM']) {
    const st = ST[src], tMap = {};
    for (const key of SYS[sk].filter((k) => k !== 'sun')) for (const s2 of D.ports[key].k1) tMap[key + ':' + s2] = gradT(st, IDX[key], IDX[s2]);
    const r = solveSys(I, SYS[sk], p, family, tMap);
    base.push({ sys: sk, src, p, family, A: r.A, beta: Object.fromEntries(SYS[sk].filter((k) => k !== 'sun').map((k) => [k, r.beta[k]])), rejected: r.rows.filter((q) => q.rejected === true).map((q) => q.key), accepted: r.accepted, alongMaxRel: r.alongMaxRel, ledger: LD.ledgerOf(r.ev) });
  }
  for (const key of ['mars', 'earth']) for (const src of D.sources) for (const family of D.families) for (const p of [D.pMain, D.pAlso]) own.push(ownRoot(HP, I, ST, key, src, family, p, D.formMain));
  // 月の同期の行(潮汐の目標と自転 —— 同期のずれ)
  const mo = I.bodies.moon, sync = { s: mo.s, nAlong: I.tides['moon:earth'].along, rel: (I.tides['moon:earth'].along - mo.s) / mo.s };
  return { mars, triEM, own, base, moonSync: sync };
}

/* ───────── H 帳簿(金星の根の点と K1 のまま)───────── */
export function partH(HP, I, ST, V) {
  const D = LD.DECL, rows = [];
  for (const src of D.sources) for (const family of D.families) for (const p of [D.pMain, D.pAlso]) {
    const st = ST[src], k1 = solveSys(I, SYS.venus, p, family, { 'venus:sun': gradT(st, IDX.venus, IDX.sun) });
    rows.push({ src, family, p, at: 'K1', R: I.bodies.venus.Rd, accepted: k1.accepted, beta: k1.beta.venus, ledger: LD.ledgerOf(k1.ev), table: (family === D.familyMain && src === D.sourceMain) ? LD.portTable(k1.ev) : null });
    const F = V.frozen[src + ':' + family + ':' + p], c = V.sources[src].cols[D.formMain + ':' + family + ':' + p], r = F && F.Ralt !== null ? c.roots.find((z) => z.R === F.Ralt) : null;
    if (!r) continue;
    // 根の少し外(β が非負の側 —— 根の区間の端)で帳簿を取る(根そのものは潮汐の口の Γ = 0)
    const Rin = r.betaLo >= 0 ? r.lo : r.hi, sc = stencilAt(HP, I, st, IDX.venus, IDX.sun, Rin), sol = solveSys(I, SYS.venus, p, family, { 'venus:sun': sc.t[D.formMain] });
    rows.push({ src, family, p, at: 'root', R: Rin, accepted: sol.accepted, beta: sol.beta.venus, ledger: LD.ledgerOf(sol.ev), table: (family === D.familyMain && src === D.sourceMain) ? LD.portTable(sol.ev) : null });
  }
  return { rows };
}

/* ───────── 全部と門 ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const I = partI(HP), ST = { now: stateFor(HP, 'now'), J: stateFor(HP, 'J') }; mark('I');
  const KK = partK(HP, I, ST); mark('K');
  const V = partV(HP, I, ST, KK); mark('V');
  const ML = partML(HP, I, ST, V); mark('ML');
  const H = partH(HP, I, ST, V); mark('H');
  const P = LD.pureScenes(), PG = LD.pureGates(P);
  const inputs = { units: I.units, g: I.g, OmRefSI: I.OmRefSI, gain: I.gain, bodies: Object.fromEntries(KEYS.map((k) => { const b = I.bodies[k]; return [k, { i: b.i, name: b.name, m: b.m, R: b.R, s: b.s, a: b.a, axisEngineAngDeg: b.axisEngineAngDeg, Rd: b.Rd, moi: b.moi, I: b.I, rho: b.rho, gDotA: E.dot(I.g, b.a) }]; })),
    tides: I.tides };
  const J = { inputs, kernel: KK, venus: V, marsEarth: ML, ledger: H, pure: { scenes: P, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const K = J.kernel, V = J.venus, ML = J.marsEarth, H = J.ledger, D = LD.DECL;
  const cols = Object.values(V.sources).flatMap((s) => Object.values(s.cols));
  const cands = ML.mars.concat(ML.triEM).filter((q) => q.ok);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    axesFromDecl: Object.values(J.inputs.bodies).every((b) => b.axisEngineAngDeg < 1e-5),
    // 頭打ちは比の型の性質: 源の場が勝つ R(R ≥ 10 R_d*)で差分の型 D は見積り s_☉ R_src²/(5(d² − R²)) の 1% の内・勾配の型(体積平均)も同じ見積りの 2 倍の内
    saturationFromRatio: Object.values(K).every((k) => k.points.filter((q) => q.R >= 10 * k.RdCross && q.D !== null).every((q) => Math.abs(q.DoverSat - 1) <= 0.01)
      && k.points.filter((q) => q.R >= 10 * k.RdCross && q.gradOverSatAlong !== null).every((q) => q.gradOverSatAlong > 0.5 && q.gradOverSatAlong < 2)),
    stencilAlignsWithGrad: Object.values(K).every((k) => k.angleGradStencilDeg < 1),
    venusRecorded: cols.every((c) => c.points > 40 && c.roots.length === c.signChanges && c.roots.every((r) => r.alongMaxRel <= 1e-12 && (r.kind === 'jump' || Math.abs(r.betaAt) <= 1e-6 * r.bracketScale))),
    // 根の無い列は上界で読める(太陽の口の最大の寄与 < 要る大きさ)か、向きが逆(要る向きと最大の寄与の符号が違う)
    noRootByBound: cols.filter((c) => c.roots.length === 0).every((c) => c.shortfall > 1 || c.acceptedPoints === c.points || c.acceptedPoints === 0),
    stencilNoRootJ: ['diffStencil:S:' + D.pAlso, 'diffStencil:E:' + D.pAlso].every((k) => V.sources.J.cols[k].roots.length === 0),
    // 太陽の口の最大の寄与は要る大きさを超えるのに零点の無い列は、源の反作用で太陽の式の A が動く(要る大きさに届く点で A の比 > 1)
    reactionExplains: cols.filter((c) => c.zeros === 0 && c.shortfall < 1 && c.acceptedPoints === 0).every((c) => c.ARatioAtCross !== null && c.ARatioAtCross > 1 + 1e-3),
    frozenDeclared: V.frozen[D.sourceMain + ':' + D.familyMain + ':' + D.pMain] !== undefined,
    casesRecorded: cands.length > 0 && cands.every((q) => q.alongMaxRel <= 1e-12) && ML.base.every((q) => q.alongMaxRel <= 1e-12 && q.ledger.residualRel <= 1e-12),
    ledgerCloses: cands.every((q) => q.ledger.residualRel <= 1e-12 && q.ledger.LTotalRel <= 1e-12 && q.ledger.k1TransferRel <= 1e-12 && q.ledger.portCloseMaxRel <= 1e-12 && q.ledger.holdWorkMaxRel <= 1e-12)
      && H.rows.every((q) => q.ledger.residualRel <= 1e-12 && q.ledger.LTotalRel <= 1e-12 && q.ledger.k1TransferRel <= 1e-12 && q.ledger.portCloseMaxRel <= 1e-12),
    scaleNotIdentified: cands.every((q) => q.scale.ARel <= 1e-12 && q.scale.betaRelMax <= 1e-12 && E.relD(q.scale.heatRatio, D.scaleLambda) <= 1e-12),
    negativeNotClipped: cands.every((q) => Object.entries(q.beta).every(([k, v]) => (q.rejected.includes(k) ? v < 0 : v >= 0))),
    // 月 ↔ 地球の口の 2 列(勾配の型・同じ規則の差分)は β が相対 1e-9 の内で同じ(月 ↔ 地球の寄与は小さい —— 表は勾配の列だけ)
    moonPortsSame: ML.triEM.filter((q) => q.ok && q.moonPort === 'grad').every((q) => { const a = ML.triEM.find((z) => z.ok && z.moonPort === 'alt' && z.frozen === q.frozen && z.rule === q.rule && z.family === q.family);
      return !!a && Object.keys(q.beta).every((k) => E.relD(q.beta[k], a.beta[k]) <= 1e-9); }),
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W327E_TARGET || 'beta/index.html';
  const OUT = process.env.W327E_OUT ? (path.isAbsolute(process.env.W327E_OUT) ? process.env.W327E_OUT : path.join(ROOT, process.env.W327E_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第327便e axialdiff(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: LD.LIB_VERSION, w327aLibVersion: LS.LIB_VERSION, w326dLibVersion: E.LIB_VERSION, generator: 'tests/exp-w327e-axialdiff.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の指示(2026-11-05)「軸引きずりについて」(引きずる側の回転引きずりによる、引きずられる側の近い位置と遠い方位置の差分が軸引きずり・密度差を考慮して R_d を使う/十分に離れているか密度が低い場合は観測半径が影響しない勾配とみなせたので K1 が適用できた/金星では銀河の軸引きずりは勾配とみなせるが太陽の軸引きずりは観測半径を無視できない —— 銀河に対しては K1・太陽に対しては別の半径/固体惑星は 太陽–金星 → 太陽–火星 → 太陽–地球–月 の順に検証)・統括の検証項目 R299',
    decl: LD.DECL, moiAdd: LD.MOI_ADD, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w327e-axialdiff.mjs', 'tests/lib-w327e-axialdiff.mjs', 'tests/exp-w327a-axialsum.mjs', 'tests/lib-w327a-axialsum.mjs', 'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第327便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axialdiff', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

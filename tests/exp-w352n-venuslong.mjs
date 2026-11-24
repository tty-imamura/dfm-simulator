// 第352便n(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R451):
//   **金星の長い步の器 —— 合成の回転の下の (R3) の 2 経路の閉じた形の步と行き着く向き(表 0)・残りの回転の向きと 90° の両側(表 1)・初めを順行に置いたときの行き先と要る時間(表 1′)・
//   背景の倍率を金星の条件の前後で振る(表 2)・公転面の向きを基準軸のまわりに一周させる(表 3)・「安定した歳差」の判定の量と回る合成の軸の戻る点(表 4)・零試験 14**
//   (段 venuslong-352n —— 正本 tests/out/venuslong-352n.json・lib tests/lib-w352n-venuslong.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352n-venuslong.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。仮の値は使わない(閉包に仮の値の lib を含まない)。
//   太陽系の年齢は第318便d の LIT.sunAge(文献の値・未照合 —— 第352便i の DECL.sunAgeYr)を物差しにだけ使う。
//
// ■ 言わないこと: 金星の逆回転の答えとは書かない(行き先の表と要る時間)。歳差の向き (g2±)・背景の向き (N+)(G−)・基準軸 L/eq・読み (α)(β)・比率 f はどれにも寄せない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352n-venuslong.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as SI from './lib-w352i-stableprec.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352n-venuslong-1';
export const OUT_MAIN = 'tests/out/venuslong-352n.json';
export const TARGET = 'tests/lib-w352n-venuslong.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = 365.25 * 86400, D2R = Math.PI / 180;
const { dot, nrm, unit } = RA.vec;
export const NOT_CLAIM = Object.freeze([
  '金星の逆回転の答えとは書かない —— この場・この成分 (S)・この背景の向き・この基準軸・このノブでの行き先の表と要る時間',
  '歳差の向き (g2+)・(g2−)、背景の向き (N+)・(G−)、基準軸 L・eq は同じ重さで並べた(どれにも寄せない)', '90° を越えた後の読み (α)・(β) と比率 f(0・0.1・0.5・1)は選ばない',
  '合成の回転は一定(公転面・太陽の自転軸・背景の向きの動きは表 3・表 4 の引数の形だけ)', '太陽系の年齢は文献の値・未照合(物差しにだけ使う)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 14(起点の数 2〔残り 1.0%・1.3%/角 90.49°・88.96°・傾き 177.36°〕・同じ Ω・90° の両側の閉じた形・f 0 は角を保つ・第351便d の closedR3 と一致・r3Step の数値・(g2−) の向き・行き着く範囲・公転の法線を回した (S) の閉じた形・ψ 0 の残り・入れ替わりの u・変異・拒否)',
  t0: '長い步(いまの自転軸から): 4 天体 × 背景 3((N+) L・(N+) eq・(G−))× f 4 × (g2±) × 読み (α)(β) —— 軌跡(k₁ τ 0〜20)と行き着く向き・要る時間((uV))',
  t1: '残りの回転の向き: 背景 3 × Ω̂ と基準軸・公転の法線・自転軸の角・(S) の向きの閉じた形と二等分の向き・90° の両側の閉じた形 cos θ = (cos α_b − cos α_S) ÷ (2 sin(φ/2))',
  t1p: '初めを順行(傾き 0°・2.6°・23° × 方位 4)に置いたときの行き着く向き: 背景 3 × f 4 × (g2±) × 読み 2 × 大きさ 2((uV)・倍率 1)—— 方位 4 の最小と最大・要る時間(年と太陽系の年齢の倍)',
  t2: '倍率を (uV) × 0.5〜2 で振る: 金星・水星・地球 × 背景 3 × 倍率 16 —— 合成 ÷ 背景・Ω̂ と基準軸・背景の向き・公転の法線の角・順行の初めからの行き先・入れ替わりの u と幅',
  t3: '金星の公転の法線を基準軸のまわりに一周(ψ 0〜350°・刻み 10°)× 基準軸 L・eq —— 残り・φ・Ω̂ と基準軸の角と方位・ι・自転軸との角(固定と一緒に回す)・いまの位置',
  t4: '「安定した歳差」の判定の量(第352便i の judgeConst): 背景 3 × f 4 × (g2±) —— 回る合成の軸(基準軸のまわり・傾き I = Ω̂ と基準軸の角)で金星のいまの向きが戻る点になる ρ(第352便i の invertTarget)' });
export const ROWDECL = Object.freeze({ bodies: L.DECL.bodies, bgCols: L.DECL.bgCols, fGrid: L.DECL.fGrid, senses: L.DECL.senses, reads: L.DECL.reads, startObl: L.DECL.startObl, startAz: L.DECL.startAz,
  uCols: Object.freeze(['uV', 'u1']), uScan: L.DECL.uScan, scanBodies: L.DECL.scanBodies, psiStepDeg: L.DECL.psiStepDeg, judgeF: L.DECL.judgeF, invF: L.DECL.invF });
const RD = ROWDECL;
const r6 = (x) => (x === null || x === undefined ? null : Number(Number(x).toPrecision(6)));
const finSum = (F) => (F.kind === 'point' ? { kind: F.kind, epsDeg: F.epsDeg, side: F.side, beyond90: F.beyond90 } : { kind: F.kind, epsMin: F.epsMin, epsMax: F.epsMax, side: F.side, beyond90: F.beyond90 });

/* ───────── 表 0: いまの自転軸からの長い步 ───────── */
export function longTable(T1, GEO, AX, uV, cache, sunAge) {
  const rows = [];
  for (const id of RD.bodies) for (const [dir, axis] of RD.bgCols) {
    const st = L.stateOf(T1, GEO, id, { dir, axis: axis === 'gal' ? 'eq' : axis, u: uV, AX }, cache), oh = unit(st.Om);
    for (const f of RD.fGrid) for (const sense of RD.senses) for (const read of RD.reads) {
      const F = L.finalOf({ s0: st.sHat, oh, nHat: st.nHat, f, sense, read }), tr = L.trajectory({ s0: st.sHat, oh, nHat: st.nHat, f, sense, read });
      const tYr = L.tauToYr(F.tauSettle, st.W);
      rows.push({ id, dir, axis, f, sense, read, th0Deg: st.thDeg, obl0Deg: st.oblDeg, iotaDeg: st.iotaDeg, resOverBg: st.resOverBg, WAsYr: st.W * L.ASYR,
        ...finSum(F), tSettleYr: tYr, tSettleAge: tYr === null ? null : tYr / sunAge, trace: tr.map((p) => ({ k1tau: p.k1tau, thDeg: p.thDeg, epsDeg: p.epsDeg })) });
    }
  }
  return rows;
}
/* ───────── 表 1: 残りの回転の向き ───────── */
export function dirTable(T1, GEO, AX, uV, cache) {
  const rows = [], sun = unit(GEO['Earth|Sun'].s);
  for (const [dir, axis] of RD.bgCols) {
    const st = L.stateOf(T1, GEO, 'Venus', { dir, axis: axis === 'gal' ? 'eq' : axis, u: uV, AX }, cache), sp = L.splitOf(st.sHat, st.bVec, st.local), az = RA.azimuthDeg(st.ref, st.Om);
    rows.push({ dir, axis, resOverBg: st.resOverBg, angRefDeg: L.angDeg(st.Om, st.ref), azRefDeg: az.az, iotaDeg: st.iotaDeg, thDeg: st.thDeg, oblDeg: st.oblDeg,
      phiDeg: sp.phiDeg, alphaB: sp.alphaB, alphaS: sp.alphaS, thClosedDeg: sp.thDeg, midToRefDeg: L.angDeg(sp.mid, st.ref), midToOmDeg: L.angDeg(sp.mid, st.Om),
      sClosedErrDeg: L.angDeg(L.sDirClosed(sun, st.nHat), st.local.map((x) => -x)), bToNDeg: L.angDeg(st.bVec, st.nHat), msToNDeg: L.angDeg(st.local.map((x) => -x), st.nHat) });
  }
  return { rows, axesLeqDeg: L.angDeg(AX.L, AX.eq), sunToN: L.angDeg(sun, L.stateOf(T1, GEO, 'Venus', { dir: 'Np', axis: 'eq', u: uV, AX }, cache).nHat) };
}
/* ───────── 表 1′: 初めを順行に置いたときの行き先 ───────── */
export function startTable(T1, GEO, AX, uV, cache, sunAge) {
  const rows = [];
  for (const uc of RD.uCols) for (const [dir, axis] of RD.bgCols) {
    const u = uc === 'uV' ? uV : 1, st = L.stateOf(T1, GEO, 'Venus', { dir, axis: axis === 'gal' ? 'eq' : axis, u, AX }, cache), oh = unit(st.Om);
    for (const obl of RD.startObl) for (const f of RD.fGrid) for (const sense of RD.senses) for (const read of RD.reads) {
      let lo = Infinity, hi = -Infinity, sides = new Set(), tMax = 0, th0s = [], kinds = new Set();
      for (const az of RD.startAz) {
        const s0 = L.startSpin(st.nHat, oh, obl, az), F = L.finalOf({ s0, oh, nHat: st.nHat, f, sense, read });
        const a = F.kind === 'point' ? F.epsDeg : F.epsMin, b = F.kind === 'point' ? F.epsDeg : F.epsMax;
        lo = Math.min(lo, a); hi = Math.max(hi, b); sides.add(F.side); kinds.add(F.kind); th0s.push(L.angDeg(s0, oh)); if (F.tauSettle !== null) tMax = Math.max(tMax, F.tauSettle);
      }
      const tYr = f === 0 ? null : L.tauToYr(tMax, st.W);
      rows.push({ u: uc, dir, axis, obl0: obl, f, sense, read, iotaDeg: st.iotaDeg, th0Min: Math.min(...th0s), th0Max: Math.max(...th0s), kinds: [...kinds].sort(), epsLo: lo, epsHi: hi,
        sides: [...sides].sort(), reachRetro: hi > 90 + L.DECL.sideBandDeg, tSettleYr: tYr, tSettleAge: tYr === null ? null : tYr / sunAge });
    }
  }
  return rows;
}
/* ───────── 表 2: 倍率の振り ───────── */
export function scanTable(T1, GEO, AX, uV, cache) {
  const rows = [], cross = [];
  for (const id of RD.scanBodies) for (const [dir, axis] of RD.bgCols) {
    let c0 = null;
    for (const x of RD.uScan) {
      const q = L.scanOf(T1, GEO, id, { dir, axis: axis === 'gal' ? 'eq' : axis, u: x * uV, AX }, cache), oh = unit(q.Om);
      const Fa = L.finalOf({ s0: q.nHat, oh, nHat: q.nHat, f: 0.5, sense: 'g2p', read: 'alpha' }), Fb = L.finalOf({ s0: q.nHat, oh, nHat: q.nHat, f: 0.5, sense: 'g2p', read: 'beta' });
      const Fc = L.finalOf({ s0: q.sHat, oh, nHat: q.nHat, f: 0.5, sense: 'g2p', read: 'beta' });
      rows.push({ id, dir, axis, x, resOverBg: q.resDirect, angBgDeg: q.angBgDeg, angRefDeg: q.angRefDeg, iotaDeg: q.iotaDeg, thDeg: q.thDeg, rS: q.rS,
        proAlpha: finSum(Fa), proBeta: finSum(Fb), nowBeta: finSum(Fc) });
      c0 = q;
    }
    cross.push({ id, dir, axis, uMagOverUV: c0.uMag / uV, uCrossOverUV: c0.uCross / uV, uWidthOverUV: c0.uWidth / uV, phiDeg: c0.phiDeg, twoSinPhi: 2 * Math.sin(c0.phiDeg * D2R) * c0.uMag / uV });
  }
  return { rows, cross };
}
/* ───────── 表 3: 公転面の向きを一周 ───────── */
export function turnTable(T1, GEO, AX, uV, cache) {
  const out = {};
  for (const axis of ['L', 'eq']) {
    const st = L.stateOf(T1, GEO, 'Venus', { dir: 'Np', axis, u: uV, AX }, cache), ref = AX[axis], b1 = L.b1(), rows = [];
    for (let psi = 0; psi < 360; psi += RD.psiStepDeg) {
      const t = L.turnRow(T1, GEO, { psiDeg: psi, ref, bHat: st.bVec, uV, b1, nHat0: st.nHat, sHat0: st.sHat }), sCo = SI.rotAbout(st.sHat, ref, psi * D2R);
      rows.push({ psiDeg: psi, r: t.r, phiDeg: t.phiDeg, res: t.res, angRefDeg: t.angRefDeg, azRefDeg: RA.azimuthDeg(ref, t.Om).az, iotaDeg: t.iotaDeg, thSpinFixedDeg: t.thSpinDeg,
        thSpinCoDeg: L.angDeg(t.Om, sCo), dirErrDeg: t.dirErrDeg, nAzDeg: RA.azimuthDeg(ref, t.n).az });
    }
    const rs = rows.map((r) => r.res), mn = rows.reduce((a, b) => (b.res < a.res ? b : a)), mx = rows.reduce((a, b) => (b.res > a.res ? b : a));
    // 最小の近くを 0.25° 刻みで(格子の最小の ±10°)
    let fine = null;
    for (let k = -40; k <= 40; k++) { const psi = mn.psiDeg + k * 0.25, t = L.turnRow(T1, GEO, { psiDeg: psi, ref, bHat: st.bVec, uV, b1, nHat0: st.nHat, sHat0: st.sHat });
      if (fine === null || t.res < fine.res) fine = { psiDeg: ((psi % 360) + 360) % 360, res: t.res, angRefDeg: t.angRefDeg, thSpinFixedDeg: t.thSpinDeg, iotaDeg: t.iotaDeg }; }
    out[axis] = { incDeg: L.angDeg(st.nHat, ref), rows, fineMin: fine, psiFromMinDeg: ((fine.psiDeg + 180) % 360) - 180, resNow: rows[0].res, resMin: mn.res, psiMin: mn.psiDeg, resMax: mx.res, psiMax: mx.psiDeg, resMean: rs.reduce((a, b) => a + b, 0) / rs.length,
      rankNow: rs.filter((x) => x < rows[0].res).length, nRows: rows.length, beyond90Fixed: rows.filter((r) => r.thSpinFixedDeg > 90).length, beyond90Co: rows.filter((r) => r.thSpinCoDeg > 90).length };
  }
  return out;
}
/* ───────── 表 4: 安定した歳差の判定 ───────── */
export function judgeTable(T1, GEO, AX, uV, cache) {
  const rows = [], inv = [];
  for (const [dir, axis] of RD.bgCols) {
    const st = L.stateOf(T1, GEO, 'Venus', { dir, axis: axis === 'gal' ? 'eq' : axis, u: uV, AX }, cache);
    for (const f of RD.judgeF) for (const sense of RD.senses) {
      const J = SI.judgeConst({ thDeg: st.thDeg, W: st.W, f, sense });
      rows.push({ dir, axis, f, sense, thDeg: st.thDeg, dThPerTurnDeg: J.dThPerTurnDeg, phasePerTurnDeg: J.phasePerTurnDeg, returnPerTurn: J.returnPerTurn, returnSign: Math.sign(J.returnRate),
        TWyr: 2 * Math.PI / st.W / YR, tStarYr: J.tStar, tEYr: J.tE });
    }
    if (dir !== 'Np') continue;
    const IDeg = L.angDeg(st.Om, st.ref), target = L.angDeg(st.sHat, st.ref);
    for (const f of RD.invF) for (const sense of RD.senses) {
      // invertTarget は符号の替わりを拾う —— 止まる点が大円の反対側へ跳ぶ所(半頂角が目標を跳び越える)も拾うので、半頂角が目標から 1e-4° の内の根だけを残す(跳びの数は jumps に)
      const all = SI.invertTarget({ targetDeg: target, IDeg, f, sense }), roots = all.filter((q) => Math.abs(q.halfDeg - target) < 1e-4), { k2 } = SI.kOf(f, sense);
      inv.push({ dir, axis, f, sense, IDeg, targetDeg: target, nRoots: roots.length, jumps: all.length - roots.length,
        roots: roots.map((q) => { const g = q.rho * (k2 > 0 ? k2 : 1) * st.W; return { rho: q.rho, halfDeg: q.halfDeg, lagDeg: q.lagDeg, returnRate: q.returnRate, periodYr: 2 * Math.PI / Math.abs(g) / YR }; }) });
    }
  }
  return { rows, inv };
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const v = (dir, axis) => J.dir.rows.find((r) => r.dir === dir && r.axis === axis);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 14,
    t0: J.long.length === RD.bodies.length * RD.bgCols.length * RD.fGrid.length * RD.senses.length * RD.reads.length && J.long.filter((r) => r.f === 0).every((r) => r.kind === 'cone')
      && J.long.filter((r) => r.f > 0 && r.read === 'alpha').every((r) => r.kind === 'point' && Math.abs(r.epsDeg - r.iotaDeg) < 1e-9),
    t1: J.dir.rows.length === 3 && J.dir.rows.every((r) => Math.abs(r.sClosedErrDeg) < 1e-5) && v('Np', 'L').thDeg > 90 && v('Np', 'eq').thDeg < 90
      && ['L', 'eq'].every((a) => Math.abs(v('Np', a).thClosedDeg - v('Np', a).thDeg) < 1e-6 && Math.abs(v('Np', a).midToOmDeg - 90) < 1e-6),
    t1p: J.start.length === RD.uCols.length * RD.bgCols.length * RD.startObl.length * RD.fGrid.length * RD.senses.length * RD.reads.length && J.start.every((r) => r.epsLo <= r.epsHi),
    t2: J.scan.rows.length === RD.scanBodies.length * RD.bgCols.length * RD.uScan.length && J.scan.cross.length === RD.scanBodies.length * RD.bgCols.length,
    t3: ['L', 'eq'].every((a) => J.turn[a].nRows === 360 / RD.psiStepDeg && J.turn[a].rows.every((r) => Math.abs(r.dirErrDeg) < 1e-5) && Math.abs(J.turn[a].rows[0].r - 1) < 1e-12),
    t4: J.judge.rows.length === RD.bgCols.length * RD.judgeF.length * RD.senses.length && J.judge.inv.length === 2 * RD.invF.length * RD.senses.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PSc = L.pureScenes(T1, GEO), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const AX = RA.refAxes(T1, GEO), uV = L.uVOf(T1, GEO, cache), sunAge = SI.DECL.sunAgeYr;
  const long = longTable(T1, GEO, AX, uV, cache, sunAge); mark('t0');
  const dir = dirTable(T1, GEO, AX, uV, cache); mark('t1');
  const start = startTable(T1, GEO, AX, uV, cache, sunAge); mark('t1p');
  const scan = scanTable(T1, GEO, AX, uV, cache); mark('t2');
  const turn = turnTable(T1, GEO, AX, uV, cache); mark('t3');
  const judge = judgeTable(T1, GEO, AX, uV, cache); mark('t4');
  const J = { pure, uV, sunAgeYr: sunAge, axes: { eq: AX.eq, L: AX.L }, long, dir, start, scan, turn, judge, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352n-venuslong.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export async function main() {
  const OUT = process.env.W352N_OUT ? (path.isAbsolute(process.env.W352N_OUT) ? process.env.W352N_OUT : path.join(ROOT, process.env.W352N_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便n venuslong(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352n-venuslong.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R451', decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便n', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'venuslong', engine: 'Node(html を読まない —— 純関数の lib・第352便c・d・e・i・第351便c・d の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

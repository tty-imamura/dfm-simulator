// 第352便h(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R445):
//   **金星の器 —— 太陽由来の (S) と背景の打ち消し(表 1)・残りの大きさを決める角(表 2)・釣り合いの点(距離の関数 —— 表 3・8 惑星の外からの軸の拘束 —— 表 3 の続き)・
//   金星の位置でのほかの源(表 4)・地球との共鳴の算術(表 5 —— 仮・未照合)・「逆回転」への道の整理(表 6)・零試験 12**
//   (段 venusbal-352h —— 正本 tests/out/venusbal-352h.json・lib tests/lib-w352h-venusbal.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352h-venusbal.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。
//   仮の値(第352便b の台帳の 3 件)を使うので、正本の最上位に provisional: true と使った鍵の一覧を持つ(lint.provisionalScope352b)。
//
// ■ 言わないこと: 金星の釣り合いの判定・共鳴の判定・逆回転の答えとは書かない。背景の向き (N+)(G−)・基準軸 L/eq・金星の条件の中身 (ア)(イ) はどれにも寄せない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352h-venusbal.mjs';
import * as RA from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352h-venusbal-1';
export const OUT_MAIN = 'tests/out/venusbal-352h.json';
export const TARGET = 'tests/lib-w352h-venusbal.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const AY = L.AS_YR, YRS = 365.25 * 86400;
export const NOT_CLAIM = Object.freeze([
  '金星の釣り合いの判定・共鳴の判定・逆回転の答えとは書かない —— この場・この成分・この背景の向き・この基準軸では、の表',
  '(ア) 大きさが同じ・(イ) 合成が最小は、「金星で釣り合う」の中身の候補 2 つ(どちらにも寄せない —— (ウ) 置かないも候補)',
  '背景の向き (N+)(G−) と基準軸 L・eq は同じ重さで並べた(黄道の極は比べる列)', '共鳴の算術は仮の値(第352便b の台帳)を使った数 —— 仮・未照合・判定に入れない',
  '「逆回転」への道は式の候補と、数えられる量と足りない量の表だけ(自転の率と位相の積分の步は無い)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 12(統括の数 3〔(uV)・残り 1.0%・合成 ÷ 背景〕・反平行で 0・直交と平行で打ち消さない・閉じた形と直接の照合・(S) の向きの閉じた形・closedSEq と −3 乗・pointRot と rotOf・共鳴の算術・変異・拒否)',
  t1: '金星の打ち消し: 成分 (S)(MS) × 背景の向き (N+)(N−)〔基準軸 eq・L・ecl〕・(G−)(G+) —— (ア) uMag・(イ) uMin・残り・φ・閉じた形の φ・小角の式',
  t2: '残りを決める角: 基準軸 3 つ × 太陽の自転軸との角・金星の公転の法線との角・太陽の自転軸と金星の法線の角 i・−Ŝ の法線からの離れ atan(tan i ÷ 2)・φ',
  t3: '釣り合いの点: 基準軸 3 つ × 距離 11 + 合成が最小の距離 r*(背景 = (uV) の大きさ・(N+))/8 惑星の合成 ÷ 背景((uV)・(N+) 3 軸・(G−))',
  t4: 'ほかの源(受け手 = 金星): 地球・木星・水星 × (S)(M) × 内合・外合・会合の平均(位相 72)と、太陽の (S) と背景の残りとの比',
  t5: '地球との共鳴の算術(仮・未照合): 自転周期の列 5 × 会合周期・太陽日・回転の数・経度のずれ・一巡の年数・共鳴の周期からの差',
  t6: '「逆回転」への道: (a) 傾きが 90° を越える道・(b) 自転が減って逆になる道 × 背景の向き 2 —— 数えられる量と足りない量' });

const { dot, crs, nrm, scl, add, unit } = RA.vec;
export const ROWDECL = Object.freeze({ dirsT1: L.DECL.dirs, axes: L.DECL.axes, parts: L.DECL.parts, rGridAU: L.DECL.rGridAU, others: L.DECL.others, othParts: L.DECL.othParts,
  t3cols: Object.freeze([['Np', 'eq'], ['Np', 'L'], ['Np', 'ecl'], ['Gm', 'gal']]), t6dirs: Object.freeze([['Np', 'eq'], ['Np', 'L'], ['Gm', 'gal']]),
  spinRows: Object.freeze(['prov', 'provLo', 'provHi', 'repo', 'res']) });
const RD = ROWDECL;

/* ───────── 表 1: 金星の打ち消し ───────── */
export function cancelTable(T1, GEO, AX, cache) {
  const rows = [];
  for (const part of RD.parts) for (const dir of RD.dirsT1) for (const axis of (dir === 'Np' || dir === 'Nm') ? RD.axes : ['gal']) {
    const r = L.cancelRow(T1, GEO, 'Venus', { part, dir, axis, AX }, cache);
    rows.push({ part, dir, axis: r.axis, uMag: r.uMag, uMin: r.uMin, cancels: r.cancels, minOverMag: r.minOverMag, phiDeg: r.phiDeg, resMag: r.resMag, resMin: r.resMin,
      phiClosedDeg: r.closed ? r.closed.phiClosedDeg : null, phiSmallDeg: r.closed && dir === 'Np' ? r.closed.phiSmallDeg : null, dirErrDeg: r.closed ? r.closed.dirErrDeg : null, sMagAsYr: r.sMagAsYr });
  }
  return rows;
}
/* ───────── 表 2: 残りを決める角 ───────── */
export function angleTable(T1, GEO, AX, cache) {
  const V = L.localSun(T1, GEO, 'Venus', {}, cache), sun = unit(GEO['Earth|Sun'].s), n = V.nHat, i = RA.angDeg(sun, n), m = L.sDirClosed(sun, n);
  return { iDeg: i, offDeg: RA.angDeg(m, n), offClosedDeg: Math.atan(Math.tan(i * Math.PI / 180) / 2) * 180 / Math.PI,
    rows: RD.axes.map((a) => ({ axis: a, sunDeg: RA.angDeg(AX[a], sun), nDeg: RA.angDeg(AX[a], n), phiDeg: RA.angDeg(scl(V.S, -1), AX[a]), phiClosedDeg: RA.angDeg(m, AX[a]), phiSmallDeg: L.phiSmallDeg(sun, n, AX[a]) })) };
}
/* ───────── 表 3: 釣り合いの点 ───────── */
export function scanTable(T1, GEO, AX, uV) {
  const B = uV * L.b1(), rows = [], star = [];
  for (const a of RD.axes) {
    const ax = AX[a];
    for (const au of RD.rGridAU) rows.push({ axis: a, ...L.scanAt(T1, GEO, ax, au * L.AU, ax, B) });
    const rs = L.rStar(T1, GEO, ax, ax, B), at = rs === null ? null : L.scanAt(T1, GEO, ax, rs, ax, B);
    const inner = L.scanAt(T1, GEO, ax, 0.3 * L.AU, ax, B), outer = L.scanAt(T1, GEO, ax, 2 * L.AU, ax, B);
    star.push({ axis: a, rStarAU: rs === null ? null : rs / L.AU, combOverB: at && at.combOverB, phiDeg: at && at.phiDeg, innerAngToS: inner.angToS, outerAngToBg: outer.angToBg,
      coneSunDeg: RA.angDeg(ax, unit(GEO['Earth|Sun'].s)) });
  }
  return { B, BAsYr: B * AY, rows, star };
}
export function planetTable(T1, GEO, AX, uV, cache) {
  const B = uV * L.b1(), rows = [];
  for (const id of L.DECL.planets) {
    const V = L.localSun(T1, GEO, id, {}, cache), cols = {};
    for (const [dir, axis] of RD.t3cols) { const bh = L.bgUnit(dir, axis === 'gal' ? null : AX[axis]); cols[dir + '|' + axis] = { comb: L.resDirect(V.S, bh, L.b1(), uV), phiDeg: RA.angDeg(scl(V.S, -1), bh) }; }
    rows.push({ id, sOverB: nrm(V.S) / B, cols });
  }
  const ven = rows.find((r) => r.id === 'Venus'), ratio = {};
  for (const [dir, axis] of RD.t3cols) { const k = dir + '|' + axis, mn = rows.reduce((x, y) => (y.cols[k].comb < x.cols[k].comb ? y : x));
    ratio[k] = { minId: mn.id, mercury: rows.find((r) => r.id === 'Mercury').cols[k].comb / ven.cols[k].comb, earth: rows.find((r) => r.id === 'Earth').cols[k].comb / ven.cols[k].comb }; }
  return { rows, ratio };
}
/* ───────── 表 4: ほかの源 ───────── */
export function otherTable(T1, GEO, AX, uV, cache) {
  const V = L.localSun(T1, GEO, 'Venus', {}, cache), B = uV * L.b1();
  const resid = { np: nrm(add(V.S, scl(L.bgUnit('Np', AX.eq), B))), npL: nrm(add(V.S, scl(L.bgUnit('Np', AX.L), B))), gm: nrm(add(V.S, scl(L.bgUnit('Gm', null), B))), sunS: nrm(V.S), sunM: nrm(V.M) };
  const rows = [];
  for (const src of RD.others) {
    const O = L.otherSrc(T1, GEO, src);
    for (const part of RD.othParts) rows.push({ src, part, inf: nrm(O.inf[part]), sup: nrm(O.sup[part]), mean: nrm(O.mean[part]), meanMag: O.meanMag[part],
      infOverRes: nrm(O.inf[part]) / resid.np, meanOverRes: O.meanMag[part] / resid.np, infOverSup: nrm(O.inf[part]) / nrm(O.sup[part]), dInfAU: O.dInf / L.AU, dSupAU: O.dSup / L.AU });
  }
  const sOnly = rows.filter((r) => r.part === 'S'), topS = sOnly.reduce((x, y) => (y.meanMag > x.meanMag ? y : x)), topAll = rows.reduce((x, y) => (y.meanMag > x.meanMag ? y : x));
  return { resid: Object.fromEntries(Object.entries(resid).map(([k, v]) => [k, { radS: v, asYr: v * AY }])), rows, topS: topS.src, topAll: topAll.src + '|' + topAll.part };
}
/* ───────── 表 5: 共鳴の算術(仮・未照合)───────── */
export function resonanceTable() {
  const e = PV.prov('venus.spin.period'), oV = PV.repoRef('repo.orbitDays.venus'), oE = PV.repoRef('repo.orbitDays.earth'), sig = e.sigmaGiven;
  const base = L.resonanceArith({ spinDays: e.value, orbV: oV, orbE: oE });
  const spins = { prov: e.value, provLo: e.value - sig, provHi: e.value + sig, repo: Math.abs(PV.repoRef('repo.venus.spinDays')), res: PV.provValue('venus.resonance.period') };
  const rows = RD.spinRows.map((k) => { const r = L.resonanceArith({ spinDays: spins[k], orbV: oV, orbE: oE }); return { key: k, spinDays: spins[k], ...r, dPsigma: r.dP / sig }; });
  const t = { orbV: oV, orbE: oE, synodicProv: PV.provValue('venusEarth.synodic'), synodicRepo: base.S, Pres: base.Pres, sigma: sig, rows };
  return PV.tagProv(t, L.DECL.provKeys.slice());
}
/* ───────── 表 6: 「逆回転」への道 ───────── */
export const PATHS = Object.freeze([
  Object.freeze({ id: 'a', name: '(a) 傾きが 90° を越えて反転する道(経路 ① —— 第351便d の 90° を越えた後の読み)', can: '外からの軸の拘束の残り Ω の直交成分 abs(Ω⊥)・寄る率の時間 1 ÷ (k₁ abs(Ω⊥))・Ω の向きと自転軸の角', lack: '経路 ① の比率 k₁ と比 ω_T ÷ ω_L の金星の値・90° を越えた後の向きの読み(行き先の 2 列)・ほかのトルク(潮汐・大気)の列' }),
  Object.freeze({ id: 'b', name: '(b) 自転が減って逆になる道(平行成分 = 引きずり回転の側 —— 第350便c・d の帳簿)', can: '平行成分 ŝ·Ω(引きずり回転の 1 步の値)と金星の自転の率の比', lack: '慣性回転を積む步(第348便b の (S1)・行き先 (E2) の割り振り)・自転の率と位相を積分する步・熱の行き先の列' }),
]);
export function pathTable(T1, GEO, AX, uV, cache) {
  const V = L.localSun(T1, GEO, 'Venus', {}, cache), B = uV * L.b1(), wV = Math.abs(T1.find((r) => r.id === 'Venus' && r.src === 'Sun' && r.mag === 'm2').omega), s = V.sHat;
  const rows = RD.t6dirs.map(([dir, axis]) => {
    const Om = add(V.S, scl(L.bgUnit(dir, axis === 'gal' ? null : AX[axis]), B)), par = dot(s, Om), perp = nrm(add(Om, scl(s, -par)));
    return { dir, axis, omAsYr: nrm(Om) * AY, parAsYr: par * AY, perpAsYr: perp * AY, cosS: par / nrm(Om), tPerpYr: perp > 0 ? 1 / perp / YRS : null, parOverSpin: Math.abs(par) / wV, thetaDeg: RA.angDeg(s, Om) };
  });
  return { wV, rows };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = (part, dir, axis) => J.cancel.find((r) => r.part === part && r.dir === dir && r.axis === axis);
  const np = t1('S', 'Np', 'eq');
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.cancel.length === 16 && Number(np.resMag.toFixed(3)) === 0.010 && J.cancel.filter((r) => r.part === 'S' && r.dir === 'Nm').every((r) => r.uMin === null) && J.cancel.filter((r) => r.part === 'S').every((r) => Math.abs(r.dirErrDeg) < 1e-5),
    t2: J.angle.rows.length === 3 && Math.abs(J.angle.offDeg - J.angle.offClosedDeg) < 1e-9 && J.angle.rows.every((r) => Math.abs(r.phiDeg - r.phiClosedDeg) < 1e-5),
    t3: J.scan.rows.length === 3 * RD.rGridAU.length && J.scan.star.every((r) => r.rStarAU !== null && r.innerAngToS < 90 && r.outerAngToBg < 90) && J.planets.rows.length === 8 && J.planets.ratio['Np|eq'].minId === 'Venus',
    t4: J.other.rows.length === RD.others.length * RD.othParts.length && J.other.rows.every((r) => r.inf > 0 && r.sup > 0 && r.dInfAU < r.dSupAU),
    t5: J.resonance.provisional === true && J.resonance.rows.length === RD.spinRows.length && Math.round(J.resonance.rows[0].turns) === 5 && Number(J.resonance.rows[0].shiftDeg.toFixed(3)) === 0.513,
    t6: J.paths.rows.length === RD.t6dirs.length && J.paths.rows.every((r) => r.tPerpYr > 0 && r.parOverSpin < 1e-6),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const AX = RA.refAxes(T1, GEO), uV = nrm(L.localSun(T1, GEO, 'Venus', {}, cache).S) / L.b1();
  const cancel = cancelTable(T1, GEO, AX, cache); mark('t1');
  const angle = angleTable(T1, GEO, AX, cache); mark('t2');
  const scan = scanTable(T1, GEO, AX, uV), planets = planetTable(T1, GEO, AX, uV, cache); mark('t3');
  const other = otherTable(T1, GEO, AX, uV, cache); mark('t4');
  const resonance = resonanceTable(); mark('t5');
  const paths = pathTable(T1, GEO, AX, uV, cache); mark('t6');
  const J = { pure, uV, axes: { eq: AX.eq, L: AX.L, ecl: AX.ecl }, cancel, angle, scan, planets, other, resonance, paths, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352h-venusbal.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export async function main() {
  const OUT = process.env.W352H_OUT ? (path.isAbsolute(process.env.W352H_OUT) ? process.env.W352H_OUT : path.join(ROOT, process.env.W352H_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便h venusbal(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352h-venusbal.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R445', provisional: true, provMark: PV.MARK, provKeys: L.DECL.provKeys.slice().sort(),
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, pathDecl: PATHS, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便h', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'venusbal', engine: 'Node(html を読まない —— 純関数の lib・第352便b〜e・第351便c・第351便e・第348便h の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

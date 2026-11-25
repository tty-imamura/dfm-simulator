// 第352便y(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R462):
//   **背景軸引きずりの大きさの窓の器 —— 表 1 条件の一覧(下限・上限・固定の点を ω_G の倍・″/年・一周の年数に直す —— 背景の向き × 源の半径 × 基準軸の列)・
//   表 2 窓(前提の組ごとに、全部を同時に満たす範囲と食い違う組)・表 3 重力の側の列の入力の感度(仮の値 —— 印つき)・表 4 離心率のある軌道での (M) の歪みの平均(仮の値との比 —— 印つき)・零試験 13**
//   (段 bgwindow-352y —— 正本 tests/out/bgwindow-352y.json・lib tests/lib-w352y-bgwindow.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352y-bgwindow.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 背景の大きさを 1 つの値としては書かない(条件の一覧と窓)。重力の側の列を DFM の結果と書かない。仮の値を使う行は合否にしない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Y from './lib-w352y-bgwindow.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as U from './lib-w352u-tidaldrag.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352y-bgwindow-1';
export const OUT_MAIN = 'tests/out/bgwindow-352y.json';
export const TARGET = 'tests/lib-w352y-bgwindow.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(Y.DECL.provKeys.slice());
export const NOT_CLAIM = Object.freeze([
  '条件の一覧と窓 —— 背景の大きさを 1 つの値としては書かない。窓が開く・閉じるは、この前提の組・この読みでは、の数',
  '条件はどれも読み((i) 年齢の内に 1 周・(ii) 散らばりが寄る・(iii) 係数の差で作る・(iv) 傾きを保つ・(v) 残りの上限・(vi) 金星の条件)—— どれも採否の判定ではない',
  '重力の側の列(第352便u の (T-g))は比べる列 —— DFM の結果ではない。残り(仮の値 − 重力の列)は仮・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  '背景の向き (N+)・(G−)・基準軸の L・eq・(S) の源の半径の規則・観測はどれにも寄せていない(両方の列を同じ重さで)',
  '上下の運動の揺れの周期は仮の値・未照合',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13((i) 第352便e の invertBg・(ii) 第352便w の fRingMin・(iii) 第352便l の要る係数の差・(iv) 第352便w の f の上限・(v) 第352便u の残り・(vi) 金星の条件と k・共鳴の帯・背景の単位・離心率 0 の歪みが第352便u と同じ・重力の列を振らなければ第352便u と同じ・窓の口・最後の桁・拒否)',
  t1: '条件の一覧 18 行: (i) 1・(ii) f_輪 3・(iii) Δc 3・(iv) f 3・(v) 天体 3・(vi) k 3・固定の点 2 —— 背景の向き 2 × 源の半径 2 × 基準軸 2 の列・u・″/年・一周の年数',
  t2: '窓: 背景の向き 2 × 源の半径 2 × 基準軸 2 × f 3 × 公転面の比率の置き方 2(f_輪 = f・f_輪 = 1)—— 下限と上限と食い違う組・(iii) Δc 1 を足したとき・倍率 1・共鳴の帯・金星の条件の点の位置と k の窓',
  t3: '重力の側の列の入力の感度: 地球・火星・金星 —— J2・慣性モーメントの係数(最後の桁 ± 1)・傾き・月の道(± 0.01°)—— 残りの動きと 0 との区別(仮の値の幅も)',
  t4: '離心率のある軌道の (M) の歪みの平均: 金星・地球・火星・水星 × e 5 × 近点の向き 2 —— 平均 ÷ 位相ごと・(M) ÷ (S)・e のべき・自分の e での (T-a)(T-b) の率 ÷ 仮の値' });

const RD = Object.freeze({ cols: Object.freeze(['Np|0|L', 'Np|0|eq', 'Np|1|L', 'Np|1|eq', 'Gm|0|L', 'Gm|0|eq', 'Gm|1|L', 'Gm|1|eq']), ringModes: Object.freeze(['same', 'one']), dc3: 1,
  t4Bodies: Object.freeze(['Venus', 'Earth', 'Mars', 'Mercury']), cands: Object.freeze([['Ta', 'g2m'], ['Ta', 'g2p'], ['Tb', 'nat'], ['Tb', 'flip']]) });
export const ROWDECL = RD;
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const colOf = (c) => { const [dir, t, axis] = c.split('|'); return { dir, tSrc: Number(t), axis }; };
const num = (u) => (u === Infinity ? 'inf' : u);

/* ───────── 表 1: 条件の一覧 ───────── */
export function condRows(T1, GEO, cache) {
  const rows = [], res = {};
  for (const id of Y.DECL.resBodies) res[id] = Y.residualOf(T1, GEO, id, cache);
  const same = (o) => Object.fromEntries(RD.cols.map((c) => [c, num(o.u)]));
  const r1 = Y.condSunTurn({ f: 0 });
  rows.push({ id: 'i', kind: 'lower', what: '太陽の自転軸が年齢の内に 1 周以上歳差する(k₂ 1)', from: '第352便e invertBg', vary: 'なし', u: same(r1) });
  for (const f of Y.DECL.fs) rows.push({ id: 'ii|' + f, kind: 'lower', what: '公転面の散らばり 30° → 7° が年齢の内に寄る(f_輪 ' + f + ')', from: '第352便w fRingMin', vary: 'なし', u: same(Y.condRing({ fRing: f })) });
  for (const dc of Y.DECL.dcs) rows.push({ id: 'iii|' + dc, kind: 'lower', what: '係数の差 Δc ' + dc + ' で太陽の傾きを年齢の内に作る(経路 ② だけ)', from: '第352便l dphiFor', vary: '背景の向き・基準軸',
    u: Object.fromEntries(RD.cols.map((c) => { const q = colOf(c); return [c, Y.condSunTilt(T1, GEO, { dir: q.dir, axis: q.axis, dc }, cache).u]; })) });
  for (const f of Y.DECL.fs) rows.push({ id: 'iv|' + f, kind: 'upper', what: '地球のいまの傾き(合成との角)を年齢の間 10% 以内に保つ(f ' + f + ')', from: '第352便w fKeep・stateW', vary: '背景の向き・源の半径・基準軸',
    u: Object.fromEntries(RD.cols.map((c) => [c, num(Y.condKeep(T1, GEO, { ...colOf(c), f }, cache).u)])) });
  for (const id of Y.DECL.resBodies) rows.push(PV.tagProv({ id: 'v|' + id, kind: 'upper', what: '歳差の率の残り(' + ({ Earth: '地球', Mars: '火星', Venus: '金星' })[id] + ')の大きさを一様な背景 × 単位の応答の上限と読む(k₂ 1・c 1)', from: '第352便u (T-g)・第352便w uOf', vary: 'なし',
    resAs: res[id].res, u: same(Y.condResid({ resAs: Math.abs(res[id].res), f: 0 })) }, [res[id].provKeys[0]]));
  for (const k of Y.DECL.ks) rows.push({ id: 'vi|' + k, kind: 'point', what: '金星の条件(大きさが同じ)× k ' + (k >= 1e4 ? k.toExponential(2) : String(k)), from: '第352便o uVenusO', vary: '源の半径',
    u: Object.fromEntries(RD.cols.map((c) => [c, Y.condVenus(T1, GEO, { tSrc: colOf(c).tSrc, k }, cache).u])) });
  rows.push({ id: 'fix|u1', kind: 'point', what: '銀河の公転の角速度そのもの', from: '—', vary: 'なし', u: same({ u: 1 }) });
  const band = Y.resonanceBand();
  rows.push(PV.tagProv({ id: 'fix|res', kind: 'band', what: '上下の運動の揺れが共鳴する大きさ(周期 ' + band.Plo + '〜' + band.Phi + ' 年)', from: '第352便b の仮の値(上下の運動の周期)', vary: 'なし', uLo: band.uLo, uHi: band.uHi,
    u: Object.fromEntries(RD.cols.map((c) => [c, band.uLo])) }, ['gal.vertical.period']));
  for (const r of rows) { const v = ['Np|0|L', 'Np|1|L', 'Gm|0|L', 'Gm|1|L'].map((c) => r.u[c]).find((x) => fin(x)); r.units = fin(v) ? Y.unitsOf(v) : null; }   // 左から最初の数の在る列(基準軸 L)
  return { rows, res };
}

/* ───────── 表 2: 窓 ───────── */
export function windowRows(T1, GEO, t1, cache) {
  const rows = [], uV = { 0: Y.condVenus(T1, GEO, { tSrc: 0 }, cache).uV, 1: Y.condVenus(T1, GEO, { tSrc: 1 }, cache).uV }, band = Y.resonanceBand();
  for (const c of RD.cols) {
    const q = colOf(c);
    for (const f of Y.DECL.fs) for (const mode of RD.ringModes) {
      const conds = [{ id: 'i', ...Y.condSunTurn({ f }) }, { id: 'ii', ...Y.condRing({ fRing: mode === 'one' ? 1 : f }) }, { id: 'iv', ...Y.condKeep(T1, GEO, { ...q, f }, cache) }];
      for (const id of Y.DECL.resBodies) conds.push({ id: 'v' + id[0] + id[1], ...Y.condResid({ resAs: Math.abs(t1.res[id].res), f }) });
      const Wd = Y.windowOf(conds), W3 = Y.windowOf(conds.concat([{ id: 'iii', ...Y.condSunTilt(T1, GEO, { dir: q.dir, axis: q.axis, dc: RD.dc3 }, cache) }]));
      rows.push({ col: c, ...q, f, ring: mode, lo: Wd.lo, loBy: Wd.loBy, hi: num(Wd.hi), hiBy: Wd.hiBy, open: Wd.open, blocked: Wd.blocked, conflicts: Wd.conflicts,
        with3: { open: W3.open, lo: W3.lo, loBy: W3.loBy, blocked: W3.blocked }, u1: Y.placeOf(1, Wd), bandLo: Y.placeOf(band.uLo, Wd), bandHi: Y.placeOf(band.uHi, Wd), venusK1: Y.placeOf(uV[q.tSrc], Wd),
        kWin: Wd.open ? [Wd.lo / uV[q.tSrc], num(Wd.hi / uV[q.tSrc])] : null });
    }
  }
  return PV.tagProv({ rows, fcols: fCols(T1, GEO, t1, cache) }, PROV_KEYS.slice());
}
/** 列ごとの f の境: 窓が開く f の上限(f_輪 1 —— (iv) の上限 = (i) の下限)・倍率 1 が窓の内に入る f の上限((iv) の上限 = 1)・f_輪 = f のときの (ii) ÷ (iv)(f に依らない比) */
export function fCols(T1, GEO, t1, cache) {
  const bis = (g) => { let lo = 1e-7, hi = 1; if (!g(lo)) return null; if (g(hi)) return 1; for (let i = 0; i < 60; i++) { const m = Math.sqrt(lo * hi); if (g(m)) lo = m; else hi = m; } return Math.sqrt(lo * hi); };
  return RD.cols.map((c) => {
    const q = colOf(c), keep = (f) => Y.condKeep(T1, GEO, { ...q, f }, cache).u;
    const fOpen = bis((f) => { const lo = Y.condSunTurn({ f }).u; return lo !== null && keep(f) >= lo; }), fU1 = bis((f) => keep(f) >= 1);
    const ratioSame = Y.condRing({ fRing: 1e-3 }).u / keep(1e-3);
    return { col: c, ...q, fOpen, fU1, ratioSame };
  });
}

/* ───────── 表 3: 重力の側の列の入力の感度 ───────── */
export function sensRows(T1, GEO, t1) {
  const rows = [];
  for (const id of Y.DECL.resBodies) {
    const base = Y.gravPert(T1, GEO, id).az, r = t1.res[id], sig = PV.prov(r.provKeys[0]).sigma, steps = [];
    let tot = 0;
    for (const [name, o, step] of Y.pertSteps(T1, GEO, id)) {
      const up = Y.gravPert(T1, GEO, id, o).az - base, dn = Y.gravPert(T1, GEO, id, Object.fromEntries(Object.entries(o).map(([k, v]) => [k, -v]))).az - base, m = Math.max(Math.abs(up), Math.abs(dn));
      tot += m; steps.push({ name, step, dUp: up, dDn: dn, swing: m });
    }
    const margin = Math.abs(r.res) - tot - (fin(sig) ? sig : 0);
    rows.push(PV.tagProv({ id, ref: r.ref, sigma: sig, grav: r.grav, res: r.res, steps, swingSum: tot, margin, distinct: margin > 0 }, r.provKeys.slice()));
  }
  return PV.tagProv({ rows }, rows.flatMap((r) => r.provKeys).sort());
}

/* ───────── 表 4: 離心率のある軌道の (M) の歪みの平均 ───────── */
export function eccRows(T1, GEO) {
  const rows = [];
  for (const id of RD.t4Bodies) for (const pd of Y.DECL.periDeg) {
    const per = Y.DECL.eGrid.map((e) => { const M = Y.eccStrain(T1, GEO, id, 'Sun', { part: 'M', e, periDeg: pd }), S = Y.eccStrain(T1, GEO, id, 'Sun', { part: 'S', e, periDeg: pd });
      const fl = M.eAvg <= Y.DECL.floor * M.ePhaseRms;   // 床の内(e 0)は 0 と書く(打ち消しの残り)
      return { e, mAvgOverPhase: fl ? 0 : M.eAvg / M.ePhaseRms, mOverS: fl ? 0 : M.eAvg / S.eAvg, mAvg: fl ? 0 : M.eAvg, sAvg: S.eAvg, floor: fl }; });
    const pos = per.filter((p) => p.e > 0), slope = U.logSlope(pos.map((p) => p.e), pos.map((p) => p.mAvgOverPhase));
    const eo = Y.DECL.eOwn[id], Mo = Y.eccStrain(T1, GEO, id, 'Sun', { part: 'M', e: eo, periDeg: pd }), So = Y.eccStrain(T1, GEO, id, 'Sun', { part: 'S', e: eo, periDeg: pd });
    const rates = RD.cands.map(([cand, sense]) => { const rM = Y.eccRate(T1, GEO, id, Mo.Eavg, { cand, sense }), rS = Y.eccRate(T1, GEO, id, So.Eavg, { cand, sense });
      return { cand, sense, azM: rM.az, overRefM: rM.overRef, azS: rS.az, overRefS: rS.overRef }; });
    const pk = id === 'Mercury' ? [] : [{ Venus: 'venus.prec.rate', Earth: 'earth.psiA.rate', Mars: 'mars.prec.rate' }[id]];
    const row = { id, periDeg: pd, per, slope, eOwn: eo, coefE2: pos.length ? pos[pos.length - 1].mAvgOverPhase / (pos[pos.length - 1].e ** 2) : null, rates };
    rows.push(pk.length ? PV.tagProv(row, pk) : row);
  }
  return PV.tagProv({ rows }, ['earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']);
}

export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t1: J.t1.rows.length === 18 && J.t1.rows.every((r) => RD.cols.every((c) => c in r.u)),
    t2: J.t2.provisional === true && J.t2.fcols.length === RD.cols.length && J.t2.rows.length === RD.cols.length * Y.DECL.fs.length * RD.ringModes.length && J.t2.rows.filter((r) => r.f === 1).every((r) => r.open === false && r.blocked.includes('i')),
    t3: J.t3.provisional === true && J.t3.rows.length === 3 && J.t3.rows.every((r) => r.steps.length >= 3),
    t4: J.t4.provisional === true && J.t4.rows.length === RD.t4Bodies.length * Y.DECL.periDeg.length && J.t4.rows.every((r) => r.per[0].floor === true && r.per.slice(1).every((p) => p.floor === false)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = Y.pureScenes(T1, GEO), pure = { scenes: PS, gates: Y.pureGates(PS) }; mark('pure');
  const t1 = condRows(T1, GEO, cache); mark('t1');
  const t2 = windowRows(T1, GEO, t1, cache); mark('t2');
  const t3 = sensRows(T1, GEO, t1); mark('t3');
  const t4 = eccRows(T1, GEO); mark('t4');
  const J = { pure, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352y-bgwindow.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352Y_OUT ? (path.isAbsolute(process.env.W352Y_OUT) ? process.env.W352Y_OUT : path.join(ROOT, process.env.W352Y_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便y bgwindow(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: Y.LIB_VERSION, generator: 'tests/exp-w352y-bgwindow.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R462', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: Y.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便y', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bgwindow', engine: 'Node(html を読まない —— 純関数の lib・第352便b・c・d・e・l・o・p・q・u・w の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

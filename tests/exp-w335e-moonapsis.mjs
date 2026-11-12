// 第335便e(原仮定者の補足(2026-11-12)「太陽や惑星の自転は銀河の軸引きずりから供給される —— 供給が無いと減衰するのは想定内。同様に、月の近点移動の周期は太陽無しでは徐々に減衰するが、
//   太陽有りだと安定する」・統括の検証項目 R332): **月の近点と太陽の有無の 4 列の器 —— 太陽 無/有 × 引きずり 無/有(同じ初期状態)の長い窓(20 年・100 年)・強さ 1 倍と拡大した対照(10³・10⁶ 倍)・
//   動径/接線の分解・e の強制の成分と自由の成分・E と L の帳簿・在位の 2 本との照らし・供給の読みとの対応(月の側の数だけ)**(段 moonapsis-335e —— 正本 tests/out/moonapsis-w335e.json・
//   lib tests/lib-w335e-moonapsis.mjs)。**診断だけ** —— エンジン・内蔵の本(地球–月の本を含む)・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、在位の本 🌦️ earthMoonSunInertial3d・🌔 earthMoonOnly3d の宣言の値〔質量・初期の位置と速度・自転・地球の J₂・
//   G・c₀・timeRef・fitRecord の模型の値〕を .find で引いて読む —— 本の JSON は 1 bit も変えない・步は進めない・説明文の欄〔obsCard・descStruct〕は値として読まない)。他の正本は読まない。1 プロセス。
//
// ■ 何をするか
//   B 本の値と写しの規則の照合(🌔 の bodies = 🌦️ の bodies の emOnly の写し)/ D0 太陽なし・太陽ありの引きずりなしの列(近点の通過の角の調和の回帰・接触の要素・交点・恒星月・e の強制と自由)/
//   D1 引きずりありの列(強さ 1・10³・10⁶ × 太陽の有無)と同じ刻みの D0 との差の傾き(e・a・ϖ・交点・傾き・|h|・E・L_z・面内の近点のベクトル)/ P 動径だけ・接線だけ(1・10⁶ 倍)/
//   X 地球の自転軸の感度(+z —— 10⁶ 倍)/ H 刻みの帯(h/2 —— 宣言の部分集合)/ J 判定(宣言の物差し —— 減衰が読めるか・太陽が保つか・線形)/ Y 年ごとの標本 / U 供給の読みとの対応(月の側)
// ■ 言わないこと: 月の近点の安定を引きずりと太陽の供給で出したとは書かない・今のエンジンで既に出ているとは書かない(4 列の表・減衰の時間・駆動との釣り合いの有無)。
//   拡大した対照の値を宣言どおりの値として書かない。在位の地球–月の本は引きずり OFF の基線(この器は本を変えない)。文献の値は本便は一次資料に当たっていない(未照合)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w335e-moonapsis.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🌦️・🌔 の 2 本〔宣言の値を .find で引いて読む〕。
//   roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt・HP.validatePreset は import した tests/lib-w280b-emgrid.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   エンジンは読まない〔core:false —— 步を進めない・写しを作らない〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない〔fitRecord は説明文の欄ではない —— 模型の値を読む〕)
const REGEN_SCOPE = {"presets":["earthMoonOnly3d","earthMoonSunInertial3d"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w335e-moonapsis-1';
export const OUT_MAIN = 'tests/out/moonapsis-w335e.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const TAU = 2 * Math.PI;
export const NOT_CLAIM = Object.freeze(['月の近点の安定を引きずりと太陽の供給で出したとは言わない(4 列の表・減衰の時間・駆動との釣り合いの有無 —— 宣言した型の表)',
  '今のエンジンで既に出ているとは言わない(在位の 🌦️・🌔 は引きずり OFF —— この器はエンジンを走らせない・点の質量 + 地球の J₂ の診断の積分器)',
  '拡大した対照(10³・10⁶ 倍)の値を宣言どおりの値として言わない(1 倍への外挿は 2 点の線形性の判定が真の範囲だけ)',
  '引きずりの型・強さ・窓・比べる量は走行の前に宣言した(結果を見て変えない)', '太陽なしの列は太陽の摂動を除いた対照 —— 近点の率が変わることと、散逸で徐々に減ることを分ける',
  '供給の帳簿は第335便b の持ち物 —— この器は月の側の数(減衰の時間・駆動の周期・釣り合いの条件)だけを出す', '文献の値は本便は一次資料に当たっていない(未照合)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 時間の単位(本の 10⁴ s): ユリウス年・日 */
  YEAR: 3155.76, DAY: 8.64,
  /** 添字(🌦️: 0 = 太陽〔固定〕・1 = 地球・2 = 月 / 🌔: 0 = 地球・1 = 月) */
  idx: Object.freeze({ withSun: Object.freeze({ iS: 0, iE: 1, iM: 2 }), noSun: Object.freeze({ iS: -1, iE: 0, iM: 1 }) }),
  /** 走行の一覧(h —— 刻みは本の timeRef の pRef ÷ stepsPerOrbit)。D1 は src = 源の組(受け手・源) */
  runs: Object.freeze({
    both: Object.freeze([1, 1e3, 1e6]), parts: Object.freeze(['rad', 'tan']), partLam: Object.freeze([1, 1e6]), axisLam: Object.freeze([1e6]),
  }),
  /** 比べる本の値(本の fitRecord の模型の値を器が読む)と引用(🌔 の観測カードの数 —— 説明文の欄なので値として読まない・文書の引用だけ) */
  quote: Object.freeze({ noSun: '🌔 の記録(docs/SAMPLE_STATUS.md の行): 恒星月 27.4903 日・引きずり OFF の二体と地球の J₂(118 窓では近点の周期は読めない)',
    withSun: '🌦️ の記録(docs/SAMPLE_STATUS.md の行): 長窓 M4 8.8495 年・交点 18.6037 年(根拠の正本は同じ行が指す —— この器は読まない)' }),
  /** 文献の値(本の fitRecord の obs —— 未照合): 近点 8.85 年(JPL SSD の注記)・交点 18.599525 年(Simon 1994 —— 恒星に対する)・恒星月 27.321661 日(Chapront 2002)・平均離心率 0.0549(NASA NSSDC) */
  litNote: '本の fitRecord の obs の欄(近点 8.85 年・恒星月 27.321661 日・平均離心率 0.0549・交点 18.599525 年 —— 出典は本の宣言〔JPL SSD・Chapront 2002・NASA NSSDC・Simon 1994〕・文献の値・未照合)',
  /** 供給の読みの対応(月の側 —— 自転の側は第335便b の帳簿) */
  supplyRows: Object.freeze(['moon', 'spin']),
});

/* ───────── 入力(本の宣言)───────── */
const vecOf = (b, k) => [b[k[0]] || 0, b[k[1]] || 0, b[k[2]] || 0];
function bodiesOf(p, earthAxisMode = 'j2') {
  const iE = p.id === L.DECL.books.withSun ? 1 : 0;
  return p.bodies.map((b, i) => { const j2ax = b.j2 ? L.axisOfTilt(b.j2.axis.tiltDeg, b.j2.axis.azimuthDeg) : null;
    return { m: b.m, x: vecOf(b, ['x', 'y', 'z']), v: vecOf(b, ['vx', 'vy', 'vz']), spin: b.spin || 0, axis: i === iE && earthAxisMode === 'j2' && j2ax ? j2ax : [0, 0, 1], pinned: !!b.pinned,
      j2: b.j2 ? { J2: b.j2.J2, req: b.j2.req, axis: j2ax } : null }; });
}
/** 写しの規則(🌔 の emOnly と同じ —— 地球→月の相対は 🌦️ の差のまま・重心を原点・重心の速度 0) */
export function emOnly(srcBodies) {
  const E = srcBodies[1], M = srcBodies[2], mt = E.m + M.m, fE = E.m / mt, fM = M.m / mt;
  const r = ['x', 'y', 'z'].map((k) => (M[k] || 0) - (E[k] || 0)), w = ['vx', 'vy', 'vz'].map((k) => (M[k] || 0) - (E[k] || 0));
  return { E: { x: r.map((q) => -fM * q), v: w.map((q) => -fM * q) }, M: { x: r.map((q) => fE * q), v: w.map((q) => fE * q) } };
}
export function readBooks(HP) {
  const PS = HP.allPresets().find((p) => p.id === 'earthMoonSunInertial3d'), P0 = HP.allPresets().find((p) => p.id === 'earthMoonOnly3d');   // 名指し(L.DECL.books と同じ id —— 領域の下限が読める形)
  if (!PS || !P0) throw new Error('readBooks: 在位の 🌦️ か 🌔 が無い');
  const ph = PS.physics, rule = emOnly(PS.bodies), b0 = P0.bodies;
  const same = (a, b) => a.length === b.length && a.every((q, k) => q === b[k]);
  const copy = { pos: same(rule.E.x, vecOf(b0[0], ['x', 'y', 'z'])) && same(rule.M.x, vecOf(b0[1], ['x', 'y', 'z'])), vel: same(rule.E.v, vecOf(b0[0], ['vx', 'vy', 'vz'])) && same(rule.M.v, vecOf(b0[1], ['vx', 'vy', 'vz'])),
    mass: b0[0].m === PS.bodies[1].m && b0[1].m === PS.bodies[2].m, spin: b0[0].spin === PS.bodies[1].spin && b0[1].spin === PS.bodies[2].spin, j2: JSON.stringify(b0[0].j2) === JSON.stringify(PS.bodies[1].j2),
    physics: P0.physics.G === ph.G && P0.physics.cLight === ph.cLight };
  copy.ok = Object.values(copy).every(Boolean);
  const fr = {}; for (const t of PS.fitRecord.targets) { const k = /近点/.test(t.q) ? 'aps' : /恒星月/.test(t.q) ? 'sid' : /離心率/.test(t.q) ? 'e' : /交点/.test(t.q) ? 'node' : null; if (k) fr[k] = { obs: t.obs, model: t.model, unit: t.unit }; }
  const dragOff = { withSun: PS.physics.relativeDrag && PS.physics.relativeDrag.enabled === false, noSun: !!(P0.physics.relativeDrag && P0.physics.relativeDrag.enabled === false) };
  return { G: ph.G, c: ph.cLight, pRef: PS.timeRef.pRef, spo: PS.timeRef.stepsPerOrbit, scaleExp: clone(PS.scaleExp), withSun: bodiesOf(PS), noSun: bodiesOf(P0), withSunZ: bodiesOf(PS, 'z'), noSunZ: bodiesOf(P0, 'z'),
    copy, fitRecord: fr, dragOff, pinnedSun: !!PS.bodies[0].pinned, j2: clone(PS.bodies[1].j2), spins: PS.bodies.map((b) => b.spin), masses: PS.bodies.map((b) => b.m) };
}

/* ───────── 走らせる ───────── */
const srcOf = (S) => (S ? [[1, 2], [2, 1], [1, 0], [2, 0]] : [[0, 1], [1, 0]]);
export function runOne(BK, { S, lam, part = 'both', axis = 'j2', half = false, passages = null }) {
  const id = S ? PLAN.idx.withSun : PLAN.idx.noSun, bodies = axis === 'z' ? (S ? BK.withSunZ : BK.noSunZ) : (S ? BK.withSun : BK.noSun);
  const spo = BK.spo * (half ? 2 : 1), h = BK.pRef / spo, Tmax = Math.max(...L.DECL.windowsYr) * PLAN.YEAR, steps = Math.ceil(Tmax / h - 1e-9), every = L.DECL.sampleEvery * (half ? 2 : 1);
  return L.runColumn({ G: BK.G, c: BK.c, bodies, iE: id.iE, iM: id.iM, iS: id.iS, drag: lam ? { lam, part, src: srcOf(S) } : null, h, steps, every, passages: passages === null ? !lam : passages });
}
const perYr = (x) => x * PLAN.YEAR;
/** D0 の列の要約(窓ごと —— 年・日の単位) */
export function baseSummary(R, S) {
  const out = {};
  for (const w of L.DECL.windowsYr) { const s = L.summarize(R, w * PLAN.YEAR, !!S);
    out['w' + w] = { nPass: s.nPass, apsRate: perYr(s.apsRate), apsPeriodYr: TAU / perYr(s.apsRate), apsRateOsc: perYr(s.apsRateOsc), apsPeriodOscYr: TAU / perYr(s.apsRateOsc), apsAmp: s.apsAmp, apsResid: s.apsResid,
      nodeRate: perYr(s.nodeRate), nodePeriodYr: TAU / perYr(s.nodeRate), sidDay: TAU / (s.meanMotion * PLAN.DAY), eMean: s.eMean, eMin: s.eMin, eMax: s.eMax, eForced: s.eForced, eFreeMean: s.eFree.mean, eFreeSlope: perYr(s.eFree.slope) }; }
  return out;
}
/** D1 の列の差(窓ごと —— 年の単位): diffSlopes・自由の成分の傾きの差・近点と交点の周期のずれ */
export function diffSummary(on, off, S, base) {
  const out = {};
  for (const w of L.DECL.windowsYr) { const Tw = w * PLAN.YEAR, d = L.diffSlopes(on, off, Tw), b = base['w' + w];
    const so = L.summarize(on, Tw, !!S, off.pass), sf = L.summarize(off, Tw, !!S);
    const g0 = b.apsRate, dg = perYr(d.dvarpi), n0 = b.nodeRate, dn = perYr(d.dnode);
    out['w' + w] = { bound: on.bound && off.bound, unboundYr: on.unboundT === null ? null : on.unboundT / PLAN.YEAR, de: perYr(d.de), deEnd: d.deEnd, eFreeSlopeDiff: perYr(so.eFree.slope - sf.eFree.slope), eFreeMeanDiff: so.eFree.mean - sf.eFree.mean, eForcedDiff: so.eForced.map((q, k) => q - sf.eForced[k]),
      da: perYr(d.da), dvarpi: dg, dvarpiRateChange: d.dvarpiRateChange * PLAN.YEAR * PLAN.YEAR, dvarpiEnd: d.dvarpiEnd, dnode: dn, dinc: perYr(d.dinc), dh: perYr(d.dh), dE: perYr(d.dE), dLz: perYr(d.dLz),
      dex: perYr(d.dex), dey: perYr(d.dey), apsPeriodShiftYr: TAU / (g0 + dg) - TAU / g0, nodePeriodShiftYr: TAU / (n0 + dn) - TAU / n0, apsRateRel: dg / g0 };
  }
  return out;
}
const keyOf = (q) => ['S' + q.S, q.part || 'both', q.lam, q.axis || 'j2'].join('|');
export function partRuns(BK) {
  const R = { base: {}, diffs: [], band: [], yearly: {}, timing: {} }, t0 = Date.now(), off = {}, offHalf = {};
  for (const S of [0, 1]) { off[S] = runOne(BK, { S, lam: 0 }); R.base['S' + S] = baseSummary(off[S], S); }
  const plan = [];
  for (const S of [0, 1]) { for (const lam of PLAN.runs.both) plan.push({ S, lam, part: 'both', axis: 'j2' });
    for (const part of PLAN.runs.parts) for (const lam of PLAN.runs.partLam) plan.push({ S, lam, part, axis: 'j2' });
    for (const lam of PLAN.runs.axisLam) plan.push({ S, lam, part: 'both', axis: 'z' }); }
  for (const q of plan) {
    const offR = q.axis === 'z' ? off[q.S] : off[q.S], on = runOne(BK, q);   // 地球の軸の感度の列も D0 は同じ(D0 は引きずりなし —— 軸は引きずりにだけ入る)
    const row = Object.assign({ key: keyOf(q) }, q, { amplified: q.lam !== 1 }, diffSummary(on, offR, q.S, R.base['S' + q.S]));
    if (q.part === 'both' && q.axis === 'j2' && (q.lam === 1 || q.lam === 1e6)) R.yearly[keyOf(q)] = L.yearly(on, offR, PLAN.YEAR, Math.max(...L.DECL.windowsYr));
    R.diffs.push(row);
  }
  R.timing.h = (Date.now() - t0) / 1000;
  // 刻みの帯(h/2 —— 宣言の部分集合)
  for (const S of [0, 1]) offHalf[S] = runOne(BK, { S, lam: 0, half: true });
  for (const hs of L.DECL.halfSubset) {
    const S = hs.S, w = 'w' + Math.max(...L.DECL.windowsYr);
    if (hs.lam === 0) { const bh = baseSummary(offHalf[S], S), b = R.base['S' + S];
      R.band.push({ S, lam: 0, apsPeriodYr: Math.abs(bh[w].apsPeriodYr - b[w].apsPeriodYr), apsPeriodOscYr: Math.abs(bh[w].apsPeriodOscYr - b[w].apsPeriodOscYr), nodePeriodYr: Math.abs(bh[w].nodePeriodYr - b[w].nodePeriodYr),
        sidDay: Math.abs(bh[w].sidDay - b[w].sidDay), eMean: Math.abs(bh[w].eMean - b[w].eMean), eFreeSlope: Math.abs(bh[w].eFreeSlope - b[w].eFreeSlope) }); continue; }
    const on = runOne(BK, { S, lam: hs.lam, half: true }), dh = diffSummary(on, offHalf[S], S, baseSummary(offHalf[S], S)), row = R.diffs.find((r) => r.key === keyOf({ S, lam: hs.lam }));
    const bd = {}; for (const ww of L.DECL.windowsYr) { const a = row['w' + ww], b = dh['w' + ww]; bd['w' + ww] = {}; for (const k of ['de', 'eFreeSlopeDiff', 'da', 'dvarpi', 'dnode', 'dinc', 'dh', 'dE', 'dLz', 'dvarpiRateChange']) bd['w' + ww][k] = Math.abs(a[k] - b[k]); }
    R.band.push(Object.assign({ S, lam: hs.lam }, bd));
  }
  R.timing.half = (Date.now() - t0) / 1000 - R.timing.h;
  return R;
}

/* ───────── 判定(宣言の物差し)───────── */
export function judgeAll(R) {
  const J = L.DECL.judge, out = { rows: [], lin: [] }, bandOf = (S, lam, w, k) => { const b = R.band.find((q) => q.S === S && q.lam === lam); return b ? b[w][k] : null; };
  for (const S of [0, 1]) for (const lam of PLAN.runs.both) {
    const row = R.diffs.find((r) => r.key === keyOf({ S, lam })), k = S ? 'eFreeSlopeDiff' : 'de', ws = L.DECL.windowsYr.map((x) => 'w' + x);
    const sl = ws.map((w) => row[w][k]), ratio = sl[0] / sl[ws.length - 1], stable = ratio >= J.windowStable[0] && ratio <= J.windowStable[1];
    for (const w of ws) {
      const slope = row[w][k], eM = R.base['S' + S][w].eFreeMean, Tw = +w.slice(1);
      const band = bandOf(S, lam, w, k) !== null ? bandOf(S, lam, w, k) : bandOf(S, 1, w, k) * lam;   // 10³ 倍は 1 倍の帯 × 10³(宣言)
      const thr = Math.max(J.bandFactor * band, J.floorRel * eM / Tw), readable = Math.abs(slope) > thr, secular = readable && stable && row[w].bound;
      out.rows.push({ S, lam, w, quantity: k, slope, band, thr, readable, windowRatio: ratio, stable, bound: row[w].bound, secular, decay: secular && slope < 0, growth: secular && slope > 0,
        tauYr: secular ? eM / Math.abs(slope) : null, tauBoundYr: secular ? null : eM / Math.max(thr, Math.abs(row.w100[k])) });
    }
  }
  for (const S of [0, 1]) for (const [l1, l2] of [[1, 1e3], [1e3, 1e6]]) for (const k of ['de', 'eFreeSlopeDiff', 'dvarpi', 'dnode']) {
    const a = R.diffs.find((r) => r.key === keyOf({ S, lam: l1 })).w100[k], b = R.diffs.find((r) => r.key === keyOf({ S, lam: l2 })).w100[k], r = (b / a) / (l2 / l1);
    out.lin.push({ S, from: l1, to: l2, k, ratio: r, linear: Number.isFinite(r) && Math.abs(r - 1) <= J.linTol });
  }
  const s0 = out.rows.find((q) => q.S === 0 && q.lam === 1 && q.w === 'w100'), s1 = out.rows.find((q) => q.S === 1 && q.lam === 1 && q.w === 'w100');
  const keepOf = (a, b, tag) => (!a.decay ? '判定できない(' + tag + 'で太陽なしの永年の減衰が窓で読めない)' : !b.bound ? '判定できない(' + tag + 'の太陽ありの列が束縛の外)'
    : (b.decay && Math.abs(b.slope) >= J.keepRatio * Math.abs(a.slope)) ? '太陽ありでも減る(' + tag + ')' : '太陽ありで保たれる(' + tag + ')');
  out.keep = keepOf(s0, s1, '宣言の強さ');
  out.keepAmp = [1e3, 1e6].map((lam) => keepOf(out.rows.find((q) => q.S === 0 && q.lam === lam && q.w === 'w100'), out.rows.find((q) => q.S === 1 && q.lam === lam && q.w === 'w100'), '拡大した対照 ' + (lam === 1e3 ? '10³' : '10⁶') + ' 倍'));
  return out;
}
/** 動径と接線の分解(太陽なし・1 倍 —— 二体の閉じた式 −πb/p・+2πb/p・πb/p〔1 公転あたり〕と照らす。接線の列は自転の座標の回転の分を含む) */
export function partSplit(R, BK) {
  const out = [], mu = BK.G * (BK.noSun[0].m + BK.noSun[1].m), b = 10 * mu / (BK.c * BK.c), o = R.base.S0.w100;
  const rel = (bod) => { const x = bod[1].x.map((q, k) => q - bod[0].x[k]), v = bod[1].v.map((q, k) => q - bod[0].v[k]); return L.elementsOf(x, v, mu); };
  const el = rel(BK.noSun), p = el.a * (1 - el.e * el.e), nOrbYr = PLAN.YEAR / (TAU * Math.sqrt(el.a ** 3 / mu));
  for (const S of [0, 1]) for (const lam of PLAN.runs.partLam) {
    const g = (part) => R.diffs.find((r) => r.key === keyOf({ S, lam, part })).w100;
    const both = g('both'), rad = g('rad'), tan = g('tan');
    out.push({ S, lam, both: { dvarpi: both.dvarpi, de: both.de, dnode: both.dnode }, rad: { dvarpi: rad.dvarpi, de: rad.de, dnode: rad.dnode }, tan: { dvarpi: tan.dvarpi, de: tan.de, dnode: tan.dnode },
      sumRes: (rad.dvarpi + tan.dvarpi - both.dvarpi) / Math.max(Math.abs(both.dvarpi), 1e-300),
      closed: { both: lam * L.closedApsPerOrbit('both', b, p) * nOrbYr, rad: lam * L.closedApsPerOrbit('rad', b, p) * nOrbYr, tan: lam * L.closedApsPerOrbit('tan', b, p) * nOrbYr } });
  }
  return { rows: out, b, p, nOrbYr, eInit: el.e };
}
/** 供給の読みとの対応(月の側の数だけ —— 自転の側は第335便b の帳簿) */
export function partSupply(R, JG) {
  const b1 = R.base.S1.w100, s0 = JG.rows.find((q) => q.S === 0 && q.lam === 1 && q.w === 'w100'), s0a = JG.rows.find((q) => q.S === 0 && q.lam === 1e6 && q.w === 'w100');
  const lin = JG.lin.find((q) => q.S === 0 && q.from === 1 && q.to === 1e3 && q.k === 'de');
  const s0k = JG.rows.find((q) => q.S === 0 && q.lam === 1e3 && q.w === 'w100');
  return { moon: { driver: '太陽の摂動(近点の通過の角の調和 φ = 2(λ☉ − ϖ̄))', drivePeriodYr: b1.apsPeriodYr, forcedAmp: b1.eForced[0], decayRead1: s0.decay, tauYr1: s0.tauYr, tauBoundYr1: s0.tauBoundYr,
    decayRead1e3: s0k.decay, tauBoundYr1e3: s0k.tauBoundYr, decayReadAmp: s0a.decay, tauYrAmp: s0a.tauYr, linear1to1e3: lin.linear,
    balance: s0.decay ? '釣り合いの条件: 強制の振幅 ÷ 自由の成分の減衰の率(宣言の強さ)' : '釣り合いは定義できない(宣言の強さで太陽なしの減衰が窓で読めない —— 下限の時間だけ)' },
    spin: { driver: '銀河の軸引きずり(第335便b の供給の帳簿 —— 本枝は数を出さない)' } };
}
export function gatesOf(J) {
  const D = J.diffs, B = J.base;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    books: J.books.copy.ok === true && J.books.dragOff.withSun === true && J.books.dragOff.noSun === true && J.books.pinnedSun === true,
    runs: D.length === 2 * (PLAN.runs.both.length + PLAN.runs.parts.length * PLAN.runs.partLam.length + PLAN.runs.axisLam.length) && D.every((r) => L.DECL.windowsYr.every((w) => Number.isFinite(r['w' + w].dvarpi) && Number.isFinite(r['w' + w].de))),
    band: J.band.length === L.DECL.halfSubset.length,
    base: [0, 1].every((S) => Number.isFinite(B['S' + S].w100.apsPeriodYr) && B['S' + S].w100.nPass > 1000),
    judge: J.judge.rows.length === 2 * PLAN.runs.both.length * L.DECL.windowsYr.length && J.judge.lin.length === 16,
    yearly: Object.keys(J.yearly).length === 4 && Object.values(J.yearly).every((y) => y.length === Math.max(...L.DECL.windowsYr)),
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { gates: L.pureGates(PS), closed: PS.closed, j2: PS.j2 }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const K = L.dragConsts({ G: BK.G, c: BK.c }), bE = BK.withSun[1], bM = BK.withSun[2], rEM = Math.hypot(...bM.x.map((q, k) => q - bE.x[k])), rSE = Math.hypot(...bE.x);
  const consts = { Yk: K.Yk, W: K.W, beta: { earthOnMoon: (bE.m / rEM) / (K.W + bE.m / rEM + BK.withSun[0].m / rSE), moonOnEarth: (bM.m / rEM) / (K.W + bM.m / rEM + BK.withSun[0].m / rSE), sunOnEarth: (BK.withSun[0].m / rSE) / (K.W + BK.withSun[0].m / rSE + bM.m / rEM) },
    rotSpeed: { earthAtMoon: bE.spin * rEM, sunAtEarth: BK.withSun[0].spin * rSE }, h: BK.pRef / BK.spo, steps100: Math.ceil(100 * PLAN.YEAR / (BK.pRef / BK.spo) - 1e-9) };
  const R = partRuns(BK); mark('runs');
  const judge = judgeAll(R), split = partSplit(R, BK), supply = partSupply(R, judge); mark('judge');
  const books = { G: BK.G, c: BK.c, pRef: BK.pRef, spo: BK.spo, copy: BK.copy, fitRecord: BK.fitRecord, dragOff: BK.dragOff, pinnedSun: BK.pinnedSun, j2: BK.j2, spins: BK.spins, masses: BK.masses };
  const compare = { S1: { apsPeriodYr: R.base.S1.w100.apsPeriodYr, bookAps: BK.fitRecord.aps.model, nodePeriodYr: -R.base.S1.w100.nodePeriodYr, bookNode: BK.fitRecord.node.model, sidDay: R.base.S1.w100.sidDay, bookSid: BK.fitRecord.sid.model, eMean: R.base.S1.w100.eMean, bookE: BK.fitRecord.e.model },
    S0: { apsPeriodYr: R.base.S0.w100.apsPeriodYr, sidDay: R.base.S0.w100.sidDay, eMean: R.base.S0.w100.eMean } };
  const J = { pure, books, consts, base: R.base, diffs: R.diffs, band: R.band, yearly: R.yearly, judge, split, supply, compare, timing: Object.assign(tm, { runsH: R.timing.h, runsHalf: R.timing.half }) };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

export async function main() {
  const TARGET = process.env.W335E_TARGET || 'beta/index.html';
  const OUT = process.env.W335E_OUT ? (path.isAbsolute(process.env.W335E_OUT) ? process.env.W335E_OUT : path.join(ROOT, process.env.W335E_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第335便e moonapsis(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w335e-moonapsis.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の補足(2026-11-12)「太陽や惑星の自転は銀河の軸引きずりから供給される —— 供給が無いと減衰するのは想定内。同様に、月の近点移動の周期は太陽無しでは徐々に減衰するが、太陽有りだと安定する」・原仮定者の決断(2026-11-12)自己を運ぶ式(v を分けた形)・統括の検証項目 R332',
    decl: L.DECL, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w335e-moonapsis.mjs', 'tests/lib-w335e-moonapsis.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w330b-dragweight.mjs',
    'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第335便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'moonapsis', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・在位の 🌦️・🌔 の宣言の値を読む(步を進めない)・純関数(lib —— 点の質量 + 地球の J₂ + 多体の並進引きずりの RK4)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

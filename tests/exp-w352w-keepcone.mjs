// 第352便w(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R460):
//   **「初めの角が保たれている」の読みの制約の器 —— 傾きを保つ比率 f の上限と公転面の側の f_輪 の下限(表 1・倍率の走査)・円錐を 1 周する間の観測の傾きの揺れと周期(表 2)・
//   位相ごとの步と平均の步の差(表 3 —— 章動に当たる揺れ・1 公転の後の二次の差・離心率の列)・金星の公転面が回るときの行き先と時間(表 4)・零試験 10**
//   (段 keepcone-352w —— 正本 tests/out/keepcone-352w.json・lib tests/lib-w352w-keepcone.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352w-keepcone.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(地球の歳差の率 —— 正本の最上位に provisional: true と鍵の一覧)。
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 傾きの由来・公転面の由来の答えとは書かない(上限と下限の表)。背景の向き・歳差の向き・基準軸・源の半径のどれも選ばない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352w-keepcone.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w352d-precsense.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352w-keepcone-1';
export const OUT_MAIN = 'tests/out/keepcone-352w.json';
export const TARGET = 'tests/lib-w352w-keepcone.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const AY = L.ASYR, YR = L.YR;
export const PROV_KEYS = Object.freeze(L.DECL.provKeys.slice());
export const NOT_CLAIM = Object.freeze([
  '傾きの由来・公転面の由来の答えではない —— 上限と下限の表(この場・この読み・このノブでは)', '背景の向き (N+) と (G−)・歳差の向き (g2+) と (g2−)・基準軸の L と eq・源の半径の規則と観測はどれにも寄せていない —— 同じ重さの列',
  '観測の傾きは固定の比べる列(リポジトリの geometry の角 —— 合わせない)', '地球の歳差の率から出した背景の大きさの列は仮の値・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  '「初めの角が保たれている」と「乱しても戻る点」はどちらにも寄せない(前者の読みで要る条件の数だけ)', '離心率の格子は宣言のノブ(水星の行だけリポジトリの値 —— 他の天体の離心率は持っていない)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(第352便p の表の数・第352便p の stateOf と同じ状態・角 1° の物差し・f_輪 の下限・円錐の範囲の閉じた形・位相の平均 = spinRot・partRot・localS・誇張した場の一次と二次・Kepler・金星の ψ の格子と finalOf・拒否)',
  t2: '表 1: 11 受け手 × 背景の向き 2 × 基準軸 2 × 源の半径 2 × 大きさ 3 —— f の上限(10%・1°)・f_輪 の下限(30° → 7°・30° → 3°)・比 f_輪 ÷ f・同じ f で両方が成り立つか/倍率の走査(1e-14〜1e6)',
  t3: '表 2: 8 惑星 × 背景の向き 2 × 基準軸 2 × 源の半径 2 × 大きさ 3 × 円錐の軸 2(合成の向き・読み A の局所の (S))—— 観測の傾きの揺れの範囲と周期',
  t4: '表 3: 地球・火星・金星・水星 × 源の半径 2 × 離心率(0・0.1・水星の値)× 背景(なし・(N+) L (uV)・(G−) L (uV)・(N+) L 倍率 1)× f 0・0.5 × (g2±)—— 揺れ・二次の差・年齢の積み',
  t5: '表 4: 金星 × 基準軸 2 × 輪の回る率 ρ 5 × (g2±)(f 0.5・読み α)—— ψ の平均の合成・行き先と時間' });
export const ROWDECL = Object.freeze({ keys: L.DECL.keys, dirs: L.DECL.dirs, axes: L.DECL.axes, tSrcs: L.DECL.tSrcs, mags: L.DECL.mags, crits: L.DECL.crits.map((c) => c.id), spreads: L.DECL.spreads,
  planets: Object.freeze(L.DECL.keys.slice(0, 8)), scanExp: Object.freeze(Array.from({ length: 21 }, (_, i) => i - 14)),
  bgCases: Object.freeze(['none', 'NpL_uV', 'GmL_uV', 'NpL_u1']), phaseF: L.DECL.phaseF, senses: L.DECL.senses });
const RD = ROWDECL;
const tag = (r, isProv) => (isProv ? PV.tagProv(r, PROV_KEYS.slice()) : r);

/* ───────── 表 1: f の上限・f_輪 の下限 ───────── */
export function keepRows(T1, GEO, ctx) {
  const rows = [];
  for (const key of RD.keys) for (const dir of RD.dirs) for (const axis of RD.axes) for (const tSrc of RD.tSrcs) for (const mag of RD.mags) {
    const u = ctx.u[tSrc][mag], st = L.stateW(T1, GEO, key, { dir, axis, u, tSrc }, ctx.cache), r = { key, dir, axis, tSrc, mag, u, thDeg: st.thDeg, oblDeg: st.oblDeg, WAsYr: st.W * AY, WbAsYr: st.Wb * AY, locOverBg: st.locOverBg };
    r.keep = {}; r.ring = {}; r.ratio = {}; r.same = {};
    for (const c of L.DECL.crits) { const k = L.fKeep({ thDeg: st.thDeg, W: st.W, crit: c }); r.keep[c.id] = { fMax: k.fMax, k1Max: k.k1Max, noLimit: k.noLimit }; }
    for (const [a, b] of RD.spreads) { const g = L.fRingMin({ th0Deg: a, th1Deg: b, Wb: st.Wb }), sk = a + '-' + b; r.ring[sk] = { f: g.f, k1: g.k1, uMin: g.uMin };
      for (const c of L.DECL.crits) { const k = r.keep[c.id]; r.ratio[sk + '|' + c.id] = g.f === null || k.noLimit ? null : g.f / k.fMax; r.same[sk + '|' + c.id] = g.f !== null && g.f <= k.fMax; } }
    rows.push(tag(r, mag === 'uP'));
  }
  return rows;
}
/** 倍率の走査(地球・火星・太陽 × 背景の向き × 基準軸 L × 源の半径 2 —— 30° → 7°・10%) */
export function scanRows(T1, GEO, ctx) {
  const rows = [];
  for (const key of ['Earth|Sun', 'Mars|Sun', 'Sun|-']) for (const dir of RD.dirs) for (const tSrc of RD.tSrcs) {
    const pts = RD.scanExp.map((e) => { const st = L.stateW(T1, GEO, key, { dir, axis: 'L', u: 10 ** e, tSrc }, ctx.cache), k = L.fKeep({ thDeg: st.thDeg, W: st.W, crit: L.DECL.crits[0] }), g = L.fRingMin({ th0Deg: 30, th1Deg: 7, Wb: st.Wb });
      return { e, fMax: k.noLimit ? null : k.fMax, fRing: g.f, ratio: g.f === null || k.noLimit ? null : g.f / k.fMax, thDeg: st.thDeg, locOverBg: st.locOverBg }; });
    const ok = pts.filter((p) => p.ratio !== null);
    rows.push({ key, dir, tSrc, pts, eFirstRing: ok.length ? ok[0].e : null, ratioMin: ok.length ? Math.min(...ok.map((p) => p.ratio)) : null, ratioAtTop: ok.length ? ok[ok.length - 1].ratio : null,
      sameAny: pts.some((p) => p.fRing !== null && (p.fMax === null || p.fRing <= p.fMax)) });
  }
  return rows;
}

/* ───────── 表 2: 円錐の傾きの揺れ ───────── */
export function coneRows(T1, GEO, ctx) {
  const rows = [];
  for (const key of RD.planets) for (const dir of RD.dirs) for (const axis of RD.axes) for (const tSrc of RD.tSrcs) for (const mag of RD.mags) {
    const st = L.stateW(T1, GEO, key, { dir, axis, u: ctx.u[tSrc][mag], tSrc }, ctx.cache);
    const r = { key, dir, axis, tSrc, mag, oblDeg: st.oblDeg, om: L.coneRow(st, 'om'), locA: L.coneRow(st, 'locA') };
    rows.push(tag(r, mag === 'uP'));
  }
  return rows;
}

/* ───────── 表 3: 位相ごとの步 ───────── */
export function phaseRows(T1, GEO, ctx) {
  const rows = [];
  for (const id of L.DECL.phaseBodies) for (const tSrc of RD.tSrcs) {
    const es = id === 'Mercury' ? [...L.DECL.eGrid, L.DECL.eMercury] : L.DECL.eGrid.slice();
    let mean0 = null;
    for (const e of es) {
      const ph = L.phaseRot(T1, GEO, id, { tSrc, e });
      if (e === 0) mean0 = ph.mean;
      const dMean = { rel: Math.abs(Math.hypot(...ph.mean) / Math.hypot(...mean0) - 1), angDeg: L.angDeg(ph.mean, mean0) };
      for (const bgc of RD.bgCases) {
        const bg = bgc === 'none' ? [0, 0, 0] : D.bgVec(bgc.slice(0, 2), { u: ctx.u[tSrc][bgc.endsWith('uV') ? 'uV' : 'u1'], axis: ctx.ax.L });
        for (const f of RD.phaseF) for (const sense of RD.senses) {
          const w = L.wobbleOf(ph.phases, { sHat: ph.sHat, T: ph.T, f, sense, bg }), nOrbAge = L.DECL.ageYr * YR / ph.T;
          rows.push({ id, tSrc, e, bg: bgc, f, sense, TYr: ph.T / YR, varRel: w.varRel, ampAs: w.ampAs, m2As: w.m2As, turnAs: w.turnRad * 180 * 3600 / Math.PI, m2OverTurn: w.turnRad > 0 ? w.m2Rad / w.turnRad : null,
            m2AgeDeg: w.m2Rad * nOrbAge * 180 / Math.PI, meanRateAsYr: w.meanRateAsYr, dMeanRel: dMean.rel, dMeanAngDeg: dMean.angDeg, netRad: w.netRad });
        }
      }
    }
  }
  return rows;
}

/* ───────── 表 4: 金星の公転面が回る ───────── */
export function turnRows(T1, GEO, ctx) {
  const out = { grids: [], rows: [] }, Wb = Math.hypot(...D.bgVec('Np', { u: ctx.u[0].uV }));
  for (const axis of RD.axes) {
    const Gd = L.turnGrid(T1, GEO, { axis }, ctx.cache), M = L.turnMean(Gd);
    out.grids.push({ axis, res0: Gd.res[0], resMean: M.resMean, resMin: M.resMin, resMax: M.resMax, vecMeanMag: M.vecMeanMag, vecMeanAngRefDeg: M.angRefDeg, oblNowDeg: L.angDeg(Gd.sHat0, Gd.nHat0), nRefDeg: L.angDeg(Gd.nHat0, Gd.ref) });
    for (const rho of L.DECL.rhos) for (const sense of RD.senses) {
      const r = L.turnStep(Gd, { rho, sense });
      out.rows.push({ axis, rho, sense, f: r.f, tauEnd: r.tauEnd, nStep: r.nStep, oblEndDeg: r.oblEndDeg, oblLastMinDeg: r.oblLastMinDeg, oblLastMaxDeg: r.oblLastMaxDeg, angRefEndDeg: r.angRefEndDeg, angMeanEndDeg: r.angMeanEndDeg, angMeanLastMaxDeg: r.angMeanLastMaxDeg,
        tauSettle: r.tauSettle, settleYr: r.tauSettle === null ? null : r.tauSettle / Wb / YR, endYr: r.tauEnd / Wb / YR });
    }
  }
  out.WbAsYr = Wb * AY;
  return out;
}

export function gatesOf(J) {
  const nK = RD.keys.length * 2 * 2 * 2 * 3, nC = RD.planets.length * 2 * 2 * 2 * 3;
  const nP = L.DECL.phaseBodies.reduce((t, id) => t + 2 * (L.DECL.eGrid.length + (id === 'Mercury' ? 1 : 0)) * RD.bgCases.length * RD.phaseF.length * RD.senses.length, 0);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t2: J.keep.length === nK && J.keep.filter((r) => r.mag === 'uP').every((r) => r.provisional === true) && J.scan.length === 12 && J.keep.every((r) => Object.values(r.keep).every((k) => k.fMax > 0 && k.fMax <= 1)),
    t3: J.cone.length === nC && J.cone.every((r) => r.om.ok && r.locA.ok && r.om.oblMinDeg <= r.oblDeg + 1e-9 && r.oblDeg <= r.om.oblMaxDeg + 1e-9 && r.locA.oblMinDeg <= r.oblDeg + 1e-9 && r.oblDeg <= r.locA.oblMaxDeg + 1e-9),
    t4: J.phase.length === nP && J.phase.every((r) => Number.isFinite(r.ampAs) && r.ampAs >= 0 && Number.isFinite(r.m2As)),
    t5: J.turn.grids.length === 2 && J.turn.rows.length === 2 * L.DECL.rhos.length * 2 && J.turn.rows.every((r) => Number.isFinite(r.oblEndDeg)),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const cache = {}, provRate = Math.abs(PV.provValue(PROV_KEYS[0]));
  const u = Object.fromEntries(RD.tSrcs.map((t) => [t, { uV: L.uOf('uV', T1, GEO, { tSrc: t }, cache), u1: 1, uP: L.uOf('uP', T1, GEO, {}, cache, provRate) }]));
  const ctx = { cache, u, ax: L.P.I.axesOf(T1, GEO) };
  const keep = keepRows(T1, GEO, ctx), scan = scanRows(T1, GEO, ctx); mark('t2');
  const cone = coneRows(T1, GEO, ctx); mark('t3');
  const phase = phaseRows(T1, GEO, ctx); mark('t4');
  const turn = turnRows(T1, GEO, ctx); mark('t5');
  const J = { pure, u, keep, scan, cone, phase, turn, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352w-keepcone.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352W_OUT ? (path.isAbsolute(process.env.W352W_OUT) ? process.env.W352W_OUT : path.join(ROOT, process.env.W352W_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便w keepcone(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352w-keepcone.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R460', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便w', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'keepcone', engine: 'Node(html を読まない —— 純関数の lib・第352便p・o・n・k・i・d・c・b の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

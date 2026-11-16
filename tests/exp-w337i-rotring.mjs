// 第337便i(原仮定者の回答(2026-11-14 —— 第138報の回答)「並進引きずりの結果と思われるので、回転引きずりも検証する。回転引きずりは、源の引きずり半径が影響する。
//   土星の環に影響する計算を求めてから、水星での影響を確認する」・統括の検証項目 R345):
//   **回転引きずり(源の引きずり半径が効く型)の器 —— T1 型の棚卸しと受け手の位置の比(環と惑星 ÷ R_d の読み 4)・T2 土星の環の粒子の一次の率(高さの型 6 × 作用の型 5 × R_d の読み 4 × 速さ 2 =
//   240 組 × 環の点 15)と環の物差しで組を絞る・T3 同じ組(同じ式・同じノブ —— 源を太陽に替えるだけ)の水星・金星・地球・火星の一次の率と物差しの比・並進引きずりの寄与と第337便b の
//   赤道帯の候補との並べ・T4 引きずり半径を振った効き(べき)・代表の時間積分**(段 rotring-337i —— 正本 tests/out/rotring-337i.json・lib tests/lib-w337i-rotring.mjs)。**診断だけ** ——
//   エンジン・内蔵の本・受理器・第337便b までの lib の本文は変えない。枝 b の赤道帯の候補(並進の型)・軸引きずり・供給の式は持たない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337i-rotring.mjs —— 領域の宣言なし)。入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   格子: 高さの型 slice・lor2・lor4・lor8・ball・src × 作用の型 vel・push・focus・damp・dampz × R_d の読み Yk・Req・Robs・Rsrc × 速さ obs・sd(240 組)。強さ λ は単位の値で一次の率を測り、
//     要る λ は環の物差しから読む(一次の率は λ に比例)。環の点: 土星の C・B・カッシーニの間隙・A・F 環の半径 × 赤道面からの高さの振れ 1・10・100 m(離心率 1e-5)。
//   環の物差し(宣言 —— 文献の幅ではない): 1e7 年(若い環の下限 —— 文献の値・未照合)の内に全部の点の傾きが e 分の 1 になる λ(= λ_need)で、
//     公転の角速度のずれ |δΩ/Ω| ≤ 1e-5・その間の |Δ ln a| ≤ 1e-5・離心率の伸び Δ ln e ≤ 1(e 倍まで)。これを満たす組を「土星の環に効く計算」の候補とする。
//   惑星の物差し(第337便b と同じ): 暦表の追加の近点の歳差・交点の歳差の [値 − 幅, 値 + 幅](文献の値・未照合)・周期と離心率の宣言の物差し。比 ≤ 1 が内。
//   対照(同じ表): 回転引きずり OFF(λ = 0)・並進引きずりの K1(実装)・源の自転が運ぶ速度の剛体の場(並進引きずりの回転の分 —— R_d が入らない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import { sigmaOf, settle, recheckTree, LIB_VERSION as R338_VERSION, DECL as R338_DECL } from './lib-w338c-recheck.mjs';   // 第340便h: 3 値の判定は尺度を測った後に書く
import { judge3, at as at340h, LIB_VERSION as THIN_VERSION, DECL as THIN_DECL } from './lib-w340h-thin.mjs';
import * as L from './lib-w337i-rotring.mjs';
import { contribEffect, bandEffect } from './lib-w337b-mercuryband.mjs';
import { stateAt as stateAt333 } from './lib-w333c-mercury3d.mjs';
import * as A337 from './lib-w337a-supply.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337i-rotring-3';
export const AMEND = Object.freeze([
  '第338便c(統括の検証項目 R351 —— 原仮定者の指示(2026-11-15 —— 第139報)): 正本へ書く出力を量ごとの数値の尺度で整える(tests/lib-w338c-recheck.mjs の settleRun —— Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉〔丸めの残り —— 有効数字が 1 桁に満たない〕を 0 と書く・meta.recheck に係数と 0 と書いた葉の数)。式・格子・判定は不変',
  '第340便h(統括の検証項目 R363 —— 原仮定者の指示(2026-11-17 —— 第140報)): ① 傾きを桁を失わない形で(tests/lib-w333c-mercury3d.mjs の anglesOn —— atan2(|k̂ × Ŵ|, k̂·Ŵ)・lib-2)② 惑星の必要な λ での近点の向き atNeed.advance を 3 値に(近点の率 row.apsW が葉ごとの尺度の 4 倍より大きい → 「正」〔進める〕・−4 倍より小さい → 「負」〔戻す〕・その間 → 「未解決」—— tests/lib-w340h-thin.mjs の judge3。旧は真偽で、尺度の内の率の符号で決めていた —— ずらした走行で 2 組が反転した)。式・格子は不変',
]);
export const OUT_MAIN = 'tests/out/rotring-337i.json';
export const TARGET = 'tests/lib-w337i-rotring.mjs';   // html を読まない器の来歴の対象(純関数)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = L.YR;
export const NOT_CLAIM = Object.freeze(['場の型と作用の型は候補(回転引きずりの則ではない)—— 原仮定者の回答を測るための入り口', '一次の率は無摂動の軌道の平均(導出の主張ではない)',
  '環の物差しは宣言の物差し(厚み・若い環の年齢は文献の値・未照合の目安)—— 環が薄い理由を示すものではない', '鉛直へ寄せる場は第334便a の高さ則 T2 を鉛直の向きに割り当てた型(割り当ての向きはノブ)',
  '水星の物差しは暦表の追加の歳差(文献の値・未照合 —— 1σ ではない)', '並進引きずり・軸引きずりの式は持たない(並進は第337便b の lib を呼んだ比べる行だけ)', 's_d R_d は物質の表面の速度ではない(J を表す等価なパラメータ)']);
/** 器の宣言(走らせた格子) */
export const PLAN = Object.freeze({
  grid: Object.freeze({ profiles: L.PROFILES, actions: L.ACTIONS, readings: L.READINGS, speeds: L.SPEEDS }),
  ring: L.DECL.ring, ringJudge: L.DECL.ringJudge, planets: L.DECL.planets,
  controls: Object.freeze(['off', 'k1', 'rigid']),
  /** 第337便b の比べる行(並進引きずりの分解の列と赤道帯の候補の代表 —— 第337便b の正本の代表の組と λ の写し) */
  bandRef: Object.freeze({ spec: Object.freeze({ type: 'vel', speed: 'obs', dir: 'inPlane', H: Object.freeze({ kind: 'angle', mult: 1 }), q: 4, p: 3 }), lambda: 3.8412839868994805e-9,
    src: '第337便b の正本 tests/out/mercuryband-337b.json の代表の組(G_loc の置き換え)vel|obs|inPlane|angle1|q4|p3 の λ(写し)' }),
  transKeys: Object.freeze(['transRadial', 'transTangent', 'rot']),
  /** 代表(T3 の持ち出し・T4・時間積分)—— 環の物差しを満たした組から、高さの型ごとに 1 つ(R_d の読み Yk・速さ obs を優先) */
  repPrefer: Object.freeze({ reading: 'Req', speed: 'obs' }),
  /** 絞った 3 組(主の読み R_eq —— 原仮定者の補足(2026-11-14 —— 第138報の補足 4)で扁平の則を定義の一部に) */
  mainSets: Object.freeze(['slice|focus|Req|obs', 'slice|dampz|Req|obs', 'ball|focus|Req|sd']),
  rdScanProfiles: Object.freeze(['slice', 'lor4', 'ball']),
  integ: L.DECL.integ,
  integRing: Object.freeze({ prof: 'slice', action: 'focus', reading: 'Yk', speed: 'obs', ring: 'satB', zMax: 1, efolds: 0.1 }),
  integPlanet: Object.freeze([Object.freeze({ prof: 'ball', action: 'focus', reading: 'Yk', speed: 'obs', ampRad: 1e-5 }), Object.freeze({ prof: 'ball', action: 'vel', reading: 'Yk', speed: 'obs', ampRad: 1e-5 })]),
});
const keyOf = (s) => [s.prof, s.action, s.reading, s.speed].join('|');

/* ───────── 環の点と点の一覧 ───────── */
function ringPoints(sat) {
  const out = [];
  for (const rk of PLAN.ring.keys) { const R = L.LIT.rings.find((x) => x.key === rk); for (const zMax of PLAN.ring.zMax) out.push({ ring: rk, name: R.name, r: R.r, zMax, sys: L.ringSys(sat, { r: R.r, zMax }) }); }
  return out;
}

/* ───────── T1 棚卸しと位置の比 ───────── */
export function partInventory() {
  const sat = L.sourceOf('saturn'), sun = L.sourceOf('sun');
  const rd = (src) => Object.fromEntries(L.READINGS.map((k) => [k, L.rdOf(src, k)]));
  const RS = rd(sat), RU = rd(sun);
  const rings = L.LIT.rings.map((R) => ({ key: R.key, name: R.name, r: R.r, rOverRd: Object.fromEntries(L.READINGS.map((k) => [k, R.r / RS[k]])), zMainOverRd: Object.fromEntries(L.READINGS.map((k) => [k, PLAN.ring.zMain / RS[k]])) }));
  const planets = PLAN.planets.map((k) => {
    const S = L.planetSys(k), ax = sun.axis; let zMax = 0;
    // 赤道面からの高さの最大(平均近点角の一様な点)
    for (let j = 0; j < 2048; j++) { const x = stAt(S.orb, (j + 0.5) * 2 * Math.PI / 2048); zMax = Math.max(zMax, Math.abs(x[0] * ax[0] + x[1] * ax[1] + x[2] * ax[2])); }
    return { key: k, ja: S.ja, a: S.orb.a, e: S.orb.e, iSunDeg: L.anglesOn(S.orb, ax).i * 180 / Math.PI, aOverRd: Object.fromEntries(L.READINGS.map((q) => [q, S.orb.a / RU[q]])), zMaxOverRd: Object.fromEntries(L.READINGS.map((q) => [q, zMax / RU[q]])), zMax };
  });
  const speeds = { saturn: Object.fromEntries(L.READINGS.map((k) => [k, { obs: sat.s, sd: L.speedOf(sat, 'sd', RS[k]), sdRd: L.speedOf(sat, 'sd', RS[k]) * RS[k] }])),
    sun: Object.fromEntries(L.READINGS.map((k) => [k, { obs: sun.s, sd: L.speedOf(sun, 'sd', RU[k]), sdRd: L.speedOf(sun, 'sd', RU[k]) * RU[k] }])) };
  return { types: L.INVENTORY, rdSaturn: RS, rdSun: RU, rings, planets, speeds, src: { saturn: { m: sat.m, Robs: sat.Robs, s: sat.s, fFlat: sat.fFlat, fObs: sat.fObs }, sun: { m: sun.m, Robs: sun.Robs, s: sun.s, fFlat: sun.fFlat, fObs: sun.fObs } } };
}
const stAt = (orb, M) => stateAt333(orb, M).x;

/* ───────── T2 土星の環 ───────── */
export function partRing() {
  const sat = L.sourceOf('saturn'), P = ringPoints(sat), ptsCache = new Map();
  const ptsFor = (p, reading) => { const k = p.ring + '|' + p.zMax + '|' + reading; if (!ptsCache.has(k)) ptsCache.set(k, L.pointsOf(p.sys, L.rdOf(sat, reading))); return ptsCache.get(k); };
  const sets = [];
  for (const prof of L.PROFILES) for (const action of L.ACTIONS) for (const reading of L.READINGS) for (const speed of L.SPEEDS) {
    const spec = { prof, action, reading, speed, lambda: 1 }, eff = L.effectOfSpec(sat, spec);
    const rows = P.map((p) => Object.assign({ ring: p.ring, zMax: p.zMax }, L.ringRow(p.sys, eff, ptsFor(p, reading))));
    const J = L.ringJudge(rows);
    sets.push({ key: keyOf(spec), spec: { prof, action, reading, speed }, Rd: eff.meta.Rd, sp: eff.meta.sp, rows, judge: J });
  }
  const controls = PLAN.controls.map((c) => { const rows = P.map((p) => Object.assign({ ring: p.ring, zMax: p.zMax }, L.ringRow(p.sys, L.controlEffect(p.sys, sat, c, 1), ptsFor(p, 'Yk')))); return { key: c, rows, judge: L.ringJudge(rows) }; });
  const pass = sets.filter((s) => s.judge.thin && s.judge.pass).map((s) => s.key);
  const thinOnly = sets.filter((s) => s.judge.thin && !s.judge.pass).map((s) => s.key);
  const count = (f) => sets.filter(f).length;
  const byAction = Object.fromEntries(L.ACTIONS.map((a) => [a, { n: count((s) => s.spec.action === a), thin: count((s) => s.spec.action === a && s.judge.thin), pass: count((s) => s.spec.action === a && s.judge.thin && s.judge.pass),
    prograde: count((s) => s.spec.action === a && s.judge.thin && s.judge.prograde) }]));
  return { points: P.map((p) => ({ ring: p.ring, name: p.name, r: p.r, zMax: p.zMax, iRad: p.sys.iRad })), sets, controls, pass, thinOnly, byAction };
}

/* ───────── T3 惑星(同じ組 —— 源を太陽に替えるだけ)───────── */
const ptsPlanetCache = new Map();
function planetPts(sys, H0) { const k = sys.key + '|' + H0; if (!ptsPlanetCache.has(k)) ptsPlanetCache.set(k, L.pointsOf(sys, H0)); return ptsPlanetCache.get(k); }
/** 惑星の尺度の内に留まる |λ| の上限(尺度の比は |λ| に比例 —— 単位の λ の尺度の比の最大で割る) */
function lambdaWindow(sys, unitRow) {
  const r = L.planetScaleRatios(sys, unitRow), m = Math.max(...Object.values(r));
  return m > 0 ? 1 / m : null;
}
export function partPlanets(ring) {
  const sun = L.sourceOf('sun'), out = [];
  const merc = L.planetSys('merc'), q1 = L.q1cyOf(merc);
  for (const s of ring.sets) {
    const eff = L.effectOfSpec(sun, { ...s.spec, lambda: 1 }), Rd = eff.meta.Rd;
    const keys = s.judge.thin && s.judge.pass ? PLAN.planets : ['merc'];
    const per = {};
    for (const pk of keys) {
      const sys = pk === 'merc' ? merc : L.planetSys(pk), u = L.planetRow(sys, eff, planetPts(sys, Rd), Rd);
      const rec = { unit: u };
      if (s.judge.thin) { const lam = s.judge.lambdaNeed, r = L.scalePlanetRow(u, lam), lw = lambdaWindow(sys, u);
        rec.atNeed = { row: r, ratios: L.planetRatios(sys, r), scaleRatios: L.planetScaleRatios(sys, r), q1Ratio: r.apsW / L.q1cyOf(sys), advance: null, lambdaMax: lw, window: lw === null ? null : lw / Math.abs(lam) };
        rec.atNeed.inside = Object.values(rec.atNeed.ratios).every((x) => x <= 1); rec.atNeed.insideScale = Object.values(rec.atNeed.scaleRatios).every((x) => x <= 1); }
      per[pk] = rec;
    }
    out.push({ key: s.key, spec: s.spec, RdSun: Rd, spSun: eff.meta.sp, per });
  }
  // 対照(太陽 —— off・k1・rigid の単位の λ)と並進引きずりの分解の比べる行(第337便b の lib)・赤道帯の候補の代表
  const ctrl = PLAN.controls.map((c) => ({ key: c, row: L.planetRow(merc, L.controlEffect(merc, sun, c, 1), planetPts(merc, L.rdOf(sun, 'Yk')), L.rdOf(sun, 'Yk')) }));
  const trans = PLAN.transKeys.map((k) => ({ key: k, row: L.planetRow(merc, contribEffect(merc, k), planetPts(merc, null), L.rdOf(sun, 'Yk')) }));
  const bandB = L.planetRow(merc, bandEffect(merc, { ...PLAN.bandRef.spec, lambda: PLAN.bandRef.lambda }), planetPts(merc, null), L.rdOf(sun, 'Yk'));
  const base = Object.fromEntries(PLAN.planets.map((k) => [k, L.baseRatios(k === 'merc' ? merc : L.planetSys(k))]));
  // 絞り: 環の物差しを満たし、同じ λ で 4 惑星とも候補の寄与が尺度の内の組
  const narrowed = out.filter((s) => PLAN.planets.every((k) => s.per[k] && s.per[k].atNeed && s.per[k].atNeed.insideScale)).map((s) => s.key);
  const mercIn = out.filter((s) => s.per.merc.atNeed && s.per.merc.atNeed.inside && ring.sets.find((q) => q.key === s.key).judge.pass).map((s) => s.key);
  return { q1cy: q1, base, sets: out, controls: ctrl, trans, bandB, narrowed, mercIn };
}

/* ───────── 代表と T4 引きずり半径の効き ───────── */
export function representatives(ring, planets) {
  const pass = ring.sets.filter((s) => planets.narrowed.includes(s.key)), out = [];
  for (const prof of L.PROFILES) for (const action of L.ACTIONS) {
    const c = pass.filter((s) => s.spec.prof === prof && s.spec.action === action); if (!c.length) continue;
    const pick = c.find((s) => s.spec.reading === PLAN.repPrefer.reading && s.spec.speed === PLAN.repPrefer.speed) || c.find((s) => s.spec.reading === PLAN.repPrefer.reading) || c[0];
    out.push(pick.key);
  }
  return out;
}
export function partRdScan(ring) {
  const sat = L.sourceOf('saturn'), sun = L.sourceOf('sun'), P = ringPoints(sat), merc = L.planetSys('merc'), rows = [];
  const actions = [...new Set(ring.sets.filter((s) => s.judge.thin && s.judge.pass).map((s) => s.spec.action))];
  for (const prof of PLAN.rdScanProfiles) for (const action of actions) for (const speed of L.SPEEDS) {
    const scan = L.DECL.rdScan.map((k) => {
      const kScale = Math.pow(10, k), spec = { prof, action, reading: L.DECL.mainReading, speed, lambda: 1, kScale }, effS = L.effectOfSpec(sat, spec), RdS = effS.meta.Rd;
      const rr = P.map((p) => L.ringRow(p.sys, effS, L.pointsOf(p.sys, RdS))), J = L.ringJudge(rr);
      const effU = L.effectOfSpec(sun, spec), RdU = effU.meta.Rd, u = L.planetRow(merc, effU, L.pointsOf(merc, RdU), RdU);
      const at = J.thin ? L.scalePlanetRow(u, J.lambdaNeed) : null;
      return { k, RdSat: RdS, RdSun: RdU, thin: J.thin, pass: J.thin ? J.pass : false, lambdaNeed: J.lambdaNeed, mercVarpi: at ? at.ecl.dvarpi : null, mercNode: at ? at.ecl.dnode : null, mercRatios: at ? L.planetRatios(merc, at) : null,
        window: J.thin && lambdaWindow(merc, u) !== null ? lambdaWindow(merc, u) / Math.abs(J.lambdaNeed) : null, mercScale: at ? L.planetScaleRatios(merc, at) : null };
    });
    const slope = (f) => { const ok = scan.filter((q) => fin(f(q)) && f(q) !== 0); if (ok.length < 2) return null; const a = ok[0], b = ok[ok.length - 1]; return Math.log10(Math.abs(f(b)) / Math.abs(f(a))) / (b.k - a.k); };
    rows.push({ prof, action, speed, scan, slopeLambda: slope((q) => q.lambdaNeed), slopeMercVarpi: slope((q) => q.mercVarpi), slopeWindow: slope((q) => q.window),
      insideK: scan.filter((q) => q.pass && q.mercScale && Object.values(q.mercScale).every((x) => x <= 1)).map((q) => q.k) });
  }
  return rows;
}

/* ───────── 代表の時間積分 ───────── */
export function partInteg() {
  const sat = L.sourceOf('saturn'), sun = L.sourceOf('sun'), out = { ring: null, planet: [] };
  { const c = PLAN.integRing, R = L.LIT.rings.find((x) => x.key === c.ring), sys = L.ringSys(sat, { r: R.r, zMax: c.zMax }), Rd = L.rdOf(sat, c.reading);
    const u = L.ringRow(sys, L.effectOfSpec(sat, { ...c, lambda: 1 }), L.pointsOf(sys, Rd)), T = PLAN.integ.nOrb * L.periodOf(sys.orb), lam = -c.efolds / (u.dlnI * T);
    const first = { dlnI: u.dlnI * lam, apsW: u.apsW * lam, dlnA: u.dlnA * lam };
    const runs = PLAN.integ.steps.map((n) => Object.assign({ steps: n }, L.integrate(sys, L.effectOfSpec(sat, { ...c, lambda: lam }), { nOrb: PLAN.integ.nOrb, steps: n })));
    out.ring = { spec: c, lambda: lam, first, runs, relDiff: Math.abs(runs[1].dlnI / first.dlnI - 1), stepSpread: Math.abs(runs[0].dlnI / runs[1].dlnI - 1) }; }
  const merc = L.planetSys('merc');
  for (const c of PLAN.integPlanet) {
    const Rd = L.rdOf(sun, c.reading), u = L.ringRow(Object.assign({}, merc, { iRad: L.anglesOn(merc.orb, sun.axis).i }), L.effectOfSpec(sun, { ...c, lambda: 1 }), L.pointsOf(merc, Rd));
    const T = PLAN.integ.nOrb * L.periodOf(merc.orb), big = Math.max(Math.abs(u.apsW), Math.abs(u.dlnI * 0.1)), lam = c.ampRad / (big * T);
    const first = { dlnI: u.dlnI * lam, apsW: u.apsW * lam };
    const runs = PLAN.integ.steps.map((n) => Object.assign({ steps: n }, L.integrate(merc, L.effectOfSpec(sun, { ...c, lambda: lam }), { nOrb: PLAN.integ.nOrb, steps: n })));
    const key = Math.abs(u.apsW) >= Math.abs(u.dlnI * 0.1) ? 'apsW' : 'dlnI';
    out.planet.push({ spec: c, lambda: lam, first, runs, readKey: key, relDiff: Math.abs(runs[1][key] / first[key] - 1), stepSpread: Math.abs(runs[0][key] / runs[1][key] - 1) });
  }
  return out;
}

/* ───────── 補足 4 —— 扁平の則の次数・一様厚みの区間・比べる相手への効きの予想 ───────── */
const specOf = (key) => { const [prof, action, reading, speed] = key.split('|'); return { prof, action, reading, speed }; };
/** 扁平の則の次数 q(R_eq = R_d/(1 − f_flat)^q —— 主 q = 1/3)を振った、絞った 3 組の要る λ と水星の尺度の比の最大 */
export function partOblate() {
  const sat = L.sourceOf('saturn'), sun = L.sourceOf('sun'), P = ringPoints(sat), merc = L.planetSys('merc');
  return PLAN.mainSets.map((key) => ({ key, rows: L.DECL.oblateQs.map((q) => {
    const spec = { ...specOf(key), lambda: 1, oblateQ: q }, eS = L.effectOfSpec(sat, spec), J = L.ringJudge(P.map((p) => L.ringRow(p.sys, eS, L.pointsOf(p.sys, eS.meta.Rd))));
    const eU = L.effectOfSpec(sun, spec), u = L.planetRow(merc, eU, L.pointsOf(merc, eU.meta.Rd), eU.meta.Rd), at = J.thin ? L.scalePlanetRow(u, J.lambdaNeed) : null;
    return { q, RdSat: eS.meta.Rd, RdSun: eU.meta.Rd, satFactor: eS.meta.Rd / L.rdOf(sat, 'Yk'), thin: J.thin, pass: J.thin && J.pass, lambdaNeed: J.lambdaNeed, mercScaleMax: at ? Math.max(...Object.values(L.planetScaleRatios(merc, at))) : null };
  }) }));
}
/** 一様厚みの区間: 源の重力が支配的な範囲の端・環の半径の位置・z に比例する高さの範囲・鉛直の振幅を減らす率の半径の依存(べき) */
export function partUniform() {
  const U = L.DECL.uniform, sat = L.sourceOf('saturn'), sun = L.sourceOf('sun'), d = U.sunDistAU * 1.495978707e11;
  const rings = [L.LIT.ringD, ...L.LIT.rings].filter((r) => U.rings.includes(r.key));
  const edges = { rHalfD: sat.m * d / sun.m, rHalfA: d * Math.sqrt(sat.m / sun.m), surface: sat.Robs, RdMain: L.rdOf(sat, L.DECL.mainReading) };
  const part = L.LIT.receivers[0];
  const ringPos = rings.map((R) => { const D = L.dominance({ src: { m: sat.m, r: R.r }, others: [{ m: sun.m, r: d }], recv: { m: part.m, R: part.R } });
    return { key: R.key, name: R.name, r: R.r, rOverSurface: R.r / sat.Robs, dShare: D.dShare, aShare: D.aShare, inside: R.r > sat.Robs && D.dShare > 0.5 && D.aShare > 0.5 }; });
  const Rd = edges.RdMain, sp = sat.s, rB = rings.find((r) => r.key === 'satB').r;
  const prop = U.laws.map((law) => { const pr = L.propRange((z) => L.heightLawV(law, rB, z, Rd, sp), rB); return { law, zMax: pr.zMax, zMaxOverRd: pr.zMax === null ? null : pr.zMax / Rd }; });
  const cols = [...PLAN.mainSets.map((key) => ({ key, spec: { ...specOf(key), lambda: 1 } })), ...U.laws.map((law) => ({ key: law, spec: { law, reading: L.DECL.mainReading, speed: 'obs', lambda: 1 } }))];
  const rates = cols.map((c) => {
    const pts = rings.map((R) => { const sys = L.ringSys(sat, { r: R.r, zMax: U.zMax }), eff = c.spec.law ? L.heightLawEffect(sat, c.spec) : L.effectOfSpec(sat, c.spec);
      const row = L.ringRow(sys, eff, L.pointsOf(sys, Rd)), P = L.periodOf(sys.orb);
      return { key: R.key, r: R.r, slope: L.verticalRateAt(sat, c.spec, R.r, U.zMax / 2), dlnI: row.dlnI, perOrbit: row.dlnI * P }; });
    const pw = (f) => { const a = pts[0], b = pts[pts.length - 1]; return Math.abs(f(a)) > 0 && Math.abs(f(b)) > 0 ? Math.log(Math.abs(f(b)) / Math.abs(f(a))) / Math.log(b.r / a.r) : null; };
    const flat = (f) => { const v = pts.map((q) => Math.abs(f(q))), m = v.reduce((x, y) => x + y, 0) / v.length; return m > 0 ? Math.max(...v.map((x) => Math.abs(x / m - 1))) : null; };
    const p = pw((q) => q.dlnI);
    return { key: c.key, pts, powSlope: pw((q) => q.slope), powRate: p, powPerOrbit: pw((q) => q.perOrbit), flatRate: flat((q) => q.dlnI), thickM1: p === null ? null : -p, thickM2: p === null ? null : -p / 2 + 1.5 };
  });
  return { edges, ringPos, prop, rates, models: { M1: '乱しの速度の散らばり σ_z が一様・寄せる速さ a H が σ_z と釣り合う(H ∝ 1/a)', M2: '乱しの注入率が一様・σ_z² ∝ 1/a・H ~ σ_z/ν_z(ν_z ∝ r^−3/2 —— H ∝ a^−1/2 r^3/2)' } };
}
/** 比べる相手(源の自転の半分より速く公転する受け手)への効きの予想: 回転引きずり(絞った 3 組・要る λ)の傾きと場の向きの回転率・軸引きずりの 2 つの読み(第337便a の lib) */
export function partAN719(ring) {
  const AX = L.DECL.axial, AU = 1.495978707e11, sun = L.sourceOf('sun'), W0 = A337.W0FromHalf({ m: sun.m, rHalf: AX.rHalfAU * AU, alpha: AX.alpha, rRef: AU });
  return L.LIT.receivers.map((R) => {
    const src = L.sourceOf(R.host), n = Math.sqrt(L.DECL.G * src.m / R.a ** 3), rSync = Math.cbrt(L.DECL.G * src.m / (src.s * src.s));
    const f = A337.fShare(A337.weight337(src.m, R.a, AX.alpha, AU), W0), axStatic = A337.staticRate({ s: src.s, f, alpha: AX.alpha }), axSelf = A337.selfRate({ s: src.s, n, f, alpha: AX.alpha });
    const sys = L.ringSys(src, { r: R.a, zMax: R.a * Math.sin(R.iDeg * Math.PI / 180), e: R.e });
    const sets = PLAN.mainSets.map((key) => { const lam = ring.sets.find((q) => q.key === key).judge.lambdaNeed, spec = { ...specOf(key), lambda: lam }, eff = L.effectOfSpec(src, spec), Rd = eff.meta.Rd;
      const row = L.ringRow(sys, eff, L.pointsOf(sys, Rd)), Uf = (rho) => L.profileUW(spec.prof, rho, 0, Rd, eff.meta.sp, eff.meta.RK1).U;
      const spinField = lam * (Uf(R.a + R.R) - Uf(R.a - R.R)) / (2 * R.R);
      return { key, lambda: lam, Rd, dlnI: row.dlnI, tiltEfoldYr: row.dlnI !== 0 ? 1 / Math.abs(row.dlnI) / L.YR : null, dOmOverOm: row.dOmOverOm, spinField, spinVertical: 0, vsAxialDiff: Math.abs(spinField) / Math.abs(axStatic - axSelf) }; });
    return { key: R.key, name: R.name, host: R.host, a: R.a, n, s: src.s, nOverS: n / src.s, rSync, aOverSync: R.a / rSync, f, axStatic, axSelf, axDiff: axStatic - axSelf, sets };
  });
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nSets = L.PROFILES.length * L.ACTIONS.length * L.READINGS.length * L.SPEEDS.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    inventory: J.inventory.types.length === L.INVENTORY.length && J.inventory.rings.length === L.LIT.rings.length && J.inventory.planets.length === PLAN.planets.length,
    ringComplete: J.ring.sets.length === nSets && J.ring.sets.every((s) => s.rows.length === PLAN.ring.keys.length * PLAN.ring.zMax.length && s.rows.every((q) => fin(q.dlnI) && fin(q.dlnA))),
    controlsZero: J.ring.controls.find((c) => c.key === 'off').rows.every((q) => q.dlnI === 0 && q.dlnA === 0 && q.dOmOverOm === 0),
    controlsNoThin: J.ring.controls.filter((c) => c.key !== 'off').every((c) => c.rows.every((q) => Math.abs(q.dlnI * J.ring.points[0].iRad) <= 1e-6 * Math.max(Math.abs(q.dnode), Math.abs(q.apsW)))),
    planetsComplete: J.planets.sets.length === nSets && J.planets.sets.every((s) => fin(s.per.merc.unit.apsW)),
    rdScan: J.rdScan.every((r) => r.scan.length === L.DECL.rdScan.length),
    integRing: J.integ.ring.relDiff <= 1e-2 && J.integ.ring.stepSpread <= 1e-3,
    integPlanet: J.integ.planet.every((p) => p.relDiff <= 2e-2 && p.stepSpread <= 1e-3),
    oblate: J.oblate.length === PLAN.mainSets.length && J.oblate.every((o) => o.rows.length === L.DECL.oblateQs.length && Math.abs(o.rows[0].satFactor - Math.pow(1 - L.LIT.saturn.f, -1 / 3)) <= 1e-12),
    uniform: J.uniform.rates.length === PLAN.mainSets.length + L.DECL.uniform.laws.length && J.uniform.rates.find((r) => r.key === 'T1').flatRate <= 1e-6,
    an719: J.an719.length === L.LIT.receivers.length && J.an719.every((r) => r.nOverS > 0.5 && r.sets.length === PLAN.mainSets.length),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const inventory = partInventory(); mark('inventory');
  const ring = partRing(); mark('ring');
  const planets = partPlanets(ring); mark('planets');
  const reps = representatives(ring, planets);
  const rdScan = partRdScan(ring); mark('rdScan');
  const integ = partInteg(); mark('integ');
  const oblate = partOblate(); mark('oblate');
  const uniform = partUniform(); mark('uniform');
  const an719 = partAN719(ring); mark('an719');
  const J = { pure, inventory, ring, planets, reps, rdScan, integ, oblate, uniform, an719, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** 第338便c: 正本へ書く形 —— 生の runAll を元のまま 1 回と、Math の関数を ±1〜2 ulp ずらして 2 回走らせ、葉ごとの尺度 σ の 4 倍の内の葉(丸めの残り —— 有効数字が 1 桁に満たない)を 0 と書く(壁時計は元のままの走行の値)。戻り値 { J, recheck } */
export function runSettled() {
  let tm = null;
  const run = () => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; };
  // 第340便h: 尺度を測る → 3 値の判定を書く → 0 と書く(settleRun と同じ meta の形に judge340h の数を足す)
  const { base, sigma, unstable } = sigmaOf(run), j3 = judge340h(base, sigma), S = settle(base, sigma);
  const { gates, ok, ...rest } = S.value;
  return { J: Object.assign(rest, { timing: tm, gates, ok }), recheck: { version: R338_VERSION, decl: R338_DECL, zeroed: S.zeroed, kept: S.kept, zeroPathsHead: S.zeroPaths, unstable: unstable.length, unstableHead: unstable.slice(0, 20), judge3: j3 } };
}
/** 第340便h: 3 値の判定(尺度を測った後 —— base を書き換える)。惑星の必要な λ での近点の向き atNeed.advance = judge3(row.apsW, σ(row.apsW))。戻り値は数え */
export function judge340h(base, sigma) {
  const cnt = { version: THIN_VERSION, factor: THIN_DECL.JUDGE_FACTOR, advance: { [THIN_DECL.POS]: 0, [THIN_DECL.NEG]: 0, [THIN_DECL.UNRESOLVED]: 0 } };
  (base.planets && base.planets.sets || []).forEach((s, si) => { for (const pk of Object.keys(s.per)) { const a = s.per[pk].atNeed; if (!a) continue;
    a.advance = judge3(a.row.apsW, at340h(sigma, ['planets', 'sets', si, 'per', pk, 'atNeed', 'row', 'apsW'])); cnt.advance[a.advance]++; } });
  return cnt;
}
/** 第340便h: QA の作り直しの照合(recheckRun と同じ戻りの形 —— 尺度を測り、3 値の判定を書いてから正本と比べる) */
export function recheck340h(canon, parts) {
  const { base, sigma, unstable } = sigmaOf(() => { const q = runAll(); delete q.timing; return q; });
  judge340h(base, sigma);
  const diffs = {}; let nLeaves = 0, nZero = 0;
  for (const k of parts) { diffs[k] = recheckTree(base[k], sigma[k], canon[k]); nLeaves += diffs[k].nLeaves; nZero += diffs[k].nZero; }
  return { diffs, unstable, nLeaves, nZero, base, sigma };
}

/* ───────── 走らせる ───────── */
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w337i-rotring.mjs', 'tests/lib-w337i-rotring.mjs', 'tests/lib-w337b-mercuryband.mjs', 'tests/lib-w335c-mercurycombo.mjs', 'tests/lib-w334c-mercurynode.mjs',
  'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w332a-eqband.mjs',
  'tests/lib-w331c-k1scale.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w312a-decay.mjs',
  'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w338c-recheck.mjs', 'tests/lib-w337a-supply.mjs', 'tests/lib-w340h-thin.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337I_OUT ? (path.isAbsolute(process.env.W337I_OUT) ? process.env.W337I_OUT : path.join(ROOT, process.env.W337I_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便i rotring(版 ' + HARNESS_VERSION + ')');
  const { J: R, recheck } = runSettled();
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337i-rotring.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-14 —— 第138報の回答)「並進引きずりの結果と思われるので、回転引きずりも検証する。回転引きずりは、源の引きずり半径が影響する。土星の環に影響する計算を求めてから、水星での影響を確認する」・統括の検証項目 R345',
    decl: L.DECL, lit: L.LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便i', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'rotring', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積と RK4)', notClaim: NOT_CLAIM, recheck });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

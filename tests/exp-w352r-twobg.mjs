// 第352便r(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R455):
//   **背景の向きの項を 2 つ同時に置いた候補(基準軸の向きの項 (N+) + 銀河の回転と逆向きの項 (G−))の器 —— 比 b ÷ a の走査(表 1)・3 つの条件を同時に満たす比の範囲(表 2)・
//   作られる傾きの方位とその後の歳差(表 3)・上下の運動の揺れの窓(表 4 —— 仮の値・印つき)・候補の組のまとめ(表 5)・零試験 12**
//   (段 twobg-352r —— 正本 tests/out/twobg-352r.json・lib tests/lib-w352r-twobg.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352r-twobg.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。仮の値は第352便b の器の数だけ(表 4 —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 背景が 2 つの項から成るとは書かない(候補の走査)。太陽の傾きの由来の答えとは書かない。どの比が正しいとは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as T from './lib-w352r-twobg.mjs';
import * as SL from './lib-w352l-suntilt.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352r-twobg-1';
export const OUT_MAIN = 'tests/out/twobg-352r.json';
export const TARGET = 'tests/lib-w352r-twobg.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = T.YR, AY = T.ASYR, D2R = Math.PI / 180;
export const PROV_KEYS = Object.freeze(['gal.vertical.period', 'gal.vertical.amplitude']);
export const NOT_CLAIM = Object.freeze([
  '背景を 2 つの向きの項の和に置いたのは候補の走査 —— 背景が 2 つの項から成るとは書かない(比 b ÷ a はノブ・既定の値は置かない)',
  '同時の条件(太陽の円錐 10° 以内・金星の残り 10% 以内・地球の合成が基準軸から 10° 以内)は走査の物差し —— 採否の判定ではない',
  '背景の向き (N+) と (G−)・歳差の向き (g2+) と (g2−)・基準軸の L と eq・(S) の源の半径の規則と観測はどれにも寄せていない(両方の列を同じ重さで)',
  '輪(公転面の法線)は背景だけを受ける置き方(第352便l の候補 (b) と同じ)—— 輪の局所の項は入れていない',
  '作られる方位のあとの歳差は、合成の軸 ≈ 基準軸の読みの率(合成の大きさ × 係数)—— 輪も動く列は步の標本で別に数えた',
  '上下の振動の周期と振幅は仮の値・未照合(較正・サンプルの状況・ノブの採否に入れない)。減りの率 γ_d と作用の倍はノブ(式の候補)',
  '太陽の傾きの由来の答えとは書かない。アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 12(比の両端と主の表・統括の数え直し 1 の表・局所の規則の列と partRot・観測の半径・金星の条件・太陽の円錐・開き始めの率と步・年数の往復・作られる方位と步・進む角・揺れの式と步・拒否)',
  t1: '比 b ÷ a 8 つ × 基準軸 2(L・eq)× 大きさ 3(金星の条件 規則の半径・観測の半径・倍率 1)—— 太陽の円錐・金星の残り・地球と火星の合成と基準軸の角・背景と基準軸の角・開き始めの率・係数の差 1%・0.1% で γ 開く年数(経路 ②・①)・年齢の内に要る係数の差',
  t2: '比の対数の格子(1e-5〜1e3・1 桁 200 点)で 3 つの条件を同時に満たす範囲 × 基準軸 2 × 源の半径 2 —— 範囲の両端・経路 ② で届く下端(2θ ≥ γ)・その範囲で年齢の内に要る係数の差',
  t3: '作られる方位: 基準軸 2 × 比 2(範囲の中・∞)× 経路 2 × 係数の組 4 × 歳差の向き 2 —— 開き始めの方位・いまの方位まで進む角と時間(大きさ 3)・步の標本でいまの方位に届くか',
  t4: '上下の運動の揺れの窓(仮の値): 核 2 × 振幅 2 × 周期 2 —— 作用 A・ω_z・共鳴の倍率・5〜7° に届く減りの率の上限・共鳴の上で育つ年数・窓の幅(γ_d 0 と上限の半分)',
  t5: 'まとめ: 背景の向きの項 1 つ/2 つ × 傾きを作る作用 (b)/(d) —— 太陽の円錐・金星の残り・地球の合成・傾きを作れるか・要るノブの数・作られる方位の側' });

/* ───────── 小さな道具 ───────── */
const { nrm } = T.vec;
const RD = Object.freeze({ rhos: T.DECL.rhos, axes: T.DECL.axes, mags: Object.freeze(['uVrule', 'uVobs', 'u1']), deltas: T.DECL.deltas,
  pairs: Object.freeze([['spinSlow', 1, 0.99], ['spinFast', 0.99, 1], ['ringFixed', 0, 1], ['spinFixed', 1, 0]]), nSample: 400, nearDeg: 2, gMinDeg: 0.5,
  zs: Object.freeze(['lo', 'hi']), tzs: Object.freeze(['lo', 'hi']) });
export const ROWDECL = RD;
const radOfMag = (m) => (m === 'uVobs' ? 'obs' : 'rule');
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const ageYr = T.DECL.ageYr;
const tgt = (ax) => T.DECL.tiltDeg[ax];
const isoRho = (r) => (r === Infinity ? 'inf' : r);

/* ───────── 表 1: 比の走査 ───────── */
function aOf(T1, GEO, m, cache) { return m === 'u1' ? 1 : T.uVenusRad(T1, GEO, { rad: radOfMag(m) }, cache); }
export function rhoRows(T1, GEO, ax, cache) {
  const rows = [];
  for (const axn of RD.axes) for (const m of RD.mags) {
    const a0 = aOf(T1, GEO, m, cache), rad = radOfMag(m);
    for (const rho of RD.rhos) {
      const { a, b } = T.abOf(rho, a0), q = { a, b, axis: ax[axn], rad }, sun = T.bodyOf(T1, GEO, 'Sun', q, cache), ven = T.bodyOf(T1, GEO, 'Venus', q, cache);
      const ea = T.bodyOf(T1, GEO, 'Earth', q, cache), ma = T.bodyOf(T1, GEO, 'Mars', q, cache), Om = T.bgTwo(q), om = nrm(Om);
      const off = T.bgTwo({ a: 0, b, axis: ax[axn] }), th = Math.atan2(nrm(T.vec.crs(off, T.vec.unit(ax[axn]))), T.vec.dot(Om, T.vec.unit(ax[axn]))) / D2R;
      const per = {};
      for (const d of RD.deltas) {
        per[d] = { rateAsYr: T.openRate({ X0: ax[axn], Om, delta: d, offOm: off }) * AY, yr2: th > 0 ? T.openYears2({ thDeg: th, om, delta: d, gammaDeg: tgt(axn) }) : null,
          yr1: th > 0 ? T.openYears1({ X0: ax[axn], Om, delta: d, gammaDeg: tgt(axn) }) : null };
      }
      rows.push({ axis: axn, mag: m, rho: isoRho(rho), a, b, bgAsYr: om * AY, thDeg: th, sunConeDeg: sun.coneDeg, venusRes: ven.res, earthRefDeg: ea.refDeg, marsRefDeg: ma.refDeg,
        maxGamma2Deg: Math.min(180, 2 * th), dAge2: th > 0 ? T.deltaForAge({ thDeg: th, om, gammaDeg: tgt(axn) }) : null, per });
    }
  }
  return rows;
}

/* ───────── 表 2: 同時の条件を満たす比の範囲 ───────── */
function condAt(T1, GEO, axv, rad, a0, rho, cache) {
  const { a, b } = T.abOf(rho, a0), q = { a, b, axis: axv, rad };
  const sun = T.bodyOf(T1, GEO, 'Sun', q, cache).coneDeg, ven = T.bodyOf(T1, GEO, 'Venus', q, cache).res, ea = T.bodyOf(T1, GEO, 'Earth', q, cache).refDeg;
  const Om = T.bgTwo(q), off = T.bgTwo({ a: 0, b, axis: axv }), th = Math.atan2(nrm(T.vec.crs(off, T.vec.unit(axv))), T.vec.dot(Om, T.vec.unit(axv))) / D2R;
  const C = T.DECL.conds;
  return { sun, ven, ea, th, om: nrm(Om), ok: sun <= C.sunConeDeg && ven <= C.venusRes && ea <= C.earthRefDeg };
}
function edge(f, lo, hi) { for (let i = 0; i < 60; i++) { const m = Math.sqrt(lo * hi); if (f(m)) lo = m; else hi = m; } return Math.sqrt(lo * hi); }
export function windowRows(T1, GEO, ax, cache) {
  const S = T.DECL.scan, rows = [];
  for (const axn of RD.axes) for (const rad of T.DECL.rads) {
    const a0 = T.uVenusRad(T1, GEO, { rad }, cache), at = (r) => condAt(T1, GEO, ax[axn], rad, a0, r, cache);
    const grid = []; for (let k = 0; k <= (S.hi - S.lo) * S.perDecade; k++) grid.push(Math.pow(10, S.lo + k / S.perDecade));
    const okv = grid.map((r) => at(r).ok), at0 = at(0);
    // 連続した範囲(最初の真の帯)を探す —— 0 で真なら下端は 0
    let i0 = okv.indexOf(true), i1 = -1;
    if (i0 >= 0) { i1 = i0; while (i1 + 1 < okv.length && okv[i1 + 1]) i1++; }
    const nBands = okv.reduce((n, v, k) => n + (v && (k === 0 || !okv[k - 1]) ? 1 : 0), 0);
    const lo = i0 < 0 ? null : (i0 === 0 && at0.ok ? 0 : edge((r) => !at(r).ok, grid[i0 - 1], grid[i0]));
    const hi = i1 < 0 ? null : (i1 === okv.length - 1 ? null : edge((r) => at(r).ok, grid[i1], grid[i1 + 1]));
    // 経路 ② で届く下端: 2θ ≥ γ(θ は比で単調に増える)
    const reach = edge((r) => 2 * at(r).th < tgt(axn), grid[0], grid[grid.length - 1]);
    const inLo = lo === null ? null : Math.max(lo, reach), has = hi !== null && inLo !== null && inLo < hi;
    const cHi = hi === null ? null : at(hi), dAt = (r, m) => { const c = at(r), scale = m === 'u1' ? 1 / a0 : 1; return T.deltaForAge({ thDeg: c.th, om: c.om * scale, gammaDeg: tgt(axn) }); };
    const mid = has ? Math.sqrt(inLo * hi) : null;
    rows.push({ axis: axn, rad, a0, okAtZero: at0.ok, nBands, lo, hi, reachLo: reach, overlap: has, mid,
      sunAtHi: cHi ? cHi.sun : null, venAtHi: cHi ? cHi.ven : null, earthAtHi: cHi ? cHi.ea : null, thAtHi: cHi ? cHi.th : null,
      dAgeAtHi: has ? dAt(hi * (1 - 1e-9), 'self') : null, dAgeAtMid: has ? dAt(mid, 'self') : null, dAgeAtHiU1: has ? dAt(hi * (1 - 1e-9), 'u1') : null,
      venMin: Math.min(...grid.map((r) => at(r).ven).filter(fin)) });
  }
  return rows;
}

/* ───────── 表 3: 作られる方位とその後の歳差 ───────── */
export function azRows(T1, GEO, ax, W, cache) {
  const rows = [];
  for (const axn of RD.axes) {
    const w = W.find((r) => r.axis === axn && r.rad === 'rule'), now = T.nowDAz(GEO, ax[axn]);
    for (const [rhoName, rho] of [['mid', w.mid], ['inf', Infinity]]) {
      if (rho === null) continue;
      const { a, b } = T.abOf(rho, 1), Om1 = T.bgTwo({ a, b, axis: ax[axn] }), om1 = nrm(Om1);
      const scale = { uVrule: T.uVenusRad(T1, GEO, { rad: 'rule' }, cache), uVobs: T.uVenusRad(T1, GEO, { rad: 'obs' }, cache), u1: 1 };
      for (const f of [0, 1]) for (const [pair, rr, rs] of RD.pairs) for (const sense of ['g2m', 'g2p']) {
        const cz = T.createdDAz(GEO, { axis: ax[axn], Om: Om1, f, sense, ringRatio: rr, spinRatio: rs });
        const adv = cz === null ? null : T.advanceDeg(cz, now, sense);
        const tYr = {}; for (const m of RD.mags) tYr[m] = adv === null || rs === 0 ? null : (adv * D2R) / (om1 * scale[m] * rs) / YR;
        // 步の標本(輪も動く —— いまの輪の法線のまわりの方位)
        let n = 0, front = 0, best = null;
        for (let k = 1; k <= RD.nSample; k++) {
          const t = f === 0 ? k * 37 / om1 : k * 0.05 / om1;
          const st = SL.twoAxisStep({ n0: ax[axn], s0: ax[axn], om: Om1, T: t, steps: 1, ring: SL.axisCoef(f, { sense, ratio: rr }), spin: SL.axisCoef(f, { sense, ratio: rs }) });
          if (!(st.gammaDeg >= RD.gMinDeg)) continue;
          const d = T.dAzAround(GEO, st.n, st.s); if (d === null) continue;
          n++; if (Math.abs(d) < 90) front++;
          const dist = Math.abs(RC.dAz(d, now)); if (best === null || dist < best) best = dist;
        }
        rows.push({ axis: axn, rhoName, rho: isoRho(rho), f, pair, ringRatio: rr, spinRatio: rs, sense, createdDAz: cz, nowDAz: now, advDeg: adv, tYr,
          nSamp: n, frontFrac: n ? front / n : null, nearestDeg: best, reachNow: best !== null && best <= RD.nearDeg });
      }
    }
  }
  return rows;
}

/* ───────── 表 4: 上下の運動の揺れの窓(仮の値)───────── */
export function wobRows(T1, GEO, cache) {
  const rs = SL.ringScale(), OG = T.DECL.omegaG, rows = [], uR = T.uVenusRad(T1, GEO, { rad: 'rule' }, cache), uO = T.uVenusRad(T1, GEO, { rad: 'obs' }, cache);
  for (const al of SL.DECL.als) {
    const src = SL.diskSrc(al), sr = SL.recvOf('Sun', al), at = (z) => SL.diskOmAt(src, { al, recv: sr, read: 'C2' })([1, 0, z], SL.V0);
    for (const zk of RD.zs) {
      const Zpc = PV.provValue('gal.vertical.amplitude', zk), up = at(Zpc * SL.DECL.pc / rs.R0), A = Math.hypot(up[0], up[1]) * OG;
      for (const tk of RD.tzs) {
        const Tz = PV.provValue('gal.vertical.period', tk), w = 2 * Math.PI / (Tz * YR), uRes = w / OG, per = {};
        for (const ax of RD.axes) {
          const target = tgt(ax) * D2R, gMax = T.gamMaxFor({ A, target }), hw0 = T.windowHalf({ A, target }), hwH = T.windowHalf({ A, target, gam: gMax / 2 });
          per[ax] = { gMaxPerYr: gMax * YR, growYr: 2 * target / A / YR, growOverAge: 2 * target / A / YR / ageYr, win0: hw0 / w, winHalf: hwH === null ? null : hwH / w,
            radAtUVrule: T.wobbleDamped({ A, Op: uR * OG, w }).max / D2R, radAtUVobs: T.wobbleDamped({ A, Op: uO * OG, w }).max / D2R };
        }
        rows.push({ al, zKey: zk, Zpc, tzKey: tk, TzYr: Tz, AAsYr: A * AY, wAsYr: w * AY, uRes, uResOverUVrule: uRes / uR, uResOverUVobs: uRes / uO, per });
      }
    }
  }
  return PV.tagProv({ rows, keys: PROV_KEYS.slice() }, PROV_KEYS.slice());
}

/* ───────── 表 5: まとめ ───────── */
export function sumRows(R1, W, A3, W4) {
  const rows = [], pick = (axn, rho) => R1.find((r) => r.axis === axn && r.mag === 'uVrule' && r.rho === isoRho(rho));
  const sideOf = (axn, rho, f) => { const xs = A3.filter((r) => r.axis === axn && r.rhoName === rho && r.f === f && r.createdDAz !== null).map((r) => r.createdDAz); return xs.length ? { min: Math.min(...xs), max: Math.max(...xs) } : null; };
  const wMin = Math.min(...W4.rows.map((r) => r.per.L.growOverAge)), dMake = wMin <= 1, uLo = Math.min(...W4.rows.map((r) => r.uRes)), uHi = Math.max(...W4.rows.map((r) => r.uRes));
  for (const axn of RD.axes) {
    const w = W.find((r) => r.axis === axn && r.rad === 'rule'), wo = W.find((r) => r.axis === axn && r.rad === 'obs');
    const r0 = pick(axn, 0), ri = pick(axn, Infinity), rh = w.overlap ? R1.find((r) => r.axis === axn && r.mag === 'uVrule' && r.rho === 0.1) : null;
    for (const act of ['b', 'd']) {
      rows.push({ axis: axn, terms: 1, dir: 'Np', act, sunConeDeg: r0.sunConeDeg, venusRes: r0.venusRes, earthRefDeg: r0.earthRefDeg,
        canMake: act === 'b' ? false : dMake, dAgeRule: null, dAgeObs: null, knobs: act === 'b' ? 2 : 3, side: null });
      rows.push({ axis: axn, terms: 1, dir: 'Gm', act, sunConeDeg: ri.sunConeDeg, venusRes: ri.venusRes, earthRefDeg: ri.earthRefDeg,
        canMake: act === 'b' ? true : dMake, dAgeRule: act === 'b' ? ri.dAge2 : null, dAgeObs: act === 'b' ? R1.find((r) => r.axis === axn && r.mag === 'uVobs' && r.rho === 'inf').dAge2 : null,
        knobs: act === 'b' ? 2 : 3, side: act === 'b' ? sideOf(axn, 'inf', 0) : null });
      rows.push({ axis: axn, terms: 2, dir: 'Np+Gm', act, rhoLo: w.overlap ? Math.max(w.lo, w.reachLo) : null, rhoHi: w.hi, sunConeDeg: w.sunAtHi, venusRes: w.venAtHi, earthRefDeg: w.earthAtHi,
        canMake: act === 'b' ? w.overlap : dMake, dAgeRule: act === 'b' ? w.dAgeAtHi : null, dAgeObs: act === 'b' ? wo.dAgeAtHi : null, knobs: act === 'b' ? 3 : 4, side: act === 'b' ? sideOf(axn, 'mid', 0) : null, ref01: rh ? rh.sunConeDeg : null });
    }
  }
  return { rows, dGrowMinOverAge: wMin, dURes: [uLo, uHi] };
}

export function gatesOf(J) {
  const nT3 = J.t3.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.t1.length === RD.axes.length * RD.mags.length * RD.rhos.length && J.t1.filter((r) => r.rho === 0).every((r) => r.thDeg === 0 && r.dAge2 === null),
    t2: J.t2.length === RD.axes.length * T.DECL.rads.length && J.t2.every((r) => r.okAtZero === true),
    t3: nT3 > 0 && J.t3.every((r) => r.createdDAz === null || (r.advDeg >= 0 && r.advDeg < 360)) && J.t3.filter((r) => r.pair === 'ringFixed' && r.f === 0).every((r) => r.frontFrac === null || r.frontFrac === 0),
    t4: J.t4.provisional === true && J.t4.rows.length === 2 * 2 * 2 && J.t4.rows.every((r) => r.AAsYr > 0 && r.uRes > 0),
    t5: J.t5.rows.length === RD.axes.length * 2 * 3,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = T.pureScenes(T1, GEO), pure = { scenes: PS, gates: T.pureGates(PS) }; mark('pure');
  const R = RC.refAxes(T1, GEO), ax = { L: R.L, eq: R.eq };
  const uV = { rule: T.uVenusRad(T1, GEO, { rad: 'rule' }, cache), obs: T.uVenusRad(T1, GEO, { rad: 'obs' }, cache) }; mark('ax');
  const t1 = rhoRows(T1, GEO, ax, cache); mark('t1');
  const t2 = windowRows(T1, GEO, ax, cache); mark('t2');
  const t3 = azRows(T1, GEO, ax, t2, cache); mark('t3');
  const t4 = wobRows(T1, GEO, cache); mark('t4');
  const t5 = sumRows(t1, t2, t3, t4); mark('t5');
  const J = { pure, uV, axes: ax, t1, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352r-twobg.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352R_OUT ? (path.isAbsolute(process.env.W352R_OUT) ? process.env.W352R_OUT : path.join(ROOT, process.env.W352R_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便r twobg(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: T.LIB_VERSION, generator: 'tests/exp-w352r-twobg.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R455', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: T.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便r', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'twobg', engine: 'Node(html を読まない —— 純関数の lib・第352便b〜e・j・k・l の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

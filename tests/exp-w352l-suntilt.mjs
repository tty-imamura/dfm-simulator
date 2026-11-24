// 第352便l(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R449):
//   **太陽の自転軸の傾き(基準軸に対して 5〜7°)を作る作用の候補の器 —— 一様な背景での輪の平均(表 2)・候補 (b) 輪と自転軸が別々に応える(表 3・表 4)・
//   候補 (c) 円盤引きずりの源に銀河の円盤の模型(表 5)・候補 (d) 上下の運動で替わる分(表 6 —— 仮の値・印つき)・向きの材料(表 7)・まとめ(表 8)・零試験 13**
//   (段 suntilt-352l —— 正本 tests/out/suntilt-352l.json・lib tests/lib-w352l-suntilt.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352l-suntilt.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。仮の値は第352便b の器の数だけ(表 6 —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 太陽の傾きの由来・公転面の由来の答えとは書かない。どの候補が正しいとは書かない(候補ごとに要る大きさ・出る向き・いまの器で足りない量)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352l-suntilt.mjs';
import * as RC from './lib-w352c-refaxis.mjs';
import * as PD from './lib-w352d-precsense.mjs';
import * as RJ from './lib-w351j-ringstep.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352l-suntilt-1';
export const OUT_MAIN = 'tests/out/suntilt-352l.json';
export const TARGET = 'tests/lib-w352l-suntilt.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = L.YR, AY = L.ASYR, D2R = Math.PI / 180;
export const PROV_KEYS = Object.freeze(['gal.vertical.period', 'gal.vertical.amplitude']);
export const NOT_CLAIM = Object.freeze([
  '候補 (b)(c)(d) は、予想の文「太陽の自転軸の傾きは、その際に生じる」を数えられる式に直した候補 —— どれが正しいとは書かない(要る大きさ・出る向き・足りない量の表)',
  '輪(公転面)と自転軸の応答の係数の差は置いていない(ノブ —— 差 1 あたりの数と、要る差を並べた)', '背景の向き (N+) と (G−)・歳差の向き (g2+) と (g2−)・基準軸の L と eq はどれにも寄せていない',
  '銀河の円盤は第352便f の対照の模型(核 K1・K2 で桁が 11 桁動く)—— 銀河の場の答えではない', '上下の振動の周期と振幅は仮の値・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  '「波打つ様に上下する」運動そのもの(面へ引き寄せる作用で振動が減るか)は式の形だけ —— 数えていない', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13(同じ係数で角が不変・同じ初めの向きで 0・係数の差の閉じた形 2 つ・Ω 0 で不変・閉じた形と RK4・輪の平均と ringOmega・一様な背景の輪・揺れの式と步・開く時間の往復・起点の数・模型の枠と受け手・拒否)',
  t2: '一様な背景(向き (N+)(G−)・倍率 1)の輪の平均と、第351便j の源の場の輪の (M)(S) の向き(輪の法線との角)',
  t3: '候補 (b): 背景の向き 2 × 大きさ 2((uV)・倍率 1)× 基準軸 3(L・eq・ecl)× f 3 —— 背景と基準軸の角・開き始めの率(係数の差 1 あたり)・開く時間(太陽の比 0・2)・要る係数の差・届く角の上限',
  t4: '候補 (b) の今の角(n̂ = 基準軸・ŝ = 太陽の自転軸)の変わる率: 同じ係数(比 1)× f 3 × (g2±)/太陽の比 0',
  t5: '候補 (c): 核 2 × 輪の粒子の自分の重み 3(太陽・木星・地球の質量)—— 太陽(C2・W)と輪(W)の Ω・差・年齢の間に届く角(係数 1)',
  t6: '候補 (d)(仮の値): 核 2 × 振幅 2 × 周期 2 × 背景の大きさ 2 —— 面の上下で替わる分と替わらない分・揺れの円の半径・要る倍',
  t7: '向きの材料: 基準軸 3 × 候補の向き(経路 ①・経路 ②・(d) の揺れ)の方位と (G+) の方位の差・太陽の傾きの方位',
  t8: 'まとめ: 候補 × 背景の向き × 大きさ —— 太陽系の年齢の宣言の間に届く角と要る倍' });

/* ───────── 小さな道具 ───────── */
const { dot, crs, nrm, scl, add, unit } = L.vec;
const RD = Object.freeze({ dirs: Object.freeze(['Np', 'Gm']), mags: Object.freeze(['uV', 1]), axes: Object.freeze(['L', 'eq', 'ecl']), fs: L.DECL.fs, sunRatios: Object.freeze([0, 2]),
  zs: Object.freeze(['lo', 'hi']), tzs: Object.freeze(['lo', 'hi']) });
export const ROWDECL = RD;
const multOf = (m, uV) => (m === 'uV' ? uV : m);
const AXT = (ax) => L.DECL.tiltDeg[ax];
const ageS = L.DECL.ageYr * YR;

/* ───────── 表 2: 一様な背景での輪の平均 ───────── */
export function ringBgRows(T1, GEO, ax, uV) {
  const rows = [], rs = L.ringScale();
  for (const dir of RD.dirs) {
    const bg = PD.bgVec(dir, { u: 1, axis: ax.L }), avg = L.ringAvg(() => bg, ax.L, { r0: rs.r0, N: L.DECL.ring.N, vc: rs.vc, V: [0, 1, 0] });
    rows.push({ kind: 'bg', dir, relToBg: L.vec.nrm(L.vec.sub(avg, bg)) / nrm(bg), angLDeg: L.angDeg(avg, ax.L) });
  }
  for (const part of ['M', 'S']) { const Lr = RJ.normalAt(10); const om = RJ.ringOmega(Lr, { read: 'C1', part }); rows.push({ kind: 'src351j', part, relToBg: null, angLDeg: L.angDeg(om, Lr) }); }
  return rows;
}

/* ───────── 表 3・表 4: 候補 (b) ───────── */
export function bRows(T1, GEO, ax, uV) {
  const rows = [];
  for (const dir of RD.dirs) for (const m of RD.mags) for (const a of RD.axes) {
    const Om = PD.bgVec(dir, { u: multOf(m, uV), axis: ax[a] }), om = nrm(Om), X0 = ax[a], thDeg = L.angDeg(X0, Om), tgt = AXT(a);
    for (const f of RD.fs) {
      const ring = L.axisCoef(f), open = {};
      for (const rho of RD.sunRatios) {
        const t = L.openTime({ X0, Om, gammaDeg: tgt, ring, spin: L.axisCoef(f, { ratio: rho }), tMax: 100 / om });
        open['r' + rho] = t === null ? null : t / YR;
      }
      const tm = L.openTime({ X0, Om, gammaDeg: tgt, ring: L.axisCoef(f, { sense: 'g2m' }), spin: L.axisCoef(f, { sense: 'g2m', ratio: 0 }), tMax: 100 / om });
      const c = L.axisCoef(f), maxG = (c.kTilt > 0 ? (c.kPrec > 0 ? null : thDeg) : 2 * Math.min(thDeg, 180 - thDeg));
      rows.push({ dir, mag: m, mult: multOf(m, uV), axis: a, f, kTilt: c.kTilt, kPrec: c.kPrec, thDeg, tgtDeg: tgt, omAsYr: om * AY,
        initPerDeltaAsYr: Math.sin(thDeg * D2R) * om * AY * (f === 0 ? c.kPrec : f === 1 ? c.kTilt : Math.hypot(c.kTilt, c.kPrec)),
        openYr0: open.r0, openYr2: open.r2, openYr0m: tm === null ? null : tm / YR, deltaReq: open.r0 === null ? null : open.r0 / L.DECL.ageYr, reach: open.r0 !== null && open.r0 <= L.DECL.ageYr, maxGammaDeg: maxG });
    }
  }
  return rows;
}
/** 今の角 γ = (n̂ = 基準軸, ŝ = 太陽の自転軸)の変わる率(″/年)—— n̂ と ŝ に同じ Ω */
const gammaRate = (n, s, Om, cn, cs) => { const g = L.angDeg(n, s) * D2R, dn = L.axisDs(n, Om, cn), ds = L.axisDs(s, Om, cs); return -(dot(ds, n) + dot(dn, s)) / Math.sin(g); };
export function nowRows(T1, GEO, ax, uV) {
  const rows = [], sun = unit(GEO['Earth|Sun'].s);
  for (const dir of RD.dirs) for (const m of RD.mags) for (const a of ['L', 'eq']) for (const f of RD.fs) {
    const Om = PD.bgVec(dir, { u: multOf(m, uV), axis: ax[a] }), n = ax[a], r = { dir, mag: m, axis: a, f, gammaDeg: L.angDeg(n, sun) }, fl = (x) => (Math.abs(x) <= L.DECL.floor * nrm(Om) * AY ? 0 : x);
    for (const sense of L.DECL.senses) { const c = L.axisCoef(f, { sense }); r['same_' + sense] = fl(gammaRate(n, sun, Om, c, c) * AY); r['sun0_' + sense] = fl(gammaRate(n, sun, Om, c, L.axisCoef(f, { sense, ratio: 0 })) * AY); }
    rows.push(r);
  }
  return rows;
}

/* ───────── 表 5: 候補 (c) ───────── */
export function cRows(T1, GEO, ax) {
  const MF = L.modelFrame(GEO), rs = L.ringScale(), Lm = MF.toModel(ax.L), rows = [], OG = L.DECL.omegaG;
  const thL = L.angDeg(ax.L, MF.z), thEq = L.angDeg(ax.eq, MF.z), thSun = L.angDeg(unit(GEO['Earth|Sun'].s), MF.z);
  for (const al of L.DECL.als) {
    const src = L.diskSrc(al), sr = L.recvOf('Sun', al), sunC2 = L.diskOmAt(src, { al, recv: sr, read: 'C2' })(L.P0, L.V0), sunW = L.diskOmAt(src, { al, recv: sr, read: 'W' })(L.P0, L.V0);
    for (const id of L.DECL.recvIds) {
      const rc = L.recvOf(id, al), ring = L.ringAvg(L.diskOmAt(src, { al, recv: rc, read: 'W' }), Lm, { center: L.P0, r0: rs.r0, N: L.DECL.ring.N, vc: rs.vc, V: L.V0 });
      const ctr = id === 'Sun' ? sunW : L.diskOmAt(src, { al, recv: rc, read: 'W' })(L.P0, L.V0);
      const ringRel = Math.abs(ring[2] / ctr[2] - 1), dW = Math.abs(ring[2] - sunW[2]), dC = Math.abs(ring[2] - sunC2[2]);
      rows.push({ al, recv: id, Arel: rc.A / sr.A, ringZ: ring[2], ringXYrel: Math.hypot(ring[0], ring[1]) / Math.abs(ring[2]), ringVsCenter: ringRel < 1e-9 ? 0 : ringRel,
        sunC2: sunC2[2], sunW: sunW[2], dW: dW <= 1e-9 * Math.abs(sunW[2]) ? 0 : dW, dC2: dC <= 1e-9 * Math.abs(sunC2[2]) ? 0 : dC,
        ringAsYr: ring[2] * OG * AY, dWAsYr: (dW <= 1e-9 * Math.abs(sunW[2]) ? 0 : dW) * OG * AY, dC2AsYr: (dC <= 1e-9 * Math.abs(sunC2[2]) ? 0 : dC) * OG * AY,
        ageDegW: Math.sin(thL * D2R) * (dW <= 1e-9 * Math.abs(sunW[2]) ? 0 : dW) * OG * ageS / D2R, ageDegC2: Math.sin(thL * D2R) * (dC <= 1e-9 * Math.abs(sunC2[2]) ? 0 : dC) * OG * ageS / D2R,
        ageDegAbs: Math.sin(thL * D2R) * Math.abs(ring[2]) * OG * ageS / D2R });
    }
  }
  return { thLDeg: thL, thEqDeg: thEq, thSunDeg: thSun, ringR0: rs.r0, ringVc: rs.vc, rows };
}

/* ───────── 表 6: 候補 (d)(仮の値)───────── */
export function dRows(T1, GEO, ax, uV) {
  const rs = L.ringScale(), OG = L.DECL.omegaG, rows = [];
  for (const al of L.DECL.als) {
    const src = L.diskSrc(al), sr = L.recvOf('Sun', al), at = (z) => L.diskOmAt(src, { al, recv: sr, read: 'C2' })([1, 0, z], L.V0);
    for (const zk of RD.zs) {
      const Zpc = PV.provValue('gal.vertical.amplitude', zk), Z = Zpc * L.DECL.pc / rs.R0, up = at(Z), dn = at(-Z);
      const mirror = Math.max(Math.abs(up[0] + dn[0]), Math.abs(up[1] + dn[1])) / Math.hypot(up[0], up[1]), symZ = Math.abs(up[2] - dn[2]) / Math.abs(up[2]);
      const anti = Math.hypot(up[0], up[1]), sym = up[2], A = anti * OG;
      for (const tk of RD.tzs) for (const m of RD.mags) {
        const Tz = PV.provValue('gal.vertical.period', tk), w = 2 * Math.PI / (Tz * YR), Op = nrm(PD.bgVec('Np', { u: multOf(m, uV) })), WR = L.wobbleRadius({ A, Op, w });
        rows.push({ al, zKey: zk, Zpc, tzKey: tk, TzYr: Tz, mag: m, sym, anti, antiOverSym: anti / Math.abs(sym), mirror: mirror < 1e-9 ? 0 : mirror, symEven: symZ < 1e-9 ? 0 : symZ,
          AAsYr: A * AY, wAsYr: w * AY, OpAsYr: Op * AY, radDeg: WR.max / D2R, need: (L.DECL.tiltDeg.L * D2R) / WR.max, needEq: (L.DECL.tiltDeg.eq * D2R) / WR.max });
      }
    }
  }
  return PV.tagProv({ rows, keys: PROV_KEYS.slice() }, PROV_KEYS.slice());
}

/* ───────── 表 7: 向きの材料 ───────── */
export function dirRows(T1, GEO, ax) {
  const g = RC.galDirs(GEO), sun = unit(GEO['Earth|Sun'].s), MF = L.modelFrame(GEO), rows = [];
  const antiDir = scl(MF.x, -1);   // (d) の面の上の面内の成分の向き(模型の x̂ の負 —— 銀河中心の向き)
  for (const a of RD.axes) {
    const p = ax[a], azG = RC.azimuthDeg(p, g.Gp).az, d = (v) => RC.dAz(RC.azimuthDeg(p, v).az, azG);
    rows.push({ axis: a, sunDAz: d(sun), sunOffDeg: L.angDeg(p, sun), gcDAz: d(g.gc), dWobbleDAz: d(crs(antiDir, p)) });
  }
  return rows;
}

/* ───────── 表 8: まとめ ───────── */
export function sumRows(B, Cc, Dd) {
  const rows = [];
  for (const dir of RD.dirs) for (const m of RD.mags) {
    const b0 = B.find((r) => r.dir === dir && r.mag === m && r.axis === 'L' && r.f === 0), b1 = B.find((r) => r.dir === dir && r.mag === m && r.axis === 'L' && r.f === 1);
    rows.push({ cand: 'b', dir, mag: m, path: '②', deltaReq: b0.deltaReq, maxGammaDeg: b0.maxGammaDeg, reach: b0.reach });
    rows.push({ cand: 'b', dir, mag: m, path: '①', deltaReq: b1.deltaReq, maxGammaDeg: b1.maxGammaDeg, reach: b1.reach });
  }
  for (const r of Cc.rows) if (r.recv === 'Sun' || r.recv === 'Jupiter') rows.push({ cand: 'c', al: r.al, recv: r.recv, ageDegC2: r.ageDegC2, ageDegW: r.ageDegW, need: r.ageDegC2 > 0 ? L.DECL.tiltDeg.L / r.ageDegC2 : null });
  for (const m of RD.mags) for (const al of L.DECL.als) { const r = Dd.rows.find((x) => x.al === al && x.mag === m && x.zKey === 'hi' && x.tzKey === 'lo'); rows.push({ cand: 'd', al, mag: m, radDeg: r.radDeg, need: r.need, provisional: true }); }
  return rows;
}

export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t2: J.ringBg.length === 4 && J.ringBg.filter((r) => r.kind === 'bg').every((r) => r.relToBg < 1e-15),
    t3: J.b.length === RD.dirs.length * RD.mags.length * RD.axes.length * RD.fs.length && J.b.filter((r) => r.dir === 'Np').every((r) => r.openYr0 === null && r.openYr0m === null && r.thDeg < 1e-6)
      && J.b.filter((r) => r.dir === 'Gm').every((r) => r.openYr0 > 0 && Math.abs(r.openYr0m / r.openYr0 - 1) < 1e-9),
    t4: J.now.length === RD.dirs.length * RD.mags.length * 2 * RD.fs.length && J.now.filter((r) => r.f === 0).every((r) => r.same_g2p === 0 && r.same_g2m === 0),
    t5: J.c.rows.length === L.DECL.als.length * L.DECL.recvIds.length && J.c.rows.every((r) => r.ringVsCenter === 0 || r.ringVsCenter < 1e-6),
    t6: J.d.provisional === true && J.d.rows.length === 2 * 2 * 2 * 2 && J.d.rows.every((r) => r.mirror === 0 && r.symEven === 0 && r.radDeg > 0),
    t7: J.dir.length === RD.axes.length,
    t8: J.sum.length === 8 + 4 + 4,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const R = RC.refAxes(T1, GEO), ax = { L: R.L, eq: R.eq, ecl: R.ecl }, uV = PD.uVenus(T1, GEO); mark('ax');
  const ringBg = ringBgRows(T1, GEO, ax, uV); mark('t2');
  const b = bRows(T1, GEO, ax, uV); mark('t3');
  const now = nowRows(T1, GEO, ax, uV); mark('t4');
  const c = cRows(T1, GEO, ax); mark('t5');
  const d = dRows(T1, GEO, ax, uV); mark('t6');
  const dir = dirRows(T1, GEO, ax); mark('t7');
  const sum = sumRows(b, c, d); mark('t8');
  const J = { pure, uV, axes: ax, ringBg, b, now, c, d, dir, sum, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352l-suntilt.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352L_OUT ? (path.isAbsolute(process.env.W352L_OUT) ? process.env.W352L_OUT : path.join(ROOT, process.env.W352L_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便l suntilt(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352l-suntilt.mjs', target: TARGET,
    ruling: '原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R449', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便l', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'suntilt', engine: 'Node(html を読まない —— 純関数の lib・第351便d・第351便j・第352便b〜f の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

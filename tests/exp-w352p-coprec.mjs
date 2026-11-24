// 第352便p(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R453):
//   **公転面(輪の法線)と自転軸の共回りの器 —— 係数の比の候補と輪の回る率(表 1)・(G−) の共回りの止まる向き(表 2 —— 読み A・B × 歳差の向き × f)・
//   (N+) の共回りの止まる向き(表 3)・いまの角を保つ作用と f の上限(表 4 —— 仮の値の列は印つき)・輪の法線が経路 ① で寄る角(表 5 —— 仮の値の列は印つき)・零試験 13**
//   (段 coprec-352p —— 正本 tests/out/coprec-352p.json・lib tests/lib-w352p-coprec.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352p-coprec.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(地球の歳差の率 —— 正本の最上位に provisional: true と鍵の一覧)。
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 観測の傾き・公転面の由来の答えとは書かない。読み A・B・候補 (P1)〜(P3)・背景の向き・歳差の向き・基準軸のどれも選ばない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w352p-coprec.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352p-coprec-1';
export const OUT_MAIN = 'tests/out/coprec-352p.json';
export const TARGET = 'tests/lib-w352p-coprec.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const AY = L.ASYR, YR = L.YR, D2R = Math.PI / 180;
export const PROV_KEYS = Object.freeze(['earth.psiA.rate']);
export const NOT_CLAIM = Object.freeze([
  '読み A(回る軸 = 背景の軸)と読み B(回る軸 = 公転の法線)はどちらにも寄せない —— 同じ入力で両方の列', '係数の比の候補 (P1)(P2)(P3) はどれも選ばない((P3) は統括の読みではない候補)',
  '観測の傾きは固定の比べる列(リポジトリの geometry の角 —— 合わせない)', '背景の向き (N+) と (G−)・歳差の向き (g2+) と (g2−)・基準軸の L と eq はどれにも寄せていない',
  '地球の歳差の率から出した背景の大きさの列は仮の値・未照合(較正・サンプルの状況・ノブの採否に入れない)', '「公転面に薄く集まる」は予想の文の側の数 —— 公転面の由来の答えではない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 13(同じ係数で共回り・読み A の局所 0 と局所だけ・g 0 で一定の軸・読み B は lockGeom と同じ・第352便l の要る係数の差・(P2) を直接に・f の上限・保つ作用と fixedOffset・輪の寄り・第352便i の地球の根・lockFromA の照合・拒否)',
  t1: '係数の比の候補(9 天体 × (P1)(P2)(P3)× 背景 (G−)・倍率 (uV)・1)と輪の回る率・開く角に要る背景の大きさ',
  t2: '(G−) の共回り: 9 天体 × 基準軸 2 × 倍率 2 × (g2±) × f 0・0.5 —— 読み A((P1)・(P3)・δ の根)・読み B(ρ の式・(P3)・ρ の根)',
  t3: '(N+) の共回り: 同じ格子 —— 止まる向きの傾きと、ρ・δ を振ったときの傾きの最大',
  t4: '保つ作用と f の上限: 地球・火星・太陽 × (N+)・(G−) × 基準軸 2 × 倍率 3((uV)・1・仮)',
  t5: '輪の法線の寄り: 倍率 3 × f_輪 6 —— 初めの 30° が年齢の後に何度か・7° になる f_輪 の下限' });
export const ROWDECL = Object.freeze({ dirs: L.DECL.dirs, axes: L.DECL.axes, mags2: Object.freeze(['uV', 'u1']), mags3: L.DECL.mags, fs: L.DECL.fs, senses: L.DECL.senses });
const RD = ROWDECL;

/* ───────── 表 1: 係数の比の候補と輪の回る率 ───────── */
export function coefRows(T1, GEO, ctx) {
  const rows = [];
  for (const id of L.DECL.bodies) {
    const N = L.bodyNums(id);
    for (const mag of RD.mags2) {
      const st = L.stateOf(T1, GEO, id, { dir: 'Gm', axis: 'L', u: ctx.u[mag] }, ctx.cache);
      const sS = Math.sin(L.angDeg(st.sHat, st.Om) * D2R), sN = Math.sin(L.angDeg(st.nRing, st.Om) * D2R);
      const c2 = L.coefCand('P2', { w: N.w, nOrb: N.nOrb, perpS: st.W * sS, perpN: st.W * sN }), c3 = L.coefCand('P3', { C: N.C });
      const g = L.gRing({ Wbg: st.Wbg, fRing: 0, sense: 'g2p' });
      // 開く角(初めにそろった輪の法線と自転軸が、年齢の間にいまの傾きまで開く)に要る背景の大きさ(倍率 —— 経路 ② だけ・θ = 輪の法線と背景の角)
      const th = st.Ibg, tg = st.oblNowDeg;
      const w3 = L.wReqOpen({ thDeg: th, gammaDeg: tg, rel: c3.rel }), w2 = L.wReqP2({ thDeg: th, gammaDeg: tg, w: N.w, nOrb: N.nOrb, sS: Math.sin(th * D2R), sN: Math.sin(th * D2R) });
      rows.push({ id, mag, w: N.w, nOrb: N.nOrb, C: N.C, wOverN: N.w / N.nOrb, relP1: 0, relP2: c2.rel, relP3: c3.rel, gRingAsYr: g * AY, IbgDeg: th, oblNowDeg: tg,
        reach: L.LL.dphiFor({ thDeg: th, gammaDeg: tg }) !== null, uReqP3: w3 === null ? null : w3 / L.DECL.omegaG, uReqP2: w2 === null ? null : w2 / L.DECL.omegaG,
        deltaReq: L.deltaReq({ thDeg: th, gammaDeg: tg, W: st.Wbg }) });
    }
  }
  return rows;
}

/* ───────── 表 2・3: 共回りの止まる向き ───────── */
export function lockRows(T1, GEO, ctx, dir) {
  const rows = [];
  for (const id of L.DECL.bodies) {
    const N = L.bodyNums(id), c3 = L.coefCand('P3', { C: N.C }), d3 = c3.ratio - 1;
    for (const axis of RD.axes) for (const mag of RD.mags2) {
      const st = L.stateOf(T1, GEO, id, { dir, axis, u: ctx.u[mag] }, ctx.cache), tg = st.oblNowDeg, sc = 360;
      for (const sense of RD.senses) for (const f of RD.fs) {
        const r = { id, axis, mag, sense, f, oblNowDeg: tg, IbgDeg: st.Ibg, IomDeg: st.Iom, locOverBg: st.locOverBg, delP3: d3 };
        // 読み A
        const a1 = L.lockA({ bg: st.bg, loc: st.local, sHat: st.sHat, nRing: st.nRing, delta: 0, f, sense }), a3 = L.lockA({ bg: st.bg, loc: st.local, sHat: st.sHat, nRing: st.nRing, delta: d3, f, sense });
        r.A1 = a1.ok ? (a1.neutral ? { coneDeg: a1.coneDeg, alphaDeg: a1.alphaDeg, oblMinDeg: a1.oblMinDeg, oblMaxDeg: a1.oblMaxDeg, aAsYr: a1.aRate * AY } : { oblDeg: a1.oblDeg, lamAsYr: a1.lam * AY }) : null;
        r.A3 = a3.ok ? (a3.neutral ? { coneDeg: a3.coneDeg, alphaDeg: a3.alphaDeg, oblMinDeg: a3.oblMinDeg, oblMaxDeg: a3.oblMaxDeg, aAsYr: a3.aRate * AY } : { oblDeg: a3.oblDeg, lamAsYr: a3.lam * AY }) : null;
        if (f > 0) { const ds = L.deltaScan({ bg: st.bg, loc: st.local, sHat: st.sHat, nRing: st.nRing, f, sense, targetDeg: tg }); r.Aroots = ds.roots.map((x) => x.delta); r.AmaxDeg = ds.maxDeg; r.AminDeg = ds.minDeg;
          r.ArootPerP3 = ds.roots.map((x) => x.delta / d3); }
        // 読み B(回る軸 = 輪の法線)
        const rf1 = L.rhoFormula(st, { read: 'B', f, sense }), rf3 = L.rhoFormula(st, { read: 'B', f, sense, ratio: c3.ratio });
        if (st.Ibg > 1e-9) {
          const b1 = L.lockObl({ Om: st.Om, nRot: st.nRing, nRing: st.nRing, rho: rf1.rho, f, sense }), b3 = L.lockObl({ Om: st.Om, nRot: st.nRing, nRing: st.nRing, rho: rf3.rho, f, sense });
          const bs = L.rhoScan({ Om: st.Om, nRot: st.nRing, nRing: st.nRing, f, sense, targetDeg: tg });
          Object.assign(r, { Brho1: rf1.rho, Brho3: rf3.rho, B1: b1.ok ? b1.oblDeg : null, B3: b3.ok ? b3.oblDeg : null, Broots: bs.roots.map((x) => x.rho), BrootPerP1: bs.roots.map((x) => x.rho / rf1.rho),
            BmaxDeg: bs.maxDeg, BminDeg: bs.minDeg });
        } else Object.assign(r, { Brho1: rf1.rho, Brho3: rf3.rho, B1: null, B3: null, Broots: [], BrootPerP1: [], BmaxDeg: null, BminDeg: null, Bnote: '輪の法線 ∥ 背景(回る軸と合成が同じ —— 傾き 0 の形)' });
        rows.push(r);
      }
    }
  }
  return rows;
}

/* ───────── 表 4: 保つ作用と f の上限 ───────── */
export function keepRows(T1, GEO, ctx) {
  const rows = [];
  for (const id of L.DECL.keepBodies) for (const dir of RD.dirs) for (const axis of RD.axes) for (const mag of RD.mags3) {
    const st = L.stateOf(T1, GEO, id, { dir, axis, u: ctx.u[mag] }, ctx.cache), th = st.thNowDeg, fm = L.fMax({ thDeg: th, W: st.W });
    const ka = L.keepA({ f: fm.fMax, thDeg: th, W: st.W, Op: st.W });
    const r = { id, dir, axis, mag, thDeg: th, WAsYr: st.W * AY, k1Max: fm.k1Max, fMax: fm.fMax, AkeepAsYr: ka.A * AY, thFixedDeg: ka.thFixedDeg };
    rows.push(mag === 'uP' ? PV.tagProv(r, PROV_KEYS.slice()) : r);
  }
  return rows;
}

/* ───────── 表 5: 輪の法線の寄り ───────── */
export function ringRows(ctx) {
  const rows = [];
  for (const mag of RD.mags3) {
    const W = L.DECL.omegaG * ctx.u[mag];
    for (const fRing of L.DECL.fRing) { const a = L.ringAfter({ W, fRing }); const r = { mag, fRing, W, thDeg: a.thDeg, dropDeg: a.dropDeg, kwt: a.kwt }; rows.push(mag === 'uP' ? PV.tagProv(r, PROV_KEYS.slice()) : r); }
    const need = L.fRingFor({ targetDeg: 7, W }); const r = { mag, fRing: 'need7', W, k1Need: need.k1, fNeed: need.f }; rows.push(mag === 'uP' ? PV.tagProv(r, PROV_KEYS.slice()) : r);
  }
  return rows;
}

export function gatesOf(J) {
  const n9 = L.DECL.bodies.length, nL = n9 * RD.axes.length * RD.mags2.length * RD.senses.length * RD.fs.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    t1: J.coef.length === n9 * 2 && J.coef.every((r) => r.relP1 === 0 && Math.abs(r.relP2) < 1e-6 && r.relP3 > 0),
    t2: J.lockG.length === nL && J.lockG.filter((r) => r.f > 0).every((r) => r.A1 && r.A1.oblDeg !== undefined),
    t3: J.lockN.length === nL && J.lockN.filter((r) => r.id === 'Sun' && r.f > 0).every((r) => r.A1 && r.A1.oblDeg < 1e-6),
    t4: J.keep.length === L.DECL.keepBodies.length * 2 * 2 * 3 && J.keep.filter((r) => r.mag === 'uP').every((r) => r.provisional === true),
    t5: J.ring.length === 3 * (L.DECL.fRing.length + 1) && J.ring.filter((r) => r.mag === 'uP').every((r) => r.provisional === true),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const cache = {}, provRate = Math.abs(PV.provValue('earth.psiA.rate'));
  const u = { uV: L.uOf('uV', T1, GEO, cache), u1: 1, uP: L.uOf('uP', T1, GEO, cache, provRate) }, ctx = { cache, u };
  const coef = coefRows(T1, GEO, ctx); mark('t1');
  const lockG = lockRows(T1, GEO, ctx, 'Gm'); mark('t2');
  const lockN = lockRows(T1, GEO, ctx, 'Np'); mark('t3');
  const keep = keepRows(T1, GEO, ctx); mark('t4');
  const ring = ringRows(ctx); mark('t5');
  const J = { pure, u, coef, lockG, lockN, keep, ring, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352p-coprec.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352P_OUT ? (path.isAbsolute(process.env.W352P_OUT) ? process.env.W352P_OUT : path.join(ROOT, process.env.W352P_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便p coprec(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352p-coprec.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R453', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便p', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'coprec', engine: 'Node(html を読まない —— 純関数の lib・第352便i・第352便l・第352便b〜e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

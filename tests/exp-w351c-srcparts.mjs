// 第351便c(原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R429):
//   **源の由来の軸引きずりの回転を 3 つの成分 (M) 相対の公転の分・(S) 源の自転の分・(MS) 両方 に分けて数える器 —— 無次元の例の向きと閉じた形(表 1)・天体 16 組の符号と大きさ(表 2)・
//   公転の北極を基準の起こす率と回転軸へ寄る率(表 3)・一様な背景との大きさの比(表 4)・(M) の正体の対照(表 5)・零試験 14**
//   (段 srcparts-351c —— 正本 tests/out/srcparts-351c.json・lib tests/lib-w351c-srcparts.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351c-srcparts.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く(lib の口は第 2 段の枝が import するので、表のために lib を変えない)。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 言わないこと: 太陽由来の軸引きずりの符号・第147報の予想の成否とは書かない。(M) を軸引きずりに数えるか並進引きずりの回転成分に数えるかは決めない(この場・この成分・この読みでは、の表)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w351c-srcparts.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351c-srcparts-1';
export const OUT_MAIN = 'tests/out/srcparts-351c.json';
export const TARGET = 'tests/lib-w351c-srcparts.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = TL.YR, AS = 180 * 3600 / Math.PI, AY = YR * AS;
export const NOT_CLAIM = Object.freeze([
  '源の成分 (M)(S)(MS) の符号・大きさ・起こす率の表(太陽由来の軸引きずりの符号の答え・第147報の予想の成否ではない)', '(M) を軸引きずりに数えるか並進引きずりの回転成分に数えるかは決めていない(決断事項の候補)',
  '「起こす率」は経路 ① だけ・係数 1(dŝ/dt = Ω⊥)の一次の率 —— 経路の比のノブ・トルクの式の自転速度の比は掛けていない(第 1 段の枝 d・第 2 段)', '一様な背景の倍率 1 はノブの格子の 1 点 —— 大きさは決めていない',
  'Charon|Pluto と Charon|Sun は 15 組の入力から作った宣言の組(作り方は lib の頭)', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 無次元の例の宣言(源 m 1・R 1・受け手の半径 0.1・自分の重みの中心の値 A) */
export const DIM = Object.freeze({ Rb: 0.1, A: Object.freeze([1, 100]), d: Object.freeze([3, 10, 30]), v: 0.1, omega: 1, pow: Object.freeze({ d: Object.freeze([10, 30]), A: Object.freeze([10, 100]), R: Object.freeze([1, 2]), dFix: 30, AFix: 100 }) });
export const PLAN = Object.freeze({ pure: '零試験 14(srcRot3 との一致・線形・(S) を直接に・共通の点検の数〔第351便・第350便〕・反転・分母の列・absVel・(M) の閉じた形・係数 k・球の平均 ÷ 中心・Charon|Pluto・拒否)',
  t1: '無次元の例: A 2 × d 3((M) と (S) の向きと閉じた形)+ べき 3 つ(距離・自分の重み・源の半径)+ 8 惑星の (S) ÷ (M) の閉じた形', t2: '16 組 × 由来(太陽・母天体)× 読み 2 × 成分 3 + 一様な背景 2 向き(倍率 1)',
  t3: '起こす率と回転軸へ寄る率(16 組 × 由来 × 成分 3 × 読み 2)・第147報の文に当たる行の数', t4: '太陽由来 (S)・(MS) と背景(倍率 1)の起こす率の比・大きさが同じになる倍率(16 組)', t5: '(M) の正体: 8 惑星の ½ β n_orb との照合・absVel で 0' });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const PLANETS = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);
const sgn = (x) => (x === null ? 0 : x > 0 ? 1 : x < 0 ? -1 : 0);

/* ───────── 表 1: 無次元の例 ───────── */
function dimOne({ A, d, R = 1, v = DIM.v, om = DIM.omega }) {
  const recv = { m: A * 2 * DIM.Rb / 3, R: DIM.Rb, p: [0, 0, 0], v: [0, 0, 0] };
  // (ア) 自転しない源が受け手のまわりを順方向に回る(源 (d,0,0)・速度 (0,v,0) —— 公転の角運動量 +ẑ)
  const fM = G3.makeField3({ sources: [{ m: 1, R, p: [d, 0, 0], v: [0, v, 0], spin: [0, 0, 0] }], recv });
  // (イ) 自転する源(静止・軸 +ẑ)の赤道面
  const fS = G3.makeField3({ sources: [{ m: 1, R, p: [d, 0, 0], v: [0, 0, 0], spin: [0, 0, om] }], recv });
  const M = G3.rot3('W', fM, [0, 0, 0], { Rb: DIM.Rb }), S = G3.rot3('W', fS, [0, 0, 0], { Rb: DIM.Rb });
  const cM = G3.closedTransW({ A, mj: 1, rho: [-d, 0, 0], c: [0, v, 0], R })[2], cS = L.closedSEq({ A, mj: 1, Rj: R, r: d }) * om;
  return { M, S, cM, cS };
}
export function dimRows() {
  const rows = [];
  for (const A of DIM.A) for (const d of DIM.d) {
    const o = dimOne({ A, d }), nOrb = DIM.v / d, lead = 0.2 * (1 / d) * (1 / d) * DIM.omega / nOrb;
    rows.push({ A, d, Mz: o.M[2], Mperp: Math.hypot(o.M[0], o.M[1]), Mclosed: o.cM, Mrel: Math.abs(o.M[2] / o.cM - 1), Msign: sgn(o.M[2]),
      Sz: o.S[2], Sperp: Math.hypot(o.S[0], o.S[1]), Sclosed: o.cS, Srel: Math.abs(o.S[2] / o.cS - 1), Ssign: sgn(o.S[2]), ratio: Math.abs(o.S[2] / o.M[2]), ratioLead: lead, ratioOverLead: Math.abs(o.S[2] / o.M[2]) / lead });
  }
  const P = DIM.pow, slope = (f, a, b) => Math.log(Math.abs(f(b)) / Math.abs(f(a))) / Math.log(b / a);
  const pow = [
    { var: 'd', range: P.d, M: slope((d) => dimOne({ A: P.AFix, d }).M[2], ...P.d), S: slope((d) => dimOne({ A: P.AFix, d }).S[2], ...P.d) },
    { var: 'A', range: P.A, M: slope((A) => dimOne({ A, d: P.dFix }).M[2], ...P.A), S: slope((A) => dimOne({ A, d: P.dFix }).S[2], ...P.A) },
    { var: 'R', range: P.R, M: slope((R) => dimOne({ A: P.AFix, d: P.dFix, R }).M[2], ...P.R), S: slope((R) => dimOne({ A: P.AFix, d: P.dFix, R }).S[2], ...P.R) },
  ];
  return { rows, pow };
}
/** 8 惑星の (S) ÷ (M)((W)・分母 out)と閉じた形の頭の項 (1/5)(R_s/a)²(ω_s/n_orb)(源の赤道面・自分の重みが支配の極限) */
export function planetRatioRows(T1, GEO) {
  return PLANETS.map((id) => {
    const P = L.pairInput(T1, GEO, id, 'Sun'), m = L.partRot(T1, GEO, id, 'Sun', { part: 'M', read: 'W' }), s = L.partRot(T1, GEO, id, 'Sun', { part: 'S', read: 'W' });
    const Rs = G3.YK * P.Ms, lead = 0.2 * (Rs / P.a) * (Rs / P.a) * P.ws / m.nOrb, ratio = nrm(s.Om) / nrm(m.Om);
    return { id, RsOverA: Rs / P.a, wsOverN: P.ws / m.nOrb, lead, ratio, ratioOverLead: ratio / lead, incSrcDeg: Math.acos(Math.max(-1, Math.min(1, dot(P.sAx, P.nHat)))) * 180 / Math.PI };
  });
}

/* ───────── 表 2〜4: 天体 16 組 ───────── */
/** 起こす率を書く傾きの床(sin ε < 1e-6 —— 同期の宣言で自転軸 = 公転の法線の組は丸めで向きが揺れるので null。lib の raiseRate の床 1e-9 より厚い) */
export const SIN_EPS_TABLE = 1e-6;
function partStats(sHat, nHat, Om) {
  const c0 = Math.max(-1, Math.min(1, dot(sHat, nHat))), r = Math.sqrt(1 - c0 * c0) < SIN_EPS_TABLE ? null : L.raiseRate(sHat, nHat, L.perpOf(sHat, Om)), t = L.towardRates(sHat, Om);
  return { magAsYr: nrm(Om) * AY, cos: L.cosTo(sHat, Om), raiseAsYr: r === null ? null : r * AY, toOmAsYr: t.toOm * AY, toLineAsYr: t.toLine * AY, signDiff: r === null ? null : sgn(r) !== sgn(t.toLine) };
}
export function bodyRows(T1, GEO) {
  const rows = [], bg = [];
  for (const [id, src] of L.PAIRS16) {
    const P = L.pairInput(T1, GEO, id, src), sHat = P.sHat, nHat = P.nHat, c = Math.max(-1, Math.min(1, dot(sHat, nHat))), epsDeg = Math.acos(c) * 180 / Math.PI;
    for (const read of L.DECL.reads) {
      const pp = L.pairParts(T1, GEO, id, src, { read, den: L.DECL.mainDen });
      for (const [origin, v] of [['sun', pp.sun], ['parent', pp.parent]]) {
        if (!v) continue;
        const parts = Object.fromEntries(L.DECL.parts.map((p) => [p, partStats(sHat, nHat, v[p])]));
        rows.push({ id, src, origin, read, epsDeg, parts, ratioSM: nrm(v.S) / nrm(v.M), ratioMSoverM: nrm(v.MS) / nrm(v.M) });
      }
    }
    for (const sign of L.DECL.bgSigns) { const b = L.bgOm(id, { sign }); bg.push({ id, src, sign, mult: L.DECL.bgMult, epsDeg, ...partStats(sHat, nHat, b) }); }
  }
  return { rows, bg };
}
/** 第147報の文「銀河由来は起こす向き・太陽由来は倒す向き」に当たる行の数(成分ごと・読みごと・背景の向きごと)—— 数だけ */
export function countRows(B) {
  const out = [];
  for (const read of L.DECL.reads) for (const sign of L.DECL.bgSigns) for (const part of L.DECL.parts) for (const scope of ['planets', 'all']) {
    const rs = B.rows.filter((r) => r.read === read && r.origin === 'sun' && (scope === 'all' || (PLANETS.includes(r.id) && r.src === 'Sun')));
    let hit = 0, miss = 0, undef = 0;
    for (const r of rs) {
      const b = B.bg.find((x) => x.id === r.id && x.src === r.src && x.sign === sign), a = r.parts[part].raiseAsYr;
      if (a === null || b.raiseAsYr === null) { undef++; continue; }
      if (b.raiseAsYr > 0 && a < 0) hit++; else miss++;
    }
    out.push({ read, sign, part, scope, hit, miss, undef, n: rs.length });
  }
  return out;
}
/** 表 4: 太陽由来の起こす率と背景(倍率 1)の起こす率の比 —— 2 つの項どうしの比(比べる数からの逆算ではない) */
export function balRows(B) {
  const out = [];
  for (const r of B.rows.filter((x) => x.read === L.DECL.mainRead && x.origin === 'sun')) for (const sign of L.DECL.bgSigns) {
    const b = B.bg.find((x) => x.id === r.id && x.src === r.src && x.sign === sign), one = (p) => {
      const a = r.parts[p].raiseAsYr, q = b.raiseAsYr;
      if (a === null || q === null || q === 0) return { ratio: null, multEq: null, cancel: null };
      return { ratio: a / q, multEq: a * q < 0 ? Math.abs(a / q) : null, cancel: a * q < 0 };
    };
    out.push({ id: r.id, src: r.src, sign, bgRaiseAsYr: b.raiseAsYr, S: one('S'), MS: one('MS'), magS: r.parts.S.magAsYr / b.magAsYr, magMS: r.parts.MS.magAsYr / b.magAsYr });
  }
  return out;
}
/** 表 5: (M) の正体 —— (W) の (M) と ½ A W_j n_orb ÷ (A + W_j)²・½ β n_orb(β = W_j ÷ A)・absVel の (M)・(C2) ÷ (W) */
export function mRows(T1, GEO) {
  return PLANETS.map((id) => {
    const m = L.partRot(T1, GEO, id, 'Sun', { part: 'M', read: 'W' }), mc = L.partRot(T1, GEO, id, 'Sun', { part: 'M', read: 'C2' }), ma = L.partRot(T1, GEO, id, 'Sun', { part: 'M', read: 'W', mut: 'absVel' });
    const A = m.A0, beta = m.wS / A, cl = L.closedM({ A, wS: m.wS, nOrb: m.nOrb }), half = 0.5 * beta * m.nOrb, mag = nrm(m.Om);
    return { id, beta, nOrbRadYr: m.nOrb * YR, MAsYr: mag * AY, closedRel: Math.abs(mag / cl - 1), halfBetaRel: Math.abs(mag / half - 1), toNorthCos: L.cosTo(m.nHat, m.Om), absVelAsYr: nrm(ma.Om) * AY, c2OverW: nrm(mc.Om) / mag };
  });
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nPar = L.PAIRS16.filter(([id, src]) => src !== 'Sun').length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 14,
    t1: J.dim.rows.length === DIM.A.length * DIM.d.length && J.dim.rows.every((r) => r.Msign === 1 && r.Ssign === -1 && r.Mrel < 1e-9 && r.Srel < 1e-9) && J.dim.pow.length === 3 && J.planetRatio.length === 8,
    t2: J.body.rows.length === (16 + nPar) * L.DECL.reads.length && J.body.bg.length === 16 * L.DECL.bgSigns.length && J.body.rows.every((r) => L.DECL.parts.every((p) => r.parts[p].magAsYr > 0)),
    t3: J.counts.length === L.DECL.reads.length * L.DECL.bgSigns.length * L.DECL.parts.length * 2 && J.counts.every((c) => c.hit + c.miss + c.undef === c.n),
    t4: J.bal.length === 16 * L.DECL.bgSigns.length,
    t5: J.mRows.length === 8 && J.mRows.every((r) => r.closedRel < 1e-9 && r.absVelAsYr === 0 && r.toNorthCos > 1 - 1e-12),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(); mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const dim = dimRows(), planetRatio = planetRatioRows(T1, GEO); mark('t1');
  const body = bodyRows(T1, GEO), counts = countRows(body), bal = balRows(body); mark('t2');
  const mr = mRows(T1, GEO); mark('t5');
  const J = { pure, dim, planetRatio, body, counts, bal, mRows: mr, pairs16: L.PAIRS16, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351c-srcparts.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351C_OUT ? (path.isAbsolute(process.env.W351C_OUT) ? process.env.W351C_OUT : path.join(ROOT, process.env.W351C_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便c srcparts(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351c-srcparts.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R429',
    decl: L.DECL, anchor: L.ANCHOR, dimDecl: DIM, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便c', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'srcparts', engine: 'Node(html を読まない —— 純関数の lib・第348便h・第350便b・第350便e・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

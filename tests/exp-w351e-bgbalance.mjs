// 第351便e(原仮定者の回答(2026-11-24 —— 第147報)「AN1009: B2で進める」・統括の検証項目 R431):
//   **背景軸引きずり (B2) を主に置いた全体の軸引きずりの回転 Ω = Ω_bg + Σ(局所の項 × k)を数える器 —— 入り方と分母(表 1)・合成の向きと率(表 2 —— 16 組 × 成分 3 × 倍率 6 × 向き 2 × 読み 2)・
//   「釣り合う」の 3 つの読み (甲)(乙)(丙)(表 3)・向きの幾何(表 4)・恒久の条件「金星で釣り合う」の読み直し(表 5)・(R3) の步の 2 例(表 6)・零試験 12**
//   (段 bgbalance-351e —— 正本 tests/out/bgbalance-351e.json・lib tests/lib-w351e-bgbalance.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便と本便の第 1 段の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351e-bgbalance.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。表を作る関数は器に置く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 言わないこと: 釣り合いの成否・予想の成否・背景の大きさの答えとは書かない(この成分・この読み・この倍率では、の表)。比べる数から背景の倍率を逆算して既定にしない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w351e-bgbalance.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as TL from './lib-w337c-tidelock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351e-bgbalance-1';
export const OUT_MAIN = 'tests/out/bgbalance-351e.json';
export const TARGET = 'tests/lib-w351e-bgbalance.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const YR = TL.YR, AS = 180 * 3600 / Math.PI, AY = YR * AS;
export const NOT_CLAIM = Object.freeze([
  '背景の倍率 u は宣言の格子(0・1・10・100・1e3・1e4)と、3 つの読みの式から出る値の表 —— 背景の大きさの答えではない(比べる数から逆算して既定にしていない)',
  '「釣り合う」の 3 つの読み (甲)(乙)(丙) は列で分けた —— どれかに決めていない', '第147報の予想の文に当たる行の数は数だけ(予想の成否ではない)',
  '恒久の条件「金星で釣り合う」と第147報の文の関係は寄せていない(決断事項の候補)', '起こす率は経路 ① だけ・係数 1 の一次の率 —— 経路の比率 f・トルクの式の自転速度の比は表 6 の步だけ',
  '局所の分母の列 out・in の主の列は決めていない', 'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
export const PLAN = Object.freeze({ pure: '零試験 12((B2) は W₀ に依らない・(B1) は在位の形で 0・背景 = uVec・k は局所だけ〔本便の枝 b の applyK と同じ合計〕・u 0 と k 0 で決まらない・二度数え・起こす率の線形・(甲) の根・(乙) の閉じた形 = 弧の最小の角・向きの幾何・eqAxis = composeBal・共通の点検の数・拒否)',
  t1: '入り方と分母: 16 組 × 由来 × 成分 3((C2)・in と out の大きさの差と角)+ (B1) の取り分 1 − f(W₀ 0・W₀ = 自分の重み)', t2: '16 組 × 読み 2 × 成分 3 × 向き 2 × 倍率 6(合成の向き・δ・起こす率の和と内訳・歳差の率 2 つ)',
  t3: '「釣り合う」の 3 つの読み(16 組 × 読み 2 × 成分 3 × 向き 2)と第147報の文に当たる行の数', t4: '向きの幾何(8 惑星 × 成分 3 × 向き 2 —— 2 本のベクトルの弧の範囲・面から外れる角)',
  t5: '金星で (甲)・(丙) を満たす u(成分 3)を 16 組に当てた表', t6: '地球と金星 × 成分 3 × (甲)(丙) の u × f 0・0.5・1 の步((N1)・無次元の時間 10)' });

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const ay = (x) => (x === null ? null : x * AY);
const sgn = (x) => (x === null ? 0 : x > 0 ? 1 : x < 0 ? -1 : 0);
const PL = L.DECL.planets;

/* ───────── 表 1: 入り方と分母 ───────── */
export function denRows(T1, GEO, cache) {
  const rows = [], incl = [];
  for (const [id, src] of SP.PAIRS16) {
    const o = L.localOf(T1, GEO, id, src, { read: 'C2', den: 'out' }, cache), i = L.localOf(T1, GEO, id, src, { read: 'C2', den: 'in' }, cache);
    for (const origin of ['sun', 'parent']) {
      if (!o[origin]) continue;
      const parts = Object.fromEntries(L.DECL.parts.map((p) => [p, { relInOut: nrm(i[origin][p]) / nrm(o[origin][p]) - 1, angDeg: L.angDeg(i[origin][p], o[origin][p]) }]));
      rows.push({ id, src, origin, parts, wGalOverSun: o.wGal / o.wSun });
    }
    const A0 = L.selfA0(T1, GEO, id, src), box = A0 + o.wSun + o.wPar;
    incl.push({ id, src, coefW0: L.DECL.w0kGrid.map((w0k) => L.bgTerm(id, { u: 1, incl: 'B1', w0k, A0, box }).coef), wGalOverBox: o.wGal / box });
  }
  return { rows, incl };
}

/* ───────── 表 2: 合成の向きと率 ───────── */
export function balRows(T1, GEO, cache) {
  const rows = [];
  for (const [id, src] of SP.PAIRS16) for (const read of L.DECL.reads) for (const part of L.DECL.parts) for (const sign of L.DECL.signs) for (const u of L.DECL.uGrid) {
    const R = L.totalOm(T1, GEO, { id, src, part, read, u, sign }, cache), s = L.rowStats(R);
    rows.push({ id, src, read, part, sign, u, deltaDeg: s.deltaDeg, toNorthDeg: R.eq ? L.angDeg(R.eq, R.nHat) : null, undetermined: R.eq === null,
      raiseBg: ay(s.raiseBg), raiseSun: ay(s.raiseSun), raiseParent: ay(s.raiseParent), raiseSum: ay(s.raiseSum), precMag: ay(s.precMag), precCone: ay(s.precCone), cosOm: s.cosOm });
  }
  return rows;
}

/* ───────── 表 3: 「釣り合う」の 3 つの読み ───────── */
export function readRows(T1, GEO, cache) {
  const rows = [];
  for (const [id, src] of SP.PAIRS16) for (const read of L.DECL.reads) for (const part of L.DECL.parts) for (const sign of L.DECL.signs) {
    const R = L.totalOm(T1, GEO, { id, src, part, read, u: 1, sign }, cache), s = L.rowStats(R), b1 = R.bg;
    const rl = s.raiseSun === null ? null : s.raiseSun + (s.raiseParent || 0), uK = s.raiseBg === null || rl === null ? null : L.uStarRaise(s.raiseBg, rl);
    const D = L.deltaMin(R.sHat, R.local, b1), uH = L.uEqMag(R.sun, b1);
    const epsDeg = L.angDeg(R.sHat, R.nHat);
    rows.push({ id, src, read, part, sign, epsDeg, raiseBg1: ay(s.raiseBg), raiseLocal: ay(rl), raiseUndef: s.raiseBg === null || rl === null, uKou: uK, kouNone: !(s.raiseBg === null || rl === null) && uK === null,
      uOtsu: D.uBest === Infinity ? 'inf' : D.uBest, deltaMinDeg: D.deltaMinDeg, delta0Deg: D.delta0Deg, deltaInfDeg: D.deltaInfDeg, uHei: uH,
      hit147: s.raiseBg !== null && s.raiseSun !== null && s.raiseBg > 0 && s.raiseSun < 0 });
  }
  return rows;
}
export function countRows(RR) {
  const out = [];
  for (const read of L.DECL.reads) for (const sign of L.DECL.signs) for (const part of L.DECL.parts) for (const scope of ['planets', 'all']) {
    const rs = RR.filter((r) => r.read === read && r.sign === sign && r.part === part && (scope === 'all' || (r.src === 'Sun' && PL.includes(r.id))));
    out.push({ read, sign, part, scope, n: rs.length, hit: rs.filter((r) => r.hit147).length, kou: rs.filter((r) => r.uKou !== null).length, kouNone: rs.filter((r) => r.kouNone).length, undef: rs.filter((r) => r.raiseUndef).length,
      otsuZero: rs.filter((r) => r.deltaMinDeg === 0).length });
  }
  return out;
}

/* ───────── 表 4: 向きの幾何 ───────── */
export function geoRows(T1, GEO, cache) {
  const rows = [];
  for (const id of PL) for (const sign of L.DECL.signs) {
    const Lc = L.localOf(T1, GEO, id, 'Sun', { read: 'C2', den: 'out' }, cache), b = L.bgTerm(id, { u: 1, sign }).vec, n = Lc.nHat, s = Lc.sHat;
    for (const part of L.DECL.parts) {
      const a = Lc.sun[part], ar = L.arcRange(n, b, a), eps = L.angDeg(s, n);
      rows.push({ id, sign, part, bgToNorthDeg: L.angDeg(b, n), sunToNorthDeg: L.angDeg(a, n), minDeg: ar.minDeg, maxDeg: ar.maxDeg, gammaDeg: ar.gammaDeg, epsDeg: eps,
        inRange: eps >= ar.minDeg - 1e-9 && eps <= ar.maxDeg + 1e-9, planeOffDeg: L.planeOffDeg(s, b, a), arcDistDeg: L.arcDistDeg(s, a, b) });
    }
  }
  return rows;
}

/* ───────── 表 5: 金星の u を全部の組に ───────── */
export function venusRows(T1, GEO, cache, RR) {
  const vu = [], rows = [], main = (r) => r.read === L.DECL.mainRead && r.sign === L.DECL.mainSign;
  for (const part of L.DECL.parts) {
    const v = RR.find((r) => main(r) && r.part === part && r.id === 'Venus' && r.src === 'Sun');
    vu.push({ part, uKou: v.uKou, uHei: v.uHei, raiseBg1: v.raiseBg1, raiseLocal: v.raiseLocal });
    for (const kind of ['kou', 'hei']) {
      const uV = kind === 'kou' ? v.uKou : v.uHei;
      if (uV === null) continue;
      for (const [id, src] of SP.PAIRS16) {
        const R = L.totalOm(T1, GEO, { id, src, part, u: uV }, cache), s = L.rowStats(R), r = RR.find((x) => main(x) && x.part === part && x.id === id && x.src === src);
        const ratio = nrm(R.sun) / nrm(R.bg), scale = s.raiseBg === null ? null : Math.abs(s.raiseBg) + Math.abs(s.raiseSun) + Math.abs(s.raiseParent || 0);
        rows.push({ part, kind, uV, id, src, sunOverBg: ratio, side: Math.abs(ratio - 1) < 1e-9 ? 'eq' : ratio > 1 ? 'sun' : 'bg', raiseSum: ay(s.raiseSum), raiseSumRel: scale ? s.raiseSum / scale : null, deltaDeg: s.deltaDeg,
          kouOverV: r.uKou === null ? null : r.uKou / uV, heiOverV: r.uHei === null ? null : r.uHei / uV, class337c: L.DECL.class337c[id] && src === 'Sun' ? L.DECL.class337c[id] : null });
      }
    }
  }
  return { vu, rows };
}

/* ───────── 表 6: (R3) の步の 2 例 ───────── */
export function stepRows(T1, GEO, cache, RR) {
  const rows = [], main = (r) => r.read === L.DECL.mainRead && r.sign === L.DECL.mainSign;
  for (const [id, src] of L.DECL.stepBodies) for (const part of L.DECL.parts) {
    const r = RR.find((x) => main(x) && x.part === part && x.id === id && x.src === src);
    for (const [kind, u] of [['kou', r.uKou], ['hei', r.uHei]]) {
      if (u === null) continue;
      const R = L.totalOm(T1, GEO, { id, src, part, u }, cache);
      for (const f of L.DECL.fShow) { const S = L.stepRun(R.sHat, R.nHat, R.Om, f); rows.push({ id, src, part, kind, u, ...S, eqToNorthDeg: R.eq ? L.angDeg(R.eq, R.nHat) : null, magAsYr: nrm(R.Om) * AY }); }
    }
  }
  return rows;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const n16 = SP.PAIRS16.length, nPar = SP.PAIRS16.filter(([, s]) => s !== 'Sun').length, nR = L.DECL.reads.length, nP = L.DECL.parts.length, nS = L.DECL.signs.length, nU = L.DECL.uGrid.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.den.rows.length === n16 + nPar && J.den.incl.length === n16 && J.den.incl.every((r) => r.coefW0[0] === 0 && r.coefW0[1] > 0 && r.coefW0[1] < 1),
    t2: J.bal.length === n16 * nR * nP * nS * nU && J.bal.filter((r) => r.undetermined).length === 0,
    t3: J.reads.length === n16 * nR * nP * nS && J.counts.length === nR * nS * nP * 2 && J.counts.every((c) => c.kou + c.kouNone + c.undef === c.n),
    t4: J.geo.length === 8 * nS * nP && J.geo.every((r) => r.minDeg <= r.maxDeg && Math.abs(r.arcDistDeg - (J.reads.find((x) => x.id === r.id && x.src === 'Sun' && x.read === 'C2' && x.part === r.part && x.sign === r.sign).deltaMinDeg)) < 1e-6),
    t5: J.venus.vu.length === nP && J.venus.rows.length === n16 * J.venus.vu.reduce((t, v) => t + (v.uKou !== null) + (v.uHei !== null), 0),
    t6: J.steps.length > 0 && J.steps.every((r) => r.lenErr < 1e-12),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const den = denRows(T1, GEO, cache); mark('t1');
  const bal = balRows(T1, GEO, cache); mark('t2');
  const reads = readRows(T1, GEO, cache), counts = countRows(reads); mark('t3');
  const geo = geoRows(T1, GEO, cache); mark('t4');
  const venus = venusRows(T1, GEO, cache, reads); mark('t5');
  const steps = stepRows(T1, GEO, cache, reads); mark('t6');
  const J = { pure, den, bal, reads, counts, geo, venus, steps, pairs16: SP.PAIRS16, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351e-bgbalance.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351E_OUT ? (path.isAbsolute(process.env.W351E_OUT) ? process.env.W351E_OUT : path.join(ROOT, process.env.W351E_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便e bgbalance(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351e-bgbalance.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R431',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便e', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'bgbalance', engine: 'Node(html を読まない —— 純関数の lib・本便の枝 b・c・d と第350便e・第347便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

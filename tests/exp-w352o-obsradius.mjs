// 第352便o(原仮定者の回答(2026-11-24 —— 第148報)AN1015・AN1019・AN1026・原仮定者の補足(2026-11-14 —— 第138報の補足 1)・原仮定者の回答(2026-11-18 —— 第141報 AN790)・統括の検証項目 R452):
//   **(S) の源の半径を「規則の半径」と「観測の半径」の 2 列で(形 M1〔在位〕・q 1.2・q 0〔比べる列〕と組にして)、本便の主な表を同じ重さで数え直す器 ——
//   表 1 主の表(8 惑星 + 太陽 × (N+)(G−) × L・eq × (g2±) × (uV) —— 合成の率と一周・基準軸の角・円錐)と、規則の半径の列との差/表 2 金星の打ち消し(大きさが同じ・合成が最小)/
//   表 3 倍率 1 の背景と要る k・そのときの地球・火星・太陽の率(仮の比べる数に要る倍 —— 仮・未照合)/表 4 太陽を受け手に(惑星の源の半径と形)/表 5 衛星(母天体の源の半径)**
//   (段 obsradius-352o —— 正本 tests/out/obsradius-352o.json・lib tests/lib-w352o-obsradius.mjs)。
//   **診断だけ** —— (S) の強さ・係数・源の半径の置き方を決めない。エンジン・内蔵の本・受理器・前の便の lib の本文と正本と段は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352o-obsradius.mjs —— 領域の宣言なし)。入力のファイルなし。1 プロセス。正本は第338便c の settleRun で書く。
// 仮の値は第352便b の lib の prov() に在る数だけ(表 3 の比べる列)—— 正本の最上位に provisional: true と使った鍵の一覧を持つ。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。
// ■ 判定の物差し(零試験 10): 既定で〔第351便e〕localOf・〔第352便e〕sunLocal・rotOf・〔第352便j〕cellOf と同じ/〔第352便k〕の表の数/源の半径の 2 乗/q0 の不変/金星の 2 つの読み/k/変異/拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as L from './lib-w352o-obsradius.mjs';
import * as MJ from './lib-w352j-maintable.mjs';
import * as PS from './lib-w352d-precsense.mjs';
import * as BB from './lib-w351e-bgbalance.mjs';
import * as K from './lib-w352k-spinform.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352o-obsradius-1';
export const OUT_MAIN = 'tests/out/obsradius-352o.json';
export const TARGET = 'tests/lib-w352o-obsradius.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
/** 表 3 の比べる列に使う仮の値の鍵(第352便b の台帳) */
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'mars.prec.rate']);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '(S) の強さ・源の半径の置き方・源の回転の形・換算の係数 k は決めていない(どの列も候補の表)',
  '規則の半径(在位 —— 球のモーメント・K1)の列は残してある —— 既定の形は変えていない',
  '表 3 の仮の比べる数は「仮・未照合」—— 届くのに要る倍は数だけで、較正の合否・サンプルの状況・ノブの採否に入れない',
  '金星の残りは打ち消しの度合いの数だけ —— 金星の自転の逆回転の説明とは書かない',
  '「銀河由来も (S) だけなら弱い」は予想の文として扱う(本表は (S) の大きさの列を並べただけ)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
export const PLAN = Object.freeze({ pure: '零試験 10', cols: '列 6: 源の半径 {規則・観測} × 形 {M1(在位)・q1.2・q0(比べる列)}',
  t1: '表 1: 列 6 × 行 9(8 惑星 + 太陽)× 背景の向き 2 × 基準軸 2 × 歳差の向き 2 —— 背景の大きさ = その列の (uV)', diff: '差の表: 形 3 × 行 9 × 背景の向き 2 × 基準軸 2(観測 − 規則)',
  t2: '表 2: 列 6 × 背景の向き 3((N+) L・(N+) eq・(G−))× 読み 2(大きさが同じ・合成が最小)', t3: '表 3: 列 6 × 背景の向き 2 × 基準軸 2 × 受け手 3(倍率 1・k = 1 ÷ (uV))',
  t4: '表 4: 列 6 —— 太陽を受け手に(惑星由来の (S) の和 ÷ 背景・円錐)', t5: '表 5: 列 6 × 衛星 5((N+) L・(uV))', prov: '表 3 の比べる列: 地球の歳差の率・火星の歳差の率(仮・未照合)' });

const r9 = (x) => (Number.isFinite(x) ? x : null);
const sg = (x) => (x === null ? null : x > 0 ? 1 : x < 0 ? -1 : 0);
/* ───────── 表 ───────── */
export function tables(T1 = E.t1Table(), GEO = E.geometry()) {
  const D = L.DECL, caches = Object.fromEntries(L.COLS.map((c) => [c.id, {}])), omG = nrmV(BB.bgTerm('Venus', { u: 1 }).vec);
  const uV = Object.fromEntries(L.COLS.map((c) => [c.id, L.uVenusO(T1, GEO, c, caches[c.id])]));
  // 表 1
  const t1 = [];
  for (const c of L.COLS) for (const key of D.rows) for (const bg of D.bgs) for (const axis of D.axes) for (const sense of D.senses) {
    const x = L.cellO(T1, GEO, key, { bg, axis, sense, u: uV[c.id], tSrc: c.tSrc, form: c.form }, caches[c.id]);
    t1.push({ col: c.id, key, bg, axis, sense, omAsYr: x.omAsYr, periodYr: 1296000 / x.omAsYr, locOverBg: x.locAsYr / x.bgAsYr, refDeg: x.refDeg, coneDeg: x.coneDeg,
      azOm: x.az.om === null ? null : x.az.om * L.ASYR, azRef: x.az.ref === null ? null : x.az.ref * L.ASYR, azOrb: x.az.orb === null ? null : x.az.orb * L.ASYR, azEcl: x.az.ecl === null ? null : x.az.ecl * L.ASYR, spin: x.spin });
  }
  // 差の表(観測 − 規則・(g2−)・形ごと)
  const diff = [];
  for (const form of D.forms) for (const key of D.rows) for (const bg of D.bgs) for (const axis of D.axes) {
    const pick = (t) => t1.find((r) => r.col === (t ? 'O-' : 'R-') + form && r.key === key && r.bg === bg && r.axis === axis && r.sense === 'g2m');
    const a = pick(0), b = pick(1), poles = ['azOm', 'azRef', 'azOrb', 'azEcl'];
    diff.push({ form, key, bg, axis, dRef: b.refDeg - a.refDeg, dCone: b.coneDeg - a.coneDeg, rateRatio: b.omAsYr / a.omAsYr, locRatio: b.locOverBg / a.locOverBg,
      flips: poles.filter((p) => a[p] !== null && b[p] !== null && sg(a[p]) !== sg(b[p])) });
  }
  // 表 2(金星の 2 つの読み)
  const bH = { NpL: MJ.axisOf('L', T1, GEO), NpEq: MJ.axisOf('eq', T1, GEO), Gm: PS.bgDir('Gm') }, t2 = [];
  for (const c of L.COLS) { const S = L.localS(T1, GEO, 'Venus|Sun', c, caches[c.id]).sun.S;
    for (const b of ['NpL', 'NpEq', 'Gm']) t2.push({ col: c.id, bg: b, ...L.venusTwo(bH[b], S, omG) }); }
  // 表 3(倍率 1・k = 1 ÷ (uV))
  const wantE = Math.abs(PV.toRH('earth.psiA.rate')), wantM = Math.abs(PV.toRH('mars.prec.rate')), t3 = [];
  for (const c of L.COLS) { const kNeed = 1 / uV[c.id], ckk = {};
    for (const bg of D.bgs) for (const axis of D.axes) { const row = { col: c.id, bg, axis, kNeed, rates: {} };
      for (const key of D.t3Bodies) { const x = L.cellO(T1, GEO, key, { bg, axis, sense: 'g2m', u: 1, tSrc: c.tSrc, form: c.form, k: kNeed }, ckk); row.rates[key] = { asYr: x.omAsYr, periodYr: 1296000 / x.omAsYr, coneDeg: x.coneDeg, refDeg: x.refDeg }; }
      row.needEarth = wantE / row.rates['Earth|Sun'].asYr; row.needMars = wantM / row.rates['Mars|Sun'].asYr; t3.push(row); } }
  // 表 4(太陽を受け手に)
  const t4 = [];
  for (const c of L.COLS) { const S = L.localS(T1, GEO, 'Sun|-', c, caches[c.id]), bgMag = uV[c.id] * omG, big = D.planets.reduce((b, id) => (b === null || nrmV(S.byPlanet[id]) > nrmV(S.byPlanet[b]) ? id : b), null);
    const cone = (bg, axis, mut) => L.cellO(T1, GEO, 'Sun|-', { bg, axis, sense: 'g2m', u: uV[c.id], tSrc: c.tSrc, form: c.form, mut }, caches[c.id]).coneDeg;
    t4.push({ col: c.id, sumAsYr: nrmV(S.sun.S) * L.ASYR, bgAsYr: bgMag * L.ASYR, sumOverBg: nrmV(S.sun.S) / bgMag, big, bigShare: nrmV(S.byPlanet[big]) / nrmV(S.sun.S),
      coneNpL: cone('Np', 'L', null), dConeNpL: cone('Np', 'L', null) - cone('Np', 'L', 'noLocal'), coneGm: cone('Gm', 'L', null), dConeGm: cone('Gm', 'L', null) - cone('Gm', 'L', 'noLocal') }); }
  // 表 5(衛星)
  const t5 = [];
  for (const c of L.COLS) for (const key of D.sats) { const Lc = L.localS(T1, GEO, key, c, caches[c.id]), bgMag = uV[c.id] * omG, par = Lc.parent.S, sun = Lc.sun.S;
    const cel = (bg, axis) => L.cellO(T1, GEO, key, { bg, axis, sense: 'g2m', u: uV[c.id], tSrc: c.tSrc, form: c.form }, caches[c.id]);
    const nL = cel('Np', 'L'), nE = cel('Np', 'eq'), gm = cel('Gm', 'L');
    t5.push({ col: c.id, key, parOverSun: nrmV(par) / nrmV(sun), parOverBg: nrmV(par) / bgMag, cosParS: dotV(Lc.sHat, par) / nrmV(par),
      totNpL: nL.omAsYr / nL.bgAsYr, totNpEq: nE.omAsYr / nE.bgAsYr, totGm: gm.omAsYr / gm.bgAsYr, coneNpL: nL.coneDeg, refNpL: nL.refDeg }); }
  return { uV, omG, t1, diff, t2, t3, t4, t5 };
}
const nrmV = (a) => Math.hypot(a[0], a[1], a[2]), dotV = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** 要点(差の表の最大・最小) */
export function summaryOf(T) {
  const D = L.DECL, sum = {};
  for (const form of D.forms) {
    const ds = T.diff.filter((r) => r.form === form), planets = ds.filter((r) => r.key !== 'Sun|-'), sun = ds.filter((r) => r.key === 'Sun|-');
    const mx = (rs, f) => Math.max(...rs.map((r) => Math.abs(f(r))));
    sum[form] = { planetsMaxDRef: mx(planets, (r) => r.dRef), planetsMaxDCone: mx(planets, (r) => r.dCone), planetsRateLo: Math.min(...planets.map((r) => r.rateRatio)), planetsRateHi: Math.max(...planets.map((r) => r.rateRatio)),
      planetsFlips: planets.reduce((s, r) => s + r.flips.length, 0), sunMaxDCone: mx(sun, (r) => r.dCone), sunRate: sun.map((r) => r.rateRatio) };
  }
  return sum;
}
/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL, nC = L.COLS.length, nR = D.rows.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    t1: J.t1.length === nC * nR * 2 * 2 * 2 && J.t1.every((r) => r.omAsYr > 0 && Number.isFinite(r.coneDeg) && Math.abs(r.periodYr * r.omAsYr / 1296000 - 1) < 1e-12),
    diff: J.diff.length === D.forms.length * nR * 2 * 2 && J.diff.filter((r) => r.form === 'q0').every((r) => Math.abs(r.dRef) < 1e-9 && Math.abs(r.rateRatio - 1) < 1e-9),
    t2: J.t2.length === nC * 3 && J.t2.every((r) => r.residMag >= 0 && r.uMag > 0),
    t3: J.t3.length === nC * 4 && J.t3.every((r) => Math.abs(r.kNeed * J.uV[r.col] - 1) < 1e-12),
    t4: J.t4.length === nC && J.t4.every((r) => r.sumOverBg > 0),
    t5: J.t5.length === nC * D.sats.length,
    prov: J.provisional === true && JSON.stringify(J.provKeys) === JSON.stringify([...PROV_KEYS].sort()),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PSc = L.pureScenes(), pure = { scenes: PSc, gates: L.pureGates(PSc) }; mark('pure');
  const T = tables(); mark('tables');
  const summary = summaryOf(T); mark('summary');
  const J = PV.tagProv({ pure, uV: T.uV, omG: T.omG, t1: T.t1, diff: T.diff, t2: T.t2, t3: T.t3, t4: T.t4, t5: T.t5, summary, timing: tm }, [...PROV_KEYS]);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352o-obsradius.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352O_OUT ? (path.isAbsolute(process.env.W352O_OUT) ? process.env.W352O_OUT : path.join(ROOT, process.env.W352O_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便o obsradius(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352o-obsradius.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R452',
    decl: L.DECL, cols: L.COLS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便o', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'obsradius', engine: 'Node(html を読まない —— 純関数の lib: 〔第352便k〕の (S) の形と源の半径・〔第352便j〕の主の表のセル・〔第352便d〕の背景と歳差の向き・〔第352便e〕の太陽を受け手に・〔第352便b〕の仮の値)・入力のファイルなし・1 プロセス',
    notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

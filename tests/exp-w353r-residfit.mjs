// 第353便r(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R482):
//   **歳差の率の残りを軸引きずりで読む列の器 —— 表 1 要る応答の係数の区間(地球 × 月の道 3 × 離心率の倍 2・火星と金星 × 離心率の倍 2 × 入力の幅の置き方 2)/
//   表 1b 地球と火星の区間の重なり(共通の値 X = c × u の範囲)/表 2 共通の値の帰結(背景の倍率・傾きを保つ f の上限・太陽の歳差の周・要る応答の係数・構造の量の式の候補・予告の率)/
//   表 3 残りが 0 と区別できるか(重力の側の基準の列の置き方ごとの軸引きずりに残る余地)・零試験 9**
//   (段 residfit-353r —— 正本 tests/out/residfit-353r.json・lib tests/lib-w353r-residfit.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353r-residfit.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 歳差の率の残りが軸引きずりで読み切れたとは書かない・応答の係数の値を 1 つに置かない。重力の側の列は比べる列(DFM の式ではない)。仮の値を使う行は合否にしない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w353r-residfit.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353r-residfit-1';
export const OUT_MAIN = 'tests/out/residfit-353r.json';
export const TARGET = 'tests/lib-w353r-residfit.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']);
export const NOT_CLAIM = Object.freeze([
  '要る応答の係数の区間の表 —— 歳差の率の残りが軸引きずりで読み切れたとは書かない・応答の係数の値を 1 つに置かない(この入力・この置き方・このノブでは、の数)',
  '重力の側の列(第352便u の (T-g))は比べる列 —— DFM の式ではない。残り(仮の値 − 重力の列)は仮・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  '入力の幅は、リポジトリの数の最後の桁 ±1 と仮の値の 1σ(と宣言の角の幅 0.01°)の上下の振れの大きい方の和 —— 外の数は使っていない(離心率は第299便c・第330便b の器の入力 —— 文献の値・未照合)',
  '共通の値 X = c × u は 2 天体の区間の重なりの数え上げ —— 背景の倍率と応答の係数のどちらにも寄せない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 9(要る c = 第353便m の earthFill〔4 つの置き方〕・第353便f の sumRow〔火星・金星〕・幅 = 第353便m の widthParts と digitSwing・離心率 = 第299便c・区間の算術・上限 = 第353便f の cUpper・重なり・統括の数え直し 3・傾きを保つ f の上限 = 第353便e・拒否)',
  t1: '表 1: 地球 × 月の道 3(fixed・ecl・avg)× 離心率の倍 2(none・repo)/火星・金星 × 離心率の倍 2 —— それぞれ入力の幅の置き方 2(digit・all)。u 0.98・(g2−)・(N+) L・(S) 規則の半径・c 1 の方位の率で、残り・幅の内訳・要る c とその区間・X = c × u の区間・区間が 0 を含むか',
  t1pair: '表 1b: 地球の 6 行 × 火星の 2 行 × 幅の置き方 2 —— X の区間の重なり・要る c の比(地球 ÷ 火星)の中心と区間',
  t2: '表 2: 共通の値 X(主の 2 組〔18.6 年の平均 × 円・18.6 年の平均 + 離心率の倍 × 離心率の倍〕の重なりの下端・中・上端)—— c 1 のときの背景の倍率と窓の上端との比・傾きを保つ f の上限(太陽・地球・火星・木星)・太陽の歳差の一周と年齢の内の周の数・u 0.98 のときの要る c・金星の X の区間に入るか・予告の率(水星・木星・土星 —— 比べる数なし)',
  t2cand: '表 2b: 構造の量の式の候補 (イ)(ウ)(ウ′) と (P-応) の率の倍で、地球 ÷ 火星の比が要る c の比の区間に入るか(主の 2 組 × 幅 digit)',
  t3: '表 3: 地球の残り × 重力の側の基準の列の置き方 6(月の道 3 × 離心率の倍 2)—— 幅・0 と区別できるか・軸引きずりに残る余地(abs(残り) + 幅)・要る c の上限' });

const RD = Object.freeze({ moons: L.DECL.moonModes, eccs: L.DECL.eModes, perts: Object.freeze(['digit', 'all']), u: L.DECL.uMain,
  mainPairs: Object.freeze([Object.freeze(['avg', 'none', 'none']), Object.freeze(['avg', 'repo', 'repo'])]), xPick: Object.freeze(['lo', 'mid', 'hi']),
  previews: L.DECL.previewBodies });
export const ROWDECL = RD;
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const pick = (rows, id, moon, ecc, pert) => rows.find((r) => r.id === id && (id !== 'Earth' || r.moon === moon) && r.ecc === ecc && r.pert === pert);

/* ───────── 表 1: 要る c の区間 ───────── */
const slim = (r) => ({ id: r.id, moon: r.moon, ecc: r.ecc, pert: r.pert, u: r.u, grav: r.grav, prov: r.prov, resid: r.resid, drag1: r.drag1, cNeed: r.cNeed, parts: r.parts, width: r.width,
  cLo: r.cLo, cHi: r.cHi, x: r.x, xLo: r.xLo, xHi: r.xHi, inWidth: r.inWidth, cUpper: r.cUpper, fill: r.fill });
export function needRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const moon of RD.moons) for (const ecc of RD.eccs) for (const pert of RD.perts) { const r = L.needC('Earth', { u: RD.u, moon, ecc, pert }, o); rows.push(PV.tagProv(slim(r), r.provKeys)); }
  for (const id of ['Mars', 'Venus']) for (const ecc of RD.eccs) for (const pert of RD.perts) { const r = L.needC(id, { u: RD.u, ecc, pert }, o); rows.push(PV.tagProv(slim(r), r.provKeys)); }
  return PV.tagProv({ rows }, PROV_KEYS.slice());
}
export function pairRows(t1) {
  const rows = [];
  for (const moon of RD.moons) for (const eE of RD.eccs) for (const eM of RD.eccs) for (const pert of RD.perts) {
    const e = pick(t1.rows, 'Earth', moon, eE, pert), m = pick(t1.rows, 'Mars', null, eM, pert), p = L.pairOf(e, m);
    rows.push(PV.tagProv({ moon, eccE: eE, eccM: eM, pert, xE: [e.xLo, e.xHi], xM: [m.xLo, m.xHi], both: p.both, ratio: p.ratio, ratioLo: p.ratioLo, ratioHi: p.ratioHi, gapRel: p.gapRel, main: eE === eM }, ['earth.psiA.rate', 'mars.prec.rate']));
  }
  return PV.tagProv({ rows }, ['earth.psiA.rate', 'mars.prec.rate']);
}
/* ───────── 表 2: 共通の値の帰結 ───────── */
export function commonRows(T1, GEO, cache, t1, tp) {
  const o = { T1, GEO, cache }, rows = [], v = pick(t1.rows, 'Venus', null, 'none', 'digit');
  for (const [moon, eE, eM] of RD.mainPairs) {
    const p = tp.rows.find((r) => r.moon === moon && r.eccE === eE && r.eccM === eM && r.pert === 'digit');
    for (const k of RD.xPick) {
      const X = k === 'lo' ? p.both[0] : k === 'hi' ? p.both[1] : 0.5 * (p.both[0] + p.both[1]), A = L.atCommon(X, o);
      const prev = Object.fromEntries(RD.previews.concat(['Venus']).map((id) => { const q = L.previewAt(id, X, o); return [id, { drag: q.drag, grav: q.grav, ratio: q.ratio }]; }));
      rows.push(PV.tagProv({ moon, eccE: eE, eccM: eM, pick: k, X, inWin: A.inWin, overWinTop: A.overWinTop, fMax: A.fMax, sunPeriodYr: A.sunPeriodYr, sunTurnsAge: A.sunTurnsAge, cAtU098: A.cAtU098,
        venusIn: X >= v.xLo && X <= v.xHi, venusXHi: v.xHi, prev }, ['earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']));
    }
  }
  return PV.tagProv({ rows }, PROV_KEYS.slice());
}
export function candRows(T1, GEO, cache, t1) {
  const o = { T1, GEO, cache }, rows = [];
  for (const [moon, eE, eM] of RD.mainPairs) {
    const e = pick(t1.rows, 'Earth', moon, eE, 'digit'), m = pick(t1.rows, 'Mars', null, eM, 'digit'), p = L.pairOf(e, m);
    for (const c of L.candFit(e, m, o)) rows.push(PV.tagProv({ moon, eccE: eE, eccM: eM, cand: c.cand, label: c.label, vE: c.vE, vM: c.vM, ratio: c.ratio, inside: c.inside, ratioLo: p.ratioLo, ratioHi: p.ratioHi, scaleE: c.scaleE },
      ['earth.psiA.rate', 'mars.prec.rate']));
  }
  return PV.tagProv({ rows }, ['earth.psiA.rate', 'mars.prec.rate']);
}
/* ───────── 表 3: 残りが 0 と区別できるか ───────── */
export function zeroRows(t1) {
  const rows = [];
  for (const moon of RD.moons) for (const ecc of RD.eccs) {
    const r = pick(t1.rows, 'Earth', moon, ecc, 'digit');
    rows.push(PV.tagProv({ moon, ecc, resid: r.resid, width: r.width, distinct: !r.inWidth, room: Math.abs(r.resid) + r.width, cUpper: r.cUpper, fill: r.fill, drag1: r.drag1 }, ['earth.psiA.rate']));
  }
  const rm = rows.map((r) => r.room), rs = rows.map((r) => Math.abs(r.resid));
  return PV.tagProv({ rows, roomSpread: Math.max(...rm) / Math.min(...rm), residSpread: Math.max(...rs) / Math.min(...rs) }, ['earth.psiA.rate']);
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const n1 = RD.moons.length * RD.eccs.length * RD.perts.length + 2 * RD.eccs.length * RD.perts.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 9,
    provTop: J.provisional === true && JSON.stringify(J.provKeys) === JSON.stringify(PROV_KEYS) && ['t1', 't1pair', 't2', 't2cand', 't3'].every((k) => J[k].provisional === true),
    t1: J.t1.rows.length === n1 && J.t1.rows.every((r) => fin(r.cNeed) && r.cLo <= r.cNeed && r.cNeed <= r.cHi && r.provisional === true && r.inWidth === (r.cLo <= 0 && r.cHi >= 0)),
    t1pair: J.t1pair.rows.length === RD.moons.length * RD.eccs.length * RD.eccs.length * RD.perts.length && J.t1pair.rows.every((r) => (r.both === null) === (r.gapRel > 0)),
    t2: J.t2.rows.length === RD.mainPairs.length * RD.xPick.length && J.t2.rows.every((r) => fin(r.X) && r.X > 0 && fin(r.sunPeriodYr) && Object.keys(r.prev).length === RD.previews.length + 1),
    t2cand: J.t2cand.rows.length === RD.mainPairs.length * (L.DECL.cands.length + 1) && J.t2cand.rows.every((r) => fin(r.ratio)),
    t3: J.t3.rows.length === RD.moons.length * RD.eccs.length && J.t3.rows.every((r) => r.distinct === (Math.abs(r.resid) > r.width)) && fin(J.t3.roomSpread),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = L.pureScenes(T1, GEO), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const t1 = needRows(T1, GEO, cache); mark('t1');
  const t1pair = pairRows(t1); mark('t1pair');
  const t2 = commonRows(T1, GEO, cache, t1, t1pair); mark('t2');
  const t2cand = candRows(T1, GEO, cache, t1); mark('t2cand');
  const t3 = zeroRows(t1); mark('t3');
  const J = { pure, t1, t1pair, t2, t2cand, t3, timing: tm, provisional: true, provKeys: PROV_KEYS.slice() };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  delete J.provisional; delete J.provKeys;
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353r-residfit.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353R_OUT ? (path.isAbsolute(process.env.W353R_OUT) ? process.env.W353R_OUT : path.join(ROOT, process.env.W353R_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便r residfit(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK, version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w353r-residfit.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R482', decl: L.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便r', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'residfit', engine: 'Node(html を読まない —— 純関数の lib・第353便m・f・e・c・第352便q・y・u・c・b・第299便c の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

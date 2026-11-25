// 第353便m(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R477):
//   **歳差の率の残りの符号が入力と定義の幅で替わるかを数える器 —— 表 1 地球の残りの符号(月の道の置き方 3 × 慣性モーメントの係数の置き方 2 × 離心率の倍 2・最後の桁の振れ)・
//   表 1b 交点の経度の走査・表 2 金星の極 5 × ŝ の向き 2 × 仮の値の回る向き 2・表 3 要る応答の係数の並び(構造の量の式の候補・(P-応) の率の倍)・零試験 10**
//   (段 residsign-353m —— 正本 tests/out/residsign-353m.json・lib tests/lib-w353m-residsign.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353m-residsign.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 探索の方針: 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせた格子と判定の物差しの記録。
// ■ 言わないこと: 歳差の率の答えとは書かない・地球の残りが何から来るかは数えていない(読み切ったとは書かない)。重力の側の列は比べる列(DFM の式ではない)。仮の値を使う行は合否にしない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as M from './lib-w353m-residsign.mjs';
import * as PV from './lib-w352b-provisional.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353m-residsign-1';
export const OUT_MAIN = 'tests/out/residsign-353m.json';
export const TARGET = 'tests/lib-w353m-residsign.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const PROV_KEYS = Object.freeze(['earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']);
export const NOT_CLAIM = Object.freeze([
  '残りの符号の表 —— 歳差の率の答えとは書かない・地球の残りが何から来るかは数えていない(読み切ったとは書かない)(この入力・この定義・このノブでは、の数)',
  '重力の側の列(第352便u の (T-g))は比べる列 —— DFM の式ではない。残り(仮の値 − 重力の列)は仮・未照合(較正・サンプルの状況・ノブの採否に入れない)',
  '月の道の置き方・慣性モーメントの係数の置き方・離心率の倍は、リポジトリに在る数とその定義の候補 —— 外の数は使っていない(力学的偏平率・離心率は第330便b の器の入力 —— 文献の値・未照合)',
  '金星の仮の値は大きさだけ —— 回る向きは「重力の列と同じ回り」「逆の回り」の 2 列で持つ(どちらにも寄せない)',
  '要る応答の係数 c は単位の応答 1 からの倍 —— 残りが幅の内の天体は上限としてだけ読む',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 10(既定 = 第353便f の重力の列・18.6 年の平均の閉じた形 = 交点 72 点の平均・tideOfNN = 第352便u の tideAvg・金星の既定 = 第353便f・極の反転と ŝ の反転・幅と要る c = 第353便f・統括の数え直し 3・振れの算術・拒否)',
  t1: '表 1: 地球 × 月の道の置き方 3(fixed・ecl・avg)× 慣性モーメントの係数の置き方 2(repo・lit)× 離心率の倍 2(none・repo)—— 黄道の極の重力の列・太陽の項・月の項・残り・符号の反転・最後の桁の振れ・(g2−)(g2+) の軸引きずり(u 0.98・c 1)で埋める向きか・要る c・幅の内か',
  t1node: '表 1b: 交点の経度 12 点(傾きはリポジトリの 5.145° のまま)の重力の列と残り・残りが 0 になる交点の経度(二分)',
  t2: '表 2: 金星 × 極 5(公転の北極・南極・黄道の北極・南極・基準軸 L)× ŝ の向き 2(有向の角運動量・北半球の極)× 仮の値の回る向き 2(重力の列と同じ・逆)—— 重力の列・軸引きずり (g2−)・残り・埋める向きか・要る c・幅の内か・話が閉じるか',
  t3: '表 3: 要る応答の係数(u 0.0487・0.98)× 火星・金星(同じ回り・逆の回り)・地球(固定の月の道・18.6 年の平均)—— 構造の量の式の候補 (ウ′)(ウ)(イ) との比・(P-応) の率の倍(観測半径・規則の半径)・上限としてだけ読む行' });

const RD = Object.freeze({ moons: Object.freeze(['fixed', 'ecl', 'avg']), hs: M.DECL.hModes, eccs: M.DECL.eModes, senses: Object.freeze(['g2m', 'g2p']), uMain: M.DECL.uMain,
  nodeGrid: M.DECL.nodeGrid, venusPoles: M.DECL.venusPoles, axisModes: M.DECL.axisModes, venusSenses: M.DECL.venusSenses, uGrid: M.DECL.uGrid,
  t3Rows: Object.freeze([['Mars', 'tide', null], ['Venus', 'tide', null], ['Venus', 'anti', null], ['Earth', 'tide', 'fixed'], ['Earth', 'tide', 'avg']]) });
export const ROWDECL = RD;
const fin = (x) => typeof x === 'number' && Number.isFinite(x);

/* ───────── 表 1: 地球の残りの符号 ───────── */
export function earthRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const moon of RD.moons) for (const h of RD.hs) for (const ecc of RD.eccs) {
    const o2 = { moon, h, ecc }, g = M.earthGrav(o2, o), fm = M.earthFill(o2, { u: RD.uMain, sense: 'g2m' }, o), fp = M.earthFill(o2, { u: RD.uMain, sense: 'g2p' }, o), sw = M.digitSwing(o2, o);
    rows.push(PV.tagProv({ moon, h, ecc, H: g.H, az: g.az, sun: g.sun, moonTerm: g.moon_, prov: g.prov, resid: g.resid, flip: g.flip, digit: sw, signStable: Math.abs(g.resid) > sw,
      dragM: fm.drag1, fillM: fm.fill, cNeedM: fm.cNeed, dragP: fp.drag1, fillP: fp.fill, cNeedP: fp.cNeed, width: fm.width, inWidth: fm.inWidth }, g.provKeys));
  }
  return PV.tagProv({ rows, iMoonDeg: M.moonIncDeg(o), lastDigit: M.lastDigitRel() }, ['earth.psiA.rate']);
}
export function nodeRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = RD.nodeGrid.map((d) => { const g = M.earthGrav({ moon: 'node', nodeDeg: d }, o); return PV.tagProv({ nodeDeg: d, az: g.az, moonTerm: g.moon_, resid: g.resid, flip: g.flip }, g.provKeys); });
  return PV.tagProv({ rows, zeros: M.nodeZeros({}, o), zerosEcc: M.nodeZeros({ ecc: 'repo' }, o) }, ['earth.psiA.rate']);
}
/* ───────── 表 2: 金星の極と回る向き ───────── */
export function venusRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const pole of RD.venusPoles) for (const axis of RD.axisModes) for (const sense of RD.venusSenses) {
    const r = M.venusRow({ pole, axis, sense, u: RD.uMain }, o), r0 = M.venusRow({ pole, axis, sense, u: RD.uGrid[0] }, o);
    rows.push(PV.tagProv({ pole, axis, sense, grav: r.grav, drag: r.drag, prov: r.prov, resid: r.resid, fill: r.fill, cNeed: r.cNeed, cNeed0: r0.cNeed, width: r.width, inWidth: r.inWidth, closes: r.closes, sinPole: r.sinPole }, r.provKeys));
  }
  return PV.tagProv({ rows }, ['venus.prec.rate']);
}
/* ───────── 表 3: 要る応答の係数の並び ───────── */
export function cRows(T1, GEO, cache) {
  const o = { T1, GEO, cache }, rows = [];
  for (const [id, vs, moon] of RD.t3Rows) for (const u of RD.uGrid) {
    const r = M.cRow(id, { u, venusSense: vs }, o);
    let cNeed = r.cNeed, resid = r.resid, fill = r.fill, inWidth = r.inWidth;
    if (id === 'Earth' && moon !== 'fixed') { const f = M.earthFill({ moon }, { u, sense: 'g2m' }, o); cNeed = f.cNeed; resid = f.resid; fill = f.fill; inWidth = f.inWidth; }
    rows.push(PV.tagProv({ id, venusSense: id === 'Venus' ? vs : null, moon, u, resid, cNeed, fill, width: r.width, inWidth, upperOnly: inWidth, overUJ: fin(cNeed) ? Math.abs(cNeed) / r.uJ : null, overU: fin(cNeed) ? Math.abs(cNeed) / r.uC : null,
      overI: fin(cNeed) ? Math.abs(cNeed) / r.iC : null, mObs: r.mObs, mRule: r.mRule, uJ: r.uJ }, r.provKeys));
  }
  // 火星と金星(同じ回り)の比のそろい方(最大 ÷ 最小 —— 式の候補ごと)
  const spread = {}, spread3 = {};
  for (const u of RD.uGrid) {
    const a = rows.find((r) => r.id === 'Mars' && r.u === u), b = rows.find((r) => r.id === 'Venus' && r.venusSense === 'tide' && r.u === u), sp = (x, y) => Math.max(x, y) / Math.min(x, y);
    spread[String(u)] = { c: sp(Math.abs(a.cNeed), Math.abs(b.cNeed)), uJ: sp(a.overUJ, b.overUJ), u: sp(a.overU, b.overU), i: sp(a.overI, b.overI), mObs: sp(Math.abs(a.cNeed) / a.mObs, Math.abs(b.cNeed) / b.mObs) };
    // 地球(18.6 年の平均の月の道 —— 埋める向きの行)を足した 3 天体のそろい方
    const e = rows.find((r) => r.id === 'Earth' && r.moon === 'avg' && r.u === u), s3 = (xs) => Math.max(...xs) / Math.min(...xs);
    spread3[String(u)] = { c: s3([a, b, e].map((r) => Math.abs(r.cNeed))), uJ: s3([a, b, e].map((r) => r.overUJ)), u: s3([a, b, e].map((r) => r.overU)), i: s3([a, b, e].map((r) => r.overI)), mObs: s3([a, b, e].map((r) => Math.abs(r.cNeed) / r.mObs)) };
  }
  return PV.tagProv({ rows, spread, spread3 }, PROV_KEYS.slice());
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t1 = J.t1.rows, t2 = J.t2.rows, n1 = RD.moons.length * RD.hs.length * RD.eccs.length, n2 = RD.venusPoles.length * RD.axisModes.length * RD.venusSenses.length;
  const v = (pole, axis, sense) => t2.find((r) => r.pole === pole && r.axis === axis && r.sense === sense);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 10,
    provTop: J.provisional === true && JSON.stringify(J.provKeys) === JSON.stringify(PROV_KEYS) && J.t1.provisional === true && J.t2.provisional === true && J.t3.provisional === true,
    t1: t1.length === n1 && t1.every((r) => fin(r.az) && fin(r.resid) && fin(r.dragM) && r.provisional === true && r.fillM === !r.fillP && Math.abs(r.dragM + r.dragP) <= 1e-9 * Math.abs(r.dragM)),
    t1node: J.t1node.rows.length === RD.nodeGrid.length && J.t1node.rows.every((r) => fin(r.resid)) && Array.isArray(J.t1node.zeros),
    t2: t2.length === n2 && RD.venusSenses.every((s) => RD.venusPoles.every((p) => Math.abs(v(p, 'L', s).grav - v(p, 'N', s).grav) <= 1e-12 * Math.abs(v(p, 'L', s).grav)))
      && RD.axisModes.every((a) => RD.venusSenses.every((s) => Math.abs(v('orbN', a, s).grav + v('orbS', a, s).grav) <= 1e-12 * Math.abs(v('orbN', a, s).grav) && v('orbN', a, s).fill === v('orbS', a, s).fill)),
    t3: J.t3.rows.length === RD.t3Rows.length * RD.uGrid.length && J.t3.rows.every((r) => fin(r.cNeed)) && Object.keys(J.t3.spread).length === RD.uGrid.length && Object.keys(J.t3.spread3).length === RD.uGrid.length,
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}; mark('input');
  const PS = M.pureScenes(T1, GEO), pure = { scenes: PS, gates: M.pureGates(PS) }; mark('pure');
  const t1 = earthRows(T1, GEO, cache); mark('t1');
  const t1node = nodeRows(T1, GEO, cache); mark('t1node');
  const t2 = venusRows(T1, GEO, cache); mark('t2');
  const t3 = cRows(T1, GEO, cache); mark('t3');
  const J = { pure, t1, t1node, t2, t3, timing: tm, provisional: true, provKeys: PROV_KEYS.slice() };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  delete J.provisional; delete J.provKeys;
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353m-residsign.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353M_OUT ? (path.isAbsolute(process.env.W353M_OUT) ? process.env.W353M_OUT : path.join(ROOT, process.env.W353M_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便m residsign(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: M.LIB_VERSION, generator: 'tests/exp-w353m-residsign.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R477', provisional: true, provKeys: PROV_KEYS.slice(), provMark: PV.MARK,
    decl: M.DECL, rowDecl: RD, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便m', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'residsign', engine: 'Node(html を読まない —— 純関数の lib・第353便f・c・第352便u・y・q・d・c・b の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

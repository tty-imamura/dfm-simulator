// 第353便za(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」・統括の検証項目 R491):
//   **換算の係数 k を置いた列の傾きの題を「見ている時間」の物差しで読み直す器 ——
//   表 1 窓 4 × 受け手 7 × 組 9(公転の極を固定した ε の変化と 0.1°・1° に達する年)/表 2 2 つの軸(地球・火星 —— 重力の側の列は比べる列・仮の値は印つき・月とイオは数なし)/
//   表 3 寄る割合の窓(傾きを保つ f の上限と公転面が寄る f_輪 の下限)/表 4 1 枚のまとめ(題 × k を置かない列・k を置く列 2 つ)・零試験 12**
//   (段 ktilt-353za —— 正本 tests/out/ktilt-353za.json・lib tests/lib-w353za-ktilt.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353za-ktilt.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値は第352便b の器の数だけ(表 2 の 2 つの軸・表 4 の回る向き —— 正本の最上位に provisional: true と鍵の一覧)。
//
// ■ 言わないこと: 傾きの保ち・食い違いの有無を結論として書かない(窓ごとの変化の表)。k・c_R を決めない。重力の側の列は比べる列(DFM の式ではない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353za-ktilt.mjs';
import * as U from './lib-w353u-nearrecv.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353za-ktilt-1';
export const OUT_MAIN = 'tests/out/ktilt-353za.json';
export const TARGET = 'tests/lib-w353za-ktilt.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '窓ごとの傾きの変化の表 —— 傾きの保ち・食い違いの有無を結論として書かない。換算の係数 k と受け手の半径の係数 c_R を決めない(どの組も候補)',
  '見ている時間(1 万年)と物差し(0.1°)は伺っている項の推奨の値 —— 100 年・100 万年・45 億年と 1° を並べる',
  '2 つの軸の重力の側の列は比べる列(DFM の式ではない)—— 率は仮の値(未照合)・重力の側の潮汐のトルクの列・地球の月の道の平均の列。月・イオはリポジトリに率が無い(数なし)',
  '表 4 の「有り・無し・物差しなし」は並べる印 —— 合否にしない',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 12(0.1°・1° に達する年 = 第353便n の tReach・窓の終わりの変化 = 第353便n の watchRow・揺れの幅 = 第353便u の nearState・2 つの軸 = 第353便x の twoRow・共回り 0・寄る割合の窓 = 第353便e/u・太陽・月の数なし・k 8.22e11・基準軸 L と ω_G・拒否)',
  t1: '表 1: 受け手 7 × 組 9 × 窓 4(100 年・1 万年・100 万年・45 億年)—— 公転の極を固定した ε の変化(窓の内の最大)・0.1° と 1° に達する年・一周の揺れの幅と年数',
  t2: '表 2: 地球・火星 × 組 9 × 重力の側の列(仮の値・潮汐の列・地球は月の道の平均の列)—— 2 つの軸の一周の幅と 1 万年・45 億年の変化(軸引きずりだけの列と並べる)/月・イオは数なし',
  t3: '表 3: 受け手 6 × 組 9 —— 傾きを保つ f の上限(q10)と、公転面が寄る f_輪 の下限(背景だけの大きさ・組の合成の大きさ)・比・同じ f で両方が入る窓',
  t4: '表 4: 題 4(傾きの変化〔1 万年〕・傾きの揺れ〔一周〕・歳差の回る向き・寄る割合の窓)× 列 3(k 1・規則の半径・(P-場) c_R 0.0128)—— 物差しとの比と、有り・無し・物差しなし',
});
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate']);
/** 表 4 の列(k を置かない列・k を置く列 2 つ) */
export const T4COLS = Object.freeze(['k1', 'rule', 'field-e2']);
export const T2KEYS = Object.freeze(['Earth', 'Mars']);
export const T3KEYS = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Moon', 'Io']);
const gravsOf = (key) => (key === 'Earth' ? ['prov', 'tide', 'moonAvg'] : ['prov', 'tide']);

/** 表 4 の印(合否ではない): 比 ≤ 1 → 無し・> 1 → 有り(揺れは一周が見ている時間より長ければ物差しなし) */
export function markOf(ratio, { periodYr = null, windowYr = Z.DECL.mainWindowYr } = {}) {
  if (ratio === null || !Number.isFinite(ratio)) return '物差しなし';
  if (ratio <= 1) return '無し';
  if (periodYr !== null && periodYr > windowYr) return '物差しなし';
  return '有り';
}

export function gatesOf(J) {
  const nC = Z.DECL.comboIds.length, nW = Z.DECL.windowsYr.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.t1.length === Z.DECL.recvs.length && J.t1.every((b) => b.rows.length === nC && b.rows[0].combo === 'k1' && b.rows[0].k === 1
      && b.rows.every((r) => r.win.length === nW && r.win.every((w, i) => w.years === Z.DECL.windowsYr[i] && w.winDeg >= Math.abs(w.dEpsEndDeg) - 1e-12 && w.over01 === (w.winDeg > 0.1)))),
    t1over: JSON.stringify(J.t1over) === JSON.stringify(J.t1.flatMap((b) => b.rows.filter((r) => r.win[1].over01).map((r) => ({ key: b.key, combo: r.combo, winDeg: r.win[1].winDeg })))),
    t2: J.t2.rows.length === T2KEYS.reduce((s, k) => s + gravsOf(k).length, 0) * nC && J.t2.rows.every((r) => r.provisional === (r.grav === 'prov')) && J.t2.none.length === 2 && J.t2.none.every((r) => r.none === true),
    t3: J.t3.length === T3KEYS.length * nC && J.t3.every((r) => r.windowBg === (r.fRingBg !== null && r.fRingBg <= r.fMax)),
    t4: J.t4.rows.length === 4 && J.t4.rows.every((r) => r.cells.length === T4COLS.length && r.cells.every((c) => ['有り', '無し', '物差しなし'].includes(c.mark))),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}, o = { T1, GEO, cache }; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const C = U.comboList(T1, GEO), WY = Z.DECL.windowsYr;
  const pickW = (w) => ({ years: w.years, dEpsEndDeg: w.dEpsEndDeg, winDeg: w.winDeg, over01: w.over01 });
  const t1 = Z.DECL.recvs.map((key) => ({ key, rows: C.map((c) => {
    const ws = WY.map((y) => Z.kWatch(key, c.id, { years: y, ...o })), a = ws[0];
    return { combo: c.id, cR: c.cR, k: a.k, eps0Deg: a.eps0Deg, locOverBg: a.locOverBg, periodYr: a.periodYr, swingDeg: a.swingDeg, epsMinDeg: a.epsMinDeg, epsMaxDeg: a.epsMaxDeg, reach: a.reach, win: ws.map(pickW) };
  }) }));
  const t1over = t1.flatMap((b) => b.rows.filter((r) => r.win[1].over01).map((r) => ({ key: b.key, combo: r.combo, winDeg: r.win[1].winDeg }))); mark('t1');
  const rows = [];
  for (const key of T2KEYS) for (const g of gravsOf(key)) for (const c of C) {
    const a = Z.kWatch(key, c.id, { years: 1e4, mode: 'two', grav: g, ...o }), b = Z.kWatch(key, c.id, { years: Z.DECL.ageYr, mode: 'two', grav: g, ...o }), d = Z.kWatch(key, c.id, { years: 1e4, ...o });
    rows.push({ key, grav: g, combo: c.id, k: a.k, gravAsYr: a.grav.asYr, gravSign: a.grav.signG, periodYr: a.periodYr, swingDeg: a.swingDeg, win1e4: a.winDeg, winAge: b.winDeg, reach01: a.reach[0.1],
      dragSwingDeg: d.swingDeg, dragWin1e4: d.winDeg, shrink: a.swingDeg / d.swingDeg, provisional: a.provisional, provKeys: a.provKeys, comparison: true });
  }
  const none = ['Moon', 'Io'].map((key) => { const a = Z.kWatch(key, 'rule', { years: 1e4, mode: 'two', ...o }); return { key, none: a.none, winDeg: a.winDeg }; });
  const t2 = { rows, none }; mark('t2');
  const t3 = T3KEYS.flatMap((key) => C.map((c) => Z.fWindow(key, c.id, o))); mark('t3');
  // 表 4: 1 枚のまとめ
  const fc = {}, row1 = (cid) => t1.map((b) => ({ key: b.key, v: b.rows.find((r) => r.combo === cid).win[1].winDeg }));
  const cellTilt = (cid) => { const a = row1(cid), m = a.reduce((x, y) => (y.v > x.v ? y : x)), e = a.find((x) => x.key === 'Earth').v, two = rows.find((r) => r.key === 'Earth' && r.grav === 'prov' && r.combo === cid).win1e4;
    return { combo: cid, value: m.v, key: m.key, earth: e, earthTwo: two, ratio: m.v / 0.1, mark: markOf(m.v / 0.1) }; };
  const cellSwing = (cid) => { const r = t1.find((b) => b.key === 'Earth').rows.find((x) => x.combo === cid), two = rows.find((x) => x.key === 'Earth' && x.grav === 'prov' && x.combo === cid);
    return { combo: cid, value: r.swingDeg, periodYr: r.periodYr, twoSwing: two.swingDeg, twoPeriodYr: two.periodYr, ratio: r.swingDeg / 0.1, mark: markOf(r.swingDeg / 0.1, { periodYr: r.periodYr }) }; };
  const cellSense = (cid) => { const ob = T2KEYS.map((key) => U.obsRow(key, cid, { T1, GEO, cache, fc })), same = ob.filter((x) => x.provSame === true).length;
    return { combo: cid, value: same, of: ob.length, ratio: null, mark: same === ob.length ? '無し' : '有り', provisional: true, provKeys: [...new Set(ob.flatMap((x) => x.provKeys))].sort() }; };
  const cellF = (cid) => { const w = t3.find((r) => r.key === 'Earth' && r.combo === cid);
    return { combo: cid, value: w.gapBg, fMax: w.fMax, fRingBg: w.fRingBg, fRingW: w.fRingW, gapW: w.gapW, ratio: w.gapBg, mark: markOf(w.gapBg) }; };
  const t4 = { cols: T4COLS.slice(), rows: [
    { topic: 'tilt1e4', scale: '0.1°(1 万年の内の abs(ε − ε₀) の最大 —— 受け手 7 の最大)', cells: T4COLS.map(cellTilt) },
    { topic: 'swing', scale: '0.1°(一周の揺れの幅 —— 地球。一周が 1 万年より長ければ物差しなし)', cells: T4COLS.map(cellSwing) },
    { topic: 'sense', scale: '仮の値の回る向き(地球・火星 —— 未照合)', cells: T4COLS.map(cellSense) },
    { topic: 'fwin', scale: '同じ f で「傾きを保つ」と「公転面が寄る」が並ぶか(f_輪 の下限 ÷ f の上限 —— 地球)', cells: T4COLS.map(cellF) },
  ] }; mark('t4');
  const J = { pure, t1, t1over, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353za-ktilt.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZA_OUT ? (path.isAbsolute(process.env.W353ZA_OUT) ? process.env.W353ZA_OUT : path.join(ROOT, process.env.W353ZA_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便za ktilt(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const pk = [...new Set([...S.value.t2.rows.flatMap((r) => r.provKeys), ...S.value.t4.rows[2].cells.flatMap((c) => c.provKeys)])].sort();
  const out = { version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353za-ktilt.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)AN1046・統括の検証項目 R491', provisional: true, provKeys: PROV_KEYS.slice(), provKeysUsed: pk,
    provMark: '仮・未照合(第352便b の器の数 —— 合否・較正・サンプルの状況・ノブの採否に入れない)',
    decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便za', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'ktilt', engine: 'Node(html を読まない —— 純関数の lib・第353便u・n・x・b・e・第352便w・l・i・第351便d の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

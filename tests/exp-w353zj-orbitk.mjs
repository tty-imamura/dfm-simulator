// 第353便zj(原仮定者の回答(2026-11-25 —— 第151報)「銀河由来の背景軸引きずりの大きさ: これに注目」・原仮定者の回答(2026-11-14 —— 第138報の回答)AN721・統括の検証項目 R499):
//   **換算の係数 k を置いた列で、水星・金星・地球・火星の公転の道(道の面の法線・近点の向き)が合成の回転に応えるとしたときの率を、暦表の追加の歳差の参考の幅と比べる器 ——
//   表 3 率(受け手 4 × 組 9 —— 全部・共通の分・差)/表 4 参考の幅との比と、比が 1 になる応える係数 c_輪 の上限・公転面が寄る下限・窓/表 5 在位の組との並び/表 6 言えること・言えないこと・零試験 14**
//   (段 orbitk-353zj —— 正本 tests/out/orbitk-353zj.json・lib tests/lib-w353zj-orbitk.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w353zj-orbitk.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。仮の値の lib(第352便b)は第353便u・x の閉包に入る —— 本器は仮の値を読まない(正本の最上位に provisional: true と閉包の lib が使う鍵の一覧)。
//
// ■ 言わないこと: 水星の近点の値を出したとは書かない・暦表との比を結論として書かない(参考の幅との比の表 —— 幅は 1σ ではない・文献の値・未照合)。在位の組を動かさない。k・c_輪 を決めない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as Z from './lib-w353zj-orbitk.mjs';
import * as U from './lib-w353u-nearrecv.mjs';
import * as E from './lib-w347e-spintorque.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w353zj-orbitk-1';
export const OUT_MAIN = 'tests/out/orbitk-353zj.json';
export const TARGET = 'tests/lib-w353zj-orbitk.mjs';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '参考の幅との比の表 —— 水星の近点の値を出したとは書かない・暦表との比を結論として書かない。幅は 1σ ではない(近点 = 出典の表の ±・交点 = 残差の変化が 5% 以内の区間の半幅)・文献の値・未照合',
  '道が局所の回転に応えるかどうかは、いまの式には無い —— 自転軸の式を道の面に当てた読み(応える係数 c_輪 はノブ)。換算の係数 k と c_輪 を決めない',
  '共通の分(背景だけ —— 全部の惑星に同じ回転)が暦表に出るかは、暦表の枠の結び方に依る —— 全部と差の 2 列を並べ、どちらかに寄せない',
  '在位の組(1PN の値に当たる組)を動かさない —— 表 5 は足したときのずれの大きさの並べ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({
  pure: '零試験 14(背景の率 0.98 ω_G = 第353便b の 5.80e-3″/年・k 1 の差 0・局所 ÷ 背景 = 第353便u・金星は組で 1・率の作り = 第352便d の precDs と poleRates・一次と比例と向き・面内の近点の分け・文献の値 = 第335便c・地球の交点は数なし・寄る下限 = 第353便e/x・k・1PN・法線・拒否)',
  t1: '表 3: 受け手 4 × 組 9 —— 合成の大きさ・道の法線の回る率・黄道の交点の率・傾きの率・近点の率(c_輪 1・f_輪 0・(g2−))を全部・共通の分(背景だけ)・差(k × 局所)で',
  t2: '表 4: 受け手 4 × 組 9 —— 比(全部・差 × 近点・交点)・比が 1 になる c_輪 の上限・公転面が寄る下限(c_輪 0.0117 と f_輪 1.15e-2)・下限の線の上の窓',
  t3: '表 5: 水星 × 組 9 —— 在位の組 3 つに近点の率(c_輪 1・上限の c_輪)を足したずれ・第337便i の環で絞った円盤引きずりとの桁の差',
  t4: '表 6: 言えること・言えないこと(応えない・自転軸と同じに応える・寄る下限)× 受け手 4',
});
export const PROV_KEYS = Object.freeze(['earth.precSense', 'earth.psiA.rate', 'mars.prec.rate', 'venus.prec.rate']);
const pickR = (p) => ({ Lmag: p.Lmag, di: p.di, dnode: p.dnode, sinIdnode: p.sinIdnode, dvarpi: p.dvarpi, apsW: p.apsW });

export function gatesOf(J) {
  const nC = Z.DECL.comboIds.length, nR = Z.DECL.recvs.length, lin = (r, q) => Math.abs(r.full[q] - r.common[q] - r.diff[q]) <= 1e-9 * Math.max(Math.abs(r.full[q]), Math.abs(r.common[q]), Math.abs(r.diff[q]), 1e-300);
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 14,
    t1: J.t1.length === nR * nC && J.t1.every((r) => lin(r, 'dvarpi') && lin(r, 'di') && (r.full.dnode === null) === (r.id === 'Earth')) && J.t1.filter((r) => r.combo === 'k1').every((r) => Math.abs(r.omCy / J.t1[0].omCy - 1) <= 1e-9),
    t2: J.t2.length === nR * nC && J.t2.every((r) => r.overFull === (r.maxFull > 1) && r.overDiff === (r.maxDiff > 1) && (r.cMaxFull === null || Math.abs(r.cMaxFull * r.maxFull - 1) <= 1e-12) && r.win.open === (r.win.best.max <= 1)),
    t3: J.t3.rows.length === nC && J.t3.rows.every((r) => r.shift1.length === 3 && r.shiftMax.length === 3),
    t4: J.t4.length === 3 && J.t4.every((r) => r.cells.length === nR),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {}, o = { T1, GEO, cache }; mark('input');
  const PS = Z.pureScenes(T1, GEO), pure = { scenes: PS, gates: Z.pureGates(PS) }; mark('pure');
  const C = U.comboList(T1, GEO);
  const t1 = Z.DECL.recvs.flatMap((id) => C.map((c) => { const r = Z.orbRate(id, c.id, o);
    return { id, combo: c.id, cR: c.cR, k: r.k, locOverBg: r.locOverBg, omCy: r.omCy, bgCy: r.bgCy, locCy: r.locCy, omToNormalDeg: r.omToNormalDeg, full: pickR(r.full), common: pickR(r.common), diff: pickR(r.diff) }; })); mark('t1');
  const t2 = Z.DECL.recvs.flatMap((id) => C.map((c) => { const r = Z.ratioRow(id, c.id, o), g = Z.gatherRow(id, c.id, o), w = Z.windowRow(id, c.id, o);
    return { id, combo: c.id, k: r.k, full: r.full, diff: r.diff, maxFull: r.maxFull, maxDiff: r.maxDiff, cMaxFull: r.cMaxFull, cMaxDiff: r.cMaxDiff, overFull: r.overFull, overDiff: r.overDiff,
      gather: { kMin: g.kMin, fRingAt1: g.fRingAt1, thetaLDeg: g.thetaLDeg, alignCy: g.alignCy, A: g.A.ratio, B: g.B.ratio },
      win: { open: w.open, best: { fRing: w.best.fRing, cRing: w.best.cRing, ratio: w.best.ratio, max: w.best.max }, atF1: { max: w.atF1.max, ratio: w.atF1.ratio } } }; }));
  const lit = Object.fromEntries(Z.DECL.recvs.map((id) => { const L = Z.litOf(id); return [id, { dvarpi: L.dvarpi, dnode: L.dnode, scaleVarpi: L.scaleVarpi, scaleNode: L.scaleNode }]; })); mark('t2');
  const q1 = Z.q1cy('Mercury');
  const t3rows = C.map((c) => { const a = t1.find((r) => r.id === 'Mercury' && r.combo === c.id), b = t2.find((r) => r.id === 'Mercury' && r.combo === c.id);
    return { combo: c.id, k: a.k, dvarpi: a.full.dvarpi, dvarpiDiff: a.diff.dvarpi, cMaxFull: b.cMaxFull, shift1: Z.inposShift(a.full.dvarpi, 1), shiftMax: Z.inposShift(a.full.dvarpi, b.cMaxFull),
      over337i: Z.INPOS.rot337i.slice(1).map((x) => Math.abs(a.full.dvarpi / q1) / Number(x)) }; });
  const t3 = { q1cy: q1, inpos: Z.INPOS, rows: t3rows }; mark('t3');
  const rng = (xs) => { const v = xs.filter((x) => x !== null && Number.isFinite(x)); return v.length ? [Math.min(...v), Math.max(...v)] : null; };
  const kc = (id) => t2.filter((r) => r.id === id && r.combo !== 'k1');
  const t4 = [
    { reading: 'c0', cells: Z.DECL.recvs.map((id) => ({ id, ratio: 0, note: '率 0(道は動かない)' })) },
    { reading: 'c1', cells: Z.DECL.recvs.map((id) => ({ id, k1: t2.find((r) => r.id === id && r.combo === 'k1').maxFull, full: rng(kc(id).map((r) => r.maxFull)), diff: rng(kc(id).map((r) => r.maxDiff)), cMaxDiff: rng(kc(id).map((r) => r.cMaxDiff)) })) },
    { reading: 'gather', cells: Z.DECL.recvs.map((id) => ({ id, kMin: t2[0].gather.kMin, best: rng(t2.filter((r) => r.id === id).map((r) => r.win.best.max)), atF1: rng(t2.filter((r) => r.id === id).map((r) => r.win.atF1.max)),
      open: t2.filter((r) => r.id === id && r.win.open).length, of: C.length, nodeScale: Z.litOf(id).scaleNode !== null })) },
  ]; mark('t4');
  const J = { pure, lit, t1, t2, t3, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w353zj-orbitk.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W353ZJ_OUT ? (path.isAbsolute(process.env.W353ZJ_OUT) ? process.env.W353ZJ_OUT : path.join(ROOT, process.env.W353ZJ_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第353便zj orbitk(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: Z.LIB_VERSION, generator: 'tests/exp-w353zj-orbitk.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-25 —— 第151報)・原仮定者の回答(2026-11-14 —— 第138報の回答)AN721・統括の検証項目 R499', provisional: true, provKeys: PROV_KEYS.slice(),
    provMark: '仮・未照合(閉包の lib が使う鍵 —— 本器は値を読まない)',
    decl: Z.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第353便zj', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'orbitk', engine: 'Node(html を読まない —— 純関数の lib・第353便u・x・e・第351便d・第352便d・第337便b・第335便c・第333便c の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第317便d(原仮定者の裁定(第119報)・決断事項 AN431〔G_loc の n = 2・1・0 × K1・K2〕・AN432〔トリトンの表の量〕・統括の検証項目 R253):
// **二体の解析の一次の率の表とトリトンの離心率ベクトルの表の量の器**(段 satan-317d —— 正本 tests/out/satan-w317d.json)。
// **走行しない・html を読まない**: 純関数(tests/lib-w317d-satan.mjs)と既存の正本の読みだけ(第316便d の tests/out/sath-w316d.json・第315便d の
// tests/out/satk1-w315d.json・母惑星の凍結の写し tests/data-w306a-decl305.json)。在位の本・エンジンの式・受理の判定は不変(確認の材料 —— 在位へ入れない)。
//
// ■ 段
//   R 解析の一次の率の表(6 衛星 × G_loc の n = 2・1・0 × 核 K1・K2 × 型 fc〔固定中心・試験粒子〕・tb〔二体の質量の因子〕—— 引きずり係数は規則の Y_k = 10 G_0/(C_1 c_0²))
//   Y 候補 Y_k(n) = (6 + 2n) G_0/(C_1 c_0²) の検算(何がそろうか —— 普遍則として採らない)
//   M 走行の二体との対照(n = 2・K1 だけが第316便d の正本にある —— 窓 64 公転・模型 L・最も細かい刻み)
//   B 刻みの帯の次数の観察(第316便d の段 A の読み —— 近点 q11 − q10 の帯の比 (h–h/2)/(h/2–h/4) と q00 の数値の歳差の同じ比)
//   V トリトンの表の量(AN432 —— 第316便d の走行の行の公転ごとの平均の離心率ベクトルの差 q11 − q10・二体と三体)と、6 衛星の平行の成分の t = 0 の目安
//
// ■ 環境: W317D_OUT(出力先 —— 正本でない書き先)・W317D_QUICK=1(試走 —— イオとトリトンだけ・W317D_OUT が要る)。子プロセスは使わない(W317D_WORKERS は読まない)。
//   --tables: 正本から PHYSICS〔第317便d〕の表を標準出力へ(文書の lib tests/lib-w317d-satandoc.mjs —— 来歴に入れない)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」。近似要素の種を観測レコードと呼ばない。
//   数値の帯は観測の 3σ ではない。近点を確定したことにしない(トリトンの近点の率は判定から外したまま)。Y_k(n) は候補の検算(普遍則として採らない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as A from './lib-w317d-satan.mjs';
import { specKey } from './exp-w315d-satk1.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w317d-satan-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const OUT_SATAN = 'tests/out/satan-w317d.json';
export const SATH_OUT = 'tests/out/sath-w316d.json';
export const SATK1_OUT = 'tests/out/satk1-w315d.json';
export const TARGET = 'tests/lib-w317d-satan.mjs';   // html を読まない器の来歴の対象(純関数 —— 第289便c の reldrag の型)
export const PARTS = Object.freeze(['R', 'Y', 'M', 'B', 'V']);
export const QUICK_SATS = Object.freeze(['io', 'triton']);
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', '観測レコード', '近点を確定した', '普遍則として採用した'];
const rel = (a, b) => (Object.is(a, b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));

/** 器の全段(純関数 —— QA が同じ入力から作り直す)。J316 = 第316便d の正本・J315 = 第315便d の正本 */
export function buildSatan(J316, J315, o = {}) {
  const sats = o.sats || J316.E.sats.slice(), t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'satan', quick: !!o.quick, sats: sats.slice(), parts: PARTS.slice(), consts: A.constsOf(),
    nList: A.N_LIST.slice(), kernels: A.KERNELS.slice(), modes: A.MODES.slice(), gLocOfN: JSON.parse(JSON.stringify(A.GLOC_OF_N)),
    formulas: {
      q1pn: 'fc 6π G_0 M/(c_0² p)・tb 6π G_0 (M + m)/(c_0² p)',
      gLoc: 'fc −2nπ G_0 M/(c_0² p)・tb −2nπ G_0 (M² + m²)/((M + m) c_0² p)(G_loc = G_0 e^(−2nψ)・ψ は相手の質量だけ)',
      K1: 'fc π C_1 Y M/p・tb π C_1 Y (M + m)/p(全天体 R_d = Y m・β_ij = C_1 Y m_j/r・合成則は相対 —— 相対運動の並進の係数は β_s + β_p)',
      K2: 'fc 2π C_2 Y² M m/p²・tb 4π C_2 Y² M m/p²(同じ半径 R_d = Y m・β_ij = C_2 Y² m_i m_j/r²・J_2 = 2)',
      candidate: 'Y_k(n) = (6 + 2n) G_0/(C_1 c_0²)',
      k2Needed: 'K2 で fc の率を (6 + 2n)π G_0 M/(c_0² p) にする衛星の R_d: R_d² = (3 + n) G_0 m p/(C_2 c_0²)' },
    sources: { sath: SATH_OUT, satk1: SATK1_OUT, decl: L.DECL_FILE } };
  const Tsys = J316.T.systems;
  J.R = A.partR(Tsys, sats); tick('R');
  J.Y = A.partY(Tsys, sats); tick('Y');
  const J316s = Object.assign({}, J316, { E: Object.assign({}, J316.E, { sats: J316.E.sats.filter((k) => sats.includes(k)) }) });
  J.M = A.partM(J316s, J.R); tick('M');
  J.B = A.partB(J316s); tick('B');
  J.V = { triton: sats.includes('triton') ? A.tableQty(J316, J315.P.systems, J.R, specKey, 'triton') : null,
    parOffset: A.parOffsetAll(J316s, J315.P.systems, Math.max(...J316.E.windows)),
    velocity: '慣性速度 S.v(エンジンの力学速度 —— 座標速度 ẋ = v + u ではない)の母惑星に対する差と相対位置から AP.eccVector(r, v, μ = G(m_P + m_s)・エンジンの質量)。'
      + '成分は衛星の t = 0 の軌道面の基底(P = r̂(0)・Q = Ŵ(0) × P)',
    time: '公転ごとの平均 —— N 回目の公転(各走行の通過の時刻 rev[N−2] < t ≤ rev[N−1] の標本〔h ごと —— 刻みに依らず同じ時刻〕の平均)。q10 と q11 はそれぞれの通過で切る'
      + '(同じ座標時刻ではない —— 窓の平均の時刻の差 dtSec を並べる)' };
  tick('V');
  J.gates = gatesOf(J, J316, J315); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  J.conclusion = conclusionOf(J);
  return J;
}

/** 門(器の健全さ —— 結論の向きは入れない) */
export function gatesOf(J, J316, J315) {
  const g = {};
  g.sourcesOk = J316.ok === true && J316.quick !== true && J315.ok === true && J315.quick !== true;
  g.seedsSame = J.sats.every((k) => { const r = J.R.systems[k], T = J316.T.systems[k];
    return rel(r.q1pn.tb, T.q1pn) <= 1e-12 && rel(r.byN[2].K1.tb.gLoc, T.gLocAnalytic) <= 1e-12; });
  g.ykRuleSame = J.sats.every((k) => J.Y.systems[k].byN[2].sameAsRule === true);
  g.c1Closed = rel(J.consts.C1, J.consts.C1Closed) <= 1e-15;
  g.k1TenUnits = J.sats.every((k) => rel(J.R.systems[k].byN[2].K1.fc.drag, 10 * J.R.systems[k].unitFc) <= 1e-12);
  g.candidateFcAlgebra = J.sats.every((k) => { const y = J.Y.systems[k]; return y.spread.sumFc.relSpread <= 1e-12 && A.N_LIST.every((n) => Math.abs(y.byN[n].fc.rOverQ) <= 1e-12); });
  g.candidateTbClosed = J.sats.every((k) => A.N_LIST.every((n) => { const z = J.Y.systems[k].byN[n].tb; return n === 0 ? Math.abs(z.rOverQ) <= 1e-12 : rel(z.rOverQ, z.rPred) <= 1e-9; }));
  if (J.V.triton) {
    g.tableComplete = J316.E.systems.every((sys) => J.V.triton.systems[sys] && J.V.triton.systems[sys].rows.length === J316.E.windows.length
      && J.V.triton.systems[sys].rows.every((r) => [r.dE, r.par, r.perp, r.e10].every(Number.isFinite) && r.bandV.every(Number.isFinite) && r.bandPar.every(Number.isFinite) && r.bandPerp.every(Number.isFinite)));
    g.vSame = J316.E.systems.every((sys) => { const mine = J.V.triton.systems[sys].rows, ref = J316.V.systems['triton|' + sys].rows;
      return mine.length === ref.length && mine.every((r, i) => { const z = ref[i]; return r.N === z.N && rel(r.dE, z.dE) <= 1e-12 && rel(r.e10, z.e10) <= 1e-12 && rel(r.bandV[r.bandV.length - 1], z.band) <= 1e-12
        && rel(r.parOverE, z.parOverE) <= 1e-12 && rel(r.perpOverE, z.perpOverE) <= 1e-12 && rel(r.tDays * 86400 / (36525 * 86400), z.tCentury) <= 1e-12; }); });
  }
  return g;
}

/** 結論の数(本文が引く —— 判定の語ではなく表の要約) */
export function conclusionOf(J) {
  const ks = J.sats, Y = J.Y, mx = (f) => Math.max(...ks.map(f));
  const c = { fcSumSpreadMax: mx((k) => Y.systems[k].spread.sumFc.relSpread), fcROverQMax: mx((k) => Math.max(...A.N_LIST.map((n) => Math.abs(Y.systems[k].byN[n].fc.rOverQ)))),
    tbROverQ: Object.fromEntries(A.N_LIST.map((n) => [n, { min: Math.min(...ks.map((k) => Y.systems[k].byN[n].tb.rOverQ)), max: mx((k) => Y.systems[k].byN[n].tb.rOverQ) }])),
    dragRatioFc: Object.fromEntries(A.N_LIST.map((n) => [n, (6 + 2 * n) / 6])), gLocRatioFc: Object.fromEntries(A.N_LIST.map((n) => [n, -n / 3])),
    k2RdOverMRatio: Object.fromEntries(A.N_LIST.map((n) => [n, Y.k2RdOverM[n].ratio])),
    k2SameRadiusOverK1Max: mx((k) => Math.abs(J.R.systems[k].byN[2].K2.tb.drag / J.R.systems[k].byN[2].K1.tb.drag)) };
  if (J.M) { const ms = Object.keys(J.M.systems); c.mDragRelMax = Math.max(...ms.filter((k) => k !== 'triton').map((k) => Math.abs(J.M.systems[k].drag.rel)));
    c.mDragInBand = ms.filter((k) => J.M.systems[k].drag.inBand).length + '/' + ms.length; c.mGLocInBand = ms.filter((k) => J.M.systems[k].gLoc.inBand).length + '/' + ms.length;
    c.mSumInBand = ms.filter((k) => J.M.systems[k].sum.inBand).length + '/' + ms.length; c.mRef315InBand = ms.filter((k) => Math.abs(J.M.systems[k].ref315.diff) <= Math.max(...J.M.systems[k].drag.bands)).length + '/' + ms.length; }
  return c;
}

/* ───────── 実行 ───────── */
export async function main() {
  if (process.argv.includes('--tables')) {
    const DOC = await import('./lib-w317d-satandoc.mjs');
    process.stdout.write(DOC.physicsTablesSatAn(JSON.parse(fs.readFileSync(path.join(ROOT, OUT_SATAN), 'utf8'))) + '\n');
    return;
  }
  const quick = process.env.W317D_QUICK === '1';
  const OUT = process.env.W317D_OUT ? (path.isAbsolute(process.env.W317D_OUT) ? process.env.W317D_OUT : path.join(ROOT, process.env.W317D_OUT)) : path.join(ROOT, OUT_SATAN);
  if (quick && !process.env.W317D_OUT) throw new Error('試走(W317D_QUICK=1)は W317D_OUT を指定する(正本を書かない)');
  const t0 = Date.now();
  const J316 = JSON.parse(fs.readFileSync(path.join(ROOT, SATH_OUT), 'utf8')), J315 = JSON.parse(fs.readFileSync(path.join(ROOT, SATK1_OUT), 'utf8'));
  const R = buildSatan(J316, J315, { quick, sats: quick ? QUICK_SATS.slice() : null });
  const out = { version: HARNESS_VERSION, libVersion: A.LIB_VERSION, decayLibVersion: D.LIB_VERSION, satk1LibVersion: L.LIB_VERSION, sathVersion: J316.version, satk1Version: J315.version,
    generator: 'tests/exp-w317d-satan.mjs', target: TARGET,
    ruling: '原仮定者の裁定(第119報)・決断事項 AN431(衛星の三体の永年の効きが帯の内で決まらない —— 何が要るかの探索・G_loc の n = 2・1・0・K1 と K2)・AN432(トリトンの表の量)・'
      + '統括の検証項目 R253(二体の解析の一次の率の表 —— 枝 b の数値の格子の対照・候補 Y_k(n) の検算)。走行しない(純関数と既存の正本の読み)・確認の材料(在位へ入れない)',
    ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w317d-satan.mjs', 'tests/lib-w317d-satan.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w310d-shell.mjs',
    'tests/lib-w304e-apsis.mjs', 'tests/exp-w315d-satk1.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第317便d', target: TARGET, code: CODE, inputs: [SATH_OUT, SATK1_OUT, L.DECL_FILE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'satan', engine: 'Node の純関数だけ(html を読まない・走行しない)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.conclusion));
}
if (IS_MAIN) await main();

// 第342便c(原仮定者の回答(2026-11-18 —— 第142報)AN800・原仮定者の回答(2026-11-17 —— 第140報の回答)の扁平の則の予想・統括の検証項目 R374):
//   **扁平の源を区切らない近似の候補 —— 一番近い表面の接線(T1)・弦の向きの積分(T2)を、第341便d の 61440 点の表と並べる・計算の量(T3)**
//   (段 oblateapprox-342c —— 正本 tests/out/oblateapprox-342c.json・lib tests/lib-w342c-oblateapprox.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w342c-oblateapprox.mjs —— 領域の宣言なし)。入力のファイルは第341便d の正本 tests/out/oblatering-341d.json(参照の 42 点 —— 読むだけ・点は増やさない)。
// 正本へ書く形は第338便c の settleRun(Math の関数の戻り値を ±1〜2 ulp ずらした走り直しの差の最大を葉ごとの尺度 σ とし、|値| ≤ 4 σ の葉〔丸めの残り〕を 0 と書く)。1 プロセス・1 s の内。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 接線の列 —— (i) K_t(係数なし)と 1 + k (K_t − 1)(1 点で k を決める)(ii) 1 + k f (a/r)^n g(g 4 × n 4 × 係数 2〔k = 1/扁平率 0.098・d 1.5・高さ 0.01 の 1 点で決める〕)(iii) 参考の試作の実効の傾きの比。
//   T2: 弦の向きの積分 —— 向きの数 32・128・512(主 128)。
//   物差し(列ごと): 参照 42 点に対する向き(1 より大きい/小さい)の合う数・最大の差・参照の幅(unc)の内の数・系列(扁平率 × 高さ)ごとの最大の位置(長球は最小の位置)が参照と同じか。
//   参照の幅 unc は第341便d の「最後の差 + 外挿の幅」と並びどうしの開きの大きい方 —— 厳密な誤差の上限ではない(幅の外の点を隠さない)。
//   T3: 1 点あたりの核の評価の回数(参照 61440 点 × 源 2・弦 = 向きの数 × 源 2・接線 = 核を使わない)と壁時計(器の中の数 —— アプリの速さの話ではない)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w342c-oblateapprox.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w342c-oblateapprox-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/oblateapprox-342c.json';
export const TARGET = 'tests/lib-w342c-oblateapprox.mjs';
export const INPUT_REF = L.DECL.ref.file;
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['接線で求まると分かった/求まらないと分かったとは書かない(この列・この点ではこうだった)', '扁平の効きが導けたとは書かない', '環の厚みが分かったとは書かない',
  'アプリが速くなったとは書かない(核の評価の回数と壁時計は器の中の数)', '参照の幅を厳密な誤差の上限として使わない', '試した範囲は外の点・一様な密度の回転楕円体・逆二乗・h1 の傾きの比だけ']);
const D = L.DECL;

/** 参照の 42 点(第341便d の正本の t1.summary)—— 器の外から数として渡す */
export function readRef(root = ROOT) {
  const J = JSON.parse(fs.readFileSync(path.join(root, INPUT_REF), 'utf8'));
  const pick = (q) => J.t1.summary.filter((r) => r.q === q && r.ok).map((r) => ({ f: r.f, d: r.rOverReq, s: r.zOverR, best: r.best, unc: r.unc }));
  return { tilt: pick(D.ref.q), mag: pick(D.ref.qMag), refVersion: J.version, refLibVersion: J.libVersion, refT1WallSec: J.timing && J.timing.t1 ? J.timing.t1.wallSec : null, refLevels: J.decl.t1.levels };
}
const key = (r) => r.f + '|' + r.d + '|' + r.s;

/* ───────── T1 接線 ───────── */
export function partT1(ref) {
  const T = ref.tilt.map((r) => L.tangentRow(r.f, r.d, r.s));
  const Tof = new Map(T.map((t) => [key(t), t]));
  const fitRef = ref.tilt.find((r) => r.f === D.fitAt.f && r.d === D.fitAt.d && r.s === D.fitAt.s), fitT = Tof.get(key(fitRef));
  const cols = [];
  const addCol = (id, kind, val, extra = {}) => { const rows = ref.tilt.map((r) => L.compareOne(r, val(Tof.get(key(r)))));
    const others = rows.filter((x) => !(x.f === D.fitAt.f && x.d === D.fitAt.d && x.s === D.fitAt.s));
    const sat = others.filter((x) => x.f === D.fMain && x.s === D.sMain);
    cols.push(Object.assign({ id, kind, rows, sum: L.summarize(rows), maxAbsDiffOthers: Math.max(...others.map((x) => x.absDiff)), saturnOthersMax: Math.max(...sat.map((x) => x.absDiff)), saturnOthersN: sat.length }, extra)); };
  addCol('Kt', 'tangent-raw', (t) => t.Kt);
  { const k = (fitRef.best - 1) / (fitT.Kt - 1); addCol('Kt|fit', 'tangent-raw-fit', (t) => 1 + k * (t.Kt - 1), { k }); }
  addCol('eff', 'tangent-ref-trial', (t) => t.effRatio);
  for (const gk of D.gKinds) for (const n of D.nGrid) {
    addCol('g:' + gk + '|n' + n + '|k1', 'tangent-form-k1', (t) => L.formValue(t, gk, n, 1), { g: gk, n, k: 1 });
    const k = L.fitK(fitT, gk, n, fitRef.best);
    addCol('g:' + gk + '|n' + n + '|fit', 'tangent-form-fit', (t) => L.formValue(t, gk, n, k), { g: gk, n, k });
  }
  // 系列(扁平率 0.098・高さ 0.01)の 7 点の表(K_t・片側の極限・実効の傾きの比・δ)
  const saturn = T.filter((t) => t.f === D.fMain && t.s === D.sMain).map((t) => ({ d: t.d, Kt: t.Kt, Kt0: t.Kt0, eff: t.effRatio, delta: t.delta, theta: t.theta, distOverA: t.distOverA, iters: t.iters }));
  const best = cols.filter((c) => c.kind === 'tangent-form-fit' || c.kind === 'tangent-raw-fit').reduce((m, c) => (c.maxAbsDiffOthers < m.maxAbsDiffOthers ? c : m));
  return { rows: T, cols, saturn, fitAt: { f: fitRef.f, d: fitRef.d, s: fitRef.s, ref: fitRef.best }, bestFit: { id: best.id, maxAbsDiffOthers: best.maxAbsDiffOthers, saturnOthersMax: best.saturnOthersMax, extSameAll: best.sum.series.every((x) => x.extSame) } };
}

/* ───────── T2 弦の向きの積分 ───────── */
export function partT2(ref) {
  const levels = D.dirLevels.map((lv) => {
    const rows = ref.tilt.map((r) => L.chordRow(r.f, r.d, r.s, lv));
    const cmp = ref.tilt.map((r, i) => L.compareOne(r, rows[i].tiltRatio));
    const mrefOf = new Map(ref.mag.map((m) => [key(m), m]));
    const cmpMag = ref.tilt.map((r, i) => L.compareOne(mrefOf.get(key(r)), rows[i].magRatio));
    const volErr = Math.max(...rows.map((x) => Math.max(Math.abs(x.volRatioOblate - 1), Math.abs(x.volRatioSphere - 1))));
    return { nDir: lv[0] * lv[1], dims: lv, volErr, rows: rows.map((x) => ({ f: x.f, d: x.d, s: x.s, tiltRatio: x.tiltRatio, magRatio: x.magRatio, volRatioOblate: x.volRatioOblate, volRatioSphere: x.volRatioSphere, nKernel: x.nKernel })),
      cmp, sum: L.summarize(cmp), cmpMag, sumMag: L.summarize(cmpMag) };
  });
  // 向きの数を変えた差(自分の列の中 —— 128 → 512 の最大の差)
  const self = levels.slice(1).map((lv, i) => ({ from: levels[i].nDir, to: lv.nDir, maxAbsDiff: Math.max(...lv.rows.map((x, k) => Math.abs(x.tiltRatio - levels[i].rows[k].tiltRatio))) }));
  // 参照との差の符号(弦 − 参照)の並び —— 扁平率ごとの正負の数
  const main = levels[D.dirMain], signBy = D.fGrid.map((f) => ({ f, pos: main.cmp.filter((c) => c.f === f && c.diff > 0).length, neg: main.cmp.filter((c) => c.f === f && c.diff < 0).length }));
  return { levels, self, signBy };
}

/* ───────── T3 計算の量(核の評価の回数 —— 壁時計は timing へ)───────── */
export function partT3(ref, t2) {
  const last = ref.refLevels[ref.refLevels.length - 1], all = ref.refLevels.reduce((s, x) => s + x, 0);
  return { perPoint: { refLast: 2 * last, refAllLevels: 2 * all, chord: D.dirLevels.map((lv, i) => ({ nDir: lv[0] * lv[1], nKernel: t2.levels[i].rows[0].nKernel })), tangent: 0 },
    note: '1 点あたり(扁平の源と同じ位置の球の源の 2 つ)。参照は区切りの最後の段 61440 点 × 2 と、Richardson に使った 4 段の和 × 2。弦は向きの数 × 2(円錐の縁の外は数えない)。接線は核を使わない(最近点の Newton だけ)' };
}

export function gatesOf(J) {
  const t1 = J.t1, t2 = J.t2;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    refComplete: J.ref.nTilt === D.ref.nPts && J.ref.nMag === D.ref.nPts,
    t1Complete: t1.cols.length === 3 + D.gKinds.length * D.nGrid.length * 2 && t1.cols.every((c) => c.rows.length === D.ref.nPts) && t1.saturn.length === D.dGrid.length,
    t1FitPassesRef: t1.cols.filter((c) => c.kind === 'tangent-form-fit' || c.kind === 'tangent-raw-fit').every((c) => c.rows.some((r) => r.f === D.fitAt.f && r.d === D.fitAt.d && r.s === D.fitAt.s && r.absDiff <= 1e-12)),
    t2Complete: t2.levels.length === D.dirLevels.length && t2.levels.every((l) => l.rows.length === D.ref.nPts),
    t2Volume: t2.levels[t2.levels.length - 1].rows.every((r) => Math.abs(r.volRatioOblate - 1) <= D.volTol && Math.abs(r.volRatioSphere - 1) <= D.volTol),
    t2SelfSettled: t2.self[t2.self.length - 1].maxAbsDiff <= D.selfTol,
  };
}
export function runAll(ref) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: L.pureView(PS), gates: L.pureGates(PS) }; mark('pure');
  const t1 = partT1(ref); mark('t1');
  const t2 = partT2(ref); mark('t2');
  const t3 = partT3(ref, t2); mark('t3');
  const J = { ref: { nTilt: ref.tilt.length, nMag: ref.mag.length, version: ref.refVersion, libVersion: ref.refLibVersion }, pure, t1, t2, t3, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 壁時計(器の中の数 —— 正本の timing へ・照合しない): 42 点の接線と弦(向き 128)を 20 回ずつ */
export function wallBench(ref) {
  const reps = 20, now = () => Number(process.hrtime.bigint()) / 1e9;
  let t = now(); for (let k = 0; k < reps; k++) for (const r of ref.tilt) L.tangentRow(r.f, r.d, r.s); const tan = (now() - t) / (reps * ref.tilt.length);
  t = now(); for (let k = 0; k < reps; k++) for (const r of ref.tilt) L.chordRow(r.f, r.d, r.s, D.dirLevels[D.dirMain]); const ch = (now() - t) / (reps * ref.tilt.length);
  return { perPointSec: { tangent: tan, chord128: ch }, refT1WallSec: ref.refT1WallSec, note: '1 点あたりの秒(この機械・この走り —— 照合しない)。参照の秒は第341便d の T1 全体(並び 5 × 区切り 4 × 全部の点 —— 1 点あたりではない)' };
}
export function runSettled(ref) {
  let tm = null;
  const S = settleRun(() => { const R = runAll(ref); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const { gates, ok, ...rest } = S.value, g2 = gatesOf(S.value);
  return { J: Object.assign(rest, { timing: Object.assign({}, tm, { bench: wallBench(ref) }), gates: g2, ok: Object.values(g2).every(Boolean) }), recheck: S.meta };
}

const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w342c-oblateapprox.mjs', 'tests/lib-w342c-oblateapprox.mjs', 'tests/lib-w338b-bevelknob.mjs', 'tests/lib-w340h-thin.mjs', 'tests/lib-w338c-recheck.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W342C_OUT ? (path.isAbsolute(process.env.W342C_OUT) ? process.env.W342C_OUT : path.join(ROOT, process.env.W342C_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第342便c oblateapprox(版 ' + HARNESS_VERSION + ')');
  const ref = readRef();
  const { J: R, recheck } = runSettled(ref);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w342c-oblateapprox.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-18 —— 第142報)AN800・原仮定者の回答(2026-11-17 —— 第140報の回答)の扁平の則の予想・統括の検証項目 R374',
    decl: L.DECL, gJa: L.G_JA, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第342便c', target: TARGET, code: CODE, inputs: [INPUT_REF] }), {
    harnessVersion: HARNESS_VERSION, stage: 'oblateapprox', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 最近点の Newton・弦の長さの閉じた形と向きの求積)', notClaim: NOT_CLAIM, recheck,
    units: '無次元(源の R_d 1・質量の和 1)' });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第316便d(原仮定者の裁定(第118報)・決断事項 AN423〔衛星の表の代表は二体・三体は太陽の効きの記録・太陽の位相の調和の回帰の診断〕・AN424〔トリトンの近点を判定から外す・
// 離心率ベクトル〕・統括の検証項目 R249): **衛星 6 本の三体の診断の器**(段 sath-316d —— 正本 tests/out/sath-w316d.json)。
// 確認の材料 —— 合わせない・確認の値を在位へ入れない・在位の本の宣言は変えない(写しは第315便d の lib tests/lib-w315d-satk1.mjs の bookOf で組む)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step をそのまま呼ぶ)。
// 走行は子プロセス(W316D_WORKERS —— 既定 2)。本の写し・近似要素の種・抽出(通過・接触の離心ベクトル・交点・軸)は第315便d の lib と器
// (tests/exp-w315d-satk1.mjs の specKey・targetsOf・partK・partW・partB・bandVerdict・windowVerdict)をそのまま使う。
//
// ■ 何をするか
//   E 走行(6 衛星 × 二体・三体 × q00・q10・q11 × h・h/2・h/4 —— **64 公転の 1 本の走行**の入れ子の窓 8・16・32・64)。第315便d の器と同じ本・同じ步の回し方なので、
//     最初の 32 公転は第315便d の走行とビット同一(門 prefixSame —— 第315便d の正本の行は窓の要約だけで時系列を持たないので、時系列の要る回帰のために 1 本ずつ 64 公転へ延ばした)。
//     子は每步(h ごと —— 刻みに依らず同じ時刻)の接触の離心ベクトル (e_P, e_Q)・位置の角 θ と、**太陽の位相の入力 λ☉(t)** で回帰する:
//       λ☉ = 母惑星から見た太陽の向きの、衛星の t = 0 の軌道面の基底での角。**二体と三体で同じ入力** —— 凍結の写しの太陽と「母惑星 + 衛星の重心」の t = 0 の状態からの
//       ケプラーの二体の解(三体の走行では実際の太陽の向きとの差の最大を門 sunPhase で記録する)。
//   A 調和の回帰の診断(近点の率 ϖ̇ —— 離心ベクトルの成分の回帰〔tests/lib-w304e-apsis.mjs の apsisRate と同じ列と同じ式 —— 角でなく成分で回帰する: 低離心率で角が巻き付かない・
//     一次で ϖ(t) の回帰と同値〕)。模型は 3 つ(同じ標本・同じ窓):
//       L  = 直線 + 位置の角 θ の 1〜3 倍の調和(第315便d の近点の率と同じ —— 窓 8・16・32 は第315便d の値とビット同一)
//       H1 = L + 太陽の位相の調和 cos D・sin D(D = 2(λ☉ − ϖ̄)・ϖ̄ = 種の近点 0 —— ϖ̄ が窓の中で一定なら cos 2λ☉・sin 2λ☉ と同じ張り)
//       H2 = H1 + cos 2D・sin 2D(2 倍の調和)
//     窓 8・16・32・64 での ϖ̇ の差 q11 − q10 の安定性(続く窓の差と刻みの帯 h/2–h/4 の比)・回帰の条件数(列を単位の長さにした計画行列)・率の標準誤差の膨らみ
//     (H の (XᵀX)⁻¹ の率の対角 / L の同じ対角 の平方根)・残差・**保留の窓の予測の残差**(窓 N で回帰し、回帰に使わない次の N 公転の差の系列 q11 − q10 を予測した残差 ——
//     公転ごとの平均・e で割った角)。**短い窓の見かけの線形の傾きを吸収しただけなら精度の改善と呼ばない** —— 判定の規則 HARM_RULE は走行の前に宣言した。
//   C 表の代表(AN423): 第315便d の純関数 partK・partW・partB を 64 公転の窓まで当てた表。**代表は二体**(母惑星 + 衛星)の引きずりの効き —— 合否の数は二体だけ。
//     **三体は太陽の効きの記録**の別の列(合否の数にしない)。トリトンの近点は値と未解決の理由を表に残し、**その量だけ判定から外す**(AN424)。
//   V 離心率ベクトル(AN424): 公転ごとの平均の (e_P, e_Q) の差 q11 − q10 を、種の離心率と刻みの帯(h/2–h/4)と並べる(平行の成分 = e の変化・垂直の成分 / e = 近点の角の変化)。
//     「近点が定まらない」をゼロの効果と読まない。二体の解析の一次の率から来る垂直の成分も並べる(参考)。
//
// ■ 試走: W316D_QUICK=1(W316D_OUT が要る —— 正本を書かない)。再開: W316D_CACHE=<dir>(走行 1 本ごとの結果を逐次書き、同じ html・同じ器の版・同じ走行の鍵があれば読む)。
//   W316D_PARTS=E,A,C,V(正本は全段)・W316D_SATS=io,…(正本は 6 本)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「検証が完了した」「シュヴァルツシルト半径そのもの」。近似要素の種を観測レコードと呼ばない。
//   数値の帯は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断・窓は抽出の感度診断。調和の回帰は診断(窓の見かけの傾きを吸っただけなら改善と呼ばない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as L from './lib-w315d-satk1.mjs';
import * as X315 from './exp-w315d-satk1.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 第315便d の器と同じ読み口〔在位の本は .find で引く —— jupiterGalilean・saturnRingReal〕)
const REGEN_SCOPE = {"presets":["jupiterGalilean","saturn","saturnRingReal"],"roots":["$","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w316d-sath-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', '検証が完了した', 'シュヴァルツシルト半径そのもの', '観測レコード', '精度の改善(窓の見かけの傾きを吸っただけのとき)'];
export const OUT_SATH = 'tests/out/sath-w316d.json';
export const SATK1_OUT = 'tests/out/satk1-w315d.json';
export const PARTS = Object.freeze(['E', 'A', 'C', 'V']);
export const SATS = X315.SATS;
/** 計画(正本)。窓は同じ走行の入れ子(64 公転の 1 本から最初の N 公転)・保留の窓は N 公転で回帰して次の N 公転を予測 */
export const PLAN = Object.freeze({ runN: 64, windows: Object.freeze([8, 16, 32, 64]), startWindow: 8, holdout: Object.freeze([8, 16, 32]), divs: Object.freeze([1, 2, 4]), stepsPerOrbit: 720,
  kinds: Object.freeze(['q00', 'q10', 'q11']), systems: Object.freeze(['two', 'three']) });
export const QUICK = Object.freeze({ runN: 8, windows: Object.freeze([2, 4, 8]), startWindow: 2, holdout: Object.freeze([2, 4]), divs: Object.freeze([1, 2]), stepsPerOrbit: 360,
  kinds: Object.freeze(['q00', 'q10', 'q11']), systems: Object.freeze(['two', 'three']) });
/** 回帰の模型(位置の角の調和 K = 3 は第315便d と同じ・太陽の位相の調和の数 KD) */
export const MODELS = Object.freeze([
  Object.freeze({ key: 'L', KD: 0, ja: '直線 + 位置の角の 1〜3 倍の調和(第315便d と同じ)' }),
  Object.freeze({ key: 'H1', KD: 1, ja: 'L + 太陽の位相の調和 cos D・sin D(D = 2(λ☉ − ϖ̄))' }),
  Object.freeze({ key: 'H2', KD: 2, ja: 'H1 + 2 倍の調和 cos 2D・sin 2D' })]);
export const MODEL_KEYS = Object.freeze(MODELS.map((m) => m.key));
/**
 * 判定の規則(走行の前に宣言 —— 結果を見て変えない)。近点の率の差 q11 − q10(ϖ̇ の引きずりの有無の差)を模型ごとに:
 *   R1 窓の安定: 最も細かい刻みの値が最長の窓とその前の窓(32 → 64)で、刻みの帯(両窓の h/2–h/4 の大きい方)の内で動かない
 *   R2 刻みの帯: 最長の窓の h–h/2・h/2–h/4 の帯がどちらも SAT_BAND(1e-2 × abs(差))の内
 *   R3 保留の窓(H だけ): 最長の保留の窓(32 公転で回帰して次の 32 公転を予測)の差の系列の予測の残差が L 以下 —— 窓の見かけの傾きを吸っただけの模型は予測が悪くなる
 *   決まった = R1 ∧ R2 ∧(L か R3)。どの模型でも決まらなければ「帯の内で決まらない」と書く。
 */
export const HARM_RULE = Object.freeze({ version: 'w316d-harm-rule-1', rel: X315.SAT_BAND.rel,
  note: '近点の率の差 q11 − q10 を模型ごとに —— R1 窓の安定(最長の窓とその前の窓の差 ≤ 両窓の h/2–h/4 の帯の大きい方)・R2 刻みの帯(最長の窓の h–h/2・h/2–h/4 ≤ 1e-2 × abs(差))・'
    + 'R3 保留の窓(H だけ —— 最長の保留の窓の差の系列の予測の残差 ≤ L の同じ残差)。決まった = R1 ∧ R2 ∧(L か R3)。観測の 3σ ではない・近点の ε_fit を流用しない' });
const CENTURY = 36525 * 86400, RAD2AS = 180 / Math.PI * 3600, D2R = Math.PI / 180;
const finiteOr = (x) => (Number.isFinite(x) ? x : null);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const n = nrm(a); return [a[0] / n, a[1] / n, a[2] / n]; };

/* ───────── 太陽の位相の入力(ケプラーの二体 —— 二体と三体で同じ)───────── */
/** 凍結の写しの太陽と「母惑星 + 衛星の重心」の t = 0 の相対の状態(本の単位)から、時刻 t の重心の太陽に対する位置を返す関数(楕円のケプラー —— ニュートン法) */
export function keplerOf(P, ms) {
  const r0 = [P.planet.x - P.sun.x, P.planet.y - P.sun.y, P.planet.z - P.sun.z], v0 = [P.planet.vx - P.sun.vx, P.planet.vy - P.sun.vy, P.planet.vz - P.sun.vz];
  const mu = P.physics.G * (P.sun.m + P.planet.m + ms), rn = nrm(r0), a = 1 / (2 / rn - dot(v0, v0) / mu), ev = AP.eccVector(r0, v0, mu), e = nrm(ev);
  const Pp = unit(ev), Qp = unit(cross(unit(cross(r0, v0)), Pp)), n = Math.sqrt(mu / (a * a * a));
  const cosE0 = (1 - rn / a) / e, sinE0 = dot(r0, v0) / (e * Math.sqrt(mu * a)), E0 = Math.atan2(sinE0, cosE0), M0 = E0 - e * Math.sin(E0);
  const at = (t) => { const M = M0 + n * t; let E = M + e * Math.sin(M);
    for (let i = 0; i < 40; i++) { const f = E - e * Math.sin(E) - M, d = f / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-15) break; }
    const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E); return [x * Pp[0] + y * Qp[0], x * Pp[1] + y * Qp[1], x * Pp[2] + y * Qp[2]]; };
  return { at, a, e, n, period: 2 * Math.PI / n, mu };
}
/** 角の列を巻き戻す */
function unwrap(xs) { const out = new Array(xs.length); let acc = 0, prev = null; for (let i = 0; i < xs.length; i++) { const x = xs[i];
  if (prev === null) acc = x; else { let d = x - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc += d; } prev = x; out[i] = acc; } return out; }

/* ───────── 回帰(apsisRate と同じ列・同じ式 + 計画行列の診断と予測)───────── */
/** 対称行列の固有値と固有ベクトル(ヤコビ —— 列は 12 本まで) */
export function jacobiEig(A0) {
  const n = A0.length, A = A0.map((r) => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (__, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  return { values: A.map((r, i) => r[i]), vectors: V };
}
/** 計画行列の行(apsisRate と同じ順: 1・τ・θ の調和・足した位相の調和) */
const rowOfX = (s, i, tm, K, extra) => { const row = [1, s.t[i] - tm], th = s.th[i];
  for (let k = 1; k <= K; k++) row.push(Math.cos(k * th), Math.sin(k * th));
  for (const z of extra) for (let k = 1; k <= (z.K || 1); k++) row.push(Math.cos(k * z.phase[i]), Math.sin(k * z.phase[i]));
  return row; };
/**
 * 離心ベクトルの成分の回帰(apsisRate と同じ —— 率は rate〔本の時間あたり rad〕が apsisRate とビット同一になる)+ 診断:
 * cond = 列を単位の長さにした計画行列の条件数(√(λmax/λmin))・invTT = (XᵀX)⁻¹ の τ の対角・harm = 足した位相の調和の振幅(e_P・e_Q の成分ごと —— 離心ベクトルの単位)。
 */
export function fitApsis(s, o) {
  const K = o.K === undefined ? 3 : o.K, t0 = o.t0, t1 = o.t1, extra = o.extraPhases || [];
  const idx = []; for (let i = 0; i < s.t.length; i++) if (s.t[i] > t0 && s.t[i] <= t1) idx.push(i);
  const cols = 2 + 2 * K + extra.reduce((a, z) => a + 2 * (z.K || 1), 0);
  if (idx.length < cols + 4) return null;
  const tm = (s.t[idx[0]] + s.t[idx[idx.length - 1]]) / 2, X = idx.map((i) => rowOfX(s, i, tm, K, extra));
  const R = AP.lsqMulti(X, [idx.map((i) => s.eP[i]), idx.map((i) => s.eQ[i])]);
  if (!R) return null;
  const [A, B] = R[0].c, [C, D] = R[1].c, e2 = A * A + C * C;
  const G = Array.from({ length: cols }, () => new Array(cols).fill(0));
  for (const row of X) for (let a = 0; a < cols; a++) for (let b = a; b < cols; b++) G[a][b] += row[a] * row[b];
  for (let a = 0; a < cols; a++) for (let b = 0; b < a; b++) G[a][b] = G[b][a];
  const dg = G.map((r, i) => Math.sqrt(r[i])), Gn = G.map((r, i) => r.map((x, j) => x / (dg[i] * dg[j]))), eg = jacobiEig(Gn);
  const lmax = Math.max(...eg.values), lmin = Math.min(...eg.values);
  let invNTT = 0; for (let k = 0; k < cols; k++) invNTT += eg.vectors[1][k] * eg.vectors[1][k] / eg.values[k];
  const h0 = 2 + 2 * K, harm = extra.length ? [0, 1].map((j) => { let ss = 0; for (let c = h0; c < cols; c++) ss += R[j].c[c] * R[j].c[c]; return Math.sqrt(ss); }) : null;
  return { rate: (A * D - C * B) / e2, e: Math.sqrt(e2), varpi: Math.atan2(C, A), rms: [R[0].rms, R[1].rms], n: idx.length, K, cols, tm,
    cP: R[0].c, cQ: R[1].c, cond: lmin > 0 ? Math.sqrt(lmax / lmin) : null, invTT: invNTT / G[1][1], harm };
}
/** 予測の残差(回帰に使わない窓 t0 < t ≤ t1 の離心ベクトルの成分 —— 公転ごとの平均。bins = 通過の時刻の境) */
export function holdoutResid(s, f, o) {
  const extra = o.extraPhases || [], edges = o.edges, out = { bP: [], bQ: [] };
  for (let j = 1; j < edges.length; j++) {
    let sp = 0, sq = 0, n = 0;
    for (let i = 0; i < s.t.length; i++) { if (!(s.t[i] > edges[j - 1] && s.t[i] <= edges[j])) continue;
      const row = rowOfX(s, i, f.tm, f.K, extra); let pP = 0, pQ = 0; for (let c = 0; c < row.length; c++) { pP += row[c] * f.cP[c]; pQ += row[c] * f.cQ[c]; }
      sp += s.eP[i] - pP; sq += s.eQ[i] - pQ; n++; }
    out.bP.push(n ? sp / n : null); out.bQ.push(n ? sq / n : null);
  }
  return out;
}
/** 公転ごとの平均(離心ベクトルと時刻 —— 64 公転の全部) */
function orbitBins(s, rev, n) {
  const out = { t: [], P: [], Q: [] };
  for (let j = 0; j < n; j++) { const lo = j === 0 ? 0 : rev[j - 1], hi = rev[j]; let st = 0, sp = 0, sq = 0, c = 0;
    for (let i = 0; i < s.t.length; i++) if (s.t[i] > lo && s.t[i] <= hi) { st += s.t[i]; sp += s.eP[i]; sq += s.eQ[i]; c++; }
    out.t.push(c ? st / c : null); out.P.push(c ? sp / c : null); out.Q.push(c ? sq / c : null); }
  return out;
}
const fitSummary = (f, Tsec) => (f ? { aps: AP.toArcsecPerCentury(f.rate, Tsec), e: f.e, varpi: f.varpi, rms: f.rms, n: f.n, cols: f.cols, cond: f.cond, invTT: f.invTT, harm: f.harm } : null);

/* ───────── 走行(子)───────── */
export function runSpecH(HP, sp) {
  const sd = L.seedOf(HP, sp.sat), book = L.bookOf(HP, sp.sat, sp.sys, sp.kind, { seed: sd, stepsPerOrbit: sp.S }), P = L.parentOf(sd.parent), key = X315.specKey(sp);
  const v = HP.validatePreset(clone(book));
  if (!v.ok) return { key, spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  if (S.coord3d !== true) return { key, spec: sp, status: 'rejected', err: '三次元の本ではない' };
  const ip = book.timeRef.pair[0], is = book.timeRef.pair[1], mu = S.params.G * (S.m[ip] + S.m[is]);
  const dt = book.physics.stepDt / sp.div, Tsec = Math.pow(10, book.scaleExp.T), t0 = Date.now(), every = sp.div;
  const smp = L.attachSatSampler(S, { ci: ip, oi: is, mu, every, pole: P.orbitPole });
  const Pb = smp.basis.P, Qb = smp.basis.Q, sunAct = [];
  if (sp.sys === 'three') {   // 実際の太陽の向き(三体だけ —— 太陽は 0 番)。第 2 の包み(包みの順は記録だけ —— 物理に触らない)
    const inner = S.step; let k2 = 0;
    S.step = function () { const out = inner.apply(this, arguments); k2++;
      if (k2 % every === 0) { const sv = [S.x[0] - S.x[ip], S.y[0] - S.y[ip], S.z[0] - S.z[ip]]; sunAct.push(Math.atan2(dot(sv, Qb), dot(sv, Pb))); }
      return out; };
  }
  const maxSteps = Math.ceil(1.5 * sp.N * book.timeRef.stepsPerOrbit * sp.div);
  let k = 0, stop = null;
  for (; ; k++) {   // tests/lib-w315d-satk1.mjs の runBook と同じ回し方(最初の 32 公転は第315便d の走行とビット同一)
    if (k >= maxSteps) { stop = 'maxSteps'; break; }
    S.step(dt);
    if (S.coord3dHalt) { stop = 'coord3dHalt'; break; }
    if (S.inertialDragHalt === true) { stop = 'solveHalt'; break; }
    if (S.hasNaN()) { stop = 'nan'; break; }
    if (smp.rev.length >= sp.N) { k++; stop = 'revMax'; break; }
  }
  const s = smp.samples(), R = { rev: smp.rev.slice(), s };
  // 太陽の位相の入力(ケプラー —— 二体と三体で同じ)
  const kp = keplerOf(P, sd.m), lam = unwrap(s.t.map((t) => { const r = kp.at(t); return Math.atan2(-dot(r, Qb), -dot(r, Pb)); })), D = lam.map((x) => 2 * x);
  let sunCheck = null;
  if (sp.sys === 'three') { let mx = 0; const n = Math.min(sunAct.length, s.t.length);
    for (let i = 0; i < n; i++) { const r = kp.at(s.t[i]), lk = Math.atan2(-dot(r, Qb), -dot(r, Pb)); let d = sunAct[i] - lk; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; mx = Math.max(mx, Math.abs(d)); }
    sunCheck = { maxDevRad: mx, n }; }
  const exOf = (KD) => (KD ? [{ phase: D, K: KD }] : []);
  const windows = {}, fitsRaw = {}; let apsisSame = true;
  for (const N of sp.wins) {
    const w = L.windowOf(R, N, Tsec); windows[N] = w;
    if (!w.complete) continue;
    const fits = {}; fitsRaw[N] = {};
    for (const M of MODELS) {
      const f = fitApsis(s, { t0: 0, t1: w.t1, K: 3, extraPhases: exOf(M.KD) }), ref = AP.apsisRate(s, { t0: 0, t1: w.t1, K: 3, extraPhases: exOf(M.KD) });
      if (!(f && ref && Object.is(f.rate, ref.rate))) apsisSame = false;
      fitsRaw[N][M.key] = f; fits[M.key] = fitSummary(f, Tsec);
    }
    if (!(fits.L && Object.is(fits.L.aps, w.aps))) apsisSame = false;
    let iLast = -1; for (let i = 0; i < s.t.length; i++) if (s.t[i] <= w.t1) iLast = i;
    w.fits = fits; w.dDDeg = iLast >= 0 ? (D[iLast] - D[0]) / D2R : null; w.dVarpiDeg = fits.L ? fits.L.aps * (w.t1 * Tsec / CENTURY) / 3600 : null;
  }
  const holdout = {};
  for (const N of sp.holdout) {
    if (R.rev.length < 2 * N || !fitsRaw[N]) continue;
    const edges = [R.rev[N - 1]].concat(R.rev.slice(N, 2 * N)); holdout[N] = {};
    for (const M of MODELS) { const f = fitsRaw[N][M.key]; holdout[N][M.key] = f ? holdoutResid(s, f, { extraPhases: exOf(M.KD), edges }) : null; }
  }
  const evec = orbitBins(s, R.rev, Math.min(R.rev.length, sp.N));
  const st = HP.inertialDragIsqState ? HP.inertialDragIsqState(S) : null;
  smp.detach();
  return { key, spec: sp, h: book.physics.stepDt, status: 'run', steps: k, stop, complete: stop === 'revMax', nan: S.hasNaN(), unbound: smp.unbound(), dt, warnings: (v.warnings || []).length,
    windows, holdout, evec, sunCheck, apsisSame, sunOrbit: { aPlanet: kp.a, ePlanet: kp.e, periodDays: kp.period * Tsec / 86400 },
    betaMax: st ? st.betaMax : null, isqSteps: st ? st.steps : null, wallSec: (Date.now() - t0) / 1000 };
}

/* ───────── 子プロセスの池と再開の写し(第315便d と同じ型)───────── */
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(X315.specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(X315.specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, targetSha256, stat) {
  if (!dir) return run;
  fs.mkdirSync(dir, { recursive: true });
  const fileOf = (sp) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + L.LIB_VERSION + '|' + targetSha256 + '|' + X315.specKey(sp) + '|' + JSON.stringify(sp.holdout) + '|' + JSON.stringify(sp.wins)).digest('hex').slice(0, 32) + '.json');
  return (sp, pri) => {
    const f = fileOf(sp);
    try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.targetSha256 === targetSha256 && c.row && c.row.key === X315.specKey(sp)) { stat.resumed++; return Promise.resolve(c.row); } } catch (e) { /* 無い */ }
    return run(sp, pri).then((r) => { const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, targetSha256, row: r })); fs.renameSync(tmp, f); return r; });
  };
}

/* ───────── 段 A(調和の回帰の診断 —— E の行から純関数 —— QA が作り直す)───────── */
const rowOf = (J, sat, sys, kind, div) => { const r = J.E.rows[X315.specKey({ sat, sys, kind, S: J.E.stepsPerOrbit, div, N: J.E.runN })]; return r && r.status === 'run' ? r : null; };
const fitOf = (r, N, M) => (r && r.windows[N] && r.windows[N].complete && r.windows[N].fits ? r.windows[N].fits[M] : null);
export function partA(J) {
  const out = { rule: clone(HARM_RULE), models: MODELS.map((m) => ({ key: m.key, KD: m.KD, ja: m.ja })), systems: {} };
  const ws = J.E.windows.slice().sort((a, b) => a - b), ds = J.E.divs.slice().sort((a, b) => a - b), fine = ds[ds.length - 1], fine2 = ds.length >= 2 ? ds[ds.length - 2] : null;
  const bKey = (a, b) => a + '-' + b;
  for (const sat of J.E.sats) for (const sys of J.E.systems) {
    const id = sat + '|' + sys, o = { models: {} };
    const r10f = rowOf(J, sat, sys, 'q10', fine), r11f = rowOf(J, sat, sys, 'q11', fine), r00f = rowOf(J, sat, sys, 'q00', fine);
    o.phase = {}; for (const N of ws) { const w = r10f && r10f.windows[N]; o.phase[N] = w && w.complete ? { dDDeg: finiteOr(w.dDDeg), dVarpiDegQ00: finiteOr(r00f && r00f.windows[N] ? r00f.windows[N].dVarpiDeg : null), days: w.t1 * Math.pow(10, L.UNITS.T) / 86400 } : null; }
    o.sunPeriodDays = r10f ? r10f.sunOrbit.periodDays : null;
    for (const M of MODEL_KEYS) {
      const m = { byWin: {} };
      for (const N of ws) {
        const z = { byDiv: {}, bands: {} };
        for (const d of ds) { const a = fitOf(rowOf(J, sat, sys, 'q00', d), N, M), b = fitOf(rowOf(J, sat, sys, 'q10', d), N, M), c = fitOf(rowOf(J, sat, sys, 'q11', d), N, M);
          if (!a || !b || !c) continue;
          z.byDiv[d] = { q00: finiteOr(a.aps), q10: finiteOr(b.aps), q11: finiteOr(c.aps), dDG: (Number.isFinite(c.aps) && Number.isFinite(b.aps)) ? c.aps - b.aps : null,
            dG: (Number.isFinite(b.aps) && Number.isFinite(a.aps)) ? b.aps - a.aps : null }; }
        for (let i = 1; i < ds.length; i++) { const x = z.byDiv[ds[i]], y = z.byDiv[ds[i - 1]]; z.bands[bKey(ds[i - 1], ds[i])] = (x && y && Number.isFinite(x.dDG) && Number.isFinite(y.dDG)) ? Math.abs(x.dDG - y.dDG) : null; }
        const fq = fitOf(r10f, N, M), fL = fitOf(r10f, N, 'L');
        z.cond = fq ? finiteOr(fq.cond) : null; z.infl = (fq && fL && fq.invTT > 0 && fL.invTT > 0) ? Math.sqrt(fq.invTT / fL.invTT) : null;
        z.harmOverE = (fq && fq.harm && fq.e > 0) ? Math.max(...fq.harm) / fq.e : null; z.rmsOverE = (fq && fq.e > 0) ? Math.hypot(fq.rms[0], fq.rms[1]) / fq.e : null;
        z.v = z.byDiv[fine] ? z.byDiv[fine].dDG : null; z.bandFine = fine2 !== null ? finiteOr(z.bands[bKey(fine2, fine)]) : null;
        m.byWin[N] = z;
      }
      // 続く窓の差と刻みの帯
      m.steps = []; for (let i = 1; i < ws.length; i++) { const a = m.byWin[ws[i - 1]], b = m.byWin[ws[i]];
        const d = (Number.isFinite(a.v) && Number.isFinite(b.v)) ? Math.abs(b.v - a.v) : null, band = (Number.isFinite(a.bandFine) && Number.isFinite(b.bandFine)) ? Math.max(a.bandFine, b.bandFine) : null;
        m.steps.push({ from: ws[i - 1], to: ws[i], d, band, overBand: (Number.isFinite(d) && band > 0) ? d / band : null, within: (Number.isFinite(d) && Number.isFinite(band)) ? d <= band : null }); }
      // 保留の窓(差の系列 q11 − q10 の予測の残差 —— 公転ごとの平均の差のベクトルの長さを e で割った角〔″〕の二乗平均の平方根)
      m.holdout = {};
      for (const N of J.E.holdout) { const per = {};
        for (const d of ds) { const h10 = rowOf(J, sat, sys, 'q10', d), h11 = rowOf(J, sat, sys, 'q11', d), a = h10 && h10.holdout[N] && h10.holdout[N][M], b = h11 && h11.holdout[N] && h11.holdout[N][M], f = fitOf(h10, N, 'L');
          if (!a || !b || !f) { per[d] = null; continue; }
          let ss = 0, n = 0; for (let j = 0; j < a.bP.length; j++) { const x = b.bP[j] - a.bP[j], y = b.bQ[j] - a.bQ[j]; if (Number.isFinite(x) && Number.isFinite(y)) { ss += x * x + y * y; n++; } }
          per[d] = n ? Math.sqrt(ss / n) / f.e * RAD2AS : null; }
        m.holdout[N] = { byDiv: per, v: finiteOr(per[fine]) }; }
      m.longest = ws[ws.length - 1];
      const zl = m.byWin[m.longest], last = m.steps[m.steps.length - 1], hN = J.E.holdout[J.E.holdout.length - 1];
      const bandsL = Object.values(zl.bands), tol = Number.isFinite(zl.v) && zl.v !== 0 ? HARM_RULE.rel * Math.abs(zl.v) : null;
      m.R1 = last ? last.within === true : false;
      m.R2 = (bandsL.length >= 2 && bandsL.every((x) => Number.isFinite(x)) && tol !== null) ? bandsL.every((x) => x <= tol) : false;
      m.R3 = M === 'L' ? null : (o.models.L && Number.isFinite(m.holdout[hN].v) && Number.isFinite(o.models.L.holdout[hN].v) ? m.holdout[hN].v <= o.models.L.holdout[hN].v : false);
      m.determined = m.R1 && m.R2 && (M === 'L' || m.R3 === true);
      o.models[M] = m;
    }
    o.determinedBy = MODEL_KEYS.filter((M) => o.models[M].determined);
    o.verdict = o.determinedBy.length ? '帯の内で決まった(' + o.determinedBy.join('・') + ')' : '帯の内で決まらない';
    out.systems[id] = o;
  }
  return out;
}

/* ───────── 段 C(表の代表 —— 第315便d の純関数 partK・partW・partB を 64 公転の窓まで)───────── */
/** AN424: 判定から外す量(値と理由は表に残す) */
export const EXCLUDE = Object.freeze({ 'triton|aps': '近点が定まらない(種の離心率 1.6e-5 —— 刻みと窓の帯が差に比べて大きい・離心率ベクトルの差で記録する)' });
export function partC(J) {
  const K = X315.partK(J), W = X315.partW(Object.assign({}, J, { K })), B = X315.partB(Object.assign({}, J, { K, W }));
  const rep = { rule: '代表 = 母惑星との二体(合否の数は二体だけ)・三体は太陽の効きの記録(合否の数にしない)・判定から外す量: ' + Object.keys(EXCLUDE).join('・'), count: {} };
  for (const Q of X315.QTY) { let n = 0, inn = 0; const ex = [];
    for (const sat of J.E.sats) { const b = B.systems[sat + '|two']; if (!b) continue; if (EXCLUDE[sat + '|' + Q.key]) { ex.push(sat); continue; } n++; if (b.q[Q.key].dDG.inAll === true) inn++; }
    rep.count[Q.key] = { judged: n, inBand: inn, excluded: ex }; }
  return { K, W, B, rep };
}

/* ───────── 段 V(離心率ベクトル —— AN424)───────── */
export function partV(J) {
  const out = { note: '公転ごとの平均の離心率ベクトルの差 q11 − q10(最も細かい刻み)を、種の離心率と刻みの帯(h/2–h/4 の同じ差の差)と並べる。平行の成分 = e の変化・垂直の成分 / e = 近点の角の変化(rad)', systems: {} };
  const ds = J.E.divs.slice().sort((a, b) => a - b), fine = ds[ds.length - 1], fine2 = ds.length >= 2 ? ds[ds.length - 2] : null, Tsec = Math.pow(10, L.UNITS.T);
  for (const sat of J.E.sats) for (const sys of J.E.systems) {
    const T = J.T.systems[sat], a = rowOf(J, sat, sys, 'q10', fine), b = rowOf(J, sat, sys, 'q11', fine), a2 = fine2 !== null ? rowOf(J, sat, sys, 'q10', fine2) : null, b2 = fine2 !== null ? rowOf(J, sat, sys, 'q11', fine2) : null;
    if (!a || !b) continue;
    const n = Math.min(a.evec.P.length, b.evec.P.length), rows = [];
    for (const N of J.E.windows) { const j = N - 1; if (j >= n) continue;
      const e10 = [a.evec.P[j], a.evec.Q[j]], dE = [b.evec.P[j] - a.evec.P[j], b.evec.Q[j] - a.evec.Q[j]], en = Math.hypot(e10[0], e10[1]), u = [e10[0] / en, e10[1] / en];
      const dE2 = (a2 && b2 && a2.evec.P.length > j && b2.evec.P.length > j) ? [b2.evec.P[j] - a2.evec.P[j], b2.evec.Q[j] - a2.evec.Q[j]] : null;
      const band = dE2 ? Math.hypot(dE[0] - dE2[0], dE[1] - dE2[1]) : null, mag = Math.hypot(dE[0], dE[1]), tYears = a.evec.t[j] * Tsec / CENTURY;
      rows.push({ N, tCentury: tYears, e10: en, dE: mag, dEOverSeed: mag / T.e, band, dEOverBand: band > 0 ? mag / band : null, visible: band !== null ? mag > band : null,
        parOverE: (dE[0] * u[0] + dE[1] * u[1]) / en, perpOverE: (u[0] * dE[1] - u[1] * dE[0]) / en, refPerpOverE: T.dDGRef * tYears / RAD2AS }); }
    out.systems[sat + '|' + sys] = { eSeed: T.e, rows };
  }
  return out;
}

/* ───────── 門(器の健全さ —— 判定〔A・C〕は結果で、ここに入れない)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.T) g.seedsFinite = Object.values(J.T.systems).every((t) => [t.m, t.R, t.a, t.e, t.iEqDeg, t.spin, t.PDays, t.q1pn, t.gLocAnalytic].every(Number.isFinite) && t.e >= 0 && t.e < 1 && t.a > 0);
  if (J.E) { const run = Object.values(J.E.rows);
    g.runsComplete = run.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && !r.unbound && J.E.windows.every((N) => r.windows[N] && r.windows[N].complete
      && Number.isFinite(r.windows[N].sidDays) && Number.isFinite(r.windows[N].aps) && Number.isFinite(r.windows[N].node) && MODEL_KEYS.every((M) => r.windows[N].fits && r.windows[N].fits[M] && Number.isFinite(r.windows[N].fits[M].aps))));
    g.noRejected = run.every((r) => r.status === 'run');
    g.allRows = Object.keys(J.E.rows).length === J.E.sats.length * J.E.systems.length * J.E.kinds.length * J.E.divs.length;
    g.apsisSame = run.every((r) => r.apsisSame === true);   // 回帰が apsisRate とビット同一・L が第315便d の抽出(windowOf)とビット同一
    g.sunPhase = run.filter((r) => r.spec.sys === 'three').every((r) => r.sunCheck && r.sunCheck.n > 0 && r.sunCheck.maxDevRad <= 1e-6);
    g.holdoutComplete = run.filter((r) => r.spec.kind !== 'q00').every((r) => r.holdout && r.evec && r.evec.P.length === J.E.runN && r.evec.P.every(Number.isFinite)
      && J.E.holdout.every((N) => r.holdout[N] && MODEL_KEYS.every((M) => r.holdout[N][M] && r.holdout[N][M].bP.length === N && r.holdout[N][M].bP.every(Number.isFinite))));
    if (J.prefix) g.prefixSame = J.prefix.compared > 0 && J.prefix.same === J.prefix.compared;
  }
  return g;
}

/* ───────── 第315便d の走行との照合(最初の 32 公転 —— 同じ本・同じ步)───────── */
export function prefixOf(J, Js) {
  const out = { source: SATK1_OUT, compared: 0, same: 0, diff: [] };
  if (!Js || !Js.E) return Object.assign(out, { note: '第315便d の正本が無い' });
  for (const r of Object.values(J.E.rows)) { if (r.status !== 'run') continue;
    const k = X315.specKey(Object.assign({}, r.spec, { N: Js.E.runN })), o = Js.E.rows[k]; if (!o || o.status !== 'run') continue;
    for (const N of Js.E.windows) { if (!r.windows[N] || !o.windows[N]) continue; out.compared++;
      const same = ['sidDays', 'aps', 'node', 'axSat', 'axPar', 'eMean', 'incMeanDeg'].every((f) => Object.is(r.windows[N][f], o.windows[N][f]));
      if (same) out.same++; else if (out.diff.length < 8) out.diff.push(k + '@' + N); } }
  return out;
}

/* ───────── 走行の計画 ───────── */
/** 正本の行を細くする(段 A・V が使わない q00 の保留の窓の残差と公転ごとの離心率ベクトルを落とす —— 子の出力と再開の写しは全部を持つ) */
export const slimRow = (r) => { if (!r || r.status !== 'run' || r.spec.kind !== 'q00') return r; const o = Object.assign({}, r); delete o.holdout; delete o.evec; o.slim = true; return o; };
/** 数だけの配列を 1 行に畳む(JSON の中身は同じ —— 正本の大きさを抑える) */
export const packJson = (J) => JSON.stringify(J, null, 1).replace(/\[\n\s*((?:-?[\d.eE+-]+|null)(?:,\n\s*(?:-?[\d.eE+-]+|null))*)\n\s*\]/g, (m, body) => '[' + body.replace(/,\n\s*/g, ',') + ']');
export async function runSath(HP, o) {
  const parts = o.parts, P = o.plan, sats = o.sats, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'sath', quick: !!o.quick, parts, sats: sats.slice(), kernel: 'k1', rule: 'rdRule:"kappaM"(全天体 R_d = Y_k m —— 鍵の名は r_d・説明は R_d)', plan: clone(P), band: clone(X315.SAT_BAND), harmRule: clone(HARM_RULE),
    models: MODELS.map((m) => ({ key: m.key, KD: m.KD, ja: m.ja })), exclude: clone(EXCLUDE) };
  J.book = { units: clone(L.UNITS), softening: L.SOFTENING, radiusFloor: L.RADIUS_FLOOR, integrator: L.INTEGRATOR, gLoc: clone(L.GLOC), offDrag: clone(L.OFF_DRAG), k1Drag: clone(L.K1_RULE_DRAG),
    declFile: L.DECL_FILE, parents: clone(L.PARENTS), seedBooks: ['jupiterGalilean', 'saturnRingReal'], libFrom: 'tests/lib-w315d-satk1.mjs(bookOf・seedOf・attachSatSampler・windowOf)',
    phaseInput: '母惑星から見た太陽の向きの、衛星の t = 0 の軌道面の基底での角 λ☉(凍結の写しの太陽と「母惑星 + 衛星の重心」の t = 0 の状態からのケプラーの二体の解 —— 二体と三体で同じ入力・同じ時刻の標本〔h ごと〕)',
    notIncluded: ['母惑星の J₂ と潮汐(在位の本が持たない —— 第315便d と同じ)', '他の衛星と他の惑星(衛星ごとに 1 本 —— 第315便d と同じ)'] };
  J.T = { systems: X315.targetsOf(HP, sats) }; tick('T');
  if (parts.includes('E')) {
    const rows = {}, specs = [];
    for (const sat of sats) for (const sys of P.systems) for (const d of P.divs) for (const kind of P.kinds) specs.push({ sat, sys, kind, S: P.stepsPerOrbit, div: d, N: P.runN, wins: P.windows.slice(), holdout: P.holdout.slice() });
    await Promise.all(specs.map((sp) => o.run(sp, (L.KINDS[sp.kind].drag ? 100 : 1) * sp.div * (sp.sys === 'three' ? 2 : 1)).then((r) => { rows[r.key] = slimRow(r); o.log(r); return r; })));
    J.E = { sats: sats.slice(), systems: P.systems.slice(), kinds: P.kinds.slice(), runN: P.runN, windows: P.windows.slice(), startWindow: P.startWindow, holdout: P.holdout.slice(), divs: P.divs.slice(), stepsPerOrbit: P.stepsPerOrbit, rows };
    J.prefix = prefixOf(J, o.satk1 || null);
    tick('E');
  }
  if (J.E && parts.includes('A')) { J.A = partA(J); tick('A'); }
  if (J.E && parts.includes('C')) { J.C = partC(J); tick('C'); }
  if (J.E && parts.includes('V')) { J.V = partV(J); tick('V'); }
  if (J.E) J.cost = X315.costOf(J);
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r.status === 'run') : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W316D_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpecH(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W316D_QUICK === '1';
  const OUT = process.env.W316D_OUT ? (path.isAbsolute(process.env.W316D_OUT) ? process.env.W316D_OUT : path.join(ROOT, process.env.W316D_OUT)) : path.join(ROOT, OUT_SATH);
  if (quick && !process.env.W316D_OUT) throw new Error('試走(W316D_QUICK=1)は W316D_OUT を指定する(正本を書かない)');
  const parts = process.env.W316D_PARTS ? process.env.W316D_PARTS.split(',') : PARTS.slice();
  const sats = process.env.W316D_SATS ? process.env.W316D_SATS.split(',') : SATS.slice();
  if (sats.some((k) => !L.satOf(k))) throw new Error('W316D_SATS は ' + SATS.join(',') + ' から');
  if (!process.env.W316D_OUT && (sats.length !== SATS.length || parts.length !== PARTS.length)) throw new Error('正本は全段・6 衛星(一部は W316D_OUT へ)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  let satk1 = null; try { satk1 = JSON.parse(fs.readFileSync(path.join(ROOT, SATK1_OUT), 'utf8')); } catch (e) { satk1 = null; }
  const NW = Math.max(1, Number(process.env.W316D_WORKERS) || 2), cstat = { resumed: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W316D_CACHE ? path.resolve(process.env.W316D_CACHE) : null, targetSha256, cstat);
  const log = (r) => { const w = r.windows ? r.windows[r.spec.N] : null, f = w && w.fits ? w.fits : null;
    console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・近点 L ' + (f && f.L ? f.L.aps.toExponential(9) : '—') + '・H1 ' + (f && f.H1 ? f.H1.aps.toExponential(6) : '—')
      + '・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`); };
  const plan = quick ? QUICK : PLAN;
  console.log('第316便d sath: ' + (quick ? '試走' : '正本') + '・workers ' + NW + '・段 ' + parts.join(',') + '・衛星 ' + sats.join(','));
  const R = await runSath(HP, { quick, parts, plan, sats, run, log, satk1 });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, satk1Version: X315.HARNESS_VERSION, generator: 'tests/exp-w316d-sath.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の裁定(第118報)・決断事項 AN423(衛星の表の代表は二体の引きずりの効き・三体は太陽の効きの記録〔合否の数にしない〕・太陽の位相の調和の回帰で三体の永年の効きが帯の内で決まるかを診断)・'
      + 'AN424(トリトンの近点は値と未解決の理由を残して判定から外す・離心率ベクトルの差を記録)・統括の検証項目 R249。確認の材料(在位へ入れない —— 近似要素の種は観測レコードではない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w316d-sath.mjs', 'tests/exp-w315d-satk1.mjs', 'tests/lib-w315d-satk1.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第316便d', target: TARGET, code: CODE, inputs: [TARGET, L.DECL_FILE, SATK1_OUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'sath',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W316D_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, packJson(out) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', out.A ? JSON.stringify(Object.fromEntries(Object.entries(out.A.systems).map(([k, v]) => [k, v.verdict]))) : '');
}
if (IS_MAIN) await main();

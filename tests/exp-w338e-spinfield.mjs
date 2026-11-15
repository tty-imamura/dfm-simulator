// 第338便e(原仮定者の回答(2026-11-15 —— 第138報の回答 4)「⑩は、パルサー以外でどうなるか、パルサーは軸を傾けたらどうなるか、を検証してから判断」・
//   原仮定者の回答(2026-11-14 —— AN723 = A)「次に足すノブは源の詰まり具合(質量 ÷ 距離)のべき」・統括の検証項目 R353):
//   **慣性移動の加減速の差の候補 —— ⑩(源の自転を場の速度に入れる読み)の検証 2 つと源の詰まり具合のノブの器**
//   T1 連星パルサー以外の系(惑星・衛星・恒星の連星・白色矮星を含む連星・中性子星と白色矮星の連星)に ⑩ を当てる/T2 連星パルサーの自転の軸を 0°〜180° に傾ける・R_d の外で剛体でない場の型/
//   T3 非対称の係数に詰まり具合 (Ξ/Ξ_ref)^k を掛ける/T4 ⑩ と k を同時に入れる
//   (段 spinfield-338e —— 正本 tests/out/spinfield-338e.json・lib tests/lib-w338e-spinfield.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第337便までの lib の本文は変えない。
//   ⑩ の扱い(廃止/候補)は決めない(原仮定者の判断の材料の表)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w338e-spinfield.mjs —— 領域の宣言なし)。入力のファイルは無い。1 プロセス。
//
// ■ 走らせたノブの格子と判定の物差し(正本の先頭 —— 式の形の宣言ではなく、何を測ったかの記録)
//   T1: 系 25(lib の SYSTEMS)× 場の型 5(none・rigid・pow1・pow2・sphere)× 列 3(L1・S0・S0a —— 単位のノブ)の求積(4096 点)。主の読み(受け手だけ/両方)は系ごと。軸は系の行の θ(トリトンだけ 157.345°)。
//     物差し: 場の速さ |U_s|/c の最大(受け手の位置)・|u|/c の最大・赤道の速さ s R/c・効き(合わせた上限のノブ〔T3 の k = 0・none〕での ȧ/a と ϖ̇)・⑩ を入れない読みとの比・観測の目安のある 5 系では目安との比。
//   T2: 二重中性子星 5(J0737・B1913・B1534・J1757・J1946)× 軸の角 θ 0°〜180°(15° 刻み)× 射影の向き φ 0°・90°(rigid)と θ 0・45・90・135・180°・φ 0°(pow1・pow2・sphere)× 列 2(L1・S0)の求積(2048 点)。
//     両方の天体の軸を同じ θ・φ に置いた(伴星の自転が 0 の系は伴星の軸の向きは効かない)。参考の角(文献の値・未照合)の行も。
//   T3: 列 3(L1・S0・S0a)× k ∈ {0, 0.5, …, 4}(none の読み)の 5 系の上限(第337便d と同じ観測の目安)・合わせた上限・決める系・広がり・水星 ÷ J0737 の上限の比。k = 0 は第337便d の値と同じ(門)。
//     k* = 水星と J0737 の上限が等しい k(二分法)と、比が 10 倍の内の帯。物差し(読み): 「同じ桁の効き」= 1 つのノブの値で水星と J0737 の上限の比が 0.1〜10(5 系の広がり ≤ 10 は強い読み)。
//   T4: 場の型 4(rigid・pow1・pow2・sphere)× k(T3 と同じ格子)× 列 2(L1・S0)の 5 系の上限(2048 点)・k*。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w337d-accelloss.mjs';
import * as E from './lib-w338e-spinfield.mjs';
import * as X337 from './exp-w337d-accelloss.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w338e-spinfield-1';
export const AMEND = Object.freeze([]);
export const OUT_MAIN = 'tests/out/spinfield-338e.json';
export const TARGET = 'tests/lib-w338e-spinfield.mjs';   // html を読まない器の来歴の対象(純関数)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const YR = E.DECL.yearS, ARCSEC = Math.PI / (180 * 3600);
export const NOT_CLAIM = Object.freeze(['場の型は読みの候補(慣性移動の則ではない)', '「光速を超える」は受け手の位置の場の速度(源の座標の剛体の回転を受け手の距離まで伸ばした速さ)の量で、物体の速さではない',
  'ノブの上限は観測の目安(文献の値・未照合・桁の目安)との比 —— 損失が在る/無いの断定ではない', '⑩ の扱い(廃止/候補)はこの器では決めない —— 原仮定者の判断の材料の表',
  '詰まり具合のべきの k* は 2 系の上限を等しくする値の記録(ノブの値の採用ではない)', '軸の角の参考の値は文献の値・未照合']);
/** 器の宣言(走らせた格子) */
export const PLAN = Object.freeze({
  t1: Object.freeze({ fields: Object.freeze(['none', 'rigid', 'pow1', 'pow2', 'sphere']), cols: Object.freeze(['L1', 'S0', 'S0a']), nQ: 4096 }),
  t2: Object.freeze({ systems: Object.freeze(['j0737', 'b1913', 'b1534', 'j1757', 'j1946']), thetas: Object.freeze([0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180]), phis: Object.freeze([0, 90]),
    falloff: Object.freeze(['pow1', 'pow2', 'sphere']), falloffThetas: Object.freeze([0, 45, 90, 135, 180]), cols: Object.freeze(['L1', 'S0']), nQ: 2048 }),
  t3: Object.freeze({ cols: Object.freeze(['L1', 'S0', 'S0a']), ks: Object.freeze([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]), nQ: 4096, kRange: Object.freeze([-8, 8]), kStep: 0.05, bisect: 50 }),
  t4: Object.freeze({ fields: Object.freeze(['rigid', 'pow1', 'pow2', 'sphere']), cols: Object.freeze(['L1', 'S0']), nQ: 2048 }),
  judge: Object.freeze({ sameOrder: 10, zeroFloor: E.DECL.zeroFloor,
    zeroNote: '正本の値: 解析的に 0 の量・打ち消しの残りは、同じ単位の尺度(ȧ: L 系 a・型 2 a n/ė・ϖ̇・面の傾きの率: L 系 1・型 2 n/熱: μGM/a × P〔型 2 は × n〕—— 詰まり具合の因子の平均と amp = max(1, |u| の最大 ÷ √(GM/a))〔熱は amp²〕を掛ける)に対して 1e-12 より小さければ 0 と書く・場の速さの成分は |U_s| の最大に対して・水星 ÷ J0737 の比の log10 は 1e-6 の格子に寄せる(k* で 0)' }),
});

/* ───────── 小さな道具 ───────── */
const PICK = ['adot', 'edot', 'wdot', 'tiltRate', 'PdotOverP', 'Qorb', 'ledgerRel', 'usMaxOverC', 'usInMeanOverC', 'usPerpMeanOverC', 'usInMaxOverC', 'usPerpMaxOverC', 'uMaxOverC', 'compMean'];
function rates(key, field, col, { k = 0, thetaDeg = null, phiDeg = 0, nQ = 4096, mode = null } = {}) {
  const S = E.sysFor(key, { thetaDeg, phiDeg, mode, spinOn: field !== 'none' });
  const R = E.snapRates(E.secularF(S, col, 1, E.cfgFor(key, field, k), { nQ }), S, col);
  return { S, R: Object.fromEntries(PICK.map((x) => [x, R[x]])) };
}

/* ───────── T3(先に —— T1 の効きは T3 の k = 0 の合わせた上限を使う) ───────── */
function boundTable(field, col, k, nQ) {
  const per = [];
  for (const key of E.BOUND_KEYS) {
    const B = E.boundOf(key), { S, R } = rates(key, field, col, { k, nQ }), rate = E.boundRate(B.kind, R, S);
    per.push({ key, kind: B.kind, bound: B.value, rate, kMax: rate > 0 ? B.value / rate : null });
  }
  const ok = per.filter((p) => fin(p.kMax));
  const mn = ok.reduce((a, b) => (b.kMax < a.kMax ? b : a)), mx = ok.reduce((a, b) => (b.kMax > a.kMax ? b : a));
  const m = per.find((p) => p.key === 'mercury'), j = per.find((p) => p.key === 'j0737');
  const ratioMJ = fin(m.kMax) && fin(j.kMax) ? m.kMax / j.kMax : null;
  return { field, col, k, perSystem: per, joint: mn.kMax, binding: mn.key, loosest: mx.key, spread: mx.kMax / mn.kMax, ratioMJ, log10MJ: ratioMJ === null ? null : Math.round(Math.log10(ratioMJ) * 1e6) / 1e6,   // k* では解析的に 0 —— 1e-6 の格子に寄せて書く(k* の 1e-9 の丸めの残りを値のまま書かない)
    sameOrderMJ: ratioMJ !== null && Math.abs(Math.log10(ratioMJ)) <= Math.log10(PLAN.judge.sameOrder), sameOrderAll: mx.kMax / mn.kMax <= PLAN.judge.sameOrder };
}
/** 水星 ÷ J0737 の上限の比の log10 を k の関数で(速い形 adotOfK) */
function mjFn(field, col, nQ) {
  const mk = (key) => { const S = E.sysFor(key, { spinOn: field !== 'none' }), B = E.boundOf(key), f = E.adotOfK(S, col, E.cfgFor(key, field, 0), { nQ }); return (k) => B.value / E.boundRate(B.kind, { adot: f(k), PdotOverP: 1.5 * f(k) / S.a }, S); };
  const fm = mk('mercury'), fj = mk('j0737');
  return (k) => Math.log10(fm(k) / fj(k));
}
/** k* の丸め: 二分法の幅より粗い 1e-9 の格子に寄せる(Node の版で末尾の bit が違っても同じ値) */
const roundK = (k) => (k === null ? null : Math.round(k * 1e9) / 1e9);
/** 格子(kRange を kStep で)で走査 → 符号の変わる所を二分法で: 根(比 = 1)と、|log10 比| ≤ 1 の帯(複数あり得る —— 単調とは限らない) */
function kStar(field, col, nQ) {
  const f = mjFn(field, col, nQ), [k0, k1] = PLAN.t3.kRange, st = PLAN.t3.kStep, ks = [];
  for (let k = k0; k <= k1 + 1e-12; k += st) ks.push(Math.round(k * 1e6) / 1e6);
  const vs = ks.map(f);
  const refine = (g, lo, hi) => { let glo = g(lo); for (let i = 0; i < PLAN.t3.bisect; i++) { const mid = (lo + hi) / 2, gm = g(mid); if (gm * glo <= 0) hi = mid; else { lo = mid; glo = gm; } } return roundK((lo + hi) / 2); };
  const roots = [], edges = [];
  for (let i = 1; i < ks.length; i++) {
    if (!(fin(vs[i - 1]) && fin(vs[i]))) continue;
    if (vs[i - 1] * vs[i] <= 0 && vs[i - 1] !== vs[i]) roots.push(refine(f, ks[i - 1], ks[i]));
    for (const t of [-1, 1]) if ((vs[i - 1] - t) * (vs[i] - t) < 0) edges.push(refine((k) => f(k) - t, ks[i - 1], ks[i]));
  }
  const inside = (k) => Math.abs(f(k)) <= 1;
  const pts = [k0, ...edges.sort((x, y) => x - y), k1], bands = [];
  for (let i = 1; i < pts.length; i++) if (pts[i] > pts[i - 1] && inside((pts[i - 1] + pts[i]) / 2)) bands.push([pts[i - 1], pts[i]]);
  const kS = roots.length ? roots.reduce((x, y) => (Math.abs(y) < Math.abs(x) ? y : x)) : null;
  return { field, col, roots, kStar: kS, bands, atStar: kS === null ? null : boundTable(field, col, kS, nQ) };
}
export function t3Rows() {
  const p = PLAN.t3, grid = [];
  for (const col of p.cols) for (const k of p.ks) grid.push(boundTable('none', col, k, p.nQ));
  const stars = p.cols.map((col) => kStar('none', col, p.nQ));
  return { grid, stars };
}
/** 第337便d の合わせた上限(器の t3Rows・jointOf を呼ぶ)と k = 0 の値を照らす */
export function check337(t3) {
  const J = X337.jointOf(X337.t3Rows()), out = {};
  for (const col of PLAN.t3.cols) {
    const g = t3.grid.find((r) => r.col === col && r.k === 0);
    out[col] = { joint337: J[col].joint, binding337: J[col].binding, spread337: J[col].spread, rel: Math.abs(g.joint / J[col].joint - 1) < 1e-12 ? 0 : Math.abs(g.joint / J[col].joint - 1), sameBinding: g.binding === J[col].binding };
  }
  return out;
}

/* ───────── T1 ───────── */
export function t1Rows(t3) {
  const p = PLAN.t1, rows = [];
  const joint = Object.fromEntries(p.cols.map((col) => [col, t3.grid.find((r) => r.col === col && r.k === 0).joint]));
  for (const key of E.SYSTEM_KEYS) {
    const d = E.SYSTEMS[key], B = E.boundOf(key), a = E.aOf(key);
    const S0 = E.sysFor(key, { spinOn: false }), Sr = E.sysFor(key);
    const sMag = E.SYSTEMS[key].s2 === 'sync' ? S0.n : d.s2;
    const fields = {};
    for (const fld of p.fields) {
      const cols = {};
      for (const col of p.cols) {
        const { S, R } = rates(key, fld, col, { nQ: p.nQ });
        const eff = { adotRelPerYr: R.adot / S.a * YR * joint[col], wdotArcsecPerYr: R.wdot === null ? null : R.wdot * YR * joint[col] / ARCSEC };
        const frac = B ? E.boundRate(B.kind, R, S) * joint[col] / B.value : null;
        cols[col] = Object.assign({}, R, { atJoint: eff, fracOfBound: frac });
      }
      fields[fld] = cols;
    }
    const off = fields.none, rig = fields.rigid;
    const ratio = (col) => (off[col].adot !== 0 ? rig[col].adot / off[col].adot : null);
    rows.push({ key, kind: d.kind, name: d.name, mode: d.main, a, e: d.e, P: S0.P, n: S0.n, theta: d.theta, xi: E.DECL.G * d.m2 / (E.DECL.c * E.DECL.c * a), xiOverRef: E.DECL.G * d.m2 / (E.DECL.c * E.DECL.c * a) / E.XI_REF,
      Rd2: E.rdOf(d.m2), equatorOverC: sMag * d.R2 / E.DECL.c, spinOverN: sMag / S0.n, vOrbOverC: Math.sqrt(S0.GM / a) / E.DECL.c,
      bound: B, fields,
      flags: { fieldSuperluminal: rig.L1.usMaxOverC > 1, relSuperluminal: rig.L1.uMaxOverC > 1, l1SignFlip: rig.L1.adot !== 0 && off.L1.adot !== 0 && Math.sign(rig.L1.adot) !== Math.sign(off.L1.adot), l1ZeroRigid: rig.L1.adot === 0,
        ratioL1: ratio('L1'), ratioS0: ratio('S0'), falloffMaxOverC: Math.max(fields.pow1.L1.usMaxOverC, fields.pow2.L1.usMaxOverC, fields.sphere.L1.usMaxOverC) } });
    void Sr;
  }
  return { joint, rows };
}

/* ───────── T2 ───────── */
export function t2Rows() {
  const p = PLAN.t2, rows = [];
  for (const key of p.systems) {
    const d = E.SYSTEMS[key], sMag = d.s2;
    const add = (fld, th, ph) => {
      const cols = {};
      for (const col of p.cols) cols[col] = rates(key, fld, col, { thetaDeg: th, phiDeg: ph, nQ: p.nQ }).R;
      rows.push({ key, field: fld, theta: th, phi: ph, cols });
    };
    for (const th of p.thetas) for (const ph of p.phis) add('rigid', th, ph);
    for (const fld of p.falloff) for (const th of p.falloffThetas) add(fld, th, 0);
    if (E.TILT_LIT[key]) for (const fld of ['rigid', 'sphere']) add(fld, E.TILT_LIT[key].deg, 0);
    void sMag;
  }
  // 系ごとの要約(rigid・φ 0): 軸の角ごとの L1 と S0 の ȧ ÷ θ = 0 の ȧ・場の速さ(最大・面の内・面に垂直)・赤道の速さ
  const summary = p.systems.map((key) => {
    const d = E.SYSTEMS[key], S = E.sysFor(key), z = (th, fld = 'rigid') => rows.find((r) => r.key === key && r.field === fld && r.theta === th && r.phi === 0);
    const r0 = z(0);
    return { key, equatorOverC: d.s2 * d.R2 / E.DECL.c, aOverC: S.a / E.DECL.c, sA: d.s2,
      byTheta: p.thetas.map((th) => { const r = z(th); return { theta: th, usMaxOverC: r.cols.L1.usMaxOverC, usInMaxOverC: r.cols.L1.usInMaxOverC, usPerpMaxOverC: r.cols.L1.usPerpMaxOverC, uMaxOverC: r.cols.L1.uMaxOverC,
        L1ratio: r0.cols.L1.adot !== 0 ? r.cols.L1.adot / r0.cols.L1.adot : null, S0ratio: r0.cols.S0.adot !== 0 ? r.cols.S0.adot / r0.cols.S0.adot : null, L1tilt: r.cols.L1.tiltRate, S0tilt: r.cols.S0.tiltRate }; }),
      falloff: p.falloff.map((fld) => { const r = z(0, fld), o = rates(key, 'none', 'L1', { nQ: p.nQ }).R, oS = rates(key, 'none', 'S0', { nQ: p.nQ }).R;
        return { field: fld, usMaxOverC: r.cols.L1.usMaxOverC, L1overNone: o.adot !== 0 ? r.cols.L1.adot / o.adot : null, S0overNone: oS.adot !== 0 ? r.cols.S0.adot / oS.adot : null }; }) };
  });
  return { rows, summary };
}

/* ───────── T4 ───────── */
export function t4Rows() {
  const p = PLAN.t4, grid = [];
  for (const fld of p.fields) for (const col of p.cols) for (const k of PLAN.t3.ks) grid.push(boundTable(fld, col, k, p.nQ));
  const stars = [];
  for (const fld of p.fields) for (const col of p.cols) stars.push(kStar(fld, col, p.nQ));
  return { grid, stars };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const ks = PLAN.t3.ks;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    t3Complete: J.t3.grid.length === PLAN.t3.cols.length * ks.length && J.t3.grid.every((r) => fin(r.joint) && r.joint > 0),
    t3Same337: Object.values(J.check337).every((c) => c.rel === 0 && c.sameBinding),
    t1Complete: J.t1.rows.length === E.SYSTEM_KEYS.length && J.t1.rows.every((r) => PLAN.t1.fields.every((f) => PLAN.t1.cols.every((c) => fin(r.fields[f][c].adot)))),
    t1Ledger: J.t1.rows.every((r) => PLAN.t1.fields.every((f) => PLAN.t1.cols.every((c) => r.fields[f][c].ledgerRel <= 1e-9))),
    t2Complete: J.t2.rows.length === PLAN.t2.systems.length * (PLAN.t2.thetas.length * PLAN.t2.phis.length + PLAN.t2.falloff.length * PLAN.t2.falloffThetas.length) + 2 * Object.keys(E.TILT_LIT).length,
    t2CosLinear: J.t2.summary.every((s) => { const b = s.byTheta, a0 = b[0].L1ratio, a180 = b[b.length - 1].L1ratio, m = b.find((x) => x.theta === 90).L1ratio; return Math.abs(m - (a0 + a180) / 2) <= 1e-6 * Math.max(Math.abs(a0), Math.abs(a180)); }),
    t4Complete: J.t4.grid.length === PLAN.t4.fields.length * PLAN.t4.cols.length * ks.length && J.t4.grid.every((r) => fin(r.joint) && r.joint > 0),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = E.pureScenes(), pure = { scenes: PS, gates: E.pureGates(PS) }; mark('pure');
  const t3 = t3Rows(); mark('t3');
  const c337 = check337(t3); mark('check337');
  const t1 = t1Rows(t3); mark('t1');
  const t2 = t2Rows(); mark('t2');
  const t4 = t4Rows(); mark('t4');
  const J = { pure, t3, check337: c337, t1, t2, t4, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };
export const CODE = Object.freeze(['tests/exp-w338e-spinfield.mjs', 'tests/lib-w338e-spinfield.mjs', 'tests/exp-w337d-accelloss.mjs', 'tests/lib-w337d-accelloss.mjs', 'tests/lib-w335b-carryledger.mjs',
  'tests/lib-w334b-ledger.mjs', 'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w332b-transgeo2.mjs',
  'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w331c-k1scale.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs',
  'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w272e-provenance.mjs']);
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W338E_OUT ? (path.isAbsolute(process.env.W338E_OUT) ? process.env.W338E_OUT : path.join(ROOT, process.env.W338E_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第338便e spinfield(版 ' + HARNESS_VERSION + ')');
  const R = runAll();
  const out = { version: HARNESS_VERSION, libVersion: E.LIB_VERSION, generator: 'tests/exp-w338e-spinfield.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-15 —— 第138報の回答 4)「⑩は、パルサー以外でどうなるか、パルサーは軸を傾けたらどうなるか、を検証してから判断」・原仮定者の回答(AN723 = A)・統括の検証項目 R353',
    decl: E.DECL, xiRef: E.XI_REF, fields: E.FIELDS, systems: E.SYSTEMS, tiltLit: E.TILT_LIT, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第338便e', target: TARGET, code: CODE, inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spinfield', engine: 'Node の純関数だけ(html を読まない・エンジンの步を進めない —— 自前の求積)', notClaim: NOT_CLAIM,
    zeroFloor: { floor: E.DECL.zeroFloor, scales: PLAN.judge.zeroNote } });
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

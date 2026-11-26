// 第356便d(統括の検証項目 R516): **論文 5 の「斥力に見えたのは引きずり」を数で見られる形にする診断の器**
//   斥力の項は 0。同じ初めの位置・速さ・スピン・同じ壁で 4 条件 —— (T) 並進だけ〔基準〕/(T+D) 並進引きずりを足す/(T+S) スピンに由来する引きずりを足す/(T+D+S) 両方 ——
//   (S) は候補 2 つ((S1) 引きずる側の回転を使った座標変換の分/(S2) いまのスピン斥力の式の向きと大きさを引きずりの速さとして)・スピンを逆にした走行を並べる。
//   表 pair 近づく 2 粒(衝突径数 0・0.5・1・2)/表 box 粒 64 の箱の圧力と 3 つの冪(第355便i と同じ測り方)/表 big 粒 216 の箱の密度の冪/表 knob 係数・壁・読みのノブ(中の密度)/
//   表 gate 熱を生まないことの検査(温度の尺度の掛け直しをしない走行)/表 step 刻み h と h/2/表 cmp 比べる列(第355便i の正本から読む —— 走らせ直さない)/零試験 12
//   (段 drageos-356d —— 正本 tests/out/drageos-356d.json・lib tests/lib-w356d-drageos.mjs)。
//   **診断だけ** —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。三次元の受理の門は変えない。列は選ばない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w356d-drageos.mjs —— 領域の宣言なし)。入力のファイルは第355便i の正本 1 つ(比べる列の数を読むだけ)。1 プロセス。
//   正本は第338便c の settleRun で書く。仮の値の lib は閉包に入らない。乱数は使わない(定めた種の線形合同)。
//
// ■ 言わないこと: アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。斥力を引きずりで言い切る文・圧力の出どころを引きずりと言い切る文は書かない。どの列が主かは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w356d-drageos.mjs';
import * as H from './lib-w355g-heat3d.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w356d-drageos-1';
export const OUT_MAIN = 'tests/out/drageos-356d.json';
export const TARGET = 'tests/lib-w356d-drageos.mjs';
export const IN_CMP = 'tests/out/replaw-355i.json';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。現実の宇宙の主張はしない',
  '斥力を引きずりで言い切る文・圧力の出どころを引きずりと言い切る文は書かない —— この器・このノブでの数(最接近の距離・曲がり・圧力・冪)を並べるだけ。冪は「窓の内/外」と書く',
  'どの列が主か(引きずりをどの項で読むか)は選ばない —— 候補 (D)(S1)(S2) を並べる',
  'アプリの積分・受理の門・内蔵の本へは入れない',
  '係数 c_D・c_S1・c_S2・時間の物差し τ_s・自分の重みの読み(B)・壁の硬さ・粒の半径・スピンの大きさ s₀(T) は器のノブ(値は玩具の単位 —— 未照合)・粒 64 の小さな箱(壁の近くの粒の割合が大きい)']);
/** 条件(4 条件 × 候補 × スピンの向き —— (S2) はスピンを逆にしても同じ式なので逆の行は持たない〔零試験 z10〕) */
const C = (cond, sKind = 'S1', spin = 1) => Object.freeze({ id: L.condId(cond, sKind, spin), cond, sKind, spin });
export const CONDS = Object.freeze([C('T'), C('TD'), C('TS', 'S1'), C('TS', 'S1', -1), C('TS', 'S2'), C('TDS', 'S1'), C('TDS', 'S1', -1), C('TDS', 'S2')]);
export const BIG_IDS = Object.freeze(['T', 'TD', 'TS-S1', 'TS-S2', 'TDS-S1']);
export const KNOBS = Object.freeze([
  Object.freeze({ id: 'TD/cD0.25', base: 'TD', o: Object.freeze({ cD: 0.25 }) }), Object.freeze({ id: 'TD/cD0.5', base: 'TD', o: Object.freeze({ cD: 0.5 }) }),
  Object.freeze({ id: 'TD/n1', base: 'TD', o: Object.freeze({ nW: 1 }) }),
  Object.freeze({ id: 'TS-S1/cS0.5', base: 'TS-S1', o: Object.freeze({ cS1: 0.5 }) }), Object.freeze({ id: 'TS-S2/cS0.3', base: 'TS-S2', o: Object.freeze({ cS2: 0.3 }) }),
  ...['TD', 'TS-S1', 'TS-S2', 'TDS-S1'].map((b) => Object.freeze({ id: b + '/clip', base: b, o: Object.freeze({ wallClip: true }) })),
  ...['TD', 'TS-S1', 'TS-S2', 'TDS-S1'].map((b) => Object.freeze({ id: b + '/force', base: b, o: Object.freeze({ reading: 'force' }) })),
]);
export const PLAN = Object.freeze({
  pure: '零試験 12(係数 0 で (T) = 第355便g の simulate・全部の粒が同じ速さで (D) 0・1 粒で 0・質量の同じ 2 粒の対称・スピン 0 で (S1)(S2) 0・(D) = 第337便e の cellDrag・2 粒の閉じた形 (w_ii − w) ÷ (w_ii + w)・座標変換の口は慣性の速さと内部の温度とスピンを変えない・ガリレイの変換・スピンを逆に〔(S1) 逆・(S2) 同じ〕・比べる口の熱の口の閉じ・定めた手順)',
  pair: '表 pair: 近づく 2 粒(壁なし・相対の速さ 1・初めの離れ 12・衝突径数 0・0.5・1・2・スピン s₀(1) ẑ の同じ向き)× 条件 8 × 刻み h・h/2 —— 最接近の距離・入る時と出る時の座標の相対の速さ・出る向きの曲がり(外 = 衝突径数の側)・出ていくか。比べる口の (T+D) 1 行',
  box: '表 box: 粒 64 の箱 × 条件 8 × 刻み h・h/2 —— 圧力(壁の単位面積・単位時間の法線の力積)・3 つの冪(密度〔箱を振る ρ 0.02・0.08・0.32〕・密度〔粒の数を振る 27・64・125 —— 箱の一辺は ρ 0.08 の値〕・温度〔T 0.5・1・2〕)・(T) との圧力の比',
  big: '表 big: 粒 216 の箱の密度〔箱を振る〕の冪(条件 5 —— T・TD・TS-S1・TS-S2・TDS-S1・刻み h)',
  knob: '表 knob: 中の密度(ρ 0.08・粒 64・刻み h)で係数(c_D 0.25・0.5・次数 n 1・c_S1 0.5・c_S2 0.3)・壁の中の奥へ向く引きずりを 0(clip)・力として効く読み(force)の圧力と (T) との比',
  gate: '表 gate: 熱を生まないことの検査 —— 粒 64・ρ 0.08・3000 步・温度の尺度の掛け直しをしない走行で、内部の温度の和・スピンのエネルギー・並進の運動エネルギー・壁の位置のエネルギーの前後の増減(条件 8 × 刻み h・h/2 + ノブの clip と force)',
  cmp: '表 cmp: 比べる列 —— 第355便i の正本の「いまの形の斥力(強さ 1 倍)+ 並進」(表 A7 の組 G/c-/p0 の全体の圧力から作った冪)と表 B の A3-L0t の倍 1(走らせ直さない)',
});

const r9 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? x : Number(x.toFixed(9));
const r6 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? x : Number(x.toFixed(6));
const condOf = (id) => CONDS.find((c) => c.id === id);
const specOf = (c, o = {}) => Object.assign({ cond: c.cond, sKind: c.sKind, spin: c.spin }, o);

export function pairRows() {
  const rows = [];
  for (const c of CONDS) for (const b of L.DECL.pair.bGrid) for (const hf of [1, 2]) {
    const r = L.pairRun({ b, cond: c.cond, sKind: c.sKind, spin: c.spin, hf });
    rows.push({ id: c.id, b, hf, minD: r.minD, vIn: r.vIn, vOut: r.vOut, escaped: r.escaped, dEnd: r.dEnd, theta: r9(r.theta), outPlane: r9(r.outPlane) });
  }
  for (const b of L.DECL.pair.bGrid) { const r = L.pairRun({ b, cond: 'TD', reading: 'force' }); rows.push({ id: 'TD/force', b, hf: 1, minD: r.minD, vIn: r.vIn, vOut: r.vOut, escaped: r.escaped, dEnd: r.dEnd, theta: r9(r.theta), outPlane: r9(r.outPlane) }); }
  return { dStar: L.pairRun({ b: 0, cond: 'TD' }).dStar, rows };
}
const powRow = (p) => ({ rhoPts: p.rhoPts, tPts: p.tPts, nPts: p.nPts, aBox: p.aBox, aN: p.aN, aT: p.aT, pMid: p.pMid, pOverRhoTMid: p.pOverRhoTMid });
export function boxRows() { return CONDS.flatMap((c) => [1, 2].map((hf) => Object.assign({ id: c.id, hf }, powRow(L.powers(specOf(c), { hf }))))); }
export function bigRows() { return BIG_IDS.map((id) => { const c = condOf(id), pb = L.DECL.rho3.map((rho) => L.point(specOf(c), rho, 1, { N: L.DECL.nBig })); return { id, N: L.DECL.nBig, pts: pb.map((p) => ({ rho: p.rho, P: p.P, Ttr: p.Ttr })), aBox: H.slope(pb.map((p) => p.rho), pb.map((p) => p.P)) }; }); }
export function knobRows() { return KNOBS.map((k) => { const p = L.point(specOf(condOf(k.base), k.o), 0.08, 1); return { id: k.id, base: k.base, o: k.o, P: p.P, Ttr: p.Ttr, pOverRhoT: p.P / (p.rho * 1) }; }); }
export const gRow = (id, hf, g) => ({ id, hf, ke0: g.ke0, pe0: g.pe0, dKE: r6(g.dKE), dPE: r6(g.dPE), dE: r6(g.dE), dTint: r9(g.dTint), dEs: r9(g.dEs), heatIn: r6(g.heatIn), gainNoSrc: r6(g.gainNoSrc), tint0: g.tint0, es0: g.es0 });
export function gateRows() {
  const out = CONDS.flatMap((c) => [1, 2].map((hf) => gRow(c.id, hf, L.gateRun(specOf(c), { hf }))));
  for (const k of KNOBS.filter((k) => /\/(clip|force)$/.test(k.id))) out.push(gRow(k.id, 1, L.gateRun(specOf(condOf(k.base), k.o))));
  return out;
}
/** 比べる列(第355便i の正本から —— 走らせ直さない) */
export function cmpRows(J) {
  const a = J.a7.find((r) => r.id === 'G/c-/p0'), b = J.b.find((c) => c.col === 'A3-L0t').rows.find((r) => r.mult === 1);
  const sl = (ps, k) => H.slope(ps.map((p) => p[k]), ps.map((p) => p.P));
  return { src: IN_CMP, srcVersion: J.version, a7: { id: a.id, aBox: sl(a.rhoPts, 'rho'), aN: sl(a.nPts, 'rho'), aT: sl(a.tPts, 'T'), pMid: a.rhoPts[1].P, pOverRhoTMid: a.rhoPts[1].P / a.rhoPts[1].rho, aBoxRep: a.aBox, aNRep: a.aN, aTRep: a.aT },
    b: { col: 'A3-L0t', mult: 1, aRho: b.aRho, repOverKin: b.repOverKin, pOverRhoT: b.pOverRhoT } };
}

/** 本体(同期 —— settleRun が Math の関数をずらして走らせ直す) */
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const J = { pure: { scenes: L.pureScenes() } }; mark('pure');
  J.pair = pairRows(); mark('pair');
  J.box = boxRows(); mark('box');
  J.big = bigRows(); mark('big');
  J.knob = knobRows(); mark('knob');
  J.gate = gateRows(); mark('gate');
  J.timing = tm;
  return J;
}
const inW = (z) => z >= L.DECL.window[0] && z <= L.DECL.window[1];
const relD = (a, b) => (a === null || b === null) ? null : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
/** settle の後に足す欄(印・比・刻みの比べ・門 —— ずらした走り直しでは揺れるので settle の後の値から作る) */
export function finish(J, cmpJ) {
  J.pure.gates = L.pureGates(J.pure.scenes);
  // 対: (T) と比べた印(最接近の距離 —— 大 = 斥力に見える向き・小 = 逆の向き/曲がり —— 外 = 斥力に見える向き・内 = 逆)
  for (const r of J.pair.rows) {
    const t = J.pair.rows.find((q) => q.id === 'T' && q.b === r.b && q.hf === r.hf);
    r.dMinD = r9(r.minD - t.minD);
    r.markD = r.dMinD > 1e-3 ? '大' : (r.dMinD < -1e-3 ? '小' : '同');   // 1e-3(距離の物差し —— 刻みの離散の残りを印にしない)
    r.markTheta = !r.escaped ? '出ない' : (r.b === 0 ? (Math.abs(r.theta) > 1e-3 ? '曲がる(衝突径数 0)' : '—') : (r.theta > 1e-3 ? '外' : (r.theta < -1e-3 ? '内' : '—')));
  }
  // 箱: (T) との圧力の比・窓の印
  for (const r of J.box) { const t = J.box.find((q) => q.id === 'T' && q.hf === r.hf); r.pRatioT = r.pMid / t.pMid; r.inWin = inW(r.aBox) && inW(r.aN) && inW(r.aT); }
  for (const r of J.big) { const b64 = J.box.find((q) => q.id === r.id && q.hf === 1); r.aBox64 = b64.aBox; r.shift = r9(r.aBox - b64.aBox); r.inWin = inW(r.aBox); }
  const pT = J.box.find((q) => q.id === 'T' && q.hf === 1).pMid;
  for (const r of J.knob) r.pRatioT = r.P / pT;
  // 熱を生まないことの検査(門): 座標変換の口の走行で、内部の温度の和・スピンのエネルギーが (T) と同じ(増減 0)
  const gT = (hf) => J.gate.find((q) => q.id === 'T' && q.hf === hf);
  // 0 と書いた葉(settle —— 走り直しで大きく散る量)は「散る」の印をつけ、差を作らない(引きずりの走行の dE が丁度 0 になることは無い)
  for (const r of J.gate) { r.scatter = r.id !== 'T' && (r.dE === 0 || r.dKE === 0 || r.dPE === 0); r.dEoverT = r.scatter ? null : r6(r.dE - gT(r.hf).dE); r.noHeat = r.dTint === 0 && r.dEs === 0; }
  // 刻みの比べ(h と h/2)
  J.step = CONDS.map((c) => {
    const a = J.box.find((q) => q.id === c.id && q.hf === 1), b = J.box.find((q) => q.id === c.id && q.hf === 2);
    const pa = J.pair.rows.filter((q) => q.id === c.id && q.hf === 1), pb = J.pair.rows.filter((q) => q.id === c.id && q.hf === 2);
    const dMin = Math.max(...pa.map((q) => { const z = pb.find((w) => w.b === q.b).minD; return Math.abs(q.minD - z) / Math.max(Math.abs(q.minD), Math.abs(z), 0.1); }));   // 最接近の距離は床 0.1(衝突径数 0 の (T) は 0 の近く)
    const ga = J.gate.find((q) => q.id === c.id && q.hf === 1), gb = J.gate.find((q) => q.id === c.id && q.hf === 2);
    const row = { id: c.id, pMid: [a.pMid, b.pMid], aBox: [a.aBox, b.aBox], aN: [a.aN, b.aN], aT: [a.aT, b.aT], dE: [ga.dE, gb.dE],
      rel: { pMid: r9(relD(a.pMid, b.pMid)), aBox: r9(relD(a.aBox, b.aBox)), aN: r9(relD(a.aN, b.aN)), aT: r9(relD(a.aT, b.aT)), minD: r9(dMin) } };
    row.stepDep = Object.keys(row.rel).filter((k) => row.rel[k] > L.DECL.stepTol);
    return row;
  });
  J.cmp = cmpRows(cmpJ);
  const gMain = J.gate.filter((r) => !/\/(clip|force)$/.test(r.id));
  J.summary = {
    noHeatMain: gMain.every((r) => r.noHeat), noHeatForce: J.gate.filter((r) => /\/force$/.test(r.id)).map((r) => ({ id: r.id, dTint: r.dTint, heatIn: r.heatIn, gainNoSrc: r.gainNoSrc })),
    dEminMain: Math.min(...gMain.filter((r) => r.id !== 'T' && r.dEoverT !== null).map((r) => r.dEoverT)), dEmaxMain: Math.max(...gMain.filter((r) => r.id !== 'T' && r.dEoverT !== null).map((r) => r.dEoverT)), dET: [gT(1).dE, gT(2).dE],
    scatter: J.gate.filter((r) => r.scatter).map((r) => r.id + '@h' + (r.hf === 1 ? '' : '/2')),
    boxInWin: J.box.filter((r) => r.hf === 1 && r.inWin).map((r) => r.id),
    stepDep: J.step.filter((r) => r.stepDep.length).map((r) => ({ id: r.id, what: r.stepDep })),
    pairCaptured: [...new Set(J.pair.rows.filter((r) => r.hf === 1 && !r.escaped).map((r) => r.id + '@b' + r.b))],
  };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    pair: J.pair.rows.length === CONDS.length * L.DECL.pair.bGrid.length * 2 + L.DECL.pair.bGrid.length && J.pair.rows.every((r) => Number.isFinite(r.minD) && Number.isFinite(r.vIn)),
    box: J.box.length === CONDS.length * 2 && J.box.every((r) => [r.aBox, r.aN, r.aT, r.pMid].every(Number.isFinite) && r.rhoPts.length === 3 && r.tPts.length === 3 && r.nPts.length === 3),
    big: J.big.length === BIG_IDS.length && J.big.every((r) => Number.isFinite(r.aBox) && r.pts.length === 3),
    knob: J.knob.length === KNOBS.length && J.knob.every((r) => Number.isFinite(r.P)),
    gateNoHeat: J.summary.noHeatMain && J.gate.length === CONDS.length * 2 + 8,
    zeroT: (() => { const t = J.box.find((q) => q.id === 'T' && q.hf === 1); return Math.abs(t.pRatioT - 1) === 0; })(),
    cmp: Number.isFinite(J.cmp.a7.aBox) && Number.isFinite(J.cmp.b.aRho),
  };
}
/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w356d-drageos.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export const readCmp = () => JSON.parse(fs.readFileSync(path.join(ROOT, IN_CMP), 'utf8'));

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W356D_OUT ? (path.isAbsolute(process.env.W356D_OUT) ? process.env.W356D_OUT : path.join(ROOT, process.env.W356D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第356便d drageos(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const St = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  finish(St.value, readCmp());
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w356d-drageos.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-26)・原仮定者の回答(2026-11-22)・原仮定者の回答(2026-11-23)・統括の検証項目 R516', decl: L.DECL, conds: CONDS, bigIds: BIG_IDS, knobs: KNOBS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...St.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第356便d', target: TARGET, code: codeClosure(), inputs: [IN_CMP] }), {
    harnessVersion: HARNESS_VERSION, stage: 'drageos', engine: 'Node(html を読まない —— 純関数の lib の小さな積分器)・1 プロセス', notClaim: NOT_CLAIM, recheck: St.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + St.meta.zeroed + '・不安定 ' + St.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

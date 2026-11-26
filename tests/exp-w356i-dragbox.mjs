// 第356便i(統括の検証項目 R521): **論文 5 の「斥力に見えたのは引きずり」の診断の第 2 ラウンド —— 壁の作りに依らない測り方で数え直す器**
//   第356便d の器の箱の数は、壁(外の場)の中で引きずりが位置を運ぶことによる並進の運動エネルギーの動きに支配されていた。本器は箱の作りを変えて数え直す:
//   表 pbc 周期の箱(壁なし・粒 64・斥力 0・条件 6 —— (T)/(T+D)/(T+S1)/(T+S1) スピン逆/(T+S2)/(T+D+S1))—— 圧力 (ア) 面を横切る運動量の流れ・(イ) 並進の運動の圧力・3 つの冪・(T) との比/
//   表 cd 並進引きずりの係数 c_D 0.25・0.5(周期の箱)/表 big 粒 216 の周期の箱((T)・(T+S1)・(T+D))/表 wallsrc 壁を引きずる側の源として重みに入れる箱((T)・(T+D)・(T+S1)・M_w 10 —— M_w 100 の点)/
//   表 gate 熱を生まないことの検査(周期の箱は慣性の運動エネルギー・内部の温度の和・スピンのエネルギーが (T) と丁度同じ)/表 wall 第356便d の壁の箱の数と近づく 2 粒の数(第356便d の正本から読む —— 走らせ直さない)/零試験 12
//   どの数にも種 3 本の散り(幅)と刻み h・h/2 の比べ(種 0)を添える(粒 216 の (T+S1)・(T+D) は種 0・刻み h だけ —— 予算)。
//   (段 dragbox-356i —— 正本 tests/out/dragbox-356i.json・lib tests/lib-w356i-dragbox.mjs)。
//   **診断だけ** —— アプリ・エンジン・内蔵の本・受理器・既存の lib の本文は変えない。physics の鍵を足さない。列は選ばない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w356i-dragbox.mjs)。入力のファイルは第356便d の正本 1 つ(壁の箱と近づく 2 粒の数を読むだけ)。1 プロセス。
//   正本は第338便c の settleRun で書く。仮の値の lib は閉包に入らない。乱数は使わない(定めた種の線形合同)。
//
// ■ 言わないこと: アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。斥力を引きずりで言い切る文・圧力の出どころを引きずりと言い切る文は書かない。どの列が主かは書かない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w356i-dragbox.mjs';
import * as D from './lib-w356d-drageos.mjs';
import * as H from './lib-w355g-heat3d.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w356i-dragbox-1';
export const OUT_MAIN = 'tests/out/dragbox-356i.json';
export const TARGET = 'tests/lib-w356i-dragbox.mjs';
export const IN_WALL = 'tests/out/drageos-356d.json';
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  'アナロジーとしての玩具の量 —— 現実の熱力学の記述ではない。現実の宇宙の主張はしない',
  '斥力を引きずりで言い切る文・圧力の出どころを引きずりと言い切る文は書かない —— この器・このノブでの数(圧力・冪・比)を並べるだけ。冪は「窓の内/外」と書く',
  'どの列が主か(引きずりをどの項で読むか)は選ばない —— 候補 (D)(S1)(S2) を並べる',
  'アプリの積分・受理の門・内蔵の本へは入れない',
  '周期の箱の面の数・壁の質量 M_w・壁の重みの軟化の長さ ε_w・係数 c_D・c_S1・c_S2・時間の物差し τ_s・自分の重みの読み(B)は器のノブ(値は玩具の単位 —— 未照合)・粒 64 と 216 の小さな箱']);
const C = (cond, sKind = 'S1', spin = 1) => Object.freeze({ id: D.condId(cond, sKind, spin), cond, sKind, spin });
export const CONDS = Object.freeze([C('T'), C('TD'), C('TS', 'S1'), C('TS', 'S1', -1), C('TS', 'S2'), C('TDS', 'S1')]);
export const CD_KNOBS = Object.freeze([0.25, 0.5]);
export const BIG_IDS = Object.freeze([Object.freeze({ id: 'T', seeds: Object.freeze([0, 1, 2]), h2: true }), Object.freeze({ id: 'TS-S1', seeds: Object.freeze([0]), h2: false }), Object.freeze({ id: 'TD', seeds: Object.freeze([0]), h2: false })]);
export const WS_IDS = Object.freeze(['T', 'TD', 'TS-S1']);
export const PLAN = Object.freeze({
  pure: '零試験 12(壁なしでは第356便d の dragVel と同じ数・像の不変・並進の不変・初めの状態は第356便d と同じ・M_w 0 は第356便d の simulate と同じ・壁を源にする 1 粒の閉じた形・横切りの数の足し合わせ・(T) で (ア) = (イ)・周期の箱で熱を生まない・係数 0 で (T)・ガリレイ・定めた手順)',
  pbc: '表 pbc: 周期の箱(粒 64・斥力 0・壁なし)× 条件 6 × 種 3(刻み h)+ 種 0 の刻み h/2 —— 圧力 (ア) 面を横切る運動量の流れ・(ア′) 符号つき・(イ) 並進の運動の圧力・3 つの冪(密度〔箱を振る ρ 0.02・0.08・0.32〕・密度〔粒の数を振る 27・64・125〕・温度〔T 0.5・1・2〕)・(T) との比・座標の速さ ÷ 慣性の速さ・芯に居る粒の割合',
  cd: '表 cd: 並進引きずりの係数 c_D 0.25・0.5(周期の箱・粒 64)× 種 3 + 種 0 の刻み h/2 —— c_D 1 は表 pbc の (T+D)',
  big: '表 big: 粒 216 の周期の箱 —— 3 つの冪(密度〔箱を振る〕・粒の数を振る 125・216・343・温度)。(T) は種 3 + 刻み h/2・(T+S1) と (T+D) は種 0・刻み h だけ',
  wallsrc: '表 wallsrc: 壁を引きずる側の源として重みに入れる箱(粒 64・M_w 10・ε_w 0.5・圧力は壁に渡る力積・第356便d と同じ壁と温度の掛け直し)× (T)・(T+D)・(T+S1) × 種 3 + 種 0 の刻み h/2・M_w 100 の点(ρ 0.08・種 3)',
  gate: '表 gate: 熱を生まないことの検査 —— 周期の箱(粒 64・ρ 0.08・3000 步)の条件 6 × 刻み h・h/2 で、慣性の運動エネルギー・内部の温度の和・スピンのエネルギーの増減と初めの値((T) と丁度同じ)。壁を源にする箱は温度の掛け直しをしない走行で内部の温度とスピンの増減・並進と壁の位置のエネルギーの和の増減',
  wall: '表 wall: 第356便d の正本の壁の箱(粒 64・刻み h)の (T) との比と 3 つの冪・粒 216 の箱を振る冪・近づく 2 粒の (T+D) の最接近の距離(走らせ直さない)',
});

const r9 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? x : Number(x.toFixed(9));
const condOf = (id) => CONDS.find((c) => c.id === id);
const specOf = (c, o = {}) => Object.assign({ cond: c.cond, sKind: c.sKind, spin: c.spin }, o);
const powRow = (p) => ({ rhoPts: p.rhoPts, tPts: p.tPts, nPts: p.nPts, aBox: p.aBox, aN: p.aN, aT: p.aT, pMid: p.pMid, ratioMid: p.ratioMid });

export function pbcRows() {
  return CONDS.map((c) => ({ id: c.id, seeds: L.DECL.seedK.map((k) => powRow(L.powers('pbc', specOf(c), { k }))), h2: powRow(L.powers('pbc', specOf(c), { k: 0, hf: 2 })) }));
}
export function cdRows() {
  return CD_KNOBS.map((cD) => ({ id: 'TD/cD' + cD, cD, seeds: L.DECL.seedK.map((k) => powRow(L.powers('pbc', specOf(condOf('TD'), { cD }), { k }))), h2: powRow(L.powers('pbc', specOf(condOf('TD'), { cD }), { k: 0, hf: 2 })) }));
}
export function bigRows() {
  const B = L.DECL.big;
  return BIG_IDS.map((b) => ({ id: b.id, N: B.N, seeds: b.seeds.map((k) => powRow(L.powers('pbc', specOf(condOf(b.id)), { k, N0: B.N, nScan: B.nScan }))),
    h2: b.h2 ? powRow(L.powers('pbc', specOf(condOf(b.id)), { k: 0, N0: B.N, nScan: B.nScan, hf: 2 })) : null }));
}
export function wsRows() {
  const W = L.DECL.wall;
  const rows = WS_IDS.map((id) => ({ id, Mw: W.Mw, seeds: L.DECL.seedK.map((k) => powRow(L.powers('wallsrc', specOf(condOf(id), { Mw: W.Mw }), { k }))), h2: powRow(L.powers('wallsrc', specOf(condOf(id), { Mw: W.Mw }), { k: 0, hf: 2 })) }));
  const knob = ['TD', 'TS-S1'].map((id) => ({ id: id + '/Mw100', Mw: 100, pts: L.DECL.seedK.map((k) => { const p = L.point('wallsrc', specOf(condOf(id), { Mw: 100 }), 0.08, 1, { k }); return { k, P: p.P, ratio: p.ratio }; }) }));
  return { rows, knob };
}
export function gateRows() {
  const g = D.DECL.gate, Lg = H.boxL(g.N, g.rho, 3), out = [];
  for (const c of CONDS) for (const hf of [1, 2]) {
    const r = L.simulatePBC(specOf(c, { N: g.N, L: Lg, T: 1, steps: g.steps * hf, warm: 0, dt: L.DECL.h / hf }));
    out.push({ box: 'pbc', id: c.id, hf, ke0: r.ke0, tint0: r.tint0, es0: r.es0, dKE: r.ke1 - r.ke0, dTint: r.tint1 - r.tint0, dEs: r.es1 - r.es0 });
  }
  for (const id of WS_IDS) {
    const r = L.simulateWallSrc(specOf(condOf(id), { N: g.N, L: Lg, Tint: 1, Ttr: 1, nve: true, steps: g.steps, warm: 0, dt: L.DECL.h, Mw: L.DECL.wall.Mw }));
    out.push({ box: 'wallsrc', id, hf: 1, ke0: r.ke0, tint0: r.tint0, es0: r.es0, dKE: r.ke1 - r.ke0, dTint: r.tint1 - r.tint0, dEs: r.es1 - r.es0, dE: r.ke1 + r.pe1 - r.ke0 - r.pe0 });
  }
  return out;
}

/** 本体(同期 —— settleRun が Math の関数をずらして走らせ直す) */
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const J = { pure: { scenes: L.pureScenes() } }; mark('pure');
  J.pbc = pbcRows(); mark('pbc');
  J.cd = cdRows(); mark('cd');
  J.big = bigRows(); mark('big');
  J.wallsrc = wsRows(); mark('wallsrc');
  J.gate = gateRows(); mark('gate');
  J.timing = tm;
  return J;
}
const inW = (z) => z >= L.DECL.window[0] && z <= L.DECL.window[1];
const relD = (a, b) => Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
const KEYS = ['aBox', 'aN', 'aT'];
/** 種の散りと刻みの比べを 1 行に(base = (T) の同じ種の行 —— 比を種ごとに作る) */
export function sumRow(r, base) {
  const out = { id: r.id };
  for (const k of KEYS) {
    const sp = L.spread(r.seeds.map((s) => s[k]));
    out[k] = { mean: r9(sp.mean), half: r9(sp.half), win: inW(sp.mean) ? '内' : ((sp.mean - sp.half <= L.DECL.window[1] && sp.mean + sp.half >= L.DECL.window[0]) ? '幅の内で窓の端' : '外') };
    if (r.h2) { const dh = relD(r.seeds[0][k], r.h2[k]); out[k].stepRel = r9(dh); out[k].step = dh <= L.DECL.stepTol ? '依らない' : (Math.abs(r.seeds[0][k] - r.h2[k]) <= sp.half * 2 ? '幅の内' : '刻みに依る'); }
    else out[k].step = '—';
  }
  out.inWin = KEYS.every((k) => inW(out[k].mean));
  const fx = L.spread(r.seeds.map((s) => s.ratioMid));
  out.fluxOverKin = { mean: r9(fx.mean), half: r9(fx.half) };
  if (base) {
    const pr = L.spread(r.seeds.map((s, i) => s.pMid / base.seeds[i].pMid));
    out.pRatioT = { mean: r9(pr.mean), half: r9(pr.half), inWidth: Math.abs(pr.mean - 1) <= pr.half ? '幅の内' : '幅の外' };
    out.pRatioT.step = '—';
    if (r.h2 && base.h2) { const dh = relD(r.seeds[0].pMid / base.seeds[0].pMid, r.h2.pMid / base.h2.pMid); out.pRatioT.stepRel = r9(dh); out.pRatioT.step = dh <= L.DECL.stepTol ? '依らない' : (Math.abs(r.seeds[0].pMid / base.seeds[0].pMid - r.h2.pMid / base.h2.pMid) <= 2 * pr.half ? '幅の内' : '刻みに依る'); }
  }
  const mid = r.seeds.map((s) => s.rhoPts[1]);
  if (mid[0].vCoord !== undefined) { out.vCoord = r9(L.spread(mid.map((p) => p.vCoord)).mean); out.coreFrac = (r.id !== 'T' && mid.some((p) => p.coreFrac === 0)) ? null : r9(L.spread(mid.map((p) => p.coreFrac)).mean); out.signedOverKin = r9(L.spread(mid.map((p) => p.Psigned / p.Pkin)).mean); }   // 0 と書いた種(settle —— 尺度の走り直しで数が動く)が在れば null(散る)
  return out;
}
/** 第356便d の正本から(走らせ直さない) */
export function wallOf(Jd) {
  const box = Jd.box.filter((r) => r.hf === 1).map((r) => ({ id: r.id, pRatioT: r.pRatioT, aBox: r.aBox, aN: r.aN, aT: r.aT, inWin: r.inWin }));
  const big = Jd.big.map((r) => ({ id: r.id, aBox: r.aBox }));
  const pair = Jd.pair.rows.filter((r) => r.hf === 1 && (r.id === 'TD' || r.id === 'TS-S1' || r.id === 'TS-S2')).map((r) => ({ id: r.id, b: r.b, minD: r.minD, escaped: r.escaped, theta: r.theta }));
  return { src: IN_WALL, srcVersion: Jd.version, dStar: Jd.pair.dStar, box, big, pair };
}
/** settle の後に足す欄 */
export function finish(J, Jd) {
  J.pure.gates = L.pureGates(J.pure.scenes);
  const T = J.pbc.find((r) => r.id === 'T');
  J.sum = {
    pbc: J.pbc.map((r) => sumRow(r, T)),
    cd: J.cd.map((r) => sumRow(r, T)),
    big: J.big.map((r) => { const bT = J.big.find((q) => q.id === 'T'); const s = sumRow(r, r.id === 'T' ? bT : { seeds: r.seeds.map((_, i) => bT.seeds[i]), h2: null }); return s; }),
    wallsrc: J.wallsrc.rows.map((r) => sumRow(r, J.wallsrc.rows.find((q) => q.id === 'T'))),
  };
  const wsT = J.wallsrc.rows.find((q) => q.id === 'T');
  J.sum.wsKnob = J.wallsrc.knob.map((r) => ({ id: r.id, Mw: r.Mw, pRatioT: r9(L.spread(r.pts.map((p, i) => p.P / wsT.seeds[i].rhoPts[1].P)).mean), half: r9(L.spread(r.pts.map((p, i) => p.P / wsT.seeds[i].rhoPts[1].P)).half) }));
  const gT = (hf) => J.gate.find((q) => q.box === 'pbc' && q.id === 'T' && q.hf === hf);
  for (const r of J.gate) { r.noHeat = r.dTint === 0 && r.dEs === 0 && (r.box !== 'pbc' || (r.dKE === 0 && r.ke0 === gT(r.hf).ke0 && r.tint0 === gT(r.hf).tint0 && r.es0 === gT(r.hf).es0)); }
  J.wall = wallOf(Jd);
  J.summary = {
    noHeatPBC: J.gate.filter((r) => r.box === 'pbc').every((r) => r.noHeat), noHeatWallSrc: J.gate.filter((r) => r.box === 'wallsrc').every((r) => r.noHeat),
    zeroT: (() => { const t = J.sum.pbc.find((r) => r.id === 'T'); return Math.abs(t.fluxOverKin.mean - 1) <= L.DECL.zeroTol; })(),
    pbcInWin: J.sum.pbc.filter((r) => r.inWin).map((r) => r.id),
    stepDep: [].concat(...['pbc', 'cd', 'wallsrc', 'big'].map((b) => J.sum[b].flatMap((r) => KEYS.filter((k) => r[k].step === '刻みに依る').map((k) => b + ':' + r.id + ':' + k).concat(r.pRatioT && r.pRatioT.step === '刻みに依る' ? [b + ':' + r.id + ':pRatioT'] : [])))),
  };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const okPow = (p) => p && [p.aBox, p.aN, p.aT, p.pMid].every(Number.isFinite) && p.rhoPts.length === 3 && p.tPts.length === 3 && p.nPts.length === 3;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    pbc: J.pbc.length === CONDS.length && J.pbc.every((r) => r.seeds.length === 3 && r.seeds.every(okPow) && okPow(r.h2)),
    cd: J.cd.length === CD_KNOBS.length && J.cd.every((r) => r.seeds.length === 3 && r.seeds.every(okPow) && okPow(r.h2)),
    big: J.big.length === BIG_IDS.length && J.big.every((r) => r.seeds.every(okPow)),
    wallsrc: J.wallsrc.rows.length === WS_IDS.length && J.wallsrc.rows.every((r) => r.seeds.every(okPow) && okPow(r.h2)) && J.wallsrc.knob.every((r) => r.pts.every((p) => Number.isFinite(p.P))),
    gateNoHeat: J.summary.noHeatPBC && J.summary.noHeatWallSrc && J.gate.length === CONDS.length * 2 + WS_IDS.length,
    zeroT: J.summary.zeroT,
    wall: J.wall.box.length === 8 && J.wall.pair.length === 12,
  };
}
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w356i-dragbox.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}
export const readWall = () => JSON.parse(fs.readFileSync(path.join(ROOT, IN_WALL), 'utf8'));

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W356I_OUT ? (path.isAbsolute(process.env.W356I_OUT) ? process.env.W356I_OUT : path.join(ROOT, process.env.W356I_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第356便i dragbox(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const St = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  finish(St.value, readWall());
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w356i-dragbox.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-26)・原仮定者の回答(2026-11-22)・原仮定者の整理(2026-11-23)・統括の検証項目 R521', decl: L.DECL, conds: CONDS, cdKnobs: CD_KNOBS, bigIds: BIG_IDS, wsIds: WS_IDS, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...St.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第356便i', target: TARGET, code: codeClosure(), inputs: [IN_WALL] }), {
    harnessVersion: HARNESS_VERSION, stage: 'dragbox', engine: 'Node(html を読まない —— 純関数の lib の小さな積分器)・1 プロセス', notClaim: NOT_CLAIM, recheck: St.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + St.meta.zeroed + '・不安定 ' + St.meta.unstable, out.elapsedS + ' s', JSON.stringify(tm));
}
if (IS_MAIN) await main();

// 第352便i(原仮定者の回答(2026-11-24 —— 第148報)「AN1016: (乙)で進める。ただし、「釣り合う」に「安定した歳差運動」を含む」・統括の検証項目 R446):
//   **「安定した歳差運動」の判定 —— 表 1: 一定の合成の軸(8 惑星と太陽 × 背景の向き (N+)〔基準軸 L・eq〕・(G−) × 背景の大きさ (uV)・(u1) × (g2±) × f 0・0.5・1)の判定の量 3 つと縮む時間・
//   表 2: 合成の軸が一様に回るときの引き込む点(傾き I × 比 ρ = g ÷ (k₂ abs(Ω)) × f × (g2±))・候補の表(何が軸を動かしうるか —— (a)〜(d))・
//   逆に解いた (ρ, I)(地球・火星の傾き)・表 3: 読み A・B・C に当たる列の数・逆行と 90° を越える天体(金星・天王星)の行**
//   (段 stableprec-352i —— 正本 tests/out/stableprec-352i.json・lib tests/lib-w352i-stableprec.mjs)。
//   **診断だけ** —— 安定した歳差の読みを選ぶものではない。エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w352i-stableprec.mjs —— 領域の宣言なし)。入力のファイルは無い(前の便の lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針: (g2+)・(g2−)、(N+)・(G−)、基準軸 L・eq は同じ重さで並べる(どちらかに寄せない)。読み A・B・C も選ばない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as W330 from './lib-w330a-spinclass.mjs';
import * as L from './lib-w352i-stableprec.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w352i-stableprec-1';
export const OUT_MAIN = 'tests/out/stableprec-352i.json';
export const TARGET = 'tests/lib-w352i-stableprec.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '「安定した歳差運動」の読み A・B・C のどれも選んでいない(3 つの判定の量を並べる)',
  '向きの読み (g2+)・(g2−)・背景の向き (N+)・(G−)・基準軸 L・eq のどれも選んでいない(同じ重さの列)',
  '合成の軸を動かすものの率 g は引数(観測の値と比べるのは後のラウンド)—— 逆に解いた (ρ, I) は数だけ',
  '太陽系の年齢は第318便d の文献の値(未照合)・公転の周期は第330便a の文献の値(未照合)',
  '場は geoPN=3 の在位の形・主の成分 (S)・(C2)・k 1・局所の分母は自分 + 太陽(第352便d の rowOf)',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない']);
export const PLAN = Object.freeze({ pure: '零試験 12', t1: '受け手 9 × 背景の向き 3 × 大きさ 2 × 向きの読み 2 × f 3', t2: '傾き 6 × ρ 14 × f 3 × 向きの読み 2',
  cand: '受け手 4 × 背景の向き 3 × 大きさ 2 × ρ 6 × 向きの読み 2(f 0.5)', inv: '受け手 2 × 傾き 6 × f 2 × 向きの読み 2', t4: '読み A・B・C の数', t5: '金星・天王星' });
const D2R = Math.PI / 180, YR = 365.25 * 86400;
const fl = (x, s) => (Math.abs(x) <= 1e-12 * s ? 0 : x);
const orbitDays = (id) => W330.DECL.lit.orbitDays[id.toLowerCase()];

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nB = L.DECL.bgCols.length, nU = L.DECL.uCols.length, nS = L.DECL.senses.length, nF = L.DECL.fShow.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 12,
    t1: J.t1.length === L.DECL.recv.length * nB * nU * nS * nF && J.t1.every((r) => (r.f === 0 ? r.dThPerTurnDeg === 0 && r.returnRate === 0 && r.tE === null : r.tE > 0))
      && J.t1.filter((r) => r.f === 1).every((r) => r.phasePerTurnDeg === 0),
    t2: J.t2.length === L.DECL.IDeg.length * L.DECL.rhoAbs.length * 2 * nF * nS && J.t2.every((r) => r.ok && r.resid < 1e-9 && (r.f === 0 ? r.returnRate === 0 : r.returnRate > 0)),
    cand: J.cand.length === L.DECL.candBodies.length * nB * nU * L.DECL.candRho.length * nS && J.cand.every((r) => r.resid < 1e-9),
    inv: J.inv.length === L.DECL.invBodies.length * L.DECL.invIDeg.length * 2 * nS && J.inv.every((c) => c.roots.every((x) => Math.abs(x.halfDeg - c.targetDeg) < 1e-6)),
    t4: J.t4.length === 3 && J.t4.every((r) => r.hits <= r.n),
    t5: J.t5.length === 2 * nB * nU,
  };
}

export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const T1 = E.t1Table(), GEO = E.geometry(), cache = {};
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const AX = L.axesOf(T1, GEO), D352 = L.D;
  const uV = D352.uVenus(T1, GEO, { part: 'S' }, cache), uOf = { uV, u1: 1 };
  const age = L.DECL.sunAgeYr;
  // 状態(受け手 × 背景の向き × 大きさ)
  const st = {};
  for (const id of L.DECL.recv) for (const [bg, ax] of L.DECL.bgCols) for (const uc of L.DECL.uCols) {
    const axis = ax === null ? AX.L : AX[ax];
    st[[id, bg, ax, uc].join('|')] = L.bodyState(T1, GEO, id, { bg, axis, u: uOf[uc] }, cache);
  }
  // 表 1: 一定の合成の軸
  const t1 = [];
  for (const id of L.DECL.recv) for (const [bg, ax] of L.DECL.bgCols) for (const uc of L.DECL.uCols) {
    const S = st[[id, bg, ax, uc].join('|')];
    for (const sense of L.DECL.senses) for (const f of L.DECL.fShow) {
      const j = L.judgeConst({ thDeg: S.thDeg, W: S.W, f, sense }), ta = L.thAfter({ thDeg: S.thDeg, W: S.W, f, sense, tYr: age });
      t1.push({ id, bg, axis: ax, u: uc, sense, f, thDeg: S.thDeg, wAsYr: S.W * L.ASYR, turnYr: 2 * Math.PI / S.W / YR, locOverW: S.locOverW,
        dThPerTurnDeg: fl(j.dThPerTurnDeg, 360), phasePerTurnDeg: fl(j.phasePerTurnDeg, 360), returnPerTurn: fl(j.returnPerTurn, 2 * Math.PI), returnRatePerYr: fl(j.returnRate * YR, S.W * YR),
        returnRate: fl(j.returnRate, S.W), tE: j.tE, tStar: j.tStar, ageKwt: ta.kwt, ageThAlpha: ta.alpha, ageThBeta: ta.beta,
        ageShrinkFrac: S.thDeg > 0 ? ta.dropDeg / S.thDeg : 0 });
    }
  }
  mark('t1');
  // 表 2: 合成の軸が一様に回る(無次元の幾何)
  const t2 = [];
  const rhos = [...L.DECL.rhoAbs.map((x) => -x).reverse(), ...L.DECL.rhoAbs];
  for (const IDeg of L.DECL.IDeg) for (const rho of rhos) for (const f of L.DECL.fShow) for (const sense of L.DECL.senses) {
    const g = L.lockGeom({ IDeg, rho, f, sense });
    t2.push({ IDeg, rho, f, sense, ok: g.ok, neutral: g.neutral, halfDeg: g.halfDeg, lagDeg: g.lagDeg, outDeg: fl(g.outDeg, 90), returnRate: g.returnRate, spiral: g.spiral, resid: g.resid < 1e-12 ? 0 : g.resid });
  }
  mark('t2');
  // 候補の表: (b) 公転面が基準軸のまわりを回る・(c) 太陽の自転軸が基準軸のまわりを回る —— どちらも「合成の軸が基準軸 n̂ のまわりを剛体のように回る」と置いた形(I = Ω̂ と n̂ の角)。
  //   (G−) では背景が基準軸の向きでないので一様な回転の形にならない(印 uniform false —— I は Ω̂ と基準軸 L の角を参考に置く)。
  const cand = [];
  for (const id of L.DECL.candBodies) for (const [bg, ax] of L.DECL.bgCols) for (const uc of L.DECL.uCols) {
    const S = st[[id, bg, ax, uc].join('|')], n = ax === null ? AX.L : AX[ax], IDeg = L.R3.angDeg(S.Om, n), actDeg = L.R3.angDeg(S.sHat, n);
    for (const rho of L.DECL.candRho) for (const sense of L.DECL.senses) {
      const g = L.lockGeom({ IDeg, rho, f: 0.5, sense });
      cand.push({ id, bg, axis: ax, u: uc, uniform: bg === 'Np', IDeg, actHalfDeg: actDeg, rho, sense, halfDeg: g.halfDeg, lagDeg: g.lagDeg, returnRate: g.returnRate, resid: g.resid < 1e-12 ? 0 : g.resid });
    }
  }
  // (a) 局所の項が公転の位相で変わる分: 率 = 公転の角速度 → 比 ρ_a = T_W ÷ 公転の周期(k₂ は f 0.5 の値で割る)
  const candA = [];
  for (const id of L.DECL.candBodies) for (const uc of L.DECL.uCols) {
    const S = st[[id, 'Np', 'L', uc].join('|')], Pyr = orbitDays(id) / 365.25, k2 = L.kOf(0.5, 'g2p').k2;
    candA.push({ id, u: uc, orbitYr: Pyr, turnYr: 2 * Math.PI / S.W / YR, rhoA: (2 * Math.PI / S.W / YR) / Pyr / k2, locOverW: S.locOverW });
  }
  mark('cand');
  // 逆に解く: 地球・火星の傾き(geometry の自転軸と公転の法線の角)が引き込む点(f 0.5)・中立の点(f 0)の半頂角になる ρ
  const inv = [];
  for (const id of L.DECL.invBodies) {
    const tgt = st[[id, 'Np', 'L', 'uV'].join('|')].oblDeg;
    for (const IDeg of L.DECL.invIDeg) for (const f of [0, 0.5]) for (const sense of L.DECL.senses)
      inv.push({ id, targetDeg: tgt, IDeg, f, sense, roots: L.invertTarget({ targetDeg: tgt, IDeg, f, sense }) });
  }
  mark('inv');
  // 表 3: 読み A・B・C
  const t4 = [
    { reading: 'A', what: '半頂角が変わらない(表 1 は 1 周あたりの変化 0 の行・表 2 は止まる点の行)', n: t1.length + t2.length,
      hits: t1.filter((r) => r.dThPerTurnDeg === 0).length + t2.filter((r) => r.ok).length, t1: t1.filter((r) => r.dThPerTurnDeg === 0).length, t2: t2.filter((r) => r.ok).length },
    { reading: 'B', what: '乱しても戻る(表 1 は観測の半頂角が止まる点で戻りの率が正の行・表 2 は戻りの率が正の止まる点)', n: t1.length + t2.length,
      hits: t1.filter((r) => r.dThPerTurnDeg === 0 && r.returnRate > 0).length + t2.filter((r) => r.ok && r.returnRate > 0).length,
      t1: t1.filter((r) => r.dThPerTurnDeg === 0 && r.returnRate > 0).length, t2: t2.filter((r) => r.ok && r.returnRate > 0).length },
    { reading: 'C', what: '太陽系の年齢の間の半頂角の変化が 1% より小さい(表 1 —— 大きさの列ごと)', n: t1.length,
      hits: t1.filter((r) => r.ageShrinkFrac < L.DECL.readCFrac).length, t1: t1.filter((r) => r.ageShrinkFrac < L.DECL.readCFrac).length, t2: 0,
      byU: Object.fromEntries(L.DECL.uCols.map((uc) => [uc, { n: t1.filter((r) => r.u === uc && r.f > 0).length, hits: t1.filter((r) => r.u === uc && r.f > 0 && r.ageShrinkFrac < L.DECL.readCFrac).length }])) },
  ];
  // 逆行と 90° を越える天体
  const t5 = [];
  for (const id of ['Venus', 'Uranus']) for (const [bg, ax] of L.DECL.bgCols) for (const uc of L.DECL.uCols) {
    const S = st[[id, bg, ax, uc].join('|')], j = L.judgeConst({ thDeg: S.thDeg, W: S.W, f: 0.5, sense: 'g2p' });
    t5.push({ id, bg, axis: ax, u: uc, thDeg: S.thDeg, oblDeg: S.oblDeg, over90: S.thDeg > 90, returnSign: Math.sign(fl(j.returnRate, S.W)), tE: j.tE, tStar: j.tStar,
      readAlpha: S.thDeg > 90 ? '90° を越えて Ω̂ へ(半頂角は 1/e の時間で縮む)' : 'Ω̂ へ縮む', readBeta: S.thDeg > 90 ? '90° に着いて留まる(t* の後)' : 'Ω̂ へ縮む' });
  }
  mark('t5');
  const J = { pure, axes: AX, uV, sunAgeYr: age, t1, t2, cand, candA, inv, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w352i-stableprec.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W352I_OUT ? (path.isAbsolute(process.env.W352I_OUT) ? process.env.W352I_OUT : path.join(ROOT, process.env.W352I_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第352便i stableprec(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w352i-stableprec.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R446',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第352便i', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'stableprec', engine: 'Node(html を読まない —— 純関数の lib・第351便d・第351便g・第352便d・第352便c・第347便e・第318便d・第330便a の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

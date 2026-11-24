// 第351便d(原仮定者の回答(2026-11-24 —— 第147報)「AN1008: R3で進める」・統括の検証項目 R430):
//   **(R3) の 2 経路の步を数える器 —— 原文の 4 句と経路 ①・② の式の当たり方(表 1)・90° を越えた後の読み (α)(β)(γ)(表 2)・比率のノブの 3 つの置き方(表 3)・
//   2 つの源の釣り合い(無次元の例 —— 表 4)・ω_T ÷ ω_L の因子(表 5)**
//   (段 r3step-351d —— 正本 tests/out/r3step-351d.json・lib tests/lib-w351d-r3step.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。エネルギー・熱・自転の増し分は本便の第 2 段の枝 g(本器は持たない)。
//   天体の値は第 2 段の枝 e(本器は無次元の例だけ)。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w351d-r3step.mjs —— 領域の宣言なし)。入力のファイルは無い(lib を呼んで作り直す)。
//   1 プロセス。正本は第338便c の settleRun で書く。
//
// ■ 探索の方針(第138報): 式の形は走行の前に決め打ちしない —— 正本の先頭(decl・plan)は、走らせたノブの格子と判定の物差しの記録。比率 f の既定の値は決めない。
// ■ 判定の物差し(零試験 13): 共通の点検の数/f 0 = 第350便c の (g2+) と同じ軌跡/f 1 = 歳差なし・(g3) と同じ軌跡/閉じた形と刻みの次数/ŝ ∥ Ω・反平行で 0/Ω の反転/
//   自転の反転は ŝ の向きに/(N1) の合成の強さ/90° を越えた後の 3 つの読み/合成の向きの閾/ŝ の長さと起こす率/変異 3 つ/入力の拒否。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { settleRun } from './lib-w338c-recheck.mjs';
import * as L from './lib-w351d-r3step.mjs';
import * as GS from './lib-w350c-gyrostep.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w351d-r3step-1';
export const OUT_MAIN = 'tests/out/r3step-351d.json';
export const TARGET = 'tests/lib-w351d-r3step.mjs';
/** 版の履歴(結果を見て変えた所 —— 理由つき) */
export const AMEND = Object.freeze([]);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze([
  '経路 ①・② の式・比率のノブ f の 3 つの置き方・90° を越えた後の 3 つの読みは候補の表((R3) の答えではない)', 'f の既定の値は決めていない(0・0.5・1 を並べた)・90° を越えた後の読みは 1 つに決めていない',
  '2 つの源の釣り合いは無次元の例 —— 天体の値は本便の第 2 段の枝 e', 'エネルギー・熱・自転の増し分は本便の第 2 段の枝 g —— 本器は向きと步だけ',
  'アプリの引きずり・自転・ジャイロの步と、エンジン・内蔵の本へは入れない(AN712)']);
/** 器の宣言(表に出す点) */
export const PLAN = Object.freeze({ pure: '零試験 13', phrase: '原文の 4 句 × 式の当たり方(ω_I 1・10 の 2 つの点で数える)', over: '初期の角 5 × 読み 3((α)(β)(γ))—— f 1・(N1)・abs(Ω) 1・t 20',
  knob: '(N1)(N2) × f 5 + (N3) 3 組 + 換算の係数 k 3 つ', pair: 'なす角 3 × 大きさの比 3(A = ẑ・ŝ は A と起こす側・B と倒す側)+ 安定・不安定 + 起こす率の和が 0 の例', ratio: '向きの読み 2((g2+) = f 0・(g3) k_d 1 = f 1)× ω_I(0) 2 × 自転速度の読み 2 + 地球の型 1',
  common: '共通の点検の数 1 組' });

const D2R = Math.PI / 180, { dot, crs, nrm, scl, add, sub, unit } = L.vec, ang = L.angDeg, f0 = L.floor0;
const sAt = (thDeg, phDeg = 0) => [Math.sin(thDeg * D2R) * Math.cos(phDeg * D2R), Math.sin(thDeg * D2R) * Math.sin(phDeg * D2R), Math.cos(thDeg * D2R)];
const Z = [0, 0, 1];

/* ───────── 表 1 原文の 4 句と経路 ①・② の式 ───────── */
export function phraseRows() {
  const out = [];
  for (const w of L.DECL.wI0) {
    const s = sAt(L.DECL.theta0Deg), par = dot(s, Z), perp = sub(Z, scl(s, par)), wS = w + par;   // 自転の速さ ω = ω_I + Ω∥(第350便c の (S1))
    const A = add(scl(s, wS), Z), tanA = sub(A, scl(s, dot(A, s)));                                     // 合成の回転軸 ω ŝ + Ω の、ŝ での接平面の成分
    const rot90 = (v) => crs(s, v);                                                                       // 自転の向きに 90°(ŝ のまわりの右回り)
    const precV = crs(Z, s), byOmPerp = crs(perp, s);                                                     // 経路 ② の向き Ω × ŝ・Ω⊥ を回転とみたときの ŝ の動き
    const cs = (a, b) => { const x = dot(unit(a), unit(b)); return Math.abs(x - 1) <= 1e-12 ? 1 : Math.abs(x + 1) <= 1e-12 ? -1 : f0(x, 1); };
    // 合成の回転軸が ŝ と一緒に動く: f 0 で A = ω ŝ + Ω の Ω とのなす角と ŝ とのなす角が保たれる(歳差の軸は Ω)
    const R = L.r3Step({ ...L.r3Coeffs(0, 'N1'), integ: 'mid', T: L.DECL.T, dt: L.DECL.dt0 / 10 }), Ae = add(scl(R.sEnd, wS), Z);
    out.push({ w, wS, perpMag: nrm(perp),
      // 句 1: 直交する成分(回転とみた ŝ の動き Ω⊥ × ŝ)を自転の向きに 90° ずらすと Ω⊥(Ω へ近付く向き)
      p1: { cosToPerp: cs(rot90(byOmPerp), perp), cosToOm: cs(rot90(byOmPerp), Z) > 0 },
      // 句 2・3: 瞬時の率 dθ_line/dt の符号(順方向 ŝ·Ω > 0 —— 線に近付く・逆方向 ŝ·Ω < 0 —— 線から離れる)
      p23: { fwd: Math.sign(L.r3Rate(s, Z, { kTilt: 1 }).dThetaLineDt), back: Math.sign(L.r3Rate(s, [0, 0, -1], { kTilt: 1 }).dThetaLineDt) },
      // 句 4: 合成の回転軸へ向ける向き(接平面の成分)は Ω⊥ と同じ向き・それを自転の向きに 90° ずらすと ŝ × Ω⊥ = −(Ω × ŝ)
      p4: { cosTanToPerp: cs(tanA, perp), cosRotToPrec: cs(rot90(tanA), precV), cosRotToPerp: cs(rot90(tanA), perp) },
      // 向ける回転の大きさの 2 つの置き方: abs(Ω⊥) そのまま/合成の軸とのなす角 atan(abs(Ω⊥) ÷ abs(ω + Ω∥))
      magA: nrm(perp), magB: Math.atan2(nrm(perp), Math.abs(wS)), magBDeg: ang(s, A),
      // 合成の回転軸の歳差: A と Ω のなす角(初め・終わり)・A と ŝ のなす角(初め・終わり)
      aOmDeg0: ang(A, Z), aOmDegE: ang(Ae, Z), aSDeg0: ang(A, s), aSDegE: ang(Ae, R.sEnd), precRate: R.precRate });
  }
  return out;
}

/* ───────── 表 2 90° を越えた後の読み ───────── */
export function overRows() {
  const out = [], c = L.r3Coeffs(1, 'N1'), T = L.DECL.Tover;
  for (const th0 of L.DECL.theta0Over) for (const read of L.DECL.reads) {
    const s0 = sAt(th0), r0 = L.r3Rate(s0, Z, { ...c, read }), R = L.r3Step({ s0, ...c, read, T, integ: 'mid' }), cf = L.closedR3({ th0Deg: th0, ...c, read, t: T });
    const dest = R.thEndDeg < 1 ? 'Om' : R.thEndDeg > 179 ? 'negOm' : Math.abs(R.thEndDeg - 90) < 1e-6 ? 'ninety' : 'between';
    out.push({ th0, read, dLine0: r0.dThetaLineDt, dTheta0: r0.dThetaDt, thLineMaxDeg: R.thLineMaxDeg, thEndDeg: R.thEndDeg, cfThDeg: cf.thDeg, err: f0(Math.abs(R.thEndDeg - cf.thDeg), 180),
      crossT: read === 'gamma' ? null : R.crossT, tStar: cf.tStar, dest });
  }
  return out;
}

/* ───────── 表 3 比率のノブの 3 つの置き方 ───────── */
export const N3SETS = Object.freeze([Object.freeze({ kTilt: 0.1, kPrec: 1 }), Object.freeze({ kTilt: 1, kPrec: 1 }), Object.freeze({ kTilt: 1, kPrec: 0.1 })]);
export const KCONV = Object.freeze([0.5, 1, 2]);
function knobRow(norm, f, c, kConv = 1) {
  const th0 = L.DECL.theta0Deg, Om = kConv, s0 = sAt(th0), r = L.r3Rate(s0, scl(Z, Om), c);
  const per = c.kPrec !== 0 ? 2 * Math.PI / Math.abs(c.kPrec * Om) : null, cfP = per === null ? null : L.closedR3({ th0Deg: th0, Om, t: per, ...c });
  const R = L.r3Step({ s0, om: scl(Z, Om), ...c, integ: 'mid', T: L.DECL.T, dt: L.DECL.dt0 / 10 }), cf = L.closedR3({ th0Deg: th0, Om, t: L.DECL.T, ...c });
  return { norm, f, kConv, kTilt: c.kTilt, kPrec: c.kPrec, tiltSpeed: c.kTilt * Om, precRate: c.kPrec * Om, ratioTP: c.kPrec !== 0 ? c.kTilt / c.kPrec : null,
    dsOverPerp: nrm(r.ds) / nrm(r.perp), dTh0: r.dThetaDt, periodT: per, dThPerTurn: cfP === null ? null : th0 - cfP.thDeg, thEnd: R.thEndDeg, rateNum: f0(R.precRate, 1), err: f0(Math.abs(R.thEndDeg - cf.thDeg), 180) };
}
export function knobRows() {
  const out = [];
  for (const norm of ['N1', 'N2']) for (const f of L.DECL.fGrid) out.push(knobRow(norm, f, L.r3Coeffs(f, norm)));
  for (const k of N3SETS) out.push(knobRow('N3', null, L.r3Coeffs(null, 'N3', k)));
  for (const kc of KCONV) out.push(knobRow('N1', 0.5, L.r3Coeffs(0.5, 'N1'), kc));   // 換算の係数 k は Ω の大きさに掛かる(寄る速さと歳差の率を同じ倍率で)
  return out;
}

/* ───────── 表 4 2 つの源の釣り合い(無次元)───────── */
export const S_PAIR = Object.freeze(unit([-0.8, 0.3, 0.5]));
function runTo(s0, Om, c, read = 'alpha') {
  const m = nrm(Om), T = 20 / Math.max(m * Math.max(c.kTilt, 1e-9), 1e-9), dt = T / 2000;
  return L.r3Step({ s0, om: Om, ...c, read, T, dt, integ: 'mid' });
}
export function pairRows() {
  const out = [], A = Z;
  for (const phi of L.DECL.pairAngles) for (const b of L.DECL.pairRatios) {
    const B = scl(sAt(phi), b), tot = add(A, B), e = L.eqAxis([A, B]), s0 = S_PAIR.slice();
    const row = { phi, b, totMag: nrm(tot), undetermined: e === null, eToA: e ? f0(ang(e, A), 180) : null, eToB: e ? f0(ang(e, B), 180) : null,
      cosA: dot(s0, A) / nrm(A), cosB: dot(s0, B) / nrm(B), s0ToE: e ? ang(s0, e) : null };
    if (e) {
      const R1 = runTo(s0, tot, L.r3Coeffs(1, 'N1')), Rh = runTo(s0, tot, L.r3Coeffs(0.5, 'N1'));
      row.endF1 = R1.thEndDeg; row.endF05 = Rh.thEndDeg; row.turnsF05 = Rh.turns / (2 * Math.PI);
      // 安定: 合成の向き e から ±1° ずらしたときの dθ/dt(θ は e とのなす角 —— 負 = 戻る)・−e から ±1° ずらしたとき(正 = 離れる —— θ は −e とのなす角)
      const [p1] = (() => { const t = Math.abs(e[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; return [unit(crs(e, t))]; })();
      const tilt = (v, d) => L.rodrigues(v, p1, d * D2R);
      const kk = { kTilt: 1, kPrec: 0 };
      row.stab = [1, -1].map((d) => L.r3Rate(tilt(e, d), tot, kk).dThetaDt);
      const ne = scl(e, -1);
      row.unstab = [1, -1].map((d) => { const v = tilt(ne, d), r = L.r3Rate(v, tot, kk); return -r.dThetaDt; });   // −e とのなす角の率 = −(e とのなす角の率)
    }
    out.push(row);
  }
  return out;
}
/** 起こす率の和が 0 の瞬間の例: 公転の北極 n = ẑ・ε 23.44°・A = n(起こす側)・B = b u(倒す側 —— 起こす率の和が 0 になる b) */
export function balanceExample() {
  const eps = 23.44, s0 = sAt(eps), n = Z, A = Z, u = unit([-0.2, 1, -0.6]);
  const rA = L.raiseRate(s0, n, L.r3Rate(s0, A, { kTilt: 1 }).tilt), rU = L.raiseRate(s0, n, L.r3Rate(s0, u, { kTilt: 1 }).tilt), b = -rA / rU, B = scl(u, b), tot = add(A, B);
  const r0 = L.r3Rate(s0, tot, { kTilt: 1 }), e = L.eqAxis([A, B]);
  const R = L.r3Step({ s0, om: tot, kTilt: 1, kPrec: 0, T: 0.05, dt: 0.0005, integ: 'mid' }), epsEnd = ang(R.sEnd, n), rEnd = L.raiseRate(R.sEnd, n, L.r3Rate(R.sEnd, tot, { kTilt: 1 }).tilt);
  return { eps, b, raiseA: rA, raiseB: rU * b, raiseSum: f0(rA + rU * b, Math.abs(rA)), dsMag: nrm(r0.ds), movedDeg: ang(s0, R.sEnd), epsEnd: epsEnd, raiseEnd: rEnd, eqToN: e ? ang(e, n) : null, s0ToE: e ? ang(s0, e) : null };
}

/* ───────── 表 5 ω_T ÷ ω_L の因子 ───────── */
export function ratioRows() {
  const out = [];
  for (const [rd, f] of [['g2p', 0], ['g3a', 1]]) for (const wI0 of L.DECL.wI0) for (const wRead of ['S1', 'S2']) {
    const R = GS.stepGyro({ read: rd, wRead, wI0, integ: 'mid' }), s0 = sAt(GS.DECL.theta0Deg), w = wI0 + dot(s0, Z);
    const th = nrm(L.r3Rate(s0, Z, L.r3Coeffs(f, 'N1')).ds);
    out.push({ read: rd, f, wI0, wRead, ratio: R.wTmean / R.wLmean, est: wRead === 'S2' ? 1 + L.s2RatioMinus1(w, th) : 1, thEndDeg: R.thEndDeg });
  }
  return out;
}
export function earthRatio() {
  const E = L.DECL.earthEx, w = 2 * Math.PI / E.siderealDayS, th = E.thetaArcsecPerYr / (180 * 3600 / Math.PI) / (365.25 * 86400);
  return { w, th, ratioMinus1: L.s2RatioMinus1(w, th) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const D = L.DECL;
  return {
    pure: Object.values(J.pure.gates).every(Boolean) && Object.keys(J.pure.gates).length === 13,
    phrase: J.phrase.length === D.wI0.length && J.phrase.every((r) => r.p1.cosToPerp === 1 && r.p23.fwd === -1 && r.p23.back === 1 && r.p4.cosTanToPerp === 1 && r.p4.cosRotToPrec === -1 && r.p4.cosRotToPerp === 0
      && Math.abs(r.aOmDeg0 - r.aOmDegE) < 1e-3 && Math.abs(r.aSDeg0 - r.aSDegE) < 1e-3),
    over: J.over.length === D.theta0Over.length * D.reads.length && J.over.every((r) => r.err < 1e-3),
    knob: J.knob.length === 2 * D.fGrid.length + N3SETS.length + KCONV.length && J.knob.every((r) => r.err < 1e-3) && J.knob.filter((r) => r.norm === 'N1' && r.kConv === 1).every((r) => Math.abs(r.dsOverPerp - 1) < 1e-12),
    pair: J.pair.length === D.pairAngles.length * D.pairRatios.length && J.pair.filter((r) => !r.undetermined).every((r) => r.endF1 < 1e-3 && r.stab.every((x) => x < 0) && r.unstab.every((x) => x > 0))
      && J.pair.filter((r) => r.undetermined).length === 1,
    balance: J.balance.raiseSum === 0 && J.balance.dsMag > 0.1,
    ratio: J.ratio.length === 8 && J.ratio.filter((r) => r.wRead === 'S1').every((r) => r.ratio === 1),
  };
}
export function runAll() {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const phrase = phraseRows(); mark('phrase');
  const over = overRows(); mark('over');
  const knob = knobRows(); mark('knob');
  const pair = pairRows(), balance = balanceExample(); mark('pair');
  const ratio = ratioRows(), earth = earthRatio(); mark('ratio');
  const common = GS.commonCheck();
  const J = { pure, phrase, over, knob, pair, balance, ratio, earth, common, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/** import の閉包(来歴の code の一覧 —— 器から相対の import を辿る) */
export function codeClosure() {
  const seen = new Set(), stack = ['tests/exp-w351d-r3step.mjs'];
  while (stack.length) { const f = stack.pop(); if (seen.has(f)) continue; seen.add(f); const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of t.matchAll(/from '\.\/([^']+)'/g)) stack.push('tests/' + m[1]); }
  return [...seen].sort();
}

/* ───────── 走らせる ───────── */
export async function main() {
  const OUT = process.env.W351D_OUT ? (path.isAbsolute(process.env.W351D_OUT) ? process.env.W351D_OUT : path.join(ROOT, process.env.W351D_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now();
  console.log('第351便d r3step(版 ' + HARNESS_VERSION + ')');
  let tm = null;
  const S = settleRun(() => { const R = runAll(); if (tm === null) tm = R.timing; delete R.timing; return R; });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w351d-r3step.mjs', target: TARGET,
    ruling: '原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R430',
    decl: L.DECL, plan: PLAN, amend: AMEND, notClaim: NOT_CLAIM, ...S.value, timing: tm };
  out.elapsedS = (Date.now() - t0) / 1000;
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第351便d', target: TARGET, code: codeClosure(), inputs: [] }), {
    harnessVersion: HARNESS_VERSION, stage: 'r3step', engine: 'Node(html を読まない —— 純関数の lib・第350便c・第350便e の lib を呼ぶ)・1 プロセス', notClaim: NOT_CLAIM, recheck: S.meta });
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), '0 と書いた葉 ' + S.meta.zeroed + '・不安定 ' + S.meta.unstable, out.elapsedS + ' s');
}
if (IS_MAIN) await main();

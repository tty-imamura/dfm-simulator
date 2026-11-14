// 第337便a(原仮定者の指示(2026-11-14 —— 第138報)「安定した天体の運行は、偶然では無く、釣り合った結果と捉える。釣り合う為には、正と負、供給と減衰の両方が必要である。
//   減衰とは、供給が止まるとピタリと止まるものでは無い意味を含む」「銀河の回転に対して、太陽系は逆向きに軸を60度傾けて回っている。供給の向きは合っていて、傾きはノブになる」
//   「原始太陽系は、銀河の渦の中の、小さな渦が起源となる」・統括の検証項目 R337):
//   **外部からの供給と減衰の探索の器**(段 supply-337a —— 正本 tests/out/supply-337a.json・lib tests/lib-w337a-supply.mjs)。**探索の候補の表だけ** —— エンジン・内蔵の本・受理器・既存の lib の本文は変えない。
//
// Node だけ・**html を読まない**(来歴の対象は純関数 tests/lib-w337a-supply.mjs —— 第317便d の satan の型・領域の宣言なし)。入力の正本は第335便b の tests/out/carryledger-w335b.json の 1 本
//   (本の時刻の 16 体の状態〔位置・速度・自転の向きと大きさ・質量・半径 —— 🗺️ の写しの build〕・銀河の座標軸・銀河の量・場の読みの列〔対照〕・供給の帳簿の行〔対照〕・文献の熱流)。
//   慣性係数・恒星に対する自転と公転の周期は第330便a の lib の lit を呼ぶ。1 プロセス・数秒。
//
// ■ 何をするか(走らせたノブの格子と判定の物差しは PLAN と lib の DECL・DECL_TEXT —— 正本の先頭)
//   P 純関数の場面(lib)
//   T1 場の読みと向き: 回転曲線 4(平坦・ケプラー・剛体・オールトの量)× 読み 5 の符号つきの角速度・受け手の軸(黄道の北極・不変面の北極・太陽と惑星と衛星の自転軸)への射影・
//      DFM の読みの s_field の格子と逆回転の条件・傾きのノブ θ の表・第335便b の場の読み(銀河の公転の角速度)の列と同じか(対照)
//   T2 起源の角運動量の帳簿: 読みごとの |ω₀| で合う雲の半径と密度・半径の格子での L_c/L_now・収縮の比と自転の増え方・分子雲のコアの目安(並べるだけ)
//   T3 駆動 + 減衰の帳簿: 閉じた式と RK4(無次元 1 本 + 天体ごとに τ の単位で 1 本)・収支・天体ごとの熱の上限の Γ_d・τ の下限・要る N_in と仕事率・年齢の窓・釣り合いの外れ・受動の型の対照
//   T4 供給の則の探索: log10|s| をノブ(質量・半径・主星までの距離・主星の質量)を 1 つずつ足した最小二乗・破断の型(√(GM/R³) の定数倍)・主の組の外(水星・金星)と衛星へ同じノブで持ち出す・
//      熱の上限の Γ_d の則(質量・半径)
//   T5 ずれの熱: 太陽の収縮(I s = 一定)でずれの熱の比(Γ_d ∝ R^d —— d = 0 と T4 の熱の上限の則の半径の次数)
// ■ 言わないこと: NOT_CLAIM
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w337a-supply.mjs';
import * as S330 from './lib-w330a-spinclass.mjs';
import * as B333 from './lib-w333b-axialfield.mjs';   // EQ-31 の `integratedField`(比べる列 —— 呼ぶだけ)
import * as C335 from './lib-w335b-carryledger.mjs';   // 銀河の源の `galaxySources`(中心の点・半径の内の和 —— 呼ぶだけ)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w337a-supply-1';
export const OUT_MAIN = 'tests/out/supply-337a.json';
export const TARGET = 'tests/lib-w337a-supply.mjs';   // html を読まない器の来歴の対象(純関数 —— 第317便d の satan の型)
export const INPUT = 'tests/out/carryledger-w335b.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => Math.hypot(a[0], a[1], a[2]), crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => scl(a, 1 / nrm(a));
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const lg = Math.log10;
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0], EM = Object.keys({ earthMoon: 1 })[0];   // 鍵の文字列を引用符で書かない(同じ綴りの本の id と取り違えない書き方 —— 第333便b の型)
export const NOT_CLAIM = Object.freeze(['読みは候補の表(どの読みなら向きが合うか)—— 銀河が自転を供給する機構の同定ではない', '起源の雲の半径は角運動量の帳簿が閉じる値(雲の観測との照合ではない —— 文献の目安は並べるだけ)',
  '駆動 + 減衰の型は宣言した最小の型(N_in と Γ_d は別のノブ)—— 熱の上限は観測の熱を全部ずれの熱に当てた上限(機構の同定ではない)', '供給の則は対数の最小二乗の候補(法則ではない —— ノブの組の表と残差)',
  '水星・金星の外れは潮汐で遅くなった候補として記録するだけ(潮汐の式は別の枝)', 'ずれの熱の表は比(点火の条件は置かない —— 密度と温度の計算が要る)', '文献の値は未照合']);
/** 器の宣言(走らせたノブの格子 —— 結果を見て変えた所は AMEND に理由つき) */
export const PLAN = Object.freeze({
  /** 本の時刻の 16 体の添字の順(第335便b の正本の book.bodies と同じ) */
  keys: Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', 'europa', 'ganymede', 'callisto', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  primary: Object.freeze([[MER, 'sun'], ['venus', 'sun'], ['earth', 'sun'], ['mars', 'sun'], ['jupiter', 'sun'], [SAT, 'sun'], ['uranus', 'sun'], ['neptune', 'sun'], ['moon', 'earth'], ['io', 'jupiter'], ['europa', 'jupiter'],
    ['ganymede', 'jupiter'], ['callisto', 'jupiter'], ['titan', SAT], ['triton', 'neptune']].map((q) => Object.freeze(q))),
  /** T1 の受け手(軸): 黄道の北極・不変面の北極(本の時刻の全角運動量)・太陽と惑星と衛星の自転軸(順はブリーフの順) */
  t1Recv: Object.freeze(['sun', 'earth', 'mars', 'jupiter', 'venus', 'io', SAT, 'uranus', 'neptune', MER]),
  /** T3 の天体(帳簿)と並べるだけの天体 */
  budget: Object.freeze(['sun', 'earth', 'mars', 'jupiter', 'venus', 'io']), listed: Object.freeze([SAT, 'uranus', 'neptune']),
  /** 第335便b の供給の帳簿の行と源(対照の列) */
  supplyRows: Object.freeze([Object.freeze(['sunJup', 'sun']), Object.freeze([EM, 'earth']), Object.freeze(['jupIo', 'jupiter']), Object.freeze(['satRingB', SAT])]),
  /** T4 の主の組・組の外(潮汐で遅くなった候補 —— 記録するだけ)・持ち出す衛星・ノブを足す順 */
  fitMain: Object.freeze(['sun', 'earth', 'mars', 'jupiter', SAT, 'uranus', 'neptune']), fitOut: Object.freeze([MER, 'venus']),
  carryOut: Object.freeze(['io', 'europa', 'ganymede', 'callisto', 'titan', 'triton', 'moon']),
  knobSteps: Object.freeze([Object.freeze([]), Object.freeze(['lm']), Object.freeze(['lm', 'lr']), Object.freeze(['lm', 'lr', 'lp']), Object.freeze(['lm', 'lr', 'lp', 'lmp'])]),
  knobJa: Object.freeze({ lm: 'log10 M', lr: 'log10 R', lp: 'log10 主星までの距離', lmp: 'log10 主星の質量', lbr: 'log10 √(GM/R³)' }),
  /** 熱の上限の Γ_d の則の天体(観測の熱がある天体)とノブ */
  gammaFit: Object.freeze(['sun', 'earth', 'mars', 'jupiter', SAT, 'io']), gammaKnobSteps: Object.freeze([Object.freeze(['lm']), Object.freeze(['lm', 'lr'])]),
  /** 差分の読みの太陽 → 惑星の表の受け手 */
  axialPlanets: Object.freeze([MER, 'venus', 'earth', 'mars', 'jupiter', SAT, 'uranus', 'neptune']),
  /** T5 の半径の格子(÷ 今の半径) */
  shearRadii: Object.freeze([1e4, 1e3, 1e2, 10, 3, 1]),
  /** 太陽の銀河の中心からの距離(T4 の主星までの距離 —— 第335便b の正本の銀河の R₀)・銀河の質量(同じく M) */
  sunPrimary: 'milkyWayCenter',
});
export const AMEND = Object.freeze([]);

/* ───────── 入力 ───────── */
export function readJson(rel, root = ROOT) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
const B330 = S330.DECL.lit;
/** 本の時刻の状態に慣性係数と文献の周期を足す */
export function bodiesOf(CL) {
  const B = CL.book.bodies;
  if (!(Array.isArray(B) && B.length === PLAN.keys.length && B.every((b, i) => b.key === PLAN.keys[i]))) throw new Error('入力の本の状態の順が違う');
  return B.map((b) => ({ key: b.key, p: b.p, v: b.v, sHat: b.sHat, s: b.sObs, m: b.m, R: b.R, f: B330.moi[b.key], I: B330.moi[b.key] * b.m * b.R * b.R }));
}
const byKey = (B, k) => B.find((b) => b.key === k);
const primaryOf = (k) => { const q = PLAN.primary.find((x) => x[0] === k); return q ? q[1] : null; };

/* ───────── T1 ───────── */
export function partT1(B, CL) {
  const ax = CL.galaxy.axes, Lhat = ax.Lhat, gal = CL.galaxy.gal, oo = L.DECL.oort;
  const rates = L.CURVES.map((c) => L.localRates(c === 'oort' ? { curve: c, A_O: oo.A * L.KMS_KPC, B_O: oo.B * L.KMS_KPC } : { curve: c, Omega: gal.Omega }));
  // 全角運動量(太陽の自転 + 惑星の公転〔太陽に対して〕+ 衛星の公転〔主星に対して〕+ 惑星と衛星の自転)—— 不変面の北極
  const sun = byKey(B, 'sun');
  const parts = { sunSpin: scl(sun.sHat, sun.I * sun.s), planetOrbit: [0, 0, 0], planetSpin: [0, 0, 0], moonOrbit: [0, 0, 0], moonSpin: [0, 0, 0] };
  for (const b of B) {
    if (b.key === 'sun') continue;
    const pk = primaryOf(b.key), P = byKey(B, pk), Lo = scl(crs(sub(b.p, P.p), sub(b.v, P.v)), b.m), Ls = scl(b.sHat, b.I * b.s);
    if (pk === 'sun') { parts.planetOrbit = add(parts.planetOrbit, Lo); parts.planetSpin = add(parts.planetSpin, Ls); } else { parts.moonOrbit = add(parts.moonOrbit, Lo); parts.moonSpin = add(parts.moonSpin, Ls); }
  }
  const Ltot = Object.values(parts).reduce(add, [0, 0, 0]);
  const axes = [{ key: 'ecl', ja: '黄道の北極', axis: [0, 0, 1] }, { key: 'inv', ja: '不変面の北極(本の時刻の全角運動量)', axis: unit(Ltot) }, ...PLAN.t1Recv.map((k) => ({ key: k, ja: k, axis: byKey(B, k).sHat, s: byKey(B, k).s }))];
  // 幾何(L̂·x̂・逆向きからの角)
  const geom = axes.map((a) => { const p = L.projectOn({ omega: 1, Lhat, axis: a.axis }); return { key: a.key, LdotX: p.LdotX, angleFromAntiDeg: p.angleFromAntiDeg, retroComp: -p.LdotX }; });
  // 読みの表(曲線 × 読み)
  const readings = [];
  for (const r of rates) for (const rd of L.READINGS) {
    const sF = rd === 'dfmRigid' ? r.Omega : 0, o = L.readingOmega(rd, r, sF);
    readings.push({ curve: r.curve, reading: rd, sField: rd === 'dfmRigid' ? sF : null, omega: o.omega, zeta: o.zeta, retro: o.retro,
      proj: axes.map((a) => { const p = L.projectOn({ omega: o.omega, Lhat, axis: a.axis }); return { key: a.key, comp: p.comp, sign: p.sign, overS: fin(a.s) ? p.comp / a.s : null }; }) });
  }
  // DFM の読みの s_field の格子(曲線ごと)と J 等価の s_d の行
  const dfm = rates.map((r) => ({ curve: r.curve, threshold: L.dfmRetroThreshold(r), thresholdOverOmega: L.dfmRetroThreshold(r) / r.Omega,
    rows: [...L.DECL.sFieldOverOmega.map((k) => ({ label: String(k), sField: k * r.Omega })), { label: 'sdJ', sField: gal.sd }].map((q) => { const o = L.readingOmega('dfmRigid', r, q.sField);
      return { label: q.label, sField: q.sField, omega: o.omega, retro: o.retro, sunComp: L.projectOn({ omega: o.omega, Lhat, axis: byKey(B, 'sun').sHat }).comp, eclComp: L.projectOn({ omega: o.omega, Lhat, axis: [0, 0, 1] }).comp }; }) }));
  // 傾きのノブ θ と本の幾何の θ
  const tilt = L.DECL.thetaDeg.map((t) => L.tiltRow(t));
  const tiltGeom = geom.filter((g) => ['ecl', 'inv', 'sun'].includes(g.key)).map((g) => ({ key: g.key, thetaDeg: g.angleFromAntiDeg, row: L.tiltRow(g.angleFromAntiDeg) }));
  // 対照: 第335便b の場の読み(銀河の公転の角速度 Ω_gal L̂)—— 平坦の曲線の orbit の読みが同じ列になるか
  const flatOrbit = readings.find((q) => q.curve === 'flat' && q.reading === 'orbit');
  const control = CL.galaxy.rows.map((g) => { const b = byKey(B, g.key), c = L.projectOn({ omega: flatOrbit.omega, Lhat, axis: b.sHat }).comp / b.s;
    return { key: g.key, parOverS: c, ref: g.readings.rotation.parOverS, rel: relD(c, g.readings.rotation.parOverS), sHatDotL: dot(b.sHat, Lhat), refSHatDotL: g.sHatDotL }; });
  return { Lhat, gal: { Omega: gal.Omega, sd: gal.sd, R0: gal.R0, M: gal.M }, rates, Lparts: Object.entries(parts).map(([k, v]) => ({ key: k, vec: v, mag: nrm(v) })), Ltot, LtotMag: nrm(Ltot), geom, readings, dfm, tilt, tiltGeom, control };
}

/* ───────── T1′ 軸引きずりの差分の読み(原仮定者の補足(2026-11-14 —— 第138報の補足))───────── */
const AU = L.DECL.AU;
const srcOfB = (b) => ({ key: b.key, p: b.p, v: b.v, s: scl(b.sHat, b.s), m: b.m });
/** 受け手 recv の位置で、源の組 group(差分の読みを測る源)と重みの和を作る源の全部 all から: diff・full・mix(λ の格子)と EQ-31(`integratedField` の組の分の ω) */
export function axialGroup({ recv, group, all, alpha }) {
  const W = all.reduce((t, q) => t + L.weight337(q.m, nrm(sub(q.p, recv.p)), alpha, AU), 0);
  let diff = [0, 0, 0], full = [0, 0, 0], share = 0;
  for (const q of group) { const a = L.axialAt({ at: recv.p, vRecv: recv.v, src: q, W, alpha, rRef: AU }); diff = add(diff, a.diff); full = add(full, a.full); share += a.share; }
  const F = B333.integratedField({ at: recv.p, sources: all, alpha, rRef: AU, parts: true }), idx = new Set(group.map((q) => all.indexOf(q)));
  let J = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  F.parts.forEach((pt, i) => { if (!idx.has(i)) return; for (const M of [pt.spinDirect, pt.spinGrad, pt.trans]) for (let a = 0; a < 3; a++) for (let c = 0; c < 3; c++) J[a][c] += M[a][c]; });
  const eq31 = B333.localSpin(J).omega;
  const mix = L.DECL.axialLambda.map((lam) => ({ lambda: lam, omega: L.axialMix({ diff, full }, lam) }));
  return { W, share, diff, full, mix, eq31, eq31Total: F.omega };
}
export function partAxial(B, CL, T1) {
  const Lhat = T1.Lhat, sun = byKey(B, 'sun'), protoAxis = scl(Lhat, -1), solar = B.filter((b) => b.key !== 'sun').map(srcOfB);
  const nowAxis = [0, 0, 1];
  const coef = [1, 1.5, 2, 3].map(L.axialCoef);
  // 銀河の源 3 つ(中心の点 —— 自転は観測の回転 Ω/J 等価の s_d・半径の内の和)× α × 読み
  const variants = [{ key: 'center|obs', srcs: C335.galaxySources({ variant: 'center', spin: 'obs' }) }, { key: 'center|jd', srcs: C335.galaxySources({ variant: 'center', spin: 'jd' }) }, { key: 'inner', srcs: C335.galaxySources({ variant: 'inner' }) }];
  const comp = (w) => ({ alongL: dot(w, Lhat), overS: dot(w, sun.sHat) / sun.s, proto: dot(w, protoAxis), now: dot(w, nowAxis), mag: nrm(w), alongLRel: nrm(w) > 0 ? dot(w, Lhat) / nrm(w) : 0 });
  const galaxy = [];
  for (const v of variants) for (const al of L.DECL.axialAlphas) {
    const group = v.srcs.map((q) => ({ key: q.key, p: q.p, v: q.v, s: q.s, m: q.m })), all = [...solar, ...group];
    const R = axialGroup({ recv: { p: sun.p, v: sun.v }, group, all, alpha: al });
    galaxy.push({ variant: v.key, alpha: al, nSrc: group.length, share: R.share, diff: comp(R.diff), full: comp(R.full), mix: R.mix.map((m) => Object.assign({ lambda: m.lambda }, comp(m.omega))), eq31: comp(R.eq31) });
  }
  // 太陽の軸引きずりが惑星の自転に与える向き(源 = 太陽・W は太陽系の 15 体)
  const planets = PLAN.axialPlanets.map((k) => {
    const b = byKey(B, k), all = B.filter((q) => q.key !== k).map(srcOfB), sunSrc = all.find((q) => q.key === 'sun'), rel = sub(b.p, sun.p), vr = sub(b.v, sun.v), n = nrm(crs(rel, vr)) / (nrm(rel) * nrm(rel));
    const zSun = dot(rel, sun.sHat) / nrm(rel), cols = L.DECL.axialAlphas.map((al) => { const R = axialGroup({ recv: { p: b.p, v: b.v }, group: [sunSrc], all, alpha: al });
      const one = (w) => ({ alongSun: dot(w, sun.sHat), alongSpin: dot(w, b.sHat), overS: dot(w, b.sHat) / b.s, agree: Math.sign(dot(w, b.sHat)) > 0 });
      return { alpha: al, share: R.share, diff: one(R.diff), full: one(R.full), mix: one(R.mix.find((m) => m.lambda === 0.5).omega), eq31: one(R.eq31), coefDiff: (1 - al) * sun.s + al * n }; });
    return { key: k, n, sOverN: sun.s / n, latSun: Math.asin(Math.max(-1, Math.min(1, zSun))) * 180 / Math.PI, spinDotSun: dot(b.sHat, sun.sHat), cols };
  });
  // 角の置き方: 原始太陽系 180°(軸 = −L̂)・今の太陽系 120°(黄道の北極)—— 差分の読みの向きの射影
  const angles = { protoDeg: L.DECL.protoDeg, nowDeg: L.DECL.nowDeg, nowGeomDeg: 180 - T1.geom.find((g) => g.key === 'ecl').angleFromAntiDeg, protoDotNow: dot(protoAxis, nowAxis), tiltFromSupplyDeg: T1.geom.find((g) => g.key === 'ecl').angleFromAntiDeg };
  return { coef, galaxy, planets, angles, localFluid: partLocalFluid(T1) };
}
/**
 * 源を「差動回転する局所の流体」と置いた読み(慣性系・受け手は局所の流れと一緒に動く —— 銀河の局所の枠: x̂ 動径の外向き・ŷ 回転の向き・ẑ = L̂)。
 *   閉じた式: 近い面と遠い面の差分だけ = 動径の勾配 dV/dR = −(A + B)/横の面の分 = V/R = Ω/渦度 ζ = dV/dR + V/R = −2B(回転率は ½ζ = −B)/共回転系の差分 dV/dR − Ω = −2A。
 *   測り: 受け手のまわりの一様な環(面内 —— 点 64)と球殻(点 16 × 32)に流れの相対の速度 u = (−Ω y, (dV/dR) x) の要素(自転 0 か ½ζ)を置き、
 *   (a) 正規化した場 U = Σ w C/Σ w の動径の差分 ∂_x U_y(W の勾配を含む —— 対称なら流れの勾配と同じか)と、(b) W を固定した源ごとの差分の和(重みの勾配の項 —— 中心の点の αn に当たる)。
 */
export function partLocalFluid(T1) {
  const Lz = T1.Lhat, ecl = [0, 0, 1], dotL = dot(ecl, Lz);
  const rows = T1.rates.map((r) => { const dV = -(r.A + r.B), lat = r.Omega, zeta = -2 * r.B, co = dV - r.Omega;
    const one = (x) => ({ value: x, overOmega: x / r.Omega, dir: x > 0 ? 1 : x < 0 ? -1 : 0, proto: -x, now: x * dotL });
    return { curve: r.curve, diff: one(dV), lateral: one(lat), zeta: one(zeta), rate: one(zeta / 2), corotDiff: one(co), corotZeta: one(-2 * r.A), mixHalf: one(0.5 * dV + 0.5 * zeta / 2) }; });
  const meas = [];
  for (const r of T1.rates.filter((q) => ['flat', 'oort'].includes(q.curve))) {
    const dV = -(r.A + r.B), Om = r.Omega, uOf = (d) => [-Om * d[1], dV * d[0], 0];
    const ring = Array.from({ length: 64 }, (_, k) => { const t = 2 * Math.PI * (k + 0.5) / 64; return [Math.cos(t), Math.sin(t), 0]; });
    const shell = []; for (let i = 0; i < 16; i++) { const ct = -1 + (2 * i + 1) / 16, st = Math.sqrt(1 - ct * ct); for (let k = 0; k < 32; k++) { const t = 2 * Math.PI * (k + 0.5) / 32; shell.push([st * Math.cos(t), st * Math.sin(t), ct]); } }
    for (const [shape, pts] of [['ring', ring], ['shell', shell]]) for (const spin of ['zero', 'halfZeta']) for (const al of L.DECL.axialAlphas) {
      const sv = spin === 'zero' ? [0, 0, 0] : [0, 0, -r.B], srcs = pts.map((d) => ({ p: d, v: uOf(d), s: sv, m: 1 }));
      const Wof = (p) => srcs.reduce((t, q) => t + L.weight337(q.m, nrm(sub(q.p, p)), al, 1), 0), W = Wof([0, 0, 0]);
      let diffSum = [0, 0, 0]; for (const q of srcs) diffSum = add(diffSum, L.axialAt({ at: [0, 0, 0], vRecv: [0, 0, 0], src: q, W, alpha: al, rRef: 1 }).diff);
      const U = (p) => { let P = [0, 0, 0], w = 0; for (const q of srcs) { const ww = L.weight337(q.m, nrm(sub(p, q.p)), al, 1); P = add(P, scl(add(q.v, crs(q.s, sub(p, q.p))), ww)); w += ww; } return scl(P, 1 / w); };
      const h = 1e-4, dUy = (U([h, 0, 0])[1] - U([-h, 0, 0])[1]) / (2 * h), dUx = (U([0, h, 0])[0] - U([0, -h, 0])[0]) / (2 * h);
      meas.push({ curve: r.curve, shape, spin, alpha: al, n: pts.length, fieldDiff: dUy, fieldDiffOverDV: dV !== 0 ? dUy / dV : null, fieldZetaOverZeta: (dUy - dUx) / (-2 * r.B),
        weightTerm: diffSum[2], weightTermOverHalfZeta: diffSum[2] / (-r.B), weightTermOverOmega: diffSum[2] / Om });
    }
  }
  return { rows, meas, dotL };
}

/* ───────── T2 ───────── */
export function partT2(B, T1) {
  const M = B.reduce((t, b) => t + b.m, 0), Lnow = T1.LtotMag, sun = byKey(B, 'sun'), Lsun = sun.I * sun.s;
  const comps = T1.Lparts.map((q) => ({ key: q.key, mag: q.mag, share: q.mag / Lnow }));
  const rows = T1.readings.filter((q) => q.reading !== 'dfmRigid').map((q) => { const C = L.cloudRow({ M, Rc: L.DECL.AU, omega0: q.omega, Lnow }), Cs = L.cloudRow({ M: sun.m, Rc: L.DECL.AU, omega0: q.omega, Lnow: Lsun });
    if (C.RcMatch === null) return { curve: q.curve, reading: q.reading, omega0: 0, RcMatch: null, RcMatchAU: null, RcMatchPc: null, rhoMatch: null, sunRcMatch: null, sunRcMatchAU: null, sunRadiusRatio: null, sunSpinUp: null, sunSpinUpObs: null };   // ω₀ = 0(剛体の曲線の共回転系のずれ)—— 雲は回らない
    const col = L.collapseRow({ Rc: Cs.RcMatch, R: sun.R, f: sun.f });
    return { curve: q.curve, reading: q.reading, omega0: Math.abs(q.omega), RcMatch: C.RcMatch, RcMatchAU: C.RcMatch / L.DECL.AU, RcMatchPc: C.RcMatch / L.PC, rhoMatch: C.rhoMatch,
      sunRcMatch: Cs.RcMatch, sunRcMatchAU: Cs.RcMatch / L.DECL.AU, sunRadiusRatio: col.radiusRatio, sunSpinUp: col.spinUp, sunSpinUpObs: sun.s / Math.abs(q.omega) }; });
  const grid = [...L.DECL.cloudRcAU.map((a) => ({ label: a + ' AU', Rc: a * L.DECL.AU })), ...L.DECL.cloudRcPc.map((p) => ({ label: p + ' pc', Rc: p * L.PC }))];
  const main = T1.readings.filter((q) => q.curve === L.DECL.mainCurve && q.reading !== 'dfmRigid');
  const gridRows = grid.map((g) => ({ label: g.label, Rc: g.Rc, rho: L.cloudRow({ M, Rc: g.Rc, omega0: 1, Lnow }).rho, ratios: main.map((q) => ({ reading: q.reading, ratio: L.cloudRow({ M, Rc: g.Rc, omega0: q.omega, Lnow }).ratio })) }));
  const core = L.LIT337A.coreGradKmsPc.map((gk) => { const w = gk * 1e3 / L.PC, C = L.cloudRow({ M, Rc: L.DECL.AU, omega0: w, Lnow }); return { gradKmsPc: gk, omega0: w, RcMatchAU: C.RcMatch / L.DECL.AU, RcMatchPc: C.RcMatch / L.PC }; });
  return { M, Lnow, Lsun, comps, rows, gridRows, core, coreRPc: L.LIT337A.coreRPc };
}

/* ───────── T3 ───────── */
const LITHEAT = (CL, k) => { const q = CL.lit.heatFlowW.find((x) => x[0] === k); return q ? q[1] : undefined; };
export function heatOf(CL, b) {
  if (b.key === 'sun') return { H: CL.lit.lumSun, src: 'lumSun' };
  if (b.key === 'mars') return { H: L.LIT337A.marsHeatFlux * 4 * Math.PI * b.R * b.R, src: 'marsHeatFlux' };
  const h = LITHEAT(CL, b.key); return { H: fin(h) ? h : null, src: fin(h) ? 'carryledger' : null };
}
export function sdotOf(b) {
  if (b.key === 'earth') { const P = 2 * Math.PI / b.s, dPdt = L.LIT337A.earthLodMsPerCy * 1e-3 / (100 * L.DECL.yearS) * (P / 86400); return { sdot: -b.s * dPdt / P, src: 'earthLod' }; }
  if (b.key === 'venus') { const P = 2 * Math.PI / b.s, dPdt = L.LIT337A.venusLodMin * 60 / L.DECL.yearS; return { sdot: b.s * dPdt / P, src: 'venusLod' }; }
  return { sdot: null, src: null };
}
export function partT3(B, CL, T1) {
  const ageS = L.LIT337A.ageYr * L.DECL.yearS, o = L.DECL.ode;
  // 無次元の 1 本(s* = 1・τ = 1)
  const p0 = { I: 1, Gd: 1, Nin: 1 - o.wOverStar, wEff: o.wOverStar, s0: o.s0OverStar, tOff: o.tOffOverTau }, R0 = L.odeRun(p0, { tEnd: o.tEndOverTau, steps: o.steps });
  const main = T1.readings.find((q) => q.curve === L.DECL.mainCurve && q.reading === L.DECL.mainReading);
  const rowsFor = (keys) => keys.map((k) => {
    const b = byKey(B, k), w = main.proj.find((q) => q.key === k) ? main.proj.find((q) => q.key === k).comp : L.projectOn({ omega: main.omega, Lhat: T1.Lhat, axis: b.sHat }).comp;
    const h = heatOf(CL, b), sd = sdotOf(b), bb = L.bodyBudget({ I: b.I, s: b.s, wEff: w, H: h.H, ageS, sdotObs: sd.sdot });
    // τ の単位の 1 本(定常から供給 OFF —— 1 τ で e^{−1})
    const wr = w / b.s, R = L.odeRun({ I: 1, Gd: 1, Nin: 1 - wr, wEff: wr, s0: 1, tOff: 1 }, { tEnd: 1 + o.tEndOverTau, steps: o.steps });
    const wAll = T1.readings.filter((q) => q.reading !== 'dfmRigid').map((q) => ({ curve: q.curve, reading: q.reading, wEffOverS: L.projectOn({ omega: q.omega, Lhat: T1.Lhat, axis: b.sHat }).comp / b.s }));
    return Object.assign({ key: k, m: b.m, R: b.R, f: b.f, heatSrc: h.src, sdotSrc: sd.src, sdot: sd.sdot, halfAfterOffYr: fin(bb.tauMinYr) ? bb.tauMinYr * Math.LN2 : null,
      odeTau: { errRel: R.errRel, ledgerRel: R.ledgerRel, decay1: R.decay1, decay1Expect: R.decay1Expect }, wAll }, bb);
  });
  const rows = rowsFor(PLAN.budget), listed = rowsFor(PLAN.listed);
  // 受動の型の対照(第335便b の供給の帳簿の行 —— 場の読み = 銀河の公転の角速度)
  const flatOrbit = T1.readings.find((q) => q.curve === 'flat' && q.reading === 'orbit');
  const passive = PLAN.supplyRows.map(([rk, src]) => { const b = byKey(B, src), ref = CL.supply.rows.find((x) => x.key === rk), w = L.projectOn({ omega: flatOrbit.omega, Lhat: T1.Lhat, axis: b.sHat }).comp;
    const bb = L.bodyBudget({ I: b.I, s: b.s, wEff: w, H: null, ageS });
    return { key: rk, src, targetParOverS: w / b.s, refTarget: ref.readings.rotation.targetParOverS, gapOverS: bb.passive.gapOverS, refGap: ref.readings.rotation.passive.gapOverS, refFeasible: ref.readings.rotation.passive.feasible,
      feasible: bb.passive.feasible, rel: Math.max(relD(w / b.s, ref.readings.rotation.targetParOverS), relD(bb.passive.gapOverS, ref.readings.rotation.passive.gapOverS)), noSupplyYr335b: ref.readings.rotation.noSupplyYr }; });
  return { ageS, main: { curve: main.curve, reading: main.reading, omega: main.omega }, ode: Object.assign({ p: p0 }, R0), rows, listed, passive };
}

/* ───────── T4 ───────── */
export function partT4(B, CL, T1, T3) {
  const gal = T1.gal, invAxis = T1.geom.find((g) => g.key === 'inv');
  const nInv = unit(T1.Ltot);
  const rowOf = (k) => {
    const b = byKey(B, k), pk = primaryOf(k), P = pk ? byKey(B, pk) : null, dist = P ? nrm(sub(b.p, P.p)) : gal.R0, mp = P ? P.m : gal.M, sign = Math.sign(dot(b.sHat, nInv)) || 1;
    return { key: k, y: lg(b.s), sign, sSigned: sign * b.s, x: { lm: lg(b.m), lr: lg(b.R), lp: lg(dist), lmp: lg(mp), lbr: lg(Math.sqrt(L.DECL.G * b.m / (b.R * b.R * b.R))) }, breakup: b.s / Math.sqrt(L.DECL.G * b.m / (b.R * b.R * b.R)) };
  };
  const keys = [...PLAN.fitMain, ...PLAN.fitOut, ...PLAN.carryOut], rows = keys.map(rowOf);
  const steps = PLAN.knobSteps.map((kn) => Object.assign(L.fitKnobs({ rows, knobs: kn, fitKeys: PLAN.fitMain }), { loo: L.fitLoo({ rows, knobs: kn, fitKeys: PLAN.fitMain }) }));
  const stepsAll = PLAN.knobSteps.map((kn) => L.fitKnobs({ rows, knobs: kn, fitKeys: [...PLAN.fitMain, ...PLAN.fitOut] }));   // 対照: 水星・金星も主の組に入れた場合
  // 破断の型(log10 s = c₀ + log10 √(GM/R³) —— 係数を 1 に固定 —— y − lbr を定数で)
  const brRows = rows.map((r) => ({ key: r.key, y: r.y - r.x.lbr, x: {} })), br = L.fitKnobs({ rows: brRows, knobs: [], fitKeys: PLAN.fitMain });
  // 熱の上限の Γ_d の則(log10 (H/(s − ω_eff)²))
  const gRows = PLAN.gammaFit.map((k) => { const t = [...T3.rows, ...T3.listed].find((q) => q.key === k), b = byKey(B, k); return { key: k, y: lg(t.GdMax), x: { lm: lg(b.m), lr: lg(b.R) } }; });
  const gamma = PLAN.gammaKnobSteps.map((kn) => L.fitKnobs({ rows: gRows, knobs: kn, fitKeys: PLAN.gammaFit }));
  return { tol: L.DECL.fitTol, invLdotL: invAxis.LdotX, rows: rows.map((r) => ({ key: r.key, y: r.y, sign: r.sign, sSigned: r.sSigned, x: r.x, breakup: r.breakup })), steps, stepsAll, breakup: br, gamma };
}

/* ───────── T5 ───────── */
export function partT5(B, T3, T4) {
  const sun = byKey(B, 'sun'), t = T3.rows.find((q) => q.key === 'sun'), g = T4.gamma.find((q) => q.knobs.join() === 'lm,lr'), dFit = g ? g.coef[2] : null;
  const ds = L.DECL.shearD.slice();
  return { dList: ds, dFitRef: dFit, dFitOk: g ? g.nOk + '/' + g.nFit : null, rows: PLAN.shearRadii.map((k) => ({ ROverNow: k, cols: ds.map((d) => L.shearHeatRow({ R: k * sun.R, Rnow: sun.R, sNow: sun.s, wEff: t.wEff, d })) })) };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const t = L.DECL.idTol;
  const T1 = J.t1, T3 = J.t3;
  const retroKeys = T1.readings.filter((q) => q.retro).map((q) => q.reading);
  return {
    pure: Object.values(J.pure.gates).every((v) => v === true),
    input: J.inputs.version === 'w335b-carryledger-1' && J.inputs.n === 16,
    t1Rates: T1.rates.every((r) => relD(r.A - r.B, r.Omega) <= t) && T1.rates.length === 4 && T1.readings.length === 20,
    t1Sign: T1.readings.every((q) => ['shearCorot', 'epicycle', 'dfmRigid'].includes(q.reading) === q.retro || (q.curve === 'rigid' && ['shearCorot', 'dfmRigid'].includes(q.reading) && q.omega === 0))
      && T1.readings.filter((q) => q.retro).every((q) => q.proj.find((p) => p.key === 'ecl').sign === 1 && q.proj.find((p) => p.key === 'sun').sign === 1) && retroKeys.length > 0,
    t1Control: T1.control.length === 9 && T1.control.every((c) => c.rel <= t && relD(c.sHatDotL, c.refSHatDotL) <= t),
    t1Tilt: T1.tilt.find((q) => q.thetaDeg === 60).kind === 'boundary' && T1.tiltGeom.length === 3,
    axial: J.axial.galaxy.length === 9 && J.axial.planets.length === 8 && J.axial.coef.every((c) => c.diff === 1 - c.alpha) && J.axial.galaxy.every((g) => [g.diff.mag, g.full.mag, g.eq31.mag].every(fin)) && J.axial.localFluid.rows.length === 4 && J.axial.localFluid.meas.length === 24,
    t2: J.t2.rows.every((r) => (fin(r.RcMatch) && r.RcMatch > 0) || (r.RcMatch === null && r.omega0 === 0)) && J.t2.comps.length === 5 && nrm(sub(J.t1.Lparts.reduce((a, q) => add(a, q.vec), [0, 0, 0]), J.t1.Ltot)) <= t * J.t2.Lnow,
    t3Ode: T3.ode.errRel <= L.DECL.odeTol && T3.ode.ledgerRel <= 1e-10 && Math.abs(T3.ode.decay1 - T3.ode.decay1Expect) <= 1e-9
      && [...T3.rows, ...T3.listed].every((r) => r.odeTau.errRel <= L.DECL.odeTol && r.odeTau.ledgerRel <= 1e-10 && Math.abs(r.odeTau.decay1 - r.odeTau.decay1Expect) <= 1e-9),
    t3Budget: [...T3.rows, ...T3.listed].every((r) => r.steadyRel === null || r.steadyRel <= t) && T3.rows.length === 6,
    t3Passive: T3.passive.length === 4 && T3.passive.every((p) => p.rel <= t && p.feasible === false && p.refFeasible === false),
    t4: J.t4.steps.length === 5 && J.t4.steps.every((s) => fin(s.rms) && s.loo.n === PLAN.fitMain.length) && J.t4.gamma.length === 2,
    t5: J.t5.rows.length === 6 && J.t5.rows.every((r) => r.cols.every((c) => fin(c.heatRel))),
  };
}

export function runFrom(CL) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const B = bodiesOf(CL); mark('book');
  const t1 = partT1(B, CL); mark('t1');
  const axial = partAxial(B, CL, t1); mark('axial');
  const t2 = partT2(B, t1); mark('t2');
  const t3 = partT3(B, CL, t1); mark('t3');
  const t4 = partT4(B, CL, t1, t3); mark('t4');
  const t5 = partT5(B, t3, t4); mark('t5');
  const J = { inputs: { file: INPUT, version: CL.version, libVersion: CL.libVersion, n: CL.book.n }, pure, bodies: B.map((b) => ({ key: b.key, s: b.s, sHat: b.sHat, m: b.m, R: b.R, f: b.f, I: b.I })), t1, axial, t2, t3, t4, t5, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
/** 文献の値の出力の形 */
export const litOut = () => Object.assign({}, L.LIT337A, { heatMoi: 'lib-w330a-spinclass の lit.moi(慣性係数)・熱流は第335便b の正本の lit(太陽の光度・地球・木星・イオ・土星)' });
const writeJson = (OUT, out) => { fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(out, null, 1).replace(/\[\s*(-?[\d.eE+-]+(?:,\s*-?[\d.eE+-]+|,\s*null)*)\s*\]/g, (m, a) => '[' + a.replace(/\s+/g, '') + ']') + '\n'); };

/* ───────── 走らせる ───────── */
export async function main() {
  const t0 = Date.now();
  const OUT = process.env.W337A_OUT ? (path.isAbsolute(process.env.W337A_OUT) ? process.env.W337A_OUT : path.join(ROOT, process.env.W337A_OUT)) : path.join(ROOT, OUT_MAIN);
  console.log('第337便a supply(版 ' + HARNESS_VERSION + ')');
  const R = runFrom(readJson(INPUT));
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w337a-supply.mjs', target: TARGET,
    ruling: '原仮定者の補足(2026-11-14 —— 第138報の補足)「軸引きずりは、並進引きずりで引きずられる側の、近い面と遠い面の差分なので、赤道面では源の回転と逆回転になる」「回転の向きを揃えると、１２０度の傾き」「原始太陽系は、銀河の「軸引きずり」により、銀河の回転と逆回転になる。回転の向きを揃えると、１８０度の傾き」・'
      + '原仮定者の指示(2026-11-14 —— 第138報)「安定した天体の運行は、偶然では無く、釣り合った結果と捉える。釣り合う為には、正と負、供給と減衰の両方が必要である。減衰とは、供給が止まるとピタリと止まるものでは無い意味を含む」'
      + '「銀河の回転に対して、太陽系は逆向きに軸を60度傾けて回っている。供給の向きは合っていて、傾きはノブになる」「原始太陽系は、銀河の渦の中の、小さな渦が起源となる」(作業仮説 —— 探索の候補の表)・統括の検証項目 R337',
    declText: L.DECL_TEXT, decl: L.DECL, plan: PLAN, amend: AMEND, lit: litOut(), notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w337a-supply.mjs', 'tests/lib-w337a-supply.mjs', 'tests/lib-w330a-spinclass.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w335b-carryledger.mjs', 'tests/lib-w334b-ledger.mjs',
    'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第337便a', target: TARGET, code: CODE, inputs: [INPUT] }), {
    harnessVersion: HARNESS_VERSION, stage: 'supply', engine: 'Node の純関数だけ(html を読まない —— 本の時刻の状態は第335便b の正本から読む・エンジンの步を進めない)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, w281aStableInputs(ROOT, out.meta.inputs));
  writeJson(OUT, out);
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

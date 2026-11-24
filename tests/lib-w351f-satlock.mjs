// 第351便f(原仮定者の回答(2026-11-24 —— 第147報)「AN1001: Aで進める。主要衛星は潮汐ロックしている」・統括の検証項目 R432):
//   **衛星の組の由来(母天体由来・太陽由来の成分 (M)(S)(MS) と一様な背景)・潮汐ロックの 3 列((ア) 観測の事実として比べる自転を道の法線・平均運動に置く〔主〕/(イ) ロックの拘束つき/
//   (ウ) 自由軸)・ロックを保つ潮汐のトルクの桁と軸引きずりの直交成分のトルクの比・互いにロックした連星(冥王星–カロン)の (M) と (S) を源の回転の形 2 つで —— 診断だけ**
//   (器 tests/exp-w351f-satlock.mjs と QA behavior.satlock351f・docs.satlock351f が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵は変えない(AN712 —— エンジンへ足す操作ではない)。**エネルギー・熱は持たない**(本便の第 2 段の枝 g)。
//   既存の lib は呼ぶだけ(本文は変えない): 第351便c(pairInput・partRot・pairParts・bgOm・cosTo・perpOf・raiseRate・PARENT_ROWS)・第351便d(r3Rate)・第348便h(makeField3・rot3・srcRot3・YK・DECL.combos)・
//   第350便b(equivR)・第350便e(termsOf)・第347便h(gaussLegendre)・第348便c(massOf)・第347便e(t1Table・geometry)・第312便a(Kball)・第337便c(BODY_SRC・BODY_ROWS・bodyRow・定数・DECL.bodies)・
//   第343便g(DECL.gmRepoParts —— 冥王星とカロンの重力定数の比の比べる列)。
//
// ■ 潮汐ロックは観測の事実として置く(第147報 AN1001・第138報)—— ロックを積分で作らない。(ア) は比べる自転を「道の法線・平均運動(宣言の公転の周期)」に置き、
//   宣言の自転軸と自転の率からロックからのずれを読む。(イ) は自転の率を平均運動に保つ拘束 —— 軸引きずりの平行成分 Ω∥(引きずり回転)はロックからのずれ Ω∥ ÷ n_orb として記録し、
//   慣性回転へは積まない。(ウ) は惑星と同じ扱い(拘束なし —— トルクの式の自転速度 ω_T = ω_I + Ω∥〔(S1)〕)。
// ■ 源の回転の形(第348便h の combos の rot): 'M' 球のモーメント(在位の形)/'q0' 落ち方なし(源の枠の剛体の回転)。第351便c の partRot は 'M' だけの口なので、同じ作りに形の引数を足した
//   partRotF を本 lib に置き、'M' で第351便c の partRot と同じ数になることを零試験で照合する(第351便c の lib は変えない)。
// ■ 相対の速さ: 第351便c の約束 √(G M_源 ÷ a)(源の質量だけ —— 主の列)と、比べる列「2 体の和」√(G (M_源 + m) ÷ a)(相対の速度の倍率 √((M_源 + m) ÷ M_源) を (M) に掛ける —— (M) は相対の速度に線形)。
// ■ 潮汐のトルク: 公開の lib に在る式だけ —— 第337便c の物差し N_tide = G M_p² R⁵ ÷ a⁶(係数はノブ: 1 と 1.5 k₂/Q〔k₂/Q は第337便c の既定 3e-3 —— 文献の桁・未照合〕)と、
//   第327便f の永久の四重極の型 (3/2)(G M_p ÷ a³)(B − A) sin 2δ の係数 (3/2) G M_p ÷ a³(衛星の (B − A) の値は公開の lib に無い —— 比が 1 になる (B − A) ÷ C を逆に書くだけ)。
// ■ 言わないこと: 潮汐ロックの成り立ちの答え・「潮汐力が上回っている」の当否とは書かない(比の数だけ)。衛星の歳差を軸引きずりだけで読んだ結果を成績と書かない。この場・この成分・この読みでは、の表。
import * as L from './lib-w351c-srcparts.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as G3 from './lib-w348h-axisgeo3.mjs';
import * as SC from './lib-w350b-sphereconv.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as H from './lib-w347h-axisdiff.mjs';
import * as C from './lib-w348c-axisbalance.mjs';
import * as E from './lib-w347e-spintorque.mjs';
import * as D from './lib-w312a-decay.mjs';
import * as TL from './lib-w337c-tidelock.mjs';
import { DECL as PG } from './lib-w343g-plutostate.mjs';

export const LIB_VERSION = 'w351f-satlock-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const G = TL.G_SI;

/* ───────── 宣言 ───────── */
export const DECL = Object.freeze({
  /** 衛星の組(表 1〜表 3 —— 月は傾きの最大と最小の位相の 2 行) */
  sats: Object.freeze([Object.freeze(['Moon', 'EarthHi']), Object.freeze(['Moon', 'EarthLo']), Object.freeze(['Io', 'Jupiter']), Object.freeze(['Pluto', 'Charon']), Object.freeze(['Charon', 'Pluto'])]),
  /** 由来の列: A = サンプルの中の源の全部(背景 + 太陽由来 + 母天体由来 —— 主)/B = 銀河と太陽の 2 項だけ(背景 + 太陽由来 —— 母天体を置かない) */
  cols: Object.freeze(['A', 'B']), mainCol: 'A',
  /** 潮汐ロックの 3 列 */
  lockCols: Object.freeze(['a', 'i', 'u']), mainLock: 'a',
  lockNames: Object.freeze({ a: '(ア) 観測の事実として比べる自転を道の法線・平均運動に置く(主)', i: '(イ) ロックの拘束つき(自転の率を平均運動に保つ・Ω∥ はずれとして記録)', u: '(ウ) 自由軸(惑星と同じ扱い)' }),
  /** 源の回転の形(第348便h の combos の rot) */
  rotForms: Object.freeze(['M', 'q0']), mainRot: 'M',
  /** 相対の速さの約束 */
  speeds: Object.freeze(['src', 'pair']), mainSpeed: 'src',
  /** 表 3 の天体(潮汐を起こす相手は第337便c の BODY_ROWS の perturbers) */
  tideBodies: Object.freeze(['Moon', 'Io', 'Pluto', 'Charon']), tideKey: Object.freeze({ Moon: 'Moon|EarthHi', Io: 'Io|Jupiter', Pluto: 'Pluto|Charon', Charon: 'Charon|Pluto' }),
  /** 潮汐の係数のノブ(第337便c の既定 —— 文献の桁・未照合) */
  k2q: TL.DECL.bodies.k2qSolid, tideFactor: 1.5,
  read: 'C2', den: 'out', bgMult: 1, bgSign: -1,
  /** 傾きの床(同期の宣言で自転軸 = 道の法線の組は丸めで向きが揺れる —— 第351便c の器と同じ 1e-6) */
  sinEps: 1e-6,
  /** 月の比べる数の印(〔第350便f〕—— 値は作らない) */
  moonNodeYr: 18.6,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});

/* ───────── 小さな道具 ───────── */
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]);
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (a) => { const m = nrm(a); return m > 0 ? scl(a, 1 / m) : [0, 0, 0]; };
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const perpPair = (a) => { const t = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], e2 = unit(crs(a, t)), e3 = crs(a, e2); return [e2, e3]; };
const GL = H.gaussLegendre(L.DECL.ballN);
const angDeg = (a, b) => Math.atan2(nrm(crs(a, b)), dot(a, b)) * 180 / Math.PI;
const srcId = (s) => (s === 'EarthHi' || s === 'EarthLo' ? 'Earth' : s);

/* ───────── 成分の回転(源の回転の形つき)───────── */
/**
 * 第351便c の partRot と同じ作り(受け手が原点で +v_orb v̂ で動き源は静止・位相 72・(C2) は GL 8 点の球の半径の平均)に、源の回転の形 rot('M' | 'q0')の引数を足したもの。
 * 'M' では第351便c の partRot と同じ数(零試験)。velScale・spinScale は相対の速度・源の自転の倍率(既定は part から)。
 */
export function partRotF(T1, GEO, id, src, { part, read = 'C2', extraW = 0, rot = 'M', velScale = null, spinScale = null, nPhase = L.DECL.nPhase } = {}) {
  const sc = part === 'M' ? [1, 0] : part === 'S' ? [0, 1] : part === 'MS' ? [1, 1] : null;
  if (!sc) throw new RangeError('partRotF: 成分は M・S・MS');
  if (!L.DECL.reads.includes(read)) throw new RangeError('partRotF: 読みは C2・W');
  if (!DECL.rotForms.includes(rot)) throw new RangeError('partRotF: 源の回転の形は M・q0');
  if (!(fin(extraW) && extraW >= 0)) throw new RangeError('partRotF: extraW ≥ 0');
  const vs = velScale === null ? sc[0] : velScale, ss = spinScale === null ? sc[1] : spinScale;
  const P = L.pairInput(T1, GEO, id, src), Rr = G3.YK * P.m, Rs = G3.YK * P.Ms, rf = rot === 'M' ? { form: 'M' } : { form: 'q', q: 0 };
  const x0 = crs(P.sAx, P.nHat), x = nrm(x0) > 1e-12 ? unit(x0) : perpPair(P.nHat)[0], y = crs(P.nHat, x);
  const radii = read === 'W' ? [[Rr, 1]] : GL.x.map((xi, i) => { const rho = 0.5 * Rr * (xi + 1); return [SC.equivR(Rr, rho), 0.5 * Rr * GL.w[i] * 5 * Math.pow(rho, 4) / Math.pow(Rr, 5)]; });
  const spin = scl(P.sAx, P.ws * ss);
  let Om = [0, 0, 0];
  for (const [Ri, wt] of radii) {
    let mW = [0, 0, 0];
    for (let j = 0; j < nPhase; j++) {
      const ph = 2 * Math.PI * (j + 0.5) / nPhase, rh = add(scl(x, Math.cos(ph)), scl(y, Math.sin(ph))), vh = crs(P.nHat, rh);
      const f = G3.makeField3({ sources: [{ m: P.Ms, R: Rs, p: scl(rh, -P.a), v: [0, 0, 0], spin }], recv: { m: P.m, R: Ri, p: [0, 0, 0], v: scl(vh, P.vOrb * vs) },
        W0: 0, extraW, kernel: { kind: 'ball', al: 1 }, rot: rf, self: true });
      mW = add(mW, scl(G3.rot3('W', f, [0, 0, 0], { Rb: Ri }), 1 / nPhase));
    }
    Om = read === 'W' ? mW : add(Om, scl(mW, wt));
  }
  return { Om, a: P.a, nOrb: P.vOrb / P.a, wS: P.Ms * D.Kball(1, P.a, Rs), A0: P.m * D.Kball(1, 0, Rr), ws: P.ws * ss, sAx: P.sAx, sHat: P.sHat, nHat: P.nHat };
}

/* ───────── 衛星の入力 ───────── */
const bs = (id, k) => (TL.BODY_SRC[id] && TL.BODY_SRC[id][k] ? TL.BODY_SRC[id][k][0] : null);
/**
 * 衛星の組の入力: 第351便c の pairInput + 宣言の自転の率 ω_spin(第347便e の t1Table の omega —— カロンは第337便c の公転の周期 2π ÷ P)・
 * 宣言の平均運動 n_decl(第337便c の BODY_SRC の公転の周期 —— 冥王星はカロンの公転)・場の平均運動 n_field(= v_orb ÷ a —— 源の質量だけ)・2 体の和の平均運動 n_pair・慣性モーメント I(第337便c の bodyRow)。
 */
export function satInput(T1, GEO, id, src) {
  const P = L.pairInput(T1, GEO, id, src), r2 = T1.find((r) => r.id === id && r.src === src && r.mag === 'm2');
  const pOrb = bs(id, 'porb') || bs('Charon', 'porb'), nDecl = 2 * Math.PI / pOrb;
  const wSpin = r2 ? Math.abs(r2.omega) : nDecl, nField = P.vOrb / P.a, pairScale = Math.sqrt((P.Ms + P.m) / P.Ms), nPair = nField * pairScale;
  const B = TL.bodyRow(TL.BODY_ROWS.find((r) => r.id === id));
  const c = Math.max(-1, Math.min(1, dot(P.sHat, P.nHat))), sinE = Math.sqrt(Math.max(0, 1 - c * c));
  return { ...P, wSpin, spinFrom: r2 ? '第347便e の t1Table' : '第337便c の公転の周期(同期の宣言)', pOrb, nDecl, nField, nPair, pairScale, I: B.I, epsDeg: sinE < DECL.sinEps ? 0 : angDeg(P.sHat, P.nHat) };
}

/* ───────── 由来の列 ───────── */
/**
 * 組 (id, src) の由来の成分と合計。A = 背景 + 太陽由来 (MS) + 母天体由来 (MS)(分母 out —— 第351便c の pairParts)/B = 背景 + 太陽由来 (MS)(母天体を置かない —— 分母に母天体の重みを入れない)。
 * 2 体の和の比べる列: 母天体由来の (M) に相対の速度の倍率 √((M_源 + m) ÷ M_源) を掛けたもの(pairM)。
 */
export function satTerms(T1, GEO, id, src, { read = DECL.read, k = 1 } = {}) {
  const pp = L.pairParts(T1, GEO, id, src, { read, den: DECL.den, k }), bg = L.bgOm(id, { mult: DECL.bgMult, sign: DECL.bgSign });
  const [sid, ssrc] = L.PARENT_ROWS[id + '|' + src].split('|');
  const sunB = Object.fromEntries(L.DECL.parts.map((p) => [p, L.partRot(T1, GEO, sid, ssrc, { part: p, read, extraW: 0, k }).Om]));
  const S = satInput(T1, GEO, id, src);
  const pairM = partRotF(T1, GEO, id, src, { part: 'M', read, extraW: pp.wSun, velScale: S.pairScale }).Om;
  return { sun: pp.sun, parent: pp.parent, sunB, bg, pairM: k === 1 ? pairM : scl(pairM, k), A: add(add(bg, pp.sun.MS), pp.parent.MS), B: add(bg, sunB.MS), wSun: pp.wSun, wPar: pp.wPar };
}

/* ───────── 潮汐ロックの 3 列 ───────── */
/**
 * 1 つの Ω について 3 列の読み。S = satInput。(ア) ŝ = 道の法線・ω = n_decl/(イ) ŝ = 宣言の自転軸・ω_T = ω_spin・Ω∥ はずれとして記録(経度のずれの率は拘束で 0)/
 * (ウ) ŝ = 宣言の自転軸・ω_T = ω_spin + Ω∥((S1))・経度のずれの率 = (ω_spin − n_decl) + Ω∥。経路 ①・② は第351便d の r3Rate(係数 1 ずつ)。
 * 返す各列: { sUsed, epsDeg, ratio, path1(abs dŝ/dt —— 経路 ①), path2(abs dŝ/dt —— 経路 ②), precRate(経路 ② の Ω まわりの角の率 = abs(Ω)), raise(公転の北極を基準 —— 床より薄いと null),
 *   par(Ω∥), parOverN, lonRate, lonOverN, inPlaneOverN(abs(Ω − (Ω·n̂) n̂) ÷ n_decl —— 道の面の中の成分), perp(abs Ω⊥) }
 */
export function lockCols(S, Om) {
  const n = unit(S.nHat), sD = unit(S.sHat), nIn = nrm(sub(Om, scl(n, dot(Om, n)))), out = {};
  for (const col of DECL.lockCols) {
    const s = col === 'a' ? n : sD, par = dot(s, Om), wL = col === 'a' ? S.nDecl : S.wSpin, wT = col === 'u' ? wL + par : wL, ratio = wT / wL;
    const p1 = R3.r3Rate(s, Om, { kTilt: 1, kPrec: 0, ratio }), p2 = R3.r3Rate(s, Om, { kTilt: 0, kPrec: 1, ratio });
    const c = Math.max(-1, Math.min(1, dot(s, n))), thin = Math.sqrt(Math.max(0, 1 - c * c)) < DECL.sinEps;
    const raise = thin ? null : L.raiseRate(s, n, p1.tilt);
    const lon = col === 'a' ? par : col === 'i' ? 0 : (S.wSpin - S.nDecl) + par;
    out[col] = { epsDeg: thin ? 0 : angDeg(s, n), wT, wL, ratio, ratioM1: col === 'u' ? par / wL : 0, path1: nrm(p1.tilt), path2: nrm(p2.prec), precRate: ratio * nrm(Om), raise, par, parOverN: par / S.nDecl,
      lonRate: lon, lonOverN: lon / S.nDecl, inPlaneOverN: nIn / S.nDecl, perp: nrm(L.perpOf(s, Om)) };
  }
  return out;
}

/* ───────── 潮汐のトルクと軸引きずりの直交成分のトルク ───────── */
/** 第337便c の物差し N_tide = Σ G M_p² R⁵ ÷ a⁶(係数 1)・第327便f の型の係数 (3/2) G M_p ÷ a³(× (B − A) で永久の四重極の復元のトルクの振幅) */
export function tideOf(id) {
  const B = TL.bodyRow(TL.BODY_ROWS.find((r) => r.id === id)), t = B.tide[0], Mp = bs(t.p, 'M');
  return { id, partner: t.p, a: t.a, Ntide: B.Ntide, NtideK: DECL.tideFactor * DECL.k2q * B.Ntide, Kcoef: 1.5 * G * Mp / Math.pow(t.a, 3), I: B.I, C: B.C, M: B.M, R: B.R };
}
/** 軸引きずりの直交成分のトルク I ω_T abs(Ω⊥)(ŝ は宣言の自転軸 —— (イ) の読み) と、比 N_tide ÷ N_ax・比が 1 になる (B − A) ÷ C */
export function torqueRatio(T, S, Om) {
  const perp = nrm(L.perpOf(S.sHat, Om)), scale = nrm(Om), p = perp <= 1e-12 * scale ? 0 : perp, Nax = T.I * S.wSpin * p;
  return { perp: p, Nax, rTide: Nax > 0 ? T.Ntide / Nax : null, rTideK: Nax > 0 ? T.NtideK / Nax : null, baNeed: Nax > 0 ? Nax / (T.Kcoef * T.I) : null };
}

/* ───────── 互いにロックした連星 ───────── */
/**
 * 冥王星–カロンの相手由来の (M)(S)(MS) を源の回転の形と相対の速さと源の自転の置き方で。spin: 'decl'(宣言の自転の率)/'sync'(源の自転を場の平均運動 v ÷ a に置く —— 受け手の位置の
 * 源の枠の速度 ω_s a が相対の公転の速さと同じになる条件)/'frame'(源に固定して回る座標系 —— 相対の速度 0・源の自転 0)。返す: 成分・平行と直交(ŝ は受け手の宣言の自転軸)・受け手の中心の速度の残り abs(1 − ω_s a ÷ v)・(W) の閉じた形 (w ÷ W) ω_s。
 */
export function mutualRow(T1, GEO, id, src, { rot, speed, spin, read = DECL.read } = {}) {
  const S = satInput(T1, GEO, id, src), pp = L.pairParts(T1, GEO, id, src, { read: 'W', den: DECL.den }), extraW = pp.wSun;
  if (!['decl', 'sync', 'frame'].includes(spin)) throw new RangeError('mutualRow: 源の自転は decl・sync・frame');
  if (spin === 'frame') {   // 片方の天体(源)に固定して回る座標系の読み: 相対の速度 0・源の自転 0(遠方宇宙の回転は在位の形の場に入らない —— 背景 W₀ 0)
    const z = partRotF(T1, GEO, id, src, { part: 'MS', read, extraW, rot, velScale: 0, spinScale: 0 }).Om;
    return { id, src, rot, speed, spin, read, ws: 0, v: 0, resid: 0, M: z, S: z, MS: z, par: { M: 0, S: 0, MS: 0 }, perp: { M: 0, S: 0, MS: 0 }, rigidW: 0, wOverW: null };
  }
  const vS = speed === 'pair' ? S.pairScale : 1, v = S.vOrb * vS, wsTarget = spin === 'sync' ? v / S.a : S.ws, sS = wsTarget / S.ws;
  const one = (part) => partRotF(T1, GEO, id, src, { part, read, extraW, rot, velScale: part === 'S' ? 0 : vS, spinScale: part === 'M' ? 0 : sS }).Om;
  const M = one('M'), Sx = one('S'), MS = one('MS'), s = unit(S.sHat);
  const base = partRotF(T1, GEO, id, src, { part: 'M', read: 'W', extraW }), wOverW = base.wS / (base.A0 + extraW + base.wS);
  const resid = Math.abs(1 - wsTarget * S.a / v);
  return { id, src, rot, speed, spin, read, ws: wsTarget, v, resid, M, S: Sx, MS, par: { M: dot(s, M), S: dot(s, Sx), MS: dot(s, MS) }, perp: { M: nrm(L.perpOf(s, M)), S: nrm(L.perpOf(s, Sx)), MS: nrm(L.perpOf(s, MS)) },
    rigidW: wOverW * wsTarget, wOverW };
}

/* ───────── 零試験 ───────── */
export function pureScenes(T1 = E.t1Table(), GEO = E.geometry()) {
  // ① partRotF の 'M' は第351便c の partRot と同じ(衛星の 5 組 × 成分 3 × 読み 2)
  let vsC = 0;
  for (const [id, src] of DECL.sats) for (const part of L.DECL.parts) for (const read of L.DECL.reads) vsC = Math.max(vsC, rel(partRotF(T1, GEO, id, src, { part, read }).Om, L.partRot(T1, GEO, id, src, { part, read }).Om) || 0);
  // ② 'q0' の (MS)((W))は第348便h の srcRot3(K1rQ0)の W と同じ(冥王星–カロン・イオ —— 源の半径の置き方の差は核の外では効かない)
  const cq = G3.DECL.combos.find((c) => c.id === 'K1rQ0');
  const q0 = Math.max(...[['Pluto', 'Charon'], ['Io', 'Jupiter']].map(([id, src]) => rel(partRotF(T1, GEO, id, src, { part: 'MS', read: 'W', rot: 'q0' }).Om, G3.srcRot3(T1, GEO, id, src, cq, {}).W)));
  // ③ 列 A = 背景 + 太陽 + 母天体・列 B の太陽由来は分母に母天体を入れない(イオで A と B の太陽由来が違い、B の太陽由来は母天体の無い組の数と同じ)
  const tIo = satTerms(T1, GEO, 'Io', 'Jupiter'), sumA = rel(tIo.A, add(add(tIo.bg, tIo.sun.MS), tIo.parent.MS)), bSun = rel(tIo.sunB.MS, L.partRot(T1, GEO, 'Io', 'Sun', { part: 'MS', extraW: 0 }).Om);
  // ④ 第350便e の母天体由来 ÷ 太陽由来(イオ・「(C1)」= 2 点の差分の読み・分母 in)は 4.32e3 の桁 —— termsOf を呼んで同じ数
  const To = BG.termsOf(T1, GEO, 'Io', 'Jupiter', 'in'), io350e = nrm(To.P.P2) / nrm(To.S.P2);
  // ⑤ 2 体の和の (M) は (M) の √((M_源 + m) ÷ M_源) 倍(相対の速度に線形)
  const sC = satInput(T1, GEO, 'Charon', 'Pluto'), lin = Math.abs(nrm(satTerms(T1, GEO, 'Charon', 'Pluto').pairM) / nrm(satTerms(T1, GEO, 'Charon', 'Pluto').parent.M) / sC.pairScale - 1);
  // ⑥ 2 体の和の平均運動は宣言の公転の周期に近い(冥王星–カロン)—— 源の質量だけの約束とは √(M_源 ÷ (M_源 + m)) 倍
  const sP = satInput(T1, GEO, 'Pluto', 'Charon'), pairVsDecl = [Math.abs(sP.nPair / sP.nDecl - 1), Math.abs(sC.nPair / sC.nDecl - 1)], fieldOverDecl = [sP.nField / sP.nDecl, sC.nField / sC.nDecl];
  // ⑦ 冥王星とカロンの質量の比(第348便c の massOf)と第343便g の重力定数の比(リポジトリの中の値 —— 比べる列)
  const qMass = C.massOf('Charon') / C.massOf('Pluto'), qGM = PG.gmRepoParts[1] / PG.gmRepoParts[0];
  // ⑧ 源の枠の剛体の回転・源の自転を場の平均運動に置くと、受け手の中心で相対の速度の項と源の自転の勾配の項が打ち消し、(W) は (w ÷ W) ω_s ŝ_源(閉じた形)
  const mq = mutualRow(T1, GEO, 'Charon', 'Pluto', { rot: 'q0', speed: 'src', spin: 'sync', read: 'W' }), mqP = mutualRow(T1, GEO, 'Pluto', 'Charon', { rot: 'q0', speed: 'src', spin: 'sync', read: 'W' });
  const rigid = Math.max(Math.abs(nrm(mq.MS) / mq.rigidW - 1), Math.abs(nrm(mqP.MS) / mqP.rigidW - 1)), resid0 = Math.max(mq.resid, mqP.resid);
  // ⑨ 球のモーメントの形では同じ置き方でも打ち消さない((MS) は (M) とほぼ同じ —— (S) は (M) の 1e-20 の桁)
  const mm = mutualRow(T1, GEO, 'Charon', 'Pluto', { rot: 'M', speed: 'src', spin: 'sync', read: 'W' }), noCancelM = nrm(mm.MS) / nrm(mm.M);
  // ⑩ 3 列: (ア) は ŝ = 道の法線 —— 同期の宣言の組(イオ)で (ア) と (イ) の Ω⊥ が同じ・(イ) は経度のずれの率 0・(ウ) は ω_T ÷ ω_L − 1 = Ω∥ ÷ ω_spin
  const sIo = satInput(T1, GEO, 'Io', 'Jupiter'), lcIo = lockCols(sIo, tIo.A), cols = { aEqI: Math.abs(lcIo.a.perp - lcIo.i.perp) <= 1e-12 * nrm(tIo.A), iLon: lcIo.i.lonRate === 0, uRatio: Math.abs(lcIo.u.ratioM1 - lcIo.u.par / sIo.wSpin) === 0, p12: Math.abs(lcIo.i.path1 - lcIo.i.path2) <= 1e-12 * lcIo.i.path1 };
  // ⑪ 経路 ① の dŝ/dt = Ω⊥ と経路 ② の dŝ/dt = Ω × ŝ の大きさは同じ(係数 1)—— 月(傾き 6.7°)で起こす率が書ける・同期の組は null
  const sM = satInput(T1, GEO, 'Moon', 'EarthHi'), lcM = lockCols(sM, satTerms(T1, GEO, 'Moon', 'EarthHi').A), moon = { raiseI: lcM.i.raise !== null, raiseA: lcM.a.raise === null, eps: sM.epsDeg };
  // ⑫ 潮汐のトルクの物差し: 第337便c の bodyRow の N_tide と、G M_p² R⁵ ÷ a⁶ を QA の側と同じ式で(月)
  const tM = tideOf('Moon'), ntide = Math.abs(tM.Ntide / (G * Math.pow(bs('Earth', 'M'), 2) * Math.pow(bs('Moon', 'R'), 5) / Math.pow(bs('Moon', 'a'), 6)) - 1);
  // ⑬ 第350便までの共通の点検の数(自転しない源の通過)
  const common = BG.commonChecks();
  // ⑭ 拒否
  const rej = [() => partRotF(T1, GEO, 'Io', 'Jupiter', { part: 'X' }), () => partRotF(T1, GEO, 'Io', 'Jupiter', { part: 'M', rot: 'q2' }), () => partRotF(T1, GEO, 'Io', 'Jupiter', { part: 'M', read: 'P2' }),
    () => partRotF(T1, GEO, 'Io', 'Jupiter', { part: 'M', extraW: -1 })].map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return { vsC, q0, sumA, bSun, io350e, lin, pairVsDecl, fieldOverDecl, qMass, qGM, rigid, resid0, noCancelM, cols, moon, ntide, common, rejects: rej };
}
export function pureGates(S) {
  const cw = BG.COMMON_WANT, c = S.common;
  return {
    sameAsC: S.vsC < 1e-12,
    q0AsSrcRot3: S.q0 < 1e-12,
    colSum: S.sumA < 1e-12 && S.bSun < 1e-12,
    io350e: S.io350e.toExponential(2) === '4.32e+3',
    pairLinear: S.lin < 1e-12,
    pairMean: S.pairVsDecl.every((v) => v < 1e-3) && S.fieldOverDecl[0] < 0.5 && S.fieldOverDecl[1] < 1,
    massRatio: Math.abs(S.qMass / S.qGM - 1) < 0.01,
    rigidSync: S.rigid < 1e-9 && S.resid0 < 1e-12,
    noCancelM: Math.abs(S.noCancelM - 1) < 1e-12,
    lockCols: Object.values(S.cols).every(Boolean),
    moonRaise: S.moon.raiseI && S.moon.raiseA && S.moon.eps > 6 && S.moon.eps < 7,
    tideRuler: S.ntide < 1e-12,
    common350: Math.abs(c.diaXz - cw.diaXz) < cw.tol && Math.abs(c.sixZ - cw.sixZ) < cw.tol && Math.abs(c.rotWz - cw.rotWz) < cw.tol,
    rejects: S.rejects.length === 4 && S.rejects.every(Boolean),
  };
}

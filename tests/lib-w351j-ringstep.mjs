// 第351便j(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)AN1000・AN1008・統括の検証項目 R436):
//   **円盤引きずりの側 —— 粒子の輪の法線を (R3) の 2 経路の步に載せる(輪の法線 L̂ を自転軸 ŝ の役・輪の公転の角運動量を「自転」の役に)・輪の 3 つの結果(輪が傾く・傾きが減る・厚みを保つ)と
//   2 経路の当たり方・受け手の速度で向きが入れ替わる行を源の成分 (M)(S) で見る例・🛟 saturnRotVertExplore3d の傾きの減りの率を経路 ① の「寄る速さ」に換算した値・土星の環の物差し —— 診断だけ**
//   (器 tests/exp-w351j-ringstep.mjs と QA behavior.ringstep351j・docs.ringstep351j が読む —— html を読まない・ファイルを読まない・状態を持たない)。
//   アプリの引きずり・自転・ジャイロの步・内蔵の本・受理器・physics の鍵・🛟 の本と鍵 physics.rotDragVert は変えない(AN712 —— エンジンへ足す操作ではない)。
//   既存の lib は呼ぶだけ(本文と版は変えない): 第350便g(omegaField・ruleWii・rotvertSummary —— 在位の形の場)・第351便d(r3Rate・r3Step・r3Coeffs・raiseRate・rodrigues —— (R3) の 2 経路)・
//   第351便c(closedM・closedSEq —— 源の成分の閉じた形)・第348便d(saturnUnits・pullSummary・DECL)・第348便i(vOrbit・DECL)・第338便d(centerKm)・第350便e(commonChecks・COMMON_WANT)・第312便a(Kball)。
//
// ■ 場(共通): 〔第350便g〕の omegaField = makeField3 の既定の引数(在位の形 —— K1 の核・源の回転は球のモーメント・背景 0・自分の重みを分母に・受け手の速度を引く)。源は原点に静止・質量 1・半径 1・自転 s ẑ。
//   受け手は輪の粒子(N 点・半径 r₀・法線 L̂ —— 粒子の速度は円の公転 r₀^(−½) (L̂ × r̂))。輪の回転 Ω_ring = 粒子の位置の Ω の平均(粒子ごとに受け手の速度 = その粒子の速度)。
// ■ 源の成分(〔第351便c〕の語): (M) 相対の公転の分 = 源の自転 0・受け手の速度だけ/(S) 源の自転の分 = 受け手の速度 0・源の自転だけ/(MS) 両方。(S) は直接に数える(差で作らない)。
// ■ 回転の読み: 輪には (C1)(2 点の差分 —— 〔第350便g〕で通過の輪の傾きに対する比 1.000〜1.006)、剛体の球には (C2)(球全体の剛体回転への平均 —— 一次の値として中心の ½∇×u)。両方を列に置く。
// ■ (R3) の 2 経路(〔第351便d〕の語のまま): 経路 ① dL̂/dt = k₁ Ω⊥(L̂ が符号つきの Ω の向きへ寄る)・経路 ② dL̂/dt = k₂ (Ω × L̂)(L̂ が Ω のまわりを歳差)。比率のノブ f と置き方 (N1)。
//   経路 ② の k₂ 1 は「輪を Ω で剛体として回す」と同じ式(dL̂/dt = Ω × L̂)。
// ■ 基準を 2 つ分けて書く(混ぜない): 回転軸の線に対する傾き θ_line(〔第351便d〕の dθ_line/dt —— 寄る/離れる)と、源の赤道面に対する輪の傾き ε = acos(L̂·ẑ_ref)(起こす率 −dε/dt —— ẑ_ref は
//   順行の輪で +ẑ・逆行の輪で −ẑ —— 「輪の傾きが減る/増える」)。
// ■ 言わないこと: 円盤引きずりの型・環の厚みの答えとは書かない。🛟 の較正とは書かない(🛟 は探索用・未較正 —— 強さは見える倍率のまま)。この場・この成分・この読み・このノブでは、の表。
import * as G from './lib-w350g-diskcheck.mjs';
import * as R3 from './lib-w351d-r3step.mjs';
import * as SP from './lib-w351c-srcparts.mjs';
import * as D from './lib-w348d-diskaxis.mjs';
import * as I3 from './lib-w348i-diskgeo3.mjs';
import * as RB from './lib-w338d-ringbook.mjs';
import * as BG from './lib-w350e-bgaxial.mjs';
import * as DK from './lib-w312a-decay.mjs';

export const LIB_VERSION = 'w351j-ringstep-lib-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const D2R = Math.PI / 180;
const { dot, crs, nrm, scl, add, sub, unit } = R3.vec;
const isVec = (a) => Array.isArray(a) && a.length === 3 && a.every(fin);
const rel = (a, b) => nrm(sub(a, b)) / Math.max(nrm(b), 1e-300);
const angDeg = R3.angDeg;

/* ───────── 宣言(走らせたノブの格子と判定の物差しの記録 —— 式の形の宣言ではない)───────── */
export const DECL = Object.freeze({
  reads: Object.freeze(['C1', 'C2']), parts: Object.freeze(['M', 'S', 'MS']), senses: Object.freeze(['pro', 'retro']),
  /** 輪(〔第350便g〕の粒子の輪と同じ: 源の自転 0.4・半径 3・傾き 10°・粒子 24 —— 受け手は粒子ごとに在位の形 m 1・R 1 = 中心の値 1.5) */
  ring: Object.freeze({ s: 0.4, r0: 3, i0: 10, N: 24, Wii: 1.5, Rself: 1 }),
  /** 步: 3 公転(〔第350便g〕の粒子の輪と同じ長さ)・30 步(刻み半分の列で次数を見る)・比率のノブは (N1) の f 0・0.5・1(既定は決めない) */
  step: Object.freeze({ orbits: 3, steps: 120, fShow: Object.freeze([0, 0.5, 1]), norm: 'N1' }),
  /** 土星の環(〔第350便g〕の表 6 と同じ場 —— 源の半径 1・自分の重みは規則の半径・受け手の半径 R_b)・輪の傾き 1°(小さい傾きの率) */
  sat: Object.freeze({ centers: D.DECL.C.centers, tiltDeg: 1, N: 24 }),
  /** 向きが入れ替わる行(〔第350便g〕の表 8 の 60 行 —— (Rk1) の (W₀, W_ii) 4 組〔受け手の半径 R_self〕+ 在位の形〔中心の値 1.5・半径 1〕・源の自転 1)と、閉じた形と照らす距離 */
  swap: Object.freeze({ s: 1, Wii: 1.5, Rself: 1, den: I3.DECL.k1.den, RselfK1: I3.DECL.k1.Rself, ds: D.DECL.A.d, actions: D.DECL.A.actions, cands: Object.freeze(['P2', 'W']), zs: D.DECL.A.z, example: Object.freeze({ cand: 'W', d: 3, action: 'corS' }) }),
  floor: 1e-12,
  judge: '丸めの桁の床: 打ち消しで 0 になる量は尺度の 1e-12 倍以下を 0 と書く',
});
/** 固定の比べる列(リポジトリの中の数 —— 〔第350便g〕の LIT をそのまま読む・合わせない・主の物差しにしない) */
export const LIT = G.LIT;

/* ───────── 輪の幾何 ───────── */
/** 輪の面の基底: e1 = 交点の線(ẑ × L̂ の向き —— L̂ ∥ ẑ なら x)・e2 = L̂ × e1 */
export function ringBasis(L) {
  const l = unit(L), c = crs([0, 0, 1], l), e1 = nrm(c) > 1e-12 ? unit(c) : [1, 0, 0];
  return [e1, crs(l, e1)];
}
/** 法線 L̂ の傾き ε(基準 ref との角)と交点の経度 φ(L̂ の xy 成分の向き) */
export const epsDeg = (L, ref = [0, 0, 1]) => angDeg(L, ref);
export const nodeDeg = (L) => Math.atan2(L[1], L[0]) / D2R;
/** 傾き i(度)・交点の経度 φ(度)の法線(順行は +ẑ のまわり・逆行は −ẑ のまわり —— 角運動量の向き) */
export function normalAt(iDeg, phDeg = -90, sense = 'pro') {
  const i = iDeg * D2R, p = phDeg * D2R, L = [Math.sin(i) * Math.cos(p), Math.sin(i) * Math.sin(p), Math.cos(i)];
  return sense === 'retro' ? scl(L, -1) : L;
}

/* ───────── 輪の回転 ───────── */
/**
 * 輪の回転 Ω_ring(粒子 N 点の位置の Ω の平均)。o: { read: C1|C2, part: M|S|MS, s, r0, N, Wii, Rself, k = 1, mut }
 * 粒子 k: 位置 r₀ (cos φ_k e1 + sin φ_k e2)・速度 r₀^(−½) (L̂ × r̂)(L̂ の向きが公転の向き —— 逆行の輪は L̂ を下へ)。
 * mut(変異): 'velFlip'(粒子の速度を L̂ と逆に —— (M) の向きが L̂ と逆になる)
 */
export function ringOmega(L, { read = 'C1', part = 'MS', s = DECL.ring.s, r0 = DECL.ring.r0, N = DECL.ring.N, Wii = DECL.ring.Wii, Rself = DECL.ring.Rself, k = 1, mut = null } = {}) {
  if (!(isVec(L) && nrm(L) > 0)) throw new RangeError('ringOmega: L̂');
  if (!DECL.reads.includes(read)) throw new RangeError('ringOmega: 読みは ' + DECL.reads.join('・'));
  if (!DECL.parts.includes(part)) throw new RangeError('ringOmega: 成分は ' + DECL.parts.join('・'));
  if (!(fin(r0) && r0 > 0 && Number.isInteger(N) && N >= 3 && fin(s) && fin(k))) throw new RangeError('ringOmega: r₀ > 0・N ≥ 3・s・k');
  const l = unit(L), [e1, e2] = ringBasis(l), vc = Math.pow(r0, -0.5), sp = part === 'M' ? 0 : s;
  let Om = [0, 0, 0];
  for (let j = 0; j < N; j++) {
    const ph = 2 * Math.PI * (j + 0.5) / N, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), x = scl(rh, r0);
    const v = part === 'S' ? [0, 0, 0] : scl(crs(l, rh), vc * (mut === 'velFlip' ? -1 : 1));
    Om = add(Om, scl(G.omegaField(read, { s: sp, Wii, Rself, vRec: v })(x), 1 / N));
  }
  return k === 1 ? Om : scl(Om, k);
}

/* ───────── 1 点の率(2 つの基準)───────── */
/** L̂ と Ω から 2 経路の率と 2 つの基準の量。ref = 源の赤道面の法線の向き(順行 +ẑ・逆行 −ẑ) */
export function ringRate(L, Om, { kTilt = 1, kPrec = 0, ref = null } = {}) {
  const l = unit(L), rf = ref || (l[2] >= 0 ? [0, 0, 1] : [0, 0, -1]), q = R3.r3Rate(l, Om, { kTilt, kPrec });
  const om = nrm(Om), pm = nrm(q.perp), small = pm <= DECL.floor * Math.max(om, 1e-300);
  const raise = R3.raiseRate(l, rf, q.ds), sinE = Math.sqrt(Math.max(0, 1 - dot(l, rf) ** 2));
  const rho2 = l[0] * l[0] + l[1] * l[1], nodeRate = rho2 > 0 ? (l[0] * q.ds[1] - l[1] * q.ds[0]) / rho2 : null;
  return { cos: q.cos, om, perp: small ? 0 : pm, perpOverOm: om > 0 ? (small ? 0 : pm / om) : null, dLine: small ? 0 : q.dThetaLineDt, raise: small ? 0 : raise,
    raiseOverEps: small || !(sinE > 0) ? 0 : raise / Math.asin(Math.min(1, sinE)), nodeRate: small ? 0 : nodeRate, rigid: nrm(crs(Om, l)), sigma: q.sigma };
}

/* ───────── 輪の法線の步(Ω を毎步 L̂ から作り直す)───────── */
/**
 * o: { L0, read, part, kTilt, kPrec, T, steps, frozen = false, ring = DECL.ring, mut }
 * 步は〔第351便d〕の r3Step の「回転」の形と同じ(Θ = r3Rate(L̂, Ω).Th・L̂ ← rodrigues(L̂, Θ, abs(Θ) dt))。frozen は Ω を最初の値に止める(r3Step と同じ道になることを零試験で見る)。
 * mut 'noUnit'(回転でなく足し算 —— 長さが崩れる)
 */
export function ringStep({ L0 = normalAt(DECL.ring.i0), read = 'C1', part = 'S', kTilt = 1, kPrec = 0, T = null, steps = DECL.step.steps, frozen = false, ring = DECL.ring, mut = null } = {}) {
  if (!(isVec(L0) && nrm(L0) > 0 && Number.isInteger(steps) && steps > 0 && fin(kTilt) && fin(kPrec))) throw new RangeError('ringStep: L0・steps・kTilt・kPrec');
  const TT = T === null ? DECL.step.orbits * 2 * Math.PI * Math.pow(ring.r0, 1.5) : T;
  if (!(fin(TT) && TT > 0)) throw new RangeError('ringStep: T > 0');
  const dt = TT / steps, ref = L0[2] >= 0 ? [0, 0, 1] : [0, 0, -1], opt = { read, part, ...ring };
  let L = unit(L0), lenErr = 0, turns = 0, az = nodeDeg(L) * D2R;
  const Om0 = ringOmega(L, opt);
  for (let n = 0; n < steps; n++) {
    const Om = frozen ? Om0 : ringOmega(L, opt), Th = R3.r3Rate(L, Om, { kTilt, kPrec }).Th;
    L = mut === 'noUnit' ? add(L, scl(crs(Th, L), dt)) : R3.rodrigues(L, Th, nrm(Th) * dt);
    lenErr = Math.max(lenErr, Math.abs(nrm(L) - 1));
    const a = nodeDeg(L) * D2R; let da = a - az; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; turns += da; az = a;
  }
  const e0 = epsDeg(L0, ref), e1 = epsDeg(L, ref);
  return { read, part, kTilt, kPrec, T: TT, steps, frozen, Om0, Lend: L, epsDeg0: e0, epsDegEnd: e1, dEpsDeg: e1 - e0, dNodeDeg: turns / D2R, lenErr };
}

/* ───────── 表 1: 輪の 3 つの結果と 2 経路 ───────── */
/** 輪(DECL.ring)の 1 点の率: 読み 2 × 成分 3 × 順逆 2 */
export function ringRates() {
  const R = DECL.ring, rows = [];
  for (const read of DECL.reads) for (const part of DECL.parts) for (const sense of DECL.senses) {
    const L = normalAt(R.i0, -90, sense), Om = ringOmega(L, { read, part }), q = ringRate(L, Om, { kTilt: 1, kPrec: 0 }), p = ringRate(L, Om, { kTilt: 0, kPrec: 1 });
    const dTilt3 = -q.raise * DECL.step.orbits * 2 * Math.PI * Math.pow(R.r0, 1.5) / D2R;
    rows.push({ read, part, sense, Om, om: q.om, cos: q.cos, perp: q.perp, perpOverOm: q.perpOverOm, dLine: q.dLine, raise: q.raise, nodeRate: p.nodeRate, rigid: q.rigid, dTilt3Deg: dTilt3 });
  }
  return rows;
}
/** 輪の步: 読み 2 × 成分 (S)(MS) × f 3 × 順逆 2(Ω を毎步作り直す)+ 刻み半分の列((C1)・(S)・順行・f 1) */
export function ringRuns() {
  const R = DECL.ring, rows = [];
  for (const read of DECL.reads) for (const part of ['S', 'MS']) for (const f of DECL.step.fShow) for (const sense of DECL.senses) {
    const c = R3.r3Coeffs(f, DECL.step.norm), r = ringStep({ L0: normalAt(R.i0, -90, sense), read, part, kTilt: c.kTilt, kPrec: c.kPrec });
    rows.push({ read, part, f, sense, kTilt: c.kTilt, kPrec: c.kPrec, dEpsDeg: r.dEpsDeg, dNodeDeg: r.dNodeDeg, lenErr: r.lenErr });
  }
  const c1 = R3.r3Coeffs(1, DECL.step.norm), a = ringStep({ read: 'C1', part: 'S', ...c1 }), b = ringStep({ read: 'C1', part: 'S', ...c1, steps: 2 * DECL.step.steps });
  return { rows, half: { dEps: a.dEpsDeg, dEpsHalf: b.dEpsDeg, rel: Math.abs(a.dEpsDeg / b.dEpsDeg - 1) } };
}

/* ───────── 表 3(T2 の例): 受け手の速度で向きが入れ替わる行を源の成分で見る ───────── */
/** 〔第350便g〕の表 8 の 60 行(在位の形 12 行 + (Rk1) 48 行): (S) の寄せる力 p_S(受け手の速度 0)・(M) の寄せる力 p_M(源の自転 0・受け手の速度 1)・(MS) p_MS。線形 p_S + p_M = p_MS を照らす */
export function swapParts() {
  const W = DECL.swap, rows = [], cfgs = W.den.map(([Wb, Ws]) => ({ col: 'k1', W0: Wb, Wii: Ws, Rself: W.RselfK1 })).concat([{ col: 'inPos', W0: 0, Wii: W.Wii, Rself: W.Rself }]);
  for (const cf of cfgs) for (const cand of W.cands) for (const d of W.ds) {
    const read = cand === 'P2' ? 'C1' : 'C2', vo = I3.vOrbit(d), mk = (s, v) => G.omegaField(read, { s, Wii: cf.Wii, Rself: cf.Rself, W0: cf.W0, vRec: v });
    const fS = mk(W.s, [0, 0, 0]), fM = mk(0, vo), fMS = mk(W.s, vo);
    for (const action of W.actions) {
      const P = [fS, fM, fMS].map((f) => D.pullSummary(f, { action, d, zs: W.zs })), all = (p) => p.pulls.concat(p.pullsNeg), pS = all(P[0]), pM = all(P[1]), pMS = all(P[2]);
      let lin = 0, sc = 0, nOpp = 0, nOver = 0, nFlip = 0;
      for (let j = 0; j < pS.length; j++) {
        lin = Math.max(lin, Math.abs(pS[j] + pM[j] - pMS[j])); sc = Math.max(sc, Math.abs(pS[j]), Math.abs(pM[j]), Math.abs(pMS[j]));
        if (Math.sign(pS[j]) !== Math.sign(pM[j])) { nOpp++; if (Math.abs(pM[j]) > Math.abs(pS[j])) nOver++; }
        if (Math.sign(pS[j]) !== Math.sign(pMS[j])) nFlip++;
      }
      rows.push({ col: cf.col, W0: cf.W0, Wii: cf.Wii, cand, d, action, dirS: P[0].dir, dirM: P[1].dir, dirMS: P[2].dir, swap: P[0].dir !== P[2].dir, nHeights: pS.length, nOpp, nOver, nFlip, linRel: sc > 0 ? lin / sc : 0,
        refS: P[0].pullRef, refM: P[1].pullRef, refMS: P[2].pullRef });
    }
  }
  return rows;
}
/** 赤道面の点(z 0)の (C2) の回転を〔第351便c〕の閉じた形と照らす: (M) = ½ A W_j n ÷ (A + W_j)²(+ẑ)・(S) = [f + r f′/2] s(源の自転の向き —— 負なら逆向き) */
export function closedCheck() {
  const W = DECL.swap;
  return W.ds.map((d) => {
    const x = [d, 0, 0], M = G.omegaField('C2', { s: 0, Wii: W.Wii, Rself: W.Rself, vRec: I3.vOrbit(d) })(x), S = G.omegaField('C2', { s: W.s, Wii: W.Wii, Rself: W.Rself })(x);
    const cM = SP.closedM({ A: W.Wii, wS: DK.Kball(1, d, 1), nOrb: Math.pow(d, -1.5) }), cS = SP.closedSEq({ A: W.Wii, mj: 1, Rj: 1, r: d }) * W.s;
    return { d, Mz: M[2], closedM: cM, relM: Math.abs(M[2] / cM - 1), Sz: S[2], closedS: cS, relS: Math.abs(S[2] / cS - 1), perpMS: Math.hypot(M[0], M[1], S[0], S[1]) };
  });
}

/* ───────── 表 4(T4): 土星の環の物差し ───────── */
/** 区分の中心 5 × 読み 2 × 順逆 2: (S)・(M)・(MS) の向き(輪の法線との cos)・大きさ・直交の成分・起こす率(1/s)・ε に対する率・(S) ÷ (M)・公転 ÷ 自転(同期軌道の内と外) */
export function saturnRows() {
  const U = D.saturnUnits(), S = DECL.sat, Wr = G.ruleWii(U), rSync = Math.pow(U.sDim, -2 / 3), rows = [];
  for (const key of S.centers) {
    const r = RB.centerKm(key) * 1e3 / U.R, nOverW = Math.pow(r, -1.5) / U.sDim;
    for (const read of DECL.reads) for (const sense of DECL.senses) {
      const L = normalAt(S.tiltDeg, -90, sense), o = { read, s: U.sDim, r0: r, N: S.N, Wii: Wr, Rself: D.DECL.Rb }, out = { key, r, read, sense, inside: r < rSync, nOverW };
      for (const part of DECL.parts) {
        const Om = ringOmega(L, { ...o, part }), q = ringRate(L, Om, { kTilt: 1, kPrec: 0 });
        out[part] = { cos: q.cos, magPerS: q.om / U.tU, perpPerS: q.perp / U.tU, raisePerS: q.raise / U.tU, raiseOverEpsPerS: q.raiseOverEps / U.tU, dLine: q.dLine };
      }
      out.SoverM = out.S.magPerS / out.M.magPerS;
      rows.push(out);
    }
  }
  return { units: U, Wrule: Wr, rSync, rows };
}

/* ───────── 表 2(T3): 🛟 の傾きの減りの率を経路 ① の寄る速さに換算 ───────── */
/**
 * S = 〔第350便g〕の rotvertSummary(🛟 の正本の要点 —— 器が読んで渡す)・sat = saturnRows()。
 * 🛟 の率 = −ln g ÷ t(g = 目安の比・t = 時刻 × 本の時間の単位 —— 1/s。見える倍率のまま)と、それを強さの倍で割った値(目安の強さ)。
 * 経路 ① の閉じた形 tan(θ/2) = tan(θ₀/2) e^(−k₁ abs(Ω) t) は小さい傾きで θ ∝ e^(−k₁ abs(Ω) t) → 「寄る速さ k₁ abs(Ω)」= 🛟 の率。k₁ の等価 = 🛟 の率 ÷ abs(Ω)(読み (C1)(C2)・成分 (MS))。
 * 源の赤道面に対する率(起こす率 ÷ ε —— 符号つき・順行の輪・傾き 1°)での等価も並べる(負 = 🛟 と逆の向き)。
 */
export function rotvertRows(S, sat) {
  const book = S.rows.map((r) => { const rate = -Math.log(r.guide) / (r.t * S.unitsT); return { steps: r.steps, t: r.t, guide: r.guide, rateBook: rate, rateNeed: rate / S.lambdaScale }; });
  const main = book[book.length - 1], rows = [];
  for (const key of DECL.sat.centers) {
    const o = { key };
    for (const read of DECL.reads) {
      const x = sat.rows.find((q) => q.key === key && q.read === read && q.sense === 'pro'), ms = x.MS, g = ms.raiseOverEpsPerS;
      o.r = x.r; o.inside = x.inside;
      o[read] = { magPerS: ms.magPerS, k1Book: main.rateBook / ms.magPerS, k1Need: main.rateNeed / ms.magPerS, gammaPerS: g, k1NeedEps: g !== 0 ? main.rateNeed / g : null, sameSign: g > 0 };
    }
    rows.push(o);
  }
  return { book, main: { steps: main.steps, rateBook: main.rateBook, rateNeed: main.rateNeed }, lambdaScale: S.lambdaScale, rdScale: S.rdScale, rows };
}

/* ───────── 零試験 ───────── */
export function pureScenes() {
  const S = {}, R = DECL.ring, Lp = normalAt(R.i0), Lr = normalAt(R.i0, -90, 'retro');
  // ① 第350便までの共通の点検の数(自転しない源の通過 —— 第350便e の commonChecks)
  S.common = BG.commonChecks();
  // ② 止めた Ω の步は〔第351便d〕の r3Step と同じ道(f 0・0.5・1)
  S.frozen = R3.DECL.fShow.map((f) => { const c = R3.r3Coeffs(f, 'N1'), a = ringStep({ read: 'C1', part: 'S', ...c, frozen: true, steps: 20 }), b = R3.r3Step({ s0: Lp, om: a.Om0, T: a.T, dt: a.T / 20, kTilt: c.kTilt, kPrec: c.kPrec, integ: 'rot' });
    return angDeg(a.Lend, b.sEnd); });
  // ③ f 0 は傾きを保ち交点だけ動く(瞬時の dε/dt 0 —— 有限の刻みの残りは刻みの一次で 0 へ: 刻み 1/4 で 1/4)・f 1 は交点を保ち傾きだけ動く(Ω を毎步作り直す —— Ω は ẑ と L̂ の面の中)
  { const a = ringStep({ read: 'C1', part: 'S', ...R3.r3Coeffs(0, 'N1'), steps: 10 }), b = ringStep({ read: 'C1', part: 'S', ...R3.r3Coeffs(1, 'N1'), steps: 10 });
    const Om = ringOmega(Lp, { read: 'C1', part: 'S' });
    const a4 = ringStep({ read: 'C1', part: 'S', ...R3.r3Coeffs(0, 'N1'), steps: 40 });
    S.f0 = { dEps: a.dEpsDeg, dNode: a.dNodeDeg, dEps40: a4.dEpsDeg }; S.f1 = { dEps: b.dEpsDeg, dNode: b.dNodeDeg }; S.inPlane = Math.abs(dot(Om, unit(crs([0, 0, 1], Lp)))) / nrm(Om); }
  // ④ 順行の輪と逆行の輪で「寄る/離れる」が入れ替わる((S) —— 順行は回転軸の線から離れる・逆行は寄る)
  S.sense = DECL.reads.map((read) => { const p = ringRate(Lp, ringOmega(Lp, { read, part: 'S' })), q = ringRate(Lr, ringOmega(Lr, { read, part: 'S' })); return { read, pro: p.dLine, retro: q.dLine, cosPro: p.cos, cosRetro: q.cos }; });
  // ⑤ (M) は輪の法線と平行(直交の成分 0 —— 傾きも歳差も作らない)・(MS) の直交の成分は (S) と同じ
  S.mPar = DECL.reads.map((read) => ringRate(Lp, ringOmega(Lp, { read, part: 'M' })).perpOverOm);
  S.msPerp = DECL.reads.map((read) => { const s = R3.r3Rate(Lp, ringOmega(Lp, { read, part: 'S' })).perp, m = R3.r3Rate(Lp, ringOmega(Lp, { read, part: 'MS' })).perp; return rel(m, s); });
  // ⑥ 経路 ② の k₂ 1(輪を Ω で剛体として回す)の大きさ = 経路 ① の k₁ 1 の大きさ = abs(Ω⊥)
  { const Om = ringOmega(Lp, { read: 'C1', part: 'S' }), q = R3.r3Rate(Lp, Om, { kTilt: 1, kPrec: 1 }); S.rigid = Math.abs(nrm(crs(Om, Lp)) - nrm(q.perp)) / nrm(q.perp); S.rigidOrth = Math.abs(dot(q.tilt, q.prec)) / nrm(q.perp) ** 2; }
  // ⑦ 傾き 0 の輪の平均は〔第350便g〕の点の値(赤道面)と同じ・(C2) の点は〔第351便c〕の閉じた形と同じ
  { const L0 = [0, 0, 1], m = DECL.reads.map((read) => rel(ringOmega(L0, { read, part: 'MS' }), G.omegaField(read, { s: R.s, Wii: R.Wii, Rself: R.Rself, vRec: I3.vOrbit(R.r0) })([R.r0, 0, 0])));
    const cc = closedCheck(); S.point = { vs350g: Math.max(...m), relM: Math.max(...cc.map((c) => c.relM)), relS: Math.max(...cc.map((c) => c.relS)), signs: cc.every((c) => c.Mz > 0 && c.Sz < 0) }; }
  // ⑧ 寄せる力は源の成分について線形(在位の形の例 1 行: (S) + (M) = (MS))
  { const W = DECL.swap, ex = W.example, read = ex.cand === 'P2' ? 'C1' : 'C2', vo = I3.vOrbit(ex.d), mk = (s, v) => G.omegaField(read, { s, Wii: W.Wii, Rself: W.Rself, vRec: v });
    const g = (f) => D.ringPull(f, { action: ex.action, d: ex.d, zOverR: 0.01 }).pull, a = g(mk(W.s, [0, 0, 0])), b = g(mk(0, vo)), c = g(mk(W.s, vo));
    S.linear = Math.abs(a + b - c) / Math.max(Math.abs(a), Math.abs(b), Math.abs(c)); }
  // ⑨ 変異: 足し算の步は長さが崩れる・粒子の速度を L̂ と逆にすると (M) の向きが輪の法線と逆
  S.mutUnit = ringStep({ read: 'C1', part: 'S', kTilt: 1, kPrec: 1, steps: 10, T: 3000, mut: 'noUnit' }).lenErr;
  S.mutVel = R3.r3Rate(Lp, ringOmega(Lp, { read: 'C1', part: 'M', mut: 'velFlip' })).cos;
  // ⑩ 入力の拒否
  S.rejects = [() => ringOmega([0, 0, 0]), () => ringOmega(Lp, { read: 'P6' }), () => ringOmega(Lp, { part: 'X' }), () => ringOmega(Lp, { N: 2 }), () => ringStep({ steps: 0 }), () => ringStep({ T: -1 })]
    .map((fn) => { try { fn(); return false; } catch (e) { return e instanceof RangeError; } });
  return S;
}
export function pureGates(S) {
  const c = S.common, w = BG.COMMON_WANT;
  return {
    common: Math.abs(c.diaXz - w.diaXz) < w.tol && Math.abs(c.sixZ - w.sixZ) < w.tol && Math.abs(c.rotWz - w.rotWz) < w.tol,
    frozenR3: S.frozen.length === 3 && S.frozen.every((x) => x < 1e-12),
    f0f1: Math.abs(S.f0.dEps) < 2e-3 * Math.abs(S.f0.dNode) && Math.abs(S.f0.dEps40 / S.f0.dEps - 0.25) < 0.02 && Math.abs(S.f0.dNode) > 1 && Math.abs(S.f1.dNode) < 1e-9 && Math.abs(S.f1.dEps) > 1e-3 && S.inPlane < 1e-12,
    proRetro: S.sense.every((r) => r.pro > 0 && r.retro < 0 && r.cosPro < 0 && r.cosRetro > 0),
    mParallel: S.mPar.every((x) => x === 0) && S.msPerp.every((x) => x < 1e-9),
    rigid: S.rigid < 1e-12 && S.rigidOrth < 1e-12,
    point: S.point.vs350g < 1e-9 && S.point.relM < 1e-12 && S.point.relS < 1e-12 && S.point.signs,
    linear: S.linear < 1e-8,
    mutants: S.mutUnit > 1e-8 && S.mutVel < -0.999,
    rejects: S.rejects.length === 6 && S.rejects.every(Boolean),
  };
}

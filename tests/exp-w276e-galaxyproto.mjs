// 第276便e: **渦巻・棒の node 多体試作の値表**(実測器・**エンジン未接続**)。
//
// 検証順(指示どおり (i)→(iv)。前の段が通らないまま次へ行かない):
//   (i)   直線腕の横方向安定 …… 子コア(面内軸・α=25/β=0.05)だけで、細長い集団が太らないか。
//                              **スピン 0 の対照**を必ず並べる(腕はスピンが要る、を数で見せる)。
//   (ii)  親コアの円盤メッシュと結合 …… 親コア(面外軸・α=1.1/β=25)で円盤を作り、
//                              **親+子の 2 軸を同時に**回した場合を別に測る(R44 の
//                              「単一軸で両役割を同時に満たさない」を実効剛性行列で確かめる)。
//   (iii) 渦巻パターン …… 円盤 + Φ_arm(位相 φ_c と共役運動量 J_c)。ピッチ角の時間列・
//                        コントラスト・**材料腕との比較**(巻き込み)。
//   (iv)  棒 …… 宣言した結合グラフの Hessian(第66報 (4) の字義の形 + 拡張 2 つ)と走行の帳簿。
//
// **完成門は測る前に宣言してある**(下の `GATE`)。落ちた門は**落ちたと書く**(緩めない)。
// 使い方: node tests/exp-w276e-galaxyproto.mjs  → tests/out/galaxyproto-w276e.json
// 書かないこと: 「腕が創発した」「棒が自発形成した」「渦巻銀河を再現した」「銀河が安定した」「新発見」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as GP from './lib-w276e-galaxyproto.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (a, b) => Math.abs(a - b) / Math.max(1e-30, Math.abs(b));
const fx = (v, d) => (v === null || v === undefined || !Number.isFinite(v) ? null : +Number(v).toFixed(d === undefined ? 6 : d));

/* ══════════════════════════════════════════════════════════════════════════
 * 宣言 —— すべて**測る前に**決めてある
 * ════════════════════════════════════════════════════════════════════════ */
/** 完成門(第276便e の指示 4「完成門を先に宣言」)。**落ちたら落ちたと書く**。 */
const GATE = {
  pitchGapDeg: 2.0,        // G1 測ったピッチ角と**与えたピッチ角**の差
  pitchSpreadDeg: 2.0,     // G1′ 窓の中のピッチ角の振れ幅(max−min)
  contrastMean: 0.10,      // G2 パターン枠の m 次コントラスト(窓の平均)
  barLengthRes: 0.05,      // G3 棒の端点間距離の相対漂い
  barWidthRes: 0.05,       // G3′ 棒の横曲げ幅 ÷ ℓ₀
  retrograde: 0.05,        // G4 逆行率
  ledgerRel: 1e-8,         // G5 H と (L_z+J_c) の相対漂い
  barLedgerAbs: 1e-10,     // G5′ 棒の ΣP・全 J の漂い(絶対・|P|,|J| の規格で)
  localRatio: 0.05,        // R44 の局所模型の適用範囲 max r/r_c
};

/** R44 の試験値(統括の検証仮説)。**変えていない**。 */
const ALPHA_BETA = { cluster: [1.1, 0.1], disk: [1.1, 25], arm: [25, 0.05] };

/** コアの宣言。(κ₀, ω_m) を同じに保ったまま r_c を大きく取って **max r/r_c < 0.05** に入れる。 */
const DECL = {
  G: 1, W0: 4,
  parent: { Mc: 5.12e6, rc: 800, omega_c: 0.225, axis: [0, 0, 1],
    alpha: ALPHA_BETA.disk[0], beta: ALPHA_BETA.disk[1], label: 'parent(面外軸・円盤)' },
  child: { Mc: 1e7, rc: 1000, omega_c: 0.28, axis: [1, 0, 0],
    alpha: ALPHA_BETA.arm[0], beta: ALPHA_BETA.arm[1], label: 'child(面内軸・腕)' },
  // 走行の宣言
  dt: 0.01, tWindow: 300, warmFrac: 1 / 3, sampleEvery: 40, pitchFrames: 8,
  diskN: 3000, armN: 1500, spiralN: 2500, spiralT: 240,
  diskT: 0.44625, diskOmegaP: 0.28,      // 冷たく速い分布(逆行率は Ω_p で決まる —— 下の予測表)
  armT: 0.768, // = σ_∥=8 に当たる(σ_∥²=T/K∥Φ)
  lambdaA: [0.3, 1, 3], IcScale: [0.1, 1, 10],
  bins: Array.from({ length: 8 }, (_, b) => ({ lo: 2 + b * 1.25, hi: 2 + (b + 1) * 1.25 })),
};

const parent = GP.makeCore({ G: DECL.G, W0: DECL.W0, ...DECL.parent });
const child = GP.makeCore({ G: DECL.G, W0: DECL.W0, ...DECL.child });
const childNoSpin = GP.makeCore({ G: DECL.G, W0: DECL.W0, ...DECL.child, omega_c: 0 });

const coreRow = (c) => ({ label: c.label, Mc: c.Mc, rc: c.rc, omega_c: c.omega_c, W0: c.W0,
  alpha: c.alpha, beta: c.beta, axis: c.axis,
  kappa0: fx(c.kappa0, 9), Wc: fx(c.Wc, 9), frac: fx(c.frac, 9), omega_m: fx(c.omega_m, 9),
  Kperp: fx(c.Kperp, 9), Kpar: fx(c.Kpar, 9), closedPositiveH: (c.Kperp > 0 && c.Kpar > 0),
  KperpPhi: fx(c.KperpPhi, 9), KparPhi: fx(c.KparPhi, 9),
  shapeRatioPredicted: fx(Math.sqrt(c.KperpPhi / c.KparPhi), 6) });

/* ══════════════════════════════════════════════════════════════════════════
 * 共通の走行器
 * ════════════════════════════════════════════════════════════════════════ */
function runSystem(o) {
  const { sys, y0, dt, steps, axis, accBins, mOrder, seriesCount } = o;
  let y = Float64Array.from(y0);
  const i0 = GP.systemInvariants(sys, y);
  const s0 = GP.shapeStats(y, sys.N, axis || [0, 0, 1]);
  const r0 = GP.retrogradeFraction(sys, y);
  const acc = accBins ? GP.makeAccum(accBins) : null;
  // 時間列の 1 点は **1 枚ではなく 1 区間**(区間内の全サンプル枚)で作る。
  // 1 枚だとビンあたりの粒子数が少なく散射雑音 0.5√(π/n) がピッチ角に数度の散らばりを出す
  // (**実測で判明した** —— N=400 で振れ幅 3.2°)。区間平均は同じ量を √枚数 だけ静かにする。
  let segAcc = accBins ? GP.makeAccum(accBins) : null;
  const warm = Math.floor(steps * DECL.warmFrac);
  const every = Math.max(1, Math.floor((steps - warm) / (seriesCount || DECL.pitchFrames)));
  const series = [];
  let worstH = 0, worstLzJc = 0, worstLsymAbs = 0;
  const scale = Math.abs(i0.Ekin) + Math.abs(i0.Upot) + Math.abs(i0.Uarm) + Math.abs(i0.Espin);
  for (let k = 0; k < steps; k++) {
    y = GP.rk4(sys, y, dt);
    const inWindow = k >= warm;
    if (inWindow && accBins && (k % DECL.sampleEvery === 0)) {
      GP.accumFrame(acc, y, sys.N, mOrder, y[GP.PHI_OFF(sys.N)]);
      GP.accumFrame(segAcc, y, sys.N, mOrder, y[GP.PHI_OFF(sys.N)]);
    }
    if ((k + 1) % Math.max(1, Math.floor(steps / 30)) === 0 || k === steps - 1) {
      const iv = GP.systemInvariants(sys, y);
      worstH = Math.max(worstH, Math.abs(iv.H - i0.H) / Math.max(1e-30, scale));
      worstLzJc = Math.max(worstLzJc, rel(iv.LzPlusJc, i0.LzPlusJc));
      worstLsymAbs = Math.max(worstLsymAbs, Math.abs(iv.Lsym - i0.Lsym));
    }
    if (inWindow && ((k - warm) % every === every - 1) && accBins) {
      const q = GP.accumPitch(segAcc, mOrder);
      series.push({ t: fx((k + 1) * dt, 2), frames: segAcc.frames, pitchDeg: fx(q.pitchDeg, 3),
        contrast: fx(q.ampMean, 5), noise: fx(q.noiseMean, 5), r2: fx(q.r2, 4) });
      segAcc = GP.makeAccum(accBins);
    }
    if (inWindow && ((k - warm) % every === 0) && !accBins) {
      const sh = GP.shapeStats(y, sys.N, axis || [0, 0, 1]);
      series.push({ t: fx((k + 1) * dt, 2), transWidth: fx(sh.transWidth, 6),
        axialHalf: fx(sh.axialHalf, 6), dispRatio: fx(sh.dispRatio, 6),
        rmsPlanar: fx(sh.rmsPlanar, 6) });
    }
  }
  const i1 = GP.systemInvariants(sys, y);
  const s1 = GP.shapeStats(y, sys.N, axis || [0, 0, 1]);
  const r1 = GP.retrogradeFraction(sys, y);
  return { y, first: i0, last: i1, shape0: s0, shape1: s1, retro0: r0, retro1: r1,
    acc, series, scale,
    worstHrel: worstH, worstLzJcRel: worstLzJc, worstLsymAbs };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (i) 直線腕の横方向安定(子コア単独 + **スピン 0 の対照**)
 * ════════════════════════════════════════════════════════════════════════ */
const stageI = { note: '子コアの面内軸だけ。**スピン 0 の対照**を並べる', rows: [] };
for (const c of [child, childNoSpin]) {
  const isSpin = c.omega_c > 0;
  const T = isSpin ? DECL.armT : DECL.armT;
  let row;
  try {
    const s = GP.gibbsSample({ core: c, N: DECL.armN, mass: 1, T, Omega_p: c.omega_m, seed: 21 });
    const sys = GP.makeSystem({ N: DECL.armN, mass: 1, cores: [c], arm: null, Ic: 1 });
    const eff = GP.effectiveStiffness(sys);
    const r = runSystem({ sys, y0: s.y, dt: DECL.dt,
      steps: Math.round(DECL.tWindow / DECL.dt), axis: c.axis });
    row = { id: isSpin ? 'arm(子コアのスピンあり)' : 'arm(**スピン 0 の対照**)',
      omega_m: fx(c.omega_m, 6), sigPerpDecl: fx(s.sigPerp, 6), sigParDecl: fx(s.sigPar, 6),
      shapeRatioDecl: fx(s.sigPar / s.sigPerp, 6),
      effEigs: eff.eigs.map((v) => fx(v, 9)), closed: eff.closed,
      transWidth0: fx(r.shape0.transWidth, 6), transWidth1: fx(r.shape1.transWidth, 6),
      transWidthRes: fx(rel(r.shape1.transWidth, r.shape0.transWidth), 6),
      axialHalf0: fx(r.shape0.axialHalf, 6), axialHalf1: fx(r.shape1.axialHalf, 6),
      axialHalfRes: fx(rel(r.shape1.axialHalf, r.shape0.axialHalf), 6),
      aspect0: fx(r.shape0.axialSig / r.shape0.transWidth, 6),
      aspect1: fx(r.shape1.axialSig / r.shape1.transWidth, 6),
      rmaxOverRc: fx(r.last.rmax / c.rc, 6), localOk: (r.last.rmax / c.rc) <= GATE.localRatio,
      worstHrel: r.worstHrel, Lsym0: fx(r.first.Lsym, 6), worstLsymAbs: r.worstLsymAbs,
      series: r.series };
  } catch (e) { row = { id: isSpin ? 'arm(spin)' : 'arm(spin0)', error: String(e).slice(0, 140) }; }
  stageI.rows.push(row);
}

/* ══════════════════════════════════════════════════════════════════════════
 * (ii) 親コアの円盤メッシュ(と、**2 軸を同時に回した場合**)
 * ════════════════════════════════════════════════════════════════════════ */
const stageII = { note: '親コアの面外軸で円盤。**逆行率は Ω_p だけで決まる**(閉形式の事前予測つき)',
  forecast: [], rows: [], twoAxis: null };
// 逆行率の**事前予測表**(走らせる前に書ける)
for (const Op of [parent.omega_m, 0.20, 0.25, DECL.diskOmegaP, 0.30]) {
  const f = GP.retrogradeForecast(parent, Op);
  stageII.forecast.push({ Omega_p: fx(Op, 6), delta: fx(f.delta, 6), kPerp: fx(f.kPerp, 9),
    c: fx(f.c, 6), fracPredicted: fx(f.fracPredicted, 6),
    corotation: Math.abs(Op - parent.omega_m) < 1e-12 });
}
stageII.corotationFloor = (() => {
  const z = GP.retrogradeCorotationFloor(parent.alpha);
  return { alpha: parent.alpha, c: fx(z.c, 6), frac: fx(z.frac, 6),
    note: '共回転(Ω_p=ω_m)のまま κ₀→0 にしたときの**下限**。α=1.1 ではこれ以上下がらない' };
})();
stageII.requiredC = fx(GP.retrogradeRequiredC(GATE.retrograde), 6);

for (const Op of [parent.omega_m, DECL.diskOmegaP, 0.30]) {
  const f = GP.retrogradeForecast(parent, Op);
  const T = (Op === parent.omega_m) ? 25 * f.kPerp : 25 * f.kPerp;   // σ⊥=5 に当たる T
  const s = GP.gibbsSample({ core: parent, N: DECL.diskN, mass: 1, T, Omega_p: Op, seed: 33 });
  const sys = GP.makeSystem({ N: DECL.diskN, mass: 1, cores: [parent], arm: null, Ic: 1 });
  const eff = GP.effectiveStiffness(sys);
  const r = runSystem({ sys, y0: s.y, dt: DECL.dt,
    steps: Math.round(DECL.tWindow / DECL.dt), axis: parent.axis });
  const sh = GP.rotationShear(sys, r.y, 6);
  stageII.rows.push({ id: `disk(Ω_p=${fx(Op, 4)}${Math.abs(Op - parent.omega_m) < 1e-12 ? '=ω_m 共回転' : ''})`,
    Omega_p: fx(Op, 6), T: fx(T, 6), sigPerpDecl: fx(s.sigPerp, 6), sigParDecl: fx(s.sigPar, 6),
    effEigs: eff.eigs.map((v) => fx(v, 9)), closed: eff.closed,
    retroPredicted: fx(f.fracPredicted, 6),
    retro0: fx(r.retro0.frac, 6), retro1: fx(r.retro1.frac, 6),
    dispRatio0: fx(r.shape0.dispRatio, 6), dispRatio1: fx(r.shape1.dispRatio, 6),
    rmsPlanar0: fx(r.shape0.rmsPlanar, 6), rmsPlanar1: fx(r.shape1.rmsPlanar, 6),
    rmsRes: fx(rel(r.shape1.rmsPlanar, r.shape0.rmsPlanar), 6),
    omegaRows: sh.rows.map((q) => ({ r: fx(q.r, 4), omega: fx(q.omega, 6) })),
    shearMax: fx(sh.shearMax, 6), omegaSpread: fx(sh.omegaSpread, 6),
    rmaxOverRc: fx(r.last.rmax / parent.rc, 6), localOk: (r.last.rmax / parent.rc) <= GATE.localRatio,
    worstHrel: r.worstHrel, Lsym0: fx(r.first.Lsym, 4), worstLsymAbs: r.worstLsymAbs, series: r.series });
}
// **2 軸を同時に**(親の面外 + 子の面内)—— R44 の「単一軸で両役割を同時に満たさない」
{
  const sys = GP.makeSystem({ N: 1, mass: 1, cores: [parent, child], arm: null, Ic: 1 });
  const eff = GP.effectiveStiffness(sys);
  const OmTot = sys.Omega;
  stageII.twoAxis = {
    id: '親(面外)+ 子(面内)を**同時に**1 つのメッシュへ',
    OmegaTot: OmTot.map((v) => fx(v, 6)),
    OmegaTotNorm: fx(Math.hypot(...OmTot), 6),
    tiltDeg: fx(Math.acos(Math.abs(OmTot[2]) / Math.hypot(...OmTot)) * 180 / Math.PI, 4),
    effEigs: eff.eigs.map((v) => fx(v, 9)), minEig: fx(eff.minEig, 9), closed: eff.closed,
    note: '2 本の軸の u を足すと Ω_tot は傾いた剛体回転になり、Φ_eff の交差項が出る。'
      + '**閉じた正の H かどうかは実効剛性行列の固有値で決まる**(この表がその実測)',
  };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (iii) 渦巻パターン(円盤 + Φ_arm(φ_c, J_c))
 * ════════════════════════════════════════════════════════════════════════ */
const stageIII = { note: 'パターン腕は**与えた位相結合**である。ピッチは β_s の宣言で決まる',
  imposedPitchDeg: null, rows: [], icSensitivity: [], material: [] };
{
  const p0 = { ...GP.ARM_DEFAULT };
  stageIII.imposedPitchDeg = fx(GP.imposedPitchDeg(p0), 6);
  stageIII.armRule = {
    formula: 'A₀ = λ_A · f_c · ω_mc² · r_d²(子コアのスピンと背景の重みだけから作る)',
    f_c: fx(child.frac, 6), omega_mc: fx(child.omega_m, 6), rd: p0.rd,
    A0_perLambda: fx(GP.armAmplitude0(child, { ...p0, lambdaA: 1 }), 9),
  };
  // 勾配の検算(**A′(r) 項も ∂χ/∂r 項も落としていない**)
  const pc = { ...p0, lambdaA: 1, chiA: 0.001, Jref: 1000 };
  pc.A0 = GP.armAmplitude0(child, pc);
  let worst = 0, npt = 0;
  for (const r of [0.2, 0.8, 2, 5, 9, 15]) for (const th of [0, 0.7, 1.9, 3.3, 5.1]) {
    const x = r * Math.cos(th), y = r * Math.sin(th), h = 1e-6;
    const a = GP.armFieldAt(x, y, 0.3, 2000, pc);
    const U = (xx, yy, ph, jc) => GP.armFieldAt(xx, yy, ph, jc, pc).Phi;
    worst = Math.max(worst,
      Math.abs(a.gx - (U(x + h, y, 0.3, 2000) - U(x - h, y, 0.3, 2000)) / (2 * h)),
      Math.abs(a.gy - (U(x, y + h, 0.3, 2000) - U(x, y - h, 0.3, 2000)) / (2 * h)),
      Math.abs(a.dPhidphic - (U(x, y, 0.3 + h, 2000) - U(x, y, 0.3 - h, 2000)) / (2 * h)),
      Math.abs(a.dPhidJc - (U(x, y, 0.3, 2000 + 1e-3) - U(x, y, 0.3, 2000 - 1e-3)) / 2e-3));
    npt++;
  }
  stageIII.gradCheck = { worst, points: npt,
    note: '解析勾配 vs 中心差分(x・y・φ_c・J_c の 4 方向)' };
}

function spiralRun(lambdaA, IcScale, seed) {
  const p = { ...GP.ARM_DEFAULT, lambdaA };
  p.A0 = GP.armAmplitude0(child, p);
  const f = GP.retrogradeForecast(parent, DECL.diskOmegaP);
  const T = 25 * f.kPerp;
  const N = DECL.spiralN;
  const s = GP.gibbsSample({ core: parent, N, mass: 1, T, Omega_p: DECL.diskOmegaP, seed });
  const Ic = IcScale * N * p.rd * p.rd;
  const y0 = Float64Array.from(s.y);
  y0[GP.JC_OFF(N)] = Ic * 0.10;                  // パターン速度の初期値 Ω_pattern=0.10(宣言)
  const sys = GP.makeSystem({ N, mass: 1, cores: [parent], arm: p, Ic });
  const r = runSystem({ sys, y0, dt: DECL.dt, steps: Math.round(DECL.spiralT / DECL.dt),
    axis: parent.axis, accBins: DECL.bins, mOrder: p.m });
  const q = GP.accumPitch(r.acc, p.m);
  const pitches = r.series.map((z) => z.pitchDeg).filter((v) => v !== null);
  const contrasts = r.series.map((z) => z.contrast).filter((v) => v !== null);
  const sh = GP.rotationShear(sys, r.y, 6);
  return { id: `spiral(λ_A=${lambdaA}・I_c=${IcScale}·N·r_d²)`,
    lambdaA, IcScale, A0: fx(p.A0, 9), Ic: fx(Ic, 3),
    OmegaPattern0: 0.1, OmegaPattern1: fx(r.last.Jc / Ic, 6),
    Jc0: fx(r.first.Jc, 3), Jc1: fx(r.last.Jc, 3),
    pitchImposed: fx(GP.imposedPitchDeg(p), 4),
    pitchWindow: fx(q.pitchDeg, 4), betaHat: fx(q.betaHat, 4), fitR2: fx(q.r2, 5),
    pitchGap: fx(Math.abs(q.pitchDeg - GP.imposedPitchDeg(p)), 4),
    pitchSpread: pitches.length ? fx(Math.max(...pitches) - Math.min(...pitches), 4) : null,
    contrastWindow: fx(q.ampMean, 5), contrastNoise: fx(q.noiseMean, 5),
    contrastMin: contrasts.length ? fx(Math.min(...contrasts), 5) : null,
    contrastMax: contrasts.length ? fx(Math.max(...contrasts), 5) : null,
    retro1: fx(r.retro1.frac, 6), dispRatio1: fx(r.shape1.dispRatio, 6),
    rmsRes: fx(rel(r.shape1.rmsPlanar, r.shape0.rmsPlanar), 6),
    shearMax: fx(sh.shearMax, 6),
    rmaxOverRc: fx(r.last.rmax / parent.rc, 6),
    worstHrel: r.worstHrel, worstLzJcRel: r.worstLzJcRel,
    binRows: q.rows.map((z) => ({ r: fx(z.r, 3), theta: fx(z.theta, 4), amp: fx(z.amp, 5), noise: fx(z.noise, 5) })),
    series: r.series };
}
for (const la of DECL.lambdaA) stageIII.rows.push(spiralRun(la, 1, 7));
for (const ic of DECL.IcScale) if (ic !== 1) stageIII.icSensitivity.push(spiralRun(3, ic, 7));
stageIII.icSensitivity.push(stageIII.rows[stageIII.rows.length - 1]);

/* ── 材料腕との比較(巻き込み) ───────────────────────────────────────────── */
{
  // (a) R44 の調和コア(円盤)の中の材料腕 —— 剪断がどれだけあるか
  // (b) **宣言した剪断場**(平坦回転曲線・R44 の局所模型の外)の中の材料腕
  const p0 = { ...GP.ARM_DEFAULT };
  const pitch0 = GP.imposedPitchDeg(p0);
  const makeSpiralLine = (n, rlo, rhi) => {
    const y = new Float64Array(GP.STATE_LEN(n));
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const r = rlo * Math.pow(rhi / rlo, u);
      // **1 本の腕だけ**を並べる(2 本を混ぜると ln r への当てはめが壊れる —— 実測で判明した)
      const th = (p0.beta_s / p0.m) * Math.log(r / p0.r0);
      const o = 6 * i;
      y[o] = r * Math.cos(th); y[o + 1] = r * Math.sin(th); y[o + 2] = 0;
    }
    return y;
  };
  const nLine = 400;
  const idx = Array.from({ length: nLine }, (_, i) => i);
  // (a) 調和コア(円盤)
  {
    const y = makeSpiralLine(nLine, 3, 12);
    const sys = GP.makeSystem({ N: nLine, mass: 1, cores: [parent], arm: null, Ic: 1 });
    // **面内の円軌道**に乗せる: v = Ω_c(ẑ×x)、Ω_c = ω_m + √(ω_m²+K⊥)。p = m(v − ω_m ẑ×x)。
    const Oc = GP.circularRate(parent);
    for (let i = 0; i < nLine; i++) {
      const o = 6 * i, x = y[o], yv = y[o + 1], d = Oc - parent.omega_m;
      y[o + 3] = -d * yv; y[o + 4] = d * x;
    }
    let yy = y;
    const steps = Math.round(DECL.tWindow / DECL.dt);
    const rows = [{ t: 0, pitchDeg: fx(GP.materialArmPitch(yy, idx).pitchDeg, 4) }];
    for (let k = 0; k < steps; k++) {
      yy = GP.rk4(sys, yy, DECL.dt);
      if ((k + 1) % Math.floor(steps / 12) === 0) {
        rows.push({ t: fx((k + 1) * DECL.dt, 2), pitchDeg: fx(GP.materialArmPitch(yy, idx).pitchDeg, 4) });
      }
    }
    const shr = GP.rotationShear(sys, yy, 5);
    stageIII.material.push({ id: '材料腕 @ R44 の調和コア(円盤)', pitch0: fx(pitch0, 4),
      circularRate: fx(GP.circularRate(parent), 6),
      note: '円軌道の角速度が **r に依らない**(Ω_c = ω_m + √(ω_m²+K⊥))ので剪断が出ない',
      shearMax: fx(shr.shearMax, 8), omegaSpread: fx(shr.omegaSpread, 6), rows });
  }
  // (b) 宣言した剪断場(**R44 の外**)
  {
    const flat = { vc: 1, rh: 1, kz: 0.5 };
    const y = makeSpiralLine(nLine, 3, 12);
    for (let i = 0; i < nLine; i++) {
      const o = 6 * i, x = y[o], yv = y[o + 1], r = Math.hypot(x, yv);
      const v = flat.vc * r / Math.sqrt(r * r + flat.rh * flat.rh);
      y[o + 3] = -v * yv / r; y[o + 4] = v * x / r;      // 円軌道(Ω=0 なので p=mv)
    }
    const sys = GP.makeSystem({ N: nLine, mass: 1, cores: [], arm: null, Ic: 1, flat });
    let yy = y;
    const steps = Math.round(150 / DECL.dt);
    const rows = [{ t: 0, pitchDeg: fx(GP.materialArmPitch(yy, idx).pitchDeg, 4) }];
    for (let k = 0; k < steps; k++) {
      yy = GP.rk4(sys, yy, DECL.dt);
      if ((k + 1) % Math.floor(steps / 12) === 0) {
        rows.push({ t: fx((k + 1) * DECL.dt, 2), pitchDeg: fx(GP.materialArmPitch(yy, idx).pitchDeg, 4) });
      }
    }
    const shr = GP.rotationShear(sys, yy, 5);
    stageIII.material.push({ id: '材料腕 @ **宣言した剪断場**(平坦回転曲線・R44 の外)',
      pitch0: fx(pitch0, 4), declared: flat,
      shearMax: fx(shr.shearMax, 6), omegaSpread: fx(shr.omegaSpread, 6), rows });
  }
  stageIII.patternPitchIsTimeIndependent = {
    note: 'パターン腕の軌跡 θ = φ_c + (β_s/m)ln(r/r₀) のピッチ角は **t に依らない**(構成から)',
    value: fx(pitch0, 6),
  };
}

/* ══════════════════════════════════════════════════════════════════════════
 * (iv) 棒 —— 宣言した結合グラフ
 * ════════════════════════════════════════════════════════════════════════ */
const stageIV = { note: '**自発形成は 1 行も実装していない**。グラフは外から与える', hessian: [], runs: [] };
{
  const n = 6, l0 = 8;
  const g = GP.chainGraph(n, l0);
  const decls = [
    { id: '第66報 (4) の字義の形(伸び + ネマティック)', p: { kl: 1, l0, Js: 0.5, Ktheta: 0, Jt: 0 } },
    { id: '+ 第274便e の曲げ項 K_θ=4', p: { kl: 1, l0, Js: 0.5, Ktheta: 4, Jt: 0 } },
    { id: '+ 結合方向とコア軸の結合 J_t=4(**宣言の拡張**)', p: { kl: 1, l0, Js: 0.5, Ktheta: 0, Jt: 4 } },
  ];
  for (const d of decls) {
    const gr = GP.barGraphForces(g.nodes, g.spins, g.edges, d.p).grad;
    let gm = 0; for (const v of gr) gm = Math.max(gm, Math.abs(v));
    const chk = GP.barGraphGradCheck(g.nodes, g.spins, g.edges, d.p);
    const H = GP.barGraphHessian(g.nodes, g.spins, g.edges, d.p);
    const ev = GP.eigSym(H);
    const zm = GP.zeroModeCount(ev, 1e-8);
    const rm = GP.rigidModes(g.nodes);
    const rot = GP.barRigidRotation(g.nodes, g.spins, g.edges, d.p, 0.37, [0, 0, 1]);
    stageIV.hessian.push({ id: d.id, decl: d.p, dof: 3 * n,
      gradMax: gm, gradVsFD: chk, zeroModes: zm.zero, minNonZero: fx(zm.minNonZero, 9),
      maxEig: fx(zm.maxAbs, 6),
      negative: ev.filter((e) => e < -1e-8 * zm.maxAbs).length,
      positive: ev.filter((e) => e > 1e-8 * zm.maxAbs).length,
      rigidResidual: Math.max(...['tx', 'ty', 'tz', 'rz', 'ry'].map((k) => GP.hessianResidual(H, rm[k]))),
      dU_rotateBoth: rot.dUboth, dU_rotatePositionsOnly: rot.dUposOnly });
  }
  // 走行(帳簿)。横に初期変位を与え、**全体回転を持たせた**まま走らせる
  // (**pinned で固定した棒を成果にしない**)。最後の 1 本だけ**宣言した散逸**を入れる。
  const runs = decls.map((d) => ({ ...d, gamma: 0 }));
  runs.push({ id: '+ K_θ=4 と**宣言した散逸** γ=0.2(剛体分は落とさない・熱は非負)',
    p: { kl: 1, l0, Js: 0.5, Ktheta: 4, Jt: 0 }, gamma: 0.2 });
  for (const d of runs) {
    const nodes = g.nodes.map((q, a) => [q[0], q[1] + (a % 2 ? 0.6 : -0.6), 0]);   // 横曲げの初期変位
    const M = new Array(n).fill(1);
    const moms = nodes.map(() => [0, 0, 0]);
    const Ispin = 4, omgSpin = 0.5;
    const spinL = g.spins.map((s) => GP.g3.mul(s, Ispin * omgSpin));
    // 全体回転を与える(**pinned で固定した棒を成果にしない**)
    const Omg = 0.05;
    for (let a = 0; a < n; a++) moms[a] = [-Omg * nodes[a][1] * M[a], Omg * nodes[a][0] * M[a], 0];
    const B = { n, edges: g.edges, p: d.p, M, gamma: d.gamma || 0 };
    let z = GP.barPack(nodes, moms, spinL, true);
    const i0 = GP.barInvariants(B, z);
    const dt = 0.001, steps = 200000;
    let worstE = 0, worstP = 0, worstJ = 0, wLen = 0, wWid = 0, heatPrev = 0, heatMono = true;
    const scaleJ = Math.max(1e-30, GP.g3.norm(i0.J));
    const rows = [];
    for (let k = 0; k < steps; k++) {
      z = GP.barRk4(B, z, dt);
      if ((k + 1) % 500 === 0) {
        const iv = GP.barInvariants(B, z);
        worstE = Math.max(worstE, Math.abs(iv.E - i0.E) / Math.max(1e-30, Math.abs(i0.Ekin) + Math.abs(i0.U)));
        if (iv.heat < heatPrev - 1e-14) heatMono = false;
        heatPrev = iv.heat;
        worstP = Math.max(worstP, GP.g3.norm(GP.g3.sub(iv.P, i0.P)));
        worstJ = Math.max(worstJ, GP.g3.norm(GP.g3.sub(iv.J, i0.J)) / scaleJ);
        wLen = Math.max(wLen, Math.abs(iv.endLength - i0.endLength) / i0.endLength);
        wWid = Math.max(wWid, iv.bendWidth);
      }
      if ((k + 1) % Math.floor(steps / 5) === 0) {
        const iv = GP.barInvariants(B, z);
        rows.push({ t: fx((k + 1) * dt, 2), endLength: fx(iv.endLength, 6),
          bendWidth: fx(iv.bendWidth, 6) });
      }
    }
    const i1 = GP.barInvariants(B, z);
    stageIV.runs.push({ id: d.id, decl: d.p, gamma: d.gamma || 0, t: fx(dt * steps, 2),
      heat0: fx(i0.heat, 9), heat1: fx(i1.heat, 6), heatMonotone: heatMono,
      EmechDrop: fx(i0.Emech - i1.Emech, 6),
      heatClosure: Math.abs((i1.Emech + i1.heat) - (i0.Emech + i0.heat)),
      endLength0: fx(i0.endLength, 6), endLength1: fx(i1.endLength, 6),
      endLengthWorstRes: fx(wLen, 6),
      bendWidth0: fx(i0.bendWidth, 6), bendWidth1: fx(i1.bendWidth, 6),
      bendWidthWorstOverL0: fx(wWid / d.p.l0, 6),
      worstErel: worstE, worstPabs: worstP, worstJrel: worstJ,
      spinMagDrift: fx(Math.max(...i1.spinMags.map((v, a) => Math.abs(v - i0.spinMags[a]))), 12),
      rows });
  }
}

/* ══════════════════════════════════════════════════════════════════════════
 * 完成門の判定(**宣言した門をそのまま当てる**)
 * ════════════════════════════════════════════════════════════════════════ */
const best = stageIII.rows.reduce((a, b) => ((b.contrastWindow || 0) > (a.contrastWindow || 0) ? b : a), stageIII.rows[0]);
const diskFast = stageII.rows.find((r) => Math.abs(r.Omega_p - DECL.diskOmegaP) < 1e-9);
const diskCorot = stageII.rows.find((r) => r.Omega_p === fx(parent.omega_m, 6));
const barBend = stageIV.runs.find((r) => r.decl.Ktheta > 0 && !r.gamma);
const barDamped = stageIV.runs.find((r) => r.gamma > 0);
const armSpin = stageI.rows[0];

const gates = [
  { id: 'G1 ピッチ角が与えた値から離れない', gate: `|Δpitch| ≤ ${GATE.pitchGapDeg}°`,
    value: best.pitchGap, pass: best.pitchGap !== null && best.pitchGap <= GATE.pitchGapDeg,
    where: best.id },
  { id: "G1′ 窓の中のピッチ角の振れ幅", gate: `max−min ≤ ${GATE.pitchSpreadDeg}°`,
    value: best.pitchSpread, pass: best.pitchSpread !== null && best.pitchSpread <= GATE.pitchSpreadDeg,
    where: best.id },
  { id: 'G2 腕のコントラスト', gate: `|Σ_m|/Σ₀ ≥ ${GATE.contrastMean}`,
    value: best.contrastWindow, pass: best.contrastWindow !== null && best.contrastWindow >= GATE.contrastMean,
    where: best.id },
  { id: 'G3 棒の長さが保たれる', gate: `相対漂い ≤ ${GATE.barLengthRes}`,
    value: barBend ? barBend.endLengthWorstRes : null,
    pass: !!barBend && barBend.endLengthWorstRes <= GATE.barLengthRes, where: barBend && barBend.id },
  { id: 'G3′ 棒が横に曲がったままにならない', gate: `幅/ℓ₀ ≤ ${GATE.barWidthRes}`,
    value: barBend ? barBend.bendWidthWorstOverL0 : null,
    pass: !!barBend && barBend.bendWidthWorstOverL0 <= GATE.barWidthRes, where: barBend && barBend.id },
  { id: 'G3″ **宣言した散逸**を入れた棒の曲げ幅', gate: `幅/ℓ₀ ≤ ${GATE.barWidthRes}`,
    value: barDamped ? barDamped.bendWidth1 / barDamped.decl.l0 : null,
    pass: !!barDamped && (barDamped.bendWidth1 / barDamped.decl.l0) <= GATE.barWidthRes,
    where: barDamped && barDamped.id },
  { id: 'G4 逆行率', gate: `≤ ${GATE.retrograde}`,
    value: diskFast ? diskFast.retro1 : null,
    pass: !!diskFast && diskFast.retro1 <= GATE.retrograde, where: diskFast && diskFast.id },
  { id: 'G4′ **共回転のまま**の逆行率', gate: `≤ ${GATE.retrograde}`,
    value: diskCorot ? diskCorot.retro1 : null,
    pass: !!diskCorot && diskCorot.retro1 <= GATE.retrograde, where: diskCorot && diskCorot.id },
  { id: 'G5 H の帳簿', gate: `相対漂い ≤ ${GATE.ledgerRel}`,
    value: Math.max(...stageIII.rows.map((r) => r.worstHrel), armSpin.worstHrel || 0,
      ...stageII.rows.map((r) => r.worstHrel)),
    pass: Math.max(...stageIII.rows.map((r) => r.worstHrel), armSpin.worstHrel || 0,
      ...stageII.rows.map((r) => r.worstHrel)) <= GATE.ledgerRel, where: '全走行の最悪' },
  { id: 'G5′ (L_z + J_c) の帳簿', gate: `相対漂い ≤ ${GATE.ledgerRel}`,
    value: Math.max(...stageIII.rows.map((r) => r.worstLzJcRel)),
    pass: Math.max(...stageIII.rows.map((r) => r.worstLzJcRel)) <= GATE.ledgerRel, where: '渦巻の全走行' },
  { id: 'G5″ 棒の ΣP・全 J', gate: `≤ ${GATE.barLedgerAbs}`,
    value: Math.max(...stageIV.runs.map((r) => Math.max(r.worstPabs, r.worstJrel))),
    pass: Math.max(...stageIV.runs.map((r) => Math.max(r.worstPabs, r.worstJrel))) <= GATE.barLedgerAbs,
    where: '棒の全走行' },
  { id: 'G6 局所模型の適用範囲', gate: `max r/r_c ≤ ${GATE.localRatio}`,
    value: Math.max(armSpin.rmaxOverRc || 0, ...stageII.rows.map((r) => r.rmaxOverRc),
      ...stageIII.rows.map((r) => r.rmaxOverRc)),
    pass: Math.max(armSpin.rmaxOverRc || 0, ...stageII.rows.map((r) => r.rmaxOverRc),
      ...stageIII.rows.map((r) => r.rmaxOverRc)) <= GATE.localRatio, where: '全走行の最大' },
];

/** 仮説の対応づけ(Failure First)。 */
const verdict = [
  { id: 'G1', claim: '親コアの面外スピンが円盤をつくる', inModel: null, why: null },
  { id: 'G2', claim: '子コアの面内軸が腕をつくる', inModel: null, why: null },
  { id: 'G3', claim: '渦巻パターンは巻き込まない(材料腕と別物)', inModel: null, why: null },
  { id: 'G4', claim: '数珠状の子コアが棒として運動する', inModel: null, why: null },
  { id: 'G5', claim: '棒渦巻へ発展する(棒 + パターン腕の共存)', inModel: '**試験していない**',
    why: '本便は棒とパターン腕を**別々の走行**で測った。1 つの系に同時に入れた走行は 1 本も無い' },
];
verdict[0].inModel = (diskFast && diskFast.dispRatio1 < 0.5) ? '**成り立つ(与えた α・β の下で)**' : '**成り立たない**';
verdict[0].why = `Φ の剛性比 √(K⊥Φ/K∥Φ)=${coreRow(parent).shapeRatioPredicted} の宣言で σ_z/σ_R=`
  + `${diskFast ? diskFast.dispRatio1 : '—'}。ただし**扁平は α・β の宣言の帰結**であって導出ではない。`
  + `逆行率は Ω_p だけで決まり、**共回転のままでは ${stageII.corotationFloor.frac} を下回れない**`;
verdict[1].inModel = (armSpin.aspect1 && armSpin.aspect1 > 3) ? '**成り立つ(与えた α=25/β=0.05 の下で)**' : '**成り立たない**';
verdict[1].why = `スピンありで縦横比 ${armSpin.aspect1}(横断幅の残差 ${armSpin.transWidthRes})、`
  + `**スピン 0 の対照**では ${stageI.rows[1].aspect1}(= 等方)。腕は ω_m² に掛かる α・β から来ている`;
verdict[2].inModel = '**半分だけ**';
verdict[2].why = `パターンのピッチは構成から t に依らない(${stageIII.patternPitchIsTimeIndependent.value}°)。`
  + `ところが **R44 の調和コアでは剪断が ${stageIII.material[0].shearMax} しか無い**ので、`
  + '同じ場の中では**材料腕も巻き込まない** —— この模型では両者を巻き込みで区別できない。'
  + `区別が見えるのは**宣言した剪断場**(R44 の外)を足したときだけ(材料腕のピッチ `
  + `${stageIII.material[1].rows[0].pitchDeg}° → ${stageIII.material[1].rows[stageIII.material[1].rows.length - 1].pitchDeg}°)`;
verdict[3].inModel = '**与えた結合グラフの下でだけ**';
verdict[3].why = `第66報 (4) の字義の形(伸び + ネマティック)では Hessian のゼロモードが `
  + `${stageIV.hessian[0].zeroModes} 本 = **曲げ剛性が 0**。曲げ項 K_θ を宣言すると `
  + `${stageIV.hessian[1].zeroModes} 本(並進 3 + 回転 2)になり、コア軸との結合 J_t を宣言すると `
  + `${stageIV.hessian[2].zeroModes} 本(位置だけ回すと ΔU=${stageIV.hessian[2].dU_rotatePositionsOnly}・`
  + `スピンも一緒に回すと ${stageIV.hessian[2].dU_rotateBoth})。`
  + `**保存系のままでは初期の曲げが減衰しない**(曲げ幅 ${barBend ? barBend.bendWidth0 : '—'} → `
  + `${barBend ? barBend.bendWidth1 : '—'})。**散逸を宣言**して初めて真っ直ぐになる`
  + `(γ=${barDamped ? barDamped.gamma : '—'} で ${barDamped ? barDamped.bendWidth0 : '—'} → `
  + `${barDamped ? barDamped.bendWidth1 : '—'}・熱は単調 ${barDamped ? barDamped.heatMonotone : '—'}・`
  + `ΣP と全 J は 1 も減らない)`;

/* ══════════════════════════════════════════════════════════════════════════
 * 正本 JSON
 * ════════════════════════════════════════════════════════════════════════ */
const out = {
  meta: withProvenance({
    note: '第276便e — 渦巻・棒の node 試作(原仮定者の裁定(第66報)(4) 後半)。**エンジン未接続**。',
    hypothesis: GP.GALAXY_HYPOTHESIS,
    gate: GATE,
    gateDeclaredBeforeMeasuring: true,
    doNotWrite: ['腕が創発した', '棒が自発形成した', '渦巻銀河を再現した', '銀河が安定した',
      '観測と合った', '新発見', 'v1.45.0 RC を切った'],
    caveat: 'α・β・λ_A・β_s・m・I_c・k_ℓ・J_s・J_t・剪断場は**すべて宣言**である。'
      + 'R44 のハミルトニアンは**統括の検証仮説**であって、現行 DFM から一意に導出された法則ではない。'
      + 'R44 の但し書き「r/r_c<0.05 の局所模型」に入っているかは G6 の列で確かめている。',
  }, {
    root: ROOT, wave: '第276便e', target: 'tests/lib-w276e-galaxyproto.mjs',
    code: ['tests/exp-w276e-galaxyproto.mjs', 'tests/lib-w276e-galaxyproto.mjs',
      'tests/lib-w274e-armbar.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w276e-galaxyproto.mjs', 'tests/lib-w274e-armbar.mjs'],
  }),
  declarations: { GATE, ALPHA_BETA, run: DECL, cores: [coreRow(parent), coreRow(child)] },
  stageI, stageII, stageIII, stageIV,
  gates, verdict,
};
const dir = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'galaxyproto-w276e.json'), JSON.stringify(out, null, 1));

/* ── 画面出力 ─────────────────────────────────────────────────────────────── */
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
const f6 = (x, d) => (x === null || x === undefined ? '—' : Number(x).toFixed(d === undefined ? 6 : d));
console.log('# 第276便e — 渦巻・棒の node 試作(**与えた結合の下で何が保たれるか**・エンジン未接続)');
console.log('■ コアの宣言と導出:');
for (const c of [parent, child]) {
  const r = coreRow(c);
  console.log(`   ${r.label} κ₀=${f6(r.kappa0)} W_c=${f6(r.Wc, 3)} f=${f6(r.frac)} ω_m=${f6(r.omega_m)}`
    + ` / α=${r.alpha} β=${r.beta} → K⊥=${f6(r.Kperp)} K∥=${f6(r.Kpar)} 閉じた正の H=${r.closedPositiveH}`
    + ` / 形の比の予測 ${f6(r.shapeRatioPredicted)}`);
}
console.log('(i) 直線腕の横方向安定:');
for (const r of stageI.rows) {
  console.log(`   ${r.id.padEnd(30)} 縦横比 ${f6(r.aspect0, 4)}→${f6(r.aspect1, 4)}`
    + ` / 横断幅 ${f6(r.transWidth0, 5)}→${f6(r.transWidth1, 5)}(残差 ${f6(r.transWidthRes, 5)})`
    + ` / 半長の残差 ${f6(r.axialHalfRes, 5)} / max r/r_c ${f6(r.rmaxOverRc, 4)}`
    + ` / H 漂い ${e(r.worstHrel)}`);
}
console.log('(ii) 円盤 —— **逆行率の事前予測(閉形式)**:');
for (const q of stageII.forecast) {
  console.log(`   Ω_p=${f6(q.Omega_p, 4)}${q.corotation ? '(共回転)' : '        '} c=${f6(q.c, 5)}`
    + ` → 逆行率の予測 ${f6(q.fracPredicted, 5)}`);
}
console.log(`   共回転のままの下限(α=${stageII.corotationFloor.alpha}): ${f6(stageII.corotationFloor.frac, 6)}`
  + ` / 門 ${GATE.retrograde} に要る c = ${f6(stageII.requiredC, 5)}`);
for (const r of stageII.rows) {
  console.log(`   ${r.id.padEnd(26)} 逆行率 予測 ${f6(r.retroPredicted, 5)} / 実測 ${f6(r.retro0, 5)}→${f6(r.retro1, 5)}`
    + ` / σ_z/σ_R ${f6(r.dispRatio1, 5)} / RMS 残差 ${f6(r.rmsRes, 5)} / 剪断 ${e(r.shearMax)}`
    + ` / max r/r_c ${f6(r.rmaxOverRc, 4)} / H 漂い ${e(r.worstHrel)}`);
}
console.log(`   2 軸同時: Ω_tot=${JSON.stringify(stageII.twoAxis.OmegaTot)} 傾き ${f6(stageII.twoAxis.tiltDeg, 3)}°`
  + ` / Φ_eff の固有値 ${JSON.stringify(stageII.twoAxis.effEigs)} → 閉じた正の H=${stageII.twoAxis.closed}`);
console.log(`(iii) 渦巻(与えたピッチ ${f6(stageIII.imposedPitchDeg, 4)}°・勾配の検算 ${e(stageIII.gradCheck.worst)}):`);
for (const r of stageIII.rows.concat(stageIII.icSensitivity.slice(0, -1))) {
  console.log(`   ${r.id.padEnd(34)} ピッチ ${f6(r.pitchWindow, 3)}°(差 ${f6(r.pitchGap, 3)}°・振れ ${f6(r.pitchSpread, 3)}°・R²=${f6(r.fitR2, 4)})`
    + ` / コントラスト ${f6(r.contrastWindow, 4)}(雑音 ${f6(r.contrastNoise, 4)})`
    + ` / Ω_pattern ${f6(r.OmegaPattern0, 4)}→${f6(r.OmegaPattern1, 4)}`
    + ` / H ${e(r.worstHrel)} / L_z+J_c ${e(r.worstLzJcRel)}`);
}
console.log('   材料腕との比較:');
for (const r of stageIII.material) {
  console.log(`     ${r.id} 剪断 ${e(r.shearMax)} / ピッチ ${r.rows.map((q) => f6(q.pitchDeg, 2)).join(' → ')}`);
}
console.log('(iv) 棒 —— 宣言した結合グラフの Hessian(6 節点・18 自由度):');
for (const r of stageIV.hessian) {
  console.log(`   ${r.id.padEnd(46)} ゼロモード ${r.zeroModes} 本 / 正 ${r.positive} / 負 ${r.negative}`
    + ` / 最小非ゼロ ${f6(r.minNonZero, 6)} / 勾配 vs 差分 ${e(r.gradVsFD)}`
    + ` / 剛体回転 ΔU 位置だけ ${e(r.dU_rotatePositionsOnly)}・スピンも ${e(r.dU_rotateBoth)}`);
}
console.log('   走行の帳簿:');
for (const r of stageIV.runs) {
  console.log(`   ${r.id.padEnd(46)} 長さ ${f6(r.endLength0, 4)}→${f6(r.endLength1, 4)}(最悪残差 ${f6(r.endLengthWorstRes, 5)})`
    + ` / 曲げ幅 ${f6(r.bendWidth0, 4)}→${f6(r.bendWidth1, 4)}(最悪/ℓ₀ ${f6(r.bendWidthWorstOverL0, 5)})`
    + ` / 熱 ${f6(r.heat1, 5)}(単調 ${r.heatMonotone}・閉じ ${e(r.heatClosure)})`
    + ` / E ${e(r.worstErel)} / ΣP ${e(r.worstPabs)} / J ${e(r.worstJrel)}`);
}
console.log('■ 完成門(**測る前に宣言した**):');
for (const g of gates) console.log(`   ${g.pass ? 'PASS' : '**FAIL**'} ${g.id}(${g.gate}) 実測 ${typeof g.value === 'number' ? (Math.abs(g.value) < 1e-4 ? e(g.value) : f6(g.value, 5)) : '—'} @ ${g.where}`);
console.log('■ 仮説の対応づけ(Failure First):');
for (const v of verdict) console.log(`   ${v.id} ${v.claim} → ${v.inModel}\n      ${v.why}`);
console.log('→ tests/out/galaxyproto-w276e.json');

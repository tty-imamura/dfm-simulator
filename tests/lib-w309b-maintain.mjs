// 第309便b(原仮定者の裁定(第103報)AN356「トルクの反作用は太陽の慣性自転へ戻さない —— 反作用は背景宇宙へ」・AN358「安定な天体の近似として軸も回転も維持し、
// 失われるエネルギーを内部熱に、反作用を背景宇宙へ」・(第104報)AN362「内部熱に変換するエネルギー量は、慣性自転に引きずり軸回転を合成した自転軸を慣性自転の自転軸に
// 1 ステップで回すのに必要なトルク・回転速度の差分のエネルギー量も計算する」・統括の検証項目 R219): **維持の型の 1 步の量・口座・熱の時間の型**の純関数。
//
// エンジン(beta/index.html の inertialDrag3MaintCell・inertialDrag3MaintStep)と**同じ式・同じ演算順**の参照(restoreCell・splitDrag)と、
// 素朴な式(二乗の差 —— 桁落ちの対照)・口座の增分・熱の時間の型("step" —— 1 步ごと / {tauHold} —— 固定した物理の作用間隔ごと)の走査。
//
// ■ 言わないこと: 「帳簿が完全に閉じた」(器が示した範囲を数で)・「熱を説明した」・「τ_hold を導いた」(比較の仮定)・
//   軸のコストを「トルクの実際の仕事」と書くこと(大きさを保つ回転の実際の仕事は 0 —— 別に記録)。
import { dot, add, sub, scale, norm, unit } from './lib-w308b-hold.mjs';
export { dot, add, sub, scale, norm, unit };
export const LIB_VERSION = 'w309b-maintain-lib-1';

/* ───────── エンジンの步の参照(同じ式・同じ演算順) ───────── */
/**
 * 受け手の ω_D を宣言の軸 â への射影 wp と垂直な成分 q に分ける(エンジンの inertialDrag3MaintStep と同じ演算 ——
 * 傾きを持たない受け手は符号つきのスカラー σ を自分の軸の向きに: wp = σ・q = 0)
 */
export function splitDrag(wD, a, flat, sigma) {
  if (flat) return { wp: sigma, q: [0, 0, 0], d: [sigma * a[0], sigma * a[1], sigma * a[2]] };
  const wp = wD[0] * a[0] + wD[1] * a[1] + wD[2] * a[2];
  return { wp, q: [wD[0] - wp * a[0], wD[1] - wp * a[1], wD[2] - wp * a[2]], d: [wD[0], wD[1], wD[2]] };
}
/**
 * 1 步の量(エンジンの inertialDrag3MaintCell と同じ演算順)。I・s0(符号つきの慣性自転)・a(宣言の軸 —— 単位)・wp・q。
 * 戻り値: Eax(軸のコスト ½I abs(s â − Ω_c)²)・Esp(速さの差 I(Ω_I·ω_D + ½abs(ω_D)²) —— 符号つき)・heat(Eax + max(Esp, 0))・
 * Jaxis(I(s â − Ω_c))・Jspeed(I(Ω_I − s â))・axisWork(½I(s² − abs(Ω_c)²) —— 大きさを保つ回転の実際の仕事 —— 丸め床)・s・cp(c∥)・q2
 */
export function restoreCell(I, s0, a, wp, q) {
  const sg = (s0 < 0) ? -1 : 1, w = sg * s0, p = sg * wp, qx = q[0], qy = q[1], qz = q[2], q2 = qx * qx + qy * qy + qz * qz;
  const cp = w + p, s = Math.sqrt(cp * cp + q2);
  const dpar = (cp > 0) ? q2 / (s + cp) : s - cp;
  const Eax = 0.5 * I * (dpar * dpar + q2), d2 = p * p + q2, Esp = I * (w * p + 0.5 * d2);
  const ws = w + s, wms = (ws > 0) ? -(2 * w * p + d2) / ws : 0;
  const ux = sg * a[0], uy = sg * a[1], uz = sg * a[2];
  return { Eax, Esp, heat: Eax + ((Esp > 0) ? Esp : 0),
    Jaxis: [I * (dpar * ux - qx), I * (dpar * uy - qy), I * (dpar * uz - qz)], Jspeed: [I * wms * ux, I * wms * uy, I * wms * uz],
    axisWork: 0.5 * I * (s * s - (cp * cp + q2)), s, cp, q2, w, p };
}
/** 素朴な式(ベクトルの差と二乗の差 —— 桁落ちの対照): Ω_c = Ω_I + ω_D・â = Ω_I/abs(Ω_I) */
export function restoreNaive(I, OmI, wD) {
  const Oc = add(OmI, wD), s = norm(Oc), a = unit(OmI), d = sub(scale(a, s), Oc);
  return { Eax: 0.5 * I * dot(d, d), Esp: 0.5 * I * (dot(Oc, Oc) - dot(OmI, OmI)), Jaxis: scale(d, I), Jspeed: scale(sub(OmI, scale(a, s)), I) };
}
/** 熱の時間の型の重み: "step" は 1(1 步ごとに 1 回)・{tauHold} は h/τ_hold(固定した物理の作用間隔ごと) */
export function timingWeight(heatTiming, h) {
  if (heatTiming === 'step' || heatTiming === undefined || heatTiming === null) return 1;
  if (heatTiming && typeof heatTiming === 'object' && heatTiming.tauHold > 0) return h / heatTiming.tauHold;
  throw new Error('heatTiming の定義域');
}
/**
 * 口座の 1 步の增分(重み wt つき)。合成場の側 field(ΔL = −I ω_D・ΔE = −E_speed)・受け皿 sink(ΔL = −(ΔJ_axis + ΔJ_speed)・ΔE = −E_axis^cost − max(−E_speed, 0))・
 * 内部熱 heat。受け手の状態の変化は 0(維持)。和は L・E とも 0(丸め床)。
 */
export function accountStep(I, s0, a, wD, flat, sigma, wt) {
  const sp = splitDrag(wD, a, flat, sigma), c = restoreCell(I, s0, a, sp.wp, sp.q);
  const sup = (c.Esp > 0) ? 0 : -c.Esp;
  return { cell: c, wt,
    fieldL: scale(sp.d, -I * wt), fieldE: -c.Esp * wt,
    sinkL: scale(add(c.Jaxis, c.Jspeed), -wt), sinkE: -(c.Eax + sup) * wt,
    heat: c.heat * wt, supply: sup * wt };
}
/** 一定の ω_D を時間 T のあいだ刻み h で(T/h 步)—— 熱・口座の和(熱の時間の型ごと)。dt の走査の参照 */
export function constantRun({ I, s0, a, wD, T, h, heatTiming }) {
  const N = Math.round(T / h), wt = timingWeight(heatTiming, h);
  let heat = 0, Eax = 0, Esp = 0, fL = [0, 0, 0], sL = [0, 0, 0], fE = 0, sE = 0, J = 0;
  for (let k = 0; k < N; k++) {
    const q = accountStep(I, s0, a, wD, false, 0, wt);
    heat += q.heat; Eax += q.cell.Eax * wt; Esp += q.cell.Esp * wt; fL = add(fL, q.fieldL); sL = add(sL, q.sinkL); fE += q.fieldE; sE += q.sinkE;
    J = Math.max(J, norm(add(q.cell.Jaxis, q.cell.Jspeed)) / h);   // 復元を 1 步の平均のトルクとして読む大きさ(参考 —— 刻みに反比例)
  }
  return { N, wt, heat, Eax, Esp, fieldL: fL, sinkL: sL, fieldE: fE, sinkE: sE, residualE: heat + fE + sE, residualL: norm(add(fL, sL)), torque: J };
}

/* ───────── 純関数の確かめ(器が正本に記録し、QA が同じ関数で引き直す) ───────── */
export function checksOf() {
  const g = {}, v = {};
  const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);
  const z = [0, 0, 1];
  const cell = (I, s0, a, wD) => { const sp = splitDrag(wD, a, false, 0); return restoreCell(I, s0, a, sp.wp, sp.q); };
  // ① 例の値(I = 1・Ω_I = ẑ): 横の ω_D = 0.1 x̂ —— 軸のコスト 0.00501243788791・速さ 0.005 / 逆向きの ω_D = −0.1 ẑ —— 軸 0・速さ −0.095 / 横の ω_D = x̂ —— 軸 2 − √2・速さ 0.5
  const c1 = cell(1, 1, z, [0.1, 0, 0]), c2 = cell(1, 1, z, [0, 0, -0.1]), c3 = cell(1, 1, z, [1, 0, 0]);
  v.example = { Eax1: c1.Eax, Esp1: c1.Esp, heat1: c1.heat, Eax2: c2.Eax, Esp2: c2.Esp, heat2: c2.heat, Eax3: c3.Eax, Esp3: c3.Esp };
  g.exampleValues = rel(c1.Eax, 0.00501243788791) < 1e-11 && rel(c1.Esp, 0.005) < 1e-14 && c2.Eax === 0 && rel(c2.Esp, -0.095) < 1e-14 && c2.heat === 0
    && rel(c3.Eax, 2 - Math.SQRT2) < 1e-15 && rel(c3.Esp, 0.5) < 1e-15;
  // ② 素朴な式と一致(中くらいの角・逆行の自転・自転 0)
  let mx = 0;
  for (const [s0, a, wD] of [[0.7, unit([0.2, -0.3, 0.9]), [0.05, 0.11, -0.02]], [-1.3, unit([0.1, 0.4, -0.8]), [-0.3, 0.2, 0.15]], [2, z, [0.4, -0.7, 1.1]]]) {
    const c = cell(1.7, s0, a, wD), nv = restoreNaive(1.7, scale(a, s0), wD);
    mx = Math.max(mx, rel(c.Eax, nv.Eax), rel(c.Esp, nv.Esp), norm(sub(c.Jaxis, nv.Jaxis)) / norm(nv.Jaxis), norm(sub(c.Jspeed, nv.Jspeed)) / Math.max(norm(nv.Jspeed), 1e-300));
  }
  v.naiveMaxRel = mx; g.matchesNaive = mx < 1e-12;
  const c0 = cell(1, 0, z, [0.3, 0, 0.4]);   // Ω_I = 0: â は宣言の軸・s = abs(ω_D) = 0.5 —— 軸のコスト ½abs(0.5 ẑ − ω_D)² = ½(0.09 + 0.01)
  v.zeroSpin = { Eax: c0.Eax, Esp: c0.Esp }; g.zeroSpin = rel(c0.Eax, 0.05) < 1e-15 && rel(c0.Esp, 0.125) < 1e-15;
  // ③ 桁落ち: 小さい平行な ω_D(1e-20)—— 速さの差と速さの復元の力積は二乗の差・大きさの差から作ると 0(全部を失う)・有理化した式は相対 1e-15 以内。
  //   小さい垂直な ω_D(1e-25)の軸のコストは素朴な式でも失わない(垂直な成分の差は丸めない —— 失うのは平行な (s − c∥) だけで q⁴ の大きさ)—— 両方を記録
  const t1 = cell(1, 1, z, [0, 0, 1e-20]), n1 = restoreNaive(1, z, [0, 0, 1e-20]);
  const t2 = cell(1, 1, unit([0.3, 0.4, 0]), [0, 0, 1e-25]), n2 = restoreNaive(1, unit([0.3, 0.4, 0]), [0, 0, 1e-25]);
  v.tiny = { speedStable: t1.Esp / 1e-20, speedNaive: n1.Esp / 1e-20, speedJStable: t1.Jspeed[2] / -1e-20, speedJNaive: n1.Jspeed[2] / -1e-20,
    axisStable: t2.Eax / 0.5e-50, axisNaive: n2.Eax / 0.5e-50 };
  g.noCancellation = rel(v.tiny.speedStable, 1) < 1e-15 && rel(v.tiny.speedJStable, 1) < 1e-15 && rel(v.tiny.axisStable, 1) < 1e-15
    && v.tiny.speedNaive === 0 && v.tiny.speedJNaive === 0;
  // ④ 復元の力積の和 = −I ω_D・実際の軸の仕事は 0(丸め床)
  let js = 0, aw = 0;
  for (const [s0, a, wD] of [[0.7, unit([0.2, -0.3, 0.9]), [0.05, 0.11, -0.02]], [-1.3, unit([0.1, 0.4, -0.8]), [-0.3, 0.2, 0.15]], [1, z, [1e-9, 2e-9, -3e-9]]]) {
    const c = cell(2.5, s0, a, wD);
    js = Math.max(js, norm(add(add(c.Jaxis, c.Jspeed), scale(wD, 2.5))) / (2.5 * norm(wD)));
    aw = Math.max(aw, Math.abs(c.axisWork) / (0.5 * 2.5 * c.s * c.s));
  }
  v.impulseSumRel = js; v.axisWorkRel = aw; g.impulseSum = js < 1e-15; g.axisWorkZero = aw < 1e-15;
  // ⑤ 口座: 場 + 受け皿 + 熱 = 0(L・E)—— 正の E_speed と負の E_speed(逆向きの引きずり —— 供給)
  let rl = 0, re = 0;
  for (const wD of [[0.1, -0.05, 0.2], [0.02, 0.01, -0.3]]) {
    const q = accountStep(1.3, 0.9, unit([0.1, 0.2, 0.97]), wD, false, 0, 0.37);
    rl = Math.max(rl, norm(add(q.fieldL, q.sinkL)) / norm(q.fieldL)); re = Math.max(re, Math.abs(q.heat + q.fieldE + q.sinkE) / Math.max(q.heat, Math.abs(q.fieldE), 1e-300));
  }
  v.accountL = rl; v.accountE = re; g.accountsClose = rl < 1e-15 && re < 1e-15;
  // ⑥ 赤道の歯車の配置(受け手の軸に沿う逆向きの ω_D —— 傾きを持たない受け手の型): 軸のコスト 0・熱は max(E_speed, 0)・abs(σ) < 2s なら E_speed < 0(供給)
  const gr = accountStep(1, 0.8, z, null, true, -0.05, 1), gr2 = accountStep(1, 0.8, z, null, true, 0.05, 1);
  v.gear = { retro: { Eax: gr.cell.Eax, Esp: gr.cell.Esp, heat: gr.heat, supply: gr.supply }, pro: { Eax: gr2.cell.Eax, Esp: gr2.cell.Esp, heat: gr2.heat } };
  g.gearAxisZero = gr.cell.Eax === 0 && gr2.cell.Eax === 0 && gr.heat === 0 && rel(gr.supply, 0.03875) < 1e-14 && rel(gr2.heat, 0.04125) < 1e-14;
  // ⑦ 熱の時間の型: 一定の ω_D を T = 1 のあいだ h = 1・½・¼・⅛ —— "step" は 1・2・4・8 倍・{tauHold: 1} は不変
  const scan = [1, 0.5, 0.25, 0.125].map((h) => ({ h, step: constantRun({ I: 1, s0: 1, a: z, wD: [0.1, 0, 0], T: 1, h, heatTiming: 'step' }),
    hold: constantRun({ I: 1, s0: 1, a: z, wD: [0.1, 0, 0], T: 1, h, heatTiming: { tauHold: 1 } }) }));
  v.scan = scan.map((r) => ({ h: r.h, heatStep: r.step.heat, heatHold: r.hold.heat, torque: r.step.torque }));
  g.stepScalesInvH = scan.every((r) => rel(r.step.heat / scan[0].step.heat, 1 / r.h) < 1e-14);
  g.holdInvariant = scan.every((r) => rel(r.hold.heat, scan[0].hold.heat) < 1e-14) && rel(scan[0].hold.heat, scan[0].step.heat) < 1e-15;
  // ⑧ 逆行の自転(s0 < 0 —— â_I = −â): Ω_I に沿う ω_D は E_speed > 0
  const rv = cell(1, -1, z, [0, 0, -0.1]);
  v.retrograde = { Eax: rv.Eax, Esp: rv.Esp }; g.retrogradeSign = rv.Eax === 0 && rel(rv.Esp, 0.105) < 1e-14;
  const pass = Object.values(g).every((x) => x === true);
  return { pass, gates: g, values: v, n: Object.keys(g).length };
}

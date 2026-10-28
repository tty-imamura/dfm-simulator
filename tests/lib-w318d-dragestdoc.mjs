// 第318便d(原仮定者の指示(第120報)「引きずりについて」・決断事項 AN438・統括の検証項目 R257):
// **PHYSICS〔第318便d〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.dragEst318d が PHYSICS〔第318便d〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(刻みの差・規則の節点の式との差・丸めの床は fmtFloor の床)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
import { KPC, MSUN, DECL, LIT, BODY16 } from './lib-w318d-dragest.mjs';
export const DOC_LIB_VERSION = 'w318d-dragestdoc-1';

const fl = (x, floor) => fmtFloor(Math.abs(x), floor, 2);
const yn = (b) => (b ? '真' : '偽');
const km = (v) => fx(v / 1e3, 1);
const kp = (r) => ex(r / KPC, 3);
const MODEL_JA = Object.freeze({ one: '1 つの源(中心)', rings: '8 環 × 16', grid16x32: '格子 16 × 32', grid32x64: '格子 32 × 64' });
export const modelJa = (k) => MODEL_JA[k] || k;

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersDragEst(J) {
  const m1 = J.B.models[0], ml = J.B.models[J.B.models.length - 1], F = J.F;
  return [ex(J.A.betaGEngine, 4), ex(J.A.uniform, 3), ex(J.A.rows[J.A.rows.length - 1].duOverV, 3),
    kp(m1.best.Rtot), ex(m1.MdragSun, 3), ex(m1.ratioVis, 3), kp(m1.inner.Rtot), kp(m1.outer.Rtot), ex(ml.ratioVis, 3), String(ml.nSrc),
    ex(J.DE.venus.omSun, 3), ex(J.DE.venus.ratio, 2), ex(J.DE.jupiter.sun.omAbs, 3), ex(J.DE.jupiter.Preq, 3),
    fx(F.spread.nowSolar, 2), fx(F.spread.cand1All, 2), fx(J.C.angles.angLDeg, 1), fx(J.C.angles.angEclNorthDeg, 1)];
}

export function physicsTablesDragEst(J) {
  const out = [], A = J.A, B = J.B, C = J.C, DE = J.DE, F = J.F, Dr = J.Drun;
  // A
  out.push('| 銀河の並進(宣言の源) | 値 |', '|---|---|',
    `| M_G = V0²R0/G_0 [M☉] | ${ex(A.decl.MGsun, 4)} |`, `| R_d,G = Y_k M_G [m] | ${ex(A.decl.RdG, 4)} |`,
    `| β_G の閉じた式 C_1 R_d,G/R0 = 10 V0²/c_0² | ${ex(A.beta0C1, 4)} |`, `| β_G の読み口(1 au・中心の向き) | ${ex(A.betaGEngine, 4)} |`,
    `| 一様な分 β_G V0 [m/s] | ${ex(A.uniform, 3)} |`, `| 読み口と規則の節点の式 (R_d/r) g(x) の相対の差の最大 | ${fl(A.ruleCheck, 1e-12)} |`, `| 規則の節点(次数 8)の g(0) と C_1 の相対の差 | ${ex(A.gRule0RelC1, 2)} |`,
    `| 読み口と節点の和の写しの差の最大 | ${A.replica.worst === 0 ? '0' : fl(A.replica.worst, 1e-15)} |`);
  out.push('', '| 受け手の距離 [au] | β_G(読み口・中心の向き) | β_☉/β_G | Δβ(中心の向き − 逆の向き) | 2 β_G r/R0 | Δu = Δβ V0 [m/s] | 公転の速さ v [m/s] | Δu/v | 受け手の速さに比例する分 β_G v [m/s] |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of A.rows) out.push(`| ${r.rAu} | ${ex(r.toward.betaG, 4)} | ${ex(r.betaSunOverG, 3)} | ${ex(r.dBeta, 3)} | ${ex(r.dBetaLin, 3)} | ${ex(r.du, 3)} | ${ex(r.vOrb, 4)} | ${ex(r.duOverV, 3)} | ${ex(r.selfPart, 3)} |`);
  // B
  const V = B.visible;
  out.push('', '| NGC 3198 の見える質量の模型 | 値 |', '|---|---|',
    `| 星 M_* = Υ L_3.6(Υ = ${B.data.ups})[M☉] | ${ex(V.Mst / MSUN, 4)} |`, `| ガス 1.33 M_HI [M☉] | ${ex(V.Mgas / MSUN, 4)} |`, `| M_vis [M☉] | ${ex(V.MvisSun, 4)} |`,
    `| ガスの面密度の表の面積分 / 1.33 M_HI | ${fx(V.MgasRaw / V.Mgas, 4)} |`, `| 星の円盤の環の和と Freeman の閉じた式の V² の相対の差の最大 | ${fl(V.freemanRelMax, 1e-6)} |`,
    `| 源の自転率 Ω_src = V_flat/R_s [rad/s] | ${ex(B.decl.OmSrc, 4)} |`,
    `| 1 点の照合(1 つの源・r = ${B.check.rKpc} kpc)の u_φ と β の読み口との相対の差 | ${fl(B.check.relU, 1e-12)}・${fl(B.check.relBeta, 1e-12)} |`);
  out.push('', '| r [kpc] | V_obs [km/s] | e_V [km/s] | V_* [km/s] | V_gas(符号は V² の符号)[km/s] | V_bar [km/s] | u_req = V − V_bar²/V [km/s] | σ_u [km/s] |', '|---|---|---|---|---|---|---|---|');
  B.req.forEach((p, k) => { if (k % 6 === 0 || k === B.req.length - 1) out.push(`| ${p.rKpc} | ${km(p.V)} | ${km(p.eV)} | ${km(p.Vst)} | ${km(p.Vgas)} | ${km(p.Vbar)} | ${km(p.uReq)} | ${km(p.sigU)} |`); });
  out.push('', '| 源の粒度 | 源の数 | 最良の R_tot [kpc] | 要素の R_d [kpc] | M_drag = R_tot/Y_k [M☉] | M_drag/M_vis | 内側(r < 5 kpc)だけ [kpc] | 外側(r > 15 kpc)だけ [kpc] | 内側/外側 | χ²/点 | 残差/σ の平均(内側・外側) | R_d の内の点 | Σβ の最大 | 重力の質量と読む速さ/c_0(最外の点) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const m of B.models) out.push(`| ${modelJa(m.key)} | ${m.nSrc} | ${kp(m.best.Rtot)} | ${ex(m.RdPerSrcKpc, 3)} | ${ex(m.MdragSun, 3)} | ${ex(m.ratioVis, 3)} | ${kp(m.inner.Rtot)} | ${kp(m.outer.Rtot)} | ${fx(m.innerOverOuter, 3)} | ${fx(m.chi2PerPt, 1)} | ${fx(m.resInner, 2)}・${fx(m.resOuter, 2)} | ${m.nInside}/${m.rows.length} | ${fx(m.betaMax, 4)} | ${ex(m.vGravDragOverC, 2)} |`);
  out.push('', '| 源の数 N(同じ全質量の N 等分) | 遠方の回転の項 Σ m R_d² Ω の比 1/N² | 弱い場の極限で要る M_drag の倍率 N^(2/3) | 最小二乗の M_drag の倍率(数値の和 —— 1 つの源に対して) |', '|---|---|---|---|');
  for (const m of B.models) out.push(`| ${m.nSrc} | ${ex(1 / (m.nSrc * m.nSrc), 3)} | ${ex(Math.pow(m.nSrc, 2 / 3), 3)} | ${ex(m.Mdrag / B.models[0].Mdrag, 3)} |`);
  // C
  const Ag = C.angles;
  out.push('', '| 天体(16 体の入力 —— J2000) | spin の符号 | 符号つきの自転と ĝ の角 [°] | 90° を超える | 独立の数 |', '|---|---|---|---|---|');
  for (const r of Ag.rows) out.push(`| ${r.name} | ${r.spinSign > 0 ? '+' : '−'} | ${fx(r.angDeg, 1)} | ${yn(r.anti)} | ${r.sat ? '数えない(' + BODY16[r.parent] + 'の衛星)' : '数える'} |`);
  const gs = C.galaxySource;
  out.push('', '| 銀河の軸 | 値 |', '|---|---|',
    `| ĝ(南銀極)の J2000 の黄道座標 λ・β [°] | ${fx(Ag.gEcl.lambdaDeg, 2)}・${fx(Ag.gEcl.betaDeg, 2)} |`,
    `| 16 体の重心系の公転の角運動量の和と ĝ の角 [°] | ${fx(Ag.angLDeg, 1)} |`, `| 黄道の北極と ĝ の角 [°] | ${fx(Ag.angEclNorthDeg, 1)} |`,
    `| 90° を超える数(16 体・衛星を数えない ${Ag.nIndep} 体) | ${Ag.nAnti}/${Ag.nAll}・${Ag.nAntiIndep}/${Ag.nIndep} |`,
    `| 一様な ω_G = Ω_ref ĝ の歳差で地球の軸を太陽系の年齢だけ回した a·ĝ の変化(1e5 步・回した角 ${fx(C.precession.turnRad, 1)} rad) | ${fl(C.precession.dDot, 1e-11)} |`,
    `| 逆向きへ寄せる散逸の率 1/τ(τ = 太陽系の年齢 —— 宣言)[1/s]・Ω_ref との比 | ${ex(C.alignRate, 3)}・${ex(C.alignRateOverOmRef, 3)} |`,
    `| 銀河を一つの K1 の源(M_G・R0・自転 Ω_ref の軸 ĝ)とした太陽の位置の軸の ω [rad/s]・ĝ との角 [°] | ${ex(gs.omSun, 3)}・${fx(gs.angOmGDeg, 1)} |`,
    `| 同じ写しの 1 au の受け手の軸の ω [rad/s]・Ω_ref との比(太陽)・太陽系の年齢の角 [rad] | ${ex(gs.omEarth, 3)}・${ex(gs.overOmRef, 3)}・${ex(gs.angleAge, 3)} |`,
    `| 一様軸 galaxyAxial(K1 の型)の受け手の係数の 1 からの差の最大(16 体) | ${fl(C.uniformResponse.devMax, 1e-15)} |`);
  // D
  out.push('', '| 惑星(16 体の写し・t = 0) | 太陽からの距離 [au] | abs(u_rot)(読み口)[m/s] | 規則の節点の式との相対の差 | abs(u_rot)/v | 回転の率 ω_rot [rad/s] | 太陽系の年齢の角 [rad] |', '|---|---|---|---|---|---|---|');
  for (const r of DE.D.rows) out.push(`| ${r.name} | ${fx(r.rAu, 3)} | ${ex(r.uRot, 3)} | ${fl(r.rel, 1e-12)} | ${ex(r.uOverV, 3)} | ${ex(r.wRot, 3)} | ${ex(r.angleAge, 3)} |`);
  const wMe = DE.D.rows[0].wRot;
  out.push('', `| 測る形の試し(太陽 + 水星・公転面を ${DECL.dRuns.tiltRad} rad 傾ける・${Dr.orbits} 公転) | 値 |`, '|---|---|',
    `| 回転の引きずりの有無の傾斜の差・交点の差(h)[rad] | ${fl(Dr.dIncRot, 1e-17)}・${fl(Dr.dNodeRot, 1e-17)} |`,
    `| 有無の状態がビット同一(h・h/2) | ${yn(Dr.bitSameH)}・${yn(Dr.bitSameH2)} |`,
    `| 刻みの差 h − h/2 の傾斜・交点(引きずりなし)[rad] | ${fl(Dr.dIncStep, 1e-13)}・${fl(Dr.dNodeStep, 1e-13)} |`,
    `| 今の回転の率 ω_rot(水星)× 走行の時間(${Dr.orbits} 公転)[rad] | ${ex(wMe * Dr.orbits * Dr.pSec, 2)} |`,
    `| 公転面の傾斜の復元に要る率(太陽系の年齢で ${DE.D.tiltDeg}° —— 仮定の型)[rad/s] | ${ex(DE.D.tiltReq, 3)} |`);
  // E
  const v = DE.venus, j = DE.jupiter;
  out.push('', '| 金星(16 体の写し・t = 0) | 値 |', '|---|---|',
    `| 太陽 → 金星の軸の ω [rad/s](全源の和に対する太陽の分) | ${ex(v.omSun, 3)}(${fx(v.sunShare, 6)}) |`,
    `| 軸を π 回すのに要る abs(ω)(仮の期間 ${DECL.venusPeriodGyr} Gyr)[rad/s]・比 | ${ex(v.omReq, 3)}・${ex(v.ratio, 2)} |`,
    `| 太陽系の年齢で今の ω が回す角 [rad] | ${ex(v.turnAge, 3)} |`,
    `| ω と太陽の自転の軸の角 [°] | ${fx(v.angOmSunAxisDeg, 1)} |`,
    `| 今の金星の符号つきの自転の向き·ω̂・共通の初期の向き(太陽の自転の向き)·ω̂ | ${fx(v.dotNow, 4)}・${fx(v.dotCommon, 4)} |`);
  out.push('', '| 木星の項(maintain の帳簿の式・I = 0.5 m R²) | abs(ω) [rad/s] | E_axis^cost [J] | E_speed [J] | Q = E_ax + max(E_speed, 0) [J] | P = Q/h₀ [W] | 要る τ_hold = Q/P_req [s] | 受理の範囲の内 | (b) 減速の分も熱 P [W] | (b) 要る τ_hold [s] |', '|---|---|---|---|---|---|---|---|---|---|');
  const jr = (lab, c) => out.push(`| ${lab} | ${ex(c.omAbs !== undefined ? c.omAbs : c.factor, 3)} | ${ex(c.Eax, 3)} | ${ex(c.Esp, 3)} | ${ex(c.Q, 3)} | ${ex(c.Pnow, 3)} | ${ex(c.tauReq, 3)} | ${yn(c.tauReqInRange)} | ${ex(c.PabsNow, 3)} | ${ex(c.tauReqAbs, 3)} |`);
  jr('太陽の項(今の K1)', j.sun); jr('銀河の項(ω_G = Ω_ref ĝ —— 尺度だけ)', j.galaxy);
  jr('候補 (i) 太陽の項 × (R☉/R_d,☉)²', Object.assign({}, j.cand.spinR, { omAbs: j.sun.omAbs * j.cand.spinR.factor }));
  jr('候補 (ii) 太陽の項 × (R☉/R_d,☉)²·(5/2)k☉', Object.assign({}, j.cand.spinJ, { omAbs: j.sun.omAbs * j.cand.spinJ.factor }));
  out.push('', '| 木星の熱と自転の収支 | 値 |', '|---|---|',
    `| 要る電力 P_req = 熱流 × 4πR²(${LIT.jupiterFlux.value} W/m² —— 文献の値)[W]・対照(${LIT.jupiterFluxAlt.value} W/m²)| ${ex(j.Preq, 3)}・${ex(j.PreqAlt, 3)} |`,
    `| τ_hold の規約 h₀(16 体の本の基準の刻み)[s] | ${ex(j.h0, 4)} |`, `| 太陽の項の ω と木星の自転の向きの角 [°] | ${fx(j.angOmSpinDeg, 1)} |`,
    `| 自転のエネルギー ½ I Ω² [J]・P_req で尽きる時間 [Gyr] | ${ex(j.spinBudget.Erot, 3)}・${fx(j.spinBudget.tSpin / (1e9 * 365.25 * 86400), 2)} |`,
    `| 要るトルク P_req/Ω [N m]・自転の相対の減速の率 [1/s] | ${ex(j.spinBudget.torque, 3)}・${ex(j.spinBudget.spinDownRate, 3)} |`);
  // F
  out.push('', '| 仮定(第120報) | 要る大きさ | 今の K1 | 比(今/要る) | 候補 (i) R_d,spin = 観測半径 の比 | 候補 (ii) J を別の入力 の比 | 差を埋める規則の部分の候補 |', '|---|---|---|---|---|---|---|');
  for (const r of F.rows) {
    const req = r.key === 'A' ? '0(規約)' : ex(r.req, 3), now = ex(r.now, 3), ratio = r.ratio === null ? '—' : ex(r.ratio, 2);
    const c1 = r.cand1Ratio === undefined ? (r.noSelect ? '歳差の形では選ばない' : '—') : ex(r.cand1Ratio, 2), c2 = r.cand2Ratio === undefined ? (r.noSelect ? '歳差の形では選ばない' : '—') : ex(r.cand2Ratio, 2);
    out.push(`| ${r.ja} | ${req} | ${now} | ${ratio} | ${c1} | ${c2} | ${r.part} |`);
  }
  out.push('', '| 比の広がり(log10 の最大 − 最小)[dex] | 今 | 候補 (i) | 候補 (ii) |', '|---|---|---|---|',
    `| 太陽が源の 3 行(水星の公転面・金星・木星 (b)) | ${fx(F.spread.nowSolar, 2)} | ${fx(F.spread.cand1Solar, 2)} | ${fx(F.spread.cand2Solar, 2)} |`,
    `| 3 行 + ハロー | — | ${fx(F.spread.cand1All, 2)} | ${fx(F.spread.cand2All, 2)} |`);
  return out.join('\n');
}

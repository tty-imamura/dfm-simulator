// 第282便c(原仮定者の裁定(第72報)④「較正は引きずりパラメータで行い、天体種別と相対自転で分けて観測値に合わせる。
// 中心密度が高い場合、計算で使う半径は外殻の半径をそのままでは使えない」・統括の読み R80)—— **引きずりプロファイルの純関数**。
//
// ■ 何を持つか(**エンジンへは接続しない** —— html の力学・S._core は 1 バイトも変えない。どの内蔵本の物理も変えない)
//   (a) `dragRadius(profile, P)` … 第280便b の密度クラス(solid 2 層 / gas (1−s²)^β / star Lane–Emden / compact 一様)から
//       M=4π∫ρr²dr・I=(8π/3)∫ρr⁴dr を Gauss–Legendre で積み、**R_drag=√(5I/(2M))**(一様球で R_drag=R・中心集中で R 未満)。
//       **宣言した近似**であって表裏核(第280便b)の厳密解ではない。密度の形 ρ(s) は html の `dfmSphereRho`(宣言された物理入力)を
//       ソースから取り出して読み(写しを持たない)、求積点は html の `dfmGaussLegendre01`。
//       NS/BH(compact)は外殻の密度積分を強制せず、**コア半径の宣言** `coreRadius` があればそれを R_drag とする(fit して外殻へ戻さない)。
//   (b) `relativeSpin(bodyI, bodyJ)` … Ω_orb=(r×v_rel)_z/r²・ΔΩ=Ω_j·cosθ_j − Ω_orb(j が源・cosθ は自転軸の軌道法線への射影 —— 既定 1)。
//       v_rel は**与えた速度の差**(慣性速度差か座標速度差かは法則版に明記する —— 未決)。
//   (c) `spinChannel(A, q, R_drag, ΔΩ, r)` = A ΔΩ (R_drag/(R_drag+|r|))^q e_z×r —— **相対自転チャネルの候補式(現象論・未実証)**。
//       同期(ΔΩ=0)で消えるのは**このチャネルだけ**(背景・並進・他の天体の寄与は消えない)。
//   (d) `runUnitTests(P)` … 極限の単体試験(同期で 0・逆回転で符号反転・遠方で ∝ R_drag^q/r^q・A=0 で 0・一様球で R_drag=R・
//       解析解との一致・縮退の実測)。
//   (e) `profileOf(preset, P)` … 内蔵本から {bodyType, relativeSpin, R_drag, A_type, q_type, profileVersion:"w282c-1"} を読む
//       (宣言が無い本は profile:null と理由)。**preset の鍵は足さない**(読むのは既存の densityClass・radius・spin・core・dragQ だけ)。
//   (f) `diagRows(preset, meta)` … 診断表の行(現状の q・kFrame・自転の代理値・外殻半径 R・密度クラス・R_drag・ΔΩ の符号)。
//   (g) `measureAll(HP, DT, html, P)` … 器 tests/exp-w282c-dragprofile.mjs と QA docs.dragProfile が**同じ関数**で実測する一式
//       (kF0 不感 4 条件 × 2 種・kFrame=1 の対照・門の文字列・単体試験・参照表・診断表・🌓)。エンジンは html の本文そのまま
//       (headless)で、書き換えるのは関数の中で作ったコピーの physics.kFrame・geoPN・q と body.dragQ だけ。
//
// ■ しないこと
//   ・fit しない・A_type/q_type の値を置かない(観測に合わせるのは第283便以降 1 本ずつ)・天体種別ごとの係数を根拠なく置かない。
//   ・2D の I=mR²/2(エンジンの Imom)を 3D の I に代入しない(3D の I は密度の積分から)。
//   ・人為的な境界で引きずりを切らない(候補式は遠方で冪で減るだけ)。
import crypto from 'node:crypto';
import { makePure as makeSpherePure } from './lib-w280b-sphereKernel.mjs';

export const DRAGPROFILE_VERSION = 'w282c-1';
/** bodyType は第280便b の densityClass と同じ 4 語(固体/気体/恒星/コンパクト)。 */
export const BODY_TYPES = ['solid', 'gas', 'star', 'compact'];
export const BODY_TYPE_JA = { solid: '固体', gas: '気体', star: '恒星', compact: 'コンパクト' };
/** 相対自転の**表示分類**の宣言(|ΔΩ| ≤ 1% × 基準の角速度〔接触軌道の平均運動 n・無ければ瞬時の Ω_orb〕を「同期」と読む —— 物理に入らない・生の比は常に併記する)。 */
export const SYNC_REL_TOL = 1e-2;
/** 求積の既定(区間あたりの点数 × 各区間の等分数)と、収束の確認に使う細かい求積。 */
export const QUAD_DEFAULT = { nodes: 32, panels: 64 };
export const QUAD_FINE = { nodes: 64, panels: 128 };
/** Lane–Emden n=3 の ρ_c/ρ̄ の文献値(Chandrasekhar 1939 の表)—— 比較のためだけに持つ(判定の閾値ではない)。 */
export const LE_N3_RHOC_OVER_MEAN_LIT = 54.1825;

/** html から第280便b の純関数を取り出す(lib-w280b-sphereKernel の makePure と同じ —— 写しを持たない)。 */
export function makePure(html) { return makeSpherePure(html); }

const fin = (v) => typeof v === 'number' && Number.isFinite(v);

/** 宣言 {densityClass, densityProfile, rotationProfile} だけを取り出す(dfmSphereProfile の入力)。 */
function declOf(profile) {
  const cls = profile.densityClass !== undefined ? profile.densityClass : profile.bodyType;
  const d = { densityClass: cls };
  if (profile.densityProfile !== undefined) d.densityProfile = profile.densityProfile;
  return d;
}

/**
 * (a) 引きずり専用の有効半径 R_drag=√(5I/(2M))(球対称の剛体回転 ρ(r) —— **宣言した近似**)。
 * @param {object} profile {R, densityClass|bodyType, densityProfile?, coreRadius?}
 * @param {object} P makePure(html) の戻り
 * @param {object} [q] {nodes, panels}(既定 QUAD_DEFAULT)
 * @returns {{ok:boolean, R_drag?:number, ratio?:number, kI?:number, rhoCenterOverMean?:number, source?:string, reason?:string}}
 */
export function dragRadius(profile, P, q) {
  if (!profile || typeof profile !== 'object') return { ok: false, reason: 'プロファイルが無い' };
  const R = profile.R;
  if (!(fin(R) && R > 0)) return { ok: false, reason: '外殻半径 R が正の有限数でない' };
  const cls = profile.densityClass !== undefined ? profile.densityClass : profile.bodyType;
  if (BODY_TYPES.indexOf(cls) < 0) return { ok: false, reason: 'densityClass(bodyType)は solid/gas/star/compact' };
  if (profile.coreRadius !== undefined) {
    if (cls !== 'compact') return { ok: false, reason: 'コア半径の宣言は compact(NS/BH)だけ —— 他のクラスは密度の積分で R_drag を出す' };
    if (!(fin(profile.coreRadius) && profile.coreRadius > 0 && profile.coreRadius <= R)) return { ok: false, reason: 'coreRadius は 0 < coreRadius ≤ R' };
    return { ok: true, R_drag: profile.coreRadius, ratio: profile.coreRadius / R, kI: null, rhoCenterOverMean: null,
      source: 'declaredCore', note: '外殻の密度積分を強制しない(宣言値 —— fit して外殻へ戻さない)' };
  }
  const pr = P.dfmSphereProfile(declOf(profile), 64);
  if (!pr || pr.ok !== true) return { ok: false, reason: '密度の宣言を受理できない: ' + ((pr && pr.err) || '?') };
  const nodes = (q && q.nodes) || QUAD_DEFAULT.nodes, panels = (q && q.panels) || QUAD_DEFAULT.panels;
  const G = P.dfmGaussLegendre01(nodes);
  const br = [0].concat(pr.breaks || [], [1]);
  let mH = 0, iH = 0;
  for (let b = 0; b < br.length - 1; b++) {
    const a0 = br[b], a1 = br[b + 1];
    for (let k = 0; k < panels; k++) {
      const lo = a0 + (a1 - a0) * k / panels, hi = a0 + (a1 - a0) * (k + 1) / panels, h = hi - lo;
      for (let t = 0; t < nodes; t++) {
        const s = lo + h * G.x[t], w = h * G.w[t], rho = P.dfmSphereRho(pr, s), s2 = s * s;
        mH += w * 4 * Math.PI * rho * s2;
        iH += w * (8 * Math.PI / 3) * rho * s2 * s2;
      }
    }
  }
  if (!(mH > 0)) return { ok: false, reason: '質量の積分が正でない' };
  const kI = iH / mH;                                   // I/(MR²)
  const ratio = Math.sqrt(2.5 * kI);                    // R_drag/R = √(5I/(2MR²))
  const rhoMean = mH / (4 * Math.PI / 3);               // 同じ正規化での平均密度
  return { ok: true, R_drag: R * ratio, ratio, kI, rhoCenterOverMean: P.dfmSphereRho(pr, 0) / rhoMean,
    kIHtml: pr.kI, source: 'densityIntegral', nodes, panels, params: pr.params,
    definition: 'R_drag=√(5I/(2M))・M=4π∫ρr²dr・I=(8π/3)∫ρr⁴dr(宣言した近似 —— 表裏核の厳密解ではない)' };
}

/* ─────────────── 解析解(独立な検算 —— html の求積を使わない) ─────────────── */
/** gas (1−s²)^β: I/(MR²)=2/(2β+5)(ベータ関数の比)。 */
export function gasKIExact(beta) { return 2 / (2 * beta + 5); }
/** gas の ρ_c/ρ̄ = 1/(3∫s²(1−s²)^β ds)(β が整数のとき —— B(3/2,β+1) の漸化式)。 */
export function gasRhoCExact(beta) {
  if (!(Number.isInteger(beta) && beta >= 0)) return null;
  let B = 2 / 3;                                        // B(3/2,1)
  for (let b = 1; b <= beta; b++) B *= b / (b + 1.5);   // B(3/2,b+1)=B(3/2,b)·b/(b+3/2)
  return 1 / (3 * 0.5 * B);
}
/** solid 2 層(核 s<f で c 倍): I/(MR²)=0.4·(1+(c−1)f⁵)/(1+(c−1)f³)。 */
export function solidKIExact(f, c) { return 0.4 * (1 + (c - 1) * f ** 5) / (1 + (c - 1) * f ** 3); }
export function solidRhoCExact(f, c) { return c / (1 + (c - 1) * f ** 3); }

/* ─────────────── (b) 相対自転 ─────────────── */
function senseOf(sz, omRef, tol) {
  if (sz === 0) return 'nonRotating';
  if (omRef === 0) return 'noOrbit';
  const dO = sz - omRef;
  if (Math.abs(dO) <= tol * Math.abs(omRef)) return 'sync';
  if (sz / omRef < 0) return 'counter';
  return sz / omRef > 1 ? 'faster' : 'slower';
}
/**
 * @param {object} bodyI 軌道の相手(x,y,vx,vy)
 * @param {object} bodyJ 源(x,y,vx,vy,spin, 任意 spinAxisCos)
 * @param {object} [o] {tol(表示分類の許容 —— 既定 SYNC_REL_TOL), GM(G(m_i+m_j) —— 与えれば接触軌道の平均運動 n も出す)}
 *   ΔΩ は定義どおり**瞬時の** Ω_orb=(r×v_rel)_z/r² に対する値。離心軌道では瞬時の Ω_orb と平均運動 n が違うので、
 *   **表示の分類(sense)は n があれば n で行う**(潮汐ロックは平均運動に対する同期 —— 瞬時値は定義どおり併記)。
 */
export function relativeSpin(bodyI, bodyJ, o) {
  const tol = (o && fin(o.tol)) ? o.tol : SYNC_REL_TOL;
  for (const b of [bodyI, bodyJ]) for (const k of ['x', 'y', 'vx', 'vy']) if (!b || !fin(b[k])) return { ok: false, reason: '位置・速度が有限数でない(' + k + ')' };
  if (!fin(bodyJ.spin)) return { ok: false, reason: '源の自転 spin が有限数でない' };
  const rx = bodyI.x - bodyJ.x, ry = bodyI.y - bodyJ.y, r2 = rx * rx + ry * ry;
  if (!(r2 > 0)) return { ok: false, reason: '距離 0' };
  const vx = bodyI.vx - bodyJ.vx, vy = bodyI.vy - bodyJ.vy;
  const omegaOrb = (rx * vy - ry * vx) / r2;
  const cosAx = fin(bodyJ.spinAxisCos) ? bodyJ.spinAxisCos : 1;
  const sz = bodyJ.spin * cosAx;
  const dOmega = sz - omegaOrb;
  const ratio = omegaOrb !== 0 ? dOmega / omegaOrb : null;
  const out = { ok: true, omegaOrb, spinZ: sz, spinAxisCos: cosAx, dOmega, sign: Math.sign(dOmega), ratio,
    senseInst: senseOf(sz, omegaOrb, tol), omegaMean: null, dOmegaMean: null, ratioMean: null,
    vRel: 'as-given(慣性速度差か座標速度差かは法則版に明記する —— 未決)' };
  if (o && fin(o.GM) && o.GM > 0) {
    const inva = 2 / Math.sqrt(r2) - (vx * vx + vy * vy) / o.GM;   // vis-viva
    if (inva > 0) {
      const n = Math.sqrt(o.GM * inva * inva * inva) * Math.sign(omegaOrb || 1);
      out.omegaMean = n; out.dOmegaMean = sz - n; out.ratioMean = (sz - n) / n;
    }
  }
  out.sense = out.omegaMean !== null ? senseOf(sz, out.omegaMean, tol) : out.senseInst;
  out.senseBasis = out.omegaMean !== null ? 'meanMotion' : 'instantaneous';
  return out;
}
/** 連星の分類: 両方同期 → 同期 / 片方 → 片側ロック / どちらも → 自由。 */
export function pairLockClass(senseA, senseB) {
  const a = senseA === 'sync', b = senseB === 'sync';
  return a && b ? 'sync' : (a || b ? 'oneSideLocked' : 'free');
}
export const LOCK_JA = { sync: '同期', oneSideLocked: '片側ロック', free: '自由' };

/* ─────────────── (c) 相対自転チャネルの候補式(現象論・未実証) ─────────────── */
/**
 * u^spin_{j→i} = A ΔΩ (R_drag/(R_drag+|r|))^q e_z×r(r は源 j から点 i へ)。
 * @returns {{ok:boolean, u?:number[], f?:number, omegaU?:number, status:string}}
 */
export function spinChannel(A, q, rDrag, dOmega, r) {
  const status = '候補式(現象論・未実証)';
  if (![A, q, rDrag, dOmega].every(fin) || !Array.isArray(r) || !fin(r[0]) || !fin(r[1])) return { ok: false, status, reason: '入力が有限数でない' };
  if (!(rDrag > 0 && q > 0)) return { ok: false, status, reason: 'R_drag>0・q>0' };
  const d = Math.hypot(r[0], r[1]);
  const f = Math.pow(rDrag / (rDrag + d), q);
  const om = A * dOmega * f;                            // 移送の角速度
  return { ok: true, u: [-om * r[1], om * r[0]], f, omegaU: om, status };
}

/* ─────────────── (d) 単体試験 ─────────────── */
const relD = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
/** 密度クラスの参照表(第280便b の 4 クラス + ポリトロープ 3 種)。 */
export const CLASS_TABLE = [
  { key: 'compact', decl: { densityClass: 'compact' } },
  { key: 'gas-b0', decl: { densityClass: 'gas', densityProfile: { beta: 0 } } },
  { key: 'solid', decl: { densityClass: 'solid', densityProfile: { coreFrac: 0.546, coreRatio: 2.44 } } },
  { key: 'gas-b1', decl: { densityClass: 'gas', densityProfile: { beta: 1 } } },
  { key: 'gas-b3', decl: { densityClass: 'gas', densityProfile: { beta: 3 } } },
  { key: 'star-n1', decl: { densityClass: 'star', densityProfile: { polyN: 1 } } },
  { key: 'star-n1.5', decl: { densityClass: 'star', densityProfile: { polyN: 1.5 } } },
  { key: 'star-n3', decl: { densityClass: 'star', densityProfile: { polyN: 3 } } },
];
/** 参照表: R_drag/R・I/(MR²)・ρ_c/ρ̄・2D の Imom(½mR²)に対する 3D の I の比(2·kI)・細かい求積との差・html の kI との差。 */
export function classTable(P) {
  return CLASS_TABLE.map((c) => {
    const a = dragRadius(Object.assign({ R: 1 }, c.decl), P, QUAD_DEFAULT);
    const b = dragRadius(Object.assign({ R: 1 }, c.decl), P, QUAD_FINE);
    return { key: c.key, decl: c.decl, ratio: a.ratio, kI: a.kI, rhoCenterOverMean: a.rhoCenterOverMean,
      i3dOverImom2d: 2 * a.kI, fineDiff: relD(a.ratio, b.ratio), htmlKIDiff: relD(a.kI, a.kIHtml) };
  });
}

/** 単体試験の行 {id, pass, …}(判定の許容はここに宣言 —— QA は同じ関数を呼ぶ)。 */
export const UNIT_TOL = 1e-12;
/** Lane–Emden の数値解(html の RK4・刻み 10⁻³)を閉じた解と比べる許容(積分器の精度の確認 —— 物理の係数ではない)。 */
export const LE_TOL = 1e-6;
export function runUnitTests(P) {
  const rows = [];
  const push = (id, pass, o) => rows.push(Object.assign({ id, pass: !!pass }, o || {}));
  // ① 一様球で R_drag=R(compact と gas β=0・R=1 と R=6.38)
  {
    const e = [];
    for (const R of [1, 6.38]) for (const d of [{ densityClass: 'compact' }, { densityClass: 'gas', densityProfile: { beta: 0 } }]) {
      const z = dragRadius(Object.assign({ R }, d), P); e.push(Math.abs(z.R_drag / R - 1));
    }
    push('uniformRdragEqualsR', Math.max(...e) <= UNIT_TOL, { maxErr: Math.max(...e) });
  }
  // ② 解析解(gas β=1/3・solid 2 層): I/(MR²) と ρ_c/ρ̄
  {
    const g1 = dragRadius({ R: 1, densityClass: 'gas', densityProfile: { beta: 1 } }, P);
    const g3 = dragRadius({ R: 1, densityClass: 'gas', densityProfile: { beta: 3 } }, P);
    const so = dragRadius({ R: 1, densityClass: 'solid', densityProfile: { coreFrac: 0.546, coreRatio: 2.44 } }, P);
    const e = [relD(g1.kI, gasKIExact(1)), relD(g3.kI, gasKIExact(3)), relD(so.kI, solidKIExact(0.546, 2.44)),
      relD(g1.rhoCenterOverMean, gasRhoCExact(1)), relD(g3.rhoCenterOverMean, gasRhoCExact(3)), relD(so.rhoCenterOverMean, solidRhoCExact(0.546, 2.44))];
    push('analyticKIandRhoC', Math.max(...e) <= UNIT_TOL, { maxErr: Math.max(...e) });
  }
  // ②′ Lane–Emden n=1 の閉じた解(θ=sinξ/ξ): ρ_c/ρ̄=π²/3・I/(MR²)=2/3−4/π²(html の数値積分 RK4 h=10⁻³ の精度の確認)
  {
    const n1 = dragRadius({ R: 1, densityClass: 'star', densityProfile: { polyN: 1 } }, P);
    const e = [relD(n1.rhoCenterOverMean, Math.PI * Math.PI / 3), relD(n1.kI, 2 / 3 - 4 / (Math.PI * Math.PI))];
    push('laneEmdenN1Exact', Math.max(...e) <= LE_TOL, { maxErr: Math.max(...e), tol: LE_TOL });
  }
  // ③ 中心集中で R_drag<R・集中の順に単調(compact > solid > gas β=1 > gas β=3 > star n=3)
  {
    const keys = ['compact', 'solid', 'gas-b1', 'gas-b3', 'star-n3'];
    const T = classTable(P);
    const rr = keys.map((k) => T.find((z) => z.key === k));
    const mono = rr.every((z, i) => i === 0 || (z.ratio < rr[i - 1].ratio && z.rhoCenterOverMean > rr[i - 1].rhoCenterOverMean));
    const n3 = rr[rr.length - 1];
    push('concentrationShrinksRdrag', mono && rr.slice(1).every((z) => z.ratio < 1), {
      ratios: Object.fromEntries(rr.map((z) => [z.key, z.ratio])), n3RhoC: n3.rhoCenterOverMean,
      n3RhoCRelToLit: relD(n3.rhoCenterOverMean, LE_N3_RHOC_OVER_MEAN_LIT), n3FineDiff: n3.fineDiff });
  }
  // ④ NS/BH のコア半径の宣言(compact だけ・値そのまま)と拒否
  {
    const a = dragRadius({ R: 0.01175, densityClass: 'compact', coreRadius: 0.005 }, P);
    const b = dragRadius({ R: 1, densityClass: 'star', densityProfile: { polyN: 3 }, coreRadius: 0.5 }, P);
    const c = dragRadius({ R: 1, densityClass: 'compact', coreRadius: 2 }, P);
    push('declaredCoreRadius', a.ok && a.R_drag === 0.005 && a.source === 'declaredCore' && !b.ok && !c.ok, { reasons: [b.reason, c.reason] });
  }
  // ⑤ 候補式: 同期(ΔΩ=0)で 0・逆回転で符号反転(ビット)・A=0 で 0
  {
    const r = [3.7, -1.2];
    const s0 = spinChannel(0.8, 3, 0.5, 0, r), sp = spinChannel(0.8, 3, 0.5, 0.013, r), sn = spinChannel(0.8, 3, 0.5, -0.013, r), a0 = spinChannel(0, 3, 0.5, 0.013, r);
    const zero = (u) => u[0] === 0 && u[1] === 0;
    push('syncZero', zero(s0.u), { u: s0.u });
    push('counterFlipsSign', Object.is(sn.u[0], -sp.u[0]) && Object.is(sn.u[1], -sp.u[1]), { u: sp.u });
    push('amplitudeZero', zero(a0.u), { u: a0.u });
    // e_z×r ⟂ r(接線)
    push('tangential', Math.abs(sp.u[0] * r[0] + sp.u[1] * r[1]) <= UNIT_TOL * Math.hypot(...sp.u) * Math.hypot(...r), {});
  }
  // ⑥ 遠方: (|u|/|r|)·(|r|/R_drag)^q → AΔΩ(相対誤差は q R_drag/|r| で縮む)
  {
    const A = 0.8, q = 3.2, Rd = 0.5, dO = 0.013;
    const errs = [1e3, 1e4, 1e5, 1e6].map((k) => { const d = k * Rd; const z = spinChannel(A, q, Rd, dO, [d, 0]);
      return Math.abs((Math.hypot(...z.u) / d) * Math.pow(d / Rd, q) / (A * dO) - 1); });
    const shrink = errs.slice(1).map((e, i) => errs[i] / e);
    push('farFieldPowerLaw', errs[3] < 1e-5 && shrink.every((s) => s > 9 && s < 11), { errs, shrink });
  }
  // ⑦ 縮退: (A, R_drag) と (A·(R_drag/R′)^q, R′) は遠方で区別できない(差は 1/r で縮む)
  {
    const q = 3.2, R1 = 0.5, R2 = 0.25, A1 = 0.8, A2 = A1 * Math.pow(R1 / R2, q), dO = 0.013;
    const d = [10, 100, 1000, 10000].map((k) => { const x = k * R1, u1 = spinChannel(A1, q, R1, dO, [x, 0]), u2 = spinChannel(A2, q, R2, dO, [x, 0]);
      return Math.abs(u2.u[1] / u1.u[1] - 1); });
    push('degeneracyARdrag', d[3] < d[0] && d[3] < 1e-3, { relDiffAt: { r10R: d[0], r100R: d[1], r1000R: d[2], r10000R: d[3] } });
  }
  // ⑧ 相対自転: 円軌道(Ω_orb 既知)で 同期=0・2 倍 = faster・逆回転 = counter・軸が軌道面内(cos=0)で ΔΩ=−Ω_orb
  {
    const Om = 0.01, a = 50;
    const I = { x: a, y: 0, vx: 0, vy: Om * a }, J = (s, c) => ({ x: 0, y: 0, vx: 0, vy: 0, spin: s, spinAxisCos: c });
    const s1 = relativeSpin(I, J(Om)), s2 = relativeSpin(I, J(2 * Om)), s3 = relativeSpin(I, J(-Om)), s4 = relativeSpin(I, J(Om, 0));
    // 離心軌道(e=0.2 の近点)で spin=n: 瞬時の比は 0 でない・平均運動では同期
    const e = 0.2, GM = Om * Om * a * a * a, rp = a * (1 - e), vp = Math.sqrt(GM * (1 + e) / rp);
    const s5 = relativeSpin({ x: rp, y: 0, vx: 0, vy: vp }, J(Om), { GM });
    push('eccentricMeanMotion', s5.sense === 'sync' && s5.senseInst !== 'sync' && relD(s5.omegaMean, Om) <= UNIT_TOL
      && relD(s5.omegaOrb, Om * (1 + e) * (1 + e) / Math.pow(1 - e * e, 1.5)) <= UNIT_TOL, { ratioInst: s5.ratio, ratioMean: s5.ratioMean });
    push('relativeSpinCases', s1.dOmega === 0 && s1.sense === 'sync' && s2.sense === 'faster' && relD(s2.dOmega, Om) <= UNIT_TOL
      && s3.sense === 'counter' && relD(s3.dOmega, -2 * Om) <= UNIT_TOL && relD(s4.dOmega, -Om) <= UNIT_TOL,
    { senses: [s1.sense, s2.sense, s3.sense, s4.sense] });
    push('nonRotating', relativeSpin(I, J(0)).sense === 'nonRotating' && relativeSpin(I, J(0)).dOmega === -s1.omegaOrb, {});
    // 対称性: Ω_orb は i と j を入れ替えても同じ
    const sw = relativeSpin(Object.assign({}, J(Om), { spin: undefined }), Object.assign({}, I, { spin: Om }));
    push('orbitSymmetric', sw.ok && relD(sw.omegaOrb, s1.omegaOrb) <= UNIT_TOL, {});
  }
  // ⑨ profileOf(器の中の合成プリセット —— 内蔵ではない): 宣言した天体だけ R_drag・宣言なしは null と理由
  {
    const pre = { id: 'w282c-unit', physics: { q: 3, kFrame: 1 }, bodies: [
      { type: 'single', m: 1, radius: 2, x: 0, y: 0, vx: 0, vy: 0, spin: 0.3, densityClass: 'star', densityProfile: { polyN: 3 } },
      { type: 'single', m: 0.01, radius: 0.3, x: 40, y: 0, vx: 0, vy: Math.sqrt(1.01 / 40), spin: 0 },
      { type: 'ring', n: 10 }] };
    const p = profileOf(pre, P);
    const b0 = p.bodies[0], b1 = p.bodies[1], b2 = p.bodies[2];
    push('profileOfDeclared', p.profileVersion === DRAGPROFILE_VERSION && b0.bodyType === 'star' && b0.R_drag > 0 && b0.R_drag < 2
      && b1.bodyType === null && b1.R_drag === null && b1.reasons.length > 0 && b2.bodyType === null && p.profile !== null
      && b0.A_type === null && b0.q_type === null, { b0: { bodyType: b0.bodyType, R_drag: b0.R_drag }, b1Reasons: b1.reasons });
    const none = profileOf({ id: 'w282c-none', physics: {}, bodies: [pre.bodies[1]] }, P);
    push('profileOfUndeclared', none.profile === null && typeof none.reason === 'string' && none.reason.length > 0, { reason: none.reason });
  }
  return { version: DRAGPROFILE_VERSION, tol: UNIT_TOL, rows, allPass: rows.every((r) => r.pass) };
}

/* ─────────────── (e) 内蔵本からプロファイルを読む ─────────────── */
function primaryIndex(bodies) {
  let k = -1, mm = -Infinity;
  bodies.forEach((b, i) => { if (b && b.type === 'single' && fin(b.m) && Math.abs(b.m) > mm) { mm = Math.abs(b.m); k = i; } });
  return k;
}
/** 相手(軌道の基準): 主星以外は主星・主星は他で最も重い single。 */
function partnerIndex(bodies, i, prim) {
  if (i !== prim) return prim;
  let k = -1, mm = -Infinity;
  bodies.forEach((b, j) => { if (j !== i && b && b.type === 'single' && fin(b.m) && Math.abs(b.m) > mm) { mm = Math.abs(b.m); k = j; } });
  return k;
}
const posOf = (b) => ({ x: b.x, y: b.y, vx: fin(b.vx) ? b.vx : 0, vy: fin(b.vy) ? b.vy : 0, spin: fin(b.spin) ? b.spin : 0 });

/**
 * 内蔵本(受理後の preset)から引きずりプロファイルを読む純関数。
 * @returns {{id, profileVersion, profile:object|null, reason?:string, declared:number, bodies:Array}}
 */
export function profileOf(preset, P) {
  const bodies = (preset && Array.isArray(preset.bodies)) ? preset.bodies : [];
  const prim = primaryIndex(bodies);
  const rows = bodies.map((b, i) => {
    const reasons = [];
    const row = { index: i, bodyType: null, relativeSpin: null, R_drag: null, A_type: null, q_type: null, profileVersion: DRAGPROFILE_VERSION, reasons };
    if (!b || b.type !== 'single') { reasons.push('single でない(' + (b && b.type) + ' —— 粒子群はプロファイルの対象外)'); return row; }
    const pj = partnerIndex(bodies, i, prim);
    if (pj >= 0) {
      const G = preset.physics && fin(preset.physics.G) ? preset.physics.G : null;
      const mj = bodies[pj].m, GM = (G !== null && fin(b.m) && fin(mj)) ? G * (Math.abs(b.m) + Math.abs(mj)) : null;
      const rs = relativeSpin(posOf(bodies[pj]), posOf(b), GM ? { GM } : undefined);
      row.relativeSpin = rs.ok ? { partner: pj, dOmega: rs.dOmega, omegaOrb: rs.omegaOrb, ratio: rs.ratio, sign: rs.sign,
        omegaMean: rs.omegaMean, dOmegaMean: rs.dOmegaMean, ratioMean: rs.ratioMean, sense: rs.sense, senseInst: rs.senseInst, senseBasis: rs.senseBasis } : null;
      if (rs.ok && b.spinDipole && fin(b.spinDipole.omega)) {
        const ro = relativeSpin(posOf(bodies[pj]), Object.assign(posOf(b), { spin: b.spinDipole.omega }), GM ? { GM } : undefined);
        row.relativeSpinObserved = { spinProxy: 'spinDipole.omega(観測の自転 —— 力学の値域外で表示・診断専用)', dOmega: ro.dOmega, dOmegaMean: ro.dOmegaMean, sense: ro.sense };
      }
      if (!rs.ok) reasons.push('相対自転: ' + rs.reason);
    } else reasons.push('軌道の相手が無い');
    const cls = b.densityClass;
    if (cls === undefined) reasons.push('densityClass 未宣言(bodyType を読めない)');
    else if (BODY_TYPES.indexOf(cls) < 0) reasons.push('densityClass が 4 語のどれでもない');
    else {
      row.bodyType = cls;
      if (cls === 'compact') reasons.push('compact(NS/BH)は外殻の密度積分を強制しない —— R_drag 用のコア半径が未宣言');
      else {
        const z = dragRadius({ R: b.radius, densityClass: cls, densityProfile: b.densityProfile }, P);
        if (z.ok) row.R_drag = z.R_drag; else reasons.push('R_drag: ' + z.reason);
      }
    }
    reasons.push('A_type・q_type は未宣言(観測に合わせるのは第283便以降 1 本ずつ)');
    return row;
  });
  const declared = rows.filter((r) => r.bodyType !== null).length;
  const out = { id: preset && preset.id, profileVersion: DRAGPROFILE_VERSION, declared, bodies: rows };
  if (!declared) { out.profile = null; out.reason = 'どの天体も densityClass(bodyType)を宣言していない —— 相対自転だけ状態から読める'; }
  else out.profile = { bodyTypes: rows.map((r) => r.bodyType), R_drag: rows.map((r) => r.R_drag) };
  return out;
}

/* ─────────────── (f) 診断表の行 ─────────────── */
/**
 * @param {object} preset 受理後の preset
 * @param {object} meta {group:'solar'|'stellar'|'ns'|'bh'}
 * @param {object} P
 */
export function diagRows(preset, meta, P) {
  const ph = preset.physics || {};
  const prof = profileOf(preset, P);
  const rows = [];
  preset.bodies.forEach((b, i) => {
    if (!b || b.type !== 'single') return;
    const pr = prof.bodies[i];
    const q = fin(b.dragQ) && b.dragQ > 0 ? b.dragQ : ph.q;
    const row = {
      id: preset.id, emoji: preset.emoji, group: meta.group, index: i, m: b.m,
      q, qSource: (fin(b.dragQ) && b.dragQ > 0) ? 'body.dragQ' : 'physics.q', kFrame: ph.kFrame, geoPN: ph.geoPN === undefined ? 0 : ph.geoPN,
      spin: fin(b.spin) ? b.spin : 0, coreOmega: (b.core && fin(b.core.omega)) ? b.core.omega : null,
      spinDipoleOmega: (b.spinDipole && fin(b.spinDipole.omega)) ? b.spinDipole.omega : null,
      R: fin(b.radius) ? b.radius : null, densityClass: b.densityClass || null, R_drag: pr.R_drag,
      R_dragStatus: pr.R_drag !== null ? '計算(宣言した近似)'
        : (b.densityClass ? (pr.reasons.find((z) => /R_drag|compact/.test(z)) || '計算できない') : 'densityClass 未宣言 —— 計算しない'),
      pinned: !!b.pinned,
      dOmega: pr.relativeSpin ? pr.relativeSpin.dOmega : null, omegaOrb: pr.relativeSpin ? pr.relativeSpin.omegaOrb : null,
      dOmegaRatio: pr.relativeSpin ? pr.relativeSpin.ratio : null, sense: pr.relativeSpin ? pr.relativeSpin.sense : null,
      senseInst: pr.relativeSpin ? pr.relativeSpin.senseInst : null, senseBasis: pr.relativeSpin ? pr.relativeSpin.senseBasis : null,
      omegaMean: pr.relativeSpin ? pr.relativeSpin.omegaMean : null, dOmegaMean: pr.relativeSpin ? pr.relativeSpin.dOmegaMean : null,
      dOmegaMeanRatio: pr.relativeSpin ? pr.relativeSpin.ratioMean : null,
      observedSpin: pr.relativeSpinObserved || null,
      partner: pr.relativeSpin ? pr.relativeSpin.partner : null,
    };
    if (meta.group === 'ns' || meta.group === 'bh') {
      row.rDragCore = { status: '未宣言',
        hiddenCoreRadius: (b.core && fin(b.core.radius)) ? b.core.radius : null,
        note: 'core.radius は隠れコア(f の殻/コア分割)の半径であって R_drag の宣言ではない' };
    }
    rows.push(row);
  });
  // 連星(single 2 体)の分類
  const singles = rows.filter((r) => r.sense !== null);
  let lock = null;
  if (singles.length === 2) lock = pairLockClass(singles[0].sense, singles[1].sense);
  return { rows, lock, profile: prof.profile === null ? null : prof.profile, profileReason: prof.reason || null };
}

/** 診断表の対象(太陽系 12・恒星連星 2・NS 連星 4・BH 1)。太陽系は較正 16 本から同系の対(🪨=☄️ の kF1・🌙=🌘 の kF0)と監査コピー(🧲🔆)を除いた 12 本。 */
export const TABLE_PRESETS = [
  ['mercuryReal', 'solar'], ['solarInner', 'solar'], ['venusReal', 'solar'], ['earthMoonRealKF1', 'solar'], ['marsMoonsReal', 'solar'],
  ['jupiterGalilean', 'solar'], ['saturnZonalD68', 'solar'], ['saturnRingReal', 'solar'], ['saturnRingRealKF1', 'solar'],
  ['uranusReal', 'solar'], ['neptuneReal', 'solar'], ['plutoCharonReal', 'solar'],
  ['alphaCenABDFM', 'stellar'], ['siriusABDFM', 'stellar'],
  ['psrDoubleABDFM', 'ns'], ['psrJ1757DFM', 'ns'], ['psrJ1946DFM', 'ns'], ['psrB1534DFM', 'ns'],
  ['gw150914DFM', 'bh'],
];
export const TABLE_EXCLUDED = { mercuryRealKF1: '☄️ と同じ系の kF1 雛形', earthMoonReal: '🌘 と同じ系の kF0 対照',
  emAuditDFM: '🌘 の監査コピー', emAuditSolar: '三体の監査コピー' };
export const KF0_PRESETS = ['alphaCenABDFM', 'psrDoubleABDFM'];
export const GEO1_EXTRA = 'earthMoonRealKF1';
export const Q_PAIR = [2, 8];
export const N_STEPS = 128;

/* ─────────────── (g) 実測の一式(器と QA が同じ関数を呼ぶ —— エンジンは html の本文そのまま・コピーは関数の中だけ) ─────────────── */
/**
 * @param {object} HP headless で読んだ html の HP
 * @param {number} DT html の DT
 * @param {string} html 対象 html のソース(門の文字列を数える)
 * @param {object} P makePure(html)
 */
export function measureAll(HP, DT, html, P) {
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const byId = (id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('内蔵に無い: ' + id); return p; };

  /* ─────────────── ① kF0 不感 ─────────────── */
  function runState(id, mutate) {
    const p = clone(byId(id));
    mutate(p);
    const v = HP.validatePreset(p);
    if (!v.ok) return { ok: false, err: v.err };
    HP.sim.build(v.preset);
    const S = HP.sim;
    for (let k = 0; k < N_STEPS; k++) S.step(DT);
    const pos = [], vel = [], spin = [];
    for (let i = 0; i < S.n; i++) {
      pos.push(S.x[i], S.y[i]); vel.push(S.vx[i], S.vy[i]); spin.push(S.spin[i]);
      if (S.hasCoreV2 && S.coreJ) spin.push(S.coreJ[i]);
    }
    const all = Float64Array.from(pos.concat(vel, spin));
    return { ok: true, n: S.n, t: S.t, pos, vel, spin, warnings: (v.warnings || []).length,
      sha: crypto.createHash('sha256').update(Buffer.from(all.buffer)).digest('hex').slice(0, 16) };
  }
  function cmp(a, b) {
    const same = (x, y) => x.length === y.length && x.every((z, i) => Object.is(z, y[i]));
    const md = (x, y) => x.reduce((m, z, i) => Math.max(m, Math.abs(z - y[i])), 0);
    return { bitSame: same(a.pos, b.pos) && same(a.vel, b.vel) && same(a.spin, b.spin),
      maxAbs: { pos: md(a.pos, b.pos), vel: md(a.vel, b.vel), spin: md(a.spin, b.spin) }, sha: [a.sha, b.sha] };
  }
  const setDragQ = (qv) => (p) => { for (const b of p.bodies) if (b.type === 'single') b.dragQ = qv; };
  const setPhysQ = (qv) => (p) => { for (const b of p.bodies) delete b.dragQ; p.physics.q = qv; };
  const kf = (k, g, f) => (p) => { p.physics.kFrame = k; p.physics.geoPN = g; if (f) f(p); };

  const kf0 = [];
  for (const id of KF0_PRESETS) for (const geo of [1, 2]) {
    const a = runState(id, kf(0, geo, setDragQ(Q_PAIR[0]))), b = runState(id, kf(0, geo, setDragQ(Q_PAIR[1])));
    const c = runState(id, kf(0, geo, setPhysQ(Q_PAIR[0]))), d = runState(id, kf(0, geo, setPhysQ(Q_PAIR[1])));
    kf0.push({ id, emoji: byId(id).emoji, kFrame: 0, geoPN: geo, steps: N_STEPS, dt: DT, tEnd: a.t,
      dragQ: cmp(a, b), physicsQ: cmp(c, d), warnings: a.warnings + b.warnings + c.warnings + d.warnings });
  }
  const control = [];
  for (const id of KF0_PRESETS.concat([GEO1_EXTRA])) for (const geo of [1, 2]) {
    const q2 = runState(id, kf(1, geo, setDragQ(Q_PAIR[0]))), q8 = runState(id, kf(1, geo, setDragQ(Q_PAIR[1])));
    const k0 = runState(id, kf(0, geo)), k1 = runState(id, kf(1, geo));
    // 第283便a(原仮定者の裁定(2026-09-26 追加)): geoPN=1 は kFrame=0 専用 —— 受理器が kFrame=1 の写しを**拒否**する
    // (旧 html では「kFrame=1 でも q・kFrame 1/0 がビット一致」だった組)。拒否された行は比較せず、拒否の事実を記録する
    if (!q2.ok || !q8.ok || !k1.ok) {
      control.push({ id, emoji: byId(id).emoji, geoPN: geo, rejected: true, kFrame0Ok: k0.ok === true,
        reason: 'geoPN=1 は kFrame=0 専用(受理器が kFrame=1 を拒否 —— 第283便a)' });
      continue;
    }
    control.push({ id, emoji: byId(id).emoji, geoPN: geo, kF1DragQ2vs8: cmp(q2, q8), kFrame0vs1: cmp(k0, k1) });
  }
  // 構造の理由(html のソースから引用 —— 門の文字列が在ることを数える)
  const GATES = [
    { key: 'e6Gate', text: 'if(denom>0 && kFrame>0 && !geo){', meaning: 'E6′ の追従キックは kFrame>0 かつ geoPN=0 のときだけ(geoPN≥1 の物質には当てない)' },
    { key: 'g2Gate', text: 'const geo2=(p.geoPN||0)>=2, g2on=geo2&&kFrame>0;', meaning: 'geoPN=2 の v−u 輸送 3 項は geoPN≥2 かつ kFrame>0 のときだけ' },
    { key: 'pnVel', text: 'const wxi=(geo2&&S.hasU[i])? vx[i]-kFrame*S.uPx[i] : vx[i],', meaning: '1PN が読む速度から u を引くのは geoPN≥2 だけ' },
  ];
  const gates = GATES.map((g) => ({ key: g.key, meaning: g.meaning, text: g.text, count: html.split(g.text).length - 1 }));

  /* ─────────────── ② 純関数 ─────────────── */
  const units = runUnitTests(P);
  const classes = classTable(P);

  /* ─────────────── ③ 診断表 ─────────────── */
  const table = TABLE_PRESETS.map(([id, group]) => {
    const v = HP.validatePreset(clone(byId(id)));
    const d = diagRows(v.preset, { group }, P);
    return { id, emoji: v.preset.emoji, group, sampleClass: v.preset.sampleClass || null, nSingle: d.rows.length,
      nBodies: v.preset.bodies.length, lock: d.lock, lockJa: d.lock ? LOCK_JA[d.lock] : null,
      profile: d.profile, profileReason: d.profileReason, rows: d.rows };
  });
  const nRows = table.reduce((s, t) => s + t.rows.length, 0);
  const nDensityDeclared = table.reduce((s, t) => s + t.rows.filter((r) => r.densityClass).length, 0);

  /* ─────────────── ④ 🌓 ─────────────── */
  const diag = HP.validatePreset(clone(byId('earthMoonDiagOne'))).preset;
  const diagProfile = profileOf(diag, P);
  const earthR = diag.bodies[0].radius;
  const earthDecl = { R: earthR, densityClass: diag.bodies[0].densityClass, densityProfile: diag.bodies[0].densityProfile };
  const earth = dragRadius(earthDecl, P);

  // v_rel の定義が効く例: 🌓 の月の vx,vy は慣性速度 v=ẋ−u(0)、🌘 は座標速度(同じ初期状態)—— 平均運動に対する月の自転の比
  const moonOf = (rows) => rows.find((r) => r.index === 1);
  const emRow = moonOf(table.find((t) => t.id === 'earthMoonRealKF1').rows);
  const dgMoon = diagProfile.bodies[1].relativeSpin;
  const vRelExample = { note: '同じ初期状態の月で、速度の意味(🌘 座標速度 / 🌓 慣性速度 v=ẋ−u(0))だけで平均運動 n と分類が変わる —— v_rel の定義は法則版に明記する(未決)',
    earthMoonRealKF1: { velocityMeaning: 'coordinate', omegaMean: emRow.omegaMean, dOmegaMeanRatio: emRow.dOmegaMeanRatio, sense: emRow.sense },
    earthMoonDiagOne: { velocityMeaning: 'inertial(v=ẋ−u(0))', omegaMean: dgMoon.omegaMean, dOmegaMeanRatio: dgMoon.ratioMean, sense: dgMoon.sense } };
  return { kf0, control, gates, units, classes, table, nRows, nDensityDeclared, diagProfile, earthR, earthDecl, earth, vRelExample };
}

/* ─────────────── 文書の数(PHYSICS〔第282便c〕に同じ書式で載る —— QA docs.dragProfile が照合) ─────────────── */
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '' };
/** 1.09×10⁻¹⁰ の書式(0 は "0")。 */
export function fmtSci(x, d) {
  if (x === 0) return '0';
  const [m, e] = Math.abs(Number(x)).toExponential(d === undefined ? 2 : d).split('e');
  return (x < 0 ? '−' : '') + m + '×10' + String(Number(e)).split('').map((c) => SUP[c]).join('');
}
/** 正本 J から、文書に載るべき数の文字列を並べる。 */
export function docTokens(J) {
  const t = [];
  for (const c of J.classes) t.push(c.ratio.toFixed(4), c.kI.toFixed(4), c.rhoCenterOverMean.toFixed(4), c.i3dOverImom2d.toFixed(4));
  for (const r of J.control.rows) if (!r.kF1DragQ2vs8.bitSame) t.push(fmtSci(r.kF1DragQ2vs8.maxAbs.pos), fmtSci(r.kF1DragQ2vs8.maxAbs.vel));
  for (const r of J.control.rows) if (!r.kFrame0vs1.bitSame) t.push(fmtSci(r.kFrame0vs1.maxAbs.pos));
  t.push(J.diagOne.earth.R_drag.toFixed(4));
  const u = (id) => J.units.rows.find((z) => z.id === id);
  const dg = u('degeneracyARdrag').relDiffAt;
  t.push(dg.r10R.toFixed(4), dg.r100R.toFixed(4), fmtSci(dg.r1000R), fmtSci(dg.r10000R));
  const ff = u('farFieldPowerLaw').errs;
  t.push(fmtSci(ff[0]), fmtSci(ff[3]));
  t.push(J.table.nPresets + ' 本', J.table.nRows + ' 行');
  const v = J.vRelExample;
  t.push(fmtSci(v.earthMoonRealKF1.omegaMean, 3), fmtSci(v.earthMoonDiagOne.omegaMean, 3),
    (v.earthMoonRealKF1.dOmegaMeanRatio * 100).toFixed(2) + '%', '+' + (v.earthMoonDiagOne.dOmegaMeanRatio * 100).toFixed(2) + '%');
  return t.map((z) => z.replace(/^-/, '−'));
}

export default { DRAGPROFILE_VERSION, BODY_TYPES, BODY_TYPE_JA, SYNC_REL_TOL, QUAD_DEFAULT, QUAD_FINE, LE_N3_RHOC_OVER_MEAN_LIT,
  makePure, dragRadius, gasKIExact, gasRhoCExact, solidKIExact, solidRhoCExact, relativeSpin, pairLockClass, LOCK_JA,
  spinChannel, CLASS_TABLE, classTable, UNIT_TOL, LE_TOL, runUnitTests, profileOf, diagRows, fmtSci, docTokens, measureAll,
  TABLE_PRESETS, TABLE_EXCLUDED, KF0_PRESETS, GEO1_EXTRA, Q_PAIR, N_STEPS };

// 第331便b(原仮定者の追記(2026-11-09)「回転引きずりで空間を引きずる事による大きな影響は、遠心力を弱める事で有る」・原仮定者の決断(2026-11-09 —— AN593 = B・AN595 = A)・
//   原仮定者の整理(2026-11-09)「引きずりは、相対的な移動回転に、m/r^2 の重みが付く」・統括の検証項目 R311):
//   **遠心力を弱める関係の表の器 —— NGC 3198 の要る枠の回転と m/r² の座標則の円盤の枠の固定点(AN593 B の格子: 自己の重み × 離散化 × 背景の重み)・太陽系と土星の環の面内の大きさ**
//   (段 centrifugal-331b —— 正本 tests/out/centrifugal-w331b.json・lib tests/lib-w331b-centrifugal.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第329便b・第330便b の lib の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d と 💍 saturnRingReal の宣言の値を .find で引いて読むだけ ——
//   本の JSON は 1 bit も変えない・步は進めない)。1 プロセス。入力は html・NGC 3198 の rotmod の写しの fixture(第329便b —— 第三者の写し)。
//
// ■ 何をするか
//   P 純関数の場面(lib の pureScenes —— 回る枠の中の円軌道の釣り合い・枠の 2 つの読み・否定対照・小さな円盤の固定点)
//   Q NGC 3198 の要る枠の回転(fixture の行ごと —— rigid: (v_obs − v_bar)/R・fixed: (v_obs² − v_bar²)/(R v_obs)・v_obs/R・Ω_bar = v_bar/R)と、rigid の要る形の halfCurl のずれの部
//   G AN593 B の格子: m/r² の座標則の円盤の枠の固定点(受け手の枠 —— 自己の重みの型 × 自己の半径の比 f × 離散化〔環の間隔・方位の点〕× 背景の重み / 場の枠 —— 離散化 × 背景の重み)
//     —— 速度の絶対値・外側のべき・観測との残差・無引きずりの対照(Ω_f = 0 → v = v_bar)・Ω_f/Ω_f,req・反復の欄・退化の印
//   X 横の列(主の宣言から 1 つずつ変える): 源の回転の型 none・中心の型 moment・軸の型 fixed・境界・指数円盤・R_d = Y_k m の自己・中心なし(場の枠と受け手の枠)
//   S 太陽系: 太陽の自転の枠の回転が水星〜海王星の軌道で遠心の要求を何割弱めるか(読み × 自己の半径の規則 × 自己の重みの型 × 背景の重み)・近点と周期への一次の目安・1PN の一次の式の値(尺度)
//   R 土星の環: 土星の自転(本の宣言 10.56 時間)の枠が C 環〜A 環の粒子で弱める割合(同じ読みの格子)・J2 の振動数の補正(尺度 —— 文献の値)。面内の遠心だけ(環の厚みは扱わない)
// ■ 言わないこと: 遠心の要求が下がる関係は宣言の式 —— 円盤の速度・太陽系と環の大きさは宣言した型の表の値と残差(平坦な回転の機構の同定・暗黒物質の置き換え・寄与の度合いの主張に使わない)・
//   `κ_epi` と κ_D を同じ量と書かない・枠の角速度と密度波のパターン速度 Ω_p を混ぜない(AN595 —— Ω_p は格子のまま)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w331b-centrifugal.mjs';
import * as WT from './lib-w330b-dragweight.mjs';
import * as GR from './lib-w329b-galrot.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は 🗺️ solarSystem16Inertial3d と 💍 saturnRingReal の 2 本〔宣言の値を .find で
//   引いて読むだけ〕。roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt・HP.validatePreset は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分 ——
//   この器と lib の局所の変数には使わない。エンジンの式は読まない〔core:false —— 本の宣言の値と純関数だけ・步を進めない〕・ワンタップ対照 A/B は走らせない〔abBody:false〕)
const REGEN_SCOPE = {"presets":["saturnRingReal","solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w331b-centrifugal-1';
export const OUT_MAIN = 'tests/out/centrifugal-w331b.json';
export const FIXTURE = 'tests/fixtures/ngc3198-rotmod-w329b.json';
export const SOLAR_ID = 'solarSystem16Inertial3d';
export const RING_ID = 'saturnRingReal';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const NOT_CLAIM = Object.freeze(['遠心の要求が下がる関係は宣言の式(引きずられた枠を局所の慣性系と置く作業仮説)—— エンジンの式ではない', '円盤の速度・外側のべき・残差は宣言した型の表の値(平坦な回転の機構の同定ではない)',
  '要る枠の回転と出る枠の回転は表の比(寄与の度合いの主張・暗黒物質の置き換えに使わない)', '太陽系と土星の環の大きさは宣言した読みと自己の重みの型の表(観測の軌道との照合は尺度の列)',
  'κ_epi(周転円の振動数)と κ_D は別の量', '枠の角速度と密度波のパターン速度 Ω_p は別(AN595 —— Ω_p は格子)', '背景の重みの宣言の型は次数の読み(第310便a の受理は Wbg2 = 0 だけ —— 器の引数の比較)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 円盤: Υ_disk(第329便b の宣言 0.5)・環の半径 [kpc](1〜30 kpc)・中心の球の半径 0.5 kpc・外側のべきを読む範囲・表に出す半径(第330便b と同じ) */
  upsDisk: 0.5, ringFromKpc: 1, ringToKpc: 30, RcKpc: 0.5, outerFromKpc: 10, pickKpc: Object.freeze([1, 2, 4, 8, 16, 30]),
  /** 主の宣言(受け手の枠・ballMean・f 0.9・環の間隔 1 kpc・方位 24・背景 0・sync・中心 frame・軸 rigid・境界なし・fixture の面密度) */
  main: Object.freeze({ reading: 'receiver', selfType: 'ballMean', f: 0.9, dR: 1, K: 24, bgMul: 0, sourceSpin: 'sync', centerRot: 'frame', axes: 'rigid', boundary: false, dist: 'fixture', kappa: false, center: true }),
  /** AN593 B の格子(源の回転の型 × 自己の重みの型 × 自己の半径の比 f × 離散化 [間隔 kpc, 方位] × 背景の重みの倍率〔cosmicBackgroundWeight の倍〕) */
  gridSpins: Object.freeze(['sync', 'none']), gridSelfTypes: Object.freeze(['point', 'ballMean', 'ballHarmonic']), gridF: Object.freeze([0.25, 0.5, 0.9]),
  gridDisc: Object.freeze([Object.freeze([1, 12]), Object.freeze([1, 24]), Object.freeze([1, 48]), Object.freeze([0.5, 24])]), gridBgMul: Object.freeze([0, 1e-3, 1e-2, 1e-1, 1]),
  /** 背景の重みの宣言の型の入力(H₀ —— 文献の値・本便は一次資料に当たっていない) */
  H0kmsMpc: 67.4, H0Source: 'H₀ = 67.4 km s⁻¹ Mpc⁻¹(文献の値 —— 本便は一次資料に当たっていない)・静止した一様な宇宙(臨界密度)の Σ m/r² をハッブル半径まで —— 3H₀c/(2G)(次数の読み)',
  /** 境界の宣言(背景に対して静止した外の環 —— 半径 45 kpc・質量は円盤の総質量と同じ・方位 48 点 —— 第330便b と同じ) */
  boundaryRKpc: 45, boundaryK: 48,
  /** 太陽系: 🗺️ の添字(0 太陽・惑星 8)・名前・自己の半径の規則・SI の G と c */
  sunIndex: 0, planets: Object.freeze([1, 2, 3, 5, 6, 11, 13, 14]), planetNames: Object.freeze(['水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星']),
  selfRules: Object.freeze(['kappaM', 'radius']), G: 6.674e-11, c: 299792458, centuryS: 36525 * 86400, arcsec: Math.PI / (180 * 3600),
  /** 土星の環: 粒子の半径 [m]・密度(氷 —— 文献の値)・J2 と基準の半径(文献の値 —— 本便は一次資料に当たっていない) */
  ringParticleRadii: Object.freeze([0.01, 1, 10]), ringParticleMainRadius: 1, iceDensity: 900, saturnJ2: 0.016290573, saturnJ2RefM: 6.033e7,
  ringSource: '粒子の半径 1 cm〜10 m・氷の密度 900 kg/m³・土星の J2 = 16 290.573 × 10⁻⁶(基準の半径 60 330 km)—— 文献の値・本便は一次資料に当たっていない',
});
const KPC = GR.KPC_M, MSUN = GR.MSUN_KG;

/* ───────── 入力 ───────── */
export function readFixture(root = ROOT) {
  const J = JSON.parse(fs.readFileSync(path.join(root, FIXTURE), 'utf8'));
  const sha = crypto.createHash('sha256').update(Buffer.from(J.rawText, 'utf8')).digest('hex');
  return { J, rows: J.rows, shaSame: sha === J.provenance.sha256 };
}
function interpAt(rows, R, key) {
  if (R <= rows[0].R) return rows[0][key];
  for (let k = 0; k + 1 < rows.length; k++) if (R <= rows[k + 1].R) { const a = rows[k], b = rows[k + 1], t = (R - a.R) / (b.R - a.R); return a[key] + t * (b[key] - a[key]); }
  return rows[rows.length - 1][key];
}
/** v_bar [km s⁻¹](V|V| で足す —— Υ_disk の宣言)。負の二乗は null */
function vbarKms(rows, R) { const vg = interpAt(rows, R, 'Vgas'), vd = interpAt(rows, R, 'Vdisk'), vb = interpAt(rows, R, 'Vbul'), v2 = vg * Math.abs(vg) + PLAN.upsDisk * vd * Math.abs(vd) + GR.DECL.upsilonBul * vb * Math.abs(vb); return v2 > 0 ? Math.sqrt(v2) : null; }
/** 指数円盤の当てはめ(ln SBdisk と R の最小二乗 —— 1〜30 kpc の SBdisk > 0 の行・第330便b と同じ宣言) */
function expFit(rows) {
  const pts = rows.filter((r) => r.R >= PLAN.ringFromKpc && r.R <= PLAN.ringToKpc && r.SBdisk > 0), n = pts.length;
  const mx = pts.reduce((s, r) => s + r.R, 0) / n, my = pts.reduce((s, r) => s + Math.log(r.SBdisk), 0) / n;
  let sxy = 0, sxx = 0; for (const r of pts) { sxy += (r.R - mx) * (Math.log(r.SBdisk) - my); sxx += (r.R - mx) ** 2; }
  const slope = sxy / sxx; return { hKpc: -1 / slope, SB0: Math.exp(my - slope * mx), n };
}

/* ───────── Q 要る枠の回転 ───────── */
export function partRequired(FX) {
  const rows = FX.rows.map((r) => {
    const vb = vbarKms(FX.rows, r.R), vo = r.Vobs;
    if (vb === null) return { R: r.R, vObs: vo, vBar: null, why: 'v_bar² ≤ 0' };
    const rig = L.requiredFrame({ vObs: vo, vBar: vb, R: r.R }), fix = L.requiredFrame({ vObs: vo, vBar: vb, R: r.R, axes: 'fixed' });
    return { R: r.R, vObs: vo, vBar: vb, OmegaObs: vo / r.R, OmegaBar: vb / r.R, reqRigid: rig, reqFixed: fix, reqRigidRadS: rig * GR.KMS_KPC_RADS, ratioRigid: rig / (vo / r.R), why: null };
  });
  const ok = rows.filter((q) => q.why === null);
  const sc = L.shearCheck({ R: ok.map((q) => q.R), OmegaF: ok.map((q) => q.reqRigid), Omega: ok.map((q) => q.OmegaObs), g: ok.map((q) => q.vBar * q.vBar / q.R) });
  ok.forEach((q, k) => { q.shear = { dOmegaFdR: sc[k].dOmegaFdR, logSlope: sc[k].logSlope, shearOverG: sc[k].shearOverG, residualOverG: sc[k].residualOverG }; });
  const outer = ok.filter((q) => q.R >= PLAN.outerFromKpc);
  return { unit: 'km s⁻¹ kpc⁻¹(rad/s の列は reqRigidRadS)', rows, n: ok.length, outer: { n: outer.length, ratioRigidRange: [Math.min(...outer.map((q) => q.ratioRigid)), Math.max(...outer.map((q) => q.ratioRigid))],
    shearOverGRange: [Math.min(...outer.map((q) => q.shear.shearOverG)), Math.max(...outer.map((q) => q.shear.shearOverG))], logSlopeMedian: L.median(outer.map((q) => q.shear.logSlope)) } };
}

/* ───────── G・X 円盤の枠の固定点 ───────── */
export function diskSetup(FX, o) {
  const rows = FX.rows, EF = expFit(rows);
  const sigma = (R) => PLAN.upsDisk * (o.dist === 'fixture' ? interpAt(rows, R, 'SBdisk') : EF.SB0 * Math.exp(-R / EF.hKpc));   // M☉/pc²
  const Rs = []; for (let k = 0; ; k++) { const R = PLAN.ringFromKpc + k * o.dR; if (R > PLAN.ringToKpc + 1e-9) break; Rs.push(Math.round(R * 1e6) / 1e6); }
  const rings = Rs.map((R) => ({ R: R * KPC, m: 2 * Math.PI * (R * 1e3) * (o.dR * 1e3) * sigma(R) * MSUN }));
  let Mc = 0; const nn = 200; for (let i = 0; i < nn; i++) { const r = (i + 0.5) * PLAN.RcKpc / nn; Mc += 2 * Math.PI * r * 1e3 * (PLAN.RcKpc / nn * 1e3) * sigma(r); } Mc *= MSUN;
  const Rself = rings.map((r, k) => (o.kappa ? WT.kappaMRadius(r.m / o.K) : o.f * Math.min(2 * Rs[k] * Math.sin(Math.PI / o.K), o.dR) / 2 * KPC));
  const vbar = Rs.map((R) => vbarKms(rows, R) * 1e3), vobs = Rs.map((R) => interpAt(rows, R, 'Vobs') * 1e3);
  const OmC = interpAt(rows, PLAN.RcKpc, 'Vobs') * 1e3 / (PLAN.RcKpc * KPC), Mdisk = rings.reduce((a, r) => a + r.m, 0);
  return { Rs, rings, Mc, Rself, vbar, vobs, OmC, Mdisk, EF };
}
export function diskCase(FX, c, wCos) {
  const o = Object.assign({}, PLAN.main, c), Sx = diskSetup(FX, o);
  const OmegaK = Sx.Rs.map((R, k) => Sx.vbar[k] / (R * KPC));
  const d = L.diskFrameFixedPoint({ rings: Sx.rings, K: o.K, p: 2, reading: o.reading, self: o.reading === 'receiver' ? { type: o.selfType, Rs: Sx.Rself } : null,
    center: o.center ? { M: Sx.Mc, Rc: PLAN.RcKpc * KPC, Omega: Sx.OmC, rot: o.centerRot } : null, wBg: o.bgMul * wCos, sourceSpin: o.sourceSpin, OmegaK, axes: o.axes,
    boundary: o.boundary ? { R: PLAN.boundaryRKpc * KPC, m: Sx.Mdisk, K: PLAN.boundaryK } : null });
  const req = Sx.Rs.map((R, k) => L.requiredFrame({ vObs: Sx.vobs[k], vBar: Sx.vbar[k], R: R * KPC }));
  const ctl = L.residualStats({ R: Sx.Rs, v: Sx.vbar, vObs: Sx.vobs }), ctlOut = L.residualStats({ R: Sx.Rs, v: Sx.vbar, vObs: Sx.vobs, Rmin: PLAN.outerFromKpc });
  const pick = PLAN.pickKpc.map((R) => Sx.Rs.indexOf(R)).filter((k) => k >= 0);
  const base = { decl: o, nRings: Sx.Rs.length, nPoints: Sx.Rs.length * o.K, wBg: o.bgMul * wCos, McMsun: Sx.Mc / MSUN, MdiskMsun: Sx.Mdisk / MSUN, OmegaC: Sx.OmC,
    selfRadiusKpc: o.reading === 'receiver' ? { first: Sx.Rself[0] / KPC, last: Sx.Rself[Sx.Rself.length - 1] / KPC } : null, expDisk: o.dist === 'exp' ? Sx.EF : null,
    anchor: { min: d.anchorMin, max: d.anchorMax }, degenerate: d.degenerate, why: d.why, solve: d.solve, control: { resAll: ctl, resOuter: ctlOut } };
  if (d.degenerate || d.rows.some((r) => !Number.isFinite(r.Omega))) return Object.assign(base, { ok: false, picks: pick.map((k) => ({ R: Sx.Rs[k], shares: d.rows[k].shares, anchor: d.rows[k].anchor })) });
  const v = d.rows.map((r) => r.v), sl = WT.slopes(Sx.Rs, v, PLAN.outerFromKpc);
  const ratio = d.rows.map((r, k) => (req[k] !== 0 ? r.OmegaF / req[k] : null));
  return Object.assign(base, { ok: true,
    slope: { outer: sl.outer, flat: sl.flat, allPositive: sl.allPositive, vbarOuter: WT.slopes(Sx.Rs, Sx.vbar, PLAN.outerFromKpc).outer, vobsOuter: WT.slopes(Sx.Rs, Sx.vobs, PLAN.outerFromKpc).outer },
    resAll: L.residualStats({ R: Sx.Rs, v, vObs: Sx.vobs }), resOuter: L.residualStats({ R: Sx.Rs, v, vObs: Sx.vobs, Rmin: PLAN.outerFromKpc }),
    ratioOuterMedian: L.median(ratio.filter((x, k) => Sx.Rs[k] >= PLAN.outerFromKpc)), vMax: Math.max(...v), vOverVobsMax: Math.max(...v.map((x, k) => x / Sx.vobs[k])),
    picks: pick.map((k) => ({ R: Sx.Rs[k], v: v[k], vObs: Sx.vobs[k], vBar: Sx.vbar[k], vOverVobs: v[k] / Sx.vobs[k], OmegaF: d.rows[k].OmegaF, OmegaFReq: req[k], ratio: ratio[k], shares: d.rows[k].shares, anchor: d.rows[k].anchor, rowSumB: d.rows[k].rowSumB })) });
}
const keyOf = (o) => [o.sourceSpin, o.reading, o.reading === 'receiver' ? o.selfType : '-', o.reading === 'receiver' ? 'f' + o.f : '-', 'dR' + o.dR, 'K' + o.K, 'bg' + o.bgMul].join('|');
export function gridDecls() {
  const out = [];
  for (const sp of PLAN.gridSpins) for (const [dR, K] of PLAN.gridDisc) for (const bg of PLAN.gridBgMul) {
    for (const t of PLAN.gridSelfTypes) for (const f of PLAN.gridF) out.push({ sourceSpin: sp, reading: 'receiver', selfType: t, f, dR, K, bgMul: bg });
    out.push({ sourceSpin: sp, reading: 'field', dR, K, bgMul: bg });
  }
  return out;
}
export const SIDE_CASES = Object.freeze([
  ['main', {}], ['spinNone', { sourceSpin: 'none' }], ['centerMoment', { centerRot: 'moment' }], ['axesFixed', { axes: 'fixed' }], ['axesHalfCurl', { axes: 'halfCurl' }], ['spinNoneHalfCurl', { sourceSpin: 'none', axes: 'halfCurl' }],
  ['boundary', { boundary: true }], ['expDisk', { dist: 'exp' }],
  ['kappaM', { kappa: true }], ['noCenterField', { reading: 'field', center: false }], ['noCenterReceiver', { center: false }], ['fieldBg0', { reading: 'field' }], ['fieldBg1', { reading: 'field', bgMul: 1 }],
  ['mainBg1', { bgMul: 1 }],
].map(([k, v]) => Object.freeze([k, Object.freeze(v)])));
export function partDisk(FX, wCos) {
  const slim = (p) => ({ R: p.R, v: p.v, vOverVobs: p.vOverVobs, OmegaF: p.OmegaF, ratio: p.ratio, anchor: p.anchor });
  const grid = gridDecls().map((c) => { const q = diskCase(FX, c, wCos); if (q.ok) q.picks = q.picks.map(slim); return Object.assign({ key: keyOf(q.decl) }, q); });
  const side = Object.fromEntries(SIDE_CASES.map(([k, c]) => [k, diskCase(FX, c, wCos)]));
  const okG = grid.filter((q) => q.ok);
  const rng = (a) => (a.length ? [Math.min(...a), Math.max(...a)] : null);
  // 宣言の軸ごとの範囲(残差の外側の二乗平均の平方根・外側のべき)
  const byAxis = {};
  for (const [nm, f] of [['spin', (q) => q.decl.sourceSpin], ['reading', (q) => q.decl.reading], ['selfType', (q) => (q.decl.reading === 'receiver' ? q.decl.selfType : 'field')], ['f', (q) => (q.decl.reading === 'receiver' ? q.decl.f : 'field')],
    ['disc', (q) => q.decl.dR + '|' + q.decl.K], ['bgMul', (q) => q.decl.bgMul]]) {
    const m = {}; for (const q of okG) { const k = String(f(q)); (m[k] = m[k] || []).push(q); }
    byAxis[nm] = Object.fromEntries(Object.entries(m).map(([k, a]) => [k, { n: a.length, resOuterRms: rng(a.map((q) => q.resOuter.rms)), slopeOuter: rng(a.map((q) => q.slope.outer)), vOverVobsMax: rng(a.map((q) => q.vOverVobsMax)) }]));
  }
  const best = okG.reduce((b, q) => (b === null || q.resOuter.rms < b.resOuter.rms ? q : b), null);
  return { wCos, grid, side, n: grid.length, nOk: okG.length, nDegenerate: grid.filter((q) => q.degenerate).length, nNotConverged: grid.filter((q) => q.solve && q.solve.converged === false).length,
    nFlat: okG.filter((q) => q.slope.flat === true).length, resOuterRange: rng(okG.map((q) => q.resOuter.rms)), slopeRange: rng(okG.map((q) => q.slope.outer)), byAxis,
    minResOuter: best ? { key: best.key, rms: best.resOuter.rms, slope: best.slope.outer, note: '格子の中で外側の残差が最も小さい列(表の値 —— 宣言を選ぶ操作ではない)' } : null,
    control: grid[0] ? grid[0].control : null };
}

/* ───────── S 太陽系 ───────── */
const axisOf = (b) => { if (!b.spinAxis) return [0, 0, 1]; const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export function partSolar(HP, wCos) {
  const book = clone(HP.allPresets().find((p) => p.id === SOLAR_ID)), se = book.scaleExp, uL = 10 ** se.L, uT = 10 ** se.T, uM = 10 ** se.M, Gb = book.physics.G;
  const sun = book.bodies[PLAN.sunIndex], aSun = axisOf(sun), OmSun = sun.spin / uT, mSun = sun.m * uM;
  const rows = PLAN.planets.map((pi, k) => {
    const P = book.bodies[pi], rv = [P.x - sun.x, P.y - sun.y, (P.z || 0) - (sun.z || 0)], vv = [P.vx - sun.vx, P.vy - sun.vy, (P.vz || 0) - (sun.vz || 0)];
    const r = Math.hypot(...rv), mu = Gb * (P.m + sun.m), sma = 1 / (2 / r - dot3(vv, vv) / mu), h = cross3(rv, vv), hn = Math.hypot(...h), hu = h.map((x) => x / hn);
    const ecc = Math.sqrt(Math.max(0, 1 - hn * hn / (mu * sma))), nMean = Math.sqrt(mu / (sma * sma * sma)) / uT, aM = sma * uL, mP = P.m * uM, RP = P.radius * uL;
    const OmAlong = OmSun * dot3(aSun, hu), per = 2 * Math.PI / nMean, cen = PLAN.centuryS;
    const pn1 = 6 * Math.PI * PLAN.G * mSun / (PLAN.c * PLAN.c * aM * (1 - ecc * ecc)) * (cen / per) / PLAN.arcsec;
    const readings = [];
    for (const bgMul of [0, 1]) {
      const wBg = bgMul * wCos;
      const mk = (reading, rule, type) => {
        const Rself = rule === null ? null : rule === 'kappaM' ? WT.kappaMRadius(mP) : RP;
        const F = L.pointSourceFrame({ mSrc: mSun, OmegaSrc: OmAlong, r: aM, mRecv: mP, Rself, selfType: type, reading, wBg });
        const x = F.OmegaF / nMean, gR = L.firstOrderGuide({ OmegaF: F.OmegaF, n: nMean }), gF = L.firstOrderGuide({ OmegaF: F.OmegaF, n: nMean, axes: 'fixed' });
        return { reading, rule, selfType: type, bgMul, beta: F.beta, OmegaF: F.OmegaF, OmegaFOverSun: F.OmegaF / OmAlong, x, reductionRigid: L.demandReduction({ x }), reductionFixed: L.demandReduction({ x, axes: 'fixed' }),
          periRigidArcsecCentury: gR.periRate * cen / PLAN.arcsec, periFixedArcsecCentury: gF.periRate * cen / PLAN.arcsec, periodShiftRigid: gR.periodShift, periodShiftFixed: gF.periodShift };
      };
      readings.push(mk('field', null, null));
      for (const rule of PLAN.selfRules) for (const t of WT.SELF_TYPES) readings.push(mk('receiver', rule, t));
    }
    return { name: PLAN.planetNames[k], index: pi, aM, ecc, n: nMean, OmegaSunAlong: OmAlong, OmegaSunOverN: OmAlong / nMean, mKg: mP, radiusM: RP, RdM: WT.kappaMRadius(mP), wSun: WT.pointWeight(mSun, aM, 2), pn1ArcsecCentury: pn1, readings };
  });
  return { sun: { mKg: mSun, OmegaSpin: OmSun, axis: aSun, RdM: WT.kappaMRadius(mSun) }, wCos, rows, note: '源は太陽だけ(惑星の重みは太陽の 1e-5 以下の桁 —— 宣言)・太陽の自転を軌道の法線へ射影・点の重み m/r²・本の JSON を読むだけ' };
}

/* ───────── R 土星の環 ───────── */
export function partRings(HP, wCos) {
  const book = clone(HP.allPresets().find((p) => p.id === RING_ID)), se = book.scaleExp, uL = 10 ** se.L, uT = 10 ** se.T, uM = 10 ** se.M;
  const sat = book.bodies[0], mSat = sat.m * uM, OmSat = sat.spin / uT, RSat = sat.radius * uL;
  const bands = book.bodies.filter((b) => b.type === 'ring').map((b) => ({ rIn: b.rIn * uL, rOut: b.rOut * uL }));
  const names = ['C', 'B', 'A'], edges = [];
  bands.forEach((b, k) => { edges.push({ band: names[k] || String(k), edge: 'in', r: b.rIn }); edges.push({ band: names[k] || String(k), edge: 'out', r: b.rOut }); });
  const GM = PLAN.G * mSat;
  const rows = edges.map((e) => {
    const n = Math.sqrt(GM / (e.r ** 3)), j2n = 0.75 * PLAN.saturnJ2 * (PLAN.saturnJ2RefM / e.r) ** 2, j2peri = 1.5 * PLAN.saturnJ2 * (PLAN.saturnJ2RefM / e.r) ** 2 * n;
    const readings = [];
    for (const bgMul of [0, 1]) {
      const wBg = bgMul * wCos;
      const mk = (reading, rule, type, a) => {
        const mP = a === null ? null : 4 / 3 * Math.PI * a ** 3 * PLAN.iceDensity, Rself = rule === null ? null : rule === 'kappaM' ? WT.kappaMRadius(mP) : a;
        const F = L.pointSourceFrame({ mSrc: mSat, OmegaSrc: OmSat, r: e.r, mRecv: mP, Rself, selfType: type, reading, wBg });
        const x = F.OmegaF / n;
        return { reading, rule, selfType: type, particleRadiusM: a, bgMul, beta: F.beta, OmegaF: F.OmegaF, x, reductionRigid: L.demandReduction({ x }), reductionFixed: L.demandReduction({ x, axes: 'fixed' }),
          xOverJ2: x / j2n, periRigidOverJ2: F.OmegaF / j2peri };
      };
      readings.push(mk('field', null, null, null));
      for (const a of PLAN.ringParticleRadii) for (const rule of PLAN.selfRules) for (const t of WT.SELF_TYPES) readings.push(mk('receiver', rule, t, a));
    }
    return Object.assign({}, e, { n, OmegaSatOverN: OmSat / n, j2FreqShift: j2n, j2PeriRate: j2peri, readings });
  });
  return { saturn: { mKg: mSat, OmegaSpin: OmSat, spinHours: 2 * Math.PI / OmSat / 3600, radiusM: RSat, RdM: WT.kappaMRadius(mSat) }, bands, wCos, rows,
    note: '面内の遠心だけ(環の厚みは扱わない)・源は土星の自転だけ(衛星・環の自己重力の重みは入れない —— 宣言)・点の重み m/r²(J2 の重みは入れない)・本の JSON を読むだけ' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const Dk = J.disk, S = J.solar, Rg = J.rings;
  const findRow = (rows, f) => rows.find(f);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    requiredTable: J.required.n >= 40 && J.required.rows.filter((q) => q.why === null).every((q) => Number.isFinite(q.reqRigid) && Number.isFinite(q.reqFixed) && Math.sign(q.reqRigid) === Math.sign(q.vObs - q.vBar)
      && (q.reqRigid === 0 || Math.abs(q.reqFixed / q.reqRigid - (q.vObs + q.vBar) / q.vObs) <= 1e-12)),
    gridComplete: Dk.n === PLAN.gridSpins.length * PLAN.gridDisc.length * PLAN.gridBgMul.length * (PLAN.gridSelfTypes.length * PLAN.gridF.length + 1) && Dk.grid.every((q) => q.degenerate === false && q.ok === true),
    gridSolved: Dk.grid.every((q) => q.solve.converged === true && q.solve.directVsIterRel <= 1e-9 && q.solve.residualRel <= 1e-10),
    controlIsVbar: Dk.grid.every((q) => q.control.resOuter.n > 0) && Dk.side.main.control.resOuter.rms === Dk.grid[0].control.resOuter.rms,
    degenerateRecorded: Dk.side.noCenterField.degenerate === true && Dk.side.noCenterReceiver.degenerate === false && Dk.side.noCenterReceiver.ok === true,
    sideSolved: Object.entries(Dk.side).filter(([k]) => k !== 'noCenterField').every(([, q]) => q.ok === true && q.solve.converged === true && q.solve.residualRel <= 1e-10),
    bgDilutes: (() => { const a = Dk.grid.filter((q) => q.decl.bgMul === 0 && q.decl.sourceSpin === 'sync'), b = Dk.grid.filter((q) => q.decl.bgMul === 1 && q.decl.sourceSpin === 'sync'); return a.length === b.length && a.length > 0 && a.every((q, i) => b[i].vMax <= q.vMax * (1 + 1e-12)); })(),
    solarTable: S.rows.length === PLAN.planets.length && S.rows.every((r) => r.readings.length === 2 * (1 + PLAN.selfRules.length * 3) && r.readings.every((q) => Number.isFinite(q.OmegaF) && Number.isFinite(q.x))
      && Math.abs(findRow(r.readings, (q) => q.reading === 'field' && q.bgMul === 0).OmegaFOverSun - 1) <= 1e-12),
    ringTable: Rg.rows.length === 6 && Math.abs(Rg.saturn.spinHours - 10.56) < 0.01 && Rg.rows.every((r) => Math.abs(findRow(r.readings, (q) => q.reading === 'field' && q.bgMul === 0).beta - 1) <= 1e-12),
  };
}
export function runAll(HP, root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const FX = readFixture(root); mark('inputs');
  const wCos = L.cosmicBackgroundWeight({ H0: PLAN.H0kmsMpc * 1e3 / (KPC * 1e3), c: PLAN.c, G: PLAN.G });
  const required = partRequired(FX); mark('required');
  const disk = partDisk(FX, wCos); mark('disk');
  const solar = partSolar(HP, wCos); mark('solar');
  const rings = partRings(HP, wCos); mark('rings');
  const J = { inputs: { fixtureSha256Same: FX.shaSame, fixtureVersion: FX.J.version, fixtureRows: FX.rows.length }, background: { wCos, source: PLAN.H0Source }, pure, required, disk, solar, rings, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W331B_TARGET || 'beta/index.html';
  const OUT = process.env.W331B_OUT ? (path.isAbsolute(process.env.W331B_OUT) ? process.env.W331B_OUT : path.join(ROOT, process.env.W331B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第331便b centrifugal(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w331b-centrifugal.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の追記(2026-11-09)「回転引きずりで空間を引きずる事による大きな影響は、遠心力を弱める事で有る」(作業仮説 —— 診断で検査)・原仮定者の整理(2026-11-09)「引きずりは、相対的な移動回転に、m/r^2 の重みが付く」「慣性力は、自分自身の引きずり」・原仮定者の決断(2026-11-09 —— AN593 = B〔自己の重み × 離散化の 2 次元の表・速度の絶対値と残差〕・AN595 = A〔Ω_p は格子〕)・統括の検証項目 R311',
    decl: L.DECL, plan: PLAN, axesTypes: L.AXES_TYPES, frameReadings: L.FRAME_READINGS, sourceSpins: L.SOURCE_SPINS, centerRots: L.CENTER_ROTS, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w331b-centrifugal.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs',
    'tests/lib-w329b-galrot.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第331便b', target: TARGET, code: CODE, inputs: [TARGET, FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'centrifugal', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ と 💍 の本の宣言を読むだけ(步を進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

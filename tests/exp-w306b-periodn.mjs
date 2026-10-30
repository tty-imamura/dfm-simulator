// 第306便b(DECISIONS v64 AN336 ③・AN333・AN335 ③・第95報・AN332 の裁定・原仮定者の裁定(第97報)AN336・統括の検証項目 R205)——
// **周期による G_loc の n の識別の器**: 平均経度の周期の抽出器・n ごとの周期の表(同じ初期状態)・n ごとに初速/GM を合わせ直した写し・
// 共通の太陽の GM で残る惑星間の P²/a³ の型・時刻系の対応の記録・🌦️ の恒星月の n の欄
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、アプリの三次元の步をそのまま走らせる・1 プロセス)。
//
// ■ 何を写したか(html・本の宣言・エンジンの式は変えない —— 器の中の写し)
//   ・惑星 7 本(🌡️🌋🔴🏀🟡🔷💙)の physics・bodies・scaleExp・timeRef は**凍結のデータ tests/data-w305b-declbdb.json**(第305便b の写し)に固定する。
//     この写しは基点 02ca93b(第305便の確定)の宣言と同一(physics・bodies・scaleExp・timeRef の 4 欄 × 8 本 —— 第306便b で照合。器は写しの正準 JSON の
//     sha256 を PIN_DECL_SHA256 に持ち、門 pinFrozen で照合する)。枝 a が在位の 7 本の宣言を変えても本器の数は動かない(生きている宣言と同じかは pin.liveSame に記録するだけ)。
//   ・🌦️ earthMoonSunInertial3d は凍結のデータ tests/data-w306b-decl305.json(02ca93b の宣言 —— 地球の J₂ を含む)に固定する(段 E の取り直し)。
//   ・写しの引きずり: W_bg = W_ext(W_cos + W_gal —— 第302便c の推定)・inertialR2:{lambdaRs:k, sources:"all", denom:"pair"}(λ ∝ m・対ごとの正規化・自己なし)。
//     二体では対 = 行(R_ij = 1 —— 段 Z の pairRowBitSame でビット同一を確かめる)。G_loc: n = 2 は gLoc:{law:"kappaC2"}・n = +1 は {law:"cRatio"}・n = 0 は無し。
//   ・k は 1PN + A1 の標的の値(n = 2/+1/0 → 4.999862/3.999863/2.99986 —— 第305便b の参考の行・枝 a が作り直す)。**k は宣言から読める**: 既定は正本
//     tests/out/gfamily-w305b.json の水星の参考の行(targetKind "ref")・生きている 🌡️ の宣言に gLoc kappaC2 と inertialR2.lambdaRs があれば n = 2 の k はその値
//     (枝 a の宣言の後の世代)・環境変数 W306B_K(JSON)で上書き。読んだ出所は正本の k.source に記録する。
//   ・対照は引きずり OFF・G_loc なし。差 = 写し − 対照(同じ刻み・同じ初期状態)。
//
// ■ 段(正本 tests/out/periodn-w306b.json —— 段 periodn-306b)。W306B_PARTS=Z,P,R,G,T,E で段を選ぶ(正本は全段)・W306B_OUT で出力先・
//   W306B_PLANETS(煙試験だけ —— 本の ID をカンマで)・W306B_E_RUN=0 で段 E の取り直しを省く(転記だけ)
//   Z  抽出器の自己試験(解析のケプラー・1PN の試験粒子)・写しの記録・対 = 行のビット同一・エンジンの対照(ケプラーの二体)での検算(h/h2/h4 → 2π√(a₀³/μ))
//   P  n ごとの平均経度の周期の表(同じ初期状態): 7 本 × {対照・n = 2/+1/0・G_loc だけ n = 2/+1} × h/h2/h4 —— 平均経度の周期の変化(s と相対)・
//      「初期の方向を通る間隔」(runPl3 の恒星周期)との差と近点の移動の幾何の式・近点周期・近点率・平均の半長径(近点・遠点の距離の平均 a_geo と接触の a の平均)・
//      窓(前半/後半/近点から)の表
//   R  1 本ずつの合わせ直し: 惑星ごとに 1 量(初速の大きさ s、または本の G の比 = その惑星が見る GM)を n = 0 の平均経度の周期に揃え、残る n の差
//      (a_geo・離心率・近点率・初期の方向を通る間隔)と P²/a³ の量 x の不変(力の法則の性質 —— 初期状態に依らない)
//   G  共通の太陽の GM: x_j = 4π² a_j³/(P_j² μ_j) − 1 の対照との差 Δx_j を n ごとに・1/a(r_s/a_j)の型の当てはめ・水星で揃えた/7 本の最小二乗の残り・
//      n の差(n − 0)の残りを周期と半長径の換算で・観測の側の桁(記録の有効数字・記録の間の差・半長径の定義・座標の定義・時刻系の共通の率)と並べる
//      (**観測との照合はしない** —— 型と大きさの比較だけ)
//   T  時刻系の対応の記録: 7 本の周期の記録・🌦️ の恒星月・🟪 の周期の行の原資料の時間標準・既換算か・モデルの時間(絶対時間)との対応の候補・換算の要否
//      (**換算は適用しない** —— AN333 の四条件)と、周期の n の差の大きさ・TT/TDB・L_B・α⊕ の換算(2ψ⊕P)の大きさ
//   E  🌦️ の恒星月の n の欄(AN335 ③): 正本 tests/out/pairnorm-w305a.json の恒星月の行を来歴つきで転記・J₂ ありの今の基線(02ca93b の宣言の写し)で
//      引きずり OFF と n = 2・対(k = 1PN + A1 の値)の 1 行を取り直す(刻み h・長窓 1062 公転)
//
// ■ しないこと・言わないこと
//   ・本の宣言・html・エンジンの式・S._core を変えない。観測の周期と照合しない(時刻系・半長径の定義・座標の対応が未定 —— AN333)。換算を適用しない。
//   ・同じ初期状態の周期の差は診断(n を識別したと言わない)。共通の GM の型は「梃子になりうるか」の大きさの比較だけ。
//   ・届かないものは「この探索範囲では未達 —— 次の見直し」。
//
// 実行(Node だけ・1 プロセス): node tests/exp-w306b-periodn.mjs → 正本 tests/out/periodn-w306b.json
//   node tests/exp-w306b-periodn.mjs --tables → 正本から PHYSICS〔第306便b〕の表を標準出力へ(文書の作り直し)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta, sha256File } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as ML from './lib-w306b-meanlon.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as G5 from './exp-w305b-gfamily.mjs';
import * as B from './exp-w303b-inertialr2.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as EM from './exp-w303c-earthmoon.mjs';
import { pinDecl315c, LEGACY7_DATA_FILE } from './lib-w315c-legacy7.mjs';   // 第315便c(決断事項 AN406・R244): 在位の 7 本を K1 へ移した世代では、この器は移行の前(af2f426)の宣言の写しで測る
// 第319便c(原仮定者の指示(第121報)・R260): presets は "all" から名指しの本へ(器と lib の deriveScope の下限 ∪ 器が読む凍結の写しの本)
const REGEN_SCOPE = {"presets":["chainDiskToy3d","earthMoon","earthMoonInertial","earthMoonOnly3d","earthMoonSunInertial","earthMoonSunInertial3d","earthMoonSunInertialFit","emAuditSolar","gas","jupiterGalilean","jupiterSunInertial3d","marsMoonsReal","marsSunInertial3d","mercury","mercuryReal","mercurySunInertial","mercurySunInertial3d","mercurySunInertialFit","neptuneReal","neptuneSunInertial3d","plutoCharonDiagInput","plutoCharonInertial","plutoCharonInertialFit","saturn","saturnRingReal","saturnSunInertial3d","uranusReal","uranusSunInertial3d","venusReal","venusSunInertial3d"],"roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.DRAG_CORE_RMAX_FACTOR","HP.DRAG_CORE_VERSION","HP.FIT_COND_VERSION","HP.GLOC_VERSION","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_I2_VERSION","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_PAIRNORM_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.dragCoreState","HP.fitCondSig","HP.gLocPeriAdvance","HP.gLocState","HP.geoEffectiveMode","HP.geoLawOfSim","HP.inertialDragLedgerOf","HP.inertialDragState","HP.inertialR2Q","HP.inertialR2State","HP.sim","HP.synodic","HP.validateFitRecord","HP.validatePreset","HP.wbgEstimateOf","LAWS","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDrag3Build","dfmInertialDrag3Solve","dfmInertialDragStep","dfmInertialDragStep3","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragComposeBuild","inertialDragComposeSolve","inertialDragI2Apply","inertialDragNormApply","inertialDragPairApply","inertialDragPairState","inertialDragShellApply","inertialR2SumOf","pnSource","relDragCoefficientOf","relDragPairNormOf","relDragSolveFromOf","synUniform","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w306b-periodn-1';
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const PARTS = (process.env.W306B_PARTS || 'Z,P,R,G,T,E').split(',');
const clone = (x) => JSON.parse(JSON.stringify(x));
const ARCSEC = 180 * 3600 / Math.PI;
export const DECL_FILE = G5.DECL_FILE;                                   // tests/data-w305b-declbdb.json(惑星 7 本と 🟫 —— 02ca93b と同一)
export const EM_DECL_FILE = 'tests/data-w306b-decl305.json';             // 🌦️(02ca93b —— 地球の J₂ を含む)
export const EM_PIN = JSON.parse(fs.readFileSync(new URL('./data-w306b-decl305.json', import.meta.url), 'utf8'));
/** 惑星の写しの正準 JSON(PIN.decl)の sha256 —— 第306便b で 02ca93b の宣言(physics・bodies・scaleExp・timeRef × 8 本)と同一を確かめた写しの指紋。 */
export const PIN_DECL_SHA256 = '75eb952e14025db915f0884713993941ea01e8c6dfaff8b77878419317eaaf79';
export const PIN_SAME_02CA93B = Object.freeze({ checkedIn: '第306便b', html: 'beta/_w306_base.html(02ca93b・sha256 57c21ec8d54f)', fields: Object.freeze(['physics', 'bodies', 'scaleExp', 'timeRef']), books: 8,
  note: 'tests/data-w305b-declbdb.json(基点 bdb7ae5 の写し)は 02ca93b の宣言と 4 欄 × 8 本で同一 —— 第305便は惑星 7 本と 🟫 の宣言を変えていない。再利用する(新しい写しは作らない)' });
export const PLANETS = G5.PLANETS, MERCURY = G5.MERCURY;
export const DIVS = Object.freeze([1, 2, 4]);
export const DIVS_R = Object.freeze([2, 4]);
export const N_WIN = 8;
export const K_HARM = 3;                  // 平均経度の回帰の位置の黄経の調和の数(第306便b の検算で K = 3 と 6 の差は 1e-6 s 未満 —— 水星)
export const EVERY = 16;                  // 記録の間引き(刻み h で 16 步ごと —— h/d では 16d 步ごと: 同じ時刻に記録する)
export const DELTA_FD = 1e-6;             // 合わせ直しの微分の差分の幅(初速の大きさ・本の G の比)
export const E_SWITCH = 0.06;             // 低離心率の作業上の切替値(AN330 —— 近点の時刻の窓と近点の検算は e ≥ 0.06 の本で)
/** n の族(第95報・AN332 の裁定: n = 2 を先・n = +1 は次点・n = 0 は対照)。 */
export const N_CASES = Object.freeze([
  Object.freeze({ key: 'n2', n: 2, gl: Object.freeze({ law: 'kappaC2' }), label: 'n = 2(kappaC2)' }),
  Object.freeze({ key: 'n1', n: 1, gl: Object.freeze({ law: 'cRatio' }), label: 'n = +1(cRatio)' }),
  Object.freeze({ key: 'n0', n: 0, gl: null, label: 'n = 0(G_loc なし)' }),
]);
/** k の既定(第305便b の参考の行 —— 1PN + A1 の標的・h/4 の根)。正本 gfamily-w305b.json が読めないときだけ使う。 */
export const K_REF305 = Object.freeze({ n2: 4.999862, n1: 3.999863, n0: 2.99986 });
/** 物理の定数(換算の大きさの記録だけ —— 判定に使わない)。GM☉・GM⊕ は IAU 2015 の公称値・au は IAU 2012 B2・地球の赤道半径の公称値・c は定義値・
 *  L_B(TCB と TDB の率の差)は IAU 2006 B3・L_G(TCG と TT)は IAU 2000 B1.9・TDB − TT の周期項の主な振幅 1.657 ms(Fairhead & Bretagnon 1990 の年周項)。
 *  第305便e(charonaudit-w305e)の CONST と同じ値(L_B・L_G・振幅を足した)—— 一次資料はこの便で開いていない(公表値の転記)。 */
export const CONST = Object.freeze({ GMsun: 1.32712440018e20, au: 1.495978707e11, GMearth: 3.986004418e14, Rearth: 6.3781e6, c: 299792458,
  LB: 1.550519768e-8, LG: 6.969290134e-10, tdbAmp: 1.657e-3 });

/* ── 写し ── */
const canonDeclSha = () => crypto.createHash('sha256').update(JSON.stringify(G5.PIN.decl)).digest('hex');
export function liveSameEm(HP) {
  const p = G5.findPreset(HP, 'earthMoonSunInertial3d'), d = EM_PIN.decl.earthMoonSunInertial3d;
  return !!p && ['physics', 'bodies', 'scaleExp', 'timeRef', 'orbitObs'].every((k) => JSON.stringify(p[k]) === JSON.stringify(d[k]));
}
/** k の出所(既定 → 正本 gfamily-w305b の参考の行 → 生きている 🌡️ の宣言の n = 2 → 環境変数 W306B_K)。 */
export function kOfN(HP) {
  const k = Object.assign({}, K_REF305), src = { n2: 'K_REF305(既定)', n1: 'K_REF305(既定)', n0: 'K_REF305(既定)' };
  try {
    const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'gfamily-w305b.json'), 'utf8'));
    for (const C of N_CASES) { const r = J.mercury.rows.find((z) => z.key === C.key && z.targetKind === 'ref'); if (r && Number.isFinite(r.x)) { k[C.key] = r.x; src[C.key] = 'tests/out/gfamily-w305b.json の水星の参考の行(1PN + A1・targetKind ref)'; } }
  } catch (e) { /* 既定のまま */ }
  const live = G5.findPreset(HP, MERCURY), rd = live && live.physics && live.physics.relativeDrag, gl = live && live.physics && live.physics.gLoc;
  const liveK = (rd && rd.inertialR2 && Number.isFinite(rd.inertialR2.lambdaRs) && gl && gl.law === 'kappaC2') ? rd.inertialR2.lambdaRs : null;
  if (liveK !== null) { k.n2 = liveK; src.n2 = '生きている 🌡️ の宣言(gLoc kappaC2・inertialR2.lambdaRs)'; }
  if (process.env.W306B_K) { const o = JSON.parse(process.env.W306B_K); for (const C of N_CASES) if (Number.isFinite(o[C.key])) { k[C.key] = o[C.key]; src[C.key] = '環境変数 W306B_K'; } }
  return { k, source: src, liveDeclK: liveK, ref305: K_REF305 };
}
/**
 * 写しの組み立て: c = {k(λ ∝ m の k —— null は引きずり OFF), gl(G_loc の宣言 —— null は無し), vs(相対の初速の大きさの比), gs(本の G の比 —— その惑星が見る GM)}。
 * 初速の比は相対の速度に掛け、重心の速度と全運動量は 0 のまま(位置は同じ)。GM の比は **本の G** に掛ける(エンジンは質量を Float32Array で持つので、質量では
 * 1e-8 の比を表せない —— 第306便b の検算: 太陽の質量 1988.5 × (1 + 2.76e-8) は 1988.5 に丸まる。G は倍精度)。G は G_loc の ψ と引きずりの r_s にも同じく効く。
 */
export function caseOf(base, wExt, c) {
  const q = G5.caseOf(base, wExt, { k: c.k === undefined ? null : c.k, gl: c.gl || null });
  if (c.k !== null && c.k !== undefined) q.physics.relativeDrag.inertialR2.denom = 'pair';
  const vs = c.vs === undefined ? 1 : c.vs, gs = c.gs === undefined ? 1 : c.gs;
  if (vs !== 1) {
    const b0 = q.bodies[0], b1 = q.bodies[1], m0 = b0.m, m1 = b1.m, Mt = m0 + m1;
    for (const v of ['vx', 'vy', 'vz']) {
      const V = (m0 * b0[v] + m1 * b1[v]) / Mt, w = (b1[v] - b0[v]) * vs;
      b0[v] = V - (m1 / Mt) * w; b1[v] = V + (m0 / Mt) * w;
    }
  }
  if (gs !== 1) q.physics.G = q.physics.G * gs;
  return q;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;

/* ── 1 走行(三次元 —— 8 公転・平均経度の抽出器と近点率と検出器 B の事象を同じ走行から)── */
const MEMO = new Map();
export const STATS = { measures: 0, memoHits: 0, emRuns: 0 };
const geoOf = (R, t1) => {
  const rp = R.ev.peri.filter((z) => z.t <= t1).map((z) => z.r), ra = R.ev.apo.filter((z) => z.t <= t1).map((z) => z.r);
  if (!rp.length || !ra.length) return { a: null, e: null };
  const p = rp.reduce((s, x) => s + x, 0) / rp.length, q = ra.reduce((s, x) => s + x, 0) / ra.length;
  return { a: (p + q) / 2, e: (q - p) / (q + p), nPeri: rp.length, nApo: ra.length };
};
export function measure(HP, q, div, h) {
  const dt = h / div, every = EVERY * div;
  const key = JSON.stringify([q.id, q.physics, q.bodies]) + '|' + dt + '|' + every;
  if (MEMO.has(key)) { STATS.memoHits++; return MEMO.get(key); }
  STATS.measures++;
  const Tsec = Math.pow(10, q.scaleExp.T);
  let smp = null, mu = null;   // μ はエンジンが持つ値(G は倍精度・質量は Float32Array)から
  const R = AP.captureSim(HP, (s) => { mu = s.params.G * (s.m[0] + s.m[1]); smp = ML.attachMeanLon(s, { ci: 0, oi: 1, mu, every }); }, () => PL.runPl3(HP, q, { dt, revMax: N_WIN }));
  const w = PL.windowOf(R, N_WIN, Tsec), rev = R.ev.rev, t1 = rev[N_WIN - 1], s = smp.samples();
  const fit = (t0, t1_) => ML.meanLonFit(s, { t0, t1: t1_, K: K_HARM });
  const main = fit(0, t1), h1 = fit(0, rev[3]), h2 = fit(rev[3], t1), pe = R.ev.peri.filter((z) => z.t <= t1);
  const pw = pe.length >= 6 ? fit(pe[0].t, pe[pe.length - 1].t) : null;
  const ap = AP.apsisRate({ t: s.t, eP: s.eP, eQ: s.eQ, th: s.th }, { t0: 0, t1, K: K_HARM });
  const g = geoOf(R, t1);
  const r = { Plam: main.P, PM: main.PM, nLam: main.nLam, nM: main.nM, varpiLM: main.varpiRate, varpiAP: ap ? ap.rate : null, varpiAt: ap ? ap.varpi : null, eAP: ap ? ap.e : null,
    aOsc: main.aMean, eOsc: main.eMean, aGeo: g.a, eGeo: g.e, Pcross: w.periodUnits, rmsLam: main.rms.lam, nSamp: main.n,
    win: { half1: h1 ? h1.P : null, half2: h2 ? h2.P : null, peri: pw ? pw.P : null }, t1, steps: R.steps, nan: R.nan, complete: w.complete === true, mu, Tsec };
  MEMO.set(key, r);
  return r;
}

/* ── 本ごとの文脈 ── */
const CTX = new Map();
let KN = null;
export function ctx(HP, id) {
  if (CTX.has(id)) return CTX.get(id);
  const base = G5.pinned(HP, id), h = hOf(base), wExt = B.wExtOf(HP, base).book, f = B.pn1Formula(base), Tsec = Math.pow(10, base.scaleExp.T);
  const G = base.physics.G, c0 = base.physics.cLight, M = base.bodies[0].m, m = base.bodies[1].m, rs = 2 * G * M / (c0 * c0), Lm = G5.lenM(base);
  const c = { id, emoji: base.emoji, base, h, wExt, f, Tsec, Lm, mu: G * (M + m), rs, u: rs / f.a, mOverM: m / M, PK: f.P };
  CTX.set(id, c);
  return c;
}
const specOf = (key) => {
  if (key === 'ctl') return { k: null, gl: null };
  const C = N_CASES.find((z) => z.key === key); if (C) return { k: KN.k[key], gl: C.gl };
  if (key === 'g2') return { k: null, gl: N_CASES[0].gl };
  if (key === 'g1') return { k: null, gl: N_CASES[1].gl };
  throw new Error('写しの鍵が無い: ' + key);
};
const run = (HP, c, key, div, extra = {}) => measure(HP, caseOf(c.base, c.wExt, Object.assign(specOf(key), extra)), div, c.h);
/** P²/a³ の量 x = 4π²a³/(P²μ) − 1(a は本の長さ・P は本の時間 —— 無次元) */
export const xOf = (a, P, mu) => 4 * Math.PI * Math.PI * a * a * a / (P * P * mu) - 1;
/** 初期の方向を通る間隔と平均経度の周期の差の一次の式: (ϖ̇P²/2π)(1 − g)・g = (1 − e²)^{3/2}/(1 + e cos f₀)²・f₀ = −ϖ(基底 P̂ = 初期の位置の方向) */
export const crossGeomOf = (r) => (r.varpiAP === null) ? null : r.varpiAP * r.Plam * r.Plam / (2 * Math.PI) * (1 - G5.anomGeomOf(r.eAP, r.varpiAt));

/* ── 段 Z ── */
export function partZ(HP, log = console.log) {
  const out = { selfTest: ML.meanLonSelfTest(), apsisSelfTest: AP.apsisSelfTest().ok };
  for (const s of out.selfTest.cases) log('Z ' + s);
  // 対 = 行(二体 —— R_ij = 1): 水星の n = 2 の写しで denom pair と row(省略)を 1 公転の終わりの状態でビット比較
  const c = ctx(HP, MERCURY), qp = caseOf(c.base, c.wExt, specOf('n2')), qr = clone(qp); delete qr.physics.relativeDrag.inertialR2.denom;
  const fin = (q) => { let S = null; AP.captureSim(HP, (s) => { S = s; }, () => PL.runPl3(HP, q, { dt: c.h, revMax: 1 })); return [S.x, S.y, S.z, S.vx, S.vy, S.vz].map((a) => Array.from(a.slice(0, 2))); };
  const A = fin(qp), Bv = fin(qr);
  out.pairRowBitSame = A.every((arr, i) => arr.every((v, j) => Object.is(v, Bv[i][j])));
  log(`Z 対 = 行(水星・n = 2・1 公転の終わりの状態): ビット同一 ${out.pairRowBitSame}`);
  // 調和の数 K の効き(水星の対照・刻み h・8 公転 —— K = 0/3/6 の P_λ)
  { const q = caseOf(c.base, c.wExt, specOf('ctl')); let smp = null;
    const R = AP.captureSim(HP, (s) => { smp = ML.attachMeanLon(s, { ci: 0, oi: 1, mu: s.params.G * (s.m[0] + s.m[1]), every: EVERY }); }, () => PL.runPl3(HP, q, { dt: c.h, revMax: N_WIN }));
    const t1 = R.ev.rev[N_WIN - 1], Ps = [0, 3, 6].map((K) => ML.meanLonFit(smp.samples(), { t0: 0, t1, K }).P * c.Tsec);
    out.harmK = { K: [0, 3, 6], PlamS: Ps, d03: Ps[0] - Ps[1], d36: Ps[1] - Ps[2], note: '水星の対照・刻み h・8 公転' };
    log(`Z 調和の数 K(水星の対照・h): P_λ の差 K0 − K3 ${out.harmK.d03.toExponential(3)} s・K3 − K6 ${out.harmK.d36.toExponential(3)} s`); }
  return out;
}

/* ── 段 P: n ごとの周期の表(同じ初期状態)── */
const P_KEYS = Object.freeze(['ctl', 'n2', 'n1', 'n0', 'g2', 'g1']);
export function partP(HP, log = console.log) {
  const rows = [];
  for (const id of PLANETS) {
    const c = ctx(HP, id), R = {};
    for (const key of P_KEYS) R[key] = DIVS.map((d) => run(HP, c, key, d));
    const L = DIVS.length - 1, sec = (x) => x * c.Tsec, ctl = R.ctl;
    const P4 = ctl[L].Plam, P2 = ctl[L - 1].Plam;
    const ctlRow = { Plam: ctl.map((r) => sec(r.Plam)), Pcross: ctl.map((r) => sec(r.Pcross)), PM: ctl.map((r) => sec(r.PM)), PK: sec(c.PK),
      richardson: sec(2 * P4 - P2), richMinusPK: sec(2 * P4 - P2 - c.PK), richRel: (2 * P4 - P2) / c.PK - 1,
      aGeo: ctl[L].aGeo, aOsc: ctl[L].aOsc, eGeo: ctl[L].eGeo, varpiAP: ctl[L].varpiAP, crossMinusLam: sec(ctl[L].Pcross - ctl[L].Plam), crossGeom: sec(crossGeomOf(ctl[L])),
      xGeo: xOf(ctl[L].aGeo, P4, ctl[L].mu), xOsc: xOf(ctl[L].aOsc, P4, ctl[L].mu), nan: ctl.some((r) => r.nan || !r.complete) };
    const byN = {};
    for (const C of N_CASES) {
      const T = R[C.key], gk = C.n === 2 ? 'g2' : (C.n === 1 ? 'g1' : null), Gr = gk ? R[gk] : ctl;
      const d = (q, arr = T) => arr.map((r, i) => r[q] - ctl[i][q]);
      const dP = d('Plam').map(sec), dG = d('Plam', Gr).map(sec), dPx = d('Pcross').map(sec), dPM = d('PM').map(sec);
      const ne = (a) => Math.abs(a[L] - a[L - 1]);
      const xg = T.map((r, i) => xOf(r.aGeo, r.Plam, r.mu) - xOf(ctl[i].aGeo, ctl[i].Plam, ctl[i].mu)), xo = T.map((r, i) => xOf(r.aOsc, r.Plam, r.mu) - xOf(ctl[i].aOsc, ctl[i].Plam, ctl[i].mu));
      const cm = T.map((r, i) => sec((r.Pcross - r.Plam) - (ctl[i].Pcross - ctl[i].Plam))), cg = T.map((r, i) => sec(crossGeomOf(r) - crossGeomOf(ctl[i])));
      const winD = (wk) => (T[L].win[wk] === null || ctl[L].win[wk] === null) ? null : sec(T[L].win[wk] - ctl[L].win[wk]);
      byN[C.key] = { n: C.n, k: KN.k[C.key], dPlam: dP, dPlamRel: dP[L] / sec(P4), numErr: ne(dP), gLoc: dG, drag: dP.map((x, i) => x - dG[i]), dPcross: dPx, numErrCross: ne(dPx), dPM: dPM,
        crossMinusLam: cm, crossGeom: cg, crossResid: cm[L] - cg[L],
        dVarpi: AP.toArcsecPerCentury(T[L].varpiAP - ctl[L].varpiAP, c.Tsec), dVarpiLM: AP.toArcsecPerCentury(T[L].varpiLM - ctl[L].varpiLM, c.Tsec),
        dAgeoRel: (T[L].aGeo - ctl[L].aGeo) / c.f.a, dAoscRel: (T[L].aOsc - ctl[L].aOsc) / c.f.a, dEgeo: T[L].eGeo - ctl[L].eGeo, dEosc: T[L].eOsc - ctl[L].eOsc,
        dxGeo: xg, dxOsc: xo, numErrX: ne(xg), win: { main: dP[L], half1: winD('half1'), half2: winD('half2'), peri: winD('peri') },
        nan: T.some((r) => r.nan || !r.complete) };
    }
    const sep = (a, b) => ({ d: byN[a].dPlam[L] - byN[b].dPlam[L], err: byN[a].numErr + byN[b].numErr, ratio: Math.abs(byN[a].dPlam[L] - byN[b].dPlam[L]) / (byN[a].numErr + byN[b].numErr) });
    const row = { id, emoji: c.emoji, e: c.f.e, a0: c.f.a, aKm: c.f.a * c.Lm / 1000, u: c.u, mOverM: c.mOverM, Tsec: c.Tsec, h: c.h, ctl: ctlRow, byN, sep20: sep('n2', 'n0'), sep10: sep('n1', 'n0'), sep21: sep('n2', 'n1') };
    rows.push(row);
    log(`P ${c.emoji}: 平均経度の周期の変化 [s] n2 ${byN.n2.dPlam[L].toExponential(5)}・n1 ${byN.n1.dPlam[L].toExponential(5)}・n0 ${byN.n0.dPlam[L].toExponential(5)}(数値の誤差 ${byN.n0.numErr.toExponential(1)})・`
      + `n2−n0 ${row.sep20.d.toExponential(4)}(誤差の ${row.sep20.ratio.toExponential(2)} 倍)・Δx_geo/(r_s/a) n2 ${(byN.n2.dxGeo[L] / c.u).toFixed(4)} n0 ${(byN.n0.dxGeo[L] / c.u).toFixed(4)}・`
      + `対照 P_λ − 2π√(a₀³/μ)(リチャードソン)${ctlRow.richMinusPK.toExponential(3)} s`);
  }
  return { rows, divs: DIVS, window: N_WIN + ' 公転(t0 = 0 〜 8 回目の周回の時刻)・平均経度の回帰(位置の黄経の調和 K = ' + K_HARM + ')・記録は刻み h で ' + EVERY + ' 步ごと(h/d では ' + EVERY + 'd 步ごと —— 同じ時刻)',
    note: '同じ初期状態(本の写しの位置・速度・元期・GM)を固定した診断 —— 差 = 写し − 対照(引きずり OFF・G_loc なし)・数値の誤差 |h/2 − h/4|・G_loc だけ = G_loc の宣言だけの写し − 対照・引きずりの分 = 全体 − G_loc だけ' };
}

/* ── 段 R: 1 本ずつの合わせ直し ── */
export const R_METHODS = Object.freeze([
  Object.freeze({ key: 'speed', label: '初速の大きさ s(相対の速度に掛ける —— 位置と向きは同じ)', prm: (p) => ({ vs: p }) }),
  Object.freeze({ key: 'gm', label: '本の G の比(= その惑星が見る GM —— 相対の位置と速度は同じ)', prm: (p) => ({ gs: p }) }),
]);
export function partR(HP, P, log = console.log) {
  const rows = [];
  for (const id of PLANETS) {
    const c = ctx(HP, id), L = DIVS_R.length - 1, sec = (x) => x * c.Tsec;
    const base0 = DIVS_R.map((d) => run(HP, c, 'n0', d));
    for (const M of R_METHODS) {
      const plus = DIVS_R.map((d) => run(HP, c, 'n0', d, M.prm(1 + DELTA_FD)));
      const dPdp = DIVS_R.map((d, i) => (plus[i].Plam - base0[i].Plam) / DELTA_FD);
      for (const C of N_CASES.filter((z) => z.n !== 0)) {
        const one = DIVS_R.map((d) => run(HP, c, C.key, d));
        const pStar = DIVS_R.map((d, i) => 1 - (one[i].Plam - base0[i].Plam) / dPdp[i]);
        const fitd = DIVS_R.map((d, i) => run(HP, c, C.key, d, M.prm(pStar[i])));
        const D = (q, arr) => arr.map((r, i) => r[q] - base0[i][q]);
        const ne = (a) => Math.abs(a[L] - a[L - 1]);
        const resP = D('Plam', fitd).map(sec), before = D('Plam', one).map(sec);
        const dA = D('aGeo', fitd).map((x) => x / c.f.a), dAo = D('aOsc', fitd).map((x) => x / c.f.a), dE = D('eGeo', fitd), dEo = D('eOsc', fitd);
        const dV = fitd.map((r, i) => AP.toArcsecPerCentury(r.varpiAP - base0[i].varpiAP, c.Tsec)), dX = D('Pcross', fitd).map(sec), dPM = D('PM', fitd).map(sec);
        const x = (r) => xOf(r.aGeo, r.Plam, r.mu);
        const lawInv = fitd.map((r, i) => x(r) - x(one[i])), dxN = one.map((r, i) => x(r) - x(base0[i]));
        rows.push({ id, emoji: c.emoji, method: M.key, key: C.key, n: C.n, pStar, pStarMinus1: pStar.map((p) => p - 1), dPdp: dPdp.map(sec), before, resP, numErrResP: ne(resP),
          dAgeoRel: dA, dAgeoKm: dA.map((z) => z * c.f.a * c.Lm / 1000), numErrA: ne(dA), dAoscRel: dAo, dEgeo: dE, numErrE: ne(dE), dEosc: dEo, dVarpi: dV, numErrV: ne(dV), dPcross: dX, numErrCross: ne(dX), dPM,
          lawInv, dxN, lawInvRel: Math.abs(lawInv[L]) / Math.abs(dxN[L]) });
        const z = rows[rows.length - 1];
        log(`R ${c.emoji} ${M.key} ${C.key}: p*−1 ${z.pStarMinus1[L].toExponential(4)}・残る P_λ の差 ${z.resP[L].toExponential(2)} s(合わせる前 ${z.before[L].toExponential(4)})・Δa_geo ${z.dAgeoKm[L].toFixed(4)} km・Δe ${z.dEgeo[L].toExponential(2)}・`
          + `Δϖ̇ ${z.dVarpi[L].toExponential(3)}″/世紀・Δ(方向の間隔)${z.dPcross[L].toExponential(3)} s・x の不変 ${z.lawInvRel.toExponential(1)}`);
      }
    }
  }
  return { rows, divs: DIVS_R, delta: DELTA_FD, note: 'p* は n = 0(同じ初期状態)の平均経度の周期に揃える 1 量(初速の大きさ s または本の G の比 —— その惑星が見る GM)—— 微分は n = 0 の写しの差分(幅 ' + DELTA_FD + ')・一次の割線 1 回と検証の走行。差 = 合わせた n の写し − n = 0 の写し(同じ刻み)' };
}

/* ── 段 G: 共通の太陽の GM ── */
const lsq2 = (u, y) => { const n = u.length, su = u.reduce((s, x) => s + x, 0), sy = y.reduce((s, x) => s + x, 0), suu = u.reduce((s, x) => s + x * x, 0), suy = u.reduce((s, x, i) => s + x * y[i], 0);
  const C = (n * suy - su * sy) / (n * suu - su * su), g = (sy - C * su) / n; return { g, C, resid: y.map((v, i) => v - g - C * u[i]) }; };
const prop = (u, y) => { const C = u.reduce((s, x, i) => s + x * y[i], 0) / u.reduce((s, x) => s + x * x, 0); return { C, resid: y.map((v, i) => v - C * u[i]) }; };
const maxAbs = (a) => Math.max(...a.map((x) => Math.abs(x)));
export function partG(P, log = console.log) {
  const L = DIVS.length - 1, rows = P.rows, u = rows.map((r) => r.u), iM = rows.findIndex((r) => r.id === MERCURY);
  const fitOf = (y) => { const l = lsq2(u, y), p = prop(u, y), anch = y.map((v) => v - y[iM]);
    return { y, lin: { g: l.g, C: l.C, resid: l.resid, maxResidOverMax: maxAbs(l.resid) / maxAbs(y) }, prop: { C: p.C, resid: p.resid, maxResidOverMax: maxAbs(p.resid) / maxAbs(y) }, anchoredMercury: anch,
      lsqMean: y.map((v) => v - y.reduce((s, z) => s + z, 0) / y.length) }; };
  const byN = {};
  for (const C of N_CASES) {
    const geo = fitOf(rows.map((r) => r.byN[C.key].dxGeo[L])), osc = fitOf(rows.map((r) => r.byN[C.key].dxOsc[L]));
    byN[C.key] = { n: C.n, geo, osc, numErr: rows.map((r) => r.byN[C.key].numErrX) };
    log(`G ${C.key}: Δx_geo = g + C·r_s/a → C ${geo.lin.C.toFixed(5)}・g ${geo.lin.g.toExponential(3)}・残り/最大 ${geo.lin.maxResidOverMax.toExponential(2)}・(接触の a の平均で C ${osc.lin.C.toFixed(5)})`);
  }
  // n の差(n − 0)の残り: D_j = Δx_j(n) − Δx_j(0) —— 共通の GM(水星で揃える・7 本の最小二乗)の後の残りを周期と半長径に換算
  const lever = {};
  for (const C of N_CASES.filter((z) => z.n !== 0)) {
    const D = rows.map((r) => r.byN[C.key].dxGeo[L] - r.byN.n0.dxGeo[L]), Do = rows.map((r) => r.byN[C.key].dxOsc[L] - r.byN.n0.dxOsc[L]);
    const f = fitOf(D), fo = fitOf(Do);
    lever[C.key] = { n: C.n, D, perUnitN: f.prop.C / C.n, lin: f.lin, prop: f.prop, osc: { prop: fo.prop.C / C.n, lin: fo.lin.C / C.n },
      rows: rows.map((r, j) => { const dm = f.anchoredMercury[j], dl = f.lsqMean[j], Ps = r.ctl.Plam[L];
        return { id: r.id, emoji: r.emoji, u: r.u, D: D[j], dAnchored: dm, dLsq: dl, dPAnchoredS: -0.5 * dm * Ps, dPLsqS: -0.5 * dl * Ps, dAAnchoredKm: dm / 3 * r.aKm, dALsqKm: dl / 3 * r.aKm,
          numErr: r.byN[C.key].numErrX + r.byN.n0.numErrX }; }) };
    log(`G 梃子 ${C.key} − n0: D = C·r_s/a の C/n ${lever[C.key].perUnitN.toFixed(5)}(残り/最大 ${f.prop.maxResidOverMax.toExponential(2)})・水星で揃えた後の 💙 の周期の換算 ${lever[C.key].rows[rows.length - 1].dPAnchoredS.toExponential(3)} s`);
  }
  // 観測の側の桁(記録の有効数字・記録の間の差・半長径の定義・座標の定義・時刻系の共通の率)
  const obsSide = rows.map((r) => {
    const pl = P3.planetOf(r.id), Pd = pl.period.s / 86400, dig = periodDigitsOf(pl), quantP = 0.5 * Math.pow(10, -dig) / Pd;
    const aAu = pl.el.a, quantA = 0.5e-8 / aAu;
    const spread = PERIOD_SPREAD[r.id] || null;
    const defC = { ctl: (r.ctl.xOsc - r.ctl.xGeo) / r.u, n2: (r.byN.n2.dxOsc[L] + r.ctl.xOsc - r.byN.n2.dxGeo[L] - r.ctl.xGeo) / r.u };
    return { id: r.id, emoji: r.emoji, periodDays: Pd, periodDigits: dig, quantPRel: quantP, quantPx: 2 * quantP, aAu, quantARel: quantA, quantAx: 3 * quantA,
      spreadRel: spread ? spread.rel : null, spreadNote: spread ? spread.note : '記録の行は 1 つ(本の timeRef の転記)', defShiftC: defC, gaugePerBeta: 1.5 * r.u,
      lever20: lever.n2.rows.find((z) => z.id === r.id).dAnchored, lever10: lever.n1.rows.find((z) => z.id === r.id).dAnchored };
  });
  const commonRate = { alphaEarthSun: 2 * CONST.GMsun / (CONST.c * CONST.c * CONST.au), LB: CONST.LB,
    note: '観察者(地球)の時計の率 α⊕ と TCB/TDB の率 L_B は 7 本で共通の率 —— P² を一様に (1 + 2ε) 倍にするだけなので共通の GM に吸われる(Δx の一様な −2ε)。1/a の型は動かさない' };
  return { byN, lever, obsSide, commonRate, uDef: 'u = r_s/a₀(r_s = 2GM☉/c₀²・a₀ は初期の接触の半長径)', xDef: 'x = 4π²a³/(P²μ) − 1・P = 平均経度の周期・a = a_geo(近点・遠点の距離の平均 —— 主)/ 接触の a の平均(併記)・μ = G(M☉ + m)' };
}
/** 記録の小数点以下の桁数(日の値の有効数字の目安 —— 量子化の半単位を相対で) */
export function decimalsOf(x) { const s = String(x); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; }
/** 本の timeRef の出所の文字列に書かれた日の値(「686.980 日」—— 末尾の 0 も桁に数える)の小数点以下の桁数。書かれていなければ秒の値から。 */
export function periodDigitsOf(pl) { const m = String(pl.period.source || '').match(/([0-9]+(?:\.[0-9]+)?) 日/); return m ? decimalsOf(m[1]) : decimalsOf(pl.period.s / 86400); }
/** 周期の記録の間の差(観測の記録 paper/data/solar-observations.csv の同じ量の行 —— 記録 ID) */
export const PERIOD_SPREAD = Object.freeze({
  mercurySunInertial3d: Object.freeze({ rel: 22.15658 / 7600521.6, note: 'SOL-4d160640(NSSDC 87.969 日)と SOL-13dda3e6(JPL の近似の要素の L̇ から 87.9692565 日)の差 22.16 s' }),
  marsSunInertial3d: Object.freeze({ rel: 23.19553 / 59355072, note: 'SOL-f61a5413(NSSDC 686.980 日)と SOL-c974e476(JPL の L̇ から)の差 23.20 s(SOL-a487ebce は年の定義の違いで 756 s)' }),
});

/* ── 段 T: 時刻系の対応の記録 ── */
export const T_RECORDS = Object.freeze([
  Object.freeze({ book: 'mercurySunInertial3d', emoji: '🌡️', q: '恒星周期(公転周期)', csvId: 'mer3-sidereal-period', solId: 'SOL-4d160640', alt: Object.freeze(['SOL-13dda3e6']) }),
  Object.freeze({ book: 'venusSunInertial3d', emoji: '🌋', q: '公転周期', solId: 'SOL-cac28426', alt: Object.freeze(['SOL-10c75692']) }),
  Object.freeze({ book: 'marsSunInertial3d', emoji: '🔴', q: '恒星周期(公転周期)', solId: 'SOL-f61a5413', alt: Object.freeze(['SOL-c974e476', 'SOL-a487ebce']) }),
  Object.freeze({ book: 'jupiterSunInertial3d', emoji: '🏀', q: '恒星周期', solId: null, alt: Object.freeze([]) }),
  Object.freeze({ book: 'saturnSunInertial3d', emoji: '🟡', q: '恒星周期', solId: null, alt: Object.freeze([]) }),
  Object.freeze({ book: 'uranusSunInertial3d', emoji: '🔷', q: '恒星周期', solId: null, alt: Object.freeze([]) }),
  Object.freeze({ book: 'neptuneSunInertial3d', emoji: '💙', q: '恒星周期', solId: null, alt: Object.freeze([]) }),
  Object.freeze({ book: 'earthMoonSunInertial3d', emoji: '🌦️', q: '恒星月', csvId: 'ems-sidereal-month', solId: 'SOL-432f643e', alt: Object.freeze([]), extraCsv: Object.freeze(['b1-moon-sidereal']) }),
  Object.freeze({ book: 'plutoCharonInertialFit', emoji: '🟪', q: '公転周期(二体のケプラーの P)', csvId: 'pluto-charon-period', solId: 'SOL-25d4320f', alt: Object.freeze([]) }),
]);
/** 簡単な CSV の読み(引用符の中のカンマを扱う)。 */
export function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; continue; }
    if (ch === '"') q = true; else if (ch === ',') { row.push(cur); cur = ''; } else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else if (ch !== '\r') cur += ch;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  const hd = rows.shift();
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(hd.map((h, i) => [h, r[i]])));
}
const noteField = (note, key) => { const m = String(note || '').match(new RegExp('(?:^|; )' + key + '=([^;]*)')); return m ? m[1].trim() : null; };
export function partT(HP, P, E, log = console.log) {
  const TS = parseCsv(fs.readFileSync(path.join(ROOT, 'paper', 'data', 'obs-time-standard-20261016.csv'), 'utf8'));
  const SO = parseCsv(fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8'));
  const c2 = CONST.c * CONST.c, psiSun = CONST.GMsun / (c2 * CONST.au), psiE = CONST.GMearth / (c2 * CONST.Rearth);
  const L = DIVS.length - 1, rows = [];
  for (const T of T_RECORDS) {
    const ts = T.csvId ? TS.find((z) => z.target_id === T.csvId) : null, so = T.solId ? SO.find((z) => z.record_id === T.solId) : null;
    const pl = P3.planetOf(T.book), book = G5.findPreset(HP, T.book);
    let Ps = null, valueText = null, unit = null, source = null;
    if (so) { Ps = Number(so.value); valueText = so.value; unit = so.unit; source = so.source; }
    else if (pl) { Ps = pl.period.s; valueText = String(pl.period.s); unit = 's'; source = pl.period.source; }
    const alt = T.alt.map((id) => { const z = SO.find((w) => w.record_id === id); return z ? { recordId: id, value: Number(z.value), unit: z.unit, source: z.source, epoch: noteField(z.note, 'epoch'), diffS: Number(z.value) - Ps } : { recordId: id, missing: true }; });
    const extra = (T.extraCsv || []).map((id) => { const z = TS.find((w) => w.target_id === id); return z ? { targetId: id, recordId: z.record_id, value: Number(z.value), unit: z.unit, timeStandard: z.time_standard, evidence: z.time_standard_evidence } : { targetId: id, missing: true }; });
    const tsd = ts ? ts.time_standard : (so ? (noteField(so.note, 'timescale') || '不明') : '不明');
    const evidence = ts ? ts.time_standard_evidence : (so ? (noteField(so.note, 'epoch') ? 'epoch=' + noteField(so.note, 'epoch') + '(元期の表記だけ —— 量の時刻系の記載は無い)' : '記載なし') : '記録の行なし(本の timeRef の転記 —— 原表は未取得)');
    // n の差の大きさ(秒): 惑星は段 P(同じ初期状態)と段 G(水星で揃えた共通の GM の後の周期の換算)・🌦️ は段 E(恒星月 —— 転記の n2−n0 の対と取り直し)
    let nDiff = null;
    if (P) { const pr = P.rows.find((r) => r.id === T.book); if (pr) nDiff = { sameState20: pr.byN.n2.dPlam[L] - pr.byN.n0.dPlam[L], sameState10: pr.byN.n1.dPlam[L] - pr.byN.n0.dPlam[L], numErr: pr.byN.n2.numErr + pr.byN.n0.numErr }; }
    if (nDiff && P.leverRows) { const lv = P.leverRows.find((z) => z.id === T.book); if (lv) nDiff.anchored20 = lv.dPAnchoredS; }
    if (T.book === 'earthMoonSunInertial3d' && E && E.transcribed) { const g = (k) => E.transcribed.rows.find((z) => z.key === k); if (g('n2-pair') && g('n0-pair')) nDiff = { sameState20: (g('n2-pair').sidOffD - g('n0-pair').sidOffD) * 86400, source: '段 E の転記(第305便a の正本 —— J₂ なしの基線・照合規約の k・対)' }; }
    const sunOnly = Ps === null ? null : 2 * psiSun * Ps, sunEarth = Ps === null ? null : 2 * (psiSun + psiE) * Ps, lb = Ps === null ? null : CONST.LB * Ps, lg = Ps === null ? null : CONST.LG * Ps;
    const ref = nDiff ? Math.abs(nDiff.sameState20) : null;
    const moves = ref === null ? null : { alphaSunOnly: sunOnly / ref, LB: lb / ref, tdbAmp: CONST.tdbAmp / ref };
    rows.push({ book: T.book, emoji: T.emoji, q: T.q, valueText, unit, Ps, recordId: so ? so.record_id : null, timeStandardCsvId: T.csvId || null, source,
      timeStandard: tsd, evidence, converted: ts ? ts.converted_to_model_time : 'いいえ(絶対時間へ換算していない)', conversionNeeded: ts ? ts.conversion_needed : '未決(AN333 —— 四条件が揃うまで記録だけ・適用しない)',
      modelTime: '絶対時間(アプリの時間 —— 第95報・AN332 の裁定)', candidates: ['T_obs = α⊕ T_abs(α = c_loc/c₀ = e^(−2ψ) —— 観察者の時計の率)', 'TDB = TCB(1 − L_B) + 定数 —— 絶対時間を TCB に対応させる読み', '換算なし(絶対時間 = 記録の時間標準)'],
      alt, extra, shifts: { alphaSunOnly: sunOnly, alphaSunEarth: sunEarth, LB: lb, LG: lg, tdbAmp: CONST.tdbAmp }, nDiff, moves, live: !!book });
    log(`T ${T.emoji} ${T.q}: ${valueText} ${unit}・時間標準 ${tsd}・2ψ⊕P ${sunOnly === null ? '—' : sunOnly.toExponential(3)} s・L_B·P ${lb === null ? '—' : lb.toExponential(3)} s・n の差 ${ref === null ? '—' : ref.toExponential(3)} s`);
  }
  return { rows, psiSun, psiEarth: psiE, const: CONST, use: 'record-only', note: '換算は適用しない(AN333 —— 四条件が揃うまで記録だけ)。α⊕・L_B・L_G は全ての周期に共通の率(同じ時計で測る)—— 本ごとの周期を絶対時間の値と比べる読みでは判定を動かしうるが、共通の GM の 1/a の型には吸われる' };
}

/* ── 段 E: 🌦️ の恒星月の n の欄 ── */
export const EM_ID = 'earthMoonSunInertial3d', EM_DT = 0.016, EM_LONG = 1062;
export function emPinned(HP) {
  const p = G5.findPreset(HP, EM_ID), d = EM_PIN.decl[EM_ID];
  if (!p || !d) throw new Error('本か凍結の写しが無い: ' + EM_ID);
  const q = clone(p); for (const k of ['physics', 'bodies', 'scaleExp', 'timeRef', 'orbitObs']) { if (d[k]) q[k] = clone(d[k]); else delete q[k]; }
  delete q.fitRecord; delete q.physics.gLoc;
  return q;
}
export function emCase(base, W, c) {
  if (!c.drag) return clone(base);
  const q = clone(base), rd0 = q.physics.relativeDrag || {};
  q.physics.relativeDrag = { law: 'inertial', Wbg: W, eps: rd0.eps, history: 'positions', pairs: 'all', inertialR2: { lambdaRs: c.k, sources: 'all', denom: 'pair' } };
  if (c.gl) q.physics.gLoc = clone(c.gl); else delete q.physics.gLoc;
  return q;
}
export function partE(HP, log = console.log) {
  const rel = 'tests/out/pairnorm-w305a.json', J = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')), T = J.threeBody, L4 = (r, k) => r[k] ? r[k].fromZero[r[k].fromZero.length - 1] : null;
  const keys = ['off', 'n2-row', 'n2-pair', 'n1-row', 'n1-pair', 'n0-row', 'n0-pair'];
  const rows = keys.map((k) => { const r = T.rows.find((z) => z.key === k); if (!r) return { key: k, missing: true };
    const a = L4(r, 'h'), b = L4(r, 'h2');
    return { key: k, label: r.label, n: r.n === undefined ? null : r.n, k: r.k, denom: r.denom, sidH: a.sidH, sidHh2: b ? b.sidH : null, N: a.N, sidOffD: r.diff.sidOff, sidOffS: r.diff.sidOff * 86400,
      sidOffH2S: r.diff.sidOffH2 === undefined ? null : r.diff.sidOffH2 * 86400, sidB1D: r.diff.sidB1, withinTol: r.withinTol }; });
  const out = { transcribed: { file: rel, sha256: sha256File(path.join(ROOT, rel)), harnessVersion: J.harnessVersion, generatedAt: J.meta && J.meta.generatedAt, wave: J.meta && J.meta.wave,
    base: J.pin ? J.pin.base : null, declFile: J.pin ? J.pin.file : null, kOfN: J.kOfN, Wbg: T.Wbg, tolSid: J.tol ? J.tol.sid : null, obsSid: J.obs ? J.obs.sid : null,
    window: '長窓 [0, ' + EM_LONG + '] 公転・恒星月は sidH(黄経 0 の通過の時刻の調和の回帰 —— 第303便c の抽出器)・刻み h 0.016(h/2 0.008 を併記)',
    note: '第305便a の正本の転記(J₂ なしの基線 —— 第304便の宣言の写し・照合規約の k 5.001361/4.001357/3.00136)', rows } };
  log(`E 転記: ${rows.filter((z) => !z.missing).length} 行・n2−n0(対)の恒星月の差 ${((rows[2].sidOffD - rows[6].sidOffD) * 86400).toExponential(3)} s`);
  if (process.env.W306B_E_RUN === '0') { out.remeasured = null; return out; }
  // 取り直し(J₂ ありの今の基線 —— 02ca93b の宣言の写し・k = 1PN + A1 の n = 2・対)
  const base = emPinned(HP), W = B.wExtOf(HP, base).book, t0 = Date.now();
  const one = (c) => { STATS.emRuns++; const R = EM.runEngine(HP, emCase(base, W, c), { dt: EM_DT, revMax: EM_LONG });
    if (!R.complete || R.nan) throw new Error('🌦️ の走行が窓を満たさない: ' + R.stop);
    const w = EM.windowsOf(R.ev, [EM_LONG], 0).fromZero[0]; return { sidH: w.sidH, T4p: w.T4p, node: w.node, eMean: w.eMean, incMean: w.incMean, N: w.N, steps: R.steps }; };
  const off = one({ drag: false }), n2 = one({ drag: true, k: KN.k.n2, gl: N_CASES[0].gl });
  const j2 = !!(base.bodies.find((b) => b.j2));
  out.remeasured = { declFile: EM_DECL_FILE, j2, Wbg: W, k: KN.k.n2, n: 2, denom: 'pair', dt: EM_DT, N: EM_LONG, off, n2,
    sidOffD: n2.sidH - off.sidH, sidOffS: (n2.sidH - off.sidH) * 86400, apsOffY: n2.T4p - off.T4p, nodeOffY: n2.node - off.node, eOff: n2.eMean - off.eMean,
    offSidB1D: off.sidH - (J.obs ? J.obs.sid.value : NaN), wallSec: (Date.now() - t0) / 1000,
    note: '刻み h だけ(h/2 は省く —— 転記の行の h と h/2 の差 |sidOff| の桁は 1e-7 日)。差 = n = 2・対 − 引きずり OFF(同じ刻み・同じ初期状態)' };
  log(`E 取り直し(J₂ あり・k ${KN.k.n2}・対): 恒星月 OFF ${off.sidH.toFixed(9)} 日・n = 2 ${n2.sidH.toFixed(9)} 日・差 ${out.remeasured.sidOffS.toExponential(3)} s(${out.remeasured.wallSec.toFixed(0)} s)`);
  return out;
}

/* ── 文書の表(docs/PHYSICS.md〔第306便b〕に貼る表と、QA docs.periodN306 が照合する数の文字列 —— 同じ関数)── */
export const fmtP = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toPrecision(6);
export const fmtE = (x, d = 2) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toExponential(d);
export const fmtF = (x, d = 4) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toFixed(d);
export const cellSafe = (t) => String(t).replace(/\|/g, '\\|');
const NL = { n2: 'n = 2', n1: 'n = +1', n0: 'n = 0' };
export function physicsTables(J) {
  const out = [], L = DIVS.length - 1, LR = DIVS_R.length - 1;
  const Z = J.zero;
  if (Z) {
    out.push('| 抽出器の検算 | 照合する式 | 相対の差 |', '|---|---|---|');
    for (const r of Z.selfTest.rows) out.push(r.kind === 'kepler' ? `| 解析のケプラー(e ${r.e}) | 2π√(a³/μ) | ${fmtE(r.relErr, 1)} |` : `| 1PN の試験粒子(e ${r.e}・ε ${r.eps}) | 2π/(n(1+k)) | ${fmtE(r.relErr, 1)} |`);
    out.push('');
  }
  const P = J.periods;
  if (P) {
    out.push('| 本(e) | 対照の P_λ h / h/2 / h/4 [s] | リチャードソン − 2π√(a₀³/μ) [s] | 対照の(方向の間隔 − P_λ)[s](幾何の式) |', '|---|---|---|---|');
    for (const r of P.rows) out.push(`| ${r.emoji}(${r.e.toFixed(4)}) | ${r.ctl.Plam.map((x) => fmtF(x, 3)).join(' / ')} | ${fmtE(r.ctl.richMinusPK, 2)} | ${fmtE(r.ctl.crossMinusLam, 3)}(${fmtE(r.ctl.crossGeom, 3)}) |`);
    out.push('');
    out.push('| 本 | P_λ の変化 [s] n = 2 / +1 / 0(数値の誤差) | 相対 n = 2 / 0 | うち G_loc だけ n = 2 / +1 | n = 2 − n = 0 [s](誤差の倍) | 方向の間隔の変化 n = 2 / 0 [s] | 方向の間隔 − P_λ の変化 n = 2(幾何の式) |', '|---|---|---|---|---|---|---|');
    for (const r of P.rows) { const b = r.byN;
      out.push(`| ${r.emoji} | ${fmtE(b.n2.dPlam[L], 4)} / ${fmtE(b.n1.dPlam[L], 4)} / ${fmtE(b.n0.dPlam[L], 4)}(±${fmtE(b.n0.numErr, 1)}) | ${fmtE(b.n2.dPlamRel, 3)} / ${fmtE(b.n0.dPlamRel, 3)} | ${fmtE(b.n2.gLoc[L], 4)} / ${fmtE(b.n1.gLoc[L], 4)} | ${fmtE(r.sep20.d, 4)}(${fmtE(r.sep20.ratio, 1)}) | ${fmtE(b.n2.dPcross[L], 4)} / ${fmtE(b.n0.dPcross[L], 4)} | ${fmtE(b.n2.crossMinusLam[L], 3)}(${fmtE(b.n2.crossGeom[L], 3)}) |`); }
    out.push('');
    out.push('| 本 | 窓ごとの P_λ の変化 n = 2 [s] 8 公転 / 前半 / 後半 / 近点から | 近点率の変化 n = 2 / 0 [″/世紀] | a_geo の変化(相対)n = 2 / 0 | 離心率の変化 n = 2 / 0 |', '|---|---|---|---|---|');
    for (const r of P.rows) { const b = r.byN, w = b.n2.win;
      out.push(`| ${r.emoji} | ${fmtE(w.main, 4)} / ${fmtE(w.half1, 4)} / ${fmtE(w.half2, 4)} / ${fmtE(w.peri, 4)} | ${fmtF(b.n2.dVarpi, 5)} / ${fmtF(b.n0.dVarpi, 5)} | ${fmtE(b.n2.dAgeoRel, 3)} / ${fmtE(b.n0.dAgeoRel, 3)} | ${fmtE(b.n2.dEgeo, 2)} / ${fmtE(b.n0.dEgeo, 2)} |`); }
    out.push('');
  }
  const R = J.refit;
  if (R) {
    out.push('| 本・1 量・n | p* − 1 | 合わせる前の P_λ の差 [s] | 残る P_λ の差 [s] | 残る a_geo の差 [km](相対) | 残る離心率の差 | 残る近点率の差 [″/世紀] | 残る方向の間隔の差 [s] | x の不変(相対) |', '|---|---|---|---|---|---|---|---|---|');
    for (const z of R.rows) out.push(`| ${z.emoji}・${z.method === 'speed' ? '初速' : 'GM'}・${NL[z.key]} | ${fmtE(z.pStarMinus1[LR], 4)} | ${fmtE(z.before[LR], 4)} | ${fmtE(z.resP[LR], 1)} | ${fmtF(z.dAgeoKm[LR], 4)}(${fmtE(z.dAgeoRel[LR], 3)}) | ${fmtE(z.dEgeo[LR], 2)} | ${fmtE(z.dVarpi[LR], 3)} | ${fmtE(z.dPcross[LR], 3)} | ${fmtE(z.lawInvRel, 1)} |`);
    out.push('');
  }
  const G = J.commonGM;
  if (G && P) {
    out.push('| n | Δx = g + C·r_s/a の C(a_geo) | g | 当てはめの残り / 最大 | C(接触の a の平均) |', '|---|---|---|---|---|');
    for (const C of N_CASES) { const z = G.byN[C.key]; out.push(`| ${NL[C.key]} | ${fmtF(z.geo.lin.C, 4)} | ${fmtE(z.geo.lin.g, 2)} | ${fmtE(z.geo.lin.maxResidOverMax, 2)} | ${fmtF(z.osc.lin.C, 4)} |`); }
    out.push('');
    out.push('| 本 | r_s/a | D = Δx(n = 2) − Δx(n = 0) | D/(r_s/a) | 水星で揃えた残り | 周期の換算 [s] | 半長径の換算 [km] | 7 本の平均で揃えた残りの周期の換算 [s] |', '|---|---|---|---|---|---|---|---|');
    for (const z of G.lever.n2.rows) out.push(`| ${z.emoji} | ${fmtE(z.u, 3)} | ${fmtE(z.D, 4)} | ${fmtF(z.D / z.u, 4)} | ${fmtE(z.dAnchored, 3)} | ${fmtE(z.dPAnchoredS, 3)} | ${fmtF(z.dAAnchoredKm, 3)} | ${fmtE(z.dPLsqS, 3)} |`);
    out.push('');
    out.push('| 本 | 水星で揃えた n = 2 − 0 の残り(x) | 周期の記録の量子化(x 換算) | 記録の間の差(x 換算) | a の記録の量子化(x 換算) | 半長径の定義の差(C の差 —— 対照 / n = 2) | 座標の定義(β = 1 で 1.5 r_s/a) |', '|---|---|---|---|---|---|---|');
    for (const o of G.obsSide) out.push(`| ${o.emoji} | ${fmtE(o.lever20, 2)} | ${fmtE(o.quantPx, 1)}(${o.periodDays} 日) | ${o.spreadRel === null ? '—' : fmtE(2 * o.spreadRel, 1)} | ${fmtE(o.quantAx, 1)}(${o.aAu} au) | ${fmtF(o.defShiftC.ctl, 3)} / ${fmtF(o.defShiftC.n2, 3)} | ${fmtE(o.gaugePerBeta, 2)} |`);
    out.push('');
  }
  const T = J.timeSystems;
  if (T) {
    out.push('| 本・量 | 値(記録 ID) | 原資料の時間標準 | 既換算か | 換算の要否 | 2ψ⊕P(太陽だけ)[s] | L_B·P [s] | TDB − TT の周期項 [s] | n の差の大きさ [s](同じ初期状態 n = 2 − 0) |', '|---|---|---|---|---|---|---|---|---|');
    for (const r of T.rows) out.push(`| ${r.emoji} ${r.q} | ${r.valueText} ${r.unit}(${r.recordId || r.timeStandardCsvId || '記録の行なし'}) | ${cellSafe(r.timeStandard)} | ${r.converted.startsWith('いいえ') ? 'いいえ' : cellSafe(r.converted)} | 未決(AN333) | ${fmtE(r.shifts.alphaSunOnly, 3)} | ${fmtE(r.shifts.LB, 3)} | ${fmtE(r.shifts.tdbAmp, 2)} | ${r.nDiff ? fmtE(Math.abs(r.nDiff.sameState20), 3) : '—'} |`);
    out.push('');
  }
  const E = J.moon;
  if (E) {
    out.push('| 🌦️ の行(第305便a の正本の転記 —— J₂ なし・照合規約の k) | k | 恒星月 sidH h [日] | OFF との差 h [s] | OFF との差 h/2 [s] | B1 との差 [日] |', '|---|---|---|---|---|---|');
    for (const r of E.transcribed.rows) if (!r.missing) out.push(`| ${cellSafe(r.label)} | ${r.k === null ? '—' : r.k} | ${fmtF(r.sidH, 9)} | ${fmtE(r.sidOffS, 3)} | ${fmtE(r.sidOffH2S, 3)} | ${fmtE(r.sidB1D, 3)} |`);
    out.push('');
    if (E.remeasured) { const m = E.remeasured;
      out.push('| 🌦️ の取り直し(02ca93b の宣言 —— J₂ あり・刻み h・長窓 1062 公転) | k | 恒星月 [日] | OFF との差 [s] | 近地点の周期の差 [年] | 交点の周期の差 [年] | 平均離心率の差 |', '|---|---|---|---|---|---|---|');
      out.push(`| 引きずり OFF | — | ${fmtF(m.off.sidH, 9)} | 0 | 0 | 0 | 0 |`);
      out.push(`| n = 2・対(λ ∝ m・W_bg = W_ext) | ${m.k} | ${fmtF(m.n2.sidH, 9)} | ${fmtE(m.sidOffS, 3)} | ${fmtE(m.apsOffY, 2)} | ${fmtE(m.nodeOffY, 2)} | ${fmtE(m.eOff, 2)} |`);
      out.push(''); }
  }
  return out.join('\n');
}
/** QA docs.periodN306 が PHYSICS〔第306便b〕の中に探す数の文字列(表と同じ書式)。 */
export function docNumbers(J) {
  const out = [], L = DIVS.length - 1;
  if (J.periods) for (const r of J.periods.rows) for (const k of ['n2', 'n1', 'n0']) out.push(fmtE(r.byN[k].dPlam[L], 4));
  if (J.commonGM) { for (const C of N_CASES) out.push(fmtF(J.commonGM.byN[C.key].geo.lin.C, 4)); for (const z of J.commonGM.lever.n2.rows) out.push(fmtE(z.dPAnchoredS, 3)); }
  if (J.moon && J.moon.remeasured) out.push(fmtE(J.moon.remeasured.sidOffS, 3));
  return [...new Set(out)];
}

/* ── 本体 ── */
export function gatesOf(J) {
  const g = {}, L = DIVS.length - 1;
  if (J.zero) {
    g.selfTest = J.zero.selfTest.ok === true;
    g.apsisSelfTest = J.zero.apsisSelfTest === true;
    g.pairRowBitSame = J.zero.pairRowBitSame === true;
  }
  g.pinFrozen = J.pin && J.pin.declSha256 === PIN_DECL_SHA256;
  if (J.periods) {
    const rs = J.periods.rows;
    g.periodTable = rs.length === PLANETS.length && rs.every((r) => !r.ctl.nan && N_CASES.every((C) => !r.byN[C.key].nan && Number.isFinite(r.byN[C.key].dPlam[L])));
    // エンジンの対照(ケプラーの二体 + 軟化 0.05): h/2・h/4 のリチャードソンが 2π√(a₀³/μ) に相対 1e-7 で寄る(半陰的の步の O(h) の偏りを外した残り)
    g.engineKepler = rs.every((r) => Math.abs(r.ctl.richRel) < 1e-7);
    // n の差が数値の誤差より十分大きい(n = 2 − 0 が誤差の和の 100 倍超)
    g.nSeparated = rs.every((r) => r.sep20.ratio > 100);
    // 方向の間隔 − P_λ の変化が近点の移動の幾何の式と合う(e ≥ 切替値の本 —— 差の 2% か 1e-3 s の内)
    g.crossGeom = rs.filter((r) => r.e >= E_SWITCH).every((r) => N_CASES.every((C) => { const b = r.byN[C.key]; return Math.abs(b.crossResid) <= Math.max(1e-3, 0.02 * Math.abs(b.crossMinusLam[L])); }));
  }
  if (J.refit) {
    const LR = DIVS_R.length - 1;
    g.refitAbsorbsP = J.refit.rows.length === PLANETS.length * 4 && J.refit.rows.every((z) => Math.abs(z.resP[LR]) <= Math.max(1e-3 * Math.abs(z.before[LR]), 10 * z.numErrResP));
    g.lawInvariant = J.refit.rows.every((z) => z.lawInvRel < 1e-2);
  }
  if (J.commonGM) g.commonGMFits = N_CASES.every((C) => Number.isFinite(J.commonGM.byN[C.key].geo.lin.C)) && ['n2', 'n1'].every((k) => Number.isFinite(J.commonGM.lever[k].perUnitN));
  if (J.timeSystems) g.timeRows = J.timeSystems.rows.length === T_RECORDS.length && J.timeSystems.rows.every((r) => r.Ps !== null && r.conversionNeeded.indexOf('AN333') >= 0);
  if (J.moon) {
    g.moonTranscribed = J.moon.transcribed.rows.every((z) => !z.missing);
    if (J.moon.remeasured) g.moonRemeasured = J.moon.remeasured.j2 === true && Number.isFinite(J.moon.remeasured.sidOffS);
  }
  return g;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--tables')) {
  const J = JSON.parse(fs.readFileSync(process.env.W306B_OUT || path.join(ROOT, 'tests', 'out', 'periodn-w306b.json'), 'utf8'));
  console.log(physicsTables(J));
} else if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W306B_OUT || path.join(ROOT, 'tests', 'out', 'periodn-w306b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  pinDecl315c();   // 第315便c(AN406): 在位の 7 本の宣言を移行の前の写しへ(本ごとの門 —— 基点の html では no-op・正本の欄は足さない)
  KN = kOfN(HP);
  console.log('k ' + JSON.stringify(KN.k) + ' ← ' + JSON.stringify(KN.source));
  if (process.env.W306B_PLANETS) { const only = process.env.W306B_PLANETS.split(','); PLANETS.splice(0, PLANETS.length, ...PLANETS.filter((id) => only.includes(id))); }
  const out = { meta: null, harnessVersion: HARNESS_VERSION, meanlonVersion: ML.MEANLON_VERSION, apsisVersion: AP.APSIS_VERSION, gLocVersion: HP.GLOC_VERSION, i2Version: HP.REL_DRAG_I2_VERSION, parts: PARTS,
    pin: { file: DECL_FILE, version: G5.PIN.version, base: G5.PIN.base, declSha256: canonDeclSha(), same02ca93b: PIN_SAME_02CA93B, liveSame: G5.liveSame(HP), emFile: EM_DECL_FILE, emBase: EM_PIN.base, emLiveSame: liveSameEm(HP) },
    k: KN };
  const tp = {};
  const timed = (k, f) => { const t = Date.now(); const r = f(); tp[k] = { wallSec: (Date.now() - t) / 1000 }; console.log(`[${k}] ${tp[k].wallSec.toFixed(1)} s`); return r; };
  if (PARTS.includes('Z')) out.zero = timed('Z', () => partZ(HP));
  if (PARTS.includes('P')) out.periods = timed('P', () => partP(HP));
  if (PARTS.includes('R') && out.periods) out.refit = timed('R', () => partR(HP, out.periods));
  if (PARTS.includes('G') && out.periods) out.commonGM = timed('G', () => partG(out.periods));
  if (PARTS.includes('E')) out.moon = timed('E', () => partE(HP));
  if (PARTS.includes('T')) { const P = out.periods ? Object.assign({}, out.periods, { leverRows: out.commonGM ? out.commonGM.lever.n2.rows : null }) : null; out.timeSystems = timed('T', () => partT(HP, P, out.moon)); }
  out.gates = gatesOf(out); out.ok = Object.values(out.gates).every(Boolean); out.timing = tp; out.stats = STATS;
  const CODE = ['tests/exp-w306b-periodn.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w306b-meanlon.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/exp-w305b-gfamily.mjs', 'tests/exp-w303b-inertialr2.mjs', 'tests/exp-w299c-planets3d.mjs',
    'tests/lib-w299c-planets3d.mjs', 'tests/exp-w303c-earthmoon.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第306便b', target: TARGET, code: CODE,
    inputs: [TARGET, LEGACY7_DATA_FILE, DECL_FILE, EM_DECL_FILE, 'tests/out/gfamily-w305b.json', 'tests/out/pairnorm-w305a.json', 'paper/data/obs-time-standard-20261016.csv', 'paper/data/solar-observations.csv'] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第97報)AN336(水星の標的を 1PN + A1 へ —— k は 1PN + A1 の値)・第95報・AN332 の裁定(アプリは絶対時間・慣性速度は絶対時間の慣性速度を維持・α = c_loc/c₀・n = 2 を先・n = +1 は次点・n = 0 は対照・近点では n は決まらない)',
    reading: '統括の検証項目 R205(周期による n の識別の器 —— 平均経度の周期の抽出器・n ごとに GM と初速を合わせ直した写し・共通の太陽の GM で残る惑星間の P²/a³ の型・時刻系の対応の記録・🌦️ の恒星月の n の欄)・決断事項 AN336 ③・AN333・AN335 ③',
    notClaim: ['n が決まった', '周期を予言した', 'GR を導いた', 'GR と一致した', '法則を発見した', '観測の 1σ で較正済み', '現実を再現した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(out.gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}

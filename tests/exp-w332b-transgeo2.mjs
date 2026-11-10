// 第332便b(原仮定者の補足(2026-11-10)「座標変換版の「回転引きずり」は、天体の半径を見ないので、「並進引きずり」に統合する。銀河のスケールでの geoPN=2 の近似と比較する」・
//   「R_d は観測半径とは別の値(重力の計算で天体を質点とみなせる事と似ている)」・統括の検証項目 R316):
//   **並進引きずり(座標変換の回転を統合 —— 半径を見ない・重み m/r²)と geoPN = 2 の u の場・v − u 輸送を同じ入力で並べる器 —— 💫 galaxyGeo2 の写しと NGC 3198 の円盤**
//   (段 transgeo2-332b —— 正本 tests/out/transgeo2-w332b.json・lib tests/lib-w332b-transgeo2.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第329〜331便の lib の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、💫 galaxyGeo2 の**写し**〔器の中 —— 本の JSON は 1 bit も変えない〕を受理器に通して build・
//   步を進める)。1 プロセス。入力は html・NGC 3198 の rotmod の写しの fixture(第329便b —— 第三者の写し)。
//
// ■ 何をするか
//   P 純関数の場面(lib —— 場の式の正規化・ガリレイ・解析の勾配・E2 の q = 0 と座標変換の回転・第331便a の座標則との照らし・自己の重みの因子・定常の輸送と第331便b の枠の式・鏡の対称・拒否)
//   E エンジンとの照らし(💫 の写し 4 つ —— 核 share/pull × 背景 本の D₀/0): 2 步目の S._core の入口の状態から lib の場の式で u・∇P・∇W を作り、エンジンの S.uPx/uPy・S._g2・分母の和と比べる
//     (固定の天体は u を持たない —— 外す)。源の回転を座標変換にする宣言(q = 0)は受理器が値域の下限 0.5 に直す —— 在位のエンジンの宣言で表せない(記録)。
//     窓: 4 つの写し(k_F = 1)と k_F = 0 の写し(1 つ —— 輸送が消えて λ_PN = 0 ではニュートン)を 600 步(本の観察の基準 timeRef)進めて外縁帯 [156, 286] の平均 vφ と比・機構の内訳・飽和の数
//   B 💫 の同じ入力(build の直後の状態 —— 円盤の 380 粒子を受け手に・自分以外の全部を源に): 核 3 × 源の回転 2 × 分母(E3〔自己なし + D₀〕・場の読み〔自己なし・背景なし〕・
//     自己の重み〔規則 kappaM・kappaD・book × 形 3〕)の全部の組で u・引きずりの速度 dRel・渦度・定常の輸送の加速度・円軌道の読み(continuum と rigid)を半径の箱ごとに。
//     比べる写し: 中心の自転を 0 にした写し(源の回転の軸を消す —— 器の中の宣言)
//   N NGC 3198 の円盤(第329便b の fixture —— 環の点〔方位 K〕と中心の点・源の速度は v_obs の円運動・重力は v_bar²/R): 同じ組(自己の規則は kappaM・kappaD —— 観測の半径が無い)・
//     geoPN = 2 の宣言は 💫 の宣言の無次元の写し(ε/L・D₀ L^p/M・q・中心の自転は v_obs(R_c)/R_c)・質量分布 2(fixture・指数円盤)× 離散化 3
//   D 違いの分解: 基準 G0(geo2・decay・E3)と TF(trans・coord・場の読み)・TS(trans・coord・自己 kappaM ballMean)から 1 つずつ入れ替えた列の比の |ln| の中央値
//   A 近似として読める範囲: 物差し(走行の前の宣言 —— 比 10%・べき 0.1・向き 10°/緩い物差し 2 倍)で G0 と並進引きずりの各型が合う半径の箱
// ■ 言わないこと: geoPN = 2 と並進引きずりの関係は同じ入力の場の表と比と残差(同じとは書かない)・定常の輸送と円軌道の読みは宣言の型の値(窓の値はエンジンの時間発展 —— 別の欄)・
//   平坦な回転の機構の同定に使わない・κ_D と周転円の振動数を同じ量と書かない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w332b-transgeo2.mjs';
import * as GR from './lib-w329b-galrot.mjs';
import * as CF from './lib-w331b-centrifugal.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 💫 galaxyGeo2 の 1 本〔写しの元 —— .find で引く〕。エンジンを読む(core —— 写しの步)。
//   roots の T・ch・ctx・cw・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   ワンタップ対照 A/B は走らせない〔abBody:false —— k_F = 0 の写しは器の中で受理器に通す〕・説明文の欄は読まない〔claim の窓 expected だけ〕)
const REGEN_SCOPE = {"presets":["galaxyGeo2"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w332b-transgeo2-2';   // 版 2(原仮定者の補足その4(2026-11-10)): 部 U(重み m/r の並進引きずりと m/r² の均一さの表)
export const OUT_MAIN = 'tests/out/transgeo2-w332b.json';
export const FIXTURE = 'tests/fixtures/ngc3198-rotmod-w329b.json';
export const BOOK_ID = 'galaxyGeo2';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const KPC = GR.KPC_M, MSUN = GR.MSUN_KG;
export const NOT_CLAIM = Object.freeze(['geoPN = 2 と並進引きずりは同じ入力の場の表・比・残差(同じとは書かない —— 核・源の回転・分母の 3 つが違う)', '定常の輸送と円軌道の読みは宣言の型の値(エンジンの時間発展の値は窓の欄 —— 別に書く)',
  '近似として読める範囲は走行の前に宣言した物差しの表(読める・読めないは物差しの内か外か —— 主張ではない)', '並進引きずりの自己の重みは有限の宣言(m/0² にしない —— 主は R_d の規則・本の半径は比べる列)',
  '平坦な回転の機構の同定・暗黒物質の置き換えに使わない', 'κ_D と周転円の振動数は別の量', '引きずりの速度 dRel は速度で、力・加速度ではない']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 💫 の写し: 半径の箱(円盤の粒子の半径 30〜260)・外縁帯(claim の手続きと同じ [156, 286])・窓(本の timeRef の観察の基準 600 步・刻み 0.016)・固定の天体の添字 */
  binEdges: Object.freeze([30, 60, 90, 120, 150, 180, 210, 240, 261]), outerBand: Object.freeze([156, 286]), windowSteps: 600, dt: 0.016, centerIndex: 0,
  /** エンジンの写し(核 × 背景 —— 源の回転は本の q)。q = 0(座標変換の回転)は受理器が値域の下限へ直すことを記録 */
  engineCombos: Object.freeze([Object.freeze({ key: 'shareD0', frameWeight: 'share', bgZero: false }), Object.freeze({ key: 'shareBg0', frameWeight: 'share', bgZero: true }),
    Object.freeze({ key: 'pullD0', frameWeight: 'pull', bgZero: false }), Object.freeze({ key: 'pullBg0', frameWeight: 'pull', bgZero: true })]),
  engineTolU: 1e-5, engineTolGrad: 1e-12,
  /** 窓を走らせる写し(share の 2 つ + k_F = 0)。pull の写しは窓を走らせない(generic の経路で 600 步 21 s の桁 —— 器の所要を 1 分の内に収める宣言)—— pull は 2 步目の u と勾配の照らしだけ */
  windowCombos: Object.freeze(['shareD0', 'shareBg0']),
  /** 自己の重みの規則(💫 は kappaM・kappaD・book —— NGC 3198 は kappaM・kappaD〔観測の半径が無い〕)と形 */
  selfRulesBook: Object.freeze(['kappaM', 'kappaD', 'book']), selfRulesNgc: Object.freeze(['kappaM', 'kappaD']), selfShapes: L.SELF_SHAPES,
  /** 違いの分解の基準(G0 = geoPN = 2 の在位の型・TF = 並進引きずりの場の読み・TS = 並進引きずりの主の自己〔R_d の規則 —— 形 ballMean〕) */
  baseG0: Object.freeze({ kernel: 'geo2', rot: 'decay', denom: 'e3' }), baseTF: Object.freeze({ kernel: 'trans', rot: 'coord', denom: 'field' }),
  baseTS: Object.freeze({ kernel: 'trans', rot: 'coord', denom: 'self:kappaM:ballMean' }), baseG0bg0: Object.freeze({ kernel: 'geo2', rot: 'decay', denom: 'field' }),
  /** 近似として読める物差し(走行の前の宣言): 比の 10%・局所のべきの差 0.1・向きの差 10°/緩い物差しは比の 2 倍 */
  yardTight: Object.freeze({ ratio: 0.1, slope: 0.1, angleDeg: 10 }), yardLoose: Object.freeze({ lnRatio: Math.log(2) }),
  /** NGC 3198: Υ_disk(第329便b の宣言 0.5)・環 1〜30 kpc・中心の球の半径 0.5 kpc(第331便b と同じ作り方)・離散化 [間隔 kpc, 方位]・質量分布 */
  upsDisk: 0.5, ringFromKpc: 1, ringToKpc: 30, RcKpc: 0.5, ngcDisc: Object.freeze([Object.freeze([1, 24]), Object.freeze([1, 48]), Object.freeze([0.5, 24])]), ngcDists: Object.freeze(['fixture', 'exp']),
  ngcPickKpc: Object.freeze([1, 2, 4, 8, 16, 30]), ngcOuterFromKpc: 10,
  /** NGC 3198 の核(pullSoft はエンジンの照らしの無い系では並べない —— 💫 だけ) */
  ngcKernels: Object.freeze(['geo2', 'trans']),
  /** NGC 3198 に足す組(エンジンの宣言で表せる pull の列 —— frameWeight:"pull"・D0pull 0・q は本の値 / q = 0 の列は受理されない宣言の比べる列) */
  ngcExtraCombos: Object.freeze(['pullSoft|decay|field', 'pullSoft|coord|field', 'pullSoft|decay|e3']),
  /** 近似として読める範囲で並進引きずりと比べる geoPN = 2 の列(G0 = 在位の宣言・G0bg0 = 背景 0・Gpull0 = エンジンの pull と D0pull 0〔受理される〕・Gpull0coord = その源の回転を座標変換〔q = 0 —— 受理されない〕) */
  /** 主の表の核(版 1 と同じ 3 つ —— m/r の並進引きずり transR は部 U だけで並べる) */
  mainKernels: Object.freeze(['geo2', 'trans', 'pullSoft']),
  /** 部 U(原仮定者の補足その4(2026-11-10)「回転を含んだ並進引きずりの重みを m/r にした場合の検証も行い比較する」—— 走行の前の宣言): 並進引きずりの核 m/r(transR)と m/r²(trans)×
   *  源の回転 2 × 分母(場の読み・自己 R_d = Y_k m の形 3〔主は ballMean〕・自己 κ_D m ballMean)と比べる列 4(G0・E3 の型の q = 0 の場の読み・Gpull0・その座標変換)/
   *  源の自転の型 2(book = 本の宣言〔円盤 0・中心は本の値〕・sync = 円盤の点も公転の角速度を持つ〔角速度を維持する読み〕)/ 均一さの物差し: 端 ÷ 中心付近 1 ± 10%・外側のべき |p| ≤ 0.1 */
  uniformTransDenoms: Object.freeze(['field', 'self:kappaM:point', 'self:kappaM:ballMean', 'self:kappaM:ballHarmonic', 'self:kappaD:ballMean']),
  uniformRefs: Object.freeze(['geo2|decay|e3', 'geo2|coord|field', 'pullSoft|decay|field', 'pullSoft|coord|field']),
  uniformSpins: Object.freeze(['book', 'sync']), yardUniform: Object.freeze({ ratio: 0.1, slope: 0.1 }), uniformOuterFromBook: 156,
  rangeGeos: Object.freeze([Object.freeze(['G0', 'geo2|decay|e3']), Object.freeze(['G0bg0', 'geo2|decay|field']), Object.freeze(['Gpull0', 'pullSoft|decay|field']), Object.freeze(['Gpull0coord', 'pullSoft|coord|field'])]),
  /** geoPN = 2 の宣言の NGC 3198 への写し(💫 の宣言の無次元の写し —— L = 円盤の半径〔💫 260・NGC 3198 30 kpc〕・M = 全質量・ε/L・D₀ L^p/M・q は本の値) */
  ngcScaleNote: '💫 の宣言の無次元の写し: ε_N = ε_本 × L_N/L_本・D₀,N(p) = D₀,本 × (M_N/M_本) × (L_本/L_N)^p(L = 円盤の半径・M = 全質量)・q = 本の q・中心の自転 = v_obs(R_c)/R_c・中心の半径 R_c',
  G: GR.G_SI, c: 299792458, kpcM: GR.KPC_M,
});

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
function vbarKms(rows, R) { const vg = interpAt(rows, R, 'Vgas'), vd = interpAt(rows, R, 'Vdisk'), vb = interpAt(rows, R, 'Vbul'), v2 = vg * Math.abs(vg) + PLAN.upsDisk * vd * Math.abs(vd) + GR.DECL.upsilonBul * vb * Math.abs(vb); return v2 > 0 ? Math.sqrt(v2) : null; }
function expFit(rows) {
  const pts = rows.filter((r) => r.R >= PLAN.ringFromKpc && r.R <= PLAN.ringToKpc && r.SBdisk > 0), n = pts.length;
  const mx = pts.reduce((s, r) => s + r.R, 0) / n, my = pts.reduce((s, r) => s + Math.log(r.SBdisk), 0) / n;
  let sxy = 0, sxx = 0; for (const r of pts) { sxy += (r.R - mx) * (Math.log(r.SBdisk) - my); sxx += (r.R - mx) ** 2; }
  const slope = sxy / sxx; return { hKpc: -1 / slope, SB0: Math.exp(my - slope * mx), n };
}

/* ───────── 組の宣言 ───────── */
function denomList(rules) { const out = ['e3', 'field']; for (const r of rules) for (const s of PLAN.selfShapes) out.push('self:' + r + ':' + s); return out; }
export function combos(rules) { const out = []; for (const kernel of PLAN.mainKernels) for (const rot of L.ROTS) for (const denom of denomList(rules)) out.push({ kernel, rot, denom, key: kernel + '|' + rot + '|' + denom }); return out; }
const keyOf = (o) => o.kernel + '|' + o.rot + '|' + o.denom;

/* ───────── 場の評価(1 系 —— 受け手ごと)───────── */
/**
 * sys = { pts:[{ x, y, vx, vy, m, spin, R, Rbook? }], recv:[添字], g:[受け手ごとの内向きの重力], eps, D0p:{1, 2}, q, G, c, rules }。
 * 戻り値: 組ごとに受け手ごとの行(R・u_φ・u_R・向き・dRel_φ・渦度・a_R・a_φ・自己の分・背景の分)
 */
function evalSystem(sys, combo) {
  const K = L.kernelOf(combo.kernel, sys.eps), rot = { type: combo.rot, q: sys.q };
  const [dk, rule, shape] = combo.denom.split(':');
  return sys.recv.map((i, k) => {
    const pi = sys.pts[i], src = [];
    for (let j = 0; j < sys.pts.length; j++) if (j !== i) src.push(sys.pts[j]);
    let selfW = 0, bg = 0;
    if (dk === 'e3') bg = sys.D0p[K.p];
    else if (dk === 'self') selfW = L.selfWeightOf({ shape, rule, m: pi.m, G: sys.G, c: sys.c, Rbook: pi.Rbook === undefined ? null : pi.Rbook, p: K.p }).w;   // 自己の重みは核と同じ p(単位を揃える)
    const at = [pi.x, pi.y], v = [pi.vx, pi.vy];
    const F = L.frameField({ at, sources: src, kernel: K, rot, selfW, bg, v });
    const tr = L.transportSteady({ u: F.u, J: F.J, v, kF: 1 });
    const up = L.polar(at, F.u), dp = L.polar(at, F.dRel), ap = L.polar(at, tr.a), vp = L.polar(at, v);
    return { R: up.r, uPhi: up.phi, uR: up.R, angleDeg: Math.atan2(up.R, up.phi) * 180 / Math.PI, dRelPhi: dp.phi, vort: F.vort, aR: ap.R, aPhi: ap.phi, vPhi: vp.phi, g: sys.g[k], shareSelf: F.shares.self, shareBg: F.shares.bg };
  });
}
const median = CF.median;
/** 箱ごとの中央値と円軌道の読み(continuum・rigid)—— 受け手の行を半径の箱で */
function binRows(rows, edges) {
  const out = [];
  for (let b = 0; b + 1 < edges.length; b++) {
    const q = rows.filter((r) => r.R >= edges[b] && r.R < edges[b + 1]);
    if (!q.length) { out.push({ lo: edges[b], hi: edges[b + 1], n: 0 }); continue; }
    const m = (k) => median(q.map((r) => r[k]));
    out.push({ lo: edges[b], hi: edges[b + 1], n: q.length, R: m('R'), uPhi: m('uPhi'), uR: m('uR'), angleDeg: m('angleDeg'), dRelPhi: m('dRelPhi'), vort: m('vort'), aR: m('aR'), aPhi: m('aPhi'), vPhi: m('vPhi'), g: m('g'),
      shareSelf: m('shareSelf'), shareBg: m('shareBg') });
  }
  return out;
}
function withCircular(rows) {
  const sl = L.localSlopes(rows.map((r) => r.R), rows.map((r) => r.uPhi));
  return rows.map((r, k) => {
    if (!(r.n === undefined || r.n > 0)) return r;
    const circ = L.circularVelocity({ g: Math.max(0, r.g), R: r.R, uPhi: r.uPhi, omegaZ: r.vort });
    return Object.assign({}, r, { slope: sl[k], vNewton: circ.vNewton, vContinuum: circ.vContinuum, vRigid: circ.vRigid, dvContinuum: circ.vContinuum === null ? null : circ.vContinuum - circ.vNewton, dvRigid: circ.vRigid - circ.vNewton, frameCheck: circ.frameCheck });
  });
}

/* ───────── E エンジンとの照らしと窓 ───────── */
function bookCopy(HP, patch) {
  const raw = HP.allPresets().find((p) => p.id === BOOK_ID);
  const bk = clone(raw); Object.assign(bk.physics, patch || {});
  const v = HP.validatePreset(bk);
  if (!v.ok) throw new Error('受理されない写し ' + JSON.stringify(patch) + ': ' + v.err);
  return { raw, preset: v.preset, warnings: v.warnings || [] };
}
function stateOf(S) {
  const n = S.n, A = (a) => Array.from(a.slice(0, n));
  return { n, x: A(S.x), y: A(S.y), vx: A(S.vx), vy: A(S.vy), m: A(S.m), spin: A(S.spin), R: A(S.R), pinned: A(S.pinned) };
}
function outerVphi(S) { let s = 0, c = 0; for (let i = 0; i < S.n; i++) { if (S.pinned[i]) continue; const r = Math.hypot(S.x[i], S.y[i]); if (r >= PLAN.outerBand[0] && r <= PLAN.outerBand[1]) { s += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r; c++; } } return { vphi: c ? s / c : null, n: c }; }
export function partEngine(HP) {
  const rows = [];
  for (const cmb of PLAN.engineCombos) {
    const patch = { frameWeight: cmb.frameWeight };
    if (cmb.bgZero) { if (cmb.frameWeight === 'pull') patch.D0pull = 0; else patch.D0 = 0; }
    const B = bookCopy(HP, patch), S = HP.sim; S.build(B.preset);
    const n = S.n, orig = S._core; let snap = null, calls = 0;
    S._core = function (dt, mode) { calls++; snap = stateOf(S); return orig.call(this, dt, mode); };
    S.step(PLAN.dt); S.step(PLAN.dt);
    S._core = orig;
    const p = S.params, pull = cmb.frameWeight === 'pull', K = L.kernelOf(pull ? 'pullSoft' : 'geo2', p.softening), bg = pull ? (p.D0pull !== undefined ? p.D0pull : p.D0) : p.D0;
    const sumWu = pull ? S.sumWu : S.sumW, g2 = S._g2;
    let mu = 0, su = 0, mg = 0, sg = 0, mw = 0, nr = 0;
    for (let i = 0; i < n; i++) {
      if (snap.pinned[i]) continue;
      const src = []; for (let j = 0; j < n; j++) if (j !== i) src.push({ x: snap.x[j], y: snap.y[j], vx: snap.vx[j], vy: snap.vy[j], m: snap.m[j], spin: snap.spin[j], R: snap.R[j] });
      const F = L.frameField({ at: [snap.x[i], snap.y[i]], sources: src, kernel: K, rot: { type: 'decay', q: p.q }, bg });
      mu = Math.max(mu, Math.abs(F.u[0] - S.uPx[i]), Math.abs(F.u[1] - S.uPy[i])); su = Math.max(su, Math.abs(F.u[0]), Math.abs(F.u[1]));
      const e = [F.dP[0][0] - g2.dPxx[i], F.dP[0][1] - g2.dPxy[i], F.dP[1][0] - g2.dPyx[i], F.dP[1][1] - g2.dPyy[i], F.dW[0] - g2.dWx[i], F.dW[1] - g2.dWy[i]];
      mg = Math.max(mg, ...e.map(Math.abs)); sg = Math.max(sg, ...[F.dP[0][0], F.dP[0][1], F.dP[1][0], F.dP[1][1], F.dW[0], F.dW[1]].map(Math.abs));
      mw = Math.max(mw, relD(F.Wsrc, sumWu[i])); nr++;
    }
    rows.push({ key: cmb.key, frameWeight: cmb.frameWeight, kernel: K.name, p: K.p, eps: K.eps, bg, q: p.q, D0: p.D0, kFrame: p.kFrame, calls, receivers: nr, uRel: mu / su, gradRel: mg / sg, wsumRel: mw, warnings: B.warnings });
  }
  // 源の回転を座標変換にする宣言(q = 0)は受理器が値域の下限へ直す —— 在位のエンジンの宣言で表せない
  const q0 = bookCopy(HP, { q: 0 });
  const qRange = { declared: 0, accepted: q0.preset.physics.q, warnings: q0.warnings };
  // 窓(600 步): k_F = 1 の写し 4 つと k_F = 0 の写し 1 つ
  const win = [];
  const runWin = (key, patch) => {
    const t0 = Date.now(), B = bookCopy(HP, patch), S = HP.sim; S.build(B.preset);
    const v0 = outerVphi(S);
    for (let k = 0; k < PLAN.windowSteps; k++) S.step(PLAN.dt);
    const v1 = outerVphi(S), sp = S.mechSpec ? S.mechSpec(true) : null, prof = [];
    for (let b = 0; b + 1 < PLAN.binEdges.length; b++) { let s = 0, c = 0; for (let i = 0; i < S.n; i++) { if (S.pinned[i]) continue; const r = Math.hypot(S.x[i], S.y[i]); if (r >= PLAN.binEdges[b] && r < PLAN.binEdges[b + 1]) { s += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r; c++; } } prof.push({ lo: PLAN.binEdges[b], hi: PLAN.binEdges[b + 1], n: c, vphi: c ? s / c : null }); }
    win.push({ key, patch, kFrame: S.params.kFrame, steps: PLAN.windowSteps, dt: PLAN.dt, vphiStart: v0.vphi, vphiEnd: v1.vphi, nOuter: v1.n, profile: prof, nan: S.hasNaN(), clampV: S.clampVN || 0, clampR: S.clampRN || 0,
      pi: sp ? Array.from(sp.pi) : null, wallSec: (Date.now() - t0) / 1000 });
  };
  for (const cmb of PLAN.engineCombos.filter((q) => PLAN.windowCombos.includes(q.key))) { const patch = { frameWeight: cmb.frameWeight }; if (cmb.bgZero) { if (cmb.frameWeight === 'pull') patch.D0pull = 0; else patch.D0 = 0; } runWin(cmb.key, patch); }
  runWin('kF0', { kFrame: 0 });
  const w0 = win.find((q) => q.key === 'kF0');
  win.forEach((q) => { q.ratioOverKF0 = q.key === 'kF0' ? 1 : q.vphiEnd / w0.vphiEnd; q.profileRatio = q.profile.map((b, k) => (b.vphi !== null && w0.profile[k].vphi ? b.vphi / w0.profile[k].vphi : null)); });
  return { anchors: rows, qRange, windows: win, piLabels: ['重力', '測地線(1PN)', '熱斥力', '接触', '結合', '引きずり'] };
}

/* ───────── B 💫 の同じ入力 ───────── */
export function bookSystem(HP, { centerSpinZero = false } = {}) {
  const B = bookCopy(HP, null), S = HP.sim; S.build(B.preset);
  const st = stateOf(S), p = S.params, n = st.n;
  const pts = []; for (let i = 0; i < n; i++) pts.push({ x: st.x[i], y: st.y[i], vx: st.vx[i], vy: st.vy[i], m: st.m[i], spin: (centerSpinZero && i === PLAN.centerIndex) ? 0 : st.spin[i], R: st.R[i], Rbook: st.R[i] });
  const recv = []; for (let i = 0; i < n; i++) if (!st.pinned[i]) recv.push(i);
  const eps2 = p.softening * p.softening;
  const g = recv.map((i) => { let ax = 0, ay = 0; for (let j = 0; j < n; j++) { if (j === i) continue; const dx = st.x[i] - st.x[j], dy = st.y[i] - st.y[j], q2 = dx * dx + dy * dy + eps2, iv = 1 / (q2 * Math.sqrt(q2)); ax -= p.G * st.m[j] * dx * iv; ay -= p.G * st.m[j] * dy * iv; }
    const r = Math.hypot(st.x[i], st.y[i]); return -(ax * st.x[i] + ay * st.y[i]) / r; });
  const Mtot = st.m.reduce((a, b) => a + b, 0), Lbook = B.raw.bodies.find((b) => b.type === 'disk').radius;
  const claim = (B.raw.claims || []).find((q) => q.metric === 'outerRotationBoostRatio') || null;   // claim の窓(expected —— 説明文の欄は読まない)
  return { sys: { pts, recv, g, eps: p.softening, D0p: { 1: p.D0, 2: p.D0pull !== undefined ? p.D0pull : p.D0 }, q: p.q, G: p.G, c: p.cLight }, decl: { G: p.G, c: p.cLight, D0: p.D0, eps: p.softening, q: p.q, kFrame: p.kFrame,
    geoPN: p.geoPN, lambdaPN: p.lambdaPN, frameWeight: p.frameWeight, n, nRecv: recv.length, Mtot, Lbook, centerM: st.m[PLAN.centerIndex], centerSpin: pts[PLAN.centerIndex].spin, centerR: st.R[PLAN.centerIndex],
    claimWindow: claim ? claim.expected : null, claimTestId: claim ? claim.testId : null, Rd: { centerKappaM: L.selfWeightOf({ shape: 'point', rule: 'kappaM', m: st.m[0], G: p.G, c: p.cLight }).R,
      diskMedianKappaM: median(recv.map((i) => L.selfWeightOf({ shape: 'point', rule: 'kappaM', m: st.m[i], G: p.G, c: p.cLight }).R)), diskMedianBookR: median(recv.map((i) => st.R[i])) } } };
}
export function partBook(HP) {
  const out = {};
  for (const [tag, opt] of [['book', {}], ['centerSpin0', { centerSpinZero: true }]]) {
    const { sys, decl } = bookSystem(HP, opt), table = {};
    let fcMax = 0;
    for (const cmb of combos(PLAN.selfRulesBook)) table[keyOf(cmb)] = withCircular(binRows(evalSystem(sys, cmb), PLAN.binEdges)).map((r) => {
      if (fin(r.frameCheck)) fcMax = Math.max(fcMax, Math.abs(r.frameCheck));
      const { dvRigid, frameCheck, uR, aPhi, ...keep } = r; void dvRigid; void frameCheck; void uR; void aPhi; return keep; });   // 動径の成分は向きの欄(angleDeg)で持つ
    out[tag] = { decl, table, nCombos: Object.keys(table).length, frameCheckMax: fcMax };
  }
  return out;
}

/* ───────── N NGC 3198 ───────── */
export function ngcSystem(FX, { dist, dR, K }, scale) {
  const rows = FX.rows, EF = expFit(rows);
  const sigma = (R) => PLAN.upsDisk * (dist === 'fixture' ? interpAt(rows, R, 'SBdisk') : EF.SB0 * Math.exp(-R / EF.hKpc));
  const Rs = []; for (let k = 0; ; k++) { const R = PLAN.ringFromKpc + k * dR; if (R > PLAN.ringToKpc + 1e-9) break; Rs.push(Math.round(R * 1e6) / 1e6); }
  const ringM = Rs.map((R) => 2 * Math.PI * (R * 1e3) * (dR * 1e3) * sigma(R) * MSUN);
  let Mc = 0; const nn = 200; for (let i = 0; i < nn; i++) { const r = (i + 0.5) * PLAN.RcKpc / nn; Mc += 2 * Math.PI * r * 1e3 * (PLAN.RcKpc / nn * 1e3) * sigma(r); } Mc *= MSUN;
  const OmC = interpAt(rows, PLAN.RcKpc, 'Vobs') * 1e3 / (PLAN.RcKpc * KPC);
  const pts = [{ x: 0, y: 0, vx: 0, vy: 0, m: Mc, spin: OmC, R: PLAN.RcKpc * KPC }], recv = [], g = [], vbar = [], vobs = [];
  Rs.forEach((R, k) => {
    const vo = interpAt(rows, R, 'Vobs') * 1e3, vb = vbarKms(rows, R) * 1e3, Rm = R * KPC;
    for (let q = 0; q < K; q++) { const f = 2 * Math.PI * q / K; if (q === 0) recv.push(pts.length); pts.push({ x: Rm * Math.cos(f), y: Rm * Math.sin(f), vx: -vo * Math.sin(f), vy: vo * Math.cos(f), m: ringM[k] / K, spin: 0, R: 1 }); }
    g.push(vb * vb / Rm); vbar.push(vb); vobs.push(vo);
  });
  const Mtot = Mc + ringM.reduce((a, b) => a + b, 0), Lng = PLAN.ringToKpc * KPC;
  const eps = scale.epsOverL * Lng, D0p = { 1: scale.D0LM[1] * Mtot / Lng, 2: scale.D0LM[2] * Mtot / (Lng * Lng) };
  return { sys: { pts, recv, g, eps, D0p, q: scale.q, G: PLAN.G, c: PLAN.c }, Rs, vbar, vobs, Mc, Mdisk: Mtot - Mc, OmC, EF, decl: { dist, dR, K, epsKpc: eps / KPC, D0p, q: scale.q, OmegaC: OmC, McMsun: Mc / MSUN, MdiskMsun: (Mtot - Mc) / MSUN } };
}
export function partNgc(FX, scale) {
  const out = { main: {}, side: [] };
  for (const dist of PLAN.ngcDists) for (const [dR, K] of PLAN.ngcDisc) {
    const N = ngcSystem(FX, { dist, dR, K }, scale), table = {};
    let fcMax = 0, uRMax = 0;
    for (const cmb of combos(PLAN.selfRulesNgc).filter((q) => PLAN.ngcKernels.includes(q.kernel) || PLAN.ngcExtraCombos.includes(q.key))) {
      const rows = evalSystem(N.sys, cmb).map((r, k) => Object.assign(r, { RKpc: N.Rs[k], vObs: N.vobs[k], vBar: N.vbar[k] }));   // R は m(SI で計算 —— 表示は RKpc・km/s)
      table[keyOf(cmb)] = withCircular(rows).map((r) => {
        if (fin(r.frameCheck)) fcMax = Math.max(fcMax, Math.abs(r.frameCheck));
        uRMax = Math.max(uRMax, Math.abs(r.uR) / Math.max(1e-300, Math.abs(r.uPhi)));
        return { RKpc: r.RKpc, uPhi: r.uPhi, dRelPhi: r.dRelPhi, vort: r.vort, aR: r.aR, vObs: r.vObs, vBar: r.vBar, slope: r.slope, vContinuum: r.vContinuum, dvContinuum: r.dvContinuum, shareSelf: r.shareSelf, shareBg: r.shareBg }; });   // 動径の成分・向き(0)・重力(v_bar²/R)は軸対称で落とす
    }
    const isMain = dR === PLAN.ngcDisc[0][0] && K === PLAN.ngcDisc[0][1];
    if (isMain) out.main[dist] = { decl: N.decl, Rs: N.Rs, table, frameCheckMax: fcMax, uRMaxRel: uRMax };
    else out.side.push({ decl: N.decl, summary: Object.fromEntries(Object.entries(table).map(([k, rows]) => [k, { uPhiPick: PLAN.ngcPickKpc.map((R) => { const r = rows.find((q) => Math.abs(q.RKpc - R) < 1e-9); return r ? r.uPhi : null; }) }])) });
  }
  return out;
}

/* ───────── D 違いの分解・A 近似として読める範囲 ───────── */
function swapsFrom(base, rules) {
  const alt = { kernel: base.kernel === 'geo2' ? 'trans' : 'geo2', rot: base.rot === 'decay' ? 'coord' : 'decay' };
  const out = [{ axis: 'kernel', to: Object.assign({}, base, { kernel: alt.kernel }) }, { axis: 'kernelPullSoft', to: Object.assign({}, base, { kernel: 'pullSoft' }) }, { axis: 'rot', to: Object.assign({}, base, { rot: alt.rot }) }];
  const dens = ['e3', 'field', 'self:kappaM:ballMean'].filter((d) => d !== base.denom);
  for (const d of dens) out.push({ axis: d === 'e3' ? 'denomE3' : d === 'field' ? 'denomField' : 'denomSelfKappaM', to: Object.assign({}, base, { denom: d }) });
  void rules; return out;
}
export function decompose(table, quantity) {
  const res = {};
  for (const [bn, base] of [['G0', PLAN.baseG0], ['G0bg0', PLAN.baseG0bg0], ['TF', PLAN.baseTF], ['TS', PLAN.baseTS]]) {
    const b = table[keyOf(base)], rows = [];
    for (const sw of swapsFrom(base)) {
      const a = table[keyOf(sw.to)];
      if (!a) continue;   // NGC 3198 は pullSoft を並べない
      const s = L.ratioSummary(b.map((r) => (r.n === 0 ? null : r[quantity])), a.map((r) => (r.n === 0 ? null : r[quantity])));
      rows.push({ axis: sw.axis, to: keyOf(sw.to), medianAbsLn: s.medianAbsLn, maxAbsLn: s.maxAbsLn, signFlips: s.signFlips, n: s.n });
    }
    const ranked = rows.filter((r) => fin(r.medianAbsLn)).slice().sort((x, y) => y.medianAbsLn - x.medianAbsLn).map((r) => r.axis);
    res[bn] = { base: keyOf(base), rows, ranked };
  }
  return res;
}
export function approxRange(table, rules, label) {
  const geos = PLAN.rangeGeos.map(([nm, k]) => [nm, table[k]]);
  const targets = [{ kernel: 'trans', rot: 'coord', denom: 'field' }];
  for (const r of rules) for (const s of PLAN.selfShapes) targets.push({ kernel: 'trans', rot: 'coord', denom: 'self:' + r + ':' + s });
  const rows = [];
  for (const [gname, G] of geos) for (const tg of targets) {
    const Tt = table[keyOf(tg)], per = [];
    for (let k = 0; k < G.length; k++) {
      const a = G[k], b = Tt[k];
      if (a.n === 0 || !fin(a.uPhi) || !fin(b.uPhi) || b.uPhi === 0 || a.uPhi === 0) { per.push({ R: a.RKpc !== undefined ? a.RKpc : a.R, tight: false, loose: false, ratio: null }); continue; }
      const ratio = a.uPhi / b.uPhi, dSl = fin(a.slope) && fin(b.slope) ? Math.abs(a.slope - b.slope) : null, dAng = Math.abs((a.angleDeg || 0) - (b.angleDeg || 0));   // NGC 3198 の環は軸対称(向き 0)
      const dvRatio = fin(a.dvContinuum) && fin(b.dvContinuum) && b.dvContinuum !== 0 ? a.dvContinuum / b.dvContinuum : null;
      const tight = Math.abs(ratio - 1) <= PLAN.yardTight.ratio && dSl !== null && dSl <= PLAN.yardTight.slope && dAng <= PLAN.yardTight.angleDeg;
      const loose = ratio > 0 && Math.abs(Math.log(ratio)) <= PLAN.yardLoose.lnRatio;
      per.push({ R: a.RKpc !== undefined ? a.RKpc : a.R, ratio, dSlope: dSl, tight, loose, dvTight: dvRatio !== null && Math.abs(dvRatio - 1) <= PLAN.yardTight.ratio });
    }
    rows.push({ label, geo: gname, target: keyOf(tg), nTight: per.filter((q) => q.tight).length, nLoose: per.filter((q) => q.loose).length, nDvTight: per.filter((q) => q.dvTight).length, n: per.length,
      tightR: per.filter((q) => q.tight).map((q) => q.R), looseR: per.filter((q) => q.loose).map((q) => q.R), ratioMedian: median(per.map((q) => q.ratio)), ratioMin: Math.min(...per.filter((q) => fin(q.ratio)).map((q) => q.ratio)),
      ratioMax: Math.max(...per.filter((q) => fin(q.ratio)).map((q) => q.ratio)), per });
  }
  return rows;
}

/* ───────── U 重み m/r の並進引きずり(原仮定者の補足その4)───────── */
export function uniformCombos() {
  const out = [];
  for (const kernel of ['transR', 'trans']) for (const rot of L.ROTS) for (const denom of PLAN.uniformTransDenoms) out.push({ kernel, rot, denom, key: kernel + '|' + rot + '|' + denom });
  for (const k of PLAN.uniformRefs) { const [kernel, rot, denom] = k.split('|'); out.push({ kernel, rot, denom, key: k }); }
  return out;
}
function withSync(sys) {   // 円盤の点(固定の天体でない受け手)に公転の角速度を持たせる写し(器の中の宣言 —— 本は変えない)
  const recvSet = new Set(sys.recv);
  return Object.assign({}, sys, { pts: sys.pts.map((p, i) => (recvSet.has(i) || p.ring ? Object.assign({}, p, { spin: (p.x * p.vy - p.y * p.vx) / (p.x * p.x + p.y * p.y) }) : p)) });
}
export function partUniform(HP, FX, scale) {
  const out = { yard: PLAN.yardUniform, systems: [] };
  const sysList = [];
  for (const [tag, opt] of [['book', {}], ['bookSpin0', { centerSpinZero: true }]]) { const { sys } = bookSystem(HP, opt); sysList.push({ tag, kind: 'book', sys }); }
  for (const dist of PLAN.ngcDists) { const N = ngcSystem(FX, { dist, dR: PLAN.ngcDisc[0][0], K: PLAN.ngcDisc[0][1] }, scale); N.sys.pts.forEach((p, i) => { if (i > 0) p.ring = true; }); sysList.push({ tag: dist === 'fixture' ? 'ngcFixture' : 'ngcExp', kind: 'ngc', sys: N.sys, N }); }
  for (const S0 of sysList) for (const spin of PLAN.uniformSpins) {
    const sys = spin === 'sync' ? withSync(S0.sys) : S0.sys, series = {};
    for (const cmb of uniformCombos()) {
      if (S0.kind === 'ngc' && spin === 'sync' && cmb.rot === 'decay') continue;   // NGC 3198 の環の点に源の半径が無い(E2 の減衰は源の半径を見る)—— 並べない
      const rows = evalSystem(sys, cmb);
      let R, u, extra = {};
      if (S0.kind === 'book') { const b = binRows(rows, PLAN.binEdges); R = b.map((q) => q.R); u = b.map((q) => q.uPhi); }
      else { R = S0.N.Rs.slice(); u = rows.map((q) => q.uPhi); extra = { uOverVobs: u.map((x, k) => x / S0.N.vobs[k]), vRigidOverVobs: u.map((x, k) => (S0.N.vbar[k] + x) / S0.N.vobs[k]) }; }
      const un = L.uniformity({ R, f: u, outerFrom: S0.kind === 'book' ? PLAN.uniformOuterFromBook : PLAN.ngcOuterFromKpc, yard: PLAN.yardUniform });
      series[cmb.key] = Object.assign({ R, uPhi: u }, extra, un);
    }
    out.systems.push({ tag: S0.tag, spin, nSeries: Object.keys(series).length, series });
  }
  return out;
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const E = J.engine, Bk = J.book, Ng = J.ngc;
  const nB = combos(PLAN.selfRulesBook).length, nN = combos(PLAN.selfRulesNgc).filter((q) => PLAN.ngcKernels.includes(q.kernel) || PLAN.ngcExtraCombos.includes(q.key)).length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    engineAnchorU: E.anchors.length === PLAN.engineCombos.length && E.anchors.every((q) => q.calls === 2 && q.receivers === Bk.book.decl.nRecv && q.uRel <= PLAN.engineTolU && q.wsumRel <= PLAN.engineTolU),
    engineAnchorGrad: E.anchors.every((q) => q.gradRel <= PLAN.engineTolGrad),
    qRangeRecorded: E.qRange.declared === 0 && E.qRange.accepted > 0,
    windowsFinite: E.windows.length === PLAN.windowCombos.length + 1 && E.windows.every((q) => q.nan === false && fin(q.vphiEnd) && q.nOuter > 0),
    bookComplete: Bk.book.nCombos === nB && Bk.centerSpin0.nCombos === nB && Object.values(Bk.book.table).every((rows) => rows.length === PLAN.binEdges.length - 1 && rows.every((r) => r.n > 0 && fin(r.uPhi) && fin(r.aR))),
    ngcComplete: PLAN.ngcDists.every((d) => Ng.main[d] && Object.keys(Ng.main[d].table).length === nN && Ng.main[d].uRMaxRel <= 1e-9 && Object.values(Ng.main[d].table).every((rows) => rows.length === Ng.main[d].Rs.length && rows.every((r) => fin(r.uPhi))))
      && Ng.side.length === PLAN.ngcDists.length * (PLAN.ngcDisc.length - 1),
    frameIdentity: Bk.book.frameCheckMax <= 1e-9 && Bk.centerSpin0.frameCheckMax <= 1e-9 && PLAN.ngcDists.every((d) => Ng.main[d].frameCheckMax <= 1e-9),
    decomposed: ['book', 'ngcFixture'].every((k) => ['G0', 'G0bg0', 'TF', 'TS'].every((b) => J.decomp[k][b].rows.length >= 4 && J.decomp[k][b].ranked.length >= J.decomp[k][b].rows.length - 1)),
    uniformTable: J.uniform.systems.length === 8 && J.uniform.systems.every((q) => q.nSeries === (q.tag.startsWith('ngc') && q.spin === 'sync' ? 12 : 24) && Object.values(q.series).every((z) => z.uPhi.every(fin) && typeof z.uniform === 'boolean')),
    rangeDeclared: J.range.length > 0 && J.range.every((q) => q.n > 0 && Array.isArray(q.per)) && PLAN.rangeGeos.every(([nm]) => J.range.some((q) => q.geo === nm)),
  };
}
export function runAll(HP, root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const FX = readFixture(root); mark('inputs');
  const engine = partEngine(HP); mark('engine');
  const book = partBook(HP); mark('book');
  const bd = book.book.decl, scale = { epsOverL: bd.eps / bd.Lbook, D0LM: { 1: bd.D0 * bd.Lbook / bd.Mtot, 2: bd.D0 * bd.Lbook * bd.Lbook / bd.Mtot }, q: bd.q };
  const ngc = partNgc(FX, scale); mark('ngc');
  const decomp = {
    book: decompose(book.book.table, 'uPhi'), bookSpin0: decompose(book.centerSpin0.table, 'uPhi'),
    ngcFixture: decompose(ngc.main.fixture.table, 'uPhi'), ngcExp: decompose(ngc.main.exp.table, 'uPhi'),
    bookDv: decompose(book.book.table, 'dvContinuum'), ngcFixtureDv: decompose(ngc.main.fixture.table, 'dvContinuum'),
  }; mark('decomp');
  const range = [...approxRange(book.book.table, PLAN.selfRulesBook, 'book'), ...approxRange(book.centerSpin0.table, PLAN.selfRulesBook, 'bookSpin0'),
    ...approxRange(ngc.main.fixture.table, PLAN.selfRulesNgc, 'ngcFixture'), ...approxRange(ngc.main.exp.table, PLAN.selfRulesNgc, 'ngcExp')]; mark('range');
  const uniform = partUniform(HP, FX, scale); mark('uniform');
  const J = { inputs: { fixtureSha256Same: FX.shaSame, fixtureVersion: FX.J.version, fixtureRows: FX.rows.length }, scale, pure, engine, book, ngc, decomp, range, uniform, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W332B_TARGET || 'beta/index.html';
  const OUT = process.env.W332B_OUT ? (path.isAbsolute(process.env.W332B_OUT) ? process.env.W332B_OUT : path.join(ROOT, process.env.W332B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第332便b transgeo2(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w332b-transgeo2.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の補足(2026-11-10)「座標変換版の「回転引きずり」は、天体の半径を見ないので、「並進引きずり」に統合する。銀河のスケールでの geoPN=2 の近似と比較する」「R_d は観測半径とは別の値」(作業仮説 —— 診断で検査)・統括の検証項目 R316',
    decl: L.DECL, plan: PLAN, kernels: L.KERNELS, rots: L.ROTS, selfRules: L.SELF_RULES, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w332b-transgeo2.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs',
    'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w329b-galrot.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第332便b', target: TARGET, code: CODE, inputs: [TARGET, FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, stage: 'transgeo2', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・💫 galaxyGeo2 の写し(受理器 → build → 步)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

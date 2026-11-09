// 第331便a(原仮定者の決断(2026-11-09 —— AN586)「並進引きずりと回転引きずりは一緒に処理しても構わない座標変換であり、m/r² の重み付けをする。先に検証を行う」・
//   原仮定者の決断(2026-11-09 —— AN587〜AN590)・原仮定者の整理(2026-11-09)「引きずりは相対的な移動と回転に m/r² の重み」「軸引きずりは引きずられる側の引きずりの差分」・
//   原仮定者の回答(2026-11-09 —— AN591)・統括の検証項目 R310): **座標変換の引きずりと今のエンジンの成分ごとの比べる表・回転の自転の口と潮汐の口(別の channel)・内部熱の 3 欄・
//   lockTargets・地球と火星の比べる列の器**(段 coordtwist-331a —— 正本 tests/out/coordtwist-w331a.json・lib tests/lib-w331a-coordtwist.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・
//   第330便a/b の lib の本文は変えない(呼ぶか包む)。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d の**写し**〔器の中 —— 本の JSON は 1 bit も変えない〕を受理器と
//   読み口 inertialDragIsqState に通す —— 步は進めない)。1 プロセス。入力は html・第330便a の正本(tests/out/spinclass-w330a.json —— 16 体の観測の自転・軸・慣性・由来ごとの口の行・帳簿・
//   金星の符号の表・A の宣言)・第315便c の正本(tests/out/inposk1-w315c.json —— 在位の 7 本の近点の K1 の引きずりの分 DG)。
//
// ■ 何をするか
//   P 純関数の場面(lib —— 座標則の性質・自己の重みの宣言・口の登録と 4 条件・近点の一次の目安・通約・内部熱の 3 欄)
//   E 今のエンジンとの成分ごとの比べる表(写しで —— 変えない): 2 体(太陽・地球 —— 地球の距離 1・2・4・8 倍)・3 体(太陽・地球・月)・16 体の写しで、座標則の並進の β・回転の係数(β r)・
//     自転の滑りの係数と、エンジンの K1(規則 R_d = Y_k m)・K2(宣言の半径)の並進の β・回転の係数 ⟨(m M/W) n̂⟩・軸の ω(bevel)の値と距離の傾きと比(回転と軸は spinDrag を写しに宣言)
//   A 在位の 7 本(K1 の規則)の大きさの目安: エンジンの K1 の β(🗺️ の太陽と惑星の 2 体の写し)から近点の一次の目安 → 在位の正本の DG と比べる(残差)→ 同じ方法で座標則の並進・回転の分と
//     自転の滑り(rad/s)を自己の重みの型ごとに(一次の目安 —— 写しの時間発展ではない)
//   R 回転の自転の口と潮汐の口(AN587): 口の登録(channel と interactionId)・4 条件(回転の口だけ・潮汐だけ・両方・両方 0)で合トルク・由来別の熱・帳簿(潮汐の口は第330便a の正本の行 ——
//     受け手の軸の向き)・回転の口の大きさの表(16 体 × 自己の重みの型 × Γ_rot の型)
//   H 内部熱の 3 欄(第330便a の帳簿の行を lib で包む): 帳簿が閉じた/定常(合トルクの相対)/観測の熱流との比
//   K lockTargets(AN588/AN589/AN591 —— 宣言は正本の先頭): 主星 1 つの衛星・金星(太陽 + 地球)・水星(太陽 —— 3:2)・通約の値・応答の重み(第330便a の表)・分類の一致と機構の実装の欄・金星の熱潮汐の 3 列
//   M 地球と火星の比べる列(AN590): 座標則(m/r²・自己を含む)の合成後の自転の目標と滑り(太陽・銀河〔第330便a の A の宣言と天の川の Ω〕・月・他の天体)—— 対照(合わせない)
// ■ 言わないこと: 座標則と今のエンジンの関係は成分ごとの表と残差(同じとは書かない)・二重計上は帳簿の表の値・ロックは宣言と通約の値(機構を実装したとは書かない)・
//   近点の値は一次の目安(写しの値ではない)・引きずり d を力と書かない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w331a-coordtwist.mjs';
import * as W from './lib-w330b-dragweight.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🗺️ solarSystem16Inertial3d の 1 本〔写しの元 —— .find で引く〕。
//   roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   エンジンを読む(core)。ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w331a-coordtwist-1';
export const OUT_MAIN = 'tests/out/coordtwist-w331a.json';
export const SPINCLASS = 'tests/out/spinclass-w330a.json';
export const INPOSK1 = 'tests/out/inposk1-w315c.json';
export const BOOK_ID = 'solarSystem16Inertial3d';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)));
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違えない書き方)
const DAY = 86400, YEAR = 365.25 * DAY, CENTURY = 36525 * DAY, ARCSEC = Math.PI / 180 / 3600;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const NOT_CLAIM = Object.freeze(['座標則と今のエンジンは成分ごとの対応表と残差(同じとは書かない —— 並進・回転・自転の口の割り当てが違う)', '自己の重みは有限の宣言(m/0² にしない —— 型で桁が動く)',
  '近点と自転の大きさは一次の目安(写しの時間発展ではない —— 在位の正本の値と比べた残差を並べる)', '回転の口の目標を角加速度やジュールに読まない(応答 Γ_rot の宣言が要る)',
  '二重計上は帳簿の表の値(口の登録の重複を拒否する道具と、4 条件の加算の照合)', 'ロックは宣言と通約の値(金星・水星の機構を実装したとは書かない —— 分類の一致と機構の実装を分ける)',
  '地球と火星は対照の列(1 つの A への当てはめは繰り返さない・新しい定数を作らない)', '内部熱は帳簿が閉じた・定常・観測の熱流との比を別の欄に(閉じたことは観測に合ったことではない)', '引きずり d は速度で、力・加速度ではない']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 16 体の本の添字の順(第330便a の lib の DECL と同じ順) */
  keys: Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', 'europa', 'ganymede', 'callisto', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  /** 2 体(太陽・地球)の地球の距離の倍率・3 体(太陽・地球・月)・写しに宣言する spinDrag(回転と軸 —— 第330便b の成分ごとの写しと同じ宣言) */
  duo: Object.freeze([0, 3]), duoFactors: Object.freeze([1, 2, 4, 8]), trio: Object.freeze([0, 3, 4]), spinDecl: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel' }),
  /** 自己の重みの型(形 × 規則 —— 主の 2 つは ballHarmonic × kappaM〔K1 の規則の半径〕と ballHarmonic × radius〔観測の半径〕・全部の 6 つは正本) */
  selfMain: Object.freeze(['ballHarmonic|kappaM', 'ballHarmonic|radius']),
  selfAll: Object.freeze(L.SELF_SHAPES.flatMap((s) => L.SELF_RULES.map((r) => s + '|' + r))),
  /** 傾きの門(エンジンの読み口の傾きと次数の差の上限 —— 第330便b と同じ) */
  slopeTol: 0.05,
  /** 在位の 7 本(K1 の規則 —— 第315便c の移行の本)の惑星と 🗺️ の添字 */
  planets: Object.freeze([MER, 'venus', 'mars', 'jupiter', SAT, 'uranus', 'neptune']),
  /** 近点の一次の目安の K1 の残差の門(在位の正本の DG との相対 —— 一次と軌道の平均の分) */
  apsisK1Tol: 0.01,
  /** AN587 の 4 条件の組(受け手・主星 —— 主の 2 組)と回転の口の表の受け手(潮汐ロックの 7 衛星・水星・金星) */
  fourPairs: Object.freeze([Object.freeze(['moon', 'earth']), Object.freeze(['io', 'jupiter'])]),
  rotPortBodies: Object.freeze(['moon', 'io', 'europa', 'ganymede', 'callisto', 'titan', 'triton', MER, 'venus']),
  /** 回転の口の応答 Γ_rot の型(f I/τ_0 —— 第330便a の受け手の演算の型 2 つ・τ_0 は年齢〔第330便a の正本の tauAge〕) */
  gammaRotForms: Object.freeze(['ballMean', 'inertiaShare']),
  /** 潮汐の口の行(第330便a の正本の由来ごとの行 —— 球の平均・τ_0 = 年齢・本の向き) */
  tideRow: Object.freeze({ form: 'ballMean', tau: 'age', proj: 'book' }),
  /** 銀河の源(地球と火星の列 —— 自転の目標だけに入れる): 天の川の Ω(第329便b の表 10 —— 文献の値)・R0 8.2 kpc・M_eq = (Ω R0)² R0/G(球の等価 —— 宣言)・
   *  A の宣言(第330便a の正本の Asun —— 太陽の口が銀河だけという接続の帰結)と軸 ĝ(第330便a の正本の g) */
  galOmega: 8.815e-16, galR0Kpc: 8.2, kpcM: 3.0856775814913673e19, galSource: '天の川の Ω = A_O − B_O(第329便b の表 10 —— 文献の値)・R0 8.2 kpc・M_eq = (Ω R0)² R0/G(球の等価の質量 —— 宣言)・A ĝ(第330便a の正本の宣言)',
  /** 火星と地球の観測の自転の比(第330便a の正本の sObs から作る —— 比べる列) */
  earthMarsKeys: Object.freeze(['earth', 'mars']),
  yearS: YEAR,
});
/** lockTargets の宣言(AN588/AN589/AN591 —— 走行の前に置く・正本の先頭に書く。分類の一致と機構の実装を分ける) */
export const LOCK_TARGETS = Object.freeze([
  ...['moon', 'io', 'europa', 'ganymede', 'callisto', 'titan', 'triton'].map((k) => Object.freeze({ body: k, targetBody: Object.freeze([{ moon: 'earth', io: 'jupiter', europa: 'jupiter', ganymede: 'jupiter', callisto: 'jupiter', titan: SAT, triton: 'neptune' }[k]]),
    freq: '自転 : 公転 = 1 : 1(主星に対する同期)', pq: Object.freeze([1, 1]), phase: '同じ面を主星へ(表側 = 主星を向く面 —— 原仮定者の方針(2026-11-07)の表側の定義)', strength: '応答の重み Γ/ΣΓ(第330便a の表 —— トルクの列は残す)',
    window: 'fixed(短い時間窓では観測の同期を固定 —— 捕獲の時間発展の段は作らない)', mechanism: '固体の潮汐の口(第329便a〜第330便a の診断の器 —— エンジン未接続)' })),
  Object.freeze({ body: 'venus', targetBody: Object.freeze(['sun', 'earth']), freq: '恒星の自転(逆行)・公転・太陽日・地球との会合周期(内合ごとの地球へ向く面の近い通約 —— 会合周期 ÷ 太陽日 ≈ 5)', pq: null,
    phase: '内合で地球へ向く面(表側 —— 原仮定者の方針(2026-11-07))', strength: 'ノブ(シミュレーションの時間では無視かノブ —— 原仮定者の決断(2026-11-09 —— AN588))', window: 'ignore(短い時間窓では無視 —— 観測の自転を固定)',
    mechanism: '口なし(宣言だけ —— 地球への面の通約の値と、太陽の口の行〔第330便a〕)' }),
  Object.freeze({ body: MER, targetBody: Object.freeze(['sun']), freq: '自転 : 公転 = 3 : 2(1 : 1 ではない —— 原仮定者の決断(2026-11-09 —— AN589)「太陽だけにロックしていない」)', pq: Object.freeze([3, 2]),
    phase: '近日点で長軸を太陽へ(3:2 の位相 —— 宣言)', strength: 'ノブ(短い時間窓では無視かノブ)', window: 'ignore(短い時間窓では無視 —— 観測の自転を固定)', mechanism: '口なし(宣言だけ —— 3:2 の通約の値)' }),
]);

/* ───────── 入力 ───────── */
export function readInputs(root = ROOT) {
  const SCJ = JSON.parse(fs.readFileSync(path.join(root, SPINCLASS), 'utf8')), K1J = JSON.parse(fs.readFileSync(path.join(root, INPOSK1), 'utf8'));
  return { SCJ, K1J, spinclassVersion: SCJ.version, inposk1Version: K1J.version };
}
function bookOf(HP) { return clone(HP.allPresets().find((p) => p.id === BOOK_ID)); }
/** 写し(器の中 —— 内蔵ではない): 添字の天体・kernel と rdRule(null は鍵を外す)・spinDrag の宣言・受け手(添字の 2 番目)の距離の倍率 */
function copyOf(book, idx, kernel, rule, spin, f = 1) {
  const b = clone(book); b.id = BOOK_ID + '_w331a'; b.description = '器の写し(内蔵ではない —— 第331便a)';
  b.bodies = idx.map((i) => clone(book.bodies[i]));
  if (f !== 1) { const s0 = b.bodies[0], e = b.bodies[1]; for (const k of ['x', 'y', 'z']) e[k] = s0[k] + f * (e[k] - s0[k]); }
  const q = b.physics.relativeDrag.invSq; if (kernel) q.kernel = kernel; else delete q.kernel; if (rule) q.rdRule = rule; else delete q.rdRule;
  delete b.physics.relativeDrag.initMotion; delete b.orbitObs; delete b.obsCard;
  if (spin) b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: clone(PLAN.spinDecl) });
  return b;
}
/** 写しを受理して build し、読み口 inertialDragIsqState(perSource)と SI の状態を返す */
function engineOf(HP, book, idx, kernel, rule, spin, f = 1) {
  const v = HP.validatePreset(copyOf(book, idx, kernel, rule, spin, f));
  if (!v.ok) return { ok: false, errors: v.errors.slice(0, 3) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const se = v.preset.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M), n = S.n;
  const st = HP.inertialDragIsqState(S, { perSource: true });
  const bodies = Array.from({ length: n }, (_, i) => ({ x: [S.x[i] * uL, S.y[i] * uL, S.z[i] * uL], v: [S.vx[i] * uL / uT, S.vy[i] * uL / uT, S.vz[i] * uL / uT],
    omega: scl([S.sax[i], S.say[i], S.saz[i]], S.spin[i] / uT), axis: [S.sax[i], S.say[i], S.saz[i]], m: S.m[i] * uM, Robs: v.preset.bodies[i].radius * uL }));
  return { ok: true, st, bodies, uL, uT, uM, n, law: st.law };
}
/** エンジンの受け手 i の成分(並進の β の和と右辺 s_i の並進・回転の係数と回転の速度・軸の ω)—— SI */
function engineRow(eng, i) {
  const rr = eng.st.receivers.find((q) => q.i === i), n = eng.n, B = eng.bodies, uL = eng.uL, uT = eng.uT;
  let uTr = [0, 0, 0], uRot = [0, 0, 0]; const rotC = [];
  for (let j = 0; j < n; j++) {
    if (j === i) { rotC.push(null); continue; }
    uTr = add(uTr, scl(sub(B[j].v, B[i].v), rr.beta[j]));
    const RV = rr.rot ? [rr.rot[3 * j] * uL, rr.rot[3 * j + 1] * uL, rr.rot[3 * j + 2] * uL] : null;
    rotC.push(RV ? nrm(RV) : null);
    if (RV) uRot = add(uRot, crs(B[j].omega, RV));
  }
  return { beta: rr.beta.slice(), betaSum: rr.betaSum, uTr: nrm(uTr), uRot: rr.rot ? nrm(uRot) : null, rotCoef: rotC, omegaAx: rr.omega ? nrm(rr.omega) / uT : null, Rd: rr.Rd * uL };
}
/** 座標則の受け手 i(源は写しの他の全天体・自己の重みの型 key = 形|規則) */
function coordRow(eng, i, key, extra = {}) {
  const [shape, rule] = key.split('|'), B = eng.bodies, sd = L.selfDecl({ shape, rule, m: B[i].m, Robs: B[i].Robs });
  const src = B.map((b, j) => ({ id: 'b' + j, x: b.x, v: b.v, omega: b.omega, m: b.m })).filter((_, j) => j !== i);
  const q = L.coordTwist({ id: 'b' + i, x: B[i].x, v: B[i].v, omega: B[i].omega, selfW: sd.w }, src);
  const byId = Object.fromEntries(q.ports.map((p) => [p.id, p]));
  return { key, selfW: sd.w, selfR: sd.R, alpha: q.alpha, betaSum: 1 - q.alpha, beta: B.map((_, j) => (j === i ? null : byId['b' + j].beta)), rotCoef: B.map((_, j) => (j === i ? null : byId['b' + j].beta * byId['b' + j].r)),
    dTr: nrm(q.dTrans), dRot: nrm(q.dRot), slip: nrm(q.spin.slip), slipAlong: dot(q.spin.slip, B[i].axis), ...extra };
}
const slopesOf = (fs2, ys) => fs2.slice(1).map((f, k) => (ys[k + 1] > 0 && ys[k] > 0 ? Math.log(ys[k + 1] / ys[k]) / Math.log(f / fs2[k]) : null));

/* ───────── E 今のエンジンとの成分ごとの比べる表 ───────── */
export function partEngine(HP) {
  const book = bookOf(HP);
  // 2 体: 地球の距離 1・2・4・8 倍(エンジン K1 の規則・K2 の宣言の半径 —— 回転と軸を宣言)
  const duo = {};
  for (const [ek, kernel, rule] of [['k1Rule', 'k1', 'kappaM'], ['k2Radius', null, null]]) {
    const rows = PLAN.duoFactors.map((f) => { const e = engineOf(HP, book, PLAN.duo, kernel, rule, true, f); if (!e.ok) return { f, ok: false, errors: e.errors };
      const er = engineRow(e, 1); return { f, ok: true, beta: er.beta[0], rotCoef: er.rotCoef[0], omegaAx: er.omegaAx, coord: Object.fromEntries(PLAN.selfAll.map((k) => { const c = coordRow(e, 1, k); return [k, { beta: c.beta[0], rotCoef: c.rotCoef[0], spinCoef: c.beta[0] }]; })) }; });
    duo[ek] = { rows, slope: { beta: slopesOf(PLAN.duoFactors, rows.map((r) => r.beta)), rotCoef: slopesOf(PLAN.duoFactors, rows.map((r) => r.rotCoef)), omegaAx: slopesOf(PLAN.duoFactors, rows.map((r) => r.omegaAx)) } };
  }
  const k1rows = duo.k1Rule.rows;
  const coordSlope = Object.fromEntries(PLAN.selfAll.map((k) => [k, { beta: slopesOf(PLAN.duoFactors, k1rows.map((r) => r.coord[k].beta)), rotCoef: slopesOf(PLAN.duoFactors, k1rows.map((r) => r.coord[k].rotCoef)), spinCoef: slopesOf(PLAN.duoFactors, k1rows.map((r) => r.coord[k].spinCoef)) }]));
  // 3 体と 16 体: 受け手ごとの成分(エンジン K1・K2 と座標則の自己の重みの型)
  const many = (idx) => {
    const eK1 = engineOf(HP, book, idx, 'k1', 'kappaM', true), eK2 = engineOf(HP, book, idx, null, null, true);
    if (!eK1.ok || !eK2.ok) return { ok: false, errors: [].concat(eK1.errors || [], eK2.errors || []) };
    const rows = idx.map((bi, i) => { const k1 = engineRow(eK1, i), k2 = engineRow(eK2, i), co = Object.fromEntries(PLAN.selfAll.map((k) => [k, coordRow(eK1, i, k)]));
      const jMax = k1.beta.reduce((b, x, j) => (j !== i && (b < 0 || x > k1.beta[b]) ? j : b), -1);
      return { i, key: PLAN.keys[bi], k1, k2, coord: co, jMaxK1: jMax,
        ratio: Object.fromEntries(PLAN.selfAll.map((k) => [k, { betaOverK1: co[k].beta[jMax] / k1.beta[jMax], betaOverK2: co[k].beta[jMax] / k2.beta[jMax], rotOverK1: k1.rotCoef[jMax] ? co[k].rotCoef[jMax] / k1.rotCoef[jMax] : null,
          rotOverK2: k2.rotCoef[jMax] ? co[k].rotCoef[jMax] / k2.rotCoef[jMax] : null, dTrOverK1: k1.uTr > 0 ? co[k].dTr / k1.uTr : null, dRotOverK1: k1.uRot > 0 ? co[k].dRot / k1.uRot : null }])) }; });
    return { ok: true, n: idx.length, lawK1: eK1.law, lawK2: eK2.law, rows };
  };
  const trio = many(PLAN.trio.slice()), full = many(PLAN.keys.map((_, i) => i));
  return { duo, coordSlope, trio, full, reading: { coord: { translation: -2, rotation: -1, spin: -2 }, k1: { translation: -1, rotation: -2, axial: -3 }, k2: { translation: -2, rotation: -3, axial: -4 },
    note: '座標則の自転の滑りとエンジンの軸の ω は別の口(比べる列 —— 同じ量ではない)。エンジンの新則に回転の自転の口は無い(S.spin は引きずりで変わらない)' } };
}

/* ───────── A 在位の 7 本の大きさの目安 ───────── */
export function partApsis(HP, IN) {
  const book = bookOf(HP), SB = IN.SCJ.inputs.bodies, sun = SB.sun, GM = 6.6743e-11 * sun.m;
  const OmSun = scl(sun.a, sun.sObs);
  const rows = PLAN.planets.map((k) => {
    const bi = PLAN.keys.indexOf(k), e = engineOf(HP, book, [0, bi], 'k1', 'kappaM', false), b = SB[k], ob = b.orbit;
    if (!e.ok) return { key: k, ok: false, errors: e.errors };
    const er = engineRow(e, 1), r0 = nrm(sub(e.bodies[1].x, e.bodies[0].x)), b1 = er.beta[0] * r0;
    const perCentury = CENTURY * ob.nLit / (2 * Math.PI), toAs = (dw) => dw * perCentury / ARCSEC;
    const k1Est = toAs(L.apsidalFirstOrder({ GM, a: ob.sma, e: ob.ecc, kind: 'translation', coef: b1, k: 1 }));
    const DG = IN.K1J.K.systems[k] ? IN.K1J.K.systems[k].DG : null;
    // 軌道の法線の向きの太陽の自転(本の二体の向き —— 第330便a の正本の nHat は惑星の行に無いので惑星の軸と公転の傾きから: 公転の法線 ≈ 公転の向きの宣言)
    const nHat = orbitNormal(e), OmSunAlongN = dot(OmSun, nHat);
    const coord = Object.fromEntries(PLAN.selfAll.map((key) => {
      const [shape, rule] = key.split('|'), sd = L.selfDecl({ shape, rule, m: b.m, Robs: b.R }), b2 = sun.m / sd.w, betaA = (sun.m / (ob.sma * ob.sma)) / (sd.w + sun.m / (ob.sma * ob.sma));
      const tr = toAs(L.apsidalFirstOrder({ GM, a: ob.sma, e: ob.ecc, kind: 'translation', coef: b2, k: 2 })), rot = toAs(L.apsidalFirstOrder({ GM, a: ob.sma, e: ob.ecc, kind: 'rotation', coef: b2 * OmSunAlongN, k: 2 }));
      const slip = betaA * (dot(OmSun, b.a) - b.sObs);
      return [key, { selfW: sd.w, selfR: sd.R, betaAtA: betaA, translationAsPerCentury: tr, rotationAsPerCentury: rot, overDG: DG ? (tr + rot) / DG : null, spinSlip: slip, spinSlipOverSpin: slip / b.sObs }];
    }));
    return { key: k, ok: true, r0, betaK1: er.beta[0], b1, sma: ob.sma, ecc: ob.ecc, DG, k1Est, k1EstOverDG: DG ? k1Est / DG : null, OmSunAlongN, spinObs: b.sObs, coord };
  });
  return { rows, GM, note: '一次の目安(Gauss の式で 1 周に積む —— 摂動の加速度 F = du/dt)・在位の本は spinDrag を宣言しない(エンジンの回転の項 0)・座標則の回転の分は太陽の自転(公転の法線の向き)× β(r) の接線の速さ' };
}
function orbitNormal(e) { const r = sub(e.bodies[1].x, e.bodies[0].x), v = sub(e.bodies[1].v, e.bodies[0].v), h = crs(r, v); return scl(h, 1 / nrm(h)); }

/* ───────── R 回転の自転の口と潮汐の口(AN587)───────── */
function tideOrigin(IN, key, src) {
  const T = PLAN.tideRow, row = IN.SCJ.classTable.rows.find((q) => q.key === key && q.form === T.form && q.tau === T.tau && q.proj === T.proj);
  const o = row ? row.origins.find((q) => q.key === 'solid:' + src) : null;
  return o ? { Gamma: o.Gamma, nuAlong: o.nuAlong, torqueAlong: o.torqueAlong, heat: o.heat } : null;
}
export function partRotTide(HP, IN) {
  const book = bookOf(HP), SB = IN.SCJ.inputs.bodies, tau = IN.SCJ.inputs.tauAge, fOf = IN.SCJ.inputs.fOf;
  const e16 = engineOf(HP, book, PLAN.keys.map((_, i) => i), 'k1', 'kappaM', false);
  // 回転の口の目標(座標則の自転の目標 —— 観測の自転と軸〔第330便a の正本〕・質量と位置は 🗺️ の写し)
  const spinOf = (k, srcKeys, key) => {
    const [shape, rule] = key.split('|'), b = SB[k], i = PLAN.keys.indexOf(k), sd = L.selfDecl({ shape, rule, m: b.m, Robs: b.R });
    const sources = srcKeys.map((s) => { const j = PLAN.keys.indexOf(s); return { weight: W.pointWeight(SB[s].m, nrm(sub(e16.bodies[i].x, e16.bodies[j].x)), 2), omega: scl(SB[s].a, SB[s].sObs) }; });
    const t = W.spinTarget(scl(b.a, b.sObs), sd.w, sources);
    return { targetAlong: dot(t.target, b.a), slipAlong: dot(t.slip, b.a), betaSum: 1 - t.alpha };
  };
  // 4 条件(主の 2 組 —— 回転の口は主星だけを源にした目標・潮汐の口は第330便a の正本の行〔主星の固体の潮汐〕・どちらも受け手の軸の向き)
  const four = [];
  for (const [rk, pk] of PLAN.fourPairs) for (const key of PLAN.selfMain) for (const form of PLAN.gammaRotForms) {
    const b = SB[rk], sp = spinOf(rk, [pk], key), td = tideOrigin(IN, rk, pk), Grot = fOf[form][rk] * b.I / tau, Om = scl(b.a, b.sObs);
    const fc = L.fourConditions({ rot: { interactionId: rk + '|' + pk, channel: 'inertialRotation', recv: rk, src: pk, nu: scl(b.a, sp.targetAlong), Gamma: Grot },
      tide: { interactionId: rk + '|' + pk, channel: 'gravTide', recv: rk, src: pk, nu: scl(b.a, td.nuAlong), Gamma: td.Gamma }, Omega: Om });
    const c = fc.conditions, ax = (v) => dot(v, b.a);
    four.push({ recv: rk, src: pk, self: key, gammaRotForm: form, GammaRot: Grot, GammaTide: td.Gamma, slipRot: sp.slipAlong, slipTide: td.nuAlong - b.sObs,
      torque: Object.fromEntries(L.DECL.conditions.map((k) => [k, ax(c[k].torque)])), heat: Object.fromEntries(L.DECL.conditions.map((k) => [k, c[k].heat])), heatByBoth: c.both.heatBy,
      torqueAddRel: fc.torqueAddRel, heatAddRel: fc.heatAddRel, ledgerMaxRel: fc.ledgerMaxRel, zeroAll: fc.zeroAll, mergedOverSeparate: fc.mergedOverSeparate,
      tideTorque330a: td.torqueAlong, rotOverTideTorque: ax(c.tideOnly.torque) !== 0 ? ax(c.rotOnly.torque) / ax(c.tideOnly.torque) : null });
  }
  // 登録の重複の拒否(同じ interactionId と channel の二度の登録 —— 器の実データで)
  let dupRejected = false; try { L.registerPorts([{ interactionId: 'moon|earth', channel: 'gravTide', recv: 'moon', src: 'earth', nu: [0, 0, 1], Gamma: 1 }, { interactionId: 'moon|earth', channel: 'gravTide', recv: 'moon', src: 'earth', nu: [0, 0, 1], Gamma: 1 }]); } catch (e) { dupRejected = e instanceof RangeError; }
  // 回転の口の大きさの表(全部の他の天体を源 —— 自己の重みの型 × Γ_rot の型)
  const table = PLAN.rotPortBodies.map((k) => {
    const b = SB[k], others = PLAN.keys.filter((s) => s !== k), pk = IN.SCJ.decl.primary[k], td = tideOrigin(IN, k, pk);
    const cols = Object.fromEntries(PLAN.selfAll.map((key) => { const sp = spinOf(k, others, key), sp1 = spinOf(k, [pk], key);
      return [key, { slipAlong: sp.slipAlong, slipPrimaryOnly: sp1.slipAlong, betaSum: sp.betaSum, torque: Object.fromEntries(PLAN.gammaRotForms.map((f) => [f, fOf[f][k] * b.I / tau * sp.slipAlong])) }]; }));
    return { key: k, primary: pk, spinObs: b.sObs, tideSlip: td ? td.nuAlong - b.sObs : null, tideTorque: td ? td.torqueAlong : null, cols };
  });
  return { four, dupRejected, table, tauS: tau, note: '回転の口の Γ_rot = f I/τ_0(f は第330便a の受け手の演算の型・τ_0 = 年齢)—— 目標は座標則の自転の目標(源の Ω そのもの)・潮汐の口は第330便a の正本の固体の潮汐の行(受け手の軸の向き)' };
}

/* ───────── H 内部熱の 3 欄 ───────── */
export function partHeat(IN) {
  const t = L.heatThreeColumns(IN.SCJ.heat.rows);
  const main = t.rows.filter((q) => q.form === 'ballMean' && q.tau === 'age' && q.variant === 'base');
  return Object.assign(t, { main, venusVariants: t.rows.filter((q) => q.key === 'venus' && q.form === 'ballMean' && q.tau === 'age'),
    note: '閉じた = 宣言した範囲で収支が閉じた(恒等式の帳簿)・定常 = 観測の自転で合トルクの相対 ≤ 宣言・観測の熱流との比の分母は第330便a の入力値(文献の値)' });
}

/* ───────── K lockTargets ───────── */
export function partLock(IN) {
  const SB = IN.SCJ.inputs.bodies, P = (s) => 2 * Math.PI / s / DAY;
  const rows = LOCK_TARGETS.map((d) => {
    // 自転の向きは公転の向きに対して数える(公転の法線が自転の軸と逆向き〔トリトンの逆行の公転〕なら自転の符号を返す —— 第330便a の kObs と同じ向きの約束)
    const b = SB[d.body], ob = b.orbit, sg = ob.nHatDotA >= 0 ? 1 : -1, spinDays = P(b.sObs) * sg, orbitDays = P(ob.nLit), ref = d.body === 'venus' ? P(SB.earth.orbit.nLit) : null;
    const cm = Object.assign(L.lockCommensurability({ spinDays, orbitDays, refOrbitDays: ref, pq: d.pq }), { orbitSignAlongAxis: sg });
    const w = (form) => { const r = IN.SCJ.classTable.rows.find((q) => q.key === d.body && q.form === form && q.tau === 'age' && q.proj === 'book'); return r ? { tideWeight: r.tideWeight, axialWeight: r.axialWeight, verdictWeight: r.verdictWeight, expected: r.expected, matchWeight: r.matchWeight, verdictTorque: r.verdictTorque } : null; };
    return { body: d.body, targetBody: d.targetBody, comm: cm, weight: { ballMean: w('ballMean'), inertiaShare: w('inertiaShare') }, classMatch: w('ballMean') ? w('ballMean').matchWeight : null, mechanism: d.mechanism, window: d.window };
  });
  const vt = IN.SCJ.venusSigns.rows.filter((q) => q.tau === 'age' && q.proj === 'book').map((q) => ({ form: q.form, thermal: q.thermal, N0: q.N0, gal: q.gal, sunK1: q.sunK1, sunSolid: q.sunSolid, sunThermal: q.sunThermal, net: q.net, opposite: q.opposite, balanceRel: q.balanceRel }));
  return { decl: LOCK_TARGETS, rows, venusThermal: vt, note: '分類が一致したか(第330便a の重みの判定)と機構が実装されたか(口の有無)は別の欄。金星・水星は宣言と通約の値(短い時間窓では観測の自転を固定)' };
}

/* ───────── M 地球と火星の比べる列 ───────── */
export function partEarthMars(HP, IN) {
  const book = bookOf(HP), SB = IN.SCJ.inputs.bodies, e16 = engineOf(HP, book, PLAN.keys.map((_, i) => i), 'k1', 'kappaM', false);
  const R0 = PLAN.galR0Kpc * PLAN.kpcM, Meq = (PLAN.galOmega * R0) ** 2 * R0 / 6.6743e-11, wG = W.pointWeight(Meq, R0, 2), g = IN.SCJ.inputs.g, A = IN.SCJ.inputs.Asun;
  const galOm = { A: scl(g, A), OmegaGal: scl(g, PLAN.galOmega) };
  const rowOf = (k, key, gal) => {
    const [shape, rule] = key.split('|'), b = SB[k], i = PLAN.keys.indexOf(k), sd = L.selfDecl({ shape, rule, m: b.m, Robs: b.R }), Om = scl(b.a, b.sObs);
    const groups = { sun: ['sun'], moon: k === 'earth' ? ['moon'] : [], others: PLAN.keys.filter((s) => s !== k && s !== 'sun' && !(k === 'earth' && s === 'moon')) };
    const src = PLAN.keys.filter((s) => s !== k).map((s) => ({ s, weight: W.pointWeight(SB[s].m, nrm(sub(e16.bodies[i].x, e16.bodies[PLAN.keys.indexOf(s)].x)), 2), omega: scl(SB[s].a, SB[s].sObs) }));
    const all = src.concat(gal ? [{ s: 'gal', weight: wG, omega: galOm[gal] }] : []);
    const t = W.spinTarget(Om, sd.w, all.map((q) => ({ weight: q.weight, omega: q.omega })));
    const part = (names) => all.filter((q) => names.includes(q.s)).reduce((s, q) => s + q.weight / t.W * dot(sub(q.omega, Om), b.a), 0);
    const cS = L.coordTwist({ id: k, x: e16.bodies[i].x, v: e16.bodies[i].v, omega: Om, selfW: sd.w }, src.map((q) => { const j = PLAN.keys.indexOf(q.s); return { id: q.s, x: e16.bodies[j].x, v: e16.bodies[j].v, omega: q.omega, m: SB[q.s].m }; }));
    return { key: k, self: key, gal, spinObs: b.sObs, targetAlong: dot(t.target, b.a), slipAlong: dot(t.slip, b.a), slipOverSpin: dot(t.slip, b.a) / b.sObs, betaSum: 1 - t.alpha,
      bySource: { sun: part(groups.sun), moon: part(groups.moon), others: part(groups.others), gal: gal ? part(['gal']) : 0 }, dTr: nrm(cS.dTrans), dRot: nrm(cS.dRot) };
  };
  const rows = [];
  for (const key of PLAN.selfAll) for (const gal of ['A', 'OmegaGal']) { const E2 = rowOf('earth', key, gal), M2 = rowOf('mars', key, gal);
    rows.push({ self: key, gal, earth: E2, mars: M2, slipRatio: E2.slipAlong !== 0 ? M2.slipAlong / E2.slipAlong : null, targetRatio: E2.targetAlong !== 0 ? M2.targetAlong / E2.targetAlong : null, obsRatio: M2.spinObs / E2.spinObs }); }
  return { rows, MeqKg: Meq, wGal: wG, galOmega: galOm, source: PLAN.galSource, note: '対照の列(合わせない —— 1 つの A への当てはめは繰り返さない・新しい定数を作らない)。銀河は自転の目標だけに入れる(並進の基準の銀河中心の速度は宣言しない)' };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const E = J.engine, A = J.apsis, R = J.rotTide, H = J.heat, K = J.lock, M = J.earthMars;
  const ok = (a, want) => a.every((x) => x !== null && Math.abs(x - want) <= PLAN.slopeTol);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    engineSlopes: ['k1Rule', 'k2Radius'].every((k) => E.duo[k].rows.every((r) => r.ok === true)) && ok(E.duo.k1Rule.slope.beta, -1) && ok(E.duo.k1Rule.slope.rotCoef, -2) && ok(E.duo.k1Rule.slope.omegaAx, -3)
      && ok(E.duo.k2Radius.slope.beta, -2) && ok(E.duo.k2Radius.slope.rotCoef, -3) && ok(E.duo.k2Radius.slope.omegaAx, -4),
    coordSlopes: PLAN.selfAll.every((k) => ok(E.coordSlope[k].beta, -2) && ok(E.coordSlope[k].rotCoef, -1) && ok(E.coordSlope[k].spinCoef, -2)),
    manyBodies: E.trio.ok === true && E.full.ok === true && E.full.rows.length === PLAN.keys.length && E.full.rows.every((r) => PLAN.selfAll.every((k) => Number.isFinite(r.coord[k].betaSum) && r.coord[k].betaSum < 1)),
    apsisK1Residual: A.rows.every((r) => r.ok === true && r.DG !== null && Math.abs(r.k1EstOverDG - 1) <= PLAN.apsisK1Tol),
    apsisCoordFinite: A.rows.every((r) => PLAN.selfAll.every((k) => Number.isFinite(r.coord[k].translationAsPerCentury) && Number.isFinite(r.coord[k].rotationAsPerCentury) && r.coord[k].betaAtA < 1)),
    fourConditions: R.four.length === PLAN.fourPairs.length * PLAN.selfMain.length * PLAN.gammaRotForms.length && R.four.every((q) => q.torqueAddRel <= 1e-12 && q.heatAddRel <= 1e-12 && q.ledgerMaxRel <= 1e-12 && q.zeroAll === true) && R.dupRejected === true,
    heatColumns: H.n === J.inputs.heatRows && H.nClosed === H.n && H.nSteady < H.n,
    lockDeclared: K.decl.length === 9 && K.rows.every((r) => r.comm && Number.isFinite(r.comm.spinOverOrbitRate)) && K.rows.find((r) => r.body === 'venus').comm.nearestInteger === 5 && Math.abs(K.rows.find((r) => r.body === MER).comm.pqDev) < 1e-3,
    venusThermalCols: ['ballMean', 'inertiaShare'].every((f) => ['none', 'lo', 'hi'].every((t) => K.venusThermal.some((q) => q.form === f && q.thermal === t))),
    earthMarsRows: M.rows.length === PLAN.selfAll.length * 2 && M.rows.every((r) => Number.isFinite(r.earth.slipAlong) && Number.isFinite(r.mars.slipAlong)),
  };
}
export function runAll(HP, root = ROOT) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const lockTargetsDecl = LOCK_TARGETS;   // 宣言は走行の前(正本の先頭に書く)
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const IN = readInputs(root); mark('inputs');
  const engine = partEngine(HP); mark('engine');
  const apsis = partApsis(HP, IN); mark('apsis');
  const rotTide = partRotTide(HP, IN); mark('rotTide');
  const heat = partHeat(IN); mark('heat');
  const lock = partLock(IN); mark('lock');
  const earthMars = partEarthMars(HP, IN); mark('earthMars');
  const J = { lockTargetsDecl, inputs: { spinclassVersion: IN.spinclassVersion, inposk1Version: IN.inposk1Version, heatRows: IN.SCJ.heat.rows.length, tauAge: IN.SCJ.inputs.tauAge, Asun: IN.SCJ.inputs.Asun },
    pure, engine, apsis, rotTide, heat, lock, earthMars, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W331A_TARGET || 'beta/index.html';
  const OUT = process.env.W331A_OUT ? (path.isAbsolute(process.env.W331A_OUT) ? process.env.W331A_OUT : path.join(ROOT, process.env.W331A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第331便a coordtwist(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, lockTargetsDecl: R.lockTargetsDecl, libVersion: L.LIB_VERSION, w330bLibVersion: W.LIB_VERSION, generator: 'tests/exp-w331a-coordtwist.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の決断(2026-11-09 —— AN586)「並進引きずりと回転引きずりは一緒に処理しても構わない座標変換であり、m/r² の重み付けをする。先に検証を行う」・原仮定者の決断(2026-11-09 —— AN587)「慣性由来の引きずりは重力由来の潮汐力と別ルート」・原仮定者の決断(2026-11-09 —— AN588・AN589)「金星は太陽と地球の両方にロック・水星は太陽だけにロックしていない・シミュレーションの時間スケールでは無視かノブ」・原仮定者の決断(2026-11-09 —— AN590)「地球と火星は合成後の引きずりの影響が近い —— 比較の対象」・原仮定者の回答(2026-11-09 —— AN591)・原仮定者の整理(2026-11-09)・統括の検証項目 R310',
    decl: L.DECL, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w331a-coordtwist.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs',
    'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第331便a', target: TARGET, code: CODE, inputs: [TARGET, SPINCLASS, INPOSK1] }), {
    harnessVersion: HARNESS_VERSION, stage: 'coordtwist', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ の写しの受理と読み口(步を進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

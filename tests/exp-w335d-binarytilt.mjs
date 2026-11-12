// 第335便d(原仮定者の補足(2026-11-12)「自転軸の傾きで引きずりの効果が大きく変わるので、連星での自転軸の傾きの組み合わせは、ノブになる」
//   「互いに潮汐ロックしている連星は、『距離の変化による並進引きずり』以外の、相互の引きずりが消える。ただし、遠方宇宙に対する慣性移動は消えないので、互いに周回する」・
//   原仮定者の回答(2026-11-12 —— AN660・AN661・AN662・AN663・AN664・AN650)・統括の検証項目 R331):
//   **連星の器 —— 同期の型(円・相互同期/離心・瞬間の同期/離心・平均の同期)と一周の平均の永年の効き・残差の族 G1〜G3 の判定(近点の通過の角が主・窓の平均は補助)・
//   自転軸の傾きの組み合わせの格子(同じ軸の組の 1 行に複数の量)・重心の自己加速と周期**(段 binarytilt-335d —— 正本 tests/out/binarytilt-w335d.json・lib tests/lib-w335d-binarytilt.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・前の便の lib の本文は変えない。physics の鍵を足さない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、連星と冥王星–カロンの在位の本 11 本の宣言の値を .find で引いて読む —— 本の JSON は 1 bit も変えない・
//   步は進めない・説明文の欄は値として読まない。本の値の読み方は第334便d の器の sysOfBook を呼ぶ)。他の正本は読まない。1 プロセス。
//
// ■ 何をするか
//   S 同期の型の閉じた式との照合(e 6 × 位相 8 × 質量比 4 × 受け手 2 × 自己の重み 3)・Q 一周の平均の永年の効き(求積 —— 動径・接線〔ḟ の分〕・接線〔Ω の分〕)・
//   K 同期の型の同時発展(引きずりだけ・今の型)と本の系の位置・L 残差の族(設計の系に当て、検証の系で判定)・T 傾きの組み合わせ・C 重心と周期・B 刻みの感度
// ■ 言わないこと: 連星の観測と比べた結果ではない・同期の型の 0 は座標変換の部分の条件付きの恒等式・一次の式は入れた式・族の有無は宣言した物差しの判定・傾きの格子はフィットしない
//   (量ごとに別の軸を選ばない)・回転引きずり(空間の捩れ)を連星の軌道へ当てる列は作らない・J 案の s_d を座標変換の角速度に入れない・文献の値は一次資料に当たっていない(未照合)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { sysOfBook } from './exp-w334d-binarylaw.mjs';
import { firstShare } from './lib-w334d-binarylaw.mjs';
import * as L from './lib-w335d-binarytilt.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限そのもの。器が引く本は連星と冥王星–カロンの 11 本〔宣言の値を .find で引いて読む〕。
//   roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt・HP.validatePreset は import した tests/lib-w280b-emgrid.mjs の綴りが数えられた分 —— この器と lib の局所の変数には使わない。
//   エンジンは読まない〔core:false —— 步を進めない・写しを作らない〕・ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["alphaCenABInertial3d","alphaCenABInertial3dJ","binaryCheckEqualInertial3d","binaryCheckRatio3Inertial3d","plutoCharonDiagInput","plutoCharonInertialFit","psrB1534","psrDoubleABInertial3d","psrJ1757DFM","psrJ1946DFM","siriusABInertial3d"],"roots":["HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":false,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w335d-binarytilt-1';
export const OUT_MAIN = 'tests/out/binarytilt-w335d.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const D2R = Math.PI / 180;
export const NOT_CLAIM = Object.freeze(['連星の観測と比べた結果ではない(無次元の格子と本の η・e・ε の点 —— 宣言した型の表・条件付きの恒等式・残差・候補)',
  '同期の型の 0 は座標変換の部分の条件付きの恒等式(空間の捩れとしての回転引きずり・受け手の有限の大きさの回転の応答まで同期だけで 0 とは言わない)',
  '一次の式(入れた式)を同時発展の表から作った相関と呼ばない —— 自分で入れた式を発見と呼ばない', '残差の族の有無は走行の前に宣言した族と物差しの判定(観測に合うように後から選ばない)',
  '傾きの組み合わせはフィットしない(格子の表 —— 1 つの軸の組の 1 行に複数の量・量ごとに別の自由な軸を選ばない)', '回転引きずり(T1 —— 空間の捩れ)を連星の軌道へ当てる列は作らない',
  'J 案の引きずり自転 s_d を座標変換の角速度に入れない(座標変換の基準は観測自転 s)', 'パルサーには回転の分をそのまま当てない(一次外挿が壊れる印を付ける)',
  '冥王星–カロンの在位の本は引きずり OFF のケプラーの基線(新しい引きずりが合った証拠に数えない)', '文献の値は本便は一次資料に当たっていない(未照合)']);
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 本(宣言の値を読む —— bodies[0]・bodies[1] の二体)。役割: verify(検証の系)・reading(位置づけだけ)・design(第334便d の設計の系の本 —— 本便は族の当てはめに使わず位置だけ) */
  books: Object.freeze([
    Object.freeze({ id: 'binaryCheckEqualInertial3d', role: 'design', ja: '♊ 検証サンプル 等質量' }),
    Object.freeze({ id: 'binaryCheckRatio3Inertial3d', role: 'design', ja: '⚖️ 検証サンプル 1:3' }),
    Object.freeze({ id: 'alphaCenABInertial3d', role: 'verify', ja: '🔶 α Cen AB' }),
    Object.freeze({ id: 'alphaCenABInertial3dJ', role: 'spin', ja: '🔸 α Cen AB(観測自転の宣言)' }),
    Object.freeze({ id: 'siriusABInertial3d', role: 'verify', ja: 'Sirius AB(3D 慣性)' }),
    Object.freeze({ id: 'psrDoubleABInertial3d', role: 'verify', ja: '📟 PSR J0737−3039A/B' }),
    Object.freeze({ id: 'psrJ1757DFM', role: 'verify', ja: '🧮 PSR J1757−1854' }),
    Object.freeze({ id: 'psrJ1946DFM', role: 'verify', ja: '🩺 PSR J1946+2052' }),
    Object.freeze({ id: 'psrB1534', role: 'verify', ja: '📿 PSR B1534+12' }),
    Object.freeze({ id: 'plutoCharonInertialFit', role: 'reading', ja: '🟪 冥王星–カロン(引きずり OFF の基線)' }),
    Object.freeze({ id: 'plutoCharonDiagInput', role: 'reading', ja: '🥶 冥王星–カロン(入力の整合の診断)' })]),
  /** 文献の値(未照合 —— 外のサイトに届かない) */
  lit: Object.freeze({
    plutoCharonE: Object.freeze({ value: 2e-4, src: '冥王星–カロンの相互の軌道の離心率は 2e-4 の桁(文献の値・未照合 —— 在位の本の状態は円に近い e ≈ 0 で、位置づけは両方で書く)' }),
  }),
  /** 本の系の位置の表の位相の点の数(瞬間の同期と平均の同期の残る d の最大を位相で読む) */
  posPhases: 720,
  /** 刻みの感度の部分集合(h/2 —— 宣言) */
  band: Object.freeze([
    Object.freeze({ id: 'now-e0.1', type: 'recv2K1', eta: 0.0974, e: 0.1, eps: 1e-6 }), Object.freeze({ id: 'now-e0.6', type: 'recv2K1', eta: 0.0974, e: 0.6, eps: 1e-6 }),
    Object.freeze({ id: 'instant-e0.4', mode: 'instant', eta: 0.0974, e: 0.4, eps: 1e-6 }), Object.freeze({ id: 'tilt-60-90-ortho-100', tilt: Object.freeze([60, 90, 'ortho', 100]) })]),
  /** QA の作り直しの部分集合(behavior —— 正本の行を作り直して照らす) */
  behaviorSubset: Object.freeze({ law: Object.freeze([['recv2K1', 0.0974, 0.3, 1e-6], ['sym4K1', 0.25, 0.6, 1e-5]]), tilt: Object.freeze([[60, 90, 'ortho', 100], [120, 0, 'same', 10]]), lock: Object.freeze([['instant', 0.4, 1e-6], ['mean', 0.2, 1e-6]]) }),
});

/* ───────── 入力(本の宣言 —— 二体の η・e・ε・自転)───────── */
export function readBooks(HP) {
  // 名指しの 11 本を `.find` で直に引く(変数に受けると領域の下限が「内蔵の全本」になる)
  const out = {};
  out.binaryCheckEqualInertial3d = clone(HP.allPresets().find((q) => q.id === 'binaryCheckEqualInertial3d'));
  out.binaryCheckRatio3Inertial3d = clone(HP.allPresets().find((q) => q.id === 'binaryCheckRatio3Inertial3d'));
  out.alphaCenABInertial3d = clone(HP.allPresets().find((q) => q.id === 'alphaCenABInertial3d'));
  out.alphaCenABInertial3dJ = clone(HP.allPresets().find((q) => q.id === 'alphaCenABInertial3dJ'));
  out.siriusABInertial3d = clone(HP.allPresets().find((q) => q.id === 'siriusABInertial3d'));
  out.psrDoubleABInertial3d = clone(HP.allPresets().find((q) => q.id === 'psrDoubleABInertial3d'));
  out.psrJ1757DFM = clone(HP.allPresets().find((q) => q.id === 'psrJ1757DFM'));
  out.psrJ1946DFM = clone(HP.allPresets().find((q) => q.id === 'psrJ1946DFM'));
  out.psrB1534 = clone(HP.allPresets().find((q) => q.id === 'psrB1534'));
  out.plutoCharonInertialFit = clone(HP.allPresets().find((q) => q.id === 'plutoCharonInertialFit'));
  out.plutoCharonDiagInput = clone(HP.allPresets().find((q) => q.id === 'plutoCharonDiagInput'));
  for (const s of PLAN.books) if (!out[s.id]) throw new Error('readBooks: 本が無い ' + s.id);
  return Object.fromEntries(PLAN.books.map((s) => [s.id, sysOfBook(out[s.id])]));
}

/* ───────── S 同期の型 ───────── */
export function partSync() {
  const T = L.syncTypeTable();
  return { n: T.rows.length, maxErr: T.maxErr, summary: T.summary,
    note: '無次元(G = 1・M = 1・a = 1・n = 1)・大きさは公転の速さ n a で割った相対。閉じた式 −β ṙ・β r(Ω − ḟ)(β = 1/(1 + W_ii/w) —— 自己の重みの比から独立に)。瞬間の同期は第334便d の syncCase の非同期に ḟ(位相)/n' };
}

/* ───────── Q 一周の平均の永年の効き(求積)───────── */
export function partSecular() { return L.secularTable(); }

/* ───────── K 同期の型の同時発展 ───────── */
const spinOfMode = (mode) => (mode === 'mean' ? { kind: 'fixed', s: [[0, 0, 1], [0, 0, 1]] } : mode === 'instant' ? { kind: 'instant' } : null);
export function lockRow(mode, e, eps, g, cache, opt = {}) {
  const K = L.DECL.lock, R = L.runPair(Object.assign({ eta: K.eta, e, eps, g, k1: true, spin: spinOfMode(mode) }, opt), cache);
  return { mode, e, eps, g: g ? g.pair + g.n : null, sharePass: R.sharePass, shareWin: R.shareWin, dPanom: R.dPanom, dPoverP: R.dPoverP, de: R.de, tiltRate: R.tiltRate, eSlopeRel: R.ledger.eSlopeRel, lSlopeRel: R.ledger.lSlopeRel };
}
export function partLock(SQ) {
  const K = L.DECL.lock, cache = new Map(), rows = [];
  for (const mode of K.modes) for (const e of K.e) {
    for (const eps of K.eps) rows.push(lockRow(mode, e, eps, null, cache));
    rows.push(lockRow(mode, e, K.eps[0], K.gNow, cache));
  }
  // 一次の分担(求積)との照らし(引きずりだけ・ε = 1e-6)
  for (const r of rows) {
    const q = SQ.rows.find((x) => x.e === r.e), f = r.mode === 'k1' ? q.k1.share : r.mode === 'instant' ? q.instant.share : q.mean.share;
    r.firstDrag = f; r.first = r.g ? L.firstShareLock(K.gNow, r.mode, K.eta, q.tangOmega.share) : f;
    r.dShare = r.sharePass - r.first;
  }
  return { rows };
}
/** 本の系の位置(瞬間の同期と平均の同期の残る d の最大・永年の近点の率・周期への効き)—— 相対の d(β 和 10ε/r)の位相の最大 */
export function partPositions(BK, SQ) {
  const N = PLAN.posPhases, out = [];
  const pos = (id, ja, e, eps, src) => {
    let mr = 0, mt = 0;
    for (let j = 0; j < N; j++) { const ph = 2 * Math.PI * j / N, p = 1 - e * e, h = Math.sqrt(p), r = p / (1 + e * Math.cos(ph)), rdot = e * Math.sin(ph) / h, fdot = h / (r * r);
      mr = Math.max(mr, Math.abs(10 * eps * rdot / r)); mt = Math.max(mt, Math.abs(10 * eps * (1 - fdot))); }
    const q1 = 6 * Math.PI * eps / (1 - e * e);
    return { id, ja, e, eps, src, maxDrInstant: mr, maxDtMean: mt, apsInstant: L.DECL.secular.radialShare * q1, apsK1: L.DECL.secular.k1Share * q1 };
  };
  for (const s of PLAN.books) { const y = BK[s.id]; out.push(pos(s.id, s.ja, y.e, y.eps, '本の状態')); }
  const pc = BK.plutoCharonInertialFit;
  out.push(pos('plutoCharonLit', '🟪 冥王星–カロン(文献の e —— 未照合)', PLAN.lit.plutoCharonE.value, pc.eps, '文献の値・未照合'));
  return { rows: out, note: '瞬間の同期は動径の −(10ε/r) ṙ だけが残る・平均の同期は接線の 10ε(n − ḟ) も残る(公転の速さ n a の単位)。永年の近点の率は一次(求積の分担 × q_1PN)' };
}

/* ───────── L 残差の族 ───────── */
export function lawRow(t, eta, e, eps, cache, opt = {}) {
  const T = L.typeOf(t), R = L.runPair(Object.assign({ eta, e, eps, g: T.g, k1: T.k1 }, opt), cache), rho1 = firstShare(T.g, T.k1, eta) - 1;
  return { type: t, eta, e, eps, rhoPass: R.rhoPass, rhoWin: R.rhoWin, rho1, deltaPass: R.rhoPass - rho1, deltaWin: R.rhoWin - rho1, dPanom: R.dPanom, dPoverP: R.dPoverP, de: R.de, tiltRate: R.tiltRate,
    vcm: R.ledger.vcmFinal, cm: R.ledger.cmFinal, nOrb: R.nOrb, vcmFirst: L.cmKickPerOrbit({ pair: T.g.pair, n: T.g.n, eta, e, eps }) * R.nOrb, eSlopeRel: R.ledger.eSlopeRel, lSlopeRel: R.ledger.lSlopeRel };
}
export function partLaw(BK) {
  const LW = L.DECL.law, cache = new Map(), design = [], verify = [];
  for (const t of LW.types) for (const eta of LW.design.eta) for (const e of LW.design.e) for (const eps of LW.design.eps) design.push(lawRow(t.key, eta, e, eps, cache));
  const vsys = LW.verifyBooks.map((id) => ({ id, eta: BK[id].eta, e: BK[id].e, epsBook: BK[id].eps })).filter((y) => y.e >= LW.eMin).map((y) => Object.assign(y, { eps: Math.max(y.epsBook, LW.epsFloor) }))
    .concat(LW.verifyGrid.map((g) => Object.assign({ epsBook: g.eps }, g)));
  for (const t of LW.types) for (const y of vsys) verify.push(Object.assign(lawRow(t.key, y.eta, y.e, y.eps, cache), { id: y.id, epsBook: y.epsBook }));
  const combos = LW.types.map((t) => {
    const dRows = design.filter((r) => r.type === t.key), vRows = verify.filter((r) => r.type === t.key);
    const famRes = (def) => {
      const pts = dRows.map((r) => ({ eta: r.eta, e: r.e, eps: r.eps, delta: def === 'pass' ? r.deltaPass : r.deltaWin }));
      const vpts = vRows.map((r) => ({ id: r.id, eta: r.eta, e: r.e, eps: r.eps, delta: def === 'pass' ? r.deltaPass : r.deltaWin }));
      const fams = LW.families.map((f) => { const fit = L.fitLawBestK(f, pts), J = L.judgeLaw(fit, vpts), Jd = L.judgeLaw(fit, pts.map((p, i) => Object.assign({ id: 'd' + i }, p)));
        return { key: f.key, k: fit.k, coef: fit.coef, maxResOverEps: fit.maxResOverEps, law: J.law, maxRatio: J.maxRatio, designMaxRatio: Jd.maxRatio, verify: J.rows.map((q) => ({ id: q.id, pred: q.pred, num: q.num, ratio: q.ratio, inside: q.inside })) }; });
      const lawFam = fams.find((f) => f.law);
      return { fams, lawKey: lawFam ? lawFam.key : null };
    };
    // ε に比例(設計の系の η・e ごとに δ の ε = 1e-6 → 1e-4 の log の傾き)と ε の部分集合ごとの G2 の係数(k は全体の選択のまま)
    const prop = [];
    for (const eta of LW.design.eta) for (const e of LW.design.e) { const a = dRows.find((r) => r.eta === eta && r.e === e && r.eps === 1e-6), b = dRows.find((r) => r.eta === eta && r.e === e && r.eps === 1e-4);
      prop.push({ eta, e, slope: Math.log(Math.abs(b.deltaPass) / Math.abs(a.deltaPass)) / Math.log(100), sameSign: Math.sign(a.deltaPass) === Math.sign(b.deltaPass) }); }
    const pass = famRes('pass'), win = famRes('win'), g2 = pass.fams[1];
    const perEps = LW.design.eps.map((eps) => { const f = L.fitLaw(LW.families[1], g2.k, dRows.filter((r) => r.eps === eps).map((r) => ({ eta: r.eta, e: r.e, eps: r.eps, delta: r.deltaPass }))); return { eps, coef: f.coef }; });
    return { type: t.key, pass, win, prop, propOk: prop.every((q) => q.sameSign && Math.abs(q.slope - 1) <= LW.epsPropTol), propRange: [Math.min(...prop.map((q) => q.slope)), Math.max(...prop.map((q) => q.slope))], perEps };
  });
  return { design, verify, combos, verifyIds: [...new Set(vsys.map((y) => y.id))], skipped: LW.verifyBooks.filter((id) => BK[id].e < LW.eMin), floored: vsys.filter((y) => y.epsBook < LW.epsFloor).map((y) => y.id) };
}

/* ───────── T 傾きの組み合わせ ───────── */
export function tiltRow(theta, phi, rel, mag, cache, opt = {}) {
  const T = L.DECL.tilt, G = L.typeOf(T.gType), sp = L.tiltPair(theta, phi, rel, mag);
  const R = L.runPair(Object.assign({ eta: T.eta, e: T.e, eps: T.eps, g: G.g, k1: G.k1, spin: { kind: 'fixed', s: sp } }, opt), cache);
  return { theta, phi, rel, spin: mag, rho: R.rhoPass, rhoWin: R.rhoWin, dPanom: R.dPanom, dPoverP: R.dPoverP, tiltRate: R.tiltRate, tiltRateOverQ1: R.tiltRate / R.q1, de: R.de, vcm: R.ledger.vcmFinal,
    eSlopeRel: R.ledger.eSlopeRel, lSlopeRel: R.ledger.lSlopeRel };
}
export function partTilt() {
  const T = L.DECL.tilt, G = L.typeOf(T.gType), cache = new Map(), rows = [];
  const B = L.runPair({ eta: T.eta, e: T.e, eps: T.eps, g: G.g, k1: G.k1 }, cache);
  const base = { rho: B.rhoPass, rhoWin: B.rhoWin, dPanom: B.dPanom, dPoverP: B.dPoverP, tiltRate: B.tiltRate, rho1: firstShare(G.g, G.k1, T.eta) - 1 };
  const { massesOfEta } = L, { m1, m2 } = massesOfEta(T.eta);
  for (const mag of T.spins) for (const a of L.tiltAxes1()) for (const rel of T.rel) {
    const r = tiltRow(a.theta, a.phi, rel, mag, cache);
    r.dRho = r.rho - base.rho; r.dPdiff = r.dPanom - base.dPanom; r.rotRatio = 10 * T.eps * Math.max(m1, m2) * mag;
    rows.push(r);
  }
  // 一次外挿が壊れる印(同じ軸の組の 10 n と 100 n)
  for (const r of rows.filter((q) => q.spin === 100)) {
    const r10 = rows.find((q) => q.spin === 10 && q.theta === r.theta && q.phi === r.phi && q.rel === r.rel), ratio = r10.dRho !== 0 ? r.dRho / (10 * r10.dRho) : null;
    r.linRatio = ratio; r.linBreak = ratio === null || !Number.isFinite(ratio) || Math.abs(ratio - 1) > T.linBreakTol || r.rotRatio > T.linearMax;
  }
  // 読み (a): ρ を小さくする組・0 にする組(宣言した物差し)
  const thr = base.rho - T.reduceFrac * base.rho1, reduce = rows.filter((q) => q.rho <= thr), zero = rows.filter((q) => q.rho <= 0);
  const best = rows.reduce((a, q) => (q.rho < a.rho ? q : a), rows[0]);
  // (c) 全体を同じだけ回す(面と両方の軸を一緒に)
  const Rt = L.rotAbout(T.covAxis, T.covAngleDeg * D2R), cov = [];
  for (const [th, ph, rel, mag] of [[60, 90, 'ortho', 100], [120, 0, 'same', 10], [30, 270, 'opposite', 1]]) {
    const a = rows.find((q) => q.theta === th && q.phi === ph && q.rel === rel && q.spin === mag), b = tiltRow(th, ph, rel, mag, cache, { plane: Rt });
    const rl = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);
    cov.push({ theta: th, phi: ph, rel, spin: mag, rho: rl(a.rho, b.rho), dPanom: rl(a.dPanom, b.dPanom), tiltRate: rl(a.tiltRate, b.tiltRate), de: Math.abs(a.de - b.de) });
  }
  const covMax = Math.max(...cov.map((q) => Math.max(q.rho, q.dPanom, q.tiltRate)));
  return { base, rows, reading: { threshold: thr, nReduce: reduce.length, nZero: zero.length, best: { theta: best.theta, phi: best.phi, rel: best.rel, spin: best.spin, rho: best.rho, dPdiff: best.dPdiff, tiltRateOverQ1: best.tiltRateOverQ1, de: best.de },
    perSpin: T.spins.map((s) => { const rr = rows.filter((q) => q.spin === s); return { spin: s, minRho: Math.min(...rr.map((q) => q.rho)), maxRho: Math.max(...rr.map((q) => q.rho)), nReduce: rr.filter((q) => q.rho <= thr).length, nZero: rr.filter((q) => q.rho <= 0).length,
      maxTiltOverQ1: Math.max(...rr.map((q) => q.tiltRateOverQ1)), maxAbsDP: Math.max(...rr.map((q) => Math.abs(q.dPdiff))), nLinBreak: s === 100 ? rr.filter((q) => q.linBreak).length : null }; }) }, cov, covMax };
}

/* ───────── C 重心と周期 ───────── */
export function partCm(LW) {
  const C = L.DECL.cm, rows = [];
  for (const t of C.types) for (const eta of C.eta) for (const e of C.e) for (const eps of C.eps) {
    const r = LW.design.find((q) => q.type === t && q.eta === eta && q.e === e && q.eps === eps);
    rows.push({ type: t, eta, e, eps, vcmPerOrbit: r.vcm / r.nOrb, firstPerOrbit: r.vcmFirst / r.nOrb, ratio: r.vcmFirst > 0 ? r.vcm / r.vcmFirst : null, cm: r.cm, dPanom: r.dPanom, dPoverP: r.dPoverP,
      pdotOverN: (r.vcm / r.nOrb) * Math.sqrt(eps) / (2 * Math.PI) });
  }
  return { rows, rule: C.pdotRule, note: '(Ṗ/P)_cm ÷ n の上限(視線の成分 ≤ 1)—— 観測の値との比べは次の便(宣言だけ)' };
}

/* ───────── B 刻みの感度 ───────── */
export function partBand() {
  const cache = new Map(), out = [];
  for (const b of PLAN.band) {
    let r1, r2;
    if (b.type) { r1 = lawRow(b.type, b.eta, b.e, b.eps, cache); r2 = lawRow(b.type, b.eta, b.e, b.eps, cache, { stepsPerOrbit: 2 * L.DECL.run.stepsPerOrbit }); out.push({ id: b.id, d: Math.abs(r1.rhoPass - r2.rhoPass), dWin: Math.abs(r1.rhoWin - r2.rhoWin), dP: Math.abs(r1.dPanom - r2.dPanom) }); }
    else if (b.mode) { r1 = lockRow(b.mode, b.e, b.eps, null, cache); r2 = lockRow(b.mode, b.e, b.eps, null, cache, { stepsPerOrbit: 2 * L.DECL.run.stepsPerOrbit }); out.push({ id: b.id, d: Math.abs(r1.sharePass - r2.sharePass), dWin: Math.abs(r1.shareWin - r2.shareWin), dP: Math.abs(r1.dPanom - r2.dPanom) }); }
    else { const [th, ph, rel, mag] = b.tilt; r1 = tiltRow(th, ph, rel, mag, cache); r2 = tiltRow(th, ph, rel, mag, cache, { stepsPerOrbit: 2 * L.DECL.run.stepsPerOrbit }); out.push({ id: b.id, d: Math.abs(r1.rho - r2.rho), dWin: Math.abs(r1.rhoWin - r2.rhoWin), dP: Math.abs(r1.dPanom - r2.dPanom) }); }
  }
  return { rows: out, max: Math.max(...out.map((q) => Math.max(q.d, q.dWin))) };
}

/* ───────── 系の表 ───────── */
export function partSystems(BK) {
  return PLAN.books.map((s) => { const y = BK[s.id]; return { id: s.id, ja: s.ja, role: s.role, eta: y.eta, e: y.e, eps: y.eps, q: y.q, spins: y.spins.map((x) => ({ overN: x.overN, src: x.src })), rotRatio: y.rotRatio,
    linear: y.rotRatio.every((x) => x <= L.DECL.tilt.linearMax), apsDefined: y.e >= L.DECL.law.eMin, floored: y.eps < L.DECL.law.epsFloor }; });
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const LW = L.DECL.law, K = L.DECL.lock, T = L.DECL.tilt, D = L.DECL.sync;
  const nSync = D.nPhase * D.massRatios.length * D.receivers.length * D.selfRatios.length * (1 + 2 * D.e.length);
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    sync: J.sync.n === nSync && J.sync.maxErr <= D.tol && J.sync.summary.filter((q) => q.type === 'instant').every((q) => q.maxDt <= D.tol) && J.sync.summary.filter((q) => q.e === 0).every((q) => q.maxDr <= D.tol && q.maxDt <= D.tol),
    secular: J.secular.rows.every((q) => Math.abs(q.radial.share - L.DECL.secular.radialShare) <= L.DECL.secular.tol && Math.abs(q.tangF.share - L.DECL.secular.tangFShare) <= L.DECL.secular.tol && Number.isFinite(q.tangOmega.share)),
    lock: J.lock.rows.length === K.modes.length * K.e.length * (K.eps.length + 1) && J.lock.rows.filter((r) => r.g === null && r.eps === K.eps[0]).every((r) => Math.abs(r.dShare) <= K.shareTol),
    law: J.law.design.length === LW.types.length * LW.design.eta.length * LW.design.e.length * LW.design.eps.length && J.law.design.every((r) => Number.isFinite(r.deltaPass) && Number.isFinite(r.deltaWin))
      && J.law.combos.length === LW.types.length && J.law.verifyIds.length >= 6,
    tilt: J.tilt.rows.length === L.tiltAxes1().length * T.rel.length * T.spins.length && J.tilt.rows.every((q) => Number.isFinite(q.rho) && Number.isFinite(q.tiltRate)) && J.tilt.covMax <= 1e-7,
    cm: J.cm.rows.filter((q) => q.type.startsWith('recv') && q.eps <= 1e-6).every((q) => Math.abs(q.ratio - 1) <= L.DECL.cm.tol) && J.cm.rows.filter((q) => q.type.startsWith('sym')).every((q) => q.cm <= 1e-10),
    band: J.band.max <= L.DECL.band.tol,
    positions: J.positions.rows.length === PLAN.books.length + 1 && J.positions.rows.every((q) => Number.isFinite(q.maxDrInstant)),
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { gates: L.pureGates(PS), quad: PS.quad }; mark('pure');
  const BK = readBooks(HP); mark('books');
  const systems = partSystems(BK); mark('systems');
  const sync = partSync(); mark('sync');
  const secular = partSecular(); mark('secular');
  const lock = partLock(secular); mark('lock');
  const positions = partPositions(BK, secular); mark('positions');
  const law = partLaw(BK); mark('law');
  const tilt = partTilt(); mark('tilt');
  const cm = partCm(law); mark('cm');
  const band = partBand(); mark('band');
  const J = { pure, systems, sync, secular, lock, positions, law, tilt, cm, band, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W335D_TARGET || 'beta/index.html';
  const OUT = process.env.W335D_OUT ? (path.isAbsolute(process.env.W335D_OUT) ? process.env.W335D_OUT : path.join(ROOT, process.env.W335D_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第335便d binarytilt(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w335d-binarytilt.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の補足(2026-11-12)「自転軸の傾きで引きずりの効果が大きく変わるので、連星での自転軸の傾きの組み合わせは、ノブになる」「互いに潮汐ロックしている連星は、『距離の変化による並進引きずり』以外の、相互の引きずりが消える。ただし、遠方宇宙に対する慣性移動は消えないので、互いに周回する」・原仮定者の回答(2026-11-12 —— AN660 = A・AN661・AN662 = A・AN663 = A・AN664 = A・AN650 = A)・統括の検証項目 R331',
    decl: L.DECL, plan: PLAN, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w335d-binarytilt.mjs', 'tests/lib-w335d-binarytilt.mjs', 'tests/exp-w334d-binarylaw.mjs', 'tests/lib-w334d-binarylaw.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w331c-k1scale.mjs',
    'tests/lib-w332a-eqband.mjs', 'tests/lib-w330b-dragweight.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第335便d', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'binarytilt', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・連星と冥王星–カロンの本 11 本の宣言の値を読む(步を進めない)・純関数(lib —— 求積と二体の同時発展の RK4)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

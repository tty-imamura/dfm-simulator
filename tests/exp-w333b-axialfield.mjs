// 第333便b(原仮定者の整理(2026-11-10)「軸引きずりは、回転を統合した並進引きずりに対する、手前と奥の差分とする。源の回転でも発生するが、源が横を通り抜けても発生する」・
//   「回転を統合した並進引きずりは、背景宇宙に対する回転により、順方向の公転に対しては遠心力を下げる。逆方向の公転に対しては遠心力を上げる」・「引きずりの重みは、m/r^2 が有力だが、
//   他の次数でも検証を行う」・原仮定者の回答(2026-11-10 —— AN604・AN606・AN607・AN621)・統括の検証項目 R318):
//   **軸引きずりの新しい定義(統合した並進の場の受け手の手前と奥の差分)の太陽系の表・今のエンジンの軸の口との比べ・遠心の要求の順行と逆行・重みの次数と単位の器**
//   (段 axialfield-333b —— 正本 tests/out/axialfield-w333b.json・lib tests/lib-w333b-axialfield.mjs)。**診断だけ** —— エンジン・内蔵の本・受理器・第329〜332便の lib の本文は変えない。
//
// Node だけ(html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、🗺️ solarSystem16Inertial3d の**写し**〔器の中 —— 本の JSON は 1 bit も変えない〕を受理器と
//   読み口 inertialDragIsqState に通す —— 步は進めない)。💍 saturnRingReal は環の帯の半径の宣言だけを読む。1 プロセス。
//
// ■ 何をするか
//   P 純関数の場面(lib —— 一様・剛体・せん断・解析の勾配・自転 0 の源の横の通過・源だけの正規化・共通の回転座標・源ごとの分け方・源の自転の閉じた式・有限の受け手・次数と単位・
//     第332便b の平面の場との照らし・遠心の順行と逆行・近日点の状態・拒否)
//   F 太陽系の ω_field の表(16 体の本の写しの build 直後の状態 —— SI): 配置 3(本の時刻・金星の内合〔金星を太陽の周りに黄道の法線で回して地球の黄経へ —— 作った配置〕・水星の近日点〔二体の要素から
//     —— 作った配置〕)× 次数 α 4 × 自己の重み 3(none = 場の枠・kappaM = R_d = Y_k m・robs = 観測半径)× W₀ = 0 × r_ref = 1 au で、各天体の位置の ω_field を源ごとに 3 つの部
//     (源の自転の直接・源の自転のモーメントの勾配・並進の通過)へ分け、観測自転 s の向きへ射影(+ は観測の自転と同じ向き)
//   E 今のエンジンの軸の口(写しに spinDrag {rot surfaceFlip・axial on・axialModel bevel・axialGain 1} を宣言して読み口 inertialDragIsqState の perSource —— 変えない):
//     K1 の規則(在位の宣言 —— kernel k1・rdRule kappaM)と K2 の宣言の半径(kernel・rdRule を外す)× 配置 3 の源ごとの ω_ij を同じ向きへ射影し、新しい定義の部と並べる
//   R 有限の受け手(本の時刻・α = 2): 手前と奥(pair)・一様な球の剛体の成分(ballL)・球の体積平均の ½∇×U(ballCurl)と局所近似の相対の差(半径 = 観測半径・R_d)
//   C 遠心の要求の順行と逆行: 惑星 8・衛星 7(逆行のトリトンを含む)・土星の環の帯の半径 5(💍 の宣言 —— 土星の赤道面の試験点)。場の回転 Ω_f と半渦度の軸 ω_f は軌道の円の方位 24 点の平均
//     (主星の並進を引く・受け手と受け手の衛星は源から外す)。枠の型 × 自己の重み × α で x = Ω_f/Ω・剛体の枠の判定・半渦度の軸の判定・同じ半径の順行と逆行の対の要る公転の速さの差・x > 2 の一覧
//   U 次数と単位: 地球・海王星・イオで α 4 × r_ref(1 au・1 kpc)× W₀(0・3H₀c/(2G))の ω_field の変わり方(W₀ = 0 は r_ref に依らない・W₀ ≠ 0 は α ≠ 2 で依る)
// ■ 言わないこと: ω_field は局所の場の回転率で、トルクや発熱ではない(応答と帳簿は未接続)・新しい軸の差分を今の軸の口に重ねて足した値を「合計」と呼ばない(並べる)・
//   自転や共鳴や公転面の機構の同定に使わない・遠心の判定は宣言した枠の型と自己の重みの型の表の値(順行なら常に減るのではない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w333b-axialfield.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🗺️ solarSystem16Inertial3d〔写しの元 —— .find で引く〕と 💍 saturnRingReal
//   〔環の帯の半径の宣言だけ〕の 2 本。roots の T・ch・ctx・cw・HP.sim・HP.dfmMeshVelocityFieldAt は import した tests/lib-w280b-emgrid.mjs・tests/lib-w279b-headless.mjs の綴りが数えられた分 ——
//   この器と lib の局所の変数には使わない。エンジンを読む(core —— 写しの build と読み口)。ワンタップ対照 A/B は走らせない〔abBody:false〕・説明文の欄は読まない)
const REGEN_SCOPE = {"presets":["saturnRingReal","solarSystem16Inertial3d"],"roots":["HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","T","ch","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w333b-axialfield-1';
export const OUT_MAIN = 'tests/out/axialfield-w333b.json';
export const BOOK_ID = 'solarSystem16Inertial3d';
export const RING_BOOK_ID = 'saturnRingReal';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const relD = (a, b) => (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300));
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違えない書き方)
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const nrm = (a) => Math.hypot(a[0], a[1], a[2]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => scl(a, 1 / nrm(a));
export const NOT_CLAIM = Object.freeze(['ω_field は局所の場の回転率(トルク・発熱ではない —— 受け手の慣性の自転との差・応答の時間・軸の帳簿は未接続)',
  '新しい軸の差分と今のエンジンの軸の口は並べる(重ねて足した値を合計と呼ばない —— 式の形が違う)', '自転・共鳴・公転面の機構の同定に使わない(宣言した型の表の値と残差)',
  '遠心の判定は枠の型 × 自己の重みの型 × 次数の表の値(順行なら常に減るのではない —— 0 < Ω_f/Ω < 2 のときだけ減る)', 'r_ref は単位を揃える宣言の長さ(フィットの長さではない)・W₀ の 3H₀c/(2G) は次元が合うだけで導いた値ではない',
  '重力と時計の背景決定力 D₀ を引きずりの分母に使わない', '作った配置(金星の内合・水星の近日点)は暦表の時刻ではない']);
const AU = 1.495978707e11, KPC = 3.0856775814913673e19;
/** 器の宣言(走行の前に置く —— 結果を見て変えない) */
export const PLAN = Object.freeze({
  /** 16 体の本の添字の順(第331便a と同じ順)・主星(衛星 → 惑星・惑星 → 太陽) */
  keys: Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', 'europa', 'ganymede', 'callisto', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  primary: Object.freeze({ [MER]: 'sun', venus: 'sun', earth: 'sun', mars: 'sun', jupiter: 'sun', [SAT]: 'sun', uranus: 'sun', neptune: 'sun', moon: 'earth', io: 'jupiter', europa: 'jupiter', ganymede: 'jupiter', callisto: 'jupiter', titan: SAT, triton: 'neptune' }),
  /** 次数・自己の重み・W₀(主は 0)・r_ref(主は 1 au —— 単位を揃える宣言) */
  alphas: L.ALPHAS, selfRules: L.SELF_RULES, rRefMain: AU, rRefAlt: KPC,
  /** 比べる列の W₀ = 3H₀c/(2G)(H₀ = 70 km s⁻¹ Mpc⁻¹ —— 文献の値・次元が合うだけ) */
  H0: 70e3 / (1e6 * KPC),
  /** 配置(本の時刻・金星の内合・水星の近日点・全天体の自転 0〔本の時刻の位置と速度 —— 今の口が 0 になり通過の項だけが残る比べる配置〕) */
  geoms: Object.freeze(['epoch', 'venusConj', 'mercuryPeri', 'spin0']),
  /** 源ごとの表を残す列(α 1・2 × 自己 3) */
  perSourceAlphas: Object.freeze([1, 2]), perSourceKeep: '2|none',
  /** エンジンの写しの spinDrag(今の invSq の軸の口 —— 鏡映 × sinθ × 受け手の近遠の差分・A = 1)と変種(K1 の規則〔在位〕・K2 の宣言の半径) */
  spinDecl: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', axialGain: 1 }),
  engineVariants: Object.freeze([Object.freeze({ key: 'k1Rule', kernel: 'k1', rule: 'kappaM', pairAlpha: 1, pairSelf: 'kappaM' }), Object.freeze({ key: 'k2Radius', kernel: null, rule: null, pairAlpha: 2, pairSelf: 'robs' })]),
  /** 有限の受け手(本の時刻・α = 2)と求積の次数 */
  finiteAlpha: 2, quadOrder: L.DECL.quadOrder, finiteResolve: 1e-6, finiteBoundFactor: 10,
  /** 遠心: 方位の点の数・環の帯の半径は 💍 の宣言(rIn・rOut の重なりを除いた 5 つ —— 本の単位 → SI は本の scaleExp)・判定の枠の型 */
  ringK: 24, ringBandsFrom: RING_BOOK_ID,
  /** 次数と単位の部の受け手 */
  unitsBodies: Object.freeze(['earth', 'neptune', 'io']),
  /** 表に出す受け手(文書の表) */
  docBodies: Object.freeze([MER, 'venus', 'earth', 'moon', 'mars', 'jupiter', 'io', SAT, 'titan', 'uranus', 'neptune', 'triton']),
  /** 差動回転の宣言: 剛体の枠(ω_f = Ω_f —— 方位平均)を主・半渦度の軸(ω_f = ω_field の軌道の法線の成分 —— 方位平均 —— 場の渦度を含む)を比べる列・入れないもの: ひずみの残り・∂U/∂t・非円の軌道・場の動径の成分 */
  shearDecl: '剛体の枠(主)と半渦度の軸(場の渦度の半分 —— 第331便b の halfCurl の型と同じ量)。ひずみの残り・場の時間変化 ∂U/∂t・非円の軌道・場の動径の成分は入れない',
});

/* ───────── 入力(本の写し) ───────── */
function bookOf(HP, id) { return clone(HP.allPresets().find((p) => p.id === id)); }
/** 配置を本の単位で作る(写しの bodies を書き換える —— 本の JSON は変えない) */
function geomBodies(book, geom) {
  const B = clone(book.bodies), iS = 0, iV = PLAN.keys.indexOf('venus'), iE = PLAN.keys.indexOf('earth'), iM = PLAN.keys.indexOf(MER);
  const P = (b) => [b.x, b.y, b.z], V = (b) => [b.vx, b.vy, b.vz], set = (b, p, v) => { [b.x, b.y, b.z] = p; [b.vx, b.vy, b.vz] = v; };
  if (geom === 'venusConj') {
    const rV = sub(P(B[iV]), P(B[iS])), rE = sub(P(B[iE]), P(B[iS])), th = Math.atan2(rE[1], rE[0]) - Math.atan2(rV[1], rV[0]), k = [0, 0, 1];
    set(B[iV], add(P(B[iS]), L.rotateAbout(rV, k, th)), add(V(B[iS]), L.rotateAbout(sub(V(B[iV]), V(B[iS])), k, th)));
    return { bodies: B, note: { rotateDeg: th * 180 / Math.PI } };
  }
  if (geom === 'mercuryPeri') {
    const mu = book.physics.G * (B[iS].m + B[iM].m), q = L.periapsisState(sub(P(B[iM]), P(B[iS])), sub(V(B[iM]), V(B[iS])), mu);
    set(B[iM], add(P(B[iS]), q.r), add(V(B[iS]), q.v));
    return { bodies: B, note: { a: q.a, e: q.e } };
  }
  if (geom === 'spin0') { for (const b of B) b.spin = 0; return { bodies: B, note: { spinZero: B.length } }; }
  return { bodies: B, note: null };
}
/** 写し(器の中 —— 内蔵ではない): 配置・kernel と rdRule(null は鍵を外す)・spinDrag の宣言 */
function copyOf(book, geom, kernel, rule) {
  const b = clone(book), g = geomBodies(book, geom); b.id = BOOK_ID + '_w333b'; b.description = '器の写し(内蔵ではない —— 第333便b)'; b.bodies = g.bodies;
  const q = b.physics.relativeDrag.invSq; if (kernel) q.kernel = kernel; else delete q.kernel; if (rule) q.rdRule = rule; else delete q.rdRule;
  delete b.physics.relativeDrag.initMotion; delete b.orbitObs; delete b.obsCard;
  b.physics.relativeDrag = Object.assign(clone(b.physics.relativeDrag), { spinDrag: clone(PLAN.spinDecl) });
  return { book: b, note: g.note };
}
/** 写しを受理して build し、読み口 inertialDragIsqState(perSource)と SI の状態を返す */
function engineOf(HP, book, geom, kernel, rule) {
  const c = copyOf(book, geom, kernel, rule), v = HP.validatePreset(c.book);
  if (!v.ok) return { ok: false, errors: v.errors.slice(0, 3) };
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  const se = v.preset.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M), n = S.n;
  const st = HP.inertialDragIsqState(S, { perSource: true });
  const bodies = Array.from({ length: n }, (_, i) => {
    const ax = [S.sax[i], S.say[i], S.saz[i]], sv = scl(ax, S.spin[i] / uT);
    return { key: PLAN.keys[i], p: [S.x[i] * uL, S.y[i] * uL, S.z[i] * uL], v: [S.vx[i] * uL / uT, S.vy[i] * uL / uT, S.vz[i] * uL / uT], s: sv, sObs: nrm(sv), sHat: nrm(sv) > 0 ? unit(sv) : ax,
      m: S.m[i] * uM, Robs: v.preset.bodies[i].radius * uL };
  });
  return { ok: true, st, bodies, uL, uT, uM, n, law: st.law, note: c.note, overlap: st.overlap };
}

/* ───────── F 太陽系の ω_field ───────── */
const proj = (w, b) => dot(w, b.sHat);
/** 受け手 i の局所の場(源 = 他の全天体 —— 受け手の中心に対する相対の座標で評価) */
function fieldAt(bodies, i, alpha, rRef, self, W0 = 0, offset = [0, 0, 0], parts = false, exclude = null) {
  const b = bodies[i], sw = L.selfWeightOf({ rule: self, m: b.m, Robs: b.Robs, alpha, rRef });
  const src = bodies.filter((_, j) => j !== i && !(exclude && exclude.has(j))).map((q) => ({ p: sub(q.p, b.p), v: q.v, s: q.s, m: q.m }));
  return L.integratedField({ at: offset, sources: src, alpha, rRef, selfW: sw.w, W0, parts });
}
function partField(eng) {
  const B = eng.bodies, cols = {}, perSource = {};
  for (const a of PLAN.alphas) for (const self of PLAN.selfRules) {
    const key = a + '|' + self, rows = [], ps = [];
    for (let i = 0; i < B.length; i++) {
      const F = fieldAt(B, i, a, PLAN.rRefMain, self, 0, [0, 0, 0], true), b = B[i];
      const srcIdx = B.map((_, j) => j).filter((j) => j !== i);
      let sD = [0, 0, 0], sG = [0, 0, 0], pS = [0, 0, 0];
      const per = F.parts.map((q, k) => { const d = L.localSpin(q.spinDirect).omega, g = L.localSpin(q.spinGrad).omega, p = L.localSpin(q.trans).omega; sD = add(sD, d); sG = add(sG, g); pS = add(pS, p);
        return { j: srcIdx[k], key: PLAN.keys[srcIdx[k]], spinDirect: proj(d, b), spinGrad: proj(g, b), trans: proj(p, b), transMag: nrm(p) }; });
      const sn = Math.sqrt(F.strain.flat().reduce((t, x) => t + x * x, 0));
      rows.push({ key: b.key, omega: F.omega, par: proj(F.omega, b), mag: nrm(F.omega), parOverS: b.sObs > 0 ? proj(F.omega, b) / b.sObs : null, strain: sn, shareSrc: F.shares.src, shareSelf: F.shares.self,
        parts: { spinDirect: proj(sD, b), spinGrad: proj(sG, b), trans: proj(pS, b), spinMag: nrm(add(sD, sG)), transMag: nrm(pS) }, partsSumRel: nrm(sub(add(add(sD, sG), pS), F.omega)) / Math.max(nrm(F.omega), 1e-300) });
      if (PLAN.perSourceAlphas.includes(a)) ps.push(per);
    }
    cols[key] = rows; if (PLAN.perSourceAlphas.includes(a)) perSource[key] = ps;
  }
  return { bodies: B.map((b) => ({ key: b.key, m: b.m, Robs: b.Robs, Rd: L.selfWeightOf({ rule: 'kappaM', m: b.m, alpha: 2, rRef: 1 }).R, sObs: b.sObs, sHat: b.sHat })), cols, perSource };
}

/* ───────── E 今のエンジンの軸の口 ───────── */
function partEngine(eng) {
  const B = eng.bodies, n = eng.n, rows = [];
  for (let i = 0; i < n; i++) {
    const rr = eng.st.receivers.find((q) => q.i === i);
    if (!rr || !rr.omegaSrc) { rows.push(null); continue; }
    const per = [];
    let tot = [0, 0, 0];
    for (let j = 0; j < n; j++) { if (j === i) continue; const w = scl([rr.omegaSrc[4 * j], rr.omegaSrc[4 * j + 1], rr.omegaSrc[4 * j + 2]], 1 / eng.uT); tot = add(tot, w); per.push({ j, key: PLAN.keys[j], par: proj(w, B[i]), mag: nrm(w) }); }
    rows.push({ key: B[i].key, Rd: rr.Rd * eng.uL, betaSum: rr.betaSum, par: proj(tot, B[i]), mag: nrm(tot), parOverS: B[i].sObs > 0 ? proj(tot, B[i]) / B[i].sObs : null, per });
  }
  return { law: eng.law, overlap: eng.overlap, negFrac: eng.st.negFrac, rows };
}
/** 新しい定義と今の口の源ごとの並べ(同じ受け手・同じ源・同じ向き —— 足さない) */
function compareRows(F, E, variant) {
  const key = variant.pairAlpha + '|' + variant.pairSelf, key2 = '2|' + variant.pairSelf, ps = F.perSource[key], ps2 = F.perSource[key2], out = [];
  E.rows.forEach((er, i) => {
    if (!er) return;
    const sp = ps[i], sp2 = ps2[i];
    const srcs = er.per.map((q) => { const a = sp.find((z) => z.j === q.j), b2 = sp2.find((z) => z.j === q.j);
      return { key: q.key, engine: q.par, newSpin: a.spinDirect + a.spinGrad, newTrans: a.trans, newSpinA2: b2.spinDirect + b2.spinGrad, newTransA2: b2.trans,
        sameSign: (q.par === 0 || a.spinDirect + a.spinGrad === 0) ? null : Math.sign(q.par) === Math.sign(a.spinDirect + a.spinGrad) }; });
    // 今の口が 0 の源(自転 0 の源)で新しい定義の並進(通過)の項が 0 でない数・今の口の符号と新しい定義の自転の部の符号の一致の数
    const nonSpin = srcs.filter((q) => q.engine === 0), signed = srcs.filter((q) => q.sameSign !== null);
    out.push({ key: er.key, pairCol: key, engineTot: er.par, newSpinTot: srcs.reduce((t, q) => t + q.newSpin, 0), newTransTot: srcs.reduce((t, q) => t + q.newTrans, 0),
      nEngineZero: nonSpin.length, nEngineZeroTransNonzero: nonSpin.filter((q) => q.newTrans !== 0).length, nSameSign: signed.filter((q) => q.sameSign).length, nSigned: signed.length, srcs });
  });
  return out;
}

/* ───────── R 有限の受け手 ───────── */
function partFinite(eng) {
  const B = eng.bodies, rows = [];
  for (let i = 0; i < B.length; i++) {
    const b = B[i], row = { key: b.key };
    for (const [self, Rkey] of [['none', 'Robs'], ['robs', 'Robs'], ['kappaM', 'Rd'], ['kappaM', 'Robs']]) {
      const R = Rkey === 'Robs' ? b.Robs : L.selfWeightOf({ rule: 'kappaM', m: b.m, alpha: 2, rRef: 1 }).R;
      const LF = fieldAt(B, i, PLAN.finiteAlpha, PLAN.rRefMain, self), loc = LF.omega, amp = Math.max(...LF.J.flat().map(Math.abs)) / Math.max(nrm(loc), 1e-300), fld = (p) => fieldAt(B, i, PLAN.finiteAlpha, PLAN.rRefMain, self, 0, p).U;
      const md = {}; for (const m of L.RECEIVER_MODES) { const w = L.finiteReceiver(fld, [0, 0, 0], R, m, PLAN.quadOrder).omega; md[m] = { rel: nrm(sub(w, loc)) / Math.max(nrm(loc), 1e-300), par: proj(w, b) }; }
      // 二次の差の目安 (R/r_min)² × max|J|/|ω|(r_min = 一番近い源・ω が J の打ち消しの残りのときの拡大)・分解能: R/r_min < 1e-6 は double で手前と奥の差を分けられない
      //   (局所近似を採る —— 数は記録だけ)
      const rMin = Math.min(...B.filter((_, j) => j !== i).map((q) => nrm(sub(q.p, b.p))));
      row[self + '@' + Rkey] = { R, rMin, amp, bound: (R / rMin) ** 2 * amp, resolvable: R / rMin >= PLAN.finiteResolve, local: proj(loc, b), localMag: nrm(loc), modes: md };
    }
    rows.push(row);
  }
  return rows;
}

/* ───────── C 遠心の順行と逆行 ───────── */
/** 円の方位平均の Ω_f と半渦度の軸 ω_f(中心 c・軌道の法線 nh・基準の向き e1・半径 R・主星の速度 vp)—— 源は除外の集合の外の全天体・自己の重みは受け手の宣言 */
function ringFrame(B, recv, c, nh, e1, R, vp, alpha, self, exclude) {
  const e2 = crs(nh, e1), K = PLAN.ringK, sw = recv ? L.selfWeightOf({ rule: self, m: recv.m, Robs: recv.Robs, alpha, rRef: PLAN.rRefMain }).w : 0;
  const src = B.filter((_, j) => !exclude.has(j));
  let Of = 0, wf = 0;
  for (let k = 0; k < K; k++) {
    const ph = 2 * Math.PI * (k + 0.5) / K, rh = add(scl(e1, Math.cos(ph)), scl(e2, Math.sin(ph))), at = add(c, scl(rh, R)), fh = crs(nh, rh);
    const F = L.integratedField({ at: [0, 0, 0], sources: src.map((q) => ({ p: sub(q.p, at), v: q.v, s: q.s, m: q.m })), alpha, rRef: PLAN.rRefMain, selfW: sw });
    Of += dot(sub(F.U, vp), fh) / R; wf += dot(F.omega, nh);
  }
  return { OmegaF: Of / K, omegaF: wf / K };
}
function partCentrifugal(eng, ringBook, Gsi) {
  const B = eng.bodies, out = { orbiters: [], rings: [] }, idx = (k) => PLAN.keys.indexOf(k);
  const sats = (k) => new Set(Object.entries(PLAN.primary).filter(([, p]) => p === k).map(([s]) => idx(s)));
  for (const [k, pk] of Object.entries(PLAN.primary)) {
    const i = idx(k), ip = idx(pk), b = B[i], P = B[ip], r = sub(b.p, P.p), vr = sub(b.v, P.v), R = nrm(r), nh = unit(crs(r, vr)), e1 = unit(r), Om = dot(vr, crs(nh, e1)) / R;
    const g = Gsi * (P.m + b.m) / (R * R), ex = new Set([i, ...sats(k)]), cols = {};
    for (const a of PLAN.alphas) for (const self of PLAN.selfRules) {
      const fr = ringFrame(B, b, P.p, nh, e1, R, P.v, a, self, ex), cp = L.centrifugalPair({ R, Omega: Om, OmegaF: fr.OmegaF, omegaF: fr.omegaF, g });
      cols[a + '|' + self] = { OmegaF: fr.OmegaF, omegaF: fr.omegaF, x: cp.pro.x, verdictPro: cp.pro.verdict, verdictRetro: cp.retro.verdict, verdictAxisPro: cp.pro.verdictAxis, verdictAxisRetro: cp.retro.verdictAxis,
        changeRelPro: cp.pro.changeRigid / (Om * Om * R), changeRelRetro: cp.retro.changeRigid / (Om * Om * R), dvRigid: cp.dvRigid, dvAxis: cp.dvAxis, vOrbit: Om * R };
    }
    // 観測の公転の向き: 主星の観測の自転の向きに対する公転の法線(トリトンは逆行)
    out.orbiters.push({ key: k, primary: pk, R, Omega: Om, g, retrogradeToPrimarySpin: dot(nh, P.sHat) < 0, cols });
  }
  // 土星の環(💍 の宣言の帯の半径 —— 土星の赤道面の試験点・場の枠だけ —— 試験点に質量と半径の宣言が無い)
  const iS = idx(SAT), S = B[iS], se = ringBook.scaleExp, uL = Math.pow(10, se.L), radii = [...new Set(ringBook.bodies.filter((q) => q.type === 'ring').flatMap((q) => [q.rIn, q.rOut]))].sort((x, y) => x - y).map((x) => x * uL);
  const nh = S.sHat, e1 = unit(crs(nh, Math.abs(nh[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), ex = new Set();   // 試験点には衛星が無い —— 土星とタイタンを含む全天体が源
  for (const R of radii) {
    const Om = Math.sqrt(Gsi * S.m / (R * R * R)), cols = {};
    for (const a of PLAN.alphas) {
      const fr = ringFrame(B, null, S.p, nh, e1, R, S.v, a, 'none', ex), cp = L.centrifugalPair({ R, Omega: Om, OmegaF: fr.OmegaF, omegaF: fr.omegaF });
      cols[a + '|none'] = { OmegaF: fr.OmegaF, omegaF: fr.omegaF, x: cp.pro.x, verdictPro: cp.pro.verdict, verdictRetro: cp.retro.verdict, verdictAxisPro: cp.pro.verdictAxis, verdictAxisRetro: cp.retro.verdictAxis,
        changeRelPro: cp.pro.changeRigid / (Om * Om * R), changeRelRetro: cp.retro.changeRigid / (Om * Om * R), dvRigid: cp.dvRigid, dvAxis: cp.dvAxis, vOrbit: Om * R };
    }
    out.rings.push({ R, Omega: Om, cols });
  }
  // x > 2 の一覧(順行で要求がまた増す列)
  out.overTwo = [];
  for (const o of out.orbiters) for (const [ck, c] of Object.entries(o.cols)) if (c.x > 2) out.overTwo.push({ key: o.key, col: ck, x: c.x });
  for (const o of out.rings) for (const [ck, c] of Object.entries(o.cols)) if (c.x > 2) out.overTwo.push({ key: 'ring@' + (o.R / 1e3).toFixed(0) + 'km', col: ck, x: c.x });
  return out;
}

/* ───────── U 次数と単位 ───────── */
function partUnits(eng) {
  const B = eng.bodies, W0c = L.cosmicW0(PLAN.H0), rows = [];
  for (const k of PLAN.unitsBodies) {
    const i = PLAN.keys.indexOf(k), b = B[i];
    for (const self of ['none', 'robs']) for (const a of PLAN.alphas) {
      const base = fieldAt(B, i, a, PLAN.rRefMain, self, 0), cell = (rr, w0) => { const F = fieldAt(B, i, a, rr, self, w0); return { par: proj(F.omega, b), shareBg: F.shares.bg, rel: nrm(sub(F.omega, base.omega)) / nrm(base.omega) }; };
      rows.push({ key: k, self, alpha: a, base: proj(base.omega, b), auW0: cell(PLAN.rRefMain, W0c), kpc0: cell(PLAN.rRefAlt, 0), kpcW0: cell(PLAN.rRefAlt, W0c) });
    }
  }
  return { W0: W0c, H0: PLAN.H0, rows };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const nCols = PLAN.alphas.length * PLAN.selfRules.length;
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    copiesAccepted: PLAN.geoms.every((g) => PLAN.engineVariants.every((v) => J.engine[g][v.key].ok === true && J.engine[g][v.key].overlap === null)),
    fieldComplete: PLAN.geoms.every((g) => Object.keys(J.field[g].cols).length === nCols && Object.values(J.field[g].cols).every((rows) => rows.length === 16 && rows.every((r) => fin(r.par) && fin(r.mag) && r.partsSumRel <= 1e-9))),
    engineComplete: PLAN.geoms.every((g) => PLAN.engineVariants.every((v) => J.engine[g][v.key].rows.filter(Boolean).length === 16 && J.compare[g][v.key].length === 16)),
    engineSpinOnly: PLAN.engineVariants.every((v) => J.compare.spin0[v.key].every((r) => r.engineTot === 0 && r.newSpinTot === 0 && r.newTransTot !== 0 && r.nEngineZeroTransNonzero === 15)),
    finiteNearLocal: J.finite.length === 16 && J.finite.every((r) => Object.values(r).filter((x) => x && x.modes).every((c) => Object.values(c.modes).every((m) => fin(m.rel) && (!c.resolvable || m.rel <= Math.max(PLAN.finiteBoundFactor * c.bound, 1e-9))))),
    centrifugalComplete: J.centrifugal.orbiters.length === 15 && J.centrifugal.rings.length === 5 && J.centrifugal.orbiters.every((o) => Object.keys(o.cols).length === nCols) && J.centrifugal.orbiters.find((o) => o.key === 'triton').retrogradeToPrimarySpin === true,
    unitsShape: J.units.rows.length === PLAN.unitsBodies.length * 2 * PLAN.alphas.length && J.units.rows.filter((r) => r.alpha === 2).every((r) => r.kpc0.rel <= 1e-12) && J.units.rows.every((r) => r.kpc0.rel <= 1e-12),
  };
}
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const PS = L.pureScenes(), pure = { scenes: PS, gates: L.pureGates(PS) }; mark('pure');
  const book = bookOf(HP, BOOK_ID), ringBook = bookOf(HP, RING_BOOK_ID), Gsi = book.physics.G * Math.pow(10, 3 * book.scaleExp.L - book.scaleExp.M - 2 * book.scaleExp.T);
  const engine = {}, field = {}, compare = {}, geomNote = {};
  for (const g of PLAN.geoms) {
    engine[g] = {}; compare[g] = {};
    let base = null;
    for (const v of PLAN.engineVariants) {
      const e = engineOf(HP, book, g, v.kernel, v.rule);
      if (!e.ok) { engine[g][v.key] = { ok: false, errors: e.errors, rows: [] }; continue; }
      if (!base) { base = e; geomNote[g] = e.note; }
      engine[g][v.key] = Object.assign({ ok: true }, partEngine(e));
    }
    field[g] = partField(base); mark('field.' + g);
    for (const v of PLAN.engineVariants) compare[g][v.key] = engine[g][v.key].ok ? compareRows(field[g], engine[g][v.key], v) : [];
    // 正本を軽く: 源ごとの表は場の枠(2|none)だけを残す(他の列は並べの表 compare に入った)・エンジンの源ごとの行は compare に入った
    field[g].perSource = { [PLAN.perSourceKeep]: field[g].perSource[PLAN.perSourceKeep] };
    for (const v of PLAN.engineVariants) if (engine[g][v.key].ok) engine[g][v.key].rows = engine[g][v.key].rows.map((r) => (r ? Object.assign({}, r, { per: undefined }) : r));
  }
  const eEpoch = engineOf(HP, book, 'epoch', 'k1', 'kappaM');
  const finite = partFinite(eEpoch); mark('finite');
  const centrifugal = partCentrifugal(eEpoch, ringBook, Gsi); mark('centrifugal');
  const units = partUnits(eEpoch); mark('units');
  const J = { inputs: { book: BOOK_ID, ringBook: RING_BOOK_ID, Gsi, rRefMain: PLAN.rRefMain, geomNote }, pure, field, engine, compare, finite, centrifugal, units, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W333B_TARGET || 'beta/index.html';
  const OUT = process.env.W333B_OUT ? (path.isAbsolute(process.env.W333B_OUT) ? process.env.W333B_OUT : path.join(ROOT, process.env.W333B_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第333便b axialfield(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w333b-axialfield.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の整理(2026-11-10)「軸引きずりは、回転を統合した並進引きずりに対する、手前と奥の差分とする。源の回転でも発生するが、源が横を通り抜けても発生する」「回転を統合した並進引きずりは、背景宇宙に対する回転により、順方向の公転に対しては遠心力を下げる。逆方向の公転に対しては遠心力を上げる」「引きずりの重みは、m/r^2 が有力だが、他の次数でも検証を行う」(作業仮説 —— 診断で検査)・統括の検証項目 R318',
    decl: L.DECL, plan: PLAN, alphas: L.ALPHAS, selfRules: L.SELF_RULES, receiverModes: L.RECEIVER_MODES, notClaim: NOT_CLAIM, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w333b-axialfield.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w332b-transgeo2.mjs', 'tests/lib-w331a-coordtwist.mjs', 'tests/lib-w331b-centrifugal.mjs', 'tests/lib-w330b-dragweight.mjs',
    'tests/lib-w326d-axialheat.mjs', 'tests/lib-w309a-invsq.mjs', 'tests/lib-w312a-decay.mjs', 'tests/lib-w310d-shell.mjs', 'tests/lib-w307a-sphereaxial.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第333便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'axialfield', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)・🗺️ solarSystem16Inertial3d の写し(受理器 → build → 読み口 inertialDragIsqState —— 步は進めない)・純関数(lib)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

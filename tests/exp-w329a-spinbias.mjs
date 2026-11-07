// 第329便a(原仮定者の方針(2026-11-07)「範囲を広げ過ぎず、その中での整合性を成立させる」「必要に応じてノブを用意し、物理的意味の深掘りはしない」「R_d は K1 で固定し、s_d などに
//   フィットの余地を見出す」「太陽–金星・木星–イオ(気体と固体)で共通する法則を探す・地球–月(固体同士)を対照に」・原仮定者の回答(2026-11-07 —— AN570・AN571・AN574・AN575)・
//   統括の検証項目 R304): **金星・イオ・月・水星の比べる表・受動の口の残差・s_d の作用箇所・表裏の偏りの 3 列(無偏り・N₂ だけ・N₁ を足す)・気体と固体の 2 組の式の形・
//   有効な滑り A の範囲・小さな位相の模型**(段 spinbias-329a —— 正本 tests/out/spinbias-w329a.json・lib tests/lib-w329a-spinbias.mjs)。
//   **診断だけ** —— エンジン・内蔵の本・受理器・beta/index.html は変えない。偏りの口は宣言したノブ(本の側へ入れない)。R_d は K1 のまま。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、第326便d の器の写し〔copyBook・stateOf〕と第327便e の器の読み口〔gradT〕を使う ——
//   K1 の核の式を写さない)。受動の口は第327便a の lib(族 E の solve・linearRows)と第327便f の lib(evaluateAll・solidPort・resonanceZ)をそのまま呼ぶ。入力は html だけ
//   (他の正本・データは読まない —— 文献の値は lib の DECL)。1 プロセス(子プロセスなし)。t = 0 の読み口と純関数だけ(本の步を進めない —— 位相の模型は lib の純関数の 1 自由度)。
//
// ■ 何をするか
//   I 入力: 太陽・水星・金星・地球・月・木星・イオの質量・半径・符号つきの自転・自転軸・R_d(規則 R_d = Y_k m の読み口)・接触の二体の軌道(本の J2000 の状態)・K1 の伝達(源 J と今)
//   T 4 組の共通の入力表(観測の k と像の k を別の列・N = |1 − k|・会合の周期・組の種類)
//   P 受動の口の残差(族 E・球の平均 p = 0): ① 潮汐の係数を天体ごとの非負の未知にした第327便a の型(Γ に依らない符号の判定)② 文献の k2/Q の固体の潮汐と τ_0 の 2 つの枝(無限・年齢)の
//     SI のトルク(観測の自転・ロックの自転・本の自転の 3 列)—— 由来ごとの熱 ≥ 0
//   S s_d の作用箇所: 受理器の読み口(源と受け手を 1 つずつ 0・0.5・1・2・−1 倍)・どの口の目標が動くか・残差を消す倍率(閉じた式)・源の慣性と倍率の積の縮退・受け手の核と表面の結合の口
//   B 偏りの 3 列(無偏り・N₂ だけ・N₁ を足す〔N₂ は文献の四重極の桁〕): 要る振幅(トルクの条件と幅の条件)・位相 γ*・復元の勾配・裏の井戸・熱 0・反作用の和 0・帳簿
//   F 気体と固体の 2 組(金星・イオ)の式の形(無次元の振幅の比 —— 3 つの尺度 × 2 つの条件 × τ_0 の 2 つの枝)と単純な関数の候補・月の対照・水星
//   A AN570 の限定の列: 金星・木星・イオ(と水星・地球・月)の閾値で有効な滑り A の範囲と太陽の式の A の整合(ランク 1 のまま —— g_T と Ω_field は分けない)
//   M AN575 の小さな位相の模型(金星 —— 観測の k と像の k = −1 から・h と h/2)
//   H 帳簿の最大の残差・P2 純関数の場面
// ■ 言わないこと: 偏りの振幅は「宣言したノブで表現できた(要る振幅)」の記録 —— 金星の逆転・表の面の同定・共通の法則の発見ではない。捕獲や起源を確定したとは書かない。
//   内部熱の説明ではない。負の Γ を要する解は不採用(0 に丸めない)。A は「太陽の口が銀河だけ」という接続の帰結(銀河場の同定と数えない)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { galaxyAxis } from './lib-w319a-axisheat.mjs';
import * as X from './exp-w326d-axialheat.mjs';
import * as XE from './exp-w327e-axialdiff.mjs';
import * as E from './lib-w326d-axialheat.mjs';
import * as LS from './lib-w327a-axialsum.mjs';
import * as LD from './lib-w327e-axialdiff.mjs';
import * as LF from './lib-w327f-venustide.mjs';
import * as SB from './lib-w329a-spinbias.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 版 8 の宣言: ワンタップ対照の A/B を走らせない〔abBody:false〕・説明文の欄を読まない〔keepProse なし〕。
//   presets は器が .find で引く在位の本 1 本だけ)
const REGEN_SCOPE = {"presets":["solarSystem16Inertial3d"],"roots":["HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDragIsqPointAt","HP.inertialDragIsqState","HP.sim","HP.validatePreset","ctx","cw"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w329a-spinbias-1';
export const OUT_MAIN = 'tests/out/spinbias-w329a.json';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
export const NOT_CLAIM = Object.freeze(['偏りの振幅は「宣言したノブで表現できた(要る振幅)」の記録 —— 機構の同定・金星の逆転・表の面の同定ではない', '共通の法則の発見ではない(式の形の比べは無次元の比と残差の記録)',
  '捕獲や起源を確定したのではない(小さな位相の模型は宣言の下の診断)', '内部熱の説明ではない(τ_0 は宣言の 2 つの枝)', '負の Γ を要する解は不採用(0 に丸めない)',
  'A は「太陽の口が銀河だけ」という接続の帰結(銀河場の同定と数えない —— g_T と Ω_field は分けない)', '偏りの口は本の側へ入れない(在位の本・受理器・エンジンは不変)']);
const D = SB.DECL, DAY = 86400, YEAR = 365.25 * DAY;
const SATK = Object.keys({ io: 1 })[0], MER = Object.keys({ mercury: 1 })[0];   // 鍵の文字列を引用符で書かない(領域の下限 deriveScope が同じ綴りの本の id と取り違えない書き方 —— 第327便a と同じ)
/** 天体の鍵 → 🗺️ の添字(第326便d の IDX に水星) */
export const IDX = Object.freeze(Object.assign({}, X.IDX, { mercury: 1 }));
const KEYS7 = Object.freeze(['sun', MER, 'venus', 'earth', 'moon', 'jupiter', SATK]);
const NAME_JA = Object.freeze({ sun: '太陽', mercury: '水星', venus: '金星', earth: '地球', moon: '月', jupiter: '木星', [SATK]: 'イオ' });
/** 潮汐の目標の公転(受け手:起潮天体 → [中心, 回る天体]) */
const ORBIT_PAIR = Object.freeze({ [MER + ':sun']: ['sun', MER], 'venus:sun': ['sun', 'venus'], 'earth:sun': ['sun', 'earth'], 'moon:earth': ['earth', 'moon'], [SATK + ':jupiter']: ['jupiter', SATK],
  'jupiter:sun': ['sun', 'jupiter'], 'moon:sun': ['sun', 'earth'], [SATK + ':sun']: ['sun', 'jupiter'], ['jupiter:' + SATK]: ['jupiter', SATK], 'earth:moon': ['earth', 'moon'] });
// 第327便a の型(潮汐の係数を非負の未知)の口の接続: 第326便d・第327便e の ports に水星(太陽の K1・太陽の潮汐)
const PORTS_BETA = Object.freeze(Object.assign({}, E.DECL.ports, { moon: LD.DECL.ports.moon, earth: LD.DECL.ports.earth, [MER]: Object.freeze({ k1: Object.freeze(['sun']), tide: Object.freeze(['sun']) }) }));
const SYS_BETA = Object.freeze({ mercury: ['sun', MER], venus: ['sun', 'venus'], [SATK]: ['sun', 'jupiter', SATK], moon: ['sun', 'earth', 'moon'] });
// 文献の k2/Q の SI の型の口の接続(受け手の行だけを読む —— 源の天体は K1 の源として系に置く): 潮汐は組の源と太陽
const TIDE_SI = Object.freeze({ mercury: ['sun'], venus: ['sun'], [SATK]: ['jupiter', 'sun'], moon: ['earth', 'sun'] });
const K1_SI = Object.freeze({ mercury: ['sun'], venus: ['sun'], [SATK]: ['sun', 'jupiter'], moon: ['sun', 'earth'] });
const SYS_SI = Object.freeze({ mercury: ['sun', MER], venus: ['sun', 'venus'], [SATK]: ['sun', 'jupiter', SATK], moon: ['sun', 'earth', 'moon'] });
const PAIRS = D.pairs.map((p) => p.key);

/* ───────── I 入力 ───────── */
const axisOfDecl = (b) => { const t = b.spinAxis.tiltDeg * Math.PI / 180, a = b.spinAxis.azimuthDeg * Math.PI / 180; return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)]; };
function orbitOf(book, ci, oi, uL, uT) {
  const a = book.bodies[ci], b = book.bodies[oi], r = [b.x - a.x, b.y - a.y, b.z - a.z], v = [b.vx - a.vx, b.vy - a.vy, b.vz - a.vz];
  const h = E.cross(r, v), mu = book.physics.G * (a.m + b.m), sma = 1 / (2 / E.norm(r) - E.dot(v, v) / mu), n = Math.sqrt(mu / (sma * sma * sma)) / uT;
  const ecc = E.norm(E.sub(E.scale(E.cross(v, h), 1 / mu), E.scale(r, 1 / E.norm(r))));
  return { n: E.scale(h, n / E.norm(h)), nMag: n, dist: E.norm(r) * uL, sma: sma * uL, ecc };
}
export function partI(HP) {
  const st = X.stateOf(HP, X.copyBook(HP)), stJ = XE.stateFor(HP, 'J'), book = st.preset, se = book.scaleExp, uL = Math.pow(10, se.L), uT = Math.pow(10, se.T), uM = Math.pow(10, se.M);
  const moi = Object.assign({}, E.MOI, LD.MOI_ADD, D.lit.moi), rdB = st.isq.rdRule.bodies, bodies = {};
  for (const key of KEYS7) {
    const i = IDX[key], b = book.bodies[i], a = axisOfDecl(b), aE = [st.S.sax[i], st.S.say[i], st.S.saz[i]], Rd = rdB.find((q) => q.i === i).Rd * uL, m = b.m * uM, R = b.radius * uL;
    bodies[key] = { key, i, name: NAME_JA[key], m, R, s: b.spin / uT, sBook: b.spin, a, axisEngineAngDeg: E.angDeg(a, aE), Rd, moi: moi[key], I: moi[key] * m * R * R, rho: m / (4 / 3 * Math.PI * R * R * R) };
  }
  const orbits = {};
  for (const [k, [c, o]] of Object.entries(ORBIT_PAIR)) orbits[k] = orbitOf(book, IDX[c], IDX[o], uL, uT);
  const ga = galaxyAxis(), t = { now: {}, J: {} };
  const tPairs = [[MER, 'sun'], ['venus', 'sun'], ['earth', 'sun'], ['earth', 'moon'], ['moon', 'sun'], ['moon', 'earth'], ['jupiter', 'sun'], [SATK, 'sun'], [SATK, 'jupiter']];
  for (const [r, s2] of tPairs) { t.now[r + ':' + s2] = XE.gradT(st, IDX[r], IDX[s2]); t.J[r + ':' + s2] = XE.gradT(stJ, IDX[r], IDX[s2]); }
  const smf = stJ.isq.sourceMoment ? stJ.isq.sourceMoment.bodies.filter((q) => q.applied).map((q) => ({ i: q.i, momentFactor: q.momentFactor })) : [];
  const Asun = bodies.sun.s / E.dot(ga.g, bodies.sun.a);   // 族 E・球の平均 p = 0(f = 1)の太陽の式(太陽の口は銀河だけ)
  return { units: { lenSI: uL, timeSI: uT, massSI: uM }, bodies, orbits, g: ga.g, t, sourceMoment: smf, Asun, gBook: book.physics.G };
}

/* ───────── T 4 組の共通の入力表 ───────── */
export function partT(IN) {
  return D.pairs.map((pr) => {
    const P = SB.periodsOf(pr.key), b = IN.bodies[pr.recv], s0 = IN.bodies[pr.src], ob = IN.orbits[pr.recv + ':' + pr.src];
    const nAlong = E.dot(ob.n, b.a), kBook = b.s / nAlong;
    return { key: pr.key, src: pr.src, recv: pr.recv, srcJa: NAME_JA[pr.src], recvJa: NAME_JA[pr.recv], kind: pr.kind, role: pr.role,
      mSrc: s0.m, mRecv: b.m, Rrecv: b.R, rhoRecv: b.rho, sBookSI: b.s, axisTiltToOrbitDeg: E.angDeg(b.a, E.scale(ob.n, 1 / ob.nMag)), RdRecv: b.Rd, RdSrc: s0.Rd, YkRecv: b.Rd / b.m, moiRecv: b.moi,
      smaBook: ob.sma, eccBook: ob.ecc, orbitDaysBook: 2 * Math.PI / ob.nMag / DAY, spinDaysBook: 2 * Math.PI / b.s / DAY,
      kImage: P.kImage, imageOneTerm: SB.imageOneTerm(P.kImage), kObs: P.k, kBook, NObs: P.N, NImage: P.NImage, NBook: Math.abs(1 - kBook), orbitDays: P.orbitDays, spinDays: P.spinDays, solarDays: P.solarDays,
      synodicDays: P.synodicDays, synodicWith: P.synodicWith, synodicOverSolar: P.synodicOverSolar, eLit: P.e,
      units: { mass: 'kg', length: 'm', spin: 'rad/s(符号つき —— 軸 â の向き)', period: 'd(恒星に対する)' },
      sources: { mass: '本 🗺️ の J2000 の転記', spin: '本 🗺️(本の自転 —— 比べる列)/文献の周期(観測の k —— 本便は一次資料に当たっていない)', axis: '本 🗺️ の宣言の傾きと方位(J2000 の黄道)', Rd: '規則 R_d = Y_k m の読み口(K1)' } };
  });
}

/* ───────── 系の部品 ───────── */
const tOf = (IN, variant) => (r, s2) => IN.t[variant][r + ':' + s2];
/** 第327便a の型の系(銀河 f = 1・K1・潮汐〔y = 1〕—— 目標の公転は本の接触の二体) */
function sysBeta(IN, key, variant) {
  return SYS_BETA[key].map((k) => { const b = IN.bodies[k], P = PORTS_BETA[k], pp = [{ kind: 'gal' }];
    for (const s2 of P.k1) pp.push({ kind: 'k1', src: s2, t: tOf(IN, variant)(k, s2) });
    for (const r of P.tide) pp.push({ kind: 'tide', src: r, n: IN.orbits[k + ':' + r].n, y: 1 });
    return { key: k, s: b.s, a: b.a, f: 1, Rd: b.Rd, ports: pp }; });
}
const prmBeta = (IN) => ({ family: 'E', g: IN.g, gamma0: Object.fromEntries(KEYS7.map((k) => [k, IN.bodies[k].I])), beta: {}, alloc: LS.DECL.allocations.equal });
/** SI の型の系(銀河 f = 1・K1 の口だけ —— 潮汐は第327便f の extra の口で) */
function sysSI(IN, key, variant, sRecv) {
  return SYS_SI[key].map((k) => { const b = IN.bodies[k], pp = [{ kind: 'gal' }];
    if (k === key) for (const s2 of K1_SI[key]) pp.push({ kind: 'k1', src: s2, t: tOf(IN, variant)(k, s2) });
    return { key: k, s: k === key && sRecv !== undefined ? sRecv : b.s, a: b.a, f: 1, Rd: b.Rd, ports: pp }; });
}
const prmSI = (IN, tau) => (tau === 'inf' ? null : { family: 'E', g: IN.g, gamma0: Object.fromEntries(KEYS7.map((k) => [k, IN.bodies[k].I / LF.TAU_AGE])), beta: {}, alloc: LS.DECL.allocations.equal, A: IN.Asun });
/** 文献の周期の平均運動(rad/s)—— 起潮天体ごと(受け手の軌道か、太陽の潮汐のときは源の天体の公転) */
function litRate(key, raiser) {
  const o = D.obs;
  if (raiser === 'sun' && (key === MER || key === 'venus')) return 2 * Math.PI / (o[key].orbitDays * DAY);
  if (raiser === 'sun' && key === SATK) return 2 * Math.PI / (o.jupiterOrbitDays * DAY);
  if (raiser === 'sun' && key === 'moon') return 2 * Math.PI / (o.earthOrbitDays * DAY);
  return 2 * Math.PI / (o[key].orbitDays * DAY);
}
/** 潮汐の尺度 X′ = G M_r² R⁵/a⁶(a は本の接触の二体の長半径) */
function tidalScaleOf(IN, key, raiser) { const ob = IN.orbits[key + ':' + raiser]; return LF.tidalScale({ Mr: IN.bodies[raiser].m, R: IN.bodies[key].R, a: ob.sma }); }
/** 固体の潮汐の口(constLag —— 観測の滑りで一定の Q と同じトルクに揃える。同期の組の主の起潮天体は揃えの滑りに |n|) */
function tidePorts(IN, key, proj) {
  const b = IN.bodies[key], sObs = SB.periodsOf(key).s;
  return TIDE_SI[key].map((r) => {
    const nL = litRate(key, r), n = proj === 'book' ? E.scale(IN.orbits[key + ':' + r].n, nL / IN.orbits[key + ':' + r].nMag) : E.scale(b.a, nL);
    const NQ = 1.5 * D.lit.k2Q[key] * tidalScaleOf(IN, key, r), slipObs = Math.abs(sObs - E.dot(n, b.a)), wAnc = slipObs > 1e-9 * nL ? E.norm(E.sub(n, E.scale(b.a, sObs))) : nL;
    return { kind: 'solid', form: D.solidMain, src: r, n, NQ, wAnc, nAlong: E.dot(n, b.a) };
  });
}
/** 受け手の軸の向きのトルク(受動の口だけ・偏りの口 Nr を足せる)と帳簿 */
function evalRecv(IN, key, tau, sRecv, proj, variant = 'J', Nr = null) {
  const bodies = sysSI(IN, key, variant, sRecv), ext = { [key]: tidePorts(IN, key, proj).map((q) => ({ kind: q.kind, form: q.form, src: q.src, n: q.n, NQ: q.NQ, wAnc: q.wAnc })) };
  if (Nr !== null) ext[key].push({ kind: 'res', src: 'bias', Nr });
  const ev = LF.evaluateAll(bodies, prmSI(IN, tau), ext), row = ev.rows.find((q) => q.key === key);
  const origins = row.lsPorts.map((q) => ({ key: q.kind + (q.src ? ':' + q.src : ''), torqueAlong: q.torqueAlong, heat: q.heat, Gamma: q.Gamma, nuAlong: q.nuAlong }))
    .concat(row.ports.map((q) => ({ key: q.kind + ':' + q.src, torqueAlong: q.torqueAlong, heat: q.heat, Gamma: q.Gamma === undefined ? null : q.Gamma })));
  return { along: row.along, alongScale: row.alongScale, alongRel: row.alongRel, origins, ledger: ev.ledger, heatMinOrigin: Math.min(...origins.map((q) => q.heat)) };
}

/* ───────── P 受動の口の残差 ───────── */
export function partP(IN) {
  // ① 第327便a の型(潮汐の係数を非負の未知 —— Γ に依らない符号の判定)
  const beta = {};
  for (const key of PAIRS) for (const variant of ['J', 'now']) {
    const sys = sysBeta(IN, key, variant), sol = LS.solve(sys, Object.assign(prmBeta(IN), {})), lin = sol.lin;
    beta[key + '|' + variant] = { key, variant, A: sol.A, accepted: sol.accepted, rows: sol.rows.map((r) => ({ key: r.key, beta: r.beta, rejected: r.rejected, nonTide: r.nonTide })),
      recv: sol.rows.find((r) => r.key === key), lin: lin.map((r) => ({ key: r.key, cA: r.cA, cB: r.cB, c0: r.c0 })), alongMaxRel: sol.alongMaxRel, ledgerRel: sol.ev.ledger.residualRel, LRel: sol.ev.ledger.L.totalRel,
      heatMinPort: Math.min(...sol.ev.rows.flatMap((q) => q.ports.map((z) => z.heat))) };
  }
  // ② 文献の k2/Q の SI の型(τ_0 の 2 つの枝 × 自転の 3 列 × 射影の 2 列)
  const si = [];
  for (const key of PAIRS) {
    const P = SB.periodsOf(key), pr = D.pairs.find((q) => q.key === key), rates = ratesOf(key), wres = SB.patternRate(pr.pattern.modes, rates);
    for (const tau of D.tau0) for (const proj of [D.axisProjection.main, D.axisProjection.also]) {
      const cols = { obs: P.s, lock: wres, book: IN.bodies[key].s };
      for (const [col, s] of Object.entries(cols)) {
        const r = evalRecv(IN, key, tau, s, proj);
        si.push({ key, tau, proj, col, spin: s, torque: r.along, scale: r.alongScale, origins: r.origins, heatMinOrigin: r.heatMinOrigin, ledgerRel: r.ledger.residualRel, LRel: r.ledger.LTotalRel, portClose: r.ledger.portCloseMaxRel });
      }
    }
  }
  return { beta, si };
}
/** 組の軌道の角速度(文献の周期 —— 位相のパターンの係数の鍵) */
function ratesOf(key) {
  const o = D.obs, rt = { perihelion: 0 };
  rt.earth = 2 * Math.PI / (o.earthOrbitDays * DAY);
  for (const k of [MER, 'venus', SATK, 'moon']) rt[k] = 2 * Math.PI / (o[k].orbitDays * DAY);
  return rt;
}

/* ───────── S s_d の作用箇所 ───────── */
export function partS(HP, IN) {
  // ① 受理器の読み口(源と受け手を 1 つずつ —— 写しの dragCore {massFrac 1, spin = 本の自転 × 倍率}・源の R_src は今〔R_src = R_d —— 受理器は dragCore を宣言した天体に
  //   sourceMoment の R_src を置かせない(積の縮退の守り)—— その拒否は guard の行に記録〕)
  const base = X.stateOf(HP, X.copyBook(HP)), recvOf = { sun: [MER, 'venus', 'earth', 'moon', 'jupiter', SATK], jupiter: [SATK], earth: ['moon'], mercury: ['sun'], venus: ['sun'], moon: ['earth'], [SATK]: ['jupiter'] };
  const engine = [], guard = [];
  for (const key of D.sdSources.filter((k) => X.SRC_F[IDX[k]] !== undefined)) {
    const i = IDX[key], st = X.stateOf(HP, X.copyBook(HP, { sm: { kind: 'J', f: X.SRC_F }, dragCore: { [i]: { massFrac: 1, spin: IN.bodies[key].sBook } } }));
    guard.push({ key, ok: st.ok, err: st.ok ? null : st.err.slice(0, 200), sourceMomentGuard: !st.ok && /R_src を置けない/.test(st.err) });
  }
  for (const key of D.sdSources.concat(D.sdReceivers)) for (const f of D.sdFactors) {
    const i = IDX[key], st = X.stateOf(HP, X.copyBook(HP, { dragCore: { [i]: { massFrac: 1, spin: IN.bodies[key].sBook * f } } }));
    if (!st.ok) { engine.push({ key, f, ok: false, err: st.err.slice(0, 200) }); continue; }
    const own = st.isq.receivers.find((q) => q.i === i), own0 = base.isq.receivers.find((q) => q.i === i);
    const ownSame = own && own0 ? E.norm(E.sub(own.omega, own0.omega)) <= 1e-12 * Math.max(E.norm(own0.omega), 1e-300) : null;
    const lin = recvOf[key].map((rk) => { const r = st.isq.receivers.find((q) => q.i === IDX[rk]), r0 = base.isq.receivers.find((q) => q.i === IDX[rk]);
      const w = r.omegaSrc.slice(i * 4, i * 4 + 3), w0 = r0.omegaSrc.slice(i * 4, i * 4 + 3), want = E.scale(w0, f), sc = Math.max(E.norm(w0) * Math.max(Math.abs(f), 1), 1e-300);
      return { recv: rk, along: E.dot(w, IN.bodies[rk].a) / IN.units.timeSI, linRel: E.norm(E.sub(w, want)) / sc }; });
    engine.push({ key, f, ok: true, RdSame: st.isq.rdRule.bodies.find((q) => q.i === i).Rd === base.isq.rdRule.bodies.find((q) => q.i === i).Rd, spinSame: st.S.spin[i] === base.S.spin[i], ownTargetSame: ownSame,
      linMaxRel: Math.max(...lin.map((q) => q.linRel)), contributions: lin });
  }
  // ② 残差を消す源の倍率(閉じた式 —— 目標 ν = s_d t は倍率に一次)と第327便a の型の β = 0 の倍率・範囲(受理器の spin の値域)。
  //   主は受理器が受ける組(源の R_src は今 —— dragCore と sourceMoment J は同じ天体に置けない)・J の伝達の倍率は比べる列(受理器が拒否する組み合わせ)
  const pairSrc = [];
  for (const key of PAIRS) for (const s2 of K1_SI[key]) for (const variant of ['now', 'J']) {
    const b = IN.bodies[key], src = IN.bodies[s2], tA = E.dot(IN.t[variant][key + ':' + s2], b.a), G0 = b.I / LF.TAU_AGE, dTdf = G0 * tA * src.s;   // 倍率 f の軸の向きのトルクの傾き
    const lock = rowSI(IN, key, 'age', 'lock', D.axisProjection.main, variant), fStar = 1 - lock.torque / dTdf, bookStar = src.sBook * fStar;
    const sb = LS.linearRows(sysBeta(IN, key, variant), prmBeta(IN)).find((r) => r.key === key), dNdf = b.I * tA * src.s;   // 第327便a の型(Γ⁰ = I —— 潮汐でない口の残差の傾き)
    const nonTide = sb.cA * IN.Asun + sb.c0, fBeta = 1 - nonTide / dNdf;
    // 確かめ: 閉じた式の倍率で K1 の伝達を倍にした系の受け手のトルク(第327便a の k1Mul —— 0 に近いはず)
    const chkRow = (() => { const bodies = sysSI(IN, key, variant, SB.patternRate(D.pairs.find((q) => q.key === key).pattern.modes, ratesOf(key))), prm = Object.assign(prmSI(IN, 'age'), { k1Mul: { [key + ':' + s2]: fStar } });
      const ext = { [key]: tidePorts(IN, key, D.axisProjection.main).map((q) => ({ kind: q.kind, form: q.form, src: q.src, n: q.n, NQ: q.NQ, wAnc: q.wAnc })) }, ev = LF.evaluateAll(bodies, prm, ext), r = ev.rows.find((q) => q.key === key);
      return { torque: r.along, rel: r.alongRel }; })();
    pairSrc.push({ key, src: s2, variant, engineAccepts: variant === 'now', tAlong: tA, nuAlong: tA * src.s, dTdf, torqueLock: lock.torque, fStar, sdBookStar: bookStar, inRange: Math.abs(bookStar) <= D.spinRangeBook,
      checkTorque: chkRow.torque, checkRel: chkRow.rel, nonTide, fBeta, sdBookBeta: src.sBook * fBeta, inRangeBeta: Math.abs(src.sBook * fBeta) <= D.spinRangeBook });
  }
  // ③ 源の慣性(今 R_src = R_d / J)と倍率の積の縮退: ν(J, f) = ν(今, f × t_J/t_今)
  const degen = PAIRS.flatMap((key) => K1_SI[key].map((s2) => { const tn = IN.t.now[key + ':' + s2], tj = IN.t.J[key + ':' + s2], a = IN.bodies[key].a, ratio = E.dot(tj, a) / E.dot(tn, a);
    const nuJ = E.dot(tj, a) * IN.bodies[s2].s * 2, nuNow = E.dot(tn, a) * IN.bodies[s2].s * 2 * ratio;
    return { key, src: s2, ratio, rel: Math.abs(nuJ - nuNow) / Math.max(Math.abs(nuJ), 1e-300), momentFactor: (IN.sourceMoment.find((q) => q.i === IDX[s2]) || {}).momentFactor || null }; }));
  // ④ 受け手の核の自転 s_d を表面と別に置く列(核の口 = 銀河と K1 —— s_d で評価・表面の口 = 潮汐 —— 観測の自転で・結合の口 Γ_cs ≥ 0 だけ採る)
  const core = [];
  for (const key of PAIRS) {
    const P = SB.periodsOf(key), b = IN.bodies[key], G0 = b.I / LF.TAU_AGE, tide = tidePorts(IN, key, 'coplanar'), Om = E.scale(b.a, P.s);
    const nTide = tide.reduce((s, q) => s + E.dot(LF.solidPort(q.form, { Omega: Om, n: q.n, NQ: q.NQ, wAnc: q.wAnc }).torque, b.a), 0);
    const nus = [IN.Asun * E.dot(IN.g, b.a)].concat(K1_SI[key].map((s2) => E.dot(IN.t.J[key + ':' + s2], b.a) * IN.bodies[s2].s)), m = nus.length, sumNu = nus.reduce((x, y) => x + y, 0);
    const Ncore = (sd) => G0 * (sumNu - m * sd);
    const rows = D.sdFactors.map((f) => { const sd = P.s * f, cc = f === 1 ? { baseline: true, admissible: null, Gamma: null, heat: 0, why: '核と表面が同じ自転(結合の口は働かない —— 基準の列)' } : SB.coreCoupling({ Ncore: Ncore(sd), sd, s: P.s });
      return { f, sd, Ncore: Ncore(sd), torque: Ncore(sd) + nTide, coupling: cc }; });
    const sdStar = (sumNu + nTide / G0) / m, ccStar = SB.coreCoupling({ Ncore: Ncore(sdStar), sd: sdStar, s: P.s });
    core.push({ key, Gamma0: G0, nTide, sumNu, m, rows, sdStar, sdStarOverS: sdStar / P.s, sdStarBook: sdStar * IN.units.timeSI, inRange: Math.abs(sdStar * IN.units.timeSI) <= D.spinRangeBook, couplingStar: ccStar });
  }
  return { engine, guard, pairSrc, degen, core };
}
function rowSI(IN, key, tau, col, proj = D.axisProjection.main, variant = 'J') {
  const P = SB.periodsOf(key), pr = D.pairs.find((q) => q.key === key), s = col === 'obs' ? P.s : (col === 'lock' ? SB.patternRate(pr.pattern.modes, ratesOf(key)) : IN.bodies[key].s);
  const r = evalRecv(IN, key, tau, s, proj, variant);
  return { spin: s, torque: r.along, scale: r.alongScale };
}

/* ───────── B 偏りの 3 列 ───────── */
/** 組の文献の四重極の桁の N₂(位相のパターンの平均のトルクの最大)と尺度 */
export function quadOf(IN, key) {
  const b = IN.bodies[key], C = b.I, L = D.lit;
  if (key === 'venus') {   // 地球との 5:−4(第327便f の lib の resonanceZ —— 文献の周期・本の接触の二体の長半径)
    const BA = 4 * L.C22.venus * b.m * b.R * b.R, rt = ratesOf(key), Zr = LF.resonanceZ({ aR: IN.orbits['venus:sun'].sma, nR: rt.venus, aP: IN.orbits['earth:sun'].sma, nP: rt.earth, Om: SB.patternRate(D.pairs.find((q) => q.key === 'venus').pattern.modes, rt) });
    return { BA, N2: LF.resonanceMax({ GM: LF.G_SI * IN.bodies.earth.m, BA, absZ: Zr.abs }), pattern: '地球との 5:−4(会合周期の平均 |Z|)', absZ: Zr.abs, raiser: 'earth' };
  }
  if (key === MER) { const BA = 4 * L.C22.mercury * b.m * b.R * b.R, a = IN.orbits[MER + ':sun'].sma, H = SB.hansen32(D.obs.mercury.e);
    return { BA, N2: 1.5 * LF.G_SI * IN.bodies.sun.m * BA / (a * a * a) * H, pattern: '太陽との 3:2(離心率の関数 H(e))', hansen: H, raiser: 'sun' }; }
  const src = key === 'moon' ? 'earth' : 'jupiter', BA = key === 'moon' ? L.moonBAoverC * C : 4 * L.C22[key] * b.m * b.R * b.R, a = IN.orbits[key + ':' + src].sma;
  return { BA, N2: LF.resonanceMax({ GM: LF.G_SI * IN.bodies[src].m, BA, absZ: LF.satelliteZ({ a }).abs }), pattern: '同期(1:1)', raiser: src };
}
export function partB(IN) {
  const rows = [];
  for (const key of PAIRS) {
    const pr = D.pairs.find((q) => q.key === key), P = SB.periodsOf(key), b = IN.bodies[key], C = b.I, rt = ratesOf(key), wres = SB.patternRate(pr.pattern.modes, rt), Q = quadOf(IN, key);
    const n1Adm = SB.harmonicAdmissible(pr.pattern.modes, 1), n2Adm = SB.harmonicAdmissible(pr.pattern.modes, 2), Delta = Math.abs(P.s - wres);
    const modes = pr.pattern.modes.map((q) => ({ key: q.key, coefficient: q.coefficient, omega: rt[q.key] }));
    for (const tau of D.tau0) {
      const lock = rowSI(IN, key, tau, 'lock'), obs = rowSI(IN, key, tau, 'obs'), Tp = lock.torque;
      const req = SB.requiredAmplitudes({ Treq: -Tp, Delta, C, N2fix: Q.N2, n1Admissible: n1Adm });
      const colOf = (N1, N2, nm) => {
        const eq = SB.equilibriumPhase(-Tp, N1, N2);
        if (!eq.front) return { column: nm, N1, N2, phase: null };
        const g = eq.front.gamma, ctr = SB.biasPower({ gamma: g, spinOmega: wres, N1, N2, orbitalModes: modes }), wdt = SB.separatrixHalfWidth({ Treq: Tp, N1, N2, C, gammaStar: g });
        const led = evalRecv(IN, key, tau, wres, D.axisProjection.main, 'J', ctr.torque);
        return { column: nm, N1, N2, phase: { gamma: g, gammaDeg: g * 180 / Math.PI, gradient: eq.front.gradient, back: eq.back ? { gamma: eq.back.gamma, depthAboveFront: eq.back.potential - eq.front.potential } : null,
          frontBackDepth: SB.biasPotential(Math.PI, N1, N2) - SB.biasPotential(0, N1, N2), tiltedWidth: wdt, deltaOverWidth: wdt > 0 ? Delta / wdt : null },
          contract: { torque: ctr.torque, heat: ctr.heat, potentialRate: ctr.potentialRate, orbitDraw: ctr.orbitDraw, spinPower: ctr.spinPower, orbitTorques: ctr.orbits.map((q) => ({ key: q.key, torque: q.torque })),
            energyRel: ctr.energyResidualRel, angularRel: ctr.angularResidualRel },
          ledger: { alongRel: led.alongRel, residualRel: led.ledger.residualRel, LRel: led.ledger.LTotalRel, portClose: led.ledger.portCloseMaxRel, biasHeat: led.origins.find((q) => q.key === 'res:bias').heat, heatMinOrigin: led.heatMinOrigin } };
      };
      const n2 = n2Adm ? colOf(0, D.margin * req.n2.required, 'n2') : null;
      const n1 = req.n1 ? colOf(D.margin * req.n1.required, Q.N2, 'n1') : null;
      rows.push({ key, tau, omegaRes: wres, resDays: 2 * Math.PI / wres / DAY, Delta, DeltaRel: Delta / Math.abs(wres), driftDegPerSynodic: Delta * P.synodicDays * DAY * 180 / Math.PI,
        cycleYears: Delta > 0 ? 2 * Math.PI / Delta / YEAR : null, C, quad: Q, n1Admissible: n1Adm, n2Admissible: n2Adm,
        none: { torqueLock: Tp, torqueObs: obs.torque, torqueLockRel: Math.abs(Tp) / Math.max(lock.scale, 1e-300), holds: Math.abs(Tp) <= 1e-12 * Math.max(lock.scale, 1e-300) },
        required: req, n2, n1, quadHolds: Math.abs(Tp) <= Q.N2 && SB.widthN2(Q.N2, C) >= Delta });
    }
  }
  return { rows };
}

/* ───────── F 気体と固体の 2 組の式の形 ───────── */
export function partF(IN, B) {
  const scaleOf = (key) => {
    const pr = D.pairs.find((q) => q.key === key), b = IN.bodies[key], src = IN.bodies[pr.src], ob = IN.orbits[key + ':' + pr.src], Q = quadOf(IN, key), n = SB.periodsOf(key).n;
    return { tidal: LF.tidalScale({ Mr: src.m, R: b.R, a: ob.sma }), quad: 1.5 * LF.G_SI * src.m * Q.BA / Math.pow(ob.sma, 3), spin: b.I * n * n };
  };
  const qOf = (key) => { const pr = D.pairs.find((q) => q.key === key), P = SB.periodsOf(key); return { mSrc: IN.bodies[pr.src].m, mRecv: IN.bodies[key].m, dist: IN.orbits[key + ':' + pr.src].sma, radius: IN.bodies[key].R, cycles: P.N, orbitRate: P.n }; };
  const need = (key, tau, kind) => { const r = B.rows.find((q) => q.key === key && q.tau === tau); if (!r) return null;
    if (kind === 'torque') return Math.abs(r.none.torqueLock);
    if (kind === 'widthN2') return r.required.n2.width;
    return null; };
  const table = PAIRS.map((key) => ({ key, scales: scaleOf(key), q: qOf(key), c: Object.fromEntries(D.tau0.map((tau) => [tau, Object.fromEntries(['torque', 'widthN2'].map((kind) => {
    const nv = need(key, tau, kind), sc = scaleOf(key); return [kind, Object.fromEntries(D.forms.map((fm) => [fm.key, nv === null ? null : nv / sc[fm.key]]))]; }))])) }));
  const [ka, kb] = D.mainPairs, ta = table.find((q) => q.key === ka), tb = table.find((q) => q.key === kb), cmp = [];
  for (const kind of ['torque', 'widthN2']) for (const fm of D.forms) {
    const rb = Object.fromEntries(D.tau0.map((tau) => [tau, { a: ta.c[tau][kind][fm.key], b: tb.c[tau][kind][fm.key] }])), fc = SB.formCompare(rb);
    const simple = D.simpleRatios.map((qk) => Object.assign({ q: qk }, SB.simplePower(rb, ta.q[qk], tb.q[qk])));
    cmp.push({ kind, form: fm.key, per: fc.per, candidate: fc.candidate, simple, anySimple: simple.some((z) => z.simple) });
  }
  return { pairs: [ka, kb], control: D.controlPair, side: D.sidePair, table, compare: cmp, anyCandidate: cmp.some((q) => q.candidate) };
}

/* ───────── A AN570 の限定の列 ───────── */
export function partA(IN, Pp) {
  const rows = [];
  for (const key of PAIRS) for (const k of SYS_BETA[key].filter((z) => z !== 'sun')) {
    if (rows.find((q) => q.body === k)) continue;
    const L = Pp.beta[key + '|J'].lin.find((r) => r.key === k);
    if (!L || L.cB === 0) continue;
    // β ≥ 0 ⇔ −(cA A + c0)/cB ≥ 0 —— A の半直線(閾値 A_th = −c0/cA)
    const Ath = -L.c0 / L.cA, sideLE = (L.cB > 0) === (L.cA > 0);   // cB > 0 なら cA A + c0 ≤ 0 が要る —— cA > 0 で A ≤ A_th
    const range = sideLE ? { lo: null, hi: Ath } : { lo: Ath, hi: null }, inside = sideLE ? IN.Asun <= Ath : IN.Asun >= Ath;
    rows.push({ body: k, name: NAME_JA[k], cA: L.cA, cB: L.cB, c0: L.c0, Ath, range, AsunInside: inside, AthOverAsun: Ath / IN.Asun });
  }
  // SI の型(文献の k2/Q・τ_0 = 年齢): 受け手のトルクを 0 にする A*(A に一次 —— 傾き Γ⁰ f ĝ·â)
  const si = PAIRS.map((key) => { const b = IN.bodies[key], G0 = b.I / LF.TAU_AGE, lock = rowSI(IN, key, 'age', 'lock'), dTdA = G0 * E.dot(IN.g, b.a), Astar = IN.Asun - lock.torque / dTdA;
    return { key, torqueLock: lock.torque, dTdA, Astar, AstarOverAsun: Astar / IN.Asun }; });
  const main = ['venus', 'jupiter', SATK].map((k) => rows.find((q) => q.body === k)).filter(Boolean);
  return { Asun: IN.Asun, rows, si, mainConsistent: main.every((q) => q.AsunInside), rank: 1, note: '同じ局所の場を受ける天体の行は互いに比例(ランク 1)—— 閾値は A の範囲を狭めるだけで g_T と Ω_field は分けない(g_T = 1 は代表の規約)' };
}

/* ───────── M AN575 の小さな位相の模型 ───────── */
export function partM(IN, B) {
  const key = D.phaseModel.pair, pr = D.pairs.find((q) => q.key === key), P = SB.periodsOf(key), b = IN.bodies[key], C = b.I, rt = ratesOf(key), wres = SB.patternRate(pr.pattern.modes, rt);
  const row = B.rows.find((q) => q.key === key && q.tau === D.phaseModel.tau), col = row[D.phaseModel.column];
  const tide = tidePorts(IN, key, 'coplanar'), G0 = D.phaseModel.tau === 'inf' ? 0 : b.I / LF.TAU_AGE;
  const ports = tide.map((q) => ({ key: 'tide:' + q.src, Gamma: q.NQ / q.wAnc, nu: q.nAlong }));
  if (G0 > 0) { ports.push({ key: 'gal', Gamma: G0, nu: IN.Asun * E.dot(IN.g, b.a) }); for (const s2 of K1_SI[key]) ports.push({ key: 'k1:' + s2, Gamma: G0, nu: E.dot(IN.t.J[key + ':' + s2], b.a) * IN.bodies[s2].s }); }
  const Tl = ports.reduce((s, q) => s + q.Gamma * (q.nu - wres), 0), N1 = col.N1, N2 = col.N2, eq = SB.equilibriumPhase(-Tl, N1, N2), gs = eq.front.gamma;
  const Tlib = 2 * Math.PI / Math.sqrt(-eq.front.gradient / C), damping = ports.reduce((s, q) => s + q.Gamma, 0), width = SB.separatrixHalfWidth({ Treq: Tl, N1, N2, C, gammaStar: gs });
  const starts = { observed: P.s, image: P.kImage * P.n };
  const runs = D.phaseModel.starts.map((nm) => {
    const Om0 = starts[nm], Tc = Om0 !== wres ? 2 * Math.PI / Math.abs(Om0 - wres) : Infinity, hBase = Math.min(Tlib, Tc) / D.phaseModel.stepsPerPeriod, span = D.phaseModel.periods * Tlib, n = Math.ceil(span / hBase);
    const run = (div) => SB.integratePhase({ C, N1, N2, omegaRes: wres, ports, gamma0: gs, Omega0: Om0, h: span / (n * div), steps: n * div, gammaStar: gs });
    const r1 = run(1), r2 = run(2);
    return { start: nm, Omega0: Om0, k0: Om0 / P.n, slip0: Om0 - wres, slip0OverWidth: Math.abs(Om0 - wres) / width, energyBelowBarrier: Math.abs(Om0 - wres) < width, spanYears: span / YEAR, steps: n,
      h: { state: r1.state, gamma: r1.gamma, slip: r1.slip, heat: r1.heat, supply: r1.supply, orbitDraw: r1.orbitDraw, patternRel: r1.patternRel, inertialRel: r1.inertialRel, maxDeviation: r1.maxDeviation },
      h2: { state: r2.state, gamma: r2.gamma, slip: r2.slip, heat: r2.heat, supply: r2.supply, orbitDraw: r2.orbitDraw, patternRel: r2.patternRel, inertialRel: r2.inertialRel, maxDeviation: r2.maxDeviation },
      converged: r1.state === r2.state && Math.abs(r1.gamma - r2.gamma) <= D.phaseModel.gammaTol * Math.max(1, Math.abs(r2.gamma)), gammaDiff: Math.abs(r1.gamma - r2.gamma), patternRelRatio: r2.patternRel > 0 ? r1.patternRel / r2.patternRel : null };
  });
  return { pair: key, tau: D.phaseModel.tau, column: D.phaseModel.column, declared: { epoch: D.epoch, orbit: D.orbitKind.main, projection: D.axisProjection.main, harmonics: 'N₁ + N₂(N₂ は文献の四重極の桁)', damping: '受動の口の Γ の和(固体の潮汐 + 銀河と K1 の口 —— τ_0 = 年齢)' },
    C, N1, N2, omegaRes: wres, torqueLock: Tl, gammaStar: gs, gradient: eq.front.gradient, libPeriodYears: Tlib / YEAR, damping, dampTimeYears: C / damping / YEAR, width, ports: ports.map((q) => ({ key: q.key, Gamma: q.Gamma, nu: q.nu })), runs };
}

/* ───────── まとめる ───────── */
export function runAll(HP) {
  const t0 = Date.now(), tm = {}, mark = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; };
  const IN = partI(HP); mark('I');
  const T0 = partT(IN); mark('table');
  const Pp = partP(IN); mark('P');
  const S = partS(HP, IN); mark('S');
  const B = partB(IN); mark('B');
  const F = partF(IN, B); mark('F');
  const A = partA(IN, Pp); mark('A');
  const M = partM(IN, B); mark('M');
  const PS = SB.pureScenes(), PG = SB.pureGates(PS);
  const inputs = { units: IN.units, g: IN.g, Asun: IN.Asun, tauAge: LF.TAU_AGE, bodies: Object.fromEntries(KEYS7.map((k) => { const q = IN.bodies[k]; return [k, { m: q.m, R: q.R, s: q.s, a: q.a, Rd: q.Rd, moi: q.moi, I: q.I, axisEngineAngDeg: q.axisEngineAngDeg }]; })),
    orbits: Object.fromEntries(Object.entries(IN.orbits).map(([k, o]) => [k, { nMag: o.nMag, sma: o.sma, ecc: o.ecc, dist: o.dist }])), sourceMoment: IN.sourceMoment };
  const J = { inputs, table: T0, passive: Pp, sd: S, bias: B, forms: F, an570: A, phaseModel: M, pure: { scenes: PS, gates: PG }, timing: tm };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export function gatesOf(J) {
  const P = J.passive, S = J.sd, B = J.bias, M = J.phaseModel;
  const siRows = P.si, bRows = B.rows.flatMap((r) => [r.n2, r.n1].filter((c) => c && c.phase));
  return {
    pure: Object.values(J.pure.gates).every(Boolean),
    // 表: 4 組・観測の k と像の k は別の列(本の自転を像に置き換えない)・金星の k と N・会合と太陽日の比(宣言の文献の周期)
    table: J.table.length === 4 && J.table.every((r) => Number.isFinite(r.kObs) && Number.isFinite(r.kImage) && Number.isFinite(r.kBook)) && Math.abs(J.table.find((r) => r.key === 'venus').kObs + 0.92460035) < 5e-9
      && Math.abs(J.table.find((r) => r.key === 'venus').synodicOverSolar - 5.0014) < 1e-3,
    // 受動の口: 第327便a の型の帳簿が閉じ・SI の型の帳簿(エネルギー・L・口の閉じ)が丸めの内・由来ごとの熱 ≥ 0
    passiveLedger: Object.values(P.beta).every((q) => q.ledgerRel <= 1e-12 && q.LRel <= 1e-12) && siRows.every((q) => q.ledgerRel <= 1e-12 && q.LRel <= 1e-12 && q.portClose <= 1e-12 && q.heatMinOrigin >= 0),
    // s_d: 受理は範囲の内だけ・受理した全件で K1 の R_d と本の自転と自身の目標が不変・源の寄与は倍率に比例・縮退の照合
    sdEngine: S.engine.every((q) => !q.ok || (q.RdSame && q.spinSame && q.ownTargetSame !== false && q.linMaxRel <= 1e-12)) && S.engine.filter((q) => !q.ok).every((q) => /-20〜20/.test(q.err))
      && S.guard.length > 0 && S.guard.every((q) => q.sourceMomentGuard === true) && S.degen.every((q) => q.rel <= 1e-12) && S.pairSrc.every((q) => q.checkRel <= 1e-9),
    // 偏りの列: 位相のある列は全部 復元の勾配 < 0・熱 0・反作用の和と契約の帳簿・系の帳簿(偏りの口を足して軸の向きの残差 0)
    biasColumns: bRows.length > 0 && bRows.every((c) => c.phase.gradient < 0 && c.contract.heat === 0 && c.ledger.biasHeat === 0 && c.contract.energyRel <= 1e-12 && c.contract.angularRel <= 1e-12
      && c.ledger.alongRel <= 1e-12 && c.ledger.residualRel <= 1e-12 && c.ledger.LRel <= 1e-12 && c.ledger.portClose <= 1e-12 && c.ledger.heatMinOrigin >= 0),
    // 水星の 3:2 は N₁ の項が一価でない(列を出さない)
    mercuryN1Absent: B.rows.filter((r) => r.key === MER).every((r) => r.n1Admissible === false && r.n1 === null),
    // 位相の模型: h と h/2 で判定が同じ・帳簿(パターンの枠)が小さい・熱 ≥ 0
    phaseModel: M.runs.length === 2 && M.runs.every((r) => r.converged && r.h2.patternRel <= 1e-6 && r.h.heat >= 0 && r.h2.heat >= 0) && M.gradient < 0 && M.damping > 0,
  };
}

/* ───────── 走らせる ───────── */
export async function main() {
  const TARGET = process.env.W329A_TARGET || 'beta/index.html';
  const OUT = process.env.W329A_OUT ? (path.isAbsolute(process.env.W329A_OUT) ? process.env.W329A_OUT : path.join(ROOT, process.env.W329A_OUT)) : path.join(ROOT, OUT_MAIN);
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第329便a spinbias(版 ' + HARNESS_VERSION + ')');
  const R = runAll(HP);
  const out = { version: HARNESS_VERSION, libVersion: SB.LIB_VERSION, w328cLibVersion: 'w328c-respower-lib-1', w327fLibVersion: LF.LIB_VERSION, w327eLibVersion: LD.LIB_VERSION, w327aLibVersion: LS.LIB_VERSION, w326dLibVersion: E.LIB_VERSION,
    generator: 'tests/exp-w329a-spinbias.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の方針(2026-11-07)・原仮定者の回答(2026-11-07 —— AN570・AN571・AN574・AN575)・統括の検証項目 R304',
    decl: D, notClaim: NOT_CLAIM, invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, srcMomentVersion: HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w329a-spinbias.mjs', 'tests/lib-w329a-spinbias.mjs', 'tests/lib-w328c-respower.mjs', 'tests/lib-w327f-venustide.mjs', 'tests/exp-w327e-axialdiff.mjs', 'tests/lib-w327e-axialdiff.mjs',
    'tests/lib-w327a-axialsum.mjs', 'tests/exp-w326d-axialheat.mjs', 'tests/lib-w326d-axialheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第329便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'spinbias', engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)と純関数', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

// 第322便c(統括の検証項目 R272 —— 決断事項 AN501・AN503・AN506・AN511・AN512 の材料・策定の段 S2 の geoPN=4 の場の契約): **外部場の輸送の力学の契約の導出と散逸のグループの集計の器**
// (段 fieldcontract-322c —— 正本 tests/out/fieldcontract-w322c.json)。html・エンジン・在位の本・`S._core` は変えない(器・lib・正本・文書だけ)。
//
// Node だけ。部 K は html を読まない(lib tests/lib-w322c-fieldcontract.mjs の純関数 —— 第321便a の輸送の純関数 transportDelta3 を外部場で回す)。部 G は対象 html の inline script を
// tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む(第320便a の器の 🗺️ の写しの本 + 源のモーメントの初期の状態の読み口 inertialDragIsqState〔perSource〕と純関数 inertialDrag3MaintCell
// —— 第321便c の部 H と同じ口)。子プロセス W322C_WORKERS(既定 2)本で部を分ける(結果は部ごとの標準出力の JSON —— 一時ファイルを作らない)。
//
// ■ 何をするか
//   K  外部場の輸送の力学の契約(AN512): 零場・定常(3D の差動回転)・一様流・剛体回転・せん断・非定常の一様流の 6 場面で、今の v−u 輸送(K —— 離散・h/h2/h4)・その連続の極限(Kc)・
//      正準の型 H = ½|p|² + p·u + Φ(P —— p0 = v0 − u(x0)・Pl —— p0 = v0)・位置に u を足すだけ(A)の軌道・エネルギー・角運動量・場の仕事とトルクと力積の供給の台帳を並べる。
//      ビットの照合(零場の K = 素の重力の步・一様流の K = 零場の K)・剛体回転の解析解・dUdt = null の拒否・k_F ≠ 1 の余りの力の閉じた路の積分(ストークスの照合)。
//   G  散逸のグループの集計(AN511 —— 両方の列): 6 天体(受け手)で (A) 銀河全体を 1 グループ(中心と残余を同じグループ —— 宣言を併合して ω を 1 回作り熱を 1 回)・太陽と各衛星と
//      他の天体は別のグループ/(B) 成分ごと(バルジ・円盤 4 成分 —— 独立の駆動・散逸の経路を持つという追加の仮定の列)・(B2) 星(薄い + 厚い円盤)とガス(HI + H2)と
//      バルジの 3 グループ・(Bdh) バルジ・円盤・ハローの 3 区分(宣言の模型はバルジが静止・流れのハローが無い —— 円盤の 1 グループ)・(C) 第321便c の型(中心と残余を別の源)の
//      heat.source − heat.composite(符号つき)。**R_cut を 1〜10 kpc で動かしても (A) の熱が同じビット**(門)・ω を足してから熱(部の和 —— 丸めの差)と部ごとの熱(R_cut で動く)を
//      対照の列に。源のモーメント J(主)と capObs(衛星の列の対照)。
//   D  AN503 の診断の写しの器の設計(宣言だけ —— 走らせるのは次便)。
// ■ 試走: W322C_QUICK=1(W322C_OUT が要る —— 正本を書かない・刻みと表を縮める)。W322C_WORKERS(既定 2 —— 1 なら 1 プロセスで順に)。
// ■ 言わないこと: 外部場の輸送をエンジンに入れたと書かない(器の純関数だけ)・k_F を較正の係数と呼ばない・規定の流れの場を源の自己無撞着の解と呼ばない・正準の H の保存は定常の宣言の場だけ・
//   dUdt = null を 0 と読まない・拮抗の差を非負へ切らない(AN496)・capObs の全熱を太陽の効果と呼ばない(AN498)・(B) を既定と呼ばない(追加の仮定の列)・回転曲線の予言と呼ばない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as K from './lib-w322c-fieldcontract.mjs';
import * as F from './lib-w321c-galfield.mjs';
import * as L9 from './lib-w319b-srcradius.mjs';
import * as A20 from './lib-w320a-srcheat.mjs';
import { portsOf as portsA, copyBook, stateOf } from './exp-w320a-srcheat.mjs';
// 第281便a の領域 hash の宣言(器・lib と import した第320便a の器・第319便b/第320便c/第321便a/第321便c の lib から deriveScope で引いた下限 —— presets は部 G の 🗺️ の写しの元と、
//   import した lib・器の綴りが数えられた分。roots の短い名は import した lib・器の綴りが数えられた分 —— この器と lib の局所の変数には使わない)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","marsSunInertial3d","mercury","mercurySunInertial3d","neptuneSunInertial3d","saturn","saturnRingReal","saturnSunInertial3d","solarSystem16Inertial3d","uranusSunInertial3d","venusSunInertial3d"],"roots":["$","HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION","HP.REL_DRAG_AXIS_HOLD_BALANCE_VERSION_319","HP.REL_DRAG_AXIS_HOLD_MAINT_VERSION","HP.REL_DRAG_AXIS_HOLD_SRC_VERSION","HP.REL_DRAG_INVSQ_SRC_MOMENT_VERSION","HP.allPresets","HP.axisHoldSourceSum","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.inertialDrag3MaintCell","HP.inertialDrag3MaintStateOf","HP.inertialDragIsqM1","HP.inertialDragIsqM1Src","HP.inertialDragIsqSrcRadiusOf","HP.inertialDragIsqState","HP.sim","HP.tideState","HP.validatePreset","T","ab","ch","ctx","cw","inertialDragGalaxyAxialState","inertialDragIsqM1","pnSource"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w322c-fieldcontract-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const OUT_FIELDCONTRACT = 'tests/out/fieldcontract-w322c.json';
const NOT_CLAIM = ['外部場の輸送をエンジンに入れたと書かない(器の純関数だけ)', 'k_F を較正の係数と呼ばない', '規定の流れの場を源の自己無撞着の解と呼ばない',
  '正準の H の保存は定常の宣言の場だけ(非定常は dH/dt = p·∂_t u の台帳)', 'dUdt = null を 0 と読まない(拒否)', '拮抗の差 heat.source − heat.composite を非負へ切らない(AN496)',
  'capObs の全熱を太陽の効果と呼ばない(AN498)', '成分ごとの列を既定と呼ばない(独立の駆動・散逸の経路を持つという追加の仮定の列)', '観測の流れを入力して同じ回転曲線を得ることを予言と呼ばない'];
export const PLAN = Object.freeze({
  contract: Object.freeze({ hDiv: Object.freeze([1, 2, 4]), kFields: Object.freeze(['steady', 'rigid', 'shear']), gradAt: Object.freeze([0.8, 0.5, 0.2]), gradT: 1.3 }),
  groups: Object.freeze({ kinds: Object.freeze(['J', 'capObs']), rows: Object.freeze([1, 2, 3, 5, 6, 11]), rCut: Object.freeze([1, 2, 4, 6, 8, 10]), rCutMain: 4, rel: 1e-11 }) });
export const QUICK = Object.freeze({
  contract: Object.freeze({ hDiv: Object.freeze([1, 2]), kFields: Object.freeze(['steady', 'rigid']), gradAt: Object.freeze([0.8, 0.5, 0.2]), gradT: 1.3, tEnd: 6.28 }),
  groups: Object.freeze({ kinds: Object.freeze(['J']), rows: Object.freeze([2, 6]), rCut: Object.freeze([2, 4]), rCutMain: 4, rel: 1e-9 }) });
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

/* ───────── K 外部場の輸送の力学の契約(AN512)───────── */
const sameBits = (a, b) => a.length === b.length && a.every((q, i) => Object.is(q, b[i]));
export function partK(plan) {
  const D = K.DECL, flds = K.fieldsOf(D), P = plan.contract, tEnd = P.tEnd || D.tEnd, rows = [];
  for (const f of flds) {
    const rP = K.runC('P', f, { tEnd }), rKc = K.runC('Kc', f, { tEnd }), rPl = K.runC('Pl', f, { tEnd }), rA = K.runC('A', f, { tEnd });
    const rK = P.hDiv.map((d) => K.runK(f, { h: D.h / d, tEnd })), dx = (r) => K.nrm(K.sub(r.x, rP.x)), errK = rK.map(dx);
    const u0 = f.at(D.x0, 0).u;
    rows.push({ key: f.key, ja: f.ja, stationary: f.stationary, axisym: f.axisym, u0Abs: K.nrm(u0), gradRel: K.gradCheck(f, P.gradAt.slice(), P.gradT), dudtRel: K.dudtCheck(f, P.gradAt.slice(), P.gradT),
      errKc: dx(rKc), errK, orderK: errK.slice(1).map((e, k) => Math.log2(errK[k] / e)), errPl: dx(rPl), errA: dx(rA), clampN: rK.map((r) => r.clampN), xP: rP.x,
      ledger: { P: K.ledgerOf(rP), Kc: K.ledgerOf(rKc), K: rK.map((r) => K.ledgerOf(r)), Pl: K.ledgerOf(rPl), A: K.ledgerOf(rA) } });
  }
  // ビットの照合: 零場の K = 素の重力のキック → ドリフト・一様流の K = 零場の K(u − u_prev = 0・∇u = 0 —— +0 を足すだけ)
  const kz = K.runK(flds[0], { tEnd }), pl = K.runPlain({ tEnd }), ku = K.runK(flds.find((q) => q.key === 'uniform'), { tEnd });
  const bits = { zeroVsPlain: sameBits(kz.x, pl.x) && sameBits(kz.v, pl.v), uniformVsZero: sameBits(ku.x, kz.x) && sameBits(ku.v, kz.v) };
  // 剛体回転 × 中心の引力の解析解 x(t) = R(Ωt) y(t)
  const an = K.rigidAnalytic({ tEnd }), rr = rows.find((r) => r.key === 'rigid'), rigidAnalyticErr = K.nrm(K.sub(an.x, rr.xP));
  // dUdt = null の拒否(0 で埋めない)
  const nul = K.nullDudtOf(flds.find((q) => q.key === 'unsteady')), nullRej = [];
  for (const [nm, fn] of [['K', () => K.runK(nul, { tEnd })], ['Kc', () => K.runC('Kc', nul, { tEnd })], ['P', () => K.runC('P', nul, { tEnd })]]) { let r = 'accepted'; try { fn(); } catch (e) { r = e instanceof RangeError ? 'rejected' : 'error'; } nullRej.push({ type: nm, result: r }); }
  // k_F ≠ 1(既定 0.5): 余りの力 k_F(1 − k_F)(u·∇)u の閉じた路の積分・K(0.5) の Kc(0.5) への刻みの感度・Kc(0.5) と u の振幅を k_F 倍した正準の型の差・H_k の変化(T と longMul × T)
  const kRows = P.kFields.map((key) => {
    const f = flds.find((q) => q.key === key), kF = D.kFHalf, circ = K.residualCircuitOf(f, kF), kc = K.runC('Kc', f, { kF, tEnd }), kk = P.hDiv.map((d) => K.nrm(K.sub(K.runK(f, { kF, h: D.h / d, tEnd }).x, kc.x)));
    const half = { key: key + 'Amp', stationary: true, at: (x, t) => { const q = f.at(x, t); return { u: K.scl(q.u, kF), G: q.G.map((g) => kF * g), dUdt: [0, 0, 0] }; } };
    const ph = K.runC('P', half, { tEnd }), lg = K.ledgerOf(kc, kF), lg1 = K.ledgerOf(K.runC('Kc', f, { kF: 1, tEnd: tEnd * D.longMul }), 1);   // k_F = 1 の対照(長い走行の H —— k_F ≠ 1 の不変量は余りの力が勾配のときだけ在る: 閉じた路の積分で見る)
    return { key, kF, loopLine: circ.line, loopArea: circ.area, loopScale: circ.scale, errK: kk, orderK: kk.slice(1).map((e, k) => Math.log2(kk[k] / e)), errVsAmpP: K.nrm(K.sub(kc.x, ph.x)),
      dHLongKF1: lg1.dH, dLcanZ: lg.dLcanZ };
  });
  return { decl: clone(D), rows, bits, rigidAnalyticErr, nullRej, kRows, contractDraft: clone(K.CONTRACT_DRAFT) };
}

/* ───────── G 散逸のグループの集計(AN511 —— 両方の列)───────── */
const COMP_KEYS = Object.freeze({ 'disk:thin': 'thin', 'disk:thick': 'thick', 'disk:HI': 'HI', 'disk:H2': 'H2', bulge: 'bulge' });
/** 成分ごとの項の宣言(各成分を [0, ∞) で 1 項) */
export function compState() { return { model: F.MODEL_ID, stationary: true, terms: F.ALL_COMPS.map((c) => ({ key: COMP_KEYS[c], coef: 1, owns: [{ comp: c, lo: 0, hi: Infinity }] })) }; }
/** グループの宣言(列の名 → sourceState と groups) */
export function groupDeclsOf(rCut) {
  const cs = compState();
  return {
    A: { st: F.splitState(rCut), groups: [{ key: 'galaxyWhole', terms: ['center', 'residual'] }] },
    B: { st: cs, groups: cs.terms.map((t) => ({ key: t.key, terms: [t.key] })) },
    B2: { st: cs, groups: [{ key: 'starDisks', terms: ['thin', 'thick'] }, { key: 'gasDisks', terms: ['HI', 'H2'] }, { key: 'bulge', terms: ['bulge'] }] },
    Bdh: { st: cs, groups: [{ key: 'disk', terms: ['thin', 'thick', 'HI', 'H2'] }, { key: 'bulge', terms: ['bulge'] }] },   // ハローは宣言の模型の流れに無い(0 の行は置かない)
    C: { st: F.splitState(rCut), groups: [{ key: 'center', terms: ['center'] }, { key: 'residual', terms: ['residual'] }] } };
}
export function partG(HP, plan) {
  const E = portsA(HP), Pg = plan.groups, Fr = L9.galFrame(), R0 = L9.FLOW.R0kpc, cache = new Map();
  const omegaOf = (xKpc, st, tag = '') => { const k = JSON.stringify([xKpc, st.terms, tag]);   // tag: R_cut の行の (A) は R_cut ごとに求積をやり直す(写しを使い回さない —— 門のビットを本物に)
    if (!cache.has(k)) cache.set(k, F.toFrame(Fr, F.sample(xKpc, 0, st, { rel: Pg.rel }).halfCurl)); return cache.get(k); };
  const full = F.fullState(), out = { kinds: {}, rcut: [], canon: [] };
  // 併合の正準化: (A) の銀河のグループの宣言が R_cut に依らず fullState() と同じ(項の key を除く)
  for (const rc of Pg.rCut) { const g = K.groupStatesOf(F.splitState(rc), [{ key: 'galaxyWhole', terms: ['center', 'residual'] }], F.MODEL_ID)[0].state;
    out.canon.push({ rCutKpc: rc, sameAsFull: JSON.stringify(g.terms[0].owns) === JSON.stringify(full.terms[0].owns.map((q) => ({ comp: q.comp, lo: q.lo, hi: q.hi }))) && g.terms[0].coef === 1 }); }
  for (const kind of Pg.kinds) {
    const st = stateOf(E, copyBook(HP, 'solar16', { hold: { mode: 'maintain' }, sm: A20.sourceMomentOf(kind) }));
    if (!st.ok) throw new Error('🗺️ の写しが受理されない: ' + st.err);
    const S = st.S, U = A20.unitsOf(st.preset.scaleExp), n = S.n, rows = [];
    for (const i of Pg.rows) {
      const d = [S.x[i] - S.x[0], S.y[i] - S.y[0], S.z[i] - S.z[0]].map((q) => q * U.len), xKpc = F.add3([R0, 0, 0], F.scl3(F.fromEcl(Fr, d), 1 / F.KPC));
      const r = st.isq.receivers.find((q) => q.i === i), osrc = r.omegaSrc, w = (j) => [osrc[j * 4], osrc[j * 4 + 1], osrc[j * 4 + 2]].map((q) => q * U.W);
      const I = 0.5 * S.m[i] * U.mass * Math.pow(S.R[i] * U.len, 2), s0 = S.spin[i] * U.W, a = [S.sax[i], S.say[i], S.saz[i]];
      const sats = [], others = []; for (let j = 0; j < n; j++) { if (j === i || j === 0) continue; (L9.SAT_PARENT[j] === i ? sats : others).push(j); }
      const bodyG = [{ key: 'sun', omega: w(0) }].concat(sats.map((j) => ({ key: 'sat:' + L9.BODY16[j], omega: w(j) })), others.map((j) => ({ key: 'body:' + L9.BODY16[j], omega: w(j) })));
      const galG = (col, rc, tag) => { const gd = groupDeclsOf(rc)[col]; return K.groupStatesOf(gd.st, gd.groups, F.MODEL_ID).map((g) => ({ key: 'gal:' + g.key, omega: omegaOf(xKpc, g.state, tag) })); };
      const heat = (gs) => K.groupHeatOf(F.antagOf, E.cell, I, s0, a, gs), cols = {};
      for (const col of ['A', 'B', 'B2', 'Bdh']) { const gg = galG(col, Pg.rCutMain), all = heat(bodyG.concat(gg)), gal = heat(gg);
        cols[col] = { source: all.source, composite: all.composite, diff: all.diff, galSource: gal.source, galComposite: gal.composite, galDiff: gal.diff, gal: gg.map((g, k) => ({ key: g.key, heat: gal.perGroup[k].heat })), nGroups: all.n }; }
      const bodies = heat(bodyG), satHeat = sats.reduce((s, j) => s + heat([{ key: 'x', omega: w(j) }]).source, 0), sunHeat = heat([bodyG[0]]).source, othersHeat = others.reduce((s, j) => s + heat([{ key: 'x', omega: w(j) }]).source, 0);
      // R_cut の行: (A) 併合(門 —— ビット)・ω を足してから熱(部の和 —— 丸め)・(C) 部ごとの熱(第321便c の型 —— R_cut で動く)
      const rcRows = Pg.rCut.map((rc) => {
        const gA = galG('A', rc, 'rc' + rc), allA = heat(bodyG.concat(gA)), gC = galG('C', rc), sumW = gC.reduce((s, g) => F.add3(s, g.omega), [0, 0, 0]), allS = heat(bodyG.concat([{ key: 'gal:sum', omega: sumW }])), allC = heat(bodyG.concat(gC)), galC = heat(gC);
        return { rCutKpc: rc, A: { source: allA.source, composite: allA.composite, diff: allA.diff }, sum: { source: allS.source, composite: allS.composite, diff: allS.diff, omegaRel: F.relDiff(F.nrm(sumW), F.nrm(gA[0].omega)) },
          C: { source: allC.source, composite: allC.composite, diff: allC.diff, galSource: galC.source, galDiff: galC.diff } };
      });
      const m = rcRows.find((q) => q.rCutKpc === Pg.rCutMain);
      rows.push({ i, name: L9.BODY16[i], xKpc, sats: sats.map((j) => L9.BODY16[j]), nBodies: bodyG.length, cols, bodies: { source: bodies.source, composite: bodies.composite, diff: bodies.diff }, sunHeat, satHeat, othersHeat,
        rcRows, rcutBitsA: rcRows.every((q) => Object.is(q.A.source, m.A.source) && Object.is(q.A.composite, m.A.composite) && Object.is(q.A.diff, m.A.diff)),
        aEqualsBdh: Object.is(cols.A.source, cols.Bdh.source) && Object.is(cols.A.composite, cols.Bdh.composite), signedA: Object.is(cols.A.diff, cols.A.source - cols.A.composite) });
    }
    out.kinds[kind] = { rows, warnings: st.warnings, nEval: cache.size };
  }
  return out;
}

/* ───────── D AN503 の診断の写しの器の設計(宣言だけ —— 走らせるのは次便)───────── */
export const DESIGN_AN503 = Object.freeze([
  Object.freeze({ k: '入力', v: '在位の ngc3198DFM の宣言(バリオンの入力 —— 円盤・ガス・中心核・seed・N)を器の写しへ(新しい ID・内蔵しない)。旧の判定(behavior.ngc3198 —— 未達)は上書きしない' }),
  Object.freeze({ k: '対照の列', v: '(a) 在位の ngc3198DFM そのもの(第321便c の G0 の値)・(b) 同じバリオン入力を galaxyGeo2 の法則(v−u 則・kFrame 1・λ_PN 0・frameWeight share)にした写し・(c) 同じ入力に規定の外部場を輸送で入れた写し(状態の v は ẋ・k_F = 1・ドリフトに u を足さない)' }),
  Object.freeze({ k: '場', v: '源の質量流は同じバリオン入力の分解から u を直接作る(半渦度は同じ u から派生の診断 —— 1 値から u を作らない)。模型の名は NGC 3198 の宣言の新しい名(mw319b-tanh は天の川銀河の模型 —— 流用しない)' }),
  Object.freeze({ k: '半径帯', v: '選択に使わない帯(内側・外縁)を走行の前に器の PLAN に凍結(本の単位 —— 結果を見て動かさない)' }),
  Object.freeze({ k: '量', v: '外縁の vt(中心核相対)・最遠・中心核の変位・帯ごとの vt(R)・場の仕事とトルクの供給の台帳・NaN とクランプ・刻みの感度(h と h/2)' }),
  Object.freeze({ k: '計算費', v: '場の API の 1 点は求積で ~0.2 s —— 步ごとの直の評価はしない。R × z の表(双三次の補間)を走行の前に作り、補間の誤差を表の欄に(表の格子の感度)・1 步の所要を (a)(b)(c) で並べる' }),
  Object.freeze({ k: '書かない', v: '旧の判定の上書き・回転曲線の予言(観測の流れを入力すれば予言ではない)・未達の解消' }),
  Object.freeze({ k: '段', v: '次便(策定の段 S3)に走らせる —— 本便は設計の宣言だけ' }) ]);

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {}, Kp = J.K, Gp = J.G, q = !!J.quick;
  const nz = Kp ? Kp.rows.filter((r) => r.key !== 'zero') : [];
  G.kcEqualsP = !!(Kp && Kp.rows.every((r) => r.errKc <= 1e-8));
  G.kOrder = !!(Kp && Kp.rows.every((r) => r.orderK.every((o) => o >= 0.85 && o <= 1.15)));
  G.plAndADiffer = !!(Kp && nz.length && nz.every((r) => r.u0Abs > 0 && r.errPl >= 1e-2 && r.errA >= 1e-2) && Kp.rows.filter((r) => r.key === 'zero').every((r) => r.errPl === 0 && r.errA === 0));
  G.pStationary = !!(Kp && Kp.rows.filter((r) => r.stationary).every((r) => { const l = r.ledger.P; return Math.abs(l.dH) <= 1e-10 && Math.abs(l.dEN - l.du2half) <= 1e-10 && Math.abs(l.closeE) <= 1e-10; }));
  G.pAxisym = !!(Kp && Kp.rows.filter((r) => r.axisym).every((r) => { const l = r.ledger.P; return Math.abs(l.dLcanZ) <= 1e-10 && Math.abs(l.tauZ - l.dxuZ) <= 1e-10 && Math.abs(l.dLz - l.tauZ) <= 1e-10; }));
  G.pUnsteady = !!(Kp && Kp.rows.filter((r) => !r.stationary).every((r) => Math.abs(r.ledger.P.closeH) <= 1e-9 && r.ledger.P.pdudt !== 0));
  G.bits = !!(Kp && Kp.bits.zeroVsPlain && Kp.bits.uniformVsZero);
  G.rigidAnalytic = !!(Kp && Kp.rigidAnalyticErr <= 1e-9);
  G.nullRejected = !!(Kp && Kp.nullRej.length === 3 && Kp.nullRej.every((r) => r.result === 'rejected'));
  G.kfLoop = !!(Kp && Kp.kRows.every((r) => (r.key === 'steady' ? Math.abs(r.loopLine) >= 1e-2 * r.loopScale && Math.abs(r.loopLine - r.loopArea) <= 1e-6 * Math.abs(r.loopLine) : Math.abs(r.loopLine) <= 1e-12 * r.loopScale)
    && r.orderK.every((o) => o >= 0.85 && o <= 1.15)));
  const gr = Gp && Gp.kinds ? Object.values(Gp.kinds).flatMap((k) => k.rows) : [];
  G.gCanon = !!(Gp && Gp.canon.length && Gp.canon.every((c) => c.sameAsFull));
  G.gRcutBits = !!(gr.length && gr.every((r) => r.rcutBitsA));
  G.gSigned = !!(gr.length && gr.every((r) => r.signedA));
  G.gBdh = !!(gr.length && gr.every((r) => r.aEqualsBdh));
  G.gKinds = !!(Gp && Gp.kinds && Gp.kinds.J && (q || Gp.kinds.capObs));
  return G;
}

/* ───────── 実行(部を子プロセスで)───────── */
const PARTS = Object.freeze(['G', 'K']);   // 長い部を先に
let HP_ONCE = null;   // loadHtmlMain は 1 プロセスに 1 回だけ
export function runPart(name, plan, html) {
  const t0 = Date.now(); let r;
  if (name === 'K') r = partK(plan);
  else if (name === 'G') r = partG(HP_ONCE || (HP_ONCE = loadHtmlMain(html).HP), plan);
  else throw new Error('未知の部: ' + name);
  return { name, r, wallSec: (Date.now() - t0) / 1000 };
}
function spawnPart(name, quick, html) {
  return new Promise((resolve, reject) => {
    const env = Object.assign({}, process.env, { W322C_PART: name, W322C_QUICK: quick ? '1' : '0', W322C_TARGET: html });
    const cp = spawn(process.execPath, [fileURLToPath(import.meta.url)], { env, stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = ''; cp.stdout.on('data', (d) => { buf += d; });
    cp.on('close', (code) => { if (code !== 0) return reject(new Error('部 ' + name + ' が失敗(' + code + ')')); const m = buf.lastIndexOf('\n@@W322C@@'); try { resolve(JSON.parse(buf.slice(m + 10))); } catch (e) { reject(new Error('部 ' + name + ' の出力が読めない')); } });
  });
}
export async function runFieldContract(o) {
  const plan = o.plan, workers = o.workers, res = {}, queue = PARTS.slice();
  if (workers <= 1) for (const p of queue) res[p] = runPart(p, plan, o.html);
  else await Promise.all(Array.from({ length: Math.min(workers, queue.length) }, async () => { while (queue.length) { const p = queue.shift(); res[p] = await spawnPart(p, o.quick, o.html); } }));
  const J = { stage: 'fieldcontract', quick: !!o.quick, plan: clone(plan), libVersion: K.LIB_VERSION, contractDraftVersion: K.CONTRACT_DRAFT_VERSION, fieldVersion: F.FIELD_VERSION, fieldLibVersion: F.LIB_VERSION, model: F.MODEL_ID, timing: {} };
  J.K = res.K.r; J.G = res.G.r; J.design503 = clone(DESIGN_AN503);
  for (const p of PARTS) J.timing[p] = { wallSec: res[p].wallSec };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  return J;
}
export async function main() {
  const TARGET = process.env.W322C_TARGET || 'beta/index.html', quick = process.env.W322C_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  if (process.env.W322C_PART) { const r = runPart(process.env.W322C_PART, quick ? QUICK : PLAN, html); process.stdout.write('\n@@W322C@@' + JSON.stringify(r)); return; }
  const OUT = process.env.W322C_OUT ? (path.isAbsolute(process.env.W322C_OUT) ? process.env.W322C_OUT : path.join(ROOT, process.env.W322C_OUT)) : path.join(ROOT, OUT_FIELDCONTRACT);
  if (quick && !process.env.W322C_OUT) throw new Error('試走(W322C_QUICK=1)は W322C_OUT を指定する(正本を書かない)');
  const workers = Math.max(1, Math.min(2, Number(process.env.W322C_WORKERS || 2) || 2));
  const t0 = Date.now(), targetSha256 = sha(fs.readFileSync(html));
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  console.log('第322便c fieldcontract: ' + (quick ? '試走' : '正本') + '・子プロセス ' + workers);
  const R = await runFieldContract({ quick, plan: quick ? QUICK : PLAN, workers, html });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w322c-fieldcontract.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '決断事項 AN501・AN503・AN506・AN511・AN512・統括の検証項目 R272(策定の段 S2 の geoPN=4 の場の契約)。エンジン・在位の本・`S._core` は変えない(器・lib・正本・文書だけ)。外部場の輸送はエンジンに入れていない',
    workers, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w322c-fieldcontract.mjs', 'tests/lib-w322c-fieldcontract.mjs', 'tests/lib-w321a-geo2v3.mjs', 'tests/lib-w321c-galfield.mjs', 'tests/lib-w320c-nbcompose.mjs', 'tests/lib-w319b-srcradius.mjs',
    'tests/lib-w320a-srcheat.mjs', 'tests/exp-w320a-srcheat.mjs', 'tests/lib-w319a-axisheat.mjs', 'tests/lib-w318d-dragest.mjs', 'tests/lib-w317c-satcut.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第322便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'fieldcontract',
    engine: 'Node(部 K は純関数 —— html を読まない・部 G は tests/lib-w280b-emgrid.mjs の loadHtmlMain で html の本文をそのまま実行・子プロセス ' + workers + ' 本で部を分ける)',
    literature: ['天の川銀河の質量の模型の入力(第319便b の MW —— 文献の模型の入力の転記・本便は一次資料に当たっていない)', '慣性モーメントの係数 f(第320便a の MOI16 —— 文献の値・本便は一次資料に当たっていない)'],
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

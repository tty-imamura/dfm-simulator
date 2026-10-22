// 第313便d(原仮定者の裁定(第115報)AN399「K1 を採用する」・AN402「太陽を含む全天体に同じ規則 R_d = κm(R_d は重力半径に比例する長さ)」・補足「1.00021 などの小さい係数は
// 背景宇宙由来か太陽の構造由来かなどを候補とする」「6.5e6 m は K2 で未宣言時の上限 —— K1 では無視」・決断事項 AN401〔比例定数は 1PN だけ・A1 は暦表ごとの列〕・
// AN405〔有限質量比の既知の寄与〕・AN396′〔ε_fit = 1e-3″/世紀・ε_num = 3e-4″/世紀〕・AN336・統括の検証項目 R237):
// **K1 の確認の系の正本(h/4 まで)と小さい係数の分解の表**(確認の材料 —— 合わせない・確認と探索の値を在位へ入れない・在位の宣言は変えない)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState をそのまま呼ぶ)。走行は子プロセス(W313D_WORKERS —— 既定 2)。走行の 1 本は探索の器 v3(tests/exp-w311d-planet3.mjs の runSpec —— 3 惑星)と
// 確認の器 v2(tests/exp-w312d-confirm.mjs の runSpec —— 🏀・🌦️)をそのまま使う。純関数は tests/lib-w311d-planet3.mjs(κ₀・写し・採用の欄・区間)と
// tests/lib-w312d-confirm.mjs(標的の列・有限質量比・G の値・分解の行・候補の感度の並び)。
//
// ■ 写し(器の中で組む —— 在位の本の宣言は変えない)
//   🌡️🌋🔴 の第306便a の世代の凍結の写し・🏀 jupiterSunInertial3d の同じ世代の写し・🌦️ earthMoonSunInertial3d の三体(基点 c98db78 の凍結の写し —— 太陽 pinned)。
//   引きずりの走行(q01・q11)は新則(〔第311便d〕の NEW_DRAG)+ **K1**(invSq.kernel:"k1")+ **全天体の規則**: 太陽を含む全天体に写しの明示の dragCore
//   {massFrac: 1, radius: 10 G m/(C₁ c²)}(本の単位 —— κ₀ = 10G/(C₁c²) は本の G・c と C₁ = 6[(√3/2)ln(2+√3) − 1] の閉じた式で固定・合わせない・上書きの鍵なし)。
//   枝 a の鍵 rdRule:"kappaM" と同値の写し(統合の後に統括が継ぎ目で比べる)。🌦️ の太陽は pinned(受け手でない —— 源としてだけ効く)。
//   q00・q10 は引きずりなし(q10 は在位の G_loc の固定の宣言 {law:"kappaC2"})。G_loc の k・n・λ・GM・初期要素は在位のまま。
//
// ■ 段(正本 tests/out/k1confirm-w313d.json —— 段 k1confirm-313d)。W313D_PARTS=P,T,E,K,R,D,M で選ぶ(正本は全段)・W313D_OUT で出力先・W313D_QUICK=1 で縮める
//   P t = 0 の写しの宣言の印字(本の ID・天体ごとの m・R・宣言の R_d・エンジンが使う R_d と m_d・β の行列)と κ₀ の閉じた式
//   T 標的の列(q_1PN・A1 の暦表ごとの列〔EPM2011・INPOP10a —— 符号を反転しない・幅の種類を統合しない〕・η・有限質量比の予測 (4/3)η q_1PN・G の値の列)
//   E 走行: 3 惑星 q00・q10・q11(κ₀)× h・h/2・h/4 と根の細分(h/4 で κ を割線で ε_fit まで —— 候補の点は h・h/2・h/4)・🏀 q00・q10・q01・q11 × h・h/2・h/4・
//     🌦️ q00・q10・q11 × h・h/2(月 118 公転の窓)
//   K κ₀ での残差の表(r_1PN = q11 − q00 − q_1PN・暦表ごとの r_{1PN+A1}・D_G・交差 —— 刻みごと)
//   R 3 惑星の根の κ_i/κ₀(h/4 の割線 —— 細分を ε_fit まで・粗い門で止めない)・採用の欄(AN396 —— 候補の点そのもの・cap なし)・A1 を含む根の換算(実測の傾き)
//   D 小さい係数の分解の表(系ごと: r_1PN(κ₀)→ 有限質量比の予測を引く → G の値の効き〔感度 —— 引かない〕→ 数値の帯 → 残り)・候補の感度の並び(軌道半径の順)・
//     根の κ_i の最大/最小(A1 を除く・除かない)
//   M 🌦️ の月の診断(引きずりの有無の差 —— 恒星月・近地点・交点)・所要と 2 段目の費用の見積り(🌦️ の h/4・月の長い窓 354 公転)
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「R_d を決めた」「シュヴァルツシルト半径そのもの」。ε_fit の内なら
//   「規則で置いた残差が数値の門の内」と書く。数値の門は観測の 3σ ではない。h と h/2(と h/4)は刻みの感度診断。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as C from './lib-w312d-confirm.mjs';
import * as PL3 from './exp-w311d-planet3.mjs';
import * as CF from './exp-w312d-confirm.mjs';
import * as EMX from './exp-w303c-earthmoon.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 ∪ 確認の器の宣言 —— tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inertialDragNormApply","pnSource","relDragCoefficientOf","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w313d-k1confirm-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', 'R_d を決めた', 'シュヴァルツシルト半径そのもの'];
export const OUT_MAIN = 'tests/out/k1confirm-w313d.json';
export const AN336_OUT = 'tests/out/an336-w306a.json';
export const PARTS_ALL = Object.freeze(['P', 'T', 'E', 'K', 'R', 'D', 'M']);
/** 決断事項 AN396′ の ε(探索の器 v3 の宣言をそのまま) */
export const EPS = PL3.ADOPT_EPS;
/** C₁ の参照の値(第312便a の参照の lib の 0.843114 —— 閉じた式との照合の門) */
export const C1_REF = 0.8431139667;
export const KAPPA0_REF = 8.80761886e-27;   // 本の G = 6.674・c = 2.99792458e8 の κ₀ [m/kg](DECISIONS の閉じた項 —— 照合の門)
/** 系(軌道の半直弦の順 —— 分解の表の並び)。via: 走行の器(planet3 = 探索の器 v3・confirm = 確認の器 v2) */
export const SYSTEMS = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', ja: '水星', via: 'planet3' }),
  Object.freeze({ key: 'venus', id: 'venusSunInertial3d', emoji: '🌋', ja: '金星', via: 'planet3' }),
  Object.freeze({ key: 'earthmoon', id: 'earthMoonSunInertial3d', emoji: '🌦️', ja: '太陽と地球と月(EMB)', via: 'confirm' }),
  Object.freeze({ key: 'mars', id: 'marsSunInertial3d', emoji: '🔴', ja: '火星', via: 'planet3' }),
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '木星', via: 'confirm' })]);
export const sysOf = (k) => SYSTEMS.find((s) => s.key === k) || null;
export const PLANET_KEYS = Object.freeze(['mercury', 'venus', 'mars']);
/** 枝のうちの計画(正本) */
export const BRANCH_PLAN = Object.freeze({ N: 8, divs: Object.freeze([1, 2, 4]), jupiterKinds: Object.freeze(['q00', 'q10', 'q01', 'q11']),
  em: Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), divs: Object.freeze([1, 2]), nMoon: 118, nEarth: 8 }), root: Object.freeze({ maxIt: 3, minStep: 2e-5 }) });
export const QUICK_PLAN = Object.freeze({ N: 2, divs: Object.freeze([1, 2]), jupiterKinds: Object.freeze(['q00', 'q10', 'q01', 'q11']),
  em: Object.freeze({ kinds: Object.freeze(['q00', 'q10', 'q11']), divs: Object.freeze([1]), nMoon: 16, nEarth: 1 }), root: Object.freeze({ maxIt: 1, minStep: 2e-5 }) });
/** 参照の小さい係数(前の便の記録 —— 位置づけの表だけに使う): 1.00021 = 第312便a のスクリーニング(一次の式・K1・1PN + A1 と ΔqG を含むそろいの最大/最小・太陽 cap)・
 *  1.000005 = 第312便の 2 段目(統合の後の統括の診断 —— 正本の外・太陽も κM☉・1PN だけの 3 惑星の κ の最大/最小) */
export const REF_SPREADS = Object.freeze([
  Object.freeze({ value: 1.00021, src: '第312便a のスクリーニング(一次の式 —— K1 の列・標的 1PN + A1 と ΔqG を含む・太陽の R_d は cap)' }),
  Object.freeze({ value: 1.000005, src: '第312便の 2 段目(統合の後の統括の診断・正本の外 —— 太陽も κM☉・1PN だけ・h)' })]);

/* ───────── 写し ───────── */
export const baseOf = (HP, key) => (sysOf(key).via === 'planet3' ? Q.pinnedBook(HP, PL3.PIN, sysOf(key).id) : CF.baseOf(HP, key));
/** 走行の spec(planet3: {planet, kind, theta, div, N}・confirm: {system, kind, Rd:{rule}, ruleKey, kernel, div, N, nEarth})—— via を付けて子プロセスへ */
export function specOf(HP, key, kind, div, N, o = {}) {
  const s = sysOf(key), drag = Q.KINDS[kind].drag;
  if (s.via === 'planet3') {
    const th = drag ? Q.withKernel(Q.thetaOfKf(PL3.pinOf(key), o.kf === undefined ? 1 : o.kf), 'k1') : undefined;
    return Object.assign({ via: 'planet3', planet: key, kind, div, N }, th ? { theta: th } : {});
  }
  return Object.assign({ via: 'confirm', system: key, kind, div, N, ruleKey: 'kappa0', kernel: 'k1' }, drag ? { Rd: { rule: 'kappa0' } } : {}, key === 'earthmoon' ? { nEarth: o.nEarth } : {});
}
export const keyOf = (sp) => sp.via + ':' + (sp.via === 'planet3' ? PL3.specKey(sp) : CF.specKey(sp));
export function runSpec(HP, sp) {
  const r = sp.via === 'planet3' ? PL3.runSpec(HP, sp) : CF.runSpec(HP, sp);
  return Object.assign({}, r, { key: keyOf(sp), spec: sp });
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(keyOf(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(keyOf(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}

/* ───────── 段 P(t = 0 の写しの宣言の印字)───────── */
const BODY_NAMES = { planet: ['太陽', '惑星'], jupiter: ['太陽', '木星'], earthmoon: ['太陽', '地球', '月'] };
export function probeOf(HP) {
  const out = { C1: Q.C1_CLOSED, C1Ref: C1_REF, systems: {} };
  for (const s of SYSTEMS) {
    const base = baseOf(HP, s.key), sp = specOf(HP, s.key, 'q11', 1, 1, {});
    const q = sp.via === 'planet3' ? Q.bookOf(base, 'q11', sp.theta) : CF.bookOf(base, s.key, 'q11', sp.Rd, 'k1');
    const v = HP.validatePreset(clone(q));
    if (!v.ok) { out.systems[s.key] = { id: s.id, err: JSON.stringify(v.errors).slice(0, 300) }; continue; }
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    const st = HP.inertialDragIsqState(S), L = Math.pow(10, q.scaleExp.L), M = Math.pow(10, q.scaleExp.M), names = BODY_NAMES[s.via === 'planet3' ? 'planet' : s.key];
    const bodies = q.bodies.map((b, i) => { const rc = (st.receivers || []).find((z) => z.i === i);
      return { name: names[i], m: b.m * M, R: b.radius * L, RdDecl: b.dragCore ? b.dragCore.radius * L : null, RdRule: Q.rdBookKappa0(q, b.m) * L, massFrac: b.dragCore ? b.dragCore.massFrac : null,
        pinned: !!b.pinned, receiver: !!rc, RdEngine: rc ? rc.Rd * L : null, mdEngine: rc ? rc.md * M : null, beta: rc ? rc.beta.slice() : null }; });
    out.systems[s.key] = { id: s.id, scaleExp: clone(q.scaleExp), G: q.physics.G, cLight: q.physics.cLight, kappa0: Q.kappa0SI(q), kernel: v.preset.physics.relativeDrag.invSq.kernel || null,
      bodies, betaMax: st.betaMax };
  }
  return out;
}

/* ───────── 段 T(標的の列)───────── */
export function targetsOf(HP) {
  const recs = AN.readRecords(ROOT), out = {};
  let live = null; try { live = JSON.parse(fs.readFileSync(path.join(ROOT, AN336_OUT), 'utf8')).transfer.table; } catch (e) { live = null; }
  for (const s of SYSTEMS) {
    const base = baseOf(HP, s.key), view = s.key === 'earthmoon' ? C.embView(base) : base, pn = AN.pn1Of(view), U = C.siOf(view), M = U.B[0].m, m = U.B[1].m;
    const a1 = C.a1Columns(recs, s.key), q1pn = pn.value, L = live && s.key !== 'earthmoon' ? live.find((z) => z.id === s.id) : null;
    const P = C.bodyProps(s.via === 'planet3' ? 'jupiter' : s.key, base);   // 半直弦(🏀 と惑星は 2 体の式 —— 惑星の写しも同じ形)
    const p = s.key === 'earthmoon' ? P.earth.p.sun : P.jupiter.p.sun;
    out[s.key] = { id: s.id, q1pn, a: pn.a, e: pn.e, p, M, m, eta: C.etaOf(M, m), fm: C.finiteMassPred(q1pn, M, m), a1, G: base.physics.G,
      gLocAnalytic: Q.gLocAnalytic(view, 2), an336: L ? { value: L.target.value, pn1: L.target.pn1, a1: L.target.a1, recordId: L.target.recordId } : null };
  }
  return out;
}

/* ───────── 段 K・R・D・M(E の行から —— 純関数 —— QA が作り直す)───────── */
const rowOf = (J, sp) => { const r = J.E.rows[keyOf(sp)]; return r && r.status === 'run' ? r : null; };
const qVal = (r, key) => { if (!r) return undefined; const s = sysOf(key); return s.via === 'planet3' ? r.apsNew : (key === 'jupiter' ? r.apsNew : r.emb); };
/** 系の刻みごとの q の組(kf は 3 惑星の候補 —— 既定は κ₀) */
export function qsOf(J, key, div, kf) {
  const N = key === 'earthmoon' ? J.E.N.earthmoon : J.E.N.main, ne = { nEarth: J.E.nEarth };
  const g = (kind) => qVal(rowOf(J, specOf(null, key, kind, div, N, Object.assign({ kf }, ne))), key);
  return { q00: g('q00'), q10: g('q10'), q01: g('q01'), q11: g('q11') };
}
export const divsOf = (J, key) => (key === 'earthmoon' ? J.E.divs.earthmoon : J.E.divs.main);
export function partK(J) {
  const out = { systems: {} };
  for (const s of SYSTEMS) {
    const T = J.T.systems[s.key], o = { byDiv: {} };
    for (const d of divsOf(J, s.key)) { const q = qsOf(J, s.key, d, 1); if (![q.q00, q.q10, q.q11].every(Number.isFinite)) continue; o.byDiv[d] = Object.assign({ q }, C.residualCols(q, T.q1pn, T.a1)); }
    const ds = Object.keys(o.byDiv).map(Number).sort((a, b) => a - b);
    o.fine = ds.length ? ds[ds.length - 1] : null;
    o.bands = {}; for (let i = 1; i < ds.length; i++) o.bands[ds[i - 1] + '-' + ds[i]] = Math.abs(o.byDiv[ds[i]].r1pn - o.byDiv[ds[i - 1]].r1pn);
    if (o.fine !== null) { const b = o.byDiv[o.fine]; o.r1pn = b.r1pn; o.DG = b.DG; o.rOverQ = b.r1pn / T.q1pn; o.withinFit = Math.abs(b.r1pn) <= EPS.fit; }
    out.systems[s.key] = o;
  }
  return out;
}
/** 3 惑星の根(最も細かい刻みの κ の点の列 → 区間・割線・候補・採用の欄・A1 を含む根の換算) */
export function partR(J) {
  const out = { planets: {}, eps: { fit: EPS.fit, num: EPS.num, unit: EPS.unit } };
  for (const key of PLANET_KEYS) {
    const T = J.T.systems[key], ds = divsOf(J, key), f = ds[ds.length - 1], pb = PL3.pinOf(key), Rm = PL3.radiusOfPlanet(key);
    const kfs = [...new Set(Object.values(J.E.rows).filter((r) => r.spec.via === 'planet3' && r.spec.planet === key && r.spec.kind === 'q11' && r.spec.theta && r.spec.theta.kf !== undefined).map((r) => r.spec.theta.kf))].sort((a, b) => a - b);
    const pts = [];
    for (const kf of kfs) { const rBy = {};
      for (const d of ds) { const q = qsOf(J, key, d, kf); if ([q.q00, q.q11].every(Number.isFinite)) rBy[d] = q.q11 - q.q00 - T.q1pn; }
      pts.push({ kf, rd: Q.rdOfKf(pb, kf), RdM: Q.rdOfKf(pb, kf) * Rm, rByDiv: rBy, r: Number.isFinite(rBy[f]) ? rBy[f] : null }); }
    const line = pts.filter((z) => Number.isFinite(z.r)), B = Q.bracketsOf(line.map((z) => ({ rd: z.rd, r: z.r })));
    const o = { fine: f, points: pts, bracket: { kind: B.kind, n: B.n } };
    if (B.kind === 'one') { const { lo, hi } = B.brackets[0]; o.bracket.lo = lo.rd; o.bracket.hi = hi.rd; o.bracket.kfLo = Q.kfOfRd(pb, lo.rd); o.bracket.kfHi = Q.kfOfRd(pb, hi.rd);
      o.slope = lo === hi ? null : (hi.r - lo.r) / (Q.kfOfRd(pb, hi.rd) - Q.kfOfRd(pb, lo.rd)); }
    // 候補: 細分の記録の最後の点(無ければ abs(r) の最小の点)
    const tr = (J.refine && J.refine[key]) || [], last = tr.length ? pts.find((z) => z.kf === tr[tr.length - 1].kf) : null;
    const c = last || line.slice().sort((a, b) => Math.abs(a.r) - Math.abs(b.r))[0] || null;
    if (c) {
      const runs = Object.values(J.E.rows).filter((r) => r.spec.via === 'planet3' && r.spec.planet === key && r.spec.kind === 'q11' && r.spec.theta && r.spec.theta.kf === c.kf)
        .map((r) => ({ div: r.spec.div, status: r.status, nan: r.status === 'run' ? r.nan : null, betaMax: r.status === 'run' ? r.betaMax : null }));
      // 採用の欄(AN396 —— 候補の点そのもの・cap なし)。量子化: 刻みが h・h/2・h/4 でなければ(試走)rByDiv を 1/2/4 の口へ写さない
      const rBy = {}; if (JSON.stringify(ds) === JSON.stringify([1, 2, 4])) for (const d of ds) if (Number.isFinite(c.rByDiv[d])) rBy[d] = c.rByDiv[d];
      o.candidate = { kf: c.kf, rd: c.rd, RdM: c.RdM, rByDiv: c.rByDiv, how: last ? '細分の最後の点' : 'abs(r) の最小の点' };
      o.adopt = Q.adoptOf({ theta: Q.thetaOf({ rd: c.rd }), rByDiv: rBy, R: Rm, runs }, { kind: B.kind, lo: o.bracket.lo, hi: o.bracket.hi }, EPS);
      o.kappa = c.kf * Q.kappa0SI(pb);   // 根の κ_i [m/kg](= kf·κ₀)
      // A1 を含む標的の根(実測の傾きの線形の換算 —— 走らせていない): r_A1(kf) = r_1PN(kf) − A1 → kf_A1 = kf_c − (r_c − A1)/slope
      o.kfA1 = {}; for (const [k, v] of Object.entries(T.a1)) o.kfA1[k] = (Number.isFinite(o.slope) && Number.isFinite(c.r) && v && Number.isFinite(v.value)) ? c.kf - (c.r - v.value) / o.slope : null;
      o.kf1pnLin = (Number.isFinite(o.slope) && Number.isFinite(c.r)) ? c.kf - c.r / o.slope : null;   // 候補の点からの 1PN の根の線形の換算(候補の残りの大きさの目安)
    }
    out.planets[key] = o;
  }
  const v = (f) => PLANET_KEYS.map((k) => (out.planets[k] && out.planets[k].candidate ? f(out.planets[k]) : null));
  out.spread = { pn1: C.spreadOf(v((o) => o.candidate.kf)), EPM2011: C.spreadOf(v((o) => o.kfA1.EPM2011)), INPOP10a: C.spreadOf(v((o) => o.kfA1.INPOP10a)),
    meanKf: (() => { const x = v((o) => o.candidate.kf).filter(Number.isFinite); return x.length ? x.reduce((s, y) => s + y, 0) / x.length : null; })() };
  out.refSpreads = REF_SPREADS.map((z) => Object.assign({}, z));
  return out;
}
/** 小さい係数の分解の表(系ごと —— 軌道の半直弦の順)と候補の感度の並び */
export function partD(J) {
  const rows = [];
  for (const s of SYSTEMS) {
    const T = J.T.systems[s.key], K = J.K.systems[s.key]; if (!K || K.fine === null) continue;
    const r1 = {}; for (const [d, b] of Object.entries(K.byDiv)) r1[d] = b.r1pn;
    const g = C.gColumn(T.G, K.DG), dr = C.decompRow({ r1pnByDiv: r1, DG: K.DG, q1pn: T.q1pn, fm: T.fm, g, divs: Object.keys(K.byDiv).map(Number) });
    const rA1 = {}; for (const [k, v] of Object.entries(K.byDiv[K.fine].rA1)) rA1[k] = Number.isFinite(v) ? v - T.fm : null;
    rows.push(Object.assign({ key: s.key, p: T.p, q1pn: T.q1pn, eta: T.eta, g }, dr, { remA1: rA1, remWithinFit: Number.isFinite(dr.rem) ? Math.abs(dr.rem) <= EPS.fit : null,
      kfRoot: J.R && J.R.planets[s.key] && J.R.planets[s.key].candidate ? J.R.planets[s.key].candidate.kf : null }));
  }
  return { rows, shapes: C.candidateShapes(rows.map((z) => ({ key: z.key, p: z.p }))), shapeDefs: C.CANDIDATE_SHAPES.map((c) => Object.assign({}, c)),
    note: '並べるだけ(合わせない・候補を決めない)。G の値の効きは感度(本の G と質量は同じ GM を与えるので規則の R_d は G の値に依らない —— 引かない)' };
}
/** 確認の器の形の見方(🏀・🌦️ の行を確認の器の鍵で —— moonOf・confirmOf・costOf を使い回す) */
export function confirmView(J) {
  const rows = {};
  for (const r of Object.values(J.E.rows)) if (r.spec.via === 'confirm') rows[CF.specKey(r.spec)] = Object.assign({}, r, { key: CF.specKey(r.spec) });
  return { E: { rows, N: { jupiter: J.E.N.main, earthmoon: J.E.N.earthmoon }, nEarth: J.E.nEarth, divs: { jupiter: J.E.divs.main, earthmoon: J.E.divs.earthmoon } },
    T: { targets: { jupiter: { value: J.T.systems.jupiter.q1pn }, earthmoon: { value: J.T.systems.earthmoon.q1pn } } } };
}
export function partM(J) {
  const V = confirmView(J), moon = CF.moonOf(V, 'kappa0', 'k1'), cost = CF.costOf(V);
  const pr = {}, pl = Object.values(J.E.rows).filter((r) => r.spec.via === 'planet3' && r.status === 'run' && !r.reused);
  for (const r of pl) { const k = r.spec.planet + '|' + (Q.KINDS[r.spec.kind].drag ? 'drag' : 'nodrag') + '|h/' + r.spec.div; const w = pr[k] || (pr[k] = { n: 0, steps: 0, wallSec: 0 }); w.n++; w.steps += r.steps; w.wallSec += r.wallSec; }
  return { moon, cost, planetCost: pr, moonPinnedSun: true,
    note: '🌦️ の太陽は pinned(受け手でない —— 源としてだけ効く)。月の長い窓(354 公転)の走行は統合の後の統括の 2 段目(見積りだけ)' };
}

/* ───────── 門(器の健全さ)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.P) {
    g.kappa0Closed = Math.abs(J.P.C1 - C1_REF) <= 1e-10 && Object.values(J.P.systems).every((s) => Math.abs(s.kappa0 / KAPPA0_REF - 1) <= 1e-8);
    // 宣言の R_d は本の単位の κ₀m そのもの(相対 1e-12)・エンジンの R_d は宣言と相対 1e-6(エンジンの内部の表現 —— 差は段 P に記録)・受け手でない天体は pinned だけ
    g.ruleAllBodies = Object.values(J.P.systems).every((s) => !s.err && s.kernel === 'k1' && s.bodies.every((b) => Number.isFinite(b.RdDecl) && Math.abs(b.RdDecl / b.RdRule - 1) <= 1e-12 && b.massFrac === 1
      && (b.receiver ? Math.abs(b.RdEngine / b.RdDecl - 1) <= 1e-6 : b.pinned)));
  }
  if (J.T) g.targetsAn336 = PLANET_KEYS.concat(['jupiter']).every((k) => { const t = J.T.systems[k]; return t.an336 && t.an336.recordId === t.a1.EPM2011.recordId && t.an336.a1 === t.a1.EPM2011.value && Math.abs(t.an336.pn1 - t.q1pn) <= 1e-12 * Math.abs(t.q1pn); })
    && J.T.systems.jupiter.a1.INPOP10a.value === -0.041 && J.T.systems.jupiter.a1.EPM2011.value === 0.0587;
  if (J.E) {
    const run = Object.values(J.E.rows);
    g.runsComplete = run.filter((r) => r.status === 'run').every((r) => r.complete && !r.nan && (r.spec.via === 'planet3' || r.spec.system === 'jupiter'
      ? (Number.isFinite(r.detB) && Number.isFinite(r.apsNew) && r.nPeri >= r.spec.N - 1)
      : (Number.isFinite(r.emb) && Number.isFinite(r.earth) && r.moon && Number.isFinite(r.moon.sidH) && Number.isFinite(r.moon.T4p) && Number.isFinite(r.moon.node))));
    g.noRejected = run.every((r) => r.status === 'run');
  }
  if (J.R) g.rootSearched = PLANET_KEYS.every((k) => J.R.planets[k] && J.R.planets[k].points.filter((z) => Number.isFinite(z.r)).length >= 2 && J.R.planets[k].candidate);
  if (J.live) g.inPositionUnchanged = J.live.planets.every((z) => z.bodiesSame && z.scaleSame && z.timeRefSame && z.oldRule && z.noInvSq && z.noDragCore && z.gLoc && z.gLoc.law === 'kappaC2')
    && J.live.confirm.earthmoon === true && J.live.confirm.jupiter === true;
  return g;
}

/* ───────── 走行の計画と根の細分 ───────── */
export async function runAll(HP, o = {}) {
  const parts = o.parts || PARTS_ALL.slice(), P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { quick: !!o.quick, parts, kernel: 'k1', rule: 'kappa0', plan: clone(P) };
  J.live = { planets: PL3.liveDeclGate(HP), confirm: CF.liveSame(HP) };
  J.book = { newDrag: clone(Q.NEW_DRAG), offDrag: clone(Q.OFF_DRAG), gLoc: clone(Q.GLOC_FIXED), declFile: PL3.DECL_FILE, pinEM: CF.PIN_EM_BASE,
    rule: 'kappa0 —— 太陽を含む全天体に dragCore {massFrac: 1, radius: 10 G m/(C₁ c²)}(本の単位・K1)', extractor: { planets: 'apsNew', jupiter: 'apsNew', earthmoon: 'emb' } };
  if (parts.includes('P')) { J.P = probeOf(HP); tick('P'); }
  J.T = { systems: targetsOf(HP) }; tick('T');
  if (parts.includes('E')) {
    const rows = {}, N = P.N, ds = P.divs.slice(), f = ds[ds.length - 1], run = o.run, log = o.log || (() => {});
    const go = (sp, pri) => run(sp, pri).then((r) => { rows[r.key] = r; log(r); return r; });
    const jobs = [];
    // 🌦️(最も長い —— 先に)
    for (const d of P.em.divs.slice().reverse()) for (const kind of P.em.kinds) jobs.push(go(specOf(HP, 'earthmoon', kind, d, P.em.nMoon, { nEarth: P.em.nEarth }), (Q.KINDS[kind].drag ? 100 : 1) * d * 5));
    // 🏀
    for (const d of ds.slice().reverse()) for (const kind of P.jupiterKinds) jobs.push(go(specOf(HP, 'jupiter', kind, d, N), (Q.KINDS[kind].drag ? 100 : 1) * d));
    // 3 惑星: κ₀ の q11 × 全刻み・q00・q10 × 全刻み・根の細分(最も細かい刻み —— 鎖の先頭なので優先)
    J.refine = {};
    for (const key of PLANET_KEYS) {
      jobs.push((async () => {
        const T = J.T.systems[key], tr = []; J.refine[key] = tr;
        const base = ds.map((d) => Promise.all(['q00', 'q10'].map((k) => go(specOf(HP, key, k, d, N), 1000))));
        const k0 = ds.map((d) => go(specOf(HP, key, 'q11', d, N, { kf: 1 }), d === f ? 1000 : 100 * d));
        await base[ds.length - 1]; await k0[ds.length - 1];
        const r = (kf) => { const q = qsOf({ E: { rows, N: { main: N, earthmoon: P.em.nMoon }, nEarth: P.em.nEarth, divs: { main: ds } } }, key, f, kf); return q.q11 - q.q00 - T.q1pn; };
        const DG = (() => { const q = qsOf({ E: { rows, N: { main: N, earthmoon: P.em.nMoon }, nEarth: P.em.nEarth, divs: { main: ds } } }, key, f, 1); return q.q11 - q.q10; })();
        const pts = [{ kf: 1, r: r(1) }];
        tr.push({ it: 0, kf: 1, r: pts[0].r, how: 'κ₀(kf = 1)' });
        // 1 本目: 一次の見積り(D_G ∝ κ の惑星の分 —— δ = −r/D_G)の 2 倍へ(根を区間に挟む)
        let dl = -pts[0].r / DG; if (!Number.isFinite(dl) || dl === 0) dl = P.root.minStep / 2;
        const s = Math.sign(dl) * Math.max(2 * Math.abs(dl), P.root.minStep), kfA = Number((1 + s).toPrecision(12));
        await go(specOf(HP, key, 'q11', f, N, { kf: kfA }), 2000); pts.push({ kf: kfA, r: r(kfA) }); tr.push({ it: 1, kf: kfA, r: pts[1].r, how: '一次の見積りの 2 倍(区間に挟む)' });
        for (let it = 2; it < 2 + P.root.maxIt; it++) {
          const line = pts.filter((z) => Number.isFinite(z.r)).sort((a, b) => a.kf - b.kf);
          let lo = null, hi = null; for (let i = 0; i + 1 < line.length; i++) if (Math.sign(line[i].r) !== Math.sign(line[i + 1].r)) { lo = line[i]; hi = line[i + 1]; }
          if (!lo) { const a = line[0], b = line[line.length - 1]; lo = a; hi = b; }
          const kfN = Number((lo.kf - lo.r * (hi.kf - lo.kf) / (hi.r - lo.r)).toPrecision(12));
          if (pts.some((z) => z.kf === kfN)) { tr.push({ it, stop: '割線の点が既にある(12 桁)' }); break; }
          // 候補の点: 最も細かい刻みを先に・粗い刻みも同じ点で(採用の欄 —— 候補の点そのもの)
          const fineJob = go(specOf(HP, key, 'q11', f, N, { kf: kfN }), 3000), coarse = ds.filter((d) => d !== f).map((d) => go(specOf(HP, key, 'q11', d, N, { kf: kfN }), 2500));
          await fineJob; const rN = r(kfN); pts.push({ kf: kfN, r: rN }); tr.push({ it, kf: kfN, r: rN, how: 'x = κ の割線(h/' + f + ')' });
          await Promise.all(coarse);
          if (Math.abs(rN) <= EPS.fit) break;
        }
      })());
    }
    await Promise.all(jobs);
    J.E = { N: { main: N, earthmoon: P.em.nMoon }, nEarth: P.em.nEarth, divs: { main: ds, earthmoon: P.em.divs.slice() }, rows };
    tick('E');
  }
  if (J.E && parts.includes('K')) { J.K = partK(J); tick('K'); }
  if (J.E && parts.includes('R')) { J.R = partR(J); tick('R'); }
  if (J.K && parts.includes('D')) { J.D = partD(J); tick('D'); }
  if (J.E && parts.includes('M')) { J.M = partM(J); tick('M'); }
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r.status === 'run') : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}

/* ───────── 文書の表(PHYSICS〔第313便d〕—— QA docs.k1confirm313 が逐語で照合)───────── */
const { fx, ex } = Q;
const fl = (x) => Q.fmtFloor(x, 1e-6, 2);   // 帯・小さい差は丸めの床(1e-6 ″/世紀)で
const fk = (x) => (Number.isFinite(x) ? x.toFixed(7) : '—');   // κ/κ₀ の倍率(7 桁 —— ε_fit の分解能より細かい)
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
export function physicsTables(J) {
  const out = [];
  if (J.P) {
    out.push(`| 系(t = 0 の写し —— 全天体の規則・K1) | 天体 | m [kg] | 観測半径 R [m] | 宣言の R_d = κ₀m [m] | エンジンの R_d [m] | 受け手 |`, '|---|---|---|---|---|---|---|');
    for (const s of SYSTEMS) { const p = J.P.systems[s.key]; if (!p || p.err) continue;
      for (const b of p.bodies) out.push(`| ${s.emoji} ${s.id} | ${b.name} | ${ex(b.m, 4)} | ${ex(b.R, 4)} | ${ex(b.RdDecl, 5)} | ${Number.isFinite(b.RdEngine) ? ex(b.RdEngine, 5) : '—'} | ${b.pinned ? '源だけ(pinned —— 動かない)' : (b.receiver ? '受け手と源' : '源だけ')} |`); }
  }
  if (J.K) {
    out.push('', '| 系(κ₀ 固定 —— 規則で置いた残差) | q_1PN [″/世紀] | 刻み | D_G = q11 − q10 | r_1PN = q11 − q00 − q_1PN | r(EPM2011 の A1) | r(INPOP10a の A1) |', '|---|---|---|---|---|---|---|');
    for (const s of SYSTEMS) { const K = J.K.systems[s.key], T = J.T.systems[s.key]; if (!K) continue;
      for (const d of Object.keys(K.byDiv).map(Number).sort((a, b) => a - b)) { const b = K.byDiv[d];
        out.push(`| ${s.emoji} ${s.ja} | ${fx(T.q1pn, 6)} | h/${d} | ${fx(b.DG, 6)} | ${fx(b.r1pn, 6)} | ${fx(b.rA1.EPM2011, 6)} | ${fx(b.rA1.INPOP10a, 6)} |`); } }
    out.push('', '| 系 | A1 EPM2011 [″/世紀](幅の種類) | A1 INPOP10a [″/世紀](幅の種類) | η = Mm/(M+m)² | (4/3)η q_1PN [″/世紀] |', '|---|---|---|---|---|');
    for (const s of SYSTEMS) { const T = J.T.systems[s.key], a = T.a1;
      const cell = (z) => (z && Number.isFinite(z.value) ? z.value + '(' + (z.key === 'INPOP10a' || /interval/.test(z.widthKind) ? '区間の半幅 ' : '幅 ') + z.width + ')' : '—');
      out.push(`| ${s.emoji} ${s.ja} | ${cell(a.EPM2011)} | ${cell(a.INPOP10a)} | ${ex(T.eta, 4)} | ${ex(T.fm, 3)} |`); }
  }
  if (J.R) {
    out.push('', `| 惑星(根 —— h/4 の κ の割線・太陽も規則のまま) | 点 kf = κ/κ₀ と r_1PN(h/4)| 候補の kf | 候補の R_d [m] | r(h)/r(h/2)/r(h/4) | rootBracketed | numericResolved | targetReached | declAdmissible | 採用 |`, '|---|---|---|---|---|---|---|---|---|---|');
    for (const key of PLANET_KEYS) { const o = J.R.planets[key], s = sysOf(key); if (!o || !o.candidate) continue; const a = o.adopt, c = o.candidate;
      out.push(`| ${s.emoji} ${s.ja} | ${o.points.map((z) => fk(z.kf) + ': ' + fx(z.r, 6)).join('・')} | ${fk(c.kf)} | ${ex(c.RdM, 6)} | ${[1, 2, 4].map((d) => fx(c.rByDiv[d], 6)).join(' / ')} | ${yn(a.rootBracketed)} | ${yn(a.numericResolved)} | ${yn(a.targetReached)} | ${yn(a.declAdmissible)} | ${a.adopted ? '採る' : '採らない'} |`); }
    out.push('', '| 根の κ_i/κ₀(3 惑星) | 🌡️ 水星 | 🌋 金星 | 🔴 火星 | 最大/最小 |', '|---|---|---|---|---|');
    const cellK = (f) => PLANET_KEYS.map((k) => fk(J.R.planets[k] && J.R.planets[k].candidate ? f(J.R.planets[k]) : null)).join(' | ');
    out.push(`| 1PN だけ(h/4 の候補の点 —— 走行) | ${cellK((o) => o.candidate.kf)} | ${fk(J.R.spread.pn1)} |`);
    out.push(`| 1PN + A1 EPM2011(実測の傾きで換算) | ${cellK((o) => o.kfA1.EPM2011)} | ${fk(J.R.spread.EPM2011)} |`);
    out.push(`| 1PN + A1 INPOP10a(実測の傾きで換算) | ${cellK((o) => o.kfA1.INPOP10a)} | ${fk(J.R.spread.INPOP10a)} |`);
  }
  if (J.D) {
    out.push('', '| 系(軌道の半直弦の順・最も細かい刻み) | p [au] | r_1PN(κ₀) | − (4/3)η q_1PN | 残り | G の値の効き(感度 —— 引かない) | 数値の帯 | 残り/q_1PN | abs(残り) ≤ ε_fit |', '|---|---|---|---|---|---|---|---|---|');
    for (const z of J.D.rows) { const s = sysOf(z.key);
      out.push(`| ${s.emoji} ${s.ja}(h/${z.fine}) | ${fx(z.p / 1.495978707e11, 4)} | ${fx(z.r1pn, 6)} | ${ex(z.fm, 3)} | ${fx(z.rem, 6)} | ${ex(z.gDr, 2)} | ${fl(z.band)} | ${ex(z.remOverQ, 2)} | ${yn(z.remWithinFit)} |`); }
    out.push('', `| 系(候補の感度の並び —— 水星を 1 に・並べるだけ) | 残り/q_1PN | ${J.D.shapeDefs.map((c) => c.label + '(' + c.kind + ')').join(' | ')} |`, '|---|---|' + J.D.shapeDefs.map(() => '---|').join(''));
    for (const z of J.D.rows) { const s = sysOf(z.key), sh = J.D.shapes.find((y) => y.key === z.key);
      out.push(`| ${s.emoji} ${s.ja} | ${ex(z.remOverQ, 2)} | ${J.D.shapeDefs.map((c) => ex(sh[c.key], 2)).join(' | ')} |`); }
  }
  if (J.M && J.M.moon) {
    const M = J.M.moon.byDiv[1] || Object.values(J.M.moon.byDiv)[0];
    if (M) {
      out.push('', '| 月(🌦️ の三体 —— 118 公転の窓・刻み h・全天体の規則 K1) | 在位の観測 OBS_B1 | q00(在位の写し) | q10 − q00(G_loc) | q11 − q00(G_loc + 引きずり) | q11 − q10(引きずり) |', '|---|---|---|---|---|---|');
      for (const [k, , u, ja] of CF.MOON_Q) { const z = M[k]; out.push(`| ${ja} [${u}] | ${fx(z.obs, 6)} | ${fx(z.q00, 6)} | ${ex(z.dG, 3)} | ${ex(z.dD, 3)} | ${ex(z.dDG, 3)} |`); }
    }
  }
  return out.join('\n');
}
export function docNumbers(J) {
  const out = [];
  if (J.P) out.push(J.P.C1.toFixed(10), ex(J.P.systems.mercury.kappa0, 8));
  if (J.R) for (const k of PLANET_KEYS) { const o = J.R.planets[k]; if (o && o.candidate) out.push(fk(o.candidate.kf)); }
  if (J.K) for (const s of SYSTEMS) { const K = J.K.systems[s.key]; if (K && K.fine !== null) out.push(fx(K.r1pn, 6)); }
  return out;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W313D_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W313D_QUICK === '1';
  const OUT = process.env.W313D_OUT ? (path.isAbsolute(process.env.W313D_OUT) ? process.env.W313D_OUT : path.join(ROOT, process.env.W313D_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W313D_OUT) throw new Error('試走(W313D_QUICK=1)は W313D_OUT を指定する(正本を書かない)');
  const parts = process.env.W313D_PARTS ? process.env.W313D_PARTS.split(',') : PARTS_ALL.slice();
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const NW = Math.max(1, Number(process.env.W313D_WORKERS) || 2), run = makePool(NW, fileURLToPath(import.meta.url));
  const log = (r) => console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・' + (r.spec.system === 'earthmoon' ? 'EMB ' + Number(r.emb).toFixed(6) + '・月 ' + (r.moon ? Number(r.moon.sidH).toFixed(9) + ' d' : '—') : '新 ' + Number(r.apsNew).toFixed(6)) + '″/世紀・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.unconnected ? r.unconnected + '・' : '') + (r.err || '').slice(0, 160)}`);
  const plan = quick ? QUICK_PLAN : BRANCH_PLAN;
  console.log('第313便d k1confirm: ' + (quick ? '試走' : '正本') + '・workers ' + NW + '・段 ' + parts.join(','));
  const R = await runAll(HP, { quick, parts, plan, run, log });
  const out = { version: HARNESS_VERSION, planet3HarnessVersion: PL3.HARNESS_VERSION, planet3LibVersion: Q.LIB_VERSION, confirmHarnessVersion: CF.HARNESS_VERSION, confirmLibVersion: C.LIB_VERSION,
    an336LibVersion: AN.LIB_VERSION, apsisVersion: AP.APSIS_VERSION, emxVersion: EMX.EXTRACTOR_VERSION, generator: 'tests/exp-w313d-k1confirm.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の裁定(第115報)AN399(K1 を採用)・AN402(太陽を含む全天体に R_d = κm —— 重力半径に比例する長さ)・補足(小さい係数は背景宇宙由来か太陽の構造由来かを候補・' +
      '6.5e6 m は K2 の未宣言の上限 —— K1 は無視)・決断事項 AN401(比例定数は 1PN だけ・A1 は暦表ごとの列)・AN405(有限質量比は既知の寄与)・AN396′(ε_fit・ε_num)・AN336・統括の検証項目 R237。' +
      'κ は一次の値 κ₀ = 10G/(C₁c²) に固定(合わせない)。確認の材料(在位へ入れない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w313d-k1confirm.mjs', 'tests/exp-w312d-confirm.mjs', 'tests/lib-w312d-confirm.mjs', 'tests/exp-w311d-planet3.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/exp-w303c-earthmoon.mjs',
    'tests/lib-w306a-an336.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第313便d', target: TARGET, code: CODE,
    inputs: [TARGET, PL3.DECL_FILE, AN336_OUT, AN.CANDIDATE_FILE, AN.AUDIT_FILE] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W313D_WORKERS)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  const rs = out.R ? Object.fromEntries(Object.entries(out.R.planets).map(([k, v]) => [k, v.candidate ? v.candidate.kf : null])) : null;
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', '根の kf ' + JSON.stringify(rs), 'r_1PN ' + JSON.stringify(out.K ? Object.fromEntries(Object.entries(out.K.systems).map(([k, v]) => [k, v.r1pn])) : null));
}
if (IS_MAIN) await main();

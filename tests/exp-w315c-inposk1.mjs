// 第315便c(原仮定者の裁定(第117報)・決断事項 AN406「在位の 7 本を K1 + rdRule:"kappaM" へ移す —— 外殻は宣言しない・shellRecv は省略・initMotion "observed"・
// 値は鎖で測り直す」・AN410〔全系に一様の門〕・AN405〔有限質量比は既知の寄与〕・AN401〔比例定数は 1PN だけ〕・AN396′〔ε_fit・ε_num〕・統括の検証項目 R244):
// **在位の惑星 7 本の K1 への移行の継ぎ目の器**(段 inposk1-315c —— 正本 tests/out/inposk1-w315c.json)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・coord3d.makeSim・build・step と読み口
// inertialDragIsqState・inPositionK1Of をそのまま呼ぶ)。走行は子プロセス(W315C_WORKERS —— 既定 3)。**移行した在位の本そのもの**(生 —— 器の中で写しを作らない)を走らせる。
//
// ■ 走行の本(在位の本 p から —— 鍵は tests/lib-w311d-planet3.mjs の KINDS と同じ定義)
//   q11 = p そのもの(K1 の規則の引きずり + 在位の G_loc {law:"kappaC2"})・q10 = 引きずりなし(OFF_DRAG)+ 在位の G_loc・q00 = 引きずりなし + G_loc なし(= 本の A/B の対照)。
//   刻み h は第306便a の器の刻み(tests/lib-w299c-planets3d.mjs の stepsOf)・窓 8 公転・抽出器は探索の器 v3 の measure(新しい抽出器 apsNew が主・検出器 B は副)。
//
// ■ 段(W315C_PARTS=P,B,T,E,K,G,C で選ぶ —— 正本は全段)
//   P t = 0 の印字(本の ID・天体ごとの m・エンジンが使う質量・R・規則の r_d・r_s = 2G_0m/c_0²・r_d/r_s・β・宣言の要点〔kernel・rdRule・外殻・shellRecv・initMotion・太陽 free・
//     旧則の鍵の無いこと〕と読み口 inPositionK1Of)。Y_k = 10G_0/(C_1c_0²)(本の単位 —— html の invSqKappa0 と同じ演算の順)の SI の値
//   B 移行が「宣言の変換そのもの」であることの確かめ: 凍結の写し(tests/data-w315c-legacy7.json —— af2f426 の宣言)に器の中で K1 の変換(INPOS_K1_DRAG)を当てた本と、
//     移行した在位の本の受理後の physics・bodies・timeRef・scaleExp の正準 JSON の一致と、W315C_BITSTEPS 步の状態(位置・速度・自転)のビット同一。A/B の対照(B 側)が q00 の形
//   T 標的の列(q_1PN —— 二体の 1PN の式〔tests/lib-w306a-an336.mjs の pn1Of —— 観測ではない〕・η・有限質量比の予測 (4/3)η q_1PN)
//   E 走行(7 本 × q00・q10・q11 × h・h/2〔外惑星 3 本は h/4 も〕× 8 公転)
//   K 残差の表(r_1PN = q11 − q00 − q_1PN・r/q_1PN・D_G = q11 − q10・ΔqG = q10 − q00・刻みの帯)
//   G 決断事項 AN410 の一様の門: abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN)・帯 ≤ min(ε_num, 1e-2 q_1PN)(最も細かい刻み —— 観測の 3σ ではない)
//   C K1 の確認の系の行との比較(🌡️🌋🔴🏀 は tests/out/k1confirm-w313d.json の段 K・🟡🔷💙 は tests/out/k1outer-w314c.json の窓 8)——
//     同じ刻み・同じ窓の q00・q10・q11 と r_1PN の差・ビットの一致の数と、有限質量比の予測・帯との並び(確認の系の q11 は明示の dragCore の写し —— 内側の 4 本は R_d の演算の順が規則の鍵と違う)
//
// ■ 試走: W315C_QUICK=1(W315C_OUT が要る —— 正本を書かない)。W315C_FROM=<出力>: 同じ領域 hash(scopeSha256 —— 説明文の欄は入らない)・同じ器の版の走行の行を使い回す
//   (純関数の段だけを作り直す)。
// ■ 再開: W315C_CACHE=<dir>(子プロセスの走行 1 本ごとの結果を逐次書き、同じ領域 hash・同じ器の版・同じ走行の鍵があれば読む —— 読んだ本数を正本の resumed に)。
//
// ■ 言わないこと: 「フィットした」「較正した」「収束した」「完全に一致」「法則を確かめた」「r_d を決めた」「検証が完了した」「現実の宇宙」。門の内なら「規則で置いた残差が数値の門の内」と書く。
//   Y_k は合わせない(規則で置いた値)。数値の門と ε は観測の 3σ ではない。h・h/2・h/4 は刻みの感度診断。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as AN from './lib-w306a-an336.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';
import * as Q from './lib-w311d-planet3.mjs';
import * as C from './lib-w312d-confirm.mjs';
import * as PL3 from './exp-w311d-planet3.mjs';
import * as L7 from './lib-w315c-legacy7.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— tests/lib-w299c-planets3d.mjs が allPresets() を値で読むので presets は "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","FIT_COND_KEYS","FIT_COND_VERSION","FIT_KNOB_KEYS","FIT_NUMERICS_KEYS","FIT_RECORD_KEYS","FIT_RECORD_VERSION","FIT_RECORD_VERSIONS","FIT_RESIDUAL_KEYS","FIT_TARGET_KEYS","FIT_TOL_KEYS","HP.FIT_COND_VERSION","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.fitCondSig","HP.inertialDragIsqState","HP.inertialDragState","HP.sim","HP.validateFitRecord","HP.validatePreset","IN_POSITION_K1_IDS","IN_POSITION_K1_VERSION","T","ab","ch","ctx","cw","dfmGaussLegendre01","dfmInertialDragStep","dragCoreAngular","dragCoreAvgK","dragCoreLookup","dragCoreTableBuild","fmt","inPositionK1Of","inPositionK1State","inertialDragNormApply","invSqEngineMass","invSqKappa0","pnSource","relDragCoefficientOf","validateFitRecord"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w315c-inposk1-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
const NOT_CLAIM = ['フィットした', '較正した', '収束した', '完全に一致', '法則を確かめた', 'r_d を決めた', '検証が完了した', '現実の宇宙'];
export const OUT_MAIN = 'tests/out/inposk1-w315c.json';
export const K1CONFIRM_OUT = 'tests/out/k1confirm-w313d.json';
export const K1OUTER_OUT = 'tests/out/k1outer-w314c.json';
export const PARTS_ALL = Object.freeze(['P', 'B', 'T', 'E', 'K', 'G', 'C']);
/** 決断事項 AN396′ の ε(探索の器 v3 の宣言をそのまま) */
export const EPS = PL3.ADOPT_EPS;
/** 決断事項 AN410 の一様の門(全系 —— q_1PN = 0 の系では比を作らない) */
export const UNIFORM_GATE = Object.freeze({ fit: EPS.fit, num: EPS.num, rel: 1e-2, unit: '″/世紀',
  note: '決断事項 AN410: 全系に一様の門 abs(r_1PN) ≤ min(ε_fit, 1e-2 q_1PN)・帯 ≤ min(ε_num, 1e-2 q_1PN)(最も細かい刻みの残差と隣り合う刻みの差)—— 数値の門で、観測の 3σ ではない' });
/**
 * 移行の変換(決断事項 AN406 —— 在位の本の relativeDrag をこれに置き換える。G_loc・bodies・timeRef・scaleExp は変えない)。
 * 鍵の形は K1 の確認の器の q11(tests/lib-w311d-planet3.mjs の NEW_DRAG + invSq.kernel:"k1")から外殻 outerShell と dragCoreDefault を外し、規則の鍵 rdRule:"kappaM" を足した形
 * (外殻の質量 0 の天体は外殻を作らないので outerShell の有無で走行は同じ —— 枝の実測)。
 */
export const INPOS_K1_DRAG = Object.freeze({ law: 'inertial', invSq: Object.freeze({ kernel: 'k1', rdRule: 'kappaM' }), pairs: 'all', history: 'positions', initMotion: 'observed',
  spinDrag: Object.freeze({ rot: 'surfaceFlip', axial: 'on', axialModel: 'bevel', initSpin: 'observed' }) });
/** 7 本(太陽からの順 —— 絵文字は在位の本)。cmp: 比べる確認の系の正本 */
export const BOOKS = Object.freeze([
  Object.freeze({ key: 'mercury', id: 'mercurySunInertial3d', emoji: '🌡️', ja: '水星', cmp: 'k1confirm' }),
  Object.freeze({ key: 'venus', id: 'venusSunInertial3d', emoji: '🌋', ja: '金星', cmp: 'k1confirm' }),
  Object.freeze({ key: 'mars', id: 'marsSunInertial3d', emoji: '🔴', ja: '火星', cmp: 'k1confirm' }),
  Object.freeze({ key: 'jupiter', id: 'jupiterSunInertial3d', emoji: '🏀', ja: '木星', cmp: 'k1confirm' }),
  Object.freeze({ key: 'saturn', id: 'saturnSunInertial3d', emoji: '🟡', ja: '土星', cmp: 'k1outer' }),
  Object.freeze({ key: 'uranus', id: 'uranusSunInertial3d', emoji: '🔷', ja: '天王星', cmp: 'k1outer' }),
  Object.freeze({ key: 'neptune', id: 'neptuneSunInertial3d', emoji: '💙', ja: '海王星', cmp: 'k1outer' })]);
export const bookOf = (k) => BOOKS.find((b) => b.key === k || b.id === k) || null;
export const OUTER_KEYS = Object.freeze(['saturn', 'uranus', 'neptune']);
/** 計画(正本): 7 本 × q00・q10・q11 × h・h/2(外惑星は h/4 も)× 8 公転・ビット同一の確かめは 20000 步 */
export const PLAN = Object.freeze({ N: 8, divs: Object.freeze([1, 2]), outerDivs: Object.freeze([1, 2, 4]), kinds: Object.freeze(['q00', 'q10', 'q11']), bitSteps: 20000 });
export const QUICK_PLAN = Object.freeze({ N: 1, divs: Object.freeze([1]), outerDivs: Object.freeze([1, 2]), kinds: Object.freeze(['q00', 'q10', 'q11']), bitSteps: 300 });

/* ───────── 走行の本 ───────── */
const liveOf = (HP, id) => { const p = HP.allPresets().find((q) => q.id === id); if (!p) throw new Error('本が無い: ' + id); return p; };
/** 在位の本から走行の本(q11 = 本そのもの・q10/q00 = 引きずりなし —— q00 は G_loc も外す) */
export function runBookOf(p, kind) {
  const k = Q.KINDS[kind]; if (!k || kind === 'q01') throw new Error('走行の種類 ' + kind);
  const q = clone(p);
  delete q.fitRecord; delete q.abBody;
  if (!k.gLoc) delete q.physics.gLoc;
  if (!k.drag) q.physics.relativeDrag = clone(Q.OFF_DRAG);
  return q;
}
/** 凍結の写し(移行の前の宣言)に移行の変換を当てた本 */
export function convertLegacy(id) {
  const q = L7.legacy7Of(id); if (!q) throw new Error('凍結の写しが無い: ' + id);
  q.physics.relativeDrag = clone(INPOS_K1_DRAG);
  return q;
}
const hOf = (p) => P3.stepsOf(p.timeRef.pRef).h;
export const specKey = (s) => s.book + '|' + s.kind + '|div=' + s.div + '|N=' + s.N;
/** 1 本の走行(spec = {book, kind, div, N}) */
export function runSpec(HP, sp) {
  const b = bookOf(sp.book), p = liveOf(HP, b.id), q = runBookOf(p, sp.kind), h = hOf(p), v = HP.validatePreset(clone(q));
  if (!v.ok) return { key: specKey(sp), spec: sp, status: 'rejected', err: JSON.stringify(v.errors).slice(0, 300) };
  const r = PL3.measure(HP, q, h / sp.div, sp.N);
  return Object.assign({ key: specKey(sp), spec: sp, status: 'run', h, dt: h / sp.div, warnings: (v.warnings || []).length }, r);
}
function makePool(NW, self) {
  let active = 0; const q = [];
  const pump = () => { q.sort((a, b) => b.pri - a.pri); while (active < NW && q.length) { const { sp, res, rej } = q.shift(); active++;
    const ch = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify(sp)], { cwd: ROOT, env: process.env });
    let out = '', err = '';
    ch.stdout.on('data', (d) => { out += d; }); ch.stderr.on('data', (d) => { err += d; });
    ch.on('close', (code) => { active--; pump(); if (code !== 0) return rej(new Error(specKey(sp) + ': ' + err.slice(0, 600)));
      try { res(JSON.parse(out.slice(out.lastIndexOf('\n{') + 1))); } catch (e) { rej(new Error(specKey(sp) + ': 出力が JSON でない ' + out.slice(-200))); } }); } };
  return (sp, pri = 0) => new Promise((res, rej) => { q.push({ sp, res, rej, pri }); pump(); });
}
function cachedRun(run, dir, scopeSha256, stat) {
  if (!dir) return run;
  fs.mkdirSync(dir, { recursive: true });
  const fileOf = (sp) => path.join(dir, crypto.createHash('sha256').update(HARNESS_VERSION + '|' + scopeSha256 + '|' + specKey(sp)).digest('hex').slice(0, 32) + '.json');
  return (sp, pri) => {
    const f = fileOf(sp);
    try { const c = JSON.parse(fs.readFileSync(f, 'utf8')); if (c.version === HARNESS_VERSION && c.scopeSha256 === scopeSha256 && c.row && c.row.key === specKey(sp)) { stat.resumed++; return Promise.resolve(c.row); } } catch (e) { /* 無い */ }
    return run(sp, pri).then((r) => { const tmp = f + '.tmp'; fs.writeFileSync(tmp, JSON.stringify({ version: HARNESS_VERSION, scopeSha256, row: r })); fs.renameSync(tmp, f); return r; });
  };
}

/* ───────── 段 P(t = 0 の印字)───────── */
const BODY_NAMES = ['太陽', '惑星'];
export function probeOf(HP, inPos) {
  const out = { C1: Q.C1_CLOSED, systems: {} };
  for (const b of BOOKS) {
    const p = liveOf(HP, b.id), v = HP.validatePreset(clone(p)), s = inPos(p);
    if (!v.ok) { out.systems[b.key] = { id: b.id, err: JSON.stringify(v.errors).slice(0, 300) }; continue; }
    const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
    const st = HP.inertialDragIsqState(S), L = Math.pow(10, p.scaleExp.L), M = Math.pow(10, p.scaleExp.M), rr = st.rdRule || null;
    const bodies = p.bodies.map((z, i) => { const rc = (st.receivers || []).find((y) => y.i === i), rb = rr && (rr.bodies || []).find((y) => y.i === i), sb = s.bodies[i];
      return { name: BODY_NAMES[i], m: z.m * M, mEngine: sb.mEngine * M, R: z.radius * L, rdRule: sb.rd * L, rsBook: sb.rs, rs: sb.rs * L, rdOverRs: sb.rd / sb.rs, rdOverR: sb.rd / z.radius,
        pinned: !!z.pinned, receiver: !!rc, rdEngine: rc ? rc.Rd * L : null, mdEngine: rc ? rc.md * M : null, beta: rc ? rc.beta.slice() : null,
        rdEngineSame: !!(rc && Object.is(rc.Rd, sb.rd)), mdEngineSame: !!(rc && Object.is(rc.md, sb.mEngine)), ruleSrc: rb ? rb.src : null }; });
    out.systems[b.key] = { id: b.id, emoji: b.emoji, scaleExp: clone(p.scaleExp), G0: p.physics.G, c0: p.physics.cLight, YkBook: s.Yk, YkSI: rr ? rr.kappaSI : null, rdOverRs: s.rdOverRs,
      decl: { kernel: s.kernel, rdRule: s.rdRule, outerShell: s.outerShell, shellRecv: s.shellRecv, initMotion: s.initMotion, dragCoreDefault: s.dragCoreDefault, oldLawKeys: s.oldLawKeys,
        gLoc: s.gLoc, sunFree: s.sunFree, fitRecord: s.fitRecord, migrated: s.migrated, version: s.version },
      validated: { kernel: v.preset.physics.relativeDrag.invSq.kernel || null, rdRule: v.preset.physics.relativeDrag.invSq.rdRule || null, outerShell: v.preset.physics.relativeDrag.invSq.outerShell || null,
        shellRecv: v.preset.physics.relativeDrag.invSq.shellRecv || null, warnings: (v.warnings || []).length },
      bodies, betaMax: st.betaMax, h: hOf(p) };
  }
  return out;
}

/* ───────── 段 B(移行が宣言の変換そのものであることの確かめ)───────── */
const canonView = (vp) => JSON.stringify([vp.physics, vp.bodies, vp.timeRef || null, vp.scaleExp || null]);
const stateOf = (S, n) => { const o = []; for (let i = 0; i < n; i++) o.push(S.x[i], S.y[i], S.z[i], S.vx[i], S.vy[i], S.vz[i], S.spin ? S.spin[i] : 0); return o; };
export function bitCheckOf(HP, steps) {
  const out = { steps, systems: {} };
  for (const b of BOOKS) {
    const p = liveOf(HP, b.id), a = convertLegacy(b.id), va = HP.validatePreset(clone(a)), vb = HP.validatePreset(clone(p)), h = hOf(p);
    if (!va.ok || !vb.ok) { out.systems[b.key] = { id: b.id, err: JSON.stringify(va.ok ? vb.errors : va.errors).slice(0, 300) }; continue; }
    const declSame = canonView(va.preset) === canonView(vb.preset);
    const Sa = HP.coord3d.makeSim(); Sa.build(clone(va.preset)); const Sb = HP.coord3d.makeSim(); Sb.build(clone(vb.preset));
    const t0 = Date.now(); for (let k = 0; k < steps; k++) { Sa.step(h); Sb.step(h); }
    const xa = stateOf(Sa, 2), xb = stateOf(Sb, 2), nDiff = xa.filter((x, i) => !Object.is(x, xb[i])).length;
    const ba = HP.inertialDragIsqState(Sa), bb = HP.inertialDragIsqState(Sb);
    // A/B の対照(B 側)が q00 の形(引きずりなし・G_loc なし)
    const pp = vb.preset.abBody && vb.preset.abBody.physicsPatch, q00 = HP.validatePreset(clone(runBookOf(p, 'q00')));
    const abQ00 = !!(pp && q00.ok && pp.gLoc === null && JSON.stringify(pp.relativeDrag) === JSON.stringify(q00.preset.physics.relativeDrag));
    // 凍結の写しの旧則の宣言(移行の前の形)の印
    const lg = L7.legacy7Of(b.id), lrd = lg.physics.relativeDrag;
    out.systems[b.key] = { id: b.id, declSame, nState: xa.length, nDiff, bitSame: nDiff === 0, betaMaxSame: Object.is(ba.betaMax, bb.betaMax), abQ00,
      legacyOldLaw: !!(lrd && lrd.inertialR2 && lrd.inertialR2.denom === 'pair' && Number.isFinite(lrd.Wbg)), legacyFit: !!lg.fitRecord, wallSec: (Date.now() - t0) / 1000 };
  }
  return out;
}

/* ───────── 段 T(標的の列)───────── */
export function targetsOf(HP) {
  const out = {};
  for (const b of BOOKS) {
    const p = liveOf(HP, b.id), pn = AN.pn1Of(p), U = C.siOf(p), M = U.B[0].m, m = U.B[1].m, q1pn = pn.value;
    out[b.key] = { id: b.id, q1pn, a: pn.a, e: pn.e, M, m, eta: C.etaOf(M, m), fm: C.finiteMassPred(q1pn, M, m), G0: p.physics.G, c0: p.physics.cLight, h: hOf(p), formula: pn.formulaVersion };
  }
  return out;
}

/* ───────── 段 K・G(残差の表と一様の門)───────── */
const divsOf = (k, P) => (OUTER_KEYS.includes(k) ? P.outerDivs : P.divs);
const rowOf = (J, k, kind, d) => J.E.rows[specKey({ book: k, kind, div: d, N: J.plan.N })];
export function partK(J) {
  const out = { systems: {} };
  for (const b of BOOKS) {
    const T = J.T[b.key], o = { byDiv: {} };
    for (const d of divsOf(b.key, J.plan)) {
      const q = {}; for (const kind of J.plan.kinds) { const r = rowOf(J, b.key, kind, d); q[kind] = r && r.status === 'run' ? r.apsNew : null; }
      if (![q.q00, q.q10, q.q11].every(Number.isFinite)) continue;
      const res = Q.residualOf(q, T.q1pn);
      o.byDiv[d] = { q, DG: res.DG, dqG: res.dqG, r1pn: res.r, rOverQ: T.q1pn !== 0 ? res.r / T.q1pn : null,
        period: (rowOf(J, b.key, 'q11', d) || {}).periodDays || null, periodQ00: (rowOf(J, b.key, 'q00', d) || {}).periodDays || null };
    }
    const ds = Object.keys(o.byDiv).map(Number).sort((a, c) => a - c);
    o.fine = ds.length ? ds[ds.length - 1] : null;
    o.bands = {}; for (let i = 1; i < ds.length; i++) o.bands[ds[i - 1] + '-' + ds[i]] = Math.abs(o.byDiv[ds[i]].r1pn - o.byDiv[ds[i - 1]].r1pn);
    if (o.fine !== null) { const z = o.byDiv[o.fine]; o.r1pn = z.r1pn; o.DG = z.DG; o.rOverQ = z.rOverQ; o.rAfterFm = z.r1pn - T.fm; }
    out.systems[b.key] = o;
  }
  return out;
}
export function partG(J, G = UNIFORM_GATE) {
  const out = { rule: clone(G), systems: {} };
  for (const b of BOOKS) {
    const K = J.K.systems[b.key], T = J.T[b.key];
    if (!K || K.fine === null || K.fine === undefined) { out.systems[b.key] = { pass: null, verdict: '走行なし' }; continue; }
    const relOk = T.q1pn !== 0, tolR = relOk ? Math.min(G.fit, G.rel * Math.abs(T.q1pn)) : G.fit, tolB = relOk ? Math.min(G.num, G.rel * Math.abs(T.q1pn)) : G.num;
    const bands = Object.values(K.bands), rOk = Math.abs(K.r1pn) <= tolR, bOk = bands.length > 0 && bands.every((x) => x <= tolB);
    out.systems[b.key] = { fine: K.fine, r: K.r1pn, q1pn: T.q1pn, rOverQ: K.rOverQ, tolR, rOk, bands, tolB, bOk, pass: rOk && bOk,
      verdict: (rOk && bOk) ? '規則で置いた残差が数値の門の内' : '規則で置いた残差が数値の門の外' };
  }
  out.allPass = Object.values(out.systems).every((s) => s.pass === true);
  return out;
}

/* ───────── 段 C(K1 の確認の系の行との比較)───────── */
export function partC(J, root = ROOT) {
  const rd = (f) => { try { return JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); } catch (e) { return null; } };
  const CF = rd(K1CONFIRM_OUT), KO = rd(K1OUTER_OUT), out = { sources: { k1confirm: K1CONFIRM_OUT, k1outer: K1OUTER_OUT, k1outerWindow: 8 }, systems: {} };
  for (const b of BOOKS) {
    const ref = b.cmp === 'k1confirm' ? (CF && CF.K && CF.K.systems[b.key]) : (KO && KO.K && KO.K.systems[b.key] && KO.K.systems[b.key].byWin && KO.K.systems[b.key].byWin['8']);
    const K = J.K.systems[b.key], T = J.T[b.key], rows = {};
    if (!ref || !K) { out.systems[b.key] = { src: b.cmp, missing: true }; continue; }
    let nSame = 0, n = 0;
    for (const [d, z] of Object.entries(K.byDiv)) {
      const r0 = ref.byDiv && ref.byDiv[d]; if (!r0) continue;
      const qd = {}; for (const kind of ['q00', 'q10', 'q11']) { const a = z.q[kind], c = r0.q[kind]; const same = Object.is(a, c); n++; if (same) nSame++; qd[kind] = { live: a, confirm: c, diff: a - c, same }; }
      rows[d] = { q: qd, r1pnLive: z.r1pn, r1pnConfirm: r0.r1pn, dr: z.r1pn - r0.r1pn };
    }
    const ds = Object.keys(rows).map(Number).sort((a, c) => a - c), fine = ds.length ? ds[ds.length - 1] : null;
    out.systems[b.key] = { src: b.cmp, rows, n, nSame, allSame: n > 0 && nSame === n, fine, drFine: fine !== null ? rows[fine].dr : null, fm: T.fm, bandLive: K.bands,
      note: b.cmp === 'k1confirm' ? '確認の系の q11 は明示の dragCore {massFrac: 1, radius: 10 G m/(C₁ c²)}(宣言の質量・演算の順が規則の鍵と違う)—— q00・q10 は同じ宣言' : '確認の系の q11 は明示の dragCore {massFrac: 1, radius: Y_k × エンジンの質量}(規則の鍵とビット同一の型)・窓 8 は 16 公転の入れ子の窓' };
  }
  out.nSame = Object.values(out.systems).reduce((s, x) => s + (x.nSame || 0), 0); out.n = Object.values(out.systems).reduce((s, x) => s + (x.n || 0), 0);
  return out;
}

/* ───────── 門(器の自己点検)───────── */
export function gatesOf(J) {
  const g = {};
  if (J.P) g.declK1 = BOOKS.every((b) => { const s = J.P.systems[b.key]; return s && !s.err && s.decl.migrated && s.decl.kernel === 'k1' && s.decl.rdRule === 'kappaM' && !s.decl.outerShell && !s.decl.shellRecv
    && s.decl.initMotion === 'observed' && !s.decl.dragCoreDefault && s.decl.oldLawKeys.length === 0 && s.decl.gLoc === 'kappaC2' && s.decl.sunFree && !s.decl.fitRecord
    && s.validated.kernel === 'k1' && s.validated.rdRule === 'kappaM' && s.validated.warnings === 0 && s.bodies.every((z) => z.receiver && z.rdEngineSame && z.mdEngineSame && z.ruleSrc === 'rule'); });
  if (J.B) g.bitSame = BOOKS.every((b) => { const s = J.B.systems[b.key]; return s && s.declSame && s.bitSame && s.betaMaxSame && s.abQ00 && s.legacyOldLaw; });
  if (J.E) { const run = Object.values(J.E.rows); g.runsComplete = run.length > 0 && run.every((r) => r.status === 'run' && !r.nan && r.complete && Number.isFinite(r.apsNew)); }
  if (J.G) g.uniformGate = J.G.allPass === true;
  return g;
}

/* ───────── 走行の計画 ───────── */
export async function runAll(HP, o) {
  const parts = o.parts, P = o.plan, t = {}; let t0 = Date.now();
  const tick = (k) => { t[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const inPos = vm.runInThisContext('inPositionK1Of'), inState = vm.runInThisContext('inPositionK1State()');
  const J = { quick: !!o.quick, parts, plan: clone(P), gate: clone(UNIFORM_GATE), inPositionK1: { version: vm.runInThisContext('IN_POSITION_K1_VERSION'), state: inState },
    book: { drag: clone(INPOS_K1_DRAG), offDrag: clone(Q.OFF_DRAG), gLoc: { law: 'kappaC2' }, legacyFile: L7.LEGACY7_DATA_FILE, legacyVersion: L7.LEGACY7_DATA_VERSION, legacyBase: clone(L7.LEGACY7_BASE),
      extractor: { main: 'apsNew', sub: 'detB', K: PL3.APSIS_K }, rule: 'rdRule:"kappaM" —— 太陽を含む全天体 r_d = Y_k m(Y_k = 10G_0/(C_1c_0²) —— 本の単位・K1・合わせない)' } };
  if (parts.includes('P')) { J.P = probeOf(HP, inPos); tick('P'); }
  if (parts.includes('B')) { J.B = bitCheckOf(HP, P.bitSteps); tick('B'); }
  J.T = targetsOf(HP); tick('T');
  if (parts.includes('E')) {
    const rows = {}, specs = [];
    for (const b of BOOKS) for (const d of divsOf(b.key, P)) for (const kind of P.kinds) specs.push({ book: b.key, kind, div: d, N: P.N });
    const reuse = o.reuse || {}, todo = specs.filter((sp) => { const r = reuse[specKey(sp)]; if (r && r.status === 'run') { rows[specKey(sp)] = r; return false; } return true; });
    await Promise.all(todo.map((sp) => o.run(sp, (Q.KINDS[sp.kind].drag ? 100 : 1) * sp.div).then((r) => { rows[r.key] = r; o.log(r); return r; })));
    J.E = { N: P.N, divs: P.divs.slice(), outerDivs: P.outerDivs.slice(), rows: Object.fromEntries(specs.map((sp) => [specKey(sp), rows[specKey(sp)]])) };
    tick('E');
  }
  if (J.E && parts.includes('K')) { J.K = partK(J); tick('K'); }
  if (J.K && parts.includes('G')) { J.G = partG(J); tick('G'); }
  if (J.K && parts.includes('C')) { J.C = partC(J); tick('C'); }
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = t;
  const runs = J.E ? Object.values(J.E.rows).filter((r) => r && r.status === 'run') : [];
  J.stats = { runs: runs.length, steps: runs.reduce((s, r) => s + r.steps, 0) };
  return J;
}

/* ───────── 実行 ───────── */
const argOf = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null; };
export async function main() {
  const TARGET = process.env.W315C_TARGET || 'beta/index.html';
  if (process.argv.includes('--child')) {
    const spec = JSON.parse(argOf('--child'));
    const { HP } = loadHtmlMain(path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
    process.stdout.write('\n' + JSON.stringify(runSpec(HP, spec)) + '\n');
    return;
  }
  const quick = process.env.W315C_QUICK === '1';
  const OUT = process.env.W315C_OUT ? (path.isAbsolute(process.env.W315C_OUT) ? process.env.W315C_OUT : path.join(ROOT, process.env.W315C_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W315C_OUT) throw new Error('試走(W315C_QUICK=1)は W315C_OUT を指定する(正本を書かない)');
  const parts = process.env.W315C_PARTS ? process.env.W315C_PARTS.split(',') : PARTS_ALL.slice();
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  let reuse = null, reuseFrom = null;
  if (process.env.W315C_FROM) {
    const f = path.isAbsolute(process.env.W315C_FROM) ? process.env.W315C_FROM : path.join(ROOT, process.env.W315C_FROM);
    const P0 = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (P0.meta && P0.meta.scopeSha256 === W281A_SCOPE.scopeSha256 && W281A_SCOPE.scopeComplete && P0.version === HARNESS_VERSION && P0.E) { reuse = P0.E.rows; reuseFrom = path.relative(ROOT, f); }
    else throw new Error('W315C_FROM: 領域 hash か器の版が違う(' + f + ')');
  }
  const NW = Math.max(1, Number(process.env.W315C_WORKERS) || 3), cstat = { resumed: 0 };
  const run = cachedRun(makePool(NW, fileURLToPath(import.meta.url)), process.env.W315C_CACHE ? path.resolve(process.env.W315C_CACHE) : null, W281A_SCOPE.scopeSha256, cstat);
  const log = (r) => console.log(`  ${new Date().toISOString().slice(11, 19)} ${r.key}: ${r.status}${r.status === 'run' ? '・新 ' + Number(r.apsNew).toExponential(9) + '″/世紀・' + r.steps + ' 步・' + r.wallSec.toFixed(1) + ' s' : '・' + (r.err || '').slice(0, 160)}`);
  const plan = quick ? QUICK_PLAN : PLAN;
  console.log('第315便c inposk1: ' + (quick ? '試走' : '正本') + '・workers ' + NW + '・段 ' + parts.join(',') + (reuseFrom ? '・行の使い回し ' + reuseFrom : ''));
  const R = await runAll(HP, { quick, parts, plan, run, log, reuse });
  const out = { version: HARNESS_VERSION, planet3HarnessVersion: PL3.HARNESS_VERSION, planet3LibVersion: Q.LIB_VERSION, confirmLibVersion: C.LIB_VERSION, an336LibVersion: AN.LIB_VERSION,
    apsisVersion: AP.APSIS_VERSION, legacyLibVersion: L7.LIB_VERSION, generator: 'tests/exp-w315c-inposk1.mjs', target: TARGET, targetSha256, reuseFrom,
    ruling: '原仮定者の裁定(第117報)・決断事項 AN406(在位の 7 本を K1 + rdRule:"kappaM" へ —— 外殻なし・shellRecv 省略・initMotion "observed"・値は鎖で測り直す)・AN410(全系に一様の門)・' +
      'AN405(有限質量比は既知の寄与)・AN401(比例定数は 1PN だけ)・AN396′(ε_fit・ε_num)・統括の検証項目 R244。Y_k は規則で置いた値(合わせない)。現実の宇宙とは主張しない',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, ...R };
  if (cstat.resumed > 0) out.resumed = cstat.resumed;
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w315c-inposk1.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/exp-w311d-planet3.mjs', 'tests/lib-w311d-planet3.mjs', 'tests/lib-w312d-confirm.mjs', 'tests/lib-w306a-an336.mjs',
    'tests/lib-w304e-apsis.mjs', 'tests/exp-w299c-planets3d.mjs', 'tests/lib-w299c-planets3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第315便c', target: TARGET, code: CODE, inputs: [TARGET, L7.LEGACY7_DATA_FILE, K1CONFIRM_OUT, K1OUTER_OUT] }), {
    harnessVersion: HARNESS_VERSION, engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・走行は子プロセス W315C_WORKERS)', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s',
    'r_1PN ' + JSON.stringify(out.G ? Object.fromEntries(Object.entries(out.G.systems).map(([k, v]) => [k, v.r])) : null),
    '門 ' + JSON.stringify(out.G ? Object.fromEntries(Object.entries(out.G.systems).map(([k, v]) => [k, v.pass])) : null), '確認の系のビット ' + (out.C ? out.C.nSame + '/' + out.C.n : null));
}
if (IS_MAIN) await main();

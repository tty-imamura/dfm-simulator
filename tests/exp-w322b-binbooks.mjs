// 第322便b(原仮定者の回答(2026-11-01 —— AN499)「『連星サンプル群』は実在天体を指している。検証サンプルが必要であれば、先に用意する」・決断事項 AN505・
//   統括の検証項目 R271 —— 策定の段 S2): **geoPN=3 の連星の内蔵の第一陣の器**(段 binbooks-322b —— 正本 tests/out/binbooks-w322b.json)。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、validatePreset・presetSig・geoModeOf・coord3d.makeSim・build・step と
// 読み口 geoLawOfSim・geoEffectiveMode をそのまま呼ぶ —— 1 本の走行は第321便b の器の runBook)。走行は子プロセス(W322B_WORKERS —— 既定 2)。
//
// ■ 段
//   A 受理の表: 内蔵の 4 本(♊⚖️🌠🔶)の受理(警告 0)・presetSig と受理後の宣言(physics・bodies・timeRef・scaleExp・world・camera・overlays)が第321便b の兄弟の写し
//     (列 tr —— 並進だけ)と同じ・宣言の期待(coord 3d・geoPN 3・kFrame 0・λ_PN 0・K1 + rdRule "kappaM" + initMotion "observed"・spinDrag と sourceMoment なし・G_loc kappaC2・
//     sampleClass "principle"・notClaim binary_geo3)・OFF の対照(abBody の physicsPatch を重ねた写し)が写しの列 off と同じ。
//     第322便e(原仮定者の回答(2026-11-01 —— AN519)「c₀=30 に直す」・統括の検証項目 R274): 検証サンプル ♊⚖️ の写しの相手は**第321便b の玩具に c₀ = 30 の宣言を当てた写し**
//     (lib の applyToyC0 —— cLight 10 → 30 と従属の kappaT = G/c₀² だけ・第321便b の玩具・器・正本は c = 10 のまま)。門 aC0: 本の cLight = 30・kappaT が G/(c₀·c₀) とビット同一・
//     第321便b の写し(列 tr・off)との差の鍵が cLight と kappaT だけ(physics の外は同じ)・実在の連星の 2 本は差なし。geo1 の参照(列 g1)も同じ c₀ = 30 の玩具。
//   E 走行(子プロセス): 本 × 列(self = 内蔵の本・off = OFF の対照・g1 = geo1 の参照〔同じ入力の二次元の geo1 —— 第321便b の g1_2d〕)× 刻み h・h/2・h/4 × 窓 8 公転
//     (遠点から)+ 写しの列 tr(h)—— 内蔵の本の走行の状態と写しのビットの照合。
//   T 量ごとの表: 系ごとの η・1 + (4/3)η・q_1PN と、OFF を差し引いた近点の移動(self − off・g1 − off)・比 (self − off)/(g1 − off)(離心ベクトルの回帰 —— 主・
//     検出器 B —— 副)・比 / (1 + (4/3)η)・刻みの帯・周期と離心率の差(self − g1)。
//
// ■ 試走: W322B_QUICK=1(W322B_OUT が要る —— 正本を書かない・窓 3 公転・刻み h・h/2)。W322B_WORKERS(既定 2)。W322B_TARGET(既定 beta/index.html)。
// ■ 言わないこと: 連星の観測との照合と呼ばない・近点の移動の原因を述べない・h・h/2・h/4 を収束の判定に使わない(刻みの感度診断)・
//   (1 + (4/3)η) を補正の係数に使わない・恒星連星で一律の値と書かない・周期だけの一致を系全体の合格に広げない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w321b-geo3bin.mjs';
import * as B from './lib-w322b-binbooks.mjs';
import { runBook } from './exp-w321b-geo3bin.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 —— 本は .find で引く 4 本と元の本・雛形と、import した器と lib が文字列で名指しする本)
const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABInertial3d","binary","binaryCheckEqualInertial3d","binaryCheckRatio3Inertial3d","boxBinaryToy","compactForceToy","coord3dKeplerTilt","coord3dSpinPrecess","fig8","gw150914","inertialDragPair","psrB1534","psrDoubleAB","psrJ1757DFM","psrJ1946DFM","siriusAB","siriusABInertial3d","spinDipoleBinary"],"roots":["$","HP.MASS_BASIS","HP.REL_DRAG_INVSQ_VERSION","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDragLedgerOf","HP.presetSig","HP.sim","HP.validatePreset","T","calTargetOf","ctx","cw","pnSource"],"core":true,"consts":[],"complete":true,"keepProse":["familyRole"]};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w322b-binbooks-2';   // 第322便e: 検証サンプル ♊⚖️ を c₀ = 30 へ(原仮定者の回答 AN519 —— 写しの相手は第321便b の玩具に c₀ = 30 の宣言を当てた写し・門 aC0)
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const clone = (x) => JSON.parse(JSON.stringify(x));
export const OUT_MAIN = 'tests/out/binbooks-w322b.json';
export const PLAN = Object.freeze({ N: 8, divs: Object.freeze([1, 2, 4]), apsisK: 3, books: B.BOOK_IDS, cols: Object.freeze(['self', 'off', 'g1']) });
export const QUICK = Object.freeze({ N: 3, divs: Object.freeze([1, 2]), apsisK: 3, books: B.BOOK_IDS, cols: Object.freeze(['self', 'off', 'g1']) });
const EFF_KEYS = ['physics', 'bodies', 'timeRef', 'scaleExp', 'world', 'camera', 'overlays'];

/* ───────── 本の引き方 ───────── */
const finderOf = (HP) => (id) => HP.allPresets().find((p) => p.id === id) || null;
const specOf = (id) => B.BOOKS.find((b) => b.id === id);
/** 走行の本(列 self・off・g1・sib)—— self は内蔵の本そのもの */
export function bookOfRun(HP, id, col) {
  const find = finderOf(HP), sp = specOf(id), self = clone(find(id));
  if (col === 'self') return self;
  if (col === 'off') return B.offOf(self);
  if (col === 'g1') return B.geo1Of(sp, find);
  if (col === 'sib') return B.siblingCol(sp, find, 'tr');
  throw new Error('未知の列 ' + col);
}
export const specKey = (s) => s.id + '|' + s.col + '|div=' + s.div + '|N=' + s.N;
export function runSpec(HP, sp) {
  const self = finderOf(HP)(sp.id), h = self.physics.stepDt, P0 = L.osc0Of(self).P;
  const r = runBook(HP, bookOfRun(HP, sp.id, sp.col), { dt: h / sp.div, N: sp.N, K: sp.K, P0 });
  return Object.assign({ key: specKey(sp), spec: sp, h }, r);
}

/* ───────── 段 A 受理の表 ───────── */
const effOf = (v) => JSON.stringify(Object.fromEntries(EFF_KEYS.map((k) => [k, v.preset[k] === undefined ? null : v.preset[k]])));
export function partA(HP) {
  const find = finderOf(HP), rows = [];
  for (const sp of B.BOOKS) {
    const p = find(sp.id);
    if (!p) { rows.push({ id: sp.id, present: false }); continue; }
    const v = HP.validatePreset(clone(p)), sib = B.siblingCol(sp, find, 'tr'), vs = HP.validatePreset(clone(sib));
    const off = B.offOf(p), sibOff = B.siblingCol(sp, find, 'off'), vo = HP.validatePreset(clone(off)), vso = HP.validatePreset(clone(sibOff));
    const ph = v.ok ? v.preset.physics : {}, raw = p.physics || {}, rd = raw.relativeDrag || {}, E = B.DECL_EXPECT;   // 引きずりと G_loc は本の宣言の形(受理後は既定の鍵を補う)で見る
    const declChecks = {
      coord: ph.coord === E.coord, geoPN: ph.geoPN === E.geoPN, kFrame: ph.kFrame === E.kFrame, lambdaPN: ph.lambdaPN === E.lambdaPN,
      relativeDrag: JSON.stringify(rd) === JSON.stringify(E.relativeDrag), noSpinDrag: rd.spinDrag === undefined, noSourceMoment: !(rd.invSq && rd.invSq.sourceMoment),
      gLoc: JSON.stringify(raw.gLoc || null) === JSON.stringify(E.gLoc) && !!ph.gLoc, sampleClass: p.sampleClass === E.sampleClass, notClaim: Array.isArray(p.notClaim) && p.notClaim.includes(E.notClaim),
      family: sp.src === 'book' ? (p.familyRole === 'variant' && p.familyId === find(sp.book).familyId) : !p.familyId };
    let lawSim = null, ge = null, spin0 = null;
    if (v.ok) { const S = HP.coord3d.makeSim(); S.build(clone(v.preset)); lawSim = HP.geoLawOfSim(S); ge = HP.geoEffectiveMode(S); spin0 = Array.from(S.spin); }
    const et = B.etaOf(p), dTr = B.c0DiffOf(sp, find, 'tr'), dOff = B.c0DiffOf(sp, find, 'off'), wantKeys = sp.src === 'toy' ? B.TOY_C0.keys.slice().sort() : [];
    const c0 = { cLight: raw.cLight, kappaT: raw.kappaT, kappaBit: raw.kappaT === raw.G / (raw.cLight * raw.cLight), keysTr: dTr.keys, keysOff: dOff.keys, restSame: dTr.restSame && dOff.restSame, from: dTr.from, to: dTr.to,
      ok: raw.cLight === (sp.src === 'toy' ? B.TOY_C0.cLight : raw.cLight) && raw.kappaT === raw.G / (raw.cLight * raw.cLight) && JSON.stringify(dTr.keys) === JSON.stringify(wantKeys) && JSON.stringify(dOff.keys) === JSON.stringify(wantKeys) && dTr.restSame && dOff.restSame };
    rows.push({ id: sp.id, emoji: p.emoji, present: true, c0, accepted: v.ok === true, warnings: (v.warnings || []).length, sibAccepted: vs.ok === true,
      sigSame: HP.presetSig(clone(p)) === HP.presetSig(clone(sib)), declSame: v.ok && vs.ok ? effOf(v) === effOf(vs) : false,
      offPatchSame: JSON.stringify(((p.abBody || {}).physicsPatch || {}).relativeDrag || null) === JSON.stringify(L.OFF_DRAG) && ((p.abBody || {}).physicsPatch || {}).gLoc === null,
      offSigSame: vo.ok && vso.ok ? HP.presetSig(clone(off)) === HP.presetSig(clone(sibOff)) : false,
      declChecks, declOk: Object.values(declChecks).every(Boolean), lawDecl: v.ok ? HP.geoModeOf(ph).law : null, lawSim, ge, spin0,
      eta: et.eta, f: et.f, etaTxt: et.etaTxt, fTxt: et.fTxt, pctTxt: et.pctTxt,
      textHasF: [p.descStruct && p.descStruct.summary, ...(p.obsCard || []).map((r) => r.model)].some((s) => typeof s === 'string' && s.indexOf(et.fTxt) >= 0 && s.indexOf(et.pctTxt.slice(1)) >= 0) });
  }
  return { rows, n: rows.length };
}

/* ───────── 段 T 量ごとの表 ───────── */
const rowOf = (rows, id, col, div) => rows.find((r) => r.spec.id === id && r.spec.col === col && r.spec.div === div) || null;
export function tablesOf(rows, P, A, ana) {
  const out = [], sib = [];
  for (const id of P.books) {
    const a = ana[id]; if (!a) continue;
    const g = (col, div, q) => { const r = rowOf(rows, id, col, div); return (r && r.status === 'run' && Number.isFinite(r[q])) ? r[q] : null; };
    const d = (c1, c2, div, q) => { const x = g(c1, div, q), y = g(c2, div, q); return (x === null || y === null) ? null : x - y; };
    const row = { id, eta: a.eta, f: a.f, q1PN: a.q1PN, pred43: a.pred43, P: a.P, byQty: {} };
    for (const q of ['rate', 'rateB']) {
      const sh = P.divs.map((dv) => d('self', 'off', dv, q)), g1 = P.divs.map((dv) => d('g1', 'off', dv, q));
      const ratio = sh.map((x, i) => (x !== null && g1[i]) ? x / g1[i] : null), fin = ratio[ratio.length - 1];
      row.byQty[q] = { shift: sh, g1shift: g1, ratio, ratioOverF: fin === null ? null : fin / a.f, band: (sh.length >= 2 && sh[sh.length - 1] !== null && sh[sh.length - 2] !== null) ? Math.abs(sh[sh.length - 1] - sh[sh.length - 2]) : null,
        g1OverQ1: g1[g1.length - 1] === null ? null : g1[g1.length - 1] / a.q1PN, shiftOverPred: sh[sh.length - 1] === null ? null : sh[sh.length - 1] / a.pred43 };
    }
    row.dP = P.divs.map((dv) => d('self', 'g1', dv, 'P')); row.dPrel = row.dP.map((x) => x === null ? null : x / a.P);
    row.de = P.divs.map((dv) => d('self', 'g1', dv, 'e'));
    out.push(row);
    const s0 = rowOf(rows, id, 'self', P.divs[0]), s1 = rowOf(rows, id, 'sib', P.divs[0]);
    sib.push({ id, sameState: !!(s0 && s1 && s0.status === 'run' && s1.status === 'run' && s0.hashAll === s1.hashAll && s0.steps === s1.steps), hashSelf: s0 ? s0.hashAll : null, hashSib: s1 ? s1.hashAll : null });
  }
  const law = rows.filter((r) => r.status === 'run').map((r) => ({ key: r.key, col: r.spec.col, lawDecl: r.lawDecl, lawSim: r.lawSim, ge: r.ge,
    ok: r.lawDecl === r.lawSim && (r.spec.col === 'g1' ? (r.lawSim === 'eih-kf0' && r.ge === 1) : (r.lawSim === 'inertial-drag' && r.ge === 0)) }));
  const spin = rows.filter((r) => r.status === 'run' && (r.spec.col === 'self' || r.spec.col === 'sib')).map((r) => ({ key: r.key, spinDmax: r.acct ? r.acct.spinDmax : null }));
  return { rows: out, sib, law, spin };
}

/* ───────── 門 ───────── */
export function gatesOf(J) {
  const G = {}, A = J.A, T = J.T;
  G.aPresent = !!(A && A.rows.length === B.BOOKS.length && A.rows.every((r) => r.present));
  G.aAccept = !!(A && A.rows.every((r) => r.accepted && r.warnings === 0 && r.sibAccepted));
  G.aSibling = !!(A && A.rows.every((r) => r.sigSame && r.declSame));
  G.aDecl = !!(A && A.rows.every((r) => r.declOk && r.lawDecl === 'inertial-drag' && r.lawSim === 'inertial-drag' && r.ge === 0));
  G.aOff = !!(A && A.rows.every((r) => r.offPatchSame && r.offSigSame));
  G.aText = !!(A && A.rows.every((r) => r.textHasF));
  G.aC0 = !!(A && A.rows.every((r) => r.c0 && r.c0.ok));   // 第322便e: 検証サンプルは c₀ = 30(写しの差は cLight と kappaT だけ)・実在の連星は写しと差なし
  G.eRun = !!(J.E && J.E.rows.every((r) => r.status === 'run' && r.complete && !r.nan));
  G.eLaw = !!(T && T.law.length && T.law.every((z) => z.ok));
  G.eSibBits = !!(T && T.sib.length === B.BOOKS.length && T.sib.every((z) => z.sameState));
  G.eSpin = !!(T && T.spin.length && T.spin.every((z) => z.spinDmax === 0));
  G.tRatio = !!(T && T.rows.length === B.BOOKS.length && T.rows.every((r) => r.byQty.rate.ratioOverF !== null && Math.abs(r.byQty.rate.ratioOverF - 1) <= 5e-3));
  G.tPn1 = !!(T && T.rows.every((r) => r.byQty.rate.g1OverQ1 !== null && Math.abs(r.byQty.rate.g1OverQ1 - 1) <= 2e-3));
  return G;
}

/* ───────── 子プロセスの池(W322B_WORKERS —— 既定 2) ───────── */
function poolRun(specs, NW, self, target) {
  const chunks = []; const nChunk = Math.max(NW, Math.min(specs.length, NW * 4));
  for (let i = 0; i < nChunk; i++) chunks.push([]);
  specs.forEach((s, i) => chunks[i % nChunk].push(s));
  const todo = chunks.filter((c) => c.length), res = [];
  return new Promise((resolve, reject) => {
    let active = 0, failed = null;
    const pump = () => {
      while (!failed && active < NW && todo.length) {
        const c = todo.shift(); active++;
        const proc = spawn(process.execPath, ['--max-old-space-size=6144', self, '--child', JSON.stringify({ target, specs: c })], { cwd: ROOT, env: process.env });
        let so = '', se = '';
        proc.stdout.on('data', (d) => { so += d; }); proc.stderr.on('data', (d) => { se += d; });
        proc.on('close', (code) => {
          active--;
          if (code !== 0) { failed = new Error('子プロセス rc ' + code + ': ' + se.slice(-600)); return reject(failed); }
          try { const J = JSON.parse(so.slice(so.lastIndexOf('\n{') + 1)); res.push(...J.rows); } catch (e) { failed = new Error('子の出力が JSON でない: ' + so.slice(-300)); return reject(failed); }
          if (!todo.length && active === 0) resolve(res); else pump();
        });
      }
    };
    if (!todo.length) resolve(res); else pump();
  });
}

/* ───────── 実行 ───────── */
export async function runAll(HP, o) {
  const P = o.plan, tm = {}; let t0 = Date.now();
  const tick = (k) => { tm[k] = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now(); };
  const J = { stage: 'binbooks', quick: !!o.quick, plan: clone(P), decl: { BOOKS: clone(B.BOOKS), DECL_EXPECT: clone(B.DECL_EXPECT), OFF_DRAG: clone(L.OFF_DRAG), EFF_KEYS: EFF_KEYS.slice(), TOY_C0: clone(B.TOY_C0) } };
  J.A = partA(HP); tick('A');
  const specs = [];
  for (const id of P.books) {
    for (const col of P.cols) for (const div of P.divs) specs.push({ id, col, div, N: P.N, K: P.apsisK });
    specs.push({ id, col: 'sib', div: P.divs[0], N: P.N, K: P.apsisK });
  }
  const rows = await o.runner(specs);
  J.E = { n: specs.length, rows: rows.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0) }; tick('E');
  const find = finderOf(HP);
  J.ana = Object.fromEntries(P.books.map((id) => { const e = B.etaOf(find(id)); return [id, { eta: e.eta, f: e.f, q1PN: e.q1PN, pred43: e.pred43, a: e.a, e: e.e, P: e.P }]; }));
  J.T = tablesOf(J.E.rows, P, J.A, J.ana); tick('T');
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean); J.timing = tm;
  return J;
}

async function child(arg) {
  const { target, specs } = JSON.parse(arg);
  const { HP } = loadHtmlMain(path.isAbsolute(target) ? target : path.join(ROOT, target));
  const rows = specs.map((sp) => runSpec(HP, sp));
  process.stdout.write('\n' + JSON.stringify({ rows }) + '\n');
}
export async function main() {
  const TARGET = process.env.W322B_TARGET || 'beta/index.html', quick = process.env.W322B_QUICK === '1', NW = Math.max(1, Number(process.env.W322B_WORKERS || 2) | 0);
  const OUT = process.env.W322B_OUT ? (path.isAbsolute(process.env.W322B_OUT) ? process.env.W322B_OUT : path.join(ROOT, process.env.W322B_OUT)) : path.join(ROOT, OUT_MAIN);
  if (quick && !process.env.W322B_OUT) throw new Error('試走(W322B_QUICK=1)は W322B_OUT を指定する(正本を書かない)');
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now(), targetSha256 = crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex');
  const W281A_SCOPE = REGEN_SCOPE ? w281aScopeStamp(html, REGEN_SCOPE) : {};
  const { HP } = loadHtmlMain(html);
  console.log('第322便b binbooks: ' + (quick ? '試走' : '正本') + '・子プロセス ' + NW);
  const self = fileURLToPath(import.meta.url);
  const R = await runAll(HP, { quick, plan: quick ? QUICK : PLAN, runner: (specs) => poolRun(specs, NW, self, TARGET) });
  const out = { version: HARNESS_VERSION, libVersion: B.LIB_VERSION, lib321bVersion: L.LIB_VERSION, generator: 'tests/exp-w322b-binbooks.mjs', target: TARGET, targetSha256, reuseFrom: null,
    ruling: '原仮定者の回答(2026-11-01 —— AN499)「『連星サンプル群』は実在天体を指している。検証サンプルが必要であれば、先に用意する」・決断事項 AN505・統括の検証項目 R271(策定の段 S2)。第322便e: 原仮定者の回答(2026-11-01 —— AN519)「c₀=30 に直す」—— 検証サンプル 2 本は c₀ = 30(統括の検証項目 R274)。エンジンの関数・在位の本の宣言・受理の判定は変えない(新しい ID の本 4 本 —— 連星の観測との照合ではない)',
    invSqVersion: HP.REL_DRAG_INVSQ_VERSION || null, geoModeVersion: HP.geoModeOf({}).version || null, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w322b-binbooks.mjs', 'tests/lib-w322b-binbooks.mjs', 'tests/exp-w321b-geo3bin.mjs', 'tests/lib-w321b-geo3bin.mjs', 'tests/lib-w304e-apsis.mjs', 'tests/lib-w320d-rulebooks.mjs', 'tests/lib-w315c-legacy7.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第322便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'binbooks',
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・子プロセス ' + NW + ')', notClaim: B.NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) { if (process.argv[2] === '--child') await child(process.argv[3]); else await main(); }

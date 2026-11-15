// 第339便a(原仮定者の回答(2026-11-14 —— AN712)「2 つ以上の量を同じノブで満たした候補だけを、既定 OFF の設定と『探索用・未較正』の本として入れる」・統括の検証項目 R355):
//   **回転引きずりの鉛直の型 physics.rotDragVert(既定 OFF・探索用・未較正)と本 🛟 saturnRotVertExplore3d の器**(段 rotvert-339a —— 正本 tests/out/rotvert-w339a.json・
//   lib tests/lib-w339a-rotvert.mjs —— 第337便i の lib を呼ぶ)。
//
// Node だけ(対象 html の inline script を tests/lib-w279b-headless.mjs の loadHtmlHeadless で vm に読み、html の本文の受理器・build・步をそのまま実行 —— 本の JSON は 1 bit も変えない)。
// 他の正本は読まない(候補の要る λ と 2 つの判定は第337便i の lib を呼んで測り直す)。
//
// ■ 何をするか(宣言 DECL は lib —— 走行の前に置く・結果を見て変えない)
//   candidate 候補の測り直し(lib の ringJudge と planetScaleRatios —— 要る λ・環の判定・4 惑星の尺度の内・水星の 1PN の比の床)
//   key       鍵の既定 OFF(DEFAULT_PHYSICS に無い・内蔵の本で宣言するのは 🛟 の 1 本だけ・fastParams の雛形の値は undefined)と受理の表(正準形・既定を書かない・拒否 7 例・A/B の null)
//   match     html の点の場 rotDragVertFieldAt と lib の effectOfSpec(slice・focus・Req・obs)の点ごとの照合(相対 1e-12・両方 0 の点 —— 帯の外と赤道面の上)
//             × 倍 2 つ(rdScale 1 —— 土星の Y_k m の R_eq・本の 2e6)× λ 2 つ(候補の 6.56e-7・本の 0.0656)× 軸 2 つ(本の +y・🍩 の土星の極)
//   step      1 步の照合(rotDragVertStep3 の後の位置 = 前の位置 + d·dt —— 同じ浮動小数の演算列で同じビット)
//   run       🛟 の走行(ON と鍵 OFF の写し —— 600・3000 步): 群ごとの赤道面からの高さの最大の比・解析の目安 exp(−λ s t/2)・群の比の広がり
// ■ 所要: 1 プロセス・数秒(第339便a の枝の実測は正本の elapsedS)
// ■ 言わないこと: 土星の環を回転引きずりで薄くした・環の厚みを決めた・法則である、とは書かない(探索用・未較正・このノブの組では)。見えるようにした倍率は表示のための宣言。
//
// 使い方: node tests/exp-w339a-rotvert.mjs   W339A_OUT=<json>(試走)・W339A_TARGET=<html>(既定 beta/index.html)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w339a-rotvert.mjs';
// 第281便a の領域 hash の宣言(版 8 —— 器と lib と import の閉包から deriveScope で引いた下限。器が引く本は 🛟 の 1 本〔.find —— physics と bodies を読む〕と、
//   既定 OFF の照合で全本の physics の鍵を読む〔presets "all"〕・エンジンを走らせる〔core:true〕・ワンタップ対照 A/B は走らせない〔abBody:false —— 鍵 OFF の写しは器が鍵を消して作る〕)
const REGEN_SCOPE = {"presets":"all","roots":["DEFAULT_PHYSICS","HP.allPresets","HP.coord3d","HP.validatePreset","T","appStepDt","ch","ctx","cw","fastParams"],"core":true,"consts":[],"complete":true,"abBody":false};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w339a-rotvert-1';
export const OUT_MAIN = 'tests/out/rotvert-w339a.json';
export const BOOK_ID = 'saturnRotVertExplore3d';
const SELF = fileURLToPath(import.meta.url);
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === SELF;
const clone = (x) => JSON.parse(JSON.stringify(x));

export const NOT_CLAIM = Object.freeze([
  '土星の環を回転引きずりで薄くしたとは主張しない —— 探索用・未較正の候補(このノブの組では)',
  '環の厚みを決めたとは主張しない —— 率が半径に依らないところまで(厚みの絶対の値は出していない)',
  '法則ではない —— 2 つの量(土星の環の物差し・4 惑星の尺度)を同じノブで満たした組を、既定 OFF の鍵として入れただけ',
  '見えるようにした倍率(強さ 1e5 倍・帯の厚み 2e6 倍)は表示のための宣言で、候補の値ではない',
  '4 天体の公転の変化(相対の速度の型)は同じノブで満たせていない —— 入れていない']);

/** 鍵の受理の表(html の受理器を直に) */
function acceptTable(HP, E) {
  const R = HP.rotDragVert, V = (x) => R.validate(clone(x)), base = { form: 'sliceFocus', source: 0, lambda: 0.0656, fFlat: 0.09796 };
  const rows = [
    ['正準形(既定の oblateQ・rdScale は書かない)', V({ ...base, oblateQ: 1 / 3, rdScale: 1 }), (r) => r.ok && JSON.stringify(r.rotDragVert) === JSON.stringify(base)],
    ['倍を書いた形', V({ ...base, rdScale: 2e6 }), (r) => r.ok && r.rotDragVert.rdScale === 2e6],
    ['null は「なし」', V(null), (r) => r.ok && r.rotDragVert === null],
    ['未知の鍵', V({ ...base, mode: 'x' }), (r) => !r.ok],
    ['form の外', V({ ...base, form: 'sliceVel' }), (r) => !r.ok],
    ['λ の外', V({ ...base, lambda: -1 }), (r) => !r.ok],
    ['扁平率の外', V({ ...base, fFlat: 0.95 }), (r) => !r.ok],
    ['源の添字が整数でない', V({ ...base, source: 0.5 }), (r) => !r.ok],
    ['倍の外', V({ ...base, rdScale: 1e12 }), (r) => !r.ok],
  ].map(([nm, r, f]) => ({ name: nm, ok: !!f(r) }));
  const book = clone(HP.allPresets().find((q) => q.id === BOOK_ID));
  const d2 = clone(book); delete d2.physics.coord; d2.bodies = [d2.bodies[0]]; delete d2.physics.approxMany; delete d2.abBody;
  const v2 = HP.validatePreset(d2);
  rows.push({ name: '二次元の本は拒否', ok: v2.ok === false && (v2.errors || []).some((e) => /rotDragVert/.test(e)) });
  const d3 = clone(book); d3.sampleClass = 'calibration';
  const v3 = HP.validatePreset(d3);
  rows.push({ name: '較正の本は拒否', ok: v3.ok === false && (v3.errors || []).some((e) => /rotDragVert/.test(e)) });
  const d4 = clone(book); d4.abBody = { label: { ja: 'x', en: 'x' }, physicsPatch: { rotDragVert: { form: 'sliceFocus', source: 0, lambda: 1, fFlat: 0 } } };
  const v4 = HP.validatePreset(d4);
  rows.push({ name: 'A/B の physicsPatch は null だけ(値は警告して無視)', ok: v4.ok === true && (v4.warnings || []).some((w) => /physicsPatch\.rotDragVert/.test(w)) });
  const v5 = HP.validatePreset(clone(book));
  rows.push({ name: '本の A/B は null を運ぶ', ok: v5.ok === true && v5.preset.abBody && v5.preset.abBody.physicsPatch && v5.preset.abBody.physicsPatch.rotDragVert === null });
  return { rows, ok: rows.every((r) => r.ok) };
}

/** 本を組む(受理器 → makeSim → build) */
function buildBook(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + (v.errors || []).join(' / '));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
/** 群ごとの赤道面からの高さの最大(源 0 の自転軸に沿った成分) */
function heights(S, groups) {
  const k = [S.sax[0], S.say[0], S.saz[0]];
  return groups.map(([a, b]) => { let mx = 0; for (let i = a; i <= b; i++) mx = Math.max(mx, Math.abs((S.x[i] - S.x[0]) * k[0] + (S.y[i] - S.y[0]) * k[1] + (S.z[i] - S.z[0]) * k[2])); return mx; });
}

export function measure(H) {
  const HP = H.HP, E = H.evalExpr, R = HP.rotDragVert;
  const presets = HP.allPresets(), book = clone(presets.find((q) => q.id === BOOK_ID));
  // ── 鍵の既定 OFF
  const DEF = E('DEFAULT_PHYSICS'), tmpl = E('fastParams')({});
  const declaring = presets.filter((q) => q.physics && q.physics[R.key] !== undefined).map((q) => q.id);
  const key = { version: R.version, name: R.key, forms: R.forms, inDefault: Object.prototype.hasOwnProperty.call(DEF, R.key), templateHasKey: Object.prototype.hasOwnProperty.call(tmpl, R.key),
    templateValueUndefined: tmpl[R.key] === undefined, declaring, nPresets: presets.length, liveDeclaringOnlyBook: declaring.length === 1 && declaring[0] === BOOK_ID,
    accept: acceptTable(HP, E) };
  // ── 本の宣言
  const ph = book.physics, b0 = book.bodies[0], decl = ph[R.key];
  const groups = [[1, 40], [41, 80], [81, 120]];
  // ── 点の照合(html の式 ↔ lib の式)
  const axes = { bookY: [Math.sin(Math.PI / 2) * Math.cos(Math.PI / 2), Math.sin(Math.PI / 2) * Math.sin(Math.PI / 2), Math.cos(Math.PI / 2)] };
  { const th = 28.0521622529 * Math.PI / 180, az = 79.5275088416 * Math.PI / 180; axes.saturnPole = [Math.sin(th) * Math.cos(az), Math.sin(th) * Math.sin(az), Math.cos(th)]; }
  const lamNeed = L.candidateCheck().lambdaNeed, match = [];
  for (const [axName, ax] of Object.entries(axes)) for (const rdScale of [1, L.DECL.visibility.rdScale]) for (const lambda of [lamNeed, decl.lambda]) {
    const v = { form: 'sliceFocus', source: 0, lambda, fFlat: decl.fFlat, rdScale }, Req = R.req(ph.G, ph.cLight, b0.m, v);
    const src = L.libSourceOf({ mApp: b0.m, sApp: b0.spin, fFlat: decl.fFlat, axis: ax }), libReq = L.libFieldApp(src, { lambda, rdScale }, [100, 0, 0]).ReqApp;
    const cmp = L.compareField((p) => R.fieldAt(p[0], p[1], p[2], ax[0], ax[1], ax[2], b0.spin, lambda, Req, [0, 0, 0]), (p) => L.libFieldApp(src, { lambda, rdScale }, p).d, L.matchPoints(ax, Req), { lambda, s: b0.spin });
    match.push({ axis: axName, rdScale, lambda, ReqApp: Req, ReqRelToLibBelowTol: Math.abs(Req / libReq - 1) <= L.DECL.matchTol, ...cmp });
  }
  // ── 1 步の照合
  const S1 = buildBook(HP, book), dt = E('appStepDt')(S1), xb = Array.from(S1.x), yb = Array.from(S1.y), zb = Array.from(S1.z);
  const Req1 = R.req(S1.params.G, S1.params.cLight, S1.m[0], S1.params[R.key]), k1 = [S1.sax[0], S1.say[0], S1.saz[0]], exp = [];
  for (let i = 1; i < S1.n; i++) { const d = R.fieldAt(xb[i] - xb[0], yb[i] - yb[0], zb[i] - zb[0], k1[0], k1[1], k1[2], S1.spin[0], S1.params[R.key].lambda, Req1, [0, 0, 0]); exp.push([xb[i] + d[0] * dt, yb[i] + d[1] * dt, zb[i] + d[2] * dt]); }
  R.step3(S1, dt);
  let same = 0; for (let i = 1; i < S1.n; i++) if (S1.x[i] === exp[i - 1][0] && S1.y[i] === exp[i - 1][1] && S1.z[i] === exp[i - 1][2]) same++;
  const step = { n: S1.n - 1, sameBits: same, ok: same === S1.n - 1, sourceUnmoved: S1.x[0] === xb[0] && S1.y[0] === yb[0] && S1.z[0] === zb[0] };
  // ── 本の走行(ON と鍵 OFF の写し)
  const off = clone(book); delete off.physics[R.key];
  const SA = buildBook(HP, book), SB = buildBook(HP, off), h0A = heights(SA, groups), h0B = heights(SB, groups);
  const sameStart = h0A.every((x, j) => x === h0B[j]);
  const run = { steps: L.DECL.steps.slice(), dt, sameStart, rows: [] };
  let done = 0;
  for (const N of L.DECL.steps) {
    for (; done < N; done++) { SA.step(dt); SB.step(dt); }
    const hA = heights(SA, groups), hB = heights(SB, groups), t = SA.t;
    const guide = L.tiltRatioGuide(decl.lambda, SA.spin[0], t);
    const final = N === L.DECL.steps[L.DECL.steps.length - 1], jd = L.runJudge(groups.map((g, j) => ({ r0: h0A[j], rN: hA[j] })), groups.map((g, j) => ({ r0: h0B[j], rN: hB[j] })), guide);
    run.rows.push({ steps: N, t, on: hA, off: hB, ratioOn: jd.ratioOn, ratioOff: jd.ratioOff, guide, judge: final ? jd : null, halt: SA.coord3dHalt || SB.coord3dHalt || null, nSteps: SA.rotDragVertN || 0, offNSteps: SB.rotDragVertN || 0 });
  }
  run.h0 = h0A; run.ReqApp = Req1; run.inBandAtStart = h0A.every((x) => x < Req1);
  return { key, book: { id: BOOK_ID, decl, spin: b0.spin, m: b0.m, axisDeclared: b0.spinAxis, nBodies: S1.n, groups, lambdaOverNeed: decl.lambda / lamNeed, rdScale: decl.rdScale }, match, step, run };
}

export function gatesOf(J) {
  const last = J.run.rows[J.run.rows.length - 1];
  return {
    candidate: J.candidate.bothMet === true && J.candidate.ringPoints === 15,
    defaultOff: J.key.inDefault === false && J.key.templateValueUndefined === true && J.key.liveDeclaringOnlyBook === true,
    accept: J.key.accept.ok === true,
    match: J.match.length === 8 && J.match.every((m) => m.ok && m.ReqRelToLibBelowTol),
    step: J.step.ok && J.step.sourceUnmoved,
    run: J.run.sameStart && J.run.inBandAtStart && J.run.rows.every((r) => r.halt === null && r.offNSteps === 0) && last.judge.ok,
    visibility: Math.abs(J.book.lambdaOverNeed / L.DECL.visibility.lambdaScale - 1) < 1e-3 && J.book.rdScale === L.DECL.visibility.rdScale,
    self: J.selfTest.ok === true,
  };
}

export async function main() {
  const TARGET = process.env.W339A_TARGET || 'beta/index.html';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const OUT = process.env.W339A_OUT ? (path.isAbsolute(process.env.W339A_OUT) ? process.env.W339A_OUT : path.join(ROOT, process.env.W339A_OUT)) : path.join(ROOT, OUT_MAIN);
  const t0 = Date.now(), text = fs.readFileSync(html, 'utf8'), targetSha256 = crypto.createHash('sha256').update(text).digest('hex');
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  console.log('第339便a rotvert(版 ' + HARNESS_VERSION + ')');
  const tc = Date.now(), candidate = L.candidateCheck(), candSec = (Date.now() - tc) / 1000;
  const tm = Date.now(), M = measure(H), measSec = (Date.now() - tm) / 1000;
  const J = { candidate, ...M, selfTest: L.selfTest(), pageErrors: H.errors.slice(0, 5), timing: { candidate: { wallSec: candSec }, measure: { wallSec: measSec } } };
  J.gates = gatesOf(J); J.ok = Object.values(J.gates).every(Boolean);
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w339a-rotvert.mjs', target: TARGET, targetSha256,
    ruling: '原仮定者の回答(2026-11-14 —— AN712)「2 つ以上の量を同じノブで満たした候補だけを、既定 OFF の設定と『探索用・未較正』の本として入れる」・統括の検証項目 R355',
    decl: L.DECL, notClaim: NOT_CLAIM, ...J };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w339a-rotvert.mjs', 'tests/lib-w339a-rotvert.mjs', 'tests/lib-w337i-rotring.mjs', 'tests/lib-w337b-mercuryband.mjs', 'tests/lib-w335c-mercurycombo.mjs', 'tests/lib-w334c-mercurynode.mjs',
    'tests/lib-w334a-heightlaw.mjs', 'tests/lib-w333c-mercury3d.mjs', 'tests/lib-w333b-axialfield.mjs', 'tests/lib-w333a-rotdiff.mjs', 'tests/lib-w332a-eqband.mjs', 'tests/lib-w330b-dragweight.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'].filter((f) => fs.existsSync(path.join(ROOT, f)));
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第339便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, stage: 'rotvert-339a', engine: 'Node(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文の受理器・build・步をそのまま実行)・🛟 の宣言の写しと鍵 OFF の写しを走らせる', notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

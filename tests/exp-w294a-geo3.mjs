// 第294便a(原仮定者の裁定(第84報)「慣性決定力版の earthMoonInertial が良好なので、パラメータで有効化を可能にする。その有効化を
// geoPN=3 のプリセットとする想定。引きずりを単純加算しない様に注意しつつ、処理の整理を進める」・統括の検証項目 R148)——
// **geoPN=3 を慣性決定力の有効化の印にする**器(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、
// エンジン本体を走らせる。1 プロセス)。
//
// ■ 何を測るか(門 —— どれも「ビット同一か」「名前と步が一致するか」の照合で、物理の合否ではない)
//   (a) 解決と走行の一致: 🌛 の宣言を geoPN=0 と geoPN=3 にした写しで、宣言の解決 geoModeOf(...).law・測地線・core と、build 後の
//       走行の実効番号 geoEffectiveMode(S)・geoLawOfSim(S)・pnOrbitalKF0(S.params,S)(kF0 でない = 1PN なし)を並べる。
//   (b) 🌛 の 2000 步(dt=0.016): geoPN=0 の写しと geoPN=3 の写しを同じ步で走らせ、步ごとに状態の指紋(x/y/vx/vy/spin/m/mEff/R・
//       PN 旗 pnOv・_pnOrb・慣性引きずりの u〔_rdUX/_rdUY〕・t)を比べる。最初に違った步(無ければ null)と最終状態の全配列の一致。
//   (c) 27 公転窓の近点周期(検出器 B〔位置だけ〕—— tests/exp-w292c-dragcore.mjs の runEM・windowFit と同じ式): geoPN=0 と geoPN=3 で
//       同じ値か(Object.is)。8 公転窓も記録する。
//   (d) 未宣言の 3(旧法則版も慣性も無い —— 🌙 の宣言を geoPN=3 にした写し): 現行どおり測地線 ON(law eih-kf0・実効 2・kF0・pnOv のビット 2 が立つ)。
//       慣性宣言の 3(🌛 の写し)は pnOv のビット 2 が立たない。
//   (e) パラメータでの宣言(geo3InertialDeclare —— 「パラメータ」タブの geoPN 行と同じ関数): 🌙 の宣言を geoPN=3 にして build した後に
//       gain 0 を宣言した走行が、🌙 の宣言を geoPN=0 にした走行(慣性なし)と 2000 步ビット同一。gain=🌛 の宣言値で宣言した走行が、
//       同じ gain を JSON で宣言した写し(relativeDrag:{law:"inertial",gain})と 2000 步ビット同一(同じ経路)。
//
// ■ しないこと・言わないこと
//   ・gain を再フィットしない(🌛 の宣言値のまま)。合成則は既定の solve(velocity)のまま —— compose を書かない(単純加算に戻さない)。
//   ・「月を再現した」「較正 合」「C_d は普遍定数」「GR の何 PN と同定」と書かない。8.85 年は gain のフィットの対象(推定)である。
//
// 実行(Node だけ・Chromium 不要):
//   node tests/exp-w294a-geo3.mjs            → 正本 tests/out/geo3-w294a.json(W294A_OUT で出力先を変える)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { runEM, windowFit } from './exp-w292c-dragcore.mjs';
const REGEN_SCOPE = {"presets":["earthMoonInertial","earthMoonReal"],"roots":["HP.DRAG_CORE_NR","HP.DRAG_CORE_VERSION","HP.MODE_POLICY_VERSION","HP.MODE_SAVE_WARN_CODES","HP.REL_DRAG_COMPOSE_DEFAULT","HP.REL_DRAG_INERTIAL_VERSION","HP.REL_DRAG_SOLVE_FROM_DEFAULT","HP.allPresets","HP.dfmGaussLegendre01","HP.dfmMeshVelocityFieldAt","HP.dragCoreAvgK","HP.dragCoreLookup","HP.dragCoreState","HP.geo3InertialDeclare","HP.geo3InertialOfferOf","HP.geoEffectiveMode","HP.geoLawOfSim","HP.geoModeOf","HP.inertialDragState","HP.modeSaveWarnings","HP.pnOrbitalKF0","HP.relDragComposeOf","HP.relDragSolveFromOf","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w294a-geo3-1';
export const BOOK_ID = 'earthMoonInertial';
export const BASE_ID = 'earthMoonReal';
export const RUN = Object.freeze({ dt: 0.016, steps: 2000, fitOrbits: 27, windows: [[0, 8], [0, 27]] });
const TARGET = 'beta/index.html';
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
const withGeo = (p, g) => { const q = clone(p); q.physics.geoPN = g; return q; };

/* ── 状態の指紋(FNV-1a —— Float64 のビット列。配列が無ければ鍵ごとに印を入れる)── */
const FIELDS = ['x', 'y', 'vx', 'vy', 'spin', 'm', 'mEff', 'R', 'pnOv', '_rdUX', '_rdUY'];
const PHYS = FIELDS.slice(0, 9);   // 慣性なしの走行と比べる指紋(u の配列は慣性を宣言した走行にだけある —— gain 0 の対照は状態と PN 旗で比べる)
function fingerprint(S, fields = FIELDS) {
  let a = 0x811c9dc5;
  const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
  const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
  for (const k of fields) {
    const A = S[k];
    if (!A) { push(-7777); continue; }
    for (let i = 0; i < S.n; i++) push(A[i]);
  }
  push(S.t); push(S._pnOrb === 1 ? 1 : 0); push(S.hasNaN() ? 1 : 0);
  return a.toString(16);
}
function snapshot(S, fields = FIELDS) {
  const o = { n: S.n, t: S.t, pnOrb: S._pnOrb === 1 ? 1 : 0 };
  for (const k of fields) o[k] = S[k] ? Array.from(S[k].subarray ? S[k].subarray(0, S.n) : S[k]) : null;
  return o;
}
const sameSnap = (A, B) => JSON.stringify(A, (k, v) => (typeof v === 'number' ? (Object.is(v, -0) ? '-0' : String(v)) : v))
  === JSON.stringify(B, (k, v) => (typeof v === 'number' ? (Object.is(v, -0) ? '-0' : String(v)) : v));

/** 宣言 → build。prep(S) は build 直後に呼ぶ(パラメータでの宣言の模擬)。 */
function buildFrom(HP, preset, prep) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset: ' + JSON.stringify(v.errors).slice(0, 300));
  HP.sim.build(v.preset);
  const S = HP.sim;
  const prepOut = prep ? prep(S) : null;
  return { S, warnings: v.warnings || [], prepOut };
}
function modeRow(HP, S) {
  const gm = HP.geoModeOf(S.params);
  return { geoPN: S.params.geoPN, law: gm.law, geodesic: gm.geodesic, core: gm.core, lambdaPN: gm.lambdaPN, standard: gm.standard,
    inertialDrag: gm.inertialDrag, ge: HP.geoEffectiveMode(S), lawOfSim: HP.geoLawOfSim(S), kf0: HP.pnOrbitalKF0(S.params, S),
    offer: HP.geo3InertialOfferOf(S), saveWarn: HP.modeSaveWarnings(S.params).map((w) => w.code) };
}
/** 2 本を同じ步で走らせて步ごとに指紋を比べる(1 プロセス・同じ sim を交互に作り直さないよう、先に A を全步・次に B を全步)。 */
function runPrints(HP, preset, prep, steps, dt, fields = FIELDS) {
  const { S, warnings, prepOut } = buildFrom(HP, preset, prep);
  const mode0 = modeRow(HP, S);
  const prints = [fingerprint(S, fields)];
  let pnBit2 = 0, kf0Steps = 0;
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    prints.push(fingerprint(S, fields));
    if (S.pnOv) for (let i = 0; i < S.n; i++) if (S.pnOv[i] & 2) { pnBit2++; break; }
    if (HP.pnOrbitalKF0(S.params, S)) kf0Steps++;
  }
  return { prints, final: snapshot(S, fields), fields: fields.length, mode: mode0, modeEnd: modeRow(HP, S), warnings: warnings.length, prepOut,
    pnBit2Steps: pnBit2, kf0Steps, nan: S.hasNaN(), ledger: (() => { const st = HP.inertialDragState(S); return st ? { reject: st.reject, boundOver: st.boundOver, uMax: st.uMax } : null; })() };
}
function compare(A, B) {
  let first = null;
  for (let k = 0; k < Math.max(A.prints.length, B.prints.length); k++) if (A.prints[k] !== B.prints[k]) { first = k; break; }
  return { firstDiffStep: first, identical: first === null && sameSnap(A.final, B.final), printEnd: [A.prints[A.prints.length - 1], B.prints[B.prints.length - 1]] };
}
const brief = (r) => ({ mode: r.mode, modeEnd: r.modeEnd, warnings: r.warnings, pnBit2Steps: r.pnBit2Steps, kf0Steps: r.kf0Steps, nan: r.nan, ledger: r.ledger, prepOut: r.prepOut });

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W294A_OUT || path.join(ROOT, 'tests', 'out', 'geo3-w294a.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const book = find(HP, BOOK_ID), base = find(HP, BASE_ID);
  const gainDecl = book.physics.relativeDrag.gain;
  const declared = { book: BOOK_ID, geoPN: book.physics.geoPN, activeParams: book.activeParams || null, compose: book.physics.relativeDrag.compose === undefined ? null : book.physics.relativeDrag.compose,
    composeOf: HP.relDragComposeOf(book.physics.relativeDrag), solveFromOf: HP.relDragSolveFromOf(book.physics.relativeDrag), gain: gainDecl, baseGeoPN: base.physics.geoPN };
  const { steps, dt } = RUN;
  // (a)(b) 🌛 の geoPN=0 と geoPN=3
  const b0 = runPrints(HP, withGeo(book, 0), null, steps, dt);
  const b3 = runPrints(HP, withGeo(book, 3), null, steps, dt);
  const bAsIs = runPrints(HP, book, null, steps, dt);
  const bookCmp = compare(b0, b3), asIsCmp = compare(b0, bAsIs);
  // (c) 27 公転窓
  const em = [0, 3].map((g) => { const raw = runEM(HP, withGeo(book, g), { dt, revMax: RUN.fitOrbits });
    return { geoPN: g, steps: raw.steps, wallSec: raw.wallSec, nan: raw.nan, revN: raw.rev.length, nB: raw.B.length, ledger: raw.ledger,
      windows: RUN.windows.map(([a, b]) => windowFit(raw, a, b)) }; });
  const em27 = em.map((r) => r.windows[1].apsPeriodYr), em8 = em.map((r) => r.windows[0].apsPeriodYr);
  const emSame = Object.is(em27[0], em27[1]) && Object.is(em8[0], em8[1]) && em[0].steps === em[1].steps
    && JSON.stringify(em[0].windows) === JSON.stringify(em[1].windows);
  // (d) 未宣言の 3(🌙 の宣言を geoPN=3)—— 現行どおり測地線 ON
  const u3 = runPrints(HP, withGeo(base, 3), null, 200, dt);
  const u1 = runPrints(HP, withGeo(base, 1), null, 200, dt);
  const undeclCmp = compare(u1, u3);   // 未宣言の 3 は geoPN=1(kF0)と同じ EIH の步(旧来の「2 へ丸め」と同じ数値)
  // (e) パラメータでの宣言
  const p0 = runPrints(HP, withGeo(base, 0), null, steps, dt, PHYS);
  const pG0 = runPrints(HP, withGeo(base, 3), (S) => { const off = HP.geo3InertialOfferOf(S); const r = HP.geo3InertialDeclare(S, 0); return { offerBefore: off, offerAfter: HP.geo3InertialOfferOf(S), ok: r.ok, relativeDrag: r.relativeDrag, law: r.law, ge: r.ge }; }, steps, dt, PHYS);
  const gainZeroCmp = compare(p0, pG0);
  const json = withGeo(base, 3); json.physics.relativeDrag = { law: 'inertial', gain: gainDecl };
  const pJ = runPrints(HP, json, null, steps, dt);
  const pP = runPrints(HP, withGeo(base, 3), (S) => { const r = HP.geo3InertialDeclare(S, gainDecl); return { ok: r.ok, relativeDrag: r.relativeDrag, law: r.law, ge: r.ge }; }, steps, dt);
  const paramJsonCmp = compare(pJ, pP);
  const pPphys = runPrints(HP, withGeo(base, 3), (S) => HP.geo3InertialDeclare(S, gainDecl).ok, steps, dt, PHYS);
  const paramMovedCmp = compare(p0, pPphys);   // gain>0 は動く(門ではなく対照 —— 宣言が効いていることの確認)

  const gates = {
    resolveRun: b3.mode.law === 'inertial-drag' && b3.mode.geodesic === false && b3.mode.lawOfSim === b3.mode.law && b3.mode.ge === 0 && b3.mode.kf0 === false
      && b0.mode.law === 'newton' && b0.mode.ge === 0 && b0.mode.kf0 === false && b3.mode.saveWarn.length === 0 && b0.mode.saveWarn.length === 0,
    book2000: bookCmp.identical && b3.pnBit2Steps === 0 && b3.kf0Steps === 0 && !b0.nan && !b3.nan,
    window27: emSame && em.every((r) => !r.nan && r.windows.every((w) => w.complete)),
    undeclared3: u3.mode.law === 'eih-kf0' && u3.mode.geodesic === true && u3.mode.ge === 2 && u3.mode.lawOfSim === u3.mode.law && u3.mode.kf0 === true
      && u3.pnBit2Steps > 0 && undeclCmp.identical && u3.mode.saveWarn.indexOf('geo3NoInertial') >= 0 && u3.mode.offer === true,
    paramGainZero: gainZeroCmp.identical && pG0.prepOut.ok && pG0.prepOut.offerBefore === true && pG0.prepOut.offerAfter === false
      && pG0.prepOut.law === 'inertial-drag' && pG0.prepOut.ge === 0 && !('compose' in (pG0.prepOut.relativeDrag || {})),
    paramSameAsJson: paramJsonCmp.identical && pP.prepOut.ok && paramMovedCmp.identical === false,
  };
  const out = {
    meta: null, declared,
    book: { run: RUN, geo0: brief(b0), geo3: brief(b3), asIs: brief(bAsIs), cmp03: bookCmp, cmpAsIs: asIsCmp },
    window: { rows: em, apsPeriodYr27: em27, apsPeriodYr8: em8, same: emSame },
    undeclared: { geo3: brief(u3), geo1: brief(u1), cmp13: undeclCmp, steps: 200 },
    param: { gainZero: { base0: brief(p0), declared: brief(pG0), cmp: gainZeroCmp }, gainDecl: { json: brief(pJ), param: brief(pP), cmp: paramJsonCmp, movedVsNoDrag: paramMovedCmp.identical === false } },
    gates, ok: Object.values(gates).every(Boolean),
  };
  const CODE = ['tests/exp-w294a-geo3.mjs', 'tests/exp-w292c-dragcore.mjs', 'tests/lib-w292c-dragcore.mjs', 'tests/lib-w293e-compose.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第294便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, modePolicy: HP.MODE_POLICY_VERSION, saveWarnCodes: HP.MODE_SAVE_WARN_CODES, inertialVersion: HP.REL_DRAG_INERTIAL_VERSION,
    composeDefault: [HP.REL_DRAG_COMPOSE_DEFAULT, HP.REL_DRAG_SOLVE_FROM_DEFAULT], loadErrors: errors.length,
    ruling: '原仮定者の裁定(第84報)(慣性決定力版の earthMoonInertial が良好なので、パラメータで有効化を可能にする。その有効化を geoPN=3 のプリセットとする想定。引きずりを単純加算しない様に注意しつつ、処理の整理を進める)',
    reading: '統括の検証項目 R148(geoPN=3 を慣性決定力の有効化の印にする —— 解決と走行を「測地線 OFF・1PN なし・法則 inertial-drag」に一致させる)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    gateBuiltin: '内蔵の本の基点とのビット同一は tests/exp-w258c-bitsame.mjs・tests/exp-w272d-sigsame.mjs で示す(基点 html が要るので本正本に載せない)',
    notClaim: ['月を再現した', '較正 合', 'C_d は普遍定数', 'GR の何 PN と同定', '8.85 年を較正ゼロで出した'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(`🌛 geoPN 0 vs 3: 2000 步 identical ${bookCmp.identical}(最初の差 ${bookCmp.firstDiffStep})・as-is(geoPN=${declared.geoPN})vs 0 ${asIsCmp.identical}`);
  console.log(`27 公転窓の近点周期 ${em27.join(' / ')} 年・8 公転 ${em8.join(' / ')} 年・同値 ${emSame}`);
  console.log(`未宣言の 3: law ${u3.mode.law}・ge ${u3.mode.ge}・pnOv bit2 步 ${u3.pnBit2Steps}・geoPN=1 と同一 ${undeclCmp.identical}`);
  console.log(`パラメータ宣言: gain 0 ≡ 慣性なし ${gainZeroCmp.identical}・gain ${gainDecl} ≡ JSON 宣言 ${paramJsonCmp.identical}`);
  console.log('gates ' + JSON.stringify(gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}

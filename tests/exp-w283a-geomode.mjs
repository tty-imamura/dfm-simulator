// 第283便a(原仮定者の裁定(2026-09-26 追加)「geoPN の整理」・原仮定者の裁定(第73報)AN23・統括の検証項目 R83)——
// **geoPN 共通化便の器**。
//
// ■ 何を測るか(Node だけ —— 対象 html と基点 html の inline script を tests/lib-w279b-headless.mjs で読み、物理コードは html の本文そのまま)
//   (a) 導出表: 内蔵 141 本の geoPN・kFrame・λ_PN(1PN の有無)・spaceMesh・core(`S._core` へ渡す番号)・役割・整合・互換を
//       html の `geoModeOf`(1 か所)で引く。受理器の契約(geoPN=1 に kFrame≠0 を拒否・丸めない / geoPN=2・kFrame=0 は互換入力 /
//       geoPN=0 の kFrame は書き換えない)を器の中の宇宙で確かめる。
//   (b) 共通化の前後: 基点 html(既定 `git show de9e39b:beta/index.html` —— 一時ファイル・終了後に削除)と現行 html で、
//       内蔵 141 本を `HP.loadPreset` から 1 歩と 128 歩(dt=0.016)走らせ、位置・速度・自転をビットで比べる。署名(presetSig)も比べる。
//   (c) kF0 走行: 較正母集団 37 本の kF0 の診断コピー(calaudit の `__w249build(id, true)` と同じ規則)を、第283便a の規則
//       (geoPN=2 → 1)と旧規則(geoPN=2 のまま)で 128 歩 —— 同じ html でビット比較し、現行の新規則と基点の旧規則もビット比較する。
//       kF0 診断コピー 7 本のうち宣言を 2→1 へ移した 4 本も、現行(geoPN=1)と基点(geoPN=2)・現行で geoPN=2 に戻した写しと比べる。
//   (d) ⭐ binary と geoPN:1 の内蔵: 自由二体の 1 歩の Σm·vx(基点 = 反作用を返さない旧則 / 現行)・束縛二体(質量比 1/1・2/1・
//       c=10・dt=0.01・20 公転)の近点移動比 Δϖ/Δϖ_GR を正式の判定器の抽出器で測り、解析(旧則 1−11ν/3・反作用を返す則 1−10ν/3)
//       と並べる・⭐ 本体(QA behavior.binary と同じ 6000 步)の間隔・円盤保持・Σm·v・☿ mercury 5000 歩と VERIFY の V18 の前後。
//
// ■ 測定演算子: 近点移動は正式の判定器 `tests/exp-w249b-calaudit.mjs` のページ側ヘルパ(近点抽出 A・近点位相の直線 fit)を
//   **ソースの文字列のまま**取り出して評価する(`extractCalauditHelpers` —— 写しを持たない)。
//
// ■ 言わないこと: 「観測一致を達成した」「較正を完了した」「kF0 版が成立した」「精度を上げれば成立する」。Σm·v は状態変数の和で、
//   相対論的な全運動量ではない。
//
// 環境変数: `W283A_BASE_REV`(基点の版 —— 既定 de9e39b)/ `W283A_BASE_HTML`(基点 html を既に持っているときのパス・ROOT 相対)/
//   `QA_TARGET`(対象 html —— 既定 beta/index.html)。他の正本は読まない。
// 実行: node tests/exp-w283a-geomode.mjs
// 出力: tests/out/geomode-w283a.json(来歴 w272e-1・領域 hash つき)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { extractCalauditHelpers } from './lib-w280a-mercury.mjs';
import * as G1 from './lib-w282b-geo1.mjs';
import * as L from './lib-w283a-geomode.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の規約: この器が読む html の領域(1 行の JSON —— `lint.regenScope` が機械の下限と照合する)
const REGEN_SCOPE = {"presets":"all","roots":["DT","GEO_CORE_PN","GEO_MODE_ROLE","GEO_MODE_VERSION","HP.allPresets","HP.coreState","HP.loadPreset","HP.setKernelForceGeneric","HP.sim","HP.validatePreset","VERIFY","geoCoreDispatch","geoModeOf","makeSim","presetSig","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'geomode-w283a.json');
const CALAUDIT = 'tests/exp-w249b-calaudit.mjs';
export const HARNESS_VERSION = 'w283a-geomode-1';
const BASE_REV = process.env.W283A_BASE_REV || 'de9e39b';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
const t0 = Date.now();
const log = (...a) => console.error('[w283a]', ((Date.now() - t0) / 1000).toFixed(0) + 's', ...a);
const J = (o) => JSON.stringify(o);
const deg = (rad) => rad * 180 / Math.PI;
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');

// ---------------------------------------------------------------- 文脈(現行 HN と基点 HB)
const htmlAbs = path.join(ROOT, TARGET);
let baseAbs, tmpDir = null;
if (process.env.W283A_BASE_HTML) baseAbs = path.join(ROOT, process.env.W283A_BASE_HTML);
else {
  tmpDir = fs.mkdtempSync(path.join(ROOT, 'tests', 'out', '.w283a-geomode-'));
  baseAbs = path.join(tmpDir, 'base.html');
  fs.writeFileSync(baseAbs, execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':beta/index.html'], { maxBuffer: 64 << 20 }));
}
const baseSha = sha(baseAbs), nowSha = sha(htmlAbs);
const HN = loadHtmlHeadless(htmlAbs);
const HB = loadHtmlHeadless(baseAbs);
if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
if (!HN.HP || !HB.HP) throw new Error('HP が無い');
const DT = HN.evalExpr('DT');

// 文脈に置く小関数(配列は vm の中で Array.from —— 数はそのまま〔−0 も〕持ち出す)
const CTX = `globalThis.__w283a = {
  snap(){ const S=HP.sim, n=S.n; const A=(k)=>Array.from(S[k].subarray(0,n));
    return { n, t:S.t, x:A('x'), y:A('y'), vx:A('vx'), vy:A('vy'), spin:A('spin'), nan:S.hasNaN(), kKind:S._kKind,
      geoPN:S.params.geoPN, kFrame:S.params.kFrame }; },
  loaded(id, dt, s1, s2){ HP.loadPreset(id, false); const S=HP.sim; for(let k=0;k<s1;k++) S.step(dt); const a=this.snap();
    for(let k=s1;k<s2;k++) S.step(dt); return { one:a, many:this.snap() }; },
  built(p, dt, steps, gen){ const v=HP.validatePreset(JSON.parse(JSON.stringify(p)));
    if(!v.ok) return { ok:false, errors:v.errors };
    HP.sim.build(v.preset); HP.setKernelForceGeneric(!!gen);
    try{ for(let k=0;k<steps;k++) HP.sim.step(dt); } finally { HP.setKernelForceGeneric(false); }
    return Object.assign({ ok:true, warnings:(v.warnings||[]).length, geoPN:v.preset.physics.geoPN, kFrame:v.preset.physics.kFrame }, this.snap()); },
  sig(id){ return presetSig(HP.allPresets().find((q)=>q.id===id)); },
};`;
HN.evalExpr(CTX); HB.evalExpr(CTX);
const presets = HN.evalExpr('HP.allPresets().map((p)=>JSON.parse(JSON.stringify(p)))');
const basePresets = HB.evalExpr('HP.allPresets().map((p)=>JSON.parse(JSON.stringify(p)))');
const byId = (arr, id) => arr.find((p) => p.id === id);

// ---------------------------------------------------------------- (a) 導出表と受理器
const derive = { rows: [], byMode: {}, byRole: {}, n: 0, htmlVersion: HN.evalExpr('GEO_MODE_VERSION'),
  coreTable: Array.from(HN.evalExpr('GEO_CORE_PN')) };
{
  for (const p of presets) {
    const g = HN.evalExpr(`geoModeOf(HP.allPresets().find((q)=>q.id===${J(p.id)}).physics)`);
    const v = HN.evalExpr(`(()=>{ const v=HP.validatePreset(JSON.parse(JSON.stringify(HP.allPresets().find((q)=>q.id===${J(p.id)}))));
      return { ok:v.ok, warnings:(v.warnings||[]).length, compat:v.geoCompat?Object.assign({},v.geoCompat):null }; })()`);
    const row = { id: p.id, emoji: p.emoji, sampleClass: p.sampleClass || null, familyId: p.familyId || null,
      geoPN: g.geoPN, mode: g.mode, lambdaPN: g.lambdaPN, lambdaPNCoef: g.lambdaPNCoef, kFrame: g.kFrame, spaceMesh: g.spaceMesh,
      core: g.core, role: g.role, consistent: g.consistent, compat: g.compat,
      validatorOk: v.ok, validatorWarnings: v.warnings, builtinPending: v.compat ? v.compat.builtinPending : null };
    derive.rows.push(row);
    derive.byMode[g.mode] = (derive.byMode[g.mode] || 0) + 1;
    derive.byRole[g.role] = (derive.byRole[g.role] || 0) + 1;
  }
  derive.n = derive.rows.length;
  derive.inconsistent = derive.rows.filter((r) => !r.consistent).map((r) => r.id);
  derive.validatorNg = derive.rows.filter((r) => !r.validatorOk).map((r) => r.id);
  derive.compatPending = derive.rows.filter((r) => r.compat).map((r) => r.id);
  derive.compatPendingCalibration = derive.rows.filter((r) => r.compat && r.sampleClass === 'calibration').map((r) => r.id);
  derive.geo0Calibration = derive.rows.filter((r) => r.mode === 0 && r.sampleClass === 'calibration').map((r) => r.id);
  derive.geo1 = derive.rows.filter((r) => r.mode === 1).map((r) => r.id);
  derive.lambdaPNCoefNot1 = derive.rows.filter((r) => r.lambdaPNCoef !== 1).map((r) => r.id + ':' + r.lambdaPNCoef);
  log(`(a) ${derive.n} 本: mode ${J(derive.byMode)} ・ 不整合 ${derive.inconsistent.length} ・ 受理 NG ${derive.validatorNg.length} ・ 互換 ${derive.compatPending.length}`);
}
const validator = { cases: [] };
{
  const two = (ph) => ({ id: 'w283a_probe', name: 'p', description: 'd', sampleClass: 'principle', camera: { scale: 100 },
    world: { boundary: 'none', size: 0 }, physics: Object.assign({ G: 1, D0: 2, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, cLight: 30,
      lambdaPN: 1, pnAlpha: 1.5, softening: 0.5 }, ph),
    bodies: [{ type: 'single', m: 10, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }, { type: 'single', m: 1, x: 20, y: 0, vx: 0, vy: 0.7, spin: 0, pinned: false }] });
  const CASES = [
    { key: 'g1k1', label: 'geoPN=1・kFrame=1', p: two({ geoPN: 1, kFrame: 1 }), want: 'reject' },
    { key: 'g1k03', label: 'geoPN=1・kFrame=0.3(宣言なしの分数)', p: two({ geoPN: 1, kFrame: 0.3 }), want: 'reject(丸めない)' },
    { key: 'g1kDefault', label: 'geoPN=1・kFrame 未記入(既定 1)', p: (() => { const q = two({ geoPN: 1 }); return q; })(), want: 'reject' },
    { key: 'g1k0', label: 'geoPN=1・kFrame=0', p: two({ geoPN: 1, kFrame: 0 }), want: 'accept・警告 0' },
    { key: 'g2k0', label: 'geoPN=2・kFrame=0(内蔵でない入力)', p: two({ geoPN: 2, kFrame: 0 }), want: 'accept・互換・警告 1' },
    { key: 'g2k0builtin', label: '☄️ mercuryReal(内蔵の geoPN=2・kFrame=0)', p: byId(presets, 'mercuryReal'), want: 'accept・互換(移行待ち)・警告 0' },
    { key: 'g2k1', label: 'geoPN=2・kFrame=1', p: two({ geoPN: 2, kFrame: 1 }), want: 'accept・警告 0' },
    { key: 'g0k1', label: 'geoPN=0・kFrame=1', p: two({ geoPN: 0, kFrame: 1 }), want: 'accept・kFrame は書き換えない' },
  ];
  for (const c of CASES) {
    const ev = (H) => H.evalExpr(`(()=>{ const v=HP.validatePreset(${J(c.p)});
      return { ok:v.ok, errors:(v.errors||[]).slice(), warnings:(v.warnings||[]).slice(), snapped:v.kFrameSnapped||null,
        compat:v.geoCompat?Object.assign({},v.geoCompat):null, kFrame:v.ok?v.preset.physics.kFrame:null, geoPN:v.ok?v.preset.physics.geoPN:null }; })()`);
    const now = ev(HN), base = ev(HB);
    validator.cases.push({ key: c.key, label: c.label, want: c.want,
      now: { ok: now.ok, nErrors: now.errors.length, error: now.errors.find((e) => /geoPN=1/.test(e)) || null, nWarnings: now.warnings.length,
        warning: now.warnings.find((w) => /互換入力/.test(w)) || null, snapped: now.snapped, compat: now.compat, kFrame: now.kFrame, geoPN: now.geoPN },
      base: { ok: base.ok, nWarnings: base.warnings.length, kFrame: base.kFrame, geoPN: base.geoPN } });
  }
  const c = (k) => validator.cases.find((z) => z.key === k).now;
  validator.contract = {
    rejectG1K1: c('g1k1').ok === false && !!c('g1k1').error && /原仮定者の裁定/.test(c('g1k1').error),
    rejectG1Frac: c('g1k03').ok === false && c('g1k03').snapped === null,
    rejectG1Default: c('g1kDefault').ok === false,
    acceptG1K0: c('g1k0').ok === true && c('g1k0').nWarnings === 0 && c('g1k0').compat === null,
    compatG2K0: c('g2k0').ok === true && c('g2k0').nWarnings === 1 && !!c('g2k0').warning && c('g2k0').compat && c('g2k0').compat.builtinPending === false
      && c('g2k0').geoPN === 2 && c('g2k0').kFrame === 0,
    compatBuiltin: c('g2k0builtin').ok === true && c('g2k0builtin').nWarnings === 0 && c('g2k0builtin').compat && c('g2k0builtin').compat.builtinPending === true,
    acceptG2K1: c('g2k1').ok === true && c('g2k1').nWarnings === 0 && c('g2k1').compat === null,
    keepG0K1: c('g0k1').ok === true && c('g0k1').kFrame === 1 && c('g0k1').geoPN === 0,
  };
  validator.allOk = Object.values(validator.contract).every(Boolean);
  log('(a) 受理器: ' + Object.entries(validator.contract).map(([k, v]) => k + ' ' + v).join(' ・ '));
}

// ---------------------------------------------------------------- (b) 共通化の前後(内蔵 141 本・1 歩と 128 歩・署名)
const N_MANY = 128;
const before = { n: 0, steps: [1, N_MANY], dt: DT, rows: [], diff1: [], diff128: [], sigDiff: [], onlyNow: [], onlyBase: [] };
{
  const ids = presets.map((p) => p.id);
  before.onlyNow = ids.filter((id) => !byId(basePresets, id));
  before.onlyBase = basePresets.map((p) => p.id).filter((id) => !ids.includes(id));
  for (const id of ids) {
    if (!byId(basePresets, id)) continue;
    const a = HN.evalExpr(`__w283a.loaded(${J(id)}, ${DT}, 1, ${N_MANY})`);
    const b = HB.evalExpr(`__w283a.loaded(${J(id)}, ${DT}, 1, ${N_MANY})`);
    const c1 = L.bitCompare(a.one, b.one), c2 = L.bitCompare(a.many, b.many);
    const sN = HN.evalExpr(`__w283a.sig(${J(id)})`), sB = HB.evalExpr(`__w283a.sig(${J(id)})`);
    const row = { id, emoji: byId(presets, id).emoji, n: a.many.n, hashNow: L.stateHash(a.many), hashBase: L.stateHash(b.many),
      bitSame1: c1.bitSame, bitSame128: c2.bitSame, maxPos128: c2.maxPos, nanNow: a.many.nan, sigSame: sN === sB, sigLenNow: sN.length, sigLenBase: sB.length };
    before.rows.push(row);
    if (!c1.bitSame) before.diff1.push(id);
    if (!c2.bitSame) before.diff128.push(id);
    if (!row.sigSame) before.sigDiff.push(id);
  }
  before.n = before.rows.length;
  before.bitSame1 = before.n - before.diff1.length;
  before.bitSame128 = before.n - before.diff128.length;
  before.sigSame = before.n - before.sigDiff.length;
  before.expectedDiff = ['binary'];
  before.matchesExpectation = J(before.diff128) === J(before.expectedDiff) && J(before.diff1) === J(before.expectedDiff);
  log(`(b) 1 歩 ${before.bitSame1}/${before.n} ・ 128 歩 ${before.bitSame128}/${before.n}(差 ${before.diff128.join(',')})・ 署名 ${before.sigSame}/${before.n}(差 ${before.sigDiff.join(',')})`);
}

// ---------------------------------------------------------------- (c) kF0 走行(較正 37 本 + 診断コピー)
const kf0 = { n: 0, steps: N_MANY, dt: DT, rows: [], diag: [], rule: 'calaudit の __w249build(id, true): kFrame=0。第283便a で geoPN=2 → 1(0・3 は書き換えない)' };
{
  const cal = presets.filter((p) => p.sampleClass === 'calibration');
  for (const p of cal) {
    const pn = L.kf0Copy(p, 'w283a'), po = L.kf0Copy(p, 'old');
    const pb = L.kf0Copy(byId(basePresets, p.id), 'old');
    const a = HN.evalExpr(`__w283a.built(${J(pn)}, ${DT}, ${N_MANY}, false)`);
    const b = HN.evalExpr(`__w283a.built(${J(po)}, ${DT}, ${N_MANY}, false)`);
    const c = HB.evalExpr(`__w283a.built(${J(pb)}, ${DT}, ${N_MANY}, false)`);
    const same = L.bitCompare(a, b), cross = L.bitCompare(a, c);
    kf0.rows.push({ id: p.id, emoji: p.emoji, declaredGeoPN: p.physics.geoPN, declaredKFrame: p.physics.kFrame,
      copyGeoPN: a.geoPN, oldCopyGeoPN: b.geoPN, n: a.n, okNow: a.ok, okOld: b.ok, okBase: c.ok, warningsNow: a.warnings, warningsOld: b.warnings,
      bitSameNowNewVsOld: same.bitSame, bitSameNowVsBase: cross.bitSame, maxPosNowVsBase: cross.maxPos, nan: a.nan });
  }
  kf0.n = kf0.rows.length;
  kf0.bitSameNow = kf0.rows.filter((r) => r.bitSameNowNewVsOld).length;
  kf0.bitSameCross = kf0.rows.filter((r) => r.bitSameNowVsBase).length;
  kf0.migratedToGeo1 = kf0.rows.filter((r) => r.copyGeoPN === 1 && r.declaredGeoPN === 2).length;
  kf0.keptGeo0 = kf0.rows.filter((r) => r.copyGeoPN === 0).map((r) => r.id);
  for (const d of L.KF0_DIAG_COPIES) {
    const p = byId(presets, d.id), pb = byId(basePresets, d.id);
    const a = HN.evalExpr(`__w283a.built(${J(p)}, ${DT}, ${N_MANY}, false)`);
    const c = HB.evalExpr(`__w283a.built(${J(pb)}, ${DT}, ${N_MANY}, false)`);
    const back = JSON.parse(J(p)); if (back.physics.geoPN === 1) back.physics.geoPN = 2;
    const b = HN.evalExpr(`__w283a.built(${J(back)}, ${DT}, ${N_MANY}, false)`);
    kf0.diag.push({ id: d.id, emoji: d.emoji, geoPNNow: p.physics.geoPN, geoPNBase: pb.physics.geoPN, kFrame: p.physics.kFrame,
      migrated: L.KF0_MIGRATED.includes(d.id), okNow: a.ok, okBase: c.ok,
      bitSameNowVsBase: L.bitCompare(a, c).bitSame, bitSameNowVsGeo2Copy: L.bitCompare(a, b).bitSame, warningsNow: a.warnings });
  }
  kf0.diagBitSame = kf0.diag.filter((r) => r.bitSameNowVsBase && r.bitSameNowVsGeo2Copy).length;
  log(`(c) 較正 ${kf0.n} 本の kF0 走行: 新規則 vs 旧規則 ${kf0.bitSameNow}/${kf0.n} ・ 現行 vs 基点 ${kf0.bitSameCross}/${kf0.n}(geoPN 2→1 ${kf0.migratedToGeo1} 本・0 のまま ${kf0.keptGeo0.join(',')})・ 診断コピー ${kf0.diagBitSame}/${kf0.diag.length}`);
}

// ---------------------------------------------------------------- (d) ⭐ binary と geoPN:1 の内蔵
const binary = {};
{
  // (d1) 自由二体の 1 歩の Σm·vx(lib-w282b の宇宙 —— QA behavior.geo1Momentum と同じ)
  const R = L.GEO1_MOMENTUM_RECORD_W283A;
  const pxOf = (s, p) => p.bodies[0].m * s.vx[0] + p.bodies[1].m * s.vx[1];
  const rows = [];
  for (const law of Object.keys(R.px)) R.dts.forEach((dt, i) => {
    const p = G1.lawVariant(law, G1.freeTwoBody());
    const a = HN.evalExpr(`__w283a.built(${J(p)}, ${dt}, 1, false)`), g = HN.evalExpr(`__w283a.built(${J(p)}, ${dt}, 1, true)`);
    const b = HB.evalExpr(`__w283a.built(${J(p)}, ${dt}, 1, false)`);
    rows.push({ law, dt, pxNow: pxOf(a, p), pxBase: pxOf(b, p), record: R.px[law][i], kernelBitSame: L.bitCompare(a, g).bitSame,
      recordOk: L.relErr(pxOf(a, p), R.px[law][i]) <= 1e-12 && ((R.px[law][i] === 0) === (pxOf(a, p) === 0)) });
  });
  const g1 = rows.filter((r) => r.law === 'g1');
  binary.oneStep = { rows, base: g1.map((r) => r.pxBase), now: g1.map((r) => r.pxNow), recordMatches: rows.every((r) => r.recordOk),
    kernelBitSameAll: rows.every((r) => r.kernelBitSame),
    g1EqualsG2Now: R.dts.every((dt) => { const x = rows.find((r) => r.law === 'g1' && r.dt === dt), y = rows.find((r) => r.law === 'g2' && r.dt === dt); return x.pxNow === y.pxNow; }) };
  log(`(d1) 自由二体の 1 歩の Σm·vx(geoPN=1): 基点 ${binary.oneStep.base.map((x) => x.toExponential(6)).join(' / ')} → 現行 ${binary.oneStep.now.join(' / ')} ・ 記録一致 ${binary.oneStep.recordMatches}`);

  // (d2) 束縛二体の近点移動比(正式の抽出器・判定器の run —— Node の vm)
  const calSrc = fs.readFileSync(path.join(ROOT, CALAUDIT), 'utf8');
  const helperBody = extractCalauditHelpers(calSrc);
  const PERI_WINDOW = Number((calSrc.match(/const PERI_WINDOW = (\d+);/) || [])[1]);
  const HOOK = `(function(){
    const ORIG = window.__w249build;
    window.__w283aVariants = {};
    window.__w249build = (id, kFrame0) => {
      const V = window.__w283aVariants[id];
      if (!V) return ORIG(id, kFrame0);
      const v = HP.validatePreset(JSON.parse(JSON.stringify(V)));
      if (!v.ok) throw new Error('器の中の宇宙が受理されない: ' + id + ' / ' + JSON.stringify(v.errors || ''));
      HP.sim.build(v.preset);
      return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset), kFrameApplied: (v.preset.physics || {}).kFrame };
    };
  })()`;
  for (const H of [HN, HB]) { H.evalExpr('(function(PERI_WINDOW){' + helperBody + '})(' + PERI_WINDOW + ')'); H.evalExpr(HOOK); }
  const runPeri = (H, p, dt, orbMax) => {
    H.evalExpr(`window.__w283aVariants[${J(p.id)}] = ${J(p)};`);
    const b0 = H.evalExpr(`window.__w249build(${J(p.id)}, false)`);
    const Gv = H.evalExpr('HP.sim.params.G');
    const tg = [{ ci: b0.map[0], oi: b0.map[1], label: p.id }];
    const osc0 = H.evalExpr(`window.__w249osc0(${tg[0].ci}, ${tg[0].oi}, ${Gv})`);
    const maxSteps = Math.ceil((orbMax + 1.5) * osc0.P / dt);
    const r = H.evalExpr(`window.__w249run(${J(p.id)}, ${dt}, ${maxSteps}, ${J(tg)}, ${orbMax}, ${Gv}, false)`);
    const t = r.targets[0];
    return { slopeDegA: t.A.slopeDeg, nPeriA: t.A.nPeri, nan: r.nan, clamp: r.clamp, osc0: { a: osc0.a, e: osc0.e, P: osc0.P, mu: osc0.mu } };
  };
  binary.ratios = [];
  for (const pr of [{ key: '1/1', m1: 1, m2: 1 }, { key: '2/1', m1: 2, m2: 1 }]) {
    const c = 10, dt = 0.01, nu = pr.m1 * pr.m2 / (pr.m1 + pr.m2) ** 2;
    const mk = (law) => G1.lawVariant(law, G1.boundBinary({ id: 'w283a_bin_' + pr.key.replace('/', 'x'), m1: pr.m1, m2: pr.m2, a: 10, e: 0.3, physics: { cLight: c } }));
    const nNew = runPeri(HN, mk('newton'), dt, 20), g1Now = runPeri(HN, mk('g1'), dt, 20), g2Now = runPeri(HN, mk('g2'), dt, 20);
    const nBase = runPeri(HB, mk('newton'), dt, 20), g1Base = runPeri(HB, mk('g1'), dt, 20);
    const o = nNew.osc0, gr = deg(G1.gr1pnAdvanceRad({ GM: o.mu, c, a: o.a, e: o.e }));
    const an = L.analyticRatios(nu, 0.3);
    binary.ratios.push({ pair: pr.key, nu, c, dt, orbits: 20, grDeg: gr,
      baseRatio: (g1Base.slopeDegA - nBase.slopeDegA) / gr, nowRatio: (g1Now.slopeDegA - nNew.slopeDegA) / gr,
      nowGeo2Ratio: (g2Now.slopeDegA - nNew.slopeDegA) / gr, g1BitSameAsG2Now: g1Now.slopeDegA === g2Now.slopeDegA,
      analyticOld: an.oldGeo1, analyticReaction: an.reaction, closedOld: an.closedOld, closedReaction: an.closedReaction,
      nPeri: g1Now.nPeriA, nan: g1Now.nan || g1Base.nan, clamp: g1Now.clamp + g1Base.clamp });
    const z = binary.ratios[binary.ratios.length - 1];
    log(`(d2) ${pr.key} ν=${nu.toFixed(4)}: 基点 ${z.baseRatio.toFixed(5)}(解析 1−11ν/3=${z.closedOld.toFixed(5)})→ 現行 ${z.nowRatio.toFixed(5)}(解析 1−10ν/3=${z.closedReaction.toFixed(5)})・ geoPN=2 と同一 ${z.g1BitSameAsG2Now}`);
  }

  // (d3) ⭐ 本体(QA behavior.binary と同じ: c₀=30 世代の步数 3000×2)
  const binRun = (H) => H.evalExpr(`(()=>{ HP.loadPreset('binary', false); const S=HP.sim;
    const P=()=>{ let px=0,py=0,pS=0; for(let i=0;i<S.n;i++){ px+=S.m[i]*S.vx[i]; py+=S.m[i]*S.vy[i]; pS+=S.m[i]*Math.hypot(S.vx[i],S.vy[i]); } return {px,py,pS}; };
    const p0=P(); for(let k=0;k<6000;k++) S.step(0.016); const p1=P();
    const stars=[], rest=[]; let keep=0, free=0;
    for(let i=0;i<S.n;i++){ if(S.m[i]>100){ stars.push(i); continue; } free++; if(Math.hypot(S.x[i],S.y[i])<400) keep++; }
    const sep=Math.hypot(S.x[stars[0]]-S.x[stars[1]], S.y[stars[0]]-S.y[stars[1]]);
    return { steps:6000, sep, keep, free, nan:S.hasNaN(), dPx:p1.px-p0.px, dPy:p1.py-p0.py, pS0:p0.pS, kFrame:S.params.kFrame, geoPN:S.params.geoPN,
      star:[S.x[stars[0]],S.y[stars[0]],S.x[stars[1]],S.y[stars[1]]] }; })()`);
  const bN = binRun(HN), bB = binRun(HB);
  binary.preset = { base: bB, now: bN, starPosDiff: Math.hypot(bN.star[0] - bB.star[0], bN.star[1] - bB.star[1]),
    dPrelBase: Math.hypot(bB.dPx, bB.dPy) / bB.pS0, dPrelNow: Math.hypot(bN.dPx, bN.dPy) / bN.pS0 };
  log(`(d3) ⭐ 6000 步: 間隔 ${bB.sep.toFixed(2)} → ${bN.sep.toFixed(2)} ・ 円盤 ${bB.keep}/${bB.free} → ${bN.keep}/${bN.free} ・ |ΔΣm·v|/Σm|v| ${binary.preset.dPrelBase.toExponential(3)} → ${binary.preset.dPrelNow.toExponential(3)}`);

  // (d4) ☿ mercury と VERIFY の V18(固定源 —— 反作用の分岐に入らない)
  const m0 = HN.evalExpr(`__w283a.loaded('mercury', 0.016, 1, 5000)`), m1 = HB.evalExpr(`__w283a.loaded('mercury', 0.016, 1, 5000)`);
  const v0 = J(HN.evalExpr('VERIFY._pnRuns()')), v1 = J(HB.evalExpr('VERIFY._pnRuns()'));
  binary.fixedSource = { mercury: { steps: 5000, bitSame: L.bitCompare(m0.many, m1.many).bitSame }, verify_v18: { bitSame: v0 === v1 } };
  log(`(d4) ☿ 5000 歩 ${binary.fixedSource.mercury.bitSame} ・ V18 ${binary.fixedSource.verify_v18.bitSame}`);
}

// ---------------------------------------------------------------- 出力
const out = {
  meta: provenanceMeta({ root: ROOT, wave: '第283便a', target: TARGET, inputs: [TARGET, CALAUDIT],
    code: ['tests/exp-w283a-geomode.mjs', 'tests/lib-w283a-geomode.mjs', 'tests/lib-w282b-geo1.mjs', 'tests/lib-w280c-geo3.mjs',
      'tests/lib-w280a-mercury.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'] }),
  harnessVersion: HARNESS_VERSION, libVersion: L.GEOMODE_W283A_VERSION,
  ruling: '原仮定者の裁定(2026-09-26 追加): 0=測地線不用 / 1=観測値をそのまま再現する本(1PN の測地線・引きずり無し kFrame=0)/ 2=引きずり有り(kFrame=1・簡易版)/ '
    + '3=空間メッシュ。0/1/2 の違いは λ_PN と kFrame の 0/1 だけなので処理を共通化。3 は排他だが spaceMesh フラグ。kF0 版=geoPN=1・DFM 版=geoPN=2 かつ kFrame=1。'
    + '原仮定者の裁定(第73報)AN23: geoPN=1 に 1PN の反作用を返す・⭐ binary の変化を受理(☿・V18 は不変)',
  base: { rev: BASE_REV, sha256: baseSha, note: '基点 html は git show の一時ファイル(終了後に削除)' }, nowSha256: nowSha,
  note: 'geoPN はアプリのモード番号(標準理論の 2PN・3PN ではない)。S._core は 1 命令も変えていない(geoCoreDispatch が geoPN=1 を 2 として渡す)。'
    + 'Σm·v は状態変数の和で、相対論的な全運動量ではない。',
  derive, validator, before, kf0, binary,
  doNotWrite: ['観測一致を達成した', '較正を完了した', 'f=1 で合った', 'kF0 版が成立した', '精度を上げれば成立する', '新発見', 'RC を切った'],
  headless: { now: { wallSec: HN.ms / 1000, errors: HN.errors.length }, base: { wallSec: HB.ms / 1000, errors: HB.errors.length } }, elapsedS: null,
};
out.elapsedS = (Date.now() - t0) / 1000;
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log(`→ ${path.relative(ROOT, OUT)}(${out.elapsedS.toFixed(1)} s)`);

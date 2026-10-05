// 第293便c(原仮定者の裁定(第83報)「どの処理で何ができるのかを整理し、統合先を見定める」「有効に働いていないサンプルでは撤去を検討」
// 「コア V2 の数が整理された時点で親子コアへの移行を進める」・統括の検証項目 R143)—— **引きずりとコア構造の棚卸しの器**
// (Node の headless —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。Chromium なし)。
//
// ■ 何を測るか
//   (1) 棚卸し(内蔵 152 本・1 步も走らせない): 在位/退役・コア V2 の宣言数(HP.coreV2MigrateReport —— 変換可能 convertible/naked・cavity・
//       needsResolve・rejected)・6 項の置換可否(HP.coreV2ReplaceReport —— 置換可 canReplace)・layers の宣言数(層の数・軸の宣言)・dragCore・
//       physics.shapeToy.coreField・relativeDrag の law・spinAxis・コア軸の鍵(tilt/axisMode/precessionRate/Kalign)・明示潮汐(physics.tide・天体の tide)。
//       **単位は body の宣言数**(展開後の粒子数ではない)。html の本文で本のブロックに `core:{` があるのに body に宣言が無い本(履歴の欄・コメント)も数える。
//   (2) コアなし対照(在位で body にコア V2 を宣言した本すべて): 同じ本を受理・build し、`core` だけを外した対照と `S.step(0.016)` を 2000 步(t=32)
//       並べる(順に走らせて步ごとに記録)。比べるのは x/y/vx/vy/spin/m/mEff/R の最大差(粒子数が同じ步だけ)・粒子数の食い違いの步数・融合/分裂/放出/捕獲の
//       件数・最初に差が出た步。参考に観測層(T_obs = HP.obsTemp・回転場の源 Q = HP.dfmSpinDipoleMoment・減光 lSw)の最大差も記録する。
//       分類 A〜D と撤去の可否は純関数 tests/lib-w293c-corecensus.mjs(`classifyRow`・`removalVerdict`)。
//   (3) 参考の対照: 層の本(D)は `layers` を外した対照・🌛 は `dragCore` を外した対照(同じ 2000 步)—— 経路の表の「力学ですること」の数値。
//
// ■ しないこと・言わないこと
//   ・**短期一致(2000 步)だけで光線・描画・帳簿・長期イベントまで不変とは判定しない**。「変換可能」「置換可」「同等性確認済み」は別の判定である。
//   ・層への変換はしない(近傍重力が変わる)・力学を変えない・退役本の整理はしない・dragCore をコア V2 の massFrac へ換算しない。
//   ・較正の在位(psrB1534 ほか)は比較の数値を出すだけ(撤去も移行もしない)。
//
// 実行(Node だけ・Chromium 不要・1 プロセス): node tests/exp-w293c-corecensus.mjs → 正本 tests/out/corecensus-w293c.json(W293C_OUT で出力先を変える)
// 読む正本: なし(html だけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as LC from './lib-w293c-corecensus.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.allPresets","HP.coreV2MigrateReport","HP.coreV2ReplaceReport","HP.dfmMeshVelocityFieldAt","HP.dfmSpinDipoleMoment","HP.obsTemp","HP.sim","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w293c-corecensus-1';
/** 較正の在位(本便は比較の数値だけ —— ブリーフ 2)。body にコアを持つのは psrB1534 だけで、他の 3 本はコアが履歴の欄にしかない。 */
export const CALIBRATION_ACTIVE = Object.freeze(['psrJ1757DFM', 'psrJ1946DFM', 'psrB1534', 'gw150914Merge4s']);
/** 撤去を適用した本(本便は 0 本 —— 条件 (i)〜(iii) をすべて満たす本が無かった。候補と証拠は正本の removal.candidates)。 */
export const REMOVAL_APPLIED = Object.freeze([]);
const clone = (x) => JSON.parse(JSON.stringify(x));

/** html の本文で本のブロック(`id:"…"` から次の内蔵の id まで)に現れる `core:{` の数。 */
export function coreTextHits(html, ids) {
  const pos = ids.map((id) => ({ id, at: html.indexOf('id:"' + id + '"') })).filter((z) => z.at >= 0).sort((a, b) => a.at - b.at);
  const out = {};
  for (let k = 0; k < pos.length; k++) {
    const blk = html.slice(pos[k].at, k + 1 < pos.length ? pos[k + 1].at : html.indexOf('</script>', pos[k].at));
    out[pos[k].id] = (blk.match(/core:\{/g) || []).length;
  }
  return out;
}
/** 棚卸し(1 步も走らせない)。QA docs.coreCensus がいまの html で作り直して正本と照合する。 */
export function census(HP, html) {
  const ps = HP.allPresets().filter((p) => !String(p.id).startsWith('custom_'));
  const hits = coreTextHits(html, ps.map((p) => p.id));
  const rows = ps.map((p) => LC.censusRow(p, HP.coreV2MigrateReport(p), HP.coreV2ReplaceReport(p), hits[p.id] || 0));
  return { nPresets: rows.length, nRetired: rows.filter((r) => r.retired).length, rows, totals: LC.censusTotals(rows) };
}

const evOf = (S) => {
  const cap = (S.capture && S.capture.log) ? S.capture.log.length : 0;
  const fc = S.fixcap ? ((S.fixcap.log ? S.fixcap.log.length : 0) + ':' + (S.fixcap.ejLog ? S.fixcap.ejLog.length : 0)) : '0';
  return { s: S.n + '|' + (S.fusN || 0) + '|' + (S.fisN || 0) + '|' + (S.shedNev || 0) + '|' + cap + '|' + fc, fus: S.fusN || 0, fis: S.fisN || 0, shed: S.shedNev || 0, cap };
};
/** 1 本を build して N 步走らせ、步ごとの 8 量・観測層・事象を記録する。 */
export function record(HP, preset, N, dt) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('validatePreset(' + preset.id + '): ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.sim;
  S.build(v.preset);
  const n0 = S.n, out = [], t0 = Date.now();
  for (let k = 0; k < N; k++) {
    S.step(dt);
    const n = S.n, q = {}, aux = { Tobs: new Float64Array(n), Q: new Float64Array(n), lSw: new Float64Array(n) };
    for (const key of LC.QUANTITIES) q[key] = Float64Array.from(S[key].subarray(0, n));
    for (let i = 0; i < n; i++) { aux.Tobs[i] = HP.obsTemp(S, i); aux.Q[i] = HP.dfmSpinDipoleMoment(i, S); aux.lSw[i] = S.lSw[i]; }
    out.push({ n, q, aux, ev: evOf(S).s });
  }
  return { snaps: out, n0, nEnd: S.n, ev: evOf(S), nan: S.hasNaN(), hasCoreV2: !!S.hasCoreV2, hasBodyLayers: !!S.hasBodyLayers, wallSec: (Date.now() - t0) / 1000 };
}
/** 宣言をそのままにした本と、strip(写し)を当てた対照を並べる。 */
export function compare(HP, preset, strip, o) {
  const N = (o && o.steps) || LC.RUN.steps, dt = (o && o.dt) || LC.RUN.dt;
  const q = clone(preset); const nStripped = strip(q);
  const A = record(HP, preset, N, dt), B = record(HP, q, N, dt);
  const T = LC.makeDiffTracker();
  for (let s = 0; s < N; s++) T.push(s + 1, A.snaps[s], B.snaps[s]);
  return { nStripped, n0: A.n0, nEnd: [A.nEnd, B.nEnd], ev: [A.ev, B.ev], nan: [A.nan, B.nan], flags: { withDecl: { hasCoreV2: A.hasCoreV2, hasBodyLayers: A.hasBodyLayers },
    without: { hasCoreV2: B.hasCoreV2, hasBodyLayers: B.hasBodyLayers } }, cmp: T.result(), wallSec: A.wallSec + B.wallSec };
}
const stripCore = (p) => { let k = 0; for (const b of p.bodies) if (b && b.core) { delete b.core; k++; } return k; };
const stripLayers = (p) => { let k = 0; for (const b of p.bodies) if (b && b.layers) { delete b.layers; k++; } return k; };
const stripDragCore = (p) => { let k = 0; for (const b of p.bodies) if (b && b.dragCore) { delete b.dragCore; k++; } return k; };
const evLab = (e) => `${e.fus}/${e.fis}/${e.shed}`;

/** コアなし対照の 1 行(分類と撤去の可否つき)。 */
export function controlRow(HP, p, o) {
  const c = compare(HP, p, stripCore, o);
  const cores = p.bodies.filter((b) => b && b.core);
  const active = [...new Set(cores.flatMap((b) => LC.coreActiveKeys(b.core)))], axis = [...new Set(cores.flatMap((b) => LC.coreAxisKeys(b.core)))];
  const row = { id: p.id, emoji: p.emoji || '', retired: p.familyRole === 'retired', calibration: CALIBRATION_ACTIVE.includes(p.id), nCoreBodies: c.nStripped,
    n0: c.n0, nEnd: c.nEnd, events: [evLab(c.ev[0]), evLab(c.ev[1])], nan: c.nan, flags: c.flags, active, axis, cmp: c.cmp, readers: LC.readersOf(p), wallSec: c.wallSec };
  Object.assign(row, (({ cls, why }) => ({ cls, why }))(LC.classifyRow(row)));
  Object.assign(row, LC.removalVerdict(row));
  return row;
}

const e3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN) {
  const OUT_PATH = process.env.W293C_OUT || path.join(ROOT, 'tests', 'out', 'corecensus-w293c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const C = census(HP, html);
  const T = C.totals;
  console.log(`(1) 棚卸し ${C.nPresets} 本(退役 ${C.nRetired}): コア V2 在位 ${T.coreV2.active} 本(body ${T.coreV2.declActive})・退役 ${T.coreV2.retired} 本 / layers ${T.layers ? T.layers.active : 0} 本 / dragCore ${T.dragCore ? T.dragCore.active : 0} 本 / 本文だけ ${T.coreTextOnly ? T.coreTextOnly.books : 0} 本`);
  const all = HP.allPresets();
  const v2Ids = C.rows.filter((r) => !r.retired && r.v2.n > 0).map((r) => r.id);
  const rows = [];
  for (const id of v2Ids) {
    const r = controlRow(HP, all.find((p) => p.id === id));
    rows.push(r);
    const m = r.cmp.maxDiff;
    console.log(`  ${r.emoji} ${id}: ${r.cls}(${r.why})・粒子 ${r.n0}→${r.nEnd.join('/')}・x ${e3(m.x)} vx ${e3(m.vx)} spin ${e3(m.spin)} m ${e3(m.m)}・融/分/放 ${r.events.join(' vs ')}・T_obs ${e3(r.cmp.auxDiff.Tobs)} Q ${e3(r.cmp.auxDiff.Q)}・${r.removable ? '撤去可' : '保持: ' + r.blockers.join(' / ')}(${r.wallSec.toFixed(1)} s)`);
  }
  // 層の本(D)と 🌛 の dragCore の参考の対照
  const layerRows = [];
  for (const r0 of C.rows.filter((r) => !r.retired && r.layers.n > 0 && r.v2.n === 0)) {
    const p = all.find((q) => q.id === r0.id), c = compare(HP, p, stripLayers);
    layerRows.push({ id: p.id, emoji: p.emoji || '', cls: 'D', layerBodies: r0.layers.n, nLayers: r0.layers.nLayers, axisDecl: r0.layers.axisDecl, n0: c.n0, nEnd: c.nEnd,
      events: [evLab(c.ev[0]), evLab(c.ev[1])], nan: c.nan, flags: c.flags, cmp: c.cmp, wallSec: c.wallSec });
    console.log(`  D ${p.emoji} ${p.id}: layers を外した対照 x ${e3(c.cmp.maxDiff.x)}・vx ${e3(c.cmp.maxDiff.vx)}・粒子数の食い違い ${c.cmp.nMismatchSteps} 步`);
  }
  const dcRows = [];
  for (const r0 of C.rows.filter((r) => !r.retired && r.dragCore > 0)) {
    const p = all.find((q) => q.id === r0.id), c = compare(HP, p, stripDragCore);
    dcRows.push({ id: p.id, emoji: p.emoji || '', dragCoreBodies: r0.dragCore, n0: c.n0, nEnd: c.nEnd, nan: c.nan, cmp: c.cmp, wallSec: c.wallSec });
    console.log(`  🌛 ${p.id}: dragCore を外した対照 x ${e3(c.cmp.maxDiff.x)}・vx ${e3(c.cmp.maxDiff.vx)}(最初の差 ${c.cmp.firstDiffStep} 步)`);
  }
  const byCls = { A: [], B: [], C: [], D: layerRows.map((r) => r.id) };
  for (const r of rows) byCls[r.cls].push(r.id);
  const classes = { counts: { A: byCls.A.length, B: byCls.B.length, C: byCls.C.length, D: byCls.D.length }, ids: byCls, meaning: LC.CLASS_MEANING };
  const textOnly = C.rows.filter((r) => !r.retired && r.v2.n === 0 && r.textHits > 0).map((r) => ({ id: r.id, emoji: r.emoji, textHits: r.textHits, strayCore: r.strayCore }));
  const removal = { applied: REMOVAL_APPLIED.slice(), candidates: rows.filter((r) => r.cls === 'A').map((r) => ({ id: r.id, emoji: r.emoji, removable: r.removable, blockers: r.blockers, readers: r.readers })),
    rule: 'A ∧ 在位 ∧ 較正の在位でない ∧ 主張・説明・本の宣言がコアを読まない ∧ 観測層(T_obs・Q・lSw)の差 0(QA・samplestatus の参照は器の外で文書に書く)' };
  const okRuns = rows.concat(layerRows, dcRows).every((r) => r.nan.every((z) => !z));
  const out = { meta: null, decl: { run: LC.RUN, quantities: LC.QUANTITIES, aux: LC.AUX, activeKeys: LC.ACTIVE_CORE_KEYS, axisKeys: LC.AXIS_CORE_KEYS, calibrationActive: CALIBRATION_ACTIVE,
      unit: 'body の宣言数(展開後の粒子数ではない)', notSame: '「変換可能」(coreV2MigrateReport)・「置換可」(coreV2ReplaceReport の 6 項)・「同等性確認済み」は別の判定。本器のコアなし対照は 2000 步の短期一致であって、光線・描画・帳簿・長期イベントまで不変とは判定しない' },
    census: C, control: { rows }, layerBooks: { rows: layerRows }, dragCoreRef: { rows: dcRows }, textOnly, classes, removal,
    ok: okRuns && rows.length === v2Ids.length && removal.applied.every((id) => (rows.find((r) => r.id === id) || {}).removable === true) };
  const CODE = ['tests/exp-w293c-corecensus.mjs', 'tests/lib-w293c-corecensus.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第293便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LC.CORECENSUS_LIB_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第83報)(どの処理で何ができるのかを整理し統合先を見定める・有効に働いていないサンプルでは撤去を検討・コア V2 の数が整理された時点で親子コアへの移行を進める)',
    reading: '統括の検証項目 R143(4 経路の棚卸し・コアなし対照 2000 步・A〜D の分類・撤去は条件をすべて満たす本だけ・層への変換はしない)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['短期一致で光線・描画・帳簿・長期イベントまで不変', '層へ置換して同等', 'コア V2 を廃止した', '月を再現した', '全系の保存則が閉じた'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(`分類: A ${classes.counts.A}(${byCls.A.join(',')})・B ${classes.counts.B}・C ${classes.counts.C}(${byCls.C.join(',')})・D ${classes.counts.D}・撤去を適用 ${removal.applied.length}`);
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}

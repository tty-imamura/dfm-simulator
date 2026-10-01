// 第289便e(原仮定者の裁定(第79報)AN105/AN106「コア V3 は無い —— 親子コア=body.layers」・統括の検証項目 R123)—— **親子コア便の器**。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む。物理コードは html の本文そのまま)
//   (A) 宣言の照合: 🪆 galaxyAnalogyBHTilt90Layers が 🛸 galaxyAnalogyBHTilt90 の写しで、違うのは中心の自転の置き場(コア V2 → 親子コアの 2 層)と
//       説明・名前・絵文字だけであること。層の値が `HP.coreV2ToLayers(🛸 の中心のコア V2)` と同じ(J_z だけは 🪆 が 0 を宣言 ——
//       V2 の J_z は |J|cos90° の丸め)・コア V2 を持たない・受理の警告 0・正準形(層の軸の鍵が出る)。
//   (B) **現行法則の実測**(dt=0.016・3000 步 = T=48 —— 第288便e の表と同じ窓): 🛸 / 🌚 の中心 spin=0 / 🪆 / 🪆 の対照 7 本
//       (層の差分 `S._layerForce` を器の中だけで外した対照・層の J を z に立てた対照・層の J を外した対照・歳差 0/2 倍・方位 90°・
//       殻 spin 1.2 を戻した A/B の B 側〔層の差分を外した対照〕)と 🌚(軸が立った中心)。**步ごとの状態の指紋**で、組ごとに
//       ビット一致か・最初に食い違う步を照合し、🪆 の最初の層の近傍キックの步(`S.layerN>0`)と並べる。
//       半径 15(最外層)の内側に入った粒子-步の数・T=24/48 の位置差の最大・層の軸の状態(J ベクトルは回らない・表示の方位は φ₀+Ω_p·t)。
//   (C) 変換の往復: JSON 形(🛸 の宣言)と実行状態形(🛸 を 0/1500 步走らせた状態 —— 主変数 coreJ/coreJm/coreJx/coreJy と coreAxOm)の
//       移行計画が軸(傾き・方位・歳差)を層へ運ぶこと・層へ置いて読み戻した正準形が再受理で同じになること・融合の合算規約(軸は J ベクトルの和)。
//   (D) 層の軸の宣言欄の受理: 一致・傾きの食い違い・方位の食い違い・J の無い層の傾き・値域外・非数・歳差の丸め・0 は正準形に出ない。
//
// ■ しないこと・言わないこと
//   ・🛸🌚 を 1 bit も変えない(走らせるのは写しと、器の中だけの対照 —— `S._layerForce` の差し替えは器の中の 1 走行だけで、元に戻す)。
//   ・読み手(回転場の源は層の z 射影・所有者規約「V2 があれば V2」)は変えない。「コア V3」は作らない。
//   ・「層が V2 を置き換えた」「引きずりが戻った」「歳差を接続した」と書かない。
//
// 実行(約 2〜3 分・Chromium 不要・環境変数なし —— 既定で beta/index.html を読む。`QA_TARGET` で対象を替えられる):
//   node tests/exp-w289e-tilt90layers.mjs
// 読む正本: なし(html だけ)。正本: tests/out/tilt90layers-w289e.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["galaxyAnalogyBH","galaxyAnalogyBHTilt90","galaxyAnalogyBHTilt90Layers"],"roots":["$","DT","HP.LAYER_AXIS_VERSION","HP.allPresets","HP.coreAxisState","HP.coreV2MigrationPlan","HP.coreV2ToLayers","HP.dfmLayerDipoleMoment","HP.dfmLayerMerge","HP.dfmMeshVelocityFieldAt","HP.dfmSpinDipoleMoment","HP.layerAxisFromJ","HP.layerAxisState","HP.sim","HP.validatePreset","T"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w289e-tilt90layers-1';
export const PRESET = 'galaxyAnalogyBHTilt90Layers';
export const V2COPY = 'galaxyAnalogyBHTilt90';
export const REF = 'galaxyAnalogyBH';
export const DT = 0.016;
export const STEPS = 3000;                 // T=48(🌚 の validT —— 第288便e の表と同じ窓)
export const SAMPLE_AT = Object.freeze([0, 1500, 3000]);
export const R_LAYER_OUT = 15;             // 🪆 の最外層の半径(= 中心の R)
/** 走行(宣言 —— 測る前に書いた)。`lay` は中心の層の差し替え(null = 層を外す)。`noLF` は器の中だけで S._layerForce を外す対照。 */
export const RUNS = Object.freeze([
  Object.freeze({ key: 'tilt90', base: V2COPY, note: '🛸(コア V2 の軸 90°・Ω_p 宣言)' }),
  Object.freeze({ key: 'spin0', base: REF, spin: 0, note: '🌚 の中心 spin=0(第288便e の照合の相手)' }),
  Object.freeze({ key: 'upright', base: REF, note: '🌚(軸が立った中心・殻 spin 1.2)' }),
  Object.freeze({ key: 'layers', base: PRESET, note: '🪆(層の軸 90°・Ω_p 宣言)' }),
  Object.freeze({ key: 'layers-noLF', base: PRESET, noLF: true, note: '🪆 の層の差分 S._layerForce を器の中だけで外した対照' }),
  Object.freeze({ key: 'layers-tilt0', base: PRESET, core: { J: 337500 }, note: '🪆 の層の J を z に立てた対照(|J| は同じ・軸の宣言なし)' }),
  Object.freeze({ key: 'layers-noJ', base: PRESET, core: {}, shell: {}, note: '🪆 の層の J と軸の宣言を外した対照(m・r だけ)' }),
  Object.freeze({ key: 'layers-om0', base: PRESET, core: { J: 0, Jx: 337500, tilt: 90 }, note: '🪆 の歳差 0(宣言を外す)' }),
  Object.freeze({ key: 'layers-om2x', base: PRESET, core: { J: 0, Jx: 337500, tilt: 90, precessionRate: 0.24 }, note: '🪆 の歳差 2 倍' }),
  Object.freeze({ key: 'layers-az90', base: PRESET, core: { J: 0, Jy: 337500, tilt: 90, azimuthDeg: 90, precessionRate: 0.12 }, note: '🪆 の方位 90°(J を面内 y へ)' }),
  Object.freeze({ key: 'layers-shell-noLF', base: PRESET, spin: 1.2, noLF: true, note: '🪆 に殻 spin 1.2 を戻した A/B の B 側(層の差分を外した対照)' })]);
/** ビット一致の照合の宣言(測る前に書いた —— 期待ではなく照合の組)。 */
export const SAME_PAIRS = Object.freeze([['tilt90', 'spin0'], ['layers-noLF', 'tilt90'], ['layers-tilt0', 'layers'], ['layers-noJ', 'layers'],
  ['layers-om0', 'layers'], ['layers-om2x', 'layers'], ['layers-az90', 'layers'], ['layers-shell-noLF', 'upright'], ['layers', 'tilt90']]);

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);
const e2 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : x.toExponential(2);
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : x.toFixed(3);

/** (A) 宣言の照合(🪆 = 🛸 の写し + 中心の自転の置き場)。 */
export function declarationCheck(HP) {
  const a = clone(byId(HP, PRESET)), b = clone(byId(HP, V2COPY));
  const TEXT = ['id', 'name', 'emoji', 'descStruct', 'en', 'obsCard', 'parameterAudit', 'abBody', 'status', 'description'];
  const diffs = [];
  for (const k of new Set(Object.keys(a).concat(Object.keys(b)))) {
    if (TEXT.includes(k) || k === 'bodies') continue;
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) diffs.push(k);
  }
  const bodyDiff = [];
  if (a.bodies.length !== b.bodies.length) bodyDiff.push('length');
  for (let i = 0; i < Math.min(a.bodies.length, b.bodies.length); i++) {
    const x = Object.assign({}, a.bodies[i]), y = Object.assign({}, b.bodies[i]);
    if (i === 0) { delete x.layers; delete y.core; }
    if (JSON.stringify(x) !== JSON.stringify(y)) bodyDiff.push(i);
  }
  const c0 = a.bodies[0], L = c0.layers || [];
  const conv = HP.coreV2ToLayers(b.bodies[0].core, b.bodies[0]);
  const cl = conv.ok ? conv.layers : [];
  const Jm = Math.hypot(L[0] && L[0].J || 0, L[0] && L[0].Jx || 0, L[0] && L[0].Jy || 0);
  // 変換と同じ: role・m・r・Jx・Jy・tilt・azimuthDeg・precessionRate・殻の J。J_z だけは 🪆 が 0 を宣言(差は |J|·cos90° の丸め)
  const keys = ['role', 'm', 'r', 'Jx', 'Jy', 'tilt', 'azimuthDeg', 'precessionRate', 'inertiaScale', 'Q'];
  const convDiff = [];
  if (cl.length !== L.length) convDiff.push('nLayers');
  for (let k = 0; k < Math.min(cl.length, L.length); k++) {
    for (const key of keys) if (JSON.stringify(cl[k][key]) !== JSON.stringify(L[k][key])) convDiff.push(k + '.' + key);
    if (k > 0 && cl[k].J !== L[k].J) convDiff.push(k + '.J');
  }
  const dJz = (cl[0] && L[0]) ? Math.abs((cl[0].J || 0) - (L[0].J || 0)) : null;
  const v = HP.validatePreset(clone(byId(HP, PRESET)));
  return { allSame: diffs.length === 0 && bodyDiff.length === 0, diffs, bodyDiff, hasCoreV2: c0.core !== undefined,
    layers: L, conv: cl, convOk: conv.ok, convDiff, dJz, dJzRel: (dJz === null || !(Jm > 0)) ? null : dJz / Jm, Jmag: Jm,
    sumM: L.reduce((s, z) => s + z.m, 0), bodyM: c0.m, sampleClass: a.sampleClass, pinned: c0.pinned === true,
    valid: v.ok, warnings: v.warnings, canonLayers: v.ok ? v.preset.bodies[0].layers : null, abBody: a.abBody };
}

function buildRun(HP, spec) {
  const p = clone(byId(HP, spec.base));
  if (spec.spin !== undefined) p.bodies[0].spin = spec.spin;
  if (spec.core !== undefined) p.bodies[0].layers[0] = Object.assign({ role: 'core', m: p.bodies[0].layers[0].m, r: p.bodies[0].layers[0].r }, spec.core);
  if (spec.shell !== undefined) p.bodies[0].layers[1] = Object.assign({ role: 'shell', m: p.bodies[0].layers[1].m, r: p.bodies[0].layers[1].r }, spec.shell);
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  return { S: HP.sim, warnings: v.warnings.filter((w) => /layers|core/.test(w)) };
}
function stateHash(S) {
  const h = crypto.createHash('sha256');
  for (const k of ['x', 'y', 'vx', 'vy', 'spin']) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer));
  return h.digest('hex').slice(0, 32);
}
function nInside(S) {
  let n = 0;
  for (let i = 1; i < S.n; i++) if (Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]) < R_LAYER_OUT) n++;
  return n;
}
function sample(HP, S) {
  let nan = 0; for (let i = 0; i < S.n; i++) if (!(Number.isFinite(S.x[i]) && Number.isFinite(S.y[i]) && Number.isFinite(S.vx[i]) && Number.isFinite(S.vy[i]))) nan++;
  const la = HP.layerAxisState(S, 0);
  const lay = (S.layN && S.layN[0] > 0) ? { J: S.layJ[0], Jx: S.layJx[0], Jy: S.layJy[0], Q: HP.dfmLayerDipoleMoment(0, S) } : null;
  return { t: S.t, nan, n: S.n, hash: stateHash(S), shellSpin: S.spin[0], coreV2: !!(S.coreMd && S.coreMd[0]),
    Q: HP.dfmSpinDipoleMoment(0, S), layer: lay,
    axis: la ? { tiltDeg: la.tiltDeg, azimuthDeg: la.azimuthDeg, precessionRate: la.precessionRate, phiDisplayDeg: la.phiDisplayDeg, declared: la.declared } : null,
    toyEclose: S.geoToyE + S.geoToyEmesh };
}
/** (B) 1 走行(步ごとの指紋と層の近傍キックを記録)。 */
export function runOne(HP, spec) {
  const t0 = Date.now();
  const { S, warnings } = buildRun(HP, spec);
  const orig = S._layerForce;
  if (spec.noLF) S._layerForce = function () {};
  const hashes = [stateHash(S)], samples = [sample(HP, S)];
  let firstKick = null, kickSteps = 0, insideSteps = 0, insideMax = 0;
  const pos = {};
  try {
    for (let k = 1; k <= STEPS; k++) {
      S.step(DT);
      hashes.push(stateHash(S));
      if (S.hasBodyLayers && S.layerN > 0) { kickSteps++; if (firstKick === null) firstKick = k; }
      const ni = nInside(S); insideSteps += ni; if (ni > insideMax) insideMax = ni;
      if (k === 1500 || k === STEPS) pos[k] = { x: Array.from(S.x.subarray(0, S.n)), y: Array.from(S.y.subarray(0, S.n)) };
      if (SAMPLE_AT.includes(k)) samples.push(sample(HP, S));
    }
  } finally { S._layerForce = orig; }
  return { key: spec.key, spec, warnings, samples, hashes, firstKick, kickSteps, insideSteps, insideMax, pos, wallSec: (Date.now() - t0) / 1000 };
}
/** ビット一致の照合(步ごとの指紋)・最初に食い違う步。 */
export function sameTable(runs) {
  const by = Object.fromEntries(runs.map((r) => [r.key, r]));
  return SAME_PAIRS.map(([a, b]) => {
    const A = by[a].hashes, B = by[b].hashes;
    let first = null;
    for (let k = 0; k < Math.min(A.length, B.length); k++) if (A[k] !== B[k]) { first = k; break; }
    return { a, b, same: first === null && A.length === B.length, firstDiffStep: first, firstDiffT: first === null ? null : first * DT };
  });
}
/** 🪆 と 🛸 の位置差(T=24・T=48)。 */
export function posDiff(runs, a, b) {
  const by = Object.fromEntries(runs.map((r) => [r.key, r]));
  const out = {};
  for (const k of [1500, STEPS]) {
    const P = by[a].pos[k], Q = by[b].pos[k];
    let mx = 0, s2 = 0, n = 0;
    for (let i = 1; i < P.x.length; i++) { const d = Math.hypot(P.x[i] - Q.x[i], P.y[i] - Q.y[i]); if (d > mx) mx = d; s2 += d * d; n++; }
    out['T' + (k * DT).toFixed(0)] = { maxAbs: mx, rms: Math.sqrt(s2 / n), n };
  }
  return out;
}
/** (C) 変換の往復。 */
export function conversionCheck(HP) {
  const t = clone(byId(HP, V2COPY));
  const json = HP.coreV2ToLayers(t.bodies[0].core, t.bodies[0]);
  const rt = (steps) => {
    const v = HP.validatePreset(clone(t)); HP.sim.build(v.preset); const S = HP.sim;
    for (let k = 0; k < steps; k++) S.step(DT);
    const md = S.coreMd[0];
    const plan = HP.coreV2MigrationPlan({ m: S.m[0], R: S.R[0], spin: S.spin[0],
      core: { mode: md === 1 ? 'rigid' : (md === 3 ? 'active' : 'differential'), massFrac: S.coreMF[0], radius: S.RcV[0], inertiaScale: S.coreIS[0],
        Kcs: S.coreKcs[0], Jz: S.coreJ[0], Jmag: S.coreJm[0], Jx: S.coreJx[0], Jy: S.coreJy[0],
        axisMode: S.coreAxM[0] ? 'prescribed' : undefined, precessionRate: S.coreAxOm[0] ? S.coreAxOm[0] : undefined } });
    const v2 = HP.coreAxisState(S, 0);
    const r = S._setBodyLayers(0, plan.layers);
    const back = S.bodyLayersOf(0);
    const st = HP.layerAxisState(S, 0);
    // 読み戻した正準形を再受理 → 同じ正準形か(往復が閉じるか)
    const p2 = clone(byId(HP, PRESET)); p2.bodies[0].layers = back;
    const v3 = HP.validatePreset(p2);
    return { steps, t: S.t, v2: v2 ? { tiltDeg: v2.tiltDeg, azimuthDeg: v2.azimuthDeg, precessionRate: v2.precessionRate } : null,
      planOk: plan.ok, planLayers: plan.layers, setOk: r.ok, back, layerAxis: st ? { tiltDeg: st.tiltDeg, azimuthDeg: st.azimuthDeg, precessionRate: st.precessionRate } : null,
      reaccept: v3.ok && JSON.stringify(v3.preset.bodies[0].layers) === JSON.stringify(back), reWarn: v3.warnings.filter((w) => /layers/.test(w)),
      dAzDeg: (v2 && st) ? (((st.azimuthDeg - v2.azimuthDeg) % 360 + 540) % 360 - 180) : null };
  };
  // 融合の合算規約(純関数): 軸は J ベクトルの和から導く・歳差は全員が同じ値を宣言したときだけ残る
  const M = HP.dfmLayerMerge;
  const mg = {
    sameRate: M([{ role: 'core', m: 1, r: 1, J: 0, Jx: 10, tilt: 90, precessionRate: 0.1 }], [{ role: 'core', m: 1, r: 2, J: 0, Jy: 10, tilt: 90, precessionRate: 0.1 }], 'role')[0],
    diffRate: M([{ role: 'core', m: 1, r: 1, J: 0, Jx: 10, tilt: 90, precessionRate: 0.1 }], [{ role: 'core', m: 1, r: 2, J: 0, Jy: 10, tilt: 90, precessionRate: 0.2 }], 'role')[0],
    oneSided: M([{ role: 'core', m: 1, r: 1, J: 0, Jx: 10, tilt: 90, precessionRate: 0.1 }], [{ role: 'core', m: 1, r: 2, J: 10 }], 'role')[0],
    undeclared: M([{ role: 'core', m: 1, r: 1, J: 1 }], [{ role: 'core', m: 1, r: 2, J: 2 }], 'role')[0] };
  for (const k of Object.keys(mg)) { const z = mg[k]; const ax = HP.layerAxisFromJ(z.J, z.Jx, z.Jy); z.derivedTiltDeg = ax.tiltDeg; z.derivedAzimuthDeg = ax.azimuthDeg; }
  return { json: json.ok ? json.layers : null, jsonWarnings: json.ok ? json.plan.warnings : null, t0: rt(0), t24: rt(1500), merge: mg };
}
/** (D) 層の軸の宣言欄の受理。 */
export function acceptCheck(HP) {
  const base = clone(byId(HP, PRESET));
  const one = (core) => { const p = clone(base); p.bodies[0].layers[0] = Object.assign({ role: 'core', m: 750, r: 7.5 }, core);
    const v = HP.validatePreset(p); const L = v.ok ? v.preset.bodies[0].layers : null;
    return { ok: v.ok, kept: L ? L[0] : null, nLayers: L ? L.length : 0, warns: (v.warnings || []).filter((w) => /layers\[0\]/.test(w)).length }; };
  return {
    good: one({ J: 0, Jx: 337500, tilt: 90, precessionRate: 0.12 }),
    goodAz: one({ J: 0, Jx: 0, Jy: 337500, tilt: 90, azimuthDeg: 90 }),
    tiltMismatch: one({ J: 0, Jx: 337500, tilt: 45 }),
    azMismatch: one({ J: 0, Jx: 337500, tilt: 90, azimuthDeg: 30 }),
    tiltNoJ: one({ tilt: 90 }),
    tiltRange: one({ J: 0, Jx: 337500, tilt: 200 }),
    tiltNaN: one({ J: 0, Jx: 337500, tilt: 'x' }),
    rateClamp: one({ J: 0, Jx: 337500, precessionRate: 500 }),
    zeros: one({ J: 337500, tilt: 0, azimuthDeg: 0, precessionRate: 0 }),
    az360: one({ J: 0, Jx: 337500, tilt: 90, azimuthDeg: 360 }) };
}

/** PHYSICS に載せる行(QA が正本から作り直して照合する)。 */
export function docRows(J) {
  const out = { runs: [], same: [] };
  for (const r of J.runs) {
    const z = r.samples[r.samples.length - 1];
    out.runs.push(`| ${r.key} | ${r.firstKick === null ? '—' : r.firstKick} | ${r.insideSteps} | ${z.axis ? f3(z.axis.tiltDeg) + '° / ' + f3(z.axis.azimuthDeg) + '° / ' + f3(z.axis.phiDisplayDeg) + '°' : '—'} | ${z.nan} | ${z.toyEclose} |`);
  }
  for (const s of J.same) out.same.push(`| ${s.a} | ${s.b} | ${s.same ? '一致' : '食い違う'} | ${s.firstDiffStep === null ? '—' : s.firstDiffStep + '(t=' + s.firstDiffT.toFixed(3) + ')'} |`);
  const D = J.posDiff;
  out.pos = `| 🪆 − 🛸 | ${e2(D.T24.maxAbs)} / ${e2(D.T24.rms)} | ${e2(D.T48.maxAbs)} / ${e2(D.T48.rms)} |`;
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN) {
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const decl = declarationCheck(HP);
  console.log('(A) ' + JSON.stringify({ allSame: decl.allSame, diffs: decl.diffs, bodyDiff: decl.bodyDiff, hasCoreV2: decl.hasCoreV2, convDiff: decl.convDiff, dJzRel: decl.dJzRel, warnings: decl.warnings }));
  const runs = [];
  for (const spec of RUNS) {
    const r = runOne(HP, spec); runs.push(r);
    const z = r.samples[r.samples.length - 1];
    console.log(`${r.key}: 最初の層キック ${r.firstKick}・キック步 ${r.kickSteps}・r<${R_LAYER_OUT} の粒子-步 ${r.insideSteps}(最大 ${r.insideMax})・軸 ${z.axis ? f3(z.axis.tiltDeg) + '°/' + f3(z.axis.azimuthDeg) + '°/表示 ' + f3(z.axis.phiDisplayDeg) + '°' : '—'}・NaN ${z.nan}・${r.wallSec.toFixed(1)} s`);
  }
  const same = sameTable(runs);
  console.log('(B) ' + JSON.stringify(same));
  const pd = posDiff(runs, 'layers', 'tilt90');
  console.log('    🪆−🛸 ' + JSON.stringify(pd));
  const conv = conversionCheck(HP);
  console.log('(C) ' + JSON.stringify({ t0: conv.t0.back, t24: { v2: conv.t24.v2, axis: conv.t24.layerAxis, reaccept: conv.t24.reaccept, dAz: conv.t24.dAzDeg } }));
  const acc = acceptCheck(HP);
  console.log('(D) ' + JSON.stringify(Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, { kept: v.kept, warns: v.warns }]))));
  const CODE = ['tests/exp-w289e-tilt90layers.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第289便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, layerAxisVersion: HP.LAYER_AXIS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第79報)AN105/AN106: 「コア V3」は無い(親子コア=body.layers)・🛸 の層版は専用の診断コピー 1 本で・層は「z だけを読む」を契約に書く・読み手は変えない・コア V2 は廃止しない',
    reading: '統括の検証項目 R123(層の軸の宣言欄・J ベクトルが正準状態で角度は導出値・コア V2 → 層の変換が軸を運ぶ・🛸 の層版の診断コピーの実測)',
    dt: DT, steps: STEPS,
    notClaim: ['層が V2 を置き換えた', '引きずりが戻った', '歳差を接続した', 'コア V3', '観測一致を達成した', '新発見'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  // 步ごとの指紋は照合にだけ使う(正本には最初の食い違いの步と標本の指紋だけを残す —— 大きさを抑える)
  const runsOut = runs.map((r) => { const o = Object.assign({}, r); delete o.hashes; delete o.pos; return o; });
  const out = { meta, preset: PRESET, v2copy: V2COPY, ref: REF, runSpecs: RUNS, samePairs: SAME_PAIRS, sampleAt: SAMPLE_AT, rLayerOut: R_LAYER_OUT,
    declaration: decl, runs: runsOut, same, posDiff: pd, conversion: conv, accept: acc, elapsedS: (Date.now() - t0) / 1000 };
  out.docRows = docRows(out);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'tilt90layers-w289e.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/tilt90layers-w289e.json(' + out.elapsedS.toFixed(1) + ' s)');
}

// 第288便e(原仮定者の裁定(第78報)⑦「2D は公転面基準。公転面に対する自転軸の傾きと歳差回転を必要な天体に導入。DFM 版ブラックホールは自転軸が
// 公転面に対し 90° 倒れた状態・銀河に対する引きずりは歳差回転が担う・多層化が簡単なら多層化」・統括の検証項目 R117・AN79)—— **軸傾きと 90° BH 便の器**。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む。物理コードは html の本文そのまま)
//   (A) 宣言の照合: 🛸 galaxyAnalogyBHTilt90 が 🌚 galaxyAnalogyBH の写しで、違うのは中心の殻 spin(1.2 → 0)とコアの宣言
//       (tests/lib-w288e-tilt90.mjs の DECL と同じ値)と説明・名前・A/B だけであること。
//   (B) **現行法則の実測**(dt=0.016・3000 步 = T=48): 🌚(軸が立った中心・殻 spin 1.2)/ 🌚 の中心 spin=0 / 🛸(軸 90°・Ω_p 宣言)/
//       🛸 の Ω_p=0 / 🛸 の Ω_p=2 倍 / 🛸 のコアを立てた対照(tilt 0)/ 🛸 に殻 spin 1.2 を戻した A/B の B 側。
//       中心の J_z(殻 ½mR²s + コアの J_z)・コアの軸の状態(傾き・方位)・拘束の帳簿(axPresc)・NaN・トイの帳簿 E_toy+E_mesh・
//       自転を読んだ源の数・**符号つき η_mesh(r)=⟨a_mesh,r⟩/|⟨a_g,r⟩|**(銀河スケールの bin —— t=0 と T=48)・状態の指紋(ビット一致の照合)。
//   (C) **歳差が担う面内の引きずりの候補**(tests/lib-w288e-tilt90.mjs —— 純関数・場に足さない): 1 層の対照・立体核の層数 1→32 の収束・
//       自転の部分の上下の打ち消し・z 微分の解析評価・Ω_p 0/宣言/2 倍・多層の換算式の候補 J_z,eff と s_eff。
//       **比較器**: 同じ t=0 の配置で、場の契約の読み手(`dfmFieldContract`・e6)が中心の殻 spin s を読んだときの環平均 Δu_φ(s)=u_φ(s)−u_φ(0)
//       を s=1.2(🌚)と s=s_eff(候補の換算)で並べ、立体核の u_φ と横に置く(**足さない**)。
//   (D) 点粒子の自転軸の表示専用の宣言 `body.spinAxis`: 受理器の場合分け・内蔵の宣言集合と登録簿 SPIN_AXIS_BOOKS・署名(presetSigHash)の不変・
//       📻 の 3000 步の状態が宣言の有無でビット一致。
//
// ■ しないこと・言わないこと
//   ・🌚💮⚫🪩 を 1 bit も変えない(走らせるのは写しと、器の中だけの対照)。候補の u を既存の場に足さない。法則へ昇格しない。
//   ・「引きずりが戻った」「90° で銀河を回した」「歳差を発見した」と書かない。2D の面内の流れを「渦伸長」と呼ばない。
//
// 実行(約 4〜5 分・Chromium 不要・環境変数なし —— 既定で beta/index.html を読む。`QA_TARGET` で対象を替えられる):
//   node tests/exp-w288e-tilt90.mjs
// 読む正本: なし(html だけ)。正本: tests/out/tilt90-w288e.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as LT from './lib-w288e-tilt90.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["galaxyAnalogyBH","galaxyAnalogyBHTilt90","psrDoubleAB"],"roots":["$","DT","HP.SPIN_AXIS_BOOKS","HP.SPIN_AXIS_KEYS","HP.SPIN_AXIS_VERSION","HP.allPresets","HP.coreAxisState","HP.dfmField","HP.dfmFieldContract","HP.dfmMeshVelocityFieldAt","HP.frameWeightIsPull","HP.frameWeightPow","HP.presetSigHash","HP.sim","HP.spinAxisOf","HP.validatePreset","T","clamp","coreAxisState","dfmCoreAxisStep","dfmFieldContract","dfmGeoToySpinStep","presetSig","presetSigHash","spinAxisOf","spinAxisSigBodies","spinAxisValidate","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w288e-tilt90-1';
export const PRESET = 'galaxyAnalogyBHTilt90';
export const REF = 'galaxyAnalogyBH';
export const SPIN_AXIS_PRESET = 'psrDoubleAB';
export const DT = 0.016;
export const STEPS = 3000;                 // T=48(🌚 の validT)
export const SAMPLE_AT = Object.freeze([0, 1500, 3000]);
/** 走行(宣言 —— 測る前に書いた)。 */
export const RUNS = Object.freeze([
  Object.freeze({ key: 'upright', base: REF, note: '🌚(軸が立った中心・殻 spin 1.2)' }),
  Object.freeze({ key: 'spin0', base: REF, spin: 0, note: '🌚 の中心 spin=0(🌚 の A/B の B 側)' }),
  Object.freeze({ key: 'tilt90', base: PRESET, note: '🛸(軸 90°・Ω_p 宣言)' }),
  Object.freeze({ key: 'tilt90-om0', base: PRESET, omegaP: 0, note: '🛸 の Ω_p=0' }),
  Object.freeze({ key: 'tilt90-om2x', base: PRESET, omegaP: 2 * LT.DECL.omegaP, note: '🛸 の Ω_p=2 倍' }),
  Object.freeze({ key: 'tilt0-core', base: PRESET, tilt: 0, note: '🛸 のコアを立てた対照(tilt 0 —— |J| は z に)' }),
  Object.freeze({ key: 'tilt90-shell', base: PRESET, spin: 1.2, note: '🛸 に殻 spin 1.2 を戻す(A/B の B 側)' })]);
/** ビット一致の照合の宣言(測る前に書いた —— 期待ではなく照合の組)。 */
export const SAME_PAIRS = Object.freeze([['tilt90', 'spin0'], ['tilt90-om0', 'spin0'], ['tilt90-om2x', 'spin0'], ['tilt0-core', 'spin0'], ['tilt90-shell', 'upright'], ['upright', 'spin0']]);
export const REL_TOL = 1e-12;

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : x.toFixed(3);
const e2 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : x.toExponential(2);
const sgn = (x) => (x === null || x === undefined) ? '—' : ((x >= 0 ? '+' : '') + x.toFixed(4));

/** (A) 宣言の照合(🛸 = 🌚 の写し + 中心の自転の置き場)。 */
export function declarationCheck(HP) {
  const a = clone(byId(HP, PRESET)), b = clone(byId(HP, REF));
  // 説明・表示だけの欄(status・description は生成領域 sample-status から付く派生の概要)
  const TEXT = ['id', 'name', 'emoji', 'descStruct', 'en', 'obsCard', 'parameterAudit', 'abBody', 'status', 'description'];
  const diffs = [];
  const keys = new Set(Object.keys(a).concat(Object.keys(b)));
  for (const k of keys) {
    if (TEXT.includes(k) || k === 'bodies') continue;
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) diffs.push(k);
  }
  const bodyDiff = [];
  if (a.bodies.length !== b.bodies.length) bodyDiff.push('length');
  for (let i = 0; i < Math.min(a.bodies.length, b.bodies.length); i++) {
    const x = Object.assign({}, a.bodies[i]), y = Object.assign({}, b.bodies[i]);
    if (i === 0) { delete x.spin; delete y.spin; delete x.core; }
    if (JSON.stringify(x) !== JSON.stringify(y)) bodyDiff.push(i);
  }
  const c = a.bodies[0].core || {}, D = LT.DECL, m0 = a.bodies[0].m;
  const coreOk = c.mode === 'differential' && c.massFrac * m0 === D.Mc && c.radius === D.Rc && c.omega === D.omegaCore && c.Kcs === 0
    && c.tilt === D.tiltDeg && c.axisMode === 'prescribed' && c.azimuthDeg === D.azimuthDeg && c.precessionRate === D.omegaP;
  const Jcore = 0.5 * c.massFrac * m0 * c.radius * c.radius * c.omega, Jref = 0.5 * b.bodies[0].m * b.bodies[0].radius * b.bodies[0].radius * b.bodies[0].spin;
  const v = HP.validatePreset(clone(byId(HP, PRESET)));
  return { allSame: diffs.length === 0 && bodyDiff.length === 0, diffs, bodyDiff, coreOk, core: c, spin: a.bodies[0].spin, refSpin: b.bodies[0].spin,
    Jcore, Jref, sameJ: Jcore === Jref, sampleClass: a.sampleClass, pinned: a.bodies[0].pinned === true, valid: v.ok, warnings: v.warnings,
    abBody: a.abBody };
}

function buildRun(HP, spec) {
  const p = clone(byId(HP, spec.base));
  if (spec.spin !== undefined) p.bodies[0].spin = spec.spin;
  if (spec.omegaP !== undefined) p.bodies[0].core.precessionRate = spec.omegaP;
  if (spec.tilt !== undefined) p.bodies[0].core.tilt = spec.tilt;
  const v = HP.validatePreset(p);
  if (!v.ok) throw new Error('validatePreset(' + spec.key + '): ' + (v.errors || []).join(' / '));
  HP.sim.build(v.preset);
  return { S: HP.sim, warnings: v.warnings };
}
function stateHash(S) {
  const h = crypto.createHash('sha256');
  for (const k of ['x', 'y', 'vx', 'vy', 'spin']) h.update(Buffer.from(Float64Array.from(S[k].subarray(0, S.n)).buffer));
  return h.digest('hex').slice(0, 32);
}
function centerOf(S) {
  const ic = 0;
  const Ish = 0.5 * S.m[ic] * S.R[ic] * S.R[ic];
  const core = (S.coreMd && S.coreMd[ic]) ? { Jz: S.coreJ[ic], Jx: S.coreJx[ic], Jy: S.coreJy[ic], Jm: S.coreJm[ic] } : null;
  const JzShell = Ish * S.spin[ic];
  return { spin: S.spin[ic], JzShell, core, Jz: JzShell + (core ? core.Jz : 0) };
}
function sample(HP, S, withEta) {
  let nan = 0; for (let i = 0; i < S.n; i++) if (!(Number.isFinite(S.x[i]) && Number.isFinite(S.y[i]) && Number.isFinite(S.vx[i]) && Number.isFinite(S.vy[i]))) nan++;
  const ax = HP.coreAxisState(S, 0);
  return { t: S.t, nan, n: S.n, center: centerOf(S),
    axis: ax ? { tiltDeg: ax.tiltDeg, azimuthDeg: ax.azimuthDeg, declared: ax.declared, precessionRate: ax.precessionRate, phiPrescribedDeg: ax.phiPrescribedDeg } : null,
    axPresc: { Lx: S.axPrescLx || 0, Ly: S.axPrescLy || 0, E: S.axPrescE || 0, n: S.axPrescN || 0 },
    toyEclose: S.geoToyE + S.geoToyEmesh, spinSources: (S.geoToySpinSources === undefined) ? null : S.geoToySpinSources,
    stop: (S.geoToyStop === undefined) ? null : S.geoToyStop, hash: stateHash(S), eta: withEta ? LT.etaMesh(HP, S, 0) : null };
}
/** (B) 1 走行。 */
export function runOne(HP, spec) {
  const t0 = Date.now();
  const { S, warnings } = buildRun(HP, spec);
  const samples = [sample(HP, S, true)];
  for (let k = 1; k <= STEPS; k++) {
    S.step(DT);
    if (SAMPLE_AT.includes(k)) samples.push(sample(HP, S, k === STEPS));
  }
  return { key: spec.key, spec, warnings, samples, wallSec: (Date.now() - t0) / 1000 };
}
/** ビット一致の照合(全標本の指紋)。 */
export function sameTable(runs) {
  const by = Object.fromEntries(runs.map((r) => [r.key, r]));
  return SAME_PAIRS.map(([a, b]) => ({ a, b, same: by[a].samples.every((s, i) => s.hash === by[b].samples[i].hash) }));
}
/** t=0 の中心の自転の寄与(η の差 —— 同じ初期配置)。 */
export function centerShare(runs) {
  const by = Object.fromEntries(runs.map((r) => [r.key, r]));
  const e = (k) => by[k].samples[0].eta;
  return LT.ETA_BINS.map((bin, j) => {
    const u = e('upright')[j], t = e('tilt90')[j], z = e('spin0')[j];
    return { r0: bin[0], r1: bin[1], n: u.n, etaUpright: u.eta, etaTilt90: t.eta, etaSpin0: z.eta,
      dEtaUpright: (u.eta === null || z.eta === null) ? null : u.eta - z.eta, dEtaTilt90: (t.eta === null || z.eta === null) ? null : t.eta - z.eta,
      dPhiUpright: (u.n ? u.aMeshPhi - z.aMeshPhi : null), dPhiTilt90: (t.n ? t.aMeshPhi - z.aMeshPhi : null) };
  });
}
/** (C) 比較器: 場の契約の読み手が中心の殻 spin s を読んだときの環平均 Δu_φ(s)(t=0・🌚 の配置)。 */
export function comparator(HP, sList) {
  const { S } = buildRun(HP, RUNS[0]);
  const T = LT.toyAccel(HP, S);
  const BD = T.BD, C0 = Object.assign({}, T.contract, { need: 'u', excludeBodyId: -1 });
  const ring = (s) => LT.RADII.map((r) => {
    const B = BD.map((b, i) => (i === 0) ? Object.assign({}, b, { spin: s }) : b);
    let up = 0, n = 0;
    for (let a = 0; a < LT.NAZ; a++) {
      const th = 2 * Math.PI * a / LT.NAZ, x = r * Math.cos(th), y = r * Math.sin(th);
      const f = HP.dfmFieldContract(B, x, y, C0);
      if (!f) continue;
      up += -f.u[0] * Math.sin(th) + f.u[1] * Math.cos(th); n++;
    }
    return { r, uPhi: n ? up / n : null, n };
  });
  const base = ring(0);
  return sList.map((z) => ({ label: z.label, s: z.s, rows: ring(z.s).map((q, j) => ({ r: q.r, dUPhi: (q.uPhi === null || base[j].uPhi === null) ? null : q.uPhi - base[j].uPhi })) }));
}
/** (D) spinAxis の受理・署名・表示専用。 */
export function spinAxisCheck(HP) {
  const q = clone(byId(HP, SPIN_AXIS_PRESET));
  const good = { tiltDeg: 40.6, source: 'x' };
  const one = (sa, type) => { const p = clone(q); if (type) { p.bodies[1] = { type: 'disk', n: 3, cx: 0, cy: 0, radius: 10, mMin: 1, mMax: 1, spinAxis: sa }; } else p.bodies[1].spinAxis = sa;
    const v = HP.validatePreset(p); return { ok: v.ok, kept: v.ok ? (v.preset.bodies[1].spinAxis === undefined ? null : v.preset.bodies[1].spinAxis) : null, warns: (v.warnings || []).filter((w) => /spinAxis/.test(w)).length }; };
  const cases = {
    good: one(good), missingSource: one({ tiltDeg: 40.6 }), badTilt: one({ tiltDeg: 'x', source: 'x' }), unknownKey: one({ tiltDeg: 1, source: 'x', foo: 1 }),
    clamp: one({ tiltDeg: 400, source: 'x', azimuthDeg: -999 }), asym: one({ tiltDeg: 10, source: 'x', uncertainty: { precessionRateDegPerYr: { plus: 0.3, minus: 0.4, level: 68 } } }),
    badUnc: one({ tiltDeg: 10, source: 'x', uncertainty: { tiltDeg: -1 } }), nonSingle: one(good, 'disk') };
  // 登録簿に行のある本だけを読む(内蔵全体の宣言集合は QA behavior.spinAxisDecl がいまの html で数える —— 正本の領域を全プリセットへ広げない)
  const books = HP.SPIN_AXIS_BOOKS;
  //(未宣言の本〔📿🎐⏰〕は本体を読まない —— 登録簿の行があることだけを記録する)
  const declIds = Object.keys(books).filter((id) => books[id].status === 'declared');
  const declared = declIds.map((id) => { const p = byId(HP, id); return { id, idx: (p.bodies || []).map((b, i) => (b && b.spinAxis !== undefined) ? i : -1).filter((i) => i >= 0) }; });
  const booksOk = declared.every((z) => z.idx.length > 0 && JSON.stringify(Object.keys(books[z.id].bodies).map(Number)) === JSON.stringify(z.idx));
  const sigs = declared.map((z) => { const p = clone(byId(HP, z.id)); const w = clone(p); for (const i of z.idx) delete w.bodies[i].spinAxis;
    return { id: z.id, with: HP.presetSigHash(p), without: HP.presetSigHash(w) }; });
  // 表示専用: 📻 を 3000 步 —— 宣言の有無で状態の指紋が同じ
  const run = (strip) => { const p = clone(q); if (strip) delete p.bodies[1].spinAxis; const v = HP.validatePreset(p); HP.sim.build(v.preset);
    for (let k = 0; k < 3000; k++) HP.sim.step(DT); return { hash: stateHash(HP.sim), state: HP.spinAxisOf(HP.sim, 1) }; };
  const w = run(false), wo = run(true);
  return { version: HP.SPIN_AXIS_VERSION, keys: HP.SPIN_AXIS_KEYS, cases, declared, books: Object.fromEntries(Object.entries(books).map(([k, v]) => [k, { status: v.status, bodies: v.bodies || null }])),
    booksOk, sigs, sigSame: sigs.every((z) => z.with === z.without), bitSame: w.hash === wo.hash, stateWith: w.state, stateWithout: wo.state };
}

/** PHYSICS に載せる行(QA が正本から作り直して照合する)。 */
export function docRows(J) {
  const out = { runs: [], eta: [], share: [], layers: [], omega: [], comp: [], toZ: [] };
  for (const r of J.runs) {
    const a = r.samples[0], z = r.samples[r.samples.length - 1];
    out.runs.push(`| ${r.key} | ${e2(a.center.Jz)} | ${z.axis ? f3(z.axis.tiltDeg) + '° / ' + f3(z.axis.azimuthDeg) + '°' : '—'} | ${e2(z.axPresc.Lx)} / ${e2(z.axPresc.Ly)} | ${z.nan} | ${z.toyEclose} | ${z.spinSources} |`);
    const et = (s) => s.eta.map((q) => (q.n ? (q.eta === null ? '—' : sgn(q.eta)) : '—')).join('/');
    out.eta.push(`| ${r.key} | ${et(a)} | ${et(z)} |`);
  }
  for (const c of J.centerShare) out.share.push(`| [${c.r0},${c.r1}) | ${c.n} | ${sgn(c.dEtaUpright)} | ${sgn(c.dEtaTilt90)} |`);
  const C = J.candidate;
  // 自転の部分の面内 rms は z の rms の 1e-15 未満なら丸めの床として「< 1e-15·rms_z」と書く(1e-17 級の雑音の桁を文書に写さない)
  const inPlane = (L) => (L.rows.every((q) => q.spin.rmsIn < 1e-15 * q.spin.rmsZ)) ? '< 1e-15·rms_z' : e2(Math.max(...L.rows.map((q) => q.spin.rmsIn)));
  for (const L of C.layers) out.layers.push(`| ${L.N} | ${L.rows.map((q) => e2(q.prec.uPhi)).join(' / ')} | ${inPlane(L)} |`);
  for (const w of C.omegaP) out.omega.push(`| ${w.omegaP} | ${w.rows.map((q) => e2(q.precUPhi)).join(' / ')} |`);
  for (const c of J.comparator) out.comp.push(`| ${c.label} | ${c.s.toFixed(4)} | ${c.rows.map((q) => e2(q.dUPhi)).join(' / ')} |`);
  for (const z of C.toZ) out.toZ.push(`| ${z.omegaP} | ${e2(z.core.Jz)} | ${z.core.sEff.toFixed(4)} | ${e2(z.wholeBody.Jz)} | ${z.wholeBody.sEff.toFixed(4)} |`);
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
  console.log('(A) ' + JSON.stringify({ allSame: decl.allSame, coreOk: decl.coreOk, sameJ: decl.sameJ, diffs: decl.diffs, bodyDiff: decl.bodyDiff }));
  const runs = [];
  for (const spec of RUNS) {
    const r = runOne(HP, spec); runs.push(r);
    const a = r.samples[0], z = r.samples[r.samples.length - 1];
    console.log(`${r.key}: J_z ${e2(a.center.Jz)} → ${e2(z.center.Jz)}・軸 ${z.axis ? f3(z.axis.tiltDeg) + '°/' + f3(z.axis.azimuthDeg) + '°' : '—'}・NaN ${z.nan}・E_toy+E_mesh ${z.toyEclose}・${r.wallSec.toFixed(1)} s`);
  }
  const same = sameTable(runs);
  console.log('(B) ビット一致 ' + JSON.stringify(same));
  const share = centerShare(runs);
  const candidate = LT.candidateTables();
  const selfTest = LT.selfTest();
  console.log('(C) 単体試験 ok=' + selfTest.ok);
  const sEffCore = candidate.toZ[1].core.sEff, sEffWhole = candidate.toZ[1].wholeBody.sEff;
  const comp = comparator(HP, [{ label: '🌚 の殻 spin(軸が立った中心)', s: 1.2 }, { label: '候補の換算 s_eff(コアの歳差だけ)', s: sEffCore }, { label: '候補の換算 s_eff(本体全体が歳差した仮定)', s: sEffWhole }]);
  const sa = spinAxisCheck(HP);
  console.log('(D) spinAxis ' + JSON.stringify({ declared: sa.declared, booksOk: sa.booksOk, sigSame: sa.sigSame, bitSame: sa.bitSame }));
  const CODE = ['tests/exp-w288e-tilt90.mjs', 'tests/lib-w288e-tilt90.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第288便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: LT.TILT90_LIB_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第78報)⑦: アプリの 2D は公転面基準。公転面に対する自転軸の傾きと歳差回転を必要な天体に導入する。DFM 版ブラックホールは自転軸が公転面に対し 90° 倒れた状態・銀河に対する引きずりは歳差回転が担う・多層化が簡単なら多層化・自転軸方向の渦伸長は 2D 平面上に発生',
    reading: '統括の検証項目 R117(表示は公転面基準の 2D のまま・内部に 3 成分の J・軸角は一次資料がある本だけ宣言・90° はアナロジーの定義として採用・現行法則の再測 → 歳差が担う面内の引きずりの候補を診断量で・層数の対照・法則には入れない)・AN79',
    dt: DT, steps: STEPS,
    notClaim: ['引きずりが戻った', '90° で銀河を回した', '歳差を発見した', '渦伸長', '銀河ができた', '観測一致を達成した', '新発見'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  const out = { meta, preset: PRESET, ref: REF, runSpecs: RUNS, samePairs: SAME_PAIRS, sampleAt: SAMPLE_AT, etaBins: LT.ETA_BINS,
    declaration: decl, runs, same, centerShare: share, candidate, selfTest, comparator: comp, spinAxis: sa, elapsedS: (Date.now() - t0) / 1000 };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'tilt90-w288e.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/tilt90-w288e.json(' + out.elapsedS.toFixed(1) + ' s)');
}

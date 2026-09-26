// 第283便c(原仮定者の裁定(第73報)⑤「dt だけで重いサンプルを調査して改善」・統括の検証項目 R86 (iv))— **重い較正 4 本の器**。
//
// ■ 何を測るか(**実測だけ** —— 4 本の宣言は書き換えない。写しは器の中だけ)
//   (A) 較正走行の重さの内訳: 正本 tests/out/calaudit-w249.json の段別の壁時計(第283便c の `calStagesOf` —— 二重加算なし)から、
//       🌞 solarInner・💠 uranusReal・💍 saturnRingReal・💿 saturnRingRealKF1 が全体に占める割合、heavy 規則(実行時 n>12 →
//       dt/2 なし・時間予算 ×3)・必要近点数の充足・Chromium の ms/步(壁時計 ÷ 步数)。
//   (B) 粒子数・対の数・宣言質量の内訳(環の合計 対 主要天体)と、Node の headless(html の本文そのまま —— lib-w280b-emgrid の
//       loadHtmlMain)の ms/步: **全粒子**・**主要天体だけ**(群を除いた写し)・**試験粒子の写し**(群を末尾へ移して
//       `testParticle:true`)。統括の検証仮説「全粒子 対 主要天体だけで 268〜460 倍」を測る。
//   (C) 試験粒子契約の機械検査: ① 源(主要天体)は群を除いた宇宙と 1 bit 同じ ② 群の粒子の配置は並べ替えで変わらない
//       ③ 固定中心 + 1 粒子の宇宙で、試験粒子の軌道は通常粒子とビット一致(share/pull/pull3・geoPN 0/1/2・kFrame 0/1・
//       stateCarry 有無・frameSource:false)④ 内蔵 141 本に宣言が 0 本(既定 off)⑤ 入場条件の拒否理由。
//   (D) 判定量の前後: 判定器(tests/exp-w249b-calaudit.mjs --tp-copy)を**同じ停止条件・同じ抽出器**で写しに掛け、
//       正本の同じ量(対象・種類・名前)と並べて相対差を出す(Chromium・一時ファイル —— 正本は上書きしない)。
//
// ■ しないこと
//   ・4 本の宣言(環粒子の質量・群の型)を書き換えない(AN34 —— 統括が裁定後に署名する)。4 値は書き換えない。
//   ・「試験が短くなった=数値が収束した」「試験粒子にすれば合」とは書かない。
//
// 実行(約 6〜8 分・Chromium を使う(D)のため PLAYWRIGHT_CORE_DIR が要る):
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w283c-heavy.mjs
// 読む正本: tests/out/calaudit-w249.json(**判定器を先に走らせる** —— 再生成表の after: calaudit)
// 正本: tests/out/heavy-w283c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { calStagesOf } from './lib-w283c-calstages.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","CAL_CONTRACT","DT","HP.allPresets","HP.coreState","HP.dfmMeshVelocityFieldAt","HP.presetSigHash","HP.sim","HP.validatePreset","LAWS","T","ch","chanSetup","clamp","ctx","cw","dfmTestParticleCore","dfmTestParticleStep","geoCoreDispatch","isNum","pairChannelGrad","pairChannelOm","pairCorePN","pairCorePlain","pnSource","presetSigHash","scaleExpT","testParticlePrepare"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w283c-heavy-1';
export const HEAVY_IDS = ['solarInner', 'uranusReal', 'saturnRingReal', 'saturnRingRealKF1'];
export const HEAVY_EMOJI = { solarInner: '🌞', uranusReal: '💠', saturnRingReal: '💍', saturnRingRealKF1: '💿' };
export const DT = 0.016;
export const HYPOTHESIS_RATIO = [268, 460];   // 統括の検証仮説(全粒子 対 主要天体だけの ms/步の比)
export const REL_TOL = 1e-12;
// 計時(warm-up のあと N 步の平均・3 通りを交互に reps 回 —— 最小値)。全粒子は重いので步数を分ける —— 步数は記録する
export const TIMING = { warm: 300, full: 400, major: 20000, tp: 4000, reps: 3 };
export const IDENTITY_STEPS = 2000;
export const TWO_BODY_STEPS = 3000;
export const TWO_BODY_CASES = [
  { key: 'share-geo2-kF1', phys: {} },
  { key: 'share-geo1-kF1', phys: { geoPN: 1, kFrame: 1 } },
  { key: 'share-geo0-kF1', phys: { geoPN: 0 } },
  { key: 'share-geo1-kF0', phys: { geoPN: 1, kFrame: 0 } },
  { key: 'share-geo2-kF0', phys: { geoPN: 2, kFrame: 0 } },
  { key: 'pull-geo2-kF1', phys: { frameWeight: 'pull', D0pull: 3e-5 } },
  { key: 'pull-geo0-kF1', phys: { frameWeight: 'pull', D0pull: 3e-5, geoPN: 0 } },
  { key: 'pull3-geo2-kF1', phys: { frameWeight: 'pull3' } },
  { key: 'pull-geo2-kF1-frameSourceFalse', phys: { frameWeight: 'pull', D0pull: 3e-5 }, fsOff: true },
  { key: 'share-geo2-kF1-noCarry', phys: { stateCarry: undefined } },
];
// 入場条件の拒否(宣言どおりの理由で拒否し、全粒子を源として従来どおり走らせる)
export const DENY_CASES = [
  { key: 'notTail', why: 'notTail' }, { key: 'leapfrog', why: 'integrator' }, { key: 'kRep', why: 'material' },
  { key: 'geoPN3', why: 'geoPN3' }, { key: 'dragRefSurface', why: 'dragRef' }, { key: 'sourceFrameSourceFalse', why: 'channel' },
];

const J = (x) => JSON.parse(JSON.stringify(x));
const isS = (b) => !b.type || b.type === 'single';
/** 群を除いた写し(主要天体だけ)・群を末尾へ移して testParticle を付けた写し・並べ替えだけの対照。 */
export function variants(P) {
  const singles = P.bodies.filter(isS), groups = P.bodies.filter((b) => !isS(b));
  return {
    major: Object.assign(J(P), { bodies: J(singles) }),
    reorder: Object.assign(J(P), { bodies: J(singles).concat(J(groups)) }),
    tp: Object.assign(J(P), { bodies: J(singles).concat(J(groups).map((b) => Object.assign(b, { testParticle: true }))) }),
    nSingles: singles.length,
  };
}
function build(HP, p) { const v = HP.validatePreset(J(p)); if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors)); HP.sim.build(v.preset); return v; }
function msPerStep(HP, p, n) {
  build(HP, p); const S = HP.sim;
  for (let k = 0; k < TIMING.warm; k++) S.step(DT);
  const t0 = process.hrtime.bigint();
  for (let k = 0; k < n; k++) S.step(DT);
  return Number(process.hrtime.bigint() - t0) / 1e6 / n;
}
const snapState = (S, k0, k1) => { const o = []; for (let i = k0; i < k1; i++) o.push([S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]]); return o; };
const sameArr = (a, b) => a.length === b.length && a.every((r, i) => r.every((v, k) => Object.is(v, b[i][k])));

/** (B)(C①②) 1 本の構造・質量・ms/步・源の同一性。 */
export function presetStructure(HP, id) {
  const P = HP.allPresets().find((q) => q.id === id);
  const V = variants(P);
  build(HP, P); const S = HP.sim; const n = S.n;
  // 実行 index ごとの「群の粒子か」(宣言順の展開)
  const isGroup = []; for (const b of P.bodies) { const c = isS(b) ? 1 : Math.max(1, Math.round(b.n !== undefined ? b.n : (b.count || 1))); for (let z = 0; z < c; z++) isGroup.push(!isS(b)); }
  let mMajor = 0, mGroup = 0, mCentral = 0; const groupRuns = [];
  for (let i = 0; i < n; i++) { const m = S.m[i]; if (isGroup[i]) { mGroup += m; groupRuns.push([S.x[i], S.y[i], S.vx[i], S.vy[i]]); } else { mMajor += m; if (m > mCentral) mCentral = m; } }
  build(HP, V.reorder);
  const reRuns = []; for (let i = V.nSingles; i < HP.sim.n; i++) reRuns.push([HP.sim.x[i], HP.sim.y[i], HP.sim.vx[i], HP.sim.vy[i]]);
  const groupSameAfterReorder = sameArr(groupRuns, reRuns);
  build(HP, V.tp);
  const tpOn = HP.sim.hasTestParticle === true, tpDeny = HP.sim.testParticleDeny || null, tpN0 = HP.sim.tpN0;
  // 源の同一性(群を除いた宇宙と 1 bit)
  build(HP, V.major); for (let k = 0; k < IDENTITY_STEPS; k++) HP.sim.step(DT);
  const a = snapState(HP.sim, 0, V.nSingles);
  build(HP, V.tp); for (let k = 0; k < IDENTITY_STEPS; k++) HP.sim.step(DT);
  const b = snapState(HP.sim, 0, V.nSingles), tpNaN = HP.sim.hasNaN();
  const sourcesBitSameVsMajorOnly = sameArr(a, b);
  const n0 = V.nSingles, nG = n - n0;
  // 共有の容器では 1 回の計時が他の作業に引きずられるので、3 通りを交互に TIMING.reps 回測って**最小値**を採る(全回の値も残す)
  const tr = { full: [], major: [], tp: [] };
  for (let k = 0; k < TIMING.reps; k++) { tr.full.push(msPerStep(HP, P, TIMING.full)); tr.major.push(msPerStep(HP, V.major, TIMING.major)); tr.tp.push(msPerStep(HP, V.tp, TIMING.tp)); }
  const msFull = Math.min(...tr.full), msMajor = Math.min(...tr.major), msTp = Math.min(...tr.tp);
  return { id, emoji: HEAVY_EMOJI[id] || P.emoji || null, n, nMajor: n0, nGroup: nG,
    pairsAll: n * (n - 1) / 2, pairsMajor: n0 * (n0 - 1) / 2, pairsTp: n0 * (n0 - 1) / 2 + n0 * nG,
    mass: { major: mMajor, group: mGroup, central: mCentral, groupOverMajor: mGroup / mMajor, groupOverCentral: mGroup / mCentral },
    groupSameAfterReorder, tp: { on: tpOn, deny: tpDeny, n0: tpN0 }, sourcesBitSameVsMajorOnly, identitySteps: IDENTITY_STEPS, tpNaN,
    msPerStepNode: { full: msFull, major: msMajor, tp: msTp, fullOverMajor: msFull / msMajor, fullOverTp: msFull / msTp, trials: tr }, timing: TIMING };
}

function tpxPreset(phys, tp, fsOff) {
  const ph = Object.assign({ G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, cLight: 300, etaRad: 0,
    softening: 0.05, geoPN: 2, lambdaPN: 1, stateCarry: 'double', frameWeight: 'share' }, phys);
  for (const k of Object.keys(ph)) if (ph[k] === undefined) delete ph[k];
  const t = { type: 'single', m: 1e-5, radius: 0.1, x: 40, y: 0, vx: 0, vy: Math.sqrt(6.674 * 50 / 40) * 1.05, spin: 0, pinned: false };
  if (tp) t.testParticle = true;
  if (fsOff) t.frameSource = false;
  return { id: 'w283cTpx', name: 'w283c tpx', description: 'x', camera: { x: 0, y: 0, scale: 1 }, world: { boundary: 'none', size: 5000 },
    bodies: [{ type: 'single', m: 50, radius: 3, x: 0, y: 0, vx: 0, vy: 0, spin: 0.3, pinned: true, pnSource: true }, t], physics: ph };
}
/** (C③) 固定中心 + 1 粒子: 試験粒子の状態(x,y,vx,vy,spin,τ)が通常粒子とビット一致するか(源の時計 τ だけは W の源が違うので比べない)。 */
export function twoBodyChecks(HP) {
  return TWO_BODY_CASES.map((c) => {
    const run = (tp) => { build(HP, tpxPreset(c.phys, tp, c.fsOff)); const S = HP.sim; const on = S.hasTestParticle === true;
      for (let k = 0; k < TWO_BODY_STEPS; k++) S.step(DT);
      return { on, st: [S.x[1], S.y[1], S.vx[1], S.vy[1], S.spin[1], S.tau[1], S.x[0], S.y[0], S.vx[0], S.vy[0]] }; };
    const a = run(false), b = run(true);
    return { key: c.key, tpOn: b.on, bitSame: a.st.every((v, k) => Object.is(v, b.st[k])), steps: TWO_BODY_STEPS, x: b.st[0], y: b.st[1] };
  });
}
/** (C④⑤) 内蔵に宣言 0 本・入場条件の拒否理由。 */
export function denyChecks(HP) {
  let declared = 0, flaggedBuilt = 0;
  for (const p of HP.allPresets()) {
    if ((p.bodies || []).some((b) => b && b.testParticle !== undefined)) declared++;
  }
  // 141 本を 1 本ずつ build して hasTestParticle が立たないこと(既定 off)
  for (const p of HP.allPresets()) { try { build(HP, p); if (HP.sim.hasTestParticle) flaggedBuilt++; } catch (e) { /* 受理されない内蔵は無い */ } }
  const base = tpxPreset({}, true, false);
  const mk = (key) => {
    const p = J(base);
    if (key === 'notTail') p.bodies = [p.bodies[1], p.bodies[0]];
    if (key === 'leapfrog') p.integrator = 'leapfrog';
    if (key === 'kRep') p.physics.kRep = 0.1;
    if (key === 'geoPN3') {   // geoPN=3 は spaceMesh の宣言が要る(無ければ受理器が 2 へ丸める)ので内蔵 ☄️ のトイの写しの末尾に試験粒子を足す
      const g = J(HP.allPresets().find((q) => q.id === 'mercuryGeoToy3'));
      g.bodies.push({ type: 'single', m: 1e-5, radius: 0.1, x: 4000, y: 0, vx: 0, vy: 1, spin: 0, pinned: false, testParticle: true });
      return g;
    }
    if (key === 'dragRefSurface') p.physics.dragRef = 'surface';
    if (key === 'sourceFrameSourceFalse') { p.physics.frameWeight = 'pull'; p.bodies[0].frameSource = false; }
    return p;
  };
  const rows = DENY_CASES.map((c) => { build(HP, mk(c.key)); return { key: c.key, want: c.why, got: HP.sim.testParticleDeny || null, on: HP.sim.hasTestParticle === true }; });
  const nPresets = HP.allPresets().length;
  return { nPresets, declared, flaggedBuilt, rows };
}

/** (A) 正本の段別の壁時計から重い 4 本の割合と停止条件。 */
export function calauditShare(CA) {
  let total = 0; const by = {};
  for (const p of (CA.presets || [])) { const s = calStagesOf(p.run).wallSec; total += s; by[p.id] = s; }
  const rows = HEAVY_IDS.map((id) => {
    const p = (CA.presets || []).find((z) => z.id === id) || null;
    if (!p) return { id, missing: true };
    const r = p.run, sr = r.stopRule || {};
    return { id, emoji: HEAVY_EMOJI[id], n: r.n, heavy: r.n > 12, tags: (r.timeBudget || []).map((z) => z.tag),
      wallSec: by[id], steps: r.steps, msPerStepChromium: (r.steps > 0) ? by[id] / r.steps * 1000 : null,
      needPeriastra: sr.needPeriastra === undefined ? null : sr.needPeriastra, periFound: sr.periFoundA || null,
      periastraOk: sr.periastraOk === undefined ? null : sr.periastraOk, stoppedBy: sr.stoppedBy || null, maxStepsSource: sr.maxStepsSource || null,
      stepsPerOrbit0: r.stepsPerOrbit0 || null };
  });
  const heavySum = rows.reduce((a, z) => a + (z.wallSec || 0), 0);
  return { totalWallSec: total, heavyWallSec: heavySum, heavyShare: total > 0 ? heavySum / total : null, nPresets: (CA.presets || []).length,
    canonWhen: CA.meta ? CA.meta.when : null, canonTargetSha256: CA.meta ? CA.meta.targetSha256 : null, rows };
}

/** (D) 写しの判定量を正本の同じ量と並べる(対象・種類・名前が同じ行)。 */
export function compareQuantities(CA, TP) {
  return HEAVY_IDS.map((id) => {
    const a = (CA.presets || []).find((z) => z.id === id), b = (TP.presets || []).find((z) => z.id === id);
    if (!a || !b) return { id, missing: true };
    const rows = [];
    for (const qa of (a.quantities || [])) {
      const qb = (b.quantities || []).find((z) => z.target === qa.target && z.kind === qa.kind && z.name === qa.name);
      if (!qb) { rows.push({ target: qa.target, kind: qa.kind, name: qa.name, missingAfter: true }); continue; }
      const va = Number.isFinite(qa.meas) ? qa.meas : null, vb = Number.isFinite(qb.meas) ? qb.meas : null;
      rows.push({ target: qa.target, kind: qa.kind, name: qa.name, unit: qa.unit || null,
        before: va, after: vb, relDiff: (va !== null && vb !== null && va !== 0) ? (vb - va) / Math.abs(va) : null,
        verdictBefore: qa.verdict || null, verdictAfter: qb.verdict || null,
        gateBefore: qa.gate ? qa.gate.status : null, gateAfter: qb.gate ? qb.gate.status : null });
    }
    const ra = a.run || {}, rb = b.run || {};
    return { id, emoji: HEAVY_EMOJI[id], rows,
      maxAbsRelDiff: rows.reduce((m, z) => (Number.isFinite(z.relDiff) ? Math.max(m, Math.abs(z.relDiff)) : m), 0),
      // 周期の量だけの最大(近点移動・離心率は 0 に近い量なので相対差が大きく出る —— 別の列にする)
      maxAbsRelDiffPeriod: rows.filter((z) => z.kind === 'period').reduce((m, z) => (Number.isFinite(z.relDiff) ? Math.max(m, Math.abs(z.relDiff)) : m), 0),
      verdictMoved: rows.filter((z) => !z.missingAfter && z.verdictBefore !== z.verdictAfter).length,
      gateMoved: rows.filter((z) => !z.missingAfter && z.gateBefore !== z.gateAfter).length,
      before: { steps: ra.steps, wallSec: calStagesOf(ra).wallSec, periFound: (ra.stopRule || {}).periFoundA || null, periastraOk: (ra.stopRule || {}).periastraOk },
      after: { steps: rb.steps, wallSec: calStagesOf(rb).wallSec, periFound: (rb.stopRule || {}).periFoundA || null, periastraOk: (rb.stopRule || {}).periastraOk,
        tpCopy: b.tpCopy || null },
      wallRatio: (calStagesOf(rb).wallSec > 0) ? calStagesOf(ra).wallSec / calStagesOf(rb).wallSec : null };
  });
}

const f4 = (x) => (Number.isFinite(x) ? x.toPrecision(4) : '—');
const pct = (x) => (Number.isFinite(x) ? (100 * x).toFixed(1) + '%' : '—');
/** PHYSICS〔第283便c〕の表の行(QA docs.heavyCal が PHYSICS にあるかを照合する)。 */
export function docRows(Jc) {
  const out = { structure: [], quantities: [], share: null };
  const A = Jc.calaudit;
  out.share = `重い 4 本の較正走行 ${A.heavyWallSec.toFixed(1)} s / 全 ${A.nPresets} 本 ${A.totalWallSec.toFixed(1)} s = ${pct(A.heavyShare)}`;
  for (const s of Jc.structure) {
    const c = A.rows.find((z) => z.id === s.id) || {};
    out.structure.push(`| ${s.emoji} \`${s.id}\` | ${s.n}(主要 ${s.nMajor}・群 ${s.nGroup}) | ${s.pairsAll} → 主要だけ ${s.pairsMajor}・試験粒子 ${s.pairsTp} | `
      + `${f4(s.mass.groupOverMajor)} | ${f4(s.msPerStepNode.full)} / ${f4(s.msPerStepNode.major)} / ${f4(s.msPerStepNode.tp)} | `
      + `${f4(s.msPerStepNode.fullOverMajor)} / ${f4(s.msPerStepNode.fullOverTp)} | ${c.needPeriastra} 対 [${(c.periFound || []).join(', ')}] |`);
  }
  for (const q of Jc.quantities) {
    if (q.missing) continue;
    out.quantities.push(`| ${q.emoji} \`${q.id}\` | ${q.rows.length} | ${q.maxAbsRelDiffPeriod.toExponential(3)} | ${q.maxAbsRelDiff.toExponential(3)} | ${q.verdictMoved} / ${q.gateMoved} | `
      + `${q.before.wallSec.toFixed(1)} → ${q.after.wallSec.toFixed(1)} | [${(q.before.periFound || []).join(', ')}] → [${(q.after.periFound || []).join(', ')}] |`);
  }
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const CANON_IN = 'tests/out/calaudit-w249.json';
  const CA = JSON.parse(fs.readFileSync(path.join(ROOT, CANON_IN), 'utf8'));
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const calaudit = calauditShare(CA);
  console.log(`(A) ${docRows({ calaudit, structure: [], quantities: [] }).share}`);
  const structure = HEAVY_IDS.map((id) => { const s = presetStructure(HP, id);
    console.log(`(B) ${s.emoji} ${id}: n=${s.n}(主要 ${s.nMajor}・群 ${s.nGroup})・対 ${s.pairsAll}→${s.pairsMajor}/${s.pairsTp}・ms/步 ${s.msPerStepNode.full.toFixed(4)}/${s.msPerStepNode.major.toFixed(5)}/${s.msPerStepNode.tp.toFixed(4)}`
      + `(比 ${s.msPerStepNode.fullOverMajor.toFixed(1)}・${s.msPerStepNode.fullOverTp.toFixed(1)})・源 1 bit ${s.sourcesBitSameVsMajorOnly}・並べ替え ${s.groupSameAfterReorder}・TP ${s.tp.on}${s.tp.deny ? '(' + s.tp.deny + ')' : ''}`);
    return s; });
  const twoBody = twoBodyChecks(HP);
  console.log('(C③) 2 体のビット一致 ' + twoBody.filter((z) => z.bitSame && z.tpOn).length + '/' + twoBody.length);
  const deny = denyChecks(HP);
  console.log(`(C④⑤) 内蔵 ${deny.nPresets} 本・宣言 ${deny.declared}・build で立った ${deny.flaggedBuilt}・拒否 ${deny.rows.filter((z) => z.got === z.want && !z.on).length}/${deny.rows.length}`);
  // (D) 判定器を写しに掛ける(一時ファイル —— 正本は上書きしない)
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w283c-heavy-'));
  const tpOut = path.join(tmp, 'calaudit-tp.json'), tpDiag = path.join(tmp, 'calaudit-tp-diag.json');
  const t1 = Date.now();
  const sp = spawnSync(process.execPath, [path.join(ROOT, 'tests', 'exp-w249b-calaudit.mjs'), '--only', HEAVY_IDS.join(','), '--tp-copy'],
    { cwd: ROOT, env: Object.assign({}, process.env, { W249_OUT: tpOut, W249_DIAG_OUT: tpDiag, QA_TARGET: TARGET }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (sp.status !== 0) { console.error(sp.stderr.slice(-2000)); throw new Error('判定器(--tp-copy)が失敗した: ' + sp.status); }
  const TP = JSON.parse(fs.readFileSync(tpOut, 'utf8'));
  const tpWall = (Date.now() - t1) / 1000;
  fs.rmSync(tmp, { recursive: true, force: true });
  const quantities = compareQuantities(CA, TP);
  for (const q of quantities) console.log(`(D) ${q.emoji} ${q.id}: ${q.rows.length} 量・最大 |相対差| ${q.maxAbsRelDiff.toExponential(3)}・区分が動いた ${q.verdictMoved}・門が動いた ${q.gateMoved}・壁時計 ${q.before.wallSec.toFixed(1)}→${q.after.wallSec.toFixed(1)} s・近点 [${(q.after.periFound || []).join(',')}]`);
  const CODE = ['tests/exp-w283c-heavy.mjs', 'tests/lib-w283c-calstages.mjs', 'tests/exp-w249b-calaudit.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第283便c', target: TARGET, code: CODE, inputs: [TARGET, CANON_IN] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第73報)⑤: 正本再生成と QA が非常に長い → 改善・dt/8 は無くす方向・dt/4 は前回の結果を利用・dt だけで重いサンプルを調査して改善',
    reading: '統括の検証項目 R86 (iv): 重い 4 本の原因は環粒子 88〜120 個が総当たりの相互作用粒子であること(統括の検証仮説: 全粒子 対 主要天体だけで 268〜460 倍)。対策は試験粒子契約(既定 off)',
    hypothesisRatio: HYPOTHESIS_RATIO, dt: DT, timing: TIMING, identitySteps: IDENTITY_STEPS, twoBodySteps: TWO_BODY_STEPS,
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま vm で実行)。(D) だけ Chromium(判定器)',
    notClaim: ['試験が短くなった=数値が収束した', '試験粒子にすれば合', '観測一致を達成した', '較正を完了した', '新発見'] });
  const out = { meta, calaudit, structure, twoBody, deny, quantities, tpCopyRun: { wallSec: tpWall, canonWhen: TP.meta ? TP.meta.when : null },
    elapsedSec: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'heavy-w283c.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/heavy-w283c.json(' + out.elapsedSec.toFixed(1) + ' s)');
}

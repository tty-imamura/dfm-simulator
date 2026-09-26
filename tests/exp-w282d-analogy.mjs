// 第282便d(原仮定者の裁定(第72報)⑥「アナロジーは geoPN=3。中心にスケール調整した DFM 版ブラックホール。対象は球状星団・
// 楕円銀河・渦巻銀河・棒渦巻銀河。質量合わせは恒星質量ダークローター」・統括の読み R81・AN17/AN18/AN19)— **アナロジー便の器**。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む。物理コードは html の本文そのまま)
//   (A) 場の契約の読み手 `HP.dfmFieldContract`(G0)が、既存の読み手(表示 `dfmGalaxyMeshField`・共通 API `dfmField` の p=1 と p=2)の
//       宣言を与えたとき、第281便b の正本 tests/out/galaxychain-w281b.json の契約表(4 本 × 6 半径 × 64 方位の平均 χ・u_φ・|u|)を
//       **相対 1e-12** で再現するか。あわせて点ごとに旧読み手とのビット不一致数と最大相対差を数える。
//   (B) 中心 DFM BH のスピン応答: 🎋 のコピー(器の中だけ)で spaceMesh.centerSpin を "off"(既定)/"read" × 中心 spin 1.2/0 の 4 走行
//       (t=0/10/20/40)。既定では 2 走行がビット一致(第281便b の事実)・"read" で差が 0 でない・"read" の spin 0 は既定経路とビット一致。
//       半径ビンの ∂v_φ/∂Ω_core と、場の読み手の ∂u_φ/∂Ω_core(t=0 の環平均 —— 自転項は Ω に線形)。
//       スケールの無次元量 GM/(Rc²)・ΩR/c・W_bg/W_L(r)・M_center/M_周辺 と、参照の行(🎻 gw150914DFM・⚫ bhCore の同じ量 —— 巨大化はしない)。
//   (C) 🌚 galaxyAnalogyBH: 質量要素の台帳(bodies の実際の質量の和 ↔ massLedger の宣言 ↔ 純関数)・回転曲線 v_c(r)
//       (宣言した配置の実際の重力加速度 —— E4 と同じ核の `dfmField` need:"gravity"・64 方位の環平均)を 6 半径 ×
//       DR なし / 0.1 / 1 / 10 M☉ の 4 列(+ 器の中だけの比較列: 1 M☉ のハロー状分布)・T=48 の健全性と中心 spin 0 の対照・
//       光線: DR の代表粒子が E8R の「重い天体」判定に入るか・DR の質量を 0 にした写しとの光線の終端の差(**代表粒子の質量を
//       個別レンズに使わない宣言の理由を数で置く**)・個別レンズの行は ⟨m_DR⟩ で作る(tests/lib-w281c-rotorledger.mjs の η=1 の行)。
//   (D) 🛞 の f=1 台帳(tests/lib-w281c-rotorledger.mjs・F_LEDGER=1)と旧 f★≈2 の台帳(履歴の行 —— 持ち越さない)・presetSigHash 不変。
//
// ■ しないこと
//   ・「平坦回転を再現した」「消失星=DFM 減光の実例」「ダークローター=浮遊惑星の検出」と書かない・観測回転曲線と突き合わせない。
//   ・既存 140 本に触らない(コピーは器の中だけ)。DR は力学の質量要素として **🌚 にだけ**置く(代表粒子と総質量を明記)。
//
// 実行(約 2〜3 分・Chromium 不要・環境変数なし —— 既定で beta/index.html を読む。`QA_TARGET` で対象を替えられる):
//   node tests/exp-w282d-analogy.mjs
// 読む正本: tests/out/galaxychain-w281b.json(**器 exp-w281b-galaxychain を先に走らせる** —— 再生成表の after)
// 正本: tests/out/analogy-w282d.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as GC from './exp-w281b-galaxychain.mjs';
import * as LR from './lib-w281c-rotorledger.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["bhCore","galaxyAnalogyBH","galaxyMeshSpiral","galaxyMeshSpiralGeoToy","galaxyMeshSpiralGeoToyLite","gas","gw150914DFM","ngc3198DFM"],"roots":["$","DT","HP.FIELD_CONTRACT_VERSION","HP.allPresets","HP.dfmBlendComplexMoments","HP.dfmComplexMomentsOf","HP.dfmField","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.dfmFrameAt","HP.dfmGalaxyMeshField","HP.dfmMeshVelocityFieldAt","HP.presetSigHash","HP.sim","HP.validatePreset","SPACE_MESH_CENTER_SPIN","T","applyQLock","ch","ctx","cw","dfmBlendComplexMoments","dfmComplexMomentsOf","dfmField","dfmFieldContract","dfmFieldSnapshot","dfmGalaxyMeshField","dfmGeoToySpinStep","dfmGeoToyStep","isNum","presetSigHash","rayHeavy","traceRay","validateMassLedger","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w282d-analogy-1';
export const RADII = GC.RADII;               // 20/40/80/120/240/480
export const NAZ = GC.NAZ;                   // 64
export const DT = GC.DT;                     // 0.016
export const CHAIN_TIMES = GC.CHAIN_TIMES;   // 0/10/20/40
export const LITE = 'galaxyMeshSpiralGeoToyLite';
export const ANALOGY = 'galaxyAnalogyBH';
export const SPIN_A = 1.2;
export const ANALOGY_T = 48;
export const DR_SCENARIOS = [0, 0.1, 1, 10];   // ⟨m_DR⟩(M☉)— 0 は DR なし
export const REL_TOL = 1e-12;

const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (HP, id) => HP.allPresets().find((q) => q.id === id);
const rel = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);

/** S から読み手に渡す bodies(snapshot の源 + pinned・spin・R)。 */
export function bodiesOf(HP, S) {
  const snap = HP.dfmFieldSnapshot(S);
  if (!snap || !snap.bodies) return null;
  return snap.bodies.map((b, i) => Object.assign({}, b, { pinned: S.pinned[i] === 1, spin: S.spin[i], R: S.R[i] }));
}

/** 契約の読み手を 1 点で呼ぶ関数(表示の frame 背景は dfmFrameAt の値を bgU で渡す)。 */
export function contractReader(HP, S, kind, override) {
  const B = bodiesOf(HP, S);
  const c = HP.dfmFieldContractOf(S, kind);
  const C = Object.assign({}, c.contract, override || {});
  return (x, y) => {
    const o = (C.background === 'given') ? Object.assign({}, C, { bgU: (() => { const f = HP.dfmFrameAt(x, y, S); return f ? [f.ux, f.uy] : null; })() }) : C;
    if (o.background === 'given' && !o.bgU) return null;
    return HP.dfmFieldContract(B, x, y, o);
  };
}

/** (A) 1 本のプリセットで、契約の読み手 3 宣言(disp・api1・api2)の環平均と点ごとの差。 */
export function contractCheck(HP, id, canonRow) {
  const { S } = GC.buildPreset(HP, id);
  const old = GC.readers(HP, S);
  const neu = { disp: contractReader(HP, S, 'disp'), api1: contractReader(HP, S, 'api'), api2: contractReader(HP, S, 'api', { p: 2 }) };
  const decl = { disp: HP.dfmFieldContractOf(S, 'disp').contract, api1: HP.dfmFieldContractOf(S, 'api').contract };
  const out = { id, n: S.n, decl, rows: [], pointwise: {}, vsCanonMaxRel: {} };
  for (const k of ['disp', 'api1', 'api2']) {
    let nBit = 0, nPts = 0, maxRel = 0;
    for (const r of RADII) for (let a = 0; a < NAZ; a++) {
      const th = 2 * Math.PI * a / NAZ, x = r * Math.cos(th), y = r * Math.sin(th);
      const f = old[k](x, y), g = neu[k](x, y);
      if (!f || !g) { nBit++; maxRel = Infinity; continue; }
      nPts++;
      for (const [p, q] of [[f.chi, g.chi], [f.u[0], g.u[0]], [f.u[1], g.u[1]]]) {
        if (!Object.is(p, q)) nBit++;
        maxRel = Math.max(maxRel, rel(p, q));
      }
    }
    out.pointwise[k] = { points: nPts, bitMismatch: nBit, maxRel };
  }
  let worst = { disp: 0, api1: 0, api2: 0 };
  for (const r of RADII) {
    const row = { R: r };
    for (const k of ['disp', 'api1', 'api2']) {
      const st = GC.ringStats(neu[k], r, 0, 0);
      row[k] = { chi: st.chi, uPhi: st.uPhi, uAbs: st.uAbs, nNull: st.nNull };
      const cr = canonRow ? canonRow.rows.find((z) => z.R === r) : null;
      if (cr) for (const f of ['chi', 'uPhi', 'uAbs']) worst[k] = Math.max(worst[k], rel(st[f], cr[k][f]));
      else worst[k] = Infinity;
    }
    out.rows.push(row);
  }
  out.vsCanonMaxRel = worst;
  return out;
}

/** 契約の門(D₀ だけでは読まない・知らない値は null・宣言の既定)。 */
export function contractGates(HP) {
  const B = [{ m: 2, x: 0, y: 0, vx: 0, vy: 0, pinned: true, spin: 1, R: 5 }, { m: 1, x: 10, y: 0, vx: 0, vy: 1 }];
  const ok = { p: 1, eps: 1, Wbg: 1, sources: 'all', fit: 'mean', background: 'static' };
  const call = (c) => HP.dfmFieldContract(B, 3, 4, c);
  return {
    D0OnlyIsNull: call({ p: 1, eps: 1, D0: 1 }) === null,
    unknownSourcesIsNull: call(Object.assign({}, ok, { sources: 'x' })) === null,
    spinWithoutQIsNull: call(Object.assign({}, ok, { spin: 'e6' })) === null,
    xdotMissingIsNull: call(Object.assign({}, ok, { velocity: 'xdot' })) === null,
    affineWithSpinIsNull: call(Object.assign({}, ok, { fit: 'affine', spin: 'e6', q: 2 })) === null,
    spinZeroEqualsNone: (() => {
      const B0 = B.map((b) => Object.assign({}, b, { spin: 0 }));
      const a = HP.dfmFieldContract(B0, 3, 4, Object.assign({}, ok, { spin: 'e6', q: 2, need: 'uBt' }));
      const b = HP.dfmFieldContract(B0, 3, 4, Object.assign({}, ok, { need: 'uBt' }));
      return !!a && !!b && a.u.every((v, i) => Object.is(v, b.u[i])) && a.gradU.every((v, i) => Object.is(v, b.gradU[i]))
        && a.dUdt.every((v, i) => Object.is(v, b.dUdt[i]));
    })(),
    // 自転項は Ω に線形(u_spin(2Ω)=2 u_spin(Ω))・自転項の勾配を中心差分で検算
    spinLinear: (() => {
      const f = (s) => HP.dfmFieldContract(B.map((b, i) => Object.assign({}, b, i === 0 ? { spin: s } : {})), 3, 4, Object.assign({}, ok, { spin: 'e6', q: 2, spinSources: 'center' })).uSpin;
      const a = f(1), b = f(2);
      return Math.max(rel(2 * a[0], b[0]), rel(2 * a[1], b[1]));
    })(),
    gradFD: (() => {
      const C = Object.assign({}, ok, { spin: 'e6', q: 2, spinSources: 'center', need: 'uB' });
      const h = 1e-5, g = HP.dfmFieldContract(B, 3, 4, C).gradU;
      const px = HP.dfmFieldContract(B, 3 + h, 4, C).u, mx = HP.dfmFieldContract(B, 3 - h, 4, C).u;
      const py = HP.dfmFieldContract(B, 3, 4 + h, C).u, my = HP.dfmFieldContract(B, 3, 4 - h, C).u;
      const fd = [(px[0] - mx[0]) / (2 * h), (py[0] - my[0]) / (2 * h), (px[1] - mx[1]) / (2 * h), (py[1] - my[1]) / (2 * h)];
      return Math.max(...g.map((v, i) => Math.abs(v - fd[i]) / Math.max(1, Math.abs(v))));
    })(),
    dtFD: (() => {
      // 源 1(自由)が v で動くときの ∂ₜu|ₓ を、源の位置を ±h·v ずらした差分で検算(a=0)
      const C = Object.assign({}, ok, { spin: 'e6', q: 2, spinSources: 'all', need: 'uBt' });
      const B2 = [Object.assign({}, B[0], { vx: 0.3, vy: -0.2, pinned: false }), Object.assign({}, B[1], { spin: 0.5, R: 2 })];
      const h = 1e-5, g = HP.dfmFieldContract(B2, 3, 4, C).dUdt;
      const mv = (s) => B2.map((b) => Object.assign({}, b, { x: b.x + s * b.vx, y: b.y + s * b.vy }));
      const p = HP.dfmFieldContract(mv(h), 3, 4, C).u, m = HP.dfmFieldContract(mv(-h), 3, 4, C).u;
      const fd = [(p[0] - m[0]) / (2 * h), (p[1] - m[1]) / (2 * h)];
      return Math.max(...g.map((v, i) => Math.abs(v - fd[i]) / Math.max(1, Math.abs(v))));
    })(),
  };
}

/** 🎋 のコピーの走行(centerSpin と中心 spin を替える)。記録は CHAIN_TIMES の時刻の状態と半径ビン。 */
export function liteRun(HP, centerSpin, spin) {
  const { S, preset } = GC.buildPreset(HP, LITE, (p) => { p.bodies[0].spin = spin; if (centerSpin) p.physics.spaceMesh.centerSpin = centerSpin; });
  const stepsAt = CHAIN_TIMES.map((t) => Math.round(t / DT));
  const recs = [];
  let k = 0;
  const t0 = Date.now();
  for (const target of stepsAt) {
    while (k < target) { S.step(DT); k++; }
    recs.push({ t: S.t, x: Array.from(S.x.subarray(0, S.n)), y: Array.from(S.y.subarray(0, S.n)),
      vx: Array.from(S.vx.subarray(0, S.n)), vy: Array.from(S.vy.subarray(0, S.n)),
      vBins: GC.binParticles(S, (i) => [S.vx[i], S.vy[i]]), stop: S.geoToyStop, prepared: S.geoToyPrepared,
      spinSources: (S.geoToySpinSources === undefined) ? null : S.geoToySpinSources, nan: S.hasNaN ? S.hasNaN() : null,
      Eclose: S.geoToyE + S.geoToyEmesh });
  }
  return { centerSpin: centerSpin || 'off', spin, spinRead: S.spin[0], sm: preset.physics.spaceMesh, recs, msPerStep: (Date.now() - t0) / Math.max(1, k) };
}

const diffRuns = (A, B) => A.recs.map((a, j) => {
  const b = B.recs[j];
  let dx = 0, dv = 0, same = true;
  for (let i = 0; i < a.x.length; i++) {
    dx = Math.max(dx, Math.hypot(a.x[i] - b.x[i], a.y[i] - b.y[i]));
    dv = Math.max(dv, Math.hypot(a.vx[i] - b.vx[i], a.vy[i] - b.vy[i]));
    if (!Object.is(a.x[i], b.x[i]) || !Object.is(a.y[i], b.y[i]) || !Object.is(a.vx[i], b.vx[i]) || !Object.is(a.vy[i], b.vy[i])) same = false;
  }
  return { t: a.t, maxAbsDx: dx, maxAbsDv: dv, bitSame: same,
    dVphiPerOmega: a.vBins.map((z, k) => ({ R: z.R, lo: z.lo, hi: z.hi, n: z.n,
      v: (z.uPhi !== null && b.vBins[k].uPhi !== null) ? (z.uPhi - b.vBins[k].uPhi) / (A.spin - B.spin) : null })) };
});

/** 中心の無次元量(宣言した値から)。 */
export function centerDims(p, body) {
  const G = p.physics.G, c = p.physics.cLight;
  const m = body.m, R = body.radius, s = body.spin || 0;
  return { m, R, spin: s, G, c, GMoverRc2: G * m / (R * c * c), OmegaRoverC: s * R / c };
}

/** (B) スケールの無次元量(🎋 と 🌚)と参照の行。 */
export function scaleOf(HP, id) {
  const p = byId(HP, id);
  const { S } = GC.buildPreset(HP, id);
  const c0 = centerDims(p, p.bodies[0]);
  let mOther = 0; for (let i = 1; i < S.n; i++) mOther += S.m[i];
  const B = bodiesOf(HP, S);
  const C = Object.assign({}, HP.dfmFieldContractOf(S, 'api').contract);
  const wRatio = RADII.map((r) => {
    let W = 0, n = 0;
    for (let a = 0; a < NAZ; a++) { const th = 2 * Math.PI * a / NAZ; const f = HP.dfmFieldContract(B, r * Math.cos(th), r * Math.sin(th), C); if (f) { W += f.W; n++; } }
    return { R: r, WL: W / n, WbgOverWL: C.Wbg / (W / n) };
  });
  return Object.assign({ id, emoji: p.emoji, Mcenter: S.m[0], Mother: mOther, McenterOverMother: S.m[0] / mOther, Wbg: C.Wbg, WbgFrom: C.WbgFrom, p: C.p, wRatio }, c0);
}
export function referenceRows(HP) {
  const g = byId(HP, 'gw150914DFM'), b = byId(HP, 'bhCore');
  const rows = [];
  g.bodies.filter((z) => z.type === 'single').forEach((z, k) => rows.push(Object.assign({ id: 'gw150914DFM', emoji: g.emoji, body: k }, centerDims(g, z))));
  const bc = b.bodies.find((z) => z.type === 'single');
  if (bc) rows.push(Object.assign({ id: 'bhCore', emoji: b.emoji, body: 0 }, centerDims(b, bc)));
  return rows;
}

/** (B) 場の読み手の ∂u_φ/∂Ω_core(t=0・環平均 —— 自転項は Ω に線形なので uSpin/Ω)。 */
export function fieldSpinResponse(HP, id) {
  const { S } = GC.buildPreset(HP, id, (p) => { p.physics.spaceMesh.centerSpin = 'read'; });
  const B = bodiesOf(HP, S);
  const C = Object.assign({}, HP.dfmFieldContractOf(S, 'toy').contract, { need: 'u' });
  const Om = S.spin[0];
  return RADII.map((r) => {
    let s = 0, n = 0, chi = 0;
    for (let a = 0; a < NAZ; a++) {
      const th = 2 * Math.PI * a / NAZ, x = r * Math.cos(th), y = r * Math.sin(th);
      const f = HP.dfmFieldContract(B, x, y, C); if (!f) continue;
      const [ex, ey] = [-y / r, x / r];
      s += f.uSpin[0] * ex + f.uSpin[1] * ey; chi += f.chi; n++;
    }
    return { R: r, chi: chi / n, uSpinPhi: s / n, dUphiDOmega: (s / n) / Om };
  });
}

/** (C) 🌚 の DR 列を替えた写し(0 は DR の body を外す・'halo' は器の中だけの比較列)。 */
export function analogyVariant(HP, mDRsun, dist) {
  return GC.buildPreset(HP, ANALOGY, (p) => {
    const k = p.bodies.findIndex((b) => b.lightSweep === 1 && b.type === 'disk');
    if (mDRsun === 0) { p.bodies.splice(k, 1); delete p.massLedger; return; }
    const mRep = p.massLedger.darkRotor.mPerRepUnit * mDRsun / p.massLedger.darkRotor.mRotorSun;
    p.bodies[k].mMin = mRep; p.bodies[k].mMax = mRep;
    if (dist === 'halo') { p.bodies[k].profile = 'plummer'; p.bodies[k].plummerScale = 240; p.bodies[k].radius = 480; delete p.bodies[k].sersicRe; }
    delete p.massLedger;   // 比較列は台帳を持たない(宣言は 1 M☉ の本体だけ)
  });
}

/** 回転曲線: 宣言した配置の実際の重力加速度(E4 と同じ核 —— dfmField need:"gravity")の環平均で v_c=√(r·⟨−a·r̂⟩)。 */
export function rotationCurve(HP, S) {
  const B = HP.dfmFieldSnapshot(S).bodies;
  const G = S.params.G, eps = S.params.softening;
  return RADII.map((r) => {
    let ar = 0, n = 0;
    for (let a = 0; a < NAZ; a++) {
      const th = 2 * Math.PI * a / NAZ, x = r * Math.cos(th), y = r * Math.sin(th);
      const f = HP.dfmField(B, x, y, { need: 'gravity', G, eps, p: 1, D0: 0, background: 'static' });
      if (!f) continue;
      ar += -(f.gravity[0] * x + f.gravity[1] * y) / r; n++;
    }
    const aR = ar / n;
    const vKep = Math.sqrt(G * S.m[0] * r * r / Math.pow(r * r + eps * eps, 1.5));
    return { R: r, aR, vc: aR > 0 ? Math.sqrt(r * aR) : null, vKepCenter: vKep };
  });
}

/** (C) 質量要素の台帳(bodies の実際の質量 ↔ massLedger ↔ 純関数)。 */
export function analogyLedger(HP) {
  const pd = byId(HP, ANALOGY);
  const v = HP.validatePreset(clone(pd));
  const ml = v.preset.massLedger;
  const { S } = GC.buildPreset(HP, ANALOGY);
  let star = 0, dr = 0, core = 0, nStar = 0, nDR = 0, drMin = Infinity, drMax = -Infinity;
  const drIdx = [];
  for (let i = 0; i < S.n; i++) {
    if (S.pinned[i] === 1) { core += S.m[i]; continue; }
    if (S.lSw[i] === 1) { dr += S.m[i]; nDR++; drIdx.push(i); drMin = Math.min(drMin, S.m[i]); drMax = Math.max(drMax, S.m[i]); }
    else { star += S.m[i]; nStar++; }
  }
  const g = { starBase: ml.starBase, fStar: ml.fStar, gas: ml.gas, core: ml.core, unitKg: ml.unitKg };
  const led = LR.rotorLedger(g, { mStarSun: ml.mStarSun, nRatio: ml.nRatio, scenarios: ml.rotorScenarios.map((r) => r.mRotorSun) });
  let worst = 0;
  const cmp = (a, b) => { worst = Math.max(worst, rel(a, b)); };
  cmp(led.current.totalUnit, ml.currentTotalUnit); cmp(led.current.totalSun, ml.currentTotalSun);
  led.rows.forEach((r, k) => { const w = ml.rotorScenarios[k]; for (const f of ['mRotorSun', 'nRotor', 'mRotorUnit', 'totalUnit', 'totalSun']) cmp(r[f], w[f]); });
  const dRow = led.rows.find((r) => r.mRotorSun === ml.darkRotor.mRotorSun);
  return {
    declared: { starBase: ml.starBase, fStar: ml.fStar, core: ml.core, darkRotor: ml.darkRotor, defaultScenario: ml.defaultScenario, warnings: v.warnings },
    built: { n: S.n, nStar, star, nDR, dr, drMin, drMax, core, total: star + dr + core, drIndices: [drIdx[0], drIdx[drIdx.length - 1]] },
    identity: {
      nRepTimesMPerRep: ml.darkRotor.nRep * ml.darkRotor.mPerRepUnit,
      builtDrMinusDeclared: dr - ml.darkRotor.totalUnit,
      builtStarMinusStarBase: star - ml.starBase,
      builtCoreMinusCore: core - ml.core,
      drOverStar: dr / star,
      declaredRatio: ml.nRatio * ml.darkRotor.mRotorSun / ml.mStarSun,
      ledgerRowMinusDr: dRow.mRotorUnit - ml.darkRotor.totalUnit,
      recomputeMaxRel: worst,
    },
    ledger: { nStars: led.nStars, nRotor: led.nRotor, current: led.current,
      rows: led.rows.map((r) => ({ mRotorSun: r.mRotorSun, nRotor: r.nRotor, mRotorUnit: r.mRotorUnit, totalUnit: r.totalUnit, totalSun: r.totalSun, ratioToCurrent: r.ratioToCurrent })) },
    fNote: '🌚 は massCalibration を持たない(f=1)—— 旧 f≈2 の質量補正を使わない',
  };
}

/** (C) 健全性と中心 spin 0 の対照(T=48)。 */
export function analogyHealth(HP, spin) {
  const { S } = GC.buildPreset(HP, ANALOGY, spin === undefined ? null : (p) => { p.bodies[0].spin = spin; });
  const N = Math.round(ANALOGY_T / DT);
  const disk = [], drs = [];
  for (let i = 0; i < S.n; i++) { if (S.pinned[i] === 1) continue; if (S.lSw[i] === 1) drs.push(i); else if (Math.hypot(S.x[i], S.y[i]) > 0 && i > 90) disk.push(i); }
  const Rref = Math.max(...disk.map((i) => Math.hypot(S.x[i], S.y[i])));
  const t0 = Date.now();
  for (let k = 0; k < N; k++) S.step(DT);
  const ms = (Date.now() - t0) / N;
  let nan = 0; for (let i = 0; i < S.n; i++) if (!Number.isFinite(S.x[i]) || !Number.isFinite(S.vx[i])) nan++;
  const ret = (ids) => ids.filter((i) => Math.hypot(S.x[i], S.y[i]) <= Rref).length / ids.length;
  return { spin: S.spin[0], T: S.t, steps: N, msPerStep: ms, nan, Rref, diskN: disk.length, drN: drs.length,
    diskRetention: ret(disk), drRetention: ret(drs), Eclose: S.geoToyE + S.geoToyEmesh, stop: S.geoToyStop,
    spinSources: S.geoToySpinSources, vBins: GC.binParticles(S, (i) => [S.vx[i], S.vy[i]]),
    x: Array.from(S.x.subarray(0, S.n)), y: Array.from(S.y.subarray(0, S.n)) };
}

/** (C) 光線: DR の代表粒子が「重い天体」に入るか・DR の質量を 0 にした写しとの光線の終端の差。 */
export function analogyRays(HP, H) {
  const traceRay = H.evalExpr('traceRay'), rayHeavy = H.evalExpr('rayHeavy');
  const { S } = GC.buildPreset(HP, ANALOGY);
  let hC = 0, hS = 0, hD = 0;
  const dr = [];
  for (let i = 0; i < S.n; i++) {
    const h = rayHeavy(S, i);
    if (S.pinned[i] === 1) hC += h ? 1 : 0; else if (S.lSw[i] === 1) { hD += h ? 1 : 0; dr.push(i); } else hS += h ? 1 : 0;
  }
  const fan = () => { const e = []; for (let k = 0; k <= 30; k++) { const r = traceRay(S, -600, -300 + 20 * k, 1, 0, 2, 700, null); e.push([r.x, r.y, r.cx, r.cy]); } return e; };
  const eWith = fan();
  const keep = dr.map((i) => S.m[i]);
  dr.forEach((i) => { S.m[i] = 0; });
  const eWithout = fan();
  dr.forEach((i, k) => { S.m[i] = keep[k]; });
  let maxAng = 0, nDiff = 0, maxPos = 0;
  eWith.forEach((a, k) => { const b = eWithout[k];
    const da = Math.abs(Math.atan2(a[3], a[2]) - Math.atan2(b[3], b[2])); maxAng = Math.max(maxAng, da);
    maxPos = Math.max(maxPos, Math.hypot(a[0] - b[0], a[1] - b[1]));
    if (!a.every((v, j) => Object.is(v, b[j]))) nDiff++; });
  // 個別レンズの行は ⟨m_DR⟩ で作る(η=1・MOA-9y-5919 の幾何 —— 第281便c の純関数)
  const e = LR.lensEtaTable({ mLensEarth: 0.75, scenarios: [0.1, 1, 10] });
  return { heavy: { center: hC, stars: hS, darkRotor: hD, nDR: dr.length }, rays: eWith.length,
    maxDeflectionDiffRad: maxAng, maxEndPosDiff: maxPos, raysDiffering: nDiff,
    lensRowsFromMeanMass: e.rows.map((r) => ({ mRotorSun: r.mRotorSun, tEDaysEta1: r.tEDaysEta1, thetaEMuasEta1: r.thetaEMuasEta1 })),
    note: '代表粒子 1 体(53.125 単位 ≈ 2.7×10⁵ M☉)は E8R の「重い天体」判定に入る —— 個別レンズ(光線・減光)にこの質量を使わない宣言(massLedger.darkRotor.lens:"excluded")。個別の行は ⟨m_DR⟩ で作る' };
}

/** (D) 🛞 の f=1 台帳と旧 f★≈2 の台帳(履歴 —— 持ち越さない)・署名。 */
export function ngcLedger(HP) {
  const pd = byId(HP, 'ngc3198DFM');
  const g1 = LR.massGroupsFromPreset(pd), gOld = LR.massGroupsFromPreset(pd, { fLedger: pd.massCalibration.factorUniform });
  const l1 = LR.rotorLedger(g1), lOld = LR.rotorLedger(gOld);
  const noML = clone(pd); delete noML.massLedger;
  const ml = HP.validatePreset(clone(pd)).preset.massLedger;
  return { fLedger: g1.fStar, fDynamics: g1.fDynamics, currentTotalUnit: l1.current.totalUnit, parts: { star: g1.fStar * g1.starBase, gas: g1.gas, core: g1.core },
    rows: l1.rows.map((r) => ({ mRotorSun: r.mRotorSun, mRotorUnit: r.mRotorUnit, totalUnit: r.totalUnit, totalSun: r.totalSun })),
    historyW281c: { fStar: gOld.fStar, currentTotalUnit: lOld.current.totalUnit, note: '第281便c の台帳(f★=f_dyn≈2)—— 持ち越さない' },
    declared: { version: ml.version, fStar: ml.fStar, fDynamics: ml.fDynamics, currentTotalUnit: ml.currentTotalUnit },
    presetSigHash: HP.presetSigHash(pd), presetSigHashNoLedger: HP.presetSigHash(noML) };
}

/** 参考 3 件の行分け(**数ではなく行の宣言** —— 個数・質量関数を N_DR に足さない)。 */
export const REFERENCE_ROWS = [
  { key: 'MOA-9y-5919', row: '短時間レンズ(θ_E あり)・地球質量級・個数 20 倍の行', use: '個別レンズの行(η=1 の t_E・θ_E を ⟨m_DR⟩ で並べる)', notUse: '恒星質量へ上げない・N_DR の質量の根拠にしない', source: '第281便c の出典欄(番号のみ・未取得)' },
  { key: 'M31-2014-DS1', row: '黄超巨星の消失・失敗超新星〜数 M☉ の BH の候補・塵に包まれた生存星の対立解釈あり', use: '消失の行(比較資料)', notUse: '質量関数の根拠にしない・減光の観測例として数えない', source: '未取得' },
  { key: 'VASCO', row: '世紀をまたぐ消失・出現の候補・選択効果', use: '減光検証の行(検出限界・一過性・選択効果)', notUse: '候補の個数を N_DR に足さない', source: '未取得' },
];

/**
 * PHYSICS〔第282便d〕の表の行(QA `preset.fieldContract`・`behavior.centerSpinResponse`・`docs.analogyLedger` が正本から作り直して探す)。
 * 書式を 1 か所に置く(文書と QA が同じ関数で書く)。
 */
export function docRows(J) {
  const e1 = (x) => (x === 0 ? '0' : Number(x).toExponential(1));
  const f3 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(3));
  const f4 = (x) => (x === null || x === undefined ? '—' : Number(x).toFixed(4));
  const out = { contract: [], spin: [], scale: [], ledger: [], curves: [], refs: [], ngc: [] };
  const sc = J.scale;
  for (const z of [sc.lite, sc.analogy]) out.scale.push(`| ${z.emoji} ${z.id} | ${z.Mcenter} | ${f4(z.GMoverRc2)} | ${f3(z.OmegaRoverC)} | ${f3(z.McenterOverMother)} | ${[0, 2, 4, 5].map((k) => f4(z.wRatio[k].WbgOverWL)).join(' / ')} |`);
  for (const z of sc.references) out.scale.push(`| 参照: ${z.emoji} ${z.id}#${z.body} | ${z.m.toFixed(1)} | ${f4(z.GMoverRc2)} | ${f3(z.OmegaRoverC)} | — | — |`);
  for (const c of J.contract.presets) {
    const v = c.vsCanonMaxRel, p = c.pointwise;
    out.contract.push(`| ${c.id} | ${e1(v.disp)} / ${e1(v.api1)} / ${e1(v.api2)} | ${p.disp.bitMismatch} / ${p.api1.bitMismatch} / ${p.api2.bitMismatch}(${p.api1.points} 点)|`);
  }
  const R = J.spinResponse.response;
  R.readPair.forEach((z, k) => {
    const o = R.offPair[k], zz = R.readZeroVsDefault[k];
    out.spin.push(`| t=${z.t.toFixed(0)} | ${f3(o.maxAbsDx)} | ${f3(z.maxAbsDx)} | ${f3(z.maxAbsDv)} | ${zz.bitSame ? 'ビット一致' : '差あり'} |`);
  });
  const t40 = R.readPair[R.readPair.length - 1];
  J.spinResponse.field.forEach((z, k) => {
    const b = t40.dVphiPerOmega[k];
    out.spin.push(`| ${z.R} | ${f4(z.chi)} | ${f4(z.dUphiDOmega)} | ${b && b.n ? f3(b.v) + '(' + b.n + ' 粒)' : '—'} |`);
  });
  const L = J.analogy.ledger;
  out.ledger.push(`| 現状(DR なし)| 0 | ${f3(L.ledger.current.totalUnit)} | ${fmtSci(L.ledger.current.totalSun)} | 1 |`);
  for (const r of L.ledger.rows) out.ledger.push(`| ${r.mRotorSun} M☉ | ${f3(r.mRotorUnit)} | ${f3(r.totalUnit)} | ${fmtSci(r.totalSun)} | ${f3(r.ratioToCurrent)} |`);
  const d = L.declared.darkRotor;
  out.ledger.push(`N_rep=${d.nRep} × ${d.mPerRepUnit} = ${L.built.dr}`);
  const C = J.analogy.rotationCurves, H = J.analogy.haloColumn;
  C[0].rows.forEach((z, j) => {
    out.curves.push(`| ${z.R} | ${C.map((c) => f3(c.rows[j].vc)).join(' | ')} | ${f3(H.rows[j].vc)} | ${f3(z.vKepCenter)} |`);
  });
  for (const r of J.references) out.refs.push(`| ${r.key} | ${r.row} | ${r.use} | ${r.notUse} | ${r.source} |`);
  const N = J.ngc;
  out.ngc.push(`| f★=1(第282便d)| ${f3(N.parts.star)} | ${f3(N.parts.gas)} | ${f3(N.parts.core)} | ${f3(N.currentTotalUnit)} |`);
  out.ngc.push(`| 旧 f★=${N.historyW281c.fStar}(第281便c —— 持ち越さない)| — | — | — | ${f3(N.historyW281c.currentTotalUnit)} |`);
  return out;
}
function fmtSci(x) { return LR.fmtSci(x); }

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const outDir = path.join(ROOT, 'tests', 'out');
  const CANON_IN = 'tests/out/galaxychain-w281b.json';
  const GJ = JSON.parse(fs.readFileSync(path.join(ROOT, CANON_IN), 'utf8'));
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const { loadHtmlHeadless } = await import('./lib-w279b-headless.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  // (A)
  const contract = GC.CONTRACT_PRESETS.map((id) => contractCheck(HP, id, GJ.contract.find((c) => c.id === id)));
  const gates = contractGates(HP);
  for (const c of contract) console.log(`(A) ${c.id}: 正本との最大相対差 disp ${c.vsCanonMaxRel.disp.toExponential(2)} / api1 ${c.vsCanonMaxRel.api1.toExponential(2)} / api2 ${c.vsCanonMaxRel.api2.toExponential(2)} ・点ごとのビット不一致 ${c.pointwise.disp.bitMismatch}/${c.pointwise.api1.bitMismatch}/${c.pointwise.api2.bitMismatch}`);
  console.log('(A) 門', JSON.stringify(gates));
  // (B)
  const t1 = Date.now();
  const D12 = liteRun(HP, null, SPIN_A), D0 = liteRun(HP, null, 0), R12 = liteRun(HP, 'read', SPIN_A), R0 = liteRun(HP, 'read', 0);
  console.log('(B) 4 走行 ' + ((Date.now() - t1) / 1000).toFixed(1) + ' s');
  const resp = { offPair: diffRuns(D12, D0), readPair: diffRuns(R12, R0), readZeroVsDefault: diffRuns(R0, D0).map((z) => ({ t: z.t, bitSame: z.bitSame, maxAbsDx: z.maxAbsDx })),
    readSpinVsDefault: diffRuns(R12, D12).map((z) => ({ t: z.t, bitSame: z.bitSame, maxAbsDx: z.maxAbsDx })) };
  for (const z of resp.readPair) console.log(`(B) t=${z.t.toFixed(1)} read: maxΔx ${z.maxAbsDx.toExponential(3)}・off: ${resp.offPair.find((q) => Math.abs(q.t - z.t) < 1e-9).maxAbsDx}`);
  const runMeta = (R) => ({ centerSpin: R.centerSpin, spin: R.spin, spinRead: R.spinRead, sm: R.sm, msPerStep: R.msPerStep,
    recs: R.recs.map((z) => ({ t: z.t, stop: z.stop, prepared: z.prepared, spinSources: z.spinSources, nan: z.nan, Eclose: z.Eclose, vBins: z.vBins })) });
  const fieldResp = fieldSpinResponse(HP, LITE);
  const scale = { lite: scaleOf(HP, LITE), analogy: scaleOf(HP, ANALOGY), references: referenceRows(HP) };
  // (C)
  const t2 = Date.now();
  const ledger = analogyLedger(HP);
  const curves = DR_SCENARIOS.map((m) => { const { S } = analogyVariant(HP, m); return { mRotorSun: m, n: S.n, x: Array.from(S.x.subarray(0, 171)), rows: rotationCurve(HP, S) }; });
  const same171 = curves.every((c) => c.x.every((v, i) => Object.is(v, curves[0].x[i])));
  const halo = (() => { const { S } = analogyVariant(HP, 1, 'halo'); return { mRotorSun: 1, dist: 'halo(Plummer 尺度 240・半径 480 —— 器の中だけの比較列)', n: S.n, rows: rotationCurve(HP, S) }; })();
  const H = loadHtmlHeadless(path.join(ROOT, TARGET));
  const rays = analogyRays(H.HP, H);
  const hA = analogyHealth(HP), h0 = analogyHealth(HP, 0);
  let dxA = 0; for (let i = 0; i < hA.x.length; i++) dxA = Math.max(dxA, Math.hypot(hA.x[i] - h0.x[i], hA.y[i] - h0.y[i]));
  const strip = (h) => { const o = Object.assign({}, h); delete o.x; delete o.y; return o; };
  const health = { declared: strip(hA), spinZero: strip(h0), maxAbsDxSpinVsZero: dxA,
    dVphiPerOmega: hA.vBins.map((z, k) => ({ R: z.R, lo: z.lo, hi: z.hi, n: z.n, v: (z.uPhi !== null && h0.vBins[k].uPhi !== null) ? (z.uPhi - h0.vBins[k].uPhi) / (hA.spin - h0.spin) : null })) };
  console.log('(C) ' + ((Date.now() - t2) / 1000).toFixed(1) + ' s・v_c(1 M☉) ' + curves[2].rows.map((r) => r.vc.toFixed(3)).join('/') + '・健全性 NaN ' + hA.nan + '・保持 ' + hA.diskRetention + '/' + hA.drRetention + '・spin 応答 maxΔx ' + dxA.toExponential(3));
  // (D)
  const ngc = ngcLedger(HP);
  console.log('(D) 🛞 f=1 台帳 ' + ngc.currentTotalUnit + '(旧 ' + ngc.historyW281c.currentTotalUnit + ')・sig ' + ngc.presetSigHash + '/' + ngc.presetSigHashNoLedger);
  const CODE = ['tests/exp-w282d-analogy.mjs', 'tests/exp-w281b-galaxychain.mjs', 'tests/lib-w281c-rotorledger.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第282便d', target: TARGET, code: CODE, inputs: [TARGET, CANON_IN] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length, headlessErrors: H.errors.length,
    ruling: '原仮定者の裁定(第72報)⑥: アナロジーは geoPN=3・中心にスケール調整した DFM 版ブラックホール・質量合わせは恒星質量ダークローター',
    reading: '統括の読み R81(共通場 API G0・中心 BH のスピン応答・DR は力学の質量要素・f=1 台帳 767.5)・AN17/AN18/AN19',
    radii: RADII, nAz: NAZ, dt: DT, chainTimes: CHAIN_TIMES, spinA: SPIN_A, analogyT: ANALOGY_T, drScenarios: DR_SCENARIOS,
    notClaim: ['平坦回転を再現した', '銀河を較正した', 'ダークローター=浮遊惑星の検出', '消失星=DFM 減光の実例', '観測一致を達成した', '新発見'] });
  const out = { meta,
    contract: { version: HP.FIELD_CONTRACT_VERSION, presets: contract, gates },
    spinResponse: { preset: LITE, runs: { offSpin: runMeta(D12), offZero: runMeta(D0), readSpin: runMeta(R12), readZero: runMeta(R0) }, response: resp, field: fieldResp },
    scale,
    analogy: { preset: ANALOGY, ledger, rotationCurves: curves.map((c) => ({ mRotorSun: c.mRotorSun, n: c.n, rows: c.rows })), starsSameAcrossColumns: same171, haloColumn: halo, rays, health },
    ngc, references: REFERENCE_ROWS,
    elapsedSec: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'analogy-w282d.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/analogy-w282d.json(' + out.elapsedSec.toFixed(1) + ' s)');
}

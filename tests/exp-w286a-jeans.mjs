// 第286便a(原仮定者の裁定(第76報)⑤・統括の検証項目 R103・AN60)—— **動径 Jeans の初期分布の器**(Node だけ・数秒)。
//
//   (1) 純関数 tests/lib-w286a-jeans.mjs の検算 harmonicGaussian(σ²=a²{ω_g²−(Ω−ω)²}・a=2/ω_g=3/Ω=0.4/ω=0.1 で 35.64・相対差 ≤ 1e-4)と
//       ⟨a_mesh,r⟩=(Ω²−2Ωω)r(常に斥力ではない)—— **近似問題の検算であって粒子系の安定化の証明ではない**。
//   (2) 負の σ² の拒否(「平衡解なし」—— 純関数は JeansNoSolution を投げ、html の `jeansSigma2Profile` は ok:false を返す。0 へ丸めない)。
//   (3) html の `jeansSigma2Profile` と純関数を同じ入力で照合(検算の格子・💮 の build が作った profile —— ビット一致を数える)。
//   (4) 💮 の t=0: 反復の残差・σ₀・|⟨a_mesh,r⟩|/g の最大・恒星と DR の t=0 の v_rot/σ と束縛率、**∂ₜū=0 の近似の大きさ**
//       (場の契約 need:"uBt" の ∂ₜū〔源の加速度 = 重力 —— トイと同じ〕の環平均の動径成分 / g の最大)。
//   (5) 受理器: vMode "jeans" は plummer の disk 行だけ・jeansRot は 0〜0.5・angularSym は n の約数・dragR は centerSpin:"read" の宇宙だけ。
// **2D 投影のアナロジー**(面内の運動 —— 3D 分布の投影と同じではない)。「安定」「平衡版」と書かない。
//
// 実行: node tests/exp-w286a-jeans.mjs   読む正本: なし(html だけ)。正本: tests/out/jeans-w286a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as JL from './lib-w286a-jeans.mjs';
import * as E283 from './exp-w283f-cluster.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","CONTACT_MODE_KEY","DT","HP.allPresets","HP.dfmField","HP.dfmFieldContractOf","HP.dfmFieldSnapshot","HP.sim","HP.validatePreset","T","ch","contactNoneOf","ctx","cw","dfmField","dfmFieldContract","geoCoreDispatch","jeansRowsVelocities","jeansSigma2Profile"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w286a-jeans-1';
export const PRESET = 'clusterAnalogyBH';
export const CHECK = Object.freeze({ a: 2, wg: 3, Om: 0.4, om: 0.1, exact: 35.64, relTol: 1e-4 });
const clone = (o) => JSON.parse(JSON.stringify(o));

/** (3) html と純関数の照合(同じ配列 → 同じ σ²)。 */
export function compareHtmlLib(fnHtml, r, Sig, g, aM, V) {
  const h = fnHtml(r, Sig, g, aM, V);
  let lib = null, threw = null;
  try { lib = JL.jeansSigma2(r, Sig, g, aM, V); } catch (e) { threw = e.code || String(e); }
  if (!h.ok || !lib) return { htmlOk: h.ok, htmlBad: h.badRadius === undefined ? null : h.badRadius, libThrew: threw, bitSame: (!h.ok && threw === 'noEquilibrium') };
  let nd = 0, w = 0;
  for (let k = 0; k < r.length; k++) { if (!Object.is(h.sigma2[k], lib.sigma2[k])) nd++; w = Math.max(w, E283.rel(h.sigma2[k], lib.sigma2[k])); }
  return { htmlOk: true, n: r.length, nDiffer: nd, maxRel: w, bitSame: nd === 0 };
}

/** (4) 💮 の t=0 の量と ∂ₜū の近似の大きさ。 */
export function t0Profile(HP, H) {
  const p = clone(HP.allPresets().find((q) => q.id === PRESET));
  const v = HP.validatePreset(p);
  HP.sim.build(v.preset);
  const S = HP.sim, pop = E283.populations(v.preset), J = S.eqInit.jeans;
  const m0 = E283.measure(S, pop, 2 * v.preset.bodies[1].radius);
  const pr = J[0].profile;
  // ∂ₜū(源の加速度 = 重力 —— トイと同じ規則)の環平均の動径成分
  const C = Object.assign({}, HP.dfmFieldContractOf(S, 'toy').contract); C.need = 'uBt';
  const sm = S.params.spaceMesh, Rd = sm.dragR;
  const BD = []; for (let i = 0; i < S.n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0, spin: S.spin[i],
    R: (S.pinned[i] === 1 && Rd > 0) ? Rd : S.R[i], omegaDot: 0, pinned: S.pinned[i] === 1 });
  const G = S.params.G, eps = S.params.softening;
  for (let i = 0; i < S.n; i++) { if (S.pinned[i] === 1) continue;
    const f = HP.dfmField(BD, S.x[i], S.y[i], { excludeBodyId: i, need: 'gravity', G, eps, p: C.p, D0: C.Wbg, background: 'static' });
    BD[i].ax = f.gravity[0]; BD[i].ay = f.gravity[1]; }
  const NAZ = 16, rows = [];
  let worst = 0;
  for (let k = 8; k < pr.r.length; k += 8) {
    const r = pr.r[k]; let s = 0, n = 0;
    for (let t = 0; t < NAZ; t++) { const th = 2 * Math.PI * (t + 0.5) / NAZ, c = Math.cos(th), sn = Math.sin(th);
      const f = H.evalExpr('dfmFieldContract')(BD, r * c, r * sn, C); if (!f || !f.dUdt) continue; s += f.dUdt[0] * c + f.dUdt[1] * sn; n++; }
    const dt = n ? s / n : null, ratio = (dt !== null && pr.g[k] > 0) ? Math.abs(dt) / pr.g[k] : null;
    if (ratio !== null) worst = Math.max(worst, ratio);
    rows.push({ r, g: pr.g[k], aMesh: pr.aMesh[k], dUdtR: dt, dUdtOverG: ratio, sigma: Math.sqrt(pr.sigma2[k]), Vphi: pr.Vphi[k] });
  }
  let meshOverG = 0; for (let k = 1; k < pr.r.length; k++) if (pr.g[k] > 0) meshOverG = Math.max(meshOverG, Math.abs(pr.aMesh[k]) / pr.g[k]);
  const vrs = (ids) => { let sp = 0, n = 0; const vp = [], vr = []; for (const i of ids) { const r = Math.hypot(S.x[i], S.y[i]); if (!(r > 0)) continue;
    const a = (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r, b = (S.x[i] * S.vx[i] + S.y[i] * S.vy[i]) / r; vp.push(a); vr.push(b); sp += a; n++; }
    const m = sp / n, mr = vr.reduce((x, y) => x + y, 0) / n; let s2 = 0; for (let k = 0; k < n; k++) s2 += (vp[k] - m) ** 2 + (vr[k] - mr) ** 2; const sg = Math.sqrt(s2 / (2 * n)); return { vRot: m, sigma: sg, ratio: Math.abs(m) / sg }; };
  return { rows: J.map((z) => ({ status: z.status, rot: z.rot, sigma0: z.sigma0, vMax: z.vMax, iters: z.iters, toyField: z.toyField, dragR: z.dragR, dtUbar: z.dtUbar })),
    meshOverGMax: meshOverG, dUdtOverGMax: worst, dUdtRows: rows,
    t0: { stars: vrs(pop.stars), dr: vrs(pop.dr), boundStars: m0.info.boundStars, boundDR: m0.info.boundDR, axisStars: m0.axis, rhStars: m0.rhStars, rhDR: m0.info.rhDR },
    profile: pr };
}

/** (5) 受理器。 */
export function acceptance(HP) {
  const base = HP.allPresets().find((q) => q.id === PRESET);
  const t = (f) => { const p = clone(base); f(p); const v = HP.validatePreset(p); return { ok: v.ok, err: (v.errors || []).join(' / ').slice(0, 120) }; };
  return {
    nonPlummer: t((p) => { p.bodies[2].profile = 'exponential'; p.bodies[2].sersicRe = 10; delete p.bodies[2].plummerScale; }),
    rotTooHigh: t((p) => { p.bodies[1].jeansRot = 0.6; }),
    symNotDivisor: t((p) => { p.bodies[1].angularSym = 7; }),
    dragRNoSpin: t((p) => { delete p.physics.spaceMesh.centerSpin; }),
    dragRNeg: t((p) => { p.physics.spaceMesh.dragR = -1; }),
    declared: t(() => {}),
  };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const TARGET = process.env.QA_TARGET || 'beta/index.html';
if (IS_MAIN) {
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const t0 = Date.now();
  const { loadHtmlHeadless } = await import('./lib-w279b-headless.mjs');
  const H = loadHtmlHeadless(path.join(ROOT, TARGET));
  const HP = H.HP;
  const check = JL.harmonicGaussian({ a: CHECK.a, wg: CHECK.wg, Om: CHECK.Om, om: CHECK.om });
  const noSol = JL.noSolutionCase();
  const fnHtml = H.evalExpr('jeansSigma2Profile');
  // (3a) 検算の格子で html と純関数
  const K = 2000, R = 24, r = new Float64Array(K + 1), Sig = new Float64Array(K + 1), g = new Float64Array(K + 1), aM = new Float64Array(K + 1), V = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) { const s = R * k / K; r[k] = s; Sig[k] = Math.exp(-s * s / 8); g[k] = 9 * s; V[k] = 0.1 * s; aM[k] = JL.toyMeanAccel([0, 0.4 * s], [0, -0.4, 0.4, 0], [0, 0.1 * s])[0]; }
  const cmpCheck = compareHtmlLib(fnHtml, r, Sig, g, aM, V);
  // (3b) 平衡解なしの入力で html も ok:false
  const nsK = 200, nr = [], nS = [], ng = [], na = [], nv = [];
  for (let k = 0; k <= nsK; k++) { const s = 10 * k / nsK; nr.push(s); nS.push(1 / (1 + s * s) ** 2); ng.push(s / (1 + s * s) ** 1.5); na.push(s > 5 ? 2 * ng[k] : 0); nv.push(0); }
  const cmpNoSol = compareHtmlLib(fnHtml, nr, nS, ng, na, nv);
  // (4) 💮 の t=0 と (3c) build の profile を純関数で作り直す
  const T0 = t0Profile(HP, H);
  const P = T0.profile;
  const cmpBuild = compareHtmlLib(fnHtml, P.r, P.Sig, P.g, P.aMesh, P.Vphi);
  let wBuild = 0; { const lib = JL.jeansSigma2(P.r, P.Sig, P.g, P.aMesh, P.Vphi); P.sigma2.forEach((x, k) => { wBuild = Math.max(wBuild, E283.rel(x, lib.sigma2[k])); }); }
  const acc = acceptance(HP);
  const CODE = ['tests/exp-w286a-jeans.mjs', 'tests/lib-w286a-jeans.mjs', 'tests/exp-w283f-cluster.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第286便a', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: JL.JEANS_LIB_VERSION,
    ruling: '原仮定者の裁定(第76報)⑤: 球状星団はわずかに回転している —— これをヒントにバランスの取れる状態を計算で割り出す',
    reading: '統括の検証項目 R103(2D 等方・定常・軸対称の動径 Jeans 式・外縁の圧力 0・負の σ² は平衡解なし・速度依存の a_mesh は分布で平均して反復・∂ₜu=0 の近似条件の宣言・検算は近似問題の検算)・AN60',
    notClaim: ['安定平衡版', '形状が安定した', '粒子系の安定化の証明', '3D の球状星団の平衡'] });
  Object.assign(meta, W281A_SCOPE, w281aStableInputs(ROOT, meta.inputs));
  delete T0.profile;
  const out = { meta, check: Object.assign({}, CHECK, { result: check, pass: check.relDiff <= CHECK.relTol }), noSolution: noSol,
    htmlVsLib: { check: cmpCheck, noSolution: cmpNoSol, build: Object.assign(cmpBuild, { maxRelStored: wBuild }) },
    t0: T0, acceptance: acc, elapsedS: (Date.now() - t0) / 1000 };
  fs.mkdirSync(path.join(ROOT, 'tests', 'out'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'tests', 'out', 'jeans-w286a.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify({ check: check.relDiff, noSol, cmpCheck, cmpNoSol, cmpBuild, wBuild, meshOverG: T0.meshOverGMax, dUdtOverG: T0.dUdtOverGMax, t0: T0.t0, acc }, null, 0));
  console.log('→ tests/out/jeans-w286a.json(' + out.elapsedS.toFixed(1) + ' s)');
}

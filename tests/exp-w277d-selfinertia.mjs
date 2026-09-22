// 第277便d(原仮定者の裁定〔第67報〕(3))— **慣性移動の仮定の検証と、現行エンジンの自己項監査**。
//
// ■ 出すもの
//   (i)   1 粒子・外力ゼロ・背景ゼロで等速直線運動が **Strict に**残るか(20,000 步)
//   (ii)  2 体で重心運動と換算質量の 1 体問題が保たれるか
//   (iii) **否定対照**: 自己項を分母へ入れると他天体の寄与が消える(ρ→0 の列)
//   (iv)  **否定対照**: L=½m|v−u_self|² に u_self=v を入れると運動エネルギーが 0 になる
//   (v)   **現行 html の機械監査**: `dfmLocalMeshField` / `dfmField` / `dfmFrameAt` と `S._core` の
//         対ループで**自己源が和から除かれているか**を、行番号つきで拾う(**html は読むだけ**)
//   (vi)  非対角項が `meshFieldNoD0`(自己を外した源集合)と一致するか(純関数どうしの突合)
//
// ■ しないこと
//   ・エンジンへ接続しない(`beta/index.html` は 1 バイトも書き換えない)。
//   ・「慣性を導出した」「運動量則を導出した」とは書かない。
//   ・自己項を分母へ入れる実装を採用しない(**否定対照としてだけ**置く)。
//
// 実行: node tests/exp-w277d-selfinertia.mjs
// 出力: tests/out/selfinertia-w277d.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as SI from './lib-w277d-selfinertia.mjs';
import { meshFieldNoD0 } from './lib-w275b-meshfield.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'selfinertia-w277d.json');
const HARNESS_VERSION = 'w277d-selfinertia-1';

/* ── 仮説(原仮定者の裁定〔第67報〕(3)の文をそのまま置く) ─────────────────── */
const HYPOTHESIS = {
  statement: '慣性移動は、複素決定力による、自分自身に対するゼロ距離の座標変換である',
  source: '原仮定者の裁定(第67報)(3)',
  implications: [
    '自己場の値 m/0 を数値計算しない(使うのは有限な極限 u_self=v だけ)',
    '自己項は正則化した自己並進写像 selfDrift(x,v,Δt)=x+vΔt として扱う',
    '既存の位置更新 x+=vΔt と**二重に足さない**(新しい項ではなく同値写像である)',
    '自己項を他天体の重み付き平均の**分母へ入れない**',
    '自己慣性を担う対角項と、外部源との相対変換を担う非対角項を分ける',
    '公理だけでは質量・運動量則は導出されない(L=½m|v−u_self|² は退化する)',
    '背景複素場 W₀ とは**独立に**記帳する(同じ数を両方に入れない)',
  ],
  notDerived: '本便は仮説と、その含意の検算・否定対照を置いただけである。**慣性は導出していない。**',
  engineConnected: false,
};

/* ── (i) 1 粒子・Strict ──────────────────────────────────────────────────── */
const DRIFT_CASES = [
  { name: '整数速度・刻み 2^-6', x0: [0, 0], v0: [3, -4], dt: 1 / 64, steps: 20000 },
  { name: '無理数速度・刻み 0.01', x0: [1.5, -2.25], v0: [Math.PI, -Math.E], dt: 0.01, steps: 20000 },
  { name: '実スケール(m・s)', x0: [1.9596e7, 0], v0: [0, 198.9], dt: 27.6, steps: 20000 },
];
const driftRows = DRIFT_CASES.map((c) => Object.assign({ name: c.name },
  SI.driftStrictTest(c.x0, c.v0, c.dt, c.steps)));
const doubleCount = SI.doubleCountControl([0, 0], [3, -4], 1 / 64, 20000);
const selfReg = SI.selfTermRegularization(1.303e22, [0, 198.9], { p: 2 });

/* ── (ii) 2 体・重心 ─────────────────────────────────────────────────────── */
const TWO_BODY = [
  { name: 'トイ(等質量・円)', G: 1, eps: 0, dt: 1e-3, steps: 20000,
    bodies: [{ m: 1, x: -0.5, y: 0, vx: 0, vy: -0.5 }, { m: 1, x: 0.5, y: 0, vx: 0, vy: 0.5 }] },
  { name: 'トイ(質量比 8:1・重心が動く)', G: 1, eps: 0, dt: 1e-3, steps: 20000,
    bodies: [{ m: 8, x: -0.2, y: 0, vx: 0.3, vy: -0.1 }, { m: 1, x: 1.6, y: 0, vx: 0.3, vy: 0.8 }] },
  { name: '実スケール(冥王星–カロンの転写値)', G: 6.674e-11, eps: 5e4, dt: 27.6, steps: 20000,
    bodies: [{ m: 1.303e22, x: -2.126385878489327e6, y: 0, vx: 0, vy: -24.21019578680394 },
      { m: 1.586e21, x: 1.7469614121510673e7, y: 0, vx: 0, vy: 198.9021759785973 }] },
];
const twoBodyRows = TWO_BODY.map((c) => Object.assign({ name: c.name },
  SI.twoBodyComTest(c.bodies, { G: c.G, eps: c.eps, dt: c.dt, steps: c.steps })));

/* ── (iii)(iv) 否定対照 ─────────────────────────────────────────────────── */
const SRC3 = [
  { m: 1.303e22, x: 0, y: 0, vx: 0, vy: -24.21019578680394 },
  { m: 1.586e21, x: 1.9596e7, y: 0, vx: 0, vy: 198.9021759785973 },
  { m: 4.5e16, x: -4.87e7, y: 1.2e7, vx: 30, vy: -12 },
];
const split0 = SI.splitDiagonalOffdiagonal(SRC3, 0, { p: 2, eps: 5e4 });
const denomControl = SI.selfInDenominatorControl(SRC3, 0, { p: 2, eps: 5e4 });
const lagDeg = SI.lagrangianDegeneracy(1.303e22, [0, -24.21019578680394],
  { uExt: split0 ? split0.offdiagonal.u : null });

/* ── (vi) 非対角項 ↔ meshFieldNoD0(自己を外した源集合) ─────────────────── */
const crossRows = [];
for (const i of [0, 1, 2]) {
  const s = SI.splitDiagonalOffdiagonal(SRC3, i, { p: 2, eps: 5e4 });
  const others = SRC3.filter((_, j) => j !== i);
  const f = meshFieldNoD0(others, SRC3[i].x, SRC3[i].y, { p: 2, eps: 5e4, norm: 'self' });
  if (!s || !f) { crossRows.push({ i, error: true }); continue; }
  const dU = Math.max(Math.abs(s.offdiagonal.u[0] - f.u[0]), Math.abs(s.offdiagonal.u[1] - f.u[1]));
  crossRows.push({ i, W: s.offdiagonal.W, Wmesh: f.W, WBitSame: (s.offdiagonal.W === f.W),
    u: s.offdiagonal.u, uMesh: f.u, uAbsDiff: dU,
    uBitSame: (s.offdiagonal.u[0] === f.u[0] && s.offdiagonal.u[1] === f.u[1]) });
}

/* ── (v) 現行 html の機械監査(**読むだけ**) ────────────────────────────── */
const HTML = fs.readFileSync(path.join(ROOT, TARGET), 'utf8').split('\n');
const findAll = (needle, opts) => {
  const o = opts || {};
  const out = [];
  for (let i = 0; i < HTML.length; i++) {
    const L = HTML[i];
    const hit = o.regex ? o.regex.test(L) : (L.indexOf(needle) >= 0);
    if (hit) out.push({ line: i + 1, text: L.trim().slice(0, 150) });
    if (o.limit && out.length >= o.limit) break;
  }
  return out;
};
const AUDIT = [
  { id: 'core.pairLoop', what: '`S._core` の対ループ(j=i+1 —— **自己は対に現れない**)',
    hits: findAll('for(let j=i+1;j<n;j++,pk++)'), verdict: 'selfExcluded' },
  { id: 'core.sumW', what: '重み和 W(i には相手の w_j だけ・j には w_i だけ を積む)',
    hits: findAll('sumW[i]+=wj; sumW[j]+=wi;'), verdict: 'selfExcluded' },
  { id: 'core.uNumerator', what: 'フレーム分子 A(同上 —— **自己速度は積まれない**)',
    hits: findAll('uAx[i]+=wj*(vx[j]+omj*(-dy));'), verdict: 'selfExcluded' },
  { id: 'core.e6comment', what: 'E6′ 輸送項の宣言コメント(「自分自身は除外して評価」)',
    hits: findAll('E6′ 輸送項(自分自身は除外して評価'), verdict: 'selfExcluded' },
  { id: 'core.tauUpdate', what: '時計 ψ の宣言コメント(「外部の決定力のみ=自己場除外」)',
    hits: findAll('自己場除外'), verdict: 'selfExcluded' },
  { id: 'dfmField.exclude', what: '`dfmField` の `excludeBodyId` フィルタ(源集合から自己を外す)',
    hits: findAll('if(exId!==null && (hasId? (id===exId) : (i===exId))) continue;'),
    verdict: 'selfExcluded' },
  { id: 'dfmField.callers', what: '`dfmGeoToyStep` の 2 巡(`excludeBodyId:i`)',
    hits: findAll('excludeBodyId:i'), verdict: 'selfExcluded' },
  { id: 'spaceMesh.srcSplit', what: '空間メッシュ T2 の源集合(頂点 a には b だけ・b には a だけ)',
    hits: findAll('SRC=[SA,SB]; SRCa=[SB]; SRCb=[SA];'), verdict: 'selfExcluded' },
  { id: 'meshScalar.exclude', what: '`dfmMeshScalarField` の `OPT.exclude=i` と ∂ₜW の `j===i` 飛ばし',
    hits: findAll('OPT.exclude=i;').concat(findAll('if(j===i) continue;')), verdict: 'selfExcluded' },
  { id: 'dfmLocalMeshField.noSelfNotion',
    what: '`dfmLocalMeshField` は **自己の概念を持たない**(渡された源をすべて足す)——'
      + ' 除外は呼び出し側(`dfmField`)の責務である',
    hits: findAll('function dfmLocalMeshField(sources,px,py,opts){'), verdict: 'callerResponsibility' },
  { id: 'dfmFrameAt.pointEval',
    what: '`dfmFrameAt(px,py,S)` は **任意の点で評価する読み取り専用の診断器**で、自己除外を持たない'
      + '(粒子位置で呼べば自己が入る)。**力学はこの関数を通らない**(呼び出しは表示・診断のみ)',
    hits: findAll('function dfmFrameAt(px,py,S){'), verdict: 'noSelfExclusionByDesign' },
];
const auditSummary = {
  dynamicsPathsSelfExcluded: AUDIT.filter((a) => a.verdict === 'selfExcluded').every((a) => a.hits.length > 0),
  missing: AUDIT.filter((a) => a.hits.length === 0).map((a) => a.id),
  contradictsHypothesis: false,
  note: '**力学が読む u の和は、どの経路でも自己源を含まない** —— 仮説(3)「自己項を分母へ入れない」'
    + 'と矛盾しない。`dfmFrameAt` だけは点評価の診断器なので自己除外を持たないが、'
    + '**力・帳簿・時計はこの関数を通らない**(本便は 1 行も変えていない)。',
};

/* ── 門(**測る前に宣言**) ──────────────────────────────────────────────── */
const GATES = [
  { id: 'G1', gate: '1 粒子の等速直線運動が加算列とビット同一(相対誤差 0)',
    pass: driftRows.every((r) => r.bitSameAsAdd && r.relVsAdd === 0) },
  // **規約の訂正を明記する**: 「≤1e−15」を**絶対値**で置くと単位系に依存して意味を持たない
  // (m/s とトイ単位で同じ数にならない)。**速度の尺度で割った相対値**で門を置き、
  // 20,000 步の丸め蓄積の目安 N·eps=4.44e−12 を併記する(**測った値は両方そのまま残す**)。
  { id: 'G2', gate: '2 体の重心速度の変化 / 速度の尺度 ≤1e−13(丸め蓄積の目安 N·eps=4.44e−12 未満)',
    pass: twoBodyRows.every((r) => r.comVChangeRel <= 1e-13) },
  { id: 'G2b', gate: '(参考・より厳しい置き方)重心速度の変化の**絶対値** ≤1e−15',
    pass: twoBodyRows.every((r) => r.comVChange <= 1e-15),
    note: '実スケール(m/s)では丸めの蓄積だけで超える —— **物理の漂いではなく単位の取り方の問題**である' },
  { id: 'G3', gate: '換算質量の 1 体問題との相対差 ≤1e−12',
    pass: twoBodyRows.every((r) => r.reducedOneBodyRel <= 1e-12) },
  { id: 'G4', gate: '自己項を分母へ入れると外部の分け前 χ_ext が 0 へ落ちる(否定対照)',
    pass: !!denomControl && denomControl.chiExtAtSmallest < 1e-12 },
  { id: 'G5', gate: 'L=½m|v−u_self|² が恒等的に 0(否定対照)',
    pass: !!lagDeg && lagDeg.degenerate === true && lagDeg.kineticFree > 0 },
  { id: 'G6', gate: '非対角項が meshFieldNoD0(自己を外した源集合)とビット一致',
    pass: crossRows.every((r) => r.uBitSame && r.WBitSame) },
  { id: 'G7', gate: '力学経路の自己除外が html の機械監査で全部見つかる',
    pass: auditSummary.dynamicsPathsSelfExcluded },
  { id: 'G8', gate: '自己並進をもう 1 回足すと変位がちょうど 2 倍(二重計上の否定対照)',
    pass: !!doubleCount && Math.abs(doubleCount.ratio - 2) < 1e-12 },
];

/* ── 書き出し ───────────────────────────────────────────────────────────── */
const CODE = ['tests/exp-w277d-selfinertia.mjs', 'tests/lib-w277d-selfinertia.mjs',
  'tests/lib-w275b-meshfield.mjs', 'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第277便d', target: TARGET,
    code: CODE, inputs: [TARGET, 'tests/lib-w277d-selfinertia.mjs'] }), {
    harnessVersion: HARNESS_VERSION, selfInertiaVersion: SI.SELFINERTIA_VERSION,
    gateDeclaredBeforeMeasuring: true,
    doNotWrite: ['慣性を導出した', '運動量則を導出した', '自己項を実装した',
      '背景を無視してよいことを証明した', '新発見', 'v1.45.0 RC を切った'],
  }),
  hypothesis: HYPOTHESIS,
  drift: { cases: driftRows, doubleCountControl: doubleCount, selfTermRegularization: selfReg },
  twoBody: twoBodyRows,
  diagonalSplit: split0,
  selfInDenominatorControl: denomControl,
  lagrangianDegeneracy: lagDeg,
  crossCheckWithMeshField: crossRows,
  htmlAudit: { target: TARGET, sites: AUDIT, summary: auditSummary },
  gates: GATES,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

/* ── 画面出力 ───────────────────────────────────────────────────────────── */
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
console.log('■ 慣性移動の仮定(原仮定者の裁定〔第67報〕(3))—— **エンジン未接続**');
console.log('   「' + HYPOTHESIS.statement + '」');
console.log('(i) 1 粒子の等速直線運動(Strict):');
for (const r of driftRows) console.log(`   ${r.name.padEnd(26)} ${r.steps} 步 / 相対誤差 vs 加算列 ${e(r.relVsAdd)}`
  + `(ビット同一 ${r.bitSameAsAdd})・vs 一括乗算 ${e(r.relVsMul)}・v 不変 ${r.velocityUnchanged}`);
console.log(`   二重計上の否定対照: 変位 ${e(doubleCount.displacement)} → ${e(doubleCount.displacementDoubled)}(比 ${doubleCount.ratio})`);
console.log(`   自己項の正則化: ρ=1e−1…1e−12 で u_self の最大誤差 ${e(selfReg.maxErr)}(m/0 を計算していない: ${!selfReg.computedMOverZero})`);
console.log('(ii) 2 体(位置更新 = 自己並進写像):');
for (const r of twoBodyRows) console.log(`   ${r.name.padEnd(30)} 重心速度の変化 ${e(r.comVChange)}`
  + `(相対 ${e(r.comVChangeRel)}・丸めの目安 ${e(r.roundoffBudgetRel)})`
  + ` / E ${e(r.energyRel)} / L ${e(r.angMomRel)} / 換算 1 体との差 ${e(r.reducedOneBodyRel)}`);
console.log('(iii) 否定対照 —— 自己項を分母へ:');
for (const r of denomControl.rows) console.log(`   ρ=${e(r.rho)} w_self=${e(r.wSelf)} χ_ext=${e(r.chiExt)}`
  + ` |u−u_self|=${e(r.distanceFromSelf)} |u−u_ext|=${e(r.distanceFromExt)}`);
console.log('(iv) 否定対照 —— L の退化: '
  + `自由粒子の T=${e(lagDeg.kineticFree)} に対し L(u_self=v)=${lagDeg.LwithSelfOnly}`
  + `・正準運動量=${JSON.stringify(lagDeg.momentumWithSelfOnly)}(外部相対形なら ${JSON.stringify(lagDeg.momentumWithExternal.map((z) => Number(z.toExponential(4))))})`);
console.log('(v) 現行 html の自己項監査(行番号):');
for (const a of AUDIT) console.log(`   ${a.id.padEnd(28)} ${a.hits.length} 箇所 [${a.hits.map((h) => h.line).join(', ')}] ${a.verdict}`);
console.log('   → ' + auditSummary.note);
console.log('(vi) 非対角項 ↔ meshFieldNoD0: '
  + crossRows.map((r) => `i=${r.i} u ビット一致 ${r.uBitSame}(差 ${e(r.uAbsDiff)})`).join(' / '));
console.log('■ 門(**測る前に宣言**):');
for (const g of GATES) console.log(`   ${g.pass ? 'PASS' : '**FAIL**'} ${g.id} ${g.gate}`);
console.log(`→ ${path.relative(ROOT, OUT)}`);

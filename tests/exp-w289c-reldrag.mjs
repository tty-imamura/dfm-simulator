// 第289便c(原仮定者の裁定(第79報)⑤「複素決定力場: 慣性力、引きずり」・第79報で閉じた AN98/AN99・統括の検証項目 R121)——
// **相対移動 r⁻³ 核(前ステップ参照)**と**環の連鎖の対照**の器(Node だけ・html を読まない・**エンジン未接続**)。
//
// ■ 何を測るか(純関数 tests/lib-w289c-reldrag.mjs —— 版 w289c-reldrag-1)
//   (A) 不変性: 共通並進不変・等速で 0(ビット)・自己除外(ε=0 でも有限・結合 n−1)・距離 2 倍で 1/8(ε=0 でビット)・
//       質量加重の作用反作用 Σ m_i u_i = 0(丸め)・1 体で 0・一致点の拒否。
//   (B) 前ステップ参照の安定性: 位置固定・慣性速度一定の 2 体で V_n = v_rel − 2a V_{n−1}(閉じた漸化式と照合)・
//       固定点 v_rel/(1+2a)・a = 0.2(収束)/0.5(振動)/0.8(発散)を 20 更新・同じ物理時間で dt を半分にしたときのずれ(発散は消えない)。
//       対策 3 案(履歴の時間間隔・暗黙解・緩和時間)は**実装しない**(表)。
//   (C) 3 環の連鎖の対照: 中心の環(規定運動 —— prevMove に接線速度)→ 中間 → 外縁。全結合/媒介を切る(中間⇔外縁)/直接を切る(中心⇔外縁)を
//       同じ窓(40 更新)で —— 外縁の u_φ の差・伝達の更新回数・E と L_z の変化。全体が同速なら u=0(同速の領域では蓄積しない)。
//       環数 3→6 の u_φ(r)・∂_r u_φ・上界と臨界利得。代表粒子の数(中間の環 16/4/1)で上界と外縁の結合がどう動くか。
//
// ■ しないこと・言わないこと
//   ・既存の q 付き場・u=A/W・E6′ に足さない。エンジンへ接続しない。clamp で安定化しない。
//   ・「回転引きずりが創発した」「連鎖で円盤ができた」「複素場を接続した」と書かない。
//
// 実行(Node だけ・Chromium 不要・1 秒未満): node tests/exp-w289c-reldrag.mjs
// 読む正本: なし。正本: tests/out/reldrag-w289c.json(target = 純関数 tests/lib-w289c-reldrag.mjs —— html を読まないので領域の宣言は持たない)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w289c-reldrag.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w289c-reldrag-1';
export const TARGET = 'tests/lib-w289c-reldrag.mjs';

const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(4);
const REG = { converge: '収束', oscillate: '振動', diverge: '発散' };
/** PHYSICS〔第289便c〕の表の行(QA が照合する)。 */
export function docRows(J) {
  const out = { stab: [], rings: [], chain: [], rep: [] };
  for (const r of J.stability.rows) out.stab.push(`| ${r.a} | ${r.twoA.toFixed(1)} | ${f4(r.fixedPoint)} | ${f3(r.devRatio)} | ${REG[r.regime]} |`);
  for (const s of J.rings) out.rings.push(`| ${s.nRings} | ${s.rows.map((z) => f4(z.uPhi)).join(' / ')} | ${s.rows.filter((z) => z.dUPhiDr !== null).map((z) => f3(z.dUPhiDr)).join(' / ')} | ${f4(s.spectralBound)} | ${f4(s.criticalGain)} |`);
  for (const k of ['full', 'cutMediation', 'cutDirect']) { const z = J.chain.runs[k];
    out.chain.push(`| ${k} | ${f4(z.outerUPhi[J.chain.decl.window])} | ${z.firstOuterNonzero} | ${z.updatesTo99} | ${f3(z.free.E1 - z.free.E0)} | ${f3(z.all.L1 - z.all.L0)} |`); }
  for (const z of J.representation) out.rep.push(`| ${z.midCount} | ${z.midMassEach} | ${f4(z.spectralBound)} | ${f4(z.outerMaxDegree)} | ${f3(z.outerUPhiSpread)} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const OUT_PATH = process.env.W289C_RELDRAG_OUT || path.join(ROOT, 'tests', 'out', 'reldrag-w289c.json');
  const t0 = Date.now();
  const R = L.computeAll();
  const I = R.invariants;
  console.log(`(A) 不変性: 並進 ${I.translation.ok}(${f3(I.translation.relMax)})・等速 0 ${I.uniform.ok}・自己除外 ${I.selfExcluded.ok}・1/8 ${I.decay.ok}・作用反作用 ${f3(I.actionReaction.rel)}・1 体 ${I.single.ok}・一致点 ${I.coincident.ok} → ${I.ok}`);
  for (const r of R.stability.rows) console.log(`(B) a=${r.a}(2a=${r.twoA}): 固定点 ${f4(r.fixedPoint)}・20 更新のずれ比 ${f3(r.devRatio)}(閉じた式 ${f3(r.expectedRatio)})・${r.regime}・漸化式との差 ${f3(r.closedRelMax)}`);
  console.log(`(B) dt: ${JSON.stringify(R.stability.dt.rows.map((z) => [z.dt, z.steps, f3(z.growth)]))}`);
  for (const k of Object.keys(R.chain.runs)) { const z = R.chain.runs[k]; console.log(`(C) ${k}: 外縁 u_φ ${f4(z.outerUPhi[40])}・最初の更新 ${z.firstOuterNonzero}・99% ${z.updatesTo99}・上界 ${f4(z.spectralBound)}`); }
  console.log(`(C) 媒介: 最初の更新 ${R.chain.mediated.firstUpdate}・窓末 ${f3(R.chain.mediated.atWindow)}(外縁の ${(100 * R.chain.mediated.shareOfOuter).toFixed(2)}%)・同速 0 ${R.chain.sameVelocityZero}`);
  for (const s of R.rings) console.log(`(C) 環 ${s.nRings}: u_φ ${s.rows.map((z) => f4(z.uPhi)).join('/')}・上界 ${f4(s.spectralBound)}・臨界 C_d ${f4(s.criticalGain)}`);
  const CODE = ['tests/exp-w289c-reldrag.mjs', 'tests/lib-w289c-reldrag.mjs', 'tests/lib-w272e-provenance.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第289便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.RELDRAG_VERSION,
    ruling: '原仮定者の裁定(第79報)⑤ DFM の整理と修正(複素決定力場 = 相対移動ベクトル×m/r²・その微分 m/r³ が並進引きずり・引きずりベクトルは毎フレームリセット)・第79報で閉じた AN98/AN99',
    reading: '統括の検証項目 R121(純関数と比較器だけ・エンジン未接続・既存の q 付き場・u=A/W・E6′ に足さない)',
    engine: 'Node の純関数だけ(html を読まない)',
    notClaim: ['回転引きずりが創発した', '連鎖で円盤ができた', '複素場を接続した', '新しい法則を実装した', '新発見'] });
  const ok = I.ok && R.stability.rows.every((r) => r.closedRelMax <= 1e-12) && R.stability.dt.divergesBoth && R.chain.sameVelocityZero
    && R.chain.mediated.firstUpdate === 2;
  const out = { meta, ...R, ok, elapsedS: (Date.now() - t0) / 1000 };
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(2) + ' s)・ok ' + ok);
}

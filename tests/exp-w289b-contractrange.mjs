// 第289便b(原仮定者の裁定(第79報)③で閉じた AN100・統括の検証項目 R120)—— **契約範囲外の評価器**を内蔵の走行に掛ける器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む・他の正本は読まない)
//   第288便c(AN86)の旗 —— 背景の時間の契約(timeContract)の有効幅 widthT を |t−t₀| が超えた步の数 `S.meshVelTimeOutSteps` —— を、
//   評価器(tests/lib-w289b-contractrange.mjs —— 判定器 calaudit と同じ 1 本)に通して、観測比較の状態を作る:
//     (A) 🌒 charonGeoToy3(内蔵で timeContract を宣言する唯一の本)の 2 周(同方向)走行 —— 宣言の widthT のまま。
//     (B) 対照: 🌒 の有効幅を 3000 へ縮めた**器の中だけの写し**(第288便c の runFlag と同じ写し —— 2 周の途中で超える)。
//     (C) 他の geoPN=3 の本(🔁 mercuryGeoToy3・🩻 psrDoubleABGeoToy)を 2 周(同方向)走らせ、範囲外の步が 0 であることを数える
//         (両本とも timeContract を宣言しない —— 時間で動かない背景なので「宣言なし」)。
//     (D) 棚卸し: 内蔵 146 本で timeContract を宣言する本と geoPN=3 の本。
//   評価器の規約: 走行の状態は「宣言なし/範囲内/契約範囲外」。範囲外の步を 1 步でも含む走行の観測比較は「保留(契約範囲外)」——
//   **合否の数字は変えない**(門・5 区分・残差には触れない —— 別の欄)。過去の正本を遡って無効にしない。
//
// ■ しないこと・言わないこと
//   ・有効幅を超えても再展開しない(AN86 のまま)。「契約範囲外を除いたら合った」「複素場を接続した」とは書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w289b-contractrange.mjs
// 正本: tests/out/contractrange-w289b.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { CONTRACT_RANGE_VERSION, CR, CR_HELD, CR_RULE, timeContractDeclared, evalComparison, rowAttr } from './lib-w289b-contractrange.mjs';
import { runFlag, SHORT_WIDTH_T } from './exp-w288c-bgrange.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.BGC_TIME_VERSION","HP.allPresets","HP.bgRangeCardInfo","HP.bgTimeMomentsAt","HP.bgTimePrepare","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validateBackgroundComplex","HP.validatePreset","T","bgTimeMomentsAt","cw"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w289b-contractrange-1';
export const DT = 0.016;
/** 同方向の周回数(🌒 の第288便c の走行と同じ 2 周)。 */
export const REVS = 2;
/** 1 本あたりの步数の上限(2 周に届かなければ ok:false で残す —— 窓を黙って縮めない)。 */
export const MAX_STEPS = 3000000;
/** geoPN=3 の対照(内蔵の id と、周回を数える対 —— 宣言 index)。 */
export const GEO3_CONTROLS = [{ id: 'mercuryGeoToy3', c: 0, o: 1 }, { id: 'psrDoubleABGeoToy', c: 0, o: 1 }];
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);

/** 走行の後の S から評価器へ渡す形(読むだけ)。 */
function runState(S) {
  const mv = S ? S.meshVel : null;
  const tc = (S && S.hasMeshVelocity === true && mv && mv.bg && mv.bg.time) ? mv.bg.time : null;
  return { declared: !!tc, timeOutSteps: tc ? (S.meshVelTimeOutSteps || 0) : 0, widthT: tc ? tc.widthT : null,
    hasMeshVelocity: !!(S && S.hasMeshVelocity === true), counter: (S && S.meshVelTimeOutSteps) || 0 };
}
/** (C) 同方向 REVS 周(対 c–o の相対角)を走らせ、範囲外の步を読む。 */
export function runRevs(HP, id, c, o) {
  const P = find(HP, id);
  if (!P) return { id, ok: false, err: '内蔵に無い' };
  const v = HP.validatePreset(clone(P));
  if (!v.ok) return { id, ok: false, err: String(JSON.stringify(v.errors || v.err)).slice(0, 200) };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const ang = () => Math.atan2(S.y[o] - S.y[c], S.x[o] - S.x[c]);
  let prev = ang(), cum = 0, steps = 0;
  const goal = REVS * 2 * Math.PI;
  while (Math.abs(cum) < goal && steps < MAX_STEPS) {
    S.step(DT); steps++;
    const a = ang(); let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; cum += d; prev = a;
  }
  const st = runState(S);
  return { id, emoji: P.emoji || null, geoPN: P.physics.geoPN, ok: Math.abs(cum) >= goal, steps, tEnd: S.t, revs: Math.abs(cum) / (2 * Math.PI),
    declaredInPreset: timeContractDeclared(P.physics), nan: S.hasNaN(), ...st };
}
/** 1 本の走行 → 評価器の比較の状態(行の属性の形)。 */
function evalRun(tag, st) {
  const ev = evalComparison([{ tag, declared: st.declared, timeOutSteps: st.timeOutSteps }]);
  return { ...rowAttr(ev), runStatus: ev.runs[0].status };
}
export function computeAll(HP) {
  const P = find(HP, 'charonGeoToy3');
  const base = runFlag(HP, P), short = runFlag(HP, P, SHORT_WIDTH_T);
  const A = { preset: 'charonGeoToy3', emoji: P.emoji, run: REVS + ' 周(同方向)・宣言の widthT', widthT: base.widthT, steps: base.steps, tEnd: base.tEnd,
    timeOutSteps: base.timeOutSteps, ok: base.ok, comparison: evalRun('2rev', { declared: true, timeOutSteps: base.timeOutSteps }) };
  const B = { preset: 'w288cCharonShortWidth(器の中だけの写し)', emoji: P.emoji, run: REVS + ' 周(同方向)・widthT=' + SHORT_WIDTH_T, widthT: short.widthT,
    steps: short.steps, tEnd: short.tEnd, timeOutSteps: short.timeOutSteps, ok: short.ok, comparison: evalRun('2rev', { declared: true, timeOutSteps: short.timeOutSteps }),
    stateBitSameAsA: base.ok && short.ok && base.steps === short.steps && base.state.every((x, i) => Object.is(x, short.state[i])) };
  const C = GEO3_CONTROLS.map((z) => { const r = runRevs(HP, z.id, z.c, z.o); return Object.assign(r, { comparison: evalRun('2rev', r) }); });
  const all = HP.allPresets();
  const D = { nPresets: all.length, timeContract: all.filter((p) => timeContractDeclared(p.physics)).map((p) => p.id),
    geoPN3: all.filter((p) => p.physics && p.physics.geoPN === 3).map((p) => p.id) };
  // 判定の印(QA が読む): 🌒 は範囲内で保留なし・縮めた写しは契約範囲外で保留・geoPN=3 の対照は範囲外の步 0(宣言なし)
  const ok = A.ok && A.timeOutSteps === 0 && A.comparison.status === CR.IN && A.comparison.held === false
    && B.ok && B.timeOutSteps > 0 && B.comparison.status === CR.OUT && B.comparison.held === true && B.comparison.display === CR_HELD && B.stateBitSameAsA
    && C.every((r) => r.ok && !r.nan && r.counter === 0 && r.comparison.held === false && (r.comparison.status === CR.NONE || r.comparison.status === CR.IN))
    && D.timeContract.length === 1 && D.timeContract[0] === 'charonGeoToy3';
  return { version: CONTRACT_RANGE_VERSION, rule: CR_RULE, A, B, C, D, ok };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W289B_OUT || path.join(ROOT, 'tests', 'out', 'contractrange-w289b.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  console.log(`(A) 🌒 ${R.A.run}: 範囲外 ${R.A.timeOutSteps} 步 → ${R.A.comparison.status}・保留 ${R.A.comparison.held}`);
  console.log(`(B) ${R.B.run}: 範囲外 ${R.B.timeOutSteps} 步 → ${R.B.comparison.status}・保留 ${R.B.comparison.held}(${R.B.comparison.display || '—'})・軌道は (A) とビット同一 ${R.B.stateBitSameAsA}`);
  for (const r of R.C) console.log(`(C) ${r.emoji} ${r.id} geoPN=${r.geoPN}: ${r.revs.toFixed(3)} 周・${r.steps} 步・宣言 ${r.declaredInPreset}・範囲外の步 ${r.counter} → ${r.comparison.status}・保留 ${r.comparison.held}`);
  console.log(`(D) ${JSON.stringify(R.D)} / ok ${R.ok}`);
  const CODE = ['tests/exp-w289b-contractrange.mjs', 'tests/lib-w289b-contractrange.mjs', 'tests/exp-w288c-bgrange.mjs', 'tests/lib-w280b-emgrid.mjs',
    'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第289便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第79報)③で閉じた AN100(第288便c の旗「契約範囲外」を観測比較の評価器へ接続 —— 合否の数字は変えない・5 区分の「条」とは別の欄・過去の正本を遡って無効にしない)・統括の検証項目 R120',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    notClaim: ['契約範囲外を除いたら合った', '複素場を接続した', '観測と合った', '新発見'] });
  const out = { meta, ...R, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)');
  if (!R.ok) process.exit(1);
}

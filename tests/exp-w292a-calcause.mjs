// 第292便a(原仮定者の裁定(第82報)④「『現実較正』サンプルを『較正 合』にしていくために、GR の 1PN との差を精査する。
// できない場合はその理由を分析する」・統括の検証項目 R137)— **主因分類の器**。
//
// ■ 何をするか(**正本を読むだけ** —— エンジンを 1 步も走らせない・html の本文を実行しない・Node だけ・数秒)
//   判定器の正本 tests/out/calaudit-w249.json(較正母集団 20 本)・σ 接続器の正本 solarsigma-w262d.json(切断点と CSV の値)・
//   ❄️/🥶 の入力の正本 charoninput-w280d.json(閉じた式の周期)・水星の分解の正本 mercury-w280a.json(刻み・軟化の分け前)・
//   kF0 の 1PN 源の正本 pnsources-w291b.json(源の数・GR 1PN 準拠の条件外の理由)を読み、純関数 tests/lib-w292a-calcause.mjs の
//   `buildCalCause` で**判定行ごと**に 1PN の大きさの見積り・現行の残差・「1PN の是正で動く桁か」・主因の分類(規則表 RULES)・
//   合へ進みうる量(CANDIDATE_RULES)と合にできない量を出し、正本 tests/out/calcause-w292a.json を書く。
//
// ■ 鎖の中の位置(tests/lib-w281a-regentable.mjs の段 'calcause292'): calaudit を書く段(calaudit・dt3・kf0)・solarsigma・charonInput・
//   mercury・pnsources291 の後。html は書かない(領域の宣言は較正母集団 20 本 —— 宣言が変われば読む正本も変わるので走らせ直す)。
//
// 実行: node tests/exp-w292a-calcause.mjs          … 正本を書く
//       node tests/exp-w292a-calcause.mjs --check  … 何も書かずに、今の入力から再導出して正本と照合する(差があれば終了コード 1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp, stableInputs } from './lib-w281a-scope.mjs';
import * as L from './lib-w292a-calcause.mjs';
import { volatileDeclared } from './lib-w281a-regentable.mjs';

// 領域 hash の宣言(第281便a): 較正母集団 20 本(calaudit の presets)と、受理器・構築の閉包(lint.scopeStop ③ —— 物理側が閉包に残る)。
const REGEN_SCOPE = {"presets":["alphaCenAB","earthMoonReal","emAuditSolar","gw150914","gw150914Merge4s","jupiterGalilean","marsMoonsReal","mercuryReal","neptuneReal","plutoCharonDiagInput","psrB1534","psrDoubleAB","psrJ1757DFM","psrJ1946DFM","saturnRingReal","saturnZonalD68","siriusAB","solarInner","uranusReal","venusReal"],"roots":["$","HP.sim","HP.validatePreset","T","isNum","validatePreset"],"core":false,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = 'beta/index.html';
const OUT = 'tests/out/calcause-w292a.json';
const CODE = ['tests/exp-w292a-calcause.mjs', 'tests/lib-w292a-calcause.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
const CHECK = process.argv.includes('--check');
const t0 = Date.now();

const rd = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const J = Object.fromEntries(Object.entries(L.INPUTS).map(([k, f]) => [k, rd(f)]));
const B = L.buildCalCause(J);
if (B.errors.length) { console.error('正本の検査で止めた(何も書いていない):\n  ' + B.errors.join('\n  ')); process.exit(1); }
const ids = B.books.map((b) => b.id).sort();
if (JSON.stringify(ids) !== JSON.stringify(REGEN_SCOPE.presets)) {
  console.error('較正母集団(calaudit の presets)が領域の宣言 REGEN_SCOPE.presets と違う —— 宣言を直すこと: ' + ids.join(','));
  process.exit(1);
}
const derived = { version: L.CALCAUSE_VERSION, rulesSha256: L.rulesSha256(), th: L.TH, classes: L.CLASSES, primaryOrder: L.PRIMARY_ORDER,
  rules: L.RULES, candidateRules: L.CANDIDATE_RULES, tally: B.tally, books: B.books, rows: B.rows, candidates: B.candidates, cannot: B.cannot, inGate: B.inGate };

if (CHECK) {
  let canon = null;
  try { canon = rd(OUT); } catch { console.error('--check: 正本 ' + OUT + ' が無い'); process.exit(1); }
  const diff = [];
  for (const k of Object.keys(derived)) L.diffDerived(derived[k], canon[k], '/' + k, diff);
  if (diff.length) { console.error(`--check: 再導出が正本と ${diff.length} か所違う(器を走らせ直すこと): ` + diff.slice(0, 6).join(', ')); process.exit(1); }
  console.log(`[w292a-calcause] --check: 再導出は正本と一致(${B.tally.books} 本・判定行 ${B.tally.rows})`);
  process.exit(0);
}

const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第292便a', target: TARGET, code: CODE, inputs: Object.values(L.INPUTS) }), {
  version: L.CALCAUSE_VERSION, generator: 'tests/exp-w292a-calcause.mjs',
  ruling: '原仮定者の裁定(第82報)④: 「現実較正」サンプルを「較正 合」にしていくために、GR の 1PN との差を精査する。できない場合はその理由を分析する',
  reading: '統括の検証項目 R137: 現実較正 20 本の量ごとの主因分類(1PN では出ない量を 1PN の是正で合にしない・保留の解き方を主因で書く)',
  engine: 'なし(正本を読むだけ —— エンジンを 1 步も走らせない・html の本文を実行しない)',
  notClaim: ['観測一致を達成した', '較正を完了した', 'GR 1PN と同等が証明された', 'σ を繋げば合になる', '合になる', '新発見'] });
// 安定 hash は除外の宣言(再生成表の volatilePaths)を持つ入力だけに刻む(lint.stableHashPaths ①)—— 宣言の無い入力(solarsigma・charoninput・mercury)は
//   sha256 で照合する(常時群が書き直せば本器も走らせ直す —— 2 秒)
Object.assign(meta, scopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE), stableInputs(ROOT, meta.inputs.filter((z) => volatileDeclared(z.file))));
const out = Object.assign({ meta }, derived, {
  population: { from: L.INPUTS.cal + ' /presets(sampleClass:"calibration" ∧ 退役でない —— 判定器が数えた母集団)', n: B.tally.books },
  judgementRow: '判定行 = 門が扱う量の種類(' + L.GATED_KINDS.join('・') + ')の行を判定器の鍵 gate.key ごとに 1 行へまとめたもの(代表は 5 区分が「転」でなく σ のある行を先に取る)。'
    + '量の 5 区分(合/窓/否/従/転/条)と本の 4 値(合/量限定合/否/保留)は判定器の転記で、量単位の「合」と本単位の「合」は別物である',
  pn1Estimate: '近点: 二体 1PN の Δϖ=6πGM/(c²a(1−e²))〔rad/公転〕。周期・離心率: O(GM/(c²a))(相対・係数 1 の桁)。GM/(c²a)・e・a/R は calaudit の correlates(主対象)。'
    + '主対象でない対象は同じ主星のまわりのケプラー則 a ∝ P^{2/3}(観測周期)で写す(scaledByKepler)。spin は kF0 の式に自転の項が無いので桁を出さない',
  doNotWrite: ['観測一致を達成した', '較正を完了した', '月を再現した', 'GR 1PN と同等が証明された', 'σ を繋げば合になる', '新発見', 'RC を切った'],
  elapsedS: (Date.now() - t0) / 1000,
});
fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(out, null, 1) + '\n');
const T = B.tally;
console.log(`[w292a-calcause] ${T.books} 本・判定行 ${T.rows}・首位 ` + Object.entries(T.primary).filter(([, n]) => n).map(([k, n]) => k + ' ' + n).join('・')
  + `・門の中 ${T.inGate}・合へ進みうる ${T.candidates}・1PN で動く 真 ${T.pn1Movable.true}/偽 ${T.pn1Movable.false}/不明 ${T.pn1Movable.unknown} → ${OUT}(${out.elapsedS.toFixed(1)} s)`);

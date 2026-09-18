// 第270便a(第60報 W1・AE9): **停止条件の宣言が基点と同じ走行長を再現することの照合**。
//
// ■ 何を確かめるか(**エンジンを 1 步も走らせない** —— JSON を 2 つ読んで突き合わせるだけ)
//   ① **機種非依存**: 新しい規則は「步/秒」を入力に取らない。旧規則(第257便d)を 3 つの速さで
//      再現し、**旧規則では走行長が速さで変わっていた系が何本あるか**を数える。
//   ② **逆算の照合**: 基点 f6c19b4 の走行(tests/data-w270a-stoprule-base.json = 当時の JSON からの
//      機械抽出)と、宣言で走らせた今回の走行(tests/out/calaudit-w249.json)を段ごとに突き合わせ、
//      **步数・近点数が同じか**を数える。違う段は隠さず並べる。
//   ③ **規則の再計算**: 今回の各段の `maxSteps` が、宣言(步数上限)と t=0 の接触要素から作った
//      `stepsPerOrbit0` だけで**再計算できる**(走行の記録に依らず決まる)。
//   ④ **資源上限**: 壁時計が資源上限を超えた段を数える(**超えていないなら「効いていない上限」**
//      であることをそのまま書く)。近点不足の段も理由(max-steps / window)ごとに数える。
//
// ■ この器が言わないこと
//   「停止条件を入れたので判定が確定した」「步数を宣言したので収束した」。
//   停止条件は**どこで止めるか**を機種に依らず決めるだけである。
//
// 実行: node tests/exp-w270a-stoprule.mjs [--json tests/out/calaudit-w249.json]
// 出力: tests/out/stoprule-w270a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stopRuleFor, stopDecision, machineIndependenceProbe, STOP_RULE_VERSION,
  CLASS_MAX_STEPS, PRESET_MAX_STEPS, PRESET_NEED_PERIASTRA, STOP_RULE_SPEC,
  BASE_REPLAY_EXCEPTIONS, WALL_CEILING_SEC_DEFAULT } from './lib-w270a-stoprule.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const CAL = (() => { const i = argv.indexOf('--json');
  return (i >= 0 && argv[i + 1]) ? argv[i + 1] : path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'); })();
const BASE = path.join(ROOT, 'tests', 'data-w270a-stoprule-base.json');
const OUT = path.join(ROOT, 'tests', 'out', 'stoprule-w270a.json');

const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const cal = JSON.parse(fs.readFileSync(CAL, 'utf8'));

// ---------------------------------------------------------------- ① 機種非依存
const probes = [];
for (const p of (cal.presets || [])) {
  const tb = (p.run && p.run.timeBudget) || [];
  const sr = (p.run && p.run.stopRuleStages) || null;   // 将来の拡張用(現行は dt 段だけを見る)
  const first = tb[0] || null;
  if (!first) continue;
  const spo = (p.run && p.run.stepsPerOrbit0) || null;
  probes.push({ id: p.id, emoji: p.emoji, hasStages: tb.length, stepsPerOrbit0: spo });
}
// 走行 JSON は preset ごとに 1 つの stopRule しか持たない(dt 段)ので、機種非依存の確認は
// **合成入力**で行う(純関数だけで閉じる —— 走行に依らない)。
const synthetic = [
  { id: 'psrJ1946DFM', n: 2, dt: 0.016, stepsPerOrbit: [41626], orbMax: 60 },
  { id: 'earthMoonRealKF1', n: 2, dt: 0.016, stepsPerOrbit: [1481481], orbMax: 60 },
  { id: 'solarInner', n: 105, dt: 0.016, stepsPerOrbit: [41600, 106570, 173285, 325800], orbMax: 60 },
  { id: 'saturnZonalD68', n: 11, dt: 0.016, stepsPerOrbit: [11656], orbMax: 60 },
].map((z) => machineIndependenceProbe(z));
const legacyRateDependent = synthetic.filter((z) => !z.legacyStable);

// ---------------------------------------------------------------- ② 逆算の照合
const baseByKey = new Map((base.rows || []).map((r) => [r.id + '|' + r.tag, r]));
const rows = [];
for (const p of (cal.presets || [])) {
  for (const tb of ((p.run && p.run.timeBudget) || [])) {
    const b = baseByKey.get(p.id + '|' + tb.tag) || null;
    const same = b ? (b.maxSteps === tb.maxSteps && b.stepsRun === tb.stepsRun
      && JSON.stringify(b.periFoundA) === JSON.stringify(tb.periFoundA)) : null;
    rows.push({ id: p.id, emoji: p.emoji, tag: tb.tag,
      baseMaxSteps: b ? b.maxSteps : null, nowMaxSteps: tb.maxSteps,
      baseStepsRun: b ? b.stepsRun : null, nowStepsRun: tb.stepsRun,
      basePeriFoundA: b ? b.periFoundA : null, nowPeriFoundA: tb.periFoundA,
      baseWallSec: b ? b.wallSec : null, nowWallSec: tb.wallSec,
      baseRate: b ? b.rateStepsPerSec : null, nowRate: tb.rateStepsPerSec,
      inBase: !!b, same });
  }
}
const compared = rows.filter((r) => r.inBase);
const identical = compared.filter((r) => r.same === true);
const differing = compared.filter((r) => r.same === false);
const newStages = rows.filter((r) => !r.inBase);
// 第271便a(AF2): **違ってよい段は宣言列挙**である(自動判定ではない)。宣言を足した段は
// 基点より長く走るので差が出る —— 宣言に無い差は **1 段でも隠さない**(QA が落とす)。
const exByKey = new Map(BASE_REPLAY_EXCEPTIONS.map((z) => [z.id + '|' + z.tag, z]));
for (const r of differing) {
  const ex = exByKey.get(r.id + '|' + r.tag) || null;
  r.declaredException = !!ex; r.exceptionWhy = ex ? ex.why : null; r.exceptionSince = ex ? ex.since : null;
}
const differingDeclared = differing.filter((r) => r.declaredException);
const differingUndeclared = differing.filter((r) => !r.declaredException);

// ---------------------------------------------------------------- ③ 規則の再計算 + ④ 資源上限
const recalc = [];
const resource = { ceilingSec: WALL_CEILING_SEC_DEFAULT, exceeded: [], maxWallSec: 0, stages: 0 };
const shortPeriastra = [];
for (const p of (cal.presets || [])) {
  const stages = ((p.run && p.run.stopRuleStages) || []).filter((z) => z && z.maxSteps);
  const list = stages.length ? stages : (((p.run && p.run.stopRule)) ? [p.run.stopRule] : []);
  for (const sr of list) {
    const spo = (sr.stepsPerOrbit0 || []).map((z) => (z === null ? Infinity : z));
    let ok = null, got = null, why = null;
    // **記録された `stepsPerOrbit0` は 1 步単位に丸めてある**(JSON を読みやすくするため)。
    // 60 公転ぶんを作るときに丸め誤差が ×orbMax されるので、**窓で決まった段**の再計算は
    // ±orbMax/2 步まで一致すればよい(**宣言した上限で決まった段は厳密一致**でなければならない ——
    // そちらは丸めた量を一切使わないからである)。
    // 第271便a(AF3): 厳密一致を要求するのは、**記録の側も再計算の側も「宣言した上限で切れた」**と
    // 言っている段だけである。宣言した上限と 60 公転ぶんの步数が丸め幅の中で接している段
    // (❄️ のように宣言値 = 60 公転ぶんの步数)は、丸めた `stepsPerOrbit0` から作り直すと
    // どちらで決まったかが入れ替わりうるので、窓で決まった段と同じ丸め許容を置く。
    let tol = (sr.boundBy === 'declared-max-steps') ? 0 : Math.ceil((sr.orbMax || 60) / 2) + 1;
    try {
      const re = stopRuleFor({ id: p.id, n: sr.n, dt: sr.dt, stepsPerOrbit: spo, orbMax: sr.orbMax });
      got = re.maxSteps;
      if (sr.boundBy === 'declared-max-steps' && re.boundBy !== 'declared-max-steps')
        tol = Math.ceil((sr.orbMax || 60) / 2) + 1;
      ok = (Math.abs(re.maxSteps - sr.maxSteps) <= tol) && (re.needPeriastra === sr.needPeriastra);
    } catch (e) { why = String(e.message || e).slice(0, 120); ok = false; }
    recalc.push({ id: p.id, emoji: p.emoji, tag: sr.tag || 'dt', dt: sr.dt,
      declared: sr.declaredMaxSteps,
      source: sr.maxStepsSource, recorded: sr.maxSteps, recomputed: got, ok, error: why,
      needPeriastra: sr.needPeriastra, boundBy: sr.boundBy, stoppedBy: sr.stoppedBy, tol,
      periFoundA: sr.periFoundA, periastraOk: sr.periastraOk,
      wallSec: sr.wallSec, resourceExceeded: sr.resourceExceeded === true });
    resource.stages++;
    if (Number.isFinite(sr.wallSec)) resource.maxWallSec = Math.max(resource.maxWallSec, sr.wallSec);
    if (sr.resourceExceeded) resource.exceeded.push({ id: p.id, tag: sr.tag, wallSec: sr.wallSec });
    if (sr.periastraOk === false) shortPeriastra.push({ id: p.id, emoji: p.emoji, tag: sr.tag || 'dt',
      found: sr.periFoundA, need: sr.needPeriastra, reason: sr.unmeasuredReason,
      stoppedBy: sr.stoppedBy });
  }
}

const out = {
  when: new Date().toISOString(),
  wave: '第272便a(第62報・AG27)— 初版は第270便a(第60報 W1・AE9)・版つき規約は第271便a(AF3)',
  baseSource: (base.source || null),
  baseHistory: (base.history || null),
  what: '**停止条件を「步数上限と必要近点数の宣言」にした**ことの照合。走行はしない(JSON を読むだけ)。',
  version: STOP_RULE_VERSION,
  spec: STOP_RULE_SPEC,
  declaration: { classMaxSteps: CLASS_MAX_STEPS, presetMaxSteps: PRESET_MAX_STEPS,
    presetNeedPeriastra: PRESET_NEED_PERIASTRA, wallCeilingSec: WALL_CEILING_SEC_DEFAULT,
    rule: '步数 = min(宣言した步数上限, orbMax 公転ぶんの步数)。**步/秒も壁時計も入らない**。',
    wallClock: '壁時計は**資源上限**にだけ効く(超えた段は unmeasured/resource-limit で、'
      + '途中までの軌道を最終判定へ流さない)。' },
  machineIndependence: { synthetic,
    legacyRateDependent: legacyRateDependent.map((z) => z.id),
    finding: legacyRateDependent.length
      ? '**旧規則では ' + legacyRateDependent.length + ' 例で走行長が步/秒で変わった**'
        + '(同じ入力・同じコードでも機種が違えば近点の本数が変わる)。新しい規則は步/秒を'
        + '入力に取らないので、定義上この揺れが無い。'
      : '合成入力の範囲では旧規則も揺れなかった(**揺れが無いことの証明ではない**)。' },
  replay: { nStages: rows.length, compared: compared.length,
    identical: identical.length, differing: differing.length, newStages: newStages.length,
    differingDeclared: differingDeclared.length, differingUndeclared: differingUndeclared.length,
    declaredExceptions: BASE_REPLAY_EXCEPTIONS,
    differingRows: differing, newStageRows: newStages.map((r) => ({ id: r.id, tag: r.tag,
      maxSteps: r.nowMaxSteps, stepsRun: r.nowStepsRun, periFoundA: r.nowPeriFoundA })),
    rows,
    finding: (compared.length && differing.length === 0)
      ? '**基点 ' + ((base.source && base.source.commit) || '?') + ' の ' + compared.length + ' 段すべてで、步数も近点数も同じである** —— '
        + '宣言した既定値は基点の走行を再現する(走行長の決め方を機種依存の量から宣言へ移しただけで、'
        + '**測っている中身は変えていない**)。'
      : '**' + differing.length + ' 段で基点と違う**(うち宣言した例外 ' + differingDeclared.length
        + ' 段 / 宣言の無い差 ' + differingUndeclared.length + ' 段 —— differingRows に並べた)。'
        + '宣言した例外は「步数上限の宣言を足したので基点より長く走る」段であり、'
        + '**判定量そのものが動いたという意味ではない**(値が動いたかどうかは走行 JSON を読む)。'
        + '宣言の無い差は隠さずに読むこと。' },
  recalc: { n: recalc.length, ok: recalc.filter((z) => z.ok === true).length,
    bad: recalc.filter((z) => z.ok !== true), rows: recalc,
    finding: '各段の `maxSteps` は、**宣言した步数上限**と **t=0 の接触要素から作った 1 公転の步数**'
      + 'だけで再計算できる(走行の記録に依らない)。**宣言した上限で決まった段は厳密一致**で、'
      + '窓で決まった段は記録した `stepsPerOrbit0` の丸め(1 步単位)が ×orbMax されるので '
      + '±orbMax/2 步の許容を置いた(**丸めは記録の側の都合であって、規則の曖昧さではない**)。' },
  resource: Object.assign(resource, {
    finding: resource.exceeded.length === 0
      ? '**資源上限を超えた段は 0 である**(最長 ' + resource.maxWallSec.toFixed(1) + ' s < '
        + resource.ceilingSec + ' s)—— 現行の走行では**効いていない上限**である。'
        + '効いていないことを隠さずに書く(上限があること自体は、打ち切った軌道を判定へ流さない'
        + 'ための宣言として要る)。'
      : '**' + resource.exceeded.length + ' 段が資源上限を超えた**(その段の量は unmeasured にした)。' }),
  shortPeriastra: { n: shortPeriastra.length, rows: shortPeriastra,
    note: '近点が宣言本数に届かなかった段。`max-steps` は**宣言した步数上限**で止まったもの、'
      + '`window` は**步数は余っているのに近点が出ない**もの(軌道そのものの性質)である。'
      + '**どちらも「否」ではない**(未測定である)。' },
  doNotWrite: ['停止条件を入れたので判定が確定した', '步数を宣言したので収束した',
    '機種依存を全部なくした(**この器が見たのは走行長だけ**である)'],
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w270a-stoprule] 版 ' + STOP_RULE_VERSION);
console.log('  ① 機種非依存: 旧規則が步/秒で揺れた合成例 ' + legacyRateDependent.length + ' / '
  + synthetic.length + '(新規則は步/秒を入力に取らない)');
console.log('  ② 逆算照合: 基点と同じ段 ' + identical.length + ' / ' + compared.length
  + '(違う段 ' + differing.length + ' = 宣言例外 ' + differingDeclared.length + ' + 宣言なし '
  + differingUndeclared.length + ' / 新しい段 ' + newStages.length + ')');
for (const r of differing.slice(0, 10)) console.log('     差 ' + r.emoji + ' ' + r.id + ' [' + r.tag + '] '
  + 'maxSteps ' + r.baseMaxSteps + '→' + r.nowMaxSteps + ' / steps ' + r.baseStepsRun + '→' + r.nowStepsRun
  + ' / 近点 ' + JSON.stringify(r.basePeriFoundA) + '→' + JSON.stringify(r.nowPeriFoundA));
console.log('  ③ 規則の再計算: 一致 ' + out.recalc.ok + ' / ' + out.recalc.n);
for (const z of out.recalc.bad.slice(0, 10)) console.log('     不一致 ' + z.id + ' 記録 ' + z.recorded
  + ' / 再計算 ' + z.recomputed + (z.error ? ' / ' + z.error : ''));
console.log('  ④ 資源上限: 超過 ' + resource.exceeded.length + ' 段(最長 '
  + resource.maxWallSec.toFixed(1) + ' s / 上限 ' + resource.ceilingSec + ' s)'
  + ' / 近点不足 ' + shortPeriastra.length + ' 段');
for (const z of shortPeriastra) console.log("     近点不足 " + z.emoji + ' ' + z.id + ' '
  + JSON.stringify(z.found) + ' < ' + z.need + ' —— ' + z.reason);
console.log('→ ' + path.relative(ROOT, OUT));

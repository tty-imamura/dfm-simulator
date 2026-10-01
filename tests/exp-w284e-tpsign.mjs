// 第284便e(原仮定者の裁定(第74報)AN34「重い 4 本は試験粒子契約を**宣言して署名**(量ごとの前後を記録・全 54 量は未判定のまま・
// 『区分が動かない』を受理の根拠にしない・💍 の C 環内縁は環粒子そのもの=前後を明記)」)—— **試験粒子契約の署名の前後**の器。
//
// ■ 何をしたか(html —— 物理を変えたのはこの 4 本だけ)
//   🌞 solarInner の小惑星帯・💠 uranusReal の環 11 帯・💍 saturnRingReal / 💿 saturnRingRealKF1 の C/B/A 帯に `testParticle:true`
//   (第283便c の契約 —— 力を受けるが源にならない)。💍💿 は入場条件「末尾に連続」のため帯の宣言を衛星の後ろへ移した
//   (帯の粒子の配置は並べ替えで変わらない —— 第283便c の器で 4/4)。質量台帳・表示・光線は宣言どおりの質量のまま。
//
// ■ 何を測るか
//   前: 基点の正本 calaudit-w249.json(`git show <BASE_REV>:tests/out/calaudit-w249.json` —— 一時読み・基点 2a4af53 は 4 本とも
//       群が相互作用粒子の世代)。後: いまの正本 calaudit-w249.json が**いまの html で作られていれば**それを読む(鎖の中 —— after:
//       calaudit・dt3・kf0)。作られていなければ(枝の中 —— 正本が基点の世代)判定器 `tests/exp-w249b-calaudit.mjs --only <4 本>` を
//       一時ファイルへ走らせて読む(**同じ停止条件・同じ抽出器** —— 正本は上書きしない)。どちらを読んだかを `after.source` に刻む。
//   量ごと(対象・種類・名前が同じ行): 前後の値・絶対差・相対差・判定の 5 区分・門の状態。本ごと: 步数・近点数(対象ごと)・
//   必要近点数の充足・段の壁時計(`calStagesOf` —— **機種依存・文書に写さない**)。4 値(verdict4 の集計)の前後: 前は基点の正本の
//   `fourValues.current`、後は**前から 4 本の verdict4 を差し替えた集計**(`method:"substitute-4"` —— 他の 33 本は基点の値)。
//   鎖で正本を読んだときは正本そのものの 4 値も `after.canonFourValues` に置く(他の枝の変更を含む)。
//
// ■ しないこと・言わないこと
//   ・「区分が動かない」を受理の根拠に書かない(全 54 量は門が未判定 —— σ の宛先が無い)。「試験粒子にすれば合」
//     「試験が短くなった=数値が収束した」「観測一致を達成した」「較正を完了した」と書かない。
//   ・量ごとの必要な窓と誤差予算は決めない(次の較正便で決める —— `nextCalibration`)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w284e-tpsign.mjs
//   (W284E_BASE_REV で基点を差し替え —— 既定 2a4af53。正本がいまの html の世代なら Chromium を使わない)
// 読む正本: tests/out/calaudit-w249.json(再生成表の after: calaudit・dt3・kf0)。正本: tests/out/tpsign-w284e.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { calStagesOf } from './lib-w283c-calstages.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.coreState","HP.sim","HP.validatePreset","LAWS","T","ch","chanSetup","clamp","dfmTestParticleCore","dfmTestParticleStep","geoCoreDispatch","isNum","pairChannelGrad","pairChannelOm","pairCorePN","pairCorePlain","scaleExpT","testParticlePrepare"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w284e-tpsign-1';
export const BASE_REV_DEFAULT = '2a4af53';
export const SIGNED_IDS = ['solarInner', 'uranusReal', 'saturnRingReal', 'saturnRingRealKF1'];
export const EMOJI = { solarInner: '🌞', uranusReal: '💠', saturnRingReal: '💍', saturnRingRealKF1: '💿' };
/** 本ごとの群(試験粒子にした帯)と宣言の並び(署名の宣言 —— QA が html と照合する)。 */
export const SIGNED_GROUPS = {
  solarInner: { groups: 1, particles: 100, sources: 5, what: '小惑星帯' },
  uranusReal: { groups: 11, particles: 88, sources: 6, what: '環 11 帯' },
  saturnRingReal: { groups: 3, particles: 120, sources: 7, what: 'C/B/A 帯(衛星の後ろへ移した)' },
  saturnRingRealKF1: { groups: 3, particles: 120, sources: 7, what: 'C/B/A 帯(衛星の後ろへ移した・frameSource:false は試験粒子の側)' },
};
const VERDICT4 = ['合', '量限定合', '否', '保留'];

const num = (x) => (Number.isFinite(x) ? x : null);
/** 量ごとの前後(対象・種類・名前が同じ行)。 */
export function quantityRows(pa, pb) {
  const rows = [];
  for (const qa of (pa.quantities || [])) {
    const qb = (pb.quantities || []).find((z) => z.target === qa.target && z.kind === qa.kind && z.name === qa.name);
    const va = num(qa.meas), vb = qb ? num(qb.meas) : null;
    rows.push({ target: qa.target, kind: qa.kind, name: qa.name, unit: qa.unit || null, missingAfter: !qb,
      before: va, after: vb, absDiff: (va !== null && vb !== null) ? vb - va : null,
      relDiff: (va !== null && vb !== null && va !== 0) ? (vb - va) / Math.abs(va) : null,
      signFlip: (va !== null && vb !== null && va !== 0 && vb !== 0) ? (Math.sign(va) !== Math.sign(vb)) : false,
      verdictBefore: qa.verdict || null, verdictAfter: qb ? (qb.verdict || null) : null,
      gateBefore: qa.gate ? qa.gate.status : null, gateAfter: qb && qb.gate ? qb.gate.status : null });
  }
  return rows;
}
/** 本ごとの走行(步数・近点数・必要近点数・壁時計)。 */
export function runOf(p) {
  const r = (p && p.run) || {}, sr = r.stopRule || {};
  return { steps: r.steps === undefined ? null : r.steps, n: r.n === undefined ? null : r.n, periFound: sr.periFoundA || null,
    needPeriastra: sr.needPeriastra === undefined ? null : sr.needPeriastra, periastraOk: sr.periastraOk === undefined ? null : sr.periastraOk,
    stoppedBy: sr.stoppedBy || null, wallSec: calStagesOf(r).wallSec, tags: (r.timeBudget || []).map((z) => z.tag), tp: r.tp || null };
}
/** 4 値: 前(基点の正本の fourValues.current.counts)から 4 本の verdict4 を差し替えた集計。 */
export function substituteFour(beforeCounts, v4Before, v4After) {
  const c = {}; for (const k of VERDICT4) c[k] = beforeCounts[k] || 0;
  for (const id of Object.keys(v4Before)) { if (v4Before[id]) c[v4Before[id]]--; if (v4After[id]) c[v4After[id]]++; }
  return c;
}
const v4Of = (CA, id) => (((CA.verdictLedger || {}).rows || []).find((r) => r.id === id) || {}).verdict4 || null;

/** 全体の表(純関数 —— QA がこの関数で正本を作り直して照合する)。 */
export function buildTable(CA0, CA1) {
  const presets = SIGNED_IDS.map((id) => {
    const pa = (CA0.presets || []).find((z) => z.id === id), pb = (CA1.presets || []).find((z) => z.id === id);
    if (!pa || !pb) return { id, missing: true };
    const rows = quantityRows(pa, pb);
    const per = rows.filter((z) => z.kind === 'period' && Number.isFinite(z.relDiff));
    const prc = rows.filter((z) => z.kind === 'precession' && Number.isFinite(z.absDiff));
    return { id, emoji: EMOJI[id], rows, nQuantities: rows.length,
      maxAbsRelDiffPeriod: per.reduce((m, z) => Math.max(m, Math.abs(z.relDiff)), 0),
      maxAbsDiffPrecession: prc.reduce((m, z) => Math.max(m, Math.abs(z.absDiff)), 0),
      signFlips: rows.filter((z) => z.signFlip).map((z) => z.name),
      verdictMoved: rows.filter((z) => !z.missingAfter && z.verdictBefore !== z.verdictAfter).length,
      gateMoved: rows.filter((z) => !z.missingAfter && z.gateBefore !== z.gateAfter).length,
      gateUndetermined: rows.filter((z) => z.gateAfter === '未判定').length,
      verdict4: { before: v4Of(CA0, id), after: v4Of(CA1, id) },
      run: { before: runOf(pa), after: runOf(pb) } };
  });
  const all = presets.flatMap((p) => p.rows || []);
  const v4b = {}, v4a = {}; for (const p of presets) { v4b[p.id] = p.verdict4 ? p.verdict4.before : null; v4a[p.id] = p.verdict4 ? p.verdict4.after : null; }
  const fvb = ((CA0.fourValues || {}).current || {}).counts || null;
  const four = { before: fvb, after: fvb ? substituteFour(fvb, v4b, v4a) : null, method: 'substitute-4',
    rule: '後 = 前(基点の正本の 4 値)から 4 本の verdict4 を差し替えた集計(他の 33 本は基点の値のまま)' };
  return { presets, nQuantities: all.length, gateUndeterminedAll: all.filter((z) => z.gateAfter === '未判定').length,
    verdictMovedAll: presets.reduce((a, p) => a + (p.verdictMoved || 0), 0), gateMovedAll: presets.reduce((a, p) => a + (p.gateMoved || 0), 0), fourValues: four };
}

/** 次の較正便で決める項(量ごとの必要な窓と誤差予算 —— 本便では決めない)。 */
export function nextCalibration(T) {
  const out = [];
  for (const p of T.presets) for (const z of (p.rows || [])) {
    if (z.signFlip || (Number.isFinite(z.relDiff) && Math.abs(z.relDiff) >= 0.1))
      out.push({ id: p.id, emoji: p.emoji, target: z.target, kind: z.kind, name: z.name, before: z.before, after: z.after, relDiff: z.relDiff, signFlip: z.signFlip,
        decideNext: '必要な窓(近点数)と誤差予算' });
  }
  return out;
}

const e3 = (x) => (Number.isFinite(x) ? x.toExponential(3) : '—');
const g6 = (x) => (Number.isFinite(x) ? Number(x.toPrecision(6)).toString() : '—');
/** PHYSICS〔第284便e〕の表の行(QA behavior.testParticleSigned が PHYSICS にあるかを照合する —— **壁時計は写さない**)。 */
export function docRows(Jt) {
  const out = { presets: [], notable: [], four: null };
  for (const p of Jt.table.presets) {
    if (p.missing) continue;
    out.presets.push(`| ${p.emoji} \`${p.id}\` | ${p.nQuantities} | ${e3(p.maxAbsRelDiffPeriod)} | ${e3(p.maxAbsDiffPrecession)} | ${p.verdictMoved} / ${p.gateMoved} / 未判定 ${p.gateUndetermined} | `
      + `${p.run.before.steps} → ${p.run.after.steps} | [${(p.run.before.periFound || []).join(', ')}] → [${(p.run.after.periFound || []).join(', ')}] | ${p.verdict4.before} → ${p.verdict4.after} |`);
  }
  for (const z of Jt.nextCalibration) out.notable.push(`| ${z.emoji} \`${z.id}\` | ${z.name} | ${g6(z.before)} → ${g6(z.after)} | ${z.signFlip ? '符号が変わる' : e3(z.relDiff)} | ${z.decideNext}(次の較正便) |`);
  const f = Jt.table.fourValues;
  if (f.before && f.after) out.four = `4 値 ${VERDICT4.map((k) => f.before[k]).join('/')} → ${VERDICT4.map((k) => f.after[k]).join('/')}`;
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const BASE_REV = process.env.W284E_BASE_REV || BASE_REV_DEFAULT;
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const t0 = Date.now();
  const CANON_IN = 'tests/out/calaudit-w249.json';
  const baseTxt = execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':' + CANON_IN], { maxBuffer: 256 << 20 });
  const CA0 = JSON.parse(baseTxt);
  const base = { rev: BASE_REV, file: CANON_IN, sha256: crypto.createHash('sha256').update(baseTxt).digest('hex'),
    targetSha256: CA0.meta ? CA0.meta.targetSha256 : null, when: CA0.meta ? CA0.meta.when : null,
    note: '基点の正本は git show の一時読み(ファイルに書かない)' };
  const nowSha = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, TARGET))).digest('hex');
  // 第288便b: いまの html で familyRole:"retired" を宣言した本(文字列で読む —— エンジンは走らせない)
  const RETIRED_NOW = (() => { const h = fs.readFileSync(path.join(ROOT, TARGET), 'utf8'); const out = new Set();
    for (const id of SIGNED_IDS) { const i = h.indexOf('id:"' + id + '"'); if (i < 0) continue; const seg = h.slice(i, i + 4000); if (/familyRole:\s*"retired"/.test(seg)) out.add(id); }
    return out; })();
  let CA1 = null, after = null;
  const tA = Date.now();   // 後の出所を得るまでの壁時計(正本を読むだけなら読み込みの時間 —— 機種依存)
  try { const c = JSON.parse(fs.readFileSync(path.join(ROOT, CANON_IN), 'utf8'));
    // 第288便b(原仮定者の裁定(第78報)④): 退役した本(💿 saturnRingRealKF1)は calaudit の母集団の外 —— 正本に無くてよい(表では missing:true・履歴の対照は基点の正本 CA0 だけ)
    if (c.meta && c.meta.targetSha256 === nowSha && SIGNED_IDS.every((id) => RETIRED_NOW.has(id) || (c.presets || []).some((p) => p.id === id))) {
      CA1 = c; after = { source: 'canon', file: CANON_IN, targetSha256: nowSha, when: c.meta.when || null,
        canonFourValues: ((c.fourValues || {}).current || {}).counts || null, wallSec: (Date.now() - tA) / 1000 };
    }
  } catch (e) { /* 読めなければ走らせる */ }
  if (!CA1) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w284e-tpsign-'));
    const o = path.join(tmp, 'calaudit.json'), d = path.join(tmp, 'calaudit-diag.json');
    const t1 = Date.now();
    const liveIds = SIGNED_IDS.filter((id) => !RETIRED_NOW.has(id));   // 第288便b: 退役した本は判定器の CFG にも無い
    const sp = spawnSync(process.execPath, [path.join(ROOT, 'tests', 'exp-w249b-calaudit.mjs'), '--only', liveIds.join(',')],
      { cwd: ROOT, env: Object.assign({}, process.env, { W249_OUT: o, W249_DIAG_OUT: d, QA_TARGET: TARGET }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (sp.status !== 0) { console.error(sp.stderr.slice(-2000)); throw new Error('判定器が失敗した: ' + sp.status); }
    CA1 = JSON.parse(fs.readFileSync(o, 'utf8'));
    fs.rmSync(tmp, { recursive: true, force: true });
    after = { source: 'fresh-run', cmd: 'node tests/exp-w249b-calaudit.mjs --only ' + liveIds.join(',') + '(W249_OUT は一時ファイル)',
      targetSha256: CA1.meta ? CA1.meta.targetSha256 : null, when: CA1.meta ? CA1.meta.when : null, wallSec: (Date.now() - t1) / 1000,
      why: '正本 calaudit-w249.json がいまの html の世代でない(鎖の再生成の前)', canonFourValues: null };
  }
  const table = buildTable(CA0, CA1);
  const nc = nextCalibration(table);
  for (const p of table.presets) if (p.missing) console.log(`${EMOJI[p.id] || ''} ${p.id}: 正本に無い(退役 —— 較正母集団の外・第288便b)`); else console.log(`${p.emoji} ${p.id}: ${p.nQuantities} 量・周期の最大 |相対差| ${e3(p.maxAbsRelDiffPeriod)}・近点移動の最大 |差| ${e3(p.maxAbsDiffPrecession)}°/周・`
    + `区分 ${p.verdictMoved}・門 ${p.gateMoved}・未判定 ${p.gateUndetermined}・近点 [${(p.run.before.periFound || []).join(',')}]→[${(p.run.after.periFound || []).join(',')}]・`
    + `壁時計 ${p.run.before.wallSec.toFixed(1)}→${p.run.after.wallSec.toFixed(1)} s・verdict4 ${p.verdict4.before}→${p.verdict4.after}`);
  console.log(docRows({ table, nextCalibration: nc }).four + '(' + after.source + ')');
  const CODE = ['tests/exp-w284e-tpsign.mjs', 'tests/lib-w283c-calstages.mjs', 'tests/exp-w249b-calaudit.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第284便e', target: TARGET, code: CODE, inputs: [TARGET, CANON_IN] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: 0,
    ruling: '原仮定者の裁定(第74報)AN34: 重い 4 本は試験粒子契約を宣言して署名(量ごとの前後を記録・全 54 量は未判定のまま・「区分が動かない」を受理の根拠にしない・💍 の C 環内縁は環粒子そのもの=前後を明記)',
    notClaim: ['区分が動かないので受理', '試験粒子にすれば合', '試験が短くなった=数値が収束した', '観測一致を達成した', '較正を完了した'] });
  const out = { meta, base, after, signed: SIGNED_GROUPS, table, nextCalibration: nc, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.writeFileSync(path.join(ROOT, 'tests', 'out', 'tpsign-w284e.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/tpsign-w284e.json(' + out.elapsedS.toFixed(1) + ' s)');
}

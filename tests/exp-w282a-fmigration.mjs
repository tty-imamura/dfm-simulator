// 第282便a(原仮定者の裁定(第72報)③「f≈2・f≈1+kFrame は廃止・f≈1 も f=1 に」・統括の検証項目 R78):
// **恒星連星 2 本(✴️ alphaCenABDFM・💫 siriusABDFM)の f=1 移行の前後記録**を作る器。
//
// ■ 何をするか
//   ① 基点 html(既定: `git show 8b05232:beta/index.html` —— 移行前)と現行 beta/index.html(移行後)の 2 本に、
//      **判定器そのもの**(tests/exp-w249b-calaudit.mjs)を `--only alphaCenABDFM,siriusABDFM --dt3` で走らせる
//      (3 段登録表の 2 本なので正本と同じ h・h/2・h/4 の 3 段・同じ停止条件・同じ抽出器・同じ門)。
//      出力は `W249_OUT` / `W249_DIAG_OUT` で一時ファイルへ向ける —— **正本 calaudit-w249.json は 1 バイトも触らない**。
//   ② 2 本の該当行(周期 2 定義の残差・σ 倍・判定段の値・離心率・近点移動・門の状態・4 値の区分)を抜き出す。
//   ③ **4 値・門・5 区分の前後**: 正本(基点の html で測った全 37 本 —— 刻印が基点 html の SHA-256 と一致することを確かめる)
//      から 2 本の行を差し替えて数え直す。**切断点**(σ 接続器の太陽系の行だけを数える量)は 2 本が太陽系の行に
//      無いことを確かめて「不変」と記録する。
//   ④ `tests/out/fmigration-w282a.json` を書く(**履歴の正本** —— role:"history"・frozen:true。移行は 1 度きりの出来事
//      なので再生成しない。現行の判定は統括の chain が正本 calaudit を走らせ直して出す)。
//
// ■ この器がしないこと
//   ・判定を変えない(判定器の出力を写すだけ)。「f=1 で合った」とは書かない。
//   ・プリセットを書き換えない。基点 html は一時ファイルとして作り、終わったら消す(W282A_BASE_HTML を渡せばそれを使い、消さない)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w282a-fmigration.mjs
//   環境変数: W282A_BASE_REV(既定 8b05232)/ W282A_BASE_HTML(基点 html を既に持っているときのパス・ROOT 相対)
//   所要: 約 6.5 分(1 本あたり h 17 s・h/2 34 s・h/4 68 s ×2 本 × 前後 2 回 —— 実測)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { provenanceMetaScoped } from './lib-w281a-scope.mjs';

const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABDFM","earthMoonRealKF1","emAuditDFM","emAuditNewton","gw150914DFM","jupiterGalilean","marsMoonsReal","neptuneReal","plutoCharonReal","psrB1534","psrB1534CF","psrB1534DFM","psrDoubleAB","psrDoubleABCF","psrDoubleABDFM","psrDoubleABPN","psrDoubleABSpinCal","psrJ1757CF","psrJ1757DFM","psrJ1757PN","psrJ1946CF","psrJ1946DFM","psrJ1946PN","qLockRadialAudit","qLockRadialAuditQ3","saturnZonalD68","siriusAB","siriusABDFM","venusReal"],"roots":["$","HP.allPresets","HP.coreState","HP.sim","HP.validatePreset","T","applyQLock","ch","clamp","ctx","isNum","scaleExpT","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'fmigration-w282a.json');
const IDS = ['alphaCenABDFM', 'siriusABDFM'];
const BASE_REV = process.env.W282A_BASE_REV || '8b05232';
const CODE = ['tests/exp-w282a-fmigration.mjs', 'tests/exp-w249b-calaudit.mjs', 'tests/lib-w272e-provenance.mjs',
  'tests/lib-w281a-scope.mjs', 'tests/lib-w258d-evidence.mjs', 'tests/lib-w264d-sigmamark.mjs',
  'tests/lib-sigma-destinations.mjs', 'tests/lib-w268a-judgement.mjs', 'tests/lib-w270b-obscsv.mjs',
  'tests/lib-w270a-stoprule.mjs'];
const sha = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
const rd = (abs) => JSON.parse(fs.readFileSync(abs, 'utf8'));

// ---------------------------------------------------------------- 基点 html
let baseRel = process.env.W282A_BASE_HTML || null;
let madeBase = false;
if (!baseRel) {
  baseRel = 'beta/_w282a_fmig_base.html';
  const txt = execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':beta/index.html'], { maxBuffer: 64 << 20 });
  fs.writeFileSync(path.join(ROOT, baseRel), txt);
  madeBase = true;
}
const baseSha = sha(path.join(ROOT, baseRel));
const nowSha = sha(path.join(ROOT, 'beta', 'index.html'));

// ---------------------------------------------------------------- 判定器の部分走行(一時ファイルへ)
const tmpDir = fs.mkdtempSync(path.join(ROOT, 'tests', 'out', '.w282a-fmig-'));
function runAudit(targetRel, tag) {
  const out = path.join(tmpDir, tag + '.json'), diag = path.join(tmpDir, tag + '-diag.json');
  const t0 = Date.now();
  execFileSync(process.execPath, ['tests/exp-w249b-calaudit.mjs', '--only', IDS.join(','), '--dt3'], {
    cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 64 << 20,
    env: Object.assign({}, process.env, { QA_TARGET: targetRel, W249_OUT: out, W249_DIAG_OUT: diag }) });
  return { json: rd(out), sec: (Date.now() - t0) / 1000 };
}
let before, after;
try {
  before = runAudit(baseRel, 'before');
  after = runAudit('beta/index.html', 'after');
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (madeBase) fs.rmSync(path.join(ROOT, baseRel), { force: true });
}

// ---------------------------------------------------------------- 行の抜き出し
const KINDS = ['period', 'ecc', 'precession'];
function rowsOf(J) {
  const o = {};
  for (const id of IDS) {
    const p = (J.presets || []).find((z) => z.id === id);
    if (!p) { o[id] = null; continue; }
    const q = {};
    for (const x of p.quantities || []) {
      if (KINDS.indexOf(x.kind) < 0) continue;
      const g = x.gate || {};
      q[x.kind] = { name: x.name, unit: x.unit, obs: x.obs, obsErr: x.obsErr,
        measH: x.meas, residualPct: x.residualPct,
        residualPctRev: x.residualPctRev === undefined ? null : x.residualPctRev,
        residualPctPeri: x.residualPctPeri === undefined ? null : x.residualPctPeri,
        verdict5: x.verdict, gateStatus: g.status || null, assessedStage: g.assessedStage || null,
        assessedValue: g.assessedValue === undefined ? null : g.assessedValue,
        nSigma: g.nSigma === undefined ? null : g.nSigma };
    }
    const vl = ((J.verdictLedger || {}).rows || []).find((z) => z.id === id) || {};
    o[id] = { massCalibration: p.massCalibration || null,
      massFactorCorrelate: (p.correlates || {}).massFactor === undefined ? null : p.correlates.massFactor,
      verdict4: vl.verdict4 || null, representative: vl.representative || null, missing: vl.missing || [],
      quantities: q };
  }
  return o;
}
const rb = rowsOf(before.json), ra = rowsOf(after.json);

// ---------------------------------------------------------------- 4 値・門・5 区分の前後(正本から 2 本を差し替えて数え直す)
const CAL = rd(path.join(ROOT, 'tests', 'out', 'calaudit-w249.json'));
const canonTarget = ((CAL.fourValues || {}).current || {}).targetSha256 || (CAL.mergeKey || {}).targetSha256 || null;
const canonMatchesBase = canonTarget === baseSha;
const canonRows = (CAL.verdictLedger || {}).rows || [];
const count4 = (rows) => rows.reduce((o, r) => { o[r.verdict4] = (o[r.verdict4] || 0) + 1; return o; },
  { '合': 0, '量限定合': 0, '否': 0, '保留': 0 });
const four = { before: count4(canonRows),
  after: count4(canonRows.map((r) => (IDS.indexOf(r.id) >= 0 ? Object.assign({}, r, { verdict4: ra[r.id].verdict4 }) : r))) };
// 門と 5 区分: 正本の集計 − 部分走行(前)の集計 + 部分走行(後)の集計
const sub = (A, B, C) => { const o = {}; for (const k of new Set([...Object.keys(A || {}), ...Object.keys(C || {})]))
  o[k] = (A[k] || 0) - ((B || {})[k] || 0) + ((C || {})[k] || 0); return o; };
const gate = { before: CAL.summary.gate.byStatus,
  after: sub(CAL.summary.gate.byStatus, before.json.summary.gate.byStatus, after.json.summary.gate.byStatus) };
const tally = { before: CAL.summary.tally, after: sub(CAL.summary.tally, before.json.summary.tally, after.json.summary.tally) };
// 部分走行(前)が正本の 2 行と一致するか(同じ器・同じ html なら bit 一致するはず)
const reproduced = IDS.every((id) => KINDS.every((k) => {
  const cp = (CAL.presets || []).find((z) => z.id === id); if (!cp) return false;
  const cq = (cp.quantities || []).find((z) => z.kind === k); const bq = rb[id].quantities[k];
  if (!cq || !bq) return !cq && !bq;
  return Object.is(cq.meas, bq.measH) && Object.is((cq.gate || {}).assessedValue, bq.assessedValue);
}));
// 切断点: σ 接続器の行に 2 本が居ないこと(居なければ切断点は動かない)
const SS = rd(path.join(ROOT, 'tests', 'out', 'solarsigma-w262d.json'));
const ssText = JSON.stringify(SS);   // σ 接続器の正本全体(行・集計・履歴)に 2 本の id が現れないこと
const cutUntouched = IDS.every((id) => ssText.indexOf(id) < 0);
const cutNow = SS.cutTally || null;
const solarCut = { rule: '切断点(csv-sigma-empty / kind-not-gated / unit-not-converted / connected)は σ 接続器'
  + '(tests/exp-w262d-solarsigma.mjs)が**太陽系の行だけ**を数える量である。移行した 2 本は恒星連星で、'
  + 'σ 接続器の行に現れない(untouched=' + cutUntouched + ')ので、切断点は移行で動かない。',
  untouched: cutUntouched, fourValuesHistoryHead: ((CAL.fourValues || {}).history || [])[0]
    ? CAL.fourValues.history[0].solarCut : null, solarsigmaCutTally: cutNow };

const out = {
  meta: Object.assign(await provenanceMetaScoped({ root: ROOT,
    wave: '第282便a(原仮定者の裁定(第72報)③・R78 —— 恒星連星 2 本の f=1 移行の前後記録)',
    target: 'beta/index.html', inputs: ['beta/index.html', 'tests/out/calaudit-w249.json', 'tests/out/solarsigma-w262d.json'],
    code: CODE, scope: REGEN_SCOPE }),
  { role: 'history', frozen: true,
    note: '**移行は 1 度きりの出来事なので再生成しない**(履歴の正本)。現行の判定は統括の chain が正本 calaudit を'
      + '走らせ直して出す。基点 html は `git show ' + BASE_REV + ':beta/index.html`(一時ファイル・終了後に削除)。',
    baseRev: BASE_REV, baseHtmlSha256: baseSha, nowHtmlSha256: nowSha,
    auditCmd: 'W249_OUT=<tmp> W249_DIAG_OUT=<tmp> QA_TARGET=<html> node tests/exp-w249b-calaudit.mjs --only '
      + IDS.join(',') + ' --dt3',
    wallSec: { before: before.sec, after: after.sec },
    doNotWrite: ['f=1 で合った', 'kF0 版が成立した', '較正を完了した', '判定が増えた'] }),
  ids: IDS,
  migration: {
    alphaCenABDFM: { mBefore: [21.45656689553357, 18.08334317892021], mAfter: [21.451938, 18.079442],
      fBefore: 1.0002157798299423, lawBefore: 'inertia-law-lin-v1', fAfter: 1, lawAfter: 'f-fixed-1',
      baseMassFrom: 'massCalibration.baseMass(= ✨ alphaCenAB の bodies の m・MASS_BASIS records SOL-f31c9224/SOL-0347b3c6)',
      hiddenCore: '無し(第242便で撤去済み —— 移行で除くものは無い)', initialState: '位置・速度は不変(✨ とビット同一)' },
    siriusABDFM: { mBefore: [41.038218223641486, 20.25056042252401], mAfter: [41.022755, 20.24293],
      fBefore: 1.0003769425929947, lawBefore: 'inertia-law-lin-v1', fAfter: 1, lawAfter: 'f-fixed-1',
      baseMassFrom: 'massCalibration.baseMass(= 🌟 siriusAB の bodies の m・MASS_BASIS records SOL-48a6939f/SOL-62054200)',
      hiddenCore: '無し(第242便で撤去済み —— 移行で除くものは無い)', initialState: '位置・速度は不変(🌟 とビット同一)' } },
  before: rb, after: ra,
  reproducedCanonical: reproduced,
  canonicalMatchesBaseHtml: canonMatchesBase,
  fourValues: four, gate, tally, solarCut,
  summary: {
    fourBefore: [four.before['合'], four.before['量限定合'], four.before['否'], four.before['保留']].join('/'),
    fourAfter: [four.after['合'], four.after['量限定合'], four.after['否'], four.after['保留']].join('/'),
    gateBefore: ['合(3σ)', '否(3σ)', '数値未解決', 'mapping-unresolved', 'condition-mismatch'].map((k) => gate.before[k]).join('/'),
    gateAfter: ['合(3σ)', '否(3σ)', '数値未解決', 'mapping-unresolved', 'condition-mismatch'].map((k) => gate.after[k]).join('/'),
    verdict4: IDS.map((id) => id + ' ' + rb[id].verdict4 + '→' + ra[id].verdict4).join(' / ') },
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('[w282a-fmig] 4 値 ' + out.summary.fourBefore + ' → ' + out.summary.fourAfter
  + ' / 門 ' + out.summary.gateBefore + ' → ' + out.summary.gateAfter + ' / ' + out.summary.verdict4
  + ' / 正本の再現=' + reproduced + '・正本=基点 html ' + canonMatchesBase + ' → ' + OUT);

// 第281便a(原仮定者の裁定(第71報)・AN16 採用・統括の検証項目 R71)— **❄️ 対照系列の履歴列を 1 度だけ転記する器**。
//
// ■ 何をするか
//   第272便b の正本 `tests/out/charon-w272b.json`(**基点コミットの版** —— 既定 53aaa64)から
//     ・履歴列 C2 / C4 / C7 の全段(h/h2/h4)と、その `stageOrders`
//     ・C3 / C5 / S の **h4 段**と、その 3 段の `stageOrders`(第281便a から h4 段は C0/C1/C6 だけになるため)
//   を `tests/out/charon-history-w272b.json` へ**値を 1 つも変えずに**写す。
//   meta は来歴の形(版 w272e-1)に `role:"history"`・`frozen:true` を足し、`targetSha256` は**写し元の走行が
//   読んだ html の hash のまま**(付け替えない)。
//
// ■ しないこと
//   ・走行しない(ページも力学も触らない)・値を作らない・判定しない。
//   ・**再生成しない**: 履歴は第272便b〜第280便の html で測った記録であり、現行の結論に昇格させない
//     (`lint.regenScope` が「履歴の正本を現行の正本・生成領域が入力にしていない」ことを照合する)。
//   ・写し元の正本(`charon-w272b.json`)を書き換えない(現行列の整理は `tests/exp-w272b-charon.mjs` が
//     次の走行で行う)。
//
// 実行: node tests/exp-w281a-charonsplit.mjs [--rev 53aaa64] [--from <path>]
//   --from を渡すとそのファイルから写す(git が無い環境用)。既定は `git show <rev>:tests/out/charon-w272b.json`。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stampFile, digestOfStamps, PROVENANCE_VERSION } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const REV = getArg('--rev', '53aaa64');
const FROM = getArg('--from', null);
const SRC_REL = 'tests/out/charon-w272b.json';
const OUT = path.join(ROOT, 'tests', 'out', 'charon-history-w272b.json');
export const SPLIT_VERSION = 'w281a-split-1';
const HISTORY_SERIES = ['C2', 'C4', 'C7'];
const H4_MOVED_SERIES = ['C3', 'C5', 'S'];

const buf = FROM ? fs.readFileSync(FROM)
  : execFileSync('git', ['-C', ROOT, 'show', REV + ':' + SRC_REL], { maxBuffer: 1 << 28 });
const src = JSON.parse(buf.toString('utf8'));
const srcSha = crypto.createHash('sha256').update(buf).digest('hex');
const seriesOf = (id, byStage) => {
  const any = byStage.h || byStage.h2 || byStage.h4 || {};
  return any.series || String(id).split('_')[0];
};

const columns = {};
const stageOrders = {};
let nHist = 0, nH4 = 0;
for (const [id, byStage] of Object.entries(src.columns || {})) {
  const s = seriesOf(id, byStage);
  if (HISTORY_SERIES.includes(s)) {
    columns[id] = byStage; nHist++;
    if (src.stageOrders && src.stageOrders[id]) stageOrders[id] = src.stageOrders[id];
  } else if (H4_MOVED_SERIES.includes(s) && byStage.h4) {
    columns[id] = { h4: byStage.h4 }; nH4++;
    if (src.stageOrders && src.stageOrders[id]) stageOrders[id] = src.stageOrders[id];
  }
}

const code = ['tests/exp-w281a-charonsplit.mjs', 'tests/lib-w272e-provenance.mjs']
  .map((rel) => stampFile(path.join(ROOT, rel), rel));
const sm = src.meta || {};
const out = {
  meta: {
    provenanceVersion: PROVENANCE_VERSION,
    wave: '第281便a',
    role: 'history',
    frozen: true,
    splitVersion: SPLIT_VERSION,
    target: sm.target || 'beta/index.html',
    // **付け替えない**: 写し元の走行が読んだ html の hash(第272便b〜第280便の走行)
    targetSha256: sm.targetSha256,
    generatedAt: new Date().toISOString(),
    inputs: [{ file: SRC_REL + '@' + (FROM ? 'file' : REV), gitRev: FROM ? null : REV,
      bytes: buf.length, sha256: srcSha }],
    code,
    codeSha256: digestOfStamps(code),
    historyOf: { file: SRC_REL, gitRev: FROM ? null : REV, sha256: srcSha,
      harness: sm.harness || null, harnessVersion: sm.harnessVersion || null,
      mergeKey: sm.mergeKey || null, mergeKeyParts: sm.mergeKeyParts || null,
      measureSha256: sm.measureSha256 || null, libSha256: sm.libSha256 || null,
      generatedAt: sm.generatedAt || null, stagesPresent: sm.stagesPresent || null,
      contract: sm.contract || null, observation: sm.observation || null },
    historySeries: HISTORY_SERIES,
    h4MovedSeries: H4_MOVED_SERIES,
    counts: { historyColumns: nHist, h4MovedColumns: nH4 },
    note: '**履歴**(第281便a・AN16): 第272便b の対照系列のうち、現行の結論に使わない列(C2 kF 感度 f=1・'
      + 'C4 f=1+kF の外挿対照・C7 geoPN=3+toyAllowDrag の重畳)の全段と、h4 段を C0/C1/C6 に絞ったことで'
      + '現行から外れた C3/C5/S の h4 段を、**値を 1 つも変えずに**写した。再生成しない。',
    notClaim: ['カロンの合否', '新発見', 'kFrame≈0 の法則化', '潮汐ロックの証明', '引きずり式の確定',
      '履歴列が現行の結論である'],
  },
  columns,
  stageOrders,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`wrote ${OUT}: 履歴列 ${nHist}・h4 だけ写した列 ${nH4}・stageOrders ${Object.keys(stageOrders).length}`
  + `(写し元 ${SRC_REL}@${FROM ? 'file' : REV} sha256 ${srcSha.slice(0, 12)}…)`);

// 第283便b(原仮定者の裁定(第73報)④「ダークローター関連の一部は不用なので廃止の方向(darkrotor・bhCore・nebulaRotor・
// nebulaShell・nebulaBipolar・starSeed・bhCoreTilt)」・統括の検証項目 R84): **退役 7 本の固定資産(fixture)を 1 度だけ作る器**。
//
// ■ 何をするか(Node だけ —— 基点の html を `git show <rev>:beta/index.html` で一時ファイルへ出し、tests/lib-w279b-headless.mjs で読む)
//   ① 退役 7 本の**内蔵定義そのもの**(BUILTIN_PRESETS の要素の JSON 写し)と presetSigHash・presetSig の sha256 を凍結する
//      (BUILTIN_PRESETS から消す日が来ても、履歴の正本・試験がこの写しから同じ本を組み立てられるように)。
//   ② **ゲートから外す長走行**(🕶️ の darkrotorMidNew / darkrotorMidOld / darkrotorLong / darkrotorMultiseed の 4 ユニットと、
//      その結果を読む 4 試験 behavior.darkrotor / behavior.darkrotorLong / behavior.darkrotor-pitch / behavior.darkrotor-multiseed)の
//      **最後の保存 QA の値**(pass・detail・所要)を履歴として転記する(測り直さない —— 転記の出所は保存 QA の commit と対象 sha)。
//   ③ ⚫ bhCore の**アナロジーの尺度比較の参照値**(中心の m・R・spin と G・c)を定数として置く(tests/exp-w282d-analogy.mjs が読む)。
//   ④ 機構の最小試験(コアの交換・傾斜・減光・パワーボールの 1 点ずつ)の対応表(試験 ID と、その試験が組み立てる本)。
//
// ■ しないこと: 1 步も走らせない。判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w283b-retiredfx.mjs [--rev de9e39b] [--force]
// 出力: tests/fixtures/retired-w283b.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const REV = (() => { const i = argv.indexOf('--rev'); return i >= 0 ? argv[i + 1] : 'de9e39b'; })();
const FORCE = argv.includes('--force');
const OUT = path.join(ROOT, 'tests', 'fixtures', 'retired-w283b.json');
const QAF = 'tests/out/qa-results-full-beta.json';

export const FIXTURE_VERSION = 'w283b-retired-1';
export const RETIRED_IDS = ['darkrotor', 'bhCore', 'nebulaRotor', 'nebulaShell', 'nebulaBipolar', 'starSeed', 'bhCoreTilt'];
/** ゲートから外す長走行(W5c のユニット)と、その結果を読む試験。 */
export const GATE_REMOVED_UNITS = ['darkrotorMidNew', 'darkrotorMidOld', 'darkrotorLong', 'darkrotorMultiseed'];
export const GATE_REMOVED_TESTS = ['behavior.darkrotor', 'behavior.darkrotorLong', 'behavior.darkrotor-pitch', 'behavior.darkrotor-multiseed'];
/** 機構の最小試験(ゲートに残す 1 点ずつ)。 */
export const MECHANISM_TESTS = [
  { mechanism: 'core-exchange', ja: 'コアの交換(殻のスピン移送)', testId: 'claim.bhcore-selfdrive', preset: 'bhCore' },
  { mechanism: 'tilt', ja: '傾斜(コア軸の横倒しで Jz が機械ゼロ・減光は保つ)', testId: 'behavior.templates229', preset: 'bhCoreTilt' },
  { mechanism: 'dimming', ja: '減光(暗いコアと明るい外層のコントラスト)', testId: 'claim.nebularotor-contrast', preset: 'nebulaRotor' },
  { mechanism: 'powerball', ja: 'パワーボール(圧縮と軸仕事の経路)', testId: 'claim.starseed-powerball', preset: 'starSeed' },
];

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

if (fs.existsSync(OUT) && !FORCE) {
  console.error('fixture は凍結済み(書き換えない): ' + path.relative(ROOT, OUT) + ' —— 作り直すときだけ --force');
  process.exit(1);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w283b-fx-'));
const htmlPath = path.join(tmp, 'base.html');
let fullRev = null;
try {
  fullRev = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${REV}`, { stdio: 'pipe' }).toString().trim();
  fs.writeFileSync(htmlPath, execSync(`git -C ${JSON.stringify(ROOT)} show ${REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const htmlSha = sha256(fs.readFileSync(htmlPath));
  const H = loadHtmlHeadless(htmlPath);
  const B = H.evalExpr('BUILTIN_PRESETS');
  const presetSig = H.evalExpr('presetSig'), presetSigHash = H.evalExpr('presetSigHash');
  const presets = {};
  for (const id of RETIRED_IDS) {
    const p = B.find((q) => q.id === id);
    if (!p) throw new Error('基点に ' + id + ' が無い');
    const raw = JSON.parse(JSON.stringify(p));
    presets[id] = { emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRoleAtRev: p.familyRole || null,
      group: p.group, sampleClass: p.sampleClass || null, presetSigHash: presetSigHash(p), presetSigSha256: sha256(presetSig(p)), raw };
  }
  // ② 保存 QA の転記
  const Q = JSON.parse(fs.readFileSync(path.join(ROOT, QAF), 'utf8'));
  const tests = GATE_REMOVED_TESTS.map((id) => { const t = (Q.results || []).find((z) => z.id === id);
    return t ? { id, pass: !!t.pass, ms: t.ms || 0, detail: t.detail || '' } : { id, missing: true }; });
  const units = {};
  for (const u of GATE_REMOVED_UNITS) { const v = (Q.unitTimings || {})['W5c:' + u]; units[u] = v ? Object.assign({}, v) : null; }
  const workerMs = Object.values(units).reduce((a, v) => a + ((v && v.runMs) || 0), 0);
  // ③ ⚫ の尺度比較の参照値(tests/exp-w282d-analogy.mjs の centerDims と同じ量 —— 最初の single の中心)
  const bh = presets.bhCore.raw;
  const c0 = bh.bodies.find((z) => z.type === 'single');
  const analogyRef = { bhCore: { id: 'bhCore', emoji: presets.bhCore.emoji, body: 0,
    m: c0.m, R: c0.radius, spin: c0.spin || 0, G: bh.physics.G, c: bh.physics.cLight,
    source: `${REV}:beta/index.html の BUILTIN_PRESETS bhCore(bodies の最初の single と physics)` } };
  const fx = {
    fixtureVersion: FIXTURE_VERSION,
    wave: '第283便b', ruling: '原仮定者の裁定(第73報)④・統括の検証項目 R84',
    frozen: true,
    note: '退役 7 本の凍結資産(書き換えない)。BUILTIN_PRESETS からは消していない(旧セーブ・履歴の正本の参照が残る)。'
      + '履歴の値は最後の保存 QA の転記であって測り直していない。',
    source: { rev: REV, commit: fullRev, file: 'beta/index.html', sha256: htmlSha },
    ids: RETIRED_IDS,
    presets,
    history: {
      qa: { file: QAF, commit: Q.commit || null, date: Q.date || null, targetSha256: Q.targetSha256 || null,
        total: Q.total || null, wallDurationMs: Q.wallDurationMs || null },
      gateRemovedUnits: units, gateRemovedWorkerMs: workerMs, tests,
    },
    mechanism: MECHANISM_TESTS,
    analogyRef,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(fx, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT), bytes: fs.statSync(OUT).size, htmlSha: htmlSha.slice(0, 12),
    sigs: Object.fromEntries(RETIRED_IDS.map((id) => [id, presets[id].presetSigHash])), workerMs,
    tests: tests.map((t) => t.id + ':' + t.pass) }));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

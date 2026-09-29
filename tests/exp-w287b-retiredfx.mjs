// 第287便b(原仮定者の裁定(第77報)AN62「🧶 の f=1 と 🪤 の退役は同時」・第76報 AN57「🩺 → 🧶 の順」):
// **退役 1 本(🪤 psrB1534CF)と 🧶 psrB1534DFM の旧則(f≈2)の凍結資産(fixture)を 1 度だけ作る器**(第284便b・第285便f・第286便f の
// tests/exp-w284b-retiredfx.mjs・tests/exp-w285f-retiredfx.mjs・tests/exp-w286f-retiredfx.mjs と同じ流儀 —— 器の本文は同じで、対象の本・基点・出力の名前だけが違う)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 退役 1 本(🪤)の**内蔵定義そのもの**と presetSigHash・presetSig の sha256 を**この便の html**から凍結する。
//      基点(`--base-rev`・既定 f94ca58)の署名も並べる(退役は familyRole だけを動かす —— 署名は基点と同じ)。
//   ② **🧶 psrB1534DFM の旧則**(第251〜286便の一次則 f≈2 の条件つき較正)を基点の html から `superseded` に凍結する。**現行の根拠ではない**(履歴)。
//   ③ **付け替えた試験の最後の保存 QA の値**(基点の tests/out/qa-results-full-beta.json の転記 —— 測り直さない)。
//
// ■ しないこと: 判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w287b-retiredfx.mjs [--html beta/index.html] [--base-rev f94ca58] [--force]
// 出力: tests/fixtures/retired-w287b.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const HTML = path.resolve(ROOT, arg('--html', 'beta/index.html'));
const BASE_REV = arg('--base-rev', 'f94ca58');
const FORCE = argv.includes('--force');
const OUT = path.join(ROOT, 'tests', 'fixtures', 'retired-w287b.json');
const QAF = 'tests/out/qa-results-full-beta.json';

export const FIXTURE_VERSION = 'w287b-retired-1';
export const RETIRED_IDS = ['psrB1534CF'];
/** 旧則を凍結する本(f=1 へ移した本 —— 内蔵に残るが、中身は新しい宣言に置き換わった) */
export const SUPERSEDED_IDS = ['psrB1534DFM'];
/** 付け替えた試験(旧 🧶 の質量を読んでいた・旧 🧶 を NS 4 系の数値の器にしていた)—— 最後の保存 QA の値を転記する */
export const REPOINTED_TESTS = ['lint.precisionUlp', 'behavior.nsThreeStage'];

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

if (fs.existsSync(OUT) && !FORCE) {
  console.error('fixture は凍結済み(書き換えない): ' + path.relative(ROOT, OUT) + ' —— 作り直すときだけ --force');
  process.exit(1);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w287b-fx-'));
try {
  const baseCommit = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${BASE_REV}`, { stdio: 'pipe' }).toString().trim();
  const basePath = path.join(tmp, 'base.html');
  fs.writeFileSync(basePath, execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const Hn = loadHtmlHeadless(HTML), Hb = loadHtmlHeadless(basePath);
  const Bn = Hn.evalExpr('BUILTIN_PRESETS'), Bb = Hb.evalExpr('BUILTIN_PRESETS');
  const sigN = Hn.evalExpr('presetSig'), hashN = Hn.evalExpr('presetSigHash');
  const sigB = Hb.evalExpr('presetSig'), hashB = Hb.evalExpr('presetSigHash');
  const presets = {};
  for (const id of RETIRED_IDS) {
    const p = Bn.find((q) => q.id === id), pb = Bb.find((q) => q.id === id);
    if (!p || !pb) throw new Error('html に ' + id + ' が無い');
    if (p.familyRole !== 'retired') throw new Error(id + ' が familyRole:"retired" でない');
    const raw = JSON.parse(JSON.stringify(p));
    presets[id] = { emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRole: p.familyRole,
      familyRoleAtBase: pb.familyRole || null, group: p.group, sampleClass: p.sampleClass || null,
      presetSigHash: hashN(p), presetSigSha256: sha256(sigN(p)),
      base: { rev: BASE_REV, presetSigHash: hashB(pb), name: pb.name, sigSame: sigN(p) === sigB(pb) },
      raw };
  }
  // ② 🧶 の旧則
  const superseded = {};
  for (const id of SUPERSEDED_IDS) {
    const pb = Bb.find((q) => q.id === id), pn = Bn.find((q) => q.id === id);
    const raw = JSON.parse(JSON.stringify(pb));
    const claims = (pb.claims || []).map((c) => {
      let v = null;
      try { const m = String(pb.description || '').match(new RegExp(c.descPattern)); v = m ? parseFloat(m[1]) : null; } catch (e) { v = null; }
      return { id: c.id, metric: c.metric, role: c.role, expected: c.expected, descPattern: c.descPattern, valueInText: v, testId: c.testId };
    });
    superseded[id] = { emoji: pb.emoji, nameAtBase: pb.name, nameNow: pn ? pn.name : null, rev: BASE_REV,
      presetSigHash: hashB(pb), presetSigSha256: sha256(sigB(pb)), presetSigHashNow: pn ? hashN(pn) : null,
      massCalibration: pb.massCalibration || null, obsCardRows: (pb.obsCard || []).map((r) => r.q),
      claims, raw,
      why: '原仮定者の裁定(第77報)AN62: 旧則(一次則 f≈2 の条件つき較正・Kcs=0 の補正コア・偶力はコアへ)の宣言。**現行の根拠ではない**(履歴)' };
  }
  // ③ 付け替えた試験の保存 QA(基点のコミットの保存物を git から読む —— 作業木の保存物は QA の走行で上書きされうる)
  const Q = JSON.parse(execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:${QAF}`, { maxBuffer: 64 << 20 }).toString());
  const tests = REPOINTED_TESTS.map((id) => { const t = (Q.results || []).find((z) => z.id === id);
    return t ? { id, pass: !!t.pass, ms: t.ms || 0, detail: t.detail || '' } : { id, missing: true }; });
  const htmlSha = sha256(fs.readFileSync(HTML));
  const fx = {
    fixtureVersion: FIXTURE_VERSION,
    wave: '第287便b', ruling: '原仮定者の裁定(第77報)AN62',
    frozen: true,
    note: '退役 1 本(🪤)と 🧶 の旧則(f≈2)の凍結資産(書き換えない)。退役の本は BUILTIN_PRESETS から消していない(旧セーブ・旧 URL・履歴の正本の参照が残る)。'
      + '履歴の値は基点の保存 QA の転記であって測り直していない。',
    source: { file: path.relative(ROOT, HTML), sha256: htmlSha, note: '第287便b の html(退役の宣言と 🧶 の f=1 を入れた後)' },
    base: { rev: BASE_REV, commit: baseCommit, file: 'beta/index.html', sha256: sha256(fs.readFileSync(basePath)) },
    ids: RETIRED_IDS,
    presets,
    superseded,
    history: {
      qa: { file: QAF, rev: BASE_REV, commit: Q.commit || null, date: Q.date || null, targetSha256: Q.targetSha256 || null, total: Q.total || null },
      tests,
    },
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(fx, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT), bytes: fs.statSync(OUT).size, htmlSha: htmlSha.slice(0, 12),
    sigs: Object.fromEntries(RETIRED_IDS.map((id) => [id, presets[id].presetSigHash + (presets[id].base.sigSame ? '' : '(基点 ' + presets[id].base.presetSigHash + ')')])),
    superseded: Object.fromEntries(SUPERSEDED_IDS.map((id) => [id, superseded[id].presetSigHash + ' → ' + superseded[id].presetSigHashNow])),
    tests: tests.map((t) => t.id + ':' + t.pass) }));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

// 第288便b(原仮定者の裁定(第78報)④・統括の検証項目 R114「現実較正の一本化」):
// **退役 10 本の凍結の写しと、在位移行 10 本の旧宣言の凍結の写しを 1 度だけ作る器**(第287便b の tests/exp-w287b-retiredfx.mjs と同じ流儀 ——
// 対象の本・基点・出力の名前と、対の差・旧宣言の欄が違う)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 退役 10 本(移行表 tests/data-w288b-unify.json の action:"retire")の**内蔵定義そのもの**と presetSigHash・presetSig の sha256 を
//      **この便の html** から凍結する。基点(`--base-rev`・既定 940dba52)の署名も並べる(退役は familyRole だけを動かす —— 署名は基点と同じ)。
//      **対の差**(pairDiff): 後継(kF0 側)と D₀・q・frameWeight・physics の他の鍵・bodies(m・位置・速度・spin・半径・dragQ・core)の差を残す
//      (第275便a の時点で「k だけが違う対」は 0 組 —— 片側を消しても実験の残りにはならないので、差そのものを写しに残す)。
//   ② 在位移行 10 本(action:"migrate")の**基点の宣言**(geoPN=2・kFrame=1 —— ⏰ は f≈2・kFrame=1)を `superseded` に凍結する(tests/fixtures/dfmcal-w288b.json)。
//      **現行の根拠ではない**(履歴)。移行後の宣言との差の鍵も並べる。
//   ③ **付け替えた試験の最後の保存 QA の値**(基点の tests/out/qa-results-full-beta.json の転記 —— 測り直さない)。
//
// ■ しないこと: 判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w288b-retiredfx.mjs [--html beta/index.html] [--base-rev 940dba52] [--force]
// 出力: tests/fixtures/retired-w288b.json・tests/fixtures/dfmcal-w288b.json
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
const BASE_REV = arg('--base-rev', '940dba52');
const FORCE = argv.includes('--force');
const OUT_R = path.join(ROOT, 'tests', 'fixtures', 'retired-w288b.json');
const OUT_D = path.join(ROOT, 'tests', 'fixtures', 'dfmcal-w288b.json');
const QAF = 'tests/out/qa-results-full-beta.json';
const TABLE = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'data-w288b-unify.json'), 'utf8'));

export const FIXTURE_VERSION = 'w288b-retired-1';
export const RETIRED_IDS = TABLE.rows.filter((z) => z.action === 'retire').map((z) => z.id);
export const MIGRATED_IDS = TABLE.rows.filter((z) => z.action === 'migrate').map((z) => z.id);
/** 付け替えた試験(旧宣言〔kFrame=1〕の本を読んでいた試験)—— 基点の保存 QA の値を転記する */
export const REPOINTED_TESTS = (arg('--repointed', '') || '').split(',').filter(Boolean);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
if ((fs.existsSync(OUT_R) || fs.existsSync(OUT_D)) && !FORCE) {
  console.error('fixture は凍結済み(書き換えない) —— 作り直すときだけ --force');
  process.exit(1);
}
const BODY_KEYS = ['type', 'm', 'radius', 'x', 'y', 'vx', 'vy', 'spin', 'pinned', 'dragQ', 'n', 'mMin', 'mMax', 'rIn', 'rOut'];
function pairDiff(a, b) {
  const diff = {};
  const keys = [...new Set(Object.keys(a.physics || {}).concat(Object.keys(b.physics || {})))].sort();
  for (const k of keys) { const x = (a.physics || {})[k], y = (b.physics || {})[k];
    if (JSON.stringify(x) !== JSON.stringify(y)) diff['physics.' + k] = [x === undefined ? null : x, y === undefined ? null : y]; }
  const ba = a.bodies || [], bb = b.bodies || [];
  if (ba.length !== bb.length) diff['bodies.length'] = [ba.length, bb.length];
  for (let i = 0; i < Math.min(ba.length, bb.length); i++) {
    for (const k of BODY_KEYS) { const x = ba[i][k], y = bb[i][k];
      if (JSON.stringify(x) !== JSON.stringify(y)) diff[`bodies[${i}].${k}`] = [x === undefined ? null : x, y === undefined ? null : y]; }
    const ca = !!ba[i].core, cb = !!bb[i].core; if (ca !== cb || JSON.stringify(ba[i].core) !== JSON.stringify(bb[i].core)) diff[`bodies[${i}].core`] = [ba[i].core || null, bb[i].core || null];
  }
  const mcA = a.massCalibration || null, mcB = b.massCalibration || null;
  if (JSON.stringify(mcA && { law: mcA.law, f: mcA.f ?? mcA.factor ?? mcA.factorUniform }) !== JSON.stringify(mcB && { law: mcB.law, f: mcB.f ?? mcB.factor ?? mcB.factorUniform }))
    diff.massCalibration = [mcA ? { law: mcA.law || null, f: mcA.f ?? mcA.factor ?? mcA.factorUniform ?? null } : null, mcB ? { law: mcB.law || null, f: mcB.f ?? mcB.factor ?? mcB.factorUniform ?? null } : null];
  const ks = Object.keys(diff);
  const kOnly = ks.length > 0 && ks.every((k) => k === 'physics.kFrame' || k === 'physics.geoPN');
  return { diff, n: ks.length, kOnly,
    named: { D0: diff['physics.D0'] || null, q: diff['physics.q'] || null, frameWeight: diff['physics.frameWeight'] || null,
      bodies: ks.filter((k) => k.startsWith('bodies')).length } };
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w288b-fx-'));
try {
  const baseCommit = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${BASE_REV}`, { stdio: 'pipe' }).toString().trim();
  const basePath = path.join(tmp, 'base.html');
  fs.writeFileSync(basePath, execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const Hn = loadHtmlHeadless(HTML), Hb = loadHtmlHeadless(basePath);
  const Bn = Hn.evalExpr('BUILTIN_PRESETS'), Bb = Hb.evalExpr('BUILTIN_PRESETS');
  const sigN = Hn.evalExpr('presetSig'), hashN = Hn.evalExpr('presetSigHash');
  const sigB = Hb.evalExpr('presetSig'), hashB = Hb.evalExpr('presetSigHash');
  const htmlSha = sha256(fs.readFileSync(HTML));
  // ① 退役
  const presets = {};
  for (const row of TABLE.rows.filter((z) => z.action === 'retire')) {
    const id = row.id;
    const p = Bn.find((q) => q.id === id), pb = Bb.find((q) => q.id === id);
    if (!p || !pb) throw new Error('html に ' + id + ' が無い');
    if (p.familyRole !== 'retired') throw new Error(id + ' が familyRole:"retired" でない');
    const s = row.successor ? Bn.find((q) => q.id === row.successor) : null;
    presets[id] = { emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRole: p.familyRole,
      familyRoleAtBase: pb.familyRole || null, group: p.group, groupAtBase: pb.group, sampleClass: p.sampleClass || null,
      presetSigHash: hashN(p), presetSigSha256: sha256(sigN(p)),
      base: { rev: BASE_REV, presetSigHash: hashB(pb), name: pb.name, sigSame: sigN(p) === sigB(pb) },
      successor: row.successor, reason: row.reason,
      pairDiff: s ? Object.assign({ successor: s.id, successorEmoji: s.emoji || '' }, pairDiff(p, s)) : null,
      raw: JSON.parse(JSON.stringify(p)) };
  }
  // ② 在位移行の旧宣言
  const superseded = {};
  for (const row of TABLE.rows.filter((z) => z.action === 'migrate')) {
    const id = row.id;
    const pb = Bb.find((q) => q.id === id), pn = Bn.find((q) => q.id === id);
    superseded[id] = { emoji: pb.emoji, nameAtBase: pb.name, nameNow: pn ? pn.name : null, rev: BASE_REV,
      presetSigHash: hashB(pb), presetSigSha256: sha256(sigB(pb)), presetSigHashNow: pn ? hashN(pn) : null,
      declBefore: row.before, declAfter: row.after,
      diffToNow: pn ? pairDiff(pb, pn) : null,
      massCalibration: pb.massCalibration || null, obsCardRows: (pb.obsCard || []).map((r) => r.q),
      abBodyAtBase: pb.abBody || null,
      raw: JSON.parse(JSON.stringify(pb)),
      why: '原仮定者の裁定(第78報)④: 旧宣言(geoPN=2・kFrame=1 —— ⏰ は geoPN=0・kFrame=1・f≈2 の較正質量の複製)。kFrame=1 は q を使った引きずりの近似という扱い(較正母集団の外)。**現行の根拠ではない**(履歴)' };
  }
  // ③ 付け替えた試験の保存 QA
  let Q = null;
  try { Q = JSON.parse(execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:${QAF}`, { maxBuffer: 64 << 20 }).toString()); } catch (e) { Q = null; }
  const tests = REPOINTED_TESTS.map((tid) => { const t = Q ? (Q.results || []).find((z) => z.id === tid) : null;
    return t ? { id: tid, pass: !!t.pass, ms: t.ms || 0, detail: t.detail || '' } : { id: tid, missing: true }; });
  const common = {
    wave: '第288便b', ruling: '原仮定者の裁定(第78報)④・統括の検証項目 R114', frozen: true,
    table: { file: 'tests/data-w288b-unify.json', version: TABLE.version },
    source: { file: path.relative(ROOT, HTML), sha256: htmlSha, note: '第288便b の html(退役の宣言と在位移行を入れた後)' },
    base: { rev: BASE_REV, commit: baseCommit, file: 'beta/index.html', sha256: sha256(fs.readFileSync(basePath)) },
    history: { qa: Q ? { file: QAF, rev: BASE_REV, commit: Q.commit || null, date: Q.date || null, targetSha256: Q.targetSha256 || null, total: Q.total || null } : null, tests },
  };
  const fxR = Object.assign({ fixtureVersion: FIXTURE_VERSION,
    note: '退役 10 本(現実較正の一本化 —— DFM 側 7 本・🧿・🧲・🎻)の凍結資産(書き換えない)。退役の本は BUILTIN_PRESETS から消していない(旧セーブ・旧 URL・履歴の正本の参照が残る)。'
      + 'pairDiff は後継(kF0 側)との宣言の差 —— 「k だけが違う対」は 0 組(kOnly:false)。**精度を理由にした廃止ではない**(現実較正の合を目指す系統を 1 本にする裁定)。',
    ids: RETIRED_IDS, presets, kOnlyPairs: Object.values(presets).filter((z) => z.pairDiff && z.pairDiff.kOnly).length }, common);
  const fxD = Object.assign({ fixtureVersion: 'w288b-dfmcal-1',
    note: '在位移行 10 本の旧宣言(基点 ' + BASE_REV + ')の凍結資産(書き換えない)。移行後の宣言は内蔵(ID は不変)。9 本は geoPN・kFrame の 2 値だけ、⏰ は質量(f≈2 → f=1)・コア・spinDipole の ω・kFrame が変わった(diffToNow)。',
    ids: MIGRATED_IDS, superseded }, common);
  fs.mkdirSync(path.dirname(OUT_R), { recursive: true });
  fs.writeFileSync(OUT_R, JSON.stringify(fxR, null, 1) + '\n');
  fs.writeFileSync(OUT_D, JSON.stringify(fxD, null, 1) + '\n');
  console.log(JSON.stringify({ out: [path.relative(ROOT, OUT_R), path.relative(ROOT, OUT_D)], bytes: [fs.statSync(OUT_R).size, fs.statSync(OUT_D).size], htmlSha: htmlSha.slice(0, 12),
    retired: Object.fromEntries(RETIRED_IDS.map((id) => [id, presets[id].presetSigHash + (presets[id].base.sigSame ? '' : '(基点 ' + presets[id].base.presetSigHash + ')') + ' 対の差 ' + (presets[id].pairDiff ? presets[id].pairDiff.n : '—')])),
    kOnlyPairs: fxR.kOnlyPairs,
    migrated: Object.fromEntries(MIGRATED_IDS.map((id) => [id, superseded[id].presetSigHash + ' → ' + superseded[id].presetSigHashNow + ' 差 ' + Object.keys(superseded[id].diffToNow.diff).join('・')])),
    tests: tests.map((t) => t.id + ':' + (t.missing ? 'missing' : t.pass)) }, null, 1));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

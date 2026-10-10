// 第298便b(原仮定者の裁定(第88報)「未フィットの慣性決定力版 3 本・geoPN=0 の古い 4 本・geoPN=1 の earthMoonDiagOne を廃止」・統括の検証項目 R166):
// **退役 8 本の凍結の写しを 1 度だけ作る器**(第291便b の tests/exp-w291b-retiredfx.mjs と同じ流儀 —— 対象の本・基点・出力の名前が違う)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 退役の本(下の RETIRE)の**内蔵定義そのもの**と presetSigHash・presetSig の sha256 を**この便の html** から凍結する。
//      基点(`--base-rev`・既定 581ad5d)の署名も並べる(退役は familyRole だけを動かす —— 署名は基点と同じ)。
//      継続先(RETIRED_PRESETS の see の先頭)との**対の差**(pairDiff —— physics・bodies・massCalibration)を残す。
//   ② **宣言を動かした本の前後**(declChanges): 基点と現行の BUILTIN_PRESETS を全本比べ、sampleClass・familyId・familyRole・
//      obsCard の行数が違う本を列挙する(🌘 の f=1 再フィットは obsCard の行の文だけ —— 行数が変わったときだけ載る)。
//
// ■ しないこと: 判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w298b-retiredfx.mjs [--html beta/index.html] [--base-rev 581ad5d] [--force]
// 出力: tests/fixtures/retired-w298b.json(W298B_FX_OUT で出力先を変える —— 試走は凍結の写しを書かない)
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
const BASE_REV = arg('--base-rev', '581ad5d');
const FORCE = argv.includes('--force');
const OUT_R = process.env.W298B_FX_OUT ? path.resolve(process.env.W298B_FX_OUT) : path.join(ROOT, 'tests', 'fixtures', 'retired-w298b.json');
const QAF = 'tests/out/qa-results-full-beta.json';

export const FIXTURE_VERSION = 'w298b-retired-1';
/** 退役 8 本(原仮定者の裁定(第88報))—— successor は「代わりに見る本」(RETIRED_PRESETS の see の先頭 —— 対の差を取る相手)。理由は RETIRED_PRESETS の ja と同じ趣旨 */
export const RETIRE = [
  { id: 'mercurySunInertial', successor: 'mercurySunInertialFit', reason: '未フィットの慣性決定力版(係数の移送だけ)—— 継続は gain を近点率へフィットした 🟫' },
  { id: 'earthMoonSunInertial', successor: 'earthMoonSunInertialFit', reason: '未フィットの慣性決定力版(係数の移送だけ)—— 継続は再現作業の 🌥️ と機構判別の 🔆' },
  { id: 'plutoCharonInertial', successor: 'plutoCharonInertialFit', reason: '未フィットの慣性決定力版(係数の移送だけ)—— 継続は gain を公転周期へフィットした 🟪' },
  { id: 'earthMoon', successor: 'earthMoonReal', reason: 'geoPN=0 の古い展示(地球を固定した kFrame=1 の玩具)—— 入口は 🌙 と 🌛' },
  { id: 'earthMoonFree', successor: 'earthMoonReal', reason: 'geoPN=0 の古い自由二体(kFrame=0 の対照)—— 二体ニュートンの地球と月は 🌙' },
  { id: 'saturn', successor: 'saturnRingReal', reason: 'geoPN=0 の古い環の実験 —— 土星の環は 💍・近点移動の照合は 📡' },
  { id: 'saturnLayered', successor: 'saturnRingReal', reason: 'geoPN=0 の古い環の実験(主星 2 層の変種)—— 土星の環は 💍' },
  { id: 'earthMoonDiagOne', successor: 'earthMoonReal', reason: 'geoPN=1 の不要な診断コピー(表裏核への経路の置換)—— 入口は 🌙・機構実験は 🌘' },
];
export const RETIRED_IDS = RETIRE.map((z) => z.id);
export const REPOINTED_TESTS = (arg('--repointed', '') || '').split(',').filter(Boolean);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
if (fs.existsSync(OUT_R) && !FORCE) {
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
  return { diff, n: ks.length, named: { D0: diff['physics.D0'] || null, q: diff['physics.q'] || null, bodies: ks.filter((k) => k.startsWith('bodies')).length } };
}
const DECL_KEYS = ['sampleClass', 'familyId', 'familyRole'];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w298b-fx-'));
try {
  const baseCommit = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${BASE_REV}`, { stdio: 'pipe' }).toString().trim();
  const basePath = path.join(tmp, 'base.html');
  fs.writeFileSync(basePath, execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const Hn = loadHtmlHeadless(HTML), Hb = loadHtmlHeadless(basePath);
  const Bn = Hn.evalExpr('BUILTIN_PRESETS'), Bb = Hb.evalExpr('BUILTIN_PRESETS');
  const sigN = Hn.evalExpr('presetSig'), hashN = Hn.evalExpr('presetSigHash');
  const sigB = Hb.evalExpr('presetSig'), hashB = Hb.evalExpr('presetSigHash');
  const RPn = Hn.evalExpr('RETIRED_PRESETS');
  const htmlSha = sha256(fs.readFileSync(HTML));
  // ① 退役
  const presets = {};
  for (const row of RETIRE) {
    const id = row.id;
    const p = Bn.find((q) => q.id === id), pb = Bb.find((q) => q.id === id);
    if (!p || !pb) throw new Error('html に ' + id + ' が無い');
    if (p.familyRole !== 'retired') throw new Error(id + ' が familyRole:"retired" でない');
    if (!RPn[id]) throw new Error(id + ' の理由が RETIRED_PRESETS に無い');
    const s = row.successor ? Bn.find((q) => q.id === row.successor) : null;
    presets[id] = { emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRole: p.familyRole,
      familyRoleAtBase: pb.familyRole || null, group: p.group, groupAtBase: pb.group, sampleClass: p.sampleClass || null,
      presetSigHash: hashN(p), presetSigSha256: sha256(sigN(p)),
      base: { rev: BASE_REV, presetSigHash: hashB(pb), name: pb.name, sigSame: sigN(p) === sigB(pb) },
      successor: row.successor, reason: row.reason, retiredNotice: { ja: RPn[id].ja, en: RPn[id].en, see: RPn[id].see },
      pairDiff: s ? Object.assign({ successor: s.id, successorEmoji: s.emoji || '' }, pairDiff(p, s)) : null,
      raw: JSON.parse(JSON.stringify(p)) };
  }
  // ② 宣言を動かした本の前後(全本を比べる —— 手で並べない)
  const declChanges = [];
  for (const p of Bn) {
    const pb = Bb.find((q) => q.id === p.id);
    if (!pb) { declChanges.push({ id: p.id, emoji: p.emoji || '', added: true }); continue; }
    const ch = {};
    for (const k of DECL_KEYS) if ((p[k] || null) !== (pb[k] || null)) ch[k] = [pb[k] || null, p[k] || null];
    const ocN = (p.obsCard || []).length, ocB = (pb.obsCard || []).length;
    if (ocN !== ocB) ch.obsCardRows = [ocB, ocN];
    if (Object.keys(ch).length) declChanges.push({ id: p.id, emoji: p.emoji || '', change: ch, presetSigSame: sigN(p) === sigB(pb),
      presetSigHash: hashN(p), physicsSame: JSON.stringify(p.physics || null) === JSON.stringify(pb.physics || null),
      bodiesSame: JSON.stringify(p.bodies || null) === JSON.stringify(pb.bodies || null),
      ...(ocN !== ocB ? { obsCardAdded: (p.obsCard || []).slice(ocB).map((r) => ({ q: r.q, model: r.model, obs: r.obs })) } : {}) });
  }
  // ③ 付け替えた試験の保存 QA
  let Q = null;
  try { Q = JSON.parse(execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:${QAF}`, { maxBuffer: 64 << 20 }).toString()); } catch (e) { Q = null; }
  const tests = REPOINTED_TESTS.map((tid) => { const t = Q ? (Q.results || []).find((z) => z.id === tid) : null;
    return t ? { id: tid, pass: !!t.pass, ms: t.ms || 0, detail: t.detail || '' } : { id: tid, missing: true }; });
  const fx = { fixtureVersion: FIXTURE_VERSION,
    note: '退役 8 本(🟤🌤️🟣🌍🌕🪐🎯🌓 —— 原仮定者の裁定(第88報))の凍結資産(書き換えない)。退役の本は BUILTIN_PRESETS から消していない'
      + '(旧セーブ・旧 URL・履歴の正本・派生本 🟫🟪🌥️ の fitRecord.parent の参照が残る)。declChanges は基点と現行の宣言(sampleClass・familyId・familyRole・obsCard の行数)の差。'
      + 'presetSig は基点と同じ(宣言の欄は署名の外)。8 本はどれも sampleClass が calibration でない —— 較正母集団(calibration ∧ 退役でない)の数は変わらない。',
    ids: RETIRED_IDS, presets, declChanges,
    wave: '第298便b', ruling: '原仮定者の裁定(第88報)・統括の検証項目 R166', frozen: true,
    source: { file: path.relative(ROOT, HTML), sha256: htmlSha, note: '第298便b の html(8 本の退役の宣言を入れた後)' },
    base: { rev: BASE_REV, commit: baseCommit, file: 'beta/index.html', sha256: sha256(fs.readFileSync(basePath)) },
    history: { qa: Q ? { file: QAF, rev: BASE_REV, commit: Q.commit || null, date: Q.date || null, targetSha256: Q.targetSha256 || null, total: Q.total || null } : null, tests } };
  fs.mkdirSync(path.dirname(OUT_R), { recursive: true });
  fs.writeFileSync(OUT_R, JSON.stringify(fx, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT_R), bytes: fs.statSync(OUT_R).size, htmlSha: htmlSha.slice(0, 12),
    retired: Object.fromEntries(RETIRED_IDS.map((id) => [id, presets[id].presetSigHash + (presets[id].base.sigSame ? '' : '(基点 ' + presets[id].base.presetSigHash + ')') + ' 対の差 ' + (presets[id].pairDiff ? presets[id].pairDiff.n : '—')])),
    declChanges: declChanges.map((z) => z.id + ':' + Object.keys(z.change || { added: 1 }).join('・') + (z.presetSigSame === false ? '(署名差)' : '')),
    tests: tests.map((t) => t.id + ':' + (t.missing ? 'missing' : t.pass)) }, null, 1));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

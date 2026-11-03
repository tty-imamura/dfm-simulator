// 第325便c(原仮定者の回答(2026-11-03 —— AN525)・原仮定者の指示(第127報)「旧方式のgeoPN=4サンプルは、新方式で刷新するか、廃止する」・統括の検証項目 R286):
// **退役 5 本(在位の旧方式の geoPN=4 —— 旧 W_bg 則の連鎖の玩具 🔗🔩🪛🍥🧨)の凍結の写しを 1 度だけ作る器**(第300便m の tests/exp-w300m-retiredfx.mjs と同じ流儀 ——
// 対象の本・基点・出力の名前が違う・較正母集団の欄は無い〔5 本は原理の本 —— 母集団の外〕)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 退役の本(下の RETIRE)の**内蔵定義そのもの**と presetSigHash・presetSig の sha256 を**この便の html** から凍結する。
//      基点(`--base-rev`・既定 82aa277)の署名も並べる(退役は familyRole だけを動かす —— 署名は基点と同じ)。
//      代わりに見る本(RETIRED_PRESETS の see の先頭)との**対の差**(pairDiff —— physics・bodies)を残す。
//   ② **過去の正本**(evidence): 5 本の SAMPLE_STATUS の原稿の根拠の正本の基点の sha256(履歴 —— 書き換えない)と、
//      REGEN_SCOPE の presets で 5 本を名指しする段(現行の表の段 —— 退役の後も宣言は残る〔本の宣言は不変〕)。
//   ③ **宣言を動かした本の前後**(declChanges): 基点と現行の BUILTIN_PRESETS を全本比べ、sampleClass・familyId・familyRole・
//      obsCard の行数が違う本と、基点に無い本を列挙する。
//
// ■ しないこと: 判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w325c-retiredfx.mjs [--html beta/index.html] [--base-rev 82aa277] [--force]
// 出力: tests/fixtures/retired-w325c.json(W325C_FX_OUT で出力先を変える —— 試走は凍結の写しを書かない)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { REGEN_STEPS } from './lib-w281a-regentable.mjs';
import { readDeclaredScope } from './lib-w281a-scope.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const HTML = path.resolve(ROOT, arg('--html', 'beta/index.html'));
const BASE_REV = arg('--base-rev', '82aa277');
const FORCE = argv.includes('--force');
const OUT_R = process.env.W325C_FX_OUT ? path.resolve(process.env.W325C_FX_OUT) : path.join(ROOT, 'tests', 'fixtures', 'retired-w325c.json');

export const FIXTURE_VERSION = 'w325c-retired-1';
const SRC = 'tests/data-w279a-samplestatus-src.json';
/** 退役 5 本 —— successor は「代わりに見る本」(RETIRED_PRESETS の see の先頭 —— 対の差を取る相手)。理由は RETIRED_PRESETS の ja と同じ趣旨 */
export const RETIRE = [
  { id: 'chainDiskToy', successor: 'inertialDragPair', reason: '旧方式の geoPN=4(旧 W_bg 則の連鎖 —— 二次元の円盤)—— 新しい geoPN=4(場の API の opt-in)の本は新しい ID で作る' },
  { id: 'chainDiskToy3d', successor: 'inertialDragPair', reason: '旧方式の geoPN=4(旧 W_bg 則の連鎖 —— 🔗 の三次元の写し・回転引きずり)—— 同上' },
  { id: 'chainDiskToy3dTilt', successor: 'inertialDragPair', reason: '旧方式の geoPN=4(旧 W_bg 則の連鎖 —— 軸 30°・軸引きずり)—— 同上' },
  { id: 'chainSpreadToy3d', successor: 'inertialDragPair', reason: '旧方式の geoPN=4(旧 W_bg 則の連鎖 —— 広げた円盤・安定の条件 8 項目・近似多粒子の天体型)—— 同上' },
  { id: 'chainBurstShell3d', successor: 'supernovaCore', reason: '旧方式の geoPN=4(旧 W_bg 則の連鎖 —— 殻の放出・超新星のアナロジーの探索の写し)—— 同上' },
];
export const RETIRED_IDS = RETIRE.map((z) => z.id);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
if (fs.existsSync(OUT_R) && !FORCE) {
  console.error('fixture は凍結済み(書き換えない) —— 作り直すときだけ --force');
  process.exit(1);
}
const BODY_KEYS = ['type', 'm', 'radius', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'pinned', 'n', 'mMin', 'mMax'];
function pairDiff(a, b) {
  const diff = {};
  const keys = [...new Set(Object.keys(a.physics || {}).concat(Object.keys(b.physics || {})))].sort();
  for (const k of keys) { const x = (a.physics || {})[k], y = (b.physics || {})[k];
    if (JSON.stringify(x) !== JSON.stringify(y)) diff['physics.' + k] = [x === undefined ? null : x, y === undefined ? null : y]; }
  const ba = a.bodies || [], bb = b.bodies || [];
  if (ba.length !== bb.length) diff['bodies.length'] = [ba.length, bb.length];
  for (let i = 0; i < Math.min(ba.length, bb.length); i++) for (const k of BODY_KEYS) { const x = ba[i][k], y = bb[i][k];
    if (JSON.stringify(x) !== JSON.stringify(y)) diff[`bodies[${i}].${k}`] = [x === undefined ? null : x, y === undefined ? null : y]; }
  return { n: Object.keys(diff).length, keys: Object.keys(diff) };
}
const DECL_KEYS = ['sampleClass', 'familyId', 'familyRole'];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w325c-fx-'));
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
  const srcRows = JSON.parse(execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:${SRC}`, { maxBuffer: 64 << 20 }).toString()).rows;
  // REGEN_SCOPE の presets で名指しする段(現行の表 —— 器の宣言を読む)
  const stageOf = {};
  for (const st of REGEN_STEPS) {
    if (st.role === 'history') continue;
    const m = String(st.cmd || '').match(/tests\/exp-[\w-]+\.mjs/);
    const decl = m && fs.existsSync(path.join(ROOT, m[0])) ? readDeclaredScope(fs.readFileSync(path.join(ROOT, m[0]), 'utf8')) : null;
    if (!decl || !Array.isArray(decl.presets)) continue;
    for (const id of RETIRED_IDS) if (decl.presets.includes(id)) (stageOf[id] = stageOf[id] || []).push(st.key);
  }
  // ① 退役
  const presets = {};
  for (const row of RETIRE) {
    const id = row.id;
    const p = Bn.find((q) => q.id === id), pb = Bb.find((q) => q.id === id);
    if (!p || !pb) throw new Error('html に ' + id + ' が無い');
    if (p.familyRole !== 'retired') throw new Error(id + ' が familyRole:"retired" でない');
    if (!RPn[id]) throw new Error(id + ' の理由が RETIRED_PRESETS に無い');
    const s = row.successor ? Bn.find((q) => q.id === row.successor) : null;
    const ev = ((srcRows[id] || {}).evidence || []).filter((f) => f.startsWith('tests/out/'));
    const evidence = ev.map((f) => { let sh = null; try { sh = sha256(execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:${f}`, { maxBuffer: 256 << 20 })); } catch (e) { sh = null; } return { file: f, rev: BASE_REV, sha256: sh }; });
    presets[id] = { emoji: p.emoji || '', name: p.name, familyId: p.familyId || null, familyRole: p.familyRole,
      familyRoleAtBase: pb.familyRole || null, group: p.group, groupAtBase: pb.group, sampleClass: p.sampleClass || null,
      geoPN: (p.physics || {}).geoPN, coord: (p.physics || {}).coord || '2d', relativeDrag: JSON.parse(JSON.stringify((p.physics || {}).relativeDrag || null)),
      presetSigHash: hashN(p), presetSigSha256: sha256(sigN(p)),
      base: { rev: BASE_REV, presetSigHash: hashB(pb), name: pb.name, sigSame: sigN(p) === sigB(pb), physicsSame: JSON.stringify(p.physics) === JSON.stringify(pb.physics), bodiesSame: JSON.stringify(p.bodies) === JSON.stringify(pb.bodies) },
      successor: row.successor, reason: row.reason, retiredNotice: { ja: RPn[id].ja, en: RPn[id].en, see: RPn[id].see },
      pairDiff: s ? Object.assign({ successor: s.id, successorEmoji: s.emoji || '' }, pairDiff(p, s)) : null,
      statusAtBase: srcRows[id] || null, evidence, stages: (stageOf[id] || []).sort(),
      raw: JSON.parse(JSON.stringify(p)) };
  }
  // ③ 宣言を動かした本の前後(全本を比べる —— 手で並べない)
  const declChanges = [];
  for (const p of Bn) {
    const pb = Bb.find((q) => q.id === p.id);
    if (!pb) { declChanges.push({ id: p.id, emoji: p.emoji || '', added: true }); continue; }
    const ch = {};
    for (const k of DECL_KEYS) if ((p[k] || null) !== (pb[k] || null)) ch[k] = [pb[k] || null, p[k] || null];
    const ocN = (p.obsCard || []).length, ocB = (pb.obsCard || []).length;
    if (ocN !== ocB) ch.obsCardRows = [ocB, ocN];
    if (Object.keys(ch).length) declChanges.push({ id: p.id, emoji: p.emoji || '', change: ch, presetSigSame: sigN(p) === sigB(pb), presetSigHash: hashN(p),
      physicsSame: JSON.stringify(p.physics || null) === JSON.stringify(pb.physics || null), bodiesSame: JSON.stringify(p.bodies || null) === JSON.stringify(pb.bodies || null) });
  }
  const geo4 = Bn.filter((p) => (p.physics || {}).geoPN === 4);
  const fx = { fixtureVersion: FIXTURE_VERSION,
    note: '退役 5 本(在位の旧方式の geoPN=4 —— 旧 W_bg 則の連鎖の玩具 🔗🔩🪛🍥🧨。原仮定者の回答(2026-11-03 —— AN525))の凍結資産(書き換えない)。退役の本は BUILTIN_PRESETS から消していない'
      + '(旧セーブ・旧 URL・過去の正本と結果の参照が残る)。presetSig は基点と同じ(familyRole は署名の外)。5 本は原理の本(較正母集団の外)。新しい geoPN=4(場の API の opt-in)の本は新しい ID で作る。'
      + 'declChanges は基点と現行の宣言(sampleClass・familyId・familyRole・obsCard の行数)の差と新本(同じ便の他の枝の宣言を含む —— 宣言から列挙)。',
    ids: RETIRED_IDS, presets, declChanges,
    geoPN4: { builtin: geo4.length, live: geo4.filter((p) => p.familyRole !== 'retired').map((p) => p.id), retired: geo4.filter((p) => p.familyRole === 'retired').map((p) => p.id) },
    wave: '第325便c', ruling: '原仮定者の回答(2026-11-03 —— AN525)・原仮定者の指示(第127報)・統括の検証項目 R286', frozen: true,
    source: { file: path.relative(ROOT, HTML), sha256: htmlSha, note: '第325便c の枝の html(5 本の退役の宣言を入れた後)' },
    base: { rev: BASE_REV, commit: baseCommit, file: 'beta/index.html', sha256: sha256(fs.readFileSync(basePath)) } };
  fs.mkdirSync(path.dirname(OUT_R), { recursive: true });
  fs.writeFileSync(OUT_R, JSON.stringify(fx, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT_R), bytes: fs.statSync(OUT_R).size, htmlSha: htmlSha.slice(0, 12),
    retired: Object.fromEntries(RETIRED_IDS.map((id) => [id, presets[id].presetSigHash + (presets[id].base.sigSame ? '' : '(基点 ' + presets[id].base.presetSigHash + ')') + ' 段 ' + presets[id].stages.length + ' 根拠 ' + presets[id].evidence.length])),
    geoPN4: { builtin: geo4.length, live: fx.geoPN4.live.length },
    declChanges: declChanges.map((z) => z.id + ':' + Object.keys(z.change || { added: 1 }).join('・') + (z.presetSigSame === false ? '(署名差)' : '')) }, null, 1));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

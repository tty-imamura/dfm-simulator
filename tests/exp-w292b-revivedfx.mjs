// 第292便b(原仮定者の裁定(第82報)⑤「earthMoonRealKF1 を分類を変えて復活させる」・統括の検証項目 R138):
// **復活 1 本(🌘 earthMoonRealKF1)の前後の写しを 1 度だけ作る器**(第291便b の tests/exp-w291b-retiredfx.mjs と同じ流儀 ——
// 向きが逆〔退役 → 在位〕・対象の本・基点・出力の名前が違う)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 復活の本(下の REVIVE)の**分類の鍵の前後**(familyRole・sampleClass・group・referenceKind・name)と、
//      **物理の同一**(physics・bodies・qLock・claims の sha256・presetSigHash・presetSig の sha256)を、
//      基点(`--base-rev`・既定 a37a1f9)とこの便の html で並べる。物理が 1 字でも違えば止める(写しを書かない)。
//   ② 退役のまま残す本(KEEP_RETIRED —— 🧲 emAuditDFM)が html で退役のままであることと、🌘 との physics・bodies の差を鍵ごとに記す
//      (🧲 は「🌘 と同じ構成の機構判別 B」として作られた本 —— 現行の宣言では D0pull・frameWeight・初速が違う。判定しない・記すだけ)。
//   ③ **宣言を動かした本の前後**(declChanges): 基点と現行の BUILTIN_PRESETS を全本比べ、sampleClass・familyId・familyRole・
//      group・referenceKind・obsCard の行数が違う本を列挙する(手で並べない)。
//
// ■ しないこと: 判定しない。**書き換えない**(fixture は凍結 —— 既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w292b-revivedfx.mjs [--html beta/index.html] [--base-rev a37a1f9] [--force]
// 出力: tests/fixtures/revived-w292b.json
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
const BASE_REV = arg('--base-rev', 'a37a1f9');
const FORCE = argv.includes('--force');
const OUT_R = path.join(ROOT, 'tests', 'fixtures', 'revived-w292b.json');

export const FIXTURE_VERSION = 'w292b-revived-1';
/** 復活 1 本(原仮定者の裁定(第82報)⑤)—— 分類だけを変える(物理・初期状態・q・D₀・初速・claims は不変) */
export const REVIVE = [
  { id: 'earthMoonRealKF1', want: { familyRole: 'variant', sampleClass: 'principle', group: '天体の機構', referenceKind: 'phenomenological-reference' },
    reason: 'q 引きずりの機構実験(現象論の参照・旧フィット)として在位に戻す —— 較正母集団には戻さない(20 本は不変)' },
];
/** 退役のまま残す本(🌘 と同じ構成の機構判別 B の再宣言 —— 両方を在位に戻すと二重になる。宣言の差は写しの diffVsTwin に記す) */
export const KEEP_RETIRED = [{ id: 'emAuditDFM', twinOf: 'earthMoonRealKF1' }];
export const REVIVED_IDS = REVIVE.map((z) => z.id);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const shaJ = (v) => sha256(JSON.stringify(v === undefined ? null : v));
if (fs.existsSync(OUT_R) && !FORCE) {
  console.error('fixture は凍結済み(書き換えない) —— 作り直すときだけ --force');
  process.exit(1);
}
const CLS_KEYS = ['familyId', 'familyRole', 'sampleClass', 'group', 'referenceKind', 'name', 'emoji'];
const DECL_KEYS = ['sampleClass', 'familyId', 'familyRole', 'group', 'referenceKind'];
const physOf = (p) => ({ physics: shaJ(p.physics), bodies: shaJ(p.bodies), qLock: shaJ(p.qLock), claims: shaJ(p.claims),
  abBody: shaJ(p.abBody), scaleExp: shaJ(p.scaleExp) });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w292b-fx-'));
try {
  const baseCommit = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${BASE_REV}`, { stdio: 'pipe' }).toString().trim();
  const basePath = path.join(tmp, 'base.html');
  fs.writeFileSync(basePath, execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const Hn = loadHtmlHeadless(HTML), Hb = loadHtmlHeadless(basePath);
  const Bn = Hn.evalExpr('BUILTIN_PRESETS'), Bb = Hb.evalExpr('BUILTIN_PRESETS');
  const sigN = Hn.evalExpr('presetSig'), hashN = Hn.evalExpr('presetSigHash');
  const sigB = Hb.evalExpr('presetSig'), hashB = Hb.evalExpr('presetSigHash');
  const RPn = Hn.evalExpr('RETIRED_PRESETS'), RPb = Hb.evalExpr('RETIRED_PRESETS');
  const htmlSha = sha256(fs.readFileSync(HTML));
  const bad = [];
  // ① 復活
  const presets = {};
  for (const row of REVIVE) {
    const id = row.id;
    const p = Bn.find((q) => q.id === id), pb = Bb.find((q) => q.id === id);
    if (!p || !pb) throw new Error('html に ' + id + ' が無い');
    for (const [k, v] of Object.entries(row.want)) if (p[k] !== v) bad.push(`${id}.${k} = ${JSON.stringify(p[k])}(期待 ${JSON.stringify(v)})`);
    if (pb.familyRole !== 'retired') bad.push(id + ' が基点で退役でない');
    if (RPn[id]) bad.push(id + ' の行が RETIRED_PRESETS に残る');
    const phN = physOf(p), phB = physOf(pb);
    for (const k of Object.keys(phN)) if (phN[k] !== phB[k]) bad.push(`${id}.${k} の sha が基点と違う`);
    if (sigN(p) !== sigB(pb)) bad.push(id + ' の presetSig が基点と違う');
    presets[id] = { emoji: p.emoji || '',
      before: Object.fromEntries(CLS_KEYS.map((k) => [k, pb[k] === undefined ? null : pb[k]])),
      after: Object.fromEntries(CLS_KEYS.map((k) => [k, p[k] === undefined ? null : p[k]])),
      enName: { before: (pb.en || {}).name || null, after: (p.en || {}).name || null },
      obsCardRows: { before: (pb.obsCard || []).length, after: (p.obsCard || []).length },
      retiredNoticeAtBase: RPb[id] ? { ja: RPb[id].ja, en: RPb[id].en, see: RPb[id].see } : null,
      physicsSha256: phN, physicsSame: Object.keys(phN).every((k) => phN[k] === phB[k]),
      presetSigHash: hashN(p), presetSigSha256: sha256(sigN(p)),
      base: { rev: BASE_REV, presetSigHash: hashB(pb), sigSame: sigN(p) === sigB(pb) },
      reason: row.reason, raw: JSON.parse(JSON.stringify(p)) };
  }
  // ② 退役のまま
  const keepRetired = {};
  for (const row of KEEP_RETIRED) {
    const p = Bn.find((q) => q.id === row.id), t = Bn.find((q) => q.id === row.twinOf);
    if (!p || p.familyRole !== 'retired' || !RPn[row.id]) bad.push(row.id + ' が退役のままでない');
    const same = !!(p && t) && shaJ(p.physics) === shaJ(t.physics) && shaJ(p.bodies) === shaJ(t.bodies);
    const diffVsTwin = {};
    if (p && t) {
      for (const k of [...new Set(Object.keys(p.physics || {}).concat(Object.keys(t.physics || {})))].sort()) {
        const x = (p.physics || {})[k], y = (t.physics || {})[k];
        if (JSON.stringify(x) !== JSON.stringify(y)) diffVsTwin['physics.' + k] = [x === undefined ? null : x, y === undefined ? null : y]; }
      for (let i = 0; i < Math.max((p.bodies || []).length, (t.bodies || []).length); i++) {
        const a = (p.bodies || [])[i] || {}, b = (t.bodies || [])[i] || {};
        for (const k of [...new Set(Object.keys(a).concat(Object.keys(b)))].sort())
          if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) diffVsTwin[`bodies[${i}].${k}`] = [a[k] === undefined ? null : a[k], b[k] === undefined ? null : b[k]]; }
    }
    keepRetired[row.id] = { emoji: p ? p.emoji : null, familyRole: p ? p.familyRole : null, twinOf: row.twinOf, physicsBodiesSameAsTwin: same,
      diffVsTwin, presetSigHash: p ? hashN(p) : null, presetSigSameAsTwin: !!(p && t) && sigN(p) === sigN(t) };
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
    if (Object.keys(ch).length) declChanges.push({ id: p.id, emoji: p.emoji || '', change: ch, presetSigSame: sigN(p) === sigB(pb),
      presetSigHash: hashN(p), physicsSame: JSON.stringify(p.physics || null) === JSON.stringify(pb.physics || null),
      bodiesSame: JSON.stringify(p.bodies || null) === JSON.stringify(pb.bodies || null) });
  }
  const count = (B) => ({ builtin: B.length, retired: B.filter((q) => q.familyRole === 'retired').length,
    calibrationPopulation: B.filter((q) => q.sampleClass === 'calibration' && q.familyRole !== 'retired').length });
  const counts = { base: count(Bb), now: count(Bn) };
  if (counts.now.builtin !== counts.base.builtin) bad.push('内蔵の本数が変わった');
  if (counts.now.calibrationPopulation !== counts.base.calibrationPopulation) bad.push('較正母集団の本数が変わった');
  if (counts.now.retired !== counts.base.retired - REVIVE.length) bad.push('退役の本数が 1 減っていない');
  if (bad.length) { console.error('写しを書かずに止めた:\n  ' + bad.join('\n  ')); process.exit(1); }
  const fx = { fixtureVersion: FIXTURE_VERSION,
    note: '復活 1 本(🌘 earthMoonRealKF1 —— 原仮定者の裁定(第82報)⑤・統括の検証項目 R138)の前後の写し(書き換えない)。変えたのは分類の鍵'
      + '(familyRole・sampleClass・group・referenceKind)と説明文だけで、physics・bodies・qLock・claims の sha と presetSig は基点と同じ。'
      + '較正母集団(sampleClass:"calibration" ∧ familyRole≠"retired")には戻さない(本数は不変)。🧲 emAuditDFM は 🌘 と同じ構成の機構判別 B の再宣言なので退役のまま'
      + '(現行の宣言の差 —— D0pull・frameWeight・初速 —— は keepRetired.emAuditDFM.diffVsTwin)。'
      + '第288便b の退役の写し(tests/fixtures/retired-w288b.json)は履歴として不変。',
    ids: REVIVED_IDS, presets, keepRetired, declChanges, counts,
    wave: '第292便b', ruling: '原仮定者の裁定(第82報)⑤・統括の検証項目 R138', frozen: true,
    source: { file: path.relative(ROOT, HTML), sha256: htmlSha, note: '第292便b の html(🌘 の復活の宣言を入れた後)' },
    base: { rev: BASE_REV, commit: baseCommit, file: 'beta/index.html', sha256: sha256(fs.readFileSync(basePath)) } };
  fs.mkdirSync(path.dirname(OUT_R), { recursive: true });
  fs.writeFileSync(OUT_R, JSON.stringify(fx, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT_R), bytes: fs.statSync(OUT_R).size, htmlSha: htmlSha.slice(0, 12), counts,
    revived: Object.fromEntries(REVIVED_IDS.map((id) => [id, presets[id].presetSigHash + (presets[id].base.sigSame ? '(基点と同じ)' : '(署名差)')])),
    keepRetired, declChanges: declChanges.map((z) => z.id + ':' + Object.keys(z.change || { added: 1 }).join('・') + (z.presetSigSame === false ? '(署名差)' : '')) }, null, 1));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

// 第288便b(原仮定者の裁定(第78報)④・統括の検証項目 R114): **現実較正の一本化の移行表**を作る器(1 度だけ —— 表は宣言として凍結する)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w279b-headless.mjs で読む。1 步も走らせない)
//   ① 基点(`--base-rev`・既定 940dba52)の html から**機械抽出**する:
//        対象 = sampleClass:"calibration" ∧ familyRole≠"retired" ∧ 既定 physics.kFrame>0
//      (「DFM」の接尾辞では探さない —— geoPN・kFrame の宣言で抽出する。geoPN=2∧kFrame>0 の 18 本と、geoPN=0∧kFrame>0 の 🎻⏰)。
//   ② 各行に 処理(retire|migrate)・対の kF0 側(後継)・理由を**宣言**として付ける(下の DECL —— 表の外で決めない)。
//   ③ 基点の宣言(geoPN/kFrame/f/law/frameWeight/familyRole/group)と、この便の html の宣言を並べる。
//   ④ 前の 5 区分の行数は正本 tests/out/calaudit-w249.json(基点のコミットの版)の `tally` の転記。後の 5 区分は**鎖の後に統括が埋める欄**(null)。
//
// ■ しないこと: 判定しない・物理を変えない(表を書くだけ)。**表は凍結**(既存があれば --force なしでは止める)。
//
// 実行: node tests/exp-w288b-unify.mjs [--base-rev 940dba52] [--force]
// 出力: tests/data-w288b-unify.json(QA preset.unifyTable がこの表と内蔵の宣言・機械抽出の集合を照合する)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const BASE_REV = arg('--base-rev', '940dba52');
const FORCE = argv.includes('--force');
const OUT = path.join(ROOT, 'tests', 'data-w288b-unify.json');
export const UNIFY_TABLE_VERSION = 'w288b-unify-1';
/** 機械抽出の規則(表の見出しに写す) */
export const EXTRACT_RULE = 'sampleClass:"calibration" ∧ familyRole≠"retired" ∧ 既定 physics.kFrame>0(geoPN と kFrame の宣言で抽出 —— 名前の接尾辞は見ない)';
/** 処理の宣言(retire = 導線だけを外す・物理は凍結 / migrate = 在位のまま宣言を変える) */
export const DECL = {
  earthMoonRealKF1: { action: 'retire', successor: 'earthMoonReal', reason: '対のある 7 組の DFM 側(🌙↔🌘)' },
  emAuditDFM: { action: 'retire', successor: 'emAuditSolar',
    reason: '🔆 と bodies(二体/三体)・physics(kF1/kF0)が違う —— ただし 🧲 は 🌘 と物理・幾何が bit 一致の再宣言(機構判別 B は kFrame=1 の引きずりそのものが目的)で、kFrame=0 へ移すと 🌙 と同じ二体ニュートン(第284便b で ⭕ を 🌙 へ集約したのと同じ形)になり目的を失う。機構判別 C の 🔆 と 🌙 が在位' },
  mercuryRealKF1: { action: 'retire', successor: 'mercuryReal', reason: '対のある 7 組の DFM 側(☄️↔🪨)' },
  saturnRingRealKF1: { action: 'retire', successor: 'saturnRingReal', reason: '対のある 7 組の DFM 側(💍↔💿)' },
  alphaCenABDFM: { action: 'retire', successor: 'alphaCenAB', reason: '対のある 7 組の DFM 側(✨↔✴️)' },
  siriusABDFM: { action: 'retire', successor: 'siriusAB', reason: '対のある 7 組の DFM 側(🌟↔💫)' },
  psrDoubleABDFM: { action: 'retire', successor: 'psrDoubleAB', reason: '対のある 7 組の DFM 側(📻↔⚡)' },
  psrB1534DFM: { action: 'retire', successor: 'psrB1534', reason: '対のある 7 組の DFM 側(📿↔🧶)' },
  psrDoubleABSpinCal: { action: 'retire', successor: 'psrDoubleAB', reason: 'f≈2 のスピン–スピン較正候補(履歴)—— f と λ を回した比較 variant で、kFrame=0 の後継は 📻' },
  gw150914DFM: { action: 'retire', successor: 'gw150914', reason: '🎐 の DFM 版(AN80)' },
  solarInner: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  jupiterGalilean: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  venusReal: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  marsMoonsReal: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  plutoCharonReal: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  uranusReal: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  neptuneReal: { action: 'migrate', successor: null, reason: '対の無い太陽系の入口 —— 在位のまま geoPN 2→1・kFrame 1→0' },
  psrJ1757DFM: { action: 'migrate', successor: null, reason: '対の無い NS 連星(f=1)—— 在位のまま geoPN 2→1・kFrame 1→0(law "f-fixed-1" は宣言のまま)' },
  psrJ1946DFM: { action: 'migrate', successor: null, reason: '対の無い NS 連星(f=1)—— 在位のまま geoPN 2→1・kFrame 1→0(law "f-fixed-1" は宣言のまま)' },
  gw150914Merge4s: { action: 'migrate', successor: null,
    reason: 'AN80: 合体・放射の目的を持つ本 —— f=1(観測質量 = 🎐 の m・law "f-fixed-1")+kFrame 1→0(geoPN=0 は 🎐 と同じ)。周波数・開始時刻・放射モデルの再評価は次便' },
};

if (fs.existsSync(OUT) && !FORCE) {
  console.error('移行表は凍結済み(書き換えない): ' + path.relative(ROOT, OUT) + ' —— 作り直すときだけ --force');
  process.exit(1);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w288b-unify-'));
try {
  const baseCommit = execSync(`git -C ${JSON.stringify(ROOT)} rev-parse ${BASE_REV}`, { stdio: 'pipe' }).toString().trim();
  const basePath = path.join(tmp, 'base.html');
  fs.writeFileSync(basePath, execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:beta/index.html`, { maxBuffer: 64 << 20 }));
  const Hb = loadHtmlHeadless(basePath), Hn = loadHtmlHeadless(path.join(ROOT, 'beta', 'index.html'));
  const Bb = Hb.evalExpr('BUILTIN_PRESETS'), Bn = Hn.evalExpr('BUILTIN_PRESETS');
  const DPb = Hb.evalExpr('DEFAULT_PHYSICS');
  const CAL = JSON.parse(execSync(`git -C ${JSON.stringify(ROOT)} show ${BASE_REV}:tests/out/calaudit-w249.json`, { maxBuffer: 256 << 20 }).toString());
  const tallyOf = new Map((CAL.presets || []).map((z) => [z.id, z.tally]));
  const kf = (p, DP) => (p.physics && typeof p.physics.kFrame === 'number') ? p.physics.kFrame : DP.kFrame;
  const fOf = (p) => { const mc = p.massCalibration; if (!mc) return null; return mc.f ?? mc.factor ?? mc.factorUniform ?? null; };
  const declOf = (p) => ({ geoPN: p.physics.geoPN, kFrame: p.physics.kFrame, f: fOf(p), law: p.massCalibration ? (p.massCalibration.law || null) : null,
    frameWeight: p.physics.frameWeight || null, D0: p.physics.D0, q: p.physics.q, familyRole: p.familyRole || null, group: p.group || null,
    masses: (p.bodies || []).filter((b) => (b.type || 'single') === 'single').map((b) => b.m) });
  const extracted = Bb.filter((p) => p.sampleClass === 'calibration' && p.familyRole !== 'retired' && kf(p, DPb) > 0).map((p) => p.id);
  const declared = Object.keys(DECL);
  const diff = extracted.filter((x) => !declared.includes(x)).concat(declared.filter((x) => !extracted.includes(x)));
  if (diff.length) throw new Error('機械抽出と宣言の集合が違う: ' + diff.join(','));
  const rows = extracted.map((id) => {
    const pb = Bb.find((q) => q.id === id), pn = Bn.find((q) => q.id === id), d = DECL[id];
    const sb = d.successor ? Bb.find((q) => q.id === d.successor) : null;
    return { id, emoji: pb.emoji || '', action: d.action, successor: d.successor, successorEmoji: sb ? sb.emoji : null,
      reason: d.reason, before: declOf(pb), after: pn ? declOf(pn) : null,
      successorDecl: sb ? declOf(sb) : null,
      tally5Before: tallyOf.get(id) || null, tally5After: null };
  });
  const out = {
    version: UNIFY_TABLE_VERSION, wave: '第288便b', ruling: '原仮定者の裁定(第78報)④(AN80・AN81・AN82・AN83)・統括の検証項目 R114',
    frozen: true,
    rule: EXTRACT_RULE,
    says: '現実較正の合を目指す系統を 1 本にする裁定である(精度の主張ではない —— ☄️ の近日点は 5 区分で否のまま・EIH には Lense–Thirring も kFrame も無い)。'
      + '退役は導線だけを外す(presetSig・物理・保存 JSON は不変・旧セーブは読める)。在位移行は宣言(geoPN・kFrame・⏰ は f)だけを変える(ID は不変)。',
    base: { rev: BASE_REV, commit: baseCommit },
    counts: { extracted: extracted.length, retire: rows.filter((r) => r.action === 'retire').length, migrate: rows.filter((r) => r.action === 'migrate').length },
    tally5Source: 'tests/out/calaudit-w249.json @ ' + BASE_REV + ' の presets[].tally(合・窓・否・従・転・条)。後の欄は鎖(calaudit の再走)の後に統括が埋める',
    rows,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify({ out: path.relative(ROOT, OUT), counts: out.counts }));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

#!/usr/bin/env node
// 第316便d(原仮定者の裁定(第118報)・決断事項 AN422 ②・統括の検証項目 R249): **停止集合の版上げ(w316d-scope-5)の対照**(道具 —— html と正本は書き換えない)。
//   基点の html の写しに 1 か所だけの変更を入れた一時 html を作り、宣言した全器(tests/exp-*.mjs の REGEN_SCOPE —— 器ごとに 1 つ)の領域 hash を
//   版 4(w286d-scope-4 —— 停止集合 SCOPE_STOP_4)と版 5(現行 —— SCOPE_STOP)で引き直し、基点と違う本数を数える。
//   ① 表示の文だけ(I18N の文・PARAM_DEFS の desc・サンプルの名と説明・受理の理由の文〔validatePreset の本体〕・ヘルプ・選択粒子の編集・
//      キャンバスの描画・HUD・loadPreset の本体・表示の同期の関数)—— 版 5 で不変か・残るならどの段がなぜ残るか(内訳 parts)
//   ② 物理(質量・G_0・c_0・ソフトニング・引きずりの規則 Y_k の関数・dragCore の表の関数・S._core の写しの関数)—— 版 4 で変わる本は版 5 でも必ず変わる
//   数え方: 関数と表の変更は閉包と HP の部分の hash(scopeHash の fnTexts・hpTexts と同じ本文 —— 版 4 は SCOPE_STOP_4・版 5 は SCOPE_STOP)で全器を数える。
//   プリセットの欄の変更は、その本を名指しで宣言する器 1 本で scopeHash そのもの(版 4・版 5)を引き、変われば宣言にその本か all がある器を数える。
//   --verify で各変更に標本の器 3 本(先頭・all の最初・🟠 を宣言する最初)の scopeHash そのものとの照合を足す。
//   一時 html は os.tmpdir() に書いて消す。使い方: node tools/scope-stop-probe316.mjs --base beta/_w316_base.html --out <json> [--verify]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SC = await import(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs'));
const argOf = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const BASE = path.resolve(ROOT, argOf('--base', 'beta/index.html')), OUT = argOf('--out', null);
const base = fs.readFileSync(BASE, 'utf8');
const rows = await SC.declaredOuts(ROOT);
const decls = [...new Map(rows.map((r) => [r.harness, r.decl])).entries()];
/** 1 か所だけの置き換え(見つからない・2 か所以上なら作らない) */
const once = (t, a, b) => { const i = t.indexOf(a); if (i < 0 || t.indexOf(a, i + 1) >= 0) return null; return t.slice(0, i) + b + t.slice(i + a.length); };
/** 内蔵の本 id の宣言の中で、最初に現れる re の数の最下位桁を 1 つ動かす */
const presetNum = (t, id, re) => { const i = t.indexOf('id:"' + id + '"'); if (i < 0) return null; const j = t.indexOf('\n{ id:"', i + 5); const seg = t.slice(i, j > i ? j : undefined);
  const m = re.exec(seg); if (!m) return null; const v = m[2], last = Number(v[v.length - 1]); const v2 = v.slice(0, -1) + String(last === 9 ? 8 : last + 1);
  return t.slice(0, i + m.index) + m[1] + v2 + t.slice(i + m.index + m[0].length); };
const touch = (name) => { const r = SC.touchFunction(base, name); return r && r.ok ? r.html : null; };
export const CASES = [
  // ① 表示の文だけ
  { key: 'i18n', kind: 'text', ja: 'I18N の文(ja physLockOn に 1 字)', make: () => once(base, 'physLockOn:"✓ ロック中:', 'physLockOn:"✓ ロック中。:') },
  { key: 'paramDesc', kind: 'text', ja: 'PARAM_DEFS の desc(D₀ の説明に 1 字)', make: () => once(base, 'desc:"遠方宇宙が及ぼす決定力の底値(A5)', 'desc:"遠方宇宙が及ぼす決定力の底値(A5)。') },
  { key: 'presetName', kind: 'text', ja: 'サンプルの名(🟠 jupiterGalilean の name に 1 字)', make: () => once(base, 'name:"木星とガリレオ衛星(実単位)', 'name:"木星とガリレオ衛星(実単位)。') },
  { key: 'presetEn', kind: 'text', ja: 'サンプルの英語の名(🟠 の en.name に 1 字 —— 説明文の欄 PROSE_KEYS の en)', make: () => once(base, 'en:{name:"Jupiter & the Galilean Moons', 'en:{name:"Jupiter & the Galilean Moons.') },
  { key: 'validateReason', kind: 'text', ja: '受理の理由の文(validatePreset の本体 —— 物理側で止めない)', make: () => once(base, 'warnings.push("seedが数値でないため無視")', 'warnings.push("seedが数値でないため無視。")') },
  { key: 'renderHelp', kind: 'text', ja: 'ヘルプ(renderHelp の本体 —— 版 2 から停止)', make: () => touch('renderHelp') },
  { key: 'updateBodyEdit', kind: 'text', ja: '選択粒子の編集(updateBodyEdit の本体 —— 表示状態 be* を書くので止めない)', make: () => touch('updateBodyEdit') },
  { key: 'drawWorldInto', kind: 'text', ja: 'キャンバスの描画(drawWorldInto の本体 —— 版 5 で停止)', make: () => touch('drawWorldInto') },
  { key: 'syncHud', kind: 'text', ja: 'HUD(syncHud の本体 —— 版 5 で停止)', make: () => touch('syncHud') },
  { key: 'refreshModeDeviation', kind: 'text', ja: '表示の同期(refreshModeDeviation の本体 —— 版 5 で停止)', make: () => touch('refreshModeDeviation') },
  { key: 'loadPreset', kind: 'text', ja: 'loadPreset の本体(通知の文 —— 物理側で止めない)', make: () => touch('loadPreset') },
  // ② 物理
  { key: 'mass', kind: 'physics', ja: '質量(🟠 の最初の m の最下位桁)', make: () => presetNum(base, 'jupiterGalilean', /(\bm:\s*)(\d+\.\d*[1-9])/) },
  { key: 'G0', kind: 'physics', ja: 'G_0(🟠 の physics.G の最下位桁)', make: () => presetNum(base, 'jupiterGalilean', /(\bG:\s*)(\d+\.\d*[1-9])/) },
  { key: 'c0', kind: 'physics', ja: 'c_0(🟠 の physics.cLight の最下位桁)', make: () => presetNum(base, 'jupiterGalilean', /(\bcLight:\s*)(\d+\.?\d*[1-9])/) },
  { key: 'softening', kind: 'physics', ja: 'ソフトニング(🟠 の softening の最下位桁)', make: () => presetNum(base, 'jupiterGalilean', /(\bsoftening:\s*)(\d+\.\d*[1-9])/) },
  { key: 'invSqKappa0', kind: 'physics', ja: '引きずりの規則 Y_k(invSqKappa0 の本体)', make: () => touch('invSqKappa0') },
  { key: 'dragCoreLookup', kind: 'physics', ja: '引きずり核 dragCore(dragCoreLookup の本体)', make: () => touch('dragCoreLookup') },
  { key: 'validateDragCoreBody', kind: 'physics', ja: 'dragCore の受理(validateDragCoreBody の本体)', make: () => touch('validateDragCoreBody') },
  { key: 'makeSim', kind: 'physics', ja: '積分器を持つ sim の構築(makeSim の本体)', make: () => touch('makeSim') },
];
// 領域 hash の本文のうち閉包と HP の部分(scopeHash の fnTexts・hpTexts と同じ —— プリセット・S._core・定数の部分は版に依らないので別に数える)。
//   関数と表の文の変更は閉包の部分だけを動かす。プリセットの欄の変更は宣言にその本か "all" がある器だけを動かす(版に依らない —— 下で数える)。
const crypto = await import('node:crypto');
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const closureSha = (PT, d, stop) => { const sc = SC.normalizeScope(d), cl = SC.closureOf(PT, sc.roots, undefined, { hardStop: stop });
  const parts = {}; for (const k of cl.segIdx) { const s = PT.segments[k]; parts[s.names.length ? s.names.join(',') : '(stmt)#' + sha(s.text).slice(0, 8)] = sha(s.text); }
  for (const h of cl.hp) parts['HP.' + h.name] = sha(h.text);
  return { sha: sha(SC.canonJson(parts)), parts }; };
const parseOf = (t) => SC.parseTopLevel(t.slice(t.indexOf('<script>') + 8, t.lastIndexOf('</script>')));
const S4 = SC.SCOPE_STOP_4, S5 = SC.SCOPE_STOP, V4 = SC.SCOPE_VERSION_4, V5 = SC.SCOPE_VERSION;
const hasPreset = (d, id) => d.presets === 'all' || (Array.isArray(d.presets) && d.presets.includes(id));
const res = { version: 'w316d-scope-probe-2', base: path.relative(ROOT, BASE), decls: decls.length, scopeVersions: [V4, V5], added: SC.SCOPE_STOP_ADDED_316.slice(),
  method: '閉包と HP の部分の hash(scopeHash の fnTexts・hpTexts と同じ本文)を版 4 の停止集合 SCOPE_STOP_4 と版 5 の SCOPE_STOP で引き、基点と違う器を数える。'
    + 'プリセットの欄の変更は宣言にその本か all がある器(版に依らない)。標本の器 3 本で scopeHash そのもの(版 4・版 5)と照合する', cases: [] };
const t0 = Date.now();
const PT0 = parseOf(base);
const b4 = decls.map(([, d]) => closureSha(PT0, d, S4)), b5 = decls.map(([, d]) => closureSha(PT0, d, S5));
const PRESET_CASES = { presetName: 'jupiterGalilean', mass: 'jupiterGalilean', G0: 'jupiterGalilean', c0: 'jupiterGalilean', softening: 'jupiterGalilean' };
const PROSE_CASES = { presetEn: 'jupiterGalilean' };
for (const c of CASES) {
  const html = c.make(); const row = { key: c.key, kind: c.kind, ja: c.ja, made: !!html && html !== base };
  if (!row.made) { res.cases.push(row); console.log(c.key, '作れない'); continue; }
  const n4 = [], n5 = [], causes = {};
  if (PRESET_CASES[c.key] || PROSE_CASES[c.key]) {
    // プリセットの欄 —— その本を名指しで宣言する最初の器 1 本で scopeHash そのもの(版 4・版 5)を引き、変われば宣言にその本か all がある器を数える
    row.how = 'preset';
    const pid = PRESET_CASES[c.key] || PROSE_CASES[c.key], iP = decls.findIndex(([, d]) => Array.isArray(d.presets) && d.presets.includes(pid));
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w316d-scope-')), f = path.join(tmp, c.key + '.html'); fs.writeFileSync(f, html);
    let x4 = null, x5 = null;
    try { const d = decls[iP][1]; x4 = SC.scopeHash(BASE, d, { version: V4 }).scopeSha256 !== SC.scopeHash(f, d, { version: V4 }).scopeSha256;
      x5 = SC.scopeHash(BASE, d, { version: V5 }).scopeSha256 !== SC.scopeHash(f, d, { version: V5 }).scopeSha256; } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
    row.sample = { harness: decls[iP][0], v4: x4, v5: x5 };
    for (const [h, d] of decls) if (hasPreset(d, pid)) { if (x4) n4.push(h); if (x5) n5.push(h); }
    if (n5.length) causes['プリセット: ' + pid] = n5.length;
  } else {
    row.how = 'closure';
    const PT = parseOf(html);
    decls.forEach(([h, d], i) => { const a = closureSha(PT, d, S4), b = closureSha(PT, d, S5);
      if (a.sha !== b4[i].sha) n4.push(h);
      if (b.sha !== b5[i].sha) { n5.push(h); for (const k of new Set([...Object.keys(b.parts), ...Object.keys(b5[i].parts)])) if (b.parts[k] !== b5[i].parts[k]) causes['式: ' + k] = (causes['式: ' + k] || 0) + 1; } });
  }
  row.v4Changed = n4.length; row.v5Changed = n5.length;
  row.v5SubsetOfV4 = n5.every((h) => n4.includes(h)); row.v4SubsetOfV5 = n4.every((h) => n5.includes(h));
  row.causesV5 = Object.entries(causes).sort((x, y) => y[1] - x[1]).slice(0, 6);
  // 標本の照合(scopeHash そのもの —— 版 4・版 5。器は宣言の並びの先頭・"all" の最初・🟠 を宣言する最初)
  if (process.argv.includes('--verify')) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w316d-scope-')); const f = path.join(tmp, c.key + '.html'); fs.writeFileSync(f, html);
    try { const pick = [0, decls.findIndex(([, d]) => d.presets === 'all'), decls.findIndex(([, d]) => Array.isArray(d.presets) && d.presets.includes('jupiterGalilean'))].filter((i, j, a) => i >= 0 && a.indexOf(i) === j);
      row.verify = pick.map((i) => { const [h, d] = decls[i];
        const x4 = SC.scopeHash(BASE, d, { version: V4 }).scopeSha256 !== SC.scopeHash(f, d, { version: V4 }).scopeSha256, x5 = SC.scopeHash(BASE, d, { version: V5 }).scopeSha256 !== SC.scopeHash(f, d, { version: V5 }).scopeSha256;
        return { harness: h, v4: x4, v5: x5, same: x4 === n4.includes(h) && x5 === n5.includes(h) }; });
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  }
  res.cases.push(row);
  console.log(c.key.padEnd(22), c.kind.padEnd(8), 'v4', String(n4.length).padStart(4), 'v5', String(n5.length).padStart(4), JSON.stringify(row.causesV5.slice(0, 3)), row.verify ? JSON.stringify(row.verify.map((z) => z.same)) : '');
}
res.elapsedS = (Date.now() - t0) / 1000;
res.textUnchangedV5 = res.cases.filter((c) => c.kind === 'text' && c.made && c.v5Changed === 0).map((c) => c.key);
res.textStillV5 = res.cases.filter((c) => c.kind === 'text' && c.made && c.v5Changed > 0).map((c) => c.key + ' ' + c.v5Changed);
res.physicsKept = res.cases.filter((c) => c.kind === 'physics' && c.made).every((c) => c.v4Changed === c.v5Changed && c.v4SubsetOfV5 && c.v5SubsetOfV4 && c.v5Changed > 0);
if (OUT) fs.writeFileSync(OUT, JSON.stringify(res, null, 1) + '\n');
console.log('physicsKept', res.physicsKept, 'textUnchangedV5', res.textUnchangedV5.join(','), 'elapsedS', res.elapsedS);

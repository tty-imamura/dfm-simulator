// 第326便a(原仮定者の回答(2026-11-03 —— AN530)「ロックした方がDFMを理解し易いのでロックする。X_kのノブの本のUIの行き先はG₀にする。
//   現状の「自転と減光」グループサンプル３本は、調整が必要なので廃止する。boxcomovingは、他の「箱宇宙の実験」グループサンプルに合わせる」・統括の検証項目 R290):
//   **物理対応ロックを常にした移行の前後の凍結の写しを 1 度だけ作る器**(第325便c の tests/exp-w325c-retiredfx.mjs と同じ流儀 —— 作業物・再生成の鎖の段ではない)。
//
// ■ 何をするか(Node だけ —— html を tests/lib-w280b-emgrid.mjs で読む。子プロセスは 1 本ずつ)
//   ① 基点の html(`--base` —— 移行の前)と今の html(`--html` —— 移行の後)の両方で、基点で在位だった 125 本(満たす 56・移行した 66・退役した 3)の
//      受理の後の G_0・c_0・X_k・presetSigHash・宣言の物理の行(rawPhys —— 宣言の G・cLight・kappaT)と、読み込み(loadPreset)の後のロックのフラグと X_k、
//      600 步(本ごとの既定の刻み appStepDt)の力学の指紋(位置・速度・自転・半径・質量・内部の温度 —— 時計 τ を外す)と時計の指紋(τ)・
//      時計の遅れの最大 max_i(1 − τ_i/t)を測る(`--measure <base|now> --out <json>`)。
//   ② 2 つの測りと第325便f のデータ(tests/data-w325f-xklock.json —— 3 分類)を合わせて凍結の写し tests/fixtures/xklock-w326a.json を書く(`--merge <base.json> <now.json>`)。
//      退役の 3 本の内蔵定義そのものは tests/fixtures/retired-w326a.json(第325便c の型 —— 基点と同じ署名・代わりに見る本)。
//
// ■ しないこと: 判定しない(凍結の写しは QA lint.physLockAlways326a が読む)。**書き換えない**(既存があれば --force なしでは止める)。
//
// 実行(作業の場所は worktree の根):
//   node tests/exp-w326a-xklockfx.mjs --measure base --html beta/_w326_base.html --out <scratch>/fx-base.json
//   node tests/exp-w326a-xklockfx.mjs --measure now  --html beta/index.html      --out <scratch>/fx-now.json
//   node tests/exp-w326a-xklockfx.mjs --merge <scratch>/fx-base.json <scratch>/fx-now.json --base-rev 1b1fa70 [--force]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
export const FIXTURE_VERSION_326A = 'w326a-xklock-fx-1';
export const RETIRED_FX_VERSION_326A = 'w326a-retired-1';
export const XK_STEPS_326A = 600;
/** 退役 3 本(「自転と減光」の群の在位の全部)—— successor は RETIRED_PRESETS の see の先頭 */
export const RETIRE_326A = [
  { id: 'rotorSolo', successor: 'lfbotTrap', reason: '減光と外来光線の掃き出し(X_k)と周回のテスト粒子(G_0)の両方が用途 —— 物理対応ロックの下でどの写し方でも用途の一部が動く(調整が必要)' },
  { id: 'massLadder', successor: 'galaxy', reason: '力学質量(G_0)と減光の光度質量(X_k の井戸)の両方が用途 —— c_0 を合わせる写し方は c_0 = 30 の規約の例外が要る(調整が必要)' },
  { id: 'selfRotor', successor: 'collapse', reason: '雲の成長(G_0)と中心の暗さ(X_k の井戸と c_0 の表面の光速)の両方が用途 —— どの写し方でも用途の一部が動く(調整が必要)' },
];
export const RETIRED_IDS_326A = RETIRE_326A.map((z) => z.id);
const OUT_FX = process.env.W326A_FX_OUT ? path.resolve(process.env.W326A_FX_OUT) : path.join(ROOT, 'tests', 'fixtures', 'xklock-w326a.json');
const OUT_RET = process.env.W326A_RET_OUT ? path.resolve(process.env.W326A_RET_OUT) : path.join(ROOT, 'tests', 'fixtures', 'retired-w326a.json');

function fnv(acc, v, buf) { buf.f[0] = v; for (let b = 0; b < 8; b++) { acc ^= buf.u[b]; acc = Math.imul(acc, 0x01000193) >>> 0; } return acc; }
function snap326a(S) {
  const ab = new ArrayBuffer(8), buf = { f: new Float64Array(ab), u: new Uint8Array(ab) };
  let hd = 0x811c9dc5, ht = 0x811c9dc5;
  const n = S.n;
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'R', 'm', 'Tint']) { const A0 = S[k]; if (!A0 || typeof A0.length !== 'number') continue; for (let i = 0; i < n; i++) hd = fnv(hd, A0[i], buf); }
  hd = fnv(hd, S.t, buf);
  let dil = 0;
  if (S.tau) for (let i = 0; i < n; i++) { ht = fnv(ht, S.tau[i], buf); if (S.t > 0) dil = Math.max(dil, Math.abs(1 - S.tau[i] / S.t)); }
  return { dyn: hd.toString(16).padStart(8, '0'), clock: ht.toString(16).padStart(8, '0'), dilMax: dil, n, nan: !!S.hasNaN(), clampVN: S.clampVN || 0 };
}

async function measure(which, htmlRel, out) {
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const htmlAbs = path.resolve(ROOT, htmlRel);
  const { HP } = loadHtmlMain(htmlAbs);
  const DX = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'data-w325f-xklock.json'), 'utf8'));
  const liveAtBase = DX.books.filter((b) => !b.retired).map((b) => b.id);
  const rows = {};
  for (const id of liveAtBase) {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) { rows[id] = { missing: true }; continue; }
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    const ph = v && v.ok ? v.preset.physics : {};
    const r = { role: p.familyRole || null, sig: HP.presetSigHash(p), accept: !!(v && v.ok),
      warnX: ((v && v.warnings) || []).filter((w) => /X_k|kappaT/.test(String(w))).length,
      raw: { G: p.physics.G, cLight: p.physics.cLight, kappaT: p.physics.kappaT }, G: ph.G, c: ph.cLight, X: ph.kappaT,
      activeParams: (p.activeParams || []).slice(), abPatch: p.abBody && p.abBody.physicsPatch ? JSON.parse(JSON.stringify(p.abBody.physicsPatch)) : null };
    HP.loadPreset(id, false);
    const S = HP.sim;
    r.loaded = { X: S.params.kappaT, G: S.params.G, c: S.params.cLight, lock: !!HP.physLock() };
    const dt = globalThis.appStepDt(S);
    for (let k = 0; k < XK_STEPS_326A; k++) S.step(dt);
    r.dt = dt; r.s600 = snap326a(S);
    rows[id] = r;
  }
  const html = fs.readFileSync(htmlAbs);
  fs.writeFileSync(out, JSON.stringify({ which, html: htmlRel, htmlSha256: crypto.createHash('sha256').update(html).digest('hex'), steps: XK_STEPS_326A, rows }));
  console.log(`measure ${which}: ${Object.keys(rows).length} 本 → ${out}`);
}

function merge(fBase, fNow, baseRev, force) {
  if (!force && (fs.existsSync(OUT_FX) || fs.existsSync(OUT_RET))) { console.error('凍結の写しが既にある(--force なしでは書き換えない)'); process.exit(2); }
  const A = JSON.parse(fs.readFileSync(fBase, 'utf8')), B = JSON.parse(fs.readFileSync(fNow, 'utf8'));
  const DX = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'data-w325f-xklock.json'), 'utf8'));
  const byD = new Map(DX.books.map((b) => [b.id, b]));
  const books = {}, tally = { satisfied: 0, class1: 0, class2: 0, retired: 0, sigSameSatisfied: 0, dynSameSatisfied: 0, clockSameSatisfied: 0,
    dynSameMigrated: 0, clockSameMigrated: 0, nanNow: 0, acceptNow: 0 };
  for (const id of Object.keys(A.rows)) {
    const a = A.rows[id], b = B.rows[id], d = byD.get(id);
    const kind = RETIRED_IDS_326A.includes(id) ? 'retired' : (d.lock.ok ? 'satisfied' : (d.basis === 'keepX' ? 'class2' : 'class1'));
    tally[kind]++;
    const row = { emoji: d.emoji, group: d.group, kind, class325f: d.class, basis325f: d.basis,
      before: { G: a.G, c: a.c, X: a.X, sig: a.sig, lockAfterLoad: a.loaded.lock, dyn600: a.s600.dyn, clock600: a.s600.clock, dilMax600: a.s600.dilMax, activeParams: a.activeParams, abPatch: a.abPatch },
      after: { G: b.G, c: b.c, X: b.X, sig: b.sig, lockAfterLoad: b.loaded.lock, loadedX: b.loaded.X, dyn600: b.s600.dyn, clock600: b.s600.clock, dilMax600: b.s600.dilMax, activeParams: b.activeParams, abPatch: b.abPatch,
        accept: b.accept, warnX: b.warnX, nan: b.s600.nan, role: b.role },
      dt: b.dt, sigSame: a.sig === b.sig, dynSame: a.s600.dyn === b.s600.dyn, clockSame: a.s600.clock === b.s600.clock };
    if (b.s600.nan) tally.nanNow++;
    if (b.accept) tally.acceptNow++;
    if (kind === 'satisfied') { if (row.sigSame) tally.sigSameSatisfied++; if (row.dynSame) tally.dynSameSatisfied++; if (row.clockSame) tally.clockSameSatisfied++; }
    if (kind === 'class1' || kind === 'class2') { if (row.dynSame) tally.dynSameMigrated++; if (row.clockSame) tally.clockSameMigrated++; }
    books[id] = row;
  }
  const fx = { fixtureVersion: FIXTURE_VERSION_326A, wave: '第326便a', frozen: true,
    ruling: '原仮定者の回答(2026-11-03 —— AN530)・統括の検証項目 R290',
    note: '物理対応ロック X_k = G_0/c_0² を常にした移行の前後(基点で在位の 125 本 —— 満たす 56・分類 1〔X_k := G_0/c_0²〕59・分類 2〔G_0 := X_k c_0²〕7・退役 3)。前は基点の html・後は第326便a の html。600 步は本ごとの既定の刻み(appStepDt)・力学の指紋は位置・速度・自転・半径・質量・内部の温度と t(時計 τ を外す)・時計の指紋は τ・dilMax600 は max_i |1 − τ_i/t|。退役の 3 本は物理対応ロックの外(宣言の X_k のまま)。凍結(書き換えない)',
    source: 'tests/exp-w326a-xklockfx.mjs', base: { rev: baseRev, html: A.html, htmlSha256: A.htmlSha256 }, now: { html: B.html, htmlSha256: B.htmlSha256 },
    steps: XK_STEPS_326A, tally, books };
  fs.writeFileSync(OUT_FX, JSON.stringify(fx, null, 1) + '\n');
  const ret = { fixtureVersion: RETIRED_FX_VERSION_326A, wave: '第326便a', frozen: true,
    ruling: '原仮定者の回答(2026-11-03 —— AN530)「現状の「自転と減光」グループサンプル３本は、調整が必要なので廃止する」',
    note: '退役 3 本(在位の「自転と減光」の群の全部)の凍結資産(書き換えない)。退役の本は BUILTIN_PRESETS から消していない(旧セーブ・旧 URL・過去の正本の参照が残る)。presetSig は基点と同じ(familyRole は署名の外)。物理対応ロックの外(宣言の X_k のまま開く)。',
    ids: RETIRED_IDS_326A, base: { rev: baseRev },
    presets: Object.fromEntries(RETIRE_326A.map((z) => { const a = A.rows[z.id], b = B.rows[z.id];
      return [z.id, { emoji: byD.get(z.id).emoji, group: byD.get(z.id).group, familyRoleAtBase: a.role, familyRole: b.role, presetSigHash: b.sig, base: { presetSigHash: a.sig, sigSame: a.sig === b.sig },
        physics: { G: b.G, cLight: b.c, kappaT: b.X }, lockAfterLoad: b.loaded.lock, dyn600Same: a.s600.dyn === b.s600.dyn,
        successor: z.successor, reason: z.reason, class325f: byD.get(z.id).class, undecided325f: !!byD.get(z.id).undecided }]; })) };
  fs.writeFileSync(OUT_RET, JSON.stringify(ret, null, 1) + '\n');
  console.log(JSON.stringify(tally));
}

if (argv.includes('--measure')) await measure(arg('--measure'), arg('--html', 'beta/index.html'), arg('--out'));
else if (argv.includes('--merge')) { const i = argv.indexOf('--merge'); merge(argv[i + 1], argv[i + 2], arg('--base-rev', '1b1fa70'), argv.includes('--force')); }
else { console.error('使い方: --measure <base|now> --html <html> --out <json> / --merge <base.json> <now.json> [--base-rev 1b1fa70] [--force]'); process.exit(2); }

#!/usr/bin/env node
// 第319便c(原仮定者の指示(第121報)「時間が掛かっている再生成の段について、時間短縮を行う」・決断事項 AN454・統括の検証項目 R260): **再生成の段の短縮の対照**
//   (道具 —— html と正本は書き換えない)。同じ html の写しに、変更の種類ごとに 1 か所の変更を入れ、再生成表の段のうち**その変更で regen になる段**の数と
//   見積りの秒(tests/data-w311c-regensec.json —— 前回の鎖の実測。無い段は表の秒)を、前(基点 --base-rev の器の宣言 REGEN_SCOPE と基点の履歴の集合)と
//   後(今の器の宣言と今の履歴の集合)で数える。領域 hash は前後とも版 6(w318a-scope-6 —— 次の鎖で刻み直した後の世代の見込み)で引く。
//     ・regen: 段の正本のうち html を読むものが、領域の宣言なし(html 全体)か、変更の前後で領域 hash が違う
//     ・変更に依らない段(常時群・正本か meta が無い・html を読まない)は fixed として別に数える(前後で同じ)
//     ・recheck: regen/常時群の下流(段の after・正本の入力の書き手 —— 依存先が走った後に計画し直す)
//   変更の種類(第121報の枝 c のブリーフの 4 種 + 対照):
//     addPreset   … 内蔵の本を 1 本足す(🌀 binary の宣言の写しに新しい id —— 🗺️ の前に置く)
//     planetDecl  … 在位の惑星 1 本の宣言を変える(🌋 venusSunInertial3d の最初の m の最下位桁)
//     stepMaint   … 步の関数を変える(軸を保つ維持の型の 1 步の帳簿 inertialDrag3MaintCell の本体の先頭に無害な文)
//     engineCoef  … 步の関数の係数を変える(引きずりの規則 Y_k の 10 → 10.000001 —— 第318便a の対照と同じ)
//     lawsText    … 表示の文(理論用語集 LAWS の ja A1 に 1 字)
//     reasonText  … 表示の文(受理器の理由の文 —— seed の警告に 1 字)
//   使い方: node tools/scope-probe319.mjs [--base-rev 7c6bf88] [--html beta/index.html] [--out tests/out/scopeprobe-w319c.json] [--cases k1,k2]
//   出力は道具の記録(段にしない —— 基点の器の宣言が要る対照なので鎖では作り直さない)。QA docs.regenShort319c が PHYSICS〔第319便c〕の表と照合する。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SC = await import(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs'));
const RT = await import(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs'));
export const PROBE_VERSION = 'w319c-scope-probe-1';
const argOf = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const BASE_REV = argOf('--base-rev', '7c6bf88'), HTML = path.resolve(ROOT, argOf('--html', 'beta/index.html'));
const OUT = argOf('--out', null), ONLY = argOf('--cases', null);
const nowText = fs.readFileSync(HTML, 'utf8');
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const once = (t, a, b) => { const i = t.indexOf(a); if (i < 0 || t.indexOf(a, i + 1) >= 0) return null; return t.slice(0, i) + b + t.slice(i + a.length); };
const segOf = (t, id) => { const i = t.indexOf('\n{ id:"' + id + '"'); if (i < 0) return null; const j = t.indexOf('\n{ id:"', i + 5); return j > i ? { i: i + 1, j: j + 1, text: t.slice(i + 1, j + 1) } : null; };
const bumpLast = (m) => { const v = m[2], last = Number(v[v.length - 1]); return m[1] + v.slice(0, -1) + String(last === 9 ? 8 : last + 1); };
export const CASES = [
  { key: 'addPreset', kind: 'book', ja: '内蔵の本を 1 本足す(🌀 binary の宣言の写しに新しい id —— 🗺️ の前)',
    make: (t) => { const s = segOf(t, 'binary'), at = t.indexOf('\n{ id:"solarSystem16Inertial3d"'); if (!s || at < 0) return null; const cp = s.text.replace('{ id:"binary"', '{ id:"w319cProbeBook"'); return t.slice(0, at + 1) + cp + t.slice(at + 1); } },
  { key: 'planetDecl', kind: 'book', ja: '在位の惑星 1 本の宣言を変える(🌋 venusSunInertial3d の最初の m の最下位桁)',
    make: (t) => { const s = segOf(t, 'venusSunInertial3d'); if (!s) return null; const m = /(\bm:\s*)(\d+\.\d*[1-9])/.exec(s.text); if (!m) return null; return t.slice(0, s.i + m.index) + bumpLast(m) + t.slice(s.i + m.index + m[0].length); } },
  { key: 'stepMaint', kind: 'step', ja: '步の関数を変える(軸を保つ維持の型の 1 步の帳簿 inertialDrag3MaintCell の本体の先頭に無害な文)',
    make: (t) => { const r = SC.touchFunction(t, 'inertialDrag3MaintCell'); return r.ok ? r.html : null; } },
  { key: 'engineCoef', kind: 'step', ja: '步の関数の係数を変える(引きずりの規則 Y_k の 10 → 10.000001)',
    make: (t) => once(t, 'return (10*G)/(REL_DRAG_INVSQ_C1*c*c);', 'return (10.000001*G)/(REL_DRAG_INVSQ_C1*c*c);') },
  { key: 'lawsText', kind: 'text', ja: '表示の文(理論用語集 LAWS の ja A1 に 1 字)', make: (t) => once(t, 'A1:"空間は実体を持たず', 'A1:"空間は実体を持たず、') },
  { key: 'reasonText', kind: 'text', ja: '表示の文(受理器の理由の文 —— seed の警告に 1 字)', make: (t) => once(t, 'seedが数値でないため無視', 'seedが数値でないため無視。') },
];
// ---- 見積りの秒(前回の鎖の実測 —— 無い段は表の秒)
const SECF = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'data-w311c-regensec.json'), 'utf8'));
const secOf = (st) => { const m = (SECF.steps || {})[st.key]; return (m && Number.isFinite(m.sec)) ? m.sec : ((st.secMeasured && st.secMeasured.sec) ?? st.secTable ?? st.sec ?? 0); };
// ---- 前後の履歴の集合と器の宣言
const H319 = new Set((RT.HISTORY_319C || []).map((z) => z.key));
const histAfter = new Set(RT.REGEN_STEPS.filter((s) => s.role === 'history').map((s) => s.key));
const histBefore = new Set([...histAfter].filter((k) => !H319.has(k)));
const gitShow = (rel) => { try { return execFileSync('git', ['-C', ROOT, 'show', BASE_REV + ':' + rel], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return null; } };
const declCache = new Map();
const declOf = (harness, side) => {
  const k = side + '|' + harness; if (declCache.has(k)) return declCache.get(k);
  const text = side === 'before' ? gitShow(harness) : (fs.existsSync(path.join(ROOT, harness)) ? fs.readFileSync(path.join(ROOT, harness), 'utf8') : null);
  const d = text ? SC.readDeclaredScope(text) : null;
  const v = (d && d.complete === true) ? Object.assign({}, d, { version: SC.SCOPE_VERSION }) : null;
  declCache.set(k, v); return v;
};
const readMeta = (rel) => { try { return (JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) || {}).meta || null; } catch { return null; } };
const W = RT.writersMap(RT.REGEN_STEPS);
const steps = RT.REGEN_STEPS.filter((s) => !(histBefore.has(s.key) && histAfter.has(s.key))).map((st) => {
  const harness = (st.cmd.match(/tests\/exp-[\w.-]+\.mjs/) || [null])[0];
  const outs = st.outs.map((o) => { const m = readMeta(o); const html = !!m && (String(m.target || '') === 'beta/index.html' || (m.inputs || []).some((z) => String(z.file || '') === 'beta/index.html'));
    return { out: o, meta: !!m, html, before: harness ? declOf(harness, 'before') : null, after: harness ? declOf(harness, 'after') : null }; });
  const deps = new Set(st.after || []);
  for (const o of st.outs) { const m = readMeta(o); for (const z of ((m && m.inputs) || []).concat((m && m.inputsStable) || [])) for (const p of (W.get(z.file) || [])) if (p !== st.key) deps.add(p); }
  return { key: st.key, sec: secOf(st), always: !!st.alwaysRun, outs, deps: [...deps], histBefore: histBefore.has(st.key), histAfter: histAfter.has(st.key) };
});
const fixedOf = (s) => s.always ? 'always' : (s.outs.some((o) => !o.meta) ? 'noMeta' : (!s.outs.some((o) => o.html) ? 'noHtml' : null));
const keyOf = (sc) => JSON.stringify(SC.normalizeScope(sc));
const scopes = new Map();
for (const s of steps) for (const o of s.outs) for (const side of ['before', 'after']) if (o[side]) scopes.set(keyOf(o[side]), o[side]);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w319c-probe-'));
const hashAll = (file) => { const r = new Map(); for (const [k, sc] of scopes) { const h = SC.scopeHash(file, sc, { version: SC.SCOPE_VERSION }); r.set(k, h.scopeComplete ? h.scopeSha256 : 'incomplete:' + h.detail.why.join(';')); } return r; };
const side = (name) => (name === 'before' ? (s) => !s.histBefore : (s) => !s.histAfter);
const sumSec = (keys) => steps.filter((s) => keys.has(s.key)).reduce((a, s) => a + s.sec, 0);
const t0 = Date.now();
const res = { version: PROBE_VERSION, baseRev: BASE_REV, scopeVersion: SC.SCOPE_VERSION, html: path.relative(ROOT, HTML), htmlSha256: sha(nowText), secSource: 'tests/data-w311c-regensec.json(前回の鎖の実測 —— 無い段は表の秒)',
  method: '段ごとに正本の対象の判定(planRegen の写し): 前 = 基点の器の REGEN_SCOPE と基点の履歴の集合・後 = 今の器の REGEN_SCOPE と今の履歴の集合。領域 hash は前後とも版 6 で引き、変更の前後で違う正本を持つ段を regen と数える。'
    + '領域の宣言の無い html の正本の段(wholeHtml)は html のどんな変更でも regen。常時群・正本の無い段・html を読まない段は変更に依らない(fixed)。recheck は依存で下流に伝わる段',
  totals: {}, cases: [] };
for (const nm of ['before', 'after']) {
  const ss = steps.filter(side(nm));
  res.totals[nm] = { steps: ss.length, sec: ss.reduce((a, s) => a + s.sec, 0), history: nm === 'before' ? histBefore.size : histAfter.size,
    fixed: { always: ss.filter((s) => fixedOf(s) === 'always').length, noMeta: ss.filter((s) => fixedOf(s) === 'noMeta').length, noHtml: ss.filter((s) => fixedOf(s) === 'noHtml').length },
    alwaysSec: ss.filter((s) => fixedOf(s) === 'always').reduce((a, s) => a + s.sec, 0),
    wholeHtml: ss.filter((s) => !fixedOf(s) && s.outs.some((o) => o.html && !o[nm])).length,
    wholeHtmlSec: ss.filter((s) => !fixedOf(s) && s.outs.some((o) => o.html && !o[nm])).reduce((a, s) => a + s.sec, 0),
    allPresets: ss.filter((s) => !fixedOf(s) && s.outs.some((o) => o.html && o[nm] && o[nm].presets === 'all')).length,
    allPresetsSec: ss.filter((s) => !fixedOf(s) && s.outs.some((o) => o.html && o[nm] && o[nm].presets === 'all')).reduce((a, s) => a + s.sec, 0) };
}
res.scopes = scopes.size;
// 段ごとの扱いの表の数(記録の時点の見積りの秒と器の宣言の本の数 —— 表は記録から作る〔後の便の --calibrate や器の宣言の書き換えで表が動かない〕)
res.stages = {};
for (const z of [].concat(RT.HISTORY_319C || [], RT.CLOSED_KEEP_319C || [], RT.NARROWED_319C || [], RT.KEEP_ALL_319C || [], RT.AN454_319C || [], RT.AN454_SKIP_319C || [])) {
  const st = RT.REGEN_STEPS.find((s) => s.key === z.key); if (!st) continue;
  const h = (st.cmd.match(/tests\/exp-[\w.-]+\.mjs/) || [null])[0], d = h ? declOf(h, 'after') : null, d0 = h ? declOf(h, 'before') : null;
  res.stages[z.key] = { sec: secOf(st), presets: d ? (d.presets === 'all' ? 'all' : d.presets.length) : null, presetsBefore: d0 ? (d0.presets === 'all' ? 'all' : d0.presets.length) : null };
}
try {
  const f0 = path.join(tmp, 'now.html'); fs.writeFileSync(f0, nowText);
  const h0 = hashAll(f0);
  res.incomplete = [...h0.values()].filter((v) => String(v).startsWith('incomplete')).length;
  for (const c of CASES) {
    if (ONLY && !ONLY.split(',').includes(c.key)) continue;
    const row = { key: c.key, kind: c.kind, ja: c.ja };
    const t1 = c.make(nowText);
    if (!t1 || t1 === nowText) { row.made = false; res.cases.push(row); continue; }
    row.made = true;
    const f1 = path.join(tmp, c.key + '.html'); fs.writeFileSync(f1, t1);
    const h1 = hashAll(f1); fs.rmSync(f1, { force: true });
    const changed = new Set([...scopes.keys()].filter((k) => h1.get(k) !== h0.get(k)));
    row.scopesChanged = changed.size;
    for (const nm of ['before', 'after']) {
      const ss = steps.filter(side(nm));
      const regen = new Set(), scoped = new Set(), whole = new Set();
      for (const s of ss) {
        if (fixedOf(s)) continue;
        let hit = false;
        for (const o of s.outs) { if (!o.html) continue; const sc = o[nm]; if (!sc) { whole.add(s.key); hit = true; } else if (changed.has(keyOf(sc))) { scoped.add(s.key); hit = true; } }
        if (hit) regen.add(s.key);
      }
      const run = new Set([...regen, ...ss.filter((s) => s.always).map((s) => s.key)]), recheck = new Set();
      let ch = true;
      while (ch) { ch = false; for (const s of ss) { if (run.has(s.key) || recheck.has(s.key) || fixedOf(s) === 'noMeta') continue; if (s.deps.some((d) => run.has(d) || recheck.has(d))) { recheck.add(s.key); ch = true; } } }
      row[nm] = { regen: regen.size, regenSec: sumSec(regen), scoped: scoped.size, scopedSec: sumSec(scoped), wholeHtml: whole.size, wholeHtmlSec: sumSec(whole), recheck: recheck.size,
        regenSteps: [...regen].sort() };
    }
    row.saved = { steps: row.before.regen - row.after.regen, sec: row.before.regenSec - row.after.regenSec,
      steps_: [...new Set(row.before.regenSteps)].filter((k) => !row.after.regenSteps.includes(k)).sort() };
    res.cases.push(row);
    console.log(c.key.padEnd(12), c.kind.padEnd(5), `前 regen ${String(row.before.regen).padStart(3)}(${row.before.regenSec} s)`, ` 後 regen ${String(row.after.regen).padStart(3)}(${row.after.regenSec} s)`, ` 省ける ${row.saved.steps} 段・${row.saved.sec} s`);
  }
  // AN454 の段ごとの変異の対照(表示の文 2 種 → 領域 hash 不変・宣言した本の質量 → 変わる)
  res.an454 = [];
  for (const z of (RT.AN454_319C || [])) {
    const d = declOf(z.harness, 'after'); if (!d) { res.an454.push({ key: z.key, declared: false }); continue; }
    const pid = d.presets === 'all' ? 'venusSunInertial3d' : d.presets[0];
    // 宣言した本の物理の数(最初の質量 m の最下位桁 —— 質量に小数の無い本は physics の宣言の中の最初の小数の最下位桁)
    let field = 'm';
    const mass = (t) => { const s = segOf(t, pid); if (!s) return null; let m = /(\bm:\s*)(\d+\.\d*[1-9])/.exec(s.text), off = 0;
      if (!m) { const k = s.text.indexOf('physics:{'); if (k < 0) return null; const r = /(\b([A-Za-z_]\w*)\s*:\s*)(\d+\.\d*[1-9])/.exec(s.text.slice(k)); if (!r) return null; off = k; field = 'physics.' + r[2]; m = [r[0], r[1], r[3]]; m.index = r.index; }
      return t.slice(0, s.i + off + m.index) + bumpLast(m) + t.slice(s.i + off + m.index + m[0].length); };
    const row = { key: z.key, declared: true, presets: d.presets === 'all' ? 'all' : d.presets.length, massOf: pid };
    const h0z = h0.get(keyOf(d));
    for (const [mk, fn, want] of [['lawsText', CASES.find((c) => c.key === 'lawsText').make, 'same'], ['reasonText', CASES.find((c) => c.key === 'reasonText').make, 'same'], ['mass', mass, 'changed']]) {
      const t1 = fn(nowText); if (!t1) { row[mk] = 'not-made'; continue; }
      const f1 = path.join(tmp, 'an454-' + z.key + '-' + mk + '.html'); fs.writeFileSync(f1, t1);
      const h = SC.scopeHash(f1, d, { version: SC.SCOPE_VERSION }); fs.rmSync(f1, { force: true });
      row[mk] = (h.scopeComplete ? h.scopeSha256 : 'incomplete') === h0z ? 'same' : 'changed'; row[mk + 'Ok'] = row[mk] === want;
    }
    row.massField = field;
    res.an454.push(row);
    console.log('AN454', z.key.padEnd(12), JSON.stringify(row));
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
res.elapsedS = (Date.now() - t0) / 1000;
if (OUT) { fs.mkdirSync(path.dirname(path.resolve(ROOT, OUT)), { recursive: true }); fs.writeFileSync(path.resolve(ROOT, OUT), JSON.stringify(res, null, 1) + '\n'); }
console.log('totals', JSON.stringify(res.totals), 'elapsedS', res.elapsedS);

#!/usr/bin/env node
// 第318便a(原仮定者の裁定(第120報)「概ね添付の提案に同意」・決断事項 AN427 ①〜⑤・統括の検証項目 R254): **鎖の費用の対照**(道具 —— html と正本は書き換えない)。
//   基点の html(--base —— 版 5 の規則の世代)と今の html(--html —— 版 6 の規則の世代)の写しに、同じ意味の 1 か所の変更(1 字か最下位桁)を入れ、
//   再生成表の段(履歴を除く)のうち**その変更で regen になる段**を数える(planRegen の対象の判定の写し —— 段の正本ごとに):
//     ・前(基点): 正本の刻印 meta.scope(刻印の版のまま —— 今の鎖が実際に引く版)で領域 hash を引き直し、変更の前後で違えば regen。
//       領域の宣言の無い正本(html 全体を刻む)は html のどんな変更でも regen。正本か meta が無い段・常時群・html を読まない段は別に数える(変更に依らない)。
//     ・後(今): 器の宣言 REGEN_SCOPE を版 6(w318a-scope-6)で引く —— 次の鎖で全段が版 6 で刻み直された後の世代の見込み。
//     ・recheck: 依存(段の after・正本の入力の書き手)で regen/常時群の下流に伝わる段(依存先が走った後に計画し直す —— 表示の文の変更なら reuse に戻る見込み)。
//   変更の種類: text(表示の文 —— 受理器の理由の文・LAWS・SYSTEM_PROMPT・本の名・abBody.label・選択粒子の編集の文・I18N の文)/
//               physics(受理の判定の閾値・エンジンの式の係数・law の値・referenceKind の値・質量)。表示の文は 0 段・物理は前と同じかそれ以上が契約。
//   一時 html は os.tmpdir() に書いて消す。使い方:
//     node tools/scope-probe318.mjs --base beta/_w318_base.html [--html beta/index.html] [--out tests/out/scopeprobe-w318a.json] [--cases k1,k2]
//   出力 JSON は道具の記録(段にしない —— 基点の html が要る対照なので鎖では作り直さない)。QA docs.scopeProbe318 が PHYSICS〔第318便a〕の表と照合する。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SC = await import(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs'));
const RT = await import(path.join(ROOT, 'tests', 'lib-w281a-regentable.mjs'));
export const PROBE_VERSION = 'w318a-scope-probe-1';
const argOf = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const BASE = path.resolve(ROOT, argOf('--base', 'beta/_w318_base.html')), HTML = path.resolve(ROOT, argOf('--html', 'beta/index.html'));
const OUT = argOf('--out', null), ONLY = argOf('--cases', null);
const baseText = fs.readFileSync(BASE, 'utf8'), nowText = fs.readFileSync(HTML, 'utf8');
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
/** 1 か所だけの置き換え(見つからない・2 か所以上なら作らない) */
const once = (t, a, b) => { const i = t.indexOf(a); if (i < 0 || t.indexOf(a, i + 1) >= 0) return null; return t.slice(0, i) + b + t.slice(i + a.length); };
/** 内蔵の本 id の宣言の中で、最初に現れる re の数の最下位桁を 1 つ動かす / 文字列を置き換える */
const inPreset = (t, id, re, fn) => { const i = t.indexOf('id:"' + id + '"'); if (i < 0) return null; const j = t.indexOf('\n{ id:"', i + 5); const seg = t.slice(i, j > i ? j : undefined);
  const m = re.exec(seg); if (!m) return null; return t.slice(0, i + m.index) + fn(m) + t.slice(i + m.index + m[0].length); };
const bumpLast = (m) => { const v = m[2], last = Number(v[v.length - 1]); return m[1] + v.slice(0, -1) + String(last === 9 ? 8 : last + 1); };
export const CASES = [
  // 表示の文
  { key: 'reasonTop', kind: 'text', ja: '受理器の理由の文(validatePreset の warnings —— seed の文に 1 字)', make: (t) => once(t, 'seedが数値でないため無視', 'seedが数値でないため無視。') },
  { key: 'reasonSub', kind: 'text', ja: '受理器の理由の文(下の受理器 validateTimeRef の err —— tObs の文に 1 字)', make: (t) => once(t, 'tObs は正の有限数', 'tObs は正の有限数。') },
  { key: 'laws', kind: 'text', ja: '理論用語集 LAWS(ja A1 に 1 字)', make: (t) => once(t, 'A1:"空間は実体を持たず', 'A1:"空間は実体を持たず、') },
  { key: 'systemPrompt', kind: 'text', ja: 'AI の生成の仕様 SYSTEM_PROMPT(見出しに 1 字)', make: (t) => once(t, '# シミュレータの物理(要約)', '# シミュレータの物理(要約)。') },
  { key: 'presetName', kind: 'text', ja: '本の名(🟠 jupiterGalilean の name に 1 字)', make: (t) => once(t, 'name:"木星とガリレオ衛星(実単位)', 'name:"木星とガリレオ衛星(実単位)。') },
  { key: 'abBodyLabel', kind: 'text', ja: '比較の欄の名(abBody.label の ja に 1 字)', make: (t) => once(t, 'X_k=0(時空係数ゼロ — 3つの時計が同じ速さ)', 'X_k=0(時空係数ゼロ — 3つの時計が同じ速さ。)') },
  { key: 'bodyEdit', kind: 'text', ja: '選択粒子の編集の文(updateBodyEdit の「・殻=気体」に 1 字)', make: (t) => once(t, '"・殻=気体"', '"・殻=気体。"') },
  { key: 'i18n', kind: 'text', ja: 'I18N の文(対照 —— ja physLockOn に 1 字)', make: (t) => once(t, 'physLockOn:"✓ ロック中:', 'physLockOn:"✓ ロック中。:') },
  // 物理
  { key: 'acceptThreshold', kind: 'physics', ja: '受理の判定の閾値(validatePreset の world.size の上限 5000 → 5001)', make: (t) => once(t, 'clamp(p.world.size,0,5000)', 'clamp(p.world.size,0,5001)') },
  { key: 'engineCoef', kind: 'physics', ja: 'エンジンの式の係数(引きずりの規則 Y_k の 10 → 10.000001)', make: (t) => once(t, 'return (10*G)/(REL_DRAG_INVSQ_C1*c*c);', 'return (10.000001*G)/(REL_DRAG_INVSQ_C1*c*c);') },
  { key: 'lawValue', kind: 'physics', ja: 'law の値(🌡️ mercurySunInertial3d の gLoc.law "kappaC2" → "cRatio")', make: (t) => inPreset(t, 'mercurySunInertial3d', /gLoc:\{law:"kappaC2"\}/, () => 'gLoc:{law:"cRatio"}') },
  { key: 'referenceKind', kind: 'physics', ja: 'referenceKind の値(意味を持つ分類 —— "tide-diagnostic" → "observation-fit")', make: (t) => once(t, 'referenceKind:"tide-diagnostic"', 'referenceKind:"observation-fit"') },
  { key: 'mass', kind: 'physics', ja: '質量(🟠 の最初の m の最下位桁)', make: (t) => inPreset(t, 'jupiterGalilean', /(\bm:\s*)(\d+\.\d*[1-9])/, bumpLast) },
];
// ---- 段と正本(履歴を除く)
const HIST = new Set(RT.historyOuts());
const readMeta = (rel) => { try { return (JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) || {}).meta || null; } catch { return null; } };
const declOf = new Map();
for (const f of fs.readdirSync(path.join(ROOT, 'tests')).filter((x) => /^exp-.*\.mjs$/.test(x))) {
  const t = fs.readFileSync(path.join(ROOT, 'tests', f), 'utf8'); if (t.indexOf('const REGEN_SCOPE = ') < 0) continue;
  const d = SC.readDeclaredScope(t); if (d) declOf.set('tests/' + f, d);
}
const W = RT.writersMap(RT.REGEN_STEPS);
const steps = RT.REGEN_STEPS.filter((s) => s.role !== 'history').map((st) => {
  const outs = st.outs.filter((o) => !HIST.has(o)).map((o) => {
    const m = readMeta(o);
    const harness = (st.cmd.match(/tests\/exp-[\w.-]+\.mjs/) || [null])[0];
    const decl = harness ? declOf.get(harness) || null : null;
    const html = !!m && (String(m.target || '') === 'beta/index.html' || (m.inputs || []).some((z) => String(z.file || '') === 'beta/index.html'));   // beta の html を読む正本だけ(root の html は対照で変えない)
    return { out: o, meta: !!m, html, before: (m && m.scope && m.scopeComplete === true) ? m.scope : null, after: decl ? Object.assign({}, decl, { version: SC.SCOPE_VERSION }) : null, harness };
  });
  const deps = new Set(st.after || []);
  for (const o of st.outs) { const m = readMeta(o); for (const z of ((m && m.inputs) || []).concat((m && m.inputsStable) || [])) for (const p of (W.get(z.file) || [])) if (p !== st.key) deps.add(p); }
  return { key: st.key, always: !!st.alwaysRun, outs, deps: [...deps] };
});
// 変更に依らない段(常時群・正本か meta が無い・html を読まない)
const fixedOf = (s, side) => s.always ? 'always' : (s.outs.some((o) => !o.meta) ? 'noMeta' : (!s.outs.some((o) => o.html) ? 'noHtml' : null));
// ---- 領域 hash(一時 html —— 同じ html の宣言はまとめて引く)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w318a-probe-'));
const keyOf = (sc) => JSON.stringify([sc.version || SC.SCOPE_VERSION_LEGACY, SC.normalizeScope(sc)]);
const hashAll = (file, scopes) => { const r = new Map(); for (const [k, sc] of scopes) { const h = SC.scopeHash(file, sc, { version: sc.version || SC.SCOPE_VERSION_LEGACY }); r.set(k, h.scopeComplete ? h.scopeSha256 : 'incomplete'); } return r; };
const scopesBefore = new Map(), scopesAfter = new Map();
for (const s of steps) for (const o of s.outs) { if (o.before) scopesBefore.set(keyOf(o.before), o.before); if (o.after) scopesAfter.set(keyOf(o.after), o.after); }
const t0 = Date.now();
const res = { version: PROBE_VERSION, scopeVersions: { before: 'stamp(' + [...new Set([...scopesBefore.values()].map((z) => z.version || SC.SCOPE_VERSION_LEGACY))].sort().join('・') + ')', after: SC.SCOPE_VERSION },
  base: path.relative(ROOT, BASE), baseSha256: sha(baseText), html: path.relative(ROOT, HTML), htmlSha256: sha(nowText),
  steps: steps.length, scopesBefore: scopesBefore.size, scopesAfter: scopesAfter.size,
  fixed: { always: steps.filter((s) => fixedOf(s) === 'always').length, noMeta: steps.filter((s) => fixedOf(s) === 'noMeta').length, noHtml: steps.filter((s) => fixedOf(s) === 'noHtml').length },
  wholeHtml: { before: steps.filter((s) => !fixedOf(s) && s.outs.some((o) => o.html && !o.before)).length, after: steps.filter((s) => !fixedOf(s) && s.outs.some((o) => o.html && !o.after)).length },
  method: '段ごとに正本の対象の判定(planRegen の写し): 前 = 刻印の meta.scope を刻印の版で・後 = 器の REGEN_SCOPE を版 6 で引き、変更の前後で領域 hash が違う正本を持つ段を regen と数える。'
    + '領域の宣言の無い html の正本の段(wholeHtml)は html のどんな変更でも regen。常時群・正本の無い段・html を読まない段は変更に依らない(fixed)。recheck は依存で下流に伝わる段',
  cases: [] };
try {
  const fB = path.join(tmp, 'base.html'), fN = path.join(tmp, 'now.html');
  fs.writeFileSync(fB, baseText); fs.writeFileSync(fN, nowText);
  const h0B = hashAll(fB, scopesBefore), h0N = hashAll(fN, scopesAfter);
  res.incomplete = { before: [...h0B.values()].filter((v) => v === 'incomplete').length, after: [...h0N.values()].filter((v) => v === 'incomplete').length };
  for (const c of CASES) {
    if (ONLY && !ONLY.split(',').includes(c.key)) continue;
    const row = { key: c.key, kind: c.kind, ja: c.ja };
    for (const [side, text, scopes, h0] of [['before', baseText, scopesBefore, h0B], ['after', nowText, scopesAfter, h0N]]) {
      const t1 = c.make(text);
      if (!t1 || t1 === text) { row[side] = { made: false }; continue; }
      const f1 = path.join(tmp, c.key + '-' + side + '.html'); fs.writeFileSync(f1, t1);
      const h1 = hashAll(f1, scopes);
      fs.rmSync(f1, { force: true });
      const changedKeys = new Set([...scopes.keys()].filter((k) => h1.get(k) !== h0.get(k)));
      const regen = new Set(), scoped = new Set(), whole = new Set();
      for (const s of steps) {
        if (fixedOf(s)) continue;
        let hit = false;
        for (const o of s.outs) { if (!o.html) continue; const sc = o[side]; if (!sc) { whole.add(s.key); hit = true; } else if (changedKeys.has(keyOf(sc))) { scoped.add(s.key); hit = true; } }
        if (hit) regen.add(s.key);
      }
      // recheck: regen/常時群の下流(依存の閉包)
      const run = new Set([...regen, ...steps.filter((s) => s.always).map((s) => s.key)]);
      const recheck = new Set();
      let ch = true;
      while (ch) { ch = false; for (const s of steps) { if (run.has(s.key) || recheck.has(s.key) || fixedOf(s) === 'noMeta') continue; if (s.deps.some((d) => run.has(d) || recheck.has(d))) { recheck.add(s.key); ch = true; } } }
      const harnesses = new Set(); for (const s of steps) for (const o of s.outs) if (scoped.has(s.key) && o.harness) harnesses.add(o.harness);
      row[side] = { made: true, regen: regen.size, scoped: scoped.size, wholeHtml: whole.size, recheck: recheck.size, scopesChanged: changedKeys.size, scopes: scopes.size, harnesses: harnesses.size,
        scopedSteps: [...scoped].sort() };
    }
    res.cases.push(row);
    const f = (z) => (z && z.made ? `regen ${String(z.regen).padStart(3)}(領域 ${String(z.scoped).padStart(3)}+全体 ${z.wholeHtml})・recheck ${String(z.recheck).padStart(3)}` : '作れない');
    console.log(c.key.padEnd(16), c.kind.padEnd(8), '前', f(row.before), ' 後', f(row.after));
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
res.elapsedS = (Date.now() - t0) / 1000;
const T = res.cases.filter((c) => c.kind === 'text' && c.after && c.after.made), P = res.cases.filter((c) => c.kind === 'physics' && c.after && c.after.made && c.before && c.before.made);
res.summary = {
  textScopedAfterZero: T.filter((c) => c.after.scoped === 0).map((c) => c.key),
  textScopedAfterNonZero: T.filter((c) => c.after.scoped > 0).map((c) => c.key + ' ' + c.after.scoped),
  physicsNotFewer: P.every((c) => c.after.scoped >= c.before.scoped && c.after.scoped > 0),
  physicsRows: P.map((c) => c.key + ' ' + c.before.scoped + '→' + c.after.scoped),
};
if (OUT) { fs.mkdirSync(path.dirname(path.resolve(ROOT, OUT)), { recursive: true }); fs.writeFileSync(path.resolve(ROOT, OUT), JSON.stringify(res, null, 1) + '\n'); }
console.log('summary', JSON.stringify(res.summary), 'elapsedS', res.elapsedS);

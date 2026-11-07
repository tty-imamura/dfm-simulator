#!/usr/bin/env node
// 第329便c(原仮定者の回答(2026-11-05 —— AN554 = A)・統括の検証項目 R306): **条件で選ぶ本の宣言の危ない側の変異の試験**(html の写しを変えて領域 hash を引く ——
//   走らせない・正本を書かない・html を書き換えない〔写しは一時のディレクトリ —— 終わりに消す〕)。
//
// 名指しの 6 段のうち条件で選べる 2 段(pn1・refit-297a)の REGEN_SCOPE(presets "all" + presetsWhere)を器の本文から読み、今の html と変えた写しで
//   ① 条件の宣言の領域 hash(選択器 selectPresets329c —— tests/lib-w281a-scope.mjs)② presetsWhere を外した宣言(従来の presets "all")の領域 hash を引き、変異ごとに
//   regen(hash が違う)/ reuse(同じ)を期待と照らす:
//   (変異に使う本は今の html から選ぶ —— pickBooks: 名指しの本・先頭の本の外。第329便c の html では earthMoonTide・mercuryRealKF1・projectile・boxtrans)
//   selectedPhys   … 条件に当たる本の physics の値を変える → regen(危ない側の否定)
//   otherPhys      … 条件に当たらない本の physics の値を変える → reuse(狭さ —— 従来の all は regen)
//   enterSet       … 条件の欄を変えて本が条件に入る → regen
//   badValue       … 条件の欄を文字列にする(評価が不明)→ all へ戻る(regen・選択器 ok:false)。戻った後は条件に当たらない本の変更でも regen
//   newKey         … 条件に当たらない本に physics の鍵を足す → regen(閉包の fastParams が全本の physics の鍵の名を読む)
//   closureRead    … 閉包の関数(loadPreset)に本の表を回す行を足す → all へ戻る(regen)
//   addBook        … 本を 1 冊足す → regen(pn1 は全本の数・両方とも physics の鍵の名の列)
// 使い方: node tools/condselect-probe329c.mjs [--json <file>] [--html <html>]   終了コード: 期待と違う変異があれば 1
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const HTML = path.resolve(ROOT, arg('--html', 'beta/index.html'));
const JSON_OUT = arg('--json', null);
export const PROBE_VERSION_329C = 'w329c-condprobe-1';
const SC = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w281a-scope.mjs')).href);
const HL = await import(pathToFileURL(path.join(ROOT, 'tests', 'lib-w279b-headless.mjs')).href);
let HTML_FOR_PICK = HTML;

const STAGES = [['pn1', 'tests/exp-w285b-pn1.mjs'], ['refit-297a', 'tests/exp-w297a-refit.mjs']];
const decls = Object.fromEntries(STAGES.map(([k, f]) => [k, SC.readDeclaredScope(fs.readFileSync(path.join(ROOT, f), 'utf8'))]));
const allOf = (d) => { const x = JSON.parse(JSON.stringify(d)); delete x.presetsWhere; return x; };

// 本の字面の範囲(id:"…" から次の本の頭まで)の中で置き換える
const litRange = (t, id) => { const i = t.indexOf('{ id:"' + id + '"'); if (i < 0) throw new Error('本が無い: ' + id); const j = t.indexOf('\n{ id:"', i + 5); return [i, j < 0 ? t.length : j]; };
const inBook = (t, id, fn) => { const [i, j] = litRange(t, id); const seg = fn(t.slice(i, j)); if (seg === t.slice(i, j)) throw new Error('変異が当たらない: ' + id); return t.slice(0, i) + seg + t.slice(j); };
const physNum = (seg) => seg.replace(/(physics:\{[\s\S]*?\b(?!geoPN\b)([A-Za-z_]\w*):\s*)(\d+(?:\.\d+)?)/, (m, a, k, v) => a + String(Number(v) + 1));
const geoTo = (v) => (seg) => seg.replace(/\bgeoPN:0\b/, 'geoPN:' + v);

/**
 * 変異に使う本を今の html から選ぶ(名指しの本・先頭の本の外 —— 字面に physics:{ と数の鍵があり、geoPN 0 の本は字面に geoPN:0 がある本の最初)。
 * 既定は第329便c の html で選ばれる earthMoonTide(geoPN 1)・mercuryRealKF1(geoPN 2)・projectile と boxtrans(geoPN 0)。
 */
export function pickBooks(t) {
  const { loadHtmlHeadless } = HL;
  const B = loadHtmlHeadless(HTML_FOR_PICK).evalExpr('BUILTIN_PRESETS');
  const named = new Set(STAGES.flatMap(([k]) => (decls[k].presetsWhere && decls[k].presetsWhere.named) || []).concat([String(B[0].id)]));
  const okLit = (id, needGeo0) => { try { const [i, j] = litRange(t, id); const seg = t.slice(i, j); return physNum(seg) !== seg && (!needGeo0 || /\bgeoPN:0\b/.test(seg)); } catch { return false; } };
  const pick = (g, n, needGeo0) => B.filter((p) => p.physics && p.physics.geoPN === g && !named.has(String(p.id)) && okLit(String(p.id), needGeo0)).slice(0, n).map((p) => String(p.id));
  const [SEL1] = pick(1, 1, false), [SEL2] = pick(2, 1, false), [OTHER, OTHER2] = pick(0, 2, true);
  if (!(SEL1 && SEL2 && OTHER && OTHER2)) throw new Error('変異に使う本が選べない');
  return { SEL1, SEL2, OTHER, OTHER2 };
}

export function mutations(t, books) {
  const { SEL1, SEL2, OTHER } = books;
  const m = {
    selectedPhys1: { html: inBook(t, SEL1, physNum), expect: { 'pn1': 'regen', 'refit-297a': 'reuse' }, what: SEL1 + '(geoPN 1)の physics の数を変える' },
    selectedPhys2: { html: inBook(t, SEL2, physNum), expect: { 'pn1': 'regen', 'refit-297a': 'regen' }, what: SEL2 + '(geoPN 2)の physics の数を変える' },
    otherPhys: { html: inBook(t, OTHER, physNum), expect: { 'pn1': 'reuse', 'refit-297a': 'reuse' }, what: OTHER + '(geoPN 0 —— 条件に当たらない)の physics の数を変える' },
    enterSet1: { html: inBook(t, OTHER, geoTo(1)), expect: { 'pn1': 'regen', 'refit-297a': 'reuse' }, what: OTHER + ' の geoPN 0 → 1(pn1 の条件に入る)' },
    enterSet2: { html: inBook(t, OTHER, geoTo(2)), expect: { 'pn1': 'regen', 'refit-297a': 'regen' }, what: OTHER + ' の geoPN 0 → 2(両方の条件に入る)' },
    badValue: { html: inBook(t, OTHER, (s) => s.replace(/\bgeoPN:0\b/, 'geoPN:"0"')), expect: { 'pn1': 'regen', 'refit-297a': 'regen' }, fallback: true, what: OTHER + ' の geoPN を文字列 "0"(評価が不明 → all)' },
    newKey: { html: inBook(t, OTHER, (s) => s.replace(/physics:\{/, 'physics:{ w329cProbeKey:1,')), expect: { 'pn1': 'regen', 'refit-297a': 'regen' }, what: OTHER + ' に physics の鍵を足す(fastParams が鍵の名を読む)' },
    closureRead: { html: t.replace(/(\n\s*let p=allPresets\(\)\.find\(q=>q\.id===id\) \|\| BUILTIN_PRESETS\[0\];)/, '$1\n  for(const q329 of BUILTIN_PRESETS) void q329;'), expect: { 'pn1': 'regen', 'refit-297a': 'regen' }, fallback: true, what: 'loadPreset に本の表を回す行を足す(閉包の読みが宣言の表と違う → all)' },
    addBook: { html: (() => { const [i, j] = litRange(t, OTHER); const lit = t.slice(i, j); const cp = lit.replace('{ id:"' + OTHER + '"', '{ id:"w329cProbeCopy"'); return t.slice(0, j) + (lit.trimEnd().endsWith(',') ? '' : ',') + '\n' + cp.replace(/,?\s*$/, ',') + t.slice(j); })(), expect: { 'pn1': 'regen', 'refit-297a': 'regen' }, what: '本を 1 冊足す(' + OTHER + ' の写し —— pn1 は全本の数・両方とも physics の鍵の名の列)' },
  };
  if (m.closureRead.html === t) throw new Error('closureRead の変異が当たらない');
  return m;
}

export function runProbe(htmlPath) {
  HTML_FOR_PICK = htmlPath;
  const t = fs.readFileSync(htmlPath, 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w329c-cond-'));
  const rows = [], bad = [];
  try {
    const hashOf = (file) => Object.fromEntries(STAGES.map(([k]) => {
      const a = SC.scopeHash(file, decls[k]), b = SC.scopeHash(file, allOf(decls[k]));
      return [k, { cond: a.scopeSha256, complete: a.scopeComplete, all: b.scopeSha256, sel: a.detail.presetSelect || null }];
    }));
    const base = hashOf(htmlPath);
    for (const [k] of STAGES) if (!(base[k].complete && base[k].sel && base[k].sel.ok)) bad.push('基点の html で ' + k + ' の選択器が選べない(' + JSON.stringify(base[k].sel) + ')');
    const books = pickBooks(t), M = mutations(t, books);
    // 戻った後の狭さ(badValue の上にさらに条件に当たらない別の本の数を変える)
    const fbOther = inBook(M.badValue.html, books.OTHER2, physNum);
    for (const [name, mu] of Object.entries(M).concat([['badValue+other', { html: fbOther, expect: null, what: 'all へ戻った写しで条件に当たらない別の本(' + books.OTHER2 + ')の数を変える' }]])) {
      const f = path.join(tmp, name + '.html');
      fs.writeFileSync(f, mu.html);
      const h = hashOf(f);
      const row = { name, what: mu.what, stages: {} };
      for (const [k] of STAGES) {
        const cmpTo = name === 'badValue+other' ? rows.find((r) => r.name === 'badValue').stages[k].condSha : base[k].cond;
        const got = h[k].cond === cmpTo ? 'reuse' : 'regen', gotAll = h[k].all === base[k].all ? 'reuse' : 'regen';
        const want = mu.expect ? mu.expect[k] : 'regen';
        row.stages[k] = { cond: got, all: gotAll, expect: want, ok: got === want, selOk: h[k].sel ? h[k].sel.ok : null, nSelected: h[k].sel ? h[k].sel.nSelected : null, condSha: h[k].cond };
        if (got !== want) bad.push(`${name} ${k}: ${got}(期待 ${want})`);
        if (mu.fallback && h[k].sel && h[k].sel.ok !== false) bad.push(`${name} ${k}: all へ戻らない`);
        if (gotAll !== 'regen') bad.push(`${name} ${k}: 従来の all で reuse(変異が html に当たっていない)`);
      }
      rows.push(row);
      try { fs.unlinkSync(f); } catch { /* 消せなくてよい */ }
    }
    const summary = Object.fromEntries(STAGES.map(([k]) => [k, { nAll: base[k].sel ? base[k].sel.nAll : null, nSelected: base[k].sel ? base[k].sel.nSelected : null, nHashed: base[k].sel ? base[k].sel.nHashed : null }]));
    return { version: PROBE_VERSION_329C, selector: SC.PRESET_SELECT_VERSION_329C, html: path.relative(ROOT, htmlPath), books, ok: bad.length === 0, bad, base: summary, rows };
  } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* 一時 */ } }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const t0 = Date.now();
  const r = runProbe(HTML);
  r.elapsedS = (Date.now() - t0) / 1000;
  for (const z of r.rows) console.log(`${z.name.padEnd(15)} ${Object.entries(z.stages).map(([k, s]) => `${k}: ${s.cond}(従来 ${s.all}・期待 ${s.expect}${s.selOk === false ? '・all へ戻る' : ''})`).join(' / ')}`);
  console.log(`条件で選ぶ本(${r.selector}): ${Object.entries(r.base).map(([k, b]) => `${k} ${b.nSelected}/${b.nAll} 本を条件で選び ${b.nHashed} 本を刻む`).join('・')} → ${r.ok ? '期待どおり' : '期待と違う ' + r.bad.length + ' 件: ' + r.bad.slice(0, 4).join(' , ')}(${r.elapsedS} s)`);
  if (JSON_OUT) fs.writeFileSync(path.resolve(ROOT, JSON_OUT), JSON.stringify(r, null, 1) + '\n');
  process.exit(r.ok ? 0 : 1);
}

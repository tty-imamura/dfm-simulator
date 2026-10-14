// 第302便e(DECISIONS v60 AN305 ②⑧・統括の検証項目 R189): **状態の契約の lint** の器(Node だけ —— 対象 html の inline script を tests/lib-w279b-headless.mjs の
// loadHtmlHeadless で読み、アプリの入口 loadPreset・makeSim・build・appStepDt をそのまま呼ぶ。登録の一覧は html の宣言から機械で読む —— この器は鍵の一覧を持たない)。
//
// ■ 何を測るか
//   登録の集合 R = CK_ARRS ∪ CK_SC ∪ CK_DEEP ∪ SIM_STEP_SCRATCH ∪ SIM_BUILD_RESET(keys・list・re)∪ 機能ごとの写し(ckSnapOne・inertialDragCkSnap・shapeToyCkSnap の本文が
//   `S.<鍵>` で読む鍵と、本文が名指す大文字の一覧〔文字列の配列〕・正規表現)。派生の表 D = SIM_STATE_DERIVED(状態の契約の外 —— 無い世代は空)。
//   ① 静的: html の本文の `S.<鍵>=`(と複合代入・++/--)の鍵 A。A − R − D を「登録の外の代入」として数え、下の動的な分類で分ける
//      (sim の関数の鍵は除く)。
//   ② 動的: 在位の本(宣言から —— familyRole≠"retired")を順に内蔵の sim へ開き(前の本は 3 步走らせた後)、
//      (a) 開いた直後の sim と同じ本を makeSim → build で新しく組んだ sim の全欄の指紋(器 tests/exp-w301f-clone.mjs の simPrint)の差:
//          開いた sim にだけ値がある鍵(前の本の持ち越し —— 値が null の鍵も数える。新しく組んだ sim で null の鍵は差にならない =「null が契約の値」の鍵は
//          新しく組んだ sim が機械で決める —— 手書きの表を持たない)と値の違う鍵。
//      (b) 開いた直後と 3 步後の全欄の指紋で値が変わった鍵(步の状態)のうち、R にも D にも無い鍵 = **登録漏れ**。
//   門: 登録漏れ 0・持ち越し 0。静的な鍵のうち在位の本で一度も現れない鍵(在位で走らない経路)は数だけ記録する(門にしない)。
//   W302E_BASE=<基点 html> で基点の同じ測定も記録する(初版の検出の数 —— 第302便e の直す前)。
//
// ■ 言わないこと: 「状態の契約が完全になった」(步で変わらない鍵・在位で走らない経路は見ない)。
//
// ■ 使い方
//   node tests/exp-w302e-statecontract.mjs   → 正本 tests/out/statecontract-w302e.json(段 statecontract-302e)
//   W302E_SC_OUT=<json> で出力先を変える(試走は正本を書かない)・W302E_SC_TARGET=<html>(既定 beta/index.html)・W302E_BASE=<基点 html>(記録だけ)・
//   W302E_SC_STEPS で步数(既定 3)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { simPrint, printDiff } from './exp-w301f-clone.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言(全本を開く —— presets "all")
const REGEN_SCOPE = {"presets":"all","roots":["$","CK_ARRS","CK_DEEP","CK_SC","HP.allPresets","HP.loadPreset","SIM_BUILD_RESET","SIM_STATE_DERIVED","SIM_STEP_SCRATCH","appStepDt","applyQLock","ckRestoreOne","ckSnapOne","cloneSimState","ctx","currentPreset","inertialDragCkSnap","makeSim","qLockOn","shapeToyCkSnap","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w302e-statecontract-1';
export const COPY_FNS = ['ckSnapOne', 'inertialDragCkSnap', 'shapeToyCkSnap'];
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const isRe = (v) => Object.prototype.toString.call(v) === '[object RegExp]';

function fnBody(html, name) {
  const i = html.indexOf('function ' + name + '(');
  if (i < 0) return '';
  const j = html.indexOf('{', i);
  let d = 0;
  for (let k = j; k < html.length; k++) { if (html[k] === '{') d++; else if (html[k] === '}') { d--; if (d === 0) return html.slice(j, k + 1); } }
  return '';
}
/** 登録の集合(html の宣言から)と派生の表 */
export function registryOf(E, html) {
  const has = (nm) => E(`typeof ${nm}!=='undefined'`);
  const names = new Set(), res = [], src = {};
  const addAll = (arr, from) => { for (const k of arr) { names.add(k); if (!src[k]) src[k] = from; } };
  for (const L of ['CK_ARRS', 'CK_SC', 'CK_DEEP', 'SIM_STEP_SCRATCH']) if (has(L)) addAll(E(L), L);
  if (has('SIM_BUILD_RESET')) for (const g of E('SIM_BUILD_RESET')) { addAll(g.keys || [], 'SIM_BUILD_RESET'); if (g.list) addAll(E(g.list), 'SIM_BUILD_RESET'); if (g.re) res.push(g.re); }
  for (const f of COPY_FNS) {
    const b = fnBody(html, f);
    for (const m of b.matchAll(/\bS\.([A-Za-z_$][\w$]*)/g)) { names.add(m[1]); if (!src[m[1]]) src[m[1]] = f; }
    for (const m of b.matchAll(/\b([A-Z][A-Z0-9_]{3,})\b/g)) {
      let v; try { v = E(m[1]); } catch (_) { continue; }
      if (Array.isArray(v) && v.length && v.every((x) => typeof x === 'string')) addAll(v, f + ':' + m[1]);
      else if (isRe(v)) res.push(v);
    }
  }
  const derived = has('SIM_STATE_DERIVED') ? E('SIM_STATE_DERIVED').map((d) => ({ key: d.key, kind: d.kind })) : [];
  const dset = new Set(derived.map((d) => d.key));
  return { names, res, src, derived, isReg: (k) => names.has(k) || res.some((r) => r.test(k)), isDerived: (k) => dset.has(k) };
}
/** 静的な代入の鍵(sim の関数を除くのは呼び出し側) */
export function assignedKeys(html) {
  const out = new Set();
  for (const m of html.matchAll(/\bS\.([A-Za-z_$][\w$]*)\s*(?:=(?!=)|\+=|-=|\*=|\/=|\|\|=|\?\?=|&&=|\+\+|--)/g)) out.add(m[1]);
  return out;
}

export function measure(H, html, o) {
  const E = H.evalExpr, HP = H.HP, steps = (o && o.steps) || 3;
  const R = registryOf(E, html);
  if (o && o.drop) for (const k of o.drop) R.names.delete(k);   // 対照(登録を外すと漏れとして見つかるか —— QA の否定の対照だけが使う)
  const scratch = new Set(E("typeof SIM_STEP_SCRATCH!=='undefined' ? SIM_STEP_SCRATCH.slice() : []"));
  const fnKeys = new Set(Object.keys(E('sim')).filter((k) => typeof E('sim')[k] === 'function'));
  const A = [...assignedKeys(html)].filter((k) => !fnKeys.has(k));
  const want = o && o.ids;
  const live = HP.allPresets().filter((p) => p.familyRole !== 'retired' && (!want || want.includes(p.id)));
  const changed = new Map(), seen = new Set(), carried = [];
  for (const p of live) {
    HP.loadPreset(p.id, false);
    const G = E('sim'), F = E('makeSim')();
    F.build(JSON.parse(JSON.stringify(E('currentPreset'))));
    if (E('qLockOn')) E('applyQLock')(F);
    F.overlays = Object.assign({}, G.overlays);
    const pg = simPrint(G), pf = simPrint(F), d = printDiff(pg, pf);
    const car = d.onlyA.filter((k) => !scratch.has(k)), val = d.val.filter((k) => !scratch.has(k));
    if (car.length || val.length) carried.push({ id: p.id, emoji: p.emoji || '', carried: car, val });
    for (const k of Object.keys(pg)) seen.add(k);
    const dt = E('appStepDt')(G);
    for (let s = 0; s < steps; s++) G.step(dt);
    const p2 = simPrint(G);
    for (const k of Object.keys(p2)) { seen.add(k); if (pg[k] !== p2[k]) { if (!changed.has(k)) changed.set(k, []); changed.get(k).push(p.emoji || p.id); } }
  }
  const leaks = [...changed.keys()].filter((k) => !R.isReg(k) && !R.isDerived(k)).sort()
    .map((k) => ({ key: k, books: changed.get(k).length, sample: changed.get(k).slice(0, 6).join(''), assigned: A.includes(k) }));
  const aOut = A.filter((k) => !R.isReg(k) && !R.isDerived(k));
  const derivedUsed = R.derived.map((d) => ({ key: d.key, kind: d.kind, changed: changed.has(d.key) ? changed.get(d.key).length : 0, seen: seen.has(d.key) }));
  return {
    books: live.length, steps,
    registry: { names: R.names.size, regex: R.res.map(String), derived: R.derived.length, copyFns: COPY_FNS },
    static: { assigned: A.length, outside: aOut.length, outsideSeen: aOut.filter((k) => seen.has(k)).length, outsideStepChanged: aOut.filter((k) => changed.has(k)).length,
      outsideUnseen: aOut.filter((k) => !seen.has(k)).sort() },
    dynamic: { stepChangedKeys: changed.size, leaks, carried },
    derivedUsed,
    detections: leaks.length + carried.length,
  };
}

export async function main() {
  const TARGET = process.env.W302E_SC_TARGET || 'beta/index.html';
  const OUT = process.env.W302E_SC_OUT || path.join(ROOT, 'tests', 'out', 'statecontract-w302e.json');
  const BASE = process.env.W302E_BASE || null;
  const steps = Number(process.env.W302E_SC_STEPS) || 3;
  const htmlPath = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(htmlPath, REGEN_SCOPE);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const now = measure(loadHtmlHeadless(htmlPath), html, { steps });
  let base = null;
  if (BASE) { const bp = path.isAbsolute(BASE) ? BASE : path.join(ROOT, BASE); const bh = fs.readFileSync(bp, 'utf8');
    const b = measure(loadHtmlHeadless(bp), bh, { steps });
    base = { file: BASE, sha256: crypto.createHash('sha256').update(bh).digest('hex').slice(0, 12), detections: b.detections, leaks: b.dynamic.leaks, carried: b.dynamic.carried, registry: b.registry }; }
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w302e-statecontract.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(html).digest('hex'),
    ruling: 'DECISIONS v60 AN305 ②⑧(新しい状態の鍵の登録の lint・前の本の持ち越しの検出)・統括の検証項目 R189',
    ...now, base,
    gates: { leaks0: now.dynamic.leaks.length === 0, carried0: now.dynamic.carried.length === 0 } };
  out.ok = Object.values(out.gates).every(Boolean);
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w302e-statecontract.mjs', 'tests/exp-w301f-clone.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第302便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['状態の契約が完全になった'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, 'detections', out.detections, base ? 'base ' + base.detections : '', out.elapsedS + ' s');
}
if (IS_MAIN) await main();

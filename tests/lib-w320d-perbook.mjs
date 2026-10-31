// 第320便d(決断事項 AN478・統括の検証項目 R265): **領域の差の分類(核・本・表示)と、本ごとに分けられる器の名簿**(純関数 —— 走らせない・正本を書かない)。
//
// ■ 何のためか
//   再生成の計画(tests/lib-w281a-regentable.mjs の planRegen)は段ごとに regen/reuse を出すが、「なぜ動くか」は文字列の cause だけで、
//   **本 1 冊の宣言を変えただけの便**と**エンジンの式を変えた便**を分けて数えられなかった(第319便の鎖 —— 本を 1 本足す変更で regen 86 段)。
//   本 lib は (1) 刻印時の html と今の html の領域 hash の内訳(scopeHash の parts)の差を **核・本・表示** に分類し、
//   (2) 段の器が**本ごとに分けられるか**の名簿(機械の読み —— 器の --only/--merge・正本の本ごとの行・全体集計/共有フィット/対の比較の印)を作り、
//   (3) 両方を合わせて「この段は本 X の変更だけで動く —— 本ごとに走らせ直せる候補 / 全体の再走」を計画の行ごとに出す。
//
// ■ 分類(段ごと —— 刻印した html と今の html の parts)
//   display … 対象 html は違うが領域 hash が同じ(表示・CSS・閉包の外の関数だけの変更 —— 計画は元から reuse)
//   book    … 差が**本の生の定義/受理後の定義だけ**(parts.presetsRaw・presetsAccepted —— 本の id の集合 books)。閉包・HP・S._core・定数・版の差なし
//   core    … 閉包の関数・HP・S._core・定数・領域の版のどれかが違う(エンジンの式・受理器・定数 —— 宣言した全本に効く)
//   none    … parts の差なし(版・停止集合だけ —— scopeCause の「内訳の差なし」)
//   nodecl  … 領域の宣言が無い(html 全体を刻む段)/ other … 対象 html 以外の理由(器・lib・入力・刻印の欠け)/ unknown … 刻印時の html が手元に無い
//
// ■ 名簿の段の型(tier —— 機械の読み。**器の --only/--merge の実装は名簿の上位から**・本便は判定と名簿まで)
//   A  本ごとに分けられる: 器に `--only`(本/系の絞り込み)があり、正本に本ごとの行の容器がある
//   B  本ごとの行の候補: 正本に宣言した本の過半を覆う本ごとの容器があり、全体集計/共有フィット/対の比較の印が無い(器を読んで確かめる)
//   C  全体の再走: 本が 1 冊以下 / 本ごとの容器が無い / 全体集計(presets "all" の数え上げ —— KEEP_ALL_319C)/ 共有フィット(fit・refit)/ 対の比較(A/B・前後・基点)
//   再利用してよいのは**入力 hash・コード・環境の一致する行だけ**(AN478 —— 本ごとの行の再利用の契約。--merge の器が守る条件として名簿に書く)。
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { scopeHash, readDeclaredScope } from './lib-w281a-scope.mjs';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { REGEN_STEPS, KEEP_ALL_319C } from './lib-w281a-regentable.mjs';

export const PERBOOK_VERSION = 'w320d-perbook-1';
/** 名簿の型の版(型の規則を変えたら上げる —— tests/data-w320d-perbook.json の version)。 */
export const ROSTER_VERSION = 'w320d-roster-1';
export const ROSTER_FILE = 'tests/data-w320d-perbook.json';

const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');
const keysDiff = (x, y) => [...new Set([...Object.keys(x || {}), ...Object.keys(y || {})])].filter((k) => (x || {})[k] !== (y || {})[k]).sort();

/**
 * 2 つの scopeHash の結果(同じ宣言 —— 刻印時の html と今の html)の parts の差。
 * @returns {{raw:string[], acc:string[], fn:string[], hp:string[], core:boolean, consts:string[], version:boolean}}
 */
export function partsDiff(a, b) {
  const pa = (a && a.parts) || {}, pb = (b && b.parts) || {};
  const raw = keysDiff(pa.presetsRaw, pb.presetsRaw);
  const acc = keysDiff(pa.presetsAccepted, pb.presetsAccepted);
  return { raw, acc, fn: keysDiff(pa.closure, pb.closure), hp: keysDiff(pa.hp, pb.hp), core: (pa.core || null) !== (pb.core || null),
    consts: keysDiff(pa.consts, pb.consts), version: ((a && a.scope) || {}).version !== ((b && b.scope) || {}).version };
}

/**
 * parts の差 → 分類。書く順は「核が 1 つでもあれば core」(本の差があっても core —— 宣言した全本に効く)。
 * @returns {{kind:'core'|'book'|'none', books:string[], core:string[]}}
 */
export function classifyDiff(d) {
  const coreWhy = [];
  if (d.fn.length) coreWhy.push('式: ' + d.fn.slice(0, 4).join(',') + (d.fn.length > 4 ? ` 他 ${d.fn.length - 4}` : ''));
  if (d.hp.length) coreWhy.push('式(HP): ' + d.hp.join(','));
  if (d.core) coreWhy.push('S._core');
  if (d.consts.length) coreWhy.push('定数: ' + d.consts.join(','));
  if (d.version) coreWhy.push('領域の版');
  const books = [...new Set(d.raw.concat(d.acc))].sort();
  if (coreWhy.length) return { kind: 'core', books, core: coreWhy };
  if (books.length) return { kind: 'book', books, core: [] };
  return { kind: 'none', books: [], core: [] };
}

// ---- 名簿 ----
/** 共有フィットの印(段の key か注記)。 */
export const SHARED_FIT_RE = /(^|[^a-z])(re)?fit|フィット|共同根|較正/i;
/** 対の比較の印(注記 —— 基点 html と今・前後・A/B)。 */
export const PAIR_RE = /BASE_HTML|基点 html|前後|A\/B|対照の対|2 つを比べる/;
/** 内蔵の本の id(headless の BUILTIN_PRESETS —— 退役を含む。html の文字列の id:"…" は本の外の id も拾うので使わない)。 */
export function builtinIdsOf(htmlPath) {
  const L = loadHtmlHeadless(htmlPath);
  return L.evalExpr('BUILTIN_PRESETS').map((p) => p.id);
}

/** 正本の中の「本ごとの容器」(宣言した本の id を 2 つ以上 鍵に持つ object / 要素の id に持つ配列)の JSON Pointer(深さ 6 まで・meta を除く)。 */
export function perBookContainers(J, ids) {
  const IDS = ids instanceof Set ? ids : new Set(ids);
  const out = [];
  const walk = (v, ptr, depth) => {
    if (!v || typeof v !== 'object' || depth > 6) return;
    if (Array.isArray(v)) {
      const hit = new Set(v.map((x) => (x && typeof x === 'object') ? (x.id || x.preset || x.presetId) : null).filter((x) => IDS.has(x)));
      if (hit.size >= 2) out.push({ ptr: ptr || '/', kind: 'array', books: [...hit].sort() });
      v.slice(0, 64).forEach((x, i) => walk(x, ptr + '/' + i, depth + 1));
      return;
    }
    const hit = Object.keys(v).filter((k) => IDS.has(k));
    if (hit.length >= 2) out.push({ ptr: ptr || '/', kind: 'object', books: hit.sort() });
    for (const k of Object.keys(v)) if (!(depth === 0 && k === 'meta')) walk(v[k], ptr + '/' + k.replace(/~/g, '~0').replace(/\//g, '~1'), depth + 1);
  };
  walk(J, '', 0);
  return out;
}

/**
 * 本ごとに分けられる器の名簿(機械の読み)。現行の段(履歴を除く)ごとに 1 行。
 * @param {{root:string, html?:string, builtinIds?:string[], steps?:Array}} o
 */
export function buildRoster(o) {
  const root = o.root.replace(/\/$/, '');
  const steps = o.steps || REGEN_STEPS;
  const builtin = o.builtinIds || builtinIdsOf(o.html || (root + '/beta/index.html'));
  const keepAll = new Map(KEEP_ALL_319C.map((z) => [z.key, z.why]));
  const rows = [];
  for (const st of steps) {
    if (st.role === 'history' || st.outside) continue;
    const m = /node (tests\/exp-[\w-]+\.mjs)/.exec(st.cmd || '');
    const harness = m ? m[1] : null;
    let text = '';
    if (harness) { try { text = fs.readFileSync(root + '/' + harness, 'utf8'); } catch { text = ''; } }
    const decl = text ? readDeclaredScope(text) : null;
    const declBooks = decl ? (decl.presets === 'all' ? builtin : (decl.presets || [])) : [];
    const ids = new Set(declBooks.length ? declBooks : builtin);
    let cont = [];
    for (const f of (st.outs || [])) {
      try { const J = JSON.parse(fs.readFileSync(root + '/' + f, 'utf8')); cont = cont.concat(perBookContainers(J, ids).map((z) => Object.assign({ out: f }, z))); } catch { /* 正本が無い */ }
    }
    const best = cont.slice().sort((x, y) => y.books.length - x.books.length)[0] || null;
    const only = /['"`]--only['"`]/.test(text), merge = /['"`]--merge['"`]/.test(text);
    const note = String(st.note || '');
    const why = [];
    let tier;
    const nDecl = decl ? (decl.presets === 'all' ? 'all' : declBooks.length) : null;
    if (!decl) { tier = 'C'; why.push('領域の宣言なし(html 全体か html を読まない —— 本の差を分けられない)'); }
    else if (decl.presets !== 'all' && declBooks.length <= 1) { tier = 'C'; why.push('本が 1 冊以下(本ごと = 全体)'); }
    else if (keepAll.has(st.key)) { tier = 'C'; why.push('全体集計: ' + keepAll.get(st.key)); }
    else if (SHARED_FIT_RE.test(st.key) || /共有フィット|共同根|フィットの本/.test(note)) { tier = 'C'; why.push('共有フィット(段の名か注記 —— 本どうしで 1 つの係数)'); }
    else if (PAIR_RE.test(note) || /BASE_HTML/.test(JSON.stringify(st.env || {}))) { tier = 'C'; why.push('対の比較(基点 html と今・前後・A/B)'); }
    else if (!best) { tier = 'C'; why.push('正本に本ごとの容器が無い(宣言の本は下限 —— 凍結の写し・参照の本を含む)'); }
    else if (only && best) { tier = 'A'; why.push('器に --only があり正本に本ごとの容器 ' + best.out.replace('tests/out/', '') + '#' + best.ptr + '(' + best.books.length + ' 本)'); }
    else if (best && best.books.length * 2 >= ids.size) { tier = 'B'; why.push('正本に宣言の本の過半を覆う本ごとの容器 ' + best.out.replace('tests/out/', '') + '#' + best.ptr + '(' + best.books.length + '/' + ids.size + ' 本 —— 器を読んで確かめる)'); }
    else { tier = 'C'; why.push('本ごとの容器が宣言の本の過半を覆わない(' + (best ? best.books.length : 0) + '/' + ids.size + ' —— 宣言の多くは参照・凍結の写し)'); }
    rows.push({ key: st.key, harness, sec: Number(st.sec) || 0, presets: nDecl, only, merge, tier, why: why.join(' / '),
      container: best ? { out: best.out, ptr: best.ptr, kind: best.kind, n: best.books.length } : null });
  }
  const count = { A: 0, B: 0, C: 0 };
  for (const r of rows) count[r.tier]++;
  const secOf = (t) => Math.round(rows.filter((r) => r.tier === t).reduce((s, r) => s + r.sec, 0));
  return { version: ROSTER_VERSION, lib: PERBOOK_VERSION, count, sec: { A: secOf('A'), B: secOf('B'), C: secOf('C') },
    reuseContract: '本ごとの行を再利用してよいのは入力 hash(本の生の定義と受理後の定義の hash)・コード(器と lib の sha)・環境(Node と Chromium の版)の一致する行だけ(AN478)',
    rows };
}
/** 名簿の文書(書く形 —— --write と --check が同じ形)。数え上げの秒は表の見積り(regensec の上書き後)。 */
export function rosterDoc(o) {
  const r = buildRoster(o);
  return { version: r.version, lib: r.lib, count: r.count, secByTier: r.sec, reuseContract: r.reuseContract,
    note: '機械の読み(器の --only/--merge・正本の本ごとの容器・全体集計/共有フィット/対の比較の印)。A = 本ごとに分けられる(--merge の実装は名簿の上位から)・B = 器を読んで確かめる候補・C = 全体の再走',
    rows: r.rows.map((z) => ({ key: z.key, tier: z.tier, presets: z.presets, only: z.only, merge: z.merge, why: z.why })) };
}

// ---- 計画の分類 ----
/**
 * 刻印時の html を探す(sha256 → ファイル)。候補: 渡したファイル・git の beta/index.html の履歴(gitDepth 本まで —— 写しは dir に置く)。
 * @param {{root:string, shas:string[], files?:string[], gitDepth?:number, dir?:string}} o
 * @returns {Map<string,string>}
 */
export function findStampHtmls(o) {
  const want = new Set(o.shas || []);
  const out = new Map();
  for (const f of (o.files || [])) { try { const s = sha256(fs.readFileSync(f)); if (want.has(s)) out.set(s, f); } catch { /* 無い */ } }
  if (!(o.gitDepth > 0) || [...want].every((s) => out.has(s))) return out;
  const dir = o.dir || fs.mkdtempSync(path.join(os.tmpdir(), 'w320d-stamp-'));
  let revs = [];
  try { revs = execFileSync('git', ['-C', o.root, 'log', '--format=%H', '-n', String(o.gitDepth), '--', 'beta/index.html'], { encoding: 'utf8' }).split('\n').filter(Boolean); } catch { revs = []; }
  for (const h of revs) {
    if ([...want].every((s) => out.has(s))) break;
    let buf = null;
    try { buf = execFileSync('git', ['-C', o.root, 'show', h + ':beta/index.html'], { maxBuffer: 1 << 30 }); } catch { continue; }
    const s = sha256(buf);
    if (!want.has(s) || out.has(s)) continue;
    const f = path.join(dir, 'stamp-' + s.slice(0, 12) + '.html');
    fs.writeFileSync(f, buf);
    out.set(s, f);
  }
  return out;
}

/**
 * 計画(planRegen の結果)の行ごとの分類。scopeHash を刻印時の html ごとにまとめて引く(headless の写しは html 1 つずつ —— 行き来しない)。
 * @param {object} plan planRegen の結果
 * @param {{root:string, html:string, stampHtmls:Map<string,string>, roster?:object, keys?:string[]}} o
 * @returns {{rows:Array, count:object, books:object}}
 */
export function classifyPlan(plan, o) {
  const root = o.root.replace(/\/$/, '');
  const htmlNow = o.html;
  const htmlNowSha = sha256(fs.readFileSync(htmlNow));
  const roster = o.roster || buildRoster({ root });
  const tierOf = new Map(roster.rows.map((z) => [z.key, z.tier]));
  const by = new Map(REGEN_STEPS.map((z) => [z.key, z]));
  const jobs = [];
  const rows = [];
  for (const r of plan.steps || []) {
    if (o.keys && !o.keys.includes(r.key)) continue;
    if (r.status === 'history') continue;
    const st = by.get(r.key);
    const res = { key: r.key, status: r.status, kind: null, books: [], core: [], tier: tierOf.get(r.key) || 'C', outs: [] };
    for (const f of ((st && st.outs) || [])) {
      let m = null;
      try { m = (JSON.parse(fs.readFileSync(root + '/' + f, 'utf8')) || {}).meta || null; } catch { m = null; }
      if (!m || m.target !== 'beta/index.html') { res.outs.push({ out: f, kind: 'other' }); continue; }
      if (!(m.scope && m.scopeComplete === true)) { res.outs.push({ out: f, kind: m.targetSha256 === htmlNowSha ? 'same' : 'nodecl' }); continue; }
      if (m.targetSha256 === htmlNowSha) { res.outs.push({ out: f, kind: 'same' }); continue; }
      const stampHtml = o.stampHtmls.get(m.targetSha256);
      if (!stampHtml) { res.outs.push({ out: f, kind: 'unknown' }); continue; }
      const job = { out: f, scope: m.scope, stampHtml, res };
      jobs.push(job);
      res.outs.push(job);
    }
    rows.push(res);
  }
  // 刻印時の html ごとに引く → 今の html で引く(写しの読み込みを 2 回 × html の数に抑える)
  const cache = new Map();
  const hashOn = (h, sc) => { const k = h + '|' + JSON.stringify(sc); if (!cache.has(k)) { let v = null; try { v = scopeHash(h, sc); } catch { v = null; } cache.set(k, v); } return cache.get(k); };
  const groups = [...new Set(jobs.map((j) => j.stampHtml))];
  for (const g of groups) for (const j of jobs.filter((z) => z.stampHtml === g)) j.a = hashOn(g, j.scope);
  for (const j of jobs) j.b = hashOn(htmlNow, j.scope);
  for (const j of jobs) {
    if (!j.a || !j.b) { j.kind = 'unknown'; continue; }
    if (j.a.scopeSha256 === j.b.scopeSha256) { j.kind = 'display'; continue; }
    const c = classifyDiff(partsDiff(j.a, j.b));
    j.kind = c.kind; j.books = c.books; j.core = c.core;
  }
  // 段の分類(正本の中で最も強い型: core > book > none > nodecl > unknown > display > same > other)
  const RANK = ['core', 'book', 'none', 'nodecl', 'unknown', 'display', 'same', 'other'];
  const count = {};
  const bookSteps = {};
  for (const res of rows) {
    const ks = res.outs.map((z) => z.kind);
    res.kind = ks.length ? RANK.find((k) => ks.includes(k)) : 'other';
    res.books = [...new Set(res.outs.flatMap((z) => z.books || []))].sort();
    res.core = [...new Set(res.outs.flatMap((z) => z.core || []))];
    res.outs = res.outs.map((z) => ({ out: z.out, kind: z.kind }));
    res.text = res.kind === 'book'
      ? ('本 ' + res.books.join(',') + ' の変更だけで動く —— ' + (res.tier === 'A' ? '本ごとに走らせ直せる(器に --only・名簿 A)' : res.tier === 'B' ? '本ごとの候補(名簿 B —— 器を読んで確かめる)' : '全体の再走(名簿 C)'))
      : res.kind === 'core' ? ('核: ' + res.core.join(' / ')) : res.kind === 'display' ? '表示だけ(領域 hash は同じ)' : res.kind;
    count[res.kind] = (count[res.kind] || 0) + 1;
    if (res.kind === 'book') for (const b of res.books) (bookSteps[b] = bookSteps[b] || []).push(res.key);
  }
  return { version: PERBOOK_VERSION, count, books: bookSteps, rows };
}

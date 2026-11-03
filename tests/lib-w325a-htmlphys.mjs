// 第325便a(原仮定者の指示(2026-11-03)「次便以降で、再生成の段の対象が宣言なしの場合、html全体にしない。html全体だと、版名が変わっただけや、
//   説明文だけの修正でも走ってしまう」・原仮定者の指示(2026-11-01)「今後は、サンプルの変更だけでは、全行程を再実行しない様にする」・統括の検証項目 R284):
//   **html の物理の部分の hash**(領域の宣言の無い段の既定 —— html 全体にしない)。
//
// ■ 何をするか
//   領域の宣言(REGEN_SCOPE —— tests/lib-w281a-scope.mjs)を持たず html 全体の sha を刻む正本は、版名の行が 1 字変わるだけで「走らせ直せ」になっていた。
//   本 lib は html を**部分**(parts)に分けてそれぞれの hash を引き、段が読むと宣言した部分(reads)だけで刻印の html と今の html を比べる:
//     code       … inline script の最上位の文(注釈を除いた本文 —— normText)。次の 4 つは**外して**置き換えの印にする:
//                    版名の行 BETA_BUILD の値・文の登録簿(生成領域 i18n の最上位の文 + ACCEPT_REASONS・LAWS・SYSTEM_PROMPT)・内蔵の本の配列 BUILTIN_PRESETS
//                    (本は presets で別に見る)・生成領域 sample-status の最上位の文(samplestatus が書く一覧)
//     presets    … 内蔵の本(headless で評価した BUILTIN_PRESETS)の**表示だけの欄を外した**写し(本ごとの hash と並び)。外す欄は領域 hash の版 6
//                  (w318a-scope-6)と同じ集合を**本 lib に凍結した写し**(PROSE_325A —— 版 6 の集合と同じことを QA lint.htmlPhys325a が照合)
//     markup     … script の外(マークアップ・CSS —— HTML の注釈を除く)
//     comments   … 注釈(JS の注釈と HTML の注釈)の文 —— 注釈を名指しで読む器だけが宣言する
//                  code の中の**表示の文の対**(`{ja:"…", en:"…"}` —— 2 つの鍵が ja と en だけで値がどちらも素の文字列の object)も外して textPairs で見る
//     build      … 版名の値 / text:<名> … 文の登録簿の文ごと / regions:<名> … 生成領域の中身 / textPairs … code の中の表示の文の対(出た順)
//     presetFull:<id> … 本の表示の欄を含む全体 / presetPhys:<id> … 本ごとの表示の欄を外した写し / presetIds … 本の id の並び
//   刻印の html は **台帳**(tests/data-w325a-htmlphys.json —— html の sha → 部分の hash)・基点の html・git の履歴(beta/index.html の各版の blob)から sha で引く。
//   **正本のファイルは書き換えない**(移行は計画と QA の側 —— 正本を刻み直すとそれを入力に読む下流の安定 hash が動いて鎖が広がる)。
//
// ■ しないこと
//   ・「物理の部分が同じだから結果が同じ」とは言わない —— 一致は**段が読むと宣言した部分が同じ html を読んだ**ことだけを意味する
//     (器・lib・入力ファイルは従来どおり meta.code[]・inputs[] の完全 sha と安定 hash で縛る)。
//   ・行番号は部分に入れない(説明の欄の行数が変わると全部の行が動く)—— 正本が出す行番号・証拠の行は**刻印の html**(meta.targetSha256)の行である。
//   ・宣言の無い段に既定を当てない(宣言の無い html 全体の段は従来どおり html 全体 —— QA lint.htmlPhys325a が名指しで落とす)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseTopLevel, scanJs, normText, canonJson, scopeOkNow } from './lib-w281a-scope.mjs';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

/** 部分の作り方の版(外す集合・部分の形を変えたら上げる —— 旧版の台帳の行は旧版のまま照合する)。 */
export const HTMLPHYS_VERSION = 'w325a-htmlphys-1';
export const HTMLPHYS_VERSIONS = Object.freeze([HTMLPHYS_VERSION]);
/** 台帳(html の sha → 部分の hash)。 */
export const HTMLPHYS_LEDGER_FILE = 'tests/data-w325a-htmlphys.json';
export const HTMLPHYS_LEDGER_VERSION = 'w325a-htmlphys-ledger-1';
/** 対象の html(正本の meta.target)。 */
export const HTMLPHYS_TARGET = 'beta/index.html';

/** 版名の行の名(値だけを外す —— 名前と使う所は code に残る)。 */
export const BUILD_NAME_325A = 'BETA_BUILD';
/** 文の登録簿(領域 hash の版 6 の TEXT_REGISTRIES と同じ 4 つ —— 凍結の写し)と、文だけの生成領域。 */
export const TEXT_REGISTRIES_325A = Object.freeze(['I18N', 'ACCEPT_REASONS', 'LAWS', 'SYSTEM_PROMPT']);
export const TEXT_REGIONS_325A = Object.freeze(['i18n']);
/** code から外す生成領域(samplestatus が書く一覧 —— 中身は regions:<名> で別に見る)。 */
export const STRIP_REGIONS_325A = Object.freeze(['sample-status']);
/** 内蔵の本の配列の名。 */
export const PRESETS_NAME_325A = 'BUILTIN_PRESETS';
/**
 * 本の表示だけの欄(領域 hash の版 6 —— tests/lib-w281a-scope.mjs の PROSE_KEYS + PROSE_KEYS_ADDED_318・CLAIM/CHAIN/MASSCAL_PROSE_KEYS・
 * AB_BODY_PROSE_KEYS —— と同じ集合の**凍結の写し**。領域 hash の版が上がっても本 lib の版 1 の意味は変えない)。
 */
export const PROSE_325A = Object.freeze({
  top: Object.freeze(['descStruct', 'en', 'description', 'status', 'notClaim', 'obsCard', 'failureFirst', 'parameterAudit', 'fidelity', 'emoji', 'familyRole', 'name']),
  claim: Object.freeze(['note', 'noteEn', 'roleNote', 'roleNoteEn']),
  chain: Object.freeze(['note', 'noteEn']),
  massCalibration: Object.freeze(['note', 'noteEn']),
  abBody: Object.freeze(['label']),
});
/** 部分の名(reads に書ける名 —— text:・regions:・presetFull:・presetPhys: は後ろに名か id か *)。 */
export const HTMLPHYS_PARTS = Object.freeze(['code', 'presets', 'markup', 'comments', 'build', 'textPairs', 'presetIds', 'text:', 'regions:', 'presetFull:', 'presetPhys:']);
/** 既定の reads(物理の部分 —— 段の宣言はこれに足すか、本を名指しに絞る)。code と markup はどの宣言にも要る(QA lint.htmlPhys325a)。 */
export const HTMLPHYS_DEFAULT_READS = Object.freeze(['code', 'presets', 'markup']);
export const HTMLPHYS_REQUIRED_READS = Object.freeze(['code', 'markup']);
/** 生の行を読む器(html の文字列を直に走査して行・証拠の行を出す)の reads —— 版名の外を全部。 */
export const HTMLPHYS_RAW_READS = Object.freeze(['code', 'presets', 'markup', 'comments', 'textPairs', 'presetIds', 'presetFull:*', 'text:*', 'regions:*']);
/** code の中の表示の文の対(`{ja:"…", en:"…"}` —— 鍵は ja と en の 2 つだけ・値はどちらも素の文字列〔テンプレートは除く〕)。 */
const STR_325A = String.raw`"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'`;
export const TEXT_PAIR_RE_325A = new RegExp(String.raw`\{\s*(ja|en)\s*:\s*(` + STR_325A + String.raw`)\s*,\s*(ja|en)\s*:\s*(` + STR_325A + String.raw`)\s*\}`, 'g');

const sha256 = (s) => crypto.createHash('sha256').update(typeof s === 'string' ? Buffer.from(s, 'utf8') : s).digest('hex');

const dropStr = (o, keys) => {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return o;
  const r = {};
  for (const k of Object.keys(o)) if (!(keys.indexOf(k) >= 0 && typeof o[k] === 'string')) r[k] = o[k];
  return r;
};
const proseLeaves = (x) => (typeof x === 'string') || (!!x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).every((k) => proseLeaves(x[k])));
/** 本の表示だけの欄を外した写し(領域 hash の版 6 の stripPresetProse と同じ規則 —— 凍結の写し)。 */
export function stripProse325(p) {
  const o = {};
  for (const k of Object.keys(p || {}).sort()) if (PROSE_325A.top.indexOf(k) < 0) o[k] = p[k];
  if (Array.isArray(o.claims)) o.claims = o.claims.map((c) => {
    const c2 = dropStr(c, PROSE_325A.claim);
    if (c2 && typeof c2 === 'object' && c2.chain && typeof c2.chain === 'object' && !Array.isArray(c2.chain)) c2.chain = dropStr(c2.chain, PROSE_325A.chain);
    return c2;
  });
  if (o.massCalibration && typeof o.massCalibration === 'object') o.massCalibration = dropStr(o.massCalibration, PROSE_325A.massCalibration);
  if (o.abBody && typeof o.abBody === 'object' && !Array.isArray(o.abBody)) {
    const r = {};
    for (const k of Object.keys(o.abBody)) if (!(PROSE_325A.abBody.indexOf(k) >= 0 && proseLeaves(o.abBody[k]))) r[k] = o.abBody[k];
    o.abBody = r;
  }
  return o;
}

const genBegin = (r) => '// >>> w275a-generated: ' + r;
const genEnd = (r) => '// <<< w275a-generated: ' + r;

/**
 * html の本文から部分の hash を引く(純関数 —— 本を評価するために html を一時ファイルへ書くことがある: o.htmlPath があればそれを使う)。
 * @param {string|Buffer} htmlText html の本文
 * @param {{htmlPath?:string, tmpDir?:string}} [o]
 * @returns {{version:string, sha256:string, parts:object, detail:object}}
 */
export function htmlPhysPartsOfText(htmlText, o) {
  const opt = o || {};
  const buf = Buffer.isBuffer(htmlText) ? htmlText : Buffer.from(String(htmlText), 'utf8');
  const html = buf.toString('utf8');
  const why = [];
  const sIdx = html.indexOf('<script>');
  const eIdx = html.lastIndexOf('</script>');
  if (sIdx < 0 || eIdx < sIdx) why.push('inline script が無い');
  const src = sIdx >= 0 && eIdx > sIdx ? html.slice(sIdx + '<script>'.length, eIdx) : '';
  // ---- markup(script の外 —— HTML の注釈を除く)と HTML の注釈
  const outside = sIdx >= 0 && eIdx > sIdx ? html.slice(0, sIdx) + '<script></script>' + html.slice(eIdx + '</script>'.length) : html;
  const htmlComments = [];
  const markup = normText(outside.replace(/<!--[\s\S]*?-->/g, (m0) => { htmlComments.push(m0); return ''; }));
  // ---- code(最上位の文 —— 注釈を除いた本文)
  const P = parseTopLevel(src);
  if (!P.selfCheck.ok) why.push('潰した写しの括弧の収支が 0 でない');
  const regionRange = (r) => { const a = src.indexOf(genBegin(r)), b = src.indexOf(genEnd(r)); return (a >= 0 && b > a) ? [a, b] : null; };
  const stripR = STRIP_REGIONS_325A.map((r) => [r, regionRange(r)]);
  const textR = TEXT_REGIONS_325A.map((r) => [r, regionRange(r)]);
  for (const [r, rg] of stripR.concat(textR)) if (!rg) why.push('生成領域が無い: ' + r);
  const inRange = (seg, rg) => !!rg && seg.start >= rg[0] && seg.start < rg[1];
  const lines = [];
  const text = {}, regions = {};
  let build = null, nPresets = 0;
  const cutNames = [];
  for (const seg of P.segments) {
    const nm = seg.names || [];
    const reg = stripR.find(([, rg]) => inRange(seg, rg));
    if (reg) { const k = reg[0]; regions[k] = (regions[k] || '') + seg.text + '\n'; continue; }
    const tr = textR.find(([, rg]) => inRange(seg, rg));
    const reg2 = nm.find((n) => TEXT_REGISTRIES_325A.indexOf(n) >= 0);
    if (tr || reg2) {
      const k = (nm.length ? nm.join(',') : '(stmt)');
      text[k] = (text[k] ? text[k] + '\n' : '') + seg.text;
      lines.push('/*w325a:text:' + k + '*/');
      cutNames.push(k);
      continue;
    }
    if (nm.indexOf(PRESETS_NAME_325A) >= 0) { lines.push('/*w325a:presets*/'); nPresets++; continue; }
    if (nm.indexOf(BUILD_NAME_325A) >= 0) {
      const re = new RegExp('(\\b' + BUILD_NAME_325A + '\\s*=\\s*)("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')');
      const m = re.exec(seg.text);
      if (m) { build = m[2]; lines.push(seg.text.replace(re, '$1"<w325a:build>"')); continue; }
      why.push('版名の行の値が文字列でない');
    }
    lines.push(seg.text);
  }
  // 表示の文の対を外す(textPairs —— 出た順)
  const pairs = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('ja') < 0 || lines[i].indexOf('en') < 0) continue;
    lines[i] = lines[i].replace(TEXT_PAIR_RE_325A, (m0, k1, v1, k2, v2) => { if (k1 === k2) return m0; pairs.push(m0); return '{' + k1 + ':"<w325a:pair>",' + k2 + ':"<w325a:pair>"}'; });
  }
  if (build === null) why.push('版名の行が無い: ' + BUILD_NAME_325A);
  if (nPresets !== 1) why.push('内蔵の本の配列の宣言が ' + nPresets + ' 個');
  for (const r of STRIP_REGIONS_325A) if (regions[r] === undefined) regions[r] = '';
  const code = lines.join('\n');
  // ---- comments(JS の注釈 = 本文と注釈を潰した写しが違う所 —— 連続を 1 行に)
  const cm = [];
  {
    let cur = '';
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (ch !== P.nocom[i]) { cur += ch; continue; }
      if (!cur) continue;
      if (ch === ' ' || ch === '\t') { cur += ch; continue; }   // 注釈の中の空白(潰した写しでも空白)
      cm.push(cur.replace(/\s+$/, '')); cur = '';
    }
    if (cur) cm.push(cur.replace(/\s+$/, ''));
  }
  const comments = cm.concat(htmlComments).join('\n');
  // ---- presets(headless で評価した内蔵の本 —— 本ごと)
  const presetPhys = {}, presetFull = {}, order = [];
  let presetsSha = null;
  {
    let file = opt.htmlPath || null, tmp = null;
    try {
      if (!file) {
        const dir = fs.mkdtempSync(path.join(opt.tmpDir || os.tmpdir(), 'w325a-htmlphys-'));
        tmp = dir; file = path.join(dir, 'index.html');
        fs.writeFileSync(file, buf);
      }
      const L = loadHtmlHeadless(file);
      const B = L.evalExpr(PRESETS_NAME_325A);
      if (!Array.isArray(B)) throw new Error('BUILTIN_PRESETS が配列でない');
      for (const p of B) {
        const id = String(p && p.id);
        order.push(id);
        presetPhys[id] = sha256(canonJson(stripProse325(p)));
        presetFull[id] = sha256(canonJson(p));
      }
      presetsSha = sha256(canonJson({ order, phys: presetPhys }));
    } catch (e) { why.push('内蔵の本を評価できない: ' + String(e && e.message || e).slice(0, 120)); }
    finally { if (tmp) { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* 残っても害は無い */ } } }
  }
  const parts = {
    code: sha256(code), presets: presetsSha, markup: sha256(markup), comments: sha256(comments),
    build: build === null ? null : sha256(build),
    textPairs: sha256(pairs.join('\n')),
    presetIds: order.length ? sha256(order.join('\n')) : null,
    presetPhys,
    text: Object.fromEntries(Object.keys(text).sort().map((k) => [k, sha256(text[k])])),
    regions: Object.fromEntries(Object.keys(regions).sort().map((k) => [k, sha256(regions[k])])),
    presetFull,
  };
  return { version: HTMLPHYS_VERSION, sha256: sha256(buf), complete: why.length === 0, parts,
    detail: { why, segments: P.segments.length, textCut: cutNames, regionsCut: STRIP_REGIONS_325A.slice(), presets: order.length, textPairs: pairs.length,
      codeBytes: code.length, scriptBytes: src.length, markupBytes: markup.length } };
}

const partsCache = new Map();   // html の sha → 部分(1 つの走行の中だけ)
/** html のファイルから部分を引く(sha で控える)。 */
export function htmlPhysParts(htmlPath) {
  const buf = fs.readFileSync(htmlPath);
  const s = sha256(buf);
  if (!partsCache.has(s)) partsCache.set(s, htmlPhysPartsOfText(buf, { htmlPath }));
  return partsCache.get(s);
}

/** reads の 1 項の値を部分から引く(無ければ undefined)。 */
export function partValue(parts, item) {
  if (!parts) return undefined;
  const i = item.indexOf(':');
  if (i < 0) return parts[item];
  const k = item.slice(0, i + 1), n = item.slice(i + 1);
  const m = k === 'text:' ? parts.text : k === 'regions:' ? parts.regions : k === 'presetFull:' ? parts.presetFull : k === 'presetPhys:' ? parts.presetPhys : null;
  if (!m) return undefined;
  if (n === '*') return sha256(canonJson(m));   // 全部(名と値の並び)
  return m[n];
}

/** reads の検査(名が部分の名か)。 */
export function readsProblems(reads) {
  const out = [];
  if (!Array.isArray(reads) || !reads.length) return ['reads が無い'];
  for (const r of reads) {
    if (typeof r !== 'string' || !r) { out.push('reads の項が文字列でない'); continue; }
    if (HTMLPHYS_PARTS.indexOf(r) >= 0 && !r.endsWith(':')) continue;
    const k = r.slice(0, r.indexOf(':') + 1);
    if (!k || HTMLPHYS_PARTS.indexOf(k) < 0 || r.length === k.length) out.push('知らない部分: ' + r);
  }
  return out;
}

/**
 * 刻印の html の部分と今の html の部分を reads で比べる。
 * @returns {{same:boolean, diff:string[], missing:string[]}}
 */
export function physCompare(stampParts, nowParts, reads) {
  const diff = [], missing = [];
  for (const r of reads || []) {
    const a = partValue(stampParts, r), b = partValue(nowParts, r);
    if (a === undefined || a === null || b === undefined || b === null) { missing.push(r); continue; }
    if (a !== b) diff.push(r);
  }
  return { same: diff.length === 0 && missing.length === 0 && (reads || []).length > 0, diff, missing };
}

// ---------------------------------------------------------------- 台帳
/** 台帳を読む(無ければ空)。 */
export function readLedger(root, file) {
  const f = path.join(String(root).replace(/\/$/, ''), file || HTMLPHYS_LEDGER_FILE);
  try { const J = JSON.parse(fs.readFileSync(f, 'utf8')); return J && J.entries ? J : { version: HTMLPHYS_LEDGER_VERSION, entries: {} }; }
  catch { return { version: HTMLPHYS_LEDGER_VERSION, entries: {} }; }
}
/** 台帳の行(html の sha・部分の版が今の版)。 */
export function ledgerParts(ledger, sha, version) {
  const e = ledger && ledger.entries ? ledger.entries[sha] : null;
  if (!e || e.version !== (version || HTMLPHYS_VERSION) || !e.parts) return null;
  return e.parts;
}
/** 台帳の行を作る(rev は分かれば)。 */
export function ledgerEntry(r, rev, how) {
  return { version: r.version, complete: r.complete, rev: rev || null, from: how || null, parts: r.parts,
    why: r.detail.why.length ? r.detail.why : undefined };
}

// ---------------------------------------------------------------- 刻印の html を引く(基点・候補のファイル・git の履歴)
const gitMemo = new Map();   // root → { revs, bySha: Map(sha → {rev, blob}), scanned }
/**
 * html の sha から本文を引く: ① 候補のファイル(基点 html・計画の html)② git の履歴(`git log -- beta/index.html` の各版の blob —— 一度引いた sha は控える)。
 * @param {{root:string, sha:string, files?:string[], gitDepth?:number}} o gitDepth 既定 200(0 で git を引かない)
 * @returns {{buf:Buffer, from:string, rev:string|null}|null}
 */
export function findHtmlBySha(o) {
  for (const f of (o.files || [])) {
    if (!f) continue;
    try { const b = fs.readFileSync(f); if (sha256(b) === o.sha) return { buf: b, from: 'file:' + f, rev: null }; } catch { /* 無い */ }
  }
  const depth = o.gitDepth === undefined ? 200 : o.gitDepth;
  if (!(depth > 0)) return null;
  const root = String(o.root).replace(/\/$/, '');
  if (!gitMemo.has(root)) {
    let revs = [];
    try { revs = execFileSync('git', ['-C', root, 'log', '--format=%H', '-n', String(depth), '--', HTMLPHYS_TARGET], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean); } catch { revs = []; }
    gitMemo.set(root, { revs, bySha: new Map(), next: 0 });
  }
  const G = gitMemo.get(root);
  const hit = G.bySha.get(o.sha);
  const read = (rev) => execFileSync('git', ['-C', root, 'show', rev + ':' + HTMLPHYS_TARGET], { maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'ignore'] });
  if (hit) { try { return { buf: read(hit.rev), from: 'git:' + hit.rev, rev: hit.rev }; } catch { return null; } }
  while (G.next < G.revs.length) {
    const rev = G.revs[G.next++];
    let b = null;
    try { b = read(rev); } catch { continue; }
    const s = sha256(b);
    if (!G.bySha.has(s)) G.bySha.set(s, { rev });
    if (s === o.sha) return { buf: b, from: 'git:' + rev, rev };
  }
  return null;
}

/**
 * 刻印の html の部分を引く(台帳 → 候補のファイル → git の履歴)。
 * @param {{root:string, sha:string, files?:string[], ledger?:object, gitDepth?:number, tmpDir?:string}} o
 * @returns {{parts:object|null, from:string|null, rev:string|null}}
 */
export function stampParts(o) {
  const L = o.ledger || readLedger(o.root);
  const lp = ledgerParts(L, o.sha);
  if (lp) return { parts: lp, from: 'ledger', rev: (L.entries[o.sha] || {}).rev || null };
  if (partsCache.has(o.sha)) return { parts: partsCache.get(o.sha).parts, from: 'memo', rev: null };
  const h = findHtmlBySha(o);
  if (!h) return { parts: null, from: null, rev: null };
  const r = htmlPhysPartsOfText(h.buf, { htmlPath: h.from.startsWith('file:') ? h.from.slice(5) : undefined, tmpDir: o.tmpDir });
  partsCache.set(o.sha, r);
  return { parts: r.parts, from: h.from, rev: h.rev };
}

// ---------------------------------------------------------------- 照合(計画と QA)
/**
 * 段の宣言(decl —— 再生成表の HTMLPHYS_DECL_325A の行)で、刻印の html と今の html の物理の部分を比べる。
 * @param {{root:string, meta:object, decl:object, html:string, files?:string[], ledger?:object, gitDepth?:number, ledgerOnly?:boolean}} o
 *   html は今の html の絶対パス。ledgerOnly(QA)は台帳だけで刻印の部分を引く(git の履歴・候補のファイルは引かない —— CI の浅い checkout と同じ判定)
 * @returns {{ok:boolean, applicable:boolean, from:string|null, diff:string[], missing:string[], why:string}}
 */
export function htmlPhysCheck(o) {
  const m = o.meta || {}, d = o.decl || null;
  const res = { ok: false, applicable: false, from: null, rev: null, diff: [], missing: [], why: '' };
  if (!d || d.whole) { res.why = d ? '段の宣言が html 全体' : '段の宣言が無い'; return res; }
  if (m.target !== HTMLPHYS_TARGET || !/^[0-9a-f]{64}$/.test(String(m.targetSha256 || ''))) { res.why = '対象が beta/index.html でない・刻印が無い'; return res; }
  if (m.scope && m.scopeComplete === true) { res.why = '領域の宣言つき(領域 hash で見る)'; return res; }
  res.applicable = true;
  const reads = d.reads || HTMLPHYS_DEFAULT_READS;
  const sp = o.ledgerOnly ? (() => { const L = o.ledger || readLedger(o.root); const p = ledgerParts(L, m.targetSha256); return { parts: p, from: p ? 'ledger' : null, rev: p ? (L.entries[m.targetSha256] || {}).rev || null : null }; })()
    : stampParts({ root: o.root, sha: m.targetSha256, files: o.files, ledger: o.ledger, gitDepth: o.gitDepth, tmpDir: o.tmpDir });
  res.from = sp.from; res.rev = sp.rev;
  if (!sp.parts) { res.why = '刻印の html(' + String(m.targetSha256).slice(0, 12) + ')が' + (o.ledgerOnly ? '台帳' : '台帳・基点・git の履歴') + 'に無い'; return res; }
  let now = null;
  try { now = htmlPhysParts(o.html); } catch (e) { res.why = '今の html の部分を引けない: ' + String(e).slice(0, 80); return res; }
  const c = physCompare(sp.parts, now.parts, reads);
  res.diff = c.diff; res.missing = c.missing; res.ok = c.same;
  res.why = c.same ? 'html の物理の部分が同じ(' + reads.join('・') + ')' : (c.diff.length ? '物理の部分が違う: ' + c.diff.join(',') : '部分が引けない: ' + c.missing.join(','));
  return res;
}

/**
 * QA の対象一致(第325便a): targetSha256 が今の html と一致 / 領域一致(scopeOkNow)/ **html の物理の部分が一致**(台帳だけで —— 段の宣言 decl)。
 * @param {string} root
 * @param {object} meta 正本の meta
 * @param {string} nowSha 今の対象の sha
 * @param {object|null} decl 段の宣言(HTMLPHYS_DECL_325A の行 —— 無ければ物理の部分では見ない)
 * @param {{ledger?:object, html?:string}} [o] 台帳と今の html の差し替え(自己試験)
 * @returns {{ok:boolean, how:'exact'|'scope'|'htmlphys'|null, why:string}}
 */
export function targetOk325(root, meta, nowSha, decl, o) {
  if (!meta) return { ok: false, how: null, why: 'meta が無い' };
  if (meta.targetSha256 && meta.targetSha256 === nowSha) return { ok: true, how: 'exact', why: '' };
  if (scopeOkNow(root, meta)) return { ok: true, how: 'scope', why: '' };
  if (!decl) return { ok: false, how: null, why: '段の宣言が無い(html 全体)' };
  const abs = String(root).replace(/\/$/, '') + '/' + String(meta.target || HTMLPHYS_TARGET);
  const r = htmlPhysCheck({ root, meta, decl, html: (o && o.html) || abs, ledgerOnly: true, ledger: o && o.ledger });
  return { ok: r.ok, how: r.ok ? 'htmlphys' : null, why: r.why };
}

/**
 * 台帳の作り直し(--htmlphys-record): 正本の刻印の html の sha(今の html と違う分)と今の html の部分を台帳に入れる。
 * 引けた行だけを入れる(引けなかった sha は missing に返す)。刻印にも今の html にも当たらない行は外す(prune)。
 * @param {{root:string, shas:string[], html:string, files?:string[], gitDepth?:number, tmpDir?:string, prune?:boolean}} o
 */
export function recordLedger(o) {
  const L = readLedger(o.root);
  const out = { version: HTMLPHYS_LEDGER_VERSION, partsVersion: HTMLPHYS_VERSION,
    note: '第325便a(R284): html の sha → 物理の部分の hash(tests/lib-w325a-htmlphys.mjs)。正本の刻印の html を引くための台帳 —— node tools/regen-plan.mjs --htmlphys-record が作る(手で直さない)',
    entries: {} };
  const want = [...new Set(o.shas.concat([sha256(fs.readFileSync(o.html))]))].sort();
  const missing = [], added = [], kept = [];
  for (const s of want) {
    const old = L.entries[s];
    if (old && old.version === HTMLPHYS_VERSION && old.parts) {
      out.entries[s] = old; kept.push(s);
      if (!old.rev && old.from === 'file' && o.gitDepth !== 0) { try { const g = findHtmlBySha({ root: o.root, sha: s, files: [], gitDepth: o.gitDepth }); if (g) out.entries[s] = Object.assign({}, old, { rev: g.rev }); } catch { /* 版は空のまま */ } }
      continue;
    }
    let r = null, rev = null, how = null;
    try {
      if (s === sha256(fs.readFileSync(o.html))) { r = htmlPhysParts(o.html); how = 'html'; }
      else { const h = findHtmlBySha({ root: o.root, sha: s, files: o.files, gitDepth: o.gitDepth }); if (h) { r = htmlPhysPartsOfText(h.buf, { tmpDir: o.tmpDir }); rev = h.rev; how = h.from.startsWith('git:') ? 'git' : 'file'; } }
      // 候補のファイルで見つけた刻印の html も、git の履歴にあれば版(rev)を書く(QA が手元で git から引き直して照合できる)
      if (r && !rev && how !== 'html' && o.gitDepth !== 0) { const g = findHtmlBySha({ root: o.root, sha: s, files: [], gitDepth: o.gitDepth }); if (g) rev = g.rev; }
    } catch { r = null; }
    if (!r) { missing.push(s); continue; }
    out.entries[s] = ledgerEntry(r, rev, how);
    added.push(s);
  }
  if (o.prune === false) for (const [s, e] of Object.entries(L.entries)) if (!out.entries[s]) out.entries[s] = e;
  return { doc: out, added, kept, missing };
}

export default { HTMLPHYS_VERSION, HTMLPHYS_LEDGER_FILE, HTMLPHYS_DEFAULT_READS, htmlPhysParts, htmlPhysPartsOfText, physCompare, htmlPhysCheck, targetOk325, recordLedger, stripProse325 };

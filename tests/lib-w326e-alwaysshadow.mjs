// 第326便e(原仮定者の回答(2026-11-03 —— AN527)「推奨で進める」・統括の検証項目 R294): **常時群 13 段の html の物理の部分の門(影)**。
//
// ■ 何をするか
//   常時群(再生成表の alwaysRun —— calaudit・dt3・kf0・solarsigma・d68three・stoprule・issues・assessed・kf0ledger-old・kf0ledger・samplestatus・htmlagg・mercury)は
//   版名だけの差でも毎便走る(第325便a の表 1 —— 約 15 分と下流の照合)。本 lib は**判定だけ**を出す(鎖は毎便のまま —— 計画の status は変えない):
//     (1) 段ごとに「常時群でなかったら、html の物理の部分(tests/lib-w325a-htmlphys.mjs)の門で reuse にできたか」(own)。html の読み方は段の宣言
//         ALWAYS_SHADOW_DECL_326E(reads —— 物理の部分の名 / scope —— 器の領域の宣言 / none —— html を読まない / follows —— 上流に従う集約段)。
//         刻印の html は段の正本の meta.targetSha256(無ければ calaudit の刻印 —— 同じ鎖で走る常時群の刻印)。器と lib・器が読むデータのファイルは
//         **正本を書いたコミット**(git log -1 -- <正本>)の blob と今のファイルを比べる(meta.code[]・measurementCodeFiles の刻印があればそれも)。
//         正本の meta.inputs の差(計画の行の理由の種類 input・decl・tool)はそのまま regen の理由。
//     (2) 常時群を own の判定に置き換えた**影の世界**で依存を伝播し直す(regen / recheck / reuse の数と秒 —— 計画の数と並べる)。
//     (3) **鎖の後の照合の口**(alwaysShadowCheck): 鎖の前のコミットの正本と鎖の後の正本の**物理の値**(tests/lib-w323b-quick.mjs の physValue —— meta・除外 Pointer・
//         時刻と壁時計の欄を除く + 本 lib の刻印の欄 EXTRA_STAMP_*)を段ごとに比べ、影の世界の判定と突き合わせる:
//           trueSame(影 reuse・値が同じ)/ falseSame(影 reuse・値が違う —— 門の取りこぼし)/ trueDiff(影で走る・値が違う)/ overRun(影で走る・値が同じ —— 保守側)/ na
//         値が違った段は「物理の部分も違っていたか」(影の理由の種類 html・code・data・input・upstream)を添える。
//
// ■ しないこと
//   ・鎖・計画の status・済み印の契約・正本を変えない(判定と印字だけ —— 本運用は第327便以降に統括が決める)。
//   ・「影の世界で reuse だから値が同じ」とは言わない —— 一致は**段が読むと宣言した部分と器・データのファイルが同じ**ことだけを意味する。値が同じかは (3) が測る。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { REGEN_STEPS, htmlPhysDeclOf } from './lib-w281a-regentable.mjs';
import { htmlPhysParts, stampParts, physCompare, readLedger, readsProblems, HTMLPHYS_TARGET } from './lib-w325a-htmlphys.mjs';
import { physValue } from './lib-w323b-quick.mjs';
import { canonJson, SCOPE_TOOLING, toolStampOnly } from './lib-w281a-scope.mjs';

export const ALWAYS_SHADOW_VERSION = 'w326e-alwaysshadow-1';
/** 群の刻印(自分の正本に targetSha256 が無い段が使う —— 同じ鎖で走る常時群の根)。 */
export const GROUP_STAMP_KEY_326E = 'calaudit';
/** 較正の走行の reads(版名・注釈・生成領域 sample-status の外を全部 —— 本は表示の欄を含む全体)。 */
export const CAL_READS_326E = Object.freeze(['code', 'markup', 'presetFull:*', 'textPairs', 'text:*']);
const R326 = (reads, why, x) => Object.freeze(Object.assign({ html: 'reads', reads: Object.freeze(reads.slice()), why }, x || {}));
const N326 = (why, x) => Object.freeze(Object.assign({ html: 'none', why }, x || {}));
/**
 * 常時群 13 段の html の読み方の宣言(影 —— 鎖は使わない)。refCanon = 正本を書いたコミットを引くファイル(既定は段の outs[0]・無ければ merges[0])・
 * canon = 鎖の後の照合で物理の値を比べるファイル(既定は outs・無ければ merges)。
 */
export const ALWAYS_SHADOW_DECL_326E = Object.freeze({
  calaudit: R326(CAL_READS_326E, '内蔵の本を較正の走行で走らせ(headless・Chromium)、行に本の emoji・name と obsCard の条件欄(declaredCondition)を写す —— 本は表示の欄を含む全体・文の登録簿と code の中の表示の文の対も読む側(保守側)。外すのは版名・注釈・生成領域 sample-status だけ'),
  dt3: R326(CAL_READS_326E, 'calaudit と同じ器(--h4-exceptions --merge —— 例外の本の dt/4 を calaudit の正本へ書き戻す)', { canon: ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'] }),
  kf0: R326(CAL_READS_326E, 'calaudit と同じ器(kF0 の診断コピー —— 5 本の kFrame を差し替えた走行・calaudit の正本へ書き戻す)'),
  solarsigma: N326('calaudit の正本・観測の CSV・判定の宣言(paper/data)を読む —— html を読まない'),
  d68three: R326(['code', 'markup', 'presetFull:saturnZonalD68'], 'Chromium で saturnZonalD68 の 1 本(.find で引く)を 3 段で走らせる —— 本は表示の欄を含む全体(保守側)'),
  stoprule: N326('calaudit の正本と基点の走行の写し(tests/data-w270a-stoprule-base.json)を読む —— html を読まない'),
  issues: N326('calaudit・solarsigma・charon・nslock の正本・観測の CSV・器の本文を読む —— html を読まない'),
  assessed: R326(['code', 'markup', 'presetFull:*'], '--check: html の生成領域 assessed-table と ASSESSED_CANON(code の中)を calaudit の正本の表と照合し、内蔵の本の presetSigHash を引く(headless)'),
  'kf0ledger-old': N326('正本(calaudit・charon・nslockledger・galaxydiag・kf0・calcontract)を読む —— html を読まない(meta の target は来歴)'),
  kf0ledger: N326('正本(presetaxes・calaudit・charon・nslockledger・galaxydiag・kf0・calcontract)を読む —— html を読まない(meta の target は来歴)'),
  samplestatus: Object.freeze({ html: 'reads', readsFrom: 'HTMLPHYS_DECL_325A', why: '第325便a の宣言(本の説明の欄・文の表・版名〔一覧 md の見出し〕)—— 版名の行が変わる便は毎回走る' }),
  htmlagg: Object.freeze({ html: 'follows', why: '書く段(obscompare・samplestatus)が置いた断片を当てる集約段 —— 書く段が走れば走る(自分の判定は上流に従う)', refCanon: 'tests/out/samplestatus-w279a.json' }),
  mercury: Object.freeze({ html: 'scope', why: '器の領域の宣言(REGEN_SCOPE —— 本 35 本・roots 13・S._core)で見る(計画の行の領域の一致)' }),
});
/** 照合で物理の値から外す刻印の欄(来歴の時刻・html の sha —— physValue の外す欄名に無いもの)。欄名はどの階層でも外す。 */
export const EXTRA_STAMP_KEYS_326E = Object.freeze(['calauditWhen', 'canonicalWhen']);
/** 照合で物理の値から外す刻印の Pointer(正本ごと)。 */
export const EXTRA_STAMP_PTRS_326E = Object.freeze({
  'tests/out/assessed-w273c.json': Object.freeze(['/stamp/inHtml', '/stamp/inCanonicalNow']),
  'tests/out/samplestatus-w279a.json': Object.freeze(['/timingNote/qaProvenance/date']),
});
/** 影の理由の種類。 */
export const SHADOW_WHY_KINDS_326E = Object.freeze(['html', 'code', 'data', 'input', 'stamp', 'upstream']);

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const gitBlobSha1 = (buf) => crypto.createHash('sha1').update('blob ' + buf.length + '\0').update(buf).digest('hex');
const readMeta = (root, f) => { try { return (JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) || {}).meta || null; } catch { return null; } };
const readText = (root, rel) => { try { return fs.readFileSync(path.join(root, rel), 'utf8'); } catch { return null; } };
const exists = (root, rel) => { try { return fs.statSync(path.join(root, rel)).isFile(); } catch { return false; } };

/** 段の宣言の reads(samplestatus は第325便a の宣言から引く)。 */
export function shadowReadsOf(key, decl) {
  const d = (decl || ALWAYS_SHADOW_DECL_326E)[key];
  if (!d || d.html !== 'reads') return null;
  if (d.readsFrom === 'HTMLPHYS_DECL_325A') { const x = htmlPhysDeclOf(key); return x && x.reads ? x.reads.slice() : null; }
  return d.reads.slice();
}

/** 注釈を外す(再生成表の stripComments と同じ規則)。 */
const stripComments326 = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
/** 閉包を広げない lib(本文が全部の器の名を持つ —— ファイル自身はコードに入れる)。 */
export const CLOSURE_NO_EXPAND_326E = Object.freeze(['tests/lib-w281a-regentable.mjs']);
/**
 * 器の閉包のファイル(cmd が名指す tests/*.mjs・tools/*.mjs と、注釈を外した本文の './x.mjs' の import の閉包)と、本文の文字列が名指す
 * 器・lib(読むだけ —— 閉包は広げない)・データのファイル(paper/data・tests/data-*・tests/fixtures —— 正本 tests/out は依存の伝播で見る)。保守側に広く。
 */
export function closureOf(st, root) {
  const code = new Set(), data = new Set(), exec = new Set();
  const q = [];
  const push = (rel, expand) => {
    if (!exists(root, rel)) return;
    if (expand && !exec.has(rel)) { exec.add(rel); if (!CLOSURE_NO_EXPAND_326E.includes(rel)) q.push(rel); }
    code.add(rel);
  };
  for (const m of String(st.cmd || '').matchAll(/\b(?:tests|tools)\/[\w.-]+\.mjs\b/g)) push(m[0], true);
  while (q.length) {
    const rel = q.shift();
    const t = stripComments326(readText(root, rel) || '');
    const dir = rel.slice(0, rel.lastIndexOf('/') + 1);
    for (const m of t.matchAll(/from\s+'\.\/([\w.-]+\.mjs)'/g)) push(dir + m[1], true);
    for (const m of t.matchAll(/import\(\s*'\.\/([\w.-]+\.mjs)'\s*\)/g)) push(dir + m[1], true);
    for (const m of t.matchAll(/'(tests|tools)',\s*'([\w.-]+\.mjs)'/g)) push(m[1] + '/' + m[2], false);   // path.join(ROOT, 'tests', 'x.mjs')(動的 import か本文を読む —— 広げない)
    for (const m of t.matchAll(/['"`]((?:tests|tools)\/[\w.-]+\.mjs)['"`]/g)) push(m[1], false);   // 本文を読む・名指すだけ(広げない)
    for (const m of t.matchAll(/\b(paper\/data\/[\w.-]+\.(?:csv|json)|tests\/data-[\w.-]+\.json|tests\/fixtures\/[\w.-]+\.json)\b/g)) if (exists(root, m[1])) data.add(m[1]);
    for (const m of t.matchAll(/'paper',\s*'data',\s*'([\w.-]+\.(?:csv|json))'/g)) if (exists(root, 'paper/data/' + m[1])) data.add('paper/data/' + m[1]);
    for (const m of t.matchAll(/'tests',\s*'((?:data-[\w.-]+|fixtures\/[\w.-]+)\.json)'/g)) if (exists(root, 'tests/' + m[1])) data.add('tests/' + m[1]);
    for (const m of t.matchAll(/'tests',\s*'fixtures',\s*'([\w.-]+\.json)'/g)) if (exists(root, 'tests/fixtures/' + m[1])) data.add('tests/fixtures/' + m[1]);
  }
  code.delete('tests/qa.mjs');   // QA 本体は器が読む入力ではない(名指しの文字列だけ —— 入れると毎便「式」になる)
  exec.delete('tests/qa.mjs');
  return { code: [...code].sort(), data: [...data].sort(), exec: [...exec].sort() };
}

const gitMemo326 = new Map();
/** ファイルを最後に変えたコミット(無ければ null)。 */
export function lastRevOf(root, file) {
  const k = root + '|' + file;
  if (!gitMemo326.has(k)) {
    let r = null;
    try { r = execFileSync('git', ['-C', root, 'log', '-1', '--format=%H', '--', file], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { r = null; }
    gitMemo326.set(k, r);
  }
  return gitMemo326.get(k);
}
/** a が b の祖先か同じコミットか(git が無ければ null)。 */
export function isAncestor(root, a, b) {
  if (!a || !b) return null;
  if (a === b) return true;
  try { execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', a, b], { stdio: ['ignore', 'ignore', 'ignore'] }); return true; } catch (e) { return e && e.status === 1 ? false : null; }
}
/** rev の blob(ファイル → blob の sha1 —— 無いファイルは入らない)。 */
export function blobsAt(root, rev, files) {
  const out = new Map();
  if (!rev || !files.length) return out;
  try {
    const t = execFileSync('git', ['-C', root, 'ls-tree', rev, '--'].concat(files), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 });
    for (const line of t.split('\n')) { const m = /^\d+ blob ([0-9a-f]{40})\t(.+)$/.exec(line); if (m) out.set(m[2], m[1]); }
  } catch { /* git が無い —— 空 */ }
  return out;
}
/** 今のファイルと rev の blob の差(違う・rev に無い)。 */
export function fileDrift(root, rev, files) {
  const B = blobsAt(root, rev, files);
  const diff = [];
  for (const f of files) {
    let buf = null; try { buf = fs.readFileSync(path.join(root, f)); } catch { buf = null; }
    if (!buf || !B.has(f) || B.get(f) !== gitBlobSha1(buf)) diff.push(f);
  }
  return diff;
}

/**
 * 影の判定の純関数(I/O なし —— 自己試験と alwaysShadow の共通): 段ごとの事実(facts)から own を出し、常時群を own に置き換えた影の世界で依存を伝播する。
 * @param {{planRows:Array, facts:Object<string,{html:{same:boolean|null}, code:{diff:string[], unknown?:boolean}, data:{diff:string[]}, inputs:string[], stamp?:{ok:boolean,why?:string}}>,
 *          onlyIfScopeChanged?:Set<string>}} o planRows = 計画の行(key・status・ownStatus・alwaysRun・dataDeps・sec)
 */
export function shadowJudge(o) {
  const rows = o.planRows || [];
  const own = new Map();
  const why = new Map();
  for (const r of rows) {
    if (!r.alwaysRun) continue;
    const f = (o.facts || {})[r.key] || null;
    const w = [];
    if (!f) w.push(['stamp', '事実が引けない']);
    else {
      if (f.stamp && f.stamp.ok === false) w.push(['stamp', f.stamp.why || '刻印の html が引けない']);
      if (f.html && f.html.same === false) w.push(['html', 'html の物理の部分が違う: ' + ((f.html.diff || []).join(',') || '—')]);
      if (f.code && f.code.unknown) w.push(['code', '器の刻印も正本を書いたコミットも引けない']);
      if (f.code && (f.code.diff || []).length) w.push(['code', '器・lib: ' + f.code.diff.slice(0, 3).join(',') + (f.code.diff.length > 3 ? ` 他 ${f.code.diff.length - 3}` : '')]);
      if (f.data && (f.data.diff || []).length) w.push(['data', 'データのファイル: ' + f.data.diff.slice(0, 3).join(',')]);
      for (const c of (f.inputs || [])) w.push(['input', c]);
    }
    own.set(r.key, w.length ? 'regen' : 'reuse');
    why.set(r.key, w);
  }
  // 影の世界: 常時群 = own・それ以外 = 計画の判定(依存の伝播の前 —— 計画の最終が reuse なら reuse・regen なら regen・recheck なら ownStatus)
  const stt = new Map();
  for (const r of rows) {
    if (r.alwaysRun) stt.set(r.key, own.get(r.key));
    else if (r.status === 'history') stt.set(r.key, 'history');
    else if (r.status === 'recheck') stt.set(r.key, r.ownStatus === 'regen' ? 'regen' : 'reuse');
    else stt.set(r.key, r.status === 'always' ? 'regen' : r.status);
  }
  const by = new Map(rows.map((r) => [r.key, r]));
  const up = new Map();
  for (let changed = true; changed;) {
    changed = false;
    for (const r of rows) {
      if (stt.get(r.key) !== 'reuse') continue;
      const hit = (r.dataDeps || r.deps || []).filter((d) => by.has(d) && ['regen', 'recheck'].includes(stt.get(d)));
      if (hit.length) { stt.set(r.key, 'recheck'); up.set(r.key, hit); changed = true; }
    }
  }
  for (const k of (o.onlyIfScopeChanged || [])) if (stt.get(k) === 'recheck') stt.set(k, 'reuse');
  const cnt = (f) => rows.filter(f).length;
  const sec = (f) => rows.filter(f).reduce((a, r) => a + (Number(r.sec) || 0), 0);
  const world = { count: {}, secLower: sec((r) => stt.get(r.key) === 'regen'), secUpper: sec((r) => ['regen', 'recheck'].includes(stt.get(r.key))) };
  for (const r of rows) world.count[stt.get(r.key)] = (world.count[stt.get(r.key)] || 0) + 1;
  const always = rows.filter((r) => r.alwaysRun).map((r) => ({ key: r.key, sec: Number(r.sec) || 0, own: own.get(r.key), why: why.get(r.key).map(([k, t]) => ({ kind: k, text: t })),
    world: stt.get(r.key), upstream: up.get(r.key) || [] }));
  return { always, world, status: stt,
    count: { ownReuse: always.filter((z) => z.own === 'reuse').length, ownRegen: always.filter((z) => z.own === 'regen').length,
      worldReuse: always.filter((z) => z.world === 'reuse').length, worldRecheck: always.filter((z) => z.world === 'recheck').length, worldRegen: always.filter((z) => z.world === 'regen').length },
    sec: { always: sec((r) => r.alwaysRun), worldReuse: always.filter((z) => z.world === 'reuse').reduce((a, z) => a + z.sec, 0) },
    nAlways: cnt((r) => r.alwaysRun) };
}

/**
 * 計画(planRegen の戻り —— regen-plan の JSON)に常時群の影を付ける(判定だけ)。
 * @param {object} plan 計画
 * @param {{root:string, html:string, steps?:Array, decl?:object, ledger?:object, files?:string[], gitDepth?:number}} o html = 計画の html の絶対パス・files = 刻印の html の候補(基点 html)
 */
export function alwaysShadow(plan, o) {
  const root = String(o.root).replace(/\/$/, '');
  const STEPS = o.steps || REGEN_STEPS;
  const D = o.decl || ALWAYS_SHADOW_DECL_326E;
  const t0 = Date.now();
  const ledger = o.ledger || readLedger(root);
  const by = new Map(STEPS.map((z) => [z.key, z]));
  // 集約段(follows)は after の全部を依存に(上流の書く段が走れば走る —— 順序だけの辺でも従う)
  const planRows = (plan.steps || []).map((r) => Object.assign({}, r, { alwaysRun: !!(by.get(r.key) || {}).alwaysRun },
    (D[r.key] && D[r.key].html === 'follows') ? { dataDeps: (r.deps || []).slice() } : {}));
  let nowParts = null, nowWhy = null;
  try { nowParts = htmlPhysParts(o.html).parts; } catch (e) { nowWhy = String(e && e.message || e).slice(0, 80); }
  const nowSha = (() => { try { return sha256(fs.readFileSync(o.html)); } catch { return null; } })();
  const gm = readMeta(root, (by.get(GROUP_STAMP_KEY_326E) || { outs: [] }).outs[0] || '');
  const group = { key: GROUP_STAMP_KEY_326E, sha: gm && /^[0-9a-f]{64}$/.test(String(gm.targetSha256 || '')) ? gm.targetSha256 : null };
  // 群のコミット(calaudit の正本を最後に書いたコミット = 前の鎖)—— 常時群は毎便同じ鎖で走るので、中身が変わらず書き直されなかった正本(kf0 の kf0-w259d.json など)も
  //   この鎖で作られた。段の正本のコミットが群のコミットの祖先なら群のコミットを器・データの比べの基準にする
  const groupRev = lastRevOf(root, (by.get(GROUP_STAMP_KEY_326E) || { outs: [] }).outs[0] || '');
  const partsMemo = new Map();
  const stampOf = (sha) => {
    if (!partsMemo.has(sha)) partsMemo.set(sha, stampParts({ root, sha, files: (o.files || []).concat([o.html]).filter(Boolean), ledger, gitDepth: o.gitDepth, tmpDir: o.tmpDir }));
    return partsMemo.get(sha);
  };
  const facts = {}, detail = {};
  for (const r of planRows) {
    if (!r.alwaysRun) continue;
    const st = by.get(r.key) || { outs: [], merges: [] };
    const d = D[r.key] || null;
    const outs = (st.outs || []).length ? st.outs : (st.merges || []);
    const metas = [...new Set(outs.concat(st.merges || []))].map((f) => [f, readMeta(root, f)]);   // 書き戻す正本(merges)の meta も刻印に使う(dt3・kf0 —— calaudit の器)
    const f = { html: { kind: d ? d.html : null, same: null, diff: [] }, code: { diff: [], unknown: false }, data: { diff: [] }, inputs: [], stamp: { ok: true } };
    const dt = { decl: d ? d.html : null, refCanon: null, rev: null, revFrom: null, codeFiles: 0, codeFrom: null, dataFiles: 0, stamp: null, stampFrom: null, stampHow: null, reads: null };
    if (!d) { f.stamp = { ok: false, why: '影の宣言が無い(ALWAYS_SHADOW_DECL_326E に足す)' }; facts[r.key] = f; detail[r.key] = dt; continue; }
    // ---- html
    if (d.html === 'reads') {
      const reads = shadowReadsOf(r.key, D);
      dt.reads = reads;
      const own = metas.map(([, m]) => m).find((m) => m && m.target === HTMLPHYS_TARGET && /^[0-9a-f]{64}$/.test(String(m.targetSha256 || '')));
      const sha = own ? own.targetSha256 : group.sha;
      dt.stamp = sha ? sha.slice(0, 12) : null; dt.stampFrom = own ? 'own' : 'group';
      if (!sha) f.stamp = { ok: false, why: '刻印が無い(自分の正本にも ' + GROUP_STAMP_KEY_326E + ' にも)' };
      else if (sha === nowSha) { f.html.same = true; dt.stampHow = 'exact'; }
      else if (!nowParts) f.stamp = { ok: false, why: '今の html の部分が引けない: ' + nowWhy };
      else {
        const sp = stampOf(sha);
        dt.stampHow = sp.from;
        if (!sp.parts) f.stamp = { ok: false, why: '刻印の html(' + sha.slice(0, 12) + ')が台帳・基点・git の履歴に無い' };
        else { const c = physCompare(sp.parts, nowParts, reads); f.html.same = c.same; f.html.diff = c.diff.concat(c.missing.map((z) => z + '(欠け)')); }
      }
    } else if (d.html === 'scope') {
      // 計画の行の領域の一致(row.scopeUsed)か対象の sha の一致 —— 刻印の型が違えば理由の種類 scope
      const ks = r.causeKinds || [];
      f.html.same = r.scopeUsed === true || (!ks.includes('scope') && !ks.includes('html') && !ks.includes('htmlphys'));
      if (!f.html.same) f.html.diff = (r.cause || []).filter((z) => /領域|プリセット|式|定数|受理/.test(z)).slice(0, 2);
      dt.stampHow = r.scopeUsed ? 'scope' : 'plan';
    } else { f.html.same = true; }   // none・follows
    // ---- code と data(正本を書いたコミットの blob と今)
    const ref = d.refCanon || outs[0] || null;
    const ownRev = ref ? lastRevOf(root, ref) : null;
    const anc = ownRev && groupRev ? isAncestor(root, ownRev, groupRev) : null;
    const rev = anc === true ? groupRev : ownRev;
    dt.refCanon = ref; dt.rev = rev ? rev.slice(0, 12) : null; dt.revFrom = anc === true && ownRev !== groupRev ? 'group' : 'own';
    const cl = closureOf(st, root);
    // 器がコードの集合を刻む正本(来歴の meta.code[]・calaudit の measurementCodeFiles —— 計画が見るのと同じ器の宣言)は、その集合と cmd の器だけ。
    //   刻まない旧形式の正本(solarsigma・d68three・stoprule・issues・assessed・htmlagg)は器の閉包(保守側に広く)
    const stamped = new Set();
    for (const [, m] of metas) {
      for (const c of ((m && m.code) || [])) if (c && c.file) stamped.add(c.file);
      for (const c of ((m && m.measurementCodeFiles) || [])) stamped.add(c);
    }
    const cmdFiles = String(st.cmd || '').match(/\b(?:tests|tools)\/[\w.-]+\.mjs\b/g) || [];
    const codeFiles = new Set(stamped.size ? [...stamped].concat(cmdFiles) : cl.code);
    dt.codeFrom = stamped.size ? 'stamp' : 'closure';
    const cf = [...codeFiles].sort();
    dt.codeFiles = cf.length; dt.dataFiles = cl.data.length;
    if (!rev) {
      // コミットが引けない —— 刻印(meta.code[]・measurementCodeSha256)だけで見る。刻印も無ければ不明(保守側に regen)
      const stamped = metas.some(([, m]) => m && ((m.code || []).length || m.measurementCodeSha256));
      if (!stamped) f.code.unknown = true;
    } else {
      // 刻印の道具(SCOPE_TOOLING)を刻印だけに使う器は、道具の差を「式」にしない(計画の第318便a の規則と同じ —— toolStampOnly)
      const tsOnly = cf.filter((x) => SCOPE_TOOLING.includes(x) && toolStampOnly(root, cf, x));
      f.code.diff = fileDrift(root, rev, cf).filter((x) => !tsOnly.includes(x));
      f.data.diff = fileDrift(root, rev, cl.data);
      dt.toolStampOnly = tsOnly;
    }
    for (const [, m] of metas) {
      if (!m) continue;
      for (const c of (m.code || [])) if (c && c.file && c.sha256) { let s = null; try { s = sha256(fs.readFileSync(path.join(root, c.file))); } catch { s = null; } if (s !== c.sha256 && !f.code.diff.includes(c.file)) f.code.diff.push(c.file); }
      if (m.measurementCodeSha256 && Array.isArray(m.measurementCodeFiles)) {
        let s = null; try { s = sha256(m.measurementCodeFiles.map((p) => p + ':' + sha256(fs.readFileSync(path.join(root, p)))).join('\n')); } catch { s = null; }
        if (s !== m.measurementCodeSha256 && !f.code.diff.includes('measurementCodeSha256')) f.code.diff.push('measurementCodeSha256');
      }
    }
    // ---- 計画の行の入力の理由(input・decl・tool —— 正本の meta.inputs の差)
    const kinds = r.causeKinds || [];
    if (kinds.some((k) => ['input', 'decl', 'tool'].includes(k))) for (const c of (r.cause || [])) if (/^入力|^安定 hash の宣言|^刻印の Pointer|^道具/.test(c)) f.inputs.push(c);
    facts[r.key] = f; detail[r.key] = dt;
  }
  const J = shadowJudge({ planRows, facts, onlyIfScopeChanged: new Set(STEPS.filter((z) => z.onlyIfScopeChanged).map((z) => z.key)) });
  const headRev = (() => { try { return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } })();
  const rows = J.always.map((z) => {
    const f = facts[z.key] || {}, dt = detail[z.key] || {};
    return Object.assign({}, z, { html: { kind: dt.decl, same: f.html ? f.html.same : null, diff: f.html ? f.html.diff : [], reads: dt.reads, stamp: dt.stamp, stampFrom: dt.stampFrom, stampHow: dt.stampHow },
      physReuse: (f.stamp && f.stamp.ok === false) || !['reads', 'scope'].includes(dt.decl) ? null : (f.html ? f.html.same : null),
      code: { rev: dt.rev, revFrom: dt.revFrom, refCanon: dt.refCanon, files: dt.codeFiles, from: dt.codeFrom, toolStampOnly: dt.toolStampOnly || [], diff: (f.code || {}).diff || [], unknown: !!(f.code || {}).unknown },
      data: { files: dt.dataFiles, diff: (f.data || {}).diff || [] }, inputs: f.inputs || [] });
  });
  return {
    version: ALWAYS_SHADOW_VERSION, html: path.relative(root, o.html) || o.html, htmlSha256: nowSha, headRev,
    group: { key: group.key, sha: group.sha ? group.sha.slice(0, 12) : null, rev: groupRev ? groupRev.slice(0, 12) : null },
    count: J.count, sec: J.sec, rows,
    world: J.world, plan: { count: plan.count || null, secLower: plan.secLower, secUpper: plan.secUpper },
    ms: Date.now() - t0,
    note: '影(判定だけ —— 鎖は毎便のまま・計画の status は変えない)。own = 常時群でなかったら html の物理の部分の門と器・データ・入力で reuse にできたか・world = 常時群を own に置き換えて依存を伝播した影の世界。'
      + '鎖の後に node tools/regen-plan.mjs --always-shadow-check --plan-json <この計画> [--base-rev <鎖の前のコミット —— 既定 headRev>] で正本の物理の値と突き合わせる',
  };
}

// ---------------------------------------------------------------------------------------------
// 鎖の後の照合の口
// ---------------------------------------------------------------------------------------------
/** 照合の物理の値(physValue + 本 lib の刻印の欄を外す)。 */
export function shadowPhysValue(J, rel) {
  const v = physValue(J, rel);
  const ptrs = EXTRA_STAMP_PTRS_326E[rel] || [];
  for (const p of ptrs) {
    const toks = p.slice(1).split('/');
    let x = v;
    for (let i = 0; x && typeof x === 'object' && i < toks.length - 1; i++) x = x[toks[i]];
    if (x && typeof x === 'object') delete x[toks[toks.length - 1]];
  }
  const drop = new Set(EXTRA_STAMP_KEYS_326E);
  const walk = (x) => { if (Array.isArray(x)) { x.forEach(walk); return; } if (!x || typeof x !== 'object') return; for (const k of Object.keys(x)) { if (drop.has(k)) delete x[k]; else walk(x[k]); } };
  walk(v);
  applyShadowVolatile329c(v, rel);   // 第329便c: 正本ごとの揮発の欄(時間の欄・文の中の秒 —— 旧形式の正本を含む)
  return v;
}

// ==== 第329便c の塊(ここから)====
/**
 * 第329便c(統括の検証項目 R306 —— 第328便の鎖の後の常時群の影の falseSame 1): **照合の物理の値から外す揮発の欄**(正本ごと —— 比べの道具の表)。
 *   stoprule の正本は刻印の無い旧形式で、走行の壁時計の欄(when・wallSec・nowWallSec・baseWallSec・maxWallSec・nowRate・baseRate —— 名はどの階層でも)は指紋の既定(physValue の
 *   FP_RUNTIME_KEYS)で外れるが、**資源の上限の文 /resource/finding の中の最長の秒**(「最長 49.2 s < 600 s」)が残り、影 reuse・値が違う(falseSame)と出た —— 物理の取りこぼしではない。
 *   keys = どの階層でも外す欄名(既定で外れる欄も宣言として並べる —— 欄の一覧)・secondsText = 文の中の「数 s」(秒)を「#」に正規化する Pointer(文の他の字は比べる —— 上限の秒は
 *   /resource/ceilingSec・/spec/wallCeilingSec の数で比べる)。物理の欄(步数・近点の数・判定・超えた段の列 /resource/exceeded)は外さない。
 */
export const SHADOW_VOLATILE_VERSION_329C = 'w329c-shadowvol-1';
export const SHADOW_VOLATILE_329C = Object.freeze({
  'tests/out/stoprule-w270a.json': Object.freeze({
    keys: Object.freeze(['when', 'wallSec', 'nowWallSec', 'baseWallSec', 'maxWallSec', 'nowRate', 'baseRate']),
    secondsText: Object.freeze(['/resource/finding']),
    why: '停止条件の照合の器(走行はしない —— calaudit の正本と基点の写しを読む)。壁時計の欄と資源の上限の文の最長の秒は走行の箱と負荷で変わる',
  }),
});
/** 文の中の秒の正規化(「49.2 s」「600 s」→「# s」—— 単位 s の直前の数だけ。数の後に s 以外の字が続く数〔步数・近点の数〕は残す)。 */
export const normSecondsText329c = (t) => String(t).replace(/\d+(?:\.\d+)?(?=\s*s(?![A-Za-z0-9_]))/g, '#');
/** 揮発の欄を外す(v は physValue の写し —— その場で書き換える)。表に無い正本は何もしない。 */
export function applyShadowVolatile329c(v, rel) {
  const d = SHADOW_VOLATILE_329C[rel];
  if (!d || !v || typeof v !== 'object') return v;
  const ks = new Set(d.keys);
  const walk = (x) => { if (Array.isArray(x)) { x.forEach(walk); return; } if (!x || typeof x !== 'object') return; for (const k of Object.keys(x)) { if (ks.has(k)) delete x[k]; else walk(x[k]); } };
  walk(v);
  for (const p of d.secondsText) {
    const toks = p.slice(1).split('/');
    let x = v;
    for (let i = 0; x && typeof x === 'object' && i < toks.length - 1; i++) x = x[toks[i]];
    const last = toks[toks.length - 1];
    if (x && typeof x === 'object' && typeof x[last] === 'string') x[last] = normSecondsText329c(x[last]);
  }
  return v;
}
/**
 * 自己試験(I/O なし —— QA lint.alwaysShadowVolatile329c): ① 時間の欄と文の中の秒だけが違う 2 つの stoprule の形 → 同じ(trueSame)② 物理の欄(步数・近点の数・判定・
 * 超えた段の列・文の秒以外の字)が違う → 違う(falseSame のまま)③ 表に無い正本は今までどおり(文の秒も比べる)④ 秒の正規化は步数・近点の数を残す。
 */
export function shadowVolatileSelfTest329c() {
  const bad = [], cases = [], rel = 'tests/out/stoprule-w270a.json';
  const mk = (o) => ({ when: o.when || 't1', replay: { rows: [{ id: 'x', nowMaxSteps: o.steps || 80000000, nowStepsRun: o.steps || 80000000, nowPeriFoundA: [o.peri || 27], nowWallSec: o.w || 76.5, nowRate: o.r || 689655, baseWallSec: 21.962, baseRate: 1666667, same: false }] },
    recalc: { rows: [{ id: 'x', wallSec: o.w2 || 3.1, ok: o.ok === undefined ? true : o.ok }] },
    resource: { ceilingSec: o.cap || 600, exceeded: o.ex || [], maxWallSec: o.w || 76.5, stages: 48, finding: '**資源上限を超えた段は ' + (o.nEx || 0) + ' である**(最長 ' + (o.w || 76.5).toFixed(1) + ' s < ' + (o.cap || 600) + ' s)—— 現行の走行では' + (o.word || '効いていない') + '上限である。' } });
  const a = mk({}), b = mk({ when: 't2', w: 55.8, r: 588235, w2: 9.9 });
  const sh = (J, r) => shadowPhysSha(J, r === undefined ? rel : r);
  if (sh(a) !== sh(b)) bad.push('① 時間の欄と文の秒だけの差が同じにならない');
  const ck = alwaysShadowCheck({ headRev: 'r0', rows: [{ key: 'stoprule', world: 'reuse', own: 'reuse', why: [], upstream: [] }] }, { root: '/nonexistent', baseRev: 'r0', readBase: () => JSON.stringify(a), readNow: () => JSON.stringify(b) });
  if (!(ck.ok === true && ck.count.trueSame === 1)) bad.push('① 照合の口で trueSame にならない: ' + JSON.stringify(ck.count));
  cases.push('① 時間の欄(when・wallSec・nowWallSec・nowRate)と資源の文の最長の秒だけが違う → 同じ(照合 trueSame)');
  const muts = { steps: mk({ steps: 40000000 }), peri: mk({ peri: 13 }), ok: mk({ ok: false }), exceeded: mk({ ex: [{ id: 'x', tag: 'dt', wallSec: 700 }], nEx: 1 }), word: mk({ word: '効いている' }), cap: mk({ cap: 900 }) };
  const missed = Object.entries(muts).filter(([, J]) => sh(J) === sh(a)).map(([k]) => k);
  if (missed.length) bad.push('② 物理の欄の差を外した: ' + missed.join(','));
  const ck2 = alwaysShadowCheck({ headRev: 'r0', rows: [{ key: 'stoprule', world: 'reuse', own: 'reuse', why: [], upstream: [] }] }, { root: '/nonexistent', baseRev: 'r0', readBase: () => JSON.stringify(a), readNow: () => JSON.stringify(muts.peri) });
  if (!(ck2.ok === false && ck2.falseSame.join(',') === 'stoprule')) bad.push('② 物理の差が falseSame にならない');
  cases.push(`② 物理の欄の差(步数・近点の数・判定・超えた段の列・文の秒以外の字・上限の秒の数)${Object.keys(muts).length} 種は違う → falseSame のまま`);
  const other = 'tests/out/other-w329c.json';
  if (sh(a, other) === sh(b, other)) bad.push('③ 表に無い正本の文の秒を外した');
  cases.push('③ 表に無い正本は今までどおり(文の中の秒も比べる)');
  const n1 = normSecondsText329c('最長 49.2 s < 600 s・80,000,000 步・近点 13 個・5s・12 sec'), w1 = '最長 # s < # s・80,000,000 步・近点 13 個・#s・12 sec';
  if (n1 !== w1) bad.push('④ 秒の正規化: ' + n1);
  cases.push('④ 秒の正規化は「数 s」だけ(步数・近点の数・sec の綴りは残す)');
  return { version: SHADOW_VOLATILE_VERSION_329C, ok: bad.length === 0, bad, cases };
}
// ==== 第329便c の塊(ここまで)====
export const shadowPhysSha = (J, rel) => sha256(canonJson({ v: ALWAYS_SHADOW_VERSION, data: shadowPhysValue(J, rel) }));
/** 照合の分類(純関数): world(影の世界の判定)と same(値が同じか —— null は欠測)。 */
export function checkClass(world, same) {
  if (same === null || same === undefined) return 'na';
  if (world === 'reuse') return same ? 'trueSame' : 'falseSame';
  return same ? 'overRun' : 'trueDiff';
}
/**
 * 鎖の後の照合: 影の行ごとに、鎖の前のコミット(baseRev)の正本と今の正本の物理の値を比べる。
 * @param {object} shadow alwaysShadow の戻り(計画の alwaysShadow326e)
 * @param {{root:string, baseRev?:string, steps?:Array, decl?:object, readBase?:(f:string)=>string|null, readNow?:(f:string)=>string|null}} o
 */
export function alwaysShadowCheck(shadow, o) {
  const root = String(o.root).replace(/\/$/, '');
  const STEPS = o.steps || REGEN_STEPS;
  const D = o.decl || ALWAYS_SHADOW_DECL_326E;
  const baseRev = o.baseRev || (shadow && shadow.headRev) || null;
  const readBase = o.readBase || ((f) => { if (!baseRev) return null; try { return execFileSync('git', ['-C', root, 'show', baseRev + ':' + f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 30 }); } catch { return null; } });
  const readNow = o.readNow || ((f) => readText(root, f));
  const rows = [];
  for (const z of ((shadow && shadow.rows) || [])) {
    const st = STEPS.find((s) => s.key === z.key) || { outs: [], merges: [] };
    const d = D[z.key] || {};
    const files = d.canon || ((st.outs || []).length ? st.outs : []);
    const per = [];
    for (const f of files) {
      const a = readBase(f), b = readNow(f);
      let sa = null, sb = null;
      try { sa = a === null ? null : shadowPhysSha(JSON.parse(a), f); } catch { sa = null; }
      try { sb = b === null ? null : shadowPhysSha(JSON.parse(b), f); } catch { sb = null; }
      per.push({ file: f, same: sa === null || sb === null ? null : sa === sb, before: sa ? sa.slice(0, 12) : null, after: sb ? sb.slice(0, 12) : null });
    }
    const same = !per.length || per.some((p) => p.same === null) ? null : per.every((p) => p.same);
    const cat = checkClass(z.world, same);
    const explain = same === false ? (z.why || []).map((w) => w.kind).concat(z.upstream && z.upstream.length ? ['upstream'] : []) : [];
    rows.push({ key: z.key, world: z.world, own: z.own, same, cat, files: per, explain: [...new Set(explain)],
      why: per.length ? (same === null ? '前か後の正本が読めない' : '') : '照合する正本が無い(書き戻しは calaudit の行で見る)' });
  }
  const count = {};
  for (const r of rows) count[r.cat] = (count[r.cat] || 0) + 1;
  const falseSame = rows.filter((r) => r.cat === 'falseSame').map((r) => r.key);
  return { version: ALWAYS_SHADOW_VERSION, baseRev: baseRev ? baseRev.slice(0, 12) : null, count, rows, falseSame, ok: falseSame.length === 0,
    note: 'trueSame = 影 reuse・値が同じ / falseSame = 影 reuse・値が違う(門の取りこぼし)/ trueDiff = 影で走る・値が違う / overRun = 影で走る・値が同じ(保守側)/ na = 照合する正本が無いか読めない' };
}

/** 影の表(PHYSICS の表 —— 段・秒・html の読み方・own・world・理由)。 */
export function shadowRows(sh) {
  const out = ['| 段 | 秒 | html の読み方 | 刻印 | 物理の部分 | own | 影の世界 | 理由 |', '|---|---|---|---|---|---|---|---|'];
  for (const r of sh.rows) out.push(`| ${r.key} | ${r.sec} | ${r.html.kind}${r.html.reads ? '(' + r.html.reads.join('・') + ')' : ''} | ${r.html.stamp ? r.html.stamp + '(' + r.html.stampFrom + '・' + r.html.stampHow + ')' : '—'} | `
    + `${r.physReuse === true ? '同じ' : r.physReuse === false ? '違う' : '—'} | ${r.own} | ${r.world}${r.upstream.length ? '(上流 ' + r.upstream.slice(0, 3).join(',') + ')' : ''} | ${(r.why.map((w) => w.text).join(' / ') || '—').replace(/\|/g, '\\|').slice(0, 120)} |`);
  return out.join('\n');
}

/**
 * 自己試験(I/O なし —— QA lint.alwaysShadow326e): ① 判定の純関数(own と影の世界の伝播)② 照合の分類(取りこぼしを falseSame で落とす)③ 照合の物理の値(刻印の欄を外す・物理の値は外さない)
 */
export function alwaysShadowSelfTest() {
  const bad = [], cases = [];
  // ① 合成の計画: A(常時群)→ B(常時群・html を読まない)→ C(常時群でない・reuse)/ X(常時群でない・regen)→ Y(常時群・X に依存)
  const rows = [
    { key: 'A', status: 'always', ownStatus: 'always', alwaysRun: true, dataDeps: [], sec: 100 },
    { key: 'B', status: 'always', ownStatus: 'always', alwaysRun: true, dataDeps: ['A'], sec: 10 },
    { key: 'C', status: 'recheck', ownStatus: 'reuse', alwaysRun: false, dataDeps: ['B'], sec: 50 },
    { key: 'X', status: 'regen', ownStatus: 'regen', alwaysRun: false, dataDeps: [], sec: 5 },
    { key: 'Y', status: 'always', ownStatus: 'always', alwaysRun: true, dataDeps: ['X'], sec: 7 },
  ];
  const same = { html: { same: true }, code: { diff: [] }, data: { diff: [] }, inputs: [] };
  const j1 = shadowJudge({ planRows: rows, facts: { A: same, B: same, Y: same } });
  const s1 = Object.fromEntries([...j1.status]);
  if (!(s1.A === 'reuse' && s1.B === 'reuse' && s1.C === 'reuse' && s1.X === 'regen' && s1.Y === 'recheck' && j1.count.ownReuse === 3 && j1.world.secLower === 5 && j1.world.secUpper === 12)) bad.push('① 版名だけの便: ' + JSON.stringify(s1));
  const j2 = shadowJudge({ planRows: rows, facts: { A: Object.assign({}, same, { html: { same: false, diff: ['presetFull:*'] } }), B: same, Y: same } });
  const s2 = Object.fromEntries([...j2.status]);
  if (!(s2.A === 'regen' && s2.B === 'recheck' && s2.C === 'recheck' && j2.always.find((z) => z.key === 'A').why[0].kind === 'html')) bad.push('① 物理の部分が違う便: ' + JSON.stringify(s2));
  const j3 = shadowJudge({ planRows: rows, facts: { A: Object.assign({}, same, { code: { diff: ['tests/x.mjs'] } }), B: Object.assign({}, same, { data: { diff: ['paper/data/x.csv'] } }), Y: Object.assign({}, same, { inputs: ['入力: tests/out/q.json'] }) } });
  const k3 = j3.always.map((z) => z.key + ':' + z.why.map((w) => w.kind).join('+')).join(',');
  if (k3 !== 'A:code,B:data,Y:input') bad.push('① 器・データ・入力の理由: ' + k3);
  const j4 = shadowJudge({ planRows: rows, facts: { A: Object.assign({}, same, { stamp: { ok: false, why: '刻印が無い' } }), B: same } });
  if (!(j4.always.find((z) => z.key === 'A').own === 'regen' && j4.always.find((z) => z.key === 'Y').own === 'regen')) bad.push('① 刻印が無い・事実が無い段は regen(保守側)');
  cases.push(`① 判定(合成の 5 段): 版名だけ → 常時群 own reuse ${j1.count.ownReuse}/3・影の世界 ${JSON.stringify(j1.world.count)}(下限 ${j1.world.secLower} s)/ 根の物理の部分が違う → 根 regen・下流 recheck / 器・データ・入力の差 → ${k3} / 刻印・事実が無い → regen(保守側)`);
  // ② 照合の分類
  const cl = [['reuse', true], ['reuse', false], ['recheck', false], ['regen', true], ['reuse', null]].map(([w, s]) => checkClass(w, s));
  if (cl.join(',') !== 'trueSame,falseSame,trueDiff,overRun,na') bad.push('② 照合の分類: ' + cl.join(','));
  const sh = { headRev: 'r0', rows: [{ key: 'calaudit', world: 'reuse', own: 'reuse', why: [], upstream: [] }, { key: 'kf0', world: 'regen', own: 'regen', why: [{ kind: 'html' }], upstream: [] }] };
  const fake = (v) => JSON.stringify({ meta: { when: v }, presets: [{ id: 'a', x: v === 't1' ? 1 : 2 }] });
  const ck = alwaysShadowCheck(sh, { root: '/nonexistent', baseRev: 'r0', readBase: () => fake('t1'), readNow: () => fake('t2') });
  const ck2 = alwaysShadowCheck(sh, { root: '/nonexistent', baseRev: 'r0', readBase: () => fake('t1'), readNow: () => fake('t1') });
  if (!(ck.ok === false && ck.falseSame.join(',') === 'calaudit' && ck.rows.find((r) => r.key === 'kf0').cat === 'trueDiff' && ck.rows.find((r) => r.key === 'kf0').explain.join(',') === 'html' && ck2.ok === true && ck2.count.trueSame === 1 && ck2.count.overRun === 1))
    bad.push('② 照合の口: ' + JSON.stringify(ck.count) + ' / ' + JSON.stringify(ck2.count));
  cases.push(`② 照合の分類: 影 reuse・同じ → trueSame・影 reuse・違う → falseSame(門の取りこぼし —— 照合は ok false)・影で走る・違う → trueDiff(理由の種類を添える)・影で走る・同じ → overRun・欠測 → na`);
  // ③ 照合の物理の値
  const a = { meta: { targetSha256: 'a'.repeat(64) }, when: 't1', inputs: { calauditWhen: 't1' }, stamp: { inHtml: 'h1', inCanonicalNow: 'c1', valuesChanged: false }, rows: [{ id: 'x', v: 1, wallSec: 3 }] };
  const b = { meta: { targetSha256: 'b'.repeat(64) }, when: 't2', inputs: { calauditWhen: 't2' }, stamp: { inHtml: 'h2', inCanonicalNow: 'c2', valuesChanged: false }, rows: [{ id: 'x', v: 1, wallSec: 9 }] };
  const c = JSON.parse(JSON.stringify(b)); c.rows[0].v = 2;
  const ra = 'tests/out/assessed-w273c.json';
  if (!(shadowPhysSha(a, ra) === shadowPhysSha(b, ra) && shadowPhysSha(a, ra) !== shadowPhysSha(c, ra))) bad.push('③ 照合の物理の値(刻印の欄を外す・物理の値は外さない)');
  cases.push('③ 照合の物理の値: meta・時刻・壁時計・calauditWhen・stamp.inHtml(html の sha)の差は同じ・行の値の 1 つの差は違う');
  return { version: ALWAYS_SHADOW_VERSION, ok: bad.length === 0, bad, cases };
}

/** 宣言の検査(QA): 鍵 = 常時群・reads の名・none の段の器の閉包が html を読まない(headless・Chromium の口が無い)・scope の段の正本が完全な領域・follows は集約段。 */
export function declProblems(o) {
  const root = String(o.root).replace(/\/$/, '');
  const STEPS = o.steps || REGEN_STEPS, D = o.decl || ALWAYS_SHADOW_DECL_326E;
  const out = [];
  const always = STEPS.filter((z) => z.alwaysRun && z.role !== 'history').map((z) => z.key).sort();
  const keys = Object.keys(D).sort();
  if (JSON.stringify(always) !== JSON.stringify(keys)) out.push('宣言の鍵 ≠ 常時群(常時群だけ ' + always.filter((k) => !keys.includes(k)).join(',') + '・宣言だけ ' + keys.filter((k) => !always.includes(k)).join(',') + ')');
  for (const k of keys) {
    const d = D[k], st = STEPS.find((z) => z.key === k);
    if (!st) continue;
    if (!(typeof d.why === 'string' && d.why.length > 10)) out.push(k + ' の why');
    if (d.html === 'reads') { const r = shadowReadsOf(k, D); const p = readsProblems(r); if (p.length) out.push(k + ' の reads: ' + p.join(',')); if (r && !(r.includes('code') && r.includes('markup'))) out.push(k + ' の reads が code・markup を含まない'); }
    else if (d.html === 'none') {
      const cl = closureOf(st, root);
      for (const f of cl.exec) { const t = readText(root, f) || ''; if (/loadHtml(?:Main|Headless)?\(|chromium\.launch|\.goto\(|evalExpr\(/.test(t)) { out.push(k + ' は html を読まないと宣言したが器の閉包 ' + f + ' に html を読む口がある'); break; } }
    } else if (d.html === 'scope') {
      const m = readMeta(root, (st.outs || [])[0] || '');
      if (!(m && m.scope && m.scopeComplete === true)) out.push(k + ' は scope と宣言したが正本に完全な領域の宣言が無い');
    } else if (d.html === 'follows') { if (!st.htmlAggregate) out.push(k + ' は follows(集約段)と宣言したが htmlAggregate でない'); }
    else out.push(k + ' の html の読み方が知らない値: ' + d.html);
  }
  return out;
}

export default { ALWAYS_SHADOW_VERSION, ALWAYS_SHADOW_DECL_326E, CAL_READS_326E, GROUP_STAMP_KEY_326E, EXTRA_STAMP_KEYS_326E, EXTRA_STAMP_PTRS_326E, shadowReadsOf, closureOf, lastRevOf,
  blobsAt, fileDrift, shadowJudge, alwaysShadow, shadowPhysValue, shadowPhysSha, checkClass, alwaysShadowCheck, shadowRows, alwaysShadowSelfTest, declProblems };

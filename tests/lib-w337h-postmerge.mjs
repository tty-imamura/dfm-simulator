// 第337便h(統括の検証項目 R344 —— 原仮定者の指示(2026-11-14 —— 第138報)の便の道具): **受け入れ(post-merge)の道具 4 つ**。判定の式は変えない(道具と照合の補助だけ)。
//
// ■ 何が起きたか(第336便)
//   (1) post-merge の ① 静的受理(tests/qa-preflight.mjs —— 約 42 分)の途中でコンテナが再起動した(472/529 鍵まで)。済みの鍵を手で数えて残り 57 鍵を
//       部分 QA で回して継いだ(preflight 専用の項 `preflight.*` を残りの一覧に入れて 1 回落ちた)。
//   (2) root を対象にしても beta の正本を読む鍵(docs.emgrid-sync)が、本を beta だけで動かす便で root の対象で落ちてゲートが 1 回止まった。直した鍵を root の対象で
//       回していなかった・post-merge の ④ の root の常設集合にこの鍵が無かった。直しは「E0 の署名は beta の対象でだけ照合」で、root の旧い E0 そのものは見ていなかった。
//   (3) 段を履歴へ回したときの名残り(煙試験の窓の表・簡易の指紋の記録)と、fitRecord の標的を変えたのに観測の時間標準の記録が旧いままだったことが、
//       別々の鍵の印のない FAIL として出て、理由の文から型が読みにくかった。
//
// ■ 本 lib がすること
//   ① 済み印の契約(AN707): `resumeContract(o)`・`contractDiff(a, b)`・`readDone(file)`・`appendDone(file, rec)` —— preflight の鍵(最上位の試験の文)ごとの結果を
//      JSON Lines に終わるたびに追記(fsync)し、契約(対象の html の SHA-256・tests/qa.mjs と preflight と切り出しの lib の指紋・鍵の一覧・Node の版・環境変数・作業の木)が
//      同じときだけ続きから回す。1 つでも違えば最初から(理由を 1 行)。preflight 専用の項は種類 'preflight' として別に持ち、`remainingIds` は qa.mjs の鍵だけを返す。
//   ② 本便で直した鍵(AN710): `changedQaIds(baseSrc, nowSrc)` —— 便の基点と今の tests/qa.mjs を最上位の文で切り、`add('<id>'` の塊の本文が変わった(または新しい)
//      鍵の id を返す(静的)。id が式で作られる文(接頭辞だけ拾える)と、試験の文でない宣言の変更は「拾えなかった」と数を返す。
//   ③ 名残りの lint(AN706): `historyLeftovers(history, tables)` —— 履歴の段の名が現行の表に残っていないか(理由の文に型「段を履歴へ回したときの名残り」)。
//      `fitTargetMismatch(o)` —— 在位の本の fitRecord の標的と観測の時間標準の記録の行の対応(両向き —— 理由の文に型「fitRecord の標的と記録の食い違い」)。
//   ④ root の旧い E0(AN710): `EMGRID_ROOT_E0_FILE` の凍結の入力(第336便の前の正本 emgrid の E0 の行の写し)と `checkRootE0(o)`。
// ■ しないこと: html・正本・段の宣言を書かない。QA の判定を緩めない(beta の対象の照合はそのまま)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const POSTMERGE_337H_VERSION = 'w337h-postmerge-1';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const shaFile = (f) => { try { return sha256(fs.readFileSync(f)); } catch (e) { return 'missing'; } };

// ---------------------------------------------------------------------------------------------
// ① 済み印の契約(preflight の続きから)
// ---------------------------------------------------------------------------------------------
export const RESUME_337H_VERSION = 'w337h-resume-1';
/** 契約に入れる環境変数(QA_* と器の W###x_* —— lint が process.env で読む名の型)。NODE_OPTIONS(heap)と出力の置き場は入れない。 */
export const CONTRACT_ENV_RE = /^(QA_|W\d{3}[A-Z]?_)/;
export const CONTRACT_ENV_SKIP = Object.freeze(['QA_PREFLIGHT_OUT', 'QA_PREFLIGHT_STOP_AFTER']);   // 出力の置き場と再起動の合成は契約の外
/** 契約の欄(順)—— contractDiff が最初に違った欄の名を理由に出す。 */
export const CONTRACT_FIELDS = Object.freeze(['version', 'target', 'targetSha256', 'qaSha256', 'preflightSha256', 'libSha256', 'keysSha256', 'nKeys', 'node', 'env', 'tree']);

/** 作業の木の指紋(HEAD と追跡しているファイルの未コミットの差 —— 追跡していないファイルは入れない)。git が無ければ 'unknown'。 */
export function treeFingerprint(root) {
  try {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const diff = execFileSync('git', ['diff', 'HEAD', '--binary'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 30 });
    return head + ':' + sha256(diff).slice(0, 16);
  } catch (e) { return 'unknown'; }
}

/**
 * 済み印の契約。
 * @param {{root:string, target:string, keys:Array<{l0:number, ids:string[], sha:string}>, env?:object, node?:string, tree?:string}} o
 */
export function resumeContract(o) {
  const root = o.root || ROOT, env = o.env || process.env;
  const envPick = Object.fromEntries(Object.keys(env).filter((k) => CONTRACT_ENV_RE.test(k) && !CONTRACT_ENV_SKIP.includes(k)).sort().map((k) => [k, String(env[k])]));
  return {
    version: RESUME_337H_VERSION,
    target: o.target,
    targetSha256: shaFile(path.join(root, o.target)),
    qaSha256: shaFile(path.join(root, 'tests', 'qa.mjs')),
    preflightSha256: shaFile(path.join(root, 'tests', 'qa-preflight.mjs')),
    libSha256: sha256(['lib-w279b-qaorder.mjs', 'lib-w279b-headless.mjs', 'lib-w337h-postmerge.mjs'].map((f) => shaFile(path.join(root, 'tests', f))).join(',')),
    keysSha256: sha256(JSON.stringify(o.keys.map((k) => [k.l0, k.ids, k.sha]))),
    nKeys: o.keys.length,
    node: o.node || process.version,
    env: envPick,
    tree: o.tree !== undefined ? o.tree : treeFingerprint(root),
  };
}

/** 2 つの契約の違い → null(同じ)か 1 行の理由。 */
export function contractDiff(a, b) {
  if (!a) return '済み印の契約が無い(初めての走行)';
  for (const f of CONTRACT_FIELDS) {
    const x = JSON.stringify(a[f]), y = JSON.stringify(b[f]);
    if (x !== y) {
      if (f === 'env') {
        const ks = [...new Set(Object.keys(a.env || {}).concat(Object.keys(b.env || {})))].filter((k) => (a.env || {})[k] !== (b.env || {})[k]);
        return `契約の欄 env が違う(${ks.slice(0, 4).join('・')})`;
      }
      return `契約の欄 ${f} が違う(${String(x).slice(0, 24)} → ${String(y).slice(0, 24)})`;
    }
  }
  return null;
}

/** 済み印の追記(1 行の JSON —— 書いて fsync。途中で落ちた行は readDone が読まない)。 */
export function appendDone(file, rec) {
  const fd = fs.openSync(file, 'a');
  try { fs.writeSync(fd, JSON.stringify(rec) + '\n'); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
/** 済み印の読み取り → { recs: Map<'kind:key', rec>, bad: 読めない行の数 }。 */
export function readDone(file) {
  const recs = new Map();
  let bad = 0;
  let txt = '';
  try { txt = fs.readFileSync(file, 'utf8'); } catch (e) { return { recs, bad }; }
  for (const line of txt.split('\n')) {
    if (!line.trim()) continue;
    try { const r = JSON.parse(line); if (r && (r.kind === 'qa' || r.kind === 'preflight') && r.key !== undefined) recs.set(r.kind + ':' + r.key, r); else bad++; }
    catch (e) { bad++; }
  }
  return { recs, bad };
}
/** 契約を原子的に書く(一時のファイル → rename)。 */
export function writeJsonAtomic(file, obj) {
  const tmp = file + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 1));
  fs.renameSync(tmp, file);
}

/** 済み印の中で済んでいない qa.mjs の鍵(preflight 専用の項は入れない)→ { ids, prefixes, units }。 */
export function remainingIds(keys, recs) {
  const ids = [], prefixes = [];
  let units = 0;
  for (const k of keys) {
    if (recs.has('qa:' + k.l0)) continue;
    units++;
    ids.push(...k.ids.filter((x) => !/^preflight\./.test(x)));
    prefixes.push(...(k.prefixes || []));
  }
  return { ids: [...new Set(ids)], prefixes: [...new Set(prefixes)], units };
}

/** 結果の並び → 通しと比べる形(PASS・FAIL の数・FAIL の id の並び・印のない FAIL の id の並び)。 */
export async function resultShape(results) {
  const LK = await import(pathToFileURL(path.join(HERE, 'lib-w320d-lintkinds.mjs')).href);
  const log = results.map((r) => `${r.pass ? 'PASS' : 'FAIL'} ${r.id}  ${r.detail}`).join('\n');
  const s = LK.summarizeLog(log);
  return { total: results.length, pass: results.filter((r) => r.pass).length, fail: results.filter((r) => !r.pass).length,
    ids: results.map((r) => r.id), failIds: results.filter((r) => !r.pass).map((r) => r.id), unmarked: s.unmarked.map((z) => z[0]), other: s.other, stamp: s.stamp };
}

// ---------------------------------------------------------------------------------------------
// ② 本便で直した鍵(基点と今の tests/qa.mjs の差)
// ---------------------------------------------------------------------------------------------
/**
 * @param {string} baseSrc 便の基点の tests/qa.mjs
 * @param {string} nowSrc 今の tests/qa.mjs
 * @returns {{ids:string[], unpickedUnits:number, unpickedPrefixes:string[], declChanged:number, testUnitsChanged:number}}
 */
export async function changedQaIds(baseSrc, nowSrc) {
  const L = await import(pathToFileURL(path.join(HERE, 'lib-w279b-qaorder.mjs')).href);
  const norm = (t) => t.split('\n').map((l) => l.trimEnd()).join('\n').trim();
  const byId = (src) => {
    const m = new Map(), decl = new Map();
    for (const u of L.splitTopLevel(src)) {
      if (L.isTestUnit(u)) { const { ids } = L.unitIds(u.text); for (const id of ids) m.set(id, (m.get(id) || '') + '\n' + norm(u.text)); }
      else if (u.names.length) for (const n of u.names) decl.set(n, norm(u.text));
    }
    return { m, decl, units: L.splitTopLevel(src).filter(L.isTestUnit) };
  };
  const B = byId(baseSrc), N = byId(nowSrc);
  const ids = [];
  for (const [id, t] of N.m) if (B.m.get(id) !== t) ids.push(id);
  const baseTexts = new Set(B.units.map((u) => norm(u.text)));
  let unpickedUnits = 0, testUnitsChanged = 0;
  const unpickedPrefixes = [];
  for (const u of N.units) {
    if (baseTexts.has(norm(u.text))) continue;
    testUnitsChanged++;
    const { ids: a, prefixes } = L.unitIds(u.text);
    if (!a.length) { unpickedUnits++; unpickedPrefixes.push(...prefixes); }
    else if (prefixes.length) unpickedPrefixes.push(...prefixes);
  }
  let declChanged = 0;
  for (const [n, t] of N.decl) if (B.decl.get(n) !== t) declChanged++;
  return { ids, unpickedUnits, unpickedPrefixes: [...new Set(unpickedPrefixes)], declChanged, testUnitsChanged };
}

/** 便の基点(既定): コミットの件名が「第<便>便 開始: beta-build」の最新のコミット(無ければ null)。 */
export function waveBaseRev(root, wave) {
  try {
    const out = execFileSync('git', ['log', '--format=%H %s', '-n', '400'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    for (const line of out.split('\n')) { const i = line.indexOf(' '); if (line.slice(i + 1).startsWith(`第${wave}便 開始: beta-build`)) return line.slice(0, i); }
  } catch (e) { /* git が無い */ }
  return null;
}

// ---------------------------------------------------------------------------------------------
// ③ 名残りの lint
// ---------------------------------------------------------------------------------------------
export const LEFTOVER_KIND = '段を履歴へ回したときの名残り';
export const FITREC_KIND = 'fitRecord の標的と記録の食い違い';
/**
 * @param {Set<string>|string[]} history 履歴の段の名(regentable の role:'history')
 * @param {Object<string, string[]>} tables 表の名 → その表の段の名の並び
 * @returns {string[]} 違反の文
 */
export function historyLeftovers(history, tables) {
  const H = history instanceof Set ? history : new Set(history);
  const bad = [];
  for (const [nm, keys] of Object.entries(tables)) for (const k of (keys || [])) if (H.has(k)) bad.push(`${LEFTOVER_KIND}: ${nm} に履歴の段 ${k} が残る(現行の表から外す)`);
  return bad;
}
/** 文の中の段の名(語として —— 前後が英数字・- でない)。コメントの行は呼び出し側で外す。 */
export function namesInText(text, names) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...names].filter((k) => new RegExp('(^|[^\\w-])' + esc(k) + '(?![\\w-])').test(text));
}

/** 単位を秒(時間)・″/世紀(角の率)・1(無次元)へ。知らない単位は null。 */
export function unitScale(u) {
  const s = String(u || '').trim();
  if (s === 's') return ['t', 1];
  if (s === 'd') return ['t', 86400];
  if (s === 'yr' || s === '年') return ['t', 365.25 * 86400];
  if (s === '″/世紀' || s === 'arcsec/cy') return ['w', 1];
  if (s === '無次元' || s === '1' || s === '') return ['1', 1];
  return null;
}
/** 標的と行の値が同じ量か(単位を換算して相対 1e-6 以内 —— 秒の桁の丸めの差は通す)。 */
export function sameValue(obs, unitT, value, unitR) {
  const a = unitScale(unitT), b = unitScale(unitR), x = Number(obs), y = Number(value);
  if (!a || !b || a[0] !== b[0] || !Number.isFinite(x) || !Number.isFinite(y)) return String(obs) === String(value);
  const X = x * a[1], Y = y * b[1];
  return Math.abs(X - Y) <= 1e-6 * Math.max(Math.abs(X), Math.abs(Y), 1e-300);
}
/**
 * 記録に専用の行を持たず、別の行の注記で指している標的(第337便h の凍結 —— 本便の時点で 2 件。記録の CSV は本便では変えない —— 行を足すのは次の便の決断)。
 * 本と値の組で持つ。在位の本の標的から消えたら「凍結の表が古い」と FAIL(表を外す)。
 */
export const NOTE_ONLY_TARGETS_337H = Object.freeze([
  { book: 'earthMoonSunInertial3d', obs: '18.599525', why: '交点の周期(候補の行 OBS-56488774 —— 記録に行が無い。ems の 3 行の注記の型と別)' },
  { book: 'mercurySunInertial3d', obs: '42.978510382067476', why: '派生した参照値 q⋆ = q_1PN + A1(照合規約の行 mercury-convention-43 が同じ本を持つ —— 値は派生)' },
]);
/**
 * 在位の本の fitRecord の標的 ↔ 観測の時間標準の記録の行(両向き)。
 * @param {{live:Array, rows:Array<object>, pinTarget?:(id:string, value:string)=>object|null}} o
 *   live: 在位の本(fitRecord を読む —— docs.obsTime305 と同じ写し)。rows: 記録の行(列名つき)。
 *   pinTarget(id, value): html の fitRecord を由来に持つ行の標的を引く(docs.obsTime305 ③ と同じ写し —— 省略時は live の今の標的)。
 * @returns {{bad:string[], nTargets:number, nStrict:number, nNote:number, nFrozen:number, nHtmlRows:number}}
 */
export function fitTargetMismatch(o) {
  const live = o.live || [], rows = o.rows || [];
  const bad = [];
  let nTargets = 0, nStrict = 0, nNote = 0, nFrozen = 0, nHtmlRows = 0;
  const frozenSeen = new Set();
  // (向き 1)本の標的 → 行: 本を持つ行で値が同じ量(単位を換算)か、注記が「fitRecord の標的 <値>」とその標的を名指す
  for (const p of live) for (const t of ((p.fitRecord && p.fitRecord.targets) || [])) {
    nTargets++;
    const mine = rows.filter((r) => String(r.books || '').split(';').includes(p.id));
    if (mine.some((r) => sameValue(t.obs, t.unit, r.value, r.unit))) { nStrict++; continue; }
    if (mine.some((r) => String(r.note || '').indexOf('fitRecord の標的 ' + String(t.obs)) >= 0)) { nNote++; continue; }
    const fz = NOTE_ONLY_TARGETS_337H.find((z) => z.book === p.id && z.obs === String(t.obs));
    if (fz) { nFrozen++; frozenSeen.add(fz.book + '|' + fz.obs); continue; }
    bad.push(`${FITREC_KIND}: ${p.id} の fitRecord の標的 ${t.obs} ${t.unit || ''}(${String(t.q || '').slice(0, 30)})に対応する記録の行が無い(行を足すか本の標的を戻す)`);
  }
  for (const z of NOTE_ONLY_TARGETS_337H) if (!frozenSeen.has(z.book + '|' + z.obs)) bad.push(`${FITREC_KIND}: 凍結の表 NOTE_ONLY_TARGETS_337H の ${z.book} ${z.obs} が在位の標的に無い(表が古い —— 外す)`);
  // (向き 2)html の fitRecord を由来に持つ行 → 本の標的: 本が在位・標的が在る・量の名が同じ
  for (const r of rows.filter((x) => /#fitRecord:/.test(String(x.origin || '')))) {
    nHtmlRows++;
    const pid = String(r.origin).split(':')[1];
    const books = String(r.books || '').split(';').filter(Boolean);
    if (!live.some((p) => p.id === pid)) { bad.push(`${FITREC_KIND}: 記録の行 ${r.target_id} の本 ${pid} が在位に無い(行を外すか由来を直す)`); continue; }
    const head = String(r.quantity || '').split(/[ (]/)[0];
    const cands = [];
    for (const b of books.concat([pid])) {
      const p = live.find((q) => q.id === b);
      if (!p) continue;
      const tg = (o.pinTarget && b === pid) ? o.pinTarget(b, String(r.value)) : null;
      for (const t of (tg ? [tg] : []).concat(((p.fitRecord && p.fitRecord.targets) || []))) if (String(t.obs) === String(r.value)) cands.push(t);
    }
    if (!cands.length) { bad.push(`${FITREC_KIND}: 記録の行 ${r.target_id}(${pid}・${r.value} ${r.unit})に当たる fitRecord の標的が無い(標的を変えたら記録の行も直す)`); continue; }
    if (!cands.some((t) => String(t.q) === head || String(t.q).split(/[ (]/)[0] === head)) bad.push(`${FITREC_KIND}: 記録の行 ${r.target_id} の量 ${head} が標的の名(${cands.map((t) => String(t.q).slice(0, 20)).join('・')})と違う`);
  }
  return { bad, nTargets, nStrict, nNote, nFrozen, nHtmlRows };
}

// ---------------------------------------------------------------------------------------------
// ④ root の旧い E0(凍結の入力)
// ---------------------------------------------------------------------------------------------
export const EMGRID_ROOT_E0_FILE = 'tests/data-w337h-emgrid-root-e0.json';
export const EMGRID_ROOT_E0_SHA256 = 'c54b59e0e9d5ed1f112bc8b65458481d1eede26b285a8200927634b01473bc85';
/** 帯(root の 🌘 は昇格まで朔望月の世代 —— 近点回転は照合だけ・8 公転窓の周期は claims の窓と同じ 285〜305 年)。 */
export const ROOT_E0_BAND = Object.freeze([285, 305]);
/**
 * root(リリース世代)の 🌘 の E0 を凍結の入力で見る。
 * @param {{frozen:object, rootSig:string}} o frozen: 凍結の JSON・rootSig: root の html の earthMoonRealKF1 の presetSigHash
 * @returns {{bad:string[], cases:string[]}}
 */
export function checkRootE0(o) {
  const bad = [], cases = [];
  const F = o.frozen;
  if (!F || !Array.isArray(F.rows)) return { bad: ['凍結の入力 ' + EMGRID_ROOT_E0_FILE + ' が読めない'], cases };
  const rows = F.rows.filter((z) => z.id === 'E0');
  if (!(rows.length === 2 && rows.some((z) => z.dt === 0.016) && rows.some((z) => z.dt === 0.008))) bad.push('凍結の入力の E0 の行が dt 0.016・0.008 の 2 本でない');
  for (const z of rows) if (z.presetSigHash !== o.rootSig) bad.push(`root の E0(dt ${z.dt})の署名 ${o.rootSig} が凍結の入力の ${z.presetSigHash} と違う(root の 🌘 が動いた —— 昇格なら凍結の分岐は外れるはず)`);
  const r16 = rows.find((z) => z.dt === 0.016);
  const ap = r16 && r16.run && r16.run.windows && r16.run.windows[0] && r16.run.windows[0].B ? r16.run.windows[0].B.apsPeriodYr : NaN;
  if (!(ap > ROOT_E0_BAND[0] && ap < ROOT_E0_BAND[1])) bad.push(`凍結の入力の E0 の 8 公転窓の近点回転の周期が ${ROOT_E0_BAND[0]}〜${ROOT_E0_BAND[1]} 年の外(${ap})`);
  for (const z of rows) if (!(z.run && z.run.revN >= 27 && !z.run.nan && (z.run.windows || []).every((w) => w.complete))) bad.push(`凍結の入力の E0(dt ${z.dt})が 27 公転まで走っていない/NaN`);
  cases.push(`root の 🌘 の E0 は凍結の入力(${F.source && F.source.rev}・${F.source && F.source.file})の 2 行と署名 ${o.rootSig} が一致・8 公転窓 ${Number(ap).toFixed(3)} 年(${ROOT_E0_BAND[0]}〜${ROOT_E0_BAND[1]} 年)`);
  return { bad, cases };
}

// ---------------------------------------------------------------------------------------------
// 自己試験(合成の入力 —— QA lint.preflightResume337h・lint.rootSetAuto337h・lint.historyLeftovers337h が呼ぶ)
// ---------------------------------------------------------------------------------------------
export async function selfTest337h() {
  const bad = [], cases = [];
  // 契約: 同じ → null・欄ごとに違う → 理由
  const keys = [{ l0: 10, ids: ['a.x'], sha: 'k1' }, { l0: 20, ids: ['a.y'], sha: 'k2' }];
  const c0 = resumeContract({ root: ROOT, target: 'beta/index.html', keys, env: { QA_TARGET: 'beta/index.html', NODE_OPTIONS: '--max-old-space-size=6144' }, node: 'v24.0.0', tree: 't' });
  if (contractDiff(c0, JSON.parse(JSON.stringify(c0))) !== null) bad.push('契約: 同じ契約で違いが出た');
  const vary = [['targetSha256', 'x'], ['qaSha256', 'x'], ['preflightSha256', 'x'], ['node', 'v22.0.0'], ['tree', 'u'], ['nKeys', 3]];
  for (const [f, v] of vary) { const c1 = { ...c0, [f]: v }; const d = contractDiff(c0, c1); if (!(d && d.indexOf(f) >= 0)) bad.push('契約: 欄 ' + f + ' の違いを拾わない'); }
  const cE = resumeContract({ root: ROOT, target: 'beta/index.html', keys, env: { QA_TARGET: 'index.html' }, node: 'v24.0.0', tree: 't' });
  if (!(contractDiff(c0, cE) || '').includes('QA_TARGET')) bad.push('契約: 環境変数 QA_TARGET の違いを拾わない');
  const cN = resumeContract({ root: ROOT, target: 'beta/index.html', keys, env: { QA_TARGET: 'beta/index.html', NODE_OPTIONS: '--max-old-space-size=8192', QA_PREFLIGHT_OUT: '/tmp/x' }, node: 'v24.0.0', tree: 't' });
  if (contractDiff(c0, cN) !== null) bad.push('契約: NODE_OPTIONS・QA_PREFLIGHT_OUT を契約に入れた');
  const cK = resumeContract({ root: ROOT, target: 'beta/index.html', keys: keys.slice(0, 1), env: { QA_TARGET: 'beta/index.html' }, node: 'v24.0.0', tree: 't' });
  if (!(contractDiff(c0, cK) || '').includes('keysSha256')) bad.push('契約: 鍵の一覧の違いを拾わない');
  cases.push(`契約: 同じ → 続き・欄 ${vary.length + 2} 種の違い → 最初から(理由 1 行)・heap と出力の置き場は契約の外`);
  // 済み印: 途中の行の欠け・preflight の項は remaining に入らない
  const tmp = fs.mkdtempSync(path.join((await import('node:os')).tmpdir(), 'w337h-'));
  try {
    const f = path.join(tmp, 'done.jsonl');
    appendDone(f, { kind: 'qa', key: 10, ids: ['a.x'], results: [] });
    appendDone(f, { kind: 'preflight', key: 'preflight.builtinsAcceptBuildStep', results: [] });
    fs.appendFileSync(f, '{"kind":"qa","key":20,"ids":["a.y"],"resu');   // 書きかけの行(再起動の合成)
    const D = readDone(f);
    if (!(D.recs.size === 2 && D.bad === 1 && D.recs.has('qa:10') && D.recs.has('preflight:preflight.builtinsAcceptBuildStep'))) bad.push('済み印: 書きかけの行の扱い ' + JSON.stringify([D.recs.size, D.bad]));
    const R = remainingIds(keys.concat([{ l0: 30, ids: ['preflight.qaBlocks', 'a.z'], sha: 'k3', prefixes: ['p.'] }]), D.recs);
    if (!(JSON.stringify(R.ids) === JSON.stringify(['a.y', 'a.z']) && R.units === 2 && R.prefixes[0] === 'p.')) bad.push('済み印: 残りの一覧 ' + JSON.stringify(R));
    cases.push('済み印: 書きかけの行 1 本は読まない(続きから回る)・残りの一覧は qa.mjs の鍵だけ(preflight.* を混ぜない)');
  } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* 片付け */ } }
  // 本便で直した鍵
  const base = "const x = 1;\n{\n  add('k.a', true, 'a');\n}\n{\n  add('k.b', true, 'b');\n}\n{\n  for (const id of L) add('k.dyn.' + id, true, '');\n}\n";
  const now = "const x = 2;\n{\n  add('k.a', true, 'a');\n}\n{\n  add('k.b', false, 'b2');\n}\n{\n  add('k.c', true, 'c');\n}\n{\n  for (const id of L) add('k.dyn.' + id, false, '');\n}\n";
  const C = await changedQaIds(base, now);
  if (!(JSON.stringify(C.ids) === JSON.stringify(['k.b', 'k.c']) && C.unpickedUnits === 1 && C.unpickedPrefixes[0] === 'k.dyn.' && C.declChanged === 1)) bad.push('直した鍵: ' + JSON.stringify(C));
  cases.push(`直した鍵: 合成の 2 版 → ${C.ids.join('・')}(変わらない k.a は入れない)・拾えなかった文 ${C.unpickedUnits}(接頭辞 ${C.unpickedPrefixes.join('')})・宣言の変更 ${C.declChanged}`);
  // 名残り
  const hb = historyLeftovers(['h-1'], { SMOKE_KNOBS: ['c-1', 'h-1'], quickfp: ['c-1'] });
  if (!(hb.length === 1 && hb[0].startsWith(LEFTOVER_KIND) && hb[0].indexOf('SMOKE_KNOBS') >= 0)) bad.push('名残り: ' + JSON.stringify(hb));
  if (historyLeftovers(['h-1'], { SMOKE_KNOBS: ['c-1'] }).length) bad.push('名残り: 現行だけの表で違反');
  cases.push('名残り: 履歴の段を 1 つ表に戻した合成 → 1 件(型の語つき)/ 現行だけ → 0');
  // fitRecord ↔ 記録
  const live = [{ id: 'b1', fitRecord: { targets: [{ q: 'orbitalPeriodMean', obs: 2360594.88, unit: 's' }, { q: 'apsidalPeriod118', obs: 8.85, unit: '年' }] } }];
  const rows = [{ target_id: 'r1', books: 'b1', quantity: 'orbitalPeriodMean', value: '2360594.88', unit: 's', origin: 'beta/index.html#fitRecord:b1', note: 'fitRecord の標的' },
    { target_id: 'r2', books: 'b1', quantity: 'apsidalPeriod118', value: '8.85', unit: '年', origin: 'beta/index.html#fitRecord:b1', note: 'fitRecord の標的' }];
  const ok = fitTargetMismatch({ live, rows });
  const okBad = ok.bad.filter((s) => s.indexOf('NOTE_ONLY_TARGETS_337H') < 0);
  if (okBad.length) bad.push('fitRecord: 対応する合成で違反 ' + okBad[0]);
  const del = fitTargetMismatch({ live, rows: rows.slice(0, 1) }).bad.filter((s) => s.indexOf('NOTE_ONLY_TARGETS_337H') < 0);
  if (!(del.length === 1 && del[0].startsWith(FITREC_KIND) && del[0].indexOf('8.85') >= 0)) bad.push('fitRecord: 行を消した合成 ' + JSON.stringify(del));
  const old = fitTargetMismatch({ live, rows: rows.concat([{ target_id: 'r0', books: 'b1', quantity: 'synodicMonthUniform', value: '29.530588857710324', unit: 'd', origin: 'beta/index.html#fitRecord:b1', note: '' }]) }).bad.filter((s) => s.indexOf('NOTE_ONLY_TARGETS_337H') < 0);
  if (!(old.length === 1 && old[0].indexOf('r0') >= 0)) bad.push('fitRecord: 旧い標的の行が残る合成 ' + JSON.stringify(old));
  if (!sameValue(27.321661, 'd', '2360591.558227737', 's') || sameValue(8.85, 'yr', '5.997', 'yr')) bad.push('fitRecord: 単位の換算');
  cases.push('fitRecord: 対応する合成 → 0・行を 1 つ消した合成 → 1 件(標的 8.85)・旧い標的の行が残る合成(第336便の型)→ 1 件・日 ↔ 秒の換算');
  // root の E0
  const fz = { source: { rev: 'r', file: 'f' }, rows: [{ id: 'E0', dt: 0.016, presetSigHash: 's0', run: { revN: 27, nan: false, windows: [{ complete: true, B: { apsPeriodYr: 293.85 } }, { complete: true, B: {} }] } },
    { id: 'E0', dt: 0.008, presetSigHash: 's0', run: { revN: 27, nan: false, windows: [{ complete: true, B: { apsPeriodYr: 293.85 } }] } }] };
  if (checkRootE0({ frozen: fz, rootSig: 's0' }).bad.length) bad.push('root E0: 一致の合成で違反');
  if (checkRootE0({ frozen: fz, rootSig: 's1' }).bad.length !== 2) bad.push('root E0: 署名が違う合成で 2 件でない');
  cases.push('root E0: 凍結の入力と同じ署名 → 0・違う署名 → 2 件(dt 2 本)');
  return { ok: bad.length === 0, bad, cases };
}

// ---------------------------------------------------------------------------------------------
// CLI(post-merge-qa.sh が呼ぶ)
//   node tests/lib-w337h-postmerge.mjs --changed-ids <基点 rev>   → 1 行目: 鍵の id(空白区切り)・2 行目: 要約の句
//   node tests/lib-w337h-postmerge.mjs --wave-base <便>            → 便の基点のコミット(無ければ空行)
//   node tests/lib-w337h-postmerge.mjs --self-test                 → 自己試験(JSON・終了コード)
// ---------------------------------------------------------------------------------------------
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2), arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  if (argv.includes('--self-test')) {
    const r = await selfTest337h();
    console.log(JSON.stringify(r, null, 1));
    process.exit(r.ok ? 0 : 1);
  } else if (arg('--wave-base')) {
    console.log(waveBaseRev(ROOT, arg('--wave-base')) || '');
  } else if (arg('--changed-ids')) {
    const rev = arg('--changed-ids');
    let base = null;
    try { base = execFileSync('git', ['show', rev + ':tests/qa.mjs'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 30 }).toString(); } catch (e) { base = null; }
    if (base === null) { console.log(''); console.log(`本便で直した鍵は拾えなかった(基点 ${rev} の tests/qa.mjs が読めない)`); process.exit(0); }
    const now = fs.readFileSync(path.join(ROOT, 'tests', 'qa.mjs'), 'utf8');
    const C = await changedQaIds(base, now);
    console.log(C.ids.join(' '));
    console.log(`本便で直した鍵 ${C.ids.length}(基点 ${String(rev).slice(0, 7)}・拾えなかった試験の文 ${C.unpickedUnits}${C.unpickedPrefixes.length ? '〔接頭辞 ' + C.unpickedPrefixes.slice(0, 3).join('・') + '〕' : ''}・宣言の変更 ${C.declChanged} —— 宣言の変更から読む鍵は拾わない)`);
  } else {
    console.error('使い方: --changed-ids <rev> | --wave-base <便> | --self-test');
    process.exit(2);
  }
}

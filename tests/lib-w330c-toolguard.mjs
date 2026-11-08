// 第330便c(統括の検証項目 R309 —— 道具)— **名指しの段の physics の鍵の集合の守り**(原仮定者の回答(2026-11-08 —— AN584)「A の条件つき」:
//   fastParams の鍵の名の指紋は次に領域 hash の版を上げる便で。それより前に physics の鍵の集合や閉包の読みを変える便では、該当する名指しの段を明示に regen して
//   危ない reuse を許さない)と、**計画と lint の道具の照合の一致**を数える関数(道具の便の試験 —— tools/toolguard-probe330c.mjs・QA lint.toolCheckProv330c・lint.physKeysGuard330c)。
//
// ■ なぜ(第329便c の報告の決断事項候補 D1・台帳の AN584)
//   名指しの本の段(REGEN_SCOPE の presets が id の列)の閉包は fastParams を持つ(validatePreset ほか —— 実測 138/138 本)。fastParams は**内蔵の全本の physics の鍵の名**から
//   S.params の雛形(鍵の並び)を作るが、領域 hash は名指しの本の中身と閉包の関数の本文だけを刻む —— 名指しでない本に新しい physics の鍵を足すと雛形が変わっても
//   名指しの段の領域 hash は同じ(reuse)。条件で選ぶ本の段(presetsWhere —— 第329便c)は指紋 physicsKeysSha を本文に持ち、presets "all" の段は全本の中身を刻むので当たらない。
//
// ■ 規則(版 w330c-physkeys-1 —— 計画 planRegen が理由の種類 physKeys / tableRead で regen を足す。足す向きだけ —— reuse を増やさない)
//   ・当てる正本: 領域の刻印が complete・presets が id の列・対象が html・刻印の html ≠ 今の html(同じなら何も変わっていない)
//   ・閉包の本の表の読み(scopeHash の detail.tableReads330c —— 第329便c の閉包の読みの行の取り方)を宣言の表 REG_READS_329C と照らす:
//       physicsKeys(fastParams —— 全本の physics の鍵の名)→ **刻印の html と今の html の雛形**(Object.keys(fastParams({})) —— 鍵の名と並び。値は読まない)が違えば physKeys
//       宣言の表に無い読み(全本を回す関数など —— 例 inPositionK1State)→ 全本の中身(説明の文を除く)の hash が違えば tableRead
//       宣言の表の byId・byIdFirst・def・identity は名指しの本だけを読む(下限 deriveScope の名指し)—— 守りの外
//   ・刻印の html は候補のファイル(今の html・基点の html)→ git の履歴(lib-w325a-htmlphys の findHtmlBySha)で引く。**引けなければ regen**(保守側 —— 理由 physKeys)
//   ・fastParams の指紋そのもの(領域 hash の版の更新)はしない —— 次に版を上げる便で(AN584)
// ■ 言わないこと: 「雛形が同じなら名指しの段の結果は同じ」(雛形は鍵の並びだけ —— 値は名指しの本の hash が見る)。「全部の危ない reuse を塞いだ」(宣言の表の読みは名指しの本だけを読むという前提 —— lint.regenScope の下限)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { normalizeScope, REG_READS_329C, canonJson, stripPresetProse, SCOPE_VERSION, SCOPE_TOOLING, toolStampOnly, toolStampRecheck } from './lib-w281a-scope.mjs';
import { findHtmlBySha } from './lib-w325a-htmlphys.mjs';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';

export const PHYSKEYS_GUARD_VERSION_330C = 'w330c-physkeys-1';
/** 理由の種類(planRegen の causeKinds)。 */
export const PHYSKEYS_KINDS_330C = Object.freeze({
  physKeys: '名指しの段の閉包の fastParams が読む全本の physics の鍵の名(雛形)が刻印の html と違う —— か刻印の html が引けない',
  tableRead: '名指しの段の閉包に宣言の表に無い本の表の読み(全本を回す関数など)があり、全本の中身(説明の文を除く)が刻印の html と違う',
});
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');

const fpMemo = new Map();   // html の sha → 指紋(1 つの走行の中だけ)
const pathMemo = new Map();   // html のパス|大きさ|更新時刻 → 指紋(同じファイルを正本ごとに読み直さない)
/**
 * html の指紋: fastParams の雛形(鍵の名と並び)と全本の中身(説明の文を除く —— 現行の版の stripPresetProse)の hash。
 * @param {string|{buf:Buffer, path?:string}} src html の絶対パスか本文
 * @param {{tmpDir?:string}} [o]
 * @returns {{sha:string, template:string[]|null, templateSha:string|null, tableSha:string|null, nBooks:number|null, why:string[]}}
 */
export function htmlKeysOf330c(src, o) {
  let pk = null;
  if (typeof src === 'string') { try { const st = fs.statSync(src); pk = src + '|' + st.size + '|' + st.mtimeMs; } catch { pk = null; } if (pk && pathMemo.has(pk)) return pathMemo.get(pk); }
  const r0 = htmlKeysOfBuf330(src, o);
  if (pk) pathMemo.set(pk, r0);
  return r0;
}
function htmlKeysOfBuf330(src, o) {
  const buf = typeof src === 'string' ? fs.readFileSync(src) : src.buf;
  const s = sha256(buf);
  if (fpMemo.has(s)) return fpMemo.get(s);
  const why = [];
  let file = typeof src === 'string' ? src : (src.path || null), tmp = null;
  let template = null, tableSha = null, nBooks = null;
  try {
    if (!file) { tmp = fs.mkdtempSync(path.join((o && o.tmpDir) || os.tmpdir(), 'w330c-keys-')); file = path.join(tmp, 'index.html'); fs.writeFileSync(file, buf); }
    const L = loadHtmlHeadless(file);
    try { const t = L.evalExpr('Object.keys(fastParams({}))'); if (Array.isArray(t)) template = t.map(String); else why.push('fastParams の雛形が配列でない'); } catch (e) { why.push('fastParams を評価できない: ' + String(e && e.message || e).slice(0, 80)); }
    try { const B = L.evalExpr('BUILTIN_PRESETS'); if (Array.isArray(B)) { nBooks = B.length; tableSha = sha256(canonJson(B.map((p) => stripPresetProse(p, SCOPE_VERSION)))); } else why.push('BUILTIN_PRESETS が配列でない'); } catch (e) { why.push('BUILTIN_PRESETS を評価できない: ' + String(e && e.message || e).slice(0, 80)); }
  } catch (e) { why.push('html を読めない: ' + String(e && e.message || e).slice(0, 80)); }
  finally { if (tmp) { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* 残っても害は無い */ } } }
  const r = { sha: s, template, templateSha: template ? sha256(JSON.stringify(template)) : null, tableSha, nBooks, why };
  fpMemo.set(s, r);
  return r;
}

/** 閉包の本の表の読み(関数名 → 行)を宣言の表で分ける: 宣言の表と行が同じなら表の型・違えば(か表に無ければ)unknown。 */
export function classifyReads330c(reads) {
  const kinds = {}, unknown = [], physicsKeys = [];
  for (const [fn, ls] of Object.entries(reads || {})) {
    const w = REG_READS_329C[fn];
    const k = (w && JSON.stringify(ls) === JSON.stringify(w.lines)) ? w.kind : 'unknown';
    kinds[fn] = k;
    if (k === 'unknown') unknown.push(fn); else if (k === 'physicsKeys') physicsKeys.push(fn);
  }
  return { kinds, unknown, physicsKeys };
}

/**
 * 判定(純関数): 閉包の読みと、刻印の html と今の html の指紋から、守りが regen を足すか。
 * @param {{reads:object, stampFp:object|null, nowFp:object}} o stampFp が null = 刻印の html が引けない
 * @returns {{applicable:boolean, need:boolean, kind:string|null, why:string|null, physicsKeys:string[], unknown:string[]}}
 */
export function physKeysDecide330c(o) {
  const c = classifyReads330c(o.reads);
  const base = { physicsKeys: c.physicsKeys, unknown: c.unknown };
  if (!c.physicsKeys.length && !c.unknown.length) return Object.assign({ applicable: false, need: false, kind: null, why: null }, base);
  const S = o.stampFp, N = o.nowFp;
  if (!S) return Object.assign({ applicable: true, need: true, kind: 'physKeys', why: '刻印の html が引けない(候補のファイル・git の履歴に無い —— 保守側で走らせる)' }, base);
  if (c.physicsKeys.length) {
    if (!S.templateSha || !N.templateSha) return Object.assign({ applicable: true, need: true, kind: 'physKeys', why: 'fastParams の雛形が引けない(' + (S.why.concat(N.why)[0] || '?') + ')' }, base);
    if (S.templateSha !== N.templateSha) {
      const a = new Set(S.template), b = new Set(N.template);
      const add = N.template.filter((k) => !a.has(k)), del = S.template.filter((k) => !b.has(k));
      return Object.assign({ applicable: true, need: true, kind: 'physKeys', why: 'fastParams の雛形が違う(' + (add.length ? '足す ' + add.slice(0, 3).join(',') : '') + (add.length && del.length ? '・' : '')
        + (del.length ? '消える ' + del.slice(0, 3).join(',') : '') + (!add.length && !del.length ? '鍵の並び' : '') + ' —— ' + c.physicsKeys.join(',') + ')' }, base);
    }
  }
  if (c.unknown.length) {
    if (!S.tableSha || !N.tableSha) return Object.assign({ applicable: true, need: true, kind: 'tableRead', why: '全本の中身が引けない' }, base);
    if (S.tableSha !== N.tableSha) return Object.assign({ applicable: true, need: true, kind: 'tableRead', why: '閉包の宣言の表に無い本の表の読み ' + c.unknown.slice(0, 3).join(',') + ' —— 全本の中身が違う' }, base);
  }
  return Object.assign({ applicable: true, need: false, kind: null, why: null }, base);
}

/**
 * 守り(I/O): 正本の meta と今の html の領域の結果(scopeHash —— detail.tableReads330c)から判定。当てない正本は null。
 * @param {{root:string, meta:object, html:string, full:object, files?:string[], gitDepth?:number, tmpDir?:string}} o
 */
export function physKeysGuard330c(o) {
  const m = o.meta;
  if (!m || !m.scope || m.scopeComplete !== true || !/\.html$/.test(String(m.target || ''))) return null;
  const sc = normalizeScope(m.scope);
  if (!Array.isArray(sc.presets)) return null;   // presets "all"(全本の中身を刻む)・presetsWhere(指紋 physicsKeysSha)は当たらない
  const reads = o.full && o.full.detail ? o.full.detail.tableReads330c : undefined;
  if (reads === undefined) return { applicable: true, need: true, kind: 'physKeys', why: '閉包の本の表の読みが引けない(領域の結果に detail.tableReads330c が無い)', physicsKeys: [], unknown: [] };
  const nowFp = htmlKeysOf330c(o.html, { tmpDir: o.tmpDir });
  if (nowFp.sha === m.targetSha256) return Object.assign(physKeysDecide330c({ reads, stampFp: nowFp, nowFp }), { from: 'same' });
  const c = classifyReads330c(reads);
  if (!c.physicsKeys.length && !c.unknown.length) return physKeysDecide330c({ reads, stampFp: null, nowFp });
  let stampFp = null, from = null;
  const memo = fpMemo.get(m.targetSha256);
  if (memo) { stampFp = memo; from = 'memo'; }
  else {
    const h = findHtmlBySha({ root: o.root, sha: m.targetSha256, files: o.files || [], gitDepth: o.gitDepth });
    if (h) { stampFp = htmlKeysOf330c(h.from.startsWith('file:') ? h.from.slice(5) : { buf: h.buf }, { tmpDir: o.tmpDir }); from = h.from.startsWith('git:') ? 'git:' + String(h.rev).slice(0, 7) : 'file'; }
  }
  return Object.assign(physKeysDecide330c({ reads, stampFp, nowFp }), { from });
}

/**
 * 自己試験(純関数 —— QA lint.physKeysGuard330c ①): 鍵を足す → physKeys・値だけ → なし・並び → physKeys・表に無い読み + 値 → tableRead・刻印の html なし → physKeys・
 * 読みが宣言の表の byId だけ → 当てない・fastParams の行の書き換え → unknown(表と違う行)。
 */
export function physKeysSelfTest330c() {
  const bad = [], cases = [];
  const fp = (t, table) => ({ template: t, templateSha: sha256(JSON.stringify(t)), tableSha: table, why: [] });
  const R = { fastParams: REG_READS_329C.fastParams.lines.slice(), validatePreset: REG_READS_329C.validatePreset.lines.slice() };
  const T0 = ['G', 'D0', 'geoPN'], T1 = ['G', 'D0', 'geoPN', 'w330cProbeKey'], T2 = ['D0', 'G', 'geoPN'];
  const rows = [
    ['鍵を足す', { reads: R, stampFp: fp(T0, 'a'), nowFp: fp(T1, 'b') }, true, 'physKeys'],
    ['値だけ(雛形は同じ・中身は違う)', { reads: R, stampFp: fp(T0, 'a'), nowFp: fp(T0, 'b') }, false, null],
    ['鍵の並び', { reads: R, stampFp: fp(T0, 'a'), nowFp: fp(T2, 'a') }, true, 'physKeys'],
    ['表に無い読み + 値', { reads: Object.assign({}, R, { inPositionK1State: ['for(const p of BUILTIN_PRESETS){ x(p); }'] }), stampFp: fp(T0, 'a'), nowFp: fp(T0, 'b') }, true, 'tableRead'],
    ['表に無い読み + 同じ中身', { reads: Object.assign({}, R, { inPositionK1State: ['for(const p of BUILTIN_PRESETS){ x(p); }'] }), stampFp: fp(T0, 'a'), nowFp: fp(T0, 'a') }, false, null],
    ['刻印の html が引けない', { reads: R, stampFp: null, nowFp: fp(T0, 'a') }, true, 'physKeys'],
    ['読みが byId だけ', { reads: { validatePreset: R.validatePreset }, stampFp: fp(T0, 'a'), nowFp: fp(T1, 'b') }, false, null],
    ['fastParams の行の書き換え(表と違う → unknown)', { reads: { fastParams: ['for(const q of BUILTIN_PRESETS) ks.add(q.id);'] }, stampFp: fp(T0, 'a'), nowFp: fp(T0, 'b') }, true, 'tableRead'],
  ];
  for (const [nm, a, need, kind] of rows) { const r = physKeysDecide330c(a); if (r.need !== need || r.kind !== kind) bad.push(nm + ' → ' + r.need + '/' + r.kind + '(期待 ' + need + '/' + kind + ')'); }
  const na = physKeysDecide330c({ reads: { validatePreset: R.validatePreset }, stampFp: null, nowFp: fp(T0, 'a') });
  if (na.applicable !== false) bad.push('byId だけの読みに守りを当てた');
  cases.push(`判定 ${rows.length} 例(鍵を足す・並び・刻印の html なし → physKeys / 値だけ → なし / 表に無い読み + 中身 → tableRead / byId だけ → 当てない)`);
  return { version: PHYSKEYS_GUARD_VERSION_330C, ok: bad.length === 0, bad, cases };
}

// ---------------------------------------------------------------- 計画と lint の道具の照合の一致(R309)
/**
 * 正本ごとの lint の道具の照合(lint.provenanceMeta の ④ の道具の行と同じ条件)—— 道具の差がある行だけ。
 * @param {string} root
 * @param {object} meta
 * @param {object} [SC] 刻印の道具の lib(既定はこの lib が読む lib —— 前後の比べで旧の lib を渡す)
 * @returns {Array<{file:string, stampOnly:boolean, ok:boolean, why:string[]}>}
 */
export function lintToolRows330c(root, meta, SC) {
  const S = SC || { SCOPE_TOOLING, toolStampOnly, toolStampRecheck };
  const out = [];
  const files = (meta && Array.isArray(meta.code) ? meta.code : []).map((z) => z.file);
  for (const c of ((meta && meta.code) || [])) {
    if (!S.SCOPE_TOOLING.includes(c.file)) continue;
    let now = null; try { now = sha256(fs.readFileSync(String(root).replace(/\/$/, '') + '/' + c.file)); } catch { now = null; }
    if (now === c.sha256) continue;
    const only = S.toolStampOnly(root, files, c.file);
    const rc = only ? S.toolStampRecheck(root, meta) : { ok: false, why: ['道具を計算に使う器'] };
    out.push({ file: c.file, stampOnly: only, ok: only && rc.ok, why: rc.why || [] });
  }
  return out;
}
/**
 * 計画の行(planRegen の steps)と lint の道具の照合を突き合わせる: 段の正本のどれかで lint が道具の行を落とすなら、計画はその段を regen(自分の判定)にしていること。
 * 計画が道具の照合で通した段(toolChecked)の正本は lint も通すこと。
 * @param {{root:string, plan:{steps:object[]}, outsOf:(key:string)=>string[], SC?:object}} o
 * @returns {{agree:boolean, rows:object[], planReuseLintFail:string[], planRegenLintOk:string[]}}
 */
export function toolAgree330c(o) {
  const rows = [], planReuseLintFail = [], planRegenLintOk = [];
  for (const st of (o.plan.steps || [])) {
    if (st.status === 'history') continue;
    const outs = o.outsOf(st.key) || [];
    let lintFail = false, any = false;
    for (const out of outs) {
      let m = null; try { m = JSON.parse(fs.readFileSync(String(o.root).replace(/\/$/, '') + '/' + out, 'utf8')).meta; } catch { m = null; }
      if (!m) continue;
      const lr = lintToolRows330c(o.root, m, o.SC);
      if (!lr.length) continue;
      any = true;
      if (lr.some((z) => !z.ok)) lintFail = true;
      rows.push({ key: st.key, out, own: st.ownStatus, lint: lr.map((z) => (z.ok ? 'ok' : 'NG') + (z.stampOnly ? '' : '(計算)')).join(','), toolChecked: !!(st.toolChecked && st.toolChecked.length) });
    }
    if (!any) continue;
    const planRegen = st.ownStatus === 'regen' || st.ownStatus === 'always';
    if (lintFail && !planRegen) planReuseLintFail.push(st.key);
    if (!lintFail && (st.causeKinds || []).some((k) => k === 'tool') && !(st.causeKinds || []).some((k) => k !== 'tool')) planRegenLintOk.push(st.key);
  }
  return { agree: planReuseLintFail.length === 0 && planRegenLintOk.length === 0, rows, planReuseLintFail, planRegenLintOk };
}

// ---------------------------------------------------------------- 計画の上の自己試験(一時の root —— 小さな表を planRegen に渡す)
const shaText330 = (t) => sha256(Buffer.from(String(t), 'utf8'));
const flip330 = (h) => (h[0] === '0' ? '1' : '0') + h.slice(1);
/** 一時の root(tests/・tests/out/・beta/index.html の写し)を作る。 */
function tmpRoot330(root, o, tag) {
  const tmp = fs.mkdtempSync(path.join((o && o.tmpDir) || os.tmpdir(), 'w330c-' + tag + '-'));
  fs.mkdirSync(path.join(tmp, 'tests', 'out'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'beta'), { recursive: true });
  fs.copyFileSync(path.join(String(root).replace(/\/$/, ''), 'beta', 'index.html'), path.join(tmp, 'beta', 'index.html'));
  return tmp;
}
const W330 = (tmp, f, t) => { fs.writeFileSync(path.join(tmp, f), t); return shaText330(t); };
const metaOf330 = (o) => ({ provenanceVersion: 'w272e-1', wave: '第330便c(自己試験)', generatedAt: '2026-11-08T00:00:00.000Z', target: o.target, targetSha256: o.targetSha256,
  inputs: [{ file: o.target, sha256: o.targetSha256 }], code: o.code, inputsStable: [], scope: o.scope, scopeSha256: o.scopeSha256, scopeComplete: true });
/** 自己試験の小さな領域の宣言(内蔵の本 projectile・閉包は HP.validatePreset から —— fastParams を含む)。 */
export const SELFTEST_DECL_330C = Object.freeze({ presets: ['projectile'], roots: ['HP.validatePreset'], core: false, consts: [], complete: true });

/**
 * 道具の照合の計画と lint の一致(QA lint.toolCheckProv330c ③): 4 つの段 —— a html の対象・刻印だけ・領域一致 / b lib の対象・刻印だけ・領域一致(第329便の chainledger の型)/
 * c lib の対象・刻印だけ・領域 1 字違い / d html の対象・道具を計算に使う器 —— を planRegen に渡し、計画の判定(a・b reuse で道具の照合・c regen〔tool〕・d regen〔code〕)と
 * lint の道具の照合(lintToolRows330c)が揃う(toolAgree330c)。旧の規則(計画は対象が html でないと領域を見ない・lint の scopeOkNow は対象が html でないと不一致)なら b・c で食い違う。
 */
export async function toolPlanSelfTest330c(root, o) {
  const RT = await import('./lib-w281a-regentable.mjs');
  const SCm = await import('./lib-w281a-scope.mjs');
  const bad = [], cases = [];
  const tmp = tmpRoot330(root, o, 'toolplan');
  try {
    W330(tmp, 'tests/lib-w281a-scope.mjs', '// 第330便c の自己試験の写し(道具の sha が刻印と違う)\n');
    const hA = W330(tmp, 'tests/exp-w330cA.mjs', "import { scopeStamp } from './lib-w281a-scope.mjs';\n");
    const hC = W330(tmp, 'tests/exp-w330cC.mjs', "import { scopeStamp, scopeHash } from './lib-w281a-scope.mjs';\n");
    const hT = W330(tmp, 'tests/lib-w330cT.mjs', 'export const T = 1;\n');
    const st = SCm.scopeStamp(path.join(tmp, 'beta', 'index.html'), SELFTEST_DECL_330C);
    if (!st.scopeComplete) return { ok: false, bad: ['自己試験の領域が complete でない'], cases };
    const toolRow = { file: 'tests/lib-w281a-scope.mjs', sha256: '0'.repeat(64) };
    const defs = [
      ['a', 'beta/index.html', 'f'.repeat(64), 'tests/exp-w330cA.mjs', hA, st.scopeSha256, 'reuse'],
      ['b', 'tests/lib-w330cT.mjs', hT, 'tests/exp-w330cA.mjs', hA, st.scopeSha256, 'reuse'],
      ['c', 'tests/lib-w330cT.mjs', hT, 'tests/exp-w330cA.mjs', hA, flip330(st.scopeSha256), 'regen'],
      ['d', 'beta/index.html', 'f'.repeat(64), 'tests/exp-w330cC.mjs', hC, st.scopeSha256, 'regen'],
    ];
    const steps = [];
    for (const [k, target, tsha, harness, hsha, ssha] of defs) {
      const out = 'tests/out/w330c-' + k + '.json';
      fs.writeFileSync(path.join(tmp, out), JSON.stringify({ meta: metaOf330({ target, targetSha256: tsha, code: [{ file: harness, sha256: hsha }, toolRow], scope: st.scope, scopeSha256: ssha }) }));
      steps.push({ key: 'w330c-' + k, cmd: 'node ' + harness, outs: [out], sec: 1, secSource: 'w330c-selftest' });
    }
    const plan = RT.planRegen({ root: tmp, steps, html: path.join(tmp, 'beta', 'index.html'), orderOnly: false, htmlPhys: false, scopeMigrate: false, physKeys: false });
    for (const [k, , , , , , want] of defs) {
      const r = plan.steps.find((z) => z.key === 'w330c-' + k);
      if (!r || r.ownStatus !== want) bad.push(k + ' の計画 ' + (r && r.ownStatus) + '(期待 ' + want + ')');
      if (r && want === 'reuse' && !(r.toolChecked && r.toolChecked.length)) bad.push(k + ' が道具の照合で通っていない');
    }
    const kc = (plan.steps.find((z) => z.key === 'w330c-c') || {}).causeKinds || [], kd = (plan.steps.find((z) => z.key === 'w330c-d') || {}).causeKinds || [];
    if (!(kc.includes('tool') && kd.includes('code'))) bad.push('理由の種類(c tool・d code): ' + kc.join(',') + ' / ' + kd.join(','));
    const ag = toolAgree330c({ root: tmp, plan, outsOf: (key) => (steps.find((z) => z.key === key) || { outs: [] }).outs });
    if (!ag.agree) bad.push('計画と lint が食い違う: ' + JSON.stringify({ reuseLintFail: ag.planReuseLintFail, regenLintOk: ag.planRegenLintOk }));
    // 旧の規則の再現: lint の旧の照合(scopeOkNow)は対象が lib の b で不一致・旧の計画は b・c とも領域を見ずに一致 —— 食い違い
    const mB = JSON.parse(fs.readFileSync(path.join(tmp, 'tests/out/w330c-b.json'), 'utf8')).meta;
    const oldLintB = SCm.scopeOkNow(tmp, mB);
    if (oldLintB !== false) bad.push('旧の lint の照合が b(対象が lib)で一致を返した(再現できない)');
    cases.push(`計画: a ${defs[0][6]}(道具の照合)・b ${defs[1][6]}(対象が lib・領域一致 —— 第329便の型)・c ${defs[2][6]}(tool)・d ${defs[3][6]}(code)/ lint の道具の照合と一致 ${ag.agree}(行 ${ag.rows.length})/ 旧の規則なら b は計画 reuse・lint 不一致(scopeOkNow ${oldLintB})・c は計画 reuse・lint 不一致`);
  } catch (e) { bad.push('例外: ' + String(e && e.stack || e).slice(0, 200)); }
  finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* 残っても害は無い */ } }
  return { ok: bad.length === 0, bad, cases };
}

/**
 * html の変異の写し(K: 名指しでない本 plutoCharonReal の physics に新しい鍵 w330cProbeKey を足す / V: 同じ本の質量の最下位桁だけ —— 第282便e の probeHtmls の mass)。
 * @returns {{K:string|null, V:string|null, why:string[]}}
 */
export function mutateHtml330c(htmlText) {
  const why = [];
  const iP = htmlText.indexOf('id:"plutoCharonReal"');
  let K = null;
  if (iP < 0) why.push('plutoCharonReal が無い');
  else {
    const re = /physics:\s*\{/g; re.lastIndex = iP;
    const m = re.exec(htmlText);
    if (!m) why.push('plutoCharonReal の physics が無い');
    else K = htmlText.slice(0, m.index + m[0].length) + 'w330cProbeKey:1,' + htmlText.slice(m.index + m[0].length);
  }
  let V = null;
  const numRe = /(\bm:\s*)(\d+\.\d*[1-9])/g; numRe.lastIndex = Math.max(0, iP);
  const nm = iP >= 0 ? numRe.exec(htmlText) : null;
  if (nm) { const v = nm[2], last = Number(v[v.length - 1]); V = htmlText.slice(0, nm.index) + nm[1] + v.slice(0, -1) + String(last === 9 ? 8 : last + 1) + htmlText.slice(nm.index + nm[0].length); }
  else why.push('plutoCharonReal の質量の数が無い');
  return { K, V, why };
}

/**
 * physics の鍵の集合の守りの計画の上の自己試験(QA lint.physKeysGuard330c ②③): 名指しの段 n(projectile・閉包は fastParams を持つ)と u(+ 宣言の表に無い読み inPositionK1State)を
 * 今の html で刻み、計画の候補の html を K(名指しでない本に鍵を足す)/ V(値だけ)にして planRegen —— K: n・u regen(physKeys)/ V: n reuse・u regen(tableRead)/
 * K で守りを切る(physKeys:false): n reuse(守りが無いと危ない reuse)。
 */
export async function physKeysPlanSelfTest330c(root, o) {
  const RT = await import('./lib-w281a-regentable.mjs');
  const SCm = await import('./lib-w281a-scope.mjs');
  const bad = [], cases = [];
  const tmp = tmpRoot330(root, o, 'physkeys');
  try {
    const real = path.join(tmp, 'beta', 'index.html');
    const text = fs.readFileSync(real, 'utf8');
    const mu = mutateHtml330c(text);
    if (!mu.K || !mu.V) return { ok: false, bad: ['変異の写しが作れない: ' + mu.why.join('・')], cases };
    const fK = path.join(tmp, 'K.html'), fV = path.join(tmp, 'V.html');
    fs.writeFileSync(fK, mu.K); fs.writeFileSync(fV, mu.V);
    const F0 = htmlKeysOf330c(real), FK = htmlKeysOf330c(fK), FV = htmlKeysOf330c(fV);
    if (!(F0.templateSha && FK.templateSha !== F0.templateSha && FK.template.includes('w330cProbeKey'))) bad.push('② K の雛形が変わらない');
    if (!(FV.templateSha === F0.templateSha && FV.tableSha !== F0.tableSha)) bad.push('② V の雛形が変わった か中身が同じ');
    cases.push(`② 指紋: K の雛形 ${F0.template.length} → ${FK.template ? FK.template.length : '—'} 鍵(w330cProbeKey)・V の雛形は同じ・全本の中身は違う`);
    const hA = W330(tmp, 'tests/exp-w330cN.mjs', "import { scopeStamp } from './lib-w281a-scope.mjs';\n");
    const declU = Object.assign({}, SELFTEST_DECL_330C, { roots: SELFTEST_DECL_330C.roots.concat(['inPositionK1State']) });
    const tsha = sha256(fs.readFileSync(real));
    const steps = [];
    for (const [k, decl] of [['n', SELFTEST_DECL_330C], ['u', declU]]) {
      const st = SCm.scopeStamp(real, decl);
      if (!st.scopeComplete) { bad.push(k + ' の領域が complete でない'); continue; }
      const out = 'tests/out/w330c-pk-' + k + '.json';
      fs.writeFileSync(path.join(tmp, out), JSON.stringify({ meta: metaOf330({ target: 'beta/index.html', targetSha256: tsha, code: [{ file: 'tests/exp-w330cN.mjs', sha256: hA }], scope: st.scope, scopeSha256: st.scopeSha256 }) }));
      steps.push({ key: 'w330c-pk-' + k, cmd: 'node tests/exp-w330cN.mjs', outs: [out], sec: 1, secSource: 'w330c-selftest' });
    }
    const run = (html, pk) => { const p = RT.planRegen({ root: tmp, steps, html, baseHtml: real, orderOnly: false, htmlPhys: false, scopeMigrate: false, physKeys: pk }); return Object.fromEntries(p.steps.map((z) => [z.key.replace('w330c-pk-', ''), (z.ownStatus) + (z.causeKinds && z.causeKinds.length ? ':' + z.causeKinds.join('+') : '')])); };
    const rK = run(fK, true), rV = run(fV, true), rKoff = run(fK, false), r0 = run(real, true);
    const want = { K: { n: 'regen:physKeys', u: 'regen:physKeys' }, V: { n: 'reuse', u: 'regen:tableRead' }, Koff: { n: 'reuse', u: 'reuse' }, same: { n: 'reuse', u: 'reuse' } };
    const got = { K: rK, V: rV, Koff: rKoff, same: r0 };
    for (const [c, w] of Object.entries(want)) for (const [k, v] of Object.entries(w)) if (got[c][k] !== v) bad.push(`③ ${c} の ${k}: ${got[c][k]}(期待 ${v})`);
    cases.push(`③ 計画: 鍵を足した写し K → n ${rK.n}・u ${rK.u} / 値だけの写し V → n ${rV.n}・u ${rV.u} / K で守りを切る → n ${rKoff.n}(守りが無いと危ない reuse)/ 同じ html → n ${r0.n}・u ${r0.u}`);
  } catch (e) { bad.push('例外: ' + String(e && e.stack || e).slice(0, 200)); }
  finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* 残っても害は無い */ } }
  return { ok: bad.length === 0, bad, cases };
}

export default { PHYSKEYS_GUARD_VERSION_330C, SELFTEST_DECL_330C, toolPlanSelfTest330c, mutateHtml330c, physKeysPlanSelfTest330c, PHYSKEYS_KINDS_330C, htmlKeysOf330c, classifyReads330c, physKeysDecide330c, physKeysGuard330c, physKeysSelfTest330c, lintToolRows330c, toolAgree330c };

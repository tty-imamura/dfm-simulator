#!/usr/bin/env node
// 第303便e(統括の検証項目 R194 —— 第302便の鎖とゲートの教訓 ②)— **鎖の前の器の煙試験**(正本は書かない —— 作業ツリーの写しの中で走らせて捨てる)。
//
// ■ 何をするか
//   基点の html(--base)と今の html の差 —— 変わった最上位の名前(関数・定数)・`window.HP` の口・内蔵プリセットの宣言(生の定義と受理後の定義
//   —— 説明文の欄は除く)・`S._core` —— を引き、再生成表(`tests/lib-w281a-regentable.mjs`)の段のうち**その差を直接読む器**を選ぶ:
//     roots   … 器の領域の宣言 REGEN_SCOPE の roots(宣言の無い器は器のコードから機械で引いた下限 —— `deriveScope`)に、変わった名前・HP の口がある
//     presets … 宣言したプリセットが変わった / all … presets:"all" の器で、どれかのプリセットが変わった / core … S._core が変わった
//     code    … --base-rev から器・lib(正本の meta.code[])が変わった
//     closure … 依存閉包の中だけが変わった(間接 —— --indirect のときだけ走らせる)
//   選んだ段の器を**作業ツリーの写し**(scratch —— .git と node_modules を除いた複製・node_modules は symlink)で並列(--lanes)に走らせ、
//   **受理の例外**(validatePreset の拒否などで器が投げた)・**門の偽**(器が門で rc 1・出力の ok:false・gates の false)・**NaN** だけを報告する。
//   長い器は表 `SMOKE_KNOBS` の窓(QUICK・PART・ONLY・步数の環境変数)を使い、それでも枠(--budget 秒)を越える器は枠で止める
//   (それまでに例外・門の偽・NaN が出なければ「枠で止めた(問題なし)」—— **最初の数段だけを見た**ことを報告に書く)。
//   第302便の型: dragnorm の器が W_bg の本に旧法則 norm:"none" を重ねて受理器が拒否した(鎖の終盤で停止)—— この道具なら統合の直後に例外として出る。
//
// ■ 使い方(統括の手順の 1 行): 統合の直後・鎖の前に
//     node tools/harness-smoke.mjs --base beta/_w30N_base.html --base-rev <基点 sha>   # 例外・門の偽・NaN が 1 つでもあれば rc 1 —— 鎖を起動しない
//   --list(選ぶだけ・走らせない)/ --keys a,b(段を名指し)/ --wide(ハブの名前だけの段も)/ --indirect(閉包だけの段も)/ --lanes 2 / --budget 90 / --max-minutes 30 /
//   --json <file> / --out-dir <dir>(既定 $TMPDIR/harness-smoke-<時刻>)/ --root <dir>(別の木 —— 例: git archive で取り出した過去の状態)/
//   --git-dir <dir>(写しの中の `git -C ROOT show` が読む git —— 既定は --root の git)/ --head-rev <rev>(--base-rev との版どうしの差 —— 取り出した木のとき)/
//   --html <候補 html>(写しの beta/index.html を差し替える)/ --keep(写しを残す)/
//   --self-test(器を走らせない自己試験 —— QA lint.harnessSmoke303 と同じ関数)
//
// ■ 言わないこと
//   ・「煙試験が通ったので鎖が通る」(器の窓は最初の数段だけ —— 値の転記のずれは鎖の後の tools/pregate-transcript.mjs が見る)。
//   ・「選ばれなかった器は壊れない」(閉包だけの差 —— --indirect —— と、宣言の無い器の動的な読みは見ない)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const HARNESS_SMOKE_VERSION = 'w303e-harness-smoke-1';
const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * 器ごとの煙試験の窓(段の key → 環境変数)。器の正本の全段は鎖が回す —— ここは**受理と最初の門**を短く見るための窓だけ。
 * 窓の無い長い器は枠(--budget)で止める(最初の数段)。key は再生成表の段に在ること(自己試験が照合する)。
 */
export const SMOKE_KNOBS = Object.freeze({
  'semic-302d': { env: { W302D_PART: 'gates' }, note: '段 gates だけ(約 55 s —— fit・chain は鎖)' },
  'gloc-302b': { env: { W302B_QUICK: '1' }, note: 'QUICK' },
  'axialsign-302e': { env: { W302E_N: '200', W302E_N3: '60' }, note: '步数 200/60(既定 2000/600)' },
  'synodic-299b': { env: { W299B_PART: 'sun3d' }, note: '段 sun3d だけ(約 30 s)' },
  'refit-298b': { env: { W298B_PART: 'qprobe' }, note: '段 qprobe だけ' },
  'refit-297a': { env: { W297A_PART: 'geotoy' }, note: '段 geotoy だけ' },
  'fit-297b': { env: { W297B_PART: 'mer' }, note: '段 mer だけ(正本を書かない開発用の窓)' },
  'timestd-297c': { env: { W297C_ORBITS: '2', W297C_OBS_STEPS: '60' }, note: '在位の全本・2 公転/60 步' },
  'clone-301f': { env: { W301F_N: '3', W301F_M: '3' }, note: '在位の全本・3 步/3 步' },
  'geo4-295b': { env: { W295B_STEPS: '200' }, note: '200 步' },
  'chain-296c': { env: { W296C_STEPS: '200' }, note: '200 步' },
  'shapetoy': { env: { W274D_SMOKE: '1' }, note: 'SMOKE' },
  'shapecrit': { env: { W275D_SMOKE: '1' }, note: 'SMOKE' },
  'dyncenter': { env: { W275D_SMOKE: '1' }, note: 'SMOKE' },
  'corefield': { env: { W276D_SMOKE: '1' }, note: 'SMOKE' },
  'bgbudget': { env: { W277D_STEPS: '2000' }, note: '2000 步' },
  'bgequiv': { env: { W278D_STEPS: '2000' }, note: '2000 步' },
  'bgbudget2': { env: { W279C_STEPS: '2000' }, note: '2000 步' },
});

/** 煙試験の全段に渡す既定(子プロセスの並列数を 1 に —— 器の注記どおり結果は並列数に依らない・箱を 2 レーンより多く占めない)。 */
export const SMOKE_ENV_DEFAULTS = Object.freeze(Object.fromEntries(['W284A', 'W285A', 'W286A', 'W287A', 'W288A', 'W292C', 'W293D', 'W293E', 'W295C', 'W296B', 'W297B',
  'W298C', 'W299C', 'W300C'].map((k) => [k + '_WORKERS', '1'])));

const argv0 = process.argv.slice(2);
const getArg = (argv, k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1] !== undefined) ? argv[i + 1] : d; };

// ---------------------------------------------------------------------------------------------
// html の事実(最上位の名前の本文・HP の口・プリセットの生と受理後・S._core)と差
// ---------------------------------------------------------------------------------------------
async function libs(root) {
  const SC = await import(pathToFileURL(path.join(root, 'tests', 'lib-w281a-scope.mjs')).href);
  const RT = await import(pathToFileURL(path.join(root, 'tests', 'lib-w281a-regentable.mjs')).href);
  const HL = await import(pathToFileURL(path.join(root, 'tests', 'lib-w279b-headless.mjs')).href);
  return { SC, RT, HL };
}
const scriptOf = (t) => t.slice(t.indexOf('<script>') + 8, t.lastIndexOf('</script>'));

/** html の事実。htmlPath はファイル(headless はファイルを読む)。 */
export async function htmlFacts(L, htmlPath) {
  const { SC, HL } = L;
  const text = fs.readFileSync(htmlPath, 'utf8');
  const parsed = SC.parseTopLevel(scriptOf(text));
  const top = new Map();
  for (const s of parsed.segments) for (const n of s.names) top.set(n, (top.has(n) ? top.get(n) + '\u0000' : '') + s.text);
  const hp = new Map();
  for (const [k, v] of SC.hpProps(parsed).props) hp.set(k, v.exprCode);
  const presetsRaw = new Map(), presetsAcc = new Map();
  let core = null, loadError = null;
  try {
    const H = HL.loadHtmlHeadless(htmlPath);
    for (const p of H.evalExpr('BUILTIN_PRESETS')) {
      presetsRaw.set(p.id, SC.canonJson(SC.stripPresetProse(p, SC.SCOPE_VERSION)));
      let acc;
      try { const v = H.HP.validatePreset(JSON.parse(JSON.stringify(p))); acc = { ok: !!v.ok, preset: v.preset ? SC.stripPresetProse(v.preset, SC.SCOPE_VERSION) : null, errors: v.ok ? undefined : v.errors }; }
      catch (e) { acc = { threw: String(e && e.message || e).slice(0, 200) }; }
      presetsAcc.set(p.id, SC.canonJson(acc));
    }
    try { core = String(H.HP.sim._core); } catch { core = null; }
  } catch (e) { loadError = String(e && e.message || e).slice(0, 200); }
  // 内蔵プリセットの表と文言の表(DATA_REGISTRIES・TEXT_REGISTRIES)は名前の差に数えない —— プリセットは id ごとに見る・文言は説明文
  return { htmlPath, parsed, top, hp, presetsRaw, presetsAcc, core, loadError, selfCheck: parsed.selfCheck.ok,
    registries: SC.DATA_REGISTRIES.concat(SC.TEXT_REGISTRIES) };
}

/** 基点と今の差。names = 本文が変わった(足された・消えた)最上位の名前・hp = 式が変わった HP の口・presets = 生か受理後が変わった id。 */
export function changeSet(base, now) {
  const diffMap = (a, b) => { const out = new Set(); for (const k of new Set([...a.keys(), ...b.keys()])) if (a.get(k) !== b.get(k)) out.add(k); return out; };
  const names = diffMap(base.top, now.top), hp = diffMap(base.hp, now.hp);
  for (const r of (now.registries || [])) names.delete(r);
  const raw = diffMap(base.presetsRaw, now.presetsRaw), acc = diffMap(base.presetsAcc, now.presetsAcc);
  const presets = new Set([...raw, ...acc]);
  return { names, hp, presets, presetsRaw: raw, presetsAccOnly: new Set([...acc].filter((k) => !raw.has(k))),
    core: base.core !== now.core, empty: !names.size && !hp.size && !presets.size && base.core === now.core };
}
const IDENT = /[A-Za-z_$][\w$]*/g;
/** HP の口 `HP.x` が変わったか(口の式そのもの、または式が名指す最上位の名前の本文)。 */
function hpRootChanged(x, cs, now) {
  if (cs.hp.has(x)) return true;
  const e = now.hp.get(x);
  if (e === undefined) return false;
  for (const m of String(e).match(IDENT) || []) if (cs.names.has(m)) return true;
  return false;
}

// ---------------------------------------------------------------------------------------------
// 段の選択
// ---------------------------------------------------------------------------------------------
// 優先: 1 = 変わった名前を roots に名指す(多くの器が共有する「ハブ」の名前 —— validatePreset など —— は除く)・S._core・器/lib のコード /
//       2 = 宣言したプリセットが変わった・all の器でプリセットが変わった / 3 = ハブの名前だけ / 4 = 閉包だけ(--indirect)。既定で走らせるのは 1・2(--wide で 3 も)
const PRIO = { roots: 1, core: 1, code: 1, presets: 2, all: 2, hub: 3, closure: 4 };
/** ハブの名前: 選べる器の宣言(下限)の 40% 以上(かつ 10 器以上)が roots に持つ名前(差の有無に依らない —— 表と宣言から機械で数える)。 */
export const HUB_SHARE = 0.4;
/** 段の cmd から器(tests/exp-*.mjs)を取る。鎖の脚本でしか回せない段・html を書く段は煙試験の外。 */
function harnessOf(st) {
  if (st.role === 'history') return { skip: '履歴' };
  if (st.alwaysRun) return { skip: '常時群(鎖の先頭で必ず走る)' };
  if ((st.htmlRegions || []).length && st.htmlWriteMode !== 'check') return { skip: 'html の生成領域を書く段' };
  const m = /^(?:[A-Z0-9_]+=\S+\s+)*node (tests\/exp-[\w.-]+\.mjs)(?:\s|$)/.exec(st.cmd);
  if (!m || /[(（]/.test(st.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, ''))) return { skip: '鎖の脚本の段(cmd が器 1 本でない)' };
  return { harness: m[1] };
}
/**
 * 段を分類する。o = { root, now(htmlFacts), cs(changeSet), codeChanged:Set|null, indirect:boolean, L }。
 * 戻り値 { key, harness, sec, declKind, hits:{roots,presets,all,core,code,closure}, prio(0 = 選ばない), skip }。
 */
export function classifySteps(o) {
  const { SC, RT } = o.L;
  const rows = [];
  for (const st of RT.REGEN_STEPS) {
    const h = harnessOf(st);
    const row = { key: st.key, cmd: st.cmd, sec: st.sec, outs: st.outs || [], harness: h.harness || null, skip: h.skip || null, declKind: null,
      hits: { roots: [], hub: [], presets: [], all: false, core: false, code: [], closure: [] }, prio: 0, roots: [] };
    rows.push(row);
    if (h.skip) continue;
    let text = '';
    try { text = fs.readFileSync(path.join(o.root, h.harness), 'utf8'); } catch { row.skip = '器が無い'; continue; }
    let decl = SC.readDeclaredScope(text);
    let metaCode = [];
    for (const out of st.outs || []) { try { const J = JSON.parse(fs.readFileSync(path.join(o.root, out), 'utf8')); for (const c of ((J.meta && J.meta.code) || [])) metaCode.push(c.file); } catch { /* 正本なし */ } }
    metaCode = [...new Set(metaCode)];
    if (decl) row.declKind = 'declared';
    else {
      try { decl = SC.deriveScope(o.now.htmlPath, SC.codeFilesOf(o.root, h.harness, metaCode)); row.declKind = 'derived'; }
      catch (e) { decl = { presets: 'all', roots: [], core: true }; row.declKind = 'none'; }
    }
    const sc = SC.normalizeScope(decl);
    row.roots = sc.roots.slice();
    for (const r of sc.roots) {
      const mm = /^HP\.(.+)$/.exec(r);
      if (mm ? hpRootChanged(mm[1], o.cs, o.now) : o.cs.names.has(r)) row.hits.roots.push(r);
    }
    if (sc.presets === 'all') row.hits.all = o.cs.presets.size > 0;
    else row.hits.presets = sc.presets.filter((id) => o.cs.presets.has(id));
    row.hits.core = (decl.core !== false) && o.cs.core;
    if (o.codeChanged) row.hits.code = [...new Set([h.harness].concat(metaCode))].filter((f) => o.codeChanged.has(f));
    if (o.indirect && !row.hits.roots.length && !row.hits.presets.length && !row.hits.all && !row.hits.core && !row.hits.code.length) {
      try {
        const cl = SC.closureOf(o.now.parsed, sc.roots, undefined, { hardStop: SC.SCOPE_STOP });
        row.hits.closure = cl.functions.filter((n) => o.cs.names.has(n)).concat(cl.hp.map((z) => z.name).filter((n) => o.cs.hp.has(n)).map((n) => 'HP.' + n));
      } catch { /* 閉包が引けない —— 間接は数えない */ }
    }
  }
  // ハブの名前(表と宣言から機械で数える)を roots の当たりから分ける
  const live = rows.filter((r) => !r.skip);
  // `HP.x` と `x` は同じ名前として数える(器は両方の形で名指す)
  const bare = (n) => String(n).replace(/^HP\./, '');
  const freq = new Map();
  for (const r of live) for (const n of new Set(r.roots.map(bare))) freq.set(n, (freq.get(n) || 0) + 1);
  const hubs = new Set([...freq].filter(([, c]) => c >= Math.max(10, HUB_SHARE * live.length)).map(([n]) => n));
  for (const row of live) {
    row.hits.hub = row.hits.roots.filter((n) => hubs.has(bare(n)));
    row.hits.roots = row.hits.roots.filter((n) => !hubs.has(bare(n)));
    if (row.hits.hub.length || row.hits.roots.length || row.hits.presets.length || row.hits.all || row.hits.core || row.hits.code.length) row.hits.closure = [];
    const p = [];
    if (row.hits.roots.length) p.push(PRIO.roots);
    if (row.hits.core) p.push(PRIO.core);
    if (row.hits.code.length) p.push(PRIO.code);
    if (row.hits.presets.length) p.push(PRIO.presets);
    if (row.hits.all) p.push(PRIO.all);
    if (row.hits.hub.length) p.push(PRIO.hub);
    if (row.hits.closure.length) p.push(PRIO.closure);
    row.prio = p.length ? Math.min(...p) : 0;
  }
  rows.hubs = [...hubs].sort();
  return rows;
}

// ---------------------------------------------------------------------------------------------
// 走行と判定
// ---------------------------------------------------------------------------------------------
const NAN_LINE = /(^|[^A-Za-z])NaN([^A-Za-z]|$)/;
const NAN_OK = /NaN\s*(?:なし|無し|が無い|は無い|0\s*(?:件|本|個|回)?(?:[^\d.]|$))|no NaN|NaN(?:の数|件数)\s*0|["']?nan["']?\s*:\s*(?:false|0)\b|hasNaN\s*:\s*false|anyNaN\s*:\s*false/i;
const GATE_LINE = /(?:\bgates?\b[^\n]*:\s*false\b)|(?:\bok\s+false\b)|(?:門[^\n]{0,80}(?:\bfalse\b|偽))/;
const EXC_LINE = /\b(?:Error|TypeError|RangeError|ReferenceError|SyntaxError|AssertionError)\b[:\s]|Uncaught|UnhandledPromiseRejection/;
/** 出力の文字列から判定する(純関数 —— 自己試験が缶詰の出力で照合する)。 */
export function judgeOutput(o) {
  const out = String(o.stdout || ''), err = String(o.stderr || '');
  const lines = (out + '\n' + err).split('\n');
  const nanLines = lines.filter((l) => NAN_LINE.test(l) && !NAN_OK.test(l));
  const gateLines = lines.filter((l) => GATE_LINE.test(l));
  const excLine = err.split('\n').find((l) => EXC_LINE.test(l)) || (o.rc !== 0 && !o.killed ? err.split('\n').find((l) => /\bat\s.+:\d+:\d+/.test(l)) : null) || null;
  let verdict = 'ok';
  const why = [];
  if (!o.killed && o.rc !== 0 && o.rc !== null) {
    if (excLine) { verdict = 'exception'; why.push(excLine.trim().slice(0, 240)); }
    else { verdict = 'gate'; why.push('rc ' + o.rc + (gateLines[0] ? ' —— ' + gateLines[0].trim().slice(0, 200) : '(器が門で終わった)')); }
  } else if (excLine && /Uncaught|UnhandledPromiseRejection/.test(excLine)) { verdict = 'exception'; why.push(excLine.trim().slice(0, 240)); }
  if (verdict === 'ok' && o.outOk === false) { verdict = 'gate'; why.push('正本の写しの ok:false'); }
  if (verdict === 'ok' && gateLines.length) { verdict = 'gate'; why.push(gateLines[0].trim().slice(0, 200)); }
  if (verdict === 'ok' && nanLines.length) { verdict = 'nan'; why.push(nanLines[0].trim().slice(0, 200)); }
  return { verdict, why, nanLines: nanLines.length, gateLines: gateLines.length };
}

/** 作業ツリーの写し(.git・node_modules を除く —— node_modules は symlink)。 */
export function makeSandbox(root, dir, htmlOverride) {
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('bash', ['-c', 'tar -C "$1" --exclude=./.git --exclude=./node_modules -cf - . | tar -C "$2" -xf -', '_', root, dir], { stdio: 'pipe' });
  const nm = path.join(root, 'node_modules');
  if (fs.existsSync(nm)) { try { fs.symlinkSync(fs.realpathSync(nm), path.join(dir, 'node_modules')); } catch { /* 既にある */ } }
  if (htmlOverride) fs.copyFileSync(htmlOverride, path.join(dir, 'beta', 'index.html'));
  return dir;
}

function runOne(row, o) {
  return new Promise((resolve) => {
    const knob = SMOKE_KNOBS[row.key] || null;
    const full = !(knob) && Number(row.sec) <= o.budget;
    const env = Object.assign({}, process.env, SMOKE_ENV_DEFAULTS, { TMPDIR: o.tmpDir, GIT_OPTIONAL_LOCKS: '0', QA_TARGET: 'beta/index.html' }, o.gitDir ? { GIT_DIR: o.gitDir } : {},
      knob ? knob.env : {}, o.baseHtml ? { BASE_HTML: o.baseHtml } : {});
    if (!env.PLAYWRIGHT_CORE_DIR && fs.existsSync('/opt/node22/lib/node_modules/playwright')) env.PLAYWRIGHT_CORE_DIR = '/opt/node22/lib/node_modules/playwright';
    const cmd = row.cmd.split(' && ')[0].replace(/\$BASE_HTML/g, '"$BASE_HTML"');
    const t0 = Date.now();
    const ch = spawn('bash', ['-c', cmd], { cwd: o.sandbox, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', killed = false;
    const cap = (s, x) => (s.length > 400000 ? s : s + x);
    ch.stdout.on('data', (d) => { stdout = cap(stdout, d.toString()); });
    ch.stderr.on('data', (d) => { stderr = cap(stderr, d.toString()); });
    const kill = () => { killed = true; try { process.kill(-ch.pid, 'SIGTERM'); } catch { /* 終わっている */ }
      setTimeout(() => { try { process.kill(-ch.pid, 'SIGKILL'); } catch { /* 終わっている */ } }, 3000).unref(); };
    const limit = full ? Math.max(o.budget, Number(row.sec) * 1.5 + 30) : o.budget;
    const tm = setTimeout(kill, limit * 1000);
    ch.on('close', (rc) => {
      clearTimeout(tm);
      const sec = (Date.now() - t0) / 1000;
      fs.writeFileSync(path.join(o.logDir, row.key + '.out'), stdout);
      fs.writeFileSync(path.join(o.logDir, row.key + '.err'), stderr);
      let outOk = null;
      if (!killed && rc === 0) for (const f of row.outs || []) {
        try { const J = JSON.parse(fs.readFileSync(path.join(o.sandbox, f), 'utf8')); if (J && J.ok === false) outOk = false; } catch { /* 書かない窓 */ }
      }
      const j = judgeOutput({ stdout, stderr, rc: killed ? null : rc, killed, outOk });
      resolve({ key: row.key, harness: row.harness, prio: row.prio, mode: knob ? 'knob' : (full ? 'full' : 'cap'), knob: knob ? knob.note : null,
        rc: killed ? null : rc, killed, sec: +sec.toFixed(1), limitSec: Math.round(limit), verdict: j.verdict, why: j.why });
    });
  });
}

async function runPool(rows, o, log) {
  const res = [];
  const queue = rows.slice();
  const t0 = Date.now();
  const lane = async () => {
    while (queue.length) {
      if ((Date.now() - t0) / 60000 > o.maxMinutes) { const r = queue.shift(); res.push({ key: r.key, harness: r.harness, prio: r.prio, verdict: 'not-run', why: ['時間の枠(--max-minutes ' + o.maxMinutes + ')の外'] }); continue; }
      const r = queue.shift();
      const x = await runOne(r, o);
      res.push(x);
      log(fmtRow(x));
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, o.lanes) }, lane));
  return res;
}
const TAG = { ok: 'ok  ', exception: 'NG  ', gate: 'NG  ', nan: 'NG  ', 'not-run': '--  ' };
const VJA = { exception: '例外', gate: '門の偽', nan: 'NaN', ok: '', 'not-run': '未実行' };
function fmtRow(x) {
  const how = x.verdict === 'ok' ? (x.killed ? `枠 ${x.limitSec} s で止めた(それまで問題なし)` : '完走') : VJA[x.verdict];
  return `  ${TAG[x.verdict]}${String(x.key).padEnd(20)} ${how}${x.why && x.why.length && x.verdict !== 'ok' ? '  ' + x.why[0] : ''}`
    + (x.sec !== undefined ? `  (${x.sec} s・${x.mode}${x.knob ? ' ' + x.knob : ''})` : '');
}

// ---------------------------------------------------------------------------------------------
// 自己試験(器を走らせない —— QA lint.harnessSmoke303)
// ---------------------------------------------------------------------------------------------
export async function selfTest(opt) {
  const root = (opt && opt.root) || TOOL_ROOT;
  const L = await libs(root);
  const bad = [], cases = [];
  // ① 窓の表の key は再生成表の段に在る・履歴でない
  const keys = new Set(L.RT.REGEN_STEPS.filter((z) => z.role !== 'history').map((z) => z.key));
  const stale = Object.keys(SMOKE_KNOBS).filter((k) => !keys.has(k));
  if (stale.length) bad.push('① 窓の表に表に無い段: ' + stale.join(','));
  cases.push(`① 窓の表 ${Object.keys(SMOKE_KNOBS).length} 段は再生成表に在る(古い key ${stale.length})`);
  // ② 同じ html の差は空
  const html = path.join(root, 'beta', 'index.html');
  const now = await htmlFacts(L, html);
  if (now.loadError || !now.selfCheck) bad.push('② html の事実が引けない: ' + now.loadError);
  const cs0 = changeSet(now, now);
  if (!cs0.empty) bad.push('② 同じ html で差が空でない');
  cases.push(`② 同じ html の差は空 ${cs0.empty}(最上位の名前 ${now.top.size}・HP の口 ${now.hp.size}・内蔵プリセット ${now.presetsRaw.size})`);
  // ③ 関数の本文に 1 文(既定 relDragStepOrderOf —— 段 dragnorm-301a の宣言の roots から選ぶ。段が無ければ宣言のある最初の段)→ 差はその名前だけ・
  //    roots にその口を持つ器(その段を含む)が roots で選ばれる・持たない器は選ばれない
  const tmp = fs.mkdtempSync(path.join((opt && opt.tmpDir) || os.tmpdir(), 'w303e-smoke-'));
  try {
    const text = fs.readFileSync(html, 'utf8');
    const live = L.RT.REGEN_STEPS.filter((z) => z.role !== 'history' && !z.alwaysRun && /^node tests\/exp-/.test(z.cmd));
    const declOf = (st) => { try { return L.SC.readDeclaredScope(fs.readFileSync(path.join(root, /node (tests\/exp-[\w.-]+\.mjs)/.exec(st.cmd)[1]), 'utf8')); } catch { return null; } };
    const probe = live.find((z) => z.key === 'dragnorm-301a' && declOf(z)) || live.find((z) => declOf(z));
    const cand = probe ? declOf(probe).roots.map((r) => r.replace(/^HP\./, '')) : [];
    const fn = ['relDragStepOrderOf'].concat(cand).find((n) => cand.includes(n) && L.SC.touchFunction(text, n).ok) || 'relDragStepOrderOf';
    const t1 = L.SC.touchFunction(text, fn);
    if (!t1.ok) bad.push('③ ' + fn + ' に 1 文を差し込めない');
    const f1 = path.join(tmp, 'touch.html'); fs.writeFileSync(f1, t1.html);
    const a = await htmlFacts(L, f1);
    const cs1 = changeSet(now, a);
    const names1 = [...cs1.names].sort().join(',');
    if (names1 !== fn || cs1.presets.size || cs1.core) bad.push(`③ 差が ${fn} だけでない: 名前 ${names1}・プリセット ${cs1.presets.size}・core ${cs1.core}`);
    const rows1 = classifySteps({ root, now: a, cs: cs1, codeChanged: null, indirect: false, L });
    const hit1 = rows1.filter((r) => r.prio > 0);
    const dn = probe ? rows1.find((r) => r.key === probe.key) : null;
    if (!dn || dn.prio !== 1 || !(dn.hits.roots.includes('HP.' + fn) || dn.hits.roots.includes(fn))) bad.push(`③ ${probe ? probe.key : '(段なし)'} が roots で選ばれない`);
    const notRoot = hit1.filter((r) => !r.hits.roots.length && !r.hits.hub.length);
    if (notRoot.length) bad.push('③ roots に無い器が選ばれた: ' + notRoot.map((r) => r.key).slice(0, 4).join(','));
    cases.push(`③ ${fn} の本文に 1 文 → 差は名前 1(${names1})・選ぶ段 ${hit1.length}(すべて roots —— ${probe ? probe.key : '—'} を含む)`);
    // ④ ❄️ の質量の最下位桁 → 差はプリセット plutoCharonReal だけ・選ぶ段は ❄️ を宣言した器と all の器だけ
    const pr = L.SC.probeHtmls(text).mass;
    if (!pr.ok) bad.push('④ ❄️ の質量を変えた一時 html が作れない');
    const f2 = path.join(tmp, 'mass.html'); fs.writeFileSync(f2, pr.html);
    const b = await htmlFacts(L, f2);
    const cs2 = changeSet(now, b);
    if ([...cs2.presets].join(',') !== 'plutoCharonReal' || cs2.names.size || cs2.hp.size) bad.push('④ 差が ❄️ だけでない: ' + [...cs2.presets].join(',') + ' 名前 ' + cs2.names.size);
    const rows2 = classifySteps({ root, now: b, cs: cs2, codeChanged: null, indirect: false, L });
    const hit2 = rows2.filter((r) => r.prio > 0);
    const odd = hit2.filter((r) => !(r.hits.presets.includes('plutoCharonReal') || r.hits.all));
    if (odd.length) bad.push('④ ❄️ も all も宣言しない器が選ばれた: ' + odd.map((r) => r.key).slice(0, 4).join(','));
    if (!hit2.some((r) => r.hits.presets.includes('plutoCharonReal'))) bad.push('④ ❄️ を宣言した器が選ばれない');
    cases.push(`④ ❄️ の質量の最下位桁 → 差はプリセット 1・選ぶ段 ${hit2.length}(❄️ を宣言 ${hit2.filter((r) => r.hits.presets.length).length}・all ${hit2.filter((r) => r.hits.all && !r.hits.presets.length).length})`);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  // ⑤ 判定(缶詰の出力)
  const J = [
    [{ stdout: '① {"zero":true}', stderr: 'Error: validatePreset: [{"path":"relativeDrag.norm"}]\n    at build (file:///x/tests/exp-w301a-dragnorm.mjs:43:73)', rc: 1, killed: false }, 'exception'],
    [{ stdout: 'gates {"a":true,"b":false}\n→ ok false', stderr: '', rc: 1, killed: false }, 'gate'],
    [{ stdout: '64 步 NaN なし・NaN 0 件', stderr: '', rc: 0, killed: false }, 'ok'],
    [{ stdout: 'aps NaN ″/世紀', stderr: '', rc: null, killed: true }, 'nan'],
    [{ stdout: '① {"zero":true}\n② 進行中', stderr: '', rc: null, killed: true }, 'ok'],
    [{ stdout: '', stderr: '', rc: 0, killed: false, outOk: false }, 'gate'],
  ];
  const got = J.map(([o]) => judgeOutput(o).verdict);
  const miss = J.map(([, w], i) => (got[i] === w ? null : i + ':' + got[i] + '≠' + w)).filter(Boolean);
  if (miss.length) bad.push('⑤ 判定が缶詰と違う: ' + miss.join(','));
  cases.push(`⑤ 判定の缶詰 ${J.length} 件(例外・門の偽・NaN なし・NaN・枠で止めた・ok:false)が一致 ${J.length - miss.length}/${J.length}`);
  return { version: HARNESS_SMOKE_VERSION, ok: bad.length === 0, bad, cases };
}

// ---------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------
async function main(argv) {
  const root = path.resolve(getArg(argv, '--root', TOOL_ROOT));
  const rel = (p) => (p ? (path.isAbsolute(p) ? p : path.join(root, p)) : null);
  if (argv.includes('--self-test')) {
    const r = await selfTest({ root });
    for (const c of r.cases) console.log('  ' + c);
    console.log(`harness-smoke --self-test: ${r.ok ? 'OK' : 'NG —— ' + r.bad.join(' / ')}`);
    process.exit(r.ok ? 0 : 1);
  }
  const T0 = Date.now();
  const baseHtml = rel(getArg(argv, '--base', null));
  const htmlOverride = rel(getArg(argv, '--html', null));
  const baseRev = getArg(argv, '--base-rev', null);
  const lanes = Number(getArg(argv, '--lanes', 2));
  const budget = Number(getArg(argv, '--budget', 90));
  const maxMinutes = Number(getArg(argv, '--max-minutes', 30));
  const keysArg = getArg(argv, '--keys', null);
  const indirect = argv.includes('--indirect');
  const wide = argv.includes('--wide') || indirect;
  const listOnly = argv.includes('--list');
  if (!baseHtml && !keysArg) { console.error('harness-smoke: --base <基点 html>(か --keys)が要る'); process.exit(2); }
  const outDir = path.resolve(getArg(argv, '--out-dir', path.join(os.tmpdir(), 'harness-smoke-' + new Date().toISOString().replace(/[:.]/g, '').slice(0, 15))));
  const L = await libs(root);
  const nowHtml = htmlOverride || path.join(root, 'beta', 'index.html');
  const now = await htmlFacts(L, nowHtml);
  let cs = { names: new Set(), hp: new Set(), presets: new Set(), presetsAccOnly: new Set(), core: false, empty: true };
  if (baseHtml) cs = changeSet(await htmlFacts(L, baseHtml), now);
  let codeChanged = null;
  const headRev = getArg(argv, '--head-rev', null);
  const gitDirArg = getArg(argv, '--git-dir', null);
  if (baseRev) {
    // 作業ツリーとの差(既定 —— 未コミットの変更も入る)か、--head-rev との版どうしの差(git archive で取り出した木を --root にするとき)
    const args = headRev ? (gitDirArg ? ['--git-dir', gitDirArg] : ['-C', root]).concat(['diff', '--name-only', baseRev, headRev, '--', 'tests'])
      : ['-C', root, 'diff', '--name-only', baseRev, '--', 'tests'];
    try { codeChanged = new Set(execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean)); }
    catch (e) { console.error('harness-smoke: --base-rev の差が引けない: ' + String(e.message || e).slice(0, 120)); }
  }
  const rows = classifySteps({ root, now, cs, codeChanged, indirect, L });
  let sel;
  if (keysArg) { const want = keysArg.split(','); sel = rows.filter((r) => want.includes(r.key) && r.harness); for (const r of sel) if (!r.prio) r.prio = 1; }
  else sel = rows.filter((r) => r.prio > 0 && (r.prio <= PRIO.all || (r.prio === PRIO.hub && wide) || (r.prio === PRIO.closure && indirect)));
  sel.sort((a, b) => a.prio - b.prio || (Number(a.sec) || 0) - (Number(b.sec) || 0));
  const cnt = (f) => sel.filter(f).length;
  console.log(`harness-smoke: ${baseHtml ? path.relative(root, baseHtml) : '(基点なし)'} → ${path.relative(root, nowHtml)}`
    + `(差: 名前 ${cs.names.size}・HP の口 ${cs.hp.size}・プリセット ${cs.presets.size}〔受理後だけ ${cs.presetsAccOnly.size}〕・S._core ${cs.core ? '変わった' : '同じ'}`
    + (codeChanged ? `・器/lib ${[...codeChanged].filter((f) => /^tests\/(exp|lib)-/.test(f)).length}` : '') + ')');
  if (cs.names.size) console.log('  変わった名前: ' + [...cs.names].slice(0, 12).join(', ') + (cs.names.size > 12 ? ` 他 ${cs.names.size - 12}` : ''));
  if (cs.presets.size) console.log('  変わったプリセット: ' + [...cs.presets].slice(0, 12).join(', ') + (cs.presets.size > 12 ? ` 他 ${cs.presets.size - 12}` : ''));
  const nHub = rows.filter((r) => r.prio === PRIO.hub).length, nIndirect = rows.filter((r) => r.prio === PRIO.closure).length;
  console.log(`  ハブの名前(宣言の ${HUB_SHARE * 100}% 以上が持つ): ${(rows.hubs || []).join(', ') || 'なし'}`);
  console.log(`  選ぶ段 ${sel.length}(名前/core/コード ${cnt((r) => r.prio === 1)}・プリセット/all ${cnt((r) => r.prio === 2)}`
    + (wide ? `・ハブだけ ${cnt((r) => r.prio === 3)}` : ` / ハブだけ ${nHub} は --wide で`)
    + (indirect ? `・閉包だけ ${cnt((r) => r.prio === 4)}` : ` / 閉包だけ ${indirect ? '' : '(--indirect で数える)'}`) + `)・外した段 ${rows.filter((r) => r.skip).length}(履歴・常時群・html を書く段・鎖の脚本の段)`);
  const plan = { version: HARNESS_SMOKE_VERSION, root, base: baseHtml, html: nowHtml, baseRev, change: { names: [...cs.names], hp: [...cs.hp], presets: [...cs.presets], core: cs.core },
    selected: sel.map((r) => ({ key: r.key, harness: r.harness, prio: r.prio, sec: r.sec, declKind: r.declKind, hits: r.hits, knob: SMOKE_KNOBS[r.key] ? SMOKE_KNOBS[r.key].note : null })) };
  if (listOnly) {
    for (const r of sel) console.log(`  ${String(r.prio)} ${r.key.padEnd(20)} ${String(r.sec).padStart(6)} s ${r.declKind}  ${[r.hits.roots.slice(0, 3).join(' '), r.hits.presets.slice(0, 3).join(' '), r.hits.all ? 'all' : '', r.hits.core ? 'core' : '', r.hits.code.slice(0, 2).join(' '), r.hits.hub.length ? 'ハブ ' + r.hits.hub.slice(0, 2).join(' ') : '', r.hits.closure.slice(0, 2).join(' ')].filter(Boolean).join(' / ')}`);
    const js = getArg(argv, '--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(plan, null, 1));
    process.exit(0);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const logDir = path.join(outDir, 'logs'), tmpDir = path.join(outDir, 'tmp');
  fs.mkdirSync(logDir, { recursive: true }); fs.mkdirSync(tmpDir, { recursive: true });
  const sandbox = makeSandbox(root, path.join(outDir, 'root'), htmlOverride);
  let gitDir = gitDirArg;
  if (!gitDir) { try { gitDir = execFileSync('git', ['-C', root, 'rev-parse', '--absolute-git-dir'], { encoding: 'utf8' }).trim(); } catch { gitDir = null; } }
  console.log(`  写し ${sandbox}(git ${gitDir || 'なし'})・レーン ${lanes}・枠 ${budget} s・全体の枠 ${maxMinutes} min`);
  const res = await runPool(sel, { sandbox, logDir, tmpDir, gitDir, lanes, budget, maxMinutes, baseHtml }, console.log);
  const n = (v) => res.filter((x) => x.verdict === v).length;
  const ng = n('exception') + n('gate') + n('nan');
  const summary = `harness-smoke: 走らせた ${res.length - n('not-run')}/${sel.length} 段・例外 ${n('exception')}・門の偽 ${n('gate')}・NaN ${n('nan')}・`
    + `枠で止めた(問題なし)${res.filter((x) => x.verdict === 'ok' && x.killed).length}・完走 ${res.filter((x) => x.verdict === 'ok' && !x.killed).length}・未実行 ${n('not-run')} —— `
    + `${ng ? 'NG' : 'OK'}(所要 ${((Date.now() - T0) / 60000).toFixed(1)} min・ログ ${logDir})`;
  console.log(summary);
  Object.assign(plan, { results: res, summary, ok: ng === 0, elapsedMin: +((Date.now() - T0) / 60000).toFixed(2) });
  fs.writeFileSync(path.join(outDir, 'smoke.json'), JSON.stringify(plan, null, 1));
  const js = getArg(argv, '--json', null); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(plan, null, 1));
  if (!argv.includes('--keep')) fs.rmSync(sandbox, { recursive: true, force: true });
  process.exit(ng ? 1 : 0);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main(argv0);

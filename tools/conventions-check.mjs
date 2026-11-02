#!/usr/bin/env node
// 第323便a(統括の検証項目 R275 —— 原仮定者の指示(2026-11-01)「今後は、すぐに確認可能な規約を先に判定する」)— **規約の速い判定**。
//   第322便は ♊⚖️ の c₀ = 10(c₀ = 30 一律の規約の外)を、7 時間の鎖の後のゲートで初めて見つけた(その QA light.canonical-builtins は
//   qa.mjs の列 0 の `if (!FAST) {` の中にあり、部分 QA で走らなかった)。統合の直後・鎖の起動の前に、html を Node で読んで数秒で判定する。
//
// ■ 何を判定するか(対象の html ごと —— 既定 beta/index.html)
//   ① c₀ の規約: 全内蔵が physics.cLight = 30 か、自分の scaleExp(無ければ段のアンカー SCALE_ANCHORS)の指数で実 c(3×10⁸ m/s)の ±1%
//      (QA `light.canonical-builtins` と**同じ式** —— 7 分類の世代だけ。既定値のマージ〔physics を省いた本〕も c₀ = 30)。
//   ② 段の分類: 全内蔵の scaleTier が SCALE_TIERS のどれかで、全段が空でない(QA `preset.scale-tier` と同じ式)。
//   ③ 全内蔵の受理: HP.validatePreset で拒否 0(警告のある本の数は情報)。
//   ④ 従属の宣言 X_k = G_0/c_0²(鍵 kappaT): html の判定関数 physLockAutoOnOf で満たす本・満たさない本の数と理由の内訳を**情報**として出す
//      (規約ではない —— 満たさない本は一般化トイの設定として正当。FAIL にしない)。
//   ⑤ `--samplestatus`(beta だけ): samplestatus の器(tests/exp-w279a-samplestatus.mjs)を `REGEN_HTML_STAGE` を一時の置き場にして走らせ
//      (html を直に書かない)、html の生成領域 sample-status が冪等か(器の印字 htmlChanged:false)を確かめる。器が書く正本
//      tests/out/samplestatus-w279a.json と一覧 docs/SAMPLE_STATUS.md は**走る前の bytes に戻す**(作業ツリーを汚さない —— 前後の git status も照らす)。
//
// ■ 式の共有(片方だけ直る型を防ぐ)
//   qa.mjs の既存のブロックは変えないので、式は道具の側に写した(`cRuleBad`・`tierOf`)。走るたびに qa.mjs の該当ブロックから式の本文を引き
//   (`qaFormulaOf`)、**文字(コメントと空白を除く)と値(全内蔵 + 合成の変異の本)の両方**で道具の式と照らす —— 食い違えば終了コード 2(道具を直す)。
//   QA `lint.conventionsCheck323` も同じ照合を自己試験で見る。
//
// ■ 使い方
//   node tools/conventions-check.mjs                                  # beta/index.html(数秒)
//   node tools/conventions-check.mjs --target beta/index.html --target index.html
//   node tools/conventions-check.mjs --samplestatus                   # 鎖の起動の前(統括の 1 行 —— PLAYWRIGHT_CORE_DIR が要る)
//   --json <file>(結果)/ --self-test(式の照合・変異の検出の缶詰)/ --target <html>(繰り返し可 —— リポジトリの相対パスか絶対パス)
// 終了コード: 0 = 通る / 1 = 規約の外(①②③)か samplestatus が冪等でない・器が落ちた・木が汚れた / 2 = 使い方の誤り・html が読めない・qa.mjs の式が引けないか食い違う
//
// ■ 言わないこと
//   「規約の判定が通ればゲートが通る」(規約の判定は数秒で見られる規約だけ —— ゲートのフル QA の代わりではない)。
//   「X_k = G_0/c_0² を満たさない本は誤り」(④は情報 —— 一般化トイの設定)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const CONVENTIONS_VERSION = 'w323a-conventions-1';
const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SAMPLESTATUS_HARNESS = 'tests/exp-w279a-samplestatus.mjs';
export const SAMPLESTATUS_WRITES = ['tests/out/samplestatus-w279a.json', 'docs/SAMPLE_STATUS.md'];

// ---- 式(qa.mjs の light.canonical-builtins・preset.scale-tier の写し —— qaFormulaOf が毎回照らす)----
/** ① c₀ の規約の外か(true = 外)。qa.mjs light.canonical-builtins の `res.badC = builtins.filter(p => { … })` の本文と同じ */
export function cRuleBad(p, HP) {
  const c = (p.physics || {}).cLight;
  if (c === 30) return false;
  const a = (p.scaleExp && typeof p.scaleExp.L === 'number' && typeof p.scaleExp.T === 'number')
    ? { expL: p.scaleExp.L, expT: p.scaleExp.T }
    : (HP.SCALE_ANCHORS && HP.SCALE_ANCHORS[p.scaleTier]);
  if (a && typeof c === 'number' && c > 0
      && Math.abs(c * Math.pow(10, a.expL - a.expT) / 3e8 - 1) < 0.01) return false;
  return true;
}
/** ② 段の分類。qa.mjs preset.scale-tier の res.missing・res.counts・res.allTiers・res.tierN と同じ */
export function tierOf(builtins, HP) {
  const res = {};
  res.missing = builtins.filter(p => HP.SCALE_TIERS.indexOf(p.scaleTier) < 0).map(p => p.id);
  res.counts = {};
  builtins.forEach(p => { res.counts[p.scaleTier] = (res.counts[p.scaleTier] || 0) + 1; });
  res.allTiers = HP.SCALE_TIERS.every(t => (res.counts[t] || 0) > 0);
  res.total = builtins.length;
  res.tierN = HP.SCALE_TIERS.length;
  return res;
}
/** ① の既定値のマージ(physics を省いた本の cLight)。qa.mjs light.canonical-builtins の defC と同じ本 */
export function defaultCOf(HP) {
  const v = HP.validatePreset({ name: 'qa_defc', description: 'd', camera: { scale: 100 },
    world: { boundary: 'none', size: 0 }, physics: {},
    bodies: [{ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }] });
  return v.ok ? v.preset.physics.cLight : NaN;
}

// ---- qa.mjs の式を引く(文字の照合と値の照合)----
/** コメントと空白を除いた文字(式の文字の照合用 —— 文字列の中のコメントの印は qa.mjs の式に無い) */
export const normJs = (t) => String(t).replace(/\/\/[^\n]*/g, '').replace(/\s+/g, '');
/**
 * qa.mjs の該当ブロックから式の本文を引く。
 * @returns {{ok:boolean, why?:string, cBody?:string, missingExpr?:string, allTiersExpr?:string, defcArg?:string, guard7?:boolean}}
 */
export function qaFormulaOf(qaSrc) {
  const iC = qaSrc.indexOf("add('light.canonical-builtins'"), iT = qaSrc.indexOf("add('preset.scale-tier'");
  if (iC < 0 || iT < 0) return { ok: false, why: 'qa.mjs に light.canonical-builtins か preset.scale-tier が無い' };
  const head = 'res.badC = builtins.filter(p => {', tail = '}).map(p => p.id);';
  const a = qaSrc.lastIndexOf(head, iT), b = a < 0 ? -1 : qaSrc.indexOf(tail, a);
  if (a < 0 || b < 0 || b > iT) return { ok: false, why: 'qa.mjs の res.badC の式が引けない(ブロックの形が変わった —— 道具を直す)' };
  const mM = /res\.missing = (builtins\.filter\([^\n]*\)\.map\(p => p\.id\));/.exec(qaSrc.slice(a - 4000, a));
  const mA = /res\.allTiers = ([^\n;]*);/.exec(qaSrc.slice(a - 4000, a));
  const mD = /HP\.validatePreset\((\{ name: 'qa_defc'[\s\S]*?\}\] \})\);/.exec(qaSrc.slice(iT, iC));
  if (!mM || !mA || !mD) return { ok: false, why: 'qa.mjs の res.missing・res.allTiers・既定値のマージの式が引けない' };
  const guard7 = /if \(r\.tierN >= 7\) \{/.test(qaSrc.slice(iT, iC));
  return { ok: true, cBody: qaSrc.slice(a + head.length, b), missingExpr: mM[1], allTiersExpr: mA[1], defcArg: mD[1], guard7 };
}
const fnBody = (f) => { const s = f.toString(); return s.slice(s.indexOf('{') + 1, s.lastIndexOf('}')); };
/** 合成の変異の本(段ごとに c₀ と scaleExp を振る —— 規約の内と外の両方) */
export function syntheticBooks(HP) {
  const out = [];
  for (const tier of HP.SCALE_TIERS.concat(['noSuchTier'])) {
    const a = HP.SCALE_ANCHORS ? HP.SCALE_ANCHORS[tier] : null;
    const real = a ? 3e8 / Math.pow(10, a.expL - a.expT) : 3000;
    const cs = [30, 10, 30.0000001, real, real * 1.005, real * 0.995, real * 1.02, -real, 0, NaN, '30', undefined, null];
    for (const c of cs) out.push({ id: `syn_${tier}_${String(c)}`, scaleTier: tier, physics: c === undefined ? {} : { cLight: c } });
    out.push({ id: `syn_${tier}_nophys`, scaleTier: tier });
    for (const [L, T] of [[11, 6], [8, 4], [0, 0], [11, '7']]) for (const c of [3e3, 3e4, 3e8, 30]) out.push({ id: `syn_${tier}_se${L}_${T}_${c}`, scaleTier: tier, scaleExp: { L, T, M: 30 }, physics: { cLight: c } });
  }
  return out;
}
/**
 * 道具の式と qa.mjs の式の照合(文字と値)。
 * @returns {{ok:boolean, bad:string[], textSame:{c:boolean, missing:boolean, allTiers:boolean, defc:boolean}, n:number}}
 */
export function compareFormulas(qaSrc, HP, builtins) {
  const bad = [];
  const F = qaFormulaOf(qaSrc);
  if (!F.ok) return { ok: false, bad: [F.why], textSame: null, n: 0 };
  const textSame = {
    c: normJs(F.cBody) === normJs(fnBody(cRuleBad)),
    missing: normJs(fnBody(tierOf)).includes(normJs('res.missing = ' + F.missingExpr + ';')),
    allTiers: normJs(fnBody(tierOf)).includes(normJs('res.allTiers = ' + F.allTiersExpr + ';')),
    defc: normJs(fnBody(defaultCOf)).includes(normJs('HP.validatePreset(' + F.defcArg + ')')),
  };
  for (const [k, v] of Object.entries(textSame)) if (!v) bad.push('式の文字が qa.mjs と違う: ' + k);
  if (!F.guard7) bad.push('qa.mjs の light.canonical-builtins の 7 分類の門(r.tierN >= 7)が引けない');
  // 値: qa.mjs の本文を関数にして、全内蔵 + 合成の変異の本で道具の式と照らす
  let qaC, qaMissing;
  try {
    qaC = new Function('HP', 'p', F.cBody);
    qaMissing = new Function('HP', 'builtins', 'return ' + F.missingExpr + ';');
  } catch (e) { return { ok: false, bad: ['qa.mjs の式が関数にならない: ' + String(e.message || e)], textSame, n: 0 }; }
  const books = builtins.concat(syntheticBooks(HP));
  let n = 0;
  for (const p of books) {
    n++;
    const x = cRuleBad(p, HP), y = qaC(HP, p);
    if (x !== y) { bad.push(`c₀ の式の値が違う: ${p.id}(道具 ${x}・qa.mjs ${y})`); if (bad.length > 8) break; }
  }
  const tm = tierOf(books, HP).missing, qm = qaMissing(HP, books);
  if (JSON.stringify(tm) !== JSON.stringify(qm)) bad.push('段の分類の式の値が違う');
  return { ok: bad.length === 0, bad, textSame, n };
}

/** html を Node で読む(子プロセスごとに 1 回 —— 同じプロセスで 2 つ目の html を読まない)。 */
async function loadHp(root, htmlAbs) {
  const { loadHtmlMain } = await import(pathToFileURL(path.join(root, 'tests', 'lib-w280b-emgrid.mjs')).href);
  return loadHtmlMain(htmlAbs).HP;
}
const builtinsOf = (HP) => HP.allPresets().filter((p) => !String(p.id).startsWith('custom_'));

/**
 * 1 つの html の規約の判定(①〜④)。
 * @returns {object} { target, ok, ngs[], c, tier, accept, xk, formula, sec }
 */
export function checkHp(HP, qaSrc, target) {
  const t0 = Date.now();
  const ngs = [];
  const builtins = builtinsOf(HP);
  // ②
  const tier = tierOf(builtins, HP);
  if (!(tier.missing.length === 0 && tier.allTiers)) ngs.push(`② 段の分類(preset.scale-tier): 未分類 ${tier.missing.join(',') || 'なし'}・空の段 ${HP.SCALE_TIERS.filter((t) => !(tier.counts[t] > 0)).join(',') || 'なし'}`);
  // ①
  const c = { applies: tier.tierN >= 7, bad: [], defC: null };
  if (c.applies) {
    c.bad = builtins.filter((p) => cRuleBad(p, HP)).map((p) => ({ id: p.id, emoji: p.emoji || '', cLight: (p.physics || {}).cLight, scaleTier: p.scaleTier, scaleExp: p.scaleExp || null }));
    c.defC = defaultCOf(HP);
    if (c.bad.length || c.defC !== 30) ngs.push(`① c₀ の規約(light.canonical-builtins): c₀≠30 かつ実 c でもない ${c.bad.length} 本 ${c.bad.map((z) => `${z.emoji}${z.id}(c₀=${z.cLight}・段 ${z.scaleTier}${z.scaleExp ? '・scaleExp L=' + z.scaleExp.L + ' T=' + z.scaleExp.T : ''})`).join(' ')}・既定値のマージ c₀=${c.defC}`);
  }
  // ③ と ④
  const accept = { rejected: [], warned: 0, warnIds: [] };
  const xk = { on: 0, off: 0, reasons: {}, via: typeof globalThis.physLockAutoOnOf === 'function' ? 'physLockAutoOnOf' : 'none' };
  for (const p of builtins) {
    let v;
    try { v = HP.validatePreset(JSON.parse(JSON.stringify(p))); } catch (e) { v = { ok: false, errors: [String(e.message || e)] }; }
    if (!v.ok) { accept.rejected.push({ id: p.id, why: String((v.errors || [])[0] || '').slice(0, 120) }); continue; }
    if ((v.warnings || []).length) { accept.warned++; accept.warnIds.push(p.id); }
    if (xk.via === 'physLockAutoOnOf') {
      const r = globalThis.physLockAutoOnOf({ params: v.preset.physics });
      xk[r.ok ? 'on' : 'off']++;
      xk.reasons[r.reason] = (xk.reasons[r.reason] || 0) + 1;
    }
  }
  if (accept.rejected.length) ngs.push(`③ 受理(validatePreset): 拒否 ${accept.rejected.length} 本 ${accept.rejected.map((z) => z.id + '(' + z.why + ')').join(' ')}`);
  // 式の照合
  const formula = compareFormulas(qaSrc, HP, builtins);
  return { target, version: CONVENTIONS_VERSION, n: builtins.length, ok: ngs.length === 0 && formula.ok, ngs, formulaOk: formula.ok, formula, tier, c, accept, xk, sec: (Date.now() - t0) / 1000 };
}

/** ⑤ samplestatus の冪等(beta だけ)—— 器が書く 2 つのファイルを走る前の bytes に戻す。 */
export function samplestatusIdempotent(root, opt) {
  const o = opt || {};
  const t0 = Date.now();
  const files = SAMPLESTATUS_WRITES.concat(['beta/index.html']);
  const snap = new Map(files.map((f) => [f, fs.existsSync(path.join(root, f)) ? fs.readFileSync(path.join(root, f)) : null]));
  const gitStatus = () => { const r = spawnSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }); return r.status === 0 ? r.stdout : null; };
  const st0 = gitStatus();
  const stage = fs.mkdtempSync(path.join(o.tmpdir || os.tmpdir(), 'conventions-ss-'));
  let r, parsed = null, restored = [];
  try {
    const env = Object.assign({}, process.env, { REGEN_HTML_STAGE: stage });
    r = spawnSync(process.execPath, [path.join(root, SAMPLESTATUS_HARNESS)], { cwd: root, env, encoding: 'utf8', maxBuffer: 1 << 26, timeout: o.timeoutMs || 15 * 60 * 1000 });
    const last = String(r.stdout || '').trim().split('\n').reverse().find((l) => l.startsWith('{') && l.includes('"htmlChanged"'));
    try { parsed = last ? JSON.parse(last) : null; } catch { parsed = null; }
  } finally {
    for (const [f, b] of snap) {
      const abs = path.join(root, f);
      const now = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
      if (b === null && now !== null) { fs.rmSync(abs); restored.push(f + '(消した)'); }
      else if (b !== null && (now === null || !b.equals(now))) { fs.writeFileSync(abs, b); restored.push(f); }
    }
    fs.rmSync(stage, { recursive: true, force: true });
  }
  const st1 = gitStatus();
  const htmlTouched = restored.includes('beta/index.html');
  const clean = st0 !== null && st0 === st1;
  const ngs = [];
  if (!r || r.status !== 0) ngs.push(`⑤ samplestatus の器が落ちた(rc ${r ? r.status : '?'}${r && r.error ? '・' + r.error.message : ''}): ${String((r && r.stderr) || '').trim().split('\n').slice(-3).join(' | ').slice(0, 300)}`);
  else if (!parsed) ngs.push('⑤ samplestatus の器の印字に htmlChanged の行が無い');
  else if (parsed.htmlChanged !== false) ngs.push('⑤ samplestatus が冪等でない(htmlChanged:true —— html の生成領域 sample-status が原稿+正本から作った表と違う。差を作り直してコミットしてから鎖を起動)');
  if (htmlTouched) ngs.push('⑤ 器が beta/index.html を直に書いた(REGEN_HTML_STAGE が効かない —— 走る前の bytes に戻した)');
  if (!clean) ngs.push('⑤ 作業ツリーの git status が前後で違う(戻した後) —— 器が他のファイルを書いた');
  return { ok: ngs.length === 0, ngs, rc: r ? r.status : null, htmlChanged: parsed ? parsed.htmlChanged : null, summary: parsed, restored, clean, sec: (Date.now() - t0) / 1000 };
}

/** 自己試験(式の照合・2fd84b4 の型の変異〔♊⚖️ を c₀ = 10 に〕の検出・段の未分類の検出・SKIP の数え方は qapart の lib)。 */
export async function selfTest(opt) {
  const root = (opt && opt.root) || TOOL_ROOT;
  const HP = await loadHp(root, path.join(root, 'beta', 'index.html'));
  const qaSrc = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  const bad = [], cases = [];
  const builtins = builtinsOf(HP);
  const cmp = compareFormulas(qaSrc, HP, builtins);
  if (!cmp.ok) bad.push('式の照合: ' + cmp.bad.slice(0, 3).join(' / '));
  cases.push(`式の照合(qa.mjs の light.canonical-builtins・preset.scale-tier): 文字 ${Object.entries(cmp.textSame || {}).map(([k, v]) => k + '=' + v).join('・')}・値 ${cmp.n} 例(全内蔵 ${builtins.length} + 合成の変異)`);
  // 2fd84b4 の型: 段 stellar の三次元の連星の本 2 本を c₀ = 10 に(第322便の ♊⚖️)
  const ids = ['binaryCheckEqualInertial3d', 'binaryCheckRatio3Inertial3d'].filter((id) => builtins.some((p) => p.id === id));
  const pick = ids.length === 2 ? ids : builtins.filter((p) => p.scaleTier === 'stellar' && !p.scaleExp).slice(0, 2).map((p) => p.id);
  const mut = builtins.map((p) => (pick.includes(p.id) ? Object.assign({}, p, { physics: Object.assign({}, p.physics, { cLight: 10 }) }) : p));
  const got = mut.filter((p) => cRuleBad(p, HP)).map((p) => p.id);
  if (JSON.stringify(got) !== JSON.stringify(pick)) bad.push('① c₀ = 10 の 2 本を落とさない: ' + got.join(','));
  if (builtins.filter((p) => cRuleBad(p, HP)).length !== 0) bad.push('① 今の beta で c₀ の外が 0 でない');
  // 実 c の本(⚡📻 の L−T=5 の c₀ = 3×10³)を 1.02 倍にすると落ちる・1.005 倍は通る
  const realC = builtins.filter((p) => (p.physics || {}).cLight !== 30);
  const m102 = realC.slice(0, 3).filter((p) => cRuleBad(Object.assign({}, p, { physics: Object.assign({}, p.physics, { cLight: p.physics.cLight * 1.02 }) }), HP)).length;
  const m1005 = realC.slice(0, 3).filter((p) => cRuleBad(Object.assign({}, p, { physics: Object.assign({}, p.physics, { cLight: p.physics.cLight * 1.005 }) }), HP)).length;
  if (realC.length && !(m102 === Math.min(3, realC.length) && m1005 === 0)) bad.push(`① 実 c の窓(±1%): 1.02 倍で落ちる ${m102}・1.005 倍で落ちる ${m1005}`);
  cases.push(`① 変異: ${pick.join('・')} を c₀ = 10 に → 落ちる ${got.length} 本(第322便の 2fd84b4 の型)・実 c の本 ${realC.length} 本のうち 3 本を 1.02 倍 → ${m102} 本落ちる・1.005 倍 → ${m1005} 本`);
  // ② 段の未分類
  const t2 = tierOf(builtins.map((p, k) => (k === 0 ? Object.assign({}, p, { scaleTier: 'noSuchTier' }) : p)), HP);
  if (!(t2.missing.length === 1 && t2.missing[0] === builtins[0].id)) bad.push('② 未分類の検出');
  cases.push(`② 変異: ${builtins[0].id} の段を外す → 未分類 ${t2.missing.length}`);
  // checkHp(今の beta)
  const r = checkHp(HP, qaSrc, 'beta/index.html');
  if (!r.ok) bad.push('今の beta が通らない: ' + r.ngs.concat(r.formula.bad).slice(0, 3).join(' / '));
  cases.push(`今の beta: 内蔵 ${r.n}・c₀ の外 ${r.c.bad.length}・未分類 ${r.tier.missing.length}・拒否 ${r.accept.rejected.length}・警告のある本 ${r.accept.warned}・X_k = G_0/c_0² を満たす ${r.xk.on}・満たさない ${r.xk.off}(情報)`);
  return { version: CONVENTIONS_VERSION, ok: bad.length === 0, bad, cases };
}

function lineOf(r) {
  const parts = [`内蔵 ${r.n} 本`,
    r.c.applies ? `① c₀ の外 ${r.c.bad.length}(既定値のマージ c₀=${r.c.defC})` : '① SKIP(7 分類の世代でない)',
    `② 段の未分類 ${r.tier.missing.length}(${r.tier.tierN} 分類${r.tier.allTiers ? 'が全部埋まる' : ' —— 空の段あり'})`,
    `③ 受理の拒否 ${r.accept.rejected.length}・警告のある本 ${r.accept.warned}`,
    r.xk.via === 'physLockAutoOnOf' ? `④ X_k = G_0/c_0² を満たす ${r.xk.on}・満たさない ${r.xk.off}(${Object.entries(r.xk.reasons).map(([k, v]) => k + ' ' + v).join('・')} —— 情報)` : '④ 判定関数なし(情報)',
    `式の照合 ${r.formula.ok ? 'qa.mjs と一致(' + r.formula.n + ' 例)' : '食い違い'}`];
  return parts.join('・');
}

async function main(argv) {
  const root = TOOL_ROOT;
  const all = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] !== undefined ? [argv[i + 1]] : []));
  const get = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const known = new Set(['--target', '--json', '--samplestatus', '--self-test', '--child-json']);
  for (let i = 0; i < argv.length; i++) { if (!known.has(argv[i])) { console.error('conventions-check: 知らない引数 ' + argv[i]); process.exit(2); } if (['--target', '--json', '--child-json'].includes(argv[i])) i++; }
  if (argv.includes('--self-test')) {
    let r;
    try { r = await selfTest({ root }); } catch (e) { console.error('conventions-check --self-test: 道具の誤り ' + String((e && e.stack) || e)); process.exit(2); }
    for (const c of r.cases) console.log('  ' + c);
    console.log(`conventions-check --self-test(${CONVENTIONS_VERSION}): ${r.ok ? 'OK' : 'NG —— ' + r.bad.join(' / ')}`);
    process.exit(r.ok ? 0 : 1);
  }
  const qaSrc = fs.readFileSync(path.join(root, 'tests', 'qa.mjs'), 'utf8');
  // 子(1 つの html —— 同じプロセスで 2 つ目の html を読まない)
  const child = get('--child-json');
  if (child) {
    const tg = all('--target')[0];
    const abs = path.isAbsolute(tg) ? tg : path.join(root, tg);
    let out;
    try { out = checkHp(await loadHp(root, abs), qaSrc, tg); }
    catch (e) { out = { target: tg, loadError: String((e && e.message) || e).slice(0, 300) }; }
    fs.writeFileSync(child, JSON.stringify(out));
    process.exit(0);
  }
  const targets = all('--target').length ? all('--target') : ['beta/index.html'];
  const wantSS = argv.includes('--samplestatus');
  if (wantSS && !targets.includes('beta/index.html')) { console.error('conventions-check: --samplestatus は beta/index.html の判定と一緒に(器は beta の生成領域を書く)'); process.exit(2); }
  const t0 = Date.now();
  const res = { version: CONVENTIONS_VERSION, at: new Date().toISOString(), targets: [], samplestatus: null };
  let rc = 0;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'conventions-'));
  try {
    for (const tg of targets) {
      const abs = path.isAbsolute(tg) ? tg : path.join(root, tg);
      if (!fs.existsSync(abs)) { console.error('conventions-check: html が無い ' + tg); rc = 2; continue; }
      const jf = path.join(tmp, 'r-' + res.targets.length + '.json');
      const ch = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--target', tg, '--child-json', jf], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 24 });
      let r = null; try { r = JSON.parse(fs.readFileSync(jf, 'utf8')); } catch { r = null; }
      if (!r || r.loadError) { console.error(`conventions-check: ${tg} が読めない —— ${r ? r.loadError : String(ch.stderr || '').trim().slice(-300)}`); rc = 2; continue; }
      res.targets.push(r);
      console.log(`conventions-check(${CONVENTIONS_VERSION}) ${tg}: ${lineOf(r)}・${r.sec.toFixed(1)} s → ${r.ok ? 'OK' : 'NG'}`);
      for (const ng of r.ngs) console.log('  NG ' + ng);
      if (!r.formula.ok) { for (const b of r.formula.bad) console.log('  道具の誤り ' + b); rc = 2; }
      else if (r.ngs.length && rc === 0) rc = 1;
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  if (wantSS && rc !== 2) {
    const s = samplestatusIdempotent(root);
    res.samplestatus = s;
    console.log(`conventions-check ⑤ samplestatus の冪等: 器 rc ${s.rc}・htmlChanged ${s.htmlChanged}・戻したファイル ${s.restored.join('・') || 'なし'}・木 ${s.clean ? '前後で同じ' : '前後で違う'}・${s.sec.toFixed(1)} s → ${s.ok ? 'OK' : 'NG'}`);
    for (const ng of s.ngs) console.log('  NG ' + ng);
    if (!s.ok && rc === 0) rc = 1;
  }
  const js = get('--json'); if (js) fs.writeFileSync(path.resolve(js), JSON.stringify(res, null, 1));
  console.log(`conventions-check: ${rc === 0 ? 'OK' : rc === 1 ? 'NG(規約の外 —— 鎖を起動しない)' : '道具の誤り'}(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  process.exit(rc);
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main(process.argv.slice(2));

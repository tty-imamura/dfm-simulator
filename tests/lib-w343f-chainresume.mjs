// 第343便f(統括の検証項目 R383・BL-141): **鎖の入れ直しの判定と、鎖の起動の前の脚本の実在と構文の見方**(純関数 + 小さな fs の読み —— html を読まない・正本を書かない)。
//   tools/regen-chain.mjs の `--resume-gate`・`--preflight` と QA lint.chainResume343f が呼ぶ。
//
// ■ 何を道具にしたか(第342便の鎖 —— 再起動 4 回・入れ直し・差し替えの脚本の置き忘れ)
//   ① 入れ直しの判定(--resume-gate): 鎖の起動の前の規約の判定(tools/conventions-check.mjs --samplestatus)の ⑤ samplestatus の冪等は、鎖の途中
//      (作り直した正本と html の生成領域 sample-status が食い違う —— samplestatus・htmlagg の段がまだ)では NG になる。それまでは統括の手元の包みが
//      「済み印が在る・NG が ⑤ だけ・samplestatus の段が未了」の 3 つがそろうときだけ通していた。同じ 3 つの条件を道具の判定にした
//      (規約の判定が OK なら初回と同じく通す・規約 ①〜④ のどれかが NG・道具の誤り〔rc 2〕・3 つのどれかが欠ける → 止める)。
//   ② 起動の前の見方(--preflight): 鎖の脚本(regen-chain の生成物と差し替えの後)が呼ぶ node の .mjs/.js・bash の .sh の実在と構文
//      (`node --check`・`bash -n`)。無い・構文の誤りが 1 つでも在れば止める(第342便は差し替え先の脚本が無く rc 127 で 29 分を失った)。
// ■ 変えないこと: 段の順・済み印の契約・計画の判定(regen-plan の判定)は変えない。条件を広げない(⑤ 以外の NG を通さない)。
// ■ 第344便f(統括の検証項目 R390・BL-148 —— lib 版 2): **入れ直し可を「冪等でない」の NG だけに狭めた**。版 1 は ⑤ の NG の行の頭(「⑤ samplestatus」)だけを
//   見ていたので、⑤ の 3 種類の NG(器が落ちた・htmlChanged の行が無い・作った html が今の html と違う〔冪等でない〕)のどれでも入れ直し可と返した。
//   版 2 は ⑤ の構造の欄(器の rc が 0・htmlChanged が true・作業の木が前後で同じ・器が html を直に書いていない —— tools/conventions-check.mjs の
//   samplestatus の rc・htmlChanged・clean・htmlTouched・kind)と NG の文の両方を見て、両方が「冪等でない」の 1 件だけを指すときにだけ入れ直す。
//   欄が無い(版 1 の世代の JSON)・文と欄が食い違う → 止める。規約が OK のときに通す振る舞い(初回と同じ)と終了コードは変えない。
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const LIB_VERSION = 'w343f-chainresume-lib-2';   // 第344便f: 版 2(⑤ の 3 種類の NG を分ける —— 入れ直し可は「冪等でない」だけ)
export const DECL = Object.freeze({
  /** ⑤ の NG の行の頭(tools/conventions-check.mjs の samplestatusIdempotent の文 —— 包みの grep "^  NG ⑤ samplestatus" と同じ) */
  ng5Head: '⑤ samplestatus',
  /** 第344便f: ⑤ の NG の文の頭(tools/conventions-check.mjs の samplestatusIdempotent の文と同じ)→ 種類。入れ直し可は notIdempotent だけ */
  ng5Kinds: Object.freeze({ harnessFailed: '⑤ samplestatus の器が落ちた', noLine: '⑤ samplestatus の器の印字に htmlChanged の行が無い',
    notIdempotent: '⑤ samplestatus が冪等でない', htmlTouched: '⑤ 器が beta/index.html を直に書いた', dirty: '⑤ 作業ツリーの git status が前後で違う' }),
  resumableKind: 'notIdempotent',
  /** まだ済んでいないことを見る段(済み印の名) */
  ssStep: 'samplestatus',
  /** 止めるときの終了コード(包みの REFUSED の 4 と同じ)・起動の前の見方で止めるとき */
  refuseRc: 4, preflightRc: 5,
  /** 鎖の脚本から拾う呼び出しの型(node / bash / sh の後の最初の引数で、拡張子が .mjs・.js・.cjs・.sh のもの) */
  refRe: /(?:^|[\s;&|('"=]|\$\()(node|bash|sh)\s+(?:-{1,2}[A-Za-z][\w-]*(?:=\S+)?\s+)*['"]?([^\s'";|&)]+\.(?:mjs|cjs|js|sh))\b/g,
  /** 引数に渡される脚本(例: --harness tests/exp-….mjs)—— tests/・tools/ の下か絶対の道で、拡張子が .mjs・.js・.cjs・.sh の字句 */
  argRe: /(?:^|[\s'"=(])((?:\/[\w.\/-]+|(?:tests|tools)\/[\w.\/-]+)\.(?:mjs|cjs|js|sh))(?=[\s'";|&)]|$)/g,
});

/** 済み印の名(<REGEN_LOG>/done の *.done から .done を外した名 —— chain.done のような鎖の印は除かない: 包みは done/ の全部を数えていた) */
export function doneMarksOf(logDir) {
  const d = path.join(logDir, 'done');
  try { return fs.readdirSync(d).filter((f) => f.endsWith('.done')).map((f) => f.slice(0, -5)).sort(); } catch { return []; }
}
/** 規約の判定(conventions-check --json の物)の NG の行を全部(対象ごと + ⑤) */
export function convNgs(conv) {
  const out = [];
  for (const t of (conv && conv.targets) || []) for (const ng of t.ngs || []) out.push(ng);
  if (conv && conv.samplestatus) for (const ng of conv.samplestatus.ngs || []) out.push(ng);
  return out;
}
/**
 * 入れ直しの判定。convRc = conventions-check の終了コード(0 通る・1 規約の外・2 道具の誤り)・conv = その --json・doneMarks = 済み印の名。
 * 戻り値 { start, mode: 'clean' | 'resume' | 'refuse', conds: { marks, only5, ssPending, targetsOk }, ngs, why }
 */
export function resumeVerdict({ convRc, conv, doneMarks }) {
  const ngs = convNgs(conv), marks = (doneMarks || []).length;
  const targetsOk = !!conv && Array.isArray(conv.targets) && conv.targets.length > 0 && conv.targets.every((t) => t.ok === true && t.formula && t.formula.ok !== false);
  const only5 = ngs.length === 1 && ngs[0].startsWith(DECL.ng5Head) && !!conv && !!conv.samplestatus && conv.samplestatus.ok === false;
  const ssPending = !(doneMarks || []).includes(DECL.ssStep);
  // 第344便f: ⑤ の構造の欄と文の両方で「冪等でない」の 1 件だけか
  const ss = (conv && conv.samplestatus) || null, sk = ss5Kinds(ss);
  const ssFields = sk.fieldKinds.length === 1 && sk.fieldKinds[0] === DECL.resumableKind;
  const ssText = sk.textKinds.length === 1 && sk.textKinds[0] === DECL.resumableKind;
  const ssAgree = sk.agree;
  const conds = { marks: marks > 0, only5, ssPending, targetsOk, ssFields, ssText, ssAgree };
  if (convRc === 0) return { start: true, mode: 'clean', conds, ngs, why: '規約の判定が OK(初回と同じ)' };
  if (convRc !== 1) return { start: false, mode: 'refuse', conds, ngs, why: '規約の判定が道具の誤り(rc ' + convRc + ')' };
  const miss = Object.entries(conds).filter(([, v]) => !v).map(([k]) => k);
  if (!miss.length) return { start: true, mode: 'resume', conds, ngs, why: `入れ直し: 規約 ①〜④ OK・NG は ⑤ だけ(鎖の途中の食い違い)・済み印 ${marks}・samplestatus の段は未了` };
  return { start: false, mode: 'refuse', conds, ngs, why: '止める: ' + miss.map((k) => ({ marks: '済み印が無い(初回 —— 全部 OK を求める)', only5: 'NG が ⑤ だけでない', ssPending: 'samplestatus の段が済んでいる(⑤ の NG は鎖の途中の食い違いでない)', targetsOk: '規約 ①〜④ の判定が OK でない',
    ssFields: '⑤ の欄が「冪等でない」でない(欄の種類 ' + (sk.fieldKinds.join('+') || 'なし') + ' —— 器の rc 0・htmlChanged true・木が前後で同じ・html を直に書いていない、を全部求める)',
    ssText: '⑤ の NG の文が「冪等でない」の 1 件でない(文の種類 ' + (sk.textKinds.join('+') || 'なし') + ')',
    ssAgree: '⑤ の文と欄が食い違う(' + sk.why + ')' }[k])).join('・') };
}

/**
 * 第344便f: ⑤ の結果(conventions-check --json の samplestatus)の種類を、構造の欄と NG の文から別々に読む。
 * fieldKinds: 欄から読んだ NG の種類の列('missing' = 欄が無い —— 版 1 の世代・'harnessFailed'・'noLine'・'notIdempotent'・'htmlTouched'・'dirty')・fieldKind: 主の種類('ok' = NG 0・'none' = 結果が無い)
 * textKinds: NG の文の頭から読んだ種類の列(知らない頭は 'unknown')。agree: 道具の kind = 主の種類・文の列 = 欄の列・ok = NG 0(全部そろうとき真)
 */
export function ss5Kinds(ss) {
  const K = DECL.ng5Kinds;
  if (!ss) return { fieldKind: 'none', fieldKinds: ['none'], textKinds: [], agree: false, why: '⑤ の結果が無い' };
  const textKinds = (ss.ngs || []).map((ng) => { const e = Object.entries(K).find(([, head]) => String(ng).startsWith(head)); return e ? e[0] : 'unknown'; });
  const has = (k) => Object.prototype.hasOwnProperty.call(ss, k);
  // 欄から読む NG の種類の列(tools/conventions-check.mjs の samplestatusIdempotent の NG と同じ順: 器 → 行 → 冪等 → html → 木)
  const fieldKinds = [];
  if (!(has('rc') && has('htmlChanged') && has('clean') && has('htmlTouched') && has('kind'))) fieldKinds.push('missing');
  else {
    if (ss.rc !== 0) fieldKinds.push('harnessFailed');
    else if (ss.htmlChanged !== true && ss.htmlChanged !== false) fieldKinds.push('noLine');
    else if (ss.htmlChanged === true) fieldKinds.push('notIdempotent');
    if (ss.htmlTouched !== false) fieldKinds.push('htmlTouched');
    if (ss.clean !== true) fieldKinds.push('dirty');
  }
  // 主の種類(道具が kind に書く物 —— 重い順: 器 → 行 → html → 木 → 冪等)
  const PRI = ['missing', 'harnessFailed', 'noLine', 'htmlTouched', 'dirty', 'notIdempotent'];
  const fieldKind = fieldKinds.length ? PRI.find((k) => fieldKinds.includes(k)) : 'ok';
  // 欄の kind(道具が書いた種類)・欄から読み直した種類の列・文の種類の列が同じものを指すか
  const agree = fieldKind !== 'missing' && ss.kind === fieldKind && JSON.stringify(textKinds) === JSON.stringify(fieldKinds) && (ss.ok === (fieldKinds.length === 0));
  const why = fieldKind === 'missing' ? '⑤ の欄(rc・htmlChanged・clean・htmlTouched・kind)が無い'
    : `欄から読んだ種類 ${fieldKinds.join('+') || 'なし'}・道具の書いた kind ${ss.kind}・文の種類 ${textKinds.join('+') || 'なし'}・ok ${ss.ok}`;
  return { fieldKind, fieldKinds, textKinds, agree, why };
}

/** 鎖の脚本が呼ぶ脚本(node・bash・sh の後の .mjs/.js/.cjs/.sh)—— 変数を含む道は解けないので別に数える */
export function scriptRefs(text) {
  const out = new Map();
  for (const m of String(text).matchAll(DECL.refRe)) { const p = m[2]; if (!out.has(p)) out.set(p, m[1] === 'node' ? 'node' : 'bash'); }
  for (const m of String(text).matchAll(DECL.argRe)) { const p = m[1]; if (!out.has(p)) out.set(p, p.endsWith('.sh') ? 'bash' : 'node'); }
  return [...out.entries()].map(([p, how]) => ({ path: p, how, unresolved: /\$/.test(p) }));
}
/** 起動の前の見方: 実在と構文(cwd = 鎖が cd する root)。exists・check は試験で差し替えられる */
export function preflight(text, { root, exists = (f) => fs.existsSync(f), check = syntaxCheck } = {}) {
  const rows = scriptRefs(text).map((r) => {
    if (r.unresolved) return Object.assign(r, { exists: null, syntaxOk: null, note: '変数を含む道(解けない —— 見ない)' });
    const abs = path.isAbsolute(r.path) ? r.path : path.join(root, r.path);
    const ex = exists(abs); const c = ex ? check(abs, r.how) : { ok: false, err: '無い' };
    return Object.assign(r, { exists: ex, syntaxOk: ex ? c.ok : false, note: c.ok ? '' : String(c.err || '').slice(0, 200) });
  });
  const bad = rows.filter((r) => r.exists === false || r.syntaxOk === false);
  return { ok: bad.length === 0, n: rows.length, nUnresolved: rows.filter((r) => r.unresolved).length, bad, rows };
}
/** node --check / bash -n */
export function syntaxCheck(abs, how) {
  const r = how === 'node' ? spawnSync(process.execPath, ['--check', abs], { encoding: 'utf8' }) : spawnSync('bash', ['-n', abs], { encoding: 'utf8' });
  return { ok: r.status === 0, err: (r.stderr || '').trim().split('\n').slice(-2).join(' | ') };
}

/* ───────── 自己試験(lint.chainResume343f —— 作り物の値)───────── */
const T_OK = { ok: true, ngs: [], formula: { ok: true } };
/** 第344便f: ⑤ の作り物(欄は tools/conventions-check.mjs の samplestatusIdempotent と同じ名) */
const SS = (o) => Object.assign({ ok: false, rc: 0, htmlChanged: true, clean: true, htmlTouched: false, kind: 'notIdempotent', ngs: ['⑤ samplestatus が冪等でない(htmlChanged:true —— 作り物)'] }, o);
const C5 = (o) => ({ targets: [T_OK], samplestatus: SS(o) });
export const FAKE = Object.freeze({
  conv5: C5({}),
  /** 第344便f: 版 1 の世代の JSON(欄が無い)—— 版 2 は止める */
  conv5legacy: { targets: [T_OK], samplestatus: { ok: false, ngs: ['⑤ samplestatus が冪等でない(htmlChanged:true —— 作り物)'] } },
  conv5crash: C5({ rc: 1, htmlChanged: null, kind: 'harnessFailed', ngs: ['⑤ samplestatus の器が落ちた(rc 1): 作り物'] }),
  conv5noLine: C5({ htmlChanged: null, kind: 'noLine', ngs: ['⑤ samplestatus の器の印字に htmlChanged の行が無い'] }),
  conv5rcOnly: C5({ rc: 1 }),
  conv5dirty: C5({ clean: false, kind: 'dirty', ngs: ['⑤ samplestatus が冪等でない(htmlChanged:true —— 作り物)', '⑤ 作業ツリーの git status が前後で違う(戻した後) —— 作り物'] }),
  conv5dirtyQuiet: C5({ clean: false }),
  conv5touched: C5({ htmlTouched: true, kind: 'htmlTouched', ngs: ['⑤ samplestatus が冪等でない(htmlChanged:true —— 作り物)', '⑤ 器が beta/index.html を直に書いた(作り物)'] }),
  conv5textCrash: C5({ ngs: ['⑤ samplestatus の器が落ちた(rc 1): 作り物'] }),
  conv5kindWrong: C5({ kind: 'harnessFailed' }),
  convOther: { targets: [{ ok: false, ngs: ['② 作り物の規約の外'], formula: { ok: true } }], samplestatus: { ok: true, ngs: [] } },
  conv5plus: { targets: [{ ok: false, ngs: ['② 作り物の規約の外'], formula: { ok: true } }], samplestatus: { ok: false, ngs: ['⑤ samplestatus が冪等でない(作り物)'] } },
  convClean: { targets: [T_OK], samplestatus: { ok: true, ngs: [] } },
});
export function selfCases() {
  const v = (convRc, conv, doneMarks) => resumeVerdict({ convRc, conv, doneMarks });
  return [
    { name: '3 条件がそろう → 通す(入れ直し)', got: v(1, FAKE.conv5, ['calaudit', 'kf0']), want: 'resume' },
    { name: '済み印が無い → 止める', got: v(1, FAKE.conv5, []), want: 'refuse' },
    { name: 'samplestatus の段が済み → 止める', got: v(1, FAKE.conv5, ['calaudit', 'samplestatus']), want: 'refuse' },
    { name: '⑤ 以外の NG → 止める', got: v(1, FAKE.convOther, ['calaudit']), want: 'refuse' },
    { name: '⑤ と ⑤ 以外の NG → 止める', got: v(1, FAKE.conv5plus, ['calaudit']), want: 'refuse' },
    { name: '道具の誤り(rc 2)→ 止める', got: v(2, FAKE.conv5, ['calaudit']), want: 'refuse' },
    { name: '規約が OK → 通す(初回と同じ)', got: v(0, FAKE.convClean, []), want: 'clean' },
    // 第344便f(R390): ⑤ の 3 種類の NG を分ける・文と欄の食い違い —— 全部 止める
    { name: '器が落ちた(rc 1・行が無い)→ 止める', got: v(1, FAKE.conv5crash, ['calaudit']), want: 'refuse' },
    { name: 'htmlChanged の行が無い → 止める', got: v(1, FAKE.conv5noLine, ['calaudit']), want: 'refuse' },
    { name: 'rc だけ違う(文と htmlChanged は冪等でない・器の rc 1)→ 止める', got: v(1, FAKE.conv5rcOnly, ['calaudit']), want: 'refuse' },
    { name: '木が汚れたまま(NG 2 件)→ 止める', got: v(1, FAKE.conv5dirty, ['calaudit']), want: 'refuse' },
    { name: '木が汚れたまま(文は冪等でないの 1 件・欄 clean false)→ 止める', got: v(1, FAKE.conv5dirtyQuiet, ['calaudit']), want: 'refuse' },
    { name: '器が html を直に書いた → 止める', got: v(1, FAKE.conv5touched, ['calaudit']), want: 'refuse' },
    { name: '文と欄が食い違う(文は器が落ちた・欄は冪等でない)→ 止める', got: v(1, FAKE.conv5textCrash, ['calaudit']), want: 'refuse' },
    { name: '文と欄が食い違う(道具の kind が別の種類)→ 止める', got: v(1, FAKE.conv5kindWrong, ['calaudit']), want: 'refuse' },
    { name: '欄が無い(版 1 の世代の JSON)→ 止める', got: v(1, FAKE.conv5legacy, ['calaudit']), want: 'refuse' },
  ].map((c) => Object.assign(c, { ok: c.got.mode === c.want }));
}

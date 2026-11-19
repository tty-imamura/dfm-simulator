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
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const LIB_VERSION = 'w343f-chainresume-lib-1';
export const DECL = Object.freeze({
  /** ⑤ の NG の行の頭(tools/conventions-check.mjs の samplestatusIdempotent の文 —— 包みの grep "^  NG ⑤ samplestatus" と同じ) */
  ng5Head: '⑤ samplestatus',
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
  const conds = { marks: marks > 0, only5, ssPending, targetsOk };
  if (convRc === 0) return { start: true, mode: 'clean', conds, ngs, why: '規約の判定が OK(初回と同じ)' };
  if (convRc !== 1) return { start: false, mode: 'refuse', conds, ngs, why: '規約の判定が道具の誤り(rc ' + convRc + ')' };
  const miss = Object.entries(conds).filter(([, v]) => !v).map(([k]) => k);
  if (!miss.length) return { start: true, mode: 'resume', conds, ngs, why: `入れ直し: 規約 ①〜④ OK・NG は ⑤ だけ(鎖の途中の食い違い)・済み印 ${marks}・samplestatus の段は未了` };
  return { start: false, mode: 'refuse', conds, ngs, why: '止める: ' + miss.map((k) => ({ marks: '済み印が無い(初回 —— 全部 OK を求める)', only5: 'NG が ⑤ だけでない', ssPending: 'samplestatus の段が済んでいる(⑤ の NG は鎖の途中の食い違いでない)', targetsOk: '規約 ①〜④ の判定が OK でない' }[k])).join('・') };
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
export const FAKE = Object.freeze({
  conv5: { targets: [T_OK], samplestatus: { ok: false, ngs: ['⑤ samplestatus が冪等でない(htmlChanged:true —— 作り物)'] } },
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
  ].map((c) => Object.assign(c, { ok: c.got.mode === c.want }));
}

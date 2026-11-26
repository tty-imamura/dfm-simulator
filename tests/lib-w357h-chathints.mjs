// 第357便h(統括の検証項目 R528・AI_SPEC §420): 対話の入口の、試しの後の直しの検査の lib(QA ai.chatHints357h の vm の部分)。
//   対象 html を tests/lib-w355h-aichat-validate.mjs の loadApp で vm に読み、アプリの本文の関数(aiPasteRun(false) ほか)をそのまま呼ぶ。
//   見るのは「出来た本の 1 行」の在り無し・字・geoPN の数が出来た本の値と同じこと・取り込む値が前の版と同じこと —— **数は決め打ちしない**(出来た本から読む)。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadApp, checkText } from './lib-w355h-aichat-validate.mjs';
import { i18nStrings } from './lib-w357c-chatbuttons.mjs';

export const LIB_VERSION = 'w357h-chathints-lib-1';
export const NOTE_JA = 'AIが「ページを読めない」と言ったら、下の「1回で生成するプロンプト」を使う(仕様を全部含むので、ページを読まなくてよい)。';
export const NOTE_EN = 'If the AI says it cannot read the pages, use "One-shot generation prompt" below (it contains the whole specification, so no page needs to be read).';
export const KIND_JA = { records: '観測レコードから組み立てた実単位の本', real: 'プリセットをそのまま —— 実単位の宣言あり', preset: 'プリセットをそのまま —— 実単位ではありません' };

// 題: 内蔵の本の先頭(プリセット・実単位の宣言なし)・内蔵の 🟠 jupiterGalilean(プリセット・実単位の宣言あり)・仕様の例の観測レコード
export function hintCases(app, root) {
  const ev = app.H.evalExpr;
  const p0 = JSON.parse(ev('JSON.stringify(BUILTIN_PRESETS[0])'));
  const jg = JSON.parse(ev('JSON.stringify(BUILTIN_PRESETS.find((p)=>p.id==="jupiterGalilean")||null)'));
  const spec = fs.readFileSync(path.join(root, 'docs/AI_SPEC.md'), 'utf8');
  const i0 = spec.indexOf('## EXAMPLE'), i1 = spec.indexOf('# OUTPUT B', i0);
  const ex = (i0 >= 0 && i1 > i0) ? spec.slice(spec.indexOf('\n', i0) + 1, i1).trim() : '';
  const out = [{ id: 'h1-preset', want: 'preset', text: '```json\n' + JSON.stringify(p0, null, 1) + '\n```' }];
  if (jg) out.push({ id: 'h2-real-preset', want: 'real', text: JSON.stringify(jg) });
  if (ex) out.push({ id: 'h3-records', want: 'records', text: 'Here are the records:\n```json\n' + ex + '\n```' });
  return out;
}
export function hintOne(app, c) {
  const res = checkText(app, c.text, { steps: 1 });
  let msg = null; try { msg = app.H.evalExpr('HP.aiResultMsgNow357c()'); } catch (e) { /* */ }
  return { id: c.id, want: c.want, exit: res.exit, preset: res.preset, heads: res.screen.blocks.map((b) => b.head), msg };
}
export function judgeHints(now, before, html) {
  const why = [], cases = [];
  for (const r of now) {
    const g = r.preset && r.preset.physics ? r.preset.physics.geoPN : undefined;
    const line = '出来た本: geoPN=' + g + '(' + KIND_JA[r.want] + ')';
    if (!(r.exit === 0 && g !== undefined)) { why.push('① ' + r.id + ' が受理されない'); continue; }
    const nShow = r.heads.filter((h) => h === line).length;
    if (nShow !== 1) why.push('① ' + r.id + ' の報告に「' + line + '」が 1 つでない(' + nShow + ')');
    if (!(r.msg && r.msg.split('\n')[1] === line)) why.push('② ' + r.id + ' の伝える文の 2 行目が「' + line + '」でない');
    cases.push(r.id + ' → ' + line);
  }
  const ja = i18nStrings(html, 'aiChatNote');
  if (!(ja.length === 2 && ja[0].endsWith(NOTE_JA) && ja[1].endsWith(NOTE_EN))) why.push('③ 手順の段に「ページを読めない」の 1 文(ja/en)が無い');
  if ((String(html).match(/\n  aiResBuilt:/g) || []).length !== 2) why.push('③ I18N の aiResBuilt が ja/en の対でない');
  cases.push('③ 手順の段の 1 文 ja/en・aiResBuilt の対');
  if (before) {
    // 観測レコードの題は、組み立ての形を変える枝(第357便g)が在るので比べない —— プリセットの題だけ(この枝は取り込む値を変えない)
    const pr = now.filter((r) => r.want !== 'records');
    for (const r of pr) { const b = before.find((x) => x.id === r.id); if (!(b && JSON.stringify(b.preset) === JSON.stringify(r.preset))) why.push('④ ' + r.id + ' の取り込む値が前の版と違う'); }
    cases.push('④ 取り込む値: プリセットの ' + pr.length + ' 題は前の版と同じ(観測レコードの題は組み立ての形を変える枝が在るので比べない)');
  } else cases.push('④ 前の版の html が無い所では、取り込む値の比べは省く');
  return { why, cases };
}
export function runChatHints(root, target, base, opts = {}) {
  const why = [], cases = [];
  const app = loadApp(target);
  if (app.missing.length) return { why: ['アプリの関数が無い: ' + app.missing.join(',')], cases };
  const H = fs.readFileSync(target, 'utf8');
  const now = hintCases(app, root).map((c) => hintOne(app, c));
  let before = null;
  if (base && fs.existsSync(base)) { const bapp = loadApp(base); if (!bapp.missing.length) before = hintCases(bapp, root).map((c) => hintOne(bapp, c)); }
  if (now.length !== 3) why.push('題が 3 つでない(' + now.length + ')');
  const J = judgeHints(now, before, H); why.push(...J.why); cases.push(...J.cases);
  if (opts.mutate !== false) {
    const MUT = [
      ['報告の 1 行を外す', H.replace('  obsReportBlock(aiBuiltLineOf(r), []);', '  void 0;'), /^①/],
      ['伝える文の 1 行を外す', H.replace(' rows.push(aiBuiltLineOf(r)); }', ' }'), /^②/],
      ['種類の読みを逆に', H.replace('const kd=(r.kind==="records")?', 'const kd=(r.kind!=="records")?'), /^①/],
      ['手順の 1 文を外す', H.replace(NOTE_JA, ''), /^③/],
    ];
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w357h-mut-')), sc = [];
    try {
      for (const [nm, Hm, re] of MUT) {
        if (Hm === H) { why.push('⑤ 変異「' + nm + '」の種が無い'); sc.push(nm + ' 空振り'); continue; }
        const f = path.join(tmp, 'm.html'); fs.writeFileSync(f, Hm);
        const ma = loadApp(f);
        const hit = judgeHints(hintCases(ma, root).map((c) => hintOne(ma, c)), null, Hm).why.some((w) => re.test(w));
        if (!hit) why.push('⑤ 変異「' + nm + '」で落ちない');
        sc.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
      }
    } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* */ } }
    cases.push('⑤ 変異 ' + MUT.length + ': ' + sc.join(' / '));
  }
  return { why, cases };
}

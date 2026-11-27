// 第357便c(統括の検証項目 R524・AI_SPEC §416): AI のタブを対話式が先にした版の検査の lib。
//   judgeChatStatic —— html・README・入口のページの字を読む純関数(QA ai.chatButtons357c の静的な部分と、その変異の自己試験)
//   runIntakeText   —— 取り込みの画面の文 3 つの前と後(QA behavior.intakeText357c)。対象 html を tests/lib-w355h-aichat-validate.mjs の
//                      loadApp で vm に読み、アプリの本文の関数(aiPasteRun(false)・aiIntakeText・stabilizePreset・HP の読み口)をそのまま呼ぶ。
//                      **検査の規則は文の在り無しと値の同一だけ** —— 受理の判定はアプリの関数のまま。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadApp, checkText } from './lib-w355h-aichat-validate.mjs';

export const LIB_VERSION = 'w357c-chatbuttons-lib-2';   // 統合の後の直し: 並びに aiChatUnread(リンクの後ろ・貼付欄の前)
export const CHAT_URL = 'https://tty-imamura.github.io/dfm-simulator/docs/AI_CHAT.md';
export const README_HEAD = '## AI チャットと対話しながら使う';
export const README_EN_LEAD = 'English (the text copied when the app is in English):';
export const CHAT_EN_LEAD = 'To start in English, paste this into the AI chat';
// 新しい画面の文の鍵(ja/en の対 —— I18N に 2 回ずつ)
export const KEYS = ['aiChatHead', 'aiChatNote', 'btnChatCopy', 'aiChatLink', 'aiChatPrompt', 'btnResultCopy', 'aiResHeadNg', 'aiResHeadCheck', 'aiResHeadOk',
  'aiResFixes', 'aiResChanges', 'aiResNoChange', 'stabNoChangeCheck', 'stabCapRow', 'pasteInBlock', 'pasteEndCut'];
// 画面の上から順に在るべき id(AI のタブ)
export const ORDER = ['aiChatHead', 'aiChatNote', 'btnChatCopy', 'aiChatLink', 'aiChatUnread', 'aiPasteArea', 'aiKeplerFix', 'btnAiPaste', 'btnAiPasteCheck', 'aiStatus', 'aiPasteReport', 'btnResultCopy',
  'aiGenHead', 'aiBasePreset', 'aiPrompt', 'aiRealNote', 'aiExtTitle', 'btnExtCopy', 'btnExtCopyShort', 'aiExtWrap', 'aiListHead'];

// 見出しの行 head の後ろの最初の ```text のコードブロックの中身(無ければ null)
export function blockAfter(text, head, from = 0) {
  const i = String(text).indexOf(head, from);
  if (i < 0) return null;
  const m = /\n```[a-z]*\n([\s\S]*?)\n```/.exec(String(text).slice(i));
  return m ? m[1] : null;
}
// I18N の鍵 key の文字列の値(現れる順 —— ja が先・en が後)
export function i18nStrings(html, key) {
  const re = new RegExp('\\n  ' + key + ':("(?:[^"\\\\\\n]|\\\\.)*")', 'g');
  return [...String(html).matchAll(re)].map((m) => { try { return JSON.parse(m[1]); } catch (e) { return null; } });
}

export function judgeChatStatic(html, readme, chat) {
  const why = [], fx = {};
  const H = String(html), R = String(readme), C = String(chat);
  // ① プロンプトの字(README の節の ja・en と、アプリの I18N の aiChatPrompt)
  const sec = R.indexOf(README_HEAD), secEnd = sec >= 0 ? R.indexOf('\n## ', sec + 5) : -1;
  const RS = sec >= 0 ? R.slice(sec, secEnd >= 0 ? secEnd : R.length) : '';
  const rJa = blockAfter(RS, README_HEAD), rEn = blockAfter(RS, README_EN_LEAD), cEn = blockAfter(C, CHAT_EN_LEAD);
  const ap = i18nStrings(H, 'aiChatPrompt');
  fx.nPrompt = ap.length;
  if (rJa === null) why.push('① README の節に日本語のプロンプトが無い');
  if (rEn === null) why.push('① README の節に英語のプロンプトが無い');
  if (cEn === null) why.push('① 入口のページに英語のプロンプトが無い');
  if (ap.length !== 2) why.push('① I18N の aiChatPrompt が ja/en の 2 つでない(' + ap.length + ')');
  else {
    if (ap[0] !== rJa) why.push('① アプリの日本語のプロンプトが README の節の字と違う');
    if (ap[1] !== rEn) why.push('① アプリの英語のプロンプトが README の節の字と違う');
  }
  if (rEn !== null && cEn !== null && rEn !== cEn) why.push('① 英語のプロンプトが README と入口のページで違う');
  for (const [nm, t] of [['日本語', rJa], ['英語', rEn]]) if (t !== null && t.indexOf(CHAT_URL) < 0) why.push('① ' + nm + 'のプロンプトに入口のページのアドレスが無い');
  // ② 入口のページを開くリンク(アドレスは文書の字と同じ・新しいタブ・noopener)と、アプリの定数
  const a = /<a id="aiChatLink" href="([^"]*)" target="([^"]*)" rel="([^"]*)">/.exec(H);
  if (!a) why.push('② 入口のページを開くリンク #aiChatLink(href・target・rel)が無い');
  else {
    if (a[1] !== CHAT_URL) why.push('② リンクのアドレスが文書の字と違う: ' + a[1]);
    if (a[2] !== '_blank') why.push('② リンクが新しいタブでない');
    if (!/\bnoopener\b/.test(a[3])) why.push('② リンクに rel=noopener が無い');
  }
  const cu = /\nconst AI_CHAT_URL="([^"]*)";/.exec(H);
  if (!(cu && cu[1] === CHAT_URL)) why.push('② アプリの定数 AI_CHAT_URL が文書の字と違う');
  // ③ 並び(対話式が先)
  const P0 = H.indexOf('id="page-ai"');
  const idx = ORDER.map((id) => H.indexOf('id="' + id + '"', P0));
  fx.order = idx;
  const miss = ORDER.filter((id, k) => idx[k] < 0);
  if (P0 < 0 || miss.length) why.push('③ AI のタブに id が無い: ' + miss.join(' '));
  else for (let k = 1; k < idx.length; k++) if (!(idx[k - 1] < idx[k])) { why.push('③ 並びが違う: ' + ORDER[k - 1] + ' が ' + ORDER[k] + ' より後'); break; }
  if (!/<button class="btn" id="btnResultCopy" disabled>/.test(H)) why.push('③ 「この結果をAIに伝える文をコピー」が最初から押せない形(disabled)でない');
  // ④ 鍵の対・外へ取りに行く呼び出し 0
  fx.keys = KEYS.map((k) => (H.match(new RegExp('\\n  ' + k + ':', 'g')) || []).length);
  const odd = KEYS.filter((k, j) => fx.keys[j] !== 2);
  if (odd.length) why.push('④ I18N の鍵が ja/en の対でない: ' + odd.join(' '));
  fx.net = (H.match(/\bfetch\s*\(|\bXMLHttpRequest\b|\bsendBeacon\s*\(/g) || []).length;
  if (fx.net) why.push('④ 外へ取りに行く呼び出し ' + fx.net + ' 件');
  return { why, fx, prompts: { ja: rJa, en: rEn } };
}

// 変異の自己試験(静的な部分): 種が無ければ「空振り」
export function chatStaticMutants(html, readme, chat) {
  const H = String(html), R = String(readme), C = String(chat);
  const rJa = blockAfter(R, README_HEAD) || '';
  return [
    ['README のプロンプトの 1 字', H, R.replace(rJa, rJa.replace('案内役', '案内係')), C, /^①/],
    ['アプリの英語のプロンプトの 1 字', H.replace('  aiChatPrompt:"From now on, you will hold', '  aiChatPrompt:"From now on, you shall hold'), R, C, /^①/],
    ['リンクの noopener を外す', H.replace('target="_blank" rel="noopener">', 'target="_blank" rel="">'), R, C, /^②/],
    ['生成用のコピーを先頭へ', H.replace('<div class="group"><h3 id="aiChatHead">', '<i id="btnExtCopy"></i><div class="group"><h3 id="aiChatHead">'), R, C, /^③/],
    ['結果のコピーを最初から押せる形に', H.replace('id="btnResultCopy" disabled>', 'id="btnResultCopy">'), R, C, /^③/],
    ['英語の鍵を 1 つ落とす', H.replace('\n  aiResNoChange:"What was changed: nothing",', ''), R, C, /^④/],
    ['入口のページを取りに行く', H.replace('\nconst AI_CHAT_URL=', '\nconst w357cMut=()=>fetch("x");\nconst AI_CHAT_URL='), R, C, /^④/],
  ].map(([nm, h, r, c, re]) => ({ nm, same: h === H && r === R && c === C, hit: judgeChatStatic(h, r, c).why.some((w) => re.test(w)) }));
}

// ---- behavior.intakeText357c ----
// 題: 内蔵の本の先頭(書き出しの形)を土台に、① 読めない JSON 2 つ(コードブロックの中の 4 行目の鍵の引用符を外す・途中で切れる)
//   ② 粒子の数の上限(disk 5000 × 2)③ 取り込まない(name 欠け・G が文字列)と、検証が通る(取り込まない)
const fence = (t, pre = 'こちらが設定です。', post = '以上です。') => `${pre}\n\n\`\`\`json\n${t}\n\`\`\`\n\n${post}`;
export function intakeCases(app) {
  const p0 = JSON.parse(app.H.evalExpr('JSON.stringify(BUILTIN_PRESETS[0])'));
  const pretty = JSON.stringify(p0, null, 1).split('\n');
  const unq = pretty.slice(); unq[3] = unq[3].replace(/"([A-Za-z_]+)":/, '$1:');
  const cut = JSON.stringify(p0, null, 1).slice(0, 300);
  const disk = (cx) => ({ type: 'disk', n: 5000, cx, cy: 0, radius: 50, mMin: 0.01, mMax: 0.01, spinMin: 0, spinMax: 0, vMode: 'kepler', aroundMass: 100, vScale: 1, direction: 1 });
  const cap = { name: 'cap357c', description: 'cap', emoji: '🧪', camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: { G: 1 },
    bodies: [{ type: 'single', m: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }, disk(-100), disk(100)] };
  const bad = JSON.parse(JSON.stringify(p0)); delete bad.name; bad.physics = Object.assign({}, bad.physics, { G: 'strong' });
  return [
    { id: 'i1-unquoted-key', text: fence(unq.join('\n')) },
    { id: 'i2-cut-off', text: `こちらです。\n\n\`\`\`json\n${cut}` },
    { id: 'i3-cap', text: fence(JSON.stringify(cap)), obj: cap, direct: false },   // 値は前の版と比べる(じかの呼び出しは i5 で —— 時間のため)
    { id: 'i4-rejected', text: fence(JSON.stringify(bad, null, 1)) },
    { id: 'i5-valid', text: fence(JSON.stringify(p0, null, 1)), obj: p0 },
  ];
}
const lines = (res) => res.screen.blocks.flatMap((b) => [b.head].concat(b.lines));
// 試走は 1 步(受理の後の試走はこの検査の題ではない —— 自己診断はアプリの取り込みの中で走る)。上限の題(粒子 600)は自己診断だけで約 10 s
export function intakeOne(app, c) {
  const res = checkText(app, c.text, { steps: 1 });
  const ev = app.H.evalExpr;
  const msg = (() => { try { return ev('typeof HP!=="undefined" && HP.aiResultMsgNow357c ? HP.aiResultMsgNow357c() : null'); } catch (e) { return null; } })();
  let direct = null;
  if (c.obj && c.direct !== false) { app.H.ctx.__w357c_o = JSON.parse(JSON.stringify(c.obj)); direct = JSON.parse(ev('JSON.stringify((function(){ const r=stabilizePreset(__w357c_o,{kepler:true}); return r.ok? r.preset : null; })())')); }
  return { id: c.id, exit: res.exit, error: res.parse.error, lines: lines(res), preset: res.preset, direct, msg };
}
// 判定(後の版): 題ごとの文。before が在れば前の版の文と値も見る
export function judgeIntake(now, before, T) {
  const why = [], cases = [];
  const by = (arr, id) => arr && arr.find((x) => x.id === id);
  const has = (r, s) => r.lines.some((l) => l.indexOf(s) >= 0);
  const n1 = by(now, 'i1-unquoted-key'), n2 = by(now, 'i2-cut-off'), n3 = by(now, 'i3-cap'), n4 = by(now, 'i4-rejected'), n5 = by(now, 'i5-valid');
  // ① 読めない JSON の位置(コードブロックの中の行と列・その辺りの字)
  if (!(n1.exit === 3 && /^コードブロックの中の 4行 \d+列目の "/.test(n1.error || '') && /— …/.test(n1.error || ''))) why.push('① コードブロックの中の 4 行目の位置と抜き出しが文に無い: ' + String(n1.error).slice(0, 80));
  if (!(n2.exit === 3 && /^コードブロックの中の \d+行 \d+列目\(最後\)で JSON が終わっています/.test(n2.error || ''))) why.push('① 途中で切れた JSON の文が無い: ' + String(n2.error).slice(0, 80));
  cases.push('① ' + String(n1.error).slice(0, 26) + '… / ' + String(n2.error).slice(0, 30) + '…');
  // ② 上限で減らした数が「変更した点」に
  const capLine = n3.lines.find((l) => /bodies\[1\]・bodies\[2\]\(disk\) の粒子の数 n: 5000 → 299/.test(l));
  if (!(n3.exit === 0 && capLine)) why.push('② 上限で減らした数(5000 → 299)が変更点に無い');
  cases.push('② ' + (capLine ? capLine.slice(0, 44) : '(無い)'));
  // ③ 取り込まなかったとき・検証のみのときに「そのまま取り込みました」を出さない
  if (has(n4, T.stabNoChange)) why.push('③ 取り込まなかったのに「' + T.stabNoChange + '」が出る');
  if (has(n5, T.stabNoChange) || !has(n5, T.stabNoChangeCheck)) why.push('③ 検証のみで「' + T.stabNoChangeCheck + '」でない');
  cases.push(`③ 取り込まない題に「そのまま取り込みました」${has(n4, T.stabNoChange) ? 'あり' : 'なし'}・検証のみ「${has(n5, T.stabNoChangeCheck) ? T.stabNoChangeCheck : '?'}」`);
  // ④ 伝える文(拒否の理由は画面の × の行のまま・retryFixMsg)
  const xl = n4.lines.filter((l) => l.startsWith('× '));
  if (!(n4.msg && n4.msg.startsWith(T.aiResHeadNg) && xl.length >= 2 && xl.every((l) => n4.msg.indexOf(l) >= 0) && n4.msg.indexOf(T.retry) >= 0)) why.push('④ 取り込まなかった題の伝える文に、見出し・× の行・retryFixMsg が無い');
  if (!(n5.msg && n5.msg.startsWith(T.aiResHeadCheck))) why.push('④ 検証のみの題の伝える文の見出し');
  if (!(n3.msg && capLine && n3.msg.indexOf(capLine.replace(/^・/, '')) >= 0)) why.push('④ 上限の題の伝える文に変更した点が無い');
  cases.push(`④ 伝える文 ${[n4, n5, n3].map((r) => (r.msg || '').split('\n').length + ' 行').join('・')}`);
  // ⑤ 取り込む値は同じ(アプリの stabilizePreset をじかに呼んだ値・前の版の値)
  if (!(n5.preset && JSON.stringify(n5.preset) === JSON.stringify(n5.direct))) why.push('⑤ ' + n5.id + ' の取り込む値が stabilizePreset のじかの値と違う');
  if (!(n3.preset && n3.preset.bodies.filter((b) => b.type === 'disk').every((b) => b.n === 299))) why.push('⑤ 上限の題の取り込む値(disk の n = 299)');
  if (before) {
    const b1 = by(before, 'i1-unquoted-key'), b3 = by(before, 'i3-cap'), b4 = by(before, 'i4-rejected'), b5 = by(before, 'i5-valid');
    for (const [n, b] of [[n3, b3], [n5, b5]]) if (JSON.stringify(n.preset) !== JSON.stringify(b.preset)) why.push('⑤ ' + n.id + ' の取り込む値が前の版と違う');
    for (const id of ['i1-unquoted-key', 'i2-cut-off', 'i4-rejected']) if (by(now, id).exit !== by(before, id).exit) why.push('⑤ ' + id + ' の判定が前の版と違う');
    // 前の版では 3 つの文が無かった(題が効いていること)
    const pre = [/^コードブロックの中の/.test(b1.error || ''), b3.lines.some((l) => /5000 → 299/.test(l)), !b4.lines.some((l) => l.indexOf(T.stabNoChange) >= 0)];
    if (pre.some((x) => x)) why.push('⑥ 前の版でも同じ文が出る(題が効いていない): ' + pre.join(','));
    cases.push(`⑤ 取り込む値: 前の版と同じ(2 題)・判定も同じ(3 題)/⑥ 前の版の文: 位置 ${pre[0] ? 'あり' : 'なし'}・上限 ${pre[1] ? 'あり' : 'なし'}・拒否で「そのまま」${pre[2] ? 'なし' : 'あり'}`);
  } else cases.push('⑤ 取り込む値: 内蔵の本の題は stabilizePreset のじかの値と同じ・上限の題は disk の n = 299 —— 前の版の html が無い所では、前の版との比べは省く');
  return { why, cases };
}
// 走査 intakeJsonErrAt の表(読める = −1 は JSON.parse と同じか)
export const ERRAT_TABLE = ['{}', '[]', '{"a":1}', '[1,2,3]', '{"a":[1,{"b":null}],"c":"x\\ny"}', ' {"a" : -1.5e-3 } ', '"s"', 'true', '0', '-0.5',
  '{', '{"a":1,}', '{a:1}', '[1 2]', '{"a":01}', '"\\x"', '{"a":"b"', 'tru', '{"a":1}}', '', '  ', '-', '1.', '{"a":"\u0001"}', '[,1]', '{"a"1}', '{"a":1 "b":2}'];
export function errAtTable(app) {
  const bad = [];
  for (const s of ERRAT_TABLE) {
    app.H.ctx.__w357c_s = s;
    const at = app.H.evalExpr('HP.intakeJsonErrAt357c(__w357c_s)');
    let ok = true; try { JSON.parse(s); } catch (e) { ok = false; }
    const want = ok ? -1 : 'err';   // 読める ⇔ −1(JSON.parse と同じ)
    if (want === -1 ? at !== -1 : !(at >= 0 && at <= s.length)) bad.push(JSON.stringify(s) + '→' + at);
  }
  return bad;
}

export function runIntakeText(target, base, opts = {}) {
  const why = [], cases = [];
  const app = loadApp(target);
  if (app.missing.length) return { why: ['アプリの関数が無い: ' + app.missing.join(',')], cases };
  const ev = app.H.evalExpr;
  const T = { stabNoChange: ev('T("stabNoChange")'), stabNoChangeCheck: ev('T("stabNoChangeCheck")'), aiResHeadNg: ev('T("aiResHeadNg")'), aiResHeadCheck: ev('T("aiResHeadCheck")'), retry: ev('T("retryFixMsg")("")').slice(0, 12) };
  const now = intakeCases(app).map((c) => intakeOne(app, c));
  let before = null;
  if (base && fs.existsSync(base)) { const bapp = loadApp(base); if (!bapp.missing.length) before = intakeCases(bapp).map((c) => intakeOne(bapp, c)); }
  const J = judgeIntake(now, before, T);
  why.push(...J.why); cases.push(...J.cases);
  const et = errAtTable(app);
  if (et.length) why.push('⑦ 走査の表が JSON.parse と違う: ' + et.slice(0, 4).join(' '));
  cases.push(`⑦ 走査の表 ${ERRAT_TABLE.length} 通り(違い ${et.length})`);
  // ⑧ 変異: 文の直しを 1 つずつ戻した html を読ませると落ちる
  if (opts.mutate !== false) {
    const H = fs.readFileSync(target, 'utf8');
    const MUT = [
      ['位置の文を前に戻す', H.replace('error:intakeParseWhere(text, t1, e1||e0), fixes};', 'error:jsonPosInfo(t1, e1||e0), fixes};'), /^①/, ['i1-unquoted-key', 'i2-cut-off']],
      ['上限の行を外す', H.replace('if(cr.length) out.capRows=cr;', 'void cr;'), /^②/, ['i3-cap']],
      ['拒否でも「そのまま」を出す', H.replace('else if(mode!=="rejected") obsReportBlock', 'else obsReportBlock'), /^③/, ['i4-rejected', 'i5-valid']],
    ];
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'w357c-mut-'));
    const sc = [];
    try {
      for (const [nm, Hm, re, ids] of MUT) {
        if (Hm === H) { why.push('⑧ 変異「' + nm + '」の種が無い'); sc.push(nm + ' 空振り'); continue; }
        const f = path.join(tmp, 'm.html'); fs.writeFileSync(f, Hm);
        const ma = loadApp(f);
        // 変異で効く題だけ走らせ、ほかの題は今の版の結果を入れる(時間のため)
        const mr = intakeCases(ma).map((c) => (ids.includes(c.id) ? intakeOne(ma, c) : now.find((x) => x.id === c.id)));
        const hit = judgeIntake(mr, null, T).why.some((w) => re.test(w));
        if (!hit) why.push('⑧ 変異「' + nm + '」で落ちない');
        sc.push(nm + ' → ' + (hit ? '落ちる' : '落ちない'));
      }
    } finally { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) { /* */ } }
    cases.push('⑧ 変異 ' + MUT.length + ': ' + sc.join(' / '));
  }
  return { why, cases, now, before };
}

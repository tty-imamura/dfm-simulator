// 第355便h(統括の検証項目 R511・AI_SPEC §403): 対話の入口のページの守りの検査(QA docs.aichat355h)の本体 —— 純関数(ファイルを読まない)。
// 呼び手(qa.mjs)がファイルの字と docs/ のファイル名の集合を渡す。変異の自己試験も同じ関数に渡す。
// 写しの検査は、道具 tools/aispec-core.mjs とは別に書いた切り方で比べる(同じ式の写しを 2 か所に持たない —— 道具が壊れても検査は残る)。

export const DOC_LIB_VERSION = 'w355h-aichatdoc-lib-1';
export const STANCE = '現実の宇宙を記述するとは主張しません';
export const API_LINE = 'アプリの中の生成(API キーを入れる方式)は、廃止の予定です。対話式をお使いください。';
export const PAGES = 'https://tty-imamura.github.io/dfm-simulator/docs/';
export const RAW = 'https://raw.githubusercontent.com/tty-imamura/dfm-simulator/main/docs/';
export const CORE_MAX = 60000;
// 高校生向けの解説で戻してはいけない、いまの書き方の決まりより前の言い方
export const OLD_JA = ['ダークマターなしで平坦になります', '同時に数値まで一致', 'オンにしたときだけ再現します', '強い引きずりで再現', '弱場で数値一致', '機械QA(300項目超)', '同じ水準に較正してあります'];
export const OLD_EN = ['flattens with no dark matter', 'all match simultaneously', 'reproduces it.', 'weak-field match', '(300+ items)', 'Calibrated to the same level'];
// 本節(PHYSICS〔第355便h〕)と AI_SPEC §403 に書かない語(共通の決まり —— 引用の中でも)
export const BANNED_SEC = ['再現した', '再現しない', '私信', '添付', '審査', '合わせられない', '普遍定数', '収束した', '法則を発見した', 'フィットした', '較正した', '完全に一致',
  '合った', '決まった', '導けた', '釣り合った', '確かめた', '示した', '説明できた', 'ロックした', '直った', '対応した', '通るようになった',
  'Claude', 'Sonnet', 'Opus', 'Haiku', 'GPT', 'Gemini', 'Grok', 'OpenAI', 'Anthropic'];
const BAN_USER = [/第\s*[0-9０-９]+\s*便/, /決断事項/];

// 見出しの行 head の直後の最初のコードブロックの中身(無ければ null)
export function codeAfter(text, head) {
  const i = String(text).indexOf(head);
  if (i < 0) return null;
  const m = /\n```[a-z]*\n([\s\S]*?)\n```/.exec(String(text).slice(i));
  return m ? m[1] : null;
}
// 「# 6.」の行(章の見出し)の前まで —— 行ごとに読む
export function headBefore6(spec) {
  const L = String(spec).split('\n');
  let off = 0;
  for (const l of L) { if (l.startsWith('# 6.') || l.startsWith('## 6. ')) return String(spec).slice(0, off); off += l.length + 1; }
  return null;
}
// ページが指す docs のファイル名(`docs/X.md`・`X.md` の形・リンクの …/docs/X.md の形)
export function docRefs(text) {
  const s = new Set();
  for (const m of String(text).matchAll(/docs\/([A-Za-z0-9_]+\.md)/g)) s.add(m[1]);
  for (const m of String(text).matchAll(/`([A-Z][A-Za-z0-9_]*\.md)`/g)) s.add(m[1]);
  return [...s].sort();
}

export function checkAiChat(F) {
  const bad = [], cases = [];
  const chat = F.chat || '', readme = F.readme || '';
  // ① 入口のページ
  if (!(chat.length > 2000 && /^# .*AI チャットとの対話の入口/.test(chat))) bad.push('① 入口のページ docs/AI_CHAT.md が無いか見出しが違う');
  // ② 立場の文
  if (chat.indexOf(STANCE) < 0) bad.push('② 立場の文「' + STANCE + '」が無い');
  // ③ 指すファイル
  const refs = docRefs(chat), miss = refs.filter((n) => !F.docsExist.has(n));
  if (refs.length < 7) bad.push('③ 指す docs のファイルが読めない(' + refs.length + ')');
  if (miss.length) bad.push('③ 指す docs のファイルが無い: ' + miss.join(', '));
  cases.push(`③ 指すファイル ${refs.length} 本(${refs.join('・')})`);
  // ⑤ プロンプト(README と入口のページの頭)
  const sec = readme.indexOf('## AI チャットと対話しながら使う');
  const pr = codeAfter(readme, '## AI チャットと対話しながら使う'), pc = codeAfter(chat, '## 人が使うとき');
  if (sec < 0 || pr === null) bad.push('⑤ README の節「AI チャットと対話しながら使う」のプロンプトが無い');
  if (pc === null) bad.push('⑤ 入口のページの「人が使うとき」のプロンプトが無い');
  if (pr !== null && pc !== null && pr !== pc) bad.push('⑤ README のプロンプトと入口のページの頭のプロンプトが違う');
  const P = pc || pr || '';
  for (const u of [PAGES + 'AI_CHAT.md', PAGES + 'AI_SPEC_CORE.md', RAW]) if (P.indexOf(u) < 0) bad.push('⑤ プロンプトにリンク ' + u + ' が無い');
  if (/docs\/AI_SPEC\.md|blob\/main/.test(P)) bad.push('⑤ プロンプトが全体の仕様のページか blob の形を指す');
  cases.push(`⑤ プロンプト ${[...P].length} 字(README と入口のページで同じ・主のリンク 2・生の文の形)`);
  // ④ 書かない語(入口のページ・プロンプト・README の節)
  const readmeSec = sec >= 0 ? readme.slice(sec, (readme.indexOf('\n## ', sec + 5) + 1 || readme.length + 1) - 1) : '';
  for (const [nm, t] of [['入口のページ', chat], ['プロンプト', P], ['README の節', readmeSec]]) for (const re of BAN_USER) if (re.test(t)) bad.push('④ ' + nm + 'に ' + re.source);
  // API 方式の廃止の予定の 1 行
  if (chat.indexOf(API_LINE) < 0 || chat.indexOf(API_LINE) > chat.indexOf('## 1.')) bad.push('廃止の予定の 1 行が入口のページの頭に無い');
  if (readmeSec.indexOf(API_LINE) < 0) bad.push('廃止の予定の 1 行が README の節に無い');
  // ⑥⑦⑧ 短いページ
  const spec = F.spec || '', core = F.core || '';
  if (!/\n## 5\. The preset specification/.test(spec)) bad.push('⑦ AI_SPEC.md に見出し「## 5. The preset specification」が無い');
  if (!/\n## 6\./.test(spec)) bad.push('⑦ AI_SPEC.md に見出し「## 6.」が無い');
  const head = headBefore6(spec), CL = core.split('\n');
  if (head === null) bad.push('⑥ AI_SPEC.md の「# 6.」の行が見つからない');
  else if (!(CL.length > 3 && CL[0].startsWith('> ') && CL[0].indexOf('写し') >= 0 && CL[1].startsWith('> ') && CL[1].indexOf('AI_SPEC.md') >= 0 && CL[2] === '' && CL.slice(3).join('\n') === head))
    bad.push('⑥ AI_SPEC_CORE.md が「頭 2 行 + 空行 + AI_SPEC.md の頭」でない(node tools/aispec-core.mjs --write)');
  if (!([...core].length > 0 && [...core].length < CORE_MAX)) bad.push('⑧ AI_SPEC_CORE.md が 6 万字より短くない(' + [...core].length + ')');
  cases.push(`⑥ 短いページ ${[...core].length} 字 = 頭 2 行 + AI_SPEC.md の頭 ${head === null ? '?' : [...head].length} 字`);
  // 高校生向けの解説
  for (const w of OLD_JA) if ((F.explJa || '').indexOf(w) >= 0) bad.push('解説(日本語)に古い言い方「' + w + '」');
  for (const w of OLD_EN) if ((F.explEn || '').indexOf(w) >= 0) bad.push('解説(英語)に古い言い方「' + w + '」');
  for (const w of ['段階は「一部」', '±1% の窓の内', '二体の 1PN の式の値']) if ((F.explJa || '').indexOf(w) < 0) bad.push('解説(日本語)に「' + w + '」が無い');
  // 夜の CI の段(情報のみ)
  const ny = F.nightly || '', iD = ny.indexOf('tests/ci-pages-docs.sh'), iJ = ny.indexOf('判定(取得できた不一致だけを FAIL にする)');
  if (!(iD >= 0 && iJ > iD && /ci-pages-docs\.sh[^\n]*\n\s*continue-on-error: true/.test(ny) && /\n\s+docs-pages\.jsonl\n/.test(ny))) bad.push('夜の CI に文書のページの記録の段(判定の前・continue-on-error・artifact)が無い');
  // 本節・§403・post-merge
  const PH = F.physics || '', a = PH.indexOf('\n〔第355便h — '), b = PH.indexOf('\n〔第328便 — 統括'), p354 = PH.indexOf('\n〔第354便a — ');
  if (!(a >= 0 && p354 >= 0 && p354 < a && a < b)) bad.push('PHYSICS〔第355便h〕の位置(〔第354便a〕より後・〔第328便 — 統括〕より前)');
  const S = a >= 0 && b > a ? PH.slice(a, b) : '';
  for (const w of ['R511', 'docs.aichat355h', 'behavior.aichatIntake355h', '試していないこと', '別のモデル', 'AI_SPEC_URL', '1 byte も変えていない']) if (S.indexOf(w) < 0) bad.push('PHYSICS〔第355便h〕に「' + w + '」が無い');
  const AS = F.aispec || '', a403 = AS.indexOf('\n## 403. 第355便h'), a395 = AS.indexOf('\n## 395. ');
  const S403 = a403 >= 0 ? AS.slice(a403, (AS.indexOf('\n## ', a403 + 5) + 1 || AS.length + 1) - 1) : '';
  if (!(a403 > a395 && a395 >= 0)) bad.push('AI_SPEC §403(§395 の後)が無い');
  for (const w of ['R511', 'SYSTEM_PROMPT には載せない', 'docs/AI_SPEC_CORE.md', 'docs.aichat355h', 'behavior.aichatIntake355h']) if (S403.indexOf(w) < 0) bad.push('AI_SPEC §403 に「' + w + '」が無い');
  for (const [nm, t] of [['PHYSICS〔第355便h〕', S], ['AI_SPEC §403', S403]]) for (const w of BANNED_SEC) if (t.indexOf(w) >= 0) bad.push('書かない語「' + w + '」が ' + nm + ' に在る');
  const pm = F.postmerge || '', q1 = pm.indexOf('# ==== 第355便h の塊(ここから)===='), q0 = pm.indexOf('# ==== 第354便a の塊(ここまで)====');
  if (!(q0 >= 0 && q1 > q0 && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.aichat355h behavior\.aichatIntake355h"/.test(pm))) bad.push('post-merge に第355便h の塊(第354便a の塊の後)が無い');
  cases.push(`本節 ${[...S].length} 字・§403 ${[...S403].length} 字・post-merge の塊`);
  return { bad, cases };
}

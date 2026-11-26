// 第356便g(統括の検証項目 R519・AI_SPEC §411): 文書の直しの守りの検査(QA docs.docfix356g)の本体 —— 純関数(ファイルを読まない)。
// 呼び手(qa.mjs)がファイルの字を渡す。変異の自己試験も同じ関数に渡す。
// ① 高校生向けの解説(日本語・英語)の水星の項 —— 古い言い方(E12 の拡張をオンにしたときだけ出る)が無い・現象の状況一覧の P01 の字と、
//    サンプルの状況の 🌡️ `mercurySunInertial3d`・☿ `mercury` の行の字が、解説の項に同じ字で在る(一覧の字を写す —— 解説の側で字を足さない)・
//    本で公転を作った量と、追加の近点の移動を分けて書く・結果を言う語が無い。
// ② CI の時間の上限の注 —— PHYSICS〔第356便g〕の訂正の鎖の表(前の字 → 正しい読み)と、ci.yml の qa ジョブ(root と beta の matrix・job の上限)の実物。
// ③ 🔥 の内蔵の本 gas の「達」の読み —— サンプルの状況の「読み方」の「達」の字と gas の行の目的・状況の字を節に逐語。
// ④ 節の位置・AI_SPEC §411・post-merge の塊・書かない語。本節 = PHYSICS の「〔第356便g — 」の行から、次の節の見出し(行頭の「〔第」)の前まで(版 2 から —— 版 1 は第328便の統括の節の前までを本節と読み、後の便の節の字を本節の書かない語と読んでいた)。

export const DOC_LIB_VERSION = 'w356g-docfix-lib-2';   // 第357便(統合の後の直し): 1 → 2(本節の範囲を次の節の見出しまでに)

// 解説で戻してはいけない言い方(第356便g で置き換えた字 —— 第355便h の一覧〔tests/lib-w355h-aichatdoc.mjs の OLD_JA・OLD_EN〕に足す分)
export const OLD_JA = ['オンにしたときだけ出ます', 'オンにしたときだけ再現します', '基本ルールのままでは**水星の近日点移動(100年で43秒角)は出ません**。時計の式'];
export const OLD_EN = [/Only\s+the explicit E12 geodesic extension/, /\bproduces it;/, /\breproduces it\b/];
// 解説の水星の項に書かない語(結果を言う語)
export const BAN_EXPL_JA = ['説明できた', '説明できます', '再現します', '再現した', '一致します', '合いました', '確かめました'];
export const BAN_EXPL_EN = [/\bexplain(?:s|ed)?\b/i, /\breproduc/i, /\bmatch(?:es)?\b/i, /\bmatched (?:the|to|it)\b/i, /\bconfirm/i];

// 現象の状況一覧の P01 の字(解説の項に同じ字で在るもの —— 一覧の側にも在ることを照らす)
export const P01_TOKENS_JA = ['`mercurySunInertial3d`', '`physics.relativeDrag`', '`physics.gLoc`', 'R_d = Y_k m', 'G_loc の分 −28.65″/世紀', 'K1 の引きずりの分 +71.63″/世紀',
  '42.98″/世紀', '42.98051″/世紀', '観測ではない', '規則で置いた値', '独立の予言', '2.618e-5″/世紀', '1.000e-3'];
// 英語の解説の項に在る数と鍵(一覧の数と同じ字)
export const P01_TOKENS_EN = ['`mercurySunInertial3d`', '`physics.relativeDrag`', '`physics.gLoc`', 'R_d = Y_k m', '−28.65″/century', '+71.63″/century', '42.98″/century',
  '42.98051″/century', 'not an observation', 'set by a rule', 'independent', '2.618e-5″/century', '1.000e-3″/century'];

// 項を切り出す(日本語: 「- ⚠️ 水星は」から次の「### 」の前まで・英語: 「- ⚠️ For Mercury」から次の「### 」の前まで)
export function mercuryItem(text, head) {
  const t = String(text || ''), i = t.indexOf(head);
  if (i < 0) return '';
  const j = t.indexOf('\n### ', i);
  return t.slice(i, j > i ? j : undefined);
}
// 一覧の要約の表の行(| P01 | … |)の欄
export function phenRow(phen, id) {
  const m = new RegExp('^\\| ' + id + ' \\|([^\\n]*)\\|$', 'm').exec(String(phen || ''));
  return m ? m[1].split(' | ').map((s) => s.trim()) : null;
}
// 一覧の節(### P01 …)の本文
export function phenSec(phen, id) {
  const t = String(phen || ''), i = t.indexOf('\n### ' + id + ' ');
  if (i < 0) return '';
  const j = t.indexOf('\n### ', i + 5);
  return t.slice(i, j > i ? j : undefined);
}
// サンプルの状況の行(| 絵 | `id` | 名 | 目的 | 状況 | …)—— 目的と状況の欄
export function statusRow(status, id) {
  const m = new RegExp('^\\| [^|]+ \\| `' + id + '` \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\|', 'm').exec(String(status || ''));
  return m ? { name: m[1].trim(), purpose: m[2].trim(), state: m[3].trim() } : null;
}
// サンプルの状況の「読み方」の「達」の定義の字(「**達** = 」から「。」まで)
export function tatsuDef(status) {
  const t = String(status || ''), i = t.indexOf('**達** = ');
  if (i < 0) return '';
  const j = t.indexOf('。', i);
  return j > i ? t.slice(i + '**達** = '.length, j) : '';
}
// 状況の欄から「達・」を外した字と、「(根拠: …)」を外した字
export function stateBody(state) {
  return String(state || '').replace(/^(?:達|部分|未達)・/, '').replace(/\(根拠: [^)]*\)$/, '').trim();
}

export const BANNED_SEC = ['再現した', '再現しない', '私信', '添付', '審査', '合わせられない', '普遍定数', '収束した', '法則を発見した', 'フィットした', '較正した', '完全に一致',
  '合った', '決まった', '導けた', '釣り合った', '確かめた', '示した', '説明できた', 'ロックした', '直った', '対応した', '通るようになった',
  'Claude', 'Sonnet', 'Opus', 'Haiku', 'GPT', 'Gemini', 'Grok', 'OpenAI', 'Anthropic', '第328便 — 統括'];

export function checkDocfix(F) {
  const bad = [], cases = [];
  const ja = String(F.explJa || ''), en = String(F.explEn || ''), phen = String(F.phen || ''), status = String(F.status || '');
  // ① 解説の水星の項
  for (const w of OLD_JA) if (ja.indexOf(w) >= 0) bad.push('① 解説(日本語)に古い言い方「' + w.slice(0, 24) + '」');
  for (const re of OLD_EN) if (re.test(en)) bad.push('① 解説(英語)に古い言い方 ' + re.source);
  const IJ = mercuryItem(ja, '- ⚠️ 水星は'), IE = mercuryItem(en, '- ⚠️ For Mercury');
  if (!IJ) bad.push('① 解説(日本語)に水星の項「- ⚠️ 水星は」が無い');
  if (!IE) bad.push('① 解説(英語)に水星の項「- ⚠️ For Mercury」が無い');
  const row = phenRow(phen, 'P01'), sec = phenSec(phen, 'P01');
  if (!(row && row.length >= 5)) bad.push('① 現象の状況一覧に P01 の行が無い');
  if (!sec) bad.push('① 現象の状況一覧に P01 の節が無い');
  if (row) {
    if (IJ.indexOf('段階は「' + row[1] + '」') < 0) bad.push('① 解説(日本語)の段階が一覧の P01 の段階「' + row[1] + '」と違う');
    if (row[4] && IJ.indexOf(row[4]) < 0) bad.push('① 解説(日本語)に一覧の P01 の主な本 ' + row[4] + ' が無い');
    if (row[1] === '門の内' && IE.indexOf('stage "inside the gate"') < 0) bad.push('① 解説(英語)の段階が一覧の P01 の段階と違う');
  }
  for (const w of P01_TOKENS_JA) {
    if (phen && phen.indexOf(w) < 0) bad.push('① 一覧の P01 に「' + w + '」が無い(解説の字の元)');
    if (IJ.indexOf(w) < 0) bad.push('① 解説(日本語)の水星の項に一覧の字「' + w + '」が無い');
  }
  for (const w of P01_TOKENS_EN) if (IE.indexOf(w) < 0) bad.push('① 解説(英語)の水星の項に「' + w + '」が無い');
  const r3 = statusRow(status, 'mercurySunInertial3d'), rm = statusRow(status, 'mercury');
  if (!(r3 && rm)) bad.push('① サンプルの状況に 🌡️ `mercurySunInertial3d` か ☿ `mercury` の行が無い');
  if (r3) { if (!/^達・/.test(r3.state)) bad.push('① サンプルの状況の 🌡️ が「達」でない(解説の段階の字を見直す)');
    if (IJ.indexOf('太陽と水星の三次元') < 0 || r3.purpose.indexOf('太陽と水星の三次元') < 0) bad.push('① 解説(日本語)とサンプルの状況の 🌡️ の目的に「太陽と水星の三次元」が無い'); }
  if (rm) { const b = stateBody(rm.state);
    if (IJ.indexOf(rm.purpose) < 0) bad.push('① 解説(日本語)に ☿ の目的の字「' + rm.purpose + '」が無い');
    if (IJ.indexOf(b.replace(/内$/, '')) < 0) bad.push('① 解説(日本語)に ☿ の状況の字「' + b + '」が無い'); }
  if (F.statusSrcEn && F.statusSrcEn.mercury) { const e = F.statusSrcEn.mercury;
    if (IE.indexOf(e.state) < 0) bad.push('① 解説(英語)に ☿ の状況の英語の字「' + e.state + '」が無い');
    if (IE.indexOf(e.purpose.replace(/^Compare /, 'compares ')) < 0) bad.push('① 解説(英語)に ☿ の目的の英語の字が無い'); }
  if (!(IJ.indexOf('本で公転を作った量') >= 0 && IJ.indexOf('追加の近点の移動をどこまで出したか') >= 0 && /\n {2}- 公転: /.test(IJ) && /\n {2}- 追加の近点の移動: /.test(IJ))) bad.push('① 解説(日本語)が公転と追加の近点の移動を分けていない');
  if (!(IE.indexOf('the orbit the sample builds') >= 0 && /\n {2}- The orbit: /.test(IE) && /\n {2}- The extra perihelion shift: /.test(IE))) bad.push('① 解説(英語)が公転と追加の近点の移動を分けていない');
  for (const w of BAN_EXPL_JA) if (IJ.indexOf(w) >= 0) bad.push('① 解説(日本語)の水星の項に書かない語「' + w + '」');
  for (const re of BAN_EXPL_EN) if (re.test(IE)) bad.push('① 解説(英語)の水星の項に書かない語 ' + re.source);
  if (/κ(?!_D)|\br_d\b|K_s/.test(IJ + IE)) bad.push('① 解説の水星の項に旧記号');
  cases.push(`① 解説の水星の項 日本語 ${[...IJ].length} 字・英語 ${[...IE].length} 字・一覧の字 ${P01_TOKENS_JA.length}/${P01_TOKENS_EN.length}・段階「${row ? row[1] : '?'}」・🌡️ ☿ の行`);
  // ② CI の時間の上限
  const PH = String(F.physics || ''), a = PH.indexOf('\n〔第356便g — '), z = PH.indexOf('\n〔第328便 — 統括'), p355i = PH.indexOf('\n〔第355便i — ');
  if (!(a >= 0 && p355i >= 0 && p355i < a && a < z)) bad.push('④ PHYSICS〔第356便g〕の位置(〔第355便i〕より後・第328便の統括の節より前)');
  // 本節は次の節の見出し(行頭の「〔第」)の前まで(位置の判定は上のまま —— 第328便の統括の節より前)
  const nx = a >= 0 ? PH.indexOf('\n〔第', a + 1) : -1;
  const S = a >= 0 && z > a ? PH.slice(a, nx >= 0 ? Math.min(z, nx) : z) : '';
  const ci = String(F.ci || '');
  const jq = ci.indexOf('\n  qa:\n'), jp = ci.indexOf('\n  perf:\n'), J = jq >= 0 ? ci.slice(jq, jp > jq ? jp : undefined) : '';
  const tm = /\n {4}timeout-minutes: (\d+)\n/.exec(J);
  const mx = /\n {4}strategy:\n[\s\S]*?matrix:\n[\s\S]*?- name: root\n\s+target: index\.html\n\s+- name: beta\n\s+target: beta\/index\.html/.test(J);
  if (!(tm && mx)) bad.push('② ci.yml の qa ジョブに job の上限と root・beta の matrix が無い(読みの元)');
  const lim = tm ? tm[1] : '?';
  const t0 = S.indexOf('| 所 | 前の字 | 正しい読み |');
  const T = t0 >= 0 ? S.slice(t0).split('\n\n')[0] : '';
  if (!T) bad.push('② 訂正の鎖の表「| 所 | 前の字 | 正しい読み |」が節に無い');
  for (const w of ['CI の beta の全部の検査の時間の上限を 180 分 → 240 分', 'root と beta', 'timeout-minutes: ' + lim, '両方', '120 → 180 分']) if (T.indexOf(w) < 0) bad.push('② 訂正の鎖の表に「' + w + '」が無い');
  if (F.changelog && String(F.changelog).indexOf('**CI の beta の全部の検査の時間の上限を 180 分 → 240 分**') < 0) bad.push('② CHANGELOG の第354便の字(前の字)が見つからない —— 表の前の字の元');
  cases.push(`② 訂正の鎖の表 ${T.split('\n').length - 2} 行・ci.yml の qa ジョブの上限 ${lim} 分(root・beta の matrix)`);
  // ③ gas の「達」
  const td = tatsuDef(status), rg = statusRow(status, 'gas');
  if (!td) bad.push('③ サンプルの状況の「読み方」に「達」の定義が無い');
  if (!rg) bad.push('③ サンプルの状況に 🔥 `gas` の行が無い');
  if (td && S.indexOf(td) < 0) bad.push('③ 節に「達」の定義の字が逐語で無い');
  if (rg) { if (S.indexOf(rg.purpose) < 0) bad.push('③ 節に gas の目的の字「' + rg.purpose + '」が無い');
    const b = stateBody(rg.state); if (S.indexOf(b) < 0) bad.push('③ 節に gas の状況の字「' + b + '」が無い');
    if (!/^達・/.test(rg.state)) bad.push('③ gas の状況が「達」でない(節の読みを見直す)'); }
  if (S.indexOf('理想気体の状態方程式に近づけた、の意味ではない') < 0) bad.push('③ 節に gas の「達」の読みの文が無い');
  cases.push(`③ 「達」の定義 ${[...td].length} 字・gas の目的と状況`);
  // ④ 節・§411・post-merge・書かない語
  for (const w of ['R519', 'docs.docfix356g', 'tests/lib-w356g-docfix.mjs', '1 byte も変えていない', '`docs/SAMPLE_STATUS.md` は生成物']) if (S.indexOf(w) < 0) bad.push('④ PHYSICS〔第356便g〕に「' + w + '」が無い');
  const AS = String(F.aispec || ''), a411 = AS.indexOf('\n## 411. 第356便g'), a404 = AS.indexOf('\n## 404. ');
  const S411 = a411 >= 0 ? AS.slice(a411, (AS.indexOf('\n## ', a411 + 5) + 1 || AS.length + 1) - 1) : '';
  if (!(a411 > a404 && a404 >= 0)) bad.push('④ AI_SPEC §411(§404 の後)が無い');
  for (const w of ['R519', 'docs.docfix356g', 'SYSTEM_PROMPT には載せない']) if (S411.indexOf(w) < 0) bad.push('④ AI_SPEC §411 に「' + w + '」が無い');
  for (const [nm, t] of [['PHYSICS〔第356便g〕', S], ['AI_SPEC §411', S411]]) for (const w of BANNED_SEC) if (t.indexOf(w) >= 0) bad.push('④ 書かない語「' + w + '」が ' + nm + ' に在る');
  if (/κ(?!_D)/.test((S + S411).replace(/`[^`\n]*`/g, ''))) bad.push('④ 節か §411 に裸のカッパ');
  const pm = String(F.postmerge || ''), q0 = pm.indexOf('# ==== 第355便i の塊(ここまで)===='), q1 = pm.indexOf('# ==== 第356便g の塊(ここから)====');
  if (!(q0 >= 0 && q1 > q0 && /DEFAULT_WAVE_IDS="\$DEFAULT_WAVE_IDS docs\.docfix356g"/.test(pm))) bad.push('④ post-merge に第356便g の塊(第355便i の塊の後)が無い');
  cases.push(`④ 本節 ${[...S].length} 字・§411 ${[...S411].length} 字・post-merge の塊・書かない語`);
  return { bad, cases };
}

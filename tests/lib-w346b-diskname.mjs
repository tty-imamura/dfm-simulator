// 第346便b(原仮定者の回答(2026-11-21 —— 第145報の回答 3)「「回転引きずり」の呼び名を「円盤引きずり」に変える」・統括の検証項目 R398):
//   **呼び名の戻り止め**の純関数(html を書かない・ファイルを書かない)。
//
// ■ 何をするか
//   宣言 DECL_346B(対象のファイル・範囲〔今の読み手が読む所〕・語の対・除く範囲〔過去の便の節・引用・JavaScript の注記〕)の範囲の中に、
//   旧称(日本語「回転引きずり」・英語 "rotational drag" ほか —— 語の対の左)が残っていないかを数える(scanText346b・scanTree346b)。
//   QA lint.diskDragName346b が今の木で 0 件と、変異(範囲の中に旧称を足す → 落ちる/引用・注記・過去の節に足す → 落ちない)を見る(probe346b)。
// ■ 宣言は置き換えの台本と同じもの(台本は宣言の JSON がこの lib と同じかを照らしてから当てる)。呼び名だけ —— 式・鍵・既定値・本の宣言の値は対象の外
//   (設定の鍵 rotDrag… などのプログラムの名は日本語の語を含まないので対に掛からない)。
// ■ しないこと: 旧称の文を書き換えない(書き換えは台本)・「円盤の形が導けた」「中身が変わった」とは言わない(呼び名の照合だけ)。
import fs from 'node:fs';
import path from 'node:path';

export const DISKNAME_VERSION_346B = 'w346b-diskname-1';

export const DECL_346B = Object.freeze({
  version: 'w346b-diskname-1',
  oldJa: '回転引きずり',
  newJa: '円盤引きずり',
  // 語の対(長いものから当てる —— 複合の語は日本語では同じ規則で自動: 一様回転引きずり → 一様円盤引きずり)
  pairsJa: [['回転引きずり', '円盤引きずり']],
  pairsEn: [
    ['ROTATIONAL AND AXIAL DRAG', 'DISK AND AXIAL DRAG'],
    ['rotational and axial dragging', 'disk and axial dragging'],
    ['rotational and axial drag', 'disk and axial drag'],
    ['ROTATIONAL DRAGGING', 'DISK DRAGGING'],
    ['ROTATIONAL DRAG', 'DISK DRAG'],
    ['Rotational dragging', 'Disk dragging'],
    ['rotational dragging', 'disk dragging'],
    ['Rotational drag', 'Disk drag'],
    ['rotational drag', 'disk drag'],
    ['rotational-drag', 'disk-drag'],
  ],
  // 引用(原仮定者の過去の文・過去の便の用語の定義)を守る: 「…」の前の 50 字以内(句点と括弧の区切りなし)に出どころの語があるか、
  // 」の直後に(第N報 /(原仮定者 が続くとき、その「…」は当時の文のまま
  quoteBefore: '(原仮定者|第\\d+報|AN\\d+|裁定|指示|整理|補足|追記|決断|回答|予定|の用語の)[^「」。]{0,50}$',
  quoteAfter: '^[((](第\\d+報|原仮定者)',
  files: [
    {
      file: 'beta/index.html', kind: 'screen', en: true,
      // 範囲: 全体。除く: JavaScript の // の注記(過去の便の記録 —— 「第N便x」の札つき)と、下の守る文字列
      skipJsLineComment: true,
      protect: [
        // 原仮定者の裁定(第88報)の引用(🪛 の説明 —— 出どころの語が「…」の前後に無いので名指しで守る)
        '「三次元の慣性決定力: 『回転引きずり』は赤道面で最大・自転軸方向でゼロ。『並進引きずり』『回転引きずり』と別に『軸引きずり』',
        // 原仮定者の裁定(第88報)の英訳(🪛 の説明 —— 日本語の側は「…」で守られる)
        'in 3D the rotational drag is largest on the equator and zero along the spin axis; besides the translational and rotational drag there is an axial drag',
      ],
    },
    {
      file: 'tests/data-w279a-samplestatus-src.json', kind: 'source', en: true,
      // 範囲: 全体(本の状況の原稿 —— html の生成領域 sample-status と docs/SAMPLE_STATUS.md の作る元。器 tests/exp-w279a-samplestatus.mjs で作り直す)
      protect: [],
    },
    {
      file: 'docs/PHYSICS.md', kind: 'doc',
      // 範囲: §6 の本の一覧の表の行(| id | 名 | … —— 今の本の名と説明)だけ。ほかは便ごとの節〔第N便〕(過去の記録)
      rangeStart: '## 6. 実装するシミュレーション', rangeEnd: '### 6.x 廃止したサンプル',
      onlyLines: '^\\| [A-Za-z0-9_]+ \\| ',
      protect: [],
    },
    {
      file: 'docs/EQUATIONS.md', kind: 'doc',
      // 範囲: 全体(計算式の一覧 —— 今の状態)。除く: 便ごとの記録の箇条(「- **第N…」で始まる行)・引用・
      //   各項の「- **ノブの台帳**:」の行(ノブの名は PHYSICS〔第337便g〕の台帳の行の名 —— 台帳は統括が持つので、名は台帳と一緒に変える)
      skipLines: ['^- \\*\\*第\\d', '^\\s*- \\*\\*第\\d', '^> ', '^- \\*\\*ノブの台帳\\*\\*'],
      protect: [],
    },
    {
      file: 'docs/AI_SPEC.md', kind: 'doc',
      // 範囲: §5(アプリの SYSTEM_PROMPT の逐語の写し)だけ。ほかは便ごとの節(過去の記録)
      rangeStart: '## 5. The preset specification', rangeEnd: '## 6.1 ',
      protect: [],
    },
    {
      file: 'docs/PHENOMENA_STATUS.md', kind: 'doc',
      // 範囲: 全体。除く: 便ごとの更新の注(> の行)・「- **第N便の調べ**」の箇条(過去の記録)・引用
      skipLines: ['^> ', '^- \\*\\*第\\d+便の調べ\\*\\*'],
      protect: [],
    },
    {
      file: 'README.md', kind: 'doc',
      // 範囲: 「## 機能」から末尾。除く: > の行(便ごとの知らせ)・引用
      rangeStart: '## 機能', rangeEnd: null,
      skipLines: ['^> '],
      protect: [],
    },
  ],
});

// ---- 範囲と守る所(台本と同じ規則)----
function lineInJsComment(line, pos) {
  const pre = line.slice(0, pos);
  for (let k = pre.indexOf('//'); k >= 0; k = pre.indexOf('//', k + 1)) {
    if (k === 0 || pre[k - 1] !== ':') return true;
  }
  return false;
}

// 守る区間 [s, e) の一覧(行の中の位置)
function protectedSpans(line, spec, decl) {
  const spans = [];
  const qb = new RegExp(decl.quoteBefore), qa = new RegExp(decl.quoteAfter);
  for (let i = line.indexOf('「'); i >= 0; i = line.indexOf('「', i + 1)) {
    // 対になる 」(入れ子の 「」 を数える)
    let depth = 0, j = i;
    for (; j < line.length; j++) {
      if (line[j] === '「') depth++;
      else if (line[j] === '」') { depth--; if (depth === 0) break; }
    }
    if (j >= line.length) continue;
    const before = line.slice(Math.max(0, i - 50), i);
    const after = line.slice(j + 1, j + 12);
    if (qb.test(before) || qa.test(after)) spans.push([i, j + 1]);
  }
  for (const p of spec.protect || []) {
    for (let k = line.indexOf(p); k >= 0; k = line.indexOf(p, k + 1)) spans.push([k, k + p.length]);
  }
  return spans;
}

// 行ごとに: 範囲の内か
function lineMask(lines, spec) {
  const mask = new Array(lines.length).fill(true);
  if (spec.rangeStart) {
    const s = lines.findIndex((l) => l.startsWith(spec.rangeStart));
    let e = spec.rangeEnd ? lines.findIndex((l, i) => i > s && l.startsWith(spec.rangeEnd)) : lines.length;
    if (s < 0 || e < 0) throw new Error(`${spec.file}: 範囲の目印が無い(${spec.rangeStart} / ${spec.rangeEnd})`);
    for (let i = 0; i < lines.length; i++) mask[i] = (i > s && i < e);
  }
  const only = spec.onlyLines ? new RegExp(spec.onlyLines) : null;
  const skips = (spec.skipLines || []).map((r) => new RegExp(r));
  for (let i = 0; i < lines.length; i++) {
    if (!mask[i]) continue;
    if (only && !only.test(lines[i])) mask[i] = false;
    else if (skips.some((r) => r.test(lines[i]))) mask[i] = false;
  }
  return mask;
}


// 範囲の中に残った旧称の一覧: [{ line, term, ctx }]
export function scanText346b(text, spec, decl = DECL_346B) {
  const lines = String(text).split('\n');
  const mask = lineMask(lines, spec);
  const terms = [decl.oldJa].concat(spec.en ? decl.pairsEn.map(([a]) => a) : []);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!mask[i]) continue;
    const line = lines[i];
    const spans = protectedSpans(line, spec, decl);
    const seen = new Set();
    for (const t of terms) {
      for (let p = line.indexOf(t); p >= 0; p = line.indexOf(t, p + 1)) {
        if (seen.has(p)) continue;
        if (spans.some(([s, e]) => p >= s && p < e)) continue;
        if (spec.skipJsLineComment && lineInJsComment(line, p)) continue;
        seen.add(p);
        out.push({ line: i + 1, term: t, ctx: line.slice(Math.max(0, p - 30), p + t.length + 20) });
      }
    }
  }
  return out;
}

// 木の全部の対象: { files: [{ file, kind, n, hits }], total, missing }
export function scanTree346b(root, decl = DECL_346B, texts = null) {
  const files = [], missing = [];
  let total = 0;
  for (const spec of decl.files) {
    let t = texts && texts[spec.file];
    if (t == null) { try { t = fs.readFileSync(path.join(root, spec.file), 'utf8'); } catch (e) { missing.push(spec.file); continue; } }
    let hits;
    try { hits = scanText346b(t, spec, decl); } catch (e) { missing.push(spec.file + '(' + String(e.message || e) + ')'); continue; }
    files.push({ file: spec.file, kind: spec.kind, n: hits.length, hits });
    total += hits.length;
  }
  return { files, total, missing };
}

// 新しい呼び名の出現の数(範囲の中 —— 置き換えが当たったことの目安)
export function countNew346b(text, spec, decl = DECL_346B) {
  const lines = String(text).split('\n');
  const mask = lineMask(lines, spec);
  let n = 0;
  for (let i = 0; i < lines.length; i++) if (mask[i]) n += lines[i].split(decl.newJa).length - 1;
  return n;
}

// 変異の自己試験: 今の木の写しに旧称を足して、範囲の中なら落ち、守る所なら落ちないこと
export function probe346b(root, decl = DECL_346B) {
  const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
  const base = {};
  for (const s of decl.files) base[s.file] = rd(s.file);
  const total = (over) => scanTree346b(root, decl, Object.assign({}, base, over)).total;
  const H = base['beta/index.html'], E = base['docs/EQUATIONS.md'], P = base['docs/PHYSICS.md'], R = base['README.md'], A = base['docs/AI_SPEC.md'];
  const iTab = P.indexOf('| saturnRotVertExplore3d | ');
  const iPast = P.indexOf('\n〔第339便 — 統括');
  const iSec5 = A.indexOf('## 5. The preset specification'), i61 = A.indexOf('## 6.1 ');
  const iA5 = A.indexOf('\n', A.indexOf('```', iSec5) + 3);
  const iHtmlCmt = H.indexOf('\n// ');
  const mut = [
    // [名, 写しの上書き, 落ちるべきか]
    ['html の画面の語に旧称', { 'beta/index.html': H.replace(decl.newJa, decl.oldJa) }, true],
    ['html の英語に rotational drag', { 'beta/index.html': H.replace('disk drag', 'rotational drag') }, true],
    ['計算式の一覧の表の行に旧称', { 'docs/EQUATIONS.md': E.replace('| ' + decl.newJa + ' |', '| ' + decl.oldJa + ' |') }, true],
    ['PHYSICS の本の一覧の行に旧称', { 'docs/PHYSICS.md': iTab >= 0 ? P.slice(0, iTab) + P.slice(iTab).replace(decl.newJa, decl.oldJa) : P }, true],
    ['AI_SPEC §5 の写しに旧称', { 'docs/AI_SPEC.md': iA5 > 0 && iA5 < i61 ? A.slice(0, iA5 + 1) + decl.oldJa + '\n' + A.slice(iA5 + 1) : A }, true],
    ['README の機能の節に旧称', { 'README.md': R + '\n- ' + decl.oldJa + '\n' }, true],
    ['html の注記に旧称(落ちない)', { 'beta/index.html': iHtmlCmt >= 0 ? H.slice(0, iHtmlCmt) + '\n// 第346便b の試し: ' + decl.oldJa + H.slice(iHtmlCmt) : H }, false],
    ['原仮定者の文の引用に旧称(落ちない)', { 'docs/EQUATIONS.md': E + '\n原仮定者の整理(2026-11-11)「' + decl.oldJa + 'は試し」\n' }, false],
    ['PHYSICS の過去の節に旧称(落ちない)', { 'docs/PHYSICS.md': iPast >= 0 ? P.slice(0, iPast) + '\n' + decl.oldJa + P.slice(iPast) : P }, false],
    ['EQUATIONS の便の記録の箇条に旧称(落ちない)', { 'docs/EQUATIONS.md': E + '\n- **第346便の試し**: ' + decl.oldJa + '\n' }, false],
  ];
  const res = mut.map(([nm, over, shouldFail]) => { const n = total(over); return { nm, shouldFail, n, ok: shouldFail ? n > 0 : n === 0 }; });
  return { ok: res.every((r) => r.ok), res };
}

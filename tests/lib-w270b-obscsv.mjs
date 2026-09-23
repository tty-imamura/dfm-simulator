// 第270便b(第60報 W2・統括の読み (G) AE2): **観測 CSV をヘッダ名で読む 1 本**と **`record_id` の規約**。
//
// ■ なぜ要るか(第270便b で足した `record_id` 欄の前提)
//   `paper/data/*.csv` を読む器は、これまで**列位置**(`c[0]`〜`c[8]`)で読んでいた。列を 1 本足すと
//   位置がずれた瞬間に「値が別の欄から入る」事故が起きる(今回は末尾に足したので既存の位置は動かない
//   が、**次に誰かが中間へ足したら壊れる**)。そこで**ヘッダ行の名前から位置を引く**形に直す。
//   ここで配るのは「名前 → 列位置」の対応 `headerIndex()` だけで、**各器の読み方は変えていない**
//   (`c[7]` が `c[H.note]` になっただけで、同じ行の同じ文字列を読む)。
//
// ■ `record_id` の規約(**値・単位・出典・σ・note を 1 文字も変えない**)
//   ・置き場所は**ヘッダ末尾**(`body,quantity,value,unit,source,url,retrieved,note,sigma,record_id`)。
//     CSV の diff は各行末尾の `,<id>` だけである。
//   ・ID は `<PFX>-<sha256(file\nbody\nquantity\nunit\nsource) の先頭 8 桁>`。
//     `PFX` は `SOL`(太陽系)・`CLG`(星団/銀河)・`TRN`(突発天体)。
//   ・**同じ `body|quantity|unit|source` の行が複数あるとき**(併置行の重複転写)は、
//     ファイル順の 2 件目以降に `-2`, `-3`, … を付ける(**出現順の枝番**)。
//     枝番は行の挿入で動きうる —— 安定なのは「同じ 5 つ組の 1 件目」までである。これは規約であって
//     推測ではない(**同名異解は unit か source が違うので別 ID になる**)。
//   ・`solution_id` は**本便では作らない**(空欄可 —— 決断事項)。
//     → **第271便b(AF4)で作った**。置き場所は `record_id` の**直後**(ヘッダ末尾)で、規約は
//       この下の `solutionTag()` と `paper/data/solutions.json` の冒頭にある。**空欄は
//       「解が無い」ではなく「台帳に登録していない」**である。
//   ・ID は**同定の鍵**であって、印(`sigma_primary`)でも σ でも判定でもない。
//     `record_id` を足したことで判定(4 値)は 1 本も動かない(QA `lint.recordId` が数で固定する)。
//
// ■ この器がしないこと
//   ・CSV を書かない(書くのは `tests/exp-w270b-recordid.mjs` の `--write` だけ)。
//   ・値・単位・出典・σ・note を 1 文字も触らない。
//   ・印を上げ下げしない。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/** RFC4180 風の 1 行分解(二重引用符のエスケープ `""` に対応)。 */
export function parseCsvLine(line) {
  const c = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { c.push(cur); cur = ''; }
    else cur += ch;
  }
  c.push(cur); return c;
}

/** 観測 CSV の必須列(この 8 つが無いファイルは観測 CSV として読まない)。 */
export const REQUIRED_COLUMNS = ['body', 'quantity', 'value', 'unit', 'source', 'url', 'retrieved', 'note'];

/**
 * ヘッダ行から「名前 → 列位置」を作る。**列位置を書かない**ための 1 本。
 * @param {string} headerLine CSV の 1 行目
 * @returns {{[name:string]: number}} 名前 → 位置(`missing` に欠けている必須列を入れる)
 */
export function headerIndex(headerLine) {
  const names = parseCsvLine(String(headerLine || '')).map((s) => s.trim());
  const H = {};
  names.forEach((n, i) => { if (n !== '' && !(n in H)) H[n] = i; });
  Object.defineProperty(H, 'names', { value: names, enumerable: false });
  Object.defineProperty(H, 'missing', {
    value: REQUIRED_COLUMNS.filter((n) => !(n in H)), enumerable: false });
  return H;
}

/** ファイル名 → `record_id` の接頭辞(未知のファイルは `OBS`)。 */
export function idPrefix(file) {
  const b = path.basename(String(file || ''));
  if (b.indexOf('solar-observations') >= 0) return 'SOL';
  if (b.indexOf('cluster-galaxy-observations') >= 0) return 'CLG';
  if (b.indexOf('transient-observations') >= 0) return 'TRN';
  return 'OBS';
}

/**
 * `record_id` の素(枝番の付かない形)。**行番号も値も σ も使わない**。
 * @param {string} file CSV のファイル名(basename でよい)
 */
export function baseRecordId(file, body, quantity, unit, source) {
  const key = [path.basename(String(file || '')), String(body), String(quantity),
    String(unit), String(source)].join('\n');
  return idPrefix(file) + '-' + crypto.createHash('sha256').update(key, 'utf8').digest('hex').slice(0, 8);
}

/**
 * 1 ファイル分の `record_id` を**ファイル順**で作る(重複には出現順の枝番)。
 * @param {Array<{body:string,quantity:string,unit:string,source:string}>} rows
 * @returns {{ids:string[], collisions:Array<{id:string,lns:number[]}>}}
 */
export function assignRecordIds(file, rows) {
  const seen = new Map(), ids = [], groups = new Map();
  rows.forEach((r, i) => {
    const b = baseRecordId(file, r.body, r.quantity, r.unit, r.source);
    const k = (seen.get(b) || 0) + 1;
    seen.set(b, k);
    const id = (k === 1) ? b : (b + '-' + k);
    ids.push(id);
    groups.set(b, (groups.get(b) || []).concat(r.ln === undefined ? i + 2 : r.ln));
  });
  const collisions = [...groups.entries()].filter(([, lns]) => lns.length > 1)
    .map(([id, lns]) => ({ id, lns }));
  return { ids, collisions };
}

/**
 * 第271便b(AF4): note の中の**解タグ**を**語境界で**読む。
 *   綴りは `<著者><西暦4桁>-<モデル>`(例 `Meng2025-DDFWHE`)。`solution=DDFWHE (TEMPO)` のような
 *   **モデル名だけの記載は当たらない**(西暦 4 桁が要る)。`adopted_solution=` は別の鍵であり、
 *   `key='solution'` では**当たらない**(直前の文字が `_` なので語境界に掛からない)。
 * @param {string} note CSV の note 欄
 * @param {string} key `'solution'`(既定)か `'adopted_solution'`
 * @returns {string} 解タグ(無ければ空文字)
 */
export function solutionTag(note, key = 'solution') {
  // 第278便a(AM14): 綴りを 2 つにした —— ① タイミング解 `<著者><西暦4桁>-<モデル>`(例 `Meng2025-DDFWHE`)
  //   ② **暦の解** `<3 文字の暦記号><3 桁の番号>-<西暦 4 桁>`(例 `PLU060-2024` — 暦名だけでは版を区別
  //   できないので公表論文の西暦を添える)。②は大文字 3 字 + 数字 3 桁 + `-` + 数字 4 桁に限る
  //   (`solutionId=PLU060-2024` のような**鍵名の違う旧綴り**は `key='solution'` に当たらない)。
  const m = new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=((?:[A-Za-z][A-Za-z0-9]*\\d{4}-[A-Za-z0-9]+)'
    + '|(?:[A-Z]{3}\\d{3}-\\d{4}))(?![A-Za-z0-9_-])').exec(String(note || ''));
  return m ? m[1] : '';
}

// ---------------------------------------------------------------- 第272便e(AG19): 並び鍵
// ■ 規約(**`;` は鍵の区切り専用・並びの区切りは `|`**)
//   note は `<鍵>=<値>; <鍵>=<値>; …` である。したがって既定の鍵読み(`<鍵>=([^;]*)`)は
//   **最初の `;` で切れる**。第271便b の `derived_from=SOL-dd4b7894;SOL-5199beef` は
//   この読みでは 1 件目しか返らない(第271便b が実測して記録した「規約の穴」)。
//   本便でこれを **`|` 区切り**に改めた。**値・単位・出典・σ・印は 1 文字も動いていない**
//   (動いたのは note の区切り 1 文字である)。
// ■ 既知の未解決(**書き換えていない・決断事項**)
//   `derived_from=Moon|apsidal_period` のように、**1 件の参照そのものが `<body>|<quantity>`**
//   という綴りの行が 14 行ある(2026-09-15 intake の派生行)。この 14 行は `|` で割ると
//   2 件に見えるが、意味は 1 件の参照である。**記法が衝突している** —— 本便は
//   `listKey()` が返す生の並びと、`recordIdItems()` が返す record_id 形の項目を**分けて**数え、
//   衝突している行数を QA `lint.listKeys` が表示するだけにした(改名はしていない)。
//
// ---------------------------------------------------------------- 第273便e(AH16 (a)): 旧綴りの併記
// ■ 何をしたか(**値・単位・出典・σ・印・record_id は 1 文字も動かしていない**)
//   上の 14 行の `derived_from=<body>|<quantity>` を、**参照先が現行 CSV の 1 行に一意に解決できる
//   ときだけ** record_id へ書き換え、**旧綴りは `derived_from_legacy=` として note に残した**。
//   したがって読取器は 2 つの形を読む:
//     ・`derived_from=<record_id>`(解決済み。`|` 区切りで複数可)
//     ・`derived_from_legacy=<body>|<quantity>`(**履歴** —— 同定の鍵ではない)
//   `derived_from_legacy` は**並び鍵ではない**(値そのものに `|` を含む 1 件の参照である)。
//   鍵読みの正規表現は語境界つきなので、`derived_from=` の読みは `derived_from_legacy=` にも
//   `derived_from_note=` にも当たらない(`derived_from` の直後が `_` であって `=` ではない)。
// ■ この形がしないこと
//   ・旧綴りから参照先を**推定しない**。一意に解決できない行は**書き換えない**(legacy のまま)。
//   ・`derived_from_legacy=` を判定にも σ にも使わない(履歴の欄である)。
/** `<PFX>-<8 桁>`(+出現順の枝番)= `record_id` の形。 */
export const RECORD_ID_RE = /^(?:SOL|CLG|TRN|OBS)-[0-9a-f]{8}(?:-\d+)?$/;
/** 並びとして読む鍵(ここに無い鍵は 1 値の鍵である)。 */
export const LIST_KEYS = ['derived_from'];

/** 鍵の生値(既定の読み方 —— **最初の `;` で切れる**)。 */
export function rawKey(note, key) {
  const m = new RegExp('(?:^|[^A-Za-z0-9_])' + key + '=([^;]*)').exec(String(note || ''));
  return m ? m[1].trim() : null;
}

/** 並び鍵を**項目の配列**として読む(区切りは `|`)。鍵が無ければ空配列。 */
export function listKey(note, key) {
  const raw = rawKey(note, key);
  if (raw === null) return [];
  return raw.split('|').map((s) => s.trim()).filter((s) => s !== '');
}

/** 並びのうち **`record_id` の形をした項目**だけ。 */
export function recordIdItems(note, key) {
  return listKey(note, key).filter((s) => RECORD_ID_RE.test(s));
}

/**
 * **旧綴り(`;` 区切りの並び)の検出**。`<鍵>=…;<record_id>` の形なら旧綴りとみなす
 * (`;` の直後が `record_id` の形の語であることが条件 —— 別の鍵が続くだけの行は当たらない)。
 * @returns {{head:string,next:string}|null}
 */
export function legacySemicolonList(note, key) {
  const m = new RegExp('(?:^|[^A-Za-z0-9_])' + key
    + '=([^;]*);\\s*((?:SOL|CLG|TRN|OBS)-[0-9a-f]{8}(?:-\\d+)?)(?![A-Za-z0-9_])')
    .exec(String(note || ''));
  return m ? { head: m[1].trim(), next: m[2] } : null;
}

/** 第273便e(AH16 (a)): 旧綴りを残す欄の接尾辞(`derived_from` → `derived_from_legacy`)。 */
export const LEGACY_KEY_SUFFIX = '_legacy';

/**
 * 第273便e(AH16 (a)): 並び鍵を **record_id 参照と legacy 表記の両方**として読む。
 *   `ids`      … `record_id` の形をした項目(解決済みの参照)
 *   `legacy`   … `<key>_legacy=` に残した旧綴り(`{raw, body, quantity}`・無ければ null)
 *   `unresolved` … `derived_from=` 側に**まだ** `<body>|<quantity>` 形が残っているとき 1
 *                  (= record_id が 1 件も無く、項目が 2 件以上ある行)。**推定で埋めない**。
 * @returns {{items:string[], ids:string[], legacy:({raw:string,body:string,quantity:string}|null),
 *            unresolved:number, resolved:boolean}}
 */
export function listKeyRefs(note, key) {
  const items = listKey(note, key);
  const ids = items.filter((s) => RECORD_ID_RE.test(s));
  const raw = rawKey(note, key + LEGACY_KEY_SUFFIX);
  let legacy = null;
  if (raw !== null && raw !== '') {
    const p = raw.split('|').map((s) => s.trim());
    legacy = { raw, body: p[0] === undefined ? '' : p[0], quantity: p[1] === undefined ? '' : p[1] };
  }
  return { items, ids, legacy,
    unresolved: (ids.length === 0 && items.length > 1) ? 1 : 0,
    resolved: ids.length > 0 };
}

/**
 * 観測 CSV を**ヘッダ名で**読む。各行は名前つきの欄と、生の列配列 `cells` と、
 * 名前引きの `cell(name)` を持つ(**列位置は 1 つも書かない**)。
 * @param {string} fp 絶対パス
 */
export function loadObsCsv(fp) {
  const out = { file: path.basename(fp), path: fp, header: null, rows: [], missing: [] };
  if (!fs.existsSync(fp)) return out;
  const lines = fs.readFileSync(fp, 'utf8').split('\n');
  const H = headerIndex(lines[0] || '');
  out.header = H; out.missing = H.missing.slice();
  const cell = (c, n) => ((n in H) && c[H[n]] !== undefined) ? c[H[n]] : '';
  for (let i = 1; i < lines.length; i++) {
    const L = lines[i];
    if (!L.trim()) continue;
    const c = parseCsvLine(L);
    const sgRaw = String(cell(c, 'sigma')).trim();
    const sg = (sgRaw !== '') ? Number(sgRaw) : null;
    const vRaw = String(cell(c, 'value')).trim();
    out.rows.push({
      ln: i + 1, file: out.file, cells: c, cell: (n) => cell(c, n),
      body: cell(c, 'body'), quantity: cell(c, 'quantity'),
      rawValue: cell(c, 'value'), value: (vRaw !== '') ? Number(vRaw) : null,
      unit: cell(c, 'unit'), source: cell(c, 'source'), url: cell(c, 'url'),
      retrieved: cell(c, 'retrieved'), note: cell(c, 'note'),
      rawSigma: sgRaw, sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      recordId: String(cell(c, 'record_id')).trim(),
      // 第271便b(AF4): 欄そのもの(空欄可)と、note の解タグ(欄を作る前の唯一の手掛かり)。
      solutionId: String(cell(c, 'solution_id')).trim(),
      solutionTag: solutionTag(cell(c, 'note')),
      adoptedSolutionTag: solutionTag(cell(c, 'note'), 'adopted_solution'),
    });
  }
  return out;
}

export default { parseCsvLine, headerIndex, idPrefix, baseRecordId, assignRecordIds, loadObsCsv,
  solutionTag, REQUIRED_COLUMNS, RECORD_ID_RE, LIST_KEYS, rawKey, listKey, recordIdItems,
  legacySemicolonList, LEGACY_KEY_SUFFIX, listKeyRefs };

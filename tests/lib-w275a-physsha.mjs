// 第275便a(統括の裁定キュー AI24): **`physicsSourceSha256`** —— html から**生成領域を除いた
// 物理コード領域**の SHA-256 を作る純関数である。
//
// ■ なぜ要るか(第273便c が書いた「構造的な不能」の裏返し)
//   第273便c の side table は「正本を測ったときの html の SHA-256」を html に刻む。ところが
//   **刻めばその html の hash が動く**ので、「刻印 = 現行 html の hash」という等号は**不動点が
//   無い**。結果として、ページの実行時に効く線が署名一致だけになっていた。
//   **生成領域(この器が書き換える領域)を hash の対象から外せば不動点が生まれる**:
//   生成物をいくら書き換えても `physicsSourceSha256` は動かないので、
//   「刻印 = 現行 html の物理コード領域の hash」を**要求できる等号にできる**。
//
// ■ 領域の境界(**マーカーで宣言する** —— 行番号や正規表現の当てずっぽうで切らない)
//   html の中に、生成物ごとに 1 対のコメント行を置く:
//     // >>> w275a-generated: <name>
//     …(生成物)…
//     // <<< w275a-generated: <name>
//   第275便a 時点で宣言してあるのは 3 つ:
//     `i18n`(表示辞書)/ `builtin-presets`(内蔵プリセット配列)/
//     `assessed-table`(第273便c の side table と、その刻印 `ASSESSED_CANON`)。
//   **除くのは「生成物」だけ**で、`S._core`・検証器・エンジンはすべて hash の中に残る。
//
// ■ 何を hash するか(**数え方を規約として書いておく**)
//   ① html を読む → ② 宣言された領域を**開始マーカー行から終了マーカー行まで**(両方の行を含む)
//      取り除き、代わりに `\x00<name>\x00` の 1 行を置く(**領域が消えたことも hash に残す** ——
//      マーカーごと削ると「領域を丸ごと外した html」と区別できなくなる)→
//   ③ 改行を `\n` へ正規化 → ④ UTF-8 で SHA-256。
//   **空白の畳み込みはしない**(コメント 1 文字の違いも hash に出る —— これは物理コードの
//   同一性を見る線であって、意味の同値を見る線ではない)。
//
// ■ この lib がしないこと
//   ・ファイルを書かない。・判定をしない。・「一致したから正しい」とは言わない ——
//     一致は「**生成物を除いた本文が同じ**」ことだけを意味する。
//
// ■ 第275便a の範囲(**次便へ残すもの**)
//   本便で入れたのは**境界マーカーの挿入と算出器**までである。正本 meta の `physicsSourceSha256`
//   欄への適用(`lib-w272e-provenance.mjs` の形を変える)と QA への接続は**次便**でよい
//   —— 形を変えると `lint.provenanceMeta` の `provenanceVersion` が上がり、**全正本 16 本の
//   再走**が要るからである(第275便a は判定器と契約の便で、正本の形は変えない)。
import fs from 'node:fs';
import crypto from 'node:crypto';

/** 算出の版(数え方を変えたら上げる)。 */
export const PHYSSHA_VERSION = 'w275a-1';

/** マーカーの綴り(html 側と 1 文字も違えない)。 */
export const BEGIN_PREFIX = '// >>> w275a-generated: ';
export const END_PREFIX = '// <<< w275a-generated: ';

/** 第275便a 時点で宣言してある生成領域(**名前の順は hash に影響しない** —— 出現順に切る)。 */
export const DECLARED_REGIONS = ['i18n', 'builtin-presets', 'assessed-table'];

/**
 * html の中の生成領域を探す。**対になっていない/入れ子/逆順はエラーとして返す**(黙って直さない)。
 * @param {string} html
 * @returns {{regions: Array, errors: string[]}}
 */
export function findRegions(html) {
  const lines = String(html).replace(/\r\n?/g, '\n').split('\n');
  const regions = [], errors = [];
  let open = null;
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith(BEGIN_PREFIX)) {
      const name = t.slice(BEGIN_PREFIX.length).trim();
      if (open) { errors.push('入れ子の開始マーカー: ' + name + '(' + open.name + ' が開いたまま)'); return; }
      open = { name, from: i };
    } else if (t.startsWith(END_PREFIX)) {
      const name = t.slice(END_PREFIX.length).trim();
      if (!open) { errors.push('対応する開始マーカーの無い終了マーカー: ' + name); return; }
      if (open.name !== name) { errors.push('マーカーの名前が食い違う: ' + open.name + ' → ' + name); open = null; return; }
      regions.push({ name, from: open.from, to: i, lines: i - open.from + 1 });
      open = null;
    }
  });
  if (open) errors.push('閉じていない開始マーカー: ' + open.name);
  const seen = new Set();
  for (const r of regions) {
    if (seen.has(r.name)) errors.push('同じ名前の領域が 2 回宣言されている: ' + r.name);
    seen.add(r.name);
  }
  for (const n of DECLARED_REGIONS) if (!seen.has(n)) errors.push('宣言された領域が html に無い: ' + n);
  return { regions, errors };
}

/**
 * **生成領域を除いた物理コード領域**の SHA-256。
 * @param {string} html
 * @returns {{sha256: string|null, version: string, regions: Array, errors: string[],
 *            bytesAll: number, bytesPhysics: number, linesAll: number, linesPhysics: number}}
 */
export function physicsSourceSha256(html) {
  const text = String(html).replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  const { regions, errors } = findRegions(text);
  if (errors.length) {
    return { sha256: null, version: PHYSSHA_VERSION, regions, errors,
      bytesAll: Buffer.byteLength(text, 'utf8'), bytesPhysics: 0,
      linesAll: lines.length, linesPhysics: 0 };
  }
  const cut = new Map();          // 開始行 → 領域
  for (const r of regions) cut.set(r.from, r);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const r = cut.get(i);
    if (r) { out.push('\u0000' + r.name + '\u0000'); i = r.to; continue; }
    out.push(lines[i]);
  }
  const body = out.join('\n');
  return { sha256: crypto.createHash('sha256').update(body, 'utf8').digest('hex'),
    version: PHYSSHA_VERSION, regions, errors: [],
    bytesAll: Buffer.byteLength(text, 'utf8'), bytesPhysics: Buffer.byteLength(body, 'utf8'),
    linesAll: lines.length, linesPhysics: out.length };
}

/** ファイルから。読めなければ `sha256:null` と理由を返す(例外を投げない)。 */
export function physicsSourceSha256File(abs) {
  try { return physicsSourceSha256(fs.readFileSync(abs, 'utf8')); }
  catch (e) { return { sha256: null, version: PHYSSHA_VERSION, regions: [], errors: ['読めない: ' + String(e)],
    bytesAll: 0, bytesPhysics: 0, linesAll: 0, linesPhysics: 0 }; }
}

export default { PHYSSHA_VERSION, BEGIN_PREFIX, END_PREFIX, DECLARED_REGIONS,
  findRegions, physicsSourceSha256, physicsSourceSha256File };

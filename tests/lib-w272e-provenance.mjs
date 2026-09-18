// 第272便e(第62報・AG11): **正本 JSON の来歴(provenance)を 1 つの形に揃える**。
//
// ■ なぜ要るか(統括の検証項目 R11)
//   公開している正本 JSON は、器ごとに別々の刻印を持っていた ——
//   `meta.measuredAt`+`inputs[].sha256`(比較器 3 本)・`meta.when`+`inputs[].sha256_16`(星団)・
//   刻印そのものが無い(qsplit)・`meta.targetSha256` だけ(j1946adopt)。
//   この状態では「**どの html を・どのコードで・どの入力から**作った JSON か」を
//   1 つの規則で機械照合できない(`target:` はパス文字列にすぎず、中身が変わっても気づけない)。
//
// ■ 何を配るか(**短縮 hash は表示用・判定は完全値**)
//   `provenanceMeta()` が返す形:
//     { provenanceVersion, wave, target, targetSha256(64 桁), generatedAt(ISO),
//       inputs: [{file, bytes, sha256(64 桁), mtime}], code: [同じ形], codeSha256(64 桁) }
//   ・`target` は**この JSON が写し取った対象のファイル**(既定 `beta/index.html`。
//     html を走らせない器は、その器が読む正本ファイルを `target` にしてよい)。
//   ・`codeSha256` は **器と lib の sha256 を並べた文字列の sha256**(1 本でも変われば変わる)。
//   ・欠けているファイルは `{file, missing:true}` で残す(**黙って落とさない**)。
//
// ■ この器がしないこと
//   ・値を作らない・判定に触らない・ファイルを書かない(書くのは呼び出した器である)。
//   ・「一致したから正しい」とは言わない —— 一致は**同じ入力を読んだ**ことだけを意味する。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/** 来歴の版(形を変えたら上げる。QA `lint.provenanceMeta` がこの文字列を見る)。 */
export const PROVENANCE_VERSION = 'w272e-1';

/** ファイルの完全 SHA-256(読めなければ null)。 */
export function sha256File(abs) {
  try { return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'); }
  catch { return null; }
}

/** 文字列の完全 SHA-256。 */
export function sha256Text(s) {
  return crypto.createHash('sha256').update(String(s), 'utf8').digest('hex');
}

/**
 * 1 ファイルの刻印。**完全な sha256 を持つ**(短縮は表示側で切る)。
 * @param {string} abs 絶対パス
 * @param {string} rel JSON に載せる相対パス
 */
export function stampFile(abs, rel) {
  const file = rel || abs;
  try {
    const b = fs.readFileSync(abs);
    return { file, bytes: b.length,
      sha256: crypto.createHash('sha256').update(b).digest('hex'),
      mtime: fs.statSync(abs).mtime.toISOString() };
  } catch { return { file, missing: true }; }
}

/** 刻印の並び → 1 本の hash(`file\nsha256\n` を連ねた文字列の sha256)。 */
export function digestOfStamps(stamps) {
  const body = (stamps || []).map((s) => String(s.file) + '\n' + String(s.sha256 || 'missing') + '\n').join('');
  return sha256Text(body);
}

/**
 * 共通の来歴 meta を作る。
 * @param {object} o
 * @param {string} o.root リポジトリ root の絶対パス
 * @param {string} o.wave 便の名前(例 '第272便e')
 * @param {string} [o.target] 対象ファイルの相対パス(既定 'beta/index.html')
 * @param {string[]} [o.code] 器と lib の相対パス
 * @param {string[]} [o.inputs] 入力ファイルの相対パス(target を含めてよい)
 */
export function provenanceMeta(o) {
  const s = o || {};
  const root = s.root || process.cwd();
  const target = s.target || 'beta/index.html';
  const abs = (rel) => path.isAbsolute(rel) ? rel : path.join(root, rel);
  const code = (s.code || []).map((rel) => stampFile(abs(rel), rel));
  const inputs = (s.inputs || []).map((rel) => stampFile(abs(rel), rel));
  return {
    provenanceVersion: PROVENANCE_VERSION,
    wave: s.wave === undefined ? null : s.wave,
    target,
    targetSha256: sha256File(abs(target)),
    generatedAt: new Date().toISOString(),
    inputs,
    code,
    codeSha256: digestOfStamps(code),
  };
}

/**
 * 既にある meta に来歴の欄を**足す**(既存の欄は 1 つも消さない)。
 * 器ごとの独自欄(`declarationVersion`・`window`・`doNotWrite` 等)はそのまま残る。
 */
export function withProvenance(meta, o) {
  return Object.assign({}, meta || {}, provenanceMeta(o));
}

export default { PROVENANCE_VERSION, sha256File, sha256Text, stampFile, digestOfStamps,
  provenanceMeta, withProvenance };

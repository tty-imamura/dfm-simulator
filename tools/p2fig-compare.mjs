#!/usr/bin/env node
// 第287便f(原仮定者の裁定(第77報)AN67): **論文2 の図データの照合**(再生成した p2fig*.json・p2figs-gates.json と、コミット済みの同名 JSON)。
//
// これまで `.github/workflows/paper2.yml` の shell に直に書いていた照合(揮発キーを除いた JSON の一致)を 1 本にした。
// PR の paper2.yml(paper/** か生成器の変更で走る)と nightly.yml の `paper2-figures` job(毎晩・TeX なし)が**同じこの器**を呼ぶ
// (2 か所に同じ式を書いて食い違わせない —— QA `lint.nightlyPaper2` が両方の呼び出しを照合する)。
//
// 揮発キー(照合で除く —— 値が変わっても図のデータの失効ではない): 従来の `generated`・`commit` に、第287便f で図のメタに足した
//   `targetSha256`(対象 html の sha256)・`generatorSha256`(tools/gen-figures2.mjs の sha256)・`chromiumVersion`(走らせた Chromium の版の**記録** ——
//   版は固定しない)を加えた。除き方は従来どおり**どの深さでも同名の鍵を消す**(本文のデータにこれらの名の鍵は無い)。
// 失効(データの不一致)したら: 第216便追補の形で再同期する(対象 html を確定 → `node tools/gen-figures2.mjs` → 22 ゲート PASS → 再生成 JSON を
//   コミット)。図 8 は再生成の鎖の段にしない(第77報 AN67)。
//
// 使い方:
//   node tools/p2fig-compare.mjs [--ref HEAD] [--now-dir paper/figures]
//     --ref     … コミット済みの版(既定 HEAD)
//     --now-dir … 再生成した JSON の置き場(既定 paper/figures —— gen-figures2 を P2FIG_OUT で一時ディレクトリへ書いたときはそこ)
// 終了コード: 0 = 全ファイル一致 / 1 = 不一致・片側にしか無いファイルがある / 2 = git が引けない
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const P2FIG_VOLATILE_KEYS = ['generated', 'commit', 'targetSha256', 'generatorSha256', 'chromiumVersion'];
export const P2FIG_DIR = 'paper/figures';
export const P2FIG_FILE_RE = /^(p2fig\d+\.json|p2figs-gates\.json)$/;

/** 揮発キーを除いた JSON 文字列(鍵の順は元のまま —— 従来の paper2.yml の式と同じ)。 */
export function stripVolatile(text) {
  const o = JSON.parse(text);
  const strip = (x) => {
    if (x && typeof x === 'object') { for (const k of P2FIG_VOLATILE_KEYS) delete x[k]; for (const k in x) strip(x[k]); }
    return x;
  };
  return JSON.stringify(strip(o));
}

/** 1 ファイルの照合。 */
export function compareOne(headText, nowText) {
  if (headText == null || nowText == null) return { ok: false, why: headText == null ? 'コミット済みに無い' : '再生成に無い' };
  let a, b;
  try { a = stripVolatile(headText); b = stripVolatile(nowText); } catch (e) { return { ok: false, why: 'JSON が読めない: ' + String(e.message || e).slice(0, 80) }; }
  if (a === b) return { ok: true };
  return { ok: false, why: 'データ不一致' };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const argv = process.argv.slice(2);
  const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
  const REF = getArg('--ref', 'HEAD');
  const NOW = path.resolve(ROOT, getArg('--now-dir', P2FIG_DIR));
  let listed;
  try {
    listed = execFileSync('git', ['-C', ROOT, 'ls-tree', '--name-only', REF, P2FIG_DIR + '/'], { encoding: 'utf8' })
      .split('\n').map((z) => z.trim()).filter(Boolean).map((z) => path.basename(z)).filter((z) => P2FIG_FILE_RE.test(z));
  } catch (e) { console.error('git ls-tree が引けない: ' + String(e.message || e).slice(0, 120)); process.exit(2); }
  const present = fs.existsSync(NOW) ? fs.readdirSync(NOW).filter((z) => P2FIG_FILE_RE.test(z)) : [];
  const files = [...new Set(listed.concat(present))].sort((x, y) => x.localeCompare(y, 'en', { numeric: true }));
  let bad = 0;
  for (const f of files) {
    let head = null, now = null;
    if (listed.includes(f)) head = execFileSync('git', ['-C', ROOT, 'show', REF + ':' + P2FIG_DIR + '/' + f], { encoding: 'utf8', maxBuffer: 64 << 20 });
    if (present.includes(f)) now = fs.readFileSync(path.join(NOW, f), 'utf8');
    const r = compareOne(head, now);
    // 来歴(判定に使わない): 対象 html と生成器の sha がコミット済みの刻印と違えば 1 行で出す(図のデータが同じなら失効ではない)
    let prov = '';
    try {
      const h = head ? JSON.parse(head) : {}, n = now ? JSON.parse(now) : {};
      const s = (x) => (x ? String(x).slice(0, 12) : '刻印なし');
      if (h.targetSha256 !== n.targetSha256) prov += ` html ${s(h.targetSha256)}→${s(n.targetSha256)}`;
      if (h.generatorSha256 !== n.generatorSha256) prov += ` 生成器 ${s(h.generatorSha256)}→${s(n.generatorSha256)}`;
      if (n.chromiumVersion) prov += ` Chromium ${n.chromiumVersion}(記録)`;
    } catch { /* 照合の側で数える */ }
    if (!r.ok) bad++;
    console.log(`${r.ok ? 'MATCH   ' : 'MISMATCH'} ${P2FIG_DIR}/${f}${r.ok ? '' : ' —— ' + r.why}${prov ? '  [来歴' + prov + ']' : ''}`);
  }
  if (!files.length) { console.error('照合するファイルが無い(' + P2FIG_DIR + ')'); process.exit(1); }
  console.log(bad ? `figure data: MISMATCH ${bad}/${files.length}(第216便追補の形で再同期する —— 図 8 は鎖の段にしない)`
    : `figure data: committed == regenerated(${files.length} ファイル・揮発キー ${P2FIG_VOLATILE_KEYS.join('/')} を除く)`);
  process.exit(bad ? 1 : 0);
}

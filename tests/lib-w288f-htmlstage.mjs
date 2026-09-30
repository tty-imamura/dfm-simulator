// 第288便f(原仮定者の裁定(第78報)AN90・統括の検証項目 R118)— **鎖の html を書く段の一時出力の集約**(版 w288f-htmlstage-1)。
//
// ■ 何のためか
//   再生成の鎖で beta/index.html の生成領域を書く段(obscompare → samplestatus —— 表の `htmlRegions`)は、これまで各段が
//   beta/index.html を**直に**書いていた。鎖が途中で止まると「一部の領域だけ新しい html」が残り、それを完成した html と区別できない。
//   本 lib は、環境変数 `REGEN_HTML_STAGE`(鎖のランナーが `$REGEN_LOG/html` を入れる)があるときだけ、書く段の出力を
//   **一時出力(領域 1 つぶんの断片 JSON)**へ回し、鎖の末尾の集約段(`tools/regen-html-aggregate.mjs` —— 表の段 'htmlagg')が
//   **1 回だけ** beta/index.html を更新する(一時ファイル → rename の置き換え)。変数が無いとき(手で器を回すとき)は従来どおり直に書く。
//
// ■ 断片の契約
//   { version, region, baseSha256(書く段が読んだ html —— 上流の断片を当てた写し —— の sha256), nextSha256(書いた後の写しの sha256), body(領域の印から印までの本文) }
//   ・書く段は**自分の領域の印の間だけ**を変える(印の外が 1 字でも違えば投げる —— 他の領域・本文を書かない)。
//   ・下流の書く段は、上流の断片を当てた写し(`readHtmlStaged`)を読む —— 直に書いていたときと同じ html を見る。
//   ・集約は HTML_STAGE_ORDER の順に断片を当て、各断片の baseSha256 = その時点の写しの sha256 を確かめる(違えば**何も書かずに**止まる ——
//     別の鎖の断片・途中で html が変わった断片を完成扱いしない)。当てた断片は `applied/` へ移す(同じ断片を 2 回当てない)。
//   ・正本の meta の targetSha256 は、書く段が記述した写し(= 集約が書く html)の sha256 に合わせる(`stampStagedTarget`)。
//
// ■ しないこと: 判定しない・正本を書かない(書く段の器が書く)・html の生成領域の中身を作らない(書く段の器が作る)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const HTML_STAGE_VERSION = 'w288f-htmlstage-1';
export const HTML_STAGE_ENV = 'REGEN_HTML_STAGE';
/** 書く段の領域の全順序(表の after の全順序と同じ —— `htmlTailAudit` の ⑧ が照合する)。 */
export const HTML_STAGE_ORDER = ['obs-compare', 'assessed-table', 'sample-status'];
export const stageBegin = (r) => '// >>> w275a-generated: ' + r;
export const stageEnd = (r) => '// <<< w275a-generated: ' + r;
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');

/** 一時出力の置き場(無ければ null = 直に書く)。 */
export function stageDirOf(env) {
  const d = (env || process.env)[HTML_STAGE_ENV];
  return d ? path.resolve(String(d)) : null;
}
export function fragFileOf(dir, region) { return path.join(dir, region + '.frag.json'); }

/** 領域の印から印まで(両端の印を含む)の範囲。無ければ null。 */
export function regionSpan(text, region) {
  const a = text.indexOf(stageBegin(region)), e = text.indexOf(stageEnd(region));
  if (a < 0 || e < a) return null;
  return { a, b: e + stageEnd(region).length };
}

/** 断片を 1 つ当てる(領域が無ければ null)。 */
export function applyFragment(text, frag) {
  const s = regionSpan(text, frag.region);
  if (!s) return null;
  return text.slice(0, s.a) + frag.body + text.slice(s.b);
}

function readFrag(dir, region) {
  const f = fragFileOf(dir, region);
  if (!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return { region, broken: true }; }
}

/**
 * html の本文に一時出力の断片を順に当てた写し。bad が空でなければ使えない(集約しない)。
 * @param {string} text beta/index.html の本文
 * @param {string} dir 一時出力の置き場
 * @param {number} [upto] HTML_STAGE_ORDER のこの添字**より前**の領域だけを当てる(既定は全部)
 */
export function composeStaged(text, dir, upto) {
  let cur = String(text);
  const applied = [], bad = [];
  const order = HTML_STAGE_ORDER.slice(0, upto === undefined ? HTML_STAGE_ORDER.length : upto);
  for (const r of order) {
    const fr = readFrag(dir, r);
    if (!fr) continue;
    if (fr.broken || fr.version !== HTML_STAGE_VERSION || fr.region !== r || typeof fr.body !== 'string') { bad.push(r + ': 断片が読めない/版が違う'); continue; }
    const s0 = sha(cur);
    if (fr.baseSha256 !== s0) { bad.push(r + ': 断片が読んだ html(' + String(fr.baseSha256).slice(0, 12) + ')≠ いまの写し(' + s0.slice(0, 12) + ')'); continue; }
    const nx = applyFragment(cur, fr);
    if (nx === null) { bad.push(r + ': html に領域の印が無い'); continue; }
    if (sha(nx) !== fr.nextSha256) { bad.push(r + ': 当てた結果が断片の nextSha256 と違う'); continue; }
    applied.push({ region: r, changed: nx !== cur });
    cur = nx;
  }
  return { text: cur, applied, bad };
}

/**
 * 書く段が読む html。一時出力があれば**上流の領域の断片**(HTML_STAGE_ORDER で自分より前)を当てた写し ——
 * 直に書いていたときに見えた html と同じ。`inclusive` なら自分の領域の断片も当てる(--check の照合用)。
 */
export function readHtmlStaged(htmlPath, region, opt) {
  const text = fs.readFileSync(htmlPath, 'utf8');
  const o = opt || {};
  const dir = stageDirOf(o.env);
  if (!dir) return text;
  const i = HTML_STAGE_ORDER.indexOf(region);
  if (i < 0) throw new Error('領域 ' + region + ' は集約の順序(HTML_STAGE_ORDER)に無い');
  const c = composeStaged(text, dir, o.inclusive ? i + 1 : i);
  if (c.bad.length) throw new Error('一時出力の断片が html と合わない(集約しない): ' + c.bad.join(' / '));
  return c.text;
}

/**
 * 書く段の書き込み。一時出力があれば断片と写し(`view-<領域>.html` —— Chromium で確かめる用)を書き(変化が無ければ自分の古い断片を消す)、
 * 無ければ html を直に書く(変化があるときだけ)。prev は readHtmlStaged(…, region) で読んだ本文。
 * @returns {{staged:boolean, view:string, changed:boolean}} view は書いた後の html を開くためのパス
 */
export function writeHtmlStaged(htmlPath, prev, next, region, env) {
  const dir = stageDirOf(env);
  const changed = prev !== next;
  if (!dir) { if (changed) fs.writeFileSync(htmlPath, next); return { staged: false, view: htmlPath, changed }; }
  if (HTML_STAGE_ORDER.indexOf(region) < 0) throw new Error('領域 ' + region + ' は集約の順序(HTML_STAGE_ORDER)に無い');
  const sp = regionSpan(prev, region), sn = regionSpan(next, region);
  if (!sp || !sn) throw new Error('領域 ' + region + ' の印が無い');
  if (prev.slice(0, sp.a) !== next.slice(0, sn.a) || prev.slice(sp.b) !== next.slice(sn.b)) throw new Error('領域 ' + region + ' の外を書き換えた(書く段は自分の領域だけを書く)');
  fs.mkdirSync(dir, { recursive: true });
  const f = fragFileOf(dir, region);
  if (!changed) { fs.rmSync(f, { force: true }); return { staged: true, view: writeView(dir, region, next), changed }; }
  const frag = { version: HTML_STAGE_VERSION, region, baseSha256: sha(prev), nextSha256: sha(next), body: next.slice(sn.a, sn.b) };
  const tmp = f + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(frag));
  fs.renameSync(tmp, f);
  return { staged: true, view: writeView(dir, region, next), changed };
}

/** Chromium で開く写し(一時出力の置き場の中。一時出力が無ければ html そのもの)。 */
export function viewPathOf(htmlPath, text, tag, env) {
  const dir = stageDirOf(env);
  if (!dir) return htmlPath;
  return writeView(dir, tag, text);
}
function writeView(dir, tag, text) {
  fs.mkdirSync(dir, { recursive: true });
  const v = path.join(dir, 'view-' + tag + '.html');
  fs.writeFileSync(v, text);
  return v;
}

/**
 * 正本の来歴 meta の対象の刻印を、書く段が記述した写し(集約が書く html)の sha256 に合わせる(一時出力のときだけ)。
 * provenanceMeta は target のファイルを読むので、一時出力のときは集約前の html の sha を刻んでしまう —— それを直す。
 */
export function stampStagedTarget(meta, text, env) {
  if (!stageDirOf(env) || !meta) return meta;
  const s = sha(text);
  meta.targetSha256 = s;
  for (const z of (meta.inputs || [])) if (z && z.file === meta.target) z.sha256 = s;
  return meta;
}

/**
 * **集約**: 断片を順に当てて beta/index.html を 1 回だけ置き換える(一時ファイル → rename)。断片が合わなければ何も書かない。
 * @returns {{ok:boolean, written:boolean, applied:Array, bad:string[], before:string, after:string}}
 */
export function aggregateStaged(htmlPath, dir) {
  const text = fs.readFileSync(htmlPath, 'utf8');
  const c = composeStaged(text, dir);
  const res = { version: HTML_STAGE_VERSION, ok: c.bad.length === 0, written: false, applied: c.applied, bad: c.bad, before: sha(text), after: sha(text) };
  if (!res.ok) return res;
  if (c.text !== text) {
    const tmp = htmlPath + '.agg-' + process.pid;
    fs.writeFileSync(tmp, c.text);
    fs.renameSync(tmp, htmlPath);
    res.written = true; res.after = sha(c.text);
  }
  if (c.applied.length) {
    const ad = path.join(dir, 'applied', new Date().toISOString().replace(/[:.]/g, '-'));
    fs.mkdirSync(ad, { recursive: true });
    for (const z of c.applied) fs.renameSync(fragFileOf(dir, z.region), path.join(ad, z.region + '.frag.json'));
  }
  fs.appendFileSync(path.join(dir, 'aggregate.log'), JSON.stringify({ when: new Date().toISOString(), written: res.written,
    regions: c.applied.map((z) => z.region), before: res.before, after: res.after }) + '\n');
  return res;
}

export default { HTML_STAGE_VERSION, HTML_STAGE_ENV, HTML_STAGE_ORDER, stageBegin, stageEnd, stageDirOf, fragFileOf, regionSpan, applyFragment,
  composeStaged, readHtmlStaged, writeHtmlStaged, viewPathOf, stampStagedTarget, aggregateStaged };

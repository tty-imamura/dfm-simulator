#!/usr/bin/env node
// 第300便d(原仮定者の裁定(第90報)⑦「beta 版の名前に便名 —— v1.45 の beta で第300便なら v1.45-b300」・統括の検証項目 R178):
// **beta 版の名前(BETA_BUILD)を便名に合わせる器**。
//
// ■ 規則(この器と QA lint.betaBuild300 が同じ関数 `betaBuildState` を引く)
//   ・BETA_BUILD = "v<X>.<Y>-b<NNN>"。<X>.<Y> は beta 線(APP_VERSION の minor + 1)・<NNN> は**便の番号**。
//   ・便の番号は **CHANGELOG.md の行頭「- **第NNN便」の最大**(本文の中の言及は数えない)—— その便の行を CHANGELOG に足した便が
//     この html を作った便である。手で番号を持つ表を別に置かない(第二の正本を作らない)。
//     **便の始めの窓を許す**: 統括が便の基点で番号を先に上げた状態(CHANGELOG の最大 + 1 —— その便の行がまだ無い)も一致と見なす。
//     最大より小さい番号(便の行を足したのに上げ忘れた)・最大 + 2 以上は食い違い。
//   ・同じ値を 3 か所に書く: beta/index.html の `const BETA_BUILD = "…"`・beta/sw.js の `CACHE = CACHE_PREFIX + "…"`(版ごとに
//     旧キャッシュを捨てる)・CHANGELOG.md の beta 節の見出し `## <BETA_BUILD>(開発中 — beta)`。
//   ・昇格(tests/release-promote.mjs)は次期 beta 線を "v<次の minor>-b<NNN>" で切る(NNN は同じ規則)。
//
// ■ 使い方
//   node tools/beta-build.mjs              … 検査だけ(書かない)。食い違いがあれば終了コード 1 と、直す値を出す
//   node tools/beta-build.mjs --apply --wave 301  … 3 か所を規則の値へ書き換える(**統括が便の基点で 1 回** —— 便の番号は明示が既定の使い方。
//                                                  --wave が無ければ CHANGELOG の最大)。--wave を付けた検査はその番号との厳密な一致を見る
//   --root <dir> で対象のリポジトリを替える(既定はこの器の 1 つ上)・--json で 1 行の JSON も出す。
// **書かないもの**: ルートの index.html・sw.js(root では BETA_BUILD を使わない —— 昇格の器の役目)・生成文書
// (docs/SAMPLE_STATUS_v1.45.md・docs/FAMILIES_v1.45.md の見出しは、各生成器が html の BETA_BUILD を読んで書く —— 鎖で追従する)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BETA_BUILD_RE = /const BETA_BUILD = "([^"]+)"/;
export const BETA_FORM_RE = /^v(\d+)\.(\d+)-b(\d+)$/;
export const SW_CACHE_RE = /CACHE = CACHE_PREFIX \+ "([^"]+)"/;
export const CL_BETA_HEAD_RE = /^## (v\d+\.\d+-b\d+)\(開発中 — beta\)$/m;
export const CL_ROW_WAVE_RE = /^- \*\*第(\d+)便/gm;

// CHANGELOG の行頭「- **第NNN便」の最大(無ければ null)
export function changelogMaxWave(cl) {
  let mx = null, m;
  const re = new RegExp(CL_ROW_WAVE_RE.source, 'gm');
  while ((m = re.exec(cl))) { const n = Number(m[1]); if (mx === null || n > mx) mx = n; }
  return mx;
}
// 規則の値: beta 線(APP_VERSION の minor + 1)と便の番号から
export function betaBuildOf(appVersion, wave) {
  const m = String(appVersion).match(/^(\d+)\.(\d+)$/);
  if (!m || !(wave > 0)) return null;
  return 'v' + m[1] + '.' + (Number(m[2]) + 1) + '-b' + wave;
}
// 3 か所と CHANGELOG の最大の便を読み、規則と照らす(書かない)
export function betaBuildState(root, opts = {}) {
  const rd = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
  const html = rd(opts.html || 'beta/index.html');
  const sw = rd('beta/sw.js');
  const cl = rd('CHANGELOG.md');
  const bb = (html.match(BETA_BUILD_RE) || [])[1] || null;
  const av = (html.match(/const APP_VERSION = "([^"]+)"/) || [])[1] || null;
  const swc = (sw.match(SW_CACHE_RE) || [])[1] || null;
  const clHead = (cl.match(CL_BETA_HEAD_RE) || [])[1] || null;
  const firstHead = (cl.match(/^## [^\n]*/m) || [''])[0];
  const maxWave = changelogMaxWave(cl);
  const f = bb ? bb.match(BETA_FORM_RE) : null;
  const nnn = f ? Number(f[3]) : null;
  // 便の番号: 明示(--wave)があればそれ・無ければ今の番号が窓 [最大, 最大+1] にあればそれ・無ければ最大
  const wave = opts.wave || ((nnn !== null && maxWave !== null && nnn >= maxWave && nnn <= maxWave + 1) ? nnn : maxWave);
  const want = betaBuildOf(av, wave);
  const res = {
    betaBuild: bb, appVersion: av, swCache: swc, changelogHead: clHead, changelogMaxWave: maxWave, wave, want,
    checks: {
      form: !!f,                                            // ① 形 v<X>.<Y>-b<NNN>
      line: !!f && !!want && want.split('-b')[0] === 'v' + f[1] + '.' + f[2],   // ② beta 線 = APP_VERSION の minor + 1
      wave: !!f && (opts.wave ? nnn === opts.wave : (maxWave !== null && nnn >= maxWave && nnn <= maxWave + 1)),   // ③ 便の番号 ∈ [CHANGELOG の行頭の最大, +1](--wave は厳密)
      sw: swc === bb,                                       // ④ beta/sw.js の CACHE 接尾辞
      changelog: clHead === bb && firstHead === '## ' + bb + '(開発中 — beta)',   // ⑤ CHANGELOG の先頭の節の見出し
    },
  };
  res.ok = Object.values(res.checks).every(Boolean);
  return res;
}
// 3 か所を規則の値へ(戻り値: 書いたファイルの一覧)
export function betaBuildApply(root, wave) {
  const st = betaBuildState(root, { wave });
  if (!st.want) throw new Error('規則の値が作れない(APP_VERSION ' + st.appVersion + '・便 ' + st.wave + ')');
  const out = [];
  const sub = (rel, re, mk) => {
    const p = path.join(root, rel), s = fs.readFileSync(p, 'utf8');
    const m = s.match(re); if (!m) throw new Error(rel + ' に対象の行が無い');
    const t = s.replace(re, mk);
    if (t !== s) { fs.writeFileSync(p, t); out.push(rel); }
  };
  sub('beta/index.html', BETA_BUILD_RE, () => `const BETA_BUILD = "${st.want}"`);
  sub('beta/sw.js', SW_CACHE_RE, () => `CACHE = CACHE_PREFIX + "${st.want}"`);
  sub('CHANGELOG.md', CL_BETA_HEAD_RE, () => `## ${st.want}(開発中 — beta)`);
  return { want: st.want, written: out };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const argv = process.argv.slice(2);
  const opt = (k) => { const i = argv.indexOf('--' + k); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null; };
  const ROOT = path.resolve(opt('root') || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
  const wave = opt('wave') ? Number(opt('wave')) : undefined;
  if (argv.includes('--apply')) {
    const r = betaBuildApply(ROOT, wave);
    console.log(`beta-build: ${r.want} を書いた —— ${r.written.length ? r.written.join(' , ') : '(すでに一致・書き換えなし)'}`);
  }
  const st = betaBuildState(ROOT, { wave });
  console.log(`beta-build: BETA_BUILD=${st.betaBuild}・規則の値=${st.want}(APP_VERSION ${st.appVersion} の次の線・便 ${st.wave} —— CHANGELOG の行頭の最大 ${st.changelogMaxWave})`
    + `・SW=${st.swCache}・CHANGELOG の見出し=${st.changelogHead} → `
    + Object.entries(st.checks).map(([k, v]) => (v ? '○' : '×') + k).join(' ') + (st.ok ? ' → OK' : ' → 食い違い(--apply で直す)'));
  if (argv.includes('--json')) console.log(JSON.stringify(st));
  process.exit(st.ok ? 0 : 1);
}

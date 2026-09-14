// 第263便d(第55報 W4): **昇格手順の器**。beta 線をルートへ上げるときの機械的な置換を 1 本にまとめ、
// **既定では 1 ファイルも書かずに差分を表示する**(`--dry-run`)。
//
// 何のための器か: v1.43 昇格コミット **37eefc4**(第219便)は 8 ファイルの手編集 + 1 バイトコピーで
// できている。手順書が散らばっていると版数の取り違え・SW 接頭辞の切替忘れが起きるので、
// **同じ置換を再現する 1 本**にした。**判定は QA と CI が行う**(この器は置換と検査だけをする)。
//
// **この器は版を切らない。** `--apply` を回しても「Release した」ことにはならない ——
// 昇格の可否は統括が全ゲート PASS を確認して裁定する。エージェントは `--dry-run` と
// **使い捨てコピーでの `--apply` → `--check`** までしか行わない(第263便d の取り決め)。
//
// 使い方:
//   node tests/release-promote.mjs                        … dry-run(既定・**書かない**)
//   node tests/release-promote.mjs --dry-run --json       … 同上・機械可読な 1 行 JSON も出す
//   node tests/release-promote.mjs --apply                … 適用(**統括だけ**)
//   node tests/release-promote.mjs --check                … 適用後の検査(6 項・書かない)
//   node tests/release-promote.mjs --root /tmp/copy --apply  … 使い捨てコピーで試す
// 主な引数:
//   --root <dir>        … 対象リポジトリのルート(既定: このファイルの 1 つ上)
//   --version <1.44>    … 昇格先の APP_VERSION(既定: 現 APP_VERSION の minor +1)
//   --beta-build <v1.45-b1> … 次期 beta 線(既定: 昇格先の minor +1 に "-b1")
//   --date <2026-09-14> … CITATION.cff の date-released と CHANGELOG 見出しの日付(既定: 実行日 UTC)
//   --json              … 結果を 1 行 JSON でも出す
// 終了コード: dry-run/apply は計画が立たなければ 1。--check は 1 件でも落ちれば 1。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---- 引数 ----
const argv = process.argv.slice(2);
function opt(name, def) {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
}
const HAS = (n) => argv.includes('--' + n);
const ROOT = path.resolve(opt('root', path.join(HERE, '..')));
const MODE = HAS('apply') ? 'apply' : HAS('check') ? 'check' : 'dry-run';
const WANT_JSON = HAS('json');

// ---- 37eefc4(v1.43 昇格)が触ったファイル ----
// 照合用の静的表。`git show 37eefc4 --stat` の 11 行をそのまま写した(この器の計画と突き合わせる)。
const REF_37EEFC4 = {
  sha: '37eefc47c6d9d7c0a154fc10043f3d5589f529e6',
  title: '第219便: v1.43.0 リリース昇格 — beta v1.43-b1 をルートへ',
  files: {
    'CHANGELOG.md': 'auto',        // 見出しの切り替えは自動・節の本文は手動
    'CITATION.cff': 'auto',
    'beta/index.html': 'auto',     // APP_VERSION / BETA_BUILD の 2 行だけ
    'beta/sw.js': 'auto',
    'docs/PHYSICS.md': 'manual',   // 37eefc4 の差分は**版表記ではなく本文の追認記録**だった
    'index.html': 'auto',          // beta/index.html の byte コピー
    'package-lock.json': 'auto',
    'package.json': 'auto',
    'sw.js': 'auto',
    'tests/out/qa-results-beta.json': 'gate-artifact', // ゲート再走行の副産物(手で編集しない)
    'tests/out/qa-results.json': 'gate-artifact',
  },
};

// ---- 読み ----
const rd = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const APP_RE = /const APP_VERSION = "([^"]+)"/;
const BETA_RE = /const BETA_BUILD = "([^"]+)"/;

const betaHtml0 = rd('beta/index.html');
const rootHtml0 = rd('index.html');
const curApp = (betaHtml0.match(APP_RE) || [])[1];
const curBeta = (betaHtml0.match(BETA_RE) || [])[1];
if (!curApp || !curBeta) { console.error('beta/index.html の APP_VERSION / BETA_BUILD が読めない'); process.exit(1); }

function bumpMinor(v) {                      // "1.43" → "1.44"
  const m = String(v).match(/^(\d+)\.(\d+)$/);
  if (!m) throw new Error('版数の形が違う: ' + v);
  return m[1] + '.' + (Number(m[2]) + 1);
}
const NEXT_APP = opt('version', bumpMinor(curApp));            // 1.44
const NEXT_BETA = opt('beta-build', 'v' + bumpMinor(NEXT_APP) + '-b1'); // v1.45-b1
const NEXT_PKG = NEXT_APP + '.0';                              // 1.44.0
const DATE = opt('date', new Date().toISOString().slice(0, 10));

// ---- 置換の計画(1 つの edit = 1 つの正確な文字列置換)----
const edits = [];   // {file, why, from, to, count}
const plan = [];    // 表示用の 1 行
function sub(file, why, from, to) {
  const src = rd(file);
  const n = src.split(from).length - 1;
  edits.push({ file, why, from, to, count: n });
  plan.push(`${n === 1 ? 'OK ' : 'NG '} ${file}  ${why}\n      - ${from}\n      + ${to}   (一致 ${n} 箇所・期待 1)`);
  return n === 1;
}

let ok = true;
// 1) beta/index.html — APP_VERSION と BETA_BUILD の 2 行だけ(**他は 1 bit も触らない**)
ok = sub('beta/index.html', 'APP_VERSION(昇格先)',
  `const APP_VERSION = "${curApp}"`, `const APP_VERSION = "${NEXT_APP}"`) && ok;
ok = sub('beta/index.html', 'BETA_BUILD(次期 beta 線)',
  `const BETA_BUILD = "${curBeta}"`, `const BETA_BUILD = "${NEXT_BETA}"`) && ok;
// 2) package.json / package-lock.json
ok = sub('package.json', 'npm パッケージ版数',
  `"version": "${curApp}.0"`, `"version": "${NEXT_PKG}"`) && ok;
{
  // package-lock は依存の "version" と混ざるので **"node_modules/" より前の頭だけ**を対象にする
  const src = rd('package-lock.json');
  const cut = src.indexOf('"node_modules/');
  const head = cut > 0 ? src.slice(0, cut) : src;
  const n = head.split(`"version": "${curApp}.0"`).length - 1;
  edits.push({ file: 'package-lock.json', why: 'lock の版数(頭 2 箇所のみ)', from: `"version": "${curApp}.0"`, to: `"version": "${NEXT_PKG}"`, count: n, headOnly: cut });
  plan.push(`${n === 2 ? 'OK ' : 'NG '} package-lock.json  lock の版数(頭 2 箇所のみ・依存の version は対象外)\n      - "version": "${curApp}.0"\n      + "version": "${NEXT_PKG}"   (一致 ${n} 箇所・期待 2)`);
  ok = (n === 2) && ok;
}
// 3) SW キャッシュ名(root=release / beta=次期 beta 線)
ok = sub('sw.js', 'root SW キャッシュ名(dfm-release-)',
  `CACHE = CACHE_PREFIX + "v${curApp}"`, `CACHE = CACHE_PREFIX + "v${NEXT_APP}"`) && ok;
ok = sub('beta/sw.js', 'beta SW キャッシュ名(dfm-beta-・BETA_BUILD と同値)',
  `CACHE = CACHE_PREFIX + "${curBeta}"`, `CACHE = CACHE_PREFIX + "${NEXT_BETA}"`) && ok;
// 4) CITATION.cff
{
  const cff = rd('CITATION.cff');
  const dm = cff.match(/^date-released: "([^"]+)"/m);
  ok = sub('CITATION.cff', '引用版数', `version: "${curApp}.0"`, `version: "${NEXT_PKG}"`) && ok;
  ok = sub('CITATION.cff', '公開日', `date-released: "${dm ? dm[1] : ''}"`, `date-released: "${DATE}"`) && ok;
}
// 5) CHANGELOG 見出し — 「開発中 — beta」の節を版の節に変え、新しい beta 節を上に足す
const CL_OLD = `## ${curBeta.replace(/^v/, 'v')}(開発中 — beta)`;   // 例: ## v1.44-b1(開発中 — beta)
// 見出しは **`## v1.44.0(`** の形でなければならない —— root 対象の QA `release.no-beta-identifiers`
// が `## v{APP_VERSION}.0(` を厳密に探すためである(第263便d の実測: 「## v1.44(RC・…)」だと落ちる)。
const CL_NEW = `## ${NEXT_BETA}(開発中 — beta)\n\n(v${NEXT_APP} 昇格直後 — エントリはまだ無い)\n\n## v${NEXT_PKG}(RC・${DATE})`;
ok = sub('CHANGELOG.md', '版の見出しを切り替え(RC 節を新設 + 次期 beta 節を上へ)', CL_OLD, CL_NEW) && ok;

// 6) index.html ← beta/index.html の byte コピー(**上の 2 行を替えたあと**)
const betaAfter = betaHtml0
  .split(`const APP_VERSION = "${curApp}"`).join(`const APP_VERSION = "${NEXT_APP}"`)
  .split(`const BETA_BUILD = "${curBeta}"`).join(`const BETA_BUILD = "${NEXT_BETA}"`);
const copyInfo = {
  file: 'index.html', why: 'beta/index.html の byte コピー(APP_VERSION 差し替え後)',
  bytesFrom: Buffer.byteLength(rootHtml0), bytesTo: Buffer.byteLength(betaAfter),
  sha256From: sha256(rootHtml0), sha256To: sha256(betaAfter),
};
plan.push(`OK  index.html  ${copyInfo.why}\n      - 現 root  ${copyInfo.bytesFrom} バイト  sha256 ${copyInfo.sha256From.slice(0, 16)}…\n      + 新 root  ${copyInfo.bytesTo} バイト  sha256 ${copyInfo.sha256To.slice(0, 16)}…`);

// 7) 手でしか書けないもの(**この器は書かない**)
const MANUAL = [
  ['CHANGELOG.md', `## v${NEXT_PKG}(RC・${DATE})の**本文**(便の主題要約・論文対応の注記・版別 DOI の扱い)`],
  ['docs/PHYSICS.md', '版に伴う本文の追記(37eefc4 の差分も版表記ではなく本文の追認記録だった)'],
  ['docs/RELEASE_NOTES_v1.44.md', 'HOLD 6 項の最終確認と「名乗らないもの」の再読'],
  ['tests/out/qa-results*.json', '**ゲートを再走行した副産物**(手で編集しない・昇格後の状態で root/beta 両対象を回す)'],
];

// ---- 37eefc4 との照合 ----
const planned = new Set([...edits.map((e) => e.file), 'index.html']);
const refAuto = Object.entries(REF_37EEFC4.files).filter(([, k]) => k === 'auto').map(([f]) => f);
const missing = refAuto.filter((f) => !planned.has(f));
const extra = [...planned].filter((f) => !(f in REF_37EEFC4.files));
const collate = { refFiles: Object.keys(REF_37EEFC4.files).length, auto: refAuto.length, planned: planned.size, missing, extra };

// ---- 適用後の検査(--check)----
function check() {
  const res = [];
  const put = (id, pass, msg) => { res.push({ id, pass, msg }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${id}  ${msg}`); };
  const rh = rd('index.html'), bh = rd('beta/index.html');
  const rApp = (rh.match(APP_RE) || [])[1], bApp = (bh.match(APP_RE) || [])[1];
  const rBeta = (rh.match(BETA_RE) || [])[1], bBeta = (bh.match(BETA_RE) || [])[1];
  const pkg = JSON.parse(rd('package.json'));
  // ① version.sync(tests/qa.mjs の 0b と同じ式)
  put('promote.version-sync', !!rApp && pkg.version.startsWith(rApp + '.'),
    `root APP_VERSION=${rApp} package.json=${pkg.version}`);
  // ② root と beta が APP_VERSION / BETA_BUILD 以外で一致(昇格直後は byte 同一になる)
  const norm = (s) => s.replace(APP_RE, 'const APP_VERSION = "*"').replace(BETA_RE, 'const BETA_BUILD = "*"');
  const same = norm(rh) === norm(bh);
  put('promote.root-equals-beta', same,
    same ? `2 行を伏せた本文が一致(sha256 ${sha256(norm(rh)).slice(0, 16)}…・byte 同一=${rh === bh})`
         : `本文が一致しない(root ${rh.length} 字 / beta ${bh.length} 字)— byte コピーが漏れている`);
  // ③ root SW キャッシュ名(tests/qa.mjs の version.sw-sync と同じ式)
  const sw = rd('sw.js');
  const rPre = (sw.match(/const CACHE_PREFIX = "([^"]+)"/) || [])[1];
  const rCache = (sw.match(/CACHE = CACHE_PREFIX \+ "([^"]+)"/) || [])[1];
  put('promote.sw-root', rPre === 'dfm-release-' && rCache === 'v' + rApp,
    `SW=${rPre}${rCache} 期待=dfm-release-v${rApp}`);
  // ④ beta SW キャッシュ名 == BETA_BUILD(tests/qa.mjs の version.beta-label と同じ対応)
  const bsw = rd('beta/sw.js');
  const bPre = (bsw.match(/const CACHE_PREFIX = "([^"]+)"/) || [])[1];
  const bCache = (bsw.match(/CACHE = CACHE_PREFIX \+ "([^"]+)"/) || [])[1];
  put('promote.sw-beta', bPre === 'dfm-beta-' && bCache === bBeta,
    `SW=${bPre}${bCache} BETA_BUILD=${bBeta}(root 側の BETA_BUILD=${rBeta}・root では未使用)`);
  // ⑤ CITATION.cff
  const cff = rd('CITATION.cff');
  const cv = (cff.match(/^version: "([^"]+)"/m) || [])[1];
  const cd = (cff.match(/^date-released: "([^"]+)"/m) || [])[1];
  put('promote.citation', cv === pkg.version && /^\d{4}-\d{2}-\d{2}$/.test(cd || ''),
    `CITATION version=${cv} date-released=${cd} package.json=${pkg.version}`);
  // ⑥ package-lock の頭 2 箇所
  const lock = rd('package-lock.json');
  const lhead = lock.slice(0, Math.max(0, lock.indexOf('"node_modules/')) || lock.length);
  const lockN = lhead.split(`"version": "${pkg.version}"`).length - 1;
  put('promote.lock-sync', lockN === 2, `package-lock の頭に "${pkg.version}" が ${lockN} 箇所(期待 2)`);
  // ⑦ CHANGELOG の見出し 2 本
  const cl = rd('CHANGELOG.md');
  const hasRC = cl.includes(`## v${rApp}.0(`);   // QA release.no-beta-identifiers と同じ式
  const hasNextBeta = new RegExp('^## v\\d+\\.\\d+-b1(?:\\(|\\()開発中', 'm').test(cl);
  put('promote.changelog-heading', hasRC && hasNextBeta,
    `RC 見出し「## v${rApp}.0(…」=${hasRC}(QA release.no-beta-identifiers と同じ式)/ 次期 beta 見出し「## vX.Y-b1(開発中 — beta)」=${hasNextBeta}`);
  const failed = res.filter((r) => !r.pass);
  console.log(`\n--check: ${res.length - failed.length}/${res.length} PASS` + (failed.length ? `  FAIL: ${failed.map((f) => f.id).join(' , ')}` : ''));
  if (WANT_JSON) console.log(JSON.stringify({ mode: 'check', res }));
  return failed.length === 0;
}

// ---- 実行 ----
console.log(`== tests/release-promote.mjs (${MODE}) ==`);
console.log(`ルート: ${ROOT}`);
if (MODE === 'check') process.exit(check() ? 0 : 1);

console.log(`昇格: APP_VERSION ${curApp} → ${NEXT_APP} / BETA_BUILD ${curBeta} → ${NEXT_BETA} / package ${curApp}.0 → ${NEXT_PKG} / date ${DATE}\n`);
console.log('-- 置換の計画(1 行 = 1 つの正確な文字列置換)--');
for (const l of plan) console.log(l);
console.log('\n-- この器が書かないもの(手で書く)--');
for (const [f, w] of MANUAL) console.log(`    ${f}  …  ${w}`);
console.log('\n-- 37eefc4(v1.43 昇格)との照合 --');
console.log(`    37eefc4 の変更ファイル ${collate.refFiles} 件(うち機械置換 ${collate.auto} 件)・本器の計画 ${collate.planned} 件`);
console.log(`    取りこぼし: ${missing.length ? missing.join(' , ') : 'なし'}`);
console.log(`    表に無い追加: ${extra.length ? extra.join(' , ') : 'なし'}`);
console.log(`    手動/副産物: ${Object.entries(REF_37EEFC4.files).filter(([, k]) => k !== 'auto').map(([f, k]) => f + '(' + k + ')').join(' , ')}`);

if (!ok) {
  console.error('\n** 置換の一致件数が期待と違う。適用しない。**(前の昇格の取り残しか、対象の文字列が動いている)');
  if (WANT_JSON) console.log(JSON.stringify({ mode: MODE, ok: false, curApp, curBeta, NEXT_APP, NEXT_BETA, NEXT_PKG, DATE, collate }));
  process.exit(1);
}

if (MODE === 'apply') {
  for (const e of edits) {
    const src = rd(e.file);
    let out;
    if (e.file === 'package-lock.json') {
      const cut = e.headOnly > 0 ? e.headOnly : src.length;
      out = src.slice(0, cut).split(e.from).join(e.to) + src.slice(cut);
    } else {
      out = src.split(e.from).join(e.to);
    }
    fs.writeFileSync(path.join(ROOT, e.file), out);
  }
  fs.writeFileSync(path.join(ROOT, 'index.html'), betaAfter);   // byte コピー(最後に置く)
  const back = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  console.log(`\n適用した。index.html ← beta/index.html byte コピー: 一致=${back === fs.readFileSync(path.join(ROOT, 'beta/index.html'), 'utf8')} sha256 ${sha256(back).slice(0, 16)}…`);
  console.log('次に: node tests/release-promote.mjs --check  →  フルゲート(root / beta 両対象)+ perf。**ゲートが最終裁定者である。**');
} else {
  console.log('\n(--dry-run: 1 ファイルも書いていない。適用は `--apply`・適用後は `--check`。**この器は版を切らない。**)');
}
if (WANT_JSON) console.log(JSON.stringify({
  mode: MODE, ok: true, curApp, curBeta, NEXT_APP, NEXT_BETA, NEXT_PKG, DATE,
  edits: edits.map(({ file, why, count }) => ({ file, why, count })),
  copy: copyInfo, manual: MANUAL.map(([f, w]) => ({ file: f, what: w })), collate,
}));

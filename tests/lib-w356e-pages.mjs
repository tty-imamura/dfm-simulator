// 第356便e(統括の検証項目 R517 —— 道具と戻り止めだけ・html は変えない): **公開のサイトを「ファイルをそのまま配る」形に保つ戻り止め**の判定を 1 か所に。
//   第355便で、リポジトリの根に空のファイル `.nojekyll` を置いた(原仮定者の回答(2026-11-26)「AN1152: 推奨」)。前の便が main に入った後、公開のページを作る道具
//   (Jekyll)が、文書の中の TeX の例の `{` の直後の `%` をタグの始まりとして読み、公開のページの生成が止まっていた。`.nojekyll` が在る間は、その変換を通らない。
//   pagesVerdict(st)   st = { tracked: [追跡されているファイルの道…], exists: 根の .nojekyll が在るか, size: その byte 数, heads: { 道: 頭の数十 byte の字 } }
//                       → { ok, bad: [理由…], counts }(純関数 —— git もファイルも読まない。読むのは呼ぶ側)
//   frontMatter(head)  頭の字が `---` の塊の始まり(BOM を許す・`---` の行)か
//   isPagesConfig(p)   道の名が Jekyll の設定のファイル(`_config.yml`・`_config.yaml` —— どの階層でも)か
//   headTargets(tracked)  頭を読む対象(追跡されている `.md`・`.markdown`・`.html`・`.htm`)
//   selfTest356e()     変異の自己試験(無い・追跡されていない・空でない・設定のファイルが足された・頭に `---` の塊を持つ .md / .html が足された ほか)
// 言わないこと: 「公開のサイトが直った・速くなった」(根のファイル 1 つと、変換を前提にしたファイルが 0 であることを見るだけ)。
export const LIB_VERSION = 'w356e-pages-lib-1';
export const PAGES_FAIL_NOTE = '公開のサイトが Jekyll の変換を通るようになり、文書の字(TeX の例の `{%` など)で生成が止まりうる';

/** 頭の字が `---` の塊(Jekyll の前置き)の始まりか */
export function frontMatter(head) {
  return typeof head === 'string' && /^﻿?---[ \t]*\r?\n/.test(head);
}

/** 道の名が Jekyll の設定のファイルか(どの階層でも) */
export function isPagesConfig(p) {
  return typeof p === 'string' && /(?:^|\/)_config\.ya?ml$/.test(p);
}

/** 頭を読む対象(追跡されている文書と html) */
export function headTargets(tracked) {
  return (tracked || []).filter((p) => typeof p === 'string' && /\.(?:md|markdown|html?)$/i.test(p));
}

/** 判定(純関数) */
export function pagesVerdict(st) {
  const s = st || {}, tracked = Array.isArray(s.tracked) ? s.tracked : [], heads = s.heads || {};
  const bad = [];
  if (!s.exists) bad.push('根に .nojekyll が無い');
  if (!tracked.includes('.nojekyll')) bad.push('.nojekyll が追跡されていない(git ls-files に無い)');
  if (s.exists && s.size !== 0) bad.push('.nojekyll が空でない(' + s.size + ' byte)');
  const cfg = tracked.filter(isPagesConfig);
  if (cfg.length) bad.push('Jekyll の設定のファイルが在る: ' + cfg.slice(0, 6).join('・'));
  const T = headTargets(tracked);
  const fm = T.filter((p) => frontMatter(heads[p]));
  if (fm.length) bad.push('頭に --- の塊を持つ追跡ファイル ' + fm.length + ' 本: ' + fm.slice(0, 6).join('・'));
  const noHead = T.filter((p) => typeof heads[p] !== 'string');
  if (noHead.length) bad.push('頭を読めなかった追跡ファイル ' + noHead.length + ' 本: ' + noHead.slice(0, 6).join('・'));
  return { ok: bad.length === 0, bad, counts: { tracked: tracked.length, headTargets: T.length, frontMatter: fm.length, config: cfg.length } };
}

/** 変異の自己試験(作りものの状態) */
export function selfTest356e() {
  const rows = [];
  const base = () => ({ tracked: ['.nojekyll', 'README.md', 'docs/PHYSICS.md', 'index.html', 'beta/index.html', 'tests/qa.mjs'], exists: true, size: 0,
    heads: { 'README.md': '# DFM\n', 'docs/PHYSICS.md': '# PHYSICS\n---\n', 'index.html': '<!doctype html>\n', 'beta/index.html': '<!DOCTYPE html>\n' } });
  const t = (name, mut, wantOk, wantRe) => {
    const st = base(); mut(st);
    const v = pagesVerdict(st);
    const ok = v.ok === wantOk && (!wantRe || v.bad.some((b) => wantRe.test(b)));
    rows.push({ name, ok, verdict: v.ok, bad: v.bad });
  };
  t('今の形(根に空の .nojekyll・追跡・前置きなし)→ 通る', () => {}, true);
  t('文書の途中の --- の行は前置きでない → 通る', (s) => { s.heads['docs/PHYSICS.md'] = '# x\n\n---\n'; }, true);
  t('.nojekyll が無い → 落ちる', (s) => { s.exists = false; s.tracked = s.tracked.filter((p) => p !== '.nojekyll'); }, false, /無い/);
  t('.nojekyll が在るが追跡されていない → 落ちる', (s) => { s.tracked = s.tracked.filter((p) => p !== '.nojekyll'); }, false, /追跡されていない/);
  t('.nojekyll が空でない → 落ちる', (s) => { s.size = 3; }, false, /空でない/);
  t('根に _config.yml が足された → 落ちる', (s) => { s.tracked.push('_config.yml'); }, false, /設定のファイル/);
  t('docs/_config.yaml が足された → 落ちる', (s) => { s.tracked.push('docs/_config.yaml'); }, false, /設定のファイル/);
  t('頭に --- の塊を持つ .md が足された → 落ちる', (s) => { s.tracked.push('docs/NEW.md'); s.heads['docs/NEW.md'] = '---\nlayout: default\n---\n# x\n'; }, false, /--- の塊/);
  t('頭に --- の塊を持つ .html が足された(BOM・CRLF)→ 落ちる', (s) => { s.tracked.push('beta/p.html'); s.heads['beta/p.html'] = '﻿---\r\ntitle: x\r\n---\r\n'; }, false, /--- の塊/);
  t('頭を読めない追跡ファイル → 落ちる', (s) => { s.tracked.push('docs/GONE.md'); }, false, /読めなかった/);
  t('前置きでない頭(---- の行・--- の後ろに字)→ 通る', (s) => { s.tracked.push('a.md', 'b.md'); s.heads['a.md'] = '----\n'; s.heads['b.md'] = '--- x\n'; }, true);
  t('_config.yml.bak・x_config.yml は設定のファイルでない → 通る', (s) => { s.tracked.push('_config.yml.bak', 'docs/x_config.yml'); }, true);
  return { version: LIB_VERSION, rows, ok: rows.every((r) => r.ok) };
}

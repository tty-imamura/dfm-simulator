// 第277便e(原仮定者の裁定(第67報)(4)「UI」): **実ブラウザでの目視相当の確認**を 1 本にまとめた器。
// QA(`ui.descOrder` / `ui.groupIcons` / `ui.descFoldSummary`)と**同じ判定式**を、
// **412×915 の縦画面**(原仮定者の実機に近い比率)で 1 度に回して数の表を出す。
//
// ここで測るのは 3 つだけ:
//   ① 「サンプルを選ぶ」のグループ見出しが**折り返さない**(名前の矩形が 1 つ・印/絵文字/件数が同じ行)。
//   ② 内蔵 **131 本**で「説明」タブの区画の並びが**新順**(第67報(4))である。
//   ③ 畳んだ「失敗から見る」「観測結果カード」の見出しに**状態語**があり、出所の内訳が出る。
//
// **このページでは物理を 1 つも測っていない**(表示の読み取りだけ)。1 bit 不変の契約は
// `tests/exp-w258c-bitsame.mjs` / `tests/exp-w272d-sigsame.mjs` が別に持つ。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//     node tests/exp-w277e-uicheck.mjs [対象html=beta/index.html] [幅x高=412x915]
// 終了コード: 1 つでも契約が崩れていれば 1。**正本 JSON は書かない**(標準出力だけ)。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.argv[2] || 'beta/index.html';
const VP = (process.argv[3] || '412x915').split('x').map(Number);
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const ctx = await browser.newContext({ viewport: { width: VP[0], height: VP[1] } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e.message || e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

// ---- ① グループ見出し(折り返し・絵文字・読み上げ名)
const g = await page.evaluate(() => {
  try { localStorage.removeItem('hp_pick_open'); } catch (_) {}
  ppOpen = {}; ppOpenTmp = {}; ppFilterSig = null; ppSearch = '';
  ppScale = 'all'; ppClass = 'all'; ppE = 'all';
  setShowAllSamples(true);
  HP.loadPreset('saturn', false);
  showPresetPicker();
  const out = [];
  for (const h of document.querySelectorAll('#ppList .ppGroupHead')) {
    const kids = [...h.children];
    const icon = kids.find((e) => e.classList.contains('ppGroupIcon'));
    const nm = kids.filter((e) => !e.classList.contains('ppGroupMark')
      && !e.classList.contains('ppGroupIcon') && !e.classList.contains('ppGroupCount'))[0];
    const tops = kids.map((e) => Math.round(e.getBoundingClientRect().top));
    out.push({ name: nm ? nm.textContent.trim() : '',
      icon: icon ? icon.textContent : '',
      ariaHidden: icon ? icon.getAttribute('aria-hidden') : null,
      rects: nm ? nm.getClientRects().length : 0,
      sameLine: (Math.max(...tops) - Math.min(...tops)) <= 4,
      headH: Math.round(h.getBoundingClientRect().height),
      headW: Math.round(h.getBoundingClientRect().width),
      iconFs: icon ? getComputedStyle(icon).fontSize : null });
  }
  const chip = document.querySelector('#ppModal .ppChip');
  const chipFs = chip ? getComputedStyle(chip).fontSize : null;
  setShowAllSamples(false);
  hidePresetPicker();
  try { localStorage.removeItem('hp_pick_open'); } catch (_) {}
  ppOpen = {};
  return { heads: out, chipFs, table: HP.GROUP_ICONS,
    alias: Object.keys(GROUP_ALIASES).map((a) => [a, GROUP_ALIASES[a], HP.gIcon(a), HP.gIcon(GROUP_ALIASES[a])]) };
});

// ---- ②③ 説明タブの並びと畳み見出しの状態語(内蔵 131 本の掃引)
const d = await page.evaluate(() => {
  HP.setLang('ja');
  const ANCH = [
    ['id', (e) => e.id === 'presetIdLine'],
    ['title', (e) => e.tagName === 'H4'],
    ['chips', (e) => e.id === 'classChips'],
    ['brief', (e) => e.className === 'descBriefHead'],
    ['notclaim', (e) => e.className === 'notClaimLine'],
    ['family', (e) => e.id === 'familyRow'],
    ['audit', (e) => e.id === 'avRow'],
    ['failure', (e) => e.classList && e.classList.contains('ffBox') && !e.classList.contains('ocBox')],
    ['ledger', (e) => e.id === 'cbDetails'],
    ['obscard', (e) => e.classList && e.classList.contains('ocBox')],
    ['claims', (e) => e.id === 'claimsDetails'],
    ['stdtests', (e) => e.classList && e.classList.contains('stdDetails')],
    ['body', (e) => e.className === 'descSectHead'],
  ];
  const o = { n: 0, badOrder: [], badTag: [], src: { verdict: 0, failureFirst: 0, none: 0 },
    nTagFf: 0, nTagOc: 0, maxLen: 0, longest: '', sections: HP.HELP_SECTIONS };
  document.querySelector('nav#tabs button[data-tab="help"]').click();
  for (const p of HP.allPresets()) {
    if (String(p.id).startsWith('custom_')) continue;
    o.n++;
    HP.loadPreset(p.id, false);
    const kids = [...document.querySelectorAll('#helpBody > *')];
    let last = -1, lastName = '—';
    for (const [nm, f] of ANCH) {
      const i = kids.findIndex(f);
      if (i < 0) continue;
      if (i < last) { o.badOrder.push(p.id + ':' + lastName + '>' + nm); break; }
      last = i; lastName = nm;
    }
    const st = HP.descFoldStatusOf(p);
    o.src[st ? st.src : 'none']++;
    if (st && st.text.length > o.maxLen) { o.maxLen = st.text.length; o.longest = p.emoji + ' ' + st.text; }
    const ff = document.querySelector('#helpBody .ffBox:not(.ocBox)');
    const oc = document.querySelector('#helpBody .ocBox');
    for (const [box, kind] of [[ff, 'ff'], [oc, 'oc']]) {
      if (!box) continue;
      const tag = box.querySelectorAll('summary.ffHead .ffFoldStatus');
      if (!st) { if (tag.length) o.badTag.push(p.id + ':' + kind + ':unexpected'); continue; }
      if (tag.length !== 1) { o.badTag.push(p.id + ':' + kind + ':' + tag.length); continue; }
      if (tag[0].textContent !== st.text) { o.badTag.push(p.id + ':' + kind + ':text'); continue; }
      if (box.open) { o.badTag.push(p.id + ':' + kind + ':open'); continue; }
      if (kind === 'ff') o.nTagFf++; else o.nTagOc++;
    }
  }
  HP.loadPreset('saturn', false);
  return o;
});

await ctx.close();
await browser.close();

const WANT = ['id', 'title', 'chips', 'brief', 'notclaim', 'family', 'audit', 'failure',
  'ledger', 'obscard', 'claims', 'stdtests', 'body', 'theory', 'external'];
const wrapBad = g.heads.filter((h) => h.rects !== 1 || !h.sameLine);
const iconBad = g.heads.filter((h) => !h.icon || h.ariaHidden !== 'true' || h.iconFs !== g.chipFs);
const aliasBad = g.alias.filter((r) => !r[2] || r[2] !== r[3]);
const secOk = JSON.stringify(d.sections) === JSON.stringify(WANT);

console.log('# 第277便e UI 確認  target=' + TARGET + '  viewport=' + VP[0] + '×' + VP[1]);
console.log('');
console.log('## ① グループ見出し(' + g.heads.length + ' 本)');
for (const h of g.heads)
  console.log('  ' + (h.icon || '—') + ' ' + h.name.padEnd(14) + ' 矩形 ' + h.rects
    + ' 行・同一行 ' + h.sameLine + '・高さ ' + h.headH + 'px/幅 ' + h.headW
    + 'px・aria-hidden=' + h.ariaHidden + '・font ' + h.iconFs);
console.log('  折り返し ' + wrapBad.length + ' 本 / 絵文字・大きさの不備 ' + iconBad.length
  + ' 本(チップ font ' + g.chipFs + ')/ 旧名 ' + g.alias.length + ' 件の不一致 ' + aliasBad.length + ' 件');
console.log('  最終表(' + Object.keys(g.table).length + ' 群): '
  + Object.keys(g.table).map((k) => g.table[k] + k).join(' / '));
console.log('');
console.log('## ② 説明タブの並び(内蔵 ' + d.n + ' 本)');
console.log('  区画 = ' + d.sections.join('→'));
console.log('  新順と一致 = ' + secOk + ' / 並びの逆転 ' + d.badOrder.length + ' 件 ['
  + d.badOrder.slice(0, 4).join(' ') + ']');
console.log('');
console.log('## ③ 畳み見出しの状態語');
console.log('  出所: 正式判定 ' + d.src.verdict + ' 本 / failureFirst ' + d.src.failureFirst
  + ' 本 / 無し ' + d.src.none + ' 本(計 ' + (d.src.verdict + d.src.failureFirst + d.src.none) + ')');
console.log('  札: 失敗から見る ' + d.nTagFf + ' 箱・観測結果カード ' + d.nTagOc + ' 箱 / 不備 '
  + d.badTag.length + ' 件 [' + d.badTag.slice(0, 4).join(' ') + ']');
console.log('  最長 ' + d.maxLen + ' 字(上限 60): ' + d.longest);
console.log('');
console.log('JSエラー=' + errs.length + (errs.length ? ' ' + errs.slice(0, 2).join(' | ') : ''));

const ok = wrapBad.length === 0 && iconBad.length === 0 && aliasBad.length === 0
  && secOk && d.badOrder.length === 0 && d.badTag.length === 0 && d.maxLen <= 60
  && d.n >= 131 && errs.length === 0;
console.log(ok ? 'ALL OK' : 'NG');
process.exit(ok ? 0 : 1);

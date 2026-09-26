// 第279便a(原仮定者の裁定(第69報)「各サンプルの状況確認: 各サンプルについて目的と状況を一覧化する
// (一覧の情報はサンプルの『概要』で利用する)」・統括の読み R59/R60): **サンプル状況の生成器**。
//
// ■ 何をするか(1 回の走行で 3 つを書く)
//   ① 原稿 tests/data-w279a-samplestatus-src.json(目的・状況・根拠 ID —— 手書き)と正本
//      tests/out/calaudit-w249.json(verdictLedger — 較正母集団 37 本の 4 値・代表量・欠け)・
//      tests/out/charonwin-w278b.json(⛄🌨️ の比較値)から、内蔵 133 本の status と概要(brief)を作り、
//      beta/index.html の生成領域 `// >>> w275a-generated: sample-status` を**書き換える**
//      (較正の語・合わない量・見込みは手で書かない)。
//   ② 書き換えた html を Chromium で開き、133 本すべてに status と宣言の概要が付いていること・
//      表と 1 字も違わないことを確かめる(食い違えば何も書かずに終了コード 1)。
//   ③ 一覧 docs/SAMPLE_STATUS_v1.45.md(群別の表)と正本 tests/out/samplestatus-w279a.json
//      (来歴 w272e-1)を書く。QA `docs.sampleStatus-sync`・`preset.statusLedger-sync` が照合する。
//
// ■ この器がしないこと
//   ・1 步も走らせない(宣言を読むだけ)。判定をしない(4 値は台帳の転記)。
//   ・根拠 ID が保存 QA(tests/out/qa-results-full-beta.json)で PASS でない・正本が無い行は**書かない**
//     (原稿の「達」を裏づけの無いまま載せない)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w279a-samplestatus.mjs
//       (--check を付けると何も書かずに照合だけする)
//   ④ 第282便(原仮定者の指示 2026-09-26「SAMPLE_STATUS には各サンプルの正本の再生成と QA に掛かった時間と内訳も記述する」):
//      一覧の末尾に **所要時間の節**を付ける —— 較正走行(calaudit の各本の壁時計・段別)・関与する再生成の段
//      (再生成表の実測秒と宣言本数)・保存 QA(id にその本の id を含む試験+claims の testId の所要と本数)。
//      **時間は測った値の転記であって判定ではない**(html の生成領域には入れない —— 時間で html を変えない)。
//   ⑤ 第283便e(原仮定者の裁定(第73報)・統括の検証項目 R88): 保存 QA の帰属を「試験の id が本の id を部分文字列として含む」から
//      **claims の testId + 原稿の明示 `qaTargets`** へ(`L.qaAttribution` —— どちらにも無い本は「帰属なし」)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w279a-samplestatus.mjs';
import { REGEN_STEPS } from './lib-w281a-regentable.mjs';
import { readDeclaredScope } from './lib-w281a-scope.mjs';
import { calStagesOf } from './lib-w283c-calstages.mjs';   // 第283便c: 段別の壁時計(二重加算の修正)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.join(ROOT, 'beta', 'index.html');
const SRC = 'tests/data-w279a-samplestatus-src.json';
const CAL = 'tests/out/calaudit-w249.json';
const WIN = 'tests/out/charonwin-w278b.json';
const QAF = 'tests/out/qa-results-full-beta.json';
// 第283便b(原仮定者の裁定(第73報)④・R84): 退役の本の凍結の写し(ゲートから外した試験の最後の保存 QA の値を持つ)
const RETIRED_FX = 'tests/fixtures/retired-w283b.json';
const OUT = 'tests/out/samplestatus-w279a.json';
const MD = 'docs/SAMPLE_STATUS_v1.45.md';
const CODE = ['tests/exp-w279a-samplestatus.mjs', 'tests/lib-w279a-samplestatus.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w283c-calstages.mjs'];
const CHECK = process.argv.includes('--check');

const rd = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const src = rd(SRC), calaudit = rd(CAL), charonwin = rd(WIN), qa = rd(QAF);
const qaIds = new Set((qa.results || []).filter((r) => r.pass).map((r) => r.id));
const outFiles = new Set(fs.readdirSync(path.join(ROOT, 'tests', 'out')).map((f) => 'tests/out/' + f));
// 第283便b: 退役の本(原稿の retired.ids)と、凍結の写しの履歴で PASS の試験
const fx = rd(RETIRED_FX);
const retiredIds = new Set(((src.retired || {}).ids) || []);
const historyIds = new Set(((fx.history || {}).tests || []).filter((t) => t.pass).map((t) => t.id));
const historyUsed = [];
const built = L.buildTable(src, calaudit, charonwin, { qaIds, outFiles, retiredIds, historyIds, historyUsed });
if (built.errors.length) {
  console.error('原稿/正本の検査で止めた(何も書いていない):\n  ' + built.errors.join('\n  '));
  process.exit(1);
}
const table = built.table;

// ---- ① html の生成領域を書き換える
const html0 = fs.readFileSync(HTML, 'utf8');
const meta = { version: L.STATUS_VERSION, generator: 'tests/exp-w279a-samplestatus.mjs', sources: [SRC, CAL, WIN] };
const region = L.renderRegion(table, meta);
const a = html0.indexOf(L.BEGIN), b = html0.indexOf(L.END);
if (a < 0 || b < 0) { console.error('html に生成領域 sample-status が無い'); process.exit(1); }
const html1 = html0.slice(0, a) + region + html0.slice(b + L.END.length);
const htmlChanged = html1 !== html0;
if (CHECK) {
  if (htmlChanged) { console.error('--check: html の生成領域が原稿+正本から作った表と違う'); process.exit(1); }
} else fs.writeFileSync(HTML, html1);

// ---- ② ページで確かめる
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const page = await browser.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e.message || e)));
await page.goto('file://' + HTML, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
const got = await page.evaluate(() => {
  const rows = [];
  const briefs = {};
  for (const lang of ['ja', 'en']) {
    HP.setLang(lang);
    for (const p of HP.allPresets()) {
      if (String(p.id).startsWith('custom_')) continue;
      (briefs[p.id] = briefs[p.id] || {})[lang] = { text: HP.descBriefOf(p), src: HP.descBriefSource(p) };
    }
  }
  HP.setLang('ja');
  for (const p of HP.allPresets()) {
    if (String(p.id).startsWith('custom_')) continue;
    rows.push({ id: p.id, emoji: p.emoji || '', name: p.name, enName: (p.en || {}).name || null,
      group: p.group, sampleClass: p.sampleClass || null, familyRole: p.familyRole || null,
      status: p.status || null, enStatus: (p.en || {}).status || null, brief: briefs[p.id],
      claimTests: Array.isArray(p.claims) ? [...new Set(p.claims.map((c) => c.testId).filter(Boolean))] : [] });
  }
  return { rows, groupOrder: (typeof GROUP_ORDER !== 'undefined') ? GROUP_ORDER.slice() : null,
    groupIcons: (typeof GROUP_ICONS !== 'undefined') ? Object.assign({}, GROUP_ICONS) : null,
    version: HP.SAMPLE_STATUS_VERSION };
});
await browser.close();

const bad = [];
if (errs.length) bad.push('ページのエラー: ' + errs.slice(0, 3).join(' / '));
const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);
for (const r of got.rows) {
  const t = table[r.id];
  if (!t) { bad.push(`${r.id}: 表に行が無い`); continue; }
  const want = { purpose: t.purpose, objective: t.objective, state: t.state, calibration: t.calibration,
    mismatch: t.mismatch, outlook: t.outlook, evidence: t.evidence };
  if (!eq(r.status, want)) bad.push(`${r.id}: p.status が表と違う`);
  const wantEn = { purpose: t.en.purpose, state: t.en.state, mismatch: t.en.mismatch, outlook: t.en.outlook };
  if (!eq(r.enStatus, wantEn)) bad.push(`${r.id}: p.en.status が表と違う`);
  if (r.brief.ja.text !== t.brief || r.brief.ja.src !== 'declared') bad.push(`${r.id}: ja の概要が宣言の表と違う`);
  if (r.brief.en.text !== t.en.brief || r.brief.en.src !== 'declared') bad.push(`${r.id}: en の概要が宣言の表と違う`);
}
if (got.rows.length !== Object.keys(table).length) bad.push(`内蔵 ${got.rows.length} 本 ≠ 表 ${Object.keys(table).length} 行`);
if (got.version !== L.STATUS_VERSION) bad.push(`html の版 ${got.version} ≠ ${L.STATUS_VERSION}`);
// 第283便b: 原稿の退役の宣言と html の familyRole:"retired" が同じ集合であること
{ const htmlRetired = got.rows.filter((r) => r.familyRole === 'retired').map((r) => r.id).sort();
  if (JSON.stringify(htmlRetired) !== JSON.stringify([...retiredIds].sort())) bad.push(`退役の集合が原稿(${[...retiredIds].join(',')})と html(${htmlRetired.join(',')})で違う`); }
if (bad.length) { console.error('ページの照合で止めた:\n  ' + bad.slice(0, 20).join('\n  ')); process.exit(1); }

// ---- ③ 一覧 md と正本
const tl = L.tally(table, got.rows);
const predEligible = ((calaudit.verdictLedger || {}).rows || []).reduce((s, r) => s + (r.predictionEligible || 0), 0);
// 第283便b(第73報④・R84): 退役の本は**群の集計から外し**、「退役」の別群として数える(html の status・4 値の集計は変えない)
const groups = (got.groupOrder || []).map((g) => ({ group: g, icon: (got.groupIcons || {})[g] || '',
  ids: got.rows.filter((r) => r.group === g && !retiredIds.has(r.id)).map((r) => r.id) }));
const retiredRows = got.rows.filter((r) => retiredIds.has(r.id)).map((r) => r.id);
const orphan = got.rows.filter((r) => !(got.groupOrder || []).includes(r.group)).map((r) => r.id);
if (orphan.length) { console.error('群の無い本: ' + orphan.join(' ')); process.exit(1); }

const md = [];
md.push('# サンプル状況一覧(v1.45-b1・第279便a)');
md.push('');
md.push('> **この文書は生成物である —— 手で直さない。** 器 `tests/exp-w279a-samplestatus.mjs` が、原稿 `' + SRC + '`(目的・状況・根拠 ID)と正本 `' + CAL + '`(verdictLedger)・`' + WIN + '`(⛄🌨️ の比較値)から作り、`beta/index.html` の生成領域 `sample-status` と正本 `' + OUT + '` を同時に書く。QA `docs.sampleStatus-sync`(この表 ↔ html ↔ 正本)と `preset.statusLedger-sync`(html の較正欄 ↔ calaudit)が照合する。');
md.push('> 原仮定者の裁定(第69報)「各サンプルについて目的と状況を一覧化する(一覧の情報はサンプルの『概要』で利用する)」への対応。アプリの「説明」タブの 🔖概要(1 行 3 節「目的。状況。較正。」)と状態チップは、この表と同じ宣言から出ている。');
md.push('');
md.push('## 読み方');
md.push('');
md.push('- **3 つの欄は別の問いである。** 「保存 QA が通った」「サンプルの目的に達した」「観測との較正が成り立つ」は同じことではない —— 1 つの語に混ぜない。');
md.push('- **状況**(目的の達成)の語: **達** = 根拠に挙げた保存 QA(`tests/out/qa-results-full-beta.json` で PASS)または完成門が、サンプルの目的そのものを測って通っている。**部分** = 目的の一部だけが測られている(受理・構築・画像回帰だけの本、照合の走行は台帳にあるが門を通った量が全部ではない本を含む)。**未達** = 目的を測る門・量が外れている。**対象外** = 本便では使っていない。根拠 ID の無い「達」は書かない(器が止める)。');
md.push('- **較正**の語: 較正母集団 37 本は **4 値の台帳の正式語**(合・量限定合・否・保留 —— `' + CAL + '` の verdictLedger の転記)。⛄🌨️ は **判定保留(量定義不一致)**(母集団の外の表示 —— 第 5 の値ではない)。それ以外は **較正対象外**(観測との合否をこの一覧では書かない)。合否の語は門(3σ)に入る本だけに付く。');
md.push('- **合わない量と差**: 代表量が 3σ を外れていればその量の差 %(σ 倍)。σ が無い本は、写像が確定していて目安判定が外れている量のうち差が最大のもの(「σ なし」と明記)。どれも無ければ「—」。⛄🌨️ は Buie 2012 に対する**比較値**(門ではない)。');
md.push('- **精度見込み**: 正本の数から決まる語だけを書く —— 「σ 未接続」(観測の σ が繋がっていない)・「数値未解決」(刻みの収束が門の予算に入っていない)・「写像未確定」(量の対応が決まっていない)・「刻み間差 xσ・刻みでは縮まない」(門で否かつ刻みで動く幅が 1σ 未満)。**刻みを細かくすれば合格に移るという予測は、正本に証拠付きの行が 0 件である**(`predictionEligible` の合計 ' + predEligible + ')—— この一覧もその予測を書かない。');
md.push('');
md.push('## 集計');
md.push('');
md.push(`- 内蔵 **${tl.n} 本**(群 ${groups.length}・うち 0 本の群 ${groups.filter((g) => !g.ids.length).length})。`);
if (retiredRows.length) md.push(`- うち **退役 ${retiredRows.length} 本**(原仮定者の裁定(第73報)④ —— 内蔵には残る・サンプル一覧に出ない)は**群の集計から外し**、下の「退役」節に別群として並べる(状況と較正の集計は内蔵の全本で数える)。`);
md.push(`- 状況: **達 ${tl.objective.met}・部分 ${tl.objective.partial}・未達 ${tl.objective.unmet}・対象外 ${tl.objective['n/a']}**。`);
md.push(`- 較正: 4 値(合/量限定合/否/保留)**${tl.four['合']}/${tl.four['量限定合']}/${tl.four['否']}/${tl.four['保留']}**(台帳の転記)・判定保留(量定義不一致)**${tl.calibration['hold-definition']}**・較正対象外 **${tl.calibration['out-of-scope']}**。`);
md.push('');
md.push('| 群 | 本数 | 達 | 部分 | 未達 | 4 値の本 | 判定保留(量定義不一致) | 較正対象外 |');
md.push('|---|---|---|---|---|---|---|---|');
for (const g of groups) {
  const T = g.ids.map((id) => table[id]);
  const c = (f) => T.filter(f).length;
  md.push(`| ${g.icon} ${g.group} | ${g.ids.length} | ${c((t) => t.objective === 'met')} | ${c((t) => t.objective === 'partial')} | ${c((t) => t.objective === 'unmet')} | ${c((t) => ['pass', 'pass-limited', 'fail', 'hold'].includes(t.calibration))} | ${c((t) => t.calibration === 'hold-definition')} | ${c((t) => t.calibration === 'out-of-scope')} |`);
}
md.push('');
const byId = Object.fromEntries(got.rows.map((r) => [r.id, r]));
for (const g of groups) {
  md.push(`## ${g.icon} ${g.group}(${g.ids.length} 本)`);
  md.push('');
  if (!g.ids.length) { md.push('(内蔵サンプルは 0 本)'); md.push(''); continue; }
  md.push('| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |');
  md.push('|---|---|---|---|---|---|---|---|');
  for (const id of g.ids) md.push(L.mdRow(byId[id], table[id]));
  md.push('');
}
if (retiredRows.length) {
  md.push(`## 🗄️ 退役(${retiredRows.length} 本)`);
  md.push('');
  md.push('> 原仮定者の裁定(第73報)④「ダークローター関連の一部は不用なので廃止の方向」による**退役**(`familyRole:"retired"`)。**BUILTIN_PRESETS からは消していない**(旧セーブ・履歴の正本・過去の記録が ID で参照する)。物理・署名・保存 JSON・status は変えていない。ゲートから外した試験の最後の保存 QA の値は凍結の写し `' + RETIRED_FX + '` に転記してあり、根拠の裏づけはその履歴で行う' + (historyUsed.length ? `(${historyUsed.map((z) => '`' + z.split(':')[1] + '`').join('・')})` : '') + '。');
  md.push('');
  md.push('| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |');
  md.push('|---|---|---|---|---|---|---|---|');
  for (const id of retiredRows) md.push(L.mdRow(byId[id], table[id]));
  md.push('');
}
// ---- ④ 所要時間(第282便・原仮定者の指示 2026-09-26): 測った値の転記だけ(判定ではない)
const fmtS = (x) => (x >= 100 ? String(Math.round(x)) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
const stepScope = new Map();   // step.key → {presets:'all'|[...], harness}
for (const st of REGEN_STEPS) {
  if (st.role === 'history') continue;
  const m = st.cmd.match(/tests\/exp-[\w-]+\.mjs/);
  const decl = m && fs.existsSync(path.join(ROOT, m[0])) ? readDeclaredScope(fs.readFileSync(path.join(ROOT, m[0]), 'utf8')) : null;
  stepScope.set(st.key, { presets: decl ? decl.presets : null, harness: m ? m[0] : null });
}
const stepsCurrent = REGEN_STEPS.filter((z) => z.role !== 'history');
const secAll = stepsCurrent.reduce((a, z) => a + (z.sec || 0), 0);
const secAlways = stepsCurrent.filter((z) => z.alwaysRun).reduce((a, z) => a + (z.sec || 0), 0);
const undeclaredSteps = stepsCurrent.filter((z) => !z.alwaysRun && !stepScope.get(z.key).presets);
const secUndeclared = undeclaredSteps.reduce((a, z) => a + (z.sec || 0), 0);
const calById = Object.fromEntries((calaudit.presets || []).map((p) => [p.id, p]));
const qaAll = (qa.results || []);
// 第283便e(統括の検証項目 R88): QA の帰属は claims の testId + 原稿の明示 qaTargets だけ(部分文字列の一致をやめた)
const qaAttr = L.qaAttribution(got.rows, src, qaAll);
const timing = {};
for (const r of got.rows) {
  const id = r.id;
  // (a) 較正走行: calaudit の段別の壁時計。第283便c(統括の検証項目 R86 (i)): **timeBudget[] に dt/8 がある走行では
  //     dtEighth.wallSec を足さない**(第282便は両方を足していた —— ❄️ 716 s → 正しくは 467 s・37 本で 544 s の過大)。
  //     旧形式(dtEighth だけの記録)は dtEighth を読む。転記した段(skippedBy:"reuse")はこの走行の時間に数えない。
  const cp = calById[id];
  const cs = calStagesOf(cp && cp.run);
  const stages = cs.stages;
  const calSec = cs.wallSec;
  // (b) 関与する再生成の段(領域を宣言した段のうち、この本を宣言に含むもの —— 段の所要は宣言した本で共有)
  const steps = [];
  for (const st of stepsCurrent) {
    const sc = stepScope.get(st.key);
    if (!sc.presets) continue;
    if (sc.presets === 'all' || sc.presets.includes(id)) steps.push({ key: st.key, sec: st.sec || 0, share: sc.presets === 'all' ? 'all' : sc.presets.length, always: !!st.alwaysRun });
  }
  // (c) 保存 QA(第283便e): claims の testId + 原稿の明示 qaTargets の試験(所要は試験ごと・複数の本で重なりうる)。どちらにも無い本は帰属なし
  const qa1 = qaAttr.byId[id];
  timing[id] = { calaudit: { wallSec: calSec, stages, reusedSec: cs.reusedSec }, regenSteps: steps,
    qa: { attributed: qa1.attributed, n: qa1.n, ms: qa1.ms, tests: qa1.tests.slice(0, 5) } };
}
md.push('## 所要時間(正本の再生成と QA)');
md.push('');
md.push('> **測った値の転記であって判定ではない**(第282便・原仮定者の指示 2026-09-26)。時間は html の生成領域に入れない(時間で html を変えない)。数は `tests/lib-w281a-regentable.mjs`(段の実測秒)・`' + CAL + '`(各本の壁時計)・`' + QAF + '`(試験ごとの所要 ms)の転記で、走行のたびに変わる。');
md.push('');
md.push('- **較正走行(calaudit)**: 較正母集団の各本を calaudit が走らせた壁時計(段 dt / dt/2 / dt/4 の和・`presets[].run.timeBudget[].wallSec`。第283便c: dt/8 は常時の鎖から外した —— 旧形式の記録だけ dt/8 を 1 回数える・転記した段〔再利用〕は和に入れず「元 N s」を添える)。母集団の外の本は「—」。');
md.push('- **関与する再生成の段**: 領域(REGEN_SCOPE)を宣言した段のうち、この本を宣言に含むもの。表記「段 秒/本数」は**段 1 回の実測秒とその段が宣言した本数**(所要は宣言した本で共有する —— 本ごとに足し上げない)。all は全プリセットを走査する段。');
md.push(`- **宣言の無い段**(対象 html の全体に縛られ、どの本に関与するかを宣言していない ${undeclaredSteps.length} 段・実測 ${fmtS(secUndeclared)} s)と**常時群**(${stepsCurrent.filter((z) => z.alwaysRun).length} 段・実測 ${fmtS(secAlways)} s・毎回走る)は本ごとの行に配らない。現行の段 ${stepsCurrent.length} 段の実測秒の和 ${fmtS(secAll)} s(${(secAll / 3600).toFixed(2)} h・逐次の上限。履歴の段は除く)。`);
md.push(`- **保存 QA**: \`${QAF}\`(${qa.total || qaAll.length} 試験・全体 ${fmtS((qa.durationMs || 0) / 1000)} s${qa.commit ? '・commit ' + String(qa.commit).slice(0, 7) : ''})のうち、**その本の claims が挙げる testId と、原稿 \`${SRC}\` の \`qaTargets\` がその本を挙げた試験**(帰属 ${qaAttr.version} —— 試験の id の部分文字列では帰属させない)の所要の和と本数(1 つの試験が複数の本に数えられうる —— 本ごとの列は重なりを含む)。どちらにも無い本は「帰属なし」(${qaAttr.unattributed.length} 本)。内訳は所要の上位 3。`);
md.push('');
md.push('| 本 | 較正走行(s) | 段別(s) | 関与する再生成の段(段 秒/本数) | 保存 QA(s・本数) | QA の内訳(上位 3) |');
md.push('|---|---|---|---|---|---|');
for (const id of groups.flatMap((g) => g.ids).concat(retiredRows)) {
  const r = byId[id], t = timing[id];
  const cal = t.calaudit.stages.length ? fmtS(t.calaudit.wallSec) : '—';
  const st = t.calaudit.stages.length ? t.calaudit.stages.map((z) => z.reused ? `${z.tag} 再利用(元 ${fmtS(z.wallSec)})` : `${z.tag} ${fmtS(z.wallSec)}`).join('・') : '—';
  const steps = t.regenSteps.length ? t.regenSteps.map((z) => `${z.key} ${fmtS(z.sec)}/${z.share}`).join('・') : '—';
  const qs = t.qa.attributed ? `${fmtS(t.qa.ms / 1000)}・${t.qa.n}` : '帰属なし';
  const top = t.qa.tests.slice(0, 3).map((z) => `\`${z.id}\` ${fmtS(z.ms / 1000)}`).join('・') || '—';
  md.push(`| ${r.emoji || ''} \`${id}\` | ${cal} | ${st} | ${steps} | ${qs} | ${top} |`);
}
md.push('');
const mdText = md.join('\n');
const mdBad = mdText.split('\n').filter((l) => L.FORBIDDEN.test(l.replace(/[「『][^」』]*[」』]/g, '')));
if (mdBad.length) { console.error('一覧に禁止語: ' + mdBad.slice(0, 3).join(' / ')); process.exit(1); }

const canon = {
  meta: Object.assign({ wave: '第279便a', statusVersion: L.STATUS_VERSION,
    rule: '較正の語・合わない量・見込みは正本(calaudit verdictLedger / charonwin grid)から機械で作る。状況の語は根拠 ID(保存 QA で PASS・正本の存在)で裏づくものだけ。',
    doNotWrite: ['較正した', '較正を完了', '観測と一致した', '精度を上げれば合格', '判定が増えた'] },
  provenanceMeta({ root: ROOT, wave: '第279便a', target: 'beta/index.html', code: CODE,
    inputs: [SRC, CAL, WIN, MD, RETIRED_FX] }),
    // 保存 QA は**全走行のたびに書き換わる**ので来歴の inputs には入れない(入れると lint.provenanceMeta が
    // フル QA のたびに落ちる)。根拠 ID の照合に使った保存 QA の commit と件数だけを記録する
    { evidenceQa: { file: QAF, commit: qa.commit || null, date: qa.date || null, pass: qaIds.size } }),
  tally: Object.assign({}, tl, { predictionEligible: predEligible,
    byGroup: groups.map((g) => ({ group: g.group, icon: g.icon, n: g.ids.length })),
    retired: { n: retiredRows.length, ids: retiredRows, historyEvidence: historyUsed } }),
  rows: got.rows.map((r) => Object.assign({ id: r.id, emoji: r.emoji, name: r.name, group: r.group,
    sampleClass: r.sampleClass }, { status: table[r.id], ledgerSource: built.provenance[r.id] || null, timing: timing[r.id] })),
  timingNote: { since: '第282便(原仮定者の指示 2026-09-26)', what: '各本の較正走行の壁時計(calaudit の段別)・関与する再生成の段(実測秒/宣言本数・共有)・保存 QA の所要(claims の testId+原稿の qaTargets —— 第283便e・重なりあり)。判定ではない',
    regenSteps: stepsCurrent.length, regenSecSum: secAll, alwaysSec: secAlways, undeclaredSteps: undeclaredSteps.length, undeclaredSec: secUndeclared,
    qaTotal: qa.total || qaAll.length, qaDurationMs: qa.durationMs || null,
    qaAttribution: { version: qaAttr.version, rule: 'claims の testId + 原稿の qaTargets(明示)', unattributed: qaAttr.unattributed.length } },
};
if (CHECK) {
  const prev = fs.existsSync(path.join(ROOT, MD)) ? fs.readFileSync(path.join(ROOT, MD), 'utf8') : null;
  if (prev !== mdText) { console.error('--check: 一覧 md が生成物と違う'); process.exit(1); }
  console.log('--check: html・一覧 md は原稿+正本からの生成物と一致');
} else {
  fs.writeFileSync(path.join(ROOT, MD), mdText);
  // md を書いた後に来歴を取り直す(inputs に md 自身の sha を刻む)
  canon.meta = Object.assign({}, canon.meta, provenanceMeta({ root: ROOT, wave: '第279便a', target: 'beta/index.html',
    code: CODE, inputs: [SRC, CAL, WIN, MD, RETIRED_FX] }));
  fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(canon, null, 1));
}
const maxJa = Math.max(...Object.values(table).map((t) => t.brief.length));
const maxEn = Math.max(...Object.values(table).map((t) => t.en.brief.length));
console.log(JSON.stringify({ n: tl.n, objective: tl.objective, four: tl.four,
  holdDefinition: tl.calibration['hold-definition'], outOfScope: tl.calibration['out-of-scope'],
  briefMax: { ja: maxJa, en: maxEn }, htmlChanged, predictionEligible: predEligible,
  groups: groups.map((g) => g.icon + g.ids.length).join(' ') }));

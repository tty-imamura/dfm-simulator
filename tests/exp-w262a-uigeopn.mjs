// 第262便a(第54報)「**測地線モード geoPN を 3 にした時に、初めからで 2 になるので、修正する**」の
// **実機再現と、直ったことの確認**。ブラウザの UI(スライダー・直値欄・⏮ 初めから)を実際に叩く。
//
// ■ 何が起きていたか(基点 html で再現する)
//   `S.updateRadii()` の中の geoPN=3 の門(第259便a)が、**受理条件を 1 つでも欠くと
//   `S.params.geoPN` を 2 へ書き換えて**いた。パラメータ行の `setParam` は geoPN を書いた直後に
//   `updateRadii()` を呼ぶので、**スライダーを 3 にした瞬間に値は 2 へ戻っていた**
//   (つまみは 3 の位置に残り、直値欄だけが 2 になる)。「⏮ 初めから」は `buildParamRows()` で
//   行を作り直すので、そこで**つまみも 2 へ落ちる** —— 利用者から見た症状はここで出るが、
//   **原因は ⏮ の側ではない**。
//
// ■ 直したあと(候補 html で確認する)
//   ① lawVersion 未宣言は理由にしない(実行時の既定 "scalar" を `dfmGeoToyStep` が読む)。
//   ② 入場条件(kFrame=0・inertia/weave と排他)が立たないときは **3 のまま** `S.geoToyDeny` と
//      `S.geoToyStop="denied"` を立て、`geoCoreDispatch` が `_core` へ 2 を渡す
//      (**力学は第259便a の丸めと 1 bit 同じ**)。
//   ③ ⏮ の前後で `S.params.geoPN` が 3 のまま保たれ、行のつまみも 3 に戻る。
//
// 実行: node tests/exp-w262a-uigeopn.mjs [beta/_w262_base.html] [beta/index.html]
// 出力: tests/out/uigeopn-w262a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'uigeopn-w262a.json');
const TARGETS = process.argv.slice(2);
const FILES = TARGETS.length ? TARGETS : ['beta/index.html'];
// 📻 は kFrame=0 で spaceMesh の宣言が無い(= 修正後は 3 が通る)。
// ⚡ は kFrame=1(= 修正後も入場条件が立たない → 3 のまま denied)。
// ☿ mercury は kFrame=0 の原理サンプル(spaceMesh 宣言なし)。
const CASES = ['psrDoubleAB', 'psrDoubleABDFM', 'mercury'];

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const out = { meta: { wave: '第262便a', files: FILES,
  symptom: 'UI で geoPN を 3 にすると **その場で** params が 2 へ戻る(つまみは 3 に残る)。'
    + '「⏮ 初めから」は行を作り直すのでつまみも 2 に落ちる —— 症状が見える場所であって原因ではない。',
  fix: '① lawVersion 未宣言は実行時の既定 "scalar" で補う ② 入場条件が立たないときは 3 のまま '
    + 'geoToyDeny/geoToyStop="denied" を立て、`_core` へは 2 を渡す(力学は従来の丸めと 1 bit 同じ)。' },
  runs: [], pageErrors: [] };

for (const f of FILES) {
  const pg = await browser.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(String(e.message || e)));
  await pg.goto('file://' + path.join(ROOT, f), { waitUntil: 'load' });
  await pg.waitForFunction(() => window.HP && HP.sim);
  const r = await pg.evaluate((CASES) => {
    const row = () => {
      const labs = Array.from(document.querySelectorAll('#paramRows .prow label'));
      const l = labs.find((z) => /geoPN/.test(z.textContent));
      if (!l) return null;
      const p = l.parentElement;
      return { rng: p.querySelector('input[type=range]'), num: p.querySelector('input.valIn') };
    };
    const snap = (S) => ({ params: S.params.geoPN, hasGeoToy: !!S.hasGeoToy,
      deny: (S.geoToyDeny === undefined) ? null : S.geoToyDeny, stop: S.geoToyStop });
    const probe = (id) => {
      HP.loadPreset(id, false);
      const S = HP.sim;
      const rec = { id, presetGeoPN: S.params.geoPN };
      const f0 = row();
      if (!f0) { rec.err = 'geoPN の行が無い'; return rec; }
      // ① スライダーを 3 へ(UI 経由)
      f0.rng.value = '3';
      f0.rng.dispatchEvent(new Event('input', { bubbles: true }));
      const f1 = row();
      rec.afterSlider = { ...snap(S), num: f1.num.value, rng: f1.rng.value };
      // ② 「⏮ 初めから」
      document.querySelector('#btnReset').click();
      const f2 = row();
      rec.afterReset = { ...snap(S), num: f2 ? f2.num.value : null, rng: f2 ? f2.rng.value : null };
      // ③ 1 步進めて停止理由を読む(受理されていればトイが走る)
      S.step(0.016);
      rec.afterStep = snap(S);
      // ④ 直値欄から 2 へ戻す(往復)
      const f3 = row();
      f3.num.value = '2'; f3.num.dispatchEvent(new Event('change', { bubbles: true }));
      const f4 = row();
      rec.backTo2 = { ...snap(S), num: f4.num.value, rng: f4.rng.value };
      return rec;
    };
    return { cases: CASES.map(probe) };
  }, CASES);
  out.runs.push({ file: f, ...r, pageErrors: errs });
  for (const c of r.cases) {
    console.error(`  [${f}] ${c.id}: スライダー3 → params=${c.afterSlider.params}`
      + `(num ${c.afterSlider.num}・つまみ ${c.afterSlider.rng}・deny ${c.afterSlider.deny})`
      + ` / ⏮ 後 params=${c.afterReset.params}(つまみ ${c.afterReset.rng})`
      + ` / 1 步後 stop=${c.afterStep.stop} hasGeoToy=${c.afterStep.hasGeoToy}`
      + ` / 2 へ戻す params=${c.backTo2.params}`);
  }
  await pg.close();
}
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w262a] wrote ' + OUT);

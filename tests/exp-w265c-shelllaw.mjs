// 第265便c(第57報 W3・Z6 後半): **殻項 M_s 法則版を 122 本へ強制したときの影響**を測る器。
// **既定は変えない** —— ここで測るのは「もし既定を "shell" にしたら何が動くか」という
// 採用判断の材料であって、内蔵プリセットの JSON は 1 バイトも書き換えない(deep copy の上で測る)。
//
// 測るもの:
//   ① body ごとの Q の変化率(宣言の段の解析式 —— `coreV2ReplaceAxes` と同じ Q の式)。
//   ② **600 步の軌道差**: 同じプリセットを (a) 既定 "total" と (b) 全コアへ "shell" を強制した
//      複製とで 600 步走らせ、x/y/vx/vy/spin の最大絶対差・最大相対差を取る。
//      Q を読む経路は `physics.spinSpin`(opt-in の玩具)だけなので、宣言の無い本では
//      **Q が変わっても軌道は 1 bit も動かない**はずである —— それを数で確かめる。
//   ③ spinSpin を宣言している内蔵の一覧(= 軌道差が出うる本の候補)。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib node tests/exp-w265c-shelllaw.mjs beta/index.html
// 出力: JSON(標準出力 + W265C_OUT)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const STEPS = Number(process.env.W265C_STEPS || 600);

let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

async function measure(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = await page.evaluate((steps) => {
    const SS = 'spinSpin';
    const force = (p) => { const q = JSON.parse(JSON.stringify(p));
      let n = 0;
      for (const b of (q.bodies || [])) if (b && b.core && b.core.mode !== 'cavity') {
        b.core.shellSpinMass = 'shell'; n++; }
      return { q, n }; };
    const runOne = (p) => {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const S = HP.sim; S.build(v.preset);
      const q0 = []; for (let i = 0; i < S.n; i++) q0.push(HP.dfmSpinDipoleMoment(i, S));
      for (let k = 0; k < steps; k++) S.step(0.016);
      const st = []; for (let i = 0; i < S.n; i++) st.push([S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]]);
      return { q0, st, n: S.n, nan: S.hasNaN(), warn: v.warnings ? v.warnings.length : 0 };
    };
    const rows = [], ssIds = [];
    for (const p of HP.allPresets()) {
      const lam = (p.physics && p.physics[SS]) || 0;
      if (lam) ssIds.push((p.emoji || '') + p.id + ' (' + SS + '=' + lam + ')');
      const f = force(p);
      if (!f.n) continue;                       // コア宣言が無い本は測らない
      const a = runOne(p), b = runOne(f.q);
      let dQmax = 0, dQrel = 0, dS = 0, dSrel = 0;
      const nn = Math.min(a.q0.length, b.q0.length);
      for (let i = 0; i < nn; i++) { const d = Math.abs(a.q0[i] - b.q0[i]);
        if (d > dQmax) dQmax = d;
        const den = Math.max(Math.abs(a.q0[i]), Math.abs(b.q0[i]));
        if (den > 0 && d / den > dQrel) dQrel = d / den; }
      const ns = Math.min(a.st.length, b.st.length);
      for (let i = 0; i < ns; i++) for (let k = 0; k < 5; k++) {
        const d = Math.abs(a.st[i][k] - b.st[i][k]);
        if (d > dS) dS = d;
        const den = Math.max(Math.abs(a.st[i][k]), Math.abs(b.st[i][k]));
        if (den > 0 && d / den > dSrel) dSrel = d / den; }
      rows.push({ id: (p.emoji || '') + p.id, nCoreForced: f.n, lam,
        dQmax, dQrel, d600: dS, d600rel: dSrel, nA: a.n, nB: b.n,
        nanA: a.nan, nanB: b.nan, dWarn: b.warn - a.warn });
    }
    const moved = rows.filter((r) => r.dQmax !== 0);
    const orbit = rows.filter((r) => r.d600 !== 0);
    return { nPresets: HP.allPresets().length, nWithCore: rows.length,
      nQMoved: moved.length, nOrbitMoved: orbit.length, spinSpinPresets: ssIds,
      qMoved: moved.map((r) => ({ id: r.id, dQrel: r.dQrel, dQmax: r.dQmax, d600: r.d600, lam: r.lam }))
        .sort((x, y) => y.dQrel - x.dQrel),
      orbitMoved: orbit, rows };
  }, STEPS);
  await page.close();
  return { target, out, errs };
}

const res = [];
for (const t of TARGETS) res.push(await measure(t));
await browser.close();
const json = JSON.stringify(res, null, 1);
console.log(json);
if (process.env.W265C_OUT) fs.writeFileSync(process.env.W265C_OUT, json);

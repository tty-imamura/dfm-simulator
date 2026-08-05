// 第79便: perf のノイズフロア調査 — starSeed/freebox の計測時間と NaN 安全性を frames 別に測る
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
async function getBrowser() {
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe });
}
const browser = await getBrowser();
const page = await browser.newPage();
await page.goto('file://' + path.join(ROOT, 'index.html'));
await page.waitForFunction(() => window.HP && HP.sim);

for (const id of ['starSeed', 'freebox']) {
  for (const frames of [60, 2000, 6000, 20000, 60000]) {
    const r = await page.evaluate(([pid, frames]) => {
      HP.loadPreset(pid, false);
      const S = HP.sim;
      const spf = Math.max(1, Math.min(24, Math.round(2 * (S.params.timeScale || 1))));
      for (let k = 0; k < spf * 20; k++) S.step(0.016);
      const t0 = performance.now();
      for (let f = 0; f < frames; f++) for (let s = 0; s < spf; s++) S.step(0.016);
      const ms = performance.now() - t0;
      // コアv2 の状態が発散していないか(NaN/Inf/巨大 Ω)
      let maxOm = 0, maxSpin = 0;
      if (S.coreJ) for (let i = 0; i < S.n; i++) {
        const om = S.coreOmV ? Math.abs(S.coreOmV[i]) : 0;
        if (om > maxOm) maxOm = om;
      }
      for (let i = 0; i < S.n; i++) maxSpin = Math.max(maxSpin, Math.abs(S.spin[i]));
      return { ms, spf, n: S.n, nan: S.hasNaN(), maxOm, maxSpin, t: S.t };
    }, [id, frames]);
    console.log(`${id.padEnd(9)} frames=${String(frames).padStart(6)} spf=${r.spf} n=${r.n}  ${r.ms.toFixed(1)}ms  NaN=${r.nan}  maxΩcore=${r.maxOm.toExponential(2)} max|spin|=${r.maxSpin.toExponential(2)}  t=${r.t.toFixed(0)}`);
  }
}
await browser.close();

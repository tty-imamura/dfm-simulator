// 第78便 実験 4-80: ⚫bhCore(DFM版BH 5層)のプリセット経路実測と対照
// 5層: 層0=コア(J貯蔵・自走)/層1=重い内殻/層2=外殻・擬似地平面(減光)/層3=フレーム場/
//      層4=降着円盤。測定用の恒星ディスク200体で外縁増強を読む。
// 対照(ChatGPT §9.4 の A〜F をプリセット経路で再現):
//   kFrame=0(引きずりオフ)/ kRep=0(層4の圧力オフ)/ Kcs=0(自走オフ・コアに J が残る)/
//   core なし(単層 spin0.15 = 暗くない弱い中心)
// 出力: tests/out/exp-4-80.json
// ※第81便注記: ⚫bhCore は第81便で**自由な中心**(pinned:false + E6′-R + 重心系)へ移行した。
//   本スクリプトの絶対座標での測定は pinned 前提のため、現行構成では tests/exp-4-81.mjs を使う。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

// mod: {kFrame?, kRep?, Kcs?, noCore?}
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  if (o.noCore) delete p.bodies[0].core;
  else if (o.Kcs !== undefined) p.bodies[0].core.Kcs = o.Kcs;
  HP.sim.build(p);
  const S = HP.sim;
  const GAS0 = 1, GAS1 = 121;   // 0=中心 / 1..120=降着円盤 / 121..320=恒星ディスク
  const L0 = S.totals().L + S.resL + S.radL;
  const cs0 = HP.coreState(0);
  for (let k = 0; k < 6000; k++) S.step(0.016);
  let sum = 0, c = 0, keep = 0;
  for (let i = GAS1; i < S.n; i++) { const rr = Math.hypot(S.x[i], S.y[i]);
    if (rr >= 156 && rr <= 286) { sum += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / rr; c++; }
    if (rr < 450) keep++; }
  let esc = 0, gasT = 0;
  for (let i = GAS0; i < GAS1; i++) { if (Math.hypot(S.x[i], S.y[i]) > 200) esc++;
    gasT += HP.obsTemp(S, i) / (GAS1 - GAS0); }
  const L1 = S.totals().L + S.resL + S.radL;
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  const cs1 = HP.coreState(0);
  return { outer: c ? sum / c : 0, shell0: 0.15, shell1: S.spin[0],
    coreOm0: cs0 ? cs0.omega : 0, coreOm1: cs1 ? cs1.omega : 0,
    lSwCenter: S.lSw[0], gasEsc: esc, gasTobs: gasT, starKeep: keep / (S.n - GAS1),
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9), n: S.n,
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 };
}, mod);

const out = { meta: { exp: '4-80', wave: 78, target: TARGET, date: '2026-08-05' }, cases: {} };
const pair = async (tag, mod) => {
  const a = await run({ ...mod, kFrame: 1 });
  const z = await run({ ...mod, kFrame: 0 });
  out.cases[tag] = { kf1: a, kf0: z, boost: a.outer / z.outer };
  console.log(tag, 'boost=', (a.outer / z.outer).toFixed(4),
    'shell→', a.shell1.toFixed(3), 'coreΩ', a.coreOm0.toFixed(1), '→', a.coreOm1.toFixed(1),
    'lSw=', a.lSwCenter.toFixed(3), 'gasEsc=', a.gasEsc, 'gasT=', a.gasTobs.toFixed(2),
    'starKeep=', a.starKeep.toFixed(3), 'relL=', a.relL.toExponential(1),
    'clamp=', a.clampV, a.clampR, 'nan=', a.nan);
};
await pair('default', {});                 // 既定(5層フル)
await pair('kRep0', { kRep: 0 });          // 層4の圧力オフ
await pair('Kcs0', { Kcs: 0 });            // 自走オフ(コアに J が残る)
await pair('noCore', { noCore: true });    // コアなし(単層 spin0.15)
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-80.json'), JSON.stringify(out, null, 2));
console.log('saved tests/out/exp-4-80.json');
await browser.close();

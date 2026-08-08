// 第90便 実験 4-92: 🥚selfRotor 粒子数スケーリング**第4段階(n=720)**
//
// 主題: 論文3 P0-3「N scaling は少なくとも3段階、できれば4段階」(第87便 PAPER3_THEME §6)。
//   exp-4-85 の n=90/180/360(代表3seed)に n=720 を足して4段階を完成させる。
//   本サンプルは円盤半径と1粒質量を固定して n を振るので、n は同時に総質量でもある
//   (exp-4-85 の正直な注記と同じ制約 — n=720 は G を4倍にした側に効く)。
//   測定量・判定は exp-4-85 ②と同型: 秩序変数の傾向が保たれるか+融合オフ対照との比。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-92.mjs(playwright 必須・約10分 — n=720 は重い)
// 出力: tests/out/exp-4-92.json(QA ではない計測スクリプト)
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

const has = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'selfRotor'));
if (!has) { console.log('SKIP: 対象に 🥚selfRotor がありません'); await browser.close(); process.exit(0); }

// exp-4-85 ② と同じ測定量のランナー(mod: n / noFuse / snaps=計測步リスト・既定 [9000])
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'selfRotor')));
  if (o.noFuse) delete p.fusion;
  if (o.n !== undefined) p.bodies[0].n = o.n;
  if (o.seed !== undefined) p.seed = o.seed;
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const meas = () => {
    let bi = 0, mTot = 0;
    for (let i = 0; i < S.n; i++) { mTot += Math.abs(S.m[i]); if (Math.abs(S.m[i]) > Math.abs(S.m[bi])) bi = i; }
    const G = S.params.G, MB = Math.abs(S.m[bi]);
    let bound = 0, lswH = 0, nH = 0;
    for (let i = 0; i < S.n; i++) {
      if (i === bi) continue;
      const dx = S.x[i] - S.x[bi], dy = S.y[i] - S.y[bi];
      const dvx = S.vx[i] - S.vx[bi], dvy = S.vy[i] - S.vy[bi];
      const r = Math.hypot(dx, dy);
      if (0.5 * (dvx * dvx + dvy * dvy) - G * MB / Math.max(r, 1) < 0) bound++;
      lswH += S.lSw[i]; nH++;
    }
    const em = HP.emergenceStats(S);
    return { step: Math.round(S.t / 0.016), n: S.n, fusN: S.fusN, mFrac: MB / mTot,
      maxFrac: em.maxFrac, align: em.align, vsig: em.vsig, lSw: S.lSw[bi],
      lSwHalo: nH ? lswH / nH : 0, bound: bound / Math.max(1, nH) };
  };
  const snaps = o.snaps || [9000];
  const out2 = [];
  for (const T of snaps) {
    while (Math.round(S.t / 0.016) < T) S.step(0.016);
    out2.push(meas());
  }
  const last = out2[out2.length - 1];
  return Object.assign({}, last, { snaps: out2,
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 });
}, mod);

const out = { meta: { exp: '4-92', wave: 90, target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🥚selfRotor N scaling 第4段階 n=720(3seed・9000步)+融合オフ対照。' +
    'exp-4-85 ②(n=90/180/360)の拡張 — 論文3 P0-3 の「4段階」完成(QA ではない計測)' } };
const SEED3 = [20260806, 20260807, 20260808];
// exp-4-85 実測(第83便A)— 傾向比較用
out.ref485 = { ns: [90, 180, 360], mFracMedian: [0.122, 0.267, 0.317],
  maxFracMedian: [0.944, 0.994, 1.000], alignAll: 1.000 };

console.log('=== n=720(3seed・9000步・本則 vs 融合オフ対照)===');
const sec = { runs: {}, noFuse: {} };
for (const sd of SEED3) {
  const t0 = Date.now();
  const a = await run({ seed: sd, n: 720 });
  const b = await run({ seed: sd, n: 720, noFuse: true });
  sec.runs['s' + sd] = a; sec.noFuse['s' + sd] = b;
  console.log(`seed${sd}: 本則 n${a.n} fus${a.fusN} mFrac${(a.mFrac * 100).toFixed(1)}%`,
    `maxFrac${a.maxFrac.toFixed(3)} align${a.align.toFixed(3)} V/σ${a.vsig.toFixed(2)} bound${a.bound.toFixed(2)}`,
    `lSw${a.lSw.toFixed(3)}/halo${a.lSwHalo.toFixed(3)}`,
    `| 対照 mFrac${(b.mFrac * 100).toFixed(2)}%`,
    `| 対照比 ${(a.mFrac / b.mFrac).toFixed(1)}倍 [${Math.round((Date.now() - t0) / 1000)}s]`,
    a.nan || b.nan ? 'NAN' : '', (a.clampV || a.clampR) ? `clamp${a.clampV}/${a.clampR}` : '');
}
const med = (arr) => { const b2 = [...arr].sort((x, y) => x - y); return b2[Math.floor(b2.length / 2)]; };
const mf = SEED3.map((sd) => sec.runs['s' + sd].mFrac);
sec.stats = {
  mFrac: { median: med(mf), min: Math.min(...mf), max: Math.max(...mf) },
  maxFracMedian: med(SEED3.map((sd) => sec.runs['s' + sd].maxFrac)),
  alignMin: Math.min(...SEED3.map((sd) => sec.runs['s' + sd].align)),
  controlRatioMin: Math.min(...SEED3.map((sd) => sec.runs['s' + sd].mFrac / sec.noFuse['s' + sd].mFrac)),
  nan: SEED3.filter((sd) => sec.runs['s' + sd].nan || sec.noFuse['s' + sd].nan),
};
out.n720 = sec;

// ==== 追検: align の時間窓(第90便 初走の正直な記録)========================================
// 初走(9000步判定)で seed 20260808 の align が 0.752 に留まった(他2seedは 1.000)。
// n=720 は総質量4倍で力学が激しく、整列の時間尺度が延びる可能性がある — 「収束が遅いだけ」か
// 「部分整列が安定」かを 18000步(t=288)までの時間発展で判別する(align が低かった seed のみ)。
console.log('=== 追検: align 時間発展(align<0.985 の seed を 18000步まで)===');
const lowAlign = SEED3.filter((sd) => sec.runs['s' + sd].align < 0.985);
const fu = {};
for (const sd of lowAlign) {
  const r = await run({ seed: sd, n: 720, snaps: [9000, 13500, 18000] });
  fu['s' + sd] = r.snaps.map((s2) => ({ step: s2.step, align: +s2.align.toFixed(3),
    maxFrac: +s2.maxFrac.toFixed(3), mFrac: +s2.mFrac.toFixed(4), vsig: +s2.vsig.toFixed(1) }));
  console.log(`seed${sd}: ` + r.snaps.map((s2) => `align(${s2.step})=${s2.align.toFixed(3)}`).join(' → '));
}
out.alignFollowUp = { seeds: lowAlign, curves: fu };
const alignConverges = lowAlign.every((sd) => { const c = fu['s' + sd]; return c[c.length - 1].align >= 0.985; });
const alignFinalMin = lowAlign.length
  ? Math.min(...lowAlign.map((sd) => { const c = fu['s' + sd]; return c[c.length - 1].align; }))
  : null;

// 判定: 4段階目でも(i)中心形成が立つ(maxFrac が3段階の傾向を保つ+束縛)—
//   align は追検の時間発展で別建て判定(9000步固定は n=720 には短い可能性を初走が示した)
// (ii)mFrac の単調傾向(飽和許容: 360 中央値の8割以上)(iii)対照比 10倍以上(iv)NaN なし
const mono = sec.stats.mFrac.median >= out.ref485.mFracMedian[2] * 0.8;   // 360 中央値の8割以上(飽和許容)
out.summary = {
  formationHolds: sec.stats.maxFracMedian >= 0.944,
  alignAt9000: { min: +sec.stats.alignMin.toFixed(3),
    allAbove985: sec.stats.alignMin >= 0.985,
    followUp: lowAlign.length ? { converges: alignConverges, finalMin: alignFinalMin } : null },
  mFracTrend: { medianAt720: +sec.stats.mFrac.median.toFixed(4), vs360Median: out.ref485.mFracMedian[2],
    holds: mono },
  controlRatioOver10: sec.stats.controlRatioMin >= 10,
  nanFree: sec.stats.nan.length === 0,
  note: 'n は同時に総質量(exp-4-85 の注記と同じ制約)。720 で mFrac が 360 比で飽和・微減しても' +
    '「特定 n の離散模様ではない」ことの反証にはならない — 形成(maxFrac)と対照比が主判定。' +
    'align は n=720 で 9000步内に揃わない seed があり得る(整列時間尺度の n 依存)— 追検の' +
    '時間発展で「遅い収束」か「安定な部分整列」かを記録し、論文3 では時間窓とともに正直に書く。',
};
console.log('=== 総合 ===');
console.log(JSON.stringify(out.summary, null, 1));
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-92.json'), JSON.stringify(out, null, 1));
console.log('→ tests/out/exp-4-92.json');
await browser.close();

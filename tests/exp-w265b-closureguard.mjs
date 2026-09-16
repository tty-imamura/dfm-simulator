// 第265便b(第57報 W2・Z3)「閉包 `toyClosure:"iterate"` の**未収束ガード**」の再現器である。
//
// ■ 何を測るか(統括の読み (C))
//   〔第264便b ②〕は「η=χ=1 の二体では反復値が [g,−g] と [0,0] を往復する」ことを数で出した。
//   **打ち切った最後の 1 巡を力として当てると、反復上限の偶奇で符号も大きさも変わる。**
//   統括の予備測定: 等質量 500・分離 240・D₀=0・toyGain=1・dt=0.016 で、
//   反復上限 2 回と 3 回の粒子 0 の vx が **9.269×10⁻⁴** と **−2.25×10⁻¹⁰**。
//   本便のガードはここでメッシュキックを当てず(帳簿にも記帳せず)
//   `S.geoToyStop="closureUnconverged"`・`S.geoToyN=0`・`S.geoToyDv=0` を返す。
//   **重力側の步と時刻は進む**(原子的停止ではない)—— それも測る。
//
// ■ 出す 3 つ
//   §1 guard    … D₀=0・η=1 の特異点で、反復上限 1〜8 の粒子 0 の vx(基点は偶奇で振れる → 本便は 0)
//   §2 control  … D₀=8(収束する側)で、反復上限 32 の走行が**基点と 1 bit 同一**であること
//   §3 advance  … ガードが立った步でも **t と重力側の位置が進んでいる**こと(原子的停止ではない)
//
// 実行: node tests/exp-w265b-closureguard.mjs [--base beta/_w265_base.html]
// 出力: tests/out/closureguard-w265b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const TARGETS = [['cand', arg('--target', 'beta/index.html')], ['base', arg('--base', 'beta/_w265_base.html')]];
const OUT = path.join(ROOT, 'tests', 'out', 'closureguard-w265b.json');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const R = { wave: '第265便b', at: new Date().toISOString(),
  note: '**未収束の最終反復は解ではない。** 当てないことが結果であって、「収束させた」ではない。' };

for (const [tag, rel] of TARGETS) {
  const file = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  if (!fs.existsSync(file)) { R[tag] = { missing: rel }; continue; }
  const pg = await browser.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(String(e.message || e)));
  await pg.goto('file://' + file, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.HP && HP.sim);
  R[tag] = await pg.evaluate(() => {
    const KEY = HP.SPACE_MESH_KEY;
    const G = 6.674, EPS = 0.05, DT = 0.016, MM = 500, SEP = 240;
    const mk = (D0, eta, closure, iters) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      delete q.claims; delete q.massCalibration; delete q.scaleExp; delete q.overlays;
      q.sampleClass = 'principle';
      const sm = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar', toyGain: eta };
      if (closure) { sm.toyClosure = closure; if (iters) sm.toyClosureIters = iters; }
      q.physics = { G, D0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0,
        cLight: 30, bM: 1, etaRad: 0, geoPN: 3, lambdaPN: 1, radiusScale: 1, softening: EPS,
        timeScale: 1, stateCarry: 'double', frameWeight: 'share', spaceMesh: sm };
      q.bodies = [{ type: 'single', m: MM, x: -SEP / 2, y: 0, vx: 0, vy: -0.4, spin: 0, pinned: false },
        { type: 'single', m: MM, x: SEP / 2, y: 0, vx: 0, vy: 0.4, spin: 0, pinned: false }];
      return HP.validatePreset(q);
    };
    const run1 = (D0, eta, closure, iters) => {
      const v = mk(D0, eta, closure, iters);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const t0 = S.t, x0 = S.x[0], y0 = S.y[0];
      S.step(DT);
      return { vx0: S.vx[0], vy0: S.vy[0], N: S.geoToyN, dv: S.geoToyDv, stop: S.geoToyStop,
        iters: S.geoToyIters, residRel: S.geoToyResidRel, conv: S.geoToyConverged,
        px: S.geoToyPx, py: S.geoToyPy, emesh: S.geoToyEmesh, resPx: S.resPx,
        dt_t: S.t - t0, dx: S.x[0] - x0, dy: S.y[0] - y0, nan: S.hasNaN() };
    };
    // §1 特異点(D₀=0・η=1)で反復上限を 1〜8 に振る
    const guard = [];
    for (let k = 1; k <= 8; k++) guard.push(Object.assign({ maxIt: k }, run1(0, 1, 'iterate', k)));
    // §2 収束する側(D₀=8・η=1)の対照 —— 600 步の状態
    const runN = (D0, eta, closure, iters, n) => {
      const v = mk(D0, eta, closure, iters);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      let guardN = 0;
      for (let k = 0; k < n; k++) { S.step(DT); if (S.geoToyStop === 'closureUnconverged') guardN++; }
      return { st: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]],
        stop: S.geoToyStop, conv: S.geoToyConverged, iters: S.geoToyIters,
        residRel: S.geoToyResidRel, guardN, t: S.t,
        ledgerE: Math.abs(S.geoToyE + S.geoToyEmesh),
        ledgerP: Math.hypot(S.geoToyPx + S.geoToyMeshPx, S.geoToyPy + S.geoToyMeshPy),
        nan: S.hasNaN() };
    };
    const ctlIter = runN(8, 1, 'iterate', 32, 600);
    const ctlGrav = runN(8, 1, null, 0, 600);
    const singIter = runN(0, 1, 'iterate', 32, 600);      // **上限 32 = 偶数**
    const singIterOdd = runN(0, 1, 'iterate', 31, 600);   // **上限 31 = 奇数**(打ち切り値が別物になる側)
    const singGrav = runN(0, 1, null, 0, 600);
    const ctlLoose = runN(0.5, 1, 'iterate', 32, 600);    // χ=0.806・η=1: 32 回でも収束しない帯
    // §3 ガードが立った步で重力側が進んでいるか(1 步・特異点)
    const adv = run1(0, 1, 'iterate', 32);
    // 既定 "gravity" が影響を受けていないこと(内蔵の経路)
    const defRun = run1(0, 1, null, 0);
    return { guard, ctlIter, ctlGrav, singIter, singIterOdd, singGrav, ctlLoose, adv, defRun };
  });
  R[tag].pageErrors = errs;
  await pg.close();
}
await browser.close();
// 比較
if (R.cand && R.base && !R.base.missing) {
  const same = (a, b) => (a && b && a.st && b.st) ? a.st.every((z, i) => Object.is(z, b.st[i])) : null;
  const dmax = (a, b) => (a && b && a.st && b.st)
    ? a.st.reduce((d, z, i) => Math.max(d, Math.abs(z - b.st[i])), 0) : null;
  R.compare = {
    ctlIterBitSame: same(R.cand.ctlIter, R.base.ctlIter),
    ctlGravBitSame: same(R.cand.ctlGrav, R.base.ctlGrav),
    singGravBitSame: same(R.cand.singGrav, R.base.singGrav),
    singIterEvenBitSame: same(R.cand.singIter, R.base.singIter),
    singIterOddBitSame: same(R.cand.singIterOdd, R.base.singIterOdd),
    singIterOddMaxDiff: dmax(R.cand.singIterOdd, R.base.singIterOdd),
    baseParityDiff: dmax(R.base.singIter, R.base.singIterOdd),
    candParityDiff: dmax(R.cand.singIter, R.cand.singIterOdd),
    ctlLooseBitSame: same(R.cand.ctlLoose, R.base.ctlLoose),
    ctlLooseMaxDiff: dmax(R.cand.ctlLoose, R.base.ctlLoose) };
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const ex = (z) => (z === null || z === undefined) ? '—' : Number(z).toExponential(4);
console.log('[w265b-closureguard] §1 特異点(D₀=0・η=1・等質量 500・分離 240・dt=0.016)の粒子 0 の vx');
console.log(' 上限  base vx0                cand vx0                cand stop            N  dv');
for (let k = 0; k < (R.cand.guard || []).length; k++) {
  const c = R.cand.guard[k], b = (R.base.guard || [])[k] || {};
  console.log('  ' + String(c.maxIt).padEnd(4) + ' ' + String(b.vx0).padEnd(24) + ' '
    + String(c.vx0).padEnd(24) + ' ' + String(c.stop).padEnd(20) + ' ' + c.N + '  ' + ex(c.dv));
}
console.log('[w265b-closureguard] §2 600 步の対照(x0・ガードが立った步数・帳簿)');
for (const k of ['ctlIter', 'ctlGrav', 'singIter', 'singIterOdd', 'singGrav', 'ctlLoose']) {
  const c = R.cand[k] || {}, b = ((R.base || {})[k]) || {};
  console.log(' ' + k.padEnd(12) + ' cand x0=' + String(c.st && c.st[0]).padEnd(22)
    + ' guard步=' + String(c.guardN).padEnd(4) + ' conv=' + String(c.conv).padEnd(6)
    + ' |E|=' + ex(c.ledgerE) + ' |P|=' + ex(c.ledgerP)
    + ' || base x0=' + (b.st ? b.st[0] : '—'));
}
console.log(' 比較: ' + JSON.stringify(R.compare));
console.log('[w265b-closureguard] §3 ガードの步でも進む: Δt=' + R.cand.adv.dt_t
  + ' Δx=' + ex(R.cand.adv.dx) + ' Δy=' + ex(R.cand.adv.dy)
  + ' / 帳簿 px=' + R.cand.adv.px + ' emesh=' + R.cand.adv.emesh);
console.log(' out=' + OUT);

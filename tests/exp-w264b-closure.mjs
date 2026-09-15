// 第264便b(第56報 W2)「geoPN=3 — **源の閉包**(`physics.spaceMesh.toyClosure`)」の実測器である。
//
// ■ 何を測るか(統括の読み (B)(ii))
//   現行のトイは ∂ₜu に入る源の加速度 a_i を**重力だけ**で近似している("gravity")。
//   「源も同じトイ則で加速している」と閉じるなら **a_i = g_i + t_i(a)** の固定点で、
//   二体・D₀=0・単一源支配では t₀=η·χ₀·a₁・t₁=η·χ₁·a₀ になるので
//       [1, −ηχ₀; −ηχ₁, 1]·(a₀,a₁) = (g₀,g₁)、  **det = 1 − η²χ₀χ₁**
//   である。**η=χ=1 で det=0** —— 反復は止まらない。これを**数で**出すのがこの器の目的である。
//
// ■ この器が出す 3 つ
//   sing … §1 **特異性の表**: η∈{0.25,0.5,0.75,1} × D₀ 4 段 の等質量二体で、
//          χ・det=1−η²χ₀χ₁・反復数・相対残差・収束判定・**残差の比**(≈ η²χ₀χ₁)を出す。
//          D₀=0(χ=1 厳密・∇u=0)では閉包の厳密解 a=(g₀+ηg₁)/(1−η²) と突き合わせる。
//   pair … §2 **原理サンプル 🫂🪟 の geoPN=3 コピー**で "gravity" と "iterate" の 600 步差
//          (状態差・接触半長径 a_osc・分離)と、近点間 P(検出器・予算内)。
//   box  … §3 **質量のある箱(`boxcomoving`)では閉包が効かない**ことの確認 —— 箱は**規定場**なので
//          ∂ₜu に源の加速度が入らず、"iterate" は 2 巡目で残差 0(= 効くのは頂点側だけである)。
//          **🫂 boxBinaryToy には universeBox が無い**(名前に反して箱を宣言していない)ので、
//          §3 は `boxcomoving`(D=80 の箱)で測る。
//
// ■ 言わないこと
//   **"iterate" は採用しない**(診断である)。**「閉包で ∂ₜu が完全になった」とは書かない** ——
//   場の有限エネルギー・戻り作用・回転源は入っていない(〔第264便b〕④ の設計へ回す)。
//
// 実行: node tests/exp-w264b-closure.mjs [--part sing,pair,box]
// 出力: tests/out/closure-w264b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W264B_OUT || path.join(ROOT, 'tests', 'out', 'closure-w264b.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = arg('--part', 'sing,pair,box').split(',');
const want = (k) => PARTS.indexOf(k) >= 0;
const P_BUDGET = Number(arg('--pbudget', 400000));   // 近点間 P を探す 1 走行の步の上限

const LIB_PREC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8').replace(/^export /gm, '');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_PREC });

const R = { wave: '第264便b', target: TARGET, at: new Date().toISOString(), parts: PARTS,
  note: '**"iterate" は診断であって採用則ではない。** det=1−η²χ₀χ₁ が 0 に近づく側は「収束しない」ことが結果である。' };

// ---------- §1 特異性の表
if (want('sing')) {
  R.sing = await pg.evaluate(() => {
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
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      S.step(DT);
      return { chi: S.geoToyChi, iters: S.geoToyIters, resid: S.geoToyResid, residRel: S.geoToyResidRel,
        conv: S.geoToyConverged, closure: S.geoToyClosure, N: S.geoToyN,
        dv: [S.geoToyPx / MM, S.geoToyPy / MM], dvMax: S.geoToyDv,
        v0: [S.vx[0], S.vy[0]], nan: S.hasNaN(), warn: (v.warnings || []).length,
        sig: JSON.stringify(v.preset.physics[HP.SPACE_MESH_KEY]) };
    };
    const rows = [];
    for (const D0 of [0, 0.5, 2, 8]) {
      for (const eta of [0.25, 0.5, 0.75, 1]) {
        const base = mk(D0, eta, null, 0);                       // "gravity"(既定)
        const it = mk(D0, eta, 'iterate', 32);                   // 上限 32 回
        // 残差の比(反復を 1 回ずつ増やして相対残差の列を作る)
        const series = [];
        for (let k = 2; k <= 8; k++) { const z = mk(D0, eta, 'iterate', k); series.push(z.residRel); }
        const chi = base.chi;
        const det = 1 - eta * eta * chi * chi;
        const ratio = (series.length >= 2 && series[series.length - 2] > 0)
          ? series[series.length - 1] / series[series.length - 2] : null;
        rows.push({ D0, eta, chi, det,
          // **Jacobi 反復の収縮率は √(η²χ₀χ₁)=ηχ**(行列 [0,ηχ;ηχ,0] のスペクトル半径)であって
          // det=1−η²χ₀χ₁ ではない。det は**閉包の解の増幅率 1/det** を決める量である
          predictedRatio: eta * chi,
          gravityDvMax: base.dvMax, iterateDvMax: it.dvMax, iters: it.iters, residRel: it.residRel,
          resid: it.resid, conv: it.conv, series, ratio,
          amplify: (base.dvMax > 0) ? it.dvMax / base.dvMax : null,
          amplifyExact: (det !== 0) ? 1 / det : null,
          // **等質量・反対称(g₁=−g₀)の二体**では閉包の解が a₀=(g₀+ηχg₁)/(1−η²χ²)=g₀/(1+ηχ) に
          // なるので、増幅率の厳密値は **1/(1+ηχ)**(1/det ではない —— det は行列式であって解ではない)
          amplifyAnti: 1 / (1 + eta * chi),
          nan: it.nan, closure: it.closure, sig: it.sig, gravSig: base.sig });
      }
    }
    return { rows, defaultSigClean: rows.every((z) => (z.gravSig || '').indexOf('toyClosure') < 0) };
  });
}

// ---------- §2 原理サンプル 🫂🪟 の geoPN=3 コピー
if (want('pair')) {
  R.pair = await pg.evaluate(({ P_BUDGET }) => {
    const KEY = HP.SPACE_MESH_KEY, DT = 0.016;
    const copy = (id, closure, eta) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
      delete q.claims; delete q.massCalibration;
      q.sampleClass = 'principle';
      q.physics.geoPN = 3; q.physics.kFrame = 0;
      const sm = Object.assign({}, q.physics[KEY] || {},
        { mode: 'vertex', inertia: false, lawVersion: 'scalar', toyGain: (eta === undefined) ? 1 : eta });
      delete sm.weave;
      if (closure === 'iterate') { sm.toyClosure = 'iterate'; sm.toyClosureIters = 32; }
      q.physics[KEY] = sm;
      return q;
    };
    const run = (id, closure, nStep, findP) => {
      const v = HP.validatePreset(copy(id, closure));
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const G = S.params.G, M = S.m[0] + S.m[1];
      const osc = () => {
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
        const r = Math.hypot(dx, dy);
        const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
        const v2 = dvx * dvx + dvy * dvy;
        const inv = 2 / r - v2 / (G * M);
        return { r, a: (inv !== 0) ? 1 / inv : null };
      };
      const a0 = osc();
      let itSum = 0, itN = 0, residMax = 0, convAll = true;
      for (let k = 0; k < nStep; k++) {
        S.step(DT);
        if (S.geoToyClosure === 'iterate') { itSum += S.geoToyIters; itN++;
          if (S.geoToyResidRel !== null && S.geoToyResidRel > residMax) residMax = S.geoToyResidRel;
          if (S.geoToyConverged === false) convAll = false; }
      }
      const a1 = osc();
      const out = { a0: a0.a, a1: a1.a, r0: a0.r, r1: a1.r,
        da: (a0.a && a1.a) ? (a1.a - a0.a) / a0.a : null,
        st: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]],
        itMean: itN ? itSum / itN : null, residMax: itN ? residMax : null, convAll: itN ? convAll : null,
        stop: S.geoToyStop, N: S.geoToyN, chi: S.geoToyChi, nan: S.hasNaN(),
        ledgerE: Math.abs(S.geoToyE + S.geoToyEmesh),
        ledgerP: Math.hypot(S.geoToyPx + S.geoToyMeshPx, S.geoToyPy + S.geoToyMeshPy),
        sig: JSON.stringify(v.preset.physics[KEY]) };
      if (findP) {
        // 近点間 P(位相制限つき検出器・予算内で 3 近点)
        const S2 = HP.sim; S2.build(v.preset);
        const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
        let nP = 0, kk = 0, peri = [];
        for (; kk < P_BUDGET; kk++) {
          S2.step(DT);
          const dx = S2.x[1] - S2.x[0], dy = S2.y[1] - S2.y[0];
          const rr = Math.hypot(dx, dy);
          const dvx = S2.vx[1] - S2.vx[0], dvy = S2.vy[1] - S2.vy[0];
          const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
          const z = det.push(kk, rr, rd, Math.atan2(dy, dx));
          if (z.accepted) { nP++; if (nP >= 3) break; }
        }
        const res = det.result(3);
        peri = res.peri || [];
        out.periSteps = kk;
        out.P = (peri.length >= 2) ? (peri[peri.length - 1].k - peri[0].k) * DT / (peri.length - 1) : null;
        out.nPeri = res.nPeri;
      }
      return out;
    };
    const O = {};
    for (const id of ['spaceMeshBinaryToy', 'boxBinaryToy']) {
      O[id] = { gravity: run(id, null, 600, true), iterate: run(id, 'iterate', 600, true) };
      const a = O[id].gravity, b = O[id].iterate;
      O[id].stateDiff = (a.st && b.st) ? a.st.reduce((d, z, i) => Math.max(d, Math.abs(z - b.st[i])), 0) : null;
      O[id].dPrel = (a.P && b.P) ? (b.P - a.P) / a.P : null;
      O[id].daDiff = (a.a1 && b.a1) ? (b.a1 - a.a1) / a.a1 : null;
      O[id].hasBox = (id === 'boxBinaryToy');
    }
    return O;
  }, { P_BUDGET });
}
// ---------- §3 質量のある箱では閉包が効かない(箱は規定場 —— ∂ₜu に源の加速度が入らない)
if (want('box')) {
  R.box = await pg.evaluate(() => {
    const KEY = HP.SPACE_MESH_KEY, DT = 0.005;
    const run = (closure) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'boxcomoving')));
      delete q.claims; delete q.massCalibration;
      q.sampleClass = 'principle';
      q.physics.geoPN = 3; q.physics.kFrame = 0;
      const sm = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar', toyGain: 1 };
      if (closure) { sm.toyClosure = closure; sm.toyClosureIters = 32; }
      q.physics[KEY] = sm;
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 200; k++) S.step(DT);
      const st = [];
      for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return { st, iters: S.geoToyIters, resid: S.geoToyResid, residRel: S.geoToyResidRel,
        conv: S.geoToyConverged, N: S.geoToyN, chi: S.geoToyChi, stop: S.geoToyStop,
        boxW: S.boxA ? S.boxA.W : null, nan: S.hasNaN() };
    };
    const g = run(null), it = run('iterate');
    return { gravity: g, iterate: it,
      bitSame: (g.st && it.st) ? g.st.every((z, i) => Object.is(z, it.st[i])) : null,
      maxDiff: (g.st && it.st) ? g.st.reduce((d, z, i) => Math.max(d, Math.abs(z - it.st[i])), 0) : null };
  });
  console.log('[w264b-closure] §3 質量のある箱(boxcomoving・W=' + (R.box.gravity.boxW) + ')');
  console.log('  gravity と iterate が 200 步ビット同一=' + R.box.bitSame + '(最大差=' + R.box.maxDiff
    + ') / 反復数=' + R.box.iterate.iters + ' 残差=' + R.box.iterate.resid
    + ' 収束=' + R.box.iterate.conv + ' N=' + R.box.iterate.N);
}
await browser.close();
R.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const ex = (z) => (z === null || z === undefined) ? '—' : Number(z).toExponential(3);
if (R.sing) {
  console.log('[w264b-closure] §1 特異性(等質量二体・η×D₀)');
  console.log(' D0    η     χ          det=1−η²χ²  iters resid(rel)  conv  ratio      ρ=ηχ      増幅/1/(1+ηχ)');
  for (const z of R.sing.rows) {
    console.log(' ' + String(z.D0).padEnd(5) + ' ' + String(z.eta).padEnd(5) + ' '
      + z.chi.toFixed(8) + ' ' + z.det.toExponential(3) + '  ' + String(z.iters).padEnd(5) + ' '
      + ex(z.residRel) + '  ' + String(z.conv).padEnd(5) + ' ' + ex(z.ratio) + ' ' + ex(z.predictedRatio)
      + ' ' + ex(z.amplify) + '/' + ex(z.amplifyAnti));
  }
  console.log(' 既定 "gravity" の署名に toyClosure が出ない: ' + R.sing.defaultSigClean);
}
if (R.pair) {
  console.log('[w264b-closure] §2 原理サンプルの geoPN=3 コピー(600 步)');
  for (const id of Object.keys(R.pair)) {
    const z = R.pair[id];
    console.log(' ' + id + ': 状態差=' + ex(z.stateDiff) + ' Δa差=' + ex(z.daDiff)
      + ' ΔP/P=' + ex(z.dPrel) + ' | gravity a=' + ex(z.gravity.a1) + ' P=' + ex(z.gravity.P)
      + ' | iterate a=' + ex(z.iterate.a1) + ' P=' + ex(z.iterate.P)
      + ' 反復平均=' + ex(z.iterate.itMean) + ' 残差max=' + ex(z.iterate.residMax)
      + ' 収束=' + z.iterate.convAll);
  }
}
console.log(' out=' + OUT + ' pageErrors=' + pageErrors.length);

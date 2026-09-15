// 第264便b(第56報 W2)「geoPN=3 — 固定(pinned)源の ∂ₜu 不具合」の**再現器**である。
//
// ■ 何を測るか(統括の読み (B)(i))
//   geoPN=3 のトイ積分器 `HP.dfmGeoToyStep` は、源の集合 BD を作るときに
//   **全粒子の重力加速度**を `BD[i].ax/ay` へ入れて `HP.dfmField` へ渡す。∂ₜu の中の
//   Σw·a_i はこの a_i を読む。ところが **pinned 粒子は規定運動**であって、力を受けても
//   速度が変わらない —— つまり ∂ₜu へ渡すべきなのは**規定運動の加速度**(静止なら 0・
//   レール駆動 `railOmega` なら向心加速度 −ω²·(P−C))であって、重力加速度ではない。
//
//   再現の最小形: **静止 pinned 源 m=1000**(原点)+ **静止試験粒子 m=10**(距離 100)・
//   D₀=0・lawVersion="scalar"・η=toyGain=1・dt=0.016・geoPN=3・kFrame=0。
//   単一源かつ D₀=0 なので χ=1 厳密・u=v_src=0・∇u=0 であり、**トイの加速度は ∂ₜū だけ**になる。
//   期待は **0**(源は動かないのだから、メッシュ速度の時間微分も 0)。
//
// ■ この器が出す 4 つ
//   pin  … §1 静止 pinned 源。トイが試験粒子へ入れた Δv(= `S.geoToyPx/m`)。**期待 0**。
//          修正前の値は解析式 η·G·m_test·r/(r²+ε²)^{3/2}·dt(= pinned 源が**受けた**重力加速度)と
//          突き合わせる —— これが「pinned 源の重力加速度が ∂ₜu に混入している」ことの機械証明である。
//   free … §2 **同じ幾何で pinned を外した**対照。源が自由なら重力加速度こそが正しい a_i なので、
//          **修正の前後で 1 bit も動いてはならない**。
//   rail … §3 **レール駆動の pinned 源**(`railOmega`)。規定運動の加速度は向心 −ω²·(P−C) である。
//          修正後のトイ加速度を、(a) 解析値 η·(−ω²e) と (b) 源の速度の**中央差分**(2 通りの独立計算)へ
//          突き合わせる。修正前は重力加速度が入るので両方から外れる。
//   many … §4 pinned 源が**複数**(静止 2 個)+ 自由源 1 個の混成。pinned の寄与だけが落ちることを、
//          自由源だけを源にした参照走行との差で確かめる。
//
// ■ 言わないこと
//   これは**トイの不具合の修正**であって、「引きずりを完全置換した」ことでも「geoPN=3 が正しい」ことでもない。
//   ∂ₜu が完全になるわけでもない(`timeDerivativeComplete` の契約は第260便a のまま)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-w264b-pinned.mjs
// 出力: tests/out/pinned-w264b.json(未コミット —— 数値は PHYSICS へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W264B_OUT || path.join(ROOT, 'tests', 'out', 'pinned-w264b.json');
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

const R = await pg.evaluate(() => {
  const KEY = HP.SPACE_MESH_KEY;
  const G = 6.674, EPS = 0.05, DT = 0.016, RSEP = 100, MSRC = 1000, MTEST = 10, ETA = 1;
  // 走行用プリセット(**内蔵は 1 本も触らない** —— ページの中で作って捨てる)
  const mk = (bodies, over) => {
    // **内蔵 🪟 の器(カメラ・world 等)だけを借りて**、物理と粒子は丸ごと差し替える
    const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
    delete q.claims; delete q.massCalibration; delete q.scaleExp; delete q.overlays;
    q.sampleClass = 'principle';
    q.physics = Object.assign({ G, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
      kappaT: 0, cLight: 30, bM: 1, etaRad: 0, geoPN: 3, lambdaPN: 1, radiusScale: 1,
      softening: EPS, timeScale: 1, stateCarry: 'double', frameWeight: 'share',
      spaceMesh: { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar', toyGain: ETA } },
      over || {});
    q.bodies = bodies;
    const v = HP.validatePreset(q);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    return { S, warnings: v.warnings || [] };
  };
  const B = (o) => Object.assign({ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }, o);
  const run = (bodies, over, nStep) => {
    const z = mk(bodies, over);
    if (z.err) return { err: z.err };
    const S = z.S;
    for (let k = 0; k < (nStep || 1); k++) S.step(DT);
    // トイが粒子へ入れた運動量の総和(**トイだけ**の寄与 —— 重力 E4 は入らない)
    const out = { n: S.n, geoToyPx: S.geoToyPx, geoToyPy: S.geoToyPy, N: S.geoToyN,
      stop: S.geoToyStop, deny: S.geoToyDeny, chi: S.geoToyChi, nan: S.hasNaN(),
      st: [], warn: z.warnings.length };
    for (let i = 0; i < S.n; i++) out.st.push([S.x[i], S.y[i], S.vx[i], S.vy[i]]);
    return out;
  };
  const O = {};
  // ---------- §1 静止 pinned 源 + 静止試験粒子(**期待 Δv=0**)
  const bodiesPin = [B({ m: MSRC, x: 0, y: 0, pinned: true }), B({ m: MTEST, x: RSEP, y: 0 })];
  const r1 = run(bodiesPin, null, 1);
  // 解析: pinned 源が**受けている**重力加速度(= 混入していた量)
  const aSrc = G * MTEST * RSEP / Math.pow(RSEP * RSEP + EPS * EPS, 1.5);
  O.pin = { dvxToy: r1.err ? null : r1.geoToyPx / MTEST, dvyToy: r1.err ? null : r1.geoToyPy / MTEST,
    expectLeak: ETA * aSrc * DT, chi: r1.chi, N: r1.N, stop: r1.stop, err: r1.err || null,
    aSrcGrav: aSrc };
  // η=0 の対照(トイ無しと厳密一致するはず)
  const r1b = run(bodiesPin, { spaceMesh: { mode: 'vertex', gravity: false, inertia: false,
    lawVersion: 'scalar', toyGain: 0 } }, 1);
  O.pin.etaZeroPx = r1b.err ? null : r1b.geoToyPx;
  // ---------- §2 同じ幾何で pinned を外した対照(修正の前後で 1 bit 不変であるべき)
  const bodiesFree = [B({ m: MSRC, x: 0, y: 0, pinned: false }), B({ m: MTEST, x: RSEP, y: 0 })];
  const r2 = run(bodiesFree, null, 1);
  O.free = { geoToyPx: r2.geoToyPx, geoToyPy: r2.geoToyPy, st: r2.st, N: r2.N, err: r2.err || null };
  // 600 步版(蓄積を見る)
  const r2b = run(bodiesFree, null, 600);
  O.free600 = { geoToyPx: r2b.geoToyPx, st: r2b.st, nan: r2b.nan, err: r2b.err || null };
  // ---------- §3 レール駆動の pinned 源(規定運動 = 円運動・向心加速度 −ω²e)
  const OM = 0.02, RR = 40;
  const bodiesRail = [B({ m: MSRC, x: RR, y: 0, pinned: true, railOmega: OM }),
    B({ m: MTEST, x: RSEP + RR, y: 0 })];
  const r3 = run(bodiesRail, null, 1);
  // 1 步進めたあとの源の位置(レールは step の**前**に進む)から向心加速度を作る。
  // **ω は `S.railOmega` が Float32 配列**なので、期待値も `Math.fround` を通した ω で作る
  // (通さないと 0.02 の Float32 丸めだけで相対 4.47×10⁻⁸ ずれる —— 物理ではなく格納精度である)
  const OM32 = Math.fround(OM);
  const ex = r3.err ? null : r3.st[0][0], ey = r3.err ? null : r3.st[0][1];
  O.rail = { dvxToy: r3.err ? null : r3.geoToyPx / MTEST, dvyToy: r3.err ? null : r3.geoToyPy / MTEST,
    expectX: r3.err ? null : ETA * (-OM32 * OM32 * ex) * DT, expectY: r3.err ? null : ETA * (-OM32 * OM32 * ey) * DT,
    srcPos: r3.err ? null : [ex, ey], omega: OM, omega32: OM32, N: r3.N, err: r3.err || null };
  // (b) 独立計算: 源の速度の中央差分(レールの解析式 v=ω×(P−C) を h で挟む)
  const h = 1e-6, ang = Math.atan2(ey, ex);
  const vAt = (t) => [-OM32 * RR * Math.sin(ang + OM32 * t), OM32 * RR * Math.cos(ang + OM32 * t)];
  const vp = vAt(h), vm = vAt(-h);
  O.rail.numericAccel = [(vp[0] - vm[0]) / (2 * h), (vp[1] - vm[1]) / (2 * h)];
  O.rail.analyticAccel = [-OM32 * OM32 * ex, -OM32 * OM32 * ey];
  O.rail.relErr = (r3.err || ex === null) ? null : Math.max(
    Math.abs(O.rail.dvxToy - O.rail.expectX) / Math.abs(O.rail.expectX),
    Math.abs(O.rail.dvyToy - O.rail.expectY) / Math.abs(O.rail.expectY));
  // ---------- §4 pinned 2 個 + 自由源 1 個 + 試験粒子
  const bodiesMix = [B({ m: MSRC, x: 0, y: 0, pinned: true }), B({ m: MSRC, x: 0, y: 220, pinned: true }),
    B({ m: 400, x: -180, y: -60, vx: 0.05, vy: 0.02 }), B({ m: MTEST, x: RSEP, y: 0 })];
  const r4 = run(bodiesMix, null, 1);
  O.mix = { geoToyPx: r4.geoToyPx, geoToyPy: r4.geoToyPy, N: r4.N, err: r4.err || null,
    st: r4.st };
  // ---------- §5 `timeDerivativeComplete` と `accComplete` の読み(契約は変えていない)
  const f = HP.dfmField([{ id: 0, m: MSRC, x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 }], RSEP, 0,
    { G, eps: EPS, p: 1, D0: 0, lawVersion: 'scalar' });
  O.contract = f ? { tdc: f.timeDerivativeComplete, acc: f.accComplete, chi: f.chi,
    dUdt: f.dUdt, u: f.u } : null;
  return O;
});
await browser.close();
const res = { wave: '第264便b', target: TARGET, at: new Date().toISOString(), pageErrors, rows: R };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
const ex = (z) => (z === null || z === undefined) ? '—' : Number(z).toExponential(6);
console.log('[w264b-pinned] target=' + TARGET);
console.log(' §1 静止 pinned: Δvx(toy)=' + ex(R.pin.dvxToy) + ' / 混入の解析値=' + ex(R.pin.expectLeak)
  + ' / χ=' + R.pin.chi + ' N=' + R.pin.N + ' stop=' + R.pin.stop);
console.log(' §2 自由源(対照): geoToyPx=' + ex(R.free.geoToyPx) + ' / 600 步 x=' + (R.free600.st ? R.free600.st[1][0] : '—'));
console.log(' §3 レール pinned: Δv(toy)=[' + ex(R.rail.dvxToy) + ',' + ex(R.rail.dvyToy)
  + '] / 期待=[' + ex(R.rail.expectX) + ',' + ex(R.rail.expectY) + ']');
console.log(' §4 混成: geoToyP=[' + ex(R.mix.geoToyPx) + ',' + ex(R.mix.geoToyPy) + ']');
console.log(' §5 契約: tdc=' + (R.contract && R.contract.tdc) + ' acc=' + (R.contract && R.contract.acc));
console.log(' out=' + OUT + ' pageErrors=' + pageErrors.length);

// 第119便 exp-kf1.mjs — kFrame=1 自由二体の安定化手法の系統探索(原仮定者指示
// 「kFrame=1版のサンプルを用意する。どうすれば安定するのかを調査する。質量比の補正や、
//  天体の温度を関係させるなど、様々なケースを検証する」)
// - 本スクリプトは QA ではない(結果は tests/out/kf1-results.json へ保存・suite 非連動)。
// - 前提(第116便 §F の確定機構): 崩壊の制御変数は双方向フレーム結合のループ利得
//     g = [w_sat/(D0+w_sat)]·[w_M/(D0+w_M)]  (w=m/d)
//   質量補正 kSat 単独では w_M 側(≈94%)が残るため不成立。D0≥2 と pinned は成立。
// - 本便の新規候補:
//   ①frameReaction:"pairReduced"(E6′-R — 換算質量μの対称インパルス。巨大質量比で反作用が
//     m_i/m_j 倍に増幅されない設計 = まさに本問題向けの既存機構)
//   ②質量再スケール(GM不変): (G,m)→(kG,m/k)。軌道・周期・1PN(U=Gm/d)は厳密不変で、
//     フレーム重み w=m/d だけが 1/k に落ちる → ループ利得 g の**両因子**を同時に下げる
//     (kSat が片側しか下げられなかった問題の解消 — §A「実G値+再スケール」の一般化)
//   ③温度(スピン=熱)関与: スピン用量±・スピン拡散 κs・放射冷却 η_rad・熱斥力 kRep の
//     各経路が正帰還を減衰するかの実測(機構上は u 場の暴走なので効かない見込み — 正直に記録)
//   ④引きずり減衰 q の用量(w のカーネル形状依存)
// 実行: node tests/exp-kf1.mjs(playwright 必須・数分)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

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
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, wave: 119, tests: {} };

// ---- 共通ランナー: 自由二体(重心系・円/実軌道)を kFrame=1 で回して振幅・崩壊を測る ----
// phys/M/m2/d(または a,e)/spins を受け、amp=(rmax−rmin)/mean・崩壊時刻(公転単位)を返す
const runCase = (cfg) => page.evaluate(async (c) => {
  const P = c.phys, M = c.M, m2 = c.m2, mu = M + m2, GM = P.G * mu;
  const e = c.e || 0, a = c.a, rp = a * (1 - e);
  const vp = Math.sqrt(GM * (1 + e) / rp);
  const fm = m2 / mu;
  const S = HP.sim;
  S.build({ id: 'kf1case', name: 'kf1-' + c.id, emoji: '🧪', seed: 1,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
    bodies: [
      { type: 'single', m: M, radius: c.rM || undefined, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
        spin: c.spinM || 0, pinned: false },
      { type: 'single', m: m2, radius: c.r2 || undefined, x: rp * (1 - fm), y: 0, vx: 0, vy: vp * (1 - fm),
        spin: c.spin2 || 0, pinned: false },
    ] });
  const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const dt = 0.016, steps = Math.ceil((c.orbits || 2.1) * TK / dt);
  let rmin = Infinity, rmax = 0, collapseAt = null;
  let ang = 0, px = S.x[1] - S.x[0], py = S.y[1] - S.y[0], tTwoPi = 0;
  for (let k = 0; k < steps; k++) {
    S.step(dt);
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], rr = Math.hypot(dx, dy);
    if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr;
    ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
    if (!tTwoPi && Math.abs(ang) >= 2 * Math.PI) tTwoPi = (k + 1) * dt;
    if (rr > 3 * a || rr < a / 4 || S.hasNaN()) { collapseAt = (k + 1) * dt / TK; break; }
  }
  const cmx = (M * S.x[0] + m2 * S.x[1]) / mu, cmy = (M * S.y[0] + m2 * S.y[1]) / mu;
  return { amp: (rmax - rmin) / ((rmax + rmin) / 2), rmin, rmax, collapseAt, TK,
    T: tTwoPi || null, Tres: tTwoPi ? tTwoPi / TK - 1 : null,
    cmDrift: Math.hypot(cmx, cmy) / a, nan: S.hasNaN() };
}, cfg);

const fmt = (r) => `amp=${(r.amp * 100).toFixed(1)}%` +
  (r.collapseAt !== null ? ` 崩壊@${r.collapseAt.toFixed(2)}公転` : '') +
  (r.Tres != null ? ` T/TK−1=${(r.Tres * 100).toFixed(2)}%` : '') +
  ` NaN=${r.nan}`;

// ---- Phase 1: アナログ系(§A と同系 — G=1・M=1000・m2=12.3・d=180・円軌道)での機構掃引 ----
const basePhys = { G: 1, D0: 0.1, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  Kt: 900, cLight: 30, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 2, timeScale: 1 };
{
  const A = {};
  const mk = (id, over, extra) => Object.assign({ id, M: 1000, m2: 12.3, a: 180, e: 0,
    phys: Object.assign({}, basePhys, over, over && over.G ? { Kt: 900 / over.G * 1 } : {}) }, extra);
  // Kt=c²/G を厳密維持(physLock 規約 — G を変えるケースは Kt も追随)
  const mkG = (id, over, extra) => { const o = Object.assign({}, over);
    const c = mk(id, o, extra); c.phys.Kt = c.phys.cLight * c.phys.cLight / c.phys.G; return c; };

  console.log('== Phase 1: アナログ自由二体(G=1・M=1000・m2=12.3・d=180)==');
  A.base = await runCase(mkG('base', {}));
  console.log(`[A0 基準 kF1          ] ${fmt(A.base)}(崩壊の再現)`);
  A.pairReduced = await runCase(mkG('pr', { frameReaction: 'pairReduced' }));
  console.log(`[A1 pairReduced       ] ${fmt(A.pairReduced)}`);
  A.massRescale = [];
  for (const k of [2, 5, 10, 20, 50]) {
    const r = await runCase(mkG('mr' + k, { G: k }, { M: 1000 / k, m2: 12.3 / k }));
    A.massRescale.push(Object.assign({ k }, r));
    console.log(`[A2 質量再スケール k=${String(k).padEnd(2)}] ${fmt(r)}`);
  }
  A.qDose = [];
  for (const q of [2, 3, 4]) {
    const r = await runCase(mkG('q' + q, { q }));
    A.qDose.push(Object.assign({ q }, r));
    console.log(`[A3 q=${q}               ] ${fmt(r)}`);
  }
  // 温度(スピン=熱)関与の系統: スピン用量・κs・η_rad・kRep(接触なし二体での実効を実測)
  A.thermal = [];
  for (const [id, over, extra] of [
    ['spin+2', {}, { spinM: 2, spin2: 2 }],
    ['spin-2', {}, { spinM: -2, spin2: -2 }],
    ['spin+2/kappaS1', { kappaS: 1 }, { spinM: 2, spin2: 2 }],
    ['spin+2/etaRad1e-3', { etaRad: 1e-3 }, { spinM: 2, spin2: 2 }],
    ['spin+2/kRep1', { kRep: 1 }, { spinM: 2, spin2: 2 }],
    ['spin+2/muF0.5/gam0.4', { muF: 0.5, gammaN: 0.4 }, { spinM: 2, spin2: 2 }],
  ]) {
    const r = await runCase(mkG(id, over, extra));
    A.thermal.push(Object.assign({ id }, r));
    console.log(`[A4 温度系 ${id.padEnd(18)}] ${fmt(r)}`);
  }
  A.d0ref = await runCase(mkG('d02', { D0: 2 }));
  console.log(`[A5 D0=2(参照・既知有効)] ${fmt(A.d0ref)}`);
  A.lam0 = await runCase(mkG('lam0', { lambdaPN: 0 }));
  console.log(`[A6 λPN=0(参照)       ] ${fmt(A.lam0)}`);
  // 併用: pairReduced×質量再スケール(小さめ k)— 単独で不足なら段構え
  A.combo = await runCase(mkG('pr+mr5', { G: 5, frameReaction: 'pairReduced' }, { M: 200, m2: 2.46 }));
  console.log(`[A7 pairReduced+再スケールk=5] ${fmt(A.combo)}`);
  out.tests.analog = A;
}

// ---- Phase 2: 実単位 🌙(第118便構成)を kFrame=1 で — 勝ち筋の検証+周期残差 ----
// 🌙現行: G=6.674・a=384.748・e=0.0549・M=0.59724・m2=0.007346・自転実値・massFloor 1e-6
{
  const realPhys = { G: 6.674, D0: 0.1, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
    Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
    massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5,
    timeScale: 1, stateCarry: 'double' };
  const mkR = (id, over, extra) => { const P = Object.assign({}, realPhys, over);
    P.Kt = P.cLight * P.cLight / P.G;   // physLock 厳密維持
    return Object.assign({ id, M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549,
      rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, phys: P }, extra); };
  const B = {};
  console.log('== Phase 2: 実単位 🌙(kFrame=1)==');
  B.base = await runCase(mkR('base', {}));
  console.log(`[B0 kF1 基準          ] ${fmt(B.base)}(崩壊の確認)`);
  B.pairReduced = await runCase(mkR('pr', { frameReaction: 'pairReduced' }));
  console.log(`[B1 pairReduced       ] ${fmt(B.pairReduced)}`);
  for (const k of [10, 100]) {
    B['massRescale' + k] = await runCase(mkR('mr' + k, { G: 6.674 * k },
      { M: 0.59724 / k, m2: 0.007346 / k }));
    console.log(`[B2 質量再スケール k=${String(k).padEnd(3)}] ${fmt(B['massRescale' + k])}`);
  }
  B.d02 = await runCase(mkR('d02', { D0: 2 }));
  console.log(`[B3 D0=2              ] ${fmt(B.d02)}`);
  out.tests.real = B;
}

// ---- 第145便: 実験マニフェスト(生成来歴・数値環境・分類・判定ポインタ・健全性)-------------
// 測定ロジック・数値は一切変更していない。結果へ `manifest` キーを1本足すだけの additive 変更。
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'kf1', wave: 119,
    title: 'kFrame=1 自由二体の安定化手法の系統探索(ループ利得 g の用量反応)',
    command: 'node tests/exp-kf1.mjs' },
  presets: { mode: 'dynamic',
    declaredIn: 'Phase1 = mkG() の誇張アナログ構成 / Phase2 = mkR() の実単位 🌙 構成',
    declaration: '動的構成(内蔵プリセットを読まず、ハーネス内の宣言値から HP.sim.build する)',
    configs: { phase1Base: { physics: basePhys, M: 1000, m2: 12.3, a: 180, e: 0,
        note: 'mkG の既定 — 個別の上書きは tests.analog.* の各エントリに記録' },
      phase2Real: { G: 6.674, D0: 0.1, kFrame: 1, q: 3, cLight: 30000, softening: 0.5,
        M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549,
        spinM: 0.0072921, spin2: 0.00026617, stateCarry: 'double' } },
    note: 'physLock 条件 Kt=c₀²/G は mkR 内で厳密に再計算して維持している' },
  numerics: {
    seed: 1, dt: 0.016,
    timeScale: 1,
    substeps: NOT_APPLICABLE,
    steps: '構成ごとに steps=ceil(orbits·T_K/dt)(T_K は各構成のケプラー周期 — 固定步数ではない)',
    window: { phase1Orbits: 2.1, phase2Orbits: 2.1,
      note: '崩壊検出で早期打ち切りする(rr>3a / rr<a/4 / NaN)。打ち切り時刻は collapseAt に公転単位で記録' },
    warmup: NOT_APPLICABLE,
  },
  classification: {
    input: ['物理キー(G・D₀・kFrame・q・λPN・geoPN・pnAlpha)の宣言値と用量',
      '🌙 実単位の質量・軌道要素・自転(観測由来の外部入力 — 本便で当てはめない)',
      'dt=0.016・seed=1・窓 2.1 公転'],
    fit: [],
    derived: ['振幅 amp=(rmax−rmin)/mean', '崩壊時刻 collapseAt(公転単位)',
      '周期残差 Tres=T/T_K−1', '重心ドリフト cmDrift', 'NaN フラグ'],
    holdOut: [],
    note: '本便は探索(どの機構が安定化に効くか)であり、当てはめた較正値を持たない。' +
      '質量再スケール (G,m)→(kG,m/k) は GM 不変の恒等変換であって fit ではない',
  },
  judgement: {
    pointers: ['tests.analog.base', 'tests.analog.pairReduced', 'tests.analog.massRescale',
      'tests.analog.qDose', 'tests.analog.thermal', 'tests.analog.d0ref', 'tests.analog.lam0',
      'tests.analog.combo', 'tests.real'],
    note: '合否窓を持たない探索ハーネスである(QA 非連動)。判定は「崩壊するか(collapseAt が非 null か)」' +
      'と振幅 amp の対照間比較で読む。許容窓は宣言していない — 数値はすべて上記ポインタの実測値である',
    externalReferences: ['🌙 の観測値: 恒星月 27.3217 日・e=0.0549(比較参照のみ・当てはめには使っていない)'],
  },
  health: {
    conservation: { status: 'partially-instrumented',
      quantity: '重心ドリフト |r_cm|/a(運動量保存の代理指標)',
      pointers: ['tests.analog.*.cmDrift', 'tests.real.*.cmDrift'],
      note: '運動量保存の代理として重心ドリフトのみ記録している。角運動量・エネルギーの残差は' +
        '記録していない(' + NOT_INSTRUMENTED + ')' },
  },
});

fs.writeFileSync(path.join(OUT_DIR, 'kf1-results.json'), JSON.stringify(out, null, 2));
console.log('saved: tests/out/kf1-results.json');
await browser.close();

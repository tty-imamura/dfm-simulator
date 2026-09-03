// 第123便 exp-kf1d.mjs — q の自動算出(LT整合則)と 💿 環系の検証
// (原仮定者指示「💿への共通補正適用: qの検証を進める。環粒子の近点移動も検証対象。
//   表面に近い方が引きずり効果が高いとした方がMM実験と整合」
//   「qは銀河スケールにも対応出来る様にする。qが計算で求まるなら編集対象から外す」)
// 算出則(第122便の抑制率則から導出): スピン項 ω(d)=s·(R/(R+d))^q の振幅超過は
//   X = 1.25·c₀²R/(GM)(a・s に非依存)なので、参照軌道 a で LT に一致する指数は
//   **q* = 3 + ln(1.25·c₀²R/(GM)) / ln((R+a)/R)** — 全て既知量から計算で求まる。
//   注意(第237便で訂正): d は中心間距離。源表面は d=R なので ω=s·2^{-q}、d→0 は中心一致である。
//   MM null との整合性は、往復光速の異方性を導出・検証するまで未判定(表面基準は dragRef:"surface" で別途)。
// 実行: node tests/exp-kf1d.mjs → tests/out/kf1d-results.json
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
const out = { target: TARGET, wave: 123, tests: {} };

const qCalc = (c, R, G, M, a) => 3 + Math.log(1.25 * c * c * R / (G * M)) / Math.log((R + a) / R);

// 二体 RL 計測(exp-kf1c と同一)
const runRL = (cfg) => page.evaluate(async (c) => {
  const P = c.phys, M = c.M, m2 = c.m2;
  const mu = c.pin ? M : M + m2, GM = P.G * mu;
  const e = c.e || 0, a = c.a, rp = a * (1 - e);
  const vp = Math.sqrt(GM * (1 + e) / rp) * (c.f || 1);
  const fm = c.pin ? 0 : m2 / (M + m2);
  const S = HP.sim;
  S.build({ id: 'kf1d', name: 'kf1d-' + c.id, emoji: '🧪', seed: 1,
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, physics: P,
    bodies: [
      { type: 'single', m: M, radius: c.rM, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
        spin: c.spinM || 0, pinned: !!c.pin, pnSource: true },
      { type: 'single', m: m2, radius: c.r2, x: rp * (1 - fm), y: 0, vx: 0,
        vy: vp * (1 - fm), spin: c.spin2 || 0, pinned: false }] });
  const TK = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const dt = 0.016, steps = Math.ceil((c.orbits || 8) * TK / dt);
  const SAMPLE = Math.max(1, Math.floor(steps / 4000));
  let pomPrev = null, pomUnw = 0, sT = 0, sP = 0, sTT = 0, sTP = 0, nS = 0;
  let ang = 0, px = 0, py = 0, t2pi = [];
  for (let k = 0; k < steps; k++) { S.step(dt);
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
    const rr = Math.hypot(dx, dy);
    if (k === 0) { px = dx; py = dy; }
    else { ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
      if (Math.abs(ang) >= 2 * Math.PI * (t2pi.length + 1)) t2pi.push((k + 1) * dt); }
    if (k % SAMPLE === 0) { const h = dx * vy - dy * vx;
      const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr, pom = Math.atan2(ey, ex);
      if (pomPrev !== null) { let d = pom - pomPrev;
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; pomUnw += d; }
      pomPrev = pom; const t = (k + 1) * dt;
      sT += t; sP += pomUnw; sTT += t * t; sTP += t * pomUnw; nS++; } }
  let Tavg = null; if (t2pi.length >= 2) { let acc = 0;
    for (let i = 1; i < t2pi.length; i++) acc += t2pi[i] - t2pi[i - 1]; Tavg = acc / (t2pi.length - 1); }
  const slope = (nS * sTP - sT * sP) / (nS * sTT - sT * sT);
  return { dPomPerOrbit: slope * TK, Tavg, nan: S.hasNaN() };
}, cfg);

const PROF = { G: 6.674, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  Kt: 134851663.17051244, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
  timeScale: 1, stateCarry: 'double' };

// ---- A) q 算出則の検証(🪨・🌘 — 参照軌道 = 初期距離)----
{
  const A = {};
  console.log('== A) q*=3+ln(1.25c²R/GM)/ln((R+a)/R) の検証 ==');
  const qM = qCalc(30000, 6.95, 6.674, 1988.5, 460.012);      // 🪨 近日点基準
  const qE = qCalc(30000, 6.38, 6.674, 0.59724, 363.63);      // 🌘 近地点基準
  console.log(`[A0 算出] 🪨 q*=${qM.toFixed(3)} / 🌘 q*=${qE.toFixed(3)}`);
  A.qMerc = qM; A.qEM = qE;
  A.mercKF0 = await runRL({ id: 'mK0', M: 1988.5, m2: 0.00033011, a: 579.09, e: 0.20563,
    rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8,
    phys: Object.assign({}, PROF, { kFrame: 0 }) });
  A.mercQstar = await runRL({ id: 'mQ*', M: 1988.5, m2: 0.00033011, a: 579.09, e: 0.20563,
    rM: 6.95, r2: 0.0244, spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8,
    phys: Object.assign({}, PROF, { q: qM }) });
  const dragM = A.mercQstar.dPomPerOrbit - A.mercKF0.dPomPerOrbit;
  // LT 解析値: Ω_LT=2GJ/(c²a³)・J=0.4MR²s → Δϖ_LT/公転 ≈ Ω_LT·T(逆行分は -4×?— 大きさのみ比較)
  const J = 0.4 * 1988.5 * 6.95 * 6.95 * 0.029031;
  const omLT = 2 * 6.674 * J / (30000 * 30000 * Math.pow(579.09, 3));
  const TK = 2 * Math.PI * Math.sqrt(Math.pow(579.09, 3) / (6.674 * 1988.5));
  A.ltPerOrbit = omLT * TK;
  console.log(`[A1 🪨 q=q*] 引きずり=${dragM.toExponential(3)} rad/公転(LT級目安 ${A.ltPerOrbit.toExponential(2)}・1PN=5.0e-7)NaN=${A.mercQstar.nan}`);
  A.dragMerc = dragM;
  A.emQstar = await runRL({ id: 'eQ*', M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549,
    rM: 6.38, r2: 1.74, spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8,
    phys: Object.assign({}, PROF, { q: qE, softening: 0.1 }) });
  console.log(`[A2 🌘 q=q*] Δϖ比=${(A.emQstar.dPomPerOrbit / 0.05311).toFixed(4)}(目標1.0) T=${A.emQstar.Tavg ? (A.emQstar.Tavg * 100 / 86400).toFixed(4) : '—'}日`);
  out.tests.qcalc = A;
}

// ---- B) 💿 環系: q* 適用 — 環粒子の近点移動+保持+表面近傍の随伴プロファイル(MM整合)----
{
  const B = {};
  console.log('== B) 💿 環系の q* 検証(偏心テスト粒子の近点移動・帯保持・随伴プロファイル)==');
  const qS = qCalc(30000, 60.3, 6.674, 56.834, 105);   // 参照 = 環中央値(≈B環)
  B.qStar = qS;
  console.log(`[B0 算出] 💿 q*(a_ref=105)=${qS.toFixed(2)}(環 75〜137・衛星〜1222 の中央値基準)`);
  const run = (kF, q) => page.evaluate(async ({ kF, q, PROF }) => {
    const P = Object.assign({}, PROF, { kFrame: kF, q, softening: 0.05 });
    const M = 56.834, GM = P.G * M;
    // 偏心テスト粒子: C/B/A環相当+タイタン相当(e=0.1・近点から発進)
    const radii = [80, 105, 130, 1221.9], bodies = [{ type: 'single', m: M, radius: 60.3,
      x: 0, y: 0, vx: 0, vy: 0, spin: 0.016528, pinned: true, pnSource: true }];
    for (const a of radii) { const e = 0.1, rp = a * (1 - e), vp = Math.sqrt(GM * (1 + e) / rp);
      bodies.push({ type: 'single', m: 1e-5, radius: 0.05, x: rp, y: 0, vx: 0, vy: vp, spin: 0, pinned: false }); }
    const S = HP.sim;
    S.build({ id: 'kf1dB', name: 'ring', emoji: '🧪', seed: 1, camera: { scale: 1300 },
      world: { boundary: 'none', size: 0 }, physics: P, bodies });
    const TK1 = 2 * Math.PI * Math.sqrt(Math.pow(80, 3) / GM);
    const dt = 0.016, steps = Math.ceil(6 * TK1 / dt);
    const n = radii.length;
    const pomU = new Float64Array(n), pomP = new Float64Array(n).fill(NaN);
    for (let k = 0; k < steps; k++) { S.step(dt);
      for (let i = 0; i < n; i++) { const j = i + 1;
        const dx = S.x[j], dy = S.y[j], vx = S.vx[j], vy = S.vy[j], rr = Math.hypot(dx, dy);
        const h = dx * vy - dy * vx;
        const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
        const pom = Math.atan2(ey, ex);
        if (!Number.isNaN(pomP[i])) { let d = pom - pomP[i];
          while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; pomU[i] += d; }
        pomP[i] = pom; } }
    const res = [];
    for (let i = 0; i < n; i++) { const a = radii[i];
      const Ti = 2 * Math.PI * Math.sqrt(a * a * a / GM);
      res.push({ a, dPomPerOrbit: pomU[i] / (steps * dt) * Ti }); }
    return { res, nan: S.hasNaN() };
  }, { kF, q, PROF });
  B.kF0 = await run(0, 3);
  B.q3 = await run(1, 3);
  B.qStarRun = await run(1, qS);
  for (let i = 0; i < 4; i++) {
    const a = B.kF0.res[i].a;
    const d3 = B.q3.res[i].dPomPerOrbit - B.kF0.res[i].dPomPerOrbit;
    const dS = B.qStarRun.res[i].dPomPerOrbit - B.kF0.res[i].dPomPerOrbit;
    console.log(`[B a=${String(a).padEnd(6)}] 近点移動 kF1−kF0: q=3 → ${d3.toExponential(2)} / q=q* → ${dS.toExponential(2)} rad/公転`);
  }
  // 随伴プロファイル(表面→遠方): ω_drag(d)=s·(R/(R+d))^q* を LT(d) と比較(解析値)
  B.profile = [];
  for (const d of [0.5, 5, 20, 45, 70, 170, 1160]) {
    const tt = 60.3 / (60.3 + 60.3 + d);   // 中心距離 = R+d(表面高度 d)
    const om = 0.016528 * Math.pow(60.3 / (60.3 + (60.3 + d)), qS);
    const J = 0.4 * 56.834 * 60.3 * 60.3 * 0.016528;
    const lt = 2 * 6.674 * J / (30000 * 30000 * Math.pow(60.3 + d, 3));
    B.profile.push({ hSurf: d, omDrag: om, omLT: lt, ratio: om / lt });
  }
  console.log('[B 随伴プロファイル(表面高度: ω_drag vs LT)] ' + B.profile.map(p =>
    `h=${p.hSurf}: ×${p.ratio.toExponential(1)}`).join(' '));
  out.tests.ring = B;
}

// ---- C) 銀河スケール: 算出則の適用可能性(値域)+外縁ブーストの q 感度 ----
{
  const C = {};
  console.log('== C) 🌌 銀河スケール: q* の値域+外縁ブーストの q 用量 ==');
  C.qStarGal = qCalc(30, 15, 0.8, 2500, 150);   // 🌌 実パラメータ(中心 m2500 R15 spin1.2・c30)
  console.log(`[C0 算出] 🌌 q*(a_ref=150)=${C.qStarGal.toFixed(2)}(値域内 — 誇張ドメインでも式は定義できる)`);
  const boost = (q) => page.evaluate(async (q) => {
    HP.loadPreset('galaxy', false);
    const S = HP.sim; S.params.q = q;
    const r0 = []; for (let i = 0; i < S.n; i++) r0.push(Math.hypot(S.x[i], S.y[i]));
    const ang = new Float64Array(S.n), prev = r0.map((_, i) => Math.atan2(S.y[i], S.x[i]));
    for (let k = 0; k < 3000; k++) { S.step(0.016);
      for (let i = 0; i < S.n; i++) { const a1 = Math.atan2(S.y[i], S.x[i]);
        let d = a1 - prev[i]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        ang[i] += d; prev[i] = a1; } }
    let accOut = 0, nOut = 0;
    for (let i = 0; i < S.n; i++) if (r0[i] > 180 && !S.pinned[i]) { accOut += Math.abs(ang[i]); nOut++; }
    return { meanOut: accOut / Math.max(1, nOut), nOut };
  }, q);
  C.q2 = await boost(2); C.qStar = await boost(C.qStarGal); C.q5 = await boost(5);
  console.log(`[C1 外縁平均回転角(3000步)] q=2: ${C.q2.meanOut.toFixed(4)} / q=q*(${C.qStarGal.toFixed(1)}): ${C.qStar.meanOut.toFixed(4)}(比 ${(C.qStar.meanOut / C.q2.meanOut).toFixed(3)}) / q=5: ${C.q5.meanOut.toFixed(4)}`);
  out.tests.galaxy = C;
}

// ---- 第145便: 実験マニフェスト(生成来歴・数値環境・分類・判定ポインタ・健全性)-------------
// 測定ロジック・数値は一切変更していない。結果へ `manifest` キーを1本足すだけの additive 変更。
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'kf1d', wave: 123,
    title: 'q の自動算出(LT 整合則 q*=3+ln(1.25c₀²R/GM)/ln((R+a)/R))と 💿 環系・銀河スケールの検証',
    command: 'node tests/exp-kf1d.mjs' },
  presets: { mode: 'mixed', ids: ['galaxy'],
    declaredIn: 'A) runRL() の 🪨🌘 構成 / B) page.evaluate 内の 💿 環構成 / C) 内蔵 🌌galaxy を loadPreset',
    declaration: 'A)B) は動的構成(宣言値から build)、C) だけ内蔵プリセット 🌌galaxy を読み込んで S.params.q を差し替える',
    modifiedAtRuntime: 'C) は HP.loadPreset("galaxy", false) の後に S.params.q のみ上書きする(他キーはプリセット既定のまま)',
    configs: {
      profile: PROF,
      mercury: { M: 1988.5, m2: 0.00033011, a: 579.09, e: 0.20563, rM: 6.95, r2: 0.0244,
        spinM: 0.029031, spin2: 0.0124, pin: true, orbits: 8, qRefA: 460.012 },
      earthMoon: { M: 0.59724, m2: 0.007346, a: 384.748, e: 0.0549, rM: 6.38, r2: 1.74,
        spinM: 0.0072921, spin2: 0.00026617, f: 0.9968, orbits: 8, softening: 0.1, qRefA: 363.63 },
      ring: { M: 56.834, radius: 60.3, spin: 0.016528, softening: 0.05,
        probeRadii: [80, 105, 130, 1221.9], probeMass: 1e-5, e: 0.1, orbits: '6 × T(a=80)',
        qRefA: 105 },
      galaxy: { source: '内蔵プリセット 🌌galaxy', steps: 3000, dt: 0.016,
        qRefParams: { c: 30, R: 15, G: 0.8, M: 2500, a: 150 }, outerRadius: '>180' } },
    note: 'Kt=134851663.17051244 は c₀²/G(physLock 条件)の値である' },
  numerics: {
    seed: { dynamicSections: 1, galaxy: '内蔵 🌌galaxy のプリセット定義値',
      note: 'A)B) は build に seed:1 を渡す。C) は loadPreset がプリセット定義の seed を使う' },
    dt: 0.016, timeScale: 1, substeps: NOT_APPLICABLE,
    steps: { mercuryEarthMoon: 'ceil(8·T_K/dt)', ring: 'ceil(6·T(a=80)/dt)', galaxy: 3000 },
    window: { mercuryEarthMoon: '8 公転', ring: '6 × 内縁(a=80)公転', galaxy: '3000 步(t=48)' },
    warmup: NOT_APPLICABLE,
    lsqSampling: '≤4000 標本(SAMPLE=floor(steps/4000)— RL 角の LSQ 標本数。測定窓は間引いていない)',
  },
  classification: {
    input: ['🪨🌘💿🌌 の質量・半径・自転・軌道要素(観測由来ないし内蔵プリセットの既存値)',
      'dt=0.016・各系の窓', 'D₀=0.006(第120便の共有較正値 — 本便で再フィットしない)'],
    fit: [],
    derived: ['q* = 3 + ln(1.25·c₀²R/(GM))/ln((R+a)/R)(既知量だけから計算 — tests.qcalc.qMerc/qEM・' +
      'tests.ring.qStar・tests.galaxy.qStarGal)',
      '引きずり歳差 kF1−kF0(tests.qcalc.dragMerc・tests.ring)',
      'LT 解析値 Ω_LT=2GJ/(c²a³)(tests.qcalc.ltPerOrbit・tests.ring.profile.omLT)',
      '外縁平均回転角(tests.galaxy)'],
    holdOut: ['💿 環系と 🌌 銀河スケールへの q* 適用(算出則は 🪨🌘 から導いたもので、💿🌌 の' +
      'データには一度も当てはめていない — 値域と効き方の事後外挿テストである)'],
    note: '**本便の眼目は q を編集対象から外すこと**である。q は当てはめではなく既知量からの算出値であり、' +
      'fit は空である(D₀ も第120便の共有値をそのまま使う)',
  },
  judgement: {
    pointers: ['tests.qcalc', 'tests.qcalc.ltPerOrbit', 'tests.ring', 'tests.ring.profile',
      'tests.galaxy'],
    note: '合否窓を持たない検証ハーネスである(QA 非連動)。🪨 は引きずり歳差を LT 級目安 ' +
      'tests.qcalc.ltPerOrbit および 1PN=5.0e-7 rad/公転 と、💿 は随伴プロファイル比 ω_drag/ω_LT と' +
      '突き合わせて読む。外部解析値も残差も上記ポインタの中にある',
    externalReferences: ['Lense–Thirring 解析値 Ω_LT=2GJ/(c²a³)(J=0.4MR²s の一様球近似)',
      '☄️/🪨 水星の 1PN 解析値 5.02e-7 rad/公転', '🌘 の近点回転 0.05311 rad/公転'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない' },
  },
});

fs.writeFileSync(path.join(OUT_DIR, 'kf1d-results.json'), JSON.stringify(out, null, 2));
console.log('saved: tests/out/kf1d-results.json');
await browser.close();

// 第135便群 exp-coreshell.mjs — 原仮定者の仮説「コアの引きずりの影響範囲が外殻を安定させている」の実測考察
// ============================================================================================
// 仮説(原仮定者): 「多くの天体がコアと外殻の構造になっている。**コアの引きずりの影響範囲が
//   外殻を安定させているのではないか**」
// DFM の引きずり: A8/E6′(kFrame)+スピン項 ω(d)=s·(R/(R+d))^q。コアv2(J_core 主変数)は
//   同型の第2項 ω_c(d)=(Mc/m)·(Ω_c−s)·(Rc/(Rc+d))^q を**コアの小さい核 Rc で**加える。
//   決定フレーム u=Σ_j w_j·c_j/(D₀+Σ_j w_j)、w_j=m_j/√(d²+ε²)、c_j=v_j+ω_j(d)·ẑ×(r−r_j)。
//   → 「影響範囲」= (Rc/(Rc+d))^q の幾何減衰。q が大きいほど範囲は表面近傍へ絞られる。
// 検証の骨子(用量反応+交差対照):
//   ① コアスピン用量 Ω_c ∈ {0, 0.5, 1, 2}×実値 — 引きずり源を消す⇄強める
//   ② 影響範囲用量 q ∈ {1, 2(実値), 3, 4} — 範囲を広げる⇄絞る
//   ③ kFrame 対照 kFrame ∈ {0, 1} — ①②と全交差(Ω_c=0×kF1 / Ω_c=実×kF0 / 両方)で
//      「安定性差が kFrame(引きずり)経由か、それとも別経路(τ_cs のスピン移送→E5′スピン斥力)か」
//      を分離する。**Ω_c は kFrame=0 でも E5′ スピン斥力へ効く**(τ_cs で殻スピンが変わるため)
//      ので、この交差なしでは仮説を検証できない。
//   ④ τ_cs 切り(K_cs=0)対照 — コア→殻の J 移送を止め、Ω_c を「引きずり源」だけの変数にする
//   ⑤ 殻スピン s=0 対照 — 基底スピン項を消し、コア差動項だけの引きずりにする
//   ⑥⑦【決定対照】kRep=0 — **煙試験で判明した交絡**: E5′ スピン斥力 F=kRep·μ·(ω_i²+ω_j²)·(r_i−r_j) の
//      ω_i は A8 と同じ合成値、すなわち**コア差動項 (Mc/m)(Ω_c−s)(Rc/(Rc+d))^q を含む**。したがって
//      Ω_c と q は kFrame=0 でも「圧力」として外殻に効く。kRep=0 にして初めて Ω_c/q は引きずり専用になる。
// 外殻の安定性指標(実測定義): 帯ごとに
//   (a) 半径分散 σ_r/⟨r⟩ の時間発展 (b) 逃散率/落下率 (c) 相対半径変化 (r−r₀)/r₀ の平均と分散
//   (d) 相対速度 |v−u|(引きずりの粘性的整合 — kFrame=1 のときエンジンが uPx/uPy に持つ)
// 幾何関係の実測: Ω_frame(r)=(x·u_y−y·u_x)/r²(中心相対) vs Ω_kepler(r)=√(G·m₀/(r²+ε²)^{3/2})
//   を各構成の初期配置で 1步プローブ(kFrame=1 強制)して外殻位置と影響範囲の内外関係を測る。
// ============================================================================================
// 再現条件(すべて固定):
//   対象     : QA_TARGET(既定 index.html = ルート。beta と物理は同一)
//   dt       : 0.016(全サンプル共通・エンジン既定の刻み)
//   seed     : 各サンプルのプリセット定義値(⚫bhCore/🌱starSeed=20260805・🥚selfRotor=20260806・
//              🎯saturnLayered=プリセット既定)— build がそれを使うので構成間で同一
//   步数     : ⚫bhCore 6000步(validT=96 の実測窓・exp-4-81 と同一)
//              🎯saturnLayered 9375步(t=150 — QA behavior.saturnLayered の第1窓)
//              🥚selfRotor 9000步(validT=144)/ 🌱starSeed 6000步(validT=96)/
//              🐚nebulaShell 3000步(validT=48)
//   構成数   : ⚫ 38 / 🎯 28 / 🥚 6 / 🌱 4 / 🐚 20 = 96 構成
//   実行時間 : 煙試験(1/10 步)実測 ⚫1.2〜3.8s・🎯1.2〜3.3s・🥚0.9〜1.6s/構成 → 本番見積 25〜30 分。
//              **本番実測 = 22.1 分(⚫🎯🥚🌱・38+28+6+4 構成)+ 0.4 分(🐚 20 構成)= 22.5 分**
//              (1構成あたり ⚫ kF1 21〜34s / kF0 12s・🎯 kF1 23〜32s / kF0 12s・🥚 12〜16s・🐚 0.7〜2.3s。
//               個別値は JSON の各 run.elapsedSec、総計は meta.elapsedSec)
//   判定     : 安定 = (逃散率+落下率が対照比で増えない) かつ (σ_r/⟨r⟩ が対照比で増えない)。
//              仮説支持の条件 = 「Ω_c を下げると kF1 側でだけ安定性が下がる」(kF0 側で同じ差が
//              出るなら引きずり以外の経路 = 仮説の反証ではなく交絡)。
//   数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
// 実行: node tests/exp-coreshell.mjs → tests/out/coreshell-results.json
//       QA_TARGET=beta/index.html node tests/exp-coreshell.mjs でも同じ(物理キー共通)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

// CS_QUICK=1 で全構成の步数を 1/10 にした煙試験(配線確認専用 — 本番数値ではない)
const QUICK = !!process.env.CS_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
// CS_ONLY="bh,sat,self,seed,neb" で節を選択実行(既定=全節)。CS_MERGE=1 で既存 JSON へ追記合流する
// (長い節を再走せずに新しい節だけ足すための運用スイッチ — 出力の意味は同じ)
const ONLY = (process.env.CS_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));
const OUT_PATH = path.join(OUT_DIR, 'coreshell-results.json');

const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const out = { meta: { exp: 'coreshell', wave: 135, target: TARGET, date: new Date().toISOString(),
  dt: 0.016, hypothesis: 'コアの引きずりの影響範囲が外殻を安定させているのか' }, samples: {} };
if (process.env.CS_MERGE && fs.existsSync(OUT_PATH)) {
  const prev = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  out.samples = prev.samples || {};
  out.meta.mergedFrom = prev.meta;
}

// ============================ 共通: サンプル改変器(ブラウザ側へ渡す純関数の材料) ==========
// mod: { kFrame, omMul, q, kcs, spin, steps, bands }
// omMul は「コア角速度 Ω_c の実値に対する倍率」— core.omega を倍率で置き換える
//   (J_core=½·Mc·Rc²·Ω_c なので omega を触るのが J_core を触るのと同義)

// ---------------------------------------------------------------------------------------
// A) ⚫bhCore(主対象1): 中心 m=2500・R=15・s=0.15・コア Mc/m=0.3・Rc=7.5・Ω_c=20・K_cs=0.02。
//    外殻 = ①降着円盤ガス 120体(index 1..120・箱 200×16)②恒星ディスク 200体(index 121..320・r≦260)
//    物理: G=0.8・D₀=1.5・kFrame=1・q=2・kRep=1・geoPN=0・softening=3・timeScale=3・
//          frameReaction="pairReduced"(自由中心)
// ---------------------------------------------------------------------------------------
const measureBH = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
  const OM0 = p.bodies[0].core.omega, S0 = p.bodies[0].spin, Q0 = p.physics.q, KCS0 = p.bodies[0].core.Kcs;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) p.bodies[0].core.omega = OM0 * o.omMul;
  if (o.kcs !== undefined) p.bodies[0].core.Kcs = o.kcs;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;   // E5′ スピン斥力を切る = コア差動の第2経路を閉じる
  HP.sim.build(p);
  const S = HP.sim;
  const GAS_LO = 1, GAS_HI = 121, STA_LO = 121, STA_HI = S.n;   // 0=中心 / 1..120 ガス / 121..320 恒星
  const r0 = new Float64Array(S.n);
  const rel = (i) => Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]);
  for (let i = 0; i < S.n; i++) r0[i] = rel(i);
  // 帯統計: σ_r/⟨r⟩・相対半径変化・逃散/落下・|v−u|
  const band = (lo, hi, escR, fallR) => {
    let n = 0, s = 0, s2 = 0, esc = 0, fall = 0, dr = 0, dr2 = 0, vu = 0, vuN = 0, sp = 0;
    for (let i = lo; i < hi; i++) {
      const r = rel(i); n++; s += r; s2 += r * r;
      if (r > escR) esc++; if (r < fallR) fall++;
      const d = (r - r0[i]) / Math.max(r0[i], 1e-9); dr += d; dr2 += d * d;
      const vx = S.vx[i] - S.vx[0], vy = S.vy[i] - S.vy[0];
      sp += Math.hypot(vx, vy);
      if (S.hasU[i]) { vu += Math.hypot(S.vx[i] - S.uPx[i], S.vy[i] - S.uPy[i]); vuN++; }
    }
    const mean = s / n, sd = Math.sqrt(Math.max(0, s2 / n - mean * mean));
    const dm = dr / n;
    return { n, meanR: mean, sdR: sd, sdOverMean: sd / Math.max(mean, 1e-9),
      escFrac: esc / n, fallFrac: fall / n, meanRelDr: dm,
      sdRelDr: Math.sqrt(Math.max(0, dr2 / n - dm * dm)),
      meanSpeed: sp / n, meanVminusU: vuN ? vu / vuN : null };
  };
  const snap = () => ({ t: S.t, gas: band(GAS_LO, GAS_HI, 200, 30), star: band(STA_LO, STA_HI, 450, 30) });
  const L0 = S.totals().L + S.resL + S.radL;
  const cs0 = HP.coreState(0);
  const steps = o.steps, NS = 4, series = [snap()];
  for (let c = 0; c < NS; c++) {
    for (let k = 0; k < steps / NS; k++) S.step(0.016);
    series.push(snap());
  }
  // exp-4-81 と同一定義の外縁回転量(中心相対・r∈[156,286] の平均 v_θ)— 増強比の分子/分母
  let sum = 0, c2 = 0;
  for (let i = STA_LO; i < STA_HI; i++) {
    const dx = S.x[i] - S.x[0], dy = S.y[i] - S.y[0], rr = Math.hypot(dx, dy);
    if (rr >= 156 && rr <= 286) { sum += (dx * (S.vy[i] - S.vy[0]) - dy * (S.vx[i] - S.vx[0])) / rr; c2++; }
  }
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * S.m[i] * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  const cs1 = HP.coreState(0);
  const L1 = S.totals().L + S.resL + S.radL;
  return { cfg: { kFrame: p.physics.kFrame, q: p.physics.q, kRep: p.physics.kRep,
      coreOmega: p.bodies[0].core.omega,
      coreOmegaRef: OM0, shellSpin0: p.bodies[0].spin, shellSpinRef: S0, Kcs: p.bodies[0].core.Kcs,
      KcsRef: KCS0, qRef: Q0, steps },
    series, final: series[series.length - 1],
    outerVt: c2 ? sum / c2 : 0, nOuter: c2,
    coreOm0: cs0 ? cs0.omega : null, coreOm1: cs1 ? cs1.omega : null,
    shellSpin1: S.spin[0], n: S.n,
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
}, mod);

// ---------------------------------------------------------------------------------------
// B) 🎯saturnLayered(主対象2 — 「コア+外殻(環)」の幾何が最も素直なサンプル):
//    中心 m=1500・R=1.8·√1500≈69.7・s=0.05(pinned)・コア Mc/m=0.18・Rc=29.577・Ω_c=0.0525・K_cs=0。
//    外殻 = 環粒子 240体(index 1..240・C帯 104-132 / B帯 132-190 / A帯 190-212)
//    物理: G=1・D₀=2・kFrame=1・q=2・kRep=1.2・muF=0.2・geoPN=0・softening=2・timeScale=3
//    指標は QA behavior.saturnLayered と同一定義(inB 90≦r≦290・fall r<85・esc r>320)+ σ_r/⟨r⟩ と
//    離心率 RMS(中心は pinned なので原点固定・GM=G·1500)
// ---------------------------------------------------------------------------------------
const measureSat = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'saturnLayered')));
  const OM0 = p.bodies[0].core.omega, S0 = p.bodies[0].spin, Q0 = p.physics.q;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) p.bodies[0].core.omega = OM0 * o.omMul;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;   // E5′ スピン斥力を切る = コア差動の第2経路を閉じる
  HP.sim.build(p);
  const S = HP.sim;
  const RN = p.bodies.filter(b => b.type === 'ring').map(b => b.n);
  const i1 = RN[0], i2 = RN[0] + RN[1], i3 = RN[0] + RN[1] + RN[2];
  const GM = p.physics.G * p.bodies[0].m;
  const r0 = new Float64Array(S.n);
  for (let i = 0; i < S.n; i++) r0[i] = Math.hypot(S.x[i], S.y[i]);
  const med = (lo, hi) => { const rs = []; for (let i = lo; i <= hi; i++) rs.push(Math.hypot(S.x[i], S.y[i]));
    rs.sort((a, b) => a - b); return rs[Math.floor(0.5 * (rs.length - 1))]; };
  const band = (lo, hi) => {
    let n = 0, s = 0, s2 = 0, inB = 0, fall = 0, esc = 0, dr = 0, dr2 = 0, ec = 0, ec2 = 0, vu = 0, vuN = 0;
    for (let i = lo; i <= hi; i++) {
      const x = S.x[i], y = S.y[i], vx = S.vx[i], vy = S.vy[i], r = Math.hypot(x, y);
      n++; s += r; s2 += r * r;
      if (r >= 90 && r <= 290) inB++; if (r < 85) fall++; if (r > 320) esc++;
      const d = (r - r0[i]) / Math.max(r0[i], 1e-9); dr += d; dr2 += d * d;
      const h = x * vy - y * vx;
      const ex = (vy * h) / GM - x / r, ey = (-vx * h) / GM - y / r, e = Math.hypot(ex, ey);
      ec += e; ec2 += e * e;
      if (S.hasU[i]) { vu += Math.hypot(vx - S.uPx[i], vy - S.uPy[i]); vuN++; }
    }
    const mean = s / n, sd = Math.sqrt(Math.max(0, s2 / n - mean * mean)), dm = dr / n;
    return { n, meanR: mean, sdR: sd, sdOverMean: sd / Math.max(mean, 1e-9),
      inBFrac: inB / n, fallFrac: fall / n, escFrac: esc / n,
      meanRelDr: dm, sdRelDr: Math.sqrt(Math.max(0, dr2 / n - dm * dm)),
      eccMean: ec / n, eccRMS: Math.sqrt(ec2 / n), meanVminusU: vuN ? vu / vuN : null };
  };
  const snap = () => ({ t: S.t, all: band(1, i3), C: band(1, i1), B: band(i1 + 1, i2), A: band(i2 + 1, i3),
    medC: med(1, i1), medB: med(i1 + 1, i2), medA: med(i2 + 1, i3) });
  const steps = o.steps, NS = 3, series = [snap()];
  for (let c = 0; c < NS; c++) { for (let k = 0; k < steps / NS; k++) S.step(0.016); series.push(snap()); }
  const cs1 = HP.coreState(0);
  return { cfg: { kFrame: p.physics.kFrame, q: p.physics.q, kRep: p.physics.kRep,
      coreOmega: p.bodies[0].core.omega,
      coreOmegaRef: OM0, shellSpin0: p.bodies[0].spin, shellSpinRef: S0, qRef: Q0, steps, ringN: RN },
    series, final: series[series.length - 1], coreOm1: cs1 ? cs1.omega : null,
    n: S.n, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
}, mod);

// ---------------------------------------------------------------------------------------
// C) 🥚selfRotor(対照サンプル): 180粒の一様円盤が融合で中心天体を作る自己形成系。
//    コアは**全粒子が同じ微小な種**(Mc/m=0.05・Rc=0.2・Ω_c=2)で、中心天体のコアは融合継承で育つ。
//    Rc が極端に小さい(0.2 対 粒子半径 R=1)ので「影響範囲」がほぼゼロ = 仮説の陰性対照になる。
// ---------------------------------------------------------------------------------------
const measureSelf = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'selfRotor')));
  const OM0 = p.bodies[0].core.omega, Q0 = p.physics.q;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) p.bodies[0].core.omega = OM0 * o.omMul;
  HP.sim.build(p);
  const S = HP.sim;
  const n0 = S.n;
  for (let k = 0; k < o.steps; k++) S.step(0.016);
  // 最重天体(=中心)を特定し、その周りの「外殻」= 残りの粒子の分布を測る
  let hi = 0, Mtot = 0;
  for (let i = 0; i < S.n; i++) { Mtot += S.m[i]; if (S.m[i] > S.m[hi]) hi = i; }
  let n = 0, s = 0, s2 = 0, bound = 0, vu = 0, vuN = 0;
  const G = p.physics.G;
  for (let i = 0; i < S.n; i++) {
    if (i === hi) continue;
    const dx = S.x[i] - S.x[hi], dy = S.y[i] - S.y[hi], r = Math.hypot(dx, dy);
    const vx = S.vx[i] - S.vx[hi], vy = S.vy[i] - S.vy[hi];
    n++; s += r; s2 += r * r;
    if (0.5 * (vx * vx + vy * vy) - G * S.m[hi] / Math.max(r, 1e-6) < 0) bound++;
    if (S.hasU[i]) { vu += Math.hypot(S.vx[i] - S.uPx[i], S.vy[i] - S.uPy[i]); vuN++; }
  }
  const mean = s / n, sd = Math.sqrt(Math.max(0, s2 / n - mean * mean));
  const cs = HP.coreState(hi);
  return { cfg: { kFrame: p.physics.kFrame, q: p.physics.q, coreOmega: p.bodies[0].core.omega,
      coreOmegaRef: OM0, qRef: Q0, steps: o.steps },
    n0, n: S.n, mergers: n0 - S.n, maxMassFrac: S.m[hi] / Mtot,
    shell: { n, meanR: mean, sdR: sd, sdOverMean: sd / Math.max(mean, 1e-9),
      boundFrac: bound / n, meanVminusU: vuN ? vu / vuN : null },
    coreJ: cs ? cs.J : null, coreOm: cs ? cs.omega : null, coreRc: cs ? cs.Rc : null,
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN };
}, mod);

// ---------------------------------------------------------------------------------------
// D) 🌱starSeed(参考): 固定親のまわりを回る2つの種(差動コアA / 剛体コアB)。
//    **粒子の外殻を持たない**(外殻= 種そのものの「殻スピン s」)ので、本仮説の直接検証には
//    使えない。ここでは「コアv2 の Ω_c 用量が軌道と殻へどう出るか」だけを参考記録する。
// ---------------------------------------------------------------------------------------
const measureSeed = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'starSeed')));
  const OM0 = p.bodies[1].core.omega;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.omMul !== undefined) { p.bodies[1].core.omega = OM0 * o.omMul; p.bodies[2].core.omega = (p.bodies[2].core.omega) * o.omMul; }
  HP.sim.build(p);
  const S = HP.sim;
  const rA0 = Math.hypot(S.x[1], S.y[1]), rB0 = Math.hypot(S.x[2], S.y[2]);
  let rAmin = Infinity, rAmax = 0;
  for (let k = 0; k < o.steps; k++) { S.step(0.016);
    const r = Math.hypot(S.x[1], S.y[1]); if (r < rAmin) rAmin = r; if (r > rAmax) rAmax = r; }
  const csA = HP.coreState(1), csB = HP.coreState(2);
  return { cfg: { kFrame: p.physics.kFrame, coreOmegaA: p.bodies[1].core.omega, coreOmegaRef: OM0, steps: o.steps },
    rA0, rB0, rAmin, rAmax, rAamp: (rAmax - rAmin) / ((rAmax + rAmin) / 2),
    spinA: S.spin[1], spinB: S.spin[2],
    coreOmA: csA ? csA.omega : null, coreRcA: csA ? csA.Rc : null,
    coreOmB: csB ? csB.omega : null, nan: S.hasNaN() };
}, mod);

// ---------------------------------------------------------------------------------------
// D2) 🐚nebulaShell(**仮説に最も近い既存サンプル**): 第75便 原仮定者指示「粒子の外殻は重く、
//    粒子のコアが高速スピンして光学的な影響範囲は狭い想定」の実装。塵粒 54体(index 0..53)が
//    それぞれ「重い外殻(m=24〜36・殻スピン 0.48〜0.72)+高速小コア(Mc/m=0.4・Rc=1.150・Ω_c=16)」で、
//    その外側に**低スピンの放射エンベロープ 44体(index 54..97・r=62〜150)**が回る。
//    既存の主張(docs/PHYSICS.md): 同じ暗さを単層で出すと保持率 0.481 まで自壊するのに、
//    2層(暗さを小コアへ隠す)なら保持 1.000 — 「コアの狭い影響範囲」が外殻を保つ、という
//    仮説そのものの実測例。ここではその機構が kFrame(引きずり)経由か kRep(E5′斥力)経由かを
//    Ω_c 用量 × kFrame × kRep の交差で判定する。窓は validT=48(3000步)。
// ---------------------------------------------------------------------------------------
const measureNeb = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'nebulaShell')));
  const OM0 = p.bodies[0].core.omega;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = OM0 * o.omMul;
  HP.sim.build(p);
  const S = HP.sim;
  const NC = p.bodies[0].n + p.bodies[1].n + p.bodies[2].n;   // 0..53 = クランプ(コア持ち)
  const r0 = new Float64Array(S.n);
  const com = () => { let M = 0, cx = 0, cy = 0, cvx = 0, cvy = 0;
    for (let i = 0; i < NC; i++) { const mi = S.m[i]; M += mi; cx += mi * S.x[i]; cy += mi * S.y[i];
      cvx += mi * S.vx[i]; cvy += mi * S.vy[i]; }
    return { x: cx / M, y: cy / M, vx: cvx / M, vy: cvy / M, M }; };
  let c = com();
  for (let i = 0; i < S.n; i++) r0[i] = Math.hypot(S.x[i] - c.x, S.y[i] - c.y);
  for (let k = 0; k < o.steps; k++) S.step(0.016);
  c = com();
  const G = p.physics.G;
  const band = (lo, hi) => {
    let n = 0, sum = 0, s2 = 0, keep = 0, bound = 0, dr = 0, dr2 = 0, vu = 0, vuN = 0;
    for (let i = lo; i < hi; i++) {
      const dx = S.x[i] - c.x, dy = S.y[i] - c.y, r = Math.hypot(dx, dy);
      const vx = S.vx[i] - c.vx, vy = S.vy[i] - c.vy;
      n++; sum += r; s2 += r * r;
      if (r < 300) keep++;                                   // 保持(第75便の「保持率」と同じ趣旨の窓)
      if (0.5 * (vx * vx + vy * vy) - G * c.M / Math.max(r, 1e-6) < 0) bound++;
      const d = (r - r0[i]) / Math.max(r0[i], 1e-9); dr += d; dr2 += d * d;
      if (S.hasU[i]) { vu += Math.hypot(S.vx[i] - S.uPx[i], S.vy[i] - S.uPy[i]); vuN++; }
    }
    const mean = sum / n, sd = Math.sqrt(Math.max(0, s2 / n - mean * mean)), dm = dr / n;
    return { n, meanR: mean, sdR: sd, sdOverMean: sd / Math.max(mean, 1e-9),
      keepFrac: keep / n, boundFrac: bound / n, meanRelDr: dm,
      sdRelDr: Math.sqrt(Math.max(0, dr2 / n - dm * dm)), meanVminusU: vuN ? vu / vuN : null };
  };
  let lsw = 0; for (let i = 0; i < NC; i++) lsw += S.lSw[i];
  return { cfg: { kFrame: p.physics.kFrame, q: p.physics.q, kRep: p.physics.kRep,
      coreOmega: p.bodies[0].core.omega, coreOmegaRef: OM0, steps: o.steps, nClump: NC },
    clump: band(0, NC), envelope: band(NC, S.n), lswClumpMean: lsw / NC,
    n: S.n, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN };
}, mod);

// ---------------------------------------------------------------------------------------
// E) 影響範囲プローブ: 初期配置で kFrame=1 を強制して 1步だけ回し、外殻粒子位置の
//    決定フレーム u から Ω_frame(r)=(x·u_y−y·u_x)/r² を測る(中心相対)。
//    比較対象は Ω_kepler(r)=√(G·m₀/(r²+ε²)^{3/2})(ソフトニング込みの円軌道角速度)。
//    解析分解 ω_base(d)=s·(R/(R+d))^q・ω_core(d)=(Mc/m)·(Ω_c−s)·(Rc/(Rc+d))^q も同時に返し、
//    「u はこの2項のどちらで作られているか」を突き合わせる。
// ---------------------------------------------------------------------------------------
const profileOf = (id, mod) => page.evaluate(({ id, o }) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === id)));
  p.physics.kFrame = 1;                                   // u を必ず生成させる(kF0 構成でも「効くはずの場」を測る)
  if (o.q !== undefined) p.physics.q = o.q;
  const OM0 = p.bodies[0].core.omega;
  // コアを持つ body すべてを同じ倍率で振る(🐚 のようにコア持ち body が複数ある系のため。
  // ⚫🎯 はコア持ちが bodies[0] だけなので従来と同一)
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = b.core.omega * o.omMul;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  HP.sim.build(p);
  const S = HP.sim;
  S.step(0.016);                                          // uPx/uPy は step 末尾で確定する
  const q = S.params.q, G = S.params.G, eps = S.params.softening, D0 = S.params.D0;
  const m0 = S.m[0], R0 = S.R[0], s0 = S.spin[0];
  const Rc = S.RcV[0], mf = S.coreMF[0], Omc = S.coreOmV[0];
  const bins = new Map();
  for (let i = 1; i < S.n; i++) {
    const x = S.x[i] - S.x[0], y = S.y[i] - S.y[0], r = Math.hypot(x, y);
    if (!(r > 1e-6) || !S.hasU[i]) continue;
    const ux = S.uPx[i] - S.vx[0], uy = S.uPy[i] - S.vy[0];  // 中心の並進を抜いた回転成分
    const omF = (x * uy - y * ux) / (r * r);
    const k = Math.round(r / 10) * 10;                     // 10 単位の半径ビン
    const b = bins.get(k) || { r: 0, om: 0, n: 0 };
    b.r += r; b.om += omF; b.n++; bins.set(k, b);
  }
  const prof = [...bins.entries()].sort((a, b) => a[0] - b[0]).map(([k, b]) => {
    const r = b.r / b.n;
    const tb = R0 / (R0 + r), tc = Rc > 0 ? Rc / (Rc + r) : 0;
    const omBase = s0 * Math.pow(tb, q);
    const omCore = Rc > 0 ? mf * (Omc - s0) * Math.pow(tc, q) : 0;
    const w0 = m0 / Math.sqrt(r * r + eps * eps);
    const omKep = Math.sqrt(G * m0 / Math.pow(r * r + eps * eps, 1.5));
    return { rBin: k, r, n: b.n, omFrameMeasured: b.om / b.n,
      omBaseAnalytic: omBase, omCoreAnalytic: omCore,
      omDragAnalytic: omBase + omCore,
      wFrac0: w0 / (D0 + w0),                              // 中心だけの単純重み比(参考)
      omKepler: omKep,
      dragOverKepler: (omBase + omCore) / omKep,
      measuredOverKepler: (b.om / b.n) / omKep };
  });
  // コア差動項が基底スピン項を上回る半径(=「コアの影響範囲」の実測的境界)
  let rCross = null;
  for (const e of prof) { if (Math.abs(e.omCoreAnalytic) < Math.abs(e.omBaseAnalytic)) { rCross = e.r; break; } }
  return { params: { q, G, D0, softening: eps, m0, R0, s0, Rc, coreMassFrac: mf, coreOmega: Omc },
    prof, rCoreDominanceEnds: rCross };
}, { id, o: mod });

// ======================================= 実行 ==============================================
const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

// ---- A) ⚫bhCore ----
if (doSec('bh')) {
  const STEPS = SC(6000);
  const runs = {};
  const CFG = [];
  // ① Ω_c 用量 × ③ kFrame 交差(q=実値2・K_cs=実値0.02)
  for (const kF of [1, 0]) for (const om of [0, 0.5, 1, 2]) CFG.push({ tag: `om${om}_kF${kF}`, kFrame: kF, omMul: om });
  // ② q 用量 × kFrame 交差(Ω_c=実値)
  for (const kF of [1, 0]) for (const q of [1, 3, 4]) CFG.push({ tag: `q${q}_kF${kF}`, kFrame: kF, q });
  // ④ τ_cs 切り(K_cs=0)× Ω_c 用量 × kFrame — Ω_c を「引きずり源」だけの変数にする交絡除去
  for (const kF of [1, 0]) for (const om of [0, 1, 2]) CFG.push({ tag: `kcs0_om${om}_kF${kF}`, kFrame: kF, omMul: om, kcs: 0 });
  // ⑤ 殻スピン s=0(基底スピン項なし = コア差動だけの引きずり)
  for (const kF of [1, 0]) CFG.push({ tag: `s0_kF${kF}`, kFrame: kF, spin: 0 });
  // ⑥【決定対照】kRep=0(E5′ スピン斥力を切る)× Ω_c 用量 × kFrame —
  //    煙試験で判明した交絡: E5′ の ω_i は**コア差動項を含む**(ω=s+(Mc/m)(Ω_c−s)f(Rc,d))ので、
  //    Ω_c は kFrame=0 でも圧力として外殻を押す。kRep=0 にして初めて Ω_c は「引きずり専用」になる。
  for (const kF of [1, 0]) for (const om of [0, 0.5, 1, 2]) CFG.push({ tag: `krep0_om${om}_kF${kF}`, kFrame: kF, omMul: om, kRep: 0 });
  // ⑦【決定対照】kRep=0 × q 用量 × kFrame — q も E5′ の核 (R/(R+d))^q を兼ねるため同じ交絡を持つ
  for (const kF of [1, 0]) for (const q of [1, 3, 4]) CFG.push({ tag: `krep0_q${q}_kF${kF}`, kFrame: kF, q, kRep: 0 });
  for (const kF of [1, 0]) CFG.push({ tag: `krep0_q2_kF${kF}`, kFrame: kF, kRep: 0 });
  log(`\n===== A) ⚫bhCore: ${CFG.length} 構成 × ${STEPS}步 =====`);
  for (const c of CFG) {
    const t0 = Date.now();
    const r = await measureBH({ kFrame: c.kFrame, q: c.q, omMul: c.omMul, kcs: c.kcs, spin: c.spin, kRep: c.kRep, steps: STEPS });
    r.tag = c.tag; r.elapsedSec = (Date.now() - t0) / 1000;
    runs[c.tag] = r;
    const f = r.final;
    log(`[⚫ ${c.tag.padEnd(14)}] gas esc=${fmt(f.gas.escFrac, 3)} fall=${fmt(f.gas.fallFrac, 3)} σ/r=${fmt(f.gas.sdOverMean, 4)} Δr=${fmt(f.gas.meanRelDr, 3)}±${fmt(f.gas.sdRelDr, 3)} | star esc=${fmt(f.star.escFrac, 3)} σ/r=${fmt(f.star.sdOverMean, 4)} Δr=${fmt(f.star.meanRelDr, 3)}±${fmt(f.star.sdRelDr, 3)} | |v−u|gas=${fmt(f.gas.meanVminusU, 3)} vθ=${fmt(r.outerVt, 4)} coreΩ ${fmt(r.coreOm0, 2)}→${fmt(r.coreOm1, 2)} s→${fmt(r.shellSpin1, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  }
  // 影響範囲プローブ(Ω_c 用量 × q 用量)
  const profs = {};
  for (const om of [0, 0.5, 1, 2]) profs[`om${om}`] = await profileOf('bhCore', { omMul: om });
  for (const q of [1, 3, 4]) profs[`q${q}`] = await profileOf('bhCore', { q });
  profs['s0'] = await profileOf('bhCore', { spin: 0 });
  log('\n[⚫ 影響範囲プローブ(Ω_frame(r)/Ω_kepler(r) — 実測 u / 解析 ω)]');
  for (const [k, pr] of Object.entries(profs)) {
    const pick = pr.prof.filter(e => [30, 60, 100, 160, 220, 260].includes(e.rBin));
    log(`  ${k.padEnd(6)} Rc=${fmt(pr.params.Rc, 2)} Ω_c=${fmt(pr.params.coreOmega, 2)} q=${pr.params.q} → ` +
      pick.map(e => `r=${e.rBin}:Ωf/Ωk=${fmt(e.measuredOverKepler, 4)}(解析${fmt(e.dragOverKepler, 4)})`).join(' '));
  }
  out.samples.bhCore = { steps: STEPS, runs, profiles: profs };
}

// ---- B) 🎯saturnLayered ----
if (doSec('sat')) {
  const STEPS = SC(9375);   // t=150(QA behavior.saturnLayered の第1窓と同一)
  const runs = {};
  const CFG = [];
  for (const kF of [1, 0]) for (const om of [0, 0.5, 1, 2, 100]) CFG.push({ tag: `om${om}_kF${kF}`, kFrame: kF, omMul: om });
  for (const kF of [1, 0]) for (const q of [1, 3, 4]) CFG.push({ tag: `q${q}_kF${kF}`, kFrame: kF, q });
  // 決定対照(⚫と同じ理由): kRep=0 で E5′ 経路を閉じ、Ω_c・q を引きずり専用の変数にする
  for (const kF of [1, 0]) for (const om of [0, 1, 100]) CFG.push({ tag: `krep0_om${om}_kF${kF}`, kFrame: kF, omMul: om, kRep: 0 });
  for (const kF of [1, 0]) for (const q of [1, 3, 4]) CFG.push({ tag: `krep0_q${q}_kF${kF}`, kFrame: kF, q, kRep: 0 });
  log(`\n===== B) 🎯saturnLayered: ${CFG.length} 構成 × ${STEPS}步(t=150) =====`);
  for (const c of CFG) {
    const t0 = Date.now();
    const r = await measureSat({ kFrame: c.kFrame, q: c.q, omMul: c.omMul, kRep: c.kRep, steps: STEPS });
    r.tag = c.tag; r.elapsedSec = (Date.now() - t0) / 1000;
    runs[c.tag] = r;
    const f = r.final;
    log(`[🎯 ${c.tag.padEnd(12)}] inB=${fmt(f.all.inBFrac, 4)} fall=${fmt(f.all.fallFrac, 4)} esc=${fmt(f.all.escFrac, 4)} σ/r=${fmt(f.all.sdOverMean, 4)} eccRMS=${fmt(f.all.eccRMS, 4)} med C/B/A=${fmt(f.medC, 1)}/${fmt(f.medB, 1)}/${fmt(f.medA, 1)} |v−u|=${fmt(f.all.meanVminusU, 4)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  }
  const profs = {};
  for (const om of [0, 1, 2, 100]) profs[`om${om}`] = await profileOf('saturnLayered', { omMul: om });
  for (const q of [1, 3, 4]) profs[`q${q}`] = await profileOf('saturnLayered', { q });
  log('\n[🎯 影響範囲プローブ]');
  for (const [k, pr] of Object.entries(profs)) {
    const pick = pr.prof.filter(e => [110, 150, 190, 210].includes(e.rBin));
    log(`  ${k.padEnd(6)} Rc=${fmt(pr.params.Rc, 2)} Ω_c=${fmt(pr.params.coreOmega, 4)} q=${pr.params.q} → ` +
      pick.map(e => `r=${e.rBin}:Ωf/Ωk=${fmt(e.measuredOverKepler, 4)}(解析${fmt(e.dragOverKepler, 4)}・コア項比${fmt(e.omCoreAnalytic / (e.omBaseAnalytic || 1e-30), 4)})`).join(' '));
  }
  out.samples.saturnLayered = { steps: STEPS, runs, profiles: profs };
}

// ---- C) 🥚selfRotor(陰性対照) ----
if (doSec('self')) {
  const STEPS = SC(9000);   // validT=144
  const runs = {};
  const CFG = [];
  for (const kF of [1, 0]) for (const om of [0, 1, 2]) CFG.push({ tag: `om${om}_kF${kF}`, kFrame: kF, omMul: om });
  log(`\n===== C) 🥚selfRotor: ${CFG.length} 構成 × ${STEPS}步 =====`);
  for (const c of CFG) {
    const t0 = Date.now();
    const r = await measureSelf({ kFrame: c.kFrame, omMul: c.omMul, steps: STEPS });
    r.tag = c.tag; r.elapsedSec = (Date.now() - t0) / 1000;
    runs[c.tag] = r;
    log(`[🥚 ${c.tag.padEnd(10)}] n=${r.n} merge=${r.mergers} massFrac=${fmt(r.maxMassFrac, 4)} bound=${fmt(r.shell.boundFrac, 3)} σ/r=${fmt(r.shell.sdOverMean, 4)} meanR=${fmt(r.shell.meanR, 2)} coreΩ=${fmt(r.coreOm, 3)} Rc=${fmt(r.coreRc, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  }
  out.samples.selfRotor = { steps: STEPS, runs };
}

// ---- D) 🌱starSeed(参考) ----
if (doSec('seed')) {
  const STEPS = SC(6000);
  const runs = {};
  const CFG = [];
  for (const kF of [1, 0]) for (const om of [0, 1]) CFG.push({ tag: `om${om}_kF${kF}`, kFrame: kF, omMul: om });
  log(`\n===== D) 🌱starSeed(参考・粒子外殻なし): ${CFG.length} 構成 × ${STEPS}步 =====`);
  for (const c of CFG) {
    const r = await measureSeed({ kFrame: c.kFrame, omMul: c.omMul, steps: STEPS });
    r.tag = c.tag; runs[c.tag] = r;
    log(`[🌱 ${c.tag.padEnd(10)}] rA ${fmt(r.rAmin, 1)}〜${fmt(r.rAmax, 1)}(振幅${fmt(r.rAamp, 3)}) coreΩA=${fmt(r.coreOmA, 2)} spinA=${fmt(r.spinA, 3)} spinB=${fmt(r.spinB, 3)} NaN=${r.nan}`);
  }
  out.samples.starSeed = { steps: STEPS, runs };
}

// ---- E) 🐚nebulaShell(仮説に最も近い既存サンプル) ----
if (doSec('neb')) {
  const STEPS = SC(3000);   // validT=48
  const runs = {};
  const CFG = [];
  for (const kF of [1, 0]) for (const om of [0, 0.5, 1, 2]) CFG.push({ tag: `om${om}_kF${kF}`, kFrame: kF, omMul: om });
  for (const kF of [1, 0]) for (const q of [1, 3, 4]) CFG.push({ tag: `q${q}_kF${kF}`, kFrame: kF, q });
  // kRep=0(E5′ を閉じる)× Ω_c 用量 × kFrame — 保持が引きずり経由か斥力経由かの決定対照
  for (const kF of [1, 0]) for (const om of [0, 1, 2]) CFG.push({ tag: `krep0_om${om}_kF${kF}`, kFrame: kF, omMul: om, kRep: 0 });
  log(`\n===== E) 🐚nebulaShell: ${CFG.length} 構成 × ${STEPS}步 =====`);
  for (const c of CFG) {
    const t0 = Date.now();
    const r = await measureNeb({ kFrame: c.kFrame, q: c.q, omMul: c.omMul, kRep: c.kRep, steps: STEPS });
    r.tag = c.tag; r.elapsedSec = (Date.now() - t0) / 1000; runs[c.tag] = r;
    log(`[🐚 ${c.tag.padEnd(14)}] env keep=${fmt(r.envelope.keepFrac, 3)} bound=${fmt(r.envelope.boundFrac, 3)} σ/r=${fmt(r.envelope.sdOverMean, 4)} Δr=${fmt(r.envelope.meanRelDr, 3)}±${fmt(r.envelope.sdRelDr, 3)} meanR=${fmt(r.envelope.meanR, 1)} | clump keep=${fmt(r.clump.keepFrac, 3)} σ/r=${fmt(r.clump.sdOverMean, 4)} | lSw=${fmt(r.lswClumpMean, 3)} |v−u|env=${fmt(r.envelope.meanVminusU, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  }
  const profs = {};
  for (const om of [0, 1, 2]) profs[`om${om}`] = await profileOf('nebulaShell', { omMul: om });
  for (const q of [1, 3, 4]) profs[`q${q}`] = await profileOf('nebulaShell', { q });
  out.samples.nebulaShell = { steps: STEPS, runs, profiles: profs };
}

out.meta.elapsedSec = (Date.now() - T_START) / 1000;

// ---- 第145便: 実験マニフェスト(生成来歴・数値環境・分類・判定ポインタ・健全性)-------------
// 測定ロジック・数値は一切変更していない。結果へ `manifest` キーを1本足すだけの additive 変更。
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell', wave: 135,
    title: 'コアの引きずりの影響範囲が外殻を安定させているか(用量反応+交差対照)',
    command: 'node tests/exp-coreshell.mjs(節選択 CS_ONLY=… / 追記合流 CS_MERGE=1 / 煙試験 CS_QUICK=1)' },
  presets: { mode: 'builtin', ids: ['bhCore', 'saturnLayered', 'selfRotor', 'starSeed', 'nebulaShell'],
    modifiedAtRuntime: 'kFrame / core.omega 倍率 Ω_c / 影響範囲指数 q / K_cs / 殻スピン s / kRep を' +
      'サンプル改変器で上書きして build する(改変内容は各 run.cfg に記録済み)',
    note: 'seed は各プリセット定義値をそのまま使う(改変器は seed を触らない)' },
  numerics: {
    seed: { bhCore: 20260805, starSeed: 20260805, selfRotor: 20260806,
      saturnLayered: 'プリセット既定値', nebulaShell: 'プリセット既定値',
      note: 'build がプリセット定義の seed を使うため構成間で同一' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { bhCore: SC(6000), saturnLayered: SC(9375), selfRotor: SC(9000),
      starSeed: SC(6000), nebulaShell: SC(3000), quick: QUICK },
    window: { bhCore: 't=96(validT・exp-4-81 と同一窓)', saturnLayered: 't=150(QA behavior.saturnLayered 第1窓)',
      selfRotor: 't=144(validT)', starSeed: 't=96(validT)', nebulaShell: 't=48(validT)' },
    warmup: NOT_APPLICABLE,
    configCount: '⚫38 / 🎯28 / 🥚6 / 🌱4 / 🐚20 = 96 構成(節選択時はその部分集合)',
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセットの初期配置・質量・seed(既存の展示構成 — 本便で再フィットしない)',
      'dt=0.016(エンジン既定の刻み)', '各サンプルの窓(validT / QA 窓)'],
    fit: [],
    derived: ['外殻の逃散率・落下率・σ_r/⟨r⟩・相対半径変化(samples.*.runs.*.final)',
      'Ω_frame(r) / Ω_kepler(r) の初期配置1步プローブ(samples.*.profiles)'],
    holdOut: [],
    note: '本便は**当てはめを持たない**用量反応+交差対照の実測である(fit は空 = 新しい自由度を' +
      '一つも導入していない)。Ω_c・q・kFrame・K_cs・s・kRep は既存の物理キーを用量として振った' +
      '入力であり、当てはめた較正値ではない',
  },
  judgement: {
    pointers: ['samples.bhCore.runs', 'samples.saturnLayered.runs', 'samples.selfRotor.runs',
      'samples.starSeed.runs', 'samples.nebulaShell.runs',
      'samples.bhCore.profiles', 'samples.saturnLayered.profiles', 'samples.nebulaShell.profiles'],
    note: '判定(安定 = 逃散率+落下率が対照比で増えない かつ σ_r/⟨r⟩ が対照比で増えない)は' +
      '上記 runs の対照間比較で行う。許容窓は固定閾値ではなく「対照比」なので、比較対象の' +
      '対照アームも同じ runs に入っている(kF0 / Ω_c=0 / kRep=0 / K_cs=0 / s=0)',
    externalReferences: NOT_APPLICABLE,
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは |ΔL|/L_scale 等の保存量残差を記録していない(測っているのは外殻の' +
        '逃散/落下/分散であり、保存則の主張はしていない)' },
  },
  regenerationNote: 'meta.date / meta.elapsedSec / meta.mergedFrom は非測定メタなので照合対象外',
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'meta.mergedFrom'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\nsaved: tests/out/coreshell-results.json (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();

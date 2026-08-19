// 第139便 exp-coreshell2.mjs — コア外殻フォロー実験(第135便 exp-coreshell.mjs の3つのフォロー実測)
// ============================================================================================
// 第135便で同定した読み(tests/exp-coreshell.mjs / tests/out/coreshell-results.json):
//   「コア+外殻の安定条件は **外殻位置で Ω_drag ≪ Ω_kepler**」。
//   引きずりの角速度は遠方で ω_drag(d) ∝ (R/(R+d))^q → r^{-q}、円軌道角速度は Ω_kepler ∝ r^{-3/2} なので
//   Ω_drag/Ω_kepler ∝ r^{3/2−q} — **臨界指数 q=3/2**。q<3/2 では外へ行くほど引きずりが優勢になり
//   外殻は保持できず、q>3/2 では外へ行くほど引きずりが引っ込んで外殻が残る、という予想になる。
//   第135便の実測は q∈{1,2,3,4} の粗い刻みで「q=1 は全損・q≥2 は安定」までしか言えていない。
//
// 本便(第139便)の3つのフォロー(**事前登録窓は統括が実測前に固定・実測後に動かさない**):
//   CW1: q 連続掃引 1.2〜2.0(刻み 0.1)を ⚫bhCore と 🐚nebulaShell で行い、生存遷移(全損→安定)の
//        挟み区間が臨界 3/2 を含むか。安定判定は第135便と同じく **外殻損失率 < 20%**。
//   CW2: ⚫bhCore の総損失(落下+逃散)を最小化する Ω_c* が**内点**に在るか(存在検証のみ事前登録。
//        在れば値を記録)。掃引範囲は第135便の用量域 Ω_c/Ω_c0 ∈ {0,0.5,1,2} を包含する [0,2]、
//        刻み 0.25、両端 0 と 2 を明示。
//   CW3: 🐚nebulaShell の Rc 用量(5値)で、外殻位置の ω 振幅比が理論 (Rc/R)^q と ±20% で一致するか
//        (第135便の「単層 vs 2層」の読み — 暗さを小コアへ隠すと外殻に届く ω が (Rc/R)^q に抑制される
//         — の確証)。
//   対照: 第135便で交絡除去に使った **kF0 × kRep=0 の bit 一致対照** を新構成でも再実施する。
//        (E5′ スピン斥力 F=kRep·μ·(ω_i²+ω_j²)·(r_i−r_j) の ω_i は A8 と同じ合成値=コア差動項を含むので、
//         kRep=0 にして初めて Ω_c・q は「引きずり専用」の変数になる — 第135便の煙試験で判明した交絡)
//
// 手法はすべて第135便の踏襲(測定量・帯定義・逃散/落下しきい値・窓・seed・kRep=0 単離・プローブ):
//   ⚫bhCore  : seed 20260805・6000步(validT=96・exp-4-81 と同一窓)・
//               外殻 = ①降着円盤ガス 120体(esc r>200 / fall r<30)②恒星ディスク 200体(esc r>450 / fall r<30)
//   🐚nebulaShell: seed 20260804・3000步(validT=48)・
//               外殻 = 低スピン放射エンベロープ 44体(index 54..97)・保持 = r<300(第75便の保持率と同義)
//   dt=0.016(全構成共通・エンジン既定の刻み。timeScale は各プリセット既定)
//   数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// トイ単位の限界(第135便の宣言を踏襲・全構成に適用):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q・Ω_c・Rc の
//   数値も同じトイ単位系の中でのみ意味を持つ。したがって「臨界 q=3/2」は**無次元の指数**としてのみ
//   主張でき、Ω_c* や Rc の絶対値は当該サンプルの単位系に閉じた値である。窓(步数)は各サンプルの
//   validT に一致させた有限窓で、窓外の長時間挙動は測っていない。粒子数は 320(⚫)/98(🐚)の
//   小標本で、逃散率・保持率の分解能はそれぞれ 1/320・1/44 に制限される。
//
// 実行:
//   node tests/exp-coreshell2.mjs                        … 全節(既定)
//   CS2_ONLY=bh1,bh2,bh3,cw2,ctl,neb node tests/...      … 節を選択実行
//   CS2_MERGE=1 CS2_ONLY=neb node tests/...              … 既存 JSON へ節を追記合流(長い節を再走しない)
//   CS2_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS2_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用・本番数値ではない)
// 出力: tests/out/coreshell2-results.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.CS2_OUT ? path.resolve(process.env.CS2_OUT)
  : path.join(OUT_DIR, 'coreshell2-results.json');
const REF135 = path.join(OUT_DIR, 'coreshell-results.json');   // 第135便の実測正本(在れば共有点を照合)

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS2_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS2_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(統括が実測前に固定 — 実測後に動かさない) =================
const PRE_REGISTERED = {
  fixedBy: '統括(第139便)', fixedBefore: '実測',
  CW1: {
    question: 'q 連続掃引 1.2〜2.0(刻み 0.1)で、外殻の生存遷移(全損→安定)を挟む区間が臨界 q=3/2 を含むか',
    samples: ['bhCore(⚫)', 'nebulaShell(🐚)'],
    sweep: 'q = 1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2.0(事前登録)+ q=1.0 は第135便の全損アンカー(参照点・事前登録外)',
    stabilityRule: '第135便と同一 — 外殻損失率 < 0.20 を「安定」、≥ 0.20 を「不安定」とする',
    lossDefinition: {
      bhCore: '外殻損失率 = (ガス帯 120体の 逃散+落下 + 恒星帯 200体の 逃散+落下) / 320(第135便の帯定義・しきい値をそのまま使用)',
      nebulaShell: '外殻損失率 = 1 − エンベロープ 44体の保持率(保持 = 中心クランプ重心から r<300。第135便と同一)'
    },
    verdictRule: 'PASS = 「最大の不安定 q」と「最小の安定 q」で挟まれる区間 [q_lo, q_hi] が 1.5 を含む(閉区間)。含まなければ FAIL。PASS/FAIL とも記録する',
    contains: 1.5
  },
  CW2: {
    question: '⚫bhCore の総損失(落下+逃散)を最小化する Ω_c* が掃引範囲の内点に存在するか(存在検証のみを事前登録。存在すれば値を記録する)',
    sweep: 'Ω_c/Ω_c0 = 0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0(Ω_c0 = プリセット実値 20)。両端 = 0 と 2.0',
    rangeRationale: '第135便の用量域 Ω_c/Ω_c0 ∈ {0, 0.5, 1, 2} を包含する [0, 2] を刻み 0.25 で埋めた',
    metric: '総損失率 = (ガス帯の 逃散+落下 + 恒星帯の 逃散+落下)/320(CW1 と同一の定義)',
    verdictRule: 'PASS = 主系列(kFrame=1・kRep=実値1)の総損失率の最小値が両端(0 と 2.0)以外の点で得られる(=内点極小)。両端で最小なら FAIL。PASS/FAIL とも記録する'
  },
  CW3: {
    question: '🐚nebulaShell の Rc 用量で、外殻(エンベロープ)位置に届く ω の振幅比が理論 (Rc/R)^q と ±20% で一致するか',
    sweep: 'Rc = 0.25, 0.5, 1, 2, 4 × Rc0(Rc0 = プリセット実値 1.1502173707608487)= 5 値',
    reference: 'R̄ = クランプ 54体の粒子半径 R の平均(= 単層相当の基準半径)。振幅比は Rc=R̄ の構成を分母に取る',
    measurement: 'コア差動項の単離: 同一 seed・同一 Rc で Ω_c を ×1 と ×2 の2構成を1步だけ回し、エンベロープ各粒子の決定フレーム u の差 Δu を取る(u は ω について線形なので Δu はコア差動項ちょうど ΔΩ_c=Ω_c0 分になる)。振幅 = Δu の接線成分から作る ΔΩ_frame のエンベロープ平均',
    theory: '(Rc/R̄)^q(遠方漸近形 — 判定はこれで行う)。参考として厳密形(u の式にコア差動 ω 項だけを入れた解析予測の比)も併記する',
    verdictRule: 'PASS = 5 値すべてで |実測振幅比 / (Rc/R̄)^q − 1| ≤ 0.20。1点でも外れれば FAIL。PASS/FAIL とも記録する',
    tolerance: 0.20
  },
  CONTROL: {
    question: '新構成でも kFrame=0 × kRep=0 の bit 一致対照が成立するか(交絡除去の踏襲)',
    rule: 'kFrame=0(引きずり経路を閉じる)かつ kRep=0(E5′ スピン斥力経路を閉じる)なら、q や Ω_c を振っても外殻の力学は 1 bit も変わらないはず。⚫ と 🐚 の双方で実施する',
    comparedFields: '力学フィールド(series / final / outerVt / n / nan / clamp*)の JSON 完全一致。コア状態(coreOm0/coreOm1/shellSpin1 等)は Ω_c を振れば当然変わるので比較対象から外し、q 対については全フィールド一致も併記する'
  }
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に依らないが、Ω_c* と Rc の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  windows: {
    bhCore: { steps: 6000, validT: 96, note: '第135便・exp-4-81 と同一窓。窓外の長時間挙動は測っていない' },
    nebulaShell: { steps: 3000, validT: 48, note: '第135便と同一窓。窓外の長時間挙動は測っていない' }
  },
  seeds: {
    bhCore: 20260805, nebulaShell: 20260804,
    note: 'seed はプリセット定義値。build がそれを使うので構成間で同一 — 構成差はすべてノブ差である'
  },
  sampleSize: {
    bhCore: 'ガス 120体 + 恒星 200体 = 320(損失率の分解能 1/320 ≈ 0.0031)',
    nebulaShell: 'エンベロープ 44体(保持率の分解能 1/44 ≈ 0.0227)+ クランプ 54体'
  },
  probe: '影響範囲プローブ・Rc 応答プローブは 1 步(dt=0.016)のみ回した初期配置の測定であり、長時間の力学ではない。u は step 末尾で確定するのでこの1步が必要',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である'
};

// ============================ 測定器(第135便 exp-coreshell.mjs から踏襲) ====================
// A) ⚫bhCore — 第135便 measureBH と同一(帯定義・しきい値・スナップ数 NS=4・返却フィールドすべて同一)
const measureBH = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
  const OM0 = p.bodies[0].core.omega, S0 = p.bodies[0].spin, Q0 = p.physics.q, KCS0 = p.bodies[0].core.Kcs;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) p.bodies[0].core.omega = OM0 * o.omMul;
  if (o.kcs !== undefined) p.bodies[0].core.Kcs = o.kcs;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  HP.sim.build(p);
  const S = HP.sim;
  const GAS_LO = 1, GAS_HI = 121, STA_LO = 121, STA_HI = S.n;
  const r0 = new Float64Array(S.n);
  const rel = (i) => Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]);
  for (let i = 0; i < S.n; i++) r0[i] = rel(i);
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

// B) 🐚nebulaShell — 第135便 measureNeb と同一(+ Rc を振れる rcAbs を追加。既定は実値のまま)
const measureNeb = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'nebulaShell')));
  const OM0 = p.bodies[0].core.omega, RC0 = p.bodies[0].core.radius;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = OM0 * o.omMul;
  if (o.rcAbs !== undefined) for (const b of p.bodies) if (b.core) b.core.radius = o.rcAbs;
  HP.sim.build(p);
  const S = HP.sim;
  const NC = p.bodies[0].n + p.bodies[1].n + p.bodies[2].n;
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
      if (r < 300) keep++;
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
      coreOmega: p.bodies[0].core.omega, coreOmegaRef: OM0,
      coreRc: p.bodies[0].core.radius, coreRcRef: RC0, steps: o.steps, nClump: NC },
    clump: band(0, NC), envelope: band(NC, S.n), lswClumpMean: lsw / NC,
    n: S.n, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN };
}, mod);

// C) 影響範囲プローブ(⚫用) — 第135便 profileOf と同一
const profileOf = (id, mod) => page.evaluate(({ id, o }) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === id)));
  p.physics.kFrame = 1;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = b.core.omega * o.omMul;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  HP.sim.build(p);
  const S = HP.sim;
  S.step(0.016);
  const q = S.params.q, G = S.params.G, eps = S.params.softening, D0 = S.params.D0;
  const m0 = S.m[0], R0 = S.R[0], s0 = S.spin[0];
  const Rc = S.RcV[0], mf = S.coreMF[0], Omc = S.coreOmV[0];
  const bins = new Map();
  for (let i = 1; i < S.n; i++) {
    const x = S.x[i] - S.x[0], y = S.y[i] - S.y[0], r = Math.hypot(x, y);
    if (!(r > 1e-6) || !S.hasU[i]) continue;
    const ux = S.uPx[i] - S.vx[0], uy = S.uPy[i] - S.vy[0];
    const omF = (x * uy - y * ux) / (r * r);
    const k = Math.round(r / 10) * 10;
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
      wFrac0: w0 / (D0 + w0),
      omKepler: omKep,
      dragOverKepler: (omBase + omCore) / omKep,
      measuredOverKepler: (b.om / b.n) / omKep };
  });
  let rCross = null;
  for (const e of prof) { if (Math.abs(e.omCoreAnalytic) < Math.abs(e.omBaseAnalytic)) { rCross = e.r; break; } }
  return { params: { q, G, D0, softening: eps, m0, R0, s0, Rc, coreMassFrac: mf, coreOmega: Omc },
    prof, rCoreDominanceEnds: rCross };
}, { id, o: mod });

// D) 🐚 引きずりプローブ(第139便 新規 — 🐚 はコア持ち body が 54 個あり、profileOf の
//    「body 0 中心」では外殻位置の Ω_drag を測れないので、クランプ重心を中心にして
//    ①実測 Ω_frame(u から)②解析 Ω_drag(u の式に ω 項だけを入れた値)③Ω_kepler(クランプ質量)
//    をエンベロープ位置で出す。u の重み w=m/√(d²+ε²)・分母 D₀+Σw はエンジンと同式)
const nebDragProbe = (qOverride) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(z => z.id === 'nebulaShell')));
  p.physics.kFrame = 1;
  if (o.q !== undefined && o.q !== null) p.physics.q = o.q;
  HP.sim.build(p);
  const S = HP.sim;
  S.step(0.016);
  const NC = p.bodies[0].n + p.bodies[1].n + p.bodies[2].n;
  const q = S.params.q, G = S.params.G, eps = S.params.softening, D0 = S.params.D0;
  let M = 0, cx = 0, cy = 0, cvx = 0, cvy = 0;
  for (let i = 0; i < NC; i++) { const mi = S.m[i]; M += mi; cx += mi * S.x[i]; cy += mi * S.y[i];
    cvx += mi * S.vx[i]; cvy += mi * S.vy[i]; }
  cx /= M; cy /= M; cvx /= M; cvy /= M;
  let Rbar = 0; for (let i = 0; i < NC; i++) Rbar += S.R[i]; Rbar /= NC;
  const rows = [];
  for (let i = NC; i < S.n; i++) {
    const rx = S.x[i] - cx, ry = S.y[i] - cy, r2 = rx * rx + ry * ry, r = Math.sqrt(r2);
    if (!(r > 1e-6) || !S.hasU[i]) continue;
    const ux = S.uPx[i] - cvx, uy = S.uPy[i] - cvy;
    const omMeas = (rx * uy - ry * ux) / r2;
    let nx = 0, ny = 0, W = 0;
    for (let j = 0; j < S.n; j++) {
      if (j === i) continue;
      const dx = S.x[i] - S.x[j], dy = S.y[i] - S.y[j], d = Math.hypot(dx, dy);
      const w = S.m[j] / Math.sqrt(d * d + eps * eps);
      W += w;
      const sj = S.spin[j];
      let om = sj !== 0 ? sj * Math.pow(S.R[j] / (S.R[j] + d), q) : 0;
      if (S.coreMd[j] >= 2 && S.RcV[j] > 0) {
        const dOm = S.coreOmV[j] - sj;
        if (dOm !== 0) om += S.coreMF[j] * dOm * Math.pow(S.RcV[j] / (S.RcV[j] + d), q);
      }
      nx += w * om * (-dy); ny += w * om * (dx);
    }
    const den = D0 + W;
    const omDrag = (rx * (ny / den) - ry * (nx / den)) / r2;
    const omKep = Math.sqrt(G * M / Math.pow(r2 + eps * eps, 1.5));
    rows.push({ r, omFrameMeasured: omMeas, omDragAnalytic: omDrag, omKepler: omKep,
      dragOverKepler: omDrag / omKep, measuredOverKepler: omMeas / omKep });
  }
  const mean = (f) => rows.reduce((a, e) => a + f(e), 0) / rows.length;
  const sorted = rows.map(e => e.dragOverKepler).sort((a, b) => a - b);
  return { q, G, D0, softening: eps, clumpMass: M, nEnv: rows.length, RbarClump: Rbar,
    envMeanR: mean(e => e.r),
    meanDragOverKepler: mean(e => e.dragOverKepler),
    meanMeasuredOverKepler: mean(e => e.measuredOverKepler),
    medianDragOverKepler: sorted[Math.floor(sorted.length / 2)],
    rows };
}, { q: qOverride === undefined ? null : qOverride });

// E) 🐚 コア差動応答プローブ(第139便 新規 — CW3)
//    同一 seed・同一 Rc で Ω_c を ×1 と ×2 の2構成を1步だけ回し、エンベロープ各粒子の u の差を取る。
//    u=Σ w_j c_j/(D₀+Σ w_j) は ω について線形で、c_j の ω_j に入るコア差動は (Mc/m)(Ω_c−s)f(Rc,d) なので、
//    Ω_c→2Ω_c の差はちょうど (Mc/m)·Ω_c·f(Rc,d) 分 — 基底スピン項 s·(R/(R+d))^q は完全に相殺される。
const nebCoreResponse = (rcAbs, qOverride) => page.evaluate((o) => {
  const build = (omMul) => {
    const p = JSON.parse(JSON.stringify(HP.allPresets().find(z => z.id === 'nebulaShell')));
    p.physics.kFrame = 1;
    if (o.q !== undefined && o.q !== null) p.physics.q = o.q;
    for (const b of p.bodies) if (b.core) {
      if (o.rcAbs !== undefined && o.rcAbs !== null) b.core.radius = o.rcAbs;
      b.core.omega = b.core.omega * omMul;
    }
    HP.sim.build(p);
    const S = HP.sim;
    S.step(0.016);
    const NC = p.bodies[0].n + p.bodies[1].n + p.bodies[2].n;
    const s = { NC, n: S.n, q: S.params.q, D0: S.params.D0, eps: S.params.softening, G: S.params.G,
      x: [], y: [], ux: [], uy: [], hasU: [], m: [], R: [], Rc: [], mf: [], om: [], spin: [], sumW: [] };
    for (let i = 0; i < S.n; i++) {
      s.x.push(S.x[i]); s.y.push(S.y[i]);
      s.ux.push(S.uPx[i]); s.uy.push(S.uPy[i]); s.hasU.push(S.hasU[i] ? 1 : 0);
      s.m.push(S.m[i]); s.R.push(S.R[i]); s.Rc.push(S.RcV[i]); s.mf.push(S.coreMF[i]);
      s.om.push(S.coreOmV[i]); s.spin.push(S.spin[i]); s.sumW.push(S.sumW[i]);
    }
    return s;
  };
  const A = build(1), B = build(2);
  const NC = A.NC, eps = A.eps, D0 = A.D0, q = A.q;
  let M = 0, cx = 0, cy = 0;
  for (let i = 0; i < NC; i++) { M += A.m[i]; cx += A.m[i] * A.x[i]; cy += A.m[i] * A.y[i]; }
  cx /= M; cy /= M;
  let Rbar = 0; for (let i = 0; i < NC; i++) Rbar += A.R[i]; Rbar /= NC;
  let sM = 0, sA = 0, sUM = 0, sUA = 0, sGeo = 0, sD = 0, nE = 0;
  for (let i = NC; i < A.n; i++) {
    if (!A.hasU[i] || !B.hasU[i]) continue;
    const dux = B.ux[i] - A.ux[i], duy = B.uy[i] - A.uy[i];
    const rx = A.x[i] - cx, ry = A.y[i] - cy, r2 = rx * rx + ry * ry;
    if (!(r2 > 1e-12)) continue;
    sM += (rx * duy - ry * dux) / r2;
    sUM += Math.hypot(dux, duy);
    let nx = 0, ny = 0, gsum = 0, gw = 0, dsum = 0;
    for (let j = 0; j < A.n; j++) {
      if (j === i || !(A.Rc[j] > 0)) continue;
      const dx = A.x[i] - A.x[j], dy = A.y[i] - A.y[j], d = Math.hypot(dx, dy);
      const w = A.m[j] / Math.sqrt(d * d + eps * eps);
      const g = Math.pow(A.Rc[j] / (A.Rc[j] + d), q);
      const f = A.mf[j] * A.om[j] * g;
      nx += w * f * (-dy); ny += w * f * (dx);
      gsum += w * g; gw += w; dsum += w * d;
    }
    const den = D0 + A.sumW[i];
    const ax = nx / den, ay = ny / den;
    sA += (rx * ay - ry * ax) / r2;
    sUA += Math.hypot(ax, ay);
    sGeo += gsum / Math.max(gw, 1e-300);   // 重み付き幾何核 ⟨(Rc/(Rc+d))^q⟩
    sD += dsum / Math.max(gw, 1e-300);     // 重み付き平均距離 ⟨d⟩
    nE++;
  }
  return { rcUsed: A.Rc[0], RbarClump: Rbar, q, D0, softening: eps, nEnv: nE,
    dOmegaMeasured: sM / nE, dOmegaAnalytic: sA / nE,
    dUMeasured: sUM / nE, dUAnalytic: sUA / nE,
    geomKernelMean: sGeo / nE, dWeightedMean: sD / nE,
    coreMassFrac: A.mf[0], coreOmega: A.om[0], clumpMass: M };
}, { rcAbs: rcAbs === undefined ? null : rcAbs, q: qOverride === undefined ? null : qOverride });

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

const out = { meta: { exp: 'coreshell2', wave: 139, target: TARGET, date: new Date().toISOString(),
    dt: 0.016, basedOn: '第135便 tests/exp-coreshell.mjs(測定量・帯定義・窓・seed・kRep=0 単離を踏襲)',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS, raw: {} };
// 節ごとの分割実行(CS2_MERGE)を重ねても meta が入れ子で膨らまないよう、実行履歴は平坦な配列で持つ
out.meta.sectionRuns = [];
if (process.env.CS2_MERGE && fs.existsSync(OUT_PATH)) {
  const prev = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  out.raw = prev.raw || {};
  out.meta.sectionRuns = (prev.meta && prev.meta.sectionRuns) ? prev.meta.sectionRuns.slice() : [];
}

// 事前登録した掃引点
const Q_PRE = [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
const Q_ANCHOR = 1.0;                         // 第135便の全損アンカー(参照点)
const QS = [Q_ANCHOR, ...Q_PRE];
const OMS = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
const OMS_SUB = [0, 0.5, 1.0, 1.5, 2.0];      // kRep=0 副系列(引きずり専用の Ω_c 用量)
const RC_MULS = [0.25, 0.5, 1, 2, 4];
const RC0 = 1.1502173707608487;               // 🐚 プリセット実値(core.radius)
const BH_STEPS = SC(6000), NEB_STEPS = SC(3000);
const tagQ = (q) => 'q' + q.toFixed(2);
const tagOm = (m) => 'om' + m.toFixed(2);

const bhLoss = (f) => (f.gas.n * (f.gas.escFrac + f.gas.fallFrac) + f.star.n * (f.star.escFrac + f.star.fallFrac))
  / (f.gas.n + f.star.n);
const nebLoss = (r) => 1 - r.envelope.keepFrac;

const runBH = async (tag, mod, store) => {
  const t0 = Date.now();
  const r = await measureBH({ ...mod, steps: BH_STEPS });
  r.tag = tag; r.elapsedSec = (Date.now() - t0) / 1000;
  store[tag] = r;
  const f = r.final;
  log(`[⚫ ${tag.padEnd(12)}] loss=${fmt(bhLoss(f), 4)} (gas ${fmt(f.gas.escFrac + f.gas.fallFrac, 3)} / star ${fmt(f.star.escFrac + f.star.fallFrac, 3)}) σ/r gas=${fmt(f.gas.sdOverMean, 3)} star=${fmt(f.star.sdOverMean, 3)} vθ=${fmt(r.outerVt, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  return r;
};
const runNeb = async (tag, mod, store) => {
  const t0 = Date.now();
  const r = await measureNeb({ ...mod, steps: NEB_STEPS });
  r.tag = tag; r.elapsedSec = (Date.now() - t0) / 1000;
  store[tag] = r;
  log(`[🐚 ${tag.padEnd(12)}] loss=${fmt(nebLoss(r), 4)} keep=${fmt(r.envelope.keepFrac, 3)} bound=${fmt(r.envelope.boundFrac, 3)} σ/r=${fmt(r.envelope.sdOverMean, 3)} meanR=${fmt(r.envelope.meanR, 1)} | clump keep=${fmt(r.clump.keepFrac, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  return r;
};

// ---- 節 bh1: CW1 ⚫ 主系列(kFrame=1・kRep=実値1)----
if (doSec('bh1')) {
  const runs = {};
  log(`\n===== CW1 / ⚫bhCore 主系列(kFrame=1・kRep=1 実値): ${QS.length} 構成 × ${BH_STEPS}步 =====`);
  for (const q of QS) await runBH(tagQ(q), { kFrame: 1, q }, runs);
  const profiles = {};
  for (const q of QS) profiles[tagQ(q)] = await profileOf('bhCore', { q });
  log('[⚫ 影響範囲プローブ Ω_drag/Ω_kepler(解析)]');
  for (const [k, pr] of Object.entries(profiles)) {
    const pk = pr.prof.filter(e => [30, 60, 100, 160, 220, 260].includes(e.rBin));
    log(`  ${k} q=${pr.params.q} → ` + pk.map(e => `r=${e.rBin}:${fmt(e.dragOverKepler, 4)}`).join(' '));
  }
  out.raw.bh1 = { arm: { kFrame: 1, kRep: '実値(1)' }, steps: BH_STEPS, runs, profiles };
}

// ---- 節 bh2: CW1 ⚫ kRep=0 系列(E5′ を閉じ、q を引きずり専用の変数にする)----
if (doSec('bh2')) {
  const runs = {};
  log(`\n===== CW1 / ⚫bhCore kRep=0 系列(kFrame=1・kRep=0): ${QS.length} 構成 × ${BH_STEPS}步 =====`);
  for (const q of QS) await runBH(tagQ(q), { kFrame: 1, q, kRep: 0 }, runs);
  out.raw.bh2 = { arm: { kFrame: 1, kRep: 0 }, steps: BH_STEPS, runs };
}

// ---- 節 bh3: CW1 ⚫ kFrame=0 系列(引きずりを閉じ、E5′ だけ残す)----
if (doSec('bh3')) {
  const runs = {};
  log(`\n===== CW1 / ⚫bhCore kFrame=0 系列(kFrame=0・kRep=1 実値): ${QS.length} 構成 × ${BH_STEPS}步 =====`);
  for (const q of QS) await runBH(tagQ(q), { kFrame: 0, q }, runs);
  out.raw.bh3 = { arm: { kFrame: 0, kRep: '実値(1)' }, steps: BH_STEPS, runs };
}

// ---- 節 cw2: ⚫ Ω_c 用量掃引 ----
if (doSec('cw2')) {
  const main = {}, kf0 = {}, krep0 = {};
  log(`\n===== CW2 / ⚫bhCore Ω_c 掃引 主系列(kFrame=1・kRep=1 実値): ${OMS.length} 構成 × ${BH_STEPS}步 =====`);
  for (const m of OMS) await runBH(tagOm(m), { kFrame: 1, omMul: m }, main);
  log(`\n===== CW2 / ⚫bhCore Ω_c 掃引 kFrame=0 対照: ${OMS.length} 構成 =====`);
  for (const m of OMS) await runBH(tagOm(m), { kFrame: 0, omMul: m }, kf0);
  log(`\n===== CW2 / ⚫bhCore Ω_c 掃引 kRep=0 副系列(引きずり専用): ${OMS_SUB.length} 構成 =====`);
  for (const m of OMS_SUB) await runBH(tagOm(m), { kFrame: 1, omMul: m, kRep: 0 }, krep0);
  const profiles = {};
  for (const m of OMS) profiles[tagOm(m)] = await profileOf('bhCore', { omMul: m });
  out.raw.cw2 = { steps: BH_STEPS,
    arms: { main: { cfg: { kFrame: 1, kRep: '実値(1)' }, runs: main },
      kF0: { cfg: { kFrame: 0, kRep: '実値(1)' }, runs: kf0 },
      kRep0: { cfg: { kFrame: 1, kRep: 0 }, runs: krep0 } },
    profiles };
}

// ---- 節 neb: CW1(🐚)+ CW3 + 🐚 対照 ----
if (doSec('neb')) {
  const a1 = {}, a2 = {}, a3 = {};
  log(`\n===== CW1 / 🐚nebulaShell 主系列(kFrame=1・kRep=0.3 実値): ${QS.length} 構成 × ${NEB_STEPS}步 =====`);
  for (const q of QS) await runNeb(tagQ(q), { kFrame: 1, q }, a1);
  log(`\n===== CW1 / 🐚nebulaShell kRep=0 系列(kFrame=1・kRep=0) =====`);
  for (const q of QS) await runNeb(tagQ(q), { kFrame: 1, q, kRep: 0 }, a2);
  log(`\n===== CW1 / 🐚nebulaShell kFrame=0 系列(kRep=0.3 実値) =====`);
  for (const q of QS) await runNeb(tagQ(q), { kFrame: 0, q }, a3);
  const dragProbes = {};
  for (const q of QS) dragProbes[tagQ(q)] = await nebDragProbe(q);
  log('[🐚 引きずりプローブ(エンベロープ平均 Ω_drag/Ω_kepler)]');
  for (const [k, pr] of Object.entries(dragProbes))
    log(`  ${k} q=${pr.q} 解析=${fmt(pr.meanDragOverKepler, 4)} 実測u=${fmt(pr.meanMeasuredOverKepler, 4)} ⟨r⟩=${fmt(pr.envMeanR, 1)}`);

  // ---- CW3: Rc 用量 ----
  log(`\n===== CW3 / 🐚nebulaShell Rc 用量(${RC_MULS.length} 値)=====`);
  const probe0 = await nebCoreResponse(RC0, null);
  const RBAR = probe0.RbarClump;
  const rcResp = {}, rcResp_q3 = {}, rcDyn = {};
  for (const mul of RC_MULS) {
    const rc = RC0 * mul;
    rcResp['rc' + mul] = await nebCoreResponse(rc, null);
    rcResp_q3['rc' + mul] = await nebCoreResponse(rc, 3);
  }
  const refResp = await nebCoreResponse(RBAR, null);       // Rc=R̄(単層相当の基準)
  const refResp_q3 = await nebCoreResponse(RBAR, 3);
  for (const mul of RC_MULS) await runNeb('rc' + mul, { kFrame: 1, rcAbs: RC0 * mul }, rcDyn);
  await runNeb('rcRbar', { kFrame: 1, rcAbs: RBAR }, rcDyn);
  for (const mul of RC_MULS) {
    const e = rcResp['rc' + mul];
    log(`  Rc=${fmt(e.rcUsed, 4)} (×${mul}) 実測ΔΩ=${e.dOmegaMeasured.toExponential(4)} 解析ΔΩ=${e.dOmegaAnalytic.toExponential(4)}`);
  }
  log(`  基準 Rc=R̄=${fmt(RBAR, 4)} 実測ΔΩ=${refResp.dOmegaMeasured.toExponential(4)}`);

  // ---- 🐚 対照: kFrame=0 × kRep=0 の bit 一致 ----
  const ctl = {};
  log(`\n===== 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照)=====`);
  await runNeb('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl);
  await runNeb('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl);
  await runNeb('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl);
  await runNeb('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl);

  out.raw.neb = { steps: NEB_STEPS,
    cw1: { arms: { main: { cfg: { kFrame: 1, kRep: '実値(0.3)' }, runs: a1 },
        kRep0: { cfg: { kFrame: 1, kRep: 0 }, runs: a2 },
        kF0: { cfg: { kFrame: 0, kRep: '実値(0.3)' }, runs: a3 } },
      dragProbes },
    cw3: { Rc0: RC0, RbarClump: RBAR, rcMuls: RC_MULS,
      response_q2: rcResp, response_q3: rcResp_q3,
      reference_q2: refResp, reference_q3: refResp_q3, dynamics: rcDyn },
    controls: ctl };
}

// ---- 節 ctl: ⚫ 対照(kFrame=0 × kRep=0 の bit 一致)----
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== 対照 / ⚫bhCore kFrame=0 × kRep=0(bit 一致対照)=====`);
  await runBH('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl);
  await runBH('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl);
  await runBH('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl);
  await runBH('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl);
  out.raw.ctl = { runs: ctl };
}

// ======================================= 集計・判定 =========================================
// 事前登録した規則をそのまま適用する(実測後に規則を変えない)。
const dynKeysBH = ['series', 'final', 'outerVt', 'nOuter', 'n', 'nan', 'clampV', 'clampS', 'clampR'];
const dynKeysNeb = ['clump', 'envelope', 'n', 'nan', 'clampV', 'clampS'];
const pickJ = (o, ks) => { const r = {}; for (const k of ks) r[k] = o[k]; return JSON.stringify(r); };
const fullJ = (o) => { const r = { ...o }; delete r.cfg; delete r.tag; delete r.elapsedSec; return JSON.stringify(r); };

const bracket = (rows) => {
  const uns = rows.filter(r => !r.stable).map(r => r.q);
  const sta = rows.filter(r => r.stable).map(r => r.q);
  if (!uns.length || !sta.length) return { qLo: null, qHi: null, contains1p5: null,
    note: uns.length ? '掃引範囲内に安定点なし' : '掃引範囲内に不安定点なし' };
  const qLo = Math.max(...uns), qHi = Math.min(...sta);
  const monotone = qLo < qHi;
  return { qLo, qHi, contains1p5: (qLo <= 1.5 && 1.5 <= qHi),
    monotone, note: monotone ? '単調(全ての不安定 q < 全ての安定 q)' : '非単調(不安定 q が安定 q より上に混在)' };
};

const cw1Table = (runs, lossFn, label) => Object.entries(runs).map(([tag, r]) => {
  const q = r.cfg.q, loss = lossFn(r);
  return { tag, q, loss, stable: loss < 0.20, sample: label };
}).sort((a, b) => a.q - b.q);

// ---- post-hoc 診断(事前登録ではない — 実測後に付けた読み。判定には使わない)----
// ① 生存の「発端」: 全損(損失率 ≥ 0.99)を離れる最初の q を挟む区間。事前登録の 20% しきい値は
//    「外殻の大半が残る」点で、こちらは「外殻が1粒でも残り始める」点 — 別の量である。
const onsetBracket = (rows) => {
  const tot = rows.filter(r => r.loss >= 0.99).map(r => r.q);
  const sur = rows.filter(r => r.loss < 0.99).map(r => r.q);
  if (!tot.length || !sur.length) return { qLo: null, qHi: null, contains1p5: null,
    note: tot.length ? '掃引範囲内に「全損を離れる」点なし' : '掃引範囲内に全損点なし' };
  const qLo = Math.max(...tot), qHi = Math.min(...sur);
  return { qLo, qHi, contains1p5: (qLo <= 1.5 && 1.5 <= qHi), threshold: 0.99 };
};
// ② (R/(R+d))^q の局所対数傾き = −q·r/(R+r) を Ω_kepler の −3/2 と釣り合わせた実効臨界指数。
//    遠方漸近の q=3/2 は R≪r の極限であり、有限 r では q*_eff=(3/2)(1+R/r) > 3/2 になる。
const qEffCritical = (R, r) => 1.5 * (1 + R / r);

out.cw1 = { rule: PRE_REGISTERED.CW1, arms: {} };
if (out.raw.bh1) {
  const t = cw1Table(out.raw.bh1.runs, r => bhLoss(r.final), 'bhCore');
  out.cw1.arms['bhCore_kF1_kRepRef'] = { table: t, bracketPreRegisteredOnly: bracket(t.filter(e => e.q >= 1.2)),
    bracketWithAnchor: bracket(t) };
  if (out.raw.bh1.profiles) {
    out.cw1.arms['bhCore_kF1_kRepRef'].dragOverKeplerAtShell = Object.fromEntries(
      Object.entries(out.raw.bh1.profiles).map(([k, pr]) => {
        const pb = (b) => { const e = pr.prof.find(x => x.rBin === b); return e ? e.dragOverKepler : null; };
        return [k, { q: pr.params.q, r60: pb(60), r160: pb(160), r220: pb(220), r260: pb(260) }];
      }));
  }
}
if (out.raw.bh2) {
  const t = cw1Table(out.raw.bh2.runs, r => bhLoss(r.final), 'bhCore');
  out.cw1.arms['bhCore_kF1_kRep0'] = { table: t, bracketPreRegisteredOnly: bracket(t.filter(e => e.q >= 1.2)), bracketWithAnchor: bracket(t) };
}
if (out.raw.bh3) {
  const t = cw1Table(out.raw.bh3.runs, r => bhLoss(r.final), 'bhCore');
  out.cw1.arms['bhCore_kF0_kRepRef'] = { table: t, bracketPreRegisteredOnly: bracket(t.filter(e => e.q >= 1.2)), bracketWithAnchor: bracket(t) };
}
if (out.raw.neb) {
  for (const [k, a] of Object.entries(out.raw.neb.cw1.arms)) {
    const t = cw1Table(a.runs, nebLoss, 'nebulaShell');
    out.cw1.arms['nebulaShell_' + k] = { table: t, bracketPreRegisteredOnly: bracket(t.filter(e => e.q >= 1.2)), bracketWithAnchor: bracket(t) };
  }
  out.cw1.arms['nebulaShell_main'].dragOverKeplerAtShell = Object.fromEntries(
    Object.entries(out.raw.neb.cw1.dragProbes).map(([k, pr]) =>
      [k, { q: pr.q, envMeanR: pr.envMeanR, meanDragOverKepler: pr.meanDragOverKepler,
        meanMeasuredOverKepler: pr.meanMeasuredOverKepler }]));
}
// post-hoc: 全アームに「生存の発端」区間を付け、⚫ には帯別(ガス/恒星)の 20% しきい値区間も付ける
{
  const bandTab = (runs, key) => Object.entries(runs).map(([tag, r]) => {
    const loss = r.final[key].escFrac + r.final[key].fallFrac;
    return { tag, q: r.cfg.q, loss, stable: loss < 0.20 };
  }).sort((a, b) => a.q - b.q);
  const rawOf = { bhCore_kF1_kRepRef: out.raw.bh1, bhCore_kF1_kRep0: out.raw.bh2, bhCore_kF0_kRepRef: out.raw.bh3 };
  for (const [k, arm] of Object.entries(out.cw1.arms)) {
    arm.postHoc = { preRegistered: false,
      note: '事前登録ではない実測後の診断。判定(verdict)には使っていない',
      onsetOfSurvival: onsetBracket(arm.table) };
    const rw = rawOf[k];
    if (rw) {
      const g = bandTab(rw.runs, 'gas'), s = bandTab(rw.runs, 'star');
      arm.postHoc.byBand = { gas: { table: g, bracket: bracket(g), onset: onsetBracket(g) },
        star: { table: s, bracket: bracket(s), onset: onsetBracket(s) } };
    }
  }
  // 実効臨界指数(有限 r 補正)。⚫ は R0=15・恒星帯の代表半径、🐚 は R̄・エンベロープ平均半径
  out.cw1.postHocEffectiveCritical = { preRegistered: false,
    formula: 'ω_drag=(R/(R+r))^q の局所対数傾き −q·r/(R+r) を Ω_kepler の −3/2 に釣り合わせる → q*_eff=(3/2)(1+R/r)。r→∞ で 3/2 に戻る',
    bhCore: out.raw.bh1 ? (() => { const R0 = out.raw.bh1.profiles['q2.00'].params.R0;
      return { R: R0, r160: qEffCritical(R0, 160), r220: qEffCritical(R0, 220), r260: qEffCritical(R0, 260) }; })() : null,
    nebulaShell: out.raw.neb ? (() => { const pr = out.raw.neb.cw1.dragProbes['q2.00'];
      return { R: pr.RbarClump, rEnv: pr.envMeanR, qEff: qEffCritical(pr.RbarClump, pr.envMeanR) }; })() : null };
}

{
  const primary = ['bhCore_kF1_kRepRef', 'nebulaShell_main'].filter(k => out.cw1.arms[k]);
  out.cw1.verdict = primary.length ? Object.fromEntries(primary.map(k => {
    const b = out.cw1.arms[k].bracketWithAnchor;
    return [k, { bracket: [b.qLo, b.qHi], contains1p5: b.contains1p5,
      result: b.contains1p5 === null ? 'INCONCLUSIVE' : (b.contains1p5 ? 'PASS' : 'FAIL'), note: b.note }];
  })) : null;
}

if (out.raw.cw2) {
  const tab = (runs) => Object.entries(runs).map(([tag, r]) => ({ tag,
    omMul: r.cfg.coreOmega / r.cfg.coreOmegaRef, coreOmega: r.cfg.coreOmega,
    loss: bhLoss(r.final), lossGas: r.final.gas.escFrac + r.final.gas.fallFrac,
    lossStar: r.final.star.escFrac + r.final.star.fallFrac,
    sdOverMeanGas: r.final.gas.sdOverMean, sdOverMeanStar: r.final.star.sdOverMean,
    outerVt: r.outerVt })).sort((a, b) => a.omMul - b.omMul);
  const verdictOf = (t) => {
    if (!t.length) return null;
    let bi = 0; for (let i = 1; i < t.length; i++) if (t[i].loss < t[bi].loss) bi = i;
    const interior = bi > 0 && bi < t.length - 1;
    const ties = t.filter(e => e.loss === t[bi].loss).map(e => e.omMul);
    return { argminOmMul: t[bi].omMul, argminCoreOmega: t[bi].coreOmega, minLoss: t[bi].loss,
      endpoints: { lo: { omMul: t[0].omMul, loss: t[0].loss }, hi: { omMul: t[t.length - 1].omMul, loss: t[t.length - 1].loss } },
      tiesAt: ties, interiorMinimum: interior, result: interior ? 'PASS' : 'FAIL' };
  };
  out.cw2 = { rule: PRE_REGISTERED.CW2,
    arms: Object.fromEntries(Object.entries(out.raw.cw2.arms).map(([k, a]) => {
      const t = tab(a.runs); return [k, { cfg: a.cfg, table: t, minimum: verdictOf(t) }]; })) };
  out.cw2.verdict = out.cw2.arms.main ? out.cw2.arms.main.minimum : null;
}

if (out.raw.neb && out.raw.neb.cw3) {
  const c3 = out.raw.neb.cw3, RBAR = c3.RbarClump;
  const mk = (resp, ref, qv) => {
    const rows = c3.rcMuls.map(mul => {
      const e = resp['rc' + mul];
      const ampRatio = e.dOmegaMeasured / ref.dOmegaMeasured;
      const theory = Math.pow(e.rcUsed / RBAR, e.q);           // 事前登録の理論形 (Rc/R̄)^q(遠方漸近)
      const exact = e.dOmegaAnalytic / ref.dOmegaAnalytic;     // 厳密形(u の式に ω コア差動項だけを入れた解析予測の比)
      return { rcMul: mul, Rc: e.rcUsed, RcOverRbar: e.rcUsed / RBAR, q: e.q,
        dOmegaMeasured: e.dOmegaMeasured, dOmegaAnalytic: e.dOmegaAnalytic,
        analyticOverMeasured: e.dOmegaAnalytic / e.dOmegaMeasured,
        ampRatioMeasured: ampRatio, theoryAsymptotic: theory, theoryExactAnalytic: exact,
        relDevVsAsymptotic: ampRatio / theory - 1, relDevVsExactAnalytic: ampRatio / exact - 1,
        withinTolerance: Math.abs(ampRatio / theory - 1) <= 0.20 };
    });
    return { q: qv, RbarClump: RBAR, refDOmega: ref.dOmegaMeasured, rows,
      result: rows.every(r => r.withinTolerance) ? 'PASS' : 'FAIL',
      maxAbsRelDev: Math.max(...rows.map(r => Math.abs(r.relDevVsAsymptotic))) };
  };
  out.cw3 = { rule: PRE_REGISTERED.CW3,
    q2: mk(c3.response_q2, c3.reference_q2, c3.response_q2['rc1'].q),
    q3: mk(c3.response_q3, c3.reference_q3, c3.response_q3['rc1'].q),
    dynamics: Object.fromEntries(Object.entries(c3.dynamics).map(([k, r]) =>
      [k, { Rc: r.cfg.coreRc, envKeepFrac: r.envelope.keepFrac, envLoss: nebLoss(r),
        envSdOverMean: r.envelope.sdOverMean, clumpKeepFrac: r.clump.keepFrac,
        lswClumpMean: r.lswClumpMean }])) };
  out.cw3.verdict = { preRegistered_q2: out.cw3.q2.result, secondary_q3: out.cw3.q3.result };
}

out.controls = { rule: PRE_REGISTERED.CONTROL, bitIdentity: [] };
if (out.raw.ctl) {
  const r = out.raw.ctl.runs;
  out.controls.bitIdentity.push(
    { sample: 'bhCore', pair: ['ctl_q1.30', 'ctl_q1.90'], axis: 'q(1.3 vs 1.9)',
      dynamicsIdentical: pickJ(r['ctl_q1.30'], dynKeysBH) === pickJ(r['ctl_q1.90'], dynKeysBH),
      allFieldsIdentical: fullJ(r['ctl_q1.30']) === fullJ(r['ctl_q1.90']) },
    { sample: 'bhCore', pair: ['ctl_om0.00', 'ctl_om2.00'], axis: 'Ω_c(×0 vs ×2)',
      dynamicsIdentical: pickJ(r['ctl_om0.00'], dynKeysBH) === pickJ(r['ctl_om2.00'], dynKeysBH),
      allFieldsIdentical: fullJ(r['ctl_om0.00']) === fullJ(r['ctl_om2.00']),
      note: 'Ω_c を振ると τ_cs(K_cs=0.02)経由でコア/殻のスピン状態は当然変わる。力学フィールドの一致が対照の本体' },
    { sample: 'bhCore', pair: ['ctl_q1.30', 'ctl_om0.00'], axis: 'q と Ω_c の交差',
      dynamicsIdentical: pickJ(r['ctl_q1.30'], dynKeysBH) === pickJ(r['ctl_om0.00'], dynKeysBH),
      allFieldsIdentical: fullJ(r['ctl_q1.30']) === fullJ(r['ctl_om0.00']) });
}
if (out.raw.neb && out.raw.neb.controls) {
  const r = out.raw.neb.controls;
  out.controls.bitIdentity.push(
    { sample: 'nebulaShell', pair: ['ctl_q1.30', 'ctl_q1.90'], axis: 'q(1.3 vs 1.9)',
      dynamicsIdentical: pickJ(r['ctl_q1.30'], dynKeysNeb) === pickJ(r['ctl_q1.90'], dynKeysNeb),
      allFieldsIdentical: fullJ(r['ctl_q1.30']) === fullJ(r['ctl_q1.90']) },
    { sample: 'nebulaShell', pair: ['ctl_om0.00', 'ctl_om2.00'], axis: 'Ω_c(×0 vs ×2)',
      dynamicsIdentical: pickJ(r['ctl_om0.00'], dynKeysNeb) === pickJ(r['ctl_om2.00'], dynKeysNeb),
      allFieldsIdentical: fullJ(r['ctl_om0.00']) === fullJ(r['ctl_om2.00']) },
    { sample: 'nebulaShell', pair: ['ctl_q1.30', 'ctl_om0.00'], axis: 'q と Ω_c の交差',
      dynamicsIdentical: pickJ(r['ctl_q1.30'], dynKeysNeb) === pickJ(r['ctl_om0.00'], dynKeysNeb),
      allFieldsIdentical: fullJ(r['ctl_q1.30']) === fullJ(r['ctl_om0.00']) });
}
out.controls.allDynamicsIdentical = out.controls.bitIdentity.length
  ? out.controls.bitIdentity.every(e => e.dynamicsIdentical) : null;

// ---- 第135便との共有点照合(在れば。q=2.0/Ω_c×1 の主系列は第135便 om1_kF1 と同一構成)----
if (fs.existsSync(REF135) && !QUICK) {
  try {
    const ref = JSON.parse(fs.readFileSync(REF135, 'utf8'));
    const cmp = [];
    const rb = ref.samples && ref.samples.bhCore && ref.samples.bhCore.runs;
    const rn = ref.samples && ref.samples.nebulaShell && ref.samples.nebulaShell.runs;
    const add = (label, a, b, keys) => { if (a && b) cmp.push({ label, identical: pickJ(a, keys) === pickJ(b, keys) }); };
    if (rb && out.raw.bh1) add('bhCore q=2.0 kF1 kRep実 vs 第135便 om1_kF1', out.raw.bh1.runs['q2.00'], rb['om1_kF1'], dynKeysBH);
    if (rb && out.raw.bh3) add('bhCore q=2.0 kF0 kRep実 vs 第135便 om1_kF0', out.raw.bh3.runs['q2.00'], rb['om1_kF0'], dynKeysBH);
    if (rb && out.raw.cw2) add('bhCore Ω_c×1 kF1 vs 第135便 om1_kF1', out.raw.cw2.arms.main.runs['om1.00'], rb['om1_kF1'], dynKeysBH);
    if (rb && out.raw.cw2) add('bhCore Ω_c×0 kF1 vs 第135便 om0_kF1', out.raw.cw2.arms.main.runs['om0.00'], rb['om0_kF1'], dynKeysBH);
    if (rn && out.raw.neb) add('nebulaShell q=2.0 kF1 vs 第135便 om1_kF1', out.raw.neb.cw1.arms.main.runs['q2.00'], rn['om1_kF1'], dynKeysNeb);
    out.crossWaveCheck = { source: 'tests/out/coreshell-results.json(第135便)', comparisons: cmp,
      allIdentical: cmp.length ? cmp.every(e => e.identical) : null };
  } catch (e) { out.crossWaveCheck = { error: String(e && e.message) }; }
}

// ---- 決定性(2回実行ビット同一)----
// CS2_DET_REF=<別プロセスで作った同内容 JSON> を渡すと、実測部(raw)を時刻・所要時間を除いて
// 正準化(キー整列)し、SHA-256 と完全一致を記録する。
{
  const dropKeys = new Set(['elapsedSec', 'date', 'mergedFrom', 'only']);
  const canonize = (o) => {
    if (Array.isArray(o)) return o.map(canonize);
    if (o && typeof o === 'object') {
      const r = {};
      for (const k of Object.keys(o).sort()) if (!dropKeys.has(k)) r[k] = canonize(o[k]);
      return r;
    }
    return o;
  };
  const { createHash } = await import('node:crypto');
  const mine = JSON.stringify(canonize(out.raw));
  const rec = { canonicalization: 'raw(実測部)を対象に elapsedSec/date/mergedFrom/only を除去しキーを整列した JSON',
    sha256: createHash('sha256').update(mine).digest('hex'), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.CS2_DET_REF;
  if (refPath && fs.existsSync(refPath)) {
    const other = JSON.stringify(canonize(JSON.parse(fs.readFileSync(refPath, 'utf8')).raw || {}));
    rec.reference = path.basename(refPath);
    rec.referenceSha256 = createHash('sha256').update(other).digest('hex');
    rec.identical = (mine === other);
    rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一 seed・同一窓)';
  }
  out.determinism = rec;
}

out.meta.elapsedSec = (Date.now() - T_START) / 1000;
out.meta.sectionRuns.push({ sections: ONLY.length ? ONLY : ['(all)'], date: out.meta.date, elapsedSec: out.meta.elapsedSec });
out.meta.measurementElapsedSecTotal = out.meta.sectionRuns.reduce((a, e) => a + e.elapsedSec, 0);
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\n===== 判定 =====`);
log('CW1 ' + JSON.stringify(out.cw1.verdict));
if (out.cw2) log('CW2 ' + JSON.stringify(out.cw2.verdict));
if (out.cw3) log('CW3 ' + JSON.stringify(out.cw3.verdict) + ' maxAbsRelDev(q2)=' + fmt(out.cw3.q2.maxAbsRelDev, 4));
log('対照(kF0×kRep0 bit 一致) allDynamicsIdentical=' + out.controls.allDynamicsIdentical);
log('決定性 sha256=' + out.determinism.sha256 + ' identical=' + out.determinism.identical);
if (out.crossWaveCheck) log('第135便 共有点照合 allIdentical=' + out.crossWaveCheck.allIdentical);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();

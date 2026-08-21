// 第152便 exp-coreshell3.mjs — コア外殻第3実験(事前登録窓 XW1〜XW4 の実行)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs の続き。
//   第139便は「外殻損失率 20% しきい値」で安定/不安定を切り、その挟み区間が臨界 q=3/2 を
//   含むかを事前登録窓 CW1 とした。実測は ⚫[1.8,1.9]・🐚[1.7,1.8] で **FAIL**(窓は動かさず
//   FAIL のまま記録済み)。その後の診断で、
//     ① 20% という**単一しきい値の定義依存**(帯別・全損離脱で区間が動く)
//     ② 遠方漸近 q=3/2 は R≪r の極限で、有限 r では q*_eff=(3/2)(1+R/r) > 3/2 になる
//   の2点が候補として挙がった。本便(第152便)はこの2点を**事前登録窓のまま**検証する:
//     XW1 で主指標をしきい値非依存の**ロジスティック中点 q₅₀** に置き換え、
//     XW2 で絶対値ではなく **R/r を振ったときの差分 Δq₅₀** を予測 Δ[(3/2)(1+R/r)] と比べる
//     (閾値定義・経路混在の系統は差分で相殺する設計。**絶対値には窓を置かない**)。
//
// 事前登録(統括が実測前に固定 — 実測後に動かさない。FAIL は FAIL のまま記録する):
//   XW1(主指標・窓なし): 損失率 vs q のロジスティック中点 q₅₀ を主指標とする(単一20%閾値の
//     定義依存を解消)。対象アーム = ⚫kF1kRep実 / ⚫kF1kRep0 / ⚫kF0kRep実 / 🐚kF1kRep実 /
//     🐚kF0kRep実。q グリッドは第139便(exp-coreshell2)と同一(1.0〜2.0×0.1)+遷移帯で 0.05 補間可。
//     各アームの q₅₀ を報告(窓なし — 記述統計)。
//   XW2(R/r 差分検証・窓): ⚫ 中心 R=15→{10,5}・🐚 エンベロープ半径×{1,2} で q₅₀ を実測し、
//     差分 Δq₅₀ を予測 Δ[(3/2)(1+R/r)] と比較。窓 = **符号一致 かつ |Δ実測−Δ予測| ≤ 0.15**
//     (⚫kF1kRep実 アーム)。絶対値には窓を置かない。
//   XW3(経路固定・窓): 🐚kF1kRep=0 は全 q で損失 <20%(第139便実測の固定化)。
//   XW4(決定性・対照): (a) 全体を2回実行し結果 JSON(volatile 除く)の SHA 一致
//     (b) 第139便(coreshell2)と共有するグリッド点の bit 一致
//     (c) kF0×kRep=0 アームの bit 対照(第139便と同じ対照方法)を再実施。
//
// 手法は第135便→第139便の踏襲(測定量・帯定義・逃散/落下しきい値・seed・窓・kRep=0 単離):
//   ⚫bhCore  : seed 20260805・6000步(validT=96)・外殻 = ①降着円盤ガス 120体(esc r>200 / fall r<30)
//               ②恒星ディスク 200体(esc r>450 / fall r<30)。損失率 = 両帯の(逃散+落下)/320
//   🐚nebulaShell: seed 20260804・3000步(validT=48)・外殻 = 低スピン放射エンベロープ 44体
//               (index 54..97)・保持 = クランプ重心から r<300(第135便・第139便と同一)
//   dt=0.016(全構成共通)。数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// 本便で新たに触るノブ(第139便までの改変器に追加した2つ。既定値では 1 bit も変えない):
//   ⚫ rAbs   : bodies[0].radius(中心の半径 R。プリセット実値 15)を上書きする。
//               R は引きずり核 (R/(R+d))^q・慣性 I=½mR²・接触・温度・扁平率に効く(index.html の R 定義)。
//               初期配置の生成に使う insideBig の「大天体半径」は radiusScale·rMul·√m(=60)で
//               b.radius を見ないので、**R を振っても初期配置は 1 bit も変わらない**(本ハーネスで実測確認)。
//   🐚 envScale/keepR : エンベロープ ring の rIn/rOut を一律倍率で振る(半径の相似拡大)。
//               vMode="kepler" なので初速は新半径で解析再計算される。保持しきい値 r<300 は
//               同じ倍率で拡大する(×2 なら r<600)— しきい値を据え置くと保持率が自明に 0 になるため。
//
// トイ単位の限界(第135便・第139便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R・r・Ω_c の絶対値は当該サンプルの単位系に閉じた値である。
//   窓(步数)は各サンプルの validT に一致させた有限窓で、窓外の長時間挙動は測っていない。粒子数は
//   320(⚫)/98(🐚)の小標本で、損失率・保持率の分解能はそれぞれ 1/320・1/44 に制限される。
//
// 実行:
//   node tests/exp-coreshell3.mjs                        … 全節(既定)
//   CS3_ONLY=bh1,bh2,bh3,bhr,neb,ctl node tests/...      … 節を選択実行
//   CS3_MERGE=1 CS3_ONLY=neb node tests/...              … 既存 JSON へ節を追記合流
//   CS3_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS3_DET_REF=/path/run1.json [CS3_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//                                                          (WAIT_SEC は並行実行時に参照側の生成を待つ秒数)
//   CS3_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用・本番数値ではない)
// 出力: tests/out/coreshell3-results.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.CS3_OUT ? path.resolve(process.env.CS3_OUT)
  : path.join(OUT_DIR, 'coreshell3-results.json');
const REF139 = path.join(OUT_DIR, 'coreshell2-results.json');   // 第139便の実測正本(共有点の bit 照合)

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS3_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS3_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(統括が実測前に固定 — 実測後に動かさない) =================
const PRE_REGISTERED = {
  fixedBy: '統括(第139便裁定 → 第152便で実行)', fixedBefore: '実測',
  XW1: {
    role: '主指標(窓なし — 記述統計)',
    question: '損失率 vs q のロジスティック中点 q₅₀ を主指標とする(単一20%閾値の定義依存を解消)',
    arms: ['⚫kF1kRep実', '⚫kF1kRep0', '⚫kF0kRep実', '🐚kF1kRep実', '🐚kF0kRep実'],
    grid: 'q グリッドは第139便(exp-coreshell2)と同一(1.0〜2.0×0.1)+遷移帯で 0.05 補間可',
    report: '各アームの q₅₀ を報告(窓なし)',
    q50Definition: 'loss(q) = B + (A − B)/(1 + exp((q − q₅₀)/w)) の中点パラメータ q₅₀。' +
      'A=低 q 側プラトー・B=高 q 側プラトー・w>0=遷移幅。q₅₀ は loss=(A+B)/2 の点であり、' +
      '20% 等の単一しきい値に依存しない。当てはめは (q₅₀,w) の決定論的格子全探索+各点で (A,B) を' +
      '線形最小二乗の閉形式(反復・乱数なし)。A,B は損失率の定義域 [0,1] へ射影する',
    inconclusiveRule: '振幅 A−B < 0.20 の場合、または q₅₀ が掃引範囲 ±0.25 の外に出た場合は ' +
      'INCONCLUSIVE(遷移が掃引範囲に無い)として q₅₀ を主張しない — この規則も実測前に固定した',
  },
  XW2: {
    role: '窓(R/r 差分検証)',
    question: '⚫ 中心 R=15→{10,5}・🐚 エンベロープ半径×{1,2} で q₅₀ を実測し、差分 Δq₅₀ を' +
      '予測 Δ[(3/2)(1+R/r)] と比較する',
    window: '符号一致 かつ |Δ実測−Δ予測| ≤ 0.15(⚫kF1kRep実 アーム)',
    absoluteNoWindow: '**絶対値には窓を置かない**(第139便の教訓 — 閾値定義・経路混在の系統は差分で相殺する設計)',
    tolerance: 0.15,
    prediction: 'q*_eff = (3/2)(1+R/r)(遠方漸近 3/2 の有限 r 補正。' +
      'ω_drag=(R/(R+r))^q の局所対数傾き −q·r/(R+r) を Ω_kepler の −3/2 に釣り合わせた実効臨界指数)',
    RrMapping: {
      note: 'R・r の意味は exp-coreshell2(第139便)の実装からの転記である',
      bhCore: 'R = 中心天体 bodies[0] の粒子半径 S.R[0](プリセット実値 15。第139便 profileOf の ' +
        'params.R0 と同一の量)。r = 参照半径 = **恒星帯(外殻・200体)の初期平均半径**(エンジン実測)。' +
        '第139便は post-hoc で r=160/220/260 の3値を併記していたが、本便は 🐚 側の取り方' +
        '(エンベロープ平均半径)と揃えて「外殻の平均半径」を正準の r とし、r=160/220/260 での' +
        '予測も感度として併記する(窓判定は正準 r のみで行う)',
      nebulaShell: 'R = R̄ = クランプ 54体の粒子半径 R の平均(第139便 nebDragProbe の RbarClump)。' +
        'r = エンベロープの平均半径(同 envMeanR)。エンベロープ半径×2 では r も実測し直す',
    },
    primaryArm: '⚫kF1kRep実(事前登録の窓文が名指ししているアーム)',
    secondary: '🐚 エンベロープ半径×{1,2} も同じ規則で判定し **secondary** として記録する(窓文は ⚫ を名指ししているため)',
    deltaConvention: 'Δ = (振った構成) − (基準構成)。⚫ の基準は R=15、🐚 の基準は ×1',
  },
  XW3: {
    role: '窓(経路固定)',
    question: '🐚kF1kRep=0 は全 q で損失 <20% か(第139便実測の固定化)',
    verdictRule: 'PASS = 掃引した全 q で外殻損失率 < 0.20。1点でも ≥0.20 なら FAIL',
    threshold: 0.20,
  },
  XW4: {
    role: '窓(決定性・対照)',
    a: '全体を2回実行し結果 JSON(volatile 除く)の SHA 一致',
    b: '第139便(coreshell2)と共有するグリッド点の bit 一致',
    c: 'kF0×kRep=0 アームの bit 対照(第139便と同じ対照方法)を再実施',
    controlRule: 'kFrame=0(引きずり経路を閉じる)かつ kRep=0(E5′ スピン斥力経路を閉じる)なら、' +
      'q や Ω_c を振っても外殻の力学は 1 bit も変わらないはず。⚫ と 🐚 の双方で実施する',
    comparedFields: '力学フィールド(⚫: series/final/outerVt/nOuter/n/nan/clamp* ・🐚: clump/envelope/n/nan/clamp*)' +
      'の JSON 完全一致。コア状態(coreOm0/coreOm1/shellSpin1 等)は Ω_c を振れば当然変わるので比較対象から' +
      '外し、q 対については全フィールド一致も併記する(第139便と同じ対照方法)',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R・r・Ω_c の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  windows: {
    bhCore: { steps: 6000, validT: 96, note: '第135便・第139便・exp-4-81 と同一窓。窓外の長時間挙動は測っていない' },
    nebulaShell: { steps: 3000, validT: 48, note: '第135便・第139便と同一窓。窓外の長時間挙動は測っていない' },
  },
  seeds: { bhCore: 20260805, nebulaShell: 20260804,
    note: 'seed はプリセット定義値。build がそれを使うので構成間で同一 — 構成差はすべてノブ差である' },
  sampleSize: {
    bhCore: 'ガス 120体 + 恒星 200体 = 320(損失率の分解能 1/320 ≈ 0.0031)',
    nebulaShell: 'エンベロープ 44体(保持率の分解能 1/44 ≈ 0.0227)+ クランプ 54体',
  },
  q50Resolution: 'q₅₀ の当てはめ格子は 0.0025 刻み。掃引点の刻み(⚫ 0.1〜0.2 / 🐚 0.05〜0.2)より' +
    '細かいが、**q₅₀ の実質的な分解能を決めるのは掃引点の刻みと損失率の粒度**(1/320・1/44)であり、' +
    '格子刻みではない',
  bhRadiusCaveat: '⚫ の R を振ると、引きずり核 (R/(R+d))^q だけでなく中心天体の慣性 I=½mR²・接触半径・' +
    '温度・扁平率も同時に変わる(index.html の R の定義そのもの)。したがって Δq₅₀ には引きずり核の' +
    '形状変化以外の寄与も混じりうる — これは差分では相殺されない系統である(限界として明記する)',
  bhCoreKernelCaveat: '⚫ の外殻位置に届く引きずりは **2 項**の和である — 基底スピン項 s·(R/(R+d))^q ' +
    '(核 = 本便で振る R)と、コア差動項 (Mc/m)(Ω_c−s)·(Rc/(Rc+d))^q(核 = Rc、プリセット実値 7.5)。' +
    '事前登録窓は「中心 R=15→{10,5}」なので **Rc は振っていない**。両項の実測比は ' +
    'xw2.primary.postHoc.dragDecompositionAtShell に記録する(判定には使わない)',
  bhRadiusAmplitudeCaveat: 'R を下げると (R/(R+r))^q の**振幅**も同時に下がる(局所対数傾きの変化とは別の効果)。' +
    'q*_eff=(3/2)(1+R/r) は傾きの釣り合いだけを述べる式で、振幅の変化を含まない。両者が同符号に効くか' +
    '否かは実測が決めることであり、本便は窓を動かさずそのまま記録する',
  nebEnvelopeCaveat: '🐚 のエンベロープ半径を×2 すると、保持しきい値も×2(r<600)にする。' +
    'ケプラー初速は新半径で再計算されるが、クランプ質量・エンベロープ質量・粒子数は不変である',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ============================ 測定器(第139便 exp-coreshell2.mjs から踏襲) ====================
// A) ⚫bhCore — 第139便 measureBH と同一(帯定義・しきい値・スナップ数 NS=4・返却フィールドすべて同一)。
//    本便の追加は o.rAbs(bodies[0].radius の上書き)のみ。未指定なら 1 bit も変わらない。
const measureBH = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
  const OM0 = p.bodies[0].core.omega, S0 = p.bodies[0].spin, Q0 = p.physics.q, KCS0 = p.bodies[0].core.Kcs;
  const R0P = p.bodies[0].radius;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) p.bodies[0].core.omega = OM0 * o.omMul;
  if (o.kcs !== undefined) p.bodies[0].core.Kcs = o.kcs;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  if (o.rAbs !== undefined && o.rAbs !== null) p.bodies[0].radius = o.rAbs;
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
      KcsRef: KCS0, qRef: Q0, bodyRadius: p.bodies[0].radius, bodyRadiusRef: R0P, steps },
    series, final: series[series.length - 1],
    outerVt: c2 ? sum / c2 : 0, nOuter: c2,
    coreOm0: cs0 ? cs0.omega : null, coreOm1: cs1 ? cs1.omega : null,
    shellSpin1: S.spin[0], n: S.n,
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
}, mod);

// B) 🐚nebulaShell — 第139便 measureNeb と同一(+ o.envScale = エンベロープ ring 半径の倍率、
//    o.keepR = 保持しきい値。既定 keepR=300 で第139便と 1 bit も変わらない)
const measureNeb = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'nebulaShell')));
  const OM0 = p.bodies[0].core.omega, RC0 = p.bodies[0].core.radius;
  const env = p.bodies.find(b => b.type === 'ring');
  const ENV0 = { rIn: env.rIn, rOut: env.rOut };
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = OM0 * o.omMul;
  if (o.rcAbs !== undefined) for (const b of p.bodies) if (b.core) b.core.radius = o.rcAbs;
  if (o.envScale !== undefined && o.envScale !== null && o.envScale !== 1) {
    env.rIn = ENV0.rIn * o.envScale; env.rOut = ENV0.rOut * o.envScale;
  }
  const KEEP_ENV = (o.keepR === undefined || o.keepR === null) ? 300 : o.keepR;
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
  const band = (lo, hi, keepR) => {
    let n = 0, sum = 0, s2 = 0, keep = 0, bound = 0, dr = 0, dr2 = 0, vu = 0, vuN = 0;
    for (let i = lo; i < hi; i++) {
      const dx = S.x[i] - c.x, dy = S.y[i] - c.y, r = Math.hypot(dx, dy);
      const vx = S.vx[i] - c.vx, vy = S.vy[i] - c.vy;
      n++; sum += r; s2 += r * r;
      if (r < keepR) keep++;
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
      coreRc: p.bodies[0].core.radius, coreRcRef: RC0,
      envScale: (o.envScale === undefined || o.envScale === null) ? 1 : o.envScale,
      envRIn: env.rIn, envROut: env.rOut, envRInRef: ENV0.rIn, envROutRef: ENV0.rOut,
      keepR: KEEP_ENV, steps: o.steps, nClump: NC },
    clump: band(0, NC, 300), envelope: band(NC, S.n, KEEP_ENV), lswClumpMean: lsw / NC,
    n: S.n, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN };
}, mod);

// C) ⚫ 幾何プローブ(第152便 新規 — R と参照半径 r を build 直後(step 前)に読む)。
//    初期配置が R に依存しないこと(insideBig は radiusScale·rMul·√m を使う)を実測で確かめる。
const bhGeom = (rAbs, qOverride) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(z => z.id === 'bhCore')));
  if (o.q !== undefined && o.q !== null) p.physics.q = o.q;
  if (o.rAbs !== undefined && o.rAbs !== null) p.bodies[0].radius = o.rAbs;
  HP.sim.build(p);
  const S = HP.sim;
  const rel = (i) => Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]);
  const GAS_LO = 1, GAS_HI = 121, STA_LO = 121, STA_HI = S.n;
  const bandStat = (lo, hi) => {
    let n = 0, s = 0, s2 = 0, mn = Infinity, mx = -Infinity;
    for (let i = lo; i < hi; i++) { const r = rel(i); n++; s += r; s2 += r * r;
      if (r < mn) mn = r; if (r > mx) mx = r; }
    const mean = s / n;
    return { n, meanR: mean, sdR: Math.sqrt(Math.max(0, s2 / n - mean * mean)), minR: mn, maxR: mx };
  };
  // 位置の指紋(R 依存が無いことの bit 証拠)
  let fp = 0;
  for (let i = 0; i < S.n; i++) fp = (fp * 31 + Math.round((S.x[i] + S.y[i]) * 1e6)) % 2147483647;
  return { R0: S.R[0], Rc: S.RcV[0], m0: S.m[0], q: S.params.q, G: S.params.G,
    softening: S.params.softening, D0: S.params.D0, n: S.n,
    gas: bandStat(GAS_LO, GAS_HI), star: bandStat(STA_LO, STA_HI),
    positionFingerprint: fp };
}, { rAbs: rAbs === undefined ? null : rAbs, q: qOverride === undefined ? null : qOverride });

// D) ⚫ 影響範囲プローブ — 第139便 profileOf と同一(+ o.rAbs)
const profileOf = (id, mod) => page.evaluate(({ id, o }) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === id)));
  p.physics.kFrame = 1;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = b.core.omega * o.omMul;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.rAbs !== undefined && o.rAbs !== null) p.bodies[0].radius = o.rAbs;
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

// E) 🐚 引きずりプローブ — 第139便 nebDragProbe と同一(+ o.envScale)
const nebDragProbe = (qOverride, envScale) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(z => z.id === 'nebulaShell')));
  p.physics.kFrame = 1;
  if (o.q !== undefined && o.q !== null) p.physics.q = o.q;
  const env = p.bodies.find(b => b.type === 'ring');
  if (o.envScale !== undefined && o.envScale !== null && o.envScale !== 1) {
    env.rIn = env.rIn * o.envScale; env.rOut = env.rOut * o.envScale;
  }
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
    envScale: (o.envScale === undefined || o.envScale === null) ? 1 : o.envScale,
    envRIn: env.rIn, envROut: env.rOut,
    envMeanR: mean(e => e.r),
    meanDragOverKepler: mean(e => e.dragOverKepler),
    meanMeasuredOverKepler: mean(e => e.measuredOverKepler),
    medianDragOverKepler: sorted[Math.floor(sorted.length / 2)],
    rows };
}, { q: qOverride === undefined ? null : qOverride,
     envScale: envScale === undefined ? null : envScale });

// ==================== q₅₀(ロジスティック中点)の当てはめ — 事前登録の定義どおり ==============
// loss(q) = B + (A − B)/(1 + exp((q − q₅₀)/w))
//   (q₅₀, w) を決定論的な格子で全探索し、各格子点で (A,B) を線形最小二乗の閉形式で解く。
//   反復解法・乱数・初期値依存を一切持たない(同じ入力なら常に同じ出力 = 決定性の要求を満たす)。
const Q50_GRID = { qLo: 0.30, qHi: 3.00, qStep: 0.0025, wLo: 0.004, wHi: 0.80, wN: 80 };
const W_GRID = (() => { const a = []; for (let i = 0; i < Q50_GRID.wN; i++)
  a.push(Q50_GRID.wLo * Math.pow(Q50_GRID.wHi / Q50_GRID.wLo, i / (Q50_GRID.wN - 1))); return a; })();

function fitLogisticQ50(rows) {
  const xs = rows.map(r => r.q), ys = rows.map(r => r.loss), n = xs.length;
  const qMin = Math.min(...xs), qMax = Math.max(...xs);
  if (n < 4) return { q50: null, result: 'INCONCLUSIVE', note: '点数不足(4点未満)', nPoints: n };
  const sig = (z) => (z > 40 ? 0 : z < -40 ? 1 : 1 / (1 + Math.exp(z)));
  let best = null;
  const nq = Math.round((Q50_GRID.qHi - Q50_GRID.qLo) / Q50_GRID.qStep);
  for (let qi = 0; qi <= nq; qi++) {
    const q50 = Q50_GRID.qLo + qi * Q50_GRID.qStep;
    for (const w of W_GRID) {
      let s11 = 0, s12 = 0, s22 = 0, b1 = 0, b2 = 0;
      const S = new Array(n);
      for (let k = 0; k < n; k++) {
        const s = sig((xs[k] - q50) / w), t = 1 - s;
        S[k] = s;
        s11 += s * s; s12 += s * t; s22 += t * t; b1 += s * ys[k]; b2 += t * ys[k];
      }
      const det = s11 * s22 - s12 * s12;
      if (!(Math.abs(det) > 1e-13)) continue;
      let A = (b1 * s22 - b2 * s12) / det;
      let B = (b2 * s11 - b1 * s12) / det;
      const aOut = (A < 0 || A > 1), bOut = (B < 0 || B > 1);
      if (aOut || bOut) {   // 損失率の定義域 [0,1] へ射影し、片側だけ外れたときは他方を解き直す
        A = Math.min(1, Math.max(0, A)); B = Math.min(1, Math.max(0, B));
        if (aOut && !bOut && s22 > 1e-13) B = (b2 - s12 * A) / s22;
        else if (bOut && !aOut && s11 > 1e-13) A = (b1 - s12 * B) / s11;
        A = Math.min(1, Math.max(0, A)); B = Math.min(1, Math.max(0, B));
      }
      let sse = 0;
      for (let k = 0; k < n; k++) { const e = (B + (A - B) * S[k]) - ys[k]; sse += e * e; }
      if (best === null || sse < best.sse - 1e-15) best = { q50, w, A, B, sse };
    }
  }
  if (!best) return { q50: null, result: 'INCONCLUSIVE', note: '当てはめ不能', nPoints: n };
  const amp = best.A - best.B;
  const inRange = (best.q50 >= qMin - 0.25 && best.q50 <= qMax + 0.25);
  const ok = (amp >= 0.20) && inRange;
  // 参考: 損失率 0.5 を横切る点の線形補間(しきい値依存の従来型指標 — 主指標ではない)
  const srt = rows.slice().sort((a, b) => a.q - b.q);
  let cross = null;
  for (let i = 1; i < srt.length; i++) {
    const a = srt[i - 1], b = srt[i];
    if ((a.loss - 0.5) * (b.loss - 0.5) <= 0 && a.loss !== b.loss) {
      cross = a.q + (b.q - a.q) * (a.loss - 0.5) / (a.loss - b.loss); break;
    }
  }
  return { q50: ok ? best.q50 : null, q50Raw: best.q50, width: best.w,
    plateauLowQ: best.A, plateauHighQ: best.B, amplitude: amp,
    sse: best.sse, rmse: Math.sqrt(best.sse / n), nPoints: n,
    qRange: [qMin, qMax], withinRange: inRange,
    result: ok ? 'OK' : 'INCONCLUSIVE',
    note: ok ? null : (amp < 0.20 ? '振幅 A−B < 0.20(遷移が掃引範囲に無い)= 事前登録の INCONCLUSIVE 規則'
      : 'q₅₀ が掃引範囲 ±0.25 の外 = 事前登録の INCONCLUSIVE 規則'),
    crossing0p5LinearInterp: cross,
    model: 'loss(q) = B + (A − B)/(1 + exp((q − q50)/w))',
    fitGrid: Q50_GRID };
}

// 有限 r 補正つき実効臨界指数(第139便 post-hoc の式をそのまま使う)
const qEffCritical = (R, r) => 1.5 * (1 + R / r);

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

const out = { meta: { exp: 'coreshell3', wave: 152, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第139便 tests/exp-coreshell2.mjs(測定量・帯定義・窓・seed・步数・kRep=0 単離を踏襲)' +
      ' / 第135便 tests/exp-coreshell.mjs(原型)',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS, raw: {} };
out.meta.sectionRuns = [];
if (process.env.CS3_MERGE && fs.existsSync(OUT_PATH)) {
  const prev = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  out.raw = prev.raw || {};
  out.meta.sectionRuns = (prev.meta && prev.meta.sectionRuns) ? prev.meta.sectionRuns.slice() : [];
}

// ---- 掃引点(実測前に固定)----
// ⚫ 主格子 = 第139便 exp-coreshell2 と同一の10点(共有点 bit 一致照合のため 1 点も動かさない)
const Q_BH = [1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
// ⚫ R 変更アーム(XW2)の格子 = R を下げると遷移が低 q 側へ動きうるので下限を 0.8 まで広げた8点。
//   1 走行 32 秒 ×2 回実行の時間予算(60分目安)に収める点数として実測前に固定した。
const Q_BH_R = [0.8, 1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 2.0];
// 🐚 格子 = 第139便と同一の10点 + 遷移帯 0.05 補間4点(1 走行 2 秒なので全 🐚 アームに一律付与)
const Q_NEB = [1.0, 1.2, 1.3, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.9, 2.0];
const R_BH = [15, 10, 5];          // ⚫ 中心半径(15 = プリセット実値)
const ENV_SCALES = [1, 2];         // 🐚 エンベロープ半径倍率
const KEEP_R0 = 300;               // 🐚 保持しきい値(×1)。倍率とともに拡大する
const BH_STEPS = SC(6000), NEB_STEPS = SC(3000);
const tagQ = (q) => 'q' + q.toFixed(2);

const bhLoss = (f) => (f.gas.n * (f.gas.escFrac + f.gas.fallFrac) + f.star.n * (f.star.escFrac + f.star.fallFrac))
  / (f.gas.n + f.star.n);
const nebLoss = (r) => 1 - r.envelope.keepFrac;

const runBH = async (tag, mod, store) => {
  const t0 = Date.now();
  const r = await measureBH({ ...mod, steps: BH_STEPS });
  r.tag = tag; r.elapsedSec = (Date.now() - t0) / 1000;
  store[tag] = r;
  const f = r.final;
  log(`[⚫ ${tag.padEnd(12)}] loss=${fmt(bhLoss(f), 4)} (gas ${fmt(f.gas.escFrac + f.gas.fallFrac, 3)} / star ${fmt(f.star.escFrac + f.star.fallFrac, 3)}) R=${r.cfg.bodyRadius} σ/r star=${fmt(f.star.sdOverMean, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  return r;
};
const runNeb = async (tag, mod, store) => {
  const t0 = Date.now();
  const r = await measureNeb({ ...mod, steps: NEB_STEPS });
  r.tag = tag; r.elapsedSec = (Date.now() - t0) / 1000;
  store[tag] = r;
  log(`[🐚 ${tag.padEnd(12)}] loss=${fmt(nebLoss(r), 4)} keep=${fmt(r.envelope.keepFrac, 3)} envScale=${r.cfg.envScale} keepR=${r.cfg.keepR} meanR=${fmt(r.envelope.meanR, 1)} | clump keep=${fmt(r.clump.keepFrac, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
  return r;
};

// ---- 節 bh1: XW1 ⚫ 主アーム(kFrame=1・kRep=実値1・R=15)----
if (doSec('bh1')) {
  const runs = {};
  log(`\n===== XW1 / ⚫bhCore kF1·kRep実·R=15: ${Q_BH.length} 構成 × ${BH_STEPS}步 =====`);
  for (const q of Q_BH) await runBH(tagQ(q), { kFrame: 1, q }, runs);
  out.raw.bh1 = { arm: { kFrame: 1, kRep: '実値(1)', bodyRadius: 15 }, steps: BH_STEPS, grid: Q_BH, runs };
}

// ---- 節 bh2: XW1 ⚫ kRep=0 アーム(E5′ を閉じ、q を引きずり専用の変数にする)----
if (doSec('bh2')) {
  const runs = {};
  log(`\n===== XW1 / ⚫bhCore kF1·kRep0·R=15: ${Q_BH.length} 構成 =====`);
  for (const q of Q_BH) await runBH(tagQ(q), { kFrame: 1, q, kRep: 0 }, runs);
  out.raw.bh2 = { arm: { kFrame: 1, kRep: 0, bodyRadius: 15 }, steps: BH_STEPS, grid: Q_BH, runs };
}

// ---- 節 bh3: XW1 ⚫ kFrame=0 アーム(引きずりを閉じ、E5′ だけ残す)----
if (doSec('bh3')) {
  const runs = {};
  log(`\n===== XW1 / ⚫bhCore kF0·kRep実·R=15: ${Q_BH.length} 構成 =====`);
  for (const q of Q_BH) await runBH(tagQ(q), { kFrame: 0, q }, runs);
  out.raw.bh3 = { arm: { kFrame: 0, kRep: '実値(1)', bodyRadius: 15 }, steps: BH_STEPS, grid: Q_BH, runs };
}

// ---- 節 bhr: XW2 ⚫ 中心半径 R=15→{10,5}(kFrame=1・kRep=実値1)----
if (doSec('bhr')) {
  const geom = {}, arms = {}, profiles = {};
  for (const R of R_BH) geom['R' + R] = await bhGeom(R, null);
  log(`\n===== XW2 / ⚫bhCore 幾何プローブ(R=${R_BH.join(',')})=====`);
  for (const [k, g] of Object.entries(geom))
    log(`  ${k}: S.R[0]=${g.R0} Rc=${g.Rc} 恒星帯⟨r⟩=${fmt(g.star.meanR, 3)} ガス帯⟨r⟩=${fmt(g.gas.meanR, 3)} 配置指紋=${g.positionFingerprint}`);
  for (const R of R_BH.filter(r => r !== 15)) {
    const runs = {};
    log(`\n===== XW2 / ⚫bhCore kF1·kRep実·R=${R}: ${Q_BH_R.length} 構成 × ${BH_STEPS}步 =====`);
    for (const q of Q_BH_R) await runBH(tagQ(q), { kFrame: 1, q, rAbs: R }, runs);
    arms['R' + R] = { arm: { kFrame: 1, kRep: '実値(1)', bodyRadius: R }, grid: Q_BH_R, runs };
  }
  for (const R of R_BH) for (const q of [1.5, 2.0]) profiles[`R${R}_${tagQ(q)}`] = await profileOf('bhCore', { q, rAbs: R });
  out.raw.bhr = { steps: BH_STEPS, radii: R_BH, geom, arms, profiles };
}

// ---- 節 neb: XW1(🐚)+ XW2(エンベロープ半径×2)+ XW3(kRep=0)+ 🐚 対照 ----
if (doSec('neb')) {
  const main = {}, kRep0 = {}, kF0 = {}, env2 = {};
  log(`\n===== XW1 / 🐚nebulaShell kF1·kRep実(0.3)·env×1: ${Q_NEB.length} 構成 × ${NEB_STEPS}步 =====`);
  for (const q of Q_NEB) await runNeb(tagQ(q), { kFrame: 1, q }, main);
  log(`\n===== XW3 / 🐚nebulaShell kF1·kRep0·env×1 =====`);
  for (const q of Q_NEB) await runNeb(tagQ(q), { kFrame: 1, q, kRep: 0 }, kRep0);
  log(`\n===== XW1 / 🐚nebulaShell kF0·kRep実·env×1 =====`);
  for (const q of Q_NEB) await runNeb(tagQ(q), { kFrame: 0, q }, kF0);
  log(`\n===== XW2 / 🐚nebulaShell kF1·kRep実·env×2(保持しきい値も×2 = r<600)=====`);
  for (const q of Q_NEB) await runNeb(tagQ(q), { kFrame: 1, q, envScale: 2, keepR: KEEP_R0 * 2 }, env2);
  const dragProbes = {};
  for (const s of ENV_SCALES) dragProbes['env' + s] = await nebDragProbe(null, s);
  log('[🐚 引きずりプローブ(エンベロープ平均)]');
  for (const [k, pr] of Object.entries(dragProbes))
    log(`  ${k} q=${pr.q} R̄=${fmt(pr.RbarClump, 4)} ⟨r⟩=${fmt(pr.envMeanR, 3)} Ω_drag/Ω_kep=${fmt(pr.meanDragOverKepler, 5)}`);

  const ctl = {};
  log(`\n===== XW4c 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照)=====`);
  await runNeb('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl);
  await runNeb('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl);
  await runNeb('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl);
  await runNeb('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl);

  out.raw.neb = { steps: NEB_STEPS, grid: Q_NEB, keepR0: KEEP_R0,
    arms: { main: { cfg: { kFrame: 1, kRep: '実値(0.3)', envScale: 1, keepR: KEEP_R0 }, runs: main },
      kRep0: { cfg: { kFrame: 1, kRep: 0, envScale: 1, keepR: KEEP_R0 }, runs: kRep0 },
      kF0: { cfg: { kFrame: 0, kRep: '実値(0.3)', envScale: 1, keepR: KEEP_R0 }, runs: kF0 },
      env2: { cfg: { kFrame: 1, kRep: '実値(0.3)', envScale: 2, keepR: KEEP_R0 * 2 }, runs: env2 } },
    dragProbes, controls: ctl };
}

// ---- 節 ctl: XW4c ⚫ 対照(kFrame=0 × kRep=0 の bit 一致)----
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== XW4c 対照 / ⚫bhCore kFrame=0 × kRep=0(bit 一致対照)=====`);
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

const bhTable = (runs) => Object.entries(runs).map(([tag, r]) =>
  ({ tag, q: r.cfg.q, bodyRadius: r.cfg.bodyRadius, loss: bhLoss(r.final),
    lossGas: r.final.gas.escFrac + r.final.gas.fallFrac,
    lossStar: r.final.star.escFrac + r.final.star.fallFrac })).sort((a, b) => a.q - b.q);
const nebTable = (runs) => Object.entries(runs).map(([tag, r]) =>
  ({ tag, q: r.cfg.q, envScale: r.cfg.envScale, keepR: r.cfg.keepR, loss: nebLoss(r),
    keepFrac: r.envelope.keepFrac, boundFrac: r.envelope.boundFrac,
    clumpKeepFrac: r.clump.keepFrac })).sort((a, b) => a.q - b.q);
// 第139便の 20% しきい値区間(継続性のための参考 — 本便の主指標ではない)
const bracket20 = (rows) => {
  const uns = rows.filter(r => r.loss >= 0.20).map(r => r.q);
  const sta = rows.filter(r => r.loss < 0.20).map(r => r.q);
  if (!uns.length || !sta.length) return { qLo: null, qHi: null, contains1p5: null,
    note: uns.length ? '掃引範囲内に安定点なし' : '掃引範囲内に不安定点なし' };
  const qLo = Math.max(...uns), qHi = Math.min(...sta);
  return { qLo, qHi, contains1p5: (qLo <= 1.5 && 1.5 <= qHi), monotone: qLo < qHi };
};

// ---- XW1: 各アームの q₅₀ ----
out.xw1 = { rule: PRE_REGISTERED.XW1, arms: {} };
{
  const put = (key, label, table) => {
    out.xw1.arms[key] = { label, table, q50: fitLogisticQ50(table),
      bracket20PreWave139Style: bracket20(table) };
  };
  if (out.raw.bh1) put('bhCore_kF1_kRepRef', '⚫kF1kRep実(R=15)', bhTable(out.raw.bh1.runs));
  if (out.raw.bh2) put('bhCore_kF1_kRep0', '⚫kF1kRep0(R=15)', bhTable(out.raw.bh2.runs));
  if (out.raw.bh3) put('bhCore_kF0_kRepRef', '⚫kF0kRep実(R=15)', bhTable(out.raw.bh3.runs));
  if (out.raw.neb) {
    put('nebulaShell_kF1_kRepRef', '🐚kF1kRep実(env×1)', nebTable(out.raw.neb.arms.main.runs));
    put('nebulaShell_kF0_kRepRef', '🐚kF0kRep実(env×1)', nebTable(out.raw.neb.arms.kF0.runs));
    // XW1 の5アーム外(XW2/XW3 用のアーム)も同じ様式で q₅₀ を出す
    put('nebulaShell_kF1_kRep0', '🐚kF1kRep0(env×1・XW3 のアーム)', nebTable(out.raw.neb.arms.kRep0.runs));
    put('nebulaShell_kF1_kRepRef_env2', '🐚kF1kRep実(env×2・XW2 のアーム)', nebTable(out.raw.neb.arms.env2.runs));
  }
  if (out.raw.bhr) for (const [k, a] of Object.entries(out.raw.bhr.arms))
    put('bhCore_kF1_kRepRef_' + k, `⚫kF1kRep実(R=${a.arm.bodyRadius}・XW2 のアーム)`, bhTable(a.runs));
  out.xw1.preRegisteredFiveArms = ['bhCore_kF1_kRepRef', 'bhCore_kF1_kRep0', 'bhCore_kF0_kRepRef',
    'nebulaShell_kF1_kRepRef', 'nebulaShell_kF0_kRepRef'];
  out.xw1.summary = Object.fromEntries(Object.entries(out.xw1.arms).map(([k, a]) =>
    [k, { label: a.label, q50: a.q50.q50, result: a.q50.result, width: a.q50.width,
      plateaus: [a.q50.plateauLowQ, a.q50.plateauHighQ], rmse: a.q50.rmse,
      crossing0p5LinearInterp: a.q50.crossing0p5LinearInterp }]));
}

// ---- XW2: R/r 差分検証 ----
out.xw2 = { rule: PRE_REGISTERED.XW2, primary: null, secondary: null };
{
  const cmp = (label, R_ref, r_ref, q50_ref, R_var, r_var, q50_var) => {
    if (q50_ref === null || q50_var === null) return { label, result: 'INCONCLUSIVE',
      note: 'いずれかのアームの q₅₀ が事前登録の INCONCLUSIVE 規則に掛かった',
      predicted: { qEffRef: qEffCritical(R_ref, r_ref), qEffVar: qEffCritical(R_var, r_var),
        delta: qEffCritical(R_var, r_var) - qEffCritical(R_ref, r_ref) },
      measured: { q50Ref: q50_ref, q50Var: q50_var, delta: null } };
    const dPred = qEffCritical(R_var, r_var) - qEffCritical(R_ref, r_ref);
    const dMeas = q50_var - q50_ref;
    const sgn = (v) => (Math.abs(v) < 1e-12 ? 0 : Math.sign(v));
    const signMatch = (sgn(dPred) !== 0) && (sgn(dPred) === sgn(dMeas));
    const absDiff = Math.abs(dMeas - dPred);
    const within = absDiff <= PRE_REGISTERED.XW2.tolerance;
    return { label,
      geometry: { R_ref, r_ref, R_var, r_var,
        RoverR_ref: R_ref / r_ref, RoverR_var: R_var / r_var },
      predicted: { qEffRef: qEffCritical(R_ref, r_ref), qEffVar: qEffCritical(R_var, r_var), delta: dPred },
      measured: { q50Ref: q50_ref, q50Var: q50_var, delta: dMeas },
      signMatch, absDiff, withinTolerance: within,
      result: (signMatch && within) ? 'PASS' : 'FAIL' };
  };
  // ⚫(主・事前登録の窓文が名指しするアーム)
  if (out.raw.bhr && out.raw.bh1) {
    const rStar = out.raw.bhr.geom.R15.star.meanR;      // 正準の参照半径 r = 恒星帯の初期平均半径
    const q50Of = (k) => (out.xw1.arms[k] ? out.xw1.arms[k].q50.q50 : null);
    const rows = [];
    for (const R of R_BH.filter(x => x !== 15)) {
      rows.push(cmp(`⚫ R=15 → R=${R}`, 15, rStar, q50Of('bhCore_kF1_kRepRef'),
        R, rStar, q50Of('bhCore_kF1_kRepRef_R' + R)));
    }
    // 感度: 正準 r 以外(第139便 post-hoc が併記していた r=160/220/260)での予測差分。窓判定には使わない
    const sens = {};
    for (const rAlt of [160, 220, 260]) {
      sens['r' + rAlt] = R_BH.filter(x => x !== 15).map(R => ({ R,
        deltaPredicted: qEffCritical(R, rAlt) - qEffCritical(15, rAlt) }));
    }
    // ---- post-hoc 診断(**事前登録ではない — 判定〈verdict〉には一切使わない**)----
    // ① 格子差の診断: 基準アーム(R=15)は10点格子・R 変更アームは8点格子で当てはめている。
    //    q₅₀ は当てはめパラメータなので格子が違っても比較できるはずだが、格子差が Δq₅₀ に
    //    混じっていないかを見るために、**両者に共通する q 点だけへ制限して双方を当てはめ直した**
    //    Δ を併記する(🐚 側は全アームが同一格子なのでこの診断は不要)。
    // ② 外殻位置での引きずりの内訳: 本便が振ったのは bodies[0].radius(= 基底スピン項の核 R)だけで、
    //    コア差動項の核 Rc(=7.5)は振っていない。外殻位置で両項がどれだけ効いているかを
    //    profiles から拾って併記する(Δq₅₀ の大きさを読むための材料)。
    const commonGrid = Q_BH.filter(q => Q_BH_R.some(x => Math.abs(x - q) < 1e-9));
    const restrict = (tbl) => tbl.filter(e => commonGrid.some(q => Math.abs(q - e.q) < 1e-9));
    const refCommonFit = fitLogisticQ50(restrict(out.xw1.arms.bhCore_kF1_kRepRef.table));
    const commonRows = [];
    for (const R of R_BH.filter(x => x !== 15)) {
      const arm = out.xw1.arms['bhCore_kF1_kRepRef_R' + R];
      if (!arm) continue;
      const f = fitLogisticQ50(restrict(arm.table));
      commonRows.push(Object.assign(
        cmp(`⚫ R=15 → R=${R}(共通格子で両アームを当てはめ直した post-hoc 診断)`,
          15, rStar, refCommonFit.q50, R, rStar, f.q50),
        { fitRef: refCommonFit, fitVar: f }));
    }
    const decomp = {};
    for (const [k, pr] of Object.entries(out.raw.bhr.profiles)) {
      let e = null;
      for (const row of pr.prof) if (e === null || Math.abs(row.r - rStar) < Math.abs(e.r - rStar)) e = row;
      if (!e) continue;
      decomp[k] = { R0: pr.params.R0, Rc: pr.params.Rc, q: pr.params.q, shellSpin: pr.params.s0,
        rBin: e.rBin, r: e.r, omBaseAnalytic: e.omBaseAnalytic, omCoreAnalytic: e.omCoreAnalytic,
        coreOverBase: e.omBaseAnalytic === 0 ? null : e.omCoreAnalytic / e.omBaseAnalytic,
        omDragAnalytic: e.omDragAnalytic, dragOverKepler: e.dragOverKepler };
    }
    const geomSame = Object.values(out.raw.bhr.geom).every(g =>
      g.positionFingerprint === out.raw.bhr.geom.R15.positionFingerprint &&
      g.star.meanR === out.raw.bhr.geom.R15.star.meanR);
    out.xw2.primary = { arm: '⚫kF1kRep実', canonicalR: 'S.R[0](bodies[0].radius)',
      canonicalr: '恒星帯(外殻200体)の初期平均半径(エンジン実測)', rCanonical: rStar,
      initialGeometryIndependentOfR: geomSame,
      initialGeometryNote: '初期配置が R に依存しないこと(insideBig は radiusScale·rMul·√m を使い ' +
        'b.radius を見ない)の実測確認。true なら R 変更の効果は引きずり核・慣性・接触・温度・扁平率に限られる',
      comparisons: rows,
      sensitivityOfPredictionToR: sens,
      postHoc: { preRegistered: false,
        note: '実測後に付けた診断であり、事前登録窓の判定(xw2.verdict / xw2.primary.result)には' +
          '一切使っていない。判定は各アームを**それぞれの掃引格子**で当てはめた q₅₀(xw1)で行っている',
        commonGrid,
        commonGridComparisons: commonRows,
        commonGridNote: '基準アーム(R=15)と R 変更アームを、両者に共通する q 点だけへ制限して' +
          '当てはめ直した Δ。格子差が Δq₅₀ に効いているかどうかの診断である',
        dragDecompositionAtShell: decomp,
        dragDecompositionNote: '正準の参照半径 r に最も近いプロファイル bin での引きずりの内訳。' +
          'omBaseAnalytic = 基底スピン項 s·(R/(R+r))^q(本便が振った R が入る)・' +
          'omCoreAnalytic = コア差動項 (Mc/m)(Ω_c−s)·(Rc/(Rc+r))^q(核は Rc=7.5 で**本便では振っていない**)。' +
          'coreOverBase が大きいほど、bodies[0].radius を振っても外殻に届く引きずりの総量は変わらない',
      },
      result: rows.length ? (rows.every(e => e.result === 'PASS') ? 'PASS'
        : (rows.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE' : 'FAIL')) : null };
  }
  // 🐚(副 — 窓文は ⚫ を名指ししているため secondary として同じ規則で記録する)
  if (out.raw.neb && out.raw.neb.dragProbes) {
    const p1 = out.raw.neb.dragProbes.env1, p2 = out.raw.neb.dragProbes.env2;
    const row = cmp('🐚 エンベロープ半径 ×1 → ×2', p1.RbarClump, p1.envMeanR,
      out.xw1.arms.nebulaShell_kF1_kRepRef ? out.xw1.arms.nebulaShell_kF1_kRepRef.q50.q50 : null,
      p2.RbarClump, p2.envMeanR,
      out.xw1.arms.nebulaShell_kF1_kRepRef_env2 ? out.xw1.arms.nebulaShell_kF1_kRepRef_env2.q50.q50 : null);
    out.xw2.secondary = { arm: '🐚kF1kRep実', canonicalR: 'R̄ = クランプ54体の粒子半径の平均(RbarClump)',
      canonicalr: 'エンベロープの平均半径(envMeanR・引きずりプローブ実測)',
      dragOverKepler: { env1: p1.meanDragOverKepler, env2: p2.meanDragOverKepler },
      comparison: row, result: row.result,
      note: '事前登録の窓文は ⚫kF1kRep実 アームを名指ししているので、本行は同じ規則で計算した副次記録である' };
  }
  out.xw2.verdict = { primary: out.xw2.primary ? out.xw2.primary.result : null,
    secondary_nebula: out.xw2.secondary ? out.xw2.secondary.result : null,
    window: PRE_REGISTERED.XW2.window };
}

// ---- XW3: 🐚kF1kRep=0 は全 q で損失 <20% ----
out.xw3 = { rule: PRE_REGISTERED.XW3, verdict: null };
if (out.raw.neb) {
  const t = nebTable(out.raw.neb.arms.kRep0.runs);
  const worst = t.reduce((a, e) => (e.loss > a.loss ? e : a), t[0]);
  out.xw3.table = t;
  out.xw3.maxLoss = worst.loss;
  out.xw3.maxLossAtQ = worst.q;
  out.xw3.allBelowThreshold = t.every(e => e.loss < PRE_REGISTERED.XW3.threshold);
  out.xw3.verdict = { result: out.xw3.allBelowThreshold ? 'PASS' : 'FAIL',
    maxLoss: worst.loss, atQ: worst.q, threshold: PRE_REGISTERED.XW3.threshold,
    violations: t.filter(e => e.loss >= PRE_REGISTERED.XW3.threshold).map(e => ({ q: e.q, loss: e.loss })) };
}

// ---- XW4c: kF0 × kRep=0 の bit 対照(第139便と同じ対照方法)----
out.controls = { rule: PRE_REGISTERED.XW4, bitIdentity: [] };
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

// ---- XW4b: 第139便(coreshell2)と共有するグリッド点の bit 一致 ----
if (fs.existsSync(REF139) && !QUICK) {
  try {
    const ref = JSON.parse(fs.readFileSync(REF139, 'utf8'));
    const cmp = [];
    const addPair = (label, a, b, keys) => {
      if (!a || !b) return;
      cmp.push({ label, identical: pickJ(a, keys) === pickJ(b, keys) });
    };
    const sweep = (label, mine, theirs, keys) => {
      if (!mine || !theirs) return;
      for (const tag of Object.keys(mine)) if (theirs[tag]) addPair(`${label} ${tag}`, mine[tag], theirs[tag], keys);
    };
    const R = ref.raw || {};
    if (out.raw.bh1 && R.bh1) sweep('⚫kF1kRep実', out.raw.bh1.runs, R.bh1.runs, dynKeysBH);
    if (out.raw.bh2 && R.bh2) sweep('⚫kF1kRep0', out.raw.bh2.runs, R.bh2.runs, dynKeysBH);
    if (out.raw.bh3 && R.bh3) sweep('⚫kF0kRep実', out.raw.bh3.runs, R.bh3.runs, dynKeysBH);
    if (out.raw.ctl && R.ctl) sweep('⚫対照', out.raw.ctl.runs, R.ctl.runs, dynKeysBH);
    if (out.raw.neb && R.neb && R.neb.cw1) {
      sweep('🐚kF1kRep実', out.raw.neb.arms.main.runs, R.neb.cw1.arms.main.runs, dynKeysNeb);
      sweep('🐚kF1kRep0', out.raw.neb.arms.kRep0.runs, R.neb.cw1.arms.kRep0.runs, dynKeysNeb);
      sweep('🐚kF0kRep実', out.raw.neb.arms.kF0.runs, R.neb.cw1.arms.kF0.runs, dynKeysNeb);
      sweep('🐚対照', out.raw.neb.controls, R.neb.controls, dynKeysNeb);
    }
    out.crossWaveCheck = { source: 'tests/out/coreshell2-results.json(第139便)',
      note: '共有グリッド点(同一プリセット・同一 seed・同一步数・同一ノブ)の力学フィールド bit 一致。' +
        '本便で新設した掃引点(0.05 補間・R 変更・env×2)は第139便に存在しないので比較対象外',
      comparisons: cmp, nCompared: cmp.length,
      nIdentical: cmp.filter(e => e.identical).length,
      mismatches: cmp.filter(e => !e.identical).map(e => e.label),
      allIdentical: cmp.length ? cmp.every(e => e.identical) : null };
  } catch (e) { out.crossWaveCheck = { error: String(e && e.message) }; }
} else {
  out.crossWaveCheck = { source: 'tests/out/coreshell2-results.json(第139便)',
    comparisons: [], nCompared: 0, allIdentical: null,
    note: QUICK ? '煙試験(CS3_QUICK)では步数が 1/10 なので共有点照合は行わない' : '第139便の正本が見つからない' };
}

// ---- XW4a: 決定性(2回実行ビット同一)----
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
  const refPath = process.env.CS3_DET_REF;
  if (refPath) {
    // 並行実行(2プロセス同時)に備えて、参照 JSON の生成を待てるようにする(既定 0 秒 = 待たない)。
    // 待ちは determinism の記録にしか関与せず、測定値には一切触れない。
    const waitSec = Number(process.env.CS3_DET_WAIT_SEC || 0);
    const deadline = Date.now() + waitSec * 1000;
    let other = null, tries = 0;
    while (true) {
      tries++;
      if (fs.existsSync(refPath)) {
        try { other = JSON.parse(fs.readFileSync(refPath, 'utf8')); } catch { other = null; }
      }
      if (other || Date.now() > deadline) break;
      await new Promise(r => setTimeout(r, 2000));
    }
    if (other) {
      const otherJ = JSON.stringify(canonize(other.raw || {}));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = createHash('sha256').update(otherJ).digest('hex');
      rec.identical = (mine === otherJ);
      rec.readAttempts = tries;
      rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一 seed・同一窓)';
    } else {
      rec.reference = path.basename(refPath);
      rec.identical = null;
      rec.note = `参照 JSON を読めなかった(待機 ${waitSec}s・試行 ${tries} 回)`;
    }
  }
  out.determinism = rec;
}

// ---- XW4 まとめ(判定はここに集約 — 数値の実体は上のブロックにある)----
out.xw4 = {
  rule: PRE_REGISTERED.XW4,
  a_determinism: { sha256: out.determinism.sha256, reference: out.determinism.reference,
    identical: out.determinism.identical,
    result: out.determinism.identical === null ? 'PENDING(参照なし)' : (out.determinism.identical ? 'PASS' : 'FAIL') },
  b_sharedGridBitIdentity: { nCompared: out.crossWaveCheck.nCompared,
    nIdentical: out.crossWaveCheck.nIdentical === undefined ? null : out.crossWaveCheck.nIdentical,
    allIdentical: out.crossWaveCheck.allIdentical,
    result: out.crossWaveCheck.allIdentical === null ? 'INCONCLUSIVE'
      : (out.crossWaveCheck.allIdentical ? 'PASS' : 'FAIL') },
  c_kF0kRep0Control: { nPairs: out.controls.bitIdentity.length,
    allDynamicsIdentical: out.controls.allDynamicsIdentical,
    result: out.controls.allDynamicsIdentical === null ? 'INCONCLUSIVE'
      : (out.controls.allDynamicsIdentical ? 'PASS' : 'FAIL') },
};

out.meta.elapsedSec = (Date.now() - T_START) / 1000;
out.meta.sectionRuns.push({ sections: ONLY.length ? ONLY : ['(all)'], date: out.meta.date, elapsedSec: out.meta.elapsedSec });
out.meta.measurementElapsedSecTotal = out.meta.sectionRuns.reduce((a, e) => a + e.elapsedSec, 0);

// ---- 実験マニフェスト(第145便様式)----------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell3', wave: 152,
    title: 'コア外殻第3実験(しきい値非依存の q₅₀・R/r 差分検証・経路固定・決定性/対照)',
    command: 'node tests/exp-coreshell3.mjs(節選択 CS3_ONLY=… / 追記合流 CS3_MERGE=1 / 出力先 CS3_OUT=… / ' +
      '決定性参照 CS3_DET_REF=… / 煙試験 CS3_QUICK=1)' },
  presets: { mode: 'builtin', ids: ['bhCore', 'nebulaShell'],
    modifiedAtRuntime: 'kFrame / kRep / 影響範囲指数 q / core.omega 倍率 Ω_c を第135便・第139便と同一の' +
      '改変器で上書きし、本便の追加として ⚫ は bodies[0].radius(中心半径 R)を、🐚 は' +
      'エンベロープ ring の rIn/rOut(半径倍率)と保持しきい値を上書きして build する' +
      '(改変内容は各 run.cfg に記録済み)',
    note: 'seed は各プリセット定義値(⚫20260805 / 🐚20260804)をそのまま使う' },
  numerics: {
    seed: { bhCore: 20260805, nebulaShell: 20260804, note: 'プリセット定義値(改変器は seed を触らない)' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { bhCore: BH_STEPS, nebulaShell: NEB_STEPS, quick: QUICK },
    window: { bhCore: 't=96(validT・第135便/第139便と同一窓)', nebulaShell: 't=48(validT・同)' },
    warmup: NOT_APPLICABLE,
    sweeps: { qBhCore: Q_BH, qBhCoreRadiusArms: Q_BH_R, qNebulaShell: Q_NEB,
      bodyRadiusBhCore: R_BH, envelopeScaleNebulaShell: ENV_SCALES, keepRefNebulaShell: KEEP_R0 },
    q50FitGrid: Q50_GRID,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセットの初期配置・質量・seed(第135便/第139便と同一 — 本便で再フィットしない)',
      'dt=0.016', '窓(bhCore 6000步 / nebulaShell 3000步 = 第139便と同一)',
      '掃引点(⚫ q は第139便と同一の10点・R 変更アームは8点 / 🐚 q は第139便の10点+遷移帯 0.05 補間4点 / ' +
      '⚫ 中心半径 R∈{15,10,5} / 🐚 エンベロープ半径倍率∈{1,2})— すべて実測前に固定',
      'q₅₀ の当てはめ格子と INCONCLUSIVE 規則(実測前に固定)'],
    fit: [],
    derived: ['外殻損失率(xw1.arms.*.table)',
      'ロジスティック中点 q₅₀ とプラトー A,B・遷移幅 w(xw1 — 実測した損失率曲線の記述統計であり、' +
      '物理モデルの較正自由度ではない。当てはめは決定論的な閉形式+格子探索で、初期値・乱数を持たない)',
      'Δq₅₀ と予測 Δ[(3/2)(1+R/r)] の差(xw2)', '🐚kF1kRep0 の最大損失(xw3)',
      '対照の bit 一致(controls)', '決定性ハッシュ(determinism)',
      '第139便との共有点 bit 照合(crossWaveCheck)'],
    holdOut: ['予測式 q*_eff=(3/2)(1+R/r)(解析的に事前導出した外部参照値であり、本便のデータから' +
      '当てはめていない — XW2 はその差分予測に対する事後外挿テストである)',
      '臨界指数の遠方漸近値 3/2(同上)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = 本便で' +
      '新しい較正自由度を一つも導入していない',
  },
  judgement: {
    pointers: ['preRegistered', 'limits', 'xw1.summary', 'xw2.verdict', 'xw3.verdict', 'xw4',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、エンジン実測は raw、q₅₀・差分・残差と判定は ' +
      'xw1/xw2/xw3/xw4 にある。XW2 の外部解析値は予測式 q*_eff=(3/2)(1+R/r) で、その残差は ' +
      'xw2.primary.comparisons[].absDiff である',
    externalReferences: ['実効臨界指数 q*_eff=(3/2)(1+R/r)(ω_drag=(R/(R+r))^q の局所対数傾きを ' +
      'Ω_kepler の −3/2 に釣り合わせた解析的帰結)', '遠方漸近の臨界指数 3/2'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない(⚫ の relL は角運動量スケールに対する相対変化として ' +
        'raw に残るが、保存則の主張には用いていない)。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第139便との共有点 bit 一致**' +
        '(crossWaveCheck.allIdentical)・**決定性ハッシュ**(determinism.sha256)である' },
  },
  regenerationNote: 'meta.date / meta.elapsedSec / meta.mergedFrom / meta.only / meta.sectionRuns / ' +
    'meta.measurementElapsedSecTotal / determinism.readAttempts は非測定メタなので照合対象外' +
    '(determinism の正規化と同方針)',
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'meta.mergedFrom', 'meta.only', 'meta.sectionRuns',
    'meta.measurementElapsedSecTotal', 'determinism.readAttempts'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\n===== 判定(事前登録窓 — 実測後に動かさない)=====`);
log('XW1 q₅₀: ' + Object.entries(out.xw1.summary).map(([k, v]) =>
  `${k}=${fmt(v.q50, 4)}${v.result === 'OK' ? '' : '(' + v.result + ')'}`).join(' / '));
if (out.xw2.primary) {
  log('XW2 主(⚫kF1kRep実) r=' + fmt(out.xw2.primary.rCanonical, 3) + ' → ' + out.xw2.primary.result);
  for (const c of out.xw2.primary.comparisons)
    log(`   ${c.label}: Δ実測=${fmt(c.measured.delta, 4)} Δ予測=${fmt(c.predicted.delta, 4)} ` +
      `符号一致=${c.signMatch} |差|=${fmt(c.absDiff, 4)} → ${c.result}`);
}
if (out.xw2.secondary) {
  const c = out.xw2.secondary.comparison;
  log(`XW2 副(🐚) ${c.label}: Δ実測=${fmt(c.measured.delta, 4)} Δ予測=${fmt(c.predicted.delta, 4)} ` +
    `符号一致=${c.signMatch} |差|=${fmt(c.absDiff, 4)} → ${c.result}`);
}
if (out.xw3.verdict) log(`XW3 🐚kF1kRep0 最大損失=${fmt(out.xw3.verdict.maxLoss, 4)}(q=${out.xw3.verdict.atQ}) → ${out.xw3.verdict.result}`);
log(`XW4a 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical}`);
log(`XW4b 第139便 共有点 bit 一致 ${out.xw4.b_sharedGridBitIdentity.nIdentical}/${out.xw4.b_sharedGridBitIdentity.nCompared} → ${out.xw4.b_sharedGridBitIdentity.result}`);
log(`XW4c kF0×kRep0 対照 allDynamicsIdentical=${out.controls.allDynamicsIdentical} → ${out.xw4.c_kF0kRep0Control.result}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();

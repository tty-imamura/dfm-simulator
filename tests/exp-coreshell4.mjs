// 第154便 exp-coreshell4.mjs — コア外殻第4実験(事前登録窓 YW1〜YW4 の実行)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs →
//   第152便 tests/exp-coreshell3.mjs の続き。**第152便の XW2 FAIL を設計側で解き直す便**である。
//
// 第152便の実測(tests/out/coreshell3-results.json — 本便は 1 bit も書き換えない):
//   XW2 主(⚫kF1kRep実)は **FAIL**。Δq₅₀ 実測 +0.035(R15→10)・+0.025(R15→5)に対し
//   予測 Δ[(3/2)(1+R/r)] は −0.042・−0.084 で **符号が反対**(|差| は 0.077・0.109 で許容内)。
//   実測後の post-hoc 診断が2つの候補を挙げた:
//     ① **格子の非対称**: 基準アーム(R=15)は10点格子・R 変更アームは8点格子で当てはめていた。
//        両者に共通する7点へ制限して当てはめ直すと基準の q₅₀ は 1.7125→1.7575 へ動き、
//        Δ は −0.010・−0.020 と**符号が反転して予測と一致**した(= 符号は格子差で決まっていた)。
//     ② **振った R が支配的でない**: ⚫ の外殻位置に届く引きずりは 2 項の和で、
//        基底スピン項 s·(R/(R+d))^q(核 = 振った R)と コア差動項 (Mc/m)(Ω_c−s)·(Rc/(Rc+d))^q
//        (核 = Rc、プリセット実値 7.5 — 第152便では**振っていない**)。実測比 coreOverBase は
//        r≈181 で 14.8(R=15,q=1.5)〜85.5(R=5,q=2.0)で、コア差動項が一桁以上支配的だった。
//
// 本便(第154便)の設計上の解:
//   ①への解 = **全アームを同一の11点格子 q=1.0,1.1,…,2.0(×0.1・補間なし)で実測する**。
//     q₅₀ は同一格子上のロジスティック当てはめ(第152便と同一の当てはめ関数)のみで得る。
//     アーム間で格子点を一切変えないので、格子の非対称は原理的に発生しない。
//   ②への解 = **R と Rc を同率で振る「同率スイープ」を主アームにする**。(R,Rc)=(15,7.5) を基準に
//     (10,5)・(5,2.5) — 両方の引きずり核が同率で縮むので、支配項がどちらであっても
//     「核の縮小」という同じ向きの変化を受ける。R だけを振った (10,7.5)・(5,7.5) は
//     **R単独対照**として同じ格子で併走させ、①②の切り分け材料を記述統計として残す。
//
// 事前登録(統括が実測前に固定 — 実測後に動かさない。FAIL は FAIL のまま記録する):
//   YW1(主窓): 同率アーム2点それぞれで Δq₅₀ を Δ[(3/2)(1+R/r)] と比較する
//     (R は S.R[0]・r は実測)。窓 = **符号一致 かつ |Δ実測−Δ予測| ≤ 0.15**。
//     参考予測(r=178.26 なら R15→10: −0.042・R15→5: −0.084)。実測 r で再計算して収載する。
//   YW2(副窓): 🐚 エンベロープ半径 ×1→×2 の Δq₅₀ を Δ[(3/2)(1+R/r)](r は各構成の実測
//     エンベロープ平均半径)と比較する。窓 = 符号一致 かつ |差| ≤ 0.15。
//   YW3(記述 — 窓なし): R単独対照2点の Δq₅₀ と、各アームの core/base 引きずり比
//     (第152便 postHoc と同じ定義)を収載する。**判定には使わない**。
//   YW4(決定性・整合): (a) 全体2回実行(別プロセス)で結果 JSON(volatile 除く)正準化 SHA 一致
//     (b) 第152便と設定・格子点が一致する走行(⚫基準アームと 🐚×1/×2 の 0.1 格子点)の raw 値 bit 一致
//     (c) kF0×kRep=0 の bit 対照を再実施。
//
// 手法は第135便→第139便→第152便の踏襲(測定器・帯定義・逃散/落下しきい値・seed・步数・窓):
//   ⚫bhCore  : seed 20260805・6000步(validT=96)・外殻 = ①降着円盤ガス 120体(esc r>200 / fall r<30)
//               ②恒星ディスク 200体(esc r>450 / fall r<30)。損失率 = 両帯の(逃散+落下)/320
//   🐚nebulaShell: seed 20260804・3000步(validT=48)・外殻 = 低スピン放射エンベロープ 44体
//               (index 54..97)・保持 = クランプ重心から r<300(×2 構成では r<600)
//   dt=0.016(全構成共通)。数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// 本便が触るノブ(第152便の改変器に Rc を1つ足しただけ。既定値では 1 bit も変えない):
//   ⚫ rAbs  : bodies[0].radius(中心の半径 R。プリセット実値 15)を上書きする。
//   ⚫ rcAbs : bodies[0].core.radius(コア半径 Rc。プリセット実値 7.5)を上書きする(**本便の新規**)。
//             Rc は ①コア差動項の引きずり核 (Rc/(Rc+d))^q ②コアの慣性 I_c=½·M_c·Rc²
//             (= 初期 J_core=I_c·Ω_c。Ω_c(0)=20 は Rc に依らないが、τ_cs による放出の速さは変わる)
//             の両方に効く(index.html の core.radius の定義そのもの)。
//   🐚 envScale/keepR : エンベロープ ring の rIn/rOut を一律倍率で振る(半径の相似拡大)。
//             vMode="kepler" なので初速は新半径で解析再計算される。保持しきい値も同じ倍率で拡大する。
//   **上書きはプリセット実値と異なる場合にのみ行う**(実値と同じなら上書きを省く)。これにより
//   基準アーム・R単独対照アーム・🐚 の各走行は第152便の対応走行と build が完全に同一になり、
//   YW4b の bit 一致照合が意味を持つ。
//
// トイ単位の限界(第135便・第139便・第152便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R・Rc・r・Ω_c の絶対値は当該サンプルの単位系に閉じた値である。
//   窓(步数)は各サンプルの validT に一致させた有限窓で、窓外の長時間挙動は測っていない。粒子数は
//   320(⚫)/98(🐚)の小標本で、損失率・保持率の分解能はそれぞれ 1/320・1/44 に制限される。
//
// 実行:
//   node tests/exp-coreshell4.mjs                        … 全節(既定)
//   CS4_ONLY=bh,neb,ctl node tests/...                   … 節を選択実行
//   CS4_MERGE=1 CS4_ONLY=neb node tests/...              … 既存 JSON へ節を追記合流
//   CS4_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS4_DET_REF=/path/run1.json [CS4_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//                                                          (WAIT_SEC は並行実行時に参照側の生成を待つ秒数)
//   CS4_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用・本番数値ではない)
// 出力: tests/out/coreshell4-results.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.CS4_OUT ? path.resolve(process.env.CS4_OUT)
  : path.join(OUT_DIR, 'coreshell4-results.json');
const REF152 = path.join(OUT_DIR, 'coreshell3-results.json');   // 第152便の実測正本(共有点の bit 照合)

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS4_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS4_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(統括が実測前に固定 — 実測後に動かさない) =================
const PRE_REGISTERED = {
  fixedBy: '統括(第152便 XW2 FAIL の再設計として第154便で固定)', fixedBefore: '実測',
  designPrinciples: {
    uniformGrid: '**全アームを同一の11点格子 q = 1.0, 1.1, …, 2.0(×0.1・補間なし)で実測する**。' +
      'q₅₀ は同一格子上のロジスティック当てはめ(第152便 exp-coreshell3 と同一の当てはめ関数・' +
      '同一の当てはめ格子・同一の INCONCLUSIVE 規則)のみで得る。アーム間で格子点を一切変えない — ' +
      '第152便 post-hoc 診断①(基準10点格子 vs 変更8点格子の非対称が Δq₅₀ の符号を反転させうる)' +
      'への設計上の解である',
    proportionalSweep: '**R と Rc を同率で振る**。第152便 post-hoc 診断②(⚫ の外殻位置での引きずりは ' +
      '基底スピン項〔核 R〕とコア差動項〔核 Rc〕の和で、実測比 coreOverBase は 14.8〜85.5 = ' +
      'コア差動項が支配的。R だけ振っても総量はほとんど動かない)への設計上の解。' +
      '同率スイープでは両方の核が同率で縮むので、支配項がどちらでも同じ向きの変化を受ける',
    wave152Untouched: '第152便(coreshell3)の窓・データは一切変更しない。本便は新規ファイルとして' +
      '独立に走り、第152便の JSON は読み取り専用の bit 照合参照としてのみ使う',
  },
  YW1: {
    role: '主窓',
    question: '同率アーム2点それぞれで Δq₅₀ を Δ[(3/2)(1+R/r)] と比較する(R は S.R[0]・r は実測)',
    window: '**符号一致 かつ |Δ実測−Δ予測| ≤ 0.15**',
    tolerance: 0.15,
    arms: '基準 (R,Rc)=(15,7.5) → 同率 (10,5) / 同率 (5,2.5)(いずれも ⚫kF1kRep実)',
    prediction: 'q*_eff = (3/2)(1+R/r)(遠方漸近 3/2 の有限 r 補正。' +
      'ω_drag=(R/(R+r))^q の局所対数傾き −q·r/(R+r) を Ω_kepler の −3/2 に釣り合わせた実効臨界指数)',
    referencePrediction: '参考予測(r=178.26 の場合): R15→10 で −0.042・R15→5 で −0.084。' +
      '**実測 r で再計算した値を yw1.comparisons[].predicted.delta に収載する**(参考値は窓判定に使わない)',
    RrMapping: {
      R: 'R = S.R[0](= bodies[0].radius。プリセット実値 15)',
      r: 'r = 恒星帯(外殻・200体)の初期平均半径(エンジン実測。第152便 canonicalr と同一定義)',
      note: '同率スイープでは Rc も (R/15)倍で振るが、**予測式に入るのは R のみ**である' +
        '(予測式は基底スピン項の核 R について書かれた式であり、本便はその式を変えない)',
    },
    deltaConvention: 'Δ = (振った構成) − (基準構成)',
    inconclusiveRule: 'いずれかのアームの q₅₀ が当てはめの INCONCLUSIVE 規則(振幅 A−B < 0.20 または ' +
      'q₅₀ が掃引範囲 ±0.25 の外)に掛かった場合は INCONCLUSIVE として PASS/FAIL を主張しない',
  },
  YW2: {
    role: '副窓',
    question: '🐚 エンベロープ半径 ×1→×2 の Δq₅₀ を Δ[(3/2)(1+R/r)] と比較する' +
      '(r は各構成の実測エンベロープ平均半径)',
    window: '符号一致 かつ |Δ実測−Δ予測| ≤ 0.15',
    tolerance: 0.15,
    RrMapping: {
      R: 'R = R̄ = クランプ 54体の粒子半径 R の平均(第139便・第152便 nebDragProbe の RbarClump)',
      r: 'r = エンベロープの平均半径(同 envMeanR)。×2 構成では実測し直す',
    },
    deltaConvention: 'Δ = (×2 構成) − (×1 構成)',
  },
  YW3: {
    role: '記述(窓なし — 判定には使わない)',
    question: 'R単独対照2点 (R,Rc)=(10,7.5)・(5,7.5) の Δq₅₀ と、各アームの core/base 引きずり比を収載する',
    coreOverBaseDefinition: '第152便 postHoc と同じ定義: 正準の参照半径 r に最も近い影響範囲プロファイル ' +
      'bin での omCoreAnalytic / omBaseAnalytic。omBaseAnalytic = 基底スピン項 s·(R/(R+r))^q・' +
      'omCoreAnalytic = コア差動項 (Mc/m)(Ω_c−s)·(Rc/(Rc+r))^q',
    note: '**判定には使わない**。同率スイープ(YW1)と R単独対照の Δq₅₀ を並べることで、' +
      '第152便の符号反転が格子起因(①)だったのか Rc 支配(②)だったのかを読む材料にする',
  },
  YW4: {
    role: '窓(決定性・整合)',
    a: '全体を2回実行(別プロセス)し結果 JSON(volatile 除く)の正準化 SHA 一致',
    b: '第152便(coreshell3)と設定・格子点が一致する走行(**⚫基準アームと 🐚×1/×2 の 0.1 格子点**)の ' +
      'raw 値 bit 一致。R単独対照アーム・対照アームの照合も同じ方法で行うが、窓の本体は上記の名指し集合である',
    c: 'kF0×kRep=0 の bit 対照を再実施(⚫ と 🐚 の双方)',
    controlRule: 'kFrame=0(引きずり経路を閉じる)かつ kRep=0(E5′ スピン斥力経路を閉じる)なら、' +
      'q や Ω_c を振っても外殻の力学は 1 bit も変わらないはず',
    comparedFields: '力学フィールド(⚫: series/final/outerVt/nOuter/n/nan/clamp* ・🐚: clump/envelope/n/nan/clamp*)' +
      'の JSON 完全一致。コア状態(coreOm0/coreOm1/shellSpin1 等)は Ω_c を振れば当然変わるので比較対象から' +
      '外し、q 対については全フィールド一致も併記する(第139便・第152便と同じ対照方法)',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R・Rc・r・Ω_c の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  windows: {
    bhCore: { steps: 6000, validT: 96, note: '第135便・第139便・第152便・exp-4-81 と同一窓。窓外の長時間挙動は測っていない' },
    nebulaShell: { steps: 3000, validT: 48, note: '第135便・第139便・第152便と同一窓。窓外の長時間挙動は測っていない' },
  },
  seeds: { bhCore: 20260805, nebulaShell: 20260804,
    note: 'seed はプリセット定義値。build がそれを使うので構成間で同一 — 構成差はすべてノブ差である' },
  sampleSize: {
    bhCore: 'ガス 120体 + 恒星 200体 = 320(損失率の分解能 1/320 ≈ 0.0031)',
    nebulaShell: 'エンベロープ 44体(保持率の分解能 1/44 ≈ 0.0227)+ クランプ 54体',
  },
  q50Resolution: 'q₅₀ の当てはめ格子は 0.0025 刻み。掃引点の刻み(0.1)より細かいが、' +
    '**q₅₀ の実質的な分解能を決めるのは掃引点の刻み(0.1)と損失率の粒度**(1/320・1/44)であり、' +
    '格子刻みではない。したがって |Δ実測| が 0.1 を下回る領域では Δq₅₀ の符号そのものが' +
    '掃引刻みの分解能限界に近い — 窓の PASS/FAIL はこの限界の上で読むこと',
  proportionalSweepCaveat: '同率スイープは R と Rc を同率で振るので、**引きずり核の縮小以外の寄与も同時に動く**: ' +
    'R は中心天体の慣性 I=½mR²・接触半径・温度・扁平率に、Rc はコアの慣性 I_c=½M_cRc²(= τ_cs による ' +
    '角運動量放出の速さ)に効く。これらは差分では相殺されない系統であり、Δq₅₀ には引きずり核の' +
    '形状変化以外の寄与も混じりうる(限界として明記する)',
  amplitudeCaveat: 'R・Rc を下げると (R/(R+r))^q・(Rc/(Rc+r))^q の**振幅**も同時に下がる' +
    '(局所対数傾きの変化とは別の効果)。q*_eff=(3/2)(1+R/r) は傾きの釣り合いだけを述べる式で、' +
    '振幅の変化を含まない。両者が同符号に効くか否かは実測が決めることであり、本便は窓を動かさず記録する',
  gridUniformityNote: '本便の設計上の要点は「全アーム同一格子」である。第152便で符号を左右した格子非対称' +
    '(基準10点 vs 変更8点)は本便では原理的に起きないが、**11点格子そのものの選び方**' +
    '(1.0〜2.0・0.1 刻み)は依然として設計選択であり、別の格子なら別の q₅₀ が出うる',
  nebEnvelopeCaveat: '🐚 のエンベロープ半径を×2 すると、保持しきい値も×2(r<600)にする。' +
    'ケプラー初速は新半径で再計算されるが、クランプ質量・エンベロープ質量・粒子数は不変である',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ============================ 測定器(第152便 exp-coreshell3.mjs から踏襲) ====================
// A) ⚫bhCore — 第152便 measureBH と同一(帯定義・しきい値・スナップ数 NS=4・返却フィールドすべて同一)。
//    本便の追加は o.rcAbs(bodies[0].core.radius = コア半径 Rc の上書き)のみ。未指定なら 1 bit も変わらない。
const measureBH = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'bhCore')));
  const OM0 = p.bodies[0].core.omega, S0 = p.bodies[0].spin, Q0 = p.physics.q, KCS0 = p.bodies[0].core.Kcs;
  const R0P = p.bodies[0].radius, RC0P = p.bodies[0].core.radius;
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) p.bodies[0].core.omega = OM0 * o.omMul;
  if (o.kcs !== undefined) p.bodies[0].core.Kcs = o.kcs;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.kRep !== undefined) p.physics.kRep = o.kRep;
  if (o.rAbs !== undefined && o.rAbs !== null) p.bodies[0].radius = o.rAbs;
  if (o.rcAbs !== undefined && o.rcAbs !== null) p.bodies[0].core.radius = o.rcAbs;
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
      KcsRef: KCS0, qRef: Q0, bodyRadius: p.bodies[0].radius, bodyRadiusRef: R0P,
      coreRadius: p.bodies[0].core.radius, coreRadiusRef: RC0P, steps },
    series, final: series[series.length - 1],
    outerVt: c2 ? sum / c2 : 0, nOuter: c2,
    coreOm0: cs0 ? cs0.omega : null, coreOm1: cs1 ? cs1.omega : null,
    shellSpin1: S.spin[0], n: S.n,
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, clampR: S.clampRN || 0 };
}, mod);

// B) 🐚nebulaShell — 第152便 measureNeb と同一(o.envScale = エンベロープ ring 半径の倍率、
//    o.keepR = 保持しきい値。既定 keepR=300 で第152便と 1 bit も変わらない)
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

// C) ⚫ 幾何プローブ(第152便 bhGeom と同一 + o.rcAbs)。R・Rc と参照半径 r を build 直後(step 前)に読む。
//    初期配置が R・Rc に依存しないこと(insideBig は radiusScale·rMul·√m を使い b.radius / core.radius を
//    見ない)を位置指紋の一致で実測確認する。
const bhGeom = (rAbs, rcAbs) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(z => z.id === 'bhCore')));
  if (o.rAbs !== undefined && o.rAbs !== null) p.bodies[0].radius = o.rAbs;
  if (o.rcAbs !== undefined && o.rcAbs !== null) p.bodies[0].core.radius = o.rcAbs;
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
  let fp = 0;
  for (let i = 0; i < S.n; i++) fp = (fp * 31 + Math.round((S.x[i] + S.y[i]) * 1e6)) % 2147483647;
  return { R0: S.R[0], Rc: S.RcV[0], coreMassFrac: S.coreMF[0], coreJ0: S.coreJ[0],
    m0: S.m[0], q: S.params.q, G: S.params.G,
    softening: S.params.softening, D0: S.params.D0, n: S.n,
    gas: bandStat(GAS_LO, GAS_HI), star: bandStat(STA_LO, STA_HI),
    positionFingerprint: fp };
}, { rAbs: rAbs === undefined ? null : rAbs, rcAbs: rcAbs === undefined ? null : rcAbs });

// D) ⚫ 影響範囲プローブ — 第152便 profileOf と同一(+ o.rcAbs)
const profileOf = (id, mod) => page.evaluate(({ id, o }) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === id)));
  p.physics.kFrame = 1;
  if (o.q !== undefined) p.physics.q = o.q;
  if (o.omMul !== undefined) for (const b of p.bodies) if (b.core) b.core.omega = b.core.omega * o.omMul;
  if (o.spin !== undefined) p.bodies[0].spin = o.spin;
  if (o.rAbs !== undefined && o.rAbs !== null) p.bodies[0].radius = o.rAbs;
  if (o.rcAbs !== undefined && o.rcAbs !== null) p.bodies[0].core.radius = o.rcAbs;
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

// E) 🐚 引きずりプローブ — 第152便 nebDragProbe と同一
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

// ==================== q₅₀(ロジスティック中点)の当てはめ — 第152便と同一の関数 ================
// loss(q) = B + (A − B)/(1 + exp((q − q₅₀)/w))
//   (q₅₀, w) を決定論的な格子で全探索し、各格子点で (A,B) を線形最小二乗の閉形式で解く。
//   反復解法・乱数・初期値依存を一切持たない(同じ入力なら常に同じ出力 = 決定性の要求を満たす)。
//   **本便では全アームが同一の11点格子なので、当てはめの入力点数もアーム間で同一である。**
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

// 有限 r 補正つき実効臨界指数(第139便 post-hoc → 第152便 XW2 の式をそのまま使う)
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

const out = { meta: { exp: 'coreshell4', wave: 154, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第152便 tests/exp-coreshell3.mjs(測定器・帯定義・窓・seed・步数・q₅₀ 当てはめ関数を踏襲)' +
      ' / 第139便 tests/exp-coreshell2.mjs / 第135便 tests/exp-coreshell.mjs(原型)',
    redesignOf: '第152便 XW2 FAIL の再設計。第152便の窓・データは一切変更していない' +
      '(tests/out/coreshell3-results.json は読み取り専用の bit 照合参照としてのみ使う)',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS, raw: {} };
out.meta.sectionRuns = [];
if (process.env.CS4_MERGE && fs.existsSync(OUT_PATH)) {
  const prev = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  out.raw = prev.raw || {};
  out.meta.sectionRuns = (prev.meta && prev.meta.sectionRuns) ? prev.meta.sectionRuns.slice() : [];
}

// ---- 掃引点・アーム(実測前に固定)----
// **全アーム同一の11点格子**(補間なし)。第152便 Q_BH(10点)・Q_NEB(14点)・Q_BH_R(8点)の
// 非対称を排すのが本便の設計上の要点である。q=1.1 以外の10点は第152便 Q_BH と同一の literal なので、
// 基準アーム・R単独対照アーム・🐚 の対応走行は第152便と bit 一致する(YW4b)。
const Q_GRID = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
const BH_PRESET_R = 15, BH_PRESET_RC = 7.5;   // index.html bhCore bodies[0] のプリセット実値
// 上書きはプリセット実値と異なる場合にのみ行う(実値と同じ値を代入しても build 結果は同一だが、
// 上書きを省くことで第152便の対応走行と**呼び出しまで同一**になり bit 一致の意味が明確になる)
const ovR = (R) => (R === BH_PRESET_R ? null : R);
const ovRc = (Rc) => (Rc === BH_PRESET_RC ? null : Rc);
const BH_ARMS = [
  { key: 'base', R: 15, Rc: 7.5, group: 'base',
    label: '⚫kF1kRep実 基準 (R,Rc)=(15,7.5)' },
  { key: 'prop_R10Rc5', R: 10, Rc: 5, group: 'proportional',
    label: '⚫kF1kRep実 同率 (R,Rc)=(10,5)' },
  { key: 'prop_R5Rc2p5', R: 5, Rc: 2.5, group: 'proportional',
    label: '⚫kF1kRep実 同率 (R,Rc)=(5,2.5)' },
  { key: 'ronly_R10', R: 10, Rc: 7.5, group: 'radiusOnly',
    label: '⚫kF1kRep実 R単独対照 (R,Rc)=(10,7.5)' },
  { key: 'ronly_R5', R: 5, Rc: 7.5, group: 'radiusOnly',
    label: '⚫kF1kRep実 R単独対照 (R,Rc)=(5,7.5)' },
];
const ENV_SCALES = [1, 2];         // 🐚 エンベロープ半径倍率
const KEEP_R0 = 300;               // 🐚 保持しきい値(×1)。倍率とともに拡大する
const BH_STEPS = SC(6000), NEB_STEPS = SC(3000);
const PROFILE_QS = [1.5, 2.0];     // YW3 の引きずり内訳を読む q(第152便 postHoc と同じ2点)
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
  log(`[⚫ ${tag.padEnd(12)}] loss=${fmt(bhLoss(f), 4)} (gas ${fmt(f.gas.escFrac + f.gas.fallFrac, 3)} / star ${fmt(f.star.escFrac + f.star.fallFrac, 3)}) R=${r.cfg.bodyRadius} Rc=${r.cfg.coreRadius} σ/r star=${fmt(f.star.sdOverMean, 3)} NaN=${r.nan} (${r.elapsedSec.toFixed(1)}s)`);
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

// ---- 節 bh: ⚫ 5アーム(基準・同率×2・R単独対照×2)を同一の11点格子で実測 ----
if (doSec('bh')) {
  const geom = {}, arms = {}, profiles = {};
  log(`\n===== ⚫bhCore 幾何プローブ(${BH_ARMS.length} 構成)=====`);
  for (const a of BH_ARMS) {
    const g = await bhGeom(ovR(a.R), ovRc(a.Rc));
    geom[a.key] = g;
    log(`  ${a.key.padEnd(13)} S.R[0]=${g.R0} Rc=${g.Rc} 恒星帯⟨r⟩=${fmt(g.star.meanR, 3)} ガス帯⟨r⟩=${fmt(g.gas.meanR, 3)} J_core(0)=${fmt(g.coreJ0, 3)} 配置指紋=${g.positionFingerprint}`);
  }
  for (const a of BH_ARMS) {
    const runs = {};
    log(`\n===== ⚫bhCore ${a.label}: ${Q_GRID.length} 構成 × ${BH_STEPS}步 =====`);
    for (const q of Q_GRID) await runBH(tagQ(q), { kFrame: 1, q, rAbs: ovR(a.R), rcAbs: ovRc(a.Rc) }, runs);
    arms[a.key] = { arm: { kFrame: 1, kRep: '実値(1)', bodyRadius: a.R, coreRadius: a.Rc,
      group: a.group, label: a.label }, grid: Q_GRID, runs };
  }
  log(`\n===== ⚫bhCore 影響範囲プローブ(YW3 の core/base 内訳・q=${PROFILE_QS.join(',')})=====`);
  for (const a of BH_ARMS) for (const q of PROFILE_QS)
    profiles[`${a.key}_${tagQ(q)}`] = await profileOf('bhCore', { q, rAbs: ovR(a.R), rcAbs: ovRc(a.Rc) });
  out.raw.bh = { steps: BH_STEPS, grid: Q_GRID, armDefs: BH_ARMS, presetR: BH_PRESET_R,
    presetRc: BH_PRESET_RC, profileQs: PROFILE_QS, geom, arms, profiles };
}

// ---- 節 neb: 🐚 エンベロープ半径 ×1 / ×2 を同一の11点格子で実測(+ 引きずりプローブ・対照)----
if (doSec('neb')) {
  const env1 = {}, env2 = {};
  log(`\n===== 🐚nebulaShell kF1·kRep実(0.3)·env×1: ${Q_GRID.length} 構成 × ${NEB_STEPS}步 =====`);
  for (const q of Q_GRID) await runNeb(tagQ(q), { kFrame: 1, q }, env1);
  log(`\n===== 🐚nebulaShell kF1·kRep実(0.3)·env×2(保持しきい値も×2 = r<600): ${Q_GRID.length} 構成 =====`);
  for (const q of Q_GRID) await runNeb(tagQ(q), { kFrame: 1, q, envScale: 2, keepR: KEEP_R0 * 2 }, env2);
  const dragProbes = {};
  for (const s of ENV_SCALES) dragProbes['env' + s] = await nebDragProbe(null, s);
  log('[🐚 引きずりプローブ(エンベロープ平均)]');
  for (const [k, pr] of Object.entries(dragProbes))
    log(`  ${k} q=${pr.q} R̄=${fmt(pr.RbarClump, 4)} ⟨r⟩=${fmt(pr.envMeanR, 3)} Ω_drag/Ω_kep=${fmt(pr.meanDragOverKepler, 5)}`);

  const ctl = {};
  log(`\n===== YW4c 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照)=====`);
  await runNeb('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl);
  await runNeb('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl);
  await runNeb('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl);
  await runNeb('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl);

  out.raw.neb = { steps: NEB_STEPS, grid: Q_GRID, keepR0: KEEP_R0, envScales: ENV_SCALES,
    arms: { env1: { cfg: { kFrame: 1, kRep: '実値(0.3)', envScale: 1, keepR: KEEP_R0 }, runs: env1 },
      env2: { cfg: { kFrame: 1, kRep: '実値(0.3)', envScale: 2, keepR: KEEP_R0 * 2 }, runs: env2 } },
    dragProbes, controls: ctl };
}

// ---- 節 ctl: YW4c ⚫ 対照(kFrame=0 × kRep=0 の bit 一致)----
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== YW4c 対照 / ⚫bhCore kFrame=0 × kRep=0(bit 一致対照)=====`);
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
  ({ tag, q: r.cfg.q, bodyRadius: r.cfg.bodyRadius, coreRadius: r.cfg.coreRadius, loss: bhLoss(r.final),
    lossGas: r.final.gas.escFrac + r.final.gas.fallFrac,
    lossStar: r.final.star.escFrac + r.final.star.fallFrac })).sort((a, b) => a.q - b.q);
const nebTable = (runs) => Object.entries(runs).map(([tag, r]) =>
  ({ tag, q: r.cfg.q, envScale: r.cfg.envScale, keepR: r.cfg.keepR, loss: nebLoss(r),
    keepFrac: r.envelope.keepFrac, boundFrac: r.envelope.boundFrac,
    clumpKeepFrac: r.clump.keepFrac })).sort((a, b) => a.q - b.q);

// ---- 全アームの q₅₀(同一の11点格子・同一の当てはめ関数)----
out.q50 = { grid: Q_GRID, fitGrid: Q50_GRID,
  note: '**全アームが同一の11点格子**(q=1.0〜2.0・0.1 刻み・補間なし)で実測され、' +
    '同一のロジスティック当てはめ関数で q₅₀ を得ている。アーム間で格子点は 1 点も違わない',
  arms: {} };
{
  const put = (key, label, table, group) => {
    out.q50.arms[key] = { label, group, table, fit: fitLogisticQ50(table) };
  };
  if (out.raw.bh) for (const a of BH_ARMS) {
    const arm = out.raw.bh.arms[a.key];
    if (arm) put(a.key, a.label, bhTable(arm.runs), a.group);
  }
  if (out.raw.neb) {
    put('neb_env1', '🐚kF1kRep実(env×1)', nebTable(out.raw.neb.arms.env1.runs), 'nebulaEnvelope');
    put('neb_env2', '🐚kF1kRep実(env×2)', nebTable(out.raw.neb.arms.env2.runs), 'nebulaEnvelope');
  }
  out.q50.summary = Object.fromEntries(Object.entries(out.q50.arms).map(([k, a]) =>
    [k, { label: a.label, group: a.group, q50: a.fit.q50, result: a.fit.result, width: a.fit.width,
      plateaus: [a.fit.plateauLowQ, a.fit.plateauHighQ], rmse: a.fit.rmse, nPoints: a.fit.nPoints,
      crossing0p5LinearInterp: a.fit.crossing0p5LinearInterp }]));
  out.q50.allArmsSameGrid = Object.values(out.q50.arms).every(a =>
    a.table.length === Q_GRID.length &&
    a.table.every((e, i) => Math.abs(e.q - Q_GRID[i]) < 1e-12));
}

// 共通の比較器(YW1・YW2・YW3 で同じ式・同じ規則を使う)
const compareDelta = (label, R_ref, r_ref, q50_ref, R_var, r_var, q50_var, tolerance) => {
  const dPred = qEffCritical(R_var, r_var) - qEffCritical(R_ref, r_ref);
  if (q50_ref === null || q50_var === null) return { label, result: 'INCONCLUSIVE',
    note: 'いずれかのアームの q₅₀ が事前登録の INCONCLUSIVE 規則に掛かった',
    geometry: { R_ref, r_ref, R_var, r_var, RoverR_ref: R_ref / r_ref, RoverR_var: R_var / r_var },
    predicted: { qEffRef: qEffCritical(R_ref, r_ref), qEffVar: qEffCritical(R_var, r_var), delta: dPred },
    measured: { q50Ref: q50_ref, q50Var: q50_var, delta: null },
    signMatch: null, absDiff: null, tolerance, withinTolerance: null };
  const dMeas = q50_var - q50_ref;
  const sgn = (v) => (Math.abs(v) < 1e-12 ? 0 : Math.sign(v));
  const signMatch = (sgn(dPred) !== 0) && (sgn(dPred) === sgn(dMeas));
  const absDiff = Math.abs(dMeas - dPred);
  const within = absDiff <= tolerance;
  return { label,
    geometry: { R_ref, r_ref, R_var, r_var, RoverR_ref: R_ref / r_ref, RoverR_var: R_var / r_var },
    predicted: { qEffRef: qEffCritical(R_ref, r_ref), qEffVar: qEffCritical(R_var, r_var), delta: dPred },
    measured: { q50Ref: q50_ref, q50Var: q50_var, delta: dMeas },
    signMatch, absDiff, tolerance, withinTolerance: within,
    result: (signMatch && within) ? 'PASS' : 'FAIL' };
};
const q50Of = (k) => (out.q50.arms[k] ? out.q50.arms[k].fit.q50 : null);

// ---- YW1(主窓): 同率アーム2点の Δq₅₀ vs Δ[(3/2)(1+R/r)] ----
out.yw1 = { rule: PRE_REGISTERED.YW1, comparisons: [], verdict: null };
if (out.raw.bh && out.q50.arms.base) {
  const g = out.raw.bh.geom;
  const rOf = (k) => g[k].star.meanR;          // 正準の r = 恒星帯(200体)の初期平均半径(エンジン実測)
  const RRef = g.base.R0, rRef = rOf('base');
  const rows = [];
  for (const a of BH_ARMS.filter(x => x.group === 'proportional')) {
    rows.push(Object.assign(
      compareDelta(`⚫ (R,Rc)=(15,7.5) → (${a.R},${a.Rc})`, RRef, rRef, q50Of('base'),
        g[a.key].R0, rOf(a.key), q50Of(a.key), PRE_REGISTERED.YW1.tolerance),
      { armKey: a.key, RcRef: g.base.Rc, RcVar: g[a.key].Rc,
        note: '予測式に入るのは R のみ(Rc は同率で振ってあるが式には現れない)' }));
  }
  // 位置指紋の一致 = 初期配置が R・Rc に依存しないことの bit 証拠(r が全アームで同一である根拠)
  const geomSame = Object.values(g).every(e =>
    e.positionFingerprint === g.base.positionFingerprint && e.star.meanR === g.base.star.meanR);
  out.yw1.canonicalR = 'S.R[0](= bodies[0].radius)';
  out.yw1.canonicalr = '恒星帯(外殻200体)の初期平均半径(エンジン実測。第152便 canonicalr と同一定義)';
  out.yw1.rCanonical = rRef;
  out.yw1.initialGeometryIndependentOfRandRc = geomSame;
  out.yw1.initialGeometryNote = '初期配置が R・Rc に依存しないこと(insideBig は radiusScale·rMul·√m を使い ' +
    'b.radius / core.radius を見ない)の実測確認。true なら全アームの r は同一値であり、Δ予測は R の差だけで決まる';
  out.yw1.referencePredictionCheck = {
    note: '事前登録の参考予測(r=178.26 での −0.042 / −0.084)と、実測 r で再計算した予測の対照。' +
      '窓判定は**実測 r で再計算した予測**のみで行う',
    atR178p26: [{ from: 15, to: 10, delta: qEffCritical(10, 178.26) - qEffCritical(15, 178.26) },
      { from: 15, to: 5, delta: qEffCritical(5, 178.26) - qEffCritical(15, 178.26) }],
    atMeasuredR: rows.map(e => ({ label: e.label, delta: e.predicted.delta })),
  };
  out.yw1.comparisons = rows;
  out.yw1.verdict = { window: PRE_REGISTERED.YW1.window,
    result: rows.length ? (rows.every(e => e.result === 'PASS') ? 'PASS'
      : (rows.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE' : 'FAIL')) : null,
    perComparison: rows.map(e => ({ label: e.label, deltaMeasured: e.measured.delta,
      deltaPredicted: e.predicted.delta, signMatch: e.signMatch, absDiff: e.absDiff, result: e.result })) };
}

// ---- YW2(副窓): 🐚 エンベロープ半径 ×1→×2 ----
out.yw2 = { rule: PRE_REGISTERED.YW2, comparison: null, verdict: null };
if (out.raw.neb && out.raw.neb.dragProbes) {
  const p1 = out.raw.neb.dragProbes.env1, p2 = out.raw.neb.dragProbes.env2;
  const row = compareDelta('🐚 エンベロープ半径 ×1 → ×2', p1.RbarClump, p1.envMeanR, q50Of('neb_env1'),
    p2.RbarClump, p2.envMeanR, q50Of('neb_env2'), PRE_REGISTERED.YW2.tolerance);
  out.yw2.canonicalR = 'R̄ = クランプ54体の粒子半径の平均(RbarClump・引きずりプローブ実測)';
  out.yw2.canonicalr = 'エンベロープの平均半径(envMeanR・引きずりプローブ実測。構成ごとに測り直す)';
  out.yw2.dragOverKepler = { env1: p1.meanDragOverKepler, env2: p2.meanDragOverKepler };
  out.yw2.comparison = row;
  out.yw2.verdict = { window: PRE_REGISTERED.YW2.window, result: row.result,
    deltaMeasured: row.measured.delta, deltaPredicted: row.predicted.delta,
    signMatch: row.signMatch, absDiff: row.absDiff };
}

// ---- YW3(記述 — 窓なし): R単独対照の Δq₅₀ と core/base 引きずり比 ----
out.yw3 = { rule: PRE_REGISTERED.YW3, window: null,
  note: '**窓なし・判定に使わない**。同率スイープ(YW1)と並べて読むための記述統計である' };
if (out.raw.bh && out.q50.arms.base) {
  const g = out.raw.bh.geom, rRef = g.base.star.meanR;
  const rows = [];
  for (const a of BH_ARMS.filter(x => x.group === 'radiusOnly')) {
    const c = compareDelta(`⚫ (R,Rc)=(15,7.5) → (${a.R},${a.Rc})(R単独 — Rc は据え置き)`,
      g.base.R0, rRef, q50Of('base'), g[a.key].R0, g[a.key].star.meanR, q50Of(a.key),
      PRE_REGISTERED.YW1.tolerance);
    delete c.result;   // 記述のみ — PASS/FAIL を持たせない(窓ではない)
    rows.push(Object.assign(c, { armKey: a.key, RcRef: g.base.Rc, RcVar: g[a.key].Rc,
      descriptiveOnly: true }));
  }
  // 引きずりの内訳(正準 r に最も近い bin)。第152便 postHoc の dragDecompositionAtShell と同一定義
  const decomp = {};
  for (const [k, pr] of Object.entries(out.raw.bh.profiles)) {
    let e = null;
    for (const row of pr.prof) if (e === null || Math.abs(row.r - rRef) < Math.abs(e.r - rRef)) e = row;
    if (!e) continue;
    decomp[k] = { R0: pr.params.R0, Rc: pr.params.Rc, q: pr.params.q, shellSpin: pr.params.s0,
      coreMassFrac: pr.params.coreMassFrac, coreOmega: pr.params.coreOmega,
      rBin: e.rBin, r: e.r, omBaseAnalytic: e.omBaseAnalytic, omCoreAnalytic: e.omCoreAnalytic,
      coreOverBase: e.omBaseAnalytic === 0 ? null : e.omCoreAnalytic / e.omBaseAnalytic,
      omDragAnalytic: e.omDragAnalytic, dragOverKepler: e.dragOverKepler };
  }
  // 同率アームと R単独アームの Δq₅₀ を1表に並べる(格子起因 vs Rc 支配 の読み取り材料)
  const deltaTable = [];
  for (const a of BH_ARMS.filter(x => x.key !== 'base')) {
    deltaTable.push({ armKey: a.key, group: a.group, R: a.R, Rc: a.Rc,
      q50: q50Of(a.key), q50Base: q50Of('base'),
      deltaQ50: (q50Of(a.key) === null || q50Of('base') === null) ? null : q50Of(a.key) - q50Of('base'),
      deltaPredictedFromR: qEffCritical(a.R, rRef) - qEffCritical(15, rRef),
      coreOverBaseAtShell: PROFILE_QS.map(q => ({ q,
        value: decomp[`${a.key}_${tagQ(q)}`] ? decomp[`${a.key}_${tagQ(q)}`].coreOverBase : null })) });
  }
  out.yw3.radiusOnlyComparisons = rows;
  out.yw3.dragDecompositionAtShell = decomp;
  out.yw3.dragDecompositionNote = '正準の参照半径 r に最も近い影響範囲プロファイル bin での引きずりの内訳。' +
    'omBaseAnalytic = 基底スピン項 s·(R/(R+r))^q(核 = R)・omCoreAnalytic = コア差動項 ' +
    '(Mc/m)(Ω_c−s)·(Rc/(Rc+r))^q(核 = Rc)。coreOverBase が大きいほどコア差動項が支配的で、' +
    'R だけを振っても外殻に届く引きずりの総量は動かない(第152便 post-hoc 診断②の量)';
  out.yw3.deltaQ50Table = deltaTable;
  out.yw3.deltaQ50TableNote = '同率スイープ(proportional)と R単独対照(radiusOnly)の Δq₅₀ を' +
    '同一格子・同一当てはめで並べた表。第152便の符号反転が格子起因(①)だったのか Rc 支配(②)' +
    'だったのかを読むための材料であり、判定には使わない';
  out.yw3.baseQ50 = q50Of('base');
  out.yw3.rCanonical = rRef;
}

// ---- YW4c: kF0 × kRep=0 の bit 対照 ----
out.controls = { rule: PRE_REGISTERED.YW4, bitIdentity: [] };
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

// ---- YW4b: 第152便(coreshell3)と設定・格子点が一致する走行の bit 一致 ----
// 事前登録の窓本体 = **⚫基準アーム と 🐚×1/×2 の 0.1 格子点**。R単独対照アーム・対照アームも
// 同じ方法で照合するが、こちらは additional として別に集計する(窓文が名指ししていないため)。
if (fs.existsSync(REF152) && !QUICK) {
  try {
    const ref = JSON.parse(fs.readFileSync(REF152, 'utf8'));
    const R = ref.raw || {};
    const pre = [], add = [];
    const sweep = (bucket, label, mine, theirs, keys) => {
      if (!mine || !theirs) return;
      for (const tag of Object.keys(mine)) if (theirs[tag])
        bucket.push({ label: `${label} ${tag}`, identical: pickJ(mine[tag], keys) === pickJ(theirs[tag], keys) });
    };
    if (out.raw.bh && R.bh1) sweep(pre, '⚫基準アーム(R=15,Rc=7.5)', out.raw.bh.arms.base.runs, R.bh1.runs, dynKeysBH);
    if (out.raw.neb && R.neb) {
      sweep(pre, '🐚env×1', out.raw.neb.arms.env1.runs, R.neb.arms.main.runs, dynKeysNeb);
      sweep(pre, '🐚env×2', out.raw.neb.arms.env2.runs, R.neb.arms.env2.runs, dynKeysNeb);
      sweep(add, '🐚対照', out.raw.neb.controls, R.neb.controls, dynKeysNeb);
    }
    if (out.raw.bh && R.bhr && R.bhr.arms) {
      sweep(add, '⚫R単独対照(R=10,Rc=7.5)', out.raw.bh.arms.ronly_R10.runs, R.bhr.arms.R10.runs, dynKeysBH);
      sweep(add, '⚫R単独対照(R=5,Rc=7.5)', out.raw.bh.arms.ronly_R5.runs, R.bhr.arms.R5.runs, dynKeysBH);
    }
    if (out.raw.ctl && R.ctl) sweep(add, '⚫対照', out.raw.ctl.runs, R.ctl.runs, dynKeysBH);
    const roll = (arr) => ({ comparisons: arr, nCompared: arr.length,
      nIdentical: arr.filter(e => e.identical).length,
      mismatches: arr.filter(e => !e.identical).map(e => e.label),
      allIdentical: arr.length ? arr.every(e => e.identical) : null });
    out.crossWaveCheck = { source: 'tests/out/coreshell3-results.json(第152便)',
      note: '設定・格子点が一致する走行(同一プリセット・同一 seed・同一步数・同一ノブ)の力学フィールド ' +
        'bit 一致。第152便に存在しない格子点(q=1.1)・存在しない構成(同率スイープ)は比較対象外。' +
        '第152便の ⚫ は10点格子・🐚 は14点格子だったので、共有されるのは本便11点のうち10点である',
      preRegisteredSet: roll(pre),
      preRegisteredSetNote: '事前登録 YW4b が名指しする集合 = ⚫基準アーム と 🐚×1/×2 の 0.1 格子点',
      additional: roll(add),
      additionalNote: 'R単独対照アーム(第152便 bhr の R10/R5 アームと共有する q 点)と kF0×kRep0 対照。' +
        '窓文の名指し外なので判定は preRegisteredSet で行う',
      nCompared: pre.length + add.length,
      nIdentical: pre.filter(e => e.identical).length + add.filter(e => e.identical).length,
      allIdentical: (pre.length + add.length) ? [...pre, ...add].every(e => e.identical) : null };
  } catch (e) { out.crossWaveCheck = { error: String(e && e.message) }; }
} else {
  out.crossWaveCheck = { source: 'tests/out/coreshell3-results.json(第152便)',
    preRegisteredSet: { comparisons: [], nCompared: 0, nIdentical: 0, allIdentical: null },
    additional: { comparisons: [], nCompared: 0, nIdentical: 0, allIdentical: null },
    nCompared: 0, nIdentical: 0, allIdentical: null,
    note: QUICK ? '煙試験(CS4_QUICK)では步数が 1/10 なので共有点照合は行わない' : '第152便の正本が見つからない' };
}

// ---- YW4a: 決定性(2回実行ビット同一)----
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
  const refPath = process.env.CS4_DET_REF;
  if (refPath) {
    // 並行実行(2プロセス同時)に備えて、参照 JSON の生成を待てるようにする(既定 0 秒 = 待たない)。
    // 待ちは determinism の記録にしか関与せず、測定値には一切触れない。
    const waitSec = Number(process.env.CS4_DET_WAIT_SEC || 0);
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

// ---- YW4 まとめ(判定はここに集約 — 数値の実体は上のブロックにある)----
out.yw4 = {
  rule: PRE_REGISTERED.YW4,
  a_determinism: { sha256: out.determinism.sha256, reference: out.determinism.reference,
    identical: out.determinism.identical,
    result: out.determinism.identical === null ? 'PENDING(参照なし)' : (out.determinism.identical ? 'PASS' : 'FAIL') },
  b_sharedGridBitIdentity: {
    nCompared: out.crossWaveCheck.preRegisteredSet ? out.crossWaveCheck.preRegisteredSet.nCompared : 0,
    nIdentical: out.crossWaveCheck.preRegisteredSet ? out.crossWaveCheck.preRegisteredSet.nIdentical : 0,
    allIdentical: out.crossWaveCheck.preRegisteredSet ? out.crossWaveCheck.preRegisteredSet.allIdentical : null,
    additionalNCompared: out.crossWaveCheck.additional ? out.crossWaveCheck.additional.nCompared : 0,
    additionalAllIdentical: out.crossWaveCheck.additional ? out.crossWaveCheck.additional.allIdentical : null,
    result: (!out.crossWaveCheck.preRegisteredSet || out.crossWaveCheck.preRegisteredSet.allIdentical === null)
      ? 'INCONCLUSIVE' : (out.crossWaveCheck.preRegisteredSet.allIdentical ? 'PASS' : 'FAIL') },
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
  experiment: { id: 'coreshell4', wave: 154,
    title: 'コア外殻第4実験(第152便 XW2 FAIL の再設計 — 全アーム同一格子の q₅₀・R/Rc 同率スイープ・' +
      'エンベロープ半径差分・R単独対照の記述・決定性/整合)',
    command: 'node tests/exp-coreshell4.mjs(節選択 CS4_ONLY=… / 追記合流 CS4_MERGE=1 / 出力先 CS4_OUT=… / ' +
      '決定性参照 CS4_DET_REF=… / 煙試験 CS4_QUICK=1)' },
  presets: { mode: 'builtin', ids: ['bhCore', 'nebulaShell'],
    modifiedAtRuntime: 'kFrame / kRep / 影響範囲指数 q / core.omega 倍率 Ω_c を第135便・第139便・第152便と' +
      '同一の改変器で上書きし、⚫ は bodies[0].radius(中心半径 R)と bodies[0].core.radius(コア半径 Rc)を、' +
      '🐚 はエンベロープ ring の rIn/rOut(半径倍率)と保持しきい値を上書きして build する。' +
      '上書きはプリセット実値と異なる場合にのみ行う(改変内容は各 run.cfg に記録済み)',
    note: 'seed は各プリセット定義値(⚫20260805 / 🐚20260804)をそのまま使う' },
  numerics: {
    seed: { bhCore: 20260805, nebulaShell: 20260804, note: 'プリセット定義値(改変器は seed を触らない)' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { bhCore: BH_STEPS, nebulaShell: NEB_STEPS, quick: QUICK },
    window: { bhCore: 't=96(validT・第135便/第139便/第152便と同一窓)', nebulaShell: 't=48(validT・同)' },
    warmup: NOT_APPLICABLE,
    sweeps: { qGridAllArms: Q_GRID,
      bhCoreArms: BH_ARMS.map(a => ({ key: a.key, group: a.group, R: a.R, Rc: a.Rc })),
      envelopeScaleNebulaShell: ENV_SCALES, keepRefNebulaShell: KEEP_R0, profileQs: PROFILE_QS },
    gridUniformity: '**全7アームが同一の11点格子**(1.0〜2.0・0.1 刻み・補間なし)。第152便の格子非対称' +
      '(基準10点 vs R 変更8点)を設計で排した点が本便の要点である',
    q50FitGrid: Q50_GRID,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセットの初期配置・質量・seed(第135便/第139便/第152便と同一 — 本便で再フィットしない)',
      'dt=0.016', '窓(bhCore 6000步 / nebulaShell 3000步 = 第152便と同一)',
      '掃引点(全アーム共通の11点格子 q=1.0〜2.0・0.1 刻み / ⚫ (R,Rc)∈{(15,7.5),(10,5),(5,2.5),(10,7.5),(5,7.5)} / ' +
      '🐚 エンベロープ半径倍率∈{1,2})— すべて実測前に固定',
      'q₅₀ の当てはめ格子と INCONCLUSIVE 規則(第152便から不変・実測前に固定)'],
    fit: [],
    derived: ['外殻損失率(q50.arms.*.table)',
      'ロジスティック中点 q₅₀ とプラトー A,B・遷移幅 w(q50 — 実測した損失率曲線の記述統計であり、' +
      '物理モデルの較正自由度ではない。当てはめは決定論的な閉形式+格子探索で、初期値・乱数を持たない)',
      'Δq₅₀ と予測 Δ[(3/2)(1+R/r)] の差(yw1・yw2)',
      'R単独対照の Δq₅₀ と core/base 引きずり比(yw3 — 記述のみ)',
      '対照の bit 一致(controls)', '決定性ハッシュ(determinism)',
      '第152便との共有点 bit 照合(crossWaveCheck)'],
    holdOut: ['予測式 q*_eff=(3/2)(1+R/r)(解析的に事前導出した外部参照値であり、本便のデータから' +
      '当てはめていない — YW1/YW2 はその差分予測に対する事後外挿テストである)',
      '臨界指数の遠方漸近値 3/2(同上)',
      '第152便(coreshell3)の実測値(本便は読み取り専用の bit 照合参照としてのみ使い、書き換えない)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = 本便で' +
      '新しい較正自由度を一つも導入していない',
  },
  judgement: {
    pointers: ['preRegistered', 'limits', 'q50.summary', 'yw1.verdict', 'yw2.verdict', 'yw3', 'yw4',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、エンジン実測は raw、q₅₀ は q50、差分・残差と判定は ' +
      'yw1/yw2/yw4 にある(yw3 は窓なしの記述)。YW1/YW2 の外部解析値は予測式 q*_eff=(3/2)(1+R/r) で、' +
      'その残差は yw1.comparisons[].absDiff・yw2.comparison.absDiff である',
    externalReferences: ['実効臨界指数 q*_eff=(3/2)(1+R/r)(ω_drag=(R/(R+r))^q の局所対数傾きを ' +
      'Ω_kepler の −3/2 に釣り合わせた解析的帰結)', '遠方漸近の臨界指数 3/2'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない(⚫ の relL は角運動量スケールに対する相対変化として ' +
        'raw に残るが、保存則の主張には用いていない)。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第152便との共有点 bit 一致**' +
        '(crossWaveCheck.preRegisteredSet.allIdentical)・**決定性ハッシュ**(determinism.sha256)である' },
  },
  regenerationNote: 'meta.date / meta.elapsedSec / meta.mergedFrom / meta.only / meta.sectionRuns / ' +
    'meta.measurementElapsedSecTotal / determinism.readAttempts は非測定メタなので照合対象外' +
    '(determinism の正規化と同方針)',
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'meta.mergedFrom', 'meta.only', 'meta.sectionRuns',
    'meta.measurementElapsedSecTotal', 'determinism.readAttempts'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\n===== 判定(事前登録窓 — 実測後に動かさない)=====`);
log('q₅₀(全アーム同一11点格子): ' + Object.entries(out.q50.summary).map(([k, v]) =>
  `${k}=${fmt(v.q50, 4)}${v.result === 'OK' ? '' : '(' + v.result + ')'}`).join(' / '));
log(`  全アーム同一格子か: ${out.q50.allArmsSameGrid}`);
if (out.yw1.verdict) {
  log('YW1 主窓(⚫ 同率スイープ) r=' + fmt(out.yw1.rCanonical, 3) + ' → ' + out.yw1.verdict.result);
  for (const c of out.yw1.comparisons)
    log(`   ${c.label}: Δ実測=${fmt(c.measured.delta, 4)} Δ予測=${fmt(c.predicted.delta, 4)} ` +
      `符号一致=${c.signMatch} |差|=${fmt(c.absDiff, 4)} → ${c.result}`);
}
if (out.yw2.verdict) {
  const c = out.yw2.comparison;
  log(`YW2 副窓(🐚) ${c.label}: Δ実測=${fmt(c.measured.delta, 4)} Δ予測=${fmt(c.predicted.delta, 4)} ` +
    `符号一致=${c.signMatch} |差|=${fmt(c.absDiff, 4)} → ${c.result}`);
}
if (out.yw3.deltaQ50Table) {
  log('YW3 記述(窓なし):');
  for (const e of out.yw3.deltaQ50Table)
    log(`   ${e.armKey.padEnd(13)} [${e.group}] (R,Rc)=(${e.R},${e.Rc}) q₅₀=${fmt(e.q50, 4)} Δq₅₀=${fmt(e.deltaQ50, 4)} ` +
      `Δ予測(R のみ)=${fmt(e.deltaPredictedFromR, 4)} core/base=${e.coreOverBaseAtShell.map(x => `q${x.q}:${fmt(x.value, 2)}`).join(' ')}`);
}
log(`YW4a 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical}`);
log(`YW4b 第152便 共有点 bit 一致(事前登録集合)${out.yw4.b_sharedGridBitIdentity.nIdentical}/${out.yw4.b_sharedGridBitIdentity.nCompared} → ${out.yw4.b_sharedGridBitIdentity.result}` +
  `(追加集合 ${out.crossWaveCheck.additional ? out.crossWaveCheck.additional.nIdentical : 0}/${out.crossWaveCheck.additional ? out.crossWaveCheck.additional.nCompared : 0} allIdentical=${out.yw4.b_sharedGridBitIdentity.additionalAllIdentical})`);
log(`YW4c kF0×kRep0 対照 allDynamicsIdentical=${out.controls.allDynamicsIdentical} → ${out.yw4.c_kF0kRep0Control.result}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();

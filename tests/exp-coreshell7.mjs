// 第168便 exp-coreshell7.mjs — コア外殻第7実験(🐚 精細アンカー再実測・事前登録 EW1〜EW3)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs →
//   第152便 tests/exp-coreshell3.mjs → 第154便 tests/exp-coreshell4.mjs →
//   第155便 tests/exp-coreshell-theory.mjs(解析専用)→ 第158便 tests/exp-coreshell5.mjs →
//   第163便 tests/exp-coreshell6.mjs の続き(**分解能向上フォロー**)。
//
// 第163便(coreshell6)は 🐚nebulaShell の q₅₀ を **0.05 刻み・21点**の格子で env×1 / env×2 の
//   2アームについて実測し(env×1 q₅₀=1.6550・env×2 q₅₀=1.5350)、第158便 ZW2 の平均場2項振幅から
//   立つ 2項複合予測を BW1 で判定した(env×2 |差| 0.0554 → PASS)。その申し送りは
//   **「予測精度はアンカー精度に支配されている(アンカーを掃引刻み ±0.05 動かすと予測が 0.09〜0.10 動く)」**
//   というものだった。すなわち BW1 の許容 0.10 と同じ桁の振れがアンカー1点の粒度から来ており、
//   予測式の当てはまりを 0.05 の桁で語ることが**格子の分解能そのものに阻まれていた**。
//   本便(第168便)はその一点だけを詰める:
//     ① 掃引刻みを **0.05 → 0.025 に半分**にして両アームを再実測し(21点・アームごとに coreshell6 の
//        実測 q₅₀ を中心に置く)、
//     ② その**精細アンカー**(env×1 の 0.025 格子実測値)で 2項複合予測を立て直し、
//     ③ env×2 の精細実測と突き合わせる。
//   併せてアンカー ±0.025 摂動の予測振れ幅を測り、coreshell6 の ±0.05 摂動(0.0925)と比べる。
//
// ★★ 正直な位置づけの事前宣言(実測前・読み違えを防ぐため最初に書く)★★
//   **本便は盲検の前向き検証ではない。coreshell6 の粗格子 q₅₀(env×1 1.6550・env×2 1.5350)が
//   既知であり、本便の掃引格子はその既知値を中心に置いて組む。したがって本便は「未知を当てる」便では
//   なく、**既知の値を細かい物差しで測り直す「精細化(分解能向上)」の便**である。**
//   前向き性が残っているのは次の一点だけである: env×2 の **0.025 格子の実測値**は、予測を確定して
//   ディスクへ封をする時点では**まだ測られていない**(手順④→⑤の順序と predictionIntegrity が機械証拠)。
//   逆に env×2 の 0.05 格子の値は既知なので、**EW2 の PASS は「未知の的を射た」ことの証拠にはならない**。
//   EW2 が実際に問うているのは「精細化したアンカーで式を立て直したとき、予測と実測の距離が
//   coreshell6 の 0.0554 からどう動くか」であり、その解釈は結果に依らず変えない。
//
// ★ アーム(2本。いずれも 🐚kF1kRep実。第154便・第163便の 🐚 走行と同じ2構成)★
//   env×1  エンベロープ ring 既定半径(rIn/rOut ×1)・保持しきい値 r<300 … **アンカー構成**
//   env×2  エンベロープ ring 半径 ×2(rIn/rOut ×2)・保持しきい値 r<600 … 予測の対象
//
// ============================ 事前登録(実測前に固定 — 逐語)===================================
//   EW1(格子整合): 各アームで |q₅₀(0.025格子) − q₅₀(coreshell6 0.05格子)| ≤ 0.05。
//   EW2(主窓): **精細アンカー**(env×1 の 0.025 実測値)による 2項複合予測(振幅は coreshell5 ZW2 の
//     分離値を機械読取 — coreshell6 と同一の転記照合手順)vs env×2 精細実測 — |差| ≤ 0.10。
//     **併記(記述・判定外)**: (a) |差| ≤ 0.05 に入るか (b) 逆向きアンカー(env×2 基準 → env×1 予測)
//     (c) アンカー ±0.025 摂動の予測振れ幅(coreshell6 の ±0.05 と比較) (d) 旧式 (3/2)(1+R̄/r̄) の差。
//   EW3(決定性): 別プロセス2回実行の正準化 SHA 一致。
//   **実測後に窓・格子・採点定義を動かさない。PASS/FAIL とも収載する。**
//   掃引格子が q₅₀ を挟めない(端に張り付く)場合もそのまま収載し「格子外」と正直に記録する。
//   格子の事後変更は禁止で、その場合の当該窓は FAIL 扱いとし理由を明記する。
//
// ============================ 予測式(第155便→第158便→第163便からの逐語転記)==================
//   (T1) Ω_drag(r; q₅₀) = Ω_crit                     … 保持喪失の条件式(Ω_drag は q に単調減少)
//   (T5′) 🐚 の平均場2項  Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q,  x_b = R̄/(R̄+r̄),  x_c = Rc/(Rc+r̄)
//        (R̄ = クランプ粒子半径の平均・Rc = クランプのコア半径・r̄ = エンベロープの平均半径。
//         A_b・A_c は第158便が q∈{1.5,2.0} の2点プローブから連立して解いた振幅である)
//   予測 = 「Ω̄_drag_var(q₅₀') = Ω̄_drag_ref(q₅₀_ref)」の数値解(**決定論的二分法**・区間 [0.05,8.0]・
//        反復 200 回固定)。アンカー q₅₀_ref は **本便が③で実測した env×1 の 0.025 格子 q₅₀ ただ1つ**で、
//        未知の Ω_crit を代数的に消去するための代入である(較正自由度ではない — classification.fit は空)。
//   参考として (T3) 単一項アンカー式・(T4) 振幅寄与込み単一項・旧式 (3/2)(1+R̄/r̄) の予測も併記する
//        (**いずれも窓判定には使わない**)。
//   転記の正しさは掃引の前に機械照合で確かめる(checks):
//     (a) 第158便 ZW2 の分離振幅 A_b・A_c・核 x_b・x_c・行列式を、本ハーネスの転記式で
//         第158便の生プローブ行から再計算して bit 一致を要求する(coreshell6 と同一手順)。
//     (b) 第163便 coreshell6 の 2項複合予測(Ω_crit・env×1/×2 の q₅₀_pred・参考予測・アンカー摂動)を、
//         本ハーネスの (T5′) と二分法ソルバへ coreshell6 のアンカー(第154便 env×1 実測 q₅₀)を通して
//         再計算し、coreshell6 JSON 収載値との bit 一致を要求する(= 式・ソルバ・共有パラメータの
//         転記が正しいことの機械証拠)。
//
// 走行規約(第154便・第158便・第163便の 🐚 走行の踏襲 — 1 bit も変えない):
//   🐚nebulaShell: seed 20260804(プリセット定義値)・3000步(validT=48)・dt=0.016。
//   loss(q) = 1 − envelope.keepFrac(エンベロープ44体のうち中心 COM から r<keepR に残った割合の補数)。
//   keepR は env×1 で 300・env×2 で 600(第154便 KEEP_R0=300 に半径倍率を掛ける規約)。
//   数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// 本便が触るノブ(第154便・第158便・第163便と同一。既定値では 1 bit も変えない):
//   🐚 envScale : エンベロープ ring の rIn/rOut を一律倍率で振る。**倍率が 1 のときは上書きを省く**
//                (= プリセット実値のまま build するので第154便の env×1 走行と build が同一になる)。
//   🐚 keepR    : 保持しきい値(測定器側のしきい値であり、力学には一切効かない)。
//   q(physics.q)・kFrame・kRep は対照走行でのみ触る。
//
// トイ単位の限界(第135便〜第163便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である。
//   窓(步数)は validT に一致させた有限窓で、窓外の長時間挙動は測っていない。エンベロープは 44体の
//   小標本で、保持率の分解能は 1/44 ≈ 0.0227 に制限される。
//
// 実行:
//   node tests/exp-coreshell7.mjs                        … 全節(既定)
//   CS7_ONLY=neb,ctl,probe node tests/...                … 節を選択実行
//   CS7_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS7_DET_REF=/path/run1.json [CS7_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//   CS7_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用・本番数値ではない)
// 出力: tests/out/coreshell7-results.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.CS7_OUT ? path.resolve(process.env.CS7_OUT)
  : path.join(OUT_DIR, 'coreshell7-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS7_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS7_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(実測前に固定 — 実測後に動かさない) ========================
const PRE_REGISTERED = {
  fixedBy: '統括(第163便 coreshell6 の分解能フォローとして第168便で固定 — ハンドオフ 2026-08-22b §3b)',
  fixedBefore: '実測',
  honestFraming: {
    headline: '**本便は盲検の前向き検証ではなく「精細化(分解能向上)」である**',
    whatIsKnownBeforehand: 'coreshell6(第163便)が 0.05 刻み・21点で実測した q₅₀ は既知である' +
      '(env×1 = 1.6550・env×2 = 1.5350)。本便の掃引格子はこの既知値をアームごとの中心に置く。' +
      'したがって「実測が格子のどのあたりに来るか」は事前におおよそ判っており、格子内に収まること自体は' +
      '手柄ではない',
    whatRemainsProspective: '前向きなのは **env×2 の 0.025 格子の実測値**だけである。予測は手順④で' +
      '確定し OUT_PATH へ書き出してから⑤の env×2 掃引を始めるので、予測時点でこの値は存在しない' +
      '(predictionIntegrity の正準化 SHA が事後改変の無いことを機械照合する)。' +
      'ただし env×2 の 0.05 格子の値は既知なので、**EW2 の PASS を「未知の的を射た」証拠として' +
      '読んではならない**',
    whatEW2ActuallyAsks: 'EW2 が問うているのは「アンカーを 0.05 格子(1.6500)から 0.025 格子の実測値へ' +
      '精細化したとき、2項複合予測と env×2 実測の距離が coreshell6 の |差| 0.0554 からどう動くか」で' +
      'ある。この読み方は実測前に宣言しており、結果に応じて変えない',
    whyThisWaveExists: 'coreshell6 の申し送りは「予測精度はアンカー精度に支配される' +
      '(アンカー ±0.05 で予測が 0.09〜0.10 動く)」であった。振れ幅が BW1 の許容 0.10 と同じ桁である' +
      '以上、式の当てはまりを 0.05 の桁で語ることは格子の分解能に阻まれる。本便は刻みを半分にして' +
      'その支配項を半分にし、併記 (c) でその効果を実測する',
  },
  designPrinciples: {
    machineTranscription: '分離振幅・核・coreshell6 の実測 q₅₀(= 格子中心)はすべて既存 JSON からの' +
      '**機械読取**であり、手書き転記をしない(手書き転記は第131便の事故と同根の再現不能を招く)',
    anchorIsMeasurement: 'アンカーは **本便が③で実測した 🐚 env×1 の 0.025 格子 q₅₀ ただ1つ**の代入で' +
      'あり、未知の臨界値 Ω_crit を代数的に消去する役割しか持たない(最小二乗も探索も行わない = ' +
      '較正自由度ではない)',
    anchorRecoveryIsNotPrediction: 'アンカー構成である env×1 の 2項複合予測は**恒等的にアンカー値**に' +
      'なる。したがって EW2 の判定対象は **env×2 の1アームのみ**である(env×1 の予測は恒等性の' +
      '自己点検として収載するだけで、窓判定には使わない)',
    twoSeals: '封は2段である。**封①(掃引前)**: 掃引格子・採点定義・「精細化」宣言・事前登録窓を、' +
      '**どのアームの掃引よりも前に**正準化 SHA-256 で固定して OUT_PATH へ書き出す(preRegistrationSeal)。' +
      '**封②(env×2 掃引前)**: ③で得た精細アンカーから立てた予測ブロックを、**env×2 の掃引を始める前に** ' +
      '正準化 SHA-256 で固定して OUT_PATH へ書き出す(predictionIntegrity)。' +
      '予測がアンカーの実測に依存する設計なので封②は封①より後にならざるを得ないが、' +
      '**予測の対象である env×2 の実測より前**である点は保たれている',
    gridFixedBeforeMeasurement: '掃引格子はアームごとに **coreshell6 の実測 q₅₀ を中心とする ±0.25・' +
      '0.025 刻み・21点**で、封①で固定する。実測後に格子を動かさない。q₅₀ が格子の端に張り付いた' +
      '場合もそのまま収載し「格子外」と記録する(その場合、当該窓は FAIL 扱いとし理由を明記する)',
    priorWavesUntouched: '第152便(coreshell3)・第154便(coreshell4)・第155便(coreshell-theory)・' +
      '第158便(coreshell5)・第163便(coreshell6)の JSON は一切変更しない。本便は新規ファイルとして' +
      '独立に走り、既存 JSON は読み取り専用の機械読取・bit 照合・来歴参照としてのみ使う',
  },
  EW1: {
    role: '窓(格子整合)',
    verbatim: 'EW1(格子整合): 各アームで |q₅₀(0.025格子) − q₅₀(coreshell6 0.05格子)| ≤ 0.05。',
    window: '**|q₅₀_fine − q₅₀_coreshell6| ≤ 0.05**(🐚 env×1 / env×2 それぞれで)',
    tolerance: 0.05,
    rationale: '刻みを半分にしても同じ遷移点を測っていることの整合検定である。許容 0.05 は ' +
      'coreshell6 の掃引刻み(= 粗格子側の分解能)そのもので、実測前に固定する',
    arms: '🐚kF1kRep実 env×1(保持しきい値 r<300)/ env×2(保持しきい値 r<600)',
    inconclusiveRule: 'アームの q₅₀ が当てはめの INCONCLUSIVE 規則(振幅 A−B < 0.20 または q₅₀ が' +
      '掃引範囲 ±0.25 の外)に掛かった場合は INCONCLUSIVE として PASS/FAIL を主張しない',
    verdictPrecedence: '適用順序(実測前に固定): ① 当てはめが INCONCLUSIVE 規則に掛かった → ' +
      '**INCONCLUSIVE**。② 当てはめは成立したが q₅₀ が事前固定格子の外に出た(端に張り付いた)→ ' +
      '**「格子外」として FAIL 扱い**(格子の事後変更は禁止)。③ それ以外 → |差| と許容 0.05 の比較',
  },
  EW2: {
    role: '主窓',
    verbatim: 'EW2(主窓): **精細アンカー**(env×1 の 0.025 実測値)による 2項複合予測(振幅は ' +
      'coreshell5 ZW2 の分離値を機械読取 — coreshell6 と同一の転記照合手順)vs env×2 精細実測 — ' +
      '|差| ≤ 0.10。',
    window: '**|q₅₀_meas(env×2・0.025格子) − q₅₀_pred(2項複合・精細アンカー)| ≤ 0.10**',
    tolerance: 0.10,
    judgedArm: 'env2(前向き対象の1アームのみ。env×1 は恒等予測なので窓判定に使わない)',
    prediction: '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を、精細アンカー(本便③で実測した ' +
      '🐚 env×1 の 0.025 格子 q₅₀)で決めた Ω_crit に等しくする q を、決定論的二分法' +
      '(区間 [0.05,8.0]・反復 200 回固定)で解いた値',
    parameterMapping: {
      A_b: 'A_b = 第158便 zw2.perScale.env{1,2}.separation.amplitudeBase(機械読取)',
      A_c: 'A_c = 第158便 zw2.perScale.env{1,2}.separation.amplitudeCore(機械読取)',
      x_b: 'x_b = 第158便 zw2.perScale.env{1,2}.kernels.xBase = R̄/(R̄+r̄)(機械読取)',
      x_c: 'x_c = 第158便 zw2.perScale.env{1,2}.kernels.xCore = Rc/(Rc+r̄)(機械読取)',
      anchor: 'q₅₀_ref = 本便 q50.arms.env1.fit.q50(③で実測した 0.025 格子の値)',
    },
    coRecordedDescriptive: {
      note: '**併記(記述・判定外)**。EW2 の PASS/FAIL には一切使わない',
      a: '(a) |差| ≤ 0.05 に入るか(より厳しい目安に届くか — 判定は 0.10 のまま動かさない)',
      b: '(b) 逆向きアンカー(env×2 の精細実測を基準に env×1 を予測)。この向きでは env×1 が' +
        '非恒等の予測対象になるので、式の当てはまりを別角度から読める。**env×2 の実測を使うので' +
        '本質的に事後(post-hoc)の記述である**',
      c: '(c) アンカー ±0.025 摂動の予測振れ幅と、coreshell6 の ±0.05 摂動(env×1 0.1000 / ' +
        'env×2 0.0925)との比較。刻みを半分にした効果が予測の振れ幅に何倍で効くかを実測する',
      d: '(d) 旧式 q*_eff=(3/2)(1+R̄/r̄) の差分予測と実測との |差|',
    },
    inconclusiveRule: 'env×2 の q₅₀ が当てはめの INCONCLUSIVE 規則に掛かった場合、あるいは二分法が' +
      '固定区間で解を挟めなかった場合は INCONCLUSIVE として PASS/FAIL を主張しない',
    verdictPrecedence: '適用順序(実測前に固定): ① 予測が立たない・当てはめが INCONCLUSIVE 規則に' +
      '掛かった → **INCONCLUSIVE**。② 当てはめは成立したが q₅₀ が事前固定格子の外に出た → ' +
      '**「格子外」として FAIL 扱い**とし理由を明記する(格子の事後変更は禁止)。③ それ以外 → ' +
      '|q₅₀_meas − q₅₀_pred| と許容 0.10 の比較で PASS/FAIL',
    prospectiveEvidence: '予測は env×2 の掃引前に out.predictedBeforeMeasurement へ書き込み、' +
      'OUT_PATH へ一度書き出してから env×2 の掃引を始める。最終書き出し時に同ブロックの正準化 ' +
      'SHA-256 が予測時点の値と一致することを機械照合する(predictionIntegrity)',
  },
  EW3: {
    role: '窓(決定性)',
    verbatim: 'EW3(決定性): 別プロセス2回実行の正準化 SHA 一致。',
    window: '全体を2回実行(別プロセス)し結果 JSON(非測定メタを除く)の正準化 SHA 一致',
    canonicalization: 'raw(実測部)と predictedBeforeMeasurement(予測部)を再帰キー整列した JSON。' +
      '走行時間は meta.timings にのみ置き raw には入れていないので、除外すべき揮発値は対象内に存在しない',
  },
  scoringDefinition: {
    declaredBefore: '**掃引実測より前**に宣言・固定した採点定義である(第154便 tests/exp-coreshell4.mjs の ' +
      'q₅₀ 定義の 🐚 版 = 第163便 coreshell6 と 1 bit も違わない逐語転記)',
    loss: 'loss(q) = 1 − envelope.keepFrac。envelope は測定器 measureNeb の帯 [NC, S.n)(= エンベロープ ' +
      'ring の 44体)で、keepFrac は 3000步後にクランプ質量中心から r < keepR に留まった割合',
    keepR: 'env×1 は keepR=300・env×2 は keepR=600(第154便 KEEP_R0=300 に半径倍率を掛ける規約の踏襲)。' +
      'keepR は測定器側のしきい値であり力学には一切効かない',
    model: 'loss(q) = B + (A − B)/(1 + exp((q − q₅₀)/w))',
    fitMethod: '(q₅₀, w) を決定論的な格子で全探索し、各格子点で (A,B) を線形最小二乗の閉形式で解く。' +
      '反復解法・乱数・初期値依存を一切持たない(同じ入力なら常に同じ出力)。A,B は損失率の定義域 ' +
      '[0,1] へ射影する(片側だけ外れたときは他方を解き直す)',
    inconclusive: '振幅 A−B < 0.20、または q₅₀ が掃引範囲 ±0.25 の外なら INCONCLUSIVE',
    source: '第152便・第154便・第158便・第163便と同一の当てはめ関数(fitLogisticQ50)・同一の当てはめ格子',
  },
  sweepGridDefinition: {
    declaredBefore: '**どのアームの掃引よりも前**に宣言・固定した格子定義である(封①)',
    nPoints: 21, step: 0.025, halfWidth: 0.25,
    centering: 'アームごとに、**第163便 coreshell6 の実測 q₅₀** を中心に置く' +
      '(coreshell6-results.json: q50.summary.env{1,2}.q50 の機械読取。env×1 1.6550 / env×2 1.5350)',
    rounding: '格子点は 1e-6 に丸める(2進浮動小数の桁落ちで格子点が揺れるのを防ぐため — 実測前に宣言)',
    sharedPointsNote: '中心が 0.005 の奇数倍(1.655 / 1.535)なので、本便の格子点は 0.05 の倍数に' +
      '一致しない。したがって **coreshell6 の 0.05 格子・第154便の 0.1 格子と共有する掃引点は' +
      '原理的に存在しない**(この事実は実測前に判っており、crossWaveCheck に「共有点なし」として' +
      '正直に記録する)。エンジン同一性の機械確認は代わりに (i) 第158便プローブの bit 再現' +
      '(checks.probeReproduction)と (ii) kF0×kRep0 対照の第154/158/163便との bit 一致' +
      '(crossWaveCheck.controls)で行う',
    noPostHocChange: '実測後に格子を動かさない。q₅₀ が格子の端に張り付いた場合はそのまま収載し、' +
      '「格子外」と記録したうえで当該窓は FAIL 扱いとする',
  },
  procedure: {
    order: ['① coreshell6-results.json / coreshell5-results.json を機械読取する(sha256 を来歴に残す)' +
      'ほか、転記照合を行う: 第158便 ZW2 の分離振幅の再計算と、**coreshell6 の予測値・共有パラメータ' +
      '(Ω_crit・q₅₀_pred・参考予測・アンカー摂動)の再現**(シミュレーションなし)',
      '② 精細格子(アームごとに coreshell6 実測 q₅₀ 中心の 0.025 刻み21点)・採点定義・' +
      '「精細化」宣言・事前登録窓を正準化 SHA-256 で封印し OUT_PATH へ書き出す(封①)',
      '②′ 🐚 引きずりプローブ(q∈{1.5,2.0} × env×{1,2})を再走行し第158便収載値と bit 照合する' +
      '(1步プローブ。**q₅₀ の掃引実測ではない**。予測には第158便 JSON の収載値をそのまま使う)',
      '③ env×1 を精細格子で掃引実測する(= 精細アンカーの取得)',
      '④ ③の実測値をアンカーに Ω_crit を決め、env×1/env×2 の q₅₀_pred(2項複合)と参考予測・' +
      'アンカー ±0.025 摂動を計算して predictedBeforeMeasurement として JSON へ記録し、' +
      '**env×2 の掃引を始める前に** OUT_PATH へ書き出す(封②)',
      '⑤ env×2 を精細格子で掃引実測する',
      '⑥ EW1(格子整合)・EW2(主窓)+併記群 (a)〜(d)・EW3(決定性)で判定する' +
      '(窓は①より前に固定済み)'],
    note: '②′ のプローブは 1 步だけ進めた解析パラメータの読み取りであり、対象アームの**保持率掃引' +
      '(q₅₀ の実測)ではない**。q₅₀ の実測は③と⑤でのみ行う',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  windows: {
    nebulaShell: { steps: 3000, validT: 48, note: '第135便・第139便・第152便・第154便・第158便・' +
      '第163便と同一窓。窓外の長時間挙動は測っていない' },
  },
  seeds: { nebulaShell: 20260804,
    note: 'seed はプリセット定義値。build がそれを使うので構成間で同一 — 構成差はすべてノブ差である' },
  sampleSize: {
    nebulaShell: 'エンベロープ 44体(掃引の母数)+ クランプ 54体。保持率の分解能は 1/44 ≈ 0.0227',
  },
  notBlind: '**本便は盲検ではない**。格子中心は coreshell6 の既知の実測 q₅₀ である' +
    '(preRegistered.honestFraming)。前向きなのは env×2 の 0.025 格子実測値だけであり、' +
    'EW2 の PASS を「未知を当てた」証拠として読んではならない',
  q50Resolution: 'q₅₀ の当てはめ格子は 0.0025 刻み。掃引点の刻み(本便 0.025)より細かいが、' +
    '**q₅₀ の実質的な分解能を決めるのは掃引点の刻み(0.025)と保持率の粒度**(1/44 ≈ 0.0227)であり、' +
    '当てはめ格子の刻みではない。刻みを半分にしても保持率の粒度は変わらないので、' +
    '**分解能の改善は掃引刻み側の項に限られる** — この限界の上で読むこと',
  anchorPropagation: '予測はアンカー(本便③の env×1 実測 q₅₀)を1点使う。アンカー自身が掃引刻み ' +
    '0.025 と保持率の粒度に由来する不確かさを持つので、その不確かさは予測値へそのまま伝播する' +
    '(bw 併記 (c) に ±0.025 ずらした場合の予測を coreshell6 の ±0.05 と並べて記録する — 記述のみ)',
  meanFieldApproximation: '🐚 の真の引きずりは粒子対ごとの距離 d_ij に依存する多項和である。' +
    '(T5′) の2項は「クランプ粒子半径の平均 R̄ を核とする項」と「クランプのコア半径 Rc を核とする項」' +
    'による**平均場近似**であり、A_b・A_c は近似モデルのパラメータであってエンジン内部の量そのもの' +
    'ではない(第158便 zw2.perScale.*.separation.caveat と同じ限界)',
  amplitudesFittedAtTwoQs: 'A_b・A_c は第158便が q∈{1.5, 2.0} のちょうど2点から連立して解いた値なので、' +
    '(T5′) はその2点で Ω̄_drag を**厳密に**再現する。q₅₀_pred がこの区間の外に出る場合は外挿に' +
    'あたる(extrapolationNote に各アームの位置関係を記録する)',
  amplitudesNotRefreshed: '振幅 A_b・A_c は第158便の収載値をそのまま使う(本便で解き直さない)。' +
    '刻みを細かくしたのは **q₅₀ の掃引側だけ**であり、**振幅側の分解能は coreshell6 と同じまま**である。' +
    'したがって予測の系統誤差のうち振幅由来の成分は本便でも減っていない',
  envScaleCaveat: 'エンベロープ半径倍率は「引きずり核の相対的な効きを変える」以外の寄与も同時に動かす: ' +
    'r̄ が変われば重み w_ij と正規化 D₀+ΣW も変わり、ケプラー角速度・力学時間・保持しきい値(keepR も ' +
    '×2 にする規約)も変わる。これらは差分では相殺されない系統であり、q₅₀ には引きずり核の' +
    '効き以外の寄与も混じりうる(第154便 YW2・第158便 zw2・第163便と同じ限界)',
  tZeroAnalytic: '予測に使う Ω̄_drag は **1步後(t=0+)の解析値**である。🐚 は窓の間にクランプが' +
    '合体・回転して自走する系なので、窓平均の引きずりは t=0+ の値と同じではない(第155便 postHoc ②)。' +
    '本便はこの限界を承知のうえで、t=0+ の解析値による予測をそのまま照合に掛ける',
  anchorArmIsIdentity: 'env×1 はアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる。' +
    'env×1 の予測は恒等性の自己点検であって式の予測力の検定ではない(EW2 の判定対象は env×2 のみ)',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'cs6', file: 'coreshell6-results.json',
    role: '第163便の実測正本(**本便の格子中心**: q50.summary.env{1,2}.q50 の 0.05 格子実測値を機械読取。' +
      'あわせて EW1 の比較相手・転記照合の突き合わせ先(予測値・アンカー摂動・共有パラメータ)・' +
      '対照走行の bit 照合参照)' },
  { key: 'cs5', file: 'coreshell5-results.json',
    role: '第158便の実測正本(**本便の予測入力**: ZW2 の 🐚 分離振幅 A_b・A_c と核 x_b・x_c を機械読取する。' +
      '生プローブ行は分離の再計算元・プローブ再現の突き合わせ先)' },
];
const inputs = {};
const provenanceInputs = [];
for (const spec of INPUT_SPECS) {
  const p = path.join(OUT_DIR, spec.file);
  const bytes = fs.readFileSync(p);
  const j = JSON.parse(bytes.toString('utf8'));
  inputs[spec.key] = j;
  provenanceInputs.push({
    path: `tests/out/${spec.file}`, sha256: sha256(bytes), bytes: bytes.length,
    exp: j.meta ? j.meta.exp : null, wave: j.meta ? j.meta.wave : null,
    targetSha256: j.manifest ? j.manifest.provenance.target.sha256 : null,
    appVersion: j.manifest ? j.manifest.provenance.target.appVersion : null,
    gitCommit: j.manifest ? j.manifest.provenance.git.commit : null,
    role: spec.role, mutated: false,
  });
}
const CS6 = inputs.cs6, CS5 = inputs.cs5;
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  inputs: provenanceInputs.map(e => ({ path: e.path, targetSha256: e.targetSha256,
    sameAsNow: e.targetSha256 === TARGET_SHA_NOW })),
  allSame: provenanceInputs.every(e => e.targetSha256 === TARGET_SHA_NOW),
  note: '入力 JSON の実測を出した対象 HTML の SHA-256 が、本便が実測する index.html と同一実体かの照合。' +
    '一致していれば「coreshell6 の q₅₀ と第158便の分離振幅は今の index.html が出す値である」という' +
    '前提が満たされる(実際の再現は checks.probeReproduction と crossWaveCheck.controls で確かめる)',
};

// ============================ 測定器(第163便 exp-coreshell6.mjs から逐語踏襲) ================
// A) 🐚nebulaShell — 第154便/第158便/第163便 measureNeb と同一(帯定義・しきい値・返却フィールド)。
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

// B) 🐚 引きずりプローブ — 第154便/第158便/第163便 nebDragProbe と同一(1步・解析値の読み取り)。
//    本便では第158便 ZW2 収載値の bit 再現確認にのみ使う(予測には第158便 JSON の収載値を使う)。
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

// ==================== q₅₀(ロジスティック中点)の当てはめ — 第152/154/158/163便と同一 ==========
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

// ================= 予測式(第155便 → 第158便 → 第163便からの逐語転記)==========================
const SOLVER = { bracket: [0.05, 8.0], iterations: 200,
  method: '二分法(区間・反復回数を固定した決定論的解法。反復停止条件に時間・乱数を使わない)' };
function solveMonotoneDecreasing(fn, target) {
  let lo = SOLVER.bracket[0], hi = SOLVER.bracket[1];
  const fLo = fn(lo), fHi = fn(hi);
  if (!(fLo >= target && fHi <= target)) {
    return { q: null, bracketed: false, fAtLo: fLo, fAtHi: fHi,
      note: '解が固定区間 [' + SOLVER.bracket.join(',') + '] の外(値を捏造せず null を返す)' };
  }
  for (let i = 0; i < SOLVER.iterations; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > target) lo = m; else hi = m;
  }
  const q = (lo + hi) / 2;
  return { q, bracketed: true, residual: fn(q) - target, fAtLo: fLo, fAtHi: fHi };
}
// (T5′) 🐚 の平均場2項(第158便 ZW2 の分離と同じ関数形。本便の予測本体)
const omegaDragNeb = (p, q) => p.Ab * Math.pow(p.xb, q) + p.Ac * Math.pow(p.xc, q);
const qEffLegacy = (R, r) => 1.5 * (1 + R / r);      // 旧式(第139便 post-hoc → 第152便 XW2 → 第154便 YW1)
// (T3) 単一項アンカー式 / (T4) 振幅寄与込み一般形
const predSingleTerm = (q50Ref, xRef, xVar) => q50Ref * Math.log(xRef) / Math.log(xVar);
const predSingleTermAmplitude = (q50Ref, xRef, aRef, xVar, aVar) =>
  (q50Ref * Math.log(xRef) + Math.log(aRef / aVar)) / Math.log(xVar);
// 第158便 ZW2 の平均場2項分離(2式2未知数の線形解。転記照合で bit 一致を要求する)
const separateTwoTerm = (xb, xc, q1, q2, o1, o2) => {
  const det = Math.pow(xb, q1) * Math.pow(xc, q2) - Math.pow(xc, q1) * Math.pow(xb, q2);
  return { determinant: det,
    amplitudeBase: (o1 * Math.pow(xc, q2) - o2 * Math.pow(xc, q1)) / det,
    amplitudeCore: (Math.pow(xb, q1) * o2 - Math.pow(xb, q2) * o1) / det };
};

// 正準化(決定性ハッシュ・封①/封②の不変照合に使う)
const canonize = (o) => {
  if (Array.isArray(o)) return o.map(canonize);
  if (o && typeof o === 'object') {
    const r = {};
    for (const k of Object.keys(o).sort()) r[k] = canonize(o[k]);
    return r;
  }
  return o;
};
const canonSha = (o) => sha256(Buffer.from(JSON.stringify(canonize(o)), 'utf8'));

// ======================================= 実行 ==============================================
const T_START = Date.now();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

const out = { meta: { exp: 'coreshell7', wave: 168, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第163便 tests/exp-coreshell6.mjs(測定器・引きずりプローブ・q₅₀ 当てはめ関数・予測式と' +
      '二分法ソルバ・前向き記録の流儀を踏襲。その 0.05 格子実測 q₅₀ が本便の格子中心・EW1 の比較相手)' +
      ' / 第158便 tests/exp-coreshell5.mjs(ZW2 の 🐚 分離振幅 = 本便の予測入力)' +
      ' / 第154便 tests/exp-coreshell4.mjs(🐚 走行規約・q₅₀ 採点定義)' +
      ' / 第155便 tests/exp-coreshell-theory.mjs(予測式 (T1)(T5))' +
      ' / 第152便 exp-coreshell3 / 第139便 exp-coreshell2 / 第135便 exp-coreshell(原型)',
    role: '🐚 の q₅₀ 掃引を **0.025 刻み**へ精細化し、精細アンカーで 2項複合予測を立て直して ' +
      'env×2 の精細実測と突き合わせる便(**分解能向上フォロー — 盲検の前向き検証ではない**)。' +
      '格子・採点定義は掃引前に、予測は env×2 掃引前に、それぞれ SHA で封をする',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS,
  provenance: { inputs: provenanceInputs, targetConsistency },
  raw: {} };
out.meta.timings = {};   // 走行時間は非測定メタなので raw には入れない(raw は完全に決定論的)

// ---- アーム・走行規約(実測前に固定)----
const NEB_KEEP_R0 = 300;              // 🐚 保持しきい値(×1)。半径倍率とともに拡大する(第154便規約)
const NEB_ARMS = [
  { key: 'env1', envScale: 1, keepR: NEB_KEEP_R0 * 1, group: 'anchor', cs6Key: 'env1',
    label: '🐚kF1kRep実 env×1(保持しきい値 r<300)— アンカー構成(予測は恒等)' },
  { key: 'env2', envScale: 2, keepR: NEB_KEEP_R0 * 2, group: 'prospective', cs6Key: 'env2',
    label: '🐚kF1kRep実 env×2(保持しきい値 r<600)— EW2 の判定対象' },
];
const NEB_ANCHOR_KEY = 'env1';
const NEB_PROBE_QS = [1.5, 2.0];      // 第158便 ZW2 のプローブ q(分離の元になった2点)
const NEB_STEPS = SC(3000);
const GRID_N = 21, GRID_STEP = 0.025, GRID_HALF = 0.25;
const makeGrid = (center) => Array.from({ length: GRID_N },
  (_, i) => Math.round((center + (i - (GRID_N - 1) / 2) * GRID_STEP) * 1e6) / 1e6);
const tagQ = (q) => 'q' + q.toFixed(5);

const nebLoss = (r) => 1 - r.envelope.keepFrac;

const runNeb = async (tag, mod, store, prefix = 'neb') => {
  const t0 = Date.now();
  const r = await measureNeb({ ...mod, steps: NEB_STEPS });
  r.tag = tag;
  store[tag] = r;
  const sec = (Date.now() - t0) / 1000;
  out.meta.timings[`${prefix}:${tag}`] = sec;
  log(`[🐚 ${tag.padEnd(10)}] loss=${fmt(nebLoss(r), 4)} keep=${fmt(r.envelope.keepFrac, 3)} envScale=${r.cfg.envScale} keepR=${r.cfg.keepR} meanR=${fmt(r.envelope.meanR, 1)} | clump keep=${fmt(r.clump.keepFrac, 3)} NaN=${r.nan} (${sec.toFixed(1)}s)`);
  return r;
};

const nebTable = (runs) => Object.entries(runs).map(([tag, r]) =>
  ({ tag, q: r.cfg.q, envScale: r.cfg.envScale, keepR: r.cfg.keepR, loss: nebLoss(r),
    keepFrac: r.envelope.keepFrac, boundFrac: r.envelope.boundFrac,
    clumpKeepFrac: r.clump.keepFrac })).sort((a, b) => a.q - b.q);

out.checks = {};

// ---- ① 転記照合(実測に先立つ・シミュレーション不要)------------------------------------------
// 🐚 の (T5′) パラメータは第158便 ZW2 の収載値を機械読取する(手書き転記をしない)。
const nebParamsOf = (a) => {
  const s = CS5.zw2.perScale[`env${a.envScale}`];
  return { Ab: s.separation.amplitudeBase, Ac: s.separation.amplitudeCore,
    xb: s.kernels.xBase, xc: s.kernels.xCore,
    Rbar: s.kernels.kernelRadiusBase, Rc: s.kernels.kernelRadiusCore, rBar: s.kernels.rBarUsed,
    sourcePath: `coreshell5-results.json: zw2.perScale.env${a.envScale}` };
};

// (a) 第158便 ZW2 の 🐚 分離振幅を、本ハーネスの転記式で第158便の生プローブ行から再計算する。
{
  const rows = [];
  try {
    const P = CS5.raw.neb.dragProbes;
    const rcClump = CS5.raw.neb.controls['ctl_q1.30'].cfg.coreRc;
    const meanDrag = (pr) => pr.rows.reduce((a, e) => a + e.omDragAnalytic, 0) / pr.rows.length;
    for (const a of NEB_ARMS) {
      const probes = NEB_PROBE_QS.map(q => P[`env${a.envScale}_q${q.toFixed(2)}`]);
      const rBar = probes[0].envMeanR, Rbar = probes[0].RbarClump;
      const xb = Rbar / (Rbar + rBar), xc = rcClump / (rcClump + rBar);
      const [q1, q2] = probes.map(pr => pr.q), [o1, o2] = probes.map(meanDrag);
      const mine = separateTwoTerm(xb, xc, q1, q2, o1, o2);
      const theirs = CS5.zw2.perScale[`env${a.envScale}`];
      rows.push({ armKey: a.key, envScale: a.envScale,
        identical: mine.amplitudeBase === theirs.separation.amplitudeBase &&
          mine.amplitudeCore === theirs.separation.amplitudeCore &&
          mine.determinant === theirs.separation.determinant &&
          xb === theirs.kernels.xBase && xc === theirs.kernels.xCore,
        mine: { xBase: xb, xCore: xc, ...mine },
        theirs: { xBase: theirs.kernels.xBase, xCore: theirs.kernels.xCore,
          determinant: theirs.separation.determinant,
          amplitudeBase: theirs.separation.amplitudeBase,
          amplitudeCore: theirs.separation.amplitudeCore } });
    }
  } catch (e) { out.checks.separationTranscriptionError = String(e && e.message); }
  out.checks.transcriptionReproducesWave158Separation = {
    question: '本ハーネスへ転記した平均場2項の分離式(2式2未知数の線形解)と核の定義が、' +
      '第158便 zw2.perScale.*.separation の値を bit 一致で再現するか',
    method: '第158便 raw.neb.dragProbes の生行(omDragAnalytic)から Ω̄_drag(q) を再計算し、' +
      '同じ核 x_b=R̄/(R̄+r̄)・x_c=Rc/(Rc+r̄) で連立を解いて第158便 JSON の収載値と厳密比較する' +
      '(シミュレーションは行わない)',
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
// (b) 第163便 coreshell6 の 2項複合予測(Ω_crit・q₅₀_pred・参考予測・アンカー摂動)を、
//     本ハーネスの (T5′) と二分法ソルバへ coreshell6 のアンカーを通して再計算する。
{
  const rows = [];
  try {
    const anchorQ50 = CS6.predictedBeforeMeasurement.anchor.q50;   // 第154便 env×1 実測 q₅₀(機械読取)
    const refP = nebParamsOf(NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY));
    const crit = omegaDragNeb(refP, anchorQ50);
    rows.push({ item: 'Ω_crit(coreshell6 のアンカーで決めた臨界値)',
      identical: crit === CS6.predictedBeforeMeasurement.omegaCrit,
      mine: crit, theirs: CS6.predictedBeforeMeasurement.omegaCrit });
    for (const pa of CS6.predictedBeforeMeasurement.arms) {
      const a = NEB_ARMS.find(x => x.key === pa.armKey);
      const p = nebParamsOf(a);
      const two = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
      rows.push({ item: `q₅₀_pred(2項複合) ${pa.armKey}`,
        identical: two.q === pa.predictedQ50.twoTerm,
        mine: two.q, theirs: pa.predictedQ50.twoTerm });
      rows.push({ item: `q₅₀_pred(単一項・コア核) ${pa.armKey}`,
        identical: predSingleTerm(anchorQ50, refP.xc, p.xc) === pa.predictedQ50.singleTerm,
        mine: predSingleTerm(anchorQ50, refP.xc, p.xc), theirs: pa.predictedQ50.singleTerm });
      rows.push({ item: `q₅₀_pred(旧式) ${pa.armKey}`,
        identical: (anchorQ50 + (qEffLegacy(p.Rbar, p.rBar) - qEffLegacy(refP.Rbar, refP.rBar)))
          === pa.predictedQ50.legacy,
        mine: anchorQ50 + (qEffLegacy(p.Rbar, p.rBar) - qEffLegacy(refP.Rbar, refP.rBar)),
        theirs: pa.predictedQ50.legacy });
      rows.push({ item: `共有パラメータ(核・振幅) ${pa.armKey}`,
        identical: p.xb === pa.kernels.xBase && p.xc === pa.kernels.xCore &&
          p.Rbar === pa.kernels.kernelRadiusBase && p.Rc === pa.kernels.kernelRadiusCore &&
          p.rBar === pa.kernels.rBar && p.Ab === pa.amplitudes.base && p.Ac === pa.amplitudes.core,
        mine: { xb: p.xb, xc: p.xc, Ab: p.Ab, Ac: p.Ac, Rbar: p.Rbar, Rc: p.Rc, rBar: p.rBar },
        theirs: { xb: pa.kernels.xBase, xc: pa.kernels.xCore, Ab: pa.amplitudes.base,
          Ac: pa.amplitudes.core, Rbar: pa.kernels.kernelRadiusBase,
          Rc: pa.kernels.kernelRadiusCore, rBar: pa.kernels.rBar } });
    }
    // アンカー ±0.05 摂動(coreshell6 bw3)の再現 — 本便の併記 (c) の比較相手になる値
    for (const pert of (CS6.predictedBeforeMeasurement.anchorPerturbation || [])) {
      const critP = omegaDragNeb(refP, pert.anchorQ50);
      for (const armRec of pert.arms) {
        const p = nebParamsOf(NEB_ARMS.find(x => x.key === armRec.armKey));
        const s = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), critP);
        rows.push({ item: `アンカー摂動 ${pert.anchorShift > 0 ? '+' : ''}${pert.anchorShift} の ${armRec.armKey} 予測`,
          identical: s.q === armRec.twoTerm, mine: s.q, theirs: armRec.twoTerm });
      }
    }
  } catch (e) { out.checks.wave163TranscriptionError = String(e && e.message); }
  out.checks.transcriptionReproducesWave163Prediction = {
    question: '本ハーネスへ転記した (T5′) 2項複合式・参考予測式・決定的二分法ソルバと、第158便から' +
      '機械読取した共有パラメータ(核 x_b・x_c と振幅 A_b・A_c)が、第163便 coreshell6 の予測ブロック' +
      '(Ω_crit・両アームの q₅₀_pred・参考予測・アンカー ±0.05 摂動)を bit 一致で再現するか',
    method: 'coreshell6 と同じ入力(coreshell6 のアンカー q₅₀ = 第154便 env×1 実測値・第158便の分離振幅)を' +
      '本ハーネスの関数へ通して再計算し、coreshell6 JSON の収載値と厳密比較する(シミュレーションは行わない)',
    anchorQ50FromWave163: CS6.predictedBeforeMeasurement ? CS6.predictedBeforeMeasurement.anchor.q50 : null,
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
out.checks.solverMatchesWave163 = {
  mine: SOLVER,
  wave163: (CS6.manifest && CS6.manifest.numerics) ? CS6.manifest.numerics.solver : null,
  identical: (CS6.manifest && CS6.manifest.numerics && CS6.manifest.numerics.solver)
    ? JSON.stringify(canonize(SOLVER)) === JSON.stringify(canonize(CS6.manifest.numerics.solver)) : null };
out.checks.fitGridMatchesWave163 = {
  mine: Q50_GRID,
  wave163: CS6.q50 ? CS6.q50.fitGrid : null,
  identical: CS6.q50 ? JSON.stringify(canonize(Q50_GRID)) === JSON.stringify(canonize(CS6.q50.fitGrid)) : null,
  note: 'q₅₀ の当てはめ格子が第163便と 1 bit も違わないこと(採点定義の転記が正しい機械証拠)。' +
    '**掃引点の刻みだけを 0.05→0.025 に変え、当てはめ格子は変えていない**' };
out.checks.scoringDefinitionMatchesWave163 = {
  question: '採点定義(loss・keepR 規約・当てはめモデル・INCONCLUSIVE 規則)が coreshell6 と同一文言か',
  mine: PRE_REGISTERED.scoringDefinition,
  wave163: CS6.preRegistered ? CS6.preRegistered.scoringDefinition : null,
  identicalFields: CS6.preRegistered && CS6.preRegistered.scoringDefinition
    ? ['loss', 'keepR', 'model', 'fitMethod', 'inconclusive'].map(k => ({ field: k,
        identical: PRE_REGISTERED.scoringDefinition[k] === CS6.preRegistered.scoringDefinition[k] }))
    : null,
  note: '「declaredBefore」「source」は便名を含むので比較対象から外し、採点そのものを決める5項目を比べる' };
out.checks.scoringDefinitionMatchesWave163.allIdentical =
  out.checks.scoringDefinitionMatchesWave163.identicalFields
    ? out.checks.scoringDefinitionMatchesWave163.identicalFields.every(e => e.identical) : null;

log(`\n===== ① 転記照合(シミュレーション不要・掃引前)=====`);
log(`  第158便 ZW2 分離振幅の再現: ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}`);
log(`  第163便 予測ブロックの再現: ${out.checks.transcriptionReproducesWave163Prediction.nIdentical}/${out.checks.transcriptionReproducesWave163Prediction.nCompared}`);
log(`  当てはめ格子が第163便と同一: ${out.checks.fitGridMatchesWave163.identical} / ソルバ同一: ${out.checks.solverMatchesWave163.identical} / 採点定義同一: ${out.checks.scoringDefinitionMatchesWave163.allIdentical}`);

// ---- ② 封①: 精細格子・採点定義・「精細化」宣言を掃引前に固定して書き出す --------------------
const gridCenters = {};
for (const a of NEB_ARMS) {
  const s = CS6.q50.summary[a.cs6Key];
  gridCenters[a.key] = { center: s ? s.q50 : null, fitResult: s ? s.result : null,
    source: `coreshell6-results.json: q50.summary.${a.cs6Key}.q50`,
    wave163Grid: CS6.q50.gridPerArm ? [CS6.q50.gridPerArm[a.cs6Key][0],
      CS6.q50.gridPerArm[a.cs6Key][CS6.q50.gridPerArm[a.cs6Key].length - 1]] : null,
    wave163Step: 0.05 };
}
const sweepGrids = Object.fromEntries(NEB_ARMS.map(a =>
  [a.key, gridCenters[a.key].center === null ? null : makeGrid(gridCenters[a.key].center)]));

const preRegistrationBlock = {
  declaredBefore: '**どのアームの掃引よりも前**に固定し OUT_PATH へ書き出したブロックである(封①)',
  refinementDeclaration: PRE_REGISTERED.honestFraming,
  windows: { EW1: PRE_REGISTERED.EW1, EW2: PRE_REGISTERED.EW2, EW3: PRE_REGISTERED.EW3 },
  scoringDefinition: PRE_REGISTERED.scoringDefinition,
  sweepGridDefinition: PRE_REGISTERED.sweepGridDefinition,
  gridCenters, sweepGrids,
  runProtocol: { steps: NEB_STEPS, dt: 0.016, seed: 20260804, validT: 48,
    keepR: Object.fromEntries(NEB_ARMS.map(a => [a.key, a.keepR])),
    note: '第154便・第158便・第163便の 🐚 走行規約と同一(seed・步数・窓・keepR 規約)' },
  amplitudeSource: Object.fromEntries(NEB_ARMS.map(a => [a.key, nebParamsOf(a)])),
  amplitudeSourceNote: '予測に使う振幅・核は第158便 ZW2 の収載値(機械読取)。**本便では解き直さない**',
};
out.preRegistrationSeal = {
  canonicalization: 'preRegistrationBlock を再帰キー整列した JSON の SHA-256',
  sha256AtSealTime: canonSha(preRegistrationBlock),
  writtenToDiskBeforeAnySweep: false, sha256AtFinalWrite: null, unchanged: null,
  note: '掃引格子・採点定義・事前登録窓・「精細化」宣言を、**どのアームの掃引よりも前**に' +
    'ディスクへ書き出してから掃引を始める。最終書き出し時に正準化 SHA-256 を照合し、' +
    '実測後に格子・採点定義・窓を書き換えていないことの機械証拠とする' };
out.preRegistrationBlock = preRegistrationBlock;

log(`\n===== ② 封①(掃引前の格子・採点定義・宣言の固定)=====`);
for (const a of NEB_ARMS) {
  const g = sweepGrids[a.key];
  log(`  ${a.key.padEnd(6)} 中心=${fmt(gridCenters[a.key].center)}(coreshell6 実測・0.05 格子) → 掃引格子 [${g ? g[0] : '—'} … ${g ? g[g.length - 1] : '—'}] (${GRID_N}点・刻み ${GRID_STEP})`);
}
out.meta.stage = 'pre-registration-sealed-before-sweep';
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
out.preRegistrationSeal.writtenToDiskBeforeAnySweep = true;
log(`  → 封① を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.preRegistrationSeal.sha256AtSealTime.slice(0, 16)}…)`);

// ---- ②′ 🐚 引きずりプローブの再走行(第158便収載値の bit 再現確認 — 予測には使わない)---------
if (doSec('probe')) {
  const dragProbes = {};
  log(`\n===== ②′ 🐚 引きずりプローブ再走行(q=${NEB_PROBE_QS.join(',')} × env×${NEB_ARMS.map(a => a.envScale).join(',×')})=====`);
  for (const a of NEB_ARMS) for (const q of NEB_PROBE_QS) {
    const t0 = Date.now();
    const pr = await nebDragProbe(q, a.envScale);
    dragProbes[`env${a.envScale}_${tagQ(q)}`] = pr;
    out.meta.timings[`probe:env${a.envScale}_${tagQ(q)}`] = (Date.now() - t0) / 1000;
    const mean = pr.rows.reduce((x, e) => x + e.omDragAnalytic, 0) / pr.rows.length;
    log(`  env×${a.envScale} q=${pr.q} R̄=${fmt(pr.RbarClump, 4)} ⟨r⟩=${fmt(pr.envMeanR, 3)} Ω̄_drag=${mean.toExponential(6)} nEnv=${pr.nEnv}`);
  }
  out.raw.probe = { probeQs: NEB_PROBE_QS, dragProbes,
    note: '1步プローブの再走行。**q₅₀ の掃引実測ではない**。第158便 ZW2 の収載値と bit 照合するための' +
      '整合確認であり、予測には第158便 JSON の収載値をそのまま使う' };

  const cmp = [];
  const dropRowsJ = (pr) => JSON.stringify({ q: pr.q, RbarClump: pr.RbarClump, envMeanR: pr.envMeanR,
    meanDragOverKepler: pr.meanDragOverKepler, medianDragOverKepler: pr.medianDragOverKepler,
    meanMeasuredOverKepler: pr.meanMeasuredOverKepler, nEnv: pr.nEnv, rows: pr.rows });
  for (const a of NEB_ARMS) for (const q of NEB_PROBE_QS) {
    const mine = dragProbes[`env${a.envScale}_${tagQ(q)}`];
    const theirs = CS5.raw.neb.dragProbes[`env${a.envScale}_q${q.toFixed(2)}`];
    if (mine && theirs) cmp.push({ label: `🐚引きずりプローブ env×${a.envScale} q=${q}`,
      identical: dropRowsJ(mine) === dropRowsJ(theirs) });
  }
  out.checks.probeReproduction = {
    question: '本便の index.html が第158便と同じ引きずりプローブ値を出すか(= 予測入力である分離振幅が' +
      '今の対象実体でも成り立つことの機械確認)',
    comparisons: cmp, nCompared: cmp.length, nIdentical: cmp.filter(e => e.identical).length,
    allIdentical: cmp.length ? cmp.every(e => e.identical) : null,
    note: '一致しない場合でも予測は事前登録どおり第158便収載値で立てる(実測後に入力を差し替えない)。' +
      '不一致はそのまま収載し、EW2 の解釈上の注記とする。本便は掃引格子が coreshell6/第154便と' +
      '共有点を持たないので、**エンジン同一性の主たる機械証拠はこのプローブ再現と対照の bit 一致である**',
    quickNote: QUICK ? '煙試験(CS7_QUICK)でもプローブは1步なので本番と同値のはず' : null };
  log(`  第158便プローブとの bit 一致: ${out.checks.probeReproduction.nIdentical}/${out.checks.probeReproduction.nCompared}`);
}

// ---- ③ env×1(アンカー構成)の精細掃引 -------------------------------------------------------
out.raw.neb = { steps: NEB_STEPS, keepR0: NEB_KEEP_R0, armDefs: NEB_ARMS,
  gridPerArm: sweepGrids, gridCenters,
  note: '掃引格子はアームごとに **coreshell6 の 0.05 格子実測 q₅₀ を中心**に置いた21点(0.025 刻み)。' +
    '格子は封①で固定されており実測後に動かしていない',
  arms: {} };

const sweepArm = async (a) => {
  const grid = sweepGrids[a.key];
  if (!grid) { log(`\n(!) ${a.key}: 格子中心が読めなかったので掃引しない`); return null; }
  const runs = {};
  log(`\n===== 🐚 ${a.label}: ${grid.length} 構成 × ${NEB_STEPS}步(0.025 刻み)=====`);
  for (const q of grid)
    await runNeb(tagQ(q), { kFrame: 1, q, envScale: a.envScale, keepR: a.keepR }, runs, a.key);
  out.raw.neb.arms[a.key] = { arm: { kFrame: 1, kRep: '実値(0.3)', envScale: a.envScale,
    keepR: a.keepR, group: a.group, label: a.label }, grid, runs };
  return runs;
};

const ARM1 = NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY);
const ARM2 = NEB_ARMS.find(a => a.key !== NEB_ANCHOR_KEY);

let anchorFit = null;
if (doSec('neb')) {
  log(`\n===== ③ 精細アンカーの取得(env×1 の 0.025 掃引)=====`);
  const runs1 = await sweepArm(ARM1);
  if (runs1) anchorFit = fitLogisticQ50(nebTable(runs1));
}

// ---- ④ 封②: 精細アンカーで予測を立て、**env×2 の掃引前に**書き出す --------------------------
const q50Ref = anchorFit ? anchorFit.q50 : null;
const refP = nebParamsOf(ARM1);
const omegaCrit = q50Ref === null ? null : omegaDragNeb(refP, q50Ref);

const predArms = [];
for (const a of NEB_ARMS) {
  const p = nebParamsOf(a);
  const two = q50Ref === null ? { q: null, bracketed: false }
    : solveMonotoneDecreasing((q) => omegaDragNeb(p, q), omegaCrit);
  const pred = two.q;
  predArms.push({
    armKey: a.key, label: a.label, group: a.group, envScale: a.envScale, keepR: a.keepR,
    isAnchorArm: a.key === NEB_ANCHOR_KEY,
    judgedByEW2: a.key !== NEB_ANCHOR_KEY,
    anchorRecoveryNote: a.key === NEB_ANCHOR_KEY
      ? '**このアームはアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる**。' +
        'EW2 の判定には使わず、恒等性の自己点検としてのみ収載する'
      : '**アンカーに使っていない構成**。EW2 の判定対象はこのアームである(0.025 格子の実測値は' +
        'この予測を書き出した時点ではまだ測られていない)',
    kernels: { xBase: p.xb, xCore: p.xc, kernelRadiusBase: p.Rbar, kernelRadiusCore: p.Rc, rBar: p.rBar },
    amplitudes: { base: p.Ab, core: p.Ac },
    amplitudeSource: p.sourcePath,
    predictedQ50: {
      twoTerm: pred,
      singleTerm: q50Ref === null ? null : predSingleTerm(q50Ref, refP.xc, p.xc),
      singleTermAmplitude: q50Ref === null ? null
        : predSingleTermAmplitude(q50Ref, refP.xc, refP.Ac, p.xc, p.Ac),
      singleTermBaseKernel: q50Ref === null ? null : predSingleTerm(q50Ref, refP.xb, p.xb),
      legacy: q50Ref === null ? null
        : q50Ref + (qEffLegacy(p.Rbar, p.rBar) - qEffLegacy(refP.Rbar, refP.rBar)),
    },
    twoTermSolve: { bracketed: two.bracketed,
      residualOmega: two.residual === undefined ? null : two.residual,
      omegaDragAtPrediction: pred === null ? null : omegaDragNeb(p, pred) },
    sweepGrid: sweepGrids[a.key],
    sweepGridNote: 'この格子は封①(掃引前)で固定した。予測とは独立に決まっており、実測後に動かさない',
    wave163Prediction: (CS6.predictedBeforeMeasurement.arms.find(x => x.armKey === a.key) || {}).predictedQ50 || null,
  });
}
// アンカーの不確かさ(±0.025 = 本便の掃引刻み)を予測へ伝播させた場合の幅 — 併記 (c)
const anchorPerturbation = q50Ref === null ? null : [-GRID_STEP, GRID_STEP].map(d => {
  const qa = q50Ref + d;
  const crit = omegaDragNeb(refP, qa);
  return { anchorShift: d, anchorQ50: qa,
    arms: NEB_ARMS.map(a => {
      const p = nebParamsOf(a);
      const s = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
      return { armKey: a.key, twoTerm: s.q };
    }) };
});

const predictionBlock = {
  declaredBefore: '**env×2 の掃引実測より前**に計算し、OUT_PATH へ書き出した予測である' +
    '(手順は preRegistered.procedure ④。書き出し後は 1 bit も変更しない — predictionIntegrity で照合)',
  notBlindReminder: '**本便は盲検ではない**。env×2 の 0.05 格子 q₅₀(1.5350)は既知であり、' +
    '未知なのは 0.025 格子の実測値だけである(preRegistered.honestFraming)',
  formula: '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を Ω_crit = Ω̄_drag(env×1; 精細アンカー q₅₀) に' +
    '等しくする q を決定論的二分法で解く。A_b・A_c・x_b・x_c は第158便 zw2.perScale.* の機械読取値',
  solver: SOLVER,
  anchor: { armKey: NEB_ANCHOR_KEY, q50: q50Ref,
    fitResult: anchorFit ? anchorFit.result : null,
    source: '本便 q50.arms.env1.fit.q50(③で実測した 0.025 刻み・21点格子の値)',
    grid: sweepGrids[NEB_ANCHOR_KEY], nPoints: anchorFit ? anchorFit.nPoints : null,
    wave163AnchorQ50: CS6.predictedBeforeMeasurement ? CS6.predictedBeforeMeasurement.anchor.q50 : null,
    wave163AnchorSource: 'coreshell6 は第154便の 11点・0.1 刻み格子の q₅₀(1.6500)をアンカーにした。' +
      '本便のアンカーは 0.025 刻み・21点格子の実測値で、**刻みが 4 倍細かい**',
    note: 'アンカーは未知の Ω_crit を代数的に消去するための代入である(較正自由度ではない)' },
  omegaCrit, refParams: refP,
  wave163OmegaCrit: CS6.predictedBeforeMeasurement ? CS6.predictedBeforeMeasurement.omegaCrit : null,
  arms: predArms,
  anchorPerturbation,
  anchorPerturbationNote: `アンカーを ±${GRID_STEP}(= 本便の掃引刻み)ずらした場合の 2項複合予測` +
    '(**記述のみ**・EW2 の判定には使わない)。coreshell6 の ±0.05 摂動と並べて併記 (c) で読む',
  referenceOnly: 'singleTerm / singleTermAmplitude / singleTermBaseKernel / legacy は参考併記であり、' +
    'EW2 の判定は twoTerm のみで行う',
};
out.predictedBeforeMeasurement = predictionBlock;
out.predictionIntegrity = {
  canonicalization: 'predictedBeforeMeasurement を再帰キー整列した JSON の SHA-256',
  sha256AtPredictionTime: canonSha(predictionBlock),
  writtenToDiskBeforeEnv2Sweep: false, sha256AtFinalWrite: null, unchanged: null };

log(`\n===== ④ 封②(env×2 掃引前の予測固定)=====`);
log(`  精細アンカー ${NEB_ANCHOR_KEY} q₅₀_ref=${fmt(q50Ref)}(0.025 格子・${anchorFit ? anchorFit.result : '—'})` +
  ` [coreshell6 のアンカーは ${fmt(CS6.predictedBeforeMeasurement.anchor.q50)}]` +
  ` / Ω_crit=${omegaCrit === null ? '—' : omegaCrit.toExponential(6)}`);
for (const a of predArms)
  log(`  ${a.armKey.padEnd(6)} 2項複合 q₅₀_pred=${fmt(a.predictedQ50.twoTerm)}${a.isAnchorArm ? '(恒等 — アンカー構成)' : '  ← EW2 判定対象'} ` +
    `(参考 単一項=${fmt(a.predictedQ50.singleTerm)} 単一項+振幅=${fmt(a.predictedQ50.singleTermAmplitude)} 基底核単一項=${fmt(a.predictedQ50.singleTermBaseKernel)} 旧式=${fmt(a.predictedQ50.legacy)})` +
    ` [coreshell6 の 2項複合予測=${fmt(a.wave163Prediction ? a.wave163Prediction.twoTerm : null)}]`);
out.meta.stage = 'prediction-recorded-before-env2-sweep';
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
out.predictionIntegrity.writtenToDiskBeforeEnv2Sweep = true;
log(`  → 予測を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.predictionIntegrity.sha256AtPredictionTime.slice(0, 16)}…)。以降、env×2 を実測する`);

// ---- ⑤ env×2 の精細掃引(EW2 の対象)---------------------------------------------------------
if (doSec('neb')) {
  log(`\n===== ⑤ EW2 対象アームの精細掃引(env×2)=====`);
  await sweepArm(ARM2);
}

// ---- 対照(kFrame=0 × kRep=0 の bit 一致 — 記述。窓ではない)------------------------------------
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照 — 記述)=====`);
  await runNeb('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl, 'ctl');
  await runNeb('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl, 'ctl');
  await runNeb('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl, 'ctl');
  await runNeb('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl, 'ctl');
  out.raw.ctl = { runs: ctl,
    note: 'kFrame=0(引きずり経路を閉じる)かつ kRep=0(E5′ スピン斥力経路を閉じる)なら、q や Ω_c を' +
      '振っても外殻の力学は 1 bit も変わらないはず。**事前登録窓の外の記述**であり判定には使わない。' +
      '本便では第154/158/163便との bit 一致照合を通じてエンジン同一性の証拠を兼ねる' };
}
out.meta.stage = 'complete';

// ======================================= 集計・判定 =========================================
// 事前登録した規則をそのまま適用する(実測後に規則を変えない)。
const dynKeysNeb = ['clump', 'envelope', 'n', 'nan', 'clampV', 'clampS'];
const pickJ = (o, ks) => { const r = {}; for (const k of ks) r[k] = o[k]; return JSON.stringify(r); };
const fullJ = (o) => { const r = { ...o }; delete r.cfg; delete r.tag; return JSON.stringify(r); };

// ---- 各アームの q₅₀(事前登録した採点定義・封①で固定した格子)----
out.q50 = { fitGrid: Q50_GRID, gridPerArm: sweepGrids, gridCenters,
  scoringDefinition: PRE_REGISTERED.scoringDefinition,
  note: '掃引格子は**アームごとに coreshell6 の実測 q₅₀ を中心に置いた21点**(0.025 刻み・補間なし)。' +
    '格子は封①で固定し、実測後に動かしていない',
  arms: {} };
for (const a of NEB_ARMS) {
  const arm = out.raw.neb.arms[a.key];
  if (!arm) continue;
  const table = nebTable(arm.runs);
  const fit = (a.key === NEB_ANCHOR_KEY && anchorFit) ? anchorFit : fitLogisticQ50(table);
  out.q50.arms[a.key] = { label: a.label, group: a.group, envScale: a.envScale, keepR: a.keepR,
    grid: arm.grid, table, fit };
}
out.q50.summary = Object.fromEntries(Object.entries(out.q50.arms).map(([k, a]) =>
  [k, { label: a.label, group: a.group, q50: a.fit.q50, result: a.fit.result, width: a.fit.width,
    plateaus: [a.fit.plateauLowQ, a.fit.plateauHighQ], rmse: a.fit.rmse, nPoints: a.fit.nPoints,
    crossing0p5LinearInterp: a.fit.crossing0p5LinearInterp }]));
out.q50.gridsAsPreRegistered = Object.entries(out.q50.arms).every(([k, a]) =>
  sweepGrids[k] && a.table.length === sweepGrids[k].length &&
  a.table.every((e, i) => e.q === sweepGrids[k][i]));
out.q50.gridsAsPreRegisteredNote = '実測した掃引点が、封①で固定した格子と 1 点も違わないこと' +
  '(格子の事後変更が無いことの機械証拠)';
out.q50.anchorFitIsTheOneUsedForPrediction = {
  question: '④で予測に使ったアンカーの当てはめが、最終集計の env×1 当てはめと同一値か' +
    '(= 予測後に env×1 の当てはめをやり直していないことの機械証拠)',
  predictionAnchorQ50: q50Ref,
  finalEnv1Q50: out.q50.summary.env1 ? out.q50.summary.env1.q50 : null,
  identical: (out.q50.summary.env1 ? out.q50.summary.env1.q50 : null) === q50Ref };
// 参考: 粗格子(coreshell6 0.05 / 第154便 0.1)との並置 — **判定には使わない**記述
out.q50.resolutionLadder = Object.fromEntries(NEB_ARMS.map(a => {
  const w154 = CS6.q50.wave154Comparison ? CS6.q50.wave154Comparison[a.cs6Key] : null;
  const w163 = CS6.q50.summary[a.cs6Key] ? CS6.q50.summary[a.cs6Key].q50 : null;
  const here = out.q50.summary[a.key] ? out.q50.summary[a.key].q50 : null;
  return [a.key, {
    step0p100_wave154: w154 ? w154.wave154Q50 : null,
    step0p050_wave163: w163,
    step0p025_thisWave: here,
    diff_0p025_minus_0p050: (here === null || w163 === null) ? null : here - w163,
    diff_0p050_minus_0p100: (w163 === null || !w154 || w154.wave154Q50 === null) ? null
      : w163 - w154.wave154Q50 }];
}));
out.q50.resolutionLadderNote = '掃引刻み 0.1(第154便)→ 0.05(第163便)→ 0.025(本便)の q₅₀ 推移。' +
  '**記述のみ**(EW1 は 0.05 → 0.025 の差だけを窓に取る)';

// ---- EW1(格子整合): |q₅₀_fine − q₅₀_coreshell6| ≤ 0.05 ----
out.ew1 = { rule: PRE_REGISTERED.EW1, comparisons: [], verdict: null };
{
  const rows = [];
  for (const a of NEB_ARMS) {
    const armQ = out.q50.arms[a.key];
    const fit = armQ ? armQ.fit : null;
    const meas = fit ? fit.q50 : null;
    const raw = fit ? fit.q50Raw : null;
    const grid = sweepGrids[a.key];
    const gridLo = grid ? grid[0] : null, gridHi = grid ? grid[grid.length - 1] : null;
    const coarse = CS6.q50.summary[a.cs6Key] ? CS6.q50.summary[a.cs6Key].q50 : null;
    const outsideGrid = (raw === null || gridLo === null) ? null : (raw < gridLo || raw > gridHi);
    const absDiff = (meas === null || coarse === null) ? null : Math.abs(meas - coarse);
    let result, resultReason;
    if (fit === null || coarse === null) {
      result = 'INCONCLUSIVE'; resultReason = '当てはめまたは比較相手(coreshell6 の q₅₀)が無い';
    } else if (meas === null) {
      result = 'INCONCLUSIVE';
      resultReason = '当てはめが事前登録の INCONCLUSIVE 規則に掛かった: ' + (fit.note || '') +
        (outsideGrid ? `(当てはめ生値 q₅₀=${raw} は事前固定格子 [${gridLo},${gridHi}] の外)` : '');
    } else if (outsideGrid) {
      result = 'FAIL';
      resultReason = `当てはめは成立したが q₅₀ が封①で固定した掃引格子 [${gridLo},${gridHi}] の外に出た` +
        '(= 格子が q₅₀ を挟めていない)。事前登録どおり格子は動かさず、EW1 は FAIL 扱いとする';
    } else {
      result = absDiff <= PRE_REGISTERED.EW1.tolerance ? 'PASS' : 'FAIL';
      resultReason = null;
    }
    rows.push({ armKey: a.key, label: a.label,
      q50Fine: meas, q50FineRaw: raw, fineFitResult: fit ? fit.result : null,
      q50Coarse_wave163: coarse, coarseGridStep: 0.05, fineGridStep: GRID_STEP,
      sweepGridRange: grid ? [gridLo, gridHi] : null,
      measuredWithinGrid: outsideGrid === null ? null : !outsideGrid,
      signedDiff: (meas === null || coarse === null) ? null : (meas - coarse),
      absDiff, tolerance: PRE_REGISTERED.EW1.tolerance,
      withinTolerance: absDiff === null ? null : (absDiff <= PRE_REGISTERED.EW1.tolerance),
      result, resultReason });
  }
  out.ew1.comparisons = rows;
  out.ew1.verdict = { window: PRE_REGISTERED.EW1.window, tolerance: PRE_REGISTERED.EW1.tolerance,
    result: rows.length ? (rows.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
      : (rows.every(e => e.result === 'PASS') ? 'PASS' : 'FAIL')) : null,
    perArm: rows.map(e => ({ armKey: e.armKey, q50Fine: e.q50Fine, q50Coarse: e.q50Coarse_wave163,
      absDiff: e.absDiff, result: e.result })) };
}

// ---- EW2(主窓): |q₅₀_meas(env×2) − q₅₀_pred(2項複合・精細アンカー)| ≤ 0.10 ----
out.ew2 = { rule: PRE_REGISTERED.EW2, comparisons: [], verdict: null, coRecorded: {} };
{
  const rows = [];
  for (const pa of predArms) {
    const armQ = out.q50.arms[pa.armKey];
    const fit = armQ ? armQ.fit : null;
    const meas = fit ? fit.q50 : null;
    const raw = fit ? fit.q50Raw : null;
    const pred = pa.predictedQ50.twoTerm;
    const grid = pa.sweepGrid;
    const gridLo = grid ? grid[0] : null, gridHi = grid ? grid[grid.length - 1] : null;
    const outsideGrid = (raw === null || gridLo === null) ? null : (raw < gridLo || raw > gridHi);
    const absDiff = (meas === null || pred === null) ? null : Math.abs(meas - pred);
    const d = (v) => (v === null || v === undefined || meas === null) ? null : Math.abs(v - meas);
    let result, resultReason;
    if (!pa.judgedByEW2) {
      result = 'NOT-JUDGED';
      resultReason = 'アンカー構成(予測は恒等)なので EW2 の判定対象外 — 恒等性の自己点検として収載する';
    } else if (pred === null || fit === null) {
      result = 'INCONCLUSIVE'; resultReason = '予測または当てはめが立たなかった';
    } else if (meas === null) {
      result = 'INCONCLUSIVE';
      resultReason = '当てはめが事前登録の INCONCLUSIVE 規則に掛かった: ' + (fit.note || '') +
        (outsideGrid ? `(当てはめ生値 q₅₀=${raw} は事前固定格子 [${gridLo},${gridHi}] の外)` : '');
    } else if (outsideGrid) {
      result = 'FAIL';
      resultReason = `当てはめは成立したが q₅₀ が封①で固定した掃引格子 [${gridLo},${gridHi}] の外に出た` +
        '(= 格子が q₅₀ を挟めていない)。事前登録どおり格子は動かさず、EW2 は FAIL 扱いとする';
    } else {
      result = absDiff <= PRE_REGISTERED.EW2.tolerance ? 'PASS' : 'FAIL';
      resultReason = null;
    }
    const w163 = CS6.bw1 && CS6.bw1.comparisons
      ? CS6.bw1.comparisons.find(e => e.armKey === pa.armKey) : null;
    rows.push({
      armKey: pa.armKey, label: pa.label, group: pa.group,
      isAnchorArm: pa.isAnchorArm, judgedByEW2: pa.judgedByEW2,
      anchorRecoveryNote: pa.anchorRecoveryNote,
      kernels: pa.kernels, amplitudes: pa.amplitudes,
      predictedQ50: pa.predictedQ50,
      measuredQ50: meas, measuredQ50Raw: raw, measuredFitResult: fit ? fit.result : null,
      sweepGridRange: grid ? [gridLo, gridHi] : null,
      measuredWithinGrid: outsideGrid === null ? null : !outsideGrid,
      signedDiff: (meas === null || pred === null) ? null : (meas - pred),
      absDiff, tolerance: PRE_REGISTERED.EW2.tolerance,
      withinTolerance: absDiff === null ? null : (absDiff <= PRE_REGISTERED.EW2.tolerance),
      result, resultReason,
      // 併記 (a): より厳しい 0.05 の目安に入るか(**判定に使わない**)
      withinTighter0p05: absDiff === null ? null : (absDiff <= 0.05),
      tighterThreshold: 0.05,
      // 併記 (d): 旧式との |差|、および参考予測式との |差|(**判定に使わない**)
      referenceAbsDiff: { singleTerm: d(pa.predictedQ50.singleTerm),
        singleTermAmplitude: d(pa.predictedQ50.singleTermAmplitude),
        singleTermBaseKernel: d(pa.predictedQ50.singleTermBaseKernel),
        legacy: d(pa.predictedQ50.legacy) },
      referenceNote: '参考予測との |差|(**窓判定には使わない** — EW2 は twoTerm のみ)',
      wave163: w163 ? { predictedTwoTerm: w163.predictedQ50.twoTerm, measured: w163.measuredQ50,
        absDiff: w163.absDiff, result: w163.result,
        note: 'coreshell6(0.05 格子・アンカー 1.6500)の同アームの値。並置は記述のみ' } : null,
    });
  }
  out.ew2.comparisons = rows;
  const judged = rows.filter(e => e.judgedByEW2);
  out.ew2.verdict = { window: PRE_REGISTERED.EW2.window, tolerance: PRE_REGISTERED.EW2.tolerance,
    judgedArms: judged.map(e => e.armKey),
    result: judged.length ? (judged.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
      : (judged.every(e => e.result === 'PASS') ? 'PASS' : 'FAIL')) : null,
    perArm: rows.map(e => ({ armKey: e.armKey, judgedByEW2: e.judgedByEW2,
      predictedTwoTerm: e.predictedQ50.twoTerm, measured: e.measuredQ50,
      absDiff: e.absDiff, result: e.result })),
    note: '判定対象は env×2 の1アームのみ(env×1 は恒等予測なので NOT-JUDGED)' };

  // ---- 併記(記述・判定外)-------------------------------------------------------------------
  const measOf = (k) => (out.q50.arms[k] ? out.q50.arms[k].fit.q50 : null);
  // (a) 0.05 の目安
  out.ew2.coRecorded.a_tighter0p05 = {
    item: '(a) |差| ≤ 0.05 に入るか(**記述のみ** — 判定は 0.10 のまま)',
    threshold: 0.05,
    arms: rows.map(e => ({ armKey: e.armKey, judgedByEW2: e.judgedByEW2, absDiff: e.absDiff,
      within0p05: e.withinTighter0p05 })),
    wave163Comparison: CS6.bw1 && CS6.bw1.comparisons
      ? CS6.bw1.comparisons.map(e => ({ armKey: e.armKey, absDiff: e.absDiff,
          within0p05: e.absDiff === null ? null : e.absDiff <= 0.05 })) : null,
    note: 'coreshell6 の env×2 は |差| 0.0554 で 0.05 に僅かに届かなかった。' +
      'アンカーを精細化した本便でどう動いたかを記述する' };
  // (b) 逆向きアンカー(env×2 の精細実測を基準に env×1 を予測)— **事後の記述**
  {
    const mirrorRef = measOf(ARM2.key);
    if (mirrorRef === null) {
      out.ew2.coRecorded.b_mirrorAnchoring = { item: '(b) 逆向きアンカー(env×2 基準 → env×1 予測)',
        available: false, note: 'env×2 の当てはめが立たなかったので計算できない' };
    } else {
      const mp = nebParamsOf(ARM2);
      const crit = omegaDragNeb(mp, mirrorRef);
      const arms = NEB_ARMS.map(a => {
        const p = nebParamsOf(a);
        const s = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
        const m = measOf(a.key);
        return { armKey: a.key, twoTerm: s.q, bracketed: s.bracketed, measured: m,
          absDiff: (s.q === null || m === null) ? null : Math.abs(m - s.q),
          isMirrorAnchorArm: a.key === ARM2.key };
      });
      const w163m = CS6.bw3 && CS6.bw3.mirrorAnchoring ? CS6.bw3.mirrorAnchoring.absDiffVsMeasured : null;
      out.ew2.coRecorded.b_mirrorAnchoring = {
        item: '(b) 逆向きアンカー(env×2 の**精細実測**を基準に env×1 を予測)',
        available: true, anchorArmKey: ARM2.key, anchorQ50: mirrorRef, omegaCrit: crit, arms,
        wave163: w163m,
        postHocCaveat: '**この向きの計算は env×2 の実測値を使うので、本質的に事後(post-hoc)の記述で' +
          'ある**。EW2 の判定には一切使わない',
        note: 'この向きでは env×1 が非恒等の予測対象になるので、式の当てはまりを別角度から読める' };
    }
  }
  // (c) アンカー ±0.025 摂動の予測振れ幅(coreshell6 の ±0.05 と比較)
  {
    const ap = out.predictedBeforeMeasurement.anchorPerturbation;
    const w163sp = CS6.bw3 ? CS6.bw3.anchorPerturbationSpread : null;
    const spread = ap ? Object.fromEntries(NEB_ARMS.map(a => {
      const vs = ap.map(e => (e.arms.find(x => x.armKey === a.key) || {}).twoTerm)
        .filter(v => v !== null && v !== undefined);
      const s = vs.length === 2 ? Math.abs(vs[1] - vs[0]) : null;
      const w = w163sp && w163sp[a.key] ? w163sp[a.key].spread : null;
      return [a.key, { atMinusStep: vs[0] === undefined ? null : vs[0],
        atPlusStep: vs[1] === undefined ? null : vs[1], spread: s,
        wave163SpreadAtPm0p05: w,
        ratioThisOverWave163: (s === null || w === null || w === 0) ? null : s / w,
        improvementFactor: (s === null || w === null || s === 0) ? null : w / s }];
    })) : null;
    out.ew2.coRecorded.c_anchorPerturbation = {
      item: `(c) アンカー ±${GRID_STEP} 摂動の予測振れ幅(coreshell6 の ±0.05 と比較)`,
      thisWaveShift: GRID_STEP, wave163Shift: 0.05,
      perturbation: ap, spread,
      toleranceForReference: PRE_REGISTERED.EW2.tolerance,
      note: 'アンカー自身の不確かさが予測へどう伝播するかの目安。coreshell6 は ±0.05 で env×1 0.1000 / ' +
        'env×2 0.0925 の振れがあり、これが EW2 相当の許容 0.10 と同じ桁だったことが本便の動機である。' +
        'improvementFactor は「coreshell6 の振れ幅 ÷ 本便の振れ幅」(刻みを半分にした効果の実測)' };
  }
  // (d) 旧式との差
  out.ew2.coRecorded.d_legacyFormula = {
    item: '(d) 旧式 q*_eff=(3/2)(1+R̄/r̄) の差分予測と実測との |差|',
    formula: 'q₅₀_pred(旧式) = q₅₀_ref + [(3/2)(1+R̄/r̄)_var − (3/2)(1+R̄/r̄)_ref]',
    arms: rows.map(e => ({ armKey: e.armKey, judgedByEW2: e.judgedByEW2,
      legacyPrediction: e.predictedQ50.legacy, measured: e.measuredQ50,
      absDiffLegacy: e.referenceAbsDiff.legacy, absDiffTwoTerm: e.absDiff,
      twoTermCloser: (e.referenceAbsDiff.legacy === null || e.absDiff === null) ? null
        : e.absDiff < e.referenceAbsDiff.legacy })),
    wave163: CS6.bw3 && CS6.bw3.predictionTable ? CS6.bw3.predictionTable.map(e =>
      ({ armKey: e.armKey, legacy: e.legacy, measured: e.measuredQ50,
        absDiffLegacy: (e.legacy === null || e.measuredQ50 === null) ? null
          : Math.abs(e.measuredQ50 - e.legacy) })) : null,
    note: '**記述のみ**。旧式は R̄/r̄ の一次式で q の指数構造を持たないので、2項複合との優劣を' +
      'ここで並置する(判定には使わない)' };
  // 外挿の位置関係(第163便 bw3.extrapolationNote の踏襲 — 記述)
  out.ew2.coRecorded.extrapolationNote = {
    question: '分離振幅 A_b・A_c は q∈{1.5, 2.0} のちょうど2点から解いた値なので、その区間の外での ' +
      '(T5′) 評価は外挿にあたる。各アームの予測・実測がこの区間のどこに位置するかを記録する',
    interval: NEB_PROBE_QS,
    arms: predArms.map(a => ({ armKey: a.armKey, predictedTwoTerm: a.predictedQ50.twoTerm,
      predictionInsideProbeInterval: a.predictedQ50.twoTerm === null ? null
        : (a.predictedQ50.twoTerm >= NEB_PROBE_QS[0] && a.predictedQ50.twoTerm <= NEB_PROBE_QS[1]),
      measuredQ50: measOf(a.armKey),
      measurementInsideProbeInterval: measOf(a.armKey) === null ? null
        : (measOf(a.armKey) >= NEB_PROBE_QS[0] && measOf(a.armKey) <= NEB_PROBE_QS[1]) })) };
}

// ---- 対照の bit 一致(記述)----
out.controls = { window: null,
  note: '**事前登録窓の外の記述**。kFrame=0 × kRep=0 なら q や Ω_c を振っても外殻の力学は不変のはず。' +
    'コア状態(coreOmega 等)は Ω_c を振れば当然変わるので力学フィールドの一致が対照の本体',
  comparedFields: dynKeysNeb, bitIdentity: [] };
if (out.raw.ctl) {
  const r = out.raw.ctl.runs;
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

// ---- 過去便との共有点 bit 照合(記述 — 窓ではない)--------------------------------------------
// 本便の格子中心は 0.005 の奇数倍(1.655 / 1.535)なので、0.05 / 0.1 格子と共有する掃引点は無い。
// その事実は事前登録(sweepGridDefinition.sharedPointsNote)で宣言済みで、ここでは実測で確認する。
{
  const shared = [], add = [];
  try {
    if (out.raw.neb && CS6.raw && CS6.raw.neb && CS6.raw.neb.arms) {
      for (const a of NEB_ARMS) {
        const mineArm = out.raw.neb.arms[a.key], theirsArm = CS6.raw.neb.arms[a.cs6Key];
        if (!mineArm || !theirsArm) continue;
        const theirsByQ = new Map(Object.values(theirsArm.runs).map(r => [r.cfg.q, r]));
        let n = 0;
        for (const r of Object.values(mineArm.runs)) {
          const t = theirsByQ.get(r.cfg.q);
          if (!t) continue;
          n++;
          shared.push({ label: `🐚${a.key} q=${r.cfg.q}(vs 第163便)`,
            identical: pickJ(r, dynKeysNeb) === pickJ(t, dynKeysNeb) });
        }
        if (n === 0) shared.push({ label: `🐚${a.key}(第163便と共有する格子点なし)`, identical: null,
          note: '格子中心が 0.005 の奇数倍なので 0.05 格子と共有点を持たない — 比較不能' +
            '(事前登録 sweepGridDefinition.sharedPointsNote で宣言済み)' });
      }
    }
    // 対照の収載位置は便ごとに違う: 第163便は raw.ctl.runs、第158便は **raw.neb.controls** である
    // (第158便の raw.ctl.runs は ⚫blackHole 節の対照なので 🐚 とは別物 — 取り違えないよう明示指定する)。
    const CTL_SOURCES = [
      { wave: '第163便', path: 'raw.ctl.runs',
        runs: (CS6.raw && CS6.raw.ctl) ? CS6.raw.ctl.runs : null },
      { wave: '第158便', path: 'raw.neb.controls',
        runs: (CS5.raw && CS5.raw.neb) ? CS5.raw.neb.controls : null },
    ];
    for (const { wave, runs: ctlSrc } of CTL_SOURCES) {
      if (out.raw.ctl && ctlSrc) {
        for (const tag of Object.keys(out.raw.ctl.runs)) {
          if (ctlSrc[tag]) add.push({ label: `🐚対照 ${tag} vs ${wave}`,
            identical: pickJ(out.raw.ctl.runs[tag], dynKeysNeb) === pickJ(ctlSrc[tag], dynKeysNeb) });
        }
      }
    }
  } catch (e) { out.crossWaveError = String(e && e.message); }
  const roll = (arr) => { const cmp = arr.filter(e => e.identical !== null);
    return { comparisons: arr, nCompared: cmp.length,
      nIdentical: cmp.filter(e => e.identical).length,
      mismatches: cmp.filter(e => !e.identical).map(e => e.label),
      allIdentical: cmp.length ? cmp.every(e => e.identical) : null }; };
  out.crossWaveCheck = { window: null,
    source: 'tests/out/coreshell6-results.json(第163便)/ tests/out/coreshell5-results.json(第158便)',
    controlSourcePaths: { 第163便: 'raw.ctl.runs', 第158便: 'raw.neb.controls' },
    controlSourceNote: '対照の収載位置は便ごとに違う。第158便の raw.ctl.runs は ⚫blackHole 節の対照で' +
      '**🐚 とは別物**なので、第158便については raw.neb.controls を明示指定して比較している',
    note: '設定・格子点が一致する走行(同一プリセット・同一 seed・同一步数・同一ノブ)の力学フィールド ' +
      'bit 一致。**事前登録窓の外の記述**であり判定には使わない。本便の掃引格子は 0.05/0.1 格子と' +
      '共有点を持たないので(事前登録で宣言済み)、掃引点側の比較は「共有点なし」になる。' +
      'エンジン同一性の機械証拠は **対照の bit 一致**と **checks.probeReproduction** が担う',
    sharedSweepPoints: roll(shared), controls: roll(add) };
  if (QUICK) out.crossWaveCheck.quickNote = '煙試験(CS7_QUICK)では步数が 1/10 なので bit 一致は成立しない';
}

// ---- EW3: 決定性(2回実行ビット同一)----
{
  const target = { raw: out.raw, predictedBeforeMeasurement: out.predictedBeforeMeasurement || null };
  const mine = JSON.stringify(canonize(target));
  const rec = { canonicalization: PRE_REGISTERED.EW3.canonicalization,
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.CS7_DET_REF;
  if (refPath) {
    // 並行実行(2プロセス同時)に備えて、参照 JSON の生成を待てるようにする(既定 0 秒 = 待たない)。
    // 待ちは determinism の記録にしか関与せず、測定値には一切触れない。
    const waitSec = Number(process.env.CS7_DET_WAIT_SEC || 0);
    const deadline = Date.now() + waitSec * 1000;
    let other = null, tries = 0;
    while (true) {
      tries++;
      if (fs.existsSync(refPath)) {
        try {
          const j = JSON.parse(fs.readFileSync(refPath, 'utf8'));
          // 相手が「封①/封②だけ書き出した途中段階」のファイルなら完了まで待つ
          other = (j.meta && j.meta.stage === 'complete') ? j : null;
        } catch { other = null; }
      }
      if (other || Date.now() > deadline) break;
      await new Promise(r => setTimeout(r, 5000));
    }
    if (other) {
      const otherJ = JSON.stringify(canonize({ raw: other.raw || {},
        predictedBeforeMeasurement: other.predictedBeforeMeasurement || null }));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
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
out.ew3 = {
  rule: PRE_REGISTERED.EW3,
  sha256: out.determinism.sha256, reference: out.determinism.reference,
  identical: out.determinism.identical,
  result: out.determinism.identical === null ? 'PENDING(参照なし)'
    : (out.determinism.identical ? 'PASS' : 'FAIL') };

// ---- 封の自己点検(封①・封②が実測後に動いていないこと)----
{
  const nowPre = canonSha(out.preRegistrationBlock);
  out.preRegistrationSeal.sha256AtFinalWrite = nowPre;
  out.preRegistrationSeal.unchanged = (nowPre === out.preRegistrationSeal.sha256AtSealTime);
  if (out.predictedBeforeMeasurement) {
    const now = canonSha(out.predictedBeforeMeasurement);
    out.predictionIntegrity.sha256AtFinalWrite = now;
    out.predictionIntegrity.unchanged = (now === out.predictionIntegrity.sha256AtPredictionTime);
    out.predictionIntegrity.note = '予測ブロックの正準化 SHA-256 を「env×2 掃引前に書き出した時点」と' +
      '「最終書き出し時点」で比較する。一致していれば、env×2 の実測後に予測を書き換えていないことの' +
      '機械証拠になる';
  }
}

out.meta.elapsedSec = (Date.now() - T_START) / 1000;

// ---- 実験マニフェスト(第145便様式)----------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell7', wave: 168,
    title: 'コア外殻第7実験 — 🐚 q₅₀ 掃引の **0.025 刻み精細化**と精細アンカーによる 2項複合予測の再照合' +
      '(事前登録窓 EW1 格子整合 |0.025格子 − coreshell6 0.05格子| ≤ 0.05 / EW2 主窓 精細アンカー予測 vs ' +
      'env×2 精細実測 |差| ≤ 0.10 / EW3 決定性。併記 (a) 0.05 目安 (b) 逆向きアンカー ' +
      '(c) アンカー ±0.025 摂動 (d) 旧式 — いずれも記述)' +
      ' ※**盲検の前向き検証ではなく分解能向上フォローである**(preRegistered.honestFraming)',
    command: 'node tests/exp-coreshell7.mjs(節選択 CS7_ONLY=… / 出力先 CS7_OUT=… / ' +
      '決定性参照 CS7_DET_REF=… / 煙試験 CS7_QUICK=1)' },
  presets: { mode: 'builtin', ids: ['nebulaShell'],
    modifiedAtRuntime: 'kFrame / kRep / 影響範囲指数 q / core.omega 倍率 Ω_c を第154便・第158便・第163便と' +
      '同一の改変器で上書きし、エンベロープ ring の rIn/rOut(半径倍率 envScale)と保持しきい値 keepR を' +
      '上書きして build する。**倍率が 1 のときは ring の上書きを省く**(= プリセット実値のまま build' +
      'するので第154便の env×1 走行と build が同一になる)。keepR は測定器側のしきい値で力学に効かない。' +
      '改変内容は各 run.cfg / プローブの cfg に記録済み',
    note: 'seed はプリセット定義値(🐚 20260804)をそのまま使う' },
  numerics: {
    seed: { nebulaShell: 20260804, note: 'プリセット定義値(改変器は seed を触らない)' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { nebulaShell: NEB_STEPS, probes: '1步', quick: QUICK },
    window: { nebulaShell: 't=48(validT・第135便/第139便/第152便/第154便/第158便/第163便と同一窓)' },
    warmup: NOT_APPLICABLE,
    sweeps: { gridPerArm: sweepGrids, gridDefinition: PRE_REGISTERED.sweepGridDefinition,
      gridCenters, nebulaArms: NEB_ARMS.map(a => ({ key: a.key, group: a.group,
        envScale: a.envScale, keepR: a.keepR })),
      nebulaProbeQs: NEB_PROBE_QS },
    gridUniformity: '**アームごとに異なる格子**である(事前登録が「アームごとに coreshell6 実測 q₅₀ 中心」' +
      'を指定しているため)。アーム間の Δq₅₀ を直接比べる用途には使えない(本便の判定は各アーム単独の ' +
      '|実測−粗格子実測| と |実測−予測| なので影響しない)',
    q50FitGrid: Q50_GRID,
    solver: SOLVER,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセット nebulaShell の初期配置・質量・seed(第135便/第139便/第152便/第154便/第158便/' +
      '第163便と同一 — 本便で再フィットしない)',
      'dt=0.016', '窓(nebulaShell 3000步 = 第154便・第158便・第163便と同一)',
      '**第158便 ZW2 の分離振幅 A_b・A_c と核 x_b・x_c**(env×1/×2 — 本便の実測より前に確定していた。' +
      'coreshell5-results.json から機械読取。provenance.inputs に sha256。**本便では解き直さない**)',
      '**掃引格子の中心 = 第163便 coreshell6 の実測 q₅₀**(env×1 1.6550 / env×2 1.5350 — ' +
      'coreshell6-results.json から機械読取。封①で固定)',
      '予測式の関数形((T1)(T5′))と二分法ソルバ(第155便→第158便→第163便からの逐語転記。転記の正しさは ' +
      'checks.transcriptionReproducesWave158Separation / …Wave163Prediction が bit 一致で機械照合する)',
      'q₅₀ の採点定義(loss=1−keepFrac・ロジスティック当てはめ格子・INCONCLUSIVE 規則 = 第154便から' +
      '不変。掃引前に preRegistered.scoringDefinition へ宣言固定)',
      '事前登録窓 EW1 の許容 0.05・EW2 の許容 0.10(実測前に固定・実測後に動かさない)'],
    fit: [],
    derived: ['エンベロープ保持喪失率(q50.arms.*.table)',
      'ロジスティック中点 q₅₀ とプラトー A,B・遷移幅 w(q50 — 実測した保持喪失曲線の記述統計であり、' +
      '物理モデルの較正自由度ではない。当てはめは決定論的な閉形式+格子探索で、初期値・乱数を持たない)',
      '**精細アンカー**(env×1 の 0.025 格子 q₅₀ — 未知の Ω_crit を代数的に消去するための代入であり、' +
      '残差を最小化する自由度を一つも導入しない)と、そこから立つ予測 q₅₀(2項複合・単一項・' +
      '振幅込み単一項・旧式)・実測との |差|(predictedBeforeMeasurement・ew2)',
      '掃引刻み 0.1 → 0.05 → 0.025 の q₅₀ 推移(q50.resolutionLadder — 記述)',
      'アンカー ±0.025 摂動・逆向きアンカーの予測(ew2.coRecorded — 記述のみ・判定なし)',
      '対照の bit 一致(controls — 記述)', '決定性ハッシュ(determinism)',
      '第163便・第158便との対照 bit 照合(crossWaveCheck — 記述)',
      '第158便の分離振幅・第163便の予測ブロックの転記照合(checks)'],
    holdOut: ['**🐚 env×2 の 0.025 格子実測 q₅₀** — 予測を封②で書き出す時点では存在しない値であり、' +
      'predictionIntegrity が事後改変のないことを機械照合する。ただし **env×2 の 0.05 格子の値' +
      '(1.5350)は既知**なので、これは「未知の的を射る」型の hold-out ではなく' +
      '**同じ的をより細かい物差しで測り直す**型である(preRegistered.honestFraming で実測前に宣言)',
      '**🐚 env×1 の 0.025 格子実測 q₅₀** — アンカーとして予測に入るので式の予測力の hold-out では' +
      'ない。EW1 の再現性検定の対象としてのみ hold-out である',
      '旧式 q*_eff=(3/2)(1+R/r) と遠方漸近の臨界指数 3/2(第135便・第139便の外部解析値。本便で' +
      '当てはめ直していない)',
      '第152便・第154便・第155便・第158便・第163便の実測/解析値(本便は読み取り専用の照合参照として' +
      'のみ使い、書き換えない)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = 本便で' +
      '新しい較正自由度を一つも導入していない。**本便は盲検の前向き検証ではなく分解能向上フォローで' +
      'ある**ことを preRegistered.honestFraming で実測前に宣言している',
  },
  judgement: {
    pointers: ['preRegistered', 'preRegistered.honestFraming', 'limits', 'provenance.inputs', 'checks',
      'preRegistrationBlock', 'preRegistrationSeal',
      'predictedBeforeMeasurement', 'predictionIntegrity', 'q50.summary', 'q50.resolutionLadder',
      'ew1.verdict', 'ew1.comparisons', 'ew2.verdict', 'ew2.comparisons', 'ew2.coRecorded', 'ew3',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、掃引前に固定した格子・採点定義・宣言は ' +
      'preRegistrationBlock(改変が無いことは preRegistrationSeal)、env×2 掃引前に固定した予測は ' +
      'predictedBeforeMeasurement(改変が無いことは predictionIntegrity)、エンジン実測は raw、' +
      'q₅₀ は q50、格子整合は ew1.verdict、主窓の判定は ew2.verdict、併記群 (a)〜(d) は ' +
      'ew2.coRecorded、決定性は ew3 にある。EW2 の外部解析値は第158便 ZW2 の分離振幅から立つ ' +
      '2項複合予測で、その残差は ew2.comparisons[].absDiff である',
    externalReferences: ['第158便 ZW2 の 🐚 平均場2項分離 A_b・A_c(tests/out/coreshell5-results.json)',
      '第163便 coreshell6 の 🐚 q₅₀(0.05 格子)と 2項複合予測・アンカー摂動' +
      '(tests/out/coreshell6-results.json — 格子中心・EW1 の比較相手・併記 (c) の比較相手)',
      '第155便の予測式 (T1) Ω_drag(r;q₅₀)=Ω_crit ・(T5) 2項複合' +
      '(tests/out/coreshell-theory-results.json — 本便は 🐚 平均場版 (T5′) として用いる)',
      '第154便 🐚 env×1/×2 の実測 q₅₀(0.1 格子。tests/out/coreshell4-results.json — ' +
      'coreshell6 経由で参考並置のみ)',
      '(T3) 単一項アンカー式・(T4) 振幅寄与込み単一項(参考併記)',
      '旧式 実効臨界指数 q*_eff=(3/2)(1+R/r)(第139便 post-hoc → 第152便 XW2 → 第154便 YW1)',
      '遠方漸近の臨界指数 3/2(第135便が同定)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第163便/第158便の対照との bit 一致**' +
        '(crossWaveCheck.controls)・**第158便プローブの bit 再現**(checks.probeReproduction)・' +
        '**決定性ハッシュ**(determinism.sha256)である' },
  },
  regenerationNote: 'meta.date / meta.elapsedSec / meta.timings / meta.only / meta.stage / ' +
    'determinism.readAttempts は非測定メタなので照合対象外(determinism の正規化と同方針)。' +
    '走行時間は raw に入れていないので raw は完全に決定論的である',
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'meta.timings', 'meta.only', 'meta.stage',
    'determinism.readAttempts'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
log(`\n===== 判定(事前登録窓 — 実測後に動かさない)=====`);
log('q₅₀(0.025 格子): ' + Object.entries(out.q50.summary).map(([k, v]) =>
  `${k}=${fmt(v.q50, 4)}${v.result === 'OK' ? '' : '(' + v.result + ')'}`).join(' / '));
log('  刻み梯子(0.1→0.05→0.025): ' + Object.entries(out.q50.resolutionLadder).map(([k, v]) =>
  `${k} ${fmt(v.step0p100_wave154, 4)}→${fmt(v.step0p050_wave163, 4)}→${fmt(v.step0p025_thisWave, 4)}`).join(' / '));
log(`  格子が事前登録どおりか: ${out.q50.gridsAsPreRegistered} / アンカー当てはめの同一性: ${out.q50.anchorFitIsTheOneUsedForPrediction.identical}`);
if (out.ew1.verdict) {
  log(`EW1 格子整合(許容 ${PRE_REGISTERED.EW1.tolerance})→ ${out.ew1.verdict.result}`);
  for (const c of out.ew1.comparisons)
    log(`   ${c.armKey.padEnd(6)} 0.025格子=${fmt(c.q50Fine)} vs coreshell6 0.05格子=${fmt(c.q50Coarse_wave163)} |差|=${fmt(c.absDiff)} 格子内=${c.measuredWithinGrid} → ${c.result}` +
      (c.resultReason ? ` [${c.resultReason}]` : ''));
}
if (out.ew2.verdict) {
  log(`EW2 主窓(精細アンカー 2項複合予測・許容 ${PRE_REGISTERED.EW2.tolerance}・判定対象 ${out.ew2.verdict.judgedArms.join(',')})→ ${out.ew2.verdict.result}`);
  for (const c of out.ew2.comparisons)
    log(`   ${c.armKey.padEnd(6)}${c.judgedByEW2 ? '[EW2 判定]  ' : '[アンカー恒等]'} 予測(2項複合)=${fmt(c.predictedQ50.twoTerm)} 実測=${fmt(c.measuredQ50)} ` +
      `|差|=${fmt(c.absDiff)} 格子内=${c.measuredWithinGrid} → ${c.result}` +
      (c.resultReason ? ` [${c.resultReason}]` : '') +
      `   [(a) ≤0.05: ${c.withinTighter0p05}]` +
      `   [(d) 旧式 |差|=${fmt(c.referenceAbsDiff.legacy)} / 参考 単一項=${fmt(c.referenceAbsDiff.singleTerm)} 単一項+振幅=${fmt(c.referenceAbsDiff.singleTermAmplitude)} 基底核単一項=${fmt(c.referenceAbsDiff.singleTermBaseKernel)}]` +
      (c.wave163 ? `   [coreshell6: 予測=${fmt(c.wave163.predictedTwoTerm)} 実測=${fmt(c.wave163.measured)} |差|=${fmt(c.wave163.absDiff)}]` : ''));
}
if (out.ew2.coRecorded.b_mirrorAnchoring && out.ew2.coRecorded.b_mirrorAnchoring.available)
  log(`併記(b) 逆向きアンカー(${out.ew2.coRecorded.b_mirrorAnchoring.anchorArmKey} 精細実測 基準): ` +
    out.ew2.coRecorded.b_mirrorAnchoring.arms.map(e =>
      `${e.armKey} 予測=${fmt(e.twoTerm)} 実測=${fmt(e.measured)} |差|=${fmt(e.absDiff)}`).join(' / '));
if (out.ew2.coRecorded.c_anchorPerturbation && out.ew2.coRecorded.c_anchorPerturbation.spread)
  log(`併記(c) アンカー ±${GRID_STEP} 摂動の振れ幅: ` +
    Object.entries(out.ew2.coRecorded.c_anchorPerturbation.spread).map(([k, v]) =>
      `${k}=${v ? fmt(v.spread) : '—'}(coreshell6 ±0.05 では ${v ? fmt(v.wave163SpreadAtPm0p05) : '—'} — 改善係数 ${v ? fmt(v.improvementFactor, 2) : '—'}倍)`).join(' / '));
log(`封①(格子・採点定義・宣言)の不変性: sha256 一致=${out.preRegistrationSeal.unchanged}` +
  ` / 封②(予測)の不変性: sha256 一致=${out.predictionIntegrity ? out.predictionIntegrity.unchanged : '—'}`);
log(`転記照合: 第158便分離振幅 ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}` +
  ` / 第163便予測ブロック ${out.checks.transcriptionReproducesWave163Prediction.nIdentical}/${out.checks.transcriptionReproducesWave163Prediction.nCompared}` +
  (out.checks.probeReproduction ? ` / プローブ再現 ${out.checks.probeReproduction.nIdentical}/${out.checks.probeReproduction.nCompared}` : ''));
log(`EW3 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical} → ${out.ew3.result}`);
log(`対照(記述)kF0×kRep0 allDynamicsIdentical=${out.controls.allDynamicsIdentical}` +
  ` / 過去便対照との bit 一致 ${out.crossWaveCheck.controls.nIdentical}/${out.crossWaveCheck.controls.nCompared}` +
  ` / 共有掃引点 ${out.crossWaveCheck.sharedSweepPoints.nCompared}件(事前登録どおり共有点なしの想定)`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();

// 第174便 exp-coreshell8.mjs — コア外殻第8実験(🐚 振幅分解能・事前登録 FW1〜FW3)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs →
//   第152便 tests/exp-coreshell3.mjs → 第154便 tests/exp-coreshell4.mjs →
//   第155便 tests/exp-coreshell-theory.mjs(解析専用)→ 第158便 tests/exp-coreshell5.mjs →
//   第163便 tests/exp-coreshell6.mjs → 第168便 tests/exp-coreshell7.mjs の続き。
//
// 第168便(coreshell7)は 🐚nebulaShell の q₅₀ 掃引を 0.025 刻みへ精細化し(env×1 1.6575・
//   env×2 1.5300)、**精細アンカー**による 2項複合予測 1.4865 を env×2 実測 1.5300 と突き合わせて
//   |差| 0.0435 で EW2 PASS を得た。その申し送りは limits.amplitudesNotRefreshed:
//     「振幅 A_b・A_c は第158便の収載値をそのまま使う(本便で解き直さない)。刻みを細かくしたのは
//      q₅₀ の掃引側だけであり、**振幅側の分解能は coreshell6 と同じまま**である。したがって
//      予測の系統誤差のうち振幅由来の成分は本便でも減っていない」
//   であった。すなわち **次のレバーは振幅 A_b・A_c 側**である。本便(第174便)はその一点だけを詰める:
//     ① 引きずりプローブを **q 4点 {1.25, 1.5, 1.75, 2.0} × env×1/×2** で計装し(第158便 ZW2 は2点)、
//     ② 2項モデル Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q の (A_b, A_c) を **4点最小二乗**で解き直し、
//     ③ その振幅で立てた 2項複合予測を coreshell7 の実測 q₅₀ と突き合わせる。
//   併せて **2点部分集合(6組)それぞれの振幅→予測のばらつき**を測り、振幅不確かさを定量する。
//   **新規掃引は行わない**。q₅₀ は coreshell7 の実測値の機械読取であり、本便が新しく測るのは
//   引きずりプローブ(1步)と kF0×kRep0 対照だけである(軽量便)。
//
// ★★ 正直な位置づけの事前宣言(実測前・読み違えを防ぐため最初に書く)★★
//   **本便に hold-out(前向きに伏せられた実測値)は存在しない。** 照合先の q₅₀(env×1 1.6575・
//   env×2 1.5300)も、比較相手の残差 0.0435 も、第158便の2点振幅も、すべて既に確定した既知量である。
//   本便で新しく測るのは **q∈{1.25, 1.75} を含む4点のプローブ実測**と、そこから解ける振幅だけである。
//   したがって **FW1 の PASS は「未知を当てた」証拠ではない**。FW1 が実際に問うているのは
//   **「振幅を2点→4点で解き直したとき、coreshell7 の残差 0.0435 が縮むか・変わらないか・広がるか」**
//   であり、その読み方は結果に依らず変えない(改善の有無は併記 (b) に記述として収載する)。
//   さらに開示しておく: 実装担当は対象 HTML の同一性を確かめる事前点検(beta/index.html と
//   index.html で第158便プローブが bit 再現するかの確認)の過程で、**q=1.25/1.75 のプローブ平均
//   Ω̄_drag の値を目にしている**。ただし **振幅解・予測値・FW1 の残差は封①より前に一切計算していない**。
//   この開示は封①のブロックに含まれ、正準化 SHA-256 で固定される。
//
// ★ アーム(2本。いずれも 🐚kF1kRep実。第154/158/163/168便の 🐚 走行と同じ2構成)★
//   env×1  エンベロープ ring 既定半径(rIn/rOut ×1)… **アンカー構成**(予測は恒等)
//   env×2  エンベロープ ring 半径 ×2(rIn/rOut ×2)… FW1 の判定対象
//
// ============================ 事前登録(実測前に固定 — 逐語)===================================
//   FW1(主窓): 精細アンカー(coreshell7 env×1 実測 q₅₀=1.6575 — coreshell7-results.json から
//     機械読取)+4点振幅による 2項複合予測 vs coreshell7 env×2 実測 1.5300 — **|差| ≤ 0.10**。
//     併記(記述・判定外): (a) ≤0.05 か (b) coreshell7 の残差 0.0435 からの改善有無
//     (c) **2点部分集合(6組)それぞれの振幅→予測のばらつき**(振幅不確かさの定量)
//     (d) 4点適合の残差(相対)。
//   FW2(整合): 部分集合 {1.5, 2.0} で解いた振幅が第158便 ZW2 収載値(coreshell5-results.json)と
//     **ビット一致**(転記照合 — 同じ2点なら同じ解になるはず。解法差で bit がずれる場合は
//     相対差 ≤1e-12 で判定し理由を明記)。
//   FW3(決定性): 別プロセス2回実行の正準化 SHA 一致。
//   **実測後に窓・プローブ格子・解法・採点定義を動かさない。PASS/FAIL とも収載する。**
//
// ============================ 予測式(第155便→第158便→第163便→第168便からの逐語転記)========
//   (T1) Ω_drag(r; q₅₀) = Ω_crit                     … 保持喪失の条件式(Ω_drag は q に単調減少)
//   (T5′) 🐚 の平均場2項  Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q,  x_b = R̄/(R̄+r̄),  x_c = Rc/(Rc+r̄)
//   予測 = 「Ω̄_drag_var(q₅₀') = Ω̄_drag_ref(q₅₀_ref)」の数値解(**決定論的二分法**・区間 [0.05,8.0]・
//        反復 200 回固定)。アンカー q₅₀_ref は **coreshell7 の env×1 実測 q₅₀ ただ1つ**で、
//        未知の Ω_crit を代数的に消去するための代入である(較正自由度ではない — classification.fit は空)。
//   **本便が動かすレバーは振幅 (A_b, A_c) だけである。** 核 x_b・x_c は第158便 ZW2 の収載値を
//        そのまま機械読取して固定する(= r̄ は q=1.5 プローブの実測値という第158便の規約の逐語踏襲)。
//        核まで動かすと「振幅を解き直した効果」と「核が動いた効果」が混ざるので、本便は核を固定する。
//        4点のプローブが返す envMeanR の散らばりは limits.kernelsHeldFixed と
//        raw.probe.envMeanRAcrossQs に記述として収載する。
//
//   ---- 振幅の解法(実測前に宣言・完全決定論)-------------------------------------------------
//   4点最小二乗(重みなし普通最小二乗・正規方程式の閉形式。反復・乱数・初期値依存なし):
//     u_k = x_b^{q_k},  v_k = x_c^{q_k},  y_k = Ω̄_drag(q_k)   (k = 1..4)
//     S11 = Σ u_k²,  S12 = Σ u_k v_k,  S22 = Σ v_k²,  b1 = Σ u_k y_k,  b2 = Σ v_k y_k
//     det = S11·S22 − S12²
//     A_b = (b1·S22 − b2·S12)/det,   A_c = (S11·b2 − S12·b1)/det
//   2点部分集合(6組)は **第158便 ZW2 と同一の閉形式(2式2未知数のクラメル解)** で解く:
//     det₂ = x_b^{q1}·x_c^{q2} − x_c^{q1}·x_b^{q2}
//     A_b = (y1·x_c^{q2} − y2·x_c^{q1})/det₂,  A_c = (x_b^{q1}·y2 − x_b^{q2}·y1)/det₂
//   FW2 はこの2点閉形式(= 第158便と 1 bit も違わない式)で判定する。あわせて **同じ部分集合を
//     4点最小二乗の正規方程式経路(n=2)へ通した解**も収載し、解法差による相対差を記録する。
//   数値健全性の自己点検として、列を最大値で正規化してから解く**尺度正規化版**も併記する
//     (数学的に同値。丸めに強い経路との相対差を記録する)。
//
// 走行規約(第154/158/163/168便の 🐚 走行の踏襲 — 1 bit も変えない):
//   🐚nebulaShell: seed 20260804(プリセット定義値)・dt=0.016。
//   引きずりプローブ: kFrame=1 で build して **1步だけ**進め、エンベロープ各粒子について
//     解析的な引きずり角速度 Ω_drag を読む(第154便 nebDragProbe と同一実装の逐語転記)。
//   対照: kFrame=0 × kRep=0 の 3000步走行(第168便と同一 — 記述・判定外)。
//   数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// トイ単位の限界(第135便〜第168便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である。
//
// 実行:
//   node tests/exp-coreshell8.mjs                        … 全節(既定)
//   CS8_ONLY=probe,ctl node tests/...                    … 節を選択実行
//   CS8_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS8_DET_REF=/path/run1.json [CS8_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//   CS8_QUICK=1 …………………………………………………………… 対照の步数 1/10 の煙試験(配線確認専用)
//   QA_TARGET=index.html node tests/...                  … 対象 HTML の変更(既定 beta/index.html)
// 出力: tests/out/coreshell8-results.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const ALT_TARGET = 'index.html';        // 同一性の機械確認用(第158便までの従来対象)
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const ALT_INDEX = 'file://' + path.join(ROOT, ALT_TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_PATH = process.env.CS8_OUT ? path.resolve(process.env.CS8_OUT)
  : path.join(OUT_DIR, 'coreshell8-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS8_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS8_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(実測前に固定 — 実測後に動かさない) ========================
const PRE_REGISTERED = {
  fixedBy: '統括(第168便 coreshell7 の申し送り limits.amplitudesNotRefreshed の後続として第174便で固定 ' +
    '— ハンドオフ 2026-08-22c §3b)',
  fixedBefore: '実測',
  honestFraming: {
    headline: '**本便に hold-out(前向きに伏せられた実測値)は存在しない**',
    whatIsKnownBeforehand: '照合先の q₅₀(coreshell7 の env×1 1.6575・env×2 1.5300)も、比較相手の' +
      '残差 0.0435 も、第158便 ZW2 の2点振幅(env×1 A_b=0.5617…/A_c=3.5909… ・env×2 A_b=1.3314…/' +
      'A_c=1.6920…)も、すべて既に確定した既知量である。本便はこれらを機械読取するだけで測り直さない',
    whatIsNew: '本便が新しく測るのは **q∈{1.25, 1.75} を含む4点の引きずりプローブ実測**と、そこから' +
      '解ける振幅 (A_b, A_c)、およびその振幅で立つ予測である。**新規の q₅₀ 掃引は行わない**',
    whatFW1ActuallyAsks: 'FW1 が問うているのは「振幅を2点→4点で解き直したとき、coreshell7 の残差 ' +
      '0.0435 が縮むか・変わらないか・広がるか」である。**FW1 の PASS は「未知を当てた」証拠ではない**。' +
      'この読み方は実測前に宣言しており、結果に応じて変えない(改善の有無は併記 (b) に記述として収載)',
    preflightDisclosure: '実装担当は対象 HTML の同一性を確かめる事前点検(beta/index.html と ' +
      'index.html で第158便プローブが bit 再現するかの確認)の過程で、**q=1.25/1.75 のプローブ平均 ' +
      'Ω̄_drag の値を目にしている**。ただし **振幅解・予測値・FW1 の残差は封①より前に一切計算して' +
      'いない**。本開示は封①のブロックに含まれ正準化 SHA-256 で固定される',
    whyThisWaveExists: 'coreshell7 の申し送りは「振幅側の分解能は coreshell6 と同じまま。予測の系統' +
      '誤差のうち振幅由来の成分は本便でも減っていない」であった。残差 0.0435 が **振幅の粗さ由来か・' +
      '構造的(平均場2項近似そのものの限界)か**を切り分けるには、振幅側の分解能を上げるしかない。' +
      '本便は 2点 → 4点で振幅を解き直し、あわせて2点部分集合6組のばらつきで振幅不確かさを定量する',
  },
  designPrinciples: {
    machineTranscription: 'アンカー q₅₀・照合先の実測 q₅₀・残差・核 x_b/x_c・第158便の2点振幅は' +
      'すべて既存 JSON からの **機械読取**であり、手書き転記をしない(手書き転記は第131便の事故と' +
      '同根の再現不能を招く)',
    amplitudeIsTheOnlyLever: '**本便が動かすレバーは振幅 (A_b, A_c) だけである。** 核 x_b・x_c は' +
      '第158便 ZW2 の収載値をそのまま固定する(= r̄ は q=1.5 プローブの実測値という第158便の規約の' +
      '逐語踏襲)。核まで動かすと「振幅を解き直した効果」と「核が動いた効果」が混ざり、' +
      '申し送りが名指しした一点(振幅)を切り分けられなくなる',
    anchorIsMeasurement: 'アンカーは coreshell7 の env×1 実測 q₅₀ ただ1つの代入であり、未知の臨界値 ' +
      'Ω_crit を代数的に消去する役割しか持たない(最小二乗も探索も行わない = 較正自由度ではない)',
    lsqIsAgainstProbeObservable: '4点最小二乗が当てはめる相手は **プローブ実測 Ω̄_drag(q)** であって、' +
      'FW1 が判定する **q₅₀(保持喪失曲線)ではない**。すなわち予測対象の残差を小さくする自由度を' +
      '一つも導入していない(classification.fit が空である根拠)',
    anchorRecoveryIsNotPrediction: 'アンカー構成である env×1 の 2項複合予測は**恒等的にアンカー値**に' +
      'なる。したがって FW1 の判定対象は **env×2 の1アームのみ**である(env×1 の予測は恒等性の' +
      '自己点検として収載するだけで、窓判定には使わない)',
    twoSeals: '封は2段である。**封①(プローブ走行前)**: 事前登録窓・プローブ q 格子・振幅の解法' +
      '(正規方程式の式そのもの)・核の出所・二分法ソルバ・アンカーと照合先の出所・正直な位置づけ' +
      '(事前点検の開示を含む)を、**どのプローブ走行よりも前**に正準化 SHA-256 で固定して ' +
      'OUT_PATH へ書き出す(preRegistrationSeal)。**封②(判定節より前)**: 実測した振幅と、そこから' +
      '立てた予測ブロックを正準化 SHA-256 で固定して OUT_PATH へ書き出す(predictionIntegrity)。' +
      '**本便には hold-out が存在しないので、封②が担保するのは「判定節で予測を書き換えていない」' +
      'ことだけである**(前向き性の証拠ではない — honestFraming で実測前に宣言済み)',
    priorWavesUntouched: '第152便(coreshell3)・第154便(coreshell4)・第155便(coreshell-theory)・' +
      '第158便(coreshell5)・第163便(coreshell6)・第168便(coreshell7)の JSON は一切変更しない。' +
      '本便は新規ファイルとして独立に走り、既存 JSON は読み取り専用の機械読取・bit 照合・' +
      '来歴参照としてのみ使う',
  },
  FW1: {
    role: '主窓',
    verbatim: 'FW1(主窓): 精細アンカー(coreshell7 env×1 実測 q₅₀=1.6575 — coreshell7-results.json ' +
      'から機械読取)+4点振幅による 2項複合予測 vs coreshell7 env×2 実測 1.5300 — **|差| ≤ 0.10**。' +
      '併記(記述・判定外): (a) ≤0.05 か (b) coreshell7 の残差 0.0435 からの改善有無 ' +
      '(c) **2点部分集合(6組)それぞれの振幅→予測のばらつき**(振幅不確かさの定量) ' +
      '(d) 4点適合の残差(相対)。',
    window: '**|q₅₀_meas(coreshell7 env×2 = 1.5300) − q₅₀_pred(2項複合・4点振幅・精細アンカー)| ≤ 0.10**',
    tolerance: 0.10,
    judgedArm: 'env2(1アームのみ。env×1 は恒等予測なので窓判定に使わない)',
    prediction: '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を、精細アンカー(coreshell7 の ' +
      '🐚 env×1 実測 q₅₀)で決めた Ω_crit に等しくする q を、決定論的二分法(区間 [0.05,8.0]・' +
      '反復 200 回固定)で解いた値。振幅 A_b・A_c は **本便の4点プローブ実測の最小二乗解**である',
    parameterMapping: {
      A_b: 'A_b = 本便 amplitudes.fourPoint.env{1,2}.amplitudeBase(本便の4点最小二乗解)',
      A_c: 'A_c = 本便 amplitudes.fourPoint.env{1,2}.amplitudeCore(本便の4点最小二乗解)',
      x_b: 'x_b = 第158便 zw2.perScale.env{1,2}.kernels.xBase = R̄/(R̄+r̄)(機械読取・本便で動かさない)',
      x_c: 'x_c = 第158便 zw2.perScale.env{1,2}.kernels.xCore = Rc/(Rc+r̄)(機械読取・本便で動かさない)',
      anchor: 'q₅₀_ref = coreshell7-results.json: q50.summary.env1.q50(機械読取)',
      target: 'q₅₀_meas = coreshell7-results.json: q50.summary.env2.q50(機械読取)',
      priorResidual: 'coreshell7-results.json: ew2.comparisons[armKey=env2].absDiff(機械読取)',
    },
    solutionMethod: {
      fourPoint: '重みなし普通最小二乗(正規方程式の閉形式)。u_k=x_b^{q_k}・v_k=x_c^{q_k}・y_k=Ω̄(q_k) と' +
        'して S11=Σu²・S12=Σuv・S22=Σv²・b1=Σu·y・b2=Σv·y、det=S11·S22−S12²、' +
        'A_b=(b1·S22−b2·S12)/det、A_c=(S11·b2−S12·b1)/det。反復・乱数・初期値依存を持たない',
      twoPointSubset: '第158便 ZW2 と同一の閉形式(2式2未知数のクラメル解): ' +
        'det₂=x_b^{q1}·x_c^{q2}−x_c^{q1}·x_b^{q2}、A_b=(y1·x_c^{q2}−y2·x_c^{q1})/det₂、' +
        'A_c=(x_b^{q1}·y2−x_b^{q2}·y1)/det₂',
      scaledCrossCheck: '列を最大値で正規化してから解く尺度正規化版も併記する(数学的に同値。' +
        '丸めに強い経路との相対差を記録する — 記述のみ・判定外)',
      weighting: '**重みなし**(Ω̄ の生値に対する最小二乗)。Ω̄ は q とともに1桁近く変わるので、' +
        '大きい q(小さい Ω̄)の点の相対誤差は軽く扱われる。対数最小二乗・相対重み最小二乗は' +
        '本便では採らない(実測前に固定した選択である)',
    },
    coRecordedDescriptive: {
      note: '**併記(記述・判定外)**。FW1 の PASS/FAIL には一切使わない',
      a: '(a) |差| ≤ 0.05 に入るか(より厳しい目安に届くか — 判定は 0.10 のまま動かさない)',
      b: '(b) coreshell7 の残差 0.0435 からの改善有無(符号つきで記録する。悪化も収載する)',
      c: '(c) **2点部分集合(6組)それぞれの振幅→予測のばらつき**。q 4点から2点を選ぶ 6 通りの' +
        '部分集合それぞれで env×1/env×2 の振幅を解き、同じ部分集合どうしで Ω_crit と予測を立てて、' +
        '予測 q₅₀ の最小・最大・幅を記録する。これが **振幅不確かさの定量**である',
      d: '(d) 4点適合の残差(相対): 各 q での (model−Ω̄)/Ω̄ と、その最大絶対値・RMS',
    },
    inconclusiveRule: '二分法が固定区間 [0.05, 8.0] で解を挟めなかった場合(例えば最小二乗解の振幅に' +
      '負値が出て Ω̄_drag(q) が単調減少でなくなった場合)は **値を捏造せず null を返し INCONCLUSIVE** ' +
      'として PASS/FAIL を主張しない',
    verdictPrecedence: '適用順序(実測前に固定): ① 予測が立たない(挟めない・振幅が解けない)→ ' +
      '**INCONCLUSIVE**。② それ以外 → |q₅₀_meas − q₅₀_pred| と許容 0.10 の比較で PASS/FAIL',
  },
  FW2: {
    role: '窓(整合・転記照合)',
    verbatim: 'FW2(整合): 部分集合 {1.5, 2.0} で解いた振幅が第158便 ZW2 収載値' +
      '(coreshell5-results.json)と**ビット一致**(転記照合 — 同じ2点なら同じ解になるはず。' +
      '解法差で bit がずれる場合は相対差 ≤1e-12 で判定し理由を明記)。',
    window: '**本便の部分集合 {1.5, 2.0} 解 == 第158便 zw2.perScale.env{1,2}.separation の ' +
      'amplitudeBase / amplitudeCore / determinant(厳密等価)**。bit がずれた場合は相対差 ≤1e-12',
    tolerance: { bitIdentical: true, fallbackRelative: 1e-12 },
    arms: 'env1 / env2 の両方(2アーム × 3量 = 6 比較)',
    rationale: '同じ2点・同じ核・同じ閉形式なら解は 1 bit も違わないはずである。これは (i) 本便の' +
      'プローブが第158便と同じ値を出していること、(ii) 本便の分離式の転記が正しいこと、' +
      'の両方を一度に検定する。**4点振幅が2点振幅と違うのは点数が増えたからであって、' +
      '実装が変わったからではない**ことの機械証拠になる',
    fallbackReason: '本便の2点部分集合は第158便と同一の閉形式(クラメル解)を使うので bit 一致が' +
      '既定の期待である。もし将来 解法を変えて bit がずれた場合に備え、相対差 ≤1e-12 の' +
      '代替判定を実測前に宣言しておく(その場合は理由を verdict.fallbackUsedReason に明記する)',
    inconclusiveRule: 'プローブまたは第158便 JSON の読み取りに失敗した場合は INCONCLUSIVE',
  },
  FW3: {
    role: '窓(決定性)',
    verbatim: 'FW3(決定性): 別プロセス2回実行の正準化 SHA 一致。',
    window: '全体を2回実行(別プロセス)し結果 JSON(非測定メタを除く)の正準化 SHA 一致',
    canonicalization: 'raw(実測部)と predictedFromRefreshedAmplitudes(予測部)を再帰キー整列した ' +
      'JSON。走行時間は meta.timings にのみ置き raw には入れていないので、除外すべき揮発値は' +
      '対象内に存在しない',
  },
  probeGridDefinition: {
    declaredBefore: '**どのプローブ走行よりも前**に宣言・固定した格子である(封①)',
    qs: [1.25, 1.5, 1.75, 2.0],
    envScales: [1, 2],
    step: 0.25,
    rationale: '第158便 ZW2 の2点 {1.5, 2.0} を**部分集合として含む**4点にする(FW2 の転記照合が' +
      '成立する必要条件)。区間を [1.25, 2.0] に採るのは、coreshell7 の予測 1.4865 と実測 1.5300 が' +
      'ともにこの区間の内側にあり、予測が外挿にならないようにするためである' +
      '(第168便 limits.amplitudesFittedAtTwoQs が名指しした外挿の問題を同時に潰す)',
    protocol: '走行規約は第158便 ZW2 と同一 — **1步プローブ**(kFrame=1 で build して S.step(0.016) を' +
      '1回だけ呼び、エンベロープ各粒子の解析的 Ω_drag を読む)。q₅₀ の掃引ではない',
    kernelsHeldFixed: '核 x_b・x_c は第158便 ZW2 の収載値をそのまま使い、4点プローブの envMeanR から' +
      '取り直さない(本便のレバーは振幅のみ)。4点の envMeanR は raw.probe.envMeanRAcrossQs に' +
      '記述として収載する',
    noPostHocChange: '実測後に格子・解法を動かさない',
  },
  scoringDefinition: {
    declaredBefore: '**実測より前**に宣言・固定した採点定義である',
    probeObservable: 'Ω̄_drag(q) = エンベロープ粒子(帯 [NC, S.n) = 44体)の omDragAnalytic の' +
      '**単純平均**(第158便 ZW2 の meanDrag と 1 bit も違わない定義)',
    model: 'Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q(第155便 (T5) の 🐚 平均場版 = (T5′))',
    q50Source: 'q₅₀ は **coreshell7 の実測値の機械読取**である(本便では掃引しない)。' +
      'coreshell7 の採点定義: loss(q) = 1 − envelope.keepFrac・ロジスティック当てはめ・' +
      'keepR は env×1 で 300 / env×2 で 600',
    residualDefinition: '4点適合の残差は relative = (model(q_k) − Ω̄(q_k)) / Ω̄(q_k)。' +
      '最大絶対値と RMS を収載する',
  },
  procedure: {
    order: [
      '① coreshell5-results.json / coreshell7-results.json を機械読取する(sha256 を来歴に残す)。' +
      'あわせてシミュレーション不要の転記照合を行う: 第158便 ZW2 の2点分離を第158便の生プローブ行から' +
      '再計算して bit 一致を要求し、coreshell7 の Ω_crit と env×2 予測(2点振幅)を本ハーネスの ' +
      '(T5′)+二分法ソルバで再現して bit 一致を要求する',
      '② 事前登録窓・プローブ格子・振幅の解法・核の出所・アンカーと照合先の出所・正直な位置づけを' +
      '正準化 SHA-256 で封印し OUT_PATH へ書き出す(封①)',
      '③ 引きずりプローブを q 4点 × env×{1,2} で走行する(1步・計8走行)。' +
      'あわせて従来対象 index.html でも同じ8走行を行い、対象実体の同一性を bit 照合する(記述)',
      '④ kF0×kRep0 対照を走行する(記述・判定外)',
      '⑤ 4点最小二乗で振幅を解き、2点部分集合6組の解も出し、そこから予測を立てて ' +
      'predictedFromRefreshedAmplitudes として JSON へ記録し OUT_PATH へ書き出す(封②)',
      '⑥ FW1(主窓)+併記群 (a)〜(d)・FW2(整合)・FW3(決定性)で判定する(窓は①より前に固定済み)',
    ],
    note: 'プローブは 1 步だけ進めた解析パラメータの読み取りであり、**保持率掃引(q₅₀ の実測)ではない**。' +
      '本便は q₅₀ を一切掃引しない',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  noHoldOut: '**本便に hold-out は存在しない**(preRegistered.honestFraming)。照合先の q₅₀ も' +
    '比較相手の残差も既知量であり、FW1 の PASS を「未知を当てた」証拠として読んではならない。' +
    'あわせて、実装担当が事前点検で q=1.25/1.75 のプローブ平均値を目にしていることを開示している' +
    '(振幅解・予測は封①より前に計算していない)',
  noNewSweep: '本便は **q₅₀ の掃引を一切行わない**。したがって q₅₀ 側の分解能(coreshell7 の掃引刻み ' +
    '0.025 と保持率の粒度 1/44 ≈ 0.0227)は本便でも改善していない。改善したのは振幅側の点数だけである',
  kernelsHeldFixed: '核 x_b・x_c は第158便 ZW2 の収載値に固定した(r̄ = q=1.5 プローブの envMeanR)。' +
    '4点のプローブが返す envMeanR は q ごとにわずかに違う(raw.probe.envMeanRAcrossQs に収載)。' +
    'この選択は「本便のレバーを振幅だけにする」ためであり、核を4点の平均などで取り直せば予測は' +
    'わずかに動きうる — その分は本便では潰していない系統である',
  meanFieldApproximation: '🐚 の真の引きずりは粒子対ごとの距離 d_ij に依存する多項和である。' +
    '(T5′) の2項は「クランプ粒子半径の平均 R̄ を核とする項」と「クランプのコア半径 Rc を核とする項」' +
    'による**平均場近似**であり、A_b・A_c は近似モデルのパラメータであってエンジン内部の量そのもの' +
    'ではない(第158便 zw2.perScale.*.separation.caveat と同じ限界)。**点数を2点から4点へ増やしても' +
    'この限界は動かない** — 4点適合の残差(併記 (d))が近似の当てはまりの直接の物差しである',
  amplitudeUncertaintyIsNotStatistical: '2点部分集合6組のばらつき(併記 (c))は、**統計的な標本誤差' +
    'ではなくモデル誤差の指標**である。プローブ実測は決定論的で 1 bit も揺れないので、6組が違う値を' +
    '出すのは (T5′) の2項形が Ω̄_drag(q) の q 依存を完全には表せていないことを意味する。' +
    'したがって「振幅の誤差棒」ではなく「2項近似の食い違いの大きさ」として読むこと',
  lsqUnweighted: '4点最小二乗は Ω̄ の**生値**に対する重みなし普通最小二乗である。Ω̄ は q=1.25 から ' +
    'q=2.0 の間で1桁近く落ちるので、小さい Ω̄(大きい q)の点は相対的に軽く扱われる。' +
    'この重み付けの選択は実測前に固定しており、結果を見てから変えない',
  tZeroAnalytic: '予測に使う Ω̄_drag は **1步後(t=0+)の解析値**である。🐚 は窓の間にクランプが' +
    '合体・回転して自走する系なので、窓平均の引きずりは t=0+ の値と同じではない(第155便 postHoc ②)。' +
    '本便はこの限界を承知のうえで、t=0+ の解析値による予測をそのまま照合に掛ける',
  envScaleCaveat: 'エンベロープ半径倍率は「引きずり核の相対的な効きを変える」以外の寄与も同時に動かす: ' +
    'r̄ が変われば重み w_ij と正規化 D₀+ΣW も変わり、ケプラー角速度・力学時間・保持しきい値(keepR も ' +
    '×2 にする規約)も変わる。これらは差分では相殺されない系統であり、q₅₀ には引きずり核の' +
    '効き以外の寄与も混じりうる(第154便 YW2・第158便 zw2・第163便・第168便と同じ限界)',
  anchorArmIsIdentity: 'env×1 はアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる。' +
    'env×1 の予測は恒等性の自己点検であって式の予測力の検定ではない(FW1 の判定対象は env×2 のみ)',
  anchorPropagation: '予測はアンカー(coreshell7 の env×1 実測 q₅₀)を1点使う。アンカー自身が' +
    'coreshell7 の掃引刻み 0.025 と保持率の粒度に由来する不確かさを持ち、その不確かさは予測値へ' +
    'そのまま伝播する(coreshell7 ew2.coRecorded.c の実測では ±0.025 の摂動で予測が動く)。' +
    '本便はアンカー側を触っていないので、この成分は coreshell7 と同じまま残っている',
  targetIsBeta: '本便の対象 HTML は **beta/index.html**(統括指示)である。従来の coreshell 系は ' +
    'index.html を対象にしてきたので、両者が本便の測定量について bit 同一であることを ' +
    'checks.targetEquivalence で機械確認する(一致しない場合はその事実を収載し、FW1/FW2 の解釈上の' +
    '注記とする)',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'cs5', file: 'coreshell5-results.json',
    role: '第158便の実測正本(**本便の核の出所**: ZW2 の x_b・x_c を機械読取して固定する。' +
      'また FW2 の照合先である2点振幅 A_b・A_c と、その再計算元の生プローブ行)' },
  { key: 'cs7', file: 'coreshell7-results.json',
    role: '第168便の実測正本(**本便のアンカーと照合先**: q50.summary.env1.q50 = 1.6575 を' +
      'アンカーに、q50.summary.env2.q50 = 1.5300 を照合先に機械読取する。' +
      'ew2.comparisons[env2].absDiff = 0.0435 は併記 (b) の比較相手。対照の bit 照合参照も兼ねる)' },
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
const CS5 = inputs.cs5, CS7 = inputs.cs7;
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const ALT_SHA_NOW = fs.existsSync(path.join(ROOT, ALT_TARGET))
  ? sha256(fs.readFileSync(path.join(ROOT, ALT_TARGET))) : null;
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  altTarget: ALT_TARGET, altSha256Now: ALT_SHA_NOW,
  targetsAreSameFile: TARGET_SHA_NOW === ALT_SHA_NOW,
  inputs: provenanceInputs.map(e => ({ path: e.path, targetSha256: e.targetSha256,
    sameAsNow: e.targetSha256 === TARGET_SHA_NOW, sameAsAlt: e.targetSha256 === ALT_SHA_NOW })),
  allSame: provenanceInputs.every(e => e.targetSha256 === TARGET_SHA_NOW),
  note: '入力 JSON の実測を出した対象 HTML の SHA-256 と、本便の対象(beta/index.html)・従来対象' +
    '(index.html)の SHA-256 の照合。**本便の対象は入力 JSON の対象と別実体である**ことが想定内' +
    'なので、実体の同値性は SHA ではなく **測定値の bit 一致**で示す ' +
    '(checks.probeReproduction / checks.targetEquivalence / crossWaveCheck.controls)',
};

// ============================ 測定器(第168便 exp-coreshell7.mjs から逐語踏襲) ================
// A) 🐚nebulaShell — 第154/158/163/168便 measureNeb と同一(帯定義・しきい値・返却フィールド)。
//    本便では kF0×kRep0 対照の走行にのみ使う(q₅₀ の掃引は行わない)。
const measureNebOn = (pg) => (mod) => pg.evaluate((o) => {
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

// B) 🐚 引きずりプローブ — 第154/158/163/168便 nebDragProbe と同一(1步・解析値の読み取り)。
//    **本便の主測定器**。第158便 ZW2 は q を2点に振ってこれを回した。本便は4点に振る。
const nebDragProbeOn = (pg) => (qOverride, envScale) => pg.evaluate((o) => {
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

// ================= 予測式(第155便 → 第158便 → 第163便 → 第168便からの逐語転記)===============
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
// 第158便 ZW2 の平均場2項分離(2式2未知数のクラメル解。FW2 の判定に使う逐語転記)
const separateTwoTerm = (xb, xc, q1, q2, o1, o2) => {
  const det = Math.pow(xb, q1) * Math.pow(xc, q2) - Math.pow(xc, q1) * Math.pow(xb, q2);
  return { determinant: det,
    amplitudeBase: (o1 * Math.pow(xc, q2) - o2 * Math.pow(xc, q1)) / det,
    amplitudeCore: (Math.pow(xb, q1) * o2 - Math.pow(xb, q2) * o1) / det };
};
// ---- 本便の新規: 多点最小二乗(重みなし普通最小二乗・正規方程式の閉形式)--------------------
function fitTwoTermLSQ(xb, xc, qs, ys) {
  const n = qs.length;
  const u = qs.map(q => Math.pow(xb, q));
  const v = qs.map(q => Math.pow(xc, q));
  let S11 = 0, S12 = 0, S22 = 0, b1 = 0, b2 = 0;
  for (let k = 0; k < n; k++) {
    S11 += u[k] * u[k]; S12 += u[k] * v[k]; S22 += v[k] * v[k];
    b1 += u[k] * ys[k]; b2 += v[k] * ys[k];
  }
  const det = S11 * S22 - S12 * S12;
  const Ab = (b1 * S22 - b2 * S12) / det;
  const Ac = (S11 * b2 - S12 * b1) / det;
  const model = qs.map((q) => Ab * Math.pow(xb, q) + Ac * Math.pow(xc, q));
  const resid = model.map((m, k) => m - ys[k]);
  const relResid = resid.map((r, k) => r / ys[k]);
  const sse = resid.reduce((a, r) => a + r * r, 0);
  const meanY = ys.reduce((a, y) => a + y, 0) / n;
  const rho = S12 / Math.sqrt(S11 * S22);
  return { n, qs, omegaBar: ys, basisBase: u, basisCore: v,
    normalEquations: { S11, S12, S22, b1, b2 }, determinant: det,
    amplitudeBase: Ab, amplitudeCore: Ac,
    model, residual: resid, relativeResidual: relResid,
    maxAbsRelativeResidual: Math.max(...relResid.map(Math.abs)),
    rmsRelativeResidual: Math.sqrt(relResid.reduce((a, r) => a + r * r, 0) / n),
    sse, rmse: Math.sqrt(sse / n), rmseOverMeanOmegaBar: Math.sqrt(sse / n) / meanY,
    basisCorrelation: rho,
    conditionProxy: (1 + Math.abs(rho)) / (1 - Math.abs(rho)),
    method: PRE_REGISTERED.FW1.solutionMethod.fourPoint };
}
// 尺度正規化版(数学的に同値。丸めに強い経路との相対差を記録する — 記述のみ)
function fitTwoTermLSQScaled(xb, xc, qs, ys) {
  const n = qs.length;
  const u = qs.map(q => Math.pow(xb, q));
  const v = qs.map(q => Math.pow(xc, q));
  const su = Math.max(...u.map(Math.abs)), sv = Math.max(...v.map(Math.abs));
  const un = u.map(z => z / su), vn = v.map(z => z / sv);
  let S11 = 0, S12 = 0, S22 = 0, b1 = 0, b2 = 0;
  for (let k = 0; k < n; k++) {
    S11 += un[k] * un[k]; S12 += un[k] * vn[k]; S22 += vn[k] * vn[k];
    b1 += un[k] * ys[k]; b2 += vn[k] * ys[k];
  }
  const det = S11 * S22 - S12 * S12;
  return { columnScales: { base: su, core: sv }, determinant: det,
    amplitudeBase: ((b1 * S22 - b2 * S12) / det) / su,
    amplitudeCore: ((S11 * b2 - S12 * b1) / det) / sv };
}
const relDiff = (a, b) => (a === null || b === null || !Number.isFinite(a) || !Number.isFinite(b))
  ? null : (a === b ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), Number.MIN_VALUE));

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
const measureNeb = measureNebOn(page);
const nebDragProbe = nebDragProbeOn(page);

const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

const out = { meta: { exp: 'coreshell8', wave: 174, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第168便 tests/exp-coreshell7.mjs(**本便のアンカー・照合先・比較残差**: 精細 q₅₀ ' +
      'env×1 1.6575 / env×2 1.5300 と 2項複合予測の残差 0.0435。測定器・予測式・二分法ソルバ・' +
      '封の流儀も踏襲)' +
      ' / 第158便 tests/exp-coreshell5.mjs(ZW2 の 🐚 引きずりプローブ規約と2点分離 = 本便の核の出所・' +
      'FW2 の照合先)' +
      ' / 第154便 tests/exp-coreshell4.mjs(🐚 走行規約)' +
      ' / 第155便 tests/exp-coreshell-theory.mjs(予測式 (T1)(T5))' +
      ' / 第163便 exp-coreshell6 / 第152便 exp-coreshell3 / 第139便 exp-coreshell2 / ' +
      '第135便 exp-coreshell(原型)',
    role: '🐚 の平均場2項振幅 (A_b, A_c) を **q 4点 {1.25,1.5,1.75,2.0} の最小二乗**で解き直し、' +
      'coreshell7 の精細アンカーで立て直した 2項複合予測を coreshell7 の実測 q₅₀ と突き合わせる便' +
      '(**振幅分解能フォロー — hold-out は存在しない**)。' +
      'あわせて2点部分集合6組のばらつきで振幅不確かさを定量する。**新規掃引なし**',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS,
  provenance: { inputs: provenanceInputs, targetConsistency },
  raw: {} };
out.meta.timings = {};   // 走行時間は非測定メタなので raw には入れない(raw は完全に決定論的)

// ---- アーム・走行規約(実測前に固定)----
const NEB_ARMS = [
  { key: 'env1', envScale: 1, keepR: 300, group: 'anchor', cs7Key: 'env1',
    label: '🐚kF1kRep実 env×1 — アンカー構成(予測は恒等)' },
  { key: 'env2', envScale: 2, keepR: 600, group: 'judged', cs7Key: 'env2',
    label: '🐚kF1kRep実 env×2 — FW1 の判定対象' },
];
const NEB_ANCHOR_KEY = 'env1';
const PROBE_QS = PRE_REGISTERED.probeGridDefinition.qs;      // [1.25, 1.5, 1.75, 2.0]
const WAVE158_QS = [1.5, 2.0];                               // 第158便 ZW2 の2点(FW2 の部分集合)
const CTL_STEPS = SC(3000);
const tagQ = (q) => 'q' + q.toFixed(5);
const tagQ2 = (q) => 'q' + q.toFixed(2);                     // 第158便 JSON のキー形式
const meanDrag = (pr) => pr.rows.reduce((a, e) => a + e.omDragAnalytic, 0) / pr.rows.length;
const medianDrag = (pr) => {
  const s = pr.rows.map(e => e.omDragAnalytic).sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

// 核(第158便 ZW2 の収載値を機械読取して固定する — 本便のレバーは振幅だけ)
const kernelsOf = (a) => {
  const s = CS5.zw2.perScale[`env${a.envScale}`];
  return { xb: s.kernels.xBase, xc: s.kernels.xCore,
    Rbar: s.kernels.kernelRadiusBase, Rc: s.kernels.kernelRadiusCore, rBar: s.kernels.rBarUsed,
    rBarSource: s.kernels.rBarSource,
    sourcePath: `coreshell5-results.json: zw2.perScale.env${a.envScale}.kernels` };
};

// アンカー・照合先(coreshell7 から機械読取)
const ANCHOR = {
  armKey: NEB_ANCHOR_KEY,
  q50: CS7.q50.summary.env1.q50,
  fitResult: CS7.q50.summary.env1.result,
  source: 'coreshell7-results.json: q50.summary.env1.q50(第168便が 0.025 刻み21点で実測した値)',
};
const cs7Env2 = (CS7.ew2.comparisons || []).find(c => c.armKey === 'env2') || null;
const TARGETQ = {
  armKey: 'env2',
  q50Measured: CS7.q50.summary.env2.q50,
  fitResult: CS7.q50.summary.env2.result,
  source: 'coreshell7-results.json: q50.summary.env2.q50',
  wave168PredictedTwoTerm: cs7Env2 ? cs7Env2.predictedQ50.twoTerm : null,
  wave168AbsDiff: cs7Env2 ? cs7Env2.absDiff : null,
  wave168Source: 'coreshell7-results.json: ew2.comparisons[armKey=env2]',
};

out.checks = {};

// ---- ① 転記照合(実測に先立つ・シミュレーション不要)------------------------------------------
// (a) 第158便 ZW2 の2点分離を、第158便の生プローブ行から本ハーネスの式で再計算して bit 一致を要求する。
{
  const rows = [];
  try {
    const P = CS5.raw.neb.dragProbes;
    const rcClump = CS5.raw.neb.controls['ctl_q1.30'].cfg.coreRc;
    for (const a of NEB_ARMS) {
      const probes = WAVE158_QS.map(q => P[`env${a.envScale}_${tagQ2(q)}`]);
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
    question: '本ハーネスへ転記した2点分離式(クラメル解)と核の定義が、第158便 zw2.perScale.*.separation ' +
      'の値を bit 一致で再現するか(= FW2 の判定に使う式が第158便と 1 bit も違わないことの機械証拠)',
    method: '第158便 raw.neb.dragProbes の生行(omDragAnalytic)から Ω̄_drag(q) を再計算し、同じ核 ' +
      'x_b=R̄/(R̄+r̄)・x_c=Rc/(Rc+r̄) で連立を解いて第158便 JSON の収載値と厳密比較する' +
      '(シミュレーションは行わない)',
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
// (b) 第168便 coreshell7 の 2項複合予測(Ω_crit・env×2 予測)を、本ハーネスの (T5′)+ソルバで再現する。
{
  const rows = [];
  try {
    const refK = kernelsOf(NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY));
    const amp158 = (a) => ({ Ab: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeBase,
      Ac: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeCore });
    const refP = { ...refK, ...amp158(NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY)) };
    const crit = omegaDragNeb(refP, ANCHOR.q50);
    rows.push({ item: 'Ω_crit(coreshell7 の精細アンカー・第158便2点振幅)',
      identical: crit === CS7.predictedBeforeMeasurement.omegaCrit,
      mine: crit, theirs: CS7.predictedBeforeMeasurement.omegaCrit });
    for (const pa of CS7.predictedBeforeMeasurement.arms) {
      const a = NEB_ARMS.find(x => x.key === pa.armKey);
      if (!a) continue;
      const p = { ...kernelsOf(a), ...amp158(a) };
      const two = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
      rows.push({ item: `q₅₀_pred(2項複合・第158便2点振幅) ${pa.armKey}`,
        identical: two.q === pa.predictedQ50.twoTerm,
        mine: two.q, theirs: pa.predictedQ50.twoTerm });
      rows.push({ item: `共有パラメータ(核・第158便振幅) ${pa.armKey}`,
        identical: p.xb === pa.kernels.xBase && p.xc === pa.kernels.xCore &&
          p.Rbar === pa.kernels.kernelRadiusBase && p.Rc === pa.kernels.kernelRadiusCore &&
          p.rBar === pa.kernels.rBar && p.Ab === pa.amplitudes.base && p.Ac === pa.amplitudes.core,
        mine: { xb: p.xb, xc: p.xc, Ab: p.Ab, Ac: p.Ac, Rbar: p.Rbar, Rc: p.Rc, rBar: p.rBar },
        theirs: { xb: pa.kernels.xBase, xc: pa.kernels.xCore, Ab: pa.amplitudes.base,
          Ac: pa.amplitudes.core, Rbar: pa.kernels.kernelRadiusBase,
          Rc: pa.kernels.kernelRadiusCore, rBar: pa.kernels.rBar } });
    }
  } catch (e) { out.checks.wave168TranscriptionError = String(e && e.message); }
  out.checks.transcriptionReproducesWave168Prediction = {
    question: '本ハーネスへ転記した (T5′) 2項複合式と決定的二分法ソルバ、および第158便から機械読取した' +
      '核・2点振幅が、第168便 coreshell7 の予測ブロック(Ω_crit・両アームの q₅₀_pred)を bit 一致で' +
      '再現するか(= 「振幅だけを差し替える」比較が成立することの機械証拠)',
    method: 'coreshell7 と同じ入力(精細アンカー q₅₀・第158便の2点振幅・第158便の核)を本ハーネスの' +
      '関数へ通して再計算し、coreshell7 JSON の収載値と厳密比較する(シミュレーションは行わない)',
    anchorQ50FromWave168: ANCHOR.q50,
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
out.checks.solverMatchesWave168 = {
  mine: SOLVER,
  wave168: (CS7.manifest && CS7.manifest.numerics) ? CS7.manifest.numerics.solver : null,
  identical: (CS7.manifest && CS7.manifest.numerics && CS7.manifest.numerics.solver)
    ? JSON.stringify(canonize(SOLVER)) === JSON.stringify(canonize(CS7.manifest.numerics.solver)) : null };
out.checks.probeQsIncludeWave158Pair = {
  question: '本便のプローブ格子が第158便 ZW2 の2点 {1.5, 2.0} を部分集合として含むか(FW2 の必要条件)',
  probeQs: PROBE_QS, wave158Qs: WAVE158_QS,
  includesAll: WAVE158_QS.every(q => PROBE_QS.includes(q)) };

log(`\n===== ① 転記照合(シミュレーション不要・プローブ走行前)=====`);
log(`  第158便 ZW2 2点分離の再現: ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}`);
log(`  第168便 予測ブロックの再現: ${out.checks.transcriptionReproducesWave168Prediction.nIdentical}/${out.checks.transcriptionReproducesWave168Prediction.nCompared}`);
log(`  ソルバが第168便と同一: ${out.checks.solverMatchesWave168.identical} / プローブ格子が {1.5,2.0} を含む: ${out.checks.probeQsIncludeWave158Pair.includesAll}`);

// ---- ② 封①: 事前登録・プローブ格子・解法・核の出所をプローブ走行前に固定して書き出す ---------
const preRegistrationBlock = {
  declaredBefore: '**どのプローブ走行よりも前**に固定し OUT_PATH へ書き出したブロックである(封①)',
  honestFraming: PRE_REGISTERED.honestFraming,
  windows: { FW1: PRE_REGISTERED.FW1, FW2: PRE_REGISTERED.FW2, FW3: PRE_REGISTERED.FW3 },
  scoringDefinition: PRE_REGISTERED.scoringDefinition,
  probeGridDefinition: PRE_REGISTERED.probeGridDefinition,
  solver: SOLVER,
  arms: NEB_ARMS.map(a => ({ key: a.key, envScale: a.envScale, group: a.group, label: a.label })),
  kernelSource: Object.fromEntries(NEB_ARMS.map(a => [a.key, kernelsOf(a)])),
  anchor: ANCHOR,
  comparisonTarget: TARGETQ,
  wave158Amplitudes: Object.fromEntries(NEB_ARMS.map(a => [a.key, {
    amplitudeBase: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeBase,
    amplitudeCore: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeCore,
    determinant: CS5.zw2.perScale[`env${a.envScale}`].separation.determinant,
    source: `coreshell5-results.json: zw2.perScale.env${a.envScale}.separation`,
    note: '**FW2 の照合先**であり、併記の「新旧比較」の旧側でもある' }])),
  runProtocol: { probeSteps: 1, ctlSteps: CTL_STEPS, dt: 0.016, seed: 20260804,
    note: '第154/158/163/168便の 🐚 走行規約と同一(seed・dt・1步プローブ・対照 3000步)' },
};
out.preRegistrationSeal = {
  canonicalization: 'preRegistrationBlock を再帰キー整列した JSON の SHA-256',
  sha256AtSealTime: canonSha(preRegistrationBlock),
  writtenToDiskBeforeAnyProbe: false, sha256AtFinalWrite: null, unchanged: null,
  note: '事前登録窓・プローブ格子・振幅の解法・核の出所・アンカーと照合先の出所・正直な位置づけを、' +
    '**どのプローブ走行よりも前**にディスクへ書き出してから走行を始める。最終書き出し時に正準化 ' +
    'SHA-256 を照合し、実測後にこれらを書き換えていないことの機械証拠とする' };
out.preRegistrationBlock = preRegistrationBlock;

log(`\n===== ② 封①(プローブ走行前の窓・格子・解法・核の固定)=====`);
log(`  プローブ格子 q=[${PROBE_QS.join(', ')}] × env×[${NEB_ARMS.map(a => a.envScale).join(', ')}](1步プローブ)`);
log(`  アンカー q₅₀_ref=${fmt(ANCHOR.q50)} (coreshell7 env×1 実測) / 照合先 q₅₀_meas=${fmt(TARGETQ.q50Measured)} (coreshell7 env×2 実測)`);
log(`  比較相手の残差(coreshell7・2点振幅)=${fmt(TARGETQ.wave168AbsDiff)} / その予測=${fmt(TARGETQ.wave168PredictedTwoTerm)}`);
out.meta.stage = 'pre-registration-sealed-before-probe';
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
out.preRegistrationSeal.writtenToDiskBeforeAnyProbe = true;
log(`  → 封① を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.preRegistrationSeal.sha256AtSealTime.slice(0, 16)}…)`);

// ---- ③ 引きずりプローブ 4点 × env×{1,2}(本便の主測定)---------------------------------------
const dragProbes = {};
if (doSec('probe')) {
  log(`\n===== ③ 🐚 引きずりプローブ(q=${PROBE_QS.join(',')} × env×${NEB_ARMS.map(a => a.envScale).join(',×')})=====`);
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const t0 = Date.now();
    const pr = await nebDragProbe(q, a.envScale);
    dragProbes[`env${a.envScale}_${tagQ(q)}`] = pr;
    out.meta.timings[`probe:env${a.envScale}_${tagQ(q)}`] = (Date.now() - t0) / 1000;
    log(`  env×${a.envScale} q=${fmt(pr.q, 2)} R̄=${fmt(pr.RbarClump, 4)} ⟨r⟩=${fmt(pr.envMeanR, 3)} Ω̄_drag=${meanDrag(pr).toExponential(6)} Ω̄/Ω_kep=${fmt(pr.meanDragOverKepler, 6)} nEnv=${pr.nEnv}`);
  }
  out.raw.probe = { probeQs: PROBE_QS, dragProbes,
    envMeanRAcrossQs: Object.fromEntries(NEB_ARMS.map(a => {
      const rs = PROBE_QS.map(q => dragProbes[`env${a.envScale}_${tagQ(q)}`].envMeanR);
      return [a.key, { perQ: PROBE_QS.map((q, i) => ({ q, envMeanR: rs[i] })),
        min: Math.min(...rs), max: Math.max(...rs), spread: Math.max(...rs) - Math.min(...rs),
        rBarUsedForKernels: kernelsOf(a).rBar,
        note: '**核 x_b・x_c はこの4点からは取り直していない**(第158便収載値に固定 — ' +
          'preRegistered.probeGridDefinition.kernelsHeldFixed)。この散らばりは固定した核の' +
          '不確かさの目安として記述収載する' }];
    })),
    note: '1步プローブ(kFrame=1 で build → S.step(0.016) を1回)。**q₅₀ の掃引ではない**。' +
      'この Ω̄_drag(q) が本便の振幅解の唯一の入力である' };

  // 第158便 ZW2 収載プローブとの bit 照合(共有する2点のみ)
  const cmp = [];
  const dropRowsJ = (pr) => JSON.stringify({ q: pr.q, RbarClump: pr.RbarClump, envMeanR: pr.envMeanR,
    meanDragOverKepler: pr.meanDragOverKepler, medianDragOverKepler: pr.medianDragOverKepler,
    meanMeasuredOverKepler: pr.meanMeasuredOverKepler, nEnv: pr.nEnv, rows: pr.rows });
  for (const a of NEB_ARMS) for (const q of WAVE158_QS) {
    const mine = dragProbes[`env${a.envScale}_${tagQ(q)}`];
    const theirs = CS5.raw.neb.dragProbes[`env${a.envScale}_${tagQ2(q)}`];
    if (mine && theirs) cmp.push({ label: `🐚引きずりプローブ env×${a.envScale} q=${q}`,
      identical: dropRowsJ(mine) === dropRowsJ(theirs) });
  }
  out.checks.probeReproduction = {
    question: '本便の対象 HTML が第158便と同じ引きずりプローブ値を出すか(共有する q∈{1.5,2.0} の2点)',
    comparisons: cmp, nCompared: cmp.length, nIdentical: cmp.filter(e => e.identical).length,
    allIdentical: cmp.length ? cmp.every(e => e.identical) : null,
    note: '一致していれば「本便の4点振幅と第158便の2点振幅の違いは、点数が増えたことだけに由来する」' +
      'と読める。一致しない場合もそのまま収載し、FW1/FW2 の解釈上の注記とする' };
  log(`  第158便プローブ(q∈{1.5,2.0})との bit 一致: ${out.checks.probeReproduction.nIdentical}/${out.checks.probeReproduction.nCompared}`);

  // 従来対象 index.html との同一性(本便の対象は beta/index.html なので明示確認する)
  if (ALT_SHA_NOW !== null && ALT_SHA_NOW !== TARGET_SHA_NOW) {
    const altPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    altPage.on('pageerror', (e) => console.log('PAGEERROR(alt):', e.message));
    await altPage.goto(ALT_INDEX);
    await altPage.waitForFunction(() => window.HP && HP.sim);
    const altProbe = nebDragProbeOn(altPage);
    const altProbes = {}, acmp = [];
    for (const a of NEB_ARMS) for (const q of PROBE_QS) {
      const pr = await altProbe(q, a.envScale);
      altProbes[`env${a.envScale}_${tagQ(q)}`] = pr;
      acmp.push({ label: `env×${a.envScale} q=${q}`,
        identical: dropRowsJ(pr) === dropRowsJ(dragProbes[`env${a.envScale}_${tagQ(q)}`]) });
    }
    await altPage.close();
    out.raw.probeAltTarget = { target: ALT_TARGET, dragProbes: altProbes,
      note: '従来対象(index.html)で同じ4点プローブを走らせた実測。**本便の判定には使わない**' };
    out.checks.targetEquivalence = {
      question: `本便の対象(${TARGET})と従来対象(${ALT_TARGET})が、本便の測定量について bit 同一か`,
      targetSha256: TARGET_SHA_NOW, altSha256: ALT_SHA_NOW, filesIdentical: false,
      comparisons: acmp, nCompared: acmp.length, nIdentical: acmp.filter(e => e.identical).length,
      allIdentical: acmp.length ? acmp.every(e => e.identical) : null,
      note: 'HTML の SHA は違う(beta は UI 等が別実装)。物理エンジンの当該経路が同一であることを' +
        '**測定値の bit 一致**で示す。**記述・判定外**' };
    log(`  従来対象 ${ALT_TARGET} との測定値 bit 一致: ${out.checks.targetEquivalence.nIdentical}/${out.checks.targetEquivalence.nCompared}`);
  } else {
    out.checks.targetEquivalence = {
      question: `本便の対象(${TARGET})と従来対象(${ALT_TARGET})が同一実体か`,
      targetSha256: TARGET_SHA_NOW, altSha256: ALT_SHA_NOW,
      filesIdentical: ALT_SHA_NOW === TARGET_SHA_NOW,
      comparisons: [], nCompared: 0, nIdentical: 0, allIdentical: null,
      note: 'HTML の SHA が一致(または従来対象が存在しない)ため、測定値の再走行照合は行っていない' };
  }
}

// ---- ④ 対照(kFrame=0 × kRep=0 の bit 一致 — 記述。窓ではない)---------------------------------
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== ④ 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照 — 記述)=====`);
  const runCtl = async (tag, mod) => {
    const t0 = Date.now();
    const r = await measureNeb({ ...mod, steps: CTL_STEPS });
    r.tag = tag; ctl[tag] = r;
    out.meta.timings[`ctl:${tag}`] = (Date.now() - t0) / 1000;
    log(`  [🐚 ${tag.padEnd(10)}] keep=${fmt(r.envelope.keepFrac, 3)} meanR=${fmt(r.envelope.meanR, 1)} clump keep=${fmt(r.clump.keepFrac, 3)} NaN=${r.nan} (${out.meta.timings[`ctl:${tag}`].toFixed(1)}s)`);
  };
  await runCtl('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 });
  await runCtl('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 });
  await runCtl('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 });
  await runCtl('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 });
  out.raw.ctl = { runs: ctl, steps: CTL_STEPS,
    note: 'kFrame=0(引きずり経路を閉じる)かつ kRep=0(E5′ スピン斥力経路を閉じる)なら、q や Ω_c を' +
      '振っても外殻の力学は 1 bit も変わらないはず。**事前登録窓の外の記述**であり判定には使わない。' +
      '本便では第154/158/163/168便との bit 一致照合を通じてエンジン同一性の証拠を兼ねる' };
}
out.meta.stage = 'measured';

// ======================================= 振幅解・予測 =======================================
// ---- ⑤ 4点最小二乗・2点部分集合(6組)・予測 ----------------------------------------------------
const SUBSET_PAIRS = [];
for (let i = 0; i < PROBE_QS.length; i++) for (let j = i + 1; j < PROBE_QS.length; j++)
  SUBSET_PAIRS.push([i, j]);
const subsetKey = (pair) => `${PROBE_QS[pair[0]].toFixed(2)}|${PROBE_QS[pair[1]].toFixed(2)}`;
const WAVE158_SUBSET_KEY = `${WAVE158_QS[0].toFixed(2)}|${WAVE158_QS[1].toFixed(2)}`;

const amplitudes = { fourPoint: {}, twoPointSubsets: {}, wave158: {}, comparison: {} };
let haveAmps = false;
if (out.raw.probe) {
  haveAmps = true;
  for (const a of NEB_ARMS) {
    const K = kernelsOf(a);
    const probes = PROBE_QS.map(q => dragProbes[`env${a.envScale}_${tagQ(q)}`]);
    const ys = probes.map(meanDrag);
    const fit = fitTwoTermLSQ(K.xb, K.xc, PROBE_QS, ys);
    const scaled = fitTwoTermLSQScaled(K.xb, K.xc, PROBE_QS, ys);
    amplitudes.fourPoint[a.key] = { armKey: a.key, envScale: a.envScale, kernels: K,
      omegaBarPerQ: PROBE_QS.map((q, i) => ({ q, meanOmegaDrag: ys[i], medianOmegaDrag: medianDrag(probes[i]),
        meanDragOverKepler: probes[i].meanDragOverKepler, nEnv: probes[i].nEnv })),
      ...fit,
      scaledCrossCheck: { ...scaled,
        relDiffAmplitudeBase: relDiff(fit.amplitudeBase, scaled.amplitudeBase),
        relDiffAmplitudeCore: relDiff(fit.amplitudeCore, scaled.amplitudeCore),
        note: '列を最大値で正規化してから解いた同値解。**記述のみ・判定外**(丸めへの頑健性の目安)' },
      positiveAmplitudes: fit.amplitudeBase > 0 && fit.amplitudeCore > 0,
      caveat: '**平均場近似のパラメータ**であってエンジン内部の量そのものではない' +
        '(第158便 zw2.perScale.*.separation.caveat と同じ限界)' };
    // 2点部分集合(6組)— 第158便と同一の閉形式
    const subs = {};
    for (const pair of SUBSET_PAIRS) {
      const [i, j] = pair;
      const sol = separateTwoTerm(K.xb, K.xc, PROBE_QS[i], PROBE_QS[j], ys[i], ys[j]);
      const viaLsq = fitTwoTermLSQ(K.xb, K.xc, [PROBE_QS[i], PROBE_QS[j]], [ys[i], ys[j]]);
      subs[subsetKey(pair)] = { qs: [PROBE_QS[i], PROBE_QS[j]], omegaBar: [ys[i], ys[j]],
        ...sol,
        viaNormalEquations: { amplitudeBase: viaLsq.amplitudeBase, amplitudeCore: viaLsq.amplitudeCore,
          relDiffAmplitudeBase: relDiff(sol.amplitudeBase, viaLsq.amplitudeBase),
          relDiffAmplitudeCore: relDiff(sol.amplitudeCore, viaLsq.amplitudeCore),
          bitIdenticalToCramer: sol.amplitudeBase === viaLsq.amplitudeBase &&
            sol.amplitudeCore === viaLsq.amplitudeCore,
          note: '同じ2点を4点最小二乗の正規方程式経路(n=2)へ通した解。数学的に同値。' +
            '**FW2 の判定はクラメル解(第158便と同一式)で行う** — この行は解法差の記録である' },
        isWave158Subset: subsetKey(pair) === WAVE158_SUBSET_KEY };
    }
    amplitudes.twoPointSubsets[a.key] = subs;
    amplitudes.wave158[a.key] = {
      amplitudeBase: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeBase,
      amplitudeCore: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeCore,
      determinant: CS5.zw2.perScale[`env${a.envScale}`].separation.determinant,
      source: `coreshell5-results.json: zw2.perScale.env${a.envScale}.separation` };
    amplitudes.comparison[a.key] = {
      fourPoint: { base: fit.amplitudeBase, core: fit.amplitudeCore },
      wave158TwoPoint: { base: amplitudes.wave158[a.key].amplitudeBase,
        core: amplitudes.wave158[a.key].amplitudeCore },
      ratioFourOverTwo: { base: fit.amplitudeBase / amplitudes.wave158[a.key].amplitudeBase,
        core: fit.amplitudeCore / amplitudes.wave158[a.key].amplitudeCore },
      relDiff: { base: relDiff(fit.amplitudeBase, amplitudes.wave158[a.key].amplitudeBase),
        core: relDiff(fit.amplitudeCore, amplitudes.wave158[a.key].amplitudeCore) },
      note: '**新旧比較**(4点最小二乗 vs 第158便の2点解)。記述であり、FW1 の判定はこの比ではなく' +
        '予測と実測の |差| で行う' };
  }
  amplitudes.subsetPairs = SUBSET_PAIRS.map(subsetKey);
  amplitudes.method = PRE_REGISTERED.FW1.solutionMethod;
  amplitudes.kernelsHeldFixedNote = PRE_REGISTERED.probeGridDefinition.kernelsHeldFixed;
  out.amplitudes = amplitudes;
}

// 予測(4点振幅 + 精細アンカー)
const predBlock = { available: false };
if (haveAmps && ANCHOR.q50 !== null && ANCHOR.q50 !== undefined) {
  const pOf = (key) => ({ ...kernelsOf(NEB_ARMS.find(a => a.key === key)),
    Ab: amplitudes.fourPoint[key].amplitudeBase, Ac: amplitudes.fourPoint[key].amplitudeCore });
  const refP = pOf(NEB_ANCHOR_KEY);
  const omegaCrit = omegaDragNeb(refP, ANCHOR.q50);
  const arms = [];
  for (const a of NEB_ARMS) {
    const p = pOf(a.key);
    const two = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), omegaCrit);
    // 単調性の自己点検(固定格子・決定論)
    const mono = (() => {
      const gs = []; for (let q = 0.05; q <= 8.0001; q += 0.05) gs.push(Math.round(q * 1e6) / 1e6);
      const vs = gs.map(q => omegaDragNeb(p, q));
      let ok = true; for (let i = 1; i < vs.length; i++) if (!(vs[i] <= vs[i - 1])) { ok = false; break; }
      return { gridStep: 0.05, monotoneDecreasing: ok };
    })();
    arms.push({ armKey: a.key, label: a.label, group: a.group, envScale: a.envScale,
      isAnchorArm: a.key === NEB_ANCHOR_KEY, judgedByFW1: a.key !== NEB_ANCHOR_KEY,
      anchorRecoveryNote: a.key === NEB_ANCHOR_KEY
        ? '**このアームはアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる**。' +
          'FW1 の判定には使わず、恒等性の自己点検としてのみ収載する'
        : '**アンカーに使っていない構成**。FW1 の判定対象はこのアームである',
      kernels: { xBase: p.xb, xCore: p.xc, kernelRadiusBase: p.Rbar, kernelRadiusCore: p.Rc,
        rBar: p.rBar },
      amplitudesFourPoint: { base: p.Ab, core: p.Ac },
      amplitudesWave158TwoPoint: { base: amplitudes.wave158[a.key].amplitudeBase,
        core: amplitudes.wave158[a.key].amplitudeCore },
      predictedQ50FourPoint: two.q, solver: { bracketed: two.bracketed, residual: two.residual ?? null,
        fAtLo: two.fAtLo, fAtHi: two.fAtHi, note: two.note || null },
      monotonicity: mono,
      extrapolationNote: two.q === null ? null
        : (two.q >= PROBE_QS[0] && two.q <= PROBE_QS[PROBE_QS.length - 1]
          ? `予測 q₅₀ はプローブ区間 [${PROBE_QS[0]}, ${PROBE_QS[PROBE_QS.length - 1]}] の**内側**(内挿)`
          : `予測 q₅₀ はプローブ区間 [${PROBE_QS[0]}, ${PROBE_QS[PROBE_QS.length - 1]}] の**外側**(外挿)`) });
  }
  // 2点部分集合6組それぞれの予測(併記 (c) — 振幅不確かさの定量)
  const subsetPreds = [];
  for (const pair of SUBSET_PAIRS) {
    const k = subsetKey(pair);
    const sRef = amplitudes.twoPointSubsets[NEB_ANCHOR_KEY][k];
    const Kref = kernelsOf(NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY));
    const crit = omegaDragNeb({ xb: Kref.xb, xc: Kref.xc, Ab: sRef.amplitudeBase, Ac: sRef.amplitudeCore },
      ANCHOR.q50);
    const row = { subset: k, qs: sRef.qs, omegaCrit: crit,
      isWave158Subset: k === WAVE158_SUBSET_KEY, arms: {} };
    for (const a of NEB_ARMS) {
      const s = amplitudes.twoPointSubsets[a.key][k];
      const K = kernelsOf(a);
      const p = { xb: K.xb, xc: K.xc, Ab: s.amplitudeBase, Ac: s.amplitudeCore };
      const sol = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
      row.arms[a.key] = { amplitudeBase: s.amplitudeBase, amplitudeCore: s.amplitudeCore,
        predictedQ50: sol.q, bracketed: sol.bracketed };
    }
    subsetPreds.push(row);
  }
  const env2Preds = subsetPreds.map(r => r.arms.env2.predictedQ50).filter(v => v !== null);
  predBlock.available = true;
  predBlock.declaredBefore = '**判定節より前**に確定し OUT_PATH へ書き出したブロックである(封②)。' +
    '**本便には hold-out が存在しないので、封②が担保するのは「判定節で予測を書き換えていない」' +
    'ことだけである**(preRegistered.honestFraming で実測前に宣言済み)';
  predBlock.anchor = ANCHOR;
  predBlock.comparisonTarget = TARGETQ;
  predBlock.omegaCrit = omegaCrit;
  predBlock.omegaCritWave168 = CS7.predictedBeforeMeasurement.omegaCrit;
  predBlock.omegaCritShift = { absolute: omegaCrit - CS7.predictedBeforeMeasurement.omegaCrit,
    relative: relDiff(omegaCrit, CS7.predictedBeforeMeasurement.omegaCrit),
    note: 'Ω_crit は同じアンカー q₅₀ を第158便2点振幅で評価したもの(coreshell7)と 本便4点振幅で' +
      '評価したもの(本便)の差。振幅を解き直した効果がまず現れる場所である' };
  predBlock.arms = arms;
  predBlock.subsetPredictions = { pairs: subsetPreds,
    env2Spread: env2Preds.length ? { n: env2Preds.length, min: Math.min(...env2Preds),
      max: Math.max(...env2Preds), spread: Math.max(...env2Preds) - Math.min(...env2Preds),
      mean: env2Preds.reduce((a, v) => a + v, 0) / env2Preds.length } : null,
    note: '**併記 (c)**: q 4点から2点を選ぶ6通りの部分集合それぞれで env×1/env×2 の振幅を解き、' +
      '同じ部分集合どうしで Ω_crit と予測を立てた。予測 q₅₀ のばらつきが **振幅不確かさの定量**である' +
      '(limits.amplitudeUncertaintyIsNotStatistical の読み方に従うこと)' };
  predBlock.formula = '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を Ω_crit = Ω̄_drag_env1(q₅₀_ref) に' +
    '等しくする q を決定論的二分法で解く。振幅は本便の4点最小二乗解、核は第158便収載値(固定)';
  out.predictedFromRefreshedAmplitudes = predBlock;
  out.predictionIntegrity = {
    canonicalization: 'predictedFromRefreshedAmplitudes を再帰キー整列した JSON の SHA-256',
    sha256AtPredictionTime: canonSha(predBlock),
    writtenToDiskBeforeVerdict: false, sha256AtFinalWrite: null, unchanged: null,
    holdOutNote: '**本便に hold-out は存在しない**。この封は前向き性の証拠ではなく、' +
      '判定節での事後改変が無いことの機械証拠である' };
  out.meta.stage = 'prediction-sealed-before-verdict';
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  out.predictionIntegrity.writtenToDiskBeforeVerdict = true;
  log(`\n===== ⑤ 封②(4点振幅の解と予測の固定)=====`);
  log(`  Ω_crit(4点振幅)=${omegaCrit.toExponential(9)} / coreshell7(2点振幅)=${CS7.predictedBeforeMeasurement.omegaCrit.toExponential(9)} 相対差=${fmt(predBlock.omegaCritShift.relative, 8)}`);
  for (const a of arms)
    log(`  ${a.armKey.padEnd(6)} A_b=${fmt(a.amplitudesFourPoint.base, 6)}(旧 ${fmt(a.amplitudesWave158TwoPoint.base, 6)}) A_c=${fmt(a.amplitudesFourPoint.core, 6)}(旧 ${fmt(a.amplitudesWave158TwoPoint.core, 6)}) → 予測 q₅₀=${fmt(a.predictedQ50FourPoint, 6)}`);
  log(`  → 封② を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.predictionIntegrity.sha256AtPredictionTime.slice(0, 16)}…)`);
}
out.meta.stage = 'complete';

// ======================================= 集計・判定 =========================================
// 事前登録した規則をそのまま適用する(実測後に規則を変えない)。
const dynKeysNeb = ['clump', 'envelope', 'n', 'nan', 'clampV', 'clampS'];
const pickJ = (o, ks) => { const r = {}; for (const k of ks) r[k] = o[k]; return JSON.stringify(r); };
const fullJ = (o) => { const r = { ...o }; delete r.cfg; delete r.tag; return JSON.stringify(r); };

// ---- FW1(主窓): 4点振幅による 2項複合予測 vs coreshell7 env×2 実測 ---------------------------
out.fw1 = { rule: PRE_REGISTERED.FW1, comparisons: [], verdict: null, coRecorded: {} };
if (predBlock.available) {
  const rows = [];
  for (const a of predBlock.arms) {
    const isJudged = a.judgedByFW1;
    const measured = a.armKey === 'env1' ? ANCHOR.q50 : TARGETQ.q50Measured;
    const pred = a.predictedQ50FourPoint;
    const d = (pred === null || measured === null) ? null : Math.abs(measured - pred);
    rows.push({ armKey: a.armKey, label: a.label, group: a.group,
      isAnchorArm: a.isAnchorArm, judgedByFW1: isJudged,
      anchorRecoveryNote: a.anchorRecoveryNote,
      kernels: a.kernels,
      amplitudesFourPoint: a.amplitudesFourPoint,
      amplitudesWave158TwoPoint: a.amplitudesWave158TwoPoint,
      predictedQ50FourPoint: pred,
      predictedQ50Wave168TwoPoint: (() => {
        const w = (CS7.predictedBeforeMeasurement.arms || []).find(x => x.armKey === a.armKey);
        return (w && w.predictedQ50) ? w.predictedQ50.twoTerm : null;
      })(),
      measuredQ50: measured, measuredSource: a.armKey === 'env1' ? ANCHOR.source : TARGETQ.source,
      signedDiff: (pred === null || measured === null) ? null : (measured - pred),
      absDiff: d, tolerance: PRE_REGISTERED.FW1.tolerance,
      withinTolerance: d === null ? null : d <= PRE_REGISTERED.FW1.tolerance,
      withinTighter0p05: d === null ? null : d <= 0.05, tighterThreshold: 0.05,
      extrapolationNote: a.extrapolationNote,
      monotonicity: a.monotonicity,
      result: !isJudged ? 'NOT-JUDGED'
        : (pred === null ? 'INCONCLUSIVE' : (d <= PRE_REGISTERED.FW1.tolerance ? 'PASS' : 'FAIL')),
      resultReason: !isJudged ? 'アンカー構成(予測は恒等)なので FW1 の判定対象外 — 恒等性の自己点検として収載する'
        : (pred === null ? '二分法が固定区間で解を挟めなかった(事前登録の INCONCLUSIVE 規則)' : null) });
  }
  out.fw1.comparisons = rows;
  const judged = rows.filter(e => e.judgedByFW1);
  out.fw1.verdict = { window: PRE_REGISTERED.FW1.window, tolerance: PRE_REGISTERED.FW1.tolerance,
    judgedArms: judged.map(e => e.armKey),
    result: judged.length ? (judged.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
      : (judged.every(e => e.result === 'PASS') ? 'PASS' : 'FAIL')) : null,
    perArm: rows.map(e => ({ armKey: e.armKey, judgedByFW1: e.judgedByFW1,
      predictedQ50FourPoint: e.predictedQ50FourPoint, measured: e.measuredQ50,
      absDiff: e.absDiff, result: e.result })),
    note: '判定対象は env×2 の1アームのみ(env×1 は恒等予測なので NOT-JUDGED)。' +
      '**hold-out は存在しない** — PASS を「未知を当てた」証拠として読んではならない' };

  const j = judged[0] || null;
  // (a) より厳しい目安
  out.fw1.coRecorded.a_tighter0p05 = {
    item: '(a) |差| ≤ 0.05 に入るか(**記述のみ** — 判定は 0.10 のまま)', threshold: 0.05,
    arms: rows.map(e => ({ armKey: e.armKey, judgedByFW1: e.judgedByFW1, absDiff: e.absDiff,
      within: e.withinTighter0p05 })) };
  // (b) coreshell7 残差からの改善有無
  out.fw1.coRecorded.b_improvementOverWave168 = {
    item: '(b) coreshell7 の残差 0.0435 からの改善有無(**記述のみ**。悪化も収載する)',
    wave168AbsDiff: TARGETQ.wave168AbsDiff,
    wave168PredictedTwoTerm: TARGETQ.wave168PredictedTwoTerm,
    thisWaveAbsDiff: j ? j.absDiff : null,
    thisWavePredicted: j ? j.predictedQ50FourPoint : null,
    change: (j && j.absDiff !== null && TARGETQ.wave168AbsDiff !== null)
      ? j.absDiff - TARGETQ.wave168AbsDiff : null,
    improved: (j && j.absDiff !== null && TARGETQ.wave168AbsDiff !== null)
      ? j.absDiff < TARGETQ.wave168AbsDiff : null,
    improvementFactor: (j && j.absDiff !== null && TARGETQ.wave168AbsDiff)
      ? TARGETQ.wave168AbsDiff / j.absDiff : null,
    predictionShift: (j && j.predictedQ50FourPoint !== null && TARGETQ.wave168PredictedTwoTerm !== null)
      ? j.predictedQ50FourPoint - TARGETQ.wave168PredictedTwoTerm : null,
    note: '同じアンカー・同じ核・同じ式・同じソルバで、**振幅だけ**を第158便2点解から本便4点最小二乗解へ' +
      '差し替えたときの残差の動き。転記照合 checks.transcriptionReproducesWave168Prediction が ' +
      'bit 一致なら、この差は振幅の差だけに由来する' };
  // (c) 部分集合ばらつき
  out.fw1.coRecorded.c_subsetSpread = {
    item: '(c) 2点部分集合(6組)それぞれの振幅→予測のばらつき(**振幅不確かさの定量**・記述のみ)',
    pairs: predBlock.subsetPredictions.pairs.map(r => ({ subset: r.subset, qs: r.qs,
      isWave158Subset: r.isWave158Subset,
      env1: { amplitudeBase: r.arms.env1.amplitudeBase, amplitudeCore: r.arms.env1.amplitudeCore },
      env2: { amplitudeBase: r.arms.env2.amplitudeBase, amplitudeCore: r.arms.env2.amplitudeCore },
      omegaCrit: r.omegaCrit,
      predictedQ50Env2: r.arms.env2.predictedQ50,
      absDiffVsMeasured: r.arms.env2.predictedQ50 === null ? null
        : Math.abs(TARGETQ.q50Measured - r.arms.env2.predictedQ50) })),
    env2Spread: predBlock.subsetPredictions.env2Spread,
    fourPointPrediction: j ? j.predictedQ50FourPoint : null,
    fourPointInsideSubsetRange: (j && predBlock.subsetPredictions.env2Spread && j.predictedQ50FourPoint !== null)
      ? (j.predictedQ50FourPoint >= predBlock.subsetPredictions.env2Spread.min &&
         j.predictedQ50FourPoint <= predBlock.subsetPredictions.env2Spread.max) : null,
    measured: TARGETQ.q50Measured,
    measuredInsideSubsetRange: predBlock.subsetPredictions.env2Spread
      ? (TARGETQ.q50Measured >= predBlock.subsetPredictions.env2Spread.min &&
         TARGETQ.q50Measured <= predBlock.subsetPredictions.env2Spread.max) : null,
    note: 'ばらつきの幅は「振幅の統計的な誤差棒」ではなく「(T5′) 2項近似が q に依って違う振幅を' +
      '要求する度合い」である(limits.amplitudeUncertaintyIsNotStatistical)。' +
      '**幅が FW1 の残差と同じ桁なら、残差は振幅の粗さではなくモデル構造に由来すると読める**' };
  // (d) 4点適合の残差(相対)
  out.fw1.coRecorded.d_fitResidual = {
    item: '(d) 4点適合の残差(相対)(**記述のみ**)',
    arms: NEB_ARMS.map(a => {
      const f = amplitudes.fourPoint[a.key];
      return { armKey: a.key,
        perQ: f.qs.map((q, i) => ({ q, omegaBarMeasured: f.omegaBar[i], model: f.model[i],
          residual: f.residual[i], relativeResidual: f.relativeResidual[i] })),
        maxAbsRelativeResidual: f.maxAbsRelativeResidual,
        rmsRelativeResidual: f.rmsRelativeResidual,
        rmse: f.rmse, rmseOverMeanOmegaBar: f.rmseOverMeanOmegaBar,
        basisCorrelation: f.basisCorrelation, conditionProxy: f.conditionProxy,
        positiveAmplitudes: f.positiveAmplitudes,
        scaledPathRelDiff: { base: f.scaledCrossCheck.relDiffAmplitudeBase,
          core: f.scaledCrossCheck.relDiffAmplitudeCore } };
    }),
    note: '相対残差が数値床(倍精度 ~1e-16)より十分大きければ、(T5′) の2項形は 4点の Ω̄_drag(q) を' +
      '**厳密には**表せていない(2点だけなら定義上ぴったり通る)。その大きさが平均場2項近似の' +
      '当てはまりの直接の物差しである' };
} else {
  out.fw1.verdict = { window: PRE_REGISTERED.FW1.window, tolerance: PRE_REGISTERED.FW1.tolerance,
    judgedArms: [], result: 'INCONCLUSIVE',
    note: 'プローブ節を実行していない(CS8_ONLY)ため予測が立たない' };
}

// ---- FW2(整合): 部分集合 {1.5,2.0} の振幅が第158便収載値と bit 一致するか --------------------
out.fw2 = { rule: PRE_REGISTERED.FW2, comparisons: [], verdict: null };
if (haveAmps) {
  const rows = [];
  for (const a of NEB_ARMS) {
    const s = amplitudes.twoPointSubsets[a.key][WAVE158_SUBSET_KEY];
    const t = amplitudes.wave158[a.key];
    for (const [field, mineV, theirsV] of [
      ['amplitudeBase', s.amplitudeBase, t.amplitudeBase],
      ['amplitudeCore', s.amplitudeCore, t.amplitudeCore],
      ['determinant', s.determinant, t.determinant]]) {
      const rd = relDiff(mineV, theirsV);
      rows.push({ armKey: a.key, envScale: a.envScale, field, subset: WAVE158_SUBSET_KEY,
        mine: mineV, theirs: theirsV, bitIdentical: mineV === theirsV, relativeDiff: rd,
        withinFallback: rd === null ? null : rd <= PRE_REGISTERED.FW2.tolerance.fallbackRelative,
        result: mineV === theirsV ? 'PASS'
          : (rd !== null && rd <= PRE_REGISTERED.FW2.tolerance.fallbackRelative
            ? 'PASS(相対差判定)' : 'FAIL') });
    }
  }
  out.fw2.comparisons = rows;
  const allBit = rows.every(e => e.bitIdentical);
  out.fw2.verdict = { window: PRE_REGISTERED.FW2.window,
    nCompared: rows.length, nBitIdentical: rows.filter(e => e.bitIdentical).length,
    allBitIdentical: allBit,
    maxRelativeDiff: rows.reduce((m, e) => (e.relativeDiff === null ? m : Math.max(m, e.relativeDiff)), 0),
    result: rows.every(e => e.result.startsWith('PASS')) ? 'PASS' : 'FAIL',
    fallbackUsed: !allBit && rows.every(e => e.result.startsWith('PASS')),
    fallbackUsedReason: allBit ? null
      : '2点部分集合をクラメル解(第158便と同一式)で解いても bit がずれた。' +
        '本便のプローブ値・核・式のいずれかが第158便と厳密には一致していないことを意味する — ' +
        'checks.probeReproduction と checks.transcriptionReproducesWave158Separation を併せて読むこと',
    note: '本便の2点部分集合は第158便と同一の閉形式で解いているので bit 一致が既定の期待である。' +
      'あわせて同じ部分集合を正規方程式経路(n=2)へ通した解との相対差を ' +
      'amplitudes.twoPointSubsets.*[subset].viaNormalEquations に収載した(解法差の記録)' };
  // 解法差の要約(記述)
  out.fw2.solverPathDifference = {
    note: '**記述・判定外**。同じ2点をクラメル解と正規方程式経路(n=2)で解いた差。' +
      '数学的には同値だが浮動小数の演算順序が違うので bit がずれうる',
    rows: NEB_ARMS.map(a => {
      const s = amplitudes.twoPointSubsets[a.key][WAVE158_SUBSET_KEY];
      return { armKey: a.key, bitIdentical: s.viaNormalEquations.bitIdenticalToCramer,
        relDiffAmplitudeBase: s.viaNormalEquations.relDiffAmplitudeBase,
        relDiffAmplitudeCore: s.viaNormalEquations.relDiffAmplitudeCore };
    }) };
} else {
  out.fw2.verdict = { window: PRE_REGISTERED.FW2.window, result: 'INCONCLUSIVE',
    note: 'プローブ節を実行していない(CS8_ONLY)ため比較できない' };
}

// ---- 対照(記述)・過去便との bit 照合 --------------------------------------------------------
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

{
  const add = [], probeCmp = [];
  try {
    const CTL_SOURCES = [
      { wave: '第168便', path: 'raw.ctl.runs', runs: (CS7.raw && CS7.raw.ctl) ? CS7.raw.ctl.runs : null },
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
    if (out.raw.probe && CS7.raw && CS7.raw.probe && CS7.raw.probe.dragProbes) {
      const dropRowsJ = (pr) => JSON.stringify({ q: pr.q, RbarClump: pr.RbarClump, envMeanR: pr.envMeanR,
        meanDragOverKepler: pr.meanDragOverKepler, medianDragOverKepler: pr.medianDragOverKepler,
        meanMeasuredOverKepler: pr.meanMeasuredOverKepler, nEnv: pr.nEnv, rows: pr.rows });
      for (const a of NEB_ARMS) for (const q of WAVE158_QS) {
        const k = `env${a.envScale}_${tagQ(q)}`;
        const mine = dragProbes[k], theirs = CS7.raw.probe.dragProbes[k];
        if (mine && theirs) probeCmp.push({ label: `🐚プローブ ${k} vs 第168便`,
          identical: dropRowsJ(mine) === dropRowsJ(theirs) });
      }
    }
  } catch (e) { out.crossWaveError = String(e && e.message); }
  const roll = (arr) => { const cmp = arr.filter(e => e.identical !== null);
    return { comparisons: arr, nCompared: cmp.length, nIdentical: cmp.filter(e => e.identical).length,
      mismatches: cmp.filter(e => !e.identical).map(e => e.label),
      allIdentical: cmp.length ? cmp.every(e => e.identical) : null }; };
  out.crossWaveCheck = { window: null,
    source: 'tests/out/coreshell7-results.json(第168便)/ tests/out/coreshell5-results.json(第158便)',
    controlSourcePaths: { 第168便: 'raw.ctl.runs', 第158便: 'raw.neb.controls' },
    controlSourceNote: '対照の収載位置は便ごとに違う。第158便の raw.ctl.runs は ⚫blackHole 節の対照で' +
      '**🐚 とは別物**なので、第158便については raw.neb.controls を明示指定して比較している',
    note: '設定が一致する走行(同一プリセット・同一 seed・同一步数・同一ノブ)の力学フィールド bit 一致。' +
      '**事前登録窓の外の記述**であり判定には使わない。本便は q₅₀ 掃引を行わないので、掃引点の' +
      '比較対象は存在しない',
    controls: roll(add), probesVsWave168: roll(probeCmp) };
  if (QUICK) out.crossWaveCheck.quickNote = '煙試験(CS8_QUICK)では対照の步数が 1/10 なので bit 一致は成立しない';
}

// ---- FW3: 決定性(2回実行ビット同一)----
{
  const target = { raw: out.raw,
    predictedFromRefreshedAmplitudes: out.predictedFromRefreshedAmplitudes || null };
  const mine = JSON.stringify(canonize(target));
  const rec = { canonicalization: PRE_REGISTERED.FW3.canonicalization,
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.CS8_DET_REF;
  if (refPath) {
    const waitSec = Number(process.env.CS8_DET_WAIT_SEC || 0);
    const deadline = Date.now() + waitSec * 1000;
    let other = null, tries = 0;
    while (true) {
      tries++;
      if (fs.existsSync(refPath)) {
        try {
          const j = JSON.parse(fs.readFileSync(refPath, 'utf8'));
          other = (j.meta && j.meta.stage === 'complete') ? j : null;
        } catch { other = null; }
      }
      if (other || Date.now() > deadline) break;
      await new Promise(r => setTimeout(r, 5000));
    }
    if (other) {
      const otherJ = JSON.stringify(canonize({ raw: other.raw || {},
        predictedFromRefreshedAmplitudes: other.predictedFromRefreshedAmplitudes || null }));
      rec.reference = path.basename(refPath);
      rec.referenceSha256 = sha256(Buffer.from(otherJ, 'utf8'));
      rec.identical = (mine === otherJ);
      rec.readAttempts = tries;
      rec.note = '2回目は別プロセス・別ブラウザ起動で全節を再実行したもの(同一スクリプト・同一 seed)';
    } else {
      rec.reference = path.basename(refPath);
      rec.identical = null;
      rec.note = `参照 JSON を読めなかった(待機 ${waitSec}s・試行 ${tries} 回)`;
    }
  }
  out.determinism = rec;
}
out.fw3 = { rule: PRE_REGISTERED.FW3, sha256: out.determinism.sha256,
  reference: out.determinism.reference, identical: out.determinism.identical,
  result: out.determinism.identical === null ? 'PENDING(参照なし)'
    : (out.determinism.identical ? 'PASS' : 'FAIL') };

// ---- 封の自己点検(封①・封②が判定後に動いていないこと)----
{
  const nowPre = canonSha(out.preRegistrationBlock);
  out.preRegistrationSeal.sha256AtFinalWrite = nowPre;
  out.preRegistrationSeal.unchanged = (nowPre === out.preRegistrationSeal.sha256AtSealTime);
  if (out.predictedFromRefreshedAmplitudes && out.predictionIntegrity) {
    const now = canonSha(out.predictedFromRefreshedAmplitudes);
    out.predictionIntegrity.sha256AtFinalWrite = now;
    out.predictionIntegrity.unchanged = (now === out.predictionIntegrity.sha256AtPredictionTime);
  }
}

out.meta.elapsedSec = (Date.now() - T_START) / 1000;

// ---- 実験マニフェスト(第145便様式)----------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell8', wave: 174,
    title: 'コア外殻第8実験 — 🐚 平均場2項振幅の **4点最小二乗による解き直し**(振幅分解能)と、' +
      'coreshell7 精細アンカーによる 2項複合予測の再照合(事前登録窓 FW1 主窓 |予測−実測| ≤ 0.10 / ' +
      'FW2 整合 部分集合{1.5,2.0}の振幅が第158便収載値と bit 一致 / FW3 決定性。' +
      '併記 (a) 0.05 目安 (b) coreshell7 残差 0.0435 からの改善有無 (c) 2点部分集合6組の予測ばらつき' +
      '(振幅不確かさ) (d) 4点適合の相対残差 — いずれも記述)' +
      ' ※**hold-out は存在しない**(preRegistered.honestFraming)。**新規 q₅₀ 掃引なし**',
    command: 'node tests/exp-coreshell8.mjs(節選択 CS8_ONLY=… / 出力先 CS8_OUT=… / ' +
      '決定性参照 CS8_DET_REF=… / 煙試験 CS8_QUICK=1 / 対象変更 QA_TARGET=…)' },
  presets: { mode: 'builtin', ids: ['nebulaShell'],
    modifiedAtRuntime: 'プローブは kFrame=1 と 影響範囲指数 q のみを上書きし、エンベロープ ring の ' +
      'rIn/rOut に半径倍率 envScale を掛けて build する(**倍率が 1 のときは ring の上書きを省く** = ' +
      'プリセット実値のまま build するので第154便/第158便の env×1 走行と build が同一になる)。' +
      '対照は kFrame=0 / kRep=0 / q / core.omega 倍率を第168便と同一の改変器で上書きする。' +
      '改変内容は各 run.cfg / プローブの cfg に記録済み',
    note: 'seed はプリセット定義値(🐚 20260804)をそのまま使う' },
  numerics: {
    seed: { nebulaShell: 20260804, note: 'プリセット定義値(改変器は seed を触らない)' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { probes: '1步(引きずりプローブ = 本便の主測定)', controls: CTL_STEPS, quick: QUICK,
      sweeps: NOT_APPLICABLE },
    window: { probes: 't=0+(1步後の解析値)',
      controls: 't=48(validT・第154/158/163/168便と同一窓)',
      q50: '本便は q₅₀ を掃引していない — coreshell7 の実測値(3000步・validT=48)を機械読取する' },
    warmup: NOT_APPLICABLE,
    probeGrid: { qs: PROBE_QS, envScales: NEB_ARMS.map(a => a.envScale),
      definition: PRE_REGISTERED.probeGridDefinition,
      subsetPairs: SUBSET_PAIRS.map(subsetKey), wave158Subset: WAVE158_SUBSET_KEY },
    amplitudeSolver: PRE_REGISTERED.FW1.solutionMethod,
    solver: SOLVER,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセット nebulaShell の初期配置・質量・seed(第135便〜第168便と同一 — ' +
      '本便で再フィットしない)', 'dt=0.016',
      '**核 x_b・x_c**(= 第158便 ZW2 の収載値。coreshell5-results.json から機械読取し、' +
      '本便では取り直さない。provenance.inputs に sha256)',
      '**アンカー q₅₀_ref = 第168便 coreshell7 の env×1 実測 q₅₀**(coreshell7-results.json から' +
      '機械読取。未知の Ω_crit を代数的に消去するための代入であり較正自由度ではない)',
      '**照合先 q₅₀_meas = 第168便 coreshell7 の env×2 実測 q₅₀**(coreshell7-results.json から' +
      '機械読取。**本便では測り直さない = hold-out ではない**)',
      '予測式の関数形((T1)(T5′))と二分法ソルバ(第155便→第158便→第163便→第168便からの逐語転記。' +
      '転記の正しさは checks.transcriptionReproducesWave158Separation / …Wave168Prediction が ' +
      'bit 一致で機械照合する)',
      '振幅の解法(4点は重みなし最小二乗の正規方程式・2点部分集合は第158便と同一のクラメル解 — ' +
      'プローブ走行前に preRegistered.FW1.solutionMethod へ宣言固定)',
      'プローブ格子 q∈{1.25,1.5,1.75,2.0}(プローブ走行前に封①で固定)',
      '事前登録窓 FW1 の許容 0.10・FW2 の bit 一致/相対 1e-12(実測前に固定・実測後に動かさない)'],
    fit: [],
    derived: ['🐚 引きずりプローブの Ω̄_drag(q)(raw.probe — 1步後の解析値の平均)',
      '**平均場2項振幅 A_b・A_c の4点最小二乗解**(amplitudes.fourPoint — 当てはめる相手は' +
      '**プローブ実測 Ω̄_drag(q)** であって FW1 が判定する q₅₀ ではない。すなわち予測対象の残差を' +
      '小さくする較正自由度を一つも導入していない。閉形式の正規方程式で、初期値・乱数・反復を持たない)',
      '2点部分集合6組の振幅解と、そこから立つ予測のばらつき(amplitudes.twoPointSubsets・' +
      'predictedFromRefreshedAmplitudes.subsetPredictions — 記述のみ)',
      '4点振幅による Ω_crit と予測 q₅₀・実測との |差|(predictedFromRefreshedAmplitudes・fw1)',
      '4点適合の残差(相対)と基底相関・条件数代理(fw1.coRecorded.d_fitResidual — 記述)',
      '対照の bit 一致(controls — 記述)', '決定性ハッシュ(determinism)',
      '第168便・第158便との対照/プローブ bit 照合(crossWaveCheck・checks — 記述)',
      '本便対象(beta/index.html)と従来対象(index.html)の測定値 bit 一致' +
      '(checks.targetEquivalence — 記述)'],
    holdOut: ['**本便に hold-out は存在しない**。照合先の q₅₀(1.5300)も比較相手の残差(0.0435)も' +
      '第168便で既に確定した既知量であり、本便はそれを機械読取するだけである' +
      '(preRegistered.honestFraming で実測前に宣言)。前向きなのは「振幅を解き直した結果が' +
      'どちらへ動くか」が封①の時点で未計算だったことのみで、それは hold-out ではない',
      '第152便・第154便・第155便・第158便・第163便・第168便の実測/解析値(本便は読み取り専用の' +
      '照合参照としてのみ使い、書き換えない)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = ' +
      '**本便で新しい較正自由度を一つも導入していない**。4点最小二乗は「プローブ実測 Ω̄_drag(q) に' +
      'モデル (T5′) を当てる」操作であって、判定対象である q₅₀ の残差に触れる自由度ではない' +
      '(designPrinciples.lsqIsAgainstProbeObservable)。**本便は hold-out を持たない事後解析であり、' +
      'FW1 の PASS を「未知を当てた」証拠として読んではならない**ことを honestFraming で' +
      '実測前に宣言している',
  },
  judgement: {
    pointers: ['preRegistered', 'preRegistered.honestFraming', 'limits', 'provenance.inputs', 'checks',
      'preRegistrationBlock', 'preRegistrationSeal', 'raw.probe', 'amplitudes',
      'predictedFromRefreshedAmplitudes', 'predictionIntegrity',
      'fw1.verdict', 'fw1.comparisons', 'fw1.coRecorded', 'fw2.verdict', 'fw2.comparisons', 'fw3',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、プローブ走行前に固定した格子・解法・核・アンカーは ' +
      'preRegistrationBlock(改変が無いことは preRegistrationSeal)、4点振幅とそこから立てた予測は ' +
      'predictedFromRefreshedAmplitudes(判定節での改変が無いことは predictionIntegrity)、' +
      'エンジン実測は raw、主窓の判定は fw1.verdict、併記群 (a)〜(d) は fw1.coRecorded、' +
      '整合は fw2.verdict、決定性は fw3 にある',
    externalReferences: [
      '第168便 coreshell7 の 🐚 精細 q₅₀(env×1 1.6575 / env×2 1.5300)・2項複合予測 1.4865・' +
      '残差 0.0435(tests/out/coreshell7-results.json — 本便のアンカー・照合先・比較相手)',
      '第158便 ZW2 の 🐚 平均場2項分離 A_b・A_c と核 x_b・x_c(tests/out/coreshell5-results.json — ' +
      '本便の核の出所・FW2 の照合先・新旧比較の旧側)',
      '第155便の予測式 (T1) Ω_drag(r;q₅₀)=Ω_crit ・(T5) 2項複合' +
      '(tests/out/coreshell-theory-results.json — 本便は 🐚 平均場版 (T5′) として用いる)',
      '第163便 coreshell6 の 0.05 格子 q₅₀(coreshell7 経由で参照)',
      '遠方漸近の臨界指数 3/2(第135便が同定)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第168便/第158便の対照・プローブとの bit 一致**' +
        '(crossWaveCheck・checks.probeReproduction)・**本便対象と従来対象の測定値 bit 一致**' +
        '(checks.targetEquivalence)・**最小二乗の尺度正規化経路との相対差**' +
        '(fw1.coRecorded.d_fitResidual[].scaledPathRelDiff)・**決定性ハッシュ**' +
        '(determinism.sha256)である' },
  },
  regenerationNote: 'meta.date / meta.elapsedSec / meta.timings / meta.only / meta.stage / ' +
    'determinism.readAttempts は非測定メタなので照合対象外(determinism の正規化と同方針)。' +
    '走行時間は raw に入れていないので raw は完全に決定論的である',
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'meta.timings', 'meta.only', 'meta.stage',
    'determinism.readAttempts'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));

log(`\n===== 判定(事前登録窓 — 実測後に動かさない)=====`);
if (haveAmps) {
  log('振幅(4点最小二乗 / 旧=第158便2点解):');
  for (const a of NEB_ARMS) {
    const c = amplitudes.comparison[a.key];
    log(`   ${a.key.padEnd(6)} A_b=${fmt(c.fourPoint.base, 6)}(旧 ${fmt(c.wave158TwoPoint.base, 6)}・比 ${fmt(c.ratioFourOverTwo.base, 4)})` +
      `  A_c=${fmt(c.fourPoint.core, 6)}(旧 ${fmt(c.wave158TwoPoint.core, 6)}・比 ${fmt(c.ratioFourOverTwo.core, 4)})`);
  }
  log('4点適合の相対残差: ' + out.fw1.coRecorded.d_fitResidual.arms.map(e =>
    `${e.armKey} max|rel|=${e.maxAbsRelativeResidual.toExponential(3)} RMS=${e.rmsRelativeResidual.toExponential(3)} 基底相関=${fmt(e.basisCorrelation, 6)}`).join(' / '));
}
if (out.fw1.verdict) {
  log(`FW1 主窓(4点振幅 2項複合予測・許容 ${PRE_REGISTERED.FW1.tolerance}・判定対象 ${(out.fw1.verdict.judgedArms || []).join(',')})→ ${out.fw1.verdict.result}`);
  for (const c of out.fw1.comparisons)
    log(`   ${c.armKey.padEnd(6)}${c.judgedByFW1 ? '[FW1 判定]  ' : '[アンカー恒等]'} 予測(4点)=${fmt(c.predictedQ50FourPoint, 6)} 旧予測(2点)=${fmt(c.predictedQ50Wave168TwoPoint, 6)} 実測=${fmt(c.measuredQ50, 4)} ` +
      `|差|=${fmt(c.absDiff, 6)} → ${c.result}` + (c.resultReason ? ` [${c.resultReason}]` : '') +
      `   [(a) ≤0.05: ${c.withinTighter0p05}]  [${c.extrapolationNote || '—'}]`);
  const b = out.fw1.coRecorded.b_improvementOverWave168;
  if (b) log(`併記(b) coreshell7 残差 ${fmt(b.wave168AbsDiff, 6)} → 本便 ${fmt(b.thisWaveAbsDiff, 6)}(変化 ${b.change === null ? '—' : (b.change >= 0 ? '+' : '') + fmt(b.change, 6)}・改善=${b.improved}・予測の移動 ${b.predictionShift === null ? '—' : fmt(b.predictionShift, 6)})`);
  const c = out.fw1.coRecorded.c_subsetSpread;
  if (c && c.env2Spread) {
    log(`併記(c) 2点部分集合6組の env×2 予測: min=${fmt(c.env2Spread.min, 6)} max=${fmt(c.env2Spread.max, 6)} 幅=${fmt(c.env2Spread.spread, 6)}(4点解=${fmt(c.fourPointPrediction, 6)}・区間内=${c.fourPointInsideSubsetRange}・実測 ${fmt(c.measured, 4)} が区間内=${c.measuredInsideSubsetRange})`);
    for (const r of c.pairs)
      log(`     {${r.qs.join(', ')}}${r.isWave158Subset ? '(第158便の2点)' : '            '} A_b(env2)=${fmt(r.env2.amplitudeBase, 6)} A_c(env2)=${fmt(r.env2.amplitudeCore, 6)} 予測=${fmt(r.predictedQ50Env2, 6)} |差|=${fmt(r.absDiffVsMeasured, 6)}`);
  }
}
if (out.fw2.verdict)
  log(`FW2 整合(部分集合 {1.5,2.0} が第158便収載値と bit 一致)→ ${out.fw2.verdict.result}` +
    `(bit 一致 ${out.fw2.verdict.nBitIdentical}/${out.fw2.verdict.nCompared}・最大相対差 ${out.fw2.verdict.maxRelativeDiff === null ? '—' : out.fw2.verdict.maxRelativeDiff.toExponential(3)})`);
log(`封①(窓・格子・解法・核)の不変性: sha256 一致=${out.preRegistrationSeal.unchanged}` +
  ` / 封②(振幅と予測)の不変性: sha256 一致=${out.predictionIntegrity ? out.predictionIntegrity.unchanged : '—'}`);
log(`転記照合: 第158便2点分離 ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}` +
  ` / 第168便予測ブロック ${out.checks.transcriptionReproducesWave168Prediction.nIdentical}/${out.checks.transcriptionReproducesWave168Prediction.nCompared}` +
  (out.checks.probeReproduction ? ` / プローブ再現 ${out.checks.probeReproduction.nIdentical}/${out.checks.probeReproduction.nCompared}` : '') +
  (out.checks.targetEquivalence ? ` / 対象同値 ${out.checks.targetEquivalence.nIdentical}/${out.checks.targetEquivalence.nCompared}` : ''));
log(`FW3 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical} → ${out.fw3.result}`);
log(`対照(記述)kF0×kRep0 allDynamicsIdentical=${out.controls.allDynamicsIdentical}` +
  ` / 過去便対照との bit 一致 ${out.crossWaveCheck.controls.nIdentical}/${out.crossWaveCheck.controls.nCompared}` +
  ` / 第168便プローブとの bit 一致 ${out.crossWaveCheck.probesVsWave168.nIdentical}/${out.crossWaveCheck.probesVsWave168.nCompared}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${out.meta.elapsedSec.toFixed(1)} 秒)`);
await browser.close();

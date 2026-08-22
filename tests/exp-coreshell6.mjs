// 第163便 exp-coreshell6.mjs — コア外殻第6実験(🐚nebulaShell の q 掃引・事前登録 BW1〜BW3)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs →
//   第152便 tests/exp-coreshell3.mjs → 第154便 tests/exp-coreshell4.mjs →
//   第155便 tests/exp-coreshell-theory.mjs(解析専用)→ 第158便 tests/exp-coreshell5.mjs の続き。
//
// 第158便 ZW2 は「🐚 の引きずりは粒子対ごとの距離に依存する多項和で、プローブが 1 つの q でしか
//   回っていないため未知2個に対し方程式1本しか無く、2つの振幅を分離できない」という第155便の
//   行き止まりを、**q を2点(1.5 / 2.0)に振ったプローブ**で解消した(ZW2 は記述・判定なし)。
//   その結果 🐚 の平均場2項 Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q の振幅 A_b・A_c が env×1 / env×2 の
//   両構成について確定した。しかし第158便は 🐚 の **q 掃引を行っていない**ので、この分離振幅から
//   立つ 2項複合の q₅₀ 予測は**一度も実測と突き合わされていない**。
//   本便(第163便)はその後続として、
//     ① 第158便 JSON 収載の分離振幅を**機械読取**し(手書き転記はしない)、
//     ② 2項複合式と決定的二分法で各アームの q₅₀_pred を**掃引の前に**計算し、
//     ③ 予測値・採点定義・掃引格子を正準化 SHA-256 付きでディスクへ固定し(predictedBeforeMeasurement)、
//     ④ そのあとで 🐚 の q 掃引を実測し、
//     ⑤ 実測前に固定した窓(BW1)で判定する。
//   予測ブロックは掃引の前に一度 OUT_PATH へ書き出され、最終書き出し時に正準化 SHA-256 で
//   「1 bit も動いていないこと」を機械照合する(predictionIntegrity)。
//
// ★ アーム(2本。いずれも 🐚kF1kRep実。第154便の 🐚 走行と同じ2構成)★
//   env×1  エンベロープ ring 既定半径(rIn/rOut ×1)・保持しきい値 r<300 … **アンカー構成**
//   env×2  エンベロープ ring 半径 ×2(rIn/rOut ×2)・保持しきい値 r<600 … 前向き予測の対象
//
// ★ アンカーについての明示(読み違えを防ぐため実測前に宣言)★
//   2項複合予測は未知の臨界値 Ω_crit を代数的に消去するためにアンカー(既存の実測 q₅₀ 1点)を要る。
//   🐚 の実測 q₅₀ は第154便の env×1 / env×2(いずれも 11点・0.1 刻み格子)しか存在しない。
//   本便は **プリセット既定構成である env×1 の第154便実測 q₅₀ をアンカー**に採る(第154便・第158便が
//   「基準 = プリセット実値の構成」をアンカーに採ったのと同じ規約)。
//   その帰結として **env×1 の 2項複合予測はアンカー値そのもの(恒等)**になる。したがって
//   env×1 の BW1 は「2項複合式の予測力」ではなく「第154便の 11点格子 q₅₀ が本便の 21点・0.05 刻み
//   格子で再現するか」の**再現性検定**として読むべきであり、**式の前向き検証の実体は env×2 の
//   1アームである**。逆向きのアンカー(env×2 を基準に env×1 を予測)も BW3 に併記する。
//
// ============================ 事前登録(実測前に固定 — 逐語)===================================
//   対象: 🐚nebulaShell env×1/×2 の2アーム。coreshell5 ZW2 収載の分離振幅から 2項複合((T5) 式・
//     決定的二分法)で各アームの q₅₀_pred を**実測前に先行計算し** predictedBeforeMeasurement +
//     完全性 SHA として固定記録する。
//   掃引: 21点・0.05 刻み・pred 中心 ±0.5(アームごと)。🐚 の走行規約(seed 20260804・3000步・
//     validT=48)は coreshell5 の 🐚 走行を踏襲。q₅₀ の採点定義は coreshell4 の q₅₀ 定義の 🐚 版を
//     実測前に JSON へ宣言固定する。
//   BW1(主窓): 各アームで |q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10。
//   BW2(決定性): 全体2回実行(別プロセス)SHA 一致(揮発キー除外の正規化 JSON)。
//   BW3(記述 — 窓なし): 旧式 (3/2)(1+R/r)・1項アンカー式の予測併記(**判定は 2項複合のみ**)・
//     アンカー ±0.05 摂動の感度。
//   **実測後に窓・格子・採点定義を動かさない。FAIL は FAIL のまま収載する。**
//   掃引格子が q₅₀_meas を挟めない(端に張り付く)場合もそのまま収載し「格子外」と正直に記録する。
//   格子の事後変更は禁止で、その場合 BW1 は FAIL 扱いとし理由を明記する。
//
// ============================ 予測式(第155便→第158便からの逐語転記)==========================
//   (T1) Ω_drag(r; q₅₀) = Ω_crit                     … 保持喪失の条件式(Ω_drag は q に単調減少)
//   (T5) 2項複合。⚫ は Ω_drag = s·(R/(R+r))^q + f·(Ω_c − s)·(Rc/(Rc+r))^q。
//        🐚 の平均場版は第158便 ZW2 の分離そのままで
//          (T5′) Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q,  x_b = R̄/(R̄+r̄),  x_c = Rc/(Rc+r̄)
//        (R̄ = クランプ粒子半径の平均・Rc = クランプのコア半径・r̄ = エンベロープの平均半径。
//         A_b・A_c は第158便が q∈{1.5,2.0} の2点プローブから連立して解いた振幅である)
//   予測 = 「Ω̄_drag_var(q₅₀') = Ω̄_drag_ref(q₅₀_ref)」の数値解(**決定論的二分法**・区間 [0.05,8.0]・
//        反復 200 回固定)。アンカーは第154便の 🐚 env×1 の**実測 q₅₀ ただ1つ**で、未知の Ω_crit を
//        代数的に消去するための代入である(較正自由度ではない — manifest.classification.fit は空)。
//   参考として (T3) 単一項アンカー式・(T4) 振幅寄与込み単一項・旧式 (3/2)(1+R/r) の予測も併記する
//        (**いずれも窓判定には使わない** — BW3)。
//   転記の正しさは実測の前に2つの機械照合で確かめる(checks):
//     (a) 第158便 ZW2 の分離振幅 A_b・A_c・核 x_b・x_c・行列式を、本ハーネスの転記式で
//         第158便の生プローブ行から再計算して bit 一致を要求する。
//     (b) 第158便 ZW1 の ⚫ 2項複合予測値を、本ハーネスの (T5) と二分法ソルバで再計算して
//         bit 一致を要求する(= 式とソルバの転記が正しいことの機械証拠)。
//
// 走行規約(第154便・第158便の 🐚 走行の踏襲):
//   🐚nebulaShell: seed 20260804(プリセット定義値)・3000步(validT=48)・dt=0.016。
//   loss(q) = 1 − envelope.keepFrac(エンベロープ44体のうち中心 COM から r<keepR に残った割合の補数)。
//   keepR は env×1 で 300・env×2 で 600(第154便 KEEP_R0=300 に半径倍率を掛ける規約)。
//   数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// 本便が触るノブ(第154便・第158便と同一。既定値では 1 bit も変えない):
//   🐚 envScale : エンベロープ ring の rIn/rOut を一律倍率で振る。**倍率が 1 のときは上書きを省く**
//                (= プリセット実値のまま build するので第154便の env×1 走行と build が同一になる)。
//   🐚 keepR    : 保持しきい値(測定器側のしきい値であり、力学には一切効かない)。
//   q(physics.q)・kFrame・kRep は対照走行でのみ触る。
//
// トイ単位の限界(第135便・第139便・第152便・第154便・第158便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である。
//   窓(步数)は validT に一致させた有限窓で、窓外の長時間挙動は測っていない。エンベロープは 44体の
//   小標本で、保持率の分解能は 1/44 ≈ 0.0227 に制限される。
//
// 実行:
//   node tests/exp-coreshell6.mjs                        … 全節(既定)
//   CS6_ONLY=neb,ctl node tests/...                      … 節を選択実行
//   CS6_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS6_DET_REF=/path/run1.json [CS6_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//   CS6_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用・本番数値ではない)
// 出力: tests/out/coreshell6-results.json
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
const OUT_PATH = process.env.CS6_OUT ? path.resolve(process.env.CS6_OUT)
  : path.join(OUT_DIR, 'coreshell6-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS6_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS6_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(実測前に固定 — 実測後に動かさない) ========================
const PRE_REGISTERED = {
  fixedBy: '統括(第158便 ZW2 計装の後続として第163便で固定 — ハンドオフ 2026-08-22a §3b)',
  fixedBefore: '実測',
  designPrinciples: {
    prospective: '**前向き(prospective)である**。予測に使う分離振幅 A_b・A_c は第158便 ZW2 の収載値で、' +
      '本便の掃引実測より前に確定していた(provenance.inputs に sha256)。🐚 の q 掃引は第154便の ' +
      '11点格子以来行われておらず、第158便の分離振幅から立つ 2項複合予測は一度も実測と' +
      '突き合わされていない。本便は予測を掃引の前に計算・ディスク固定してから掃引する',
    machineTranscription: '分離振幅・核・アンカーはすべて既存 JSON からの**機械読取**であり、' +
      '手書き転記をしない(手書き転記は第131便の事故と同根の再現不能を招く)',
    anchorIsMeasurement: 'アンカーは第154便 🐚 env×1 の**実測 q₅₀ ただ1つ**の代入であり、未知の臨界値 ' +
      'Ω_crit を代数的に消去する役割しか持たない(最小二乗も探索も行わない = 較正自由度ではない)',
    anchorRecoveryIsNotPrediction: 'アンカー構成である env×1 の 2項複合予測は**恒等的にアンカー値**に' +
      'なる。したがって env×1 の BW1 は「式の予測力」ではなく「第154便の 11点格子 q₅₀ が本便の ' +
      '21点・0.05 刻み格子で再現するか」の**再現性検定**である。**式の前向き検証の実体は env×2 の' +
      '1アームである**。この読み方は実測前に宣言しており、結果に応じて変えない',
    gridFixedBeforeMeasurement: '掃引格子はアームごとに **q₅₀_pred を中心とする ±0.5・0.05 刻み・21点**で、' +
      '予測と同時に固定する。実測後に格子を動かさない。q₅₀_meas が格子の端に張り付いた場合も' +
      'そのまま収載し「格子外」と記録する(その場合 BW1 は FAIL 扱いとし理由を明記する)',
    waves152to158Untouched: '第152便(coreshell3)・第154便(coreshell4)・第155便(coreshell-theory)・' +
      '第158便(coreshell5)の JSON は一切変更しない。本便は新規ファイルとして独立に走り、既存 JSON は' +
      '読み取り専用の機械読取・bit 照合・来歴参照としてのみ使う',
  },
  BW1: {
    role: '主窓',
    verbatim: 'BW1(主窓): 各アームで |q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10。',
    window: '**|q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10**(🐚 env×1 / env×2 それぞれで)',
    tolerance: 0.10,
    arms: '🐚kF1kRep実 env×1(保持しきい値 r<300)/ env×2(保持しきい値 r<600)',
    prediction: '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を、アンカー(第154便 🐚 env×1 の実測 q₅₀)' +
      'で決めた Ω_crit に等しくする q を、決定論的二分法(区間 [0.05,8.0]・反復 200 回固定)で解いた値',
    parameterMapping: {
      A_b: 'A_b = 第158便 zw2.perScale.env{1,2}.separation.amplitudeBase(機械読取)',
      A_c: 'A_c = 第158便 zw2.perScale.env{1,2}.separation.amplitudeCore(機械読取)',
      x_b: 'x_b = 第158便 zw2.perScale.env{1,2}.kernels.xBase = R̄/(R̄+r̄)(機械読取)',
      x_c: 'x_c = 第158便 zw2.perScale.env{1,2}.kernels.xCore = Rc/(Rc+r̄)(機械読取)',
      anchor: 'q₅₀_ref = 第154便 q50.summary.neb_env1.q50(機械読取)',
    },
    inconclusiveRule: 'アームの q₅₀ が当てはめの INCONCLUSIVE 規則(振幅 A−B < 0.20 または q₅₀ が' +
      '掃引範囲 ±0.25 の外)に掛かった場合、あるいは二分法が固定区間で解を挟めなかった場合は ' +
      'INCONCLUSIVE として PASS/FAIL を主張しない',
    verdictPrecedence: '判定の適用順序(実測前に固定): ① 予測が立たない・当てはめが上の INCONCLUSIVE 規則に' +
      '掛かった → **INCONCLUSIVE**(PASS/FAIL を主張しない)。② 当てはめは OK だが q₅₀ が事前固定した' +
      '掃引格子の外に出た(端に張り付いた)→ **「格子外」として FAIL 扱い**とし理由を明記する' +
      '(格子の事後変更は禁止)。③ それ以外 → |q₅₀_meas − q₅₀_pred| と許容 0.10 の比較で PASS/FAIL。' +
      'いずれの場合も実測値・当てはめ生値・格子範囲をそのまま収載する',
    prospectiveEvidence: '予測は掃引前に out.predictedBeforeMeasurement へ書き込み、OUT_PATH へ' +
      '一度書き出してから掃引を開始する。最終書き出し時に同ブロックの正準化 SHA-256 が' +
      '予測時点の値と一致することを機械照合する(predictionIntegrity)',
  },
  BW2: {
    role: '窓(決定性)',
    verbatim: 'BW2(決定性): 全体2回実行(別プロセス)SHA 一致(揮発キー除外の正規化 JSON)。',
    window: '全体を2回実行(別プロセス)し結果 JSON(非測定メタを除く)の正準化 SHA 一致',
    canonicalization: 'raw(実測部)と predictedBeforeMeasurement(予測部)を再帰キー整列した JSON。' +
      '走行時間は meta.timings にのみ置き raw には入れていないので、除外すべき揮発値は対象内に存在しない',
  },
  BW3: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'BW3(記述 — 窓なし): 旧式 (3/2)(1+R/r)・1項アンカー式の予測併記(**判定は 2項複合のみ**)・' +
      'アンカー ±0.05 摂動の感度。',
    window: 'なし(記述のみ)',
    items: ['旧式 q*_eff=(3/2)(1+R/r) の差分予測(R = R̄クランプ・r = r̄エンベロープ)',
      '(T3) 単一項アンカー式(コア核・基底核の2通り)',
      '(T4) 振幅寄与込み単一項',
      'アンカーを掃引刻み ±0.05 ずらした場合の 2項複合予測(感度)',
      '逆向きアンカー(env×2 を基準に env×1 を予測)の 2項複合予測',
      '第154便の 11点格子 q₅₀ との並置'],
  },
  scoringDefinition: {
    declaredBefore: '**掃引実測より前**に宣言・固定した採点定義である(第154便 tests/exp-coreshell4.mjs の ' +
      'q₅₀ 定義の 🐚 版を逐語転記)',
    loss: 'loss(q) = 1 − envelope.keepFrac。envelope は測定器 measureNeb の帯 [NC, S.n)(= エンベロープ ' +
      'ring の 44体)で、keepFrac は 3000步後にクランプ質量中心から r < keepR に留まった割合',
    keepR: 'env×1 は keepR=300・env×2 は keepR=600(第154便 KEEP_R0=300 に半径倍率を掛ける規約の踏襲)。' +
      'keepR は測定器側のしきい値であり力学には一切効かない',
    model: 'loss(q) = B + (A − B)/(1 + exp((q − q₅₀)/w))',
    fitMethod: '(q₅₀, w) を決定論的な格子で全探索し、各格子点で (A,B) を線形最小二乗の閉形式で解く。' +
      '反復解法・乱数・初期値依存を一切持たない(同じ入力なら常に同じ出力)。A,B は損失率の定義域 ' +
      '[0,1] へ射影する(片側だけ外れたときは他方を解き直す)',
    inconclusive: '振幅 A−B < 0.20、または q₅₀ が掃引範囲 ±0.25 の外なら INCONCLUSIVE',
    source: '第152便・第154便・第158便と同一の当てはめ関数(fitLogisticQ50)・同一の当てはめ格子',
  },
  sweepGridDefinition: {
    declaredBefore: '**掃引実測より前**に宣言・固定した格子定義である',
    nPoints: 21, step: 0.05, halfWidth: 0.5,
    centering: 'アームごとに、そのアームの 2項複合予測 q₅₀_pred を中心に置く(ハンドオフの ' +
      '「21点・0.05 刻み・pred 中心 ±0.5(アームごと)」の逐語適用)',
    rounding: '格子点は 1e-6 に丸める(2進浮動小数の桁落ちで格子点が揺れるのを防ぐため — 実測前に宣言)。' +
      '中心が 0.05 の倍数のアームでは丸めにより格子点が第154便の 0.1 格子点と厳密に一致するので、' +
      'その部分集合は第154便の走行と bit 照合できる(crossWaveCheck — 記述)',
    noPostHocChange: '実測後に格子を動かさない。q₅₀_meas が格子の端に張り付いた場合はそのまま収載し、' +
      '「格子外」と記録したうえで BW1 は FAIL 扱いとする',
  },
  procedure: {
    order: ['① 第158便 coreshell5-results.json・第154便 coreshell4-results.json を機械読取する(sha256 を来歴に残す)',
      '② 転記照合: 第158便 ZW2 の分離振幅と第158便 ZW1 の ⚫ 2項複合予測を、本ハーネスの転記式で' +
      '再計算して bit 一致を確かめる(シミュレーションなし)',
      '③ 🐚 引きずりプローブ(q∈{1.5,2.0} × env×{1,2})を再走行し、第158便の収載値と bit 照合する' +
      '(1步プローブ。**q₅₀ の掃引実測ではない**)',
      '④ アンカー(第154便 🐚 env×1 の実測 q₅₀)から Ω_crit を決め、各アームの q₅₀_pred(2項複合)と' +
      '掃引格子を確定して predictedBeforeMeasurement として JSON へ記録・OUT_PATH へ書き出す',
      '⑤ 各アームを「その予測を中心とする21点格子」で掃引実測する',
      '⑥ BW1 で判定する(窓は①より前に固定済み)'],
    note: '③のプローブは 1 步だけ進めた解析パラメータの読み取りであり、対象アームの**保持率掃引' +
      '(q₅₀ の実測)ではない**。q₅₀ の実測は⑤でのみ行う。③の結果は予測には使わない' +
      '(予測に使うのはあくまで第158便 JSON の収載値である)',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  windows: {
    nebulaShell: { steps: 3000, validT: 48, note: '第135便・第139便・第152便・第154便・第158便と同一窓。' +
      '窓外の長時間挙動は測っていない' },
  },
  seeds: { nebulaShell: 20260804,
    note: 'seed はプリセット定義値。build がそれを使うので構成間で同一 — 構成差はすべてノブ差である' },
  sampleSize: {
    nebulaShell: 'エンベロープ 44体(掃引の母数)+ クランプ 54体。保持率の分解能は 1/44 ≈ 0.0227',
  },
  q50Resolution: 'q₅₀ の当てはめ格子は 0.0025 刻み。掃引点の刻み(本便 0.05)より細かいが、' +
    '**q₅₀ の実質的な分解能を決めるのは掃引点の刻み(0.05)と保持率の粒度**(1/44)であり、' +
    '格子刻みではない。BW1 の許容 0.10 は掃引刻みの 2 倍にあたる — この限界の上で読むこと',
  anchorPropagation: '予測はアンカー(第154便 🐚 env×1 の実測 q₅₀)を1点使う。アンカー自身が第154便の' +
    '掃引刻み 0.1 と保持率の粒度に由来する不確かさを持つので、その不確かさは予測値へそのまま伝播する' +
    '(bw3.anchorPerturbation に ±0.05 ずらした場合の予測を併記する — 記述のみ)',
  meanFieldApproximation: '🐚 の真の引きずりは粒子対ごとの距離 d_ij に依存する多項和である。' +
    '(T5′) の2項は「クランプ粒子半径の平均 R̄ を核とする項」と「クランプのコア半径 Rc を核とする項」' +
    'による**平均場近似**であり、A_b・A_c は近似モデルのパラメータであってエンジン内部の量そのもの' +
    'ではない(第158便 zw2.perScale.*.separation.caveat と同じ限界)',
  amplitudesFittedAtTwoQs: 'A_b・A_c は第158便が q∈{1.5, 2.0} のちょうど2点から連立して解いた値なので、' +
    '(T5′) はその2点で Ω̄_drag を**厳密に**再現する。q₅₀_pred がこの区間の外に出る場合は外挿に' +
    'あたる(bw3.extrapolationNote に各アームの位置関係を記録する)',
  envScaleCaveat: 'エンベロープ半径倍率は「引きずり核の相対的な効きを変える」以外の寄与も同時に動かす: ' +
    'r̄ が変われば重み w_ij と正規化 D₀+ΣW も変わり、ケプラー角速度・力学時間・保持しきい値(keepR も ' +
    '×2 にする規約)も変わる。これらは差分では相殺されない系統であり、q₅₀ には引きずり核の' +
    '効き以外の寄与も混じりうる(第154便 YW2・第158便 zw2 と同じ限界)',
  tZeroAnalytic: '予測に使う Ω̄_drag は **1步後(t=0+)の解析値**である。🐚 は窓の間にクランプが' +
    '合体・回転して自走する系なので、窓平均の引きずりは t=0+ の値と同じではない(第155便 postHoc ②)。' +
    '本便はこの限界を承知のうえで、t=0+ の解析値による予測を**そのまま**前向き検証に掛ける',
  anchorArmIsIdentity: 'env×1 はアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる。' +
    'env×1 の BW1 は再現性検定であって式の予測力の検定ではない(preRegistered の宣言どおり)',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'cs5', file: 'coreshell5-results.json',
    role: '第158便の実測正本(**本便の予測入力**: ZW2 の 🐚 分離振幅 A_b・A_c と核 x_b・x_c を機械読取する。' +
      'ZW1 の ⚫ 2項複合予測は転記照合の突き合わせ先・生プローブ行は分離の再計算元)' },
  { key: 'cs4', file: 'coreshell4-results.json',
    role: '第154便の実測正本(**アンカー源**: 🐚 env×1 の実測 q₅₀。加えて q₅₀ 採点定義の出典と、' +
      '共有格子点の bit 照合参照)' },
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
const CS5 = inputs.cs5, CS4 = inputs.cs4;
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  inputs: provenanceInputs.map(e => ({ path: e.path, targetSha256: e.targetSha256,
    sameAsNow: e.targetSha256 === TARGET_SHA_NOW })),
  allSame: provenanceInputs.every(e => e.targetSha256 === TARGET_SHA_NOW),
  note: '入力 JSON の実測を出した対象 HTML の SHA-256 が、本便が実測する index.html と同一実体かの照合。' +
    '一致していれば「第158便の分離振幅は今の index.html が出す値である」という前提と、共有格子点の ' +
    'bit 照合が意味を持つ前提が満たされる(実際の再現は checks.probeReproduction で確かめる)',
};

// ============================ 測定器(第158便 exp-coreshell5.mjs から逐語踏襲) ================
// A) 🐚nebulaShell — 第154便 measureNeb / 第158便 measureNeb と同一(帯定義・しきい値・返却フィールド)。
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

// B) 🐚 引きずりプローブ — 第154便 nebDragProbe / 第158便 nebDragProbe と同一(1步・解析値の読み取り)。
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

// ==================== q₅₀(ロジスティック中点)の当てはめ — 第152便・第154便・第158便と同一 ====
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

// ================= 予測式(第155便 → 第158便からの逐語転記)====================================
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
// (T5) ⚫ の2項複合(転記照合にのみ使う。tests/exp-coreshell4.mjs profileOf = index.html からの転記)
const omegaDragBH = (p, r, q) =>
  p.s * Math.pow(p.R / (p.R + r), q) + p.f * (p.Omc - p.s) * Math.pow(p.Rc / (p.Rc + r), q);
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

// 正準化(決定性ハッシュ・予測ブロックの不変照合に使う)
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

const out = { meta: { exp: 'coreshell6', wave: 163, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第158便 tests/exp-coreshell5.mjs(測定器・引きずりプローブ・q₅₀ 当てはめ関数・予測式と' +
      '二分法ソルバ・前向き記録の流儀を踏襲。ZW2 の 🐚 分離振幅が本便の予測入力)' +
      ' / 第154便 tests/exp-coreshell4.mjs(🐚 走行規約・q₅₀ 採点定義・アンカーとなる env×1 実測 q₅₀)' +
      ' / 第155便 tests/exp-coreshell-theory.mjs(予測式 (T1)(T5))' +
      ' / 第152便 exp-coreshell3 / 第139便 exp-coreshell2 / 第135便 exp-coreshell(原型)',
    role: '第158便 ZW2 が計装した 🐚 の2項分離振幅から立つ q₅₀ 予測を、🐚 の q 掃引実測で' +
      '**前向きに**検証する便。予測・採点定義・掃引格子は掃引前に固定し SHA で封をする',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS,
  provenance: { inputs: provenanceInputs, targetConsistency },
  raw: {} };
out.meta.timings = {};   // 走行時間は非測定メタなので raw には入れない(raw は完全に決定論的)

// ---- アーム・走行規約(実測前に固定)----
const NEB_KEEP_R0 = 300;              // 🐚 保持しきい値(×1)。半径倍率とともに拡大する(第154便規約)
const NEB_ARMS = [
  { key: 'env1', envScale: 1, keepR: NEB_KEEP_R0 * 1, group: 'anchor',
    cs5Key: 'env1', cs4Q50Key: 'neb_env1',
    label: '🐚kF1kRep実 env×1(保持しきい値 r<300)— アンカー構成(予測は恒等)' },
  { key: 'env2', envScale: 2, keepR: NEB_KEEP_R0 * 2, group: 'prospective',
    cs5Key: 'env2', cs4Q50Key: 'neb_env2',
    label: '🐚kF1kRep実 env×2(保持しきい値 r<600)— 前向き予測の対象' },
];
const NEB_ANCHOR_KEY = 'env1';
const NEB_PROBE_QS = [1.5, 2.0];      // 第158便 ZW2 のプローブ q(分離の元になった2点)
const NEB_STEPS = SC(3000);
const GRID_N = 21, GRID_STEP = 0.05, GRID_HALF = 0.5;
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

// ---- ② 転記照合(実測に先立つ・シミュレーション不要)------------------------------------------
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
// (b) 第158便 ZW1 の ⚫ 2項複合予測を、本ハーネスの (T5) と二分法ソルバで再計算する。
{
  const rows = [];
  try {
    const r = CS5.predictedBeforeMeasurement.r, anchorQ50 = CS5.predictedBeforeMeasurement.anchor.q50;
    const pOf = (k) => { const a = CS5.raw.bh.profiles[`${k}_q1.50`].params;
      return { R: a.R0, Rc: a.Rc, s: a.s0, f: a.coreMassFrac, Omc: a.coreOmega }; };
    const ref = pOf('base');
    const crit = omegaDragBH(ref, r, anchorQ50);
    rows.push({ armKey: 'base(Ω_crit)', identical: crit === CS5.predictedBeforeMeasurement.omegaCrit,
      mine: { omegaCrit: crit }, theirs: { omegaCrit: CS5.predictedBeforeMeasurement.omegaCrit } });
    for (const a of CS5.predictedBeforeMeasurement.arms) {
      const p = pOf(a.armKey);
      const two = solveMonotoneDecreasing((q) => omegaDragBH(p, r, q), crit);
      rows.push({ armKey: a.armKey, identical: two.q === a.predictedQ50.twoTerm,
        mine: { twoTerm: two.q }, theirs: { twoTerm: a.predictedQ50.twoTerm } });
    }
  } catch (e) { out.checks.solverTranscriptionError = String(e && e.message); }
  out.checks.transcriptionReproducesWave158Prediction = {
    question: '本ハーネスへ転記した (T5) 2項複合式と決定的二分法ソルバが、第158便 ZW1 の ⚫ 予測値' +
      '(Ω_crit と 2アームの q₅₀_pred)を bit 一致で再現するか(= 式とソルバの転記が正しい機械証拠)',
    method: '第158便と同じ入力(第158便 raw.bh.profiles の実測パラメータ・同便のアンカー q₅₀ と r)を' +
      '本ハーネスの関数へ通して再計算し、第158便 JSON の値と厳密比較する(シミュレーションは行わない)',
    anchorQ50FromWave158: CS5.predictedBeforeMeasurement ? CS5.predictedBeforeMeasurement.anchor.q50 : null,
    rFromWave158: CS5.predictedBeforeMeasurement ? CS5.predictedBeforeMeasurement.r : null,
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
out.checks.solverMatchesWave158 = {
  mine: SOLVER,
  wave158: CS5.preRegistered && CS5.preRegistered.ZW1 ? CS5.manifest.numerics.solver : null,
  identical: (CS5.manifest && CS5.manifest.numerics && CS5.manifest.numerics.solver)
    ? JSON.stringify(canonize(SOLVER)) === JSON.stringify(canonize(CS5.manifest.numerics.solver)) : null };
out.checks.fitGridMatchesWave154 = {
  mine: Q50_GRID,
  wave154: CS4.q50 ? CS4.q50.fitGrid : null,
  identical: CS4.q50 ? JSON.stringify(canonize(Q50_GRID)) === JSON.stringify(canonize(CS4.q50.fitGrid)) : null,
  note: 'q₅₀ の当てはめ格子が第154便と 1 bit も違わないこと(採点定義の転記が正しい機械証拠)' };

log(`\n===== ② 転記照合(シミュレーション不要・掃引前)=====`);
log(`  第158便 ZW2 分離振幅の再現: ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}`);
log(`  第158便 ZW1 ⚫予測値の再現: ${out.checks.transcriptionReproducesWave158Prediction.nIdentical}/${out.checks.transcriptionReproducesWave158Prediction.nCompared}`);
log(`  当てはめ格子が第154便と同一: ${out.checks.fitGridMatchesWave154.identical} / ソルバが第158便と同一: ${out.checks.solverMatchesWave158.identical}`);

// ---- ③ 🐚 引きずりプローブの再走行(第158便収載値の bit 再現確認 — 予測には使わない)----------
if (doSec('probe')) {
  const dragProbes = {};
  log(`\n===== ③ 🐚 引きずりプローブ再走行(q=${NEB_PROBE_QS.join(',')} × env×${NEB_ARMS.map(a => a.envScale).join(',×')})=====`);
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
      '不一致はそのまま収載し、BW1 の解釈上の注記とする',
    quickNote: QUICK ? '煙試験(CS6_QUICK)でもプローブは1步なので本番と同値のはず' : null };
  log(`  第158便プローブとの bit 一致: ${out.checks.probeReproduction.nIdentical}/${out.checks.probeReproduction.nCompared}`);
}

// ---- ④ 予測(**掃引実測前**に計算し JSON へ記録してディスクへ書き出す)------------------------
// 🐚 の (T5′) パラメータは第158便 ZW2 の収載値を機械読取する(手書き転記をしない)。
const nebParamsOf = (a) => {
  const s = CS5.zw2.perScale[`env${a.envScale}`];
  return { Ab: s.separation.amplitudeBase, Ac: s.separation.amplitudeCore,
    xb: s.kernels.xBase, xc: s.kernels.xCore,
    Rbar: s.kernels.kernelRadiusBase, Rc: s.kernels.kernelRadiusCore, rBar: s.kernels.rBarUsed,
    sourcePath: `coreshell5-results.json: zw2.perScale.env${a.envScale}` };
};
const anchorQ50Fit = CS4.q50.summary[NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY).cs4Q50Key];
const q50Ref = anchorQ50Fit ? anchorQ50Fit.q50 : null;
const refP = nebParamsOf(NEB_ARMS.find(a => a.key === NEB_ANCHOR_KEY));
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
    anchorRecoveryNote: a.key === NEB_ANCHOR_KEY
      ? '**このアームはアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる**。' +
        'BW1 はここでは「第154便の 11点格子 q₅₀ が本便の 21点・0.05 刻み格子で再現するか」の' +
        '再現性検定であって、式の予測力の検定ではない(実測前に宣言済み)'
      : '**アンカーに使っていない構成**。2項複合式の前向き検証の実体はこのアームである',
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
    sweepGrid: pred === null ? null : makeGrid(pred),
    sweepGridNote: 'この格子は予測と同時に固定した(pred 中心 ±0.5・0.05 刻み・21点・1e-6 丸め)。' +
      '実測後に動かさない',
  });
}
// アンカーの不確かさ(±0.05)を予測へ伝播させた場合の幅(記述のみ・窓に使わない)
const anchorPerturbation = q50Ref === null ? null : [-0.05, 0.05].map(d => {
  const qa = q50Ref + d;
  const crit = omegaDragNeb(refP, qa);
  return { anchorShift: d, anchorQ50: qa,
    arms: NEB_ARMS.map(a => {
      const p = nebParamsOf(a);
      const s = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
      return { armKey: a.key, twoTerm: s.q };
    }) };
});
// 逆向きアンカー(env×2 を基準に env×1 を予測)— 記述のみ
const mirrorArm = NEB_ARMS.find(a => a.key !== NEB_ANCHOR_KEY);
const mirrorQ50Ref = CS4.q50.summary[mirrorArm.cs4Q50Key] ? CS4.q50.summary[mirrorArm.cs4Q50Key].q50 : null;
const mirrorAnchoring = mirrorQ50Ref === null ? null : (() => {
  const mp = nebParamsOf(mirrorArm);
  const crit = omegaDragNeb(mp, mirrorQ50Ref);
  return { anchorArmKey: mirrorArm.key, anchorQ50: mirrorQ50Ref, omegaCrit: crit,
    arms: NEB_ARMS.map(a => {
      const p = nebParamsOf(a);
      const s = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), crit);
      return { armKey: a.key, twoTerm: s.q, bracketed: s.bracketed };
    }),
    note: 'アンカーを env×2 に取り替えた場合の 2項複合予測(**記述のみ**・BW1 の判定には使わない)。' +
      'この向きでは env×1 が非恒等の予測対象になるので、式の当てはまりを別角度から読める' };
})();

const predictionBlock = {
  declaredBefore: '**🐚 の q 掃引実測より前**に計算し、OUT_PATH へ書き出した予測である' +
    '(手順は preRegistered.procedure。書き出し後は 1 bit も変更しない — predictionIntegrity で照合)',
  formula: '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を Ω_crit = Ω̄_drag(アンカーアーム; q₅₀_ref) に' +
    '等しくする q を決定論的二分法で解く。A_b・A_c・x_b・x_c は第158便 zw2.perScale.* の機械読取値',
  solver: SOLVER,
  anchor: { armKey: NEB_ANCHOR_KEY, q50: q50Ref,
    fitResult: anchorQ50Fit ? anchorQ50Fit.result : null,
    source: 'coreshell4-results.json: q50.summary.neb_env1.q50(第154便の 11点・0.1 刻み格子の実測値)',
    grid: CS4.q50 ? CS4.q50.grid : null,
    nPoints: anchorQ50Fit ? anchorQ50Fit.nPoints : null,
    note: 'アンカーは未知の Ω_crit を代数的に消去するための代入である(較正自由度ではない)。' +
      '本便には 🐚 の既存 q₅₀ が第154便の2値しか無く、プリセット既定構成である env×1 を採った' },
  omegaCrit, refParams: refP,
  scoringDefinition: PRE_REGISTERED.scoringDefinition,
  sweepGridDefinition: PRE_REGISTERED.sweepGridDefinition,
  arms: predArms,
  anchorPerturbation,
  anchorPerturbationNote: 'アンカーを ±0.05 ずらした場合の 2項複合予測(**記述のみ**・BW1 の判定には' +
    '使わない)。アンカー自身の不確かさが予測へどう伝播するかの目安である',
  mirrorAnchoring,
  referenceOnly: 'singleTerm / singleTermAmplitude / singleTermBaseKernel / legacy は参考併記であり、' +
    'BW1 の判定は twoTerm のみで行う',
};
out.predictedBeforeMeasurement = predictionBlock;
out.predictionIntegrity = {
  canonicalization: 'predictedBeforeMeasurement を再帰キー整列した JSON の SHA-256',
  sha256AtPredictionTime: canonSha(predictionBlock),
  writtenToDiskBeforeSweep: false, sha256AtFinalWrite: null, unchanged: null };

log(`\n===== ④ 前向き予測(**掃引実測前**に固定)=====`);
log(`  アンカー ${NEB_ANCHOR_KEY} q₅₀_ref=${fmt(q50Ref)}(第154便 11点格子・${anchorQ50Fit ? anchorQ50Fit.result : '—'})/ Ω_crit=${omegaCrit === null ? '—' : omegaCrit.toExponential(6)}`);
for (const a of predArms)
  log(`  ${a.armKey.padEnd(6)} 2項複合 q₅₀_pred=${fmt(a.predictedQ50.twoTerm)}${a.isAnchorArm ? '(恒等 — アンカー構成)' : ''} ` +
    `(参考 単一項=${fmt(a.predictedQ50.singleTerm)} 単一項+振幅=${fmt(a.predictedQ50.singleTermAmplitude)} 基底核単一項=${fmt(a.predictedQ50.singleTermBaseKernel)} 旧式=${fmt(a.predictedQ50.legacy)})`);
for (const a of predArms)
  log(`  ${a.armKey.padEnd(6)} 掃引格子 [${a.sweepGrid ? a.sweepGrid[0] : '—'} … ${a.sweepGrid ? a.sweepGrid[a.sweepGrid.length - 1] : '—'}] (${GRID_N}点・刻み ${GRID_STEP})`);
// 予測をディスクへ固定してから掃引する(前向き性の物理的な証跡)
out.meta.stage = 'prediction-recorded-before-sweep';
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
out.predictionIntegrity.writtenToDiskBeforeSweep = true;
log(`  → 予測を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.predictionIntegrity.sha256AtPredictionTime.slice(0, 16)}…)。以降、掃引を実測する`);

// ---- ⑤ 掃引実測(アームごとに、その予測を中心とする21点格子)------------------------------------
if (doSec('neb')) {
  const arms = {};
  for (const a of NEB_ARMS) {
    const pa = predArms.find(x => x.armKey === a.key);
    if (!pa || !pa.sweepGrid) { log(`\n(!) ${a.key}: 予測が立たなかったので掃引しない`); continue; }
    const runs = {};
    log(`\n===== ⑤ 🐚 ${a.label}: ${pa.sweepGrid.length} 構成 × ${NEB_STEPS}步 =====`);
    for (const q of pa.sweepGrid)
      await runNeb(tagQ(q), { kFrame: 1, q, envScale: a.envScale, keepR: a.keepR }, runs, a.key);
    arms[a.key] = { arm: { kFrame: 1, kRep: '実値(0.3)', envScale: a.envScale, keepR: a.keepR,
      group: a.group, label: a.label }, grid: pa.sweepGrid, runs };
  }
  out.raw.neb = { steps: NEB_STEPS, keepR0: NEB_KEEP_R0, armDefs: NEB_ARMS,
    gridPerArm: Object.fromEntries(predArms.map(a => [a.armKey, a.sweepGrid])),
    note: '掃引格子はアームごとに 2項複合予測を中心に置いた21点(0.05 刻み)。格子は予測と同時に' +
      '固定されており実測後に動かしていない',
    arms };
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
      '振っても外殻の力学は 1 bit も変わらないはず。**事前登録窓の外の記述**であり判定には使わない' };
}
out.meta.stage = 'complete';

// ======================================= 集計・判定 =========================================
// 事前登録した規則をそのまま適用する(実測後に規則を変えない)。
const dynKeysNeb = ['clump', 'envelope', 'n', 'nan', 'clampV', 'clampS'];
const pickJ = (o, ks) => { const r = {}; for (const k of ks) r[k] = o[k]; return JSON.stringify(r); };
const fullJ = (o) => { const r = { ...o }; delete r.cfg; delete r.tag; return JSON.stringify(r); };

// ---- 各アームの q₅₀(事前登録した採点定義・アームごとの事前固定格子)----
out.q50 = { fitGrid: Q50_GRID, gridPerArm: Object.fromEntries(predArms.map(a => [a.armKey, a.sweepGrid])),
  scoringDefinition: PRE_REGISTERED.scoringDefinition,
  note: '掃引格子は**アームごとに 2項複合予測を中心に置いた21点**(0.05 刻み・補間なし)である。' +
    '第154便・第158便のようなアーム共通格子ではない — 事前登録が「pred 中心 ±0.5(アームごと)」を' +
    '指定しているためで、格子は予測と同時に固定し実測後に動かしていない',
  arms: {} };
if (out.raw.neb) {
  for (const a of NEB_ARMS) {
    const arm = out.raw.neb.arms[a.key];
    if (!arm) continue;
    const table = nebTable(arm.runs);
    out.q50.arms[a.key] = { label: a.label, group: a.group, envScale: a.envScale, keepR: a.keepR,
      grid: arm.grid, table, fit: fitLogisticQ50(table) };
  }
  out.q50.summary = Object.fromEntries(Object.entries(out.q50.arms).map(([k, a]) =>
    [k, { label: a.label, group: a.group, q50: a.fit.q50, result: a.fit.result, width: a.fit.width,
      plateaus: [a.fit.plateauLowQ, a.fit.plateauHighQ], rmse: a.fit.rmse, nPoints: a.fit.nPoints,
      crossing0p5LinearInterp: a.fit.crossing0p5LinearInterp }]));
  out.q50.gridsAsPreRegistered = Object.entries(out.q50.arms).every(([k, a]) => {
    const pa = predArms.find(x => x.armKey === k);
    return pa && pa.sweepGrid && a.table.length === pa.sweepGrid.length &&
      a.table.every((e, i) => e.q === pa.sweepGrid[i]);
  });
  out.q50.gridsAsPreRegisteredNote = '実測した掃引点が、予測と同時に固定した格子と 1 点も違わないこと' +
    '(格子の事後変更が無いことの機械証拠)';
  // 参考: 第154便の 11点格子との並置(**判定に使わない**記述)
  out.q50.wave154Comparison = Object.fromEntries(NEB_ARMS.map(a =>
    [a.key, { wave154Q50: CS4.q50.summary[a.cs4Q50Key] ? CS4.q50.summary[a.cs4Q50Key].q50 : null,
      wave154Grid: CS4.q50.grid || null,
      thisWaveQ50: out.q50.summary[a.key] ? out.q50.summary[a.key].q50 : null }]));
  out.q50.wave154ComparisonNote = '参考として第154便(11点・0.1 刻み)の 🐚 q₅₀ を並べる。両者の差は' +
    '掃引刻みの細分と掃引範囲の移動による当てはめの動きであり、**判定には使わない**';
}

// ---- BW1(主窓): |q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10 ----
out.bw1 = { rule: PRE_REGISTERED.BW1, comparisons: [], verdict: null };
if (out.raw.neb && out.predictedBeforeMeasurement) {
  const rows = [];
  for (const pa of out.predictedBeforeMeasurement.arms) {
    const armQ = out.q50.arms[pa.armKey];
    const fit = armQ ? armQ.fit : null;
    const meas = fit ? fit.q50 : null;
    const pred = pa.predictedQ50.twoTerm;
    const grid = pa.sweepGrid;
    // 格子外(端に張り付き)の判定 — 事前登録どおり、その場合は FAIL 扱いとし理由を明記する
    const gridLo = grid ? grid[0] : null, gridHi = grid ? grid[grid.length - 1] : null;
    const raw = fit ? fit.q50Raw : null;
    const outsideGrid = (raw === null || gridLo === null) ? null : (raw < gridLo || raw > gridHi);
    const inconclusive = (pred === null || fit === null);
    const absDiff = (meas === null || pred === null) ? null : Math.abs(meas - pred);
    const d = (v) => (v === null || meas === null) ? null : Math.abs(v - meas);
    // 適用順序は preRegistered.BW1.verdictPrecedence(実測前に固定)のとおり
    let result, resultReason;
    if (inconclusive) { result = 'INCONCLUSIVE'; resultReason = '予測または当てはめが立たなかった'; }
    else if (meas === null) {
      result = 'INCONCLUSIVE';
      resultReason = '当てはめが事前登録の INCONCLUSIVE 規則に掛かった: ' + (fit.note || '') +
        (outsideGrid ? '(当てはめ生値 q₅₀=' + raw + ' は事前固定格子 [' + gridLo + ',' + gridHi + '] の外)' : '');
    } else if (outsideGrid) {
      result = 'FAIL';
      resultReason = '当てはめは成立したが q₅₀ が事前固定した掃引格子 [' + gridLo + ',' + gridHi + '] の外に出た' +
        '(= 格子が q₅₀ を挟めていない)。事前登録どおり格子は動かさず、BW1 は FAIL 扱いとする';
    } else {
      result = absDiff <= PRE_REGISTERED.BW1.tolerance ? 'PASS' : 'FAIL';
      resultReason = null;
    }
    rows.push({
      armKey: pa.armKey, label: pa.label, group: pa.group,
      isAnchorArm: pa.isAnchorArm, anchorRecoveryNote: pa.anchorRecoveryNote,
      kernels: pa.kernels, amplitudes: pa.amplitudes,
      predictedQ50: pa.predictedQ50,
      measuredQ50: meas, measuredQ50Raw: raw, measuredFitResult: fit ? fit.result : null,
      sweepGridRange: grid ? [gridLo, gridHi] : null,
      measuredWithinGrid: outsideGrid === null ? null : !outsideGrid,
      signedDiff: (meas === null || pred === null) ? null : (meas - pred),
      absDiff, tolerance: PRE_REGISTERED.BW1.tolerance,
      withinTolerance: absDiff === null ? null : (absDiff <= PRE_REGISTERED.BW1.tolerance),
      result, resultReason,
      referenceAbsDiff: { singleTerm: d(pa.predictedQ50.singleTerm),
        singleTermAmplitude: d(pa.predictedQ50.singleTermAmplitude),
        singleTermBaseKernel: d(pa.predictedQ50.singleTermBaseKernel),
        legacy: d(pa.predictedQ50.legacy) },
      referenceNote: '参考予測との |差|(**窓判定には使わない** — BW1 は twoTerm のみ)',
    });
  }
  out.bw1.comparisons = rows;
  const prospective = rows.filter(e => !e.isAnchorArm);
  out.bw1.verdict = { window: PRE_REGISTERED.BW1.window,
    tolerance: PRE_REGISTERED.BW1.tolerance,
    result: rows.length ? (rows.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
      : (rows.every(e => e.result === 'PASS') ? 'PASS' : 'FAIL')) : null,
    perArm: rows.map(e => ({ armKey: e.armKey, isAnchorArm: e.isAnchorArm,
      predictedTwoTerm: e.predictedQ50.twoTerm, measured: e.measuredQ50,
      absDiff: e.absDiff, result: e.result })),
    prospectiveArmsOnly: { armKeys: prospective.map(e => e.armKey),
      result: prospective.length ? (prospective.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
        : (prospective.every(e => e.result === 'PASS') ? 'PASS' : 'FAIL')) : null,
      note: 'アンカー構成(恒等予測)を除いた、**式の予測力を実際に問うているアームだけ**の判定。' +
        '窓文の判定は全アームの result(上の result)だが、科学的な読みはこちらである' },
  };
}

// ---- BW3(記述 — 窓なし)----
out.bw3 = { rule: PRE_REGISTERED.BW3, window: null,
  note: '**窓なし・判定に使わない**。旧式・1項アンカー式の予測併記と、アンカー ±0.05 摂動の感度' };
if (out.predictedBeforeMeasurement) {
  const measOf = (k) => (out.q50.arms && out.q50.arms[k] ? out.q50.arms[k].fit.q50 : null);
  out.bw3.predictionTable = out.predictedBeforeMeasurement.arms.map(a => ({
    armKey: a.armKey, isAnchorArm: a.isAnchorArm,
    measuredQ50: measOf(a.armKey),
    twoTerm: a.predictedQ50.twoTerm,
    singleTermCoreKernel: a.predictedQ50.singleTerm,
    singleTermAmplitude: a.predictedQ50.singleTermAmplitude,
    singleTermBaseKernel: a.predictedQ50.singleTermBaseKernel,
    legacy: a.predictedQ50.legacy }));
  out.bw3.anchorPerturbation = out.predictedBeforeMeasurement.anchorPerturbation;
  out.bw3.anchorPerturbationSpread = (() => {
    const ap = out.predictedBeforeMeasurement.anchorPerturbation;
    if (!ap) return null;
    return Object.fromEntries(NEB_ARMS.map(a => {
      const vs = ap.map(e => (e.arms.find(x => x.armKey === a.key) || {}).twoTerm)
        .filter(v => v !== null && v !== undefined);
      return [a.key, vs.length === 2 ? { atMinus0p05: vs[0], atPlus0p05: vs[1],
        spread: Math.abs(vs[1] - vs[0]),
        note: 'アンカーを ±0.05 動かしたときの 2項複合予測の振れ幅。BW1 の許容 0.10 と比べて読む' } : null];
    }));
  })();
  out.bw3.mirrorAnchoring = out.predictedBeforeMeasurement.mirrorAnchoring
    ? { ...out.predictedBeforeMeasurement.mirrorAnchoring,
        absDiffVsMeasured: out.predictedBeforeMeasurement.mirrorAnchoring.arms.map(e =>
          ({ armKey: e.armKey, twoTerm: e.twoTerm, measured: measOf(e.armKey),
            absDiff: (e.twoTerm === null || measOf(e.armKey) === null) ? null
              : Math.abs(measOf(e.armKey) - e.twoTerm) })) }
    : null;
  out.bw3.extrapolationNote = {
    question: '分離振幅 A_b・A_c は q∈{1.5, 2.0} のちょうど2点から解いた値なので、その区間の外での ' +
      '(T5′) 評価は外挿にあたる。各アームの予測・実測がこの区間のどこに位置するかを記録する',
    interval: NEB_PROBE_QS,
    arms: out.predictedBeforeMeasurement.arms.map(a => ({ armKey: a.armKey,
      predictedTwoTerm: a.predictedQ50.twoTerm,
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

// ---- 第154便・第158便との共有点 bit 照合(記述 — 窓ではない)----------------------------------
// env×1 の格子は中心が 0.05 の倍数なので、第154便の 0.1 格子点(1.2〜2.0)を部分集合として含む。
// env×2 の格子は中心が予測値なので第154便と共有する格子点を持たない(その事実も記録する)。
{
  const shared = [], add = [];
  try {
    if (out.raw.neb && CS4.raw && CS4.raw.neb && CS4.raw.neb.arms) {
      for (const a of NEB_ARMS) {
        const mineArm = out.raw.neb.arms[a.key], theirsArm = CS4.raw.neb.arms[`env${a.envScale}`];
        if (!mineArm || !theirsArm) continue;
        const theirsByQ = new Map(Object.values(theirsArm.runs).map(r => [r.cfg.q, r]));
        let n = 0;
        for (const [tag, r] of Object.entries(mineArm.runs)) {
          const t = theirsByQ.get(r.cfg.q);
          if (!t) continue;
          n++;
          shared.push({ label: `🐚${a.key} q=${r.cfg.q}`,
            identical: pickJ(r, dynKeysNeb) === pickJ(t, dynKeysNeb) });
        }
        if (n === 0) shared.push({ label: `🐚${a.key}(第154便と共有する格子点なし)`, identical: null,
          note: '格子中心が予測値なので第154便の 0.1 格子と共有点を持たない — 比較不能' });
      }
    }
    if (out.raw.ctl && CS4.raw && CS4.raw.neb && CS4.raw.neb.controls) {
      for (const tag of Object.keys(out.raw.ctl.runs)) {
        if (CS4.raw.neb.controls[tag]) add.push({ label: `🐚対照 ${tag} vs 第154便`,
          identical: pickJ(out.raw.ctl.runs[tag], dynKeysNeb) === pickJ(CS4.raw.neb.controls[tag], dynKeysNeb) });
      }
    }
    if (out.raw.ctl && CS5.raw && CS5.raw.neb && CS5.raw.neb.controls) {
      for (const tag of Object.keys(out.raw.ctl.runs)) {
        if (CS5.raw.neb.controls[tag]) add.push({ label: `🐚対照 ${tag} vs 第158便`,
          identical: pickJ(out.raw.ctl.runs[tag], dynKeysNeb) === pickJ(CS5.raw.neb.controls[tag], dynKeysNeb) });
      }
    }
  } catch (e) { out.crossWaveError = String(e && e.message); }
  const roll = (arr) => { const cmp = arr.filter(e => e.identical !== null);
    return { comparisons: arr, nCompared: cmp.length,
      nIdentical: cmp.filter(e => e.identical).length,
      mismatches: cmp.filter(e => !e.identical).map(e => e.label),
      allIdentical: cmp.length ? cmp.every(e => e.identical) : null }; };
  out.crossWaveCheck = { window: null,
    source: 'tests/out/coreshell4-results.json(第154便)/ tests/out/coreshell5-results.json(第158便)',
    note: '設定・格子点が一致する走行(同一プリセット・同一 seed・同一步数・同一ノブ)の力学フィールド ' +
      'bit 一致。**事前登録窓の外の記述**であり判定には使わない。env×1 の格子は中心が 0.05 の倍数なので ' +
      '第154便の 0.1 格子点を部分集合として含むが、env×2 の格子は中心が予測値なので共有点を持たない',
    sharedSweepPoints: roll(shared), controls: roll(add) };
  if (QUICK) out.crossWaveCheck.quickNote = '煙試験(CS6_QUICK)では步数が 1/10 なので bit 一致は成立しない';
}

// ---- BW2: 決定性(2回実行ビット同一)----
{
  const target = { raw: out.raw, predictedBeforeMeasurement: out.predictedBeforeMeasurement || null };
  const mine = JSON.stringify(canonize(target));
  const rec = { canonicalization: PRE_REGISTERED.BW2.canonicalization,
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.CS6_DET_REF;
  if (refPath) {
    // 並行実行(2プロセス同時)に備えて、参照 JSON の生成を待てるようにする(既定 0 秒 = 待たない)。
    // 待ちは determinism の記録にしか関与せず、測定値には一切触れない。
    const waitSec = Number(process.env.CS6_DET_WAIT_SEC || 0);
    const deadline = Date.now() + waitSec * 1000;
    let other = null, tries = 0;
    while (true) {
      tries++;
      if (fs.existsSync(refPath)) {
        try {
          const j = JSON.parse(fs.readFileSync(refPath, 'utf8'));
          // 相手が「予測だけ書き出した途中段階」のファイルなら完了まで待つ
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

// ---- 前向き性の自己点検(予測ブロックが実測後に動いていないこと)----
if (out.predictedBeforeMeasurement) {
  const now = canonSha(out.predictedBeforeMeasurement);
  out.predictionIntegrity.sha256AtFinalWrite = now;
  out.predictionIntegrity.unchanged = (now === out.predictionIntegrity.sha256AtPredictionTime);
  out.predictionIntegrity.note = '予測ブロック(予測値・採点定義・掃引格子を含む)の正準化 SHA-256 を' +
    '「予測を書き出した時点」と「最終書き出し時点」で比較する。一致していれば、実測後に予測・採点定義・' +
    '格子のいずれも書き換えていないことの機械証拠になる';
}

// ---- BW まとめ(判定はここに集約 — 数値の実体は上のブロックにある)----
out.bw2 = {
  rule: PRE_REGISTERED.BW2,
  sha256: out.determinism.sha256, reference: out.determinism.reference,
  identical: out.determinism.identical,
  result: out.determinism.identical === null ? 'PENDING(参照なし)'
    : (out.determinism.identical ? 'PASS' : 'FAIL') };

out.meta.elapsedSec = (Date.now() - T_START) / 1000;

// ---- 実験マニフェスト(第145便様式)----------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell6', wave: 163,
    title: 'コア外殻第6実験 — 第158便 ZW2 が分離した 🐚 の2項振幅から立つ q₅₀ 予測の**前向き検証**' +
      '(事前登録窓 BW1 🐚 env×1/×2 の q₅₀ 予測と掃引実測の照合 / BW2 決定性 / ' +
      'BW3 旧式・1項アンカー式の併記とアンカー ±0.05 摂動の感度 — 記述)',
    command: 'node tests/exp-coreshell6.mjs(節選択 CS6_ONLY=… / 出力先 CS6_OUT=… / ' +
      '決定性参照 CS6_DET_REF=… / 煙試験 CS6_QUICK=1)' },
  presets: { mode: 'builtin', ids: ['nebulaShell'],
    modifiedAtRuntime: 'kFrame / kRep / 影響範囲指数 q / core.omega 倍率 Ω_c を第154便・第158便と同一の' +
      '改変器で上書きし、エンベロープ ring の rIn/rOut(半径倍率 envScale)と保持しきい値 keepR を' +
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
    window: { nebulaShell: 't=48(validT・第135便/第139便/第152便/第154便/第158便と同一窓)' },
    warmup: NOT_APPLICABLE,
    sweeps: { gridPerArm: Object.fromEntries(predArms.map(a => [a.armKey, a.sweepGrid])),
      gridDefinition: PRE_REGISTERED.sweepGridDefinition,
      nebulaArms: NEB_ARMS.map(a => ({ key: a.key, group: a.group, envScale: a.envScale, keepR: a.keepR })),
      nebulaProbeQs: NEB_PROBE_QS },
    gridUniformity: '**アームごとに異なる格子**である(事前登録が「pred 中心 ±0.5(アームごと)」を' +
      '指定しているため)。第154便・第158便のアーム共通格子とは設計が異なる — アーム間の Δq₅₀ を' +
      '直接比べる用途には使えない(本便の判定は各アーム単独の |実測−予測| なので影響しない)',
    q50FitGrid: Q50_GRID,
    solver: SOLVER,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセット nebulaShell の初期配置・質量・seed(第135便/第139便/第152便/第154便/第158便と' +
      '同一 — 本便で再フィットしない)',
      'dt=0.016', '窓(nebulaShell 3000步 = 第154便・第158便と同一)',
      '**第158便 ZW2 の分離振幅 A_b・A_c と核 x_b・x_c**(env×1/×2 — 本便の実測より前に確定していた。' +
      'coreshell5-results.json から機械読取。provenance.inputs に sha256)',
      '**アンカー = 第154便 🐚 env×1 の実測 q₅₀ 1点**(未知の Ω_crit を代数的に消去するための代入であり、' +
      '残差を最小化する自由度を一つも導入しない — したがって fit ではなく input に置く)',
      '予測式の関数形((T1)(T5′))と二分法ソルバ(第155便→第158便からの逐語転記。転記の正しさは ' +
      'checks.transcriptionReproducesWave158Separation / …Prediction が bit 一致で機械照合する)',
      'q₅₀ の採点定義(loss=1−keepFrac・ロジスティック当てはめ格子・INCONCLUSIVE 規則 = 第154便から' +
      '不変。掃引前に preRegistered.scoringDefinition へ宣言固定)',
      '掃引格子(アームごとに予測を中心とする21点・0.05 刻み — 予測と同時に固定し実測後に動かさない)',
      '事前登録窓 BW1 の許容 0.10(実測前に固定・実測後に動かさない)'],
    fit: [],
    derived: ['エンベロープ保持喪失率(q50.arms.*.table)',
      'ロジスティック中点 q₅₀ とプラトー A,B・遷移幅 w(q50 — 実測した保持喪失曲線の記述統計であり、' +
      '物理モデルの較正自由度ではない。当てはめは決定論的な閉形式+格子探索で、初期値・乱数を持たない)',
      '予測 q₅₀(2項複合・単一項・振幅込み単一項・旧式)と実測との |差|(predictedBeforeMeasurement・bw1)',
      'アンカー ±0.05 摂動・逆向きアンカーの予測(bw3 — 記述のみ・判定なし)',
      '対照の bit 一致(controls — 記述)', '決定性ハッシュ(determinism)',
      '第154便・第158便との共有点 bit 照合(crossWaveCheck — 記述)',
      '第158便の分離振幅・⚫ 予測値の転記照合(checks)'],
    holdOut: ['**🐚 env×2 の実測 q₅₀** — 予測の構成に一切使っていない(使うのは env×1 のアンカー1点と、' +
      '第158便が 1步プローブから解いた分離振幅のみ)。予測は掃引前に計算・書き出し済みで、' +
      'predictionIntegrity が事後改変のないことを機械照合する = **事前登録された hold-out** である',
      '**🐚 env×1 の実測 q₅₀** — 予測は恒等的にアンカー値になるので式の予測力の hold-out ではないが、' +
      '第154便の 11点格子の値が本便の 21点格子で再現するかという意味では hold-out である' +
      '(この読み分けは実測前に宣言済み — preRegistered.designPrinciples.anchorRecoveryIsNotPrediction)',
      '旧式 q*_eff=(3/2)(1+R/r) と遠方漸近の臨界指数 3/2(第135便・第139便の外部解析値。本便で' +
      '当てはめ直していない)',
      '第152便・第154便・第155便・第158便の実測/解析値(本便は読み取り専用の照合参照としてのみ使い、' +
      '書き換えない)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = 本便で' +
      '新しい較正自由度を一つも導入していない。第158便が 🐚 について「振幅を分離しただけで判定していない」' +
      'と限定した点を、本便は 🐚 の q 掃引実測で前向きに詰めている',
  },
  judgement: {
    pointers: ['preRegistered', 'limits', 'provenance.inputs', 'checks',
      'predictedBeforeMeasurement', 'predictionIntegrity', 'q50.summary',
      'bw1.verdict', 'bw1.comparisons', 'bw2', 'bw3',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、実測前に固定した予測・採点定義・掃引格子は ' +
      'predictedBeforeMeasurement(改変が無いことは predictionIntegrity)、エンジン実測は raw、' +
      'q₅₀ は q50、主窓の判定は bw1.verdict(アンカー構成を除いた読みは ' +
      'bw1.verdict.prospectiveArmsOnly)、決定性は bw2、記述は bw3 にある。' +
      'BW1 の外部解析値は第158便 ZW2 の分離振幅から立つ 2項複合予測で、その残差は ' +
      'bw1.comparisons[].absDiff である',
    externalReferences: ['第158便 ZW2 の 🐚 平均場2項分離 A_b・A_c(tests/out/coreshell5-results.json)',
      '第155便の予測式 (T1) Ω_drag(r;q₅₀)=Ω_crit ・(T5) 2項複合' +
      '(tests/out/coreshell-theory-results.json — 本便は 🐚 平均場版 (T5′) として用いる)',
      '第154便 🐚 env×1/×2 の実測 q₅₀(tests/out/coreshell4-results.json — アンカーおよび参考並置)',
      '(T3) 単一項アンカー式・(T4) 振幅寄与込み単一項(参考併記)',
      '旧式 実効臨界指数 q*_eff=(3/2)(1+R/r)(第139便 post-hoc → 第152便 XW2 → 第154便 YW1)',
      '遠方漸近の臨界指数 3/2(第135便が同定)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第154便/第158便との共有点 bit 一致**' +
        '(crossWaveCheck)・**第158便プローブの bit 再現**(checks.probeReproduction)・' +
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
if (out.q50.summary) {
  log('q₅₀(アームごとの事前固定格子): ' + Object.entries(out.q50.summary).map(([k, v]) =>
    `${k}=${fmt(v.q50, 4)}${v.result === 'OK' ? '' : '(' + v.result + ')'}`).join(' / '));
  log(`  格子が事前登録どおりか: ${out.q50.gridsAsPreRegistered}` +
    ` / 参考(第154便 11点格子): ` + Object.entries(out.q50.wave154Comparison || {})
      .map(([k, v]) => `${k}=${fmt(v.wave154Q50, 4)}`).join(' / '));
}
if (out.bw1.verdict) {
  log(`BW1 主窓(前向き 2項複合予測・許容 ${PRE_REGISTERED.BW1.tolerance})→ ${out.bw1.verdict.result}` +
    `(アンカー構成を除く読み: ${out.bw1.verdict.prospectiveArmsOnly.result})`);
  for (const c of out.bw1.comparisons)
    log(`   ${c.armKey.padEnd(6)}${c.isAnchorArm ? '[アンカー恒等]' : '[前向き]     '} 予測(2項複合)=${fmt(c.predictedQ50.twoTerm)} 実測=${fmt(c.measuredQ50)} ` +
      `|差|=${fmt(c.absDiff)} 格子内=${c.measuredWithinGrid} → ${c.result}` +
      (c.resultReason ? ` [${c.resultReason}]` : '') +
      `   [参考 |差| 単一項=${fmt(c.referenceAbsDiff.singleTerm)} 単一項+振幅=${fmt(c.referenceAbsDiff.singleTermAmplitude)} 基底核単一項=${fmt(c.referenceAbsDiff.singleTermBaseKernel)} 旧式=${fmt(c.referenceAbsDiff.legacy)}]`);
}
if (out.bw3.mirrorAnchoring)
  log(`BW3 逆向きアンカー(${out.bw3.mirrorAnchoring.anchorArmKey} 基準): ` +
    out.bw3.mirrorAnchoring.absDiffVsMeasured.map(e =>
      `${e.armKey} 予測=${fmt(e.twoTerm)} 実測=${fmt(e.measured)} |差|=${fmt(e.absDiff)}`).join(' / '));
if (out.bw3.anchorPerturbationSpread)
  log(`BW3 アンカー ±0.05 摂動の振れ幅: ` + Object.entries(out.bw3.anchorPerturbationSpread)
    .map(([k, v]) => `${k}=${v ? fmt(v.spread) : '—'}`).join(' / '));
log(`予測の不変性(前向き性の証跡): sha256 一致=${out.predictionIntegrity ? out.predictionIntegrity.unchanged : '—'}`);
log(`転記照合: 第158便分離振幅 ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}` +
  ` / 第158便⚫予測 ${out.checks.transcriptionReproducesWave158Prediction.nIdentical}/${out.checks.transcriptionReproducesWave158Prediction.nCompared}` +
  (out.checks.probeReproduction ? ` / プローブ再現 ${out.checks.probeReproduction.nIdentical}/${out.checks.probeReproduction.nCompared}` : ''));
log(`BW2 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical} → ${out.bw2.result}`);
log(`対照(記述)kF0×kRep0 allDynamicsIdentical=${out.controls.allDynamicsIdentical}`);
log(`共有格子点 bit 一致(記述)${out.crossWaveCheck.sharedSweepPoints.nIdentical}/${out.crossWaveCheck.sharedSweepPoints.nCompared}` +
  ` / 対照 ${out.crossWaveCheck.controls.nIdentical}/${out.crossWaveCheck.controls.nCompared}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();
